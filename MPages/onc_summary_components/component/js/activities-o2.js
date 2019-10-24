/**
 * The activity component style
 * @class
 */
function Activitieso2ComponentStyle() {

	this.initByNamespace("act-o2");
}

Activitieso2ComponentStyle.prototype = new ComponentStyle();
Activitieso2ComponentStyle.prototype.constructor = ComponentStyle;

/**
 * The activity component
 * @param {Object} criterion The criterion containing the information about the requested information
 * @class
 */
function Activitieso2Component(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new Activitieso2ComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.ACTIVITIES.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.ACTIVITIES.O2 - render component");
	this.m_compNS = this.getStyles().getNameSpace();
	this.setIncludeLineNumber(true);
	this.setScope(2);
	this.m_iViewAdd = false;
	this.m_openExistingFormInd = false;
	this.m_displayFormsInd = false;
	this.m_formEditModeInd = true;
	this.m_bandName = "";
	this.m_sectionName = "";
	this.m_itemName = "";
	this.m_criticalFlag = 0;
	this.m_activitiesData = [];
	this.m_powerFormData = [];
	this.m_powerFormIds = [];
	this.m_reqPowerFormIds = [];
}

Activitieso2Component.prototype = new MPageComponent();
Activitieso2Component.prototype.constructor = MPageComponent;

/**
 * Retrieving the activities data on page load.
 * This function handles the logic to make a ccl script call and retrieve the activities data.
 */
Activitieso2Component.prototype.retrieveComponentData = function() {
	var self = this;
	var groups = this.getGroups();
	if (groups && groups.length > 0) {
		var criterion = this.getCriterion();
		this.m_isEventSetInfo = false;
		this.m_isComment = false;
		var sendAr = [];

		var loadTimer = new RTMSTimer(this.getComponentLoadTimerName());
		var renderTimer = new RTMSTimer(this.getComponentRenderTimerName());
		var scriptRequest = new ComponentScriptRequest();

		var sEncntr = (this.getScope() === 2) ? criterion.encntr_id + ".0" : "0.0";
		var sEventSets = "0.0";
		var sEventCodes = "0.0";
		for (var x = 0, xl = groups.length; x < xl; x++) {

			var group = groups[x];
			if ( group instanceof MPageEventSetGroup) {
				sEventSets = MP_Util.CreateParamArray(group.getEventSets(), 1);
			}
			else if ( group instanceof MPageEventCodeGroup) {
				sEventCodes = MP_Util.CreateParamArray(group.getEventCodes(), 1);
			}
			else if ( group instanceof MPageSequenceGroup) {
				var mapItems = group.getMapItems();
				sEventSets = MP_Util.CreateParamArray(MP_Util.GetValueFromArray("CODE_VALUE", mapItems), 1);
			}
			else if ( group instanceof MPageGrouper) {
				var g = group.getGroups();
				var ec = [];
				for (var y = 0, yl = g.length; y < yl; y++) {
					if (g[y] instanceof MPageEventCodeGroup) {
						ec = ec.concat(g[y].getEventCodes());
					}
				}
				sEventCodes = MP_Util.CreateParamArray(ec, 1);
			}
			else {
				continue;
			}
		}

		//Changing the INCLUDEEVENTSETINFO flag to 1 in order to populate the event_set_cd
		sendAr.push("^MINE^", criterion.person_id + ".0", sEncntr, criterion.provider_id + ".0", criterion.ppr_cd + ".0", 1, "^^", sEventSets, sEventCodes, this.getLookbackUnits(), this.getLookbackUnitTypeFlag(), 1, "^^", "^^", 0, 0, 1, MP_Util.CreateParamArray(this.m_powerFormIds, 1));
		scriptRequest.setProgramName("MP_RETRIEVE_SOCIAL_ACTIVITY");
		scriptRequest.setParameterArray(sendAr);
		scriptRequest.setComponent(self);
		scriptRequest.setLoadTimer(loadTimer);
		scriptRequest.setRenderTimer(renderTimer);
		scriptRequest.setResponseHandler(function (scriptReply) {
			var recordData = scriptReply.getResponse();
			self.renderComponent(recordData);
		});
		scriptRequest.performRequest();
	}
	else {
		// handles throwing "Error retrieving results" if there are no groups
		var err = new Error("No eventsets are defined in bedrock.");
		logger.logJSError(err, this, "activities-o2.js", "retrieveComponentData");
		var errMsg = [];
		this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(), errMsg.join("<br />")), "(0)");
	}
};

Activitieso2Component.prototype.setIViewAdd = function(value) {
	this.m_iViewAdd = value;
};

Activitieso2Component.prototype.isIViewAdd = function() {
	return this.m_iViewAdd;
};

/**
 * Sets the indicator, m_openExistingFormInd, to either open a new form or the most recent, existing form.
 * @param {boolean} value [true = open a new form, false = open most recent, existing form]
 */
Activitieso2Component.prototype.setOpenExistingFormInd = function(value) {
	this.m_openExistingFormInd = value;
};

/**
 * Returns the value of the indicator, m_openExistingFormInd, to determine whether to open a new form or the most recent, existing form.
 * @return {boolean} [true = open a new form, false = open most recent, existing form]
 */
Activitieso2Component.prototype.getOpenExistingFormInd = function() {
	return this.m_openExistingFormInd;
};
/**
 * Sets the indicator, m_displayFormsInd, to either either show or hide Forms section.
 * @param {boolean} value [true = Show Forms section, false = Hide Forms section]
 */
Activitieso2Component.prototype.setDisplayFormSectionInd = function(value){
	this.m_displayFormsInd = value;
};
/**
 * Returns the value of the indicator, m_displayFormsInd, to determine whether Show or Hide the Forms section.
 * @return {boolean} [true = show Forms section, false = don't show Forms section]
 */
Activitieso2Component.prototype.getDisplayFormSectionInd = function(){
	return this.m_displayFormsInd;
};
/**
 * Sets the indicator, m_formEditModeInd, to either view-only mode or modify mode.
 * @param {boolean} value [true = Modify mode, false = View-only mode]
 */
Activitieso2Component.prototype.setFormEditModeInd = function(value){
	this.m_formEditModeInd = value;
};
/**
 * Returns the value of the indicator, m_formEditModeInd, to determine whether to open the PowerForm in a modify or view-only mode.
 * @return {boolean} [true = Modify mode, false = View-only mode]
 */
Activitieso2Component.prototype.getFormEditModeInd = function(){
	return this.m_formEditModeInd;
};

/**
 * Inserts the required powerform ids into an array:m_reqPowerFormIds
 * @param {object} requiredPowerFormsFilter
 */
Activitieso2Component.prototype.setRequiredPowerFormIds = function(requiredPowerFormsFilter) {
	var requiredPowerFormsCnt = requiredPowerFormsFilter.VALS.length;
	for(var i = 0; i < requiredPowerFormsCnt; i++){
		this.m_reqPowerFormIds.push(requiredPowerFormsFilter.VALS[i].PE_ID);
	}
};
/**
 * Returns the array m_reqPowerFormIds that contains ids of all required powerforms
 * @return {array} m_reqPowerFormIds
 */
Activitieso2Component.prototype.getRequiredPowerFormIds = function(){
	return this.m_reqPowerFormIds;
};


Activitieso2Component.prototype.openIView = function() {
	var criterion = this.getCriterion();
	var paramString = "'" + this.m_bandName + "','" + this.m_sectionName + "','" + this.m_itemName + "'," + criterion.person_id + "," + criterion.encntr_id;
	MP_Util.LogMpagesEventInfo(this, "IVIEW", paramString, "activities-o2.js", "openIView");
	try {
		var launchIViewApp = window.external.DiscernObjectFactory("TASKDOC");
		launchIViewApp.LaunchIView(this.m_bandName, this.m_sectionName, this.m_itemName, criterion.person_id, criterion.encntr_id);

		CERN_EventListener.fireEvent(null, this, EventListener.EVENT_CLINICAL_EVENT, "Activities");
	}
	catch (err) {
		MP_Util.LogJSError(err, null, "activities-o2", "openIView");
	}
};

Activitieso2Component.prototype.openDropDown = function (formID) {
	var criterion = this.getCriterion();
	var component = this;
	var paramString = "";

	var powerFormScriptRequest = new ComponentScriptRequest();
	powerFormScriptRequest.setProgramName("INN_MP_GET_FORM_ACTIVITY_ID");
	powerFormScriptRequest.setParameterArray(["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", formID + ".0"]);
	powerFormScriptRequest.setComponent(component);
	powerFormScriptRequest.setResponseHandler(function (scriptReply) {
		//Open existing form if Forms section is hidden
		if (component.getDisplayFormSectionInd()) {
			paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + formID + "|0|0";
		} else {
			if (scriptReply.getStatus() === "S" && component.getOpenExistingFormInd()) {
				var recordData = scriptReply.getResponse();
				paramString = criterion.person_id + ".0" + "|" + criterion.encntr_id + ".0" + "|" + formID + ".0" + "|" + recordData.FORM_ACTIVITY_ID + ".0" + "|0";
			} else {
				paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + formID + "|0|0";
			}
		}
		MPAGES_EVENT("POWERFORM", paramString);
		component.retrieveComponentData();
		MP_Util.LogMpagesEventInfo(null, "POWERFORM", paramString, "activities_o2.js", "openDropDown");

	});
	powerFormScriptRequest.performRequest();

};

Activitieso2Component.prototype.loadFilterMappings = function() {
	// Add the filter mapping object for the Activities Workflow component
	this.addFilterMappingObject("WF_ACTIVITIES_AD_HOC", {
		setFunction: this.setIViewAdd,
		type: "BOOLEAN",
		field: "FREETEXT_DESC"
	});
	// Add the filter mapping object for opening the latest, existing powerform
	this.addFilterMappingObject("WF_ACTIVITIES_PF_IND", {
		setFunction: this.setOpenExistingFormInd,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("WF_ACTIVITIES_FORMS_DISPLAY", {
		setFunction: this.setDisplayFormSectionInd,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});
	// Add the filter mapping object for deciding the view mode of forms selected from the Forms section
	this.addFilterMappingObject("WF_ACTIVITIES_FORMS_EDIT_MODE", {
		setFunction: this.setFormEditModeInd,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});
	//Add the filter mapping object for deciding whether gap-check is enabled/disabled
	this.addFilterMappingObject("WF_ACTIVITIES_REQD", {
		setFunction: this.setGapCheckRequiredInd,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});
	//Add the filter mapping for deciding whether override functionality is required or not
	this.addFilterMappingObject("WF_ACTIVITIES_REQ_OVR", {
		setFunction: this.setOverrideInd,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});
	//Add the filter mapping object for the disclaimer text to be displayed in error banner when gap-check requirements are unsatisfied
	this.addFilterMappingObject("WF_ACTIVITIES_HELP_TXT", {
		setFunction: this.setRequiredCompDisclaimerText,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	//Add the filter mapping object for selecting the required powerforms
	this.addFilterMappingObject("WF_ACTIVITIES_PF_REQD", {
		setFunction: this.setRequiredPowerFormIds,
		type: "DEFAULT_FILTER",
		field: "ALL"
	});
};

Activitieso2Component.prototype.openTab = function() {
	var criterion = this.getCriterion();
	var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + 0 + "|0|0";
	MP_Util.LogMpagesEventInfo(null, "POWERFORM", paramString, "activities-o2.js", "openDropDown");
	MPAGES_EVENT("POWERFORM", paramString);
	this.retrieveComponentData();
};

/**
 * Convert/Format the date and time to a required displayable format using the dateFormat function
 * @param dateValue The date which needs to be formatted
 */
Activitieso2Component.prototype.formatDateTime = function(dateValue) {
	var dateFormat = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	var formattedDate = "";
	var dateTime = new Date();

	dateTime.setISO8601(dateValue);
	formattedDate = (dateTime) ? dateFormat.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR) : "";
	return formattedDate;
};
Activitieso2Component.prototype.getPRSNLName = function (prsnlId, recordData) {
	var prsnlLength = recordData.PRSNL.length;
	var prsnlName = "";
	for (var p = 0; p < prsnlLength; p++) {
		var prsnlResults = recordData.PRSNL[p];
		if (prsnlId == prsnlResults.ID) {
			prsnlName = prsnlResults.PROVIDER_NAME.NAME_FULL;
			break;
		}
	}
	return prsnlName;
};
Activitieso2Component.prototype.processResultsForRender = function (recordData) {
	var component = this;
	var componentId = this.getComponentId();
	var compNS = component.m_compNS;
	var resultLength = recordData.RESULTS.length;
	var results = recordData.RESULTS;
	var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
	var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	var activityResult;
	var powerFormResult;
	var newResults = [];
	var dateTime = new Date();
	var measurementResults = "";
	var powerFormData = "";
	var powerFormTitle = "";
	var powerFormAuthor = "";
	var activitiesI18n = i18n.discernabu.activities_o2;
	var measurement = new MP_Core.Measurement();
	var personnelResult = "";
	var powerFormArr = [];
	component.m_criticalFlag=0;
	for (var r = 0;
		r < resultLength;
		r++) {
		measurementResults = results[r].CLINICAL_EVENTS[0].MEASUREMENTS[0];
		personnelResult = recordData.PRSNL[0];
		if (measurementResults) {
			activityResult = results[r];
			measurement.initFromRec(measurementResults, codeArray);

			//Critical indicators in the navigator
			normalcy = MP_Core.GetNormalcyClass(measurement);
			if (component.m_criticalFlag === 0 && normalcy === "res-severe") {
				component.m_criticalFlag = 1;
			}
			activityResult.REPORT_NAME_DISPLAY = activityResult.EVENT_SET_DISP || "--";
			activityResult.REPORT_DATE_DISPLAY = component.formatDateTime(measurementResults.EFFECTIVE_DATE);
			activityResult.REPORT_RESULT = MP_Core.GetNormalcyResultDisplay(measurement, false);
			activityResult.AUTHOR = component.getPRSNLName(measurementResults.PRSNL_ID,recordData);
			newResults.push(activityResult);
		}
	}
	if (component.m_criticalFlag) {
		CERN_EventListener.fireEvent(component, component, EventListener.EVENT_CRITICAL_UPDATE, {
			"critical": true
		});
	}else{
		CERN_EventListener.fireEvent(component,component,EventListener.EVENT_CRITICAL_UPDATE,{
			critical: null
		});
	}
	//Populating the data for "Forms" sub-section
	var formResults = recordData.POWERFORMS;
	var formlength = formResults.length;
	for (var x = 0; x < formlength; x++) {
		powerFormData = formResults[x];
		if (powerFormData) {
			powerFormResult = formResults[x];
			var formTitle = powerFormData.POWERFORM_NAME;
			var contributorsObj = {
				"FORM_TITLE" : formTitle,
				"CONTRIBUTORS" : powerFormData.CONTRIBUTORS
			};
			powerFormResult.REPORT_NAME_DISPLAY = "<span class='"+this.m_compNS+"-doc-title'>" + formTitle + "</span>" || "--";
			dateTime.setISO8601(powerFormData.PERFORM_DT_TM);
			powerFormResult.REPORT_DATE_DISPLAY = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
			powerFormResult.REPORT_RESULT = powerFormData.FORM_STATUS_DISPLAY;
			powerFormResult.CATEGORY = "POWERFORMS";

			if (powerFormData.CONTRIBUTORS.length > 1){
				if(powerFormData.MULTICONTRIBUTOR == 1){
					powerFormAuthor = "<span class='" + compNS + "-powerform-author'>" + activitiesI18n.MULTI_CONTRIBUTORS + "</span>" || "--";
				}
				else{
						powerFormAuthor = "<span class='" + compNS + "-powerform-author'>" + powerFormData.CONTRIBUTORS[0].PRSNL_NAME + "</span>" || "--";
				}
			}else{
				powerFormAuthor = "<span class='" + compNS + "-powerform-author'>" + powerFormData.CONTRIBUTORS[0].PRSNL_NAME + "</span>" || "--";
			}

			powerFormResult.AUTHOR = "<span id='" + powerFormData.ACTIVITY_ID + componentId + "' contributors='" + JSON.stringify(contributorsObj) + "' class='" + this.m_compNS + "-doc-title'>" + powerFormAuthor + "</span>" || "--";
			if (powerFormData.MEANING === "MODIFIED" || powerFormData.MEANING === "ALTERED") {
				powerFormResult.REPORT_NAME_DISPLAY += "<span class='res-modified'>&nbsp;</span>";
			}

			powerFormResult.ACTIVITY_ID = powerFormData.ACTIVITY_ID;
			powerFormResult.FORM_ID = powerFormData.FORM_ID;

			powerFormArr.push(powerFormResult);

		}
	}
	component.m_activitiesData = newResults;
	component.m_powerFormData = powerFormArr;

};

Activitieso2Component.prototype.loadPowerFormOptions = function(compFilter) {
	var component = this;
	var menuItem = null;
	var powerFormResult = null;
	var powerFormCount = 0;
	var powerForm = null;
	var powerFormId = null;

	powerFormResult = component.getFilterValues(compFilter);
	powerFormCount = powerFormResult.length;
	for ( var x = 0; x < powerFormCount; x++) {
		powerForm = powerFormResult[x];
		powerFormId = powerForm.getId();
		menuItem = new MP_Core.MenuItem();
		menuItem.setName(powerForm.getName());
		menuItem.setDescription(powerForm.getDescription());
		menuItem.setId(powerFormId);
		component.m_powerFormIds.push(powerFormId);
		component.addMenuItem(menuItem);
	}
};
/**
 * Checks if the required powerforms have been charted 
 * @return {boolean} true- either no required powerform is set in bedrock filter or all required powerforms are charted; false-at least one required powerform hasn't been charted
 */
Activitieso2Component.prototype.isGapCheckRequirementSatisfied = function() {
	var component = this;
	var requiredPowerFormIds = null;
	var chartedPowerForms = null;
	var chartedPowerFormsCnt = 0;
	var requiredPowerFormsCnt = 0;
	var found = null;
	chartedPowerForms = component.m_powerFormData;
	chartedPowerFormsCnt = chartedPowerForms.length;
	requiredPowerFormIds = component.getRequiredPowerFormIds();
	requiredPowerFormsCnt = requiredPowerFormIds.length;
	for(var i = 0; i < requiredPowerFormsCnt; i++){
		found = false;
		for(var j = 0; j<chartedPowerFormsCnt; j++){
			if(chartedPowerForms[j].FORM_ID === requiredPowerFormIds[i] && (chartedPowerForms[j].MEANING==="MODIFIED" || chartedPowerForms[j].MEANING==="AUTH")){
				found = true;
				break;
			}
		}
		//if even one required form is uncharted, requirement is unsatisfied and we return false
		if(!found){
			return false;
		}
	}
	return true;
};
/**
 * Initiates EVENT_SATISFIER_UPDATE method to change the icon based on the value returned from the satisfier condition and updates the satisfied indicator.
 */
Activitieso2Component.prototype.updateSatisfierRequirementIndicator = function () {
	if (this.getGapCheckRequiredInd()) {
		var isReqSatisfied = this.isGapCheckRequirementSatisfied();
		this.setSatisfiedInd(isReqSatisfied);
		CERN_EventListener.fireEvent(this, this, EventListener.EVENT_SATISFIER_UPDATE, {
			satisfied: isReqSatisfied
		});
		this.updateComponentRequiredIndicator();
	}
};


/**
 * Renders the retrieved data for the component into HTML markup to display within the document
 * @param component The component being rendered
 * @param recordData The retrieved JSON to parser to generate the HTML markup
 */
Activitieso2Component.prototype.renderComponent = function(recordData) {
	var component = this;
	var numberResults = 0;
	try{
		//handle the case when no no data has been charted (we don't need to display the component table)
		if(recordData.STATUS_DATA.STATUS === 'Z'){
			component.updateSatisfierRequirementIndicator();
			component.finalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), "");
			//Update the component result count
			CERN_EventListener.fireEvent(component, component, EventListener.EVENT_COUNT_UPDATE, {
				"count" : numberResults
			});
			return;
		}
		//Get result information
		if ($.trim(recordData)) {
			component.processResultsForRender(recordData);
		}
		var compNS = component.m_compNS;
		var componentId = component.getComponentId();
		var criterion = component.getCriterion();
		var resultsArr = null;
		var powerFormArr = null;
		var activitiesTable = null;
		//Check if forms can be modified from the forms section
		var formEditModeInd = component.getFormEditModeInd()?0:1;
		var activitiesI18n = i18n.discernabu.activities_o2;
		
		resultsArr = component.m_activitiesData;
		powerFormArr = component.m_powerFormData;

		activitiesTable = new ComponentTable();
		activitiesTable.setNamespace(component.getStyles().getId());
		activitiesTable.addExtension(new TableCellClickCallbackExtension().setCellClickCallback(function (event, data) {
			var powerFormData = data.RESULT_DATA;
			if (data.COLUMN_ID === "NAME" && powerFormData.CATEGORY === "POWERFORMS") {
				var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + powerFormData.FORM_ID + "|" + powerFormData.ACTIVITY_ID + "|" + formEditModeInd;
				MPAGES_EVENT("POWERFORM", paramString);
				component.retrieveComponentData();
			}
		}));
		var nameColumn = new TableColumn();
		nameColumn.setColumnId("NAME");
		nameColumn.setCustomClass(compNS + "-name");
		nameColumn.setRenderTemplate('${ REPORT_NAME_DISPLAY }');

		//Create the result column
		var resultColumn = new TableColumn();
		resultColumn.setColumnId("RESULT");
		resultColumn.setColumnDisplay(i18n.RESULT);
		resultColumn.setCustomClass(compNS + "-result");
		resultColumn.setRenderTemplate('${ REPORT_RESULT }');

		//Create the date column
		var dateColumn = new TableColumn();
		dateColumn.setColumnId("DATE");
		dateColumn.setColumnDisplay(i18n.DATE_TIME);
		dateColumn.setCustomClass(compNS + "-date");
		dateColumn.setRenderTemplate('${ REPORT_DATE_DISPLAY }');

		var authorColumn = new TableColumn();
		authorColumn.setColumnId("AUTHOR");
		authorColumn.setColumnDisplay(activitiesI18n.AUTHOR);
		authorColumn.setCustomClass(compNS + "-author");
		authorColumn.setRenderTemplate("${ AUTHOR }");

		activitiesTable.addColumn(nameColumn);
		activitiesTable.addColumn(resultColumn);
		activitiesTable.addColumn(authorColumn);
		activitiesTable.addColumn(dateColumn);

		//Bind the activities data
		var resultsGroup = new TableGroup();
		resultsGroup.setGroupId("results-group" + componentId);
		resultsGroup.bindData(resultsArr);
		resultsGroup.setDisplay(activitiesI18n.RESULTS);
		resultsGroup.setShowCount(true);
		activitiesTable.addGroup(resultsGroup);
		if(component.getDisplayFormSectionInd()){
			var formsGrp = new TableGroup();
			formsGrp.setGroupId("Forms" + componentId).setDisplay(activitiesI18n.FORMS).setShowCount(true);
			formsGrp.bindData(powerFormArr);
			activitiesTable.addGroup(formsGrp);
			numberResults = resultsArr.length + powerFormArr.length;
		}else{
			numberResults = resultsArr.length;
		}
		component.setComponentTable(activitiesTable);
		component.updateSatisfierRequirementIndicator();
		//Finalize the component using the activitiesTable.render() method to create the table html
		component.finalizeComponent(activitiesTable.render(), MP_Util.CreateTitleText(component, numberResults));
		component.attachPopUpBox();
	
		//Update the component result count
		CERN_EventListener.fireEvent(component, component, EventListener.EVENT_COUNT_UPDATE, {
			"count" : numberResults
		});
	}catch(err){
		MP_Util.LogJSError(err, component, "activities-o2.js", "renderComponent");
		throw(err);
	}
};
/* Attach event listener for pop-up box*/
Activitieso2Component.prototype.attachPopUpBox = function(){
		var component = this;
	var componentId = this.getComponentId();
	var activitiesI18n = i18n.discernabu.activities_o2;
	var popUp = new MPageUI.Popup();

		$(".act-o2-doc-title").on("click", function (event) {
			if(popUp.isOpen()){
				popUp.destroy();
			}
			popUp.setAnchorId($(this).attr("id"));
			var contributorsObj = JSON.parse($(this).attr("contributors"));
				popUp.setHeader(activitiesI18n.ACTION_LIST_TITLE + " " + contributorsObj.FORM_TITLE);
				popUp.setMaxBodyHeight("100px");
				popUp.setBodyContent(component.getContributorActionAsHTML(contributorsObj.CONTRIBUTORS));
				popUp.setPosition(MPageUI.POPUP_OPTIONS.POSITION.BOTTOM_RIGHT);
				popUp.setWidth(MPageUI.POPUP_OPTIONS.WIDTH.MEDIUM);
				popUp.setFooter("<div class='act-o2-pop-up-footer'><button id='"+ componentId +"pop-up-close'> " + activitiesI18n.CLOSE_BTN +  "</button></div>");
				popUp.show();
				var box = $(".mpage-ui-popup-body");
				box.removeClass("mpage-ui-popup-body");
				box.addClass("act-o2-popup-body");
				$("#"+ componentId +"pop-up-close").on("click", function(){
					popUp.destroy();
				});
				event.stopPropagation();
			});

	$('body').mouseup(function(event){
		if(popUp.exists()&&popUp.isOpen()){
			if (!$(event.target).hasClass('tooltipster-content') && !$(event.target).parents().hasClass('tooltipster-content')){
				popUp.destroy();
			}
		}
	});

	$("*").scroll(function(){
		if(popUp.exists()){
			popUp.destroy();
		}
	});

};
Activitieso2Component.prototype.getContributorActionAsHTML = function(contributorsArray){
	var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	var dateTime = new Date();
	var actionListHTML = "";
	var component = this;
	var compNS = component.m_compNS;
	var contributorsListCount = contributorsArray.length;
	var activitiesI18n = i18n.discernabu.activities_o2;
	actionListHTML += "<div class='act-o2-action-list-hdr'><dl class='" + compNS + "-dl-info'><dt class='" + compNS + "-action-name hdr'><span>" + activitiesI18n.CONTRIBUTOR_NAME + "</span></dt><dt class='" + compNS + "-action-date hdr'><span>" + activitiesI18n.ACTION_DT_TM + "</span></dt></dl></div><div class='" + compNS + "-action-list-menu'>";
	for (var index = 0; index < contributorsArray.length; index++) {
		dateTime.setISO8601(contributorsArray[index].PRSNL_UPDT_DT_TM);
		actionDtTm = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
		actionListHTML += "<dl class='" + compNS + "-dl-info'><dd class='" + compNS + "-action-name'><span>" + contributorsArray[index].PRSNL_NAME + "</span></dd><dd class='" + compNS + "-action-date'><span>" + actionDtTm + "</span></dd></dl>";
	}
	actionListHTML += "</div>";

	return actionListHTML;
};

MP_Util.setObjectDefinitionMapping("wf_activities", Activitieso2Component);
