function RecommendationsO2ComponentStyle() {
	this.initByNamespace("recom-o2");
}

RecommendationsO2ComponentStyle.prototype = new ComponentStyle();
RecommendationsO2ComponentStyle.prototype.constructor = ComponentStyle;

/**
 * The Recommendations component will allow the user to view health maintenance info for the patient from within the MPage
 *
 * @param {Criterion} criterion
 */
function RecommendationsO2Component(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new RecommendationsO2ComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.RECOMMENDATIONS.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.RECOMMENDATIONS.O2 - render component");
	this.setIncludeLineNumber(true);
	this.setLookBackDropDown(true);
	this.setPlusAddCustomInd(true);
	this.m_recommendationsTable = null;
	this.DATE_RANGE_TRIGGER = {
		DEFAULT:1,
		MODAL_WINDOW: 2
	};
	// Default grouping is " NONE"
	this.FILTERS = {
		CATEGORY: 1,
		PRIORITY: 2,
		FAVORITES: 3,
		NONE: 4
	};

	//0=Due, 1=OverDue, 2=Near Due, 3=Not Due Until
	this.DUE_TYPE = {
		DUE: 0,
		OVERDUE: 1,
		NEARDUE: 2,
		SATISFIED: 3
	};

	this.m_defaultCols = {
		PRIORITY: 2,
		FREQUENCY: 3,
		DUE: 4,
		REFERENCE : 5
	};
	
	this.m_alertType = {
		ERROR: 1,
		WARNING: 2,
		INFO: 3
	};
	
	this.m_recomPrefObj = {
		groupByPref : this.FILTERS.NONE, // Default grouping " NONE"
		//All the columns are enabled by default
		savedColumnsObj : {
			PRIORITY : true,
			FREQUENCY : true,
			DUE : true,
			REFERENCE : true
		},
		//All favorites are none by default
		favoritesObject : [],
		REQUIRED : 0
	};

	this.m_lastSelFilter = this.FILTERS.NONE;
	this.m_lastSelectedRow = "";
	this.m_personnelArray = null;

	this.RECORD_STATUS_TYPE = {
		SATISFIED: 0,
		POSTPONED: 1,
		PENDING: 2,
		SKIPPED: 3,
		CANCELED: 4,
		OTHERSATISFIER: 5,
		UNDONE: 6,
		REFUSED: 7,
		EXPIRED: 8
	};

	this.HOVER_SECTION = {
		EXPECTATION: 1,
		FREQUENCY: 2,
		DUE_DATE: 3,
		NONE: 0
	};

	//Store the history lookback at the component level
	this.m_historyLookback = "";

	//Store the anchor date at the component level
	this.m_anchorDate = new Date();

	//Store the position for the timeline graph status bar
	this.m_statusBarPos = 0;

	//Cache the side panel DOM element and object.
	this.m_$sidePanelContainer = null;
	this.m_sidePanel = null;

	this.m_sidePanelMinHeight = 251;

	//Cache the component table element.
	this.m_$tableView = null;

	// Cache the css class Name for hover details container.
	this.m_hoverContainerClassName = "";

	//Preference that allows user to add a recommendation
	this.m_allowAdditions = false;

	//Preference that allows user to modify a recommendation
	this.m_allowModifications = false;

	//Preference that allows user to add a free text recommendation
	this.m_allowFreeText = false;

	//Preference that specifies if the reason is mandatory on adding recommendation
	this.m_expectReason = false;

	// Preference that specifies if reason is mandatory for frequency modification
	this.m_reasonOnFrequencyModification = false;

	// Preference that specifies if reason is mandatory for due date modification
	this.m_reasonOnDueDateModification = false;

	// Preference that determines whether the satisfiers should be shown in the component or not
	this.m_showSatisfiers = false;

	// This object saves all satisfiers for a free text expectation
	this.m_freeTextSatisfiers = null;

	this.m_freeTextCounter = 0;

	this.m_recommendationsDataReply = [];

	this.m_currentProviderName = "";

	//Reason Code set data to be used while recommendation addition
	this.m_reasonCodeSet = [];

	//Time units Code set data used in creating the dropdowns
	this.m_timeUnitsCodeSet = [];

	//list of all the selected expectations to save
	this.m_selectedExpectationsList = [];

	//list of all the free text expectations to save
	this.m_selectedFreeTextExpectationsList = [];

	this.RECOMMENDATION_TYPE = {
		EXPECTATION: 0,
		FREE_TEXT: 1
	};

	this.FREQUENCY_TYPE = {
		SEASONAL: 0,
		VARIABLE: 1,
		ONE_TIME_ONLY: 2,
		FIXED_NO_OF_DAYS: 3
	};

	this.m_reasonOnAddition = 0.0;

	this.m_commentOnAddition = "";

	this.m_allAvailableExpectations = {};

	this.m_i18nStrings = i18n.discernabu.recommendations_o2;

	this.m_componentId = this.getComponentId();

	this.m_expectationsWithFixedDaysFrequency = [];

	this.m_actionOverrideCounter = 0;

	this.m_isSidePanelLoading = false;

	this.m_isSidePanelOpen = false;

	this.m_hasDueDateChanged = false;

	this.m_hasFrequencyChanged = false;


	this.m_modifyObject = {};

	this.RECOMMENDATION_ACTION  = {
		NO_ACTION: -1,
		MODIFY: 0,
		EXPIRE: 1,
		POSTPONE: 2,
		REFUSE: 3,
		MANUAL_SATISFY: 4,
		UNDO: 5,
		SYSTEM_SATISFY_PROCEDURE: 6
	};

	this.m_currentAction = this.RECOMMENDATION_ACTION.NO_ACTION;

	this.m_popup = null;
	this.m_modifierTypesAndReasons = null;
	this.m_actionObject = null;

	//Set the override indicator to false
	//This indicates that override reasons are not necessary for recommendations 
	this.setOverrideInd(false);
	
	//Set the descrlaimer message which will be displayed when there are overdue exepctations.
	this.setRequiredCompDisclaimerText(this.m_i18nStrings.OVERDUE_ALERT);

	//Group_id that is used to save Cerner practice wizard preferences
	this.m_groupId = 0.0;
	//Pending expectations date range - future date range preference
	this.m_dueDateRangeUserPreference = 0;
	this.m_undoActionReasons = [];
	
	this.m_systemSatisfierAction = {
			componentId: null,
			recommendationId : null,
			modifiedRowId : null
	};
	
	this.m_addProcedureAction = null;
	this.m_addProcedureName = "";
	this.m_nomenclatureId = 0.0;
	this.m_addProcedureDateSelector = null;
	this.m_viewReferenceTextObj = null;
	this.m_referenceTextExistsObj = null;
	this.m_scriptReply = null;
	this.referenceTextCapTimer = null;
	this.refTextResponse = null;
}

RecommendationsO2Component.prototype = new MPageComponent();
RecommendationsO2Component.prototype.constructor = MPageComponent;
/**
 * returns the script reply from MP_GET_HMI 
 * @return {object} m_scriptReply
 */
RecommendationsO2Component.prototype.getComponentScriptReply = function () {
	return this.m_scriptReply;
};
/**
 * sets the m_scriptReply to given value
 * @param {object} - scriptReply
 */
RecommendationsO2Component.prototype.setComponentScriptReply = function (scriptReply) {
	if (typeof scriptReply !== "object") {
		throw new Error("The parameter passed to setComponentScriptReply is not an object or invalid");
	}
	this.m_scriptReply = scriptReply;
};
/**
 * returns the script reply from service DCP_GET_REF_TEXT_EXISTS_BATCH
 * @return {object} m_referenceTextExistsObj
 */
RecommendationsO2Component.prototype.getReferenceTextExistsObj = function () {
	return this.m_referenceTextExistsObj;
};
/**
 * sets the m_referenceTextExistsObj to given value
 * @param {object} - referenceTextExistsObj
 */
RecommendationsO2Component.prototype.setReferenceTextExistsObj = function (referenceTextExistsObj) {
	if (typeof referenceTextExistsObj !== "object") {
		throw new Error("The parameter passed to setReferenceTextExistsObj is not an object or invalid");
	}
	this.m_referenceTextExistsObj = referenceTextExistsObj;
};
/**
 * returns the reference text object 
 * @return {object} m_viewReferenceTextObj
 */
RecommendationsO2Component.prototype.getReferenceTextObj = function () {
	return this.m_viewReferenceTextObj;
};
/**
 * sets the group_m_viewReferenceTextObjid to given value
 * @param {object} - m_viewReferenceTextObj
 */
RecommendationsO2Component.prototype.setReferenceTextObj = function (referenceTextObj) {
	if (typeof referenceTextObj !== "object") {
		throw new Error("The parameter passed to setReferenceTextObj is not an object or invalid");
	}
	this.m_viewReferenceTextObj = referenceTextObj;
};
/**
 * returns the group id which needs to be passed to update any health maintenance preference
 * @return {number} m_groupId
 */
RecommendationsO2Component.prototype.getGroupId = function () {
	return this.m_groupId;
};

/**
 * sets the group_id to given value
 * @param {number} - groupId
 */
RecommendationsO2Component.prototype.setGroupId = function (groupId) {
	if (typeof groupId !== "number") {
		throw new Error("The parameter passed to setGroupId is not a number or invalid");
	}
	this.m_groupId = groupId;
};
/**
 * returns the pending expectations due date range preference
 * @return {string} m_dueDateRangeUserPreference
 */
RecommendationsO2Component.prototype.getPendingDueDatePreference = function () {
	return this.m_dueDateRangeUserPreference;
};
/**
 * sets the due date range preference to the given value
 * @param {string} - duePendingDatePreference value of the preference to be set.
 */
RecommendationsO2Component.prototype.setPendingDueDatePreference = function (duePendingDatePreference) {
	this.m_dueDateRangeUserPreference = duePendingDatePreference;
};
/**
 * gets the reason value selected during addition of a recommendation
 * @return {number} m_reasonOnAddition - selected reason.
 */
RecommendationsO2Component.prototype.getReasonOnAddition = function () {
	return this.m_reasonOnAddition;
};

/**
 * sets the value of reason selected during addition of expectations
 * @param {number} - code value of the reason selected.
 */
RecommendationsO2Component.prototype.setReasonOnAddition = function (reasonValue) {
	if (typeof reasonValue !== "number") {
		throw new Error("The reason value passed is not a number");
	}
	this.m_reasonOnAddition = reasonValue;
};

/**
 * returns the comments string while adding expectations.
 * @return {string} the comments string.
 */
RecommendationsO2Component.prototype.getCommentOnAddition = function () {
	return this.m_commentOnAddition;
};

/**
 * Sets the comments string given during addition of expectations
 * @param {string} comments string to be updated.
 */
RecommendationsO2Component.prototype.setCommentOnAddition = function (commentString) {
	if (typeof commentString !== "string") {
		throw new Error("The comment passed is not a string");
	}
	this.m_commentOnAddition = commentString;
};

/**
 * returns the list of free text expectations selected and ready to save.
 * @return {Array} the list of selected free text expectations.
 */
RecommendationsO2Component.prototype.getSelectedFreeTextExpectationsList = function () {
	return this.m_selectedFreeTextExpectationsList;
};

/**
 * Sets the list of free text expectations
 * @param {Array} Array of selected free text expectation objects.
 */
RecommendationsO2Component.prototype.setSelectedFreeTextExpectationsList = function (selectedFreeTextList) {
	if(!(selectedFreeTextList instanceof Array)){
		throw new Error("The free text expectation list passed is not an Array");
	}
	this.m_selectedFreeTextExpectationsList = selectedFreeTextList;
};

/**This method adds a free text expectation to the list of free text expectations
 * which will be referred while saving the selected list of expectations
 *@param {Object} selectedFreeTextExpectationObj - object to be added to the list
*/
RecommendationsO2Component.prototype.addItemToSelectedFreeTextExpectationsList = function (selectedFreeTextExpectationObj) {
	if (typeof selectedFreeTextExpectationObj !== "object") {
		throw new Error("The selected free text expectation passed is not an object");
	}
	this.m_selectedFreeTextExpectationsList.push(selectedFreeTextExpectationObj);
};

/**
 * returns the list of expectations that are selected and yet to be saved.
 * @return {Array} the list of selected expectations.
 */
RecommendationsO2Component.prototype.getSelectedExpectationsList = function () {
	return this.m_selectedExpectationsList;
};

/**
 * Sets the list of selected expectations
 * @param {Array} Array of selected expectation objects.
 */
RecommendationsO2Component.prototype.setSelectedExpectationsList = function (selectedList) {
	if(!(selectedList instanceof Array)){
		throw new Error("The expectation list passed is not an Array");
	}
	this.m_selectedExpectationsList = selectedList;
};

/**This method adds an expectation to the list of expectations
 * which will be referred while saving the selected list of expectations
 *@param {Object} selectedExpectationObj - object to be added to the list
*/
RecommendationsO2Component.prototype.addItemToSelectedExpectationsList = function (selectedExpectationObj) {
	if (typeof selectedExpectationObj !== "object") {
		throw new Error("The selected expectations list passed is not an object");
	}
	this.m_selectedExpectationsList.push(selectedExpectationObj);
};

/**
 * returns the free text counter while adding recommendations.
 * @return {number} the free text counter.
 */
RecommendationsO2Component.prototype.getFreeTextCounter = function () {
	return this.m_freeTextCounter;
};

/**
 * This function will increment the m_freeTextCounter value by 1 and returns it.
 * @return {Number} incremented free text counter
*/
RecommendationsO2Component.prototype.getIncrementedFreeTextCounter = function () {
	return ++this.m_freeTextCounter;
};

/**
 * Sets the list of free text counter to the specified value.
 * This should only be used at the initialization or destruction of the add recommendations window
 * @param {Number} Free text counter.
 */
RecommendationsO2Component.prototype.setFreeTextCounter = function (freeTextCounter) {
	if (typeof freeTextCounter !== "number") {
		throw new Error("The free text counter passed is not a number");
	}
	this.m_freeTextCounter = freeTextCounter;
};

/**
 * returns the current provider name.
 * @return {string} the provider name.
 */
RecommendationsO2Component.prototype.getCurrentProviderName = function () {
	return this.m_currentProviderName;
};

/**
 * Sets the current provider name at the class level.
 * @param {String} Provider name.
 */
RecommendationsO2Component.prototype.setCurrentProviderName = function (providerName) {
	if (typeof providerName !== "string") {
		throw new Error("The provider name passed is not a string");
	}
	this.m_currentProviderName = providerName;
};

/**
 * returns the code set values for reason dropdown.
 * @return {Array} Code set values for reasons dropdown.
 */
RecommendationsO2Component.prototype.getReasonCodeSet = function () {
	return this.m_reasonCodeSet;
};

/**
 * Sets the reason code set information
 * @param {Array} Array of code set values for reason dropdown.
 */
RecommendationsO2Component.prototype.setReasonCodeSet = function (reasonCodeSet) {
	if (!(reasonCodeSet instanceof Array)) {
		throw new Error("The reason code set passed is not an array");
	}
	this.m_reasonCodeSet = reasonCodeSet;
};

/**
 * returns the code set values for time units.
 * @return {Array} Code set values for time units.
 */
RecommendationsO2Component.prototype.getTimeUnitsCodeSet = function () {
	return this.m_timeUnitsCodeSet;
};

/**
 * Sets the time units code set information
 * @param {Array} Array of code set values for time units.
 */
RecommendationsO2Component.prototype.setTimeUnitsCodeSet = function (timeUnitsCodeSet) {
	if (!(timeUnitsCodeSet instanceof Array)) {
		throw new Error("The code set passed is not an array");
	}
	this.m_timeUnitsCodeSet = timeUnitsCodeSet;
};

/**
 * returns the 'allow additions' preference.
 * @return {boolean} preference for adding a recommendation.
 */
RecommendationsO2Component.prototype.getAllowAdditionIndicator = function () {
	return this.m_allowAdditions;
};

/**
 * Sets the 'allow addition' indicator
 * @param {Boolean} value of the allow additions preference.
 */
RecommendationsO2Component.prototype.setAllowAdditionIndicator = function (additionIndicator) {
	if (typeof additionIndicator !== "boolean") {
		throw new Error("The addition indicator passed is not a boolean value");
	}
	this.m_allowAdditions = additionIndicator;
};

/**
 * returns the 'allow modifications' preference.
 * @return {boolean} preference for modifying a recommendation.
 */
RecommendationsO2Component.prototype.getAllowModificationIndicator = function () {
	return this.m_allowModifications;
};

/**
 * Sets the 'allow modification' indicator
 * @param {Boolean} Value to be set for the allow modifications indicator.
 */
RecommendationsO2Component.prototype.setAllowModificationIndicator = function (modificationIndicator) {
	if (typeof modificationIndicator !== "boolean") {
		throw new Error("The modification indicator passed is not a boolean value");
	}
	this.m_allowModifications = modificationIndicator;
};

/**
 * returns the 'allow free text' preference.
 * @return {boolean} preference for free text addition.
 */
RecommendationsO2Component.prototype.getAllowFreeTextAdditionIndicator = function () {
	return this.m_allowFreeText;
};

/**
 * Sets the 'allow free text' indicator
 * @param {boolean} value of the allow free text addition preference.
 */
RecommendationsO2Component.prototype.setAllowFreeTextAdditionIndicator = function (freeTextIndicator) {
	if (typeof freeTextIndicator !== "boolean") {
		throw new Error("The free text indicator passed is not a boolean value");
	}
	this.m_allowFreeText = freeTextIndicator;
};

/**
 * returns the comments string while adding recommendations.
 * @return {string} the comments string.
 */
RecommendationsO2Component.prototype.getExpectReasonAdditionIndicator = function () {
	return this.m_expectReason;
};

/**
 * Sets the 'expect reason on addition' preference at the class level
 * @param {Boolean} value of the expect reason on addition preference.
 */
RecommendationsO2Component.prototype.setExpectReasonAdditionIndicator = function (expectReasonIndicator) {
	if (typeof expectReasonIndicator !== "boolean") {
		throw new Error("The reason expected indicator passed is not a boolean value");
	}
	this.m_expectReason = expectReasonIndicator;
};

/**
 * returns the reply of mp_get_hmi containing schedule and series ids of the assigned recommendations.
 * @return {string} the comments string.
 */
RecommendationsO2Component.prototype.getRecommendationsDataReply = function () {
	return this.m_recommendationsDataReply;
};

/**
 * Sets the reply of mp_get_hmi in an array format containing schedule and series ids.
 * @param {Array} Array of objects with schedule ids and series ids assigned to the patient.
 */
RecommendationsO2Component.prototype.setRecommendationsDataReply = function (dataReply) {
	if (!(dataReply instanceof Array)) {
		throw new Error("The data reply passed is not an array");
	}
	this.m_recommendationsDataReply = dataReply;
};

/**
 * returns all the available expectations which is a reply from the script mp_get_all_expectations.
 * @return {Array} list of all the available expectations.
 */
RecommendationsO2Component.prototype.getAllAvailableExpectations = function () {
	return this.m_allAvailableExpectations;
};

/**
 * Sets all the available expectations from the build tool.
 * @param {Object} The expectations created in the build tool(reply of mp_get_all_expectations).
 */
RecommendationsO2Component.prototype.setAllAvailableExpectations = function (availableExpectations) {
	if (typeof availableExpectations !== "object") {
		throw new Error("The availableExpectations passed is not an object");
	}
	this.m_allAvailableExpectations = availableExpectations;
};

/**
 * returns the patient's date of birth.
 * @return {Object} a date object containing patient's date of birth.
 */
RecommendationsO2Component.prototype.getPatientDOB = function(){
	return this.m_patientDOB;
};

/**
 *returns the list of objects containing series_id's and frequency values
 *@return {Array} list of objects with fixed duration of frequency built.
 */
RecommendationsO2Component.prototype.getExpectationsWithFixedDaysFrequency = function(){	
	
	return this.m_expectationsWithFixedDaysFrequency;
};

/**
 * Sets the expectations  list objects with fixed duration frequency.
 * This should only be called while saving or closing the add recommendations modal window
 * As we need this data till the selected expectations are saved/cancelled.
 * @param {Array} The list of objects with fixed duration of frequency.
 */
RecommendationsO2Component.prototype.setExpectationsWithFixedDaysFrequency = function(frequencyObjectList){	
	if (!(frequencyObjectList instanceof Array)) {
		throw new Error("The frequencyObjectList passed is not an array");
	}
	this.m_expectationsWithFixedDaysFrequency = frequencyObjectList;
};

/**
 * adds an object to the expectations  list objects with fixed duration frequency.
 * @param {Object} The object with fixed duration of frequency.
 */
RecommendationsO2Component.prototype.addExpectationWithFixedDaysFrequency = function(frequencyObject){
	if (typeof frequencyObject !== "object") {
		throw new Error("The frequencyObject passed is not an object");
	}
	this.m_expectationsWithFixedDaysFrequency.push(frequencyObject);
};

/**
 *returns the count of modify actions based on the changes in frequency and due date in selected expectations
 *@return {Number} counter of actions on overriding frequency and due date for selected expectations.
 */
RecommendationsO2Component.prototype.getActionOverrideCount = function() {

	return this.m_actionOverrideCounter;
};

/**
 *sets the count of modify actions to the given value
 *@param {Number} counter of actions on overriding frequency and due date for selected expectations.
 */
RecommendationsO2Component.prototype.setActionOverrideCount = function(actionOverrideCount){	
	
	if (typeof actionOverrideCount !== "number") {
		throw new Error("The actionOverrideCount passed is not a number");
	}
	this.m_actionOverrideCounter = actionOverrideCount;
};

/**
 *Increments the count of actions overridden based on the changes in the frequency and due date
 */
RecommendationsO2Component.prototype.incrementActionOverrideCount = function(){	
	this.m_actionOverrideCounter++;
};

/*
 * Returns the reason preference set for frequency modification
 *
 * @return {boolean} - Returns true if reason is a required field for frequency modification, else returns false
 */
RecommendationsO2Component.prototype.getReasonOnFrequencyModification = function() {
	return this.m_reasonOnFrequencyModification;
};

/**
 * Sets the reason preference for frequency modification
 * 
 * @param {boolean} - Pass true if you want to set the reason on frequency modification indicator to true, else false
 */
RecommendationsO2Component.prototype.setReasonOnFrequencyModification = function(value) {
	if (typeof value !== "boolean") {
		throw new Error("Invalid parameter passed to setReasonOnFrequencyModification function");
	}

	this.m_reasonOnFrequencyModification = value;
};

/*
 * Returns the reason preference set for due date modification
 *
 * @return {boolean} - Returns true if reason is a required field for due date modification, else returns false
 */
RecommendationsO2Component.prototype.getReasonOnDueDateModification = function() {
	return this.m_reasonOnDueDateModification;
};

/**
 * Sets the reason preference for due date modification
 *
 * @param {boolean} - Pass true if you want to set the reason on due date modification indicator to true, else false
 */
RecommendationsO2Component.prototype.setReasonOnDueDateModification = function(value) {
	if (typeof value !== "boolean") {
		throw new Error("Invalid parameter passed to setReasonOnDueDateModification function");
	}

	this.m_reasonOnDueDateModification = value;
};

/**
 * Returns true if due date has been modified in the side panel
 *
 * @return{boolean} returns True if due date was modified, else false
 */
RecommendationsO2Component.prototype.getDueDateChangeIndicator = function() {
	return this.m_hasDueDateChanged;
};

/**
 * Sets the due date changed indicator
 * 
 * @param {boolean} - boolean value to be set to due date changed indicator
 */
RecommendationsO2Component.prototype.setDueDateChangeIndicator = function(value) {
	
	if(typeof value !== "boolean") {
		throw new Error("Invalid parameter passed to setDueDateChanged function");
	}

	this.m_hasDueDateChanged = value;
};

/**
 * Returns true if frequency has been modified in the side panel
 *
 * @return{boolean} returns True if frequency was modified, else false
 */
RecommendationsO2Component.prototype.getFrequencyChangeIndicator = function() {
	
	return this.m_hasFrequencyChanged;
};

/**
 * Sets the frequency changed indicator
 * 
 * @param {boolean} - boolean value to be set to frequency changed indicator
 */
RecommendationsO2Component.prototype.setFrequencyChangeIndicator = function(value) {
		
	if(typeof value !== "boolean") {
		throw new Error("Invalid parameter passed to setDueDateChanged function");
	}

	this.m_hasFrequencyChanged = value;
};

/**
 * Returns true if show satisfiers preference is set
 *
 * @return {boolean} returns True if show satisfiers preference is set, else false
 */
RecommendationsO2Component.prototype.getShowSatisfiersPreference = function() {
	return this.m_showSatisfiers;
};

/**
 * Sets the show satisfiers preference
 * 
 * @param {boolean} boolean value to be set to the show satisfiers preference
 */
RecommendationsO2Component.prototype.setShowSatisfiersPreference = function(value) {

	if(typeof value !== "boolean") {
		throw new Error("Invalid parameter passed to setShowSatisfiersPreference function");
	}

	this.m_showSatisfiers = value;
};

/**
 * Returns the popup object which is saved at the constructor level
 * 
 * @return {object} MPageUI.Popup object
 */
RecommendationsO2Component.prototype.getPopupObject = function() {
	return this.m_popup;
};

/**
 * Sets the popup object at constructor level
 * 
 * @param {object} obj MPageUI.Popup object
 */
RecommendationsO2Component.prototype.setPopupObject = function(obj) {
	
	if(typeof obj !== "object") {
		throw new Error("Invalid parameter passed to setPopupObject function");
	}

	this.m_popup = obj;
};

/**
 * Returns the m_modifierTypesAndReasons object which has all modifier types and all available reasons for manual actions
 * 
 * @return {object} object which contains modifier types, reasons for expire, postpone, refuse and manual satisfy actions
 */
RecommendationsO2Component.prototype.getModifierTypesAndReasons = function() {
	return this.m_modifierTypesAndReasons;	
};

/**
 * Sets the modifier types and reasons object at constructor level
 * 
 * @param {object} obj the action reasons object that needs to be saved
 */
RecommendationsO2Component.prototype.setModifierTypesAndReasons = function(obj) {
	if(typeof obj !== "object") {
		throw new Error("Invalid parameter passed to setModifierTypesAndReasons function");
	}

	this.m_modifierTypesAndReasons = obj;
};

/**
 * Returns the action object which is saved at the constructor level
 * 
 * @return {object} action object which has all the information needed to perform a manual satisfy action
 */
RecommendationsO2Component.prototype.getActionObject = function() {
	return this.m_actionObject;
};

/**
 * Sets the action object at constructor level
 * 
 * @param {object} obj - action object which needs to be saved
 */
RecommendationsO2Component.prototype.setActionObject = function(obj) {
	
	if(typeof obj !== "object") {
		throw new Error("Invalid parameter passed to setActionObject function");
	}

	this.m_actionObject = obj;
};

/**
 * Returns the object which has all satisfiers for a free text expectation
 *
 * @return {object} free text satisfiers object
 */
RecommendationsO2Component.prototype.getFreeTextSatisfiers = function() {
	return this.m_freeTextSatisfiers;
};

/**
 * Sets the free text satisfiers object
 *
 * @param {object} freeTextSatisfiers free text satisfiers object which needs to be saved
 */
RecommendationsO2Component.prototype.setFreeTextSatisfiers = function(freeTextSatisfiers) {
	if (typeof freeTextSatisfiers !== "object") {
		throw new Error("Invalid parameter passed to setFreeTextSatisfiers function");
	}

	this.m_freeTextSatisfiers = freeTextSatisfiers;
};

/**
 * Returns the current action type which is saved at the constructor level
 * 
 * @return {Number} - m_currentAction
 */
RecommendationsO2Component.prototype.getCurrentActionType = function () {
	return this.m_currentAction;
};

/**
 * Sets the current action type at constructor level
 * 
 * @param {Number} currentActionType - The value of the current action being performed.
 */
RecommendationsO2Component.prototype.setCurrentActionType = function (currentActionType) {
	if (typeof currentActionType !== "number") {
		throw new Error("The parameter passed to setCurrentActionType is not a number");
	}
	this.m_currentAction = currentActionType;
};

/**
 * Returns the array of undo reasons which is saved at the constructor level
 * 
 * @return {Array} List of undo reasons
 */
RecommendationsO2Component.prototype.getUndoReasonCodeSet = function () {
	return this.m_undoActionReasons;
};

/**
 * Sets the undo reasons array at constructor level
 * 
 * @param {Array} undoReasons - Reasons array which needs to be saved
 */
RecommendationsO2Component.prototype.setUndoReasonCodeSet = function (undoReasons) {
	if (!(undoReasons instanceof Array)) {
		throw new Error("The parameter passed to setUndoActionReasons is not an array");
	}
	this.m_undoActionReasons = undoReasons;
};


/**
 * Returns the name of the procedure that is associated with the current procedure satisfier.
 * 
 * @return {String} Name of the procedure
 */
RecommendationsO2Component.prototype.getAddProcedureName = function () {
	return this.m_addProcedureName;
};

/**
 * Sets the current procedure name to be added at constructor level
 * 
 * @param {String} procedureName - Name of the procedure
 */
RecommendationsO2Component.prototype.setAddProcedureName = function (procedureName) {
	if (typeof procedureName !== "string") {
		throw new Error("The parameter passed to setaddProcedureName is not a string");
	}
	this.m_addProcedureName = procedureName;
};

/**
 * Returns the object which had add procedure action details that are saved at the constructor level
 * 
 * @return {Object} m_addProcedureAction
 */
RecommendationsO2Component.prototype.getAddProcedureAction = function () {
	return this.m_addProcedureAction;
};

/**
 * Sets the current procedure action details to be added at constructor level
 * 
 * @param {Object} procedureAction - Procedure action with request details
 */
RecommendationsO2Component.prototype.setAddProcedureAction = function (procedureAction) {
	if (typeof procedureAction !== "object") {
		throw new Error("The parameter passed to setAddProcedureAction is not an Object");
	}
	this.m_addProcedureAction = procedureAction;
};

/**
 * Returns the Nomenclature id associated with the procedure
 * 
 * @return {Number} m_nomenclatureId
 */
RecommendationsO2Component.prototype.getNomenclatureId = function () {
	return this.m_nomenclatureId;
};

/**
 * Sets the nomenclature id of the current recommendation at constructor level
 * 
 * @param {Number} nomenclatureId - nomenclature id of the current recommendation
 */
RecommendationsO2Component.prototype.setNomenclatureId = function (nomenclatureId) {
	if (typeof nomenclatureId !== "number") {
		throw new Error("The parameter passed to setNomenclatureId is not a number");
	}
	this.m_nomenclatureId = nomenclatureId;
};

/**
 * Returns the Date Selector object associated with the add procedure window
 * 
 * @return {Object}  m_addProcedureDateSelector
 */
RecommendationsO2Component.prototype.getProcedureDateSelector = function () {
	return this.m_addProcedureDateSelector;
};

/**
 * Sets the  Date Selector object of the current procedure getting added
 * 
 * @param {Object} procedureDateSelector - date selector object created for the current procedure
 */
RecommendationsO2Component.prototype.setProcedureDateSelector = function (procedureDateSelector) {
	if (typeof procedureDateSelector !== "object") {
		throw new Error("The parameter passed to setProcedureDateSelector is not an object");
	}
	this.m_addProcedureDateSelector = procedureDateSelector;
};

/**
 *Override MPageComponent's loadFiltrMappings to get the bedrock filters for the component.
 */
RecommendationsO2Component.prototype.loadFilterMappings = function() {
	// Add the filter mapping object for setting the required indicator.
	this.addFilterMappingObject("WF_RCMND_OVERDUE_IND", {
		setFunction : this.setGapCheckRequiredInd,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
};

/**
 *Override MPageComponent's openTab to open 'add recommendations' modal window
 */
RecommendationsO2Component.prototype.openTab = function () {
	var addRecommendationModal = MP_ModalDialog.retrieveModalDialogObject("addRecommendation");
	var component = this;
	var category_mean = component.getCriterion().category_mean;
	var capTimer = null;
	var compId = component.m_componentId;
	component.setFreeTextCounter(0);
	if (!addRecommendationModal) {
		//the provider name will be retrieved from the backend.
		var providerLabel = "<span class='recom-o2-add-rec-provider-name'></span>";
		addRecommendationModal = new ModalDialog("addRecommendation");
		addRecommendationModal.setHeaderTitle(this.m_i18nStrings.ADD_RECOMMENDATION);
		var addButton = new ModalButton("addRecButton");
		addButton.setText(i18n.SAVE).setIsDithered(true);
		addButton.setOnClickFunction(function () {
			//check if all the required fields are filled
			var allRequiredFields = $('#addRecRightContainer'+compId).find('.recom-o2-required-field');
			var isEmpty = false;
			allRequiredFields.each(function(){
				var element = $(this);
				if(!element.val()){
					isEmpty = true;
					element.focus();
					return false;
				}
				//Have a check on frequency field if 0 is entered.
				if(element.hasClass('recom-o2-sel-series-freq-val')){
					if(parseInt(element.val(),10) === 0){
						isEmpty = true;
						element.focus();
						return false;
					}
				}
			});
			if(!isEmpty){
				var saveFailureMsgContainer = $('.recom-o2-save-failure-msg');
				if(!saveFailureMsgContainer.hasClass('hidden')){
					saveFailureMsgContainer.addClass('hidden');
				}
				//Make sure to send FREQUENCY and FREQUENCY_UNIT_CD values as 0.0 to the backend if the user hasn't changed the frequency.
				//This is because the server will interpret the action as modify if a value is specified.
				var expectationsWithFixedDaysFrequency = component.getExpectationsWithFixedDaysFrequency();
				var selectedExpectations = component.getSelectedExpectationsList();
				for (var expIdx = expectationsWithFixedDaysFrequency.length; expIdx--; ) {
					for (var selectedExpIdx = selectedExpectations.length; selectedExpIdx--;) {
						if(expectationsWithFixedDaysFrequency[expIdx].SERIES_ID === selectedExpectations[selectedExpIdx].RECOMMENDATION_TEMP_ID){
							if(expectationsWithFixedDaysFrequency[expIdx].FREQUENCY_VALUE === selectedExpectations[selectedExpIdx].FREQUENCY_VALUE &&
								expectationsWithFixedDaysFrequency[expIdx].FREQUENCY_UNIT_CD === selectedExpectations[selectedExpIdx].FREQUENCY_UNIT_CD){
								selectedExpectations[selectedExpIdx].FREQUENCY_VALUE = 0.0;
								selectedExpectations[selectedExpIdx].FREQUENCY_UNIT_CD = 0.0;
							}
							break;
						}
					}
				}

				//grab the selected lists and send it to the backend
				var allSelectedExpectations = selectedExpectations.concat(component.getSelectedFreeTextExpectationsList());
				component.saveExpectations(allSelectedExpectations);
				capTimer = new CapabilityTimer("CAP:MPG_Recommendations_O2_Add_New", category_mean);
				if(capTimer){
					capTimer.addMetaData("rtms.legacy.metadata.1", "Add New Recommendations");
					capTimer.capture();
				}
			}
		});

		addRecommendationModal.addFooterButton(addButton);
		var cancelButton = new ModalButton("cancelRecButton");
		cancelButton.setText(i18n.CANCEL);
		cancelButton.setOnClickFunction(function () {
			//clear the data stored at the constructor level which will not be reused.
			component.setSelectedFreeTextExpectationsList([]);
			component.setSelectedExpectationsList([]);
			component.setExpectationsWithFixedDaysFrequency([]);
			component.setActionOverrideCount(0);
			// Clear the comments and reason value entered previously
			component.setCommentOnAddition("");
			component.setReasonOnAddition(0.0);
			//Reset the 'save' button to dithered state and close the add recommendations window.
			var addRecommendationsWindow = MP_ModalDialog.retrieveModalDialogObject("addRecommendation");
			addRecommendationsWindow.setFooterButtonDither("addRecButton", true);
			MP_ModalDialog.closeModalDialog("addRecommendation");
		});
		addRecommendationModal.addFooterButton(cancelButton);
		addRecommendationModal.setFooterText(component.m_i18nStrings.RECORDED_FOR + " : " + providerLabel);
		addRecommendationModal.setLeftMarginPercentage(20).setRightMarginPercentage(20).setIsFooterAlwaysShown(true).setIsBodySizeFixed(false);

		// Set on close property to false so that modal window is not closed immeidately after we click on the save/cancel button
		addRecommendationModal.setFooterButtonCloseOnClick("addRecButton",false);
		addRecommendationModal.setFooterButtonCloseOnClick("cancelRecButton",false);

		addRecommendationModal.setBodyDataFunction(function () {

			var freeTextLink = "";
			if (component.getAllowFreeTextAdditionIndicator()) {
				freeTextLink = "<a class='recom-o2-free-text-link'>" + component.m_i18nStrings.ADD_FREETEXT + "</a>";
			}
			var leftWindowContainer = "<div id='addRecLeftContainer"+compId+"' class='recom-o2-add-rec-left-container'><div class='recom-o2-add-rec-header secondary-text'>" + component.m_i18nStrings.AVAILABLE_EXPECTATIONS + "</div><div class='recom-o2-add-rec-available-recs preloader'></div><div class='recom-o2-add-rec-free-text'>" + freeTextLink + "</div></div>";

			var reasonCommentsContainer = "<div class='recom-o2-add-rec-reason-comment-container'><div class='recom-o2-add-rec-reason secondary-text'></div><div class='recom-o2-add-rec-comment secondary-text'></div></div>";

			var rightWindowContainer = "<div id='addRecRightContainer"+compId+"' class='recom-o2-add-rec-right-container'><div class='recom-o2-add-rec-header secondary-text'>" + component.m_i18nStrings.SELECTED_EXPECTATIONS + "</div><div class='recom-o2-add-rec-selected-recs'></div>" + reasonCommentsContainer + "</div>";

			var modalDialogBodyHtml = "<div  id='addRecMainContainer"+compId+"' class='recom-o2-add-rec-main-container'>" + "<div id='addRecsaveFailure" + compId + "' class='recom-o2-save-failure-msg hidden'></div>" + leftWindowContainer + rightWindowContainer + "</div>";

			addRecommendationModal.setBodyHTML(modalDialogBodyHtml);
			
			//Make a call to mp_get_data_add_expectation if any of the data required is not available.
			if(!component.getCurrentProviderName().length || !component.getReasonCodeSet().length || !component.getTimeUnitsCodeSet().length){
				var recommendationsDataRequest = new ScriptRequest();
				recommendationsDataRequest.setProgramName("mp_get_data_add_expectation");
				// Set last parameter as 1 to retrieve provider name, reasons and frequency code set
				recommendationsDataRequest.setParameterArray(["^MINE^", component.getCriterion().provider_id + ".0", 1]);
				recommendationsDataRequest.setResponseHandler(function (replyObj) {
					component.saveCodeSetData(replyObj);
				});
				recommendationsDataRequest.performRequest();
			}

			//Check if the list of built schedules is available. Render the add window if available.
			if(component.getAllAvailableExpectations().SCHED){
				component.renderAddRecommendationsWindow(null);
			}
			
			//Make a call to mp_exec_std_request to fetch the built expectations if not available already.
			else{
				var APPLICATION_NUMBER = 966300;
				var TASK_NUMBER = 966310; 
				var REQUEST_NUMBER = 966318;
				var availableRecommendationsRequest = new ScriptRequest();
				availableRecommendationsRequest.setProgramName("mp_exec_std_request");
				availableRecommendationsRequest.setDataBlob(JSON.stringify({REQUESTIN:{}}));
				availableRecommendationsRequest.setParameterArray(["^MINE^","^^",APPLICATION_NUMBER, TASK_NUMBER, REQUEST_NUMBER]);
				availableRecommendationsRequest.setResponseHandler(function (replyObj) {
					component.renderAddRecommendationsWindow(replyObj);
				});
				availableRecommendationsRequest.performRequest();
			}

		});
		MP_ModalDialog.addModalDialogObject(addRecommendationModal);
	}

	MP_ModalDialog.updateModalDialogObject(addRecommendationModal);
	MP_ModalDialog.showModalDialog("addRecommendation");
};

/**
 *Saves the code set data retrieved by the script call.
 *@param {Object}  replyObj : reply with the code set data
 */
RecommendationsO2Component.prototype.saveCodeSetData = function (replyObj) {
	try {
		if (replyObj.getStatus() === "S") {
			var dataRequired = replyObj.getResponse();
			this.setCurrentProviderName(dataRequired.RECORDED_FOR_FULL_NAME);
			this.setReasonCodeSet(dataRequired.REASONS);
			this.setTimeUnitsCodeSet(dataRequired.FREQUENCY_RANGE);
			
		}
	} catch (error) {
		logger.logJSError(error, RecommendationsO2Component, "recommendations-o2.js", "saveCodeSetData");
	}
};

/**
 *Adds the available recommendations, provider name and reason and comment sections to the modal window.
 *@param {Object}  replyObj : reply with the available recommendations
 * If the replyObj passed is null, the component uses the cached data to display the built expectations
 */
RecommendationsO2Component.prototype.renderAddRecommendationsWindow = function (replyObj) {
	var addRecommendationsWindow = MP_ModalDialog.retrieveModalDialogObject("addRecommendation");
	var compId = this.m_componentId;
	try {
		//update the provider name
		$('#vwpModalDialogaddRecommendation').find('.recom-o2-add-rec-provider-name').text(this.getCurrentProviderName());

		//Add the comments and reason section
		this.renderReasonAndCommentsSection();
		
		/* if replyObj is passed, which is given when called from the response handler of 
		 * mp_exec_std_Request to get all the avilable expectations, 
		 * process the response and handle appropriately.
		 */
		if(replyObj){
			//add the available recommendations if the sript returns successfully
			if (replyObj.getStatus() === "S") {
				var availableRecs = replyObj.getResponse();

				this.processAvailableRecommendations(availableRecs);
				this.setAllAvailableExpectations(availableRecs);
				var availableRecsHtmlContent = this.renderAvailableRecommendations(availableRecs);

				$('.recom-o2-add-rec-left-container').find('.recom-o2-add-rec-available-recs').removeClass('preloader').append(availableRecsHtmlContent);
				$('li.recom-o2-add-rec-schedule-list-item ul').hide();
			} else {
				//if fails to retrieve results
				var messageType = "error";
				var messageInfo = this.m_i18nStrings.INLINE_ERROR_INFO;
				var messageText = this.m_i18nStrings.INLINE_ERROR_MESSAGE;
				var customClass = "recom-o2-add-rec-inline-error";

				//if no recommendations found from the build tool, set according message.
				if (replyObj.getStatus() === "Z") {
					messageType = "information";
					messageInfo = " ";
					messageText = this.m_i18nStrings.INLINE_INFO_MESSAGE;
					customClass = "recom-o2-add-rec-inline-information";
				}

				var inlineErrorHTML = MP_Core.generateUserMessageHTML(messageType, messageInfo, messageText, customClass);

				//If user is allowed to add free text recommendation, show error/information message in the left panel only
				if (this.getAllowFreeTextAdditionIndicator()) {
					$('#addRecLeftContainer'+compId).find('.recom-o2-add-rec-available-recs').removeClass('preloader').append(inlineErrorHTML);
				}
				//If user is not allowed to add free text recommendation, show error/information message in the body with appropriate size
				else {
					$('#addRecMainContainer'+compId).empty().append(inlineErrorHTML);
					addRecommendationsWindow.setLeftMarginPercentage(30).setRightMarginPercentage(30);
				}
			}
		}
		//If the replyObj is not passed, the cached data is processed and the available expectations are displayed.
		else{
			var availableBuiltRecs = this.getAllAvailableExpectations();
			this.processAvailableRecommendations(availableBuiltRecs);
			var availableBuiltRecsHtmlContent = this.renderAvailableRecommendations(availableBuiltRecs);

			$('.recom-o2-add-rec-left-container').find('.recom-o2-add-rec-available-recs').removeClass('preloader').append(availableBuiltRecsHtmlContent);
			$('li.recom-o2-add-rec-schedule-list-item ul').hide();
		}
		this.addEventListenersForLeftPanel();
		this.addEventListenersForRightPanel();

	} catch (error) {
		logger.logJSError(error, RecommendationsO2Component, "recommendations-o2.js", "renderAddRecommendationsWindow");
	}
};

/**
 * Creates and appends the reason and comment Section to the modal window
 */
RecommendationsO2Component.prototype.renderReasonAndCommentsSection = function () {
	var compId = this.m_componentId;
	var expectReasonOnAdd = this.getExpectReasonAdditionIndicator();
	//Based on the reason requirement preference on addition, add the required indicator
	var isRequiredStyle =  expectReasonOnAdd ? "recom-o2-required-display" : "";
	var isRequiredValue = expectReasonOnAdd ? "recom-o2-required-field" : "";
	var reasonCommentContainer = $('#addRecMainContainer'+compId).find('.recom-o2-add-rec-reason-comment-container');
	var reasonDropDown = "<select class='recom-o2-add-rec-reason-dropdown "+isRequiredValue+"'><option value=''></option>";
	var reasonCodeSet = this.getReasonCodeSet();

	//Create  the dropdown options from the code set.
	var reasonCodeSetLength = reasonCodeSet.length;
	for(var reasonIndex = 0; reasonIndex < reasonCodeSetLength; reasonIndex++){
		reasonDropDown += "<option value='" + reasonCodeSet[reasonIndex].REASON_CD + "'>" + reasonCodeSet[reasonIndex].REASON_DISPLAY + "</option>";
	}
	reasonDropDown += "</select>";
	var reasonHtml = "<span class='recom-o2-reason " + isRequiredStyle + "'>" + i18n.REASON + "</span><br/>" + reasonDropDown;
	var commentHtml = i18n.COMMENTS + "<br/><textarea id='addRecComment"+compId+"' class='recom-o2-add-rec-add-comment' cols='40' rows='2' maxlength='1000' placeholder='"+this.m_i18nStrings.ADD_A_COMMENT+"'></textarea>";
	reasonCommentContainer.find('.recom-o2-add-rec-reason').append(reasonHtml);
	reasonCommentContainer.find('.recom-o2-add-rec-comment').append(commentHtml);
};

/**
 * Creates the list of available recommendations html content in a tree structure and returns
 * @param {Array} - availableRecs - all the recommendations from he build tool
 * @return {String} - string with the html content 
 */
RecommendationsO2Component.prototype.renderAvailableRecommendations = function (availableRecs) {
	var availableRecsHtml = "<ul class='recom-o2-add-rec-schedule-list'>";
	var compId = this.m_componentId;
	var scheduleList = availableRecs.SCHED;
	var scheduleListLength = scheduleList.length;
	for(var scheduleIndex = 0; scheduleIndex < scheduleListLength; scheduleIndex++) {
		//Display only if the current schedule is not of immunization type.
		// 0 - health expectation, 1 - childhood immunization, 2 - adult immunization
		if (scheduleList[scheduleIndex].EXPECT_SCHED_TYPE_FLAG !== 1) {
			var seriesHtml = "<ul class='recom-o2-add-rec-series-list'>";
			var scheduleDisabledIndicator = scheduleList[scheduleIndex].DITHERED_IND ? "checked disabled" : "";
			var seriesList = scheduleList[scheduleIndex].SERIES;
			var seriesListLength = seriesList.length;
			for(var seriesIndex = 0; seriesIndex < seriesListLength; seriesIndex++){
				var seriesDisabledIndicator = scheduleDisabledIndicator ? "checked disabled" : seriesList[seriesIndex].DITHERED_IND ? "checked disabled" : "";
				seriesHtml += "<li id='series" + seriesList[seriesIndex].EXPECT_SERIES_ID + compId + "'class='recom-o2-add-rec-series-list-item' series-id='"+seriesList[seriesIndex].EXPECT_SERIES_ID+"' expect-id='"+seriesList[seriesIndex].EXPECT[0].EXPECT_ID+"' step-id='"+seriesList[seriesIndex].EXPECT[0].STEP[0].EXPECT_STEP_ID+"'><input type='checkbox' class='recom-o2-add-rec-series-checkbox' " + seriesDisabledIndicator + "/>" + seriesList[seriesIndex].EXPECT_SERIES_NAME + "</li>";
			}
			seriesHtml += "</ul>";
			availableRecsHtml += "<li id='schedule" + scheduleList[scheduleIndex].EXPECT_SCHED_ID + compId + "' class='recom-o2-add-rec-schedule-list-item' schedule-id='" + scheduleList[scheduleIndex].EXPECT_SCHED_ID + "'><div class='recom-o2-add-rec-expand-collapse-icon'/><input type='checkbox' class='recom-o2-add-rec-schedule-checkbox' " + scheduleDisabledIndicator + "/>&nbsp;" + scheduleList[scheduleIndex].EXPECT_SCHED_NAME + seriesHtml + "</li>";
		}
	}
	availableRecsHtml += "</ul>";
	return availableRecsHtml;
};

/**
 * Attaches event handlers to the elements on the left side panel of the window
 * Includes event handlers for schedules, serieses and free text link
*/
RecommendationsO2Component.prototype.addEventListenersForLeftPanel = function () {
	var component = this;
	var compId = this.m_componentId;
	var availableRecommendations = $('#addRecMainContainer'+compId).find('.recom-o2-add-rec-available-recs');
	//if the expand/collapse icon is clicked, the system should toggle the series list under that schedule.
	availableRecommendations.on('click', 'div.recom-o2-add-rec-expand-collapse-icon', function () {
		$(this).toggleClass('expanded');
		$(this).parent('li.recom-o2-add-rec-schedule-list-item').find('ul.recom-o2-add-rec-series-list').toggle();
	});

	//When a schedule level checkbox is checked/unchecked, all the series under that schedule need to be checked/unchecked and added/removed from the right panel respectively.
	availableRecommendations.on('change', '.recom-o2-add-rec-schedule-checkbox', function () {
		var seriesListItemToChange = $(this).parent('li.recom-o2-add-rec-schedule-list-item').find('ul li.recom-o2-add-rec-series-list-item');
		var checkIndicator = this.checked;
		if (checkIndicator) {
			seriesListItemToChange.each(function () {
				var currentCheckbox = $(this).find(':checkbox');
				if (!currentCheckbox.prop('disabled') && !currentCheckbox.prop('checked')) {
					currentCheckbox.prop('checked', checkIndicator);
					component.addSeriesToRightPanelSelectedList($(this));
				}
			});
		} else {
			seriesListItemToChange.each(function () {
				var currentCheckbox = $(this).find(':checkbox');
				if (!currentCheckbox.prop('disabled')) {
					var seriesId = $(this).attr('series-id');
					//just trigger the delete button handler
					$('#addRecRightContainer'+compId).find('.recom-o2-add-rec-selected-recs #selected' + seriesId + compId).find('.recom-o2-sel-series-del-button').click();
				}
			});
		}
	});

	//When a series level checkbox is checked/unchecked the series need to be added/removed from the right panel.
	//Also, make sure the schedule level checkbox is checked/unchecked appropriately.
	availableRecommendations.on('change', '.recom-o2-add-rec-series-checkbox', function () {
		var seriesListItem = $(this).parent('li.recom-o2-add-rec-series-list-item');
		var scheduleListItemToChange = seriesListItem.closest('.recom-o2-add-rec-schedule-list-item');
		if ($(this).prop('checked')) {
			component.addSeriesToRightPanelSelectedList(seriesListItem);
			var isAllSerieseChecked = true;
			scheduleListItemToChange.find('li.recom-o2-add-rec-series-list-item').each(function () {
				if (!$(this).find(':checkbox').prop('checked')) {
					isAllSerieseChecked = false;
					return;
				}
			});
			scheduleListItemToChange.find('.recom-o2-add-rec-schedule-checkbox').prop('checked', isAllSerieseChecked);
		} else {
			scheduleListItemToChange.find('.recom-o2-add-rec-schedule-checkbox').prop('checked', false);
			var seriesId = seriesListItem.attr('series-id');
			$('#addRecRightContainer'+compId).find('.recom-o2-add-rec-selected-recs #selected' + seriesId + compId).find('.recom-o2-sel-series-del-button').click();
		}
	});

	//A new free text expectation will be added to the right panel.
	$('#addRecMainContainer'+compId).find('.recom-o2-add-rec-free-text').on('click', '.recom-o2-free-text-link', function () {
		component.addFreeTextToRightPanelSelectedList();
	});
};

/**
 * Attaches event handlers to the elements on the right side panel of the window
 * Includes event handlers for age, frequency, free text name, due date and reason and comment fields
*/
RecommendationsO2Component.prototype.addEventListenersForRightPanel = function () {
	var component = this;
	var compId = this.m_componentId;
	var selectedRecommendations = $('#addRecRightContainer'+compId).find('.recom-o2-add-rec-selected-recs');

	//Clicking on the delete button on the top right side of the selected series will remove the series from the right side panel.
	selectedRecommendations.on('click', '.recom-o2-sel-series-del-button', function () {
		var selectedSeries = $(this).closest('.recom-o2-selected-series');
		var seriesId = selectedSeries.attr('series-id');
		var recommendationType = component.RECOMMENDATION_TYPE.FREE_TEXT;
		if (selectedSeries.attr('series-type') === "expectation") {
			recommendationType = component.RECOMMENDATION_TYPE.EXPECTATION;
			var checkboxToUpdate = $('.recom-o2-add-rec-available-recs').find('li #series' + seriesId + compId).find(':checkbox');
			checkboxToUpdate.prop('checked', false);
			checkboxToUpdate.closest('.recom-o2-add-rec-schedule-list-item').find('.recom-o2-add-rec-schedule-checkbox').prop('checked', false);
		}

		selectedSeries.remove();
		component.removeSelectedRecommendationListItem(recommendationType, seriesId);
		//Make sure if there are no expectations selected, save button is dithered.
		if (!$('#addRecRightContainer'+compId).find('.recom-o2-selected-series').length) {
			var addRecommendationsWindow = MP_ModalDialog.retrieveModalDialogObject("addRecommendation");
			addRecommendationsWindow.setFooterButtonDither("addRecButton", true);
		}
	});

	// Restrict age input to numbers only
	selectedRecommendations.on('keypress', '.recom-o2-sel-series-age-value', function (evt) {
		// Allow only 0-9 numbers to be entered along with left right cursor keys
		var charCode = evt.which ? evt.which : evt.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;
	});

	//age focus out
	selectedRecommendations.on('focusout', '.recom-o2-sel-series-age-value', function () {
		var ageValue = $(this).val();
		var datePickerElement = $(this).closest('.recom-o2-sel-series-due-date').find('.recom-o2-sel-series-date .recom-o2-date-selector-button');
		if(ageValue){
			//validate and update date and trigger change in date field
			var ageFieldsContainer = $(this).closest('.recom-o2-sel-series-age');
			var ageUnitSelected = ageFieldsContainer.find('.recom-o2-selected-series-age-drop-down option:selected').attr('meaning');
			var dueDate = component.validateDueDateBasedOnAgeSelected(parseInt(ageValue,10), ageUnitSelected);
			var informationMessageContainer = ageFieldsContainer.find('.recom-o2-inline-future-date-message');
			if (dueDate) {
				datePickerElement.datepicker("setDate", dueDate);
				if(!informationMessageContainer.hasClass('hidden')){
					informationMessageContainer.addClass('hidden');
				}
			} else {
				var inlineErrorHTML = MP_Core.generateUserMessageHTML("information", "", component.m_i18nStrings.FUTURE_DATE_INFO_MESSAGE);
				informationMessageContainer.empty().html(inlineErrorHTML);
				informationMessageContainer.removeClass('hidden');
				datePickerElement.datepicker("setDate", new Date());
			}
		}
		else{
			datePickerElement.datepicker("setDate", new Date());
			//Clear the 'select a future date' information message if already present
			var dateInformationMessageContainer = $(this).closest(".recom-o2-sel-series-age").find(".recom-o2-inline-future-date-message");
			if(!dateInformationMessageContainer.hasClass("hidden")){
				dateInformationMessageContainer.addClass("hidden");
			}
		}
		datePickerElement.prev('.recom-o2-date-selector-input').change();
	});
	//age dropdown change
	selectedRecommendations.on('change', '.recom-o2-selected-series-age-drop-down', function () {
		//As the age value focusout handler has the exact actions to be
		$(this).closest('.recom-o2-sel-series-age').find('.recom-o2-sel-series-age-value').focusout();
	});

	//series name focus out
	selectedRecommendations.on('focusout', '.recom-o2-new-series-title', function () {
		//update the free text name.
		var recommendationTempId = $(this).closest('.recom-o2-selected-series').attr('series-id');
		component.updateSelectedRecommendationListItem(recommendationTempId, "EXPECTATION_FTDESC", $(this).val(), component.RECOMMENDATION_TYPE.FREE_TEXT);
	});

	// Restrict frequency input to numbers only
	selectedRecommendations.on('keypress', '.recom-o2-sel-series-freq-val', function (evt) {
		// Allow only 0-9 numbers to be entered along with left right cursor keys
		var charCode = evt.which ? evt.which : evt.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}

		return true;
	});

	//frequency focus out
	selectedRecommendations.on('focusout', '.recom-o2-sel-series-freq-val', function () {
		//update the frequency value in the list.
		var recommendationTempId = $(this).closest('.recom-o2-selected-series').attr('series-id');
		//get the frequency_unit_cd
		var frequencyUnitDropDown = $(this).parent('.recom-o2-sel-series-freq-options').find('.recom-o2-selected-series-frequency-drop-down');
		var frequencyUnitVal = parseFloat(frequencyUnitDropDown.val());
		var recommendationType = component.getTheRecommendationTypeBasedOnElement($(this));
		component.updateSelectedRecommendationListItem(recommendationTempId, "FREQUENCY_VALUE", parseInt($(this).val(), 10), recommendationType);
		component.updateSelectedRecommendationListItem(recommendationTempId, "FREQUENCY_UNIT_CD", frequencyUnitVal, recommendationType);
	});

	//frequency dropdown change
	selectedRecommendations.on('change', '.recom-o2-selected-series-frequency-drop-down', function () {
		//update the frequency cd in the list.
		var recommendationTempId = $(this).closest('.recom-o2-selected-series').attr('series-id');
		var recommendationType = component.getTheRecommendationTypeBasedOnElement($(this));
		var frequencyCodeValue = $(this).find('option:selected').val();
		component.updateSelectedRecommendationListItem(recommendationTempId, "FREQUENCY_UNIT_CD", parseFloat(frequencyCodeValue), recommendationType);
	});

	//value change in the date textbox
	selectedRecommendations.on('change', '.recom-o2-date-selector-input', function () {
		//update the date in the list.
		var recommendationTempId = $(this).closest('.recom-o2-selected-series').attr('series-id');
		var recommendationType = component.getTheRecommendationTypeBasedOnElement($(this));
		var dateValue = $(this).parent(".recom-o2-sel-series-date").find("#dateValueButton"+recommendationTempId+compId).datepicker("getDate");
		component.updateSelectedRecommendationListItem(recommendationTempId, "NEW_DUE_DT_TM", dateValue, recommendationType);
	});
	
	//reason change
	$('.recom-o2-add-rec-reason-comment-container').on('change','.recom-o2-add-rec-reason-dropdown',function(){
		var reasonValue = $(this).find('option:selected').val();
		component.setReasonOnAddition(parseFloat(reasonValue));
	});
	
	//comment change
	$('.recom-o2-add-rec-reason-comment-container').on('focusout','.recom-o2-add-rec-add-comment',function(){
		var commentValue = $(this).val();
		component.setCommentOnAddition(commentValue);
	});
	//one-time only check box handler for free text
	selectedRecommendations.on('change','.recom-o2-sel-series-one-time-checkbox',function(){
		var checkedProperty = this.checked;
		var selectedSeries = $(this).closest('.recom-o2-selected-series');
		var frequencyFields = selectedSeries.find('.recom-o2-sel-series-freq-options');
		var recommendationTempId = selectedSeries.attr('series-id');
		var recommendationType = component.getTheRecommendationTypeBasedOnElement($(this));
		//If the one-time only checkbox is checked, disable the frequency fields and update the selected list.
		if(checkedProperty){
			frequencyFields.find('.recom-o2-sel-series-freq-val').val("").prop('disabled',true).removeClass('recom-o2-required-field');
			frequencyFields.find('.recom-o2-selected-series-frequency-drop-down').prop('disabled',true);
			component.updateSelectedRecommendationListItem(recommendationTempId, "FREQUENCY_VALUE", 0.0, recommendationType);
			component.updateSelectedRecommendationListItem(recommendationTempId, "FREQUENCY_UNIT_CD", 0.0, recommendationType);
		}
		//If the checkbox is unchecked, enable the frequency fields
		else{
			frequencyFields.find('.recom-o2-sel-series-freq-val').prop('disabled', false).addClass('recom-o2-required-field');
			frequencyFields.find('.recom-o2-selected-series-frequency-drop-down').prop('disabled', false);
		}
	});
	
	//restricting the content entered in textarea to 1000 characters only.
	//Internet explorer 8 and 9 don't support the maxlength property.
	$('.recom-o2-add-rec-reason-comment-container').on('paste keyup change','.recom-o2-add-rec-add-comment',function(){
		var maxLength = 1000;
		var currentCommentText = $(this).val();
		if (currentCommentText.length > maxLength) {
			$(this).val(currentCommentText.substring(0, maxLength));
		}	
	});
};

/**
 * Validates the given age with patients current age
 * Returns false if the given value is lesser than patients current age
 * Returns date calculated by adding the given value to patients age if
 * the provided value is greater than the patients current age.
 *@param {number} - ageValue - value in numbers
 *@param {string} - ageUnit - units like DAYS,WEEKS, MONTHS, YEARS
*/
RecommendationsO2Component.prototype.validateDueDateBasedOnAgeSelected = function (ageValue, ageUnit) {
	//return false if the age selected is less than the patient's age
	//return date if the age is more than the patient's current age.
	if(!this.getPatientDOB()){
		throw new Error("The patient DOB is not available");
	}
	//GetDateDiffString will return the patient's age in specified units in this context
	var patientCurrentAgeInSelectedUnit = this.GetDateDiffString(this.getPatientDOB(), new Date(), ageUnit);
	if (patientCurrentAgeInSelectedUnit > ageValue) {
		return false;
	} else {
		return this.getDateBasedOnDifference(this.getPatientDOB(), ageValue, ageUnit);
	}
};

/**
 * Returns a date which is retrieved by adding the provided number of and units of time to the beginDate
 *@param {Date Object} - beginDate - begin date to which the value needs to be added
 *@param {Number} - difference - value of the difference to be added
 *@param {String} - differenceUnits - Units to be considered like DAYS,WEEKS, MONTHS, YEARS
*/
RecommendationsO2Component.prototype.getDateBasedOnDifference = function (beginDate, difference, differenceUnits) {
	var calculatedDate = new Date(beginDate);
	var DAYS_IN_WEEK = 7;
	var MIL_SECS_IN_HOUR = 3600000;
	switch (differenceUnits.toUpperCase()) {
	case 'YEARS':
		calculatedDate.setFullYear(calculatedDate.getFullYear() + difference);
		break;
	case 'MONTHS':
		calculatedDate.setMonth(calculatedDate.getMonth() + difference);
		break;
	case 'WEEKS':
		calculatedDate.setDate(calculatedDate.getDate() + DAYS_IN_WEEK * difference);
		break;
	case 'DAYS':
		calculatedDate.setDate(calculatedDate.getDate() + difference);
		break;
	case 'HOURS':
		calculatedDate.setTime(calculatedDate.getTime() + difference * MIL_SECS_IN_HOUR);
		break;
	default:
		calculatedDate.setFullYear(calculatedDate.getFullYear() + difference);
		break;
	}
	return calculatedDate;
};

/**
 * When an element is passed to this function,
 * it returns which type of recommendation the element belongs to in the rightside panel.
 * @param {Object} - the element inside the selected list of modal window
 * @return {Number} - specifies the type of recommendation selected.
*/
RecommendationsO2Component.prototype.getTheRecommendationTypeBasedOnElement = function (element) {
	var seriesType = element.closest('.recom-o2-selected-series').attr('series-type');
	if (seriesType === 'free-text') {
		return this.RECOMMENDATION_TYPE.FREE_TEXT;
	}
	else if(seriesType === 'expectation'){
		return this.RECOMMENDATION_TYPE.EXPECTATION;
	}
};

/**
 * Adds the required fields to the right side panel when free text link is selected
 */
RecommendationsO2Component.prototype.addFreeTextToRightPanelSelectedList = function () {
	var addRecommendationsWindow = MP_ModalDialog.retrieveModalDialogObject("addRecommendation");
	addRecommendationsWindow.setFooterButtonDither("addRecButton", false);
	var criterion = this.getCriterion();
	var freeTextCounter = this.getIncrementedFreeTextCounter();
	var freeTextCounterWithID = freeTextCounter.toString() + this.m_componentId;
	var disabledPropertyForAge = "";
	if (!this.getPatientDOB()) {
		disabledPropertyForAge = "disabled";
	}
	
	var freqDropDown = this.renderDropDownWithUnitsCodeSet("frequency", freeTextCounter, "");
	var ageDropDown = this.renderDropDownWithUnitsCodeSet("age", freeTextCounter, disabledPropertyForAge);

	var seriesName = "<span class='recom-o2-series-title-text recom-o2-required-display secondary-text'>" + this.m_i18nStrings.NEW_EXPECTATION_TITLE + "</span>";
	var seriesHeader = "<div class='recom-o2-sel-series-heading'><div class='recom-o2-sel-series-name'>" + seriesName + "</div><div class='recom-o2-sel-series-del-button'></div></div>";

	var expectationNameHtml = "<div class='recom-o2-new-series-title-input'><input type='text' size='32' id='freeTextName" + freeTextCounterWithID + "' series-id='" + freeTextCounter + "' class='recom-o2-new-series-title recom-o2-required-field'/><span class='secondary-text'><input type ='checkbox' class='recom-o2-sel-series-one-time-checkbox'/>&nbsp;"+this.m_i18nStrings.ONE_TIME_ONLY+"</span></div>";

	var frequencyContentHtml = "<div class='recom-o2-sel-series-frequency'><span class='recom-o2-frequency-text recom-o2-required-display secondary-text'>" + this.m_i18nStrings.FREQUENCY + "</span><div class='recom-o2-sel-series-freq-options'><input id='freqVal" + freeTextCounterWithID + "' class='recom-o2-sel-series-freq-val recom-o2-required-field' type='text' maxlength='3' size='3' onpaste='return false'/>" + freqDropDown + "</div></div>";

	var ageContentHtml = "<div class='recom-o2-sel-series-age secondary-text'>" + i18n.AGE + "<br/><input id='ageVal" + freeTextCounterWithID + "' class='recom-o2-sel-series-age-value' type='text' maxlength='3' size='3' onpaste='return false'" + disabledPropertyForAge + "/>" + ageDropDown + " &nbsp;" + this.m_i18nStrings.OR + " &nbsp;<br/><div class='recom-o2-inline-future-date-message hidden'></div></div>";

	var dateContentHtml = "<div class='recom-o2-sel-series-date'><span class='recom-o2-required-display secondary-text'>" + i18n.DATE + "</span><br/><input id='dateVal" + freeTextCounterWithID + "' type='text' size='10' class='recom-o2-date-selector-input recom-o2-required-field' readonly='true'/><input type='button' id='dateValueButton" + freeTextCounterWithID + "' class='recom-o2-date-selector-button'/></div>";

	var selectedSeriesHtml = "<div id='selected" + freeTextCounterWithID + "' class='recom-o2-selected-series free-text' series-id='" + freeTextCounter + "' series-type='free-text'>" + seriesHeader + expectationNameHtml + "<div class='recom-o2-sel-series-options'>" + frequencyContentHtml + "<div class='recom-o2-sel-series-due-date'>" + ageContentHtml + dateContentHtml + "</div></div></div>";

	//always prepend the free text expectations.
	$('#addRecRightContainer'+this.m_componentId).find('.recom-o2-add-rec-selected-recs').prepend(selectedSeriesHtml);

	//attach the datepicker
	this.attachDatePicker(freeTextCounter, "selected", false, new Date());

	//add the free text expectation to the list available at the component level.
	var addActionObject = this.getAssignActionObject();

	addActionObject.RECOMMENDATION_TEMP_ID = freeTextCounter.toString();
	addActionObject.PERSON_ID = criterion.person_id;
	addActionObject.ON_BEHALF_OF_PRSNL_ID = criterion.provider_id;
	addActionObject.NEW_DUE_DT_TM = new Date();

	this.addItemToSelectedFreeTextExpectationsList(addActionObject);

};

/**
 * Adds the required fields to the right side panel when a series is selected
 * @param {Object} - the list item element to be added to the right side panel of the window
 */
RecommendationsO2Component.prototype.addSeriesToRightPanelSelectedList = function (seriesListItem) {
	try {
		var addRecommendationsWindow = MP_ModalDialog.retrieveModalDialogObject("addRecommendation");
		addRecommendationsWindow.setFooterButtonDither("addRecButton", false);
		var seriesId = seriesListItem.attr('series-id');
		var expectId = seriesListItem.attr('expect-id');
		var stepId = seriesListItem.attr('step-id');
		var seriesName = seriesListItem.text();
		var criterion = this.getCriterion();
		var compId = this.m_componentId;
		var disabledPropertyForAge = "";
		var disablePropertyForFrequency = "";
		var currentFrequencyValueObject = null;
		/*
		calculate the frequency
		if frequency is one-time only,  make disablePropertyForFrequency as "disabled"
		*/
		var seriesFrequencyTypeObject = this.determineFrequencyType(parseInt(seriesId, 10));
		var seriesFrequencyType = seriesFrequencyTypeObject.frequencyType;
		var frequencyTypes = this.FREQUENCY_TYPE;
		var frequencyDisplay = "";
		switch(seriesFrequencyType){
			case frequencyTypes.SEASONAL:
				disablePropertyForFrequency = "disabled";
				frequencyDisplay = this.m_i18nStrings.SEASONAL;
				break;
			case frequencyTypes.VARIABLE:
				frequencyDisplay = this.m_i18nStrings.VARIABLE;
				break;
			case frequencyTypes.ONE_TIME_ONLY:
				disablePropertyForFrequency = "disabled";
				frequencyDisplay = this.m_i18nStrings.ONE_TIME_ONLY;
				break;
			case frequencyTypes.FIXED_NO_OF_DAYS:
				var seriesFrequencyInDays = seriesFrequencyTypeObject.frequencyInDays;
				currentFrequencyValueObject = this.formatFrequency(seriesFrequencyInDays);
				break;
		}
		
		//If the patient's age is not available, the age fields will be disabled
		if (!this.getPatientDOB()) {
			disabledPropertyForAge = "disabled";
		}
		
		var freqDropDown = this.renderDropDownWithUnitsCodeSet("frequency", seriesId,disablePropertyForFrequency);
		var ageDropDown = this.renderDropDownWithUnitsCodeSet("age", seriesId, disabledPropertyForAge);
		
		var seriesHeader = "<div class='recom-o2-sel-series-heading'><div class='recom-o2-sel-series-name'>" + seriesName + "</div><div class='recom-o2-sel-series-del-button'></div></div>";
		
		var frequencyContentHtml = "<div class='recom-o2-sel-series-frequency  secondary-text'>" + this.m_i18nStrings.FREQUENCY + "<span class='recom-o2-sel-series-freq-display'>" + frequencyDisplay + "</span><div class='recom-o2-sel-series-freq-options'><input id='freqVal" + seriesId + compId + "' class='recom-o2-sel-series-freq-val' type='text' maxlength='3' size='3' onpaste='return false'" + disablePropertyForFrequency + "/>" + freqDropDown + "</div></div>";
		
		var ageContentHtml = "<div class='recom-o2-sel-series-age secondary-text'>" + i18n.AGE + "<br/><input id='ageVal" + seriesId + compId + "' class='recom-o2-sel-series-age-value' type='text' maxlength='3' size='3' onpaste='return false' " + disabledPropertyForAge + "/>" + ageDropDown + " &nbsp;" + this.m_i18nStrings.OR + " &nbsp;<br/><div class='recom-o2-inline-future-date-message hidden'></div></div>";
		
		var dateContentHtml = "<div class='recom-o2-sel-series-date secondary-text'><span class='recom-o2-required-display'>" + i18n.DATE + "</span><br/><input id='dateVal" + seriesId + compId + "' type='text' size='10' class='recom-o2-date-selector-input' readonly='true'/><input type='button' id='dateValueButton" + seriesId + compId + "' class='recom-o2-date-selector-button'/></div>";
		
		var selectedSeriesHtml = "<div id='selected" + seriesId + compId + "' class='recom-o2-selected-series' series-id='" + seriesId + "' series-type='expectation'>" + seriesHeader + "<div class='recom-o2-sel-series-options'>" + frequencyContentHtml + "<div class='recom-o2-sel-series-due-date'>" + ageContentHtml + dateContentHtml + "</div></div></div>";
				
		$('#addRecRightContainer'+compId).find('.recom-o2-add-rec-selected-recs').append(selectedSeriesHtml);
		this.attachDatePicker(seriesId, "selected", false, new Date());
		
		var addActionObject = this.getAssignActionObject();
		
		//update the frequency values in frequency field
		if(currentFrequencyValueObject){
			var currentSeriesContent = $('#selected'+seriesId+compId);
			currentSeriesContent.find('#freqVal'+seriesId+compId).val(currentFrequencyValueObject.frequencyValue);
			$("#frequencyOption"+seriesId+compId).val(currentFrequencyValueObject.frequencyCodeValue);
			addActionObject.FREQUENCY_VALUE = currentFrequencyValueObject.frequencyValue; 
			addActionObject.FREQUENCY_UNIT_CD = currentFrequencyValueObject.frequencyCodeValue;
			var fixedDaysFrequencyObject = {
				"SERIES_ID":seriesId,
				"FREQUENCY_VALUE":currentFrequencyValueObject.frequencyValue,
				"FREQUENCY_UNIT_CD":currentFrequencyValueObject.frequencyCodeValue
			};
			this.addExpectationWithFixedDaysFrequency(fixedDaysFrequencyObject);
		}
		addActionObject.RECOMMENDATION_TEMP_ID = seriesId;
		addActionObject.PERSON_ID = criterion.person_id;
		addActionObject.EXPECT_ID = parseFloat(expectId);
		addActionObject.STEP_ID = parseFloat(stepId);
		addActionObject.ON_BEHALF_OF_PRSNL_ID = criterion.provider_id;
		addActionObject.NEW_DUE_DT_TM = new Date();

		this.addItemToSelectedExpectationsList(addActionObject);

	} catch (error) {
		logger.logJSError(error, RecommendationsO2Component, "recommendations-o2.js", "addSeriesToRightPanelSelectedList");
	}
};

/**
 * Creates a dropdown with the time units
 * @param {String} - context - helps to distinguish class and IDs of the dropdown
 * @param {String} - seriesId - helps to have unique IDs for the dropdowns created
 * @param {String} - disabledProperty - determines if the dropdown needs to be disabled or not
 * @return {String} - dropDown - html content of the dropdown created
 */
RecommendationsO2Component.prototype.renderDropDownWithUnitsCodeSet = function (context, seriesId, disabledProperty) {
	var dropDown = "<select id='" + context + "Option" + seriesId + this.m_componentId + "' class='recom-o2-selected-series-" + context + "-drop-down' " + disabledProperty + ">";
	var unitsCodes = this.getTimeUnitsCodeSet();
	var codeSetLength = unitsCodes.length;
	for(var codeIndex = 0; codeIndex < codeSetLength; codeIndex++) {
		dropDown += "<option value='" + unitsCodes[codeIndex].FREQUENCY_CD + "' meaning='" + unitsCodes[codeIndex].FREQUENCY_MEANING + "'>" + unitsCodes[codeIndex].FREQUENCY_DISPLAY + "</option>";
	}
	dropDown += "</select>";
	return dropDown;
};

/**
 * Creates and attaches a datepicker to the selected recommendation
 *
 * @param {string} seriesId - helps to get unique ID of the datepicker
 *								helps to attach it to the correct list item.
 *
 * @param {string} containerDiv the container div on which the date button is placed
 *
 * @param {boolean} allowPastDates A boolean flag indicating whether past dates should be allowed or not
 * 
 * @param {boolean} dateObject the date we want to set the date in date picker
 */
RecommendationsO2Component.prototype.attachDatePicker = function (seriesId, containerDiv, allowPastDates, dateObject) {
	var compId = this.m_componentId;
	var datePickerElement = null;
	var minDateValue = allowPastDates ? "" : "0d";

	var datePickerOptions = {
		showOn : "both",
		buttonImage : CERN_static_content + "/images/4974.png",
		buttonImageOnly : true,
		buttonText : "",
		changeMonth : true,
		changeYear : true,
		minDate : minDateValue,
		altField : $('#dateVal' + seriesId + compId),
		showButtonPanel : true,
		dateFormat : MP_Util.GetDateFormatter().lc.fulldate2yr,
		onSelect : function(){
				var futureDateMsg = $(this).closest('.recom-o2-sel-series-due-date').find('.recom-o2-inline-future-date-message');
				if(!(futureDateMsg.hasClass('hidden'))){
					futureDateMsg.addClass('hidden');
				}
				$('#dateVal' + seriesId + compId).change();
			}
	};

	datePickerElement = $('#' + containerDiv + seriesId + compId).find('#dateValueButton' + seriesId + compId);
	datePickerElement.datepicker(datePickerOptions);

	if(dateObject) {
		datePickerElement.datepicker("setDate", dateObject);
	}
};

/**
 * Removes the specific recommendation from the lists preserved at the component level.
 * @param {Number} - recommendationType - determines the list from which the recommendations needs to be removed.
 * @param {String} - recommendationId - the unique ID to search the list
 */
RecommendationsO2Component.prototype.removeSelectedRecommendationListItem = function (recommendationType, recommendationId) {
	var listToUpdate = [];
	var listIndexToRemove = -1;
	if (recommendationType === this.RECOMMENDATION_TYPE.FREE_TEXT) {
		listToUpdate = this.getSelectedFreeTextExpectationsList();
	} else if (recommendationType === this.RECOMMENDATION_TYPE.EXPECTATION) {
		listToUpdate = this.getSelectedExpectationsList();
	}
	
	for(var listIndex = listToUpdate.length; listIndex--;){
		if (listToUpdate[listIndex].RECOMMENDATION_TEMP_ID === recommendationId) {
			listIndexToRemove = listIndex;
			break;
		}
	}
	if (listIndexToRemove !== -1) {
		listToUpdate.splice(listIndexToRemove, 1);
	}
};

/**
 * Updates a specific property in the list of recommendations preserved at the component level.
 * @param {String} - recommendationTempId - the unique ID to search the list.
 * @param {String} - updateField - the fields that needs to be updated
 * @param {String} - updateValue - the value to be updated
 * @param {Number} - recommendationType - determines the list which needs to be updated
 */
RecommendationsO2Component.prototype.updateSelectedRecommendationListItem = function (recommendationTempId, updateField, updateValue, recommendationType) {
	var listToUpdate = [];
	if (recommendationType === this.RECOMMENDATION_TYPE.EXPECTATION) {
		listToUpdate = this.getSelectedExpectationsList();
	} else if (recommendationType === this.RECOMMENDATION_TYPE.FREE_TEXT) {
		listToUpdate = this.getSelectedFreeTextExpectationsList();
	}
	
	for(var listIndex = listToUpdate.length; listIndex--;){
		if (listToUpdate[listIndex].RECOMMENDATION_TEMP_ID === recommendationTempId) {
			var ListItemToUpdate = listToUpdate[listIndex];
			ListItemToUpdate[updateField] = updateValue;
			break;
		}
	}
};

/**
 *Processes the recommendations for easier rendering
 *@param {Object} availableRecs : available records from the build tool
 */
RecommendationsO2Component.prototype.processAvailableRecommendations = function (availableRecs) {
	var scheduleList = availableRecs.SCHED;
	var scheduleListAssigned = this.getRecommendationsDataReply();
	scheduleList.sort(function (a, b) {
		if (a.EXPECT_SCHED_NAME.toUpperCase() > b.EXPECT_SCHED_NAME.toUpperCase()) {
			return 1;
		} else if (a.EXPECT_SCHED_NAME.toUpperCase() < b.EXPECT_SCHED_NAME.toUpperCase()) {
			return -1;
		}
		return 0;
	});
	/**
	 * Iterate through the mp_get_hmi reply to check the already assigned series.
	 * If the length of the schedules is same, that indicates all the series are assigned.
	 */
	for(var i = scheduleListAssigned.length; i--;){ 
		for(var j = scheduleList.length; j--;){
			if (scheduleListAssigned[i].SCHEDULE_ID === scheduleList[j].EXPECT_SCHED_ID) {
				//setting dithered indicator at the schedule level if the lengths are same.
				if (scheduleListAssigned[i].SERIES.length === scheduleList[j].SERIES.length) {
					scheduleList[j].DITHERED_IND = true;
				}
				//if only some of the series are assigned, traverse through the series and set the dithered indicator at the series level.
				else {
					var seriesList = scheduleListAssigned[i].SERIES;
					var availableSeries = scheduleList[j].SERIES;
					for(var seriesIndex = seriesList.length; seriesIndex--;){
						for(var availSeriesIndex = availableSeries.length; availSeriesIndex--;){
							if (seriesList[seriesIndex].SERIES_ID === availableSeries[availSeriesIndex].EXPECT_SERIES_ID) {
								availableSeries[availSeriesIndex].DITHERED_IND = true;
								break;
							}
						}
					}
				}
				//Come out of the loop if the schedule id is found.
				break;
			}
		}
	}
};
/**
 *Check if favorite is set for a record
 *@param {number} expectId : expectation id of an expectation
 *@return { boolean } return true/false if favorite set or not
 */
RecommendationsO2Component.prototype.isFavoriteSet = function (expectId) {
	var favObjLength = this.m_recomPrefObj.favoritesObject.length;
	var favObj = this.m_recomPrefObj.favoritesObject;
	for (var i = 0; i < favObjLength; i++) {
		if (expectId === favObj[i].EXPECT_ID) {
			return favObj[i].FAVORITE;
		}
	}
};
/*
 ** Process the record data so rendering becomes more trivial
 */
RecommendationsO2Component.prototype.processResultsForRender = function(recomRecs) {
	var recomRecsLength = recomRecs.length;
	var compNS = this.getStyles().getNameSpace();
	var recomi18n = i18n.discernabu.recommendations_o2;
	var addProcedureActionObject = this.getAddProcedureAction();
	for (recomRecsLength; recomRecsLength--; ) {

		var recomResult = recomRecs[recomRecsLength];
		var dueDate = "--";
		var dateTime = new Date();
		var frequency = "";
		var statusText = "";
		var imgClass = "";
		var overdueClass = "";
		
		var modifyIndClass = "";
		var expectId = recomResult.EXPECT_ID;

		switch (recomResult.DUE_STATUS_FLAG) {
		case this.DUE_TYPE.OVERDUE:
			imgClass = compNS + "-overdue-img";
			overdueClass = compNS + "-overdue";
			statusText = recomi18n.OVER_DUE;
			break;
		case this.DUE_TYPE.NEARDUE:
			imgClass = compNS + "-neardue-img";
			statusText = recomi18n.NEAR_DUE;
			break;
		case this.DUE_TYPE.DUE:
			imgClass = compNS + "-due-img";
			statusText = recomi18n.DUE;
			break;
		case this.DUE_TYPE.SATISFIED:
			statusText = recomi18n.NOT_DUE;
			break;

		}

		recomResult.DUE_STATUS_TEXT = statusText;
		if (recomResult.GROUP_NAME === "!FREETEXT!") {
			recomResult.GROUP_NAME = recomi18n.FREETEXT;
			recomResult.FAVORITES_DISP = recomi18n.OTHERS;
		}
		if(recomResult.GROUP_NAME !== recomi18n.FREETEXT){
		if (this.isFavoriteSet(expectId)) {
			recomResult.FAVORITES = "<span expectId='" + expectId + "' class='recom-o2-fav-set'></span>";
			recomResult.FAVORITES_DISP = recomi18n.FAVORITES;
		} else {
			recomResult.FAVORITES = "<span expectId='" + expectId + "' class='recom-o2-fav-not-set'></span>";
			recomResult.FAVORITES_DISP = recomi18n.OTHERS;
		}


		}

		// -2 for Seasonal frequency
		// -1 for Variable frequency
		//  0 for One-time frequency
		if (recomResult.FREQ_VALUE === -2) {
			frequency = recomi18n.SEASONAL;
		}
		else if (recomResult.FREQ_VALUE === -1) {
			frequency = recomi18n.VARIABLE;
		}
		else if (recomResult.FREQ_VALUE === 0) {
			frequency = recomi18n.ONE_TIME_ONLY;
		}
		else if (recomResult.FREQ_VALUE > 0) {
			frequency = "Q " + recomResult.FREQ_VALUE + recomResult.FREQ_UNIT_DISP;
		}

		recomResult.FREQUENCY_TEXT = frequency;

		this.processResultsForHovering(recomResult);

		if (recomResult.DUE_DATE_UTC !== "") {
			dateTime.setISO8601(recomResult.DUE_DATE_UTC);
			dueDate = dateTime.format(dateFormat.masks.shortDate2);
		}

		if (recomResult.HAS_MODIFY_IND) {
			// Modified indicator
			modifyIndClass = compNS + "-modify-indicator";
		}

		var expClass = overdueClass;
		var frqClass = overdueClass;
		var dueClass = overdueClass;

		recomResult.DUE_IMAGE = "<div class='" + imgClass + "'>&nbsp;</div>";
		recomResult.EXPECTATION_NAME = "<span class='" + expClass + "'>" + recomResult.EXPECT_STEP + "</span>";
		recomResult.PRIORITY_TYPE = "<span class='" + overdueClass + "'>" + recomResult.PRIORITY_DISP + "</span>";
		recomResult.FREQUENCY = "<span class='" + frqClass + "'>" + frequency + "</span>";
		recomResult.DUE_DATE_STRING = "<span class='" + dueClass + "'>" + dueDate + "</span>";

		recomResult.EXPECTATION_NAME = recomResult.HAS_EXP_MODIFY_IND ? (recomResult.EXPECTATION_NAME + "<span class='recom-o2-modify-indicator " + overdueClass + "'></span>") : recomResult.EXPECTATION_NAME;
		recomResult.FREQUENCY = recomResult.HAS_FREQ_MODIFY_IND ? (recomResult.FREQUENCY + "<span class='recom-o2-modify-indicator " + overdueClass + "'></span>") : recomResult.FREQUENCY;
		recomResult.DUE_DATE_STRING = recomResult.HAS_DUE_DATE_MODIFY_IND ? (recomResult.DUE_DATE_STRING + "<span class='recom-o2-modify-indicator " + overdueClass + "'></span>") : recomResult.DUE_DATE_STRING;
		recomResult.REFERENCE_TEXT = this.hasReferenceText(recomResult) ? ("<span class='recom-o2-reference-text-icon'></span>") : "";
		// Save the index so that we can click on this row once the table is rendered
		if(this.m_modifyObject.saveSuccessful && recomResult.RECOMMENDATION_ID === this.m_modifyObject.RECOMMENDATION_ID) {
			this.m_modifyObject.modifiedRowId = "row" + recomRecsLength;
		} else if (this.getActionObject() && this.getActionObject().saveSuccessful && recomResult.RECOMMENDATION_ID === this.getActionObject().RECOMMENDATION_ID) {
			this.getActionObject().modifiedRowId = "row" + recomRecsLength;
		}else if( recomResult.RECOMMENDATION_ID === this.m_systemSatisfierAction.recommendationId
					&& this.m_componentId === this.m_systemSatisfierAction.componentId)
		{		
			this.m_systemSatisfierAction.modifiedRowId = "row" + recomRecsLength;
		}else if( addProcedureActionObject && addProcedureActionObject.saveSuccessful && recomResult.RECOMMENDATION_ID === addProcedureActionObject.RECOMMENDATION_ID){
			addProcedureActionObject.modifiedRowId = "row" + recomRecsLength;
		}
	}
};
/**
 * This function checks if the recommendation has a reference text available at any level.
 * @param {object}  the recommendation object
 * @return{boolean} returns true if reference text available else false
*/
RecommendationsO2Component.prototype.hasReferenceText = function (recomResult) {
	if (this.m_referenceTextExistsObj) {
	var entityList = this.m_referenceTextExistsObj.ENTITY_LIST;
	var entityListLength = entityList.length;
	var satisfiers = recomResult.SATISFIERS;
	var currentEntity = null;
	var hasReferencetext = false;
	var satisfierLength = satisfiers.length;
	var currentSatisfier = null;
	for (var i = 0; i < entityListLength; i++) {
		currentEntity = entityList[i];
		if (currentEntity.PARENT_ENTITY_ID === recomResult.EXPECT_ID) {
			recomResult.EXPECTATION_REF_TEXT_ENTITY = currentEntity;
			hasReferencetext = true;
			recomResult.EXPECTATION_REF_TEXT = 1;
		} else if (currentEntity.PARENT_ENTITY_ID === recomResult.SCHED_ID) {
			recomResult.SCHEDULE_REF_TEXT_ENTITY = currentEntity;
			hasReferencetext = true;
			recomResult.SCHEDULE_REF_TEXT = 1;
		} else {
			for (var j = 0; j < satisfierLength; j++) {
				currentSatisfier = satisfiers[j];
				if (currentEntity.PARENT_ENTITY_ID === currentSatisfier.EXPECT_SAT_ID) {
					currentSatisfier.SATISFIER_REF_TEXT_ENTITY = currentEntity;
					hasReferencetext = true;
					currentSatisfier.SCHEDULE_REF_TEXT = 1;
				}
			}
		}
	}
	return hasReferencetext;
	} else {
		return false;
	}
};
/**
 *Check if favorite object exists in the saved favorites objects
 *@param {number, boolean} curElementExpectId : expectation id of an expectation
							boolFav : set favorite flag
 *@return { boolean } return true/false if favorite object exists or not
 */
RecommendationsO2Component.prototype.updateFavoriteObj = function (curElementExpectId, boolFav) {
	var preferenceObj = this.m_recomPrefObj.favoritesObject;
	var preferenceObjLen = preferenceObj.length;
	for (preferenceObjLen; preferenceObjLen--;) {
		var curFav = preferenceObj[preferenceObjLen];
		var curFavRecomId = curFav.EXPECT_ID;
		if (curFavRecomId === curElementExpectId) {
			curFav.FAVORITE = boolFav;
			return true;
		}
	}
	return false;
};

/*
 ** Process the record data so hovering becomes more trivial
 */
RecommendationsO2Component.prototype.processResultsForHovering = function(recomResult) {

	/*
	 ** Initialize the modify indicators
	 */
	recomResult.HAS_EXP_MODIFY_IND = false;
	recomResult.HAS_FREQ_MODIFY_IND = false;
	recomResult.HAS_DUE_DATE_MODIFY_IND = false;

	/*
	 ** Initialize the tool tip data markups
	 */
	recomResult.EXP_HOVER = "";
	recomResult.FREQ_HOVER = "";
	recomResult.DUE_DATE_HOVER = "";

	if (!recomResult.HAS_MODIFY_IND) {
		return;
	}

	var compNS = this.getStyles().getNameSpace();
	
	// If the view is in Touch mode, display the hover details in the side panel.So adding different class for the container.
	this.m_hoverContainerClassName = compNS + (CERN_Platform.isTouchModeEnabled() ? ("-rp-content-data " + compNS + "-rp-hover-details") : "-hover ");
	
	/*
	 ** Process assigned_info array for tooltip info
	 */
	if (recomResult.ASSIGNED_INFO.length) {
		recomResult.HAS_EXP_MODIFY_IND = true;
		recomResult.EXP_HOVER = this.processAssignedInfo(recomResult.ASSIGNED_INFO);
	}

	/*
	 ** Process freq_hist array for tooltip info
	 */
	if (recomResult.FREQ_HIST.length) {
		recomResult.HAS_FREQ_MODIFY_IND = true;
		recomResult.FREQ_HOVER = this.processFrequencyHistoryInfo(recomResult.FREQ_HIST);
	}
	/*
	 ** Process due_hist array for tooltip info
	 */
	if (recomResult.DUE_HIST.length) {
		recomResult.HAS_DUE_DATE_MODIFY_IND = true;
		recomResult.DUE_DATE_HOVER = this.processDueDateHistoryInfo(recomResult.DUE_HIST);
	}
};

/*
 ** Process the due date change information for hovering
 *  All the changes made on due date will be in the dueDateHistoryList.Take each record
 *  1. Find the provider name(who modified) by using the value of ACTION_PRSNL_ID from m_personnelArray(having all the information about the modifier).
 *  2. Find the action date by using the value of  ACTION_DATE.
 *  3. Find orig_due_date and  updated_due_date by using values of PREV_DUE_DATE and DUE_DATE respectively.
 *  4. Find Reason and Comments if its there.
 *  5. Concatenate the above in the format of
 **************************************************************************************
 *  Modified by <personnel name> on mm/dd/yyyy
 *  Due Date changed from <orig_due_date> to <updated_due_date>
 *  Reason: <Display reason that was selected in the change due date window, if exists>
 *  Comments:  <display comment, if exists>
 **************************************************************************************
 *  Add the above string as the text of a span, which will display on hover.
 */
RecommendationsO2Component.prototype.processDueDateHistoryInfo = function(dueDateHistoryList) {

	var recomi18n = i18n.discernabu.recommendations_o2;
	var listLength = dueDateHistoryList.length;
	var dueDateHistoryInfoHtml = "";

	for (var index = 0; index < listLength; index++) {
		var dateTime = new Date();
		var date = "--";
		var due = dueDateHistoryList[index];

		var provider = MP_Util.GetValueFromArray(due.ACTION_PRSNL_ID, this.m_personnelArray);
		var providerName = (provider === null) ? "--" : provider.fullName;

		if (due.ACTION_DATE !== "") {
			dateTime.setISO8601(due.ACTION_DATE);
			date = dateTime.format("shortDate2");
		}

		var prevDate = "--";
		var newDate = "--";

		if (due.PREV_DUE_DATE !== "") {
			dateTime.setISO8601(due.PREV_DUE_DATE);
			prevDate = dateTime.format("shortDate2");
		}

		if (due.DUE_DATE !== "") {
			dateTime.setISO8601(due.DUE_DATE);
			newDate = dateTime.format("shortDate2");
		}

		// Validate data exists, if not, display "--"
		due.REASON_TEXT = due.REASON_TEXT || "--";
		due.ACTION_COMMENT = due.ACTION_COMMENT.replace(/\n/g, "<br />") || "--";
		
		dueDateHistoryInfoHtml += "<span class = '" + this.m_hoverContainerClassName + "'><p>" + recomi18n.MODIFIED_BY.replace("{0}", providerName).replace("{1}", date) + "</p><p>" + recomi18n.DUE_DATE_CHANGED_FROM.replace("{0}", prevDate).replace("{1}", newDate) + "</p><p>" + recomi18n.REASON + " " + due.REASON_TEXT + " " + "</p><p>" + recomi18n.COMMENTS + " " + due.ACTION_COMMENT + "</p></span>";
	}

	return dueDateHistoryInfoHtml;

};

/*
 ** Process the frequency change information for hovering
 * *  All the changes made on frequency will be in the freqHistoryList.Take each record
 *  1. Find the provider name(who modified) by using the value of ACTION_PRSNL_ID from m_personnelArray(having all the information about the modifier).
 *  2. Find the action date by using the value of  ACTION_DATE.
 *  3. Find orig_freq and  updated_freq by using values of PREV_FREQ_VALUE and FREQ_VALUE respectively.
 *  4. Find Reason and Comments if its there.
 *  5. Concatenate the above in the format of
 **************************************************************************************
 *  Modified by <personnel name> on mm/dd/yyyy
 *  Frequency change from <orig_freq> to <updated_freq>
 *  Reason: <display reason that was selected in the Change Frequency window, if exists>
 *  Comments:  <display comment, if exists>
 **************************************************************************************
 *  Add the above string as the text of a span, which will display on hover.
 */
RecommendationsO2Component.prototype.processFrequencyHistoryInfo = function(freqHistoryList) {

	var recomi18n = i18n.discernabu.recommendations_o2;
	var listLength = freqHistoryList.length;
	var frequencyHistoryInfoHtml = "";

	for (var index = 0; index < listLength; index++) {

		var dateTime = new Date();
		var date = "--";
		var freq = freqHistoryList[index];

		var provider = MP_Util.GetValueFromArray(freq.ACTION_PRSNL_ID, this.m_personnelArray);
		var providerName = (provider === null) ? i18n.UNKNOWN : provider.fullName;

		if (freq.ACTION_DATE !== "") {
			dateTime.setISO8601(freq.ACTION_DATE);
			date = dateTime.format("shortDate2");
		}

		/*
		 * 0   = "One time Only"
		 * -1  = "Variable"
		 * -2  = "Seasonal"
		 * > 0 = freq.FREQ_VALUE + freq.FREQ_UNIT_DISP (eg: 1 year, 2 days, 3 Months, 5 Weeks)
		 **/

		
		var prevFreq = (freq.PREV_FREQ_VALUE === 0) ? this.getInitialFrequency(freqHistoryList) : (freq.PREV_FREQ_VALUE === -1) ? recomi18n.VARIABLE : (freq.PREV_FREQ_VALUE + " " + freq.PREV_FREQ_UNIT_DISP);
		var newfreq = (freq.FREQ_VALUE === 0) ? this.getInitialFrequency(freqHistoryList) : (freq.FREQ_VALUE === -1) ? recomi18n.VARIABLE : (freq.FREQ_VALUE + " " + freq.FREQ_UNIT_DISP);

		// Validate data exists, if not, display "--"
		freq.REASON_TEXT = (freq.REASON_TEXT) ? freq.REASON_TEXT : "--";
		freq.ACTION_COMMENT = (freq.ACTION_COMMENT) ? freq.ACTION_COMMENT.replace(/\n/g, "<br />") : "--";
		
		frequencyHistoryInfoHtml += "<span class = '" + this.m_hoverContainerClassName + "'><p>" + recomi18n.MODIFIED_BY.replace("{0}", providerName).replace("{1}", date) + "</p><p>" + recomi18n.FREQUENCY_CHANGED_FROM.replace("{0}", prevFreq).replace("{1}", newfreq) + "</p><p>" + recomi18n.REASON + " " + freq.REASON_TEXT + " " + "</p><p>" + recomi18n.COMMENTS + " " + freq.ACTION_COMMENT + "</p></span>";
	}

	return frequencyHistoryInfoHtml;
};
/**
 * Function to get initial frequency
 * This function will be called while creating the frequency html for hover
 * @param {array} frequency history list
 * @return {string} initial frequency html markup
 */
RecommendationsO2Component.prototype.getInitialFrequency = function (freqHistoryList) {
	var listLength = freqHistoryList.length;
	var recomi18n = i18n.discernabu.recommendations_o2;
	if (freqHistoryList[listLength - 1].PREV_FREQ_VALUE === 0) {
		return recomi18n.ONE_TIME_ONLY;
	} else if (freqHistoryList[listLength - 1].PREV_FREQ_VALUE === -1) {
		return recomi18n.VARIABLE;
	}
	return freqHistoryList[listLength - 1].PREV_FREQ_VALUE + " " + freqHistoryList[listLength - 1].PREV_FREQ_UNIT_DISP;

};

/*
 ** Process the changes made on expectation for hovering
 *  If the expectation is free text or manually assigned expectation via ad hoc, assignedInfoList have the details about that.
 *  There will only ever be at most one item in this assigned_info list.
 *  1. Find the provider name(who modified) by using the value of ACTION_PRSNL_ID from m_personnelArray(having all the information about the modifier).
 *  2. Find the action date by using the value of  ACTION_DATE.
 *  3. Find Reason and Comments if its there.
 *  4. Concatenate the above in the format of
 **************************************************************************************
 *  Assigned by <Personnel Name> on mm/dd/yyyy
 *  Reason: <reason, if exists>
 *  Comments: <comments, if exists>
 **************************************************************************************
 *  Add the above string as the text of a span, which will display on hover.
 */
RecommendationsO2Component.prototype.processAssignedInfo = function(assignedInfoList) {
	var recomi18n = i18n.discernabu.recommendations_o2;
	var dateTime = new Date();
	var date = "--";
	var assignedInfoHtml = "";

	// There will only ever be at most one item in this assigned_info list
	var infoObj = assignedInfoList[0];

	var provider = MP_Util.GetValueFromArray(infoObj.ACTION_PRSNL_ID, this.m_personnelArray);
	var providerName = (provider === null) ? i18n.UNKNOWN : provider.fullName;

	if (infoObj.ACTION_DATE !== "") {
		dateTime.setISO8601(infoObj.ACTION_DATE);
		date = dateTime.format("shortDate2");
	}

	// Validate data exists, if not, display "--"
	infoObj.REASON_TEXT = (infoObj.REASON_TEXT) ? infoObj.REASON_TEXT : "--";
	infoObj.ACTION_COMMENT = (infoObj.ACTION_COMMENT) ? infoObj.ACTION_COMMENT.replace(/\n/g, "<br />") : "--";

	assignedInfoHtml = "<span class = '" + this.m_hoverContainerClassName + "'><p>" + recomi18n.ASSIGNED_BY.replace("{0}", providerName).replace("{1}", date) + "</p><p>" + recomi18n.REASON + " " + infoObj.REASON_TEXT + "</p><p>" + recomi18n.COMMENTS + " " + infoObj.ACTION_COMMENT + "</p></span>";

	return assignedInfoHtml;
};

/*
 ** Retrieve the Recommendations component information for rendering.
 */
RecommendationsO2Component.prototype.retrieveComponentData = function() {

	var criterion = this.getCriterion();
	var retrieveAdditionalDetails = 1;
	var self = this;

	this.resetModifyIndicators();

	var loadTimer = new RTMSTimer(this.getComponentLoadTimerName());
	var renderTimer = new RTMSTimer(this.getComponentRenderTimerName());
	
	//Adding this to show the loading text when a new expectation is added/ when date range is changed
	var rootComponentNode = this.getRootComponentNode();
	if(rootComponentNode)
	{
		$(rootComponentNode).find(".sec-total").html(i18n.LOADING_DATA+"...");		
	}
	var scriptRequest = new ComponentScriptRequest();
	scriptRequest.setProgramName("MP_GET_HMI");
	scriptRequest.setParameterArray(["^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.encntr_id + ".0", retrieveAdditionalDetails, criterion.position_cd + ".0"]);
	scriptRequest.setComponent(this);
	scriptRequest.setLoadTimer(loadTimer);
	scriptRequest.setRenderTimer(renderTimer);
	scriptRequest.setResponseHandler(function(scriptReply) {
		self.renderComponent(scriptReply);
	});
	scriptRequest.performRequest();
};

/*
 ** Create a TableColumn object and set the properties like class name, display field,sorting info
 */
RecommendationsO2Component.prototype.createColumn = function(colInfo) {

	var column = new TableColumn();

	column.setColumnId(colInfo.ID);
	column.setCustomClass(colInfo.CLASS);
	column.setColumnDisplay(colInfo.DISPLAY);

	if (colInfo.SORTABLE) {
		column.setPrimarySortField(colInfo.PRIMARY_SORT_FIELD);
		column.setIsSortable(colInfo.SORTABLE);
		column.addSecondarySortField(colInfo.SEC_SORT_FIELD, TableColumn.SORT.ASCENDING);
	}

	column.setRenderTemplate('${ ' + colInfo.RENDER_TEMPLATE + '}');

	return column;

};

/*
 ** Create a quick group filter menu.
 * Filter Menu list
 1. Category
 2. Priority
 3. None
 */
RecommendationsO2Component.prototype.generateFilterHtml = function() {
	var userPrefs = this.getPreferencesObj();
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var recomi18n = i18n.discernabu.recommendations_o2;
	var groupFilterHtml = "";
	var filterName = "";
	var filter = "";
	
	if (userPrefs !== null && userPrefs.groupByPref !== 0) {
		this.m_recomPrefObj.groupByPref = userPrefs.groupByPref;
	}
	filter = this.m_recomPrefObj.groupByPref;
	// Set the last selected filter name.
	switch (filter) {
	case this.FILTERS.CATEGORY:
		filterName = recomi18n.CATEGORY;
		break;
	case this.FILTERS.PRIORITY:
		filterName = recomi18n.PRIORITY;
		break;
	case this.FILTERS.FAVORITES:
		filterName = recomi18n.FAVORITES;
		break;
	default:
		filterName = recomi18n.NONE;
		break;
	}

	// HTML for group by menu label,
	// filter name,
	// drop down arrow,
	// menu list
	// 1. Category filter
	// 2. Priority filter
	// 3. None filter

	groupFilterHtml = "<div class='" + compNS + "-controls' id='recomControls" + compID + "'><span class='" + compNS + "-groupby'>" + recomi18n.GROUP_BY + "</span><span id='" + compID + "qFilterSpan' class='" + compNS + "-filter'>" + filterName + "<span class='wrkflw-selectArrow'></span></span></div><div id='" + compID + "recomFilterMenu' class='" + compNS + "-filterdiv'><div id='recom-category-filter" + compID + "' class='" + compNS + "-allfilter'>" + recomi18n.CATEGORY + "</div><div id='recom-priority-filter" + compID + "' class='" + compNS + "-allfilter'>" + recomi18n.PRIORITY + "</div>";

	if (this.isFavoriteAvaliable()) {
		groupFilterHtml += "<div id='recom-favorites-filter" + compID + "' class='" + compNS + "-allfilter'>" + recomi18n.FAVORITES + "</div>";
	} else {
		groupFilterHtml += "<div id='recom-favorites-filter" + compID + "' class='" + compNS + "-allfilter-disabled'>" + recomi18n.FAVORITES + "</div>";
	}
	groupFilterHtml += "<div id='recom-none-filter" + compID + "' class='" + compNS + "-allfilter'>" + recomi18n.NONE + "</div></div>";
	return groupFilterHtml;
};

/**
 ** This will be called after group by option section change and column sort.
 *  Select the first row in the table as default and render preview pane with that row information.
 *  Reset back the scroll bar position to top if required.
 * @param {Boolean} scrollToTop - flag to decide whether the scroll bar position needs to be reset to top.
 */
RecommendationsO2Component.prototype.selectDefaultRow = function(scrollToTop) {

	if (this.m_$tableView && this.m_$tableView.length) {

		var tableRowArr = this.m_$tableView.find('.result-info');
		var firstRow = tableRowArr[0];
		var rowId = this.getRowId(firstRow);
		var scrollTop = 0;

		this.m_lastSelectedRow = "";

		// render preview pane with first row info.
		this.updateInfo(firstRow, this.m_recommendationsTable.getRowById(rowId).getResultData(), true, this.refTextResponse);

		// Since selecting the first row as default, reset back the scroll bar position of component body to top.
		if (scrollToTop) {
			$("#" + this.m_recommendationsTable.getNamespace() + "tableBody").scrollTop(scrollTop);
		}
	}
};

/*
 ** This will be called when select the quick filter.
 *  Apply the grouping based on the selected filter.
 *  Update  the filter name with Selected filter to show the current select filter.
 *  Re-register the row click event.
 *  Save the preference with selected filter.
 */
RecommendationsO2Component.prototype.groupByFilter = function (filter, recomResults) {

	var compID = this.getComponentId();
	var quickFilter = $('#' + compID + 'qFilterSpan');
	var filterText = "";

	var recomi18n = i18n.discernabu.recommendations_o2;

	if (this.m_lastSelFilter !== filter) {
		// Set the current filter
		this.m_lastSelFilter = filter;

		switch(filter) {
			case this.FILTERS.CATEGORY:
				filterText = recomi18n.CATEGORY;
				this.m_recommendationsTable.quickGroup("GROUP_NAME", '<span>${GROUP_NAME}</span>', false);
				// sort the group sequences by its alphabetical order.
				this.m_recommendationsTable.getGroupSequence().sort();
				break;

			case this.FILTERS.PRIORITY:
				filterText = recomi18n.PRIORITY;
				this.m_recommendationsTable.sortByColumnInDirection("PRIORITY", TableColumn.SORT.DESCENDING);
				this.m_recommendationsTable.quickGroup("PRIORITY_DISP", '<span>${PRIORITY_DISP}</span>', false);
				break;
			case this.FILTERS.FAVORITES: 
				this.m_recommendationsTable.clearGroups();
				filterText = recomi18n.FAVORITES;
				var fav = this.getFavorite(recomResults);
				var others = this.getOthers(recomResults);
				this.m_recommendationsTable.sortByColumnInDirection("FAVORITES", TableColumn.SORT.ASCENDING);
				if(fav.length){
					var favoritesGroup = new TableGroup();
					favoritesGroup.setGroupId(recomi18n.FAVORITES).setDisplay("").setHideHeader(true).setShowCount(false);
					favoritesGroup.bindData(fav);
					this.m_recommendationsTable.addGroup(favoritesGroup);
				
					if(others.length){
						var othersGroup = new TableGroup();
						othersGroup.setGroupId(recomi18n.OTHERS).setDisplay(this.m_i18nStrings.OTHERS).setShowCount(true).setIsExpanded(false);
						othersGroup.bindData(others);
						this.m_recommendationsTable.addGroup(othersGroup);
					}
				}
				break;
			case this.FILTERS.NONE:
				filterText = recomi18n.NONE;
				this.m_recommendationsTable.clearGroups();
				break;
			default:
				break;
		}

		this.m_recommendationsTable.sortByColumnInDirection("DUE", TableColumn.SORT.ASCENDING);

		
		switch (filter) {
		case this.FILTERS.CATEGORY:
			filterText = recomi18n.CATEGORY;
			break;
		case this.FILTERS.PRIORITY:
			filterText = recomi18n.PRIORITY;
			break;
		case this.FILTERS.FAVORITES:
			filterText = recomi18n.FAVORITES;
			break;
		case this.FILTERS.NONE:
			filterText = recomi18n.NONE;
			break;
		}
		if (quickFilter.length > 0) {
			// Update the filter name with current filter
			quickFilter[0].firstChild.nodeValue = filterText;
		}

		// Update component preference
		this.m_recomPrefObj.groupByPref = this.m_lastSelFilter;

		// Reset the height of side panel to component table height,
		//because component table height may change on rendering with different filter.
		this.resetSidePanelHeight();

		// Select the first row and render the respective details on the reading pane
		if(this.m_isSidePanelOpen) {
			this.selectDefaultRow(true);	
		}

		this.setPreferencesObj(this.m_recomPrefObj);
		this.savePreferences(true);
	}

	// Close the  menu list by triggering the click action
	quickFilter.click();
};

/**
 *  This will be called to add favorite records to favorites table group 
 * @param {object} recomResults : recommendation records
 * @return { object } fav : favorite object list
 */
RecommendationsO2Component.prototype.getFavorite = function (recomResults) {
	var fav = [];
	var favLen = recomResults.length;
	for(var i=0;i<favLen;i++){
		var curRec = recomResults[i];
		if (curRec.FAVORITES_DISP === this.m_i18nStrings.FAVORITES) {
			fav.push(curRec);
		}
	}
	return fav;
};
/**
 *  This will be called to add others records to favorites table group 
 * @param {object} recomResults : recommendation records
 * @return { object } others : others object list
 */
RecommendationsO2Component.prototype.getOthers = function (recomResults) {
	var others = [];
	var othersLen = recomResults.length;
	for(var i=0;i<othersLen;i++){
		var curRec = recomResults[i];
		if (curRec.FAVORITES_DISP === this.m_i18nStrings.OTHERS) {
			others.push(curRec);
		}
	}
	return others;
};
/*
 ** Register the events for
 * 1. Quick filter menu click
 * 2. Quick filter menu mouse enter
 * 3. Quick filter menu mouse leave
 * 4. Quick filter menu item click.
 * 5. Quick filter drop down menu mouse leave.
 */
RecommendationsO2Component.prototype.attachListeners = function (recomResults) {
	var compNS = this.getStyles().getNameSpace();
	var compID = this.getComponentId();
	var quickFilter = $('#' + compID + 'qFilterSpan');
	var filterMenu = $('#' + compID + 'recomFilterMenu');
	var classVisible = compNS + "-visible";
	var classHvrClick = compNS + "-qHvr-click";
	var classHvrUnClick = compNS + "-qHvr-unclick";
	var classFilterHover = compNS + "-filter-hover";

	/*
	 ** Close the menu item window and remove the css styles applied for the group by label.
	 */
	function closeGroupByMenuWindow() {
		// Hide the filter menu
		filterMenu.removeClass(classVisible);
		// Remove bg color
		quickFilter.removeClass(classHvrClick);
		// Remove border color
		quickFilter.addClass(classHvrUnClick);
	}


	quickFilter.click(function() {

		if (filterMenu.hasClass(classVisible)) {
			closeGroupByMenuWindow();
		}
		else {
			filterMenu.addClass(classVisible);
			// Display the filter menu
			$(this).removeClass(classHvrUnClick);
			// Add colored border
			$(this).removeClass(classFilterHover);
			// Remove the dashed outline
			$(this).addClass(classHvrClick);
			// Add  bg color.
		}
	});

	//Displays a border for the quick filters label.
	quickFilter.mouseenter(function() {
		if (!(filterMenu.hasClass(classVisible))) {
			$(this).removeClass(classHvrUnClick);
			$(this).addClass(classFilterHover);
		}
	});

	//Removes the border for the quick filters label
	quickFilter.mouseleave(function() {
		if (!(filterMenu.hasClass(classVisible))) {
			$(this).removeClass(classHvrUnClick);
			$(this).removeClass(classFilterHover);
		}
	});

	var quickFilterMenuArr = filterMenu.find("." + compNS + "-allfilter" + ",." + compNS + "-allfilter-disabled");
	var component = this;

	//Add click events to quick Filter Menu item click
	quickFilterMenuArr.each(function (index) {
		$(this).click(function () {
			component.groupByFilter(index + 1, recomResults);
		});
	});

	/*
	 ** Register the mouseleave event for group by menu window to close the window automatically.
	 */
	filterMenu.mouseleave(function() {
		if (filterMenu.hasClass(classVisible)) {
			closeGroupByMenuWindow();
		}
	});
};

/*
 ** This is to add cellClickExtension for the component table.
 */
RecommendationsO2Component.prototype.addCellClickExtension = function (recomRecords) {

	var component = this;

	var cellClickExtension = new TableCellClickCallbackExtension();

	cellClickExtension.setCellClickCallback(function (event, data) {
		//If favorites column clicked, call event handler for setting and unsetting favorites.
		if(data.COLUMN_ID === "FAVORITES"){
			component.onFavouriteClick(event, data, recomRecords);
		} else {
			component.onRowClick(event, data);
		}
	});

	this.m_recommendationsTable.addExtension(cellClickExtension);
};

/**
 * Function to search a recommendation result based on provided recommendation id
 * @param {number, object} paaing recommendation id and recommendation records
 * @return {object} selected recommendation result
 */
RecommendationsO2Component.prototype.findRecomResult = function (expectId, recomRecords) {
	var curResult = null;
	var recomResultLen = recomRecords.length;
	for (recomResultLen; recomResultLen--; ) {
		curResult = recomRecords[recomResultLen];
		if (curResult.EXPECT_ID === expectId) {
			return curResult;
		}
	}
};

/**
 * Function to handle events on favorite cell click
 * @param {object, object, object} event object, cell data, recommendation results
 * @return {null}
 */
RecommendationsO2Component.prototype.onFavouriteClick = function (event, data, recomRecords) {
	var self = this;
	var componentTable = this.getComponentTable();
	var currentElement = $(event.currentTarget.lastChild);
	var curElementRecomId = parseInt(currentElement.attr("expectId"), 10);
	var curRecom = null;

	if (currentElement.hasClass("recom-o2-fav-set")) {
		curRecom = self.findRecomResult(curElementRecomId, recomRecords);
		currentElement.removeClass("recom-o2-fav-set").addClass("recom-o2-fav-not-set");
		curRecom.FAVORITES = "<span expectId='" + curElementRecomId + "' class='recom-o2-fav-not-set'></span>";
		curRecom.FAVORITES_DISP = this.m_i18nStrings.OTHERS;
		if (!self.updateFavoriteObj(curElementRecomId, false)) {
			self.m_recomPrefObj.favoritesObject.push({
				"EXPECT_ID" : curElementRecomId,
				"FAVORITE" : false
			});
		}

	} else if (currentElement.hasClass("recom-o2-fav-not-set")) {
		currentElement.removeClass("recom-o2-fav-not-set").addClass("recom-o2-fav-set");
		curRecom = self.findRecomResult(curElementRecomId, recomRecords);
		curRecom.FAVORITES = "<span expectId='" + curElementRecomId + "' class='recom-o2-fav-set'></span>";
		curRecom.FAVORITES_DISP = this.m_i18nStrings.FAVORITES;

		if (!self.updateFavoriteObj(curElementRecomId, true)) {
			self.m_recomPrefObj.favoritesObject.push({
				"EXPECT_ID" : curElementRecomId,
				"FAVORITE" : true
			});
		}
	}
	if (self.m_recomPrefObj.groupByPref === self.FILTERS.FAVORITES) {
		self.updateGrouping(recomRecords);
	}
	self.updateFavoriteFilter(recomRecords);
	componentTable.refresh();
	//save favorites to backend
	self.setPreferencesObj(self.m_recomPrefObj);
	self.savePreferences(true);

};
/**
 * Function to update the favorite filter option in group by menu
 * @param {object} recommendation results
 * @return {null}
 */
RecommendationsO2Component.prototype.updateFavoriteFilter = function(recomRecords){
	var compID = this.getComponentId();
	
	var favoriteFilter = $("#recom-favorites-filter" + compID);
	var fav = this.getFavorite(recomRecords);
	if(fav.length){
		favoriteFilter.removeClass("recom-o2-allfilter-disabled").addClass("recom-o2-allfilter");
	}else{
		favoriteFilter.removeClass("recom-o2-allfilter").addClass("recom-o2-allfilter-disabled");
	}
};
/**
 * Function to update grouping if favorite group by preference is set
 * @param {object} recommendation results
 * @return {null}
 */
RecommendationsO2Component.prototype.updateGrouping = function(recomResults){
	
	this.m_recommendationsTable.clearGroups();
	var fav = this.getFavorite(recomResults);
	var others = this.getOthers(recomResults);
	this.m_recommendationsTable.sortByColumnInDirection("FAVORITES", TableColumn.SORT.ASCENDING);
	if (fav.length) {
		var favoritesGroup = new TableGroup();
		favoritesGroup.setGroupId("FAVORITES").setDisplay("").setShowCount(false).setHideHeader(true);
		favoritesGroup.bindData(fav);
		this.m_recommendationsTable.addGroup(favoritesGroup);

		if (others.length) {
			var othersGroup = new TableGroup();
			othersGroup.setGroupId("OTHERS").setDisplay(this.m_i18nStrings.OTHERS).setShowCount(true);
			othersGroup.bindData(others);
			this.m_recommendationsTable.addGroup(othersGroup);
		}
	}
};
/**
 * This function returns the reference text entity list for a specific recommendation.
 * @param{object} the recommendation object
 * @return {object} the enity list
*/
RecommendationsO2Component.prototype.getReferenceTextExistsData = function (recomResult) {
	var entityList = [];
	var satisfiers = recomResult.SATISFIERS;
	var satisfierLength = satisfiers.length;
	var currentSatisfier = null;
	if (recomResult.EXPECTATION_REF_TEXT_ENTITY) {
		entityList.push(recomResult.EXPECTATION_REF_TEXT_ENTITY);
	}
	if (recomResult.SCHEDULE_REF_TEXT_ENTITY) {
		entityList.push(recomResult.SCHEDULE_REF_TEXT_ENTITY);
	}
	for (var i = 0; i < satisfierLength; i++) {
		currentSatisfier = satisfiers[i];
		if (currentSatisfier.SATISFIER_REF_TEXT_ENTITY) {
			entityList.push(currentSatisfier.SATISFIER_REF_TEXT_ENTITY);
		}
	}
	return entityList;
};
/*
 ** This is a callback which will be called on cell click of the component table
 */
RecommendationsO2Component.prototype.onRowClick = function(event, data) {
	if(data.RESULT_DATA.GROUP_NAME !== "!FREETEXT!"){
		// Retrieve reference text data exists or not
		this.refTextResponse = this.getReferenceTextExistsData(data.RESULT_DATA);
	}
	// If side panel is already loading modify UI, don't do anything
	if(!this.m_isSidePanelLoading) {

		var selRow = $(event.target).parents("dl.result-info");
		if (!selRow.length || data.RESULT_DATA === null) {
			return;
		}
		this.updateInfo(selRow, data.RESULT_DATA, false, this.refTextResponse);		
	}
};

/*
 ** Based on the selected row, reading pane will be refresh with data and selected row will be updated as well.
 * If the user select the same row again, rendering  will be stopped.
 */
RecommendationsO2Component.prototype.updateInfo = function(selRow, data, isInitialLoad, refTextResponse) {

	var rowId = this.getRowId(selRow);

	// If it is the initial load, allow clicking on the initial row to update its background color, indicating to end user that click was successful
	if (this.m_lastSelectedRow === rowId && !$(selRow).hasClass(this.getStyles().getNameSpace() + "-row-selected-init")) {
		
		//If Side panel is closed, resize the component table and show side panel
		if(!this.m_isSidePanelOpen) {
			this.m_sidePanel.showPanel();
			this.m_isSidePanelOpen = true;
			this.m_$tableView.removeClass("recom-o2-table").addClass("recom-o2-table-with-side-panel");
			this.updateSelRowBgColor(selRow, false);
		}
		return;
	}

	this.updateSelRowBgColor(selRow, isInitialLoad);
	
	// Turn off the side panel event handlers, which will clear any old handlers
	this.m_$sidePanelContainer.off();

	this.renderReadingPane(data, refTextResponse);

	// Update the m_lastSelectedRow value with index.
	this.m_lastSelectedRow = rowId;

};

/*
 ** This function will return the row id from the id of DOM element based on the grouping applied on the table.
 */
RecommendationsO2Component.prototype.getRowId = function(rowObj) {

	var rowId = "";

	var identifiers = $(rowObj).attr("id").split(":");

	//If grouping is applied, we go through the group to find the row id
	if (this.m_recommendationsTable.isGroupingApplied()) {
		rowId = identifiers[2];
	}
	else {
		rowId = identifiers[1];
	}

	return rowId;
};
/*
 ** This method will be called on each row selection to update the background color of selected row and font color
 ** to indicate that this is the currently selected row.isInitialLoad flag is using to differentiate whether its is initial load or user selection.
 */
RecommendationsO2Component.prototype.updateSelRowBgColor = function(selRowObj, isInitialLoad) {

	var compNS = this.getStyles().getNameSpace();
	var prevRow = this.m_$tableView.find(".selected");

	// Remove the background color of previous selected row.
	if (prevRow.length > 0 && this.m_lastSelectedRow === this.getRowId(prevRow)) {
		prevRow.removeClass(compNS + "-row-selected");
		prevRow.removeClass(compNS + "-row-selected-init");
		prevRow.removeClass("selected");
		prevRow.children("*").children("*").css("color", "");
	}

	// Change the background color to indicate that its selected.

	if (isInitialLoad) {
		$(selRowObj).addClass(compNS + "-row-selected-init selected");
	}
	else {
		$(selRowObj).addClass(compNS + "-row-selected selected");
	}

};
/**
 * This function creates the error banner to be shown when the service fails
*/
RecommendationsO2Component.prototype.createReferenceTextAlert = function (component) {
	var compID = component.getComponentId();
	var primaryText = component.m_i18nStrings.REFERENCE_TEXT_FAILURE;
	var secondaryText = component.m_i18nStrings.INLINE_ERROR_MESSAGE;
	var type = component.m_alertType.ERROR;
	var referenceError = $("#" + compID + "referenceError");
	if (component.m_isSidePanelOpen) {
		referenceError.empty().append(component.getErrorAlert(type, primaryText, secondaryText));
	}
};
/*
 ** This method will be called on each row click.
 ** Due informations like status, due date, elapsed time,details of all the updates with expectation and
 ** timeline graph to indicate the due status will be rendered.
 */
RecommendationsO2Component.prototype.renderReadingPane = function(data, refTextResponse) {

	var recomi18n = i18n.discernabu.recommendations_o2;
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var recommendationId = data.RECOMMENDATION_ID;
	var sidePanelHtml = "";
	var lastSatisfiedDate = new Date();
	var lastSatisfiedDateString = "--";
	var self = this;
	var hoverDetails = "";
	var popupHtml = "";
	var sidePanelActionsHtml = "";
	var referenceHTML = "";
	var referenceMenu = MP_MenuManager.getMenuObject("referenceMenu" + compID + recommendationId);
	var referenceTextArray = null;
	var referenceTextArrayLength = 0;
	var satisfierLength = 0;
	var satisfiers = null;
	var satisfierReferenceMenuItem = MP_MenuManager.getMenuObject("satisfierReferenceMenuItem" + compID + recommendationId);
	var scheduleReferenceMenuItem = null;
	var expectationReferenceMenuItem = null;
	var referenceTextButton = null;
	var refTextLabelButton = null;
	var dropDownButton = null;
	var referenceTextSuccess = true;
	var currentEntity = null;
	var referenceError = $("#" + compID + "referenceError");
	if (referenceError.length === 0) {
		$("#" + "sidePanelHeader" + compID).append("<div id='" + compID + "referenceError'></div>");
	} else {
		referenceError.empty();
	}
	if (refTextResponse) {
		referenceTextArray = refTextResponse;
		referenceTextArrayLength = referenceTextArray.length;
		satisfierLength = data.SATISFIERS.length;
		satisfiers = data.SATISFIERS;
		if (!this.m_viewReferenceTextObj) {
			this.m_viewReferenceTextObj = new ReferenceTextViewer(compNS + compID + "referenceText", this);
		}
	}
	// Get the hover details for freetext expectation, Frequency change and Due date change if the view is in Touch mode.
	if (CERN_Platform.isTouchModeEnabled()) {
		var expectationHoverDetails = this.getHoverDeatilsHtmlForSidePanel(this.HOVER_SECTION.EXPECTATION, data);
		var frequencyHoverDetails = this.getHoverDeatilsHtmlForSidePanel(this.HOVER_SECTION.FREQUENCY, data);
		var dueDateHoverDetails = this.getHoverDeatilsHtmlForSidePanel(this.HOVER_SECTION.DUE_DATE, data);
		
		hoverDetails = expectationHoverDetails + frequencyHoverDetails + dueDateHoverDetails;
	}

	if (data.LAST_SAT_DATE !== "") {
		lastSatisfiedDate.setISO8601(data.LAST_SAT_DATE);
		lastSatisfiedDateString = lastSatisfiedDate.format(dateFormat.masks.shortDate2);
	}

	// Html for due informations like due type,elapsed time and due date,
	// name of expectation,
	// last satisfied date,
	// frequency of expectation,
	// Last satisfied title,
	// Last satisfied date,
	// Frequency,
	// time line graph and
	// hover details of the view in Touch mode
	// history of all the changes on expectation
	// reference text 
	var clickFunctionForReferenceText = function (menuItem, windowHeader, entityName) {
		var menuId = menuItem.getId();
		var entityId = menuId.match(/\d/g);
		entityId = entityId.join("");
		self.m_viewReferenceTextObj.setWindowHeader(windowHeader);
		self.m_viewReferenceTextObj.setEntityName(entityName);
		self.m_viewReferenceTextObj.setEntityId(parseInt(entityId));
		self.m_viewReferenceTextObj.setErrorMethod(self.createReferenceTextAlert);
		self.m_viewReferenceTextObj.viewReferenceText();
		self.referenceTextCapTimer.capture();
	};
	if (referenceTextArrayLength > 1) {
		referenceTextButton = new MPageUI.Button();
		referenceTextButton.setLabel(recomi18n.VIEW_REFERENCE_TEXT);
		referenceTextButton.setStyle(MPageUI.BUTTON_OPTIONS.STYLE.LINK);
		referenceTextButton.setIcon("recom-o2-reference-button-icon");
		referenceTextButton.setIconPosition(MPageUI.BUTTON_OPTIONS.ICON_POSITION.RIGHT);
		referenceTextButton.setOnClickCallback(function () {
			MP_MenuManager.showMenu("referenceMenu" + compID + recommendationId);
		});
		referenceHTML = "<span class = 'recom-o2-view-ref-text' id ='" + compID + "referenceTextButton' >" + referenceTextButton.render() + "</span>";
		if (!referenceMenu) {
			referenceMenu = new Menu("referenceMenu" + compID + recommendationId);
			referenceMenu.setAnchorConnectionCorner(["bottom", "right"]);
			referenceMenu.setContentConnectionCorner(["top", "right"]);
			referenceMenu.setIsDisabled(false);
			for (var i = 0; i < referenceTextArrayLength; i++) {
				currentEntity = referenceTextArray[i];
				if (currentEntity.PARENT_ENTITY_NAME === "HEALTH_MAINT_SCHED") {
					scheduleReferenceMenuItem = new MenuSelection("scheduleReferenceMenuItem" + currentEntity.PARENT_ENTITY_ID);
					scheduleReferenceMenuItem.setLabel(recomi18n.SCHEDULE_REF_TEXT);
					scheduleReferenceMenuItem.setClickFunction(function () {
						clickFunctionForReferenceText(this, data.GROUP_NAME, "HEALTH_MAINT_SCHED");
					});
				}
				if (currentEntity.PARENT_ENTITY_NAME === "HEALTH_MAINT_EXPECT") {
					expectationReferenceMenuItem = new MenuSelection("expectationReferenceMenuItem" + currentEntity.PARENT_ENTITY_ID);
					expectationReferenceMenuItem.setLabel(recomi18n.EXPECTATION_REF_TEXT);
					expectationReferenceMenuItem.setClickFunction(function () {
						clickFunctionForReferenceText(this, data.EXPECT_STEP, "HEALTH_MAINT_EXPECT");
					});
				}
				if (currentEntity.PARENT_ENTITY_NAME === "HEALTH_MAINT_SAT") {
					var currentSatisfier = null;
					if (!satisfierReferenceMenuItem) {
						satisfierReferenceMenuItem = new Menu("satisfierReferenceMenuItem" + compID + recommendationId);
						satisfierReferenceMenuItem.setLabel(recomi18n.SATISFIER_REF_TEXT);
						satisfierReferenceMenuItem.setAnchorConnectionCorner(["top", "left"]);
						satisfierReferenceMenuItem.setContentConnectionCorner(["top", "right"]);
					}
					for (var satisfierCount = 0; satisfierCount < satisfierLength; satisfierCount++) {
						var currentSatisfier = satisfiers[satisfierCount];
						if (currentEntity.PARENT_ENTITY_ID === currentSatisfier.EXPECT_SAT_ID) {
							var satisfierMenuItem = new MenuSelection("satisfierMenuItem" + currentEntity.PARENT_ENTITY_ID);
							satisfierMenuItem.setLabel(currentSatisfier.EXPECT_SAT_NAME);
							satisfierMenuItem.setClickFunction(function () {
								clickFunctionForReferenceText(this, this.getLabel(), "HEALTH_MAINT_SAT");
							});
							satisfierReferenceMenuItem.addMenuItem(satisfierMenuItem);
							break;
						}
					}
				}
			}
			if (scheduleReferenceMenuItem) {
				referenceMenu.addMenuItem(scheduleReferenceMenuItem);
			}
			if (expectationReferenceMenuItem) {
				referenceMenu.addMenuItem(expectationReferenceMenuItem);
			}
			if (satisfierReferenceMenuItem) {
				referenceMenu.addMenuItem(satisfierReferenceMenuItem);
			}
			referenceMenu.setAnchorElementId(compID + "referenceTextButton");
			MP_MenuManager.addMenuObject(referenceMenu);
		}
		}
		else if (referenceTextArrayLength === 1) {
			var currentEntity = referenceTextArray[0];
			var headerTitle = "";
			if (currentEntity.PARENT_ENTITY_NAME === "HEALTH_MAINT_SCHED") {
				headerTitle = data.GROUP_NAME;
			} else if (currentEntity.PARENT_ENTITY_NAME === "HEAlTH_MAINT_EXPECT") {
				headerTitle = data.EXPECT_STEP;
			} else {
				for (var j = 0; j < satisfierLength; j++) {
					var currentSatisfier = satisfiers[j];
					if (currentEntity.PARENT_ENTITY_ID === currentSatisfier.EXPECT_SAT_ID) {
						headerTitle = currentSatisfier.EXPECT_SAT_NAME;
						break;
					}
				}
			}
			referenceHTML = "<span id='" + compID + "referenceText' parent_entity_name='" + currentEntity.PARENT_ENTITY_NAME + "' parent_entity_id='" + currentEntity.PARENT_ENTITY_ID + "' header_title='" + headerTitle + "'><a class='recom-o2-view-ref-text'>" + recomi18n.VIEW_REFERENCE_TEXT + "</a></span>";
		}
	this.m_sidePanel.setTitleText(data.EXPECT_STEP);
	this.m_sidePanel.setSubtitleAsHTML(this.getDueInfoHtml(data));
		var sidePanelSubtitle = $("#" + compID + "rp-dueInfo");
		sidePanelSubtitle.append(referenceHTML);
		if (referenceTextButton) {
			referenceTextButton.attachEvents();
			$('#' + referenceTextButton.getId()).focusout(function () {
				if (referenceMenu && !referenceMenu.isMouseOverMenu() && satisfierReferenceMenuItem && !satisfierReferenceMenuItem.isMouseOverMenu()) {
					MP_MenuManager.closeMenuStack(true);
				}
			});
		}

	sidePanelHtml = "<div id=" + compID + "rp-last-satisfied class='" + compNS + "-rp-last-satisfied'>" +
		"<span class='" + compNS + "-rp-title-text'>" + recomi18n.LAST_SATISFIED + "</span></br>" +
		"<span class='" + compNS + "-rp-content-data'>" + lastSatisfiedDateString + "</span>" +
		"<span class='" + compNS + "-rp-freq'>" + data.FREQUENCY_TEXT + "</span>" + "</div>" +
		this.getTimeLineGraphHtml(data) + "<div id=sidePanelScrollContainer" + compID + ">" +
		hoverDetails + this.getHistoryInfoHtml(data, lastSatisfiedDateString) + "<br/><br/></div>";

	// Render side panel with html of selected row details.
	this.m_sidePanel.setContents(sidePanelHtml, "recom-o2" + this.getComponentId());
	this.m_sidePanel.showCornerCloseButton();
	
	this.m_sidePanel.setCornerCloseFunction(function() {
		var referenceTextError = $("#" + compID + "referenceError");
		if (referenceTextError.length) {
			referenceTextError.empty();
		}
		var prevRow = self.m_$tableView.find(".selected");
		// Remove the background color of previous selected row.
		prevRow.removeClass("recom-o2-row-selected").removeClass("recom-o2-row-selected-init").removeClass("selected");
		
		// Resize the component table
		self.m_$tableView.removeClass("recom-o2-table-with-side-panel").addClass("recom-o2-table");

		self.m_isSidePanelOpen = false;
		self.m_clickedRow = null;
	});

	// Reset the due date & frequency change indicators
	this.setDueDateChangeIndicator(false);
	this.setFrequencyChangeIndicator(false);

	sidePanelActionsHtml = "<div id='recommendationsSPAction" + compID + "' class='recom-o2-sp-actions'>";

	// Add Actions button to side panel only if Show_Satisfy preference is set in CernerPracticeWizard
	if (this.getShowSatisfiersPreference()) {
		popupHtml = this.createPopupHtml(data);
		if (popupHtml !== "") {
			sidePanelActionsHtml += "<div class='sp-button2 recom-o2-actions-button' id='actionsRecomButton" + compID + "'>" + this.m_i18nStrings.ACTIONS + "..." + "</div>";
		}
	}

	// Add Modify button to side panel only if the modify preference is set in CernerPracticeWizard
	if (this.getAllowModificationIndicator()) {
		sidePanelActionsHtml += "<div class='sp-button2 recom-o2-modify-button' id='modifyRecomButton" + compID + "'>" + this.m_i18nStrings.MODIFY + "</div>";
	}

	sidePanelActionsHtml += "</div>";
	
	this.m_sidePanel.setActionsAsHTML(sidePanelActionsHtml);

	// Create and attach pop up only if we have satisfiers to be displayed in the popup
	if(popupHtml !== "") {
		this.attachPopupToActionsButton(popupHtml);
	}

	this.addEventHandlersForSidePanelActions(sidePanelHtml, sidePanelActionsHtml, data, popupHtml);
	this.addEventHandlersForUndoActionInSidePanel(data);
	this.addEventHandlersForClinicalNoteLinkInSidePanel();
	
	// Resize the component table and side panel
	this.m_$tableView.removeClass("recom-o2-table").addClass("recom-o2-table-with-side-panel");
	
	// Show the side panel and set the side panel open flag to true
	this.m_sidePanel.showPanel();
	this.m_sidePanel.showHideExpandBar();
	this.m_isSidePanelOpen = true;

	// Call adjustScrollBarPosition with true so that scroll bar height gets calculated correctly
	this.adjustScrollBarPosition(true);

	if (CERN_Platform.isTouchModeEnabled()) {
		// Register the click event for Show more/Show less link of frequency details section.
		$("#" + compID + "show-more-frequency").click(function() {
			self.showMoreOrLessContents(self.HOVER_SECTION.FREQUENCY);
		});

		// Register the click event for Show more/Show less link of frequency details section.
		$("#" + compID + "show-more-due-date").click(function() {
			self.showMoreOrLessContents(self.HOVER_SECTION.DUE_DATE);
		});
	}

	// Adjust the position of status bubble.
	this.styleTimelineGraph();
};

/**
 ** Return the html of all the changes made on the respective expectation, separated by a line space.
 * @param {Number} Enum value for the hover section.
 * @param {Object} data Information of select row.
 * @return {null}
 */
RecommendationsO2Component.prototype.getHoverDeatilsHtmlForSidePanel = function(sectionId, data) {
	var recomi18n = i18n.discernabu.recommendations_o2;
	var compNS = this.getStyles().getNameSpace();
	var compID = this.getComponentId();
	var needShowMore = true;
	var hideClassName = "";
	var containerId = "";
	var ellipseId = "";
	var showMoreId = "";
	var hoverDetails = "";
	var modifyIndicator = false;
	var hoverDetailsHtml = "--";
	var showMoreContainerHtml = "";
	var sectionName = "";
	var sectionSeparatorHtml = "";
	var CHARACTER_LIMIT = 350;

	// Based on sectionId, get the respective class names, id, display text for
	// freetext details section, frequency section and due date section.
	switch(sectionId) {
		case this.HOVER_SECTION.EXPECTATION:
			// Since there will only ever be at most one item in this assigned_info list,
			// no need to add the Show More link for this section.
			needShowMore = false;
			hoverDetails = data.EXP_HOVER;
			modifyIndicator = data.HAS_EXP_MODIFY_IND;
			sectionName = recomi18n.FREETEXT_EXPECTATION;
			break;
		case this.HOVER_SECTION.FREQUENCY:
			containerId = compID + "freq-details";
			ellipseId = compID + "more-eclipse-frequency";
			showMoreId = compID + "show-more-frequency";
			hoverDetails = data.FREQ_HOVER;
			modifyIndicator = data.HAS_FREQ_MODIFY_IND;
			sectionName = recomi18n.FREQUENCY_DETAILS;
			break;
		case this.HOVER_SECTION.DUE_DATE:
			containerId = compID + "due-date-details";
			ellipseId = compID + "more-eclipse-due-date";
			showMoreId = compID + "show-more-due-date";
			hoverDetails = data.DUE_DATE_HOVER;
			modifyIndicator = data.HAS_DUE_DATE_MODIFY_IND;
			sectionName = recomi18n.DUE_DATE_DETAILS;
			break;
	}

	// Add the class to reduce the height of section and Show More link if hover details are more than 350 charters.
	if (needShowMore && hoverDetails.length > CHARACTER_LIMIT) {
		hideClassName = compNS + "-rp-hide-section";

		var elipseHtml = "<span id='" + ellipseId + "'>[...]</span>";
		var showMoreHtml = "<a id='" + showMoreId + "' class='" + compNS + "-rp-align-right showmore'>" + recomi18n.SHOW_MORE + "</a>";
		showMoreContainerHtml = "<div class='" + compNS + "-show-more-container'>" + elipseHtml + showMoreHtml + "</div>";
	}

	// If the modify data is available and its not empty , add it to the section container.
	// Else the default text of hoverDetailsHtml ("--") will be displayed.
	if (modifyIndicator && hoverDetails !== "") {
		hoverDetailsHtml = "<div id='" + containerId + "' class='" + compNS + "-rp-hover-details-section " + hideClassName + "'>" + hoverDetails + "</div>" + showMoreContainerHtml;
	}

	// Since we are displaying the default text, add the section separator all the time.
	sectionSeparatorHtml = "<p class='" + compNS + "-rp-history-hd'><span class='" + compNS + "-rp-title-text'>" + sectionName + "</span></p>";

	// return an html of section separator and hover details container with hover information or default text.
	return (sectionSeparatorHtml + hoverDetailsHtml);
};
/**
 ** Return the html of all the changes made on the respective expectation, separated by a line space.
 * @param {Number} Enum value for the hover section.
 * @return {null}
 */
RecommendationsO2Component.prototype.showMoreOrLessContents = function(sectionId) {
	var recomi18n = i18n.discernabu.recommendations_o2;
	var compNS = this.getStyles().getNameSpace();
	var compID = this.getComponentId();
	var $showMore = null;
	var $detailsContainer = null;
	var containerClassName = compNS + "-rp-hide-section";
	var showMoreClassName = "showmore";
	var showLessClassName = "showless";
	var $elipse = null;

	//If user clicks on Frequency Details section's Show More or Show Less link,
	//get the objects retarded to frequency section.
	if (sectionId === this.HOVER_SECTION.FREQUENCY) {
		$showMore = $("#" + compID + "show-more-frequency");
		$detailsContainer = $("#" + compID + "freq-details");
		$elipse = $("#" + compID + "more-eclipse-frequency");
	}
	//IF user clicks on Due date details section's Show More or Show Less link,
	//get the objects retarded to due date section.
	else if (sectionId === this.HOVER_SECTION.DUE_DATE) {
		$showMore = $("#" + compID + "show-more-due-date");
		$detailsContainer = $("#" + compID + "due-date-details");
		$elipse = $("#" + compID + "more-eclipse-due-date");
	}

	// If the user clicks on Show More link,
	// remove the "showmore" class and add "showless" class for the next Show Less click.
	// Change the link text to Show Less.
	// Expand the hover details section.
	// Hide the more button([...])
	if ($showMore.hasClass(showMoreClassName)) {
		$showMore.removeClass(showMoreClassName);
		$showMore.addClass(showLessClassName);
		$showMore.html(recomi18n.SHOW_LESS);
		$detailsContainer.removeClass(containerClassName);
		$elipse.addClass("hide");
	}
	// If the user clicks on Show Less link,
	// remove the "showless" class and add "showmore" class for the next Show More click.
	// Change the link text to Show More.
	// Collapse the hover details section.
	// Display the more button([...])
	else//if($showMore.hasClass(showLessClassName))
	{
		$showMore.removeClass(showLessClassName);
		$showMore.addClass(showMoreClassName);
		$showMore.html(recomi18n.SHOW_MORE);
		$detailsContainer.addClass(containerClassName);
		$elipse.removeClass("hide");
	}

	//If the side panel is already expanded, call expandSidePanel to get a scroll bar if needed
	var $expCollapseIconObj = $("#sidePanelExpandCollapseIcon" + compID);
	if ($expCollapseIconObj.hasClass("sp-collapse")) {
		this.m_sidePanel.expandSidePanel();
	}
};

/**
 ** Return the html of all the changes made on the respective expectation, separated by a line space.
 * @param {Object} data Information of select row.
 * @param {String} lastSatisfiedDateString - the last satisfied date string for the expectation.
 * @return {string}   historyHtml : Html string of information about the display of History section.
 */
RecommendationsO2Component.prototype.getHistoryInfoHtml = function(data, lastSatisfiedDateString) {
	var recomi18n = i18n.discernabu.recommendations_o2;
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var listLength = data.HISTORY.length;
	var historyHtml = "";
	var historyInfoHtml = "";
	var clinicalNoteDisplay = "";

	// If no history is associated to this expectation, no need to proceed.
	if (!listLength) {
		return ("");
	}

	// Loop through each history item and diaply in the history section in the form of
	// <Action performed> <Undo Option(if applicable)>
	// <Until - next due date><Reason if available>
	// <Comment text>
	// <Provider Name and the action performed date>
	for (var index = 0; index < listLength; index++) {
		var histObj = data.HISTORY[index];
		var provider = MP_Util.GetValueFromArray(histObj.PRSNL_ID, this.m_personnelArray);
		var providerName = (provider === null) ? "--" : provider.fullName;
		var date = new Date();
		var actionDate = "--";
		var modifierId = histObj.MODIFIER_ID;
		var nextDueDate = "--";
		var recomActionId = histObj.RECOMMENDATION_ACTION_ID;
		var modifierTypeCd = histObj.MODIFIER_TYPE_CD;
		var organizationId = histObj.ORGANIZATION_ID;
		var nextDueAndReasonHtml = "";
		var clinicalEventId = histObj.CLINICAL_EVENT_ID;	
		var noteTypeDisplay = histObj.NOTE_TYPE_DISPLAY;	
		var clinicalNoteInd = (histObj.CLINICAL_NOTE_IND === 1) ? true : false;
		
		if (histObj.RECORDED_DATE !== "") {
			date.setISO8601(histObj.RECORDED_DATE);
			actionDate = date.format(dateFormat.masks.mediumDate);
		}
		
		//Check if the next due date is available.
		//Next due date will be available for postpone and satisfy actions ideally.
		//If not available, -- will be displayed.
		if (histObj.NEXT_DUE_DATE !== "") {
			date.setISO8601(histObj.NEXT_DUE_DATE);
			nextDueDate = date.format(dateFormat.masks.shortDate2);
		}
		
		var commentText = histObj.COMMENT ? histObj.COMMENT : "--";
		var reasonText = histObj.REASON_DISP ? histObj.REASON_DISP  : "";

		
		//Add link for undo option if the UNDO_DEFINED is set. This means the action can be undone.
		var undoLinkHtml = histObj.UNDO_ENABLED ? "<a class='recom-o2-history-item-undo-option' data-comment-text= '" + commentText + "' data-reason-text= '" + reasonText + "' data-providername-text= '" + providerName + "'  data-modifier-id='" + modifierId + "' data-action-id='" + recomActionId + "' data-modifier-type-cd='" + modifierTypeCd + "' data-org-id='" + organizationId + "' data-status-flag='" + histObj.STATUS_FLAG + "' data-next-due-date='" + nextDueDate + "'>" + recomi18n.UNDO + "</a>" : "";

		var actionInfoHtml = "<div class='recom-o2-history-item-action-info'><span class='recom-o2-action-type-display'>"
			 + this.getActionDescription(histObj.STATUS_FLAG, false) + "</span>" + undoLinkHtml;
			
		if (clinicalNoteInd) {
			clinicalNoteDisplay = (CERN_Platform.inMillenniumContext()) ? "<a class = 'recom-o2-clinical-link' data-clinical-event-id='" +
				clinicalEventId + "'>" + " (" + noteTypeDisplay + ")" +"</a>" : "<span class = 'recom-o2-clinical-note-display secondary-text'>" + " (" + noteTypeDisplay + ")" +"</span>";
		}
		
		 if(reasonText !== "" ){
			nextDueAndReasonHtml += "<div class='recom-o2-history-item-due-info secondary-text'>" + recomi18n.UNTIL + "&nbsp; " + nextDueDate 
			 + "</div><div class='recom-o2-reason-text secondary-text'>" + "(" + reasonText + ")" + "</div>";
		 }
	 	 else{
			nextDueAndReasonHtml += "<div class='recom-o2-history-item-due-info secondary-text'>" + recomi18n.UNTIL + "&nbsp; " + nextDueDate 
			 + "</div><div class='recom-o2-reason-text secondary-text'>" + reasonText +  "</div>";
	       	}

		var commentHtml = "<div class='recom-o2-history-item-comment-info'>"  + "<span class ='secondary-text'>" +  recomi18n.COMMENT +  ":" + "&nbsp;" +  "</span>"  + commentText + "</div>";

		var providerInfoHtml = "<div class='recom-o2-history-item-provider-info'>" + "<span class ='secondary-text'>" +  recomi18n.RECORDED_FOR + ":" + "&nbsp;" + "</span>" +   providerName +  "</div>";
		//Construct each history items html.
	if (histObj.STATUS_FLAG === 6.0) {
			for (var undoneIndex = 0; undoneIndex < listLength; undoneIndex++) {
				var undoneHistObj = data.HISTORY[undoneIndex];
				var undoneProvider = MP_Util.GetValueFromArray(undoneHistObj.PRSNL_ID, this.m_personnelArray);
				var undoneProviderName = (undoneProvider === null) ? "--" : undoneProvider.fullName;
				var undoneNextDueDate = "--";
				var undoneNextDueAndReasonHtml = "";
				var undoneActionDate = "--";
				if (index !== undoneIndex) {
					if (histObj.MODIFIER_ID === undoneHistObj.MODIFIER_ID) {
						if (histObj.RECORDED_DATE !== "") {
							date.setISO8601(histObj.RECORDED_DATE);
							undoneActionDate = date.format(dateFormat.masks.mediumDate);
						}
			 			if (undoneHistObj.NEXT_DUE_DATE !== "") {
							date.setISO8601(undoneHistObj.NEXT_DUE_DATE);
							undoneNextDueDate = date.format(dateFormat.masks.shortDate2);
						}

						var undoneOnInfoHtml = "<div class='recom-o2-history-item-action-info '><span class='recom-o2-action-type-display'>"
			 			+ this.getActionDescription(histObj.STATUS_FLAG, false) + "</span>" + "<span class='secondary-text'>" + "&nbsp;" + recomi18n.ON + "&nbsp;"  + undoneActionDate + "</span>" + "</div>";
						 
						var undoneActionInfoHtml = "<div class='recom-o2-history-item-action-info'><span class='recom-o2-action-type-display'>"
			 			+ this.getActionDescription(undoneHistObj.STATUS_FLAG, false) + "</span>" + "</div>";
					
						var undoneReasonText = undoneHistObj.REASON_DISP ? undoneHistObj.REASON_DISP : "";

						var undoneReason = "<div class='recom-o2-undo-reason-text'>" + "<span class ='secondary-text'>" + recomi18n.REASON + "&nbsp;"  + "</span>"  + reasonText  + "</div>";
						if(undoneReasonText !== "" ){
			 				undoneNextDueAndReasonHtml += "<div class='recom-o2-history-item-due-info secondary-text'>" + recomi18n.UNTIL + "&nbsp; " + undoneNextDueDate 
			 				+ "</div>&nbsp;" + "<span class='recom-o2-reason-text secondary-text'>" + "(" + undoneReasonText + ")" + "</span>";
						}
						else{
							undoneNextDueAndReasonHtml += "<div class='recom-o2-history-item-due-info secondary-text'>" + recomi18n.UNTIL + "&nbsp; " + undoneNextDueDate 
			 				+ "</div>&nbsp;" + "<span class='recom-o2-reason-text secondary-text'>"  + undoneReasonText +  "</span>";
						}
			 			var undoneCommentText = undoneHistObj.COMMENT ? undoneHistObj.COMMENT : "--";	

						var undoneCommentHtml = "<div class='recom-o2-history-item-comment-info'>" + "<span class ='secondary-text'>" + recomi18n.COMMENT + ":" + "&nbsp;" + "</span>" + undoneCommentText  + "</div>";

						var undoneProviderInfoHtml = "<div class='recom-o2-history-item-provider-info'>" + "<span class ='secondary-text'>" + recomi18n.RECORDED_FOR + ":" + "&nbsp;"  +  "</span>" + undoneProviderName +  "</div>";

						historyInfoHtml += "<div class='recom-o2-history-item' id='historyItem" + undoneHistObj.MODIFIER_ID + undoneHistObj.RECOMMENDATION_ACTION_ID + "'>" 
						+ undoneOnInfoHtml
						+ "<div class ='recom-o2-satisfier-action-info'>"
						+ undoneActionInfoHtml
						+ undoneNextDueAndReasonHtml
						+ undoneCommentHtml
						+ undoneProviderInfoHtml
						+ "</div>"
						+ undoneReason
						+ commentHtml
						+ providerInfoHtml
						+ "</div>";
					}
				}
			}
		}
		else {
			if (histObj.UNDO_ENABLED === 1 || histObj.IS_UNDO_DONE === 0) {
				historyInfoHtml += "<div class='recom-o2-history-item' id='historyItem" + modifierId + recomActionId + "'>" 
				+ actionInfoHtml
				+ clinicalNoteDisplay
				+ "</div>"
				+ nextDueAndReasonHtml
				+ commentHtml
				+ providerInfoHtml
				+ "</div>";
			}
		}
	}

	// Html for History header having title and lookback,
	// container to display all the history information
	historyHtml = "<p id='" + compID + "-rp-history-hd' class='" + compNS + "-rp-history-hd'><span class='" + compNS + "-rp-title-text'>" + recomi18n.HISTORY + "</span><span class='" + compNS + "-rp-align-right'>" + this.m_historyLookback + " - " + recomi18n.PRESENT + "</span></p><div id=" + compID + "rp-history class='" + compNS + "-rp-history' data-last-satisfied-date='" + lastSatisfiedDateString + "'>" + historyInfoHtml + "</div>";

	return historyHtml;
};

/**
 ** Return the html of due informations like due image, elapsed time and due date.
 * @param {Object} data Information of select row.
 * @return {string} dueInfoHtml : Html string of information about the display of History section.
 */
RecommendationsO2Component.prototype.getDueInfoHtml = function(data) {
	var compID = this.getComponentId();
	var dueDate = "--";
	var dueDateTime = new Date();
	var compNS = this.getStyles().getNameSpace();
	var imgClass = compNS + "-rp-img ";
	var dueInfoHtml = "";
	var elapsedTime = "";

	if (data.DUE_DATE_UTC !== "") {
		dueDateTime.setISO8601(data.DUE_DATE_UTC);
	}

	// Build the date string that is displayed in side panel.
	dueDate = dueDateTime.format(dateFormat.masks.shortDate2);

	/* If the expectation is overdue or due, then the elapsed time displaying in the side panel will be the difference between current date and overdue date.
	 ** else it will be the difference between current date and due date.
	 */
	if (data.OVER_DUE_DATE !== "" && data.DUE_STATUS_FLAG === this.DUE_TYPE.OVERDUE) {
		dueDateTime.setISO8601(data.OVER_DUE_DATE);
	}

	// Use existing helper functions to calculate time difference in standard manner
	elapsedTime = (this.m_anchorDate > dueDateTime) ? this.GetDateDiffString(dueDateTime, this.m_anchorDate, "") : this.GetDateDiffString(this.m_anchorDate, dueDateTime, "");
	elapsedTime = (data.DUE_STATUS_FLAG === this.DUE_TYPE.OVERDUE) ? i18n.discernabu.recommendations_o2.AGO.replace("{0}", elapsedTime) : elapsedTime;
	elapsedTime = (data.DUE_STATUS_FLAG === this.DUE_TYPE.DUE) ? i18n.discernabu.recommendations_o2.TODAY : elapsedTime;

	/*
	 * Select the due image class based on due type.
	 */
	switch(data.DUE_STATUS_FLAG) {
		case this.DUE_TYPE.OVERDUE:
			imgClass += compNS + "-overdue-img";
			break;

		case this.DUE_TYPE.DUE:
			imgClass += compNS + "-due-img";
			break;

		case this.DUE_TYPE.NEARDUE:
			imgClass += compNS + "-neardue-img";
			break;
		default:
			break;

	}

	// Since there is no image for satisfied type, no need to add div for status image.
	var statusImageHtml = (data.DUE_STATUS_FLAG !== this.DUE_TYPE.SATISFIED) ? ("<div class='" + imgClass + "'>&nbsp;</div>") : "";

	//  Html for the status image followed by the elapsed time and due date.
	dueInfoHtml = "<div id=" + compID + "rp-dueInfo class='" + compNS + "-rp-dueInfo'>" + statusImageHtml + "<span class='" + compNS + "-rp-dueinfo-week-indicator'>" + 
		elapsedTime + "</span>" + "<span class='" + compNS + "-rp-dueinfo-date'>(" + dueDate + ")</span>" + "</div>";

	return dueInfoHtml;
};

/*
 ** Returns the action text based on the action type.
 * @param {Number} - action_flag - The status_flag of the action 
 * @param {Boolean} - undoFlag - Set if the description is required for displaying undo of the action.
 * @return {String} - statusText -the action type based on the status_flag.
 */
RecommendationsO2Component.prototype.getActionDescription = function(action_flag, undoFlag) {

	var statusText = "";
	var recomi18n = i18n.discernabu.recommendations_o2;

	switch(action_flag) {
		case this.RECORD_STATUS_TYPE.SATISFIED:
			statusText = undoFlag ? recomi18n.SATISFY : recomi18n.SATISFIED;
			break;

		case this.RECORD_STATUS_TYPE.POSTPONED:
			statusText = undoFlag ? recomi18n.POSTPONE : recomi18n.POSTPONED;
			break;

		case this.RECORD_STATUS_TYPE.PENDING:
			statusText = recomi18n.PENDING;
			break;

		case this.RECORD_STATUS_TYPE.SKIPPED:
			statusText = recomi18n.SKIPPED;
			break;

		case this.RECORD_STATUS_TYPE.CANCELED:
			statusText = recomi18n.CANCELED;
			break;

		case this.RECORD_STATUS_TYPE.OTHERSATISFIER:
			statusText = recomi18n.OTHER_SATISFIER;
			break;

		case this.RECORD_STATUS_TYPE.UNDONE:
			statusText = recomi18n.UNDONE;
			break;

		case this.RECORD_STATUS_TYPE.EXPIRED:
			statusText = recomi18n.SYSCANCELLED;
			break;

		case this.RECORD_STATUS_TYPE.REFUSED:
			statusText = undoFlag ? recomi18n.REFUSE : recomi18n.REFUSED;
			break;

		default:
			statusText = recomi18n.UNKNOWN_STATUS;
			break;
	}

	return statusText;
};

/**
 ** Return the html for time line graph with 4 sections based on the due type and
 ** a status label to display the status(satisfied, near due,due or overdue) of expectation.
 * @param {Object} data Information of select row.
 * @return {string}   graphHtml : Html string of information about the trending graph.
 */
RecommendationsO2Component.prototype.getTimeLineGraphHtml = function(data) {
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();

	// Initialize the graph anchor date to today
	var graph_anchor_date = new Date(this.m_anchorDate.valueOf());
	// Date object just used for comparison purposes
	var dummyDate = new Date(2100, 12, 31, 0, 0, 0, 0);

	// Initialize all the dates to dummy date for easy comparison later
	var due_date = new Date(dummyDate.valueOf());
	var near_due_date = new Date(dummyDate.valueOf());
	var over_due_date = new Date(dummyDate.valueOf());
	var graphHtml = "";

	// trending graph div
	var $graphDiv = $("<div id=" + compID + "graphdiv class='" + compNS + "-rp-graphdiv'/>");

	if (data.NEAR_DUE_DATE !== "") {
		near_due_date.setISO8601(data.NEAR_DUE_DATE);
	}
	else {
		near_due_date.setISO8601(data.DUE_DATE_UTC);
	}

	if (data.DUE_DATE_UTC !== "") {
		due_date.setISO8601(data.DUE_DATE_UTC);
	}

	if (data.OVER_DUE_DATE !== "") {
		over_due_date.setISO8601(data.OVER_DUE_DATE);
	}

	// If there is a last satisfied date, set the graph anchor date to that
	if (data.LAST_SAT_DATE !== "") {
		graph_anchor_date.setISO8601(data.LAST_SAT_DATE);
	}
	else {
		// If the expectation is not due, set the anchor date equal to the near due, due, or over due time if they exist, and are less than this.anchorDate
		if (data.DUE_STATUS_FLAG !== this.DUE_TYPE.SATISFIED) {
			if (near_due_date < this.m_anchorDate) {
				graph_anchor_date = new Date(near_due_date.valueOf());
			}
			else if (due_date < this.m_anchorDate) {
				graph_anchor_date = new Date(due_date.valueOf());
			}
			else if (over_due_date < this.m_anchorDate) {
				graph_anchor_date = new Date(over_due_date.valueOf());
			}
			else {// default: anchor date set to current date
				graph_anchor_date = new Date(this.m_anchorDate.valueOf());
			}
		}
		else {
			// set the graph anchor date to the current date
			graph_anchor_date = new Date(this.m_anchorDate.valueOf());
		}
	}

	// Only calculate the length of each interval if the date was provided
	var notDueLength = (near_due_date.valueOf() !== dummyDate.valueOf()) ? Math.max(0, near_due_date - graph_anchor_date) : 0;
	var nearDueLength = (due_date.valueOf() !== dummyDate.valueOf() && near_due_date.valueOf() !== dummyDate.valueOf()) ? Math.max(0, due_date - near_due_date) : 0;
	var dueLength = (over_due_date.valueOf() !== dummyDate.valueOf() && due_date.valueOf() !== dummyDate.valueOf()) ? Math.max(0, over_due_date - due_date) : 0;
	var overdueLength = (over_due_date.valueOf() !== dummyDate.valueOf()) ? Math.max(0, this.m_anchorDate - over_due_date) : 0;

	var totalLength = 0;
	var notDuePercent = 0;
	var nearDuePercent = 0;
	var duePercent = 0;
	var overduePercent = 0;

	if (dueLength === 0) {
		// Check to see if the status is actually over due, even if there isnt an overdue time.  If so, build an arbitrary overdue
		if (data.DUE_STATUS_FLAG === this.DUE_TYPE.OVERDUE) {
			duePercent = 95;
			overduePercent = 5;
			this.m_statusBarPos = 0.98;
		}
		else if (data.DUE_STATUS_FLAG === this.DUE_TYPE.SATISFIED) {
			// Not due, and no intervals
			notDuePercent = 95;
			duePercent = 5;
			this.m_statusBarPos = 0.1;
		}
		else {
			duePercent = 100;
			this.m_statusBarPos = 0.9;
		}
	}
	else {
		totalLength = notDueLength + nearDueLength + dueLength + overdueLength;
		notDuePercent = (notDueLength / totalLength * 100);
		nearDuePercent = (nearDueLength / totalLength * 100);
		duePercent = (dueLength / totalLength * 100);
		overduePercent = (overdueLength / totalLength * 100);
		this.m_statusBarPos = (this.m_anchorDate - graph_anchor_date) / totalLength;

		// If the status bar pos is less than or equal to zero (which should never happen),
		this.m_statusBarPos = (this.m_statusBarPos <= 0) ? 0.02 : this.m_statusBarPos;

		// If the status bar is all the way to the right (==1) or great than 1 (should never happen), give a little buffer
		this.m_statusBarPos = (this.m_statusBarPos >= 1) ? 0.98 : this.m_statusBarPos;
	}

	var $graphNotDueBar = $("<div id='" + compID + "-graph-notDueBar' class='" + compNS + "-graph-not-due' style='width:" + notDuePercent + "%;'/>");
	var $graphNearDueBar = $("<div id='" + compID + "-graph-nearDueBar' class='" + compNS + "-graph-near-due' style='width:" + nearDuePercent + "%;'/>");
	var $graphDueBar = $("<div id='" + compID + "-graph-dueBar' class='" + compNS + "-graph-due' style='width:" + duePercent + "%;'/>");
	var $graphOverdueBar = $("<div id='" + compID + "-graph-overdueBar' class='" + compNS + "-graph-over-due' style='width:" + overduePercent + "%;'/>");

	$graphDiv.append($graphNotDueBar);
	$graphDiv.append($graphNearDueBar);
	$graphDiv.append($graphDueBar);
	$graphDiv.append($graphOverdueBar);

	// Add left rounding on timeline graph
	if (notDuePercent > 0.0) {
		$graphNotDueBar.addClass(compNS + "-graph-left");
	}
	else if (nearDuePercent > 0.0) {
		$graphNearDueBar.addClass(compNS + "-graph-left");
	}
	else if (duePercent > 0.0) {
		$graphDueBar.addClass(compNS + "-graph-left");
	}
	else {
		$graphOverdueBar.addClass(compNS + "-graph-left");
	}

	// Add right rounding on timeline graph
	if (overduePercent > 0.0) {
		if ($graphOverdueBar.hasClass(compNS + "-graph-left")) {
			$graphOverdueBar.removeClass(compNS + "-graph-left").addClass(compNS + "-graph-both");
		}
		else {
			$graphOverdueBar.addClass(compNS + "-graph-right");
		}
	}
	else if (duePercent > 0.0) {
		if ($graphDueBar.hasClass(compNS + "-graph-left")) {
			$graphDueBar.removeClass(compNS + "-graph-left").addClass(compNS + "-graph-both");
		}
		else {
			$graphDueBar.addClass(compNS + "-graph-right");
		}
	}
	else if (nearDuePercent > 0.0) {
		if ($graphNearDueBar.hasClass(compNS + "-graph-left")) {
			$graphNearDueBar.removeClass(compNS + "-graph-left").addClass(compNS + "-graph-both");
		}
		else {
			$graphNearDueBar.addClass(compNS + "-graph-right");
		}
	}
	else {
		if ($graphNotDueBar.hasClass(compNS + "-graph-left")) {
			$graphNotDueBar.removeClass(compNS + "-graph-left").addClass(compNS + "-graph-both");
		}
		else {
			$graphNotDueBar.addClass(compNS + "-graph-right");
		}
	}

	// If the expectation is not due, and has been previously satisfied, display "Satisfied" in status bar
	data.DUE_STATUS_TEXT = (data.LAST_SAT_DATE !== "" && data.DUE_STATUS_FLAG === this.DUE_TYPE.SATISFIED) ? i18n.discernabu.recommendations_o2.SATISFIED : data.DUE_STATUS_TEXT;

	// Html for trending graph and status bubble.
	graphHtml = "<div id='" + compID + "graphWrapper'>" + $graphDiv[0].outerHTML + "<div id='" + compID + "-graph-statusbar' title=" + data.DUE_STATUS_TEXT + "><span id='" + compID + "-graph-statusbar-text' class='" + compNS + "-graph-statusbar-text'>" + data.DUE_STATUS_TEXT + "</span></div></div>";

	return graphHtml;
};

/**
 * Helper method to allow for re-styling of the timeline graph when the component is re-sized.
 */
RecommendationsO2Component.prototype.styleTimelineGraph = function() {
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var $graphStatusBar = $("#" + compID + "-graph-statusbar");

	if (!$graphStatusBar.length) {
		return;
	}

	var graphWidth = 0;
	var labelClass = compNS + "-graph-statusbar center";

	var bubbleX = 0;
	var bubbleWidth = 76;
	var halfBubbleWidth = (bubbleWidth / 2);
	var desiredBubbleCaretX = 0;
	var bubbleLeftCaretOffset = 15;
	var $graphDiv = $("#" + compID + "graphdiv");

	//If the graph has no width, we do nothing
	if (!$graphDiv.length) {
		return;
	}
	// Get the width of the graph div in pixels, this will be our baseline to calculate our offsets
	graphWidth = $graphDiv.width();

	//This is calculated as a percentage of the graph width
	desiredBubbleCaretX = graphWidth * this.m_statusBarPos;

	//If the caret placement requires the use of the left caret
	if (desiredBubbleCaretX < halfBubbleWidth) {
		$graphStatusBar.removeClass();
		labelClass = compNS + "-graph-statusbar left";
		bubbleX = desiredBubbleCaretX - bubbleLeftCaretOffset;
	}
	//If the caret placement requires the use of the right caret
	else if ((graphWidth - desiredBubbleCaretX) < halfBubbleWidth) {
		$graphStatusBar.removeClass();
		labelClass = compNS + "-graph-statusbar right";
		bubbleX = desiredBubbleCaretX - (bubbleWidth - bubbleLeftCaretOffset);
	}
	//If the caret placement is in the center
	else {
		bubbleX = desiredBubbleCaretX - halfBubbleWidth;
	}

	// To avoid the overflow in setting the margin, value of bubbleX should be limited between the max and min value.
	// The maximum value should be length from left side to starting point of status bar if it is right caret.
	// The minimum value should be left most point of graph.
	var minLeftMargin = 0;
	var maxLeftMargin = graphWidth - bubbleWidth;
	bubbleX = Math.min(Math.max(minLeftMargin, bubbleX), maxLeftMargin);

	$graphStatusBar.css("margin-left", bubbleX + "px");
	$graphStatusBar.addClass(labelClass);
};

/*
 ** Overriding MPageComponent's resizeComponent method to set the height of side panel and
 ** adjust status bubble position of trending graph.
 */
RecommendationsO2Component.prototype.resizeComponent = function() {
	//Call the base class functionality to resize the component
	MPageComponent.prototype.resizeComponent.call(this, null);

	if (this.m_isSidePanelOpen) {
		this.m_sidePanel.resizePanel();
		this.resetSidePanelHeight();
	}

	this.styleTimelineGraph();
};

/**
 * Function to reset the height of side panel to component table height.
 * To reset the height, minimum height of side Panel will be set as the height of component table.
 * If the height of component table is less than side panel's min height, side panel's min height will be set.
 * This function will be called whenever the height of component changed(on component resizing , subsection expanding/collapsing).
 * @param {null}
 * @return {null}
 */
RecommendationsO2Component.prototype.resetSidePanelHeight = function() {

	if (this.m_$tableView && this.m_$tableView.length && this.m_sidePanel) {
		var sidePanelHeight = Math.max(this.m_$tableView.height(), this.m_sidePanelMinHeight);
		this.m_sidePanel.setMinHeight(sidePanelHeight + "px");
		this.m_sidePanel.setHeight(sidePanelHeight + "px");
		this.m_sidePanel.showHideExpandBar();
	}
};

/*
 ** This method will be called only one time, after finalizing the component.
 ** Initializing the reading pane by adding the place holders for all the info.
 ** After Initialization do the rendering with first row details.
 */
RecommendationsO2Component.prototype.initializeSidePanel = function() {

	var compID = this.getComponentId();
	var maxViewHeight = ($("#vwpBody").height() - 70) + "px";
	var tableHeight = $("#" + this.m_recommendationsTable.getNamespace() + "tableBody").height();
	
	

	try {

		if (this.m_$sidePanelContainer && this.m_$sidePanelContainer.length) {
			//Create the side panel
			this.m_sidePanel = new CompSidePanel(compID, this.m_$sidePanelContainer.attr("id"));
			this.m_sidePanel.setExpandOption(this.m_sidePanel.expandOption.EXPAND_DOWN);
			this.m_sidePanel.setMinHeight(this.m_sidePanelMinHeight + "px");
			this.m_sidePanel.setHeight(tableHeight);
			this.m_sidePanel.setOffsetHeight(40);
			this.m_sidePanel.setMaxHeight(maxViewHeight);
			this.m_sidePanel.setApplyBodyContentsPadding(true);
			// Render the side panel
			this.m_sidePanel.renderPreBuiltSidePanel();
			this.m_sidePanel.setContents("<div></div>", "recom-o2" + this.getComponentId());

			//Close the side panel as we want to show side panel only on click of a row
			this.m_sidePanel.hidePanel();

		}
	}
	catch(err) {
		logger.logJSError(err, RecommendationsO2Component, "recommendations-o2.js", "initializeSidePanel");
	}
};

/*
 ** This method will be called only one time, while rendering the component.
 * The time interval configured for the expectations will be displayed as look-back range in other components, left to component menu
 **/
RecommendationsO2Component.prototype.displayTimeInterval = function(reply) {
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var date = new Date();
	var endDate = "";

	var recomObject = $("#" + compNS + compID);

	if (!recomObject.length) {
		return;
	}

	var titleObj = recomObject.find(".sec-hd");

	if (!titleObj.length) {
		return;
	}

	if (reply.PENDING_EXPECT_END_DATE !== "") {
		date.setISO8601(reply.PENDING_EXPECT_END_DATE);
	}

	endDate = date.format("mmmm yyyy");

	var intervalText = i18n.discernabu.recommendations_o2.PRESENT + " - " + endDate;
	var timeIntervalObj = $("#" + compID + "-time-interval");

	// If the html for look forward is already there, only change the interval text.
	// In initial load of the view, length will be 0 and on refresh button click length will be 1 as its already added.
	if (timeIntervalObj.length) {
		timeIntervalObj.text(intervalText);
		return;
	}

	timeIntervalObj = "<span id='" + compID + "-time-interval' class='" + compNS + "-time-interval'>" + intervalText + "</span>";

	titleObj.append(timeIntervalObj);
};

/**
 * Determine if the component needs to display a warning message to the end user indicating "stale" data from the Health Maintenance service.
 * If it the stale data warning message is needed, build appropriate markup, and inject directly into DOM
 */
RecommendationsO2Component.prototype.displayRecomStaleDataMsg = function(reply) {

	var compID = this.getComponentId();
	
	// Remove stale data message if it is displaying.
	$("#" + compID + "-stale-warning").remove();

	if ( typeof (reply.COHERENCY_ACTIVE_IND) === "undefined") {
		return;
	}

	if (reply.COHERENCY_ACTIVE_IND !== 0) {
		return;
	}

	if (!reply.COHERENCY_VALID_DT_TM) {
		return;
	}
	var compNS = this.getStyles().getNameSpace();
	var $recomContent = $("#" + compNS + "Content" + this.getComponentId());

	if(!$recomContent.length) {
		return;
	}

	var dateTime = new Date();
	var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);

	dateTime.setISO8601(reply.COHERENCY_VALID_DT_TM);
	var recomWarnDateStr = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR) + " " + df.format(dateTime, mp_formatter.DateTimeFormatter.TIME_24HOUR);
	var recomWarnStr = "<div id ='" + compID + "-stale-warning' class='sub-title-disp " + compNS + "-stale-warning'>" + i18n.discernabu.recommendations_o2.STALE_DATA_MSG.replace("{0}", recomWarnDateStr) + "</div>";
	$recomContent.before(recomWarnStr);

};
/**
 * This function checks if an entity is already present in the entity array.
 * @param{ number, object } the entity ID, entity array
*/
RecommendationsO2Component.prototype.isInEntityList = function(entityId, entityList){
	for(var i=0;i<entityList.length;i++){
		if(entityId === entityList[i].PARENT_ENTITY_ID){
			return true;
		}
	}
	return false;
};
/**
 * This function retrieves the reference text data using a call to service 600478
 * @param {object } the recommendation results
*/
RecommendationsO2Component.prototype.retrieveReferenceTextDataExistsForMultipleRecords = function (recomRecords) {
	var recomLength = recomRecords.length;
	var currentRecord = null;
	var satisfierLength = 0;
	var satisfiers = null;
	var currentSatisfier = null;
	var referenceTextIdsBatch = {
		REQUESTIN : {
			ENTITY_LIST : [],
			DEBUG_IND : 1
		}
	};
	for (var i = 0; i < recomLength; i++) {
		currentRecord = recomRecords[i];
		satisfiers = currentRecord.SATISFIERS;
		satisfierLength = currentRecord.SATISFIERS.length;
		if (currentRecord.GROUP_NAME !== "!FREETEXT!") {
			if (!this.isInEntityList(currentRecord.EXPECT_ID, referenceTextIdsBatch.REQUESTIN.ENTITY_LIST)) {
				referenceTextIdsBatch.REQUESTIN.ENTITY_LIST.push({
					PARENT_ENTITY_NAME : "HEALTH_MAINT_EXPECT",
					PARENT_ENTITY_ID : currentRecord.EXPECT_ID
				});
			}
			if (!this.isInEntityList(currentRecord.SCHED_ID, referenceTextIdsBatch.REQUESTIN.ENTITY_LIST)) {
				referenceTextIdsBatch.REQUESTIN.ENTITY_LIST.push({
					PARENT_ENTITY_NAME : "HEALTH_MAINT_SCHED",
					PARENT_ENTITY_ID : currentRecord.SCHED_ID
				});
			}
			if (satisfierLength > 1) {
				for (var j = 0; j < satisfierLength; j++) {
					currentSatisfier = currentRecord.SATISFIERS[j];
					if (!this.isInEntityList(currentSatisfier.EXPECT_SAT_ID, referenceTextIdsBatch.REQUESTIN.ENTITY_LIST)) {
						referenceTextIdsBatch.REQUESTIN.ENTITY_LIST.push({
							PARENT_ENTITY_NAME : "HEALTH_MAINT_SAT",
							PARENT_ENTITY_ID : currentSatisfier.EXPECT_SAT_ID
						});
					}
				}
			} else if (satisfierLength === 1) {
				currentSatisfier = currentRecord.SATISFIERS[0];
				if (!this.isInEntityList(currentSatisfier.EXPECT_SAT_ID, referenceTextIdsBatch.REQUESTIN.ENTITY_LIST)) {
					referenceTextIdsBatch.REQUESTIN.ENTITY_LIST.push({
						PARENT_ENTITY_NAME : "HEALTH_MAINT_SAT",
						PARENT_ENTITY_ID : currentSatisfier.EXPECT_SAT_ID
					});
				}
			}
		}
	}
	this.getReferenceTextExistsBatch(referenceTextIdsBatch);
};
/**
 * This function calls the service 600478 to fetch the reference text data
 * @param{object} the blobIn data to be passed to service 600478
 * @return{ object} the response from the service call
*/
RecommendationsO2Component.prototype.getReferenceTextExistsBatch = function (referenceTextIdsBatch) {
	var self = this;
	var DCP_GET_REF_TEXT_EXISTS_BATCH = {
		APPLICATION : 600005,
		TASK : 600701,
		REQUEST : 600478
	};
	var refTextBatchScriptRequest = new ScriptRequest();
	refTextBatchScriptRequest.setProgramName("MP_EXEC_STD_REQUEST");
	refTextBatchScriptRequest.setParameterArray(["^MINE^", "^^", DCP_GET_REF_TEXT_EXISTS_BATCH.APPLICATION, DCP_GET_REF_TEXT_EXISTS_BATCH.TASK, DCP_GET_REF_TEXT_EXISTS_BATCH.REQUEST]);
	refTextBatchScriptRequest.setDataBlob(MP_Util.enhancedStringify(referenceTextIdsBatch));
	refTextBatchScriptRequest.setResponseHandler(function (scriptReply) {
		if (scriptReply.getStatus() === "S") {
			self.m_referenceTextExistsObj = scriptReply.getResponse();
			self.renderComponent(self.m_scriptReply);
		}
		else{
			self.renderComponent(self.m_scriptReply);
		}
	});
	refTextBatchScriptRequest.performRequest();
};

/*
 ** Overriding MPageComponent's renderComponent method.
 */
RecommendationsO2Component.prototype.renderComponent = function(replyObj) {
	var component = replyObj.getComponent();
	var self = this;
	this.referenceTextCapTimer = new CapabilityTimer("CAP:MPG_Recommendations_O2_Reference_Text", component.getCriterion().category_mean);
	var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName(), component.getCriterion().category_mean);
	var compID = component.getComponentId();
	var compNS = component.getStyles().getNameSpace();
	var recomi18n = i18n.discernabu.recommendations_o2;
	var recomHTML = "";
	var tableViewObj = null;
	var userPrefAlert = "";
	var compContainerObj = null;
	var countText = "";
	var reply = replyObj.getResponse();
	var recomRecords = reply.RECS;
	var allRemindersAssigned = reply.REMINDER;
	var userPrefs = null;
	var addProcedureActionObject = this.getAddProcedureAction();

	//Retain the series ids and schedule ids for add recommendations functionality.
	this.processAndSaveRecommendationsReply(allRemindersAssigned);
	var $sidePanelContainer = null;

	// Handle if the status block is present, but the reply status is not filled out...
	if (!replyObj.getStatus()) {
		replyObj.setStatus("F");
	}
	try{
		 userPrefs = this.getPreferencesObj();

	}catch(err){
		var text = this.m_i18nStrings.UNABLE_TO_RETRIEVE_PREFS;
		var alertMarkup = self.getErrorAlert(this.m_alertType.WARNING,text,"");
			userPrefAlert += alertMarkup;
	}
	if (userPrefs) {
		if (userPrefs.savedColumnsObj) {
			self.m_recomPrefObj.savedColumnsObj = userPrefs.savedColumnsObj;
		}
		if (userPrefs.favoritesObject) {
			self.m_recomPrefObj.favoritesObject = userPrefs.favoritesObject;
		}
		if (typeof userPrefs.REQUIRED !== "undefined") {
			self.m_recomPrefObj.REQUIRED = userPrefs.REQUIRED;
		}
	}
	try {
		if (replyObj.getStatus() !== "F") {

			//Preference that allows user to modify a recommendation
			this.setAllowAdditionIndicator(reply.ENABLE_HM_ADDITION === 1 ? true : false);

			//Preference that allows user to modify a recommendation
			this.setAllowModificationIndicator(reply.ENABLE_HM_MODIFICATION === 1 ? true : false);

			//Preference that allows user to add a free text recommendation
			this.setAllowFreeTextAdditionIndicator(reply.ENABLE_HM_ADD_FREETEXT === 1 ? true : false);

			//Preference that determines whether reason is required while adding a recommendation
			this.setExpectReasonAdditionIndicator(reply.ADD_EXPECT_REASON_PREF === 1 ? true : false);

			// Add frequency modification reason preference and due date modification reason preference
			this.setReasonOnFrequencyModification(reply.MODIFY_FREQ_REASON_PREF === 1 ? true : false);
			this.setReasonOnDueDateModification(reply.MODIFY_DUE_DATE_REASON_PREF === 1 ? true : false );

			// Save the show satisfiers preference
			this.setShowSatisfiersPreference(reply.SHOW_SATISFIERS === 1 ? true : false);

			 // Save satisifers for free text expectations
			var freeTextSatisfiers = {
				DONE_ELSEWHERE_PREF: reply.REQUIRE_HM_DONEELSE === 1 ? true : false,
				DONE_ELSEWHERE_LABEL: reply.HM_DONEELSE_LABEL,

				REFUSE_PREF: reply.REQUIRE_HM_REFUSE === 1 ? true : false,
				REFUSE_LABEL: reply.HM_REFUSE_LABEL,

				CANCEL_PREF: reply.REQUIRE_HM_CANCEL === 1 ? true : false,
				CANCEL_LABEL: reply.HM_CANCEL_LABEL
			};
			this.setFreeTextSatisfiers(freeTextSatisfiers);

			// Save action types and reasons for manual actions such as postpone, refuse, cancel and Manual satisfy
			this.setModifierTypesAndReasons({
				MODIFIER_TYPES: reply.MODIFIER_TYPES,
				EXPIRE_REASONS: reply.EXPIRE_REASONS,
				POSTPONE_REASONS: reply.POSTPONE_REASONS,
				REFUSE_REASONS: reply.REFUSE_REASONS,
				SATISFY_REASONS: reply.SATISFY_REASONS
			});

			// Build the stale data message (if appropriate), and build the time interval for lookback
			this.setPendingDueDatePreference(parseInt(reply.PENDING_FUTURE_PREF));
			component.displayRecomStaleDataMsg(reply);
			component.setGroupId(reply.GROUP_ID);
			component.displayDateRangePreferenceSelector();
			if (replyObj.getStatus() === "S") {

				recomHTML = component.generateFilterHtml();

				// Main component container having both component table and reading pane.
				compContainerObj = $("<div></div>").attr("id", compID + "maincontainer").addClass(compNS + "-maincontainer");
				tableViewObj = $("<div id='" + compID + "tableview' class='" + compNS + "-table'/>");

				component.m_personnelArray = MP_Util.LoadPersonelListJSON(reply.PRSNL);

				//Process the results so rendering becomes more trivial
				component.processResultsForRender(recomRecords);

				//Get the component table (the first time this is called, it is created)
				component.m_recommendationsTable = new ComponentTable();
				component.m_recommendationsTable.setNamespace(compNS + compID);

				// Array to store image column details
				var imgColInfo = {
					ID: "DUE_IMAGE",
					CLASS: compNS + "-image",
					DISPLAY: "&nbsp;",
					SORTABLE: false,
					PRIMARY_SORT_FIELD: "",
					SEC_SORT_FIELD: "",
					RENDER_TEMPLATE: "DUE_IMAGE"

				};

				// Array to store Expectation Name column details
				var expectationColInfo = {
					ID: "EXPECTATION_NAME",
					CLASS: compNS + "-expectation",
					DISPLAY: recomi18n.EXPECTATION,
					SORTABLE: true,
					PRIMARY_SORT_FIELD: "EXPECT_STEP",
					SEC_SORT_FIELD: "DUE_DATE",
					RENDER_TEMPLATE: "EXPECTATION_NAME"

				};

				// Array to store Priority column details
				var priorityColInfo = {
					ID: "PRIORITY",
					CLASS: compNS + "-priority",
					DISPLAY: recomi18n.PRIORITY,
					PRIMARY_SORT_FIELD: "PRIORITY_SEQ",
					SEC_SORT_FIELD: "DUE_DATE",
					SORTABLE: true,
					RENDER_TEMPLATE: "PRIORITY_TYPE"

				};

				// Array to store Frequency column details
				var freqColInfo = {
					ID: "FREQUENCY",
					CLASS: compNS + "-frequency",
					DISPLAY: recomi18n.FREQUENCY,
					PRIMARY_SORT_FIELD: "",
					SEC_SORT_FIELD: "",
					SORTABLE: false,
					RENDER_TEMPLATE: "FREQUENCY"

				};

				// Array to store Due column details
				var dueColInfo = {
					ID: "DUE",
					CLASS: compNS + "-due",
					DISPLAY: recomi18n.DUE,
					PRIMARY_SORT_FIELD: "DUE_DATE",
					SEC_SORT_FIELD: "EXPECT_STEP",
					SORTABLE: true,
					RENDER_TEMPLATE: "DUE_DATE_STRING"

				};

				// Array to store Due column details
				var favoritesColInfo = {
					ID : "FAVORITES",
					CLASS : compNS + "-favorites",
					DISPLAY : recomi18n.FAVORITES,
					PRIMARY_SORT_FIELD : "FAVORITES_DISP",
					SEC_SORT_FIELD : "DUE_DATE",
					SORTABLE : true,
					RENDER_TEMPLATE : "FAVORITES"

				};
				//Create the columns and add to the table
				// Image
				component.m_recommendationsTable.addColumn(component.createColumn(imgColInfo));

				// Expectation Name
				var expColum = component.createColumn(expectationColInfo);
				component.m_recommendationsTable.addColumn(expColum);

				// Priority
				component.m_recommendationsTable.addColumn(component.createColumn(priorityColInfo));

				// Frequency
				var freqColum = component.createColumn(freqColInfo);
				component.m_recommendationsTable.addColumn(freqColum);

				// Due Date
				var dueColum = component.createColumn(dueColInfo);
				component.m_recommendationsTable.addColumn(dueColum);
				
				//Favorites
				var favoritesColum = component.createColumn(favoritesColInfo);
				component.m_recommendationsTable.addColumn(favoritesColum);

				// Add the hover extension related stuffs only if the Touch Mode is disabled.
				if (!CERN_Platform.isTouchModeEnabled()) {
					var hvrExtension = new TableCellHoverExtension();

					//Add hover extension for expectation column
					hvrExtension.addHoverForColumn(expColum, component.onHovering);

					// Add hover extension for frequency column
					hvrExtension.addHoverForColumn(freqColum, component.onHovering);

					// Add hover extension for due column
					hvrExtension.addHoverForColumn(dueColum, component.onHovering);

					component.m_recommendationsTable.addExtension(hvrExtension);

					/**
					 * Overrides the finalize method for the HoverExtension.
					 * This is done to allow for NOT displaying hover background color when a cell does not need it.
					 * @param table the table to which this extension belongs.
					 */
					hvrExtension.finalize = function(table) {
						var thiz = this;
						var tableBodyTag = "#" + table.getNamespace() + "tableBody";
						var elementMap = {};
						//Bind the mouseenter event so we know when a user has hovered into an item
						$(tableBodyTag).on("mouseenter", this.getTarget(), function(event) {
							var anchor = this;
							var anchorId = $(this).attr("id");
							//If there is a hover class specified, add it to the element
							if (thiz.getHoverClass() !== "" && $(this).children("." + compNS + "-modify-indicator").length > 0) {
								$(this).addClass(thiz.getHoverClass());
							}
							if (!elementMap[anchorId]) {
								elementMap[anchorId] = {};
							}
							thiz.onHover(event);
							//Store of a flag that we're hovered inside this element
							elementMap[anchorId].TIMEOUT = setTimeout(function() {
								thiz.showHover(event, table, anchor);
							}, 500);
						});
						//Bind the mouseleave event
						$(tableBodyTag).on("mouseleave", this.getTarget(), function(event) {
							$(this).removeClass("mpage-tooltip-hover");
							if(elementMap[$(this).attr("id")]){
								clearTimeout(elementMap[$(this).attr("id")].TIMEOUT);
							}
							thiz.onLeave(event);
						});
					};
				}

				component.addCellClickExtension(recomRecords);

				/*
				 * Add group toggle extension to handle the resizing of the reading pane.
				 */
				var grpToggleExtension = new TableGroupToggleCallbackExtension();
				grpToggleExtension.setGroupToggleCallback(function() {
					component.resetSidePanelHeight();
				});

				component.m_recommendationsTable.addExtension(grpToggleExtension);

				//Bind the data to the results
				component.m_recommendationsTable.bindData(recomRecords);

				//Store off the component table
				component.setComponentTable(component.m_recommendationsTable);

				// Reset the last selected filter to default value.
				component.m_lastSelFilter = component.FILTERS.NONE;

				component.groupByFilter(component.m_recomPrefObj.groupByPref, recomRecords);

				// Default sorting is the Ascending order of due date.
				component.m_recommendationsTable.sortByColumnInDirection("DUE", TableColumn.SORT.ASCENDING);

				// Append the recommendationsTable object to table view
				tableViewObj.append($(component.m_recommendationsTable.render()));

				// Create the side panel container
				$sidePanelContainer = $("<div id='" + compID + "sidePanelContainer' class='" + compNS + "-sidepanel-container'/>");

				//Append AlertBanner to the main container
				compContainerObj.append(userPrefAlert);

				// Append both table view and reading pane to main container
				compContainerObj.append(tableViewObj, $sidePanelContainer);

				// Append the main container markup to component markup
				recomHTML += compContainerObj[0].outerHTML;

				// Store the history time frame in the component object for easy access
				var bDate = new Date();
				if (reply.SATIS_EXPECT_START_DATE !== "") {
					bDate.setISO8601(reply.SATIS_EXPECT_START_DATE);
				}
				component.m_historyLookback = bDate.format("mmmm yyyy");
				component.m_anchorDate.setISO8601(reply.ANCHOR_DATE);

				/**
				 ** Override the toggleColumnSort method of ComponentTable to select the first row in the table view after sorting.
				 ** @param columnId  :-the column to be sorted.
				 */
				component.m_recommendationsTable.toggleColumnSort = function(columnId) {

					//Call the base class functionality to sort column
					ComponentTable.prototype.toggleColumnSort.call(this, columnId);

					// Check if the sidePanel is rendered and select default row only when side panel is rendered
					if(component.m_isSidePanelOpen) {
						component.selectDefaultRow(true);	
					}
				};
				
				//Update the overdue indicator based on the overdue count of the reply
				this.updateOverdueIndicatorBasedOnOverdueCount(reply.OVERDUE_CNT);
				
			}
			else {
				if ((replyObj.getStatus() === "Z")) {
					//The overdue_count is set to zero as there are no recommendations available
					var OVEDUE_COUNT = 0;
					recomHTML += MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace());
					
					//Update the overdue indicator
					//As no expectations are present, display the green check mark
					this.updateOverdueIndicatorBasedOnOverdueCount(OVEDUE_COUNT);
				}
			}

			countText = MP_Util.CreateTitleText(component, recomRecords.length);

			//Finalize the component
			component.finalizeComponent(recomHTML, countText);

			if (replyObj.getStatus() === "S") {
				//customize columns based on user preferences
				component.customizeColumnsBasedOnUserPreferences();
			}

			component.m_$tableView = $("#" + compID + "tableview");
			component.m_$sidePanelContainer = $("#" + compID + "sidePanelContainer");

			//Add the preview pane.  Have to include this after finalize due to DOM elements not existing until finalize
			component.initializeSidePanel();

			//Update the component result count
			CERN_EventListener.fireEvent(component, component, EventListener.EVENT_COUNT_UPDATE, {
				"count": recomRecords.length
			});

			// Attach Listeners
			component.attachListeners(recomRecords);

			// If the component is refreshed after a modify/satisfy was successful, select the modified row and clear the modify object
			if (component.m_modifyObject.saveSuccessful && component.m_modifyObject.modifiedRowId) {
				this.selectModifiedRow(this.RECOMMENDATION_ACTION.MODIFY);
			} else if (component.getActionObject() && component.getActionObject().saveSuccessful && component.getActionObject().modifiedRowId) {
				this.selectModifiedRow(this.RECOMMENDATION_ACTION.MANUAL_SATISFY);
			} else if ( this.m_systemSatisfierAction.recommendationId ){
				this.updateSelection(this);
			} else if (addProcedureActionObject && addProcedureActionObject.saveSuccessful && addProcedureActionObject.modifiedRowId){
				this.selectModifiedRow(this.RECOMMENDATION_ACTION.SYSTEM_SATISFY_PROCEDURE);
			}
			
		}
		else {
			var errMsg = [];
			errMsg.push(replyObj.getError());
			component.finalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("<br />")), "");
			CERN_EventListener.fireEvent(component, component, EventListener.EVENT_COUNT_UPDATE, {
				"count": 0
			});
			//Preference that allows user to modify a recommendation
			this.setAllowAdditionIndicator(false);

			//Preference that allows user to modify a recommendation
			this.setAllowModificationIndicator(false);

			//Preference that allows user to add a free text recommendation
			this.setAllowFreeTextAdditionIndicator(false);

			//Preference that determines whether reason is required while adding a recommendation
			this.setExpectReasonAdditionIndicator(false);
			
			//Set the satisfied indicator as false
			this.setSatisfiedInd(false);
		}
	} catch (err) {
		if (timerRenderComponent) {
			timerRenderComponent.Abort();
			timerRenderComponent = null;
		}
		throw (err);
	}
	finally {
		if (timerRenderComponent) {
			timerRenderComponent.Stop();
		}
	}
};

/**
 * This function sets the satisfiedInd based on the overdue recommendations count.
 * If the overdue count is more than 0, fire the event to show red cirecle icon as overdue indicator
 * Else, fire the event to display a green check mark icon
 * @param {Number} overdueCount - number of overdue expectations 
 */
RecommendationsO2Component.prototype.updateOverdueIndicatorBasedOnOverdueCount = function (overdueCount) {
	if (overdueCount > 0) {
		this.setSatisfiedInd(false);
		CERN_EventListener.fireEvent(this, this, EventListener.EVENT_SATISFIER_UPDATE, {
			satisfied : false
		});
	} else {
		this.setSatisfiedInd(true);
		CERN_EventListener.fireEvent(this, this, EventListener.EVENT_SATISFIER_UPDATE, {
			satisfied : true
		});
	}
	this.updateComponentRequiredIndicator();
};

/**
 * Function to check if favorites are available 
 * @param {null}
 * @return {boolean}  true or false based on favorites available or not
 */
RecommendationsO2Component.prototype.isFavoriteAvaliable = function(){
	var favObj = this.m_recomPrefObj.favoritesObject;
	var favLen = favObj.length;
	for(var i=0;i<favLen;i++){
		var curFav = favObj[i];
		if (curFav.FAVORITE === true) {
			return true;
		}
	}
	return false;
};
/**
 * Function to display or hide columns based on saved user preferences.
 * This function will be called after the component table is rendered and will update the component table with saved preferences or default columns if no preferences are available
 * @param {null}
 * @return {null}
 */
RecommendationsO2Component.prototype.customizeColumnsBasedOnUserPreferences = function () {

	// add/remove columns after table render based on user prefs
	var self = this;
	var compID = self.getComponentId();
	var compNS = self.getStyles().getNameSpace();
	var componentTable = self.getComponentTable();
	var componentTableCols = componentTable.columns;
	var colHeader = null;
	var currentCol = null;
	// Priority
	if (!self.m_recomPrefObj.savedColumnsObj.PRIORITY) {
		colHeader = $("#" + compNS + compID + "columnHeaderPRIORITY").addClass("hidden");
		currentCol = componentTableCols[2];
		currentCol.setCustomClass("hidden");
	}

	// Frequency
	if (!self.m_recomPrefObj.savedColumnsObj.FREQUENCY) {
		colHeader = $("#" + compNS + compID + "columnHeaderFREQUENCY").addClass("hidden");
		currentCol = componentTableCols[3];
		currentCol.setCustomClass("hidden");
	}

	// Due Date
	if (!self.m_recomPrefObj.savedColumnsObj.DUE) {
		colHeader = $("#" + compNS + compID + "columnHeaderDUE").addClass("hidden");
		currentCol = componentTableCols[4];
		currentCol.setCustomClass("hidden");
	}
	// Reference
	if (!self.m_recomPrefObj.savedColumnsObj.REFERENCE) {
		colHeader = $("#" + compNS + compID + "columnHeaderREFERENCE_TEXT").addClass("hidden");
		currentCol = componentTableCols[5];
		currentCol.setCustomClass("hidden");
	}
	componentTable.refresh();
};

/**
 * Selects the modified row and updates clears the respective object
 * @param  {number} actionPerformed For Modify, this param should be set to this.RECOMMENDATION_ACTION.MODIFY
 *                                  For Postpone/Refuse/Cancel or Manual Satisfy this param should be set to this.RECOMMENDATION_ACTION.MANUAL_SATISFY
 */
RecommendationsO2Component.prototype.selectModifiedRow = function (actionPerformed) {

	var modifiedRowId = "";
	var modifiedRowObject = null;
	var compID = this.getComponentId();

	if (typeof actionPerformed !== "number") {
		throw new Error("Invalid parameter was passed to selectModifiedRow function");
	}

	switch(actionPerformed){
		case this.RECOMMENDATION_ACTION.MODIFY:
			modifiedRowId = this.m_modifyObject.modifiedRowId;
			break;
		case this.RECOMMENDATION_ACTION.MANUAL_SATISFY:
			modifiedRowId = this.getActionObject().modifiedRowId;
			break;
		case this.RECOMMENDATION_ACTION.SYSTEM_SATISFY_PROCEDURE:
			modifiedRowId = this.getAddProcedureAction().modifiedRowId;
			break;
	}

	// If Grouping is applied, id will be in the format of recom-o2+compID:GroupName:rowNumber, so create a regex and find the object using filter function
	if (this.m_recommendationsTable.isGroupingApplied()) {
		var reObj = new RegExp("recom-o2" + compID + ":\\w+:" + modifiedRowId + "$");
		modifiedRowObject = this.m_$tableView.find("dl").filter(function () {
			return this.id.match(reObj);
		});
	} else {
		modifiedRowObject = this.m_$tableView.find("#recom-o2" + compID + "\\:" + modifiedRowId);
	}

	// Clear the modify/action object before selecting the row
	
	switch(actionPerformed){
		case this.RECOMMENDATION_ACTION.MODIFY:
			this.m_modifyObject = {};
			break;
		case this.RECOMMENDATION_ACTION.MANUAL_SATISFY:
			this.setActionObject(null);
			break;
		case this.RECOMMENDATION_ACTION.SYSTEM_SATISFY_PROCEDURE:
			this.setAddProcedureAction(null);
			break;
	}

	this.updateInfo(modifiedRowObject, this.m_recommendationsTable.getRowById(modifiedRowId).getResultData(), false, this.refTextResponse);
};
/**
 * This function attaches the date range preference selector to the component
 * Creates the pop-up content and attaches the event handlers.
 **/

RecommendationsO2Component.prototype.openDateRangeModalWindow = function(){
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var months = 0;
	var years = 0;
	var modifiedMonthValue = 0;
	var modifiedYearValue = 0;	
	var self = this;
	var dialogBodyHTML = "";
	var resetButtonItem = null;
	var dateRangeModalDialog = MP_ModalDialog.retrieveModalDialogObject(compId + "dateRangeModalDialog");
	if(!dateRangeModalDialog){
		dateRangeModalDialog = new ModalDialog(compId + "dateRangeModalDialog").setHeaderTitle(self.m_i18nStrings.DUE_DATE_RANGE).setIsBodySizeFixed(false);;
		dateRangeModalDialog.setBodyDataFunction(function(modalObj){
			var pendingFuturePref = self.getPendingDueDatePreference();
			switch (pendingFuturePref) {
			case 6:
				years = 0;
				months = 6;
				break;
			case 12:
				years = 0;
				months = 12;
				break;
			case 60:
				years = 5;
				months = 0;
				break;
			case 120:
				years = 10;
				months = 0;
				break;
			default:
				if (pendingFuturePref <= 24) {
					months = pendingFuturePref;
					years = 0;
				}else{
					months = pendingFuturePref % 12;
					years = Math.floor(pendingFuturePref / 12);
				}
				break;
			}
			dialogBodyHTML = "<div id='" + compId + "dateRangeErrorAlert'></div>";
			dialogBodyHTML += "<div>" + self.getErrorAlert(self.m_alertType.INFO,self.m_i18nStrings.SAVE_DATE_RANGE, "") + "</div>";
			dialogBodyHTML += "<div ><div class='" + compNS + "-modal-from' >" + i18n.FROM + ":  " + self.m_i18nStrings.TODAY + "</div><div ><table id='dateRangeTable' class='recom-o2-modal-table' ><tr class='" + compNS + "-modal-table-row'><th class='" + compNS + "-modal-to'></th><th class='" + compNS + "-modal-table-th'>&nbsp;&nbsp;" + self.m_i18nStrings.YEAR_S + "</th><th class='" + compNS + "-modal-table-th'>" + self.m_i18nStrings.MONTH_S + "</th></tr><tr class='" + compNS + "-modal-table-row'><td class='" + compNS + "-modal-to'>" + self.m_i18nStrings.TO +": </td><td class='" + compNS + "-modal-table-td'>&nbsp;&nbsp;<input class='" + compNS + "-modal-input' id='" + compId + "years' type='text' value='" + years + "'></input></td ><td class='" + compNS + "-modal-table-td'><input class='" + compNS + "-modal-input' id='" + compId + "months' type='text' value='" + months + "'></input></td></tr></table></div></div>";
			dateRangeModalDialog.setBodyHTML(dialogBodyHTML);
		});
		dateRangeModalDialog.m_margins = {
			top : 25,
			right : 38,
			bottom : 5,
			left : 40
		};
		var saveButton = new ModalButton(compId + "saveDateRangeButton");
		saveButton.setText(i18n.SAVE).setIsDithered(true).setCloseOnClick(false);
		saveButton.setOnClickFunction(function () {
			newOfYears = parseInt($("#" + compId + "years").val());
			newOfMonths = parseInt($("#" + compId + "months").val());
			var dateRangeText = self.createDateRangeText(newOfYears, newOfMonths);
			var totalMonths = (newOfYears * 12) + newOfMonths; 
			self.saveDateRange(totalMonths,self.DATE_RANGE_TRIGGER.MODAL_WINDOW);
		});
		var cancelButton = new ModalButton(compId + "cancelDateRangeButton");
		cancelButton.setText(i18n.CANCEL).setIsDithered(false).setCloseOnClick(true);
		var resetButton = new ModalButton(compId + "resetDateRangeButton");
		resetButton.setText(this.m_i18nStrings.RESET).setIsDithered(false).setCloseOnClick(false);
		resetButton.setOnClickFunction(function () {
			$("#" + compId + "years").val(years);
			$("#" + compId + "months").val(months);
			modifiedYearValue = parseInt($("#" + compId + "years").val());
			modifiedMonthValue = parseInt($("#" + compId + "months").val());
			var modified = self.isDaterangeModalModified(years, months, modifiedYearValue, modifiedMonthValue);
			if (modified) {
				$("#" + compId + "saveDateRangeButton").attr("disabled", false);
			} else {
				$("#" + compId + "saveDateRangeButton").attr("disabled", true);
			}
		});
		dateRangeModalDialog.addFooterButton(resetButton);
		dateRangeModalDialog.addFooterButton(saveButton);
		dateRangeModalDialog.addFooterButton(cancelButton);
		MP_ModalDialog.addModalDialogObject(dateRangeModalDialog);
		MP_ModalDialog.showModalDialog(dateRangeModalDialog.getId());
		resetButtonItem = $("#" + compId + "resetDateRangeButton");
		resetButtonItem.removeClass("dyn-modal-button").addClass("recom-o2-reset-button");
	}else{
		MP_ModalDialog.showModalDialog(dateRangeModalDialog.getId());
		resetButtonItem = $("#" + compId + "resetDateRangeButton");
		resetButtonItem.removeClass("dyn-modal-button").addClass("recom-o2-reset-button");
	}
	$("#" + compId + "years,#" + compId + "months").on('input', function (e) {
		//disable character input into the date range - years and months fields.
		$("#" + compId + "years").keypress(function(key){
			if(key.charCode < 48 || key.charCode > 57) {
				return false;
			}
		});
		$("#" + compId + "months").keypress(function(key){
			if(key.charCode < 48 || key.charCode > 57) {
				return false;
			}
		});
		modifiedYearValue = parseInt($("#" + compId + "years").val());
		modifiedMonthValue = parseInt($("#" + compId + "months").val());
		var modified = self.isDaterangeModalModified(years, months, modifiedYearValue, modifiedMonthValue);
		if (modified) {
			$("#" + compId + "saveDateRangeButton").attr("disabled", false);
		} else {
			$("#" + compId + "saveDateRangeButton").attr("disabled", true);
		}
	});
};
/**
 * this functions checks if the inputs in modal window are modified
 * @params { number,number,number,number,number } previous value of years field, 
 * previous value of months field, current value of years field, current value of      * months *field
 * @return { boolean }
 */
RecommendationsO2Component.prototype.isDaterangeModalModified = function(years, months, modifiedYearValue, modifiedMonthValue){
	if(years === modifiedYearValue && months === modifiedMonthValue){
		return false;
	}
	else if(modifiedYearValue === 0 && modifiedMonthValue === 0){
		return false;
	}
	else if(isNaN(modifiedYearValue) || isNaN(modifiedMonthValue)){
		return false;
	}else{
		return true;
	}
};
/**
 * this functions retrieves the request structure required for 
 * preference update request(961205) with all the common fields populated.
 */
RecommendationsO2Component.prototype.getPreferenceUpdateRequestObject = function () {
	return {
		app_qual : 0,
		app : [],
		position_qual : 0,
		position : [],
		prsnl_qual : 1,
		prsnl : [{
				app_number : 600005,
				prsnl_id : this.getCriterion().provider_id,
				group_qual : 1,
				group : [{
						group_id : this.getGroupId(),
						view_name : "HEALTHMAINT",
						view_seq : 0,
						comp_name : "HEALTHMAINT",
						comp_seq : 0,
						pref_qual : 1,
						pref : [{
								pref_id : 0.0,
								pref_name : "",
								pref_value : "",
								sequence : 0,
								merge_id : 0.0,
								merge_name : "",
								active_ind : 1
							}
						]
					}
				]
			}
		]
	};
};
/**
 * this functions saves the date range value selected by user 
 * @params { number } date range value to be saved
 */
RecommendationsO2Component.prototype.saveDateRange = function(dateRangeValue, value){
	var category_mean = this.getCriterion().category_mean;
	var capTimer = new CapabilityTimer("CAP:MPG_Recommendations_O2_Time_Frame_Selector", category_mean);
	var component = this;
	var compId = this.getComponentId();
	var preferenceName = "TIME_RANGE_PENDING";
	var preferenceValue = "" + dateRangeValue + "";
		var blobIn = {
			"REQUESTIN" : component.getPreferenceUpdateRequestObject()
		};
		//Set the appropriate values for the request
		blobIn.REQUESTIN.prsnl[0].group[0].pref[0].pref_name = preferenceName;
		blobIn.REQUESTIN.prsnl[0].group[0].pref[0].pref_value = preferenceValue;
		var CPS_UPD_DETAIL_PREFS_REQUEST = 961205;
		var CPS_UPD_DETAIL_PREFS_TASK = 961205;
		var CPS_UPD_DETAIL_PREFS_APPLICATION = 962000;
		var scriptRequest = new ScriptRequest();
		scriptRequest.setProgramName("MP_EXEC_STD_REQUEST");
		scriptRequest.setParameterArray(["^MINE^", "^^", CPS_UPD_DETAIL_PREFS_APPLICATION, CPS_UPD_DETAIL_PREFS_TASK, CPS_UPD_DETAIL_PREFS_REQUEST]);
		scriptRequest.setDataBlob(MP_Util.enhancedStringify(blobIn));
		scriptRequest.setResponseHandler(function (scriptReply) {
			if (scriptReply.getStatus() === "S") {
				MP_ModalDialog.closeModalDialog(compId + "dateRangeModalDialog");
				component.m_sidePanel.hidePanel();
				component.refreshComponent();
			} else {
		if (value === component.DATE_RANGE_TRIGGER.MODAL_WINDOW) {
			var alert = $("#" + compId + "dateRangeErrorAlert");
			var text = component.m_i18nStrings.UNABLE_TO_SAVE_PREFS;
			alert.empty().append(component.getErrorAlert(component.m_alertType.ERROR, text, ""));
		} else {
			var dialogBodyHTML = "";
			var dateRangeErrorModalDialog = MP_ModalDialog.retrieveModalDialogObject("dateRangeErrorModalDialog");
			if (!dateRangeErrorModalDialog) {
				dateRangeErrorModalDialog = new ModalDialog("dateRangeErrorModalDialog").setHeaderTitle(i18n.ERROR_OCCURED).setIsBodySizeFixed(false); 
				dateRangeErrorModalDialog.setBodyDataFunction(function (modalObj) {
					var text = component.m_i18nStrings.UNABLE_TO_SAVE_PREFS;
					dialogBodyHTML = component.getErrorAlert(component.m_alertType.ERROR, text, "");
					dateRangeErrorModalDialog.setBodyHTML(dialogBodyHTML);
				});
				dateRangeErrorModalDialog.m_margins = {
					top : 25,
					right : 38,
					bottom : 5,
					left : 40
				};
				var closeButton = new ModalButton(compId + "closeDateRangeButton");
				closeButton.setText(i18n.CLOSE).setIsDithered(false).setCloseOnClick(true);
				dateRangeErrorModalDialog.addFooterButton(closeButton);
				MP_ModalDialog.addModalDialogObject(dateRangeErrorModalDialog);
				MP_ModalDialog.showModalDialog(dateRangeErrorModalDialog.getId());
			}
			else{
				MP_ModalDialog.showModalDialog(dateRangeErrorModalDialog.getId());
			}
		}
	}
		});
		scriptRequest.performRequest();
	capTimer.capture(); 
}; 
/**
 * this functions creates the date range text to be displayed on the custom button
 * @params { number,number }current value of years field, current value of months field
 * @return { string } date range text 
 */
RecommendationsO2Component.prototype.createDateRangeText = function(years, months){
	if(years === 0){
		return months + " " + this.m_i18nStrings.MONTHS;
	} 
	if(months === 0){
		return years + " " + this.m_i18nStrings.YEARS;
	}
	return years + " " + this.m_i18nStrings.YR + " " + months + " " + this.m_i18nStrings.MO;
};
/**
 * this functions attaches the daterange selector to the header of the component table * and attaches the event listeners for control buttons 
 */
RecommendationsO2Component.prototype.displayDateRangePreferenceSelector = function () {
	var self = this;
	var pendingFuturePref = this.getPendingDueDatePreference();
	var compID = this.getComponentId();
	var compNS = self.getStyles().getNameSpace();
	var recomObject = $("#recom-o2" + compID);
	var component = this;
	var headerElementsContainer = $(".header-elements-container");
	var $_btnCustom = null;
	var $_btnCustomDropDown = null;
	var dateRangeObj = "";
	var $_lookbackContainer = null;
	var $_btns = null;
	var $_btnCustomDropDown = null;
	var $_rootElement = $("#" + compNS + compID);
	headerElementsContainer = $($_rootElement.children().find(".header-elements-container"));
	if (!recomObject.length) {
		return;
	}
	var titleObj = recomObject.find(".sec-hd");
	if (!titleObj.length) {
		return;
	}
	var lookBackRangeSegmentedControl = new MPageUI.SegmentedControl();
	lookBackRangeSegmentedControl.setSelectMode(MPageUI.SEGMENTED_CONTROL_OPTIONS.SELECT_MODE.SINGLE);
	lookBackRangeSegmentedControl.addSegment({
		label : "6 " + self.m_i18nStrings.MONTHS,
		onSelect : function () {
				$_btnCustom.removeClass("active");
			self.saveDateRange(6, self.DATE_RANGE_TRIGGER.DEFAULT);
		},
		onDeselect : function () {},
		selected : pendingFuturePref === 6 ? true : false
	});
	lookBackRangeSegmentedControl.addSegment({
		label : "1 " + self.m_i18nStrings.YEARS,
		onSelect : function () {
				$_btnCustom.removeClass("active");
			self.saveDateRange(12, self.DATE_RANGE_TRIGGER.DEFAULT);
		},
		onDeselect : function () {},
		selected : pendingFuturePref === 12 ? true : false
	});
	lookBackRangeSegmentedControl.addSegment({
		label : "5 " + self.m_i18nStrings.YEARS,
		onSelect : function () {
				$_btnCustom.removeClass("active");
			self.saveDateRange(60, self.DATE_RANGE_TRIGGER.DEFAULT);
		},
		onDeselect : function () {},
		selected : pendingFuturePref === 60 ? true : false
	});
	var splitButton = new MPageUI.SplitButton();
	if (pendingFuturePref === 6 || pendingFuturePref === 12 || pendingFuturePref === 60 || pendingFuturePref === 120) {
		splitButton.setLabel("10 " + self.m_i18nStrings.YEARS);
		splitButton.addOptions([
		{label : self.m_i18nStrings.OTHERS,onSelect : function(){
						self.openDateRangeModalWindow(pendingFuturePref);
					}
		}]);
	} else {
		var months = 0;
		var years = 0;
		if (pendingFuturePref !== 6 && pendingFuturePref !== 12 && pendingFuturePref !== 60) {
			if (pendingFuturePref <= 24) {
				months = pendingFuturePref;
				years = 0;
			} else {
				months = pendingFuturePref % 12;
				years = Math.floor(pendingFuturePref / 12);
			}
		}
		var dateRangeText = self.createDateRangeText(years, months);
		splitButton.setLabel(dateRangeText);
		splitButton.addOptions([
		{label : "10 " + self.m_i18nStrings.YEARS, onSelect : function(){
						lookBackRangeSegmentedControl.deselectAllSegments();
						self.saveDateRange(120, self.DATE_RANGE_TRIGGER.DEFAULT);
					}
		},{type: MPageUI.MENU_OPTIONS.TYPE.SEPARATOR},
		{label : self.m_i18nStrings.OTHERS,onSelect : function(){
						lookBackRangeSegmentedControl.deselectAllSegments();
						self.openDateRangeModalWindow(pendingFuturePref);
					}
				}
			]);
	}
	splitButton.setLabelButtonClickCallback(function () {
		if ($_btnCustom.hasClass("btn")) {
			lookBackRangeSegmentedControl.deselectAllSegments();
			$_btnCustom.addClass("active");
			self.saveDateRange(120, self.DATE_RANGE_TRIGGER.DEFAULT);
		}
	});
	var dateRangeMarkUp = lookBackRangeSegmentedControl.render() + splitButton.render();
	dateRangeObj = "<div id='" + compID + "DateRangeSelector' class='" + compNS + "-date-range-selector'>&nbsp;";
	var dateRangeSelectorObj = $("#" + compID + "DateRangeSelector");
	if (dateRangeSelectorObj.length === 0) {
		dateRangeObj += dateRangeMarkUp + "</div>";
		headerElementsContainer.append(dateRangeObj);
	} else {
		dateRangeObj = $("#" + compID + "DateRangeSelector");
		dateRangeObj.empty().append(dateRangeMarkUp);
	}
	$_btnCustom = $("#" + splitButton.getLabelButton().getId());
	$_btnCustomDropDown = $("#" + splitButton.getDropdownButton().getId());
	if (pendingFuturePref !== 6 && pendingFuturePref !== 12 && pendingFuturePref !== 60) {
		$_btnCustom.addClass("active");
	}
	lookBackRangeSegmentedControl.attachEvents();
	splitButton.attachEvents();
	$_lookbackContainer = $("#" + compID + "DateRangeSelector");
	$_btns = $($_lookbackContainer.find(".btn"));
	$_btns.addClass("recom-o2-lookback-button");
	$_btnCustomDropDown.removeClass("btn dropdown-toggle").addClass(compNS + "-time-frame-drop-down");
	$(".caret").removeClass("caret").addClass(compNS + "-time-frame-caret");
};
/**
 * This method processes the reply of mp_get_hmi to
 * store the records in a list of schedule ids associated with series ids.
 * For Eg. [{SCHEDULE_ID:123.00,SERIES:[{SERIES_ID:123.00},{SERIES_ID:123.0},...]},{},...]
 * @param {Array} - List of recommendations
 */
RecommendationsO2Component.prototype.processAndSaveRecommendationsReply = function(recommendationsReply){
	var assignedRecommendations = [];
	var recLength = recommendationsReply.length;
	for(var recIndex = recLength; recIndex--;){
		
		//process only if SERIES ID exists i.e. the recommendation is not a free text one.
		if(recommendationsReply[recIndex].SERIES_ID){
			var scheduleFound = false; 
			for(var assignedRecIndex = assignedRecommendations.length; assignedRecIndex--;){
				
				//Check if the schedule id is already existing in the assigned list.
				if (assignedRecommendations[assignedRecIndex].SCHEDULE_ID === recommendationsReply[recIndex].SCHEDULE_ID) {
					var seriesFound = false;
					var seriesList = assignedRecommendations[assignedRecIndex].SERIES;
					
					//Check if the series id is already existing in the series object within a schedule
					for(var seriesIndex = seriesList.length; seriesIndex--;){
						if (seriesList[seriesIndex].SERIES_ID === recommendationsReply[recIndex].SERIES_ID) {
							seriesFound = true;
							break;
						}
					}
					//If the series id is not available under the schedule id, add the series id.
					if (!seriesFound) {
						assignedRecommendations[assignedRecIndex].SERIES.push({
							"SERIES_ID" : recommendationsReply[recIndex].SERIES_ID
						});
					}
					scheduleFound = true;
					break;
				}
			}
			//If the schedule id encountered is not available in the list, add a new object.
			if (!scheduleFound) {
				assignedRecommendations.push({
					"SCHEDULE_ID" : recommendationsReply[recIndex].SCHEDULE_ID,
					"SERIES" : [{"SERIES_ID" : recommendationsReply[recIndex].SERIES_ID}]
				});
			}
		}
	}
	//Set the formatted reply to the recommendations reply stored at class level.
	this.setRecommendationsDataReply(assignedRecommendations);
};

/**
 ** Override the preProcessing method of MPageComponent to fix an issue in the health maint cpm o1 component 
 */
RecommendationsO2Component.prototype.preProcessing = function () {
	this.m_patientDOB = this.getCriterion().getPatientInfo().getDOB();
	//Calls base class for future support
	var compMenu = new MPageUI.Menu();
	var compId = this.getComponentId();
	var menuId = "mainCompMenu" + this.getStyles().getId();
	var self = this;
	//Grab component menu
	compMenu = MP_MenuManager.getMenuObject(menuId);
	try{
	compMenu.m_activeInd = true;
	var customizeTableCols = "customizeTableColsItem" + menuId;
	this.m_customizeTableColsItem = new MenuSelection(customizeTableCols);
	this.m_customizeTableColsItem.setLabel(this.m_i18nStrings.CUSTOMIZE_TABLE_COLUMNS);
	this.m_customizeTableColsItem.setIsDisabled(true);
	this.m_customizeTableColsItem.setClickFunction(function () {
		self.customizeTableColumns();
	});
	compMenu.insertMenuItem(this.m_customizeTableColsItem, 0);
	}catch(err){}
};

/**
 * Function to create the modal dialog window when Customize table columns option is selected from the component menu.
 * @param {null}
 * @return {null}
 */
RecommendationsO2Component.prototype.customizeTableColumns = function () {
	var dialogBodyHTML = "";
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var self = this;
	var customizeTableDialog = MP_ModalDialog.retrieveModalDialogObject("customizeTableColumns");
	var resetButtonItem = null;

	if (!customizeTableDialog) {
		customizeTableDialog = new ModalDialog("customizeTableColumns").setHeaderTitle(this.m_i18nStrings.CUSTOM_COLUMNS).setIsBodySizeFixed(false);
		var componentTable = this.getComponentTable();
		var componentTableCols = componentTable.columns;
		var componentTableLength = componentTableCols.length;
		var recomColCount = 2;
		customizeTableDialog.setBodyDataFunction(function () {
			dialogBodyHTML = "<div id='errorAlert'></div>";
			dialogBodyHTML += "<div ><table id='customColumnsTable" + compId + "' class='" + compNS + "-custom-table' ><th class='" + compNS + "-table-header-show' >" + self.m_i18nStrings.SHOW + "</th><th class='" + compNS + "-table-header-column' >" + self.m_i18nStrings.COLUMN + "</th>";
			dialogBodyHTML += "<tr><td class='" + compNS + "-td'><input type='checkbox' checked disabled checked id='" + compId + componentTableCols[1].columnId + "'></input></td><td class='" + compNS + "-disabled'>" + componentTableCols[1].columnDisplay + "</td></tr>";
			//iterate till 2nd last column, so that favorite column is not added
			for (recomColCount = 2; recomColCount < componentTableLength; recomColCount++) {
				if(componentTableCols[recomColCount].columnId !== "FAVORITES"){
					var checked = self.isColumnChecked(recomColCount);
					if(checked){
						dialogBodyHTML += "<tr><td class='" + compNS + "-td'><input type='checkbox' checked id='"+ compId +componentTableCols[recomColCount].columnId +"'></input></td><td class='" + compNS + "-td'>"+ componentTableCols[recomColCount].columnDisplay +"</td></tr>";
					}else{
						dialogBodyHTML += "<tr><td class='" + compNS + "-td'><input type='checkbox' id='"+ compId +componentTableCols[recomColCount].columnId +"'></input></td><td class='" + compNS + "-td'>"+ componentTableCols[recomColCount].columnDisplay +"</td></tr>";
					}
				}
			}
			dialogBodyHTML += "</table></div>";
			customizeTableDialog.setBodyHTML(dialogBodyHTML);
		});
		customizeTableDialog.m_margins = {
			top : 25,
			right : 38,
			bottom : 5,
			left : 40
		};
		var saveButton = new ModalButton("saveCustomColumnsButton");
		saveButton.setText(i18n.SAVE).setIsDithered(true).setCloseOnClick(false);
		saveButton.setOnClickFunction(function () {
			self.saveSelectedColumns();
		});

		var cancelButton = new ModalButton("cancelCustomColumnsButton");
		cancelButton.setText(i18n.CANCEL).setIsDithered(false).setCloseOnClick(true);

		var resetButton = new ModalButton("resetCustomColumnsButton");
		resetButton.setText(this.m_i18nStrings.RESET).setIsDithered(false).setCloseOnClick(true);
		resetButton.setOnClickFunction(function () {
			self.resetColumnPreferences();
		});
		customizeTableDialog.addFooterButton(resetButton);
		customizeTableDialog.addFooterButton(saveButton);
		customizeTableDialog.addFooterButton(cancelButton);

		MP_ModalDialog.addModalDialogObject(customizeTableDialog);
		MP_ModalDialog.showModalDialog(customizeTableDialog.getId());
		resetButtonItem = $("#resetCustomColumnsButton");
		resetButtonItem.removeClass("dyn-modal-button").addClass(compNS + "-reset-button");
	} else {
		//When the modal dialog object is available, use the existing available object and not create a new one.
		MP_ModalDialog.showModalDialog(customizeTableDialog.getId());
		resetButtonItem = $("#resetCustomColumnsButton");
		resetButtonItem.removeClass("dyn-modal-button").addClass(compNS + "-reset-button");
	}
	$('#customColumnsTable' + compId).on('change', 'input[type=checkbox]', function () {
		var modified = self.isModalModified();
		if (modified) {
			$("#saveCustomColumnsButton").attr("disabled", false);
		} else {
			$("#saveCustomColumnsButton").attr("disabled", true);
		}
	});
};
/**
 * Function that returns if the content of modal dialog have been modified
 * @param {null}
 * @return {boolean} true or false based on whether content are modified or not
 */
RecommendationsO2Component.prototype.isModalModified = function () {
	var currentPref = {
		PRIORITY : true,
		FREQUENCY : true,
		DUE : true,
		REFERENCE : true
	};
	var compId = this.getComponentId();
	var componentTable = this.getComponentTable();
	var componentTableCols = componentTable.columns;
	var previousSavedPrefs = this.m_recomPrefObj;
		var tableCol = $("#" + compId + componentTableCols[2].columnId);
		if(!tableCol[0].checked){
			currentPref.PRIORITY = false;
		}
		tableCol = $("#" + compId + componentTableCols[3].columnId);
		if(!tableCol[0].checked){
			currentPref.FREQUENCY = false;
		}
		tableCol = $("#" + compId + componentTableCols[4].columnId);
		if(!tableCol[0].checked){
			currentPref.DUE = false;
		}
		tableCol = $("#" + compId + componentTableCols[5].columnId);
		if(!tableCol[0].checked){
			currentPref.REFERENCE = false;
		}
	if(previousSavedPrefs.savedColumnsObj.PRIORITY === currentPref.PRIORITY && previousSavedPrefs.savedColumnsObj.FREQUENCY === currentPref.FREQUENCY && previousSavedPrefs.savedColumnsObj.DUE === currentPref.DUE && previousSavedPrefs.savedColumnsObj.REFERENCE === currentPref.REFERENCE ){
		return false;
	}else{
		return true;
	}
};

/**
 * Function to reset user preferences for columns
 * This function will be called when the reset button on the modal dialog window is clicked. It resets the preferences to default to display all columns.
 * @param {null}
 * @return {null}
 */
RecommendationsO2Component.prototype.resetColumnPreferences = function () {
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var componentTable = this.getComponentTable();
	var componentTableCols = componentTable.columns;
	var colHeader = null;
	var currentCol = null;

	//reset preferences
	this.m_recomPrefObj.savedColumnsObj = {
		PRIORITY : true,
		FREQUENCY : true,
		DUE : true,
		REFERENCE : true
	};

	// Priority
	colHeader = this.m_$tableView.find("#" + "recom-o2" + compId + "columnHeaderPRIORITY");
	currentCol = componentTableCols[2];
	currentCol.setCustomClass(compNS + "-priority" );
	colHeader.removeClass("hidden");

	// Frequency
	colHeader = this.m_$tableView.find("#" + "recom-o2" + compId + "columnHeaderFREQUENCY");
	currentCol = componentTableCols[3];
	currentCol.setCustomClass(compNS + "-frequency");
	colHeader.removeClass("hidden");

	// Due Date
	colHeader = this.m_$tableView.find("#" + "recom-o2" + compId + "columnHeaderDUE");
	currentCol = componentTableCols[4];
	currentCol.setCustomClass(compNS + "-due");
	colHeader.removeClass("hidden");

	//Reference
	colHeader = this.m_$tableView.find("#" + "recom-o2" + compId + "columnHeaderREFERENCE_TEXT");
	currentCol = componentTableCols[5];
	currentCol.setCustomClass(compNS + "-reference-text");
	colHeader.removeClass("hidden");
	componentTable.refresh();
	this.setPreferencesObj(this.m_recomPrefObj);
	this.savePreferences(true);
};

/**
 * Function to save preferences based on user selection on the modal dialog window.
 * This function will be called when the save button on the modal dialog window is clicked.
 * @param {null}
 * @return {null}
 */
RecommendationsO2Component.prototype.saveSelectedColumns = function () {
	var self = this;
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var componentTable = this.getComponentTable();
	var componentTableCols = componentTable.columns;
	var componentTableLength = componentTableCols.length;
	var previousSavedPrefs = this.m_recomPrefObj;
	var colHeader = null;
	var currentCol = null;
	var category_mean = this.getCriterion().category_mean;
	var capTimer = new CapabilityTimer("CAP:MPG_Recommendations_O2_Add_Remove_Column", category_mean);
	for(var i=2;i<componentTableLength ;i++){
		if(componentTableCols[i].columnId !== "FAVORITES"){
			var tableCol = $("#" + compId + componentTableCols[i].columnId);
			var columnId = tableCol[0].id;
			if(tableCol[0].checked === false){
				switch(columnId){
				case compId+"PRIORITY": this.m_recomPrefObj.savedColumnsObj.PRIORITY = false;
					break;
				case compId+"FREQUENCY": this.m_recomPrefObj.savedColumnsObj.FREQUENCY = false;
					break;
				case compId+"DUE": this.m_recomPrefObj.savedColumnsObj.DUE = false;
					break;
				case compId+"REFERENCE_TEXT": this.m_recomPrefObj.savedColumnsObj.REFERENCE = false;
					break;
			}
			}else{
				switch(columnId){
					case compId+"PRIORITY": this.m_recomPrefObj.savedColumnsObj.PRIORITY = true;
						break;
					case compId+"FREQUENCY": this.m_recomPrefObj.savedColumnsObj.FREQUENCY = true;
						break;
					case compId+"DUE": this.m_recomPrefObj.savedColumnsObj.DUE = true;
						break;
					case compId+"REFERENCE_TEXT": this.m_recomPrefObj.savedColumnsObj.REFERENCE = true;
					break;
				}
			}
		}
	}
	try {
		this.setPreferencesObj(this.m_recomPrefObj);
		this.savePreferences(true);

		// Priority
		if (self.m_recomPrefObj.savedColumnsObj.PRIORITY === false) {
			colHeader = $("#" + compNS + compId + "columnHeaderPRIORITY");
			currentCol = componentTableCols[2];
			currentCol.setCustomClass("hidden");
			colHeader.addClass("hidden");
		} else {
			colHeader = $("#" + compNS + compId + "columnHeaderPRIORITY");
			currentCol = componentTableCols[2];
			currentCol.setCustomClass(compNS + "-priority");
			colHeader.removeClass("hidden");
		}

		// Frequency
		if (self.m_recomPrefObj.savedColumnsObj.FREQUENCY === false) {
			colHeader = $("#" + compNS + compId + "columnHeaderFREQUENCY");
			currentCol = componentTableCols[3];
			currentCol.setCustomClass("hidden");
			colHeader.addClass("hidden");
		} else {
			colHeader = $("#" + compNS + compId + "columnHeaderFREQUENCY");
			currentCol = componentTableCols[3];
			currentCol.setCustomClass(compNS + "-frequency");
			colHeader.removeClass("hidden");
		}

		// Due Date
		if (self.m_recomPrefObj.savedColumnsObj.DUE === false) {
			colHeader = $("#" + compNS + compId + "columnHeaderDUE");
			currentCol = componentTableCols[4];
			currentCol.setCustomClass("hidden");
			colHeader.addClass("hidden");
		} else {
			colHeader = $("#" + compNS + compId + "columnHeaderDUE");
			currentCol = componentTableCols[4];
			currentCol.setCustomClass(compNS + "-due");
			colHeader.removeClass("hidden");
		}
		// Reference 
		if (self.m_recomPrefObj.savedColumnsObj.REFERENCE === false) {
			colHeader = $("#" + compNS + compId + "columnHeaderREFERENCE_TEXT");
			currentCol = componentTableCols[5];
			currentCol.setCustomClass("hidden");
			colHeader.addClass("hidden");
		} else {
			colHeader = $("#" + compNS + compId + "columnHeaderREFERENCE_TEXT");
			currentCol = componentTableCols[5];
			currentCol.setCustomClass(compNS + "-reference-text");
			colHeader.removeClass("hidden");
		}
		MP_ModalDialog.closeModalDialog("customizeTableColumns");
		componentTable.refresh();
	}catch(err){
		var alert = $("#errorAlert");
		var text = this.m_i18nStrings.UNABLE_TO_SAVE_PREFS;
		alert.empty().append(self.getErrorAlert(this.m_alertType.ERROR,text,""));
		this.m_recomPrefObj.savedColumnsObj.EXPECTATION = previousSavedPrefs.savedColumnsObj.EXPECTATION;
		this.m_recomPrefObj.savedColumnsObj.PRIORITY = previousSavedPrefs.savedColumnsObj.PRIORITY;
		this.m_recomPrefObj.savedColumnsObj.FREQUENCY = previousSavedPrefs.savedColumnsObj.FREQUENCY;
		this.m_recomPrefObj.savedColumnsObj.DUE = previousSavedPrefs.savedColumnsObj.DUE;
		this.m_recomPrefObj.savedColumnsObj.REFERENCE = previousSavedPrefs.savedColumnsObj.REFERENCE;
	}
	capTimer.capture(); 
};

/**
 * Function to retrieve user preferences checkbox to display in modal dialog face-up
 * @param {null}
 * @return {boolean} preference value for the specified column
 */
RecommendationsO2Component.prototype.isColumnChecked = function(index) {
	switch(index){
		case this.m_defaultCols.PRIORITY : return this.m_recomPrefObj.savedColumnsObj.PRIORITY;
		case this.m_defaultCols.FREQUENCY: return this.m_recomPrefObj.savedColumnsObj.FREQUENCY;
		case this.m_defaultCols.DUE: return this.m_recomPrefObj.savedColumnsObj.DUE;
		case this.m_defaultCols.REFERENCE: return this.m_recomPrefObj.savedColumnsObj.REFERENCE;
		default: return true;
	}

};

/**
 * Function to return alert string in case of failure and saving of user preferences.
 * @param {number} number to select type of alert
 * @return {string} alert markup string
 */
RecommendationsO2Component.prototype.getErrorAlert = function (value, primaryText, secondaryText) {
  var markup = "";
  var banner = new MPageUI.AlertBanner();
  switch (value) {
    case this.m_alertType.ERROR:
      banner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
      break;
    case this.m_alertType.WARNING:
      banner.setType(MPageUI.ALERT_OPTIONS.TYPE.WARNING);
      break;
    case this.m_alertType.INFO:
      banner.setType(MPageUI.ALERT_OPTIONS.TYPE.INFO);
      break;
    default:
      banner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
      break;
  }
  primaryText = primaryText?primaryText:"Please try again";
  secondaryText = secondaryText?secondaryText:"";
  
  banner.setPrimaryText(primaryText);
  banner.setSecondaryText(secondaryText);
    
  markup = banner.render();
  return markup;
};
/**
 ** Override the postProcessing method of MPageComponent to manipulate the + symbol
 ** next to the component header based on the CPW preference.
 */
RecommendationsO2Component.prototype.postProcessing = function () {
	MPageComponent.prototype.postProcessing.call(this);
	var componentStyles = this.getStyles();
	var componentHeaderContainer = $('#' + componentStyles.getId()).find('span.' + componentStyles.getTitle());

	//Handle the component level refresh
	//Remove the + symbol from the header if already available
	if (componentHeaderContainer.find('a.add-plus')) {
		componentHeaderContainer.find('a.add-plus').addClass('hidden');
	}
	//if the preference is set, add the plus symbol to the component header
	if (this.getAllowAdditionIndicator()) {
		this.setPlusAddEnabled(this.getAllowAdditionIndicator());
		this.getRenderStrategy().addComponentSection(componentHeaderContainer, this.getRenderStrategy().createPlusAddControl());
	}
	if (this.getComponentTable()) {
		this.m_customizeTableColsItem.setIsDisabled(false);
	}
};

/*
 * This will be called on hovering over the modified expectation.
 * The information related to the respective column will he taken based on the modified flag.
 */
RecommendationsO2Component.prototype.onHovering = function(data) {

	var text = null;

	if (data.COLUMN_ID === "EXPECTATION_NAME" && data.RESULT_DATA.HAS_EXP_MODIFY_IND) {
		text = data.RESULT_DATA.EXP_HOVER;
	}
	else if (data.COLUMN_ID === "FREQUENCY" && data.RESULT_DATA.HAS_FREQ_MODIFY_IND) {
		text = data.RESULT_DATA.FREQ_HOVER;
	}
	else if (data.COLUMN_ID === "DUE" && data.RESULT_DATA.HAS_DUE_DATE_MODIFY_IND) {
		text = data.RESULT_DATA.DUE_DATE_HOVER;
	}
	return text;
};

/*
 * Used to build the "within" string that displays in the preview pane.
 * Based on mpage-core GetDateDiffString.
 * Returns difference between the begin and end date based on rule of 2 if specificUnit is not specified.
 * If specificUnit is specified, returns the difference between begin and end dates in that units only.
 */
RecommendationsO2Component.prototype.GetDateDiffString = function (beginDate, endDate, specificUnit) {

	//	function GetDateDiffString(beginDate, endDate, mathFlag, abbreviateFlag) {
	var mathFlag = 1;
	var abbreviateFlag = false;
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
	if (mathFlag === 0) {
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
	
	//If the difference is required in specific units, return the difference in that units only.
	if (specificUnit) {
		switch (specificUnit) {
		case "HOURS":
			return valHours;
		case "DAYS":
			return valDays;
		case "WEEKS":
			return valWeeks;
		case "MONTHS":
			return valMonths;
		case "YEARS":
			return valYears;
		}
	}
	if (comparisonFunc(valWeeks, 2)) { //Less than 2 weeks, display number of days. Use "days".
		returnVal = abbreviateFlag ? (i18nCore.WITHIN_DAYS.replace("{0}", valDays)) : (i18nCore.X_DAYS.replace("{0}", valDays));
	}
	else if (comparisonFunc(valMonths, 2)) {//Less than 2 months, display number of weeks. Use abbreviation of "wks".
		returnVal = abbreviateFlag ? (i18nCore.WITHIN_WEEKS.replace("{0}", valWeeks)) : (i18nCore.X_WEEKS.replace("{0}", valWeeks));
	}
	else if (comparisonFunc(valYears, 2)) {//Less than 2 years, display number of months. Use abbreviation of "mos".
		returnVal = abbreviateFlag ? (i18nCore.WITHIN_MONTHS.replace("{0}", valMonths)) : (i18nCore.X_MONTHS.replace("{0}", valMonths));
	}
	else {//Over 2 years, display number of years.  Use abbreviation of "yrs".
		returnVal = abbreviateFlag ? (i18nCore.WITHIN_YEARS.replace("{0}", valYears)) : (i18nCore.X_YEARS.replace("{0}", valYears));
	}

	return (returnVal);
};

/**
 * This function will return the request structure of the passed in request number
 * 
 * @param  {number} requestNumber request number for which request structure should be returned
 *     Currently this function returns request structure for following request numbers
 *     966321
 *     966325
 * @return {object} request structure of the passed in request number
 */
RecommendationsO2Component.prototype.getScriptRequestStructure = function (requestNumber) {

	if (typeof requestNumber !== "number") {
		throw new Error("Invalid parameter passed to getScriptRequestStructure function");
	}

	var requestStructure = null;

	switch (requestNumber) {
	case 966321:
		requestStructure = {
			REQUESTIN: {
				QUAL: [],
				ALLOW_RECOMMENDATION_SERVER_IND: 0
			}
		};
		break;
	case 966325:
		requestStructure = {
			REQUESTIN: {
				DUE_ACTIONS: [],
				POSTPONE_ACTIONS: [],
				CANCEL_ACTIONS: [],
				SATISFY_ACTIONS: [],
				FREQUENCY_ACTIONS: [],
				DUE_DATE_ACTIONS: [],
				ASSIGN_ACTIONS: [],
				UNDO_ACTIONS: [],
				ASSIGN_ACTION_OVERRIDE_CNT: 0
			}
		};
		break;
	case 115467:
		requestStructure = {
			REQUESTIN : {
				PROCEDURES : [{
						PROVIDERS : [],
						COMMENTS : [],
						MODIFIER_GROUPS : [],
						DIAGNOSIS_GROUPS : [],
						PROCEDURE_ID : 0.0,
						VERSION : 0,
						ENCOUNTER_ID : this.getCriterion().encntr_id,
						NOMENCLATURE_ID : 0.0,
						FREE_TEXT : "",
						PERFORMED_DT_TM : "",
						PERFORMED_DT_TM_PREC : 0,
						MINUTES : 0,
						PRIORITY : 0,
						ANESTHESIA_CD : 0.0,
						ANESTHESIA_MINUTES : 0,
						TISSUE_TYPE_CD : 0.0,
						LOCATION_ID : 0.0,
						FREE_TEXT_LOCATION : "",
						FREE_TEXT : "",
						NOTE : "",
						RANKING_CD : 0.0,
						CLINICAL_SERVICE_CD : 0.0,
						CLINICAL_SERVICE_CD : 0.0,
						ACTIVE_IND : 1,
						END_EFFECTIVE_DT_TM : "",
						CONTRIBUTOR_SYSTEM_CD : 0.0,
						PROCEDURE_TYPE : 2,
						SUPPRESS_NARRATIVE_IND : 0,
						PERFORMED_DT_TM_PREC_CD : 0.0,
						LATERALITY_CD : 0.0
					}
				]
			}
		};
		break;
	}

	return requestStructure;
};

/* This method will return a new object which should be populated for adding a new expectation

	1 assign_actions[*]
		2 person_id = f8				;Required
		2 expect_id = f8				;Required
		2 step_id = f8					;Required
		2 on_behalf_of_prsnl_id = f8	;Optional
		2 reason_cd = f8				;Optional
		2 comment = vc					;Optional
		2 expectation_ftdesc = vc		;Required if expect_id = 0 and step_id = 0, otherwise ignored
		2 frequency_value = i4			;Optional, will trigger a frequency_action
		2 frequency_unit_cd = f8		;Optional, will trigger a frequency_action
		2 new_due_dt_tm = dq8			;Optional, will trigger a due_date_action
		2 prev_frequency_val = i4		;Optional, will trigger a frequency_action
		2 prev_frequency_unit_cd = f8	;Optional, will trigger a frequency_action
*/
RecommendationsO2Component.prototype.getAssignActionObject = function() {

	return {
		PERSON_ID: 0.0,
		EXPECT_ID: 0.0,
		STEP_ID: 0.0,
		EXPECTATION_FTDESC: "",
		ON_BEHALF_OF_PRSNL_ID: 0.0,
		REASON_CD: 0.0,
		COMMENT: "",
		FREQUENCY_VALUE: 0,
		FREQUENCY_UNIT_CD: 0.0,
		NEW_DUE_DT_TM: "",
		PREV_FREQUENCY_VALUE: 0,
		PREV_FREQUENCY_UNIT_CD: 0.0
	};
};

/*
 * This method will be called with an array of expectations that needs to be added for the patient profile
 *
 * @param checkedExpectations - An array containing all the expectations which needs to be saved
 *
 * @return - The request structure in JSON format which will be used while setting the blob in data
*/
RecommendationsO2Component.prototype.getAddExpectationsBlobIn = function(checkedExpectations) {

	if(!checkedExpectations || !checkedExpectations.length){
		throw new Error("Invalid parameter passed in to getAddExpectationsBlobIn function");
	}

	// Get the request structure object
	var addRequestStructure = this.getScriptRequestStructure(966325);

	var reasonCodeValue = this.getReasonOnAddition();
	var commentText = this.getCommentOnAddition();

	for (var i = checkedExpectations.length; i--;) {

		// Delete the temporary id which was created to uniquely identify the expectation as this is not part of request structure
		delete checkedExpectations[i].RECOMMENDATION_TEMP_ID;

		// Set reason and comment. Reason & Comment will be same for all expectations that we are adding
		checkedExpectations[i].REASON_CD = reasonCodeValue;
		checkedExpectations[i].COMMENT = commentText;
	}

	//Set the array to 966325 request structure object
	addRequestStructure.REQUESTIN.ASSIGN_ACTIONS = checkedExpectations;
	addRequestStructure.REQUESTIN.ASSIGN_ACTION_OVERRIDE_CNT = this.getActionOverrideCount();
	
	return JSON.stringify(addRequestStructure).replace(/\\n/g,"\n");
};

/*
 * This method will be called when the save button is cliced in Add new expectation modal dialog
*
* @param checkedExpectations - An array containing all the expectations which needs to be saved
*/
RecommendationsO2Component.prototype.saveExpectations = function(checkedExpectations) {

	if(!checkedExpectations || !checkedExpectations.length){
		throw new Error("Invalid parameter passed in to saveExpectations function");
	}

	//Reset the 'save' button to dithered state and close the add recommendations window.
	var addRecommendationsWindow = MP_ModalDialog.retrieveModalDialogObject("addRecommendation");
	addRecommendationsWindow.setFooterButtonDither("addRecButton", true);
	
	//Check if any modifications are done in the frequency or due date values.
	for(var i = checkedExpectations.length; i--;){
		var curentAssignedDate = checkedExpectations[i].NEW_DUE_DT_TM;
		if(checkedExpectations[i].NEW_DUE_DT_TM){
			if(typeof checkedExpectations[i].NEW_DUE_DT_TM !== "string"){
				//Make sure not to check the time considering the time at the addition of expectation to the selected list and
				// the time at the saving action.
				var dateForComparision = new Date(curentAssignedDate.getFullYear(),curentAssignedDate.getMonth(),curentAssignedDate.getDate());
				var currentDate = new Date();
				var currentDateForComparision = new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate());
				if(dateForComparision.getTime() === currentDateForComparision.getTime()){
					checkedExpectations[i].NEW_DUE_DT_TM = "";
				}
				else{
					checkedExpectations[i].NEW_DUE_DT_TM = JSON.stringify(checkedExpectations[i].NEW_DUE_DT_TM ).replace(/"/g, "");	
					this.incrementActionOverrideCount();
				}
			}
			else{
				this.incrementActionOverrideCount();
			}
		}
		
		if(checkedExpectations[i].FREQUENCY_VALUE !== 0.0){
			this.incrementActionOverrideCount();
		}
	}
	var self = this;
	var scriptRequest = new ScriptRequest();

	scriptRequest.setProgramName("MP_ADD_RECOMMENDATIONS");
	scriptRequest.setParameterArray(["^MINE^"]);
	scriptRequest.setDataBlob(this.getAddExpectationsBlobIn(checkedExpectations));
	scriptRequest.setResponseHandler(function(scriptReply) {
		if (scriptReply.getStatus() === "S") {

			//clear the data stored at the constructor level which will not be reused.
			self.setSelectedFreeTextExpectationsList([]);
			self.setSelectedExpectationsList([]);
			self.setExpectationsWithFixedDaysFrequency([]);
			
			// Clear the Override counter so that next time user clicks save, we don't use stale data
			self.setActionOverrideCount(0);
			
			// Clear the comments and reason value entered previously
			self.setCommentOnAddition("");
			self.setReasonOnAddition(0.0);
			
			//close the add recommendations modal window.
			MP_ModalDialog.closeModalDialog("addRecommendation");
			// Retrieve the data again and refresh the component
			self.retrieveComponentData();
		} else {
			//Show an inline error message informing that system failed to save the expectations.
			var saveFailureMsgContainer = $('.recom-o2-save-failure-msg');
			if(saveFailureMsgContainer.hasClass('hidden')){
				var saveErrorHTML = MP_Core.generateUserMessageHTML("error", self.m_i18nStrings.ADD_RECC_FAILED_TITLE, self.m_i18nStrings.ADD_RECC_FAILED_TEXT, "recom-o2-save-failure");
				saveFailureMsgContainer.empty().html(saveErrorHTML);
				saveFailureMsgContainer.removeClass('hidden');
			}
			addRecommendationsWindow.setFooterButtonDither("addRecButton", false);
		}
	});
	scriptRequest.performRequest();
};

/*
 * Determines if the passed in expectation has a variable/seasonal/one-time-only frequency or actual frquency value
 *
 * @param {number} expectationObj - The expectation object for which frequency type should be determined
 *
 * @return {object} Object with 2 properties
 * Property name - frequencyType
 *		0 - seasonal
 *		1 - variable
 *		2 - one time only
 *		3 - actual value
 *
 * Property name - frequencyValue
 * 		The actual value in days. Should only be set if frequencyType is set to 3
 */
RecommendationsO2Component.prototype.determineFrequencyType = function(seriesID) {

	// Update the parameter check
	if (typeof seriesID !== "number") {
		throw new Error("Invalid parameter passed in to determineFrequencyType function");
	}

	var allExpectations = this.getAllAvailableExpectations().SCHED;
	var foundSeriesID = false;
	var expectationObj;

	for (var schedIndex = allExpectations.length; schedIndex--;) {
		if (allExpectations[schedIndex].EXPECT_SCHED_TYPE_FLAG !== 1) {
			for (var seriesIndex = allExpectations[schedIndex].SERIES.length; seriesIndex--;) {
				if(allExpectations[schedIndex].SERIES[seriesIndex].EXPECT_SERIES_ID === seriesID) {
					// If found, save the expectation object and break out of $.each
					foundSeriesID = true;
					expectationObj = allExpectations[schedIndex].SERIES[seriesIndex].EXPECT[0];
					break;
				}
			}
			if(foundSeriesID) {
				//Break out of for loop since expectation object is already saved
				break;
			}
		}
	}
	
	if (typeof expectationObj === "undefined") {
		throw new Error("Invalid seriesID passed to determineFrequencyType function");
	}

	// Create return object
	var frequencyObject = {
		frequencyType: -1,
		frequencyInDays: -1
	};

	// First check if the expectation's frequency is seasonal and return if found that frequency is seasonal
	for (var i = expectationObj.STEP.length; i--;) {
		if (expectationObj.STEP[i].START_TIME_OF_YEAR > 0 || expectationObj.STEP[i].END_TIME_OF_YEAR > 0) {
			// Set frequency type to 0 and return 
			frequencyObject.frequencyType = this.FREQUENCY_TYPE.SEASONAL;
			return frequencyObject;
		}
	}

	var frequencyValue = 0;
	var foundSatisfierDuration = false;
	var satisfiers = expectationObj.SAT;

	for (i = satisfiers.length; i--;) {
		if (foundSatisfierDuration === false && satisfiers[i].SATISFIED_DURATION > 0) {
			// Once a satisifer's duration is found save it and use for comparison
			frequencyValue = satisfiers[i].SATISFIED_DURATION;
			foundSatisfierDuration = true;
		}
		if (foundSatisfierDuration === true) {
			if (satisfiers[i].SATISFIED_DURATION !== frequencyValue && satisfiers[i].SATISFIED_DURATION !== 0) {
				// Satisfier duration varies from one satisfier to another, return as variable
				frequencyObject.frequencyType = this.FREQUENCY_TYPE.VARIABLE;
				return frequencyObject;
			}
		}
	}

	if (foundSatisfierDuration === true) {
		// At least one expectation is having satisfied_duration greater than 0, return that value
		frequencyObject.frequencyType = this.FREQUENCY_TYPE.FIXED_NO_OF_DAYS;
		frequencyObject.frequencyInDays = frequencyValue;
	} else {
		// If all the satisfiers are having satisfied_duration of 0, then the expectation is one time only
		frequencyObject.frequencyType = this.FREQUENCY_TYPE.ONE_TIME_ONLY;
	}

	return frequencyObject;
};

/*
 * Returns frequencyValue, frequencyMeaning & frequencyCodeValue wrapped in an object
 *
 * @param {number} inputFrequency - The actual frequency in days
 *
 */
RecommendationsO2Component.prototype.formatFrequency = function(inputFrequency) {

	if (typeof inputFrequency !== "number") {
		throw new Error("Invalid parameter passed in to formatFrequency function");
	}
	
	var ONE_WEEK_IN_DAYS = 7;
	var TWO_WEEKS_IN_DAYS = 14;
	var ONE_MONTH_IN_DAYS = 30;
	var TWO_MONTHS_IN_DAYS = 60;
	var ONE_YEAR_IN_DAYS = 365;
	var TWO_YEARS_IN_DAYS = 730;

	// Create a return object
	var formattedFrequency = {
		frequencyValue: 0,
		frequencyMeaning: "",
		frequencyCodeValue: 0.0
	};

	// Apply rule of 2
	if (inputFrequency < TWO_WEEKS_IN_DAYS) {
		formattedFrequency.frequencyValue = inputFrequency;
		formattedFrequency.frequencyMeaning = "DAYS";
	} else if (inputFrequency < TWO_MONTHS_IN_DAYS) {
		formattedFrequency.frequencyValue = Math.floor(inputFrequency / ONE_WEEK_IN_DAYS);
		formattedFrequency.frequencyMeaning = "WEEKS";
	} else if (inputFrequency < TWO_YEARS_IN_DAYS) {
		formattedFrequency.frequencyValue = Math.floor(inputFrequency / ONE_MONTH_IN_DAYS);
		formattedFrequency.frequencyMeaning = "MONTHS";
	} else {
		formattedFrequency.frequencyValue = Math.floor(inputFrequency / ONE_YEAR_IN_DAYS);
		formattedFrequency.frequencyMeaning = "YEARS";
	}

	var frequencyCodeValues = this.getTimeUnitsCodeSet();

	for (var i = frequencyCodeValues.length; i--;) {
		if (frequencyCodeValues[i].FREQUENCY_MEANING === formattedFrequency.frequencyMeaning) {
			formattedFrequency.frequencyCodeValue = frequencyCodeValues[i].FREQUENCY_CD;
			break;
		}
	}

	return formattedFrequency;
};

/**
 * Adds click event handlers for Modify, Save and Cancel buttons in the side panel
 * @param {string} sidePanelHtml    the html code for the side panel
 * @param {string} modifyButtonHTML the html code for modify button
 * @param {string} dataObject the data object associated with the selected expectation
 * @param {string} popuphtml the html code that should be used to set in the popup for actions button
 */
RecommendationsO2Component.prototype.addEventHandlersForSidePanelActions = function (sidePanelHtml, modifyButtonHTML, dataObject, popupHtml) {

	var self = this;
	var compID = this.getComponentId();
	var recomID = dataObject.RECOMMENDATION_ID;

	//Add click event handler for view reference text link
	this.m_$sidePanelContainer.on("click", "#" + compID + "referenceText", function () {
		var entityName = $(this).attr("parent_entity_name");
		var entityId = $(this).attr("parent_entity_id");
		var headerTitle = $(this).attr("header_title");
		var referenceTextSuccess = true;
		self.m_viewReferenceTextObj.setWindowHeader(headerTitle);
		self.m_viewReferenceTextObj.setEntityName(entityName);
		self.m_viewReferenceTextObj.setEntityId(parseInt(entityId));
		self.m_viewReferenceTextObj.setErrorMethod(self.createReferenceTextAlert);
		self.m_viewReferenceTextObj.viewReferenceText();
		self.referenceTextCapTimer.capture();
	});
	// Add click event handler for Modify button, create modify UI on click of Modify button.
	this.m_$sidePanelContainer.on("click", "#modifyRecomButton" + compID, function () {
		// Don't do anything if the side panel is already loading
		if (!$(this).hasClass("disabled") && !self.m_isSidePanelLoading) {

			self.m_currentAction = self.RECOMMENDATION_ACTION.MODIFY;

			// Set basic fields in a new object which will be needed for Modify functionality
			self.m_modifyObject = {
				GROUP_NAME: dataObject.GROUP_NAME,
				RECOMMENDATION_ID: dataObject.RECOMMENDATION_ID,
				FREQUENCY_VALUE: dataObject.FREQ_VALUE,
				FREQ_UNIT_DISP: dataObject.FREQ_UNIT_DISP,
				DUE_DATE_UTC: dataObject.DUE_DATE_UTC,
				FREQUENCY_HISTORY: dataObject.FREQ_HIST
			};

			// Retrieve data if it's not available at the constructor level
			if (!self.getCurrentProviderName().length || !self.getReasonCodeSet().length || !self.getTimeUnitsCodeSet().length) {

				// Show Preloader and set side panel loading indicator to true
				self.m_sidePanel.setContents("<div class = 'recom-o2-modify-pre-loader'></div>");
				self.m_isSidePanelLoading = true;

				var recommendationsDataRequest = new ScriptRequest();
				recommendationsDataRequest.setProgramName("mp_get_data_add_expectation");
				// Set last parameter as 1 to retrieve provider name, reasons and frequency code set				
				recommendationsDataRequest.setParameterArray(["^MINE^", self.getCriterion().provider_id + ".0", 1]);
				recommendationsDataRequest.setResponseHandler(function (replyObj) {
					self.saveCodeSetData(replyObj);
					self.renderModifyExpectation();
					self.m_sidePanel.expandSidePanel();
					self.m_sidePanel.m_cornerCloseButton.hide();

					self.m_isSidePanelLoading = false;
				});
				recommendationsDataRequest.performRequest();
			} else {
				self.renderModifyExpectation();
				self.m_sidePanel.expandSidePanel();
				self.m_sidePanel.m_cornerCloseButton.hide();
			}
		}
	});

	this.m_$sidePanelContainer.on("click", "#actionsRecomButton" + compID, function () {

		if (!$(this).hasClass("disabled") && !self.m_isSidePanelLoading) {
			self.getPopupObject().toggle();
			self.attachPopupHandler(dataObject);
		}
	});

	// Add click event handler for Save button - Call recommendations script to save the changes
	this.m_$sidePanelContainer.on("click", "#saveRecomButton" + recomID + compID, function () {

		var categoryMean = self.getCriterion().category_mean;
		var modifyExpectationCapTimer = null;
		var satisfyExpectationCapTimer = null;
		var undoExpectationActionCapTimer = null;

		if ($(this).hasClass("disabled") !== true) {

			self.removeSidePanelErrorMessage();

			switch (self.m_currentAction) {
			case self.RECOMMENDATION_ACTION.MODIFY:
				self.modifyExpectation();
				modifyExpectationCapTimer = new CapabilityTimer("CAP:MPG_Recommendations_O2_Modify", categoryMean);
				if (modifyExpectationCapTimer) {
					modifyExpectationCapTimer.addMetaData("rtms.legacy.metadata.1", "Modify Recommendation");
					modifyExpectationCapTimer.capture();
				}
				break;
			case self.RECOMMENDATION_ACTION.EXPIRE:
			case self.RECOMMENDATION_ACTION.POSTPONE:
			case self.RECOMMENDATION_ACTION.REFUSE:
			case self.RECOMMENDATION_ACTION.MANUAL_SATISFY:
				self.satisfyExpectation();

				satisfyExpectationCapTimer = new CapabilityTimer("CAP:MPG_Recommendations_O2_Manual_Satisfiers", categoryMean);
				if (satisfyExpectationCapTimer) {
					satisfyExpectationCapTimer.addMetaData("rtms.legacy.metadata.1", "Satisfy Recommendation");
					satisfyExpectationCapTimer.capture();
				}
				break;
			case self.RECOMMENDATION_ACTION.UNDO:
				self.undoExpectationAction($(this));
				
				undoExpectationActionCapTimer = new CapabilityTimer("CAP:MPG_Recommendations_O2_Undo_satisfier", categoryMean);
				if (undoExpectationActionCapTimer) {
					undoExpectationActionCapTimer.addMetaData("rtms.legacy.metadata.1", "Undo Recommendation Action");
					undoExpectationActionCapTimer.capture();
				}
				break;
			case self.RECOMMENDATION_ACTION.SYSTEM_SATISFY_PROCEDURE:
				self.chartProcedureSatisfier($(this));
				var procedureSatisfierCapTimer = new CapabilityTimer("CAP:MPG_Recommendations_O2_Procedure_Satisfier", categoryMean);
				if (procedureSatisfierCapTimer) {
					procedureSatisfierCapTimer.addMetaData("rtms.legacy.metadata.1", "Procedure Satisfier Action");
					procedureSatisfierCapTimer.capture();
				}
				break;
			}
		}
	});

	// Add click event handler for Cancel button - Show the close button, Clear the Modify Indicators and set side panel contents to due date graph 
	this.m_$sidePanelContainer.on("click", "#cancelButton" + recomID + compID, function () {

		self.m_currentAction = self.RECOMMENDATION_ACTION.NO_ACTION;
		self.removeSidePanelErrorMessage();

		self.m_$sidePanelContainer.find("#modifyContainer" + recomID + compID).off();
		self.m_$sidePanelContainer.find("#actionContainer" + recomID + compID).off();
		self.m_$sidePanelContainer.find("#undoActionContainer" + recomID + compID).off();
		
		self.m_sidePanel.m_cornerCloseButton.show();
		self.setDueDateChangeIndicator(false);
		self.setFrequencyChangeIndicator(false);

		self.m_sidePanel.collapseSidePanel();	
		self.m_sidePanel.setContents(sidePanelHtml, "recom-o2" + compID);
		self.m_sidePanel.setActionsAsHTML(modifyButtonHTML);
		self.attachPopupToActionsButton(popupHtml);

		self.styleTimelineGraph();

		// Pass true so that we substract the fixed div height
		self.adjustScrollBarPosition(true);
	});

	// Add event handlers to hide the popup whenever user clicks outside of the popup
	$("body").mouseup(function (event) {
		if(event.target.getAttribute("id") !== "actionsRecomButton" + self.getComponentId()) {
			var popup = self.getPopupObject();
			if (popup && popup.exists()&&popup.isOpen()){
				if (!$(event.target).hasClass('tooltipster-content') && !$(event.target).parents().hasClass('tooltipster-content')){
					popup.hide();
				}
			}
		}
	});
	$(".wrkflw-views").scroll(function () {
		var popup = self.getPopupObject();
		if (popup && popup.exists()){
			popup.hide();
		}
	});
};

/**
 * Removes error message from the side panel, if it is currently displayed
 */
RecommendationsO2Component.prototype.removeSidePanelErrorMessage = function() {

	var modifyFailedContainer = this.m_$sidePanelContainer.find('.recom-o2-sp-err-msg');
	if(!modifyFailedContainer.hasClass("hidden")) {
		modifyFailedContainer.addClass("hidden");
	}
};

/*
 * Creates Save & Cancel buttons in the side panel
 */
RecommendationsO2Component.prototype.renderModifyExpectation = function () {

	var compID = this.getComponentId();
	var recomID = this.m_modifyObject.RECOMMENDATION_ID;

	var saveAndCancelButtonHTML = "<div id='recommendationsSPAction" + compID +
		"' class='recom-o2-sp-actions'><div class='sp-button2 recom-o2-cancel-button' id='cancelButton" + recomID + compID + "'>" +
		i18n.CANCEL + "</div>" + "<div class='sp-button2 recom-o2-save-button disabled' id='saveRecomButton" + recomID + compID + "'>" + i18n.SAVE + "</div></div>";

	var frequencyCodeValues = this.getTimeUnitsCodeSet();
	for (var i = frequencyCodeValues.length; i--;) {
		if (frequencyCodeValues[i].FREQUENCY_DISPLAY === this.m_modifyObject.FREQ_UNIT_DISP) {
			// Save the values for comparison
			this.m_modifyObject.FREQUENCY_UNIT_CD = frequencyCodeValues[i].FREQUENCY_CD;
			this.m_modifyObject.NEW_FREQUENCY_VALUE = this.m_modifyObject.FREQUENCY_VALUE;
			this.m_modifyObject.NEW_FREQUENCY_UNIT_CD = frequencyCodeValues[i].FREQUENCY_CD;
			break;
		}
	}

	// Set Side Panel Contents and attach date picker
	this.m_sidePanel.setContents(this.createModifyHtml(), "recom-o2" + compID);
	this.attachDatePicker(recomID, "modifyContainer", false, false);
	this.m_sidePanel.setActionsAsHTML(saveAndCancelButtonHTML);

	// Set the frequency drop down to the expectation's frequency
	this.m_$sidePanelContainer.find("#frequencyOption" + recomID + compID).val(this.m_modifyObject.FREQUENCY_UNIT_CD);
	
	// Set the AGE_UNIT_CD to the selected value in the age drop down, so that we can validate age once user enters the age value
	var $selectedAgeOption = this.m_$sidePanelContainer.find("#ageOption" + recomID + compID).find(":selected");
	this.m_modifyObject.AGE_UNIT_MEANING = $selectedAgeOption.attr("meaning");
	this.m_modifyObject.AGE_UNIT_CD = $selectedAgeOption.attr("value");

	this.addEventHandlersForModifyContainer();

	// Since the full side panel content is scrollable, pass false to adjustScrollBarPosition function
	this.adjustScrollBarPosition(false);
};

/**
 * Resets the indicators and clears the modify object. Should be called on component refresh
 */
RecommendationsO2Component.prototype.resetModifyIndicators = function() {
	this.setDueDateChangeIndicator(false);
	this.setFrequencyChangeIndicator(false);
	
	this.m_isSidePanelLoading = false;
	this.m_isSidePanelOpen = false;

	this.m_lastSelectedRow = "";
};

/*
 * Creates HTML code for Modify Expectation
 *
 * @return {string} - the html code for Side Panel Modify Controls
 */
RecommendationsO2Component.prototype.createModifyHtml = function () {

	var compID = this.getComponentId();
	var recomID = this.m_modifyObject.RECOMMENDATION_ID;

	var dateTime = new Date();
	var currentDateForComparision = new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate());

	var freqValue = this.m_modifyObject.FREQUENCY_VALUE;

	var disabledPropertyForFrequency = "";
	var dateClass = "recom-o2-modify-date-value";
	var frequencyLabel = this.m_i18nStrings.RECURRING;

	var unitsCodes = this.getTimeUnitsCodeSet();
	var codeSetLength = unitsCodes.length;

	//Default the date field to expectation's due date. If expectation is not having a due date, set it to today's date
	if (this.m_modifyObject.DUE_DATE_UTC !== "") {
		dateTime.setISO8601(this.m_modifyObject.DUE_DATE_UTC);
		this.m_modifyObject.OLD_DUE_DATE = dateTime;

		if (this.m_modifyObject.OLD_DUE_DATE < currentDateForComparision) {
			dateClass += " required-field-input";
			this.m_modifyObject.DATE_PICKER_DUE_DT_TM = undefined;
		} else {
			this.m_modifyObject.DATE_PICKER_DUE_DT_TM = this.m_modifyObject.OLD_DUE_DATE;
			this.m_modifyObject.NEW_DUE_DT_TM = this.m_modifyObject.DATE_PICKER_DUE_DT_TM;
		}
	}

	// Disable frequency modification for One time Only and Seasonal expectations
	switch (this.m_modifyObject.FREQUENCY_VALUE) {
	case 0:
		frequencyLabel = this.m_i18nStrings.ONE_TIME_ONLY;
		disabledPropertyForFrequency = "disabled";
		freqValue = "";
		break;
	case -1:
		frequencyLabel = this.m_i18nStrings.VARIABLE;
		freqValue = "";
		break;
	case -2:
		frequencyLabel = this.m_i18nStrings.SEASONAL;
		disabledPropertyForFrequency = "disabled";
		freqValue = "";
		break;
	}

	// Create a hidden div to display error message when the script fails to save the modify
	var modifyFailedHtml = "<div class = 'recom-o2-sp-err-msg hidden'></div>";

	// Create html code for displaying date and modifying date in the side panel
	var dueLabel = "<span class = 'recom-o2-modify-due-label secondary-text'>" + this.m_i18nStrings.DUE + "</span>";
	var changeDueDateDiv = "<div class = 'recom-o2-due-date-label-sp'>" + "<span>" + dateTime.format(dateFormat.masks.longDate) + "</span>" +
		"<span id = 'changeDueDateImage" + recomID + compID + "'class='recom-o2-modify-due-date-icon'></span></div>";

	var dateAgeDropDown = "<select id='DateOrAgeSelector" + recomID + compID + "' class='recom-o2-date-age-selector'>" + 
	"<option value='DateOption'>" + i18n.DATE + "</option>";

	if(this.getPatientDOB()) {
		dateAgeDropDown += "<option value='AgeOption'>" + i18n.AGE + "</option>"; 
	}
	else {
		dateAgeDropDown += "<option value='AgeOption' disabled title='"+this.m_i18nStrings.DOB_NOT_DOCUMENTED+"'>" + i18n.AGE + "</option>";
	}
	var dateSection = dateAgeDropDown + "</select><div class = 'recom-o2-modify-date-section'>" + "<input id='dateVal" + recomID + compID +
		"' type='text' size='10' class='" + dateClass + "' readonly='true' value = '" + dateTime.format(dateFormat.masks.shortDate2) +
		"'/><input type='button' id='dateValueButton" + recomID + compID + "' class='recom-o2-date-selector-button'/></div>";

	// Create hidden div for age section
	var ageDropDown = "<select id='ageOption" + recomID + compID + "' class = 'recom-o2-modify-age-drop-down'>";
	for (var codeIndex = 0; codeIndex < codeSetLength; codeIndex++) {
		ageDropDown += "<option value='" + unitsCodes[codeIndex].FREQUENCY_CD + "' meaning='" + unitsCodes[codeIndex].FREQUENCY_MEANING + "'>" + unitsCodes[codeIndex].FREQUENCY_DISPLAY + "</option>";
	}
	ageDropDown += "</select>";

	var ageContentHtml = "<div class = 'hidden'>" + "<input id='modifiedAgeValue" + recomID + compID + 
		"' class='recom-o2-modify-age-value' type='text' maxlength='3' size='3' onpaste='return false'/>" + ageDropDown + "</div>";

	var futureDateHtml = "<div class='recom-o2-modify-future-date-message hidden'>" + this.m_i18nStrings.FUTURE_DATE_MESSAGE + "</div>";

	// Compile all div's in a single div
	var editSection = "<div id = 'editDueDate" + compID + "'class = 'recom-o2-due-date-div-sp hidden'>" + dateSection + ageContentHtml + futureDateHtml + "</div>";
	var dueDateFaceUp = "<div id = 'dueDateDiv" + compID + "' class = 'recom-o2-modify-date-div'>" + dueLabel + changeDueDateDiv + editSection + "</div>";

	// Create Reset to default link only if frequency has been modified at least once
	var resetToDefaultAnchorTag = "<a class='recom-o2-reset-to-default-link', href='javascript:void(0)'>" + this.m_i18nStrings.RESET_TO_DEFAULT + "</a>";
	var resetToDefaultLabel = "<span class='recom-o2-reset-to-default-span disabled'>" + this.m_i18nStrings.RESET_TO_DEFAULT + "</span>";
	var resetToDefaultLink = this.enableResetToDefaultLink() ? resetToDefaultAnchorTag : resetToDefaultLabel;

	// Create html code to display the frequency value and frequency drop down
	var frequencyDropDown = this.renderDropDownWithUnitsCodeSet("frequency", recomID, disabledPropertyForFrequency);
	var frequencyContentHtml = "<div id = 'modifyFreqDiv" + compID + "' class = 'recom-o2-modify-freq-section'>" + "<span class = 'recom-o2-modify-freq-label secondary-text'>" +
		frequencyLabel + "</span><div class='recom-o2-modify-freq-div'><input id='modifiedFrequencyValue" + recomID + compID +
		"' class='recom-o2-modify-freq-value' type='text' maxlength='3' size='3' onpaste='return false' value = '" + freqValue + "'" +
		disabledPropertyForFrequency + "/>" + frequencyDropDown + resetToDefaultLink + "</div></div>";

	// Create Reason Drop down and Comment section
	var reasonDropDown = "<select class = 'recom-o2-modify-reason-drop-down'><option value='0'>&nbsp;--</option>";
	var reasonCodeSet = this.getReasonCodeSet();
	var reasonCodeSetLength = reasonCodeSet.length;
	for (var reasonIndex = 0; reasonIndex < reasonCodeSetLength; reasonIndex++) {
		reasonDropDown += "<option value='" + reasonCodeSet[reasonIndex].REASON_CD + "'>&nbsp;" + reasonCodeSet[reasonIndex].REASON_DISPLAY + "</option>";
	}
	reasonDropDown += "</select>";
	var reasonHtml = "<div class = 'recom-o2-modify-reason'>" + "<span class='recom-o2-modify-reason-label secondary-text'>" + i18n.REASON + "</span><br/>" + reasonDropDown + "</div>";
	var providerName = " " + this.getCurrentProviderName();
	var recordedForHtml = "<div class = 'recom-o2-modify-recorded-for'>" + "<span class='secondary-text'>" + this.m_i18nStrings.RECORDED_FOR +
		"</span><br/><input class = 'recom-o2-provider-name' type = 'text' size = '" + providerName.length + "' readonly = 'true' value = '" + providerName + "'/></div>";
	var reasonAndRecordedForHtml = "<div class = 'recom-o2-modify-reason-recorded-for'>" + reasonHtml + recordedForHtml + "</div>";

	var commentHtml = "<div class = 'recom-o2-comment-section'>" + "<span class = 'secondary-text'>" + i18n.COMMENTS + "</span><br/><textarea id='modifyRecComment" +
		recomID + compID + "' class='recom-o2-comment-area' rows='3' maxlength='1000' placeholder='" + this.m_i18nStrings.ADD_A_COMMENT + "'></textarea></div>";

	// Generate the complete HTML
	var modifyHtml = "<div id='modifyContainer" + recomID + compID + "' class='recom-o2-modify-controls'>" + modifyFailedHtml +
		dueDateFaceUp + frequencyContentHtml + reasonAndRecordedForHtml + commentHtml + "</div>";

	return "<div id=sidePanelScrollContainer" + compID + ">" + modifyHtml + "</div>";
};

/*
 * Adds event handlers for modify UI controls rendered in side panel
 */
RecommendationsO2Component.prototype.addEventHandlersForModifyContainer = function () {

	var self = this;
	var compID = this.getComponentId();
	var recomID = this.m_modifyObject.RECOMMENDATION_ID;
	var $modifyContainer = this.m_$sidePanelContainer.find("#modifyContainer" + recomID + compID);

	// Restrict input only to numbers for frequency and age fields
	var numbersOnly = function (evt) {
		var charCode = evt.which ? evt.which : evt.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;
	};
	$modifyContainer.on('keypress', '.recom-o2-modify-freq-value', numbersOnly);
	$modifyContainer.on('keypress', '.recom-o2-modify-age-value', numbersOnly);

	// Event handler to save the frequency input
	var frequencyHandler = function () {

		switch ($(this).attr("id")) {
		case "modifiedFrequencyValue" + recomID + compID:
			self.m_modifyObject.NEW_FREQUENCY_VALUE = parseInt(this.value, 10);
			break;
		case "frequencyOption" + recomID + compID:
			self.m_modifyObject.NEW_FREQUENCY_UNIT_CD = parseInt(this.value, 10);
			break;
		}

		// If the frequency is different than the current frequency set the frequency change indicator to true, else reset it to false
		if (self.m_modifyObject.FREQUENCY_VALUE !== self.m_modifyObject.NEW_FREQUENCY_VALUE || self.m_modifyObject.FREQUENCY_UNIT_CD !== self.m_modifyObject.NEW_FREQUENCY_UNIT_CD) {
			self.setFrequencyChangeIndicator(true);
			if (self.getReasonOnFrequencyModification()) {
				// Make reason mandatory field
				$modifyContainer.find(".recom-o2-modify-reason-label").addClass("recom-o2-modify-required-field");
			}			
		} else {
			self.setFrequencyChangeIndicator(false);
			$modifyContainer.find(".recom-o2-modify-reason-label").removeClass("recom-o2-modify-required-field");
		}

		self.enableOrDisableSaveButton();
	};
	$modifyContainer.on("keyup", ".recom-o2-modify-freq-value", frequencyHandler);
	$modifyContainer.on("change", "#frequencyOption" + recomID + compID, frequencyHandler);

	// Event handler for Age Input
	var ageHandler = function () {
		var $ageObject = $(this);
		var $futureDateObject = $ageObject.closest("#editDueDate" + compID).find(".recom-o2-modify-future-date-message");

		var currentDate = new Date();
		var currentDateForComparision = new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate());

		switch ($ageObject.attr("id")) {
		case "modifiedAgeValue" + recomID + compID:
			self.m_modifyObject.AGE_VALUE = parseInt(this.value, 10);
			break;
		case "ageOption" + recomID + compID:
			self.m_modifyObject.AGE_UNIT_CD = parseInt(this.value, 10);
			self.m_modifyObject.AGE_UNIT_MEANING = $ageObject.find(":selected").attr("meaning");
			break;
		}

		if (isNaN(self.m_modifyObject.AGE_VALUE)) {
			self.m_modifyObject.AGE_DUE_DT_TM = false;
			if (!$futureDateObject.hasClass("hidden")) {
				self.m_modifyObject.showFutureMsg = false;
				$futureDateObject.addClass("hidden");
			}
		} else {

			self.m_modifyObject.AGE_DUE_DT_TM = self.validateDueDateBasedOnAgeSelected(self.m_modifyObject.AGE_VALUE, self.m_modifyObject.AGE_UNIT_MEANING);

			if(self.m_modifyObject.AGE_DUE_DT_TM && self.m_modifyObject.AGE_DUE_DT_TM > currentDateForComparision) {
				self.m_modifyObject.NEW_DUE_DT_TM = self.m_modifyObject.AGE_DUE_DT_TM;
				if (!$futureDateObject.hasClass("hidden")) {
					self.m_modifyObject.showFutureMsg = false;
					$futureDateObject.addClass("hidden");
				}
			} else {
				self.m_modifyObject.AGE_DUE_DT_TM = false;
				self.m_modifyObject.showFutureMsg = true;
				$futureDateObject.removeClass("hidden");
			}
		}

		self.enableOrDisableSaveButton();
	};
	$modifyContainer.on("keyup", "#modifiedAgeValue" + recomID + compID, ageHandler);
	$modifyContainer.on("change", "#ageOption" + recomID + compID, ageHandler);

	// Set the new due date in modifyObject when the date gets modified
	$modifyContainer.on("change", '#dateVal' + this.m_modifyObject.RECOMMENDATION_ID + compID, function () {

		self.m_modifyObject.DATE_PICKER_DUE_DT_TM = $(this).parent(".recom-o2-modify-date-section").find("#dateValueButton" + recomID + compID).datepicker("getDate");
		self.m_modifyObject.NEW_DUE_DT_TM = self.m_modifyObject.DATE_PICKER_DUE_DT_TM;
		$(this).removeClass("required-field-input");
		self.enableOrDisableSaveButton();
	});

	// Add event handler for click of the modify due date pencil icon
	$modifyContainer.on("click", "#changeDueDateImage" + recomID + compID, function () {

		// Hide the div displaying due date and display edit due date controls. Make due date a mandatory field
		$(this).closest(".recom-o2-due-date-label-sp").addClass("hidden").next("#editDueDate" + compID).removeClass("hidden")
			.siblings(".recom-o2-modify-due-label").addClass("recom-o2-modify-required-field");

		if (self.getReasonOnDueDateModification()) {
			// Make reason mandatory field
			$modifyContainer.find(".recom-o2-modify-reason-label").addClass("recom-o2-modify-required-field");
		}

		self.setDueDateChangeIndicator(true);
		self.enableOrDisableSaveButton();
	});

	// Add event handlers for Date/Age drop down
	$modifyContainer.on("change", "#DateOrAgeSelector" + this.m_modifyObject.RECOMMENDATION_ID + compID, function () {
		
		var $dateAgeSelector = $(this);
		var $futureDateMsg = $dateAgeSelector.closest("#editDueDate" + compID).find(".recom-o2-modify-future-date-message");

		switch (this.value) {
		case "DateOption":
			// Hide the age options and replace it with date div
			$dateAgeSelector.next().removeClass("hidden").addClass("recom-o2-modify-date-section").next().addClass("hidden").removeClass("recom-o2-modify-age-section");
			if(!$futureDateMsg.hasClass("hidden")) {
				$futureDateMsg.addClass("hidden");
			}

			self.m_modifyObject.NEW_DUE_DT_TM = self.m_modifyObject.DATE_PICKER_DUE_DT_TM;
			break;
		case "AgeOption":
			// Hide the Date div and display age options				
			$dateAgeSelector.next().removeClass("recom-o2-modify-date-section").addClass("hidden").next().addClass("recom-o2-modify-age-section").removeClass("hidden");
			if(self.m_modifyObject.showFutureMsg) {
				$futureDateMsg.removeClass("hidden");
			}

			self.m_modifyObject.NEW_DUE_DT_TM = self.m_modifyObject.AGE_DUE_DT_TM;
			break;
		}
		self.enableOrDisableSaveButton();
	});

	// Add click event handler for Reset to Default link in the side panel
	$modifyContainer.on("click", ".recom-o2-reset-to-default-link", function () {
		self.m_modifyObject.NEW_FREQUENCY_VALUE = self.m_modifyObject.PREV_FREQ_VALUE;
		self.m_modifyObject.NEW_FREQUENCY_UNIT_CD = self.m_modifyObject.PREV_FREQ_UNIT_CD;

		// Set the default frequency in the frequency fields
		if(self.m_modifyObject.PREV_FREQ_VALUE === -1){
			//consider case for variable frequency
			$modifyContainer.find("#modifiedFrequencyValue" + recomID + compID).val("");
			$modifyContainer.find("#frequencyOption" + recomID + compID).val("");
		}else{
			$modifyContainer.find("#modifiedFrequencyValue" + recomID + compID).val(self.m_modifyObject.PREV_FREQ_VALUE);
			$modifyContainer.find("#frequencyOption" + recomID + compID).val(self.m_modifyObject.PREV_FREQ_UNIT_CD);
		}

		// Set focus on the next field which is reason drop down
		$modifyContainer.find(".recom-o2-modify-reason-drop-down").focus();

		// Apply reset to default special case while checking for required fields 
		self.checkRequiredFieldsForResetToDefault();

		self.setFrequencyChangeIndicator(true);
	});

	// Add event handlers for reason drop down
	$modifyContainer.on("change", ".recom-o2-modify-reason-drop-down", function () {
		self.m_modifyObject.REASON_CD = parseInt(this.value, 10);
		self.enableOrDisableSaveButton();
	});

	// Add event handler for comment text area
	$modifyContainer.on("focusout", "#modifyRecComment" + recomID + compID, function () {
		self.m_modifyObject.COMMENT_TEXT = this.value;
	});

	//Internet explorer 8 and 9 don't support the maxlength property, so adding event handler to restrict the input to 1000 characters
	$modifyContainer.on("paste keyup change",".recom-o2-modify-rec-comment", function () {
		var maxLength = 1000;
		var currentCommentText = $(this).val();
		if (currentCommentText.length > maxLength) {
			$(this).val(currentCommentText.substring(0, maxLength));
		}	
	});
};

/*
 * Determines if reason is a mandatory field for modifying an expectation. Cecks if due date is modified or frequency is modified
 * and returns the correct preference
 */
RecommendationsO2Component.prototype.isReasonMandatoryField = function () {

	if (this.getDueDateChangeIndicator() && this.getReasonOnDueDateModification()) {
		return true;
	}

	if (this.getFrequencyChangeIndicator() && this.getReasonOnFrequencyModification()) {
		return true;
	}

	// If none of the preference is set, return false
	return false;
};

/*
 * Determines if the reset to default link should be enabled or not and also sets the old frequency values in the modify object
 *
 * @return {boolean} - Returns true if frequency has been modified at least once, else returns false
 */
RecommendationsO2Component.prototype.enableResetToDefaultLink = function () {
	if(this.m_modifyObject.GROUP_NAME === this.m_i18nStrings.FREETEXT){
		return false;
	}
	var frequencyHistory = this.m_modifyObject.FREQUENCY_HISTORY;
	var frequencyModificationCount = frequencyHistory.length;

	if (frequencyModificationCount) {
		this.m_modifyObject.PREV_FREQ_VALUE = frequencyHistory[frequencyModificationCount - 1].PREV_FREQ_VALUE;

		var frequencyCodeValues = this.getTimeUnitsCodeSet();
		for (var i = frequencyCodeValues.length; i--;) {
			if (frequencyCodeValues[i].FREQUENCY_DISPLAY === frequencyHistory[frequencyModificationCount - 1].PREV_FREQ_UNIT_DISP) {
				this.m_modifyObject.PREV_FREQ_UNIT_CD = frequencyCodeValues[i].FREQUENCY_CD;
				break;
			}
		}
		//consider variable frequency case
		if(this.m_modifyObject.NEW_FREQUENCY_VALUE === null){
			return false;
		}
		// Enable reset to default link only if the current frequency is different than default frequency
		if(this.m_modifyObject.PREV_FREQ_VALUE !== this.m_modifyObject.NEW_FREQUENCY_VALUE || 
			this.m_modifyObject.PREV_FREQ_UNIT_CD !== this.m_modifyObject.NEW_FREQUENCY_UNIT_CD) {
			return true;
		}
	}

	return false;
};

/**
 * This function checks if due date has been modified, if it is then makes a call to enableOrDisableSaveButton, 
 * else applies the special case of reset to default where we need not check for reason preference and save should be enabled
 */
RecommendationsO2Component.prototype.checkRequiredFieldsForResetToDefault = function() {
	
	if(this.getDueDateChangeIndicator()) {
		this.enableOrDisableSaveButton();
	} else {
		this.m_$sidePanelContainer.find(".recom-o2-modify-reason-label").removeClass("recom-o2-modify-required-field");
		this.m_$sidePanelContainer.find("#saveRecomButton" + this.m_modifyObject.RECOMMENDATION_ID + this.getComponentId()).removeClass("disabled");
	}
};

/*
 * Enables the save button if all required fields are populated correctly, else disables it
 */
RecommendationsO2Component.prototype.enableOrDisableSaveButton = function () {

	var saveButton = this.m_$sidePanelContainer.find("#saveRecomButton" + this.m_modifyObject.RECOMMENDATION_ID + this.getComponentId());

	if (this.areRequiredFieldsPopulated()) {
		saveButton.removeClass("disabled");
	} else {
		saveButton.addClass("disabled");
	}
};

/*
 * Checks if all the required fields are populated correctly or not.
 *
 * @return {string} Returns true if all the required fields are populated correctly, else returns false
 */
RecommendationsO2Component.prototype.areRequiredFieldsPopulated = function () {

	var recomID = this.m_modifyObject.RECOMMENDATION_ID;
	var compID = this.getComponentId();
	var isDueDateModified = false;
	var isFrequencyModified = false;

	if (this.getDueDateChangeIndicator()) {

		isDueDateModified = true;

		// Check if DateOption is selected or AgeOption
		switch (this.m_$sidePanelContainer.find("#DateOrAgeSelector" + recomID + compID).val()) {
		case "DateOption":
			// If Date Option is selected, check for DATE_PICKER_DUE_DT_TM field
			if (!this.m_modifyObject.DATE_PICKER_DUE_DT_TM) {
				return false;
			}
			break;
		case "AgeOption":
			// If Age Option is selected, check for AGE_DUE_DT_TM field
			if (!this.m_modifyObject.AGE_DUE_DT_TM) {
				return false;
			}
			break;
		}
	}

	if (this.getFrequencyChangeIndicator()) {
		isFrequencyModified = true;
		//If frequency value is -1 (for variable frequency case ) 
		if(this.m_modifyObject.NEW_FREQUENCY_VALUE === -1){
			return true;
		}
		// If frequency value is blank or set to 0, disable the save button
		if (isNaN(this.m_modifyObject.NEW_FREQUENCY_VALUE) || this.m_modifyObject.NEW_FREQUENCY_VALUE <= 0) {
			return false;
		}
	}

	// If neither due date nor frequency has been modified then return false
	if(!isDueDateModified && !isFrequencyModified) {
		return false;
	}

	// Check if reason is mandatory field, if it is return false if reason has not been filled
	if (this.isReasonMandatoryField() && !this.m_modifyObject.REASON_CD) {
		return false;
	}

	// If all fields have been populated correctly return true
	return true;
};

/* 
 * Creates and returns an object which can be used while creating request structure for calling script to modify the expectation
 *
 * Request structure format is -
 * 1 due_date_actions[*]
 *     2 recommendation_id = f8
 *     2 restore_default = i2
 *     2 new_due_dt_tm = dq8
 *     2 on_behalf_of_prsnl_id = f8
 *     2 reason_cd = f8
 *     2 comment = vc
 *     2 prev_due_dt_tm = dq8
 *     2 person_id = f8
 */
RecommendationsO2Component.prototype.getDueDateActionObject = function () {

	return {
		RECOMMENDATION_ID: 0.0,
		RESTORE_DEFAULT: 0,
		NEW_DUE_DT_TM: "",
		ON_BEHALF_OF_PRSNL_ID: 0.0,
		REASON_CD: 0.0,
		COMMENT: "",
		PREV_DUE_DT_TM: "",
		PERSON_ID: 0.0
	};
};

/* 
 * Creates and returns an object which can be used while creating request structure for calling script to modify the expectation
 *
 * Request structure format is -
 *
 *  1 frequency_actions[*]
 *     2 recommendation_id = f8
 *     2 restore_default = i2
 *     2 frequency_value = i4
 *     2 frequency_unit_cd = f8
 *     2 on_behalf_of_prsnl_id = f8
 *     2 reason_cd = f8
 *     2 comment = vc
 *     2 prev_frequency_value = i4
 *     2 prev_frequency_unit_cd = f8
 *     2 due_dt_tm = dq8
 *     2 person_id = f8
 *
 */
RecommendationsO2Component.prototype.getFrequencyActionObject = function () {

	return {
		RECOMMENDATION_ID: 0.0,
		RESTORE_DEFAULT: 0,
		FREQUENCY_VALUE: 0,
		FREQUENCY_UNIT_CD: 0.0,
		ON_BEHALF_OF_PRSNL_ID: 0.0,
		REASON_CD: 0.0,
		COMMENT: "",
		PREV_FREQUENCY_VALUE: 0,
		PREV_FREQUENCY_UNIT_CD: 0.0,
		DUE_DT_TM: "",
		PERSON_ID: 0.0
	};
};

/*
 * Creates the request structure for Add/Modify Expectation
 *
 *	@param {object} -  an array which contains 1 due date action object
 *	@param {object} -  an array that should contain 1 frequency action object
 *
 */
RecommendationsO2Component.prototype.getModifyExpectationsBlobIn = function (dueDateRequest, frequencyRequest) {

	if (!dueDateRequest && !frequencyRequest) {
		throw new Error("Invalid parameters passed to getModifyExpectationsBlobIn function");
	}

	var modifyExpectationRequest = this.getScriptRequestStructure(966325);

	if (dueDateRequest && dueDateRequest.length) {
		modifyExpectationRequest.REQUESTIN.DUE_DATE_ACTIONS = dueDateRequest;
	}

	if (frequencyRequest && frequencyRequest.length) {
		modifyExpectationRequest.REQUESTIN.FREQUENCY_ACTIONS = frequencyRequest;
	}

	// If UTC is on, call the enhancedStringify and set the UTC flag to 1
	return this.getCriterion().is_utc === 1 ? MP_Util.enhancedStringify(modifyExpectationRequest, 0, 0, 1) : MP_Util.enhancedStringify(modifyExpectationRequest);

};

/*
 *	This function creates the request structure for Modify Expectation script and calls the backend script to update the expectation
 *
 */
RecommendationsO2Component.prototype.modifyExpectation = function () {

	var self = this;
	var compID = self.getComponentId();
	var recomID = self.m_modifyObject.RECOMMENDATION_ID;
	
	var dueDateActions = [];
	var frequencyActions = [];

	var PCO_HM_REDIRECT_MODIFICATIONS = {
		APPLICATION: 966300,
		TASK: 966320,
		REQUEST: 966325
	};

	var scriptRequest = new ScriptRequest();

	if (this.getDueDateChangeIndicator()) {

		var dueDateObj = this.getDueDateActionObject();

		// Set time to 12 Noon to avoid DST/UTC issues
		this.m_modifyObject.NEW_DUE_DT_TM.setHours(12);
		this.m_modifyObject.NEW_DUE_DT_TM.setMinutes(0);
		this.m_modifyObject.NEW_DUE_DT_TM.setSeconds(0);

		// Convert due date time to UTC time if UTC is ON, else use local time
		if(this.getCriterion().is_utc) {
			dueDateObj.NEW_DUE_DT_TM = JSON.stringify(this.m_modifyObject.NEW_DUE_DT_TM).replace(/"/g, "");
		} else {
			dueDateObj.NEW_DUE_DT_TM = this.m_modifyObject.NEW_DUE_DT_TM.format(dateFormat.masks.isoDateTime);
		}

		// Populate Due Date object
		dueDateObj.PERSON_ID = this.getCriterion().person_id;
		dueDateObj.ON_BEHALF_OF_PRSNL_ID = this.getCriterion().provider_id;
		dueDateObj.RECOMMENDATION_ID = this.m_modifyObject.RECOMMENDATION_ID;
		dueDateObj.REASON_CD = this.m_modifyObject.REASON_CD;
		dueDateObj.COMMENT = this.m_modifyObject.COMMENT_TEXT;

		dueDateActions.push(dueDateObj);
	}

	if (this.getFrequencyChangeIndicator()) {

		var frequencyObj = this.getFrequencyActionObject();

		// Populate frequency object
		frequencyObj.PERSON_ID = this.getCriterion().person_id;
		frequencyObj.ON_BEHALF_OF_PRSNL_ID = this.getCriterion().provider_id;

		frequencyObj.RECOMMENDATION_ID = this.m_modifyObject.RECOMMENDATION_ID;
		frequencyObj.FREQUENCY_VALUE = this.m_modifyObject.NEW_FREQUENCY_VALUE;
		frequencyObj.FREQUENCY_UNIT_CD = this.m_modifyObject.NEW_FREQUENCY_UNIT_CD;
		frequencyObj.REASON_CD = this.m_modifyObject.REASON_CD;
		frequencyObj.COMMENT = this.m_modifyObject.COMMENT_TEXT;

		frequencyObj.PREV_FREQUENCY_VALUE = this.m_modifyObject.FREQUENCY_VALUE;
		frequencyObj.PREV_FREQUENCY_UNIT_CD = this.m_modifyObject.FREQUENCY_UNIT_CD;

		frequencyActions.push(frequencyObj);
	}

	scriptRequest.setProgramName("MP_EXEC_STD_REQUEST");
	scriptRequest.setParameterArray(["^MINE^", "^^", PCO_HM_REDIRECT_MODIFICATIONS.APPLICATION, PCO_HM_REDIRECT_MODIFICATIONS.TASK, PCO_HM_REDIRECT_MODIFICATIONS.REQUEST]);
	scriptRequest.setDataBlob(this.getModifyExpectationsBlobIn(dueDateActions, frequencyActions));
	scriptRequest.setResponseHandler(function (scriptReply) {
	
		if (scriptReply.getStatus() === "S") {			
			self.m_$sidePanelContainer.find("#modifyContainer" + recomID + compID).off();
			self.m_modifyObject.saveSuccessful = true;
			self.retrieveComponentData();
		} else {

			var modifyFailedContainer = self.m_$sidePanelContainer.find('.recom-o2-sp-err-msg');
			if(modifyFailedContainer.hasClass('hidden')){
				var saveErrorHTML = MP_Core.generateUserMessageHTML("error", self.m_i18nStrings.MODIFY_EXP_FAILED_TITLE, "", "recom-o2-modify-failure");
				modifyFailedContainer.empty().html(saveErrorHTML);
				modifyFailedContainer.removeClass('hidden');
			}

			// Enable the save button if save has failed so that user can attempt to save again
			self.m_$sidePanelContainer.find("#saveRecomButton" + recomID + compID).removeClass("disabled");
		}
	});

	this.m_$sidePanelContainer.find("#saveRecomButton" + recomID + compID).addClass("disabled");
	scriptRequest.performRequest();
};

/**
 * This function overrides the expandSidePanel method of the side panel, so that it can correctly place the scroll bar
 * @param  {boolean} deductFixedDivHeight If set to true, the graph height is calculate and deducted from maxScrollHeight so as to
 *                                     correctly position the scroll bar in the side panel
 */
RecommendationsO2Component.prototype.adjustScrollBarPosition = function (deductFixedDivHeight) {

	var graphHeight = 0;
	var compID = this.getComponentId();

	if (deductFixedDivHeight) {
		graphHeight = this.m_$sidePanelContainer.find("#" + compID + "rp-last-satisfied").height() + this.m_$sidePanelContainer.find("#" + compID + "graphWrapper").height() + 20;

	}
	
	// Override the side panel's expandSidePanel method so that we can place the scroll bar correctly on the scrollable div
	this.m_sidePanel.expandSidePanel = function () {

		//if the side panel is not already expanded, then set up the missing pieces
		if (!this.m_sidePanelObj.hasClass("sp-focusin")) {
			//Add expand bar if it is not currently showing
			this.m_expCollapseBarObj.removeClass("hidden");

			// Upon expand, absolute positioning is applied to allow the side panel to
			// expand over other content
			this.m_parentContainer.css({
				position: "absolute"
			});

			// Add the styles like shadow.
			this.m_sidePanelObj.addClass("sp-focusin");

			// Replace the expand-collapse icon
			this.m_expCollapseIconObj.addClass("sp-collapse").removeClass("sp-expand");
		}

		//Set panel obj to have min-height that matches the current panel height (so it does not "expand" shorter)
		this.m_previousMinHeight = this.m_minHeight;

		//convert the "45px" strings to their respective int values 45
		var heightVal = parseInt(this.m_height, 10);
		var minHeightVal = parseInt(this.m_minHeight, 10);

		if (heightVal > minHeightVal) {
			this.setMinHeight(this.m_height);
		}

		//Remove the max-height if its already on the scroll container, otherwise it will not expand to full size
		this.m_scrollContainer.css("max-height", "");

		var titleHeight = null;

		// set up for scrolling the panel if contents exceed panel height
		if (this.m_usingUpdatedPanel) {
			var bodyContentHeight = this.m_sidePanelBodyContents[0].offsetHeight;
			titleHeight = this.m_sidePanelContents.height() - bodyContentHeight;
		} else {
			var contentHeight = this.m_sidePanelContents[0].offsetHeight;
			titleHeight = contentHeight - this.m_scrollContainer.height();
		}

		// Set height to auto so it will expand to show contents
		this.m_sidePanelObj.css({
			"height": "auto"
		});

		// Incrementing scrollMaxHeight to prevent issues when the content is the
		// same height as the max (its finicky)
		var scrollMaxHeight = (this.m_sidePanelObj.height() - titleHeight) + 1;

		if (graphHeight) {
			scrollMaxHeight = scrollMaxHeight - graphHeight;
		}

		// To enable the scroll bar, set the max-height. Need px here for other
		// check below to be number
		this.m_scrollContainer.css("max-height", scrollMaxHeight + "px");

		if (scrollMaxHeight === this.m_scrollContainer.height()) {
			this.m_scrollContainer.addClass("sp-add-scroll");
		}

		if (this.m_onExpandFunc) {
			this.m_onExpandFunc();
		}
	};
};


/**
 * Creates the html code for popup which contains a list of satisfiers
 *
 * @param  {object} data - the data associated with the selected row
 *
 * @return {string} Returns html code which can be used to set the contents of popup
 */
RecommendationsO2Component.prototype.createPopupHtml = function (data) {

	if (typeof data !== "object") {
		throw new Error("Invalid parameter passed to createPopupHtml function");
	}

	var popupHtml = "<div class = 'recom-o2-satisfier-list'>";
	var foundSatisfier = false;
	var freeTextSatisfiers = this.getFreeTextSatisfiers();
	var isFreeText = data.SERIES_ID === 0 ? true : false;

	if (isFreeText) {
		// Create popup html for Free Text Expectation's satisfiers
		if(freeTextSatisfiers.DONE_ELSEWHERE_PREF) {
			popupHtml += "<div class = 'recom-o2-satisfier-item' data-action = 'free-text-satisfy'>" + freeTextSatisfiers.DONE_ELSEWHERE_LABEL + "</div>";
			foundSatisfier = true;
		}

		if (freeTextSatisfiers.REFUSE_PREF) {
			popupHtml += "<div class = 'recom-o2-satisfier-item' data-action = 'free-text-refuse'>" + freeTextSatisfiers.REFUSE_LABEL + "</div>";
			foundSatisfier = true;
		}

		if (freeTextSatisfiers.CANCEL_PREF) {
			popupHtml += "<div class = 'recom-o2-satisfier-item' data-action = 'free-text-cancel'>" + freeTextSatisfiers.CANCEL_LABEL + "</div>";
			foundSatisfier = true;
		}
	} else {
		for (var satisfierIndex = 0; satisfierIndex < data.SATISFIERS.length; satisfierIndex++) {
			switch (data.SATISFIERS[satisfierIndex].ENTRY_TYPE_MEANING.toUpperCase()) {
			case "POSTPONE":
			case "REFUSE":
			case "EXPIRE":
			case "MANUAL":
				popupHtml += "<div id = '" + data.SATISFIERS[satisfierIndex].EXPECT_SAT_ID + "'" + "class = 'recom-o2-satisfier-item' data-action = '" +
					data.SATISFIERS[satisfierIndex].ENTRY_TYPE_MEANING + "'>" + data.SATISFIERS[satisfierIndex].EXPECT_SAT_NAME + "</div>";
				foundSatisfier = true;
				break;
			case "PROCEDURE":
				popupHtml += "<div id = '" + data.SATISFIERS[satisfierIndex].EXPECT_SAT_ID + "'" + "class = 'recom-o2-satisfier-item' data-action = '" +  data.SATISFIERS[satisfierIndex].ENTRY_TYPE_MEANING 
				+ "' data-proc-name = '" + data.SATISFIERS[satisfierIndex].PROCEDURE_NAME_DISPLAY + "' data-nomenclature-id = '" + data.SATISFIERS[satisfierIndex].ENTRY_ID + "'>"
				+ data.SATISFIERS[satisfierIndex].EXPECT_SAT_NAME + "</div>";
				foundSatisfier = true;
				break;
			}

			if(CERN_Platform.inMillenniumContext())
			{
				switch (data.SATISFIERS[satisfierIndex].ENTRY_TYPE_MEANING.toUpperCase()) 
				{
					case "POWERFORM":			
							popupHtml += "<div id = '" + data.SATISFIERS[satisfierIndex].EXPECT_SAT_ID + "'" + "class = 'recom-o2-satisfier-item' data-action = '" +  
							data.SATISFIERS[satisfierIndex].ENTRY_TYPE_MEANING + "'>" + data.SATISFIERS[satisfierIndex].EXPECT_SAT_NAME + "</div>";
							foundSatisfier = true;
							break;	

					case "PRESCRIPTION":
							if(data.SATISFIERS[satisfierIndex].FILTER_IND === 0)  // FILTER_IND = 0 - display order based on virtual order filtering
							{
								popupHtml += "<div id = '" + data.SATISFIERS[satisfierIndex].EXPECT_SAT_ID + "'" + "class = 'recom-o2-satisfier-item' data-action = '" +  
								data.SATISFIERS[satisfierIndex].ENTRY_TYPE_MEANING + "'>" + data.SATISFIERS[satisfierIndex].EXPECT_SAT_NAME + "</div>";
								foundSatisfier = true;
							}
						break;

					 case "ORDER":
 							if(data.SATISFIERS[satisfierIndex].FILTER_IND === 0)  // FILTER_IND = 0 - display order based on virtual order filtering
							{
								popupHtml += "<div id = '" + data.SATISFIERS[satisfierIndex].EXPECT_SAT_ID + "'" + "class = 'recom-o2-satisfier-item' data-action = '" +  
								data.SATISFIERS[satisfierIndex].ENTRY_TYPE_MEANING +"'>" + data.SATISFIERS[satisfierIndex].EXPECT_SAT_NAME + "</div>";
								foundSatisfier = true;
							}
						break;
						
					 default:
						// do nothing;
				}
			}					

		}
	}

	popupHtml += "</div>";

	// Return an empty string if no satisfiers are build for the expectation
	return foundSatisfier ? popupHtml : "";

};

/**
 * Creates a popup object and attachs it to Actions button
 *
 * @param  {string} popupHtml the html string which should be set as popup contents
 */
RecommendationsO2Component.prototype.attachPopupToActionsButton = function (popupHtml) {

	if (typeof popupHtml !== "string") {
		throw new Error("Invalid parameter passed to attachPopupToActionsButton function");
	}

	// Creating popup object each time side panel is rendered as currently the api is destroying the object on hide
	var popup = new MPageUI.Popup();
	this.setPopupObject(popup);

	//Set the body content for the popup
	popup.setBodyContent(popupHtml);

	//Set the anchor id of the element the popup should launch from/point to
	popup.setAnchorId("actionsRecomButton" + this.getComponentId());
};

/**
 * Adds event handler for all actions that can be performed in the pop-up
 *    If the popup is in a hidden state then removes the event handler
 *
 * @param  {object} dataObject the data object associated with the recommendations row
 */
RecommendationsO2Component.prototype.attachPopupHandler = function (dataObject) {

	if (typeof dataObject !== "object") {
		throw new Error("Invalid parameter passed to attachPopupHandler function");
	}

	var self = this;

	if (this.getPopupObject().isOpen()) {
		$(".recom-o2-satisfier-list").on("click", ".recom-o2-satisfier-item", function () {
			if (!self.m_isSidePanelLoading) {

				var selectedSatisfier = $(this);
				var satisfierID = 0;
				var actionMeaning = selectedSatisfier.attr("data-action");
				var isFreeText = dataObject.SERIES_ID === 0 ? true : false;

				// If the expectation is a free text expectation set the actionMeaning correctly
				if (isFreeText) {
					switch (actionMeaning) {
					case "free-text-satisfy": 
						actionMeaning = "MANUAL";
						break;
					case "free-text-refuse":
						actionMeaning = "REFUSE";
						break;
					case "free-text-cancel":
						actionMeaning = "EXPIRE";
						break;
					}
 				} else {
 					satisfierID = parseInt(selectedSatisfier.attr("id"), 10);
 				}

				var modifierTypeCd = self.getModifierTypeCd(actionMeaning);

				if( actionMeaning === "POWERFORM" ||
						actionMeaning === "ORDER" || 
						actionMeaning === "PRESCRIPTION")
				{
					self.getPopupObject().hide();
					self.systemSatisfierHandler(actionMeaning, dataObject,satisfierID);					
					
				} else if(actionMeaning === "PROCEDURE"){
					//If the satisfier is a procedure, set the procedure-name to a constructor level variable to access it later to display in the sidepanel.
					self.setAddProcedureName(selectedSatisfier.attr("data-proc-name"));
					self.setNomenclatureId(parseInt(selectedSatisfier.attr("data-nomenclature-id"),10));
					self.getPopupObject().hide();
					self.systemSatisfierHandler(actionMeaning, dataObject, satisfierID);
					
				}else {				
					var manualActionObject = {
						EXPECT_MOD_ID: 0.0,
						PERSON_ID: self.getCriterion().person_id,
						SERIES_ID: dataObject.SERIES_ID,
						EXPECTATION_ID: dataObject.EXPECT_ID,
						STEP_ID: dataObject.STEP_ID,
						SAT_PRSNL_ID: self.getCriterion().provider_id,
						MODIFIER_TYPE_CD: modifierTypeCd,
						MODIFIER_REASON_CD: 0.0,
						MODIFIER_DT_TM: new Date(),
						STATUS_IND: 1,
						LONG_TEXT_ID: 0.0,
						COMMENT: "",
						ORGANIZATION_ID: dataObject.ORGANIZATION_ID,
						EXPECT_SAT_ID: satisfierID,
						RECOMMENDATION_ID: dataObject.RECOMMENDATION_ID,
						FORCE_INSERT_IND: 0,
						RECOMMENDATION_ACTION_ID: 0.0,
						DUE_DATE_UTC: dataObject.DUE_DATE_UTC,
						useFutureDate: false
					};

					self.setActionObject(manualActionObject);

					// Pass 1 to mp_get_data_add_expectation to retrieve only the provider name, reasons and frequency code
					// Pass 2 to retrieve only the satisifer reasons
					// Pass 3 to retrieve provider name, reasons and frequency code and satisfier reasons
					var detailFlag = 0;

					if(isFreeText) {
						detailFlag = 1;
					} else {
						if (!self.getCurrentProviderName().length || !self.getReasonCodeSet().length || !self.getTimeUnitsCodeSet().length) {
							detailFlag = 3;
						} else {
							detailFlag = 2;
						}
					}

					self.getPopupObject().hide();
					self.m_sidePanel.setContents("<div class = 'recom-o2-modify-pre-loader'></div>");
					self.m_isSidePanelLoading = true;

					var recommendationsDataRequest = new ScriptRequest();

					recommendationsDataRequest.setProgramName("mp_get_data_add_expectation");
					recommendationsDataRequest.setParameterArray(["^MINE^", self.getCriterion().provider_id + ".0", detailFlag, satisfierID]);
					recommendationsDataRequest.setResponseHandler(function (replyObj) {
						// Save code set data only if it was retrieved
						if (detailFlag === 3 || detailFlag === 1) {
							self.saveCodeSetData(replyObj);
						}
						self.renderManualSatisfy(replyObj, actionMeaning, isFreeText);
						self.addEventHandlersForManualSatisfy();
						self.m_sidePanel.expandSidePanel();
						self.m_sidePanel.m_cornerCloseButton.hide();
						self.m_isSidePanelLoading = false;
					});
					recommendationsDataRequest.performRequest();
				}
			}
		});
	} else {
		// Remove the handler if popup is in a hidden state
		$(".recom-o2-satisfier-list").off();
	}
};

/**
 * Returns the modifier type code value from code set 30281 for the passed in cdf_meaning
 *
 * @param  {string} actionMeaning the string for which modifier type cd should be retrieved
 * 
 * @return {number}  the modifier type code value from code set 30281
 */
RecommendationsO2Component.prototype.getModifierTypeCd = function (actionMeaning) {

	if (typeof actionMeaning !== "string") {
		throw new Error("Invalid action meaning passed to getModifierTypeCd function");
	}

	// Convert manual to satisfy as the cdf_meaning for manual satisfier in codeset 30281 is "SATISFY" instead of "MANUAL"
	if (actionMeaning === "MANUAL") {
		actionMeaning = "SATISFY";
	}

	var modifierTypeCd = 0;
	var modifierTypes = this.getModifierTypesAndReasons().MODIFIER_TYPES;

	for (var i = modifierTypes.length; i--;) {
		if (modifierTypes[i].MODIFIER_TYPE_MEANING === actionMeaning) {
			modifierTypeCd = modifierTypes[i].MODIFIER_TYPE_CD;
			break;
		}
	}

	return modifierTypeCd;
};

/**
 * Renders the UI for any manual action that can be performed on an expectation
 *
 * @param  {object} replyObj     reply of mp_get_data_add_expectation
 *
 * @param  {string} manualAction the manual action being performed, e.g. : REFUSE
 *
 * @param {boolean} isFreeText Should be set to true if the selected expectation is a free text expectation
 */
RecommendationsO2Component.prototype.renderManualSatisfy = function (replyObj, manualAction, isFreeText) {

	if (typeof replyObj !== "object" || typeof manualAction !== "string" || typeof isFreeText !== "boolean") {
		throw new Error("Invalid parameter passed to renderManualSatisfy function");
	}

	var actionObject = this.getActionObject();
	var recomID = actionObject.RECOMMENDATION_ID;
	var compID = this.getComponentId();
	var disabledSaveButton = "";

	var dueDate = new Date();
	var currentDateForComparison = new Date(dueDate.getFullYear(),dueDate.getMonth(),dueDate.getDate());

	dueDate.setISO8601(actionObject.DUE_DATE_UTC);	
	var dueDateForComparison = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

	// If expectation's due date is in the future, set the date picker to expectation's due date
	if (dueDateForComparison > currentDateForComparison) {
		actionObject.useFutureDate = true;
	}

	switch (manualAction) {
	case "POSTPONE":
		this.m_currentAction = this.RECOMMENDATION_ACTION.POSTPONE;
		disabledSaveButton = actionObject.useFutureDate ? "" : "disabled";
		break;
	case "REFUSE":
		this.m_currentAction = this.RECOMMENDATION_ACTION.REFUSE;
		break;
	case "EXPIRE":
		this.m_currentAction = this.RECOMMENDATION_ACTION.EXPIRE;
		break;
	case "MANUAL":
		this.m_currentAction = this.RECOMMENDATION_ACTION.MANUAL_SATISFY;
		break;
	}

	var saveAndCancelButtonHTML = "<div id='recommendationsSPSatisfy" + compID + "' class='recom-o2-sp-actions'><div class='sp-button2 recom-o2-cancel-button' id='cancelButton" + recomID + compID + "'>" +
		i18n.CANCEL + "</div>" + "<div class='sp-button2 recom-o2-save-button " + disabledSaveButton + "' id='saveRecomButton" + recomID + compID + "'>" + i18n.SAVE + "</div></div>";

	this.m_sidePanel.setContents(this.createSatisfyHtml(replyObj.getResponse()), "recom-o2" + compID, isFreeText);

	// Attach date picker only for postpone and manual satisfy as only those actions have date picker button
	switch (manualAction) {
	case "POSTPONE":
		if (actionObject.useFutureDate) {
			this.attachDatePicker(recomID, "actionContainer", false, dueDate);	
		} else {
			this.attachDatePicker(recomID, "actionContainer", false, new Date());
		}
		
		break;
	case "MANUAL":
		this.attachDatePicker(recomID, "actionContainer", true, new Date());
		break;
	}

	this.m_sidePanel.setActionsAsHTML(saveAndCancelButtonHTML);

	// Since the full side panel content is scrollable, pass false to adjustScrollBarPosition function
	this.adjustScrollBarPosition(false);
};

/**
 * Creates HTML code for various actions(Postpone/Refuse/Cancel/Manual Satisfy) that can be performed on an expectation
 *
 * @param {object} responseObject reply of mp_get_data_add_expectation
 *
 * @param {boolean} isFreeText Should be set to true if selected expectation is a free text expectation
 *
 * @return {string} the html code that can be used to set the side panel contents
 */
RecommendationsO2Component.prototype.createSatisfyHtml = function (responseObject, isFreeText) {

	if (typeof responseObject !== "object") {
		throw new Error("Invalid parameter passed to createSatisfyHtml");
	}

	var actionObject = this.getActionObject();
	var recomID = actionObject.RECOMMENDATION_ID;
	var compID = this.getComponentId();
	var providerName = " " + this.getCurrentProviderName();
	var actionReasons = this.getModifierTypesAndReasons();
	var dateTime = new Date();
	
	var dateClass = "recom-o2-postpone-date-value recom-o2-common-style disabled";
	var contentHtml = "";
	var reasonIndex = 0;

	if (actionObject.useFutureDate) {
		dateTime.setISO8601(actionObject.DUE_DATE_UTC);
	} else {
		dateClass += " required-field-input";		
	}

	var expireReasons = actionReasons.EXPIRE_REASONS;
	var postponeReasons = actionReasons.POSTPONE_REASONS;
	var refuseReasons = actionReasons.REFUSE_REASONS;
	var satisfyReasons = actionReasons.SATISFY_REASONS;

	// For free text expectation we should always use the reasons retrieved from mp_get_hmi
	if(!isFreeText && responseObject.SATISFY_REASONS.length) {
		// If reasons are retrieved from filter_mean_reltn use those, else display all available reasons
		expireReasons = responseObject.SATISFY_REASONS;
		postponeReasons = responseObject.SATISFY_REASONS;
		refuseReasons = responseObject.SATISFY_REASONS;
		satisfyReasons = responseObject.SATISFY_REASONS;
	}

	// Create a hidden div to display error message when the script fails to save the modify
	var actionFailedHtml = "<div class = 'recom-o2-sp-err-msg hidden'></div>";

	switch (this.m_currentAction) {
	case this.RECOMMENDATION_ACTION.EXPIRE:
		contentHtml = "<span class = 'secondary-text'>" + this.m_i18nStrings.REASON_FOR_CANCEL + "</span></br>" +
			"<select class = 'recom-o2-satisfy-reasons recom-o2-common-style'>" + "<option value = '0'>&nbsp;--</option>";

		for (reasonIndex = 0; reasonIndex < expireReasons.length; reasonIndex++) {
			contentHtml += "<option value = '" + expireReasons[reasonIndex].REASON_CD + "'>" + expireReasons[reasonIndex].REASON_DISPLAY + "</option>";
		}
		contentHtml += "</select>";
		break;
	case this.RECOMMENDATION_ACTION.POSTPONE:
		contentHtml = "<span class = 'recom-o2-modify-required-field secondary-text'>" + this.m_i18nStrings.POSTPONE_UNTIL + "</span>";

		contentHtml += "<div class = 'recom-o2-postpone-ui'><div class = 'recom-o2-postpone-date-range'>";

		contentHtml += "<label class = 'recom-o2-radio-button-text'><input id = ''rangeRadioButton" + recomID + compID + "' type='radio' name= 'RangeOrDateSelector' class= 'recom-o2-postpone-radio-button' value='range' checked />" + this.m_i18nStrings.POSTPONE + "</label>" +
			"<input id='postponeRangeValue" + recomID + compID + "' class='recom-o2-common-style recom-o2-postpone-range-value' type='text' maxlength='3' size='3' onpaste='return false' />" +
			this.renderDropDownWithUnitsCodeSet("postpone", recomID, "");

		contentHtml += "<div class = 'recom-o2-postpone-date'>" + "<label class = 'recom-o2-radio-button-text'><input id = 'dateRadioButton" + recomID + compID + "' type='radio' name= 'RangeOrDateSelector' class= 'recom-o2-postpone-radio-button' value='date'/>" + i18n.DATE + "</label>" +
			"<input id='dateVal" + recomID + compID + "' type='text' size='10' class='" + dateClass + "' readonly='true' value = '" + dateTime.format(dateFormat.masks.shortDate2) +
			"'/><input type='button' id='dateValueButton" + recomID + compID + "' class='recom-o2-date-selector-button disabled'/></div></div>";

		contentHtml += "<div class = 'recom-o2-postpone-reason'><span class = 'secondary-text'>" + this.m_i18nStrings.REASON + "</span></br>" +
			"<select class = 'recom-o2-satisfy-reasons recom-o2-common-style'>" + "<option value = '0'>&nbsp;--</option>";

		for (reasonIndex = 0; reasonIndex < postponeReasons.length; reasonIndex++) {
			contentHtml += "<option value = '" + postponeReasons[reasonIndex].REASON_CD + "'>" + postponeReasons[reasonIndex].REASON_DISPLAY + "</option>";
		}
		contentHtml += "</select></div>";
		break;
	case this.RECOMMENDATION_ACTION.REFUSE:
		contentHtml = "<span class = 'secondary-text'>" + this.m_i18nStrings.REASON_FOR_REFUSAL + "</span></br>" +
			"<select class = 'recom-o2-satisfy-reasons recom-o2-common-style'>" + "<option value = '0'>&nbsp;--</option>";

		for (reasonIndex = 0; reasonIndex < refuseReasons.length; reasonIndex++) {
			contentHtml += "<option value = '" + refuseReasons[reasonIndex].REASON_CD + "'>" + refuseReasons[reasonIndex].REASON_DISPLAY + "</option>";
		}

		contentHtml += "</select>";
		break;
	case this.RECOMMENDATION_ACTION.MANUAL_SATISFY:
		contentHtml = "<span class = 'recom-o2-modify-required-field secondary-text'>" + this.m_i18nStrings.SATISFY_DATE + "</span>";

		contentHtml += "<div class = 'recom-o2-satisfy-action'><div class = 'recom-o2-satisfy-date-range'>";

		contentHtml += "<input id='dateVal" + recomID + compID + "' type='text' size='10' class='recom-o2-satisfy-date-value recom-o2-common-style' readonly='true' value = '" +
			dateTime.format(dateFormat.masks.shortDate2) + "'/><input type='button' id='dateValueButton" + recomID + compID + "' class='recom-o2-date-selector-button disabled'/></div>";

		contentHtml += "<div class = 'recom-o2-postpone-reason'><span class = 'secondary-text'>" + this.m_i18nStrings.REASON + "</span></br>" +
			"<select class = 'recom-o2-satisfy-reasons recom-o2-common-style'>" + "<option value = '0'>&nbsp;--</option>";

		for (reasonIndex = 0; reasonIndex < satisfyReasons.length; reasonIndex++) {
			contentHtml += "<option value = '" + satisfyReasons[reasonIndex].REASON_CD + "'>" + satisfyReasons[reasonIndex].REASON_DISPLAY + "</option>";
		}
		contentHtml += "</select></div>";
		break;
	}

	// Create the html for recorded for and Comments and append it to contentHtml
	var recordedForHtml = "<div class = 'recom-o2-action-recorded-for'>" + "<span class='secondary-text'>" + this.m_i18nStrings.RECORDED_FOR +
		"</span><br/><input class = 'recom-o2-provider-name' type = 'text' size = '" + providerName.length + "' readonly = 'true' value = '" + providerName + "'/></div>";

	var commentHtml = "<div class = 'recom-o2-comment-section'>" + "<span class = 'secondary-text'>" + i18n.COMMENTS + "</span><br/><textarea id='actionComment" +
		recomID + compID + "' class='recom-o2-satisfy-comment-area' rows='3' maxlength='1000' placeholder='" + this.m_i18nStrings.ADD_A_COMMENT + "'></textarea></div>";

	contentHtml += recordedForHtml + commentHtml;

	if (this.m_currentAction === this.RECOMMENDATION_ACTION.POSTPONE || this.m_currentAction === this.RECOMMENDATION_ACTION.MANUAL_SATISFY) {
		contentHtml += "</div>";
	}

	// Generate the complete HTML
	var actionHtml = "<div id=sidePanelScrollContainer" + compID + ">" +
		"<div id='actionContainer" + recomID + compID + "' class='recom-o2-action-controls'>" + actionFailedHtml + contentHtml + "</div></div>";

	return actionHtml;
};

/**
 * Adds event handlers for manual satisfiers such as Postpone/Refuse/Cancel and Manual Satisfy
 */
RecommendationsO2Component.prototype.addEventHandlersForManualSatisfy = function () {

	var self = this;
	var recomID = this.getActionObject().RECOMMENDATION_ID;
	var compID = this.getComponentId();
	var $actionContainer = this.m_$sidePanelContainer.find("#actionContainer" + recomID + compID);

	// Restrict input only to numbers for postpone value
	var numbersOnly = function (evt) {
		var charCode = evt.which ? evt.which : evt.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;
	};
	$actionContainer.on("keypress", ".recom-o2-postpone-range-value", numbersOnly);

	var postponeRangeHandler = function () {
		var currentField = $(this);
		var actionObject = self.getActionObject();
		var saveButton = self.m_$sidePanelContainer.find("#saveRecomButton" + recomID + compID);
		var dateValueButton = self.m_$sidePanelContainer.find("#dateValueButton" + recomID + compID);
		var dateInputBox = self.m_$sidePanelContainer.find("#dateVal" + recomID + compID);

		var postponeValue = 0;
		var postponeUnit = "";
		
		var postponeByInMilliSeconds = 0;
		var dueDate = new Date();

		var ONE_DAY_IN_MILLISECONDS = 86400000;
		var ONE_WEEK_IN_DAYS = 7;
		var ONE_MONTH_IN_DAYS = 30;
		var ONE_YEAR_IN_DAYS = 365;

		if (actionObject.useFutureDate) {
			dueDate.setISO8601(actionObject.DUE_DATE_UTC);
		}

		switch (currentField.attr("id")) {
		case "postponeRangeValue" + recomID + compID:
			postponeValue = parseInt(currentField.val(), 10);
			postponeUnit = currentField.next("#postponeOption" + recomID + compID).find("option:selected").attr("meaning");
			break;
		case "postponeOption" + recomID + compID:
			postponeValue = parseInt(currentField.prev("#postponeRangeValue" + recomID + compID).val(), 10);
			postponeUnit = currentField.find("option:selected").attr("meaning");
			break;
		}

		if (isNaN(postponeValue)) {
			postponeByInMilliSeconds = 0;
		} else {
			switch (postponeUnit) {
			case "DAYS":
				postponeByInMilliSeconds = postponeValue * ONE_DAY_IN_MILLISECONDS;
				break;
			case "WEEKS":
				postponeByInMilliSeconds = postponeValue * ONE_WEEK_IN_DAYS * ONE_DAY_IN_MILLISECONDS;
				break;
			case "MONTHS":
				postponeByInMilliSeconds = postponeValue * ONE_MONTH_IN_DAYS * ONE_DAY_IN_MILLISECONDS;
				break;
			case "YEARS":
				postponeByInMilliSeconds = postponeValue * ONE_YEAR_IN_DAYS * ONE_DAY_IN_MILLISECONDS;
				break;
			}
		}

		dueDate.setTime(dueDate.getTime() + postponeByInMilliSeconds);
		dateValueButton.datepicker("setDate", dueDate);

		actionObject.MODIFIER_DT_TM = dateValueButton.datepicker("getDate");

		// Enable the save button if the date selected is greater than today's date as postpone is not allowed for current date, else disable the save button
		if (self.isCurrentDate(actionObject.MODIFIER_DT_TM)) {
			if (!saveButton.hasClass("disabled")) {
				saveButton.addClass("disabled");

				if(!dateInputBox.hasClass("required-field-input")) {
					dateInputBox.addClass("required-field-input");
				}
			}
		} else {
			saveButton.removeClass("disabled");
			dateInputBox.removeClass("required-field-input");
		}
	};

	$actionContainer.on("keyup", "#postponeRangeValue" + recomID + compID, postponeRangeHandler);
	$actionContainer.on("change", "#postponeOption" + recomID + compID, postponeRangeHandler);

	var postponeDateHandler = function () {
		var actionObject = self.getActionObject();
		var saveButton = self.m_$sidePanelContainer.find("#saveRecomButton" + recomID + compID);
		var dateInputBox = $(this); 

		actionObject.MODIFIER_DT_TM = self.m_$sidePanelContainer.find("#dateValueButton" + recomID + compID).datepicker("getDate");

		// Enable the save button if the date selected is greater than today's date as postpone is not allowed for current date, else disable the save button
		if (self.isCurrentDate(actionObject.MODIFIER_DT_TM)) {
			if (!saveButton.hasClass("disabled")) {
				saveButton.addClass("disabled");

				if(!dateInputBox.hasClass("required-field-input")) {
					dateInputBox.addClass("required-field-input");
				}
			}
		} else {
			saveButton.removeClass("disabled");
			dateInputBox.removeClass("required-field-input");
		}
	};

	$actionContainer.on("change", "#dateVal" + recomID + compID, postponeDateHandler);

	var radioButtonHandler = function () {
		switch (this.value) {
		case "range":
			// On click of Postpone radio button, disable the date fields, enable postpone range fields and update the date in date picker
			self.m_$sidePanelContainer.find("#dateVal" + recomID + compID).addClass("disabled");
			$(this).parent().next("#postponeRangeValue" + recomID + compID).removeAttr("disabled").trigger("keyup").next("#postponeOption" + recomID + compID).removeAttr("disabled");
			break;
		case "date":
			// On Click of Date radio button, disable the postpone range field and enable the date picker field
			self.m_$sidePanelContainer.find("#postponeRangeValue" + recomID + compID).attr("disabled", "true").next("#postponeOption" + recomID + compID).attr("disabled", "true");
			$(this).parent().next("#dateVal" + recomID + compID).removeClass("disabled");
			break;
		}
	};

	$actionContainer.on("click", ".recom-o2-postpone-radio-button", radioButtonHandler);

	$actionContainer.on("change", ".recom-o2-satisfy-reasons", function () {
		self.getActionObject().MODIFIER_REASON_CD = parseInt(this.value, 10);
	});

	$actionContainer.on("focusout", "#actionComment" + recomID + compID, function () {
		self.getActionObject().COMMENT = this.value;
	});

	$actionContainer.on("paste keyup change", "#actionComment" + recomID + compID, function () {
		var maxLength = 1000;
		var currentCommentText = $(this).val();
		if (currentCommentText.length > maxLength) {
			$(this).val(currentCommentText.substring(0, maxLength));
		}
	});

	$actionContainer.on("change", ".recom-o2-postpone-date-value", function () {
		self.m_$sidePanelContainer.find("#dateRadioButton" + recomID + compID).attr("checked", true);
	});
};

/**
 * This function compares the passed in date with today's date and returns true if it is same as today's date, else returns false
 * It compares only the date part ignoring the time part.
 *
 * @param  {date}  dateObject the dateObject to be compared
 *
 * @return {boolean}  returns true if passed in date is equal to today's date, else returns false
 */
RecommendationsO2Component.prototype.isCurrentDate = function (dateObject) {

	var currentDate = new Date();

	if (typeof dateObject !== "object") {
		throw new Error("Invalid date parameter sent to isCurrentDate function");
	}

	if (dateObject.getDate() === currentDate.getDate() && dateObject.getMonth() === currentDate.getMonth() && dateObject.getFullYear() === currentDate.getFullYear()) {
		return true;
	} else {
		return false;
	}
};

/**
 * This function calls PCO_HM_ENS_RECOMMENDATION satisfy an expectation
 */
RecommendationsO2Component.prototype.satisfyExpectation = function () {

	var self = this;
	var compID = self.getComponentId();
	var actionObject = self.getActionObject();
	var recomID = actionObject.RECOMMENDATION_ID;
	var scriptRequest = new ScriptRequest();

	var PCO_HM_ENS_RECOMMENDATION = {
		APPLICATION: 966300,
		TASK: 966320,
		REQUEST: 966321
	};

	scriptRequest.setProgramName("MP_EXEC_STD_REQUEST");
	scriptRequest.setParameterArray(["^MINE^", "^^", PCO_HM_ENS_RECOMMENDATION.APPLICATION, PCO_HM_ENS_RECOMMENDATION.TASK, PCO_HM_ENS_RECOMMENDATION.REQUEST]);
	scriptRequest.setDataBlob(this.getRecommendationActionBlobIn());
	scriptRequest.setResponseHandler(function (scriptReply) {

		if (scriptReply.getStatus() === "S") {
			self.m_$sidePanelContainer.find("#actionContainer" + recomID + compID).off();
			self.getActionObject().saveSuccessful = true;
			self.retrieveComponentData();
		} else {
			var modifyFailedContainer = self.m_$sidePanelContainer.find(".recom-o2-sp-err-msg");
			if (modifyFailedContainer.hasClass("hidden")) {
				var saveErrorHTML = MP_Core.generateUserMessageHTML("error", self.m_i18nStrings.SATISFY_FAILED_TEXT, "", "recom-o2-modify-failure");
				modifyFailedContainer.empty().html(saveErrorHTML);
				modifyFailedContainer.removeClass("hidden");
			}

			// Enable the save button if save has failed so that user can attempt to save again
			self.m_$sidePanelContainer.find("#saveRecomButton" + recomID + compID).removeClass("disabled");
		}
	});

	this.m_$sidePanelContainer.find("#saveRecomButton" + recomID + compID).addClass("disabled");
	scriptRequest.performRequest();

};

/**
 * This function returns the stringified request structure which can be used to call the back-end script
 *
 * this.m_actionObject must be populated before calling this function
 *
 * @return {string} stringified request structure
 */
RecommendationsO2Component.prototype.getRecommendationActionBlobIn = function () {

	var recomActionRequest = this.getScriptRequestStructure(966321);
	var actionObject = this.getActionObject();

	// Set time to 12 Noon to avoid DST/UTC issues
	actionObject.MODIFIER_DT_TM.setHours(12);
	actionObject.MODIFIER_DT_TM.setMinutes(0);
	actionObject.MODIFIER_DT_TM.setSeconds(0);

	//Clean up the action object not to have unnecessary details for performing the request
	delete actionObject.DUE_DATE_UTC;
	delete actionObject.useFutureDate;
	delete actionObject.CURRENT_STATUS_FLAG;
	delete actionObject.LAST_SATISFIED_DATE;
	delete actionObject.APPROX_NEXT_DUE_DATE;

	recomActionRequest.REQUESTIN.QUAL.push(actionObject);
	recomActionRequest.REQUESTIN.ALLOW_RECOMMENDATION_SERVER_IND = 1;

	return this.getCriterion().is_utc ? MP_Util.enhancedStringify(recomActionRequest, 0, 0, 1) : MP_Util.enhancedStringify(recomActionRequest);

};
/**
 * This function attached the event handler for the clinical Note link within the history section of sidepanel
  * @param {Object} data 
 */
RecommendationsO2Component.prototype.addEventHandlersForClinicalNoteLinkInSidePanel = function () {
	var component = this;
	this.m_$sidePanelContainer.on("click", ".recom-o2-clinical-link", function () {
		var clinicalNoteObj = $(this);
		var clinicalEventId = parseInt(clinicalNoteObj.attr("data-clinical-event-id"), 10);
		MPAGES_EVENT("CLINICALNOTE", component.getCriterion().person_id + "|" + component.getCriterion().encntr_id + "|[" + clinicalEventId + "]|" + "Clinical Notes|15||||");
	});
};
/**
 * This function attached the event handler for the undo link within the sidepanel
 * this.m_actionObject will be populated within the event handler
 * @param {Object} data 
 */
RecommendationsO2Component.prototype.addEventHandlersForUndoActionInSidePanel = function (data) {
	
	var component = this;
	
	//Add click handler to the undo link in the side panel
	this.m_$sidePanelContainer.on("click", ".recom-o2-history-item-undo-option", function () {
		var actionItemObj = $(this);
		var modifierID = parseInt(actionItemObj.attr('data-modifier-id'), 10);
		var commentText = actionItemObj.attr('data-comment-text');
		var reasonText = actionItemObj.attr('data-reason-text');
		var providerName = actionItemObj.attr('data-providername-text');
		var modifierTypeCd = parseInt(actionItemObj.attr('data-modifier-type-cd'), 10);
		var recommendationActionId = parseInt(actionItemObj.attr('data-action-id'), 10);
		var actionOrgId = parseInt(actionItemObj.attr('data-org-id'), 10);
		var currentStatusFlag = parseInt(actionItemObj.attr('data-status-flag'), 10);
		var approximateNextDueDate = actionItemObj.attr('data-next-due-date');
		var lastSatisfiedDateString = actionItemObj.closest('.recom-o2-rp-history').attr('data-last-satisfied-date');

		var manualActionObject = {
			EXPECT_MOD_ID : modifierID,
			PERSON_ID : component.getCriterion().person_id,
			SERIES_ID : data.SERIES_ID,
			EXPECTATION_ID : 0.0,
			STEP_ID : 0.0,
			SAT_PRSNL_ID : component.getCriterion().provider_id,
			MODIFIER_TYPE_CD : modifierTypeCd,
			MODIFIER_REASON_CD : 0.0,
			MODIFIER_DT_TM : new Date(),
			STATUS_IND : 0,
			LONG_TEXT_ID : 0.0,
			COMMENT : commentText,
			ORGANIZATION_ID : actionOrgId,
			EXPECT_SAT_ID : 0.0,
			RECOMMENDATION_ID : data.RECOMMENDATION_ID,
			FORCE_INSERT_IND : 0,
			RECOMMENDATION_ACTION_ID : recommendationActionId,
			CURRENT_STATUS_FLAG : currentStatusFlag,
			LAST_SATISFIED_DATE : lastSatisfiedDateString,
			APPROX_NEXT_DUE_DATE : approximateNextDueDate,
			REASON_TEXT : reasonText,
			PROVIDER_NAME : providerName
		};

		component.setActionObject(manualActionObject);
		component.setCurrentActionType(component.RECOMMENDATION_ACTION.UNDO);
		component.handleUndoAction();
	});
};

/**
 * This function handles the undo option selected by retrieving required data and
 * attaching the undo UI to the sidepanel.
 */
RecommendationsO2Component.prototype.handleUndoAction = function () {
	
	var component = this;
	var isAddDataAvailable = true;
	var isUndoDataAvailable = true;
	var detailedDataParameter = 0; //Default it to 0.
	
	if (!component.getCurrentProviderName().length || !component.getReasonCodeSet().length || !component.getTimeUnitsCodeSet().length) {
		isAddDataAvailable = false;
		
		//Sets the first bit of the detailedDataParameter
		//This is sent as the last parameter to mp_get_data_add_expectation indicating that add data is required
		detailedDataParameter = detailedDataParameter | 1; 
	}
	if(!component.getUndoReasonCodeSet().length){
		isUndoDataAvailable = false;
		
		//Sets the 3rd bit of the detailedDataParameter
		//This is sent as the last parameter to mp_get_data_add_expectation indicating that undo reasons are required
		detailedDataParameter = detailedDataParameter | 4; 
	}
	
	// Retrieve data if it's not available at the constructor level
	if (!isAddDataAvailable || !isUndoDataAvailable) {

		// Show Preloader and set side panel loading indicator to true
		component.m_sidePanel.setContents("<div class = 'recom-o2-modify-pre-loader'></div>");
		component.m_isSidePanelLoading = true;

		var recommendationsDataRequest = new ScriptRequest();
		recommendationsDataRequest.setProgramName("mp_get_data_add_expectation");
		recommendationsDataRequest.setParameterArray(["^MINE^", component.getCriterion().provider_id + ".0", detailedDataParameter]);
		recommendationsDataRequest.setResponseHandler(function (replyObj) {
			//Save the add code set data only if the call was made to retrieve that data
			if(!isAddDataAvailable){
				component.saveCodeSetData(replyObj);
			}
			
			//Save the undo reasons code set data only if the call was made to retrieve that data
			if (!isUndoDataAvailable) {
				if (replyObj.getStatus() === "S") {
					var undoDataRequired = replyObj.getResponse();
					component.setUndoReasonCodeSet(undoDataRequired.UNDO_REASONS);
				}
			}
			//Render the UI and attach event handlers for the form fields
			component.renderUndoActionContentInSidePanel();
			component.addEventHandlersForUndoFields();
			component.m_sidePanel.expandSidePanel();
			component.m_sidePanel.m_cornerCloseButton.hide();
			component.m_isSidePanelLoading = false;
		});
		recommendationsDataRequest.performRequest();
	} else {
		component.renderUndoActionContentInSidePanel();
		component.addEventHandlersForUndoFields();
		component.m_sidePanel.expandSidePanel();
		component.m_sidePanel.m_cornerCloseButton.hide();
		component.m_isSidePanelLoading = false;
	}
};

/**
 * This function renders the UI required for undo action to the side panel.
 */
RecommendationsO2Component.prototype.renderUndoActionContentInSidePanel = function(){
	var componentID = this.m_componentId;
	var recomID = this.getActionObject().RECOMMENDATION_ID;

	var saveAndCancelButtonHTML = "<div id='recommendationsSPUndoAction" + componentID +
		"' class='recom-o2-sp-actions'><div class='sp-button2 recom-o2-cancel-button' id='cancelButton" + recomID + componentID + "'>" +
		i18n.CANCEL + "</div>" + "<div class='sp-button2 recom-o2-save-button' id='saveRecomButton" + recomID + componentID + "'>" + i18n.SAVE + "</div></div>";
	// Set Side Panel Contents
	this.m_sidePanel.setContents(this.createUndoFormFieldsHtml(), "recom-o2" + componentID);
	this.m_sidePanel.setActionsAsHTML(saveAndCancelButtonHTML);
	// Since the full side panel content is scrollable, pass false to adjustScrollBarPosition function
	this.adjustScrollBarPosition(false);
};

/**
 * This function creates and returns the html content for the undo fields.
 * @return {String} - undoFieldsHtml
 */
RecommendationsO2Component.prototype.createUndoFormFieldsHtml = function () {
	var componentId = this.m_componentId;
	var recomi18n = i18n.discernabu.recommendations_o2;
	var currentActionItem = this.getActionObject();
	var recomID = currentActionItem.RECOMMENDATION_ID;
	var undoFieldsContentHtml = "";
	var providerName = this.getCurrentProviderName()||"--";
	var undoReasons = this.getUndoReasonCodeSet();
	var undoLabel = this.m_i18nStrings.UNDO;
	var statusFlag = this.getActionDescription(currentActionItem.CURRENT_STATUS_FLAG, false);
	var nextDueDateLabel = this.m_i18nStrings.UNTIL + "&nbsp;" + currentActionItem.APPROX_NEXT_DUE_DATE;
	var lastSatisfiedLabel = this.m_i18nStrings.LAST_SATISFIED + "&nbsp;" + currentActionItem.LAST_SATISFIED_DATE;
	
	// Create a hidden div to display error message when the script fails to save the modify
	var undoActionFailedHtml = "<div class = 'recom-o2-sp-err-msg hidden'></div>";
	
	var undoTitleLabelHtml = "<div class = 'recom-o2-undo-title'>" + undoLabel + "</div>"
			+ "<div class = 'recom-o2-satisfier-action-info'>" 
			+ "<div class = 'recom-o2-status-flag-display'>" + statusFlag + "</div>"
			+ "<div class = 'recom-o2-history-item-reason-info secondary-text'>" + nextDueDateLabel +  "&nbsp;" + "(" + currentActionItem.REASON_TEXT + ")" + "</div>"
			+ "<div class = 'recom-o2-history-item-comment-info'>" + "<span class = 'secondary-text'>" + recomi18n.COMMENT + ":" +"&nbsp;" +  "</span>" + currentActionItem.COMMENT + "</div>"
			+ "<div class = 'recom-o2-history-item-provider-info'>"  + "<span class = 'secondary-text'>" + recomi18n.RECORDED_FOR + ":&nbsp;" + "</span>" + currentActionItem.PROVIDER_NAME + "</div>"
			+ "</br>"
			+ "</div>";



	// Create html content for the reason
	undoFieldsContentHtml = undoTitleLabelHtml + "<span class = 'secondary-text'>" + this.m_i18nStrings.REASON_FOR_UNDO + "</span></br>" +
		"<select class = 'recom-o2-undo-reasons recom-o2-common-style'>" + "<option value = '0'>&nbsp;--</option>";

	for (var reasonIndex = 0, reasonsLength = undoReasons.length; reasonIndex < reasonsLength; reasonIndex++) {
		undoFieldsContentHtml += "<option value = '" + undoReasons[reasonIndex].REASON_CD + "'>" + undoReasons[reasonIndex].REASON_DISPLAY + "</option>";
	}
	undoFieldsContentHtml += "</select>";

	// Create the html for recorded for and Comments and append it to undoFieldsContentHtml
	var recordedForHtml = "<div class = 'recom-o2-action-recorded-for'>" + "<span class='secondary-text'>" 
			+ this.m_i18nStrings.RECORDED_FOR +	"</span><br/><span class = 'recom-o2-undo-provider-name'>" + providerName + "</span></div>";

	var commentHtml = "<div class = 'recom-o2-comment-section'>" + "<span class = 'secondary-text'>" + i18n.COMMENTS + "</span><br/>" 
			+ "<textarea id='undoActionComment" + recomID + componentId + "' class='recom-o2-undo-comment-area' rows='3' maxlength='1000' placeholder='" 
			+ this.m_i18nStrings.ADD_A_COMMENT + "'></textarea></div>";

	undoFieldsContentHtml += recordedForHtml + commentHtml;

	// Generate the complete HTML
	var undoFieldsHtml = "<div id=sidePanelScrollContainer" + componentId + ">"
			+ "<div id='undoActionContainer" + recomID + componentId + "' class='recom-o2-action-controls'>" 
			+ undoActionFailedHtml + undoFieldsContentHtml + "</div></div>";

	return undoFieldsHtml;
};

/**
 * This function creates and attaches event handlers to the undo fields.
 */
RecommendationsO2Component.prototype.addEventHandlersForUndoFields = function(){
	var component = this;
	var recomID = this.getActionObject().RECOMMENDATION_ID;
	var componentID = this.m_componentId;
	var undoActionContainer = this.m_$sidePanelContainer.find("#undoActionContainer" + recomID + componentID);
	
	//When the undo reason is changed, update the actionObject accordingly.
	undoActionContainer.on("change", ".recom-o2-undo-reasons", function () {
		var reasonSelected = $(this).find('option:selected').val();
		component.getActionObject().MODIFIER_REASON_CD = parseInt(reasonSelected, 10);
	});
	
	//When the undo comment is updated, update the actionObject accordingly.
	undoActionContainer.on("focusout", "#undoActionComment" + recomID + componentID, function () {
		component.getActionObject().COMMENT = $(this).val();
	});
	
	//Attch event handler to handle 1000 limit character in the comment field for IE8 and 9.
	undoActionContainer.on("paste keyup change", "#undoActionComment" + recomID + componentID, function () {
		var maxLength = 1000;
		var currentCommentText = $(this).val();
		if (currentCommentText.length > maxLength) {
			$(this).val(currentCommentText.substring(0, maxLength));
		}
	});
};

/**
 * This function Performs the undo action on the selected action.
 * Takes appropriate action on success and failure.
 * @param {Object} - saveButtonObj -helps in disabling/enabling the save button.
 */
RecommendationsO2Component.prototype.undoExpectationAction = function (saveButtonObj) {
	var component = this;
	var recomID = component.getActionObject().RECOMMENDATION_ID;
	var PCO_HM_ENS_RECOMMENDATION = {
		APPLICATION : 966300,
		TASK : 966320,
		REQUEST : 966321
	};
	var scriptRequest = new ScriptRequest();
	scriptRequest.setProgramName("MP_EXEC_STD_REQUEST");
	scriptRequest.setParameterArray(["^MINE^", "^^", PCO_HM_ENS_RECOMMENDATION.APPLICATION, PCO_HM_ENS_RECOMMENDATION.TASK, PCO_HM_ENS_RECOMMENDATION.REQUEST]);
	scriptRequest.setDataBlob(component.getRecommendationActionBlobIn());
	scriptRequest.setResponseHandler(function (scriptReply) {

		if (scriptReply.getStatus() === "S") {
			
			//When undo is successful, remove the event handlers and refresh the component.
			component.m_$sidePanelContainer.find("#undoActionContainer" + recomID + component.m_componentId).off();
			component.getActionObject().saveSuccessful = true;
			component.retrieveComponentData();
		} else {
			
			//When undo fails, enable the save button and display the error message.
			saveButtonObj.removeClass("disabled");
			var undoFailedMessageContainer = component.m_$sidePanelContainer.find(".recom-o2-sp-err-msg");
			if (undoFailedMessageContainer.hasClass("hidden")) {
				var saveErrorHTML = MP_Core.generateUserMessageHTML("error", component.m_i18nStrings.UNDO_FAILED, "", "recom-o2-modify-failure");
				undoFailedMessageContainer.empty().html(saveErrorHTML);
				undoFailedMessageContainer.removeClass("hidden");
			}
		}
	});
	saveButtonObj.addClass("disabled");
	scriptRequest.performRequest();
};

/**
 * Function to retain the last selected row face-up
 *
 * @param self   'this' object
 * @return null
 */
RecommendationsO2Component.prototype.updateSelection = function (self)
	{
	var modifiedRowId = "";
	var modifiedRowObject = null;
	var compID = self.getComponentId();

	if( self.m_systemSatisfierAction && self.m_systemSatisfierAction.modifiedRowId)
	{
		modifiedRowId = self.m_systemSatisfierAction.modifiedRowId;
	}

	/* If Grouping is applied, id will be in the format of recom-o2+compID:GroupName:rowNumber 
	 * Create a regex and find the object using filter function
	 */
	if (self.m_recommendationsTable.isGroupingApplied()) {
		
		var reObj = new RegExp("recom-o2" + compID + ":\\w+:" + modifiedRowId + "$");
		modifiedRowObject = self.m_$tableView.find("dl").filter(function () {
			return this.id.match(reObj);
		});
	} else {
		modifiedRowObject = self.m_$tableView.find("#recom-o2" + compID + "\\:" + modifiedRowId);
	}
	/*
	* reset the satisfier object and update the component table.
	*/
	self.m_systemSatisfierAction.componentId = null;
	self.m_systemSatisfierAction.recommendationId = null;
	self.m_systemSatisfierAction.modifiedRowId = null;
	self.updateInfo(modifiedRowObject, self.m_recommendationsTable.getRowById(modifiedRowId).getResultData(), false, self.refTextResponse);

	}
	
/**
* Function to handle system satisfier action.
* @param {object} actionMeaning  action meaning powerform / order / prescription
* @param dataObject {object} data object  object containing user action
* @param selectedSatisfierId  selectedSatisfierId selected satisfier id.
* return null
*/
RecommendationsO2Component.prototype.systemSatisfierHandler = function(actionMeaning , dataObject, selectedSatisfierId) {

	var criterion = this.getCriterion();
	var personId = criterion.person_id;
	var encounterId = criterion.encntr_id;
	
	var	venueType = null;
	var self = this;
	
	var addToScratchPad	= function (componentId)
	{		
		var orderMnemonic = null;
		var orderSynonymId = null;
		
		for (var satisfierIndex = 0; satisfierIndex < dataObject.SATISFIERS.length; satisfierIndex++) {
		
			if(dataObject.SATISFIERS[satisfierIndex].EXPECT_SAT_ID === selectedSatisfierId )
			{
				orderMnemonic = (dataObject.SATISFIERS[satisfierIndex].ORDER_MNEMONIC) ? dataObject.SATISFIERS[satisfierIndex].ORDER_MNEMONIC :"";
				orderSynonymId = (dataObject.SATISFIERS[satisfierIndex].ENTRY_ID) ? dataObject.SATISFIERS[satisfierIndex].ENTRY_ID :0.0;				
			} // end if
		} // end for

		//create scratchpad object
		var scratchpadObj = {};
		scratchpadObj.componentId = componentId;
		scratchpadObj.addedFrom = "Recommendations";
		//Location where the favorite was added from
		scratchpadObj.favId = ""+componentId+selectedSatisfierId; 
		scratchpadObj.favType = 0;
		//0: Orderable; 1: Careset; 2: PowerPlan
		scratchpadObj.favName = null;
		//Display name of orderable/Careset/PowerPlan
		scratchpadObj.favOrderSentDisp = null;
		//Display name of order sentence, or if PowerPlan it displays the system name of the PowerPlan,
		//not the customizable one in favName above
		scratchpadObj.favParam = null;
		scratchpadObj.favSynId = null;
		scratchpadObj.favVenueType = venueType;
		scratchpadObj.favSentId = null;
		scratchpadObj.favPPEventType = null;
		
		//order
		scratchpadObj.favName = orderMnemonic;
		//Display name of orderable
		scratchpadObj.favOrderSentDisp = "";
		scratchpadObj.favSynId = orderSynonymId+".0";
		scratchpadObj.favSentId = "0.0";
		scratchpadObj.favParam = scratchpadObj.favSynId + "|" + venueType + "|" + "0.0";
		scratchpadObj.favNomenIds = '""';
		
		var srObj = self.getScratchpadSharedResourceObject();
		if (srObj) {
			var dataObj = srObj.getResourceData();
			if (!dataObj) {
				return null;
			} else {
				var scratchpadArr = dataObj.scratchpadObjArr;
				if (scratchpadArr) {
					scratchpadArr.push(scratchpadObj);
				}
				dataObj.scratchpadObjArr = scratchpadArr;
				//Update the SharedResource.
				MP_Resources.setSharedResourceData(srObj.getName(), dataObj);
				//notify consumers that something has been added to or deleted from the shared resource
				srObj.notifyResourceConsumers(false, scratchpadObj);
				return dataObj;
			} // end else
		}// end if
		
	};	
	
	
	switch (actionMeaning) {
		case "POWERFORM":
			var activityId = 0.0;
			var chartMode = 0;
			var powerformId = 0;
			for (var satisfierIndex = 0; satisfierIndex < dataObject.SATISFIERS.length; satisfierIndex++) {
		
				if(dataObject.SATISFIERS[satisfierIndex].EXPECT_SAT_ID === selectedSatisfierId )
				{					
					powerformId = (dataObject.SATISFIERS[satisfierIndex].ENTRY_ID) ? dataObject.SATISFIERS[satisfierIndex].ENTRY_ID :0;
				} // end if
			}	 
			var mpagePowerFormObj = CERN_Platform.getDiscernObject("POWERFORM");
			if(mpagePowerFormObj)
			{				
				mpagePowerFormObj.OpenForm(personId, encounterId, powerformId, activityId, chartMode);
				this.m_systemSatisfierAction.componentId = this.getComponentId();
				this.m_systemSatisfierAction.recommendationId = dataObject.RECOMMENDATION_ID;
				// refresh the component
				this.retrieveComponentData();
			} 
			break;
			
		case "ORDER":			
			venueType = 0; // - inpatient / ambulatory med in-office
			addToScratchPad(this.getComponentId());
			this.m_systemSatisfierAction.componentId = this.getComponentId();
			this.m_systemSatisfierAction.recommendationId = dataObject.RECOMMENDATION_ID;			
			this.retrieveComponentData();					
			break;
			
		case "PRESCRIPTION":			
			venueType = 1; // - discharge med as Rx or ambulatory med as Rx
			addToScratchPad(this.getComponentId());
			this.m_systemSatisfierAction.componentId = this.getComponentId();
			this.m_systemSatisfierAction.recommendationId = dataObject.RECOMMENDATION_ID;			
			this.retrieveComponentData();
			break;
		case "PROCEDURE":
			//Set the current action type to add procedure.
			this.setCurrentActionType(this.RECOMMENDATION_ACTION.SYSTEM_SATISFY_PROCEDURE);
			
			//Store only the required fields that will change for the request and will be used in the event handlers
			var addProcedureActionObject = {
				"PROVIDER_ID" : this.getCriterion().provider_id,
				"PROVIDER_NAME" : "",
				"COMMENTS" : "",
				"NOMENCLATURE_ID" : this.m_nomenclatureId,
				"FREE_TEXT_LOCATION" : ""
			};
			addProcedureActionObject.RECOMMENDATION_ID = dataObject.RECOMMENDATION_ID;
			this.setAddProcedureAction(addProcedureActionObject);
			this.handleAddProcedureAction();
			break;
		
	}// end switch	

}

/**
 * Get Scratchpad Shared Resource object
 * @return {Object} sharedResourceObj : Scratchpad shared resource object
 */
RecommendationsO2Component.prototype.getScratchpadSharedResourceObject =  function() {
			var sharedResourceObj = null;
			var sharedResourceName = "scratchpadSR";
			//Get the shared resource
			sharedResourceObj = MP_Resources.getSharedResource(sharedResourceName);
			if (!sharedResourceObj) {
				sharedResourceObj = this.initializeScratchpadSharedResource(sharedResourceName);
			}
			return sharedResourceObj;
}

/**
 * Create scratchpad Shared Resource.
 * @param {string} sharedResourceName : The name of the shared resource to create
 * @return {Object} sharedResourceObj : Scratchpad shared resource object
 */
RecommendationsO2Component.prototype.initializeScratchpadSharedResource = function (sharedResourceName) {
		var sharedResourceObj = null;
		var dataObj = {};
		sharedResourceObj = new SharedResource(sharedResourceName);
		//Create te object that will be stored in the SharedResource
		dataObj.scratchpadObjArr = [];
		//Set the available flag to true
		sharedResourceObj.setIsAvailable(true);
		//Set the shared resource data object
		sharedResourceObj.setResourceData(dataObj);
		//Set the shared resource event listener object
		var object = {};
		sharedResourceObj.setEventListenerObject(object);
		//Set the shared resource event listener flag
		sharedResourceObj.setEventListenerFlag(EventListener.EVENT_SCRATCHPAD_COUNT_UPDATE);
		//Add the shared resource so other components can access it
		MP_Resources.addSharedResource(sharedResourceObj.getName(), sharedResourceObj);
		return sharedResourceObj;
	};	
	
/**
 *handleAddProcedureAction - makes a request to mp_get_data_add_expectation if the current provider is not availble
 *Responsible for calling functions to create add procedure fields and add event handlers
 */
RecommendationsO2Component.prototype.handleAddProcedureAction = function () {
	var component = this;
	// Retrieve currently logged-in provider name if it's not available at the constructor level
	if (!component.getCurrentProviderName().length) {
		// Show Preloader and set side panel loading indicator to true
		component.m_sidePanel.setContents("<div class = 'recom-o2-modify-pre-loader'></div>");
		component.m_isSidePanelLoading = true;

		var recommendationsDataRequest = new ScriptRequest();
		recommendationsDataRequest.setProgramName("mp_get_data_add_expectation");
		recommendationsDataRequest.setParameterArray(["^MINE^", component.getCriterion().provider_id + ".0", 1]);
		recommendationsDataRequest.setResponseHandler(function (replyObj) {
			//Save the add code set data only if the call was made to retrieve that data
			component.saveCodeSetData(replyObj);
			//Render the UI and attach event handlers for the form fields
			component.createAddProcedureContentInSidePanel();
			component.addEventHandlersForAddProdecureFields();
			component.m_sidePanel.expandSidePanel();
			component.m_sidePanel.m_cornerCloseButton.hide();
			component.m_isSidePanelLoading = false;
		});
		recommendationsDataRequest.performRequest();
	} else {
		component.createAddProcedureContentInSidePanel();
		component.addEventHandlersForAddProdecureFields();
		component.m_sidePanel.expandSidePanel();
		component.m_sidePanel.m_cornerCloseButton.hide();
		component.m_isSidePanelLoading = false;
	}
};

/**
 * createAddProcedureContentInSidePanel - Create Add-Procedure Content in the sidepanel.
 */
RecommendationsO2Component.prototype.createAddProcedureContentInSidePanel = function () {
	var componentID = this.m_componentId;
	var recomID = this.getAddProcedureAction().RECOMMENDATION_ID;
		
	var saveAndCancelButtonHTML = "<div id='recommendationsSPAddProcedureAction" + componentID +
		"' class='recom-o2-sp-actions'><div class='sp-button2 recom-o2-cancel-button' id='cancelButton" + recomID + componentID + "'>" +
		i18n.CANCEL + "</div>" + "<div class='sp-button2 recom-o2-save-button disabled' id='saveRecomButton" + recomID + componentID + "'>" + i18n.SAVE + "</div></div>";
	// Set Side Panel Contents
	this.m_sidePanel.setContents(this.createAddProcedureFields(), "recom-o2" + componentID);
	this.addFuzzyDateControlToSidePanel();
	this.addPersonnelSearchToSidePanel();
	this.m_sidePanel.setActionsAsHTML(saveAndCancelButtonHTML);
	// Since the full side panel content is scrollable, pass false to adjustScrollBarPosition function
	this.adjustScrollBarPosition(false);
};

/**
 * Create Add-Procedure Fields in the sidepanel.
 * @return the html content with the add-procedure fields
 */
RecommendationsO2Component.prototype.createAddProcedureFields = function () {
	var addProcedureHtml = "";
	var addProcedureFieldsContentHtml = "";
	var componentId = this.m_componentId;
	var currentActionItem = this.getAddProcedureAction();
	var recomID = currentActionItem.RECOMMENDATION_ID;

	// Create a hidden div to display error message when the script fails to save the procedure
	var addProcedureActionFailedHtml = "<div class = 'recom-o2-sp-err-msg hidden'></div>";
	
	addProcedureFieldsContentHtml += "<div id='procedureName" + recomID + "' class='recom-o2-procedure-name'><span class='secondary-text'>" + i18n.PROCEDURE + "</span></br><span>" + this.getAddProcedureName() + "</span></div>";

	addProcedureFieldsContentHtml += "<span class='recom-o2-time-frame-label secondary-text'>" + this.m_i18nStrings.TIME_FRAME + "</span><div id='addProcedureDateSelector" + componentId + recomID + "' class='recom-o2-add-proc-date'></div>";

	addProcedureFieldsContentHtml += "<div class='recom-o2-proc-provider-container'><span class='secondary-text'>" + this.m_i18nStrings.PHYSICIAN + "</span><div id='addProcedureProviderSelector" + componentId + recomID + "' class='recom-o2-add-proc-provider'></div></div>";

	addProcedureFieldsContentHtml += "<div class='recom-o2-proc-location-container'><span class='secondary-text'>" + i18n.LOCATION + "</span><br/><input type='text' id='addProcedureLocationText" + componentId + recomID + "' class='recom-o2-add-proc-location'/></div>";

	addProcedureFieldsContentHtml += "<div class='recom-o2-proc-comment-container'><span class='secondary-text'>" + this.m_i18nStrings.COMMENTS + "</span><br/><textarea id='addProcedureCommentText" + componentId + recomID + "' class='recom-o2-add-proc-comment' rows='3' placeholder='" + this.m_i18nStrings.ADD_A_COMMENT + "'></textarea></div>";

	addProcedureHtml = "<div id=sidePanelScrollContainer" + componentId + ">"
		 + "<div id='addProcedureActionContainer" + recomID + componentId + "' class='recom-o2-action-controls'>"
		 + addProcedureActionFailedHtml + addProcedureFieldsContentHtml + "</div></div>";
		 
	return addProcedureHtml;
};

/**
 * addFuzzyDateControlToSidePanel - adds date control to the sidepanel.
 */
RecommendationsO2Component.prototype.addFuzzyDateControlToSidePanel = function () {
	var self = this;
	var compId = this.m_componentId;
	var recomId = this.getAddProcedureAction().RECOMMENDATION_ID;
	var dateSelectorHolder = $("#addProcedureDateSelector" + compId + recomId);
	self.setProcedureDateSelector(new DateSelector());
	//Override the m_supportedDatePrecisions array so that the precision drop down does not display 'Unknown'
	self.m_addProcedureDateSelector.m_supportedDatePrecisions = ["ABOUT","BEFORE","AFTER"];
	
	self.m_addProcedureDateSelector.retrieveRequiredResources(function () {
		self.m_addProcedureDateSelector.setUniqueId("addProcedureSatisfier" + compId + recomId);
		self.m_addProcedureDateSelector.setCriterion(self.getCriterion());
		self.m_addProcedureDateSelector.setFuzzyFlag(true);
		self.m_addProcedureDateSelector.setDateSupportOption(2); // Meaning it supports both past and future dates

		// Render the date control and append HTML to date container
		var addProcedureDateControlHTML = self.m_addProcedureDateSelector.renderDateControl();
		dateSelectorHolder.append(addProcedureDateControlHTML);

		// Finalized actions after all elements are shown in the side panel
		self.m_addProcedureDateSelector.finalizeActions();
		self.m_addProcedureDateSelector.setSelectedDateFlag(0);
		
		CERN_EventListener.addListener(self, "selectedDateAvailable"+self.m_addProcedureDateSelector.getUniqueId(), function(){ 
			self.validateSelectedDateToAddProc();
		}, self);
		CERN_EventListener.addListener(self, "selectedPrecisionCodeAvailable"+self.m_addProcedureDateSelector.getUniqueId(), function(){
			self.validateSelectedDateToAddProc();
		}, self);
		CERN_EventListener.addListener(self, "selectedDateFormatAvailable"+self.m_addProcedureDateSelector.getUniqueId(), function(){
			self.validateSelectedDateToAddProc();
		}, self);
	});
};
/**
 * validateSelectedDateToAddProc - checks if a date is selected from the datepicker and updates save button accordingly.
 */
RecommendationsO2Component.prototype.validateSelectedDateToAddProc = function () {
	//Disable the save if date selected is null.
	if (this.m_addProcedureDateSelector.getSelectedDate()) {
		this.enableAddProcSaveButton(true);
	} else {
		this.enableAddProcSaveButton(false);
	}
};

/**
 * enableAddProcSaveButton - enables the 'save' button in the add procedure window if called with 'true'.
 * Disables it when false is passed.
 * @param enableSaveFlag - {Boolean}
 */
RecommendationsO2Component.prototype.enableAddProcSaveButton = function (enableSaveFlag) {
	
	if(typeof enableSaveFlag !== "boolean"){
		throw new Error("The parameter passed to enableAddProcSaveButton function is not a boolean value");
	}
	
	//Get the save button
	var procedureSaveButton = this.m_$sidePanelContainer.find("#saveRecomButton" + this.getAddProcedureAction().RECOMMENDATION_ID + this.getComponentId());
	
	//If the enable save flag is true, enable the save button. If not disable it.
	if(procedureSaveButton){
		if(enableSaveFlag){
			procedureSaveButton.removeClass('disabled');
		}else{
			procedureSaveButton.addClass('disabled');
		}
	}
	
};
/**
 * addPersonnelSearchToSidePanel - adds provider search to the sidepanel.
 */
RecommendationsO2Component.prototype.addPersonnelSearchToSidePanel = function () {
	var component = this;
	var componentId = this.m_componentId;
	var currentActionItem = this.getAddProcedureAction();
	var recomID = currentActionItem.RECOMMENDATION_ID;
	var providerSearchDiv = $('#addProcedureProviderSelector' + componentId + recomID);

	var personnelSearch = new MPageControls.PersonnelSearch(providerSearchDiv);
	personnelSearch.setUserId(component.getCriterion().provider_id);

	var personnelList = personnelSearch.getList();

	// Set the selected provider to the current user if possible
	if (component.m_currentProviderName) {
		personnelSearch.setValue(component.m_currentProviderName);
	}

	/*
	 * Override the setSuggestions and handleSuccess original implementation
	 * Purpose - Not to restrict the result window to be shown when no results found
	 * This way 'assign new provider' can be displayed when no matching provider is found.
	 */
	personnelSearch.setSuggestions = function (items) {

		
		//Set the max height of the auto suggestion box dynamically.
		//This is to make sure that the suggestions and the assign new provider option are visible within sidepanel height
		this.setTemplateMaxHeight(component.calculateMaxHeightForSearchResults());
		this.setItems(items);
		
		/* The following code is removed to let the suggestion box display when there are no results.
		// No items or no text or caption active, hide it
		if (items.length === 0 || this.getValue().length === 0 || this.getTextbox().hasClass(this.getCaptionClass())) {
			this.close();
			return;
		}
		*/
		// Synchs the listDiv width, if necessary
		if (this.getSynchSuggestionsWidth()) {
			$("#control_" + this.getControlId() + "_content").css('min-width', this.getElement().width() + "px");
		}

		this.getList().renderItems(items);

		var detailDialog = this.getDetailDialog();
		detailDialog.show();
		detailDialog.updatePosition();

		// apply highlighting, if enabled
		if (this.getHighlightEnabled()) {
			var hl = new MPageControls.TextHighlighter(this.getList().getElement());
			hl.highlight(this.getValue());
		}

		var self = this;
		var suggestionsContainer = "#control_" + self.getControlId() + "_content .suggestions";
		//make the suggestions container focusable
		$(suggestionsContainer)
		.attr("tabindex", 0)
		.on("blur", function () {
			// Gives a little time to process the blur event
			setTimeout(function () {
				//close the autosuggest content if the search textbox is not focused
				if (self.getElement() && !self.getTextbox().is(":focus")) {
					self.close();
				}
			}, 300);
		});
	};

	personnelSearch.handleSuccess = function (reqNumber, responseText) {

		// ensure we are processing the latest request made
		if (reqNumber != this.getRequestCount() || !responseText) {
			return;
		}

		var jsonSearch = JSON.parse(responseText);

		// Handle failed CCL call
		if (jsonSearch.RECORD_DATA.STATUS_DATA.STATUS === "F") {
			MP_Util.LogScriptCallError(null, responseText, "program_search.js", "handleSuccess");
			MP_Util.LogError(this.getProgramName() + " failed: " + responseText);
			return;
		}
		/** This code is removed from the actual implementation to render the auto-suggest when there are no results found
		 * This way, When there are no results with the given search string, the auto-suggest would still appear with 'Add a new provider...'
		 
		// Do not render if there is no response
		if (!jsonSearch) {
			return;
		}
		 */
		var context = this.makeContext(jsonSearch);
		this.setSuggestions(context);

	};

	//Change the list template to get 'assign new provider' at the end of the suggestions
	personnelSearch.setListTemplate(MPageControls.getDefaultTemplates().providerSuggestList);

	//When any provider from the sugggestions is selected,
	personnelList.setOnSelect(function () {
		var selectedProvider = personnelList.getSelectedItem();

		//update the request with personnelList.getSelectedItem()
		component.m_addProcedureAction.PROVIDER_ID = selectedProvider.PERSON_ID;
		component.m_addProcedureAction.PROVIDER_NAME = "";

		//Update the search-box with the name of the selected provider
		var searchBox = providerSearchDiv.find('.search-box');
		searchBox.val(selectedProvider.NAME_FULL_FORMATTED);

		//Close the auto-suggest dropdown.
		personnelSearch.close();

		//Remove the control from the search-box.
		searchBox.focusout();
	});
	
	//Clicl handler for adding a free text provider
	component.m_$sidePanelContainer.on('click', '#newProviderAssignment', function () {

		//Get the name that was typed in the search box and update the m_addProcedureAction object accordingly.
		var searchBox = providerSearchDiv.find('.search-box');
		component.m_addProcedureAction.PROVIDER_NAME = searchBox.val();
		component.m_addProcedureAction.PROVIDER_ID = 0.0;
		$('.suggestions').hide();
		searchBox.focusout();
	});
	
	//Add a focus out handler to erase the name from the object when the search box is emptied
	providerSearchDiv.on('focusout', '.search-box', function () {
		var searchBox = providerSearchDiv.find('.search-box');

		//Clear the provider details in the m_addProcedureAction object if the search box is emptied
		if (!searchBox.val()) {
			component.m_addProcedureAction.PROVIDER_NAME = "";
			component.m_addProcedureAction.PROVIDER_ID = 0.0;
		}

	});

};

/**
 * Calculates the max height for the search results of physician search.
 * i.e. height between the search box and the side panel bottom
 * @return {Number} max heigh for search results
 */
RecommendationsO2Component.prototype.calculateMaxHeightForSearchResults = function () {
	//Calculate the height between the provider search and the sidepanel end.
	var sidePanelContainer = this.m_$sidePanelContainer.find('.side-panel');
	var searchContainer = this.m_$sidePanelContainer.find('.recom-o2-proc-provider-container');

	var sidePanelBottom = parseInt(sidePanelContainer.offset().top + sidePanelContainer.height(), 10);
	var searchContainerBottom = parseInt(searchContainer.offset().top + searchContainer.height(), 10);
	return sidePanelBottom - searchContainerBottom;
};
/**
 * addEventHandlersForAddProdecureFields - Adds event handlers for the input fields in the add procedure window.
 */
RecommendationsO2Component.prototype.addEventHandlersForAddProdecureFields = function () {
	var component = this;
	var recomID = this.getAddProcedureAction().RECOMMENDATION_ID;
	var componentID = this.m_componentId;
	var addProcedureContainer = this.m_$sidePanelContainer.find("#addProcedureActionContainer" + recomID + componentID);
	addProcedureContainer.on('focusout','.recom-o2-add-proc-location',function(){
		//update the location details
		component.getAddProcedureAction().FREE_TEXT_LOCATION = $(this).val();
	});
	addProcedureContainer.on('focusout','.recom-o2-add-proc-comment',function(){
		//update the comment details
		component.getAddProcedureAction().COMMENTS = $(this).val();
	});
};

/**
 * Makes a request to mp_exec_std_request for adding a procedure.
 * @param {Object} - saveButtonObject
 */
RecommendationsO2Component.prototype.chartProcedureSatisfier = function (saveButtonObject) {
	if(typeof saveButtonObject !== "object"){
		throw new Error("The parameter passed to chartProcedureSatisfier is not an Object");
	}
	var component = this;
	var recomID = component.getAddProcedureAction().RECOMMENDATION_ID;
	var ACM_PROCEDURE = {
		APPLICATION : 600005,
		TASK : 601028,
		REQUEST : 115467
	};
	var scriptRequest = new ScriptRequest();
	scriptRequest.setProgramName("MP_EXEC_STD_REQUEST");
	scriptRequest.setParameterArray(["^MINE^", "^^", ACM_PROCEDURE.APPLICATION, ACM_PROCEDURE.TASK, ACM_PROCEDURE.REQUEST]);
	scriptRequest.setDataBlob(component.getaddProcedureActionBlobIn());
	scriptRequest.setResponseHandler(function (scriptReply) {

		if (scriptReply.getStatus() === "S") {
			//When adding procedure is successful, remove the event handlers and refresh the component.
			component.m_$sidePanelContainer.find("#addProcedureActionContainer" + recomID + component.m_componentId).off();
			component.getAddProcedureAction().saveSuccessful = true;
			
			//Clear the data stored at the constructor level
			component.setProcedureDateSelector(null);
			component.setNomenclatureId(0.0);
			
			//Refresh the component
			component.retrieveComponentData();
		} else {
			//When system fails to add procedure, enable the save button and display the error message.
			saveButtonObject.removeClass("disabled");
			var addProcedureFailedMessageContainer = component.m_$sidePanelContainer.find(".recom-o2-sp-err-msg");
			if (addProcedureFailedMessageContainer.hasClass("hidden")) {
				var saveErrorHTML = MP_Core.generateUserMessageHTML("error", component.m_i18nStrings.SATISFY_FAILED_TEXT, "", "recom-o2-modify-failure");
				addProcedureFailedMessageContainer.empty().html(saveErrorHTML);
				addProcedureFailedMessageContainer.removeClass("hidden");
			}
		}
	});
	saveButtonObject.addClass("disabled");
	scriptRequest.performRequest();
};

/**
 *getaddProcedureActionBlobIn - creates stringified blob in for add procedure request
 *@return {string} - blobIn
 */
RecommendationsO2Component.prototype.getaddProcedureActionBlobIn = function (){
	var addProcedureRequest = this.getScriptRequestStructure(115467);
	var currentProcedureTobeAdded = this.getAddProcedureAction();
	
	
	//Populate the fields edited by the user and stringify the request to set as blob in
	
	//Check if a provider is selected/free text provider is added, then add it to the request
	if(currentProcedureTobeAdded.PROVIDER_ID || currentProcedureTobeAdded.PROVIDER_NAME){
		//check if there is any text in the search-box
		//This is to handle the close button within the search box.
		if (this.m_$sidePanelContainer.find('.search-box').val()) {
			var providerObject = {
				PROVIDER_ID : currentProcedureTobeAdded.PROVIDER_ID,
				PROVIDER_NAME : currentProcedureTobeAdded.PROVIDER_NAME,
				PROCEDURE_RELTN_CD : 0.0
			};
			addProcedureRequest.REQUESTIN.PROCEDURES[0].PROVIDERS.push(providerObject);
		}
	}
	
	//check if comment exists, then add it to the request
	if(currentProcedureTobeAdded.COMMENTS){
		var commentObject = {
			COMMENT : currentProcedureTobeAdded.COMMENTS,
			PRSNL_ID : this.getCriterion().provider_id,
			COMMENT_DT_TM : new Date()
		};
		addProcedureRequest.REQUESTIN.PROCEDURES[0].COMMENTS.push(commentObject);
	}
	addProcedureRequest.REQUESTIN.PROCEDURES[0].NOMENCLATURE_ID = currentProcedureTobeAdded.NOMENCLATURE_ID;
	addProcedureRequest.REQUESTIN.PROCEDURES[0].NOTE = this.getAddProcedureName();
	addProcedureRequest.REQUESTIN.PROCEDURES[0].PERFORMED_DT_TM = this.getProcedureDateSelector().getSelectedDate();
	addProcedureRequest.REQUESTIN.PROCEDURES[0].PERFORMED_DT_TM_PREC = this.getProcedureDateSelector().getSelectedDateFlag();
	addProcedureRequest.REQUESTIN.PROCEDURES[0].PERFORMED_DT_TM_PREC_CD = this.getProcedureDateSelector().getSelectedDatePrecisionCode();
	addProcedureRequest.REQUESTIN.PROCEDURES[0].FREE_TEXT_LOCATION = currentProcedureTobeAdded.FREE_TEXT_LOCATION;
	
	return this.getCriterion().is_utc ? MP_Util.enhancedStringify(addProcedureRequest, 0, 0, 1) : MP_Util.enhancedStringify(addProcedureRequest);
};
	
/**
 * Map the Health Maintenance O2 object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "WF_HEALTH_MAINT" filter
 */
MP_Util.setObjectDefinitionMapping("WF_HEALTH_MAINT", RecommendationsO2Component);