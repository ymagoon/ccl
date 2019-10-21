function EducationAndCounselingComponentWFStyle() {
	this.initByNamespace("ec-wf");
}

EducationAndCounselingComponentWFStyle.inherits(ComponentStyle);

/**
 * The Education Counseling component will retrieve all education and counseling data associated
 * to the patient.
 *
 * @param criterion {Criterion}
 *            The Criterion object which contains information needed to render the component.
 */
function EducationAndCounselingComponentWF(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new EducationAndCounselingComponentWFStyle());
	this.setComponentLoadTimerName("USR:MPG.EDUCATIONANDCOUNSELING.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.EDUCATIONANDCOUNSELING.O2 - render component");
	this.setIncludeLineNumber(false);
	this.eduCounselingPFId = 0.0;

	// The state of the trimester groups - Whether it is expanded or collapsed.
	// By default all the groups are expanded and hence collapsed is set to false.
	this.firstTrimesterCollapsed = false;
	this.secondTrimester1Colapsed = false;
	this.thirdTrimesterCollapsed = false;

	// Flag for pregnancy onset date lookback timeframe
	this.setPregnancyLookbackInd(true);

	// Flag for resource required
	this.setResourceRequired(true);

	// Event Listener - To update the component whenever clinical information is added/updated from this
	//component using "+" button.
	CERN_EventListener.addListener(this, EventListener.EVENT_CLINICAL_EVENT, this.retrieveComponentData, this);

	// Event Listener - To update the component whenever pregnancy Information is available or if pregnanacy
	// information is updated.
	CERN_EventListener.addListener(this, "pregnancyInfoAvailable", this.retrieveComponentData, this);
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object.
 */
EducationAndCounselingComponentWF.prototype = new MPageComponent();
EducationAndCounselingComponentWF.prototype.constructor = MPageComponent;

/**
 * Map the Education and Counseling option 2 object to the bedrock filter mapping so the
 * architecture will know what object to create when it finds the "WF_PREG_EC" filter.
 */
MP_Util.setObjectDefinitionMapping("WF_PREG_EC", EducationAndCounselingComponentWF);

EducationAndCounselingComponentWF.prototype.RetrieveRequiredResources = function() {
	// Check to see if the pregnancyInfo object is available to use
	var pregInfoSR = MP_Resources.getSharedResource("pregnancyInfo");
	if (pregInfoSR && pregInfoSR.isResourceAvailable()) {
		this.retrieveComponentData();
	}
	else {
		// This component already listens for the pregnancyInfoAvailable event,
		// so it will load when the SharedResource is available.
		PREGNANCY_BASE_UTIL_O1.LoadPregnancyData(this.getCriterion());
	}
};

/**
 * This method sets the powerform id for Education and Counseling component to a value provided
 * in the bedrock setting.
 *
 * @param {integer} powerFormId - powerform id of Education and Counseling component
 */
EducationAndCounselingComponentWF.prototype.setEdCounselingPF = function(powerFormId) {
	this.eduCounselingPFId = powerFormId;
};

/**
 * This method sets the state of the group first trimester to expanded or collapse
 *
 * @param {boolean} collapse - state of the group first trimester
 */
EducationAndCounselingComponentWF.prototype.setFirstTrimesterState = function(collapse) {
	this.firstTrimesterCollapsed = collapse;
};

/**
 * This method sets the state of the group second trimester to expanded or collapse
 *
 * @param {boolean} collapse - state of the group second trimester
 */
EducationAndCounselingComponentWF.prototype.setSecondTrimesterState = function(collapse) {
	this.secondTrimesterCollapsed = collapse;
};

/**
 * This method sets the state of the group third trimester to expanded or collapse
 *
 * @param {boolean} collapse - state of the group third trimester
 */
EducationAndCounselingComponentWF.prototype.setThirdTrimesterState = function(collapse) {
	this.thirdTrimesterCollapsed = collapse;
};

/**
 * Creates the filter mappings that will be used when loading this component bedrock settings.
 */
EducationAndCounselingComponentWF.prototype.loadFilterMappings = function() {
	//Add the filterMappings for launching adhoc/iview on clicking the "+" button.
	this.addFilterMappingObject("WF_PREG_EC_PF", {
		setFunction : this.setEdCounselingPF,
		type : "NUMBER",
		field : "PARENT_ENTITY_ID"
	});

	// Add the filter mappings for the group first trimester
	this.addFilterMappingObject("WF_PREG_EC_TRIMESTER1_DISPLAY", {
		setFunction : this.setFirstTrimesterState,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});

	// Add the filter mappings for the group second trimester
	this.addFilterMappingObject("WF_PREG_EC_TRIMESTER2_DISPLAY", {
		setFunction : this.setSecondTrimesterState,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});

	// Add the filter mappings for the group third trimester
	this.addFilterMappingObject("WF_PREG_EC_TRIMESTER3_DISPLAY", {
		setFunction : this.setThirdTrimesterState,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});
};

/**
 * This method launches the powerform on selecting the plus label of Education and Counseling
 *  component.
 */
EducationAndCounselingComponentWF.prototype.openTab = function() {
	var criterion = this.getCriterion();
	var powerFormId = (this.eduCounselingPFId) ? this.eduCounselingPFId : 0.0;
	var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + powerFormId + "|0|0";
	MPAGES_EVENT("POWERFORM", paramString);
	CERN_EventListener.fireEvent(null, this, EventListener.EVENT_CLINICAL_EVENT);
};

/**
 * It creates the necessary parameter array for the data acquisition and makes the necessary
 * script call to retrieve the education and counseling data.
 *
 * @dependencies Script: MP_PREG_ED_COUNSELINGS
 */
EducationAndCounselingComponentWF.prototype.retrieveComponentData = function() {
	var component = this;
	var sendAr = [];
	var criterion = component.getCriterion();
	var educationAndCounselingi18n = i18n.discernabu.education_counseling_o2;
	var encntrs = criterion.getPersonnelInfo().getViewableEncounters();
	var encntrVal = (encntrs) ? "value(" + encntrs + ")" : "0.0";
	var firstTrimesterES = "0.0";
	var groups = null;
	var secondTrimesterES = "0.0";
	var thirdTrimesterES = "0.0";
	var groupIndex = 0;
	var groupLength = 0;
	var countText = "";

	// Get the pregnancy information from the shared resource object
	var pregInfoSR = MP_Resources.getSharedResource("pregnancyInfo");

	// Object used to get pregnancy information like Pregnancy Id, EDD, EGA, etc,.
	var pregInfoObj = null;

	// Unique ID of a pregancy, if its >0 indicated patient is pregnant
	var pregnancyId = 0.0;

	var patientGenderInfo = criterion.getPatientInfo().getSex();

	// Check to make sure the patient is a female with an active pregnancy
	if (patientGenderInfo === null || patientGenderInfo.meaning === null || patientGenderInfo.meaning !== "FEMALE") {
		// Male patient so just show a disclaimer
		messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + educationAndCounselingi18n.NOT_FEMALE + "</span></h3><span class='res-none'>" + educationAndCounselingi18n.NOT_FEMALE + "</span>";
		this.finalizeComponent(messageHTML, countText);
		return;
	}
	else if (pregInfoSR && pregInfoSR.isResourceAvailable()) {
		pregInfoObj = pregInfoSR.getResourceData();
		pregnancyId = pregInfoObj.getPregnancyId();

		if (pregnancyId === -1) {
			// Error occurred while retrieving pregnancy information
			messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + educationAndCounselingi18n.PREG_DATA_ERROR + "</span></h3><span class='res-none'>" + educationAndCounselingi18n.PREG_DATA_ERROR + "</span>";
			this.finalizeComponent(messageHTML, countText);
			return;
		}
		else if (!pregnancyId) {
			// Female patient with no active pregnancy. Show disclaimer and finalize the component.
			messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + educationAndCounselingi18n.NO_ACTIVE_PREG + "</span></h3><span class='res-none'>" + educationAndCounselingi18n.NO_ACTIVE_PREG + "</span>";
			this.finalizeComponent(messageHTML, countText);
			return;
		}
		else {
			groups = component.getGroups();
			groupLength = (groups !== null) ? groups.length : 0;

			for ( groupIndex = 0; groupIndex < groupLength; groupIndex++) {
				if (groupIndex === 0) {// first trimester
					firstTrimesterES = MP_Util.CreateParamArray(groups[0].getEventSets(), 1);
				}
				else if (groupIndex === 1) {// second trimester
					secondTrimesterES = MP_Util.CreateParamArray(groups[1].getEventSets(), 1);
				}
				else {// third trimester
					thirdTrimesterES = MP_Util.CreateParamArray(groups[2].getEventSets(), 1);
				}
			}

			sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", encntrVal, firstTrimesterES, secondTrimesterES, thirdTrimesterES, criterion.ppr_cd + ".0", pregInfoObj.getLookBack());

			MP_Core.XMLCclRequestWrapper(this, "MP_PREG_ED_COUNSELINGS", sendAr, true);
		}
	}
};

/**
 * Renders the Education and Counseling component visuals. This method will be called
 * after Education and Counseling has been initialized and setup.
 *
 * @param recordData -
 *            has the information about the Education and Counseling of a patient.
 */
EducationAndCounselingComponentWF.prototype.renderComponent = function(recordData) {
	var timerRenderComponent = MP_Util.CreateTimer(this.getComponentRenderTimerName(), this.getCriterion().category_mean);
	var component = this;
	var compId = this.getComponentId();
	var criterion = this.getCriterion();
	var educationAndCounselingi18n = i18n.discernabu.education_counseling_o2;
	var eduCounselingCompletedArrayLength = recordData.COMPLETED.length;
	
	var slaTimer = MP_Util.CreateTimer("CAP:MPG.EDUCATIONANDCOUNSELING.O2 - rendering component");
	
	if (slaTimer) {
		slaTimer.SubtimerName = criterion.category_mean;         
		slaTimer.Stop();
	}

	try{
		// Contains the Education and Counseling results for the events which are mapped in bedrock
		var completedArray = null;

		// Get the number of events completed for each trimester.
		var completedEventCount = null;

		// Contains the result of a particular event
		var categoryResultsArray = null;

		// Contains the date when Education and Counseling has been documented for a patient
		var documentedDate = null;

		// Holds the component HTML data
		var eduCounsHTML = "";

		// Contains the array of Education and Counseling results
		var arrTrimester = [];
		
		// Indicates the trimester groups contains the results or not. If there are no results, PRG contains
		// results of event names which is mapped in bedrock and we need to show no result found disclaimer.
		var isTrimesterResultsDocumented = false;

		// Education and Counseling table and column objects
		var eduCounsTable = null;
		var eduTopicColumn = null;
		var resultColumn = null;
		var dateDocumentedColumn = null;

		// Groups which holds the trimester details in the table
		var trimester1 = null;
		var trimester2 = null;
		var trimester3 = null;

		// Group header - Text displayed in each group
		var trimester1Hdr = educationAndCounselingi18n.FIRST_TRIMESTER;
		var trimester2Hdr = educationAndCounselingi18n.SECOND_TRIMESTER;
		var trimester3Hdr = educationAndCounselingi18n.THIRD_TRIMESTER;

		// Loop for completed events i.e., events which are mapped in bedrock as well as charted
		// the results for it.
		for (var i = 0; i < eduCounselingCompletedArrayLength; i++) {
			completedArray = recordData.COMPLETED[i];
			completedEventCount = completedArray.LEVENTCNT;
			arrTrimester[i] = [];

			if (completedEventCount !== 0) {
				isTrimesterResultsDocumented = true;
				// Loop for each each event and get all the results of an event that will shown in
				// Education and Counseling table UI.
				for (var j = 0; j < completedEventCount; j++) {
					categoryResultsArray = completedArray.CATEGORYRESULTS[j];
					documentedDate = this.getFormattedDateTime(categoryResultsArray.SEVENTDATE);

					arrTrimester[i].push({
						EducationTopic : categoryResultsArray.SEVENTDISPLAY,
						Result : categoryResultsArray.SEVENTRESULT,
						DocumentedDate : documentedDate
					});
				}
			}
		}
		
		if(isTrimesterResultsDocumented) {
			// Build the education and counseling table
			eduCounsTable = new ComponentTable();
			eduCounsTable.setNamespace(this.getStyles().getNameSpace());
			eduCounsTable.setZebraStripe(true);

			// Contains the education topic charted
			eduTopicColumn = new TableColumn();
			eduTopicColumn.setColumnId("EduName" + compId);
			eduTopicColumn.setCustomClass("ec-wf-table-header-column");
			eduTopicColumn.setColumnDisplay(educationAndCounselingi18n.EDUCATION_TOPIC);
			eduTopicColumn.setRenderTemplate('${EducationTopic}');

			// Contains the charted results for the education.
			resultColumn = new TableColumn();
			resultColumn.setColumnId("Result" + compId);
			resultColumn.setCustomClass("ec-wf-table-header-column");
			resultColumn.setColumnDisplay(educationAndCounselingi18n.RESULTS);
			resultColumn.setRenderTemplate('${Result}');

			// Contains the date the education has been documented
			dateDocumentedColumn = new TableColumn();
			dateDocumentedColumn.setColumnId("DateDocumented" + compId);
			dateDocumentedColumn.setCustomClass("ec-wf-table-header-column");
			dateDocumentedColumn.setColumnDisplay(educationAndCounselingi18n.DATE_DOCUMENTED);
			dateDocumentedColumn.setRenderTemplate('${DocumentedDate}');

			eduCounsTable.addColumn(eduTopicColumn);
			eduCounsTable.addColumn(resultColumn);
			eduCounsTable.addColumn(dateDocumentedColumn);

			trimester1 = new TableGroup();
			trimester1.setDisplay(trimester1Hdr).setGroupId("EDU_COUNS1" + compId).setShowCount(false);
			trimester1.bindData(arrTrimester[0]);

			trimester2 = new TableGroup();
			trimester2.setDisplay(trimester2Hdr).setGroupId("EDU_COUNS2" + compId).setShowCount(false);
			trimester2.bindData(arrTrimester[1]);

			trimester3 = new TableGroup();
			trimester3.setDisplay(trimester3Hdr).setGroupId("EDU_COUNS3" + compId).setShowCount(false);
			trimester3.bindData(arrTrimester[2]);

			eduCounsTable.addGroup(trimester1);
			eduCounsTable.addGroup(trimester2);
			eduCounsTable.addGroup(trimester3);

			this.setComponentTable(eduCounsTable);
			eduCounsHTML = eduCounsTable.render();

			this.finalizeComponent(eduCounsHTML, "");

			// Expanding or collapsing the groups based on the default value set in the bedrock
			if (this.firstTrimesterCollapsed) {
				eduCounsTable.collapseGroup("EDU_COUNS1" + compId);
			}
			if (this.secondTrimesterCollapsed) {
				eduCounsTable.collapseGroup("EDU_COUNS2" + compId);
			}
			if (this.thirdTrimesterCollapsed) {
				eduCounsTable.collapseGroup("EDU_COUNS3" + compId);
			}

			// Hiding the Education and Counseling group result content if there are no results for it.
			if (!arrTrimester[0].length) {
				$("#ec-wf\\:EDU_COUNS1" + compId + "\\:content").addClass("ec-wf-table-section-content");
			}
			if (!arrTrimester[1].length) {
				$("#ec-wf\\:EDU_COUNS2" + compId + "\\:content").addClass("ec-wf-table-section-content");
			}
			if (!arrTrimester[2].length) {
				$("#ec-wf\\:EDU_COUNS3" + compId + "\\:content").addClass("ec-wf-table-section-content");
			}
		}
		else {
			eduCounsHTML = "<span class='res-none'>" + educationAndCounselingi18n.NO_RESULTS_FOUND + "</span>";
			this.finalizeComponent(eduCounsHTML, "");
		}
	}
	catch(err) {
		MP_Util.LogJSError(err, this, "education-counseling-o2.js", "renderComponent");
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
 * Returns the locale Formatted DateTime.
 *
 * @param {string} dateTime - DateTime in format of "YYYY-MM-DDTHH:MM:SSZ"
 *
 * @returns {string} locale Formatted DateTime if date is not null.
 */
EducationAndCounselingComponentWF.prototype.getFormattedDateTime = function(dateTime) {
	if (!dateTime) {
		return "--";
	}

	var dateTimeObj = new Date();
	dateTimeObj.setISO8601(dateTime);
	return dateFormat(dateTimeObj, dateFormat.masks.mediumDate);
};
