function PartogramLaborComponentWFStyle() {
	this.initByNamespace("parto-labor-wf");
}

PartogramLaborComponentWFStyle.prototype = new ComponentStyle();
PartogramLaborComponentWFStyle.prototype.constructor = ComponentStyle;
/**
 * The Partogram Labor component will provides clinical information about the labor curve of the patient.
 * 
 * @param criterion
 *            {Criterion} - The Criterion object which contains information needed to render the component.
 */
function PartogramLaborComponentWF(criterion) {
	this.dataArr = [];
	this.plot = null;
	this.dataRange = null;
	this.imageFolderPath = null;
	this.fetalHeadEngagementMode = null;
	this.alertActionLinesVisible = null;
	this.alertActionLinesRate = null;
	this.dilationUnit = null;
	this.setCriterion(criterion);
	this.setStyles(new PartogramLaborComponentWFStyle());
	this.setComponentLoadTimerName("USR:MPG.PARTOGRAMLABOR.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.PARTOGRAMLABOR.O2 - render component");
	this.setImageFolderPath(this.getCriterion().static_content + "/images/");
	this.setRefreshEnabled(false);
	this.fetalPositionDataArray = [];
	this.fetalPosMisconfigured = false;
	//nomen mapping is a map of nomenID and the corresponding fetal position image class and image object
	this.NOMEN_MAPPING = {};
	this.groupNameMap = {};
	// Flag for resource required
	this.setResourceRequired(true);
	//an array of HTMLImageElements
	this.fetalPositionImageArray = [];
	this.loadTimer = null;
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object.
 */
PartogramLaborComponentWF.prototype = new MPageComponent();
PartogramLaborComponentWF.prototype.constructor = MPageComponent;
PartogramLaborComponentWF.prototype.HOVER_KEY = 'LABOR';
//determines whether the graph's background is colored or not. default is false.
PartogramLaborComponentWF.prototype.graphBackgroundColored = false;
/**
 * Map the Partogram option 2 object to the bedrock filter mapping so the architecture will know what object to create when it sees the
 * "WF_PARTO_LABOR" filter.
 */
MP_Util.setObjectDefinitionMapping("WF_PARTO_LABOR", PartogramLaborComponentWF);

/**
 * @method Returns the reference to the json data returned from the back-end to be plotted on the graph.
 * @param {null}
 * @return {array} A reference to the json data returned from the back-end .
 */
PartogramLaborComponentWF.prototype.getDataArr = function() {
	return this.dataArr;
};

/**
 * @method Returns the reference to the json data returned from the back-end to be plotted on the graph.
 * @param {array}
 *            data - A reference to the json data returned from the back-end .
 * @return {null}
 */
PartogramLaborComponentWF.prototype.setDataArr = function(data) {
	this.dataArr = data;
};
/**
 * @method Returns the path where images are stored in the static content folder
 * @return the relative path
 */

PartogramLaborComponentWF.prototype.getImageFolderPath = function() {
	return this.imageFolderPath;
};
/**
 * @method Stores the path to where images are stored in the static content folder.
 */
PartogramLaborComponentWF.prototype.setImageFolderPath = function(path) {
	this.imageFolderPath = path;
};

/**
 * @method Store a reference to the jqplot object
 * @param {object}
 *            plot - A reference to the jqplot object
 * @return the range of
 */
PartogramLaborComponentWF.prototype.setPlot = function(plot) {
	this.plot = plot;
};

/**
 * @method gets the reference to the jqplot object
 * @return the reference to the JqPlot graph
 */
PartogramLaborComponentWF.prototype.getPlot = function() {
	return this.plot;
};

/**
 * @method gets the reference to the graph element
 * @return the reference to graph element
 */
PartogramLaborComponentWF.prototype.getGraphElement = function() {
	return this.graphElement;
};

/**
 * @method Store a reference to the graph element
 * @param {HTML
 *            Element} el - A reference to the graph element
 */
PartogramLaborComponentWF.prototype.setGraphElement = function(el) {
	this.graphElement = el;
};

/**
 * @method Retrieves the method used in measurement of fetal head engagement
 * @param {null}
 * @return the mode
 */
PartogramLaborComponentWF.prototype.getFetalHeadEngagementMode = function() {
	return this.fetalHeadEngagementMode;
};

/**
 * @method Stores the method used in measurement of fetal head engagement.
 * stores a reference to this in Parto_graph_base
 * @param -
 *            boolean - if true, method used is fifths palpable otherwise it is fetalstation.
 * @return {null}
 */
PartogramLaborComponentWF.prototype.setFetalHeadEngagementMode = function(isFifthsPalpableEnabled) {
	this.fetalHeadEngagementMode = isFifthsPalpableEnabled ? "FIFTHS_PALPABLE" : "FETAL_STATION";
	PARTO_GRAPH_BASE.setFetalHeadEngagementMode(this.fetalHeadEngagementMode);
};

/**
 * @method Retrieves the rate at which the alert/action lines should be
 * @param {null}
 * @return the mode
 */
PartogramLaborComponentWF.prototype.getAlertActionLinesRate = function() {
	return this.alertActionLinesRate;
};

/**
 * @method Stores the rate of alert/action lines for primup patients
 * @param -
 *            boolean - if true, rate is 0.5 else 1.
 * @return {null}
 */
PartogramLaborComponentWF.prototype.setAlertActionLinesRate = function(alertActionLinesRate) {
	this.alertActionLinesRate = alertActionLinesRate ? 0.5 : 1;
};

/**
 * @method Returns whether alert/action lines are visible
 * @param {null}
 * @return boolean
 */
PartogramLaborComponentWF.prototype.getAlertActionLinesVisible = function() {
	return this.alertActionLinesVisible;
};

/**
 * @method Stores the visibility for alert/action lines
 * @param -
 *            boolean - if true, set alert/action lines visible
 * @return {null}
 */
PartogramLaborComponentWF.prototype.setAlertActionLinesVisible = function(isAlertActionLinesVisible) {
	this.alertActionLinesVisible = isAlertActionLinesVisible;
};

/**
 * @method Retrieves the range of data to be displayed
 * @param {null}
 * @return dateRange
 */
PartogramLaborComponentWF.prototype.getDataRangeForGraph = function() {
	return this.dataRange;
};

/**
 * @method Stores the range of data to be displayed
 * @param -
 *            the dataRange value
 * @return {null}
 */
PartogramLaborComponentWF.prototype.setDataRangeForGraph = function(dataRange) {
	this.dataRange = dataRange;
};

/**
 * @method Sets the Occiput Anterior nomenclature mapping
 */
PartogramLaborComponentWF.prototype.setOANomen = function(value) {
	if (value.length > 1 || this.NOMEN_MAPPING[value[0]]) {
		this.fetalPosMisconfigured = true;
	} else {
		var fetalPosImage = new Image();
		fetalPosImage.src = this.getImageFolderPath() + "partoLaborFetalPos-S.png";
		this.NOMEN_MAPPING[value[0]] = ['partoLaborSprite partoLaborFetalPos-S', fetalPosImage];
	}
};

/**
 * @method Sets the Left Occiput Anterior nomenclature mapping
 */
PartogramLaborComponentWF.prototype.setLOANomen = function(value) {
	if (value.length > 1 || this.NOMEN_MAPPING[value[0]]) {
		this.fetalPosMisconfigured = true;
	} else {
		var fetalPosImage = new Image();
		fetalPosImage.src = this.getImageFolderPath() + "partoLaborFetalPos-SW.png";
		this.NOMEN_MAPPING[value[0]] = ['partoLaborSprite partoLaborFetalPos-SW', fetalPosImage];
	}
};

/**
 * @method Sets the Right Occiput Anterior nomenclature mapping
 */
PartogramLaborComponentWF.prototype.setROANomen = function(value) {
	if (value.length > 1 || this.NOMEN_MAPPING[value[0]]) {
		this.fetalPosMisconfigured = true;
	} else {
		var fetalPosImage = new Image();
		fetalPosImage.src = this.getImageFolderPath() + "partoLaborFetalPos-SE.png";
		this.NOMEN_MAPPING[value[0]] = ['partoLaborSprite partoLaborFetalPos-SE', fetalPosImage];
	}
};
/**
 * @method Sets the Occiput Posterior nomenclature mapping
 */
PartogramLaborComponentWF.prototype.setOPNomen = function(value) {
	if (value.length > 1 || this.NOMEN_MAPPING[value[0]]) {
		this.fetalPosMisconfigured = true;
	} else {
		var fetalPosImage = new Image();
		fetalPosImage.src = this.getImageFolderPath() + "partoLaborFetalPos-N.png";
		this.NOMEN_MAPPING[value[0]] = ['partoLaborSprite partoLaborFetalPos-N', fetalPosImage];
	}
};
/**
 * @method Sets the Left Occiput Posterior nomenclature mapping
 */
PartogramLaborComponentWF.prototype.setLOPNomen = function(value) {
	if (value.length > 1 || this.NOMEN_MAPPING[value[0]]) {
		this.fetalPosMisconfigured = true;
	} else {
		var fetalPosImage = new Image();
		fetalPosImage.src = this.getImageFolderPath() + "partoLaborFetalPos-NW.png";
		this.NOMEN_MAPPING[value[0]] = ['partoLaborSprite partoLaborFetalPos-NW', fetalPosImage];
	}
};
/**
 * @method Sets the Right Occiput Posterior nomenclature mapping
 */
PartogramLaborComponentWF.prototype.setROPNomen = function(value) {
	if (value.length > 1 || this.NOMEN_MAPPING[value[0]]) {
		this.fetalPosMisconfigured = true;
	} else {
		var fetalPosImage = new Image();
		fetalPosImage.src = this.getImageFolderPath() + "partoLaborFetalPos-NE.png";
		this.NOMEN_MAPPING[value[0]] = ['partoLaborSprite partoLaborFetalPos-NE', fetalPosImage];
	}
};
/**
 * @method Sets the Left Occiput Transverse nomenclature mapping
 */
PartogramLaborComponentWF.prototype.setLOTNomen = function(value) {
	if (value.length > 1 || this.NOMEN_MAPPING[value[0]]) {
		this.fetalPosMisconfigured = true;
	} else {
		var fetalPosImage = new Image();
		fetalPosImage.src = this.getImageFolderPath() + "partoLaborFetalPos-W.png";
		this.NOMEN_MAPPING[value[0]] = ['partoLaborSprite partoLaborFetalPos-W', fetalPosImage];
	}
};
/**
 * @method Sets the Right Occiput Transverse nomenclature mapping
 */
PartogramLaborComponentWF.prototype.setROTNomen = function(value) {
	if (value.length > 1 || this.NOMEN_MAPPING[value[0]]) {
		this.fetalPosMisconfigured = true;
	} else {
		var fetalPosImage = new Image();
		fetalPosImage.src = this.getImageFolderPath() + "partoLaborFetalPos-E.png";
		this.NOMEN_MAPPING[value[0]] = ['partoLaborSprite partoLaborFetalPos-E', fetalPosImage];
	}
};

/**
 * Callback method for the framework to load the filter value. Sets the toggle value of graph's background colored filter.
 * Used to determine whether the graph's background should be colored depending on the pregnancy descriptor.
 */
PartogramLaborComponentWF.prototype.setGraphBackgroundFilter = function(val) {
	this.graphBackgroundColored = val || false;
};

/**
 * Retrieves the partogram information from the shared resources to check whether the patient is in active labor or not.
 */
PartogramLaborComponentWF.prototype.RetrieveRequiredResources = function() {
	// Check to see if this component is part of a partogram view, if not, no need to check
	// the partogramInfo object
	if (PartogramBaseComponent.prototype.getPartogramViewID() !== this.getCriterion().category_mean) {
		var messageHTML = "<span class='res-none'>" + i18n.discernabu.partogrambaseutil_o2.NOT_PARTOGRAM_VIEW + "</span>";
		this.finalizeComponent(messageHTML, "");
		return;
	}

	// Check to see if the partogramInfo object is available to use
	var partogramInfoSR = MP_Resources.getSharedResource("partogramInfo");
	if (partogramInfoSR && partogramInfoSR.isResourceAvailable() && !jQuery.isEmptyObject(partogramInfoSR.getResourceData())) {
		this.retrieveComponentData();
	} else {
		// Add a listener so we can refresh the component if partogram info updates
		CERN_EventListener.addListener(this, "partogramInfoAvailable", this.retrieveComponentData, this);
	}
};

PartogramLaborComponentWF.prototype.loadFilterMappings = function() {
	var component = this;

	function addPartoLaborCurveFilterMap(filterName, functionName, type, field) {
		component.addFilterMappingObject(filterName, {
			setFunction: functionName,
			type: type,
			field: field
		});
	}
	// Add the filter mapping object for the fifthspalpable/fetal station
	addPartoLaborCurveFilterMap("WF_PARTO_LABOR_FIFTHS_STATION", this.setFetalHeadEngagementMode, "BOOLEAN", "FREETEXT_DESC");
	// Add the filter mapping object for the fetal position
	addPartoLaborCurveFilterMap("WF_PARTO_LABOR_FETAL_POS_OA", this.setOANomen, "ARRAY", "PARENT_ENTITY_ID");
	addPartoLaborCurveFilterMap("WF_PARTO_LABOR_FETAL_POS_LOA", this.setLOANomen, "ARRAY", "PARENT_ENTITY_ID");
	addPartoLaborCurveFilterMap("WF_PARTO_LABOR_FETAL_POS_ROA", this.setROANomen, "ARRAY", "PARENT_ENTITY_ID");
	addPartoLaborCurveFilterMap("WF_PARTO_LABOR_FETAL_POS_OP", this.setOPNomen, "ARRAY", "PARENT_ENTITY_ID");
	addPartoLaborCurveFilterMap("WF_PARTO_LABOR_FETAL_POS_LOP", this.setLOPNomen, "ARRAY", "PARENT_ENTITY_ID");
	addPartoLaborCurveFilterMap("WF_PARTO_LABOR_FETAL_POS_ROP", this.setROPNomen, "ARRAY", "PARENT_ENTITY_ID");
	addPartoLaborCurveFilterMap("WF_PARTO_LABOR_FETAL_POS_LOT", this.setLOTNomen, "ARRAY", "PARENT_ENTITY_ID");
	addPartoLaborCurveFilterMap("WF_PARTO_LABOR_FETAL_POS_ROT", this.setROTNomen, "ARRAY", "PARENT_ENTITY_ID");
	// Add the filter mapping object for the alert/action lines
	addPartoLaborCurveFilterMap("WF_PARTO_LABOR_AA_LINES", this.setAlertActionLinesVisible, "BOOLEAN", "FREETEXT_DESC");
	addPartoLaborCurveFilterMap("WF_PARTO_LABOR_AA_LINES_RATE", this.setAlertActionLinesRate, "BOOLEAN", "FREETEXT_DESC");
	addPartoLaborCurveFilterMap("WF_PARTO_LABOR_GRAPH_BGCOLOR", this.setGraphBackgroundFilter, "BOOLEAN", "FREETEXT_DESC");
};

/**
 * Creates the necessary parameter array for the data acquisition and makes the necessary script call to retrieve the labor curve data
 */
PartogramLaborComponentWF.prototype.retrieveComponentData = function() {
	try {
		var criterion = this.getCriterion();

		if (PartogramBaseComponent.prototype.getPartogramViewID() !== criterion.category_mean) {
			var messageHTML = "<span class='res-none'>" + i18n.discernabu.partogrambaseutil_o2.NOT_PARTOGRAM_VIEW + "</span>";
			this.finalizeComponent(messageHTML, "");
			return;
		}

		this.loadTimer = new RTMSTimer(this.getComponentLoadTimerName());
		var renderTimer = new RTMSTimer(this.getComponentRenderTimerName());
		var groups = this.getGroups();
		var groupsLength = groups.length;

		if (groupsLength > 0) {
			var sendAr = [],
				i;
			// initialize the event code values for the filters to 0
			var groupNames = ["WF_PARTO_LABOR_DILATION", "WF_PARTO_LABOR_FIFTHS_PALPABLE", "WF_PARTO_LABOR_STATION", "WF_PARTO_LABOR_FETAL_POS"];
			for (i = 0; i < groupNames.length; i++) {
				this.groupNameMap[groupNames[i]] = [0];
			}

			var partogramInfoSR = MP_Resources.getSharedResource("partogramInfo");
			var partogramStartDate = partogramInfoSR.getResourceData().getPartogramStartDate();
			partogramStartDate = MP_Util.CreateDateParameter(partogramStartDate);

			sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.ppr_cd + ".0", criterion.encntr_id + ".0");
			for (i = 0; i < groupsLength; i++) {
				var group = groups[i];
				// since we pass in event codes to our script
				if (group instanceof MPageEventCodeGroup) {
					this.groupNameMap[group.m_groupName] = group.getEventCodes();
				}
			}
			for (i = 0; i < groupNames.length; i++) {
				sendAr.push(MP_Util.CreateParamArray(this.groupNameMap[groupNames[i]], 1));
			}
			sendAr.push("^" + partogramStartDate + "^");

			var scriptRequest = new ComponentScriptRequest();
			scriptRequest.setProgramName("MP_GET_PARTOGRAM_LABOR");
			scriptRequest.setParameterArray(sendAr);
			scriptRequest.setComponent(this);
			scriptRequest.setLoadTimer(this.loadTimer);
			scriptRequest.setRenderTimer(renderTimer);
			scriptRequest.performRequest();
		} else {
			// if none of the event codes are mapped, skip script call and display message
			var noEventCodeMappedMessage = "<span class='res-none'>" + i18n.discernabu.partogrambaseutil_o2.NOT_CONFIGURED_BEDROCK_ERR + "</span>";
			this.finalizeComponent(noEventCodeMappedMessage, "");
		}
	} catch (err) {
		MP_Util.LogJSError(err, this, "partogramlabor.js", "retrieveComponentData");
	}
};

/**
 * Renders the Partogram Labor Curve component visuals. This method will be called after Partogram Labor has been initialized and setup.
 * 
 * @param recordData
 *             - has the information about the labor curve of the patient.
 */
PartogramLaborComponentWF.prototype.renderComponent = function(recordData) {
	var timerRenderComponent = MP_Util.CreateTimer(this.getComponentRenderTimerName(), this.getCriterion().category_mean);
	var renderingCAPTimer = new CapabilityTimer("CAP:MPG.PARTOGRAMLABOR.O2 - rendering component", this.getCriterion().category_mean);
	if (renderingCAPTimer) {
		renderingCAPTimer.capture();
	}
	try {
		var basei18n = i18n.discernabu.partogrambaseutil_o2;
		var bodyHTML = [];
		var noDataHTML = "<span class='res-none'>" + basei18n.NO_RESULTS_FOUND + "</span>";
		var dilationCount = recordData.DILATION_CNT;
		var fetalPosCount = recordData.FETALPOS_CNT;
		var fetalHeadEngModeDataStructureCnt = 0;
		// we want to check for the appropriate data structure depending on the
		// mode
		if (this.getFetalHeadEngagementMode()) {
			if (this.getFetalHeadEngagementMode() === "FIFTHS_PALPABLE") {
				fetalHeadEngModeDataStructureCnt = recordData.FIFPALPABLE_CNT;
			} else {
				fetalHeadEngModeDataStructureCnt = recordData.STATION_CNT;
			}
		}

		this.setDataArr(recordData);
		//add results count to timer 
		var resultsCount = dilationCount + fetalPosCount + fetalHeadEngModeDataStructureCnt;
		this.loadTimer.addMetaData("component.resultcount", resultsCount);
		
		if (dilationCount === 0 && fetalPosCount === 0 && fetalHeadEngModeDataStructureCnt === 0) {
			this.finalizeComponent(noDataHTML, MP_Util.CreateTitleText(this, ""));
		} else {
			PARTO_GRAPH_BASE.addSubscriber(this);
			var graphDiv = "partogram-labor-graph-" + this.getStyles().getId();
			// Remove colons from the event code names
			recordData.DILATION_EVENT_CODE_NAME = PARTO_GRAPH_BASE.removeColonEndOfString(recordData.DILATION_EVENT_CODE_NAME);
			recordData.STATION_EVENT_CODE_NAME = PARTO_GRAPH_BASE.removeColonEndOfString(recordData.STATION_EVENT_CODE_NAME);
			recordData.FIFPALPABLE_EVENT_CODE_NAME = PARTO_GRAPH_BASE.removeColonEndOfString(recordData.FIFPALPABLE_EVENT_CODE_NAME);
			// one container each for the graph and legend
			bodyHTML.push('<div class="partogram-container">');
			bodyHTML.push('<div class="partogram-container-col-1">');
			bodyHTML.push(this.createLegend());
			bodyHTML.push('</div>');
			bodyHTML.push('<div class="partogram-container-col-2">');
			bodyHTML.push(PARTO_GRAPH_BASE.createTopBar(this.getImageFolderPath(), "GRAPH"));
			bodyHTML.push('<div id="' + graphDiv + '" class="partogramGraphDiv partoGraphDivLabor"></div>');
			bodyHTML.push('</div>');
			this.finalizeComponent(bodyHTML.join(''), MP_Util.CreateTitleText(this, ""));
			this.plotGraph();
			PARTO_GRAPH_BASE.addTimeScaleButtons(this.getStyles().getId());
			this.handleEventsOnLegend();
		}
		$('#' + this.getStyles().getId()).css('margin-bottom', PARTO_GRAPH_BASE.getComponentBottomPadding());
	} catch (err) {
		MP_Util.LogJSError(err, this, "partogramlabor.js", "RenderComponent");
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

/**
 * Gets the background color for the labor curve graph. The color is based on the pregnancy descriptor which is available in the shared resource.
 * The setting is toggled on/off based on the WF_PARTO_LABOR_GRAPH_BGCOLOR bedrock filter
 */
PartogramLaborComponentWF.prototype.getGraphBackgroundColor = function() {
	var backgroundColor = '';
	//check whether is setting is on
	if (this.graphBackgroundColored) {
		//get the pregnancy descriptor state
		var partogramInfoSR = MP_Resources.getSharedResource("partogramInfo");
		var partogramInfoObj = partogramInfoSR.getResourceData();
		var pregDescState = partogramInfoObj.getPregnancyDescriptor();
		switch (pregDescState) {
			//Nullipara
			case 0:
				backgroundColor = 'rgba(255, 255, 0, 0.20)';
				break;
			//Multipara
			case 1:
				backgroundColor = 'rgba(173, 226, 255, 0.20)';
				break;
			//Prev C-Section
			case 2:
				backgroundColor = 'rgba(255, 214, 235, 0.30)';
				break;
			default:
				backgroundColor = '#FFFFFF';
		}	
	} else {
		backgroundColor = '#FFFFFF';
	}
	return backgroundColor;
};

/*
 * Plots the graph using JQplot library.
 */
PartogramLaborComponentWF.prototype.plotGraph = function() {
	var plot = this.getPlot();
	var graphData = this.createGraphData();
	var rootId = this.getStyles().getId();
	var COLOR_DARK_BLUE = '#0f59e3';
	var COLOR_ORANGE = '#FF3399';
	var COLOR_GRAPE = '#505050';
	var graphDiv = "partogram-labor-graph-" + rootId;
	// data range to display last 8 hours of data
	var DATA_RANGE = 8;
	// this range will later be set by the base graph component
	this.setDataRangeForGraph(DATA_RANGE);
	var endDt = PARTO_GRAPH_BASE.getEndDate();
	var startDt = PARTO_GRAPH_BASE.getStartDate();
	var fetalStationImage = new Image();
	fetalStationImage.src = this.getImageFolderPath() + 'partoLaborFS-Legend.png';
	// contains the settings for drawing the dark vertical line for every hour tick
	var canvasOverlayObjs = [];
	var hourticks = PARTO_GRAPH_BASE.getHourTicks();
	var quarterticks = PARTO_GRAPH_BASE.getQuarterTicks();
	canvasOverlayObjs = canvasOverlayObjs.concat(PARTO_GRAPH_BASE.getMajorGridLines());
	canvasOverlayObjs = canvasOverlayObjs.concat(PARTO_GRAPH_BASE.getOxytocinVerticalLines());
	canvasOverlayObjs = canvasOverlayObjs.concat(PARTO_GRAPH_BASE.getEpiduralVerticalLines());
	//check if current end date is near the last load time. If it is, only then show the today vertical bar
	if (endDt >= PARTO_GRAPH_BASE.getPartogramLastLoadTime()) {
		canvasOverlayObjs = canvasOverlayObjs.concat(PARTO_GRAPH_BASE.getTodayVerticalBar());
	}
	var backgroundColor = this.getGraphBackgroundColor();
	/*
	 * Generates Y2Axis ticks y2 axis ticks will differ based on whether the bedrock is configured to show fifths palpable or fetal station. The first
	 * and last pairs of values ex:-1 and 6 in fifthspalpable array, are not expected values for this axis.But, these are being as tick insets (the
	 * gap between the grid and the first/last value on the axis). The gap will be equivalent to 1 unit for this axis
	 */
	function y2axisTicksGenerator(mode) {
		var axisticks = [];
		if (mode) {
			if (mode === "FIFTHS_PALPABLE") {
				axisticks.push(['-1', ''], '0', '1', '2', '3', '4', '5', ['6', '']);
			} else {
				// A work around for tick-inset option available in JQPLOT as it
				// did not seem to work -
				// http://services.mbi.ucla.edu/jqplot/docs/files/jqplot-linearAxisRenderer-js.html#$.jqplot.LinearAxisRenderer.tickInset
				// 6 and -6 values are not expected values for this axis.But,
				// these are being as tick insets (the gap between the grid
				// and the first/last value on the axis).The gap will be
				// equivalent to 1 unit for this axis
				axisticks.push(['6', ''], ['5', '+5'], ['4', '+4'], ['3', '+3'], ['2', '+2'], ['1', '+1'], ['0', '0'], ['-1', '-1'], ['-2', '-2'], [
					'-3', '-3'
				], ['-4', '-4'], ['-5', '-5'], ['-6', '']);
			}
		} else {
			axisticks.push([]);
		}
		return axisticks;
	}
	var y2axisticks = y2axisTicksGenerator(this.fetalHeadEngagementMode);

	var options = {
		graphName: graphDiv,
		seriesDefaults: {
			hoverable: false,
			highlightMouseDown: true,
			showLine: true,
			showMark: true,
			showLabel: true,
			formatString: "%R",
			fontSize: "11px",
			textColor: "#505050",
			shadow: false
		},
		series: [{
				label: 'laborCurve_dilation',
				markerOptions: {
					show: true,
					style: 'filledCircle',
					size: 10,
					shadow: false
				},
				xaxis: 'x2axis',
				yaxis: 'yaxis',
				lineWidth: 1,
				color: COLOR_DARK_BLUE,
				highlighter: {
					tooltipContentEditor: this.graphToolTipContent(),
					showTooltip: true,
					tooltipLocation: 'n'
				}
			}, {
				label: 'laborCurve_station',
				markerRenderer: $.jqplot.ImageMarkerRenderer,
				markerOptions: {
					show: true,
					imageElement: fetalStationImage,
					xOffset: -5.5,
					yOffset: -5,
					shadow: false
				},
				xaxis: 'x2axis',
				yaxis: 'y2axis',
				lineWidth: 1,
				color: COLOR_ORANGE,
				highlighter: {
					tooltipContentEditor: this.graphToolTipContent(),
					showTooltip: true,
					tooltipLocation: 'n'
				}
			}, {
				label: 'laborCurve_alertLine',
				linePattern: 'dashed',
				showMarker: false,
				shadow: false,
				showLine: true,
				lineWidth: 1.5,
				color: COLOR_GRAPE,
				showHighlight: false
			}, {
				label: 'laborCurve_actionLine',
				linePattern: 'dashed',
				showMarker: false,
				shadow: false,
				showLine: true,
				lineWidth: 1.5,
				color: COLOR_GRAPE,
				showHighlight: false
			}, {
				label: 'laborCurve_fetalpos',
				renderer: $.jqplot.LineRendererWithIndex,
				markerRenderer: $.jqplot.IndividualImageMarkerRenderer,
				markerOptions: {
					show: true,
					imageArray: this.fetalPositionImageArray,
					xOffset: -15,
					yOffset: -10,
					shadow: false
				},

				xaxis: 'x2axis',
				yaxis: 'yaxis',
				showLine: false,
				highlighter: {
					tooltipContentEditor: this.graphToolTipContent(),
					showTooltip: true,
					tooltipLocation: 'n'
				}
			}

		],
		axesDefaults: {
			tickOptions: {
				textColor: PARTO_GRAPH_BASE.COLOR_DARK_GRAY,
				fontSize: '11px'
			}
		},
		axes: {
			xaxis: {
				renderer: $.jqplot.DateAxisRenderer,
				tickOptions: {
					show: true,
					showLabel: false,
					showMark: false
				},
				min: startDt,
				max: endDt,
				ticks: quarterticks
			},
			yaxis: {
				tickInterval: 1,
				tickOptions: {
					showMark: false,
					showLabel: true
				},
				ticks: [
					[-1, ''],
					[0, 0],
					[1, '1'],
					[2, '2'],
					[3, '3'],
					[4, '4'],
					[5, '5'],
					[6, '6'],
					[7, '7'],
					[8, '8'],
					[9, '9'],
					[10, '10'],
					[11, '']
				]
			},

			x2axis: {
				renderer: $.jqplot.DateAxisRenderer,
				tickOptions: {
					showMark: false,
					showLabel: false,
					formatString: "%R"
				},
				min: startDt,
				max: endDt,
				ticks: hourticks
			},
			y2axis: {
				ticks: y2axisticks,
				drawMajorGridlines: false,
				tickOptions: {
					showMark: true,
					showLabel: true
				}

			}
		},
		legend: {
			show: false
		},
		canvasOverlay: {
			show: true,
			objects: canvasOverlayObjs
		},
		grid: {
			drawGridLines: true,
			hoverable: false,
			shadow: false,
			background: backgroundColor,
			gridLineWidth: 1,
			gridLineColor: PARTO_GRAPH_BASE.MINOR_GRID_LINE_COLOR,
			drawBorder: false
		},
		cursor: {
			showTooltip: false,
			show: false
		}
	};

	plot = $.jqplot(graphDiv, graphData, options);
	this.setPlot(plot);
	this.setGraphElement(document.getElementById(graphDiv));
	PARTO_GRAPH_BASE.setGraphsCommonCSS();
	if (!PARTO_GRAPH_BASE.topBarGraphHTML) {
		PARTO_GRAPH_BASE.refreshTopbar(rootId);
	}
};

/**
 * This function returns the callback for tooltip for data points
 */
PartogramLaborComponentWF.prototype.graphToolTipContent = function() {
	var component = this;
	/**
	 * @param seriesIndex -
	 *            the index on the series which the mouse hover was triggered
	 * @param pointIndex -
	 *            the nth datapoint in the selected series array
	 * @param plot -
	 *            the JQplot graph
	 */
	var tooltipFunc = function(str, seriesIndex, pointIndex, plot) {
		PARTO_GRAPH_BASE.setToolTipLocation(plot, seriesIndex, pointIndex);
		var data = plot.data[seriesIndex][pointIndex];
		/*
		 * data[0] - dateTime, data[1] - Result value
		 */
		var time = data[0];
		var dataPopulated = PARTO_GRAPH_BASE.isHoverDataPopulated(component.HOVER_KEY);
		if (!dataPopulated) {
			component.populateHoverData();
		}
		return PARTO_GRAPH_BASE.getHoverHTML(component.HOVER_KEY, time);
	};

	return tooltipFunc;
};


/**
 * A method to populate data for hover over datapoints on the graph.
 */
PartogramLaborComponentWF.prototype.populateHoverData = function() {
	var data = this.getDataArr();
	var NO_UNIT = "";
	var i, timestamp, fetalPosDisplayVal, nomenID, display, displayArr;
	var value = '';
	//buildValue creates the html to be displayed in the value column of the hover
	var buildValue = function(resultValue, normalcy, modifiedInd, unit) {
		var normalcyClass = PARTO_GRAPH_BASE.getNormalcyClass(normalcy);
		var valueHTML = PARTO_GRAPH_BASE.getResultIndHTML(resultValue, unit, normalcyClass, modifiedInd);
		return valueHTML;
	};

	//populate dilation hover data
	var DILATION_ICON_HTML = '<div class="partoLaborSprite partoLaborDilation-legend"></div>';
	var dilationEventCode = data.DILATION_EVENT_CODE_NAME;
	var dilationCount = data.DILATION_CNT;
	var dilationData = data.DILATION;
	for (i = 0; i < dilationCount; i++) {
		var dilationPoint = dilationData[i];
		value = buildValue(dilationPoint.RESULT_VALUE, dilationPoint.RESULT_NORMALCY, dilationPoint.RESULT_MODIFIED_IND, this.dilationUnit);
		timestamp = PARTO_GRAPH_BASE.getLocalDateTime(dilationPoint.RESULT_DATE);
		PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, timestamp, DILATION_ICON_HTML, dilationEventCode, value);
	}

	//populate fetal position hover data
	var FETAL_POS_ICON_HTML = '';
	var fetalPosEventCode = data.FETALPOS_EVENT_CODE_NAME;
	var fetalPosData = data.FETALPOS;
	var fetalPosCount = data.FETALPOS_CNT;
	//populate only if it's misconfigured.
	if (!this.fetalPosMisconfigured) {
		for (i = 0; i < fetalPosCount; i++) {
			var fetalPosPoint = fetalPosData[i];
			FETAL_POS_ICON_HTML = '';
			display = fetalPosPoint.RESULT_DISPLAY;
			displayArr = display.split(';');
			if (displayArr.length < 2) {
				continue;
			}
			nomenID = parseInt($.trim(displayArr[1]), 10);
			fetalPosDisplayVal = $.trim(displayArr[0]);
			//nomen should be mapped in bedrock.
			if (!this.NOMEN_MAPPING[nomenID]) {
				continue;
			}
			if (this.fetalPositionDataArray[i] && this.fetalPositionDataArray[i][2]) {
				FETAL_POS_ICON_HTML = '<div class="' + this.fetalPositionDataArray[i][2] + '"></div>';
			}

			value = buildValue(fetalPosDisplayVal, fetalPosPoint.RESULT_NORMALCY, fetalPosPoint.RESULT_MODIFIED_IND, NO_UNIT);
			timestamp = PARTO_GRAPH_BASE.getLocalDateTime(fetalPosPoint.RESULT_DATE);
			PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, timestamp, FETAL_POS_ICON_HTML, fetalPosEventCode, value);
		}
	}
	//populate fetal station/fifths palpable data
	var FETAL_HEAD_ICON_HTML = '<div class="partoLaborSprite partoLaborFS-Legend"></div>';
	if (this.getFetalHeadEngagementMode() === "FIFTHS_PALPABLE") {
		var fifthsPalpableCount = data.FIFPALPABLE_CNT;
		var fifthsPalpableData = data.FIFPALPABLE;
		for (i = 0; i < fifthsPalpableCount; i++) {
			var fifpalpablePoint = fifthsPalpableData[i];
			value = buildValue(fifpalpablePoint.RESULT_DISPLAY, fifpalpablePoint.RESULT_NORMALCY, fifpalpablePoint.RESULT_MODIFIED_IND, NO_UNIT);
			timestamp = PARTO_GRAPH_BASE.getLocalDateTime(fifpalpablePoint.RESULT_DATE);
			PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, timestamp, FETAL_HEAD_ICON_HTML, data.FIFPALPABLE_EVENT_CODE_NAME, value);
		}
	} else {
		var stationCount = data.STATION_CNT;
		var stationData = data.STATION;
		for (i = 0; i < stationCount; i++) {
			var stationPoint = stationData[i];
			value = buildValue(stationPoint.RESULT_DISPLAY, stationPoint.RESULT_NORMALCY, stationPoint.RESULT_MODIFIED_IND, NO_UNIT);
			timestamp = PARTO_GRAPH_BASE.getLocalDateTime(stationPoint.RESULT_DATE);
			PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, timestamp, FETAL_HEAD_ICON_HTML, data.STATION_EVENT_CODE_NAME, value);
		}
	}
};

/**
 * This method will create the data formatted for JQPLOT [[x-axis:date, y-axis:value]] .
 * 
 * @param {null}
 * @return {Array} An array of dilation and station plots.
 */
PartogramLaborComponentWF.prototype.createGraphData = function() {
	var data = this.getDataArr();
	var dataPlots = [];
	var stationPlots = [];
	var dilationPlots = [];
	var alertPlots = [];
	var actionPlots = [];
	var positionPlots = [];
	var DEFAULT_ALERT_ACTION_LINE_RATE = 1;
	var DEFAULT_ALERT_ACTION_LINE_RATE_FOR_MULTIP = 1.5;
	var partogramInfoSR = MP_Resources.getSharedResource("partogramInfo");
	var partogramInfoObj = partogramInfoSR.getResourceData();
	var alertActionRate = this.getAlertActionLinesRate() || DEFAULT_ALERT_ACTION_LINE_RATE;

	var ALERT_ACTION_VALUE_INCREMENTS = partogramInfoObj.useMultipRate() ? DEFAULT_ALERT_ACTION_LINE_RATE_FOR_MULTIP : alertActionRate;
	// the dilation value at which the alert actions lines will be drawn
	var DILATION_CRITERIA_FOR_ALERT_ACTION_LINES = 4;
	// whether or not to display action/alert lines
	var displayAlertActionLines = this.getAlertActionLinesVisible() || false;
	var dilationCount = data.DILATION_CNT;
	var stationCount = data.STATION_CNT;
	var fifthsPalpableCount = data.FIFPALPABLE_CNT;
	var fetalPosCount = data.FETALPOS_CNT;
	var dilationData = data.DILATION;
	var stationData = data.STATION;
	var fifthsPalData = data.FIFPALPABLE;
	var fetalPosData = data.FETALPOS;
	this.dilationUnit = data.DILATION_UNIT;

	// startTimeForAALine is the time corresponding to when dilation value meets or exceeds the criteria (in this case: 4cm)for drawing alert/action
	// lines
	var startTimeForAALine;
	var firstDilationValueTriggerForAA;
	// sort in ascending order
	dilationData.sort(function(a, b) {
		return new Date(a.RESULT_DATE) - new Date(b.RESULT_DATE);
	});
	stationData.sort(function(a, b) {
		return new Date(a.RESULT_DATE) - new Date(b.RESULT_DATE);
	});
	fifthsPalData.sort(function(a, b) {
		return new Date(a.RESULT_DATE) - new Date(b.RESULT_DATE);
	});
	fetalPosData.sort(function(a, b) {
		return new Date(a.RESULT_DATE) - new Date(b.RESULT_DATE);
	});
	// check if dilation data is present, if so, we want the date as x-axis and
	// value as y-axis
	if (dilationCount) {
		for (var dCnt = 0; dCnt < dilationCount; dCnt++) {
			var value = dilationData[dCnt].RESULT_VALUE;
			var date = dilationData[dCnt].RESULT_DATE;
			// store the time when the value meets or exceeds the criteria for the first time
			if (value >= DILATION_CRITERIA_FOR_ALERT_ACTION_LINES && typeof startTimeForAALine === 'undefined') {
				firstDilationValueTriggerForAA = value;
				startTimeForAALine = PARTO_GRAPH_BASE.getLocalDateTime(date);
			}
			dilationPlots.push([PARTO_GRAPH_BASE.getLocalDateTime(date), value]);
		}
	}
	/**
	 * The alert/action lines should always start at the dilationCriteria value ie. 4cm This function returns the date time at which the alert line
	 * slope meets the criteria value
	 */
	function getInitialTimeForAlertLine(dilationVal, time, rate, dilationCriteria) {
		// the alert/action lines satisfies the line equation y = mx + b -> dilationValue = rate * time_in_hours + dilationCriteria
		// find the time_in_hours, given other parameters
		var ONE_HOUR_MS = 3600000;
		var time_in_hours = (dilationVal - dilationCriteria) / rate;
		var dateTime = new Date(time - ONE_HOUR_MS * time_in_hours).getTime();
		return dateTime;
	}
	// Redraw table and graph components in partogram if the alert/action lines end in future
	function resetPartogramFinalTime() {
		var hours, ONE_HOUR_MS = 3600000;
		var graphBase = PARTO_GRAPH_BASE;
		switch (ALERT_ACTION_VALUE_INCREMENTS) {
			case 0.5:
				hours = 16;
				break;
			case 1:
				hours = 10;
				break;
			case 1.5:
				hours = 8;
				break;
		}
		var partogramEndTime = alertStartTime + hours * ONE_HOUR_MS;
		// if the current range does not cover the new end time, need to reset
		if (graphBase.getFinalEndTime() < partogramEndTime) {
			graphBase.setAlertActionEndTime(partogramEndTime);
			graphBase.setFinalEndTime(partogramEndTime);
		}
	}

	var alertStartTime = firstDilationValueTriggerForAA ? getInitialTimeForAlertLine(firstDilationValueTriggerForAA, startTimeForAALine,
		ALERT_ACTION_VALUE_INCREMENTS, DILATION_CRITERIA_FOR_ALERT_ACTION_LINES) : null;

	// check whether the alert and action lines need to be displayed and display the lines only if the minimum criteria for alert/action has been met
	if (displayAlertActionLines && alertStartTime) {
		resetPartogramFinalTime();
		var initialAlertDate = new Date(alertStartTime);
		var initialActionDate = new Date(initialAlertDate);
		initialActionDate.setHours(initialActionDate.getHours() + 4);
		var initialAlertValue = DILATION_CRITERIA_FOR_ALERT_ACTION_LINES;
		// display until the value reaches atleast 10 units
		// in case rate is 1.5cm, the last value less than or equal to 10 is 8.5. However, we want to alert/action
		// lines to atleast meet 10. so, the last value in that case will be 11.
		var finalAlertValue = (ALERT_ACTION_VALUE_INCREMENTS === 1.5) ? 11 : 10;
		while (initialAlertValue <= finalAlertValue) {
			alertPlots.push([initialAlertDate.getTime(), initialAlertValue]);
			actionPlots.push([initialActionDate.getTime(), initialAlertValue]);

			initialAlertDate.setHours(initialAlertDate.getHours() + 1);
			initialActionDate.setHours(initialActionDate.getHours() + 1);
			initialAlertValue += ALERT_ACTION_VALUE_INCREMENTS;
		}
	}
	if (this.getFetalHeadEngagementMode()) {
		if (this.getFetalHeadEngagementMode() === "FIFTHS_PALPABLE") {
			if (fifthsPalpableCount) {
				for (var fCnt = 0; fCnt < fifthsPalpableCount; fCnt++) {
					stationPlots.push([PARTO_GRAPH_BASE.getLocalDateTime(fifthsPalData[fCnt].RESULT_DATE), fifthsPalData[fCnt].RESULT_DISPLAY]);
				}
			}
		} else {
			if (stationCount) {
				for (var sCnt = 0; sCnt < stationCount; sCnt++) {
					stationPlots.push([PARTO_GRAPH_BASE.getLocalDateTime(stationData[sCnt].RESULT_DATE), stationData[sCnt].RESULT_DISPLAY]);
				}
			}
		}
	}
	var fetalPosYValue = 10.6; // y axis is used, the image needs to fit between 10 and 11.

	// do not display fetal position if it is misconfigured in bedrock
	if (!this.fetalPosMisconfigured) {
		for (var fpCnt = 0; fpCnt < fetalPosCount; fpCnt++) {
			var fetalPosUnit = fetalPosData[fpCnt];
			var display = fetalPosUnit.RESULT_DISPLAY;
			var displayArr = display.split(';');
			if (displayArr.length < 2) {
				continue;
			}
			var nomenID = parseInt($.trim(displayArr[1]), 10);
			var resultDisp = $.trim(displayArr[0]);
			if (this.NOMEN_MAPPING[nomenID]) {
				var resultDate = PARTO_GRAPH_BASE.getLocalDateTime(fetalPosUnit.RESULT_DATE);
				this.fetalPositionDataArray.push([resultDate, resultDisp, this.NOMEN_MAPPING[nomenID][0]]);
				this.fetalPositionImageArray.push(this.NOMEN_MAPPING[nomenID][1]);
				positionPlots.push([resultDate, fetalPosYValue]);
			}
		}
	}
	// this is done as a workaround for Jqplot bug where it expects the first series array to be non zero
	if (dilationPlots.length === 0) {
		dilationPlots.push([null]);
	}

	dataPlots.push(dilationPlots, stationPlots);
	dataPlots.push(alertPlots);
	dataPlots.push(actionPlots);
	dataPlots.push(positionPlots);
	return dataPlots;

};
/**
 * @method This method will create the legend on the side of the graph.
 * @param {null}
 * @return {string} An empty HTML layout for the legend.
 */
PartogramLaborComponentWF.prototype.createLegend = function() {

	var rfi18n = i18n.discernabu.partogramlabor_o2;
	var layoutHTML = [];
	var data = this.getDataArr();
	var fetalHeadEngagementCodename = "",
		fetalHeadEngagementGroupname = "";
	if (this.getFetalHeadEngagementMode()) {
		if (this.getFetalHeadEngagementMode() === "FIFTHS_PALPABLE") {
			fetalHeadEngagementCodename = data.FIFPALPABLE_EVENT_CODE_NAME;
			fetalHeadEngagementGroupname = "WF_PARTO_LABOR_FIFTHS_PALPABLE";
		} else {
			fetalHeadEngagementCodename = data.STATION_EVENT_CODE_NAME;
			fetalHeadEngagementGroupname = "WF_PARTO_LABOR_STATION";
		}
	}

	var compId = this.getComponentId();
	var dilation = data.DILATION_EVENT_CODE_NAME;
	var fetalPosition = data.FETALPOS_EVENT_CODE_NAME;
	var alertAction = rfi18n.alertAction;
	var LABOR_CURVE_DILATION_ON_IMAGE_CLASS = 'partoLaborSprite partoLaborDilation-ON';
	var LABOR_CURVE_FETAL_HEAD_MEASUREMENT_ON_IMAGE_CLASS = 'partoLaborSprite partoLaborFS-ON';
	var LABOR_CURVE_ALERT_ACTION_ON_IMAGE_CLASS = 'partoLaborSprite partoLaborAAlines-ON';
	var LABOR_CURVE_FETAL_POS_ON_IMAGE_CLASS = 'partoLaborSprite partoLaborFetalPos-ON';
	var LABOR_CURVE_FETAL_POS_ERROR_IMAGE_CLASS = 'partoLaborSprite partoLaborFetalPos-Error';
	var errorTextOnHover = rfi18n.FETAL_POS_FILTER_MISCONFIGURE_ERROR;
	errorTextOnHover = errorTextOnHover.replace("{0}", fetalPosition);

	// legend shows alert/action rate
	var partogramInfoSR = MP_Resources.getSharedResource("partogramInfo");
	var partogramInfoObj = partogramInfoSR.getResourceData();
	var alertActionRate = this.getAlertActionLinesRate() || 1;
	var ALERT_ACTION_VALUE_INCREMENTS = partogramInfoObj.useMultipRate() ? 1.5 : alertActionRate;
	var alertActionRateUnit = rfi18n.ALERT_ACTION_LEGEND_UNIT;
	var alertActionHTML = "<div class='parto-graph-aa-unit'>" + ALERT_ACTION_VALUE_INCREMENTS + ' ' + alertActionRateUnit + " </div>";

	layoutHTML.push('<div class="partogram-legend" id="partogram-legend-' + this.getComponentId() + '">');

	if (this.groupNameMap.WF_PARTO_LABOR_DILATION[0]) {
		layoutHTML.push('<div class="partogram-labor-legend-item"><div class="partogram-labor-legend-img"><div id="partogram-labor-cervix-dilation' + compId + '" class="' + LABOR_CURVE_DILATION_ON_IMAGE_CLASS + '"></div></div><div title="' + dilation + '" class="partogram-labor-legend-item-name"><span>' + dilation + '</span></div></div>');
	}

	// display legend only if they have picked either fifths or station through bedrock
	if (this.getFetalHeadEngagementMode() && this.groupNameMap[fetalHeadEngagementGroupname][0]) {
		layoutHTML.push('<div class="partogram-labor-legend-item"><div class="partogram-labor-legend-img"><div id="partogram-labor-fetal-station' + compId + '" class="' + LABOR_CURVE_FETAL_HEAD_MEASUREMENT_ON_IMAGE_CLASS + '"></div></div><div title="' + fetalHeadEngagementCodename + '" class="partogram-labor-legend-item-name"><span>' + fetalHeadEngagementCodename + '</span></div></div>');
	}
	if (this.groupNameMap.WF_PARTO_LABOR_FETAL_POS[0]) {
		layoutHTML.push('<div class="partogram-labor-legend-item">');
		layoutHTML.push('<div class="partogram-labor-legend-img"><div id="partogram-labor-fetal-position' + compId + '" class="' + LABOR_CURVE_FETAL_POS_ON_IMAGE_CLASS + '"></div></div>');
		layoutHTML.push('<div title="' + fetalPosition + '" class="partogram-labor-legend-item-name"><span>' + fetalPosition + '</span>');
		if (this.fetalPosMisconfigured) {
			layoutHTML.push('<div title="' + errorTextOnHover + '" class="' + LABOR_CURVE_FETAL_POS_ERROR_IMAGE_CLASS + '"></div>');
		}
		layoutHTML.push('</div></div>');
	}

	if (this.alertActionLinesVisible) {
		layoutHTML.push('<div class="partogram-labor-legend-item"><div class="partogram-labor-legend-img"><div id="partogram-labor-alert-action-lines' + compId + '" class="' + LABOR_CURVE_ALERT_ACTION_ON_IMAGE_CLASS + '"></div></div><div title="' + alertAction + '" class="partogram-labor-legend-item-name"><span>' + alertAction + ':' + alertActionHTML + '</span></div></div>');
	}

	layoutHTML.push('</div>');

	return layoutHTML.join('');
};

/**
 * Handles click events on the legend items
 */
PartogramLaborComponentWF.prototype.handleEventsOnLegend = function() {
	var plot = this.getPlot();
	var component = this;
	/*
	 * A function that hides the series on the graph and toggles image on legend
	 */
	function toggleLegendAndSeries() {
		return function(event) {
			var componentId = component.getComponentId();
			var PLOT_INDEX = [];
			var DILATION_PLOT_INDEX = [0];
			var FETAL_HEAD_ENGAGEMENT_PLOT_INDEX = [1];
			var ALERTACTION_PLOT_INDICES = [2, 3];
			var FETALPOS_PLOT_INDICES = [4];
			var imgDiv = event.target;
			var toggledFrom = '';
			// get the index corresponding to the image id
			switch (event.target.id) {
				case "partogram-labor-cervix-dilation" + componentId:
					PLOT_INDEX = DILATION_PLOT_INDEX;
					toggledFrom = 'Dilation';
					break;
				case "partogram-labor-fetal-station" + componentId:
					PLOT_INDEX = FETAL_HEAD_ENGAGEMENT_PLOT_INDEX;
					toggledFrom = 'Fetal Station';
					break;
				case "partogram-labor-alert-action-lines" + componentId:
					PLOT_INDEX = ALERTACTION_PLOT_INDICES;
					toggledFrom = 'Alert Action lines';
					break;
				case "partogram-labor-fetal-position" + componentId:
					PLOT_INDEX = FETALPOS_PLOT_INDICES;
					toggledFrom = 'Fetal Position';
					break;
			}
			var imageClass = $(imgDiv).attr('class');
			// toggle the images between active and inactive states
			if (imageClass.indexOf('-OFF') > -1) {
				imageClass = imageClass.replace('-OFF', '-ON');
			} else {
				imageClass = imageClass.replace('-ON', '-OFF');
			}

			$(imgDiv).attr('class', imageClass);

			for (var i = 0; i < PLOT_INDEX.length; i++) {
				// toggle the corresponding series
				plot.series[PLOT_INDEX[i]].show = !plot.series[PLOT_INDEX[i]].show;
			}
			plot.redraw();

			PARTO_GRAPH_BASE.setGraphsCommonCSS();
			var legendToggleTimer = new CapabilityTimer("CAP:MPG.PARTOGRAMLABOR.O2 - legend toggle", component.criterion.category_mean);
			if (legendToggleTimer) {
				legendToggleTimer.addMetaData('rtms.legacy.metadata.1', toggledFrom);
				legendToggleTimer.capture();
			}
		};
	}

	jQuery('.partogram-labor-legend-img div').click(toggleLegendAndSeries());
};
