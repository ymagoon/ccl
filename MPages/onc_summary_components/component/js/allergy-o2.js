/*global APPLINK, MP_Util, MP_Core, CERN_EventListener, MPageComponent, ComponentStyle, mp_formatter, ComponentTable, TableColumn*/

/**
 * Create the allergy component style object
 * @constructor
 */
function AllergyComponentWFStyle() {
	this.initByNamespace("wf_al");
}

AllergyComponentWFStyle.prototype = new ComponentStyle();
AllergyComponentWFStyle.prototype.constructor = ComponentStyle;

/**
 * The Allergy component will retrieve all allergies associated to the patient
 *
 * @constructor
 * @param {Criterion} criterion
 */
function AllergyComponentWF(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new AllergyComponentWFStyle());
	this.setComponentLoadTimerName("USR:MPG.ALLERGY.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.ALLERGY.O2 - render component");
	this.setIncludeLineNumber(true);
	this.setScope(1);
	this.resultCount = 0;
	this.cancelStatusCd = 0;
	this.isCancelled = false;
	this.pendingReactionList = [];
	//patient entered data
	this.m_interopAllergies = [];
	this.m_chartedAllergies = [];
	this.m_interopCodesArr = [];

	this.m_codesArray = [];
	//If the drop downs are marked as mandatory then add into the list
	this.mandatoryItemsEntryList = [];
	// the side panel object for allergy
	this.m_sidePanel = null;
	this.m_showPanel = false;
	this.m_sidePanelContainer = null;
	this.m_clickedRow = null;

	// A data indicator to indicate if hi data has any records.
	this.m_hiDataValid = false;

	// A data object where HI data will be stored
	this.m_processedHiDataObject = [];

	// Mapping of element ids and dataObjs for the side panel when a row is selected
	this.m_panelElementData = {};
	// Alias type String that is fetched from Bed Rock.
	this.aliasType = "";

	// Alias pool String that is fetched from Bed Rock.
	this.aliasPool = 0.0;

	// Test Uri String that is fetched from Bed Rock.
	this.hiTestURI = "";

	// Empi Look Up key that is fetched from Bed Rock.
	this.hiLookUpKey = "";

	// A boolean to indicate if the Hi Data is Present.
	this.m_hiHasData = false;

	// A data Object of the JSON Parsed
	this.m_hiData = null;

	// Total number of Hi Results present.
	this.m_hiTotalResults = 0;

	// Current Page number of the Hi Data being viewed
	this.m_hiCurrentPage = 0;

	// Pager Object
	this.m_hiPager = null;

	// Page Index of current Page
	this.pageIndex = 0;
	// A flag to indicate add data side panel is open.
	this.m_addSidePanelFlag = false;

	this.m_actionabilityPriv = false;

	//view outside records preference is a user pref on a component level
	//if it is set the user will be able to view patient entered data and/or hi data
	this.m_viewOutsideRecordsPref = false;
	//display hi data indicator will determine whether to show the hi data or not
	this.displayHiDataInd = false;
	/*
	 This preference determines if freetext allergy is enabled or disabled.  The possible options are:
	 1  =  Freetext enabled and do not warn the user when freetext allergy is selected
	 2  =  Freetext enabled and warn the user when freetext allergy is selected
	 3  =  Do not allow freetext allergies
	 */
	this.m_allergyFreeTextStatusPriv = 3;
	//mark as reviewed privilege
	this.m_markAsReviewedPriv = 0;
	//multi-factor authentication message
	this.mfaBannerHtml = "";
}

AllergyComponentWF.prototype = new MPageComponent();
AllergyComponentWF.prototype.constructor = MPageComponent;
/**
 * openTab open the win32 Allergies tab
 * @return {Undefined}
 */
AllergyComponentWF.prototype.openTab = function() {
	var criterion = this.getCriterion();

	this.criterion = criterion;
	var sParms = "/PERSONID=" + criterion.person_id + " /ENCNTRID=" + criterion.encntr_id + " /FIRSTTAB=^" + this.getLink() + "+^";
	/*eslint-disable new-cap*/
	APPLINK(0, criterion.executable, sParms);
	/*eslint-enable new-cap*/
};

/**
 * This function is used to set the actionability privs for allergies from Bedrock
 * @return {null}
 **/
AllergyComponentWF.prototype.setActionabilityPriv = function(value) {
	this.m_actionabilityPriv = (value == 1 ? true : false);
};

/**
 * This function is used to get the actionability privs for allergies
 * @return {boolean}
 **/
AllergyComponentWF.prototype.getActionabilityPriv = function() {
	return this.m_actionabilityPriv;
};

/**
 * setMarkAsReviewedPriv sets the value of the mark as reviewed privilege
 * @param {Number} value 1 - REVALLERGY is set to true
 *                       0 - REVALLERGY is set to false
 * @return {Undefined}
 */
AllergyComponentWF.prototype.setMarkAsReviewedPriv = function(value) {
	this.m_markAsReviewedPriv = value;
};

/**
 * getMarkAsReviewedPriv get the mark as reviewed privilege value
 * @return {Number} privilege value
 */
AllergyComponentWF.prototype.getMarkAsReviewedPriv = function() {
	return this.m_markAsReviewedPriv;
};
/**
 * setAllergyFreeTextStatusPriv set the
 *    1  =  Freetext enabled and do not warn the user when freetext allergy is selected
 2  =  Freetext enabled and warn the user when freetext allergy is selected
 3  =  Do not allow freetext allergies
 * @param {Number} status 1/2/3
 * @return {Undefined}
 */
AllergyComponentWF.prototype.setAllergyFreeTextStatusPriv = function(status) {
	this.m_allergyFreeTextStatusPriv = status;
};

/**
 * getAllergyFreeTextStatusPriv get the free text allergy status privilege value
 * @return {Number} privilege value
 */
AllergyComponentWF.prototype.getAllergyFreeTextStatusPriv = function() {
	return this.m_allergyFreeTextStatusPriv;
};
/**
 * setOutsideRecordsPref set the outside order records component preference
 * @param {integer} value 1 or 0 to indicate whether the preference is on or off
 * @return {Undefined}
 */
AllergyComponentWF.prototype.setOutsideRecordsPref = function(value) {
	this.m_viewOutsideRecordsPref = value;
};
/**
 * getOutsideRecordsPref returns the component preference object for outside order records
 * @return {object} outside order records preference object
 */
AllergyComponentWF.prototype.getOutsideRecordsPref = function() {
	return this.m_viewOutsideRecordsPref;
};

/**
 * The following function is used for the component level menu for allergiies-o2. The items in the component level menu include a fly out sequence by menu which lists
 * out the filters from bedrock so that the data is displayed based on the filter selected.
 */
AllergyComponentWF.prototype.preProcessing = function() {
	var docI18n = i18n.discernabu.allergy_o2;
	var criterion = this.getCriterion();
	var mfaStatus = 4; //init MFA status to 'error'
	var self = this;
	var resourceName = criterion.category_mean + "pageLevelFilters";
	var pageLevelFilters = MP_Resources.getSharedResource(resourceName);
	if (pageLevelFilters && pageLevelFilters.isResourceAvailable()) {
		//At this point, the codes are already available, so get the data
		var plFilters = pageLevelFilters.getResourceData();
		var plFiltersLen = plFilters.length;
		if (plFiltersLen) {
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

	//Check for Multi-factor Authentication.
	// Only execute this block if Bedrock filter to include external data is set to 'yes'
	if(this.getExternalDataInd()){
		this.performMFA();
	}
};

/**
 * performMfa Call the Multi-factor Authentication utility & conditionally render mfa banner
 */
AllergyComponentWF.prototype.performMFA = function(){
	var mfaData = {};

	//MFA Auth API call
	var authStatus = new Mfa_Auth().RetrieveMfaAuthStatus();
	if (authStatus.isResourceAvailable()) {
		var authStatusData = authStatus.getResourceData();
		if (authStatusData) {
			mfaData = authStatusData;
			//0 = mfa auth success; 5 = mfa auth not required
			if (mfaData.status !== 0 && mfaData.status !== 5) {
				this.renderMfaBanner(mfaData);
				//block external data
				this.setExternalDataInd(false);
			}
		}
	}
	else{ //call to mfa failed, display error message and block external data
		mfaData = {status: 4, message: i18n.discernabu.mfa_auth.MFA_ERROR_MESSAGE};
		this.renderMfaBanner(mfaData);
		//block external data
		this.setExternalDataInd(false);
	}

	this.auditMfaEvent(mfaData.status);
};

/**
 * auditMfaEvent Add MP_Event_Audit for MFA
 * @param {string} status The status returned from the MFA utility
 */
AllergyComponentWF.prototype.auditMfaEvent = function(status){
	// Add Audit Event for Multi-Factor Authentication
	var criterion = this.getCriterion();
	var providerID = criterion.provider_id + '.0';
	var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	var dateTime = new Date();
	dateTime = dateFormatter.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
	var mpEventAudit = new MP_EventAudit();
	mpEventAudit.setAuditMode(0);
	mpEventAudit.setAuditEventName('MPD_ALLERGIES_MFA_ATTEMPT');
	mpEventAudit.setAuditEventType('SECURITY');
	mpEventAudit.setAuditParticipantType('PERSON');
	mpEventAudit.setAuditParticipantRoleCd('PROVIDER');
	mpEventAudit.setAuditParticipantIDType('PROVIDER_NUMBER');
	mpEventAudit.setAuditParticipantID(providerID);
	mpEventAudit.setAuditParticipantName('STATUS=' + status +';' + 'DATE=' + dateTime);
	mpEventAudit.addAuditEvent();
	mpEventAudit.submit();
};

/**
 * renderMfaBanner creates the banner to house the multi-factor authentication message
 * @param {obj} mfaStatus The MFA object that holds the status and message text
 */
AllergyComponentWF.prototype.renderMfaBanner = function(mfaStatus){
	var docI18n = i18n.discernabu.allergy_o2;
	var mfaBanner = new MPageUI.AlertBanner();
	var mfaBannerHTML = '<div id="mfa-banner-container"' + '>';

	if(mfaStatus.status === 2 || mfaStatus.status === 3){
		mfaBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.INFO);
	}else{
		mfaBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
	}

	mfaBanner.setPrimaryText(mfaStatus.message);
	mfaBanner.setSecondaryText(docI18n.MFA_SECONDARY_ERROR_TXT);

	mfaBannerHTML = mfaBannerHTML + mfaBanner.render();
	mfaBannerHTML = mfaBannerHTML + '</div>';

	this.mfaBannerHtml = mfaBannerHTML;
};

/**
 * This function is used to handle the post processing for the component. Currently it only
 * calls the base class functionality and then fires the EVENT_COUNT_UPDATE so the result count
 * will be reflected in the navigator.
 * @return {Undefined}
 */
AllergyComponentWF.prototype.postProcessing = function() {
	MPageComponent.prototype.postProcessing.call(this);
	if (this.resultCount === 0) {
		//Update the component result count
		/*eslint-disable camelcase*/
		CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
			"count": 0
		});
		/*eslint-enable calelcase*/
	}
};

/**
 * loadFilterMappings load the filter mapping values to be used to set the values of the bedrock settings being retrieved.
 * @return {undefined}
 */
AllergyComponentWF.prototype.loadFilterMappings = function() {
	//add the filter mapping for the  PED indicator
	this.addFilterMappingObject("WF_PAT_ENTERED_ALLERGY", {
		setFunction: this.setPatientEnteredDataInd,
		type: "BOOLEAN",
		field: "FREETEXT_DESC"
	});
	//Add the filter mapping object for the Catalog Type Codes
	this.addFilterMappingObject("WF_ALLERGY_EXT_DATA_IND", {
		setFunction: this.setExternalDataInd,
		type: "BOOLEAN",
		field: "FREETEXT_DESC"
	});

	this.addFilterMappingObject("WF_ALLERGY_EXT_DATA_TEST_URI", {
		setFunction: this.setHITestUri,
		type: "STRING",
		field: "FREETEXT_DESC"
	});

	this.addFilterMappingObject("WF_ALLERGY_ACTIONS", {
		setFunction: this.setActionabilityPriv,
		type: "BOOLEAN",
		field: "FREETEXT_DESC"
	});

};
/**
 * This function is used to build the reaction HTML for the reaction list.
 * @param {array} reactionArray An array of objects which contain the REACTION_NAME field
 * @param {string} alSeverity The css class to apply to this list of reactions
 * @param {string} removeRequestClass The css class to apply the strike through for patient requested removal of an allergy
 * @param {array} modReactionArray An array of objects which contain the modified reactions from the interop service
 * @return {string} HTML markup which will be injected for display in an allergy row
 */
AllergyComponentWF.prototype.buildReaction = function(reactionArray, alSeverity, removeRequestClass, modReactionArray) {
	var reactions = "<div>";
	var reactionName;
	var removeClass = removeRequestClass || "";
	//check if modified reactions were passed in
	if (modReactionArray && modReactionArray.length) {
		//process modified reactions and return a list of reactions excluding the ones that the patient requested to remove
		reactionArray = this.buildReactionsForPatReqModify(reactionArray, modReactionArray);
		//check the returned reactions array if its empty return --
		if (!reactionArray.length) {
			return "<span class='" + alSeverity + removeRequestClass + "'>--</span>";
		}
	}
	var chartReactionsCnt = reactionArray.length;
	//process the list of reactions to be displayed
	if(chartReactionsCnt){
		for (var i = 0; i < chartReactionsCnt; i++) {
			if (i < chartReactionsCnt - 1) {
				reactionName = reactionArray[i].REACTION_NAME + ", ";
			}
			else {
				reactionName = reactionArray[i].REACTION_NAME;
			}
			reactions += "<span class='" + alSeverity + removeClass + "'>" + reactionName + "</span>";
		}
	}
	else{
		return "<span class='" + alSeverity + removeRequestClass + "'>--</span>";
	}
	reactions += "</div>";
	return reactions;
};
/**
 * buildReactionsForPatReqModify this function will process both reactions array and modified reactions array
 * for the patient requested allergy with request type of UPDATE and return an array of reactions
 * @param  {Array} reactionArray    array of charted reactions for an allergy
 * @param  {Array} modReactionArray array of modified reactions from the interop service
 * @return {Array}                  array containing all newly added reactions and existing charted reactions that were not
 *                                  requested to be removed by the patient.
 */
AllergyComponentWF.prototype.buildReactionsForPatReqModify = function(reactionArray, modReactionArray) {
	var reaction = null;
	var reactions = [];
	var removedReaction = [];
	//make a copy of the charted reactions to avoid making changes by reference
	var reactionsArrCopy = reactionArray.slice();
	//iterate over the modified reactions and collect the added reactions and removed reactions separately
	for (var i = 0; i < modReactionArray.length; i++) {
		reaction = modReactionArray[i];
		var requestType = MP_Util.GetValueFromArray(reaction.STATUS, this.m_codesArray).meaning;
		if (requestType === "ADD") {
			reactions.push(reaction);
		}
		else if (requestType === "REMOVE") {
			removedReaction.push(reaction);
		}
	}
	//iterate over the removed reactions and remove the reactions that were requested to be removed from the charted reactions 
	for (i = 0; i < removedReaction.length; i++) {
		for (var j = 0; j < reactionsArrCopy.length; j++) {
			if (reactionsArrCopy[j].REACTION_ID === removedReaction[i].REACTION_ID) {
				reactionsArrCopy.splice(j, 1);
			}
		}
	}
	//add all processed reactions to the reactions array and return
	reactions = reactions.concat(reactionsArrCopy);
	return reactions;
};


/**
 * This function is used to build the comments HTML for the reaction list.
 * @param {array} commentsArray An array of objects which contain the COMMENT field
 * @param {string} cssClass The css class to apply to this list of comments
 * @return {string} HTML markup which will be injected for display in an allergy row
 */

AllergyComponentWF.prototype.getComments = function(par, personnelArray) {
	var comment = "";
	var recDate = "";
	var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	for (var j = 0, m = par.COMMENTS.length; j < m; j++) {
		if (par.COMMENTS[j].COMMENT_ID === 0.0 && this.displayHiDataInd) {
			continue;
		}
		if (personnelArray && personnelArray.length) {
			//process the date in which the commment was recorded on
			if (par.COMMENTS[j].RECORDED_DT_TM) {
				recDate = df.formatISO8601(par.COMMENTS[j].RECORDED_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
			}
			if (j > 0) { //after the first comment add carriage return
				comment += "<br />";
			}
			if (par.COMMENTS[j].RECORDED_BY > 0) { //process the name of the comments author if available
				var prsnlName = (par.COMMENTS[j].RECORDED_BY > 0) ? MP_Util.GetValueFromArray(par.COMMENTS[j].RECORDED_BY, personnelArray).fullName : "";
				comment += par.COMMENTS[j].COMMENT_TEXT + "<br />" + recDate + " - " + prsnlName + "<br />";
			}
			else {
				comment += par.COMMENTS[j].COMMENT_TEXT + "<br />" + recDate + "<br />";
			}
		}
	}
	return comment;
};

/**
 * getPatientComment find the patient comment in the allergy reply.
 * patient comment will have a comment_id of 0.0
 * @param  {Object} allergyResult the allergy object in context
 * @return {String} patient comment or empty string if no patient comment available
 */
AllergyComponentWF.prototype.getPatientComment = function(allergyResult) {
	var patientComment = "";
	var commentsLen = allergyResult.COMMENTS.length;
	for (var i = 0; i < commentsLen; i++) {
		var comment = allergyResult.COMMENTS[i];
		if (comment.COMMENT_ID === 0.0) {
			patientComment = comment.COMMENT_TEXT;
			break;
		}
	}
	return patientComment;
};
/**
 * This function is used to process the results returned from the MP_GET_ALLERGIES script and preparing
 * them for use in the ComponentTable API.
 * @param {object} results The results object returned from the MP_GET_ALLERGIES script.
 * @return {object} The results object is returned with processed data for each allergy
 **/

AllergyComponentWF.prototype.processResultsForRender = function(results) {
	var resultLength = results.ALLERGY.length;
	var docI18n = i18n.discernabu.allergy_o2;
	var jsSeverity, alSeverity, jsSeverityObj, onsetPrecision, reactionType, infoSource, comments = "";
	var datetimeFlag = 0;
	var onsetDate = "--";
	var allergyResult = null;
	var interopResult = null;
	var dateTime = null;
	var removeRequestClass;
	var status;
	var category;
	var allergyIndex = 0;
	var self = this;
	var unverifiedImg;
	var modReactionsArray = [];
	var chartInfoSource = "";
	//get the codes list array from the reply
	self.m_codesArray = MP_Util.LoadCodeListJSON(results.CODES);
	//set the privilege for adding free text allergy
	self.setAllergyFreeTextStatusPriv(results.FREE_TEXT_ALLERGY_PREFERENCE);
	//get the personel list
	var personnelArray = MP_Util.LoadPersonelListJSON(results.PRSNL);
	var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	//determine if the code value for UNKNOWN is present for the ONSET_PRECISION_CD in context
	var isUnknownPrecCode = function(currentObj) {
		if (!currentObj || currentObj.ONSET_PRECISION_CD === 0) {
			return false;
		}
		return (MP_Util.GetValueFromArray(currentObj.ONSET_PRECISION_CD, self.m_codesArray).meaning === "UNKNOWN") ? true : false;
	};
	for (resultLength; resultLength--;) {
		modReactionsArray = [];
		chartInfoSource = "";
		removeRequestClass = "";
		allergyResult = results.ALLERGY[resultLength];
		//get the severity object
		jsSeverityObj = (allergyResult.SEVERITY_CD) ? MP_Util.GetValueFromArray(allergyResult.SEVERITY_CD, self.m_codesArray) : {
			meaning: "",
			display: "--"
		};
		//determine the class to be used if the severity cd meaning is SEVERE
		if (jsSeverityObj.meaning === "SEVERE" || jsSeverityObj.display.toUpperCase() === "ANAPHYLLAXIS") {
			jsSeverity = "res-severe";
			alSeverity = "al-res-severe";
		}
		else {
			jsSeverity = "res-normal";
			alSeverity = "res-normal";
		}
		//get the interop data from the allergy
		interopResult = allergyResult.INTEROP;
		//check if a patient request was made for this allergy
		if (interopResult && interopResult.REQUEST_TYPE) {
			var requestType = (interopResult.REQUEST_TYPE) ? MP_Util.GetValueFromArray(interopResult.REQUEST_TYPE, self.m_codesArray).meaning : "--";
			//check if the hi data (outside records) segment is selected
			if (!this.displayHiDataInd) {
				//interop info source code
				allergyResult.INTEROP_SUBMITTED_BY_CD = interopResult.SUBMITTED_BY_CD;
				allergyResult.REQUEST = requestType;
				//set the free text allergy priv
				allergyResult.ALLERGY_FREETEXT_STATUS = interopResult.ALLERGY_FREETEXT_STATUS;
				//set the authors name
				allergyResult.ALLERGY_AUTHOR = interopResult.SUBMITTED_BY_NAME || "--";
				//set the patient comment
				allergyResult.PATIENT_COMMENT = self.getPatientComment(allergyResult);
				//set the request text for the component table based on the request type from the interop reply
				var reqTxt = (requestType !== "UPDATE") ? docI18n[requestType] : docI18n.MODIFY;
				modReactionsArray = (requestType === "UPDATE" && interopResult.MOD_REACTIONS.length) ? interopResult.MOD_REACTIONS : [];
				allergyResult.ALLERGY_REQUEST = "<span class='" + alSeverity + "'>" + reqTxt + "</span>";
				allergyResult.REQUEST_TEXT = reqTxt;
				if (requestType === "REMOVE") {
					removeRequestClass = " pat-req-remove";
				}
				chartInfoSource = MP_Util.GetValueFromArray(allergyResult.SOURCE_OF_INFO_CD, self.m_codesArray);
				//add the informationSource field to the result JSON
				infoSource = MP_Util.GetValueFromArray(interopResult.SUBMITTED_BY_CD, self.m_codesArray);
				//process the submitted date for the outside requests section in the side panel
				if (interopResult.SUBMITTED_DT_TM) {
					var interopDtTm = new Date();
					interopDtTm.setISO8601(interopResult.SUBMITTED_DT_TM);
					allergyResult.OUTSIDE_REQUESTS_DATE_TM = interopDtTm.format("mediumDate") + " " + interopDtTm.format("militaryTime");
				}
			}
			else {
				//ignore all the added patient requests to display all the original charted allergies
				if (requestType === "ADD") {
					continue;
				}
			}
		}
		else { //other charted allergies request column will display '--'
			allergyResult.ALLERGY_REQUEST = "<span class='" + alSeverity + "'>--</span>";
			allergyResult.REQUEST_TEXT = "";
			infoSource = MP_Util.GetValueFromArray(allergyResult.SOURCE_OF_INFO_CD, self.m_codesArray);
			//when the origin info is available
			if(allergyResult.ORIGINATING_SOURCE_CD) {
				//Set the originating source
				var originCode = MP_Util.GetValueFromArray(allergyResult.ORIGINATING_SOURCE_CD, self.m_codesArray);
				allergyResult.ORIGINATING_SOURCE_TEXT =  originCode ? originCode.display : "--";
				//Set the originating submitted displayate/time
				if (allergyResult.ORIGINATING_DT_TM) {
					var originDtTm;
					originDtTm = new Date();
					originDtTm.setISO8601(allergyResult.ORIGINATING_DT_TM);
					allergyResult.ORIGINATING_DT_TM_TEXT = originDtTm.format("mediumDate") + " " + originDtTm.format("militaryTime");
				}
				else allergyResult.ORIGINATING_DT_TM_TEXT = "--";
				//Set the originating author
				allergyResult.ORIGINATING_AUTHOR = allergyResult.ORIGINATING_SOURCE_NAME || '--';
			}
		}

		//add the name field to the result JSON
		unverifiedImg = (allergyResult.DIRECT_WRITTEN_IND) ? "<span class='pat-req-icon'>&nbsp;</span>" : "";
		allergyResult.ALLERGY_NAME = unverifiedImg + "<span class='" + alSeverity + removeRequestClass + "'>" + allergyResult.NAME + "</span>";

		//Set up the date
		onsetDate = "--";
		dateTime = new Date();
		//process the date from the JSON
		if (allergyResult.ONSET_DT_TM && allergyResult.ONSET_DT_TM !== "" && allergyResult.ONSETDATE_FLAG) {
			dateTime.setISO8601(allergyResult.ONSET_DT_TM);
			datetimeFlag = allergyResult.ONSETDATE_FLAG;
		}
		else {
			datetimeFlag = 0;
		}

		onsetPrecision = (allergyResult.ONSET_PRECISION_CD) ? MP_Util.GetValueFromArray(allergyResult.ONSET_PRECISION_CD, self.m_codesArray).display : "";

		//format the date to be displayed correctly
		switch (datetimeFlag) {
			case 20:
			case 30:
				/*eslint-disable calemcase*/
				onsetDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
				/*eslint-enable calemcase*/
				break;
			case 40:
				/*eslint-disable calemcase*/
				onsetDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_MONTH_4YEAR_NO_DATE);
				/*eslint-enable calemcase*/
				break;
			case 50:
				/*eslint-disable calemcase*/
				onsetDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_4YEAR);
				/*eslint-enable calemcase*/
				break;
			case 0:
				onsetDate = "--";
				break;
			default:
				/*eslint-disable calemcase*/
				onsetDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
				/*eslint-enable calemcase*/
				break;
		}

		//add the date field to the result JSON
		if (isUnknownPrecCode(allergyResult)) {
			allergyResult.ALLERGY_DATE = "<span class='" + alSeverity + removeRequestClass + "'>" + ( onsetPrecision ? onsetPrecision : "") + "</span>";
		}
		else {
			allergyResult.ALLERGY_DATE = "<span class='" + alSeverity + removeRequestClass + "'>" + ( onsetPrecision ? onsetPrecision + "&nbsp;" : "") + onsetDate + "</span>";
		}

		//add the severity field to the result JSON
		allergyResult.ALLERGY_SEVERITY = "<span class='" + jsSeverity + removeRequestClass + "'>&nbsp;" + ((jsSeverityObj.meaning !== "NOTENTERED") ? jsSeverityObj.display : "--") + "&nbsp;</span>";
		//add the reaction field to the result JSON
		allergyResult.ALLERGY_REACTIONS = self.buildReaction(allergyResult.REACTIONS, alSeverity, removeRequestClass, modReactionsArray);
		allergyResult.CHARTED_REACTIONS = self.buildReaction(allergyResult.REACTIONS, alSeverity, removeRequestClass, null);
		//add the reactionType field to the result JSON
		reactionType = MP_Util.GetValueFromArray(allergyResult.REACTION_CLASS_CD, self.m_codesArray);
		allergyResult.ALLERGY_REACTION_TYPE = "<span class='" + alSeverity + removeRequestClass + "'>" + ( reactionType ? reactionType.display : "--") + "</span>";

		//add the status field to the result JSON
		status = MP_Util.GetValueFromArray(allergyResult.STATUS_CD, self.m_codesArray);

		//add the category field to the result JSON
		category = MP_Util.GetValueFromArray(allergyResult.SUBSTANCE_TYPE_CD, self.m_codesArray);

		allergyResult.CHARTED_INFORMATION_SOURCE = "<span class='" + alSeverity + removeRequestClass + "'>" + ( chartInfoSource ? chartInfoSource.display : "--") + "</span>";
		allergyResult.ALLERGY_INFORMATION_SOURCE = "<span class='" + alSeverity + removeRequestClass + "'>" + ( infoSource ? infoSource.display : "--") + "</span>";

		allergyResult.STATUS = "<span class='" + alSeverity + removeRequestClass + "'>" + ( status ? status.display : "--") + "</span>";
		allergyResult.CATEGORY = "<span class='" + alSeverity + removeRequestClass + "'>" + ((category && category.meaning !== "NOTENTERED") ? category.display : "--") + "</span>";

		//add the Comments field to the result JSON
		comments = self.getComments(allergyResult, personnelArray);
		allergyResult.ALLERGY_COMMENTS = "<span class='" + alSeverity + removeRequestClass + "'>" + ( comments ? comments : "--") + "</span>";

		//setting up the fields to be sortable
		allergyResult.ALLERGY_INDEX = allergyIndex;
		allergyResult.NAME_TEXT = allergyResult.NAME;
		allergyResult.ONSET_DATE = allergyResult.ONSET_DATE;
		allergyResult.SEVERITY_TEXT = allergyResult.SORT_SEQ;
		allergyResult.REACTION_TEXT = (allergyResult.REACTIONS.length !== 0) ? allergyResult.REACTIONS[0].REACTION_NAME : "--";
		allergyResult.REACTION_TYPE_TEXT = ( reactionType ? reactionType.display : "--");
		allergyResult.INFO_SOURCE_TEXT = ( infoSource ? infoSource.display : "--");
		allergyResult.COMMENTS_TEXT = "<span class='" + alSeverity + removeRequestClass + "'>" + (allergyResult.COMMENTS.length ? allergyResult.COMMENTS[0].COMMENT_TEXT : "--") + "</span>";

		allergyResult.SEVERITY_STYLE = jsSeverity;

		if (interopResult && interopResult.REQUEST_TYPE && !this.displayHiDataInd) {
			this.m_interopAllergies.push(allergyResult);
		}
		else {
			this.m_chartedAllergies.push(allergyResult);
		}
		this.sidePanelData.push(allergyResult);
		//increment the allergy index after the allergy is processed
		allergyIndex++;
	}
};


/**
 * Processes the privileges from the reply in MP_GET_ALLERGIES, so that any view/update privs are not shown in the nomenclature search when the granted indicator is 0
 * This ensures that when the view/update exceptions are not specified then the processing doesnt occur
 *
 * Sorting is native javascript and we use Binary search to maximize the efficiency.
 * @param {Array} Array of objects holding View and Update privilege exceptions
 */

AllergyComponentWF.prototype.processPrivExceptions = function(privileges) {
	var temp_nomen = [];
	var i = 0;
	var self = this;
	//following the same path as view and update, the 'revallergy' priv should be in the 2nd position in the privs array
	// NOTE: the order in which the privs are returned should be maintained on the backend
	var isMarkAsReviewed = function(targetObj) {
		if (targetObj && targetObj[2] && targetObj[2].PRIVILEGE_NAME && targetObj[2].PRIVILEGE_NAME === "REVALLERGY") {
			self.setMarkAsReviewedPriv(targetObj[2].DEFAULT_IND);
		}
	};

	this.nomen_granted = [];
	var isViewExcepSet = function(targetObj) {
		//If exceptions are not present then we only need to construct the list for duplicate allergies
		if (targetObj && targetObj[0] && targetObj[0].PRIVILEGE_NAME && targetObj[0].PRIVILEGE_NAME === "VIEWALLERGY") {
			if (targetObj[0].EXCEPTIONS && targetObj[0].EXCEPTIONS.length) {
				return true;
			}
			else {
				return false;
			}
		}
		return false;
	};
	var isUpdateExcepSet = function(targetObj) {
		//If exceptions are not present then we only need to construct the list for duplicate allergies
		if (targetObj && targetObj[1] && targetObj[1].PRIVILEGE_NAME && targetObj[1].PRIVILEGE_NAME === "UPDTALLERGY") {
			self.update_priv_default = targetObj[1].DEFAULT_IND;
			if (targetObj[1].EXCEPTIONS && targetObj[1].EXCEPTIONS.length) {
				return true;
			}
			else {
				return false;
			}
		}
		return false;
	};
	//process the mark as reviewed priv
	isMarkAsReviewed(privileges);

	if (isViewExcepSet(privileges)) {
		for (i = 0; i < privileges[0].EXCEPTIONS.length; i++) {
			temp_nomen.push({
				key: privileges[0].EXCEPTIONS[i].NOMEN_ID,
				value: privileges[0].EXCEPTIONS[i].GRANTED_IND
			});
		}
		//Sort the values for facilitating logical AND op
		temp_nomen.sort(function(a, b) {
			return a.key - b.key;
		});
	}
	//Check if the update privs are set
	if (isUpdateExcepSet(privileges)) {
		for (i = 0; i < privileges[1].EXCEPTIONS.length; i++) {
			var index = this.binaryIndexOf.call(temp_nomen, privileges[1].EXCEPTIONS[i].NOMEN_ID);
			if (index > -1) {
				//This means that the value is already present in the initial list and we can perform Bitwise AND to that value
				temp_nomen[index].value = temp_nomen[index].value & privileges[1].EXCEPTIONS[i].GRANTED_IND;
			}
			else {
				//This means that the value is not present and this is a new exception
				temp_nomen.push({
					key: privileges[1].EXCEPTIONS[i].NOMEN_ID,
					value: privileges[1].EXCEPTIONS[i].GRANTED_IND
				});
			}

		}
		//We sort the complete list now so that it can useful for the next iteration
		temp_nomen.sort(function(a, b) {
			return a.key - b.key;
		});
	}
	this.nomen_granted = temp_nomen;
};

/**
 * This function is used to retrieve the patients allergies from the database.
 * @return {undefined}
 **/
AllergyComponentWF.prototype.retrieveComponentData = function() {
	var criterion = this.getCriterion();
	var request = null;
	var allergyScriptRequest = new ComponentScriptRequest();
	var self = this;
	var viewCatagoryMean = criterion.category_mean;
	var loadTimer = new RTMSTimer(this.getComponentLoadTimerName(), viewCatagoryMean);
	var renderTimer = new RTMSTimer(this.getComponentRenderTimerName(), viewCatagoryMean);
	this.currentAllergyDetailsObj = null;
	//reset the allergies arrays
	this.m_chartedAllergies = [];
	this.m_interopAllergies = [];
	var sendAr = [];
	var programName = "MP_GET_ALLERGIES_JSON";
	this.setMemberVariables();
	var millData = 1;
	var patientEnteredDataInd = this.getPatientEnteredDataInd();
	var hiDataInd = this.getExternalDataInd();
	var capTimer = new CapabilityTimer("CAP:MPG Allergies Load Patient Entered Data");
	// Checks to see if external(HI) data needs to be shown.
	if (hiDataInd) {
		this.aliasType = this.getAliasType();
		this.aliasPool = this.getAliasPoolCd();
		if ($.trim(this.getHITestUri()).length) {
			this.hiTestURI = this.getHITestUri();
		}
		if ($.trim(this.getHILookupKey()).length) {
			this.hiLookUpKey = this.getHILookupKey();
		}
	}
	//patient entered data is turned on in bedrock
	if (patientEnteredDataInd) {
		//check for an existing cookie value for the outside records preference
		var viewOutsideRecordsCookie = MP_Util.GetCookieProperty(self.m_componentId, "VIEW_OUTSIDE_RECORDS");
		if (viewOutsideRecordsCookie) { //found existing value
			//set the outside records preference
			this.setOutsideRecordsPref((viewOutsideRecordsCookie === "yes") ? true : false);
		}
		else { //no cookie was found (means it is a new session for the user)
			//add the cookie property with a value of yes
			//NOTE: true/false cannot be used because MP_Util.GetCookieProperty() will return null if the value is false
			MP_Util.AddCookieProperty(self.m_componentId, "VIEW_OUTSIDE_RECORDS", "yes");
			MP_Util.WriteCookie();
			//set the outside records preference
			this.setOutsideRecordsPref(true);
		}
	}
	//get the outside records preference
	var viewOutsideRecordsPref = this.getOutsideRecordsPref();
	//both hi and patient entered data are turned on and the view outisde records pref is true
	if (patientEnteredDataInd && hiDataInd && viewOutsideRecordsPref) {
		sendAr = ["^MINE^", criterion.person_id + ".0", "0.0", 0, criterion.provider_id + ".0", criterion.ppr_cd + ".0",
			'^' + this.hiLookUpKey + '^', "^" + this.aliasType + "^", this.aliasPool + ".0", "^" + this.hiTestURI + "^", this.pageIndex, millData, "1"];
		//trigger the cap timer
		capTimer.capture();
	}
	//set the parameters to get patient entered data
	else if (patientEnteredDataInd && viewOutsideRecordsPref) {
		sendAr = ["^MINE^", criterion.person_id + ".0", "0.0", "0", criterion.provider_id + ".0", criterion.ppr_cd + ".0", "^^", "^^", "0.0", "^^", "0", "1", "1"];
		//trigger the cap timer
		capTimer.capture();
	}//set the parameters to get the hi data when ped is turned off in bedrock
	else if (!patientEnteredDataInd && hiDataInd) {
		sendAr = [
			"^MINE^", criterion.person_id + ".0", "0.0", 0, criterion.provider_id + ".0", criterion.ppr_cd + ".0",
			'^' + this.hiLookUpKey + '^', "^" + this.aliasType + "^", this.aliasPool + ".0", "^" + this.hiTestURI + "^", this.pageIndex, millData
		];
	}
	else { //change the params to get allergies with no external data or ped
		sendAr = ["^MINE^", criterion.person_id + ".0", "0.0", 0, criterion.provider_id + ".0", criterion.ppr_cd + ".0"];
		programName = "MP_GET_ALLERGIES";
	}
	allergyScriptRequest.setProgramName(programName);
	allergyScriptRequest.setParameterArray(sendAr);
	allergyScriptRequest.setComponent(this);
	allergyScriptRequest.setLoadTimer(loadTimer);
	allergyScriptRequest.setRenderTimer(renderTimer);
	allergyScriptRequest.setResponseHandler(function(scriptReply) {
		if (scriptReply.getResponse().STATUS_DATA.STATUS != "F") {
			if (hiDataInd) {
				self.checkHiData(scriptReply.m_responseData);
			}
			self.renderComponent(scriptReply.m_responseData);
		}
		else {
			self.finalizeComponent(MP_Util.HandleErrorResponse(self.getStyles().getNameSpace()), (self.isLineNumberIncluded() ? "(0)" : ""));
		}
	});
	allergyScriptRequest.performRequest();
};
/**
 * resetView this function will reset the view upon selecting a segment from the segmented control by initializeing
 * all the appropriate global variables that are being used by the next view to avoid conflicts
 * @return {undefined}
 */
AllergyComponentWF.prototype.resetView = function() {
	//close the side panel
	if (this.m_showPanel) {
		this.m_sidePanel.m_cornerCloseButton.trigger('click');
	}
	this.allergyTable = null;
	this.m_interopAllergies = [];
	this.m_chartedAllergies = [];
	this.sidePanelData = [];
	$("#wf_al" + this.m_compId + "table").html("");
	this.highlightSelectedRow(false, false);
	this.m_showPanel = false;
	this.m_clickedRow = null;
	this.newNomenId = null;
	this.allergyRequest = null;
};
/**
 * createSegmentedControl create the segmented control for the external data display
 * this function will only be invoked when the component preference for viewing outside records is checked
 * @param {Object} reply object with reply data retrieved by retrieveComponentData
 * @return {MPageUI.SegmentedControl} The generated segmented control
 */
AllergyComponentWF.prototype.createSegmentedControl = function(reply) {
	var self = this;
	var docI18n = i18n.discernabu.allergy_o2;
	var enableHiSegment = this.m_hiHasData && this.m_hiDataValid;
	//define the segment control
	var segment = new MPageUI.SegmentedControl();
	//add the segments to the segment control
	segment.addSegment({
		label: docI18n.PATIENT_REQUESTS,
		selected: !self.displayHiDataInd,
		onSelect: function() {
			self.resetView();
			self.displayHiDataInd = false;
			self.renderComponent(reply);
		}
	});
	segment.addSegment({
		label: docI18n.OUTSIDE_RECORDS,
		disabled: !enableHiSegment,
		selected: self.displayHiDataInd,
		onSelect: function() {
			self.resetView();
			$("#wf_al" + self.m_compId + "sidePanel").remove();
			self.displayHiDataInd = true;
			self.renderComponent(reply);
		}
	});
	return segment;
};
/**
 * This function is used to render the contents of the allergies component.  It takes the data returned from
 * the MP_GET_ALLERGIES script and processes the results in preparation for utilizing the ComponentTable API.
 * @param {object} reply The data object returned from the MP_GET_ALLERGIES script.
 * @return {Undefined}
 **/
AllergyComponentWF.prototype.renderComponent = function(reply) {
	var numberResults = 0;
	var results = null;
	var docI18n = i18n.discernabu.allergy_o2;
	var self = this;
	this.disableAllergySearch = false;
	this.isSavingNomenclatureItem = false;
	var actionabilityPriv = this.getActionabilityPriv();
	var renderAllergy = "";
	var allergyTable = null;
	var nkaBannerHTML = this.renderNKABanner(reply);
	var allergyPrivsReplyObj = "";
	var initialLoadAllergiesList = [];
	var reacTypeColumnCustomClass = 'allergy-o2-col';
	var patReqColClass = '';
	var i = 0;
	var allergiesMarkup = [];
	var secondarySortField = "NAME_TEXT";
	var sortBy = "Severity";
	var sortDirection = TableColumn.SORT.DESCENDING;
	var secondarySortDirection = TableColumn.SORT.ASCENDING;
	var segmentedControl = null;
	//initialize the checked attribute for the view outside records checkbox
	var viewOutsideRecCheckedAttr = '';
	//cache the bedrock settings
	var patEnteredInd = this.getPatientEnteredDataInd();
	var hiDataInd = this.getExternalDataInd();
	var displayHiBanner = false;
	//cache the view outside records preference indicator
	var viewOutsideRecordsChecked = this.getOutsideRecordsPref();
	//cache component_id
	this.m_compId = this.getComponentId();
	//initialize the side panel data array
	this.sidePanelData = [];
	//initialize the allergy request
	this.allergyRequest = null;
	this.scriptReply = reply;
	//Process the results so rendering becomes more trivial
	this.processResultsForRender(reply);
	//cache the allergies from the reply
	results = reply.ALLERGY;
	//cache the privileges from the reply
	allergyPrivsReplyObj = reply.PRIVILEGES;
	//initialize the segmented control HTML markup
	var segmentedControlHtml = "";
	//initialize the view outside records checkbox markup
	var viewOutsideRecordsMarkup = "";
	//check if the view outisde records is set
	if (viewOutsideRecordsChecked) {
		displayHiBanner = false;
		//set the check attribute for the view outside records checkbox
		viewOutsideRecCheckedAttr = 'checked';
		//check if the patient entered data and external data bedrock settings are turned on
		if (patEnteredInd) {
			//set the number of results
			numberResults = (!this.displayHiDataInd) ? this.getNonNomenAllergyCount(results) : this.getNonNomenAllergyCount(this.m_chartedAllergies);
			if (hiDataInd) {
				//Create the segmented control
				segmentedControl = this.createSegmentedControl(reply);
				segmentedControlHtml = "<div class='al-seg-control-container'>" + segmentedControl.render() + "</div>";
			}
		}
	}
	else {
		//check if hi data is turned on and display the banner
		displayHiBanner = true;
		//set the number of results to be the other charted allergies
		numberResults = this.getNonNomenAllergyCount(this.m_chartedAllergies);
	}
	//set the results count
	this.resultCount = numberResults;

	//display the "view outside records checkbox" only when both bedrock settings for ped and hi are turned on or when ped is on and hi is not.
	if (patEnteredInd) {
		viewOutsideRecordsMarkup = '<div class="view-pat-req-content"><label><input type="checkbox" ' + viewOutsideRecCheckedAttr + ' name="view-pat-req-chk" />' + docI18n.VIEW_OUTSIDE_RECORDS + '</label></div>';
	}

	//Get the component table (the first time this is called, it is created)
	allergyTable = new ComponentTable();
	allergyTable.setNamespace(this.getStyles().getId());
	//check the patient entered data indicator is set to true in bedrock and the component preference for
	// viewing outiside records is on
	if (!this.displayHiDataInd && patEnteredInd && viewOutsideRecordsChecked) {
		if (this.m_interopAllergies.length) {
			secondarySortField = "SEVERITY_TEXT";
			sortBy = "REQUEST" + this.m_compId;
			sortDirection = TableColumn.SORT.ASCENDING;
			secondarySortDirection = TableColumn.SORT.DESCENDING;
			patReqColClass = ' pat-req-col';
			reacTypeColumnCustomClass = "allergy-o2-sp-hide-col";
			patientReqCount = this.m_interopAllergies.length;
			//create the Request column
			var requestColumn = new TableColumn();
			requestColumn.setColumnId("REQUEST" + this.m_compId);
			requestColumn.setCustomClass("allergy-o2-col" + patReqColClass);
			requestColumn.setColumnDisplay(i18n.REQUEST);
			requestColumn.setPrimarySortField("REQUEST_TEXT", TableColumn.SORT.ASCENDING);
			requestColumn.setIsSortable(true);
			requestColumn.setRenderTemplate("${ALLERGY_REQUEST}");
			requestColumn.addSecondarySortField(secondarySortField, secondarySortDirection);
			requestColumn.addSecondarySortField("NAME_TEXT", TableColumn.SORT.ASCENDING);
			allergyTable.addColumn(requestColumn);
		}
		//Create 'Patient Requests' group
		var patientRequestGroup = new TableGroup();
		patientRequestGroup.setGroupId("GROUP_PATIENT_REQUEST");
		patientRequestGroup.setDisplay("<span class='pat-req-icon table-grp-header'></span>" + docI18n.PATIENT_REQUESTS);
		patientRequestGroup.setCanCollapse(false);
		patientRequestGroup.setShowCount(true);
		patientRequestGroup.bindData(this.m_interopAllergies);

		//Create 'Other Charted Allergies' group
		var otherChartAllergies = new TableGroup();
		otherChartAllergies.setGroupId("GROUP_OTHER_CHART_ALLERGIES");
		otherChartAllergies.setDisplay(docI18n.OTHER_CHART_ALLERGIES);
		otherChartAllergies.setCanCollapse(false);
		otherChartAllergies.setShowCount(true);
		otherChartAllergies.bindData(this.m_chartedAllergies);

		//Add groups to the Allergy table
		allergyTable.addGroup(patientRequestGroup);
		allergyTable.addGroup(otherChartAllergies);
	}
	//Create the name column
	var indexColumn = new TableColumn();
	indexColumn.setColumnId("INDEX");
	indexColumn.setCustomClass("allergy-o2-hide-col");
	indexColumn.setColumnDisplay("");
	indexColumn.setRenderTemplate("${ALLERGY_INDEX}");

	//Create the name column
	var nameColumn = new TableColumn();
	nameColumn.setColumnId("NAME");
	nameColumn.setCustomClass("allergy-o2-col" + patReqColClass);
	nameColumn.setColumnDisplay(docI18n.SUBSTANCE);
	nameColumn.setPrimarySortField("NAME_TEXT");
	nameColumn.setIsSortable(true);
	nameColumn.setRenderTemplate("${ALLERGY_NAME}");
	if (secondarySortField === "SEVERITY_TEXT") {
		nameColumn.addSecondarySortField(secondarySortField, secondarySortDirection);
	}

	//Create the Reaction column
	var reactionColumn = new TableColumn();
	reactionColumn.setColumnId("Reaction");
	reactionColumn.setCustomClass("allergy-o2-col" + patReqColClass);
	reactionColumn.setColumnDisplay(docI18n.REACTION);
	reactionColumn.setPrimarySortField("REACTION_TEXT");
	reactionColumn.setIsSortable(true);
	reactionColumn.setRenderTemplate("${ ALLERGY_REACTIONS}");
	reactionColumn.addSecondarySortField(secondarySortField, secondarySortDirection);
	if (secondarySortField === "SEVERITY_TEXT") {
		reactionColumn.addSecondarySortField("NAME_TEXT", TableColumn.SORT.ASCENDING);
	}

	//Create the Category column
	var categoryColumn = new TableColumn();
	categoryColumn.setColumnId("Category");
	categoryColumn.setCustomClass("allergy-o2-col" + patReqColClass);
	categoryColumn.setColumnDisplay(i18n.CATEGORY);
	categoryColumn.setPrimarySortField("CATEGORY");
	categoryColumn.setIsSortable(true);
	categoryColumn.setRenderTemplate("${ CATEGORY }");
	categoryColumn.addSecondarySortField(secondarySortField, secondarySortDirection);
	if (secondarySortField === "SEVERITY_TEXT") {
		categoryColumn.addSecondarySortField("NAME_TEXT", TableColumn.SORT.ASCENDING);
	}

	//Create the Status column
	var statusColumn = new TableColumn();
	statusColumn.setColumnId("Status");
	statusColumn.setCustomClass("allergy-o2-col" + patReqColClass);
	statusColumn.setColumnDisplay(i18n.STATUS);
	statusColumn.setPrimarySortField("STATUS");
	statusColumn.setIsSortable(true);
	statusColumn.setRenderTemplate("${ STATUS }");
	statusColumn.addSecondarySortField(secondarySortField, secondarySortDirection);
	if (secondarySortField === "SEVERITY_TEXT") {
		statusColumn.addSecondarySortField("NAME_TEXT", TableColumn.SORT.ASCENDING);
	}

	//Create the Severity column
	var severityColumn = new TableColumn();
	severityColumn.setColumnId("Severity");
	severityColumn.setCustomClass("allergy-o2-col" + patReqColClass);
	severityColumn.setColumnDisplay(docI18n.SEVERITY);
	severityColumn.setPrimarySortField("SEVERITY_TEXT");
	severityColumn.setIsSortable(true);
	severityColumn.setRenderTemplate("${ALLERGY_SEVERITY}");
	severityColumn.addSecondarySortField(secondarySortField, secondarySortDirection);
	if (secondarySortField === "SEVERITY_TEXT") {
		severityColumn.addSecondarySortField("NAME_TEXT", TableColumn.SORT.ASCENDING);
	}

	//Create the Reaction Type column
	var reacTypeColumn = new TableColumn();
	reacTypeColumn.setColumnId("ReactionType");
	reacTypeColumn.setCustomClass("allergy-o2-sp-hide-col" + patReqColClass);
	//reacTypeColumn.setCustomClass(reacTypeColumnCustomClass + patReqColClass);
	reacTypeColumn.setColumnDisplay(docI18n.REACTION_TYPE);
	reacTypeColumn.setPrimarySortField("REACTION_TYPE_TEXT");
	reacTypeColumn.setIsSortable(true);
	reacTypeColumn.setRenderTemplate("${ ALLERGY_REACTION_TYPE }");
	reacTypeColumn.addSecondarySortField(secondarySortField, secondarySortDirection);
	if (secondarySortField === "SEVERITY_TEXT") {
		reacTypeColumn.addSecondarySortField("NAME_TEXT", TableColumn.SORT.ASCENDING);
	}

	//Create the Source column
	var sourceColumn = new TableColumn();
	sourceColumn.setColumnId("Source");
	sourceColumn.setCustomClass("allergy-o2-sp-hide-col" + patReqColClass);
	sourceColumn.setColumnDisplay(i18n.SOURCE);
	sourceColumn.setPrimarySortField("INFO_SOURCE_TEXT");
	sourceColumn.setIsSortable(true);
	sourceColumn.setRenderTemplate("${ ALLERGY_INFORMATION_SOURCE }");
	sourceColumn.addSecondarySortField(secondarySortField, secondarySortDirection);
	if (secondarySortField === "SEVERITY_TEXT") {
		sourceColumn.addSecondarySortField("NAME_TEXT", TableColumn.SORT.ASCENDING);
	}

	//Create the Comments column
	var commentColumn = new TableColumn();
	commentColumn.setColumnId("Comments");
	commentColumn.setCustomClass("allergy-o2-sp-hide-col" + patReqColClass);
	commentColumn.setColumnDisplay(docI18n.COMMENTS);
	commentColumn.setPrimarySortField("COMMENTS_TEXT");
	commentColumn.setIsSortable(true);
	commentColumn.setRenderTemplate("${ COMMENTS_TEXT }");
	commentColumn.addSecondarySortField(secondarySortField, secondarySortDirection);
	if (secondarySortField === "SEVERITY_TEXT") {
		commentColumn.addSecondarySortField("NAME_TEXT", TableColumn.SORT.ASCENDING);
	}

	//Add the columns to the table
	allergyTable.addColumn(indexColumn);
	allergyTable.addColumn(nameColumn);
	allergyTable.addColumn(reactionColumn);
	allergyTable.addColumn(categoryColumn);
	allergyTable.addColumn(statusColumn);
	allergyTable.addColumn(severityColumn);
	allergyTable.addColumn(reacTypeColumn);
	allergyTable.addColumn(sourceColumn);
	allergyTable.addColumn(commentColumn);
	//Dont bind the data when view outside records is turned on
	if ((!patEnteredInd || (patEnteredInd && !viewOutsideRecordsChecked)) || (hiDataInd && this.displayHiDataInd)) {
		//Bind the data to the results
		allergyTable.bindData(this.m_chartedAllergies);
	}
	//Default the sorting to Severity unless patient entered data is displaying in which case sort by the Request column
	allergyTable.sortByColumnInDirection(sortBy, sortDirection);

	//Store off the component table
	this.setComponentTable(allergyTable);
	this.allergyTable = allergyTable;

	// add cell click to change preview pane based on selection
	this.addCellClickExtension();

	/**
	 * Override the toggleColumnSort method of ComponentTable
	 *
	 *
	 * @param {string}
	 *            columnId - the column to be sorted
	 */
	allergyTable.toggleColumnSort = function(columnId) {
		// call the base class functionality to sort the column
		ComponentTable.prototype.toggleColumnSort.call(this, columnId);

		// Reset NKA/NKMA row at the top of the table
		self.resetNKARows();
	};

	/**
	 * Override the renderNoResults method of ComponentTable
	 *
	 */
	allergyTable.renderNoResults = function() {
		//if view outside records is turned on call the original function
		if (!this.displayHiDataInd && patEnteredInd && viewOutsideRecordsChecked) {
			return ComponentTable.prototype.renderNoResults.call(this);
		}
		else { //dont render no results found when view outisde records is unchecked
			ComponentTable.prototype.renderNoResults.call(this);
			return "";
		}
	};

	var combinedAllergyTables = "";
	//hi data is turned on by either the segmented control or be default when the segmented control does not display
	if ((this.displayHiDataInd && hiDataInd && viewOutsideRecordsChecked) || (!patEnteredInd && hiDataInd)) {
		//Use CAP timer to track usage of HealtheIntent Data
		var timer = new CapabilityTimer("CAP:MPG Display HealtheIntent Data");
		timer.capture();
		allergiesMarkup.push('<div id = "al-wf-allergy-full' + this.m_compId + '" class="al-wf-allergy-full">');
		var hiBannerMarkup = "";
		var hiDataMarkup = "";
		if (this.m_hiDataValid && this.m_hiHasData) {
			this.processHiResultsForRender(reply);
			if (displayHiBanner) {
				hiBannerMarkup = this.createHIAddDataControl();
			}
			else {
				hiBannerMarkup = "";
				hiDataMarkup = this.showHiDataTable();
			}
			this.displayHiDataInd = true;
			allergiesMarkup.push('<div id="al-wf-banner-holder' + this.m_compId + '" class="al-wf-banner-holder">' + hiBannerMarkup + '</div><div id="al-wf-table-containers' + this.m_compId + '" class="al-wf-table-containers"><div class="al-wf-hi-container"><div id="al-wf-hi-table-container' + this.m_compId + '" class="al-wf-hi-table-container">' + hiDataMarkup + '</div>',
				'<div class="al-wf-hi-pager-container"></div>',
				'</div>',
				'<div class="al-wf-mill-table-container">');
		}
		else if (this.m_hiDataValid === false) {
			hiBannerMarkup = (displayHiBanner) ? this.createHIErrorDataControl() : "";
			allergiesMarkup.push('<div id="al-wf-banner-holder' + this.m_compId + '" class="al-wf-banner-holder">' + hiBannerMarkup + '</div><div class="al-wf-table-containers"><div class="al-wf-hi-container"><div id="al-wf-hi-table-container' + this.m_compId + '" class="al-wf-hi-table-container"></div></div><div class="al-wf-mill-table-container">');
		}
		else if (this.m_hiHasData === false) {
			allergiesMarkup.push('<div class="al-wf-table-containers"><div class="al-wf-hi-container"></div><div class="al-wf-mill-table-container">');
		}
		else {
			allergiesMarkup.push('<div class="al-wf-table-containers"><div class="al-wf-mill-table-container">');
		}

		allergiesMarkup.push(allergyTable.render() + "</div></div></div>");
		combinedAllergyTables = allergiesMarkup.join('');
	}
	else {
		combinedAllergyTables = allergyTable.render();
	}

	renderAllergy = nkaBannerHTML + "<div class='al-search-container'><div id='alSearchContainer" + this.m_compId + "'></div></div>" + viewOutsideRecordsMarkup + segmentedControlHtml + "</div><div class='al-search-padding'>&nbsp;</div>" + this.mfaBannerHtml + combinedAllergyTables;
	//Update the component result count
	CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
		"count": numberResults
	});
	//Finalize the component using the allergyTable.render() method to create the table html
	this.finalizeComponent(renderAllergy, MP_Util.CreateTitleText(this, numberResults));
	if (segmentedControl) {
		segmentedControl.attachEvents();
	}

	this.m_tableBodyContainer = $("#wf_al" + this.m_compId + "tableBody");

	// Bind NKA and NKMA events
	this.bindNKAEvents(reply.NOMENCLATURE_ITEMS);
	this.resetNKARows();

	this.initializeSidePanel();
	//resize the component to apply scrollbars and resize the panel it it is open
	this.resizeComponent();
	if (hiDataInd) {
		// Click event when the View Outside Records Button is clicked.
		var hiDataButton = document.getElementById("hiDataControlBtn" + this.m_compId);
		$(hiDataButton).click(function() {
			//banner button clicked display hi data
			$("#al-wf-hi-table-container" + self.m_compId).html(self.showHiDataTable());

			self.allergyHiTable.finalize();
			//attach the row click event for the hi table
			$("#wf_al" + self.m_compId + " .al-wf-hi-container").on('click', '.result-info', function(event) {
				self.onHiRowClick(event, this);
			});
			//Create the pager
			var pager = self.createHiPager();
			if (pager) {
				$("#wf_al" + self.m_compId + " .al-wf-hi-pager-container").append(pager.render());
				pager.attachEvents();
			}
			//Use CAP timer to track usage of HealtheIntent Data
			var timer = new CapabilityTimer("CAP:MPG Display HealtheIntent Data");
			timer.capture();
			if (self.m_clickedRow) {
				$("#wf_al" + self.m_compId + "hitable").addClass("allergy-sp-hide-mode");
			}
			else if (self.m_showPanel) {
				$("#wf_al" + self.m_compId + "hitable").addClass("allergy-sp-hide-mode");
			}
			if (self.allergyRequest) {
				self.moveSidePanel();
				$("#wf_alContent" + self.m_compId).css("height", "");
			}
			self.resizeComponent();
		});
		//hi data is already displayed attach the row click event and create the pager
		//check if the hi banner is displayed meaning the table is not yet rendered and do not attach the click event to the table
		var $hiAddDataContainer = $("#al-wf-banner-holder" + this.m_compId).find("#hiAddDataContainer");
		if (this.displayHiDataInd && !$hiAddDataContainer.length) {
			$("#wf_al" + self.m_compId + " .al-wf-hi-container").on('click', '.result-info', function(event) {
				self.onHiRowClick(event, this);
			});
			self.allergyHiTable.finalize();
			var pager = self.createHiPager();
			if (pager) {
				$("#wf_al" + self.m_compId + " .al-wf-hi-pager-container").append(pager.render());
				pager.attachEvents();
			}
		}
	}

	this.processPrivExceptions(allergyPrivsReplyObj);
	//Get all the current List of added allergies
	if (this.sidePanelData) {
		for (i = 0; i < this.sidePanelData.length; i++) {
			initialLoadAllergiesList.push({
				key: this.sidePanelData[i].NOMENCLATURE_ID,
				value: 0
			});
		}
		this.nomen_granted = this.nomen_granted.concat(initialLoadAllergiesList);
		this.nomen_granted.sort(function(a, b) {
			return a.key - b.key;
		});
	}
	if (actionabilityPriv && !this.disableAllergySearch) {
		this.addAllergySearch();
	}
	else {
		this.allergySearchElement = $("#alSearchContainer" + this.m_compId);
	}
	//if the  patient entered data bedrock setting is turned on and the healthy intent bedrock setting is turned on or off
	//set click event from the view outside records component pref
	//set the click event for the expand/collapse outside requests section in the side panel
	if (patEnteredInd) {
		$("#wf_alContent" + this.m_compId).find(".view-pat-req-content :checkbox").click(function() {
			var $this = $(this);
			var isChecked;
			//if checked set to true
			if ($this.is(':checked')) {
				// the checkbox was checked
				isChecked = true;
			}
			else { //unchecked
				// the checkbox was unchecked
				isChecked = false;
			}
			/*reset the side panel and selected row*/
			if (self.m_showPanel) {
				self.m_sidePanel.m_cornerCloseButton.trigger('click');
			}
			self.displayHiDataInd = false;
			self.m_hiClickedRow = null;
			self.m_tableContainer.removeClass("al-wf-side-panel-addition");
			self.highlightSelectedRow(false, false);
			self.m_showPanel = false;
			self.m_clickedRow = null;
			$("#wf_al" + self.m_compId + "table").removeClass("allergy-sp-hide-mode");
			self.newNomenId = null;
			self.allergyRequest = null;
			self.allergySearchElement.attr('disabled', false);

			//update the cookie and set the preference
			self.setOutsideRecordsPref(isChecked);
			MP_Util.AddCookieProperty(self.m_compId, "VIEW_OUTSIDE_RECORDS", (isChecked === true) ? "yes" : "no");
			MP_Util.WriteCookie();
			//retrieve the data for all the tabs
			self.retrieveComponentData();
		});
		//set click event for the ouside requests section for patient requested information in the side panel
		$("#wf_al" + self.m_compId + "sidePanelContainer").on("click", ".al-outside-requests", function(event) {
			//toggle the closed class to expand and collapse the outside requests section upon click
			if ($(this).hasClass("closed")) {
				$(this).removeClass("closed");
			}
			else {
				$(this).addClass("closed");
			}
		});
	}
	var noOfRows = this.allergyTable.getRows().length;
	var allRows = this.allergyTable.getRowMap();
	var row = null;
	var $rowElm = null;
	//In case of the Allergy is cancelled, then the row would no longer be in our table. Hence the check
	if (!this.isCancelled) {
		//patient entered data is displayed
		if (viewOutsideRecordsChecked && patEnteredInd && !this.displayHiDataInd) {
			var otherChartAllergiesGrp = this.allergyTable.getGroupById("GROUP_OTHER_CHART_ALLERGIES");
			noOfRows = otherChartAllergiesGrp.getRows().length;
			allRows = otherChartAllergiesGrp.getRows();
			for (i = 0; i < noOfRows; i++) {
				row = allRows[i];
				if ((self.newNomenId && row.resultData.ALLERGY_ID === self.newNomenId)) {
					self.m_sidePanel.m_cornerCloseButton.trigger('click');
					$rowElm = this.m_tableBodyContainer.find("dl[id*=" + row.getId() + "]");
					self.m_clickedRow = $rowElm;
					$rowElm.trigger("mouseup");
					return;
				}
			}
		}
		else if (allRows) {
			var allRowKeys = Object.keys(allRows);
			for (i = 0; i < noOfRows; i++) {
				row = allRows[allRowKeys[i]];
				if ((self.newNomenId && row.resultData.ALLERGY_ID === self.newNomenId)) {
					self.m_sidePanel.m_cornerCloseButton.trigger('click');
					$rowElm = this.m_tableBodyContainer.find("dl[id*=" + row.getId() + "]");
					self.m_clickedRow = $rowElm;
					$rowElm.trigger("mouseup");
					return;
				}
			}
		}
	}
	else {
		//If the previous row was cancelled then the sidepanel close is triggered
		self.m_sidePanel.m_cornerCloseButton.trigger('click');
	}
};

/**
 * buildOtherChartedAllergySidePanelContent build the side panel content for the other chart allergies
 * @param  {Object} sidePanelRow allergy in context
 * @param  {Number} componentId  component id
 * @return {undefined}
 */
AllergyComponentWF.prototype.buildOtherChartedAllergySidePanelContent = function(sidePanelRow, componentId) {
	//cache the i18n
	var allergyI18N = i18n.discernabu.allergy_o2;
	var sidePanelActionsHtml = "";
	var allergyHTML = "";
	var sidePanelHTML = "";
	var directWrittenAllergyBanner = "";
	//remove any existing data in the side panel
	this.m_sidePanel.removeAlertBanner();
	this.m_sidePanel.setContents(sidePanelHTML, "wf_alContent" + componentId);
	//set the markup for the side panel buttons
	sidePanelActionsHtml = "<div id='allergySPAction" + componentId + "' class='al-sp-actions'>";
	//add mark as reviewed button if the allergy was direct written
	if (sidePanelRow.DIRECT_WRITTEN_IND) {
		//display the mark as reviewed only if the REVALLERGY priv allows it
		if (this.getMarkAsReviewedPriv()) {
			sidePanelActionsHtml += "<div class='sp-button2 al-wf-mark-reviewed-button' id='allergyMarkReviewedButton" + componentId + "'>" + allergyI18N.MARK_AS_REVIEWED + "</div>";
		}
		//create the markup for the direct written allergy banner
		directWrittenAllergyBanner = "<div class='al-directwrite-sp-banner'>" +
		"<span class='pat-req-icon'>&nbsp;</span>" +
		"<span class='al-directwrite-sp-banner-msg'>" +
		allergyI18N.ALLERGY_DIRECT_WRITTEN_FROM_CLIPBOARD +
		"</span>" +
		"</div>";
		this.m_sidePanel.setAlertBannerAsHTML(directWrittenAllergyBanner);
	}
	//add the modify button
	sidePanelActionsHtml += "<div class='sp-button2 al-wf-modify-button' id='allergyModifyButton" + componentId + "'>" + allergyI18N.MODIFY + "</div></div>";
	this.m_sidePanel.setActionsAsHTML(sidePanelActionsHtml);
	//set the body content of the side panel
	sidePanelHTML = "<div id='sidePanelScrollContainer" + componentId + "'><div id='wf_al" + componentId + "sidePanelResultList' class='al-wf-side-panel-result-list'>";

	//set allergy information
	allergyHTML += "<dl><dd><div class='al-wf-title-text'>" + allergyI18N.REACTION + "</div>" + sidePanelRow.ALLERGY_REACTIONS + "</dd><div class = 'sp-separator2 al-wf-side-panel-selector-spacing'>&nbsp;</div></dl>" + "<dl><dd class='side-panel-dd'><div class='al-wf-title-text'>" + allergyI18N.SEVERITY + "</div>" + sidePanelRow.ALLERGY_SEVERITY + "</dd>" + "<dd class='side-panel-dd'><div class='al-wf-title-text'>" + allergyI18N.REACTION_TYPE + "</div>" + sidePanelRow.ALLERGY_REACTION_TYPE + "</dd>" + "<dd class='side-panel-dd'><div class='al-wf-title-text'>" + allergyI18N.CATEGORY + "</div>" + sidePanelRow.CATEGORY + "</dd><br /><br /></dl>" + "<dl><dd class='side-panel-dd'><div class='al-wf-title-text'>" + i18n.STATUS + "</div>" + sidePanelRow.STATUS + "</dd>" + "<dd class='side-panel-dd'><div class='al-wf-title-text'>" + i18n.SOURCE + "</div>" + sidePanelRow.ALLERGY_INFORMATION_SOURCE + "</dd>" + "<dd class='side-panel-dd'><div class='al-wf-title-text'>" + allergyI18N.ONSET + "</div>" + sidePanelRow.ALLERGY_DATE + "</dd><div class = 'sp-separator2 al-wf-side-panel-selector-spacing'>&nbsp;</div></dl>" + "<dl><dd><div class='al-wf-title-text'>" + allergyI18N.COMMENTS + "</div>" + sidePanelRow.ALLERGY_COMMENTS + "</dd></dl>";

	//construct the origin info section if available
	if(sidePanelRow.ORIGINATING_SOURCE_CD) {
		//Wrap the HTML markup for Origin Section
		var originInfoHTML = "<dl><div class = 'sp-separator2 al-wf-side-panel-selector-spacing'>&nbsp;</div><dd class='side-panel-dd'><div class='al-wf-title-text'>" + allergyI18N.ORIGINATING_SOURCE + "</div><span class='res-normal'>" + sidePanelRow.ORIGINATING_SOURCE_TEXT + "</span></dd><dd class='side-panel-dd'><div class='al-wf-title-text'>" + allergyI18N.ORIGINATING_AUTHOR + "</div><span class='res-normal'>" + sidePanelRow.ORIGINATING_AUTHOR + "</span></dd><dd class='side-panel-dd'><div class='al-wf-title-text'>" + allergyI18N.SUBMITTED_DATE_TIME + "</div><span class='res-normal'>" + sidePanelRow.ORIGINATING_DT_TM_TEXT + "</span></dd><dl>";	
		//allergyHTML wrap the markup for all the info of an allergy in the side panel.
		allergyHTML += originInfoHTML;
	}

	//add the allergy content to the sidepanel body
	this.m_sidePanel.setApplyBodyContentsPadding(true);
	sidePanelHTML += allergyHTML + "</div></div></div>";
	this.m_sidePanel.setContents(sidePanelHTML, "wf_alContent" + componentId);
	//mark as reviewed button - click event to mark direct written allergies as reviwed
	var markAsReviewedBtn = $("#allergyMarkReviewedButton" + componentId);
	var self = this;
	markAsReviewedBtn.click(function() {
		//trigger the cap timer
		var timer = new CapabilityTimer("CAP:MPG Allergies Reconcile Patient Entered Data", "Mark As Reviewed");
		timer.capture();
		//set the meaning for the update status interop service
		sidePanelRow.REQUEST_STATUS_MEANING = "DIRECTWRITE";
		//copy existing allergy data to the allergy request and perform the request
		self.populateAllergyReqForPatientRequest(sidePanelRow, "MARK_AS_REVIEWED");
	});
};

/**
 * [createModificationList create the markup for the modification list within the sidepanel when the
 * allergy in context is a patient requested modification on an allergy.
 * this function will display the added and removed reactions based on the patient request
 * @param  {Object} sidePanelRow patient requested modification allergy in context
 * @param  {Number} componentId  component id
 * @return {undefined}
 */
AllergyComponentWF.prototype.createModificationList = function(sidePanelRow, componentId) {
	var allergyI18N = i18n.discernabu.allergy_o2;
	var modificationsMarkup = "<div id='alModifications" + componentId + "' class='al-modifications'>";
	modificationsMarkup += "<ul>";
	if (sidePanelRow && sidePanelRow.INTEROP && sidePanelRow.INTEROP.MOD_REACTIONS.length) {
		var reactionsCnt = sidePanelRow.INTEROP.MOD_REACTIONS.length;
		for (var i = 0; i < reactionsCnt; i++) {
			var reaction = sidePanelRow.INTEROP.MOD_REACTIONS[i];
			var modRow = "";
			var requestType = MP_Util.GetValueFromArray(reaction.STATUS, this.m_codesArray).meaning;
			if (requestType === "ADD") {
				modRow = "<li>" + allergyI18N.ADD + " \"" + (reaction.REACTION_NAME || "--") + "\"</li>";
			}
			else if (requestType === "REMOVE") {
				modRow = "<li>" + allergyI18N.REMOVE + " \"" + (reaction.REACTION_NAME || "--") + "\"</li>";
			}
			modificationsMarkup += modRow;
		}
	}
	modificationsMarkup += "</ul>";
	return modificationsMarkup;
};

/**
 * findCodeByMeaning helper function will find the code by meaning
 * in the results returned by getCodeSetAsync
 * @param  {Object} results array of codes
 * @param  {String} meaning cdf_meaning to search by
 * @return {Number}         the code corresponding to the cdf_meaning
 *                          or 0.0 if no code was found
 */
AllergyComponentWF.prototype.findCodeByMeaning = function(results, meaning) {
	var code = 0.0;
	for (var x = results.length; x--;) {
		var result = results[x];
		if (result.MEANING === meaning) {
			code = result.CODE;
			break;
		}
	}
	return code;
};
/**
 * processMandatoryFieldsForAddPatReq This function will determine if an allergy could be directly added or has to
 * go through the "add with changes" workflow by first checking if the source of info meaning has a corresponding value in the sources code set,
 * if it does not the logic will follow the "Add with changes" workflow otherwise the logic will continue by looking for the NOTENTERED code value
 * in the severity and onset code sets
 * if NOTENTERED is not built in both code sets the function will follow the "Add with changes" workflow.
 * @param  {Object} sidePanelRow the interop allergy in context with a patient request of "ADD"
 * @param  {Object} patReqObj    patient request object containing the request type and the outside requests side panel section
 * @return {Undefined}
 */
AllergyComponentWF.prototype.processMandatoryFieldsForAddPatReq = function(sidePanelRow, patReqObj) {
	var SOURCES_CODESET = 12023;
	var SEVERITY_CODESET = 12022;
	var ONSET_CODESET = 25320;
	var self = this;
	/**
	 * processCodeSetResults callback function to be used by GetCodeSetAsync
	 * for code set 12022 (Severity) if the NOTENTERED code value was not built in the code set
	 * the logic will continue with the 'add with changes' workflow, otherwise it will get the Onset code set and
	 * look for the NOTENTERED code value, if it is present in both code sets the allergy will be directly added
	 * otherwise it will continue with the 'add with changes' workflow.
	 * @param  {Object} severityResults severity code set results
	 * @return {undefined}                 undefined
	 */
	function processCodeSetResults(severityResults) {
		var severityNotEnteredCd = 0.0;
		var onsetNotEnteredCd = 0.0;
		severityNotEnteredCd = self.findCodeByMeaning(severityResults, "NOTENTERED");
		//not entered is not built in the severity code set
		if (severityNotEnteredCd) {
			//get the onset code set
			MP_Util.GetCodeSetAsync(ONSET_CODESET, function(onsetResults) {
				onsetNotEnteredCd = self.findCodeByMeaning(onsetResults, "NOTENTERED");
				//both code sets contain the notentered code value
				//continue by adding the allergy
				if (onsetNotEnteredCd && severityNotEnteredCd) {
					sidePanelRow.SEVERITY_NOTENTERED_CD = severityNotEnteredCd;
					self.populateAllergyReqForPatientRequest(sidePanelRow, "ADD");
				}
				else {
					//add with changes workflow
					self.modifyAllergyDetails(null, sidePanelRow, patReqObj);
				}
			});
		}
		else {
			//add with changes workflow
			self.modifyAllergyDetails(null, sidePanelRow, patReqObj);
		}
	}

	//get the current source of info from the patient requested allergy in context
	var sourceOfInfoObj = (sidePanelRow.INTEROP) ? MP_Util.GetValueFromArray(sidePanelRow.INTEROP.SUBMITTED_BY_CD, self.m_codesArray) : null;
	if (sourceOfInfoObj) { //the interop allergy source of info cd exists in the codes array
		//cache the meaning of the source code
		var sourceOfInfoMeaning = sourceOfInfoObj.meaning;
		//get the source of info code set
		MP_Util.GetCodeSetAsync(SOURCES_CODESET, function(sourcesResults) {
			//find the corresponding code value for the meaning found in the interop allergy
			var sourceCd = self.findCodeByMeaning(sourcesResults, sourceOfInfoMeaning);
			//found a corresponding code value for the same meaning
			if (sourceCd) {
				//populate the source of info with the corresponding code value
				sidePanelRow.SOURCE_OF_INFO_CD = sourceCd;
				//continue validating the severity and onset code sets
				MP_Util.GetCodeSetAsync(SEVERITY_CODESET, processCodeSetResults); //severity code set
			}
			else {
				//add with changes workflow
				self.modifyAllergyDetails(null, sidePanelRow, patReqObj);
			}
		});
	}
	else {
		//add with changes workflow
		self.modifyAllergyDetails(null, sidePanelRow, patReqObj);
	}

};

/**
 * createAllergyFreeTextBanner This function will create the markup for the free text alert banner
 * the banner message and type will change based on the value of the free text allergy privilege.
 * status - 1 or 2 will display for both the patient request workflow and other chart allergies
 * status - 3 will only display when the selected row is a patient request
 * @param  {Number} status    the value of the free text allergy priv
 * @param  {Number} patReqInd indicator for the patient requests checking
 * @return {String}           banner html markup
 */
AllergyComponentWF.prototype.createAllergyFreeTextBanner = function(status, patReqInd) {
	var markup = "";
	var allergyI18N = i18n.discernabu.allergy_o2;
	var banner = new MPageUI.AlertBanner();
	switch (status) {
		case 1:
		case 2:
			banner.setType(MPageUI.ALERT_OPTIONS.TYPE.WARNING);
			banner.setPrimaryText(allergyI18N.FREE_TEXT_WARNING_BANNER_TEXT);
			markup = banner.render();
			break;
		case 3:
			if (patReqInd) {
				banner.setType(MPageUI.ALERT_OPTIONS.TYPE.INFO);
				banner.setPrimaryText(allergyI18N.CANNOT_ADD_FREETXT_ALLERGY_BANNER);
				markup = banner.render();
			}
			break;
	}
	return markup;
};

/**
 * buildSidePanelContentForInteropAllergy build the outside requests section to be displayed in the side panel whenever the selected
 * allergy is a patient requested allergy.
 * @param  {Object} sidePanelRow selected allergy object
 * @param  {Number} componentId  component id
 * @param  {String} requestType  patient request type ADD/UPDATE/REMOVE
 * @return {undefined}              undefined
 */
AllergyComponentWF.prototype.buildSidePanelContentForInteropAllergy = function(sidePanelRow, componentId, requestType) {
	//cache the i18n
	var allergyI18N = i18n.discernabu.allergy_o2;
	var sidePanelActionsHtml = "";
	var sidePanelBodyHtml = "";
	var allergyHTML = "";
	var self = this;
	var outsideReqSecTitle = "";
	var outsideReqSecDetails = "";
	var btnLabel = "";
	var dropDownOptionLbl = "";
	var btnMarkup = "";
	var rejectBtnMarkup = "";
	var lblBtnCallback = null;
	var dropDownCallback = null;
	var allergyFreeTxtBanner = "";
	var actionabilityBanner = "";
	var patReqObj = {
		"OUTSIDE_REQUESTS_SECTION": "",
		"REQUEST_TYPE": requestType
	};
	var timer;
	var canAddFreeTxtAllergy = true;
	//reset the side panel alert banner
	this.m_sidePanel.setAlertBannerAsHTML("");
	this.m_sidePanel.removeAlertBanner();
	this.m_sidePanel.setContents("", "wf_alContent" + componentId);
	this.m_sidePanel.setApplyBodyContentsPadding(false);

	//cache the allergy in context
	this.currentAllergyDetailsObj = sidePanelRow;
	//determine the actionability and outside requests data based on the request type

	//TODO: Group these MPageUI controls into something more manageable than stray variables
	var splitButton = null;
	var removeButton = null;
	var rejectButton = null;

	switch (requestType) {
		case "ADD":
			btnLabel = allergyI18N.ADD;
			dropDownOptionLbl = allergyI18N.ADD_WITH_CHANGES;
			outsideReqSecTitle = allergyI18N.ADDITION;
			outsideReqSecDetails = "<ul><li>" + allergyI18N.ADD + " " + sidePanelRow.ALLERGY_NAME + "<li>";
			//free text allergy - check the the free text status preference
			if (!sidePanelRow.NOMENCLATURE_ID) {
				var freeTextStatus = self.getAllergyFreeTextStatusPriv();
				allergyFreeTxtBanner = self.createAllergyFreeTextBanner(freeTextStatus, 1);
				//preference will not allow adding free text allergy disable the Add button
				if (freeTextStatus === 3) {
					canAddFreeTxtAllergy = false;
				}
			}
			//set the callback function for the label button
			lblBtnCallback = function() {
				timer = new CapabilityTimer("CAP:MPG Allergies Reconcile Patient Entered Data", "Add");
				timer.capture();
				var notEnteredCd;
				sidePanelRow.REQUEST_STATUS_MEANING = "ACCEPTED";
				//process the severity and onset code sets to determine if the allergy can be directly added or has to go through changes
				self.processMandatoryFieldsForAddPatReq(sidePanelRow, patReqObj);
			};
			//set the callback function for the dropdown 'Add with changes' button
			dropDownCallback = function() {
				timer = new CapabilityTimer("CAP:MPG Allergies Reconcile Patient Entered Data", "Add With Changes");
				timer.capture();
				sidePanelRow.REQUEST_STATUS_MEANING = "ACCEPTED";
				self.modifyAllergyDetails(null, sidePanelRow, patReqObj);
			};
			break;
		case "UPDATE":
			btnLabel = allergyI18N.ACCEPT;
			dropDownOptionLbl = allergyI18N.ACCEPT_WITH_CHANGES;
			outsideReqSecTitle = allergyI18N.MODIFICATIONS;
			outsideReqSecDetails = self.createModificationList(sidePanelRow, componentId);
			//set the callback function for the label button
			lblBtnCallback = function() { //Accept
				timer = new CapabilityTimer("CAP:MPG Allergies Reconcile Patient Entered Data", "Accept");
				timer.capture();
				sidePanelRow.REQUEST_STATUS_MEANING = "ACCEPTED";
				self.processAcceptedPatientRequest(sidePanelRow, patReqObj);
			};
			//set the callback function for the dropdown 'Accept with changes' button
			dropDownCallback = function() {
				timer = new CapabilityTimer("CAP:MPG Allergies Reconcile Patient Entered Data", "Accept With Changes");
				timer.capture();
				sidePanelRow.REQUEST_STATUS_MEANING = "ACCEPTED";
				self.modifyAllergyDetails(null, sidePanelRow, patReqObj);
			};
			break;
		case "REMOVE":
			btnLabel = allergyI18N.REMOVE;
			outsideReqSecTitle = allergyI18N.REMOVAL;
			lblBtnCallback = function() { //Accept Remove
				timer = new CapabilityTimer("CAP:MPG Allergies Reconcile Patient Entered Data", "Accept");
				timer.capture();
				sidePanelRow.REQUEST_STATUS_MEANING = "ACCEPTED";
				self.populateAllergyReqForPatientRequest(sidePanelRow, requestType);
			};
			outsideReqSecDetails = "<ul><li>" + allergyI18N.REMOVE + " " + sidePanelRow.ALLERGY_NAME + "<li>";
			break;
	}
	/*Create side panel buttons*/
	//only if the allergy is marked as modifiable continue with creating the buttons
	if (sidePanelRow.IS_ALLERGY_MODIFIABLE) {
		//determine whether a split button or a regular button should be displayed based on the request
		// if request type is either "ADD" or "UPDATE" and the actionabiity priv is set to yes in bedrock,
		// display a split button otherwise display a regular button
		if (requestType !== "REMOVE") {
			//display the split button only if the actionability priv is set to YES in bedrock
			if (self.getActionabilityPriv()) {
				var duplicateAllergyInd = false;
				//check if the allergy is duplicate
				if (this.isDuplicateAllergy(sidePanelRow.NAME)) {
					//display error "This allergy already exists for this patient"
					this.validationErrorAction(3);
					duplicateAllergyInd = true;
				}
				//determine if the split button should be ditherd based on the free text allergy and duplicate allergy validation
				var disableSplitButton = !canAddFreeTxtAllergy || duplicateAllergyInd;
				//Initialize a new instance of the dropdown
				splitButton = new MPageUI.SplitButton();
				//Set the label of the dropdown (this will be the label of the left-hand button)
				splitButton.setLabel(btnLabel);
				//set the style of the split button to secondary
				splitButton.setStyle(MPageUI.BUTTON_OPTIONS.STYLE.SECONDARY);
				//set the callback function for the Add button
				splitButton.setLabelButtonClickCallback(lblBtnCallback);
				//set the state of the split button based on the free text allergy priv
				splitButton.getLabelButton().setDisabled(disableSplitButton);
				splitButton.getDropdownButton().setDisabled(disableSplitButton);
				//Add your selection options to the dropdown
				splitButton.addOptions([
					{label: dropDownOptionLbl, onSelect: dropDownCallback}
				]);
				btnMarkup = splitButton.render();
				//render the actionability banner
				actionabilityBanner = self.renderActionabilityBanner();
			}
			//display the available banners in the side panel
			self.m_sidePanel.setAlertBannerAsHTML(allergyFreeTxtBanner + actionabilityBanner);
		}
		else {
			removeButton = new MPageUI.Button();
			removeButton.setLabel(allergyI18N.REMOVE);
			removeButton.setOnClickCallback(lblBtnCallback);
			removeButton.setStyle(MPageUI.BUTTON_OPTIONS.STYLE.SECONDARY);
			btnMarkup = removeButton.render();
		}
		//Create the reject request button
		rejectButton = new MPageUI.Button();
		rejectButton.setLabel(allergyI18N.REJECT_REQUEST);
		rejectButton.setOnClickCallback(function() {
			timer = new CapabilityTimer("CAP:MPG Allergies Reconcile Patient Entered Data", "Reject Request");
			timer.capture();
			sidePanelRow.REQUEST_STATUS_MEANING = "REJECTED";
			//initialize the allergy request
			self.allergyRequest = new self.AllergyRequestJSON();
			//perform the reject request transaction
			self.performAllergyRequest(self, sidePanelRow);
		});
		rejectButton.setStyle(MPageUI.BUTTON_OPTIONS.STYLE.SECONDARY);
		rejectBtnMarkup = rejectButton.render();
	}
	//Set the markup for the side panel buttons
	sidePanelActionsHtml = "<div id='allergySPAction" + componentId + "' class='al-sp-actions'><span class='al-split-btn'>" + btnMarkup + "</span><span class='al-reject-btn'>" + rejectBtnMarkup + "</span></div>";
	this.m_sidePanel.setActionsAsHTML(sidePanelActionsHtml);
	//Now that the buttons are on the DOM, attach their events
	if (splitButton) {
		splitButton.attachEvents();
	}
	if (removeButton) {
		removeButton.attachEvents();
	}
	if (rejectButton) {
		rejectButton.attachEvents();
	}

	//set the body content of the side panel
	sidePanelBodyHtml = "<div id='sidePanelScrollContainer" + componentId + "'><div id='wf_al" + componentId + "sidePanelResultList' class='al-wf-side-panel-result-list'>";

	/* Start the side panel content html */
	//set allergy information
	var outsideReqSection = "<div class='al-outside-requests'><h3 class='al-expand-content'><span class='al-sec-toggle'>&nbsp;</span><span class='pat-req-icon'>&nbsp;</span><span>" + allergyI18N.OUTSIDE_REQUESTS + "</span><span class='outside-req-date'>" + (sidePanelRow.OUTSIDE_REQUESTS_DATE_TM || "--") + "</span></h3>";
	//Request Type
	outsideReqSection += "<dl class='al-sp-sec-container'><dd><div class='al-wf-title-text'>" + outsideReqSecTitle + "</div>" + outsideReqSecDetails + "</dd>";
	//add workflow will display reactions category and patient comments
	if (requestType === "ADD") {
		//Reactions
		outsideReqSection += "<dl><dd class='side-panel-dd'><div class='al-wf-title-text'>" + i18n.REACTION + "</div>" + sidePanelRow.ALLERGY_REACTIONS + "</dd></dl>";
		//Category
		outsideReqSection += "<dl><dd class='side-panel-dd'><div class='al-wf-title-text'>" + i18n.CATEGORY + "</div>" + sidePanelRow.CATEGORY + "</dd>";
		//Reaction Type
		outsideReqSection += "<dd class='side-panel-dd'><div class='al-wf-title-text'>" + allergyI18N.REACTION_TYPE + "</div>" + sidePanelRow.ALLERGY_REACTION_TYPE + "</dd></dl>";
	}
	//Originating Source
	outsideReqSection += "<dl><dd class='side-panel-dd'><div class='al-wf-title-text'>" + allergyI18N.ORIGINATING_SOURCE + "</div>" + sidePanelRow.INFO_SOURCE_TEXT + "</dd>";
	//Originating Author
	outsideReqSection += "<dd class='side-panel-dd'><div class='al-wf-title-text'>" + allergyI18N.ORIGINATING_AUTHOR + "</div>" + sidePanelRow.ALLERGY_AUTHOR + "</dd></dl>";
	//Patient Comment
	outsideReqSection += "<dl><dd><div class='al-wf-title-text'>" + allergyI18N.PATIENT_COMMENT + "</div>" + (sidePanelRow.PATIENT_COMMENT || "--") + "</dd></dl></dl>";
	//add section separator
	outsideReqSection += "</div><div class = 'sp-separator2 al-wf-side-panel-selector-spacing'>&nbsp;</div>"; //al-sp-sec-container

	allergyHTML += outsideReqSection;
	if (requestType !== "ADD") {
		allergyHTML += "<dl><dd><div class='al-wf-title-text'>" + allergyI18N.REACTION + "</div>" + sidePanelRow.CHARTED_REACTIONS + "</dd><div class = 'sp-separator2 al-wf-side-panel-selector-spacing'>&nbsp;</div></dl>" + "<dl><dd class='side-panel-dd'><div class='al-wf-title-text'>" + allergyI18N.SEVERITY + "</div>" + sidePanelRow.ALLERGY_SEVERITY + "</dd>" + "<dd class='side-panel-dd'><div class='al-wf-title-text'>" + allergyI18N.REACTION_TYPE + "</div>" + sidePanelRow.ALLERGY_REACTION_TYPE + "</dd>" + "<dd class='side-panel-dd'><div class='al-wf-title-text'>" + allergyI18N.CATEGORY + "</div>" + sidePanelRow.CATEGORY + "</dd><br /><br /></dl>" + "<dl><dd class='side-panel-dd'><div class='al-wf-title-text'>" + i18n.STATUS + "</div>" + sidePanelRow.STATUS + "</dd>" + "<dd class='side-panel-dd'><div class='al-wf-title-text'>" + i18n.SOURCE + "</div>" + sidePanelRow.CHARTED_INFORMATION_SOURCE + "</dd>" + "<dd class='side-panel-dd'><div class='al-wf-title-text'>" + allergyI18N.ONSET + "</div>" + sidePanelRow.ALLERGY_DATE + "</dd><div class = 'sp-separator2 al-wf-side-panel-selector-spacing'>&nbsp;</div></dl>" + "<dl><dd><div class='al-wf-title-text'>" + allergyI18N.COMMENTS + "</div>" + sidePanelRow.ALLERGY_COMMENTS + "</dd></dl>";
	}
	//add the allergy content to the sidepanel body
	sidePanelBodyHtml += allergyHTML + "</div></div></div>";
	this.m_sidePanel.setContents(sidePanelBodyHtml, "wf_alContent" + componentId);
	patReqObj.OUTSIDE_REQUESTS_SECTION = outsideReqSection;
};
/*
 * * This is to add cellClickExtension for the component table.
 */
AllergyComponentWF.prototype.addCellClickExtension = function() {

	var component = this;

	var cellClickExtension = new TableCellClickCallbackExtension();
	//override the finalize function for the cell click extention to apply the click to the whole row
	//this will fix the click target issue not applying when a cell has more than one line of content
	cellClickExtension.finalize = function(table) {
		var self = this;
		var namespace = table.getNamespace();
		var resultData = null;
		var columnId = "";
		var data = {};
		$("#" + namespace + "tableBody").on("mouseup", "dl.result-info", function(event) {
			resultData = ComponentTableDataRetriever.getResultFromTable(table, this);
			//Set up the data to return via callback
			data = {
				"RESULT_DATA": resultData,
				"SOURCE": "TableCellClickCallbackExtension:ROW_CLICK"
			};
			self.callback(event, data);
		});
	};
	cellClickExtension.setCellClickCallback(function(event, data) {
		component.onRowClick(event, data);
	});

	this.allergyTable.addExtension(cellClickExtension);
};


/**
 * This function will serve as the click handler for the Label table delegate.
 *
 * @param {jQuery.Event}
 *                event - The DOM event that occurred.
 * @param {JSON}
 *                data - The data behind the DOM element as received from ComponentTable.
 */
AllergyComponentWF.prototype.onRowClick = function(event, data) {

	var targetClass = "";
	var target = event.target;
	var patientReqRow = data.RESULT_DATA.REQUEST;
	//if the selected row allergy is NKA or NKMA or there is a present allergy request in progress do not allow selecting unless its a patient requested row.
	if (!target || this.allergyRequest || (data.RESULT_DATA.ALLERGY_CUSTOM_NAME === "NKA" && !patientReqRow) || (data.RESULT_DATA.ALLERGY_CUSTOM_NAME === "NKMA" && !patientReqRow)) {
		return;
	}

	targetClass = target.className;
	this.setPanelContentsToClickedRow(event, data);
	this.allergySearchElement.attr("disabled", false);
};

/**
 * This function will serve as the click handler for the Hi table delegate.
 *
 * @param {jQuery.Event}
 *                event - The DOM event that occurred.
 * @param {JSON}
 *                dataElement - The data behind the DOM element as received from ComponentTable.
 */
AllergyComponentWF.prototype.onHiRowClick = function(event, dataElement) {
	if (this.allergyRequest) {
		return;
	}
	var length = dataElement.getAttribute("id").length;
	var partialId = "wf_al" + this.m_compId + "hi:row";
	var index = dataElement.getAttribute("id").replace(partialId, '');
	var dataObject = this.m_processedHiDataObject[index];
	this.setHiPanelContentsToClickedRow(event, dataObject);
};

/**
 * This function will get the clicked rows contents and set the side panel to contain the info for that row
 *
 * @param {jQuery.Event}
 *                event - The DOM event that occurred.
 * @param {JSON}
 *                dataObj - The data behind the DOM element as received from ComponentTable.
 */
AllergyComponentWF.prototype.setHiPanelContentsToClickedRow = function(event, dataObj) {
	// Retrieve component ID
	var componentId = this.m_componentId;
	var allergyI18N = i18n.discernabu.allergy_o2;
	var criterion = this.criterion;

	// If the already selected row in HI table is clicked again the side panel closes.
	if (this.m_hiClickedRow && event.currentTarget.id == this.m_hiClickedRow.id) {
		this.m_sidePanel.m_cornerCloseButton.trigger('click');
		this.m_hiClickedRow = "";
		return;
	}

	// if a row from Millenium Table is already selected the side panel is closed.
	if (this.m_clickedRow) {
		this.m_sidePanel.m_cornerCloseButton.trigger('click');
		this.m_clickedRow = "";
	}

	$("#wf_al" + componentId + "table").addClass("allergy-sp-hide-mode");
	$("#wf_al" + componentId + "hitable").addClass("allergy-sp-hide-mode");

	if (!this.m_showPanel) {
		// shrink the table and show the panel
		$("#wf_al" + componentId + " .al-wf-table-containers").addClass("al-wf-side-panel-addition");
		this.m_sidePanelContainer.css("display", "inline-block");
		this.m_showPanel = true;
		this.m_sidePanel.showPanel();
		var bannerDivHeight = $("#al-wf-banner-holder" + componentId).length ? ($("#al-wf-banner-holder" + componentId).length + parseFloat($("#wf_al" + this.getComponentId() + " .al-wf-hi-container").css('margin-bottom'))) : 0;
		$("#wf_al" + this.m_compId + "sidePanelContainer").css("margin-top", bannerDivHeight);
	}
	this.m_sidePanel.setContents("<div><div>", "wf_alContent" + componentId);

	// Event exists only when the group name is clicked
	if (event) {
		// If the group name is clicked then retrieve the row label of that cell
		var currentRowSelected = event.currentTarget;
		this.m_hiClickedRow = currentRowSelected;

		// Highlight the selected row
		this.highlightSelectedRow(currentRowSelected, false);
	}

	// Create the header
	this.m_sidePanel.setTitleText(dataObj.ALLERGY_NAME_SIDE_PANEL);
	this.m_sidePanel.setSubtitleText(dataObj.AlLERGY_CODE);
	this.m_sidePanel.setActionsAsHTML("");

	var sidePanelHTML = "<div id='sidePanelScrollContainer" + componentId + "'><div id='wf_al" + componentId + "sidePanelResultList' class='al-wf-side-panel-result-list'>";

	var allergyHTML = "";
	var imgUrl = this.getCriterion().static_content + "/images/6965.png";
	allergyHTML += "<dl><dd><span><img class ='al-wf-externalData' src='" + imgUrl + "'></span><div class='al-wf-panel-source al-wf-title-text'>" + allergyI18N.UNVERIFIED_RECORDS + "</div><br>" + dataObj.ALLERGY_SOURCE + "</dd><div class = 'sp-separator2'>&nbsp;</div></dl><br>" +
	"<dl><dd><div class='al-wf-title-text'>" + allergyI18N.REACTION_SEVERITY + "</div>" + dataObj.ALLERGY_REACTIONS_SEVERITY + "</dd><div class = 'sp-separator2'>&nbsp;</div></dl><br>" +
	"<dl><dd><div class='al-wf-title-text'>" + allergyI18N.ONSET_DATE + "</div>" + dataObj.ONSET_DATE_SIDE_PANEL + "</dd><div class = 'sp-separator2'>&nbsp;</div></dl><br>" +
	"<dl><dd><div class='al-wf-title-text'>" + allergyI18N.COMMENTS + "</div>" + dataObj.ALLERGY_COMMENTS_SIDE_PANEL + "</dd><div class = 'sp-separator2'>&nbsp;</div></dl><br>";

	sidePanelHTML += allergyHTML + "</div></div></div>";
	this.m_sidePanel.setContents(sidePanelHTML, "wf_alContent" + componentId);
	this.m_sidePanel.expandSidePanel();
	this.moveSidePanel();
	$("#wf_alContent" + this.m_compId).css("height", "");

};

/**
 * This function will get the clicked rows contents and set the side panel to contain the info for that row
 *
 * @param {jQuery.Event}
 *                event - The DOM event that occurred.
 * @param {JSON}
 *                dataObj - The data behind the DOM element as received from ComponentTable.
 */
AllergyComponentWF.prototype.setPanelContentsToClickedRow = function(event, dataObj) {
	// Retrieve component ID
	var componentId = this.getComponentId();
	var allergyI18N = i18n.discernabu.allergy_o2;
	var criterion = this.getCriterion();
	if (this.m_clickedRow && event.currentTarget.id === this.m_clickedRow.id) {
		this.m_sidePanel.m_cornerCloseButton.trigger('click');
		return;
	}
	//reset the hi clicked row and close the side panel
	if (this.displayHiDataInd && this.m_hiClickedRow) {
		this.m_sidePanel.m_cornerCloseButton.trigger('click');
		this.m_hiClickedRow = "";
	}

	//Hide Source,Reaction Type and Comments columns for side panel mode
	$("#wf_al" + this.m_compId + "table").addClass("allergy-sp-hide-mode");
	//add the class to the hi table if displayed
	if (this.displayHiDataInd) {
		this.m_hiTableContainer.addClass("allergy-sp-hide-mode");
	}
	if (!this.m_showPanel) {
		if (this.displayHiDataInd) {
			$("#wf_al" + this.m_compId + " .al-wf-table-containers").addClass("al-wf-side-panel-addition");
			var bannerDivHeight = $("#al-wf-banner-holder" + componentId).length ? ($("#al-wf-banner-holder" + componentId).length + parseFloat($("#wf_al" + this.m_compId + " .al-wf-hi-container").css('margin-bottom'))) : 0;
			$("#wf_al" + this.m_compId + "sidePanelContainer").css("margin-top", bannerDivHeight);
		}
		else {
			// shrink the table and show the panel
			$("#wf_al" + this.m_compId + "table").addClass("al-wf-side-panel-addition");
		}
		this.m_sidePanelContainer.css("display", "inline-block");
		this.m_showPanel = true;
		this.m_sidePanel.showPanel();
	}
	// Event exists only when the group name is clicked
	if (event) {
		// If the group name is clicked then retrieve the row label of that cell
		var currentRowSelected = event.currentTarget;
		this.m_clickedRow = currentRowSelected;

		// Highlight the selected row
		this.highlightSelectedRow(currentRowSelected, false);
	}
	$("#sidePanel" + this.m_compId).find('.loading-screen').remove();
	// Create the header and action HTML
	this.m_sidePanel.setTitleText(dataObj.RESULT_DATA.NAME);

	var allergyResults = this.sidePanelData;
	var resultLength = allergyResults.length;
	var sidePanelRow = null;
	// Process allergy details and set up allergy HTML
	sidePanelRow = allergyResults[dataObj.RESULT_DATA.ALLERGY_INDEX];
	// Create the action buttons for the side panel
	var requestType = (dataObj.RESULT_DATA.REQUEST) ? dataObj.RESULT_DATA.REQUEST : "--";
	if(!this.displayHiDataInd){
		switch (requestType) {
			case "ADD":
			case "UPDATE":
			case "REMOVE":
				this.buildSidePanelContentForInteropAllergy(sidePanelRow, componentId, requestType);
				break;
			case "--": //other charted allergies
				this.buildOtherChartedAllergySidePanelContent(sidePanelRow, componentId);
				break;
		}
	}else{//hi data is displayed
		this.buildOtherChartedAllergySidePanelContent(sidePanelRow, componentId);
	}
	//Save "this" before it is overwritten by modifyButton click
	var self = this;

	var modifyBtn = $("#allergyModifyButton" + componentId);
	if (this.getActionabilityPriv() && sidePanelRow.IS_ALLERGY_MODIFIABLE === 1) {
		modifyBtn.click(function() {
			self.modifyAllergyDetails(event, sidePanelRow);
		});
	}
	else {
		modifyBtn.removeClass('al-wf-modify-button').addClass('al-wf-no-edit-mode');
	}
	//resize the side panel with the new content
	if(this.m_showPanel){
		this.resizeSidePanel();
	}
	//reposition the side panel when hi is displayed
	if (this.displayHiDataInd) {
		this.moveSidePanel();
		$("#wf_alContent" + this.m_compId).css("height", "");
	}
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
AllergyComponentWF.prototype.highlightSelectedRow = function(selRowObj, isInitialLoad) {
	try {
		var compID = this.getComponentId();
		var rowID = "";

		// Fix up the element ids, remove the :'s and set them up with escape
		// chars, we only want to do this when selRowObj is true

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

		var tableViewObj = $("#wf_al" + compID + "table");
		var hiTableViewObj;
		if (this.displayHiDataInd) {
			hiTableViewObj = $("#wf_al" + compID + "hitable");
		}
		var prevRow = tableViewObj.find(".selected");
		if (!prevRow.length && this.displayHiDataInd) {
			prevRow = hiTableViewObj.find(".selected");
		}
		// Remove the background color of previous selected row.
		if (prevRow.length) {
			if (prevRow.hasClass("al-wf-selected-row selected")) {
				prevRow.removeClass("al-wf-selected-row selected");
			}
		}

		// Change the background color to indicate that the row is selected. If
		// its an initial load then the first row has a different styling
		var newClass = "al-wf" + ( isInitialLoad ? "-selected-row-init" : "-selected-row") + " selected";
		$("#" + rowID).addClass(newClass);
	}
	catch (err) {
		MP_Util.LogJSError(err, this, "allergy_o2.js", "highlightSelectedRow");
	}
};

/**
 * This method will be called only one time, after finalizing the component. This method will initialize the side panel by adding the
 * place holders for the group name and table
 * holding the results of selected row.
 */
AllergyComponentWF.prototype.initializeSidePanel = function() {
	var self = this;
	var compID = this.getComponentId();
	var sidePanelContId = "wf_al" + compID + "sidePanelContainer";
	this.m_sidePanelContainer = $("#" + sidePanelContId);
	this.m_sidePanelMinHeight = "175px";

	var windowPadding = 70;
	//extra padding at bottom of pane between window
	var maxViewHeight = ($("#vwpBody").height() - windowPadding) + "px";
	this.m_tableContainer = $("#wf_al" + compID + "table");
	//set the hi table container when hi is displayed
	if (this.displayHiDataInd) {
		this.m_hiTableContainer = $("#wf_al" + compID + "hitable");
	}

	// get current height of table
	var tableHeight = $("#wf_al" + compID + "table").height();
	var offsetHeight = $("#wf_alContent" + compID).height() - $("#wf_al" + compID + "table").height();

	// Add a container to hold side panel
	var allergyTabContent = $("#wf_alContent" + compID);

	// Create a side panel object only first time
	if (!this.m_sidePanelContainer.length) {
		var allergySidePanelContainer = "<div id='" + sidePanelContId + "' class='al-wf-side-panel'>&nbsp;</div>";
		allergyTabContent.append(allergySidePanelContainer);
	}
	var sidePanelHTML = "<div id='sidePanelScrollContainer" + compID + "'><div id='wf_al" + compID + "sidePanelResultList' class='al-wf-side-panel-result-list'>";
	// Create the side panel
	this.m_sidePanel = new CompSidePanel(compID, sidePanelContId);
	this.m_sidePanel.setExpandOption(this.m_sidePanel.expandOption.EXPAND_DOWN);
	this.m_sidePanel.setOffsetHeight(offsetHeight);
	this.m_sidePanel.setHeight($("#wf_al" + compID + "table").height() + "px");
	this.m_sidePanel.setMinHeight(this.m_sidePanelMinHeight);
	this.m_sidePanel.setMaxHeight(maxViewHeight);
	this.m_sidePanel.renderPreBuiltSidePanel();
	this.m_sidePanel.setActionsAsHTML("<div id='allergySPAction" + compID + "' class='al-sp-actions'><div class='sp-button2 al-wf-modify-button' id='allergyModifyButton" + compID + "'>" + i18n.discernabu.allergy_o2.MODIFY + "</div></div>");
	this.m_sidePanel.setContents(sidePanelHTML, "wf_alContent" + compID);
	this.m_sidePanel.showCornerCloseButton();
	// Set the function that will be called when the close button on the side panel is clicked
	this.m_sidePanel.setCornerCloseFunction(function() {
		$("#saveFailErrorMessage" + self.m_compId).remove();
		self.m_tableContainer.removeClass("al-wf-side-panel-addition");
		self.highlightSelectedRow(false, false);
		self.m_showPanel = false;
		self.m_clickedRow = null;
		$("#wf_al" + compID + "table").removeClass("allergy-sp-hide-mode");
		self.newNomenId = null;
		self.allergyRequest = null;
		self.m_sidePanelContainer.css("display", "none");
		self.m_sidePanel.setAlertBannerAsHTML("");
		self.currentAllergyDetailsObj = null;
		self.m_sidePanel.removeAlertBanner();
		if (self.displayHiDataInd) {
			self.m_sidePanelContainer.css("display", "none");
			self.m_hiClickedRow = null;
			$("#wf_al" + compID + "hitable").removeClass("allergy-sp-hide-mode");
			$("#wf_al" + compID + " .al-wf-table-containers").removeClass("al-wf-side-panel-addition");
		}
	});

	this.m_sidePanelContainer = $("#" + sidePanelContId);
};

/**
 * Basic binary search implementation
 * @param {Number} Item to be searched in the Array of Objects [Objects are key:value pairs]
 *
 * @return {Number} Either the index of the element found or -1 stating nothing is found
 */

AllergyComponentWF.prototype.binaryIndexOf = function(searchElement) {
	var minIndex = 0;
	var maxIndex = this.length - 1;
	var currentIndex;
	var currentElement;

	while (minIndex <= maxIndex) {
		currentIndex = (minIndex + maxIndex) / 2 | 0;
		// This will include the key of the Object. The array is passed as a binding "this", check the function call
		currentElement = this[currentIndex].key;

		if (currentElement < searchElement) {
			minIndex = currentIndex + 1;
		}
		else if (currentElement > searchElement) {
			maxIndex = currentIndex - 1;
		}
		else {
			return currentIndex;
		}
	}

	return -1;
};

/**
 * This function gets the Object list and checks if "id" is there in the list, if yes then gets the index
 * Once the index is positive or 0 then the value is checked. 0 means remove from the search result. i.e This belongs to the exception list (YES: Except for - view/update priv)
 *
 * @param {Object} Privilege Object list containing the exceptions
 * @param {Number} Id of the search results - this is the substance or reaction nomenclature ID
 *
 * @return {Number} If 0 then remove else -1 (Which states leave the search element unalte)
 */

AllergyComponentWF.prototype.suggestRemoveNomenSearchResult = function(nomenPrivObjList, id) {
	var index = this.binaryIndexOf.call(nomenPrivObjList, id);
	if (index > -1) {
		//If the object is found then check if the granted indicator is 0 or 1
		//Send flag to signal removal of the object from the Nomenclature search results if 0
		if (nomenPrivObjList[index].value === 0) {
			return 0;
		}
		if (nomenPrivObjList[index].value === 1) {
			return -1;
		}
	}
	else {
		if (this.update_priv_default === 0) {
			return 0;
		}
	}
};

/**
 * The addAllergySearch function creates a search bar for searching allergies and attaches event handlers when any suggestion
 * is selected.
 */

AllergyComponentWF.prototype.addAllergySearch = function() {
	var component = this;
	var compId = component.getComponentId();
	var allergyI18N = i18n.discernabu.allergy_o2;

	// Get the vocab menu and search container
	var alSearchContainer = $("#alSearchContainer" + compId);
	// Create nomenclature search bar
	var alSearchBar = new MPageControls.NomenclatureSearch(alSearchContainer);
	component.alSearchBar = alSearchBar;

	// Get the text input for searching and vocab menu
	var alSearchInputElement = alSearchContainer.find('input');
	component.allergySearchElement = alSearchInputElement;
	// Set caption for the nomenclature search, do this before disabling the search so that the search bar has a caption
	alSearchBar.setCaption(allergyI18N.ADD_ALLERGY);
	alSearchBar.setCaptionClass('secondary-text');
	alSearchBar.activateCaption();

	//For Reaction Search the source flag needs to be set as 11
	alSearchBar.setSourceFlag(11);

	// Setting a delay of 500ms between the keystrokes. This is done so that the searching is not done after every keystroke.
	alSearchBar.setDelay(500);

	// Set list template for suggestions. For a free text allergy the nomenclature ID is 0 so add a custom class so that specific
	// styles can be applied
	var nomenSearchItemTemplate = new TemplateEngine.TemplateFactory((function() {
		var template = TemplateEngine;
		var div = template.tag("div");
		return {
			nomenInfo: function(context) {
				if (context.m_Data.ID === 0) {
					var inputString = context.m_Data.SOURCESTRING.match(/"(.*?)"/g)[0];
					if (component.isDuplicateAllergy(inputString.replace(/\"/g, ""))) {
						return div({
							"class": "al-free-text-item disabled",
							"id": context._elementId
						}, context.m_Data.SOURCESTRING);
					}
					return div({
						"class": "al-free-text-item",
						"id": context._elementId
					}, context.m_Data.SOURCESTRING);
				}
				else {
					return div({
						"id": context._elementId
					}, context.m_Data.SOURCESTRING);
				}
			}
		};
	})());

	alSearchBar.setListItemTemplate(nomenSearchItemTemplate.nomenInfo);

	var origHandleReplyList = alSearchBar.handleReplyList;

	// Override the handleReplyList to show custom item even though the search did not return any results
	alSearchBar.handleReplyList = function(replyList, reply, err) {
		var customNomen = new MPageEntity.entities.Nomenclature();
		var freeTextPref = component.getAllergyFreeTextStatusPriv();
		var freeTextAllergies = "";
		if (component.nomen_granted && component.nomen_granted.length > 0) {
			for (var i = 0; i < replyList.length;) {
				if (replyList[i] && replyList[i].getData()) {
					if (component.suggestRemoveNomenSearchResult(component.nomen_granted, replyList[i].getId()) === 0) {
						replyList.splice(i, 1);
					}
					else {
						i++;
					}
				}
			}
		}

		var searchString = $("#alSearchContainer" + component.m_compId).find('input').val();
		//Show free text allergies in quotes
		if (freeTextPref !== 3) {
			if (component.validateSearchInput(searchString)) {
				freeTextAllergies = "\"" + searchString + "\"";
				if (component.isDuplicateAllergy(searchString)) {
					// Free text allergies have nomenclature Id as 0
					customNomen.setId(0);
					customNomen.setSourceString(allergyI18N.DUPLICATE_ALLERGY_SEARCH_TEXT.replace("{0}", freeTextAllergies));
					replyList.push(customNomen);
				}
				else {
					customNomen.setId(0);
					customNomen.setSourceString(allergyI18N.ADD_AS_FREE_TEXT.replace("{0}", freeTextAllergies));
					replyList.push(customNomen);
				}
			}
		}
		// Call the original handleReplyList function that will take care of highlighting the row
		origHandleReplyList.call(this, replyList, reply, err);
		// Call parent's setSuggestions to show all items
		MPageControls.NomenclatureSearch.prototype.setSuggestions.call(this, replyList);
		// Highlight and set focus on the first suggestion
		this.getList().setSelectedIndex(0);
		this.getList().highlight(0);
	};

	alSearchBar.getList().highlight = function(index) {
		var rowToHighlight = this.getElement().find("#" + this.getIdByIndex(index));

		if (!rowToHighlight.hasClass("disabled")) {
			this.getElement().find("." + this.getHighlightClass()).removeClass(this.getHighlightClass());
			rowToHighlight.addClass(this.getHighlightClass());
		}
	};

	// Event handler when item from the Allergies suggestions is selected
	alSearchBar.getList().setOnSelect(function(nomen) {
		// Show this value in the textbox as well
		// For free text allergies, set allergy name as the string entered by user in search box
		if (nomen.getId() === 0) {
			nomen.setSourceString(alSearchInputElement.val());
			component.AllergyName = alSearchInputElement.val();
			component.isFreeTextAllergy = true;
		}
		// Clear contents of the search input and revert to the caption
		if (!component.isDuplicateAllergy(nomen.getSourceString())) {
			alSearchBar.activateCaption();
			alSearchBar.close();
			AllergyComponentWF.prototype.handleSelectedAllergy(component, nomen.getId(), nomen.getSourceString());
		}
	});

	// Cache the search bar control
	component.alSearchBar = alSearchBar;

	// Event handler for search bar input when the input is clicked
	alSearchInputElement.click(function() {
		// If any error message is displayed then remove it
		$("#alErrorMessage" + compId).remove();

		var alSearchContent = alSearchInputElement.val();
		if (!alSearchContent || alSearchContent === allergyI18N.ADD_ALLERGY) {
			alSearchInputElement.val("");
			alSearchInputElement.addClass('secondary-text');
		}
		else {
			alSearchInputElement.removeClass('secondary-text');
		}
	});

	// Event handler for search bar input on focusout
	alSearchInputElement.bind("change focusout", function() {
		var alSearchContent = alSearchInputElement.val();
		if (!alSearchContent || alSearchContent === allergyI18N.ADD_ALLERGY) {
			alSearchInputElement.val(allergyI18N.ADD_ALLERGY);
			alSearchInputElement.addClass('secondary-text');
		}
		else {
			alSearchInputElement.removeClass('secondary-text');
		}
	});
};

/**
 * populateAllergyReqForPatientRequest populate the allergy request for an added,modified or removed allergy
 * and execute the request by calling performAllergyRequest()
 * @param  {Object} allergyResultObj the allergy object to be added/removed
 * @param  {String} requestType       "ADD"/"UPDATE"/"REMOVE"/"MARK_AS_REVIEWED"
 * @return {undefined}
 */
AllergyComponentWF.prototype.populateAllergyReqForPatientRequest = function(allergyResultObj, requestType) {
	var allergyI18N = i18n.discernabu.allergy_o2;
	try {
		var i = 0;
		var prsnlId = this.criterion.getPersonnelInfo().getPersonnelId() || 0.0;
		this.allergyRequest = new this.AllergyRequestJSON();
		this.allergyRequest.PERSON_ID = this.criterion.person_id;
		this.allergyRequest.ENCNTR_ID = this.criterion.encntr_id;
		this.allergyRequest.ALLERGY_ID = allergyResultObj.ALLERGY_ID;
		this.allergyRequest.ALLERGY_INSTANCE_ID = allergyResultObj.ALLERGY_INSTANCE_ID;
		this.allergyRequest.SUBSTANCE_NOM_ID = allergyResultObj.NOMENCLATURE_ID;

		this.allergyRequest.SUBSTANCE_TYPE_CD = allergyResultObj.SUBSTANCE_TYPE_CD;
		this.allergyRequest.REACTION_CLASS_CD = allergyResultObj.REACTION_CLASS_CD;
		this.allergyRequest.SEVERITY_CD = (requestType === "ADD") ? allergyResultObj.SEVERITY_NOTENTERED_CD : allergyResultObj.SEVERITY_CD;
		this.allergyRequest.SOURCE_OF_INFO_CD = allergyResultObj.SOURCE_OF_INFO_CD;
		this.allergyRequest.REACTION_STATUS_CD = (allergyResultObj.REACTION_STATUS_CD || 0.0);
		this.allergyRequest.ONSET_DT_TM = allergyResultObj.ONSET_DT_TM;
		this.allergyRequest.ONSET_PRECISION_CD = allergyResultObj.ONSET_PRECISION_CD;
		this.allergyRequest.ONSET_PRECISION_FLAG = (allergyResultObj.ONSET_PRECISION_FLAG || 0.0);
		this.allergyRequest.SUBSTANCE_FTDESC = allergyResultObj.NAME;
		if (requestType !== "REMOVE") { //add/modify/mark as reviewed allergy
			this.allergyRequest.ACTIVE_IND = 1;
			//mark the allergy as reviewed only if the REVALLERGY priv is set to true
			if (this.getMarkAsReviewedPriv()) {
				this.allergyRequest.REVIEWED_DT_TM = new Date().toJSON();
				this.allergyRequest.REVIEWED_TZ = this.criterion.client_tz;//time zone index value
				this.allergyRequest.REVIEWED_PRSNL_ID = prsnlId;
			}
		}
		else { //remove allergy
			this.allergyRequest.ACTIVE_IND = 0;
			this.allergyRequest.CANCEL_DT_TM = new Date().toJSON();
			this.allergyRequest.CANCEL_PRSNL_ID = prsnlId;
			var reactionStatusCdObj = MP_Util.GetCodeValueByMeaning("CANCELED", 12025);
			this.allergyRequest.REACTION_STATUS_CD = (reactionStatusCdObj) ? reactionStatusCdObj.codeValue : 0.0;
			var patientReqCodeObj = MP_Util.GetCodeByMeaning(this.m_codesArray, "PATIENTREQ");
			if (patientReqCodeObj) {
				this.allergyRequest.CANCEL_REASON_CD = patientReqCodeObj.codeValue;
			}
			else {
				throw "Error: populateAllergyReqForPatientRequest() while performing MP_Util.GetCodeByMeaning for 'PATIENTREQ'";
			}
		}
		//add reactions
		var allergyReactionsLen = 0;
		var reactionData = null;
		var reactionObj = null;
		if (requestType === "UPDATE" && allergyResultObj.INTEROP) { //accept modify workflow will get the reactions from the interop
			allergyReactionsLen = allergyResultObj.INTEROP.MOD_REACTIONS.length;
			reactionData = allergyResultObj.INTEROP.MOD_REACTIONS;
		}
		else {
			allergyReactionsLen = allergyResultObj.REACTIONS.length;
			reactionData = allergyResultObj.REACTIONS;
		}
		this.allergyRequest.REACTION_CNT = allergyReactionsLen;
		for (i = 0; i < allergyReactionsLen; i++) {
			reactionObj = new this.ReactionRequestJSON();
			reactionObj.REACTION_ID = reactionData[i].REACTION_ID;
			reactionObj.ALLERGY_ID = allergyResultObj.ALLERGY_ID;
			reactionObj.REACTION_NOM_ID = reactionData[i].REACTION_NOM_ID;
			reactionObj.REACTION_FTDESC = (reactionData[i].REACTION_NAME) ? reactionData[i].REACTION_NAME : "";
			var action = (reactionData[i].STATUS) ? MP_Util.GetValueFromArray(reactionData[i].STATUS, this.m_codesArray).meaning : "";
			if (action === "REMOVE") {
				reactionObj.ACTIVE_IND = 0;
			}
			else {
				reactionObj.ACTIVE_IND = 1;
			}
			this.allergyRequest.REACTION.push(reactionObj);
		}
		//add any existing charted reactions that were not removed as part of the patient request
		if (requestType === "UPDATE" && allergyResultObj.INTEROP) {
			var chartReactionsLen = allergyResultObj.REACTIONS.length;
			var chartReactionData = allergyResultObj.REACTIONS;
			for (i = 0; i < chartReactionsLen; i++) {
				var chartedReaction = chartReactionData[i];
				var reactionRemovedInd = false;
				for (var j = 0; j < this.allergyRequest.REACTION_CNT; j++) {
					var reqReaction = this.allergyRequest.REACTION[j];
					if (chartedReaction.REACTION_ID === reqReaction.REACTION_ID && reqReaction.ACTIVE_IND === 0) {
						reactionRemovedInd = true;
					}
				}
				if (!reactionRemovedInd) {
					reactionObj = new this.ReactionRequestJSON();
					reactionObj.REACTION_ID = chartedReaction.REACTION_ID;
					reactionObj.ALLERGY_ID = allergyResultObj.ALLERGY_ID;
					reactionObj.REACTION_NOM_ID = chartedReaction.REACTION_NOM_ID;
					reactionObj.REACTION_FTDESC = (chartedReaction.REACTION_NAME) ? chartedReaction.REACTION_NAME : "";
					reactionObj.ACTIVE_IND = 1;
					this.allergyRequest.REACTION.push(reactionObj);
				}
			}
			this.allergyRequest.REACTION_CNT = this.allergyRequest.REACTION.length;
		}
		//add comments
		var allergyCommentsLen = allergyResultObj.COMMENTS.length;
		this.allergyRequest.ALLERGY_COMMENT_CNT = allergyCommentsLen;
		for (i = 0; i < allergyCommentsLen; i++) {
			var commentObj = new this.CommentRequestJSON();
			//For a new comment the comment_id will be 0.0
			commentObj.ALLERGY_COMMENT_ID = allergyResultObj.COMMENTS[i].COMMENT_ID;
			commentObj.ALLERGY_ID = allergyResultObj.ALLERGY_ID;
			commentObj.ALLERGY_COMMENT = allergyResultObj.COMMENTS[i].COMMENT_TEXT;
			commentObj.COMMENT_DT_TM = new Date().toJSON();
			commentObj.COMMENT_PRSNL_ID = this.criterion.getPersonnelInfo().getPersonnelId() || 0.0;
			this.allergyRequest.ALLERGY_COMMENT.push(commentObj);
		}
		//perform the request
		this.performAllergyRequest(this, allergyResultObj);
	}
	catch (err) {
		//display error banner
		if ($("#sidePanelHeader" + this.m_compId).find("#saveFailErrorMessage" + this.m_compId).length === 0) {
			errorMessageHTML = "<div id='saveFailErrorMessage" + this.m_compId + "' class='al-save-error-message'><div class='error-container inline-message'><span class='error-text message-info-text'>" + allergyI18N.ERROR_PERFORMING_ACTION + "</span></div></div>";
			$("#sidePanelHeader" + this.m_compId).prepend(errorMessageHTML);
		}
		logger.logWarning(err);
	}
};
/**
 * setSourceOfInfoCd will find the corresponding code value for the cdf_meaning of SUBMITTED_BY_CD from the interop
 * in the sources codes set 12023 results and set it in the SOURCE_OF_INFO_CD field in the allergy object in context.
 * @param {Object} currentAllergyDetailsObj selected allergy object in context
 * @param {Object} sourcesResults array of sources from code set 12023
 * @return {Undefined}
 */
AllergyComponentWF.prototype.setSourceOfInfoCd = function(currentAllergyDetailsObj,sourcesResults){
	var currentInteropData = currentAllergyDetailsObj.INTEROP;
	//get the CDF_MEANING from the source of the interop allergy in context
	var sourceOfInfoObj = (currentInteropData && currentInteropData.SUBMITTED_BY_CD > 0.0) ? MP_Util.GetValueFromArray(currentInteropData.SUBMITTED_BY_CD, this.m_codesArray) : null;
	//if a code value is not found findCodeByMeaning will return 0.0
	currentAllergyDetailsObj.SOURCE_OF_INFO_CD =  (sourceOfInfoObj) ? this.findCodeByMeaning(sourcesResults, sourceOfInfoObj.meaning) : 0.0;
};

/**
 * processAcceptedPatientRequest this function will find and populate the correct value for the source_of_info by utilizing the function setSourceOfInfoCd.
 * if source of info was found and set the logic will continue by calling populateAllergyReqForPatientRequest to accept the
 * patient request otherwise it will continue with the accept with changes workflow by calling modifyAllergyDetails()
 * @param {Object} currentAllergyDetailsObj the current selected patient request row object
 * @param {Object} patReqObj patient request object containing the request type and the outside requests side panel section
 * @return {Undefined}
 */
AllergyComponentWF.prototype.processAcceptedPatientRequest = function(currentAllergyDetailsObj,patReqObj){
	var self = this;
	var SOURCES_CODESET = 12023;
	try{
		MP_Util.GetCodeSetAsync(SOURCES_CODESET, function(sourcesResults) {
			self.setSourceOfInfoCd(currentAllergyDetailsObj,sourcesResults);
			//source if info code was set correctly with a code from code set 12023
			if(currentAllergyDetailsObj.SOURCE_OF_INFO_CD > 0.0){
				//continue by populating the allery request
				self.populateAllergyReqForPatientRequest(currentAllergyDetailsObj, "UPDATE");
			}
			else{//no code was found for cdf_meaning of interop SUBMITTED_BY_CD in code set 12023
				//continue with accept with changes workflow
				self.modifyAllergyDetails(null, currentAllergyDetailsObj, patReqObj);
			}
		});
	}
	catch(err){
		logger.logJSError(err, this, "allergy_o2.js", "processAcceptedPatientRequest");
	}
};
/**
 * This function lets user to modify the allergy details
 *
 * @param {Object} Click event captured when clicked on the row to be modified
 * @param {Object} Current allergy details object which contains the currently saved values
 * @param {Object} Outside request section to be displayed above the modified section
 */

AllergyComponentWF.prototype.modifyAllergyDetails = function(event, currentAllergyDetailsObj, patReqObj) {
	try {
		//Initialize all the variables below
		this.alSearchBar.disable();
		this.m_sidePanel.showCornerCloseButton();
		this.alSearchBar.activateCaption();
		//reset the alert banner html in the side panel
		this.m_sidePanel.setAlertBannerAsHTML("");
		var allergyI18N = i18n.discernabu.allergy_o2;
		var self = this;
		var modifyReactionDetailsHTML = "";
		var modifyDetailsOptionsHTML = "";
		var modifyDateControlHTML = "";
		var modifyCommentsTextAreaHTML = "";
		var actionHolderSP = $("#allergySPAction" + this.m_compId);
		var scrollContainerElem = $("#sidePanelScrollContainer" + this.m_compId);
		var resultListElem = "";
		var cancelBtnAction = "";
		var saveBtnAction = "";
		var reactionNomenSearchBar = "";
		var optionsRenderedCnt = 0;
		var removeReactionElem = "";
		var allergyFreeTxtBanner = "";
		this.allergyRequest = new this.AllergyRequestJSON();
		this.pendingReactionList = [];
		this.mandatoryItemsEntryList = [];
		this.reactionsDuplicateList = [];
		this.currentAllergyDetailsObj = currentAllergyDetailsObj;
		this.allowEnablingSaveButton = false;

		//Get all the non changing values inserted first for Saving purposes
		this.allergyRequest.PERSON_ID = this.criterion.person_id;
		this.allergyRequest.ENCNTR_ID = this.criterion.encntr_id;
		this.allergyRequest.ALLERGY_ID = currentAllergyDetailsObj.ALLERGY_ID;
		this.allergyRequest.ALLERGY_INSTANCE_ID = currentAllergyDetailsObj.ALLERGY_INSTANCE_ID;
		this.allergyRequest.SUBSTANCE_NOM_ID = currentAllergyDetailsObj.NOMENCLATURE_ID;
		//create the actionability banner
		var actionabilityBanner = this.renderActionabilityBanner();

		this.m_sidePanel.setActionsAsHTML("<div id='allergySPAction" + this.m_compId + "' class='al-sp-actions al-wf-edit-mode'><div class='sp-button2 al-wf-cancel-button' id='allergyCancelButton" + this.m_compId + "'>" + i18n.CANCEL + "</div><div class='sp-button2 al-wf-save-button' id='allergySaveButton" + this.m_compId + "'>" + i18n.SAVE + "</div></div>");

		//Clear the scroll container values for a fresh edit mode state
		scrollContainerElem.html("");

		//Append the result list container
		scrollContainerElem.append("<div id='wf_al" + this.m_compId + "sidePanelResultList' class='al-wf-side-panel-result-list'></div>");
		resultListElem = $("#wf_al" + this.m_compId + "sidePanelResultList");

		//patient requested allergy will display the outside requests section in the side panel
		if (patReqObj) {
			$('sidePanelBodyContents' + this.m_compId).prepend(patReqObj.OUTSIDE_REQUESTS_SECTION);
		}
		//Remove any lingering spinners
		$("#sidePanel" + this.m_compId).find('.loading-screen').remove();

		//Remove any lingering listener
		CERN_EventListener.removeListener(null, "optionsRendered" + this.m_compId, null, null);

		//Register Cancel click action
		cancelBtnAction = $("#allergyCancelButton" + this.m_compId);
		cancelBtnAction.click(function() {
			//Revert to old Allergy details
			var data = {
				RESULT_DATA: currentAllergyDetailsObj
			};
			//Remove error message from the Save if present
			$("#saveFailErrorMessage" + self.m_compId).remove();
			//Revert from edit mode
			actionHolderSP.removeClass('al-wf-edit-mode');
			self.m_showPanel = false;
			self.m_clickedRow = null;
			self.alSearchBar.enable();
			self.m_sidePanel.showCornerCloseButton();
			self.setPanelContentsToClickedRow(event, data);
			self.allergyRequest = null;
			self.m_sidePanel.setAlertBannerAsHTML("");
			self.m_sidePanel.removeAlertBanner();
		});

		//Register Save click action
		saveBtnAction = $("#allergySaveButton" + this.m_compId);
		//Disable Save button first-off
		this.disableAllergySaveButton(saveBtnAction);
		saveBtnAction.click(function() {
			//This is to prevent click events on Save when it is disabled
			if (!saveBtnAction.prop("disabled")) {
				if (currentAllergyDetailsObj.NOMENCLATURE_ID === 0) {
					var sidePanelHeader = $("#allergyModifyName" + self.m_compId);

					// Empty the header and replace the label with a text area
					var origAllergyName = sidePanelHeader.val();
					self.allergyRequest.SUBSTANCE_FTDESC = origAllergyName;
				}
				self.saveModifiedAllergy(self, currentAllergyDetailsObj);
			}
		});

		//Load Spinner
		MP_Util.LoadSpinner("sidePanel" + this.m_compId);

		// Prepare header container if allergy is free text allergy
		if (!(currentAllergyDetailsObj.NOMENCLATURE_ID)) {
			var sidePanelHeader = $("#sidePanelHeaderText" + this.m_compId);

			// Empty the header and replace the label with a text area
			var origAllergyName = sidePanelHeader.text();
			sidePanelHeader.empty();
			sidePanelHeader.append('<input id="allergyModifyName' + this.m_compId + '" value="' + origAllergyName + '"/>'); // SP - Side Panel
			//validate that the allergy does not have any duplicates charted
			if (patReqObj) {
				this.isInputFieldValid();
			}
			//Set keyup event for allergy name input field
			$("#allergyModifyName" + this.m_compId).keyup(function(event) {
				self.enableSaveOnValidFields();
			});
			var freeTextStatus = this.getAllergyFreeTextStatusPriv();
			allergyFreeTxtBanner = this.createAllergyFreeTextBanner(freeTextStatus);
		}
		//set the banner container with the approprite banners
		this.m_sidePanel.setAlertBannerAsHTML(allergyFreeTxtBanner + actionabilityBanner);
		//Prepare Reactions container
		var reactionLen = 0;
		var reactionData = null;
		var patReqReactionsArr = [];
		var reactionsModClass = "";
		var commentsModClass = "";
		var patReqCommentText;
		//patient requests modify workflow will only process added reactions for display and find the matching source
		//for the SUBMITTED_BY code value in code set 12023
		if (patReqObj) {
			var i = 0;
			//process patient comments
			var commentsLen = currentAllergyDetailsObj.COMMENTS.length;
			//if comments are available check if a patient comment exists
			if (commentsLen) {
				for (i = 0; i < commentsLen; i++) {
					if (currentAllergyDetailsObj.COMMENTS[i].COMMENT_ID === 0.0) { //patient comment added
						//set the comment text to be displayed in the comment text area
						patReqCommentText = currentAllergyDetailsObj.COMMENTS[i].COMMENT_TEXT;
						//set the comments modify image to be displayed by the comments header in the side panel
						commentsModClass = (patReqObj.REQUEST_TYPE === "UPDATE") ? "<span class='pat-req-mod-icon'>&nbsp;</span>" : "";
						break;
					}
				}
			}
			//process modified reactions
			if (patReqObj.REQUEST_TYPE === "UPDATE") {
				//check if reactions were modified
				reactionLen = currentAllergyDetailsObj.INTEROP.MOD_REACTIONS.length;
				//make a copy of the charted reactions to avoid modifying the current allergy by reference.
				var chartReactionsArrCopy = currentAllergyDetailsObj.REACTIONS.slice();
				//added reactions from the patient requests and add them to the patReqReactionsArr array
				for (i = 0; i < reactionLen; i++) {
					var reactionItem = currentAllergyDetailsObj.INTEROP.MOD_REACTIONS[i];
					var action = (reactionItem.STATUS) ? MP_Util.GetValueFromArray(reactionItem.STATUS, this.m_codesArray).meaning : "";
					/*Note: a patient requested modification to a reaction will come back as a remove and add of a reaction.
					 there is no update status for a reaction */
					//new reaction was added by the patient
					if (action === "ADD") {
						patReqReactionsArr.push(reactionItem);
					}
					else if (action === "REMOVE") { //reaction was requested to be removed by the patient
						var removeReaction = new this.ReactionRequestJSON();
						removeReaction.REACTION_ID = reactionItem.REACTION_ID;
						removeReaction.ALLERGY_ID = this.allergyRequest.ALLERGY_ID;
						removeReaction.REACTION_NOM_ID = reactionItem.REACTION_NOM_ID;
						removeReaction.ACTIVE_IND = 0;
						this.allergyRequest.REACTION.push(removeReaction);
						this.allergyRequest.REACTION_CNT++;
						//if a reaction was removed in the portal remove it from the charted reactions array
						for(var j=0; j<chartReactionsArrCopy.length;j++){
							if(chartReactionsArrCopy[j].REACTION_ID === reactionItem.REACTION_ID){
								chartReactionsArrCopy.splice(j,1);
							}
						}
					}
				}
				//set reactionData to contain both the added portal reactions and charted reactions that were not removed in the portal
				reactionData = patReqReactionsArr.concat(chartReactionsArrCopy);
				reactionLen = reactionData.length;
			}
			else { //patient requested - added reactions
				reactionLen = currentAllergyDetailsObj.REACTIONS.length;
				reactionData = currentAllergyDetailsObj.REACTIONS;
			}
		}
		else { //charted allergies
			reactionLen = currentAllergyDetailsObj.REACTIONS.length;
			reactionData = currentAllergyDetailsObj.REACTIONS;
		}
		if (reactionLen) {
			//set the modify image to be displayed by the reactions header in the side panel if the request is add/update
			reactionsModClass = (patReqObj) ? "<span class='pat-req-mod-icon'>&nbsp;</span>" : "";
			modifyReactionDetailsHTML += "<dl><dt><div class='al-wf-title-text'>" + reactionsModClass + allergyI18N.REACTION + "</div><textarea class='al-wf-side-panel-dummy-search' id='dummySearchContainer" + this.m_compId + "'/><div class='al-wf-side-panel-reaction' id='allergyReactionSearchContainer" + this.m_compId + "'></div><br /><div id='allergyReactionList" + this.m_compId + "'>";
			for (var j = 0; j < reactionLen; j++) {
				modifyReactionDetailsHTML += this.buildReactionModify(reactionData[j]);
				if (j < reactionLen - 1) {
					modifyReactionDetailsHTML += "<div class='sp-separator2 al-wf-side-panel-reactions'>&nbsp;</div></div>";
				}
				else {
					modifyReactionDetailsHTML += "</div>";
				}
			}
			modifyReactionDetailsHTML += "</div></dt><div class='sp-separator2 al-wf-side-panel-selector-spacing'>&nbsp;</div></dl>";
		}
		else {
			modifyReactionDetailsHTML += "<dl><dt><div class='al-wf-title-text'>" + allergyI18N.REACTION + "</div><div class='al-wf-side-panel-reaction' id='allergyReactionSearchContainer" + this.m_compId + "'></div><br /><div id='allergyReactionList" + this.m_compId + "' class=" + currentAllergyDetailsObj.SEVERITY_STYLE + "></div></dt><div class='sp-separator2 al-wf-side-panel-selector-spacing'>&nbsp;</div></dl>";
		}

		resultListElem.append(modifyReactionDetailsHTML);

		//Listener to remove spinner once all fields are loaded
		CERN_EventListener.addListener(self, "optionsRendered" + self.m_compId, function() {
			optionsRenderedCnt++;
			/**
			 * There are total of 7 items that will be rendered in the side panel. The spinner will be shown unless all items render.
			 * Category, Severity, Reaction Type, Status, Source, Reason and Date Selector
			 */
			if (optionsRenderedCnt === 7) {
				//Remove spinner
				$("#sidePanel" + self.m_compId).find('.loading-screen').remove();
			}
		});

		//Prepare Options container
		modifyDetailsOptionsHTML += "<dl class='al-wf-side-panel-options-list'><dd id='allergyResultListSeverity" + this.m_compId + "'></dd><dd id='allergyResultListReactionType" + this.m_compId + "'></dd><dd id='allergyResultListCategory" + this.m_compId + "'></dd></dl><dl class='al-wf-side-panel-options-list'><dd id='allergyResultListStatus" + this.m_compId + "'></dd><dd id='allergyResultListReason" + this.m_compId + "'></dd><dd id='allergyResultListSource" + this.m_compId + "'></dd></dl>";
		modifyDateControlHTML += "<dl><dd id='allergyResultListDateControl" + this.m_compId + "'><div class='al-wf-title-text'>" + allergyI18N.ONSET + "</div>" + "</dd></dl>";
		modifyCommentsTextAreaHTML += "<dl><div class='sp-separator2 al-wf-side-panel-selector-spacing'>&nbsp;</div><dd id='allergyResultListComments" + this.m_compId + "' class='al-wf-side-panel-comments'><div class='al-wf-title-text'>" + commentsModClass + allergyI18N.COMMENTS + "</div><div class='al-wf-side-panel-text-comment'><textarea class='al-wf-side-panel-text-input' id='allergyCommentsTextInput" + this.m_compId + "'>" + (patReqCommentText || "") + "</textarea></div></dd></dl>";

		resultListElem.append(modifyDetailsOptionsHTML + modifyDateControlHTML + modifyCommentsTextAreaHTML);

		//Prepare the code set object
		this.getAllSourceCodes(currentAllergyDetailsObj);

		this.m_sidePanel.setContents(scrollContainerElem, "wf_alContent" + this.m_compId);
		//hi data is displayed - move the side panel and reset the height
		if (this.displayHiDataInd) {
			this.moveSidePanel();
			$("#wf_alContent" + this.m_compId).css("height", "");
		}
		$("#dummySearchContainer" + this.m_compId).addClass("al-wf-remove-reaction");

		//Create a new nomenclature search bar
		this.prepareReactionSearch(currentAllergyDetailsObj);

		//Register click events to the list of reactions
		removeReactionElem = $("#allergyReactionList" + this.m_compId);
		this.processRemoveReactions(this, removeReactionElem);

		//Prepare Date Control container
		this.renderAllergyDateControl(currentAllergyDetailsObj);

		//Set keyup event for the Comment for Save validation
		$("#allergyCommentsTextInput" + this.m_compId).keyup(function(event) {
			self.allowEnablingSaveButton = true;
			self.enableSaveOnValidFields();
		});
	}
	catch (err) {
		logger.logJSError(err, this, "allergy_o2.js", "modifyAllergyDetails");
	}
};

/**
 * enableSaveOnValidFields This function will run validations on allergy name input field (if exists)
 *                            and enable save button. The save button will be enabled if any field other
 *                            than allergy name is edited. The function will check this flag and would
 *                            enable save button.
 * @return {undefined}
 */
AllergyComponentWF.prototype.enableSaveOnValidFields = function() {
	var ftAllergyNameTextBox = $("#allergyModifyName" + this.m_compId);
	var saveBtn = $("#allergySaveButton" + this.m_compId);
	var inputText = ftAllergyNameTextBox.val();

	if (ftAllergyNameTextBox.length === 0) {
		this.enableAllergySaveButton(this, saveBtn);
	}
	else {
		if (this.isInputFieldValid()) {
			if (this.allowEnablingSaveButton) {
				this.enableAllergySaveButton(this, saveBtn);
			}
			else {
				this.disableAllergySaveButton(saveBtn);
			}
		}
	}
};

/**
 * isDuplicateAllergy Checks if selected allergy is a duplicate allergy
 * @param  {String}  allergyName   Name of the selected allergy
 * @param  {Object}  allergiesList List of recorded allergies
 * @return {Boolean}               Return if selected allergy is duplicate allergy
 */
AllergyComponentWF.prototype.isDuplicateAllergy = function(allergyName) {
	var viewOutsideRecordsPref = this.getOutsideRecordsPref();
	var patEnteredInd = this.getPatientEnteredDataInd();
	var allergiesList = [];
	//check if patinet entered data is being displayed set the list to contain the chart allergies only, otherwise set the allergy list to contain the entire reply
	allergiesList = (viewOutsideRecordsPref && patEnteredInd) ? this.m_chartedAllergies : this.scriptReply.ALLERGY;
	for (var i = 0; i < allergiesList.length; i++) {
		var currentAllergy = allergiesList[i];
		if (allergyName.toUpperCase() === currentAllergy.NAME.toUpperCase()) {
			return true;
		}
	}
	return false;
};

/**
 * isInputFieldValid Checks for allergy name input field with all validations
 * @return {Boolean} Return if fiels is valid or invalid
 */
AllergyComponentWF.prototype.isInputFieldValid = function() {
	var ftAllergyNameTextBox = $("#allergyModifyName" + this.m_compId);
	var inputText = ftAllergyNameTextBox.val();
	//patient requested allergy will check against the text in the header instead of the modified name
	if (!ftAllergyNameTextBox.length) {
		ftAllergyNameTextBox = $("#sidePanelHeaderText" + this.m_compId);
		inputText = ftAllergyNameTextBox.text();
	}
	var saveBtn = $("#allergySaveButton" + this.m_compId);
	inputText = inputText.replace(/^\s+|\s+$/g, '');

	// Check if input text is not empty
	if (inputText === "") {
		this.validationErrorAction(1);
		return false;
	}
	// Check if input text does not have any special characters
	else if (!(this.validateSearchInput(inputText))) {
		this.validationErrorAction(2);
		return false;
	}
	// Check if input text is a duplicate allergy
	else if (inputText !== this.currentAllergyDetailsObj.NAME && this.isDuplicateAllergy(inputText)) {
		this.validationErrorAction(3);
		return false;
	}
	//check if the input text is duplicate and also a patient request
	else if (this.isDuplicateAllergy(inputText) && this.currentAllergyDetailsObj.REQUEST_TEXT) {
		this.validationErrorAction(3);
		return false;
	}
	else {
		this.validationSuccessAction();
		return true;
	}
};

/**
 * validationErrorAction This function performs particular action on specific validation error
 * @param  {Number} typeOfError Type of action to be performed
 *                              1- Type: Empty input field error.
 *                                 Action: Disable side panel 'Save' button
 *                              2- Type: Invalid character error
 *                                 Action: Highlight the input field, show error message below the input field and
 *                                       Disable side panel 'Save' button
 *                              3- Type: Duplicate allergy error
 *                                 Action: Highlight the input field, show error message below the input field and
 *                                       Disable side panel 'Save' button
 * @return {undefined}
 */
AllergyComponentWF.prototype.validationErrorAction = function(typeOfError) {
	var ftAllergyNameTextBox = $("#allergyModifyName" + this.m_compId);
	var sidePanelHeaderText = $("#sidePanelHeaderText" + this.m_compId);
	var saveBtn = $("#allergySaveButton" + this.m_compId);
	var allergyI18n = i18n.discernabu.allergy_o2;
	var errorMessage = "";
	var errorMessgeHTML = "";
	var errorMessageContainer = $("#sidePanelErrorMessage" + this.m_compId);

	switch (typeOfError) {
		case 1: //Empty input field error
			ftAllergyNameTextBox.removeClass("al-wf-side-panel-free-text-input-error");
			errorMessageContainer.remove();
			this.disableAllergySaveButton(saveBtn);
			break;

		case 2: //Invalid character error
			errorMessage = allergyI18n.ERROR_MESSAGE_INVALID_CHARS;
			errorMessageContainer.remove();
			errorMessgeHTML = this.renderErrorMessage(errorMessage);
			ftAllergyNameTextBox.addClass("al-wf-side-panel-free-text-input-error");
			sidePanelHeaderText.append(errorMessgeHTML);
			this.disableAllergySaveButton(saveBtn);
			break;

		case 3: //Duplicate allergy error
			errorMessage = allergyI18n.ERROR_MESSAGE_DUPLICATE_ALLERGY;
			errorMessageContainer.remove();
			errorMessgeHTML = this.renderErrorMessage(errorMessage);
			ftAllergyNameTextBox.addClass("al-wf-side-panel-free-text-input-error");
			sidePanelHeaderText.append(errorMessgeHTML);
			this.disableAllergySaveButton(saveBtn);
			break;
	}
};

/**
 *  renderErrorMessage This function will render markup for error message
 * @param {String} errorMessage
 * @return {String} error message html markup
 */
AllergyComponentWF.prototype.renderErrorMessage = function(errorMessage) {
	var errorMessageHTML = "";
	errorMessageHTML = "<div id='sidePanelErrorMessage" + this.m_compId;
	errorMessageHTML += "' class='al-wf-side-panel-error-msg-text'>";
	errorMessageHTML += errorMessage + "</div>";

	return errorMessageHTML;
};

/**
 * validationSuccessAction This function will perform actions for a successful validation
 *                            of input text field
 * @return {undefined}
 */
AllergyComponentWF.prototype.validationSuccessAction = function() {
	var errorMessage = $("#sidePanelErrorMessage" + this.m_compId);
	var sidePanelHeaderText = $("#sidePanelHeaderText" + this.m_compId);
	var ftAllergyNameTextBox = $("#allergyModifyName" + this.m_compId);
	var saveBtn = $("#allergySaveButton" + this.m_compId);

	ftAllergyNameTextBox.removeClass("al-wf-side-panel-free-text-input-error");
	errorMessage.remove();
	this.enableAllergySaveButton(this, saveBtn);
};

/**
 * Disables/Dither the Button with the Id passed
 * @param {String} Button Id with the component Id
 * @return {undefined}
 */
AllergyComponentWF.prototype.disableAllergySaveButton = function(btnId) {
	if (btnId && !$(btnId).prop("disabled")) {
		btnId.addClass("disabled").prop('disabled', true);
	}
};

/**
 * Enables the Button with the Id passed
 * @param {String} Button Id with the component Id
 * @return {undefined}
 */
AllergyComponentWF.prototype.enableAllergySaveButton = function(component, btnId) {
	if (btnId && $(btnId).prop("disabled") && component.mandatoryItemsEntryList.length === 0) {
		btnId.removeClass("disabled").prop('disabled', false);
		//if the error message is in the DOM remove it
		if ($("#sidePanelHeader" + component.m_compId).find("#saveFailErrorMessage" + component.m_compId).length) {
			$("#saveFailErrorMessage" + component.m_compId).remove();
		}
	}
};

/**
 * Calls the GetCodeSetAsync Core function and calls the respective callback functions,
 * at the completion of the method we will have the respective HTML options with Code Set values
 * populated and the Saved data selected in each option by default
 *
 * @param {Object} Current allergy details object which contains the currently saved values
 * @return {undefined}
 */

AllergyComponentWF.prototype.getAllSourceCodes = function(rowDataObj) {
	try {
		var allergyI18N = i18n.discernabu.allergy_o2;
		var self = this;
		var allergyResultListSeverityElem = $("#allergyResultListSeverity" + this.m_compId);
		var allergyResultListReactionTypeElem = $("#allergyResultListReactionType" + this.m_compId);
		var allergyResultListCategoryElem = $("#allergyResultListCategory" + this.m_compId);
		var allergyResultListStatusElem = $("#allergyResultListStatus" + this.m_compId);
		var allergyResultListSourceElem = $("#allergyResultListSource" + this.m_compId);
		var allergyResultListReasonElem = $("#allergyResultListReason" + this.m_compId);

		/**
		 * Removes the mandatory styling from the element and removes the blank option in the drop-downs
		 * on selecting an option from the drop down. Also includes the mandatoryItemsEntryList which includes all the dropDown ID's which
		 * are marked as mandatory, only after they are satisfied will the Save button will be enabled
		 * @param {String} Drop-down element which is mandatory
		 */
		var onSelectMandatory = function(optionIdElem) {
			var optionId = "#" + optionIdElem + self.m_compId;
			var dropDownIndexVal = self.mandatoryItemsEntryList.indexOf(optionId);
			$(optionId).removeClass("required-field-input");
			$(optionId + " option[value='0']").remove();
			if (dropDownIndexVal > -1) {
				self.mandatoryItemsEntryList.splice(dropDownIndexVal, 1);
			}
		};

		/**
		 * As we are getting multiple insertions with respect to each drop downs into the mandatoryItemsEntryList, we need to check if the item already exists
		 * If not, then insert into the Array
		 * @param {String} Drop-down element which is mandatory
		 */
		var pushIfNotExist = function(optionIdElem) {
			if (optionIdElem) {
				var optionId = "#" + optionIdElem + self.m_compId;
				if (self.mandatoryItemsEntryList.indexOf(optionId) === -1) {
					self.mandatoryItemsEntryList.push(optionId);
				}
			}
		};

		/**
		 * Gets the Substance code set values and processes the codes to a set of options in the side panel to choose from
		 *
		 * All the below callback functions will perform the following:
		 *
		 * Set necessary mandatory fields
		 * Sort the list of codes obtained by Collation Sequence
		 * Fire an event to signal completion for the Spinner
		 * Append itself to the Result List HTML element
		 *
		 * @param {Object} List of objects provided from call to MP_GET_CODESET
		 */

		var categoryCB = function(result) {
			if (result) {
				var optionHTML = "<option value='0'></option>";
				var selectedOption = null;
				var isMandatory = true;
				var self = this;
				//Sort the result values by Collation Sequence
				result.sort(MP_Util.SortBySequence);

				//Insert items into option
				var len = result.length;
				for (var i = 0; i < len; i++) {
					if (result.hasOwnProperty(i)) {
						if (result[i].MEANING !== "NOTENTERED") {
							optionHTML += "<option value='" + result[i].CODE + "'>" + result[i].DISPLAY + "</option>";
						}
						else {
							isMandatory = false;
						}
					}
				}

				if (isMandatory) {
					allergyResultListCategoryElem.append("<span class='required-field-label'>*</span><span class='al-wf-title-text'>" + allergyI18N.CATEGORY + "</span><select class='al-wf-side-panel-select required-field-input' id='categoryOptSelect" + this.m_compId + "'>" + optionHTML + "</select>");
					pushIfNotExist("categoryOptSelect");
				}
				else {
					allergyResultListCategoryElem.append("<span class='al-wf-title-text'>" + allergyI18N.CATEGORY + "</span><select class='al-wf-side-panel-select' id='categoryOptSelect" + this.m_compId + "'>" + optionHTML + "</select>");
				}

				//Ah the option is now loaded, now we can fire the event to help spinner go away
				CERN_EventListener.fireEvent(null, this, "optionsRendered" + this.m_compId, null);
				selectedOption = $("#categoryOptSelect" + this.m_compId);

				//Set the already saved value as the default one
				if (rowDataObj && rowDataObj.SUBSTANCE_TYPE_CD) {
					if (this.allergyRequest) {
						this.allergyRequest.SUBSTANCE_TYPE_CD = parseFloat(rowDataObj.SUBSTANCE_TYPE_CD);
					}
					if (isMandatory) {
						onSelectMandatory("categoryOptSelect");
					}
					selectedOption.val(rowDataObj.SUBSTANCE_TYPE_CD);
				}

				$("#wf_al" + this.m_compId + "sidePanelContainer").on('change', "#categoryOptSelect" + this.m_compId, function() {
					if (isMandatory) {
						onSelectMandatory("categoryOptSelect");
					}
					selectedOption.blur();
					if (self.allergyRequest) {
						self.allergyRequest.SUBSTANCE_TYPE_CD = parseFloat(selectedOption.val());
					}
					//Enable the Save button
					self.allowEnablingSaveButton = true;
					self.enableSaveOnValidFields();
				});
			}
		};

		/**
		 * Gets the Reaction Type code set values and processes the codes to a set of options in the side panel to choose from
		 * @param {Object} List of objects provided from call to MP_GET_CODESET
		 */
		var reactionTypeCB = function(result) {
			if (result) {
				var optionHTML = "<option value='0'></option>";
				var selectedOption = "";
				var isMandatory = true;
				var self = this;

				//Sort the result values by Collation Sequence
				result.sort(MP_Util.SortBySequence);

				//Insert items into option
				var len = result.length;
				for (var i = 0; i < len; i++) {
					if (result.hasOwnProperty(i)) {
						if (result[i].MEANING !== "NOTENTERED") {
							optionHTML += "<option value='" + result[i].CODE + "'>" + result[i].DISPLAY + "</option>";
						}
						else {
							isMandatory = false;
						}
					}
				}
				if (isMandatory) {
					allergyResultListReactionTypeElem.append("<span class='required-field-label'>*</span><span class='al-wf-title-text'>" + allergyI18N.REACTION_TYPE + "</span><select class='al-wf-side-panel-select required-field-input' id='reactionTypeOptSelect" + this.m_compId + "'>" + optionHTML + "</select>");
					pushIfNotExist("reactionTypeOptSelect");
				}
				else {
					allergyResultListReactionTypeElem.append("<span class='al-wf-title-text'>" + allergyI18N.REACTION_TYPE + "</span><select class='al-wf-side-panel-select' id='reactionTypeOptSelect" + this.m_compId + "'>" + optionHTML + "</select>");
				}
				//Ah the option is now loaded, now we can fire the event to help spinner go away
				CERN_EventListener.fireEvent(null, this, "optionsRendered" + this.m_compId, null);
				selectedOption = $("#reactionTypeOptSelect" + this.m_compId);

				//Set the already saved value as the default one
				if (rowDataObj && rowDataObj.REACTION_CLASS_CD) {
					if (this.allergyRequest) {
						this.allergyRequest.REACTION_CLASS_CD = parseFloat(rowDataObj.REACTION_CLASS_CD);
					}
					if (isMandatory) {
						onSelectMandatory("reactionTypeOptSelect");
					}
					selectedOption.val(rowDataObj.REACTION_CLASS_CD);
				}
				$("#wf_al" + this.m_compId + "sidePanelContainer").on('change', "#reactionTypeOptSelect" + this.m_compId, function() {
					selectedOption.blur();
					if (isMandatory) {
						onSelectMandatory("reactionTypeOptSelect");
					}
					if (self.allergyRequest) {
						self.allergyRequest.REACTION_CLASS_CD = parseFloat(selectedOption.val());
					}
					//Enable the Save button
					self.allowEnablingSaveButton = true;
					self.enableSaveOnValidFields();
				});
			}
		};

		/**
		 * Gets the Severity code set values and processes the codes to a set of options in the side panel to choose from
		 * @param {Object} List of objects provided from call to MP_GET_CODESET
		 */
		var severityCB = function(result) {
			if (result) {
				var optionHTML = "<option value='0'></option>";
				var selectedOption = "";
				var isMandatory = true;
				var self = this;

				//Sort the result values by Collation Sequence
				result.sort(MP_Util.SortBySequence);

				//Insert items into option
				var len = result.length;
				for (var i = 0; i < len; i++) {
					if (result.hasOwnProperty(i)) {
						if (result[i].MEANING !== "NOTENTERED") {
							optionHTML += "<option value='" + result[i].CODE + "'>" + result[i].DISPLAY + "</option>";
						}
						else {
							isMandatory = false;
						}
					}
				}
				if (isMandatory) {
					allergyResultListSeverityElem.append("<span class='required-field-label'>*</span><span class='al-wf-title-text'>" + allergyI18N.SEVERITY + "</span><select class='al-wf-side-panel-select required-field-input' id='severityOptSelect" + this.m_compId + "'>" + optionHTML + "</select>");
					pushIfNotExist("severityOptSelect");
				}
				else {
					allergyResultListSeverityElem.append("<span class='al-wf-title-text'>" + allergyI18N.SEVERITY + "</span><select class='al-wf-side-panel-select' id='severityOptSelect" + this.m_compId + "'>" + optionHTML + "</select>");
				}
				//Ah the option is now loaded, now we can fire the event to help spinner go away
				CERN_EventListener.fireEvent(null, this, "optionsRendered" + this.m_compId, null);
				selectedOption = $("#severityOptSelect" + this.m_compId);

				//Set the already saved value as the default one
				if (rowDataObj && rowDataObj.SEVERITY_CD) {
					if (this.allergyRequest) {
						this.allergyRequest.SEVERITY_CD = parseFloat(rowDataObj.SEVERITY_CD);
					}
					if (isMandatory) {
						onSelectMandatory("severityOptSelect");
					}
					selectedOption.val(rowDataObj.SEVERITY_CD);
				}
				$("#wf_al" + this.m_compId + "sidePanelContainer").on('change', "#severityOptSelect" + this.m_compId, function() {
					selectedOption.blur();
					if (isMandatory) {
						onSelectMandatory("severityOptSelect");
					}
					if (self.allergyRequest) {
						self.allergyRequest.SEVERITY_CD = parseFloat(selectedOption.val());
					}
					//Enable the Save button
					self.allowEnablingSaveButton = true;
					self.enableSaveOnValidFields();
				});
			}
		};

		/**
		 * Gets the source code set values and processes the codes to a set of options in the side panel to choose from
		 * @param {Object} List of objects provided from call to MP_GET_CODESET
		 */
		var sourceCB = function(result) {
			if (result) {
				var optionHTML = "<option value='0'></option>";
				var selectedOption = "";
				var isMandatory = true;
				var self = this;

				//Sort the result values by Collation Sequence
				result.sort(MP_Util.SortBySequence);

				//Insert items into option
				var len = result.length;
				for (var i = 0; i < len; i++) {
					if (result.hasOwnProperty(i)) {
						if (result[i].MEANING !== "NOTENTERED") {
							optionHTML += "<option value='" + result[i].CODE + "'>" + result[i].DISPLAY + "</option>";
						}
						else {
							isMandatory = false;
						}
					}
				}
				if (isMandatory) {
					allergyResultListSourceElem.append("<span class='required-field-label'>*</span><span class='al-wf-title-text'>" + i18n.SOURCE + "</span><select class='al-wf-side-panel-select required-field-input' id='sourceOptSelect" + this.m_compId + "'>" + optionHTML + "</select>");
					pushIfNotExist("sourceOptSelect");
				}
				else {
					allergyResultListSourceElem.append("<span class='al-wf-title-text'>" + i18n.SOURCE + "</span><select class='al-wf-side-panel-select' id='sourceOptSelect" + this.m_compId + "'>" + optionHTML + "</select>");
				}
				//Ah the option is now loaded, now we can fire the event to help spinner go away
				CERN_EventListener.fireEvent(null, this, "optionsRendered" + this.m_compId, null);
				selectedOption = $("#sourceOptSelect" + this.m_compId);
				//if the selected row is a patient request find the corresponding code value for the source in code set 12023
				//if not found set the source of info code to 0.0 the dropdown will not be autopopulated with a value
				if(rowDataObj && rowDataObj.INTEROP && rowDataObj.INTEROP.EXT_DATA_ID > 0.0){
					self.setSourceOfInfoCd(rowDataObj,result);
				}
				//Set the already saved value as the default one
				if (rowDataObj && rowDataObj.SOURCE_OF_INFO_CD) {
					if (this.allergyRequest) {
						this.allergyRequest.SOURCE_OF_INFO_CD = parseFloat(rowDataObj.SOURCE_OF_INFO_CD);
					}
					if (isMandatory) {
						onSelectMandatory("sourceOptSelect");
					}
					selectedOption.val(rowDataObj.SOURCE_OF_INFO_CD);
				}
				$("#wf_al" + this.m_compId + "sidePanelContainer").on('change', "#sourceOptSelect" + this.m_compId, function() {
					selectedOption.blur();
					if (isMandatory) {
						onSelectMandatory("sourceOptSelect");
					}
					if (self.allergyRequest) {
						self.allergyRequest.SOURCE_OF_INFO_CD = parseFloat(selectedOption.val());
					}
					//Enable the Save button
					self.allowEnablingSaveButton = true;
					self.enableSaveOnValidFields();
				});
			}
		};

		/**
		 * Gets the status code set values and processes the codes to a set of options in the side panel to choose from
		 * @param {Object} List of objects provided from call to MP_GET_CODESET
		 */
		var statusCB = function(result) {
			if (result) {
				var optionHTML = "";
				var selectedOption = "";
				var reasonSelectedOption = "";
				var self = this;

				this.isCancelled = false;
				//Sort the result values by Collation Sequence
				result.sort(MP_Util.SortBySequence);
				//Insert items into option
				var len = result.length;
				for (var i = 0; i < len; i++) {
					if (result.hasOwnProperty(i)) {
						if (result[i].MEANING === "CANCELED") {
							this.cancelStatusCd = result[i].CODE;
						}
						if (result[i].MEANING !== "NOTENTERED") {
							optionHTML += "<option value='" + result[i].CODE + "'>" + result[i].DISPLAY + "</option>";
						}
					}
				}
				allergyResultListStatusElem.append("<span class='al-wf-title-text'>" + i18n.STATUS + "</span><select class='al-wf-side-panel-select' id='statusOptSelect" + this.m_compId + "'>" + optionHTML + "</select>");
				//Ah the option is now loaded, now we can fire the event to help spinner go away
				CERN_EventListener.fireEvent(null, this, "optionsRendered" + this.m_compId, null);
				selectedOption = $("#statusOptSelect" + this.m_compId);
				$("#wf_al" + this.m_compId + "sidePanelContainer").on('change', "#statusOptSelect" + this.m_compId, function() {
					selectedOption.blur();
					if (self.allergyRequest) {
						self.allergyRequest.REACTION_STATUS_CD = parseFloat(selectedOption.val());
					}
					if (self.cancelStatusCd) {
						if (parseInt(selectedOption.val(), 10) === self.cancelStatusCd) {
							//Fire the event screaming CANCELLED! so that the reason drop down activates
							self.isCancelled = true;
						}
						else {
							self.isCancelled = false;
						}
						CERN_EventListener.fireEvent(null, self, "allergyStatusEvent" + self.m_compId, null);
					}
					//Enable the Save button
					self.allowEnablingSaveButton = true;
					self.enableSaveOnValidFields();
				});
				//Set the already saved value as the default one
				if (rowDataObj && rowDataObj.STATUS_CD) {
					if (this.allergyRequest) {
						this.allergyRequest.REACTION_STATUS_CD = parseFloat(rowDataObj.STATUS_CD);
					}
					selectedOption.val(rowDataObj.STATUS_CD);
				}
			}
		};

		/**
		 * Gets the reason code set values and processes the codes to a set of options in the side panel to choose from
		 * @param {Object} List of objects provided from call to MP_GET_CODESET
		 *
		 * Reason menu is made active when the status chosen is "Cancelled"
		 */
		var reasonCB = function(result) {
			if (result) {
				var optionHTML = "<option value='0'></option>";
				var selectedOption = "";
				var isMandatory = true;
				var self = this;

				//Sort the result values by Collation Sequence
				result.sort(MP_Util.SortBySequence);

				//Insert items into option
				var len = result.length;
				for (var i = 0; i < len; i++) {
					if (result.hasOwnProperty(i)) {
						if (result[i].MEANING !== "NOTENTERED") {
							optionHTML += "<option value='" + result[i].CODE + "'>" + result[i].DISPLAY + "</option>";
						}
						else {
							isMandatory = false;
						}
					}
				}
				allergyResultListReasonElem.append("<span class='al-wf-title-text'>" + i18n.REASON + "</span><select class='al-wf-side-panel-select' id='reasonOptSelect" + this.m_compId + "'>" + optionHTML + "</select>");

				//Ah the option is now loaded, now we can fire the event to help spinner go away
				CERN_EventListener.fireEvent(null, this, "optionsRendered" + this.m_compId, null);

				CERN_EventListener.addListener(self, "allergyStatusEvent" + self.m_compId, function() {
					var reasonOptSelectElem = $("#reasonOptSelect" + self.m_compId);
					//Now that the status has been changed, if the status is "Canceled" then we need to check if the Reason is Mandatory. If it is then
					// the fields will change to mandatory mode
					if (self.isCancelled && isMandatory) {
						//Disable the Save button
						self.disableAllergySaveButton($("#allergySaveButton" + self.m_compId));
						allergyResultListReasonElem.html("");
						allergyResultListReasonElem.append("<span class='required-field-label'>*</span><span class='al-wf-title-text'>" + i18n.REASON + "</span><select class='al-wf-side-panel-select required-field-input' id='reasonOptSelect" + self.m_compId + "'>" + optionHTML + "</select>");
						//Make it mandatory by pushing it to the mandatory entry list
						pushIfNotExist("reasonOptSelect");
						reasonOptSelectElem.prop("disabled", false);
					}
					else if (self.isCancelled) {
						reasonOptSelectElem.prop("disabled", false);
					}
					else if (!self.isCancelled || !isMandatory) {
						allergyResultListReasonElem.html("");
						allergyResultListReasonElem.append("<span class='al-wf-title-text'>" + i18n.REASON + "</span><select class='al-wf-side-panel-select' id='reasonOptSelect" + self.m_compId + "'>" + optionHTML + "</select>");
						$("#reasonOptSelect" + self.m_compId).prop("disabled", true);
						var dropDownIndexVal = self.mandatoryItemsEntryList.indexOf("#reasonOptSelect" + self.m_compId);
						if (dropDownIndexVal > -1) {
							self.mandatoryItemsEntryList.splice(dropDownIndexVal, 1);
						}
					}
				});

				selectedOption = $("#reasonOptSelect" + this.m_compId);
				selectedOption.prop("disabled", true);

				$("#wf_al" + this.m_compId + "sidePanelContainer").on('change', "#reasonOptSelect" + this.m_compId, function() {
					var reasonSelectElem = $("#reasonOptSelect" + self.m_compId);
					reasonSelectElem.blur();
					if (self.allergyRequest && self.isCancelled) {
						//This is only if the user enters anything at all, in-case of it being mandatory or manual entry
						self.allergyRequest.CANCEL_REASON_CD = parseFloat(reasonSelectElem.val());
						if (isMandatory) {
							onSelectMandatory("reasonOptSelect");
						}
					}
					//Enable the Save button
					self.allowEnablingSaveButton = true;
					self.enableSaveOnValidFields();
				});
				self.allergyRequest.CANCEL_DT_TM = new Date().toJSON();
				self.allergyRequest.CANCEL_PRSNL_ID = self.criterion.getPersonnelInfo().getPersonnelId();
			}
		};

		var codeSetList = {
			12020: MP_Util.GetCodeSetAsync(12020, categoryCB.bind(self)),
			12021: MP_Util.GetCodeSetAsync(12021, reactionTypeCB.bind(self)),
			12022: MP_Util.GetCodeSetAsync(12022, severityCB.bind(self)),
			12023: MP_Util.GetCodeSetAsync(12023, sourceCB.bind(self)),
			12025: MP_Util.GetCodeSetAsync(12025, statusCB.bind(self)),
			14004: MP_Util.GetCodeSetAsync(14004, reasonCB.bind(self))
		};

		var keyList = Object.keys(codeSetList);

		for (var i = 0; i < keyList.length; i++) {
			var x = codeSetList[keyList[i]];
		}
	}
	catch (err) {
		logger.logJSError(err, this, "allergy_o2.js", "getAllSourceCodes");
	}
};

/**
 * Creates a new DateSelector Object and inserts into the Result List
 * @param {Object}  Data corresponding to the table row that is being modified
 *
 * More info on DateSelector Artifact: https://wiki.ucern.com/display/associates/DateSelector
 */
AllergyComponentWF.prototype.renderAllergyDateControl = function(rowDataObj) {
	try {
		var allergyI18N = i18n.discernabu.allergy_o2;
		var self = this;
		var allergyDetailsDateContainer = $("#allergyResultListDateControl" + this.m_compId);
		var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);

		this.initialPrecisionCode = null;
		this.initialPrecisionDate = null;
		this.initialPrecisionAge = null;
		this.initialPrecisionDateFormat = null;

		this.onsetDateSelector = new DateSelector();
		this.dateTimeFlagObj = {
			"0": 20,
			"1": 30,
			"2": 40,
			"3": 50,
			"-1": 0
		};
		this.onsetDateSelector.retrieveRequiredResources(function() {
			this.onsetDateSelector.setUniqueId("allergyDateSelector" + this.m_compId);
			this.onsetDateSelector.setCriterion(this.criterion);
			this.onsetDateSelector.setFuzzyFlag(true);
			// Render the date control and append HTML to date container
			var dateControlHTML = this.onsetDateSelector.renderDateControl();
			var selectedDate = null;
			allergyDetailsDateContainer.append(dateControlHTML);

			// Finalized actions after all elements are shown
			this.onsetDateSelector.finalizeActions();
			//Get the values from the selector whenever they are modified
			CERN_EventListener.addListener(self, "selectedDateAvailable" + self.onsetDateSelector.getUniqueId(), function() {
				var dateTimePrecisionVal1 = null;
				var dateTimePrecisionVal2 = null;
				self.allowEnablingSaveButton = false;
				var today = new Date();
				if (self.allergyRequest) {
					selectedDate = self.onsetDateSelector.getSelectedDate();
					if (selectedDate > today) {
						self.disableAllergySaveButton($("#allergySaveButton" + self.m_compId));
					}
					else {
						if (!self.initialPrecisionDate) {
							self.initialPrecisionDate = self.onsetDateSelector.getSelectedDate();
						}
						if (selectedDate && selectedDate.toString() !== self.initialPrecisionDate.toString()) {
							//Check for the Year and Year/month precision code and if they are not equal then the save button is enabled.
							switch (self.onsetDateSelector.getSelectedDateFlag().toString()) {
								case "2" :
									dateTimePrecisionVal1 = new Date(self.initialPrecisionDate.toString()).format("mm/yyyy");
									dateTimePrecisionVal2 = new Date(selectedDate.toString()).format("mm/yyyy");
									break;
								case "3" :
									dateTimePrecisionVal1 = new Date(self.initialPrecisionDate.toString()).format("yyyy");
									dateTimePrecisionVal2 = new Date(selectedDate.toString()).format("yyyy");
									break;
							}
							//Now if the dateTimePrecisionVal1 is null then the switch wasnt used and the precision is neither Year nor Month/Year. We can enable the Save button
							if (dateTimePrecisionVal1 !== dateTimePrecisionVal2 || !dateTimePrecisionVal1) {
								//Enable the Save button
								self.allowEnablingSaveButton = true;
								self.enableSaveOnValidFields();
							}
							self.allergyRequest.ONSET_DT_TM = new Date(selectedDate).toJSON();
							self.allergyRequest.ONSET_PRECISION_FLAG = self.dateTimeFlagObj[self.onsetDateSelector.getSelectedDateFlag().toString()];
							self.allergyRequest.ONSET_PRECISION_CD = self.onsetDateSelector.getSelectedDatePrecisionCode();
						}
						//For add workflow where there will be no previous values input unless this is a patient requested allergy
						if (selectedDate) {
							self.allergyRequest.ONSET_DT_TM = new Date(selectedDate).toJSON();
							self.allergyRequest.ONSET_PRECISION_FLAG = self.dateTimeFlagObj[self.onsetDateSelector.getSelectedDateFlag().toString()];
							self.allergyRequest.ONSET_PRECISION_CD = self.onsetDateSelector.getSelectedDatePrecisionCode();
						}
					}
				}
			});
			//Use the listeners to monitor the event fires and enable the Save Button on change

			//Event listener for Date Format drop down
			CERN_EventListener.addListener(self, "selectedDateFormatAvailable" + self.onsetDateSelector.getUniqueId(), function() {

				//As the listener get called when there is a pre-saved date format/precision code. We need to only enable save when an actual save is
				// performed and not when the value is defaulted
				if (self.initialPrecisionDateFormat === null) {
					self.initialPrecisionDateFormat = self.onsetDateSelector.getSelectedDateFlag();
				}
				if (self.initialPrecisionDateFormat !== null && self.initialPrecisionDateFormat !== self.onsetDateSelector.getSelectedDateFlag()) {
					self.allowEnablingSaveButton = true;
					self.enableSaveOnValidFields();
				}
				self.allergyRequest.ONSET_PRECISION_FLAG = self.dateTimeFlagObj[self.onsetDateSelector.getSelectedDateFlag().toString()];
			});

			//Event listener for precision code drop down
			CERN_EventListener.addListener(self, "selectedPrecisionCodeAvailable" + self.onsetDateSelector.getUniqueId(), function() {
				//Similar to the above case: as the listener get called when there is a pre-saved date format/precision code. We need to only enable save when an actual save is
				// performed and not when the value is defaulted
				if (self.initialPrecisionCode === null) {
					self.initialPrecisionCode = self.onsetDateSelector.getSelectedDatePrecisionCode();
				}
				if (self.initialPrecisionCode !== null && self.initialPrecisionCode !== self.onsetDateSelector.getSelectedDatePrecisionCode()) {
					self.allowEnablingSaveButton = true;
					self.enableSaveOnValidFields();
				}
				//As the service doesnt allow 0.0 to get saved into the database we need to send an abstract non-zero value
				self.allergyRequest.ONSET_PRECISION_CD = self.onsetDateSelector.getSelectedDatePrecisionCode() || 10.001;
			});

			//Event listener for Age unit drop down
			CERN_EventListener.addListener(self, "selectedAgeUnitAvailable" + self.onsetDateSelector.getUniqueId(), function() {
				//Check if the input text box has a value and then enable the save button
				if (allergyDetailsDateContainer.find('input') && allergyDetailsDateContainer.find('input').val()) {
					self.allowEnablingSaveButton = true;
					self.enableSaveOnValidFields();
				}
			});

			// Event listener for the changes in the input field
			allergyDetailsDateContainer.on('keyup', 'input', function() {
				if ($(this).val().length) {
					if ($(this).val().substring(0, 1) !== "*") {
						self.allowEnablingSaveButton = true;
						self.enableSaveOnValidFields();
					}
				}
				else {
					self.onsetDateSelector.setSelectedDate(null);
					self.disableAllergySaveButton($("#allergySaveButton" + self.m_compId));
				}
			});
			//Firing the event for the listener to remove the spinner
			CERN_EventListener.fireEvent(null, this, "optionsRendered" + this.m_compId, null);

			//Set the default values in date selector
			if (rowDataObj && rowDataObj.ONSET_DT_TM) {
				var selectedDateStr = "";
				var dateTime = new Date();

				dateTime.setISO8601(rowDataObj.ONSET_DT_TM);
				if (dateTime) {
					this.onsetDateSelector.setSelectedDate(new Date(rowDataObj.ONSET_DT_TM));
					switch (rowDataObj.ONSETDATE_FLAG) {
						case 20:
							//Date
							this.onsetDateSelector.setSelectedDateFlag(0);
							break;
						case 30:
							//Week of
							this.onsetDateSelector.setSelectedDateFlag(1);
							break;
						case 40:
							//Month-Year
							this.onsetDateSelector.setSelectedDateFlag(2);
							break;
						case 50:
							//Year
							this.onsetDateSelector.setSelectedDateFlag(3);
							break;
						default:
							//Age
							this.onsetDateSelector.setSelectedDateFlag(-1);
							break;
					}
					selectedDateStr = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR);
					this.onsetDateSelector.datePickerControl.datepicker("setDate", selectedDateStr);
				}
				this.onsetDateSelector.dateDisplayInput.removeClass("secondary-text");
				// This is to compensate for the service not accepting 0.0 for precision code. we are sending 10.001 + 0.999999 that gets added in
				// JSON.stringify
				if (rowDataObj.ONSET_PRECISION_CD === 11.000999) {
					this.onsetDateSelector.setSelectedDatePrecisionCode(0.0);
				}
				else {
					this.onsetDateSelector.setSelectedDatePrecisionCode(rowDataObj.ONSET_PRECISION_CD);
				}
			}
			else {
				// This workflow has/had no date input so enable the date
				self.initialPrecisionDateFormat = self.onsetDateSelector.getSelectedDateFlag();
				self.initialPrecisionCode = self.onsetDateSelector.getSelectedDatePrecisionCode();
				self.initialPrecisionDate = self.onsetDateSelector.getSelectedDate();
			}
			this.m_sidePanel.expandSidePanel();
		}.bind(this));
	}
	catch (err) {
		logger.logJSError(err, this, "allergy_o2.js", "renderAllergyDateControl");
	}
};

/**
 * Function to build mark-ups for a reaction add
 * @param {Object} Reaction object that needs the mark-up
 * @return {String} Mark-up returned after concatenating all the above values and adding/removing the reaction from the pending list
 */

AllergyComponentWF.prototype.buildReactionModify = function(reaction) {
	try {
		var reactionListHtml = "";
		if (reaction) {
			var uniqId = (reaction.REACTION_ID) ? "r_" + reaction.REACTION_ID : "n_" + this.pendingReactionList.length;
			reactionListHtml += "<div id='reactionItem_" + reaction.REACTION_NOM_ID + "' data-id='" + uniqId + "' class='al-wf-side-panel-reaction-list'><span class ='res-normal'>" + reaction.REACTION_NAME + "</span><div class='al-wf-side-panel-remove-icon'></div>";
			if (this.allergyRequest && reaction.REACTION_ID) {
				//Existing reactions are added to the list -> this depicts the saved/persisted list of reactions
				var reactionIndexObject = new this.ReactionRequestJSON();
				reactionIndexObject.REACTION_ID = reaction.REACTION_ID;
				reactionIndexObject.ALLERGY_ID = this.allergyRequest.ALLERGY_ID;
				reactionIndexObject.REACTION_NOM_ID = reaction.REACTION_NOM_ID;
				reactionIndexObject.ACTIVE_IND = 1;
				this.allergyRequest.REACTION.push(reactionIndexObject);
				this.allergyRequest.REACTION_CNT++;
			}
			else if (reaction.REACTION_ID === 0) {

				//This means it is a new Reaction and we need to put it in a separate pending list object
				//Reaction_id is 0.0 by default
				var pendingListLen = this.pendingReactionList.length;
				//create a pending reaction and set all its attributes
				var pendingReaction = new this.ReactionRequestJSON();
				pendingReaction.ALLERGY_ID = this.allergyRequest.ALLERGY_ID;
				pendingReaction.REACTION_NOM_ID = reaction.REACTION_NOM_ID;
				//free text reaction field should only be set if the nomn_id is 0.0
				pendingReaction.REACTION_FTDESC = (reaction.REACTION_NOM_ID === 0.0) ? reaction.REACTION_NAME : "";
				pendingReaction.ACTIVE_IND = 1;
				this.pendingReactionList[pendingListLen] = {
					"REACTION": pendingReaction,
					"INDEX": this.pendingReactionList.length
				};
			}
			if (reaction.REACTION_NOM_ID) {
				this.reactionsDuplicateList.push(reaction.REACTION_NOM_ID);
			}
		}
		return reactionListHtml;
	}
	catch (err) {
		logger.logJSError(err, this, "allergy_o2.js", "buildReactionModify");
	}
};

/**
 * JSON for Allergies request to mp_exec_std_request
 */
AllergyComponentWF.prototype.AllergyRequestJSON = function() {
	this.ALLERGY_INSTANCE_ID = 0.0;
	this.ALLERGY_ID = 0.0;
	this.PERSON_ID = 0.0;
	this.ENCNTR_ID = 0.0;
	this.SUBSTANCE_NOM_ID = 0.0;
	this.SUBSTANCE_TYPE_CD = 0.0;
	this.REACTION_CLASS_CD = 0.0;
	this.SEVERITY_CD = 0.0;
	this.SOURCE_OF_INFO_CD = 0.0;
	this.REACTION_STATUS_CD = 0.0;
	this.SUBSTANCE_FTDESC = "";
	this.CANCEL_REASON_CD = 0.0;
	this.CANCEL_DT_TM = "";
	this.CANCEL_PRSNL_ID = 0.0;
	this.ONSET_DT_TM = "";
	this.ONSET_PRECISION_CD = 0.0;
	this.ONSET_PRECISION_FLAG = 0;
	this.REACTION_CNT = 0;
	this.REACTION = [];
	this.ALLERGY_COMMENT_CNT = 0;
	this.ALLERGY_COMMENT = [];
	this.ACTIVE_IND = 1;
};

/**
 * Validation function for free text allergies and reactions
 *
 * @param {String} Search string to validate
 * @return {boolean} Returns true if search string is valid string else returns false
 */
AllergyComponentWF.prototype.validateSearchInput = function(searchString) {
	if (/^[a-zA-Z0-9-\' ]*$/.test(searchString) === false) {
		return false;
	}
	return true;
};

/**
 * JSON for Reaction request to mp_exec_std_request, this will be one of the parameters within the Allergy JSON
 */
AllergyComponentWF.prototype.ReactionRequestJSON = function() {
	return {
		REACTION_ID: 0.0,
		ALLERGY_ID: 0.0,
		REACTION_NOM_ID: 0.0,
		REACTION_FTDESC: "",
		ACTIVE_IND: 1
	};
};

/**
 * JSON for Comments request to mp_exec_std_request, this will be one of the parameters within the Allergy JSON
 */
AllergyComponentWF.prototype.CommentRequestJSON = function() {
	return {
		ALLERGY_COMMENT_ID: 0.0,
		ALLERGY_ID: 0.0,
		COMMENT_DT_TM: 0.0,
		ALLERGY_COMMENT: "",
		ACTIVE_IND: 1
	};
};

/**
 * Assorts all the details needed for the saving process and calls the saveRequestJSONBuilder function which would call the
 * mp_exec_std_request
 * @param {Object} AllergyComponentWF object
 * @param {Object} Previously saved object in the sidepanel
 * @return {undefined}
 */
AllergyComponentWF.prototype.performAllergyRequest = function(component, rowDataObj) {
	var self = this;
	var saveAllergyTimerObj = null;
	try {
		//create the timer object
		saveAllergyTimerObj = new RTMSTimer("USR:MPG.ALLERGY_O2-SAVE_ALLERGY_ACTIONABILITY", component.criterion.category_mean);
		if (saveAllergyTimerObj) {
			saveAllergyTimerObj.addMetaData("rtms.legacy.metadata.1", "Save Allergy");
			saveAllergyTimerObj.start();
		}
		//load the spinner to display in the side panel
		MP_Util.LoadSpinner("sidePanel" + this.m_compId);

		var allergyI18N = i18n.discernabu.allergy_o2;
		var requestJSONStr = "";
		var errorMessageHTML = "";

		//if the request is part of the ACCEPT/REJECT model add the interop fields to the allergy request
		if (rowDataObj && rowDataObj.REQUEST_STATUS_MEANING) {
			//if the interop code set is not yet cached get the code set and save it
			if (!self.m_interopCodesArr.length) {
				self.m_interopCodesArr = MP_Util.GetCodeSet(4003508, false);
			}
			//get the criterion
			var criterion = self.getCriterion();
			//populate the interop object
			this.allergyRequest.interop = {
				"ext_data_info_id": rowDataObj.INTEROP.EXT_DATA_ID,
				"status_code": MP_Util.GetCodeByMeaning(self.m_interopCodesArr, rowDataObj.REQUEST_STATUS_MEANING).codeValue,
				"personnel_id": criterion.provider_id,
				"encntr_id": criterion.encntr_id
			};
		}
		//build the request json string
		requestJSONStr = '{"REQUESTIN":{"ALLERGY_CNT":1,"ALLERGY":[' + MP_Util.enhancedStringify(self.allergyRequest, 0, 0, true, ["status_code"]) + ']}}';

		//Create the allergy request to the  "mp_upd_allergy" wrapper script
		//this script will handle interop status update along with adding/modifiying and canceling an allergy
		//for adding/modifying and canceling an allergy the wrapper will call the 'pm_ens_allergy' service.
		var allergyScriptRequest = new ScriptRequest();
		allergyScriptRequest.setProgramName("mp_upd_allergy");
		allergyScriptRequest.setDataBlob(requestJSONStr);
		allergyScriptRequest.setParameterArray(["^MINE^", "^^"]);
		allergyScriptRequest.setResponseHandler(function(scriptReply) {
			try {
				if (!component.isSavingNomenclatureItem) {
					// Read script status and refresh the procedure content table
					$("#sidePanel" + component.m_compId).find('.loading-screen').remove();
					if (saveAllergyTimerObj) {
						saveAllergyTimerObj.stop();
					}
				}
				//handle success
				if (scriptReply.getResponse().STATUS_DATA.STATUS === "S") {
					component.m_sidePanel.m_cornerCloseButton.show();
					component.alSearchBar.enable();
					//if the allergy was rejected remove it from the component table
					if (rowDataObj && rowDataObj.REQUEST_STATUS_MEANING === "REJECTED" && rowDataObj.REQUEST === "ADD") {
						var patReqTblGrp = self.allergyTable.getGroupById("GROUP_PATIENT_REQUEST");
						//get the table row
						var row = patReqTblGrp.getRowById(self.m_clickedRow.id.split(":")[2]);
						//remove the table row from the rows array in the patient requests table group
						var indexRow = $.inArray(row, patReqTblGrp.rows);
						if (indexRow !== -1) {
							patReqTblGrp.rows.splice(indexRow, 1);
						}
						//refresh the component table to apply the changes
						self.allergyTable.refresh();
						//close the side panel
						self.m_sidePanel.m_cornerCloseButton.trigger('click');
						//update the count in the component header
						/*eslint-disable camelcase*/
						CERN_EventListener.fireEvent(self, self, EventListener.EVENT_COUNT_UPDATE, {
							"count": self.resultCount - 1
						});
						/*eslint-enable calelcase*/
					}
					else { //refresh the component if not rejected
						//added or accepted patient request
						if (rowDataObj && rowDataObj.REQUEST_STATUS_MEANING !== "REJECTED") {
							component.newNomenId = scriptReply.getResponse().ALLERGY[0].ALLERGY_ID;
						}
						else if (!rowDataObj) { //new added allergy from the search bar
							component.newNomenId = scriptReply.getResponse().ALLERGY[0].ALLERGY_ID;
						}
						else { //rejected allergies
							component.newNomenId = 0.0;
						}
						component.retrieveComponentData();
					}
				}
				else {
					//failed request, throw error to be caught
					throw new Error("Non-success from MP_UPD_ALLERGY");
				}
			}
			catch (err) {
				//display error message in side panel banner
				component.createSidePanelErrorBanner(rowDataObj);
			}
		});
		allergyScriptRequest.performRequest();
	}
	catch (err) {
		if (saveAllergyTimerObj) {
			saveAllergyTimerObj.fail();
			saveAllergyTimerObj = null;
		}
		logger.logJSError(err, this, "allergy_o2.js", "performAllergyRequest");
	}
};


/**
 * Display error banner in the side panel
 * @param {Object} Previously saved object in the sidepanel
 * @return Undefined
 */
AllergyComponentWF.prototype.createSidePanelErrorBanner = function(rowDataObj) {
	var allergyI18N = i18n.discernabu.allergy_o2;
	//initialize the error message to the default error for other chart allergies
	var errorMsg = allergyI18N.UNABLE_TO_SAVE_ALLERGY;
	//if the action is performed on a patient requested allergy dispay the following message
	if (rowDataObj && rowDataObj.REQUEST_STATUS_MEANING) {
		errorMsg = allergyI18N.ERROR_PERFORMING_ACTION;
	}
	if (!this.isSavingNomenclatureItem) {
		if ($("#sidePanelHeader" + this.m_compId).find("#saveFailErrorMessage" + this.m_compId).length === 0) {
			errorMessageHTML = "<div id='saveFailErrorMessage" + this.m_compId + "' class='al-save-error-message'><div class='error-container inline-message'><span class='error-text message-info-text'>" + errorMsg + "</span></div></div>";
			$("#sidePanelHeader" + this.m_compId).prepend(errorMessageHTML);
		}
	}
	else {
		var errorBanner = new MPageUI.AlertBanner();
		errorBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
		errorBanner.setPrimaryText(errorMsg);
		errorMessageHTML = errorBanner.render();
		$("#nkaBannerContainer" + this.m_compId).prepend(errorMessageHTML);
	}
};


/**
 * saveModifiedAllergy this function will process and populate the allergy request whenever the allergy was modified
 * OR when a new allergy was added through the search bar this function will be utilized to populate the request with all the fields
 * this includes the modify,accept with changes and add with changes workflows
 * @param  {Object} component  MPageComponent data
 * @param  {Object || undefined} rowDataObj selected allergy data from the table
 * @return {undefined}
 */
AllergyComponentWF.prototype.saveModifiedAllergy = function(component, rowDataObj) {
	if (!this.isSavingNomenclatureItem) {
		var commentVal = $("#allergyCommentsTextInput" + this.m_compId).val().trim();
		if (this.allergyRequest) {
			if (commentVal) {
				this.allergyRequest.ALLERGY_COMMENT_CNT++;
				this.allergyRequest.ALLERGY_COMMENT[0] = new this.CommentRequestJSON();
				//For a new comment the comment_id will be 0.0
				if (rowDataObj) {
					this.allergyRequest.ALLERGY_COMMENT[0].ALLERGY_ID = rowDataObj.ALLERGY_ID ? rowDataObj.ALLERGY_ID : 0.0;
				}
				else {
					this.allergyRequest.ALLERGY_COMMENT[0].ALLERGY_ID = 0.0;
				}
				this.allergyRequest.ALLERGY_COMMENT[0].ALLERGY_COMMENT = commentVal.replace(/\r\n|\r|\n/g, '<br />');
				this.allergyRequest.ALLERGY_COMMENT[0].COMMENT_DT_TM = new Date().toJSON();
				this.allergyRequest.ALLERGY_COMMENT[0].COMMENT_PRSNL_ID = this.criterion.getPersonnelInfo().getPersonnelId() || 0.0;
			}
			//Check for the Status and Reason values
			if (!this.isCancelled) {
				this.allergyRequest.CANCEL_REASON_CD = 0.0;
				this.allergyRequest.CANCEL_DT_TM = "";
				this.allergyRequest.CANCEL_PRSNL_ID = 0.0;
			}
			//Now that the user has finalized all the reactions to be saved, we can append it to the allergy JSON and increment the count of
			// number of reactions
			if (this.pendingReactionList) {
				var pendingListLen = this.pendingReactionList.length;
				for (var i = 0; i < pendingListLen; i++) {
					this.allergyRequest.REACTION_CNT++;
					this.allergyRequest.REACTION.push(this.pendingReactionList[i].REACTION);
				}
			}
			// During the first save when the At/on is chosen with a date. we need to send the constant 10.001
			if (this.allergyRequest.ONSET_PRECISION_CD === 0 && this.allergyRequest.ONSET_DT_TM) {
				this.allergyRequest.ONSET_PRECISION_CD = 10.001;
			}

			// If this is a patient request that has not yet been marked as reviewed, set the reviewed_dt_tm, but
			//   only if the user has the necessary privs
			if (rowDataObj) {
				if (this.getPatientEnteredDataInd() && this.getOutsideRecordsPref() && rowDataObj.DIRECT_WRITTEN_IND && this.getMarkAsReviewedPriv()) {
					this.allergyRequest.REVIEWED_DT_TM = new Date().toJSON();
					this.allergyRequest.REVIEWED_TZ = this.criterion.client_tz;//time zone index value
					this.allergyRequest.REVIEWED_PRSNL_ID = this.criterion.getPersonnelInfo().getPersonnelId() || 0.0;
				}
			}
		}

		//Disable all the buttons
		this.disableAllergySaveButton($("#allergySaveButton" + this.m_compId));
	}
	//perform the request
	this.performAllergyRequest(component, rowDataObj);
};
/**
 * Create a nomenclature search and set the properties for Reaction Search
 */
AllergyComponentWF.prototype.prepareReactionSearch = function(rowObj) {
	try {
		var self = this;
		var allergyI18N = i18n.discernabu.allergy_o2;
		var rctnSearchContainer = $("#allergyReactionSearchContainer" + this.m_compId);
		var nomenSearchInputElement = "";
		var origHandleReplyList = null;

		if (rctnSearchContainer.length) {
			rctnSearchContainer.addClass("al-wf-edit-reaction");
			this.reacSearchBar = new MPageControls.NomenclatureSearch(rctnSearchContainer);
			nomenSearchInputElement = rctnSearchContainer.find('input');
			this.reacSearchBar.setCaption(allergyI18N.ADD_REACTION);
			this.reacSearchBar.setCaptionClass('secondary-text');
			this.reacSearchBar.activateCaption();

			//Nomenclature Source flag 12 is assigned to the reaction search
			this.reacSearchBar.setSourceFlag(12);
			this.reacSearchBar.setDelay(500);

			// Set list template for suggestions. For a free text procedure the nomenclature ID is 0 so add a custom class so that specific
			// styles can be applied
			var nomenSearchItemTemplate = new TemplateEngine.TemplateFactory((function() {
				var template = TemplateEngine;
				var div = template.tag("div");
				return {
					nomenInfo: function(context) {
						if (context.m_Data.ID === 0) {
							return div({
								"class": "al-free-text-item",
								"id": context._elementId
							}, context.m_Data.SOURCESTRING);
						}
						else {
							return div({
								"id": context._elementId
							}, context.m_Data.SOURCESTRING);
						}
					}

				};
			})());
			this.reacSearchBar.setListItemTemplate(nomenSearchItemTemplate.nomenInfo);

			origHandleReplyList = this.reacSearchBar.handleReplyList;

			this.reacSearchBar.handleReplyList = function(replyList, reply, err) {
				var customNomen = new MPageEntity.entities.Nomenclature();
				//Intercept the results and remove already added ones (duplicate list items)
				if (self.reactionsDuplicateList && self.reactionsDuplicateList.length > 0) {
					for (var i = 0; i < replyList.length;) {
						if (replyList[i] && replyList[i].getData()) {
							if (self.reactionsDuplicateList.indexOf(replyList[i].getId()) > -1) {
								replyList.splice(i, 1);
							}
							else {
								i++;
							}
						}
					}
				}
				var freeTextReactions = $("#allergyReactionSearchContainer" + self.m_compId).find('input').val();

				//Show free text allergies in quotes
				if (self.validateSearchInput(freeTextReactions)) {
					freeTextReactions = "\"" + freeTextReactions + "\"";
					customNomen.setId(0);
					customNomen.setSourceString(allergyI18N.ADD_AS_FREE_TEXT.replace("{0}", freeTextReactions));
					replyList.push(customNomen);
				}
				origHandleReplyList.call(this, replyList, reply, err);
				MPageControls.NomenclatureSearch.prototype.setSuggestions.call(this, replyList);
				this.getList().setSelectedIndex(0);
				this.getList().highlight(0);
			};

			this.reacSearchBar.getList().setOnSelect(function(nomen) {
				if (nomen.getId() === 0) {
					nomen.setSourceString(nomenSearchInputElement.val());
					self.AllergyName = nomenSearchInputElement.val();
				}
				self.reacSearchBar.activateCaption();
				self.reacSearchBar.close();
				if (rowObj) {
					AllergyComponentWF.prototype.handleSelectedReaction(self, nomen.getId(), nomen.getSourceString(), rowObj);
				}
				else {
					AllergyComponentWF.prototype.handleSelectedReaction(self, nomen.getId(), nomen.getSourceString());
				}
			});

			nomenSearchInputElement.click(function() {
				$("#alErrorMessage" + self.m_compId).remove();

				var alSearchContent = nomenSearchInputElement.val();
				if (!alSearchContent || alSearchContent === allergyI18N.ADD_REACTION) {
					nomenSearchInputElement.val("");
					nomenSearchInputElement.addClass('secondary-text');
				}
				else {
					nomenSearchInputElement.removeClass('secondary-text');
				}
			});

			nomenSearchInputElement.bind("change focusout", function() {
				var alSearchContent = nomenSearchInputElement.val();
				if (!alSearchContent || alSearchContent === allergyI18N.ADD_REACTION) {
					nomenSearchInputElement.val(allergyI18N.ADD_REACTION);
					nomenSearchInputElement.addClass('secondary-text');
				}
				else {
					nomenSearchInputElement.removeClass('secondary-text');
				}
			});
		}
	}
	catch (err) {
		logger.logJSError(err, this, "allergy_o2.js", "prepareReactionSearch");
	}
};

/**
 * The handleSelectedReaction will add a new reaction in the reaction list in side panel
 * @param {object} component The AllergyWF component
 * @param {float} nomenclatureID The nomenclature ID of selected reaction
 * @param {string} reactionName The name of free text/codified Reaction
 */
AllergyComponentWF.prototype.handleSelectedReaction = function(component, nomenclatureID, reactionName, rowObj) {
	if (reactionName) {
		var newReactionObj = new component.ReactionRequestJSON();
		var newReactionHtml = "";
		newReactionObj.REACTION_NOM_ID = nomenclatureID;
		newReactionObj.REACTION_NAME = reactionName;
		if (nomenclatureID === 0) {
			newReactionObj.REACTION_FTDESC = reactionName;
		}
		if (rowObj) {
			newReactionObj.ALLERGY_ID = rowObj.ALLERGY_ID;
			newReactionHtml = component.buildReactionModify(newReactionObj) + "<div class='sp-separator2 al-wf-side-panel-reactions'>&nbsp;</div></div>";
		}
		else {
			newReactionObj.ALLERGY_ID = 0.0;
			newReactionHtml = component.buildReactionModify(newReactionObj) + "<div class='sp-separator2 al-wf-side-panel-reactions'>&nbsp;</div></div>";
		}
		$("#allergyReactionList" + component.m_compId).prepend(newReactionHtml);
		//Resize the sidepanel to consider the new addition
		component.m_sidePanel.expandSidePanel();

		//Enable the Save button
		component.allowEnablingSaveButton = true;
		component.enableSaveOnValidFields();
	}
	component.reacSearchBar.activateCaption();
};

/**
 * Removes the reaction from the Allergy Object or the Pending reactions object
 * If the User is removing the already saved reaction then the Allergy Object is modified to send the ACTIVE_IND as 0
 * else it means that the user has added the reaction just now and still hasnt saved it. This would need us to access the pending
 * list and remove the reaction entirely
 *
 * @param {Object} Allergy component object
 * @param {String} Reaction HTML element for removing the reaction based on the reaction id
 *
 */
AllergyComponentWF.prototype.processRemoveReactions = function(component, removeReactionElem) {

	/**
	 *    This function gets the index of the reaction in the Allergy Reactions arraylist or the pending raections list
	 *    @param {Object} Reactions object
	 *    @return {integer} Position of the reaction in the Array
	 */
	var getIndex = function(reactionObj, reactionData) {
		return $.map(reactionObj, function(object, index) {
			if (object.REACTION_ID && object.REACTION_ID === parseFloat(reactionData[1])) {
				return index;
			}
			else if (object.INDEX === parseInt(reactionData[1], 10)) {
				return index;
			}
		});
	};
	removeReactionElem.on("click", function(event) {
		var reactionIndex = -1;
		var newReactionObject = "";
		var temp_dupe_index = -1;
		if (event.target.className === "al-wf-side-panel-remove-icon") {
			var parentElem = event.target.parentElement;
			if (parentElem) {
				var reactionData = "";
				$(parentElem).addClass("al-wf-remove-reaction").removeClass("al-wf-side-panel-reaction-list");
				//Removing the newly entered items wont impact the request object as they are in the pending list
				//Removing the saved items will make the ACTIVE_IND to 0
				if (event.target.parentElement.getAttribute("data-id")) {
					reactionData = event.target.parentElement.getAttribute("data-id").split("_");
					if (reactionData[0] === 'r') {
						if (component.allergyRequest) {
							//Get the index for the reaction that needs to be removed
							reactionIndex = getIndex(component.allergyRequest.REACTION, reactionData);
							//Set the ACTIVE_IND to 0 for deactivating/removing the reaction
							if (reactionIndex > -1) {
								component.allergyRequest.REACTION[reactionIndex].ACTIVE_IND = 0;
								//Remove the item from the duplicate list for the next time the search is done we can show the results for this
								temp_dupe_index = component.reactionsDuplicateList.indexOf(component.allergyRequest.REACTION[reactionIndex].REACTION_NOM_ID);
								if (temp_dupe_index > -1) {
									component.reactionsDuplicateList.splice(temp_dupe_index, 1);
								}
							}
						}
					}
					else if (reactionData[0] === 'n') {
						//This means its a reaction that was newly added and we need to remove it entirely if the user wants to remove it,
						//the reason being it was not saved and is still present in the pending list
						newReactionObject = component.pendingReactionList;
						if (newReactionObject) {
							var pendingReactionNomnId = 0;
							reactionIndex = getIndex(newReactionObject, reactionData);
							if (reactionIndex > -1) {
								//save a reference to the nomn id in context to remove it from the duplicate array
								pendingReactionNomnId = newReactionObject[reactionIndex].REACTION.REACTION_NOM_ID;
								component.pendingReactionList.splice(reactionIndex, 1);
							}
							//Remove the item from the duplicate list for the next time the search is done we can show the results for this
							if (pendingReactionNomnId > 0) { //only if the reaction is codified meaning the nomn id > 0
								temp_dupe_index = component.reactionsDuplicateList.indexOf(pendingReactionNomnId);
								if (temp_dupe_index > -1) {
									component.reactionsDuplicateList.splice(temp_dupe_index, 1);
								}
							}
						}
					}
				}
			}
		}
		//Enable the Save button
		component.allowEnablingSaveButton = true;
		component.enableSaveOnValidFields();
		//Resize the side panel to account for the removal
		component.m_sidePanel.expandSidePanel();
	});
};

/**
 * Map the Allergy O2 object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "WF_ALLERGY" filter
 */
MP_Util.setObjectDefinitionMapping("WF_ALLERGY", AllergyComponentWF);

/**
 * The handleSelectedAllllergy will add a new row in the component table, shows a side panel with required fields to add a new
 * allergy item.
 * @param {object} component The Allergy component
 * @param {float} nomenclatureID The nomenclature ID of selected Allergy
 * @param {string} allergyName The name of free text/codified Allergy
 * @returns none
 */
AllergyComponentWF.prototype.handleSelectedAllergy = function(component, nomenclatureID, allergyName) {
	// Disable the allergy search as soon as a new allergy is selected from the search results
	var self = component;
	var compId = component.m_compId;
	var newRowObj = null;
	var actionabilityBanner = "";
	var allergyFreeTxtBanner = "";
	//reset the side panel alert banner
	self.m_sidePanel.setAlertBannerAsHTML("");
	// If any other row is already selected then unselect it
	component.m_tableContainer.find('selected').removeClass('selected');
	var rowDetailsObject = [{
		ALLERGY_NAME: allergyName,
		ALLERGY_SEVERITY: "",
		ALLERGY_REACTIONS: "",
		ALLERGY_REACTION_TYPE: "",
		ALLERGY_INFORMATION_SOURCE: "",
		COMMENTS_TEXT: ""
	}];
	//patient entered data is displayed
	if (!self.displayHiDataInd && self.getPatientEnteredDataInd() && self.getOutsideRecordsPref()) {
		//find the other chart allergies group
		var grp = component.allergyTable.getGroupById("GROUP_OTHER_CHART_ALLERGIES");
		//create a new table row
		newRow = new TableRow();
		newRow.setId("newAllergyRow");
		newRow.setResultData(rowDetailsObject[0]);
		newRowObj = newRow;
	}//only chart allergies displayed - no rows in the table
	else if (!component.allergyTable.getRows().length) {
		component.allergyTable.renderHeader();
		component.allergyTable.bindData(rowDetailsObject);
		component.setComponentTable(component.allergyTable);
		component.allergyTable.refresh();
		component.allergyTable.finalize();
		newRowObj = $("#wf_al" + compId + "\\:row0");
	}
	else {//only chart allergies displayed - with rows in the table
		newRow = new TableRow();
		// Creating a new TableRow object
		newRow.setId("newAllergyRow");
		newRow.setResultData(rowDetailsObject[0]);
		component.allergyTable.addRow(newRow);
		component.allergyTable.refresh();
		newRowObj = $("#wf_al" + compId + "\\:newAllergyRow");
	}
	if (newRowObj) {
		// Move the newly added row to the top.
		component.moveRowToTop(newRowObj);
		component.addCellClickExtension();
		if (!self.m_showPanel) {
			// shrink the table and show the panel
			$("#wf_al" + compId + "table").addClass("allergy-sp-hide-mode");
			self.m_tableContainer.addClass("al-wf-side-panel-addition");
			self.m_sidePanelContainer.css("display", "inline-block");
			self.m_showPanel = true;
			self.m_sidePanel.showPanel();
		}
		self.m_sidePanel.setTitleText(allergyName);
		if (!(nomenclatureID)) {
			var freeTextStatus = self.getAllergyFreeTextStatusPriv();
			allergyFreeTxtBanner = self.createAllergyFreeTextBanner(freeTextStatus);
		}
		actionabilityBanner = self.renderActionabilityBanner();
		self.m_sidePanel.setAlertBannerAsHTML(allergyFreeTxtBanner + actionabilityBanner);
		self.addNewAllergyDetails(allergyName, nomenclatureID);
		component.alSearchBar.activateCaption();
	}
};

/**
 * [createHIAddDataControl This method will create the Data Banner used to indicate the presence of Healthe Intent Data.
 * @return {String} Hi data control banner html markup
 */
AllergyComponentWF.prototype.createHIAddDataControl = function() {
	var imgUrl = this.getCriterion().static_content + "/images/6965.png";
	var hiDataContainer = [
		'<div id="hiAddDataContainer" class="al-wf-hi-ext-label al-wf-hi-banner-container">',
		'<div class="al-wf-banner-image">',
		'<img class="al-wf-externalData" src="', imgUrl, '">',
		'</div>',
		'<div class="al-wf-hi-data-label">',
		i18n.discernabu.allergy_o2.VIEW_UNVERIFIED_RECORDS,
		'</div>',
		'<div class="al-wf-outsiderecords-button al-wf-pull-right">',
		'<button class="al-wf-hi-ext-btn " id="hiDataControlBtn', this.getComponentId(), '">',
		i18n.discernabu.allergy_o2.VIEW_OUTSIDE_RECORDS,
		'</button>',
		'</div>',
		'</div>'
	];
	return hiDataContainer.join('');

};


/**
 * createHIErrorDataControl This method will create the Data Banner used to indicate the error of  Data.
 * @return {String} Hi error control banner html markup
 */
AllergyComponentWF.prototype.createHIErrorDataControl = function() {
	var imgUrl = this.getCriterion().static_content + "/images/6965.png";
	var hiDataContainer = [
		'<div class="al-wf-hi-ext-label al-wf-hi-banner-container">',
		'<div class="al-wf-banner-image">',
		'<img class="al-wf-externalData" src="', imgUrl, '">',
		'</div>',
		'<div class="al-wf-hi-error-data-label">',
		i18n.discernabu.allergy_o2.EXTERNAL_DATA_LABEL_ERR,
		'</div>',
		'</div>'
	];
	return hiDataContainer.join('');

};

/**
 * This method will be called on each row selection to update the background color of selected row and font color to indicate that
 * this is the currently selected row
 *
 * @param {element}
 *                selRowObj - The current row label element that was selected
 * @return {String}
 *                HTML markup for the Table plus the Label at the top.
 */
AllergyComponentWF.prototype.showHiDataTable = function() {
	if (this.m_processedHiDataObject) {
		var imgUrl = this.getCriterion().static_content + "/images/6965.png";
		var docI18n = i18n.discernabu.allergy_o2;
		var hiData = this.m_processedHiDataObject;
		this.allergyHiTable = new ComponentTable();
		var self = this;
		var compId = self.getComponentId();
		this.hiNameSpace = this.getStyles().getId() + "hi";
		this.allergyHiTable.setNamespace(this.getStyles().getId() + "hi");
		var hiDataContainer = [
			'<div id="hiOpenDataContainer" class="al-wf-hi-open-label al-wf-hi-banner-container">',
			'<div class="al-wf-banner-image">',
			'<img class="al-wf-externalData" src="', imgUrl, '">',
			'</div>',
			'<div class="al-wf-hi-data-label">',
			docI18n.UNVERIFIED_RECORDS,
			'</div>',
			'</div>',
			'<div id="al-wf-ext-data-loading" class="al-wf-loading"></div>'
		].join('');
		$("#al-wf-banner-holder" + compId).html(hiDataContainer);
		//Create the name column
		var nameColumn = new TableColumn();
		nameColumn.setColumnId("HI_NAME");
		nameColumn.setCustomClass("allergy-o2-col");
		nameColumn.setColumnDisplay(docI18n.NAME);
		nameColumn.setPrimarySortField("SORT_ALL_NAME");
		nameColumn.setIsSortable(true);
		nameColumn.setRenderTemplate("${ALLERGY_NAME}");

		//Create the Severity column
		var severityColumn = new TableColumn();
		severityColumn.setColumnId("HI_Severity");
		severityColumn.setCustomClass("allergy-o2-col");
		severityColumn.setColumnDisplay(docI18n.SEVERITY);
		severityColumn.setPrimarySortField("SORT_ALL_SEVERITYT");
		severityColumn.setIsSortable(true);
		severityColumn.setRenderTemplate("${ALLERGY_SEVERITY}");
		severityColumn.addSecondarySortField("SORT_ALL_NAME", TableColumn.SORT.ASCENDING);

		//Create the Reaction column
		var reactionColumn = new TableColumn();
		reactionColumn.setColumnId("HI_Reaction");
		reactionColumn.setCustomClass("allergy-o2-col");
		reactionColumn.setColumnDisplay(docI18n.REACTION);
		reactionColumn.setPrimarySortField("SORT_ALL_REACTIONS");
		reactionColumn.setIsSortable(true);
		reactionColumn.setRenderTemplate("${ ALLERGY_REACTIONS}");
		reactionColumn.addSecondarySortField("SORT_ALL_NAME", TableColumn.SORT.ASCENDING);

		//Create the Source column
		var onsetColumn = new TableColumn();
		onsetColumn.setColumnId("HI_Source");
		onsetColumn.setCustomClass("allergy-o2-sp-hide-col");
		onsetColumn.setColumnDisplay(i18n.ONSET);
		onsetColumn.setPrimarySortField("SORT_ALL_DATE");
		onsetColumn.setIsSortable(true);
		onsetColumn.setRenderTemplate("${ ONSET_DATE }");
		onsetColumn.addSecondarySortField("SORT_ALL_NAME", TableColumn.SORT.ASCENDING);

		//Create the Comments column
		var commentColumn = new TableColumn();
		commentColumn.setColumnId("HI_Comments");
		commentColumn.setCustomClass("allergy-o2-sp-hide-col");
		commentColumn.setColumnDisplay(docI18n.COMMENTS);
		commentColumn.setPrimarySortField("SORT_ALL_COMMENTS");
		commentColumn.setIsSortable(true);
		commentColumn.setRenderTemplate("${ ALLERGY_COMMENTS }");
		commentColumn.addSecondarySortField("SORT_ALL_NAME", TableColumn.SORT.ASCENDING);

		//Add the columns to the table
		this.allergyHiTable.addColumn(nameColumn);
		this.allergyHiTable.addColumn(severityColumn);
		this.allergyHiTable.addColumn(reactionColumn);
		this.allergyHiTable.addColumn(onsetColumn);
		this.allergyHiTable.addColumn(commentColumn);

		this.allergyHiTable.bindData(this.m_processedHiDataObject);
		this.allergyHiTable.sortByColumnInDirection("HI_Severity", TableColumn.SORT.DESCENDING);

		var hiTable = this.allergyHiTable.render();
		var hiContent = "<div id='al-wf-hi-table-show' class='al-wf-hi-table-rendered'>" + hiTable + "</div>";

		return hiContent;
	}
};

/**
 * This method will be used to create a Pager to be added below the Healthe Intent Table. If Healthe Intent
 * data is not present, this function will return null.
 * @returns {MPageUI.Pager | null} The pager control for HI data
 */
AllergyComponentWF.prototype.createHiPager = function() {
	var pager = null;
	if (this.m_hiData && this.m_hiData !== "" && this.m_hiTotalResults) {
		var docI18n = i18n.discernabu.allergy_o2;
		var totalPages = 0;
		var self = this;
		totalPages = Math.ceil((this.m_hiData.total_results / 20));
		pager = new MPageUI.Pager();
		pager.setCurrentPageLabelPattern("${currentPage} / ${numberPages}")
			.setPreviousLabel(docI18n.PREV)
			.setNextLabel(docI18n.NEXT)
			.setNumberPages(totalPages)
			.setOnPageChangeCallback(function() {
				self.handlePagerClick(arguments[0].currentPage);
			});
		this.m_hiPager = pager;
	}
	return pager;
};

/**
 * This method is used to handle the next/previous click event on the pager and also updates the table with new data.
 * It shows error banner script fails or the data is invalid.
 * @param {number} currentPage - The current page passed by the pager.
 * @returns {undefined} Returns nothing.
 */
AllergyComponentWF.prototype.handlePagerClick = function(currentPage) {
	// Function to call the MP_GET_ALLERGIES_JSON script and  update the table accordingly
	function getHiData(component) {
		var self = component;
		var criterion = self.getCriterion();
		var compId = self.getComponentId();
		var sendAr = [
			"^MINE^", criterion.person_id + ".0", 0.0, 0, criterion.provider_id + ".0", criterion.ppr_cd + ".0",
			'^' + self.hiLookUpKey + '^', "^" + self.aliasType + "^", self.aliasPool + ".0", "^" + self.hiTestURI + "^", self.pageIndex, 0
		];
		var request = null;
		var allergiesRequest = new ScriptRequest();
		allergiesRequest.setProgramName("MP_GET_ALLERGIES_JSON");
		allergiesRequest.setParameterArray(sendAr);
		allergiesRequest.setResponseHandler(function(scriptReply) {
			// If the reply status is not failure.
			if (scriptReply.getResponse().STATUS_DATA.STATUS != "F") {
				self.checkHiData(scriptReply.m_responseData);
				// Checks if the data is present and valid.
				if (self.m_hiDataValid && self.m_hiHasData) {
					self.processHiResultsForRender(scriptReply.m_responseData);
					self.allergyHiTable.clearData();
					// If the data Object is populated with processed data
					if (self.m_processedHiDataObject) {
						self.allergyHiTable.bindData(self.m_processedHiDataObject);
						var tableRender = self.allergyHiTable.render();
						$("#wf_al" + compId + " #al-wf-hi-table-show").find('.loading-screen').remove();
						$("#wf_al" + compId + " .al-wf-hi-table-rendered").html(tableRender);
						self.allergyHiTable.finalize();
						// If the hi row is already clicked.
						if (self.m_hiClickedRow) {
							var firstRowId = null;
							firstRowId = $("#wf_al" + compId + "hitableBody dl:first-child") && $("#wf_al" + compId + "hitableBody dl:first-child").attr('id');
							// If the clicked row id matches the first row id of hi table.
							if (self.m_hiClickedRow.id === firstRowId) {
								self.m_hiClickedRow = "";
								// adds the hide class to hide two rows
								$("#wf_al" + compId + "hitable").addClass("allergy-sp-hide-mode");

								// Clicks the first row of new table to open the side panel.
								$("#wf_al" + compId + "hitableBody dl:first-child").click();
								self.resizeComponent();
							}
							else {
								$("#wf_al" + compId + "hitable").addClass("allergy-sp-hide-mode");
								$("#wf_al" + compId + "hitableBody dl:first-child").click();
								self.resizeComponent();
							}
						}
						// If the Millenium table row was already clicked.
						else if (self.m_clickedRow) {

							$("#wf_al" + compId + "hitable").addClass("allergy-sp-hide-mode");
							self.resizeComponent();
						}

						else {
							self.resizeComponent();
						}
					}

				}
				// If the data is invalid.
				else if (self.m_hiDataValid === false) {
					$("#wf_al" + compId + " #al-wf-hi-table-show").find('.loading-screen').remove();
					$("#wf_al" + compId + " .al-wf-hi-table-rendered").html(MP_Util.HandleErrorResponse("", i18n.discernabu.allergy_o2.ERROR_EXTERNAL_DATA));
					self.resizeComponent();
				}
			}
			else {
				$("#wf_al" + compId + " #al-wf-hi-table-show").find('.loading-screen').remove();
				$("#wf_al" + compId + " .al-wf-hi-table-rendered").html(MP_Util.HandleErrorResponse("", i18n.discernabu.allergy_o2.ERROR_EXTERNAL_DATA));
				self.resizeComponent();
			}
		});
		allergiesRequest.performRequest();
	}

	var tableDiv = "wf_al" + this.getComponentId() + "hitable";
	if (this.m_hiCurrentPage < currentPage) {
		MP_Util.LoadSpinner(tableDiv);
		this.pageIndex = this.pageIndex + 20;
		this.m_hiCurrentPage = currentPage;
		this.m_processedHiDataObject = [];
		getHiData(this);
	}
	else {
		MP_Util.LoadSpinner(tableDiv);
		this.pageIndex = this.pageIndex - 20;
		this.m_processedHiDataObject = [];
		this.m_hiCurrentPage = currentPage;
		getHiData(this);
	}
};

/*
 * This function takes in the reply from the sript and populates an array with data objects to be used by the component table
 * to display the HI data.
 * @param {m_responseData}
 *                reply - The Response Data object returned by scripReply.
 */
AllergyComponentWF.prototype.processHiResultsForRender = function(reply) {

	if (reply.HTTPREPLY && reply.HTTPREPLY.BODY.length) {
		var hiData = JSON.parse(reply.HTTPREPLY.BODY);
		this.m_hiData = hiData;
		var groups = hiData.groups;
		var jsSeverity;
		var len = groups.length;
		for (var i = len; i--;) {
			var currentGroup = groups[i];
			jsSeverity = "res-normal";
			var reactions = currentGroup.most_recent_allergy.reactions;
			var reactionLength = reactions.length;
			var allergyReactions = "";
			var reactionSeverityList = "";
			var comments = "--";
			var commentList = currentGroup.most_recent_allergy.comments;
			var commentLength = commentList.length;
			var sidePanelComments = [];
			var dateTime;
			var allergyCode = "--";
			for (reactionLength; reactionLength--;) {

				var severityDisplay = (reactions[reactionLength].severity_code !== null) ? reactions[reactionLength].severity_code.display : "--";
				var reactionDisplay = (reactions[reactionLength].reaction_code !== null) ? reactions[reactionLength].reaction_code.display : "--";
				if (reactionLength === 0) {
					allergyReactions += reactionDisplay;
					reactionSeverityList += reactionDisplay + "(" + severityDisplay + ")";
				}
				else {
					allergyReactions += reactionDisplay + ", ";
					reactionSeverityList += reactionDisplay + "(" + severityDisplay + ")" + ", ";
				}

				if (severityDisplay.toUpperCase() === "SEVERE" || severityDisplay.toUpperCase() === "ANAPHYLLAXIS") {
					jsSeverity = "res-severe";
				}
			}
			var displayDate = null;
			for (commentLength; commentLength--;) {
				dateTime = commentList[commentLength].datetime;
				var latestDate = new Date(dateTime);
				if (!displayDate || displayDate < latestDate) {
					displayDate = latestDate;
					comments = commentList[commentLength].text;
				}
				if (commentLength === 0) {
					sidePanelComments.push(commentList[commentLength].text);
				}
				else {
					sidePanelComments.push(commentList[commentLength].text + ", ");
				}
			}
			var sourceType = currentGroup.most_recent_allergy.source.type ? currentGroup.most_recent_allergy.source.type : "--";
			var sourceDescription = currentGroup.most_recent_allergy.source.partition_description + "(" + sourceType + ")";
			var currentOnsetDate = "--";
			dateTime = new Date();
			var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
			if (currentGroup.most_recent_allergy.onset_date && currentGroup.most_recent_allergy.onset_date !== "") {
				dateTime.setISO8601(currentGroup.most_recent_allergy.onset_date);
				currentOnsetDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
			}
			if (currentGroup.most_recent_allergy && currentGroup.most_recent_allergy.code && currentGroup.most_recent_allergy.code.id) {
				allergyCode = (currentGroup.most_recent_allergy.code.id.length > 0) ? currentGroup.most_recent_allergy.code.id : "--";
			}

			var allergyHiName = (currentGroup.name.length > 0) ? currentGroup.name : "--";
			var obj = {};
			obj.ALLERGY_NAME = "<span class =" + jsSeverity + ">" + allergyHiName + "(" + allergyCode + ")" + "</span>";
			obj.ALLERGY_NAME_SIDE_PANEL = allergyHiName;
			obj.AlLERGY_CODE = (currentGroup.most_recent_allergy.code.id.length > 0) ? currentGroup.most_recent_allergy.code.id : "--";
			obj.ALLERGY_SEVERITY = "<span class=" + jsSeverity + ">--</span>";
			obj.ALLERGY_REACTIONS = "<span class =" + jsSeverity + ">" + ((allergyReactions.length > 0) ? allergyReactions : "--") + "</span>";
			obj.ONSET_DATE = "<span class =" + jsSeverity + ">" + currentOnsetDate + "</span>";
			obj.ONSET_DATE_SIDE_PANEL = currentOnsetDate;
			obj.ALLERGY_COMMENTS = "<span class =" + jsSeverity + ">" + comments + "</span>";
			obj.ALLERGY_COMMENTS_SIDE_PANEL = (sidePanelComments.length > 0) ? sidePanelComments.join('') : "--";
			obj.ALLERGY_REACTIONS_SEVERITY = (reactionSeverityList.length > 0) ? reactionSeverityList : "--";
			obj.ALLERGY_SOURCE = (sourceDescription.length > 0) ? sourceDescription : "--";

			//setting text for render
			obj.SORT_ALL_NAME = allergyHiName;
			obj.SORT_ALL_SEVERITY = "";
			obj.SORT_ALL_REACTIONS = ((allergyReactions.length > 0) ? allergyReactions : "--");
			obj.SORT_ALL_DATE = currentOnsetDate;
			obj.SORT_ALL_COMMENTS = comments;
			this.m_processedHiDataObject[i] = obj;
		}
	}
};

/*
 *This function takes in the reply from the sript and sets m_hiDataValid and m_hiHadData to true or false depending on the response.
 * @param {m_responseData}
 *                reply - The Response Data object returned by scripReply.
 */
AllergyComponentWF.prototype.checkHiData = function(reply) {
	try {
		var hiStatus = reply.STATUS_DATA.SUBEVENTSTATUS[0].OPERATIONSTATUS;
		if (hiStatus === "S" && reply.HTTPREPLY) {
			var hiData = JSON.parse(reply.HTTPREPLY.BODY);
			if (hiData.total_results > 0) {
				this.m_hiDataValid = true;
				this.m_hiHasData = true;
				this.m_hiTotalResults = hiData.more_results;
			}
			else {
				this.m_hiDataValid = true;
				this.m_hiHasData = false;
			}
		}
		else {
			this.m_hiDataValid = false;
			this.m_hiHasData = false;
		}
	}
	catch (err) {
		this.m_hiDataValid = false;
		this.m_hiHasData = false;
		MP_Util.LogJSError(err, this, "allergy_o2.js", "checkHiData");
	}
};
/**
 * moveRowToTop: This function moves the new Allergy row at the top of the component table
 * @param { Object} allergyRow to be attached at the top of the component table
 *
 */
AllergyComponentWF.prototype.moveRowToTop = function(newRowObj, isNKARow) {
	if (newRowObj) {
		//newRowObj was passed in as a table row object
		if (newRowObj instanceof TableRow) {
			var tableRows = this.allergyTable.getRows();
			//patient entered data is displayed get the table rows from the other chart allergies group
			if (this.getPatientEnteredDataInd() && this.getOutsideRecordsPref() && !this.displayHiDataInd) {
				//find the group for the other charted allergies
				tableRows = this.allergyTable.getGroupById("GROUP_OTHER_CHART_ALLERGIES").getRows();
			}
			//add the new row as a first row in the group
			//find the index in which the row exists on
			var idx = $.inArray(newRowObj, tableRows);
			if (idx !== -1) {
				//remove the row from the table
				tableRows.splice(idx, 1);
			}
			//add the row to the top of the list
			tableRows.unshift(newRowObj);
			//refresh the table
			this.allergyTable.refresh();
		}
		else { //only chart allergies are displayed
			// Prepend row to top of list of rows in component table
			this.m_tableBodyContainer.children(0).prepend(newRowObj);
			// Call function to fix zebra stripes after shifting rows
			this.fixZebraStripes();
		}
		if (!isNKARow) {
			// Remove the highlight from the previous selected row and add highlight to the newly added row.
			var prevRow = this.m_tableBodyContainer.find(".selected");

			// Remove the background color of previous selected row.
			if (prevRow.length) {
				if (prevRow.hasClass("al-wf-selected-row selected")) {
					prevRow.removeClass("al-wf-selected-row selected");
				}
			}
			/*highlight the row*/
			//only chary allergies - the row would be a jQuery row
			if (newRowObj instanceof jQuery) {
				newRowObj.addClass("al-wf-selected-row selected");
			}
			else { //patient entered data displayed - the row is of type TableRow
				this.m_tableBodyContainer.find("dl[id*=newAllergyRow]").addClass("al-wf-selected-row selected");
			}

			// Make sure that that we scroll to the top so that the newly added row is visible.
			this.m_tableBodyContainer.scrollTop(0);
		}
	}
};

/**
 * fixZebraStripes: This function resets the zebra striping for the component table and highlights the top row
 *
 */
AllergyComponentWF.prototype.fixZebraStripes = function() {
	var tableBodyArr = this.m_tableBodyContainer.children(0).children();

	// redo zebra striping
	for (var i = 0; i < tableBodyArr.length; i++) {
		tableBodyArr[i].className = "result-info " + ((i % 2 === 0) ? "odd" : "even");
	}
};

/**
 * This function lets user to modify the allergy details
 *
 * @param {Object} Click event captured when clicked on the row to be modified
 * @param {Object} Current allergy details object which contains the currently saved values
 */
AllergyComponentWF.prototype.addNewAllergyDetails = function(allergyName, nomenclatureID) {
	try {
		CERN_EventListener.removeListener(null, "nomenclatureData" + this.m_compId, null, null);
		//Disable the search while adding a new allergy
		this.alSearchBar.disable();
		this.m_sidePanel.m_cornerCloseButton.hide();
		this.alSearchBar.activateCaption();
		//Initialize all the variables below
		var allergyI18N = i18n.discernabu.allergy_o2;
		var self = this;
		var modifyReactionDetailsHTML = "";
		var modifyDetailsOptionsHTML = "";
		var modifyDateControlHTML = "";
		var modifyCommentsTextAreaHTML = "";
		var actionHolderSP = $("#allergySPAction" + this.m_compId);
		var scrollContainerElem = $("#sidePanelScrollContainer" + this.m_compId);
		var resultListElem = "";
		var cancelBtnAction = "";
		var saveBtnAction = "";
		var nomenDataCnt = 0;
		var reactionNomenSearchBar = "";
		var optionsRenderedCnt = 0;
		var removeReactionItem = "";

		this.allergyRequest = new this.AllergyRequestJSON();
		this.pendingReactionList = [];
		this.mandatoryItemsEntryList = [];
		this.reactionsDuplicateList = [];

		//Get all the non changing values inserted first for Saving purposes
		this.allergyRequest.PERSON_ID = this.criterion.person_id;
		this.allergyRequest.ENCNTR_ID = this.criterion.encntr_id;
		this.allergyRequest.ALLERGY_ID = 0.0;
		this.allergyRequest.ALLERGY_INSTANCE_ID = 0.0;
		this.allergyRequest.SUBSTANCE_NOM_ID = nomenclatureID;
		if (this.isFreeTextAllergy) {
			this.allergyRequest.SUBSTANCE_FTDESC = allergyName;
		}
		//Listener to save NKA or NKMA allergies once data is collected
		CERN_EventListener.addListener(self, "nomenclatureData" + self.m_compId, function() {
			nomenDataCnt++;

			/**
			 * There are total of 3 items that will be returned by the callback functions
			 * Substance code, Reaction type and Status
			 * For both NKA and NKMA these fields are constant:
			 * SubstanceCode : Code for DRUG fetched from codeset 12020
			 * ReactionType: Code for ALLERGY fetched from codeset 12021
			 * Status: Code for ACTIVE fetched from codeset 12025
			 *
			 */
			if (nomenDataCnt === 3) {
				var substanceCD = MP_Util.GetCodeByMeaning(self.nomenSubstanceCodes, "DRUG").codeValue;
				var reactionTypeCD = MP_Util.GetCodeByMeaning(self.nomenReactionType, "ALLERGY").codeValue;
				var reactionStatusCD = MP_Util.GetCodeByMeaning(self.nomenReactionStatus, "ACTIVE").codeValue;

				self.allergyRequest.SUBSTANCE_TYPE_CD = substanceCD;
				self.allergyRequest.REACTION_CLASS_CD = reactionTypeCD;
				self.allergyRequest.STATUS_CD = reactionStatusCD;

				if (allergyName === "NKMA") {
					self.allergyRequest.SUB_CONCEPT_CKI = "CERNER!NKMA";
				}

				self.performAllergyRequest(self);
				return;
			}
		});
		// If documenting a NKA or NKMA allergy
		if (allergyName === "NKA" || allergyName === "NKMA") {
			self.isSavingNomenclatureItem = true;
			// Get Substance code, Reaction type and Status for documenting NKA or NKMA
			this.getNomenclatureDetails();
		}
		if (!this.isSavingNomenclatureItem) {
			this.m_sidePanel.setActionsAsHTML("<div id='allergySPAction" + this.m_compId + "' class='al-sp-actions al-wf-edit-mode'><div class='sp-button2 al-wf-cancel-button' id='allergyCancelButton" + this.m_compId + "'>" + i18n.CANCEL + "</div><div class='sp-button2 al-wf-save-button' id='allergySaveButton" + this.m_compId + "'>" + i18n.SAVE + "</div></div>");
			//Clear the scroll container values for a fresh edit mode state
			scrollContainerElem.html("");
			//Append the result list container
			scrollContainerElem.append("<div id='wf_al" + this.m_compId + "sidePanelResultList' class='al-wf-side-panel-result-list'></div>");
			resultListElem = $("#wf_al" + this.m_compId + "sidePanelResultList");
			//Remove any lingering spinners
			$("#sidePanel" + this.m_compId).find('.loading-screen').remove();
			//Remove any lingering listener
			CERN_EventListener.removeListener(null, "optionsRendered" + this.m_compId, null, null);
			//Register Cancel click action
			cancelBtnAction = $("#allergyCancelButton" + this.m_compId);
			cancelBtnAction.click(function() {
				//patient enterd data displayed on the screen
				if (!self.displayHiDataInd && self.getPatientEnteredDataInd() && self.getOutsideRecordsPref()) {
					//find the other chart allergies group
					var group = self.allergyTable.getGroupById("GROUP_OTHER_CHART_ALLERGIES");
					//remove the temporary row
					group.rows.shift();
				}
				else {//only chart allergies is displayed
					self.allergyTable.getRows().pop();
				}
				if (self.displayHiDataInd) {
					self.m_addSidePanelFlag = false;
				}
				self.allergyTable.refresh();
				self.addCellClickExtension();
				self.m_sidePanel.m_cornerCloseButton.show();
				self.alSearchBar.enable();
				self.m_sidePanel.m_cornerCloseButton.trigger('click');
			});
			//Register Save click action
			saveBtnAction = $("#allergySaveButton" + this.m_compId);
			//Disable Save button
			this.disableAllergySaveButton(saveBtnAction);
			saveBtnAction.click(function() {
				if (!saveBtnAction.prop("disabled")) {
					self.saveModifiedAllergy(self);
				}
			});
			//Load Spinner
			MP_Util.LoadSpinner("sidePanel" + this.m_compId);
			//Prepare Reactions container
			modifyReactionDetailsHTML += "<dl><dt><div class='al-wf-title-text'>" + allergyI18N.REACTION + "</div><div class='al-wf-side-panel-reaction' id='allergyReactionSearchContainer" + this.m_compId + "'></div><br /><div id='allergyReactionList" + this.m_compId + "'></div></dt><div class='sp-separator2 al-wf-side-panel-selector-spacing'>&nbsp;</div></dl>";
			resultListElem.append(modifyReactionDetailsHTML);

			//Listener to remove spinner once all fields are loaded
			CERN_EventListener.addListener(self, "optionsRendered" + self.m_compId, function() {
				optionsRenderedCnt++;
				/**
				 * There are total of 7 items that will be rendered in the side panel. The spinner will be shown unless all items render.
				 * Category, Severity, Reaction Type, Status, Source, Reason and Date Selector
				 */
				if (optionsRenderedCnt === 7) {
					//Remove spinner
					$("#sidePanel" + self.m_compId).find('.loading-screen').remove();
				}
			});
			//Prepare Options container
			modifyDetailsOptionsHTML += "<dl class='al-wf-side-panel-options-list'><dd id='allergyResultListSeverity" + this.m_compId + "'></dd><dd id='allergyResultListReactionType" + this.m_compId + "'></dd><dd id='allergyResultListCategory" + this.m_compId + "'></dd></dl><dl class='al-wf-side-panel-options-list'><dd id='allergyResultListStatus" + this.m_compId + "'></dd><dd id='allergyResultListReason" + this.m_compId + "'></dd><dd id='allergyResultListSource" + this.m_compId + "'></dd></dl>";
			modifyDateControlHTML += "<dl><dd id='allergyResultListDateControl" + this.m_compId + "'><div class='al-wf-title-text'>" + allergyI18N.ONSET + "</div>" + "</dd></dl>";
			modifyCommentsTextAreaHTML += "<dl><div class='sp-separator2 al-wf-side-panel-selector-spacing'>&nbsp;</div><dd id='allergyResultListComments" + this.m_compId + "' class='al-wf-side-panel-comments'><div class='al-wf-title-text'>" + allergyI18N.COMMENTS + "</div><div class='al-wf-side-panel-text-comment'><textarea class='al-wf-side-panel-text-input' id='allergyCommentsTextInput" + this.m_compId + "'/></div></dd></dl>";
			resultListElem.append(modifyDetailsOptionsHTML + modifyDateControlHTML + modifyCommentsTextAreaHTML);

			//Prepare the code set object
			this.getAllSourceCodes();
			this.m_sidePanel.setContents(scrollContainerElem, "wf_alContent" + this.m_compId);

			$("#dummySearchContainer" + this.m_compId).addClass("al-wf-remove-reaction");

			//Create a new nomenclature search bar
			this.prepareReactionSearch();

			//Register click events to the list of reactions
			removeReactionElem = $("#allergyReactionList" + this.m_compId);
			this.processRemoveReactions(this, removeReactionElem);

			//Prepare Date Control container
			this.renderAllergyDateControl();
			//Set keyup event for the Comment for Save validation
			$("#allergyCommentsTextInput" + this.m_compId).keyup(function(event) {
				self.enableAllergySaveButton(self, saveBtnAction);
			});
		}
	}
	catch (err) {
		logger.logJSError(err, this, "allergy_o2.js", "addNewAllergyDetails");
	}
};

/**
 * This function is used to bind events handlers for NKA/NKMA links
 * @return {null}
 **/
AllergyComponentWF.prototype.bindNKAEvents = function(nomenclatureItems) {
	var self = this;
	var componentId = this.m_compId;
	var nkaBtn = $("#documentNKABtn" + componentId);
	var nkmaBtn = $("#documentNKMABtn" + componentId);
	var nomenObj = {};
	var nomenItemsLength = nomenclatureItems.length;

	for (var i = 0; i < nomenItemsLength; i++) {
		var nomenItem = nomenclatureItems[i];
		if (nomenItem.CUSTOM_IDENTIFIER === "NKA") {
			nomenObj.nka = nomenItem;
		}
		else if (nomenItem.CUSTOM_IDENTIFIER === "NKMA") {
			nomenObj.nkma = nomenItem;
		}
	}

	nkaBtn.click(function() {
		self.nka = nomenObj.nka;
		self.addNewAllergyDetails(nomenObj.nka.CUSTOM_IDENTIFIER, nomenObj.nka.NOMEN_ID);

	});

	nkmaBtn.click(function() {
		self.nkma = nomenObj.nkma;
		self.addNewAllergyDetails(nomenObj.nkma.CUSTOM_IDENTIFIER, nomenObj.nkma.NOMEN_ID);
	});
};

/**
 * This function is used to render alert the actionability banner based on the bedrock preferences
 * @return {undefined}
 **/

AllergyComponentWF.prototype.renderActionabilityBanner = function() {
	var componentId = this.getComponentId();
	var docI18n = i18n.discernabu.allergy_o2;
	var warningBanner = new MPageUI.AlertBanner();
	warningBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.INFO);
	warningBanner.setPrimaryText(docI18n.ACTIONABILITY_BANNER);
	return warningBanner.render();
};

/**
 * This function is used to render alert banners based on the privs for the user
 * @return {udefined}
 **/
AllergyComponentWF.prototype.renderNKABanner = function(reply) {
	var componentId = this.getComponentId();
	var docI18n = i18n.discernabu.allergy_o2;
	var bannerHTML = "<div id='nkaBannerContainer" + componentId + "'>";
	var privsItemsLength = (reply.PRIVILEGES) ? reply.PRIVILEGES.length : 0;
	for (var i = 0; i < privsItemsLength; i++) {
		var currentPriv = reply.PRIVILEGES[i];
		if (currentPriv.PRIVILEGE_NAME === "VIEWALLERGY") {
			if (currentPriv.EXCEPTIONS.length > 0 || currentPriv.DEFAULT_IND === 0) {
				var warningBanner = new MPageUI.AlertBanner();
				warningBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.WARNING);
				warningBanner.setPrimaryText(docI18n.INSUFFICIENT_PRIVS_ALERT_PRIMARY);
				warningBanner.setSecondaryText(docI18n.INSUFFICIENT_PRIVS_ALERT_SECONDARY);
				bannerHTML = bannerHTML + warningBanner.render();
				break;
			}
		}
		if (currentPriv.PRIVILEGE_NAME === "UPDTALLERGY") {
			if (currentPriv.EXCEPTIONS.length === 0 && currentPriv.DEFAULT_IND === 0) {
				this.disableAllergySearch = true;
			}
			if (!reply.ALLERGY.length) {
				var errorBanner = new MPageUI.AlertBanner();
				errorBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
				errorBanner.setPrimaryText(docI18n.NO_ALLERGIES_FOUND_ALERT_PRIMARY);

				if (currentPriv.EXCEPTIONS.length === 0 && currentPriv.DEFAULT_IND === 0) {
					bannerHTML = bannerHTML + errorBanner.render();
					break;
				}
				else {
					errorBanner.setSecondaryText(docI18n.NO_ALLERGIES_FOUND_ALERT_SECONDARY);
					bannerHTML = bannerHTML + errorBanner.render();
					break;
				}
			}
		}

	}
	if (this.getActionabilityPriv()) {
		bannerHTML = bannerHTML + "</div>" + this.renderNKALinks(reply);
	}
	else {
		bannerHTML = bannerHTML + "</div>";
	}
	return bannerHTML;
};

/**
 * This function is used to render NKA/NKMA links if found in nomenclature items in the script reply
 * @return {undefined}
 **/
AllergyComponentWF.prototype.renderNKALinks = function(reply) {
	var componentId = this.getComponentId();
	var linksHTML = "<div id='nkaLinksContainer" + componentId + "' class = 'al-wf-nkaContainer'>";
	var linkNKA = "";
	var linkNKMA = "";
	var isNKA = false;
	var isNKMA = false;
	var nomenclatureIdObj = {};
	var docI18n = i18n.discernabu.allergy_o2;
	var nomenItemsLength = (reply.NOMENCLATURE_ITEMS) ? reply.NOMENCLATURE_ITEMS.length : 0;

	for (var i = 0; i < nomenItemsLength; i++) {
		var nomItem = reply.NOMENCLATURE_ITEMS[i];

		if (nomItem.CUSTOM_IDENTIFIER === "NKA") {
			linkNKA = "<a id='documentNKABtn" + componentId + "'>" + docI18n.NO_KNOWN_ALLERGIES + "</a>";
			isNKA = true;
			nomenclatureIdObj.nka = nomItem;
		}
		if (nomItem.CUSTOM_IDENTIFIER === "NKMA") {
			linkNKMA = "<a id='documentNKMABtn" + componentId + "'>" + docI18n.NO_KNOWN_MEDICATION_ALLERGIES + "</a>";
			nomenclatureIdObj.nkma = nomItem;
			isNKMA = true;
		}
	}

	if (isNKA && isNKMA) {
		return linksHTML + linkNKA + " | " + linkNKMA;
	}
	else if (isNKA) {
		return linksHTML + linkNKA;
	}
	else {
		return linksHTML + linkNKMA;
	}
};

/**
 * This function is used to reset NKA and NKMA rows to top of the component table.
 * @return {null}
 **/
AllergyComponentWF.prototype.resetNKARows = function() {
	var compId = this.m_compId;
	var isNKA = false;
	var nkaRow = null;
	var otherChartAllergiesGrp = null;
	var rows = null;
	var rowCnt = 0;
	//patient requests are being displayed
	if (this.getPatientEnteredDataInd() && this.getOutsideRecordsPref() && !this.displayHiDataInd) {
		//get the other chart allergies group
		otherChartAllergiesGrp = this.allergyTable.getGroupById("GROUP_OTHER_CHART_ALLERGIES");
		//cache the rows
		rows = otherChartAllergiesGrp.getRows();
		rowCnt = rows.length;
	}//other chart allergies are being displayed
	else {
		//cache the rows of the entire component table
		rows = this.allergyTable.getRows();
		rowCnt = rows.length;
	}
	//iterate over the rows and find the NKA/NKMA rows and move them to the top of the table
	for (var i = 0; i < rowCnt; i++) {
		var allergy = rows[i];
		//cache the row data for the allergy in context
		var allergyData = allergy.getResultData();
		if (allergyData.ALLERGY_CUSTOM_NAME) {
			if (allergyData.ALLERGY_CUSTOM_NAME === "NKA") {
				nkaRow = allergy;
				isNKA = true;
				this.moveRowToTop(nkaRow, true);
			}
			else if (allergyData.ALLERGY_CUSTOM_NAME === "NKMA" && !(isNKA)) {
				nkaRow = allergy;
				this.moveRowToTop(nkaRow, true);
			}
		}
	}
};
/**
 * resizeSidePanel this function will reset and resize the side panel whenever new content is added or when the component
 * resizes
 * @return {Undefined}
 */
AllergyComponentWF.prototype.resizeSidePanel = function(){
	var windowPadding = 70;
	var tableHeight = $("#wf_al" + this.m_compId + "table").height();
	var offsetHeight = $("#wf_alContent" + this.m_compId).height() - tableHeight;
	var maxViewHeight = ($("#vwpBody").height() - windowPadding) + "px";
	this.m_sidePanel.collapseSidePanel();
	this.m_sidePanel.setOffsetHeight(offsetHeight);
	this.m_sidePanel.setHeight(tableHeight + "px");
	this.m_sidePanel.setMinHeight(tableHeight + "px");
	this.m_sidePanel.setMaxHeight(maxViewHeight);
	this.m_sidePanel.expandSidePanel();
};
/**
 * resizeComponent This function will be used to resize the component whenever the hi data table is displayed
 * @return {undefined}
 */
AllergyComponentWF.prototype.resizeComponent = function() {
	MPageComponent.prototype.resizeComponent.call(this, null);
	//apply the resize logic to the side panel whenever the sidepanel is displayed and outside records hi data is not displayed
	if(this.m_showPanel && !this.displayHiDataInd){
		this.resizeSidePanel();
	}
	if (this.displayHiDataInd) {
		var calcHeight = "";
		var compHeight = 0;
		var compDOMObj = null;
		var compType = this.getStyles().getComponentType();
		var container = null;
		var contentBodyHeight = 0;
		var contentBodyObj = null;
		var miscHeight = 20;
		var viewHeight = 0;
		var sidePanelMiscHeight = 5;
		if (this.allergyRequest) {
			this.moveSidePanel();
			$("#wf_alContent" + this.m_compId).css("height", "");
		}
		container = $("#vwpBody");
		if (!container.length) {
			return;
		}
		viewHeight = container.height();

		//Make sure component is rendered
		compDOMObj = $("#" + this.getStyles().getId());
		if (!compDOMObj.length) {
			return;
		}

		//Get the overall height of the content-body section if available at this time
		contentBodyObj = compDOMObj.find(".content-body");
		if (contentBodyObj.length) {
			compHeight = compDOMObj.height();
			contentBodyObj.each(function() {
				contentBodyHeight = contentBodyHeight + $(this).height();
			});

			//Calculate the estimated max height of the components content-body elements
			calcHeight = (viewHeight - (compHeight - contentBodyHeight + miscHeight));
			this.calcDynamicSize(contentBodyObj, calcHeight);
		}
		//If the component has a component table, call the table's post-resize function
		if (this.getComponentTable()) {
			this.getComponentTable().updateAfterResize();
		}
		if (this.allergyHiTable) {
			this.allergyHiTable.updateAfterResize();
		}
	}
};

AllergyComponentWF.prototype.calcDynamicSize = function(contentBodyObj, viewHeight) {
	if (contentBodyObj.length === 1) {
		contentBodyObj.css("max-height", viewHeight).css("overflow-y", "auto");
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

AllergyComponentWF.prototype.setMemberVariables = function() {
	// Alias type String that is fetched from Bed Rock.
	this.aliasType = "";

	// Alias pool String that is fetched from Bed Rock.
	this.aliasPool = 0.0;

	// Test Uri String that is fetched from Bed Rock.
	this.hiTestURI = "";

	// Empi Look Up key that is fetched from Bed Rock.
	this.hiLookUpKey = "";

	// A boolean to indicate if the Hi Data is Present.
	this.m_hiHasData = false;

	// A data Object of the JSON Parsed
	this.m_hiData = null;

	// Total number of Hi Results present.
	this.m_hiTotalResults = 0;

	// Current Page number of the Hi Data being viewed
	this.m_hiCurrentPage = 0;

	// Pager Object
	this.m_hiPager = null;
	// Page Index of current Page
	this.pageIndex = 0;
	// A flag to indicate add data side panel is open.
	this.m_addSidePanelFlag = false;

	// A data indicator to indicate if hi data has any records.
	this.m_hiDataValid = false;

	// A data object where HI data will be stored
	this.m_processedHiDataObject = [];

	this.m_sidePanel = null;
	this.m_showPanel = false;
	this.m_sidePanelContainer = null;
	this.m_clickedRow = null;
	this.m_hiClickedRow = null;
	if (this.allergyRequest) {
		this.allergyRequest = null;
		$("#wf_alContent" + this.m_compId).css("height", "");
	}
};

AllergyComponentWF.prototype.moveSidePanel = function() {
	var sidePanel = "wf_al" + this.m_compId + "sidePanelContainer";
	var sidePanelDiv = document.getElementById(sidePanel);
	if (sidePanelDiv.parentNode) {
		sidePanelDiv.parentNode.removeChild(sidePanelDiv);
	}
	var allergyDiv = "al-wf-allergy-full" + this.m_compId;
	document.getElementById(allergyDiv).appendChild(sidePanelDiv);
};

/*
 * This function will return count of non nomenclature rows from result set
 *
 * @param {JSON} results- The result set for all retrieved allergies from MP_GET_ALLERGIES
 * @return {Number} - The count for non-nomenclature rows from result set
 */
AllergyComponentWF.prototype.getNonNomenAllergyCount = function(results) {
	var nonNomenResultCount = 0;
	var resultCnt = results.length;
	for (var i = 0; i < resultCnt; i++) {
		var allergy = results[i];
		if (allergy.ALLERGY_CUSTOM_NAME !== "NKA" && allergy.ALLERGY_CUSTOM_NAME !== "NKMA") {
			nonNomenResultCount++;
		}
	}
	return nonNomenResultCount;
};

/**
 * getNKAData: This function fetches data required to document NKA or NKMA problems
 *
 */
AllergyComponentWF.prototype.getNomenclatureDetails = function() {
	// Set Substance code
	var substanceCodesCB = function(result) {
		this.nomenSubstanceCodes = MP_Util.LoadCodeListJSON(result);
		CERN_EventListener.fireEvent(null, this, "nomenclatureData" + this.m_compId, null);
	};
	// Set reaction type
	var reactionTypeCB = function(result) {
		this.nomenReactionType = MP_Util.LoadCodeListJSON(result);
		CERN_EventListener.fireEvent(null, this, "nomenclatureData" + this.m_compId, null);
	};
	// Set reaction status
	var reactionStatusCB = function(result) {
		this.nomenReactionStatus = MP_Util.LoadCodeListJSON(result);
		CERN_EventListener.fireEvent(null, this, "nomenclatureData" + this.m_compId, null);
	};

	//Get the precision codes from code set 12020.0
	MP_Util.GetCodeSetAsync(12020, substanceCodesCB.bind(this));

	//Get the precision codes from code set 12021.0
	MP_Util.GetCodeSetAsync(12021, reactionTypeCB.bind(this));

	//Get the precision codes from code set 12025.0
	MP_Util.GetCodeSetAsync(12025, reactionStatusCB.bind(this));

};
