function PrenatalVisitsComponentWFStyle() {
	this.initByNamespace("pv-wf");
}

PrenatalVisitsComponentWFStyle.prototype = new ComponentStyle();
PrenatalVisitsComponentWFStyle.prototype.constructor = ComponentStyle;

/**
 * The Prenatal Visits component retrieves the result documented for a patient
 * during initial physical exam for each visit.
 *
 * @param {criterion}
 *            criterion : The Criterion object which contains information needed
 *            to render the component.
 */
function PrenatalVisitsComponentWF(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new PrenatalVisitsComponentWFStyle());
	this.setComponentLoadTimerName("USR:MPG.PRENATALVISITS.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.PRENATALVISITS.O2 - render component");
	this.m_antepartumNote = null;
	this.m_encType = null;
	this.m_estGestAge = null;
	this.m_fundHeight = null;
	this.m_preTermSignsSym = null;
	this.m_cervicalDilation = null;
	this.m_cervicalEffacement = null;
	this.m_cervicalStation = null;
	this.m_cumulativeWt = null;
	this.m_weight = null;
	this.m_edema = null;
	this.m_protein = null;
	this.m_glucose = null;
	this.m_nxtAppt = null;
	this.m_pain = null;
	this.m_presentation = null;
	this.m_fetalMove = null;
	this.m_fetalHrRt = null;
	this.m_fetalLie = null;
	this.m_BPGroup = null;
	this.m_prenatalVisitsIndicator = false;
	this.m_ketones = null;
	this.m_chartEnabled = false;
	this.m_addFetusEnabled = false;
	this.m_emptyVal = "--";
	this.m_visitCardsObjects = null;
	this.m_visitCardsObjectsLength = 0;
	this.m_newVisitCard = null;
	this.m_recordDataToday = null;
	this.m_recordDataExists = false;
	this.m_recordDataTodayExists = false;
	this.m_activeFields = [];
	this.m_encntrBasedDisplayChoosen = false;

	//Holds the baby label active or inactive status.
	this.m_babyLabelStatusInstanceArr = [];
	this.m_readBabyLabelStatus = true;

	//Holds the label, event and style details which will be used to render the label and content table.
	this.m_labelDetail = [];

	//Hover HTML code which will shown upon hovering an event.
	this.m_hoverHTML = [];

	// Hover HTML division tag which will used add the hover html code as inner HTML
	this.m_hoverHTMLTag = "<div class='hvr pv-wf-event-hvr-data{0} pv-wf-table-data-hover'></div>";

	// Contains the text box id of the element which in focus.
	this.m_textBoxId = "";

	// Variable used to indicate whether signing/charting the results (PRG call) is in progress.
	this.m_signResults = false;

	// Variable used to indicate whether dynamic label has been inactivated or not - Used to
	// refresh the component upon clicking "Cancel" icon.
	this.m_dynamicLabelInactivated = false;

	// Holds the dynamic baby label details like baby label name, id, template id, etc
	this.m_dynamicBabyLabels = null;

	// Holds the Prenatal Visits events DTA result returned DTA infor PRG.
	this.m_dtaResults = null;

	// Holds the Prenatal Visits results - All encounter documented results.
	this.m_recordData = null;

	// Holds the list newly selected dynamic labels
	this.selectedDynamicBabyLabels = [];

	// To maintain unique keys - Used to store the event results for which documentation is required.
	this.pvEventsToChart = [];

	// Contains the Prenatal Visit event DTAs based on event id prefix.
	this.pvDTAs = [];

	this.eventIdPrefix = {
		FUNDAL_HEIGHT : 'fundalText',
		PRETERM_SIGNS : 'pretermText',
		CERVICAL_DILATION : 'dilationText',
		CERVICAL_EFFACAEMENT : 'effacementText',
		CERVICAL_STATION : 'stationText',
		SYSTOLIC : 'systolicText',
		DIASTOLIC : 'diastolicText',
		WEIGHT : 'weightText',
		EDEMA : 'edemaText',
		PROTEIN : 'proteinText',
		GLUCOSE : 'glucoseText',
		KETONES : 'ktonesText',
		FETAL_PRESENTATION : 'presentText',
		FETAL_MOVEMENT : 'moveText',
		FETAL_HEART_RATE : 'fhrText',
		FETAL_LIE : 'fetalLieText',
		COMMENTS : 'commentsText',
		NXT_APPTMENT : 'apptmentText',
		SELECT_BABY : 'selectNewBaby',
		OTHER : '_Other'
	};

	// Flag for resource required
	this.setResourceRequired(true);

	this.m_showAmbulatoryView = null;

	this.isSignButtonClicked = false;

	// Default view is "CARD VIEW"
	this.FILTERS = {
		CARD_VIEW : 0,
		FLOWSHEET_VIEW : 1
	};

	this.m_currentGestAge = 0;

	var patientGenderInfo = this.criterion.getPatientInfo().getSex();
	this.m_patientGenderInfo = patientGenderInfo ? patientGenderInfo.meaning : "";

	var patientDOBInfo = this.getCriterion().getPatientInfo().getDOB();
	this.m_dob = patientDOBInfo ? patientDOBInfo.format("dd-mmm-yyyy HH:MM:ss") + ".00" : "";

	// Holds preferences of this component - Used to get the selected view. i.e., Card View or Flowsheet View
	this.prenatalVisitsPrefObj = {
		// Default view is "CARD VIEW"
		prenatalVisitsView : this.FILTERS.CARD_VIEW
	};

	this.lastSelectedFilter = this.prenatalVisitsPrefObj.prenatalVisitsView;

	this.m_isNewVisitRequired = false;
	this.m_isNewVisitRequiredInTableView = false;

	CERN_EventListener.addListener(this, EventListener.EVENT_CLINICAL_EVENT, this.retrieveComponentData, this);
	CERN_EventListener.addListener(this, "pregnancyInfoAvailable", this.retrieveComponentData, this);
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent
 * object.
 */
PrenatalVisitsComponentWF.prototype = new MPageComponent();
PrenatalVisitsComponentWF.prototype.constructor = MPageComponent;

/**
 * Map the Prenatal Visits option 1 object to the bedrock filter mapping so the
 * architecture will know what object to create when it finds the "WF_PREG_PV"
 * filter.
 */
MP_Util.setObjectDefinitionMapping("WF_PREG_PV", PrenatalVisitsComponentWF);

/**
 * Returns DTA info for a list of event sets/codes.
 */
PrenatalVisitsComponentWF.prototype.getDTAs = function() {
	if (this.m_dtaResults === null) {
		var component = this;
		var sendAr = [];
		var allBP = [];
		var systolicArray = [];
		var systolicParamString = "";
		var diastolicArray = [];
		var diastolicParamString = "";
		var criterion = this.getCriterion();

		var pregInfoSR = MP_Resources.getSharedResource("pregnancyInfo");
		var pregInfoObj = pregInfoSR.getResourceData();
		this.m_currentGestAge = pregInfoObj.getGesAge();

		if (this.m_currentGestAge === 0) {
			this.m_currentGestAge = pregInfoObj.getDelGesAge();
		}
		this.m_currentGestAge = this.m_currentGestAge ? this.m_currentGestAge : 0;

		// Create the parameter array
		sendAr.push("^MINE^", criterion.person_id + ".0");
		sendAr.push(criterion.encntr_id + ".0");
		sendAr.push(criterion.provider_id + ".0", criterion.ppr_cd + ".0");
		sendAr.push('"' + this.m_dob + '"');
		sendAr.push('"' + this.m_patientGenderInfo + '"');
		sendAr.push(this.m_currentGestAge);
		sendAr.push(MP_Util.CreateParamArray(this.getAntepartumNote(), 1), MP_Util.CreateParamArray(this.getFundalHt(), 1), MP_Util.CreateParamArray(this.getPreSgnAndSym(), 1), MP_Util.CreateParamArray(this.getCervicalDilation(), 1), MP_Util.CreateParamArray(this.getCervicalEffacementLen(), 1), MP_Util.CreateParamArray(this.getCervicalStation(), 1));

		allBP = this.getBPResGroup();
		if (allBP) {
			var i = 0, len = 0;
			for ( i = 0, len = allBP.length; i < len; i = i + 3) {
				systolicArray.push(allBP[i + 1] + ".0");
				diastolicArray.push(allBP[i + 2] + ".0");
			}
			systolicParamString = "value(" + systolicArray.join(',') + ")";
			diastolicParamString = "value(" + diastolicArray.join(',') + ")";
		}
		else {
			systolicParamString = "0.0";
			diastolicParamString = "0.0";
		}

		sendAr.push(systolicParamString, diastolicParamString, MP_Util.CreateParamArray(this.getWeight(), 1), MP_Util.CreateParamArray(this.getEdema(), 1), MP_Util.CreateParamArray(this.getProtein(), 1), MP_Util.CreateParamArray(this.getGlucose(), 1), MP_Util.CreateParamArray(this.getPresentation(), 1), MP_Util.CreateParamArray(this.getFetalMovement(), 1), MP_Util.CreateParamArray(this.getFetalHrRt(), 1), MP_Util.CreateParamArray(this.getFetalLie(), 1), MP_Util.CreateParamArray(this.getNextAppointment(), 1), MP_Util.CreateParamArray(this.getKetones(), 1));

		var scriptRequest = new ComponentScriptRequest();
		scriptRequest.setProgramName("MP_PREG_GET_PV_DTA");
		scriptRequest.setParameterArray(sendAr);
		scriptRequest.setComponent(this);
		scriptRequest.performRequest();

		scriptRequest.setResponseHandler(function(scriptReply) {
			if (scriptReply.getStatus() === "S") {
				component.m_dtaResults = scriptReply.getResponse();
				component.initializeDTAs();
				component.m_chartEnabled = true;
			}
			return;
		});
	}
};

/**
 * Construct component level menu options i.e. 'Fundal Height' and 'Labor Graph'
 * options for prenatalVisits component. Also, this code handles the actions
 * associated with the toggling between views.
 */
PrenatalVisitsComponentWF.prototype.preProcessing = function() {
	var criterion = this.getCriterion();
	var compMenu = this.getMenu();
	var compId = this.getComponentId();
	var prenatalVisitsi18n = i18n.discernabu.prenatal_visits_o2;
	var component = this;
	// Get the component level preferences (if saved) to restore previous selected view
	var userPrefs = this.getPreferencesObj();

	//Used to call menu item click event handler
	var fundalGraphItem = new MenuSelection("fundalGraph" + compId);
	var encounterBasedSelectionMenu = new MenuSelection("encounterBasedSelectionMenu" + compId);

	var patientGenderInfo = criterion.getPatientInfo().getSex();

	// Check component is displayable and component menu exists
	if (!this.isDisplayable() || !compMenu) {
		return;
	}
	if (patientGenderInfo === null || patientGenderInfo.meaning === null || patientGenderInfo.meaning !== "FEMALE") {
		// No menu option should be added as patient is not a female
		return;
	}
	fundalGraphItem.setLabel(prenatalVisitsi18n.FUNDAL_HEIGHT);
	fundalGraphItem.setClickFunction(function(clickEvent) {
		clickEvent.id = "fundal" + compId;
		component.menuItemOnClickHandler(clickEvent);
	});
	compMenu.addMenuItem(fundalGraphItem);

	encounterBasedSelectionMenu.setLabel(prenatalVisitsi18n.DISPLAY_VISITS_BASED_ON_ENCNTER);
	encounterBasedSelectionMenu.setClickFunction(function(clickEvent) {
		clickEvent.id = "encounterBasedSelectionMenu" + compId;
		component.m_encntrBasedDisplayChoosen = !component.m_encntrBasedDisplayChoosen;
		component.displayResultsBasedOnEncntrsOrVisits(component.m_encntrBasedDisplayChoosen);
		encounterBasedSelectionMenu.setIsSelected(component.m_encntrBasedDisplayChoosen);
	});
	encounterBasedSelectionMenu.setIsSelected(component.m_encntrBasedDisplayChoosen);
	compMenu.addMenuItem(encounterBasedSelectionMenu);

	MP_MenuManager.updateMenuObject(compMenu);

	// Retrieve the saved preferences for card/table view and set the toggle
	if (userPrefs !== null && userPrefs.prenatalVisitsView !== null) {
		this.prenatalVisitsPrefObj.prenatalVisitsView = userPrefs.prenatalVisitsView;
		this.lastSelectedFilter = this.prenatalVisitsPrefObj.prenatalVisitsView;
	}
	else {
		this.lastSelectedFilter = this.getShowAmbulatoryView();
	}

	if (this.lastSelectedFilter === this.FILTERS.CARD_VIEW) {
		this.setActiveHeaderToggleIndex(0);
	}
	else {
		this.setActiveHeaderToggleIndex(1);
	}

	this.setHeaderToggleStyles([{
		active : "table_active",
		inactive : "table_inactive"
	}, {
		active : "viewer_active",
		inactive : "viewer_inactive"
	}]);
};

/**
 * This method handles component level menu options - 'Labor Graph' & 'Fundal Height'
 *
 * @param clickEvent {Event} - Mouse click event.
 */
PrenatalVisitsComponentWF.prototype.menuItemOnClickHandler = function(clickEvent) {
	var criterion = this.getCriterion();
	var prenatalVisitsi18n = i18n.discernabu.prenatal_visits_o2;
	var eventId = clickEvent.id;
	var compId = this.getComponentId();
	var pregInfoSR = null;
	var pregInfoObj = null;

	// Holds Pregnancy Discern Win32 Object.
	var pregDiscernObject = null;

	// Check to see if the pregnancyInfo object is available.
	pregInfoSR = MP_Resources.getSharedResource("pregnancyInfo");
	if (pregInfoSR && pregInfoSR.isResourceAvailable()) {
		pregInfoObj = pregInfoSR.getResourceData();
	}
	else {
		//The pregnancy shared resource is not available so there isn't anything we can do at this point.
		return;
	}

	try {
		pregDiscernObject = window.external.DiscernObjectFactory("PREGNANCY");
		MP_Util.LogDiscernInfo(this, "PREGNANCY", "prenatal-visits-o2.js", "menuItemOnClickHandler");
		if (eventId === "fundal" + compId) {
			pregDiscernObject.LaunchFundalHeightGraph(window, criterion.person_id, pregInfoObj.getPregnancyId());
		}
	}
	catch (discernErr) {
		MP_Util.LogJSError(discernErr, this, "prenatal-visits-o2.js", "menuItemOnClickHandler");
		return;
	}
};

/**
 * This method displays the retrieves results based on encounters.
 */
PrenatalVisitsComponentWF.prototype.displayResultsBasedOnEncntrsOrVisits = function(isEncntrBasedDisplayRequired) {
	var component = this;
	var sendAr = [];
	var allBP = [];
	var systolicArray = [];
	var systolicParamString = "";
	var diastolicArray = [];
	var diastolicParamString = "";
	var compId = this.getComponentId();
	var criterion = this.getCriterion();
	var encntrs = null;
	var encntrStr = "";
	var pregInfoSR = MP_Resources.getSharedResource("pregnancyInfo");
	var pregInfoObj = null;
	var pregnancyId = 0.0;
	var groups = this.getGroups();
	var prenatalVisitsi18n = i18n.discernabu.prenatal_visits_o2;
	var countText = "";

	var componentStyles = this.getStyles();
	var componentHeaderContainer = $('#' + componentStyles.getId()).find('span.' + componentStyles.getTitle());

	//Handle the component level refresh
	//Remove the + symbol from the header if already available

	if (componentHeaderContainer.find('a.add-plus')) {
		if (isEncntrBasedDisplayRequired) {
			componentHeaderContainer.find('a.add-plus').addClass('hidden');
		}
		else {
			MPageComponent.prototype.postProcessing.call(this);
			component.setPlusAddEnabled(true);
			component.getRenderStrategy().addComponentSection(componentHeaderContainer, this.getRenderStrategy().createPlusAddControl());
		}
	}

	pregInfoObj = pregInfoSR.getResourceData();
	pregnancyId = pregInfoObj.getPregnancyId();

	sendAr.push("^MINE^", criterion.person_id + ".0");
	sendAr.push(MP_Util.CreateParamArray(this.getEncType(), 1));
	encntrs = criterion.getPersonnelInfo().getViewableEncounters();
	encntrStr = (encntrs) ? "value(" + encntrs + ")" : "0";
	sendAr.push(encntrStr);
	sendAr.push(criterion.provider_id + ".0", criterion.ppr_cd + ".0");
	sendAr.push(pregInfoObj.getLookBack(), MP_Util.CreateParamArray(this.getCumulativeWt(), 1), MP_Util.CreateParamArray(this.getEstGesAge(), 1), MP_Util.CreateParamArray(this.getAntepartumNote(), 1), MP_Util.CreateParamArray(this.getFundalHt(), 1), MP_Util.CreateParamArray(this.getPreSgnAndSym(), 1), MP_Util.CreateParamArray(this.getCervicalDilation(), 1), MP_Util.CreateParamArray(this.getCervicalEffacementLen(), 1), MP_Util.CreateParamArray(this.getCervicalStation(), 1));
	allBP = this.getBPResGroup();
	if (allBP) {
		var i = 0, len = 0;
		for ( i = 0, len = allBP.length; i < len; i = i + 3) {
			systolicArray.push(allBP[i + 1] + ".0");
			diastolicArray.push(allBP[i + 2] + ".0");
		}
		systolicParamString = "value(" + systolicArray.join(',') + ")";
		diastolicParamString = "value(" + diastolicArray.join(',') + ")";
	}
	else {
		systolicParamString = "0.0";
		diastolicParamString = "0.0";
	}
	sendAr.push(systolicParamString, diastolicParamString, MP_Util.CreateParamArray(this.getWeight(), 1), MP_Util.CreateParamArray(this.getEdema(), 1), MP_Util.CreateParamArray(this.getProtein(), 1), MP_Util.CreateParamArray(this.getGlucose(), 1), MP_Util.CreateParamArray(this.getPresentation(), 1), MP_Util.CreateParamArray(this.getFetalMovement(), 1), MP_Util.CreateParamArray(this.getFetalHrRt(), 1), MP_Util.CreateParamArray(this.getFetalLie(), 1), MP_Util.CreateParamArray(this.getNextAppointment(), 1), MP_Util.CreateParamArray(this.getPain(), 1), MP_Util.CreateParamArray(this.getKetones()));

	var scriptRequest = new ComponentScriptRequest();
	if (component.m_encntrBasedDisplayChoosen) {
		scriptRequest.setProgramName("MP_RETRIEVE_PREG_ASSESSMENT");
	}
	else {
		sendAr.push(1, criterion.encntr_id + ".0");
		scriptRequest.setProgramName("MP_PREG_GET_VISIT_ASSESSMENT");
	}

	scriptRequest.setParameterArray(sendAr);
	scriptRequest.setComponent(component);
	scriptRequest.performRequest();
	var noResultsFound = "<span class = 'pv-wf-no-result'>" + prenatalVisitsi18n.NO_RESULTS_FOUND + "</span>";
	scriptRequest.setResponseHandler(function(scriptReply) {
		if (scriptReply.getStatus() === "Z") {
			component.finalizeComponent(noResultsFound, "");
		}
		else if (scriptReply.getStatus() === "S") {
			if (scriptReply.getResponse().VISITS.length === 0) {
				component.m_recordDataExists = false;
				component.finalizeComponent(noResultsFound, "");
			}
			else {
				component.m_recordDataExists = true;
				component.renderComponent(scriptReply.getResponse());
			}
		}
	});

};

/**
 * Removes menu options for Prenatal visit component and it will be called if
 * pregnacyId is null/0/-1 from retrieveComponentData() method
 */
PrenatalVisitsComponentWF.prototype.removeMenuOptions = function() {
	var menuComp = this.getMenu();
	var compId = this.getComponentId();
	if (menuComp) {
		var menuItems = menuComp.getMenuItemArray();
		i = 0;
		while (i < menuItems.length) {
			var menuId = menuItems[i].m_menuItemId;
			var fundalGraphItem = "fundalGraph" + compId;
			if (menuId == fundalGraphItem) {
				menuComp.removeMenuItem(menuItems[i]);
			}
			var encounterBasedSelectionMenuItem = "encounterBasedSelectionMenu" + compId;
			if (menuId == encounterBasedSelectionMenuItem) {
				menuComp.removeMenuItem(menuItems[i]);
			}
			i++;
		}
	}

};
/**
 * Retrieves the pregnancy information from the shared resources to check
 * whether the patient has an active pregnancy or not.
 */
PrenatalVisitsComponentWF.prototype.RetrieveRequiredResources = function() {
	var pregInfoObj = null;

	// Check to see if the pregnancyInfo object is available to use
	pregInfoObj = MP_Resources.getSharedResource("pregnancyInfo");

	if (pregInfoObj && pregInfoObj.isResourceAvailable()) {
		this.retrieveComponentData();
	}
	else {
		// Kick off the pregnancyInfo data retrieval
		// This component already listens for the pregnancyInfoAvailable event so it will load when the SharedResource is available.
		PREGNANCY_BASE_UTIL_O1.LoadPregnancyData(this.getCriterion());
	}
};

/**
 * This method opens drop down with multiple powerforms for user.
 */
PrenatalVisitsComponentWF.prototype.openDropDown = function(formID) {
	var criterion = this.getCriterion();
	var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + formID + "|0|0";
	MPAGES_EVENT("POWERFORM", paramString);
	this.retrieveComponentData();
};

/**
 *  The setRecordData function sets the record data
 * @param recordData : contains the JSON with all the results and associated information.
 */
PrenatalVisitsComponentWF.prototype.setRecordData = function(recordData) {
	this.m_recordData = recordData;
};

/**
 * The getRecordData function is to retrieve the record data.
 */
PrenatalVisitsComponentWF.prototype.getRecordData = function() {
	return this.m_recordData || [];
};

/**
 * The function sets the selected view and updates the view.
 */
PrenatalVisitsComponentWF.prototype.handleHeaderToggleClick = function(index) {
	var slaTimer = null;
	var criterion = this.getCriterion();

	var timerName = index === 0 ? "CAP:MPG.PRENATALVISITS.O2-TOGGLE-TO-AMBULATORYVIEW" : "CAP:MPG.PRENATALVISITS.O2-TOGGLE-TO-FLOWSHEETVIEW";
	slaTimer = MP_Util.CreateTimer(timerName);

	if (slaTimer) {
		slaTimer.SubtimerName = criterion.category_mean;
		slaTimer.Stop();
	}

	if (this.lastSelectedFilter !== index) {
		// Set the current filter
		this.lastSelectedFilter = index;

		// Update component level preferences - Saves the selected view
		this.prenatalVisitsPrefObj.prenatalVisitsView = this.lastSelectedFilter;
		this.setPreferencesObj(this.prenatalVisitsPrefObj);
		this.savePreferences(true);
	}

	var recordData = this.getRecordData();
	if (recordData.length !== 0) {
		this.renderComponent(recordData);
	}
};

/**
 * Creates a new baby label instance for holding the label details.
 */
PrenatalVisitsComponentWF.prototype.babyLabelInstance = function() {
	this.EVENT_CD = 0.0;
	this.TASK_ASSAY_CD = 0.0;
	this.DESCRIPTION = "";
	this.NOMENCLATURE_ID = 0;
	this.LABEL_TEMPLATE_ID = 0.0;
	this.FETUS_ID = 0;
	this.CONTAINS_VALID_RESULT = false;
};

/**
 * Creates a new baby label instance for holding the label details.
 */
PrenatalVisitsComponentWF.prototype.babyLabelStatusInstance = function() {
	this.BABY_LABEL_ID = 0.0;
	this.STATUS = 0;
};

/**
 * Creates a new visit card instance for holding the visit details.
 */
PrenatalVisitsComponentWF.prototype.visitCardInstance = function() {
	var missingValue = "--";
	var date = new Date();
	this.cardNumber = 0;
	this.encntrId = 0.0;
	this.visitDate = date.format("mm/dd/yy");
	this.ega = missingValue;
	this.fundalHeight = missingValue;
	this.fundalHeightUnit = missingValue;
	this.pretermSigns = missingValue;
	this.systolic = missingValue;
	this.diastolic = missingValue;
	this.dilation = missingValue;
	this.effacement = missingValue;
	this.station = missingValue;
	this.weight = missingValue;
	this.edema = missingValue;
	this.protein = missingValue;
	this.glucose = missingValue;
	this.ketones = missingValue;
	this.comments = missingValue;
	this.nextAppt = missingValue;
	this.nextApptUnit = "";
	this.numberOfBabies = 0;
	this.numberOfBabiesInitial = 0;
	this.babyLabels = [];
	this.numberOfNewlyAddedBabies = 0;
	this.fhr = [];
	this.fetalLie = [];
	this.fetalPresent = [];
	this.fetalMovement = [];
	this.numberOfDropDowns = 0;
	this.numberOfSingleDropDowns = 0;
	this.fetalLiePresent = false;
	this.dropDowns = [];
	this.singleDropDowns = [];
	this.babyLabelObjects = [];
	this.babyLabelIds = [];
	this.babyLabelStat = [];
	this.newBabyLabelIndex = 0;
	this.newFetusIdCnt = 0;
	this.addFetusEnabled = false;
	this.templateId = 0.0;
	this.lastTextBoxEnabled = "";
	this.firstTextBoxEnabled = "";
	this.numberOfAddBabyLinks = 0;
	this.visitDateDisplay = "";
};

/**
 * The setShowAmbulatoryView function sets a flag which indicates whether to render Ambulatory view by default instead of the
 * Flowsheet view.
 *
 * @param showAmbulatoryView :  This is a Bedrock indicator indicating if ambulatory view should be set as default
 */
PrenatalVisitsComponentWF.prototype.setShowAmbulatoryView = function(showAmbulatoryView) {
	// Get the component level preferences (if saved) to restore previous selected view
	var userPrefs = this.getPreferencesObj();

	if (userPrefs !== null && userPrefs.prenatalVisitsView !== null) {
		this.prenatalVisitsPrefObj.prenatalVisitsView = userPrefs.prenatalVisitsView;
		this.lastSelectedFilter = this.prenatalVisitsPrefObj.prenatalVisitsView;
	}
	else {
		this.lastSelectedFilter = showAmbulatoryView ? 1 : 0;
	}
};

/**
 * The getShowAmbulatoryView function gets a flag which indicates whether to render Ambulatory view by default instead of the
 * Flowsheet view.
 */
PrenatalVisitsComponentWF.prototype.getShowAmbulatoryView = function() {
	return this.lastSelectedFilter;
};

/**
 * Sets the result entered for AntepartumNote event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.setAntepartumNote = function(value) {
	this.m_antepartumNote = value;
};

/**
 * Gets the result entered for AntepartumNote event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.getAntepartumNote = function() {
	return this.m_antepartumNote || [];
};

/**
 * Sets the result entered for Encounter Type event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.setEncType = function(value) {
	this.m_encType = value;
};

/**
 * Gets the result entered for Encounter Type event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.getEncType = function() {
	return this.m_encType || [];
};

/**
 * Sets the result entered for Estimated Gestational Age event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.setEstGesAge = function(value) {
	this.m_estGestAge = value;
};

/**
 * Gets the result entered for Estimated Gestational Age event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.getEstGesAge = function() {
	return this.m_estGestAge || [];
};

/**
 * Sets the result entered for Fundal Height event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.setFundalHt = function(value) {
	this.m_fundHeight = value;
};

/**
 * Gets the result entered for Fundal Height event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.getFundalHt = function() {
	return this.m_fundHeight || [];
};

/**
 * Sets the result entered for Preterm signs and symptom event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.setPreSgnAndSym = function(value) {
	this.m_preTermSignsSym = value;
};

/**
 * Gets the result entered for Preterm signs and symptom event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.getPreSgnAndSym = function() {
	return this.m_preTermSignsSym || [];
};

/**
 * Sets the result entered for Cervical Dilation event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.setCervicalDilation = function(value) {
	this.m_cervicalDilation = value;
};

/**
 * Gets the result entered for Cervical Dilation event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.getCervicalDilation = function() {
	return this.m_cervicalDilation || [];
};

/**
 * Sets the result entered for Cervical Effacement event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.setCervicalEffacementLen = function(value) {
	this.m_cervicalEffacement = value;
};

/**
 * Gets the result entered for Cervical Effacement event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.getCervicalEffacementLen = function() {
	return this.m_cervicalEffacement || [];
};

/**
 * Sets the result entered for Cervical Station event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.setCervicalStation = function(value) {
	this.m_cervicalStation = value;
};

/**
 * Gets the result entered for Cervical Station event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.getCervicalStation = function() {
	return this.m_cervicalStation || [];
};

/**
 * Sets the result entered for Cumulative Weight event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.setCumulativeWt = function(value) {
	this.m_cumulativeWt = value;
};

/**
 * Gets the result entered for Cumulative Weight results in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.getCumulativeWt = function() {
	return this.m_cumulativeWt || [];
};

/**
 * Sets the result entered for Weight event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.setWeight = function(value) {
	this.m_weight = value;
};

/**
 * Gets the result entered for Weight event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.getWeight = function() {
	return this.m_weight || [];

};

/**
 * Gets the result entered for Weight event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.setEdema = function(value) {
	this.m_edema = value;
};

/**
 * Gets the result entered for Edema event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.getEdema = function() {
	return this.m_edema || [];
};

/**
 * Sets the result entered for Protein event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.setProtein = function(value) {
	this.m_protein = value;
};

/**
 * Gets the result entered for Protein event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.getProtein = function() {
	return this.m_protein || [];
};

/**
 * Sets the result entered for Glucose event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.setGlucose = function(value) {
	this.m_glucose = value;
};

/**
 * Gets the result entered for Glucose event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.getGlucose = function() {
	return this.m_glucose || [];
};

/**
 * Sets the result entered for NextAppointment event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.setNextAppointment = function(value) {
	this.m_nxtAppt = value;
};

/**
 * Gets the result entered for NextAppointment event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.getNextAppointment = function() {
	return this.m_nxtAppt || [];
};

/**
 * Sets the result entered for Pain event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.setPain = function(value) {
	this.m_pain = value;
};
/**
 * Gets the result entered for Pain event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.getPain = function() {
	return this.m_pain || [];
};

/**
 * Sets the result entered for Fetal Presentation event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.setPresentation = function(value) {
	this.m_presentation = value;
};

/**
 * Gets the result entered for Fetal Presentation event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.getPresentation = function() {
	return this.m_presentation || [];
};

/**
 * Sets the result entered for FetalMovement event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.setFetalMovement = function(value) {
	this.m_fetalMove = value;
};

/**
 * Gets the result entered for FetalMovement event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.getFetalMovement = function() {
	return this.m_fetalMove || [];
};

/**
 * Sets the result entered for FetalHeartRate event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.setFetalHrRt = function(value) {
	this.m_fetalHrRt = value;
};

/**
 * Gets the result entered for FetalHeartRate event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.getFetalHrRt = function() {
	return this.m_fetalHrRt || [];
};

/**
 * Sets the result entered for FetalLie event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.setFetalLie = function(value) {
	this.m_fetalLie = value;
};

/**
 * Gets the result entered for FetalLie event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.getFetalLie = function() {
	return this.m_fetalLie || [];
};

/**
 * Sets the result entered for Cervical Dilation event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.setCervicalDilation = function(value) {
	this.m_cervicalDilation = value;
};

/**
 * Gets the result entered for Cervical Dilation event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.getCervicalDilation = function() {
	return this.m_cervicalDilation || [];
};

/**
 * Sets the result entered for BPResGroup(Systolic/Diastolic) event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.setBPResGroup = function(value) {
	this.m_BPGroup = value;
};

/**
 * Gets the result entered for BPResGroup(Systolic/Diastolic) event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.getBPResGroup = function() {
	return this.m_BPGroup || [];
};

/**
 * Sets the result entered for Ketones event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.setKetones = function(value) {
	this.m_ketones = value;
};

/**
 * Gets the result entered for Ketones event in Interactive View.
 */
PrenatalVisitsComponentWF.prototype.getKetones = function() {
	return this.m_ketones || [];
};
//

/**
 * Creates the filterMappings that will be used when loading the component's
 * bedrock settings
 */
PrenatalVisitsComponentWF.prototype.loadFilterMappings = function() {
	this.addFilterMappingObject("WF_PREG_PV_ENC_TYPE", {
		setFunction : this.setEncType,
		type : "Array",
		field : "PARENT_ENTITY_ID"
	});

	this.addFilterMappingObject("WF_PREG_PV_WEIGHT", {
		setFunction : this.setWeight,
		type : "Array",
		field : "PARENT_ENTITY_ID"
	});

	this.addFilterMappingObject("WF_PREG_PV_ANTEPARTUM_NOTE", {
		setFunction : this.setAntepartumNote,
		type : "Array",
		field : "PARENT_ENTITY_ID"
	});

	this.addFilterMappingObject("WF_PREG_PV_EST_GEST_GAP", {
		setFunction : this.setEstGesAge,
		type : "Array",
		field : "PARENT_ENTITY_ID"
	});

	this.addFilterMappingObject("WF_PREG_PV_FUNDAL_HT", {
		setFunction : this.setFundalHt,
		type : "Array",
		field : "PARENT_ENTITY_ID"
	});

	this.addFilterMappingObject("WF_PREG_PV_PRE_SGN_SYM", {
		setFunction : this.setPreSgnAndSym,
		type : "Array",
		field : "PARENT_ENTITY_ID"
	});

	this.addFilterMappingObject("WF_PREG_PV_CERV_DILAT", {
		setFunction : this.setCervicalDilation,
		type : "Array",
		field : "PARENT_ENTITY_ID"
	});

	this.addFilterMappingObject("WF_PREG_PV_CERV_EFF_LEN", {
		setFunction : this.setCervicalEffacementLen,
		type : "Array",
		field : "PARENT_ENTITY_ID"
	});

	this.addFilterMappingObject("WF_PREG_PV_CERV_STAT", {
		setFunction : this.setCervicalStation,
		type : "Array",
		field : "PARENT_ENTITY_ID"
	});

	this.addFilterMappingObject("WF_PREG_PV_BP_GROUP", {
		setFunction : this.setBPResGroup,
		type : "Array",
		field : "PARENT_ENTITY_ID"
	});

	this.addFilterMappingObject("WF_PREG_PV_CUMULATIVE_WT", {
		setFunction : this.setCumulativeWt,
		type : "Array",
		field : "PARENT_ENTITY_ID"
	});

	this.addFilterMappingObject("WF_PREG_PV_EDEMA", {
		setFunction : this.setEdema,
		type : "Array",
		field : "PARENT_ENTITY_ID"
	});

	this.addFilterMappingObject("WF_PREG_PV_PROTEIN", {
		setFunction : this.setProtein,
		type : "Array",
		field : "PARENT_ENTITY_ID"
	});

	this.addFilterMappingObject("WF_PREG_PV_GLUCOSE", {
		setFunction : this.setGlucose,
		type : "Array",
		field : "PARENT_ENTITY_ID"
	});

	this.addFilterMappingObject("WF_PREG_PV_NEXT_APPT", {
		setFunction : this.setNextAppointment,
		type : "Array",
		field : "PARENT_ENTITY_ID"
	});

	this.addFilterMappingObject("WF_PREG_PV_PAIN", {
		setFunction : this.setPain,
		type : "Array",
		field : "PARENT_ENTITY_ID"
	});

	this.addFilterMappingObject("WF_PREG_PV_PRESENT", {
		setFunction : this.setPresentation,
		type : "Array",
		field : "PARENT_ENTITY_ID"
	});

	this.addFilterMappingObject("WF_PREG_PV_FETAL_MOV", {
		setFunction : this.setFetalMovement,
		type : "Array",
		field : "PARENT_ENTITY_ID"
	});

	this.addFilterMappingObject("WF_PREG_PV_FETAL_HR", {
		setFunction : this.setFetalHrRt,
		type : "Array",
		field : "PARENT_ENTITY_ID"
	});

	this.addFilterMappingObject("WF_PREG_PV_FETAL_LIE", {
		setFunction : this.setFetalLie,
		type : "Array",
		field : "PARENT_ENTITY_ID"
	});

	this.addFilterMappingObject("WF_PREG_PV_KETONES", {
		setFunction : this.setKetones,
		type : "Array",
		field : "PARENT_ENTITY_ID"
	});

	// Add the filter mappings for Ambulatory View
	this.addFilterMappingObject("WF_PREG_PV_DISPLAY", {
		setFunction : this.setShowAmbulatoryView,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});
};

/**
 * It creates the necessary parameter array for the data acquisition and makes
 * the necessary script call to retrieve the Prenatal Visits data.
 */
PrenatalVisitsComponentWF.prototype.retrieveComponentData = function() {
	var component = this;
	var sendAr = [];
	var allBP = [];
	var systolicArray = [];
	var systolicParamString = "";
	var diastolicArray = [];
	var diastolicParamString = "";
	var compId = this.getComponentId();
	var criterion = this.getCriterion();
	var encntrs = null;
	var encntrStr = "";
	var pregInfoSR = MP_Resources.getSharedResource("pregnancyInfo");
	var pregInfoObj = null;
	var pregnancyId = 0.0;
	var groups = this.getGroups();
	var prenatalVisitsi18n = i18n.discernabu.prenatal_visits_o2;
	var countText = "";
	component.isSignButtonClicked = false;

	var loadTimer = new RTMSTimer(this.getComponentLoadTimerName());
	var renderTimer = new RTMSTimer(this.getComponentRenderTimerName());

	MPageComponent.prototype.postProcessing.call(this);
	var componentStyles = this.getStyles();
	var componentHeaderContainer = $('#' + componentStyles.getId()).find('span.' + componentStyles.getTitle());

	//Handle the component level refresh
	//Remove the + symbol from the header if already available
	if (componentHeaderContainer.find('a.add-plus')) {
		componentHeaderContainer.find('a.add-plus').addClass('hidden');
	}

	var patientGenderInfo = criterion.getPatientInfo().getSex();
	if (patientGenderInfo === null || patientGenderInfo.meaning === null || patientGenderInfo.meaning !== "FEMALE") {
		// Male patient so just show a disclaimer
		messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + prenatalVisitsi18n.NOT_FEMALE + "</span></h3><span class='res-none'>" + prenatalVisitsi18n.NOT_FEMALE + "</span>";
		this.finalizeComponent(messageHTML, countText);
		return;
	}
	else if (pregInfoSR && pregInfoSR.isResourceAvailable()) {
		pregInfoObj = pregInfoSR.getResourceData();
		pregnancyId = pregInfoObj.getPregnancyId();
		if (pregnancyId === -1) {
			this.removeMenuOptions();
			// Error occurred while retrieving pregnancy information
			messageHTML = "<h3 class='info-hd'><span class='res-normal'>";
			messageHTML += prenatalVisitsi18n.PREG_DATA_ERROR + "</span></h3><span class='res-none'>";
			messageHTML += prenatalVisitsi18n.PREG_DATA_ERROR + "</span>";
			this.finalizeComponent(messageHTML, countText);
			return;
		}
		else if (!pregnancyId) {
			this.removeMenuOptions();
			// Female patient with no active pregnancy. Show disclaimer and give the option to add a pregnancy
			messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + prenatalVisitsi18n.NO_ACTIVE_PREG + "</span></h3><span class='res-none'>" + prenatalVisitsi18n.NO_ACTIVE_PREG + "</span>";
			this.finalizeComponent(messageHTML, countText);
			return;
		}
		else {
			this.getDTAs();
			// Create the parameter array
			sendAr.push("^MINE^", criterion.person_id + ".0");
			sendAr.push(MP_Util.CreateParamArray(this.getEncType(), 1));
			encntrs = criterion.getPersonnelInfo().getViewableEncounters();
			encntrStr = (encntrs) ? "value(" + encntrs + ")" : "0";
			sendAr.push(encntrStr);
			sendAr.push(criterion.provider_id + ".0", criterion.ppr_cd + ".0");
			sendAr.push(pregInfoObj.getLookBack(), MP_Util.CreateParamArray(this.getCumulativeWt(), 1), MP_Util.CreateParamArray(this.getEstGesAge(), 1), MP_Util.CreateParamArray(this.getAntepartumNote(), 1), MP_Util.CreateParamArray(this.getFundalHt(), 1), MP_Util.CreateParamArray(this.getPreSgnAndSym(), 1), MP_Util.CreateParamArray(this.getCervicalDilation(), 1), MP_Util.CreateParamArray(this.getCervicalEffacementLen(), 1), MP_Util.CreateParamArray(this.getCervicalStation(), 1));
			allBP = this.getBPResGroup();
			if (allBP) {
				var i = 0, len = 0;
				for ( i = 0, len = allBP.length; i < len; i = i + 3) {
					systolicArray.push(allBP[i + 1] + ".0");
					diastolicArray.push(allBP[i + 2] + ".0");
				}
				systolicParamString = "value(" + systolicArray.join(',') + ")";
				diastolicParamString = "value(" + diastolicArray.join(',') + ")";
			}
			else {
				systolicParamString = "0.0";
				diastolicParamString = "0.0";
			}
			sendAr.push(systolicParamString, diastolicParamString, MP_Util.CreateParamArray(this.getWeight(), 1), MP_Util.CreateParamArray(this.getEdema(), 1), MP_Util.CreateParamArray(this.getProtein(), 1), MP_Util.CreateParamArray(this.getGlucose(), 1), MP_Util.CreateParamArray(this.getPresentation(), 1), MP_Util.CreateParamArray(this.getFetalMovement(), 1), MP_Util.CreateParamArray(this.getFetalHrRt(), 1), MP_Util.CreateParamArray(this.getFetalLie(), 1), MP_Util.CreateParamArray(this.getNextAppointment(), 1), MP_Util.CreateParamArray(this.getPain(), 1), MP_Util.CreateParamArray(this.getKetones(), 1));

			component.m_isAddButtonCreated = false;
			var scriptRequest = new ComponentScriptRequest();
			scriptRequest.setProgramName("MP_PREG_GET_VISIT_ASSESSMENT");
			scriptRequest.setParameterArray(sendAr);
			scriptRequest.setComponent(this);
			scriptRequest.setLoadTimer(loadTimer);
			scriptRequest.setRenderTimer(renderTimer);
			scriptRequest.performRequest();
			var noResultsFound = "<span class = 'pv-wf-no-result'>" + prenatalVisitsi18n.NO_RESULTS_FOUND + "</span>";
			scriptRequest.setResponseHandler(function(scriptReply) {
				if (scriptReply.getStatus() === "Z") {
					component.finalizeComponent(noResultsFound, "");
				}
				else if (scriptReply.getStatus() === "S") {
					if (scriptReply.getResponse().VISITS.length === 0) {
						component.m_recordDataExists = false;
						component.finalizeComponent(noResultsFound, "");
					}
					else {
						component.m_recordDataExists = true;
						component.setRecordData(scriptReply.getResponse());
						component.renderComponent(scriptReply.getResponse());
					}
				}
			});

			if (!this.m_isAddButtonCreated) {
				MPageComponent.prototype.postProcessing.call(this);
				var componentStyles = this.getStyles();
				var componentHeaderContainer = $('#' + componentStyles.getId()).find('span.' + componentStyles.getTitle());
				this.setPlusAddEnabled(true);
				this.getRenderStrategy().addComponentSection(componentHeaderContainer, this.getRenderStrategy().createPlusAddControl());
				this.m_isAddButtonCreated = true;
			}

		}
	}
};

/**
 * Creates the hover data for the events which doesn't have dynamic labels using data array object.
 *
 * @param dataArray {array}
 * 		- an array of data with DATE, VALUE, and UNITS fields in each record
 *
 * @param index {number}
 * 		- used to get the event name (title) which will be displayed on hover of an element
 */
PrenatalVisitsComponentWF.prototype.createTableHoverHTML = function(dataArray, index) {
	var hoverHTMLArray = [];
	var hoverDataLength = dataArray.length;
	var eventResultDate = new Date();
	hoverHTMLArray.push("<h4 class='pv-wf-preg-data-title'>", this.m_labelDetail[index].LABEL, "</h4><dl class='pv-wf-preg-all-res'>");

	if (hoverDataLength > 0) {
		// Sort an array by the date value in reverse chronological order
		dataArray.sort(this.resultDateSort);

		for (var i = 0; i < hoverDataLength; i++) {
			eventResultDate.setISO8601(dataArray[i].DATE);
			hoverHTMLArray.push("<dt><span>", eventResultDate.format("longDateTime3"), "</span></dt><dd><span>", dataArray[i].VALUE, " ", dataArray[i].UNITS, "</span></dd><br />");
		}
	}
	else {
		hoverHTMLArray.push("<dt><span>--</span></dt><dd><span>--</span></dd>");
	}
	hoverHTMLArray.push("</dl>");
	this.m_hoverHTML[index] = hoverHTMLArray.join("");
};

/**
 * Creates the hover data for the events which doesn't have dynamic labels using data array object.
 *
 * @param dataArray {array}
 * 		- an array of data with DATE, VALUE, and UNITS fields in each record
 *
 * @param index {number}
 * 		- used to get the event name (title) which will be displayed on hover of an element
 */
PrenatalVisitsComponentWF.prototype.getTableHoverHTML = function(eventResultValue, index) {
	var hoverHTMLArray = "";
	var hoverDataLength = eventResultValue.length;
	hoverHTMLArray = "<div class='hvr pv-wf-table-data-hover'><h4 class='pv-wf-preg-data-title'>" + this.m_labelDetail[index].LABEL + "</h4>";

	if (hoverDataLength > 0) {
		hoverHTMLArray += "<p>" + eventResultValue + "</p></div>";
	}
	else {
		hoverHTMLArray += "<dl><dt><span>--</span></dt><dd><span>--</span></dd></dl></div>";
	}
	return hoverHTMLArray;
};

/**
 * Creates the hover data for blood pressure using data array object.
 *
 * @param dataArray {array}
 * 		- an array of data with DATE, VALUE, and UNITS fields in each record
 *
 * @param index {number}
 * 		- used to get the event name (title) which will be displayed on hover of an element
 */
PrenatalVisitsComponentWF.prototype.createTableBloodPressureHoverHTML = function(dataArray, index) {
	var hoverHTMLArray = [];
	var hoverDataLength = dataArray.length;
	var eventResultDate = new Date();
	var missingValue = "--";
	hoverHTMLArray.push("<h4 class='pv-wf-preg-data-title'>", this.m_labelDetail[index].LABEL, "</h4><dl class='pv-wf-preg-all-res'>");

	var systolicEventResultValue = "";
	var diastolicEventResultValue = "";

	if (hoverDataLength > 0) {
		// Sort an array by the date value in reverse chronological order
		dataArray.sort(this.resultDateSort);

		for (var i = 0; i < hoverDataLength; i++) {
			eventResultDate.setISO8601(dataArray[i].DATE);
			systolicEventResultValue = dataArray[i].SYS_VALUE || missingValue;
			diastolicEventResultValue = dataArray[i].DIA_VALUE || missingValue;
			hoverHTMLArray.push("<dt><span>", eventResultDate.format("longDateTime3"), "</span></dt><dd><span>", systolicEventResultValue, "/", diastolicEventResultValue, "&nbsp;", dataArray[i].UNITS, "</span></dd><br />");
		}
	}
	else {
		hoverHTMLArray.push("<dt><span>--</span></dt><dd><span>--</span></dd>");
	}
	hoverHTMLArray.push("</dl>");
	this.m_hoverHTML[index] = hoverHTMLArray.join("");
};

/**
 * Creates the hover data for the events which has dynamic labels using the data array result.
 *
 * @param dataArray {array}
 * 		- an array of data with DATE, VALUE, and UNITS fields in each record
 *
 * @param index {number}
 * 		- used to get the event name (title) which will be displayed on hover of an element
 */
PrenatalVisitsComponentWF.prototype.createTableDynamicLabelHoverHTML = function(dataArray, index) {
	var hoverHTMLArray = [];
	var hoverDataLength = dataArray.length;
	var eventResultDate = new Date();
	var missingValue = "--";
	var noResExisted = true;
	hoverHTMLArray.push("<h4 class='pv-wf-preg-data-title'>", this.m_labelDetail[index].LABEL, "</h4><dl class='pv-wf-preg-all-res'>");

	if (hoverDataLength > 0) {
		// Sort an array by the date value in reverse chronological order
		dataArray.sort(this.resultDateSort);

		for (var i = 0; i < hoverDataLength; i++) {
			if (dataArray[i].VALUE !== "") {
				noResExisted = false;
				var dynamicLabelValue = dataArray[i].DYNAMIC_LABEL || missingValue;
				eventResultDate.setISO8601(dataArray[i].DATE);
				hoverHTMLArray.push("<dt><span>", eventResultDate.format("longDateTime3"), "</span></dt><dd><span>", dataArray[i].VALUE, "&nbsp;", dataArray[i].UNITS, " [", dynamicLabelValue, "]</span></dd><br />");
			}
		}
		if (noResExisted) {
			hoverHTMLArray.push("<dt><span>--</span></dt><dd><span>--</span></dd>");
		}
	}
	else {
		hoverHTMLArray.push("<dt><span>--</span></dt><dd><span>--</span></dd>");
	}
	hoverHTMLArray.push("</dl>");
	this.m_hoverHTML[index] = hoverHTMLArray.join("");
};

/**
 * Returns the HTML string which will be used to display the event result in content table.
 *
 * @param dataArray {array}
 * 		- an array of data with DATE, VALUE, and UNITS fields in each record
 *
 * @returns index {string}
 * 		- HTML string conatining event value and its unit (if available) and style
 */
PrenatalVisitsComponentWF.prototype.getEventResult = function(eventResult, eventPosition) {
	var missingValue = "--";
	var eventResultDisplay = "";
	var isUnitAvailable = this.m_labelDetail[eventPosition].UNIT_EXISTS || false;
	var hoverHTMLTag = this.m_hoverHTMLTag;

	if (eventResult.length > 0) {
		//eventResult.sort(this.resultDateSort);
		if (eventResult[0].VALUE && isUnitAvailable) {
			var unitStyle = this.m_labelDetail[eventPosition].STYLE === undefined ? "" : this.m_labelDetail[eventPosition].STYLE;
			eventResultDisplay = "<div class='pv-wf-baby-label-tb'><span>" + eventResult[0].VALUE + "</span>" + "&nbsp;<span class='" + unitStyle + "'>" + eventResult[0].UNITS + "</span></div>" + hoverHTMLTag.replace("{0}", "" + eventPosition);
		}
		else if (eventResult[0].VALUE) {
			eventResultDisplay = "<div class='pv-wf-baby-label-tb'>" + eventResult[0].VALUE + "</div>" + hoverHTMLTag.replace("{0}", "" + eventPosition);
		}
	}
	else if (this.m_labelDetail[eventPosition].EVENT_MAPPED) {
		eventResultDisplay = "<div class='pv-wf-baby-label-tb'>" + missingValue + "</div>" + hoverHTMLTag.replace("{0}", "" + eventPosition);
	}
	else {
		eventResultDisplay = "<div class='pv-wf-baby-label-tb'>" + missingValue + "</div>";
	}

	return eventResultDisplay;
};

/**
 * Returns the HTML string which will be used to display the event result in content table.
 *
 * @param dataArray {array}
 * 		- an array of data with DATE, VALUE, and UNITS fields in each record
 *
 * @returns index {string}
 * 		- HTML string conatining event value and its unit (if available) and style
 */
PrenatalVisitsComponentWF.prototype.getEventResults = function(eventResult, eventPosition, textClass) {
	var missingValue = "--";
	var eventResultDisplay = "";
	var isUnitAvailable = this.m_labelDetail[eventPosition].UNIT_EXISTS || false;
	var hoverHTMLTag = this.m_hoverHTMLTag;

	if (eventResult.length > 0) {
		eventResult.sort(this.resultDateSort);
		if (eventResult[0].VALUE && isUnitAvailable) {
			var unitStyle = this.m_labelDetail[eventPosition].STYLE === undefined ? "" : this.m_labelDetail[eventPosition].STYLE;
			eventResultDisplay = "<div class='" + textClass + "'><div class='pv-wf-cervical-tb'>" + eventResult[0].VALUE + "</div><div class='pv-wf-cervical-tb " + unitStyle + "'>" + eventResult[0].UNITS + "</div>" + hoverHTMLTag.replace("{0}", "" + eventPosition) + "</div>";
		}
		else if (eventResult[0].VALUE) {
			eventResultDisplay = "<div class='" + textClass + "'><div class='pv-wf-display-ellipsis'>" + eventResult[0].VALUE + "</div>" + hoverHTMLTag.replace("{0}", "" + eventPosition) + "</div>";
		}
	}
	else if (this.m_labelDetail[eventPosition].EVENT_MAPPED) {
		eventResultDisplay = "<div class='" + textClass + "'>" + missingValue + hoverHTMLTag.replace("{0}", "" + eventPosition) + "</div>";
	}
	else {
		eventResultDisplay = "<div class='" + textClass + "'>" + missingValue + "</div>";
	}

	return eventResultDisplay;
};

/**
 * Initializes the label, event and style details which will used to render the label and content table.
 *
 */
PrenatalVisitsComponentWF.prototype.initializeLabelDetails = function() {
	var prenatalVisitsi18n = i18n.discernabu.prenatal_visits_o2;
	this.m_labelDetail = [];

	// Contains all the every label information that will be shown in label table
	this.m_labelDetail.push({
		LABEL : prenatalVisitsi18n.GESTATIONAL_AGE,
		EVENT_MAPPED : false
	});

	this.m_labelDetail.push({
		LABEL : prenatalVisitsi18n.FUNDAL_HEIGHT,
		EVENT_MAPPED : this.getFundalHt().length > 0,
		UNIT_EXISTS : true,
		STYLE : "pv-wf-unit"
	});

	this.m_labelDetail.push({
		LABEL : prenatalVisitsi18n.FPRESENT,
		EVENT_MAPPED : this.getPresentation().length > 0
	});

	this.m_labelDetail.push({
		LABEL : prenatalVisitsi18n.FHR,
		EVENT_MAPPED : this.getFetalHrRt().length > 0
	});

	this.m_labelDetail.push({
		LABEL : prenatalVisitsi18n.FMOVE,
		EVENT_MAPPED : this.getFetalMovement().length > 0
	});

	this.m_labelDetail.push({
		LABEL : prenatalVisitsi18n.FLIE,
		EVENT_MAPPED : this.getFetalLie().length > 0
	});

	this.m_labelDetail.push({
		LABEL : prenatalVisitsi18n.PRETERMSIGNS,
		EVENT_MAPPED : this.getPreSgnAndSym().length > 0
	});

	this.m_labelDetail.push({
		LABEL : prenatalVisitsi18n.CERVICAL_DIL,
		EVENT_MAPPED : this.getCervicalDilation().length > 0
	});

	this.m_labelDetail.push({
		LABEL : prenatalVisitsi18n.CERVICAL_EFF,
		EVENT_MAPPED : this.getCervicalEffacementLen().length > 0
	});

	this.m_labelDetail.push({
		LABEL : prenatalVisitsi18n.CERVICAL_STAT,
		EVENT_MAPPED : this.getCervicalStation().length > 0
	});

	this.m_labelDetail.push({
		LABEL : prenatalVisitsi18n.BP,
		EVENT_MAPPED : this.getBPResGroup().length > 0
	});

	this.m_labelDetail.push({
		LABEL : prenatalVisitsi18n.WEIGHT,
		EVENT_MAPPED : this.getWeight().length > 0,
		UNIT_EXISTS : true,
		STYLE : "pv-wf-unit"
	});

	this.m_labelDetail.push({
		LABEL : prenatalVisitsi18n.WEIGHT_CHG,
		EVENT_MAPPED : this.getCumulativeWt().length > 0
	});

	this.m_labelDetail.push({
		LABEL : prenatalVisitsi18n.URINE_PROTEIN,
		EVENT_MAPPED : this.getProtein().length > 0
	});

	this.m_labelDetail.push({
		LABEL : prenatalVisitsi18n.URINE_GLUCOSE,
		EVENT_MAPPED : this.getGlucose().length > 0
	});

	this.m_labelDetail.push({
		LABEL : prenatalVisitsi18n.URINE_KETONES,
		EVENT_MAPPED : this.getKetones().length > 0
	});

	this.m_labelDetail.push({
		LABEL : prenatalVisitsi18n.EDEMA,
		EVENT_MAPPED : this.getEdema().length > 0
	});

	this.m_labelDetail.push({
		LABEL : prenatalVisitsi18n.NEXT_APPOINTMENT,
		EVENT_MAPPED : this.getNextAppointment().length > 0,
		UNIT_EXISTS : true
	});

	this.m_labelDetail.push({
		LABEL : prenatalVisitsi18n.COMMENTS,
		EVENT_MAPPED : this.getAntepartumNote().length > 0
	});

	this.m_labelDetail.push({
		LABEL : prenatalVisitsi18n.PROVIDER_NAME,
		EVENT_MAPPED : false
	});
};

/**
 * The method creates an array of all the babies in all the encounters.
 *
 * @param babyArrayindexes {array}
 * 		- holds the baby label ids which are used as indexes for the array of babies the method returns.
 *
 * @param eventResultsArray {array}
 * 		- holds the event results for hvr data.
 *
 * @param recordData {object}
 * 		- record returned by the prg.
 *
 */
PrenatalVisitsComponentWF.prototype.generateBabyLabelArray = function(babyArrayindexes, eventResultsArray, recordData) {
	var component = this;
	var visitCnt = recordData.VISITS.length;

	// Holds the dynamic label id - Number of babies will determined based on this
	var dynamicLabelId;
	var missingVal = "--";

	// Index used to iterate the loop
	var i = 0;
	var j = 0;
	var k = 0;

	// Holds the dynamic label of an event i.e., Baby A, Baby B, etc
	var dynamicLabel = "";
	var babyObjects = [];
	var kount = 0;
	var eventsDataCount = 0;

	var initialDynLabelObj = null;
	var eventIndex = 2;
	// constructing the array of babies using the presentation, fhr, movement and lie data from all the encounters
	for ( i = 0; i < visitCnt; i++) {
		var visitObj = recordData.VISITS[i];

		if (visitObj.PRESENTATION.length > 0) {
			visitObj.PRESENTATION.sort(this.resultDateSort);
			for ( j = visitObj.PRESENTATION.length - 1; j >= 0; j--) {

				initialDynLabelObj = visitObj.PRESENTATION[j];
				dynamicLabelId = String(initialDynLabelObj.DYNAMIC_LABEL_ID);
				if (!babyObjects[dynamicLabelId]) {
					babyArrayindexes[kount] = dynamicLabelId;
					babyObjects[dynamicLabelId] = new this.babyObject();
					babyObjects[dynamicLabelId].DYNAMIC_LABEL_ID = initialDynLabelObj.DYNAMIC_LABEL_ID;
					kount = kount + 1;
					for ( k = 0; k < visitCnt; k++) {
						babyObjects[dynamicLabelId].PRESENT_VALUE[k] = missingVal;
						babyObjects[dynamicLabelId].FHR_VALUE[k] = missingVal;
						babyObjects[dynamicLabelId].MOVE_VALUE[k] = missingVal;
						babyObjects[dynamicLabelId].LIE_VALUE[k] = missingVal;
					}
				}
				babyObjects[dynamicLabelId].LABEL = initialDynLabelObj.DYNAMIC_LABEL;
				if (initialDynLabelObj.VALUE) {
					babyObjects[dynamicLabelId].PRESENT_VALUE[i] = initialDynLabelObj.VALUE;

				}
				else {
					babyObjects[dynamicLabelId].PRESENT_VALUE[i] = missingVal;
				}
				if (this.getShowAmbulatoryView()) {
					eventResultsArray[eventIndex].push(initialDynLabelObj);
				}

			}
		}

		if (visitObj.FHR.length > 0) {
			visitObj.FHR.sort(this.resultDateSort);
			for ( j = visitObj.FHR.length - 1; j >= 0; j--) {
				initialDynLabelObj = visitObj.FHR[j];
				dynamicLabelId = String(initialDynLabelObj.DYNAMIC_LABEL_ID);
				if (!babyObjects[dynamicLabelId]) {
					babyArrayindexes[kount] = dynamicLabelId;
					kount = kount + 1;
					babyObjects[dynamicLabelId] = new this.babyObject();
					babyObjects[dynamicLabelId].DYNAMIC_LABEL_ID = initialDynLabelObj.DYNAMIC_LABEL_ID;
					for ( k = 0; k < visitCnt; k++) {
						babyObjects[dynamicLabelId].PRESENT_VALUE[k] = missingVal;
						babyObjects[dynamicLabelId].FHR_VALUE[k] = missingVal;
						babyObjects[dynamicLabelId].MOVE_VALUE[k] = missingVal;
						babyObjects[dynamicLabelId].LIE_VALUE[k] = missingVal;
					}
				}

				babyObjects[dynamicLabelId].LABEL = initialDynLabelObj.DYNAMIC_LABEL;

				if (initialDynLabelObj.VALUE) {
					babyObjects[dynamicLabelId].FHR_VALUE[i] = initialDynLabelObj.VALUE;

				}
				else {
					babyObjects[dynamicLabelId].FHR_VALUE[i] = missingVal;
				}
				if (this.getShowAmbulatoryView()) {
					eventResultsArray[eventIndex + 1].push(initialDynLabelObj);
				}

			}
		}

		if (visitObj.FETAL_MOVEMENT.length > 0) {
			visitObj.FETAL_MOVEMENT.sort(this.resultDateSort);
			for ( j = visitObj.FETAL_MOVEMENT.length - 1; j >= 0; j--) {
				initialDynLabelObj = visitObj.FETAL_MOVEMENT[j];
				dynamicLabelId = String(initialDynLabelObj.DYNAMIC_LABEL_ID);
				if (!babyObjects[dynamicLabelId]) {
					babyArrayindexes[kount] = dynamicLabelId;
					kount = kount + 1;
					babyObjects[dynamicLabelId] = new this.babyObject();
					babyObjects[dynamicLabelId].DYNAMIC_LABEL_ID = initialDynLabelObj.DYNAMIC_LABEL_ID;
					for ( k = 0; k < visitCnt; k++) {
						babyObjects[dynamicLabelId].PRESENT_VALUE[k] = missingVal;
						babyObjects[dynamicLabelId].FHR_VALUE[k] = missingVal;
						babyObjects[dynamicLabelId].MOVE_VALUE[k] = missingVal;
						babyObjects[dynamicLabelId].LIE_VALUE[k] = missingVal;
					}
				}

				babyObjects[dynamicLabelId].LABEL = initialDynLabelObj.DYNAMIC_LABEL;
				//babyObjects[dynamicLabelId].MOVE_VALUE[i] = initialDynLabelObj.VALUE ? initialDynLabelObj.VALUE : missingVal;
				if (initialDynLabelObj.VALUE) {
					babyObjects[dynamicLabelId].MOVE_VALUE[i] = initialDynLabelObj.VALUE;

				}
				else {
					babyObjects[dynamicLabelId].MOVE_VALUE[i] = missingVal;
				}
				if (this.getShowAmbulatoryView()) {
					eventResultsArray[eventIndex + 2].push(initialDynLabelObj);
				}

			}
		}

		if (visitObj.FETAL_LIE.length > 0) {
			visitObj.FETAL_LIE.sort(this.resultDateSort);
			for ( j = visitObj.FETAL_LIE.length - 1; j >= 0; j--) {
				initialDynLabelObj = visitObj.FETAL_LIE[j];
				dynamicLabelId = String(initialDynLabelObj.DYNAMIC_LABEL_ID);
				if (!babyObjects[dynamicLabelId]) {
					babyArrayindexes[kount] = dynamicLabelId;
					kount = kount + 1;
					babyObjects[dynamicLabelId] = new this.babyObject();
					babyObjects[dynamicLabelId].DYNAMIC_LABEL_ID = initialDynLabelObj.DYNAMIC_LABEL_ID;
					for ( k = 0; k < visitCnt; k++) {
						babyObjects[dynamicLabelId].PRESENT_VALUE[k] = missingVal;
						babyObjects[dynamicLabelId].FHR_VALUE[k] = missingVal;
						babyObjects[dynamicLabelId].MOVE_VALUE[k] = missingVal;
						babyObjects[dynamicLabelId].LIE_VALUE[k] = missingVal;
					}
				}

				babyObjects[dynamicLabelId].LABEL = initialDynLabelObj.DYNAMIC_LABEL;
				//babyObjects[dynamicLabelId].LIE_VALUE[i] = initialDynLabelObj.VALUE ? initialDynLabelObj.VALUE : missingVal;
				if (initialDynLabelObj.VALUE) {
					babyObjects[dynamicLabelId].LIE_VALUE[i] = initialDynLabelObj.VALUE;

				}
				else {
					babyObjects[dynamicLabelId].LIE_VALUE[i] = missingVal;
				}
				if (this.getShowAmbulatoryView()) {
					eventResultsArray[eventIndex + 3].push(initialDynLabelObj);
				}

			}
		}
	}
	this.sortTableViewBabyLabels(babyObjects, babyArrayindexes);
	return babyObjects;

};

/**
 * The method compares two strings and returns the greater one.
 *
 * @param string1 {object}
 * 		- holds the baby label
 *
 * @param string2 {object}
 * 		- holds the baby label
 *
 */
PrenatalVisitsComponentWF.prototype.compareStrings = function(string1, string2) {
	return string1.localeCompare(string2);
};

/**
 * The sorts the baby labels.
 *
 * @param babyLabels {array}
 * 		- holds the baby objects of all the encounters
 *
 */
PrenatalVisitsComponentWF.prototype.sortTableViewBabyLabels = function(babyLabels, babyArrayindexes) {
	var temp;
	var babyLabelsLength = babyArrayindexes.length;
	for ( i = 0; i < babyLabelsLength - 1; i++) {
		for ( j = 0; j < babyLabelsLength - i - 1; j++) {
			if (this.compareStrings(String(babyLabels[babyArrayindexes[j]].LABEL), String(babyLabels[babyArrayindexes[j + 1]].LABEL)) == 1) {
				temp = babyArrayindexes[j];
				babyArrayindexes[j] = babyArrayindexes[j + 1];
				babyArrayindexes[j + 1] = temp;
			}
		}
	}
};

/**
 * The sorts the baby labels.
 *
 * @param babyLabels {array}
 * 		- holds the baby objects of all the encounters
 *
 */
PrenatalVisitsComponentWF.prototype.sortCardViewBabyLabels = function(babyLabels) {
	var temp;
	var babyLabelsLength = babyLabels.length;
	for ( i = 0; i < babyLabelsLength - 1; i++) {
		for ( j = 0; j < babyLabelsLength - i - 1; j++) {
			if (this.compareStrings(String(babyLabels[j].LABEL), String(babyLabels[j + 1].LABEL)) == 1) {
				temp = babyLabels[j];
				babyLabels[j] = babyLabels[j + 1];
				babyLabels[j + 1] = temp;
			}
		}
	}
};

/**
 * The method creates the baby objects.
 *
 */
PrenatalVisitsComponentWF.prototype.babyObject = function() {
	this.STATUS = false;
	this.LABEL = "--";
	this.PRESENT_VALUE = [];
	this.MOVE_VALUE = [];
	this.FHR_VALUE = [];
	this.LIE_VALUE = [];
	this.DYNAMIC_LABEL_ID = "";
};

/**
 * The method creates an object which holds Event Position - Index used to get event results and hover for creating the table.
 */
PrenatalVisitsComponentWF.prototype.indexBucket = function() {
	this.eventIndex = 0;
	this.resultIndex = -1;
};

/**
 * The method populates the charted results into rows of the table.
 *
 * @param babyObjects {object}
 * 		- holds the baby objects of all the encounters
 *
 * @param babyObajectsIndexes {object}
 * 		- holds the indexes for babyObjects
 *
 * @param babyNumber {integer}
 * 		- holds the indexes for hover and result data
 *
 * @param colNum {integer} - the column number that needs to be editable
 *
 * @param card {object} - holds the visit instance
 */

PrenatalVisitsComponentWF.prototype.buildEditableFetalColumn = function(babyObjects, babyObajectsIndexes, babyNumber, colNum, card) {
	var recordData = this.getRecordData();
	var visitObj = recordData.VISITS[colNum];
	var prenatalVisitsi18n = i18n.discernabu.prenatal_visits_o2;
	var compId = this.getComponentId();
	var component = this;
	var dtaResults = this.m_dtaResults;
	var editableFetalColumn = "";
	var isFetalLiePresent = (this.getFetalLie().length > 0) ? true : false;
	var k = babyNumber;
	var fetusId = babyNumber + "_" + compId;
	var missingVal = "--";

	card.babyLabelIds[babyNumber] = babyObajectsIndexes[babyNumber];
	var addFetusId = card.newFetusIdCnt + "_" + babyNumber + "_" + compId;

	if (component.m_isNewVisitRequiredTableView) {
		card.fetalPresent[babyNumber] = missingVal;
		card.fhr[babyNumber] = missingVal;
		card.fetalMovement[babyNumber] = missingVal;
		card.fetalLie[babyNumber] = missingVal;
	}
	else {
		card.fetalPresent[babyNumber] = babyObjects[babyObajectsIndexes[k]].PRESENT_VALUE[colNum];
		card.fhr[babyNumber] = babyObjects[babyObajectsIndexes[k]].FHR_VALUE[colNum];
		card.fetalMovement[babyNumber] = babyObjects[babyObajectsIndexes[k]].MOVE_VALUE[colNum];
		card.fetalLie[babyNumber] = babyObjects[babyObajectsIndexes[k]].LIE_VALUE[colNum];
	}

	editableFetalColumn += "<div id='fetalSectionDiv_" + fetusId + "'><div id='fetalDataSectionDiv_" + fetusId + "'>";
	var addBabyLink = "<div class='pv-wf-tb-reactivate-margin-add-baby' id = 'addFetus" + compId + card.numberOfAddBabyLinks + "'><div class=' pv-wf-baby-label-tb-header-edit-margin'><a id= 'addFetus" + compId + "'>" + prenatalVisitsi18n.ADD_BABY + "</a></div></div>";
	if (component.m_babyLabelStatusInstanceArr[babyObajectsIndexes[k]].STATUS) {
		editableFetalColumn += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-header'><div class=' pv-wf-baby-label-tb-header-edit-margin'>" + babyObjects[babyObajectsIndexes[k]].LABEL + "</div><div id='inactivateFetus_" + fetusId + "' class='pv-wf-inactivate-indicator-tb'></div></div>";
		editableFetalColumn += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + this.generateField(dtaResults.FETAL_PRES_REC_DTA, 'pv-wf-edit-control-position pv-wf-edit-control-position-fetal', "presentText_" + addFetusId, card.fetalPresent[babyNumber], card) + "</div>";
		editableFetalColumn += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + this.generateField(dtaResults.FHR_REC_DTA, 'pv-wf-edit-control-position pv-wf-edit-control-position-fetal', "fhrText_" + addFetusId, card.fhr[babyNumber], card) + "</div>";
		if (!isFetalLiePresent) {
			if (babyNumber == babyObajectsIndexes.length - 1) {
				editableFetalColumn += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + this.generateField(dtaResults.FETAL_MOVE_REC_DTA, 'pv-wf-edit-control-position pv-wf-edit-control-position-fetal', "moveText_" + addFetusId, card.fetalMovement[babyNumber], card) + addBabyLink + "</div>" + "";

			}
			else {
				editableFetalColumn += "<div class=' pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + this.generateField(dtaResults.FETAL_MOVE_REC_DTA, 'pv-wf-edit-control-position pv-wf-display-inline pv-wf-edit-control-position-fetal', "moveText_" + addFetusId, card.fetalMovement[babyNumber], card) + "</div>";

			}
		}
		else {
			editableFetalColumn += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + this.generateField(dtaResults.FETAL_MOVE_REC_DTA, 'pv-wf-edit-control-position pv-wf-display-inline pv-wf-edit-control-position-fetal', "moveText_" + addFetusId, card.fetalMovement[babyNumber], card) + "</div>";

		}
		if (isFetalLiePresent) {
			if (babyNumber == babyObajectsIndexes.length - 1) {
				editableFetalColumn += "<div class=' pv-wf-baby-label-tb-lie pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + this.generateField(dtaResults.FETAL_LIE_REC_DTA, 'pv-wf-edit-control-position pv-wf-edit-control-position-fetal', "fetalLieText_" + addFetusId, card.fetalLie[babyNumber], card) + addBabyLink + "</div>";

			}
			else {
				editableFetalColumn += "<div class=' pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + this.generateField(dtaResults.FETAL_LIE_REC_DTA, 'pv-wf-edit-control-position pv-wf-edit-control-position-fetal pv-wf-display-inline', "fetalLieText_" + addFetusId, card.fetalLie[babyNumber], card) + "</div>";

			}
		}
	}
	else {
		if (babyNumber == babyObajectsIndexes.length - 1) {
			editableFetalColumn += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-header'><div class=' pv-wf-baby-label-tb-header-edit-margin'>" + babyObjects[babyObajectsIndexes[k]].LABEL + "</div></div>";
			editableFetalColumn += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header'></div>";
			editableFetalColumn += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header'><a id = 'reactivate_" + fetusId + "' class='pv-wf-tb-reactivate-margin pv-wf-baby-reactivate'>" + prenatalVisitsi18n.REACTIVATE + " " + babyObjects[babyObajectsIndexes[k]].LABEL + "</a></div>";
			editableFetalColumn += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header'>" + addBabyLink + "</div>";
			if (isFetalLiePresent) {
				editableFetalColumn += " <div  class='pv-wf-baby-label-tb-lie pv-wf-baby-label-tb-inactive-header'></div>";
			}
		}
		else {
			editableFetalColumn += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-header'><div class=' pv-wf-baby-label-tb-header-edit-margin'>" + babyObjects[babyObajectsIndexes[k]].LABEL + "</div></div>";
			editableFetalColumn += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header'></div>";
			editableFetalColumn += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header'><a id = 'reactivate_" + fetusId + "' class='pv-wf-tb-reactivate-margin pv-wf-baby-reactivate'>" + prenatalVisitsi18n.REACTIVATE + " " + babyObjects[babyObajectsIndexes[k]].LABEL + "</a></div>";
			editableFetalColumn += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header'></div>";
			if (isFetalLiePresent) {
				editableFetalColumn += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header'></div>";
			}
		}
	}
	return editableFetalColumn + "</div></div>";

};

/**
 * The method builds a new direct entry card to add a new visit.
 *
 * @param babyObjects {object}
 * 		- holds the baby objects of all the encounters
 *
 * @param babyObajectsIndexes {object}
 * 		- holds the indexes for babyObjects
 *
 * @param indexes {object}
 * 		- holds the indexes for hover and result data
 *
 * @param resultObj {object} - holds the results
 *
 * @param colNum {integer} - the column number that needs to be editable
 */
PrenatalVisitsComponentWF.prototype.buildNewVisitColumn = function(babyObjects, babyObajectsIndexes, indexes, resultObj, colNum) {
	var recordData = this.getRecordData();
	var component = this;

	if (component.m_isNewVisitRequiredInTableView) {
		recordData = this.m_recordDataToday;
	}
	var card = new this.visitCardInstance();
	var eventIndex = indexes.eventIndex;
	var resultIndex = indexes.resultIndex;
	var prenatalVisitsi18n = i18n.discernabu.prenatal_visits_o2;
	var dtaResults = this.m_dtaResults;
	var compId = this.getComponentId();
	card.encntrId = "";
	card.dropDowns = [];
	card.singleDropDowns = [];
	card.cardNumber = colNum;
	var missingVal = this.m_emptyVal;
	var isFetalLiePresent = (this.getFetalLie().length > 0) ? true : false;

	var k = 0;
	var whiteTheme = "pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-white pv-wf-baby-label-tb-theme-font";

	var egaWeeks;
	var egaDays;

	var columnHTML = "";

	eventResultHTML = "<div class = '" + whiteTheme + "'>" + missingVal + "</div>";
	eventIndex++;
	columnHTML += eventResultHTML;

	this.buildCard(card, component.m_recordDataToday.VISITS[0]);
	eventResultHTML = "<div class='pv-wf-baby-label-tb'>" + this.generateField(dtaResults.FUNDAL_HEIGHT_REC_DTA, "pv-wf-edit-control-position", "fundalText_" + compId, card.fundalHeight, card) + "</div>";
	columnHTML += eventResultHTML;
	eventIndex++;
	card.addFetusEnabled = this.checkTemplateIdEquality(card);
	card.numberOfBabies = babyObajectsIndexes.length;
	card.numberOfBabiesInitial = babyObajectsIndexes.length;
	card.fhr = [];
	card.fetalLie = [];
	card.fetalPresent = [];
	card.fetalMovement = [];
	card.babyLabels = [];
	card.babyLabelIds = [];

	var editableFetalColumn = "<div id='fetalColumn_" + colNum + "_" + compId + "'  class='pv-wf-baby-label-tb-border-side'>";
	if (babyObajectsIndexes.length !== 0) {
		var indexesObjeLength = babyObajectsIndexes.length;
		for (var babyNumber = 0; babyNumber < indexesObjeLength; babyNumber++) {
			card.babyLabels[babyNumber] = babyObjects[babyObajectsIndexes[babyNumber]].LABEL;
			editableFetalColumn += this.buildEditableFetalColumn(babyObjects, babyObajectsIndexes, babyNumber, colNum, card);
		}
	}
	else {
		var addBabyLink = "<div class='pv-wf-display-inline'><a id= 'addFetus" + compId + "' class='pv-wf-edit-control-position'>" + prenatalVisitsi18n.ADD_BABY + "</a></div>";
		var emptyFetalSection = "";
		emptyFetalSection += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-header'></div>";
		emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-white pv-wf-baby-label-tb-theme-font'></div>";
		emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + addBabyLink + "</div>";
		emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-white pv-wf-baby-label-tb-theme-font'></div>";

		if (isFetalLiePresent) {
			emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'></div>";
		}
		editableFetalColumn += emptyFetalSection;
	}
	editableFetalColumn += "</div>";

	columnHTML += editableFetalColumn;
	eventIndex++;

	eventResultHTML = "<div class='pv-wf-baby-label-tb'>" + this.generateField(dtaResults.PRETERM_SIGNS_REC_DTA, "pv-wf-edit-preterm-position-width pv-wf-edit-control-position", "pretermText_" + compId, card.pretermSigns, card) + "</div>";

	columnHTML += eventResultHTML;
	eventIndex++;

	eventResultHTML = "<div class='pv-wf-baby-label-tb'><div  class='pv-wf-cervical-tb'>" + this.generateField(dtaResults.CERVICAL_DIL_REC_DTA, "pv-wf-edit-cervical-position-width pv-wf-edit-control-position", "dilationText_" + compId, card.dilation, card);
	eventResultHTML += "</div><div  class='pv-wf-cervical-tb'>" + this.generateField(dtaResults.CERVICAL_EFF_REC_DTA, "pv-wf-edit-cervical-position-width pv-wf-edit-control-position", "effacementText_" + compId, card.effacement, card) + "</div><div  class='pv-wf-cervical-tb'>";
	eventResultHTML += this.generateField(dtaResults.CERVICAL_STAT_REC_DTA, "pv-wf-edit-cervical-position-width pv-wf-edit-control-position", "stationText_" + compId, card.station, card) + "</div></div>";
	columnHTML += eventResultHTML;
	eventIndex++;

	eventResultHTML = "<div class='pv-wf-baby-label-tb'><div  class='pv-wf-cervical-tb'>";
	eventResultHTML += this.generateField(dtaResults.SYS_BP_REC_DTA, "pv-wf-edit-cervical-position-width pv-wf-edit-control-position", "systolicText_" + compId, card.systolic, card);
	eventResultHTML += "</div><div  class='pv-wf-cervical-tb'> / </div><div  class='pv-wf-cervical-tb'>";
	eventResultHTML += this.generateField(dtaResults.DIA_BP_REC_DTA, "pv-wf-edit-cervical-position-width pv-wf-edit-control-position", "diastolicText_" + compId, card.diastolic, card) + "</div></div>";
	columnHTML += eventResultHTML;
	eventIndex++;

	//card.weight = missingVal;

	eventResultHTML = "<div class='pv-wf-baby-label-tb'>" + this.generateField(dtaResults.WEIGHT_REC_DTA, "pv-wf-edit-urine-position-width pv-wf-edit-control-position", "weightText_" + compId, card.weight, card) + "</div>";
	columnHTML += eventResultHTML;
	eventIndex++;

	eventResultHTML = "<div class='pv-wf-baby-label-tb'>" + this.generateField(dtaResults.URINE_PROTEIN_REC_DTA, "pv-wf-edit-urine-position-width pv-wf-edit-control-position", "proteinText_" + compId, card.protein, card) + "</div>";
	columnHTML += eventResultHTML;
	eventIndex++;

	eventResultHTML = "<div class='pv-wf-baby-label-tb'>" + this.generateField(dtaResults.URINE_GLUCOSE_REC_DTA, "pv-wf-edit-urine-position-width pv-wf-edit-control-position", "glucoseText_" + compId, card.glucose, card) + "</div>";
	columnHTML += eventResultHTML;
	eventIndex++;

	eventResultHTML = "<div class='pv-wf-baby-label-tb'>" + this.generateField(dtaResults.URINE_KETONES_REC_DTA, "pv-wf-edit-urine-position-width pv-wf-edit-control-position", "ktonesText_" + compId, card.ketones, card) + "</div>";
	columnHTML += eventResultHTML;
	eventIndex++;

	eventResultHTML = "<div class='pv-wf-baby-label-tb'>" + this.generateField(dtaResults.EDEMA_REC_DTA, "pv-wf-edit-urine-position-width pv-wf-edit-control-position", "edemaText_" + compId, card.edema, card) + "</div>";
	columnHTML += eventResultHTML;
	eventIndex++;

	eventResultHTML = "<div class='pv-wf-baby-label-tb'>" + this.generateField(dtaResults.NEXT_APPT_REC_DTA, "pv-wf-edit-preterm-position-width pv-wf-edit-control-position", "apptmentText_" + compId, card.nextAppt, card) + "</div>";
	columnHTML += eventResultHTML;
	eventIndex++;

	var textClass = 'pv-wf-comments-input-tb pv-wf-card-de-text-box pv-wf-card-comment-box';
	var readAttr = "readonly";
	var commentsValue = card.comments;
	if (dtaResults.COMMENT_REC_DTA.length !== 1) {
		textClass = textClass + " pv-wf-disable-color";
		readAttr = "readonly";
	}
	else {
		var eventType = dtaResults.COMMENT_REC_DTA[0].EVENT_CODE_TYPE;
		if (eventType === "FREETEXT") {
			if (commentsValue == missingVal) {
				textClass = textClass + " pv-wf-unsigned-color";
				readAttr = "";
				commentsValue = "";
			}
			else {
				textClass = textClass + " pv-wf-signed-color pv-wf-context-menu";
				readAttr = "readonly";
			}
		}
		else {
			textClass = textClass + " pv-wf-disable-color";
			readAttr = "readonly";
		}

	}

	if (commentsValue === "") {
		this.m_activeFields[this.m_activeFields.length] = "commentsText_" + compId;
		eventResultHTML = "<div ><textarea  placeholder = '" + prenatalVisitsi18n.ADD_COMMENT + "' id='" + "commentsText_" + compId + "' class ='" + textClass + " '" + readAttr + ">" + commentsValue + "</textarea></div>";
	}
	else {
		eventResultHTML = "<div><textarea  tabindex='-1' placeholder = '" + prenatalVisitsi18n.ADD_COMMENT + "' id='" + "commentsText_" + compId + "' class ='" + textClass + " '" + readAttr + ">" + commentsValue + "</textarea></div>";
	}

	columnHTML += eventResultHTML;

	resultObj[++resultIndex]["VISIT_RESULTS_" + colNum] = columnHTML;
	eventIndex++;
	indexes.eventIndex = eventIndex;
	indexes.resultIndex = resultIndex;

	return card;
};

/**
 * The method populates the charted results into rows of the table.
 *
 * @param babyObjects {object}
 * 		- holds the baby objects of all the encounters
 *
 * @param babyObajectsIndexes {object}
 * 		- holds the indexes for babyObjects
 *
 * @param indexes {object}
 * 		- holds the indexes for hover and result data
 *
 * @param resultObj {object} - holds the results
 *
 * @param colNum {integer} - the column number that needs to be editable
 */
PrenatalVisitsComponentWF.prototype.buildEditableColumn = function(babyObjects, babyObajectsIndexes, indexes, resultObj, colNum) {
	var recordData = this.getRecordData();
	var visitObj = recordData.VISITS[colNum];

	var card = new this.visitCardInstance();
	var eventIndex = indexes.eventIndex;
	var resultIndex = indexes.resultIndex;
	var prenatalVisitsi18n = i18n.discernabu.prenatal_visits_o2;
	var dtaResults = this.m_dtaResults;
	var compId = this.getComponentId();
	var component = this;
	card.encntrId = visitObj.ENCNTR_ID;
	card.dropDowns = [];
	card.singleDropDowns = [];
	card.cardNumber = colNum;
	card.visitDateDisplay = visitObj.VISIT_DATE;
	var missingVal = this.m_emptyVal;
	var isFetalLiePresent = (this.getFetalLie().length > 0) ? true : false;

	var k = 0;
	var whiteTheme = "pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-white pv-wf-baby-label-tb-theme-font";

	var egaWeeks;
	var egaDays;

	var columnHTML = "";

	// Add result for "Gestational Age"
	if (visitObj.EGA.length > 0) {
		visitObj.EGA.sort(this.resultDateSort);
		if (visitObj.EGA[0].VALUE) {
			eventResultHTML = eventResultHTML = "<div class = '" + whiteTheme + "'>" + visitObj.EGA[0].VALUE + "</div>";
		}
		else {
			egaWeeks = (visitObj.EGA[0].WEEKS === "") ? "0" : visitObj.EGA[0].WEEKS;
			egaDays = (visitObj.EGA[0].DAYS === "") ? "0" : visitObj.EGA[0].DAYS;
			eventResultHTML = "<div class = '" + whiteTheme + "'>" + egaWeeks + prenatalVisitsi18n.WEEK_ABBV + egaDays + prenatalVisitsi18n.DAY_ABBV + "</div>";
		}
	}
	else {
		eventResultHTML = "<div class = '" + whiteTheme + "'>" + missingVal + "</div>";
	}

	eventIndex++;
	columnHTML += eventResultHTML;

	if (visitObj.FUNDAL_HEIGHT.length > 0) {
		card.fundalHeight = visitObj.FUNDAL_HEIGHT[0].VALUE;
	}
	else {
		card.fundalHeight = missingVal;
	}

	eventResultHTML = "<div class='pv-wf-baby-label-tb'>" + this.generateField(dtaResults.FUNDAL_HEIGHT_REC_DTA, "pv-wf-edit-control-position", "fundalText_" + compId, card.fundalHeight, card) + "</div>";
	columnHTML += eventResultHTML;
	eventIndex++;
	card.addFetusEnabled = this.checkTemplateIdEquality(card);
	card.numberOfBabies = babyObajectsIndexes.length;
	card.numberOfBabiesInitial = babyObajectsIndexes.length;
	card.fhr = [];
	card.fetalLie = [];
	card.fetalPresent = [];
	card.fetalMovement = [];
	card.babyLabels = [];
	card.babyLabelIds = [];

	var editableFetalColumn = "<div id='fetalColumn_" + colNum + "_" + compId + "'  class='pv-wf-baby-label-tb-border-side'>";
	if (babyObajectsIndexes.length !== 0) {
		for (var babyNumber = 0; babyNumber < babyObajectsIndexes.length; babyNumber++) {
			card.babyLabels[babyNumber] = babyObjects[babyObajectsIndexes[babyNumber]].LABEL;
			editableFetalColumn += this.buildEditableFetalColumn(babyObjects, babyObajectsIndexes, babyNumber, colNum, card);
		}
	}
	else {
		var addBabyLink = "<div class='pv-wf-display-inline'><a id= 'addFetus" + compId + "' class='pv-wf-edit-control-position'>" + prenatalVisitsi18n.ADD_BABY + "</a></div>";
		var emptyFetalSection = "";
		emptyFetalSection += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-header'></div>";
		emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-white pv-wf-baby-label-tb-theme-font'></div>";
		emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + addBabyLink + "</div>";
		emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-white pv-wf-baby-label-tb-theme-font'></div>";

		if (isFetalLiePresent) {
			emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'></div>";
		}
		editableFetalColumn += emptyFetalSection;
	}
	editableFetalColumn += "</div>";

	columnHTML += editableFetalColumn;
	eventIndex++;

	if (visitObj.PRETERM_SIGNS.length > 0) {
		card.pretermSigns = visitObj.PRETERM_SIGNS[0].VALUE;
	}
	else {
		card.pretermSigns = missingVal;
	}
	eventResultHTML = "<div class='pv-wf-baby-label-tb'>" + this.generateField(dtaResults.PRETERM_SIGNS_REC_DTA, "pv-wf-edit-preterm-position-width pv-wf-edit-control-position", "pretermText_" + compId, card.pretermSigns, card) + "</div>";

	columnHTML += eventResultHTML;
	eventIndex++;

	if (visitObj.CERVICAL_DIL.length > 0) {
		card.dilation = visitObj.CERVICAL_DIL[0].VALUE;
	}
	else {
		card.dilation = missingVal;
	}
	if (visitObj.CERVICAL_EFF.length > 0) {
		card.effacement = visitObj.CERVICAL_EFF[0].VALUE;
	}
	else {
		card.effacement = missingVal;
	}
	if (visitObj.CERVICAL_STAT.length > 0) {
		card.station = visitObj.CERVICAL_STAT[0].VALUE;
	}
	else {
		card.station = missingVal;
	}

	eventResultHTML = "<div class='pv-wf-baby-label-tb'><div  class='pv-wf-cervical-tb'>" + this.generateField(dtaResults.CERVICAL_DIL_REC_DTA, "pv-wf-edit-cervical-position-width pv-wf-edit-control-position", "dilationText_" + compId, card.dilation, card);
	eventResultHTML += "</div><div  class='pv-wf-cervical-tb'>" + this.generateField(dtaResults.CERVICAL_EFF_REC_DTA, "pv-wf-edit-cervical-position-width pv-wf-edit-control-position", "effacementText_" + compId, card.effacement, card) + "</div><div  class='pv-wf-cervical-tb'>";
	eventResultHTML += this.generateField(dtaResults.CERVICAL_STAT_REC_DTA, "pv-wf-edit-cervical-position-width pv-wf-edit-control-position", "stationText_" + compId, card.station, card) + "</div></div>";
	columnHTML += eventResultHTML;
	eventIndex++;

	if (visitObj.BP.length > 0) {
		card.diastolic = visitObj.BP[0].DIA_VALUE;
		card.systolic = visitObj.BP[0].SYS_VALUE;
	}
	else {
		card.diastolic = missingVal;
		card.systolic = missingVal;
	}

	eventResultHTML = "<div class='pv-wf-baby-label-tb'><div  class='pv-wf-cervical-tb'>";
	eventResultHTML += this.generateField(dtaResults.SYS_BP_REC_DTA, "pv-wf-edit-cervical-position-width pv-wf-edit-control-position", "systolicText_" + compId, card.systolic, card);
	eventResultHTML += "</div><div  class='pv-wf-cervical-tb'> / </div><div  class='pv-wf-cervical-tb'>";
	eventResultHTML += this.generateField(dtaResults.DIA_BP_REC_DTA, "pv-wf-edit-cervical-position-width pv-wf-edit-control-position", "diastolicText_" + compId, card.diastolic, card) + "</div></div>";
	columnHTML += eventResultHTML;
	eventIndex++;

	if (visitObj.WEIGHT.length > 0) {
		card.weight = visitObj.WEIGHT[0].VALUE;
	}
	else {
		card.weight = missingVal;
	}

	eventResultHTML = "<div class='pv-wf-baby-label-tb'>" + this.generateField(dtaResults.WEIGHT_REC_DTA, "pv-wf-edit-urine-position-width pv-wf-edit-control-position", "weightText_" + compId, card.weight, card) + "</div>";
	columnHTML += eventResultHTML;
	eventIndex++;

	if (visitObj.URINE_PROTEIN.length > 0) {
		card.protein = visitObj.URINE_PROTEIN[0].VALUE;
	}
	else {
		card.protein = missingVal;
	}

	eventResultHTML = "<div class='pv-wf-baby-label-tb'>" + this.generateField(dtaResults.URINE_PROTEIN_REC_DTA, "pv-wf-edit-urine-position-width pv-wf-edit-control-position", "proteinText_" + compId, card.protein, card) + "</div>";
	columnHTML += eventResultHTML;
	eventIndex++;
	if (visitObj.URINE_GLUCOSE.length > 0) {
		card.glucose = visitObj.URINE_GLUCOSE[0].VALUE;
	}
	else {
		card.glucose = missingVal;
	}

	eventResultHTML = "<div class='pv-wf-baby-label-tb'>" + this.generateField(dtaResults.URINE_GLUCOSE_REC_DTA, "pv-wf-edit-urine-position-width pv-wf-edit-control-position", "glucoseText_" + compId, card.glucose, card) + "</div>";
	columnHTML += eventResultHTML;
	eventIndex++;
	if (visitObj.URINE_KETONES.length > 0) {
		card.ketones = visitObj.URINE_KETONES[0].VALUE;
	}
	else {
		card.ketones = missingVal;
	}

	eventResultHTML = "<div class='pv-wf-baby-label-tb'>" + this.generateField(dtaResults.URINE_KETONES_REC_DTA, "pv-wf-edit-urine-position-width pv-wf-edit-control-position", "ktonesText_" + compId, card.ketones, card) + "</div>";
	columnHTML += eventResultHTML;
	eventIndex++;

	if (visitObj.EDEMA.length > 0) {
		card.edema = visitObj.EDEMA[0].VALUE;
	}
	else {
		card.edema = missingVal;
	}

	eventResultHTML = "<div class='pv-wf-baby-label-tb'>" + this.generateField(dtaResults.EDEMA_REC_DTA, "pv-wf-edit-urine-position-width pv-wf-edit-control-position", "edemaText_" + compId, card.edema, card) + "</div>";
	columnHTML += eventResultHTML;
	eventIndex++;

	if (visitObj.NEXT_APPT.length > 0) {
		card.nextAppt = visitObj.NEXT_APPT[0].VALUE;
	}
	else {
		card.nextAppt = missingVal;
	}

	eventResultHTML = "<div class='pv-wf-baby-label-tb'>" + this.generateField(dtaResults.NEXT_APPT_REC_DTA, "pv-wf-edit-preterm-position-width pv-wf-edit-control-position pv-wf-nextappt-input", "apptmentText_" + compId, card.nextAppt, card) + "</div>";
	columnHTML += eventResultHTML;
	eventIndex++;

	if (visitObj.COMMENT.length > 0) {
		card.comments = visitObj.COMMENT[0].VALUE;
	}
	else {
		card.comments = missingVal;
	}
	var textClass = 'pv-wf-comments-input-tb pv-wf-card-de-text-box pv-wf-card-comment-box';
	var readAttr = "readonly";
	var commentsValue = card.comments;
	if (dtaResults.COMMENT_REC_DTA.length !== 1) {
		textClass = textClass + " pv-wf-disable-color";
		readAttr = "readonly";
	}
	else {
		var eventType = dtaResults.COMMENT_REC_DTA[0].EVENT_CODE_TYPE;
		if (eventType === "FREETEXT") {
			if (commentsValue == '--') {
				textClass = textClass + " pv-wf-unsigned-color";
				readAttr = "";
				commentsValue = "";
				this.m_activeFields[this.m_activeFields.length] = "commentsText_" + compId;
			}
			else {
				textClass = textClass + " pv-wf-signed-color pv-wf-context-menu";
				readAttr = "readonly";
			}
		}
		else {
			textClass = textClass + " pv-wf-disable-color";
			readAttr = "readonly";
		}

	}

	if (commentsValue === "") {
		eventResultHTML = "<div ><textarea  placeholder = '" + prenatalVisitsi18n.ADD_COMMENT + "' id='" + "commentsText_" + compId + "' class ='" + textClass + " '" + readAttr + ">" + commentsValue + "</textarea></div>";
	}
	else {
		eventResultHTML = "<div><textarea  tabindex='-1' placeholder = '" + prenatalVisitsi18n.ADD_COMMENT + "' id='" + "commentsText_" + compId + "' class ='" + textClass + " '" + readAttr + ">" + commentsValue + "</textarea></div>";
	}
	columnHTML += eventResultHTML;

	if (!component.m_encntrBasedDisplayChoosen) {
		eventResultHTML = "<div class='pv-wf-baby-data-tb-delete-visit-editable pv-wf-baby-label-tb-theme-white'><a class='' id='deleteVisit_" + colNum + "_" + compId + "'>" + prenatalVisitsi18n.DELETE_VISIT + "</a></div>";
		columnHTML += eventResultHTML;
	}

	resultObj[++resultIndex]["VISIT_RESULTS_" + colNum] = columnHTML;
	eventIndex++;
	indexes.eventIndex = eventIndex;
	indexes.resultIndex = resultIndex;

	return card;

};
/**
 * The method populates the charted results into rows of the table.
 *
 * @param jsonContentTable {array}
 * 		- holds the JSON for contnet (the results) to be displayed.
 *
 * @param jsonLabelTable {array}
 * 		- holds the JSON for title (label) of the rows to be displayed.
 *
 * @param recreateTable {boolean} - indicates if building a table with an editable column
 *
 * @param colNum {integer} - the column number that needs to be editable
 */
PrenatalVisitsComponentWF.prototype.createResultRows = function(jsonLabelTable, jsonContentTable, recreateTable, colNum) {
	var recordData = this.getRecordData();
	var component = this;

	if (component.m_isNewVisitRequiredInTableView) {
		if (component.m_recordDataExists) {
			recordData = this.m_recordData;
		}
		else {
			recordData = this.m_recordDataToday;
		}
	}

	var visitCnt = recordData.VISITS.length;
	var prenatalVisitsi18n = i18n.discernabu.prenatal_visits_o2;
	var compId = this.getComponentId();
	var missingValue = "--";
	var isFetalLiePresent = (this.getFetalLie().length > 0) ? true : false;
	var maxFetusCnt = 0;
	var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	var hoverHTMLTag = this.m_hoverHTMLTag;

	// Holds the event results which have dynamic labels
	var initialDynLabelObj = {};
	var newDynLabelObj = {};

	// Holds the dynamic label id - Number of babies will determined based on this
	var dynamicLabelId;

	// Index used to iterate the loop
	var i = 0;
	var j = 0;

	// Used to store event result value
	var eventResultValue = "";

	// Holds the dynamic label of an event i.e., Baby A, Baby B, etc
	var dynamicLabel = "";

	// Contains the array of results for an event - This will be shown on hover
	var eventResultsArray = [];

	// Contains the html of an event value along with its unit
	var eventResultHTML = "";
	var resultObj = [];

	// Event Position - Index used to get event results and hover
	var eventIndex = 0;
	var resultIndex = 0;

	var indexes = new this.indexBucket();

	// Number of events shown in content table
	var eventsLength = this.m_labelDetail.length;

	// Indicates the number of rows
	var RESULTS_LENGTH = 2;

	// Holds the count of an event data charted.
	// Ex: If a "Fundal Height" event is charted 10 times, count will be 10
	var eventsDataCount = 0;

	// Holds the hover data for an event.
	var hoverData = "";

	// Contains the all the results of a particular visit
	var visitObj = null;
	var babyArrayindexes = [];
	var card = null;
	var whiteTheme = "pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-white pv-wf-baby-label-tb-theme-font";
	var blueTheme = "pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font";

	for ( i = 0; i < eventsLength; i++) {
		eventResultsArray[i] = [];
	}

	var babyObjectsArray = [];

	for ( i = 0; i < RESULTS_LENGTH; i++) {
		resultObj[i] = [];
	}

	var k = 0;
	if (component.m_isNewVisitRequiredInTableView) {
		k = 1;
		babyObjectsArray = this.generateBabyLabelArray(babyArrayindexes, eventResultsArray, this.m_recordDataToday);
		card = this.buildNewVisitColumn(babyObjectsArray, babyArrayindexes, indexes, resultObj, 0);
		eventIndex = indexes.eventIndex;
		resultIndex = indexes.resultIndex;
	}
	else {
		babyObjectsArray = this.generateBabyLabelArray(babyArrayindexes, eventResultsArray, this.m_recordData);
	}
	if (component.m_recordDataExists)
		for ( i = 0; i < visitCnt; i++) {

			if (recreateTable && i == colNum && !component.m_isNewVisitRequiredInTableView) {
				card = this.buildEditableColumn(babyObjectsArray, babyArrayindexes, indexes, resultObj, i);
				eventIndex = indexes.eventIndex;
				resultIndex = indexes.resultIndex;

			}
			else {

				eventIndex = 0;
				resultIndex = -1;

				visitObj = recordData.VISITS[i];
				var columnHTML = "";

				// Add result for "Gestational Age"
				if (visitObj.EGA.length > 0) {
					visitObj.EGA.sort(this.resultDateSort);
					if (visitObj.EGA[0].VALUE) {
						eventResultHTML = eventResultHTML = "<div class = '" + whiteTheme + "'>" + visitObj.EGA[0].VALUE + "</div>";
					}
					else {
						var egaWeeks = (visitObj.EGA[0].WEEKS === "") ? "0" : visitObj.EGA[0].WEEKS;
						var egaDays = (visitObj.EGA[0].DAYS === "") ? "0" : visitObj.EGA[0].DAYS;
						eventResultHTML = "<div class = '" + whiteTheme + "'>" + egaWeeks + prenatalVisitsi18n.WEEK_ABBV + egaDays + prenatalVisitsi18n.DAY_ABBV + "</div>";
					}
				}
				else {
					eventResultHTML = "<div class = '" + whiteTheme + "'>" + missingValue + "</div>";
				}

				columnHTML += eventResultHTML;
				eventIndex++;
				// Add result for "Fundal Height"
				for ( j = 0, eventsDataCount = visitObj.FUNDAL_HEIGHT.length; j < eventsDataCount; j++) {
					eventResultsArray[eventIndex].push(visitObj.FUNDAL_HEIGHT[j]);
				}
				eventResultHTML = this.getEventResults(visitObj.FUNDAL_HEIGHT, eventIndex, blueTheme);
				columnHTML += eventResultHTML;
				eventIndex++;
				var presentationHoverData = this.m_labelDetail[eventIndex].EVENT_MAPPED ? hoverHTMLTag.replace("{0}", "" + eventIndex) : "";
				eventIndex++;
				var heartRateHoverData = this.m_labelDetail[eventIndex].EVENT_MAPPED ? hoverHTMLTag.replace("{0}", "" + eventIndex) : "";
				eventIndex++;
				var movementHoverData = this.m_labelDetail[eventIndex].EVENT_MAPPED ? hoverHTMLTag.replace("{0}", "" + eventIndex) : "";
				eventIndex++;

				var lieHoverData = this.m_labelDetail[eventIndex].EVENT_MAPPED ? hoverHTMLTag.replace("{0}", "" + eventIndex) : "";
				eventIndex++;

				var fetalResultHTML = "<div id='fetalColumn_" + i + "_" + compId + "' class='pv-wf-temp-backgrndclr'>";
				var addBabyLink = "<div class='pv-wf-baby-label-tb pv-wf-temp-backgrndclr'></div>";

				if (babyArrayindexes.length !== 0) {
					for ( k = 0; k < babyArrayindexes.length; k++) {
						if (component.m_babyLabelStatusInstanceArr[babyArrayindexes[k]].STATUS) {
							fetalResultHTML += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-header'></div>";
							fetalResultHTML += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-white pv-wf-baby-label-tb-theme-font'>" + babyObjectsArray[babyArrayindexes[k]].PRESENT_VALUE[i] + presentationHoverData + "</div>";
							fetalResultHTML += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + babyObjectsArray[babyArrayindexes[k]].FHR_VALUE[i] + heartRateHoverData + "</div>";
							fetalResultHTML += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-white pv-wf-baby-label-tb-theme-font'>" + babyObjectsArray[babyArrayindexes[k]].MOVE_VALUE[i] + movementHoverData + "</div>";

							if (isFetalLiePresent) {
								fetalResultHTML += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + babyObjectsArray[babyArrayindexes[k]].LIE_VALUE[i] + lieHoverData + "</div>";
							}
						}
						else {
							if (k !== babyArrayindexes.length - 1) {
								if (recreateTable) {
									fetalResultHTML += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-header'></div>";
									fetalResultHTML += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header'></div>";
									fetalResultHTML += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header'></div>";
									fetalResultHTML += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header'></div>";
									if (isFetalLiePresent) {
										fetalResultHTML += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header'></div>";
									}
								}
								else {
									fetalResultHTML += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header'></div>";
								}

							}
							else {
								if (recreateTable) {
									fetalResultHTML += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-header'></div>";
									fetalResultHTML += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header'></div>";
									fetalResultHTML += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header'></div>";
									fetalResultHTML += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header'></div>";
									if (isFetalLiePresent) {
										fetalResultHTML += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header'></div>";
									}
								}
								else {
									fetalResultHTML += " <div  class='pv-wf-baby-label-tb-last-inactive pv-wf-baby-label-tb-inactive-header'></div>";
								}

							}
						}

					}
				}
				else {
					var emptyFetalSection = "";
					var emptyVal = "--";
					emptyFetalSection += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-header'></div>";
					emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-white pv-wf-baby-label-tb-theme-font'>" + emptyVal + "</div>";
					emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + emptyVal + "</div>";
					emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-white pv-wf-baby-label-tb-theme-font'>" + emptyVal + "</div>";

					if (isFetalLiePresent) {
						emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + emptyVal + "</div>";
					}
					fetalResultHTML += emptyFetalSection;
				}
				fetalResultHTML += "</div>";
				if (recreateTable) {
					if (component.m_isNewVisitRequiredInTableView) {
						if (i + 1 !== colNum) {
							fetalResultHTML += "<div id = 'fetalBorderId" + i + compId + "' class='pv-wf-baby-label-tb-border '></div>";
						}
					}
					else {
						if (i !== colNum) {
							fetalResultHTML += "<div id = 'fetalBorderId" + i + compId + "' class='pv-wf-baby-label-tb-border '></div>";
						}
					}
				}
				else {
					fetalResultHTML += "<div id = 'fetalBorderId" + i + compId + "' class='pv-wf-baby-label-tb-border '></div>";

				}
				columnHTML += fetalResultHTML;

				// Add result for "Preterm Signs and Symptoms"
				for ( j = 0, eventsDataCount = visitObj.PRETERM_SIGNS.length; j < eventsDataCount; j++) {
					eventResultsArray[eventIndex].push(visitObj.PRETERM_SIGNS[j]);
				}
				eventResultHTML = this.getEventResults(visitObj.PRETERM_SIGNS, eventIndex, whiteTheme);
				columnHTML += eventResultHTML;
				eventIndex++;

				// Add result for "Cervical Dilation"
				for ( j = 0, eventsDataCount = visitObj.CERVICAL_DIL.length; j < eventsDataCount; j++) {
					eventResultsArray[eventIndex].push(visitObj.CERVICAL_DIL[j]);
				}
				var dlationValue = "--";
				if (visitObj.CERVICAL_DIL.length > 0) {
					dlationValue = visitObj.CERVICAL_DIL[0].VALUE;
				}
				var dilationHoverData = this.m_labelDetail[eventIndex].EVENT_MAPPED ? hoverHTMLTag.replace("{0}", "" + eventIndex) : "";
				eventIndex++;

				// Add result for "Cervical Effacement"
				for ( j = 0, eventsDataCount = visitObj.CERVICAL_EFF.length; j < eventsDataCount; j++) {
					eventResultsArray[eventIndex].push(visitObj.CERVICAL_EFF[j]);
				}

				var effacementValue = "--";
				if (visitObj.CERVICAL_EFF.length > 0) {
					effacementValue = visitObj.CERVICAL_EFF[0].VALUE;
				}
				var effacementHoverData = this.m_labelDetail[eventIndex].EVENT_MAPPED ? hoverHTMLTag.replace("{0}", "" + eventIndex) : "";
				eventIndex++;
				// Add result for "Cervical Station"
				for ( j = 0, eventsDataCount = visitObj.CERVICAL_STAT.length; j < eventsDataCount; j++) {
					eventResultsArray[eventIndex].push(visitObj.CERVICAL_STAT[j]);
				}

				var stationValue = "--";
				if (visitObj.CERVICAL_STAT.length > 0) {
					stationValue = visitObj.CERVICAL_STAT[0].VALUE;
				}
				var stationHoverData = this.m_labelDetail[eventIndex].EVENT_MAPPED ? hoverHTMLTag.replace("{0}", "" + eventIndex) : "";
				eventIndex++;

				eventResultHTML = "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-font" + blueTheme + "'><div class='pv-wf-display-inline'>" + dlationValue + dilationHoverData + "/</div><div class='pv-wf-display-inline'>" + effacementValue + effacementHoverData + "/</div><div class='pv-wf-display-inline'>" + stationValue + stationHoverData + "</div></div>";

				columnHTML += eventResultHTML;

				// Add result for "Blood Pressure"
				// Used to store multiple data (Systolic & Diastolic) for blood pressure event
				var systolicResultValue = "";
				var diastolicResultValue = "";

				if (visitObj.BP.length > 0) {
					visitObj.BP.sort(this.resultDateSort);
					if (visitObj.BP[0].SYS_VALUE) {
						systolicResultValue = visitObj.BP[0].SYS_VALUE;
					}

					if (visitObj.BP[0].DIA_VALUE) {
						diastolicResultValue = visitObj.BP[0].DIA_VALUE;
					}
				}
				else {
					systolicResultValue = missingValue;
					diastolicResultValue = missingValue;
				}

				for ( j = 0, eventsDataCount = visitObj.BP.length; j < eventsDataCount; j++) {
					eventResultsArray[eventIndex].push(visitObj.BP[j]);
				}
				hoverData = this.m_labelDetail[eventIndex].EVENT_MAPPED ? hoverHTMLTag.replace("{0}", "" + eventIndex) : "";
				eventResultHTML = "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-font" + whiteTheme + "'>" + systolicResultValue + "/" + diastolicResultValue + hoverData + "</div>";
				columnHTML += eventResultHTML;
				eventIndex++;

				// Add result for "Weight"
				var weightUnit = " ";
				var isUnitAvailable = this.m_labelDetail[eventIndex].UNIT_EXISTS || false;

				var weightValue = "--";
				if (visitObj.WEIGHT.length > 0) {
					weightValue = visitObj.WEIGHT[0].VALUE;
					if (isUnitAvailable) {
						weightUnit += visitObj.WEIGHT[0].UNITS;
					}
				}
				for ( j = 0, eventsDataCount = visitObj.WEIGHT.length; j < eventsDataCount; j++) {
					eventResultsArray[eventIndex].push(visitObj.WEIGHT[j]);
				}
				var weightHoverData = this.m_labelDetail[eventIndex].EVENT_MAPPED ? hoverHTMLTag.replace("{0}", "" + eventIndex) : "";
				eventIndex++;
				// Add result for weight change - "Cumulative Wieght" event
				for ( j = 0, eventsDataCount = visitObj.WEIGHT_CHG.length; j < eventsDataCount; j++) {
					eventResultsArray[eventIndex].push(visitObj.WEIGHT_CHG[j]);
				}
				var weightChngValue = "--";
				if (visitObj.WEIGHT_CHG.length > 0) {
					weightChngValue = visitObj.WEIGHT_CHG[0].VALUE;
				}
				var weightChngHoverData = this.m_labelDetail[eventIndex].EVENT_MAPPED ? hoverHTMLTag.replace("{0}", "" + eventIndex) : "";
				eventIndex++;
				eventResultHTML = "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-font" + blueTheme + "'><div class='pv-wf-display-inline'>" + weightValue + weightHoverData + "<span class='pv-wf-unit-style'>" + weightUnit + "</div></span><div class='pv-wf-display-inline pv-wf-unit-style'>(" + weightChngValue + weightChngHoverData + ")</div></div>";
				columnHTML += eventResultHTML;

				// Add result for "Urine Protein"
				for ( j = 0, eventsDataCount = visitObj.URINE_PROTEIN.length; j < eventsDataCount; j++) {
					eventResultsArray[eventIndex].push(visitObj.URINE_PROTEIN[j]);
				}
				eventResultHTML = this.getEventResults(visitObj.URINE_PROTEIN, eventIndex++, whiteTheme);
				columnHTML += eventResultHTML;
				// Add result for "Urine Glucose"
				for ( j = 0, eventsDataCount = visitObj.URINE_GLUCOSE.length; j < eventsDataCount; j++) {
					eventResultsArray[eventIndex].push(visitObj.URINE_GLUCOSE[j]);
				}
				eventResultHTML = this.getEventResults(visitObj.URINE_GLUCOSE, eventIndex++, blueTheme);
				columnHTML += eventResultHTML;

				// Add result for "Urine Ketones"
				for ( j = 0, eventsDataCount = visitObj.URINE_KETONES.length; j < eventsDataCount; j++) {
					eventResultsArray[eventIndex].push(visitObj.URINE_KETONES[j]);
				}
				eventResultHTML = this.getEventResults(visitObj.URINE_KETONES, eventIndex++, whiteTheme);
				columnHTML += eventResultHTML;

				// Add result for "Edema"
				for ( j = 0, eventsDataCount = visitObj.EDEMA.length; j < eventsDataCount; j++) {
					eventResultsArray[eventIndex].push(visitObj.EDEMA[j]);
				}
				eventResultHTML = this.getEventResults(visitObj.EDEMA, eventIndex++, blueTheme);
				columnHTML += eventResultHTML;

				// Add result for "Next Appointment"
				for ( j = 0, eventsDataCount = visitObj.NEXT_APPT.length; j < eventsDataCount; j++) {
					eventResultsArray[eventIndex].push(visitObj.NEXT_APPT[j]);
				}
				eventResultHTML = this.getEventResults(visitObj.NEXT_APPT, eventIndex++, whiteTheme);
				columnHTML += eventResultHTML;

				// Add result for provider name - Name of the physician who has charted "Next Appointment" event

				if (visitObj.PROVIDER_NAME.length > 0) {
					eventResultValue = visitObj.PROVIDER_NAME[0].VALUE || "--";
					hoverData = this.getTableHoverHTML(visitObj.PROVIDER_NAME[0].VALUE, eventIndex + 1);
				}
				else {
					eventResultValue = "--";
					hoverData = "";
				}
				eventResultHTML = "<div class='pv-wf-baby-label-tb pv-wf-display-ellipsis pv-wf-baby-label-tb-theme-font" + blueTheme + "'>" + eventResultValue + hoverData + "</div>";
				if (!recreateTable) {
					columnHTML += eventResultHTML;
				}
				// Add result for "Comments" - Antepartum Note event
				if (visitObj.COMMENT.length > 0) {
					visitObj.COMMENT.sort(this.resultDateSort);
					hoverData = this.getTableHoverHTML(visitObj.COMMENT[0].VALUE, eventIndex++);
					eventResultValue = visitObj.COMMENT[0].VALUE;
				}
				else {
					hoverData = this.getTableHoverHTML("", eventIndex++);
					eventResultValue = missingValue;
				}
				if (recreateTable) {
					eventResultHTML = "<div class='pv-wf-baby-label-tb pv-wf-display-ellipsis pv-wf-baby-label-tb-theme-font" + blueTheme + "'>" + eventResultValue + hoverData + "</div>";
					eventResultHTML += "<div class='pv-wf-baby-label-tb-comment'></div>";
				}
				else {
					eventResultHTML = "<div class='pv-wf-baby-label-tb pv-wf-display-ellipsis pv-wf-baby-label-tb-theme-font" + whiteTheme + "'>" + eventResultValue + hoverData + "</div>";
				}
				columnHTML += eventResultHTML;
				if (!component.m_encntrBasedDisplayChoosen && recreateTable && !component.m_isNewVisitRequiredInTableView) {
					columnHTML += "<div class='pv-wf-baby-data-tb-delete-visit pv-wf-baby-label-tb-theme-white'><a class='pv-wf-delete-visit-props'></a></div>";
				}
				if (component.m_isNewVisitRequiredInTableView) {
					resultObj[++resultIndex]["VISIT_RESULTS_" + i + 1] = columnHTML;
				}
				else {
					resultObj[++resultIndex]["VISIT_RESULTS_" + i] = columnHTML;
				}

			}
		}

	var label = "";
	// Add JSON results for content table
	for ( resultIndex = 0; resultIndex < RESULTS_LENGTH - 1; resultIndex++) {
		jsonContentTable.push(resultObj[resultIndex]);
	}

	// Create hover data for the events which are mapped in bedrock
	for ( eventIndex = 0; eventIndex < eventsLength; eventIndex++) {
		if (this.m_labelDetail[eventIndex].EVENT_MAPPED) {
			label = this.m_labelDetail[eventIndex].LABEL;

			if (label === prenatalVisitsi18n.BP) {
				this.createTableBloodPressureHoverHTML(eventResultsArray[eventIndex], eventIndex);
			}
			else if (label === prenatalVisitsi18n.FPRESENT || label === prenatalVisitsi18n.FMOVE || label === prenatalVisitsi18n.FHR || label === prenatalVisitsi18n.FLIE) {
				this.createTableDynamicLabelHoverHTML(eventResultsArray[eventIndex], eventIndex);
			}
			else {
				this.createTableHoverHTML(eventResultsArray[eventIndex], eventIndex);
			}
		}
	}

	var htmlBreak = "";
	var cervicalIndicator = false;
	var weightIndicator = false;

	// Number breaks to make label table align with content table for dynamic labels
	for ( j = 0; j < maxFetusCnt; j++) {
		htmlBreak += "<br />";
	}

	// Add JSON results for label table
	label = "<div class='pv-wf-baby-label-tb-labels-ega  pv-wf-baby-label-tb-theme-label-gray pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.GESTATIONAL_AGE + " </div>";

	label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-blue pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.FUNDAL_HEIGHT + " </div>";

	label += "<div id='fetalRowLabel_" + compId + "'>";
	if (babyArrayindexes.length !== 0) {
		for ( i = 0; i < babyArrayindexes.length; i++) {
			if (component.m_babyLabelStatusInstanceArr[babyArrayindexes[i]].STATUS) {
				label += "<div ><div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-header'>" + babyObjectsArray[babyArrayindexes[i]].LABEL + "</div>";
				label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-gray pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.FPRESENT + "</div>";
				label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-blue pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.FHR + "</div>";
				label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-gray pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.FMOVE + "</div>";

				if (isFetalLiePresent) {
					label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-blue pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.FLIE + "</div>";
				}

				label += "</div>";
			}
			else {
				if (i == babyArrayindexes.length - 1) {
					if (recreateTable) {
						label += "<div ><div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-header'>" + babyObjectsArray[babyArrayindexes[i]].LABEL + "</div>";
						label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-gray pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.FPRESENT + "</div>";
						label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-blue pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.FHR + "</div>";
						label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-gray pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.FMOVE + "</div>";

						if (isFetalLiePresent) {
							label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-blue pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.FLIE + "</div>";
						}

						label += "</div>";
					}
					else {
						label += "<div class='pv-wf-baby-label-tb-last-inactive-labels pv-wf-baby-label-tb-inactive-header'>" + babyObjectsArray[babyArrayindexes[i]].LABEL + "- " + prenatalVisitsi18n.INACTIVE_BABY + "</div>";
					}
				}
				else {
					if (recreateTable) {
						label += "<div ><div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-header'>" + babyObjectsArray[babyArrayindexes[i]].LABEL + "</div>";
						label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-gray pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.FPRESENT + "</div>";
						label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-blue pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.FHR + "</div>";
						label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-gray pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.FMOVE + "</div>";

						if (isFetalLiePresent) {
							label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-blue pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.FLIE + "</div>";
						}

						label += "</div>";
					}
					else {
						label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-inactive-header'>" + babyObjectsArray[babyArrayindexes[i]].LABEL + "-" + prenatalVisitsi18n.INACTIVE_BABY + "</div>";
					}
				}
			}
		}
	}
	else {
		label += "<div id='zeroFetusLabels_" + compId + "'><div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-header'></div>";
		label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-gray pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.FPRESENT + "</div>";
		label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-blue pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.FHR + "</div>";
		label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-gray pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.FMOVE + "</div>";

		if (isFetalLiePresent) {
			label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-blue pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.FLIE + "</div>";
		}
		label += "</div>";
	}
	label += "</div >";
	label += "<div class='pv-wf-baby-label-tb-border-labels'></div>";

	label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-gray pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.PRETERMSIGNS + "</div>";

	label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-blue pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.CERVICALEXAM + "</div>";

	label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-gray pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.BP + "</div>";

	label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-blue pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.WEIGHT + "</div>";

	label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-gray pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.URINE_PROTEIN + "</div>";

	label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-blue pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.URINE_GLUCOSE + "</div>";

	label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-gray pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.URINE_KETONES + "</div>";

	label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-blue pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.EDEMA + "</div>";

	label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-gray pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.NEXT_APPOINTMENT + "</div>";

	if (!recreateTable) {
		label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-blue pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.PROVIDER_NAME + "</div>";

	}
	if (recreateTable) {
		label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-blue pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.COMMENTS + "</div>";
		label += "<div class='pv-wf-baby-label-tb-comment'></div>";
	}
	else {
		label += "<div class='pv-wf-baby-label-tb-labels  pv-wf-baby-label-tb-theme-label-gray pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.COMMENTS + "</div>";

	}

	if (!component.m_encntrBasedDisplayChoosen && recreateTable && !component.m_isNewVisitRequiredInTableView) {
		label += "<div class='pv-wf-baby-label-tb-delete-visit pv-wf-baby-label-tb-theme-white'></div>";
	}
	jsonLabelTable.push({
		LABEL_NAME : label
	});

	return card;
};

/**
 * Attaches the liseners to the fields created for each event.
 *
 * @param card {Object} - Visit card instance for which the editable fields are created.
 *
 */
PrenatalVisitsComponentWF.prototype.callListeners = function(card) {
	var component = this;
	var compId = this.getComponentId();
	component.attachListener(card);
	var numberOfDropDowns = card.numberOfDropDowns;
	var k = 0;

	for ( k = 0; k < numberOfDropDowns; k++) {
		this.dropDownListeners(card.dropDowns[k] + "dropDown", "", card.dropDowns[k]);
	}

	var numberOfSingleDropDowns = card.numberOfSingleDropDowns;
	for ( k = 0; k < numberOfSingleDropDowns; k++) {
		this.singleDropDownListeners(card.singleDropDowns[k] + "dropDown", "", card.singleDropDowns[k]);
	}

	component.attachTextBoxListener(card);
	component.limitCommentLength(card);
};

/**
 * Creates label and content tables in table view upon selecting the table display in component header
 *
 * @param recreateTable {boolean} - indicates if building a table with an editable column
 *
 * @param colNum {integer} - the column number that needs to be editable
 */
PrenatalVisitsComponentWF.prototype.createTableLayout = function(recreateTable, colNum) {
	var recordData = this.getRecordData();
	var component = this;
	component.clearChartingData();

	if (component.m_isNewVisitRequiredInTableView) {
		recordData = this.m_recordDataToday;
	}
	var prenatalVisitsi18n = i18n.discernabu.prenatal_visits_o2;
	var compId = this.getComponentId();
	var rootId = this.getStyles().getId();
	var visitDate = new Date();
	var messageHTML = "";
	var hoverLength = 0;

	// Number of visits of a patient - Encounter length
	var visitCnt = recordData.VISITS.length;
	this.m_visitCount = visitCnt;

	// Used to create Label and content table in table view
	var labelTable = null;
	var contentTable = null;

	// Used to create columns for Label and content table
	var labelColumn = null;
	var ContentColumn = null;

	// Contains a html array of results for label and content table
	var jsonLabelTable = [];
	var jsonContentTable = [];

	// Contains the jquery object of label and content table
	var labelTableContainer = null;
	var contentTableContainer = null;

	var visitDateFormatted = "";

	//Create the label table. This table will have just the labels for each of the result row and will not scroll horizontally
	labelTable = new ComponentTable().setNamespace(rootId + "Labels").setCustomClass("pv-wf-table");

	labelColumn = new TableColumn().setColumnId("labelCol").setColumnDisplay("<br />" + prenatalVisitsi18n.DATE_OF_VISIT);
	labelColumn.setCustomClass('pv-wf-label-column').setRenderTemplate("${LABEL_NAME}");

	labelTable.addColumn(labelColumn);
	this.initializeLabelDetails();
	var card = this.createResultRows(jsonLabelTable, jsonContentTable, recreateTable, colNum);
	//Create the content table. This table will have results for each label shown label table and will have scroll bar horizontally and
	// vertically
	contentTable = new ComponentTable().setNamespace(rootId + "Content").setCustomClass("pv-wf-table");
	if (component.m_isNewVisitRequiredInTableView) {
		i = 0;
		var today = new Date();
		var dateString = today.format("dd/m/yy");
		dateString = dateFormat(today, dateFormat.masks.mediumDate);
		ContentColumn = new TableColumn().setColumnId("resultColumn_" + i + "_" + compId).setColumnDisplay("<div id='signTable_" + compId + "' class='pv-wf-edit-panel-sign-tb pv-wf-edit-panel-sign-tb-disabled'></div><div class='pv-wf-tb-header'><div class='pv-wf-tb-edit-header-text'>" + dateString + "</div></div><div id='closeTable_" + compId + "' class='pv-wf-edit-panel-close-tb'></div>");
		ContentColumn.setCustomClass('pv-wf-content-editable-column').setRenderTemplate("${VISIT_RESULTS_" + i + "}");
		contentTable.addColumn(ContentColumn);
		if (component.m_recordDataExists) {
			recordData = component.getRecordData();
			visitCnt = recordData.VISITS.length;
			for ( i = 0; i < visitCnt; i++) {
				visitDate.setISO8601(recordData.VISITS[i].VISIT_DATE);
				visitDateFormatted = dateFormat(visitDate, dateFormat.masks.mediumDate);
				ContentColumn = new TableColumn().setColumnId("resultColumn_" + i + 1 + "_" + compId).setColumnDisplay("<br />" + visitDateFormatted + "<a id = 'tableChart_" + i + 1 + "_" + compId + "' class='pv-wf-table-header'>&nbsp;&nbsp" + prenatalVisitsi18n.CHART + "</a>");
				ContentColumn.setCustomClass('pv-wf-content-column').setRenderTemplate("${VISIT_RESULTS_" + i + 1 + "}");

				contentTable.addColumn(ContentColumn);
			}
		}
	}
	else {
		//Dynamically create a TableColumn based on number of visits of a patient
		var columnProperties = "";
		if (component.m_encntrBasedDisplayChoosen) {
			columnProperties = "pv-wf-content-column";
		}
		else {
			columnProperties = "pv-wf-context-menu-delete-card pv-wf-content-column";
		}

		for ( i = 0; i < visitCnt; i++) {
			visitDate.setISO8601(recordData.VISITS[i].VISIT_DATE);
			visitDateFormatted = dateFormat(visitDate, dateFormat.masks.mediumDate);
			if (recreateTable && i == colNum) {
				ContentColumn = new TableColumn().setColumnId("resultColumn_" + i + "_" + compId).setColumnDisplay("<div id='signTable_" + compId + "' class='pv-wf-edit-panel-sign-tb pv-wf-edit-panel-sign-tb-disabled'></div><div class='pv-wf-tb-header'><div class='pv-wf-tb-edit-header-text'>" + visitDateFormatted + "</div></div><div id='closeTable_" + compId + "' class='pv-wf-edit-panel-close-tb'></div>");
				ContentColumn.setCustomClass('pv-wf-content-editable-column').setRenderTemplate("${VISIT_RESULTS_" + i + "}");
			}
			else {
				ContentColumn = new TableColumn().setColumnId("resultColumn_" + i + "_" + compId).setColumnDisplay("<br />" + visitDateFormatted + "<a id = 'tableChart_" + i + "_" + compId + "' class='pv-wf-table-header'>&nbsp;&nbsp" + prenatalVisitsi18n.CHART + "</a>");
				ContentColumn.setCustomClass(columnProperties).setRenderTemplate("${VISIT_RESULTS_" + i + "}");
			}
			contentTable.addColumn(ContentColumn);
		}
	}

	labelTable.bindData(jsonLabelTable);
	contentTable.bindData(jsonContentTable);
	this.setComponentTable(contentTable);

	var tableContainerId = "tableContainer" + compId;
	var labelContainerId = "labelTableContainer" + compId;
	var contentContainerId = "contentTableContainer" + compId;
	var scrollControllerId = "scrollController" + compId;

	messageHTML = "<div id='" + tableContainerId + "' class='pv-wf-table-container'><div id='" + labelContainerId + "' class='pv-wf-label-table'>";
	messageHTML += labelTable.render() + "</div><div id='" + contentContainerId + "' class='pv-wf-content-table'>" + contentTable.render() + "</div>";
	messageHTML += "<div id='" + scrollControllerId + "' class='pv-wf-scroll-controller-hidden'><span class='pv-wf-scroller-content'>&nbsp;</span></div></div>";

	this.finalizeComponent(messageHTML, "");

	//Finalize the ComponentTables so it will apply all of our delegates
	labelTable.finalize();
	contentTable.finalize();

	//Initialize the table (both label and content) width and height values
	this.initializeTableElements();

	//Resize the columns based on the number of time buckets
	contentTableContainer = $("#" + contentContainerId);
	//Set the width of the content table container so it will horizontal scroll
	contentTableContainer.width(this.m_contentTableVisibleWidth);
	//Set the width of the content table so it will not wrap
	contentTableContainer.find("#" + rootId + "Contenttable").width(this.m_contentTableWidth);

	//Save references to the table container element so we dont have to get them again
	this.m_tableContainer = $("#" + tableContainerId);
	this.m_labelTableContainer = $("#" + labelContainerId);
	this.m_labelTableBody = this.m_labelTableContainer.find(".content-body");
	this.m_contentTableContainer = contentTableContainer;
	this.m_contentTableBody = this.m_contentTableContainer.find(".content-body");
	this.m_scrollController = $("#" + scrollControllerId);

	//Add the scroll listeners on the tables
	this.m_tableContainer.on("mousewheel", function(event) {
		return component.scrollTables(event);
	});
	//Attach scroll events to the scroller that will scroll the two tables
	this.m_scrollController.scroll(function(event) {
		component.scrollTables(event);
	});

	// Add hover data to events where its history deatils will be shown on hover
	hoverLength = this.m_hoverHTML.length;
	for ( i = 0; i < hoverLength; i++) {
		$("#" + tableContainerId + " .pv-wf-event-hvr-data" + i).html(this.m_hoverHTML[i]);
	}

	// Setup the hovers on all divs with the 'hvr' class under the table container div
	var hoverStyle = Util.Style.g('hvr', _g(tableContainerId), 'div');
	for ( i = 0; i < hoverStyle.length; i++) {
		hs(Util.gp(hoverStyle[i]), hoverStyle[i], this);
	}

	if (recreateTable) {
		this.callListeners(card);
		return card;
	}
};

/**
 * Initializes the table (both label and content) width and height values.
 */
PrenatalVisitsComponentWF.prototype.initializeTableElements = function() {
	var compId = this.getComponentId();
	var tableContainerId = "tableContainer" + compId;

	//Define some of the constants used throughout the component
	this.m_pixelBuffer = 2;
	this.m_contentTableHeaderHeight = $("#" + tableContainerId + " .pv-wf-content-column").outerHeight();
	this.m_labelTableWidth = $("#" + tableContainerId + " .pv-wf-label-table").outerWidth();
	if (this.m_isNewVisitRequiredInTableView) {
		this.m_contentTableColumnWidth = $("#" + tableContainerId + " .pv-wf-content-editable-column").outerWidth();
	}
	else {
		this.m_contentTableColumnWidth = $("#" + tableContainerId + " .pv-wf-content-column").outerWidth();
	}
	this.m_contentTableBodyHeight = 0;

	//These variables hold height or width calculations for various dom elements so they only need to be calculated upon load and resize
	//Determine the visible width of the content table i.e., space available to view content table alone
	this.m_contentTableVisibleWidth = $(this.getSectionContentNode()).width() - this.m_labelTableWidth - this.m_pixelBuffer;

	//Determine the actual width of the content table i.e., space occupied by the content table
	this.m_contentTableWidth = this.m_visitCount * this.m_contentTableColumnWidth + this.m_pixelBuffer;
};

/**
 * This function returns the height of the content table body. If the height has already been calculated, the
 * existing calculation will be returned.
 *
 * @return {number} The height (in pixels) of the content table body
 */
PrenatalVisitsComponentWF.prototype.claculateContentTableBodyHeight = function() {
	if (this.m_contentTableBodyHeight === 0) {
		this.m_contentTableBodyHeight = this.m_contentTableBody.height();
	}
	return this.m_contentTableBodyHeight;
};

/**
 * This function is used to scroll two containers (label and content conatiner) in unison
 */
PrenatalVisitsComponentWF.prototype.scrollTables = function(event) {
	//Check to see if the scroller is visible and that the tables have been created
	var scrollerTop = 0;
	if (this.m_scrollController.hasClass("pv-wf-scroll-controller-visible")) {
		scrollerTop = this.m_scrollController.scrollTop();
		if (event.type === "mousewheel") {
			var delta = event.originalEvent.wheelDeltaY || event.originalEvent.wheelDelta;
			scrollerTop -= delta;
			this.m_scrollController.scrollTop(scrollerTop);
		}
		//Apply the correct scrolling to the table bodies
		this.m_labelTableBody.scrollTop(scrollerTop);
		this.m_contentTableBody.scrollTop(scrollerTop);

		return (scrollerTop <= 0 || (scrollerTop + this.m_contentTableHeaderHeight >= this.m_contentTableBodyHeight));
	}
};

/**
 * This function resizes of the table height to a maximum table height (Maximun visible height)
 * available under Prenatal Visits component.
 */
PrenatalVisitsComponentWF.prototype.resizeComponent = function() {
	var recordData = this.getRecordData();
	if (recordData.length === 0) {
		return;
	}
	else if (!this.getShowAmbulatoryView()) {
		MPageComponent.prototype.resizeComponent.call(this, null);
		return;
	}
	else {
		var compDOMObj = null;
		var rootId = this.getStyles().getId();
		var componentHeight = 0;
		var contentTable = $("#" + rootId + "Contenttable");
		var contentTableContainerHeight = 0;
		var contentTableWidth = 0;
		var headerHeight = this.m_contentTableHeaderHeight;
		var labelTableContainerWidth = this.m_labelTableWidth;
		var maxHeight = 0;
		var miscHeight = 10;
		var horizontalScrollBarHeight = 20;
		var verticalScrollBarWidth = 18;
		var secContentWidth = 0;
		var contentTableBodyHeight = this.claculateContentTableBodyHeight();
		var pixelBuffer = this.m_pixelBuffer;
		var viewContainer = null;
		var viewContainerHeight = 0;

		//Return if this components isn't being displayed
		if (!this.isDisplayable()) {
			return;
		}

		//Grab the container for this MPages Workflow View
		viewContainer = $("#vwpBody");
		if (!viewContainer.length) {
			return;
		}

		//Make sure component is rendered
		compDOMObj = $("#" + rootId);
		if (!compDOMObj.length) {
			return;
		}

		//Get the current width of the section content
		secContentWidth = $(this.getSectionContentNode()).width();

		//Determine the maxHeight for our component
		componentHeight = compDOMObj.height();
		contentTableContainerHeight = this.m_contentTableContainer.height();
		viewContainerHeight = viewContainer.height();

		//Determine the maxHeight for the table Container
		maxHeight = viewContainerHeight - (componentHeight - contentTableContainerHeight + miscHeight);

		//Determine the width that can be occupied by content table i.e., Max(Content Table Width, Content Table Visible Width)
		this.m_contentTableVisibleWidth = secContentWidth - labelTableContainerWidth - pixelBuffer;
		var contentTableMaxWidth = this.m_contentTableWidth <= this.m_contentTableVisibleWidth ? this.m_contentTableVisibleWidth : this.m_contentTableWidth;

		//Set the width for table container which holds two table (Label Table + Content Table)
		this.m_tableContainer.width(labelTableContainerWidth + contentTableMaxWidth + pixelBuffer);

		//Determine the component width with and without scrollbar
		var componentWidthWithScrollBar = secContentWidth - labelTableContainerWidth - verticalScrollBarWidth + "px";
		var componentWidthWithoutScrollBar = secContentWidth - labelTableContainerWidth + "px";

		//Apply the scroller if necessary
		if ((contentTableBodyHeight + headerHeight + horizontalScrollBarHeight) > maxHeight) {
			//Determine the maximum height of individual elements in component
			var tableBodyMaxHeight = maxHeight - headerHeight - horizontalScrollBarHeight + "px";
			var labelTableContainerMaxHeight = maxHeight - horizontalScrollBarHeight + "px";

			//Show the scrollController
			this.m_scrollController.css("max-height", tableBodyMaxHeight).addClass("pv-wf-scroll-controller-visible");
			this.m_scrollController.find(".pv-wf-scroller-content").height(contentTableBodyHeight + horizontalScrollBarHeight);
			this.m_contentTableContainer.width(componentWidthWithScrollBar);

			//Adjust the max-height of the table containers
			this.m_labelTableContainer.css("max-height", maxHeight);
			this.m_contentTableContainer.css("max-height", maxHeight + "px");

			//Grab the table bodies and resize so we can scroll
			this.m_labelTableBody.css("max-height", tableBodyMaxHeight);
			this.m_contentTableBody.css("max-height", tableBodyMaxHeight);

			//IE8 fix to adjust for scroll bar calculation
			contentTableContainerHeight = this.m_contentTableContainer.height();
			if ((contentTableContainerHeight - contentTable.height()) > 20) {
				this.m_contentTableContainer.css("max-height", labelTableContainerMaxHeight);
			}
			else {
				this.m_contentTableContainer.css("max-height", maxHeight + "px");
			}
		}
		else {
			//Remove the scroller if shown
			if (this.m_scrollController.hasClass("pv-wf-scroll-controller-visible")) {
				this.m_scrollController.removeClass("pv-wf-scroll-controller-visible").addClass("pv-wf-scroll-controller-hidden");
				//Adjust the size of the content table
				this.m_contentTableContainer.width(componentWidthWithoutScrollBar);
			}

			//Adjust the max-height of the table containers
			this.m_labelTableContainer.css("max-height", "");
			this.m_contentTableContainer.css("max-height", "");

			//Grab the table bodies and resize so we can scroll
			this.m_labelTableBody.css("max-height", "");
			this.m_contentTableBody.css("max-height", "");
		}

		//Adjust the width of the component before grabbing heights since the old width may have caused the tables to wrap
		if (this.m_scrollController.hasClass("pv-wf-scroll-controller-visible")) {
			this.m_contentTableContainer.width(componentWidthWithScrollBar);
		}
		else {
			this.m_contentTableContainer.width(componentWidthWithoutScrollBar);
		}
	}
};

/**
 * Renders the Prenatal Visits component visuals. This method will be called
 * after Prenatal Visits has been initialized and setup.
 *
 * @param recordData {array} - has the information about the Prenatal Visits of a patient.
 */
PrenatalVisitsComponentWF.prototype.renderComponent = function(recordData) {
	try {
		this.getDTAs();
		var component = this;

		var prenatalVisitsi18n = i18n.discernabu.prenatal_visits_o2;
		if (!component.m_recordDataExists && !component.m_isNewVisitRequiredInTableView) {
			var noResultsFound = "<span class = 'pv-wf-no-result'>" + prenatalVisitsi18n.NO_RESULTS_FOUND + "</span>";
			component.finalizeComponent(noResultsFound, "");
			return;
		}

		var criterion = this.getCriterion();
		this.setRecordData(recordData);
		var slaTimer = null;
		var rootId = this.getStyles().getId();
		var compId = this.getComponentId();
		this.m_activeFields = [];

		var i = 0;
		var babyLabelId;
		if (this.getShowAmbulatoryView()) {
			slaTimer = MP_Util.CreateTimer("CAP:MPG.PRENATALVISITS.O2-FLOWSHEETVIEW - rendering component");

			if (slaTimer) {
				slaTimer.SubtimerName = criterion.category_mean;
				slaTimer.Stop();
			}

			for ( i = 0; i < recordData.BABY_LABEL.length; i++) {
				babyLabelId = String(recordData.BABY_LABEL[i].DYNAMIC_LABEL_ID);
				component.m_babyLabelStatusInstanceArr[babyLabelId] = new this.babyLabelStatusInstance();
				component.m_babyLabelStatusInstanceArr[babyLabelId].BABY_LABEL_ID = recordData.BABY_LABEL[i].DYNAMIC_LABEL_ID;
				component.m_babyLabelStatusInstanceArr[babyLabelId].STATUS = recordData.BABY_LABEL[i].IS_DYNAMIC_LABEL_ACTIVE;
			}
			var card;

			if (this.m_isNewVisitRequiredInTableView) {
				card = this.createTableLayout(true, 0);
				card.encntrId = criterion.encntr_id;
				$('#signTable_' + compId).click(function() {
					// Chart the results for a particular Card/Encounter.
					// Allow user to click "Sign" button image only once per charting.
					if (!component.m_signResults && !component.isSignButtonClicked) {
						component.isSignButtonClicked = true;
						component.m_signResults = true;
						component.chartResults(card);
					}
				});

				$('#closeTable_' + compId).click(function() {
					this.m_isNewVisitRequiredInTableView = false;
					component.retrieveComponentData();
				});
			}
			else {
				card = this.createTableLayout(false, 0);
			}

			var visitCount = recordData.VISITS.length;
			for ( i = 0; i < visitCount; i++) {
				$("#tableChart_" + i + "_" + compId).click(function() {
					var colNum = this.id.split("_")[1];
					$("#tableContainer" + compId).html("");
					card = component.createTableLayout(true, colNum);

					var contentContainerId = "contentTableContainer" + compId;
					contentTableContainer = $("#" + contentContainerId);
					contentTableContainer.width(component.m_contentTableVisibleWidth);
					if (recordData.VISITS.length == 1) {
						contentTableContainer.find("#" + rootId + "Contenttable").width(component.m_contentTableWidth + 198);
					}
					else {
						contentTableContainer.find("#" + rootId + "Contenttable").width(component.m_contentTableWidth + 70);
					}

					$('#signTable_' + compId).click(function() {
						// Chart the results for a particular Card/Encounter.
						// Allow user to click "Sign" button image only once per charting.
						if (!component.m_signResults && !component.isSignButtonClicked) {
							component.isSignButtonClicked = true;
							component.m_signResults = true;
							component.chartResults(card);
						}
					});

					$('#closeTable_' + compId).click(function() {

						if (component.m_dynamicLabelInactivated) {
							component.retrieveComponentData();
						}
						else {
							component.renderComponent(component.getRecordData());
						}
					});

					component.postProcessAddingTextBoxes(card, true, true);
					$("#" + card.firstTextBoxEnabled).focus();

					component.addFetusListener(card, 1);
					component.attachReactivateFetusListener(card, 1);
					component.disableSign();
					$('#deleteVisit_' + colNum + '_' + compId).click(function() {
						component.generateDeleteConfirmModalDialog(colNum);
					});

				});
			}
			component.attachDeleteListener();

			return card;
		}
		else {
			slaTimer = MP_Util.CreateTimer("CAP:MPG.PRENATALVISITS.O2-AMBULATORYVIEW - rendering component");

			if (slaTimer) {
				slaTimer.SubtimerName = criterion.category_mean;
				slaTimer.Stop();
			}

			//Html arrays which will be used to build Prenatal Visits Component HTML.
			var buildHTML = [];
			var navBarHTMLArray = [];
			var visitHTMLArray = [];
			var hoverHTMLArray = [];
			//Array which stores all the previous charted results which will be displayed while hovering over the Fundal Height event.
			var fundalHeightArray = [];
			//Array which stores all the previous charted results which will be displayed while hovering over the Preterm Signs event.
			var preTermSignsArray = [];
			//Array which stores all the previous charted results which will be displayed while hovering over the Cervical Dilation event.
			var cervicalDilArray = [];
			//Array which stores all the previous charted results which will be displayed while hovering over the Cervical Effacement event.
			var cervicalEffArray = [];
			//Array which stores all the previous charted results which will be displayed while hovering over the Cervical Station event.
			var cervicalStatArray = [];
			//Array which stores all the previous charted results which will be displayed while hovering over the Blood Pressure event.
			var bloodPressureArray = [];
			//Array which stores all the previous charted results which will be displayed while hovering over the Weight event.
			var weightArray = [];
			//Array which stores all the previous charted results which will be displayed while hovering over the Weight Difference event.
			var weightDiffArray = [];
			//Array which stores all the previous charted results which will be displayed while hovering over the Edema event.
			var edemaArray = [];
			//Array which stores all the previous charted results which will be displayed while hovering over the Protein event.
			var urineProteinArray = [];
			//Array which stores all the previous charted results which will be displayed while hovering over the Glucose event.
			var urineGlucoseArray = [];
			//Array which stores all the previous charted results which will be displayed while hovering over the Ketones event.
			var urineKetonesArray = [];
			//Array which stores all the previous charted results which will be displayed while hovering over the Pain event.
			var painArray = [];
			//Array which stores all the previous charted results which will be displayed while hovering over the Next Appointment event.
			var nextApptArray = [];
			//Array which stores all the previous charted results which will be displayed while hovering over the Fetal Present event.
			var fetalPresentArray = [];
			//Array which stores all the previous charted results which will be displayed while hovering over the Fetal Movement event.
			var fetalMovementArray = [];
			//Array which stores all the previous charted results which will be displayed while hovering over the Fetal Heart Rate event.
			var fetalHeartRateArray = [];
			//Array which stores all the previous charted results which will be displayed while hovering over the Fetal Lie event.
			var fetalLieArray = [];
			var visitCnt = recordData.VISITS.length;
			var previousYear = 0;
			var monthArray = [prenatalVisitsi18n.JANUARY_ABBV, prenatalVisitsi18n.FEBRUARY_ABBV, prenatalVisitsi18n.MARCH_ABBV, prenatalVisitsi18n.APRIL_ABBV, prenatalVisitsi18n.MAY_ABBV, prenatalVisitsi18n.JUNE_ABBV, prenatalVisitsi18n.JULY_ABBV, prenatalVisitsi18n.AUGUST_ABBV, prenatalVisitsi18n.SEPTEMBER_ABBV, prenatalVisitsi18n.OCTOBER_ABBV, prenatalVisitsi18n.NOVEMBER_ABBV, prenatalVisitsi18n.DECEMBER_ABBV];
			var navBarID = "pregNav" + compId;
			var navItemListID = "prevNavItems" + compId;
			var visitCardID = "pregCards" + compId;
			var missingVal = "--";
			var isFetalLiePresent = (this.getFetalLie().length > 0) ? true : false;
			var fetalClass = (isFetalLiePresent) ? "pv-wf-complete-fetal-data" : "pv-wf-partial-fetal-data";
			//Variable which is used to apply CSS class depending on the Fetal Lie Presence.
			var fetalLieClassLabel = (isFetalLiePresent) ? "pv-wf-preg-data-labels-complete-fetal-data" : "pv-wf-preg-data-labels-partial-fetal-data";
			var maxFetusCnt = 0;
			var maxFetusIdx = -1;
			var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
			//index for all loops in the renderComponent scope
			var rootNode = component.getRootComponentNode();
			var j = 0;
			//variable which holds the length of the events mapped.
			var eventsDataLength = 0;
			//Variable which holds the event result value.
			var eventResValue = "";
			var initialDynLabelObj = {};
			var newDynLabelObj = {};
			var dynamicLabelId;
			var eventResValue2 = "";
			//Variable which holds the comments hover data.
			var commentHoverdata = "";
			var visitDate = new Date();
			var fetalDataCssClass = "pv-wf-preg-data-labels-partial-fetal-data";
			var fetalDataLie = "";
			var fetalheartClassLabel = (isFetalLiePresent) ? "pv-wf-preg-data-labels-complete-fetal-data" : "pv-wf-fetalheartrate-hover";

			for ( i = 0; i < recordData.BABY_LABEL.length; i++) {
				babyLabelId = String(recordData.BABY_LABEL[i].DYNAMIC_LABEL_ID);
				component.m_babyLabelStatusInstanceArr[babyLabelId] = new this.babyLabelStatusInstance();
				component.m_babyLabelStatusInstanceArr[babyLabelId].BABY_LABEL_ID = recordData.BABY_LABEL[i].DYNAMIC_LABEL_ID;
				component.m_babyLabelStatusInstanceArr[babyLabelId].STATUS = recordData.BABY_LABEL[i].IS_DYNAMIC_LABEL_ACTIVE;
			}
			//build navigation bar
			navBarHTMLArray.push("<div id='", navBarID, "' class='pv-wf-preg-nav-bar'><div class=' pv-wf-preg-navigationbar pv-wf-preg-nav-left'></div><ol id='", navItemListID, "'>");
			var today = new Date();
			navBarHTMLArray.push("<li id = 'navBarNewVisit" + compId + "'>", monthArray[today.getMonth()], " ", today.getDate(), "</li>");
			for ( i = 0; i < visitCnt; i++) {
				visitDate.setISO8601(recordData.VISITS[i].VISIT_DATE);
				var curYear = visitDate.getFullYear();
				if (previousYear > 0 && previousYear != curYear) {
					navBarHTMLArray.push("<div class='pv-wf-preg-nav-year pv-wf-preg-nav-prev-year'>", previousYear, "</div><div class='pv-wf-preg-nav-year pv-wf-preg-nav-next-year'>", curYear, "</div>");
				}
				previousYear = curYear;
				navBarHTMLArray.push("<li id = 'navVisit_" + i + "_" + compId + "'>", monthArray[visitDate.getMonth()], " ", visitDate.getDate(), "</li>");
			}
			navBarHTMLArray.push("</ol><div class='pv-wf-preg-navigationbar pv-wf-preg-nav-right'></div></div>");
			var visitCardsObj = [];
			visitCardsObj.length = visitCnt;
			//build visit cards
			visitHTMLArray.push("<div class='content-body'><div class='pv-wf-prenatal-visits-content'>");

			visitHTMLArray.push("<div id='", visitCardID, "' class='pv-wf-preg-visit-cards'><div class='pv-wf-preg-visit-card-new-visit pv-wf-display-inline' id = 'visitCard_newCard_" + compId + "'></div>");

			for ( i = 0; i < visitCnt; i++) {
				visitCardsObj[i] = new this.visitCardInstance();

				visitCardsObj[i].encntrId = recordData.VISITS[i].ENCNTR_ID;
				visitCardsObj[i].visitDateDisplay = recordData.VISITS[i].VISIT_DATE;

				// variable which holds the unit of event result.
				var eventResUnit = "";
				// for all loops in the "i = visitCnt - 1" scope
				eventResValue2 = "";
				// necessary to handle both bp values for entire fetal data section
				// like Presentation,Movement, Heart Rate and Lie in case of dynamic
				// lables.
				var allFetalDataCollection = {};
				// final data storage array that will be sorted and iterated to
				// display start individual card and header
				var dynamicLabelArray = [];
				// Variable to store Provider Name which is documented while
				// charting Next Appointment Event in the Ineractive View.
				var providerName;
				if (recordData.VISITS[i].PROVIDER_NAME.length > 0) {
					providerName = recordData.VISITS[i].PROVIDER_NAME[0].VALUE || "--";
				}
				else {
					providerName = "--";
				}
				var cardProperties = "";

				if (component.m_encntrBasedDisplayChoosen) {
					cardProperties = "pv-wf-preg-visit-card";
				}
				else {
					cardProperties = "pv-wf-context-menu-delete-card  pv-wf-preg-visit-card";
				}

				visitHTMLArray.push("<div class='" + cardProperties + "' id = 'visitCard_" + i + "_" + compId + "'><div class='pv-wf-card-hdr'><div class='pv-wf-ega-align'><div class='pv-wf-visit-dt'><span>");
				visitDate.setISO8601(recordData.VISITS[i].VISIT_DATE);
				visitHTMLArray.push(visitDate.format("shortDate3"), "</span></div><div class='pv-wf-provider-name'>", providerName, "</div></div><div class='pv-wf-ega-align'><div class='pv-wf-ega-rslt'>");

				visitCardsObj[i].visitDate = visitDate.format("shortDate3");
				if (recordData.VISITS[i].EGA.length > 0) {
					recordData.VISITS[i].EGA.sort(this.resultDateSort);
					if (recordData.VISITS[i].EGA[0].VALUE) {
						eventResValue = recordData.VISITS[i].EGA[0].VALUE;
					}
					else {
						var egaWeeks = (recordData.VISITS[i].EGA[0].WEEKS === "") ? "0" : recordData.VISITS[i].EGA[0].WEEKS;
						var egaDays = (recordData.VISITS[i].EGA[0].DAYS === "") ? "0" : recordData.VISITS[i].EGA[0].DAYS;
						eventResValue = egaWeeks + "<span class='pv-wf-ega-lbl'>" + prenatalVisitsi18n.WEEK_ABBV + "</span>" + egaDays + "<span class='pv-wf-ega-lbl'>" + prenatalVisitsi18n.DAY_ABBV + "</span>";
					}
				}
				else {
					eventResValue = missingVal;
				}
				visitCardsObj[i].ega = eventResValue;
				visitHTMLArray.push(eventResValue, "</div></div></div>");
				eventResValue = "";

				// Patient data section top layer of patient data
				visitHTMLArray.push("<div class='pv-wf-patient-data'><dl class='pv-wf-preg-data-labels'><dt class='pv-wf-pt-data-top-lt'>", prenatalVisitsi18n.FUNDAL_HEIGHT, "</dt><dt class='pv-wf-pt-data-top-rt'>", prenatalVisitsi18n.PRETERMSIGNS, "</dt></dl>");
				if (recordData.VISITS[i].FUNDAL_HEIGHT.length > 0) {
					recordData.VISITS[i].FUNDAL_HEIGHT.sort(this.resultDateSort);
					if (recordData.VISITS[i].FUNDAL_HEIGHT[0].VALUE) {
						eventResValue = recordData.VISITS[i].FUNDAL_HEIGHT[0].VALUE;
						eventResUnit = recordData.VISITS[i].FUNDAL_HEIGHT[0].UNITS;
						visitCardsObj[i].fundalHeightUnit = eventResUnit;
					}
				}
				else {
					eventResValue = missingVal;
				}
				visitCardsObj[i].fundalHeight = eventResValue;
				visitHTMLArray.push("<dl><dt>", prenatalVisitsi18n.FUNDAL_HEIGHT, "</dt><dd class='pv-wf-pt-data-top-lt'><span>", eventResValue, "</span><span class='unit'>", eventResUnit, "</span></dd>");
				for ( j = 0, eventsDataLength = recordData.VISITS[i].FUNDAL_HEIGHT.length; j < eventsDataLength; j++) {
					fundalHeightArray.push(recordData.VISITS[i].FUNDAL_HEIGHT[j]);
				}
				eventResValue = "";
				eventResUnit = "";
				if (recordData.VISITS[i].PRETERM_SIGNS.length > 0) {
					recordData.VISITS[i].PRETERM_SIGNS.sort(this.resultDateSort);
					if (recordData.VISITS[i].PRETERM_SIGNS[0].VALUE) {
						eventResValue = recordData.VISITS[i].PRETERM_SIGNS[0].VALUE;
					}
				}
				else {
					eventResValue = missingVal;
				}
				visitCardsObj[i].pretermSigns = eventResValue;
				visitHTMLArray.push("<dt>", prenatalVisitsi18n.PRETERMSIGNS, "</dt><dd class='pv-wf-pt-data-top-rt'>", eventResValue, "</dd></dl>");
				for ( j = 0, eventsDataLength = recordData.VISITS[i].PRETERM_SIGNS.length; j < eventsDataLength; j++) {
					preTermSignsArray.push(recordData.VISITS[i].PRETERM_SIGNS[j]);
				}
				eventResValue = "";
				// middle layer of patient data 3 Cervical results combine into a
				// single display
				visitHTMLArray.push("<dl class='pv-wf-preg-data-labels'><dt class='pv-wf-cervical-station'>", prenatalVisitsi18n.CERVICALEXAM, "</dt><dt class='pv-wf-cervical'>", prenatalVisitsi18n.BP, "</dt><dt class='pv-wf-cervical'>", prenatalVisitsi18n.WEIGHT, "</dt></dl>");
				if (recordData.VISITS[i].CERVICAL_DIL.length > 0) {
					recordData.VISITS[i].CERVICAL_DIL.sort(this.resultDateSort);
					if (recordData.VISITS[i].CERVICAL_DIL[0].VALUE) {
						eventResValue = recordData.VISITS[i].CERVICAL_DIL[0].VALUE;
					}
				}
				else {
					eventResValue = missingVal;
				}
				visitCardsObj[i].dilation = eventResValue;

				visitHTMLArray.push("<dl><dt>", prenatalVisitsi18n.CERVICALEXAM, "</dt><dd class='pv-wf-cervical-station'><span class='pv-wf-cerv-dil'>", eventResValue, "</span>/<span class='pv-wf-cerv-eff'>");
				for ( j = 0, eventsDataLength = recordData.VISITS[i].CERVICAL_DIL.length; j < eventsDataLength; j++) {
					cervicalDilArray.push(recordData.VISITS[i].CERVICAL_DIL[j]);
				}
				eventResValue = "";
				if (recordData.VISITS[i].CERVICAL_EFF.length > 0) {
					recordData.VISITS[i].CERVICAL_EFF.sort(this.resultDateSort);
					if (recordData.VISITS[i].CERVICAL_EFF[0].VALUE) {
						eventResValue = recordData.VISITS[i].CERVICAL_EFF[0].VALUE;
					}
				}
				else {
					eventResValue = missingVal;
				}
				visitCardsObj[i].effacement = eventResValue;
				visitHTMLArray.push(eventResValue, "</span>/<span class='cerv-stat'>");
				for ( j = 0, eventsDataLength = recordData.VISITS[i].CERVICAL_EFF.length; j < eventsDataLength; j++) {
					cervicalEffArray.push(recordData.VISITS[i].CERVICAL_EFF[j]);
				}
				eventResValue = "";
				if (recordData.VISITS[i].CERVICAL_STAT.length > 0) {
					recordData.VISITS[i].CERVICAL_STAT.sort(this.resultDateSort);
					if (recordData.VISITS[i].CERVICAL_STAT[0].VALUE) {
						eventResValue = recordData.VISITS[i].CERVICAL_STAT[0].VALUE;
					}
				}
				else {
					eventResValue = missingVal;
				}
				visitCardsObj[i].station = eventResValue;

				visitHTMLArray.push(eventResValue, "</span></dd>");
				for ( j = 0, eventsDataLength = recordData.VISITS[i].CERVICAL_STAT.length; j < eventsDataLength; j++) {
					cervicalStatArray.push(recordData.VISITS[i].CERVICAL_STAT[j]);
				}
				eventResValue = "";
				// Blood Pressure
				if (recordData.VISITS[i].BP.length > 0) {
					recordData.VISITS[i].BP.sort(this.resultDateSort);
					if (recordData.VISITS[i].BP[0].SYS_VALUE) {
						eventResValue = recordData.VISITS[i].BP[0].SYS_VALUE;
					}

					if (recordData.VISITS[i].BP[0].DIA_VALUE) {
						eventResValue2 = recordData.VISITS[i].BP[0].DIA_VALUE;
					}
				}
				else {
					eventResValue = missingVal;
					eventResValue2 = missingVal;
				}
				visitCardsObj[i].systolic = eventResValue;
				visitCardsObj[i].diastolic = eventResValue2;

				visitHTMLArray.push("<dt>", prenatalVisitsi18n.BP, "</dt><dd class='pv-wf-cervical'>", eventResValue, "/", eventResValue2, "</dd>");
				eventResValue = "";
				eventResValue2 = "";
				for ( j = 0, eventsDataLength = recordData.VISITS[i].BP.length; j < eventsDataLength; j++) {
					bloodPressureArray.push(recordData.VISITS[i].BP[j]);
				}
				if (recordData.VISITS[i].WEIGHT.length > 0) {
					recordData.VISITS[i].WEIGHT.sort(this.resultDateSort);
					if (recordData.VISITS[i].WEIGHT[0].VALUE) {
						eventResValue = recordData.VISITS[i].WEIGHT[0].VALUE;
						eventResUnit = recordData.VISITS[i].WEIGHT[0].UNITS;
					}
				}
				else {
					eventResValue = missingVal;
				}
				visitCardsObj[i].weight = eventResValue;
				visitHTMLArray.push("<dt>", prenatalVisitsi18n.WEIGHT, "</dt><dd class='pv-wf-cervical'><span class='cur-weight'>", eventResValue, "</span><span class='unit'>", eventResUnit, "</span>");
				eventResValue = "";
				eventResUnit = "";
				for ( j = 0, eventsDataLength = recordData.VISITS[i].WEIGHT.length; j < eventsDataLength; j++) {
					weightArray.push(recordData.VISITS[i].WEIGHT[j]);
				}
				if (recordData.VISITS[i].WEIGHT_CHG.length > 0) {
					recordData.VISITS[i].WEIGHT_CHG.sort(this.resultDateSort);
					if (recordData.VISITS[i].WEIGHT_CHG[0].VALUE) {
						eventResValue = recordData.VISITS[i].WEIGHT_CHG[0].VALUE;
					}
				}
				else {
					eventResValue = missingVal;
				}
				visitHTMLArray.push("<span class='pv-wf-diff-weight'>(", eventResValue, ")</span></dd></dl>");
				eventResValue = "";
				for ( j = 0, eventsDataLength = recordData.VISITS[i].WEIGHT_CHG.length; j < eventsDataLength; j++) {
					weightDiffArray.push(recordData.VISITS[i].WEIGHT_CHG[j]);
				}
				// The bottom layer of patient data
				// 'urine' category label
				visitHTMLArray.push("<dl class='pv-wf-urine-border-height'><span class='pv-wf-urine-borders  pv-wf-left-urine-border'></span><span class='pv-wf-urine-lbl'>", prenatalVisitsi18n.URINE, "</span><span class='pv-wf-urine-borders pv-wf-right-urine-border'></span></dl>");
				visitHTMLArray.push("<dl class='pv-wf-preg-data-labels'><dt class='pv-wf-pt-data-mid'>", prenatalVisitsi18n.EDEMA, "</dt><dt class='pv-wf-pt-data-bot'>", prenatalVisitsi18n.PROTEIN, "</dt><dt class='pv-wf-pt-data-bot'>", prenatalVisitsi18n.GLUCOSE, "</dt><dt class='pv-wf-pt-data-bot'>", prenatalVisitsi18n.KETONES, "</dt></dl>");
				if (recordData.VISITS[i].EDEMA.length > 0) {
					recordData.VISITS[i].EDEMA.sort(this.resultDateSort);
					if (recordData.VISITS[i].EDEMA[0].VALUE) {
						eventResValue = recordData.VISITS[i].EDEMA[0].VALUE;
					}
				}
				else {
					eventResValue = missingVal;
				}
				visitCardsObj[i].edema = eventResValue;

				visitHTMLArray.push("<dl><dt>", prenatalVisitsi18n.EDEMA, "</dt><dd class='pv-wf-pt-data-mid'>", eventResValue, "</dd>");
				eventResValue = "";
				for ( j = 0, eventsDataLength = recordData.VISITS[i].EDEMA.length; j < eventsDataLength; j++) {
					edemaArray.push(recordData.VISITS[i].EDEMA[j]);
				}
				if (recordData.VISITS[i].URINE_PROTEIN.length > 0) {
					recordData.VISITS[i].URINE_PROTEIN.sort(this.resultDateSort);
					if (recordData.VISITS[i].URINE_PROTEIN[0].VALUE) {
						eventResValue = recordData.VISITS[i].URINE_PROTEIN[0].VALUE;
					}
				}
				else {
					eventResValue = missingVal;
				}
				visitCardsObj[i].protein = eventResValue;

				visitHTMLArray.push("<dt>", prenatalVisitsi18n.PROTEIN, "</dt><dd class='pv-wf-pt-data-bot'>", eventResValue, "</dd>");
				eventResValue = "";
				for ( j = 0, eventsDataLength = recordData.VISITS[i].URINE_PROTEIN.length; j < eventsDataLength; j++) {
					urineProteinArray.push(recordData.VISITS[i].URINE_PROTEIN[j]);
				}
				if (recordData.VISITS[i].URINE_GLUCOSE.length > 0) {
					recordData.VISITS[i].URINE_GLUCOSE.sort(this.resultDateSort);
					if (recordData.VISITS[i].URINE_GLUCOSE[0].VALUE) {
						eventResValue = recordData.VISITS[i].URINE_GLUCOSE[0].VALUE;
					}
				}
				else {
					eventResValue = missingVal;
				}
				visitCardsObj[i].glucose = eventResValue;

				visitHTMLArray.push("<dt>", prenatalVisitsi18n.GLUCOSE, "</dt><dd class='pv-wf-pt-data-bot'>", eventResValue, "</dd>");
				eventResValue = "";
				for ( j = 0, eventsDataLength = recordData.VISITS[i].URINE_GLUCOSE.length; j < eventsDataLength; j++) {
					urineGlucoseArray.push(recordData.VISITS[i].URINE_GLUCOSE[j]);
				}
				if (recordData.VISITS[i].URINE_KETONES.length > 0) {
					recordData.VISITS[i].URINE_KETONES.sort(this.resultDateSort);
					if (recordData.VISITS[i].URINE_KETONES[0].VALUE) {
						eventResValue = recordData.VISITS[i].URINE_KETONES[0].VALUE;
					}
				}
				else {
					eventResValue = missingVal;
				}
				visitCardsObj[i].ketones = eventResValue;

				visitHTMLArray.push("<dt>", prenatalVisitsi18n.URINE_KETONES, "</dt><dd class='pv-wf-ketones-hover'>", eventResValue, "</dd></dt></div>");
				eventResValue = "";
				for ( j = 0, eventsDataLength = recordData.VISITS[i].URINE_KETONES.length; j < eventsDataLength; j++) {
					urineKetonesArray.push(recordData.VISITS[i].URINE_KETONES[j]);
				}

				// fetal data section
				if (isFetalLiePresent) {
					fetalDataCssClass = "pv-wf-preg-data-labels-complete-fetal-data";
					fetalDataLie = "<dt class='" + fetalDataCssClass + "'>" + prenatalVisitsi18n.FETAL_LIE + "</dt>";
				}
				visitHTMLArray.push("<div class='", fetalClass, "'><dl class='pv-wf-fetal-border-height'><span class='pv-wf-fetal-borders pv-wf-left-fetal-border'></span><span class='pv-wf-urine-lbl'>", prenatalVisitsi18n.FETAL, "</span><span class='pv-wf-fetal-borders pv-wf-right-fetal-border'></span></dl>");
				visitHTMLArray.push("<dl class='pv-wf-preg-data-labels", "'><dt class='" + fetalDataCssClass + "'>", prenatalVisitsi18n.FETAL_PRESENT, "</dt><dt class='" + fetalDataCssClass + "'>", prenatalVisitsi18n.FETAL_MOVE, "</dt><dt class='" + fetalDataCssClass + "'>", prenatalVisitsi18n.FETAL_HR, "</dt>", fetalDataLie);
				visitHTMLArray.push("</dl>");

				if (recordData.VISITS[i].PRESENTATION.length > 0) {
					recordData.VISITS[i].PRESENTATION.sort(this.resultDateSort);
				}

				for ( j = 0, eventsDataLength = recordData.VISITS[i].PRESENTATION.length; j < eventsDataLength; j++) {
					initialDynLabelObj = recordData.VISITS[i].PRESENTATION[j];
					dynamicLabelId = String(initialDynLabelObj.DYNAMIC_LABEL_ID);
					if (allFetalDataCollection[dynamicLabelId]) {
						if (allFetalDataCollection[dynamicLabelId].PRESENT_VALUE === "") {
							allFetalDataCollection[dynamicLabelId].PRESENT_VALUE = initialDynLabelObj.VALUE;
						}
					}
					else {
						newDynLabelObj = {};
						newDynLabelObj.DYNAMIC_LABEL_ID = initialDynLabelObj.DYNAMIC_LABEL_ID;
						newDynLabelObj.LABEL = initialDynLabelObj.DYNAMIC_LABEL;
						newDynLabelObj.PRESENT_VALUE = initialDynLabelObj.VALUE;
						newDynLabelObj.MOVE_VALUE = "";
						newDynLabelObj.FHR_VALUE = "";
						newDynLabelObj.LIE_VALUE = "";
						allFetalDataCollection[dynamicLabelId] = newDynLabelObj;
						dynamicLabelArray.push(newDynLabelObj);
					}
					fetalPresentArray.push(initialDynLabelObj);
				}
				if (recordData.VISITS[i].FETAL_MOVEMENT.length > 0) {
					recordData.VISITS[i].FETAL_MOVEMENT.sort(this.resultDateSort);
				}
				var tempDynamicID;
				for ( j = 0, eventsDataLength = recordData.VISITS[i].FETAL_MOVEMENT.length; j < eventsDataLength; j++) {
					initialDynLabelObj = recordData.VISITS[i].FETAL_MOVEMENT[j];
					tempDynamicID = String(initialDynLabelObj.DYNAMIC_LABEL_ID);
					if (allFetalDataCollection[tempDynamicID]) {
						// this dynamic label has already been found
						if (allFetalDataCollection[tempDynamicID].MOVE_VALUE === "") {
							// the most recent fetal result in this category for
							// this dynamic label has not been populated
							allFetalDataCollection[tempDynamicID].MOVE_VALUE = initialDynLabelObj.VALUE;
						}
					}
					else {
						var newDynLabelObject = {};
						newDynLabelObject.DYNAMIC_LABEL_ID = initialDynLabelObj.DYNAMIC_LABEL_ID;
						newDynLabelObject.LABEL = initialDynLabelObj.DYNAMIC_LABEL;
						newDynLabelObject.PRESENT_VALUE = "";
						newDynLabelObject.MOVE_VALUE = initialDynLabelObj.VALUE;
						newDynLabelObject.FHR_VALUE = "";
						newDynLabelObject.LIE_VALUE = "";
						allFetalDataCollection[initialDynLabelObj.DYNAMIC_LABEL_ID] = newDynLabelObject;
						dynamicLabelArray.push(newDynLabelObject);
					}
					fetalMovementArray.push(initialDynLabelObj);
				}
				if (recordData.VISITS[i].FHR.length > 0) {
					recordData.VISITS[i].FHR.sort(this.resultDateSort);
				}
				for ( j = 0, eventsDataLength = recordData.VISITS[i].FHR.length; j < eventsDataLength; j++) {
					initialDynLabelObj = recordData.VISITS[i].FHR[j];
					tempDynamicID = String(initialDynLabelObj.DYNAMIC_LABEL_ID);
					if (allFetalDataCollection[tempDynamicID]) {
						// this dynamic label has already been found
						if (allFetalDataCollection[tempDynamicID].FHR_VALUE === "") {
							// the most recent fetal result in this category for
							// this dynamic label has not been populated
							allFetalDataCollection[tempDynamicID].FHR_VALUE = initialDynLabelObj.VALUE;
						}
					}
					else {
						// this dynamic label is brand spanking new
						// this holds good if the dynamic label is not present and
						// if it is a new dynamic label.
						// For example first time before adding any values dynamic
						// label will contain only one Baby.
						// if there are multiple babies in that case this dynamic
						// label will not be new one.
						newDynLabelObj = {};
						newDynLabelObj.DYNAMIC_LABEL_ID = initialDynLabelObj.DYNAMIC_LABEL_ID;
						newDynLabelObj.LABEL = initialDynLabelObj.DYNAMIC_LABEL;
						newDynLabelObj.PRESENT_VALUE = "";
						newDynLabelObj.MOVE_VALUE = "";
						newDynLabelObj.FHR_VALUE = initialDynLabelObj.VALUE;
						newDynLabelObj.LIE_VALUE = "";
						allFetalDataCollection[initialDynLabelObj.DYNAMIC_LABEL_ID] = newDynLabelObj;
						dynamicLabelArray.push(newDynLabelObj);
					}
					fetalHeartRateArray.push(initialDynLabelObj);
				}
				if (isFetalLiePresent) {
					if (recordData.VISITS[i].FETAL_LIE.length > 0) {
						recordData.VISITS[i].FETAL_LIE.sort(this.resultDateSort);
					}
					for ( j = 0, eventsDataLength = recordData.VISITS[i].FETAL_LIE.length; j < eventsDataLength; j++) {
						initialDynLabelObj = recordData.VISITS[i].FETAL_LIE[j];
						dynamicLabelId = String(initialDynLabelObj.DYNAMIC_LABEL_ID);
						if (allFetalDataCollection[dynamicLabelId]) {
							// this dynamic label has already been found
							if (allFetalDataCollection[dynamicLabelId].LIE_VALUE === "") {
								// the most recent fetal result in this category for
								// this dynamic label has not been populated
								allFetalDataCollection[dynamicLabelId].LIE_VALUE = initialDynLabelObj.VALUE;
							}
						}
						else {
							// this dynamic label is brand spanking new
							// this holds good if the dynamic label is not present
							// and if it is a new dynamic label.
							// For example first time before adding any values
							// dynamic label will contain only one Baby.
							// if there are multiple babies in that case this
							// dynamic label will not be new one.
							newDynLabelObj = {};
							newDynLabelObj.DYNAMIC_LABEL_ID = initialDynLabelObj.DYNAMIC_LABEL_ID;
							newDynLabelObj.LABEL = initialDynLabelObj.DYNAMIC_LABEL;
							newDynLabelObj.PRESENT_VALUE = "";
							newDynLabelObj.MOVE_VALUE = "";
							newDynLabelObj.FHR_VALUE = "";
							newDynLabelObj.LIE_VALUE = initialDynLabelObj.VALUE;
							allFetalDataCollection[initialDynLabelObj.DYNAMIC_LABEL_ID] = newDynLabelObj;
							dynamicLabelArray.push(newDynLabelObj);
						}
						fetalLieArray.push(initialDynLabelObj);
					}
				}
				// Sort by dynamic label display
				if (dynamicLabelArray.length > 0) {
					if (dynamicLabelArray.length > maxFetusCnt) {
						maxFetusCnt = dynamicLabelArray.length;
						maxFetusIdx = i;
					}
					// pull data out of temp array
					// variable which holds the lenght of the dynamic Labels Array.
					var dynamicLabelArrayLength = dynamicLabelArray.length;
					for ( j = 0; j < dynamicLabelArrayLength; j++) {
						var tempID = String(dynamicLabelArray[j].DYNAMIC_LABEL_ID);
						dynamicLabelArray[j] = allFetalDataCollection[tempID];
					}
					// all fetal results are organized by dynamic label id, iterate
					// through and create HTML
					dynamicLabelArray.sort(component.dynamicLabelSort);

					visitCardsObj[i].numberOfBabies = dynamicLabelArray.length;
					visitCardsObj[i].numberOfBabiesInitial = dynamicLabelArray.length;
					visitCardsObj[i].fhr = [];
					visitCardsObj[i].fetalLie = [];
					visitCardsObj[i].fetalPresent = [];
					visitCardsObj[i].fetalMovement = [];
					visitCardsObj[i].babyLabels = [];
					visitCardsObj[i].babyLabelStat = [];
					visitCardsObj[i].babyLabelIds = [];
					dynamicLabelArrayLength = dynamicLabelArray.length;
					this.sortCardViewBabyLabels(dynamicLabelArray);
					for ( j = 0; j < dynamicLabelArrayLength; j++) {
						visitCardsObj[i].babyLabelStat[j] = component.m_babyLabelStatusInstanceArr[String(dynamicLabelArray[j].DYNAMIC_LABEL_ID)].STATUS;
						visitCardsObj[i].babyLabelIds[j] = dynamicLabelArray[j].DYNAMIC_LABEL_ID;
						eventResValue = (dynamicLabelArray[j].LABEL !== "") ? dynamicLabelArray[j].LABEL : missingVal;
						visitHTMLArray.push("<dl>");
						visitCardsObj[i].babyLabels[j] = eventResValue;
						if (component.m_babyLabelStatusInstanceArr[String(dynamicLabelArray[j].DYNAMIC_LABEL_ID)].STATUS) {
							var displayValue = dynamicLabelArray[j].PRESENT_VALUE !== "" ? dynamicLabelArray[j].PRESENT_VALUE : missingVal;
							visitHTMLArray.push("<dt>", prenatalVisitsi18n.FPRESENT, "</dt><dd class='", fetalLieClassLabel, "'><span class='pv-wf-fetal-label'><span class ='pv-wf-label-name'>[", eventResValue, "]</span></span>&nbsp;&nbsp;<span class='pv-wf-fetal-result'>", displayValue, "</span></dd>");
							visitCardsObj[i].fetalPresent[j] = displayValue;

							displayValue = dynamicLabelArray[j].MOVE_VALUE !== "" ? dynamicLabelArray[j].MOVE_VALUE : missingVal;
							visitCardsObj[i].fetalMovement[j] = displayValue;
							visitHTMLArray.push("<dt>", prenatalVisitsi18n.FMOVE, "</dt><dd class='", fetalLieClassLabel, "'><span class='pv-wf-fetal-label'><span class ='pv-wf-label-name'>[", eventResValue, "]</span></span>&nbsp;&nbsp;<span class='pv-wf-fetal-result'>", displayValue, "</span></dd>");

							displayValue = dynamicLabelArray[j].FHR_VALUE !== "" ? dynamicLabelArray[j].FHR_VALUE : missingVal;
							visitHTMLArray.push("<dt>", prenatalVisitsi18n.FHR, "</dt><dd class='", fetalheartClassLabel, "'><span class='pv-wf-fetal-label'><span class ='pv-wf-label-name'>[", eventResValue, "]</span></span>&nbsp;&nbsp;<span class='pv-wf-fetal-result'>", displayValue, "</span></dd>");
							visitCardsObj[i].fhr[j] = displayValue;

							if (isFetalLiePresent) {
								displayValue = dynamicLabelArray[j].LIE_VALUE !== "" ? dynamicLabelArray[j].LIE_VALUE : missingVal;
								visitCardsObj[i].fetalLie[j] = displayValue;
								visitHTMLArray.push("<dt>", prenatalVisitsi18n.fetalLie, "</dt><dd class='", fetalLieClassLabel, "'><span class='pv-wf-fetal-label'><span class ='pv-wf-label-name'>[", eventResValue, "]</span></span>&nbsp;&nbsp;<span class='pv-wf-fetal-result'>", displayValue, "</span></dd>");
							}
							visitHTMLArray.push("</dl>");
							eventResValue = "";
						}
						else {
							var inactiveBabyLabel = prenatalVisitsi18n.INACTIVE.replace("{0}", "[" + visitCardsObj[i].babyLabels[j] + "]");
							visitHTMLArray.push("<dl><span class='pv-wf-fetal-label'><span class ='pv-wf-label-name'>" + inactiveBabyLabel + "</span></span></dl>");
							eventResValue = "";
						}
					}
				}
				else {
					visitHTMLArray.push("<dl><dt>", prenatalVisitsi18n.FPRESENT, "</dt><dd class='", fetalLieClassLabel, "'>", missingVal, "</dd><dt>", prenatalVisitsi18n.FMOVE, "</dt><dd class='", fetalLieClassLabel, "'>", missingVal, "</dd><dt>", prenatalVisitsi18n.FHR, "</dt><dd class='", fetalLieClassLabel, "'>", missingVal, "</dd>");
					if (isFetalLiePresent) {
						visitHTMLArray.push("<dt>", prenatalVisitsi18n.fetalLie, "</dt><dd class='", fetalLieClassLabel, "'>", missingVal, "</dd>");
					}
					visitHTMLArray.push("</dl>");
				}
				visitHTMLArray.push("</div>");
				// end fetal data section

				// antepartum note
				commentHoverdata = "";
				if (recordData.VISITS[i].COMMENT.length > 0) {
					recordData.VISITS[i].COMMENT.sort(this.resultDateSort);
					// Variable which is used for comment text where hover will be
					// displayed only when the comment text exceeds morethan 254
					// characters.
					var maxCommentHoverText = 254;
					var commentSubStringlen = 252;
					if (recordData.VISITS[i].COMMENT[0].VALUE.length > maxCommentHoverText) {
						eventResValue = recordData.VISITS[i].COMMENT[0].VALUE.substr(0, commentSubStringlen) + "...";
						commentValue = recordData.VISITS[i].COMMENT[0].VALUE;
						commentHoverdata = "<div class='pv-wf-cmnt-hover pv-wf-preg-res-hvr'><p>" + prenatalVisitsi18n.COMMENTS + "<br />" + recordData.VISITS[i].COMMENT[0].VALUE + "</p></div>";
					}
					else {
						eventResValue = recordData.VISITS[i].COMMENT[0].VALUE;
					}
				}
				else {
					eventResValue = missingVal;
					commentHoverdata = "<div class='pv-wf-cmnt-hover pv-wf-preg-res-hvr'><p>" + prenatalVisitsi18n.COMMENTS + "<br />" + eventResValue + "</p></div>";
				}
				visitCardsObj[i].comments = eventResValue;

				visitHTMLArray.push("<div class='pv-wf-cmnt-data'>", prenatalVisitsi18n.COMMENTS, "<p>", eventResValue, "</p></div>", commentHoverdata, "<div class='pv-wf-patient-data pv-wf-patient-appt-data'><dl><span>", prenatalVisitsi18n.NEXT_APPT, "</span></dl>");
				if (recordData.VISITS[i].NEXT_APPT.length > 0) {
					recordData.VISITS[i].NEXT_APPT.sort(this.resultDateSort);
					if (recordData.VISITS[i].NEXT_APPT[0].VALUE) {
						eventResValue = recordData.VISITS[i].NEXT_APPT[0].VALUE;
						eventResUnit = recordData.VISITS[i].NEXT_APPT[0].UNITS;
					}
				}
				else {
					eventResValue = missingVal;
				}
				visitCardsObj[i].nextAppt = eventResValue;
				visitCardsObj[i].nextApptUnit = eventResUnit;
				visitHTMLArray.push("<dl><dd>&nbsp;&nbsp;", eventResValue, " ", eventResUnit, "</dd></dl><dd class = 'pv-wf-edit-card'><a id='editCard_" + i + "_" + compId + "' >" + prenatalVisitsi18n.CHART + "</a></dd></div></div>");
				// end patient data div
				eventResValue = "";
				eventResUnit = "";
				for ( j = 0, eventsDataLength = recordData.VISITS[i].NEXT_APPT.length; j < eventsDataLength; j++) {
					nextApptArray.push(recordData.VISITS[i].NEXT_APPT[j]);
				}

			}// end visit card loop
			visitHTMLArray.push("</div></div></div>");
			// end visit-cards
			buildHTML.push(navBarHTMLArray.join(""), visitHTMLArray.join(""));

			// create hover data
			buildHTML.push("<div id='pregallResults", compId, "' class='pv-wf-preg-assess-all-results'>");
			if (this.getFundalHt().length > 0) {
				buildHTML.push(this.createHoverHTML("fundalHeightHover" + compId, prenatalVisitsi18n.FUNDAL_HEIGHT, fundalHeightArray));
			}
			if (this.getPreSgnAndSym().length > 0) {
				buildHTML.push(this.createHoverHTML("pretermSignsHover" + compId, prenatalVisitsi18n.PRETERMSIGNS, preTermSignsArray));
			}
			if (this.getCervicalEffacementLen().length > 0) {
				buildHTML.push(this.createHoverHTML("cervicalEffacementHover" + compId, prenatalVisitsi18n.CERVICAL_EFF, cervicalEffArray));
			}
			if (this.getCervicalDilation().length > 0) {
				buildHTML.push(this.createHoverHTML("cervicalDilationHover" + compId, prenatalVisitsi18n.CERVICAL_DIL, cervicalDilArray));
			}
			if (this.getCervicalStation().length > 0) {
				buildHTML.push(this.createHoverHTML("cervicalStationHover" + compId, prenatalVisitsi18n.CERVICAL_STAT, cervicalStatArray));
			}
			// Blood pressure is a special little flower and needs it's own logic
			if (this.getBPResGroup().length > 0) {
				buildHTML.push("<div id='pregBPHover", compId, "' class='pv-wf-preg-res-hvr'><h4 class='pv-wf-preg-data-title'>", prenatalVisitsi18n.BP, "</h4><dl class='pv-wf-preg-all-res'>");
				if (bloodPressureArray.length > 0) {
					var hoverLength = bloodPressureArray.length;
					var k = 0;
					bloodPressureArray.sort(this.resultDateSort);
					for ( k = 0; k < hoverLength; k++) {
						var resDate = new Date();
						eventResValue = (bloodPressureArray[k].SYS_VALUE !== "") ? bloodPressureArray[k].SYS_VALUE : missingVal;
						eventResValue2 = (bloodPressureArray[k].DIA_VALUE !== "") ? bloodPressureArray[k].DIA_VALUE : missingVal;
						resDate.setISO8601(bloodPressureArray[k].DATE);
						buildHTML.push("<dt>", resDate.format("longDateTime3"), "</dt><dd>", eventResValue, "/", eventResValue2, " ", bloodPressureArray[k].UNITS, "</dd><br />");
					}
				}
				else {
					buildHTML.push("<dt>--</dt><dd>--</dd>");
				}
				buildHTML.push("</dl></div>");
			}

			if (this.getWeight().length > 0) {
				buildHTML.push(this.createHoverHTML("pregWeightHover" + compId, prenatalVisitsi18n.WEIGHT, weightArray));
			}
			if (this.getCumulativeWt().length > 0) {
				buildHTML.push(this.createHoverHTML("pregWeightChgHover" + compId, prenatalVisitsi18n.WEIGHT_CHG, weightDiffArray));
			}
			if (this.getEdema().length > 0) {
				buildHTML.push(this.createHoverHTML("edemaHover" + compId, prenatalVisitsi18n.EDEMA, edemaArray));
			}
			if (this.getProtein().length > 0) {
				buildHTML.push(this.createHoverHTML("urineProteinHover" + compId, prenatalVisitsi18n.URINE_PROTEIN, urineProteinArray));
			}
			if (this.getGlucose().length > 0) {
				buildHTML.push(this.createHoverHTML("urineGlucoseHover" + compId, prenatalVisitsi18n.URINE_GLUCOSE, urineGlucoseArray));
			}
			if (this.getKetones().length > 0) {
				buildHTML.push(this.createHoverHTML("urineKetonesHover" + compId, prenatalVisitsi18n.URINE_KETONES, urineKetonesArray));
			}
			if (this.getNextAppointment().length > 0) {
				buildHTML.push(this.createHoverHTML("pregNxtApptHover" + compId, prenatalVisitsi18n.NEXT_APPT, nextApptArray));
			}

			// fetal hovers display the dynamic label and need to be constructed
			// differently
			if (this.getPresentation().length > 0) {
				buildHTML.push(this.createFetalHoverHTML("fetalPresentHover" + compId, prenatalVisitsi18n.FPRESENT, fetalPresentArray));
			}
			if (this.getFetalMovement().length > 0) {
				buildHTML.push(this.createFetalHoverHTML("fetalMoveHover" + compId, prenatalVisitsi18n.FETAL_MOVE, fetalMovementArray));
			}
			if (this.getFetalHrRt().length > 0) {
				buildHTML.push(this.createFetalHoverHTML("fetalHeartRateHover" + compId, prenatalVisitsi18n.FETAL_HR, fetalHeartRateArray));
			}
			if (this.getFetalLie().length > 0) {
				buildHTML.push(this.createFetalHoverHTML("fetalLieHover" + compId, prenatalVisitsi18n.FETAL_LIE, fetalLieArray));
			}

			buildHTML.push("</div>");
			// end pv-wf-preg-assess-all-results
			this.finalizeComponent(buildHTML.join(""), "");
			// necessary for initializing scrolling
			var pregComp = _g("pv" + compId);
			var navLinks = $('#' + navBarID).find('li');
			var visitCards = $('#' + visitCardID + " div.pv-wf-preg-visit-card");
			var newVisitCard = $('#' + visitCardID + " div.pv-wf-preg-visit-card-new-visit");
			var visitCardPane = $('#' + visitCardID);
			var visitCardDivs = Util.Style.g("pv-wf-preg-visit-card", pregComp, "DIV");

			// for each card, set the fetal data section to the size of the largest
			// fetal data section across all visit cards
			if (maxFetusIdx > -1) {

				var maxFetusDiv = Util.Style.g(fetalClass,
				visitCardDivs[maxFetusIdx], "DIV")[0];
				var fetalHeight = $(maxFetusDiv).height();
				j = 0;
				var visitsCardsDivLen = 0;
				for ( j = 0, visitsCardsDivLen = visitCardDivs.length; j < visitsCardsDivLen; j++) {
					var tempDiv = Util.Style.g(fetalClass, visitCardDivs[j], "DIV")[0];
					$(tempDiv).height(fetalHeight);
				}
			}

			// establish hovers
			for ( i = 0, len = visitCardDivs.length; i < len; i++) {
				var patientData = $(visitCardDivs[i]).find('div.pv-wf-patient-data').find('dd');
				if (patientData) {
					var cervDilSpan = Util.Style.g("pv-wf-cerv-dil", patientData[2], "SPAN")[0];
					var cervEffSpan = Util.Style.g("pv-wf-cerv-eff",patientData[2], "SPAN")[0];
					var cervStatSpan = Util.Style.g("cerv-stat", patientData[2],"SPAN")[0];
					var weightSpan = Util.Style.g("cur-weight", patientData[4],"SPAN")[0];
					var weightDiffSpan = Util.Style.g("pv-wf-diff-weight",patientData[4], "SPAN")[0];
					// Fundal Height hover
					this.addMouseListeners(patientData[0], 'fundalHeightHover' + compId, compId);

					// Preterm Signs and Symptoms hover
					this.addMouseListeners(patientData[1], 'pretermSignsHover' + compId, compId);

					// Cervical Exam hover
					this.addMouseListeners(cervDilSpan, 'cervicalDilationHover' + compId, compId);
					this.addMouseListeners(cervEffSpan, 'cervicalEffacementHover' + compId, compId);
					this.addMouseListeners(cervStatSpan, 'cervicalStationHover' + compId, compId);

					// Blood Pressure hover
					this.addMouseListeners(patientData[3], 'pregBPHover' + compId, compId);

					// Weight & weight diff hovers
					this.addMouseListeners(weightSpan, 'pregWeightHover' + compId, compId);
					this.addMouseListeners(weightDiffSpan, 'pregWeightChgHover' + compId, compId);

					// edema hover
					this.addMouseListeners(patientData[5], 'edemaHover' + compId, compId);

					// Urine Protein hover
					this.addMouseListeners(patientData[6], 'urineProteinHover' + compId, compId);

					// Urine Glucose hover
					this.addMouseListeners(patientData[7], 'urineGlucoseHover' + compId, compId);

					// Urine Ketones hover
					this.addMouseListeners(patientData[8], 'urineKetonesHover' + compId, compId);

					// Next Appointment hover
					this.addMouseListeners(patientData[9], 'pregNxtApptHover' + compId, compId);
				}

				var fetalData = $(visitCardDivs[i]).find('div.' + fetalClass).find('dl');
				if (fetalData) {
					j = 0;
					var fLen = 0;
					for ( j = 1, fLen = fetalData.length; j < fLen; j++) {
						var fetalDD = $(fetalData[j]).find('dd');
						// Fetal Presentation hover
						this.addMouseListeners(fetalDD[0], 'fetalPresentHover' + compId, compId);
						// Fetal Movement hover
						this.addMouseListeners(fetalDD[1], 'fetalMoveHover' + compId, compId);
						// Fetal Heart Rate hover
						this.addMouseListeners(fetalDD[2], 'fetalHeartRateHover' + compId, compId);
						if (isFetalLiePresent) {
							// Fetal Lie hover
							this.addMouseListeners(fetalDD[3], 'fetalLieHover' + compId, compId);
						}
					}
				}

				// Fix the for the scenario when we have comment data goes beyond
				// the height limit of the card.
				var cmntP = $(visitCardDivs[i]).find("p");
				var cmntSpan = $(visitCardDivs[i]).find("span");
				var charCnt = 255;
				if ($(cmntP).height() + $(cmntSpan).height() > $(cmntP).parent().height()) {
					charCnt = charCnt - 100;
					var hover = Util.Style.g("pv-wf-cmnt-hover", visitCardDivs[i],
					"DIV")[0];
					if (hover) {
						Util.de(hover);
					}
					eventResValue = recordData.VISITS[i].COMMENT[0].VALUE.substr(0, charCnt - 3) + "...";
					commentHoverdata = "<div class='pv-wf-cmnt-hover pv-wf-preg-res-hvr'><p>" + recordData.VISITS[i].COMMENT[0].VALUE + "</p></div>";
					$(cmntP).text(eventResValue);
					var tempCmnt = $(cmntP).parent().html() + "" + commentHoverdata;
					$(cmntP).parent().html(tempCmnt);
				}

				if (this.getAntepartumNote().length > 0) {
					var commentHover = Util.Style.g("pv-wf-cmnt-hover",
					visitCardDivs[i], "DIV")[0];
					var cmntHover = function commentHvr(hvrDiv) {
						var commentP = $(visitCardDivs[i]).find('p');
						$(commentP).mouseenter(function(evt) {
							$(this).addClass('pv-wf-hover-highlight');
							component.pregHMO(evt, hvrDiv);
						});
						$(commentP).mouseleave(function(evt) {
							$(this).removeClass('pv-wf-hover-highlight');
							component.pregCmntHoverMouseTerminated(evt, hvrDiv);
						});
						$(commentP).mousemove(function(evt) {
							component.pregHoverMouseMovement(evt, hvrDiv);
						});
					};

					if (commentHover) {
						cmntHover(commentHover);
					}
				}
			}

			// allow scrolling of navigation bar
			$('#' + navBarID).serialScroll({
				target : '#' + navItemListID,
				items : 'li',
				prev : 'div.pv-wf-preg-navigationbar.pv-wf-preg-nav-left',
				next : 'div.pv-wf-preg-navigationbar.pv-wf-preg-nav-right',
				axis : 'xy',
				duration : 300,
				force : true,
				cycle : false,
				step : 8,
				onBefore : function(e, elem, $pane, $items, pos) {
					e.preventDefault();
					if (this.blur) {
						this.blur();
					}
				},
				onAfter : function(elem) {
				}

			});

			var navigationClicks = function navClick(toCard) {
				$(navLinks[i]).click(function() {
					$(rootNode).find('div.pv-wf-selected').removeClass('pv-wf-selected');
					$(rootNode).find('li.pv-wf-selected').removeClass('pv-wf-selected');
					$(rootNode).find(toCard).addClass('pv-wf-selected');
					$(rootNode).find(this).addClass('pv-wf-selected');
					$target = $(toCard);
					visitCardPane.stop().scrollTo($target, 500);
				});
			};
			// link navigation dates and cards
			navigationClicks(newVisitCard[0]);
			$("#navBarNewVisit" + compId).click(function() {
				$(rootNode).find('div.pv-wf-selected').removeClass('pv-wf-selected');
				$(rootNode).find('li.pv-wf-selected').removeClass('pv-wf-selected');
				$(rootNode).find(newVisitCard[0]).addClass('pv-wf-selected');
				$(rootNode).find(this).addClass('pv-wf-selected');
				$target = $(newVisitCard[0]);
				visitCardPane.stop().scrollTo($target, 500);
			});
			for ( i = 1, len = navLinks.length; i < len; i++) {
				navigationClicks(visitCards[i - 1]);
			}

			$(rootNode).find(visitCards[0]).addClass('pv-wf-selected');
			$(rootNode).find(navLinks[1]).addClass('pv-wf-selected');
			visitCardPane.stop().scrollTo($(newVisitCard[0]), 500);

			for ( i = 0; i < visitCards.length; i++) {
				$(rootNode).find(visitCards[i]).addClass('pv-wf-unselected');
			}
			this.editListener(visitCards.length, visitCardsObj);
			this.m_visitCardsObjects = visitCardsObj;
			this.m_visitCardsObjectsLength = visitCards.length;
			$('#visitCard_newCard_' + compId).hide();
			$("#navBarNewVisit" + compId).hide();

			component.attachDeleteListener();

		}
		component.resizeComponent();

		// Clear the data stored to chart clinical event results upon rendering the component.
		this.clearChartingData();
	}
	catch(err) {
		MP_Util.LogJSError(err, this, "prenatal-visits-o2.js", "renderComponent");
	}
};

/**
 * Listens to edit button clicks and pops up a direct entry panel.
 *
 * @param len {integer} - number of visits
 *
 * @param visitCardsObj {object} - An object containing all the visit cards (an array visits )
 */
PrenatalVisitsComponentWF.prototype.editListener = function(len, visitCardsObj) {
	var component = this;
	var compId = this.getComponentId();
	var navBarID = "pregNav" + compId;
	var navigationList = $('#' + navBarID).find('li');

	for (var i = 0; i < len; i++) {
		$('#editCard_' + i + "_" + compId).off();
		$('#editCard_' + i + "_" + compId).click(function() {
			if (component.m_chartEnabled) {
				var id = $(this).attr('id');
				var cardNumber = id.split("_")[1];
				var origHTML = $("#visitCard_" + cardNumber + "_" + compId).html();
				var editCardIdObj = $("#visitCard_" + cardNumber + "_" + compId);
				editCardIdObj.removeClass("pv-wf-preg-visit-card").addClass("pv-wf-preg-visit-card-on-edit");
				editCardIdObj.removeClass("pv-wf-unselected").addClass("pv-wf-selected");

				editCardIdObj = $("#visitCard_newCard_" + compId);
				editCardIdObj.removeClass("pv-wf-preg-visit-card-new-visit").addClass("pv-wf-preg-visit-card-on-edit-other");
				// change the style for other cards
				for ( k = 0; k < len; k++) {
					if (k != cardNumber) {
						editCardIdObj = $("#visitCard_" + k + "_" + compId);
						editCardIdObj.removeClass("pv-wf-preg-visit-card").addClass("pv-wf-preg-visit-card-on-edit-other");
						// hide edit button for other cards
						$('#editCard_' + k + "_" + compId).hide();
						editCardIdObj.removeClass("pv-wf-selected").addClass("pv-wf-unselected");
					}
				}
				component.createEditPane(cardNumber, origHTML, len, visitCardsObj);
				component.disableSign();
				// Add a new fetus rowon clicking add fetus button
				component.addFetusListener(visitCardsObj[cardNumber], 0);
				component.attachListener(visitCardsObj[cardNumber]);
				var visitNavId = 'navVisit_' + cardNumber + '_' + compId;

				var rootNode = component.getRootComponentNode();
				$(rootNode).find('li.pv-wf-selected').removeClass('pv-wf-selected');
				$('#' + visitNavId).removeClass('pv-wf-unselected').addClass('pv-wf-selected');

			}
		});
	}

};

/**
 * Builds the visit card data for new visit direct entry panel.
 *
 * @param card {object} - an object of visit card instance.
 *
 * @param visitObj {object} - A visit object.
 */
PrenatalVisitsComponentWF.prototype.buildCard = function(card, visitObj) {
	var prenatalVisitsi18n = i18n.discernabu.prenatal_visits_o2;
	var eventResValue = "";
	var missingVal = "--";
	if (visitObj.EGA.length > 0) {
		visitObj.EGA.sort(this.resultDateSort);
		if (visitObj.EGA[0].VALUE) {
			eventResValue = visitObj.EGA[0].VALUE;
		}
		else {
			var egaWeeks = (visitObj.EGA[0].WEEKS === "") ? "0" : visitObj.EGA[0].WEEKS;
			var egaDays = (visitObj.EGA[0].DAYS === "") ? "0" : visitObj.EGA[0].DAYS;
			eventResValue = egaWeeks + "<span class='pv-wf-ega-lbl'>" + prenatalVisitsi18n.WEEK_ABBV + "</span>" + egaDays + "<span class='pv-wf-ega-lbl'>" + prenatalVisitsi18n.DAY_ABBV + "</span>";
		}
	}
	else {
		eventResValue = missingVal;
	}
	card.ega = eventResValue;

	if (visitObj.FUNDAL_HEIGHT.length > 0) {
		visitObj.FUNDAL_HEIGHT.sort(this.resultDateSort);
		if (visitObj.FUNDAL_HEIGHT[0].VALUE) {
			eventResValue = visitObj.FUNDAL_HEIGHT[0].VALUE;
			eventResUnit = visitObj.FUNDAL_HEIGHT[0].UNITS;
			card.fundalHeightUnit = eventResUnit;
		}
	}
	else {
		eventResValue = missingVal;
	}

	card.fundalHeight = eventResValue;

	eventResValue = "";
	eventResUnit = "";
	if (visitObj.PRETERM_SIGNS.length > 0) {
		visitObj.PRETERM_SIGNS.sort(this.resultDateSort);
		if (visitObj.PRETERM_SIGNS[0].VALUE) {
			eventResValue = visitObj.PRETERM_SIGNS[0].VALUE;
		}
	}
	else {
		eventResValue = missingVal;
	}
	card.pretermSigns = eventResValue;

	if (visitObj.CERVICAL_DIL.length > 0) {
		visitObj.CERVICAL_DIL.sort(this.resultDateSort);
		if (visitObj.CERVICAL_DIL[0].VALUE) {
			eventResValue = visitObj.CERVICAL_DIL[0].VALUE;
		}
	}
	else {
		eventResValue = missingVal;
	}
	card.dilation = eventResValue;

	eventResValue = "";
	if (visitObj.CERVICAL_EFF.length > 0) {
		visitObj.CERVICAL_EFF.sort(this.resultDateSort);
		if (visitObj.CERVICAL_EFF[0].VALUE) {
			eventResValue = visitObj.CERVICAL_EFF[0].VALUE;
		}
	}
	else {
		eventResValue = missingVal;
	}
	card.effacement = eventResValue;

	eventResValue = "";
	if (visitObj.CERVICAL_STAT.length > 0) {
		visitObj.CERVICAL_STAT.sort(this.resultDateSort);
		if (visitObj.CERVICAL_STAT[0].VALUE) {
			eventResValue = visitObj.CERVICAL_STAT[0].VALUE;
		}
	}
	else {
		eventResValue = missingVal;
	}
	card.station = eventResValue;

	// Blood Pressure
	if (visitObj.BP.length > 0) {
		visitObj.BP.sort(this.resultDateSort);
		if (visitObj.BP[0].SYS_VALUE) {
			eventResValue = visitObj.BP[0].SYS_VALUE;
		}

		if (visitObj.BP[0].DIA_VALUE) {
			eventResValue2 = visitObj.BP[0].DIA_VALUE;
		}
	}
	else {
		eventResValue = missingVal;
		eventResValue2 = missingVal;
	}
	card.systolic = eventResValue;
	card.diastolic = eventResValue2;

	if (visitObj.WEIGHT.length > 0) {
		visitObj.WEIGHT.sort(this.resultDateSort);
		if (visitObj.WEIGHT[0].VALUE) {
			eventResValue = visitObj.WEIGHT[0].VALUE;
			eventResUnit = visitObj.WEIGHT[0].UNITS;
		}
	}
	else {
		eventResValue = missingVal;
	}
	card.weight = eventResValue;

	if (visitObj.WEIGHT_CHG.length > 0) {
		visitObj.WEIGHT_CHG.sort(this.resultDateSort);
		if (visitObj.WEIGHT_CHG[0].VALUE) {
			eventResValue = visitObj.WEIGHT_CHG[0].VALUE;
		}
	}
	else {
		eventResValue = missingVal;
	}

	if (visitObj.EDEMA.length > 0) {
		visitObj.EDEMA.sort(this.resultDateSort);
		if (visitObj.EDEMA[0].VALUE) {
			eventResValue = visitObj.EDEMA[0].VALUE;
		}
	}
	else {
		eventResValue = missingVal;
	}
	card.edema = eventResValue;

	if (visitObj.URINE_PROTEIN.length > 0) {
		visitObj.URINE_PROTEIN.sort(this.resultDateSort);
		if (visitObj.URINE_PROTEIN[0].VALUE) {
			eventResValue = visitObj.URINE_PROTEIN[0].VALUE;
		}
	}
	else {
		eventResValue = missingVal;
	}
	card.protein = eventResValue;

	if (visitObj.URINE_GLUCOSE.length > 0) {
		visitObj.URINE_GLUCOSE.sort(this.resultDateSort);
		if (visitObj.URINE_GLUCOSE[0].VALUE) {
			eventResValue = visitObj.URINE_GLUCOSE[0].VALUE;
		}
	}
	else {
		eventResValue = missingVal;
	}
	card.glucose = eventResValue;

	if (visitObj.URINE_KETONES.length > 0) {
		visitObj.URINE_KETONES.sort(this.resultDateSort);
		if (visitObj.URINE_KETONES[0].VALUE) {
			eventResValue = visitObj.URINE_KETONES[0].VALUE;
		}
	}
	else {
		eventResValue = missingVal;
	}
	card.ketones = eventResValue;

	if (visitObj.COMMENT.length > 0) {
		visitObj.COMMENT.sort(this.resultDateSort);

		eventResValue = visitObj.COMMENT[0].VALUE;
	}
	else {
		eventResValue = missingVal;
	}
	card.comments = eventResValue;

	if (visitObj.NEXT_APPT.length > 0) {
		visitObj.NEXT_APPT.sort(this.resultDateSort);
		if (visitObj.NEXT_APPT[0].VALUE) {
			eventResValue = visitObj.NEXT_APPT[0].VALUE;
			eventResUnit = visitObj.NEXT_APPT[0].UNITS;
		}
	}
	else {
		eventResValue = missingVal;
	}
	card.nextAppt = eventResValue;

};

/**
 * Constructs and pops up a direct entry panel upon clicking add visit control.
 *
 * @param len {integer} - number of visits
 *
 * @param visitCardsObj {object} - An object containing all the visit cards (an array visits )
 *
 * @param newVisitObj {object} - A new visit object
 */
PrenatalVisitsComponentWF.prototype.buildNewVisitEntryCard = function(len, visitCardsObj, newVisitObj) {
	var component = this;
	var compId = this.getComponentId();
	var newCard = new this.visitCardInstance();
	var criterion = this.getCriterion();
	newCard.encntrId = criterion.encntr_id;
	var recordData = this.getRecordData();
	if (this.m_recordDataTodayExists) {
		this.buildCard(newCard, component.m_recordDataToday.VISITS[0]);
	}

	var editCardIdObj = $("#visitCard_newCard_" + compId);
	editCardIdObj.removeClass("pv-wf-preg-visit-card-new-visit").addClass("pv-wf-preg-visit-card-on-edit");
	editCardIdObj.removeClass("pv-wf-unselected").addClass("pv-wf-selected");

	if (this.m_recordDataExists) {
		editCardIdObj.html(this.buildEditPane(0, newCard));
	}
	else {
		var navBarID = "";
		var navItemListID = "";
		var visitCardID = "pregCards" + compId;
		var navHTML = "<div id='" + navBarID + "' class='pv-wf-preg-nav-bar'><div class=' pv-wf-preg-navigationbar pv-wf-preg-nav-left'></div><ol id='" + navItemListID + "'></ol></div>";
		var newCardHTML = "<div class='content-body'><div class='pv-wf-prenatal-visits-content'><div class='pv-wf-selected pv-wf-preg-visit-card-on-edit' id = 'visitCard_newCard_" + compId + "'>" + this.buildEditPane(0, newCard) + "</div></div></div>";
		component.finalizeComponent(newCardHTML, "");
	}

	$('#cancel_' + compId).click(function() {
		component.retrieveComponentData();
	});

	component.postProcessAddingTextBoxes(newCard, true, true);
	$(("#" + newCard.firstTextBoxEnabled)).focus();
	component.limitCommentLength(newCard);

	$('#sign_' + compId).click(function() {
		// Chart the results for a particular Card/Encounter.
		// Allow user to click "Sign" button image only once per charting.
		if (!component.m_signResults && !component.isSignButtonClicked) {
			component.m_signResults = true;
			component.chartResults(newCard);
		}
	});

	component.addFetusListener(newCard, 0);
	component.attachListener(newCard);
	component.disableSign();
	return newCard;
};

/**
 * Initializes all the Prenatal Visit event DTAs.
 */
PrenatalVisitsComponentWF.prototype.initializeDTAs = function() {
	var component = this;
	var eventIds = this.eventIdPrefix;

	component.pvDTAs[eventIds.FUNDAL_HEIGHT] = this.m_dtaResults.FUNDAL_HEIGHT_REC_DTA;
	component.pvDTAs[eventIds.PRETERM_SIGNS] = this.m_dtaResults.PRETERM_SIGNS_REC_DTA;
	component.pvDTAs[eventIds.CERVICAL_DILATION] = this.m_dtaResults.CERVICAL_DIL_REC_DTA;
	component.pvDTAs[eventIds.CERVICAL_EFFACAEMENT] = this.m_dtaResults.CERVICAL_EFF_REC_DTA;
	component.pvDTAs[eventIds.CERVICAL_STATION] = this.m_dtaResults.CERVICAL_STAT_REC_DTA;
	component.pvDTAs[eventIds.SYSTOLIC] = this.m_dtaResults.SYS_BP_REC_DTA;
	component.pvDTAs[eventIds.DIASTOLIC] = this.m_dtaResults.DIA_BP_REC_DTA;
	component.pvDTAs[eventIds.WEIGHT] = this.m_dtaResults.WEIGHT_REC_DTA;
	component.pvDTAs[eventIds.EDEMA] = this.m_dtaResults.EDEMA_REC_DTA;
	component.pvDTAs[eventIds.PROTEIN] = this.m_dtaResults.URINE_PROTEIN_REC_DTA;
	component.pvDTAs[eventIds.GLUCOSE] = this.m_dtaResults.URINE_GLUCOSE_REC_DTA;
	component.pvDTAs[eventIds.KETONES] = this.m_dtaResults.URINE_KETONES_REC_DTA;
	component.pvDTAs[eventIds.FETAL_PRESENTATION] = this.m_dtaResults.FETAL_PRES_REC_DTA;
	component.pvDTAs[eventIds.FETAL_MOVEMENT] = this.m_dtaResults.FETAL_MOVE_REC_DTA;
	component.pvDTAs[eventIds.FETAL_HEART_RATE] = this.m_dtaResults.FHR_REC_DTA;
	component.pvDTAs[eventIds.FETAL_LIE] = this.m_dtaResults.FETAL_LIE_REC_DTA;
	component.pvDTAs[eventIds.COMMENTS] = this.m_dtaResults.COMMENT_REC_DTA;
	component.pvDTAs[eventIds.NXT_APPTMENT] = this.m_dtaResults.NEXT_APPT_REC_DTA;
};

/**
 * Clears the data/details stored to chart clinical event results.
 */
PrenatalVisitsComponentWF.prototype.clearChartingData = function() {
	//Initialize to empty array as there wont be nothing chart upon
	// successfull signing or clicking "Cancel" button.
	this.pvEventsToChart = [];

	// Make "Sign" button available (Chart Results) to chart the results.
	this.m_signResults = false;

	// Initialize dynamic label has inactivated info to false.
	this.m_dynamicLabelInactivated = false;

	// Clear the list of newly selected dynamic labels
	this.selectedDynamicBabyLabels = [];
};

/**
 * This function performs a case sensitive search and replace.
 *
 * @param origStr {string} - The original string to be searched.
 *
 * @param find {string} - The textual string to search for.
 *
 * @param replace {string} - The textual string to replace the search string.
 */
PrenatalVisitsComponentWF.prototype.replaceAll = function(origStr, find, replace) {
	var escapeRegExp = function escapeRegularExpression(string) {
		return string.replace(/([.*+?\^=!:${}()|\[\]\/\\])/g, "\\$1");
	};

	return origStr.replace(new RegExp(escapeRegExp(find), 'g'), replace);
};

/**
 * Chart the results for a particular Card/Encounter.
 *
 * @param card {object} - current selected visit card instance
 */
PrenatalVisitsComponentWF.prototype.chartResults = function(card) {
	var component = this;
	var pvi18n = i18n.discernabu.prenatal_visits_o2;
	var scriptExecution = false;
	try {
		var rootNode = this.getRootComponentNode();
		var criterion = this.getCriterion();
		var encntr = card.encntrId;
		var dateString = card.visitDateDisplay;
		var dateStringUTC = "";
		var date = new Date();
		if (dateString !== "") {
			date.setISO8601(dateString);
			dateString = date.format("dd-mmm-yyyy HH:MM");
			var curDate = new Date();
			dateString = date.format("dd-mmm-yyyy");

			dateStringUTC = dateString + " " + curDate.getUTCHours();
			dateStringUTC += ":" + curDate.getUTCMinutes();

			dateString += " " + curDate.getHours();
			dateString += ":" + curDate.getMinutes();

		}
		var eventData = [];
		var eventIds = this.eventIdPrefix;
		var resultExists = false;

		// Used to send as blob parameters to the PRG which conatins the edited results info
		var clinicalResultJSON = '{"ACR_PARAMS":{"RESULTS":[';

		// Contains DTA information of all the events mapped in bedrock
		var dtaResults = null;

		// RecordData - Contains the results/data of this component
		var recordData = this.getRecordData();
		var sendAr = [];
		var sendArAddVisit = [];

		var scriptRequest = new ComponentScriptRequest();
		var encntrId = component.getCriterion().encntr_id;

		// This function returns the event details array object which can be used to chart
		// the data for patient.
		var getEventData = function generateEventData(eventId) {
			var eventCharted = eventId.split("_")[0];
			var dtaResults = component.pvDTAs[eventCharted][0];
			var unitsCd = 0;
			var labelId = 0;
			var refRangeId = 0.0;
			var isEventChartable = false;
			var value = "";

			if (dtaResults.REF_RANGE_FACTOR.length > 0) {
				refRangeId = dtaResults.REF_RANGE_FACTOR[0].REFERENCE_RANGE_ID;
				unitsCd = dtaResults.REF_RANGE_FACTOR[0].UNITS_CD;
			}

			if (dtaResults.EVENT_CODE_TYPE === "NUMERIC") {
				value = component.pvEventsToChart[eventId].VALUE;
				isEventChartable = isNumericEventChartable(value);
			}
			else if (dtaResults.EVENT_CODE_TYPE === "MULTI") {
				isEventChartable = isAlphaEventChartable(eventId);
			}
			else if (dtaResults.EVENT_CODE_TYPE === "ALPHA") {
				isEventChartable = isAlphaEventChartable(eventId);
			}
			else if (dtaResults.EVENT_CODE_TYPE === "MULTIALPHAANDFREETEXT") {
				isEventChartable = isMultiAlphaFreeTextEventChartable(value, eventId);
			}
			else if (dtaResults.EVENT_CODE_TYPE === "FREETEXT") {
				value = component.pvEventsToChart[eventId].VALUE;
				isEventChartable = isTextEventChartable(value);
			}

			switch(eventCharted) {
				case eventIds.FETAL_PRESENTATION:
				case eventIds.FETAL_MOVEMENT:
				case eventIds.FETAL_HEART_RATE:
				case eventIds.FETAL_LIE:
					var fetusNumber = eventSelected.split("_")[1];
					var fetusId = parseInt(fetusNumber, 10);
					var babyNumber = eventSelected.split("_")[2];
					var babyIndex = parseInt(babyNumber, 10);
					if (isNaN(fetusId) || isNaN(babyIndex)) {
						return false;
					}

					babyCnt = card.babyLabelIds.length;

					if (babyIndex < babyCnt) {
						labelId = card.babyLabelIds[babyIndex];
					}
					else {
						var newBabyIndex = babyIndex - babyCnt;
						labelId = parseInt("" + card.babyLabelObjects[newBabyIndex].NOMENCLATURE_ID + fetusId, 10);
					}
					break;
			}

			// Replace all escape (\) and double quotes (") string to create a valid JSON object.
			value = component.replaceAll(value, "\\", "\\\\");
			value = component.replaceAll(value, '"', '\\\"');

			eventData = {
				CODE_TYPE : dtaResults.EVENT_CODE_TYPE,
				EVENT_CD : dtaResults.EVENT_CD,
				TASK_ASSAY_CD : dtaResults.TASK_ASSAY_CD,
				UNITS_CD : unitsCd,
				VALUE : value,
				REF_RANGE_ID : refRangeId,
				LABEL_ID : labelId
			};

			return isEventChartable;
		};

		var isNumericEventChartable = function checkNumericEventChartable(value) {
			return value && !isNaN(value);
		};

		var isTextEventChartable = function checkTextEventChartable(value) {
			if (value) {
				return true;
			}
			return false;
		};

		var isAlphaEventChartable = function checkAlphaEventChartable(eventId) {
			if (component.pvEventsToChart[eventId].length > 0 && component.pvEventsToChart[eventId][0].NOMENCLATURE_ID > 0) {
				return true;
			}
			return false;
		};

		var isMultiAlphaFreeTextEventChartable = function checkMultiAlphaFreeTextEventChartable(value, eventId) {
			if (component.pvEventsToChart[eventId].length > 0 && component.pvEventsToChart[eventId][0].NOMENCLATURE_ID > 0) {
				return true;
			}
			else if (value) {
				return true;
			}
			return false;
		};

		// Iterate for each selected events of type Multi and Multi Alpha Free Text
		// in prenatal visits to get the respective nomenclature ids.
		var eventSelected = [];
		var pvEventsToChartData = null;

		// Build JSON for Prenatal Visits event
		for (eventSelected in component.pvEventsToChart) {
			if (component.pvEventsToChart.hasOwnProperty(eventSelected)) {
				var eventCharted = eventSelected.split("_")[0];
				if (component.pvDTAs[eventCharted] && component.pvDTAs[eventCharted].length > 0) {
					if (component.pvEventsToChart[eventSelected].VALUE || component.pvEventsToChart[eventSelected].length > 0) {
						if (getEventData(eventSelected)) {
							clinicalResultJSON += this.createClinicalResultsJSON(eventData, eventSelected) + ",";
							resultExists = true;
						}
					}
				}
			}
		}

		clinicalResultJSON += "]}}";
		clinicalResultJSON = clinicalResultJSON.replace(",]}}", "]}}");

		var validNomenclatureIdFound = 0;

		if (card.babyLabelObjects.length > 0) {
			var dynamicLabelData = card.babyLabelObjects;
			for ( i = 0; i < dynamicLabelData.length; i++) {
				if (dynamicLabelData[i].NOMENCLATURE_ID > 0) {
					dynamicLabelData[i].CONTAINS_VALID_RESULT = true;
					validNomenclatureIdFound = 1;
					resultExists = true;
				}
				else {
					dynamicLabelData[i].CONTAINS_VALID_RESULT = false;
				}
			}
		}

		if (resultExists) {
			var slaTimer = MP_Util.CreateTimer("CAP:MPG.PRENATALVISITS.O2-SIGNDIRECTENTRY");
			if (slaTimer) {
				slaTimer.SubtimerName = criterion.category_mean;
				slaTimer.Stop();
			}

			/* Sign request to chart the data */
			scriptRequest = new ComponentScriptRequest();
			sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", encntr + ".0", criterion.ppr_cd + ".0", "^" + dateString + "^", "^" + dateStringUTC + "^");
			prgName = "";

			if (validNomenclatureIdFound) {
				var dynamicLabelJSON = this.createDynamicResultsJSON(card.babyLabelObjects);
				prgName = "MP_PREG_ADD_DYNAMIC_LABEL";
				sendAr.push("^" + dynamicLabelJSON + "^");
			}
			else {
				prgName = "MP_PREG_ADD_CLINICAL_RESULTS";
			}

			scriptExecution = true;
			scriptRequest.setProgramName(prgName);
			scriptRequest.setParameterArray(sendAr);
			scriptRequest.setAsyncIndicator(true);
			scriptRequest.setDataBlob(clinicalResultJSON);
			scriptRequest.setComponent(this);
			scriptRequest.performRequest();
			scriptRequest.setResponseHandler(function(scriptReply) {
				if (scriptReply.getStatus() === "F") {
					component.generateModalDialog(pvi18n.CHART_FAILURE, pvi18n.ERROR_OCCURED, "error");
					// Error object which will be used to log customized error.
					var discernError = new Error(pvi18n.CHART_FAILURE);
					MP_Util.LogJSError(discernError, component, "prenatal-visits-o2.js", "chartResults");
					component.m_signResults = false;
				}
				else {
					component.m_signResults = false;
					component.retrieveComponentData();
				}
				return;
			});
		}
	}
	catch(err) {
		// Make "Sign" button available to chart if any expception occurs - To re-try charting the results.
		this.m_signResults = false;
		this.generateModalDialog(pvi18n.CHART_FAILURE, pvi18n.ERROR_OCCURED, "error");
		MP_Util.LogJSError(err, component, "prenatal-visits-o2.js", "chartResults");
	}
	finally {
		this.m_signResults = scriptExecution ? this.m_signResults : false;
	}
};

/**
 * Creates the dynamic label JSON based on the event type and other details.
 *
 * @param dynamicLabelData {Array} - Contains the event details which will be used to chart the data for patient.
 */
PrenatalVisitsComponentWF.prototype.createDynamicResultsJSON = function(dynamicLabelData) {
	// Used to send as blob parameters to the PRG which conatins the edited results info
	var dynamicLabelJSON = '{"ADL_PARAMS":{"RESULTS":[';
	var nomenclatureJSON = '';
	var validNomenclatureIdFound = 0;

	dynamicLabelJSON += '{"Label_Template_Id":' + dynamicLabelData[0].LABEL_TEMPLATE_ID + '.0,"Event_Cd":' + dynamicLabelData[0].EVENT_CD + '.0,';
	dynamicLabelJSON += '"Task_Assay_Cd":' + dynamicLabelData[0].TASK_ASSAY_CD + '.0,"Units_Cd":' + '0.0';

	for ( i = 0; i < dynamicLabelData.length; i++) {
		nomenclatureJSON += i === 0 ? ',"NOMENCLATURE_IDS":[' : '';

		if (dynamicLabelData[i].CONTAINS_VALID_RESULT) {
			nomenclatureJSON += '{"NOMENCLATURE_ID":' + dynamicLabelData[i].NOMENCLATURE_ID + '.0,';
			nomenclatureJSON += '"FETUS_ID":' + dynamicLabelData[i].FETUS_ID + '},';
		}
	}
	dynamicLabelJSON += nomenclatureJSON + ']}]}}';

	dynamicLabelJSON = dynamicLabelJSON.replace(",]}]}}", "]}]}}");

	return dynamicLabelJSON;
};

/**
 * Creates the clinical results JSON based on the event type and other details.
 *
 * @param eventData {Array} - Contains the event details which will be used to chart the data for patient.
 */
PrenatalVisitsComponentWF.prototype.createClinicalResultsJSON = function(eventData, eventIdPrefix) {
	var eventJSON = '';
	var nomenclatureJSON = '';
	var pvEventsToChartData = null;
	var validNomenclatureIdFound = 0;

	eventJSON = '{"Event_Code_Type":"' + eventData.CODE_TYPE + '","Event_Cd":' + eventData.EVENT_CD + '.0';
	eventJSON += ',"Task_Assay_Cd":' + eventData.TASK_ASSAY_CD + '.0,"Units_Cd":' + eventData.UNITS_CD + '.0';
	eventJSON += ',"Value":"' + eventData.VALUE + '","Ref_Range_Id":' + eventData.REF_RANGE_ID + '.0';
	eventJSON += ',"Label_Id":' + eventData.LABEL_ID + '.0';

	// Add the nomenclature ids only for the evnts (Multi and Multi Alpha Free Text) which conatins such.
	if (this.pvEventsToChart.hasOwnProperty(eventIdPrefix)) {
		nomenclatureJSON += ',"NOMENCLATURE_IDS":[';

		for (var i = 0; i < this.pvEventsToChart[eventIdPrefix].length; i++) {
			pvEventsToChartData = this.pvEventsToChart[eventIdPrefix][i];

			if (i === 0) {
				if (pvEventsToChartData.NOMENCLATURE_ID > 0) {
					validNomenclatureIdFound = 1;
				}
			}
			else {
				nomenclatureJSON += ',';
			}
			nomenclatureJSON += '{"NOMENCLATURE_ID":' + pvEventsToChartData.NOMENCLATURE_ID + '.0}';
		}

		nomenclatureJSON += ']';
	}

	// Add the nomenclature Ids JSON only if we find the valid nomenclature id.
	if (validNomenclatureIdFound) {
		eventJSON += nomenclatureJSON + '}';
	}
	else if (eventData.VALUE) {
		eventJSON += '}';
	}
	else {
		eventJSON = "";
	}

	return eventJSON;
};

/**
 * Registers the fetus events for
 *
 * 1. Click event to the "Add Fetus" link.
 * 2. Click event for inactivate fetus (close icon for existing babies) link.
 * 3. Attachs click event for reactivate dynamic baby labels.
 *
 * @param card {object} - current selected visit card instance.
 *
 * @param view {integer} - indicates if the selected view is card or table.
 */
PrenatalVisitsComponentWF.prototype.addFetusListener = function(card, view) {
	var component = this;
	var criterion = component.getCriterion();
	var sendAr = [];
	var compId = this.getComponentId();
	var isAddFetusEnabled = component.m_addFetusEnabled;
	var pvi18n = i18n.discernabu.prenatal_visits_o2;
	var componentContent = $(this.getSectionContentNode());
	var fetalSection = "";
	var addFetusId = "";
	var isFetalLiePresent = (this.getFetalLie().length > 0) ? true : false;
	var prenatalVisitsi18n = i18n.discernabu.prenatal_visits_o2;
	var recordData = null;
	var visitCount = 0;

	if (component.m_recordDataExists) {
		recordData = this.getRecordData();
		visitCount = recordData.VISITS.length;
	}

	// Unbind the events
	componentContent.off("click", '#addFetus' + compId);

	// 1. Click event to the "Add Fetus" link.
	componentContent.on("click", '#addFetus' + compId, function() {
		if (isAddFetusEnabled) {
			var showBabyLabelOptions = function getBabyLabelOptions() {
				fetalSection = component.generateBabyLabelOptions(card, view);
				$("#fetalInfo" + compId).append(fetalSection);
				if (view == 1) {
					if (card.numberOfBabies === 0) {

						$("#fetalColumn_" + card.cardNumber + "_" + compId).html("");
						$("#fetalColumn_" + card.cardNumber + "_" + compId).html(fetalSection);
					}
					else {

						$("#fetalColumn_" + card.cardNumber + "_" + compId).append(fetalSection);

						var emptyFetalSection = "";
						var emptyVal = "--";
						var addBabyLink = "<div class='pv-wf-baby-label-tb pv-wf-temp-backgrndclr'></div>";

						emptyFetalSection += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-header'></div>";
						emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-white pv-wf-baby-label-tb-theme-font'>" + emptyVal + "</div>";
						emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + emptyVal + "</div>";
						emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-white pv-wf-baby-label-tb-theme-font'>" + emptyVal + "</div>";

						if (isFetalLiePresent) {
							emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + emptyVal + "</div>";
						}
						for (var i = 0; i < visitCount; i++) {
							if (i != card.cardNumber) {
								emptyFetalSection = "<div id='emptyRows_" + card.newBabyLabelIndex + "_" + i + "_" + compId + "'>";
								emptyFetalSection += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-header'></div>";
								emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-white pv-wf-baby-label-tb-theme-font'>" + emptyVal + "</div>";
								emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + emptyVal + "</div>";
								emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-white pv-wf-baby-label-tb-theme-font'>" + emptyVal + "</div>";
								if (isFetalLiePresent) {
									emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + emptyVal + "</div>";
								}
								emptyFetalSection += "<div>";
								$("#fetalColumn_" + i + "_" + compId).append(emptyFetalSection);
							}
						}

						var label = "<div id='emptyLabels_" + card.newBabyLabelIndex + "_" + compId + "'><div class='pv-wf-baby-label-tb-empty-label pv-wf-baby-label-tb-header'></div>";
						label += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-white pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.FPRESENT + "</div>";
						label += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.FHR + "</div>";
						label += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-white pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.FMOVE + "</div>";

						if (isFetalLiePresent) {
							label += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + prenatalVisitsi18n.FLIE + "</div>";
						}
						label += "</div>";
						$("#fetalRowLabel_" + compId).append(label);
					}

				}

				component.postProcessAddingTextBoxes(card, true, false);
				component.addNewBabyListner(card, view);
			};

			if (component.m_dynamicBabyLabels === null) {
				var cardTemplateId = card.templateId === undefined ? "0" : card.templateId;
				// Create the parameter array
				sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", card.encntrId + ".0", criterion.ppr_cd + ".0", cardTemplateId + ".0", "^" + component.m_patientGenderInfo + "^", "^" + component.m_dob + "^", component.m_currentGestAge);

				var scriptRequest = new ComponentScriptRequest();
				scriptRequest.setProgramName("MP_PREG_GET_DYNAMIC_LABEL");
				scriptRequest.setParameterArray(sendAr);
				scriptRequest.setComponent(component);
				scriptRequest.setAsyncIndicator(true);
				scriptRequest.performRequest();

				scriptRequest.setResponseHandler(function(scriptReply) {
					if (scriptReply.getStatus() === "S") {
						component.m_dynamicBabyLabels = scriptReply.getResponse();
						showBabyLabelOptions();
					}
					else {
						component.generateModalDialog(pvi18n.ADD_FETUS_ERROR, pvi18n.ERROR_OCCURED, "error");
						// Error object which will be used to log customized error.
						var discernError = new Error(pvi18n.ADD_FETUS_ERROR);
						MP_Util.LogJSError(discernError, component, "prenatal-visits-o2.js", "addFetusListener");
					}
				});
			}
			else {
				showBabyLabelOptions();
			}
		}
	});

	// Unbind the events
	componentContent.off("click", '.pv-wf-inactivate-indicator');

	// 2. Click event for inactivate fetus (close icon for existing babies) link.
	componentContent.on("click", '.pv-wf-inactivate-indicator', function() {
		var selectedId = $(this).attr('id');
		var babyNumber = selectedId.split("_")[1];
		var fetusId = babyNumber + "_" + compId;

		var fetalSectionObj = $("#fetalSection_" + fetusId);
		var inactivateBabyObj = $("#inactivateBaby_" + fetusId);

		// If inactivate UI is already add to a dynamic label, utilize it to show/hide.
		fetalSectionObj.hide();

		if (inactivateBabyObj.length) {
			inactivateBabyObj.show();
		}
		else {
			// Hide the fetal section details for the selected baby i.e., upon click of remove icon
			// for a dynamic label in UI.
			$("#fetalSectionDiv_" + fetusId).append(component.generateActivateInactiveBabyLabelHTML(card, babyNumber, false, 0));

			// On click of cancel restore the fetal section data to show its details.
			var cancelInactivateObj = $("#cancelInactivate_" + fetusId);
			var inactivateButtonObj = $("#inactivate_" + fetusId);

			cancelInactivateObj.click(function() {
				$("#inactivateBaby_" + fetusId).hide();
				fetalSectionObj.show();
			});

			inactivateButtonObj.click(function() {
				// On click of inactivate button, inactivate the dynamic label.
				component.activateInactivateDynamicLabel(card, "fetalSectionDiv_" + fetusId, babyNumber, card.babyLabelIds[babyNumber], false, 0);

			});
		}
	});

	componentContent.off("click", '.pv-wf-inactivate-indicator-tb');

	// 2. Click event for inactivate fetus (close icon for existing babies) link.
	componentContent.on("click", '.pv-wf-inactivate-indicator-tb', function() {
		var selectedId = $(this).attr('id');
		var babyNumber = selectedId.split("_")[1];
		var fetusId = babyNumber + "_" + compId;

		var fetalSectionObj = $("#fetalSection_" + fetusId);
		var inactivateBabyObj = $("#inactivateBaby_" + fetusId);

		// If inactivate UI is already add to a dynamic label, utilize it to show/hide.
		fetalSectionObj.hide();

		if (inactivateBabyObj.length) {
			inactivateBabyObj.show();
		}
		else {
			// Hide the fetal section details for the selected baby i.e., upon click of remove icon
			// for a dynamic label in UI.

			$("#fetalDataSectionDiv_" + fetusId).hide();
			var origFetalDivHtml = $("#fetalSectionDiv_" + fetusId).html();
			$("#fetalSectionDiv_" + fetusId).html(component.generateActivateInactiveBabyLabelHTML(card, babyNumber, false, 1));

			// On click of cancel restore the fetal section data to show its details.
			var cancelInactivateObj = $("#cancelInactivate_" + fetusId);
			var inactivateButtonObj = $("#inactivate_" + fetusId);

			cancelInactivateObj.click(function() {
				$("#inactivateBaby_" + fetusId).hide();
				$("#fetalSectionDiv_" + fetusId).html(origFetalDivHtml);
				$("#fetalDataSectionDiv_" + fetusId).show();
			});

			inactivateButtonObj.click(function() {
				// On click of inactivate button, inactivate the dynamic label.
				component.activateInactivateDynamicLabel(card, "fetalSectionDiv_" + fetusId, babyNumber, card.babyLabelIds[babyNumber], false, 1);
			});
		}
	});

	// 3. Attachs click event for reactivate dynamic baby labels.
	component.attachReactivateFetusListener(card, view);
};

/**
 * Once the component is rendered and later if any new text boxes with drop downs are added
 * or enabled, add listeners for textboxes and identify first and last enabled text boxes
 * to navigate through tab.
 *
 * @param card {object} - current selected visit card instance
 *
 * @param addSingleSelectDropDownListener {boolean} - attachs listener for single select drop downs
 *
 * @param addMultiSelectDropDownListener {boolean} - attachs listener for multi select drop downs
 */
PrenatalVisitsComponentWF.prototype.postProcessAddingTextBoxes = function(card, addSingleSelectDropDownListener, addMultiSelectDropDownListener) {
	var component = this;

	try {
		var eventIds = this.eventIdPrefix;
		var compId = this.getComponentId();
		var rootNode = this.getRootComponentNode();
		var singleSelectDropDownsCnt = card.numberOfSingleDropDowns;
		var multiSelectDropDownsCnt = card.numberOfDropDowns;
		// Variable used for indexing.
		var i = 0;

		if (addSingleSelectDropDownListener) {
			for ( i = 0; i < singleSelectDropDownsCnt; i++) {
				component.singleDropDownListeners(card.singleDropDowns[i] + "dropDown", "", card.singleDropDowns[i]);
			}
		}

		if (addMultiSelectDropDownListener) {
			for ( i = 0; i < multiSelectDropDownsCnt; i++) {
				component.dropDownListeners(card.dropDowns[i] + "dropDown", "", card.dropDowns[i]);
			}
		}

		var textBoxList = $(rootNode).find(".pv-wf-card-de-text-box");
		for ( i = 0; i < textBoxList.length; i++) {
			if (textBoxList[i].getAttribute("tabindex") != -1) {
				card.firstTextBoxEnabled = textBoxList[i].id;
				break;
			}
		}

		var commentTabIndex = $("#" + eventIds.COMMENTS + "_" + compId).attr('tabindex');
		nextApptmntObj = $(rootNode).find(".pv-wf-nextappt-input");
		var nextApptmntIndex = nextApptmntObj.attr('tabindex');
		if (nextApptmntIndex != -1) {
			card.lastTextBoxEnabled = nextApptmntObj.attr('id');
		}
		else if (commentTabIndex != -1) {
			card.lastTextBoxEnabled = eventIds.COMMENTS + "_" + compId;
		}
		else {
			for ( i = textBoxList.length - 1; i >= 0; i--) {
				if (textBoxList[i].getAttribute("tabindex") != -1) {
					card.lastTextBoxEnabled = textBoxList[i].id;
					break;
				}
			}
		}
		component.attachTextBoxListener(card);
		component.limitCommentLength(card);
	}
	catch(err) {
		MP_Util.LogJSError(err, component, "prenatal-visits-o2", "postProcessAddingTextBoxes");
	}
};

/**
 * Adds dynamic baby label HTML of newly selected baby to the card.
 *
 * @param card {object} - current selected visit card instance
 *
 * @param babyLabelId {string} - baby label id, used to add dynamic baby html
 *
 * @param babyLabelIndex {integer} - index to get new baby from a list dynamic baby labels
 *
 * @param babyLabelIndex {isTableView} - indicates if the choosen view is table or card view.
 */
PrenatalVisitsComponentWF.prototype.addDynamicBabyLabel = function(card, babyLabelId, babyLabelIndex, isTableView) {
	var component = this;

	try {
		var compId = this.getComponentId();
		var dynamicBabyLabels = component.m_dynamicBabyLabels;
		var dynamicBabyLabelData = dynamicBabyLabels.ALPHARESPONSES[babyLabelIndex];
		var babyLabel = dynamicBabyLabelData.DESCRIPTION;
		var babyCnt = card.numberOfBabies;

		card.babyLabelObjects[card.numberOfNewlyAddedBabies] = new component.babyLabelInstance();
		var babyLabelObject = card.babyLabelObjects[card.numberOfNewlyAddedBabies];

		babyLabelObject.EVENT_CD = dynamicBabyLabels.EVENT_CD;
		babyLabelObject.DESCRIPTION = babyLabel;
		babyLabelObject.TASK_ASSAY_CD = dynamicBabyLabels.TASK_ASSAY_CD;
		babyLabelObject.NOMENCLATURE_ID = dynamicBabyLabelData.NOMENCLATURE_ID;
		babyLabelObject.LABEL_TEMPLATE_ID = card.templateId;

		card.newFetusIdCnt++;
		babyLabelObject.FETUS_ID = card.newFetusIdCnt;
		var missingVal = this.m_emptyVal;
		card.numberOfBabies++;
		card.numberOfNewlyAddedBabies++;
		card.fetalPresent[babyCnt] = missingVal;
		card.fetalMovement[babyCnt] = missingVal;
		card.fhr[babyCnt] = missingVal;
		card.fetalLie[babyCnt] = missingVal;
		card.babyLabels[babyCnt] = babyLabel;

		fetalSection = component.generateFetalSection(card, babyCnt, true);

		if (isTableView === 1) {
			fetalSection = component.generateFetalSectionTabView(card, babyCnt, true);
		}

		$("#selectBaby_" + babyLabelId).append(fetalSection);
		component.postProcessAddingTextBoxes(card, true, true);
	}
	catch(err) {
		MP_Util.LogJSError(err, component, "prenatal-visits-o2", "addDynamicBabyLabel");
	}
};

/**
 * Adds the listener for "Add" & "Click" button upon clicking "Add Baby" hyperlink
 * whcih would be used to select new dynamic baby.
 *
 * @param card {object} - current selected visit card instance
 */
PrenatalVisitsComponentWF.prototype.addNewBabyListner = function(card, isTableView) {
	var compId = this.getComponentId();
	var component = this;
	var babyLabelId = card.newBabyLabelIndex + "_" + compId;
	var eventIds = this.eventIdPrefix;
	var recordData = this.getRecordData();
	var visitCnt = 0;
	if (component.m_recordDataExists) {
		visitCnt = recordData.VISITS.length;
	}
	var isFetalLiePresent = (this.getFetalLie().length > 0) ? true : false;
	var prenatalVisitsi18n = i18n.discernabu.prenatal_visits_o2;
	//Upon click of "Add" button in select baby label options, add the selected
	//dynamic baby label fields to chart.
	$("#addSelectBaby_" + babyLabelId).click(function() {
		var id = $(this).attr('id');
		var selectedIndex = id.split("_")[1];

		if (component.selectedDynamicBabyLabels[eventIds.SELECT_BABY + "_" + selectedIndex]) {
			$("#selectBaby_" + babyLabelId).html("");

			var babyLabelIdx = component.selectedDynamicBabyLabels[eventIds.SELECT_BABY + "_" + selectedIndex].LABEL_INDEX;
			component.addDynamicBabyLabel(card, babyLabelId, babyLabelIdx, isTableView);
		}
	});

	//Upon click of "Cancel" button in select baby label options, clear its HTML content.
	$("#cancelSelectBaby_" + babyLabelId).click(function() {
		if (isTableView === 0) {
			$("#selectBaby_" + babyLabelId).html("").hide();

			for (var i = 0; i < visitCnt; i++) {
				if (i != card.cardNumber) {
					$('#emptyRows_' + card.newBabyLabelIndex + '_' + i + '_' + compId).html("").hide();
				}

			}

			$('#emptyLabels_' + card.newBabyLabelIndex + '_' + compId).html("").hide();
		}
		if (isTableView === 1) {
			if (card.numberOfBabies !== 0) {
				$("#selectBaby_" + babyLabelId).html("").hide();

				for (var i = 0; i < visitCnt; i++) {
					if (i != card.cardNumber) {
						$('#emptyRows_' + card.newBabyLabelIndex + '_' + i + '_' + compId).html("").hide();
					}

				}

				$('#emptyLabels_' + card.newBabyLabelIndex + '_' + compId).html("").hide();
			}
			else {

				var addBabyLink = "<div class='pv-wf-display-inline'><a id= 'addFetus" + compId + "' class='pv-wf-edit-control-position'>" + prenatalVisitsi18n.ADD_BABY + "</a></div>";
				var emptyFetalSection = "";
				emptyFetalSection += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-header'></div>";
				emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-white pv-wf-baby-label-tb-theme-font'></div>";
				emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + addBabyLink + "</div>";
				emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-white pv-wf-baby-label-tb-theme-font'></div>";

				if (isFetalLiePresent) {
					emptyFetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'></div>";
				}
				$("#fetalColumn_" + card.cardNumber + "_" + compId).html("");
				$("#fetalColumn_" + card.cardNumber + "_" + compId).html(emptyFetalSection);
			}
		}

	});
};

/**
 * Generates activate or inactivate baby label html.
 *
 * @param card {object} - current selected visit card instance
 *
 * @param babyNumber {integer} - count of baby in the fetal section
 *
 * @param isReactivateAction {boolean} - generates reactivate dynamic baby label HTML if the
 * 		value is true, otherwise inactivate dynamic baby label HTML will be generated.
 *
 * @param isTableView {integer} - indicates if the view is card view or taable view.
 */
PrenatalVisitsComponentWF.prototype.generateActivateInactiveBabyLabelHTML = function(card, babyNumber, isReactivateAction, isTableView) {
	var compId = this.getComponentId();
	var pvi18n = i18n.discernabu.prenatal_visits_o2;
	var babyLabelHTML = "";
	var buttonHTML = "";
	var fetusId = babyNumber + "_" + compId;
	var babyLabel = card.babyLabels[babyNumber];
	var divId = "";
	var btnId = "";
	var cnclId = "";
	var btnString = "";
	var qstnString = "";
	var isFetalLiePresent = (this.getFetalLie().length > 0) ? true : false;

	var sectionClass = (babyNumber !== card.numberOfBabies - 1) ? "pv-wf-baby-label-tb-theme-add-baby-optionslielpresent" : "pv-wf-baby-label-tb-theme-add-baby-optionslielpresent-last";
	if (isReactivateAction === false) {
		divId = "inactivateBaby_" + fetusId;
		btnId = "inactivate_" + fetusId;
		cnclId = "cancelInactivate_" + fetusId;
		btnString = pvi18n.INACTIVATE;
		qstnString = pvi18n.INACTIVATE_BABY_LABEL.replace("{0}", babyLabel);
	}
	else {
		divId = "reactivateBaby_" + fetusId;
		btnId = "reactivate_" + fetusId;
		cnclId = "cancelReactivate_" + fetusId;
		btnString = pvi18n.REACTIVATE;
		qstnString = pvi18n.REACTIVATE_BABY_LABEL.replace("{0}", babyLabel) + "?";
	}

	if (isTableView == 1) {

		if (isFetalLiePresent) {
			babyLabelHTML = "<div class='" + sectionClass + "' id='" + divId + "'><div class='pv-wf-baby-label-tb-inactivate pv-wf-baby-label-tb-header' ><div class=' pv-wf-baby-label-tb-header-edit-margin'>" + babyLabel + "</div></div>";
		}
		else {
			babyLabelHTML = "<div class='pv-wf-baby-label-tb-theme-add-baby-options' id='" + divId + "' >";
		}
		babyLabelHTML += "<div ><div class='pv-wf-baby-select-pane-label-tb' ><label>" + qstnString + "</label></div>";

		buttonHTML += "<div class='pv-wf-table-inactivate-buttons-row'><div class='pv-wf-display-inline'>" + this.generateButtonHTML(btnString, btnId, 1, isTableView) + "</div><div class='pv-wf-display-inline'>" + this.generateButtonHTML(pvi18n.CANCEL, cnclId, 1, isTableView) + "</div></div>";

		return babyLabelHTML + buttonHTML + "</div>";
	}
	else {
		babyLabelHTML = "<div class='pv-wf-inact-baby-div' id='" + divId + "'><div class='pv-wf-inact-baby-div pv-wf-inact-baby-sub-div'>";
		babyLabelHTML += "<div class='pv-wf-inact-baby-label pv-wf-inact-baby'><label>" + qstnString + "</label>";
		babyLabelHTML += "</div>";

		buttonHTML = "<div class='pv-wf-inact-baby-buttons'>";
		buttonHTML += this.generateButtonHTML(btnString, btnId, 1, isTableView) + this.generateButtonHTML(pvi18n.CANCEL, cnclId, 1, isTableView);
		buttonHTML += "</div>";

		return babyLabelHTML + buttonHTML + "</div></div>";
	}
};

/**
 * Attachs click event for reactivate dynamic baby labels.
 *
 * @param card {object} - current selected visit card instance
 */
PrenatalVisitsComponentWF.prototype.attachReactivateFetusListener = function(card, isTableView) {
	var compId = this.getComponentId();
	var component = this;
	var componentContent = $(this.getSectionContentNode());

	// Unbind the events
	componentContent.off("click", ".pv-wf-baby-reactivate");

	componentContent.on("click", ".pv-wf-baby-reactivate", function() {
		var id = $(this).attr('id');
		var babyNumber = id.split("_")[1];
		var fetusId = babyNumber + "_" + compId;
		var origFetalDivHtml = $("#fetalSectionDiv_" + fetusId).html();

		$("#fetalSectionDiv_" + fetusId).html(component.generateActivateInactiveBabyLabelHTML(card, babyNumber, true, isTableView));
		$("#fetalBorderId" + card.cardNumber + compId).hide();
		var cancelReactivateObj = $("#cancelReactivate_" + fetusId);
		var reactivateButtonObj = $("#reactivate_" + fetusId);
		var fetalSectionObj = $("#fetalSectionDiv_" + fetusId);
		var reactivateBabyObj = $("#reactivateBaby_" + fetusId);

		cancelReactivateObj.click(function() {
			fetalSectionObj.html(origFetalDivHtml);
			component.attachReactivateFetusListener(card, isTableView);
		});

		reactivateButtonObj.click(function() {
			component.activateInactivateDynamicLabel(card, "fetalSectionDiv_" + fetusId, babyNumber, card.babyLabelIds[babyNumber], true, isTableView);
			component.m_babyLabelStatusInstanceArr[String(card.babyLabelIds[babyNumber])].STATUS = 0;
		});
	});
};

/**
 * Creates the JSON to activate or inactivate a dynamic label.
 *
 * @param dynamicLabelId {integer} - Dynamic label id
 *
 * @param toBeActivated {boolean} - activates dynamic label if the value is true,
 * 		otherwise dynamic label will be inactivated.
 *
 * @param isTableView {integer} - indicates if the selected view is table or card view.
 */
PrenatalVisitsComponentWF.prototype.activateInactivateDynamicLabel = function(card, id, babyNumber, dynamicLabelId, toBeActivated, isTableView) {
	var component = this;
	var criterion = component.getCriterion();
	var scriptRequest = new ComponentScriptRequest();
	var sendAr = [];
	var activate = toBeActivated ? 1 : 0;
	var pvi18n = i18n.discernabu.prenatal_visits_o2;
	var isFetalLiePresent = (this.getFetalLie().length > 0) ? true : false;

	// Used to send as blob parameters to the PRG
	var activateInactivateDynLblJSON = '{"ACT_INACT_DL_PARAMS":{"RESULTS":[';
	activateInactivateDynLblJSON += '{"CE_DYN_LBL_IDS":[{"LABEL_ID":' + dynamicLabelId + '.0' + '}]}]}}';

	sendAr.push("^MINE^", criterion.provider_id + ".0", criterion.ppr_cd + ".0", activate);
	scriptRequest.setProgramName("MP_PREG_ACT_INACT_DYN_LBL");
	scriptRequest.setParameterArray(sendAr);
	scriptRequest.setAsyncIndicator(true);
	scriptRequest.setDataBlob(activateInactivateDynLblJSON);
	scriptRequest.setComponent(component);
	scriptRequest.performRequest();
	scriptRequest.setResponseHandler(function(scriptReply) {
		if (scriptReply.getStatus() === "F") {
			component.generateModalDialog(pvi18n.CHART_FAILURE, pvi18n.ERROR_OCCURED, "error");
			// Error object which will be used to log customized error.
			var discernError = new Error(pvi18n.CHART_FAILURE);
			MP_Util.LogJSError(discernError, component, "prenatal-visits-o2.js", "activateInactivateDynamicLabel");
		}
		else {
			if (toBeActivated) {
				component.retrieveComponentData();
			}
			else {
				var compId = component.getComponentId();
				var fetusId = babyNumber + "_" + compId;
				var babyLabel = "[" + card.babyLabels[babyNumber] + "]";
				var addBabyLink = "<div class='pv-wf-tb-reactivate-margin-add-baby' id = 'addFetus" + compId + card.numberOfAddBabyLinks + "'><a id= 'addFetus" + compId + "' class='pv-wf-edit-control-position'>" + pvi18n.ADD_BABY + "</a></div>";
				var fetalSection = "";
				if (isTableView === 1) {
					if (isFetalLiePresent) {
						fetalSection = "<div class='pv-wf-baby-label-tb-theme-add-baby-optionslielpresent' id='fetalSection" + compId + card.newFetusIdCnt + "' >";
					}
					else {
						fetalSection = "<div class='pv-wf-baby-label-tb-theme-add-baby-options' id='fetalSection" + compId + card.newFetusIdCnt + "' >";
					}
					babyLabel = card.babyLabels[babyNumber];

					addBabyLink = "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header' id = 'addFetus" + compId + card.numberOfAddBabyLinks + "'><a id= 'addFetus" + compId + "' class='pv-wf-tb-reactivate-margin pv-wf-baby-reactivate'>" + pvi18n.ADD_BABY + "</a></div>";

					if (babyNumber == card.numberOfBabies - 1) {
						fetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-header'><div class=' pv-wf-baby-label-tb-header-edit-margin'>" + babyLabel + "</div></div>";
						fetalSection += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header'></div>";
						fetalSection += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header'><a id = 'reactivate_" + fetusId + "' class='pv-wf-tb-reactivate-margin pv-wf-baby-reactivate'>" + pvi18n.REACTIVATE + " " + babyLabel + "</a></div>";
						fetalSection += addBabyLink;
						if (isFetalLiePresent) {
							fetalSection += " <div  class='pv-wf-baby-label-tb-lie pv-wf-baby-label-tb-inactive-header'></div>";
						}
					}
					else {
						fetalSection += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-header'><div class=' pv-wf-baby-label-tb-header-edit-margin'>" + babyLabel + "</div></div>";
						fetalSection += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header'></div>";
						fetalSection += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header'><a id = 'reactivate_" + fetusId + "' class='pv-wf-tb-reactivate-margin pv-wf-baby-reactivate'>" + pvi18n.REACTIVATE + " " + babyLabel + "</a></div>";
						fetalSection += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header'></div>";
						if (isFetalLiePresent) {
							fetalSection += " <div  class='pv-wf-baby-label-tb pv-wf-baby-label-tb-inactive-header'></div>";
						}
					}
					$("#" + id).html(fetalSection + "</div>");

				}
				else {
					fetalSection = "<dl id='fetalSection" + compId + card.newFetusIdCnt + "'><dt></dt><dd ><div class='pv-wf-fetal-baby-label'>" + babyLabel + "</div></dd>";
					var reactivateBabyLabel = pvi18n.REACTIVATE + " " + babyLabel;
					fetalSection += "<span class='pv-wf-add-fetus pv-wf-baby-reactivate-props'><a tabindex='-1' href='#' class='pv-wf-baby-reactivate' id='reactivateBaby_" + fetusId + "' >" + reactivateBabyLabel + "</a></span></dl>";
					$("#" + id).html(fetalSection);
				}
				component.attachReactivateFetusListener(card, isTableView);
				component.m_dynamicLabelInactivated = true;
			}
		}
		return;
	});
};

/**
 * Return generalized HTML for button with button label.
 *
 * @param buttonLabel {string} - button label
 *
 * @param buttonId {string} - unique id for button
 *
 * @param isEnabled {boolean} - is should display in button enabled style
 *
 * @param isTableView {integer} - indicates if the selected view is table or card
 */
PrenatalVisitsComponentWF.prototype.generateButtonHTML = function(buttonLabel, buttonId, isEnabled, isTableView) {
	var compId = this.getComponentId();
	var buttonHTML = "";
	//By default button will be shown in enabled mode
	var style = isEnabled ? '' : 'pv-wf-card-btn-disabled';

	if (isTableView === 0) {
		buttonHTML += "<div class='pv-wf-card-button'><span class='pv-wf-card-btn-style " + style + "'>";
		buttonHTML += "<input tabindex='-1' type='button' id='" + buttonId + "' class='pv-wf-card-btn-text' value='" + buttonLabel + "'></span></div>";
		return buttonHTML;
	}
	else {
		buttonHTML += "<div class='pv-wf-card-button-tab-margin'><span class='pv-wf-card-btn-style " + style + "'>";
		buttonHTML += "<input tabindex='-1' type='button' id='" + buttonId + "' class='pv-wf-card-btn-text' value='" + buttonLabel + "'></span></div>";
		return buttonHTML;
	}
};

/**
 * Generates HTML on selection of "Add Baby" link which would be used to select
 * available baby labels.
 *
 * @param card {object} - current selected visit card instance
 *
 * @param isTableView {integer} - indicates if the selected view is table or card
 */
PrenatalVisitsComponentWF.prototype.generateBabyLabelOptions = function(card, isTableView) {
	try {
		var compId = this.getComponentId();
		var pvi18n = i18n.discernabu.prenatal_visits_o2;
		var value = this.m_emptyVal;
		var eventValues = [];
		var nomenclature_ids = [];
		var babyLabelHTML = "";
		var buttonHTML = "";
		var dynamicBabyLabels = this.m_dynamicBabyLabels;
		var eventIds = this.eventIdPrefix;

		card.newBabyLabelIndex++;
		var babyLabelId = card.newBabyLabelIndex + "_" + compId;
		// textId_newFetusNumber_babyNumber_uniqueNumber_BoxType
		var textId = eventIds.SELECT_BABY + "_" + card.newBabyLabelIndex + "_" + "X" + "_" + compId + "_2";
		var dropDownId = textId + "dropDown";
		var textClass = "pv-wf-select-baby-label-input pv-wf-card-de-text-box";
		var babyLabelsLength = dynamicBabyLabels.ALPHARESPONSES.length;

		for (var labelIndex = 0; labelIndex < babyLabelsLength; labelIndex++) {
			var dynamicBabyLabelData = dynamicBabyLabels.ALPHARESPONSES[labelIndex];
			eventValues[labelIndex] = dynamicBabyLabelData.DESCRIPTION;
			nomenclature_ids[labelIndex] = dynamicBabyLabelData.NOMENCLATURE_ID;
		}
		var isFetalLiePresent = (this.getFetalLie().length > 0) ? true : false;
		if (isTableView == 1) {
			if (isFetalLiePresent) {
				babyLabelHTML = "<div class='pv-wf-baby-label-tb-theme-add-baby-optionslielpresent-select ' id='selectBaby_" + babyLabelId + "' ><div class='pv-wf-baby-select-pane-label-tb' id='selectBaby_" + babyLabelId + "'><label class='pv-wf-mandatory'>*</label><label>" + pvi18n.SELECT_BABY_LABEL + "</label></div>";

			}
			else {
				babyLabelHTML = "<div class='pv-wf-baby-label-tb-theme-add-baby-options pv-wf-baby-label-tb-borde-side ' id='selectBaby_" + babyLabelId + "' ><div class='pv-wf-baby-select-pane-label-tb' id='selectBaby_" + babyLabelId + "'><label class='pv-wf-mandatory'>*</label><label>" + pvi18n.SELECT_BABY_LABEL + "</label></div>";

			}
			babyLabelHTML += "<div class='pv-wf-baby-select-pane-dropdown-tb '>" + this.generateSingleDropDown(dropDownId, textClass, textId, value, eventValues, nomenclature_ids, false) + "</div>";
			card.singleDropDowns[card.numberOfSingleDropDowns++] = textId;

			buttonHTML += "<div class='pv-wf-table-buttons-row'><div class='pv-wf-display-inline'>" + this.generateButtonHTML(pvi18n.ADD, "addSelectBaby_" + babyLabelId, 0, isTableView) + "</div><div class='pv-wf-display-inline'>" + this.generateButtonHTML(pvi18n.CANCEL, "cancelSelectBaby_" + babyLabelId, 1, isTableView) + "</div></div>";

			return babyLabelHTML + buttonHTML + "</div>";
		}
		else {

			babyLabelHTML = "<div class='pv-wf-select-baby-div' id='selectBaby_" + babyLabelId + "'><dl class='pv-wf-select-baby-section'><dt></dt><dd>";
			babyLabelHTML += "<div class='pv-wf-select-baby-label'><label class='pv-wf-mandatory'>*</label><label>" + pvi18n.SELECT_BABY_LABEL + "</label>";
			babyLabelHTML += "</div></dd><dt></dt><dd class='pv-wf-select-baby-label-val'>" + this.generateSingleDropDown(dropDownId, textClass, textId, value, eventValues, nomenclature_ids, false);
			babyLabelHTML += "</dd>";

			buttonHTML += this.generateButtonHTML(pvi18n.ADD, "addSelectBaby_" + babyLabelId, 0, isTableView) + this.generateButtonHTML(pvi18n.CANCEL, "cancelSelectBaby_" + babyLabelId, 1, isTableView);

			card.singleDropDowns[card.numberOfSingleDropDowns++] = textId;

			return babyLabelHTML + buttonHTML + "</dl></div>";
		}
	}
	catch(err) {
		MP_Util.LogJSError(err, this, "prenatal-visits-o2.js", "generateBabyLabelOptions");
	}
};

/**
 * Text box listener to capture and validate the values entered in the text box.
 *
 * @param card {object} - current selected visit card instance
 */
PrenatalVisitsComponentWF.prototype.attachTextBoxListener = function(card) {
	var component = this;
	var compId = this.getComponentId();
	var rootNode = this.getRootComponentNode();
	var eventIds = this.eventIdPrefix;
	var prenatalVisitsi18n = i18n.discernabu.prenatal_visits_o2;

	$(rootNode).find('.pv-wf-card-de-text-box').off("focusout");
	// Add the text box results to an array on focusOut
	$(rootNode).find('.pv-wf-card-de-text-box').on("focusout", function() {
		var isReadOnly = $(this).attr('readonly');
		if (!isReadOnly) {
			var eventId = this.id.split("_")[0];
			var textValue = $("#" + this.id).val();
			var eventSelected = eventId;
			var errMessage = "";
			var units = "";
			var min = "";
			var max = "";
			if (component.pvDTAs[eventId][0].EVENT_CODE_TYPE == "NUMERIC" && textValue.length !== 0) {
				if (component.validateNumeric(component.pvDTAs[eventId][0], textValue)) {
					textValue = component.trimNumeric(textValue);
					textValue = component.truncateZeros(textValue);

					if (!component.validateFeasibleLowAndHigh(component.pvDTAs[eventId][0], textValue)) {
						errMessage = prenatalVisitsi18n.FEASIBLE_RANGE_ERROR;
						errMessage = errMessage.replace("{0}", textValue);
						units = component.getUnits(component.pvDTAs[eventId]);
						errMessage = errMessage.replace("{1}", units);
						eventName = component.pvDTAs[eventId][0].DESCRIPTION;
						errMessage = errMessage.replace("{2}", eventName.toUpperCase());
						min = component.pvDTAs[eventId][0].REF_RANGE_FACTOR[0].FEASIBLE_LOW;
						errMessage = errMessage.replace("{3}", min);
						max = component.pvDTAs[eventId][0].REF_RANGE_FACTOR[0].FEASIBLE_HIGH;
						errMessage = errMessage.replace("{4}", max);
						component.generateModalDialog(errMessage, prenatalVisitsi18n.WARNING, "warning");
						$("#" + this.id).val("");
						$("#" + this.id).focus();
						return;
					}
					else if (!component.validateCriticalLowAndHigh(component.pvDTAs[eventId][0], textValue)) {
						errMessage = prenatalVisitsi18n.CRITICAL_ERROR;
						errMessage = errMessage.replace("{0}", textValue);
						units = component.getUnits(component.pvDTAs[eventId]);
						errMessage = errMessage.replace("{1}", units);
						eventName = component.pvDTAs[eventId][0].DESCRIPTION;
						errMessage = errMessage.replace("{2}", eventName.toUpperCase());
						min = component.pvDTAs[eventId][0].REF_RANGE_FACTOR[0].CRITICAL_LOW;
						errMessage = errMessage.replace("{3}", min);
						max = component.pvDTAs[eventId][0].REF_RANGE_FACTOR[0].CRITICAL_HIGH;
						errMessage = errMessage.replace("{4}", max);
						component.generateCriticalErrorModalDialog(errMessage, this.id);
					}
				}
				else {
					if (textValue.length !== 0) {
						var format = component.generateFormat(component.pvDTAs[eventId][0]);
						errMessage = prenatalVisitsi18n.CHART_ERROR;
						errMessage = errMessage.replace("{0}", textValue);
						eventName = component.pvDTAs[eventId][0].DESCRIPTION;
						errMessage = errMessage.replace("{1}", eventName.toUpperCase());
						errMessage = errMessage.replace("{2}", format);
						errMessage = errMessage.replace("{3}", eventName.toUpperCase());
						component.generateModalDialog(errMessage, prenatalVisitsi18n.ERROR_OCCURED, "error");
						$("#" + this.id).val("");
						$("#" + this.id).focus();
						return;
					}
				}
			}

			switch(eventId) {
				case eventIds.FETAL_PRESENTATION:
				case eventIds.FETAL_MOVEMENT:
				case eventIds.FETAL_HEART_RATE:
				case eventIds.FETAL_LIE:
					eventSelected += "_" + this.id.split("_")[1] + "_" + this.id.split("_")[2];
					break;
			}
			component.disableSign();
			component.pvEventsToChart[eventSelected] = {
				VALUE : textValue
			};
		}

	});

	$(rootNode).find('.pv-wf-card-de-text-box').off('keydown');
	$(rootNode).find('.pv-wf-card-de-text-box').on("keydown", function(event) {
		// Get keycode of current keypress event
		// we make use of the char codes identify the key pressed to validate the input.
		var eventId = this.id.split("_")[0];
		var textValue = $("#" + this.id).val();
		var charCode = (event.which) ? event.which : event.keyCode;
		if (charCode == 9 && this.id == card.lastTextBoxEnabled) {
			event.preventDefault();
			$("#" + card.firstTextBoxEnabled).focus();
			return;
		}
		else if (eventId === eventIds.SELECT_BABY) {
			return;
		}

		if (component.pvDTAs[eventId][0].EVENT_CODE_TYPE == "NUMERIC") {
			if (charCode == 8 || charCode == 46) {
				return true;
			}
			if (charCode == 190) {

				var arr = textValue.split("");
				for ( i = 0; i < textValue.length; i++) {
					if (arr[i] == '.') {
						return false;
					}
				}
				return true;
			}

			if (charCode == 189) {
				if (textValue.length > 0) {
					return false;
				}
				else {
					return true;
				}
			}

			if (charCode > 31 && (charCode < 48 || charCode > 57)) {
				return false;
			}
			return true;
		}
		return true;
	});
};

/**
 * The method disables the sign button when there is not results to sign.
 */
PrenatalVisitsComponentWF.prototype.disableSign = function() {
	var disabled = true;
	for (var i = 0; i < this.m_activeFields.length; i++) {
		var value = $("#" + this.m_activeFields[i]).val();
		if (value !== "") {
			disabled = false;
			break;
		}
	}
	var compId = this.getComponentId();
	var component = this;
	var signObj = "#sign_" + compId;
	var signObjTable = "#signTable_" + compId;
	if (disabled) {
		$(signObj).removeClass("pv-wf-edit-panel-sign-enabled").addClass("pv-wf-edit-panel-sign-disabled");
		$(signObjTable).removeClass("pv-wf-edit-panel-sign-tb-enabled").addClass("pv-wf-edit-panel-sign-tb-disabled");
	}
	else {
		$(signObj).removeClass("pv-wf-edit-panel-sign-disabled").addClass("pv-wf-edit-panel-sign-enabled");
		$(signObjTable).removeClass("pv-wf-edit-panel-sign-tb-disabled").addClass("pv-wf-edit-panel-sign-tb-enabled");
	}
};

/**
 * Creates a new direct entry panel and registers cancel button with cancel event.
 *
 * @param cardNumber {integer} - card number for the card for which the direct entry pane is being created
 *
 * @param origHTML {string} - original HTMLof the card
 *
 * @param len {integer} - number of visits
 *
 * @param cards {object} - object containing all the visits
 */
PrenatalVisitsComponentWF.prototype.createEditPane = function(cardNumber, origHTML, len, cards) {
	var component = this;
	var compId = this.getComponentId();
	var dtaResults = this.m_dtaResults;
	var editCardIdObj = $("#visitCard_" + cardNumber + "_" + compId);
	var k = 0;

	editCardIdObj.html(this.buildEditPane(cardNumber, cards[cardNumber]));
	editCardIdObj.removeClass("pv-wf-context-menu-delete-card");
	this.disableSign();

	$('#cancel_' + compId).click(function() {
		editCardIdObj.removeClass("pv-wf-preg-visit-card-on-edit").addClass("pv-wf-preg-visit-card");

		// Bringing the other cards to their original style
		for ( k = 0; k < len; k++) {
			if (k != cardNumber) {
				editCardIdObj = $("#visitCard_" + k + "_" + compId);
				editCardIdObj.removeClass("pv-wf-preg-visit-card-on-edit-other").addClass("pv-wf-preg-visit-card");
				$('#editCard_' + k + "_" + compId).show();
			}
		}
		cards[cardNumber].numberOfBabies = cards[cardNumber].numberOfBabies - cards[cardNumber].numberOfNewlyAddedBabies;
		cards[cardNumber].numberOfNewlyAddedBabies = 0;

		// Bringing the card back to its original state
		$("#visitCard_" + cardNumber + "_" + compId).html(origHTML);
		component.editListener(len, cards);

		if (component.m_dynamicLabelInactivated) {
			component.retrieveComponentData();
		}
		else {
			component.renderComponent(component.getRecordData());
		}
	});

	var card = cards[cardNumber];
	component.postProcessAddingTextBoxes(card, true, true);
	$(("#" + card.firstTextBoxEnabled)).focus();
	component.limitCommentLength(card);

	$('#sign_' + compId).click(function() {
		// Chart the results for a particular Card/Encounter.
		// Allow user to click "Sign" button image only once per charting.
		if (!component.m_signResults && !component.isSignButtonClicked) {
			component.isSignButtonClicked = true;
			component.chartResults(cards[cardNumber]);
			component.m_signResults = true;
		}
	});
	$('#deleteVisit_' + cardNumber + '_' + compId).click(function() {
		component.generateDeleteConfirmModalDialog(cardNumber);
	});
};

/**
 * Listens to clicks on drop downs and displays a list to choose from.
 *
 * @param dropDownId {string} - unique id for the drop down
 *
 * @param valuesList {string} - values in the original list
 *
 * @param textId {string} - id of the text box which holds the values
 */
PrenatalVisitsComponentWF.prototype.dropDownListeners = function(dropDownId, valuesList, textId) {
	var component = this;
	var textObj = "#" + dropDownId;
	var eventIds = this.eventIdPrefix;
	textId = "#" + textId;
	$(textObj + " .pv-wf-selected-values").off("click");
	$(textObj + " .pv-wf-selected-values").on("click", function() {
		var id = $(this).attr('id');

		$(textObj + " .pv-wf-mutli-select ul").slideToggle('fast');
	});

	var mouseFuction = function(event) {
		var selfContainer = $(textObj + " .pv-wf-mutli-select ul");
		var mainContainer = $(textObj + " .pv-wf-selected-values");
		// if the target of the click isn't the container.. nor a descendant of the container
		if (!mainContainer.is(event.target) && mainContainer.has(event.target).length === 0) {
			// if the target of the click isn't the container... ... nor a descendant of the container
			if (!selfContainer.is(event.target) && selfContainer.has(event.target).length === 0) {
				selfContainer.hide();
			}
		}
	};

	$(document).mouseup(mouseFuction);

	$(textObj + " .pv-wf-mutli-select li").click(function() {
		var multiValuesList = $(textObj).find('.pv-wf-chk-multi-values');
		var multiValuesListLength = multiValuesList.length;
		var selectedValues = "";
		var id = $(this).attr('id');

		// Get the index of the check-box selected.
		var eventId = dropDownId.split("_")[0];
		var nomenclature_id = 0;
		var eventSelected = eventId;

		switch(eventId) {
			case eventIds.FETAL_PRESENTATION:
			case eventIds.FETAL_MOVEMENT:
			case eventIds.FETAL_HEART_RATE:
			case eventIds.FETAL_LIE:
				eventSelected += "_" + dropDownId.split("_")[1] + "_" + dropDownId.split("_")[2];
				break;
		}

		for (var i = 0; i < multiValuesListLength; i++) {
			component.pvEventsToChart[eventSelected] = i === 0 ? [] : component.pvEventsToChart[eventSelected];

			if (multiValuesList[i].checked) {
				selectedValues += multiValuesList[i].value + ", ";
				nomenclature_id = multiValuesList[i].id.split("_")[0];

				component.pvEventsToChart[eventSelected].push({
					NOMENCLATURE_ID : nomenclature_id
				});
			}
		}

		if (selectedValues === "") {
			$(textId).val("");
		}
		else {
			$(textId).val(selectedValues.substring(0, selectedValues.length - 2));
		}
		component.disableSign();
	});
};

/**
 * Listens to clicks on drop downs and displays a list to choose from.
 *
 * @param dropDownId {string} - unique id for the drop down
 *
 * @param valuesList {string} - values in the original list
 *
 * @param textId {string} - id of the text box which holds the values
 */
PrenatalVisitsComponentWF.prototype.singleDropDownListeners = function(dropDownId, valuesList, textId) {
	var component = this;
	var compId = this.getComponentId();
	var textObj = "#" + dropDownId;
	var eventIds = this.eventIdPrefix;
	textId = "#" + textId;

	$(textObj + " .pv-wf-selected-values").off("click");
	$(textObj + " .pv-wf-selected-values").on("click", function() {

		var id = $(this).attr('id');
		$(textObj + " .pv-wf-mutli-select ul").slideToggle('fast');

	});

	var mouseFuction = function(event) {
		var selfContainer = $(textObj + " .pv-wf-mutli-select ul");
		var mainContainer = $(textObj + " .pv-wf-selected-values");
		// if the target of the click isn't the container.. nor a descendant of the container
		if (!mainContainer.is(event.target) && mainContainer.has(event.target).length === 0) {
			// if the target of the click isn't the container... ... nor a descendant of the container
			if (!selfContainer.is(event.target) && selfContainer.has(event.target).length === 0) {
				selfContainer.hide();
			}
		}
	};

	$(document).mouseup(mouseFuction);

	$(textObj + " .pv-wf-mutli-select li").click(function() {
		var multiValuesList = $(textObj).find('.pv-wf-chk-multi-values');
		var selfContainer = $(textObj + " .pv-wf-mutli-select ul");
		var multiValuesListLength = multiValuesList.length;
		var selectedValues = "";
		var id = $(this).attr('id');
		var widgetId = id.split("_");
		var dropDownIdSplit = dropDownId.split("_");
		var lastChar = widgetId[2];
		selectedValues = multiValuesList[lastChar].value;
		// Get the index of the check-box selected.
		selfContainer.hide();
		var eventId = dropDownIdSplit[0];
		var nomenclature_id = widgetId[0];
		var eventSelected = eventId;

		switch(eventId) {
			case eventIds.FETAL_PRESENTATION:
			case eventIds.FETAL_MOVEMENT:
			case eventIds.FETAL_HEART_RATE:
			case eventIds.FETAL_LIE:
				eventSelected += "_" + dropDownIdSplit[1] + "_" + dropDownIdSplit[2];
				break;
			case eventIds.SELECT_BABY:
				eventSelected += "_" + dropDownIdSplit[1];
		}

		if (eventId === eventIds.SELECT_BABY) {
			//component.selectedDynamicBabyLabels[eventSelected] = [];
			component.selectedDynamicBabyLabels[eventSelected] = {
				LABEL_INDEX : parseInt(widgetId[widgetId.length - 1], 10)
			};

			$("#addSelectBaby_" + dropDownIdSplit[1] + "_" + compId).closest('span').removeClass('pv-wf-card-btn-disabled');
		}
		else {
			component.pvEventsToChart[eventSelected] = [];
			if (nomenclature_id > 0) {
				component.pvEventsToChart[eventSelected].push({
					NOMENCLATURE_ID : nomenclature_id
				});
			}
		}

		if (selectedValues === "") {
			$(textId).val("");
		}
		else {
			$(textId).val(selectedValues);
		}
		component.disableSign();
	});
};

/**
 * Trims if the value being entered contains just a '.' or '-', or a '.' at the end
 *
 * @param textValue {String} - value edited
 */
PrenatalVisitsComponentWF.prototype.trimNumeric = function(textValue) {
	var save = textValue;
	var arr = textValue.split("");
	var arr2 = [];

	if ((textValue.length == 1) && (arr[textValue.length - 1] == '.' || arr[textValue.length - 1] == '-')) {
		return "";
	}
	else if (textValue.length > 1) {
		if (arr[textValue.length - 1] == '.') {
			for ( i = 0; i < textValue.length - 1; i++) {
				arr2[i] = arr[i];
			}
			var str = arr2.join("");
			return arr2.join("");
		}
		return save;
	}
	else {
		return save;
	}

};

/**
 * Limits the length of the comment to 256 characters
 */
PrenatalVisitsComponentWF.prototype.limitCommentLength = function(card) {
	var component = this;
	var rootNode = this.getRootComponentNode();
	var eventIds = this.eventIdPrefix;

	$(rootNode).find('.pv-wf-card-comment-box').off('keydown');
	$(rootNode).find('.pv-wf-card-comment-box').on("keydown", function(event) {
		// Get keycode of current keydown event
		var charCode = (event.which) ? event.which : event.keyCode;

		if (charCode == 9 && this.id == card.lastTextBoxEnabled) {
			event.preventDefault();
			$("#" + card.firstTextBoxEnabled).focus();
			return;
		}
		if (charCode == 8 || charCode == 46) {
			return true;
		}
		var eventId = this.id.split("_")[0];
		var textValue = $("#" + this.id).val();
		if (textValue.length < 255) {
			return true;
		}
		else {
			return false;
		}

	});

};

/**
 * Generates the valid formatter for the event i.e., if the value enetered for
 * an event invalid, expected value format will be returned.
 *
 * @param eventName {Object} - event name
 *
 * @returns format {String} - expected format of event
 */
PrenatalVisitsComponentWF.prototype.generateFormat = function(eventName) {
	var max = eventName.DATA_MAP[0].MAX_DIGITS;
	var min = eventName.DATA_MAP[0].MIN_DIGITS;
	var deciMin = eventName.DATA_MAP[0].MIN_DECIMAL_PLACES;

	var format = "(";
	for (var i = 0; i < max - deciMin; i++) {
		format = format + "#";
	}
	format = format + ")";
	if (deciMin !== 0) {
		format = format + ".";
	}
	for ( i = 0; i < deciMin; i++) {
		format = format + "#";
	}

	return format;
};

PrenatalVisitsComponentWF.prototype.truncateZeros = function(value) {
	var save = value;
	var arr = value.split("");

	var j = 0;
	var arr2 = [];
	for (var i = 0; i < value.length; i++) {
		if (i === 0 && arr[i] == '-') {
			arr2[j] = arr[i];
			j++;
		}
		else if (arr[i] !== 0) {
			break;
		}
	}

	if (arr[i] == '.') {
		arr2[j] = 0;
		j++;
	}

	for (var k = i; k < value.length; k++) {
		arr2[j] = arr[k];
		j++;
	}

	return arr2.join("");

};

PrenatalVisitsComponentWF.prototype.validateCriticalLowAndHigh = function(eventName, value) {
	var max = eventName.REF_RANGE_FACTOR[0].CRITICAL_HIGH;
	var min = eventName.REF_RANGE_FACTOR[0].CRITICAL_LOW;

	if (max === 0 && min === 0) {
		return true;
	}

	if (value < min || value > max) {
		return false;
	}
	else {
		return true;
	}

};

PrenatalVisitsComponentWF.prototype.validateFeasibleLowAndHigh = function(eventName, value) {
	var max = eventName.REF_RANGE_FACTOR[0].FEASIBLE_HIGH;
	var min = eventName.REF_RANGE_FACTOR[0].FEASIBLE_LOW;

	if (max === 0 && min === 0) {
		return true;
	}

	if (value < min || value > max) {
		return false;
	}
	else {
		return true;
	}

};

/**
 * Validates if the value passed is a number
 *
 * @param eventName {Object} - event name
 *
 * @param value {String} - value edited
 */
PrenatalVisitsComponentWF.prototype.validateNumeric = function(eventName, value) {
	var max = eventName.DATA_MAP[0].MAX_DIGITS;
	var min = eventName.DATA_MAP[0].MIN_DIGITS;
	var deciMin = eventName.DATA_MAP[0].MIN_DECIMAL_PLACES;

	if (isNaN(value)) {
		return false;
	}

	if (max === 0 && min === 0 && deciMin === 0) {
		return true;
	}

	var before = value.toString().split(".")[0];
	var after = value.toString().split(".")[1];

	before = parseInt(before, 10);

	var numericLen = before.toString().length;

	var deciLen = 0;
	if (after !== undefined) {
		after = after.split("").reverse().join("");
		after = parseInt(after, 10);
		deciLen = after.toString().length;
		if (deciLen > deciMin) {
			return false;
		}
	}

	if (numericLen < min || numericLen > max - deciLen) {
		return false;
	}

	return true;
};

/**
 * Creates a field with value and CSS properties passed for the selected visit card.
 *
 * @param events {string} - events being displayed
 *
 * @param textClass {string} - class representing the CSS properties for the field
 *
 * @param textId {string} - unique id for the text box
 *
 * @param value {string} - value to be displayed in the field
 *
 * @param card {object} - current selected visit card instance
 */
PrenatalVisitsComponentWF.prototype.generateField = function(events, textClass, textId, value, card) {
	var compId = this.getComponentId();
	var eventType;
	var eventValues = [];
	var eventIds = this.eventIdPrefix;
	var eventPrefixId = textId.split("_")[0];

	textClass = textClass + " pv-wf-card-de-text-box";
	var nomenclature_ids = [];
	if (events.length !== 1) {
		textClass = textClass + " pv-wf-disable-color";
		$("#" + textId).readOnly = true;
		return this.generateTextBox(textClass, textId, "");
	}
	else {
		eventType = events[0].EVENT_CODE_TYPE;
		if (eventPrefixId === eventIds.NXT_APPTMENT && eventType !== "NUMERIC") {
			textClass = textClass + " pv-wf-disable-color";
			$("#" + textId).readOnly = true;
			return this.generateTextBox(textClass, textId, "");
		}
		else if (value == '--') {
			textClass = textClass + " pv-wf-unsigned-color";

		}
		else {
			textClass = textClass + " pv-wf-signed-color pv-wf-context-menu";

		}
	}

	if (eventType == "MULTI" || eventType == "MULTIALPHAANDFREETEXT") {
		textId = textId + "_1";
		textClass += " pv-wf-drop-down-indicator";
		if (events[0].REF_RANGE_FACTOR[0].ALPHA_RESPONSES_CNT > 0) {
			for ( i = 0; i < events[0].REF_RANGE_FACTOR[0].ALPHA_RESPONSES_CNT; i++) {
				eventValues[i] = events[0].REF_RANGE_FACTOR[0].ALPHA_RESPONSE_LIST[i].SOURCE_STRING;
				nomenclature_ids[i] = events[0].REF_RANGE_FACTOR[0].ALPHA_RESPONSE_LIST[i].NOMENCLATURE_ID;
			}

			field = this.generateDropDown(textId + "dropDown", textClass, textId, value, eventValues, nomenclature_ids);
			if (value == "--") {
				card.dropDowns[card.numberOfDropDowns] = textId;
				card.numberOfDropDowns++;
			}
		}
	}
	else if (eventType == "ALPHA") {
		textId = textId + "_2";
		textClass += " pv-wf-drop-down-indicator";
		if (events[0].REF_RANGE_FACTOR[0].ALPHA_RESPONSES_CNT > 0) {
			for ( i = 0; i < events[0].REF_RANGE_FACTOR[0].ALPHA_RESPONSES_CNT; i++) {
				eventValues[i] = events[0].REF_RANGE_FACTOR[0].ALPHA_RESPONSE_LIST[i].SOURCE_STRING;
				nomenclature_ids[i] = events[0].REF_RANGE_FACTOR[0].ALPHA_RESPONSE_LIST[i].NOMENCLATURE_ID;
			}
		}
		field = this.generateSingleDropDown(textId + "dropDown", textClass, textId, value, eventValues, nomenclature_ids, true);

		if (value == "--") {
			card.singleDropDowns[card.numberOfSingleDropDowns] = textId;
			card.numberOfSingleDropDowns++;
		}
	}
	else if (eventType === "NUMERIC" || eventType === "FREETEXT") {
		textId = textId + "_0";
		field = this.generateTextBox(textClass, textId, value);
	}
	else {
		textClass = textClass + " pv-wf-disable-color";
		$("#" + textId).readOnly = true;
		return this.generateTextBox(textClass, textId, "");
	}

	return field;
};

/**
 * Opens the IView tab.
 */
PrenatalVisitsComponentWF.prototype.openIView = function() {
	var criterion = this.getCriterion();
   (new CapabilityTimer("CAP:MPG.PRENATALVISITS.O2-EDIT-IN-IVIEW", criterion.category_mean)).capture();
	var slaTimer = MP_Util.CreateTimer("CAP:MPG.PRENATALVISITS.O2-EDIT-IN-IVIEW");
	if (slaTimer) {
		slaTimer.SubtimerName = criterion.category_mean;
		slaTimer.Stop();
	}
	try {
		var launchIViewApp = window.external.DiscernObjectFactory("TASKDOC");
		launchIViewApp.LaunchIView("", "", "", criterion.person_id, criterion.encntr_id);

		CERN_EventListener.fireEvent(null, this, EventListener.EVENT_CLINICAL_EVENT, "prenatal-visits-o2");
	}
	catch (err) {
		MP_Util.LogJSError(err, null, "prenatal-visits-o2", "openIView");
	}
};

/**
 * Opens the new Visit direct entry panel.
 */
PrenatalVisitsComponentWF.prototype.openTab = function() {
	var prenatalVisitsi18n = i18n.discernabu.prenatal_visits_o2;
	var component = this;
	var i = 0;
	component.m_isNewVisitRequired = true;
	if (component.m_recordDataExists) {
		var recordData = this.getRecordData();
		var rootId = this.getStyles().getId();
		var compId = this.getComponentId();

		var visitDate = new Date();
		var visitDates = [];
		var visitCnt = recordData.VISITS.length;
		var dateString = "";
		var today = new Date();
		today = "" + today.format("mm/dd/yy");
		var visitExists = false;
		for ( i = 0; i < visitCnt; i++) {
			visitDate = new Date();
			visitDate.setISO8601(recordData.VISITS[i].VISIT_DATE);
			dateString = "" + visitDate.format("mm/dd/yy");
			if (dateString.localeCompare(today) === 0) {
				visitExists = true;
			}
		}

		if (visitExists) {
			var title = prenatalVisitsi18n.DUPLICATE_VISIT_INFO;
			var message = prenatalVisitsi18n.VISIT_EXISTS;
			component.generateModalDialog(message, title, "information");
			return;
		}
	}

	var sendAr = [];
	var allBP = [];
	var systolicArray = [];
	var systolicParamString = "";
	var diastolicArray = [];
	var diastolicParamString = "";
	var criterion = this.getCriterion();
	var encntrs = null;
	var encntrStr = "";
	var pregInfoSR = MP_Resources.getSharedResource("pregnancyInfo");
	var pregInfoObj = null;
	var pregnancyId = 0.0;
	var groups = this.getGroups();
	var countText = "";

	var patientGenderInfo = criterion.getPatientInfo().getSex();
	pregInfoObj = pregInfoSR.getResourceData();
	pregnancyId = pregInfoObj.getPregnancyId();

	// Create the parameter array
	sendAr.push("^MINE^", criterion.person_id + ".0");
	sendAr.push(MP_Util.CreateParamArray(this.getEncType(), 1));
	encntrs = criterion.getPersonnelInfo().getViewableEncounters();
	encntrStr = (encntrs) ? "value(" + encntrs + ")" : "0";

	sendAr.push(encntrStr);
	sendAr.push(criterion.provider_id + ".0", criterion.ppr_cd + ".0");
	sendAr.push(pregInfoObj.getLookBack(), MP_Util.CreateParamArray(this.getCumulativeWt(), 1), MP_Util.CreateParamArray(this.getEstGesAge(), 1), MP_Util.CreateParamArray(this.getAntepartumNote(), 1), MP_Util.CreateParamArray(this.getFundalHt(), 1), MP_Util.CreateParamArray(this.getPreSgnAndSym(), 1), MP_Util.CreateParamArray(this.getCervicalDilation(), 1), MP_Util.CreateParamArray(this.getCervicalEffacementLen(), 1), MP_Util.CreateParamArray(this.getCervicalStation(), 1));
	allBP = this.getBPResGroup();
	if (allBP) {
		var len = 0;
		for ( i = 0, len = allBP.length; i < len; i = i + 3) {
			systolicArray.push(allBP[i + 1] + ".0");
			diastolicArray.push(allBP[i + 2] + ".0");
		}
		systolicParamString = "value(" + systolicArray.join(',') + ")";
		diastolicParamString = "value(" + diastolicArray.join(',') + ")";
	}
	else {
		systolicParamString = "0.0";
		diastolicParamString = "0.0";
	}
	sendAr.push(systolicParamString, diastolicParamString, MP_Util.CreateParamArray(this.getWeight(), 1), MP_Util.CreateParamArray(this.getEdema(), 1), MP_Util.CreateParamArray(this.getProtein(), 1), MP_Util.CreateParamArray(this.getGlucose(), 1), MP_Util.CreateParamArray(this.getPresentation(), 1), MP_Util.CreateParamArray(this.getFetalMovement(), 1), MP_Util.CreateParamArray(this.getFetalHrRt(), 1), MP_Util.CreateParamArray(this.getFetalLie(), 1), MP_Util.CreateParamArray(this.getNextAppointment(), 1), MP_Util.CreateParamArray(this.getPain(), 1), MP_Util.CreateParamArray(this.getKetones(), 1), 1, criterion.encntr_id + ".0");

	var scriptRequest = new ComponentScriptRequest();
	scriptRequest.setProgramName("MP_PREG_GET_VISIT_ASSESSMENT");
	scriptRequest.setParameterArray(sendAr);
	scriptRequest.setComponent(this);
	scriptRequest.performRequest();
	scriptRequest.setResponseHandler(function(scriptReply) {
		if (scriptReply.getStatus() === "F") {

			component.generateModalDialog(pvi18n.CHART_FAILURE, pvi18n.ERROR_OCCURED, "error");
			// Error object which will be used to log customized error.
			var discernError = new Error(pvi18n.CHART_FAILURE);
			MP_Util.LogJSError(discernError, component, "prenatal-visits-o2.js", "chartResults");
		}

		if (scriptReply.getStatus() === "S" || scriptReply.getStatus() === "Z") {
			if (scriptReply.getStatus() === "S") {
				component.m_recordDataTodayExists = true;
			}
			if (scriptReply.getStatus() === "Z") {
				var sendAr = [];

				// Create the parameter array
				sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", encntrStr);

				var scriptRequest2 = new ComponentScriptRequest();
				scriptRequest2.setProgramName("MP_PREG_ADD_VISIT");
				scriptRequest2.setParameterArray(sendAr);
				scriptRequest2.setComponent(component);
				scriptRequest2.performRequest();

				scriptRequest2.setResponseHandler(function(scriptReply2) {
				});
			}
			component.m_recordDataToday = scriptReply.getResponse();
			if (component.getShowAmbulatoryView()) {
				component.m_isNewVisitRequiredInTableView = true;
				var card;
				if (component.m_recordDataExists) {
					card = component.renderComponent(component.m_recordData);
				}
				else {
					card = component.renderComponent(component.m_recordDataToday);
				}

				card.encntrId = criterion.encntr_id;
				var contentContainerId = "contentTableContainer" + compId;
				contentTableContainer = $("#" + contentContainerId);
				contentTableContainer.width(component.m_contentTableVisibleWidth);
				var visitLen = component.m_recordData.VISITS.length;
				if (component.m_recordData.VISITS.length == 0) {
					contentTableContainer.find("#" + rootId + "Contenttable").width(component.m_contentTableWidth + 80);
				}
				else {
					contentTableContainer.find("#" + rootId + "Contenttable").width(component.m_contentTableWidth - ((visitLen) * 70));
				}

				component.addFetusListener(card, 1);
				component.attachReactivateFetusListener(card, 1);
				component.disableSign();
				component.postProcessAddingTextBoxes(card, true, true);
				component.m_isNewVisitRequiredInTableView = false;
			}
			else {
				component.m_newVisitCard = component.buildNewVisitEntryCard(component.m_visitCardsObjectsLength, component.m_visitCardsObjects, "");

				$('#visitCard_newCard_' + compId).show();

				if (component.m_recordDataExists) {
					var len = recordData.VISITS.length;

					for ( k = 0; k < len; k++) {
						$('#editCard_' + k + "_" + compId).hide();
					}
					var rootNode = component.getRootComponentNode();
					var visitCardID = "pregCards" + compId;
					var visitCards = $('#' + visitCardID + " div.pv-wf-preg-visit-card");

					for ( i = 0; i < visitCards.length; i++) {
						$(rootNode).find(visitCards[i]).removeClass('pv-wf-selected').addClass('pv-wf-unselected');
					}

					$(rootNode).find('li.pv-wf-selected').removeClass('pv-wf-selected');
					$("#navBarNewVisit" + compId).addClass('pv-wf-selected').show();
				}
			}
			component.disableSign();
			component.m_isNewVisitRequired = false;
		}
	});

};

/**
 * Allows user to delete the visit by clicking delete visit button in direct entry mode..
 *
 * @param visitNumber {integer} - visit to be deleted.
 */
PrenatalVisitsComponentWF.prototype.attachDeleteByClickingChartListener = function(visitNumber) {
	var component = this;
	component.generateDeleteConfirmModalDialog(visitNumber);
};

/**
 * Attaches context menu listeners for delete visit in readonly mode.
 */
PrenatalVisitsComponentWF.prototype.attachDeleteListener = function() {
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var component = MP_Util.GetCompObjById(compId);
	var componentContent = $(component.getSectionContentNode());

	componentContent.off("contextmenu", ".pv-wf-context-menu-delete-card");

	// to display menu on right click on row selected
	componentContent.on("contextmenu", ".pv-wf-context-menu-delete-card", function(event) {
		var selectedInst = this;
		var contextMenu = null;
		var deleteCard = null;
		var pointToIView = null;
		var prenatalVisitsi18n = i18n.discernabu.prenatal_visits_o2;

		contextMenu = MP_MenuManager.getMenuObject("DeleteContextMenu");
		if (!contextMenu) {
			contextMenu = new ContextMenu("DeleteContextMenu").setAnchorElementId("DeleteContextMenuAnchor");
			contextMenu.setAnchorConnectionCorner(["top", "left"]).setContentConnectionCorner(["top", "left"]);

			var compMenuSeperator = new MenuSeparator("compMenuSeperator" + compId);

			deleteCard = new MenuSelection("Delete The Card");
			deleteCard.setLabel(prenatalVisitsi18n.DELETE_VISIT);
			contextMenu.addMenuItem(deleteCard);

			contextMenu.addMenuItem(compMenuSeperator);

			pointToIView = new MenuSelection("Point to IView");
			pointToIView.setLabel(prenatalVisitsi18n.EDIT_IN_IVIEW);
			contextMenu.addMenuItem(pointToIView);

			MP_MenuManager.addMenuObject(contextMenu);

		}

		deleteCard = contextMenu.getMenuItemArray()[0];
		pointToIView = contextMenu.getMenuItemArray()[2];

		deleteCard.setIsDisabled(false);
		pointToIView.setIsDisabled(false);

		contextMenu.setXOffset(event.pageX).setYOffset(event.pageY).setAnchorElement();
		MP_MenuManager.showMenu("DeleteContextMenu");
		contextMenu.removeAnchorElement();

		pointToIView.setClickFunction(function() {
			component.openIView();
		});
		var id = $(this).attr('id');

		deleteCard.setClickFunction(function() {
			var visitNumber;
			if (!component.getShowAmbulatoryView()) {
				visitNumber = id.split("_")[1];
			}
			else {
				visitNumber = id.split("_")[1];
			}
			component.generateDeleteConfirmModalDialog(visitNumber);
		});
		return false;
	});

};

/**
 * Attaches context menu listeners.
 */
PrenatalVisitsComponentWF.prototype.attachListener = function(card) {
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var component = MP_Util.GetCompObjById(compId);
	var componentContent = $(component.getSectionContentNode());

	componentContent.off("contextmenu", ".pv-wf-context-menu");

	// to display menu on right click on row selected
	componentContent.on("contextmenu", ".pv-wf-context-menu", function(event) {
		var selectedInst = this;
		var contextMenu = null;
		var addNewValue = null;
		var pointToIView = null;
		var prenatalVisitsi18n = i18n.discernabu.prenatal_visits_o2;

		contextMenu = MP_MenuManager.getMenuObject("FavoriteContextMenu");
		if (!contextMenu) {
			contextMenu = new ContextMenu("FavoriteContextMenu").setAnchorElementId("FavoriteContextMenuAnchor");
			contextMenu.setAnchorConnectionCorner(["top", "left"]).setContentConnectionCorner(["top", "left"]);

			var compMenuSeperator = new MenuSeparator("compMenuSeperator" + compId);

			addNewValue = new MenuSelection("Add a new value");
			addNewValue.setLabel(prenatalVisitsi18n.ADD_NEW_VALUE);
			contextMenu.addMenuItem(addNewValue);

			contextMenu.addMenuItem(compMenuSeperator);

			pointToIView = new MenuSelection("Point to IView");
			pointToIView.setLabel(prenatalVisitsi18n.EDIT_IN_IVIEW);
			contextMenu.addMenuItem(pointToIView);

			MP_MenuManager.addMenuObject(contextMenu);

		}

		addNewValue = contextMenu.getMenuItemArray()[0];
		pointToIView = contextMenu.getMenuItemArray()[2];

		addNewValue.setIsDisabled(false);
		pointToIView.setIsDisabled(false);

		contextMenu.setXOffset(event.pageX).setYOffset(event.pageY).setAnchorElement();
		MP_MenuManager.showMenu("FavoriteContextMenu");
		contextMenu.removeAnchorElement();

		pointToIView.setClickFunction(function() {
			component.openIView();
		});
		var id = $(this).attr('id');

		addNewValue.setClickFunction(function() {
			component.m_activeFields[component.m_activeFields.length] = id;
			$("#" + id).val("");
			$("#" + id).attr("placeholder", '--');
			$("#" + id).attr('readOnly', false);
			$("#" + id).removeClass('pv-wf-disable-color pv-wf-signed-color pv-wf-context-menu').addClass('pv-wf-unsigned-color');
			var len = id.split("_").length;
			if (id.split("_")[len - 1] == "1") {
				$("#" + id).attr('readOnly', true);
				component.dropDownListeners(id + "dropDown", "", id);
			}
			if (id.split("_")[len - 1] == "2") {
				$("#" + id).attr('readOnly', true);
				component.singleDropDownListeners(id + "dropDown", "", id);
			}

			$("#" + id).focus();
			$("#" + id).removeAttr('tabindex');
			component.postProcessAddingTextBoxes(card, false, false);

			// Get the index of the check-box selected.
			var eventSelected = id.split("_")[0];
			component.pvEventsToChart[eventSelected] = [];
		});

		return false;
	});
};

/**
 * Finds the unit for the event..
 *
 * @param events {Object} - the event from which the units need to be obtained.
 */
PrenatalVisitsComponentWF.prototype.getUnits = function(events) {
	var units = "";
	if (events.length === 1) {
		units = events[0].REF_RANGE_FACTOR[0].UNITS_DISPLAY;
	}

	return units;
};

/**
 * @param card {Object} - the visit card instance which holds the data for the new visit.
 *
 * @param recordDataToday {Object} - the object which contains results if any.
 */
PrenatalVisitsComponentWF.prototype.buildBabyData = function(card, recordDataToday) {
	var component = this;
	var recordData = this.getRecordData();
	var babyArrayindexes = [];
	var babyArrayindexesToday = [];
	var eventResultsArray = [];
	var babyObjectsArrayToday = this.generateBabyLabelArray(babyArrayindexesToday, eventResultsArray, recordDataToday);
	var babyLabelId = "";

	var babyLabelLength = recordDataToday.BABY_LABEL.length;
	for ( i = 0; i < babyLabelLength; i++) {
		babyLabelId = String(recordDataToday.BABY_LABEL[i].DYNAMIC_LABEL_ID);
		component.m_babyLabelStatusInstanceArr[babyLabelId] = new this.babyLabelStatusInstance();
		component.m_babyLabelStatusInstanceArr[babyLabelId].BABY_LABEL_ID = recordDataToday.BABY_LABEL[i].DYNAMIC_LABEL_ID;
		component.m_babyLabelStatusInstanceArr[babyLabelId].STATUS = recordDataToday.BABY_LABEL[i].IS_DYNAMIC_LABEL_ACTIVE;
	}

	card.numberOfBabies = babyArrayindexesToday.length;
	card.numberOfBabiesInitial = babyArrayindexesToday.length;
	card.babyLabels = [];
	card.babyLabelObjects = [];
	card.babyLabelIds = [];
	card.babyLabelStat = [];
	card.newBabyLabelIndex = 0;
	card.newFetusIdCnt = 0;
	card.addFetusEnabled = false;
	card.numberOfAddBabyLinks = 0;
	card.numberOfNewlyAddedBabies = 0;

	var missingVal = "--";

	var babyArrayindexesTodayLength = babyArrayindexesToday.length;

	for ( i = 0; i < babyArrayindexesTodayLength; i++) {
		card.babyLabels[i] = babyObjectsArrayToday[babyArrayindexesToday[i]].LABEL;
		card.fhr[i] = babyObjectsArrayToday[babyArrayindexesToday[i]].FHR_VALUE[0];
		card.fetalLie[i] = babyObjectsArrayToday[babyArrayindexesToday[i]].LIE_VALUE[0];
		card.fetalPresent[i] = babyObjectsArrayToday[babyArrayindexesToday[i]].PRESENT_VALUE[0];
		card.fetalMovement[i] = babyObjectsArrayToday[babyArrayindexesToday[i]].MOVE_VALUE[0];
		card.babyLabelIds[i] = babyObjectsArrayToday[babyArrayindexesToday[i]].DYNAMIC_LABEL_ID;
		card.babyLabelStat[i] = component.m_babyLabelStatusInstanceArr[String(babyObjectsArrayToday[babyArrayindexesToday[i]].DYNAMIC_LABEL_ID)].STATUS;
	}

};

/**
 * Builds the direct entry pane.
 *
 * @param cardNumber {integer} - the card number for which the direct entry pane is created
 *
 * @param card {object} - current selected visit card instance
 */
PrenatalVisitsComponentWF.prototype.buildEditPane = function(cardNumber, card) {
	var prenatalVisitsi18n = i18n.discernabu.prenatal_visits_o2;
	var dtaResults = this.m_dtaResults;
	var compId = this.getComponentId();

	card.dropDowns = [];
	card.singleDropDowns = [];
	var editPnelHTML = "<div class='pv-wf-edit-panel-hdr'><div class='pv-wf-edit-panel-left'><div  class='pv-wf-edit-panel-sign-holder'><div id='" + "sign_" + compId + "' class='pv-wf-edit-panel-sign pv-wf-edit-panel-sign-enabled'></div></div><div class='pv-wf-edit-panel-visit-date'><span>" + card.visitDate + "&nbsp;&nbsp|</span></div><div class='pv-wf-edit-panel-ega'><div class='pv-wf-ega-edit-panel-rslt'><span>" + card.ega + "</span></div></div></div><div class='pv-wf-edit-panel-right'><div class='pv-wf-edit-panel-close-holder'><div id='" + "cancel_" + compId + "' class='pv-wf-edit-panel-close'></div></div></div></div>";
	editPnelHTML += "<div class='pv-wf-edit-pane-patient-data'><dl class='pv-wf-preg-edit-data-labels'><dt class='pv-wf-pt-data-fundalheight-value'>" + prenatalVisitsi18n.FUNDAL_HEIGHT + "</dt><dt class='pv-wf-pt-data-pretermsigns-value'>" + prenatalVisitsi18n.PRETERMSIGNS + "</dt></dl>";
	editPnelHTML += "<dl><dt></dt><dd class='pv-wf-fundalheight-val'>" + this.generateField(dtaResults.FUNDAL_HEIGHT_REC_DTA, "pv-wf-fundalheight-input", "fundalText_" + compId, card.fundalHeight, card) + "</dd><dt></dt><dd class = 'pv-wf-fundalheight-space'></dd><dt></dt><dd class='pv-wf-pt-data-fundalheight-unit'>" + this.getUnits(dtaResults.FUNDAL_HEIGHT_REC_DTA) + "</dd><dt></dt><dd class='pv-wf-pretermsigns-val'>";
	editPnelHTML += this.generateField(dtaResults.PRETERM_SIGNS_REC_DTA, "pv-wf-pretermsigns-input", "pretermText_" + compId, card.pretermSigns, card);
	editPnelHTML += "</dd></dl>";
	editPnelHTML += "<dl class='pv-wf-preg-edit-data-labels'><dt class='pv-wf-pt-data-cervical'>" + prenatalVisitsi18n.CERVICALEXAM + "</dt><dt class='pv-wf-pt-data-bp'>" + prenatalVisitsi18n.BP + "</dt><dt class='pv-wf-pt-data-weight'>" + prenatalVisitsi18n.WEIGHT + "</dt></dl>";

	editPnelHTML += "<dl><dt></dt><dd class='pv-wf-dilation-val'>" + this.generateField(dtaResults.CERVICAL_DIL_REC_DTA, "pv-wf-dilation-input", "dilationText_" + compId, card.dilation, card) + "</dd>";
	editPnelHTML += "<dt></dt><dd class='pv-wf-dilation-space'></dd><dt></dt><dd class='pv-wf-pt-data-effacement-unit'>" + this.getUnits(dtaResults.CERVICAL_DIL_REC_DTA) + "&nbsp;/</dd>";
	editPnelHTML += "<dt></dt><dd class='pv-wf-dilation-val'>" + this.generateField(dtaResults.CERVICAL_EFF_REC_DTA, "pv-wf-dilation-input", "effacementText_" + compId, card.effacement, card) + "</dd>";
	editPnelHTML += "<dt></dt><dd class='pv-wf-dilation-space'></dd><dt></dt><dd class='pv-wf-pt-data-effacement-unit'>" + this.getUnits(dtaResults.CERVICAL_EFF_REC_DTA) + "&nbsp;/</dd><dt></dt>";
	editPnelHTML += "<dd class='pv-wf-dilation-val'>" + this.generateField(dtaResults.CERVICAL_STAT_REC_DTA, "pv-wf-station-input", "stationText_" + compId, card.station, card) + "</dd>";
	editPnelHTML += "<dt></dt><dd class='pv-wf-station-space'></dd><dt></dt><dd class='pv-wf-systolic-val'>" + this.generateField(dtaResults.SYS_BP_REC_DTA, "pv-wf-systolic-input", "systolicText_" + compId, card.systolic, card) + "</dd><dt></dt>";
	editPnelHTML += "<dt></dt><dd class='pv-wf-systolic-space'></dd><dd class='pv-wf-pt-data-bp-seperator'>&nbsp;/&nbsp;</dd><dt></dt>";
	editPnelHTML += "<dd class='pv-wf-diastolic-val'>" + this.generateField(dtaResults.DIA_BP_REC_DTA, "pv-wf-diastolic-input", "diastolicText_" + compId, card.diastolic, card) + "</dd>";
	editPnelHTML += "<dt></dt><dd class = 'pv-wf-diastolic-space'></dd><dt></dt><dd class = 'pv-wf-weight-val'>" + this.generateField(dtaResults.WEIGHT_REC_DTA, "pv-wf-weight-input", "weightText_" + compId, card.weight, card) + "</dd>";
	editPnelHTML += "<dt></dt><dd class='pv-wf-weight-space'></dd><dt></dt><dd class='pv-wf-pt-data-weight-unit'>&nbsp;" + this.getUnits(dtaResults.WEIGHT_REC_DTA) + "</dd></dl>";

	editPnelHTML += "<dl class='pv-wf-urine-border-height'><span class='pv-wf-entry-panel-urine-borders  pv-wf-entry-panel-left-urine-border'></span><span class='pv-wf-entry-panel-urine-lbl'>" + prenatalVisitsi18n.URINE + "</span><span class='pv-wf-entry-panel-urine-borders pv-wf-entry-panel-right-urine-border'></span></dl>";

	editPnelHTML += "<dl class='pv-wf-preg-edit-data-labels'><dt class='pv-wf-pt-data-four'>" + prenatalVisitsi18n.EDEMA + "</dt><dt class='pv-wf-pt-data-four'>" + prenatalVisitsi18n.PROTEIN + "</dt><dt class='pv-wf-pt-data-four'>" + prenatalVisitsi18n.GLUCOSE + "</dt><dt class='pv-wf-pt-data-four'>" + prenatalVisitsi18n.KETONES + "</dt></dl>";
	editPnelHTML += "<dl><dt></dt><dd class='pv-wf-edema-val'>";
	editPnelHTML += this.generateField(dtaResults.EDEMA_REC_DTA, "pv-wf-edema-input", "edemaText_" + compId, card.edema, card);
	editPnelHTML += "</dd><dt></dt><dd class='pv-wf-edema-space'></dd><dt></dt><dt></dt><dd></dd><dd class='pv-wf-protein-val'>";
	editPnelHTML += this.generateField(dtaResults.URINE_PROTEIN_REC_DTA, "pv-wf-protein-input", "proteinText_" + compId, card.protein, card);

	editPnelHTML += "<dt></dt><dd class='pv-wf-protein-space'></dd><dt></dt><dd class='pv-wf-glucose-val'>";

	editPnelHTML += this.generateField(dtaResults.URINE_GLUCOSE_REC_DTA, "pv-wf-glucose-input", "glucoseText_" + compId, card.glucose, card);
	editPnelHTML += "</dd><dt></dt><dd class='pv-wf-glucose-space'></dd><dt></dt><dd class='pv-wf-ketones-val'>";

	editPnelHTML += this.generateField(dtaResults.URINE_KETONES_REC_DTA, "pv-wf-ketones-input", "ktonesText_" + compId, card.ketones, card);
	editPnelHTML += "</dd><dt></dt><dd class='pv-wf-ketones-space'></d></dl></div>";
	card.addFetusEnabled = this.checkTemplateIdEquality(card);
	var isFetalLiePresent = (this.getFetalLie().length > 0) ? true : false;
	var fetalLieClass = "";
	var fetalLieHTMLTag = "";

	if (isFetalLiePresent) {
		fetalLieClass = "pv-wf-pt-data-four";
		fetalLieHTMLTag = "<dt class='" + fetalLieClass + "'>" + prenatalVisitsi18n.FETAL_LIE + "</dt>";
	}
	else {
		fetalLieClass = "pv-wf-pt-data-fetal-no-lie";
		fetalLieHTMLTag = "";
	}

	editPnelHTML += "<div class='pv-wf-fetal-data' id='fetalInfo" + compId + "'><dl class='pv-wf-fetal-border-height'>";
	editPnelHTML += "<span class='pv-wf-edit-pane-fetal-borders pv-wf-edit-pane-left-fetal-border'></span>";
	editPnelHTML += "<span class='pv-wf-entry-panel-urine-lbl'>" + prenatalVisitsi18n.FETAL + "</span>";
	editPnelHTML += "<span class='pv-wf-edit-pane-fetal-borders pv-wf-edit-pane-right-fetal-border'></span>";
	editPnelHTML += "<span class='pv-wf-add-fetus'><a tabindex='-1' href='#' id='addFetus" + compId + "' >" + prenatalVisitsi18n.ADD_BABY + "</a></span></dl>";
	editPnelHTML += "<dl class='pv-wf-preg-edit-data-labels'><dt class='" + fetalLieClass + "'>" + prenatalVisitsi18n.FETAL_PRESENT;
	editPnelHTML += "</dt><dt class='" + fetalLieClass + "'>" + prenatalVisitsi18n.FETAL_MOVE + "</dt><dt class='" + fetalLieClass + "'>";
	editPnelHTML += prenatalVisitsi18n.FETAL_HR + "</dt>" + fetalLieHTMLTag + "</dl>";
	if (this.m_isNewVisitRequired) {
		if (this.m_recordDataTodayExists) {
			this.buildBabyData(card, this.m_recordDataToday);
		}
	}
	for ( k = 0; k < card.numberOfBabies; k++) {

		editPnelHTML += this.generateFetalSection(card, k, false);
	}

	editPnelHTML += "</div>";
	var textClass = 'pv-wf-comments-input pv-wf-card-de-text-box pv-wf-card-comment-box';
	var readAttr = "readonly";
	var commentsValue = card.comments;
	if (dtaResults.COMMENT_REC_DTA.length !== 1) {
		textClass = textClass + " pv-wf-disable-color";
		readAttr = "readonly";
	}
	else {
		var eventType = dtaResults.COMMENT_REC_DTA[0].EVENT_CODE_TYPE;
		if (eventType === "FREETEXT") {
			if (commentsValue == '--') {
				textClass = textClass + " pv-wf-unsigned-color";
				readAttr = "";
				commentsValue = "";
				this.m_activeFields[this.m_activeFields.length] = "commentsText_" + compId;
			}
			else {
				textClass = textClass + " pv-wf-signed-color pv-wf-context-menu";
				readAttr = "readonly";
			}
		}
		else {
			textClass = textClass + " pv-wf-disable-color";
			readAttr = "readonly";
		}

	}

	editPnelHTML += "<div class='pv-wf-comments-data'><dl class='pv-wf-preg-edit-data-labels'><dt class='pv-wf-pt-data-comment'>" + prenatalVisitsi18n.COMMENTS + "</dt></dl>";
	if (commentsValue === "") {
		editPnelHTML += "<dl><dt></dt><dd class='pv-wf-pt-data-comments-value'><textarea  placeholder = '" + prenatalVisitsi18n.ADD_COMMENT + "' id='" + "commentsText_" + compId + "' class ='" + textClass + " '" + readAttr + ">" + commentsValue + "</textarea></dd></dl></div>";
	}
	else {
		editPnelHTML += "<dl><dt></dt><dd class='pv-wf-pt-data-comments-value'><textarea  tabindex='-1' placeholder = '" + prenatalVisitsi18n.ADD_COMMENT + "' id='" + "commentsText_" + compId + "' class ='" + textClass + " '" + readAttr + ">" + commentsValue + "</textarea></dd></dl></div>";
	}
	editPnelHTML += "<div class='pv-wf-nextappt-data'><dl class='pv-wf-preg-edit-data-labels'><dt class='pv-wf-pt-data-nextappt'>" + prenatalVisitsi18n.NEXT_APPOINTMENT + "</dt><dd class='pv-wf-pt-data-nextappt-value'>" + this.generateField(dtaResults.NEXT_APPT_REC_DTA, "pv-wf-nextappt-input", "apptmentText_" + compId, card.nextAppt, card) + "</dd>";
	editPnelHTML += "<dt class='pv-wf-pt-data-weeks'>" + this.getUnits(dtaResults.NEXT_APPT_REC_DTA) + "</dt>";

	if (!this.m_encntrBasedDisplayChoosen && !this.m_isNewVisitRequired) {
		editPnelHTML += "<dt class='pv-wf-pt-data-weeks'><a id='deleteVisit_" + cardNumber + "_" + compId + "'>" + prenatalVisitsi18n.DELETE_VISIT + "</a></dt>";

	}
	editPnelHTML += "</dl></div>";

	return editPnelHTML;

};

/**
 * Checks of the equality of template ids of baby labels
 *
 * @param card {Object} - visit card instance
 */
PrenatalVisitsComponentWF.prototype.checkTemplateIdEquality = function(card) {
	var dtaResults = this.m_dtaResults;
	var templateIds = [];
	var i = 0;
	if (dtaResults.FETAL_PRES_REC_DTA.length == 1) {

		templateIds[i] = dtaResults.FETAL_PRES_REC_DTA[0].LABEL_TEMPLATE_ID;
		i++;
	}
	if (dtaResults.FETAL_MOVE_REC_DTA.length == 1) {
		templateIds[i] = dtaResults.FETAL_MOVE_REC_DTA[0].LABEL_TEMPLATE_ID;
		i++;
	}

	if (dtaResults.FHR_REC_DTA.length == 1) {
		templateIds[i] = dtaResults.FHR_REC_DTA[0].LABEL_TEMPLATE_ID;
		i++;
	}
	if (dtaResults.FETAL_LIE_REC_DTA.length == 1) {
		templateIds[i] = dtaResults.FETAL_LIE_REC_DTA[0].LABEL_TEMPLATE_ID;
		i++;
	}

	var equal = true;
	for ( k = 0; k < i; k++) {
		for ( j = 0; j < i; j++) {
			if (templateIds[k] != templateIds[j]) {
				equal = false;
			}
		}
	}

	if (equal) {
		this.m_addFetusEnabled = equal;
		card.templateId = templateIds[0];
	}
	else {
		card.templateId = 0;
	}

	return equal;
};

/**
 * Creates a dropdown with value and CSS properties passed.
 *
 * @param dropDownId {string} - unique id of the drop down created
 *
 * @param textClass {string} - CSS class for the text box used in the drop down
 *
 * @param textId {string} - id of the text box used in the drop down
 *
 * @param value {string} - value displayed in the text box
 *
 * @param eventValues {array} - values from DTA
 *
 * @param nomenclature_ids {array} - nomenclature ids from DTA
 */
PrenatalVisitsComponentWF.prototype.generateDropDown = function(dropDownId, textClass, textId, value, eventValues, nomenclature_ids) {
	var dropDown = "";
	var compId = this.getComponentId();
	var missingValue = "--";

	textClass += " pv-wf-drop-down-indicator";
	if (value == missingValue) {
		this.m_activeFields[this.m_activeFields.length] = textId;
		dropDown = '<div id="' + dropDownId + '" class="pv-wf-drop-down-props"><div class="pv-wf-dropdown"><div class="pv-wf-selected-values"><input class="' + textClass + '"  id="' + textId + '" placeholder="--" value=""></div>';
		dropDown += '<div class="pv-wf-mutli-select"><ul class="pv-wf-dropbox-style pv-wf-items-list pv-wf-dropdown-deactive">';
	}
	else {
		dropDown = '<div id="' + dropDownId + '" class="pv-wf-drop-down-props"><div class="pv-wf-dropdown"><div class="pv-wf-selected-values"><input tabindex = "-1" class="' + textClass + '" readOnly id="' + textId + '" value="' + value + '"></div>';
		dropDown += '<div class="pv-wf-mutli-select"><ul class="pv-wf-dropbox-style pv-wf-items-list pv-wf-dropdown-deactive">';

	}
	for (var i = 0; i < eventValues.length; i++) {
		dropDown += '<li><input type="checkbox" id= "' + nomenclature_ids[i] + '_' + compId + '" value="' + eventValues[i] + '" class="pv-wf-chk-multi-values" />' + " " + eventValues[i] + '</li>';
	}
	dropDown += '</ul></div></div></div>';

	return dropDown;
};

/**
 * Creates a single select dropdown with value and CSS properties passed.
 *
 * @param dropDownId {string} - unique id of the drop down created
 *
 * @param textClass {string} - CSS class for the text box used in the drop down
 *
 * @param textId {string} - id of the text box used in the drop down
 *
 * @param value {string} - value displayed in the text box
 *
 * @param eventValues {array} - values from DTA
 *
 * @param nomenclature_ids {array} - nomenclature ids from DTA
 *
 * @param isEmptyValueRequired {boolean} - whether an empty value is required show at the beginning of dropdown list
 */
PrenatalVisitsComponentWF.prototype.generateSingleDropDown = function(dropDownId, textClass, textId, value, eventValues, nomenclature_ids, isEmptyValueRequired) {
	var dropDown = "";
	var compId = this.getComponentId();
	var listIndex = 0;
	var resultIndex = 0;

	textClass += " pv-wf-drop-down-indicator";
	if (value == "--") {
		this.m_activeFields[this.m_activeFields.length] = textId;
		value = "";
	}

	var inputTag = '<input class="' + textClass + ' " placeholder="--" readOnly id="' + textId + '" value="' + value + '"';
	// If any earlier charted value exists, show the value in dither mode and set tabindex = -1 so that on tabbing
	// the dithered field will not be focused.
	inputTag += value === "" ? '>' : ' value="' + value + '" tabindex="-1">';

	dropDown = '<div id="' + dropDownId + '" class="pv-wf-drop-down-props"><div class="pv-wf-dropdown"><div class="pv-wf-selected-values">' + inputTag + '</div>';
	dropDown += '<div class="pv-wf-mutli-select"><ul class="pv-wf-dropbox-style pv-wf-items-list pv-wf-dropdown-deactive">';

	if (isEmptyValueRequired) {
		dropDown += '<li class ="pv-wf-single-drop-down" id= "0_' + compId + '_' + listIndex + '"><input  class="pv-wf-chk-multi-values pv-wf-text-single-dropdown" value=""/></li>';
		listIndex++;
	}

	for ( resultIndex = 0; resultIndex < eventValues.length; resultIndex++, listIndex++) {
		dropDown += '<li class ="pv-wf-single-drop-down" id= "' + nomenclature_ids[resultIndex] + '_' + compId + '_' + listIndex + '"><input  class="pv-wf-chk-multi-values pv-wf-text-single-dropdown" value="' + eventValues[resultIndex] + '"/></li>';
	}
	dropDown += '</ul></div></div></div>';

	return dropDown;
};

/**
 * Creates a fetus row with details such as present, movement, lie and FHR.
 *
 * @param card {object} - card for which the fetal row is created
 *
 * @param babyNumber {integer} - the index for the fetus
 *
 * @param isNewBaby {boolean} - indicates if the fetal section is added for a new baby
 */
PrenatalVisitsComponentWF.prototype.generateFetalSection = function(card, babyNumber, isNewBaby) {
	var pvi18n = i18n.discernabu.prenatal_visits_o2;
	var dtaResults = this.m_dtaResults;
	var isFetalLiePresent = (this.getFetalLie().length > 0) ? true : false;
	var compId = this.getComponentId();
	var addFetusId = card.newFetusIdCnt + "_" + babyNumber + "_" + compId;
	var fetusId = babyNumber + "_" + compId;
	var babyLabel = "[" + card.babyLabels[babyNumber] + "]";
	var babyLabelClass = "pv-wf-fetal-baby-label ";

	babyLabelClass += isNewBaby ? "pv-wf-unsigned-color" : "";

	if (!isNewBaby) {
		if (!card.babyLabelStat[babyNumber]) {
			var reactivateBabyLabel = pvi18n.REACTIVATE + " " + babyLabel;
			fetalSection = "<div id='fetalSectionDiv_" + fetusId + "' class='pv-wf-fetal-section-div'><dl id='fetalSection_" + fetusId + "'><dt></dt><dd ><div class='pv-wf-fetal-baby-label'>" + babyLabel + "</div></dd>";
			fetalSection += "<span class='pv-wf-add-fetus pv-wf-baby-reactivate-props'><a tabindex='-1' href='#' class='pv-wf-baby-reactivate' id='reactivateBabyLink_" + fetusId + "' >" + reactivateBabyLabel + "</a></span></dl></div>";
			return fetalSection;
		}
	}

	if (isFetalLiePresent) {
		fetalSection = "<div id='fetalSectionDiv_" + fetusId + "' class='pv-wf-fetal-section-div'><dl id='fetalSection_" + fetusId + "'><dt></dt><dd ><div class='" + babyLabelClass + "'>" + babyLabel + "</div></dd><dt></dt><dd class='pv-wf-fetal-val'>";

		fetalSection += this.generateField(dtaResults.FETAL_PRES_REC_DTA, "pv-wf-fetal-input", "presentText_" + addFetusId, card.fetalPresent[babyNumber], card);

		fetalSection += "</dd><dt></dt><dd class='pv-wf-fetal-space'></dd><dt></dt><dd class='pv-wf-fetal-val'>" + this.generateField(dtaResults.FETAL_MOVE_REC_DTA, 'pv-wf-fetal-input', "moveText_" + addFetusId, card.fetalMovement[babyNumber], card) + "</dd>";
		fetalSection += "<dt></dt><dd class='pv-wf-fetal-space'></dd><dt></dt><dd class='pv-wf-fetal-val'>" + this.generateField(dtaResults.FHR_REC_DTA, 'pv-wf-fetal-input', 'fhrText_' + addFetusId, card.fhr[babyNumber], card) + "<dt></dt><dd class='pv-wf-fetal-space'></dd><dt></dt>";
		fetalSection += "<dd class='pv-wf-fetal-val'>" + this.generateField(dtaResults.FETAL_LIE_REC_DTA, 'pv-wf-fetal-input', 'fetalLieText_' + addFetusId, card.fetalLie[babyNumber], card) + "</dd>";
		if (!isNewBaby) {
			fetalSection += "<dt></dt><dd class='pv-wf-fetal-lie-space'><dt></dt></dd><dd><div id='inactivateFetus_" + fetusId + "' class='pv-wf-inactivate-indicator'></div></dd>";
		}
		fetalSection += "</dl></div>";
		return fetalSection;
	}
	else {
		fetalSection = "<div id='fetalSectionDiv_" + fetusId + "'><dl id='fetalSection_" + fetusId + "' class='pv-wf-fetal-section-div'><dt></dt><dd ><div class='" + babyLabelClass + "'>" + babyLabel + "</div></dd><dt></dt><dd class='pv-wf-fetal-val-nolie'>";

		fetalSection += this.generateField(dtaResults.FETAL_PRES_REC_DTA, "pv-wf-fetal-input-nolie", "presentText_" + addFetusId, card.fetalPresent[babyNumber], card);

		fetalSection += "</dd><dt></dt><dd class='pv-wf-fetal-space-nolie'></dd><dt></dt><dd class='pv-wf-fetal-val-nolie'>" + this.generateField(dtaResults.FETAL_MOVE_REC_DTA, 'pv-wf-fetal-input-nolie', "moveText_" + addFetusId, card.fetalMovement[babyNumber], card) + "</dd>";
		fetalSection += "<dt></dt><dt></dt><dd class='pv-wf-fetal-space-nolie'></dd><dd class='pv-wf-fetal-val-nolie'>" + this.generateField(dtaResults.FHR_REC_DTA, 'pv-wf-fetal-input-nolie', 'fhrText_' + addFetusId, card.fhr[babyNumber], card) + "<dt></dt><dd class='pv-wf-fetal-space-nolie'></dd>";
		if (!isNewBaby) {
			fetalSection += "<dt></dt><dd><div id='inactivateFetus_" + fetusId + "' class='pv-wf-inactivate-indicator'></div></dd>";
		}
		fetalSection += "</dl></div>";
		return fetalSection;
	}
};

/**
 * Creates a fetus row with details such as present, movement, lie and FHR for table view.
 *
 * @param card {object} - card for which the fetal row is created
 *
 * @param babyNumber {integer} - the index for the fetus
 *
 * @param isNewBaby {boolean} - indicates if the fetal section is added for a new baby
 */
PrenatalVisitsComponentWF.prototype.generateFetalSectionTabView = function(card, babyNumber, isNewBaby) {
	var pvi18n = i18n.discernabu.prenatal_visits_o2;
	var dtaResults = this.m_dtaResults;
	var isFetalLiePresent = (this.getFetalLie().length > 0) ? true : false;
	var compId = this.getComponentId();
	var addFetusId = card.newFetusIdCnt + "_" + babyNumber + "_" + compId;
	var fetusId = babyNumber + "_" + compId;
	var babyLabel = card.babyLabels[babyNumber];
	var babyLabelClass = "pv-wf-fetal-baby-label ";
	babyLabelClass += isNewBaby ? "pv-wf-unsigned-color" : "";
	var editableFetalColumn = "";
	$('#addFetus' + compId + card.numberOfAddBabyLinks).hide();
	card.numberOfAddBabyLinks++;
	var addBabyLink = "<div class='pv-wf-display-inline' id = 'addFetus" + compId + card.numberOfAddBabyLinks + "'><a id= 'addFetus" + compId + "' class='pv-wf-edit-control-position-new'>" + pvi18n.ADD_BABY + "</a></div>";

	editableFetalColumn += " <div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-header'><div class=' pv-wf-baby-label-tb-header-edit-margin'>" + babyLabel + "</div></div>";
	editableFetalColumn += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + this.generateField(dtaResults.FETAL_PRES_REC_DTA, 'pv-wf-edit-control-position', "presentText_" + addFetusId, card.fetalPresent[babyNumber], card) + "</div>";
	editableFetalColumn += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + this.generateField(dtaResults.FHR_REC_DTA, 'pv-wf-edit-control-position', "fhrText_" + addFetusId, card.fhr[babyNumber], card) + "</div>";
	if (!isFetalLiePresent) {

		editableFetalColumn += "<div  class='pv-wf-display-inline pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + this.generateField(dtaResults.FETAL_MOVE_REC_DTA, 'pv-wf-edit-control-position pv-wf-display-inline', "moveText_" + addFetusId, card.fetalMovement[babyNumber], card) + "</div>";
		editableFetalColumn += addBabyLink;
	}
	else {
		editableFetalColumn += "<div class='pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + this.generateField(dtaResults.FETAL_MOVE_REC_DTA, 'pv-wf-edit-control-position', "moveText_" + addFetusId, card.fetalMovement[babyNumber], card) + "</div>";

	}
	if (isFetalLiePresent) {

		editableFetalColumn += "<div class='pv-wf-display-inline pv-wf-baby-label-tb pv-wf-baby-label-tb-theme-blue pv-wf-baby-label-tb-theme-font'>" + this.generateField(dtaResults.FETAL_LIE_REC_DTA, 'pv-wf-edit-control-position', "fetalLieText_" + addFetusId, card.fetalLie[babyNumber], card) + "</div>";
		editableFetalColumn += addBabyLink;
	}

	return editableFetalColumn;
};

/**
 * Creates a text with value and CSS properties passed.
 *
 * @param textBoxClass {string} - class representing the CSS properties for the text box
 *
 * @param textId {string} - unique id for the text box
 *
 * @param value {string} - value to be displayed in the field
 */
PrenatalVisitsComponentWF.prototype.generateTextBox = function(textBoxClass, textId, value) {
	var textBox;
	if (value == "--") {
		this.m_activeFields[this.m_activeFields.length] = textId;
		textBox = "<input type = 'text' placeholder='--' class ='" + textBoxClass + "' id = '" + textId + "' value=''>";
	}
	else {
		textBox = "<input type = 'text'  tabindex = '-1' readOnly class ='" + textBoxClass + "' id = '" + textId + "' value = '" + value + "'>";
	}

	return textBox;
};

/**
 * Creates a modal dialog for error messages.
 *
 * @param errorMessage {string} - error message to be displayed
 *
 */
PrenatalVisitsComponentWF.prototype.generateModalDialog = function(errorMessage, title, type) {
	var prenatalVisitsi18n = i18n.discernabu.prenatal_visits_o2;
	var modalObj = MP_Util.generateModalDialogBody("errorMEssage", type, "", errorMessage);
	var closeButton = modalObj.getFooterButton("closeButton");
	if (!closeButton) {
		closeButton = new ModalButton("closeButton");
		closeButton.setText(prenatalVisitsi18n.CLOSE);
		closeButton.setFocusInd(true).setOnClickFunction(function() {
			MP_ModalDialog.closeModalDialog("error");
		});
		modalObj.addFooterButton(closeButton);
		modalObj.setShowCloseIcon(false);
	}

	modalObj.setHeaderTitle(title);
	modalObj.setFooterButtonText("closeButton", prenatalVisitsi18n.CLOSE);
	MP_ModalDialog.updateModalDialogObject(modalObj);
	MP_ModalDialog.showModalDialog("errorMEssage");
};

/**
 * Creates a modal dialog for error messages.
 *
 * @param errorMessage {string} - error message to be displayed
 *
 */
PrenatalVisitsComponentWF.prototype.generateCriticalErrorModalDialog = function(errorMessage, textId) {
	var prenatalVisitsi18n = i18n.discernabu.prenatal_visits_o2;
	var modalObj = MP_Util.generateModalDialogBody("criticalRangeValidation", "warning", "", errorMessage);
	this.m_textBoxId = textId;
	var component = this;

	var yesButton = modalObj.getFooterButton("criticalErrYesButton");
	if (!yesButton) {
		yesButton = new ModalButton("criticalErrYesButton");
		yesButton.setText(prenatalVisitsi18n.YES);
		yesButton.setFocusInd(true).setOnClickFunction(function() {
			MP_ModalDialog.closeModalDialog("criticalErr");
		});
		modalObj.addFooterButton(yesButton);
		modalObj.setShowCloseIcon(false);
	}

	var noButton = modalObj.getFooterButton("criticalErrNoButton");
	if (!noButton) {
		noButton = new ModalButton("criticalErrNoButton");
		noButton.setText(prenatalVisitsi18n.NO);
		noButton.setFocusInd(true).setOnClickFunction(function() {
			$("#" + component.m_textBoxId).val("");
			$("#" + component.m_textBoxId).focus();
			MP_ModalDialog.closeModalDialog("criticalErr");
		});
		modalObj.addFooterButton(noButton);
		modalObj.setShowCloseIcon(false);
	}
	modalObj.setHeaderTitle(prenatalVisitsi18n.WARNING);
	modalObj.setFooterButtonText("criticalErrYesButton", prenatalVisitsi18n.YES);
	modalObj.setFooterButtonText("criticalErrNoButton", prenatalVisitsi18n.NO);
	MP_ModalDialog.updateModalDialogObject(modalObj);
	MP_ModalDialog.showModalDialog("criticalRangeValidation");
};

/**
 * Creates a modal dialog for delete confirmation..
 *
 * @param visitNumber {integer} - visit to be deleted
 *
 */
PrenatalVisitsComponentWF.prototype.generateDeleteConfirmModalDialog = function(visitNumber) {
	var prenatalVisitsi18n = i18n.discernabu.prenatal_visits_o2;
	var message = prenatalVisitsi18n.DELETE_VISIT_MESSAGE;
	var modalObj = MP_Util.generateModalDialogBody("deleteConfirmMessage", "warning", "", message);
	var component = this;
	var recordData = component.getRecordData();
	var visitDate = "";

	var date = new Date();
	if (recordData.VISITS[visitNumber].VISIT_DATE !== "") {
		date.setISO8601(recordData.VISITS[visitNumber].VISIT_DATE);
		visitDate = date.format("mmm dd, yyyy");
	}

	var header = prenatalVisitsi18n.DELETE + " " + visitDate + " " + prenatalVisitsi18n.VISIT;

	var yesButton = modalObj.getFooterButton("deleteConfirmMessageYesButton");
	if (!yesButton) {
		yesButton = new ModalButton("deleteConfirmMessageYesButton");
		yesButton.setText(prenatalVisitsi18n.YES);
		yesButton.setFocusInd(true).setOnClickFunction(function() {
			component.deleteVisit(visitNumber);
		});
		modalObj.addFooterButton(yesButton);
		modalObj.setShowCloseIcon(false);
	}

	modalObj.setHeaderTitle(header);
	modalObj.setShowCloseIcon(true);
	modalObj.setFooterButtonText("deleteConfirmMessageYesButton", prenatalVisitsi18n.CONFIRM);
	MP_ModalDialog.updateModalDialogObject(modalObj);
	MP_ModalDialog.showModalDialog("deleteConfirmMessage");
};

/**
 * Deletes a visit with the visit number passed.
 *
 * @param visitNumber {integer} - visit to be deleted
 *
 */
PrenatalVisitsComponentWF.prototype.deleteVisit = function(visitNumber) {
	var component = this;
	var recordData = component.getRecordData();
	// var visitDate = "";
	// var date = new Date();
	// if (recordData.VISITS[visitNumber].VISIT_DATE !== "") {
	// date.setISO8601(recordData.VISITS[visitNumber].VISIT_DATE);
	// visitDate = date.format("mm/dd/yyyy");
	// }

	var sendAr = [];

	var criterion = component.getCriterion();
	var prsnlInfo = criterion.getPersonnelInfo();
	var encntrs = prsnlInfo.getViewableEncounters();
	var encntrVal = (encntrs) ? "value(" + encntrs + ")" : "0.0";

	// Create the parameter array
	sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", encntrVal, "^" + recordData.VISITS[visitNumber].VISIT_DATE_DISPLAY + "^");
	var scriptRequest = new ComponentScriptRequest();
	scriptRequest.setProgramName("MP_PREG_DELETE_VISIT");
	scriptRequest.setParameterArray(sendAr);
	scriptRequest.setComponent(component);

	scriptRequest.performRequest();

	scriptRequest.setResponseHandler(function(scriptReply) {
		if (scriptReply.getStatus() === "F") {
			component.generateModalDialog(pvi18n.CHART_FAILURE, pvi18n.ERROR_OCCURED, "error");
			// Error object which will be used to log customized error.
			var discernError = new Error(pvi18n.CHART_FAILURE);
			MP_Util.LogJSError(discernError, component, "prenatal-visits-o2.js", "chartResults");
		}
		else {
			component.retrieveComponentData();
		}

	});
};

/**
 * Sort an array by the dynamic label, with a lack of label sorted to the bottom of the list
 *
 * @param: label1, label2 - Dynamic Labels in case of multiple babies.
 *
 */
PrenatalVisitsComponentWF.prototype.dynamicLabelSort = function(label1, label2) {
	var sortRes = 0;
	if (label1 && label1.LABEL === "") {
		sortRes = 1;
	}
	else if (label2 && label2.LABEL === "") {
		sortRes = -1;
	}
	else {
		sortRes = (label1.LABEL < label2.LABEL) ? -1 : 1;
	}
	return sortRes;
};

/**
 * Sort an array by the date value in reverse chronological order
 *
 * @param date1-Date
 * @param date2-Date
 */
PrenatalVisitsComponentWF.prototype.resultDateSort = function(date1, date2) {
	var dateA = new Date();
	var dateB = new Date();
	dateA.setISO8601(date1.DATE);
	dateB.setISO8601(date2.DATE);
	sortRes = (dateA < dateB) ? 1 : -1;
	return sortRes;
};

/**
 * Create a div containing all the relevant hover data for a particular field.
 *
 * @param idText {string} - the id of the div dataTitle - the title of the div to be
 * displayed from an h4 tag dataArray - an array of data with DATE, VALUE, and
 * UNITS fields in each record returns: string of HTML
 */
PrenatalVisitsComponentWF.prototype.createHoverHTML = function(idText, dataTitle, dataArray) {
	var hoverHTMLArray = [];
	var k = 0;
	var hoverLength = dataArray.length;
	var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	dataArray.sort(this.resultDateSort);
	hoverHTMLArray.push("<div id='", idText, "' class='pv-wf-preg-res-hvr'><h4 class='pv-wf-preg-data-title'>", dataTitle, "</h4><dl class='pv-wf-preg-all-res'>");
	if (hoverLength > 0) {
		for ( k = 0; k < hoverLength; k++) {
			var resDate = new Date();
			resDate.setISO8601(dataArray[k].DATE);
			hoverHTMLArray.push("<dt>", resDate.format("longDateTime3"), "</dt><dd>", dataArray[k].VALUE, " ", dataArray[k].UNITS, "</dd><br />");
		}
	}
	else {
		hoverHTMLArray.push("<dt>--</dt><dd>--</dd>");
	}
	hoverHTMLArray.push("</dl></div>");
	return hoverHTMLArray.join("");
};

/**
 * Create a div containing all the relevant hover data for a fetal data field
 *
 * @param idText {string} - the id of the div
 *
 * @param dataTitle {string} - the title of the div to be displayed from an h4 tag
 *
 * @param dataArray {ClinicalDataList} - an array of data with DATE, VALUE, and UNITS
 * fields in each record
 *
 * @return {string} String of Fetal hover HTML
 */
PrenatalVisitsComponentWF.prototype.createFetalHoverHTML = function(idText, dataTitle, dataArray) {
	var hoverHTMLArray = [];
	var k = 0;
	var hoverLength = dataArray.length;
	var missingVal = "--";
	var noResExisted = true;
	dataArray.sort(this.resultDateSort);
	hoverHTMLArray.push("<div id='", idText, "' class='pv-wf-preg-res-hvr'><h4 class='pv-wf-preg-data-title'>", dataTitle, "</h4><dl class='pv-wf-preg-all-res'>");
	if (hoverLength > 0) {
		for ( k = 0; k < hoverLength; k++) {
			if (dataArray[k].VALUE !== "") {
				noResExisted = false;
				var resDate = new Date();
				var eventResValue = dataArray[k].DYNAMIC_LABEL || missingVal;
				resDate.setISO8601(dataArray[k].DATE);
				hoverHTMLArray.push("<dt>", resDate.format("longDateTime3"), "</dt><dd>", dataArray[k].VALUE, " ", dataArray[k].UNITS, "[", eventResValue, "]</dd><br />");
			}
		}
		if (noResExisted) {
			hoverHTMLArray.push("<dt><span>--</span></dt><dd><span>--</span></dd>");
		}
	}
	else {
		hoverHTMLArray.push("<dt>--</dt><dd>--</dd>");
	}
	hoverHTMLArray.push("</dl></div>");
	return hoverHTMLArray.join("");
};

/**
 * Sets up the hover class for a DOM Element as specified by the element. Appropriate
 * mouse action will be added depending on the event and hvrId.
 *
 * @param element {Element} - DOM Element for which hover class will be assigned.
 *
 * @param hvrID {String} - ID of a DOM Element
 */
PrenatalVisitsComponentWF.prototype.addMouseListeners = function(element, hvrID) {
	var component = this;
	if (document.getElementById(hvrID)) {
		$(element).mouseenter(function(evt) {
			$(this).addClass('pv-wf-hover-highlight');
			component.pregHMO(evt, document.getElementById(hvrID));
		});
		$(element).mouseleave(function(evt) {
			$(this).removeClass('pv-wf-hover-highlight');
			component.pregHoverMouseTerminated(evt, document.getElementById(hvrID));
		});
		$(element).mousemove(function(evt) {
			component.pregHoverMouseMovement(evt, document.getElementById(hvrID));
		});
	}
};

/**
 * Establishes mouse hover on logic, adapted from hmo
 *
 * @param evt {Event} - Mouse hover on event.
 *
 * @param element {Element} -DOM element to be associated to.
 */
PrenatalVisitsComponentWF.prototype.pregHMO = function(evt, element) {
	evt = evt || window.event;
	var elementStyle = element.style;
	var eventPosition = getPosition(evt);
	var verticalPosition = gvs();
	var scrollOptions = gso();
	var left = eventPosition.x + 20;
	var top = eventPosition.y + 20;
	var elementDecrementValue = 40;
	element.pregHMO = true;
	function hover() {
		if (element.pregHMO === true) {
			// make sure the cursor has not moused out prior to displaying
			elementStyle.display = "block";
			var elementWidth = $(element).width();
			var elementHeight = $(element).height();
			if (left + elementWidth > verticalPosition[1] + scrollOptions[1]) {
				left = left - elementDecrementValue - elementWidth;
				if (left < 0) {
					left = 0;
				}
			}
			if (top + elementHeight > verticalPosition[0] + scrollOptions[0]) {
				if (top - elementDecrementValue - elementHeight < scrollOptions[0]) {
					if (left > 0) {
						top = 10 + scrollOptions[0];
					}
				}
				else {
					top = top - elementDecrementValue - elementHeight;
				}
			}
			document.body.appendChild(element);
			elementStyle.left = left + "px";
			elementStyle.top = top + "px";
			element.show = true;
		}
	}


	element.timer = setTimeout(hover, 500);
};

/**
 * Establishes mouse hover off for a element, adapted from HoverMouseMovement.
 *
 * @param evt {Event} - Mouse hover off event.
 *
 * @param element {Element} - DOM element for which styles will be applied.
 */
PrenatalVisitsComponentWF.prototype.pregHoverMouseTerminated = function(evt, element) {
	var compId = this.getComponentId();
	var allResultsDiv = _g('pregallResults' + compId);
	evt = evt || window.event;
	element.pregHMO = false;
	clearTimeout(element.timer);
	element.style.display = "none";
	allResultsDiv.insertBefore(element, Util.gc(allResultsDiv));
	element.show = false;
};

/**
 * Establishes mousemove hover.
 *
 * @param evt {Event} - mouse movement event
 * @param: element {Element} - DOM element for which styles will be applied.
 */
PrenatalVisitsComponentWF.prototype.pregHoverMouseMovement = function(evt, element) {
	var elementStyle = element.style;
	var eventPosition = getPosition(evt);
	var verticalPosition = gvs();
	var scrollOptions = gso();
	var left = eventPosition.x + 20;
	var top = eventPosition.y + 20;
	var elementWidth = $(element).width();
	var elementHeight = $(element).height();
	var elementDecrementValue = 40;
	evt = evt || window.event;

	if (!element.show) {
		return;
	}
	if (left + elementWidth > verticalPosition[1] + scrollOptions[1]) {
		left = left - elementDecrementValue - elementWidth;
		if (left < 0) {
			left = 0;
		}
	}
	if (top + elementHeight > verticalPosition[0] + scrollOptions[0]) {
		if (top - elementDecrementValue - elementHeight < scrollOptions[0]) {
			if (left > 0) {
				top = 10 + scrollOptions[0];
			}
		}
		else {
			top = top - elementDecrementValue - elementHeight;
		}
	}
	elementStyle.top = top + "px";
	elementStyle.left = left + "px";
};

/**
 * Establishes mouse hover off for comments.
 *
 * @param evt {Event} - Mouse hover off event.
 *
 * @param element {Element} - DOM element for which styles will be applied.
 */
PrenatalVisitsComponentWF.prototype.pregCmntHoverMouseTerminated = function(evt, element) {
	var cmntData = Util.gp(element);
	evt = evt || window.event;
	element.pregHMO = false;
	clearTimeout(element.timer);
	element.style.display = "none";
	element.show = false;
};

