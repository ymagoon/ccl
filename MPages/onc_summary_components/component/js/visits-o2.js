/* globals
 TableGroup
 */

/**
 * Create the component style object which will be used to style various aspects of our component
 * @returns {undefined} - Returns nothing
 */
function VisitsOpt2ComponentStyle() {
	this.initByNamespace("vis2");
}
VisitsOpt2ComponentStyle.prototype = new ComponentStyle();
VisitsOpt2ComponentStyle.prototype.constructor = ComponentStyle;

/**
 * @constructor
 * Initialize the Visits Option 2 Component
 * @param {Criterion} criterion : The Criterion object contains information needed to render the component
 * @returns {undefined} - Returns nothing
 */
function VisitsOpt2Component(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new VisitsOpt2ComponentStyle());
	//Set the timers
	this.setComponentLoadTimerName("USR:MPG.VISITS.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.VISITS.O2 - render component");

	//Set scope to show all visits
	this.setScope(1);
	//Display the result count in the component header
	this.setIncludeLineNumber(true);

	//These will be set by Bedrock to determine the max # of future and previous visits to show
	this.m_futureMax = 0;
	this.m_previousMax = 0;
	this.m_encounterTypeCodes = null;

	//Variables for Healthe Intent(HI) data fetching
	this.m_HITestURI = "";
	this.m_HILookUpKey = "";
	this.m_aliasType = "";
	this.m_aliasPool = "";
	this.m_HIDataTable = "";
	this.m_HICurrentPage = 0;
	this.m_HIPageIndex = 0;
	this.m_isPagerAction = false;
	this.m_millDataInd = 1;
	this.m_HIDataBannerHtml = "";
	this.m_HIData = null;
	this.m_clickedRowData = null;
	this.m_currentRowSelected = "";
	this.m_isHIAction = null;
	this.m_totalCount = 0;
	this.m_tableContainer = "";
	this.m_visitsI18n = i18n.discernabu.visits_o2;
	this.m_criterion = this.getCriterion();

	this.m_rowClickedForFirstTime = true;
	this.m_sidePanelContainer = null;
	this.m_sidePanelMinHeight = 0;
	this.m_sidePanel = null;
	this.m_clickedRow = null;
	this.m_isSidePanelOpen = null;
	this.m_isHIRefDataValid = true;
	this.m_sidepanelPageNumber = 0;
	this.m_visitGroupId = "";
	this.m_sidePanelContent = "";
	this.m_lastVisitId = "";
	this.m_prevRefDetails = "";
	this.m_isViewMoreClicked = null;
	this.m_sidePanelPageIndex = 0;

};

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
VisitsOpt2Component.prototype = new MPageComponent();
VisitsOpt2Component.prototype.constructor = MPageComponent;

/**
 * Sets the max number of future visits to show within the component
 * @param {int} futureMax : An integer to set the max number of future visits to display.
 * @returns {undefined} - Returns nothing
 */
VisitsOpt2Component.prototype.setFutureMax = function(futureMax) {
	this.m_futureMax = futureMax;
};

/**
 * Retrieves the max number of future visits to show within the component
 * @return {int} An integer that represents the max number of future visits to display.
 */
VisitsOpt2Component.prototype.getFutureMax = function() {
	return this.m_futureMax;
};

/**
 * Sets the max number of previous visits to show within the component
 * @param {int} previousMax : An integer to set the max number of previous visits to display.
 * @returns {undefined} - Returns nothing
 */
VisitsOpt2Component.prototype.setPreviousMax = function(previousMax) {
	this.m_previousMax = previousMax;
};

/**
 * Retrieves the max number of previous visits to show within the component
 * @return {int} An integer that represents the max number of previous visits to display.
 */
VisitsOpt2Component.prototype.getPreviousMax = function() {
	return this.m_previousMax;
};

/**
 * Sets the array of code values in string format that represent encounter type codes.
 * It is expected that this is populated by a Bedrock filter.
 * @param {Array} values : An array of encounter type code values to determine what encounters are displayed.
 * @returns {undefined} - Returns nothing
 */
VisitsOpt2Component.prototype.setEncounterTypeCodes = function(values) {
	if (!(values instanceof Array)) {
		throw Error("Called setEncounterTypeCodes on VisitsOpt2 with non array type for values parameter.");
	}
	this.m_encounterTypeCodes = values;
};

/**
 * Retrieves the encounter type codes from the bedrock filter.  These encounter types will be displayed by the component.
 * @return {Array} An array of code values in string format that represent encounter types.
 */
VisitsOpt2Component.prototype.getEncounterTypeCodes = function() {
	if (!this.m_encounterTypeCodes) {
		return [];
	}
	return this.m_encounterTypeCodes;
};

/**
 * Defines the rules for sorting the visit JSON objects by the Date field
 * @param {Object} a : A JSON repsentation of a Visit Object
 * @param {Object} b : A JSON repsentation of a Visit Object
 * @return {int} An integer that represents the result of a comparison between object a's and object b's DATE field
 */
VisitsOpt2Component.prototype.ascendingVisitSorter = function(a, b) {
	var aDate = a.DATE;
	var bDate = b.DATE;
	if (aDate > bDate) {
		return 1;
	}
	else if (aDate < bDate) {
		return -1;
	}
	return 0;
};

/**
 * Defines the rules for sorting the visit JSON objects by the Date field
 * @param {Object} a : A JSON repsentation of a Visit Object
 * @param {Object} b : A JSON repsentation of a Visit Object
 * @return {int} An integer that represents the result of a comparison between object a's and object b's DATE field
 */
VisitsOpt2Component.prototype.descendingVisitSorter = function(a, b) {
	var aDate = a.DATE;
	var bDate = b.DATE;
	if (aDate > bDate) {
		return -1;
	}
	else if (aDate < bDate) {
		return 1;
	}
	return 0;
};

/**
 * Sets the multi factor authentication data
 */
VisitsOpt2Component.prototype.setMfaAuthStatus = function () {
	// MFA Auth API call
	var authStatus = new Mfa_Auth().RetrieveMfaAuthStatus();
	var authResourceAvailable = authStatus && authStatus.isResourceAvailable();
	var authStatusData = authResourceAvailable && authStatus.getResourceData();
	if (authStatusData) {
		// 0 - Authentication Success 5 - Authentication Not Required
		authStatusData.value = authStatusData.status === 0 || authStatusData.status === 5;
		this.mfaAuthStatus = authStatusData;
	}
	else { // If there was a failure with the mfa auth utility set a generic failure message
		this.mfaAuthStatus = { value: false, message: i18n.discernabu.mfa_auth.MFA_ERROR_MSG, status: 4 };
	}
};

/**
 *  Adds audit event data for multi factor authentication
 */
VisitsOpt2Component.prototype.addMfaAuditEvent = function () {
	// Add Audit Event for Multi-Factor Authentication
	var providerID = this.m_criterion.provider_id + '.0';
	var mpEventAudit = new MP_EventAudit();
	mpEventAudit.setAuditMode(0); // 0 - one-part audit mode
	mpEventAudit.setAuditEventName('MPD_VISITS_MFA_ATTEMPT');
	mpEventAudit.setAuditEventType('SECURITY');
	mpEventAudit.setAuditParticipantType('PERSON');
	mpEventAudit.setAuditParticipantRoleCd('PROVIDER');
	mpEventAudit.setAuditParticipantIDType('PROVIDER_NUMBER');
	mpEventAudit.setAuditParticipantID(providerID);
	var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE); 
	var dateTime = dateFormatter.format(new Date() , mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
	mpEventAudit.setAuditParticipantName('STATUS=' + this.mfaAuthStatus.status + ';DATE=' + dateTime);
	mpEventAudit.addAuditEvent();
	mpEventAudit.submit();
};

/**
 * The VisitsOpt2Component implementation of the preProcessing method.
 * @returns {undefined} - Returns nothing
 */
VisitsOpt2Component.prototype.preProcessing = function() {

	try {
		if (!this.isDisplayable()) {
			return;
		}
		//var criterion  = this.getCriterion();

		//Hide the '+' quick add icon, which seems to get added even when this is set in component definitions
		this.setPlusAddEnabled(false);

		// Get page level filters from shared resource
		var resourceName = this.m_criterion.category_mean + "pageLevelFilters";
		var pageLevelFilters = MP_Resources.getSharedResource(resourceName);
		var plFilters = pageLevelFilters.getResourceData();
		var plFiltersLen = plFilters.length;

		if (pageLevelFilters && pageLevelFilters.isResourceAvailable() && plFiltersLen > 0) {

			//At this point, the codes are already available, so get the data
			var plFilters = pageLevelFilters.getResourceData();
			var plFiltersLen = plFilters.length;
			for (var index = 0; index < plFiltersLen; index++) {
				var filterObj = plFilters[index];
				switch (filterObj.F_MN) {
					case "WF_HI_LOOKUP_KEY":
						this.setHILookupKey(filterObj.VALS[0].FTXT);
						break;
					case "WF_HI_ALIAS_TYPE":
						this.setAliasType(filterObj.VALS[0].FTXT);
						break;
					case "WF_HI_ALIAS_POOL_CD":
						this.setAliasPoolCd(filterObj.VALS[0].PE_ID);
						break;
				}
			}
		}

		if (this.getExternalDataInd()) {
		    this.setMfaAuthStatus();
		    this.addMfaAuditEvent();
		}
	}
	catch (err) {
		logger.logJSError(err.message);
	}
};

/**
 * Processes the JSON data so it can be easily consumed by the component-table.
 * The changes made to the passed in array persist outside of this function.
 * @param {Array} results : Results is an Array of JSON objects representing visits.
 * @returns {[results]} An array of JSON objects that have been processed for the component-table
 */
VisitsOpt2Component.prototype.processResultsForTable = function(results) {
	/* JSON Object format
	 * 		{
	 * 			 DATE : string
	 * 			 DESCRIPTION : string
	 * 			 LOCATION : string
	 * 			 TYPE : string
	 *			 ENCOUNTER_ID: interger
	 * 		}
	 */
	var dateTime = null;
	var dateTimeStr = "--";
	var arrLen = 0;
	var visitResult = null;
	var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	var curEncounterId = "0.0";
	curEncounterId = this.m_criterion.encntr_id ? this.m_criterion.encntr_id + ".0" : "0.0";  //This encounter will get filtered out.
	for (arrLen = results.length; arrLen--;) {
		visitResult = results[arrLen];
		//Grab just the date (exclude time)
		dateTime = new Date();
		if (visitResult.DATE) {
			dateTime.setISO8601(visitResult.DATE);
			dateTimeStr = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
		}
		//check to see if the encounter of the entry is the
		//same as the encounter currently being viewed at chart level
		if (results[arrLen].ENCOUNTER_ID + ".0" === curEncounterId) {
			visitResult.FORMATTED_DATE = dateTimeStr + ("<span class = 'vis2-currentlyViewing-text secondary-text'> (" + this.m_visitsI18n.CURRENTLY_VIEWING + ")</span>");
		}
		else {
			visitResult.FORMATTED_DATE = dateTimeStr;
		}
	}
};

/**
 * Creates the filterMappings that will be used when loading the component's bedrock settings
 * @returns {undefined} - Returns nothing
 */
VisitsOpt2Component.prototype.loadFilterMappings = function() {
	//Add filter mapping object for max previous visits
	this.addFilterMappingObject("WF_PREVIOUS_VISIT_MAX", {
		setFunction: this.setPreviousMax,
		type: "NUMBER",
		field: "FREETEXT_DESC"
	});

	//Add filter mapping object for max future visits
	this.addFilterMappingObject("WF_FUTURE_VISIT_MAX", {
		setFunction: this.setFutureMax,
		type: "NUMBER",
		field: "FREETEXT_DESC"
	});

	//Add filter mapping object for the array of code values representing encounter types to filter out
	this.addFilterMappingObject("WF_VISITS_ENCNTR_TYPE", {
		setFunction: this.setEncounterTypeCodes,
		type: "ARRAY",
		field: "PARENT_ENTITY_ID"
	});

	//Add filter mapping object for the external data indicator
	this.addFilterMappingObject("WF_VISIT_EXT_DATA_IND", {
		setFunction: this.setExternalDataInd,
		type: "BOOLEAN",
		field: "FREETEXT_DESC"
	});

	//Add filter mapping object for the test uri
	this.addFilterMappingObject("WF_VISIT_EXT_DATA_TEST_URI", {
		setFunction: this.setHITestUri,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
};

/**
 * This is the VisitsOpt2Component implementation of the retrieveComponentData function.
 * It creates the necessary parameter array for the data acquisition script call and calls XMLCclRequestWrapper.
 * @returns {undefined} - Returns nothing
 */
VisitsOpt2Component.prototype.retrieveComponentData = function() {
	var encntrs = "";
	var encntrOption = "";
	var request = null;
	var sendAr = null;
	var prsnlInfo = "";
	var encounterTypeCodes = "0.0";
	var encounterTypeFilter = "";
	var curEncounterId = "0.0";

	var prevSchAppt = 1;
	this.m_HITestURI = "";
	this.m_HILookUpKey = "";
	this.m_aliasType = this.getAliasType();
	this.m_aliasPool = this.getAliasPoolCd();

	//Handling Refresh Button click
	if (!this.m_isPagerAction) {
		this.m_millDataInd = 1;
		this.m_HIPageIndex = 0;
	}

	if (this.getExternalDataInd()) {

		if ($.trim(this.getHITestUri()).length > 0) {
			this.m_HITestURI = this.getHITestUri();
		}
		if ($.trim(this.getHILookupKey()).length > 0) {
			this.m_HILookUpKey = this.getHILookupKey();
		}
	}

	/**
	 * mp_get_visits_json script parameters:
	 * outdev, inputPersonID, inputPersonnelId, inputEncounterId, inputEncounterTypeCodeValues, inputEncounterIdToFilter
	 */
		//Create parameter array for script call
	prsnlInfo = this.m_criterion.getPersonnelInfo();
	encntrs = prsnlInfo.getViewableEncounters();
	encntrOption = encntrs ? "value(" + encntrs + ")" : "0.0";
	encounterTypeCodes = this.getEncounterTypeCodes();
	encounterTypeFilter = encounterTypeCodes ? MP_Util.CreateParamArray(encounterTypeCodes, 1) : "0.0"; //If values are defined, these encounter types will be shown

	sendAr = ["^MINE^", this.m_criterion.person_id + ".0", this.m_criterion.provider_id + ".0", encntrOption, encounterTypeFilter, curEncounterId, prevSchAppt, "^" + this.m_HILookUpKey + "^",
		"^" + this.getAliasType() + "^", this.getAliasPoolCd() + ".0", "^" + this.m_HITestURI + "^", this.m_HIPageIndex, this.m_millDataInd];

	var loadTimer = new RTMSTimer(this.getComponentLoadTimerName());
	var renderTimer = new RTMSTimer(this.getComponentRenderTimerName());
	var scriptRequest = new ComponentScriptRequest();
	scriptRequest.setProgramName("mp_get_visits_json");
	scriptRequest.setParameterArray(sendAr);
	scriptRequest.setComponent(this);
	scriptRequest.setLoadTimer(loadTimer);
	scriptRequest.setRenderTimer(renderTimer);
	scriptRequest.performRequest();
};

/**
 * This method creates an HTML for the HI Data Banner
 *
 * @return Html for the banner
 */
VisitsOpt2Component.prototype.createHIDataBanner = function() {

	var compId = this.getComponentId();
	var HIBannerHTML = "<span class='vis2-hi-data-icon'>&nbsp;</span>";
	HIBannerHTML += "<span class='vis2-hi-data-label' id='hiDataLabel" + compId + "'>" + this.m_visitsI18n.HI_DATA_BANNER_LABEL + "</span>";
	HIBannerHTML += "<span class='vis2-hi-data-view' id='hiDataButton" + compId + "'><button class='vis2-hi-data-button' id='hiDataButton" + compId + "'>" + this.m_visitsI18n.VIEW_OUTSIDE_RECORDS + "</button></span>";

	return HIBannerHTML;
};

/**
 * This method creates a short(Outside Records(unverified))HTML for the HI Data Banner
 * @param boolean if display as secondary text
 * @return Html for short hi data banner
 */
VisitsOpt2Component.prototype.createShortHIDataBanner = function(showAsSecondaryText) {

	var compId = this.getComponentId();
	var shortHIDataBannerHTML = "<span class='vis2-hi-data-icon'>&nbsp;</span>";
	if (!showAsSecondaryText) {
		shortHIDataBannerHTML += "<span class='vis2-hi-data-label' id='hiDataLabel" + compId + "'>" + this.m_visitsI18n.OUTSIDE_RECORDS_UNVERIFIED + "</span>";
	}
	else {
		shortHIDataBannerHTML += "<span class='vis2-hi-data-label secondary-text' id='hiDataLabel" + compId + "'>" + this.m_visitsI18n.OUTSIDE_RECORDS_UNVERIFIED + "</span>";
	}
	return shortHIDataBannerHTML;
};

/**
 * Event Handler function for View Outside Records Button
 */
VisitsOpt2Component.prototype.addViewHiDataEventHandler = function() {

	var self = this;
	var criterion = this.getCriterion();
	$("#hiDataButton" + this.getComponentId()).on("click", function() {
		var timer = new CapabilityTimer("CAP:MPG Display HealtheIntent Data", criterion.category_mean);
		if (timer) {
			timer.capture();
		}
		self.showHiData(self.m_HIData);
	});
};

/**
 * This method validates the response got back from the script call
 *
 *  @parameter scriptReply- The record data from script call
 */
VisitsOpt2Component.prototype.getValidatedHIResponse = function(scriptReply) {

	var self = this;
	var hiData;
	try {
		if (scriptReply.STATUS_DATA && scriptReply.STATUS_DATA.SUBEVENTSTATUS) {
			if (scriptReply.STATUS_DATA.SUBEVENTSTATUS[0].OPERATIONSTATUS === 'F') {
				throw new Error("HI retrieval failed because of OPERATIONSTATUS === F");
			}
			if (scriptReply.STATUS_DATA.SUBEVENTSTATUS[0].OPERATIONSTATUS === 'Z') {
				self.createNoPersonFoundBanner();
				hiData = "";
				return hiData;
			}
			hiData = JSON.parse(scriptReply.HTTPREPLY.BODY);
			if (scriptReply.STATUS_DATA.SUBEVENTSTATUS[0].OPERATIONSTATUS === 'S' && hiData.total_results === 0) {
				hiData = "";
				return hiData;
			}
		}
		else {
			throw new Error("HI retrieval failed because of OPERATIONSTATUS === F");
		}
	}
	catch (err) {
		logger.logJSError(err.message);
		$('#hiDataTable' + this.getComponentId()).html(MP_Util.HandleErrorResponse());
		$('#hiDataBanner' + this.getComponentId()).html(this.createShortHIDataBanner(false));
		hiData = "";
		return hiData;
	}
	return hiData;
};

/**
 * This method modifies existing banner and replaces with a short one.
 */
VisitsOpt2Component.prototype.createNoPersonFoundBanner = function() {

	var compId = this.getComponentId();
	var hiDataIcon = "<span class='vis2-hi-data-icon'>&nbsp;</span>";
	var hiDataBannerLabel = "<span class='vis2-hi-data-label' id='hiDataLabel" + compId + "'>" + this.m_visitsI18n.LOOKUP_FAILED + "</span>";
	var hiDataBannerHtml = hiDataIcon + hiDataBannerLabel;
	$('#hiDataBanner' + this.getComponentId()).html(hiDataBannerHtml);
	$("#hiDataBanner" + this.getComponentId()).addClass("vis2-hi-data-banner-color").removeClass("vis2-hi-data-banner-nocolor");
};

/**
 * This method modifies existing banner and replaces with a short one.
 */
VisitsOpt2Component.prototype.displaySuccessHiBanner = function() {

	$("#hiDataLabel" + this.getComponentId()).text(this.m_visitsI18n.OUTSIDE_RECORDS_UNVERIFIED);
	$("#hiDataButton" + this.getComponentId()).remove();
	$("#hiDataBanner" + this.getComponentId()).removeClass("vis2-hi-data-banner-color").addClass("vis2-hi-data-banner-nocolor");
};

/**
 * This method creates a comp.table and displays it
 *
 *  @parameter hiData- Validated HI Data
 */
VisitsOpt2Component.prototype.showHiData = function(hiData) {
	var pager = null;
	this.retreiveHiDataTable(hiData);

	if (!this.m_isPagerAction) {
		this.m_HIDataTable = new ComponentTable();
		this.m_HIDataTable.setNamespace("hiTable" + this.getComponentId());

		//Create the EndDate Column
		var endDateColumn = new TableColumn();
		endDateColumn.setColumnId("END_DATE");
		endDateColumn.setCustomClass("vis2-end-dt-hd");
		endDateColumn.setColumnDisplay(this.m_visitsI18n.END_DATE);
		endDateColumn.setIsSortable(false);
		endDateColumn.setRenderTemplate('${ END_DATE } ');

		//Create the VisitType Column
		var visitTypeColumn = new TableColumn();
		visitTypeColumn.setColumnId("VISIT_TYPE");
		visitTypeColumn.setCustomClass("vis2-hi-vistype-hd");
		visitTypeColumn.setColumnDisplay(this.m_visitsI18n.VISIT_TYPE);
		visitTypeColumn.setIsSortable(false);
		visitTypeColumn.setRenderTemplate('${ VISIT_TYPE } ');

		//Create the Facilty Column
		var faciltyColumn = new TableColumn();
		faciltyColumn.setColumnId("FACILITY");
		faciltyColumn.setCustomClass("vis2-hi-faclty-hd");
		faciltyColumn.setColumnDisplay(this.m_visitsI18n.FACILITY);
		faciltyColumn.setIsSortable(false);
		faciltyColumn.setRenderTemplate('${ FACILITY } ');

		//Create the Reason For Visit Column
		var reasonForVisitColumn = new TableColumn();
		reasonForVisitColumn.setColumnId("REASON_FOR_VISIT");
		reasonForVisitColumn.setCustomClass("vis2-hi-resfrvis-hd");
		reasonForVisitColumn.setColumnDisplay(this.m_visitsI18n.REASON_FOR_VISIT);
		reasonForVisitColumn.setIsSortable(false);
		reasonForVisitColumn.setRenderTemplate('${ REASON_FOR_VISIT } ');

		//Create the Provider Column
		var providerColumn = new TableColumn();
		providerColumn.setColumnId("PROVIDER");
		providerColumn.setCustomClass("vis2-hi-prov-hd");
		providerColumn.setColumnDisplay(this.m_visitsI18n.PROVIDER);
		providerColumn.setIsSortable(false);
		providerColumn.setRenderTemplate('${ PROVIDER } ');

		//Create the columns and add to the table
		this.m_HIDataTable.addColumn(endDateColumn);
		this.m_HIDataTable.addColumn(visitTypeColumn);
		this.m_HIDataTable.addColumn(faciltyColumn);
		this.m_HIDataTable.addColumn(reasonForVisitColumn);
		this.m_HIDataTable.addColumn(providerColumn);

		this.addCellClickExtensionHiData(this.m_HIDataTable);
		this.displaySuccessHiBanner();

		//Create the Pager
		pager = this.createHiPager(hiData);
		var hiDataTableHtml = this.m_HIDataTable.render();
	}

	//Remove spinner
	$("#hiDataTable" + this.getComponentId()).find('.loading-screen').remove();
	if (this.m_isHIAction) {
		this.m_sidePanel.m_cornerCloseButton.trigger('click');
	}

	//Bind the data to the results
	this.m_HIDataTable.bindData(hiData.derived_encounters);
	this.m_HIDataTable.refresh();

	if (!this.m_isPagerAction) {
		$("#hiDataTable" + this.getComponentId()).append(this.m_HIDataTable.render());
		if (pager) {
			$("#hiDataPager" + this.getComponentId()).html(pager.render());
			pager.attachEvents();
		}
	}

	this.m_HIDataTable.finalize();
	this.resizeComponent();

	if (this.m_isSidePanelOpen) {
		$("#vis2SidePanel" + this.getComponentId()).removeClass("vis2-side-panel-open-without-hi").addClass("vis2-side-panel-open-with-hi");
	}
	this.m_isPagerAction = false;
};


/**
 * Calls the architecture level resizeComponent function while adding some
 * component specific logic.
 *
 * @this {VisitsOpt2Component}
 * @return null
 */
VisitsOpt2Component.prototype.resizeComponent = function() {


	var calcHeight = "";
	var compHeight = 0;
	var compDOMObj = null;
	var container = null;
	var contentBodyHeight = 0;
	var contentBodyObj = null;
	var miscHeight = 20;
	var viewHeight = 0;

	//Enables a scroll of the component table if the data is greater that the height of the table on intial load.
	function enableTableOverflow(compDOMObj, container, contentBodyHeight, miscHeight){
		compDOMObj = null;
		container = null;
		contentBodyHeight = 0;
		miscHeight = 20;

		container = $("#vwpBody");
		if (!container.length) {
			return;
		}

		viewHeight = container.height();
		compDOMObj = $("#" + this.getStyles().getId());
		if (!compDOMObj.length) {
			return;
		}

		contentBodyObj = compDOMObj.find(".content-body");

		if (contentBodyObj.length) {
			// Get the overall component height
			compHeight = compDOMObj.height();

			// Get the height of the all the content-bodies
			contentBodyObj.each(function() {
				contentBodyHeight = contentBodyHeight + $(this).height();
			});

			// Calculate the estimated max height of the components content-body
			// elements
			calcHeight = (viewHeight - (compHeight - contentBodyHeight + miscHeight));
			this.calcDynamicSize(contentBodyObj, calcHeight);
		}
	}

	if (!this.getExternalDataInd()) {
		this.resizeComponentWhenOnlyMillData();
		enableTableOverflow.call(this, compDOMObj, container, contentBodyHeight, miscHeight);
		return;
	}

	enableTableOverflow.call(this, compDOMObj, container, contentBodyHeight, miscHeight);
	var hiTable = $("#hiDataTable" + this.getComponentId());
	var tableView = $("#vis2" + this.getComponentId() + "table");

	if (this.m_sidePanel) {

		this.m_sidePanel.resizePanel();
		var sidePanelMinHeight = 251;
		var minHeight = 0;

		if ((hiTable && hiTable.length) && (tableView && tableView.length)) {
			minHeight = Math.max(tableView.height() + hiTable.height() + 40, sidePanelMinHeight);
		}
		else {
			if (hiTable && hiTable.length) {
				minHeight = Math.max(hiTable.height(), sidePanelMinHeight);
			}
			else {
				minHeight = Math.max(tableView.height(), sidePanelMinHeight);
			}
		}
		this.m_sidePanel.setMinHeight(minHeight + "px");
	}

	//this.m_sidePanel.setHeight(this.m_sidePanel.getMaxHeight());

	// If the component has a component table, call the table's post-resize
	// function
	if (this.getComponentTable()) {
		this.getComponentTable().updateAfterResize();
	}

	// If the component has a external data table, call the table's
	// post-resize function
	if (this.m_HIDataTable) {
		this.m_HIDataTable.updateAfterResize();
	}
};

/*
 * This method takes care of resizing the component when there is only Millennium data.
 */
VisitsOpt2Component.prototype.resizeComponentWhenOnlyMillData = function() {

	//Call the base class functionality to resize the component
	//MPageComponent.prototype.resizeComponent.call(this, null);

	if (this.m_sidePanel) {

		this.m_sidePanel.resizePanel();

		// Set the minimum height of the side panel as height of table , when the table height is more than the defaults height of sidepanel.
		var $tableView = $("#vis2Tables" + this.getComponentId());

		if ($tableView && $tableView.length) {

			var sidePanelMinHeight = 251;
			var minHeight = Math.max($tableView.height(), sidePanelMinHeight);

			this.m_sidePanel.setMinHeight(minHeight + "px");
		}
	}
};

/**
 * This function will be used to calculate size by dynamically adjesting the
 * max-height of the variable size divs in the component
 *
 * @param {$Object}
 *            contentBodyObj consists DOM objects which has class
 *            content-body, its a jQuery Object
 * @param {number}
 *            viewHeight calculated viewable height
 * @return {undefined}
 */
VisitsOpt2Component.prototype.calcDynamicSize = function(contentBodyObj, viewHeight) {
	// if component has only one content-body div, all the calculated
	// viewable height will be given to that div
	if (contentBodyObj.length === 1) {
		contentBodyObj.css({"max-height": viewHeight, "overflow-y": "auto"});
		return;
	}
	// if component has multiple divs then first we calculate the equal
	// distribution from calculated viewable height
	var equalHeight = viewHeight / contentBodyObj.length;
	var smallDivs = [];
	var largeDivs = [];
	// div is called small div if its height is less than or equal to the
	// equal distribution else its a large div
	contentBodyObj.each(function() {
		var thisObj = $(this);
		thisObj.css("max-height", "");

		if (thisObj.height() <= equalHeight) {
			smallDivs.push(thisObj);
		}
		else {
			largeDivs.push(thisObj);
		}
	});

	// if small divs are present
	if (smallDivs.length) {
		// if only small divs are present, then distribute, calculated
		// viewable height equal with all the divs
		if (!largeDivs.length) {
			var smallDivsHeight = viewHeight / smallDivs.length;
			for (var i = 0; i < smallDivs.length; i++) {
				smallDivs[i].css({"max-height": smallDivsHeight, "overflow-y": "auto"});
			}
		}
		else {
			// if both small and large divs are present, assign small divs
			// there current height as max height and subtract that from
			// calculated viewable height
			for (var i = 0; i < smallDivs.length; i++) {
				var divHeight = smallDivs[i].height();
				smallDivs[i].css({"max-height": divHeight, "overflow-y": "auto"});
				viewHeight = viewHeight - divHeight;
			}

		}
	}

	// if large divs are present remaining calculated viewable height will
	// be distributed equal among the large divs
	if (largeDivs.length) {
		var largeDivHeight = viewHeight / largeDivs.length;
		for (var i = 0; i < largeDivs.length; i++) {
			largeDivs[i].css({"max-height": largeDivHeight, "overflow-y": "auto"});
		}
	}
};


/**
 * This method creates a pager if more results are available
 *
 *  @parameter {object} hiData- Validated HI Data
 *  @returns {MPageUI.Pager|null} The HI pager
 */
VisitsOpt2Component.prototype.createHiPager = function(hiData) {
	var self = this;
	var pager = null;
	if (hiData && hiData.more_results === true) {
		var totalHiPages = Math.ceil((hiData.total_results / 20));
		pager = new MPageUI.Pager();
		pager.setCurrentPageLabelPattern("${currentPage} / ${numberPages}")
			.setPreviousLabel(this.m_visitsI18n.PREV)
			.setNextLabel(this.m_visitsI18n.NEXT)
			.setNumberPages(totalHiPages)
			.setOnPageChangeCallback(function() {
				MP_Util.LoadSpinner('hiDataTable' + self.getComponentId());
				self.m_millDataInd = 0;
				self.m_isPagerAction = true;
				self.handlePagerClick(arguments[0].currentPage);
			});
		$("#hiDataPager" + this.getComponentId()).addClass("vis2-hi-data-pager");
	}
	return pager;
};

/**
 * This method handles pager click events
 *
 *  @parameter currentPage- Current page number returned by the pager API
 */
VisitsOpt2Component.prototype.handlePagerClick = function(currentPage) {

	if (this.m_HICurrentPage < currentPage) {
		this.m_HIPageIndex = this.m_HIPageIndex + 20;
		this.m_HICurrentPage = currentPage;
		this.retrieveComponentData();
	}
	else {
		this.m_HIPageIndex = this.m_HIPageIndex - 20;
		this.m_HICurrentPage = currentPage;
		this.retrieveComponentData();
	}
};

/**
 * This method processes the data to be entered in the HI comp. table
 *
 *   @parameter reply- Validated HI Data
 */
VisitsOpt2Component.prototype.processHiData = function(reply) {
    try {
        if (this.mfaAuthStatus && this.mfaAuthStatus.value === false) {
            this.displayMfaErrorBanner();
        }
        else {
            var hiData = this.getValidatedHIResponse(reply);
            this.m_HIData = hiData;

            //Add banner only if millennium data is also fetched
            if (this.m_millDataInd) {
                var hiDataBannerElem = $('#hiDataBanner' + this.getComponentId());
                if (hiData !== "") {
                    hiDataBannerElem.html(this.createHIDataBanner());
                    hiDataBannerElem.addClass("vis2-hi-data-banner-color");

                    //Add event action for view outside records button
                    this.addViewHiDataEventHandler();
                }
            }
            if (hiData && !this.m_millDataInd) {
                this.showHiData(hiData);
            }
        }
    }
    catch (err) {
        logger.logJSError(err.message);
    }
};

/**
 * Displays the MPage UI error banner when multifactor authentication has an error
 */
VisitsOpt2Component.prototype.displayMfaErrorBanner = function () {
	var mfaBannerElem = $('#mfaBanner' + this.getComponentId());
	// If user fails to authenticate (2) or cancels authentication(3)
	var alertType = this.mfaAuthStatus.status === 2 || this.mfaAuthStatus.status === 3 ? 
		MPageUI.ALERT_OPTIONS.TYPE.INFO : MPageUI.ALERT_OPTIONS.TYPE.ERROR;
	var alertBanner = new MPageUI.AlertBanner()
		.setType(alertType)
		.setPrimaryText(this.mfaAuthStatus.message)
		.setSecondaryText(this.m_visitsI18n.MFA_RESTRICTION);
	mfaBannerElem.html(alertBanner.render());
};

/**
 * This method modifies the script response to be entred
 *
 *   @parameter reply- Validated HI Data
 */
VisitsOpt2Component.prototype.retreiveHiDataTable = function(HIData) {

	var HIDerivedEncounters = HIData.derived_encounters;
	var dateTime;
	var dateTimeStr = "--";
	var df = MP_Util.GetDateFormatter();
	var hiDerivedEncArrLen = HIDerivedEncounters.length;
	var HISingleEncounter = null;

	for (var i = 0; i < hiDerivedEncArrLen; i++) {
		HISingleEncounter = HIDerivedEncounters[i];

		if (!HISingleEncounter.stop_date) {
			HISingleEncounter.END_DATE = "--";
		}
		else {
			dateTime = new Date();
			dateTime.setISO8601($.trim(HISingleEncounter.stop_date));
			dateTimeStr = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR);
			HISingleEncounter.END_DATE = dateTimeStr;
		}
		HISingleEncounter.VISIT_TYPE = (!HISingleEncounter.category.display) ? "--" : $.trim(HISingleEncounter.category.display);
		HISingleEncounter.FACILITY = (!HISingleEncounter.facility) ? "--" : $.trim(HISingleEncounter.facility);
		HISingleEncounter.REASON_FOR_VISIT = (!HISingleEncounter.reason_for_visit) ? "--" : $.trim(HISingleEncounter.reason_for_visit);
		HISingleEncounter.PROVIDER = (!HISingleEncounter.provider) ? "--" : $.trim(HISingleEncounter.provider);
	}
};

/*
 * * This is to add cellClickExtension for the component table.
 */
VisitsOpt2Component.prototype.addCellClickExtensionHiData = function(table) {

	var component = this;
	var cellClickExtension = new TableCellClickCallbackExtension();
	cellClickExtension.setCellClickCallback(function(event, data) {
		component.onRowClick(event, data, true);
	});
	table.addExtension(cellClickExtension);
};

/*
 * * This is to add cellClickExtension for the component table.
 */
VisitsOpt2Component.prototype.addCellClickExtension = function(table) {

	var component = this;
	var cellClickExtension = new TableCellClickCallbackExtension();
	cellClickExtension.setCellClickCallback(function(event, data) {
		component.onRowClick(event, data, false);
	});
	table.addExtension(cellClickExtension);
};

/*
 * * This is to add cellClickExtension for the component table.
 */
VisitsOpt2Component.prototype.getReferenceDetailsHtml = function(hiRefData) {

	var refDetailsArray = hiRefData.reference_details;
	var listLen = refDetailsArray.length;
	var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	var refDetailsListHtml = "";
	var compID = this.getComponentId();
	var refDetailHiddenInfohtml = "";

	//Html for separator line
	var refDetailSeparatorHtml = "<div class='sp-separator'></div>";

	for (var refIndex = 0; refIndex < listLen; ++refIndex) {

		var visitType = "--";
		if (refDetailsArray[refIndex].visit_type_code) {
			visitType = (!refDetailsArray[refIndex].visit_type_code.display) ? "--" : $.trim(refDetailsArray[refIndex].visit_type_code.display);
		}
		var visitTypeHtml = "<div>" + visitType + "</div>";
		visitTypeHtml = "<h3 class='vis2-expand-content' id='vis2RefDetHeader" + this.getComponentId() + "'><span class='vis2-toggle'>&nbsp;</span><span>" + visitType + "</span></h3>";

		var date = "--";
		if (refDetailsArray[refIndex].start_datetime && refDetailsArray[refIndex].stop_datetime) {

			var dateTime = new Date();
			dateTime.setISO8601($.trim(refDetailsArray[refIndex].start_datetime));
			var dateTimeTemp = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR);
			var dateStart = dateTimeTemp + " - ";
			dateTime.setISO8601($.trim(refDetailsArray[refIndex].stop_datetime));
			dateTimeTemp = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR);
			date = dateStart + dateTimeTemp;
		}
		var dateHtml = "<div class='vis2-sp-field secondary-text'>" + date + "</div>";

		var reasForVisit = "";
		var reasFrVisHtml = "";
		var resFrVisLen = refDetailsArray[refIndex].reasons_for_visit.length;
		if (refDetailsArray[refIndex].reasons_for_visit) {
			for (var resFrVisIndex = 0; resFrVisIndex < resFrVisLen; ++resFrVisIndex) {
				var singleResForVis = (!refDetailsArray[refIndex].reasons_for_visit[resFrVisIndex]) ? "--" : $.trim(refDetailsArray[refIndex].reasons_for_visit[resFrVisIndex]);
				if (resFrVisIndex + 1 !== resFrVisLen) {
					reasForVisit += singleResForVis + "; ";
				}
				else {
					reasForVisit += singleResForVis;
				}
			}
		}
		if (reasForVisit === "") {
			reasFrVisHtml = "<div class='vis2-sp-field secondary-text'>" + "--" + "</div>";
		}
		else {
			reasFrVisHtml = "<div class='vis2-sp-field secondary-text'>" + reasForVisit + "</div>";
		}

		refDetailHiddenInfohtml = this.getRefDetHiddenInforHtml(refDetailsArray[refIndex]);
		//Add separator for elements other than last one
		if (refIndex != listLen - 1) {
			refDetailsListHtml += "<div id =" + compID + "refDetItemRow" + refIndex + " class='vis2-rp-refdet-content closed'>" + visitTypeHtml + dateHtml + reasFrVisHtml + refDetailHiddenInfohtml + refDetailSeparatorHtml + "</div>";
		}
		else {
			refDetailsListHtml += "<div id =" + compID + "refDetItemRow" + refIndex + " class='vis2-rp-refdet-content closed'>" + visitTypeHtml + dateHtml + reasFrVisHtml + refDetailHiddenInfohtml + "</div>";
		}
	}
	// Html for entire reference details section.
	var refDetailHtml = "<div id='" + compID + "refDet' class='vis2-rp-refDet'>" + refDetailsListHtml + "</div>";

	return refDetailHtml;
};

/*
 * This method will be called if reference detail headers are clicked for a visit.
 * @param Data for side panel details
 * @return html for side panel content
 */
VisitsOpt2Component.prototype.getRefDetHiddenInforHtml = function(hiRefData) {

	try {

		var source = "--";
		if (hiRefData && hiRefData.source) {
			source = (!hiRefData.source.partition_description) ? "--" : $.trim(hiRefData.source.partition_description);
		}
		var sourceHtml = "<div class='vis2-sp-item'><div class='secondary-text'>" + this.m_visitsI18n.SOURCE + "</div><div>" + source + "</div></div>";

		var facilityString = "";
		var facilityHtml = "";

		if (hiRefData && hiRefData.facilities) {
			var facilities = hiRefData.facilities;
			var facilityArrLen = facilities.length;
			for (var indexFac = 0; indexFac < facilityArrLen; ++indexFac) {
				var singleFacilty = (!facilities[indexFac]) ? "--" : $.trim(facilities[indexFac]);
				if (indexFac + 1 !== facilityArrLen) {
					facilityString += singleFacilty + "; ";
				}
				else {
					facilityString += singleFacilty;
				}
			}
		}
		if (facilityString === "") {
			facilityHtml = "<div class='vis2-sp-item'><div class='secondary-text'>" + this.m_visitsI18n.FACILITY + "</div><div>" + "--" + "</div></div>";
		}
		else {
			facilityHtml = "<div class='vis2-sp-item'><div class='secondary-text'>" + this.m_visitsI18n.FACILITY + "</div><div>" + facilityString + "</div></div>";
		}

		var providerString = "";
		var providerHtml = "";
		if (hiRefData && hiRefData.providers) {
			var providers = hiRefData.providers;
			var providersArrLen = providers.length;
			for (var indexProv = 0; indexProv < providersArrLen; ++indexProv) {
				var singleProvider = (!providers[indexProv].name) ? "--" : $.trim(providers[indexProv].name);
				if (indexProv + 1 !== providersArrLen) {
					providerString += singleProvider + "; ";
				}
				else {
					providerString += singleProvider;
				}
			}
		}
		if (providerString === "") {
			providerHtml = "<div class='vis2-sp-item'><div class='secondary-text'>" + this.m_visitsI18n.PROVIDER + "</div><div>" + "--" + "</div></div>";
		}
		else {
			providerHtml = "<div class='vis2-sp-item'><div class='secondary-text'>" + this.m_visitsI18n.PROVIDER + "</div><div>" + providerString + "</div></div>";
		}

		var refDetHiddenInfoHtml = "<div class = 'vis2-sp-container'>" + sourceHtml + facilityHtml + providerHtml + "</div>";

		return refDetHiddenInfoHtml;
	}
	catch (err) {
		logger.logJSError(err, this, "visits.js", "getRefDetHiddenInforHtml");
	}
};

/*
 * This method will be called if reference detail headers are clicked for a visit.
 * @param the id on which the action needs to be handled.
 */
VisitsOpt2Component.prototype.addRefDetailClickEvents = function(idOfContainer) {
	var self = this;

	//Logic to remove or add the closed class depending on if it exists already
	$("#" + idOfContainer).on("click", ".vis2-rp-refdet-content", function(event) {
		if (event.target && event.target.parentElement.className === "vis2-expand-content") {
			$(this).toggleClass("closed");
		}
	});
};

/**
 * This function will serve as the click handler for the Label table delegate.
 *
 * @param {jQuery.Event}
 *                event - The DOM event that occurred.
 * @param {JSON}
 *                data - The data behind the DOM element as received from ComponentTable.
 */
VisitsOpt2Component.prototype.onRowClick = function(event, data, isHiAction) {
	var self = this;
	var sidePanelContId = "vis2SidePanel" + self.getComponentId();
	var compID = self.getComponentId();
	var sidePanelContent = "";
	this.m_clickedRowData = data;
	var sidePanelHTML = "";
	self.m_isHIAction = isHiAction;
	self.m_visitGroupId = data.RESULT_DATA.id;
	var df = MP_Util.GetDateFormatter();
	self.m_isViewMoreClicked = false;
	//var visitsI18n = i18n.discernabu.visits_o2;

	if (self.m_rowClickedForFirstTime) {
		self.initializeSidePanel(data);
		self.m_rowClickedForFirstTime = false;
	}

	try {
		if (event && event.currentTarget) {
			if (this.m_clickedRow && event.currentTarget.id === this.m_clickedRow) {
				return;
			}
		}

		this.m_clickedRow = event.currentTarget.id;
		var currentRowSelected = event.currentTarget.parentNode;
		this.m_currentRowSelected = currentRowSelected;

		if (!isHiAction) {
			//get millennium side panel content
			self.m_lastVisitId = "";
			sidePanelContent = this.getMillSidePanelContent(data);
		}
		else {
			if (this.m_isSidePanelOpen) {
				MP_Util.LoadSpinner("sidePanel" + compID);
			}
			else {
				MP_Util.LoadSpinner("vis2MainContainer" + compID);
			}
			this.getHiRefDetails(data.RESULT_DATA.id, currentRowSelected);
		}

		if (!this.m_isHIAction) {
			$("#sidePanel" + self.getComponentId()).find('.loading-screen').remove();
			$("#vis2MainContainer" + self.getComponentId()).find('.loading-screen').remove();
			sidePanelHTML = "<div id='sidePanelScrollContainer" + compID + "' class='vis2-sidepanel-container'>" + sidePanelContent + "</div>";
			if (!self.m_isSidePanelOpen) {
				self.removeColumns();
			}
			this.m_sidePanelContent = sidePanelContent;
			this.highlightSelectedRow(currentRowSelected);
			this.m_sidePanel.setContents(sidePanelHTML, "vis2Content" + compID);
			this.m_sidePanel.setTitleText((!data.RESULT_DATA.TYPE ? "--" : data.RESULT_DATA.TYPE));

			//Formatting Date to "MM/DD/YYYY" HH:MM format
			var dateTimeStr = "--";
			if (data && data.RESULT_DATA) {
				var dateTime = new Date();
				if (data.RESULT_DATA.DATE) {
					dateTime.setISO8601(data.RESULT_DATA.DATE);
					dateTimeStr = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
				}
				if (data.RESULT_DATA.FORMATTED_DATE && data.RESULT_DATA.ENCOUNTER_ID) {
					var criterion = this.getCriterion();
					var curEncounterId = criterion.encntr_id ? criterion.encntr_id : "0";  //This encounter will get filtered out.
					if (curEncounterId === data.RESULT_DATA.ENCOUNTER_ID) {
						dateTimeStr += " (" + this.m_visitsI18n.CURRENTLY_VIEWING + ")";
					}
				}
			}
			this.m_sidePanel.setSubtitleText(dateTimeStr);
			if (!this.m_HIDataTable) {
				$("#vis2SidePanel" + this.getComponentId()).removeClass("vis2-side-panel-open-with-hi").addClass("vis2-side-panel-open-without-hi");
			}
			this.changeButtonVisibility(false);
			this.resizeComponent();
			this.m_isSidePanelOpen = true;
		}
	}
	catch (err) {
		logger.logJSError(err, this, "visits.js", "onRowClick");
	}
};

/*
 * This method will be called to remove columns if side panel is not open
 */
VisitsOpt2Component.prototype.removeColumns = function() {

	var sidePanelContId = "vis2SidePanel" + this.getComponentId();
	//Removing last 2 columns from Millennium and HI Table
	$("#vis2Tables" + this.getComponentId()).addClass("vis2-sp-hide-col");
	$("#vis2Tables" + this.getComponentId()).removeClass("vis2-tables-expanded").addClass("vis2-tables-collapsed");
	$("#" + sidePanelContId).removeClass("vis2-side-panel-closed").addClass("vis2-side-panel-open-with-hi");
};

/**
 * This method will be called only one time, after finalizing the component. This method will initialize the side panel by adding the
 * place holders for the group name and table
 * holding the results of selected row.
 */
VisitsOpt2Component.prototype.initializeSidePanel = function(data) {

	var self = this;
	var compID = self.getComponentId();
	var sidePanelContId = "vis2SidePanel" + compID;
	this.m_sidePanelContainer = $("#" + sidePanelContId);
	this.m_sidePanelMinHeight = "175px";
	var maxViewHeight = ($("#vwpBody").height() - windowPadding) + "px";
	var windowPadding = 70;

	if (this.m_HIDataTable) {
		this.m_tableContainer = $("#vis2Tables" + compID);
	}
	else {
		this.m_tableContainer = $("#vis2" + compID + "table");
	}

	// Create the side panel
	this.m_sidePanel = new CompSidePanel(compID, sidePanelContId);
	this.m_sidePanel.setMinHeight(this.m_sidePanelMinHeight);
	this.m_sidePanel.setExpandOption(this.m_sidePanel.expandOption.EXPAND_DOWN);
	this.m_sidePanel.setMaxHeight(maxViewHeight);
	this.m_sidePanel.renderPreBuiltSidePanel();
	this.m_sidePanel.showCornerCloseButton();
	this.m_sidePanel.setCornerCloseFunction(function() {
		$("#vis2Tables" + self.getComponentId()).removeClass("vis2-sp-hide-col");
		$("#vis2Tables" + self.getComponentId()).addClass("vis2-tables-expanded").removeClass("vis2-tables-collapsed");
		$("#" + sidePanelContId).addClass("vis2-side-panel-closed").removeClass("vis2-side-panel-open-without-hi");
		self.highlightSelectedRow(false);
		self.m_clickedRow = null;
		self.m_rowClickedForFirstTime = true;
		self.m_isSidePanelOpen = false;
	});

};

/**
 * This method will be called on each row selection to update the background color of selected row and font color to indicate that
 * this is the currently selected row
 *
 * @param {element}
 *                selRowObj - The current row label element that was selected
 * @param {boolean}
 *                isInitialLoad - A flag to indicate whether it is initial load
 */
VisitsOpt2Component.prototype.highlightSelectedRow = function(selRowObj) {

	var compID = this.getComponentId();
	var rowID = "";

	if (selRowObj) {
		var rowParts = selRowObj.id.split(":");
		for (var i = 0; i < rowParts.length; i++) {
			rowID += rowParts[i];
			// If not the last part, add an escaped colon
			if ((i + 1) !== rowParts.length) {
				rowID += "\\:";
			}
		}
	}

	var tableViewObj = $("#vis2" + compID + "table");
	var prevRow = tableViewObj.find(".selected");

	if (!prevRow.length) {
		tableViewObj = $("#hiDataTable" + compID);
		prevRow = tableViewObj.find(".selected");
	}

	// Remove the background color of previous selected row.
	if (prevRow.length) {
		if (prevRow.hasClass("vis2-row-selected selected")) {
			prevRow.removeClass("vis2-row-selected selected");
		}
	}

	// Change the background color to indicate that its selected.
	$("#" + rowID).addClass("vis2-row-selected");
	$("#" + rowID).addClass("selected");
};

/**
 * This method returns HTML for HI side panel content
 *
 *   @parameter reply- Validated HI Data
 */
VisitsOpt2Component.prototype.getHiSidePanelSubHeader = function(data) {

	//var visitsI18n = i18n.discernabu.visits_o2;
	var sidePanelSubDetails = "";
	var sourceHtml = "<div class='vis2-sp-source-hd'>" + this.createShortHIDataBanner(true) + "</div>";
	var providerHtml = "<div class='vis2-sp-item'><div class='secondary-text'>" + this.m_visitsI18n.PROVIDER + "</div><div>" + ((!data.RESULT_DATA.PROVIDER) ? "--" : data.RESULT_DATA.PROVIDER) + "</div></div>";
	var locationHtml = "<div class='vis2-sp-item'><div class='secondary-text'>" + this.m_visitsI18n.FACILITY + "</div><div>" + ((!data.RESULT_DATA.FACILITY) ? "--" : data.RESULT_DATA.FACILITY) + "</div></div>";
	var reasForVisHtml = "<div class='vis2-sp-item'><div class='secondary-text'>" + this.m_visitsI18n.REASON_FOR_VISIT + "</div><div>" + ((!data.RESULT_DATA.REASON_FOR_VISIT) ? "--" : data.RESULT_DATA.REASON_FOR_VISIT) + "</div></div>";

	//Html for separator line
	var refDetailSeparatorHtml = "<div class='sp-separator'></div>";

	sidePanelSubDetails = "<div>" + sourceHtml + providerHtml + locationHtml + reasForVisHtml + refDetailSeparatorHtml + "</div>";

	return sidePanelSubDetails;
};

/**
 * This method make a script call to get refrence details of the clicked hi table row
 *
 *   @parameter reply- Validated HI Data
 */
VisitsOpt2Component.prototype.callRefDetailService = function(data, currentRowSelected) {

	var criterion = null;
	var encntrs = "";
	var encntrOption = "";
	var request = null;
	var self = this;
	var sendAr = null;
	var prsnlInfo = "";
	var encounterTypeCodes = "0.0";
	var encounterTypeFilter = "";
	var curEncounterId = "0.0";

	self.m_HITestURI = "";
	self.m_HILookUpKey = "";
	self.m_aliasType = self.getAliasType();
	self.m_aliasPool = self.getAliasPoolCd();

	if ($.trim(self.getHITestUri()).length > 0) {
		self.m_HITestURI = self.getHITestUri();
	}
	if ($.trim(self.getHILookupKey()).length > 0) {
		self.m_HILookUpKey = self.getHILookupKey();
	}

	/**
	 * mp_get_hi_visits_details script parameters:
	 */
		//Create parameter array for script call
	criterion = this.getCriterion();
	prsnlInfo = criterion.getPersonnelInfo();
	sendAr = ["^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", "^" + this.m_HILookUpKey + "^",
		"^" + this.m_aliasType + "^", this.m_aliasPool + ".0", "^" + this.m_HITestURI + "^", this.m_sidePanelPageIndex, "^" + data + "^"];

	var loadTimer = new RTMSTimer(this.getComponentLoadTimerName());
	var renderTimer = new RTMSTimer(this.getComponentRenderTimerName());
	var scriptRequest = new ComponentScriptRequest();
	scriptRequest.setProgramName("mp_get_hi_visits_details");
	scriptRequest.setParameterArray(sendAr);
	scriptRequest.setComponent(this);
	scriptRequest.setLoadTimer(loadTimer);
	scriptRequest.setRenderTimer(renderTimer);
	scriptRequest.setResponseHandler(function(scriptReply) {
		self.handleRefDetailResponse(scriptReply, currentRowSelected);
	});

	if (this.m_currentRowSelected === currentRowSelected) {
		scriptRequest.performRequest();
	}
	else {
		return;
	}
};

/**
 * This method validates and returns the validated reference details
 *
 *   @parameter hiData- Validated HI Data
 */
VisitsOpt2Component.prototype.getValidatedRefDetailsResponse = function(scriptReply) {

	try {
		var hiData;
		if (!scriptReply) {
			throw new Error("HI Refrence Detail not fetched");
		}
		var self = this;
		//var visitsI18n = i18n.discernabu.visits_o2;

		if (scriptReply.m_status !== 'S') {
			throw new Error("HI retrieval failed because of OPERATIONSTATUS === F");
		}

		if (scriptReply.m_responseData) {
			hiData = JSON.parse(scriptReply.m_responseData.HTTPREPLY.BODY);
			if (scriptReply.m_status === 'S' && hiData.total_results === 0) {
				hiData = "";
				this.m_isHIRefDataValid = true;
				return hiData;
			}
		}
		else {
			throw new Error("HI retrieval failed because of OPERATIONSTATUS === F");
		}
	}
	catch (err) {
		logger.logJSError(err.message);
		this.m_isHIRefDataValid = false;
		return;
	}
	this.m_isHIRefDataValid = true;
	return hiData;
};

/**
 * This method handles the script response for reference details
 *
 *   @parameter reply- Validated HI Data
 */
VisitsOpt2Component.prototype.handleRefDetailResponse = function(reply, currentRowSelected) {
	try {
		if (this.m_currentRowSelected === currentRowSelected) {

			var self = this;
			//var visitsI18n = i18n.discernabu.visits_o2;
			var hiRefData = self.getValidatedRefDetailsResponse(reply);
			self.m_HIRefData = hiRefData;
			var compID = self.getComponentId();
			var sidePanelContId = "vis2SidePanel" + self.getComponentId();
			var sidePanelContent = "";
			var sidePanelHTML = "";
			var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);

			//Html for separator line
			var refDetailSeparatorHtml = "<div class='sp-separator'></div>";

			$("#sidePanel" + self.getComponentId()).find('.loading-screen').remove();
			$("#vis2MainContainer" + self.getComponentId()).find('.loading-screen').remove();

			if (self.m_isViewMoreClicked) {
				self.appendRefDetails(hiRefData);
				self.addViewMoreEventHandler();
				return;
			}

			if (self.m_isHIRefDataValid) {
				if (hiRefData) {
					sidePanelContent = self.getReferenceDetailsHtml(hiRefData);
				}
				else {
					sidePanelContent = "<span class='res-none'>No results found</span>";
				}
			}
			else {
				sidePanelContent = MP_Util.HandleErrorResponse();
			}

			self.m_lastVisitId = this.m_clickedRowData.RESULT_DATA.id;
			self.m_prevRefDetails = sidePanelContent;
			var sidePanelSubDetails = self.getHiSidePanelSubHeader(self.m_clickedRowData);
			sidePanelHTML = "<div id='sidePanelScrollContainer" + compID + "' class='sp-body-content-area'>" + sidePanelSubDetails + sidePanelContent + "</div>";
			self.m_sidePanel.setTitleText(self.m_clickedRowData.RESULT_DATA.VISIT_TYPE);
			if (!self.m_isSidePanelOpen) {
				self.removeColumns();
			}
			//Logic to add View More Button
			if (hiRefData && hiRefData.more_results) {
				self.m_sidePanel.setActionsAsHTML("<div id = 'vis2ViewMore" + compID + "'class='sp-button2'>" + this.m_visitsI18n.VIEW_MORE + "</div>");
			}
			else {
				self.changeButtonVisibility(false);
			}
			//Formatting Date to "MM/DD/YYYY" format
			var dateTimeStart = "--";
			var dateTimeStop = "--";
			if (self.m_clickedRowData && self.m_clickedRowData.RESULT_DATA) {
				var dateTime = new Date();
				if (self.m_clickedRowData.RESULT_DATA.start_date) {
					dateTime.setISO8601(self.m_clickedRowData.RESULT_DATA.start_date);
					dateTimeStart = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
				}
				if (self.m_clickedRowData.RESULT_DATA.stop_date) {
					dateTime.setISO8601(self.m_clickedRowData.RESULT_DATA.stop_date);
					dateTimeStop = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
				}
			}
			var subTitleText = dateTimeStart + " - " + dateTimeStop;
			self.m_sidePanelContainer = $("#" + sidePanelContId);
			self.m_sidePanel.setSubtitleText(subTitleText);
			self.m_sidePanel.setContents(sidePanelHTML, "vis2Content" + self.getComponentId());
			self.resizeComponent();
			self.m_sidePanel.showPanel();
			self.m_isSidePanelOpen = true;
			self.highlightSelectedRow(currentRowSelected);
			self.addRefDetailClickEvents(self.getComponentId() + "refDet");

			self.addViewMoreEventHandler();
		}
	}
	catch (err) {
		logger.logJSError(err.message);
	}
};


/**
 * Event Handler function for View More Button
 */
VisitsOpt2Component.prototype.addViewMoreEventHandler = function() {

	var self = this;

	$("#vis2ViewMore" + this.getComponentId()).on("click", function() {
		MP_Util.LoadSpinner("sidePanel" + self.getComponentId());
		self.m_isViewMoreClicked = true;
		self.m_sidePanelPageIndex += 20;
		self.callRefDetailService(self.m_visitGroupId, self.m_currentRowSelected);
	});
};


/**
 * Event Handler function for View More Button
 */
VisitsOpt2Component.prototype.appendRefDetails = function(hiRefData) {

	var refDetailHtml = "";
	var self = this;
	var visitsI18n = i18n.discernabu.visits_o2;

	//Html for separator line
	var refDetailSeparatorHtml = "<div class='sp-separator'></div>";
	if (self.m_isHIRefDataValid) {
		refDetailHtml = this.getReferenceDetailsHtml(hiRefData);

	}
	else {
		refDetailHtml = MP_Util.HandleErrorResponse();
	}

	$("#" + self.getComponentId() + "refDet").append(refDetailSeparatorHtml + refDetailHtml);

	//Logic to add View More Button
	if (hiRefData && hiRefData.more_results) {
		self.m_sidePanel.setActionsAsHTML("<div id = 'vis2ViewMore" + self.getComponentId() + "'class='sp-button2'>" + visitsI18n.VIEW_MORE + "</div>");
	}
	else {
		self.changeButtonVisibility(false);
	}
	self.resizeComponent();
};
/**
 * Event Handler function for View More Button
 */
VisitsOpt2Component.prototype.changeButtonVisibility = function(makeVisible) {

	var self = this;
	var buttonVisivle = $("#vis2ViewMore" + self.getComponentId());

	if (makeVisible) {
		buttonVisivle.removeClass('vis2-hi-ext-btn-inv');
		buttonVisivle.addClass('vis2-hi-ext-btn-right');
	}
	else {
		buttonVisivle.removeClass('vis2-hi-ext-btn-right');
		buttonVisivle.addClass('vis2-hi-ext-btn-inv');
	}
};

/**
 * This method returns HTML for HI side panel content of refrence details
 *
 *   @parameter reply- Validated HI Data
 */
VisitsOpt2Component.prototype.getHiRefDetails = function(data, currentRowSelected) {

	if (data && this.m_currentRowSelected === currentRowSelected) {
		this.callRefDetailService(data, currentRowSelected);
	}
};

/**
 * This method returns HTML for Millennium side panel content
 *
 *   @parameter reply- Validated HI Data
 */
VisitsOpt2Component.prototype.getMillSidePanelContent = function(data) {

	//var visitsI18n = i18n.discernabu.visits_o2;
	var locationHtml = "<div class='vis2-sp-item'><div class='secondary-text'>" + this.m_visitsI18n.LOCATION + "</div><div>" + ((!data.RESULT_DATA.LOCATION) ? "--" : data.RESULT_DATA.LOCATION) + "</div></div>";
	var reasonForVisitValue = ((!data.RESULT_DATA.DESCRIPTION) ? "--" : data.RESULT_DATA.DESCRIPTION);
	var reasonForVisHtml = "<div class='vis2-sp-item'><div class='secondary-text'>" + this.m_visitsI18n.REASON_FOR_VISIT + "</div><div>" + reasonForVisitValue + "</div></div>";

	return locationHtml + reasonForVisHtml;
};
/**
 * Defines the function is used to seperate visits into previous/future and todays visits.
 * Given a subsection, the appointments with today's date will be seperated from the subsection.
 * @param {Object} subsection : Array of JSON objects containing visits dated with today's date
 * @param {Object} filteredArray : Empty array to be able push JSON objects not dated with today's date.
 * @param {Object} todayArray : Array used to hold the JSON object dated with today's date
 * @return @returns {undefined} : Returns nothing
 */

VisitsOpt2Component.prototype.seperateTodayDate = function(subsection, filteredArray, todayArray) {
	var visitsDateFormat;
	var visitsDate = new Date();
	var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	var todaysDateFormat = df.format(visitsDate, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR);
	var subsectionLength = subsection.length;
	for (var i = 0; i < subsectionLength; i++) {
		visitsDate.setISO8601(subsection[i].DATE);
		visitsDateFormat = df.format(visitsDate, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR);
		if (todaysDateFormat === visitsDateFormat) {
			todayArray.push(subsection[i]);
		}
		else {
			filteredArray.push(subsection[i]);
		}
	}
};

/**
 * This is the VisitsOpt2Component implementation of the renderComponent function.  It takes the information retrieved from the script
 * call and renders the component's visuals.  There is no check on the status of the script call's reply since that is handled in the
 * call to XMLCCLRequestWrapper.
 * @param {MP_Core.ScriptReply} reply - The ScriptReply object returned by the script called by retrieveComponentData.
 * @returns {undefined} - Returns nothing
 */
VisitsOpt2Component.prototype.renderComponent = function(reply) {

	try {
		if (this.m_millDataInd) {
			var compId = this.getComponentId();
			var countText = "";
			var todayVisitCnt = 0;
			var arrTodayVisits = [];
			var prevVisitCnt = 0;
			var prevMax = 0;
			var arrPrevVisits = [];
			var futureVisitCnt = 0;
			var futureMax = 0;
			var arrFutureVisits = [];
			var futureIndex = 0;
			var totalResults = null;
			var visitsTable = null;
			var x = 0;
			var totalCount = 0;
			var prevVisitHdr = "";
			var todayVisitHdr = "";
			var futureVisitHdr = "";
			var millTableHtml = "";
			var self = this;
			self.m_rowClickedForFirstTime = true;
			self.m_isSidePanelOpen = false;
			self.m_clickedRow = null;
			self.m_HIDataTable = null;

			prevVisitCnt = reply.VISIT_CNT;
			prevMax = parseInt(this.getPreviousMax(), 10);
			futureVisitCnt = reply.FUTURE_VISIT_CNT;
			futureMax = parseInt(this.getFutureMax(), 10);

			//Checking if any results were returned.  Using this method so Visits o1 doesn't break.
			if (reply.VISIT_CNT !== 0 || reply.FUTURE_VISIT_CNT !== 0) {

				//Move dates with the current date from the visits to the today and previous subsection.
				self.seperateTodayDate(reply.VISIT, arrPrevVisits, arrTodayVisits);

				//Move dates with the current date from the future visits to the today and future subsection.
				self.seperateTodayDate(reply.FUTURE_VISIT, arrFutureVisits, arrTodayVisits);

				//Sorting future visits in ascending order
				arrFutureVisits.sort(this.ascendingVisitSorter);

				//Sorting previous visits in descending order
				arrPrevVisits.sort(this.descendingVisitSorter);

				//Sorting today visits in ascending order
				arrTodayVisits.sort(this.ascendingVisitSorter);

				prevVisitCnt = arrPrevVisits.length;
				todayVisitCnt = arrTodayVisits.length;
				futureVisitCnt = arrFutureVisits.length;

				//If bedrock settings are defined, then they will define the max counts.
				//Otherwise, show all visits
				if (prevMax && prevMax < prevVisitCnt) {
					prevVisitCnt = prevMax;

					//Remove entries from previous visits subsection to follow the bedrock max count setting.
					arrPrevVisits.splice(prevMax, arrPrevVisits.length);
				}
				if (futureMax && futureMax < futureVisitCnt) {
					futureVisitCnt = futureMax;

					//Remove entries from previous visits subsection to follow the bedrock max count setting.
					arrFutureVisits.splice(futureMax, arrFutureVisits.length);
				}

				totalCount = todayVisitCnt + prevVisitCnt + futureVisitCnt;
				this.m_totalCount = totalCount;

				//Process the Visit Groups for the component table
				this.processResultsForTable(arrTodayVisits);
				this.processResultsForTable(arrPrevVisits);
				this.processResultsForTable(arrFutureVisits);

				//Creates the component-table if it hasn't been created already
				visitsTable = new ComponentTable();
				visitsTable.setNamespace(this.getStyles().getId());

				//Create the Date Column
				var dateColumn = new TableColumn();
				dateColumn.setColumnId("DATE");
				dateColumn.setColumnDisplay(this.m_visitsI18n.DATE);
				dateColumn.setCustomClass("vis2-dt-hd");
				dateColumn.setIsSortable(false);
				dateColumn.setRenderTemplate("${ FORMATTED_DATE }");

				//Create the Type Column
				var typeColumn = new TableColumn();
				typeColumn.setColumnId("TYPE");
				typeColumn.setColumnDisplay(this.m_visitsI18n.TYPE);
				typeColumn.setCustomClass("vis2-type-hd");
				typeColumn.setIsSortable(false);
				typeColumn.setRenderTemplate("${ TYPE }");

				//Create the Location Column
				var locColumn = new TableColumn();
				locColumn.setColumnId("LOCATION");
				locColumn.setColumnDisplay(this.m_visitsI18n.LOCATION);
				locColumn.setCustomClass("vis2-loc-hd");
				locColumn.setIsSortable(false);
				locColumn.setRenderTemplate("${ LOCATION }");

				//Create the 'Reason for Visit' Column
				var descColumn = new TableColumn();
				descColumn.setColumnId("DESC");
				descColumn.setColumnDisplay(this.m_visitsI18n.REASON_FOR_VISIT);
				descColumn.setCustomClass("vis2-desc-hd");
				descColumn.setIsSortable(false);
				descColumn.setRenderTemplate("${ DESCRIPTION }");

				visitsTable.addColumn(dateColumn);
				visitsTable.addColumn(typeColumn);
				visitsTable.addColumn(locColumn);
				visitsTable.addColumn(descColumn);

				//Create 'Today' section - Don't display if there are no results
				if (arrTodayVisits.length > 0) {
					var todayVisitGrp = new TableGroup();
					todayVisitHdr = this.m_visitsI18n.TODAY + " (" + arrTodayVisits.length + ")";
					todayVisitGrp.setDisplay(todayVisitHdr).setGroupId("TODAY_VISIT").setShowCount(false);
					todayVisitGrp.bindData(arrTodayVisits);
					visitsTable.addGroup(todayVisitGrp);
				}

				//Create 'Future' section - Don't display if there are no results
				if (arrFutureVisits.length > 0) {
					var futureVisitGrp = new TableGroup();
					futureVisitHdr = this.m_visitsI18n.FUTURE + " (" + arrFutureVisits.length + ")";
					futureVisitHdr = futureMax ? futureVisitHdr + " - " + this.m_visitsI18n.NEXT_N_VISITS.replace("{0}", futureMax) : futureVisitHdr;
					futureVisitGrp.setDisplay(futureVisitHdr).setGroupId("FUTURE_VISIT").setShowCount(false);
					futureVisitGrp.bindData(arrFutureVisits);
					visitsTable.addGroup(futureVisitGrp);
				}

				//Create 'Previous' section - Don't display if there are no results
				if (arrPrevVisits.length > 0) {
					var prevVisitGrp = new TableGroup();
					prevVisitHdr = this.m_visitsI18n.PREVIOUS + " (" + arrPrevVisits.length + ")";
					prevVisitHdr = prevMax ? prevVisitHdr + " - " + this.m_visitsI18n.LAST_N_VISITS.replace("{0}", prevMax) : prevVisitHdr;
					prevVisitGrp.setDisplay(prevVisitHdr).setGroupId("PREV_VISIT").setShowCount(false);
					prevVisitGrp.bindData(arrPrevVisits);
					prevVisitGrp.setIsExpanded(false);
					visitsTable.addGroup(prevVisitGrp);
				}

				var groupToggleExtension = new TableGroupToggleCallbackExtension();
				groupToggleExtension.setGroupToggleCallback(function(event, data) {
					self.resizeComponent();
				});
				visitsTable.addExtension(groupToggleExtension);
				//HTML for Millennium Table
				millTableHtml = visitsTable.render();

				//Set the component table
				this.setComponentTable(visitsTable);

				this.addCellClickExtension(visitsTable);

				visitsTable.setCustomClass("vis2-table-padding");
			}

			else {
				millTableHtml = MP_Util.HandleNoDataResponse(this.getStyles().getNameSpace());
			}

			//Space Holder div for HI Data Banner
			var hiDataBanner = "<div id ='hiDataBanner" + compId + "'></div>";
			
			//Space Holder div for Mfa Banner
			var mfaBanner = "<div id ='mfaBanner" + compId + "'></div>";
			
			//Space Holder div for HI Data Component Table
			var hiTableHtml = "<div id='hiDataTable" + compId + "' class='vis2-hi-data-table'></div>";

			//Space holder for pager  of HI Table
			var hiDataPager = "<div id='hiDataPager" + compId + "'></div>";

			var hiDataTableAndPager = "<div id='hiDataTableAndPager" + compId + "' class='vis2-hi-data-table-pager'>" + hiTableHtml + hiDataPager + "</div>";

			var vis2TablesContent = "<div id='vis2Tables" + compId + "' class='vis2-tables-expanded'>" + hiDataTableAndPager + millTableHtml + "</div>";

			//Space holder for Side Panel
			var vis2SidePanel = "<div id='vis2SidePanel" + compId + "'class='vis2-side-panel-closed'></div>";
			$("#vis2SidePanel" + this.getComponentId()).removeClass("vis2-side-panel-open-with-hi").addClass("vis2-side-panel-open-without-hi");

			var vis2TabAndSidePanel = "<div id='vis2TabAndSidePanel" + compId + "'class='vis2-tables-and-sp'>" + vis2TablesContent + vis2SidePanel + "</div>";

			//Div containing the table and the side panel
			var componentHtml = "<div id='vis2MainContainer" + compId + "'class='vis2-main-container'>" + hiDataBanner + mfaBanner + vis2TabAndSidePanel + "</div>";
		}

		this.finalizeComponent(componentHtml, "(" + this.m_totalCount + ")");
		if (this.getExternalDataInd()) {
			this.processHiData(reply);
		}


		CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
			"count": this.m_totalCount
		});
		//}

	} catch (err) {
		MP_Util.LogJSError(this, err, "visits-o2.js", "renderComponent");
		throw (err);
	} finally {
		//Nothing
	}

};

MP_Util.setObjectDefinitionMapping("WF_VISITS", VisitsOpt2Component);
