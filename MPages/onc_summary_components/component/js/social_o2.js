/**
 * The social workflow component style
 * 
 * @class
 */
function Socialo2ComponentStyle() {
	this.initByNamespace("soc-o2");
}


Socialo2ComponentStyle.prototype = new ComponentStyle();
Socialo2ComponentStyle.prototype.constructor = ComponentStyle;



/**
 * The social workflow component
 * 
 * @param criterion
 *             The criterion containing the information about the
 *            requested information
 * @class
 */
function Socialo2Component(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new Socialo2ComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.SOCIAL.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.SOCIAL.O2 - render component");
	this.setIncludeLineNumber(true);
	this.m_compNS=this.getStyles().getNameSpace();
	this.setScope(2);
	this.m_iViewAdd = false;
	this.m_openExistingFormInd = false;
	this.m_formsInd = false;
	this.bandName = "";
	this.sectionName = "";
	this.itemName = "";
	this.criticalFlag = 0;
	this.m_arrResults = [];
	this.m_arrForms = [];
	this.powerformIds = [];
	this.m_formEditModeInd = true;
	this.m_reqPowerFormIds = [];
	
}

Socialo2Component.prototype = new MPageComponent();
Socialo2Component.prototype.constructor = MPageComponent;

/**
 * Retrieving the social o2 data on page load.
 * 
 * @function
 * @name retrieveComponentData This function handles the logic to make a ccl
 *       script call and retrieve the activities data.
 */
Socialo2Component.prototype.retrieveComponentData = function() {
	var self = this;
	var groups = this.getGroups();
	if (groups && groups.length) {
		var criterion = this.getCriterion();
		var group = groups[0];
		var sEventSets = "0.0";
		var sEventCodes = "0.0";
		var sendAr = [];

		var loadTimer = new RTMSTimer(this.getComponentLoadTimerName());
		var renderTimer = new RTMSTimer(this.getComponentRenderTimerName());
		var scriptRequest = new ComponentScriptRequest();

		var sEncntr = (this.getScope() === 2) ? criterion.encntr_id + ".0" : "0.0";
		sEventSets = MP_Util.CreateParamArray(group.getEventSets(), 1);
		sendAr.push("^MINE^", criterion.person_id + ".0", sEncntr, criterion.provider_id + ".0", criterion.ppr_cd + ".0", 1, "^^", sEventSets, "0.0", this.getLookbackUnits(), this.getLookbackUnitTypeFlag(), 1, "^^", "^^", 0, 0, 1, MP_Util.CreateParamArray(this.powerformIds, 1));
		scriptRequest.setProgramName("MP_RETRIEVE_SOCIAL_ACTIVITY");
		scriptRequest.setParameterArray(sendAr);
		scriptRequest.setComponent(this);
		scriptRequest.setLoadTimer(loadTimer);
		scriptRequest.setRenderTimer(renderTimer);
		scriptRequest.setResponseHandler(function (scriptReply) {
			var recordData = scriptReply.getResponse();
			self.renderComponent(recordData);
		});
		scriptRequest.performRequest();

	}

	else{// handles throwing "Error retrieving results" if there are no groups
		var err = new Error("No eventsets are defined in bedrock.");
		logger.logJSError(err, this, "social_o2.js", "retrieveComponentData");
		
		var  errMsg = [];
	    this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(), errMsg.join("<br />")), "(0)");
	}

};

Socialo2Component.prototype.setIViewAdd = function(value) {
	this.m_iViewAdd = value;
};

Socialo2Component.prototype.isIViewAdd = function() {
	return this.m_iViewAdd;
};
/**
 * Sets the indicator, m_openExistingFormInd, to either open a new form or the most recent, existing form.
 * @param {boolean} value [true = open a new form, false = open most recent, existing form]
 */
Socialo2Component.prototype.setOpenExistingFormInd = function(value){
	this.m_openExistingFormInd = value;
};
/**
 * Returns the value of the indicator, m_openExistingFormInd, to determine whether to open a new form or the most recent, existing form.
 * @return {boolean} [true = open a new form, false = open most recent, existing form]
 */
Socialo2Component.prototype.getOpenExistingFormInd = function(){
	return (this.m_openExistingFormInd);
};

/**
 * Sets the indicator, m_formsInd, to either either show or hide Forms section.
 * @param {boolean} value [true = Show Forms section, false = Hide Forms section]
 */
Socialo2Component.prototype.setFormSectionInd = function(value){
	this.m_formsInd = value;
};
/**
 * Returns the value of the indicator, m_formsInd, to determine whether Show or Hide the Forms section.
 * @return {boolean} [true = show Forms section, false = don't show Forms section]
 */
Socialo2Component.prototype.getFormSectionInd = function(){
	return (this.m_formsInd);
};

/**
 * Sets the indicator, m_formEditModeInd, to either view-only mode or modify mode.
 * @param {boolean} value [true = Modify mode, false = View-only mode]
 */
Socialo2Component.prototype.setFormEditModeInd  = function(value){
	this.m_formEditModeInd = value;
};
/**
 * Returns the value of the indicator, m_formEditModeInd, to determine whether to open the PowerForm in a modify or view-only mode.
 * @return {boolean} [true = Modify mode, false = View-only mode]
 */
Socialo2Component.prototype.getFormEditModeInd = function(){
	return this.m_formEditModeInd;
};

Socialo2Component.prototype.openIView = function() {
	var criterion = this.getCriterion();
	var paramString = "'" + this.bandName + "','" + this.sectionName + "','" + this.itemName + "'," + criterion.person_id + ","  + criterion.encntr_id ;
	MP_Util.LogMpagesEventInfo(this, "IVIEW", paramString, "social_o2.js", "openIView");
	try {
		var launchIViewApp = window.external.DiscernObjectFactory("TASKDOC");
		launchIViewApp.LaunchIView(this.bandName, this.sectionName, this.itemName, criterion.person_id , criterion.encntr_id );
		CERN_EventListener.fireEvent(null, this, EventListener.EVENT_CLINICAL_EVENT, "Socialo2");
	} catch (err) {
		MP_Util.LogJSError(err, null, "social_o2.js", "openIView");
	}
};

Socialo2Component.prototype.openTab = function() {
	var criterion = this.getCriterion();
	var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + 0 + "|0|0";
	MP_Util.LogMpagesEventInfo(null, "POWERFORM", paramString, "social_o2.js", "openTab");
	MPAGES_EVENT("POWERFORM", paramString);
	this.retrieveComponentData();
};

Socialo2Component.prototype.openDropDown = function (formID) {
	var criterion = this.getCriterion();
	var component = this;
	var paramString = "";

	var powerFormScriptRequest = new ComponentScriptRequest();
	powerFormScriptRequest.setProgramName("INN_MP_GET_FORM_ACTIVITY_ID");
	powerFormScriptRequest.setParameterArray(["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", formID + ".0"]);
	powerFormScriptRequest.setComponent(component);
	powerFormScriptRequest.setResponseHandler(function (scriptReply) {
		//Open existing form if Forms section is hidden
		if (component.getFormSectionInd()) {
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
		MP_Util.LogMpagesEventInfo(null, "POWERFORM", paramString, "social_o2.js", "openDropDown");

	});
	powerFormScriptRequest.performRequest();

};
/**
 * Returns the array m_reqPowerFormIds that contains ids of all required powerforms
 * @return {array} m_reqPowerFormIds
 */
Socialo2Component.prototype.getRequiredPowerFormIds = function () {
	return this.m_reqPowerFormIds;
};
/**
 * Inserts the required powerform ids into an array:m_reqPowerFormIds 
 * @param {object} requiredPowerFormsFilter
 * @return {undefined} 
 */
Socialo2Component.prototype.setRequiredPowerformIds = function (requiredPowerFormsFilter) {
	var requiredPowerFormsCnt = requiredPowerFormsFilter.VALS.length;
	for (var i = 0; i < requiredPowerFormsCnt; i++) {
		this.m_reqPowerFormIds.push(requiredPowerFormsFilter.VALS[i].PE_ID);
	}
};

/**
 * Creates the filterMappings that will be used when loading the component's
 * bedrock settings
 */
Socialo2Component.prototype.loadFilterMappings = function() {

	// Add the filter mapping object for the Social Workflow component
	this.addFilterMappingObject("WF_SOCIAL_CHART_LAUNCH_IND", {
		setFunction : this.setIViewAdd,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	// Add the filter mapping object for opening the latest, existing powerform
	this.addFilterMappingObject("WF_SOCIAL_PF_IND", {
		setFunction : this.setOpenExistingFormInd,
		type:"Boolean",
		field:"FREETEXT_DESC"
	});
	//Add the filter mapping object to Show or Hide Forms section for component
	this.addFilterMappingObject("WF_SOCIAL_FORMS_DISPLAY", {
		setFunction : this.setFormSectionInd,
		type:"Boolean",
		field:"FREETEXT_DESC"
	});
	
	// Add the filter mapping object for deciding the view mode of forms selected from the Forms section
	this.addFilterMappingObject("WF_SOCIAL_FORMS_EDIT_MODE", {
		setFunction : this.setFormEditModeInd,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	//Add the filter mapping object for deciding whether gap-check is enabled/disabled
	this.addFilterMappingObject("WF_SOCIAL_REQD", {
		setFunction : this.setGapCheckRequiredInd,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});	
	//Add the filter mapping object for the disclaimer text to be displayed in error banner when gap-check requirements are unsatisfied
	this.addFilterMappingObject("WF_SOCIAL_HELP_TXT", {
		setFunction : this.setRequiredCompDisclaimerText,
		type : "STRING",
		field : "FREETEXT_DESC"
	});
	//Add the filter mapping object for selecting the required powerforms
	this.addFilterMappingObject("WF_SOCIAL_PF_REQD", { 
		setFunction : this.setRequiredPowerformIds,
		type : "DEFAULT_FILTER",
		field : "ALL"
	});
	//Add the filter mapping for deciding whether override functionality is required or not
	this.addFilterMappingObject("WF_SOCIAL_REQ_OVR", {
		setFunction : this.setOverrideInd,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
};

/**
	* Gets the Contributors List from the reply of mp_retrieve_social_activity
	* @param {String} personnel id to compare
	* @return {Object} JSON reply containing the results
	*/
Socialo2Component.prototype.getPRSNLName = function (prsnlId, recordData) {

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

/**
 * Process the results for the component table
 * 
 * @param recordData
 *             The retrieved JSON to generate the HTML markup
 */
Socialo2Component.prototype.processResultsForRender = function (recordData) {
	var component = this;
	var compNS = component.m_compNS;
	var compId = this.getComponentId();
	var results = recordData.RESULTS;
	var resultLength = results.length;
	var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
	var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	var socialI18n = i18n.discernabu.social_o2;
	var dateTime = new Date();
	var socialResult;
	var socialArr = [];
	var powerFormResult;
	var powerFormAuthor = "";
	var powerFormArr = [];
	var normalcy;
	var measObject = new MP_Core.Measurement();
	this.criticalFlag = 0;
	for (var x = 0; x < resultLength; x++) {
		var measurementResults = results[x].CLINICAL_EVENTS[0].MEASUREMENTS[0];
		if (measurementResults) {
			socialResult = results[x];
			measObject.initFromRec(measurementResults, codeArray);
			normalcy = MP_Core.GetNormalcyClass(measObject);
			if (this.criticalFlag === 0 && normalcy === "res-severe") {
				this.criticalFlag = 1;	
			}
			socialResult.REPORT_NAME_DISPLAY = socialResult.EVENT_SET_DISP || "--";
			dateTime.setISO8601(measurementResults.EFFECTIVE_DATE);
			socialResult.REPORT_DATE_DISPLAY = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
			socialResult.REPORT_RESULT = MP_Core.GetNormalcyResultDisplay(measObject, false);
			socialResult.AUTHOR = component.getPRSNLName(measurementResults.PRSNL_ID, recordData);
			socialArr.push(socialResult);
		}
	}
	
	//If the m_critical remains 0, it means there is no critical value;
	if (component.criticalFlag) {
		CERN_EventListener.fireEvent(component, component, EventListener.EVENT_CRITICAL_UPDATE, {
			critical : true
		});
	} else {
		CERN_EventListener.fireEvent(component, component, EventListener.EVENT_CRITICAL_UPDATE, {
			critical : null
		});
	}
	//storing powerform details in powerformarray
	var formResults = recordData.POWERFORMS;
	var formlength = formResults.length;
	for (var pfIndex = 0; pfIndex < formlength; pfIndex++) {
		var powerFormData = formResults[pfIndex];
		if (powerFormData) {
			powerFormResult = formResults[pfIndex];
			var formTitle = powerFormData.POWERFORM_NAME;
			var contributorsObj = {
				"FORM_TITLE" : formTitle,
				"CONTRIBUTORS" : powerFormData.CONTRIBUTORS
			};
			powerFormResult.REPORT_NAME_DISPLAY = "<span class='" + this.m_compNS + "-doc-title'>" + formTitle + "</span>" || "--";
			dateTime.setISO8601(powerFormData.PERFORM_DT_TM);
			powerFormResult.REPORT_DATE_DISPLAY = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
			powerFormResult.REPORT_RESULT = powerFormData.FORM_STATUS_DISPLAY;
			powerFormResult.CATEGORY = "POWERFORMS";
			if (powerFormData.CONTRIBUTORS.length > 1) {
				powerFormAuthor = "<span class='" + compNS + "-powerform-author'>" + socialI18n.MULTI_CONTRIBUTORS + "</span>" || "--";
				if (powerFormData.MULTICONTRIBUTOR == 1) {
					powerFormAuthor = "<span class='" + compNS + "-powerform-author'>" + socialI18n.MULTI_CONTRIBUTORS + "</span>" || "--";

				} else {
					powerFormAuthor = "<span class='" + compNS + "-powerform-author'>" + powerFormData.CONTRIBUTORS[0].PRSNL_NAME + "</span>" || "--";

				}

			} else {
				powerFormAuthor = "<span class='" + compNS + "-powerform-author'>" + powerFormData.CONTRIBUTORS[0].PRSNL_NAME + "</span>" || "--";
			}
			powerFormResult.AUTHOR = "<span id='" + powerFormData.ACTIVITY_ID + compId + "' contributors='" + JSON.stringify(contributorsObj) + "' class='" + this.m_compNS + "-doc-title'>" + powerFormAuthor + "</span>" || "--";
			if (powerFormData.MEANING === "MODIFIED" || powerFormData.MEANING === "ALTERED") {
				powerFormResult.REPORT_NAME_DISPLAY += "<span class='res-modified'>&nbsp;</span>";
			}
			powerFormResult.ACTIVITY_ID = powerFormData.ACTIVITY_ID;
			powerFormResult.FORM_ID = powerFormData.FORM_ID;
			powerFormArr.push(powerFormResult);
		}
	}
	this.m_arrResults = socialArr;
	this.m_arrForms = powerFormArr;
};
Socialo2Component.prototype.loadPowerFormOptions = function(compFilter) {
	var menuItem = null;
	var pfArr = null;
	var pfCnt = 0;
	var powerForm = null;
	var x = 0;
	pfArr = this.getFilterValues(compFilter);
	pfCnt = pfArr.length;
	for ( x = 0; x < pfCnt; x++) {
		powerForm = pfArr[x];
		var powerForm_id = powerForm.getId();
		menuItem = new MP_Core.MenuItem();
		menuItem.setName(powerForm.getName());
		menuItem.setDescription(powerForm.getDescription());
		menuItem.setId(powerForm_id);
		this.powerformIds.push(powerForm_id);
		this.addMenuItem(menuItem);
	}
};

/**
 * Checks if the required powerforms have been charted 
 * @return {boolean} true- either no required powerform is set in bedrock filter or all required powerforms are charted; false-at least one required powerform hasn't been charted
 */
Socialo2Component.prototype.isGapCheckRequirementSatisfied = function () {
	var component = this;
	var requiredPowerFormIds = null;
	var chartedPowerForms = null;
	var chartedPowerFormsCnt = 0;
	var requiredPowerFormsCnt = 0;
	var found = null;
	chartedPowerForms = component.m_arrForms;
	chartedPowerFormsCnt = chartedPowerForms.length;
	requiredPowerFormIds = component.getRequiredPowerFormIds();
	requiredPowerFormsCnt = requiredPowerFormIds.length;
	for (var i = 0; i < requiredPowerFormsCnt; i++) {
		found = false;
		for (var j = 0; j < chartedPowerFormsCnt; j++) {
			if (chartedPowerForms[j].FORM_ID === requiredPowerFormIds[i] && (chartedPowerForms[j].MEANING==="MODIFIED" || chartedPowerForms[j].MEANING==="AUTH")) {
				found = true;
				break;
			}
		}
		//if even one required form is uncharted, requirement is unsatisfied and we return false
		if (!found) {
			return false;
		}
	}
	return true;
};
/**
 * Initiates EVENT_SATISFIER_UPDATE method to change the icon based on the value returned from the satisfier condition 
 * and updates the satisfied indicator.
 */
Socialo2Component.prototype.updateSatisfierRequirementIndicator = function () {
	if (this.getGapCheckRequiredInd()) {
		var component = this;
		var isRequirementSatisfied = component.isGapCheckRequirementSatisfied();
		this.setSatisfiedInd(isRequirementSatisfied);
		CERN_EventListener.fireEvent(this, this, EventListener.EVENT_SATISFIER_UPDATE, {
			satisfied : isRequirementSatisfied
		});
		component.updateComponentRequiredIndicator(); 
	}
};
Socialo2Component.prototype.renderComponent = function (recordData) {
	var numberResults = 0;
	var criterion = this.getCriterion();
	var component = this;
	var compNS = component.m_compNS;
	var socialo2Table = null;
	var compId = this.getComponentId();
	var socialI18n=i18n.discernabu.social_o2;
	//To validate the bedrock filter value set to launch form in Edit or View mode.
	var formEditModeInd = component.getFormEditModeInd() ? 0 : 1;
	try {
		//Get result information
			if ($.trim(recordData)) {
				component.processResultsForRender(recordData);
			}
		//Gap Check required functionality will be validated to display indicators
			component.updateSatisfierRequirementIndicator();
			
		// Ensure the script hasn't returned a false positive
		if (recordData.STATUS_DATA.STATUS === "Z") {
			this.finalizeComponent(MP_Util.HandleNoDataResponse(this.getStyles().getNameSpace()), "(0)");
			// update count text in the navigation pane
			CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
				"count" : 0
			});			
			return;
		}

		// Get the component table (the first time this is called, it is created)
		socialo2Table = new ComponentTable();
		socialo2Table.setNamespace(this.getStyles().getId());
		var resultsArr = this.m_arrResults;
		var formsArr = this.m_arrForms;

		socialo2Table.addExtension(new TableCellClickCallbackExtension().setCellClickCallback(function (event, data) {
				var docData = data.RESULT_DATA;
				if (data.COLUMN_ID === "NAME" && docData.CATEGORY === "POWERFORMS") {
					var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + docData.FORM_ID + "|" + docData.ACTIVITY_ID + "|" + formEditModeInd;
					MPAGES_EVENT("POWERFORM", paramString);
					component.retrieveComponentData();
				}
			}));
		var nameColumn = new TableColumn();
		nameColumn.setColumnDisplay("");
		nameColumn.setColumnId("NAME");
		nameColumn.setCustomClass("soc-o2-name");
		nameColumn.setRenderTemplate("${ REPORT_NAME_DISPLAY }");

		//Create Author Column
		var authorColumn = new TableColumn();
		authorColumn.setColumnId("AUTHOR");
		authorColumn.setColumnDisplay(socialI18n.AUTHOR);
		authorColumn.setCustomClass(compNS + "-author");
		authorColumn.setRenderTemplate("${ AUTHOR }");

		// Create the date column
		var dateColumn = new TableColumn();
		dateColumn.setColumnDisplay(i18n.DATE_TIME);
		dateColumn.setColumnId("DATE");
		dateColumn.setCustomClass("soc-o2-date");
		dateColumn.setRenderTemplate("${ REPORT_DATE_DISPLAY }");
		// Create the result column
		var resultColumn = new TableColumn();
		resultColumn.setColumnDisplay(i18n.RESULT);
		resultColumn.setColumnId("RESULT");
		resultColumn.setCustomClass("soc-o2-result");
		resultColumn.setRenderTemplate("${ REPORT_RESULT }");
		// Add the columns to the table
		socialo2Table.addColumn(nameColumn);
		socialo2Table.addColumn(resultColumn);
		socialo2Table.addColumn(authorColumn);
		socialo2Table.addColumn(dateColumn);
		//Create the Results Sub-group
		var resultsGrp = new TableGroup();
		resultsGrp.setGroupId("Results" + compId).setDisplay(socialI18n.RESULTS).setShowCount(true);
		resultsGrp.bindData(resultsArr);
		socialo2Table.addGroup(resultsGrp);

		if (component.getFormSectionInd()) {
			var formsGrp = new TableGroup();
			formsGrp.setGroupId("Forms" + compId).setDisplay(socialI18n.FORMS).setShowCount(true);
			formsGrp.bindData(formsArr);
			socialo2Table.addGroup(formsGrp);
			numberResults = formsArr.length + resultsArr.length;
		} else {
			numberResults = resultsArr.length;
		}
		this.setComponentTable(socialo2Table);

		// Finalize the component using the socialo2Table.render() method to create
		// the table html
		this.finalizeComponent(socialo2Table.render(), MP_Util.CreateTitleText(this, numberResults));
		// Update the component result count
		CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
			count : numberResults
		});
		component.attachPopUpBox();
	} catch (err) {
		MP_Util.LogJSError(err, this, "social_o2.js", "renderComponent");
		throw(err);
	}
	finally {
		// nothing
	}
};

//Event Listener to display MPage UI Pop up
Socialo2Component.prototype.attachPopUpBox = function () {

	var component = this;
	var compId = this.getComponentId();
	var socialI18n=i18n.discernabu.social_o2;
	var popUp = new MPageUI.Popup();

	
		$(".soc-o2-doc-title").on("click", function (event) {
			if (popUp.isOpen()) {
				popUp.destroy();
			}
			popUp.setAnchorId($(this).attr("id"));
			var contributorsObj = JSON.parse($(this).attr("contributors"));
			popUp.setHeader(socialI18n.ACTION_LIST_TITLE + " " + contributorsObj.FORM_TITLE);
			popUp.setMaxBodyHeight("100px");
			popUp.setBodyContent(component.constructContributorsActionListHTML(contributorsObj.CONTRIBUTORS));
			popUp.setPosition(MPageUI.POPUP_OPTIONS.POSITION.BOTTOM_RIGHT);
			popUp.setWidth(MPageUI.POPUP_OPTIONS.WIDTH.MEDIUM);
			popUp.setFooter("<div class='soc-o2-pop-up-footer'><button id='" + compId + "pop-up-close'>" + socialI18n.CLOSE_BTN + "</button></div>");
			
			popUp.show();
			var box = $(".mpage-ui-popup-body");
			box.removeClass("mpage-ui-popup-body");
			box.addClass("soc-o2-popup-body");
			$("#"+ compId +"pop-up-close").on("click", function(){
					popUp.destroy();
			});
			event.stopPropagation();
		});
		
	$('body').mouseup(function (event) {
		if(popUp.exists()&&popUp.isOpen()){
			if (!$(event.target).hasClass('tooltipster-content') && !$(event.target).parents().hasClass('tooltipster-content')){
				popUp.destroy();
			}
		}
	});
	$(".wrkflw-views").scroll(function () {
		if(popUp.exists()){
			popUp.destroy();
		}
	});
};

	/**
	 * The following will return the HTML generated for MPage UI Pop up.
	 *
	 * @parameter contributorsArray  - The list of Contributors containingPersonnel Name and Action datetime.
	 */
	Socialo2Component.prototype.constructContributorsActionListHTML = function (contributorsArray) {
		var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
		var socialI18n = i18n.discernabu.social_o2;
		var dateTime = new Date();
		var actionListHTML = "";
		var component = this;
		var compNS = component.m_compNS;
		var contributorsListCount = contributorsArray.length;

		actionListHTML += "<div class='soc-o2-action-list-hdr'><dl class='" + compNS + "-dl-info'><dt class='" + compNS + "-action-name hdr'><span>" + socialI18n.CONTRIBUTOR_NAME + "</span></dt><dt class='" + compNS + "-action-date hdr'><span>" + socialI18n.ACTION_DT_TM + "</span></dt></dl></div><div class='" + compNS + "-action-list-menu'>";
		for (var index = 0; index < contributorsListCount; index++) {
			dateTime.setISO8601(contributorsArray[index].PRSNL_UPDT_DT_TM);
			actionDtTm = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
			actionListHTML += "<dl class='" + compNS + "-dl-info'><dd class='" + compNS + "-action-name'><span>" + contributorsArray[index].PRSNL_NAME + "</span></dd><dd class='" + compNS + "-action-date'><span>" + actionDtTm + "</span></dd></dl>";
		}
		actionListHTML += "</div>";

		return actionListHTML;
	};
/**
 * Map the social O2 object to the bedrock filter mapping so the architecture
 * will know what object to create when it sees the "WF_SOCIAL" filter
 */
MP_Util.setObjectDefinitionMapping("WF_SOCIAL", Socialo2Component);

