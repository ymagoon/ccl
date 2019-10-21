//Create the Patient Education component style object
function PatientEducationO2ComponentStyle() {
	this.initByNamespace("pe-o2");
}

PatientEducationO2ComponentStyle.prototype = new ComponentStyle();
PatientEducationO2ComponentStyle.prototype.constructor = ComponentStyle;


function PatientEducationO2Component(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new PatientEducationO2ComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.PATIENTEDUCATION.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.PATIENTEDUCATION.O2 - render component");

	this.m_instructionsArray = [];
	this.m_selectedInstArray = [];
	this.m_favoriteInstArray = [];
	this.m_diagnosisArray = [];
	this.m_contentDomainCd = 0.0;
	this.m_trackingGroupCd = 0.0;
	this.m_addTaskGranted = false;
	this.m_removeTaskGranted = false;
	this.m_contentTaskGranted = false;
	this.m_languageId = 0.0;
	this.m_tabIndex = 0;
	/* 0 - ALL, 1 - DEPARTMENTAL, 2-PERSONAL*/
	this.m_timerId = 0;
	this.m_launchInd = false;
	this.m_powerFormFilter = [];
	this.m_IViewFilter = [];
	this.m_resultCount = 0;
}

PatientEducationO2Component.prototype = new MPageComponent();
PatientEducationO2Component.prototype.constructor = MPageComponent;

/* Supporting functions */

/**
 * Enabling the core level Add Plus sign to display all the time
 */

PatientEducationO2Component.prototype.setPlusAddEnabled = function() {
	this.m_isPlusAdd = true;
};

/**
 * Opens the Patient Education win32 dialog on the click of "+" button and Edit option of Pat Ed added.
 */
 
PatientEducationO2Component.prototype.openTab = function(dPatEdDocActivityId){

	var componentFileName = "patienteducation-o2.js";

	try {
		var criterion = this.getCriterion();
		var objPatientEducation = {};
		objPatientEducation = window.external.DiscernObjectFactory("PATIENTEDUCATION");
		MP_Util.LogDiscernInfo(this, "PATIENTEDUCATION", componentFileName, "openTab");
		var personId = criterion.person_id;
		var encntrId = criterion.encntr_id;
		objPatientEducation.SetPatient(personId, encntrId);
		objPatientEducation.SetDefaultTab(0);
		if(dPatEdDocActivityId){
		objPatientEducation.SetSelectedInstruction(dPatEdDocActivityId);
		}
		objPatientEducation.DoModal();
		this.retrieveComponentData();
	}
	catch (err) {
		MP_Util.LogJSError(err, null, componentFileName, "openTab");
	}
};

/**
 * Prints single patient education instruction on click of print icon of Pat Ed added.
 * @param {Number} dPatEdDocActivityId - this is the Activity_ID of patient education instruction added
 *
*/
 
PatientEducationO2Component.prototype.printPatEduSingleInstruction = function (dPatEdDocActivityId) {
	try {
		var criterion = this.getCriterion();
		var personId = criterion.person_id;
		var encntrId = criterion.encntr_id;
		var objPatientEducation = window.external.DiscernObjectFactory("PATIENTEDUCATION");
		if (dPatEdDocActivityId) {
			objPatientEducation.PrintSingleInstruction(personId, encntrId, dPatEdDocActivityId);
		}
	} catch (err) {
		MP_Util.LogJSError(err, null, "patienteducation-o2.js", "printPatEduSingleInstruction");
	}
};
/**
 * Returns selected Instructions count.
 * @return {Number} This function returns the selected Instructions count value
 */
PatientEducationO2Component.prototype.getResultCount = function () {
	return this.m_resultCount;
};
/**
 * Holds the count of the selected Instructions.
 * @param {Number} count : count of selected Instruction 
 * @return {undefined} This function does not return a value
 */
PatientEducationO2Component.prototype.setResultCount = function (count) {
	this.m_resultCount = count;
};
 /* Sets the Instruction Array.
 * 
 * @param {[Array]} instructionsArray: Instructions available in the Content domain
 */
PatientEducationO2Component.prototype.setInstructionArray = function(instructionsArray) {
	this.m_instructionsArray = instructionsArray;
};

/**
 * Retrieves the Instructions array.
 * 
 * @return {[Array]} returns m_instructionsArray
 */
PatientEducationO2Component.prototype.getInstructionArray = function() {
	return this.m_instructionsArray;
};

/**
 * Sets the Selected Instruction Array.
 * 
 * @param {[Array]} selectedInstructionArray : Instructions added to the Patient
 */
PatientEducationO2Component.prototype.setSelectedInstructionArray = function(selectedInstructionArray) {
	this.m_selectedInstArray = selectedInstructionArray;
};

/**
 * Retrieves the Selected Instructions array.
 * 
 * @return {[Array]} returns m_selectedInstArray
 */
PatientEducationO2Component.prototype.getSelectedInstructionArray = function() {
	return this.m_selectedInstArray;
};

/**
 * Sets the Favorite Instruction Array.
 * 
 * @param {[Array]}
 *            favoriteInstructionArray : Instructions added to the favorite list Departmental or Personal
 */
PatientEducationO2Component.prototype.setFavoriteInstructionArray = function(favoriteInstructionArray) {
	this.m_favoriteInstArray = favoriteInstructionArray;
};

/**
 * Retrieves the Favorite Instructions array.
 * 
 * @return {[Array]} returns m_favoriteInstArray
 */
PatientEducationO2Component.prototype.getFavoriteInstructionArray = function() {
	return this.m_favoriteInstArray;
};

/**
 * Sets the Diagnosis array.
 * 
 * @param {[Array]}
 *            diagnosisArray : Diagnosis added to the diagnosis list
 */
PatientEducationO2Component.prototype.setDiagnosisArray = function(diagnosisArray) {
	this.m_diagnosisArray = diagnosisArray;
};

/**
 * Retrieves the Diagnosis array.
 * 
 * @return {[Array]} returns m_diagnosisArray
 */
PatientEducationO2Component.prototype.getDiagnosisArray = function() {
	return this.m_diagnosisArray;
};

/**
 *
 * @param (boolean) addTaskInfo : Sets the value returned from backend based on the grant 
 *           access set.
 */
PatientEducationO2Component.prototype.setAddTaskGranted = function(addTaskInfo) {
	this.m_addTaskGranted = addTaskInfo;
};

/**
 * returns add task access value set in setAddTaskGranted.
 * 
 * @return (boolean) returns m_addTaskGranted
 */
PatientEducationO2Component.prototype.getAddTaskGranted = function() {
	return this.m_addTaskGranted;
};

/**
 *
 * @param (boolean) removeTaskInfo : Sets the value returned from backend based on the grant 
 *           access set.
 */
PatientEducationO2Component.prototype.setRemoveTaskGranted = function(removeTaskInfo) {
	this.m_removeTaskGranted = removeTaskInfo;
};

/**
 * returns remove task access value set in setRemoveTaskGranted.
 * 
 * @return (boolean) returns m_removeTaskGranted
 */
PatientEducationO2Component.prototype.getRemoveTaskGranted = function() {
	return this.m_removeTaskGranted;
};

/**
 *
 * @param (boolean) contentTaskInfo : Sets the value returned from backend based on the grant 
 *           access set.
 */
PatientEducationO2Component.prototype.setContentTaskGranted = function(contentTaskInfo) {
	this.m_contentTaskGranted = contentTaskInfo;
};

/**
 * returns content task access value set in setContentTaskGranted.
 * 
 * @return (boolean) returns m_contentTaskGranted
 */
PatientEducationO2Component.prototype.getContentTaskGranted = function() {
	return this.m_contentTaskGranted;
};


/**
 * Set the Content Domain code
 * 
 * @param (float) contentDomainCd : Content Domain is assigned to Firstnet Tracking
 *            group which holds the instructions
 */
PatientEducationO2Component.prototype.setDomainCd = function(contentDomainCd) {
	this.m_contentDomainCd = contentDomainCd;
};

/**
 * Retrieves Content Domain code
 * 
 * @return (float) returns m_contentDomainCd
 */
PatientEducationO2Component.prototype.getDomainCd = function() {
	return this.m_contentDomainCd;
};

/**
 * Set the Tracking Group code
 * 
 * @param (float) trackingGroupCd : Firstnet Tracking group which are used to track
 *            the Patient encounters
 */
PatientEducationO2Component.prototype.setTrackingGroupCd = function(trackingGroupCd) {
	this.m_trackingGroupCd = trackingGroupCd;
};

/**
 * Retrieves Tracking Group code
 * 
 * @return (float) returns m_trackingGroupCd
 */
PatientEducationO2Component.prototype.getTrackingGroupCd = function() {
	return this.m_trackingGroupCd;
};

/**
 * Set the Language Id
 * 
 * @param (float) languageId : Languages that are defined within the content
 *            domain/trackigndb tool
 */
PatientEducationO2Component.prototype.setLanguageId = function(languageId) {
	this.m_languageId = languageId;
};

/**
 * Retrieves Language Id
 * 
 * @return (float) returns m_languageId
 */
PatientEducationO2Component.prototype.getLanguageId = function() {
	return this.m_languageId;
};

/**
 * Set m_tabIndex based on the tab selected
 * 
 * @param (int) m_tabIndex : Index of the tab selected
 */
PatientEducationO2Component.prototype.setTabIndex = function(tabIndex) {
	this.m_tabIndex = tabIndex;
};

/**
 * Return m_tabIndex based on the tab selected
 * 
 * @return (int) returns m_tabIndex
 */
PatientEducationO2Component.prototype.getTabIndex = function() {
	return this.m_tabIndex;
};

/**
 * Set m_timerId returned from the function setTimeOut
 * 
 * @param {int} timerId : Id value of the timer that is set
 */
PatientEducationO2Component.prototype.setTimerId = function(timerId) {
	this.m_timerId = timerId;
};

/**
 * Return m_timerId ie Id value of the timer that is set
 * 
 * @return (int) returns m_timerId
 */
PatientEducationO2Component.prototype.getTimerId = function() {
	return this.m_timerId;
};
/**
* @constructor Create the map object to store in array
* @param {string} name : using this field to hold Key element of array such as Instruction Id
* @param {object} value: object holding details of Instruction such as Id, Description, Key doc identifier 
**/
PatientEducationO2Component.prototype.mapObject = function(name, value) {
	this.name = name;
	this.value = value;
};

/**
 * Set m_launchInd returned from the function setChartLaunchInd
 *
 * @param {boolean} value : Boolean value of the chart indicator that is set
 */
PatientEducationO2Component.prototype.setChartLaunchInd = function (value) {
	this.m_launchInd = value;
};
/**
 *  The setPowerFormMapped function sets a value for PowerForm mapped from bedrock
 *  @param value :  This is a Bedrock value to set PowerForm
 */
PatientEducationO2Component.prototype.setPowerFormMapped = function (value) {
	if (value) {
		this.m_powerFormFilter.push(value);
	}
};
/**
 *  The getPowerFormMapped function gets a filter value m_powerFormFilter from bedrock for PowerForm mapped
 */
PatientEducationO2Component.prototype.getPowerFormMapped = function () {
	return this.m_powerFormFilter;
};
/**
 *  The getIViewMapped function gets a filter value m_IViewFilter from bedrock for IView mapped
 */
PatientEducationO2Component.prototype.getIViewMapped = function () {
	return this.m_IViewFilter;
};
/**
 *  The setIViewMapped function sets a value for IView mapped from bedrock
 *  @param value :  This is a Bedrock value to set IView
 */
PatientEducationO2Component.prototype.setIViewMapped = function (value) {
	if (value) {
		this.m_IViewFilter.push(value);
	}
};

/**
 * returns education assessment chart launch indicator value set in Bedrock.
 *
 * @return (boolean) returns m_launchInd
 */
PatientEducationO2Component.prototype.isPowerFormLaunch = function () {
	return this.m_launchInd;
};

/**
 * Creates the filterMappings that will be used when loading the component's
 * bedrock settings
 */
PatientEducationO2Component.prototype.loadFilterMappings = function () {
	// Add the filter mapping object for the Patient Education Workflow component
	this.addFilterMappingObject("WF_PTED_ACK_CHT_LAUNCH_IND", {
		setFunction : this.setChartLaunchInd,
		type : "Boolean",
		field : "FTXT"
	});
	this.addFilterMappingObject("PF_SINGLE_SELECT", {
		setFunction : this.setPowerFormMapped,
		type : "DEFAULT_FILTER",
		field : "ALL"
	});
	this.addFilterMappingObject("IVIEW_SELECT", {
		setFunction : this.setIViewMapped,
		type : "DEFAULT_FILTER",
		field : "ALL"
	});
	this.addFilterMappingObject("WF_PTED_REQD", {
		setFunction : this.setGapCheckRequiredInd,
		type : "Boolean",
		field : "FTXT"
	});
	this.addFilterMappingObject("WF_PTED_REQ_OVR", {
		setFunction : this.setOverrideInd,
		type : "Boolean",
		field : "FTXT"
	});
	this.addFilterMappingObject("WF_PTED_HELP_TXT", {
		setFunction : this.setRequiredCompDisclaimerText,
		type : "STRING",
		field : "FTXT"
	});
};

/**
 * This method is used to display link "Education Assessment" by Chart indicator value set from bedrock
 * Powerform mapped and Chart indicator set to YES would display link
 * IView mapped and Chart indicator set to NO would display link 
 * Link won't display when above conditions not met or nothing mapped.
 */
PatientEducationO2Component.prototype.displayEducationAssessLink = function () {
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var component = this;
	var i18nPatEdu = i18n.discernabu.patienteducation_o2;
	var linkHtml = "";
	var powerFormArr = component.getPowerFormMapped();
	var iViewArr = component.getIViewMapped();

	if ((component.isPowerFormLaunch() && powerFormArr.length > 0) || (!component.isPowerFormLaunch() && iViewArr.length > 0)) {
		linkHtml = "<div class='" + compNS + "-acknowledge'><a id='patEduAck" + compID + "'>" + i18nPatEdu.EDUCATION_ASSESSMENT + "</a></div>";
	}
	return linkHtml;
};

/**
 * This method is used to launch PowerForm or IView whose values are mapped from bedrock
 * New Instance of Powerform would be launched for patient not documented with education assessment
 * Or existing instance would be launched using script "INN_MP_GET_FORM_ACTIVITY_ID" for Powerform 
 * IView launch would happen with working view mapped
 */
PatientEducationO2Component.prototype.launchChartSelection = function () {
var criterion = this.getCriterion();
var component = this;

try {

	if (component.isPowerFormLaunch()) {
		var paramString = "";
		var powerFormArray = component.getPowerFormMapped();
		var powerFormObj = powerFormArray[0];
		var powerForm = powerFormObj.VALS[0];
		var patEduAssessScriptrequest = new ComponentScriptRequest();
		patEduAssessScriptrequest.setProgramName("INN_MP_GET_FORM_ACTIVITY_ID");
		patEduAssessScriptrequest.setParameterArray(["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", powerForm.PE_ID + ".0"]);
		patEduAssessScriptrequest.setComponent(component);
		patEduAssessScriptrequest.setResponseHandler(function (scriptReply) {
			if (scriptReply.getStatus() === "S") {
				var recordData = scriptReply.getResponse();
				paramString = criterion.person_id + ".0" + "|" + criterion.encntr_id + ".0" + "|" + powerForm.PE_ID + ".0" + "|" + recordData.FORM_ACTIVITY_ID + ".0" + "|0";
			} else {
				paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + powerForm.PE_ID + "|0|0";
			}
			MPAGES_EVENT("POWERFORM", paramString);
			MP_Util.LogMpagesEventInfo(null, "POWERFORM", paramString, "patienteducation-o2.js", "launchChartSelection");

		});
		patEduAssessScriptrequest.performRequest();

	} else {
		var iViewArray = component.getIViewMapped();
		var iViewObj = iViewArray[0];
		var iViewItemsLength = iViewObj.VALS.length;
		for (var x = 0, x1 = iViewItemsLength;
			x < x1;
			x++) {
			var iView = iViewObj.VALS[x];
			var itemValTypeFlag = iView.V_TYP;
			if (itemValTypeFlag === 1) {
				var sDisplayName = "";
				var sBandName = "";
				var sSectionName = "";
				var sItemName = "";

				sDisplayName = iView.FTXT;
				sBandName = sDisplayName.toLowerCase();
				sDisplayName = sDisplayName.replace(/'/g, "");
				for (var y = 0, yl = iViewItemsLength;
					y < yl;
					y++) {
					var secItem = iViewObj.VALS[y];
					if (secItem.V_SQ === iView.V_SQ) {
						if (secItem.V_TYP === 2) {
							sSectionName = secItem.FTXT;
						} else if (secItem.V_TYP === 3) {
							sItemName = secItem.FTXT;
						}
					}
				}
				var launchIViewApp = window.external.DiscernObjectFactory("TASKDOC");
				launchIViewApp.LaunchIView(sBandName, sSectionName, sItemName, criterion.person_id, criterion.encntr_id);
				
			}
		}

	}
} catch (err) {
	MP_Util.LogJSError(err, null, "patienteducation-o2.js", "launchChartSelection");
}
};

/**
 * This method is used to refresh the component
 * Overridden from MPageComponent
 */
PatientEducationO2Component.prototype.refreshComponent = function() { 
	this.setTabIndex(0);
	this.retrieveComponentData();
};
	
/**
 * This method is incuded to retrieve following information	
 * Languages based on the content domain
 * Instructions that are added to the person
 * Favorite Instructions
 * Tracking group and Content domain for the encounter selected
 * 
 */
PatientEducationO2Component.prototype.retrieveComponentData = function() {
	var criterion = this.getCriterion();
	var sendAr = [ "^MINE^", criterion.person_id + ".0",criterion.encntr_id + ".0", criterion.provider_id + ".0" ];
	MP_Core.XMLCclRequestWrapper(this, "MP_GET_PAT_EDU", sendAr, true);
};


/**
 * This method is used to add the component level menu for showing content
 * domain. 
 */
PatientEducationO2Component.prototype.preProcessing = function() {
	var compMenu = this.getMenu();
	var compID = this.getComponentId();
	
	if (compMenu) {
		var compMenuSequence = new Menu("compMenuSequence" + compID);
		compMenuSequence.setLabel(i18n.discernabu.patienteducation_o2.CONTENTS);
		compMenuSequence.setAnchorConnectionCorner(["top", "left"]);
		compMenuSequence.setContentConnectionCorner(["top", "right"]);
		compMenuSequence.setIsDisabled(true);
		compMenu.addMenuItem(compMenuSequence);
	}
};

/**
 * This method is used to add the component level menu for showing content
 * domain. Content domains are defined in the codeset 24849. 
 * @param  {Array} contentData 		: record structure holding all the content information
 * @param {float}  contentDomainCd	: Currently selected content domain of Tracking group to which encounter is added
 */
PatientEducationO2Component.prototype.addMenu = function(contentData, contentDomainCd) {
	var compID = this.getComponentId();
	var menuId = "compMenuSequence" + compID;
	var compMenu = this.getMenu();

	var compMenuSequence = MP_MenuManager.getMenuObject(menuId);
	
	if(compMenuSequence){
		if(this.getContentTaskGranted()){
			compMenuSequence.setIsDisabled(false);
		}else{
			return;
		}
		if(contentData.length > 0){
			for (var contentIndex = 0;contentIndex < contentData.length ; contentIndex++) {
				var contentObject = contentData[contentIndex];
				var contentMenuId = "contentDomain" + compID + contentObject.CONTENT_DOMAIN_CD;
				if(!compMenuSequence.containsMenuItem(contentMenuId)) {
					//If the menu item is not there in the menu item list
					var contentItem = new MenuSelection(contentMenuId);
					if(contentDomainCd === contentObject.CONTENT_DOMAIN_CD) {
						contentItem.setIsSelected(true);
					}
				
					contentItem.setLabel(contentObject.CONTENT_TYPE_DESC);
					contentItem.setClickFunction(this.createFilterClickFunction(contentItem, contentObject.CONTENT_DOMAIN_CD));
					compMenuSequence.addMenuItem(contentItem);
				}else{
					//If the menu item is already present in the menu item list
					var menuArray = compMenuSequence.getMenuItemArray();
					var menuLength = menuArray.length;
					for (var i = menuLength; i--;) {
						var menuItem = menuArray[i];
						menuItem.setIsSelected((menuItem.getId() === "contentDomain" + compID + contentDomainCd)? true : false);
					}
				}
			}
		}else{
			compMenuSequence.setIsDisabled(true);
		}
		MP_MenuManager.updateMenuObject(compMenu);
	}
};

/**
 * This method is used to add the Click Event for each Menu item 
 * @param {[Array]} menuItem 		: record structure content item 
 * @param {float}   contentDomainCd	: content domain code value
 */
PatientEducationO2Component.prototype.createFilterClickFunction = function(menuItem, contentDomainCd) {
	var compID = this.getComponentId();
	var menuId = "compMenuSequence" + compID;
	
	var compMenuSequence = MP_MenuManager.getMenuObject(menuId);
	var criterion = this.getCriterion();
	var self = this;
	return function() {
		var compMenuArr = compMenuSequence.getMenuItemArray();
		if (compMenuArr && compMenuArr.length) {
			for (var a = compMenuArr.length; a--;) {
				var pos = compMenuArr[a].getId().indexOf("contentDomain"+compID);
				if(pos >= 0){
					compMenuArr[a].setIsSelected(false);
				}
			}
		}
		menuItem.setIsSelected(true);
		if (contentDomainCd > 0.0) {
			var sendAr = [ "^MINE^", contentDomainCd + ".0",criterion.encntr_id + ".0" ];
			MP_Core.XMLCclRequestWrapper(self, "MP_GET_PAT_EDU_CONTENTTYPE",sendAr, true);
		}
	};
};

/**
 ** This method is used to create the array to hold the favorite instructions
 ** @param {[Array]} reply: contians the data returned from backend
 */
PatientEducationO2Component.prototype.createFavoritesList = function(reply) {
	var favoriteInstCount = reply.length;
	var favoriteInstArray = [];

	// Load the Favorites
	for ( var favoriteCount = 0; favoriteCount < favoriteInstCount; favoriteCount++) {
		var favoriteElement = reply[favoriteCount];
		var favoriteInstDetails = null;
		if (favoriteInstArray) {
			favoriteInstDetails = this.getValueFromArray(favoriteElement.PAT_ED_RELTN_ID, favoriteInstArray);
		}
		if (favoriteInstDetails) {
			if (favoriteElement.PERSON_ID > 0.0) {
				favoriteInstDetails.personId = favoriteElement.PERSON_ID;
			}
			if (favoriteElement.TRACKING_GROUP_CD > 0.0) {
				favoriteInstDetails.trackingGroup = favoriteElement.TRACKING_GROUP_CD;
			}
		} else {
			// creating json object for Favorite Instructions
			var InstObj = {};
			InstObj.id = favoriteElement.PAT_ED_RELTN_ID;
			InstObj.personId = favoriteElement.PERSON_ID;
			InstObj.langId = favoriteElement.DOC_LANG_ID;
			InstObj.description = favoriteElement.PAT_ED_DESC;
			InstObj.trackingGroup = favoriteElement.TRACKING_GROUP_CD;

			var mapObj = new this.mapObject(InstObj.id, InstObj);
			favoriteInstArray.push(mapObj);
		}
	}
	this.setFavoriteInstructionArray(favoriteInstArray);
};

/**
 ** This method is used to create the array to hold the diagnosis
 ** @param {[Array]} reply: contians the data returned from backend
 */
PatientEducationO2Component.prototype.createDiagnosisList = function(reply) {
	var diagnosisCount = reply.length;
	var diagnosisArray = [];

	// Load the Diagnosis
	for ( var diagIndex = 0; diagIndex < diagnosisCount; diagIndex++) {
		var diagData = reply[diagIndex];
		var diagInstCount = diagData.INSTRUCTS.length;
		
		if( diagInstCount > 0 ){
			var diagElement = {};
			diagElement.displayName = diagData.DIAGNOSIS_DISPLAY;
			diagElement.INSTRUCTS = [];
			for ( var instIndex = 0; instIndex < diagInstCount; instIndex++) {
				var instData = diagData.INSTRUCTS[instIndex];

				var InstObj = {};
				InstObj.id = instData.RELATION_ID;
				InstObj.name = instData.NAME;
				InstObj.langId = instData.DOC_LANG_ID;
				InstObj.keyDocId = instData.KEY_DOC_IDENT;
				InstObj.ReferTextId = instData.REFR_TEXT_ID;
				InstObj.trackingGroupCd = instData.TRACKING_GROUP_CD;
				InstObj.personId = instData.PERSON_ID;
				var mapObj = new this.mapObject(InstObj.id,InstObj);
				diagElement.INSTRUCTS.push(mapObj);
			}
			diagnosisArray.push(diagElement);
		}
	}
	this.setDiagnosisArray(diagnosisArray);
};

/**
 ** 1. create the html to dsiaply the available instruction on the left side panel and Added instruction on the right side 
 ** 2. Adding Auto suggest search box
 ** 3. Adding language combo, languages are returned based on the tracking grou to which encounter is added
 ** 4. creating Favorite Array, instruction array
 ** 5. creating content type menu
 ** @param {[Array]} reply: contians the data returned from backend
 */
PatientEducationO2Component.prototype.renderComponent = function(reply) {

	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var criterion = this.getCriterion();
	var component = this;
	var patientEduHTML = "";
	var languageHTML = "";
	var jsPatEduHTML = [];
	var languageElement = null;
	var defaultLanguage = "";
	var instArray = [];
	var languageCount = reply.LANGUAGES.length;
	var instCount = reply.QUAL.length;
	var i18nPatEdu = i18n.discernabu.patienteducation_o2;
	var capTimer = MP_Util.CreateTimer("CAP:MPG.PATIENT_EDUCATION.O2 - Rendering component");
	var timerRenderComponent = MP_Util.CreateTimer(this.getComponentRenderTimerName(), this.getCriterion().category_mean);
	
	try{
		this.setDomainCd(reply.DOMAIN_CD);
		if(reply.IS_ADD_TASK_GRANTED){
			this.setAddTaskGranted(true);
		}
		if(reply.IS_REMOVE_TASK_GRANTED){
			this.setRemoveTaskGranted(true);
		}
		if(reply.IS_CONTENT_TASK_GRANTED){
			this.setContentTaskGranted(true);
		}
		if (typeof (reply.TRACKING_GROUP_CD) !== "undefined") {
			this.setTrackingGroupCd(reply.TRACKING_GROUP_CD);
		}
		if (reply.TRACKING_GROUP_CD === 0) {
			var errorBannerHtml = "<div id='errBannerContainer"+compID+"'>";
			var errorBanner = new MPageUI.AlertBanner();
			errorBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
			errorBanner.setPrimaryText(i18nPatEdu.INVALID_NURSEUNIT);
			errorBanner.setSecondaryText(i18nPatEdu.BANNER_SECONDARY_TEXT);
			errorBannerHtml = errorBannerHtml + errorBanner.render() + "</div>";
			jsPatEduHTML.push(errorBannerHtml);
		}
		if (typeof (reply.DEF_LANG_ID) !== "undefined") {
			this.setLanguageId(reply.DEF_LANG_ID);
		}
		
		if (typeof (reply.CONTENTS) !== "undefined") {
			this.addMenu(reply.CONTENTS, reply.DOMAIN_CD);
		}

		jsPatEduHTML.push("<div class='" + compNS + "-content'>" +
				"<div id='tabContainer"+compID +"' class='" + compNS + "-tab-container'>" +
				"<div class='" + compNS + "-tab-header'>" +
				"<div class='" + compNS + "-tab-header-inner'>" +
				"<div id='" + compNS + "-all-" + compID + "' class='" + compNS + "-tab first selected' title='"+ i18nPatEdu.ALL +"'><span>" + i18nPatEdu.ALL + "</span></div>" +
				"<div id='" + compNS + "-departmental-" + compID + "' class='" + compNS + "-tab' title='" + i18nPatEdu.DEPARTMENTAL + "'><span>" + i18nPatEdu.DEPARTMENTAL + "</span></div>" +
				"<div id='" + compNS + "-personal-" + compID + "' class='" + compNS + "-tab last' title='"+ i18nPatEdu.PERSONAL +"'><span>" + i18nPatEdu.PERSONAL + "</span></div></div>" +
				"<div class='" + compNS + "-search-combo'><div id='" + compNS + "-autosearch-" + compID + "'class='" + compNS + "-search'>" +
				MP_Util.CreateAutoSuggestBoxHtml(component) + "</div>");

		jsPatEduHTML.push("<span class='" + compNS + "-lang-combo'><select id='" + compNS + "-lang-combobox-" + compID + "' class='" + compNS + "-combobox'>" + 
						  "<option value='0'>" + i18nPatEdu.ALL_LANGUAGES	+ "</option>");

		var languageFound = false;
		for ( var languageId = 0; languageId < languageCount; languageId++) {
			languageElement = reply.LANGUAGES[languageId];
			// Adding 'selected' attribute for the default language in the combo
			if (reply.DEF_LANG_ID === languageElement.DOC_LANG_ID_VALUE) {
				defaultLanguage = 'selected';
				languageFound = true;
			}else {
				defaultLanguage = '';
			}
			if (languageElement.DISPLAY !== "") {
				languageHTML = languageHTML + "<option value='"	+ languageElement.DOC_LANG_ID_VALUE + "' " + defaultLanguage + ">" + languageElement.DISPLAY + "</option>";
			}
		}

		if (!languageFound) {
			component.setLanguageId(0);
		}
		jsPatEduHTML.push(languageHTML);
		
		var educationAssessLinkHtml = component.displayEducationAssessLink();
		jsPatEduHTML.push("</select></span></div></div>" + "<div id='" + compNS + "-tab-content-title-" + compID + "' class='" + compNS + "-tab-content-title'> " + i18nPatEdu.SUGGESTED + "</div><div id='" + compNS + "-tab-content-" + compID + "' class='" + compNS + "-tab-content'></div></div>" +
			"<div id='" + compNS + "-inst-div-" + compID + "' class='" + compNS + "-inst-div'>" + educationAssessLinkHtml);
		
		if (instCount <= 0) {
			jsPatEduHTML.push("<div class='" + compNS + "-no-result'><div class='"	+ compNS + "-no-data-glyph'></div>" +
					"<span class='" + compNS + "-no-data-text'>" + i18nPatEdu.NO_PATIENT_EDUCATION + "</span></div>");
		} else {
			// Construct Education Assessment link by value set from bedrock filters

			// Load the added instructions for the patient
			jsPatEduHTML.push("<div class='" + compNS + "-inst-title'>" + i18nPatEdu.ADDED_PATIENT_EDUCATION + "</div>");
			jsPatEduHTML.push("<div id='" + compNS + "-inst-inner-div-" + compID + "' class='" + compNS + "-inst-inner-div'>");
			for ( var iCount = 0; iCount < instCount; iCount++) {
				var instElement = reply.QUAL[iCount];
				if (instElement.PAT_ED_DOC_ACTIVITY_ID > 0) {
					//To replace special character like <>/" with its ascii code.
					var instName  = reply.QUAL[iCount].DESC.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
					jsPatEduHTML.push("<dl id = '" + instElement.PAT_ED_DOC_ACTIVITY_ID + "' class='"+ compNS + "-inst-res'>" +
							"<dt class='" + compNS + "-inst-data'>" + instName + "</dt>" +
							"<dd class='" + compNS + "-inst-modify'>" +
							"<span class='" + compNS + "-print' title=" + i18nPatEdu.PRINT + "></span>" +
							"<span class='" + compNS + "-edit' title="+ i18nPatEdu.EDIT +"></span>" +
							"<span class='" + compNS + "-remove' title="+ i18nPatEdu.REMOVE +"></span></dd>" +
							"</dl>");

					// creating JSON object for Instruction
					var InstObj = {};
					InstObj.id = instElement.PAT_ED_DOC_ACTIVITY_ID;
					InstObj.reltnid = instElement.RELTN_ID;
					InstObj.name = instElement.DESC;
					InstObj.langId = instElement.DOC_LANG_ID_VALUE;
					InstObj.keyDocId = instElement.KEY_DOC_IDENT;

					var mapObj = new component.mapObject(InstObj.id, InstObj);
					instArray.push(mapObj);
				}
			}
			component.setSelectedInstructionArray(instArray);
			jsPatEduHTML.push("</div></div>");
		}

		jsPatEduHTML.push("</div>");
		patientEduHTML = jsPatEduHTML.join("");
		this.setResultCount(instCount);
		this.updateSatisfierRequirementIndicator();
		this.finalizeComponent(patientEduHTML, "");

		if (instCount <= 0) {
			$("#" + compNS + "-inst-div-" + compID).css('background-color', '#F6F6F6');
		}

		// Append the delete image within the auto suggest search box, to clear the text entered within search box
		$("." + compNS +"-search").append("<span id='" + compNS + "clear-sugg-text" + compID + "' class='"+ compNS + "-clear-sugg-text'></span>");

		this.attachListeners();
		this.getSuggestedInstructions();

		if (typeof (reply.FAVORITES) !== "undefined") {
			this.createFavoritesList(reply.FAVORITES);
		}
	}catch(err) {
		if (timerRenderComponent) {
			timerRenderComponent.Abort();
			timerRenderComponent = null;
		}
		if (capTimer) {
			capTimer.SubtimerName = criterion.category_mean;          
			capTimer.Stop();
		}
		throw (err);
	}
	finally {
		if (timerRenderComponent) {
			timerRenderComponent.Stop();
		}
		if (capTimer) {
			capTimer.SubtimerName = criterion.category_mean;          
			capTimer.Stop();
		}
	}
};
/**
 * Checks the satisfier condition
 * @return {boolean} Returns boolean value based on selected follow up count
 */

PatientEducationO2Component.prototype.isRequirementSatisfied  = function () {
	var count = this.getResultCount() || 0;
	return count > 0;
};
/**
 * Updates the icon in the navigator section by firing event listener
 * @return {undefined} This function does not return a value
 */
PatientEducationO2Component.prototype.updateSatisfierRequirementIndicator = function () {
	if (this.getGapCheckRequiredInd()) {
		var isReqSatisfied = this.isRequirementSatisfied();
		this.setSatisfiedInd(isReqSatisfied);
		CERN_EventListener.fireEvent(this, this, EventListener.EVENT_SATISFIER_UPDATE, {
			satisfied : isReqSatisfied
		});
		this.updateComponentRequiredIndicator();
	}
};

/** overriding Mpage components resizeComponent method to set the height of selected Patient Education Div**/
PatientEducationO2Component.prototype.resizeComponent = function() {
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	if($("#tabContainer"+compID).length > 0 && $("#"+compNS+"-inst-div-"+compID).length > 0 && $("#"+compNS+"-inst-inner-div-"+compID).length > 0) {
		//Call the base class functionality to resize the component
		MPageComponent.prototype.resizeComponent.call(this, null);
		var containerObj = $('#tabContainer'+compID);
		var addedInstObj = $("#"+compNS+"-inst-div-"+compID);
		var innerInstObj = $("#"+compNS+"-inst-inner-div-"+compID);
	
		var containerHeight = containerObj.height();
		if(addedInstObj[0].offsetHeight && containerHeight != addedInstObj[0].offsetHeight){
			addedInstObj.css("height", containerHeight);
			if(innerInstObj){
				innerInstObj.css("overflow-y", "auto");
				innerInstObj.css("max-height", (containerHeight-5)+"px");
			}
		}
	}
};

/**
 ** This method is used to get the search results for All tab
 * @param {string} searchVal		: string to search.
 */
PatientEducationO2Component.prototype.getSearchResultsForAllTab = function(searchVal) {
	var self = this;
	var compNS = this.getStyles().getNameSpace();
	var compID = this.getComponentId();
	var tabContent = $("#" + compNS + "-tab-content-" + compID);
	searchVal=searchVal.replace(/\^/g, "&#94;");
	tabContent.empty().append("<span class='" + compNS + "-load'/>");
	var sendAr = ["^MINE^",self.getDomainCd()+ ".0","^" + searchVal + "^",0,self.getLanguageId()+ ".0", "0.0", 0 ];
	var progName = "MP_GET_PAT_EDU_INSTRUCTIONS";

	var request = new MP_Core.ScriptRequest(self,"ENG:MPG.PATIENTEDUCATION.O2 - load Tab Contents");
	request.setProgramName(progName);
	request.setParameters(sendAr);
	request.setAsync(true);
	MP_Core.XMLCCLRequestCallBack(self,request,function(reply){
		self.displayAllTabContent(reply);
	});
	return false;
};

/**
 ** This method is used to create the auto suggest list for instructions
 * @param {object} callback 	: callback control.
 * @param {object} textBox		: textbox object.
 * 'this' refers to autosuggest Object hence we need to fetch component object using this.component.
 */
PatientEducationO2Component.prototype.searchInstructions = function(callback,textBox) {
	var component = this.component;
	var compID = component.getComponentId();
	var compNS = component.getStyles().getNameSpace();
	var searchedInstructionsArray = [];
	var searchText = textBox.value.replace(/^\s+|\s+$/g,"");
	
	// Show delete image to clear the text entered within the search box
	if (searchText.length > 0) {
		$("#" + compNS + "clear-sugg-text" + compID).css("visibility","visible");
	}

	// fetch the instructions only after entering min 3 letters in he search box
	if (searchText.length < 3) {
		return;
	}
	
	clearTimeout(component.getTimerId());
	var timerId = setTimeout(function() {
		//Verify if ALL tab is highlighted then pull all the instructions
		if (component.getTabIndex() ===0) {
			component.getSearchResultsForAllTab(searchText);
		} else {
			var searchValue = searchText.toUpperCase();
			var instructionArray = component.getInstructionArray();
			var instCount = instructionArray.length;

			for ( var i = 0; i < instCount; i++) {
				var instDetails = instructionArray[i];
				var instName = instDetails.value.name.toUpperCase();
				var instFound = false;

				if (instName.indexOf(searchValue) === 0) {
					instFound = true;
				} 
				else {
					instFound = false;
				}
				if (instFound) {
					searchedInstructionsArray.push(instDetails);
				}
			}
			component.FavoriteSearchResult(searchedInstructionsArray);
		}
	}, 500);// waits for 0.5 second
	component.setTimerId(timerId);
};

/**
 ** Loads the Departmental or personal favorite based on the search results.
 * @param {[Array]} favoriteList 	: contains favorite Instructions information.
 */
PatientEducationO2Component.prototype.FavoriteSearchResult =  function(favoriteList){
	var arrayLength = favoriteList.length;
	var jsTabContentHTML = "";
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	
	var tabContent = $("#" + compNS + "-tab-content-" + compID);
	var i18nPatEdu = i18n.discernabu.patienteducation_o2;
	var noResultFound = "<span class='" + compNS + "-res-none'>"+ i18nPatEdu.NO_FAVORITE_FOUND + "</span>";
	
	if(arrayLength > 0) {
		for(var favIndex = 0; favIndex < arrayLength; favIndex++){
			var favoriteInstElement = favoriteList[favIndex];
			var favoriteInst = favoriteInstElement.value;
			//To replace special character like <>/" with its ascii code.
			var instName  = favoriteInst.name.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
			jsTabContentHTML = jsTabContentHTML + "<dl id='"+ favoriteInst.id + "' class='"+ compNS + "-res'>" +
					"<dt class='" + compNS + "-name'>" + instName + "</dt>" +
					"<dd class='" + compNS + "-val'>" + "</dd></dl>";
		}
		tabContent.empty().append(jsTabContentHTML);
	} else {
		tabContent.empty().append(noResultFound);
	}
};

/**
 * * This method is used to display the suggested instructions for the patient 
 * from the array
 */
PatientEducationO2Component.prototype.displaySuggstdInstructs = function() {
	var self = this;
	var compNS = this.getStyles().getNameSpace();
	var compID = this.getComponentId();
	var tabContent = $("#" + compNS + "-tab-content-" + compID);
	var i18nPatEdu = i18n.discernabu.patienteducation_o2;

	var noResultFound = "<span class='" + compNS + "-res-none'>"+ i18nPatEdu.NO_INSTRUCTION_FOUND+ "</span>";
	var diagnosisArray = self.getDiagnosisArray();
	var diagCount = diagnosisArray.length;
	if ( diagCount > 0){	
		// Show the loading symbol prior to loading the suggested instructions
		tabContent.empty().append("<span class='" + compNS + "-load'/>");
		var suggestedInstHTML = [];
		var instructionHTML = "";
		var instArray = [];

		for ( var diagIndex = 0; diagIndex < diagCount; diagIndex++) {
			var diagData = diagnosisArray[diagIndex];
			var diagInstCount = diagData.INSTRUCTS.length;
		
			if( diagInstCount > 0 ){
			
				/*
				 * Diagnosis name is displayed as sub header toggle
				 */
				suggestedInstHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'>" +
								"<span class='sub-sec-hd-tgl'>-</span><span class='sub-sec-title'>" +
								diagData.displayName +
								"</span></h3><div class='sub-sec-content'>");

				/*
				 * Diagnosis based suggested instructions are loaded in the sub section
				 */
				for ( var instIndex = 0; instIndex < diagInstCount; instIndex++) {
					var instData = diagData.INSTRUCTS[instIndex];
					suggestedInstHTML.push("<dl id='"+ instData.value.id + "' class='" + compNS + "-res'>"+
							"<dt class='" + compNS+ "-name'>" + instData.value.name + "</dt>"+
							"<dd class='" + compNS+ "-val'></dd></dl>");

					var InstObj = {};
					InstObj.id = instData.value.id;
					InstObj.name = instData.value.name;
					InstObj.langId = instData.value.langId;
					InstObj.keyDocId = instData.value.keyDocId;
					InstObj.ReferTextId = instData.value.ReferTextId;
					InstObj.trackingGroupCd = instData.value.trackingGroupCd;
					InstObj.personId = instData.value.personId;
					var mapObj = new self.mapObject(InstObj.id,InstObj);
					instArray.push(mapObj);
				}
				suggestedInstHTML.push("</div></div>");
			}
		}
		self.setInstructionArray(instArray);
		instructionHTML = suggestedInstHTML.join("") || noResultFound  ;
		tabContent.empty().append(instructionHTML);
		if(instArray.length){
			var node = self.getSectionContentNode();
			MP_Util.Doc.InitSubToggles(node, "sub-sec-hd-tgl");
		}		
	} else {
		tabContent.empty().append(noResultFound);
	}
};

/**
 * * This method is used to fetch the suggested instruction for the patient. 
 * These instructions are based on the diagnosis added to the patient and
 * suggested instructions are displayed on load of the component
 */
PatientEducationO2Component.prototype.getSuggestedInstructions = function() {
	var self = this;
	var compNS = this.getStyles().getNameSpace();
	var criterion = this.getCriterion();
	var compID = this.getComponentId();
	var tabContent = $("#" + compNS + "-tab-content-" + compID);
	var i18nPatEdu = i18n.discernabu.patienteducation_o2;

	var sendAr = [ "^MINE^", criterion.encntr_id + ".0", self.getLanguageId() + ".0",self.getDomainCd() + ".0" ];
	var progName = "MP_GET_DIAGNOSIS_INST";

	var request = new MP_Core.ScriptRequest(self,"ENG:MPG.PATIENTEDUCATION.O2 - Fetch Suggested Instructions");

	// Show the loading symbol prior to loading the suggested instructions
	tabContent.empty().append("<span class='" + compNS + "-load'/>");

	request.setProgramName(progName);
	request.setParameters(sendAr);
	request.setAsync(true);
	MP_Core.XMLCCLRequestCallBack(self,request,function(reply) {

		var noResultFound = "<span class='" + compNS + "-res-none'>"+ i18nPatEdu.NO_INSTRUCTION_FOUND+ "</span>";

		if (reply.getStatus() === "S") {
			var record_data = reply.getResponse();			
			self.createDiagnosisList(record_data.ITEM);
			
			if(self.getTabIndex() ===0){
				var suggestedInstHTML = [];
				var instArray = [];
				var replyCount = record_data.ITEM.length;
				var instructionHTML = "";				
			
				for ( var diagIndex = 0; diagIndex < replyCount; diagIndex++) {
					var diagData = record_data.ITEM[diagIndex];
					var diagInstCount = diagData.INSTRUCTS.length;
					
					if( diagInstCount > 0 ){
						/*
						 * Diagnosis name is displayed as sub header toggle
						 */
						suggestedInstHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'>" +
										"<span class='sub-sec-hd-tgl'>-</span><span class='sub-sec-title'>" +
										diagData.DIAGNOSIS_DISPLAY +
										"</span></h3><div class='sub-sec-content'>");

						/*
						 * Diagnosis based suggested instructions are loaded in the sub section
						 */
						for ( var instIndex = 0; instIndex < diagInstCount; instIndex++) {
							var instData = diagData.INSTRUCTS[instIndex];
							//To replace special character like <>/" with its ascii code.
							var instName  = instData.NAME.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
							suggestedInstHTML.push("<dl id='"+ instData.RELATION_ID+ "' class='" + compNS + "-res'>"+
									"<dt class='" + compNS+ "-name'>" + instName+ "</dt>"+
									"<dd class='" + compNS+ "-val'></dd></dl>");

							var InstObj = {};
							InstObj.id = instData.RELATION_ID;
							InstObj.name = instData.NAME;
							InstObj.langId = instData.DOC_LANG_ID;
							InstObj.keyDocId = instData.KEY_DOC_IDENT;
							InstObj.ReferTextId = instData.REFR_TEXT_ID;
							InstObj.trackingGroupCd = instData.TRACKING_GROUP_CD;
							InstObj.personId = instData.PERSON_ID;
							var mapObj = new self.mapObject(InstObj.id,InstObj);
							instArray.push(mapObj);
						}
						suggestedInstHTML.push("</div></div>");
					}
				}
				self.setInstructionArray(instArray);
				instructionHTML = suggestedInstHTML.join("") || noResultFound  ;
				tabContent.empty().append(instructionHTML);
				if(instArray.length){
					var node = self.getSectionContentNode();
					MP_Util.Doc.InitSubToggles(node, "sub-sec-hd-tgl");
				}
			}
		} else {
			tabContent.empty().append(noResultFound);
		}
	});
};

/**
 * * This method is used to Display ALL the instruction for the patient.
 */
PatientEducationO2Component.prototype.displayAllTabContent = function(reply) {
	var compNS = this.getStyles().getNameSpace();
	var compID = this.getComponentId();
	var tabContent = $("#" + compNS + "-tab-content-" + compID);
	var i18nPatEdu = i18n.discernabu.patienteducation_o2;
	var noResultFound = "<span class='" + compNS + "-res-none'>"+ i18nPatEdu.NO_INSTRUCTION_FOUND + "</span>";

	if (reply.getStatus() === "S") {
		var recordData = reply.getResponse();
		var replyLength = recordData.QUAL.length;
		var instArray = [];
		var jsTabContentHTML = "";
		
		$("#"+compNS + "-tab-content-title-"+compID).text(i18nPatEdu.SEARCH_INSTRUCTION);
		for ( var i = 0; i < replyLength; i++) {
			var instElement = recordData.QUAL[i];
			//To replace special character like <>/" with its ascii code.
			var instName  = instElement.NAME.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
			jsTabContentHTML = jsTabContentHTML + "<dl id='"+ instElement.RELATION_ID + "' class='" + compNS+ "-res'>" +
			"<dt class='" + compNS + "-name'>"+ instName + "</dt>" +
			"<dd class='"+ compNS + "-val'></dd></dl>";

			
			// creating JSON object for Instructions
			var InstObj = {};
			InstObj.id = instElement.RELATION_ID;
			InstObj.name = instElement.NAME;
			InstObj.langId = instElement.DOC_LANG_ID;
			InstObj.keyDocId = instElement.KEY_DOC_IDENT;
			InstObj.ReferTextId = instElement.REFR_TEXT_ID;
			InstObj.trackingGroupCd = instElement.TRACKING_GROUP_CD;
			InstObj.personId = instElement.PERSON_ID;
			var mapObj = new this.mapObject(InstObj.id, InstObj);
			instArray.push(mapObj);

		}
		this.setInstructionArray(instArray);

		if (instArray.length <= 0) {
			tabContent.empty().append(noResultFound);
		} else {
			tabContent.empty().append(jsTabContentHTML);
		}
	} else {
		tabContent.empty().append(noResultFound);
	}
};

/**
 * * This method is used to display Departmental favorite instructions.
 */
PatientEducationO2Component.prototype.displayDepartmentalFavorites = function(reply) {
	var compNS = this.getStyles().getNameSpace();
	var i18nPatEdu = i18n.discernabu.patienteducation_o2;
	var compID = this.getComponentId();
	var tabContent = $("#" + compNS + "-tab-content-" + compID);
	var allLanguageId = 0;
	var noResultFound = "<span class='" + compNS + "-res-none'>"+ i18nPatEdu.NO_FAVORITE_FOUND + "</span>";
	
	if (reply.getStatus() === "S") {

		var recordData = reply.getResponse();
		var favoriteInstArray = [];
		var jsTabContentHTML = "";
		var selectedLangId = this.getLanguageId();
		var replyLength = recordData.QUAL.length;
		this.createFavoritesList(recordData.QUAL);
		
		var autoSuggCtrlId = $("#" + compNS + "ContentCtrl" + compID);
		var searchValue = autoSuggCtrlId.val().toUpperCase();
		if(autoSuggCtrlId.hasClass(compNS + "-search-title")) {
			searchValue = "";
		} 		
		
		for ( var i = 0; i < replyLength; i++) {
			var favoriteInstElement = recordData.QUAL[i];
			var currentInstLangId = favoriteInstElement.DOC_LANG_ID;
			//To replace special character like <>/" with its ascii code.
			var favoriteName  = favoriteInstElement.PAT_ED_DESC.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
			
			var instFound = false;
			if ((searchValue === "") || (favoriteInstElement.PAT_ED_DESC.toUpperCase().indexOf(searchValue) === 0)) {
				instFound = true;
			} 
			else {
				instFound = false;
			}
			if (instFound) {
				if ((favoriteInstElement.TRACKING_GROUP_CD > 0.0) && (selectedLangId == currentInstLangId || selectedLangId == allLanguageId)) {
					jsTabContentHTML = jsTabContentHTML + "<dl id='"+ favoriteInstElement.PAT_ED_RELTN_ID + "' class='"+ compNS + "-res'>" +
							"<dt class='" + compNS + "-name'>" + favoriteName + "</dt>" +
							"<dd class='" + compNS + "-val'>" + "</dd></dl>";

					// creating json object for Instructions
					var favInstObj = {};
					favInstObj.id = favoriteInstElement.PAT_ED_RELTN_ID;
					favInstObj.name = favoriteInstElement.PAT_ED_DESC;
					favInstObj.langId = favoriteInstElement.DOC_LANG_ID;
					favInstObj.keyDocId = favoriteInstElement.KEY_DOC_IDENT;
					favInstObj.ReferTextId = favoriteInstElement.REF_TEXT_ID;
					favInstObj.trackingGroupCd = favoriteInstElement.TRACKING_GROUP_CD;
					favInstObj.personId = favoriteInstElement.PERSON_ID;
					var mapObj = new this.mapObject(favInstObj.id, favInstObj);
					favoriteInstArray.push(mapObj);
				}
			}
		}
		this.setInstructionArray(favoriteInstArray);
		if (favoriteInstArray.length <= 0) {
			tabContent.empty().append(noResultFound);
		} else {
			tabContent.empty().append(jsTabContentHTML);
		}
	} else {
		tabContent.empty().append(noResultFound);
	}
};

/**
 * * This method is used to display Personal favorite instructions.
 */
PatientEducationO2Component.prototype.displayPersonalFavorites = function(reply) {
	var compNS = this.getStyles().getNameSpace();
	var selectedInstLangId = this.getLanguageId();
	var i18nPatEdu = i18n.discernabu.patienteducation_o2;
	var compID = this.getComponentId();
	var tabContent = $("#" + compNS + "-tab-content-" + compID);
	var allLanguageId = 0;
	var noResultFound = "<span class='" + compNS + "-res-none'>"+ i18nPatEdu.NO_FAVORITE_FOUND + "</span>";
	
	if (reply.getStatus() === "S") {

		var recordData = reply.getResponse();
		var favoriteInstArray = [];
		var jsTabContentHTML = "";
		var replyCount = recordData.QUAL.length;
		this.createFavoritesList(recordData.QUAL);

		var autoSuggCtrlId = $("#" + compNS + "ContentCtrl" + compID);
		var searchValue = autoSuggCtrlId.val().toUpperCase();
		if(autoSuggCtrlId.hasClass(compNS + "-search-title")) {
			searchValue = "";
		} 
		
		for ( var i = 0; i < replyCount; i++) {
			var favoriteInstElement = recordData.QUAL[i];
			var currentInstLangId = favoriteInstElement.DOC_LANG_ID;
			//To replace special character like <>/" with its ascii code.
			var favoriteName  = favoriteInstElement.PAT_ED_DESC.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
			
			var instFound = false;
			if ((searchValue === "") || (favoriteInstElement.PAT_ED_DESC.toUpperCase().indexOf(searchValue) === 0)) {
				instFound = true;
			} 
			else {
				instFound = false;
			}
			if (instFound) {
				//If the instruction is added to Personal Favorite then PERSON_ID > 0.0	
				if ((favoriteInstElement.PERSON_ID > 0.0) && (selectedInstLangId == currentInstLangId || selectedInstLangId == allLanguageId)) {
					jsTabContentHTML = jsTabContentHTML + "<dl id='" +
							favoriteInstElement.PAT_ED_RELTN_ID + "' class='"	+ compNS + "-res'>" + 
							"<dt class='" + compNS +
							"-name'>" + favoriteName + "</dt>" +
							"<dd class='" + compNS + "-val'>" + "</dd></dl>";

					// creating JSON object for Instruction
					var favInstObj = {};
					favInstObj.id = favoriteInstElement.PAT_ED_RELTN_ID;
					favInstObj.name = favoriteInstElement.PAT_ED_DESC;
					favInstObj.langId = favoriteInstElement.DOC_LANG_ID;
					favInstObj.keyDocId = favoriteInstElement.KEY_DOC_IDENT;
					favInstObj.ReferTextId = favoriteInstElement.REF_TEXT_ID;
					favInstObj.trackingGroupCd = favoriteInstElement.TRACKING_GROUP_CD;
					favInstObj.personId = favoriteInstElement.PERSON_ID;
					var mapObj = new this.mapObject(favInstObj.id, favInstObj);
					favoriteInstArray.push(mapObj);
				}
			}
		}
		this.setInstructionArray(favoriteInstArray);

		if (favoriteInstArray.length <= 0) {
			tabContent.empty().append(noResultFound);
		} else {
			tabContent.empty().append(jsTabContentHTML);
		}
	} else {
		tabContent.empty().append(noResultFound);
	}
};

/**
 * * This method is used to fetch added instructions
 */
PatientEducationO2Component.prototype.getAddedInstructions = function() {
	var self = this;
	var criterion = self.getCriterion();

	var sendAr = [ "^MINE^", criterion.person_id + ".0",criterion.encntr_id + ".0", self.getDomainCd() + ".0" ];
	var progName = "MP_GET_SELECTED_INSTRUCTIONS";

	var request = new MP_Core.ScriptRequest(self,"ENG:MPG.PATIENTEDUCATION.O2 - Fetch Instructions");
	request.setProgramName(progName);
	request.setParameters(sendAr);
	request.setAsync(true);
	MP_Core.XMLCCLRequestCallBack(self, request,function(reply){
		self.displayAddedInstructions(reply);
	}); 
};

/**
 * * This method is used to display added instruction
 */
PatientEducationO2Component.prototype.displayAddedInstructions = function(reply) {
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var instructionHtml = [];
	var report_data = reply.getResponse();
	var instArray = [];
	var replyLength = report_data.QUAL.length;
	var instructionDiv = $("#" + compNS + "-inst-div-" + compID);
	var i18nPatEdu = i18n.discernabu.patienteducation_o2;
	var component = this;
	var educationAssessLinkHtml = component.displayEducationAssessLink();

	if (reply.getStatus() === "S" || reply.getStatus() === "Z") {
		if (replyLength <= 0) {
			var noDataHtml = [];
			noDataHtml.push("<div class='" + compNS + "-no-result'><span class='" + compNS + "-no-data-glyph'></span>" + "<span class='" + compNS + "-no-data-text'>" + 
							i18nPatEdu.NO_PATIENT_EDUCATION + "</span></div>");
			instructionDiv.empty().append(noDataHtml.join(""));
			component.setResultCount(0);
			component.updateSatisfierRequirementIndicator();
		} else {
			if (replyLength >= 1) {
				component.setResultCount(replyLength);
				component.updateSatisfierRequirementIndicator();
			}
			instructionHtml.push("<div class='" + compNS + "-inst-title'>" + i18nPatEdu.ADDED_PATIENT_EDUCATION + educationAssessLinkHtml + "</div>" +
				"<div id='" + compNS + "-inst-inner-div-" + compID + "' class='" + compNS + "-inst-inner-div'>");

			for (var iCount = 0; iCount < replyLength; iCount++) {
				var instElement = report_data.QUAL[iCount];
				//To replace special character like <>/" with its ascii code.
				var instName  = instElement.DESC.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

				instructionHtml.push("<dl id = '"+ instElement.PAT_ED_DOC_ACTIVITY_ID + "' class='"+ compNS + "-inst-res'>" +
						"<dt class='" + compNS+ "-inst-data'>" + instName + "</dt>" +
						"<dd class='" + compNS + "-inst-modify'>" +
						"<span class='" + compNS + "-print' title=" + i18nPatEdu.PRINT + "></span>" +
						"<span class='" + compNS + "-edit' title="+ i18nPatEdu.EDIT +"></span>" +
						"<span class='" + compNS + "-remove' title="+ i18nPatEdu.REMOVE +"></span></dd>" +
						"</dl>");

				// creating JSON object for Instruction
				var InstObj = {};
				InstObj.id = instElement.PAT_ED_DOC_ACTIVITY_ID;
				InstObj.reltnid = instElement.RELTN_ID;
				InstObj.name = instElement.DESC;
				InstObj.langId = instElement.DOC_LANG_ID_VALUE;
				InstObj.keyDocId = instElement.KEY_DOC_IDENT;

				var mapObj = new this.mapObject(InstObj.id, InstObj);
				instArray.push(mapObj);
			}
			this.setSelectedInstructionArray(instArray);
			instructionHtml.push("</div>");
			instructionDiv.empty().append(instructionHtml.join(""));
			instructionDiv.css('background-color','#FFF');
		}
	}
};

/**
 * * This method is used to get Personal Favorites
 */
PatientEducationO2Component.prototype.getPersonalFavorites = function() {
	var self = this;
	var criterion = self.getCriterion();
	var sendAr = [ "^MINE^", criterion.provider_id + ".0",self.getDomainCd() + ".0",self.getTrackingGroupCd() + ".0" ];
	var progName = "MP_GET_PAT_EDU_FAVORITES";
	
	var request = new MP_Core.ScriptRequest(self,"ENG:MPG.PATIENTEDUCATION.O2 - load Personal Favorites");
	request.setProgramName(progName);
	request.setParameters(sendAr);
	request.setAsync(true);
	MP_Core.XMLCCLRequestCallBack(self, request,function(reply) {
		if(self.getTabIndex() == 2){
			self.displayPersonalFavorites(reply);
		}	
	});
};

/**
 * * This method is used to get Departmental Favorites
 */
PatientEducationO2Component.prototype.getDepartmentalFavorites = function() {
	var self = this;
	var criterion = self.getCriterion();
	var sendAr = [ "^MINE^", criterion.provider_id + ".0", self.getDomainCd() + ".0",self.getTrackingGroupCd() + ".0" ];
	var progName = "MP_GET_PAT_EDU_FAVORITES";
	
	var request = new MP_Core.ScriptRequest(self,"ENG:MPG.PATIENTEDUCATION.O2 - load Departmental Favorites");
	request.setProgramName(progName);
	request.setParameters(sendAr);
	request.setAsync(true);
	MP_Core.XMLCCLRequestCallBack(self, request,function(reply) {
		if(self.getTabIndex() == 1){
			self.displayDepartmentalFavorites(reply);
		}
	});		
};

/**
 * * This method is to recreate the favorites instructions array based on the
 * updation done for instructions.
 */
PatientEducationO2Component.prototype.updateFavoritesList = function() {
	var component = this;
	var criterion = component.getCriterion();
	var sendAr = [ "^MINE^", criterion.provider_id + ".0",component.getDomainCd() + ".0",component.getTrackingGroupCd() + ".0" ];
	var progName = "MP_GET_PAT_EDU_FAVORITES";

	var request = new MP_Core.ScriptRequest(component,"ENG:MPG.PATIENTEDUCATION.O2 - load Personal Favorites");
	request.setProgramName(progName);
	request.setParameters(sendAr);
	request.setAsync(false);

	MP_Core.XMLCCLRequestCallBack(component,request,function(reply) {
		var recordData = reply.getResponse();
		var favoriteInstCount = recordData.QUAL.length;
		var favoriteInstArray = [];
		
		// Load the Favorites
		for ( var favriteCount = 0; favriteCount < favoriteInstCount; favriteCount++) {
			var favoriteElement = recordData.QUAL[favriteCount];
			var favoriteInstDetails = null;
			if (favoriteInstArray) {
				favoriteInstDetails = component.getValueFromArray(favoriteElement.PAT_ED_RELTN_ID,favoriteInstArray);
			}
			if (favoriteInstDetails) {
				if (favoriteElement.PERSON_ID > 0.0) {
					favoriteInstDetails.personId = favoriteElement.PERSON_ID;
				}
				if (favoriteElement.TRACKING_GROUP_CD > 0.0) {
					favoriteInstDetails.trackingGroup = favoriteElement.TRACKING_GROUP_CD;
				}
			} else {
				// creating json object for Favorite Inst
				var InstObj = {};
				InstObj.id = favoriteElement.PAT_ED_RELTN_ID;
				InstObj.personId = favoriteElement.PERSON_ID;
				InstObj.langId = favoriteElement.DOC_LANG_ID;
				InstObj.description = favoriteElement.PAT_ED_DESC;
				InstObj.trackingGroup = favoriteElement.TRACKING_GROUP_CD;

				var mapObj = new component.mapObject(InstObj.id, InstObj);
				favoriteInstArray.push(mapObj);
			}

		}
		component.setFavoriteInstructionArray(favoriteInstArray);
		if (component.getTabIndex() == 2) {
			component.displayPersonalFavorites(reply);
		} else if (component.getTabIndex() == 1) {
			component.displayDepartmentalFavorites(reply);
		}
	});
};

PatientEducationO2Component.prototype.getValueFromArray = function(name, array) {
	if (array !== null) {
		for ( var x = 0, xi = array.length; x < xi; x++) {
			if (array[x].name == name) {
				return array[x].value;
			}
		}
	}
	return null;
};

PatientEducationO2Component.prototype.loadDataOnAutoSuggestFocusOut =  function(){
	var self = this;
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var i18nPatEdu = i18n.discernabu.patienteducation_o2;
	var tabHeaderObj = $("#"+compNS + "-tab-content-title-"+compID);
	var tabContent = $("#" + compNS + "-tab-content-" + compID);
		
	tabContent.empty().append("<span class='" + compNS + "-load'/>");
	
	switch (self.getTabIndex()) {
		case 0:
			tabHeaderObj.text(i18nPatEdu.SUGGESTED);
			self.displaySuggstdInstructs();
			break;
		case 1:
			tabHeaderObj.text(i18nPatEdu.DEPARTMENTAL_FAVORITES);
			self.getDepartmentalFavorites();
			break;
		case 2:
			tabHeaderObj.text(i18nPatEdu.PERSONAL_FAVORITES);
			self.getPersonalFavorites();
			break;
		default:
			break;
	}
};

/**
 * * This method is to set the dithered text in the search field
 *  based on the tab selected.
 */
PatientEducationO2Component.prototype.setTitleForSearchField = function(tabIndex){
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var i18nPatEdu = i18n.discernabu.patienteducation_o2;
	var autoSuggCtrlId = $("#" + compNS + "ContentCtrl" + compID);

	switch(tabIndex){
		case 1:autoSuggCtrlId.attr("title", i18nPatEdu.SEARCH_DEPARTMENTAL_FAVORITE);
		break;
		case 2:autoSuggCtrlId.attr("title", i18nPatEdu.SEARCH_PERSONAL_FAVORITE);
		break;
		default:autoSuggCtrlId.attr("title", i18nPatEdu.SEARCH_PATIENT_EDUCATION);
		break;
	}
};

PatientEducationO2Component.prototype.attachListeners = function() {
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var component = MP_Util.GetCompObjById(compID);
	var criterion = component.getCriterion();
	var self = this;
	var i18nPatEdu = i18n.discernabu.patienteducation_o2;

	var componentContent = $(this.getSectionContentNode());
	var autoSuggCtrlId = $("#" + compNS + "ContentCtrl" + compID);
	var clearSearchTxtId = $("#" + compNS + "clear-sugg-text" + compID);
	var tabContent = $("#" + compNS + "-tab-content-" + compID);
	var languageId = $("#" + compNS + "-lang-combobox-" + compID).val() || '';
	
	//if no language is selected, default language is all language
	if(!languageId){
		$("#" + compNS + "-lang-combobox-" + compID).prop('selectedIndex', 0);
		self.setLanguageId(0);
	}
	//restore the tab selected while changing the content domain
	var selectedTab = self.getTabIndex();
	switch(selectedTab){
		case 1 :
			$("#"+compNS + "-departmental-" + compID).trigger("click");
			break;
		case 2 :
			$("#"+compNS + "-personal-" + compID).trigger("click");
			break;
		default :
			$("#"+compNS + "-all-" + compID).trigger("click");
			break;
	}

	// unbind the events attached, needed since we recreate the component when changing the content domain
	autoSuggCtrlId.off();

	self.setTitleForSearchField(selectedTab);

	autoSuggCtrlId.keydown(function(e) {
		if (((e.keyCode === 8) || (e.keyCode === 46)) && (autoSuggCtrlId.val().length === 1)) {
			clearSearchTxtId.css("visibility", "hidden");
		}
	});
	
	autoSuggCtrlId.keyup(function(e) {
		if (((e.keyCode === 8) || (e.keyCode === 46)) && (autoSuggCtrlId.val().length === 0)) {
			self.loadDataOnAutoSuggestFocusOut();
			clearSearchTxtId.css("visibility","hidden");
		}
	});

	autoSuggCtrlId.focus(function() {
		var searchObj = $(this);
		if (searchObj.val() == searchObj[0].title) {
			searchObj.removeClass(compNS + "-search-title").val("");
		}
	});

	autoSuggCtrlId.focusout(function() {
		var searchObj = $(this);
		if (searchObj.val() === ""){
			self.loadDataOnAutoSuggestFocusOut();
			autoSuggCtrlId.addClass(compNS + "-search-title");
			autoSuggCtrlId.val(autoSuggCtrlId[0].title);
		}
	});

	// Unbind the events
	clearSearchTxtId.off();

	/* on hovering over the clear image change the icon to grey background image */
	clearSearchTxtId.mouseenter(function() {
		clearSearchTxtId.addClass(compNS +"-del-hover");
	});

	/* on mouse out the clear image change the icon color to default */
	clearSearchTxtId.mouseout(function() {
		clearSearchTxtId.removeClass(compNS +"-del-hover");
	});

	/* Event to clear the search text entered */
	clearSearchTxtId.click(function() {
		autoSuggCtrlId.val("");
		autoSuggCtrlId.focusout();
		clearSearchTxtId.removeClass(compNS + "-del-hover").css("visibility", "hidden");
	});

	componentContent.off("click", "#" + "patEduAck" + compID);
	componentContent.on("click","#" + "patEduAck" + compID,function() {
	try {
			component.launchChartSelection();
		} catch (err) {
			logger.logJSError(err, this, "patienteducation-o2.js", "EducationAssessmentClick");
		}
	});

	// Unbind the events
	componentContent.off("click", "div." + compNS + "-tab");

	/*
	 * Event to retrieve the instructions based on the tab selected among
	 * All/Departmental/Personal tabs
	 */
	componentContent.on("click","div." + compNS + "-tab",function() {
		clearSearchTxtId.removeClass(compNS +"-del-hover").css("visibility", "hidden");
		tabContent.empty().append("<span class='" + compNS + "-load'/>");
		$("." + compNS + "-tab").removeClass('selected');
		$(this).addClass('selected');

		var tabSelectedId = $(this).attr("id");

		switch (tabSelectedId) {
			case compNS + "-departmental-" + compID:
				autoSuggCtrlId.attr('title', i18nPatEdu.SEARCH_DEPARTMENTAL_FAVORITE);
				self.setTabIndex(1);
				self.getDepartmentalFavorites();
				break;
			case compNS + "-personal-" + compID:
				autoSuggCtrlId.attr('title', i18nPatEdu.SEARCH_PERSONAL_FAVORITE);
				self.setTabIndex(2);
				self.getPersonalFavorites();
				break;
			default:
				autoSuggCtrlId.attr('title', i18nPatEdu.SEARCH_PATIENT_EDUCATION);
				self.setTabIndex(0);
				break;
		}

		// For clearing the searchbox content
		autoSuggCtrlId.val("");
		autoSuggCtrlId.focusout();

		return false;
	});

	/*
	 * Event to fetch the instructions based on the language changed using combo
	 * within component
	 */
	$("#" + compNS + "-lang-combobox-" + compID).off().change(function() {
		self.setLanguageId($(this).val());
		tabContent.empty().append("<span class='" + compNS + "-load'/>");

		switch (self.getTabIndex()) {
			case 0:
				var searchVal = autoSuggCtrlId.val();
				if (autoSuggCtrlId.hasClass(compNS + "-search-title")) {
					self.getSuggestedInstructions();
				} else {
					self.getSearchResultsForAllTab(searchVal);
				}
				break;
			case 1:
				self.getDepartmentalFavorites();
				break;
			case 2:
				self.getPersonalFavorites();
				break;
			default:
				break;
		}
	});

	// unbind
	componentContent.off("click", "span." + compNS + "-remove");

	/* Event added to remove the instruction */
	componentContent.on("click","span." + compNS + "-remove",function() {
		var self = this;
		var instructionID = $(self).closest("dl").attr('id');

		var personId = criterion.person_id;
		var encntrId = criterion.encntr_id;
		var sendAr = [ "^MINE^", personId + ".0",encntrId + ".0", 0, instructionID + ".0","0.0", 0, "^^", "0.0", "0.0", "^^", 1 ];

		var request = new MP_Core.ScriptRequest(component,"ENG:MPG.PATIENTEDUCATION.O2 - Remove Patient Instructions");
		request.setParameters(sendAr);
		request.setName("RemoveSelectedInstruction");
		request.setProgramName("MP_ADD_UPD_PAT_EDU");
		request.setAsync(true);
		MP_Core.XMLCCLRequestCallBack(component, request,function(reply) {
			if (reply.getStatus() === "S") {
				// Remove instruction's row
				$(self).closest("dl").remove();

				// Get the count of instructions listed for patient
				var instructionsCnt = $("#" + compNS+ "-inst-inner-div-"+ compID).children('dl').length;
				if (instructionsCnt <= 0) {
					var educationAssessLinkHtml = component.displayEducationAssessLink();
					// If there are no instructions then show message 'No patient education has been added'
					var noDataHtml = [];
					
					noDataHtml.push(educationAssessLinkHtml);
					noDataHtml.push("<div class='" + compNS + "-no-result'><div class='" + compNS + "-no-data-glyph'></div><span class='" + compNS + "-no-data-text'>" +
						i18nPatEdu.NO_PATIENT_EDUCATION + "</span></div>");
					$("#" + compNS + "-inst-div-" + compID).empty().append(noDataHtml.join("")).css('background-color', '#F6F6F6');
					//update the Gap check Indicators on delete
					component.setResultCount(instructionsCnt);
					component.updateSatisfierRequirementIndicator();
				}
			} else {
				MP_Util.LogScriptCallInfo(null, this, "master-component.js", "Failed to remove selected instruction.");
			}
		});

	}); 

	// unbind
	componentContent.off("click", "span." + compNS + "-edit");

	// Event to launch the Patient Education win32 control
		componentContent.on("click", "span." + compNS + "-edit", function () {
		var self = this;
		var instructionID = $(self).closest("dl").attr('id');
		component.openTab(instructionID);
	});
	
	// unbind
	componentContent.off("click", "span." + compNS + "-print");

	// Event to launch the Patient Education win32 control
	componentContent.on("click", "span." + compNS + "-print", function () {
		var instructionID = $(this).closest("dl").attr('id');
		component.printPatEduSingleInstruction(instructionID);
	});

	// unbind
	componentContent.off("click", "dl." + compNS + "-res");

	// To add the instruction to selected folder from the available folder
	componentContent.on("click","dl." + compNS + "-res",function() {
		var currentObj = $(this);
		var instructionId = $(this).attr("id");
		var instDetails = self.getValueFromArray(instructionId, self.getInstructionArray());
		currentObj.addClass(compNS + "-clicked");
		currentObj.siblings().removeClass(compNS + "-clicked");
		currentObj.siblings().removeClass(compNS + "-right-clicked");
		currentObj.removeClass(compNS + "-right-clicked");
		var instructionName=instDetails.name;
		instructionName=instructionName.replace(/\^/g, "&#94;");
		
		var sendAr = [ "^MINE^", criterion.person_id + ".0",criterion.encntr_id + ".0", 1, instructionId  + ".0",0 +
		               ".0", 0, "^" + instructionName + "^",component.getDomainCd() +
					   ".0",instDetails.langId + ".0","^" + instDetails.keyDocId + "^", 0 ];

		var progName = "MP_ADD_UPD_PAT_EDU";

		var request = new MP_Core.ScriptRequest(component,"ENG:MPG.PATIENTEDUCATION.O2 - Add Selected Instruction To Patient Education");
		request.setProgramName(progName);
		request.setParameters(sendAr);
		request.setAsync(true);
		MP_Core.XMLCCLRequestCallBack(component, request,function(reply){
			if (reply.getStatus() === "S") {
				component.getAddedInstructions();
			} else {
				MP_Util.LogScriptCallInfo(null, this, "master-component.js", "Failed to add the instruction.");
			}
			
		});	

	});

	// unbind
	componentContent.off("click", "." + compNS + "-inst-res");

	// Once the instruction is highlighted , change the row color to light blue
	componentContent.on("click","." + compNS + "-inst-res",function() {
		$(this).toggleClass(compNS + "-clicked-added-inst").siblings().removeClass(compNS + "-clicked-added-inst");
	});

	// unbind
	componentContent.off("contextmenu","." + compNS + "-inst-res , ." + compNS + "-res");

	// to display menu on right click on row selected
	componentContent.on("contextmenu","." + compNS + "-inst-res , ." + compNS + "-res",function(event) {
		var selectedInst = this;
		var contextMenu = null;
		var personalFavoriteAdd = null;
		var personalFavoriteRemove = null;
		var departmentalFavoriteAdd = null;
		var departmentalFavoriteRemove = null;
		var instDetails;
		var relationId;
		var favoriteInstDetails;

		contextMenu = MP_MenuManager.getMenuObject("FavoriteContextMenu");
		if (!contextMenu) {
			contextMenu = new ContextMenu("FavoriteContextMenu").setAnchorElementId("FavoriteContextMenuAnchor");
			contextMenu.setAnchorConnectionCorner([ "top", "left" ]).setContentConnectionCorner([ "top", "left" ]);
			
			var compMenuSeperator = new MenuSeparator("compMenuSeperator" + compID);

			personalFavoriteAdd = new MenuSelection("Add to personal Favorites");
			personalFavoriteAdd.setLabel(i18nPatEdu.ADD_TO_PERSONAL_FAVOTIRE);
			contextMenu.addMenuItem(personalFavoriteAdd);

			contextMenu.addMenuItem(compMenuSeperator);

			personalFavoriteRemove = new MenuSelection("Remove from personal Favorites");
			personalFavoriteRemove.setLabel(i18nPatEdu.REMOVE_FROM_PERSONAL_FEVORITE);
			contextMenu.addMenuItem(personalFavoriteRemove);

			contextMenu.addMenuItem(compMenuSeperator);

			departmentalFavoriteAdd = new MenuSelection("Add to deptartmental Favorites");
			departmentalFavoriteAdd.setLabel(i18nPatEdu.ADD_TO_DEPARTMENTAL_FAVOTIRE);
			contextMenu.addMenuItem(departmentalFavoriteAdd);

			contextMenu.addMenuItem(compMenuSeperator);

			departmentalFavoriteRemove = new MenuSelection("Remove from deptartmental favorites");
			departmentalFavoriteRemove.setLabel(i18nPatEdu.REMOVE_FROM_DEPT_FEVORITE);
			contextMenu.addMenuItem(departmentalFavoriteRemove);

			MP_MenuManager.addMenuObject(contextMenu);
		}

		personalFavoriteAdd = contextMenu.getMenuItemArray()[0];
		personalFavoriteRemove = contextMenu.getMenuItemArray()[2];
		departmentalFavoriteAdd = contextMenu.getMenuItemArray()[4];
		departmentalFavoriteRemove = contextMenu.getMenuItemArray()[6];

		// Initally set the menu items disabled
		personalFavoriteAdd.setIsDisabled(true);
		personalFavoriteRemove.setIsDisabled(true);
		departmentalFavoriteAdd.setIsDisabled(true);
		departmentalFavoriteRemove.setIsDisabled(true);

		// get the highlighted rows's instructions id
		var instructionID = $(selectedInst).closest("dl").attr('id');
		// It checks for the available instructions in the tabs.
		if ($('#' + instructionID).hasClass(compNS + "-res")) {
			var currentObj = $(this);
			instDetails = self.getValueFromArray(instructionID,self.getInstructionArray());
			relationId = instDetails.id;
			// Adds the background color to the selected
			// instruction.
			currentObj.addClass(compNS + "-right-clicked");
			currentObj.siblings().removeClass(compNS + "-clicked");
			currentObj.removeClass(compNS + "-clicked");
			currentObj.siblings().removeClass(compNS + "-right-clicked");

		} else {
			instDetails = self.getValueFromArray(instructionID,self.getSelectedInstructionArray());
			relationId = instDetails.reltnid;
		}

		// Only Instructions with valid RELATION_ID are allowed
		// to add to Departmental or Personal Favorites
		if (relationId === 0.0) {
			personalFavoriteAdd.setIsDisabled(true);
			departmentalFavoriteAdd.setIsDisabled(true);
		} else {
			favoriteInstDetails = self.getValueFromArray(relationId, self.getFavoriteInstructionArray());
			if (favoriteInstDetails) {
				// If the instruction is already in Personal
				// Favorite, then show Remove option enabled and
				// Add option dithered
				if (favoriteInstDetails.personId > 0.0) {
					personalFavoriteAdd.setIsDisabled(true);
					personalFavoriteRemove.setIsDisabled(false);
				} else if (favoriteInstDetails.personId === 0.0) {
					personalFavoriteAdd.setIsDisabled(false);
					personalFavoriteRemove.setIsDisabled(true);
				}

				// If the instruction is already in Departmental
				// Favorite, then show Remove option enabled and
				// Add option dithered
				if (favoriteInstDetails.trackingGroup > 0.0) {
					departmentalFavoriteAdd.setIsDisabled(true);
					departmentalFavoriteRemove.setIsDisabled(false);
				} else if (favoriteInstDetails.trackingGroup === 0.0) {
					departmentalFavoriteAdd.setIsDisabled(false);
					departmentalFavoriteRemove.setIsDisabled(true);
				}

			} else {
				// If the instruction does not exists either in
				// Departmental or Personal Favorite,
				// then show Add option enabled for btoh
				// Personal and Departmental
				personalFavoriteAdd.setIsDisabled(false);
				departmentalFavoriteAdd.setIsDisabled(false);
				personalFavoriteRemove.setIsDisabled(true);
				departmentalFavoriteRemove.setIsDisabled(true);
			}
		}

		if(!self.getRemoveTaskGranted()){
			departmentalFavoriteRemove.setIsDisabled(true);
		}
		if(!self.getAddTaskGranted()){
			departmentalFavoriteAdd.setIsDisabled(true);
		}
		// Add the Instruction to Personal Favorite
		personalFavoriteAdd.setClickFunction(function() {
			// Prompt Params: OUTDEV, inputPersonId ,inputDomainCd, Reference Text id,addDeleteInd,inputTrackingGroupCd,inputFavTypeCd
			var sendAr = [ "^MINE^",criterion.provider_id + ".0",component.getDomainCd() + ".0",relationId + ".0", 0, "0.0", "0.0" ];
			var progName = "MP_ADD_PAT_EDU_FAVORITES";

			var request = new MP_Core.ScriptRequest(component,"ENG:MPG.PATIENTEDUCATION.O2 - Add to Personal Favorites");
			request.setProgramName(progName);
			request.setParameters(sendAr);
			request.setAsync(true);
			MP_Core.XMLCCLRequestCallBack(component,request,function(reply) {
				if ((reply.getStatus() === "S")) {
					personalFavoriteAdd.setIsDisabled(true);
					personalFavoriteRemove.setIsDisabled(false);
					component.updateFavoritesList();
				}
			});
		});

		// Remove the Instruction from Personal Favorite
		personalFavoriteRemove.setClickFunction(function() {
			// Prompt Params: OUTDEV, inputPersonId,inputDomainCd, Reference Text id,addDeleteInd,inputTrackingGroupCd,inputFavTypeCd
				var sendAr = [ "^MINE^",criterion.provider_id + ".0",component.getDomainCd() + ".0",relationId + ".0", 1, "0.0", "0.0" ];
				var progName = "MP_ADD_PAT_EDU_FAVORITES";

				var request = new MP_Core.ScriptRequest(component,"ENG:MPG.PATIENTEDUCATION.O2 -  Remove from Personal Favorites");
				request.setProgramName(progName);
				request.setParameters(sendAr);
				request.setAsync(true);
				MP_Core.XMLCCLRequestCallBack(component,request,function(reply) {
					if (reply.getStatus() === "S") {
						personalFavoriteAdd.setIsDisabled(false);
						personalFavoriteRemove.setIsDisabled(true);
						component.updateFavoritesList();
					}
				});
			});

		// Add the Instruction to Departmental Favorite
		departmentalFavoriteAdd.setClickFunction(function() {
			var sendAr = ["^MINE^","0.0",component.getDomainCd() + ".0",relationId + ".0",0,component.getTrackingGroupCd()+ ".0", "0.0" ];
			var progName = "MP_ADD_PAT_EDU_FAVORITES";

			var request = new MP_Core.ScriptRequest(component,"ENG:MPG.PATIENTEDUCATION.O2 - Add to Departmental Favorites");
			request.setProgramName(progName);
			request.setParameters(sendAr);
			request.setAsync(true);
			MP_Core.XMLCCLRequestCallBack(component,request,function(reply) {
				if (reply.getStatus() === "S") {
					departmentalFavoriteAdd.setIsDisabled(true);
					departmentalFavoriteRemove.setIsDisabled(false);
					component.updateFavoritesList();
				}
			});
		});

		// Remove the Instruction from Departmental Favorite
		departmentalFavoriteRemove.setClickFunction(function() {
			var sendAr = ["^MINE^","0.0",component.getDomainCd() + ".0",relationId + ".0",1,component.getTrackingGroupCd()+ ".0", "0.0" ];
			var progName = "MP_ADD_PAT_EDU_FAVORITES";
			var request = new MP_Core.ScriptRequest(component,"ENG:MPG.PATIENTEDUCATION.O2 - load Departmental Favorites");
			request.setProgramName(progName);
			request.setParameters(sendAr);
			request.setAsync(true);
			MP_Core.XMLCCLRequestCallBack(component,request,function(reply) {
				if (reply.getStatus() === "S") {
					departmentalFavoriteAdd.setIsDisabled(false);
					departmentalFavoriteRemove.setIsDisabled(true);
					component.updateFavoritesList();
				}
			});

		});

		contextMenu.setXOffset(event.pageX).setYOffset(event.pageY).setAnchorElement();
		MP_MenuManager.showMenu("FavoriteContextMenu");
		contextMenu.removeAnchorElement();
		return false;
	});
	
	MP_Util.AddAutoSuggestControl(component, self.searchInstructions);
	autoSuggCtrlId.focusout(); // to load the suggested instruction based on the Diagnosis added for the Patient
}; 

MP_Util.setObjectDefinitionMapping("WF_PTED", PatientEducationO2Component);