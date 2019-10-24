function DocumentComponent2Style() {
	this.initByNamespace("doc2");
}

DocumentComponent2Style.prototype = new ComponentStyle();
DocumentComponent2Style.prototype.constructor = ComponentStyle;
/**
 * The Document component will retrieve all documents associated to the encounter for the specified lookback days defined by the component.
 * @param {Criterion} criterion the Criterion object containing information about the patient and the encounter in context.
 * @returns {undefined} returns undefined
 */
function DocumentComponent2(criterion) {
	var docI18n = i18n.discernabu.documents_o2;
	//Setup the default settings applied for this component
	this.setStyles(new DocumentComponent2Style());
	this.setCriterion(criterion);
	this.setComponentLoadTimerName("USR:MPG.DOCUMENTS.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.DOCUMENTS.O2 - render component");
	this.setLookBackDropDown(true);
	this.setIncludeLineNumber(true);

	//Flag for pregnancy onset date lookback time frame
	this.setPregnancyLookbackInd(true);

	this.m_PowerNoteFavInd = false;
	this.clinicalLabel = docI18n.FACILITY_DEFINED;
	this.m_docImagesInd = false;

	//the list of all completed documents
	this.m_allCompletedDocList = [];
	//the list of all incomplete documents
	this.m_incompleteDocList = [];
	//the list of completed documents filtered by "My notes only" filter. When the filter is on, it's a list of "my" completed documents; otherwise it's all completed documents.
	this.m_filteredCompletedDocList = [];
	//the list of the patient submitted documents
	this.m_patRequestDocList = [];

	//initialize filters
	this.m_isMyNoteOnly = false;
	this.m_isByEncounter = false;
	//initialize sort indicator to indicate that the documents are sorted by service date time by default, in descending order, 10 = first column ("service date time"), descending order
	this.m_nSortInd = 10;

	//the side panel object
	this.m_sidePanel = null;
	//Flags that indicate whether the whole component or its child are focused. It's used in logics that hide the side panel when the component is blurred.
	this.m_isContainerFocused = false;
	this.m_isChildFocused = false;
	//the hashtable for caching the document preview content dispalyed in the side panel.
	this.m_documentDisplayCache = {};

	//offset adjustment for displaying the whole document row when Up/Down key is pressed
	this.m_offsetTopAdjustment = null;

	//this component defaults to display the last 50 notes
	this.m_lastXNoteCap = 50;
	//flag to indicate whether the component is currently showing last 50 notes
	this.m_showingLastXNotes = false;
	//display string for custom result range selection option
	this.m_resultRangeSelectionDisplayString = i18n.discernabu.render_strategy.LAST_N_NOTES;
	// Default the component to utilize the Last 50 Notes lookback option
	this.setLookbackUnits(this.m_lastXNoteCap);
	this.setLookbackUnitTypeFlag(ResultRangeSelectionUtility.CustomType);

	//As part of JIRA CERTMPAGES-2121  fix in MPageComponent.js the m_grouper_arr has been used directly which results in null pointer exception if m_grouper_arr.length accessed.
	this.m_grouper_arr = [];
	//flag indicating the status of the patient submitted documents checkbox
	this.m_patSubmittedDocsInd = true;
	// the array for document codes
	this.m_docsCodes = [];
	//the add documentation privilege indicator
	this.m_addDocPriv = 0;
	//the array for the add documentation priv exceptions
	this.m_adddDocPrivExptions = [];

	//the object for the MPageUI button for accepting a patient submitted document
	this.m_docAcceptButton = null;

	//the object for the MPageUI button for rejecting a patient submitted document
	this.m_docRejectButton = null;
}

DocumentComponent2.prototype = new MPageComponent();
DocumentComponent2.prototype.constructor = MPageComponent;

/**
 * This Function sets the clinical label for the component, a clinical label is the default filter name which can be defined in the bedrock
 * @param {string} value Clinical label
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.setClinicallabel = function(value) {
	this.clinicalLabel = value;
};

/**
 * In Powerchart, this Function opens the tab specified in bedrock.
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.openTab = function() {
	var criterion = this.getCriterion();
	var sParms = "/PERSONID=" + criterion.person_id + " /ENCNTRID=" + criterion.encntr_id + " /FIRSTTAB=^" + this.getLink() + "+^";
	APPLINK(0, criterion.executable, sParms);
};

/**
 * This Function gets the flag that indicates whether favorite Powernotes templates will be displayed in the dropdown menu.
 * @returns {boolean} The flag that indicates whether favorite Powernotes templates are needed
 */
DocumentComponent2.prototype.getPowerNoteFavInd = function() {
	return this.m_PowerNoteFavInd;
};

/**
 * This Function sets the flag that indicates whether favorite Powernotes templates will be displayed in the dropdown menu.
 * @param {boolean} value The flag that indicates whether favorite Powernotes templates are needed
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.setPowerNoteFavInd = function(value) {
	this.m_PowerNoteFavInd = (value === 1 ? true : false);
};

/**
 * This Function gets the flag that indicates whether document image URLs should be retrieved.
 * @returns {boolean} The flag that indicates whether document image URLs should be retrieved
 */
DocumentComponent2.prototype.getDocImagesInd = function(){
	return this.m_docImagesInd;
};


/**
 * Returns true if tagging is available within this component.
 * @returns {Boolean} True iff tagging can be performed from the document component
 */
DocumentComponent2.prototype.isTaggingEnabled = function(){
	var inMilleniumContext = CERN_Platform.inMillenniumContext();
	var taggingEnabled = MP_TaggingHandler && MP_TaggingHandler.isTaggingAvailable();
	var DocUtilsHelper = DocumentationUtils.getDocUtilsHelper();
	var cleanHtmlAvailable = DocUtilsHelper !== null && typeof DocUtilsHelper !== "undefined" && typeof DocUtilsHelper.CleanHtml !== "undefined";
	return inMilleniumContext && taggingEnabled && cleanHtmlAvailable;
};

/**
 * This Function sets the flag that indicates whether document image URLs should be retrieved.
 * @param {boolean} value The flag that indicates whether document image URLs should be retrieved
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.setDocImagesInd = function(value){
	this.m_docImagesInd = (value === 1 ? true : false);
};

/**
 * saves the View Outside Records preference in a session cookie
 * @param  {Boolean} value the preference for viewing  outside records
 * @returns {Undefined} returns undefined
 */
DocumentComponent2.prototype.setPatSubmittedDocsCheckBoxPref = function(value) {
	this.m_patSubmittedDocsInd = value;

	//save the View Outside Records indicator as a cookie
	//Note: it is not practical to use true/false because MP_Util.AddCookieProperty returns null for false
	var cookieValue = (value) ? 'yes' : 'no';
	MP_Util.AddCookieProperty(this.getComponentId(), "VIEW_PATIENT_SUBMITTED_DOCS", cookieValue);
	MP_Util.WriteCookie();
};

/**
 * gets the indicator for the View Outside Records preference. It also checks the session cookie for a saved value
 * @returns {Boolean} indicator for the View Outside Records preference.
 */
DocumentComponent2.prototype.getPatSubmittedDocsCheckBoxPref = function() {
	//check for an existing cookie value for the outside records preference
	var viewOutsideRecordsCookie = MP_Util.GetCookieProperty(this.getComponentId(),"VIEW_PATIENT_SUBMITTED_DOCS");
	if(viewOutsideRecordsCookie) {
		//set the view outside records preference
		this.setPatSubmittedDocsCheckBoxPref((viewOutsideRecordsCookie === 'yes') ? true : false);
	}
	return this.m_patSubmittedDocsInd;
};
/**
 * setter for the documents code member variable
 * @param {Array} codeArray the array containing the documents codes
 * @returns {Undefined} returns undefined
 */
DocumentComponent2.prototype.setDocumentsCodes = function(codeArray) {
	this.m_docsCodes = MP_Util.LoadCodeListJSON(codeArray);
};

/**
 * getter for the documents code member variable
 * @returns {Array} the array for the documents codes
 */
DocumentComponent2.prototype.getDocumentsCodes = function() {
	return this.m_docsCodes;
};

/**
 * setter for the add document privilege member variable
 * @param {Number} priv the value for the add document privilege
 * @returns {Undefined} returns undefined
 */
DocumentComponent2.prototype.setAddDocPriv = function(priv) {
	this.m_addDocPriv = priv;
};

/**
 * getter for the add document privilege member variable
 * @returns {Number} the value for the add document privilege
 */
DocumentComponent2.prototype.getAddDocPriv = function() {
	return this.m_addDocPriv;
};

/**
 * setter for the add documentation priv exceptions array
 * @param {Array} privExceptions the array containing the add documentation priv exceptions
 * @return {Undefined} returns undefined
 */
DocumentComponent2.prototype.setAdddDocPrivExptions = function(privExceptions) {
	this.m_adddDocPrivExptions = privExceptions;
};

/**
 * getter for the add documentation priv exceptions array
 * @returns {Array} the array containing the add documentation priv exceptions
 */
DocumentComponent2.prototype.getAdddDocPrivExptions = function() {
	return this.m_adddDocPrivExptions;
};

/**
 * checks the patient entered data bedrock filter and the "View  Outside Records" indicator to verify
 *  whether patient submitted documents should be displayed
 * @returns {Boolean} indicator whether patient submitted documents should be displayed.
 */
DocumentComponent2.prototype.isDisplayPatSubmittedDocsEnabled = function(){
	return (this.getPatientEnteredDataInd() && this.getPatSubmittedDocsCheckBoxPref());
};


/**
 * This Function resizes the component. It resizes the document table and the side panel when it's shown.
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.resizeComponent = function() {
	//reset the offset adjustment
	this.m_offsetTopAdjustment = null;

	var compID = this.getComponentId();
	//Call the base class functionality to resize the component
	MPageComponent.prototype.resizeComponent.call(this, null);

	var contentContainer = $("#" + this.getStyles().getContentId());
	//Adjust the component headers if scrolling is applied and adjust side panel if it's shown.
	var contentBody = contentContainer.find(".content-body");
	if(contentBody.length) {
		//Adjust the component headers if scrolling is applied
		var docHeader = $("#docHdrRow"+compID);
		var maxHeight = parseInt($(contentBody).css("max-height").replace("px", ""),10);
		var contentHeight = contentBody[0].scrollHeight;
		if(!isNaN(maxHeight) && contentHeight > maxHeight){
			docHeader.addClass("shifted");
		}
		else {
			docHeader.removeClass("shifted");
		}
	}
	//Adjust side panel
	this.resizeSidePanel();
	//Adjust iframe size if visible
	this.resizeSidePanelIFrame();
};

/**
 * Adjust the side panel's width and height based on available viewable area.
 * The side panel width is adjusted to show 3 left most columns of the component content, and cover the other columns.
 * The height is adjusted to reach the bottom of the viewing area even when the document content is very short.
 * When document contents exceeds the side panel, it will display a scrollbar on the side panel content contaner.
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.resizeSidePanel = function() {
	var compID = this.getComponentId();
	var sidePanel = this.m_sidePanel;
	if (sidePanel && this.m_selectedRowObj) {
		var viewContainer = $("#vwpBody");
		var componentContainer = $("#" + this.getStyles().getId());
		var contentContainer = $("#" + this.getStyles().getContentId());
		var contentBody = contentContainer.find(".content-body");
		var componentHeader = componentContainer.find(".sec-hd");
		var menuRow = componentContainer.find(".doc2-menu-row");
		var contentHeader = $("#docHdrRow" + this.getComponentId());
		var rowBorder = 2;
		var sidePanelWidth = contentBody.outerWidth() - contentHeader.find(".doc2-cat-hd").position().left + rowBorder;
		//resize the width, so the side panel covers all the Document columns except the left 2 columns
		sidePanel.m_parentContainer.width(sidePanelWidth);

		var miscPaddings = parseInt(componentContainer.css("padding-top").replace("px", ""), 10) + parseInt(contentContainer.css("padding-top").replace("px", ""), 10) + parseInt(contentContainer.css("padding-bottom").replace("px", ""), 10);
		var sidePanelContentContainer = sidePanel.m_sidePanelContents;
		var contentPaddingHeight = parseInt(sidePanelContentContainer.css("padding-top").replace("px", ""), 10) + parseInt(sidePanelContentContainer.css("padding-bottom").replace("px", ""), 10);
		//get the max height for the side panel
		var maxPanelHeight = viewContainer.height() - componentHeader.outerHeight() - menuRow.outerHeight() - miscPaddings - contentPaddingHeight;

		var actionBar = sidePanelContentContainer.find('.doc2-sp-action-holder');
		var actionBarHeight = actionBar.outerHeight() + parseInt(actionBar.css("margin-bottom").replace("px", ""), 10);
		var headerContainer = sidePanelContentContainer.find('.sp-header');
		var headerHeight = headerContainer.outerHeight();
		var viewingAreaMargins = parseInt($("#doc2SidePanelViewableContent" + compID).css("margin-top"), 10);

		var maxViewingHeight = maxPanelHeight - actionBarHeight - headerHeight - viewingAreaMargins;

		//resize the preview content's height. It will display the scroll bar is the content is long.
		$("#doc2SidePanelViewableContent" + compID).height(maxViewingHeight);
		//call side panel's resize
		sidePanel.resizePanel(maxPanelHeight + "px");
	}
};

/**
 * Resizes the iframe of the currently displayed side panel if created
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.resizeSidePanelIFrame = function() {
	var iframe;
	var eventId;
	if(this.m_sidePanel && this.m_selectedRowObj) {
		eventId = this.m_selectedRowObj.attr("data-eventid");
		if (eventId && this.m_documentDisplayCache[eventId]) {
			iframe = this.m_documentDisplayCache[eventId].iframe;
		}
		if (iframe) {
			iframe.resize();
		}
	}
};

/**
 * Create the filter mappings for the component
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.loadFilterMappings = function() {
	// Add the filter mapping object for the Documents Workflow component
	this.addFilterMappingObject("FACILITY_DEFINED_LABEL", {setFunction: this.setClinicallabel, type: "String", field: "FREETEXT_DESC"});
	this.addFilterMappingObject("WF_DOC_SPECIALTY_GRP1_LABEL", {setFunction: this.setGrp1Label, type: "String", field: "FREETEXT_DESC"});
	this.addFilterMappingObject("WF_DOC_SPECIALTY_GRP1_ES", {setFunction: this.setGrp1Criteria, type: "Array", field: "PARENT_ENTITY_ID"});
	this.addFilterMappingObject("WF_DOC_SPECIALTY_GRP2_LABEL", {setFunction: this.setGrp2Label, type: "String", field: "FREETEXT_DESC"});				
	this.addFilterMappingObject("WF_DOC_SPECIALTY_GRP2_ES", {setFunction: this.setGrp2Criteria, type: "Array", field: "PARENT_ENTITY_ID"});
	this.addFilterMappingObject("WF_DOC_SPECIALTY_GRP3_LABEL", {setFunction: this.setGrp3Label, type: "String", field: "FREETEXT_DESC"});
	this.addFilterMappingObject("WF_DOC_SPECIALTY_GRP3_ES", {setFunction: this.setGrp3Criteria, type: "Array", field: "PARENT_ENTITY_ID"});
	this.addFilterMappingObject("WF_DOC_SPECIALTY_GRP4_LABEL", {setFunction: this.setGrp4Label, type: "String", field: "FREETEXT_DESC"});
	this.addFilterMappingObject("WF_DOC_SPECIALTY_GRP4_ES", {setFunction: this.setGrp4Criteria, type: "Array", field: "PARENT_ENTITY_ID"});
	this.addFilterMappingObject("WF_DOC_SPECIALTY_GRP5_LABEL", {setFunction: this.setGrp5Label, type: "String", field: "FREETEXT_DESC"});
	this.addFilterMappingObject("WF_DOC_SPECIALTY_GRP5_ES", {setFunction: this.setGrp5Criteria, type: "Array", field: "PARENT_ENTITY_ID"});
	this.addFilterMappingObject("WF_DOC_SPECIALTY_GRP6_LABEL", {setFunction: this.setGrp6Label, type: "String", field: "FREETEXT_DESC"});
	this.addFilterMappingObject("WF_DOC_SPECIALTY_GRP6_ES", {setFunction: this.setGrp6Criteria, type: "Array", field: "PARENT_ENTITY_ID"});
	this.addFilterMappingObject("WF_DOC_SPECIALTY_GRP7_LABEL", {setFunction: this.setGrp7Label, type: "String", field: "FREETEXT_DESC"});
	this.addFilterMappingObject("WF_DOC_SPECIALTY_GRP7_ES", {setFunction: this.setGrp7Criteria, type: "Array", field: "PARENT_ENTITY_ID"});
	this.addFilterMappingObject("WF_DOC_SPECIALTY_GRP8_LABEL", {setFunction: this.setGrp8Label, type: "String", field: "FREETEXT_DESC"});
	this.addFilterMappingObject("WF_DOC_SPECIALTY_GRP8_ES", {setFunction: this.setGrp8Criteria, type: "Array", field: "PARENT_ENTITY_ID"});
	this.addFilterMappingObject("WF_DOC_SPECIALTY_GRP9_LABEL", {setFunction: this.setGrp9Label, type: "String", field: "FREETEXT_DESC"});
	this.addFilterMappingObject("WF_DOC_SPECIALTY_GRP9_ES", {setFunction: this.setGrp9Criteria, type: "Array", field: "PARENT_ENTITY_ID"});
	this.addFilterMappingObject("WF_DOC_SPECIALTY_GRP10_LABEL", {setFunction: this.setGrp10Label, type: "String", field: "FREETEXT_DESC"});
	this.addFilterMappingObject("WF_DOC_SPECIALTY_GRP10_ES", {setFunction: this.setGrp10Criteria, type: "Array", field: "PARENT_ENTITY_ID"});
	this.addFilterMappingObject("WF_DOC_POWERNOTE_FAVOR_IND", {setFunction: this.setPowerNoteFavInd, type: "Boolean", field: "FREETEXT_DESC"});
	this.addFilterMappingObject("WF_DOC_IMAGE_IND",{setFunction: this.setDocImagesInd, type: "BOOLEAN", field: "FREETEXT_DESC"});
	//add the filter mapping for patient submitted documents
	this.addFilterMappingObject("WF_PAT_ENTERED_CLIN_DOC",{setFunction : this.setPatientEnteredDataInd,type: "BOOLEAN",field : "FREETEXT_DESC"});
};

/**
 * This function is responsible for creating the disclaimer message that will be
 * shown to the user when the "Last 50 Notes" lookback option is selected
 * @returns {string} An i18n string for the disclaimer
 */
DocumentComponent2.prototype.createDisclaimerMessage = function() {
	//calculate the lookback display based on lookback type and unit.
	var lookbackDisplay = "";
	switch (this.getBrLookbackUnitTypeFlag()) {
	case 1:
		lookbackDisplay = i18n.discernabu.LAST_N_HOURS_LOWER.replace("{0}", this.getBrLookbackUnits());
		break;
	case 2:
		lookbackDisplay = i18n.discernabu.LAST_N_DAYS_LOWER.replace("{0}", this.getBrLookbackUnits());
		break;
	case 3:
		lookbackDisplay = i18n.discernabu.LAST_N_WEEKS_LOWER.replace("{0}", this.getBrLookbackUnits());
		break;
	case 4:
		lookbackDisplay = i18n.discernabu.LAST_N_MONTHS_LOWER.replace("{0}", this.getBrLookbackUnits());
		break;
	case 5:
		lookbackDisplay = i18n.discernabu.LAST_N_YEARS_LOWER.replace("{0}", this.getBrLookbackUnits());
		break;
	default:
		lookbackDisplay = (this.getScope() === 2) ? i18n.discernabu.SELECTED_VISIT_LOWER : i18n.discernabu.All_VISITS_LOWER;
	}
	//return the disclaimer with the appropriate lookback display
	return "* " + i18n.discernabu.documents_o2.DISCLAIMER.replace("{0}", this.m_lastXNoteCap).replace("{1}", lookbackDisplay);
};


/**
 * Add the custom lookback option before retrieving component data
 */
DocumentComponent2.prototype.preProcessing = function() {
	//call to ResultRangeSelectionUtility to add custom result range option in lookbackmenuitems of the component
	var customMenuItem = new ResultRangeSelection();
	customMenuItem.setType(ResultRangeSelectionUtility.CustomType);
	customMenuItem.setDirection(ResultRangeSelectionUtility.direction.BACKWARD);
	customMenuItem.setUnits(this.m_lastXNoteCap);
	customMenuItem.setScope(this.getScope());
	customMenuItem.setDisplay(this.m_resultRangeSelectionDisplayString);
	ResultRangeSelectionUtility.addCustomResultRangeSelectionItem(this, customMenuItem);
};

/**
 * Get the event set codes from the bedrock setting and user preference for data retrieval.
 * It will check the selected specialty filters and get the event set codes from them.
 * If no specialty filter is selected, it will get the event sets from the facility defined event set settings.
 * @returns {Array} event set array retrieved from the specialty filters
 */
DocumentComponent2.prototype.getComponentEventSets = function(){
	var eventSetArr = [];
	var bedrockFilterGroups = this.getGroups();
	//the facility defined event sets (default settings)
	var facEvents = (bedrockFilterGroups && bedrockFilterGroups.length > 0) ? bedrockFilterGroups[0].getEventSets() : [];
	var grouperCnt = this.m_grouper_arr.length;
	var grouperEventSetArr = null;
	var criteriaArray = this.m_grouperFilterCriteria;
	var grouperItem = null;

	//Check to see if we have any specialize document filters selected
	if (criteriaArray instanceof Array && criteriaArray.length) {
		//If Facility Defined View is selected add those event codes if they are any available
		if ($.inArray(this.clinicalLabel, criteriaArray) !== -1) {
			eventSetArr = eventSetArr.concat(facEvents);
		}

		//Add the event sets that are associated with all of the remaining selected filters
		for (var x = 0; x < grouperCnt; x++) {
			grouperItem = this.m_grouper_arr[x];
			if (grouperItem && $.inArray(grouperItem.label+x, criteriaArray) !== -1 ) {
				grouperEventSetArr = this.getGrouperCriteria(x);
				if (grouperEventSetArr) {
					eventSetArr = eventSetArr.concat(grouperEventSetArr);
				}
			}
		}
	}

	//When there are no filters selected (which is why eventSetArr is empty), we will utilize the default filters
	if(eventSetArr.length === 0){
		eventSetArr = eventSetArr.concat(facEvents);
	}

	return eventSetArr;
};

/**
 * This function is utilized to retrieve to data for the Documents-o2 component.
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.retrieveComponentData = function() {
	var criterion = this.getCriterion();
	var encntrSelection = 0.0;
	var loadDocImages = 0;
	var loadPowerNoteFavs = 0;
	//Always defer retrieving viewer type because ResultViewer API will load it on demand. It will help improve documents performance.
	var deferViewerTypeInd = 1;
	var eventSetArr = this.getComponentEventSets();
	//Prepare the parameter list for the script call
	encntrSelection = (this.getScope() === 2) ? (criterion.encntr_id + ".0") : "0.0";
	loadDocImages = (this.getDocImagesInd()) ? 1 : 0;
	if(this.isPlusAddEnabled()){
		loadPowerNoteFavs = this.getPowerNoteFavInd() ? 1 : 0;
	}

	// Determine the result cap based on the current lookback selection
	var lookbackUnits = this.getLookbackUnits();
	var lookbackType = this.getLookbackUnitTypeFlag();
	// See if we need to load the last 50 results
	if (lookbackType === ResultRangeSelectionUtility.CustomType) {
		lookbackUnits = this.getBrLookbackUnits();
		lookbackType = this.getBrLookbackUnitTypeFlag();
		this.m_showingLastXNotes = true;
	} else {
		this.m_showingLastXNotes = false;
	}
	var resultCap = (this.m_showingLastXNotes) ? this.m_lastXNoteCap : 40000;
	// the indicator whether patient submitted documents should be loaded or not
	var loadPatSubmittedDocs = 0;
	var patSubmittedDocTimer = null;
	if(this.isDisplayPatSubmittedDocsEnabled()) {
		loadPatSubmittedDocs = 1;
		//trigger the CAP timer for loading patient submitted documents.
		patSubmittedDocTimer = new CapabilityTimer("CAP:MPG Documents Load Patient Entered Data");
		patSubmittedDocTimer.capture();

		//If the scope is for all visits, need to get the viewable encounters here due to the interop service needing the encounter
		//  list for patient submitted documents, specifically in a "break the glass" scenario.
		if(this.getScope() === 1){
			var encntrs = criterion.getPersonnelInfo().getViewableEncounters();
			encntrSelection = (encntrs) ? "value(" + encntrs + ")" : encntrSelection;
		}
	}

	var paramArr = [
		"^MINE^",
		criterion.person_id + ".0",
		encntrSelection,
		criterion.provider_id + ".0",
		lookbackUnits,
		MP_Util.CreateParamArray(eventSetArr, 1),
		0.0,
		criterion.ppr_cd + ".0",
		lookbackType,
		loadDocImages,
		loadPowerNoteFavs,
		deferViewerTypeInd,
		resultCap,
		loadPatSubmittedDocs
	];

	var self = this;
	var loadTimer = new RTMSTimer(this.getComponentLoadTimerName(), this.getCriterion().category_mean);
	var renderTimer = new RTMSTimer(this.getComponentRenderTimerName(), this.getCriterion().category_mean);
	var scriptRequest = new ComponentScriptRequest();
	scriptRequest.setProgramName("MP_RETRIEVE_DOCUMENTS_JSON_DP");
	scriptRequest.setParameterArray(paramArr);
	scriptRequest.setComponent(this);
	scriptRequest.setLoadTimer(loadTimer);
	scriptRequest.setRenderTimer(renderTimer);
	//assign the response handler to gain full control on how 'Z' and 'F' status are handled.
	scriptRequest.setResponseHandler(function(scriptReply){
		self.renderComponent(scriptReply);
	});
	scriptRequest.performRequest();

	//clear the side panel cache
	this.m_documentDisplayCache = {};
};


/**
 * This function appends the powernotes dropdown list to component header.
 * It also creates the triangle button that the users click to show the dropdown.
 * @param {Array} powernotes a list of powernotes
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.appendDropDown = function(powernotes) {
	var uniqueComponentId = this.getStyles().getId();
	if(!powernotes || !powernotes.length) {
		return;
	}
	if($(this.getRootComponentNode()).find("#headerMenu" + uniqueComponentId).length) {
		return;
	}
	//create a span for the dropdown menu
	var dropDownSpan = Util.cep("span", {
		'className': 'drop-down-ctrl'
	});

	var link = Util.cep("a", {
		'className': 'drop-Down',
		'id': "headerMenu" + uniqueComponentId
	});
	var menu = Util.cep("div", {
		'id': uniqueComponentId + 'Menu',
		'className': 'form-menu menu-hide'
	});
	Util.ac(dropDownSpan, link);
	var sec = _g(this.getStyles().getId());

	var secCL = Util.Style.g("sec-hd", sec, "h2");
	var secSpan = secCL[0];
	//Append the chevron icon to the title.
	var secTitle = Util.Style.g("sec-title", secSpan, "span");
	var secTitleSpan = secTitle[0];
	Util.ac(link, secTitleSpan);
	Util.ac(secTitleSpan, secSpan);
	Util.ac(menu, secSpan);
	this.fillPowernotesMenu(powernotes);
};

/**
 * This function fills the powernotes dropdown menu,
 * and it attaches event listeners to each menu item. When a powernote is clicked,
 * it will launch the POWERNOTES object to create new notes.
 * @param {Array} powernotes A list of powernotes
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.fillPowernotesMenu = function (powernotes) {
	//load documents
	var uniqueComponentId = this.getStyles().getId();
	var criterion = this.getCriterion();
	var docDropId = "headerMenu" + uniqueComponentId;
	var docDrop = _g(docDropId);
	var numId = 0;
	powernotes.sort(function(obj1, obj2) {
		function checkStrings(s1, s2) {
			return (s1 === s2) ? 0 : ((s1 > s2) ? 1 : -1);
		}
		return checkStrings(obj1.DISPLAY.toUpperCase(), obj2.DISPLAY.toUpperCase());
	});

	var component = this;
	function handleDocumentClickFunction(encounterPathVal, ckiIdent, ckiSource, sourceIdent) {
		return function() {
			try {
				var PowerNoteMPageUtils = CERN_Platform.getDiscernObject("POWERNOTE");
				logger.logDiscernInfo(null, "POWERNOTE", "document.js", "addDocDet");
				if(PowerNoteMPageUtils) {
					//determine call based on Favorite type
					if (encounterPathVal===0) {
						PowerNoteMPageUtils.BeginNoteFromPrecompletedNote(parseFloat(criterion.person_id), parseFloat(criterion.encntr_id), parseFloat(sourceIdent));
					} else if (encounterPathVal === 1) {
						PowerNoteMPageUtils.BeginNoteFromEncounterPathway(parseFloat(criterion.person_id), parseFloat(criterion.encntr_id), ckiSource, ckiIdent);
					}
					component.retrieveComponentData();
				}
			} catch(exe) {
				alert('An error has occured calling DiscernObjectFactory("POWERNOTE"): ' + exe.name + ' ' + exe.message);
				return;
			}
		};
	}
	//Create the header menu
	var headerMenu = new Menu("headerMenu" + uniqueComponentId);
	headerMenu.setTypeClass("header-dropdown-menu");
	headerMenu.setAnchorElementId("headerMenu" + uniqueComponentId);
	headerMenu.setAnchorConnectionCorner(["bottom", "left"]);
	headerMenu.setContentConnectionCorner(["top", "left"]);
	headerMenu.setIsRootMenu(true);
	//Attach the click event to the header drop down
	$(docDrop).click(function(){
		if(!headerMenu.isActive()) {
			MP_MenuManager.showMenu("headerMenu" + uniqueComponentId);
		} else {
			MP_MenuManager.closeMenuStack(true);
		}
	});
	var pcNote = null;
	var headerMenuItem = null;
	for(var j = 0, l = powernotes.length; j < l; j++) {
		pcNote = powernotes[j];
		numId = numId + 1;
		//Create a menu item and add it
		headerMenuItem = new MenuSelection("pcnFavorite" + uniqueComponentId + "-" + j);
		headerMenuItem.setCloseOnClick(true);
		headerMenuItem.setClickFunction(handleDocumentClickFunction(pcNote.PRE_ENCPTH_VAL, pcNote.CKI_IDENT, pcNote.CKI_SRC, pcNote.SOURCE_IDENTIFIER));
		headerMenuItem.setLabel(pcNote.DISPLAY);
		headerMenu.addMenuItem(headerMenuItem);
	}
	MP_MenuManager.updateMenuObject(headerMenu);
};

/**
 * This function checks whether a string is blank - null, or undefined, or "", or a string with whitespaces.
 * @param {string} str The string to be checked
 * @returns {boolean} true if str is null or only contains spaces, false otherwise
 */
DocumentComponent2.prototype.isBlankString = function (str) {
	return (!str || /^\s*$/.test(str) );
};

/**
 * This function generats an HTML string for each document with its detail info (hover detail)
 * Create Document View link when isModify is false, or Modify Note link when true
 * @param {Object} docDataObj All required info for a document
 * @param {boolean} isInProgress Indicate whether it needs Modify Note button
 * @returns {string} HTML of a data row
 */
DocumentComponent2.prototype.singleRowDocHTML = function (docDataObj, isInProgress) {
	var docI18n = i18n.discernabu.documents_o2;
	var compNS = this.getStyles().getNameSpace();
	var docDataInfoExtId = (docDataObj.patSubmittedInd) ? docDataObj.interopData.EXT_DATA_INFO_ID : 0;
	var sHTMLArr = ["<h3 class='info-hd'>Document Information</h3><dl class='", compNS, "-info result-info' data-doc-info-ext-id='" + docDataInfoExtId + "' data-eventid='" + docDataObj.eventId + "'>"];
	// begin definition list
	var noteType = docDataObj.noteType;
	if (this.isBlankString(noteType)) {
		noteType = "&nbsp;";
	}
	var subject = docDataObj.subject;
	if (this.isBlankString(subject)) {
		subject = "&nbsp;";
	}
	var author = docDataObj.authorName;
	if (this.isBlankString(author)) {
		author = "&nbsp;";
	}
	var lastPrsnl = docDataObj.lastUpdatedBy;
	if (this.isBlankString(lastPrsnl)) {
		lastPrsnl = "&nbsp;";
	}

	var noteTypeHTML = "";
	// add note type
	if (isInProgress) {
		noteTypeHTML = "<dd class='doc2-cat in-progress'>"+ noteType + "<span class='comment'> (" + docI18n.IN_PROGRESS + ")</span>";
	} else {
		//remove the link <a class='doc2-viewer-link' href='#'>  + "</a>"
		noteTypeHTML = "<dd class='doc2-cat'>" + noteType;
	}
	if (docDataObj.docStatusMean === "MODIFIED" || docDataObj.docStatusMean === "ALTERED") {
		noteTypeHTML += "<span class='res-modified'>&nbsp;</span>";
	}
	noteTypeHTML+= "</dd>";

	sHTMLArr.push(
		// add date/time of service
		"<dd class='", compNS, "-dt'>", docDataObj.timeOfServiceDateDisplay, "</dd>",

		// add subject
		"<dd class='", compNS, "-subj'>", subject, "</dd>",

		//add note type
		noteTypeHTML,

		// add author
		"<dd class='", compNS, "-auth'>", author, "</dd>",

		// add last update date/time
		"<dd class='", compNS, "-updt-dt'>", docDataObj.lastUpdatedDateDisplay, "</dd>",

		// add last update personnel
		"<dd class='", compNS, "-updt-prsnl'>", lastPrsnl, "</dd>",

		// add image
		"<dd class='", compNS, "-image'>");


	// add svc event call for the image and end definition list
	if (docDataObj.imageUrl !== "") {
		sHTMLArr.push("<a class='", compNS, "-image-found'>&nbsp;</a></dd></dl>");
	}
	else {
		sHTMLArr.push("&nbsp;", "</dd></dl>");
	}

	return sHTMLArr.join("");
};

/**
 * It checks the selected filters from user preference, and marks the specialty filters/checkboxes as being selected.
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.refreshSpecialtyFilterDisplay = function() {
	var criteriaArray = this.m_grouperFilterCriteria;
	var compID = this.getComponentId();

	var groupLen = this.m_grouper_arr.length;
	var grouperItem = null;
	var z = 0;
	var isFilterSelected = false;
	var selectedSpecFilterCount = 0;
	//If there're selected filters, mark them as checked
	if (criteriaArray instanceof Array && criteriaArray.length) {
		for (z = 0; z < groupLen; z++) {
			grouperItem = this.m_grouper_arr[z];
			if(grouperItem){
				isFilterSelected = ($.inArray(grouperItem.label + z, criteriaArray) !==-1 );
				$('#specFil' + compID + z).prop('checked', isFilterSelected);
				if(isFilterSelected){
					selectedSpecFilterCount++;
				}
			}
		}

		var isFacilityDefinedSelected = ($.inArray(this.clinicalLabel, criteriaArray) !==-1);
		//if no specialty filters are selected (or selected specialty filters have expired), the Facility Defined needs to be selected
		if(selectedSpecFilterCount === 0){
			isFacilityDefinedSelected = true;
		}
		$('#facilityDefined' + compID).prop('checked', isFacilityDefinedSelected);
	} else {
		//if there're no selected filters, mark the facility defined filter as checked. Leave all specialty filters as unchecked.
		for (z = 0; z < groupLen; z++) {
			$('#specFil' + compID + z).prop('checked', false);
		}
		$('#facilityDefined' + compID).prop('checked', true);
	}
};

/**
 * Toggle the specialty filter panel.
 * The panel will show and the dropdown button will be highlighted when it's on.
 * The panel will hide and the dropdown button will be unhighlighted when it's off.
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.toggleSpecialtyFilterPanel = function(){
	var compID = this.getComponentId();
	var panel = $('#QFilterDiv' + compID);
	var specFilter = $('#doc-spec-filter' + compID);
	//when the filter panel is shown, it will be hidden, and the dropdown button won't be highlighted.
	if (specFilter.hasClass("doc2-visible")) {
		specFilter.removeClass("doc2-visible");
		panel.removeClass("doc2-qHvr-click");
	}
	else {
		//otherwise, the filter panel will be shown, and the dropdown button will display as highlighted.
		specFilter.addClass("doc2-visible");
		panel.removeClass("doc2-qFilter-hover").addClass("doc2-qHvr-click");
	}
};

/**
 * This function returns the label of the quick filter view depending on the selected filters.
 * ex: Single note type selected : Name of the note type is displayed as the label of the quick filter view.
 *     Multiple Note types selected : i18n "Multiple Note Types" is displayed as the label of the quick filter view.
 * @returns {string} label of the quick filter
 */
DocumentComponent2.prototype.getQuickFilterLabel = function() {
	var noteCount = 0;
	var docI18n = i18n.discernabu.documents_o2;
	var groupLen = this.m_grouper_arr.length;
	var grouperItem = null;
	//Default the quick filter label to "Facility Defined" (the default filter name)
	var noteStatus = this.clinicalLabel;

	//Check whether facility defined is selected in the user preference
	if (this.m_grouperFilterCriteria && $.inArray(this.clinicalLabel, this.m_grouperFilterCriteria) !==-1) {
		noteCount = noteCount + 1;
		noteStatus = this.clinicalLabel;
	}

	//Check whether any custmomized specialty filter is selected in the user preference
	//and update the label according to the number of selected filters.
	for (var z = 0; z < groupLen; z++) {
		grouperItem = this.m_grouper_arr[z];
		if (this.m_grouperFilterCriteria && grouperItem && $.inArray(grouperItem.label + z, this.m_grouperFilterCriteria) !==-1){
			noteCount++;
			//Quick filter label will be "mulitple notes" if mulitple filters are selected
			if (noteCount > 1) {
				noteStatus = docI18n.MULTIPLE_NOTES;
				break;
			}
			else {
				//if only one specialty filter is selected, the label will be this specialty filter's name
				noteStatus = this.m_grouper_arr[z].label;
			}
		}
	}

	return noteStatus;
};

/**
 * It renders the component when script reply is returned from backend
 * @param {ScriptReply} scriptReply Script reply object
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.renderComponent = function(scriptReply){
	try{
		if(!this.m_wasListenerAdded){
			CERN_EventListener.addListener(this, EventListener.EVENT_ADD_DOC, this.retrieveComponentData, this);
			this.m_wasListenerAdded = true;
		}
		var repStatus = scriptReply.getStatus();
		if (repStatus === "F") {
			var errMsg = scriptReply.getError();
			this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(), errMsg), "(0)");
		}
		else {
			var recordData = scriptReply.getResponse();
			//Display fav documents drop menu (disabled in browsers because launching powernotes is not supported there)
			if (this.isPlusAddEnabled() && CERN_Platform.inMillenniumContext()) {
				var favData = recordData.PRE_COMPLETED;
				if(favData){
					this.appendDropDown(favData);
				}
			}
			//Display document list
			this.processDocumentData(recordData);
			this.filterDocuments();
			var colNum = Math.floor(this.m_nSortInd / 10) - 1;
			this.sortDocuments(colNum, this.m_nSortInd % 2);
			this.displayComponent();
		}
	}catch (err) {
		logger.logJSError(err, this, "document-o2.js", "renderComponent");
		throw (err);
	}
};


/**
 * This function generates HTML markup for the row of headers of the document table.
 * Extra CSS styles can be applied on the content header when the parameter contentHeaderClass is specified.
 * @param {string} contentHeaderClass extra classes in the format of: " class1 class2"
 * @returns {string} header row HTML
 */
DocumentComponent2.prototype.generateHeaderRowHTML = function(contentHeaderClass) {
	var compNS = this.getStyles().getNameSpace();
	var docI18n = i18n.discernabu.documents_o2;
	var compID = this.getComponentId();
	var jsHTML = [];
	contentHeaderClass = contentHeaderClass || "";
	jsHTML.push(
		// begin header row
		"<div class='content-hdr ", contentHeaderClass, "'><dl class='", compNS, "-info-hdr hdr' id = 'docHdrRow", compID, "'>",
		// date/time of service header
		"<dd class='", compNS, "-info-hdr-sortIcon ", compNS, "-dt-hd'>", docI18n.DATE_TIME, "</dd>",
		// subject header
		"<dd class='", compNS, "-info-hdr-sortIcon ", compNS, "-subj-hd'>", docI18n.SUBJECT, "</dd>",
		// note type header
		"<dd class='", compNS, "-info-hdr-sortIcon ", compNS , "-cat-hd'>", docI18n.NOTE_TYPE, "</dd>",
		// author header
		"<dd class='", compNS, "-info-hdr-sortIcon ", compNS, "-auth-hd'>", docI18n.AUTHOR, "</dd>",
		// last update date/time header
		"<dd class='", compNS, "-info-hdr-sortIcon ", compNS, "-updt-dt-hd'>", docI18n.LAST_UPDATED, "</dd>",
		// last update personnel header
		"<dd class='", compNS, "-info-hdr-sortIcon ", compNS, "-updt-prsnl-hd'>", docI18n.LAST_UPDATED_BY, "</dd>",
		"</dl></div>");

	return jsHTML.join('');
};

/**
 * This function generates HTML for document rows when they're grouped by encounters.
 * And the encounters are ordered by the most recent encounter the first time it's called
 * @param {Array} docArray Array of document data objects
 * @returns {string} HTML of all the documents grouped by encounter
 **/
DocumentComponent2.prototype.generateGroupedRowsHTML = function(docArray) {
	/*
	 * Structure of Groups of Encounters:
	 * { 	Encntr_id (12345): {
	 * 			type : "Inpatient", location : "a room", docHTMLs : [doc_html]
	 * 		}
	 * }
	 */
	var docI18n = i18n.discernabu.documents_o2;
	var groups = {};
	var x = 0;
	var encntrDate;
	var groupType;
	var groupLocation;
	var curEnc;
	var encLength = this.ENCOUNTERS.length;
	var jsHTML = [];
	for ( x = 0; x < encLength; x++) {
		curEnc = this.ENCOUNTERS[x];
		//Deal with documents associated to encntr_id=0.00
		if (curEnc.ENCNTR_ID === 0.0) {
			encntrDate = "[" + docI18n.UNKOWN_DATE + "]";
			groupType = "[" + docI18n.UNKOWN_ENC_TYPE + "]";
			groupLocation = "[" + docI18n.UNKOWN_LOCATION + "]";
		}
		else {
			encntrDate = curEnc.isDateEmpty ? "[" + docI18n.UNKOWN_DATE + "]" : curEnc.encounterDate.format("shortDate3");
			groupType = curEnc.TYPE ? curEnc.TYPE : "[" + docI18n.UNKOWN_ENC_TYPE + "]";
			groupLocation = curEnc.LOCATION ? curEnc.LOCATION : "[" + docI18n.UNKOWN_LOCATION + "]";
		}
		groups[curEnc.ENCNTR_ID] = {
			"type": groupType,
			"location": groupLocation,
			"date": encntrDate,
			"docHTMLs": []
		};
	}
	for ( x = 0; x < docArray.length; x++) {
		if (groups.hasOwnProperty(docArray[x].encounterId)) {
			groups[docArray[x].encounterId].docHTMLs.push(docArray[x].rowHtml);
		}
		else {
			//Or document is associated with an encounter, which is magically deleted in database so it won't be in this.ENCOUNTERS
			groups[0.0].docHTMLs.push(docArray[x].rowHtml);
		}
	}
	var z = 0;
	for ( x = 0; x < encLength; x++) {
		var encID = this.ENCOUNTERS[x].ENCNTR_ID;
		var group = groups[encID];
		var groupLen = group.docHTMLs.length;
		if (groupLen) {
			//put group header
			//if displaying patient submitted docs is enabled a and there is the Chart documents section, use the secondary header style for group header.
			var groupHeaderClass = (this.isDisplayPatSubmittedDocsEnabled()) ? "sub-sec-hd doc2-secondary-hd" : "sub-sec-hd";
			jsHTML.push("<div class='sub-sec'><h3 class='" + groupHeaderClass + "'><span class='sub-sec-hd-tgl' title='", i18n.discernabu.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>");
			jsHTML.push("<dl><dd>", group.type, "</dd><dd>", group.location, "</dd><dd>", group.date, "</dd></dl>");
			jsHTML.push("</span></h3><div class='sub-sec-content'>");
			for ( z = 0; z < groupLen; z++) {
				//index 1 is true and refers to row 2 (even), while index 0 is false and refers to row 1 (odd)
				jsHTML.push("<div class='", z % 2 ? "even" : "odd", "'>", group.docHTMLs[z], "</div>");
			}
			//closing sub-sec-content and sub-sec div
			jsHTML.push("</div></div>");

		}
	}
	return jsHTML.join("");
};


/**
 * This function extracts information related to provider actions from a document,
 * including last updated date, last updated personnel, the author, the list of contributers,
 * and whether the current provider has modified the document.
 * @param {object} docObj Document data object
 * @param {number} curProviderId Current provider's ID
 * @returns {object} It encapsulates all information in an object, and each piece of information is its attribute, like:
 	{
		authorName:authorName,
		authorID: authorID,
		lastUpdatedBy:lastUpdatedBy,
		lastUpdatedDateTime: lastUpdatedDateObj,
		isModifiedByCurProvider: isModifiedByCurProvider,
		contributors: contributors
	}
*/
DocumentComponent2.prototype.extractActionProviderInfo = function(docObj, curProviderId) {
	var docI18n = i18n.discernabu.documents_o2;
	var lastUpdatedDateObj = null;
	var lastUpdatedBy = docI18n.UNKNOWN;
	var authorName = null;
	var authorID = 0.0;
	var contributors = [];
	var participant = null;
	var type_cd = null;
	var status_cd = null;
	var strPerform = "PERFORM";
	var strmodify = "MODIFY";
	var strCompleted = "COMPLETED";
	var actionPrsnlName = "";

	var isModifiedByCurProvider = false;
	var i = 0;
	var isContributorNew = false;
	//loops through the action provider array to get required information
	for (var x = docObj.ACTION_PROVIDERS.length; x--; ) {
		participant = docObj.ACTION_PROVIDERS[x];
		actionPrsnlName = participant.PRSNL_NAME;
		type_cd = participant.TYPE_CD_MEANING;
		status_cd = participant.STATUS_CD_MEANING;
		//Get the author name on a completed Perform action. Use the last qualified action in the action provider list.
		if ((type_cd === strPerform) && (status_cd === strCompleted) && !authorName) {
			authorName = actionPrsnlName;
			authorID = participant.PRSNL_ID;
		}

		//Get the latest action's personnel name and date/time
		if (!lastUpdatedDateObj || participant.DATE > lastUpdatedDateObj) {
			lastUpdatedDateObj = participant.DATE;
			lastUpdatedBy = actionPrsnlName;
		}

		//Check whether the document has been modified by the current provider
		if ((type_cd === strmodify) && (participant.PRSNL_ID === curProviderId)) {
			isModifiedByCurProvider = true;
		}

		//If the contributor is new, then add it to the array. It's done to get a list of unique contributors.
		//It uses linear scanning to check duplicates because it's faster than using object/hashtable in most browsers when the number of contributors is small. 
		isContributorNew = false;
		for(i = contributors.length; i--; ){
			if(contributors[i] === actionPrsnlName){
				isContributorNew = true;
				break;
			}
		}
		//only add a new contributor to avoid duplicates
		if(!isContributorNew){
			contributors.push(actionPrsnlName);
		}
	}

	//if author is not found, it will use "unknown"
	if(!authorName){
		authorName = docI18n.UNKNOWN;
	}

	//remove the author from the contributor list.
	for(i = contributors.length; i--; ){
		if(contributors[i] === authorName){
			//Because we don't have duplicates, once the author is found, remove it and it's done.
			contributors.splice(i,1);
			break;
		}
	}

	return {
		authorName: authorName,
		authorID: authorID,
		lastUpdatedBy: lastUpdatedBy,
		lastUpdatedDateTime: lastUpdatedDateObj,
		isModifiedByCurProvider: isModifiedByCurProvider,
		contributors: contributors
	};
};


/**
 * This function creates HTML string for the document menus and filters
 * @returns {string} HTML string of the menus and filters
 */
DocumentComponent2.prototype.createFilterHTML = function(){
	var compID = this.getComponentId();
	var i18nCore = i18n.discernabu;
	var compNS = this.getStyles().getNameSpace();
	var docI18n = i18n.discernabu.documents_o2;
	var jsHTML = [];
	var groupLen = this.m_grouper_arr.length;
	var filterId = "";

	jsHTML.push("<div class='", compNS, "-menu-row'>");
	// if the patient submitted documents bedrock setting is enabled, display the outside records checkbox
	if(this.getPatientEnteredDataInd()) {
		jsHTML.push("<span id = 'doc2OutsideRecsSec", compID, "' class = '", compNS, "-fil-group'><input id = 'doc2OutsideRecs", compID, "' type='checkbox'" + ((this.getPatSubmittedDocsCheckBoxPref()) ? " checked ='checked'": "") + " />", docI18n.VIEW_OUTSIDE_RECORDS, "</span>");
	}

	//my note only filter
	jsHTML.push("<span id = 'Doc2MyNotesOnlySec", compID, "' class = '", compNS, "-fil-group'><input id = 'Doc2MyNotesOnly", compID, "' type='checkbox' name='group'" + (this.m_isMyNoteOnly?" checked ='checked'": "") + " />", docI18n.MY_DOCUMENTS, "</span>");
	//group by encounter filter
	jsHTML.push("<span id = 'Doc2GroupByEncSec", compID, "' class = '", compNS, "-fil-group'><input id = 'Doc2GroupByEnc", compID, "' type='checkbox' name='group'" + (this.m_isByEncounter?" checked ='checked'":"") + " />", docI18n.By_ENCOUNTER, "</span>");

	//quick filter menu
	jsHTML.push("<span class='doc2-partition'>", docI18n.DISPLAY, ":</span><span id='QFilterDiv", compID, "' class = 'doc2-q-hover'>", this.getQuickFilterLabel(), "<span class='wrkflw-selectArrow'></span></span><div id='doc-spec-filter", compID, "' class='doc2-qfilter-panel'>");

	jsHTML.push("<div class='doc2-sec-separator'>");

	//specialty filters. It has been optimized to allow checking the box by clicking the containing row.
	//So the checkboxes use stopPropagation to prevent the container from trigger the click event again.
	filterId = 'facDefDiv' + compID;
	jsHTML.push("<div class='doc2-allfil' id='", filterId, "'><input id='facilityDefined", compID, "' type='checkbox' class='lb-mnu' />", this.clinicalLabel, "</div>");
	for (var z = 0; z < groupLen; z++) {
		if (this.getGrouperLabel(z)) {
			filterId = 'specFilOuterDiv' + compID + z;
			jsHTML.push("<div class='doc2-allfil' id='", filterId, "''><input id='specFil", compID, z, "' type='checkbox' class='lb-mnu' />", this.m_grouper_arr[z].label, "</div>");
		}
	}

	jsHTML.push("</div><div class='doc2-last-div'><span><a id ='Doc2-resetAll", compID, "' class='doc2-resetAll'>", i18nCore.RESET_ALL, "</a></span>");
	jsHTML.push("<span class='doc2-btn-div'><input class= 'doc2-btn' id='specCancel", compID, "' type='button' value='", docI18n.CANCEL, "' /></span>");
	jsHTML.push("<span class='doc2-btn-div'><input class= 'doc2-btn' id='specApply", compID, "' type='button' value='", docI18n.APPLY, "' /></span></div></div></div>");
	return jsHTML.join("");
};

/**
 * This function filters the documents from all completed documents according whether "My notes only" is selected.
 * The filtered documents are saved in the filter completed document list variable.
 * When the filter is not selected, it will simply use all completed document.
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.filterDocuments = function() {
	var allCompletedDocs = this.m_allCompletedDocList;
	var filteredCompletedDocs = [];

	if (this.m_isMyNoteOnly) {
		// Display only the documents which are created or modified by the current user.
		for (var i = 0, len= allCompletedDocs.length; i < len; i++) {
			//get the record with the modified field indicator
			if (allCompletedDocs[i].isMyNote) {
				filteredCompletedDocs.push(allCompletedDocs[i]);
			}
		}
	}
	else {
		//Display documents created by all authors if the check box is unchecked.
		filteredCompletedDocs = allCompletedDocs;
	}
	this.m_filteredCompletedDocList = filteredCompletedDocs;
};

/**
 * It renders the document component UI based on the document data and filter selection.
 * After component HTML is finalized, it initializes the sorting indicator, attaches event listeners, and initializes the filters.
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.displayComponent = function() {
	var compNS = this.getStyles().getNameSpace();
	var docI18n = i18n.discernabu.documents_o2;
	var jsHTML = [];
	var incompletedDocs = this.m_incompleteDocList;
	var filteredCompletedDocs = this.m_filteredCompletedDocList;
	var pendingCnt = incompletedDocs.length;
	var signedCnt = filteredCompletedDocs.length;
	var patSubmittedCnt = this.m_patRequestDocList.length;

	//reset the side panel cache when entering the preview pane view
	this.m_sidePanel = null;
	this.m_selectedRowObj = null;

	//check whether patient request is enabled
	var displayPatSubmittedDocsInd = this.isDisplayPatSubmittedDocsEnabled();

	var countText = "";
	//Create menu items and filter/groups documents
	jsHTML.push(this.createFilterHTML());
	//initialize variables for the disclaimer
	var disclaimerMessage = "<div class='doc2-disclaimer'>" + this.createDisclaimerMessage() + "</div>";
	var footnote = "";

	//Create the wrapper for side panel. Left side will be the original component and right side will be the panel.
	jsHTML.push("<div class='doc2-table-content'>");
	//Use content-body borders only in table view
	var extraClass = "";

	var chartDocsCount = pendingCnt + signedCnt;

	//display the header row only if some documents were found
	if(chartDocsCount + patSubmittedCnt) {
		//mark CSS classes in header and content-body so they will apply more paddings and be aligned with data columns
		if (this.m_isByEncounter && signedCnt) {
			extraClass = " grouped";
		}
		//mark CSS so header and content-body get extra left paddings
		if (pendingCnt && signedCnt) {
			extraClass += " with-section-header";
		}

		jsHTML.push(this.generateHeaderRowHTML(extraClass));
	}


	if(displayPatSubmittedDocsInd + chartDocsCount === 0){
		jsHTML.push("<span class='res-none'>", docI18n.NO_RESULTS_FOUND, "</span>");
	}else{
		jsHTML.push("<div class='content-body doc2-table-view", extraClass, "'>");

		if(displayPatSubmittedDocsInd) {
			//if patient request is enabled, create patient request table section
			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='doc2-pat-req-icon'>&nbsp;</span><span class='sub-sec-title doc2-section-title'>");
			jsHTML.push(docI18n.PATIENT_SUBMITTED_DOCUMENTS + "</span> <span>(" + patSubmittedCnt + ")</span></h3><div class='sub-sec-content'>");
			//add all the patient submitted documents to the section
			if(patSubmittedCnt) {
				for (var j = 0; j < patSubmittedCnt; j++) {
					jsHTML.push("<div class='", j % 2 ? "even" : "odd", "'>", this.m_patRequestDocList[j].rowHtml, "</div>");
				}
			}
			else{
				jsHTML.push("<span class='res-none'>", docI18n.NO_RESULTS_FOUND, "</span>");
			}
			jsHTML.push("</div></div>");

			//if patient request is enabled, create section header for chart documents
			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title doc2-section-title'>");
			jsHTML.push(docI18n.CHART_DOCUMENTS + "</span> <span>(" + chartDocsCount + ")</span></h3><div class='sub-sec-content'>");
		}

		//Compose HTML for chart documents
		if (chartDocsCount) {
			if (pendingCnt) {
				for (var i = 0; i < pendingCnt; i++) {
					jsHTML.push("<div class='", i % 2 ? "even" : "odd", "'>", this.m_incompleteDocList[i].rowHtml, "</div>");
				}
				//Only show the section title when both pending docs and completed docs are available
				if (signedCnt) {
					jsHTML.push("<div class='sub-sec-hd ", compNS, "-section-title'>", docI18n.COMPLETED_DOCS, "</div>");
				}
			}

			if (signedCnt) {
				if (this.m_isByEncounter) {
					jsHTML.push(this.generateGroupedRowsHTML(filteredCompletedDocs));
				}
				else {
					for (var x = 0; x < filteredCompletedDocs.length; x++) {
						//index 1 is true and refers to row 2 (even), while index 0 is false and refers to row 1 (odd)
						jsHTML.push("<div class='", x % 2 ? "even" : "odd", "'>", filteredCompletedDocs[x].rowHtml, "</div>");
					}
				}
			}
		}
		else {
			jsHTML.push("<span class='res-none'>", docI18n.NO_RESULTS_FOUND, "</span>");
		}

		//close the  table view container
		jsHTML.push("</div>");
	}

	// Create the footnote if showing Last X lookback option and there're results
	if (this.m_showingLastXNotes) {
		footnote = disclaimerMessage;
	}

	//close tags for the chart documents section if patient submitted docuemnts are enabled
	if(displayPatSubmittedDocsInd) {
		jsHTML.push("</div></div>");
	}

	if(chartDocsCount) {
		jsHTML.push(footnote);
	}

	//Add the place holder for the side panel
	jsHTML.push("<div id='doc2SidePanel" + this.getComponentId() + "' class='doc2-side-panel'>&nbsp;</div></div>");
	var totalDocsCount = pendingCnt + signedCnt + patSubmittedCnt;
	countText = MP_Util.CreateTitleText(this, totalDocsCount);
	this.finalizeComponent(jsHTML.join(""), countText);
	// update count text in the navigation pane
	CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
		"count": totalDocsCount
	});

	//Display sorting icon indicator on the sorted column
	this.displayCurrentSortIndicator(this.m_nSortInd);

	// attach listeners
	this.attachListeners();

	//attach the hover event for the quick filters.
	this.qFilterHover();

	//update the specialty filters' checkbox status
	this.refreshSpecialtyFilterDisplay();
};


/**
 * This function checks the current sorting order of a column. If the column is currently sorted in
 * ascending order, it returns 1. If the component is not sorted on this column, or is sorted in descending
 * order on this column, it return 0.
 * @param {number} colNum The column number.
 * @returns {number} The order of sorting, 0 for descending and 1 for ascending.
 */
DocumentComponent2.prototype.checkSortingOrder = function(colNum) {
	var compID = this.getComponentId();
	var headerColumn = $('#docHdrRow' + compID).find(".doc2-info-hdr-sortIcon").eq(colNum);
	//check the current class of the clicked column to find out what its current sorting status is.
	if(headerColumn.hasClass("ascend")){
		//find the sorting order is ascending
		return 1;
	} else {
		//otherwise the sorting order is descending
		return 0;
	}
};

/**
 * This function sorts the document object arrays according to the column and descending/ascending order.
 * @param {number} colNum The column number.
 * @param {number} newSortOrder Sorting order, 0 for descending and 1 for ascending.
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.sortDocuments = function(colNum, newSortOrder) {
	var sortOrd = -1;
	//If newSortOrder is specified, use the it. Otherwise check the current sorting order and use the opposite order.
	if(typeof newSortOrder !== "undefined") {
		sortOrd = newSortOrder;
	} else {
		//Use the opposite sorting order. 0 for descending and 1 for ascending.
		sortOrd = 1- this.checkSortingOrder(colNum);
	}

	var sortRes = 0;
	switch (colNum) {
		case 0:
			//Date of Service
			function sortByDate(a, b) {
				if (a.timeOfServiceDateObj < b.timeOfServiceDateObj) {
					sortRes = 1;
					if (sortOrd === 1) {
						sortRes = sortRes * -1;
					}
					return sortRes;
				}
				else if (a.timeOfServiceDateObj > b.timeOfServiceDateObj) {
					sortRes = -1;
					if (sortOrd === 1) {
						sortRes = sortRes * -1;
					}
					return sortRes;
				}
				return 0;
			}

			this.m_incompleteDocList.sort(sortByDate);
			this.m_filteredCompletedDocList.sort(sortByDate);
			this.m_patRequestDocList.sort(sortByDate);
			break;

		case 1:
			// Subject
			function sortBySubject(a, b) {
				if (a.subject.toUpperCase() < b.subject.toUpperCase()) {
					sortRes = 1;
				}
				else {
					sortRes = -1;
				}
				if (sortOrd === 1) {
					sortRes = sortRes * -1;
				}
				return sortRes;
			}

			this.m_incompleteDocList.sort(sortBySubject);
			this.m_filteredCompletedDocList.sort(sortBySubject);
			this.m_patRequestDocList.sort(sortBySubject);
			break;
		case 2:
			// Note Type
			function sortByNoteType(a, b) {
				if (a.noteType.toUpperCase() < b.noteType.toUpperCase()) {
					sortRes = 1;
				}
				else {
					sortRes = -1;
				}
				if (sortOrd === 1) {
					sortRes = sortRes * -1;
				}
				return sortRes;
			}

			this.m_incompleteDocList.sort(sortByNoteType);
			this.m_filteredCompletedDocList.sort(sortByNoteType);
			this.m_patRequestDocList.sort(sortByNoteType);
			break;
		case 3:
			// Author Name
			function sortByAuthorName(a, b) {
				// autuer = French("author")
				var auteurA = a.authorName.toUpperCase(),
				auteurB = b.authorName.toUpperCase();

				if (auteurA < auteurB) {
					sortRes = 1;
					if (sortOrd == 1) {
						sortRes = sortRes * -1;
					}
					return sortRes;
				}
				else if (auteurA > auteurB) {
					sortRes = -1;
					if (sortOrd === 1) {
						sortRes = sortRes * -1;
					}
					return sortRes;
				}
				/*
				 *when a.authorName == b.authorName, use date as a secondary order. And displays the most recent
				 * document on top
				 */
				if (a.timeOfServiceDateObj > b.timeOfServiceDateObj) {
					return -1;
				}
				if (a.timeOfServiceDateObj < b.timeOfServiceDateObj) {
					return 1;
				}
				return 0;
			}

			this.m_incompleteDocList.sort(sortByAuthorName);
			this.m_filteredCompletedDocList.sort(sortByAuthorName);
			this.m_patRequestDocList.sort(sortByAuthorName);
			break;
		case 4:
			// Update Date/Time
			function sortByUpdateDateTime(a, b) {
				if (a.lastUpdatedDateObj < b.lastUpdatedDateObj) {
					sortRes = 1;
					if (sortOrd === 1) {
						sortRes = sortRes * -1;
					}
					return sortRes;
				}
				else if (a.lastUpdatedDateObj > b.lastUpdatedDateObj) {
					sortRes = -1;
					if (sortOrd === 1) {
						sortRes = sortRes * -1;
					}
					return sortRes;
				}
				return 0;
			}

			this.m_incompleteDocList.sort(sortByUpdateDateTime);
			this.m_filteredCompletedDocList.sort(sortByUpdateDateTime);
			this.m_patRequestDocList.sort(sortByUpdateDateTime);
			break;
		case 5:
			// Update Personnel
			function sortByUpdatePersonnel(a, b) {
				var prsnlA = a.lastUpdatedBy.toUpperCase(), prsnlB = b.lastUpdatedBy.toUpperCase();

				if (prsnlA < prsnlB) {
					sortRes = 1;
					if (sortOrd === 1) {
						sortRes = sortRes * -1;
					}
					return sortRes;
				}
				else if (prsnlA > prsnlB) {
					sortRes = -1;
					if (sortOrd === 1) {
						sortRes = sortRes * -1;
					}
					return sortRes;
				}
				/*
				 *when a.lastUpdatedBy == b.lastUpdatedBy, use date as a secondary order. And displays the most recent
				 * document on top
				 */
				if (a.timeOfServiceDateObj > b.timeOfServiceDateObj) {
					return -1;
				}
				if (a.timeOfServiceDateObj < b.timeOfServiceDateObj) {
					return 1;
				}
				return 0;
			}

			this.m_incompleteDocList.sort(sortByUpdatePersonnel);
			this.m_filteredCompletedDocList.sort(sortByUpdatePersonnel);
			this.m_patRequestDocList.sort(sortByUpdatePersonnel);
			break;
	}
	//save the sorting indicator. The first digit represent the column, and second digit represent the sorting order.
	this.m_nSortInd = (colNum + 1) * 10 + sortOrd;
};

/**
 * This function will display the current sorting icon indicator on the sorted column.
 * @param {number} nSortInd number to indicator which column and ascending/descending
 * 			(i.e. 11: 1st column (name), ascending
 *				  12: 1st column (name), descending
 *@returns {undefined} returns undefined
 */
DocumentComponent2.prototype.displayCurrentSortIndicator = function(nSortInd) {
	var compID = this.getComponentId();

	var columnIndex = Math.floor(nSortInd/10) - 1;
	var sortingStyle = nSortInd % 2 ? "ascend" : "descend";
	$('#docHdrRow' + compID).find(".doc2-info-hdr-sortIcon").eq(columnIndex).addClass(sortingStyle);
};

/**
 * Hides the side panel if it is currently open
 * @return {undefined}
 */
DocumentComponent2.prototype.hideSidePanel = function() {
	if(this.m_selectedRowObj){
		this.selectDocument(this.m_selectedRowObj);
	}
};

/**
 * Attaches listners to:
 * 	the "My Documents" check box
 *	the "Group By Encounters" check box
 * 	the headings for sorting
 * 	the "Note Type" to launch a clinicial note viewer
 *	sub-section toggles
 *  SidePanel to allow auto hide,
 *  component content to allow navigating to previous/next document via keyboard
 *  @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.attachListeners = function() {
	var compID = this.getComponentId();
	var component = this;

	// attach listeners to content header to allow sorting
	$('#docHdrRow' + compID).on("click", '.doc2-info-hdr-sortIcon', function(){
		var columnIndex = $(this).index();
		component.sortDocuments(columnIndex);
		component.displayComponent();
		//Resize the component since the component contents have changed
		component.resizeComponent();
	});

	// attach listener to specialty filter reset button
	$('#Doc2-resetAll' + compID).click(function() {
		var groupLen = component.m_grouper_arr.length;
		for (var z = 0; z < groupLen; z++) {
			$('#specFil' + compID + z).prop('checked', false);
		}
		$('#facilityDefined' + compID).prop('checked', true);
	});

	//attach  the event listener for the outside records filter
	$("#doc2OutsideRecsSec" + compID).click(function() {
		var isChecked = component.getPatSubmittedDocsCheckBoxPref();
		component.setPatSubmittedDocsCheckBoxPref(!isChecked);
		component.retrieveComponentData();
	});

	// attach listeners to my documents filter
	$('#Doc2MyNotesOnlySec' + compID).click(function() {
		//toggle the flag
		component.m_isMyNoteOnly = !component.m_isMyNoteOnly;
		component.filterDocuments();
		var colNum = Math.floor(component.m_nSortInd / 10) - 1;
		component.sortDocuments(colNum, component.m_nSortInd % 2);
		component.displayComponent();
		//Resize the component since the component contents have changed
		component.resizeComponent();
	});

	// attach listeners to group by encounters filter
	$('#Doc2GroupByEncSec' + compID).click(function() {
		//toggle the flag
		component.m_isByEncounter = !component.m_isByEncounter;
		component.displayComponent();
		//Resize the component since the component contents have changed
		component.resizeComponent();
	});

	// attach listeners to specialty filters to allow checking the checkbox by clicking on its row container
	$('.doc2-allfil').click(function(event) {
		//if the element being clicked on is the checkbox, do nothing
		var targetObj = $(event.target);
		if (targetObj.is(":checkbox")) {
			return;
		}

		//otherwise, simulate the checkbox click
		var insideCheckbox = $(this).find(":checkbox");
		insideCheckbox.prop("checked", !insideCheckbox.prop('checked'));
	});

	// attach listeners to cancel button in the quickFilter.
	$('#specCancel' + compID).click(function() {
		component.refreshSpecialtyFilterDisplay();
		component.toggleSpecialtyFilterPanel();
	});

	// attach listeners to the quickFilter.
	$('#QFilterDiv' + compID).click(function() {
		component.toggleSpecialtyFilterPanel();
	});
	// attach listeners to apply button in the quickFilter.
	$('#specApply' + compID).click(function() {
		var selectedFilters = [];
		var groupLen = component.m_grouper_arr.length;
		var z = 0;
		var specialtyFilter = null;
		//Put the selected filters into m_grouperFilterCriteria, which will be saved to DB as user preference later
		for (z = 0; z < groupLen; z++) {
			specialtyFilter = _g('specFil' + compID + z);
			if (specialtyFilter && specialtyFilter.checked) {
				selectedFilters.push(component.m_grouper_arr[z].label + z);
			}
		}

		//checking if the facility defined view is selected.
		var facilityDefinedFilter = _g('facilityDefined' + compID);
		if (facilityDefinedFilter && facilityDefinedFilter.checked) {
			selectedFilters.push(component.clinicalLabel);
		}

		//hide the side panel if it's open
		component.hideSidePanel();

		MP_Util.LoadSpinner('doc2Content'+compID);

		//hide the specialty filter panel
		component.toggleSpecialtyFilterPanel();

		//save the preference to DB before making data retrieving
		component.m_grouperFilterCriteria = selectedFilters;
		MP_Core.AppUserPreferenceManager.SaveCompPreferences(compID);
		component.retrieveComponentData();
	});

	//The order the events fire are important to ensure the header row gets shifted correctly
	//if expanding a subsection creates a scrollbar (or collapsing hides it).
	//In IE9 and other modern browsers, events fire in the order they were added.
	//IE7 however, either chooses randomly, or fires in the reverse order, so it is necessary to
	//combine the two separate events into one event.
	$("#" + component.getStyles().getContentId() + " .content-body .sub-sec-hd-tgl").each(function() {
		//Unbinding existing click event from the expand/collapse toggles for this component.
		//Using get(0) so the Healthe library can correctly read the element.
		//get(0) will always work since this is within 'each'
		Util.removeEvent($(this).get(0), "click", MP_Util.Doc.ExpandCollapse);

		$(this).on("click.doc2", function() {
			//Reimplement the expand/collapse functionality from mpage-core
			var i18nCore = i18n.discernabu;
			if ($(this).closest(".sub-sec").hasClass("closed")) {
				$(this).closest(".sub-sec").removeClass("closed");
				$(this).html("-");
				$(this).attr("title", i18nCore.HIDE_SECTION);
			}
			else {
				$(this).closest(".sub-sec").addClass("closed");
				$(this).html("+");
				$(this).attr("title", i18nCore.SHOW_SECTION);
			}
			//Logic to determine if header should shift
			component.resizeComponent();
		});
	});

	var sidePanelParentContainer = $('#doc2SidePanel' + compID);

	// attach listener to "Open Document" button
	sidePanelParentContainer.on("click", ".sp-button", function(){
		var currentRow = component.m_selectedRowObj;
		//hide the side panel. Otherwise it will block the result viewer in browser.
		component.selectDocument(currentRow);

		var eventId = parseInt(currentRow.attr('data-eventid'), 10);
		var categoryMean = component.getCriterion().category_mean;

		if(component.isIncompleteDocument(eventId) && CERN_Platform.inMillenniumContext()) {
			//if it's an incomplete document and it's in Powerchart, launch the editor.
			DocumentComponent2.LaunchDocumentEditor(eventId, categoryMean);
		} else {
			//if it's not an incomplete document, or in browsers launch the viewer
			DocumentComponent2.LaunchDocumentViewer(eventId, categoryMean);
		}
	});

	// attach listener to the rows to click and double click on rows
	var displaySidePanelTimeout = null;
	var componentTable = $("#" + component.getStyles().getContentId() + " .content-body");
	// single click shows the side panel.
	componentTable.on("click", ".doc2-info", function(event){
		//Check the most specific element that was clicked on. $(this) is not used because it only gets the doc2-info row.
		var targetObj = $(event.target || event.srcElement);
		var rowObj = null;
		var eventId = 0;
		var categoryMean = component.getCriterion().category_mean;

		if(targetObj.hasClass('doc2-image-found')){
			rowObj = targetObj.parent().parent();
			eventId = rowObj.attr("data-eventid");
			eventId = parseInt(eventId, 10);
			DocumentComponent2.LaunchDocumentImageViewer(eventId, categoryMean);
			return;
		} else {
			rowObj = $(this);
			eventId = rowObj.attr("data-eventid");
			eventId = parseInt(eventId, 10);
			//when single click is detected, show the side panel very soon unless a double click is detected.
			if(displaySidePanelTimeout === null){
				displaySidePanelTimeout = setTimeout(function(){
					component.selectDocument(rowObj);
					displaySidePanelTimeout = null;
				}, 200);
			}
		}
	});

	// double click launches the document viewer
	componentTable.on("dblclick",".doc2-info", function(event){
		if(displaySidePanelTimeout){
			//When double click is detected, cancel the single click handler, and launch document viewer
			clearTimeout(displaySidePanelTimeout);
			displaySidePanelTimeout = null;
		}

		//Check the most specific element that was clicked on. $(this) is not used because it only gets the doc2-info row.
		var targetObj = $(event.target || event.srcElement);
		if(targetObj.hasClass('doc2-image-found')) {
			return;
		}
		var rowObj = $(this);
		var eventId = parseInt(rowObj.attr("data-eventid"), 10);
		var categoryMean = component.getCriterion().category_mean;
		//hide the side panel if open
		component.hideSidePanel();
		//launch the document editor or viewer
		if(component.isIncompleteDocument(eventId) && CERN_Platform.inMillenniumContext()){
			//if it's an incomplete document and it's in Powerchart, launch the editor.
			//Edit mode is not supported in browsers yet.
			DocumentComponent2.LaunchDocumentEditor(eventId, categoryMean);
		} else {
			//if it's not an incomplete document, or in browsers launch the viewer
			DocumentComponent2.LaunchDocumentViewer(eventId, categoryMean);
		}
	});

	// attach the listener to the component container, when it loses focus it will hide the side panel.
	// it is designed to avoid performance issue in DynDoc component that occurs when there's absolute positioning elements on the page.

	//get the component container object (including the header and the content)
	var componentContainer = $("#" + component.getStyles().getId());
	//Initialize the container to be focusable and remove previous side panel related event listeners
	componentContainer.attr("tabindex", 1).off(".doc2sp");

	// attach listener to the rows to allow navigating to prev/next row via keyboard
	componentContainer.on("keydown.doc2sp", function(event) {
		var selectedRow = component.m_selectedRowObj;
		//ignore the key event if no row is currently selected.
		if(!selectedRow){
			return;
		}

		//get the zebra striping container with even/odd class, which wraps the selected row.
		var zebraContainer = selectedRow.parent();
		var zebraParent = null;
		var subsecContainer = null;
		var rowCount = 0;

		//When UP key is pressed
		if(event.keyCode === 38) {
			event.preventDefault();
			var prevRow = zebraContainer.prev();
			//if it's already the top row of its container, check whether it belongs to a group-by-encounter subsection.
			//If so it will go up 2 levels to the subsection level, and check the previous element
			if(prevRow.length === 0){
				zebraParent = zebraContainer.parent();
				if(zebraParent.hasClass("sub-sec-content")) {
					subsecContainer = zebraParent.parent();
					//confirm that row is the top of the encounter subsection.
					//and let it be the previous element: it could be the "Completed" subsection below the incomplete notes, or another encounter subsection, or nothing
					if(subsecContainer.hasClass("sub-sec")) {
						prevRow = subsecContainer.prev();
					}
				}
			}

			//if the previous element exists, find a document row there and open the side panel.
			if(prevRow.length){
				//skip the "Completed" subsection row that separates incomplete notes and completed notes
				if(prevRow.hasClass("doc2-section-title")) {
					prevRow = prevRow.prev();
				}

				//so the final row may contain one or multiple document rows, depending on whether it belongs to a subsection
				var rowsAbove = prevRow.find(".doc2-info");
				rowCount = rowsAbove.length;
				if(rowCount){
					component.selectDocument(rowsAbove.eq(rowCount - 1));
				}
			}
		} else if(event.keyCode === 40) {
			event.preventDefault();
			//When DOWN key is pressed
			var nextRow = zebraContainer.next();
			//if it's already the bottom row of its container, check whether it belongs to a group-by-encounter subsection.
			//If so it will go up 2 levels to the subsection level, and check the next element
			if(nextRow.length === 0){
				zebraParent = zebraContainer.parent();
				if(zebraParent.hasClass("sub-sec-content")){
					subsecContainer = zebraParent.parent();
					//confirm that row is the bottom of the encounter subsection.
					//and let it be the next element: it could be another encounter subsection, or nothing
					if(subsecContainer.hasClass("sub-sec")){
						nextRow = subsecContainer.next();
					}
				}
			}

			//if the next element exists, find a document row there and open the side panel.
			if(nextRow.length){
				//skip the "Completed" subsection row that separates incomplete notes and completed notes
				if(nextRow.hasClass("doc2-section-title")){
					nextRow = nextRow.next();
				}

				//so the final row may contain one or multiple document rows, depending on whether it belongs to a subsection
				var rowsBelow = nextRow.find(".doc2-info");
				if(rowsBelow.length){
					component.selectDocument(rowsBelow.eq(0));
				}
			}
		}
	});
};

/**
 * Handles the logic to Display a border on the hover for the quick filters.
 * @param {Integer} compID The component ID for the Document.
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.qFilterHover = function() {
	var compID = this.getComponentId();
	var quickFilter = _g('QFilterDiv' + compID);

	//displays a border for the quickfilters label on mouse enter event.
	quickFilter.onmouseenter = function() {
		if (!($('#doc-spec-filter' + compID).hasClass("doc2-visible"))) {
			$(this).removeClass("doc2-qHvr-unclick");
			$(this).addClass("doc2-qFilter-hover");
		}
	};

	//removes the border for the quickfilters label on mouse leave event.
	quickFilter.onmouseleave = function() {
		if (!($('#doc-spec-filter' + compID).hasClass("doc2-visible"))) {
			$(this).removeClass("doc2-qHvr-unclick");
			$(this).removeClass("doc2-qFilter-hover");
		}
	};
};

/**
 * This function processes the raw data retrieved from the backend and generates the document data objects
 * that are easier to transform into HTML strings or use in side panel.
 * @param {object} recordData The JSON object that contains all the documents and encounters
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.processDocumentData = function(recordData){
	var docI18n = i18n.discernabu.documents_o2;
	var criterion = this.getCriterion();
	var providerID = criterion.provider_id;
	//resets the document lists
	this.m_allCompletedDocList = [];
	this.m_incompleteDocList = [];
	this.m_patRequestDocList = [];

	//loops through the DOCS array and create the document data objects
	var docCnt = recordData.DOCS.length;
	var pendingCnt = 0;
	var signedCnt = 0;
	for (var x = 0; x < docCnt; x++) {
		var dateLastUpdated = docI18n.UNKNOWN;
		var lastPrsnl = docI18n.UNKNOWN;
		var authorName = docI18n.UNKNOWN;
		var authorID = 0.0;
		var docObj = recordData.DOCS[x];
		var docStatusMean = docObj.RESULT_STATUS_CD_MEAN;
		var dateOfService = docI18n.UNKNOWN;
		var dateTime = new Date();
		var dtTm = new Date();
		var rawLastUpdatedDT = null;
		var actionProviderInfo = null;

		//flag indicating whether it is a patient submitted document or not
		var docInteropInd = (docObj.INTEROP && docObj.INTEROP.length && docObj.INTEROP[0].EXT_DATA_INFO_ID);

		//process the Date/Time of Service
		if (docObj.EFFECTIVE_DATE) {
			dateTime.setISO8601(docObj.EFFECTIVE_DATE);
			if (this.getDateFormat() === 3){
				//elapsed time
				dateOfService = MP_Util.CalcWithinTime(dateTime);
				if (dateOfService !== docI18n.UNKNOWN) {
					dateOfService = docI18n.AGO.replace("{0}", dateOfService);
				}
			} else {
				dateOfService = MP_Util.DisplayDateByOption(this, dateTime);
			}
		}

		// retrieve author information for patient submitted documents from interop object
		if(docInteropInd) {
			authorName = docObj.INTEROP[0].SUBMITTED_BY_NAME;
			authorID = "";
			//a patient submitted document does not have  last updated personnel
			lastPrsnl = "--";
			//a patient submitted document does not have  last  updated date time
			dateLastUpdated = "--";
		}
		else {
			//retrieve action provider related information
			actionProviderInfo = this.extractActionProviderInfo(docObj, providerID);
			authorName = actionProviderInfo.authorName;
			authorID = actionProviderInfo.authorID;
			lastPrsnl = actionProviderInfo.lastUpdatedBy;
			rawLastUpdatedDT = actionProviderInfo.lastUpdatedDateTime;
		}

		//process the last updated date/time using the latest date/time from the action providers
		//the only exception is incomplete DynDoc documents: they use UPDATE_DATE for the last update date/time
		//last date time is not proccessed for a patient submitted document
		if (rawLastUpdatedDT && !(docObj.EDITOR_TYPE === "DYNDOC" && docStatusMean === "IN PROGRESS" && docInteropInd)) {
			dtTm.setISO8601(rawLastUpdatedDT);
			if (this.getDateFormat() === 3){
				//elapsed time
				dateLastUpdated = MP_Util.CalcWithinTime(dtTm);
				if (dateLastUpdated !== docI18n.UNKNOWN) {
					dateLastUpdated = docI18n.AGO.replace("{0}", dateLastUpdated);
				}
			} else {
				dateLastUpdated = MP_Util.DisplayDateByOption(this, dtTm);
			}
		}

		if(docObj.EDITOR_TYPE === "DYNDOC" && docStatusMean === "IN PROGRESS"){
			dtTm.setISO8601(docObj.UPDATE_DATE);
			if (this.getDateFormat() === 3){
				//elapsed time
				dateLastUpdated = MP_Util.CalcWithinTime(dtTm);
				if (dateLastUpdated !== docI18n.UNKNOWN) {
					dateLastUpdated = docI18n.AGO.replace("{0}", dateLastUpdated);
				}
			} else {
				dateLastUpdated = MP_Util.DisplayDateByOption(this, dtTm);
			}
		}

		//Consider it as "my note" if current provider is the author or is a contributor
		var isMyNote = !docInteropInd && (authorID == providerID || actionProviderInfo.isModifiedByCurProvider);

		//store each document object into the active list
		var thisDoc = {
			timeOfServiceDateObj: docObj.EFFECTIVE_DT_TM,
			timeOfServiceDateDisplay: dateOfService,
			authorName: authorName,
			docStatusDisplay: docObj.RESULT_STATUS_CD_DISP,
			docStatusMean: docStatusMean,
			noteType: docObj.EVENT_CD_DISP,
			encounterId: docObj.ENCNTR_ID,
			eventId: docObj.EVENT_ID,
			subject: (docObj.SUBJECT).replace(/</g, "&lt;").replace(/>/g, "&gt;"),
			lastUpdatedBy: lastPrsnl,
			lastUpdatedDateObj: dtTm,
			lastUpdatedDateDisplay: dateLastUpdated,
			imageUrl: docObj.IMAGE_URL,
			isMyNote: isMyNote,
			contributors: (docInteropInd) ? '' : actionProviderInfo.contributors,
			rowHtml: ""
		};
		//separate patient submitted documents from other documents
		if(docInteropInd) {
			thisDoc.patSubmittedInd = true;
			thisDoc.interopData = docObj.INTEROP[0];
			thisDoc.subject = thisDoc.subject || "--";
			dtTm.setISO8601(docObj.INTEROP[0].SUBMITTED_ON);
			var submittedDtTmDisplay = MP_Util.DisplayDateByOption(this, dtTm);
			thisDoc.timeOfServiceDateDisplay = submittedDtTmDisplay;
			thisDoc.lastUpdatedDateDisplay = submittedDtTmDisplay;
			thisDoc.rowHtml = this.singleRowDocHTML(thisDoc);
			this.m_patRequestDocList.push(thisDoc);
		}
		else{
			//put the data object in IncompleteDocList when it's "my note" and the status is in progress.
			if (isMyNote && docStatusMean === "IN PROGRESS") {
				thisDoc.rowHtml = this.singleRowDocHTML(thisDoc, true);
				this.m_incompleteDocList.push(thisDoc);
				pendingCnt++;
			}
			else {
				//otherwise put it in all completed document list
				thisDoc.rowHtml = this.singleRowDocHTML(thisDoc);
				this.m_allCompletedDocList.push(thisDoc);
				signedCnt++;
			}
		}
	}
	this.ENCOUNTERS = recordData.ENCOUNTERS;
	var encLength = this.ENCOUNTERS.length;
	var encounter = null;
	var encounterDate = null;
	for (var yy = 0; yy < encLength; yy++) {
		encounter = this.ENCOUNTERS[yy];
		encounter.isDateEmpty = /^\s*$/.test(encounter.DATEVC);
		if(!encounter.isDateEmpty){
			encounterDate = new Date();
			encounterDate.setISO8601(encounter.DATEVC);
			encounter.encounterDate = encounterDate;
		}else{
			encounter.encounterDate = 0;
		}
	}
	//sort encounter in descending order
	this.ENCOUNTERS.sort(function(a, b) {
		return -(a.encounterDate - b.encounterDate);
	});
	//save the documents codes
	this.setDocumentsCodes(recordData.CODES);
	//save the add documentation priv and its exceptions
	this.setAddDocPriv(recordData.ADD_DOC_PRIV);
	this.setAdddDocPrivExptions(recordData.ADD_DOC_PRIV_EXCEPTIONS);
};

/**
 * When a user click a document or navigate to a document via keyboard, this function is called to update the UI.
 * If the row is not previously highlighted, it will be highlighted and  show the preview content in the side panel.
 * If it is Previously selected, it will be unhighlithed and the side panel will be hidden.
 * @param {jQuery Object} rowObj The jQuery object of the selected row.
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.selectDocument = function(rowObj) {
	//the identifier of a patient submitted document is its external data id
	var currentDocRowIdentifier = "";
	var selectedDocRowIdentifier = "";
	var eventId = rowObj.attr("data-eventid");
	var extDataInfoId = rowObj.attr("data-doc-info-ext-id");
	// check if it is a patient submitted document
	if(parseInt(extDataInfoId, 10)) {
		currentDocRowIdentifier = extDataInfoId;
		selectedDocRowIdentifier =(this.m_selectedRowObj) ? this.m_selectedRowObj.attr("data-doc-info-ext-id") : "";
	}
	else {
		currentDocRowIdentifier = eventId;
		selectedDocRowIdentifier = (this.m_selectedRowObj) ? this.m_selectedRowObj.attr("data-eventid") : "";
	}
	//if the row doesn't contain data-eventid attribute, then it's not the right row so return immediately and do nothing.
	if(typeof eventId === "undefined" || eventId === null){
		throw new Error("The selected row does't contain an attribute data-eventid that refers to the document ID. ");
	}
	//if it's already selected, unhightlight the row and hide the side panel
	if(this.m_selectedRowObj && (selectedDocRowIdentifier === currentDocRowIdentifier)){
		this.m_selectedRowObj = null;
		this.m_sidePanel.hidePanel();
		this.unhighlightSelectedRow(rowObj);
		//hide the side panel and remove its absolute positioning
		$('.doc2-side-panel').removeClass("doc2-side-panel-activated");
	} else {
		//show the side panel and add absolute positioning
		$('.doc2-side-panel').addClass("doc2-side-panel-activated");

		//if it's not selected, hightlight the row and show content in side panel
		//cancle the highlighted style of previsouly selected row.
		if(this.m_selectedRowObj){
			this.unhighlightSelectedRow(this.m_selectedRowObj);
		}

		this.m_selectedRowObj = rowObj;
		this.showSidePanel(rowObj);
		this.highlightSelectedRow(rowObj);
	}
};

/**
 * This function updates the background color and font color of the selected row to
 * indicate that this is not selected any more.
 * @param {jQuery Element} selRowObj the current row object
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.unhighlightSelectedRow = function(selRowObj) {
	// Remove the background color of previous selected row.
	selRowObj.removeClass("row-selected");
};

/**
 * This method updates the background color and font color of the selected row to
 * indicate that this is the currently selected row. It also adjusts the scrollbar
 * to keep the whole row visible.
 * @param {jQuery Element} selRowObj the selected row object
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.highlightSelectedRow = function(selRowObj) {
	var compDOMObj = $("#" + this.getStyles().getContentId());
	var	contentBodyObj = $(compDOMObj).find(".content-body");

	// Update the row to use the highlithed style
	selRowObj.addClass("row-selected");
	//cancle row's hover styles including the background color and font color
	selRowObj.attr("style", "");

	var newScrollTop = contentBodyObj[0].scrollTop;

	var rowOffsetTop = selRowObj[0].offsetTop;
	var rowOffsetHeight = selRowObj[0].offsetHeight;
	var contentBodyHeight = contentBodyObj[0].clientHeight;
	//if the top of selected row is outside of viewing area, scroll the container up to show the row.
	if(rowOffsetTop < newScrollTop){
		newScrollTop = rowOffsetTop;
	}
	//if the bottom of selected is outside of viewing area, scroll the container down to show the row.
	if(rowOffsetTop + rowOffsetHeight > newScrollTop + contentBodyHeight){
		newScrollTop = rowOffsetTop + rowOffsetHeight - contentBodyHeight;
	}

	contentBodyObj.scrollTop(newScrollTop);
};

/**
 * Check whether the document belongs to the Incomplete Document list
 * @param {number} eventId the event ID of the document that needs to be checked
 * @returns {boolean} True if the documents belongs to the incomplete list; False otherwise.
 */
DocumentComponent2.prototype.isIncompleteDocument = function(eventId){
	var incompleteList = this.m_incompleteDocList;
	for(var i = incompleteList.length;i--;){
		if(eventId === incompleteList[i].eventId){
			return true;
		}
	}
	return false;
};

/**
 * Get the document data object by check the Incoplete Document list and the Completed Document list
 * @param {number} eventId the event ID of the document
 * @return {object} The data object that contains all required information of the document
 */
DocumentComponent2.prototype.getDocumentDataObjByEventId = function(eventId) {
	if(typeof eventId !== "number"){
		throw new Error("Function getDocumentDataObjByEventId is expecting a number for parameter eventId");
	}

	//Search the associated document data object by event ID
	var documentObj = null;
	var i = 0;
	var count = 0;
	//Search the filtered completed document list.
	var filteredList = this.m_filteredCompletedDocList;
	count = filteredList .length;
	for(i = 0; i < count; i++){
		if(filteredList[i].eventId === eventId){
			documentObj = filteredList[i];
			break;
		}
	}

	//Search the incompleted document list
	if(documentObj === null){
		var incompleteList = this.m_incompleteDocList;
		count = incompleteList.length;
		for(i = 0; i<count; i++){
			if(incompleteList[i].eventId === eventId){
				documentObj = incompleteList[i];
				break;
			}
		}
	}

	//Throws exception if the document is not found.
	if(documentObj === null){
		throw new Error("Function getDocumentDataObjByEventId fails to find the document with event ID=" + eventId + " from Filtere");
	}

	return documentObj;
};

/**
 * finds a patient submitted document using the external data id
 * @param {number} extDataInfoId the external data id for a patient submitted document
 * @returns {object || null}               the patient submitted document object
 */
DocumentComponent2.prototype.getDocumentDataObjByExtInfoDataId = function(extDataInfoId) {
	var docsCount = this.m_patRequestDocList.length;
	for(var i = 0; i < docsCount; i++) {
		if(this.m_patRequestDocList[i].interopData.EXT_DATA_INFO_ID === extDataInfoId) {
			return this.m_patRequestDocList[i];
		}
	}
	return null;
};
/**
 * gets the encounter information including location, date/time and FIN for a document
 * @param  {object} docObj the document object
 * @returns {object || null}        an object containing the encounter information
 */
DocumentComponent2.prototype.getDocEncounterInfo = function(docObj) {
	//if the document des not have an encounter id,  return immediately
	if(!docObj.encounterId) {
		throw new Error("The document object passed to the getDocEncounterInfo function does not have an encounter id");
	}
	var docI18n = i18n.discernabu.documents_o2;
	var encounters = this.ENCOUNTERS;
	var encLength = encounters.length;
	var encntrInfoObj = null;
	var encntrLocation = "";
	var encntrDate = "";
	var encntrFin = "";
	var curEncntr = null;

	for (var x = 0; x < encLength; x++) {
		curEncntr = encounters[x];
		// if the matching encounter is found, retrieve the encounter info
		if(curEncntr.ENCNTR_ID === docObj.encounterId) {
			encntrLocation = curEncntr.LOCATION ? curEncntr.LOCATION : "[" + docI18n.UNKOWN_LOCATION + "]";
			encntrDate = curEncntr.isDateEmpty ? "[" + docI18n.UNKOWN_DATE + "]" : MP_Util.DisplayDateByOption(this, curEncntr.encounterDate);
			encntrFin = curEncntr.FIN_NBR || "--";
			encntrInfoObj = {
				facility: encntrLocation,
				date: encntrDate,
				fin: encntrFin
			};
			return encntrInfoObj;
		}
	}
	return null;
};

/**
 * creates the Accept and Reject buttons for patient submitted documents
 * @param  {object} docObj the object for the selected patient submitted document
 * @returns {string}        the Html string for the Accept and Reject buttons
 */
DocumentComponent2.prototype.createPatSubmittedDocsActions = function(docObj) {
	var component = this;
	var docI18n = i18n.discernabu.documents_o2;
	var codesArray = this.getDocumentsCodes();
	var acceptedStatusCode = MP_Util.GetCodeByMeaning(codesArray, 'ACCEPTED').codeValue;
	var rejectedStatusCode = MP_Util.GetCodeByMeaning(codesArray, 'REJECTED').codeValue;
	var buttonStyleEnum = MPageUI.BUTTON_OPTIONS.STYLE;
	this.m_docAcceptButton = (new MPageUI.Button())
		.setLabel(docI18n.ACCEPT)
		.setStyle(buttonStyleEnum.SECONDARY)
		.setOnClickCallback(function(){
			//handle patient submitted doc accept action
			component.acknowledgePatSubmittedDoc(docObj, 'ACCEPT', acceptedStatusCode);
		});

	this.m_docRejectButton = (new MPageUI.Button())
		.setLabel(docI18n.REJECT)
		.setStyle(buttonStyleEnum.SECONDARY)
		.setOnClickCallback(function(){
			//handle patient submitted doc reject action
			component.acknowledgePatSubmittedDoc(docObj, 'REJECT', rejectedStatusCode);
		});
	//create the html for the action buttons for patient submitted documents
	var actionButtonsHTML = '<div class="doc2-sp-action-holder"><div class="doc2-sp-button">' + this.m_docAcceptButton.render() + '</div><div class="doc2-sp-button">' + this.m_docRejectButton.render() + '</div></div>';
	return actionButtonsHTML;
};
/**
 * This function creates the HTML for the header of the side panel.
 * It queries the document data object according to event ID and puts necessary information in the header HTML.
 * @param {object} docObj the object for the selected document
 * @returns {string} HTML string fro the header of the side panel
 */
DocumentComponent2.prototype.createSidePanelHeaderHTML = function(docObj) {
	var component = this;
	var componentId = component.getComponentId();
	var docI18n = i18n.discernabu.documents_o2;

	//Create contributor list. The author will be displayed first unless it is unknown.
	var allContributorDisplay = "<div class='doc2-sp-contributers' title='";
	if(docObj.contributors.length){
		//When there're other contributors, only display the author name when the author exists.
		if(docObj.authorName !== docI18n.UNKNOWN){
			allContributorDisplay += docObj.authorName + "; " + docObj.contributors.join("; ") + "'><span class='doc2-sp-author'>" + docObj.authorName + ";</span>" + docObj.contributors.join("; ");
		} else {
			allContributorDisplay += docObj.contributors.join("; ") + "'>" + docObj.contributors.join("; ");
		}
	} else {
		//When there're no other contributors, display the author's name. When even author doesn't exist, it will be "Unknown".
		allContributorDisplay += docObj.authorName + "'><span class='doc2-sp-author'>" + docObj.authorName + "</span>";
	}
	allContributorDisplay += "</div>";

	var headerButtonsHTML = "";
	var lastUpdatedLabel = docI18n.LAST_UPDATED;
	var docActionErrorHTML = "";
	//  if it is a patient submitted document, create  the accept and reject actions
	if(docObj.patSubmittedInd) {
		lastUpdatedLabel = docI18n.SUBMITTED;

		//only display banner messages for patient submitted document when the add doc priv is granted.
		var addDocPrivGranted = this.isAddDocPrivGranted(docObj);
		if(addDocPrivGranted) {
			//create the html for the action buttons for patient submitted documents
			headerButtonsHTML = component.createPatSubmittedDocsActions(docObj);
			//create the placeholder for patient submitted doc action error
			docActionErrorHTML = "<div id='docActionError" + componentId + "''></div>";
		}
		else {
			headerButtonsHTML = '<div class="doc2-sp-action-holder"></div>';
		}
	}
	else {
		headerButtonsHTML ='<div class="doc2-sp-action-holder "><div class="sp-button">' + docI18n.OPEN_DOCUMENT + '</div></div>' ;
	}

	//create the button, subject, last updated date/time
	var headerHTML = headerButtonsHTML +
		"<div class='sp-header'><div class='doc2-sp-header-left'><div class='doc2-sp-subject' title='" + docObj.subject + "'>" + docObj.subject + "</div>" +
		allContributorDisplay +
		"</div><div class='doc2-sp-header-right'><div class='doc2-sp-last-updated-label'>" + lastUpdatedLabel +
		"</div><div class='doc2-sp-last-updated'>" + docObj.lastUpdatedDateDisplay + "</div></div>" +
		docActionErrorHTML + "</div>";

	return headerHTML;
};

/**
 * find an exception for the add documentation priv by using an event code
 * @param  {Number} eventCode an event code value
 * @returns {Object}       exception object if found, null if not found
 */
DocumentComponent2.prototype.findExceptionByEventCode = function(eventCode) {
	var addDocPrivExceptions = this.getAdddDocPrivExptions();
	var exceptionsCnt = addDocPrivExceptions.length;

	for(var i = 0; i < exceptionsCnt; i++) {
		if(addDocPrivExceptions[i].EVENT_CODE === eventCode){
			return addDocPrivExceptions[i];
		}
	}
	return null;
};

/**
 * check if a document contains event codes that are exceptions for the add documentation privilege
 * @param  {Object}  docObj the document object
 * @return {Boolean}        indicator whether a document's event code/event set is found among the privilege's exceptions
 * When the  priv is YES, it will return true if any of the event codes is found among the exceptions; when the priv is NO,
 * it will only retur true if all the event codes in the documents are found among the exceptions
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.isPrivExceptionSetForDocEventCodes = function(docObj) {
	var addDocPriv = this.getAddDocPriv();
	// initialize the exceptions indicator
	var exceptionFound = false;
	var docQuestions = docObj.interopData.QUESTIONS;
	var docQuestionsCnt = docQuestions.length;
	var x = 0;

	if(addDocPriv) {
		//check if an exception is set for the doc type event code
		if(this.findExceptionByEventCode(docObj.interopData.DOC_TYPE_CODE)){
			exceptionFound = true;
		}
		else {
			for(x = 0; !exceptionFound && x < docQuestionsCnt; x++) {
				if(this.findExceptionByEventCode(docQuestions[x].EVENT_CODE)) {
					exceptionFound = true;
				}
			}
		}
	}
	else {
	//check if an exception is set for the doc type event code
		if(this.findExceptionByEventCode(docObj.interopData.DOC_TYPE_CODE)){
			exceptionFound = true;
			for(x = 0; exceptionFound &&  x < docQuestionsCnt; x++) {
				if(!this.findExceptionByEventCode(docQuestions[x].EVENT_CODE)) {
					exceptionFound = false;
				}
			}
		}
		else {
			exceptionFound = false;
		}
	}
	return exceptionFound;
};

/**
 * check the  Add Document Privilege and its Event Code/ Event Set exceptions to verify if the user has the permission to add a new document
 * @param  {object} docObj            the object for the patient submitted document
 * @returns {Boolean}    true if the user can add a new document, otherwise  false.
 */
DocumentComponent2.prototype.isAddDocPrivGranted = function(docObj) {
	var addDocPriv = this.getAddDocPriv();
	var addDocPrivExceptions = this.getAdddDocPrivExptions();
	var privGrantedInd = false;

	if(addDocPriv) {
		//if there are exceptions for the priv, check if any of event codes in the patient submitted doc is an exception
		if(addDocPrivExceptions.length) {
			//if an exception is set for any of the event codes in the document, the permission is denied.
			privGrantedInd = (this.isPrivExceptionSetForDocEventCodes(docObj)) ? false : true;
		}
		else {
			privGrantedInd = true;
		}
	}
	else {
		//if there are exceptions for the priv, check if the event codes in the patient submitted doc are exceptions
		if(addDocPrivExceptions.length) {
			//if exceptions are  set for all the  event codes in the document, the permission is granted.
			privGrantedInd = (this.isPrivExceptionSetForDocEventCodes(docObj)) ? true : false;
		}
		else {
			privGrantedInd = false;
		}
	}
	return privGrantedInd;
};
/**
 * Perform action on a patient submitted document, accept or reject
 * @param  {object} docObj            the object for the patient submitted document
 * @param  {string} requestType  the type of the request to be performed - ACCEPT or REJECT
 * @param  {number} requestStatusCode  the code value for the action to be performed
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.acknowledgePatSubmittedDoc = function(docObj, requestType, requestStatusCode) {
	//create patient submitted documents - reconcile CAP timer\
	var patSubmittedDocTimer = new CapabilityTimer("CAP:MPG Documents Reconcile Patient Entered Data");
	patSubmittedDocTimer.capture();
	var component = this;
	var extDataInfoId = docObj.interopData.EXT_DATA_INFO_ID;
	var criterion = this.getCriterion();
	var personnelId = criterion.provider_id;
	// if the document does not have an encounter id,  the  encounter id in context will be used.
	var encounterId = (docObj.encounterId) ? docObj.encounterId : criterion.encntr_id;
	var pprCd = criterion.ppr_cd;
	var requestNumber = 0;
	var requestJson = "";

	//set the parameter values appropriate for each type of requests
	if(requestType === "ACCEPT") {
		requestNumber = 964761;
		requestJson = '{"REQUESTIN":{"QUESTIONNAIRES":[{"EXT_DATA_INFO_ID":' + extDataInfoId + '.0' + ',"STATUS_CODE":' + requestStatusCode + '.0}]' + ',"PERSONNEL_ID":' + personnelId +'.0' + ',"ENCOUNTER_ID":' + encounterId + '.0' + ',"PPR_CD":' + pprCd + '.0' + '}}';
	}
	else if (requestType === "REJECT") {
		requestNumber = 964756;
		requestJson = '{"REQUESTIN":{"UPDATESTATUS":[{"EXT_DATA_INFO_ID":' + extDataInfoId + '.0' + ',"STATUS_CODE":' + requestStatusCode + '.0' + ',"CHART_REFERENCE_ID":' + '0.0' + ',"PERSONNEL_ID":' + personnelId + '.0' + ',"ENCNTR_ID":' + encounterId + '.0' + '}]}}';
	}

	var scriptRequest = new ScriptRequest();
	scriptRequest.setProgramName('mp_exec_std_request');
	scriptRequest.setRawDataIndicator(true);
	scriptRequest.setDataBlob(requestJson);
	//app number,task number,request number for  INTEROP service UPDATESTATUS
	scriptRequest.setParameterArray(["^MINE^", "^^", 3202004, 3202004, requestNumber]);
	//callback function to handle the response
	scriptRequest.setResponseHandler(function(scriptReply) {
		try{
			var responseData = JSON.parse(scriptReply.getResponse());
			//if sucess, render the component  to get the updates to documents
			if (responseData.RECORD_DATA.STATUS.SUCCESS_INDICATOR === 1) {
				component.retrieveComponentData();
			}
			else {
				//display error message in side panel banner
				component.createSidePanelErrorBanner();
			}
		}
		catch(err){
				//display error message in side panel banner
				component.createSidePanelErrorBanner();
		}
	});
	scriptRequest.performRequest();
};

/**
* Display error banner in the side panel when an action on a patient submitted doc fails
* @returns {Undefined} returns undefined
*/
DocumentComponent2.prototype.createSidePanelErrorBanner = function() {
	var docI18n = i18n.discernabu.documents_o2;
	var compId = this.getComponentId();
	var alertBanner = new MPageUI.AlertBanner();
	alertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
	alertBanner.setPrimaryText(docI18n.DOC_ACTION_ERROR_MSG);
	$("#docActionError" + compId).html(alertBanner.render());
};

/**
 * get the display text for a code value
 * @param  {number} codeValue the value of the code
 * @returns {string}           the display text for the code
 */
DocumentComponent2.prototype.getDocCodeDisplay = function(codeValue) {
	var docsCodesArray = this.getDocumentsCodes();
	var codeInfoObj = MP_Util.GetValueFromArray(codeValue, docsCodesArray);
	var questionDtaType = (codeInfoObj) ? codeInfoObj.display : "";
	return questionDtaType;
};

/**
 * get the  CDF meaning for a code value
 * @param  {number} codeValue the value of the code
 * @returns {string}           the CDF meaning for the code
 */
DocumentComponent2.prototype.getDocCodeCDFMeaning = function(codeValue) {
	var docsCodesArray = this.getDocumentsCodes();
	var codeInfoObj = MP_Util.GetValueFromArray(codeValue, docsCodesArray);
	var questionDtaCDFMeaning = (codeInfoObj) ? codeInfoObj.meaning : "";
	return questionDtaCDFMeaning;
};
/**
 * create the Html for a question-answer for a patient submitted document
 * @param  {object} question patient  submitted question
 * @returns {string}          the question-answer Html
 */
DocumentComponent2.prototype.createPatQuestionHtml = function(question) {
	//get the CDF meaning of the question DTA
	//the DTA code values in a patient submitted document are from codeset 289 (Result Type)
	var questionDtaCDFMeaning = this.getDocCodeCDFMeaning(question.EVENT_TYPE);
	var prompt = question.QUESTION;
	var answers = [];
	var answersHtml = "";
	var questionHtml = "";
	var dtTm = new Date();
	var i = 0;
	var alphaCount = question.ALPHA_VALUES.length;
	// retrieve the question data based on the DTA type
	switch(questionDtaCDFMeaning) {
		case "3": //numeric
			var unitCdDisplay = this.getDocCodeDisplay(question.UNIT_CODE);
			answers[0] = (question.NUMERIC_VALUE) ? (question.NUMERIC_VALUE + " " + unitCdDisplay) : "--";
			break;
		case "2": //alpha
			if(alphaCount) {
				answers[0] = question.ALPHA_VALUES[0].LABEL  || "--";
			}
			else{
				answers[0] = "--";
			}
			break;
		case "21": //alpha and freetext
			if(alphaCount) {
				answers[0] = question.ALPHA_VALUES[0].LABEL || "--";
			}
			else {
				answers[0] = question.FREE_TEXT_VALUE || "--";
			}
			break;
		case "5": //multi
			if(alphaCount) {
				for(i= 0; i < alphaCount; i++) {
					answers[i] = question.ALPHA_VALUES[i].LABEL || "--" ;
				}
			}
			else {
				answers[0] = "--" ;
			}
			break;
		case "22": //multi-alpha and Freetext
			if(alphaCount) {
				for(i = 0; i < alphaCount; i++) {
					answers[i] = question.ALPHA_VALUES[i].LABEL || "--" ;
				}
			}
			//also check the freetext field
			if(question.FREE_TEXT_VALUE) {
				answers[i] = question.FREE_TEXT_VALUE;
			}

			// if neither alpha values nor free text value were found, display --
			if(!answers.length) {
				answers[0] = '--';
			}
			break;
		case "7": //freetext
			answers[0] = question.FREE_TEXT_VALUE || "--";
			break;
		case "6": //date
			if(question.DATE_VALUE) {
				dtTm.setISO8601(question.DATE_VALUE);
				answers[0] = dtTm.format("shortDate3");
			}
			else {
				answers[0] = "--";
			}
			break;
		case "10": //time
			answers[0] = question.DATE_VALUE || "--";
			break;
	}

	//create the HTML for the dta's  question and answers
	for(i=0; i < answers.length; i++) {
		answersHtml += "<dd>" + answers[i] + "</dd>";
	}

	questionHtml = "<dl class='doc2-preview-section'><dt>" + prompt + "</dt>" + answersHtml + "</dl>";
	return  questionHtml;
};
/**
 * This method creates the side panel content for a patient submitted document
 * @param {number} docDataInfoExtId The external data info ID for the patient submitted document
 * @returns undefined returns undefined
 */
DocumentComponent2.prototype.createSidePanelPatSubmittedDocContent = function(docDataInfoExtId) {
	var docI18n = i18n.discernabu.documents_o2;
	var compID = this.getComponentId();
	var compContentID = this.getStyles().getContentId();
	var sidePanel = this.m_sidePanel;
	var docObj = this.getDocumentDataObjByExtInfoDataId(docDataInfoExtId);
	var patQuestionsArray = docObj.interopData.QUESTIONS;
	var patQuestionsCount = patQuestionsArray.length;
	var criterion = this.getCriterion();
	var currentEncntrId = criterion.encntr_id;
	var questionHtml = "";
	//If the cache if not available, it will display the header and the spinning icon
	var headerHTML = this.createSidePanelHeaderHTML(docObj);
	// This will contain the html  for the warning or informal banner for a patient submitted document
	var msgBannerHTML = "";
	//only display banner messages for patient submitted document when the add doc priv is granted.
	var addDocPrivGranted = this.isAddDocPrivGranted(docObj);
	if(addDocPrivGranted) {
		//create warning message when the document is not associated to any encounter
		if(!docObj.encounterId){
			var noEncounterBanner = new MPageUI.AlertBanner();
			noEncounterBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.WARNING);
			noEncounterBanner.setSecondaryText(docI18n.PAT_SUBMITTED_DOC_MISSING_ENCOUNTER_MSG);
			msgBannerHTML = "<div class='doc2-sp-banner-container'>" + noEncounterBanner.render() + "</div>";
		}
		//create informational message if the document is not associated to the current encounter
		else if(docObj.encounterId && docObj.encounterId !== currentEncntrId) {
			//get the encounter information for the selected document object
			var docEncntrInfoObj = this.getDocEncounterInfo(docObj);
			var bannerMessage = docI18n.PAT_SUBMITTED_DOC_MISMATCHING_ENCOUNTER_MSG;
			bannerMessage = bannerMessage.replace("{0}", docEncntrInfoObj.facility).replace("{1}", docEncntrInfoObj.date).replace("{2}", docEncntrInfoObj.fin);
			var mismatchEnctrBanner = new MPageUI.AlertBanner();
			mismatchEnctrBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.INFO);
			mismatchEnctrBanner.setSecondaryText(bannerMessage);
			msgBannerHTML = "<div class='doc2-sp-banner-container'>" + mismatchEnctrBanner.render() + "</div>";
		}
	}

	//the side panel content will always include the header
	var HTMLString = headerHTML + msgBannerHTML + '<div id="sidePanelScrollContainer' + compID + '" class="doc2-sp-scroll-container">'
	+ '<div id="doc2SidePanelViewableContent' + compID + '" class="doc2-preview-content">';

	//create the html for the patient questionnaire
	for(var i = 0; i < patQuestionsCount; i++) {
		questionHtml = this.createPatQuestionHtml(patQuestionsArray[i]);
		HTMLString += questionHtml;
	}
	HTMLString += '</div></div>';

	//display the patient questionnaire in side panel
	sidePanel.setContents(HTMLString, compContentID);
	sidePanel.showPanel();
	this.resizeSidePanel();
	//wire up the events for the patient submitted documents actions only if the add documentation privilege is granted.
	if(addDocPrivGranted) {
		this.m_docAcceptButton.attachEvents();
		this.m_docRejectButton.attachEvents();
	}
};

/**
 * This function retrieves the document preview content to display within the side panel.
 * If the document content is already cached, the cached content will be used directly.
 * Otherwise, it will display the spinning icon and sends CCL request to the backend and retrieve the data.
 * When CCL reply is returned, the side panel will be updated to display the content and the content will be cached.
 * However, if the user navigates to another document before the preview content is available, the side panel won't
 * be updated to display the previous selected document.
 * @param {number} eventId the event ID of the document
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.retrieveSidePanelContent = function(eventId){
	//Use the cached side panel content if it's available.
	var cachedContent = this.m_documentDisplayCache[eventId];
	if(cachedContent){
		this.updateSidePanelPreviewContent(eventId);
		return;
	}
	//If the cache if not available, it will display the header and the spinning icon while retriving the document preview
	this.showLoadingPreview(eventId);
	this.retrieveDocumentPreview(eventId);
};

/**
 * Retrieves the documentation content associated to the passed clinical event to display in side panel
 * @param {Number} eventId The event id of the clinical event for the  document to be displayed
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.retrieveDocumentPreview = function(eventId){
	var self = this;
	var scriptRequest = new ScriptRequest();
	scriptRequest.setProgramName("mp_doc_preview_pane");
	scriptRequest.setParameterArray(["^MINE^", eventId + ".0"]);
	//Set the response handler.
	scriptRequest.setResponseHandler(function(scriptReply) {
		self.handleDocumentPreviewResponse(scriptReply, eventId);
	});
	scriptRequest.performRequest();
};

/**
 * Handles updating the cached content to be displayed in the side panel's document preview
 * @param  {String} contentHtml HTML string of content to display underneath the header
 * @param  {Number} eventId     event id of the clinical event for the document to be displayed in side panel
 * @param  {MPageIFrame} iframe Iframe object that will contain documentation preview
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.updateDocumentDisplayCache = function(contentHtml, eventId, iframe) {
	//Create cache if not present
	if(!this.m_documentDisplayCache[eventId]){
		this.m_documentDisplayCache[eventId] = {};
	}
	//Create and cache header html
	if(!this.m_documentDisplayCache[eventId].headerHtml) {
		var docObj = this.getDocumentDataObjByEventId(eventId);
		this.m_documentDisplayCache[eventId].headerHtml = this.createSidePanelHeaderHTML(docObj);
	}
	if(iframe){
		this.m_documentDisplayCache[eventId].iframe = iframe;
	}
	//Append header to content
	var previewContent = this.m_documentDisplayCache[eventId].headerHtml;
	//Append passed content;
	previewContent += contentHtml;
	//Cache content html
	this.m_documentDisplayCache[eventId].html = previewContent;
};

/**
 * Update side panel preview content to display document preview for associated event id
 * @param  {Number} eventId event id of the document to be displayed in the side panel
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.updateSidePanelPreviewContent = function(eventId) {
	var sidePanel = this.m_sidePanel;
	var compContentID = this.getStyles().getContentId();
	//Update side panel
	if(sidePanel){
		var contents = this.m_documentDisplayCache[eventId].html;
		sidePanel.setContents(contents, compContentID);
		sidePanel.showPanel();
		//Render content and finalize iframe after side panel is rendered
		this.finalizeIFramePreviewContent(eventId);
		this.resizeSidePanel();
	}
};

/**
 * Renders the preview content into the iframe if cached content exists.
 * Finalizes Iframe (attaches event handlers, attaches CSS, and resizes)
 * @param  {Number} eventId The eventId associated with the iframe
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.finalizeIFramePreviewContent = function(eventId){
	var iframe = this.m_documentDisplayCache[eventId].iframe;
	if(iframe){
		iframe.finalize();
	}
};

/**
 * After component has been moved in the dom, iframe automatically reloads
 * This means iframe must be finalized again to ensure that content is ubdated
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.postDOMLocationChange = function(){
	var sidePanel = this.m_sidePanel;
	var eventId;
	if(this.m_selectedRowObj){
		eventId = parseInt(this.m_selectedRowObj.attr("data-eventid"), 10);
	}
	//Update iframe content in side panel if associated document has clinical event id
	if(sidePanel && eventId){
		this.finalizeIFramePreviewContent(eventId);
	}
};

/**
 * Displays a preloaded within the side panel to be used during loading of documentation
 * @param  {Number} eventId Event id of the clinical event for the document to be displayed in side panel (used for caching content per document)
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.showLoadingPreview = function(eventId){
	var compID = this.getComponentId();
	var loadingContent = "<div id='sidePanelScrollContainer" + compID
		+ "' class='doc2-sp-scroll-container'><div id='doc2SidePanelViewableContent" + compID
		+ "' class='doc2-preview-content doc2-sp-loading-container'></div></div>";
	//Cache loading content
	this.updateDocumentDisplayCache(loadingContent, eventId);
	//Display updated content in side panel
	this.updateSidePanelPreviewContent(eventId);
};

/**
 * Utilizes the response from mp_doc_preview_pane to display the document preview in the side panel
 * @param  {ScriptReply} scriptReply Reply from mp_doc_preview_pane with details on the content to be displayed in side panel
 * @param  {Number} eventId          Event id of the clinical event for the document to be displayed
 * @return {undefined} returns undefined
 */
DocumentComponent2.prototype.handleDocumentPreviewResponse = function(scriptReply, eventId){
	var docI18n = i18n.discernabu.documents_o2;
	var compID = this.getComponentId();
	var compContentID = this.getStyles().getContentId();
	var recordData = scriptReply.getResponse();
	var status = scriptReply.getStatus();
	var iframe = null;
	//the side panel content will always include the header
	var HTMLString = "<div id='sidePanelScrollContainer" + compID
		+ "' class='doc2-sp-scroll-container'><div id='doc2SidePanelViewableContent" + compID + "' class='doc2-preview-content'>";

	var docContentHTML = "";
	var hasEmbeddedImages = false;
	if (status === "S") {
		//regular expression to search for IMG tags. If the img tag is not closed properly, it won't be a match. For example: <img src="image.png"> is a match, "<img <p>a paragraph</p>" is not a match
		var imgPattern = /<img[^<>]+?>/ig;
		var blobs = recordData.BLOBS;
		var blobHTML = null;
		var iframeContent = "";
		iframe = new MPageIFrame();
		iframe.setNamespace(compContentID);
		for (var i = 0, len = blobs.length; i < len; i++) {
			blobHTML = blobs[i].BLOB_HTML;
			if(imgPattern.test(blobHTML)){
				hasEmbeddedImages = true;
				blobHTML = blobHTML.replace(imgPattern, '<span class="doc2-replaced-img-box"><span class="doc2-replaced-image">&nbsp;</span></span>');
			}
			iframeContent += "<div class='doc2-preview-section'>" + blobHTML + "</div>";

		}
		//Populate contents into iframe for caching puproses
		this.populatePreviewIFrameContent(iframe, iframeContent);
		//Add iframe container to side panel preview
		docContentHTML += iframe.render();

		//if the document has embedded images, an extra message bar will be displayed.
		if(hasEmbeddedImages){
			HTMLString += "<div class='doc2-side-msg-bar'><span class='doc2-side-msg-icon'>&nbsp;</span>" + docI18n.DOC_CONTAINS_IMAGES + "<br />" + docI18n.CLICK_BUTTON_TO_VIEW + "</div>";
		}
		HTMLString += docContentHTML;
	}
	else {
		//if it fails to retrieve the content, display message to indicate it's not supported.
		HTMLString += '<div class="doc2-sp-not-supported">' + docI18n.DOC_NOT_SUPPORTED + "<br />" + docI18n.CLICK_BUTTON_TO_VIEW + "</div>";
	}
	HTMLString += "</div></div>";

	//Cache the retrieved document content
	this.updateDocumentDisplayCache(HTMLString, eventId, iframe);

	//So it has been a while since the user selected the document for previewing content. She/he may have selected a different row or hidden the side panel afterwards.
	//only display the content in side panel if the content truly belongs to the selected row and side panel is shown
	var currentRow = this.m_selectedRowObj;
	if(currentRow && parseInt(currentRow.attr("data-eventid"), 10) === eventId) {
		//Display the latest side panel content
		this.updateSidePanelPreviewContent(eventId);
	}
};

/**
 * Populates the provided iframe with the provided content.  Handles finishing initialization and attaching
 * event handlers
 * @param  {MPageIFrame} iframe  IFrame object for which content is being populated
 * @param  {String} content HTML string for content to be displayed within the preview
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.populatePreviewIFrameContent = function(iframe, content){
	var staticContent = this.getCriterion().static_content;
	iframe.setStaticContentPath(staticContent);
	iframe.addCssSource("document-preview.css");
	iframe.setContent(content);
	iframe.setFinalizeFn(this.attachEventsToDocumentPreviewIframe(iframe));
};

/**
 * Generates a function that will be utilized to attach events to a provided document HTML NODE
 * @param  {MPageIFrame} iframe The Iframe object that has been rendered within the document preview
 * @returns {Function}           Function (taking a document node) that handles attaching events to the provided document
 */
DocumentComponent2.prototype.attachEventsToDocumentPreviewIframe = function(iframe){
	var component = this;
	return function(iframeDocument){
		if (component.isTaggingEnabled()) {
			component.allowTaggingInPreviewPane(iframe, iframeDocument);
		}
	};
};

/**
 * Allows tagging to be performed in the passed iframe for the document preview
 * @param  {MPageIFrame} iframe      IFrame object for which tagging will be allowed
 * @param  {HTMLNode} iframeDocument IFrame document node to attach event handlers to
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.allowTaggingInPreviewPane = function(iframe, iframeDocument){
	var component = this;

	function displayTaggingMenu(event){
		//Allow selected text to be updated before checking
		setTimeout(function(){
			var iframeNode = iframe.getRootElement();
			var iframeWindow = iframeNode.contentWindow || iframeNode;
			var selectedHtml = DocumentationUtils.getSelectedHtml(iframeDocument, iframeWindow);

			if (selectedHtml){
				var sanitizedHtml = DocumentationUtils.cleanHtml(selectedHtml);
				//remove whitespace characters
				sanitizedHtml = sanitizedHtml.replace(/[\b\f\n\r\t]/gim, "");
				//create full xml to save
				var sanitizedTaggedXml = DocumentationUtils.getXHtml(sanitizedHtml);
				component.showTaggingMenu(sanitizedTaggedXml, event, iframe);
			}
		}, 0);
	}

	//Display tagging menu immediately after mouse up
	$(iframeDocument.body).on("mouseup", function(event){
		displayTaggingMenu(event);
	});

	//Also display on right click
	$(iframeDocument.body).on("contextmenu", function(event){
		event.preventDefault();
		displayTaggingMenu(event);
	});

	//Close tagging menu (and other menus) on click
	$(iframeDocument.body).on("click", function(){
		MP_MenuManager.closeMenuStack(false);
	});
};

/**
 * Allows the tagging menu to be displayed in the proper position if text is selected
 * @param  {String} selectedText HTML string containing the text currently selected by the user
 * @param  {Event} event         HTML Event that triggered the menu to be shown (utilized to determine positioning of menu)
 * @param  {MPageIFrame} iframe  IFrame object over which the tagging menu is displayed
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.showTaggingMenu = function(selectedText, event, iframe){
	var component = this;
	var componentContainer = $("#" + component.getStyles().getId());
	//if no text is selected, do not enable the menu
	if(!selectedText){
		return;
	}

	var eventId = parseInt(this.m_selectedRowObj.attr("data-eventid"), 10);
	var iframeRoot = iframe.getRootElement();
	var offsetX = event.pageX;
	var offsetY = event.pageY;
	var el = iframeRoot;
	//include offset of iframe from parent document in calculating where to place tagging label
	while (el) {
		offsetX += el.offsetLeft;
		offsetY += el.offsetTop;
		//Account for vertical scrolling
		if (el.scrollTop){
			offsetY -= el.scrollTop;
		}
		el = el.offsetParent;
	}

	//show the context menu
	var contextMenu = MP_MenuManager.getMenuObject("Doc2ContextMenu");
	var tagResultSelection = null;
	if (!contextMenu) {
		var docI18n = i18n.discernabu.documents_o2;
		contextMenu = new ContextMenu("Doc2ContextMenu").setIsRootMenu(true).setAnchorElementId("Doc2ContextMenuAnchor").setAnchorConnectionCorner([ "top", "left" ]).setContentConnectionCorner([ "top", "left" ]);
		tagResultSelection = new MenuSelection("Doc2TagResult").setLabel(docI18n.TAG).setIsSelected(true).setSelectedClass("doc2-tag-icon");
		contextMenu.addMenuItem(tagResultSelection);
		MP_MenuManager.addMenuObject(contextMenu);
	}
	// Update the click function for the TagResult menu item
	var menuItemArr = contextMenu.getMenuItemArray();
	if(menuItemArr){
		for(var i = menuItemArr.length; i--; ){
			if(menuItemArr[i].getId() === "Doc2TagResult"){
				tagResultSelection = menuItemArr[i];
			}
		}
	}
	tagResultSelection.setClickFunction(function() {
		component.tagResult(selectedText, eventId);
		componentContainer.focus();
	});
	// Update the x and y coordinates of the menu and set the anchor element
	contextMenu.setXOffset(offsetX).setYOffset(offsetY).setAnchorElement();
	MP_MenuManager.showMenu("Doc2ContextMenu");
	contextMenu.removeAnchorElement();
};

/**
 * This function tags the selected the document text.
 * It is called after the user selects document content texts from the side panel.
 * It consumes the result tagging API for tagging the text.
 * @param {string} documentText Selected document content
 * @param {number} eventId The document's event ID
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.tagResult = function(documentText, eventId) {
	var categoryMean = this.getCriterion().category_mean;
	(new CapabilityTimer("CAP:MPG Documents O2 Tag Text", categoryMean)).capture();
	var docI18n = i18n.discernabu.documents_o2;
	var resultTag = new TaggedResult();

	// Just tag the face up result which will be the first in the OBJECT_ARR
	resultTag.setTagEntityId(eventId);
	resultTag.setTagText(documentText);
	resultTag.setTagDateTime(new Date());
	resultTag.setCategorizationArray([docI18n.TAGGED_TEXT]);
	//Note we use TAGTEXT to tag document text and not DOC_COMP because it tags the whole component.
	resultTag.setEMRType("TAGTEXT");
	// Fire off the tagged result call to the tagging handler
	MP_TaggingHandler.saveTaggedResult(resultTag);
};

/**
 * This function will initialize the side panel if it's not initialized yet.
 * It will call retrieveSidePanelContent to retrieve the preview content
 * and display appropriate contents in the side panel.
 * @param {object} rowObj the jQuery object of a document row.
 * @returns {undefined} returns undefined
 */
DocumentComponent2.prototype.showSidePanel = function(rowObj) {
	var eventId = rowObj.attr("data-eventid");
	eventId = parseInt(eventId, 10);
	var docDataInfoExtId = rowObj.attr("data-doc-info-ext-id");
	docDataInfoExtId = parseInt(docDataInfoExtId, 10);

	var compID = this.getComponentId();
	var self = this;
	var panelId = "doc2SidePanel" + compID;
	var sidePanel = this.m_sidePanel;
	if(!sidePanel) {
		sidePanel = new CompSidePanel(compID, panelId);
		sidePanel.setExpandOption(sidePanel.expandOption.NONE);
		//Document component will do its own computation and resize the SidePanel for full panel scroll.
		//So SidePanel's original logic is not needed here. Therefore it's set to false to save performance cost.
		sidePanel.setFullPanelScrollOn(false);
		//Assign an arbitrary max-height to SidePanel so it won't do the costly query when setContents is called.
		//Plus Document component will do its own computation and resize the SidePanel so this value is not really used.
		sidePanel.setMaxHeight("1px");
		sidePanel.renderSidePanel();
		sidePanel.showCloseButton();
		// set the function that will be called when the close button on the side panel is clicked
		sidePanel.m_closeButton.click(function() {
			self.selectDocument(self.m_selectedRowObj);
		});
		this.m_sidePanel = sidePanel;
	}
	// if it is a patient submitted document, display questionnaire with accept/ reject actions
	if(docDataInfoExtId) {
		this.createSidePanelPatSubmittedDocContent(docDataInfoExtId);
	}
	else {
		this.retrieveSidePanelContent(eventId);
	}
};

/**
 * To launch the document editor via ResultViewer API. The API handles both Millennium context and browser context.
 * @param {number} eventId The document event ID
 * @param {string} categoryMean The category_mean or the current view
 * @returns {undefined} returns undefined
 */
DocumentComponent2.LaunchDocumentEditor = function(eventId, categoryMean){
	(new CapabilityTimer("CAP:MPG Documents O2 Edit Result", categoryMean)).capture();
	var viewer = new ResultViewer();
	//launch the viewer in edit mode via ResultViewer
	viewer.setEditModeInd(true);
	viewer.addEventId(eventId);
	viewer.launchViewer();
};

/**
 * To launch either the Millennium viewer or web viewer depending on whether the component is being shown
 * within the browser or within Millennium.
 * @param {number} eventId The document event ID
 * @param {string} categoryMean The category_mean or the current view
 * @returns {undefined} returns undefined
 */
DocumentComponent2.LaunchDocumentViewer = function(eventId, categoryMean){
	(new CapabilityTimer("CAP:MPG Documents O2 View Result", categoryMean)).capture();
	ResultViewer.launchAdHocViewer(eventId);
};

/**
 * To launch the the web document viewer (default to the image tab) or navigate to the Media viewer to view
 * any images associated with the document depending on whether the component is being shown
 * within the browser or within Millennium.
 * @param {number} eventId The document event ID
 * @param {string} categoryMean The category_mean or the current view
 * @returns {undefined} returns undefined
 */
DocumentComponent2.LaunchDocumentImageViewer = function(eventId, categoryMean){
	(new CapabilityTimer("CAP:MPG Documents O2 View Image", categoryMean)).capture();
	ResultViewer.launchAdHocImageViewer(eventId);
};

/**
 * Map the Document option 2 object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "WF_CLIN_DOC" filter
 */
MP_Util.setObjectDefinitionMapping("WF_CLIN_DOC", DocumentComponent2);
