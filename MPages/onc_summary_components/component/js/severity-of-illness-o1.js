/**
 * Create the aoav-soi component style object
 * @constructor
 */
function AoavSoiComponentWFStyle() {
	this.initByNamespace("aoav_soi");
}

AoavSoiComponentWFStyle.prototype = new ComponentStyle();
AoavSoiComponentWFStyle.prototype.constructor = ComponentStyle;

/**
 * The AoavSoi component will retrieve severity of illness details associated to the patient
 * @constructor
 * @param {Criterion} criterion  The Criterion object which contains information needed to render the component.
 */
function AoavSoiComponentWF(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new AoavSoiComponentWFStyle());

	//Set the timer names so the architecture will create the correct timers for our use
	this.setComponentLoadTimerName("USR:MPG.AOAV-SOI.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.AOAV-SOI.O1 - render component");
	this.m_compViewCont = $("#vwpBody");
	this.m_showPanel = true;
	//variable used to find out whether side panel is visible
	this.physiologyIndexArr = [];
	//array created for physiology index details
	this.supportIndexArr = [];
	//array created for support index array
	this.deteriorationIndexArr = [];
	//array created for deterioration index array
	this.comorbidityIndexArr = [];
	//array created for comorbidity index array
	this.icuMortalityRisk = [];
	//array created for icu mortality risk values
	this.hospitalMortalityRisk = [];
	//array created for hospital mortality risk values
	this.soiScore = [];
	//array created for soi score values
	this.levelOfCare = [];
	//array of level of care values
	this.m_soiSidePanelObj = null;
	//variable for CompSidePanel object
	this.soiI18n = i18n.discernabu.soi;
	this.m_sidePanelContainer = null;
	//variable for side panel container jquery object in pixels
	this.MAX_SOISP_HEIGHT = 500;
	//variable to hold maximum height of side panel in pixels
	this.MIN_SOISP_HEIGHT = 350;
	//variable to hold minimum height of side panel in pixels
	this.SOISP_WIDTH = 440;
	//variable to hold width of side panel in pixels
	this.MAX_HEIGHT_SOISP_BODY = 500;
	//500 pixels for max height of body of side panel in pixels
	this.unitDisplayNamesArr = [];
	//variable to hold unit of measure display names in order for each day
	this.requiredUnitsOfMeasure = [];
	//required units of measure for physiology details
	this.aoavResult = [];
	//Added tooltip on graph
	this.chartDayTooltip = null;
	//Container variable for attaching y-axis div to the chart
	this.soiContentContainer = null;
	//Holds SOI Content Container last updated width
	this.soiContentContainerRecentWidth = 0;
	//Used to check whether reloading of graph is required on redrawing the chart
	this.reloadGraph = false;
	/*LOS variables*/
	this.benchmarkHospitalLos = 0.0;
	//variable for benchmark hospital length of stay value
	this.benchmarkICULos = 0.0;
	//variable for benchmark ICU length of stay value
	this.actualHospitalLos = 0.0;
	//variable for actual hospital length of stay value
	this.actualICUlos = 0.0;
	//variable for actual ICU length of stay value
	this.predictedRemainingHospitalLos = 0.0;
	//variable for predicted remaining Hospital length of stay value
	this.predictedRemainingICULos = 0.0;
	//variable for predicted remaining ICU length of stay value
	/*LOS tool tip variables*/
	this.benchmarkHospLosTooltip = null;
	//variable to setup tooltip for benchmark hospital length of stay
	this.benchmarkICULosTooltip = null;

	var self = this;
	this.chartData = function() {
		this.soiPlot = null;
		this.chartId = "soiChart" + self.getComponentId();
		this.chartContainer = null;
		this.chartMainDivContainer = null;
		this.chartMainDivWidth = 0;
		this.selectedDay = 0;
		this.soiPlotOptionsObj = null;
		this.soiGraphOptions = [];

		//Variables used to to set graph and side panel to same height.
		this.graphHeight = 0;
		this.dynamicSidePanelHeight = this.m_sidePanelContainer ? this.m_sidePanelContainer.height() : self.m_soiSidePanelHeight;
		this.scrollbarHeight = 0;

		//Variable used to calculate graph width in percentage
		this.graphWidthPercent = 0.59;

		//Variables used to show or hide chart axes and graph container border based
		//on scroll bar visibility.
		this.currentScrollClass = "";
		this.scrollClass = " aoav_soi-chart-on-scroll ";
		this.noScrollClass = " aoav_soi-chart-no-scroll ";

		//Lock to ignore the graph scroll event on firing subsequent event calls.
		this.isGraphScrolled = false;
		//Scroll offset - Used to restore the offset position if required.
		this.graphScrollOffset = 0;

		//Information of chart for "On Demand" load while scrolling.
		this.FIRST_TIME_LOAD = true;
		this.TOTAL_DAYS = 0;
		this.TOTAL_LOAD_DAYS = 0;
		this.PREDICTED_LOS_STAY = 0;
		this.INITIAL_LOAD_DAY = -1;
		this.LAST_LOAD_DAY = -1;
		//Total number of visible days to the user in the graph.
		this.VISIBLE_DAYS = 0;
		//Used to check whether the day information is loaded in the graph.
		this.DAY_LOADED = [];
		//Start Day number which is visible to the user in the graph.
		this.LOAD_DAY_TRIGGERED = -1;

		//Graph X axis tick height in px.
		this.X_AXIS_TICK_HEIGHT = 24;
		//Graph Y axis tick height in px.
		this.Y_AXIS_TICK_HEIGHT = 55;
		//Contains entire width of the graph if it has scrollbar.
		this.GRAPH_SCROLL_WIDTH = 0;
		//Set the graph minimum day width based on the locale set for "Day" text.
		this.DAY_MIN_WIDTH = self.soiI18n.DAY_TEXT.length <= 3 ? 51 : 54;
		//Ignorable day width in % (25%). Day would be visible only if it is >25% of visibility.
		this.IGNORABLE_WIDTH = 0.25;
		//Based on the scroll bar speed to X pixel / Y ms - Fire the event to load additional graph data.
		this.SCROLL_BAR_SPEED_TO_LOAD_DATA = 1000;
		this.SCROLL_BAR_PIXEL_MOVEMENT = 40;
	};
	this.chartDataObj = null;
}

AoavSoiComponentWF.prototype = new MPageComponent();
AoavSoiComponentWF.prototype.constructor = MPageComponent;

//GETTERS AND SETTERS FOR ARRAYS CONTAINING JSON DATA

/**
 * Returns the jqplot object.
 *
 * @return {object} A reference to the jqplot object.
 */
AoavSoiComponentWF.prototype.getAoavPlot = function() {
	return this.chartDataObj.soiPlot;
};

/**
 * gets the requiredUnitsOfMeasure array
 * @return {array} requiredUnitsOfMeasure - required units of measure for physiology details
 */
AoavSoiComponentWF.prototype.getRequiredUnitsOfMeasure = function() {
	if (!this.requiredUnitsOfMeasure) {
		this.requiredUnitsOfMeasure = null;
	}
	return this.requiredUnitsOfMeasure;
};

/**
 * Store a reference to the jqplot object
 *
 * @param {object}
 *                plot - A reference to the jqplot object
 */
AoavSoiComponentWF.prototype.setAoavPlot = function(plot) {
	this.chartDataObj.soiPlot = plot;
};

/**
 * sets the requiredUnitsOfMeasure array
 * @param {array} reqdUnitsOfMeasure - required units of measure for physiology details
 * @return null
 */
AoavSoiComponentWF.prototype.setRequiredUnitsOfMeasure = function(reqdUnitsOfMeasure) {
	if (!( reqdUnitsOfMeasure instanceof Array)) {
		throw new Error("requiredUnitsOfMeasure array is not of Array type");
	}
	this.requiredUnitsOfMeasure = reqdUnitsOfMeasure;
};

/**
 * gets the unitDisplayNamesArr array
 * @return {array} unitDisplayNamesArr - units of measure display names for each day
 */
AoavSoiComponentWF.prototype.getUnitDisplayNamesArr = function() {
	if (!this.unitDisplayNamesArr) {
		this.unitDisplayNamesArr = null;
	}
	return this.unitDisplayNamesArr;
};

/**
 * sets the unitDisplayNamesArr array
 * @param {array} unitDisplayNamesArr - units of measure display names for each day
 * @return null
 */
AoavSoiComponentWF.prototype.setUnitDisplayNamesArr = function(unitsOfMeasure) {
	if (!( unitsOfMeasure instanceof Array)) {
		throw new Error("unitDisplayNamesArr array is not of Array type");
	}
	this.unitDisplayNamesArr = unitsOfMeasure;
};

//GETTERS AND SETTERS FOR LOS HOVER DISPLAY
/**
 * gets the benchmark hospital length of stay value
 * @return {number} benchmarkHospitalLos - benchmark hospital length of stay value
 */
AoavSoiComponentWF.prototype.getBenchmarkHospitalLos = function() {
	return this.benchmarkHospitalLos;
};

/**
 * sets the benchmark hospital length of stay value
 * @param {number} benchmarkHospitalLos - benchmark hospital length of stay value
 * @param {boolean} bmHospLosInd - Indicator for benchmark hospital length of stay availability
 * @return null
 */
AoavSoiComponentWF.prototype.setBenchmarkHospitalLos = function(bmHospLos, bmHospLosInd) {
	if ( typeof bmHospLos !== 'number') {
		throw new Error("Invalid benchmark Hospital LOS value passed.");
	}
	this.benchmarkHospitalLos = (!bmHospLosInd) ? "--" : bmHospLos.toFixed(1);
};

/**
 * gets the benchmark ICU length of stay value
 * @return {number} benchmarkICULos - benchmark ICU length of stay value
 */
AoavSoiComponentWF.prototype.getBenchmarkICULos = function() {
	return this.benchmarkICULos;
};

/**
 * sets the benchmark ICU length of stay value
 * @param {number} bmICULos - benchmark ICU length of stay value
 * @param {boolean} bmICULosInd - Indicator for benchmark ICU length of stay availability
 * @return null
 */
AoavSoiComponentWF.prototype.setBenchmarkICULos = function(bmICULos, bmICULosInd) {
	if ( typeof bmICULos !== 'number') {
		throw new Error("Invalid benchmark ICU LOS value passed.");
	}
	this.benchmarkICULos = (!bmICULosInd) ? "--" : bmICULos.toFixed(1);
};

/**
 * gets the actual hospital length of stay value
 * @return {number} actualHospitalLos - actual hospital length of stay value
 */
AoavSoiComponentWF.prototype.getActualHospitalLos = function() {
	return this.actualHospitalLos;
};

/**
 * sets the actual hospital length of stay value
 * @param {number} actHospLos - actual hospital length of stay value
 * @param {boolean} actHospLosInd - Indicator for actual hospital length of stay availability
 * @return null
 */
AoavSoiComponentWF.prototype.setActualHospitalLos = function(actHospLos, actHospLosInd) {
	if ( typeof actHospLos !== 'number') {
		throw new Error("Invalid actual Hospital LOS value passed.");
	}
	this.actualHospitalLos = (!actHospLosInd) ? "--" : actHospLos.toFixed(1);
};


/**
 * gets the actual ICU length of stay value
 * @return {number} actualICULos - benchmark ICU length of stay value
 */
AoavSoiComponentWF.prototype.getActualICULos = function() {
	return this.actualICULos;
};

/**
 * sets the actual ICU length of stay value
 * @param {number} actICULos - actual ICU length of stay value
 * @param {boolean} actICULosInd - Indicator for actual ICU length of stay availability
 * @return null
 */
AoavSoiComponentWF.prototype.setActualICULos = function(actICULos, actICULosInd) {
	if ( typeof actICULos !== 'number') {
		throw new Error("Invalid actual ICU LOS value passed.");
	}
	this.actualICULos = (!actICULosInd) ? "--" : actICULos.toFixed(1);
};

/**
 * gets the predicted remaining  hospital length of stay value
 * @return {number} predictedRemainingHospitalLos - predicted remaining  hospital length of stay value
 */
AoavSoiComponentWF.prototype.getPredictedRemainingHospitalLos = function() {
	return this.predictedRemainingHospitalLos;
};

/**
 * sets the predicted remaining hospital length of stay value
 * @param {number} predRemHospLos - predicted remaining hospital length of stay value
 * @param {boolean} predRemHospLosInd - Indicator for predicted remaining hospital length of stay availability
 * @return null
 */
AoavSoiComponentWF.prototype.setPredictedRemainingHospitalLos = function(predRemHospLos, predRemHospLosInd) {
	if ( typeof predRemHospLos !== 'number') {
		throw new Error("Invalid predicted remaining Hospital LOS value passed.");
	}
	this.predictedRemainingHospitalLos = (!predRemHospLosInd) ? "--" : predRemHospLos.toFixed(1);
};

/**
 * gets the predicted remaining ICU length of stay value
 * @return {number} predictedRemainingICULos - predicted remaining  ICU length of stay value
 */
AoavSoiComponentWF.prototype.getPredictedRemainingICULos = function() {
	return this.predictedRemainingICULos;
};

/**
 * sets the predicted remaining ICU length of stay value
 * @param {number} predRemICULos - predicted remaining ICU length of stay value
 * @param {boolean} predRemICULosInd - Indicator for predicted remaining ICU length of stay availability
 * @return null
 */
AoavSoiComponentWF.prototype.setPredictedRemainingICULos = function(predRemICULos, predRemICULosInd) {
	if ( typeof predRemICULos !== 'number') {
		throw new Error("Invalid predicted remaining ICU LOS value passed.");
	}
	this.predictedRemainingICULos = (!predRemICULosInd) ? "--" : predRemICULos.toFixed(1);
};

//END OF GETTERS AND SETTERS LENGTH OF STAY VARIABLES
/**
 * This function is used to retrieve the severity of illness details through a call to ccl script
 * @returns {null}
 */
AoavSoiComponentWF.prototype.retrieveComponentData = function() {
	var criterion = this.getCriterion();
	var compId = this.getComponentId();
	var self = this;
	//Start day number to get the data from server. -1 to get initial data and upon scrolling,
	//the exact start day number need to be passed to get additional data.
	var startDayNumber = -1;
	var renderAoavSoi = "<div class='aoav_soi-main-cont'><div class='aoav_soi-error-div' id = 'soiGeneralErrorDiv" + compId + "'></div></div>";
	var sendAr = ["^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.encntr_id + ".0", startDayNumber];
	var newAoavSoiScriptRequest = new ComponentScriptRequest();
	var viewCatagoryMean = criterion.category_mean;
	var loadTimer = new RTMSTimer(this.getComponentLoadTimerName(), viewCatagoryMean);
	var renderTimer = new RTMSTimer(this.getComponentRenderTimerName(), viewCatagoryMean);
	newAoavSoiScriptRequest.setProgramName("MP_GET_AOAV_SOI");
	newAoavSoiScriptRequest.setParameterArray(sendAr);
	newAoavSoiScriptRequest.setComponent(this);
	newAoavSoiScriptRequest.setLoadTimer(loadTimer);
	newAoavSoiScriptRequest.setRenderTimer(renderTimer);
	newAoavSoiScriptRequest.setResponseHandler(function(scriptReply) {
		self.scriptStatus = scriptReply.getResponse().STATUS_DATA.STATUS;
		if (scriptReply.getResponse().STATUS_DATA.STATUS !== "F") {
			self.renderComponent(scriptReply.m_responseData);
		}
		else if (scriptReply.getResponse().STATUS_DATA.STATUS === "F") {
			self.finalizeComponent(renderAoavSoi, MP_Util.CreateTitleText(self));
			self.createBannersForErrors(MPageUI.ALERT_OPTIONS.TYPE.ERROR, self.soiI18n.PRIMARY_SERVER_ERROR_STRING, self.soiI18n.SECONDARY_SERVER_ERROR_STRING);
		}
		else {
			self.finalizeComponent(MP_Util.HandleErrorResponse(self.getStyles().getNameSpace()), (self.isLineNumberIncluded() ? "(0)" : ""));
		}
	});
	newAoavSoiScriptRequest.performRequest();

};

/**
 * function to create the table which contains index values and mortality values
 * changes data when day changes on button click
 * separate row strings created for each row (all 4 indices and mortality risks and soi score)
 * @param {Object} aoavSoiResult json data object
 * @param {integer} day number for which diagnosis needs to be displayed
 * @returns null
 */
AoavSoiComponentWF.prototype.createSoiIndexTableInSidePanel = function(day) {
	var soiIndexTablePhyRow;
	var soiIndexTableComRow;
	var soiIndexTableSupRow;
	var soiIndexTableDetRow;
	var emptyRow;
	var soiScoreRow;
	var icuRiskOfMortalityRow;
	var hospitalRiskOfMortalityRow;
	var percentageText = "<span class='aoav_soi-percentage-text'>%</span>";
	var detIndexArray = this.deteriorationIndexArr;
	var phyIndexArray = this.physiologyIndexArr;
	var comIndexArray = this.comorbidityIndexArr;
	var supIndexArray = this.supportIndexArr;
	var icuMorRiskArray = this.icuMortalityRisk;
	var hospMorRiskArray = this.hospitalMortalityRisk;
	var soiScoreArray = this.soiScore;
	var soiRange = this.soiScoreRange[day - 1];
	var colonText = ":";

	//removing the previous table present in side panel after changing day
	this.m_soiIndexTableContainer.find("table.aoav_soi-index-table").remove();

	//Create diagnosis list for most recent day
	//Returns SOI index table row HTML based on index array data and its respective classes.
	var getSoiIndexTableRow = function retrieveSoiIndexTableRow(indexArrayData, indexIconClass, indexValueClass) {
		indexIconClass = indexIconClass ? indexIconClass : "";
		indexValueClass = indexValueClass ? indexValueClass : "";

		var indexTableRow = "<tr><td class='aoav_soi-index-icons'><div class='" + indexIconClass + "'></div></td>";
		indexTableRow += "<td class='aoav_soi-index-labels'>" + indexArrayData.label + colonText + "</td>";
		indexTableRow += "<td class='aoav_soi-index-values " + indexValueClass + "'>" + indexArrayData.value + "</td></tr>";
		return indexTableRow;
	};

	//Create rows for different indices and hospital and icu mortality risk values.
	indexTableRowHTML = getSoiIndexTableRow(phyIndexArray[day - 1], "aoav_soi-phy-square") + getSoiIndexTableRow(comIndexArray[day - 1], "aoav_soi-com-square") +
						getSoiIndexTableRow(supIndexArray[day - 1], "aoav_soi-sup-square") + getSoiIndexTableRow(detIndexArray[day - 1], "aoav_soi-det-square", "aoav_soi-separating-border");
	soiScoreRow = "<tr><td class='aoav_soi-index-icons'></td><td class='aoav_soi-index-labels'>" + this.soiI18n.SEVERITY_OF_ILLNESS_TEXT + colonText + 
					"</td><td class='aoav_soi-index-values aoav_soi-score'>" + soiScoreArray[day - 1] + "</td></tr>";
	emptyRow = "<tr class='aoav_soi-index-table-empty-row'></tr>";

	//Returns risk ratio table row HTML based on risk label, value and risk percentage.
	var getRiskRatioRow = function retrieveRiskRatioRow(riskClass, label, morRiskArrayValue, percentageText) {
		percentageText = percentageText ? percentageText : "";

		var riskRatioRow = "<tr><td class='aoav_soi-index-icons'><div class='" + riskClass + "'></div></td><td class='aoav_soi-index-labels'>";
		riskRatioRow += label + "</td><td class='aoav_soi-index-values'>" + morRiskArrayValue + percentageText + "</td></tr>";
		return riskRatioRow;
	};

	/*Checking whether ICU mortality risk has a a valid value
	 * if yes -> show the ICU mortality row
	 * else -> make empty string for the row
	 */
	if (isNaN(icuMorRiskArray[day - 1])) {
		icuRiskOfMortalityRow = "";
	}
	else {
		icuRiskOfMortalityRow = getRiskRatioRow("aoav_soi-triangle", this.soiI18n.ICU_RISK_OF_MORTALITY_LABEL, icuMorRiskArray[day - 1], percentageText);
	}
	if (isNaN(hospMorRiskArray[day - 1])) {
		hospitalRiskOfMortalityRow = getRiskRatioRow("aoav_soi-circle", this.soiI18n.HOSPITAL_RISK_OF_MORTALITY_LABEL, hospMorRiskArray[day - 1]);
	}
	else {
		hospitalRiskOfMortalityRow = getRiskRatioRow("aoav_soi-circle", this.soiI18n.HOSPITAL_RISK_OF_MORTALITY_LABEL, hospMorRiskArray[day - 1], percentageText);
	}

	var soiIndexJoinedTableRows = [indexTableRowHTML, soiScoreRow, emptyRow, icuRiskOfMortalityRow, hospitalRiskOfMortalityRow].join("");
	
	this.m_soiSidePanelScrollContainer.find(".aoav_soi-diagnosis-content").remove();
	var soiDiagnosisData = "<div class='aoav_soi-diagnosis-content'> <div class='aoav_soi-diagnosis-first-col'>&nbsp;</div>"+
		"<div class='aoav_soi-diagnosis-data'><span class = 'aoav_soi-diagnosis-text'>" + this.soiI18n.DIAGNOSIS_TEXT + "</span>";
	
	
	var diagnosisData = this.diagnosisDetails[day - 1];
	if (diagnosisData.length === 0) {
		soiDiagnosisData += "<span class='aoav_soi-empty-diagnosis'>--</span>";
	}
	else {
		soiDiagnosisData += "<ol class='aoav_soi-diagnosis-ordered-list'>";
		for (var idx = 0; idx < diagnosisData.length; idx++) {
			//To check whether the identifier is a number
			soiDiagnosisData += "<li><span>" + diagnosisData[idx].sourceIdentifier + " " + diagnosisData[idx].sourceString + "</span></li>";
		}
	}
	soiDiagnosisData += "</ol></div></div>";

	//append all the created rows to soi index table container
	this.m_soiIndexTableContainer.append("<table class='aoav_soi-index-table'>" + soiIndexJoinedTableRows + "</table>"+soiDiagnosisData);
	this.setDiagnosisDivWidth();
	//call the changeSOIScoreCss function to change css of scores displayed based on criticality
	this.changeSOIScoreCss(soiRange);
};

/**
 * function to create comorbidity details table below Physiology details table
 * takes the day number and uses comorbidityDetails array to get comorbidity
 * components. The header row and other rows are appended to table container
 * @param {Integer} dayNum the day number for which graph was clicked
 * @return {null}
 */
AoavSoiComponentWF.prototype.createComorbidityDetailsTable = function(dayNum) {
	var compId = this.getComponentId();
	var self = this;
	var comDetailsRowsString = [];
	var comorbidityIndexArray = this.comorbidityIndexArr;
	var comDetailsArr = comorbidityIndexArray[dayNum - 1].components;
	var comDetailsLength = comDetailsArr.length;
	var comTableContainer = $("#soiComDetailsTable" + compId);
	//removing the previous table from side panel for previous button click
	comTableContainer.remove();
	//putting heading of div as comorbidity index label
	this.m_soiComDetailsContainer.find(".aoav_soi-index-details-header span").text(comorbidityIndexArray[dayNum - 1].label);
	//appending table to soi index details container div
	this.m_soiComDetailsContainer.append("<table class = 'aoav_soi-index-details-table aoav_soi-com-details-table' id = 'soiComDetailsTable" + compId + "'></table>");
	//creating comorbidity details table container
	var newComTableContainer = $("#soiComDetailsTable" + compId);
	//appending header columns to table
	newComTableContainer.append("<tr><th class = 'aoav_soi-percentage-col'>%</th><th class = 'aoav_soi-item-col'> " + this.soiI18n.ITEM + " </th></tr>");
	for (var i = 0; i < comDetailsLength; i++) {
		var comSubCatgories = comDetailsArr[i];
		comDetailsRowsString.push("<tr><td>" + comSubCatgories.percentValue + "</td><td>" + comSubCatgories.componentName + "</td></tr>");
		var subCategoryLength = comSubCatgories.comorbidities.length;
		for (var k = 0; k < subCategoryLength; k++) {
			comDetailsRowsString.push("<tr><td></td><td><ul class='aoav_soi-com-sub'><li>" + comSubCatgories.comorbidities[k].sourceString + "&nbsp; &nbsp;" + comSubCatgories.comorbidities[k].sourceIdentifier +  "</li></ul></td></tr>");
		
		}
	}
	if (comDetailsLength < 1) {
		comDetailsRowsString.push("<tr><td>--</td><td>--</td></tr>");
	}
	newComTableContainer.append(comDetailsRowsString.join(""));
};

/**
 * function to create Support details table below Comorbidity details table
 * takes the day number and uses supportDetails array to get support
 * components. The header row and other rows are appended to table container
 * @param {Integer} dayNum the day number for which graph was clicked
 * @return {null}
 */
AoavSoiComponentWF.prototype.createSupportDetailsTable = function(dayNum) {
	var compId = this.getComponentId();
	var self = this;
	var supportDetailsRowsString = [];
	var supportIndexArray = this.supportIndexArr;
	var supportDetailsArr = supportIndexArray[dayNum - 1].components;
	var supportDetailsLength = supportDetailsArr.length;
	var supportTableContainer = $("#soiSupDetailsTable" + compId);

	//removing the previous table from side panel for previous button click
	supportTableContainer.remove();
	//putting heading of div as support index label
	this.m_soiSupDetailsContainer.find(".aoav_soi-index-details-header span").text(supportIndexArray[dayNum - 1].label);
	//appending table to soi index details container div
	this.m_soiSupDetailsContainer.append("<table class = 'aoav_soi-index-details-table aoav_soi-sup-details-table' id = 'soiSupDetailsTable" + compId + "'></table>");
	//creating support details table container
	var newSupTableContainer = $("#soiSupDetailsTable" + compId);
	//appending header columns to table
	newSupTableContainer.append("<tr><th class = 'aoav_soi-percentage-col'>%</th><th class = 'aoav_soi-item-col'> " + this.soiI18n.ITEM + " </th></tr>");
	for (var i = 0; i < supportDetailsLength; i++) {
		supportDetailsRowsString.push("<tr><td>" + supportDetailsArr[i].percent + "</td><td>" + supportDetailsArr[i].itemDisplay + "</td></tr>");
	}
	if (supportDetailsLength < 1) {
		supportDetailsRowsString.push("<tr><td>--</td><td>--</td></tr>");
	}
	newSupTableContainer.append(supportDetailsRowsString.join(""));
};

/**
 * function to create Deterioration details table below Support details table
 * takes the day number and uses deteriorationDetails array to get Deterioration
 * components. The header row and other rows are appended to table container
 * @param {Integer} dayNum the day number for which graph was clicked
 * @return {null}
 */
AoavSoiComponentWF.prototype.createDeteriorationDetailsTable = function(dayNum) {
	var compId = this.getComponentId();
	var self = this;
	var detDetailsRowsString = [];
	var deteriorationIndexArray = this.deteriorationIndexArr;
	var detDetailsArr = deteriorationIndexArray[dayNum - 1].components;
	var detDetailsLength = detDetailsArr.length;
	var detTableContainer = $("#soiDetDetailsTable" + compId);
	//removing the previous table from side panel for previous button click
	detTableContainer.remove();
	//putting heading of div as comorbidity index label
	this.m_soiDetDetailsContainer.find(".aoav_soi-index-details-header span").text(deteriorationIndexArray[dayNum - 1].label);
	//appending table to soi index details container div
	this.m_soiDetDetailsContainer.append("<table class = ' aoav_soi-index-details-table aoav_soi-det-details-table' id = 'soiDetDetailsTable" + compId + "'></table>");
	//creating comorbidity details table container
	var newDetTableContainer = $("#soiDetDetailsTable" + compId);
	//appending header columns to table
	newDetTableContainer.append("<tr><th class = 'aoav_soi-percentage-col'>%</th><th class = 'aoav_soi-item-col'> " + this.soiI18n.ITEM + " </th></tr>");
	for (var i = 0; i < detDetailsLength; i++) {
		detDetailsRowsString.push("<tr><td>" + detDetailsArr[i].percent + "</td><td>" + detDetailsArr[i].itemDisplay + "</td></tr>");
	}
	if (detDetailsLength < 1) {
		detDetailsRowsString.push("<tr><td>--</td><td>--</td></tr>");
	}
	newDetTableContainer.append(detDetailsRowsString.join(""));
	this.m_soiSidePanelObj.resizePanel(self.MAX_SOISP_HEIGHT);
};

/**
 * function to create physiology details table below diaagnosis list
 * takes the day number and uses physiologyDetails array to get physiology
 * components. The header row and other rows are appended to table container
 * @param {Integer} dayNum the day number for which graph was clicked
 * @return {null}
 */
AoavSoiComponentWF.prototype.createPhysiologyDetailsTable = function(dayNum) {
	var compId = this.getComponentId();
	var self = this;
	var phyDetailsRowsString = [];
	var physiologyIndexArray = this.physiologyIndexArr;
	var piDetailsArr = physiologyIndexArray[dayNum - 1].components;
	var piDetailsLength = piDetailsArr.length;
	var phyTableContainer = $("#soiPhyDetailsTable" + compId);
	var requiredUnitsOfMeasureArr = this.getRequiredUnitsOfMeasure();
	var requiredUnitsOfMeasureLen = requiredUnitsOfMeasureArr.length;
	//removing the previous table from side panel for previous button click
	phyTableContainer.remove();
	//putting heading of div as physiology index label
	this.m_soiPhyDetailsContainer.find(".aoav_soi-index-details-header span").text(physiologyIndexArray[dayNum - 1].label);
	//appending table to soi index details container div
	this.m_soiPhyDetailsContainer.append("<table class = 'aoav_soi-index-details-table aoav_soi-phy-details-table' id = 'soiPhyDetailsTable" + compId + "'></table>");
	//creating physiology details table container
	var newPhyTableContainer = $("#soiPhyDetailsTable" + compId);
	//appending header columns to table
	newPhyTableContainer.append("<tr><th class = 'aoav_soi-percentage-col'>%</th><th class = 'aoav_soi-body-system-col aoav_soi-phyIndex-details-col'> " + this.soiI18n.BODY_SYSTEM + " </th><th class = 'aoav_soi-high-col'> " + this.soiI18n.HIGH + " </th><th class = 'aoav_soi-median-col'> " + this.soiI18n.MEDIAN + " </th><th class= 'aoav_soi-low-col'> " + this.soiI18n.LOW + " </th></tr>");

	/*
	 *creating unit of measure array for each day according to order of physiology details
	 *if unit of measure alreasy present in order for particular day
	 *then no need to arrange again
	 */
	var unitOfDisplayNamesArray = this.getUnitDisplayNamesArr();

	if (unitOfDisplayNamesArray[dayNum - 1].length === 0) {
		unitOfDisplayNamesArray[dayNum - 1] = [];
		for (var idx = 0; idx < piDetailsLength; idx++) {
			for (var k = 0; k < requiredUnitsOfMeasureLen; k++) {
				if (piDetailsArr[idx].unitOfMeasureCd === requiredUnitsOfMeasureArr[k].codeValue) {
					unitOfDisplayNamesArray[dayNum - 1].push(requiredUnitsOfMeasureArr[k].display);
				}
			}
		}
		self.setUnitDisplayNamesArr(unitOfDisplayNamesArray);
	}
	/*creating rows for table
	 *here the median values for HCT PLT and Sodium are N/A
	 *checking for 0,1 and -1 value indicators
	 * for 0 "--" shown and for -1 "N/A" shown
	 */
	var disabledColSpan = "<span class = 'aoav_soi-disabled'>N/A</span>";
	for (var i = 0; i < piDetailsLength; i++) {
		phyDetailsRowsString.push("<tr><td>" + (piDetailsArr[i].percentInd ? piDetailsArr[i].percent : "--") +
											 "</td><td class='aoav_soi-phyIndex-details-col'><span><span>" +
											  piDetailsArr[i].bodySystemDisplay +
											  "<span class='aoav_soi-unit-of-measure'>(" +
											  this.getUnitDisplayNamesArr()[dayNum - 1][i] + ")</span></span></span></td><td class='aoav_soi-phy-high'>" +
											  (piDetailsArr[i].highFlag == 1 ? piDetailsArr[i].high : (piDetailsArr[i].highFlag === 0) ? "--" : disabledColSpan) + 
											  "</td><td class='aoav_soi-phy-median'>" +
											  (piDetailsArr[i].medianFlag == 1 ? piDetailsArr[i].median : (piDetailsArr[i].medianFlag === 0) ? "--" : disabledColSpan) +
											  "</td><td class='aoav_soi-phy-low'>" + (piDetailsArr[i].lowFlag == 1 ? piDetailsArr[i].low : (piDetailsArr[i].lowFlag === 0) ? "--" : disabledColSpan) +
											  "</td></tr>");
	}
	newPhyTableContainer.append(phyDetailsRowsString.join(""));
};

/**
 * function to get unit of measure display names for physiology details
 * gets them for the latest day in an array
 * later values from that array are used for other days
 * @param {Integer} dayNum most recent day using which all unit of measures are fetched
 * @return {null}
 */
AoavSoiComponentWF.prototype.getSoiUnitOfMeasure = function(dayNum) {
	var self = this;
	if (this.getRequiredUnitsOfMeasure().length === 0) {
		var requiredUnitsOfMeasureArray = [];
		var unitOfMeasureCodes = null;
		MP_Util.GetCodeSetAsync(54, function(unitOfMeasureCodes) {
			var unitCodeArrLen = unitOfMeasureCodes.length;
			for (var j = 0; j < self.physiologyIndexArr[dayNum - 1].components.length; j++) {
				for (var idx = 0; idx < unitCodeArrLen; idx++) {
					if (unitOfMeasureCodes[idx].CODE == self.physiologyIndexArr[dayNum - 1].components[j].unitOfMeasureCd) {
						requiredUnitsOfMeasureArray.push({
							"codeValue" : unitOfMeasureCodes[idx].CODE,
							"meaning" : unitOfMeasureCodes[idx].MEANING,
							"display" : unitOfMeasureCodes[idx].DISPLAY
						});
					}
				}
			}
			self.setRequiredUnitsOfMeasure(requiredUnitsOfMeasureArray);
			self.createPhysiologyDetailsTable(dayNum);
		});
	}
	else {
		self.createPhysiologyDetailsTable(dayNum);
	}
};

/**
 * Create the date time string as per the format given in UI using dateFormat API.
 *
 * @param {String}  dateGiven string for required day.
 *
 * @returns {String} string of the date for the day being shown in side panel.
 */
AoavSoiComponentWF.prototype.createDateString = function(dateGiven) {
	try {
		var curDate = new Date();
		curDate.setISO8601(dateGiven);
		return dateFormat(curDate, dateFormat.masks.longDate) + " " + dateFormat(curDate, dateFormat.masks.militaryTime);
	}
	catch (error) {
		MP_Util.LogJSError(error, this, "aoav-soi-o1.js", "createDateString");
	}
};

/**
 * Click event for day label and column on the graph.
 *  - Updates graph selection and side panel data on selecting the day.
 *
 *  @param {Number} dayNumber - selected day number
 */
AoavSoiComponentWF.prototype.graphClickEventHandler = function(dayNumber) {
	var self = this;
	var compId = this.getComponentId();
	var chartDataObj = this.chartDataObj;
	var aoavSoiResult = this.m_reply;
	var selectedDay = parseInt(dayNumber, 10);

	//Update the side panel only if selected day data has been received from the service/CCL.
	if (this.soiDataPresent[selectedDay - 1]) {
		var reCalculateGraphSize = false;
		if (!self.m_showPanel) {
			// Element is visible
			self.m_showPanel = true;
			self.m_soiIndexDivContainer.show();
			self.m_soiSidePanelObj.showPanel();
			chartDataObj.graphWidthPercent = 0.59;
			reCalculateGraphSize = true;
		}
		self.m_soiSidePanelMainHeaderCont.find(".aoav_soi-day-number").text(dayNumber);
		var dateText = self.createDateString(self.dateOfTheDay[dayNumber - 1]);
		self.m_soiSidePanelMainHeaderCont.find(".aoav_soi-day-date").text(dateText);
		self.createSoiIndexTableInSidePanel(selectedDay);
		self.createPhysiologyDetailsTable(selectedDay);
		self.createComorbidityDetailsTable(selectedDay);
		self.createSupportDetailsTable(selectedDay);
		self.createDeteriorationDetailsTable(selectedDay);

		//Upon selecting a day from graph header/X2 ticks, show the corresponding data in side panel.
		if (chartDataObj.selectedDay !== selectedDay || reCalculateGraphSize) {
			chartDataObj.selectedDay = selectedDay;
			self.m_soiGraphContainer.find(".aoav_soi-graph-day-button-selected").removeClass("aoav_soi-graph-day-button-selected");
			$("#button_" + chartDataObj.selectedDay + "_" + compId).addClass("aoav_soi-graph-day-button-selected");
			self.reDrawGraph(true, reCalculateGraphSize);
		}
	}
};

/**
 * function to change css of cell containing soi score removes the attached
 * classes and adds a new class based on score range called inside
 * createIndexTable(day) function
 * @param {Integer} soiRange for a particular day
 * @returns null
 */
AoavSoiComponentWF.prototype.changeSOIScoreCss = function(soiRange) {
	var soiIndexTable = this.m_soiIndexTableContainer;
	switch (soiRange) {
		case "":
			soiIndexTable.find("td.aoav_soi-score").removeClass("aoav_soi-range-normal aoav_soi-range-critical aoav_soi-range-high").addClass("aoav_soi-range-null");
			break;
		case "HIGH":
			soiIndexTable.find("td.aoav_soi-score").removeClass("aoav_soi-range-normal aoav_soi-range-critical aoav_soi-range-null").addClass("aoav_soi-range-high");
			soiIndexTable.find("td.aoav_soi-score").prepend("<span class='aoav_soi-image-high'></span>");
			break;
		case "NORMAL":
			soiIndexTable.find("td.aoav_soi-score").removeClass("aoav_soi-range-high aoav_soi-range-critical aoav_soi-range-null").addClass("aoav_soi-range-normal");
			break;
		case "CRITICAL":
			soiIndexTable.find("td.aoav_soi-score").removeClass("aoav_soi-range-high aoav_soi-range-normal aoav_soi-range-null").addClass("aoav_soi-range-critical");
			soiIndexTable.find("td.aoav_soi-score").prepend("<span class='aoav_soi-image-crit'></span>");
			break;
	}
};

/**
 * function to construct Hospital table for displaying in Tooltip when Benchmark hospital label is hovered
 * @param {list} hospLosLabelCollection
 * @param {list} hospLosValuesCollection
 * @returns HTML string with table for Hospital Length of Stay information to be displayed in tooltip
 */
AoavSoiComponentWF.prototype.constructHospHoverTable = function(hospLosLabelCollection, hospLosValuesCollection) {
	var i;
	var hospLosTooltip = "";
	for ( i = 0; i < hospLosLabelCollection.length; i++) {
		if (!isNaN(hospLosValuesCollection[i])) {
			hospLosTooltip += "<tr><td><span class='aoav-soi-benchmark-hosp-tooltip-labeltext'>" + hospLosLabelCollection[i] + "</span>  </td> <td> <span class ='aoav-soi-benchmark-hosp-tooltip-valuetext'>" + hospLosValuesCollection[i] + "  " + this.soiI18n.LENGTH_OF_STAY_DAYS_TEXT + "</span></td></tr>";
		}
		else {
			hospLosTooltip += "<tr><td><span class='aoav-soi-benchmark-hosp-tooltip-labeltext'>" + hospLosLabelCollection[i] + "</span>  </td> <td> <span class ='aoav-soi-benchmark-hosp-tooltip-valuetext'>" + hospLosValuesCollection[i] + "</span></td></tr>";
		}
	}
	return "<div class='aoav-soi-hosp-tooltip'><span class='aoav-soi-hosp-tooltip-header'>" + this.soiI18n.BENCHMARK_HOSPITAL_LOS_TOOLTIP_TABLE_HEADER + "</span><table class='aoav-soi-benchmark-hosp-tooltip-table'>" + hospLosTooltip + "</table></div>";
};

/**
 * function to construct ICU table for displaying in Tooltip when Benchmark ICU label is hovered
 * @param {list} losLabelCollection
 * @param {list} hosLosValuesCollection
 * @param {list} icuLosValuesCollection
 * @returns HTML string with table with ICU Length of Stay information to be displayed in tooltip
 */
AoavSoiComponentWF.prototype.constructICUHoverTable = function(losLabelCollection, hosLosValuesCollection, icuLosValuesCollection) {
	var hosLosTooltipTable = "";
	var icuLosTooltip = "";

	hosLosTooltipTable = this.constructHospHoverTable(losLabelCollection, hosLosValuesCollection);
	for (var i = 0; i < losLabelCollection.length; i++) {
		if (!isNaN(icuLosValuesCollection[i])) {
			icuLosTooltip += "<tr><td><span class='aoav-soi-benchmark-icu-tooltip-labeltext'>" + losLabelCollection[i] + "</span> </td> <td> <span class ='aoav-soi-benchmark-icu-tooltip-valuetext'>" + icuLosValuesCollection[i] + " " + this.soiI18n.LENGTH_OF_STAY_DAYS_TEXT + " </span></td></tr>";
		}
		else {
			icuLosTooltip += "<tr><td><span class='aoav-soi-benchmark-icu-tooltip-labeltext'>" + losLabelCollection[i] + "</span> </td> <td> <span class ='aoav-soi-benchmark-icu-tooltip-valuetext'>" + icuLosValuesCollection[i] + " </span></td></tr>";
		}
	}
	return "<div class='aoav-soi-icu-tooltip'><span class='aoav-soi-icu-tooltip-header'>" + this.soiI18n.BENCHMARK_ICU_LOS_TOOLTIP_TABLE_HEADER + "</span><table class='aoav-soi-benchmark-icu-tooltip-table'>" + icuLosTooltip + "</table></div>" + hosLosTooltipTable;
};

/**
 * function to set the LOS values from JSON and change LOS labels based on availability
 * @param {Object} aoavSoiResult json data object
 * @returns null
 */
AoavSoiComponentWF.prototype.changeLengthOfStayLabels = function(mostRecentDayLevelOfCare) {
	var self = this;
	//Assigning Length of Stay information from JSON to variables
	var predictedRemHospLosDays = this.predictedRemainingHospitalLengthOfStayDays;
	var predictedRemICULosDays = this.predictedRemainingICULengthOfStayDays;
	var benchmarkHospLosDays = this.benchmarkHospitalLengthOfStayDays;
	var benchmarkICULosDays = this.benchmarkICULengthOfStayDays;
	var actualHospLosDays = this.actualHospitalLengthOfStayDays;
	var actualICULosDays = this.actualICULengthOfStayDays;

	var predictedRemHospLosDaysInd = this.predictedRemainingHospitalLengthOfStayDaysInd;
	var predictedRemIcuLosDaysInd = this.predictedRemainingICULengthOfStayDaysInd;
	var benchmarkHospLosDaysInd = this.benchmarkHospitalLengthOfStayDaysInd;
	var benchmarkIcuLosDaysInd = this.benchmarkICULengthOfStayDaysInd;
	var actualHospLosDaysInd = this.actualHospitalLengthOfStayDaysInd;
	var actualIcuLosDaysInd = this.actualICULengthOfStayDaysInd;

	//Calling the setters for assigning values to the LOS variables
	self.setBenchmarkHospitalLos(benchmarkHospLosDays, benchmarkHospLosDaysInd);
	self.setBenchmarkICULos(benchmarkICULosDays, benchmarkIcuLosDaysInd);
	self.setActualHospitalLos(actualHospLosDays, actualHospLosDaysInd);
	self.setActualICULos(actualICULosDays, actualIcuLosDaysInd);
	self.setPredictedRemainingHospitalLos(predictedRemHospLosDays, predictedRemHospLosDaysInd);
	self.setPredictedRemainingICULos(predictedRemICULosDays, predictedRemIcuLosDaysInd);
	//setting up the division for length of stay area above the side panel
	self.m_soiLabelContainer.append("<div class='aoav_soi-len-of-stay'> </div>");
	//Html strings for displaying ICU and hospital Benchmark labels
	var icuLosHtml = "<span class='aoav_soi-los-benchmark-icu'> <label class='aoav_soi-los-benchmark-icu-label'>" + self.soiI18n.BENCHMARK_ICU_LENGTH_OF_STAY_LABEL + "</label> <span class='aoav_soi-los-values'>" + self.getBenchmarkICULos();
	var hospitalLosHtml = "<span class='aoav_soi-los-benchmark-hosp'> <label class='aoav_soi-los-benchmark-hosp-label'>" + self.soiI18n.BENCHMARK_HOSPITAL_LENGTH_OF_STAY_LABEL + " </label> <span class='aoav_soi-los-values'>" + self.getBenchmarkHospitalLos();
	//Label array for consructing table in the tooltip
	var tooltipTableLabelArray = [self.soiI18n.BENCHMARK_PREDICTED_LOS_TOOLTIP_TABLE_LABEL, self.soiI18n.ACTUAL_LOS_TOOLTIP_TABLE_LABEL, self.soiI18n.PREDICTED_REMAINING_TOOLTIP_TABLE_LABEL];
	//Hospital length of stay values in array for displaying in tooltip
	var tooltipTableHospitalLosValuesArray = [self.getBenchmarkHospitalLos(), self.getActualHospitalLos(), self.getPredictedRemainingHospitalLos()];
	var tooltipTableICULosValuesArray = [self.getBenchmarkICULos(), self.getActualICULos(), self.getPredictedRemainingICULos()];
	//Calling functions for setting up information in tooltip
	var icuLosTooltipTable = self.constructICUHoverTable(tooltipTableLabelArray, tooltipTableHospitalLosValuesArray, tooltipTableICULosValuesArray);
	var hospitalLosTooltipTable = self.constructHospHoverTable(tooltipTableLabelArray, tooltipTableHospitalLosValuesArray);
	//Check for level of care
	if (mostRecentDayLevelOfCare === "ICU") {
		//Displaying ICU benchmark label when ICU benchmark is available or both ICU and Hospital benchmark values to be available
		if (benchmarkIcuLosDaysInd || (benchmarkIcuLosDaysInd && benchmarkHospLosDaysInd)) {
			self.m_soiLabelContainer.find(".aoav_soi-len-of-stay").append(icuLosHtml + "   " + self.soiI18n.LENGTH_OF_STAY_DAYS_TEXT + "</span></span>");
			self.m_soiLabelContainer.find('.aoav_soi-los-benchmark-icu').mouseover(function(event) {
				self.benchmarkICULosTooltip = new MPageTooltip();
				self.benchmarkICULosTooltip.setX(event.pageX).setY(event.pageY).setOffsetX(0).setOffsetY(10).setAnchor($(this)).setShowDelay(0).setContent(icuLosTooltipTable);
				self.benchmarkICULosTooltip.show();
				//added aoav_soi-los-tool-tip class to the tooltip content for showing hover when side panel is expanded.
				self.benchmarkICULosTooltip.getContent().addClass("aoav_soi-los-tool-tip");
			});
		}//when no ICU benchmark is available, display -- beside ICU benchmark label
		else {
			self.m_soiLabelContainer.find(".aoav_soi-len-of-stay").append(icuLosHtml + "</span></span>");
		}
	}
	else {
		//Hospital benchmark is available, display benchmark value and the corresponding tooltip.
		if (benchmarkHospLosDaysInd) {
			self.m_soiLabelContainer.find(".aoav_soi-len-of-stay").append(hospitalLosHtml + "   " + self.soiI18n.LENGTH_OF_STAY_DAYS_TEXT + "</span></span>");
			self.m_soiLabelContainer.find(".aoav_soi-los-benchmark-hosp").mouseover(function(event) {
				self.benchmarkHospLosTooltip = new MPageTooltip();
				self.benchmarkHospLosTooltip.setX(event.pageX).setY(event.pageY).setOffsetX(0).setOffsetY(10).setAnchor($(this)).setShowDelay(0).setContent(hospitalLosTooltipTable);
				self.benchmarkHospLosTooltip.show();
				//added aoav_soi-los-tool-tip class to the tooltip content for showing hover when side panel is expanded.
				self.benchmarkHospLosTooltip.getContent().addClass("aoav_soi-los-tool-tip");
			});
		}//when no hospital benchmark is available, display -- beside hospital benchmark label
		else {
			self.m_soiLabelContainer.find(".aoav_soi-len-of-stay").append(hospitalLosHtml + "</span></span>");
		}
	}
};

/**
 * function to add appropriate ICU/Hospital Readmission labels based on the indicators in the JSON
 * @param {Object} aoavSoiResult json data object
 * @returns null
 */
AoavSoiComponentWF.prototype.addReadmissionLabels = function() {
	var compId = this.getComponentId();
	//Fetching variable values from JSON
	var icuReadmissionRiskInd = this.riskOfICUReadmissionInd;
	var hospReadmissionRiskInd = this.riskOfHospitalReadmissionInd;
	var icuReadmissionRiskValue = this.riskOfICUReadmission;
	var hospReadmissionRiskValue = this.riskOfHospitalReadmission;

	//Adding Readmision div to the label container
	this.m_soiLabelContainer.append("<div id='soiReadmission" + compId + "' class='aoav_soi-readmission'> </div>");
	//Creating Html strings for labels
	var icuReadmissionRiskHtml = "<span class='aoav_soi-icu-readmission'> <label class='aoav_soi-readmission-label'>" + this.soiI18n.RISK_OF_ICU_READMISSION_LABEL + "</label> <span class='aoav_soi-readmission-values'>" + icuReadmissionRiskValue + "%</span></span>";
	var hospReadmissionRiskHtml = "<span class='aoav_soi-hosp-readmission'> <label class='aoav_soi-readmission-label'>" + this.soiI18n.RISK_OF_HOSPITAL_READMISSION_LABEL + " </label> <span class='aoav_soi-readmission-values'>" + hospReadmissionRiskValue + "%</span></span>";

	//Changing the labels based on the indicators from the JSON
	if (icuReadmissionRiskInd && !hospReadmissionRiskInd) {
		this.m_soiLabelContainer.find(".aoav_soi-readmission").append(icuReadmissionRiskHtml);
	}
	else if (hospReadmissionRiskInd && !icuReadmissionRiskInd) {
		this.m_soiLabelContainer.find(".aoav_soi-readmission").append(hospReadmissionRiskHtml);
	}
	else {
		//Removing the complete div when both ICU and Hospital Risk Indicators are either false/true
		this.m_soiLabelContainer.find(".aoav_soi-readmission").remove();
	}
};
/**
 * this function is used to initialise the side and create a div structure
 * inside panel it displays the most recent date and day available from data
 * @param {Integer} latestDay the most recentday number
 * @param {Integer} latestDate the most recent day date
 * @returns null
 */
AoavSoiComponentWF.prototype.initializeSidePanel = function(latestDay, latestDate) {
	var self = this;
	var compId = this.getComponentId();
	//string containing id of side panel
	var panelContainerId = "soiSidePanelContainer" + compId;
	//container side panel
	this.m_sidePanelContainer = $("#soiSidePanelContainer" + compId);
	//container for indices table in side panel
	this.m_soiIndexTableContainer = $("#soiIndexTableContainer" + compId);
	//container for scroll container div in side panel body
	this.m_soiSidePanelScrollContainer = $("#sidePanelScrollContainer" + compId);
	this.m_soiSidePanelHeight = 350;
	//container for header of side panel body
	this.m_sidePanelBodyHeader = $("#soiIndexBodyHeader" + compId);
	this.m_soiSidePanelObj = new CompSidePanel(compId, panelContainerId);
	var displaySidePanel = "<div id = '" + panelContainerId + "' class = 'aoav_soi-side-panel'>&nbsp;</div>";
	var soiIndexTableDivString = "<div class = 'aoav_soi-index-table-cont' id = 'soiIndexTableContainer" + compId + "'></div>";
	var soiSidePanelContentArray = [];
	var headerContentArray = [];
	this.m_soiIndexDivContainer.append(displaySidePanel);
	/*
	 * the contents of the body of side panel passed to setContents method to
	 * create body of side panel
	 */
	soiSidePanelContentArray.push("<div id = 'sidePanelScrollContainer" + compId + "' class = 'sp-body-content-area'>");
	soiSidePanelContentArray.push(" <div class = 'aoav_soi-index-body-div'><div class = 'aoav_soi-index-body-header' id = 'soiIndexBodyHeader" + compId + "'>");
	soiSidePanelContentArray.push("<p class = 'aoav_soi-index-body-heading-text'>" + this.soiI18n.SEVERITY_OF_ILLNESS_TEXT + "</p></div>");
	soiSidePanelContentArray.push(soiIndexTableDivString);
	soiSidePanelContentArray.push("</div></div>");

	var contents = soiSidePanelContentArray.join("");

	// setting the unique id of div to the id generated using getComponentUid method above
	this.m_soiSidePanelObj.setUniqueId(compId);
	// minimum height of panel when it is collapsed
	this.m_soiSidePanelObj.setMinHeight(this.MIN_SOISP_HEIGHT + "px");
	this.m_soiSidePanelObj.setHeight(this.m_soiSidePanelHeight + "px");
	// setting width of the panel
	this.m_soiSidePanelObj.setWidth("100%");

	// setting the expand collapse functionality for the side panel
	// by passing expand option as expand_down
	this.m_soiSidePanelObj.setExpandOption(this.m_soiSidePanelObj.expandOption.EXPAND_DOWN);

	// appending the rendered content to div created inside inside soi-index-div
	// for placing the side panel html
	this.m_soiSidePanelObj.renderPreBuiltSidePanel();

	// setting the contents for the panel
	this.m_soiSidePanelObj.setContents(contents, "soiSidepanelContent" + compId);

	// enabling the close button for panel
	this.m_soiSidePanelObj.showCornerCloseButton();

	this.m_soiSidePanelObj.setOnExpandFunction(function() {
		self.m_sidePanelContainer.css("width", "40%");
	});

	this.m_soiSidePanelObj.setOnCollapseFunction(function() {
		self.m_sidePanelContainer.css("width", "100%");
		self.resizeComponent();
	});

	//creating html content for header of side panel to contain day and date details
	headerContentArray.push("<div class='aoav_soi-header-index' id = 'soiSidePanelMainHeader" + compId + "'>");
	headerContentArray.push("<p class='aoav_soi-day-span'>" + this.soiI18n.DAY_TEXT + " <span class='aoav_soi-day-number'>" + latestDay + "</span></p>");
	headerContentArray.push("<p class='aoav_soi-date-span'><span class='aoav_soi-start-text'> " + this.soiI18n.START_TEXT + "  </span><span class='aoav_soi-day-date'>" + latestDate + "</span></p>");
	headerContentArray.push("</div>");
	var headerContent = headerContentArray.join("");

	// setting the header text(header div lies above the grey separation in the side panel)
	this.m_soiSidePanelObj.setSubtitleAsHTML(headerContent);
	//setting containers for side panel, soi index table, scroll container div and side panel main header
	this.m_sidePanelContainer = $("#soiSidePanelContainer" + compId);
	this.m_sidePanelBodyCont = $("#sidePanelBodyContents" + compId);
	this.m_soiIndexTableContainer = $("#soiIndexTableContainer" + compId);
	this.m_soiSidePanelScrollContainer = $("#sidePanelScrollContainer" + compId);
	this.m_sidePanelBodyCont.addClass('aoav_soi-side-panel-padding');
	this.m_soiSidePanelMainHeaderCont = $("#soiSidePanelMainHeader" + compId);

	// To reduce space in header separation.
	this.m_sidePanelContainer.find(".sp-header-text").hide();
	this.m_soiSidePanelScrollContainer.append("<div class='sp-separator2'>&nbsp;</div>");
	var physiologyDetailsDivStr = "<div class = 'aoav_soi-index-details-div' id = 'soiPhyDetailsDiv" + compId + "'><div class = 'aoav_soi-index-details-header'><div class='aoav_soi-phy-square aoav_soi-index-details-square'></div><span></span></div></div>";
	this.m_soiSidePanelScrollContainer.append(physiologyDetailsDivStr);

	this.m_soiSidePanelScrollContainer.append("<div class='sp-separator2'>&nbsp;</div>");
	var comorbidityDetailsDivStr = "<div class = 'aoav_soi-index-details-div' id = 'soiComDetailsDiv" + compId + "'><div class = 'aoav_soi-index-details-header'><div class='aoav_soi-com-square aoav_soi-index-details-square'></div><span></span></div></div>";
	this.m_soiSidePanelScrollContainer.append(comorbidityDetailsDivStr);

	this.m_soiSidePanelScrollContainer.append("<div class='sp-separator2'>&nbsp;</div>");
	var supportDetailsDivStr = "<div class = 'aoav_soi-index-details-div' id = 'soiSupDetailsDiv" + compId + "'><div class = 'aoav_soi-index-details-header'><div class='aoav_soi-sup-square aoav_soi-index-details-square'></div><span></span></div></div>";
	this.m_soiSidePanelScrollContainer.append(supportDetailsDivStr);

	this.m_soiSidePanelScrollContainer.append("<div class='sp-separator2'>&nbsp;</div>");
	var deteriorationDetailsDivStr = "<div class = 'aoav_soi-index-details-div' id = 'soiDetDetailsDiv" + compId + "'><div class = 'aoav_soi-index-details-header'><div class='aoav_soi-det-square aoav_soi-index-details-square'></div><span></span></div></div>";
	this.m_soiSidePanelScrollContainer.append(deteriorationDetailsDivStr);

	this.m_soiSidePanelScrollContainer.append("<div class='sp-separator2'>&nbsp;</div>");
	this.m_soiPhyDetailsContainer = $("#soiPhyDetailsDiv" + compId);
	this.m_soiComDetailsContainer = $("#soiComDetailsDiv" + compId);
	this.m_soiSupDetailsContainer = $("#soiSupDetailsDiv" + compId);
	this.m_soiDetDetailsContainer = $("#soiDetDetailsDiv" + compId);
};
/**
 * 
 */
AoavSoiComponentWF.prototype.setDiagnosisDivWidth = function() {
	var indexTableTdWidth = this.m_soiSidePanelScrollContainer.find(".aoav_soi-index-icons").width();
	this.m_soiSidePanelScrollContainer.find(".aoav_soi-diagnosis-first-col").width(indexTableTdWidth+"px");
};

/**
 * This function will resize the component based on window size.
 */
AoavSoiComponentWF.prototype.resizeComponent = function() {
	if (this.scriptStatus == "S") {
		this.reDrawGraph(false, true);
		var errorDivHeight = this.m_generalErrorDivCont.height();
		var soiLabelDivHeight = this.m_soiLabelContainer.height();
		var bannerAndErrorDivHeight = errorDivHeight + soiLabelDivHeight;
		var windowPadding = document.documentMode <= 8 ? 85 : 60;
		var extraViewHeight = windowPadding + bannerAndErrorDivHeight;
		var maxViewHeight = (this.m_compViewCont.height() - extraViewHeight) + "px";
		this.MAX_SOISP_HEIGHT = maxViewHeight;
		this.m_soiSidePanelObj.resizePanel(this.MAX_SOISP_HEIGHT);
		this.setDiagnosisDivWidth();
	}
};
/**
 * This function calculates and sets the graph size which could be used
 * for initialization or resize of the graph.
 */
AoavSoiComponentWF.prototype.calculateGraphSize = function() {
	var chartDataObj = this.chartDataObj;
	var borderPixels = 2;
	var graphContainerWidth = this.m_soiGraphContainer.width();

	//Identify number of days which could be visible in the graph.
	chartDataObj.VISIBLE_DAYS = Math.ceil((graphContainerWidth / chartDataObj.DAY_MIN_WIDTH) - chartDataObj.IGNORABLE_WIDTH);

	//To fix the Y-axis division and graph constant for different resolution on resize.
	var soiWidth = this.soiContentContainer.find('.aoav_soi-graph-sp').width();
	this.soiContentContainerRecentWidth = soiWidth;
	var yaxisWidth = 55;
	var totalgraphWidth = chartDataObj.graphWidthPercent * soiWidth;
	var graphWidth = totalgraphWidth - yaxisWidth;
	this.m_soiGraphContainer.width(graphWidth + "px");
	this.soiContentContainer.find(".aoav_soi-graph-yvalue-main-div").width(yaxisWidth + "px");

	//Dynamically assign width and height for the graph based on the screen resolution.
	//Verify whether graph container width can draw the graph of 'n' number of days with minimum day width.
	if (this.m_soiGraphContainer.width() < chartDataObj.TOTAL_DAYS * chartDataObj.DAY_MIN_WIDTH) {
		chartDataObj.GRAPH_SCROLL_WIDTH = chartDataObj.TOTAL_DAYS * chartDataObj.DAY_MIN_WIDTH;
		chartDataObj.chartMainDivContainer.width(chartDataObj.GRAPH_SCROLL_WIDTH + "px");

		chartDataObj.scrollbarHeight = 17;
		chartDataObj.chartContainer.width("100%");

		//Add scroll bar class - hides  axes border and show graph container border.
		chartDataObj.currentScrollClass = chartDataObj.scrollClass;
		this.m_soiGraphContainer.addClass(chartDataObj.scrollClass);
		chartDataObj.chartMainDivContainer.addClass(chartDataObj.scrollClass);
		this.m_soiGraphContainer.find(chartDataObj.noScrollClass).toggleClass(chartDataObj.scrollClass);
	}
	else {
		//Set chart width by subtracting the border of its parent width.
		var chartWidth = $(this.m_soiGraphContainer).width() - borderPixels;
		chartDataObj.chartMainDivContainer.width(chartWidth + "px");
		chartDataObj.chartContainer.width(chartWidth + "px");

		chartDataObj.scrollbarHeight = 0;
		chartDataObj.GRAPH_SCROLL_WIDTH = 0;
		chartDataObj.currentScrollClass = chartDataObj.noScrollClass;

		//Remove scroll bar class - shows axes border and hides graph container border.
		this.m_soiGraphContainer.removeClass(chartDataObj.scrollClass);
		chartDataObj.chartMainDivContainer.removeClass(chartDataObj.scrollClass);
		this.m_soiGraphContainer.find(chartDataObj.scrollClass).toggleClass(chartDataObj.noScrollClass);
	}

	//Set the graph height to side panel height based on scroll bar visibility.
	chartDataObj.graphHeight = chartDataObj.dynamicSidePanelHeight - chartDataObj.X_AXIS_TICK_HEIGHT * 3 - chartDataObj.scrollbarHeight - borderPixels;
	chartDataObj.chartContainer.height(chartDataObj.graphHeight + "px");

	//Set graph height (Parent of jqplot chart) - Fix for IE9 as doesn't recognizes the graph height
	//based on its child elements height.
	this.m_soiGraphContainer.height(chartDataObj.dynamicSidePanelHeight + "px");
};

/**
 * This function will resize the component based on window size.
 *
 * @param {reloadGraph} boolean - Reloads the graph with updated set of plot options if the value
 *          is true, else doesn't reload the graph.
 *
 * @param {reCalculateGraphSize} boolean - Calculates the graph size (height & width) if the value
 *          is true, else doesn't calculate - Used on resizing the component, side panel open/close,
 *          etc.
 */
AoavSoiComponentWF.prototype.reDrawGraph = function(reloadGraph, reCalculateGraphSize) {
	var compId = this.getComponentId();
	var chartDataObj = this.chartDataObj;
	var graphOptions = chartDataObj.soiGraphOptions;

	if (reCalculateGraphSize) {
		this.calculateGraphSize();
	}

	// Replot the graph
	var aoavPlot = this.getAoavPlot();
	if (aoavPlot) {
		aoavPlot.destroy();

		if (!reloadGraph && reCalculateGraphSize) {
			$.each(aoavPlot.series, function(index, series) {
				series.barWidth = null;
			});
			aoavPlot.replot();
			this.updateGraphAxes();
		}
		else if (reloadGraph) {
			this.setPlotOptionsObj();
			var soiPlot = $.jqplot(chartDataObj.chartId, [graphOptions.physiologyIndex, graphOptions.comorbidityIndex, graphOptions.supportIndex, graphOptions.deteriorationIndex, graphOptions.hospitalMortalityRisk, graphOptions.icuMortalityRisk], this.getPlotOptionsObj());
			this.setAoavPlot(soiPlot);

			if (reCalculateGraphSize) {
				this.updateGraphAxes();
			}
		}
	}

	var soiWidth = this.soiContentContainer.find('.aoav_soi-graph-sp').width();
	if (this.soiContentContainerRecentWidth != soiWidth && !this.reloadGraph) {
		this.reloadGraph = true;
		this.reDrawGraph(reloadGraph, reCalculateGraphSize);
	}
	else {
		this.reloadGraph = false;
	}
};

/**
 * Set the graph plot options - used to plot, replot and redraw the graph.
 */
AoavSoiComponentWF.prototype.setPlotOptionsObj = function() {
	var chartDataObj = this.chartDataObj;
	var graphOptions = chartDataObj.soiGraphOptions;

	chartDataObj.soiPlotOptionsObj = {
		stackSeries : true,
		seriesDefaults : {
			renderer : $.jqplot.BarRenderer,
			rendererOptions : {
				highlightMouseOver : false
			},
			pointLabels : {
				show : false,
				stackedValue : true
			}
		},
		series : [{
			renderer : $.jqplot.BarRenderer,
			color : '#007CC3',
			xaxis : 'x2axis',
			shadow : false

		}, {
			renderer : $.jqplot.BarRenderer,
			color : '#26A2E5',
			shadow : false
		}, {
			renderer : $.jqplot.BarRenderer,
			color : '#FFCE3B',
			shadow : false

		}, {
			renderer : $.jqplot.BarRenderer,
			color : '#DAACE6',
			shadow : false
		}, {
			disableStack : true, //otherwise it wil be added to values of previous series
			renderer : $.jqplot.LineRenderer,
			color : '#000000',
			lineWidth : 2,
			breakOnNull : graphOptions.breakOnNull,
			pointLabels : {
				show : false
			},
			markerOptions : {
				show : true,
				style : 'circle',
				size : 8,
				shadow : false,
				shapeRenderer : new $.jqplot.aoavCircleRenderer()

			}
		}, {
			disableStack : true, //otherwise it wil be added to values of previous series
			renderer : $.jqplot.LineRenderer,
			color : '#000000',
			lineWidth : 2,
			breakOnNull : graphOptions.breakOnNull,
			pointLabels : {
				show : false
			},
			markerOptions : {
				show : true,
				size : 10,
				style : 'filledTriangleUp',
				shadow : true,
				markerBackgroundColor : '#FFFFFF'
			}
		}],
		axes : {
			xaxis : {
				renderer : $.jqplot.CategoryAxisRenderer,
				ticks : graphOptions.x1AxisTicks,
				pad : 0,
				tickOptions : {
					fontSize : '10pt',
					mark : 'inside',
					show : graphOptions.showX1axis,
					showLabel : graphOptions.showX1axis,
					showMark : graphOptions.showX1axis,
					formatString : '%0.0f'
				}
			},

			yaxis : {
				min : graphOptions.yMin,
				max : graphOptions.yMax,
				tickInterval : 5,
				drawMajorGridlines : false,
				drawMinorGridlines : false,
				tickOptions : {
					show : graphOptions.showYaxis,
					showLabel : graphOptions.showYaxis,
					showMark : graphOptions.showYaxis,
					formatString : '%d'
				}
			},
			x2axis : {
				renderer : $.jqplot.CategoryAxisRenderer,
				ticks : graphOptions.x2AxisTicks,
				tickOptions : {
					fontSize : '10pt',
					show : true,
					showLabel : graphOptions.showX2axis,
					showMark : true
				}
			}
		},
		gridPadding : {
			top : graphOptions.gridPadding,
			right : graphOptions.gridPadding,
			bottom : graphOptions.gridPadding,
			left : graphOptions.gridPaddingLeft
		},
		grid : {
			drawGridLines : true,
			gridLineColor : '#DDDDDD',
			backgroundColor : '#FFFFFF',
			borderColor : '#A5A5A5',
			shadow : false,
			drawBorder : false,
			borderWidth : 0
		},
		canvasOverlay : {
			show : true,
			objects : [{
				rectangle : {
					name : 'lowOverlay',
					xmin : 0,
					xmax : chartDataObj.TOTAL_DAYS + 0.5,
					ymin : 0,
					ymax : 25,
					xminOffset : "0px",
					xmaxOffset : "0px",
					yminOffset : "0px",
					ymaxOffset : "0px",
					color : graphOptions.lowOverlayColor
				}
			}, {
				rectangle : {
					name : 'midOverlayColor',
					xmin : 0,
					xmax : chartDataObj.TOTAL_DAYS + 0.5,
					ymin : 50,
					ymax : 75,
					xminOffset : "0px",
					xmaxOffset : "0px",
					yminOffset : "0px",
					ymaxOffset : "0px",
					color : graphOptions.midOverlayColor
				}
			}, {
				rectangle : {
					name : 'selectedDayOverlayColor',
					xmin : chartDataObj.selectedDay - 0.5,
					xmax : chartDataObj.selectedDay + 0.5,
					ymin : graphOptions.yMin,
					ymax : graphOptions.yMax,
					xminOffset : "0px",
					x2maxOffset : "0px",
					yminOffset : "0px",
					ymaxOffset : "0px",
					color : graphOptions.selectedDayOverlayColor
				}
			}]
		},
		highlighter : {
			show : false
		},
		cursor : {
			showTooltip : false
		},
		cursor : {
			show : false
		}
	};
};

/**
 * Returns the graph plot options - used to plot, replot and redraw the graph.
 */
AoavSoiComponentWF.prototype.getPlotOptionsObj = function() {
	return this.chartDataObj.soiPlotOptionsObj;
};

/**
 * Renderer to draw two circles - inner & outer circles for SOI graph.
 */
AoavSoiComponentWF.prototype.createCircleRenderer = function() {
	//AOAV custom renderer for shapes
	(function($) {
		$.jqplot.aoavCircleRenderer = function(options) {
			$.extend(true, this, options);
		};

		$.jqplot.aoavCircleRenderer.prototype.init = function(options) {
			$.extend(true, this, options);
		};

		$.jqplot.aoavCircleRenderer.prototype.draw = function(ctx, points, options) {
			ctx.save();

			// Shadow - Outside Circle
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'rgba(255, 255, 255, 1.0)';
			ctx.beginPath();
			ctx.arc(points[0], points[1], points[2], points[3], points[4], true);
			ctx.closePath();
			ctx.stroke();

			// Inner Circle
			ctx.lineWidth = 10;
			ctx.fillStyle = '#000000';
			ctx.beginPath();
			ctx.arc(points[0], points[1], points[2], points[3], points[4], true);
			ctx.closePath();
			ctx.fill();

			ctx.restore();
		};
	})(jQuery);
};

/**
 * Loads the graph with initial plot options inside the HTML of SOI graph container.
 */
AoavSoiComponentWF.prototype.loadGraph = function() {
	try {
		var self = this;
		var chartDataObj = this.chartDataObj;
		var compId = this.getComponentId();
		var graphHTML = "";

		//Graph Main Div
		graphHTML = "<div id='chartMainDiv" + compId + "' class='aoav_soi-chart-main-div'>";
		graphHTML += "<div id='graphICUHeader" + compId + "' class='aoav_soi-graph-icu-header'></div>";
		//X2 Day axis
		graphHTML += "<div class='aoav_soi-graph-days-div'><span class='aoav_soi-graph-day-before'></span><span class='aoav_soi-graph-day-actual'></span></div>";
		graphHTML += "<div id='" + chartDataObj.chartId + "' class='aoav_soi-chart' style='height:graphHeightpx' align='CENTER'></div>";

		// X1 SOI score axis
		graphHTML += "<div class='aoav_soi-graph-xvalue-div'><span class='aoav_soi-graph-xvalue-before'></span>";
		graphHTML += "<span class='aoav_soi-graph-xvalue-actual'></span></div></div>";

		this.m_soiGraphContainer.html(graphHTML);
		chartDataObj.chartMainDivContainer = $("#chartMainDiv" + compId);
		chartDataObj.chartContainer = $("#" + chartDataObj.chartId);
	}
	catch (error) {
		if ( typeof error === "string") {
			var discernError = new Error(error);
			MP_Util.LogJSError(discernError, this, "aoav-soi-o1.js", "loadGraph");
		}
		else {
			MP_Util.LogJSError(error, this, "aoav-soi-o1.js", "loadGraph");
		}
	}
};

/**
 * Creates chart data - Sets series values, tick values and identifies the day LOS, start,
 * end day and total number days to be in SOI graph.
 *
 * @param {Object} replyData - Reply data receieved from CCL.
 *
 */
AoavSoiComponentWF.prototype.createChartData = function(replyData) {
	var self = this;
	var compId = this.getComponentId();
	var chartDataObj = this.chartDataObj;
	var graphOptions = chartDataObj.soiGraphOptions;
	var predictedDays = null;
	var predictedDaysLength = 0;
	var predicatedRemainingLOS = 0;
	var dayIdx = 0;
	var predictedDaysIdx = 0;
	var soiScoreRange = "";

	//Creates X axis HTML based soi range tick values
	var getXaxisTickHTML = function retrieveXaxisTickHTML(tickValue, soiRange, index) {
		var divClass = "";
		var imageClass = "";
		var soiRangeValue = soiRange.toUpperCase();

		soiRange = soiRange ? soiRange : "";
		divClass += index === chartDataObj.TOTAL_DAYS - 1 ? chartDataObj.currentScrollClass : "";

		if (tickValue !== 0 && !tickValue) {
			tickValue = "&nbsp;";
		}

		//Show range indicators image based on soiRange value.
		switch (soiRange) {
			case "NORMAL":
				divClass += "aoav_soi-graph-xvalue-normal";
				break;
			case "HIGH":
				divClass += "aoav_soi-graph-xvalue-high";
				imageClass = "aoav_soi-graph-image-high aoav_soi-graph-image";
				break;
			case "CRITICAL":
				divClass += "aoav_soi-graph-xvalue-crit";
				imageClass = "aoav_soi-graph-image-crit aoav_soi-graph-image";
				break;
			default:
				divClass += "aoav_soi-graph-xvalue-normal";
				break;
		}

		var ticksHTML = "<div class='aoav_soi-graph-xvalue-data-div aoav_soi-graph-xaxes-buttons aoav_soi_axes " + divClass + "' style='width:0px'><span class='" + imageClass + "'>";
		ticksHTML += "</span><span class='aoav_soi-graph-xaxes-value'>" + tickValue + "</span></div>";
		return ticksHTML;
	};

	//Set the plot options and few other variables only if it is first time load
	if (chartDataObj.FIRST_TIME_LOAD) {
		this.createCircleRenderer();

		predictedDays = replyData.predictedDays;
		predictedDaysLength = predictedDays.length;
		if (replyData.predictedRemainingHospitalLengthOfStayDays > replyData.predictedRemainingICULengthOfStayDays) {
			predicatedRemainingLOS = Math.ceil(replyData.predictedRemainingHospitalLengthOfStayDays);
		}
		else {
			predicatedRemainingLOS = Math.ceil(replyData.predictedRemainingICULengthOfStayDays);
		}

		//Identify LOS, start day, end day, total days, selected day.
		this.predictedRemainingHospitalLengthOfStayDays = replyData.predictedRemainingHospitalLengthOfStayDays;
		this.predictedRemainingICULengthOfStayDays = replyData.predictedRemainingICULengthOfStayDays;
		this.benchmarkHospitalLengthOfStayDays = replyData.benchmarkHospitalLengthOfStayDays;
		this.benchmarkICULengthOfStayDays = replyData.benchmarkICULengthOfStayDays;
		this.actualHospitalLengthOfStayDays = replyData.actualHospitalLengthOfStayDays;
		this.actualICULengthOfStayDays = replyData.actualICULengthOfStayDays;
		this.predictedRemainingHospitalLengthOfStayDaysInd = replyData.predictedRemainingHospitalLengthOfStayDaysInd;
		this.predictedRemainingICULengthOfStayDaysInd = replyData.predictedRemainingICULengthOfStayDaysInd;
		this.benchmarkHospitalLengthOfStayDaysInd = replyData.benchmarkHospitalLengthOfStayDaysInd;
		this.benchmarkICULengthOfStayDaysInd = replyData.benchmarkICULengthOfStayDaysInd;
		this.actualHospitalLengthOfStayDaysInd = replyData.actualHospitalLengthOfStayDaysInd;
		this.actualICULengthOfStayDaysInd = replyData.actualICULengthOfStayDaysInd;

		this.riskOfICUReadmissionInd = replyData.riskOfICUReadmissionInd;
		this.riskOfHospitalReadmissionInd = replyData.riskOfHospitalReadmissionInd;
		this.riskOfICUReadmission = replyData.riskOfICUReadmission;
		this.riskOfHospitalReadmission = replyData.riskOfHospitalReadmission;

		chartDataObj.PREDICTED_LOS_STAY = predicatedRemainingLOS;
		chartDataObj.INITIAL_LOAD_DAY = predictedDays[0].dayNumber;
		chartDataObj.LAST_LOAD_DAY = predictedDays[predictedDaysLength - 1].dayNumber;
		chartDataObj.TOTAL_LOAD_DAYS = predictedDaysLength;
		chartDataObj.TOTAL_DAYS = chartDataObj.LAST_LOAD_DAY + chartDataObj.PREDICTED_LOS_STAY;
		chartDataObj.selectedDay = chartDataObj.LAST_LOAD_DAY;

		//Graph overlay colors, min, max settings.
		graphOptions.lowOverlayColor = "rgba(238, 238, 238, 0.3)";
		graphOptions.midOverlayColor = graphOptions.lowOverlayColor;
		//Hexadecimal Color: #F5F8FC
		graphOptions.selectedDayOverlayColor = "rgba(245, 248, 252, 0.3)";
		//Padding for four sides. Null - Initializes to default padding value
		graphOptions.gridPadding = 0;
		graphOptions.gridPaddingLeft = -1;
		graphOptions.yMin = 0;
		graphOptions.yMax = 105;

		//Break the graph conneting points when there are null values.
		graphOptions.breakOnNull = true;

		//Define indexes, risk ratio and axes values used to show in the graph.
		graphOptions.physiologyIndex = [];
		graphOptions.comorbidityIndex = [];
		graphOptions.supportIndex = [];
		graphOptions.deteriorationIndex = [];
		graphOptions.hospitalMortalityRisk = [];
		graphOptions.icuMortalityRisk = [];
		graphOptions.x1AxisTicks = [];
		graphOptions.x1AxisTickValues = [];
		graphOptions.x2AxisTicks = [];
		graphOptions.showX1axis = false;
		graphOptions.showX2axis = false;
		graphOptions.showYaxis = false;

		this.calculateGraphSize();

		//Identify starting day number which is visible on the screen
		chartDataObj.LOAD_DAY_TRIGGERED = chartDataObj.TOTAL_DAYS - chartDataObj.VISIBLE_DAYS + 1;

		if (chartDataObj.LOAD_DAY_TRIGGERED <= 0) {
			chartDataObj.LOAD_DAY_TRIGGERED = 1;
		}

		this.levelOfCareForICU = [];
		this.soiScoreRange = [];
		this.diagnosisDetails = [];
		this.dateOfTheDay = [];
		this.soiDataPresent = [];
		//Fill empty values only for first time
		for (var i = 0; i < chartDataObj.TOTAL_DAYS; i++) {
			//Populating arrays to be used in side panel with empty strings for
			//maximum possible number of days including predicted days
			this.levelOfCareForICU[i] = "";
			this.physiologyIndexArr[i] = "";
			this.supportIndexArr[i] = "";
			this.deteriorationIndexArr[i] = "";
			this.comorbidityIndexArr[i] = "";
			this.icuMortalityRisk[i] = "";
			this.hospitalMortalityRisk[i] = "";
			this.soiScore[i] = "";
			this.soiScoreRange[i] = "";
			this.diagnosisDetails[i] = "";
			this.dateOfTheDay[i] = "";
			this.soiDataPresent[i] = false;

			//Populate arrays to be used in graph with empty values for maximum number days including predicted days
			graphOptions.physiologyIndex[i] = 0;
			graphOptions.comorbidityIndex[i] = 0;
			graphOptions.supportIndex[i] = 0;
			graphOptions.deteriorationIndex[i] = 0;

			graphOptions.hospitalMortalityRisk[i] = [];
			graphOptions.hospitalMortalityRisk[i][0] = i + 1;
			graphOptions.hospitalMortalityRisk[i][1] = null;

			graphOptions.icuMortalityRisk[i] = [];
			graphOptions.icuMortalityRisk[i][0] = i + 1;
			graphOptions.icuMortalityRisk[i][1] = null;

			graphOptions.x1AxisTicks[i] = getXaxisTickHTML(null, "", i);
			graphOptions.x2AxisTicks[i] = this.soiI18n.DAY_TEXT + "&nbsp;" + (i + 1);

			if (i >= chartDataObj.LAST_LOAD_DAY) {
				chartDataObj.DAY_LOADED[i] = true;
			}
		}
	}
	else {
		predictedDays = replyData;
		predictedDaysLength = predictedDays.length;

		chartDataObj.INITIAL_LOAD_DAY = predictedDays[0].dayNumber;
		chartDataObj.LAST_LOAD_DAY = predictedDays[predictedDaysLength - 1].dayNumber;
		chartDataObj.TOTAL_LOAD_DAYS = predictedDaysLength;
	}

	//Update the graph series values and risk ration which is received from the service
	//on demand (Upon scrolling the graph).
	for ( predictedDaysIdx = 0, dayIdx = chartDataObj.INITIAL_LOAD_DAY - 1; predictedDaysIdx < predictedDaysLength; dayIdx++, predictedDaysIdx++) {
		this.soiDataPresent[dayIdx] = true;
		this.levelOfCareForICU[dayIdx] = predictedDays[predictedDaysIdx].levelOfCare;
		this.dateOfTheDay[dayIdx] = predictedDays[predictedDaysIdx].date;
		// Check if soi score is valid
		this.soiScore[dayIdx] = ((predictedDays[predictedDaysIdx].soiScoreInd) ? predictedDays[predictedDaysIdx].soiScore : "--");
		this.soiScoreRange[dayIdx] = predictedDays[predictedDaysIdx].soiScoreRange;
		// Populate the index data into respective index arrays
		this.physiologyIndexArr[dayIdx] = {
			"label" : predictedDays[predictedDaysIdx].physiologyIndex.label,
			"value" : "",
			"valueInd" : predictedDays[predictedDaysIdx].physiologyIndex.valueInd,
			"components" : predictedDays[predictedDaysIdx].physiologyIndex.components
		};
		this.physiologyIndexArr[dayIdx].value = ((predictedDays[predictedDaysIdx].physiologyIndex.valueInd) ? predictedDays[predictedDaysIdx].physiologyIndex.value : "--");

		this.comorbidityIndexArr[dayIdx] = {
			"label" : predictedDays[predictedDaysIdx].comorbidityIndex.label,
			"value" : "",
			"valueInd" : predictedDays[predictedDaysIdx].comorbidityIndex.valueInd,
			"components" : predictedDays[predictedDaysIdx].comorbidityIndex.components
		};
		this.comorbidityIndexArr[dayIdx].value = ((predictedDays[predictedDaysIdx].comorbidityIndex.valueInd) ? predictedDays[predictedDaysIdx].comorbidityIndex.value : "--");

		this.supportIndexArr[dayIdx] = {
			"label" : predictedDays[predictedDaysIdx].supportIndex.label,
			"value" : "",
			"valueInd" : predictedDays[predictedDaysIdx].supportIndex.valueInd,
			"components" : predictedDays[predictedDaysIdx].supportIndex.components
		};
		this.supportIndexArr[dayIdx].value = ((predictedDays[predictedDaysIdx].supportIndex.valueInd) ? predictedDays[predictedDaysIdx].supportIndex.value : "--");

		this.deteriorationIndexArr[dayIdx] = {
			"label" : predictedDays[predictedDaysIdx].deteriorationIndex.label,
			"value" : "",
			"valueInd" : predictedDays[predictedDaysIdx].deteriorationIndex.valueInd,
			"components" : predictedDays[predictedDaysIdx].deteriorationIndex.components
		};
		this.deteriorationIndexArr[dayIdx].value = ((predictedDays[predictedDaysIdx].deteriorationIndex.valueInd) ? predictedDays[predictedDaysIdx].deteriorationIndex.value : "--");

		this.icuMortalityRisk[dayIdx] = ((predictedDays[predictedDaysIdx].icuMortalityRiskInd) ? predictedDays[predictedDaysIdx].icuMortalityRisk : "--");
		this.hospitalMortalityRisk[dayIdx] = ((predictedDays[predictedDaysIdx].hospitalMortalityRiskInd) ? predictedDays[predictedDaysIdx].hospitalMortalityRisk : "--");

		this.diagnosisDetails[dayIdx] = predictedDays[predictedDaysIdx].diagnosis;

		//Populate arrays for the days information received from CCL.
		graphOptions.physiologyIndex[dayIdx] = ((predictedDays[predictedDaysIdx].physiologyIndex.valueInd) ? predictedDays[predictedDaysIdx].physiologyIndex.value : 0);
		graphOptions.comorbidityIndex[dayIdx] = ((predictedDays[predictedDaysIdx].comorbidityIndex.valueInd) ? predictedDays[predictedDaysIdx].comorbidityIndex.value : 0);
		graphOptions.supportIndex[dayIdx] = ((predictedDays[predictedDaysIdx].supportIndex.valueInd) ? predictedDays[predictedDaysIdx].supportIndex.value : 0);
		graphOptions.deteriorationIndex[dayIdx] = ((predictedDays[predictedDaysIdx].deteriorationIndex.valueInd) ? predictedDays[predictedDaysIdx].deteriorationIndex.value : 0);

		graphOptions.hospitalMortalityRisk[dayIdx] = [];
		graphOptions.hospitalMortalityRisk[dayIdx][0] = dayIdx + 1;
		graphOptions.hospitalMortalityRisk[dayIdx][1] = ((predictedDays[predictedDaysIdx].hospitalMortalityRiskInd) ? predictedDays[predictedDaysIdx].hospitalMortalityRisk : null);

		graphOptions.icuMortalityRisk[dayIdx] = [];
		graphOptions.icuMortalityRisk[dayIdx][0] = dayIdx + 1;
		graphOptions.icuMortalityRisk[dayIdx][1] = ((predictedDays[predictedDaysIdx].icuMortalityRiskInd) ? predictedDays[predictedDaysIdx].icuMortalityRisk : null);

		graphOptions.x1AxisTickValues[dayIdx] = ((predictedDays[predictedDaysIdx].soiScoreInd) ? predictedDays[predictedDaysIdx].soiScore : 0);
		soiScoreRange = predictedDays[predictedDaysIdx].soiScoreRange;

		graphOptions.x1AxisTicks[dayIdx] = getXaxisTickHTML(graphOptions.x1AxisTickValues[dayIdx], soiScoreRange, dayIdx);
		graphOptions.x2AxisTicks[dayIdx] = this.soiI18n.DAY_TEXT + "&nbsp;" + (dayIdx + 1);

		chartDataObj.DAY_LOADED[dayIdx] = true;
	}
	//putting levelOfCareICU for predicted days in icu for patient
	var additionalDaysInICU = 0;
	if (this.predictedRemainingICULengthOfStayDaysInd) {
		additionalDaysInICU = this.predictedRemainingICULengthOfStayDays;
	}
	else if (this.benchmarkICULengthOfStayDaysInd) {
		additionalDaysInICU = this.benchmarkICULengthOfStayDays;
	}
	for (var careIdx = chartDataObj.LAST_LOAD_DAY; careIdx < chartDataObj.LAST_LOAD_DAY + additionalDaysInICU; careIdx++) {
		this.levelOfCareForICU[careIdx] = "ICU";
	}
	chartDataObj.soiGraphOptions = graphOptions;
	//Set plot options based on graph options.
	this.setPlotOptionsObj();

	//Create or Update SOI bar chart after collecting data from service/CCL.
	this.createSOIChart();
};

/**
 * Creates severity of illness bar chart based on available plot options.
 */
AoavSoiComponentWF.prototype.createSOIChart = function() {
	var self = this;
	var chartDataObj = this.chartDataObj;
	var plotOptions = chartDataObj.soiGraphOptions;
	var compId = this.getComponentId();

	//Before creating or updating the chart, destroy already plotted chart to avoid overriding the chart upon it.
	if (this.getAoavPlot()) {
		this.getAoavPlot().destroy();
	}
	var soiPlot = $.jqplot(chartDataObj.chartId, [plotOptions.physiologyIndex, plotOptions.comorbidityIndex, plotOptions.supportIndex, plotOptions.deteriorationIndex, plotOptions.hospitalMortalityRisk, plotOptions.icuMortalityRisk], this.getPlotOptionsObj());
	this.setAoavPlot(soiPlot);
	this.updateGraphAxes(true);

	//Upon clicking on the column of the graph, identify the selected day and update side panel.
	$("#" + chartDataObj.chartId).bind('jqplotClick', function(ev, gridpos, datapos, neighbor, plot) {
		var columnPos = Math.ceil(datapos.x2axis - 0.5);
		// Fire click event on selecting graph column.
		self.graphClickEventHandler(columnPos);
	});
};

/**
 * This function creates hover with day and date details on day buttons on the graph.
 * @param {Object} reply json data object ccl
 * @returns null
 */
AoavSoiComponentWF.prototype.createDayHoverOnChart = function() {
	var self = this;
	var dayButton = self.m_soiGraphContainer.find('.aoav_soi-graph-days-div .aoav_soi-graph-xaxes-buttons');
	var compId = this.getComponentId();

	//calling mouseover on day buttons in the graph.
	dayButton.mouseover(function(event) {
		var chartDayNumber = "";
		var chartDate = "";
		var chartDayHoverContent = "";
		chartDayNumber = $(this).attr('data');
		var date = self.dateOfTheDay[chartDayNumber - 1];
		if (date) {
			if (!($(this).hasClass('aoav_soi-graph-day-button-selected'))) {
				$(this).addClass('aoav_soi-hover-background');
			}
			chartDate = self.createDateString(date);
			chartDayHoverContent += "<div class='aoav_soi-chart-day-hover' id='chartDayHover" + compId + "'> <p class='aoav_soi-chart-day-span'>" + self.soiI18n.DAY_TEXT;
			chartDayHoverContent += " <span class='aoav_soi-day-number'>" + chartDayNumber + "</span></p> <p class='aoav_soi-date-span'><span class='aoav_soi-start-text'> " + self.soiI18n.START_TEXT;
			chartDayHoverContent += " </span><span class='aoav_soi-day-date'>" + chartDate + "</span></p> </div>";
			self.chartDayTooltip = new MPageTooltip();

			self.chartDayTooltip.setX(event.pageX).setY(event.pageY).setOffsetX(0).setOffsetY(10).setAnchor($(this)).setShowDelay(0).setContent(chartDayHoverContent);
			self.chartDayTooltip.show();

			if (!($(this).hasClass('aoav_soi-graph-day-button-selected'))) {
				dayButton.mouseout(function(event) {
					$(this).removeClass('aoav_soi-hover-background');
				});
			}
		}
	});
};

/**
 * This function is used to retrieve additional severity of illness details through a call from ccl script.
 *
 * @param {Integer} startDayNumber - start day number which is visible in the graph.
 *
 * @param {Integer} endDayNumber - end day number which is visible in the graph.
 *
 * @returns {null}
 */
AoavSoiComponentWF.prototype.retrieveAdditionalComponentData = function(startDayNumber, endDayNumber) {
	var self = this;
	var chartDataObj = this.chartDataObj;
	var criterion = this.getCriterion();
	var sendAr = ["^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.encntr_id + ".0", endDayNumber];
	var soiScriptRequest = new ComponentScriptRequest();
	var viewCatagoryMean = criterion.category_mean;
	var loadAdditionalDataTimerName = "USR:MPG.AOAV-SOI.O1 - load additional data";
	var renderAdditionalDataTimerName = "ENG:MPG.AOAV-SOI.O1 - render additional data";
	var loadTimer = new RTMSTimer(loadAdditionalDataTimerName, viewCatagoryMean);
	var renderTimer = new RTMSTimer(renderAdditionalDataTimerName, viewCatagoryMean);

	//If start day number is greater than end day number, then there is no need of
	//getting an additional data from service.
	if (startDayNumber > endDayNumber) {
		return;
	}
	soiScriptRequest.setProgramName("MP_GET_AOAV_SOI");
	soiScriptRequest.setParameterArray(sendAr);
	soiScriptRequest.setComponent(this);
	soiScriptRequest.setLoadTimer(loadTimer);
	soiScriptRequest.setRenderTimer(renderTimer);
	soiScriptRequest.setResponseHandler(function(scriptReply) {
		if (scriptReply.getResponse().STATUS_DATA.STATUS == "S") {
			self.createChartData(scriptReply.m_responseData.data);

			//Load additional graph data which is still needs be loaded in the visible area of the graph.
			if (startDayNumber < chartDataObj.INITIAL_LOAD_DAY && chartDataObj.INITIAL_LOAD_DAY >= 1) {
				self.retrieveAdditionalComponentData(startDayNumber, chartDataObj.INITIAL_LOAD_DAY - 1);
			}
			else {
				self.loadGraphDataOnScroll(self.m_soiGraphContainer.scrollLeft());
			}
		}
		else if (scriptReply.getResponse().STATUS_DATA.STATUS === "F") {
			self.scriptStatus = "F";
			self.createBannersForErrors(MPageUI.ALERT_OPTIONS.TYPE.ERROR, self.soiI18n.PRIMARY_SERVER_ERROR_STRING, self.soiI18n.SECONDARY_SERVER_ERROR_STRING);
		}
		else {
			self.finalizeComponent(MP_Util.HandleErrorResponse(self.getStyles().getNameSpace()), (self.isLineNumberIncluded() ? "(0)" : ""));
		}
	});
	soiScriptRequest.performRequest();
};

/**
 * Load additional graph data only when user scrolls - "On Demand".
 *
 * @param {currentScrollPosition} number - current scrol position.
 */
AoavSoiComponentWF.prototype.loadGraphDataOnScroll = function(currentScrollPosition) {
	var chartDataObj = this.chartDataObj;
	chartDataObj.LOAD_DAY_TRIGGERED = Math.ceil((currentScrollPosition) / chartDataObj.DAY_MIN_WIDTH);
	var highestVisiblePos = (currentScrollPosition + this.m_soiGraphContainer.width()) / chartDataObj.DAY_MIN_WIDTH;
	var highestVisibleDay = Math.ceil(highestVisiblePos - chartDataObj.IGNORABLE_WIDTH);
	var loadableDays = this.getLoadableDays(chartDataObj.LOAD_DAY_TRIGGERED, highestVisibleDay);
	var lowestLoadableDay = loadableDays.INITIAL_LOAD_DAY;
	var highestLoadableDay = loadableDays.LAST_LOAD_DAY;

	//Load additional graph data if only if data is not available in the graph.
	if (chartDataObj.LOAD_DAY_TRIGGERED <= highestLoadableDay && lowestLoadableDay > 0 && highestLoadableDay > 0) {
		chartDataObj.isGraphScrolled = true;
		this.retrieveAdditionalComponentData(lowestLoadableDay, highestLoadableDay);
	}
	else {
		chartDataObj.isGraphScrolled = false;
	}
};

/**
 * Initilaize graph listeners after loading the graph.
 *
 * 1. Scroll - To dynamically load the additional data in the graph upon scrolling.
 */
AoavSoiComponentWF.prototype.postUpdateGraphActions = function() {
	var self = this;
	var chartDataObj = this.chartDataObj;
	var chartContainerObj = this.m_soiGraphContainer;

	if (chartDataObj.FIRST_TIME_LOAD) {
		chartContainerObj.scrollLeft(chartDataObj.GRAPH_SCROLL_WIDTH);
		chartDataObj.FIRST_TIME_LOAD = false;
	}
	else {
		chartContainerObj.scrollLeft(chartDataObj.graphScrollOffset);
	}

	// Cache the initial scroll position:
	var initialLeftScroll = chartContainerObj.scrollLeft();
	var currentScrollPosition = chartContainerObj.scrollLeft();
	var prevScrollPosition = chartContainerObj.scrollLeft();
	if (initialLeftScroll === 0 && chartDataObj.LOAD_DAY_TRIGGERED < chartDataObj.INITIAL_LOAD_DAY) {
		chartDataObj.isGraphScrolled = true;
		this.retrieveAdditionalComponentData(1, chartDataObj.INITIAL_LOAD_DAY - 1);
	}
	else if (chartDataObj.LOAD_DAY_TRIGGERED < chartDataObj.INITIAL_LOAD_DAY) {
		chartDataObj.isGraphScrolled = true;
		this.retrieveAdditionalComponentData(chartDataObj.LOAD_DAY_TRIGGERED, chartDataObj.INITIAL_LOAD_DAY - 1);
	}

	var timerId = null;
	//Load Additional graph data asynchronously.
	var loadGraphAdditionalGraphData = function() {
		timerId = setTimeout(function() {
			currentScrollPosition = chartContainerObj.scrollLeft();
			var scrollPositionDifference = Math.abs(prevScrollPosition - currentScrollPosition);
			if (scrollPositionDifference <= chartDataObj.SCROLL_BAR_PIXEL_MOVEMENT) {
				chartDataObj.isGraphScrolled = true;
				self.loadGraphDataOnScroll(currentScrollPosition);
			}
			else if (timerId) {
				chartDataObj.isGraphScrolled = false;
				clearTimeout(timerId);
				loadGraphAdditionalGraphData();
			}
			prevScrollPosition = chartContainerObj.scrollLeft();
		}, chartDataObj.SCROLL_BAR_SPEED_TO_LOAD_DATA);
	};

	chartContainerObj.off('scroll');
	chartContainerObj.on('scroll', function(ev) {
		// Get new horizontal scroll offset.
		currentScrollPosition = chartContainerObj.scrollLeft();
		// Determine the difference to verify whether the user has scrolled vertically left (-ve value) or right side (+ve value).
		var leftScrollDifference = currentScrollPosition - initialLeftScroll;
		chartDataObj.graphScrollOffset = currentScrollPosition;
		// Only if there is a difference, enter the condition to verify further load options
		if (!chartDataObj.isGraphScrolled && leftScrollDifference) {
			chartDataObj.isGraphScrolled = true;
			loadGraphAdditionalGraphData();
		}
		// Reset the cache.
		initialLeftScroll = currentScrollPosition;
	});
};

/**
 * Returns array of lowest & highest day which needs to be loaded in the graph visible content area.
 *
 * @param {lowestVisibleDayNumber} number - lowest day number which is viisble on the screen to the user.
 *
 * @param {highestVisibleDayNumber} number - highest day number which is viisble on the screen to the user.
 */
AoavSoiComponentWF.prototype.getLoadableDays = function(lowestVisibleDayNumber, highestVisibleDayNumber) {
	var chartDataObj = this.chartDataObj;
	var allDaysDataLoaded = true;
	var idx = 0;
	var loadableDaysNumber = {
		INITIAL_LOAD_DAY : -1,
		LAST_LOAD_DAY : -1
	};

	lowestVisibleDayNumber = lowestVisibleDayNumber === 0 ? 1 : lowestVisibleDayNumber;
	highestVisibleDayNumber = highestVisibleDayNumber === 0 ? 1 : highestVisibleDayNumber;

	for ( idx = highestVisibleDayNumber - 1; idx >= lowestVisibleDayNumber - 1 && idx >= 0; idx--) {
		if (!chartDataObj.DAY_LOADED[idx]) {
			allDaysDataLoaded = false;
			break;
		}
	}

	if (allDaysDataLoaded) {
		idx = -1;
	}
	else {
		idx += 1;
	}
	loadableDaysNumber.LAST_LOAD_DAY = idx;

	for ( idx = lowestVisibleDayNumber - 1, allDaysDataLoaded = true; idx <= loadableDaysNumber.LAST_LOAD_DAY - 1 && idx <= chartDataObj.TOTAL_DAYS - 1; idx++) {
		if (!chartDataObj.DAY_LOADED[idx]) {
			allDaysDataLoaded = false;
			break;
		}
	}

	if (allDaysDataLoaded) {
		idx = -1;
	}
	else {
		idx += 1;
	}
	loadableDaysNumber.INITIAL_LOAD_DAY = idx;

	return loadableDaysNumber;
};

/**
 * Update the graph axes to show X1 & X2 ticks by calulating graph bar width.
 *
 * @param {isChartDataUpdate} boolean - If there is a chart data to be updated,
 *          X1 axis SOI score also needs to be updated and resized, else only resize
 *          the graph axes.
 */
AoavSoiComponentWF.prototype.updateGraphAxes = function(isChartDataUpdate) {
	var self = this;
	var compId = this.getComponentId();
	var chartDataObj = this.chartDataObj;
	var graphOptions = chartDataObj.soiGraphOptions;
	var x2AxisHTML = "";
	var xAxisHTML = "";
	var daysLength = chartDataObj.TOTAL_DAYS;
	var estimatedCellWidth = 0;
	var estimatedCellWidthRounded = 0;
	var totalCellWidth = 0;
	var finalCellWidth = 0;
	var borderPixelValue = 1;
	var rightMostAxisBorderPixelValue = 0;
	var graphBorderPixelHidden = 1;
	var selectedDayClass = "";
	var buttonClassEvent = "";
	var isGraphAxesSizeUpdateRequired = true;

	var yAxisHTML = "";
	//To get the height of the chart using the chart object
	var chartHeight = chartDataObj.chartContainer.height();
	//To get the chart height for extra space above tick 100
	var chartHeightBuffer = chartHeight * 0.05;
	//Calculate the new height for the extra space on the 100 tick in the Y-axis (as ymax is increased to 105)
	var newChartHeight = chartHeight - chartHeightBuffer;
	//Calculate the height for each tick (span) in the Y-axis
	var yAxisTickHeight = newChartHeight / 10;

	var inICU = 0;
	var notICU = 0;
	var icuSpanWidth = 0;
	var noICUSpanWidth = 0;
	var totalEndDays = 0;
	var finalICUHeaderhtml = "";
	var graphWidthWithoutAxis = this.m_soiGraphContainer.find('.jqplot-series-shadowCanvas').width();
	//chartDataObj.chartMainDivContainer.width();
	estimatedCellWidth = (graphWidthWithoutAxis) / daysLength;
	estimatedCellWidthRounded = Math.round(estimatedCellWidth);

	function appendICUHeaderSpans(totalSpanWidth, spanTypeICU, icuClass) {
		var icuHeaderStr = "";
		icuClass = icuClass ? icuClass : "";
		if (spanTypeICU) {
			icuHeaderStr = "<span class = 'aoav_soi-level-icu aoav_soi-level " + icuClass + "' style='width: " + (totalSpanWidth) + "px'>" + self.soiI18n.ICU_TEXT + "</span>";
		}
		else {
			icuHeaderStr = "<span class = 'aoav_soi-level-not-icu aoav_soi-level " + icuClass + "' style='width: " + (totalSpanWidth) + "px'></span>";
		}
		finalICUHeaderhtml = finalICUHeaderhtml + icuHeaderStr;
	}

	//If there is a change in graph axes size, update it.
	var updatedChartMainDivWidth = chartDataObj.chartMainDivContainer.width();
	if (updatedChartMainDivWidth != chartDataObj.chartMainDivWidth) {
		isGraphAxesSizeUpdateRequired = true;
		chartDataObj.chartMainDivWidth = updatedChartMainDivWidth;
	}
	else {
		isGraphAxesSizeUpdateRequired = false;
		if (!isChartDataUpdate) {
			return;
		}
	}

	//Calculate the width for each axes cell in the graph to create styled cell.
	for ( i = 1; i <= daysLength; i++) {
		selectedDayClass = i === chartDataObj.selectedDay ? "aoav_soi-graph-day-button-selected" : "";
		buttonClassEvent = i <= daysLength - chartDataObj.PREDICTED_LOS_STAY ? "aoav_soi-graph-day-button-event" : "aoav_soi-disabled";
		buttonClassEvent += i === daysLength ? chartDataObj.currentScrollClass : "";
		rightMostAxisBorderPixelValue = i === daysLength ? 1 : 0;

		if (i === daysLength) {
			finalCellWidth = estimatedCellWidthRounded - borderPixelValue - rightMostAxisBorderPixelValue;
		}
		else {
			finalCellWidth = estimatedCellWidthRounded - borderPixelValue;
		}
		totalCellWidth += finalCellWidth;

		//Each cell width is a whole value rounded to (n cell)/length.
		var mathRoundValue = Math.round(estimatedCellWidth * i) - borderPixelValue * i - rightMostAxisBorderPixelValue;
		if (totalCellWidth > mathRoundValue) {
			finalCellWidth -= totalCellWidth - mathRoundValue;
			totalCellWidth = mathRoundValue;
		}
		else if (totalCellWidth < mathRoundValue) {
			finalCellWidth += mathRoundValue - totalCellWidth;
			totalCellWidth = mathRoundValue;
		}

		//If there is no scroll bar for the graph, draw right most border by each individual division separately
		//else border will be drawn by graph container division.
		//Last day cell width occupies 1px extra as graph border pixel value is set to ZERO.
		if (i === daysLength) {
			if (chartDataObj.currentScrollClass === chartDataObj.noScrollClass) {
				finalCellWidth += 1;
				totalCellWidth += 1;
			}
			else {
				//Scroll bar is required which would be drawn by graph container division and so utilize border pixel
				//size as cell width (Add additional 1px value to the existing width).
				finalCellWidth += 2;
				totalCellWidth += 2;
			}
		}

		//Calculate the width for Level of care - ICU or Hospital/Floor/SDU/ETC
		//Utilize above calculated each cell width to calculate width for Level of care.
		if (this.levelOfCareForICU[i - 1] === "ICU") {
			if (noICUSpanWidth !== 0) {
				appendICUHeaderSpans((noICUSpanWidth + totalEndDays - 1), false);
				noICUSpanWidth = 0;
				totalEndDays = 0;
			}
			icuSpanWidth = icuSpanWidth + (finalCellWidth);
			totalEndDays = totalEndDays + 1;
		}
		else {
			if (icuSpanWidth !== 0) {
				appendICUHeaderSpans((icuSpanWidth + totalEndDays - 1), true);
				icuSpanWidth = 0;
				totalEndDays = 0;
			}
			noICUSpanWidth = noICUSpanWidth + (finalCellWidth);
			totalEndDays = totalEndDays + 1;
		}

		//If graph axes size is not updated, no need to update day axis HTML as it remains same - In this
		//case only update SOI range and ICU header HTML.
		if (isGraphAxesSizeUpdateRequired) {
			x2AxisHTML += "<span data='" + i + "' id='button_" + i + "_" + compId + "' class='aoav_soi-graph-xaxes-value aoav_soi-graph-xaxes-buttons aoav_soi_axes " + buttonClassEvent + " " + selectedDayClass;
			x2AxisHTML += "' style='width: " + finalCellWidth + "px'>" + this.soiI18n.DAY_TEXT + "&nbsp;" + i + "</span>";
		}
		xAxisHTML += graphOptions.x1AxisTicks[i - 1].replace('0px', finalCellWidth + 'px');
	}

	//Based on the screen resolution update the scroll class to X1 axis HTML before finalizing.
	if (chartDataObj.currentScrollClass === chartDataObj.noScrollClass) {
		xAxisHTML = xAxisHTML.replace(chartDataObj.scrollClass, chartDataObj.noScrollClass);
	}
	else {
		xAxisHTML = xAxisHTML.replace(chartDataObj.noScrollClass, chartDataObj.scrollClass);
	}

	if (chartDataObj.FIRST_TIME_LOAD) {
		//Adding extra span on the 100 tick in the Y-axis
		yAxisHTML = "<span class='aoav_soi-graph-y-axis-ticks' style='height: " + chartHeightBuffer + "px; width: 100%;'>&nbsp;</span>";
		for ( i = 10; i > 0; i--) {
			if (i === 10) {
				//Adding 100 tick on the Y-axis
				yAxisHTML += "<span class='aoav_soi-graph-y-axis-ticks' style='height: " + yAxisTickHeight + "px; width: 100%; margin-top: -8px;'>100</span>";
			}
			else {
				yAxisHTML += "<span class='aoav_soi-graph-y-axis-ticks' style='height: " + yAxisTickHeight + "px; width: 100%;'>" + (i * 10) + "</span>";
			}
		}

		//Adding the Y-axis html
		this.soiContentContainer.find('.aoav_soi-graph-yvalue-div').html(yAxisHTML);
		//Adding height to the Y-axis div.
		this.soiContentContainer.find('.aoav_soi-graph-yvalue-div').css('height', chartHeight);
	}

	//If graph axes size is not updated, no need to update the day axis HTML as it remains same.
	if (isGraphAxesSizeUpdateRequired) {
		this.m_soiGraphContainer.find('.aoav_soi-graph-day-actual').html(x2AxisHTML);

		// Register the click event for day buttons
		this.m_soiGraphContainer.find(".aoav_soi-graph-day-button-event").click(function() {
			var day = $(this).attr("data");
			self.graphClickEventHandler(day);
		});
	}

	if (noICUSpanWidth !== 0) {
		appendICUHeaderSpans((noICUSpanWidth + totalEndDays - 1), false, chartDataObj.currentScrollClass);
		noICUSpanWidth = 0;
	}
	else if (icuSpanWidth !== 0) {
		appendICUHeaderSpans((icuSpanWidth + totalEndDays - 1), true, chartDataObj.currentScrollClass);
		icuSpanWidth = 0;
	}

	//Update the graph axes html content with newly calculated header HTML.
	$("#graphICUHeader" + compId).html(finalICUHeaderhtml);
	this.m_soiGraphContainer.find('.aoav_soi-graph-xvalue-actual').html(xAxisHTML);
	this.m_soiGraphContainer.find('.aoav_soi_axes').disableSelection();
	this.createDayHoverOnChart();

	//Fix the graph axes width size to the calculated width (Calculated above in the for loop).
	var axesWidth = graphWidthWithoutAxis;
	$("#graphICUHeader" + compId).width(axesWidth + "px");
	this.m_soiGraphContainer.find('.aoav_soi-graph-days-div').width(axesWidth + "px");
	this.m_soiGraphContainer.find('.aoav_soi-graph-xvalue-div').width(axesWidth + "px");
};

/**
 * This function is used to create a banner on top of the page based on the type of banner
 * passed to function the banner is created.
 *
 * @param {enumeration} type - type of banner to be created.
 *
 * @param {String} priText - primary text for banner.
 *
 * @param {String} secText - secondary text for banner.
 *
 * @returns null
 */
AoavSoiComponentWF.prototype.createBannersForErrors = function(type, priText, secText) {
	var compId = this.getComponentId();
	var self = this;
	$("#soiGeneralErrorDiv" + compId).show();
	var $container = $("#soiGeneralErrorDiv" + compId);
	//Initialize a new alert banner instance
	var alertBanner = new MPageUI.AlertBanner();
	//Set the type of alert banner to be displayed
	alertBanner.setType(type);
	//Set the primary text for the alert banner
	alertBanner.setPrimaryText(priText);
	//Set the secondary text for the alert banner
	alertBanner.setSecondaryText(secText);
	//Render the alert banner into the container
	$container.append(alertBanner.render());
};

/**
 * This function is used to render the contents of the aoav-soi component. It takes
 * the data returned from the MP_GET_AOAVSOI script and processes the results in
 * preparation for utilizing the ComponentTable API and the CompSidePanel API.
 *
 * @param {object} reply - The data object returned from the MP_GET_AOAVSOI script.
 *
 * @returns null
 */
AoavSoiComponentWF.prototype.renderComponent = function(reply) {
	var renderAoavSoi = "";
	var self = this;
	var compId = this.getComponentId();
	renderAoavSoi = "<div class='aoav_soi-main-cont'><div class='aoav_soi-error-div' id = 'soiGeneralErrorDiv" + compId + "'></div></div>";
	try {
		if (this.scriptStatus === "Z") {
			this.finalizeComponent(renderAoavSoi, MP_Util.CreateTitleText(this));
			$("#soiGeneralErrorDiv" + compId).show();
			$("#soiGeneralErrorDiv" + compId).append("<span class='aoav_soi_no-data-span'>" + this.soiI18n.NO_DATA_TO_DISPLAY + "</span></div>");
		}
		else {
			var clickTimerName = "CAP:MPG.AOAV_SOI_O1-COMPONENT-LOAD";
			(new CapabilityTimer(clickTimerName, this.getCriterion().category_mean)).capture();
			var slaTimer = MP_Util.CreateTimer(clickTimerName);
			if (slaTimer) {
				slaTimer.SubtimerName = this.criterion.category_mean;
				slaTimer.Stop();
			}

			this.m_reply = reply;
			//Getting the json data retreived from ccl
			var aoavSoiResult = reply;
			var totalDays = aoavSoiResult.data.predictedDays.length;
			var latestDay = aoavSoiResult.data.predictedDays[totalDays - 1].dayNumber;
			var latestDate = this.createDateString(aoavSoiResult.data.predictedDays[totalDays - 1].date);
			/*
			 * BASIC HTML DESIGN FOR THE COMPONENT the page is divided in three divs
			 * 1. top-labels div to keep all the labels on top of chart and side panel
			 * 2. soi-chart div to contain the chart which comes later
			 * 3. soi-index-div which contains side panel
			 */
			var graphYValueIE8 = "";
			if (document.documentMode <= 8) {
				graphYValueIE8 = "aoav_soi-graph-yvalue-ie8";
			}
			renderAoavSoi = "<div class='aoav_soi-main-cont'><div class='aoav_soi-error-div' id = 'soiGeneralErrorDiv" + compId + "'></div><div id= 'soiTopLabels" + compId + "'class = 'aoav_soi-top-labels'></div>";
			renderAoavSoi += "<div class='aoav_soi-graph-sp'><div class='aoav_soi-graph-yvalue-main-div'><div class='aoav_soi-graph-yvalue-top-div " + graphYValueIE8 + "'></div>";
			renderAoavSoi += "<div class='aoav_soi-graph-yvalue-div " + graphYValueIE8 + "'></div><div class='aoav_soi-graph-yvalue-bottom-div " + graphYValueIE8 + "'></div></div>";
			renderAoavSoi += "<div id='soiGraph" + compId + "' class = 'aoav_soi-graph-area'></div><div class='aoav_soi-index-div' id = 'soiIndexDiv" + compId + "'></div></div></div>";

			this.finalizeComponent(renderAoavSoi, MP_Util.CreateTitleText(this));
			this.createBannersForErrors(MPageUI.ALERT_OPTIONS.TYPE.WARNING, self.soiI18n.PRIMARY_MOCK_DATA_STRING, self.soiI18n.SECONDARY_MOCK_DATA_STRING);
			this.m_soiGraphContainer = $("#soiGraph" + compId);
			this.soiContentContainer = $("#aoav_soiContent" + compId);
			this.m_soiIndexDivContainer = $("#soiIndexDiv" + compId);

			this.initializeSidePanel(latestDay, latestDate);
			//Label container for displaying length of stay labels above the Side panel
			this.m_soiLabelContainer = $("#soiTopLabels" + compId);
			this.chartDataObj = new this.chartData();
			this.loadGraph();
			this.createChartData(reply.data);

			this.postUpdateGraphActions();
			//Function to be attached with close button
			this.m_soiSidePanelObj.setCornerCloseFunction(function() {
				self.chartDataObj.selectedDay = 0;
				self.chartDataObj.graphWidthPercent = 0.99;
				self.m_showPanel = false;
				self.m_soiIndexDivContainer.hide();
				self.reDrawGraph(true, true);
				//On closing the side panel load additional graph data if neccessary.
				self.loadGraphDataOnScroll(self.m_soiGraphContainer.scrollLeft());
			});
			//Change the labels based on the availabilty of length of stay variables from the JSON.
			this.changeLengthOfStayLabels(this.levelOfCareForICU[latestDay - 1]);
			//Adding Hospital/ICU Readmission labels
			this.addReadmissionLabels();
			//Calling the function to create the table in side panel for the most
			//recent day for which the patient was in icu
			this.createSoiIndexTableInSidePanel(latestDay);

			//Calling physiologyDetails function to create physiology details table
			var unitOfDisplayNamesArray = [];
			for (var i = 0; i < latestDay + 1; i++) {
				unitOfDisplayNamesArray[i] = "";
			}
			this.setUnitDisplayNamesArr(unitOfDisplayNamesArray);
			this.getSoiUnitOfMeasure(latestDay);
			this.createComorbidityDetailsTable(latestDay);
			this.createSupportDetailsTable(latestDay);
			this.createDeteriorationDetailsTable(latestDay);
			this.m_generalErrorDivCont = $("#soiGeneralErrorDiv" + compId);
		}	
	}
	catch (err) {
		MP_Util.LogJSError(err, this, "aoav-soi-o1.js", "renderComponent");
	}
};

/**
 * Map the AOAV-SOI O1 object to the bedrock filter mapping so the architecture
 * will know what object to create when it sees the "WF_AOAV_SOI" filter
 */
MP_Util.setObjectDefinitionMapping("WF_AOAV_SOI", AoavSoiComponentWF);
