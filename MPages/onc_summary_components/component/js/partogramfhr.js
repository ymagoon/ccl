/**
 * Create the FHR component style object
 * @constructor
 */
function PartogramFHRComponentWFStyle() {
	this.initByNamespace("parto-fhr-wf");
}

PartogramFHRComponentWFStyle.prototype = new ComponentStyle();
PartogramFHRComponentWFStyle.prototype.constructor = ComponentStyle;

/**
 * The Partogram FHR component will retrieve Baseline and Intermittent FHR for dynamic groups
 *
 *  @param criterion {Criterion} - The Criterion object which contains information needed to render the component.
 */
function PartogramFHRComponentWF(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new PartogramFHRComponentWFStyle());
	this.setComponentLoadTimerName("USR:MPG.PARTOGRAMFHR.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.PARTOGRAMFHR.O2 - render component");
	this.setImageFolderPath(criterion.static_content + '/images/');
	this.setMaxAllowedBabies(3);
	this.FHR_UNIT = null;
	//Used by base to draw the normal range if it's FHR
	this.IS_FHR = true;
	this.setRefreshEnabled(false);
	this.babyPlots = null;
	this.groupNameMap = {};
	// Flag for resource required
	this.setResourceRequired(true);
	this.loadTimer = null;
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object.
 */
PartogramFHRComponentWF.prototype = new MPageComponent();
PartogramFHRComponentWF.prototype.constructor = MPageComponent;
PartogramFHRComponentWF.prototype.HOVER_KEY = "FHR";
/**
 * Map the Partogram option 2 object to the bedrock filter mapping so the architecture
 * will know what object to create when it sees the "WF_PARTO_FHR" filter.
 */
MP_Util.setObjectDefinitionMapping("WF_PARTO_FHR", PartogramFHRComponentWF);

/**
 * @method Returns the path where images are stored in the static content
 *         folder
 * @return the relative path
 */
PartogramFHRComponentWF.prototype.getImageFolderPath = function() {
	return this.imageFolderPath;
};
/**
 * @method Stores the path to where images are stored in the static content
 *         folder.
 */
PartogramFHRComponentWF.prototype.setImageFolderPath = function(path) {
	this.imageFolderPath = path;
};

/**
 * @method gets the reference to the jqplot object
 * 
 * @return the reference to the JqPlot graph
 */
PartogramFHRComponentWF.prototype.getPlot = function() {
	return this.plot;
};

/**
 * @method Store a reference to the jqplot object
 * @param {object} plot - A reference to the jqplot object
 */
PartogramFHRComponentWF.prototype.setPlot = function(plot) {
	this.plot = plot;
};

/**
 * @method gets the reference to the recordData object
 * @return the reference to recordData object
 */
PartogramFHRComponentWF.prototype.getRecordData = function() {
	return this.recordData;
};

/**
 * @method Store a reference to the recordData object
 * @param {object} plot - A reference to the recordData object
 */
PartogramFHRComponentWF.prototype.setRecordData = function(data) {
	this.recordData = data;
};

/**
 * @method gets the maximum number of babies allowed for partogram
 * @return the reference to max number
 */
PartogramFHRComponentWF.prototype.getMaxAllowedBabies = function() {
	return this.maxAllowedBabies;
};

/**
 * @method sets the maximum number of babies allowed for partogram
 * @param {integer} count - The maximum allowed babies
 */
PartogramFHRComponentWF.prototype.setMaxAllowedBabies = function(count) {
	this.maxAllowedBabies = count;
};

/**
 * @method gets the reference to the graph element
 * @return the reference to graph element
 */
PartogramFHRComponentWF.prototype.getGraphElement = function() {
	return this.graphElement;
};

/**
 * @method Store a reference to the graph element
 * @param {HTML Element} el - A reference to the graph element
 */
PartogramFHRComponentWF.prototype.setGraphElement = function(el) {
	this.graphElement = el;
};

PartogramFHRComponentWF.prototype.RetrieveRequiredResources = function() {
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

/**
 * Returns the total number of results for baseline and intermittent 
 * for each baby returned by script
 */
PartogramFHRComponentWF.prototype.getResultsCount = function(recordData) {
	var babyCount = recordData.CNT;
	var babyArray = recordData.BABY;
	var resCount = 0, i, babyRecordData;
	for (i = 0; i < babyCount ; i++) {
		babyRecordData = babyArray[i];
		resCount += babyRecordData.BASELINE_CNT + babyRecordData.INTERMITTENT_CNT;
	}
	return resCount;
};

/**
 * It creates the necessary parameter array for the data acquisition and makes the
 * necessary script call to retrieve the FHR data
 */
PartogramFHRComponentWF.prototype.retrieveComponentData = function() {
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
			var partogramInfoSR = MP_Resources.getSharedResource("partogramInfo");
			var partogramStartDate = partogramInfoSR.getResourceData().getPartogramStartDate();
			partogramStartDate = MP_Util.CreateDateParameter(partogramStartDate);

			// Map of Bedrock filter name (group name) to event code value initialized to 0. The order of filters in this map should be same as the order of filters defined in bedrock.
			var groupNames = ["WF_PARTO_FHR_FETAL_HR_BASELINE", "WF_PARTO_FHR_FETAL_HR"];
			//initialize event code value for each filter
			for (i = 0; i < groupNames.length; i++) {
				this.groupNameMap[groupNames[i]] = [0];
			}
			sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.ppr_cd + ".0", criterion.encntr_id + ".0");
			for (i = 0; i < groupsLength; i++) {
				var group = groups[i];
				if (group instanceof MPageEventCodeGroup) {
					this.groupNameMap[group.m_groupName] = group.getEventCodes();
				}
			}
			for (i = 0; i < groupNames.length; i++) {
				sendAr.push(MP_Util.CreateParamArray(this.groupNameMap[groupNames[i]], 1));
			}
			sendAr.push("^" + partogramStartDate + "^");
			var scriptRequest = new ComponentScriptRequest();
			scriptRequest.setProgramName("MP_GET_PARTOGRAM_FHR");
			scriptRequest.setParameterArray(sendAr);
			scriptRequest.setComponent(this);
			scriptRequest.setLoadTimer(this.loadTimer);
			scriptRequest.setRenderTimer(renderTimer);
			scriptRequest.performRequest();
		} else {
			var noEventCodeMappedMessage = "<span class='res-none'> " + i18n.discernabu.partogrambaseutil_o2.NOT_CONFIGURED_BEDROCK_ERR + "</span>";
			this.finalizeComponent(noEventCodeMappedMessage, "");
		}
	} catch (err) {
		MP_Util.LogJSError(err, this, "partogramfhr.js", "retrieveComponentData");
	}
};



/**
 * This function creates a map of DYNAMIC_LABEL_ID to an integer index starting from 0
 * @param babyArray {Array} : The baby data array fetched from the record data json
 * @param length {Integer} : The length of the array. 
 * @return babyMap {Object}: The map from DYNAMIC_LABEL_ID to integer index
 */
PartogramFHRComponentWF.prototype.getBabyIndexMap = function(babyArray, length) {
	var index = 0;
	var babyMap = {};
	while (index < length) {
		babyMap[babyArray[index].DYNAMIC_LABEL_ID] = index;
		index++;
	}
	return babyMap;
};

/**
 * This function creates an array of Dynamic Labels
 * @param babyArray {Array} : The baby data array fetched from the record data json
 * @param length {Integer} : The length of the array. 
 * @return bab
 */
PartogramFHRComponentWF.prototype.getBabyDynamicLabels = function(babyArray, length) {
	var index = 0;
	var labelArray = [];
	while (index < length) {
		labelArray.push(babyArray[index].DYNAMIC_LABEL);
		index++;
	}
	return labelArray;
};

/**
 * This function gives the baby's plot lines in the format required by jqplot.
 * The Intermittent and Baseline data comes in reverse chronological order.
 * jqplot needs a null point to break a line. We need to break the line (FHR/Intermittent)
 * if there is change in the method. We deduce that there is a change in method by
 * the timestamps. If the previous timestamp was of the other method, then put a null point
 * in between.
 * @param jsonData {object}  : The json object representing the dynamic groups data
 * @return babyPlots {Array} : An array of baby data consumable by jqplot with null points inserted when measuring method changes
 */
PartogramFHRComponentWF.prototype.getPlotLines = function() {
	var babyPlots = [];
	var jsonData = this.getRecordData();
	var babyArray = jsonData.BABY;
	var babyCount = jsonData.CNT;
	var babyIndexMap = this.getBabyIndexMap(babyArray, babyCount);
	var INTERMITTENT = 0;
	var BASELINE = 1;
	var maxBabies = this.getMaxAllowedBabies();
	var EMPTY_SPACE = " ";
	var count = 0;
	//arranging the data to insert null points to show the breaks on jqplot.
	for (var i = 0; i < babyCount && i < maxBabies; i++) {
		var baby = [
			[],
			[]
		];
		var babyRecordData = babyArray[i];
		var bLen = babyRecordData.BASELINE_CNT;
		var iLen = babyRecordData.INTERMITTENT_CNT;
		var bData = babyRecordData.FHR_BASELINE;
		var iData = babyRecordData.FHR_INTERMITTENT;
		var babyData = [];
		//push intermittent data into the array
		for (count = 0; count < iLen; count++) {
			babyData.push([iData[count], INTERMITTENT]);
		}
		//push baseline data into the array
		for (count = 0; count < bLen; count++) {
			babyData.push([bData[count], BASELINE]);
		}
		//sort all the data in ascending order
		babyData.sort(function(dataPoint1, dataPoint2) {
			var date1 = PARTO_GRAPH_BASE.getLocalDateTime(dataPoint1[0].RESULT_DATE);
			var date2 = PARTO_GRAPH_BASE.getLocalDateTime(dataPoint2[0].RESULT_DATE);
			if (date1 <= date2) {
				return -1;
			}
			return 1;
		});
		var dataArrayLen = babyData.length;
		//if no data, continue
		if (dataArrayLen === 0) {
			babyPlots[babyIndexMap[babyRecordData.DYNAMIC_LABEL_ID]] = baby;
			continue;
		}
		//push the first data point
		var prevMethod = babyData[0][1];
		baby[prevMethod].push([PARTO_GRAPH_BASE.getLocalDateTime(babyData[0][0].RESULT_DATE), babyData[0][0].RESULT_VALUE]);
		//go through each point through the sorted data. put null data point when the measurement method changes
		for (count = 1; count < dataArrayLen; count++) {
			var dataPoint = babyData[count][0];
			var currentMethod = babyData[count][1];
			if (currentMethod !== prevMethod) {
				baby[prevMethod].push([PARTO_GRAPH_BASE.getLocalDateTime(dataPoint.RESULT_DATE), null]);
			}
			baby[currentMethod].push([PARTO_GRAPH_BASE.getLocalDateTime(dataPoint.RESULT_DATE), dataPoint.RESULT_VALUE]);
			prevMethod = currentMethod;
		}
		//assign the final data to the result array to be returned 
		babyPlots[babyIndexMap[babyRecordData.DYNAMIC_LABEL_ID]] = baby;
		//get unit
		if (!this.FHR_UNIT) {
			var displayValue = babyData[0][0].RESULT_DISPLAY;
			/* [0]- value [1]- unit*/
			var unit = displayValue.split(EMPTY_SPACE)[1];
			this.FHR_UNIT = (unit) ? unit : "";
		}
	}

	//to let the graph render, as jqplot doesn't render the graph if the 1st element in the series doesn't have any data.
	if (babyPlots[0][0].length === 0) {
		babyPlots[0][0].push([null]);
	}
	return babyPlots;
};

/**
 * Comparator function for sorting the babies in lexicographic order. 
 * If they are setup with same name, use dynamic_label_id.
 * @param point1  : Baby A to be compared
 * @param point2  : Baby B to be compared
 * @return sortResult {Integer}: The sorting result of two babies
 */
PartogramFHRComponentWF.prototype.babySorter = function(babyA, babyB) {
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
 * Creates jqplot graph options. The dependencies are injected for future flexibility.
 * @param startDt {Integer} : The start date(in milliseconds) of the plot for X Axis
 * @param endDt {Integer} : The end date(in milliseconds) of the plot for X Axis
 * @param hourticks {Array} : An array of values of time in milliseconds where the hour ticks will be drawn, the major grid lines
 * @param quarterticks {Array} : An array of values of time in milliseconds where the minutes ticks will be drawn, the minor grid lines
 * @param seriesObjs{Array} : An array of json objects representing the series in baseline, intermittent fashion for all allowed babies
 * @param canvasOverlayObjs {Array} : An array of canvas overlay objects
 * @return options {Object} : A options javascript object representing jqplot graph options
 */
PartogramFHRComponentWF.prototype.getGraphOptions = function(startDt, endDt, hourticks, quarterticks, seriesObjs, canvasOverlayObjs) {
	return {
		graphName: "partogram-fhr-graph-" + this.getStyles().getId(),
		series: seriesObjs,
		seriesDefaults: {
			breakOnNull: true,
			showMarker: false,
			pointLabels: {
				show: false
			},
			hoverable: false,
			highlightMouseDown: true,
			shadow: false
		},
		axes: {
			yaxis: {
				min: 60,
				max: 210,
				tickInterval: 10,
				tickOptions: {
					showMark: false,
					showLabel: true,
					formatString: "%d"
				}
			},
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
			}
		},
		axesDefaults: {
			tickOptions: {
				textColor: PARTO_GRAPH_BASE.COLOR_DARK_GRAY,
				fontSize: '11px'
			}
		},
		canvasOverlay: {
			show: true,
			objects: canvasOverlayObjs
		},
		grid: {
			drawGridLines: true,
			hoverable: false,
			shadow: false,
			background: PARTO_GRAPH_BASE.GRID_BACKGROUND_COLOR,
			gridLineWidth: 1,
			gridLineColor: PARTO_GRAPH_BASE.MINOR_GRID_LINE_COLOR,
			drawBorder: false
		},
		cursor: {
			showTooltip: false,
			show: false
		}
	};
};

/**
 * A wrapper function to get the HTML for the component.
 * @return ComponentHTML {String}: The HTML of the component
 */
PartogramFHRComponentWF.prototype.getComponentHTML = function() {
	var compID = this.getStyles().getContentId();
	var imageFolder = this.getImageFolderPath();
	var compHTML = '<div class="partogram-container">';
	compHTML += '<div class="partogram-container-col-1">';
	compHTML += this.getLegendHTML();
	compHTML += '</div>';
	compHTML += '<div class="partogram-container-col-2">';
	compHTML += PARTO_GRAPH_BASE.createTopBar(imageFolder, "GRAPH");
	compHTML += '<div id="partogram-fhr-graph-container' + compID + '" style="overflow-x:hidden"><div id="partogram-fhr-graph-' + compID + '" class="partogramGraphDiv partoGraphDivFhr"></div></div>';
	compHTML += "</div>";
	compHTML += "</div>";
	return compHTML;
};

/**
 * This functions returns the HTML for the legend of this component.
 * @return LegendHTML {String}: The HTML for the Legend
 */
PartogramFHRComponentWF.prototype.getLegendHTML = function() {
	var layoutHTML = "";
	var jsonData = this.getRecordData();
	var heartRate = jsonData.FHRINTERMITTENT_EVENT_CODE_NAME;
	var heartRateBaseline = jsonData.FHRBASELINE_EVENT_CODE_NAME;
	var compID = this.getComponentId();
	var maxBabies = this.getMaxAllowedBabies();
	var imageRoot = 'partoFHRBaby';
	var babyCount = jsonData.CNT;
	layoutHTML += '<div class="partogram-legend" id="partogram-legend-' + compID + '">';
	for (var i = 0; i < babyCount && i < maxBabies; i++) {
		var babyi = jsonData.BABY[i];
		var toggleImageSrcONClass = 'partoFHRSprite ' + imageRoot + (i + 1) + '-ON';
		var baselineImageONClass = 'partoFHRSprite ' + imageRoot + (i + 1) + 'Base-ON';
		var intermittentImageONClass = 'partoFHRSprite ' + imageRoot + (i + 1) + 'Inter-ON';
		layoutHTML += '<div class="partogram-fhr-legend-item">';
		layoutHTML += '<div>';
		layoutHTML += '<div class="partogram-fhr-legend-header-img">';
		layoutHTML += '<div id="babyToggle' + compID + babyi.DYNAMIC_LABEL_ID + '" class="' + toggleImageSrcONClass + '"></div>';
		layoutHTML += '</div>';
		layoutHTML += '<div title="' + babyi.DYNAMIC_LABEL + '" class="partogram-fhr-legend-header-item-name"><span class="partogram-fhr-legend-item-baby-name">' + babyi.DYNAMIC_LABEL + '</span></div>';
		layoutHTML += '</div>'; //header
		layoutHTML += '<div class="partogram-fhr-legend-item-baby-heartrate-header">';
		if (this.groupNameMap.WF_PARTO_FHR_FETAL_HR[0]) {
			layoutHTML += '<div class="partogram-fhr-legend-item-baby-heartrate-unit">';
			layoutHTML += '<div class="partogram-fhr-legend-heartrate-img">';
			layoutHTML += '<div id="babyIntermittent' + compID + babyi.DYNAMIC_LABEL_ID + '" class="' + intermittentImageONClass + '"></div>';
			layoutHTML += '</div>';
			layoutHTML += '<div title="' + heartRate + '" class="partogram-fhr-legend-item-baby-heartrate"><span>' + heartRate + '</span></div>';
			layoutHTML += '</div>';
		}
		if (this.groupNameMap.WF_PARTO_FHR_FETAL_HR_BASELINE[0]) {
			layoutHTML += '<div class="partogram-fhr-legend-item-baby-heartrate-unit">';
			layoutHTML += '<div class="partogram-fhr-legend-heartrate-img">';
			layoutHTML += '<div id="babyBaseline' + compID + babyi.DYNAMIC_LABEL_ID + '" class="' + baselineImageONClass + '"></div>';
			layoutHTML += '</div>';
			layoutHTML += '<div title="' + heartRateBaseline + '" class="partogram-fhr-legend-item-baby-heartrate"><span>' + heartRateBaseline + '</span></div>';
			layoutHTML += '</div>';
		}
		layoutHTML += '</div>'; //baby header
		layoutHTML += '</div>'; //item
		if (i + 1 !== babyCount && i + 1 !== maxBabies) {
			layoutHTML += '<hr class="partoFHRHorizontalRuler" />';
		}
	}
	layoutHTML += '</div>'; //legend
	return layoutHTML;
};

/**
 * This function register all the events for the component.
 */
PartogramFHRComponentWF.prototype.registerEvents = function() {
	var component = this;
	var jsonData = this.getRecordData();
	var compID = this.getComponentId();
	var babyArray = jsonData.BABY;
	var maxBabies = this.getMaxAllowedBabies();
	var babyCount = jsonData.CNT;

	function toggleEventHandler(index, dynID, dynLabel) {
		return function(event) {
			var jqplotGraph = component.getPlot();
			var current = jqplotGraph.series[index * 2].show;
			if (current) {
				$(event.target).removeClass('partoFHRBaby' + (index + 1) + '-ON').addClass('partoFHRBaby-OFF');
				$('#babyBaseline' + compID + dynID).removeClass('partoFHRBaby' + (index + 1) + 'Base-ON').addClass('partoFHRBase-OFF');
				$('#babyIntermittent' + compID + dynID).removeClass('partoFHRBaby' + (index + 1) + 'Inter-ON').addClass('partoFHRInter-OFF');

			} else {
				$(event.target).removeClass('partoFHRBaby-OFF').addClass('partoFHRBaby' + (index + 1) + '-ON');
				$('#babyBaseline' + compID + dynID).removeClass('partoFHRBase-OFF').addClass('partoFHRBaby' + (index + 1) + 'Base-ON');
				$('#babyIntermittent' + compID + dynID).removeClass('partoFHRInter-OFF').addClass('partoFHRBaby' + (index + 1) + 'Inter-ON');
			}

			jqplotGraph.series[index * 2].show = !current;
			jqplotGraph.series[index * 2 + 1].show = !current;
			jqplotGraph.redraw();
			PARTO_GRAPH_BASE.setGraphsCommonCSS();
			var babyToggleTimer = new CapabilityTimer("CAP:MPG.PARTOGRAMFHR.O2 - legend toggle", component.criterion.category_mean);
			if (babyToggleTimer) {
				babyToggleTimer.addMetaData('rtms.legacy.metadata.1', dynLabel);
				babyToggleTimer.capture();
			}
		};
	}
	for (var i = 0; i < babyCount && i < maxBabies; i++) {
		$('#babyToggle' + compID + babyArray[i].DYNAMIC_LABEL_ID).click(toggleEventHandler(i, babyArray[i].DYNAMIC_LABEL_ID, babyArray[i].DYNAMIC_LABEL));
	}
};

/**
 * This function returns the callback for tooltip for data points
 */
PartogramFHRComponentWF.prototype.graphToolTipContent = function() {
	var component = this;
	/**
	 * @param seriesIndex - the index on the series which the mouse hover was triggered
	 * @param pointIndex -  the nth datapoint in the selected series array
	 * @param plot - the JQplot graph
	 * 
	 */
	var tooltipFunction = function(str, seriesIndex, pointIndex, plot) {
		var data = plot.data[seriesIndex][pointIndex];
		/*
		 * data[0] - dateTime, 
		 * data[1] - Result value
		 */
		var time = data[0];
		PARTO_GRAPH_BASE.setToolTipLocation(plot, seriesIndex, pointIndex);
		var dataPopulated = PARTO_GRAPH_BASE.isHoverDataPopulated(component.HOVER_KEY);
		//load the map for first hover
		if (!dataPopulated) {
			component.populateHoverData();
		}
		return PARTO_GRAPH_BASE.getHoverHTML(component.HOVER_KEY, time);
	};

	return tooltipFunction;
};

/**
 * A method to populate data for hover over datapoints on the graph.
 */
PartogramFHRComponentWF.prototype.populateHoverData = function() {
	var jsonData = this.getRecordData();
	var self = this;
	var intermittentKey = jsonData.FHRINTERMITTENT_EVENT_CODE_NAME;
	var baselineKey = jsonData.FHRBASELINE_EVENT_CODE_NAME;
	var babyCount = jsonData.CNT;
	var maxBabies = this.getMaxAllowedBabies();
	babyCount = Math.min(babyCount, maxBabies);
	var i, j, value, timestamp;
	//buildValue creates the html to be displayed in the value column of the hover
	var buildValue = function(fhrPoint, dynLabel) {
		var resultValue = fhrPoint.RESULT_VALUE;
		var normalcyClass = PARTO_GRAPH_BASE.getNormalcyClass(fhrPoint.RESULT_NORMALCY);
		var modifiedInd = fhrPoint.RESULT_MODIFIED_IND;
		var valueHTML = '';
		valueHTML += "<span class='parto-graph-wf-unit'>[" + dynLabel + "]</span>";
		valueHTML += PARTO_GRAPH_BASE.getResultIndHTML(resultValue, self.FHR_UNIT, normalcyClass, modifiedInd);
		return valueHTML;
	};

	for (i = 0; i < babyCount; i++) {
		var babyData = jsonData.BABY[i];
		var dynLabel = jsonData.BABY[i].DYNAMIC_LABEL;

		var intermittentIcon = '<div class="partoFHRSprite partoFHRBaby' + (i + 1) + 'Inter-ON"></div>';
		var intermittentCnt = babyData.INTERMITTENT_CNT;
		var intermittentData = babyData.FHR_INTERMITTENT;

		var baselineIcon = '<div class="partoFHRSprite partoFHRBaby' + (i + 1) + 'Base-ON"></div>';
		var baselineCnt = babyData.BASELINE_CNT;
		var baselineData = babyData.FHR_BASELINE;

		for (j = 0; j < intermittentCnt; j++) {
			var intermittentPoint = intermittentData[j];
			value = buildValue(intermittentPoint, dynLabel);
			timestamp = PARTO_GRAPH_BASE.getLocalDateTime(intermittentPoint.RESULT_DATE);
			PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, timestamp, intermittentIcon, intermittentKey, value);
		}

		for (j = 0; j < baselineCnt; j++) {
			var baselinePoint = baselineData[j];
			value = buildValue(baselinePoint, dynLabel);
			timestamp = PARTO_GRAPH_BASE.getLocalDateTime(baselinePoint.RESULT_DATE);
			PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, timestamp, baselineIcon, baselineKey, value);
		}
	}
};


/**
 * This function returns the Shaded Overlay Canvas Object for the jqplot. 110bpm-160bpm is the reference range for the heart rate.
 * @return overlayObject {Object}: The canvas overlay object for the jqplot
 */
PartogramFHRComponentWF.prototype.getShadedOverlay = function() {
	return {
		rectangle: {
			ymin: 110,
			xminOffset: "0px",
			xmaxOffset: "0px",
			ymax: 160,
			color: "rgba(221, 221, 221, 0.2)",
			showTooltip: false
		}
	};
};

/**
 * This function returns the Series Objects for the jqplot
 * @return seriesObject {Array}: The series object representing the lines for the jqplot
 */
PartogramFHRComponentWF.prototype.getSeriesObjects = function() {
	var highlighterOption = {
		tooltipContentEditor: this.graphToolTipContent(),
		showTooltip: true,
		tooltipLocation: "n"
	};
	var imageFolderPath = this.getImageFolderPath();
	var baseImageBaby1 = new Image();
	baseImageBaby1.src = imageFolderPath + 'partoFHRBaby1Base-ON.png';
	var baseImageBaby2 = new Image();
	baseImageBaby2.src = imageFolderPath + 'partoFHRBaby2Base-ON.png';
	var baseImageBaby3 = new Image();
	baseImageBaby3.src = imageFolderPath + 'partoFHRBaby3Base-ON.png';

	var seriesBaseline = function(index, colorVal, image) {
		return {
			label: "baby" + index + "_Baseline",
			markerRenderer: $.jqplot.ImageMarkerRenderer,
			markerOptions: {
				show: true,
				imageElement: image,
				xOffset: -5.5,
				yOffset: -5,
				shadow: false
			},
			showLine: true,
			xaxis: "x2axis",
			yaxis: "yaxis",
			lineWidth: 1,
			color: colorVal,
			highlighter: highlighterOption
		};
	};
	var seriesIntermittent = function(index, colorVal) {
		return {
			label: "baby" + index + "_Intermittent",
			markerOptions: {
				show: true,
				style: "filledCircle",
				shadow: false
			},
			showLine: false,
			x2axis: "x2axis",
			yaxis: "yaxis",
			lineWidth: 1,
			color: colorVal,
			highlighter: highlighterOption
		};
	};
	var seriesArray = [];
	var jsonData = this.getRecordData();
	var maxBabies = this.getMaxAllowedBabies();
	var seriesColors = ["#5E34B1", "#008836", "#FF3399"];
	var baseImages = [baseImageBaby1, baseImageBaby2, baseImageBaby3];
	var babyCount = jsonData.CNT;
	for (var i = 0; i < babyCount && i < maxBabies; i++) {
		seriesArray.push(seriesIntermittent(i + 1, seriesColors[i]));
		seriesArray.push(seriesBaseline(i + 1, seriesColors[i], baseImages[i]));
	}
	return seriesArray;
};
/**
 * Generates the options object for the jqplot.
 */
PartogramFHRComponentWF.prototype.generateGraphOptions = function() {
	var canvasOverlayObjs = [];
	var endDt = PARTO_GRAPH_BASE.getEndDate();
	canvasOverlayObjs.push(this.getShadedOverlay());
	canvasOverlayObjs = canvasOverlayObjs.concat(PARTO_GRAPH_BASE.getMajorGridLines());
	canvasOverlayObjs = canvasOverlayObjs.concat(PARTO_GRAPH_BASE.getOxytocinVerticalLines());
	canvasOverlayObjs = canvasOverlayObjs.concat(PARTO_GRAPH_BASE.getEpiduralVerticalLines());
	//check if current end date is near the last load time. If it is, only then show the today vertical bar
	if (endDt >= PARTO_GRAPH_BASE.getPartogramLastLoadTime()) {
		canvasOverlayObjs = canvasOverlayObjs.concat(PARTO_GRAPH_BASE.getTodayVerticalBar());
	}
	var hourticks = PARTO_GRAPH_BASE.getHourTicks();
	var quarterticks = PARTO_GRAPH_BASE.getQuarterTicks();
	var seriesObjs = this.getSeriesObjects();
	var options = this.getGraphOptions(PARTO_GRAPH_BASE.getStartDate(), endDt, hourticks, quarterticks, seriesObjs, canvasOverlayObjs);
	return options;
};

/**
 * A wrapper function which generates the jqplot graph from the json data
 */
PartogramFHRComponentWF.prototype.plotGraph = function() {
	var INTERMITTENT = 0;
	var BASELINE = 1;
	var contentID = this.getStyles().getContentId();
	//important to append the container HTML before preparing the jqplot data, as the width of the container is used to draw the last refreshed time bar
	var componentHTML = this.getComponentHTML();
	jQuery("#" + contentID).append(componentHTML);
	var options = this.generateGraphOptions();
	var babyPlots = this.getPlotLines();
	//store the baby plots, will be used later for hover
	this.babyPlots = babyPlots;
	var jqplotData = [];
	var babyPlotLen = babyPlots.length;
	for (var babyi = 0; babyi < babyPlotLen; babyi++) {
		jqplotData.push(babyPlots[babyi][INTERMITTENT]);
		jqplotData.push(babyPlots[babyi][BASELINE]);
	}
	var widthOffset = PARTO_GRAPH_BASE.getWidthOffsetForGraph();
	var currentWidth = parseInt($('#partogram-fhr-graph-' + contentID).css('width'), 10);
	$('#partogram-fhr-graph-' + contentID).css('width', currentWidth - widthOffset);
	var plot = $.jqplot("partogram-fhr-graph-" + contentID, jqplotData, options);
	this.setPlot(plot);
	this.setGraphElement(document.getElementById('partogram-fhr-graph-' + contentID));
	PARTO_GRAPH_BASE.setGraphsCommonCSS();
	if (!PARTO_GRAPH_BASE.topBarGraphHTML) {
		PARTO_GRAPH_BASE.refreshTopbar(contentID);
	}
};

/**
 * Renders the Partogram FHR component visuals. This method will be called after Partogram Fhr has been initialized and setup.
 *
 * @param recordData  - has the information about the dynamic group's FHR data of a patient.
 */
PartogramFHRComponentWF.prototype.renderComponent = function(recordData) {
	var timerRenderComponent = MP_Util.CreateTimer(this.getComponentRenderTimerName(), this.getCriterion().category_mean);
	var renderingCAPTimer = new CapabilityTimer("CAP:MPG.PARTOGRAMFHR.O2 - rendering component", this.getCriterion().category_mean);
	if (renderingCAPTimer) {
		renderingCAPTimer.capture();
	}
	try {
		var basei18n = i18n.discernabu.partogrambaseutil_o2;
		var noDataHTML = "<span class='res-none'>" + basei18n.NO_RESULTS_FOUND + "</span>";
		this.loadTimer.addMetaData("component.resultcount", this.getResultsCount(recordData));
		if (recordData.CNT > 0) {
			PARTO_GRAPH_BASE.addSubscriber(this);
			this.finalizeComponent("", MP_Util.CreateTitleText(this, ""));
			recordData.BABY.sort(this.babySorter);
			//remove colons from end of event code names
			recordData.FHRINTERMITTENT_EVENT_CODE_NAME = PARTO_GRAPH_BASE.removeColonEndOfString(recordData.FHRINTERMITTENT_EVENT_CODE_NAME);
			recordData.FHRBASELINE_EVENT_CODE_NAME = PARTO_GRAPH_BASE.removeColonEndOfString(recordData.FHRBASELINE_EVENT_CODE_NAME);
			this.setRecordData(recordData);
			this.plotGraph();
			PARTO_GRAPH_BASE.addTimeScaleButtons(this.getStyles().getId());
			this.registerEvents();
		} else {
			this.finalizeComponent(noDataHTML, MP_Util.CreateTitleText(this, ""));
		}
		$('#' + this.getStyles().getId()).css('margin-bottom', PARTO_GRAPH_BASE.getComponentBottomPadding());
	} catch (err) {
		MP_Util.LogJSError(err, this, "partogramfhr.js", "RenderComponent");
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
