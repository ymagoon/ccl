/**
 * The vital signs component retrieves all the vitals results associated to the patient for the specified lookback range or encounter defined in the bedrock.
 * customizable options include the following :
 * Temperature,HeartRate,BloodPressure and Other Groups,Lookback Ranges.
 *
 */

/**
 * The vital sign component style
 *
 * @class
 */
function VitalSignComponentWFStyle() {
	this.initByNamespace("WF_VS");
}

VitalSignComponentWFStyle.prototype = new ComponentStyle();
VitalSignComponentWFStyle.prototype.constructor = ComponentStyle;

/**
 * The vital sign component
 *
 * @param criterion
 *            The criterion containing the requested information
 * @class
 */
function VitalSignComponentWF(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new VitalSignComponentWFStyle());
	this.setComponentLoadTimerName("USR:MPG.VITALSIGNS.WF - load component");
	this.setComponentRenderTimerName("ENG:MPG.VITALSIGNS.WF - render component");
	this.setIncludeLineNumber(false);
	this.m_iViewAdd = false;
	this.bandName = "";
	this.sectionName = "";
	this.itemName = "";
	this.m_recordData = null;
	this.m_showAmbulatoryView = null;
	this.m_showTodayValue = null;
	this.m_ambTableContainer = null;
	this.m_flowsheetTableContainer = null;
	this.m_flowsheetTableObject = null;
	
	//the side panel object for vital signs
	this.sidePanel = null;
	this.m_sidePanelMinHeight = "187px";
	this.m_showPanel = false;
	this.m_sidePanelContainer = null;
	this.m_clickedLabel = "";
	this.m_graphData = null;
	this.m_plot = null;
	this.m_bpGraph = null;

	//max number of results retrieved from CCL in Flowsheet view
	this.m_maxFlowsheetResultCap = 4000;
	//number of results that will be retrieved from CCL in Flowsheet view
	this.m_flowsheetResultCap = this.m_maxFlowsheetResultCap;
	//the number of columns that can fit in the flowsheet view
	this.m_latestColumnCap = 0;
	//Check whether the component should only display Latest* results
	this.m_showingLatestResults = false;

	//If the browser supports Canvas only then show the side panel
	this.SIDE_PANEL_AVAILABLE = CERN_Browser.isCanvasAvailable();
	this.m_ambViewColumnCnt = 7;
	//display string for custom result range selection option
	this.m_resultRangeSelectionDisplayString = i18n.LATEST + "*";
	
	//Default the component to utilize the Latest lookback option
	this.setLookbackUnits(10);
	this.setLookbackUnitTypeFlag(ResultRangeSelectionUtility.CustomType);
	
	//Mapping of element ids and dataObjs for the side panel when a row is selected
	this.m_panelElementData = {};
}

VitalSignComponentWF.prototype = new MPageComponent();
VitalSignComponentWF.prototype.constructor = MPageComponent;

/**
 *  The setRecordData function sets the record data
 * @param {Object} recordData contains the JSON with all the results and associated information.
 */
VitalSignComponentWF.prototype.setRecordData = function(recordData) {
	this.m_recordData = recordData;
};

/**
 *  The getRecordData function is to retrieve the record data
 */
VitalSignComponentWF.prototype.getRecordData = function() {
	return this.m_recordData;
};

/**
 * Set up the handler for Toggle click
 * @param {number} index This indicates the index of the view selected (Flowsheet view is index 0, Ambulatory view is index 1)
 */
VitalSignComponentWF.prototype.handleHeaderToggleClick = function(index) {
	this.m_flowsheetTable = null;
	this.m_componentTable = null;
	this.setShowAmbulatoryView((index === 1) ? 1 : 0);
	
	//display a loading spinner when toggling between the two views
	MP_Util.LoadSpinner("WF_VSContent" + this.getComponentId(), 1);
	
	this.retrieveComponentData();
};

/**
 * This function is responsible for creating the disclaimer message that will be show to the user when the Latest lookback
 * option is selected
 * @return {string} An i18n string shown the Latest disclaimer
 */
VitalSignComponentWF.prototype.createDisclaimerMessage = function(){
	var lookbackDisplay = "";
	switch(this.getBrLookbackUnitTypeFlag()) {
		case 1:
			lookbackDisplay = i18n.discernabu.LAST_N_HOURS_LOWER.replace("{0}", this.getBrLookbackUnits());
			break;
		case 2:
			lookbackDisplay = i18n.discernabu.LAST_N_DAYS_LOWER.replace("{0}", this.getBrLookbackUnits());
			break;
		case 3:
			lookbackDisplay = i18n.discernabu.LAST_N_WEEKS_LOWER.replace("{0}", this.getBrLookbackUnits());
			break;
		case 4:
			lookbackDisplay = i18n.discernabu.LAST_N_MONTHS_LOWER.replace("{0}", this.getBrLookbackUnits());
			break;
		case 5:
			lookbackDisplay = i18n.discernabu.LAST_N_YEARS_LOWER.replace("{0}", this.getBrLookbackUnits());
			break;
		default:
			lookbackDisplay = (this.getScope() === 2) ? i18n.discernabu.SELECTED_VISIT_LOWER : i18n.discernabu.All_VISITS_LOWER;
	}
	return "* " + i18n.discernabu.FLOWSHEET_DISCLAIMER.replace("{0}", this.m_latestColumnCap).replace("{1}", lookbackDisplay);
};

/**
 * This code handles the actions associated with the component menus
 */
VitalSignComponentWF.prototype.preProcessing = function() {
	// Retrieve the preferences for ambulatory view and set the toggle
	if (this.getShowAmbulatoryView()) {
		this.setActiveHeaderToggleIndex(1);
	} else {
		this.setActiveHeaderToggleIndex(0);
	}
	this.setHeaderToggleStyles([{
		active : "table_active",
		inactive : "table_inactive"
	}, {
		active : "viewer_active",
		inactive : "viewer_inactive"
	}]);
	//call to ResultRangeSelectionUtility to add custom result range option in lookbackmenuitems of the component
	var customMenuItem = new ResultRangeSelection();
	customMenuItem.setType(ResultRangeSelectionUtility.CustomType);
	customMenuItem.setDirection(ResultRangeSelectionUtility.direction.BACKWARD);
	customMenuItem.setUnits(0);
	customMenuItem.setScope(this.getScope());
	customMenuItem.setDisplay(this.m_resultRangeSelectionDisplayString);
	ResultRangeSelectionUtility.addCustomResultRangeSelectionItem(this,customMenuItem);
};

/**
 *  The setShowAmbulatoryView function sets a flag which indicates whether to render Ambulatory view by default instead of the Flowsheet view
 *  @param showAmbulatoryView :  This is a Bedrock indicator indicating if ambulatory view should be set as default
 */
VitalSignComponentWF.prototype.setShowAmbulatoryView = function(showAmbulatoryView) {
	this.m_showAmbulatoryView = showAmbulatoryView;
};

/**
 *  The getShowAmbulatoryView function gets a flag which indicates whether to render Ambulatory view by default instead of the Flowsheet view
 */
VitalSignComponentWF.prototype.getShowAmbulatoryView = function() {
	return this.m_showAmbulatoryView;
};

/**
 *  The setShowTodayValue function sets a flag which indicates whether to show Today's results in the first column instead of the Latest when rendering the Ambulatory view
 *  @param showTodayValue :  This is a Bedrock indicator indicating if Today's column should be displayed instead of Latest
 */
VitalSignComponentWF.prototype.setShowTodayValue = function(showTodayValue) {
	this.m_showTodayValue = showTodayValue;
};

/**
 *  The getShowTodayValue function gets a flag which indicates whether to show Today's results in the first column instead of the Latest when rendering the Ambulatory view
 */
VitalSignComponentWF.prototype.getShowTodayValue = function() {
	return this.m_showTodayValue;
};

/**
 * Create the filter mappings for the VitalSignComponentWF component
 */
VitalSignComponentWF.prototype.loadFilterMappings = function() {
	//Add the filterMappings for launching adhoc/iview on clicking the "+" button.
	this.addFilterMappingObject("WF_VS_CHART_LAUNCH_IND", {
		setFunction : this.setIViewAdd,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});

	// Add the filter mappings for Ambulatory View
	this.addFilterMappingObject("WF_VS_DISPLAY", {
		setFunction : this.setShowAmbulatoryView,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});
	this.addFilterMappingObject("WF_VS_RESULTS_IND", {
		setFunction : this.setShowTodayValue,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});
};

/**
 * Retrieving the Vitals data on page load.
 * @function
 * @name retrieveComponentData
 * This function handles the logic to make a ccl script call and retrieve the Vitals data.
 */
VitalSignComponentWF.prototype.retrieveComponentData = function() {
	var temperatureParams = "^^";
	var hrParams = "^^";
	var bloodPressureParams = "";
	var otherParams = "^^";
	var seqParams = "^^";
	var groups = this.getGroups();
	var groupLength = groups.length;
	var z = 0;
	var zl = 0;
	var x = 0;
	var y = 0;
	//set m_showPanel back to false since we want to collapse the 
	//panel upon any new load (toggling views, changing lookback, etc)
	this.m_showPanel = false;
	this.m_clickedLabel = "";
	this.setGraphData(null);
	this.setVitalsPlot(null);

	if (groups && groupLength > 0) {
		for ( x = 0, xl = groupLength; x < xl; x++) {
			var group = groups[x];
			switch (group.getGroupName()) {

				case "WF_TEMP_CE":
					//The temperature values are EVENT_CD based so just create the parameter list.
					temperatureParams = MP_Util.CreateParamArray(group.getEventSets(), 1);
					break;
				case "WF_HR_CE":
					hrParams = MP_Util.CreateParamArray(group.getEventSets(), 1);
					break;
				case "WF_BP_CE":
					if ( group instanceof MPageGrouper) {
						var bpGroups = group.getGroups();
						for ( z = 0, zl = bpGroups.length; z < zl; z++) {
							var tempParams = "";
							var bpCodes = bpGroups[z].getEventCodes();
							//Each Blood pressure grouping should have a systolic and a diastolic event code associated,
							//hence we check if the length of the bpCodes is 2
							if (bpCodes.length === 2) {
								tempParams = bpGroups[z].getGroupName() + "," + bpCodes[0] + "," + bpCodes[1];
								if (z > 0) {
									//If there are more than one Blood pressure groupings, we seperate them using a specific delimeter which is fromCharCode(42) .
									bloodPressureParams += String.fromCharCode(42) + tempParams;
								} else {
									bloodPressureParams = tempParams;
								}
							}
						}
					}
					//The following regular expression  replaces the special characters(if any) in the blood pressure parameters
					//with a character code so that the script would decode the appropriate code and process the results without throwing an error.
					bloodPressureParams = bloodPressureParams.replace(/&#(\d+);/g, function(m, n) {
						return String.fromCharCode(n);
					});
					break;
				case "WF_VS_CE":
				case "WF_VS_CE_SEQ":
					if ( group instanceof MPageSequenceGroup) {
						var mapItems = group.getMapItems();
						var tGroupFilterIds = MP_Util.GetValueFromArray("BR_DATAMART_FILTER", mapItems);
						for ( y = 0, yl = tGroupFilterIds.length; y < yl; y++) {
							//Now loop through the existing groups to match up the Temp/Hr/BP groups
							for ( z = 0, zl = groupLength; z < zl; z++) {
								if (groups[z].getGroupId() === tGroupFilterIds[y]) {
									switch (groups[z].getGroupName()) {
										case "WF_TEMP_CE":
											group.m_items[group.m_items.indexOf(tGroupFilterIds[y])] = -11111;
											continue;
										case "WF_HR_CE":
											group.m_items[group.m_items.indexOf(tGroupFilterIds[y])] = -22222;
											continue;
										case "WF_BP_CE":
											group.m_items[group.m_items.indexOf(tGroupFilterIds[y])] = -33333;
											continue;
										default:
											continue;
									}
								}
							}
						}

						otherParams = MP_Util.CreateParamArray(MP_Util.GetValueFromArray("CODE_VALUE", mapItems), 1);
						seqParams = MP_Util.CreateParamArray(group.getItems(), 1);
					} else {
						//if the results do not belong to any of the above mentioned groups then create the parameters with the associated event sets.
						otherParams = MP_Util.CreateParamArray(group.getEventSets(), 1);
					}
					break;
				default:
					//do nothing.
					break;
			}
		}
	}
	
	var sendAr = [];
	var resultCap = -1;
	var criterion = this.getCriterion();
	var sEncntr = (this.getScope() === 2) ? criterion.encntr_id + ".0" : "0.0";

	//See if we need to load the recent results or rely on another lookback selection
	var lookbackUnits = this.getLookbackUnits();
	var lookbackType = this.getLookbackUnitTypeFlag();
	if(lookbackType === ResultRangeSelectionUtility.CustomType){
		lookbackUnits = this.getBrLookbackUnits();
		lookbackType = this.getBrLookbackUnitTypeFlag();
		
 	 	this.m_latestColumnCap = this.getNumOfColumns();
		//We utilize the column count + 5 so hopefully we will not run into the scenario where we have multiple results in one time bucket and empty cells
		this.m_flowsheetResultCap = this.m_latestColumnCap + 5;
		this.m_showingLatestResults = true;
	}
	else{
		this.m_showingLatestResults = false;
		this.m_flowsheetResultCap = this.m_maxFlowsheetResultCap;
	}

	//Determine the result cap based on the current view type and if the panel is available
	if (this.getShowAmbulatoryView()) {
		if (this.SIDE_PANEL_AVAILABLE) {
			resultCap = 10;
		} else {
			resultCap = this.m_ambViewColumnCnt;
		}		
	} else {
		resultCap = this.m_flowsheetResultCap;
	}
	
	/*Parameter List for the MP_RETRIEVE_VITALS_GROUP_DATA
	 * "Output to File/Printer/MINE" = "MINE"
	 , "Patient Id"
	 , "Encounter Ids"
	 , "Personnel Id"
	 , "Provider Patient Relation Code"
	 , "Lookback Units"
	 , "Lookback Unit Type Flag"
	 , "Begin Date/Time"
	 , "End Date/Time"
	 , "Temperature Event codes"
	 , "Heart Rate Event codes"
	 , "Other Event Codes"
	 , "Blood pressure data string"
	 , "Sequenced event codes"
	 , "Result Count"
	 * */
	var minMaxTemperatureLookBackHour = 24;
	sendAr.push("^MINE^", criterion.person_id + ".0", sEncntr, criterion.provider_id + ".0", criterion.ppr_cd + ".0", lookbackUnits, lookbackType, "^^", "^^", temperatureParams, hrParams, otherParams, "^" + bloodPressureParams + "^", seqParams, resultCap,minMaxTemperatureLookBackHour);
	MP_Core.XMLCclRequestWrapper(this, "MP_RETRIEVE_VITALS_GROUP_DATA", sendAr, true);
};

/**
 * Calculate the number of columns that fit in the viewable area of the component
 * @param {number} componentWidth the component's width
 * @return {boolean} true when only displaying recent results
 */
VitalSignComponentWF.prototype.getNumOfColumns = function(){
	//Get the width of the component
	var componentWidth = $(this.getSectionContentNode()).width();
	//width of the result label table
	var labelColumnWidth = 204;
	//width of columns in flowsheet view
	var columnWidth = 72;
	var pixelBuffer = 2;
	//Calculate the number of columns, and at least display 1 column
	var numColumns = Math.max(1, Math.floor((componentWidth- labelColumnWidth - pixelBuffer) / columnWidth) - 1);
	return numColumns;
};

VitalSignComponentWF.prototype.setIViewAdd = function(value) {
	this.m_iViewAdd = value;
};

VitalSignComponentWF.prototype.isIViewAdd = function() {
	return (this.m_iViewAdd);
};

VitalSignComponentWF.prototype.openIView = function() {
	var criterion = this.getCriterion();
	var paramString = "'" + this.bandName + "','" + this.sectionName + "','" + this.itemName + "'," + criterion.person_id + criterion.encntr_id;
	MP_Util.LogMpagesEventInfo(this, "IVIEW", paramString, "vitals-o2.js", "openIView");
	try {
		var launchIViewApp = window.external.DiscernObjectFactory("TASKDOC");
		launchIViewApp.LaunchIView(this.bandName, this.sectionName, this.itemName, criterion.person_id, criterion.encntr_id);

		CERN_EventListener.fireEvent(null, this, EventListener.EVENT_CLINICAL_EVENT, "vitals");
	} catch (err) {
		MP_Util.LogJSError(err, null, "vitals-o2", "openIView");
	}
};

VitalSignComponentWF.prototype.openTab = function() {
	var criterion = this.getCriterion();
	var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + 0 + "|0|0";
	MP_Util.LogMpagesEventInfo(null, "POWERFORM", paramString, "vitals-o2.js", "openTab");
	MPAGES_EVENT("POWERFORM", paramString);
	this.retrieveComponentData();
};

VitalSignComponentWF.prototype.openDropDown = function(formID) {
	var criterion = this.getCriterion();
	var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + formID + "|0|0";
	MP_Util.LogMpagesEventInfo(null, "POWERFORM", paramString, "vitals-o2.js", "openDropDown");
	MPAGES_EVENT("POWERFORM", paramString);
	this.retrieveComponentData();
};

VitalSignComponentWF.prototype.getModifyIndicator = function(statusMean) {
	return (statusMean === "MODIFIED" || statusMean === "ALTERED") ? "<span class='res-modified'>&nbsp</span>" : "";
};

/**
 * This function is used to ensure the numerical results and dates are formatted for i18n and saves it back to the object
 * @param : result : This is a result Object and it contains the information like the result type, result value etc.
 *
 */
VitalSignComponentWF.prototype.formatResult = function(result) {
	var numberFormatter = MP_Util.GetNumericFormatter();
	if (mp_formatter._isNumber(result.RESULT)) {
		result.RESULT = numberFormatter.format(result.RESULT, "^." + MP_Util.CalculatePrecision(result.RESULT));
	} else if (result.RES_TYPE === 3 && ( typeof result.DATE_FORMATTED == "undefined")) {
		//Date time result still needs to be formatted
		dateResult = new Date();
		dateResult.setISO8601(result.RESULT);
		result.RESULT = dateResult.format("longDateTime3");
		result.DATE_FORMATTED = true;
	}

};

/**
 * This function calculates the appropriate normalcy class of the result depending on the normalcyValue and also the most severe criticality of the additional results
 * depending on the resultIndex and hoverNormalcyClass and also updates the critical indicator if there are any critical results in the list of the results.
 * @param :normalcyValue : This parameter contains the Normalcy Value(CRITICAL,HIGH,LOW..etc) associated with the results
 * @param : resultIndex : This parameter contains the number of results in the particular time bucket and is mainly used to determine the most severe criticality of the additional results.
 * @param : dataObj - This parameter is used to hold the most severe criticality among the additional results.
 */
VitalSignComponentWF.prototype.getNormalcy = function(normalcyValue, resultIndex, hoverNormalcyClass) {
	var normalcyClassObj = {
		"NORMALCY" : "res-normal",
		"HOVERNORMALCY" : hoverNormalcyClass,
		"CRITICAL_IND" : false
	};
	//Pull the normalcy info as well so we can determine the class
	switch(normalcyValue) {
		case "CRITICAL":
		case "EXTREMEHIGH":
		case "PANICHIGH":
		case "EXTREMELOW":
		case "PANICLOW":
		case "VABNORMAL":
		case "POSITIVE":
			normalcyClassObj.CRITICAL_IND = true;
			normalcyClassObj.NORMALCY = "res-severe";
			if (resultIndex > 0) {
				normalcyClassObj.HOVERNORMALCY = "res-severe";
			}
			break;
		case "HIGH":
			normalcyClassObj.NORMALCY = "res-high";
			if (resultIndex > 0 && !(hoverNormalcyClass === "res-severe")) {
				normalcyClassObj.HOVERNORMALCY = "res-high";
			}
			break;
		case "LOW":
			normalcyClassObj.NORMALCY = "res-low";
			if (resultIndex > 0 && !("res-high|res-severe".indexOf(hoverNormalcyClass) >= 0)) {
				normalcyClassObj.HOVERNORMALCY = "res-low";
			}
			break;
		case "ABNORMAL":
			normalcyClassObj.NORMALCY = "res-abnormal";
			if (resultIndex > 0 && !("res-high|res-severe|res-low".indexOf(hoverNormalcyClass) >= 0)) {
				normalcyClassObj.HOVERNORMALCY = "res-abnormal";
			}
			break;
	}
	return normalcyClassObj;
};

/**
 * This function handles the click event within a cell of the results table.It launches the event viewer window.
 * @param : event : Click event
 * @param : dataObj  : This parameter contains the result information for that particular cell,nameSpace for the vitalsComponent and Person_id for the event viewer.
 * @param : tableTriggeredFrom : This is a string of which table type triggered this call (flowsheet or ambulatory)
 */
VitalSignComponentWF.prototype.resultTableCellClickHandler = function(event, dataObj, tableTriggeredFrom) {
	var results = [];
	var resultCnt = 0;
	var x = 0;
	var event_id = "";
	var target_id = $(event.target).data('id');
	var resultViewerTimer = null;
	var self = this;
	try {
		//Gather information about the result in the cell
		results = dataObj.RESULT_DATA.RESULT_OBJ[dataObj.COLUMN_ID].OBJECT_ARR;
		resultCnt = results.length;
		if (resultCnt === 0) {
			return;
		}

		if (event.target.nodeName.toUpperCase() === "SPAN") {

			//Clicked a result so display the result viewer
			var events = [];
			for ( x = 0; x < resultCnt; x++) {

				switch(target_id) {
					case dataObj.NAMESPACE+"diastolic" :
						event_id = results[x].DIA_EVENTS[0] ? results[x].DIA_EVENTS[0].EVENT_ID : "";
						break;
					case dataObj.NAMESPACE+"systolic" :
						event_id = results[x].SYS_EVENTS[0] ? results[x].SYS_EVENTS[0].EVENT_ID : "";
						break;
					default :
						event_id = results[x].EVENT_ID;

				}
				if (event_id) {
					events.push(event_id);
				}

			}
			ResultViewer.launchAdHocViewer(events, dataObj.RESULT_DATA.GROUP_NAME);
			
			//Trigger the CAP timer for the result viewer
			resultViewerTimer = new CapabilityTimer("CAP:MPG Vitals O2 View Result", this.criterion.category_mean);
			if (resultViewerTimer) {
				resultViewerTimer.addMetaData("rtms.legacy.metadata.1", tableTriggeredFrom);
				resultViewerTimer.capture();
			}
		}

	} catch(err) {
		MP_Util.LogJSError(err, null, "vitals_o2.js", "resultTableCellClickHandler");
	}
};


/**
 * @method Returns the jqplot object.
 * @return {object} A reference to the jqplot object.
 */
VitalSignComponentWF.prototype.getVitalsPlot = function () {
    return this.m_plot;
};

/**
 * @method Store a reference to the jqplot object
 * @param {object} plot - A reference to the jqplot object 
 */
VitalSignComponentWF.prototype.setVitalsPlot = function (plot) {
    this.m_plot = plot;
};

/**
 * @method Returns an array containing all points to be plotted on the graph (times and dates).
 * @return {array} - The list of all plotted points on the graph.
 */
VitalSignComponentWF.prototype.getGraphData = function () {
    return this.m_graphData;
};

/**
 * @method Store the reference to an array containing all points to be plotted on the graph (data and dates).
 * @param {array} data - An array containing all points to plot on the graph. 
 */
VitalSignComponentWF.prototype.setGraphData = function (data) {
    this.m_graphData = data;
};


/**
 * @method This method will create the graph using the jqplot API and populate it with the necessary data.
 * @return {null}
 */

VitalSignComponentWF.prototype.plotGraph = function () {
    
	var graphArray = this.getGraphData();
    var graphDivId = "#WF_VS"+this.getComponentId()+"graphHolder";
	var vitalsPlot = this.getVitalsPlot();
	var chartOptions = null;
	var vitalsI18N = i18n.discernabu.vitals_o2;
	var self = this;
	    
    //Below we need to take the position of the tooltip into account. If the point is near the width (x position) of the graph, the tooltip is hidden underneath 
    //the div of the graph.
    	$("#WF_VS" + this.getComponentId() + "graphHolder").bind("jqplotMouseMove", function(ev, gridpos, datapos, neighbor, plot) {
		var x = gridpos.x;
		var y = gridpos.y;
		var plotWidth = plot._width;
		var limitWidth = plotWidth - x;
		var leftMargin = 190;

		var tooltip = $(graphDivId).find(".jqplot-highlighter-tooltip");
		//If the distance between the point we hovered over and the width of the graph is less than the max width
		//of the tooltip, we will move the tooltip to the left so that it is visible.

		if (limitWidth < leftMargin) {
			if (x > leftMargin) {
				tooltip.css('margin-left', '-195px');				
			} else if (x < limitWidth) {
				tooltip.css('margin-left', '-85px');				
			} else {
				tooltip.css('margin-left', '-150px');				
			}
		} else {
			tooltip.css('margin-left', '0');			
		}
		//we need to make sure that the tooltip is not hidden when it's over the allowed height of the div.
		if (y < tooltip.height()) {
			tooltip.css("top", "0px");
		}
    });
	
   	function tooltipEditor(str, seriesIndex, pointIndex, plot) {
          /*
         	data[0] - dateTime,
         	data[1] - Result value
         	data[2] - Normalcy Class
            data[3] - Result Name 
            data[4] - BP Information (only for BP graphs) */        
   
   		var plotLength = plot.data[seriesIndex].length;
		var newPointIndex = pointIndex;
		var data = plot.data[seriesIndex][pointIndex];
		var numberFormatter = MP_Util.GetNumericFormatter();
		// As JQPlot reassigned the pointIndex we need to make sure that we are again assigning the correct point index to the diastolic plots
		if (data == undefined) {
			if(newPointIndex >= plotLength) {
				newPointIndex = newPointIndex - plotLength;			
			}			
		}	
		data = plot.data[seriesIndex][newPointIndex];		

		if(!self.m_bpGraph){
    		return "<div class ='vitals-graph-tooltip'>"+ data[3] +": <span class ='hover-primary-data'><span class='"+ data[2] +"'>&nbsp;<span>"+ numberFormatter.format(data[1], "^." + MP_Util.CalculatePrecision(data[1]))+"</span></span></span><br><span>"+vitalsI18N.DATE_TIME+": <span class ='hover-primary-data'>"+ data[0].format("mediumDate") +"&nbsp;"+data[0].format("militaryTime")+" </span></span></span></div>";
    	} else{
    		return "<div class ='vitals-graph-tooltip'>"+ data[3] +": <span class ='hover-primary-data'>"+data[4]+"</span></span><br><span>"+vitalsI18N.DATE_TIME+": <span class ='hover-primary-data'>"+ data[0].format("mediumDate") +"&nbsp;"+data[0].format("militaryTime")+"</span></span></div>";
    	}
    }
	
	
	if (!this.m_bpGraph) {
		chartOptions = {
	      axes:{
				axesDefaults: { pad: 2},
				xaxis:{
						renderer:$.jqplot.DateAxisRenderer,
						rendererOptions: {
							drawBaseline: false
						}, 
						tickOptions : {
							formatString:'%m/%d/%Y',
							showGridline : false,
							showMark : false,
							fontSize: '8pt',
							show: false
						},
						max: graphArray[graphArray.length-1][0],
						min: graphArray[0][0],
						numberTicks: 2,
						useDST: true								
				},        
				yaxis:{
						pad: 2,
						tickOptions : {
							show: false
					    },
						rendererOptions: {
							drawBaseline: false
						}
				}		
	      },
	      highlighter: {
	        show: true,
	        tooltipContentEditor: tooltipEditor,
	        tooltipLocation: 'ne',
			sizeAdjust: 7
	      },
	      cursor: {
	        show: false
	      },
	      series: [{
	            lineWidth: 2,
	            shadow: false,
	            color: '#505050',
	            markerOptions: {
	                show: true,
					size: 8,
					color: '#505050',
					shadow: false				
	            }
	        }],
		  grid: {
	        	background: '#FFFFFF',      // CSS color for background color of grid.
	        	borderColor: '#DDDDDD',
	        	borderWidth: 0.25,     
	        	shadow: false,
				showBorder: true
		  }
	    };
	} else {
		chartOptions = {
			axes:{
				axesDefaults: { pad: 2},
				xaxis:{
						renderer:$.jqplot.DateAxisRenderer,
						rendererOptions: {
							drawBaseline: false
						}, 
						tickOptions : {
							formatString:'%m/%d/%Y',
							showGridline : false,
							showMark : false,
							fontSize: '8pt',
							show: false
						},
						max: graphArray[graphArray.length-1][0].getTime() + 6000*60*60*24*2,  // Pad the min value by 2 days
						min: graphArray[0][0].getTime() - 6000*60*60*24*2,  // Pad the max value by 2 days
						useDST: true								 
				},        
				yaxis:{
						min: Math.floor((this.m_minBP-15) / 10) * 10, //pad the min value to the next lowest 15
						max: Math.ceil((this.m_maxBP+15) / 10) * 10,  //pad the max value to the next highest 15
						tickInterval: 10,
						pad: 2,
						tickOptions : {
							show: false
					    },
						rendererOptions: {
							drawBaseline: false
						}
				}		
	      },
	      highlighter: {
	        show: true,
	        tooltipContentEditor: tooltipEditor,
	        tooltipLocation: 'ne',
			sizeAdjust: 7
	      },
	      cursor: {
	        show: false
	      },
		  series: [{
				renderer: $.jqplot.HLWhiskerRenderer,				
				showLine: false,
				rendererOptions: {
					"hiColor": "#505050",
					"lowColor": "#505050",
					"hiWidth": 2,
					"lowWidth": 2,
					"lineWidth": 2,
					"wickColor": "#505050",
					"wickWidth": 1,
					"tickLength": 4
				},
				markerOptions: {
	                show: true,
					size: 2,
					color: '#505050',
					shadow: false				
	            }	
		   }],
		   grid: {
	        	background: '#FFFFFF',      // CSS color for background color of grid.
	        	borderColor: '#DDDDDD',
	        	borderWidth: 0.25,     
	        	shadow: false,
				showBorder: true
		  }
	    };
	}    
    
	vitalsPlot = $.jqplot('WF_VS'+this.getComponentId()+'graphHolder', [graphArray],chartOptions); 
    this.setVitalsPlot(vitalsPlot); 
}; 




/**
 * This function handles the click event within a cell of the group name only
 * @param {object} event - Contains the parameters of a cell click
 * @param {object} dataObj - Parameter containing the result information for that particular group name cell,nameSpace for the vitalsComponent and Person_id.
 */
VitalSignComponentWF.prototype.groupNameCellClickHandler = function(event, dataObj) {
	// Retrieve component ID
	var componentId = this.getComponentId();
	var vitalsI18N = i18n.discernabu.vitals_o2;
	var criterion = this.getCriterion();
	var isAmbView = this.getShowAmbulatoryView();
	var tableHeight = null;

	if (this.m_clickedLabel.length) {
		if (dataObj.RESULT_DATA.GROUP_NAME == this.m_clickedLabel) {
			this.sidePanel.m_closeButton.trigger('click');
			this.m_clickedLabel = "";
			return;
		}
	}

	//if the side panel is not showing, then adjust the display
	if (!this.m_showPanel) {
		//shrink the table and show the panel
		if (isAmbView) {
			this.m_ambTableContainer.addClass("vitals-wf-side-panel-addition");
			//get the latest height of table
			tableHeight = $("#WF_VS" + this.getComponentId() + "table").css("height");
		} else {
			//add 11 to the actual panels width to allow the vertical scroll bar to appear when necessary
			this.m_flowsheetTableObject.setSidePanelWidth(this.m_sidePanelContainer.outerWidth() + 11);
			this.m_flowsheetTableContainer.addClass("vitals-wf-side-panel-addition");
			this.m_flowsheetTableObject.updateAfterResize();
			//get the latest height of table
			tableHeight = $("#WF_VS" + this.getComponentId() + "resultsTabletable").css("height");
		}
		//set the panel to the shrunk table height
		this.sidePanel.setHeight(tableHeight);
		//call the side panels resize function
		this.sidePanel.resizePanel();
		this.m_sidePanelContainer.css("display", "inline-block");
		this.m_showPanel = true;
		this.sidePanel.showPanel();
	}

	// Define the number of most recent results the side panel will display for a selected group
	var numberOfMostRecentResults = 10;
	var differentUOM = false;
	var nonNumericBP = false;
	var nameAndUOM = "";

	// Event exists only when the group name is clicked
	if (event) {
		// If the group name is clicked then retrieve the row of that cell
		var currentRowSelected = $(event.currentTarget.parentNode);

		// Highlight the selected row
		this.highlightSelectedRow(currentRowSelected);
	}
	
	if (!isAmbView && dataObj.RESULT_DATA.RESULT_UOM) {
		nameAndUOM = dataObj.RESULT_DATA.RESULT_GROUP_NAME + "<br />" + dataObj.RESULT_DATA.RESULT_UOM;
	} else {
		nameAndUOM = dataObj.RESULT_DATA.RESULT_GROUP_NAME;
	}

	//Start the side panel html
	var sidePanelHTML = "<div id='WF_VS" + componentId + "sidePanelResultsContainer'><div id='WF_VS" + componentId + "sidePanelGroupName' class='vitals-wf-side-panel-groupname'>" + nameAndUOM + "</div><div id = 'WF_VS" + componentId + "testResult' class = 'vitals-flex-text'></div><div id='WF_VS" + componentId + "graphHolder' class='vitals-canvas-height'></div><div id='WF_VS" + componentId + "dateRange' class = 'vitals-date-range'></div>" + "<div id='sidePanelScrollContainer" + componentId + "'><div id='WF_VS" + componentId + "sidePanelResultList' class='vitals-wf-side-panel-result-list'>";

	//Prepare the result list html
	var measurementLength = 0;
	var resultHTML = "";
	var todaysDate = new Date();
	var graphArray = [];

	// If result is a BP type then it needs to be processed and displayed differently
	if (dataObj.RESULT_DATA.IS_BP_RESULT) {
		var systolicBPResult = "";
		var diastolicBPResult = "";
		var sysResultObjInfo = {};
		var diaResultObjInfo = {};
		var resultClass = "";
		this.m_bpGraph = true;
		var allBPResults = [];
			

		// Since the systolic and diastolic results are grouped by date, only 1 result date/time will be displayed than separate dates
		var bpResultDateTime = null;
		var bpResultDateTimeStr = "";

		// Determine the measurement length
		if (isAmbView) {
			measurementLength = Math.min(dataObj.RESULT_DATA.length, numberOfMostRecentResults);
		} else {
			measurementLength = dataObj.RESULT_DATA.RESULTS_SHOWN;
		}

		for (var idx = 0; idx < measurementLength; idx++) {
			// Get the BP result
			var bpMeasurement = dataObj.RESULT_DATA[idx];
			BPGraphHover = "";	

			// Result object is retrieved at index 0 since the systolic/diastolic event array in Ambulatory View always have one systolic/diastolic result unlike Flowsheet view
			var systolicResultObj = bpMeasurement.SYS_EVENTS[0];
			var diastolicResultObj = bpMeasurement.DIA_EVENTS[0];

			//set up bp sys and dia element ids
			var bpSysId = "WF_VS" + componentId + "bpSysResult" + idx;
			var bpDiaId = "WF_VS" + componentId + "bpDiaResult" + idx;

			if (bpMeasurement.SYS_EVENTS.length) {
				// Format the systolic date to show date and time in appropriate format (e.g.  May 20, 2014 09:00 )
				bpResultDateTime = new Date();
				bpResultDateTime.setISO8601(systolicResultObj.DTTM);

				//Ensure the numerical results and dates are formatted for i18n and save it back to the object
				this.formatResult(bpMeasurement.SYS_EVENTS[0]);

				//If the result date matches todays date, use the Today label
				if (bpResultDateTime.getDate() === todaysDate.getDate() && bpResultDateTime.getMonth() === todaysDate.getMonth() && bpResultDateTime.getFullYear() === todaysDate.getFullYear()) {
					bpResultDateTimeStr = "<span>" + vitalsI18N.TODAY + "</span>";
				} else {
					bpResultDateTimeStr = "<span>" + bpResultDateTime.format("mediumDate") + "</span>";
				}

				bpResultDateTimeStr += "<span class='vitals-wf-side-panel-result-item'>" + bpResultDateTime.format("militaryTime") + "</span>";
				systolicBPResult = systolicResultObj.RESULT;

				// Retreive the modified indicator for systolic BP
				bpMeasurement.SYS_MODIFIED_IND = this.getModifyIndicator(systolicResultObj.STATUS_MEAN);

				//First check to see if measurement has normalcy class, if it does not show in the table then it doesn't have one yet
				if (!bpMeasurement.SYS_NORMALCY_CLASS) {
					bpMeasurement.SYS_NORMALCY_CLASS = this.getNormalcy(bpMeasurement.SYS_EVENTS[0].NORMALCY, 0).NORMALCY;
				}

				// check if comments exist
				if (bpMeasurement.SYS_EVENTS[0].HAS_COMMENTS_IND) {
					bpMeasurement.SYS_COMMENT_IND = 1;
				}

				//Set up systolic result info
				sysResultObjInfo = {
					EVENT_ID : systolicResultObj.EVENT_ID,
					NAME : dataObj.RESULT_DATA.GROUP_NAME
				};
				this.m_panelElementData[bpSysId] = sysResultObjInfo;
			}
			else {
				systolicBPResult = "--";
				bpMeasurement.SYS_MODIFIED_IND = "";
				bpMeasurement.SYS_COMMENT_IND = 0;
			}

			if (bpMeasurement.DIA_EVENTS.length) {
				// Format the diastolic date to show date and time in appropriate format (e.g.  May 20, 2014 09:00 )
				bpResultDateTime = new Date();
				bpResultDateTime.setISO8601(diastolicResultObj.DTTM);

				//Ensure the numerical results and dates are formatted for i18n and save it back to the object
				this.formatResult(bpMeasurement.DIA_EVENTS[0]);

				//If the result date matches todays date, use the Today label
				if (bpResultDateTime.getDate() === todaysDate.getDate() && bpResultDateTime.getMonth() === todaysDate.getMonth() && bpResultDateTime.getFullYear() === todaysDate.getFullYear()) {
					bpResultDateTimeStr = "<span>" + vitalsI18N.TODAY + "</span>";
				} else {
					bpResultDateTimeStr = "<span>" + bpResultDateTime.format("mediumDate") + "</span>";
				}

				bpResultDateTimeStr += "<span class='vitals-wf-side-panel-result-item'>" + bpResultDateTime.format("militaryTime") + "</span>";
				diastolicBPResult = diastolicResultObj.RESULT;

				// Retreive the modified indicator for diastolic BP
				bpMeasurement.DIA_MODIFIED_IND = this.getModifyIndicator(diastolicResultObj.STATUS_MEAN);

				//First check to see if measurement has normalcy class, if it does not show in the table then it doesn't have one yet
				if (!bpMeasurement.DIA_NORMALCY_CLASS) {
					bpMeasurement.DIA_NORMALCY_CLASS = this.getNormalcy(bpMeasurement.DIA_EVENTS[0].NORMALCY, 0).NORMALCY;
				}

				// check if comments exist
				if (bpMeasurement.DIA_EVENTS[0].HAS_COMMENTS_IND) {
					bpMeasurement.DIA_COMMENT_IND = 1;
				}

				//Set up diastolic result info
				diaResultObjInfo = {
					EVENT_ID : diastolicResultObj.EVENT_ID,
					NAME : dataObj.RESULT_DATA.GROUP_NAME
				};
				this.m_panelElementData[bpDiaId] = diaResultObjInfo;

			}
			else {
				diastolicBPResult = "--";
				bpMeasurement.DIA_MODIFIED_IND = "";
				bpMeasurement.DIA_COMMENT_IND = 0;
			}

			//Adjust the class if the result does not exist
			resultClass = (systolicBPResult !== "--") ? "result-variable" : "";
			// Show the systolic blood pressure result with appropriate normalcy class
			resultHTML += "<dl><dd class='vitals-wf-bp-result-value'><span class=" + bpMeasurement.SYS_NORMALCY_CLASS + "><span class='res-ind'></span><span class='" + resultClass + "' id='" + bpSysId + "'>" + systolicBPResult;
			BPGraphHover += "<span class='vitals-wf-bp-result-value'><span class=" + bpMeasurement.SYS_NORMALCY_CLASS + "><span class='" + resultClass + "' id='" + bpSysId + "'>" + systolicBPResult;
			//check for comments, if at least one exists, add comment indicator
			if (bpMeasurement.SYS_COMMENT_IND) {
				resultHTML += "<span class='vitals-wf-comments-ind'></span>";
			}

			// close the other spans
			BPGraphHover += bpMeasurement.SYS_MODIFIED_IND + "</span></span>  /  ";
			resultHTML += bpMeasurement.SYS_MODIFIED_IND + "</span></span>  /  ";

			//Adjust the class if the result does not exist
			resultClass = (diastolicBPResult !== "--") ? "result-variable" : "";
			// Show the diastolic blood pressure result with appropriate normalcy class
			BPGraphHover += "<span class=" + bpMeasurement.DIA_NORMALCY_CLASS + "><span class='" + resultClass + "' id='" + bpDiaId + "'>" + diastolicBPResult;
			resultHTML += "<span class=" + bpMeasurement.DIA_NORMALCY_CLASS + "><span class='res-ind'></span><span class='" + resultClass + "' id='" + bpDiaId + "'>" + diastolicBPResult;

			//check for comments, if at least one exists, add comment indicator
			if (bpMeasurement.DIA_COMMENT_IND) {
				resultHTML += "<span class='vitals-wf-comments-ind'></span>";
			}

			// close the other spans
			BPGraphHover += bpMeasurement.DIA_MODIFIED_IND + "</span></span>";
			resultHTML += bpMeasurement.DIA_MODIFIED_IND + "</span></span></dd>";			
			
			// Display the result date/time
			resultHTML += "<dd  class='secondary-text vitals-wf-bp-result-date'>" + bpResultDateTimeStr + "</dd>";		
			// Show the event set name next to every result
			resultHTML += "<dd  class='secondary-text vitals-wf-bp-result-name'>" + bpMeasurement.BP_GROUP_NAME + "</dd>";
			resultHTML += "</dl>";
			
			if(!isNaN(systolicBPResult)){
				allBPResults.push(parseFloat(systolicBPResult));
			}	
			if(!isNaN(diastolicBPResult)){
				allBPResults.push(parseFloat(diastolicBPResult));	
			}								
			
			//Set the values in the graphArray only if both systolic and diastolic values are non numeric
			if (isNaN(systolicBPResult) && isNaN(diastolicBPResult)) {
				nonNumericBP = true;
			} else {	
				graphArray.push([bpResultDateTime, parseFloat(diastolicBPResult) || Number(NaN), parseFloat(systolicBPResult) || Number(NaN), bpMeasurement.BP_GROUP_NAME, BPGraphHover]);
			}	
	
			
		}
		// set the value for clicked label
		this.m_clickedLabel = vitalsI18N.BLOOD_PRESSURE;
		this.m_minBP = Math.min.apply(Math, allBPResults);
		this.m_maxBP = Math.max.apply(Math, allBPResults);
	}

	else {
		//Non-BP variables
		var firstResultUOM = dataObj.RESULT_DATA.FIRST_RES_UOM;
		var resultDiffUOM = "";
		var measurement = null;
		var dateTime = null;
		var elementId = "";
		var resultObjInfo = null;
		this.m_bpGraph = false;

		// Determine the measurement length
		if (isAmbView) {
			measurementLength = Math.min(dataObj.RESULT_DATA.MEASUREMENTS.length, numberOfMostRecentResults);
		} else {
			measurementLength = dataObj.RESULT_DATA.RESULTS_SHOWN;
		}

		// Process results for non-BP type result
		for (var measIdx = 0; measIdx < measurementLength; measIdx++) {
			// Get the measurement object
			measurement = dataObj.RESULT_DATA.MEASUREMENTS[measIdx];

			//Format the date to show date and time in appropriate format
			dateTime = new Date();
			dateTime.setISO8601(measurement.DTTM);

			// Determine if the result has the modified indicator
			measurement.MODIFIED_IND = this.getModifyIndicator(measurement.STATUS_MEAN);

			//First check to see if measurement has normalcy class, if it does not show in the table then it doesn't have one yet
			if (!measurement.NORMALCY_CLASS) {
				measurement.NORMALCY_CLASS = this.getNormalcy(measurement.NORMALCY, 0).NORMALCY;
			}

			//Ensure the numerical results and dates are formatted for i18n and save it back to the object
			this.formatResult(measurement);
			var localeGraphArrayValue =0;
			// We need to pass float values to JQPlot, make sure that we are formatting them if they are valid number values. NAN values will not be plotted.
			if (isFinite(measurement.RESULT)) {
				localeGraphArrayValue = parseFloat(measurement.RESULT);
			} else{
				if((/^\d+(?:[,]\d+)$/gm).test(measurement.RESULT)){
					var actualGraphArrayValue = measurement.RESULT.toString().split(",");
					localeGraphArrayValue = actualGraphArrayValue[0] + (actualGraphArrayValue[1] ? "." + actualGraphArrayValue[1] : "");
					localeGraphArrayValue = parseFloat(localeGraphArrayValue);
				}
			}

			//compare the units of measure to the first results uom, only show uom if its different
			//no space here so if the uom matches, you will not display a space (which is why I am not
			//putting in a space in the html string below)
			resultDiffUOM = "";
			if (measurement.UOM === firstResultUOM) {
				//Set the values in the graphArray
				graphArray.push([dateTime, localeGraphArrayValue, measurement.NORMALCY_CLASS, measurement.RESULT_NAME, measurement.RES_TYPE]);
			} else if (measurement.UOM) {
				//add a space here otherwise it would be directly next to the result value
				resultDiffUOM = " " + measurement.UOM;
				differentUOM = true;
			} else {
				//space here is intentional, otherwise would be directly next to the result value
				resultDiffUOM = " --";
			}

			//set up id mapping for this row
			elementId = "WF_VS" + componentId + "otherResult" + measIdx;
			resultObjInfo = {
				EVENT_ID : measurement.EVENT_ID,
				NAME : dataObj.RESULT_DATA.GROUP_NAME
			};
			this.m_panelElementData[elementId] = resultObjInfo;

			// Also dislay the appropriate result indicators
			resultHTML += "<dl><dd class='vitals-wf-result-value'><span class=" + measurement.NORMALCY_CLASS + "><span class='res-ind'></span>";
			resultHTML += "<span class='result-variable' id='" + elementId + "'>" + measurement.RESULT + resultDiffUOM;

			//check for comments, if at least one exists, add comment indicator
			if (measurement.HAS_COMMENTS_IND) {
				resultHTML += "<span class='vitals-wf-comments-ind'></span>";
			}

			//Close result-variable span, normalcy span, and dd
			resultHTML += measurement.MODIFIED_IND + "</span></span></dd>";

			// The date needs to be displayed as May 20, 2014 09:00 so formatting the date, unless its today
			// check to see if date of result is today
			if (dateTime.getDate() === todaysDate.getDate() && dateTime.getMonth() === todaysDate.getMonth() && dateTime.getFullYear() === todaysDate.getFullYear()) {
				resultHTML += "<dd class='secondary-text vitals-wf-result-date'><span>" + vitalsI18N.TODAY + "</span>";
			} else {
				resultHTML += "<dd class='secondary-text vitals-wf-result-date'><span>" + dateTime.format("mediumDate") + "</span>";
			}
			resultHTML += "<span class='vitals-wf-side-panel-result-item'>" + dateTime.format("militaryTime") + "</span></dd>";
			resultHTML += "<dd class='secondary-text vitals-wf-result-name'>" + measurement.RESULT_NAME + "</dd>";
			resultHTML += "</dl>";
		}
		// set the value for clicked label
		this.m_clickedLabel = dataObj.RESULT_DATA.GROUP_NAME;	
	}
	sidePanelHTML += resultHTML + "</div></div></div>";
	this.sidePanel.setContents(sidePanelHTML, "WF_VSContent" + componentId);

	//attach a click event to each result value to launch the result viewer
	this.addClickToResult();

	// Get the id for the graph holder where the graph will be plotted
	var namespaceId = this.getStyles().getId();

	var graphDivId = "#" + namespaceId + "graphHolder";
	var graphHolder = $(graphDivId);
	var testResult = $('#' + namespaceId + 'testResult');
	var graphDateRange = $('#' + namespaceId + 'dateRange');

	var minDate = null;
	var maxDate = null;
	var testResultHTML = "";
	var graphDateHTML = "";

	testResult.empty();
	graphDateRange.empty();
			
	if (graphArray.length > 0) {
		minDate = graphArray[graphArray.length-1][0].format("mediumDate");
		maxDate = graphArray[0][0].format("mediumDate");
	}
	graphDateHTML += "<div><span class = 'graph-date-left'>" + minDate + "</span><span class='graph-date-right'>" + maxDate + "</span></div>";

	if (!this.m_bpGraph) {
		// Flex text for non BP
		// Display the 1st result face up before the graph
		if (graphArray.length === 0 || (isNaN(graphArray[0][1]))) {
			testResultHTML += "<div class = 'vitals-no-graph-results'><span class='vitals-warning-image'>&nbsp;</span>" + vitalsI18N.NODATA +"</div>";
			// Hide the graphHolder div and the dateRange div as we do not want to show the empty space
			graphHolder.hide();
			graphDateRange.hide();
		} else if (differentUOM && graphArray.length > 1) {
			testResultHTML += "<div class = 'vitals-not-all-results'><span class='vitals-warning-image'>&nbsp;</span>" + vitalsI18N.NOTALLDATA +"</div>";
		/* Check for result type 'Free Text' with no UOM(Units of Measurements) such as chief compalint or Substance Abuse.
		   If incase user charted data for these free text as fractional values for eg: 45.4 or 65.5 then we can identify that as free text by its result type 
		   and with empty unit of mesasurement.
		*/
		}else if((graphArray[0][4] > 1) && !differentUOM){
			testResultHTML += "<div class = 'vitals-no-graph-results'><span class='vitals-warning-image'>&nbsp;</span>" + vitalsI18N.NODATA +"</div>";
			// Hide the graphHolder div and the dateRange div as we do not want to show the empty space
			graphHolder.hide();
			graphDateRange.hide();
		}
	} else {
		// Flex text for BP Graph
		// Display the 1st result face up before the graph
		if (graphArray.length === 0) {
	 		testResultHTML += "<div class = 'vitals-no-graph-results'><span class='vitals-warning-image'>&nbsp;</span>" + vitalsI18N.NODATA +"</div>";
	 		// Hide the graphHolder div and the dateRange div as we do not want to show the empty space
	 		graphHolder.hide();
	 		graphDateRange.hide();
	 	} else if (nonNumericBP && graphArray.length > 1) {
	 		testResultHTML += "<div class = 'vitals-not-all-results'><span class='vitals-warning-image'>&nbsp;</span>" + vitalsI18N.NOTALLDATA +"</div>";
	 	} 
	}	
	
	/* Suppose if graph result is only one and its not a numeric or fractional value then we need to display the following message*/
	if (graphArray.length == 1 && !isNaN(graphArray[0][1])) {
	 		testResultHTML += "<div class = 'vitals-no-graph-results'><span class='vitals-warning-image'>&nbsp;</span>" + vitalsI18N.SINGLEDATAPOINT + "</div>";
	 		// Hide the graphHolder div and the dateRange div as we do not want to show the empty space
	 		graphHolder.hide();
	 		graphDateRange.hide();
	 	}

	testResult.append(testResultHTML);
	graphDateRange.append(graphDateHTML);	

	graphArray.reverse();

	//Set the graph data and plot the graph
	if (graphArray.length > 0) {
		this.setGraphData(graphArray);
		this.plotGraph();
	} else {
		this.setGraphData(null);
		this.setVitalsPlot(null);
	}
};

/**
 * This function will be called when panel contents are set to attach
 * a click event to each result value. Clicking a result will launch
 * a result viewer just like in the tables.
 */
VitalSignComponentWF.prototype.addClickToResult = function() {
	var self = this;
	var compID = this.getComponentId();
	var resultViewerTimer = null;
	
	//Function to launch the result viewer when a result is clicked
	$("#WF_VS" + compID + "sidePanelResultList").on("click", ".result-variable", function(event) {
		var results = {};
		var target_id = event.target.id;
		try {
			//Retrieve proper data info about selected result value
			results = self.m_panelElementData[target_id];
			if (results) {
				ResultViewer.launchAdHocViewer(results.EVENT_ID, results.NAME);
				
				//Trigger the CAP timer for the result viewer
				resultViewerTimer = new CapabilityTimer("CAP:MPG Vitals O2 View Result", self.criterion.category_mean);
				if (resultViewerTimer) {
					resultViewerTimer.addMetaData("rtms.legacy.metadata.1", "Ambulatory Side Panel");
					resultViewerTimer.capture();
				}
			}

		} catch(err) {
			MP_Util.LogJSError(err, null, "vitals_o2.js", "addClickToResult");
		}
	});

};

/**
 *This function is used to create an object with the results and a critical result indicator for both flowsheet and ambulatory view.
 *@param : result :This parameter contains all the result objects in proper time buckets.
 *@param : criticalResultInd : This parameter indicates if there is atleast one critical result in the result objects.
 */
VitalSignComponentWF.prototype.createResultGroupObj = function(result, criticalResultInd) {
	return {
		"RESULTS" : result,
		"CRITICAL_IND" : criticalResultInd
	};
};

/**
 *This function is used to format the date according to the ISO standards.
 *@param : dateTime :This parameter contains the date that needs to be formatted.
 *@return : returns the formatted according to the ISO standards.
 */
VitalSignComponentWF.prototype.formatDate = function(dateTime) {
	var date = new Date();
	date.setISO8601(dateTime);
	return date.format("longDateTime3");
};
/**
 * Process and prepare the data for the Ambulatory View framework
 * @param {Object} recordData - contains the JSON with all the results and associated information.
 * @return {TableColumn} columnObj - This parameter contains the result object for all results
 * 								which will be processed by the component table architecture to render results appropriately
 */
VitalSignComponentWF.prototype.processResultsForAmbulatoryView = function(recordData) {
	var self = this;
	var criticalResultInd = false;
	var meas = null;
	var groupName = "";
	var columnObj = {};
	var measCnt = 0;
	var resultGroup = null;
	var nameSpace = this.getStyles().getId();
	var resultGroupCnt = recordData.RG.length;
	var vitalsI18N = i18n.discernabu.vitals_o2;
	var todaysDate = new Date();
	this.setRecordData(recordData);
	var z = 0;

	/**
	 *This function is used to format the date/time of the result according to the bedrock settings.
	 * @param resultDateTime : This contains the date time of the result which needs to be formatted.
	 * @return : a string that contains formatted date/time of the result as per the bedrock settings.
	 **/
	function createDateResultHTML(resultDateTime) {
		var resultDate = new Date();
		resultDate.setISO8601(resultDateTime);
		return "<span class='vitals-wf-time-display'>" + MP_Util.DisplayDateByOption(self, resultDate) + "</span>";

	}

	/**
	 *This function is used to create the result object that will be associated with each result
	 * @return {object}   resultObj : An object which contains information about the display of a particular cell,
	 * 									the list of result objects that are associated with that cell
	 */
	function resultObjConstructor() {
		var resultObj = {};
		var i = 0;
		var columnCount = self.m_ambViewColumnCnt;
		for ( i = columnCount; i--; ) {
			resultObj["column" + i] = {
				"DISPLAY" : "--",
				"OBJECT_ARR" : []

			};
		}

		return resultObj;
	}

	/**
	 * Create the display for the result.  This includes the normalcy indicator and the result count
	 * @param {object} resultObj : this object contains all the information associated with the result.
	 * @param {Boolean} isBpResult : this parameter indicates if the result is a Blood Pressure Result, The mark up for Blood Pressure result
	 * 								 is slightly different when compared to other results.
	 * @param {number} unitOfMeasure : the unit of measure of the first result, used to compare all the others to check for differences, except BP
	 * @return {String} :This string contains the html for displaying the result data appropriately with the associated normalcy.
	 */
	function createResultDisplay(resultObj, isBpResult, unitOfMeasure) {
		var resultDisplay = "";
		var normalcyClassObj;
		var resultDateTime = null;
		var dateTimeString = "";
		var resultTime = "";
		var firstResUOM = unitOfMeasure;
		var diffUOM = "";
		if (isBpResult) {
			var sysResult = "";
			var diaResult = "";
			var resultClass = "";
			
			//Create the display and determine the normalcy class
			if (resultObj[0].SYS_EVENTS.length) {

				//calculating the normalcy for the result
				normalcyClassObj = self.getNormalcy(resultObj[0].SYS_EVENTS[0].NORMALCY, 0);

				//Ensure the numerical results and dates are formatted for i18n and save it back to the object
				self.formatResult(resultObj[0].SYS_EVENTS[0]);

				//processing the result,normalcy and modify indicator associated with the result.
				resultObj[0].SYS_RESULT = resultObj[0].SYS_EVENTS[0].RESULT;
				resultObj[0].SYS_NORMALCY_CLASS = normalcyClassObj.NORMALCY;
				resultObj[0].SYS_MODIFIED_IND = self.getModifyIndicator(resultObj[0].SYS_EVENTS[0].STATUS_MEAN);

				//updating the critical indicator if there is any critical result.
				if (!criticalResultInd) {
					criticalResultInd = normalcyClassObj.CRITICAL_IND;
				}
				
				//check for comment indicator
				if (resultObj[0].SYS_EVENTS[0].HAS_COMMENTS_IND) {
					resultObj[0].SYS_COMMENT_IND = "<span class='vitals-wf-comments-ind'></span>";
				} else {
					resultObj[0].SYS_COMMENT_IND = "";
				}
				
				//getting the result time for the face up display
				resultDateTime = resultObj[0].SYS_EVENTS[0].DTTM;

			} else {
				//if the systolic result doesn't exist, displaying a "--"
				resultObj[0].SYS_RESULT = "--";
				resultObj[0].SYS_NORMALCY_CLASS = "";
				resultObj[0].SYS_MODIFIED_IND = "";
				resultObj[0].SYS_COMMENT_IND = "";

			}
			if (resultObj[0].DIA_EVENTS.length) {

				//calculating the normalcy for the result
				normalcyClassObj = self.getNormalcy(resultObj[0].DIA_EVENTS[0].NORMALCY, 0);

				//Ensure the numerical results and dates are formatted for i18n and save it back to the object
				self.formatResult(resultObj[0].DIA_EVENTS[0]);

				//processing the result,normalcy and modify indicator associated with the result.
				resultObj[0].DIA_RESULT = resultObj[0].DIA_EVENTS[0].RESULT;
				resultObj[0].DIA_MODIFIED_IND = self.getModifyIndicator(resultObj[0].DIA_EVENTS[0].STATUS_MEAN);
				resultObj[0].DIA_NORMALCY_CLASS = normalcyClassObj.NORMALCY;

				//getting the result time for the face up display
				resultDateTime = resultObj[0].DIA_EVENTS[0].DTTM;

				//updating the critical indicator if there is any critical result.
				if (!criticalResultInd) {
					criticalResultInd = normalcyClassObj.CRITICAL_IND;
				}
				
				//check for comment indicator
				if (resultObj[0].DIA_EVENTS[0].HAS_COMMENTS_IND) {
					resultObj[0].DIA_COMMENT_IND = "<span class='vitals-wf-comments-ind'></span>";
				} else {
					resultObj[0].DIA_COMMENT_IND = "";
				}

			} else {

				//if the diastolic result doesn't exist, displaying a "--"
				resultObj[0].DIA_RESULT = "--";
				resultObj[0].DIA_NORMALCY_CLASS = "";
				resultObj[0].DIA_MODIFIED_IND = "";
				resultObj[0].DIA_COMMENT_IND = "";
			}

			//constructing the result content for display
			resultClass = (resultObj[0].SYS_RESULT !== "--") ? "result-variable" : "";
			sysResult = '<span class="' + resultObj[0].SYS_NORMALCY_CLASS + '"><span class="res-ind"></span><span data-id = "' + nameSpace + 'systolic" class=' + resultClass + '>' + resultObj[0].SYS_RESULT + resultObj[0].SYS_COMMENT_IND + resultObj[0].SYS_MODIFIED_IND + '</span></span>';
			resultClass = (resultObj[0].DIA_RESULT !== "--") ? "result-variable" : "";
			diaResult = resultObj[0].DIA_RESULT + resultObj[0].DIA_COMMENT_IND + resultObj[0].DIA_MODIFIED_IND;
			diaResult = '<span class="' + resultObj[0].DIA_NORMALCY_CLASS + '"><span class="res-ind"></span><span data-id ="' + nameSpace + 'diastolic" class=' + resultClass + '>' + diaResult + '</span></span>';

			//check the bedrock settings if the date/time needs to be displayed faceup
			if (self.getDateFormat() !== 4) {
				dateTimeString = createDateResultHTML(resultDateTime);
			}

			//constructing the display content
			resultDisplay = sysResult + " / " + diaResult + dateTimeString;

			///return the constructed content
			return resultDisplay;

		} else {

			//Create the display and determine the normalcy class
			normalcyClassObj = self.getNormalcy(resultObj[0].NORMALCY, 0);

			//Save the normalcy class for use in the hover creation
			resultObj[0].NORMALCY_CLASS = normalcyClassObj.NORMALCY;
			//updating the critical indicator if there is any critical result.
			if (!criticalResultInd) {
				criticalResultInd = normalcyClassObj.CRITICAL_IND;
			}

			resultDateTime = resultObj[0].DTTM;

			//Pull the modified indicator
			resultObj[0].MODIFIED_IND = self.getModifyIndicator(resultObj[0].STATUS_MEAN);

			//Ensure the numerical results and dates are formatted for i18n and save it back to the object
			self.formatResult(resultObj[0]);

			//check the bedrock settings if the date/time needs to be displayed faceup
			if (self.getDateFormat() !== 4) {
				dateTimeString = createDateResultHTML(resultDateTime);
			}
			
			// compare the first result unit of measure with the current results uom
			if (resultObj[0].UOM === firstResUOM) {
				// if same, do nothing
			} else if (resultObj[0].UOM) {
				// if not same, put UOM after result before modified indicator
				diffUOM = " " + resultObj[0].UOM;
			} else {
				diffUOM = " --";
			}
			
			//check if comments exist for this result
			if (resultObj[0].HAS_COMMENTS_IND) {
				resultObj[0].COMMENT_IND = "<span class='vitals-wf-comments-ind'></span>";
			} else {
				resultObj[0].COMMENT_IND = "";
			}
			
			//return the constructed content
			return '<span class="' + resultObj[0].NORMALCY_CLASS + '"><span class="res-ind">&nbsp;</span><span class="result-variable" data-id = "' + nameSpace + 'other">' + resultObj[0].RESULT + diffUOM + resultObj[0].COMMENT_IND + resultObj[0].MODIFIED_IND + '</span></span>' + resultDisplay + dateTimeString;

		}

	}

	var measResult = [];

	//Loop through each result group and  prepare the data
	for ( y = 0; y < resultGroupCnt; y++) {
		resultGroup = recordData.RG[y];
		//Internationalizing the group names depending upon the group_type
		switch(resultGroup.GROUP_TYPE) {
			case 1 :
				groupName = "<span title='" + vitalsI18N.TEMPERATURE + "'>" + vitalsI18N.TEMPERATURE + "</span>";
				break;
			case 2 :
				groupName = "<span title='" + vitalsI18N.BLOOD_PRESSURE + "'>" + vitalsI18N.BLOOD_PRESSURE + "</span>";
				break;
			case 3 :
				groupName = "<span title='" + vitalsI18N.HEART_RATE + "'>" + vitalsI18N.HEART_RATE + "</span>";
				break;
			case 4:
				groupName = "<span title='" + resultGroup.GROUP_NAME + "'>" + resultGroup.GROUP_NAME + "</span>";
				break;
			default:
			//do nothing
		}

		if (resultGroup.GROUP_TYPE == 2) {
			resultGroup = recordData.BP_RESULTS;
			measCnt = recordData.BP_RESULTS.length;
			resultGroup.GROUP_TYPE = 2;
			resultGroup.GROUP_NAME = vitalsI18N.BLOOD_PRESSURE;

		} else {
			//Check to see if this result group has any measurements.  If not remove it so we don't have to deal with it later
			measCnt = resultGroup.MEASUREMENTS.length;
		}
		//Create result object
		resultGroup.RESULT_OBJ = resultObjConstructor();
		resultGroup.RESULT_GROUP_NAME = groupName;

		//this part of the code handles the logic to display the result either in "today" column or latest column depending on the bedrock setting.
		//measCnt holds the measurement count, columnCnt keeps account of the number of the column where the result needs to be displayed
		var measureCnt = 0;
		var columnCnt = 0;
		while (measureCnt < this.m_ambViewColumnCnt && columnCnt < this.m_ambViewColumnCnt) {
			//var normalcyRangeString = "";
			//var unitOfMeasureString = "";
			var firstResultUOM = "";
			meas = resultGroup[measureCnt];
			if (resultGroup.GROUP_TYPE == 2) {

				if (meas) {
					resultTime = meas.DIA_EVENTS[0] ? meas.DIA_EVENTS[0].DTTM : meas.SYS_EVENTS[0].DTTM;
				}

				resultGroup.IS_BP_RESULT = true;
			} else if (resultGroup.MEASUREMENTS) {

				meas = resultGroup.MEASUREMENTS[measureCnt];
				if (meas) {
					resultTime = meas.DTTM;
				}
				resultGroup.IS_BP_RESULT = false;
				resultGroup.IS_TEMP_RESULT = resultGroup.GROUP_TYPE == 1 ? true : false;

				//if the result belongs to temperature group storing the Min Max temperature values.
				if (resultGroup.IS_TEMP_RESULT) {
					resultGroup.TEMP_MIN_MAX = recordData.MIN_MAX_TEMP;

				}
			}
			
			//if not a BP result
			if (resultGroup.GROUP_TYPE !== 2) {
				// if first result and has measurements
				if (measureCnt === 0 && meas && !resultGroup.FIRST_RES_UOM) {
					firstResultUOM = meas.UOM;
					/*if (firstResultUOM) {
						unitOfMeasureString = " " + firstResultUOM;
					}*/
					resultGroup.FIRST_RES_UOM = firstResultUOM;
					
					//determine the normalcy range and put in returned html below
					/*if (meas.NLOW && meas.NHIGH) {
						//if both normalcy values are populated, create as follows (low-high)
						normalcyRangeString += "(" + meas.NLOW + "-" + meas.NHIGH + unitOfMeasureString + ")";
					} else if (meas.NHIGH) {
						//else if only high (<= 99.3)
						normalcyRangeString += "(<=" + meas.NHIGH + unitOfMeasureString + ")";
					} else if (meas.NLOW) {
						//else if only low (>= 93.2)
						normalcyRangeString += "(>=" + meas.NLOW + unitOfMeasureString + ")";
					} else if (firstResultUOM) {
						//else (no normalcy), show just unitOfMeasure, no space
						normalcyRangeString += "(" + firstResultUOM + ")";
					}*/
				}
			
			} else {
				//if a BP result
				if (measureCnt === 0 && meas && !resultGroup.FIRST_RES_UOM) {
					//If sys events, use sys UOM, if only dia events, use dia UOM, else leave as null
					if (meas.SYS_EVENTS.length && meas.SYS_EVENTS[0].UOM) {
						firstResultUOM = meas.SYS_EVENTS[0].UOM;
					} else if (meas.DIA_EVENTS.length && meas.DIA_EVENTS[0].UOM) {
						firstResultUOM = meas.DIA_EVENTS[0].UOM;
					}
					/*if (firstResultUOM) {
						unitOfMeasureString = " " + firstResultUOM;
					}*/
					resultGroup.FIRST_RES_UOM = firstResultUOM;
					//determine systolic normalcy range
					/*var sysRange = " --";
					if (meas.SYS_EVENTS.length) {
						if (meas.SYS_EVENTS[0].NLOW && meas.SYS_EVENTS[0].NHIGH) {
							sysRange = meas.SYS_EVENTS[0].NLOW + "-" +  meas.SYS_EVENTS[0].NHIGH;
						} else if (meas.SYS_EVENTS[0].NLOW) {
							sysRange = ">=" + meas.SYS_EVENTS[0].NLOW;
						} else if (meas.SYS_EVENTS[0].NHIGH) {
							sysRange = "<=" + meas.SYS_EVENTS[0].NHIGH;
						}
					}
					//determine diastolic normalcy range
					var diaRange = "-- ";
					if (meas.DIA_EVENTS.length) {
						if (meas.DIA_EVENTS[0].NLOW && meas.DIA_EVENTS[0].NHIGH) {
							diaRange = meas.DIA_EVENTS[0].NLOW + "-" +  meas.DIA_EVENTS[0].NHIGH;
						} else if (meas.DIA_EVENTS[0].NLOW) {
							diaRange = ">=" + meas.DIA_EVENTS[0].NLOW;
						} else if (meas.DIA_EVENTS[0].NHIGH) {
							diaRange = "<=" + meas.DIA_EVENTS[0].NHIGH;
						}
					}
					//build normalcy string
					if (sysRange === " --" && diaRange === "-- ") {
						if (firstResultUOM) {
							//if (no normalcy), show just unitOfMeasure, no space
							normalcyRangeString += "(" + firstResultUOM + ")";
						}
					} else if (meas.DIA_EVENTS.length || meas.SYS_EVENTS.length) {
						normalcyRangeString += "(" + sysRange + " / " + diaRange + unitOfMeasureString + ")";
					}*/
					
				}
			}
			
			//if have results from above then put in a span
			/*if (normalcyRangeString) {
				resultGroup.RESULT_GROUP_NAME += "<br /><span class='vitals-wf-result-info'>" + normalcyRangeString + "</span>";
			}*/
			
			//if have results from above then put in a span
			if (firstResultUOM) {
				resultGroup.RESULT_GROUP_NAME += "<br /><span class='vitals-wf-result-info'>" + resultGroup.FIRST_RES_UOM + "</span>";
			}
			
			if (meas) {
				resultGroup.RESULT_OBJ["column" + columnCnt].OBJECT_ARR.push(meas);

				if (columnCnt === 0) {//checking the bedrock setting for the "today" indicator
					if (self.getShowTodayValue()) {
						var dateTime = new Date();
						dateTime.setISO8601(resultTime);
						if ((dateTime.getDate() === todaysDate.getDate()) && (dateTime.getMonth() === todaysDate.getMonth()) && (dateTime.getFullYear() === todaysDate.getFullYear())) {
							resultGroup.RESULT_OBJ["column" + columnCnt].DISPLAY = createResultDisplay(resultGroup.RESULT_OBJ["column" + columnCnt].OBJECT_ARR, resultGroup.IS_BP_RESULT, resultGroup.FIRST_RES_UOM);
							measureCnt++;

						} else {
							//if the result is not charted today, displaying a "--" and updating the object_arr, so that we dont get incorrect hover information.
							resultGroup.RESULT_OBJ["column" + columnCnt].DISPLAY = "--";
							resultGroup.RESULT_OBJ["column" + columnCnt].OBJECT_ARR = [];
						}

					} else {//displaying results in the latest column
						resultGroup.RESULT_OBJ["column" + columnCnt].DISPLAY = createResultDisplay(resultGroup.RESULT_OBJ["column" + columnCnt].OBJECT_ARR, resultGroup.IS_BP_RESULT, resultGroup.FIRST_RES_UOM);
						measureCnt++;
					}
				} else {//displaying results in the previous column
					resultGroup.RESULT_OBJ["column" + columnCnt].DISPLAY = createResultDisplay(resultGroup.RESULT_OBJ["column" + columnCnt].OBJECT_ARR, resultGroup.IS_BP_RESULT, resultGroup.FIRST_RES_UOM);
					measureCnt++;
				}

			} else {//if the measurement does not exist displaying a "--"
				resultGroup.RESULT_OBJ["column" + columnCnt].DISPLAY = "--";

			}

			columnCnt++;

		}

		measResult.push(resultGroup);

	}

	//constructing the object with the result and critical indicator.
	columnObj = this.createResultGroupObj(measResult, criticalResultInd);

	return columnObj;

};
/**
 * Process and prepare the data for the Flowsheet View
 * @param {Object} recordData - contains the JSON with all the results and associated information.
 * @return {TableColumn} columnObj - This parameter contains the result object and timegroups for all results
 * 								which will be processed by the flowsheet table architecture to render results appropriately
 */
VitalSignComponentWF.prototype.processResultsForFlowsheetView = function(recordData) {
	var self = this;
	var criticalResultInd = false;
	var meas = null;
	var measCnt = 0;
	var curDate = null;
	var nextDate = null;
	var hoverNormalcyClass = "res-normal";
	var resultGroup = null;
	var resultGroupCnt = recordData.RG.length;
	var timeBucketCnt = 0;
	var timeBucketRef = "";
	var vitalsI18N = i18n.discernabu.vitals_o2;
	var nameSpace = this.getStyles().getId();
	var todaysDate = new Date();
	//it's used to format date
	var dateTime = null;
	this.setRecordData(recordData);
	var x = 0;
	var y = 0;
	var z = 0;

	/**
	 *This function is used to create the result object that will be associated with each result
	 * @param {object}    timeGroups : This parameter contains list of all timegroups(Date and time of individual results).
	 * @return {object}   resultObj : An object which contains information about the display of a particular cell,
	 * 									the list of result objects that are associated to that cell and a time display
	 */
	function resultObjConstructor(timeGroups, groupType) {
		var resultObj = {};
		var i = 0;
		
		for ( i = timeGroups.length; i--; ) {
			resultObj[timeGroups[i].TIME_ADJUSTED] = {
				"DISPLAY" : "<span class='" + timeGroups[i].NEW_DAY_CLASS + "'>--</span>",
				"OBJECT_ARR" : []
			};
		}

		return resultObj;
	}

	/**
	 * Create the display for the result.  This includes the normalcy indicator and the result count
	 * @param {object} resultObj : this contains the list of results associated with the respective timebucket
	 * @param {Boolean} isBpResult : this parameter indicates if the result is a Blood Pressure Result, The mark up for Blood Pressure result
	 * 								 is slightly different when compared to other results.
	 * @param {number} unitOfMeasure : the unit of measure of the first result, used to compare all the others to check for differences
	 * @return {String} :This string contains the html for displaying the result data appropriately with the associated normalcy.
	 */
	function createResultDisplay(resultObj, isBpResult, unitOfMeasure) {
		var dateResult = null;
		var result = null;
		var resultCnt = resultObj.length;
		var resultDisplay = "";
		var normalcyClassObj;
		var groupName = "";
		var i = 0;
		var columnObj = {};
		var timeBucket = null;
		var resultClass = "";
		var firstResUOM = unitOfMeasure;
		var diffUOM = "";
		hoverNormalcyClass = "res-normal";

		if (isBpResult) {
			var sysResult = "";
			var diaResult = "";
			
			//Set up HAS_SYS_RESULT and HAS_DIA_RESULT so I can override if true, same with comments
			resultObj[0].HAS_SYS_RESULT = 0;
			resultObj[0].HAS_DIA_RESULT = 0;
			resultObj[0].SYS_COMMENT_IND = "";
			resultObj[0].DIA_COMMENT_IND = "";
			
			//Create the display and determine the normalcy class
			for ( i = 0; i < resultCnt; i++) {
				if (resultObj[i].SYS_EVENTS.length) {
					normalcyClassObj = self.getNormalcy(resultObj[i].SYS_EVENTS[0].NORMALCY, i, hoverNormalcyClass);
					resultObj[i].SYS_NORMALCY_CLASS = normalcyClassObj.NORMALCY;
					hoverNormalcyClass = normalcyClassObj.HOVERNORMALCY;
					if (!criticalResultInd) {
						criticalResultInd = normalcyClassObj.CRITICAL_IND;
					}

					//getting the result for the first object
					if (i === 0) {
						self.formatResult(resultObj[0].SYS_EVENTS[0]);
						resultObj[0].SYS_RESULT = resultObj[0].SYS_EVENTS[0].RESULT;
						resultObj[0].SYS_MODIFIED_IND = self.getModifyIndicator(resultObj[0].SYS_EVENTS[0].STATUS_MEAN);
					}
					
					//check for comment indicator
					if (resultObj[i].SYS_EVENTS[0].HAS_COMMENTS_IND) {
						resultObj[0].SYS_COMMENT_IND = "<span class='vitals-wf-comments-ind'></span>";
					}	
					
					//Set HAS_SYS_RESULT to true, so even if the face up value is empty but others in the timebucket have values
					//The empty result can still be clicked to launch the result viewer
					resultObj[0].HAS_SYS_RESULT = 1;

				} else {
					resultObj[i].SYS_RESULT = "--";
					resultObj[i].SYS_NORMALCY_CLASS = "";
					resultObj[i].SYS_MODIFIED_IND = "";
					resultObj[i].SYS_COMMENT_IND = "";
				}
				if (resultObj[i].DIA_EVENTS.length) {
					normalcyClassObj = self.getNormalcy(resultObj[i].DIA_EVENTS[0].NORMALCY, i, hoverNormalcyClass);
					resultObj[i].DIA_NORMALCY_CLASS = normalcyClassObj.NORMALCY;
					hoverNormalcyClass = normalcyClassObj.HOVERNORMALCY;
					if (!criticalResultInd) {
						criticalResultInd = normalcyClassObj.CRITICAL_IND;
					}

					//formatting the results
					if (i === 0) {
						self.formatResult(resultObj[0].DIA_EVENTS[0]);
						resultObj[0].DIA_RESULT = resultObj[0].DIA_EVENTS[0].RESULT;
						resultObj[0].DIA_MODIFIED_IND = self.getModifyIndicator(resultObj[0].DIA_EVENTS[0].STATUS_MEAN);
					}
					
					//check for comment indicator
					if (resultObj[i].DIA_EVENTS[0].HAS_COMMENTS_IND) {
						resultObj[0].DIA_COMMENT_IND = "<span class='vitals-wf-comments-ind'></span>";
					}
					
					//Set HAS_DIA_RESULT to true, so even if the face up value is empty but others in the timebucket have values
					//The empty result can still be clicked to launch the result viewer
					resultObj[0].HAS_DIA_RESULT = 1;

				} else {
					resultObj[i].DIA_RESULT = "--";
					resultObj[i].DIA_NORMALCY_CLASS = "";
					resultObj[i].DIA_MODIFIED_IND = "";
					resultObj[i].DIA_COMMENT_IND = "";
				}
			}

			sysResult = ((resultCnt > 1) ? "<span class='fs-res-bracket'>[<span class='" + hoverNormalcyClass + "'>" + resultCnt + "</span>]</span>" : "" );
			resultClass = (resultObj[0].HAS_SYS_RESULT !== 0) ? "result-variable" : "";
			sysResult = '<span class="' + resultObj[0].SYS_NORMALCY_CLASS + '"><span class="res-ind"></span><span  data-id = "' + nameSpace + 'systolic" class=' + resultClass + '>' + resultObj[0].SYS_RESULT + resultObj[0].SYS_COMMENT_IND + resultObj[0].SYS_MODIFIED_IND + '</span></span>';
			resultClass = (resultObj[0].HAS_DIA_RESULT !== 0) ? "result-variable" : "";
			diaResult = resultObj[0].DIA_RESULT + resultObj[0].DIA_COMMENT_IND + resultObj[0].DIA_MODIFIED_IND;
			diaResult = '<span class="' + resultObj[0].DIA_NORMALCY_CLASS + '"><span class="res-ind"></span><span data-id ="' + nameSpace + 'diastolic" class=' + resultClass + '>' + diaResult + '</span></span>';
			resultDisplay = sysResult + " / " + diaResult;

			//return the constructed content
			return resultDisplay;
		} else {
			
			//Set comment indicator to empty, if any comments exist, it will be populated
			resultObj[0].COMMENT_IND = "";
			
			//Create the display and determine the normalcy class
			for ( i = 0; i < resultCnt; i++) {
				normalcyClassObj = self.getNormalcy(resultObj[i].NORMALCY, i, hoverNormalcyClass);
				//Save the normalcy class for use in the hover creation
				resultObj[i].NORMALCY_CLASS = normalcyClassObj.NORMALCY;
				hoverNormalcyClass = normalcyClassObj.HOVERNORMALCY;
				if (!criticalResultInd) {
					criticalResultInd = normalcyClassObj.CRITICAL_IND;
				}
				
				//check if comments exist for each result
				if (resultObj[i].HAS_COMMENTS_IND) {
					resultObj[0].COMMENT_IND = "<span class='vitals-wf-comments-ind'></span>";
				}
			}
			//Pull the modified indicator
			resultObj[0].MODIFIED_IND = self.getModifyIndicator(resultObj[0].STATUS_MEAN);
			
			// compare the first results unit of measure with the current results uom
			if (resultObj[0].UOM === firstResUOM) {
				// if same, do nothing
			} else if (resultObj[0].UOM) {
				// if not same, put UOM after result before modified indicator
				diffUOM = " " + resultObj[0].UOM;
			} else {
				diffUOM = " --";
			}
			
			//Ensure the numerical results and dates are formatted for i18n and save it back to the object
			//formatting the results
			self.formatResult(resultObj[0]);
			resultDisplay = " " + ((resultCnt > 1) ? "<span class='fs-res-bracket'>[<span class='" + hoverNormalcyClass + "'>" + resultCnt + "</span>]</span>" : "" );
			//return the constructed content
			return '<span class="' + resultObj[0].NORMALCY_CLASS + '"><span class="res-ind">&nbsp;</span><span class="result-variable" data-id = "' + nameSpace + 'other">' + resultObj[0].RESULT + diffUOM + resultObj[0].COMMENT_IND + resultObj[0].MODIFIED_IND + '</span></span>' + resultDisplay;
		}
	}

	//Take and manipulate the recordData returned from the MP_RETRIEVE_VITALS_GROUP_DATA script and prepare it for use in the ComponentTable
	//Grab the time buckets and create the column displays for the ComponentTable
	timeBucketCnt = recordData.TG.length;
	var isTimeBucketsChopped = (this.m_showingLatestResults && timeBucketCnt > this.m_latestColumnCap);
	//When results are capped, only use how many time buckets that can be displayed in the screen
	if(isTimeBucketsChopped){
		timeBucketCnt = this.m_latestColumnCap;
	}

	//Track time buckets' sequence. Format: {"date/time 1":0, "date/time 2": 1}
	var timeBucketSeqMap = {};
	//Array of timeBuckets' formatted date/time
	var timeBucketSequence =[];
	
	var timeBucketDisplay = null;
	for ( x = 0; x < timeBucketCnt; x++) {
		timeBucket = recordData.TG[x];
		timeBucketDisplay = self.formatDate(timeBucket.TIME_DISP);
		timeBucket.TIME_ADJUSTED = timeBucketDisplay;
		//Put time buckets in array for easy display name access
		timeBucketSequence.push(timeBucketDisplay);
		//Create timeBucket->index map for easy time bucket access
		timeBucketSeqMap[timeBucketDisplay] = x;
		
		nextDate = new Date();
		//Format this time buckets time for display purposes when creating groups
		nextDate.setISO8601(timeBucket.TIME_DISP);

		if (x === 0) {
			timeBucket.NEW_DAY_CLASS = "fs-new-day";
			//Create the display with full date time display
			timeBucket.COLUMN_DISPLAY = "<span class='" + timeBucket.NEW_DAY_CLASS + "'>" + nextDate.format("mediumDate") + "<br />" + nextDate.format("militaryTime") + "</span>";
			if (nextDate.getDate() === todaysDate.getDate() && nextDate.getMonth() === todaysDate.getMonth() && nextDate.getFullYear() === todaysDate.getFullYear()) {
				timeBucket.COLUMN_DISPLAY = "<span class='" + timeBucket.NEW_DAY_CLASS + "'>" + vitalsI18N.TODAY + "<br />" + nextDate.format("militaryTime") + "</span>";
			}
			curDate = nextDate;
		} else {
			//Check to see if this is the first time for this Date
			timeBucket.NEW_DAY_CLASS = "";
			if (nextDate.getDate() === curDate.getDate() && nextDate.getMonth() === curDate.getMonth() && nextDate.getFullYear() === curDate.getFullYear()){
				//Create just the time display
				timeBucket.NEW_DAY_CLASS = "fs-time-display";
				timeBucket.COLUMN_DISPLAY = "<span class='" + timeBucket.NEW_DAY_CLASS + "'>&nbsp;<br />" + nextDate.format("militaryTime") + "</span>";
			} else {
				//Create the display with full date time display
				timeBucket.NEW_DAY_CLASS = "fs-new-day";
				timeBucket.COLUMN_DISPLAY = "<span class='" + timeBucket.NEW_DAY_CLASS + "'>" + nextDate.format("mediumDate") + "<br />" + nextDate.format("militaryTime") + "</span>";
				curDate = nextDate;
			}
		}
	}

	//when results are capped, it will need to check empty rows
	var hasDataInRow  = false;
	//when result cap is applied, it records the last column's (time bucket's) date
	var lastColumnDate = null;
	if(isTimeBucketsChopped){
		lastColumnDate = new Date();
		lastColumnDate.setISO8601(recordData.TG[this.m_latestColumnCap - 1].TIME_DISP);
	}

	var formattedTimeBucketRef= null;
	var measResult = [];
	var lastOccupiedTimeBucketRef = null;
	var aResultObject = null;
	var resultsShownInRow = 0;

	//Loop through each result group and  prepare the data
	for ( y = 0; y < resultGroupCnt; y++) {
		resultGroup = recordData.RG[y];

		//Internationalizing the group names depending upon the group_type
		switch(resultGroup.GROUP_TYPE) {
			case 1 :
				groupName = "<span title='" + vitalsI18N.TEMPERATURE + "'>" + vitalsI18N.TEMPERATURE + "</span>";
				break;
			case 2 :
				groupName = "<span title='" + vitalsI18N.BLOOD_PRESSURE + "'>" + vitalsI18N.BLOOD_PRESSURE + "</span>";
				break;
			case 3 :
				groupName = "<span title='" + vitalsI18N.HEART_RATE + "'>" + vitalsI18N.HEART_RATE + "</span>";
				break;
			case 4:
				groupName = "<span title='" + resultGroup.GROUP_NAME + "'>" + resultGroup.GROUP_NAME + "</span>";
				break;
			default:
			//do nothing
		}

		if (resultGroup.GROUP_TYPE == 2) {
			resultGroup = recordData.BP_RESULTS;
			measCnt = recordData.BP_RESULTS.length;
			resultGroup.GROUP_TYPE = 2;
			resultGroup.GROUP_NAME = vitalsI18N.BLOOD_PRESSURE;
		} else {
			//Check to see if this result group has any measurements.  If not remove it so we don't have to deal with it later
			measCnt = resultGroup.MEASUREMENTS.length;
		}

		hasDataInRow = false;

		//Create result object
		resultGroup.RESULT_OBJ = resultObjConstructor(recordData.TG, resultGroup.GROUP_TYPE);
		resultGroup.RESULT_GROUP_NAME = groupName;
		resultsShownInRow = 0;
		for ( z = 0; z < measCnt; z++) {
			//var normalcyRangeString = "";
			//var unitOfMeasureString = "";
			var firstResultUOM = "";
			if (resultGroup.GROUP_TYPE == 2) {
				meas = resultGroup[z];
				timeBucketRef = meas.DIA_EVENTS[0] ? meas.DIA_EVENTS[0].DTTM : meas.SYS_EVENTS[0].DTTM;
				//Some results are not exactly on the minute mark so we need to remove the seconds from the time string
				timeBucketRef = timeBucketRef.replace(/:[0-9][0-9]Z/, ":00Z");
				resultGroup.IS_BP_RESULT = true;
			} else if (resultGroup.MEASUREMENTS) {
				meas = resultGroup.MEASUREMENTS[z];
				//Push a reference to the actual measurements into the time bucket array so we can display all results in the hover
				//Some results are not exactly on the minute mark so we need to remove the seconds from the time string
				timeBucketRef = meas.DTTM.replace(/:[0-9][0-9]Z/, ":00Z");
				resultGroup.IS_BP_RESULT = false;
				resultGroup.IS_TEMP_RESULT = resultGroup.GROUP_TYPE == 1 ? true : false;
				if (resultGroup.IS_TEMP_RESULT) {
					resultGroup.TEMP_MIN_MAX = recordData.MIN_MAX_TEMP;
				}
			}
			
			//if not a BP result
			if (resultGroup.GROUP_TYPE !== 2) {
				// if first result and has measurements
				if (z === 0 && meas && !resultGroup.FIRST_RES_UOM) {
					firstResultUOM = meas.UOM;
					/*if (firstResultUOM) {
						unitOfMeasureString = " " + firstResultUOM;
					}*/
					resultGroup.FIRST_RES_UOM = firstResultUOM;
					
					//determine the normalcy range and put in returned html below
					/*if (meas.NLOW && meas.NHIGH) {
						//if both normalcy values are populated, create as follows (low-high)
						normalcyRangeString += "(" + meas.NLOW + "-" + meas.NHIGH + unitOfMeasureString + ")";
					} else if (meas.NHIGH) {
						//else if only high (<= 99.3)
						normalcyRangeString += "(<=" + meas.NHIGH + unitOfMeasureString + ")";
					} else if (meas.NLOW) {
						//else if only low (>= 93.2)
						normalcyRangeString += "(>=" + meas.NLOW + unitOfMeasureString + ")";
					} else if (firstResultUOM) {
						//else (no normalcy), show just unitOfMeasure, no space
						normalcyRangeString += "(" + firstResultUOM + ")";
					}*/
				}
			
			} else {
				//if a BP result
				if (z === 0 && meas && !resultGroup.FIRST_RES_UOM) {
					//If sys events, use sys UOM, if only dia events, use dia UOM, else leave as null
					if (meas.SYS_EVENTS.length && meas.SYS_EVENTS[0].UOM) {
						firstResultUOM = meas.SYS_EVENTS[0].UOM;
					} else if (meas.DIA_EVENTS.length && meas.DIA_EVENTS[0].UOM) {
						firstResultUOM = meas.DIA_EVENTS[0].UOM;
					}
					/*if (firstResultUOM) {
						unitOfMeasureString = " " + firstResultUOM;
					}*/
					resultGroup.FIRST_RES_UOM = firstResultUOM;
					//determine systolic normalcy range
					/*var sysRange = " --";
					if (meas.SYS_EVENTS.length) {
						if (meas.SYS_EVENTS[0].NLOW && meas.SYS_EVENTS[0].NHIGH) {
							sysRange = meas.SYS_EVENTS[0].NLOW + "-" +  meas.SYS_EVENTS[0].NHIGH;
						} else if (meas.SYS_EVENTS[0].NLOW) {
							sysRange = ">=" + meas.SYS_EVENTS[0].NLOW;
						} else if (meas.SYS_EVENTS[0].NHIGH) {
							sysRange = "<=" + meas.SYS_EVENTS[0].NHIGH;
						}
					}
					//determine diastolic normalcy range
					var diaRange = "-- ";
					if (meas.DIA_EVENTS.length) {
						if (meas.DIA_EVENTS[0].NLOW && meas.DIA_EVENTS[0].NHIGH) {
							diaRange = meas.DIA_EVENTS[0].NLOW + "-" +  meas.DIA_EVENTS[0].NHIGH;
						} else if (meas.DIA_EVENTS[0].NLOW) {
							diaRange = ">=" + meas.DIA_EVENTS[0].NLOW;
						} else if (meas.DIA_EVENTS[0].NHIGH) {
							diaRange = "<=" + meas.DIA_EVENTS[0].NHIGH;
						}
					}
					//build normalcy string
					if (sysRange === " --" && diaRange === "-- ") {
						if (firstResultUOM) {
							//if (no normalcy), show just unitOfMeasure, no space
							normalcyRangeString += "(" + firstResultUOM + ")";
						}
					} else if (meas.DIA_EVENTS.length || meas.SYS_EVENTS.length) {
						normalcyRangeString += "(" + sysRange + " / " + diaRange + unitOfMeasureString + ")";
					}*/
				}
			}
			
			//if have results from above then put in a span
			/*if (normalcyRangeString) {
				resultGroup.RESULT_GROUP_NAME += "<br /><span class='vitals-wf-result-info'>" + normalcyRangeString + "</span>";
			}*/	
			
			//if have results from above then put in a span
			if (firstResultUOM) {
				resultGroup.RESULT_UOM = "<span title='" + resultGroup.FIRST_RES_UOM + "' class='vitals-wf-result-info'>" + resultGroup.FIRST_RES_UOM + "</span>";
			}
			
			if(isTimeBucketsChopped){
				dateTime = new Date();
				dateTime.setISO8601(timeBucketRef);
				//the row will display data if the there're results on or before the last column's date
				if (dateTime >= lastColumnDate){
					hasDataInRow = true;
				}
			}

			formattedTimeBucketRef = self.formatDate(timeBucketRef);
			aResultObject = resultGroup.RESULT_OBJ[formattedTimeBucketRef];
			//Verify the timebucket object exists before attach results to it. With "Latest*" lookback, some results are ouside of the viewable column and so they shouldn't be added. 
			if(typeof aResultObject !== "undefined") {
				aResultObject.OBJECT_ARR.push(meas);
				aResultObject.DISPLAY = createResultDisplay(aResultObject.OBJECT_ARR, resultGroup.IS_BP_RESULT, resultGroup.FIRST_RES_UOM);
				aResultObject.TIME = formattedTimeBucketRef;
				resultsShownInRow++;
			}

			if(z=== measCnt-1){
				lastOccupiedTimeBucketRef = formattedTimeBucketRef;
			}
		}
		
		//add resultsShownInRow to resultGroup.RESULTS_SHOWN
		resultGroup.RESULTS_SHOWN = resultsShownInRow;

		if(this.m_showingLatestResults){
			//ignore the rows that don't contains results within the selected timeBuckets
			if(isTimeBucketsChopped && !hasDataInRow){
				continue;
			}
			//dither all cells after last occupied cell, and fill them with (...)
			if(measCnt >= this.m_flowsheetResultCap){
				var lastOccupiedIdx = timeBucketSeqMap[lastOccupiedTimeBucketRef];
				for(z=timeBucketCnt-1; z > lastOccupiedIdx; z--){
					var curTimeBucketRef = timeBucketSequence[z];
					resultGroup.RESULT_OBJ[curTimeBucketRef].DISPLAY = "<span class='vitals-wf-result-unknown'>&nbsp;</span>";
				}
			}
		}

		measResult.push(resultGroup);
	}

	columnObj = this.createResultGroupObj(measResult, criticalResultInd);

	return columnObj;
};

/**
 * Create the hover HTML for a group of results
 * @param {object} recordData- contains the JSON with all the results and associated information.
 */
VitalSignComponentWF.prototype.createResultHoverForFlowsheetView = function(dataObj) {
	var additionalClass = "";
	var hoverHTML = [];
	var vitalsI18N = i18n.discernabu.vitals_o2;
	var moreHoverHTML = [];
	var numberFormatter = MP_Util.GetNumericFormatter();
	var result = null;
	var resultCnt = 0;
	var x = 0;
	var tempHTML = [];
	var bpResult = "";

	//Grab the result information
	var group = dataObj.RESULT_DATA;
	var curTimeBucket = group.RESULT_OBJ[dataObj.COLUMN_ID];
	var timeBucketResults = curTimeBucket.OBJECT_ARR;
	resultCnt = timeBucketResults.length;

	//handle hovers for the dithered cells that are outside of the range of result cap in "Latest*" looback range. 
	if (resultCnt === 0) {
		//display information for the dithered cells
		if(curTimeBucket.DISPLAY.indexOf("vitals-wf-result-unknown") >= 0){
			return "<div class='hvr vitals-wf-hover'>" + i18n.discernabu.LIMITED_RESULTS + "</div>";
		}
		//don't display hovers for empty cells
		return null;
	}

	//Create the HTML for the hover
	hoverHTML.push("<div class='hvr vitals-wf-hover'>");

	if (resultCnt > 1) {
		//Create HTML if there are additional results.
		moreHoverHTML.push("<div class='vitals-wf-hover-additional'><div>" + vitalsI18N.ADDITIONAL_RESULTS + "</div><dl>");
		additionalClass = (resultCnt > 1) ? "vitals-wf-hover-seperator" : "";
	}

	//Looping through the results and creating html for hover with result information.
	for ( x = 0; x < resultCnt; x++) {
		result = timeBucketResults[x];

		//creating HTML for first result
		if (x === 0) {

			//Creating hover HTML for a BP result
			if (group.IS_BP_RESULT) {

				if (result.DIA_EVENTS.length) {
					result.DIA_UOM = result.DIA_EVENTS[0].UOM;
					result.DIA_NLOW = result.DIA_EVENTS[0].NLOW;
					result.DIA_NHIGH = result.DIA_EVENTS[0].NHIGH;
					result.DIA_CLOW = result.DIA_EVENTS[0].CLOW;
					result.DIA_CHIGH = result.DIA_EVENTS[0].CHIGH;
					result.DIA_STATUS = result.DIA_EVENTS[0].STATUS;
					result.DIA_MODIFIED_IND = this.getModifyIndicator(result.DIA_EVENTS[0].STATUS_MEAN);
					result.DTTM = result.DIA_EVENTS[0].DTTM;
				} else {
					result.DIA_UOM = "";
					result.DIA_NLOW = "--";
					result.DIA_NHIGH = "--";
					result.DIA_CLOW = "--";
					result.DIA_CHIGH = "--";
					result.DIA_STATUS = "";
					result.DIA_MODIFIED_IND = "";
				}

				if (result.SYS_EVENTS.length) {
					result.SYS_NLOW = (result.SYS_EVENTS[0].NLOW);
					result.SYS_NHIGH = (result.SYS_EVENTS[0].NHIGH);
					result.SYS_CLOW = (result.SYS_EVENTS[0].CLOW);
					result.SYS_CHIGH = (result.SYS_EVENTS[0].CHIGH);
					result.SYS_UOM = (result.SYS_EVENTS[0].UOM);
					result.SYS_STATUS = (result.SYS_EVENTS[0].STATUS);
					result.SYS_MODIFIED_IND = this.getModifyIndicator(result.SYS_EVENTS[0].STATUS_MEAN);
					result.DTTM = result.SYS_EVENTS[0].DTTM;
				} else {
					result.SYS_NLOW = "--";
					result.SYS_NHIGH = "--";
					result.SYS_CLOW = "--";
					result.SYS_CHIGH = "--";
					result.SYS_UOM = "";
					result.SYS_STATUS = "";
					result.SYS_MODIFIED_IND = "";
				}

				bpResult = "<dd><span class='" + result.SYS_NORMALCY_CLASS + "'>" + result.SYS_RESULT + " " + result.SYS_UOM + "</span>" + result.SYS_MODIFIED_IND;
				bpResult += "/" + "<span class='" + result.DIA_NORMALCY_CLASS + "'>" + result.DIA_RESULT + " " + result.DIA_UOM + "</span>" + result.DIA_MODIFIED_IND + "</dd>";
				//Grab all of the information for the face up result
				hoverHTML.push("<div class='vitals-wf-hover-main ", additionalClass, "'><dl><dt><span>", result.BP_GROUP_NAME, ":</span></dt>" + bpResult + "<dt><span>", vitalsI18N.DATE_TIME, ":</span></dt><dd><span>", this.formatDate(result.DTTM), "</span></dd><dt><span>", vitalsI18N.STATUS, ":</span></dt><dd><span>", result.SYS_STATUS || "--", "/", result.DIA_STATUS || "--", "</span></dd><dt><span>", vitalsI18N.NORMAL_LOW, ":</span></dt><dd><span>", result.SYS_NLOW || "--", "/", result.DIA_NLOW || "--", "</span></dd><dt><span>", vitalsI18N.NORMAL_HIGH, ":</span></dt><dd><span>", result.SYS_NHIGH || "--", "/", result.DIA_NHIGH || "--", "</span></dd><dt><span>", vitalsI18N.CRITICAL_LOW, ":</span></dt><dd><span>", result.SYS_CLOW || "--", "/", result.DIA_CLOW || "--", "</span></dd><dt><span>", vitalsI18N.CRITICAL_HIGH, ":</span></dt><dd><span>", result.SYS_CHIGH || "--", "/", result.DIA_CHIGH || "--", "</span></dd></dl></div>");

			} else {
				//Creating a MinMax Temperature data for temperature results
				if (group.IS_TEMP_RESULT && group.TEMP_MIN_MAX) {

					var minMaxData = group.TEMP_MIN_MAX;
					var tempMin = (this.getNormalcy(minMaxData.MIN_NORMALCY)).NORMALCY;
					var tempMax = (this.getNormalcy(minMaxData.MAX_NORMALCY)).NORMALCY;
					var minDate = minMaxData.MIN_DTTM ? this.formatDate(minMaxData.MIN_DTTM) : "";
					var maxDate = minMaxData.MAX_DTTM ? this.formatDate(minMaxData.MAX_DTTM) : "";
					var min_value = minMaxData.MIN_VALUE ? (mp_formatter._isNumber(minMaxData.MIN_VALUE) ? numberFormatter.format(minMaxData.MIN_VALUE,"^."+MP_Util.CalculatePrecision(minMaxData.MIN_VALUE)) : minMaxData.MIN_VALUE) : "--";
					var max_value = minMaxData.MAX_VALUE ? (mp_formatter._isNumber(minMaxData.MAX_VALUE) ? numberFormatter.format(minMaxData.MAX_VALUE,"^."+MP_Util.CalculatePrecision(minMaxData.MAX_VALUE)) : minMaxData.MAX_VALUE) : "--";
					// creating the min max temperature markup to append to the hover
					tempHTML.push("<dt><span>", vitalsI18N.ONE_DAY_MAX, ":</span></dt><dd><span class='", tempMax, "'>", max_value, '&nbsp;', minMaxData.MAX_UOM, this.getModifyIndicator(minMaxData.MAX_STATUS_MEAN), '</span>&nbsp;', maxDate, "</dd>", "<dt><span>", vitalsI18N.ONE_DAY_MIN, ":</span></dt><dd><span class='", tempMin, "'>", min_value, '&nbsp;', minMaxData.MIN_UOM, this.getModifyIndicator(minMaxData.MIN_STATUS_MEAN), '</span>&nbsp;', minDate, "</dd>");

				}
				//Grab all of the information for the face up result
				hoverHTML.push("<div class='vitals-wf-hover-main ", additionalClass, "'><dl><dt><span>", result.RESULT_NAME, ":</span></dt><dd><span class='", result.NORMALCY_CLASS, "'>", result.RESULT, " ", result.UOM, "</span>", result.MODIFIED_IND, "</dd><dt><span>", vitalsI18N.DATE_TIME, ":</span></dt><dd><span>", this.formatDate(result.DTTM), "</span></dd><dt><span>", vitalsI18N.STATUS, ":</span></dt><dd><span>", result.STATUS || "--", "</span></dd><dt><span>", vitalsI18N.NORMAL_LOW, ":</span></dt><dd><span>", result.NLOW || "--", "</span></dd><dt><span>", vitalsI18N.NORMAL_HIGH, ":</span></dt><dd><span>", result.NHIGH || "--", "</span></dd><dt><span>", vitalsI18N.CRITICAL_LOW, ":</span></dt><dd><span>", result.CLOW || "--", "</span></dd><dt><span>", vitalsI18N.CRITICAL_HIGH, ":</span></dt><dd><span>", result.CHIGH || "--", "</span></dd>", tempHTML.join(""), "</dl></div>");
			}
		}

		//creating HTML for additional results.
		else {
			//Creating hover HTML for a additional BP results
			if (group.IS_BP_RESULT) {

				if (result.DIA_EVENTS.length) {
					result.DIA_UOM = result.DIA_EVENTS[0].UOM;
					this.formatResult(result.DIA_EVENTS[0]);
					result.DIA_RESULT = result.DIA_EVENTS[0].RESULT;
					result.DIA_MODIFIED_IND = this.getModifyIndicator(result.DIA_EVENTS[0].STATUS_MEAN);
				} else {
					result.DIA_UOM = "";
					result.DIA_RESULT = "--";
					result.DIA_MODIFIED_IND = "";

				}
				if (result.SYS_EVENTS.length) {
					result.SYS_UOM = result.SYS_EVENTS[0].UOM;
					this.formatResult(result.SYS_EVENTS[0]);
					result.SYS_RESULT = result.SYS_EVENTS[0].RESULT;
					result.SYS_MODIFIED_IND = this.getModifyIndicator(result.SYS_EVENTS[0].STATUS_MEAN);
				} else {
					result.SYS_UOM = "";
					result.SYS_RESULT = "--";
					result.SYS_MODIFIED_IND = "";

				}

				bpResult = "<span class='" + result.SYS_NORMALCY_CLASS + "'>" + result.SYS_RESULT + " " + result.SYS_UOM + "</span>" + result.SYS_MODIFIED_IND + "/" + "<span class='" + result.DIA_NORMALCY_CLASS + "'>" + result.DIA_RESULT + " " + result.DIA_UOM + "</span>" + result.DIA_MODIFIED_IND;
				moreHoverHTML.push("<dd>", bpResult, "</dd>");

			} else {

				//Ensure the numerical results and dates are formatted for i18n and save it back to the object
				this.formatResult(result);
				modifiedDisplay = this.getModifyIndicator(result.STATUS_MEAN);
				//Grab only some information from the hidden results
				moreHoverHTML.push("<dd><span class='", result.NORMALCY_CLASS, "'><span class='res-ind'>&nbsp;</span>", result.RESULT, " ", result.UOM, "</span>", modifiedDisplay, "</dd>");

			}
		}
	}
	//If a timebucket has more than one result including those results in the hover.
	if (resultCnt > 1) {
		moreHoverHTML.push("</dl></div>");
		hoverHTML.push(moreHoverHTML.join(""));
	}
	hoverHTML.push("</div>");

	return hoverHTML.join("");
};

/**
 *Displays a tooltip when hovering over the toggle buttons
 * 
 */
 
VitalSignComponentWF.prototype.toggleButtonHover = function() {
 	this.onmouseover = function(event) {
 		var objectClass = $(event.target).attr('class');

 		if (objectClass == "hdr-toggle table_active" || objectClass == "hdr-toggle table_inactive") {
 			$(event.target).attr('title', i18n.discernabu.vitals_o2.FLOWSHEET_VIEW);
 		}
 		else if (objectClass == "hdr-toggle viewer_active" || objectClass == "hdr-toggle viewer_inactive") {
 			$(event.target).attr('title', i18n.discernabu.vitals_o2.AMBULATORY_VIEW);
 		}
	 };
 };


/**
 *This method is used to render the results for the vitals component for both flowsheet and ambulatory view.
 * @param {object} recordData- contains the JSON with all the results and associated information.
 */
VitalSignComponentWF.prototype.renderComponent = function(recordData) {
	var vitalsTable = null;
	var results = null;
	var column = "";
	var criterion = this.getCriterion();
	var nameSpace = this.getStyles().getId();
	var compId = this.getComponentId();
	var self = this;
	var columnCntForFlowsheetView = recordData.TG.length;
	var j = 0;
	var hoverExtension = new TableCellHoverExtension();
	var vitalsCombinedHTML = "";
	var viewTypeTimer = null;
	
	// Add main container holding both component table and side panel
	vitalsCombinedHTML+= ("<div id ='WF_VS" + compId+ "mainContainer'>");
	
	if (this.getShowAmbulatoryView()) {
		var columnClass = "";
		var columnName = "";

		//Get the component table (the first time this is called, it is created)
		vitalsTable = new ComponentTable();
		vitalsTable.addExtension(hoverExtension);

		//setting the tags for component table to use tables instead of dl's
		hoverExtension.setTarget("td.table-cell");
		vitalsTable.setNamespace(this.getStyles().getId());
		vitalsTable.setBodyTag("table");
		vitalsTable.setRowTag("tr");
		vitalsTable.setColumnTag("td");
		vitalsTable.setCustomClass("vitals-wf-amb");	
		
		/**
		 * Overwriting the existing renderHeader method of component table in order to accomplish customized header.
		 * Also this would facilitate shifting of the headers appropriately when the scrolling is applied.
		 **/
		vitalsTable.renderHeader = function() {
			var gSequence = vitalsTable.getGroupSequence();
			var numberOfGroups = gSequence.length;
			if (vitalsTable.getActiveRows().length > 0 || numberOfGroups > 0) {
				var headerWrapper = "<div id='" + nameSpace + "outerHeaderWrapper" + "' class='content-hdr'>";
				//While using tables in the component table instead of lists,headers cannot be shifted when scrolling is applied if the header is just a table.
				//hence changing the markup to include the table inside a div.
				var startInnerBodyTag = vitalsTable.getBodyTag() ? "<" + vitalsTable.getBodyTag() + ">" : "";
				var endInnerBodyTag = vitalsTable.getBodyTag() ? "</" + vitalsTable.getBodyTag() + ">" : "";
				var headerHTML = startInnerBodyTag + "<" + vitalsTable.getRowTag() + " id='" + nameSpace + "header" + "' class='" + (vitalsTable.sortable ? "sort-control" : "") + " hdr'>";
				var columnSequence = vitalsTable.getColumnSequence();
				var numberColumns = columnSequence.length;
				var headerItemClass = "";
				var column = null;
				var style = "";
				for ( j = 0; j < numberColumns; j++) {
					headerItemClass = "header-item";
					column = vitalsTable.getColumnMap()[columnSequence[j]];
					style = column.getWidth() ? " style='width:" + column.getWidth() + "px;'" : "";
					headerItemClass += (column.getCustomClass() ? (" " + column.getCustomClass()) : "");
					headerItemClass += (column.getIsSortable() ? " sort-option" : "");
					if (column.getColumnSortDirection() !== TableColumn.SORT.NONE) {
						headerItemClass += (" " + vitalsTable.getSortClass(column.getColumnSortDirection()));
					}
					headerHTML += ("<" + vitalsTable.getColumnTag() + " id='" + nameSpace + "columnHeader" + column.getColumnId() + "' class='" + headerItemClass + "'" + style + ">" + "<span id='" + nameSpace + "headerItemDisplay" + column.getColumnId() + "' class='header-item-display'>" + column.getColumnDisplay() + "</span>" + "</" + vitalsTable.getColumnTag() + ">");
				}
				return headerWrapper + "<div id='" + nameSpace + "innerHeaderWrapper" + "' class='hdr'>" + headerHTML + "</" + vitalsTable.getRowTag() + ">" + endInnerBodyTag + "</div></div>";
			} else {
				return "";
			}
		};

		/**
		 * Overwriting the existing function of component table to update after a resize event. It checks to see if scrolling is applied, and if so
		 * it shifts the header over to compensate for the scrollbar in the table body.
		 */
		vitalsTable.updateAfterResize = function() {
			var tableBody = $("#" + vitalsTable.namespace + "tableBody");
			if (!tableBody || !tableBody.length) {
				return;
			}

			//Scrolling is applied
			if (tableBody[0].scrollHeight > tableBody.outerHeight()) {

				$("#" + vitalsTable.namespace + "innerHeaderWrapper").addClass("shifted");

			} else {

				$("#" + vitalsTable.namespace + "innerHeaderWrapper").removeClass("shifted");

			}
		};

		//Get result information
		results = recordData.RG;
		numberResults = results.length;
		//Processing the results for displaying data in the ambulatory view.
		results = this.processResultsForAmbulatoryView(recordData);

		//Adding the first column to display group names.
		vitalsTable.addColumn(new TableColumn().setCustomClass('vitals-wf-amb-name').setColumnId('GroupName').setRenderTemplate('<span>${RESULT_GROUP_NAME}</span>'));

		//Adding other result columns
		for ( j = 0; j < this.m_ambViewColumnCnt; j++) {
			//Logic to apply respective classes to individual columns
			columnClass = j ? 'vitals-wf-amb-result-clmn' : 'vitals-wf-amb-result-clmn vitals-wf-amb-frst-clmn';
			columnName = "";
			var midColumnIndex = Math.floor(this.m_ambViewColumnCnt / 2);
			if (j === 0) {
				if (self.getShowTodayValue()) {
					columnName = "<span>" + i18n.discernabu.vitals_o2.TODAY + "</span>";
				} else {
					columnName = "<span>" + i18n.discernabu.vitals_o2.LATEST + "</span>";
				}
			}
			//As this is a customized header, we want the previous column to be centered.Hence calculating half of the number of columns approximately
			//Also add it to the column right before the center to that one can be shown when the panel is shown and columns are removed
			else if (j == (midColumnIndex - 1) || j == midColumnIndex) {
				columnClass = "vitals-wf-amb-prv-clmn vitals-wf-amb-col-" + (j + 2);
				columnName = "<span>" + i18n.discernabu.vitals_o2.PREVIOUS + "</span>";
			}

			//creating new table column
			column = new TableColumn().setColumnDisplay(columnName).setColumnId("column" + j).setCustomClass(columnClass).setRenderTemplate("${RESULT_OBJ['column" + j + "'].DISPLAY}");
			vitalsTable.addColumn(column);

			//adding hovers for individual cells
			hoverExtension.addHoverForColumn(column, function(dataObj) {
				return self.createResultHoverForFlowsheetView(dataObj);
			});
		}

		//Adding result click functionality.
		vitalsTable.addExtension(new TableCellClickCallbackExtension().setCellClickCallback(function(event, data) {
			data.NAMESPACE = nameSpace;
			
			// If the selected cell is a group name then that cell has a attribute COLUMN_ID as "GroupName"
			if(data.COLUMN_ID === "GroupName" && self.SIDE_PANEL_AVAILABLE){
				// Show the event set name, result and date/time in the side panel if group name is selected 
				self.groupNameCellClickHandler(event, data);
			}
			else{
				// Launch the result viewer when anywhere within the result cell is clicked
				self.resultTableCellClickHandler(event, data, "Ambulatory View");
			}
		}));

		//Bind the data to the results
		vitalsTable.bindData(results.RESULTS);

		//Store off the component table
		this.setComponentTable(vitalsTable);
		
		// Render the vitals table
		vitalsCombinedHTML += vitalsTable.render();
		
		// Add a place holder for right side panel only if browser version supports Canvas
		if(this.SIDE_PANEL_AVAILABLE){
			vitalsCombinedHTML+= "<div id ='WF_VS" + compId+ "sidePanelContainer' class='vitals-wf-side-panel'>&nbsp;</div>";
		}
		
		//Finalize the component
		this.finalizeComponent(vitalsCombinedHTML);
		this.m_ambTableContainer = $("#WF_VS" + compId + "table");
		
		// Add the side panel. Have to include this after finalize due to DOM elements not existing until finalize
		if(this.SIDE_PANEL_AVAILABLE){	
			// Initialize the side panel
			this.initializeSidePanel();
		}
		
		//Trigger the CAP timer for ambulatory view
		viewTypeTimer = new CapabilityTimer("CAP:MPG Vitals O2 View Type", this.criterion.category_mean);
		viewTypeTimer.addMetaData("rtms.legacy.metadata.1", "Ambulatory View");
		viewTypeTimer.capture();
		
		//Displaying the critical indicator in the navigator if there are any critical results
		if (results.CRITICAL_IND) {
			CERN_EventListener.fireEvent(this, this, EventListener.EVENT_CRITICAL_UPDATE, {
				"critical" : true
			});
		}
	} else {
		//Creating a flowSheetTable instance
		vitalsTable = new FlowsheetTable();
		//pass a 2 to add hover extension only to result table
		vitalsTable.addExtension(hoverExtension, 2);
		vitalsTable.setNamespace(nameSpace);
		//Processing the results in order to display appropriately.
		results = this.processResultsForFlowsheetView(recordData);

		//this will add label and result columns to the vitals table
		vitalsTable.addLabelColumn(new TableColumn().setColumnDisplay("&nbsp;<br />&nbsp;").setColumnId("GroupName").setCustomClass("vitals-wf-label-name").setRenderTemplate('<span>${RESULT_GROUP_NAME}</span>'));
		vitalsTable.addLabelColumn(new TableColumn().setColumnDisplay("&nbsp;<br />&nbsp;").setColumnId("UOM").setCustomClass("vitals-wf-label-uom").setRenderTemplate('<span>${RESULT_UOM}</span>'));

		if(this.m_showingLatestResults){
			//get the width and calculate the columns that can fit in the viewable area
			if(columnCntForFlowsheetView > this.m_latestColumnCap){
				columnCntForFlowsheetView = this.m_latestColumnCap;
			}
			vitalsTable.setDisclaimer(this.createDisclaimerMessage());
		}else{
			vitalsTable.setDisclaimer(null);
		}

		//Looping through the results and creating the columns
		for ( j = 0; j < columnCntForFlowsheetView; j++) {
			column = new TableColumn().setColumnId(recordData.TG[j].TIME_ADJUSTED).setColumnDisplay(recordData.TG[j].COLUMN_DISPLAY).setCustomClass(recordData.TG[j].NEW_DAY_CLASS).setRenderTemplate("${RESULT_OBJ['" + recordData.TG[j].TIME_ADJUSTED + "'].DISPLAY}");
			vitalsTable.addResultColumn(column);
			hoverExtension.addHoverForColumn(column, function(dataObj) {
				return self.createResultHoverForFlowsheetView(dataObj);
			});
		}
		
		//add result name click to label table (1) to launch/change side panel
		vitalsTable.addExtension(new TableCellClickCallbackExtension().setCellClickCallback(function(event, data) {
			data.NAMESPACE = nameSpace;
			
			// If the selected cell is a group name then that cell has a attribute COLUMN_ID as "GroupName"
			if((data.COLUMN_ID === "GroupName" || data.COLUMN_ID === "UOM") && self.SIDE_PANEL_AVAILABLE){
				// Show the event set name, result and date/time in the side panel if group name is selected 
				self.groupNameCellClickHandler(event, data);
			}
			
		}), 1);
		
		//add result cell click to result table (2) to launch result viewer
		vitalsTable.addExtension(new TableCellClickCallbackExtension().setCellClickCallback(function(event, data) {
			data.NAMESPACE = nameSpace;
			self.resultTableCellClickHandler(event, data, "Flowsheet View");			
		}), 2);
		
		//Binding the results and labels data for display
		vitalsTable.bindData(results.RESULTS);

		//Store off the component table
		this.setFlowsheetTable(vitalsTable);
		this.m_flowsheetTableObject = vitalsTable;
		
		// Render the vitals table
		vitalsCombinedHTML += vitalsTable.render();
		
		// Add a place holder for right side panel only if browser version supports Canvas
		if(this.SIDE_PANEL_AVAILABLE){
			vitalsCombinedHTML+= "<div id ='WF_VS" + compId+ "sidePanelContainer' class='vitals-wf-side-panel'>&nbsp;</div>";
		}
		
		//Finalize the component
		this.finalizeComponent(vitalsCombinedHTML);
		this.m_flowsheetTableContainer = $("#WF_VS" + compId + "flowsheetContainer");

		//Dither the cells that contains date/time outside of the result cap, because whether they have results is unknown
		$("#"+nameSpace).find(".vitals-wf-result-unknown").parent().addClass("vitals-wf-unknown-parent");
		
		// Add the side panel. Have to include this after finalize due to DOM elements not existing until finalize
		if(this.SIDE_PANEL_AVAILABLE){	
			// Initialize the side panel
			this.initializeSidePanel();
		}

		//Trigger the CAP timer for flowsheet view
		viewTypeTimer = new CapabilityTimer("CAP:MPG Vitals O2 View Type", this.criterion.category_mean);
		viewTypeTimer.addMetaData("rtms.legacy.metadata.1", "Flowsheet View");
		viewTypeTimer.capture();

		if (results.CRITICAL_IND) {
			CERN_EventListener.fireEvent(this, this, EventListener.EVENT_CRITICAL_UPDATE, {
				"critical" : true
			});
		}
	}
	//Calls function to show tooltip when hovering over toggle buttons
	this.toggleButtonHover.call();
};

/**
 * This method will be called only one time, after finalizing the component. 
 * This method will initialize the side panel by adding the place holders for the group name and table holding the results of selected row.
 */
VitalSignComponentWF.prototype.initializeSidePanel = function() {
	var self = this;
	var compID = this.getComponentId();
	var sidePanelContId = "WF_VS" + compID + "sidePanelContainer";
	this.m_sidePanelContainer = $("#" + sidePanelContId);
	var isAmbView = this.getShowAmbulatoryView();
	var tableHeight = null;
	
	//get current height of table
	if (isAmbView) {
		tableHeight = this.m_ambTableContainer.css("height");
	} else {
		tableHeight = $("#WF_VS" + compID + "resultsTabletable").css("height");
	}

	// Add place holders for group name and result table
	var sidePanelHTML = "<div id='WF_VS"+compID+"sidePanelResultsContainer'><div id='WF_VS"+compID+
		"sidePanelGroupName' class='vitals-wf-side-panel-groupname'>&nbsp;</div><div id='sidePanelScrollContainer" + compID + 
		"'><div class='vitals-wf-section-separator'><div class='vitals-wf-title-text'>"+
		i18n.discernabu.vitals_o2.RESULTS+"</div><div class='sp-separator'>&nbsp;</div></div><div id='WF_VS"+ compID +
		"sidePanelResultList' class='vitals-wf-side-panel-result-list'>&nbsp;</div></div></div>";
	
	//Create the side panel
	if (this.m_sidePanelContainer.length) {
	
		// Render the side panel
		this.sidePanel = new CompSidePanel(compID, sidePanelContId);
		this.sidePanel.setExpandOption(this.sidePanel.expandOption.EXPAND_DOWN);
		this.sidePanel.setHeight(tableHeight);
		this.sidePanel.setMinHeight(this.m_sidePanelMinHeight);
		this.sidePanel.renderSidePanel();
		this.sidePanel.setContents(sidePanelHTML, "WF_VSContent" + compID);
		this.sidePanel.showCloseButton();
		
		// set the function that will be called when the close button on the side panel is clicked
		this.sidePanel.setCloseFunction(function() {
			//self.m_sidePanelContainer.css("width", 0);
			if (isAmbView) {
				self.m_ambTableContainer.removeClass("vitals-wf-side-panel-addition");
			} else {
				self.m_flowsheetTableObject.setSidePanelWidth(0);
				self.m_flowsheetTableContainer.removeClass("vitals-wf-side-panel-addition");
				self.m_flowsheetTableObject.updateAfterResize();
			}
			self.highlightSelectedRow(false);
			self.m_showPanel = false;
			self.m_clickedLabel = "";
			self.m_sidePanelContainer.hide();
		});
		
		// set the function that will be called when the panel is collapsed after being expanded
		this.sidePanel.setOnCollapseFunction(function () {
			self.m_sidePanelContainer.css({
				position : "absolute"
			});
		});
	}
	
};

/**
 * This function calls the parent MPageCompoent resize function and 
 * then also calls the sidePanel.resizePanel function.
 */
VitalSignComponentWF.prototype.resizeComponent = function() {
	
	if (!this.getShowAmbulatoryView() && this.m_showPanel) {
		//add 11 to the actual panels width to allow the vertical scroll bar to appear when necessary
		this.m_flowsheetTableObject.setSidePanelWidth(this.m_sidePanelContainer.outerWidth() + 11);
	}
	
	//Call the base class functionality to resize the component
	MPageComponent.prototype.resizeComponent.call(this, null);
	
	if (this.SIDE_PANEL_AVAILABLE && this.sidePanel) {
		var tableHeight = null;
		
		if (this.getShowAmbulatoryView()) {
			//get the latest height of table
			tableHeight = $("#WF_VS" + this.getComponentId() + "table").css("height");
		} else {
			tableHeight = $("#WF_VS" + this.getComponentId() + "resultsTabletable").css("height");
		}
		
		this.sidePanel.setHeight(tableHeight);
		
		//call the side panels resize function
		this.sidePanel.resizePanel();
		
		//Replot the graph
		var vitalsPlot = this.getVitalsPlot();
		if(vitalsPlot) {
			vitalsPlot.replot();			
		}
	}
	
};

/**
 * This method will be called on each row selection to update the background
 * color of selected row and font color to indicate that this is the
 * currently selected row
 * @param {element} selRowObj - the current row element that was selected
 */
VitalSignComponentWF.prototype.highlightSelectedRow = function(selRowObj) {
	var compID = this.getComponentId();
	var isAmbView = this.getShowAmbulatoryView();
	var tableViewObj = null;
	
	if (isAmbView) {
		tableViewObj = $("#WF_VS" + compID + "table");
	} else {
		tableViewObj = this.m_flowsheetTableContainer;
	}
	
	//find any previously select row
	var prevRow = tableViewObj.find(".selected");

	// Remove the background color of previous selected row. 
	if (prevRow.length) {
		if(prevRow.hasClass("vitals-wf-selected-row selected")){
			prevRow.removeClass("vitals-wf-selected-row selected");
		}
	}
		
	if (selRowObj) {
		// Remove the tooltip hover since this class gets added when you hover over group name
		selRowObj.find('.mpage-tooltip-hover').removeClass('mpage-tooltip-hover'); 
		
		// Change the background color to indicate that the row is selected. If its an initial load then the first row has a different styling
		selRowObj.addClass("vitals-wf-selected-row selected");
	}
	
	if (!isAmbView) {
		if (selRowObj) {
			var currentRowLabelSelectedId = selRowObj[0].id;
			
			// Fix up the element ids, remove the :'s and set them up with escape chars
			var labelParts = currentRowLabelSelectedId.split(":");
			currentRowLabelSelectedId = "";
			for ( var i = 0; i < labelParts.length; i++) {
				currentRowLabelSelectedId += labelParts[i];
				// If not the last part, add an escaped colon
				if ((i + 1) !== labelParts.length) {
					currentRowLabelSelectedId += "\\:";
				}
			}
			
			var currentRowResultsSelectedId = currentRowLabelSelectedId.replace("label", "results");
			var currentRowResultsSelectObj = $("#" + currentRowResultsSelectedId);
			
			if (currentRowResultsSelectObj.length) {
				currentRowResultsSelectObj.find('.mpage-tooltip-hover').removeClass('mpage-tooltip-hover');
				currentRowResultsSelectObj.addClass("vitals-wf-selected-row selected");
			}
			
		}
	}
};

/**
 * Map the vitals O2 object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "WF_VS" filter
 */
MP_Util.setObjectDefinitionMapping("WF_VS", VitalSignComponentWF);
