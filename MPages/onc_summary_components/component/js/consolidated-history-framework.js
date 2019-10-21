/**
 * Create the component style object which will be used to style various aspects of our component
 */
function HistoriesComponentStyle() {
	this.initByNamespace("chx");
}
HistoriesComponentStyle.inherits(ComponentStyle);

/**
 * @constructor
 * Initialize the Consolidated History component
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 */
function HistoriesComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new HistoriesComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.CONSOLIDATED_HISTORY - load component");
	this.setComponentRenderTimerName("ENG:MPG.CONSOLIDATED_HISTORY - render component");
	this.setIncludeLineNumber(true);
	this.setScope(1);
	//holds the reply from the  mp_get_consolidated_histories script
	this.historiesScriptReply = null;
	this.recordData = null;
	this.famRecordData = null;
	//hold the procedures data returned from the script call
	this.proceduresRecordData = null;
	//procedures MPageUI table
	this.m_procedureTable = null;
	//array for procedure patient request records
	this.m_procedurePatRequestRecords = [];
	//array for procedure chart (millennium) request records
	this.m_procedureChartRecords = [];
	var chxi18n = i18n.discernabu.consolidated_history;
	this.HistoryComponentIndexObj = {};
	this.currentPage = null;
	//filters from Bedrock
	this.m_socialbl = chxi18n.SOCIAL_HISTORY;
	this.m_familyLbl = chxi18n.FAMILY_HISTORY;
	this.m_procLbl = chxi18n.PROCEDURE;
	this.m_pregLbl = chxi18n.PREGNANCY;
	this.m_probLbl = chxi18n.PROBLEMS;
	this.m_surginet = false;
	this.m_vocabularyList = [];
	// social history component table
	this.m_socHistTable = null;

	this.m_displayHiDataInd = false;
	this.m_tabControl = null;
	this.m_previousTab = "";

	this.tabNames = [];
	this.tabsData = [];//element struct {hideMenu:false, count:5,html:"<div></div>", menuHtml:"<li></li>", tabPostProcess:function()}
	this.hidePregnancy = (!(criterion.getPatientInfo().getSex()) || (criterion.getPatientInfo().getSex().meaning !== "FEMALE"));
	this.isProblemsRendered = false;

	this.m_isProcedureSaved = true;
	this.m_LostDataAndContinue = false;
	this.m_isProcedureModified = false;

	// Flag for resource required
	this.setResourceRequired(true);

	// Flag for vocab filters
	this.m_isCPTSet = false;
	this.m_isICD9Set = false;
	this.m_isICD10Set = false;

	// Viewable encounters
	this.m_viewableEncounters = "";

	// Flags for bedrock show/hide settings for all tabs
	this.m_showProcedureHxTab = true;
	this.m_showFamilyHxTab = true;
	this.m_showPregnancyHxTab = true;
	this.m_showProblemsTab = true;
	this.m_showSocialHxTab = true;

	// problems preferences
	this.m_probSearchVocab = null;
	this.m_probTargetVocab = null;
	this.m_probTargetConf = null;
	this.problemsTab = null;

	//ped histories links
	this.m_socialLink = "";

	//view outside histories indicator.
	//Note: the View Outside Records checkbox should be selected by default if Patient entered data is enabled.
	this.m_viewOutsideHistoriesInd = false;

	//indicator whether displaying procedures HI data is enabled or not
	this.m_displayProcHiDataInd = false;

	//this object is used to track whether the Patient entered data load CAP timers have been triggered or not
	this.PEDLoadCAPTimers = {
		PROCEDURES_LOADED: false,
		PROBLEMS_LOADED: false,
		FAMILY_HISTORY_LOADED: false,
		SHX_LOADED: false
	};

	//the bedrock setting for the link to the procedures Win32
	this.m_proceduresLink = '';

	//the bedrock setting for the link to the problems Win32
	this.m_problemsLink = '';

	//the Bedrock setting for the link to the family hx Win32
	this.m_familyLink = "";

	this.m_hiLookUpKey = "";
	this.m_aliasType = "";
	this.m_aliasPoolCode = 0;
	//indicator whether the returned  Hi data for procedures is valid
	this.m_procHiDataValid = false;

	this.m_mfaBanner = null;

	// Get page level filters from shared resource
	var resourceName = this.getCriterion().category_mean + "pageLevelFilters";
	var pageLevelFilters = MP_Resources.getSharedResource(resourceName);
	if (pageLevelFilters && pageLevelFilters.isResourceAvailable()) {
		//At this point, the codes are already available, so get the data
		var plFilters = pageLevelFilters.getResourceData();
		var plFiltersLen = plFilters.length;
		if (plFiltersLen > 0) {
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
	}
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
HistoriesComponent.prototype = new MPageComponent();
HistoriesComponent.prototype.constructor = MPageComponent;

HistoriesComponent.prototype.showHIData = function() {

	var tabIndex = this.currentPage;
	switch (tabIndex) {
		case this.HistoryComponentIndexObj.PROCEDURE_HISTORY:
			CERN_PROCEDURE_CONSOLIDATED.showHIData(this);
			break;
		case this.HistoryComponentIndexObj.PROBLEMS:
			this.problemsTab.showHIData();
			break;
	}
	this.resizeComponent();
};
/**
 * setSocialHistoryCompTable store the component table for social history
 * @param {ComponentTable} value  - social history component table object.
 */
HistoriesComponent.prototype.setSocialHistoryCompTable = function(value) {
	this.m_socHistTable = value;
};

/**
 * getSocialHistoryCompTable retrieve the component table for social history
 * @return {ComponentTable} social history component table.
 */
HistoriesComponent.prototype.getSocialHistoryCompTable = function() {
	return this.m_socHistTable;
};

HistoriesComponent.prototype.registerExternalSourceDataEvent = function() {
	var compObj = this;
	var hiDataControlBtn = document.getElementById("hiDataControlBtn" + compObj.getComponentId());
	$(hiDataControlBtn).click(function() {
		$(this).closest('div').remove();
		compObj.showHIData();
	});
};

/**
 * gets the indicator for viewing outside histories records
 * @return {Boolean} true or false to indicate whether viewing outside histories records is enabled or not
 */
HistoriesComponent.prototype.getViewOutsideHistoriesInd = function() {
	if(this.getPatientEnteredDataInd()){
		//check for an existing cookie value for the outside records preference
		var viewOutsideRecordsCookie = MP_Util.GetCookieProperty(this.getComponentId(), "VIEW_OUTSIDE_RECORDS");
		if (viewOutsideRecordsCookie) {
			//set the view outside records preference
			this.setViewOutsideHistoriesInd((viewOutsideRecordsCookie === 'yes') ? true : false);
		}
		else{//no cookie was set check if ped is turned on in bedrock if set to yes set the checkbox to be checked
			//otherwise set it to false
			this.setViewOutsideHistoriesInd(true);
		}
	}
	else{ //when patient entered data is turned off in bedrock reset the cookie back to null if it was previously set
		MP_Util.AddCookieProperty(this.getComponentId(), "VIEW_OUTSIDE_RECORDS", null);
		MP_Util.WriteCookie();
		this.m_viewOutsideHistoriesInd = true;
	}
	return this.m_viewOutsideHistoriesInd;
};

/**
 * Calculate the max height of the tab container in context
 * @param  {String} tableNamespace current table namespace
 * @return {Number}                the calculated tab container max height
 */
HistoriesComponent.prototype.calculateTabContainerMaxHeight = function(tableNamespace) {
	var compId = this.getComponentId();
	var tabContainerMaxHeight = parseInt($("#vwpBody").css("height"), 10);
	var tabContainerOffsetTop = parseInt($("#tabContainer" + compId).offset().top, 10);
	var $tabContainer = $("#tabContentsContainer" + compId).find(".chx-tabpage");
	var $tableContainer = $tabContainer.find("." + tableNamespace);
	var currentTabContentOffsetTop = parseInt($tableContainer.offset().top, 10);
	var offsetHeaderArea = currentTabContentOffsetTop - tabContainerOffsetTop;
	if (tabContainerMaxHeight && offsetHeaderArea) {
		//calculate space used by tabs and segmented control if present to determine max height available
		return (tabContainerMaxHeight - offsetHeaderArea) - 60;
	}
	
	return 200;
};
/**
 * Returns whether patient entered data can currently be viewed (when patient-entered data is on and view outside histories is on)
 * @return {Boolean} True if component should show patient entered data, false otherwise.
 */
HistoriesComponent.prototype.shouldDisplayPatientEnteredData = function() {
	return this.getPatientEnteredDataInd() && this.getViewOutsideHistoriesInd();
};

/**
 *This is the Consolidated History component implementation of the RetrieveRequiredResources function
 */
HistoriesComponent.prototype.RetrieveRequiredResources = function() {
	var component = this;

	// Get viewable encounters for procedures
	var veObj = MP_Core.GetViewableEncntrs(this.getCriterion().person_id);
	if (veObj.isResourceAvailable() && veObj.getResourceData()) {
		this.setViewableEncntrs(veObj.getResourceData());
		this.retrieveComponentData();
	}
	else {
		CERN_EventListener.addListener(this, "viewableEncntrInfoAvailable", this.HandleViewableEncounters, this);
	}

	// Call get codes function
	// Get date precision codes from shared resource
	var datePrecisionCdResource = MP_Resources.getSharedResource("datePrecisionCdResource");
	if (datePrecisionCdResource && datePrecisionCdResource.isResourceAvailable()) {
		//At this point, the codes are already available, so get the data
		this.datePrecisionCodes = datePrecisionCdResource.getResourceData();
	}
	else {
		// Retrieve code values from code set 25320.
		// This code set contains code values for precision codes used when onset date is entered in the form of Age.
		var datePrecReq = new ScriptRequest();
		datePrecReq.setProgramName("MP_GET_CODESET");
		datePrecReq.setParameterArray(["^MINE^", "25320.0"]);
		datePrecReq.setAsyncIndicator(true);

		// Callback handler for datePrecReq
		datePrecReq.setResponseHandler(function(scriptReply) {
			component.datePrecisionCodes = scriptReply.getResponse().CODES;
			// Load the codes in a list so searching is easy
			component.datePrecisionCodes = MP_Util.LoadCodeListJSON(component.datePrecisionCodes);
			// Add it to the shared resource
			datePrecisionCdResource = new SharedResource("datePrecisionCdResource");
			if (datePrecisionCdResource) {
				datePrecisionCdResource.setResourceData(component.datePrecisionCodes);
				datePrecisionCdResource.setIsAvailable(true);
				MP_Resources.addSharedResource("datePrecisionCdResource", datePrecisionCdResource);
			}

			// Render component
			component.renderComponent();
		});

		datePrecReq.performRequest();
	}
};

/**
 * The HandleViewableEncounters function will Handle the viewable encounters information for the patient and store within the component object.
 */
HistoriesComponent.prototype.HandleViewableEncounters = function(event, srObj) {
	if (srObj.isResourceAvailable() && srObj.getResourceData()) {
		this.setViewableEncntrs(srObj.getResourceData());
		this.retrieveComponentData();
	}
	else {
		var errMsg = "No viewable encounters available for this patient";
		this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(), errMsg), (this.isLineNumberIncluded() ? "(0)" : ""));
	}
};

/* Supporting functions */
/**
 * set the indicator for viewing outside histories records
 * @param {Boolean} value true or false to indicate whether the viewing outside histories records is enabled or not
 * @return  undefined
 */
HistoriesComponent.prototype.setViewOutsideHistoriesInd = function(value) {
	this.m_viewOutsideHistoriesInd = value;

	//save the View Outside Records indicator as a cookie
	//Note: it is not practical to use true/false because MP_Util.AddCookieProperty returns null for false
	var cookieValue = (value) ? 'yes' : 'no';
	MP_Util.AddCookieProperty(this.getComponentId(), "VIEW_OUTSIDE_RECORDS", cookieValue);
	MP_Util.WriteCookie();
};

/**
 * create the segment control that  allows toggling between patient requests and healthe intent data
 * @return {Object} segmented control object
 */
HistoriesComponent.prototype.createSegmentedControl = function(tabIndex) {
	var self = this;
	var chxi18n = i18n.discernabu.consolidated_history;
	var displayHiDataInd = self.getDisplayHiDataInd();
	var hiDataValidInd = self.isHIDataValid(tabIndex);
	//define the segment control
	var segment = new MPageUI.SegmentedControl();
	//add the segments to the segment control
	segment.addSegment({
		label: chxi18n.PATIENT_REQUESTS,
		selected: !displayHiDataInd,
		onSelect: function() {
			self.setDisplayHiDataInd(false);
			var scriptReply = self.getHistoriesScriptReply();
			self.renderComponent(scriptReply);
		}
	});
	segment.addSegment({
		label: chxi18n.OUTSIDE_RECORDS,
		selected: displayHiDataInd,
		disabled: !hiDataValidInd,
		onSelect: function() {
			self.setDisplayHiDataInd(true);
			var scriptReply = self.getHistoriesScriptReply();
			self.renderComponent(scriptReply);
		}
	});
	//return the segment control object
	return segment;
};

/**
 * Save the reply from the mp_get_consolidated_histories script
 * @param {object} the JSON object of the script response
 */
HistoriesComponent.prototype.setHistoriesScriptReply = function(value) {
	this.historiesScriptReply = value;
};

/**
 * get the saved response of the mp_get_consolidated_histories script
 * @return {object} the JSON object for mp_get_consolidated_histories's response
 */
HistoriesComponent.prototype.getHistoriesScriptReply = function() {
	return this.historiesScriptReply;
};

/**
 * Determine if the HealtheIntent data is valid
 * @return {boolean} The true/false value
 */
HistoriesComponent.prototype.isHIDataValid = function(tabIndex) {
	var scriptReply = this.getHistoriesScriptReply();
	var recordData;
	var hiValidData = false;
	var hiStatus;
	var showProblemsTab = this.getShowProblemsTabFlag();

	// Set the tabs to their respective object_name
	if (showProblemsTab) {
		var ObjectNameIndex = {
			MP_GET_CONDITIONS_JSON: 0,
			MP_GET_CONSOLIDATED_PROCEDURES: 1,
			MP_GET_FAMILY_HISTORY: 2,
			MP_GET_SOCIAL_HISTORY: 3,
			MP_GET_PREGNANCY_HISTORY: 4
		};
	}
	else {
		var ObjectNameIndex = {
			MP_GET_CONSOLIDATED_PROCEDURES: 0,
			MP_GET_FAMILY_HISTORY: 1,
			MP_GET_SOCIAL_HISTORY: 2,
			MP_GET_PREGNANCY_HISTORY: 3
		};
	}

	for (var i = 0; i < scriptReply.SCRIPT_REPLY_LIST.length; i++) {
		var replyData = scriptReply.SCRIPT_REPLY_LIST[i].OBJECT_REPLY;
		recordData = JSON.parse(replyData);
		switch (scriptReply.SCRIPT_REPLY_LIST[i].OBJECT_NAME) {
			case "MP_GET_CONDITIONS_JSON":
				if (ObjectNameIndex.MP_GET_CONDITIONS_JSON === tabIndex) {
					hiStatus = recordData.RECORD_DATA.STATUS_DATA.SUBEVENTSTATUS[0].OPERATIONSTATUS;
					if (hiStatus === "S") {
						try {
							var conditions = JSON.parse(recordData.RECORD_DATA.HTTPREPLY.BODY);
							var hiTotalResults = conditions.total_results;
							if (hiTotalResults > 0 && (conditions.groups[0].most_recent_condition)) {
								hiValidData = true;
							}
							else {
								hiValidData = false;
							}
						}catch(err) {
							hiValidData = false;
						}
					}
					else {
						hiValidData = false;
					}
				}
				break;
		}
	}
	return hiValidData;
};

/* Stores the record data return from the script request*/
HistoriesComponent.prototype.setFamRecordData = function(value) {
	this.famRecordData = value;
};
/*Retrieves the record data returned from the script request*/
HistoriesComponent.prototype.getFamRecordData = function() {
	return this.famRecordData;
};

/**
 * Stores the procedures record data returned from the script request
 * @param {object} value the record data for procedures
 */
HistoriesComponent.prototype.setProceduresRecordData = function(value) {
	this.proceduresRecordData = value;
};

/**
 * get the procedures record data
 * @return {object} the record data for procedures
 */
HistoriesComponent.prototype.getProceduresRecordData = function() {
	return this.proceduresRecordData;
};

/**
 * set the indicator for displaying HI data
 * @param {Boolean} value true or false to indicate whether the HI data should be viewed or not
 * @return {Undefined}
 */
HistoriesComponent.prototype.setDisplayHiDataInd = function(value) {
	this.m_displayHiDataInd = this.getExternalDataInd() ? value : false;
};
/**
 * get the indicator for displaying HI data
 * @return {Boolean} to indicate whether the HI data should be viewed or not
 */
HistoriesComponent.prototype.getDisplayHiDataInd = function() {
	return this.m_displayHiDataInd;
};

/* Stores the record data return from the script request*/
HistoriesComponent.prototype.setRecordData = function(value) {
	this.recordData = value;
};
/*Retrieves the record data returned from the script request*/
HistoriesComponent.prototype.getRecordData = function() {
	return this.recordData;
};

/**
 * set the indicator for displaying HI data
 * @param {Boolean} value true or false to indicate whether the HI data should be viewed or not
 * @return {Undefined}
 */
HistoriesComponent.prototype.setDisplayProcHiDataInd = function(value) {
	this.m_displayProcHiDataInd = this.getExternalDataInd() ? value : false;
};
/**
 * get the indicator for displaying HI data
 * @return {Boolean} to indicate whether the HI data should be viewed or not
 */
HistoriesComponent.prototype.getDisplayHiProcDataInd = function() {
	return this.m_displayProcHiDataInd;
};

/**
 * set the value for the procedures Win32 link
 * @param {String} value the bedrock setting for the procedures Win32 link
 * @return {undefined}
 */
HistoriesComponent.prototype.setProceduresLink = function(value) {
	this.m_proceduresLink = value;
};

/**
 * get the bedrock setting for the procedures Win32 link
 * @return {String} the procedures Win32 link
 */
HistoriesComponent.prototype.getProceduresLink = function() {
	return this.m_proceduresLink;
};

/**
 * set the value for the problems Win32 link
 * @param {String} value the bedrock setting for the problems Win32 link
 * @return {undefined}
 */
HistoriesComponent.prototype.setProblemsLink = function(value) {
	this.m_problemsLink = value;
};

/**
 * get the bedrock setting for the problems Win32 link
 * @return {String} the problems Win32 link
 */
HistoriesComponent.prototype.getProblemsLink = function() {
	return this.m_problemsLink;
};

/**
 * setSocialLink: set social hx tab link
 * @param value {string} sub tab defined in Bedrock
 * @return {undefined}
 */
HistoriesComponent.prototype.setSocialLink = function(value){
	this.m_socialLink = value;
};

/**
 * getSocialLink: get social hx tab link
 * @return {string} m_socialLink sub tab link
 */
HistoriesComponent.prototype.getSocialLink = function(){
	return this.m_socialLink;
};

/**
 * setFamilyLink: set family hx tab link
 * @param value {string} sub tab defined in Bedrock
 * @return {undefined}
 */
HistoriesComponent.prototype.setFamilyLink = function(value){
	this.m_familyLink = value;
};

/**
 * getFamilyLink: get family hx tab link
 * @return {string} m_familyLink sub tab link
 */
HistoriesComponent.prototype.getFamilyLink = function(){
	return this.m_familyLink;
};

/**
 * createTabLink: Creates the HTML string for the histories tab link
 * @param linkText {string} text of the anchor
 * @param isDisabled {boolean} should the link be disabled
 * @param customClass {string} optional custom class for the anchor
 * @param linkHTML {string} string of HTML created for the anchor.
 */
HistoriesComponent.prototype.createTabLink = function(linkText, isDisabled, customClass) {
	var linkHTML = "";
	var disabledString = (isDisabled) ? " disabled" : "";
	customClass = (customClass) ? " " + customClass : "";
	if (linkText) {
		//set both the common disabled class and attribute for the element for styling and to disable actions
		linkHTML = "<a class='chx-tab-link" + disabledString + customClass + "'" + disabledString + ">" + linkText + "</a>";
	}
	return linkHTML;
};


/**
 * set the value of the indicator for the procedures HI data validity
 * @param {Boolean} value the indicator for the procedures HI data validity
 * @return {undefined}
 */
HistoriesComponent.prototype.setProcHiDataValidity = function(value) {
	this.m_procHiDataValid = value;
};

/**
 * get the value of the indicator for the procedures HI data validity
 * @return {Booleaan} the indicator for the procedures HI data validity
 */
HistoriesComponent.prototype.getProcHiDataValidity = function() {
	return this.m_procHiDataValid;
};

/*Retrieves and get labels from bedrock */
HistoriesComponent.prototype.setSocialLabel = function(value) {
	this.m_socialbl = value;
};
HistoriesComponent.prototype.getSocialLabel = function() {
	return this.m_socialbl;
};

HistoriesComponent.prototype.setFamilyLabel = function(value) {
	this.m_familyLbl = value;
};
HistoriesComponent.prototype.getFamilyLabel = function() {
	return this.m_familyLbl;
};

HistoriesComponent.prototype.setProcLabel = function(value) {
	this.m_procLbl = value;
};
HistoriesComponent.prototype.getProcLabel = function() {
	return this.m_procLbl;
};

HistoriesComponent.prototype.setPregLabel = function(value) {
	this.m_pregLbl = value;
};
HistoriesComponent.prototype.getPregLabel = function() {
	return this.m_pregLbl;
};

HistoriesComponent.prototype.setProbLabel = function(value) {
	this.m_probLbl = value;
};
HistoriesComponent.prototype.getProbLabel = function() {
	return this.m_probLbl;
};

/*Retrieves and get Surginet indicator from bedrock */
HistoriesComponent.prototype.setSurginet = function(value) {
	this.m_surginet = value;
};
HistoriesComponent.prototype.getSurginet = function() {
	return this.m_surginet;
};

/* Retrieves the flag set for vocabularies */
HistoriesComponent.prototype.setCPT4Search = function(value) {
	this.m_isCPTSet = value;
};
HistoriesComponent.prototype.setICD9Search = function(value) {
	this.m_isICD9Set = value;
};
HistoriesComponent.prototype.setICD10Search = function(value) {
	this.m_isICD10Set = value;
};

/* Retrieves the list of vocabularies set for procedure search */
HistoriesComponent.prototype.setVocabularyList = function(value) {
	this.m_vocabularyList = value;
};

HistoriesComponent.prototype.getVocabularyList = function() {
	return this.m_vocabularyList;
};

/* Retrieves the list of viewable encounters */
HistoriesComponent.prototype.setViewableEncntrs = function(value) {
	this.m_viewableEncounters = value;
};

HistoriesComponent.prototype.getViewableEncntrs = function() {
	return this.m_viewableEncounters;
};

/* Sets the preferences to be used by Problems Tab */
HistoriesComponent.prototype.setProbSearchVocab = function(value) {
	this.m_probSearchVocab = value;
};
HistoriesComponent.prototype.getProbSearchVocab = function() {
	return this.m_probSearchVocab;
};

HistoriesComponent.prototype.setProbTargetVocab = function(value) {
	this.m_probTargetVocab = value;
};
HistoriesComponent.prototype.getProbTargetVocab = function() {
	return this.m_probTargetVocab;
};

HistoriesComponent.prototype.setProbTargetConf = function(value) {
	this.m_probTargetConf = value;
};
HistoriesComponent.prototype.getProbTargetConf = function() {
	return this.m_probTargetConf;
};
//HI related getters and setters
HistoriesComponent.prototype.setHILookupKey = function(value) {
	this.m_hiLookUpKey = value;
};
HistoriesComponent.prototype.getHILookupKey = function() {
	return this.m_hiLookUpKey;
};
HistoriesComponent.prototype.setAliasType = function(value) {
	this.m_aliasType = value;
};
HistoriesComponent.prototype.getAliasType = function() {
	return this.m_aliasType;
};
HistoriesComponent.prototype.setAliasPoolCd = function(value) {
	this.m_aliasPoolCode = value;
};
HistoriesComponent.prototype.getAliasPoolCd = function() {
	return this.m_aliasPoolCode;
};
/**
 * setShowProblemsTabFlag sets flag to show/hide problems tab
 * @param {Boolean} value [Value of the flag to show/hide problems tab]
 * @returns {undefined} returns nothing
 */
HistoriesComponent.prototype.setShowProblemsTabFlag = function(value) {
	this.m_showProblemsTab = value;
};
/**
 * getShowProblemsTabFlag gets value of the flag to show/hide problems tab
 * @returns {Boolean} [Value of the flag to show/hide problems tab]
 */
HistoriesComponent.prototype.getShowProblemsTabFlag = function() {
	return this.m_showProblemsTab;
};
/**
 * setShowSocialHxTabFlag sets flag to show/hide social history tab
 * @param {Boolean} value [Value of the flag to show/hide social history tab]
 * @returns {undefined} returns nothing
 */
HistoriesComponent.prototype.setShowSocialHxTabFlag = function(value) {
	this.m_showSocialHxTab = value;
};
/**
 * getShowSocialHxTabFlag gets value of the flag to show/hide social history tab
 * @returns {Boolean} [Value of the flag to show/hide social history tab]
 */
HistoriesComponent.prototype.getShowSocialHxTabFlag = function() {
	return this.m_showSocialHxTab;
};
/**
 * setShowProcedureHxTabFlag sets flag to show/hide procedure history tab
 * @param {Boolean} value [Value of the flag to show/hide procedure history tab]
 * @returns {undefined} returns nothing
 */
HistoriesComponent.prototype.setShowProcedureHxTabFlag = function(value) {
	this.m_showProcedureHxTab = value;
};
/**
 * getShowProcedureHxTabFlag gets value of the flag to show/hide Procedure history tab
 * @returns {Boolean} [Value of the flag to show/hide Procedure history tab]
 */
HistoriesComponent.prototype.getShowProcedureHxTabFlag = function() {
	return this.m_showProcedureHxTab;
};
/**
 * setShowFamilyHxTabFlag sets flag to show/hide Family history tab
 * @param {Boolean} value [Value of the flag to show/hide Family history tab]
* @returns {undefined} returns nothing
 */
HistoriesComponent.prototype.setShowFamilyHxTabFlag = function(value) {
	this.m_showFamilyHxTab = value;
};
/**
 * getShowFamilyHxTabFlag gets value of the flag to show/hide Family history tab
 * @returns {Boolean} [Value of the flag to show/hide Family history tab]
 */
HistoriesComponent.prototype.getShowFamilyHxTabFlag = function() {
	return this.m_showFamilyHxTab;
};
/**
 * setShowPregnancyHxTabFlag sets flag to show/hide Pregnancy history tab
 * @param {Boolean} value [Value of the flag to show/hide Pregnancy history tab]
 * @returns {undefined} returns nothing
 */
HistoriesComponent.prototype.setShowPregnancyHxTabFlag = function(value) {
	this.m_showPregnancyHxTab = value;
};
/**
 * getShowPregnancyHxTabFlag gets value of the flag to show/hide Pregnancy history tab
 * @returns {Boolean} [Value of the flag to show/hide Pregnancy history tab]
 */
HistoriesComponent.prototype.getShowPregnancyHxTabFlag = function() {
	return this.m_showPregnancyHxTab;
};

/**
 * This function resizes the component in response of content update or window resizing
 */
HistoriesComponent.prototype.resizeComponent = function() {
	//Call the base class functionality to resize the component
	this.resizeComponentBase();
	//Adjust the component headers if scrolling is applied
	var contentBody = $("#" + this.getStyles().getContentId()).find(".content-body");
	if (contentBody.length) {
		var maxHeight = parseInt($(contentBody).css("max-height").replace("px", ""), 10);
		//Get total height of all rows
		var contentHeight = 0;
		contentBody.find(".sub-sec").each(function(index) {
			contentHeight += $(this).outerHeight(true);
		});
		//If sub-sections don't exist, calculate data rows directly
		if (contentHeight === 0) {
			contentBody.find(".chx-row").each(function(index) {
				contentHeight += $(this).outerHeight(true);
			});
			contentBody.find(".chx-table").each(function(index) {
				contentHeight += $(this).outerHeight(true);
			});
			contentBody.find(".chx-preg-table").each(function(index) {
				contentHeight += $(this).outerHeight(true);
			});
		}

		if (!isNaN(maxHeight) && contentHeight > maxHeight) {
			$("#fmHistHdrRow" + this.getComponentId()).addClass("shifted");
			$("#chxHdrRow" + this.getComponentId()).addClass("shifted");
			$("#ProcHdrRow" + this.getComponentId()).addClass("shifted");
			$("#headerSocHistoryo2" + this.getComponentId()).addClass("shifted");
		}
		else {
			$("#fmHistHdrRow" + this.getComponentId()).removeClass("shifted");
			$("#chxHdrRow" + this.getComponentId()).removeClass("shifted");
			$("#ProcHdrRow" + this.getComponentId()).removeClass("shifted");
			$("#headerSocHistoryo2" + this.getComponentId()).removeClass("shifted");
		}

		// Resize the procedure history side panel as well
		if (this.procSidePanel) {
			this.procSidePanel.resizePanel(maxHeight + "px");
		}
	}

	//If on the problems tab, call its resize function
	if (this.problemsTab && (this.currentPage === this.HistoryComponentIndexObj.PROBLEMS)) {
		this.problemsTab.resizeComponent();
	}
	
	//If on the Social Hx tab and the side panel exists, resize both the table and the side panel
	if ((this.currentPage === this.HistoryComponentIndexObj.SOCIAL_HISTORY) && this.shxSidePanel) {
		var shxTable = this.getSocialHistoryCompTable();
		var calMaxHeight = this.calculateTabContainerMaxHeight(shxTable.m_options.namespace);
		shxTable.setMaxHeight(calMaxHeight);
		var $tabContainer = $("#tabContentsContainer" + this.getComponentId()).find(".chx-tabpage");
		if($tabContainer.hasClass("shx-side-panel-open")){
			//Set the height of the side panel to the new height of the table once the side panel displays
			var $tableContainer = $tabContainer.find(".shx-table");
			var sidePanelHeight = ($tableContainer.length) ? $tableContainer.height() : 175;
			this.shxSidePanel.collapseSidePanel();
			this.shxSidePanel.setHeight(sidePanelHeight + "px");
			this.shxSidePanel.setMinHeight(sidePanelHeight + "px");
			this.shxSidePanel.resizePanel(sidePanelHeight + "px");
			this.shxSidePanel.expandSidePanel();
		}
	}
};

/**
 * This function will be used to resize the component based on the type.
 */
HistoriesComponent.prototype.resizeComponentBase = function() {
	var calcHeight = "";
	var compHeight = 0;
	var compDOMObj = null;
	var compType = this.getStyles()
		.getComponentType();
	var container = null;
	var contentBodyHeight = 0;
	var contentBodyObj = null;
	var miscHeight = 20;
	var viewHeight = 0;
	var compId = this.getComponentId();
	var component = this;

	// Resize tab control
	// Set max width of the tab control container so that resize function will get appropriate value
	var tabActionsWidth = $(".chx-actions").outerWidth();
	var tabControlContainer = $("#hxTabControlContainer" + compId);
	var tabDataContainer = $("#tabData" + compId);
	if(tabControlContainer && tabControlContainer.length){
		tabControlContainer.css("max-width", tabDataContainer.outerWidth() - tabActionsWidth - 2);
		this.m_tabControl.resize(false);
	}
	container = $("#vwpBody");
	if (!container.length) {
		return;
	}
	viewHeight = container.height();

	//Make sure component is rendered
	compDOMObj = $("#" + this.getStyles()
		.getId());
	if (!compDOMObj.length) {
		return;
	}

	//Get the overall height of the content-body section if available at this time
	contentBodyObj = compDOMObj.find(".content-body");
	if (contentBodyObj.length) {
		//Get the overall component height
		compHeight = compDOMObj.height();
		//Get the height of the content-body
		contentBodyObj.each(function() {
			contentBodyHeight = contentBodyHeight + $(this).height();
		});
		//add the height of the main table
		contentBodyHeight += compDOMObj.find(".chx-main-prb-table").height();
		//Calculate the estimated max height of the components content-body elements
		calcHeight = (viewHeight - (compHeight - contentBodyHeight + miscHeight));
		//adjust the calculation since we have 2 tables showing now
		calcHeight /= 2;

		this.calcDynamicSize(contentBodyObj, calcHeight);
		if(this.problemsTab.prbTableUI){
			this.problemsTab.prbTableUI.setMaxHeight(calcHeight);
		}
	}
	//If the component has a component table, call the table's post-resize function
	if (this.problemsTab) {
		if (this.problemsTab.probTable) {
			this.problemsTab.probTable
				.updateAfterResize();
		}
	}
	if (this.problemsTab) {
		if (this.problemsTab.hiTable) {
			this.problemsTab.hiTable
				.updateAfterResize();
		}
	}
	if (this.m_externalProcDataTable) {
		this.m_externalProcDataTable
			.updateAfterResize();
	}

	if(component.m_procedureTable) {
		var $procedureTableContainer = $("#proceduresMainContainer" + compId);

		if($procedureTableContainer.length) {
			CERN_PROCEDURE_CONSOLIDATED.resizeProcedureTabContent(component);
		}
	}

	//If the component has a flowsheet table, call the table's post-resize function
	if (this.getFlowsheetTable()) {
		this.getFlowsheetTable()
			.updateAfterResize();
	}

	if (this.famHxTable) {
		var famHxTableElem = $("#" + this.famHxTable.getId());
		//Check if the table is in effect
		if (famHxTableElem && famHxTableElem.length) {
			CERN_FAM_HISTORY_CONSOLIDATED.resizeComponent(this);
		}
	}
};
/**
 * Helper function for resizeComponentBase
 */
HistoriesComponent.prototype.calcDynamicSize = function(contentBodyObj, viewHeight) {
	if (contentBodyObj.length === 1) {
		contentBodyObj.css("max-height", viewHeight)
			.css("overflow-y", "auto");
		return;
	}
	var equalHeight = viewHeight / contentBodyObj.length;
	var smallDivs = [];
	var largeDivs = [];
	contentBodyObj.each(function() {
		$(this).css("max-height", "");
		if ($(this).height() <= equalHeight) {
			smallDivs.push($(this));
		}
		else {
			largeDivs.push($(this));
		}
	});
	if (smallDivs.length) {
		if (!largeDivs.length) {
			var smallDivsHeight = viewHeight / smallDivs.length;
			for (var i = 0; i < smallDivs.length; i++) {
				smallDivs[i].css("max-height", smallDivsHeight)
					.css("overflow-y", "auto");
			}
		}
		else {
			for (var i = 0; i < smallDivs.length; i++) {
				var divHeight = smallDivs[i].height();
				smallDivs[i].css("max-height", divHeight)
					.css("overflow-y", "auto");
				viewHeight = viewHeight - divHeight;
			}
		}
	}

	if (largeDivs.length) {
		var largeDivHeight = viewHeight / largeDivs.length;
		for (var i = 0; i < largeDivs.length; i++) {
			largeDivs[i].css("max-height", largeDivHeight)
				.css("overflow-y", "auto");
		}
	}
};
/* Main rendering functions */

/**
 * Creates the filterMappings that will be used when loading the component's bedrock settings
 */
HistoriesComponent.prototype.loadFilterMappings = function() {
	//Add the filter mapping object for the labels
	this.addFilterMappingObject("WF_CH_SOCIAL_HX_LBL", {
		setFunction: this.setSocialLabel,
		type: "String",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("WF_CH_FAMILY_HX_LBL", {
		setFunction: this.setFamilyLabel,
		type: "String",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("WF_CH_PROC_HX_LBL", {
		setFunction: this.setProcLabel,
		type: "String",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("WF_CH_PREG_HX_LBL", {
		setFunction: this.setPregLabel,
		type: "String",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("WF_CONSOL_HX_PRB_LBL", {
		setFunction: this.setProbLabel,
		type: "String",
		field: "FREETEXT_DESC"
	});
	//Add the filter mapping object for Surginet indicator
	this.addFilterMappingObject("WF_CH_SURG_IND", {
		setFunction: this.setSurginet,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});

	// Add filter meanings for reading prefs set for CPT4, ICD9 and ICD10
	this.addFilterMappingObject("WF_CONSOL_HX_PRC_DFT_CPT", {
		setFunction: this.setCPT4Search,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});

	this.addFilterMappingObject("WF_CONSOL_HX_PRC_DFT_ICD9", {
		setFunction: this.setICD9Search,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});

	this.addFilterMappingObject("WF_CONSOL_HX_PRC_DFT_ICD10", {
		setFunction: this.setICD10Search,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});

	//Add filter meanings for problems tab prefs
	this.addFilterMappingObject("WF_CONSOL_HX_PRB_SRC_VOC", {
		setFunction: this.setProbSearchVocab,
		type: "NUMBER",
		field: "PARENT_ENTITY_ID"
	});

	this.addFilterMappingObject("WF_CONSOL_HX_PRB_TRG_VOC", {
		setFunction: this.setProbTargetVocab,
		type: "NUMBER",
		field: "PARENT_ENTITY_ID"
	});

	this.addFilterMappingObject("WF_CONSOL_HX_PRB_CONF", {
		setFunction: this.setProbTargetConf,
		type: "NUMBER",
		field: "PARENT_ENTITY_ID"
	});

	// Add filter meaning for show/hide problems tab
	this.addFilterMappingObject("WF_CONSOL_HX_PRB_FLAG", {
		setFunction: this.setShowProblemsTabFlag,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});

	// Add filter meaning for show/hide social history tab
	this.addFilterMappingObject("WF_CONSOL_HX_SOC_FLAG", {
		setFunction: this.setShowSocialHxTabFlag,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});

	// Add filter meaning for show/hide procedure history tab
	this.addFilterMappingObject("WF_CONSOL_HX_PRC_FLAG", {
		setFunction: this.setShowProcedureHxTabFlag,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});

	// Add filter meaning for show/hide family history tab
	this.addFilterMappingObject("WF_CONSOL_HX_FAM_FLAG", {
		setFunction: this.setShowFamilyHxTabFlag,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});

	// Add filter meaning for show/hide pregnancy history tab
	this.addFilterMappingObject("WF_CONSOL_HX_PRG_FLAG", {
		setFunction: this.setShowPregnancyHxTabFlag,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});

	// Added for HI Data Integration flow control checks.
	this.addFilterMappingObject("WF_CONSOL_HX_EXT_DATA_TEST_URI", {
		setFunction: this.setHITestUri,
		type: "String",
		field: "FREETEXT_DESC"
	});

	this.addFilterMappingObject("WF_CONSOL_HX_EXT_DATA_IND", {
		setFunction: this.setExternalDataInd,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});

	//Add filter mapping for patient entered data
	this.addFilterMappingObject('WF_PAT_ENTERED_CONSOL_HX', {
		setFunction: this.setPatientEnteredDataInd,
		type: 'Boolean',
		field: 'FREETEXT_DESC'
	});

	// Add mapping for procedures Win32 link.
	this.addFilterMappingObject('WF_CONSOL_HX_PROCEDURE_LINK', {
		setFunction: this.setProceduresLink,
		type: 'String',
		field: 'FREETEXT_DESC'
	});

	// Add mapping for problems Win32 link.
	this.addFilterMappingObject('WF_CONSOL_HX_PROBLEMS_LINK', {
		setFunction: this.setProblemsLink,
		type: 'String',
		field: 'FREETEXT_DESC'
	});

	// Add mapping for family hx Win32 link.
	this.addFilterMappingObject('WF_CONSOL_HX_FAMILY_LINK', {
		setFunction: this.setFamilyLink,
		type: 'String',
		field: 'FREETEXT_DESC'
	});

	// Add mapping for social history Win32 link.
	this.addFilterMappingObject('WF_CONSOL_HX_SOCIAL_LINK', {
		setFunction : this.setSocialLink,
		type : 'String',
		field : 'FREETEXT_DESC'
	});
};
/**
 * setDefaultTabSequence This function sets index object used for tab rendering according to default sequence of tabs 
 * @returns {Object} Returns tab index object used for tab rendering
 */
HistoriesComponent.prototype.setDefaultTabSequence = function () {
	var defaultIndex = 0;
	var criterion = this.getCriterion();
	var self = this;
	var tabPrefs = null;
	var prefArray = [];
	var showProblemsTab = this.getShowProblemsTabFlag();
	var showSocialHxTab = this.getShowSocialHxTabFlag();
	var showProcedureHxTab = this.getShowProcedureHxTabFlag();
	var showFamilyHxTab = this.getShowFamilyHxTabFlag();
	var showPregnancyHxTab = this.getShowPregnancyHxTabFlag();
	var tabsPrefLength = 0;
	
	// Get user preference to set order of tabs
	MPage_Core_User_Prefs.UserPrefManager.GetPreference("CONSHXTABS", true, criterion.provider_id, false, function(prefString){
		tabPrefs = JSON.parse(prefString);
	});

	// Get number of tabs returned in preference
	if(tabPrefs) {
		for(var i in tabPrefs) {
			tabsPrefLength++;
		}	
	}
	
	this.HistoryComponentIndexObj = null;
	
	// Check bedrock settings for each tab and save preference values for mapping to histories index object	
	if(showProblemsTab) {
		if(!this.HistoryComponentIndexObj) {
			this.HistoryComponentIndexObj = {};
		} 
		
		if(tabPrefs && tabPrefs.hasOwnProperty("PROBLEMS")) {
			prefArray.push(["PROBLEMS", tabPrefs["PROBLEMS"],this.getProbLabel()]);
		}
		else {
			prefArray.push(["PROBLEMS", tabsPrefLength,this.getProbLabel()]);	
			tabsPrefLength++;
		}
	}		
	
	// Apply bedrock filters to around each tab
	if(showProcedureHxTab) {
		if(!this.HistoryComponentIndexObj) {
			this.HistoryComponentIndexObj = {};
		}
		if(tabPrefs && tabPrefs.hasOwnProperty("PROCEDURE_HISTORY")) {
			prefArray.push(["PROCEDURE_HISTORY", tabPrefs["PROCEDURE_HISTORY"], this.getProcLabel()]);				
		}
		else {
			prefArray.push(["PROCEDURE_HISTORY", tabsPrefLength, this.getProcLabel()]);	
			tabsPrefLength++;
		}
	}
	
	if(showFamilyHxTab) {
		if(!this.HistoryComponentIndexObj) {
			this.HistoryComponentIndexObj = {};
		}
		if(tabPrefs && tabPrefs.hasOwnProperty("FAMILY_HISTORY")) {
			prefArray.push(["FAMILY_HISTORY", tabPrefs["FAMILY_HISTORY"], this.getFamilyLabel()]);	
		}
		else {
			prefArray.push(["FAMILY_HISTORY", tabsPrefLength, this.getFamilyLabel()]);	
			tabsPrefLength++;
		}
	}
	
	if(showSocialHxTab) {
		if(!this.HistoryComponentIndexObj) {
			this.HistoryComponentIndexObj = {};
		}
		if(tabPrefs && tabPrefs.hasOwnProperty("SOCIAL_HISTORY")) {
			prefArray.push(["SOCIAL_HISTORY", tabPrefs["SOCIAL_HISTORY"], this.getSocialLabel()]);
		}
		else {
			prefArray.push(["SOCIAL_HISTORY", tabsPrefLength, this.getSocialLabel()]);	
			tabsPrefLength++;
		}
	}
	
	// Check if patient is male along with bedrock setting for pregnancy tab 
	if(!this.hidePregnancy && showPregnancyHxTab){
		if(!this.HistoryComponentIndexObj) {
			this.HistoryComponentIndexObj = {};
		}
		if(tabPrefs && tabPrefs.hasOwnProperty("PREGNANCY_HISTORY")) {
			prefArray.push(["PREGNANCY_HISTORY", tabPrefs["PREGNANCY_HISTORY"], this.getPregLabel()]);			
		}
		else {
			prefArray.push(["PREGNANCY_HISTORY", tabsPrefLength, this.getPregLabel()]);	
			tabsPrefLength++;
		}
	}

	// Re-map histories index object according to increasing order of preference values
	prefArray.sort(function (tabA, tabB) {
		// Sort on preference values
		return tabA[1] - tabB[1];
	});
	
	// Populate index object based on sorted values from preference array 
	for(var i=0; i<prefArray.length; i++) {
		var tab = prefArray[i];
		this.HistoryComponentIndexObj[tab[0]] = i;
		this.tabNames[i] = tab[2];
	}
	
};

/**
 * This function will update tab count for all tabs on the tabControl
 * In order to use this function correctly, it must be called after tabControl is rendered
 * @returns {Undefined} returns nothing 
 */
HistoriesComponent.prototype.updateTabCount = function() {
	var tabArray = this.m_tabControl.getTabs();
	
	for(var i = 0; i<tabArray.length; i++){
		var tab = tabArray[i];
		this.m_tabControl.updateCountOnTab(tab, tab.count);
	}
};

/**
 * This function will update indicator for a tab on the tabControl
 * In order to use this function correctly, it must be called after tabControl is rendered
 * @returns {Undefined} returns nothing 
 */
HistoriesComponent.prototype.updateTabIndicator = function(tab, indicatorHTML) {
 tab.hasIndicator = true;
 this.m_tabControl.updateIndicatorOnTab(tab, indicatorHTML);
};

/**
 * This function sets the location of the histories component header link.  If left null, the
 * function will default to the Histories Layout Link specified in bedrock. ie. the original header link.
 * @param link {string} optional - link from bedrock specifying which hx subtab to navigate to.
 * @returns {undefined}
 */
HistoriesComponent.prototype.updateHxHeaderLink = function(link) {
	if(link){
		this.setLink(link);
	}
	else {
		this.setLink(this.historiesTOCLink);
	}
};

/**
 * This is the Consolidated History Component implementation of the preProcessing function.
 * It initiate the tab labels
 * @returns {undefined} returns nothing
 */
HistoriesComponent.prototype.preProcessing = function() {
	this.compId = this.getComponentId();
	var showProblemsTab = this.getShowProblemsTabFlag();
	var tabNamesLength = 0;
	var self = this;
	var tabsArray = [];
	this.m_tabControl = new MPageUI.SecondaryTabControl();

	// Set tab indexes and set current page
	this.setDefaultTabSequence();

	if(!this.HistoryComponentIndexObj){
		this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace()), (this.isLineNumberIncluded() ? "(0)" : ""));
	}
	else {
		tabNamesLength = this.tabNames.length;

		//Add tabs to tab controller
		for(var tab in this.HistoryComponentIndexObj) {
			var i = this.HistoryComponentIndexObj[tab];
			var hxTab = {
				id : "hxTab" + tab + this.compId,
				label : this.tabNames[i]+ " ",
				title : this.tabNames[i],
				count: 0,
				indicatorHTML: "",
				index: i,
				hxIndex: tab
			};
			this.tabsData.push({
				hideMenu: true,
				count: null,
				html: "",
				menuHtml: "",
				tabPostProcess: null,
				id: "hxTab" + tab + this.compId,
				patReqCount: null
			});
			this.m_tabControl.addTab(hxTab);
		}

		// Rearrange tabsArray according to user preference returned indexes
		this.m_tabControl.getTabs().sort(function (tabA, tabB) {
			return tabA.index - tabB.index;
		});

		this.m_tabControl.setCanSortTabs(true);
		this.m_tabControl.setEnableLabelCount(true);
		tabsArray = this.m_tabControl.getTabs();
		this.currentTab = tabsArray[0];
		this.m_tabControl.setDefaultTab(this.currentTab.id);

		// Set the original header link to the histories table of contents
		this.historiesTOCLink = this.getLink();

		// Set onSelect callback for tabs, it will be called when tab is selected on tabController
		this.m_tabControl.setOnSelectCallback(function(tab) {
			var problemsTabId = "hxTabPROBLEMS" + self.compId;
			var procedureTabId = "hxTabPROCEDURE_HISTORY" + self.compId;
			var showProblemsTab = self.getShowProblemsTabFlag();
			var tabIndex = tab.index;
			var timerRenderTab = null;
			var timerName = "ENG:MPG.CONSOLIDATED_HISTORY - render tab ";
			
			try{
				switch (tabIndex) {
					case self.HistoryComponentIndexObj.FAMILY_HISTORY:
						timerName += "Family";
						//Set the header link to the Family Hx tab if it exist in bedrock. Else use the default HX header link
						self.updateHxHeaderLink(self.getFamilyLink());
						break;
					case self.HistoryComponentIndexObj.PREGNANCY_HISTORY:
						timerName += "Pregnancy";
						//Set the header link to the default HX header link *note* pregnancy doesnt have a bedrock link yet
						self.updateHxHeaderLink();
						break;
					case self.HistoryComponentIndexObj.PROCEDURE_HISTORY:
						timerName += "Procedure";
						//Set the header link to the Procedures Hx tab if it exist in bedrock. Else use the default HX link
						self.updateHxHeaderLink(self.getProceduresLink());
						break;
					case self.HistoryComponentIndexObj.SOCIAL_HISTORY:
						timerName += "Social";
						//Set the header link to the Social Hx tab if it exist in bedrock. Else use the default HX link
						self.updateHxHeaderLink(self.getSocialLink());
						break;
					case self.HistoryComponentIndexObj.PROBLEMS:
						timerName += "Problems";
						//Set the header link to the Problems Hx tab if it exist in bedrock. Else use the default HX link
						self.updateHxHeaderLink(self.getProblemsLink());
						break;
				}

				//Create the render tab timer
				timerRenderTab = MP_Util.CreateTimer(timerName);

				self.m_tabControl.setDefaultTab(tab.id);
				self.currentTab = tab;

				// Throw a message in a modal window if a tab other than Procedure History is selected when procedure history item is just added but not saved
				if (!self.m_isProcedureSaved && self.m_previousTab.id === procedureTabId) {
					CERN_PROCEDURE_CONSOLIDATED.showConfirmationModal(self, function() {
						$("#"+ self.m_previousTab.id + "tab").removeClass("tab-active");
						$("#"+ tab.id + "tab").addClass("tab-active");
						// Update current tab
						self.m_tabControl.setDefaultTab(tab.id);
						self.currentTab = tab;
						// Render problems tab
						if ((tab.id === problemsTabId) && showProblemsTab) {
							if (!self.problemsTab) {
								self.problemsTab = new ChronicProblemsTab(self);
							}
							self.problemsTab.renderComponent();
							self.isProblemsRendered = true;
						}
						else {
							self.renderTabDetails(tab);
						}
						self.procSidePanel = null;

					});
					//Keep procedure history tab active
					self.m_tabControl.setDefaultTab(procedureTabId);

					if(tab.id !== procedureTabId) {
						self.currentTab = self.m_previousTab;
						$("#"+ self.m_previousTab.id + "tab").addClass("tab-active");
						$("#"+ tab.id + "tab").removeClass("tab-active");
					}

					//self.m_tabControl.activateTab($("#"+ self.m_previousTab.id + "tab"));
					return;
				}
				// Render problems tab
				if ((tab.id === problemsTabId) && showProblemsTab) {
					if (!self.problemsTab) {
						self.problemsTab = new ChronicProblemsTab(self);
					}
					self.problemsTab.renderComponent();
					self.isProblemsRendered = true;
				}
				else {

					self.renderTabDetails(tab);
				}
			}
			catch (err) {
				if (timerRenderTab) {
					timerRenderTab.Abort();
					timerRenderTab = null;
				}
				MP_Util.LogJSError(self, err, "consolidated-history-framework.js", "renderComponent");
				//Throw the error to the architecture
				throw (err);
			}
			finally {
				if (timerRenderTab) {
					timerRenderTab.Stop();
				}
			}

		});

		// Set onSort callback fired when tabs are dragged and dropped
		this.m_tabControl.setOnSortCallback(function (tabsArray) {
			self.saveUserPreferences(tabsArray);
		});

		// This function is required to be defined for tabsControl
		this.m_tabControl.setOnDeselectCallback(function(tab) {
			self.m_previousTab = tab;
			//Remove selection for the family history table
			if (tab.id === ("hxTabFAMILY_HISTORY" + self.getComponentId())) {
				self.famHxTable.deselectAll();
				self.famHxSidePanel = null;
			}
		});

		// Push selected vocabulary in vocabList
		if (this.m_isCPTSet) {
			this.m_vocabularyList.push("CPT4");
		}

		if (this.m_isICD9Set) {
			this.m_vocabularyList.push("ICD9");
		}

		if (this.m_isICD10Set) {
			this.m_vocabularyList.push("ICD10");
		}

		this.setVocabularyList(this.m_vocabularyList);
		if (self.getExternalDataInd()) {
			self.authenticateExternalDataAccess();
		}
	}
};

/**
 * This function calls the MFA utility to verify the users ability to view external HI data.
 * Upon successful verification, the HI person search will search HI data.
 * If authentication fails, the search will be restricted to Millennium data.
 */
HistoriesComponent.prototype.authenticateExternalDataAccess = function() {
	var component = this;
	var authStatus = new Mfa_Auth().RetrieveMfaAuthStatus();
	var authStatusData;
	// MFA error status
	var status = 4;
	var disableExternalData = function(status, message) {
		component.setMfaBanner(status, message);
		component.setDisplayHiDataInd(false);
		component.setDisplayProcHiDataInd(false);
		component.setExternalDataInd(false);
	};

	if (authStatus.isResourceAvailable()) {
		authStatusData = authStatus.getResourceData();
		if (authStatusData) {
			status = authStatusData.status;
			// If status is not successful and needed still for current session
			if (status !== 0 && status !== 5) {
				disableExternalData(status, authStatusData.message);
			}
		}
	}
	else {
		disableExternalData(status, i18n.discernabu.mfa_auth.MFA_ERROR_MSG);
	}

	component.auditMfaAuth(status);
};

/**
 * This function creates and sets the appropriate mfa alert banner.
 * @param {int} status - status number of the mfa call
 * @param {String} message - the message to display on the alert banner
 */
HistoriesComponent.prototype.setMfaBanner = function(status, message) {
	var component = this;
	var chxi18n = i18n.discernabu.consolidated_history;
	var alertBanner = new MPageUI.AlertBanner();

	// If user fails to authenticate or cancels authentication
	if (status === 2 || status === 3) {
		alertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.INFO);
	}
	else {
		alertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
	}
	alertBanner
		.setPrimaryText(message)
		.setSecondaryText(chxi18n.MFA_RESTRICTION);
	component.m_mfaBanner = alertBanner;
}

/**
 * This function submits the event audit for MFA.
 * @param {int} status - status number of the mfa call
 */
HistoriesComponent.prototype.auditMfaAuth = function(status) {
	var component = this;
	var providerID = component.getCriterion().provider_id + '.0';
	var mpEventAudit = new MP_EventAudit();
	var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	var dateTime = new Date();

	dateTime = dateFormatter.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);

	mpEventAudit.setAuditMode(0);
	mpEventAudit.setAuditEventName('MPD_HISTORIES_MFA_ATTEMPT');
	mpEventAudit.setAuditEventType('SECURITY');
	mpEventAudit.setAuditParticipantType('PERSON');
	mpEventAudit.setAuditParticipantRoleCd('PROVIDER');
	mpEventAudit.setAuditParticipantIDType('PROVIDER_NUMBER');
	mpEventAudit.setAuditParticipantID(providerID);
	mpEventAudit.setAuditParticipantName('STATUS=' + status + ';DATE=' + dateTime);
	mpEventAudit.addAuditEvent();
	mpEventAudit.submit();
};

/**
 * saveUserPreferences- This function saves user preference for order of tabs to be rendered
 * @param {Array} tabsArray - Array of tabs to be saved as user preference
 * @returns {Undefined} returns nothing
 */
HistoriesComponent.prototype.saveUserPreferences = function(tabsArray) {
	var criterion = this.getCriterion();
	this.HistoryComponentIndexObj = {};
	
	var tabsDataArray = [];
	
	// Sync all indexes
	for(var i=0;i<tabsArray.length;i++) {
		this.HistoryComponentIndexObj[tabsArray[i].hxIndex] = i;
		tabsArray[i].index = i;
		for(var j=0;j<this.tabsData.length;j++) {
			if(this.tabsData[j].id === tabsArray[i].id) {
				tabsDataArray.push(this.tabsData[j]);
				break;
			}
		}
	}
	this.tabsData = tabsDataArray;
	// Save user preferences as current order of tabs
	MPage_Core_User_Prefs.UserPrefManager.SavePreference("CONSHXTABS", JSON.stringify(this.HistoryComponentIndexObj), true, criterion.provider_id, true);
};

/**
 * This function will render tab details for particular tab on the component
 * @param {JSON} tab- tab info in form of a JSON object
 * @returns {Undefined} returns nothing
 */
HistoriesComponent.prototype.renderTabDetails = function(tab) {
	
	var tabControlElement = $('.secondary-tab');
	var tabActionsContainer = $('#tabActionsContainer' + this.compId);
	var hxTabDataContainer = $('#tabData' + this.compId);
	var tabContentsContainer = $('#tabContentsContainer' + this.compId); 
	var markupObj = this.getTabData(tab); 
	var historyComponent = $("#chxContent" + this.compId);
	
	if(this.m_tabControl.m_defaultTab !== tab.id) {
		this.m_tabControl.updateCountOnTab(tab, tab.count);	
	}
	else {	
		// Empty actions and contents container
		tabActionsContainer.empty();
		tabContentsContainer.empty();
		tabActionsContainer.append(markupObj.actionsHTML);
		tabContentsContainer.append(markupObj.contentHTML);
		this.finalizeComponent(historyComponent.html() , "");
		// Clear cache for tab controller and attach events and sorting
		this.m_tabControl.clearElementCache();
		this.m_tabControl.attachEvents();
		if (this.m_tabControl.m_canSortTabs) {
			this.m_tabControl.applyTabSorting();
		}
		this.attachHistoriesEvents(tab);
	}
};

/**
 * This is the Consolidated History Component implementation of the retrieveComponentData function.
 * It creates the necessary parameter array for the data acquisition script call and the associated Request object.
 */
HistoriesComponent.prototype.retrieveComponentData = function() {
	var component = this;
	var criterion = component.getCriterion();
	var batchRequestObj = {MP_BATCH_REQUEST: {SCRIPT_LIST: []}};
	var MP_BATCH_REQUEST = batchRequestObj.MP_BATCH_REQUEST;
	var sendAr = [];
	var newConsolidatedHxRequest = new ComponentScriptRequest();
	var viewCategoryMean = criterion.category_mean;
	var loadTimer = new RTMSTimer(this.getComponentLoadTimerName(), viewCategoryMean);
 	var renderTimer = new RTMSTimer(this.getComponentRenderTimerName(), viewCategoryMean);


	var encntrs = this.getViewableEncntrs();
	var encntrVal = (encntrs) ? "value(" + encntrs + ")" : "0.0";

	//get the indicator whether patient entered data should be displayed
	var patientEnteredDataInd = component.getPatientEnteredDataInd();
	var viewOutsideRecsSelected = component.getViewOutsideHistoriesInd();
	//this patient requests display indicator will be used for social history and family history
	var patientReqDisplayInd = (patientEnteredDataInd && viewOutsideRecsSelected) ? 1 : 0;
	//get the patient requests display indicator for procedures. In Procedures, Patient entered data and HI data should not be displayed at the same time
	var procedurePatReqDisplayInd =(CERN_PROCEDURE_CONSOLIDATED.isDisplayPatientEnteredDataEnabled(component)) ? 1 : 0;

	var hiPrLookUpKey = "null";
	var hiTestUri = "null";
	var aliasType = (component.getAliasType().length > 0) ? component.getAliasType() : "null";
	var index = 0;
	var aliasPoolCd = 0.0;

	if (this.getExternalDataInd()) {
		if ($.trim(this.getHITestUri()).length > 0) {
			hiTestUri = this.getHITestUri();
		}

		if ($.trim(component.getHILookupKey()).length > 0) {
			hiPrLookUpKey = component.getHILookupKey();
		}
		if ($.trim(component.getAliasPoolCd())) {
			aliasPoolCd = component.getAliasPoolCd() + ".0";
		}

		MP_BATCH_REQUEST.SCRIPT_LIST.push({
			OBJECT_NAME: "MP_GET_CONDITIONS_JSON",
			OBJECT_PARAMS: ["^MINE^"
				, "^" + hiPrLookUpKey + "^"
				, "^" + aliasType + "^"
				, aliasPoolCd
				, "^" + hiTestUri + "^"
				, index
				, criterion.person_id + ".0"
				, criterion.provider_id + ".0"
				, criterion.ppr_cd + ".0"
			].join(",")
		});
	}
	if(this.getShowProcedureHxTabFlag()) {
		MP_BATCH_REQUEST.SCRIPT_LIST.push({
			OBJECT_NAME: "MP_GET_CONSOLIDATED_PROCEDURES",
			OBJECT_PARAMS: ["^MINE^"
				, criterion.person_id + ".0"
				, encntrVal
				, criterion.provider_id + ".0"
				, criterion.ppr_cd + ".0"
				, 1
				, "^" + aliasType + "^"
				, aliasPoolCd
				, "^" + hiPrLookUpKey + "^"  // lookupkey
				, "^" + hiTestUri + "^"
				, index
				, procedurePatReqDisplayInd
			].join(",")
		});
	}

	// put separate script params into MP_BATCH_REQUEST
	if(this.getShowFamilyHxTabFlag()) {
		MP_BATCH_REQUEST.SCRIPT_LIST.push({
			OBJECT_NAME: "MP_GET_FAMILY_HISTORY",
			OBJECT_PARAMS: ["^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.ppr_cd + ".0",patientReqDisplayInd].join(",")
		});
	}

	if (!this.hidePregnancy && this.getShowPregnancyHxTabFlag()) {
		MP_BATCH_REQUEST.SCRIPT_LIST.push({
			OBJECT_NAME: "MP_GET_PREGNANCY_HISTORY",
			OBJECT_PARAMS: ["^MINE^", criterion.person_id + ".0"].join(",")
		});
	}

	if(this.getShowSocialHxTabFlag()) {
		MP_BATCH_REQUEST.SCRIPT_LIST.push({
			OBJECT_NAME: "MP_GET_SOCIAL_HISTORY",
			OBJECT_PARAMS:["^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.ppr_cd + ".0",patientReqDisplayInd,encntrVal].join(",")
		});
	}


	//Somehow all " is replaced with ^ in "In-browser" dev, need to replace ^ with ' so string won't be messed up
	var requestObjStr = JSON.stringify(batchRequestObj);
	requestObjStr = "build('" + requestObjStr.replace(/\^/g, "',^'^,'") + "')";

	sendAr.push("^MINE^", requestObjStr, criterion.provider_id + ".0", criterion.ppr_cd + ".0");

	newConsolidatedHxRequest.setProgramName("MP_GET_CONSOLIDATED_HISTORIES");
	newConsolidatedHxRequest.setParameterArray(sendAr);
	newConsolidatedHxRequest.setComponent(this);
	newConsolidatedHxRequest.setLoadTimer(loadTimer);
 	newConsolidatedHxRequest.setRenderTimer(renderTimer);

	newConsolidatedHxRequest.setResponseHandler(function(scriptReply) {
		var responseData = scriptReply.getResponse();
		if (responseData.STATUS_DATA.STATUS != "F") {
			component.renderComponent(responseData);
		}
		else {
			component.finalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace()), (component.isLineNumberIncluded() ? "(0)" : ""));
		}
	});

	newConsolidatedHxRequest.performRequest();
};

/**
 * This is the HistoriesComponent implementation of the renderComponent function.  It takes the information retrieved from the script
 * call and renders the component's visuals.  There is no check on the status of the script call's reply since that is handled in the
 * call to XMLCCLRequestWrapper.
 * @param recordData object
 */
HistoriesComponent.prototype.renderComponent = function(recordData) {
	//save the response of mp_get_consolidated_histories script
	this.setHistoriesScriptReply(recordData);
	var replyData = null;
	var showProblemsTab = this.getShowProblemsTabFlag();

	if(!this.HistoryComponentIndexObj) {
		this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace()), (this.isLineNumberIncluded() ? "(0)" : ""));
	}
	else {
	for (var i = 0; i < recordData.SCRIPT_REPLY_LIST.length; i++) {
		replyData = recordData.SCRIPT_REPLY_LIST[i].OBJECT_REPLY;
		switch (recordData.SCRIPT_REPLY_LIST[i].OBJECT_NAME) {
			case "MP_GET_FAMILY_HISTORY":
				this.handleHistoryReply(replyData, this.HistoryComponentIndexObj.FAMILY_HISTORY);
				break;
			case "MP_GET_PREGNANCY_HISTORY":
				this.handleHistoryReply(replyData, this.HistoryComponentIndexObj.PREGNANCY_HISTORY);
				break;
			case "MP_GET_CONSOLIDATED_PROCEDURES":
				this.handleHistoryReply(replyData, this.HistoryComponentIndexObj.PROCEDURE_HISTORY);
				break;
			case "MP_GET_SOCIAL_HISTORY":
				this.handleHistoryReply(replyData, this.HistoryComponentIndexObj.SOCIAL_HISTORY);
				break;
			case "MP_GET_CONDITIONS_JSON":
				if (!this.problemsTab && showProblemsTab) {
					this.problemsTab = new ChronicProblemsTab(this);
					this.problemsTab.setHITable(replyData);
				}
				break;
			}
		}
	this.renderHistoriesComponent(this.currentTab);
	}
};

/**
 * renderHistoriesComponent- This function initialized and renders tab control with tab data
 * @param {Object} tab to be rendered
 * @returns {Undefined} returns nothing
 */
HistoriesComponent.prototype.renderHistoriesComponent = function(tab) {
	var procedureTabId = "hxTabPROCEDURE_HISTORY" + this.compId;
	var self = this;
	if(typeof tab === "undefined") {
		tab = this.currentTab;
	}
	// Show confirmation modal when component is refreshed with procedure history items not saved
	if (!self.m_isProcedureSaved && tab.id === procedureTabId) {
		CERN_PROCEDURE_CONSOLIDATED.showConfirmationModal(self, function() {
			// Update current tab
			self.m_tabControl.setDefaultTab(tab.id);
			self.currentTab = tab;			
			self.renderTabDetails(tab);
			self.procSidePanel = null;
		});
		// If cancel is selected go back to current view
		return;
	}	
	this.m_tabControl.setDefaultTab(tab.id);
	var tabData = this.getTabData(tab);
	var tabContent = this.m_tabControl.render();
	var containers = "<div class='chx-tab-container' id='tabContainer"+this.compId +"'><div id='tabData" + this.compId + "'class='chx-tab-control-container'><div id='hxTabControlContainer" + this.compId + "'>";
	tabContent = containers.concat(tabContent);
	tabContent += "</div><span id='tabActionsContainer" + this.compId + "'></span></div><div id='tabContentsContainer" + this.compId + "'></div></div>";
	this.finalizeComponent(tabContent, "");
	
	this.m_tabControl.clearElementCache();
	if (this.getShowProblemsTabFlag()) { 
		if (!this.problemsTab) {
			this.problemsTab = new ChronicProblemsTab(this);
		}
		this.problemsTab.renderComponent();
	}
	this.m_tabControl.finalize();
};


/**
 * getTabData function- Retrieves tab data to be rendered on the component
 * @param {Object} tab - tab object of the histories component to be rendered
 * @returns {String} markupObj- returns generated markup of the tab to be rendered
 */
HistoriesComponent.prototype.getTabData = function(tab) {
	var tabIndex = tab.index;
	var self = this;
	var currentTab = this.m_tabControl.m_defaultTab;
	var problemsTabId = "hxTabPROBLEMS" + this.compId;
	var procedureTabId = "hxTabPROCEDURE_HISTORY" + this.compId;
	
	//get the patient entered data bedrock filter
	var patientEnteredDataInd = self.getPatientEnteredDataInd();
	var chxi18n = i18n.discernabu.consolidated_history;
	var actionsHTMLArray = [];
	var contentHTMLArray = [];
	var tabsArray = this.m_tabControl.getTabs();
	var viewPatientReqMarkup = '';
	var viewOutsideRecsSelected = false;
	var showProblemsTab = this.getShowProblemsTabFlag();
	var showProcedureTab = this.getShowProcedureHxTabFlag();
	
	//create the  Html for the view outside records checkbox if the patient entered data filter is enabled
	if (patientEnteredDataInd) {
		//get the indicator whether View Outside Records is checked or not
		viewOutsideRecsSelected = self.getViewOutsideHistoriesInd();
		var patReqModeCheckedAttr = (viewOutsideRecsSelected) ? 'checked' : '';
		viewPatientReqMarkup = '<div class="view-pat-req-content"><label><input id="chxViewOutsideRecs' + this.compId + '" type="checkbox" ' + patReqModeCheckedAttr + ' name="chx-view-pat-req-chk" />' + chxi18n.VIEW_OUTSIDE_RECORDS + '</label></div><span class="chx-control-separator"></span>';
	}
	else {
		viewPatientReqMarkup = '';
	}

	var numTabs = self.tabNames.length;

	if (typeof tabIndex === "number") {
		self.currentPage = tabIndex;
	}
	else {
		tabIndex = self.currentPage;
		self.currentTab = tabsArray[tabIndex];
	}

	var tabData = this.tabsData[tabIndex];
	var i;
	var iTabName, iCount, patReqIcon, patReqCnt;
	
	for (var i=0; i<tabsArray.length;i++) {
		//if patient request count is > 0 display the  'unverified' icon
		var curTab = tabsArray[i];
		patReqCnt = (this.tabsData[curTab.index].patReqCount || 0);
		if(patReqCnt > 0) {
			curTab.hasIndicator = true;
		}
		patReqIcon = (patientEnteredDataInd && viewOutsideRecsSelected && patReqCnt && curTab.hasIndicator) ? '<span class="chx-pat-req-icon"></span>' : '';
		iCount = this.tabsData[curTab.index].count + patReqCnt;
		curTab.count = iCount;
		curTab.indicatorHTML = patReqIcon;
	}

	// If Procedure History tab is in focus then add a search bar for adding a procedure
	if (tab.id === procedureTabId) {
		actionsHTMLArray.push('<div class="chx-actions">', viewPatientReqMarkup, '<div class="chx-vocab-select"><select id="chxProcVocabSelect' + this.compId + '"></select></div><div class="chx-search-container"><div id="chxProcedureSearchContainer' + this.compId + '"></div></div></div></div>');
	}
	else if (tab.id === problemsTabId) {
		actionsHTMLArray.push('<div class="chx-actions">', viewPatientReqMarkup, '<div class="chx-search-container"><div id="chxProbSearchContainer' + this.compId + '"></div></div></div>');
	}
	else if (tabIndex === this.HistoryComponentIndexObj.SOCIAL_HISTORY) {
		actionsHTMLArray.push('<div class="chx-actions">' + viewPatientReqMarkup + '</div>');
	}
	else if (tabIndex === this.HistoryComponentIndexObj.FAMILY_HISTORY) {
		actionsHTMLArray.push('<div class="chx-actions">' + viewPatientReqMarkup + '</div>');
	}
	else {
		actionsHTMLArray.push('<div class="chx-actions"></div></div>');
	}
	contentHTMLArray.push('<hr><div class="chx-tabs-content">');

	if (tab.id === problemsTabId) {
		contentHTMLArray.push('<div class="chx-tabpage chx-problems">', tabData.html, '</div></div>');
	}
	else {
		contentHTMLArray.push('<div class="chx-tabpage">', tabData.html, '</div></div>');
	}
	var actionsHTML = actionsHTMLArray.join("");
	var contentHTML = contentHTMLArray.join("");
	var markupObj = {};
	markupObj.actionsHTML = actionsHTML;
	markupObj.contentHTML = contentHTML;

	return markupObj;			
};

/**
 * Switch view to another tab, or refresh current view when tabIndex is omitted
 * @param number tabIndex the index of the tab that will switch to. When omitted, it refreshes component's HTML.
 */
HistoriesComponent.prototype.attachHistoriesEvents = function(tab) {
	var timerRenderTab = null;
	var tabIndex = tab.index;
		var self = this;
		//get the patient entered data bedrock filter
		var patientEnteredDataInd = self.getPatientEnteredDataInd();
		var chxi18n = i18n.discernabu.consolidated_history;
		var htmlArray = "";
		var viewPatientReqMarkup = '';
		var viewOutsideRecsSelected = false;
		var tabsArray = this.m_tabControl.getTabs();
		var showProblemsTab = this.getShowProblemsTabFlag();
		var tabData = this.tabsData[tabIndex];

		if (patientEnteredDataInd) {
			viewOutsideRecsSelected = self.getViewOutsideHistoriesInd();
		}

		//finalize the social history component table
		if(tabIndex === this.HistoryComponentIndexObj.SOCIAL_HISTORY){
			if(patientEnteredDataInd && viewOutsideRecsSelected && !this.PEDLoadCAPTimers.SHX_LOADED) {
				var shxLoadCAPTimer = new CapabilityTimer('CAP:MPG Social History Load Patient Entered Data');
				shxLoadCAPTimer.capture();
				this.PEDLoadCAPTimers.SHX_LOADED = true;
			}
			//check if the table is available and attach the events by finalizing it
			var shxTable = this.getSocialHistoryCompTable();
			if(shxTable) {
				shxTable.clearElementCache();
				shxTable.deselectAll();
				shxTable.attachEvents();
				shxTable.setMaxHeight(this.calculateTabContainerMaxHeight(shxTable.m_options.namespace));
				CERN_SOCIAL_HISTORY_CONSOLIDATED.initializeSidePanel(this);
				CERN_SOCIAL_HISTORY_CONSOLIDATED.attachOutsideRecordsEvent(this);
			}
		}

		//finalize the family history tab
		if(tabIndex === this.HistoryComponentIndexObj.FAMILY_HISTORY){
			if(patientEnteredDataInd && viewOutsideRecsSelected && !this.PEDLoadCAPTimers.FAMILY_HISTORY_LOADED) {
				var fhxLoadCAPTimer = new CapabilityTimer('CAP:MPG Histories_Family History Load Patient Entered Data');
				fhxLoadCAPTimer.capture();
				this.PEDLoadCAPTimers.FAMILY_HISTORY_LOADED = true;
			}
			if (patientEnteredDataInd && viewOutsideRecsSelected) {
				//reset the requests array
				this.famPatRequestArr = [];
				if (this.fhxRemoveRequestsButton) {
					this.fhxRemoveRequestsButton.clearElementCache();
					this.fhxRemoveRequestsButton.attachEvents();
				}
			}
		}

		/**
		 * bedrock filter indicating External Source Data Available link to be
		 * displayed*
		 */
		if ((this.getExternalDataInd() && $.trim(this.getHITestUri()).length > 0 && typeof this
				.getHITestUri() === 'string')
			|| (this.getExternalDataInd()
			&& $.trim(this.getHILookupKey()).length > 0 && typeof this
				.getHILookupKey() === 'string')) {

			this.registerExternalSourceDataEvent();
		}

		//Render actionability for Procedure History
		if (tabIndex === this.HistoryComponentIndexObj.PROCEDURE_HISTORY) {
			CERN_PROCEDURE_CONSOLIDATED.addProcedureActionability(this);

			if (patientEnteredDataInd && viewOutsideRecsSelected) {
				var displayProcHiDataInd = this.getDisplayHiProcDataInd();
				//Display Hi Data if the segemented control HI button is selected
				if (displayProcHiDataInd) {
					CERN_PROCEDURE_CONSOLIDATED.showHIData(this);
					this.resizeComponent();
				}
				else {
					//if patient entered data is enabled, trigger the Procedure PED load timer
					if (!this.PEDLoadCAPTimers.PROCEDURES_LOADED) {
						var procLoadCAPTimer = new CapabilityTimer('CAP:MPG Histories_Procedure History Load Patient Entered Data');
						procLoadCAPTimer.capture();
						this.PEDLoadCAPTimers.PROCEDURES_LOADED = true;
					}
				}
			}
		}

		//Resize the component since the component content has been updated
		this.resizeComponent();

		//Simply put HTML on the tab doesn't make it work it properly. Functions like hovers and button events need to be initialized.
		//These functions are stored in tabPostProcess.
		if (typeof tabData.tabPostProcess === 'function') {
			tabData.tabPostProcess();
		}

		//Handle component level menu for family history
		var compMenu = this.getMenu();
		if (!tabData.hideMenu) {
			//Associate click event to menu button when current tab is Family history
			//essentially menu id = componentMenu.getAnchorElementId() = "mainCompMenu" + compObj.getStyles().getId()
			if ($("#" + compMenu.getAnchorElementId()).hasClass("opts-menu-empty")) {
				$("#" + compMenu.getAnchorElementId()).removeClass("opts-menu-empty").click(function() {
					MP_MenuManager.showMenu(compMenu.getAnchorElementId());
				});
			}
		}
		else {
			//Disable the menu for this component and unbind all click events
			$("#" + compMenu.getAnchorElementId()).addClass("opts-menu-empty").unbind("click");
		}

		if (patientEnteredDataInd) {
			//click event to save the component level preference for the 'View Outside Records' checkbox
			$('#chxViewOutsideRecs' + this.compId).click(function() {
				//change the view outside records indicator
				self.setViewOutsideHistoriesInd($(this).is(':checked'));

				//retrieve the data for all the tabs
				self.retrieveComponentData();
			});
		}
};

/**
 * Load history data.
 * @param {number} len Length of results
 * @param {string} pageHTML This history tab's HTML
 * @param {number} tabIndex Index of the tab
 * @param {function} func The function that needs to be called after content is updated. Like register actions, etc.
 * @param {number} patRequestsCount the number of the patient requests
 */
HistoriesComponent.prototype.loadTabData = function(len, pageHTML, tabIndex, func, patRequestsCount) {
	if (typeof func === "undefined") {
		func = null;
	}
	//Cache data in to tabsData: it reduces calculation when user frequently switch tabs, and it reserves the view last used in Family History
	var tabData = this.tabsData[tabIndex];
	tabData.count = len;
	tabData.patReqCount = patRequestsCount;
	tabData.html = pageHTML;
	tabData.tabPostProcess = func;
};

/**
 * Prepare reply data for a history tab
 */
HistoriesComponent.prototype.handleHistoryReply = function(objReply, historyIndex) {
	MP_Util.LogScriptCallInfo(this, this, "consolidated-history-framework.js", "wrapReplyData");
	var text = "";
	if (!objReply) {
		text = ["<span class='res-none'>", i18n.ERROR_RETREIVING_DATA, "</span>"].join("");
		this.loadTabData(0, text, historyIndex);
		return;
	}
	var jsonEval = JSON.parse(objReply);
	var recordData = jsonEval.RECORD_DATA;
	var status = recordData.STATUS_DATA.STATUS;
	var tabsArray = this.m_tabControl.getTabs();

	if (status == "Z") {
		// If there are no procedure history items we still want to render the component so that a new procedure can be added
		if (historyIndex === this.HistoryComponentIndexObj.PROCEDURE_HISTORY) {
			this.m_ProcedureHistoryCount = 0;
			this.setProceduresRecordData(recordData);
			CERN_PROCEDURE_CONSOLIDATED.RenderComponent(this);
		}
		else {
			if (historyIndex === this.HistoryComponentIndexObj.FAMILY_HISTORY) {
				var patientEnteredDataInd = this.getPatientEnteredDataInd();
				var viewOutsideRecsSelected = this.getViewOutsideHistoriesInd();
				//when the update priv is set to 'Yes' display the banner even when there are no fhx in the reply
				if(patientEnteredDataInd && viewOutsideRecsSelected && recordData.UPDATE_FAM_HIST_PRIV){
					text = CERN_FAM_HISTORY_CONSOLIDATED_PED.GetPatientPortalBannerHtml(this);
				}
				text += "<span class='res-none'>" + i18n.discernabu.NO_RESULTS_FOUND + "</span>";
			}
			else if(historyIndex === this.HistoryComponentIndexObj.SOCIAL_HISTORY){
				text = "<span class='res-none'>" + i18n.discernabu.NO_RESULTS_FOUND + "</span>";
			}
			this.loadTabData(0, text, historyIndex);
		}
	}
	else if (status == "S") {
		switch (historyIndex) {
			case this.HistoryComponentIndexObj.FAMILY_HISTORY:
				this.setFamRecordData(recordData);
				this.tabsData[this.HistoryComponentIndexObj.FAMILY_HISTORY].hideMenu = false;

				/* create component level menu only when status is S */
				var compMenu = this.getMenu();
				var compId = this.getComponentId();
				var groupConditionMenuId = "groupCondition" + compId;
				var groupFamilyMenuId = "groupFamily" + compId;
				var component = this;
				var chxi18n = i18n.discernabu.consolidated_history;
				var tab = tabsArray[this.HistoryComponentIndexObj.FAMILY_HISTORY];

				//add the menus if they're not added yet

				if (!compMenu.containsMenuItem(groupConditionMenuId)) {
					//add menu item "group the component by condition"
					var groupCondition = new MenuSelection(groupConditionMenuId);
					groupCondition.setLabel(chxi18n.GRP_BY_CONDITION);
					groupCondition.setIsSelected(true);
					groupCondition.setClickFunction(function() {
						groupFamily.setIsSelected(false);
						groupCondition.setIsSelected(true);
						CERN_FAM_HISTORY_CONSOLIDATED.RenderComponentByCondition(component);
						component.renderTabDetails(tab);
					});
					compMenu.addMenuItem(groupCondition);
				}

				if (!compMenu.containsMenuItem(groupFamilyMenuId)) {
					//add menu item "group the component by family member"
					var groupFamily = new MenuSelection(groupFamilyMenuId);
					groupFamily.setLabel(chxi18n.GRP_BY_FAM_MEMBER);
					groupFamily.setIsSelected(false);
					groupFamily.setClickFunction(function() {
						groupFamily.setIsSelected(true);
						groupCondition.setIsSelected(false);
						CERN_FAM_HISTORY_CONSOLIDATED.RenderComponentByFamily(component);
						component.renderTabDetails(tab);
					});
					compMenu.addMenuItem(groupFamily);
				}

				//check whether the "group by condition" menu item is selected
				var menuArray = compMenu.getMenuItemArray();
				var menuItem = null;
				var isGroupByCondition = false;
				for (var i = menuArray.length; i--;) {
					menuItem = menuArray[i];
					if (menuItem.getId() === groupConditionMenuId && menuItem.isSelected()) {
						isGroupByCondition = true;
						break;
					}
				}
				//render the family history according to the group-by selection
				if (isGroupByCondition) {
					CERN_FAM_HISTORY_CONSOLIDATED.RenderComponentByCondition(this);
				}
				else {
					CERN_FAM_HISTORY_CONSOLIDATED.RenderComponentByFamily(this);
				}
				break;
			case this.HistoryComponentIndexObj.PREGNANCY_HISTORY:
				CERN_PREG_HISTORY_CONSOLIDATED.RenderComponent(this, recordData);
				break;
			case this.HistoryComponentIndexObj.PROCEDURE_HISTORY:
				this.setProceduresRecordData(recordData);
				CERN_PROCEDURE_CONSOLIDATED.RenderComponent(this);
				break;
			case this.HistoryComponentIndexObj.SOCIAL_HISTORY:
				CERN_SOCIAL_HISTORY_CONSOLIDATED.RenderComponent(this, recordData);
				break;
		}
	}
	else {
		MP_Util.LogScriptCallError(this, this, "mp_core.js", "XMLCclRequestCallBack");
		errMsg = [];
		var ss = null;
		var i18nCore = i18n.discernabu;
		errMsg.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", i18nCore.STATUS, ": ", this.status, "</li><li>", i18nCore.REQUEST, ": ", this.requestText, "</li>");
		var statusData = recordData.STATUS_DATA;
		if (statusData.SUBEVENTSTATUS.length && statusData.SUBEVENTSTATUS.length > 0) {
			for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
				ss = statusData.SUBEVENTSTATUS[x];
				errMsg.push("<li>", i18nCore.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18nCore.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18nCore.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18nCore.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
			}
		}
		else if (statusData.SUBEVENTSTATUS.length === undefined) {
			ss = statusData.SUBEVENTSTATUS;
			errMsg.push("<li>", i18nCore.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18nCore.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18nCore.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18nCore.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
		}
		errMsg.push("</ul>");
		text = MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(), errMsg + "<br />");
		this.loadTabData(null, text, historyIndex);
	}
};

/**
 * Override and call the base component refresh to reset segmented control.
 * @returns {undefined} Returns nothing
 */
HistoriesComponent.prototype.refreshComponent = function() {
	this.setDisplayHiDataInd(false);
	MPageComponent.prototype.refreshComponent.call(this);
};

/**
 * Map the Consoidated History object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "WF_CONSOL_HX" filter
 */
MP_Util.setObjectDefinitionMapping("WF_CONSOL_HX", HistoriesComponent);
