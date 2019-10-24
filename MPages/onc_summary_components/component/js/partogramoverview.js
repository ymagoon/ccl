function PartogramOverviewComponentWFStyle() {
	this.initByNamespace("parto-overview-wf");
}
PartogramOverviewComponentWFStyle.prototype = new ComponentStyle();
PartogramOverviewComponentWFStyle.prototype.constructor = ComponentStyle;

/**
 * The Partogram Overview Component displays important high level details about the patient’s health, labor history and current labor.
 *
 *  @param criterion {Criterion} - The Criterion object which contains information needed to render the component.
 */
function PartogramOverviewComponentWF(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new PartogramOverviewComponentWFStyle());
	this.setComponentLoadTimerName("USR:MPG.PARTOGRAMOVERVIEW.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.PARTOGRAMOVERVIEW.O2 - render component");
	this.setImageFolderPath(criterion.static_content + '/images/');
	this.setRefreshEnabled(false);
	// Flag for resource required
	this.setResourceRequired(true);
	this.epiduralData = [
		[],
		[],
		[],
		[]
	];
	this.oxytocinData = [];
	this.loadTimer = null;
}

PartogramOverviewComponentWF.prototype = new MPageComponent();
PartogramOverviewComponentWF.prototype.constructor = MPageComponent;
MP_Util.setObjectDefinitionMapping("WF_PARTO_OVERVIEW", PartogramOverviewComponentWF);

PartogramOverviewComponentWF.prototype.isEpiduralDiscontinued = false;
PartogramOverviewComponentWF.prototype.isOxytocinStopped = false;
PartogramOverviewComponentWF.prototype.ROM_CRITICAL_VALUE = 12;
PartogramOverviewComponentWF.prototype.MAX_ALLOWED_BABIES = 3;
PartogramOverviewComponentWF.prototype.HOVER_KEY = "OVERVIEW";
/**
 * DISPLAY_STATUS, an array of booleans representing the columns which are configured by the user.
 * Column0 => GESTATION INFORMATION
 * Column1 => GRAVIDA PARIDA
 * Column2 => GBS STATUS
 * Column3 => BLOOD TYPE
 * Column4 => LABOR ONSET
 * Column5 => MEOWS
 */
PartogramOverviewComponentWF.prototype.DISPLAY_STATUS = [true, true, true, true, true, true];

/**
 * @method Returns the image folder path
 */
PartogramOverviewComponentWF.prototype.getImageFolderPath = function() {
	return this.imageFolderPath;
};
/**
 * @method Stores the path to where images are stored in the static content
 *         folder.
 */
PartogramOverviewComponentWF.prototype.setImageFolderPath = function(path) {
	this.imageFolderPath = path;
};

/**
 * @method gets the reference to the recordData object
 * @return the reference to recordData object
 */
PartogramOverviewComponentWF.prototype.getRecordData = function() {
	return this.recordData;
};

/**
 * @method Store a reference to the recordData object
 * @param {object} plot - A reference to the recordData object
 */
PartogramOverviewComponentWF.prototype.setRecordData = function(data) {
	this.recordData = data;
};

/**
 * Retrieves the partogram information from the shared resources to check whether the patient is
 * in active labor or not.
 */
PartogramOverviewComponentWF.prototype.RetrieveRequiredResources = function() {
	// Check to see if this component is part of a partogram view, if not, no need to check
	// the partogramInfo object
	var criterion = this.getCriterion();
	var messageHTML = '';
    if (PartogramBaseComponent.prototype.getPartogramViewID() !== criterion.category_mean) {
    	messageHTML = "<span class='res-none'>" + i18n.discernabu.partogrambaseutil_o2.NOT_PARTOGRAM_VIEW + "</span>";
      	this.finalizeComponent(messageHTML, "");
    	return;
    }
    
    // Check to see if patient is a female; if not, no need to check
	// the partogramInfo object as it was not loaded by the workflow code
	var patientGender = criterion.getPatientInfo().getSex();
	if (patientGender === null || patientGender.meaning === null || patientGender.meaning !== "FEMALE") {
		messageHTML = "<span class='res-none'>" + i18n.discernabu.partogrambaseutil_o2.NOT_FEMALE + "</span>";
		this.finalizeComponent(messageHTML, "");
		return;
	}
        
	// Check to see if the partogramInfo object is available to use
    var partogramInfoSR = MP_Resources.getSharedResource("partogramInfo");
    if (partogramInfoSR && partogramInfoSR.isResourceAvailable() && !jQuery.isEmptyObject(partogramInfoSR.getResourceData()))  {
        this.retrieveComponentData();
    }
    else {
        // Add a listener so we can refresh the component if partogram info updates
        CERN_EventListener.addListener(this, "partogramInfoAvailable", this.retrieveComponentData, this);
    }
};

/**
 * Sets the pregnancy type. Callback method for the framework to load the filter value.
 */
PartogramOverviewComponentWF.prototype.setPregDescFilter = function(val) {
	this.pregDescColored = val || false;
};

/**
 * Sets the ROM text colored variable. Callback method for the framework to load the filter value.
 * This variable will be used to decide whether to color the ROM Value if the time has past 12hrs.
 */
PartogramOverviewComponentWF.prototype.setROMTextColorChoice = function(val) {
	this.ROMTextColored = val || false;
};

/**
 * Loads the filter mappings for all the filters in the overview component.
 */
PartogramOverviewComponentWF.prototype.loadFilterMappings = function() {
	var component = this;
	this.addFilterMappingObject("WF_PARTO_OVERVIEW_PREG_DESC", {
		setFunction: component.setPregDescFilter,
		type: "BOOLEAN",
		field: "FREETEXT_DESC"
	});
	
	this.addFilterMappingObject("WF_PARTO_OVERVIEW_ROM_COLOR", {
		setFunction: component.setROMTextColorChoice,
		type: "BOOLEAN",
		field: "FREETEXT_DESC"
	});
};

/**
 * @method Opens IView 
 */
PartogramOverviewComponentWF.prototype.openIView = function() {
	var criterion = this.getCriterion();
	try{
		var launchIViewApp = CERN_Platform.getDiscernObject("TASKDOC");
		launchIViewApp.LaunchIView("", "", "", criterion.person_id, criterion.encntr_id);
	} catch (err) { 
		MP_Util.LogJSError(err, null, "partogramoverview.js", "openIView");
	}
};

/**
 * @method It creates the necessary parameter array for the data acquisition and makes the
 * necessary script call to retrieve the overview component's data
 */
PartogramOverviewComponentWF.prototype.retrieveComponentData = function() {
	try {
		var criterion = this.getCriterion();
		var compId = this.getComponentId();
		var component = MP_Util.GetCompObjById(compId);
		var messageHTML = '';
		
		// check requirements before we attempt to retrieve data
		// Check to see if workflow is a Partogram Workflow
		if (PartogramBaseComponent.prototype.getPartogramViewID() !== criterion.category_mean) {
			messageHTML = "<span class='res-none'>" + i18n.discernabu.partogrambaseutil_o2.NOT_PARTOGRAM_VIEW + "</span>";
			this.finalizeComponent(messageHTML, "");
			return;
		}
			
		// Check to see if patient is a female; display error message and finalize the component.
		var partogramInfoSR = MP_Resources.getSharedResource("partogramInfo");
		var patientGender = criterion.getPatientInfo().getSex();
		if (patientGender === null || patientGender.meaning === null || patientGender.meaning !== "FEMALE") {
			messageHTML = "<span class='res-none'>" + i18n.discernabu.partogrambaseutil_o2.NOT_FEMALE + "</span>";
			this.finalizeComponent(messageHTML, "");
			return;
		}
		var resourceData = partogramInfoSR.getResourceData();
		var pregnancyId = resourceData.getPregnancyId();	
		if (pregnancyId <= 0) {
			// Female patient with no active pregnancy; display error message and finalize the component.
			messageHTML = "<span class='res-none'>" + i18n.discernabu.partogrambaseutil_o2.PREGNANCY_NOT_FOUND + "</span>";
			this.finalizeComponent(messageHTML, "");
			return;
		}
			
		var laborOnsetDate = resourceData.getLaborOnsetDate();
		if (!laborOnsetDate) {
			// Female patient with active pregnancy but with no labor onset documented; display error message and finalize the component.
			messageHTML = "<span class='res-none'>" + i18n.discernabu.partogrambaseutil_o2.LABOR_ONSET_NOT_FOUND + "&nbsp;<a href=# class='partogram-overview-addlabor-wf-info-hl' id='addLaborOnset" + compId + "'>" + i18n.discernabu.partogrambaseutil_o2.ADD_LABOR_ONSET + "</a></span>";
			this.finalizeComponent(messageHTML, "");

			var addLaborOnset = $("#addLaborOnset" + compId);
			addLaborOnset.click(function() {
				component.openIView();
			});
			return;
		}
		
		var sendAr = [];
		this.loadTimer = new RTMSTimer(this.getComponentLoadTimerName());
		var renderTimer = new RTMSTimer(this.getComponentRenderTimerName());
		var partogramStartDate = resourceData.getPartogramStartDate();
		var pregnancyOnsetDate = resourceData.getPregnancyOnsetDate();
        partogramStartDate = MP_Util.CreateDateParameter(partogramStartDate);
		pregnancyOnsetDate = MP_Util.CreateDateParameter(pregnancyOnsetDate);
		sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.position_cd + ".0", criterion.ppr_cd + ".0", criterion.encntr_id + ".0");
		sendAr.push("^" + partogramStartDate + "^");
		sendAr.push("^" + pregnancyOnsetDate + "^");
		var groupNameMap = {};
        var groupNames = ["WF_PARTO_OVERVIEW_GBS_LAB","WF_PARTO_OVERVIEW_GBS_EXT", "WF_PARTO_OVERVIEW_BLOODTYPE", "WF_PARTO_OVERVIEW_ABO", "WF_PARTO_OVERVIEW_RHTYPE", "WF_PARTO_OVERVIEW_ROM", "WF_PARTO_OVERVIEW_BABY_INFO", "WF_PARTO_OVERVIEW_MEOWS", "WF_PARTO_OVERVIEW_M_INFO", "WF_PARTO_OVERVIEW_OXYTOCIN"];
        //initialize the event code value for each filter
        for (i = 0; i < groupNames.length; i++) {
            groupNameMap[groupNames[i]] = 0;
        }
		
		var groups = this.getGroups();
        for (i = 0; i < groups.length; i++) {
            var group = groups[i];
            if (group instanceof MPageEventCodeGroup) {
                groupNameMap[group.m_groupName] = group.getEventCodes();
            }
        }
		//do not show the columns if they aren't mapped
		var columnMappings = this.getSection1ColumnMapping();
		if (groupNameMap.WF_PARTO_OVERVIEW_GBS_LAB === 0 && groupNameMap.WF_PARTO_OVERVIEW_GBS_EXT === 0) {
			this.DISPLAY_STATUS[columnMappings.GBS_RESULT] = false;
		}
		if (groupNameMap.WF_PARTO_OVERVIEW_BLOODTYPE === 0 && groupNameMap.WF_PARTO_OVERVIEW_ABO === 0 && groupNameMap.WF_PARTO_OVERVIEW_RHTYPE === 0) {
			this.DISPLAY_STATUS[columnMappings.BLOOD_TYPE] = false;
		}
		if (groupNameMap.WF_PARTO_OVERVIEW_MEOWS === 0) {
			this.DISPLAY_STATUS[columnMappings.MEOWS] = false;
		}
		
        for (i = 0; i < groupNames.length; i++) {
            sendAr.push(MP_Util.CreateParamArray(groupNameMap[groupNames[i]], 1));
        }
		
		var scriptRequest = new ComponentScriptRequest();
		scriptRequest.setProgramName("MP_GET_PARTOGRAM_OVERVIEW");
		scriptRequest.setParameterArray(sendAr);
		scriptRequest.setComponent(this);
		scriptRequest.setLoadTimer(this.loadTimer);
		scriptRequest.setRenderTimer(renderTimer);
		scriptRequest.performRequest();
	} catch (err) {
		MP_Util.LogJSError(err, this, "partogramoverview.js", "retrieveComponentData");
	}
};

/**
 * Updates the labor onset date column in top section of the overview component.
 * The fields show the time spent from the labor onset date till the current time.
 */
PartogramOverviewComponentWF.prototype.updateLaborOnsetDate = function() {
	var laborOnsetDate = this.partogramInfoObj.getLaborOnsetDate();
	var compID = this.getComponentId();
	if (laborOnsetDate) {
		laborOnsetDate = laborOnsetDate.getTime();
		var timeSpent = this.getTimeSpent(laborOnsetDate);
		$('#partoOverviewLaborOnsetPart1Hrs' + compID).text(timeSpent[0] + '');
		$('#partoOverviewLaborOnsetPart1Mins' + compID).text(timeSpent[1] + '');
	}
};

/**
 * A utility function to find the time spent in hours and minutes between two times.
 * @param fromTime {Required}: the from time in milliseconds.
 * @param toTime {Optional}: The to time in milliseconds. If not specified, it will default to Partogram's last load time.
 * @return An array of size 2, 1st element being the time spent in hours, 2nd element would be the trailing minutes from the last whole hour.
 */
PartogramOverviewComponentWF.prototype.getTimeSpent = function(fromTime, toTime) {
	toTime = toTime || PARTO_GRAPH_BASE.getPartogramLastLoadTime(); 
	var ONE_MINUTE_MS = 1 * 60 * 1000;
	var ONE_HR_MS = 1 * 60 * ONE_MINUTE_MS; 
	var timeSpent = toTime - fromTime;
	var hrs = Math.floor(timeSpent / ONE_HR_MS);
	var mins = Math.floor((timeSpent % ONE_HR_MS) / ONE_MINUTE_MS);
	return [hrs, mins];
};

/**
 * Returns the mapping columns of the top section.
 */
PartogramOverviewComponentWF.prototype.getSection1ColumnMapping = function() {
	return {
		GESTATIONAL_INFORMATION: 0,
		GRAVIDA_PARITY: 1,
		GBS_RESULT: 2,
		BLOOD_TYPE: 3,
		LABOR_ONSET: 4,
		MEOWS: 5
	};
};

/**
 * getColumnDisplayRatios function returns an array of integers summing to 100 representing the percentage width of the
 * columns in the table of top section. This is done to keep the HTML responsive to the device screen size/resolution.
 */
PartogramOverviewComponentWF.prototype.getColumnDisplayRatios = function() {
	var widthRatios = [20, 15, 15, 10, 28, 12];
	var tableColMap = this.getSection1ColumnMapping();
	var displayStatuses = this.DISPLAY_STATUS;
	var toRedistribute = 0;
	var totalColumns = 6;
	if (!displayStatuses[tableColMap.GBS_RESULT]) {
		toRedistribute += widthRatios[tableColMap.GBS_RESULT];
		totalColumns--;
	}
	if (!displayStatuses[tableColMap.BLOOD_TYPE]) {
		toRedistribute += widthRatios[tableColMap.BLOOD_TYPE];
		totalColumns--;
	}
	if (!displayStatuses[tableColMap.MEOWS]) {
		toRedistribute += widthRatios[tableColMap.MEOWS];
		totalColumns--;
	}
	var toAdd = Math.floor(toRedistribute / totalColumns);
	for (var i = tableColMap.GRAVIDA_PARITY; i <= tableColMap.MEOWS; i++) {
		if (displayStatuses[i]) {
			widthRatios[i] += toAdd;
			toRedistribute -= toAdd;
		}
	}
	//assign the remaining to column 1 of gestation information
	widthRatios[tableColMap.GESTATIONAL_INFORMATION] += toRedistribute;
	return widthRatios;
};

/**
 * Retrieves the GBS Result object, having the text and style to be applied to the text.
 */
PartogramOverviewComponentWF.prototype.getGBSObj = function() {
	var recordData = this.getRecordData();
	var gbsText = '--';
	var gbsStyle = 'partoNoDataDash';
	var rfi18n = i18n.discernabu.partogramoverview_o2;
	if (recordData.GBS !== "") {
		gbsStyle = '';
		gbsText = recordData.GBS;
		var gbsCaps = gbsText.toUpperCase();
		if (gbsCaps.match(rfi18n.POSITIVE) || gbsCaps.match(rfi18n.POS) || gbsCaps.match(rfi18n.P) || gbsText.match(/\+/)) {
			gbsStyle = "parto-gbs-positive";
		}
	}
	return {
		TEXT : gbsText,
		STYLE : gbsStyle
	};
};

/**
 * Retrieves the Blood Type object, having the text and style to be applied to the text.
 */
PartogramOverviewComponentWF.prototype.getBloodTypeObj = function() {
	var recordData = this.getRecordData();
	var bloodType = '--';
	var bloodStyle = 'partoNoDataDash';
	var rfi18n = i18n.discernabu.partogramoverview_o2;
	// Initialize blood type
	if (recordData.BLOODTYPE !== "") {
		bloodType = recordData.BLOODTYPE;
	} else if (recordData.ABO !== "" && recordData.RHTYPE !== "") {
		bloodType = recordData.ABO.concat("&nbsp;", recordData.RHTYPE);
	}

	// Identify whether the blood type (rh negative) is negative or not and apply style accordingly
	if (recordData.BLOODTYPE !== "") {
		bloodStyle = '';
		var bloodTypeCaps = recordData.BLOODTYPE.toUpperCase();
		if (bloodTypeCaps.match(rfi18n.NEGATIVE) || bloodTypeCaps.match(rfi18n.NEG) || bloodTypeCaps.match(rfi18n.N) || recordData.BLOODTYPE.match("-")) {
			bloodStyle = "parto-blood-type-rh-negative";
		}
	} else if (recordData.RHTYPE !== "") {
		bloodStyle = '';
		var RHFactorCaps = recordData.RHTYPE.toUpperCase();
		if (RHFactorCaps.match(rfi18n.NEGATIVE) || RHFactorCaps.match(rfi18n.NEG) || RHFactorCaps.match(rfi18n.N) || recordData.RHTYPE.match("-")) {
			bloodStyle = "parto-blood-type-rh-negative";
		}
	}
	return {
		TEXT : bloodType,
		STYLE : bloodStyle
	};
};

/**
 * Retrieves the number of hours that Partogram displays. Clinically we expect this to be roughly number of hours
 * in labor. The Partogram last load time is the considered the end of Partogram.
 */
PartogramOverviewComponentWF.prototype.getNumberOfHoursDisplayedinPartogram = function() {
	return Math.round((PARTO_GRAPH_BASE.getPartogramLastLoadTime() - PARTO_GRAPH_BASE.getFinalStartTime())/3600000);
};

/**
 * Retrieves the HTML for the left portion of the top table on the Left hand side.
 */
PartogramOverviewComponentWF.prototype.getSection1TableHTML = function() {
	var tableHTML = '';
	var rfi18n = i18n.discernabu.partogramoverview_o2;
	var compID = this.getComponentId();
	var partoInfoObj = this.partogramInfoObj;
	var displayStatuses = this.DISPLAY_STATUS;
	var tableColMap = this.getSection1ColumnMapping();
	var recordData = this.getRecordData();
	//gestation information
	var ega = recordData.EGA;
	var edd = recordData.EDD;
	edd = PARTO_GRAPH_BASE.getFormattedLocalDateTime(edd ,"MEDIUM_DATE");
	var egaWeeks = Math.floor(ega / 7);
	var egaDays = ega % 7;
	tableHTML += '<div class="partoOverviewTableCol partoOverviewTableCol1">';
	tableHTML += '<div class="partoOverviewTableColHeader">';
	tableHTML += '<span title="' + rfi18n.GESTATIONAL_INFORMATION + '">' + rfi18n.GESTATIONAL_INFORMATION + '</span>';
	tableHTML += '</div>';
	tableHTML += '<div class="partoOverviewTableColData">';
	tableHTML += '<span class="partoOverviewTextSuper">' + egaWeeks + '</span><span class="partoOverviewTextLabel">' + rfi18n.WEEK_ABBR + '</span>&nbsp;<span class="partoOverviewTextSuper">' + egaDays + '</span><span class="partoOverviewTextLabel">' + rfi18n.DAYS_ABBR + '</span>&nbsp;&nbsp;<span class="partoOverviewTextSecondary">' + edd + '</span>';
	tableHTML += '</div>';
	tableHTML += '</div>';

	//Gravida/Parity
	var gravidaCount = partoInfoObj.getGravida();
	var paraCount = partoInfoObj.getPara();
	var paraTerm = partoInfoObj.getParaTerm();
	var paraPremature = partoInfoObj.getParaPremature();
	var paraAbortions = partoInfoObj.getParaAbortions();
	var paraLiving = partoInfoObj.getParaLiving();
	var ectopic = partoInfoObj.getEctopic();
	var spontaneousAbortion = partoInfoObj.getSpontaneousAbortion();
	var inducedAbortion = partoInfoObj.getInducedAbortion();
	var multipleBirths = partoInfoObj.getMultipleBirths();
	var gravidaDisplay = rfi18n.G + gravidaCount + ', ' + rfi18n.PARITY_ABBR + paraCount + ' (' + paraTerm + ', ' + paraPremature + ', ' + paraAbortions + ', ' + paraLiving + ')';
	var gravidaDesc = [rfi18n.ECTOPIC, rfi18n.SPONTANEOUS_ABORTION, rfi18n.INDUCED_ABORTION, rfi18n.MULTIPLE_BIRTH_PREG, rfi18n.GRAVIDA, rfi18n.PARA_FULL_TERM, rfi18n.PARA_PRE_TERM, rfi18n.ABORTIONS, rfi18n.LIVING];
	var gravidaValues = [ectopic, spontaneousAbortion, inducedAbortion, multipleBirths, gravidaCount, paraTerm, paraPremature, paraAbortions, paraLiving];
	var gravidaHoverHTML = '';
	var gavidaHoverRowCount = 9;
	for (var i = 0; i < gavidaHoverRowCount; i++) {
		gravidaHoverHTML += '<div><span>' + gravidaDesc[i] + ': ' + gravidaValues[i] + '</span></div>';
	}
	tableHTML += '<div class="partoOverviewTableCol partoOverviewTableCol2">';
	tableHTML += '<div class="partoOverviewTableColHeader">';
	tableHTML += '<span title="' + rfi18n.GRAVIDA_PARITY + '">' + rfi18n.GRAVIDA_PARITY + '</span>';
	tableHTML += '</div>';
	tableHTML += '<div class="partoOverviewTableColData partoTooltipParent">';
	tableHTML += '<span class="partoOverviewTextLabel">' + gravidaDisplay + '</span>';
	tableHTML += '<div class="partoTooltip">' + gravidaHoverHTML + '</div>';
	tableHTML += '</div>';
	tableHTML += '</div>';

	//GBS Status
	if (displayStatuses[tableColMap.GBS_RESULT]) {
		var gbsObj = this.getGBSObj();
		tableHTML += '<div class="partoOverviewTableCol partoOverviewTableCol3">';
		tableHTML += '<div class="partoOverviewTableColHeader">';
		tableHTML += '<span title="' + rfi18n.GBS_RESULT + '">' + rfi18n.GBS_RESULT + '</span>';
		tableHTML += '</div>';
		tableHTML += '<div class="partoOverviewTableColData">';
		tableHTML += '<span class="partoOverviewTextSuper ' + gbsObj.STYLE + '">' + gbsObj.TEXT + '</span>';
		tableHTML += '</div>';
		tableHTML += '</div>';
	}

	//Blood Type
	if (displayStatuses[tableColMap.BLOOD_TYPE]) {
		var bloodTypeObj = this.getBloodTypeObj();
		tableHTML += '<div class="partoOverviewTableCol partoOverviewTableCol4">';
		tableHTML += '<div class="partoOverviewTableColHeader">';
		tableHTML += '<span title="' + rfi18n.BLOOD_TYPE + '">' + rfi18n.BLOOD_TYPE + '</span>';
		tableHTML += '</div>';
		tableHTML += '<div class="partoOverviewTableColData">';
		tableHTML += '<span class="partoOverviewTextSuper ' + bloodTypeObj.STYLE + '">' + bloodTypeObj.TEXT + '</span>';
		tableHTML += '</div>';
		tableHTML += '</div>';
	}
	//Labor Onset
	var laborOnsetDate = partoInfoObj.getLaborOnsetDate();
	var formattedDate = PARTO_GRAPH_BASE.getFormattedLocalDateTime(laborOnsetDate,"FULL_DATE_TIME");
	tableHTML += '<div class="partoOverviewTableCol partoOverviewTableCol5">';
	tableHTML += '<div class="partoOverviewTableColHeader">';
	tableHTML += '<span title="' + rfi18n.LABOR_ONSET + '" class="partoOverviewTextLabel">' + rfi18n.LABOR_ONSET + '</span>';
	tableHTML += '</div>';
	tableHTML += '<div class="partoOverviewTableColData">';
	tableHTML += '<span id="partoOverviewLaborOnsetPart1Hrs' + compID + '" class="partoOverviewTextSuper">-</span><span class="partoOverviewTextLabel">' + rfi18n.HRS + '</span>&nbsp;&nbsp;<span id="partoOverviewLaborOnsetPart1Mins' + compID + '" class="partoOverviewTextSuper">-</span><span class="partoOverviewTextLabel">' + rfi18n.MIN + '</span>&nbsp;&nbsp;<span class="partoOverviewTextSecondary">' + formattedDate + '</span>';
	tableHTML += '</div>';
	tableHTML += '</div>';
	
	//MEOWS
	if (displayStatuses[tableColMap.MEOWS]) {
		var meowsDetailsNames = recordData.MEOWS_DETAILS_NAMES;
		var isAdditionalEventsMapped = recordData.MEOWS_DETAILS_NAMES_CNT > 0;
		var meowDetails = recordData.MEOWS_DETAILS;
		var count = 0;
		//sort in ascending order as per documented date
		meowDetails.sort(function(meow1, meow2){
			return new Date(meow1.RESULT_DATE) - new Date(meow2.RESULT_DATE);
		});
		meowsDetailsDataMap = {};
		for (count = 0; count < meowDetails.length; count++) {
			meowsDetailsDataMap[meowDetails[count].EVENT_CD] = meowDetails[count].RESULT_VALUE;
		}
		var meowsHoverHTML = '';
		var dttm = -1;
		for (count = 0; count < meowsDetailsNames.length; count++) {
			var eventcd = meowsDetailsNames[count].EVENT_CD;
			var value = '--';
			if (meowsDetailsDataMap[eventcd]) {
				value = meowsDetailsDataMap[eventcd];
			}
			dttm = value.indexOf('{date_value}');
			if (dttm != -1) {
				value = PARTO_GRAPH_BASE.getFormattedLocalDateTime(value.substr(dttm + 12) ,"FULL_DATE_TIME");
			}
			meowsHoverHTML += '<div><span>' + meowsDetailsNames[count].EVENT_NAME + ': ' + value + '</span></div>';
		}
		var meowsValue = recordData.MEOWS;
		var meowsStyle = '';
		dttm = meowsValue.indexOf('{date_value}');
		if (dttm != -1) {
			meowsValue = PARTO_GRAPH_BASE.getFormattedLocalDateTime(meowsValue.substr(dttm + 12) ,"FULL_DATE_TIME");
		}
		if (meowsValue.length === 0) {
			meowsValue = '--';
			meowsStyle = 'partoNoDataDash';
		}
		tableHTML += '<div class="partoOverviewTableCol partoOverviewTableCol6">';
		tableHTML += '<div class="partoOverviewTableColHeader">';
		tableHTML += '<span title="' + rfi18n.MEOWS + '" class="partoOverviewTextLabel">' + rfi18n.MEOWS + '</span>';
		tableHTML += '</div>';
		tableHTML += '<div class="partoOverviewTableColData partoTooltipParent">';
		tableHTML += '<span class="partoOverviewTextSuper ' + meowsStyle + '">' + meowsValue + '</span>';
		if (isAdditionalEventsMapped) {
			tableHTML += '<div class="partoTooltip meowsTooltip">' + meowsHoverHTML + '</div>';
		}
		tableHTML += '</div>';
		tableHTML += '</div>';
	}
	return tableHTML;
};

/**
 * Retrieves the Pregnancy Descriptor Object containing the text to be displayed and the corresponding background color.
 * 0 => nullipara
 * 1 => multipara
 * 2 => prev c-section
 */
PartogramOverviewComponentWF.prototype.getPregDescObj = function() {
	var pregDescState = this.partogramInfoObj.getPregnancyDescriptor();
	var rfi18n = i18n.discernabu.partogramoverview_o2;
	var pregDescEmptyObj = {
		TEXT: '',
		COLOR: ''
	};
	var text = '';
	var color = '';
	switch (pregDescState) {
		case 0:
			text = rfi18n.NULLIPARA;
			color = 'rgba(255, 255, 0, 0.5)';
			break;
		case 1:
			text = rfi18n.MULTIPARA;
			color = '#ADE2FF';
			break;
		case 2:
			text = rfi18n.PREV_C_SECTION;
			color = '#FFD6EB';
			break;
		default:
			return pregDescEmptyObj;
	}
	if (!this.pregDescColored) {
		color = '';
	}
	return {
		TEXT: text,
		COLOR: color
	};
};

/**
 * Retrieves the HTML for the top section of the overview component
 */
PartogramOverviewComponentWF.prototype.getSection1HTML = function() {
	var section1HTML = '';
	var pregDescObj = this.getPregDescObj();
	var compID = this.getComponentId();
	section1HTML += '<div id="partoOverviewSec1Table' + compID + '" class="partoOverviewSec1Table partoFloatLeft">';
	section1HTML += this.getSection1TableHTML();
	section1HTML += '</div>';
	section1HTML += '<div id="partoOverviewPregDesc' + compID + '" title="' + pregDescObj.TEXT + '" class="partoOverviewPregDesc partoFloatLeft" style="background-color:' + pregDescObj.COLOR + '">' + pregDescObj.TEXT + '</div>';
	return section1HTML;
};

/**
 * Comparator function for sorting the babies in lexicographic order. 
 * If they are setup with same name, use dynamic_label_id.
 * @param point1  : Baby A to be compared
 * @param point2  : Baby B to be compared
 * @return sortResult {Integer}: The sorting result of two babies
 */
PartogramOverviewComponentWF.prototype.babySorter = function(babyA, babyB) {
	var sortRes = 0;
	if (babyA && babyA.DYNAMIC_LABEL === "") {
		sortRes = 1;
	} else if (babyB && babyB.DYNAMIC_LABEL === "") {
		sortRes = -1;
	} else {
		var isEqual = ((babyA.DYNAMIC_LABEL).toUpperCase() === (babyB.DYNAMIC_LABEL).toUpperCase());
		if (isEqual) {
			sortRes = ((babyA.DYNAMIC_LABEL_ID > babyB.DYNAMIC_LABEL_ID) ? 1 : -1);
		} else {
			sortRes = ((babyA.DYNAMIC_LABEL).toUpperCase() > (babyB.DYNAMIC_LABEL).toUpperCase() ? 1 : -1);
		}
	}
	return sortRes;
};

/**
 * getSection2ROMHTML returns the HTML for the bottom sections Rupture of Membrane HTML
 */
PartogramOverviewComponentWF.prototype.getSection2ROMHTML = function() {
    var seriesColors = ["#5E34B1", "#008836", "#FF3399"];
	var ROMHTML = '';
	var componentID = this.getComponentId();
	var rfi18n = i18n.discernabu.partogramoverview_o2;
	var recordData = this.getRecordData();
	ROMHTML += '<div id="partoOverviewROMHeader' + componentID + '" class="partoOverviewROMHeaderContainer">';
	ROMHTML += '<div id="partoOverviewROMCol1Header' + componentID + '" title="' + rfi18n.BABY + '" class="partoOverviewTableCol partoOverviewTableColHeader partoOverviewROMCol1 partoOverviewTextLabel partoFloatLeft">' + rfi18n.BABY + '</div>';
	ROMHTML += '<div id="partoOverviewROMCol2Header' + componentID + '" title="' + rfi18n.RUPT_OF_MEMBRANE + '" class="partoOverviewTableCol partoOverviewTableColHeader partoOverviewROMCol2 partoOverviewTextLabel partoFloatLeft">' + rfi18n.RUPT_OF_MEMBRANE + '</div>';
	ROMHTML += '</div>';
	//babyData will be sorted according to the dynamic label. Sorting is done in renderComponent method.
	var babyData = recordData.BABY;
	var nBabies = recordData.BABY_CNT;
	
	//will be called only if length > 0
	var getRecentDeliveryDate = function(deliveryData){
		//sort in ascending order
		deliveryData.sort(function(del1, del2){
			return new Date(del1.RESULT_DATE) - new Date(del2.RESULT_DATE);
		});
		var mostRecentDelivery = deliveryData[deliveryData.length - 1].RESULT_VALUE;
		return PARTO_GRAPH_BASE.getFormattedLocalDateTime(mostRecentDelivery,"FULL_DATE_TIME");
	};
	
	//will be called only if length > 0
	var getRecentROMDate = function(ROMData){
		//sort in ascending order
		ROMData.sort(function(rom1, rom2){
			return new Date(rom1.RESULT_DATE) - new Date(rom2.RESULT_DATE);
		});
		var iso8601Date = new Date();
		iso8601Date.setISO8601(ROMData[ROMData.length - 1].RESULT_VALUE);
		return iso8601Date;
	};
	
	var additionalEvents = recordData.ADDITIONAL_EVENTS_NAMES;
	var isAdditionalEventsMapped = recordData.ADDITIONAL_EVENTS_NAMES_CNT > 0;
	var maxBabiesCount = Math.min(nBabies, this.MAX_ALLOWED_BABIES);
	for (var i = 0; i < maxBabiesCount; i++) {
		var babyi = babyData[i];
		var babyLabel = babyi.DYNAMIC_LABEL;
		var babyAdditionalEventMap = {};
		var babyAdditionalEvents = babyi.ADDITIONAL_EVENTS;
		//sort in ascending order of documented date
		babyAdditionalEvents.sort(function(event1, event2){
			return new Date(event1.RESULT_DATE) - new Date(event2.RESULT_DATE);
		});
		var count = 0;
		for (count = 0; count < babyAdditionalEvents.length; count++) {
			babyAdditionalEventMap[babyAdditionalEvents[count].EVENT_CD] = babyAdditionalEvents[count].RESULT_VALUE;
		}
		ROMHTML += '<div id="partoOverviewROMRow' + i + componentID + '" class="partoOverviewROMRow">';
		ROMHTML += '<div class="partoOverviewROMCol1 partoFloatLeft partoTooltipParent" style="background-color:' + seriesColors[i] + '">';
		ROMHTML += '<span title="' + babyLabel + '" class="partoOverviewROMCol1BabyLabel">' + babyLabel + '</span>';
		//no hover will be shown if no additional event is mapped
		if (isAdditionalEventsMapped) {
			ROMHTML += '<div class="partoTooltip">';
			ROMHTML += '<div class="partoOverviewROMBabyHoverHeader">' + babyi.DYNAMIC_LABEL + '</div>';
			for (count = 0; count < additionalEvents.length; count++) {
				var eventcd = additionalEvents[count].EVENT_CD;
				//show -- if no value present for the mapped event. But need to show the field in the hover.
				var value = '--';
				//if the value is present, use that value
				if (babyAdditionalEventMap[eventcd]) {
					value = babyAdditionalEventMap[eventcd];
				}
				//check if it's a date, and format accordingly
				var dttm = value.indexOf('{date_value}');
				if (dttm != -1) {
					value = PARTO_GRAPH_BASE.getFormattedLocalDateTime(value.substr(dttm + 12) ,"FULL_DATE_TIME");
				}
				ROMHTML += '<div style="text-align: left;"><span>' + PARTO_GRAPH_BASE.removeColonEndOfString(additionalEvents[count].EVENT_NAME) + ': ' + value + '</span></div>';
			}
			ROMHTML += '</div>';
		}
		ROMHTML += '</div>';
		ROMHTML += '<div class="partoOverviewROMCol2 partoOverviewTableColData partoFloatLeft">';
		//baby is delivered
		if (babyi.DELIVERED_CNT > 0) {
			//get the most recent documented delivery date
			var deliveryDate = getRecentDeliveryDate(babyi.DELIVERED);
			ROMHTML += '<span class="partoOverviewTextLabel">' + rfi18n.DELIVERED + '</span>&nbsp;&nbsp;<span class="partoOverviewTextSecondary">' + deliveryDate + '</span>';
		} else if (babyi.ROM.length > 0){ //baby is active, membrane is ruptured
			var ROMDate = getRecentROMDate(babyi.ROM);
			var timeSpent = this.getTimeSpent(ROMDate.getTime());
			var coloredClass = '';
			if (this.ROMTextColored && timeSpent[0] >= this.ROM_CRITICAL_VALUE) {
				coloredClass = 'parto-rom-critical-text-color';
			}
			ROMHTML += '<span class="partoOverviewTextSuper ' + coloredClass + '">' + timeSpent[0] + '</span><span class="partoOverviewTextLabel ' + coloredClass + '">' + rfi18n.HRS + '</span>&nbsp;<span class="partoOverviewTextSuper ' + coloredClass + '">' + timeSpent[1] + '</span><span class="partoOverviewTextLabel ' + coloredClass + '">' + rfi18n.MIN + '</span>&nbsp;&nbsp;<span class="partoOverviewTextSecondary">' + PARTO_GRAPH_BASE.getFormattedLocalDateTime (ROMDate , "FULL_DATE_TIME") + '</span>';
		} else { // baby is inactive, membrane not ruptured
			ROMHTML += '<span class="partoNoDataDash">--</span>';
		}
		ROMHTML += '</div>';
		ROMHTML += '</div>';
		if (i != maxBabiesCount - 1) {
			ROMHTML += '<div class="partoOverviewROMRowDivider"></div>';
		}
	}
	if (maxBabiesCount === 0) {
		ROMHTML += '<div id="partoOverviewROMRow0' + componentID + '" class="partoOverviewROMRow">';
		ROMHTML += '<div class="partoOverviewROMCol1 partoFloatLeft partoTooltipParent">';
		ROMHTML += '<span class="partoNoDataDash">--</span>';
		ROMHTML += '</div>';
		ROMHTML += '<div class="partoOverviewROMCol2 partoOverviewTableColData partoFloatLeft">';
		ROMHTML += '<span class="partoNoDataDash">--</span>';
		ROMHTML += '</div>';
		ROMHTML += '</div>';
	}
	return ROMHTML;
};

/**
 * getSection2OxytocinHTML returns the HTML for the bottom sections Oxytocin Legend HTML
 */
PartogramOverviewComponentWF.prototype.getSection2OxytocinHTML = function() {
	var oxytocinHTML = '';
	var compID = this.getComponentId();
	var rfi18n = i18n.discernabu.partogramoverview_o2;
	oxytocinHTML += '<div class="partoOverviewOxyCol1 partoFloatLeft">';
	oxytocinHTML += '<div title="' + rfi18n.OXYTOCIN + '" class="partoOverviewTableColHeader partoOverviewTextLabel">' + rfi18n.OXYTOCIN + '</div>';
	oxytocinHTML += '<div id="partoOverviewOxyCol1DataContainer' + compID + '" class="partoOverviewOxyCol1DataContainer">';
	oxytocinHTML += '<div id="partoOverviewOxyCol1Data' + compID + '" class="partoOverviewOxyCol1Data">';
	oxytocinHTML += '<div id="partoOxyToggle' + compID + '" class="partoOverviewSprite partoOxy-ON partoFloatLeft partoOxyToggle"></div>';
	oxytocinHTML += '<div id="partoOverviewOxyDataContainer' + compID + '" class="partoFloatLeft partoOverviewOxyDataContainer">';
	oxytocinHTML += '<div id="partoOxyDosageContainer' + compID + '" class="partoFloatLeft partoOverviewPadLeft partoOxyDosageContainer"><span class="partoOxyLegendValue partoOverviewTextSuper">-</span><span class="partoOxyLegendUnit partoOverviewTextLabel">-</span></div>';
	oxytocinHTML += '<div id="partoOxyStopText' + compID + '" class="partoFloatLeft partoEpiDiscontdText partoOverviewTextLabel">' + rfi18n.STOP + '</div>';
	oxytocinHTML += '<div id="partoOverviewLegendDisplayImg' + compID + '" class="partoOverviewSprite partoFloatLeft partoOverviewOxyImg"></div><span id="partoOxyStartDateText' + compID + '" class="partoFloatLeft partoOverviewTextSecondary partoOxyStartDateText"></span>';//date
	oxytocinHTML += '</div>'; //partoOverviewOxyDataContainer
	oxytocinHTML += '<div id="partoOxyStartNoData' + compID + '" class="partoOxyStartNoData"><span class="partoNoDataDash">--</span></div>';
	oxytocinHTML += '</div>'; //partoOverviewOxyCol1Data
	oxytocinHTML += '</div>'; //col1datacontainer
	oxytocinHTML += '</div>'; //partoOverviewOxyCol1

	oxytocinHTML += '<div id="partoOverviewOxyCol2' + compID + '" class="partoOverviewOxyCol2 partoFloatLeft">';
	oxytocinHTML += '<div id="partoOverviewOxyCol2DataContainer' + compID + '">';
	oxytocinHTML += '<div class="partoOverviewOxyCol2DataLeft">';
	//start
	oxytocinHTML += '<div class="partoOxyLegendRow"><div class="partoOverviewSprite partoOxyStart partoFloatLeft partoOverviewLegendImg"></div><span title="' + rfi18n.START + '" class="partoFloatLeft partoOverviewTextLabel">' + rfi18n.START + '</span></div>';
	//stop
	oxytocinHTML += '<div class="partoOxyLegendRow"><div class="partoOverviewSprite partoIVStop partoFloatLeft partoOverviewLegendImg parto-overview-oxy-stop"></div><span title="' + rfi18n.STOP + '" class="partoFloatLeft partoOverviewTextLabel">' + rfi18n.STOP + '</span></div>';
	oxytocinHTML += '</div>';

	oxytocinHTML += '<div class="partoOverviewOxyCol2DataRight">';
	//increase
	oxytocinHTML += '<div class="partoOxyLegendRow"><div class="partoOverviewSprite partoOxyIncrease partoFloatLeft partoOverviewLegendImg"></div><span title="' + rfi18n.INCREASE + '" class="partoFloatLeft partoOverviewTextLabel">' + rfi18n.INCREASE + '</span></div>';
	//decrease
	oxytocinHTML += '<div class="partoOxyLegendRow"><div class="partoOverviewSprite partoOxyDecrease partoFloatLeft partoOverviewLegendImg"></div><span title="' + rfi18n.DECREASE + '" class="partoFloatLeft partoOverviewTextLabel">' + rfi18n.DECREASE + '</span></div>';
	oxytocinHTML += '</div>';

	oxytocinHTML += '</div>'; //col2datacontainer
	oxytocinHTML += '</div>';
	return oxytocinHTML;
};

/**
 * getSection2EpiduralHTML returns the HTML for the bottom sections Epidural Legend HTML
 */
PartogramOverviewComponentWF.prototype.getSection2EpiduralHTML = function() {
	var epiduralHTML = '';
	var rfi18n = i18n.discernabu.partogramoverview_o2;
	var partoInfoObj = this.partogramInfoObj;
	var epiEventNames = ['','','',''];
	var compID = this.getComponentId();
	var epiMap = PARTO_GRAPH_BASE.getEpiduralMap();
	var epiduralObj = partoInfoObj.getEpiduralResults()[0];
	epiEventNames[epiMap.START] = epiduralObj.EPIDURAL_START_NAME;
	epiEventNames[epiMap.BOLUS_ANESTHESIA] = epiduralObj.EPIDURAL_BOL_ANES_NAME;
	epiEventNames[epiMap.BOLUS_PATIENT] = epiduralObj.EPIDURAL_BOL_PAT_NAME;
	epiEventNames[epiMap.DISCONTINUED] = epiduralObj.EPIDURAL_DISCONT_NAME;
	PARTO_GRAPH_BASE.setEpiduralNames(epiEventNames);
	
	epiduralHTML += '<div class="partoOverviewOxyCol1 partoFloatLeft">';
	epiduralHTML += '<div title="' + rfi18n.EPIDURAL + '" class="partoOverviewTableColHeader partoOverviewTextLabel">' + rfi18n.EPIDURAL + '</div>';
	epiduralHTML += '<div id="partoOverviewEpiCol1DataContainer' + compID + '" class="partoOverviewEpiCol1DataContainer">';
	epiduralHTML += '<div id="partoOverviewEpiCol1Data' + compID + '" class="partoOverviewEpiCol1Data">';
	epiduralHTML += '<div id="partoEpiToggle' + compID + '" class="partoOverviewSprite partoEpi-ON partoFloatLeft partoEpiToggle"></div>';
	epiduralHTML += '<div id="partoEpiStartText' + compID + '" class="partoEpiStartText">';
	epiduralHTML += '<div id="partoEpiTimeSpent' + compID + '" class="partoEpiTimeSpent">';
	epiduralHTML +=  '<span id="partoEpiStartHrsValue' + compID + '" class="partoOverviewTextSuper">-</span><span class="partoOverviewTextLabel">' + rfi18n.HRS + '</span>&nbsp;<span id="partoEpiStartMinValue' + compID + '" class="partoOverviewTextSuper">-</span><span class="partoOverviewTextLabel">' + rfi18n.MIN + '</span>';
	epiduralHTML += '</div>';//partoEpiTimeSpent
	epiduralHTML += '<div id="partoEpiDiscontdText' + compID + '" class="partoEpiDiscontdText partoOverviewTextLabel">' + rfi18n.DISCONTINUED + '</div>';
	epiduralHTML += '<span id="partoEpiStartDateText' + compID + '" class="partoOverviewTextSecondary">-</span>';
	epiduralHTML += '</div><div id="partoEpiStartNoData' + compID + '" class="partoEpiStartNoData"><span class="partoNoDataDash">--</span></div>';
	epiduralHTML += '</div>';
	epiduralHTML += '</div>';//col1datacontainer
	epiduralHTML += '</div>';

	epiduralHTML += '<div id="partoOverviewEpiCol2' + compID + '" class="partoOverviewEpiCol2 partoFloatLeft">';
	epiduralHTML += '<div id="partoOverviewEpiCol2DataContainer' + compID + '">';
	epiduralHTML += '<div class="partoOverviewOxyCol2DataLeft">';
	//Epidural Start
	epiduralHTML += '<div class="partoOxyLegendRow"><div class="partoOverviewSprite partoEpiStart partoFloatLeft partoOverviewLegendImg"></div><span title="' + epiEventNames[epiMap.START] + '" class="partoFloatLeft partoOverviewTextLabel">' + epiEventNames[epiMap.START] + '</span></div>';
	//discontinued
	epiduralHTML += '<div class="partoOxyLegendRow"><div class="partoOverviewSprite partoIVStop partoFloatLeft partoOverviewLegendImg parto-overview-oxy-stop"></div><span title="' + epiEventNames[epiMap.DISCONTINUED] + '" class="partoFloatLeft partoOverviewTextLabel">' + epiEventNames[epiMap.DISCONTINUED] + '</span></div>';
	epiduralHTML += '</div>';
	
	
	epiduralHTML += '<div class="partoOverviewOxyCol2DataRight">';
	//bolus-anesthesia
	epiduralHTML += '<div class="partoOxyLegendRow"><div class="partoOverviewSprite partoEpiBA partoFloatLeft partoOverviewLegendImg"></div><span title="' + epiEventNames[epiMap.BOLUS_ANESTHESIA] + '" class="partoFloatLeft partoOverviewTextLabel">' + epiEventNames[epiMap.BOLUS_ANESTHESIA] + '</span></div>';
	//bolus-patient
	epiduralHTML += '<div class="partoOxyLegendRow"><div class="partoOverviewSprite partoEpiBP partoFloatLeft partoOverviewLegendImg"></div><span title="' + epiEventNames[epiMap.BOLUS_PATIENT] + '" class="partoFloatLeft partoOverviewTextLabel">' + epiEventNames[epiMap.BOLUS_PATIENT] + '</span></div>';
	epiduralHTML += '</div>';
	
	epiduralHTML += '</div>';//col2datacontainer
	epiduralHTML += '</div>';
	return epiduralHTML;
};

/**
 * Retrieves the HTML for the bottom section of the overview component having Rupture of membrane, Oxytocin and Epidural information
 */
PartogramOverviewComponentWF.prototype.getSection2HTML = function() {
	var section2HTML = '';
	var componentID = this.getComponentId();
	section2HTML += '<div id="partoOverviewSec2ROMContainer' + componentID + '" class="partoOverviewSec2ROM partoFloatLeft">';
	section2HTML += this.getSection2ROMHTML();
	section2HTML += '</div>';
	section2HTML += '<div class="partoOverviewSec2Gap"></div>';
	section2HTML += '<div id="partoOverviewSec2OxytocinContainer' + componentID + '" class="partoOverviewSec2Oxytocin">';
	section2HTML += this.getSection2OxytocinHTML();
	section2HTML += '</div>';
	section2HTML += '<div class="partoOverviewSec2Gap"></div>';
	section2HTML += '<div id="partoOverviewSec2EpiduralContainer' + componentID + '" class="partoOverviewSec2Epidural">';
	section2HTML += this.getSection2EpiduralHTML();
	section2HTML += '</div>';
	return section2HTML;
};

/**
 * A wrapper function to get the HTML for the component.
 * @return ComponentHTML {String}: The HTML of the component
 */
PartogramOverviewComponentWF.prototype.getComponentHTML = function() {
	var compID = this.getComponentId();
	var imageFolder = this.getImageFolderPath();
	var compHTML = '<div class="partogram-container">';
	compHTML += '<div id="partogram-overview-section1' + compID + '" class="partogram-overview-section1">';
	compHTML += this.getSection1HTML();
	compHTML += '</div>';
	compHTML += '<div class="partogram-overview-sectiongap"></div>';
	compHTML += '<div id="partogram-overview-section2' + compID + '" class="partogram-overview-section2">';
	compHTML += this.getSection2HTML();
	compHTML += '</div>';
	compHTML += '</div>';
	compHTML += '<div class="partogram-top-bar-tooltip">';
	compHTML += "</div>";
	return compHTML;
};

/**
 * A method to update the epidural legend information like the time spent, date etc. Can be used in future to update every minute.
 */
PartogramOverviewComponentWF.prototype.updateEpiduralLegendData = function() {
	var epiMap = PARTO_GRAPH_BASE.getEpiduralMap();
	var compID = this.getComponentId();
	if (this.epiduralData[epiMap.START].length === 0 || this.isEpiduralDiscontinued) {
		return;
	}
	var epiData = this.epiduralData;
	var epiStartData = [];
	var epiStartRecord = epiData[epiMap.START];
	for (var i = 0, len = epiStartRecord.length; i < len; i++) {
		epiStartData.push(epiStartRecord[i].EPIDURAL_VALUE);
	}
	//sort in ascending order
	epiStartData.sort(function(epi1, epi2){
		return new Date(epi1) - new Date(epi2);
	});
	if (epiStartData.length === 0) {
		return;
	}
	var recentEpiStart = new Date(epiStartData[epiStartData.length - 1]);
	var formattedDate =  PARTO_GRAPH_BASE.getFormattedLocalDateTime(recentEpiStart,"FULL_DATE_TIME");
	var timeSpent = this.getTimeSpent(PARTO_GRAPH_BASE.getLocalDateTime(epiStartData[0]));
	$('#partoEpiStartHrsValue' + compID).text(timeSpent[0] + '');
	$('#partoEpiStartMinValue' + compID).text(timeSpent[1] + '');
	$('#partoEpiStartDateText' + compID).text(formattedDate);
};

/**
 * A method to populate the epidural date in a more consumable format. Also populates the hover data
 */
PartogramOverviewComponentWF.prototype.populateEpiduralData = function() {
	var partoInfoObj = this.partogramInfoObj;
	var epiData = [
		[],
		[],
		[],
		[]
	];
	var epiHoverData = [
		[],
		[],
		[],
		[]
	];
	var compID = this.getComponentId();
	var rfi18n = i18n.discernabu.partogramoverview_o2;
	var imageClasses = ['partoIVStop', 'partoEpiStart', 'partoEpiBP', 'partoEpiBA'];
	var epiEventNames = PARTO_GRAPH_BASE.getEpiduralNames();
	var temp = partoInfoObj.getEpiduralResults()[0];
	var epiDataFromScript = temp.EPIDURAL_DATA;
	var epiMap = PARTO_GRAPH_BASE.getEpiduralMap();
	var epiStartData = [];
	var epiBAData = [];
	var epiBPData = [];
	var epiDiscontinued = [];
	var mostRecentStart = 0;
	var mostRecentDisc = 0;
	var eventTime;
	var hoverSpriteIconDiv = function(index) {
		return '<div class="partoOverviewSprite ' + imageClasses[index] + '"></div>';
	};
	for (var i = 0, len = epiDataFromScript.length; i < len; i++) {
		switch (epiDataFromScript[i].EPIDURAL_TYPE) {
			case epiMap.START:
				epiData[epiMap.START].push(epiDataFromScript[i]);
				eventTime = PARTO_GRAPH_BASE.getLocalDateTime(epiDataFromScript[i].EPIDURAL_VALUE);
				PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, eventTime, hoverSpriteIconDiv(epiMap.START), rfi18n.EPIDURAL, epiEventNames[epiMap.START]);
				mostRecentStart = Math.max(mostRecentStart, eventTime);
				break;
			case epiMap.BOLUS_ANESTHESIA:
				epiData[epiMap.BOLUS_ANESTHESIA].push(epiDataFromScript[i]);
				eventTime = PARTO_GRAPH_BASE.getLocalDateTime(epiDataFromScript[i].EPIDURAL_VALUE);
				PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, eventTime, hoverSpriteIconDiv(epiMap.BOLUS_ANESTHESIA), rfi18n.EPIDURAL, epiEventNames[epiMap.BOLUS_ANESTHESIA]);
				break;
			case epiMap.BOLUS_PATIENT:
				eventTime = PARTO_GRAPH_BASE.getLocalDateTime(epiDataFromScript[i].EPIDURAL_VALUE);
				epiData[epiMap.BOLUS_PATIENT].push(epiDataFromScript[i]);
				PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, eventTime, hoverSpriteIconDiv(epiMap.BOLUS_PATIENT), rfi18n.EPIDURAL, epiEventNames[epiMap.BOLUS_PATIENT]);
				break;
			case epiMap.DISCONTINUED:
				eventTime = PARTO_GRAPH_BASE.getLocalDateTime(epiDataFromScript[i].EPIDURAL_VALUE);
				epiData[epiMap.DISCONTINUED].push(epiDataFromScript[i]);
				mostRecentDisc = Math.max(mostRecentDisc, eventTime);
				PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, eventTime, hoverSpriteIconDiv(epiMap.DISCONTINUED), rfi18n.EPIDURAL, epiEventNames[epiMap.DISCONTINUED]);
				break;
			default:
				continue;
		}
	}
	this.epiduralData = epiData;
	PARTO_GRAPH_BASE.setEpiduralData(epiData);
	//show 'Discontinued' text in the legend
	if (mostRecentStart && mostRecentDisc && mostRecentDisc >= mostRecentStart) {
		$('#partoEpiStartNoData' + compID).css('display', 'none');
		$('#partoEpiStartText' + compID).css('display', 'inline');
		$('#partoEpiTimeSpent' + compID).css('display', 'none');
		$('#partoEpiDiscontdText' + compID).css('display', 'inline-block');
		mostRecentDisc = new Date(mostRecentDisc);
		var formattedDate = PARTO_GRAPH_BASE.getFormattedLocalDateTime(mostRecentDisc, "FULL_DATE_TIME");
		$('#partoEpiStartDateText' + compID).text(formattedDate);
		this.isEpiduralDiscontinued = true;
		//check if there is any start data
	} else if (mostRecentStart) {
		$('#partoEpiStartText' + compID).css('display', 'inline');
		$('#partoEpiStartNoData' + compID).css('display', 'none');
		$('#partoEpiTimeSpent' + compID).css('display', 'inline');
		$('#partoEpiDiscontdText' + compID).css('display', 'none');
		this.updateEpiduralLegendData();
	}
};

/**
 * A method to populate the oxytocin date in a more consumable format. Also populates the hover data
 */
PartogramOverviewComponentWF.prototype.populateOxytocinData = function() {
	var recordData = this.getRecordData();
	var oxyCnt = recordData.OXYTOCIN_CNT;
	var compID = this.getComponentId();
	var contentID = this.getStyles().getContentId();
	var rfi18n = i18n.discernabu.partogramoverview_o2;
	var DISCONTINUED = rfi18n.DISCONTINUED;
	var imageClasses = ['partoIVStop', 'partoOxyStart', 'partoOxyIncrease', 'partoOxyDecrease'];
	if (oxyCnt === 0) {
		return;
	}
	var oxyRecordData = recordData.OXYTOCIN;
	var i = 0, j = 0;
	//sort all data in ascending order
	for (i = 0; i < oxyCnt; i++) {
		oxyRecordData[i].DOSAGE.sort(function(dose1, dose2) {
			return PARTO_GRAPH_BASE.getLocalDateTime(dose1.RESULT_DATE) - PARTO_GRAPH_BASE.getLocalDateTime(dose2.RESULT_DATE);
		});
	}
	oxyRecordData.sort(function(order1, order2){
		if (order1.DOSAGE_CNT === 0 && order2.DOSAGE_CNT === 0) {
			return 0;
		}
		if (order1.DOSAGE_CNT === 0) {
			return 1;
		}
		if (order2.DOSAGE_CNT === 0) {
			return -1;
		}
		return PARTO_GRAPH_BASE.getLocalDateTime(order1.DOSAGE[0].RESULT_DATE) - PARTO_GRAPH_BASE.getLocalDateTime(order2.DOSAGE[0].RESULT_DATE);
	});
	
	//Insert the data in a 1D array, which will be sorted. Ignore all the points from other orders which overlaps the current order. 
	//Once the current order is finished, start the next order from the point after the previous stopped order.
	var oxytocinData = [];
	var dosageTime, dosage, currentDosageValue;
	var prevOrderLastDosage = null;
	for (i = 0; i < oxyCnt; i++) {
		var oxyOrder = oxyRecordData[i];
		var dosageArray = oxyOrder.DOSAGE;
		var dosageCnt = oxyOrder.DOSAGE_CNT;
		var dosageStartIndex = 0;
		if (prevOrderLastDosage !== null) {
			while (dosageStartIndex < dosageCnt && PARTO_GRAPH_BASE.getLocalDateTime(dosageArray[dosageStartIndex].RESULT_DATE) < prevOrderLastDosage) {
				dosageStartIndex++;
			}
		}
		for (j = dosageStartIndex; j < dosageCnt; j++) {
			dosage = dosageArray[j];
			dosageTime = PARTO_GRAPH_BASE.getLocalDateTime(dosage.RESULT_DATE);
			prevOrderLastDosage = dosageTime;
			oxytocinData.push({
				TIME : dosageTime,
				VALUE : dosage.RESULT_VALUE,
				UNIT : dosage.RESULT_UNIT
			});
		}
		if (oxyOrder.DISCONTINUED_IND) {
			prevOrderLastDosage = PARTO_GRAPH_BASE.getLocalDateTime(oxyOrder.DISCONTINUED_DATE);
			oxytocinData.push({
				TIME : PARTO_GRAPH_BASE.getLocalDateTime(oxyOrder.DISCONTINUED_DATE),
				VALUE : 0,
				UNIT : '',
				DISPLAY : DISCONTINUED
			});
		}
	}
	this.oxyData = oxytocinData;
	PARTO_GRAPH_BASE.setOxytocinData(oxytocinData);
	var oxyDataLen = oxytocinData.length;
	if (oxyDataLen === 0) {
		return;
	}	

	var oxyState = {
		STOP : 0,
		START : 1,
		INCREASE : 2,
		DECREASE : 3
	};
	var hoverSpriteIconDiv = function(index) {
		return '<div class="partoOverviewSprite ' + imageClasses[index] + '"></div>';
	};
	dosageTime = oxytocinData[0].TIME;
	var value = oxytocinData[0].VALUE + ' ' + oxytocinData[0].UNIT;
	//populate the hover data structure, segregating individual points to it's state.
	PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, dosageTime, hoverSpriteIconDiv(oxyState.START), rfi18n.OXYTOCIN, value);
	var prevDosageValue = oxytocinData[0].VALUE;
	var mostRecentEvent = oxyState.START;
	for (i = 1; i < oxyDataLen; i++) {
		dosage = oxytocinData[i];
		dosageTime = dosage.TIME;
		currentDosageValue = dosage.VALUE;
		if (dosage.VALUE === 0) {
			var displayVal = oxytocinData[i].DISPLAY ? oxytocinData[i].DISPLAY : currentDosageValue + ' ' + dosage.UNIT;
			PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, dosageTime, hoverSpriteIconDiv(oxyState.STOP), rfi18n.OXYTOCIN, displayVal);
			mostRecentEvent = oxyState.STOP;
			if (i + 1 < oxyDataLen && oxytocinData[i + 1].VALUE !== 0) {
				PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, oxytocinData[i + 1].TIME, hoverSpriteIconDiv(oxyState.START), 
													rfi18n.OXYTOCIN, oxytocinData[i + 1].VALUE + ' ' + oxytocinData[i + 1].UNIT);
				mostRecentEvent = oxyState.START;
				i++;
			}
		} else if (currentDosageValue > prevDosageValue) {
			PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, dosageTime, hoverSpriteIconDiv(oxyState.INCREASE), rfi18n.OXYTOCIN, currentDosageValue + ' ' + dosage.UNIT);
			mostRecentEvent = oxyState.INCREASE;
		} else if (currentDosageValue < prevDosageValue) {
			PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, dosageTime, hoverSpriteIconDiv(oxyState.DECREASE), rfi18n.OXYTOCIN, currentDosageValue + ' ' + dosage.UNIT);
			mostRecentEvent = oxyState.DECREASE;
		}
		prevDosageValue = currentDosageValue;
	}
	
	//data present, show either dosage or stop depending on the most recent state.
	$('#partoOverviewOxyDataContainer' + compID).css('display', 'inline');
	$('#partoOxyStartNoData' + compID).css('display', 'none');
	var recentDate = new Date(oxytocinData[oxyDataLen - 1].TIME);
	var formattedDate = PARTO_GRAPH_BASE.getFormattedLocalDateTime(recentDate,"FULL_DATE_TIME");
	$('#partoOxyStartDateText' + compID).text(formattedDate);
	$('#partoOverviewLegendDisplayImg' + compID).addClass(imageClasses[mostRecentEvent]);
	//show 'Stop' text in the legend
	if (oxytocinData[oxyDataLen - 1].VALUE === 0) {
		$('#partoOxyDosageContainer' + compID).css('display', 'none');
		$('#partoOxyStopText' + compID).css('display', 'inline');
		this.isOxytocinStopped = true;
	} else { // else show the dosage
		$('#' + contentID + ' .partoOxyLegendValue').text(oxytocinData[oxyDataLen - 1].VALUE + '');
		$('#' + contentID + ' .partoOxyLegendUnit').text(oxytocinData[oxyDataLen - 1].UNIT);
	}	
};

/**
 * A high level function that renders the HTML of the overview component.
 */
PartogramOverviewComponentWF.prototype.render = function() {
	var compID = this.getStyles().getContentId();
	var componentID = this.getComponentId();
	var compHTML = this.getComponentHTML();
	var self = this;
	var tableColMap = this.getSection1ColumnMapping();
	var bottomPadding = parseInt(PARTO_GRAPH_BASE.getComponentBottomPadding(), 10);
	$('#' + compID).html(compHTML);
	this.populateEpiduralData();
	this.populateOxytocinData();

	//adjust heights
	//adjust the section 1 height
	var sec1Height = parseInt($('#partoOverviewSec1Table' + componentID).css('height'), 10);
	var pregDescHeight = parseInt($('#partoOverviewPregDesc' + componentID).css('height'), 10);
	var sec1Adjustedheight = Math.max(sec1Height, pregDescHeight);
	$('#partogram-overview-section1' + componentID).css('height', sec1Adjustedheight + 'px');
	$('#partoOverviewPregDesc' + componentID).css('line-height', sec1Adjustedheight + 'px');
	
	//adjust the ROM baby heights
	$('#' + compID + ' .partoOverviewROMRow').each(function(){
		var col1Height= parseInt($(this).find('.partoOverviewROMCol1').css('height'), 10);
		var col2Height= parseInt($(this).find('.partoOverviewROMCol2').css('height'), 10);
		var adjustedHeight = Math.max(col1Height, col2Height);
		$(this).css('height', adjustedHeight + 'px');
		$(this).css('line-height', adjustedHeight + 'px');
	});
	
	//make oxytocin and epidural container's height equal to it's children
	var oxyDataHeight = parseInt($('#partoOverviewOxyCol1Data' + componentID).css('height'), 10);
	var epiDataHeight = parseInt($('#partoOverviewEpiCol1Data' + componentID).css('height'), 10);
	$('#partoOverviewEpiCol1DataContainer' + componentID).css('height', epiDataHeight + 'px');
	$('#partoOverviewOxyCol1DataContainer' + componentID).css('height', oxyDataHeight + 'px');
	
	//set the section2 containers height
	var ROMContainerHeight = parseInt($('#partoOverviewSec2ROMContainer' + componentID).css('height'), 10);
	var oxyContainerHeight = parseInt($('#partoOverviewSec2OxytocinContainer' + componentID).css('height'), 10);
	var epiContainerHeight = parseInt($('#partoOverviewSec2EpiduralContainer' + componentID).css('height'), 10);
	var finalContainerHeight = Math.max(ROMContainerHeight, Math.max(oxyContainerHeight, epiContainerHeight));
	
	$('#partogram-overview-section2' + componentID).css('height', (finalContainerHeight + bottomPadding) + 'px');
	$('#partoOverviewSec2ROMContainer' + componentID).css('height', finalContainerHeight + 'px');
	$('#partoOverviewSec2OxytocinContainer' + componentID).css('height', finalContainerHeight + 'px');
	$('#partoOverviewSec2EpiduralContainer' + componentID).css('height', finalContainerHeight + 'px');

	//center align oxytocin and epidural legend
	var epiCol2Height = parseInt($('#partoOverviewEpiCol2' + componentID).css('height'), 10);
	var oxyCol2Height = parseInt($('#partoOverviewOxyCol2' + componentID).css('height'), 10);
	var epiCol2DataHeight = parseInt($('#partoOverviewEpiCol2DataContainer' + componentID).css('height'), 10);
	var oxyCol2DataHeight = parseInt($('#partoOverviewOxyCol2DataContainer' + componentID).css('height'), 10);
	
	epiMarginTop = (epiCol2Height - epiCol2DataHeight) / 2;
	oxyMarginTop = (oxyCol2Height - oxyCol2DataHeight) / 2;
	$('#partoOverviewEpiCol2DataContainer' + componentID).css('margin-top', epiMarginTop);
	$('#partoOverviewOxyCol2DataContainer' + componentID).css('margin-top', oxyMarginTop);
	
	//adjust the widths
	var widthRatios = this.getColumnDisplayRatios();
	var displayStatuses = this.DISPLAY_STATUS;
	var presentWidthRatios = [];
	for (var i = tableColMap.GESTATIONAL_INFORMATION; i <= tableColMap.MEOWS; i++) {
		if (displayStatuses[i]) {
			presentWidthRatios.push(widthRatios[i]);
		}
	}
	$('#' + compID + ' .partoOverviewSec1Table .partoOverviewTableCol').each(function(index) {
		$(this).css('width', presentWidthRatios[index] + '%');
	});
};

/**
 * postSuccessfulRender function represents the function that is called after the overview component is loaded and rendered successfully.
 */
PartogramOverviewComponentWF.prototype.postSuccessfulRender = function() {
	this.updateLaborOnsetDate();
	var allPlacentaPresent = true;
	var placentaArray = [];
	var recordData = this.getRecordData();
	var babyData = recordData.BABY;
	var nBabies = babyData.length;
	var compID = this.getComponentId();
	var laborOnsetDate = this.partogramInfoObj.getLaborOnsetDate();
	if (nBabies > 0) {
		for (var i = 0; i < nBabies && allPlacentaPresent; i++) {
			allPlacentaPresent = allPlacentaPresent & (babyData[i].PLACENTA.length > 0);
			placentaArray = placentaArray.concat(babyData[i].PLACENTA);
		}
		if (allPlacentaPresent) {
			placentaArray.sort(function(placenta1, placenta2) {
				return new Date(placenta2.RESULT_DATE) - new Date(placenta1.RESULT_DATE);
			});
			var mostRecentValue = new Date();
			mostRecentValue.setISO8601(placentaArray[0].RESULT_VALUE);
			var timeSpent = this.getTimeSpent(laborOnsetDate.getTime(), mostRecentValue.getTime());
			$("#partoOverviewLaborOnsetPart1Hrs" + compID).text(timeSpent[0] + "");
			$("#partoOverviewLaborOnsetPart1Mins" + compID).text(timeSpent[1] + "");
		}
	}
	/*
	For future reference
	Code for updating the labor onset and epidural every minute
	var component = this;
	var laborOnsetTimer = setInterval(function() {
		component.updateLaborOnsetDate();
	}, 60 * 1000);
	if (!this.isEpiduralDiscontinued) {
		var epiduralStartTimer = setInterval(function() {
			component.updateEpiduralLegendData();
		}, 60 * 1000);
	}
	*/
};

/**
 * This function register all the events for the component.
 */
PartogramOverviewComponentWF.prototype.registerEvents = function() {
	//register the tooltips for the overview component
	var component = this;
	var compID = this.getComponentId();
	$('.partoTooltipParent').mousemove(function(e) {
		var x = e.clientX;
		var y = e.clientY;
		var tooltipRef = $(this).find('.partoTooltip');
		if (tooltipRef.length === 0) {
			return;
		}
		var tooltipHeight = parseInt($(tooltipRef).css('height'), 10);
		var tooltipWidth = parseInt($(tooltipRef).css('width'), 10);
		var windowHeight = $(window).height();
		var windowWidth = $(window).width();
		if (y + 20 + tooltipHeight > windowHeight) {
			$(tooltipRef).css('top', (y - 20 - tooltipHeight) + 'px');
		} else {
			$(tooltipRef).css('top', (y + 20) + 'px');
		}
		if (x + 20 + tooltipWidth > windowWidth) {
			$(tooltipRef).css('left', (x - 20 - tooltipWidth) + 'px');
		} else {
			$(tooltipRef).css('left', (x + 20) + 'px');
		}
	});

	$('#partoOxyToggle' + compID).click(function() {
		var from = 'partoOxy-ON';
		var to = 'partoIV-OFF';
		var visibility = 'hidden';
		var visibilityBool = false;
		if ($(this).hasClass(to)) {
			from = 'partoIV-OFF';
			to = 'partoOxy-ON';
			visibility = 'visible';
			visibilityBool = true;
		}
		$(this).removeClass(from).addClass(to);
		PARTO_GRAPH_BASE.setOxyVisibility(visibilityBool);
		PARTO_GRAPH_BASE.refreshGraph('');
		var legendToggleTimer = new CapabilityTimer("CAP:MPG.PARTOGRAMOVERVIEW.O2 - legend toggle", component.criterion.category_mean);
		if (legendToggleTimer) {
			legendToggleTimer.addMetaData('rtms.legacy.metadata.1', 'Oxytocin');
			legendToggleTimer.capture();
		}
	});

	$('#partoEpiToggle' + compID).click(function() {
		var from = 'partoEpi-ON';
		var to = 'partoIV-OFF';
		var visibility = 'hidden';
		var visibilityBool = false;
		if ($(this).hasClass(to)) {
			from = 'partoIV-OFF';
			to = 'partoEpi-ON';
			visibility = 'visible';
			visibilityBool = true;
		}
		$(this).removeClass(from).addClass(to);
		PARTO_GRAPH_BASE.setEpiVisibility(visibilityBool);
		PARTO_GRAPH_BASE.refreshGraph('');
		var legendToggleTimer = new CapabilityTimer("CAP:MPG.PARTOGRAMOVERVIEW.O2 - legend toggle", component.criterion.category_mean);
		if (legendToggleTimer) {
			legendToggleTimer.addMetaData('rtms.legacy.metadata.1', 'Epidural');
			legendToggleTimer.capture();
		}
	});
	
	/**
	 * Hovers for the epidural/oxytocin points on the horizontal bar of the topbar.
	 */
	$(document).on('mouseenter', '.partoOxyHover, .partoEpiHover', function(e) {
		var time = $(e.target).attr('time');
		var hoverHTML = PARTO_GRAPH_BASE.getHoverHTML(component.HOVER_KEY, Number(time));
		$('.partogram-top-bar-tooltip').html(hoverHTML);
		$('.partogram-top-bar-tooltip').css('display', 'block');
		var x = e.clientX;
		var y = e.clientY;
		var tooltipRef = $('.partogram-top-bar-tooltip');
		var tooltipHeight = parseInt($(tooltipRef).css('height'), 10);
		var tooltipWidth = parseInt($(tooltipRef).css('width'), 10);
		var windowHeight = $(window).height();
		var windowWidth = $(window).width();
		if (tooltipRef.length > 0) {
			if (y + 20 + tooltipHeight > windowHeight) {
				y = y - 20 - tooltipHeight;
			} else {
				y = y + 20;
			}
			if (x + 20 + tooltipWidth > windowWidth) {
				x = x - 20 - tooltipWidth;
			} else {
				x = x + 20;
			}
		}
		$(tooltipRef).offset({
			top: y,
			left: x
		});
	});

	/**
	 * Mouseleave event for the epidural/oxytocin hovers. Hide them on mouseleave
	 */
	$(document).on('mouseleave', '.partoOxyHover, .partoEpiHover', function(e) {
		$('.partogram-top-bar-tooltip').html('');
		$('.partogram-top-bar-tooltip').css('display', 'none');
	});
};
/**
 * Renders the Partogram Overview component. This method will be called after Partogram Overview component has been initialized and setup.
 *
 * @param recordData  - has the information about the patient’s health, labor history and current labor.
 */
PartogramOverviewComponentWF.prototype.renderComponent = function(recordData) {
	var timerRenderComponent = MP_Util.CreateTimer(this.getComponentRenderTimerName(), this.getCriterion().category_mean);
	var renderingCAPTimer = new CapabilityTimer("CAP:MPG.PARTOGRAMOVERVIEW.O2 - rendering component", this.getCriterion().category_mean);
	if (renderingCAPTimer) {
		renderingCAPTimer.capture();
	}
	try {
		var rfi18n = i18n.discernabu.partogramoverview_o2;
		var criterion = this.getCriterion();
		var partogramInfoSR = MP_Resources.getSharedResource("partogramInfo");
		this.partogramInfoObj = null;
		var messageHTML = '<span class="res-none">' + rfi18n.PARTO_DATA_ERROR + '</span>';
		this.loadTimer.addMetaData("component.oxytocincount", recordData.OXYTOCIN_CNT);
		var numberOfHoursShown = this.getNumberOfHoursDisplayedinPartogram();
		this.loadTimer.addMetaData("component.hourslabor",numberOfHoursShown);
		//call script in this if block, we will error if we cannot get the SharedResource			
		if (partogramInfoSR && partogramInfoSR.isResourceAvailable()) {
			this.finalizeComponent("", MP_Util.CreateTitleText(this, ""));
			recordData.BABY.sort(this.babySorter);
			this.setRecordData(recordData);
			this.partogramInfoObj = partogramInfoSR.getResourceData();
			this.render();
			this.postSuccessfulRender();
			this.registerEvents();
		} else {
			this.finalizeComponent(messageHTML, MP_Util.CreateTitleText(this, ""));
		}
		$('#' + this.getStyles().getId()).css('margin-bottom', PARTO_GRAPH_BASE.getComponentBottomPadding());
	} catch (err) {
		MP_Util.LogJSError(err, this, "partogramoverview.js", "RenderComponent");
		if (timerRenderComponent) {
			timerRenderComponent.Abort();
			timerRenderComponent = null;
		}
	} finally {
		if (timerRenderComponent) {
			timerRenderComponent.Stop();
		}
	}
};