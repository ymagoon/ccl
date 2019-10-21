/**
 * Create the component style object which will be used to style various aspects of the Advanced Growth Chart component.
 * @returns {undefined} - returns undefined as it's a constructor
 */
function AdvGrowthChartStyle() {
	this.initByNamespace("agc");
}

AdvGrowthChartStyle.prototype = new ComponentStyle();
AdvGrowthChartStyle.prototype.constructor = ComponentStyle;

/**
 * Initialize the Advanced Growth Chart component
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 * @returns {undefined} - returns undefined as it's a constructor
 * @constructor
 */
function AdvGrowthChart(criterion) {
	this.tabRefId = 0;
	this.chartSourceFlag = 0;
	this.timeUnitEnum = {DAYS: 0, WEEKS: 1, MONTHS: 2, YEARS: 3};
	this.chartSourceEnum = {CDC: 1, FENTON: 2, WHO: 3};
	//if the bedrock filters are undefined, the CDC and Fenton charts shall show by default
	this.showCDCChart = true;
	this.showFentonChart = true;
	this.setCriterion(criterion);
	this.setStyles(new AdvGrowthChartStyle());
	//Set the timer names so the architecture will create the correct timers for our use
	this.setComponentLoadTimerName("USR:MPG.ADVGROWTHCHART.O1 - load component"); //We will need to change these
	this.setComponentRenderTimerName("ENG:MPG.ADVGROWTHCHART.O1 - render component"); //We will need to change these
	//This will hold the options in the component level drop down menu
	this.compMenuGraph = {};
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
AdvGrowthChart.prototype = new MPageComponent();
AdvGrowthChart.prototype.constructor = MPageComponent;

/* Supporting functions */

/**
 * Set up the link from the "+ Add" to the Pediatric Growth Chart PowerForm
 * @returns {undefined} - no return type
 */
AdvGrowthChart.prototype.openTab = function() {
	var criterion = this.getCriterion();
	if(this.tabRefId > 0.0) {
		var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + this.tabRefId + "|0|0";
		logger.logMPagesEventInfo(this, "POWERFORM", paramString, "advgrowthchart-o1.js", "openTab");
		MPAGES_EVENT("POWERFORM", paramString);
		CERN_EventListener.fireEvent(null, this, EventListener.EVENT_CLINICAL_EVENT, "AdvGrowthChart");
	}
};

/**
 * Setup the display filters for the Advanced Growth Chart component
 * It checks if the patient is over 22 years of age, and if so, the component will not show
 * @returns {undefined} - no return type
 */
AdvGrowthChart.prototype.loadDisplayFilters = function() {
	var dateFilter = new MP_Core.CriterionFilters(this.getCriterion());
	var dateCheck = new Date();
	dateCheck.setFullYear(dateCheck.getFullYear() - 22);
	dateFilter.addFilter(MP_Core.CriterionFilters.DOB_YOUNGER_THAN, dateCheck);
	this.addDisplayFilter(dateFilter);
};

/**
 * This function loads the Bedrock settings
 * @returns {undefined} - no return type
 */
AdvGrowthChart.prototype.loadFilterMappings = function () {
	this.addFilterMappingObject("WF_AGC_CDC_FLAG", {
		setFunction: this.setShowCDC,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("WF_AGC_FENTON_FLAG", {
		setFunction: this.setShowFenton,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("WF_AGC_ZSCORE_FLAG", {
		setFunction: this.setShowZScore,
		type: "Boolean",
		field: "FREETEXT_DESC"
	});
};

/** The following function sets whether or not the CDC chart will display in the component
 * @param {Boolean} isShown - determines whether or not the CDC chart will display
 * @returns {undefined} - no return type
 */
AdvGrowthChart.prototype.setShowCDC = function(isShown) {
	this.showCDCChart = isShown;
};

/** The following function sets whether or not the Fenton chart will display in the component
 * @param {Boolean} isShown - determines whether or not the Fenton chart will display
 * @returns {undefined} - no return type
 */
AdvGrowthChart.prototype.setShowFenton = function(isShown) {
	this.showFentonChart = isShown;
};

/**
 * setShowZScore - sets whether or not the Z-score shall display inline in the component.
 * @param {Boolean} toShow - determines whether or not the Z-score shall show.
 * @returns {undefined} - no return type
 */
AdvGrowthChart.prototype.setShowZScore = function(toShow){
	this.showZScoreAll = toShow;
};

/**
 * The following function determines which chart will be rendered as default
 * and then makes the call to set up the component menu if necessary.
 * @returns {undefined} - no return type
 */
AdvGrowthChart.prototype.preProcessing = function() {
	//See if at least one other chart than the WHO is showing.
	//If so, we add items to the component level menu
	if (this.showCDCChart || this.showFentonChart){
		//Logic for defaulting to a chart; set the chart source flag to the correct chart
		if (this.showCDCChart && this.validateAgeAtLeast(this.getCriterion().getPatientInfo().getDOB(), 2, this.timeUnitEnum.YEARS)) {
			this.chartSourceFlag = this.chartSourceEnum.CDC;
		} else {
			this.chartSourceFlag = this.chartSourceEnum.WHO;
		}
		this.initComponentMenu();
	}
	else {
		//only the WHO chart is showing, don't set up the drop-down menu
		this.chartSourceFlag = this.chartSourceEnum.WHO;
	}
};

/**
 * The following function is used for the component level menu for Advanced Growth Chart
 * Menu options are changing to different formulas for calculating growth percentages
 * Options: CDC, Fenton, WHO
 * @returns {undefined} - no return type
 */
AdvGrowthChart.prototype.initComponentMenu = function() {
	var compMenu = this.getMenu();
	//contains all the entries in the component menu
	var allCompMenuEntries = [];
	var agcI18n = i18n.discernabu.agc;
	var compID = this.getComponentId();
	var self = this;
	if (compMenu) {
		var compMenuWHO = new MenuSelection("compMenuWho" + compID);
		var compMenuFenton;
		var compMenuCDC;
		//Add the CDC Label, if necessary
		if (this.showCDCChart) {
			compMenuCDC = new MenuSelection("compMenuCdc" + compID);
			compMenuCDC.setLabel(agcI18n.CDC);
			compMenu.addMenuItem(compMenuCDC);
			this.compMenuGraph[compMenuCDC.getId()] = compMenuCDC;
			allCompMenuEntries.push(compMenuCDC);
			if (this.chartSourceFlag == this.chartSourceEnum.CDC) {
				compMenuCDC.setIsSelected(true);
			}
		}
		//Add the WHO label
		compMenuWHO.setLabel(agcI18n.WHO);
		compMenu.addMenuItem(compMenuWHO);
		this.compMenuGraph[compMenuWHO.getId()] = compMenuWHO;
		allCompMenuEntries.push(compMenuWHO);
		if (this.chartSourceFlag == this.chartSourceEnum.WHO) {
			compMenuWHO.setIsSelected(true);
		}
		//Add the Fenton label, if necessary
		if (this.showFentonChart) {
			compMenuFenton = new MenuSelection("compMenuFenton" + compID);
			compMenuFenton.setLabel(agcI18n.FENTON);
			compMenu.addMenuItem(compMenuFenton);
			this.compMenuGraph[compMenuFenton.getId()] = compMenuFenton;
			allCompMenuEntries.push(compMenuFenton);
			if (this.chartSourceFlag == this.chartSourceEnum.FENTON) {
				compMenuFenton.setIsSelected(true);
			}
		}
		//function to ensure all menu items are not selected
		var unselectMenuEntries = function() {
			for (var i = allCompMenuEntries.length; i--; ) {
				allCompMenuEntries[i].setIsSelected(false);
			}
		};
		//Add click listeners to the labels in the component menu drop down
		compMenuWHO.setClickFunction(function () {
			self.chartSourceFlag = self.chartSourceEnum.WHO;
			unselectMenuEntries();
			compMenuWHO.setIsSelected(true);
			self.retrieveComponentData();
		});
		if (compMenuCDC) {
			compMenuCDC.setClickFunction(function () {
				self.chartSourceFlag = self.chartSourceEnum.CDC;
				unselectMenuEntries();
				compMenuCDC.setIsSelected(true);
				self.retrieveComponentData();
			});
		}
		if (compMenuFenton) {
			compMenuFenton.setClickFunction(function () {
				self.chartSourceFlag = self.chartSourceEnum.FENTON;
				unselectMenuEntries();
				compMenuFenton.setIsSelected(true);
				self.retrieveComponentData();
			});
		}
	}
	MP_MenuManager.updateMenuObject(compMenu);
};

/**
 * Returns the appropriate HTML code to display the result viewer when a result is clicked on from the table;
 * The call to ResultViewer.launchAdHocViewer() function takes two parameters as input:
 * @param {Number} agcResultId - Result ID
 * @param {String} agcResultItem - Result Item is the result value item shown in the table
 * @param {String} agcGroupName - Group Name of each chart type
 * @return {[]} ar - Contains the link for each result that triggers the result viewer
 */
AdvGrowthChart.prototype.getEventViewerLink = function(agcResultId, agcResultItem, agcGroupName) {
	var ar = [];
	ar.push("<a onclick='ResultViewer.launchAdHocViewer(", agcResultId, ",", + agcGroupName + "); return false;' href='#'>", agcResultItem, "</a>");
	return ar.join("");
};

/**
 * Returns the proper internationalization for event codes
 * @param {string} agcName - The EVENT_NAME of a record data object from AGC
 * @param {[]} graphHTML - An array holding all the HTML needed to build the graph
 * @returns {Number} - return depends on which agcName is passed in
 */
AdvGrowthChart.prototype.convertName = function(agcName, graphHTML) {
	var agcI18n = i18n.discernabu.agc;
	switch (agcName) {
		case "Height":
			graphHTML.push("<div class = 'floatleft'><h2>HEIGHT</h2><div id = 'HEIGHT' class = 'placeholder'><span class = 'align-graph'>", agcI18n.HEIGHT, "</span></div>");
			return agcI18n.HEIGHT;
		case "Weight":
			graphHTML.push("<div class = 'floatleft'><h2>WEIGHT</h2><div id = 'WEIGHT' class = 'placeholder'><span class = 'align-graph'>", agcI18n.WEIGHT, "</span></div>");
			return agcI18n.WEIGHT;
		case "BMI":
			graphHTML.push("<div class = 'floatleft'><h2>BMI</h2><div id = 'BMI' class = 'placeholder'><span class = 'align-graph'>", agcI18n.BMI, "</span></div>");
			return agcI18n.BMI;
		case "Head Circ":
			graphHTML.push("<div class = 'floatleft'><h2>HEAD</h2><div id = 'HEAD' class = 'placeholder'><span class = 'align-graph'>", agcI18n.HEAD, "</span></div>");
			return agcI18n.HEADCIRCUMFERENCE;
	}
};

/**
 * This function sends the appropriate values to the XMLCCLRequestWrapper
 * which sends that information to our CCL "MP_RETRIEVE_ADV_GROWTH_CHART"
 * @returns {undefined} - no return type
 */
AdvGrowthChart.prototype.retrieveComponentData = function() {
	var sendAr = [];
	var criterion = this.getCriterion();
	var lookBackUnits = this.getLookbackUnits() || "0";
	var lookBackType = this.getLookbackUnitTypeFlag() || "-1";
	var prsnlInfo = criterion.getPersonnelInfo();
	var encntrs = prsnlInfo.getViewableEncounters();
	var encntrVal = encntrs ? "value(" + encntrs + ")" : "0.0";
	var encntrValScope = this.getScope() == 2 ? "value(" + criterion.encntr_id + ".0 )" : encntrVal;
	var viewCategoryMean = criterion.category_mean;
	var loadTimer = new RTMSTimer(this.getComponentLoadTimerName(), viewCategoryMean);
	var renderTimer = new RTMSTimer(this.getComponentRenderTimerName(), viewCategoryMean);

	sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", encntrValScope, lookBackUnits, lookBackType, criterion.ppr_cd + ".0", this.chartSourceFlag);

	var request = new ComponentScriptRequest();
	request.setProgramName("MP_RETRIEVE_ADV_GROWTH_CHART");
	request.setParameterArray(sendAr);
	request.setComponent(this);
	request.setLoadTimer(loadTimer);
	request.setRenderTimer(renderTimer);
	request.performRequest();
};

/**
 * This is the AdvGrowthChart implementation of the renderComponent function.  It takes the information retrieved from the script
 * call and renders the component's visuals.  There is no check on the status of the script call's reply since that is handled in the
 * call to XMLCCLRequestWrapper.
 * @param {ScriptReply} reply - The ScriptReply object returned from the call to MP_Core.XMLCCLRequestCallBack function in the
 * retrieveComponentData function of this object.
 * @returns {undefined} - no return type
 */
AdvGrowthChart.prototype.renderComponent = function(reply) {
	var recordData = null;
	var timerRenderComponent = MP_Util.CreateTimer(this.getComponentRenderTimerName());
	try {
		recordData = reply;
		//add 2 digit decimal precision for growth percentiles
		var precision = 2;
		var dtFormat = this.getDateFormat();
		var graphHTML = [];
		var tableHTML = [];
		var agcLen = 0;
		var countText = "";
		var agcObj = recordData.AGC;
		this.tabRefId = recordData.PLUS_ADD_FORM.REF_ID;
		agcLen = agcObj.length;

		var patBirthDtTm = new Date();
		patBirthDtTm.setISO8601(recordData.BIRTH_DT_TM);
		var agcI18n = i18n.discernabu.agc;
		var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
		var nf = new mp_formatter.NumericFormatter(MPAGE_LOCALE);
		var latestText = dtFormat == 3 ? agcI18n.LATEST + "<br/>" + agcI18n.WITHIN : agcI18n.LATEST;
		var previousText = dtFormat == 3 ? agcI18n.PREVIOUS + "<br/>" + agcI18n.WITHIN : agcI18n.PREVIOUS;
		var contentClass = MP_Util.GetContentClass(this, agcLen);
		var headerClass = "agc-hdr";
		if(this.isScrollingEnabled() && agcLen >= this.getScrollNumber()) { //Probably not valid, may need scrolling in resizeComponent()
			contentClass += " gc-scrl-tbl";
			headerClass += " gc-scrl-tbl-hdr";
		}
		//add a component label
		var labelText = "";
		switch (this.chartSourceFlag) {
			case this.chartSourceEnum.WHO :
				labelText = agcI18n.WHO;
				break;
			case this.chartSourceEnum.CDC:
				labelText = agcI18n.CDC;
				break;
			case this.chartSourceEnum.FENTON:
				labelText = agcI18n.FENTON;
				break;
		}
		tableHTML.push("<span class = 'agc-chart-type-label' >", labelText, "</span>");
		//added for extra table section
		tableHTML.push("<div id = 'hideTable' class = 'content-border'>");  //for now removed "hidden" from class, later will be hidden when toggle in place
		//added for table
		tableHTML.push("<div class='", headerClass, "'><table class='agc-table'><thead ><tr><th class='agc-lbl'><span>&nbsp;</span></th><th class='agc-latest-hdr'><span>", latestText, "</span></th><th class='agc-prev-hdr'><span>", previousText, "</span></th></tr></thead></table></div>");
		tableHTML.push("<div class='", contentClass, "'><table class='agc-table'></div>");
		for(var i = 0; i < agcLen; i++) {
			var agcItem = agcObj[i];
			var agcName = agcItem.EVENT_NAME;
			agcName = this.convertName(agcName, graphHTML);
			var oddEven = "odd";
			if(i % 2 === 1) {
				oddEven = "even";
			}
			//added for table
			tableHTML.push("<tr class='", oddEven, "'><td class='agc-lbl'><span class='row-label'>", agcName, "</span></td>");
			var agcMeas = agcItem.MEASUREMENTS;
			var agcResLen = agcMeas.length;
			if(agcResLen > 5) {
				agcResLen = 5;
			}
			for(var j = 0; j < 5; j++) {
				if(j < agcResLen) {
					var agcRes = agcMeas[j];
					var agcVal = nf.format(agcRes.VALUE);
					var agcPct = nf.format(agcRes.PERCENTILE, "." + precision);
					var agcUnits = agcRes.RESULT_UNITS;
					var agcResultVal = "";
					var agcHvrVal = "";
					var resModified = agcRes.MODIFIED_IND === 1 ? "<span class='res-modified'>&nbsp;</span>" : "";
					var measDate = new Date();
					measDate.setISO8601(agcRes.MEAS_DT_TM);
					var measAge = MP_Util.CalcAge(patBirthDtTm, measDate);
					var measDateDisp = df.format(measDate, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
					var faceUpMeasDateDisp = MP_Util.DisplayDateByOption(this, measDate);
					agcResultVal = agcVal + " " + agcUnits + " (" + agcPct + "%)";
					agcHvrVal = agcVal;
					//for table
					tableHTML.push("<td class='agc-res", j + 1, "'><dl class='agc-info'><dd class='agc-res'>", this.getEventViewerLink(agcRes.EVENT_ID, agcResultVal, agcName), resModified);
					//The Z-Score is added inline only if this is true (set by the bedrock setting)
					if (this.showZScoreAll){
						tableHTML.push("<span class='within new-line'>Z = ", nf.format(agcRes.Z_SCORE), "</span>");
					}
					tableHTML.push("<span class='within new-line'>", faceUpMeasDateDisp, "</span></dd></dl><h4 class='det-hd'><span>", agcI18n.RESULT_DETAILS, ":</span></h4><div class='hvr'><dl class='agc-det-age'>", "<dt><span>", agcI18n.AGE, ":</span></dt><dd>", measAge, "</dd>", "<dt><span>", agcI18n.RESULT_DT_TM, ":</span></dt><dd>", measDateDisp, "</dd>", "<dt><span>", agcI18n.RESULT, ":</span></dt><dd>", agcHvrVal + " " + agcRes.RESULT_UNITS, "</dd><dt><span>", agcI18n.PERCENTILE, ":</span></dt><dd><span>", agcPct, "</span></dd><dt><span>", agcI18n.ZSCORE, ":</span></dt><dd><span>", nf.format(agcRes.Z_SCORE), "</span></dd><dt><span>", agcI18n.STATUS, ":</span></dt><dd><span>", agcRes.STATUS_DISP, "</span></dd></dl></div></td>");
					//for graph
					graphHTML.push("<div class = 'spanwidth'><span class='agc-res graphview'>", agcVal + "&nbsp;" + agcRes.RESULT_UNITS, "</span><span class='graphview'>", agcPct, "&nbsp;", agcI18n.PERCENTILE, "</span><span class='graphview'>", measAge, "&nbsp;(", measDateDisp, ")</span></div>");
				}
				//for table
				else {
					tableHTML.push("<td class='agc-res", j + 1, " result-align'><span>--</span></td>");
				}
			}
			//for table
			tableHTML.push("</tr>");
			//for graph
			graphHTML.push("</div>");
		}
		//added for outer div around graph
		graphHTML.push("</div>");
		//for table
		tableHTML.push("</table>");
		tableHTML.push("</div>");
		//added for outer div around table
		tableHTML.push("</div>");
		//add div around graphs, put into table because its the end and they will be merged
		tableHTML.push("<div id = 'hideGraph' class = 'hidden'>");
		var fullTable = tableHTML.join("");
		var fullGraph = graphHTML.join("");
		var jsAgcHTML = fullTable.concat(fullGraph);
		countText = MP_Util.CreateTitleText(this, agcLen);
		MP_Util.Doc.FinalizeComponent(jsAgcHTML, this, countText);  //Ensure HTML is correct from this
	}
	catch (err) {
		if(timerRenderComponent) {
			timerRenderComponent.Abort();
			timerRenderComponent = null;
		}
		logger.logJSError(this, err, "advgrowthchart-o1.js", "renderComponent");
		throw err;
	}
	finally {
		if(timerRenderComponent) {
			timerRenderComponent.Stop();
		}
	}
};

/**
 * Adds the event listener after the component retrieves and renders it's data to allow refreshing to apply correctly.
 * @returns {undefined} - no return type
 */
AdvGrowthChart.prototype.postProcessing = function(){
	//Add a listener for any Clinical Event action so we can refresh the component if a new event is added
	CERN_EventListener.addListener(this, EventListener.EVENT_CLINICAL_EVENT, this.retrieveComponentData, this);
};

/**
 * Given a patient's DOB and an age in the specified units, this function will return
 * true if that patient is at least that old. Otherwise, returns false.
 * @param {Object} patDOB - the patient's day of birth
 * @param {number} age - we check to see if the patient is at least this age
 * @param {number} units - the units of the age (from this.timeUnitEnum)
 * @returns {boolean} - states whether or not the age is at least the specified value
 */
AdvGrowthChart.prototype.validateAgeAtLeast = function(patDOB, age, units) {
	var dateAtGivenAge = new Date();
	var currDtTm = new Date();
	var dayLengthMS = 86400000; // = 1000 * 60 * 60 * 24
	var weekLengthMS = 7 * dayLengthMS;
	var monthLengthMS = 30 * dayLengthMS;
	switch (units) {
		case this.timeUnitEnum.DAYS:
			dateAtGivenAge.setTime(patDOB.getTime() + age * dayLengthMS);
			break;
		case this.timeUnitEnum.WEEKS:
			dateAtGivenAge.setTime(patDOB.getTime() + age * weekLengthMS);
			break;
		case this.timeUnitEnum.MONTHS:
			dateAtGivenAge.setTime(patDOB.getTime() + age * monthLengthMS);
			break;
		default: //Years
			dateAtGivenAge.setTime(patDOB.getTime());
			dateAtGivenAge.setFullYear(patDOB.getFullYear() + age);
			break;
	}
	return currDtTm >= dateAtGivenAge;
};

/**
 * Map the advanced growth chart object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "wf_adv_growth_chart" filter
 */
MP_Util.setObjectDefinitionMapping("wf_adv_growth_chart", AdvGrowthChart);
