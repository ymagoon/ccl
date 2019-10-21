function PartogramContractComponentWFStyle() {
	this.initByNamespace("parto-contract-wf");
}
PartogramContractComponentWFStyle.prototype = new ComponentStyle();
PartogramContractComponentWFStyle.prototype.constructor = ComponentStyle;

/**
 * The Partogram Contractions component will retrieve the clinical information about the contraction frequency/intensity of the patient
 *
 *  @param criterion {Criterion} - The Criterion object which contains information needed to render the component.
 */
function PartogramContractComponentWF(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new PartogramContractComponentWFStyle());
	this.setComponentLoadTimerName("USR:MPG.PARTOGRAMCONTRACT.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.PARTOGRAMCONTRACT.O2 - render component");
	this.setImageFolderPath(criterion.static_content + '/images/');
	this.NOMEN_MAPPING = {};
	this.setRefreshEnabled(false);
	// Flag for resource required
	this.setResourceRequired(true);
	this.groupNameMap = {};
	this.contractionI18n = i18n.discernabu.partogramcontract_o2;
	this.strongIntensityLabel = this.contractionI18n.STRONG;
	this.weakIntensityLabel = this.contractionI18n.MILD;
	this.notPalpableIntensityLabel = this.contractionI18n.NOT_PALPABLE;
	this.moderateIntensityLabel = this.contractionI18n.MODERATE;
	this.loadTimer = null;
}
PartogramContractComponentWF.prototype = new MPageComponent();
PartogramContractComponentWF.prototype.constructor = MPageComponent;
MP_Util.setObjectDefinitionMapping("WF_PARTO_CONTRACT", PartogramContractComponentWF);
PartogramContractComponentWF.prototype.HOVER_KEY = "CONTRACTIONS";
/**
 * @method Returns the image folder path
 */

PartogramContractComponentWF.prototype.getImageFolderPath = function() {
	return this.imageFolderPath;
};
/**
 * @method Stores the path to where images are stored in the static content
 *         folder.
 */
PartogramContractComponentWF.prototype.setImageFolderPath = function(path) {
	this.imageFolderPath = path;
};

/**
 * @method gets the reference to the recordData object
 * @return the reference to recordData object
 */
PartogramContractComponentWF.prototype.getRecordData = function() {
	return this.recordData;
};

/**
 * @method Store a reference to the recordData object
 * @param {object} plot - A reference to the recordData object
 */
PartogramContractComponentWF.prototype.setRecordData = function(data) {
	this.recordData = data;
};

/**
 * @method gets the reference to the jqplot object
 * 
 * @return the reference to the JqPlot graph
 */
PartogramContractComponentWF.prototype.getPlot = function() {
	return this.plot;
};

/**
 * @method Store a reference to the jqplot object
 * @param {object} plot - A reference to the jqplot object
 */
PartogramContractComponentWF.prototype.setPlot = function(plot) {
	this.plot = plot;
};


/**
 * @method gets the reference to the graph element
 * @return the reference to graph element
 */
PartogramContractComponentWF.prototype.getGraphElement = function() {
	return this.graphElement;
};

/**
 * @method Store a reference to the graph element
 * @param {HTML Element} el - A reference to the graph element
 */
PartogramContractComponentWF.prototype.setGraphElement = function(el) {
	this.graphElement = el;
};

/**
 * @method Adds filters for Strong, Moderate, Weak and Not Palpable intensity nomenclature
 * These are required to map the legend colors correctly to the documented values, as 
 * each client can have different configurations at their side. For ex., rather than using
 * Strong, they might be using "+8", Moderate as "+6" and so on.
 * Also these filters are one-to-many so Strong can be mapped to "+8", "+9" and so on.
 */
PartogramContractComponentWF.prototype.loadFilterMappings = function() {
	this.addFilterMappingObject("WF_PARTO_CONTRACT_STR_NOMEN", {
		setFunction: this.setStrongIntensityNomen,
		type: "ARRAY",
		field: "NOMEN"
	});

	this.addFilterMappingObject("WF_PARTO_CONTRACT_MOD_NOMEN", {
		setFunction: this.setModerateIntensityNomen,
		type: "ARRAY",
		field: "NOMEN"
	});

	this.addFilterMappingObject("WF_PARTO_CONTRACT_WK_NOMEN", {
		setFunction: this.setWeakIntensityNomen,
		type: "ARRAY",
		field: "NOMEN"
	});

	this.addFilterMappingObject("WF_PARTO_CONTRACT_NP_NOMEN", {
		setFunction: this.setNotPalpIntensityNomen,
		type: "ARRAY",
		field: "NOMEN"
	});

	this.addFilterMappingObject("WF_PARTO_CONTRACT_STR_LABEL", {
		setFunction: this.setStrongIntensityLabel,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("WF_PARTO_CONTRACT_NP_LABEL", {
		setFunction: this.setNotPalpIntensityLabel,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("WF_PARTO_CONTRACT_WK_LABEL", {
		setFunction: this.setWeakIntensityLabel,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("WF_PARTO_CONTRACT_MOD_LABEL", {
		setFunction: this.setModerateIntensityLabel,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
};


/**
 * @method Sets the Strong intensity nomenclature name.
 */
PartogramContractComponentWF.prototype.setStrongIntensityLabel = function(value) {
	this.strongIntensityLabel = value;
};

/**
 * @method Sets the Weak intensity nomenclature name
 */
PartogramContractComponentWF.prototype.setWeakIntensityLabel = function(value) {
	this.weakIntensityLabel = value;
};
/**
 * @method Sets the Moderate intensity nomenclature name
 */
PartogramContractComponentWF.prototype.setModerateIntensityLabel = function(value) {
	this.moderateIntensityLabel = value;
};
/**
 * @method Sets the Not Palpable intensity nomenclature name
 */
PartogramContractComponentWF.prototype.setNotPalpIntensityLabel = function(value) {
	this.notPalpableIntensityLabel = value;
};

/**
 * @method Sets the Strong intensity nomenclature array
 */
PartogramContractComponentWF.prototype.setStrongIntensityNomen = function(value) {
	this.NOMEN_MAPPING.STRONG = value;
};

/**
 * @method Sets the Moderate intensity nomenclature array
 */
PartogramContractComponentWF.prototype.setModerateIntensityNomen = function(value) {
	this.NOMEN_MAPPING.MODERATE = value;
};

/**
 * @method Sets the Weak intensity nomenclature array
 */
PartogramContractComponentWF.prototype.setWeakIntensityNomen = function(value) {
	this.NOMEN_MAPPING.WEAK = value;
};

/**
 * @method Sets the Not Palpable intensity nomenclature array
 */
PartogramContractComponentWF.prototype.setNotPalpIntensityNomen = function(value) {
	this.NOMEN_MAPPING.NOT_PALP = value;
};

PartogramContractComponentWF.prototype.RetrieveRequiredResources = function() {
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
 * @method It creates the necessary parameter array for the data acquisition and makes the
 * necessary script call to retrieve the contractions data
 */
PartogramContractComponentWF.prototype.retrieveComponentData = function() {
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
		//display data if we have both frequency and intensity DTAs configured in bedrock and if atleast one nomenclature for intensity has been mapped
		if (groupsLength === 2 && !jQuery.isEmptyObject(this.NOMEN_MAPPING)) {
			var sendAr = [],
				i;
			var partogramInfoSR = MP_Resources.getSharedResource("partogramInfo");
			var partogramStartDate = partogramInfoSR.getResourceData().getPartogramStartDate();
			partogramStartDate = MP_Util.CreateDateParameter(partogramStartDate);

			sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.ppr_cd + ".0", criterion.encntr_id + ".0");
			// Map of Bedrock filter name (group name) to event code value initialized to 0. The order of filters in this map should be same as the order of filters defined in bedrock.

			var groupNames = ["WF_PARTO_CONTRACT_FREQUENCY", "WF_PARTO_CONTRACT_INTENSITY"];
			//initialize the eveent code value for each filter
			for (i = 0; i < groupNames.length; i++) {
				this.groupNameMap[groupNames[i]] = [0];
			}
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
			scriptRequest.setProgramName("MP_GET_PARTOGRAM_CONTRACT");
			scriptRequest.setParameterArray(sendAr);
			scriptRequest.setComponent(this);
			scriptRequest.setLoadTimer(this.loadTimer);
			scriptRequest.setRenderTimer(renderTimer);
			scriptRequest.performRequest();
		} else {
			// if event codes are not mapped, skip script call and display error message
			var noEventCodeMappedMessage = "<span class='res-none'> " + i18n.discernabu.partogrambaseutil_o2.NOT_CONFIGURED_BEDROCK_ERR + "</span>";
			this.finalizeComponent(noEventCodeMappedMessage, "");
		}
	} catch (err) {
		MP_Util.LogJSError(err, this, "partogramcontract.js", "retrieveComponentData");
	}
};

/**
 * @method A helper method to check if a particular nomenclature id is present in the intensity array
 * @param intensityArray : An array having a list of nomenclature ids returned from bedrock mappings
 * @param value: A particular nomenclature ID to check against the array.
 */
PartogramContractComponentWF.prototype.isPartOfIntensity = function(intensityArr, val) {
	var len = intensityArr.length;
	for (var i = 0; i < len; i++) {
		if (intensityArr[i].nomen_id === val) {
			return true;
		}
	}
	return false;
};

/**
 * @method This function filters the data points into appropriate buckets described by the bedrock mappings.
 * @return An array of length 5 representing "Strong", "Moderate", "Weak", "Not Palpable" and "No Intensity Documented"
 * datapoints. 
 */
PartogramContractComponentWF.prototype.getPlotLines = function() {
	var recordData = this.getRecordData();
	var frequencyKey = recordData.FREQUENCY_EVENT_CODE_NAME;
	var intensityKey = recordData.INTENSITY_EVENT_CODE_NAME;
	var plotLines = [
		[],
		[],
		[],
		[],
		[]
	];
	var dataLen = recordData.CNT;
	var i;
	var stateMap = {
		STRONG: 0,
		MODERATE: 1,
		WEAK: 2,
		NOT_PALP: 3,
		NO_INTEN_DOC: 4
	};

	var stateNameMap = {
		STRONG: this.strongIntensityLabel,
		MODERATE: this.moderateIntensityLabel,
		WEAK: this.weakIntensityLabel,
		NOT_PALP: this.notPalpableIntensityLabel,
		NO_INTEN_DOC: this.contractionI18n.NO_INTENSITY_DOC
	};

	var stateImageMap = {
		STRONG: "partoContractSprite partoContractStrong",
		MODERATE: "partoContractSprite partoContractMod",
		WEAK: "partoContractSprite partoContractWeak",
		NOT_PALP: "partoContractSprite partoContractNotPalp",
		NO_INTEN_DOC: "partoContractSprite partoContractNoInten"
	};

	var buildFrequencyValue = function(contractionsPoint) {
		var resultValue = contractionsPoint.FREQUENCY;
		var NO_UNIT = '';
		var normalcyClass = PARTO_GRAPH_BASE.getNormalcyClass(contractionsPoint.RESULT_NORMALCY);
		var modifiedInd = contractionsPoint.RESULT_MODIFIED_IND_FREQ;
		return PARTO_GRAPH_BASE.getResultIndHTML(resultValue, NO_UNIT, normalcyClass, modifiedInd);
	};

	var buildIntensityValue = function(contractionsPoint, intensityName) {
		var resultValue = intensityName;
		var NO_UNIT = '';
		var normalcyClass = PARTO_GRAPH_BASE.getNormalcyClass(contractionsPoint.RESULT_NORMALCY);
		var modifiedInd = contractionsPoint.RESULT_MODIFIED_IND_INTEN;
		return PARTO_GRAPH_BASE.getResultIndHTML(resultValue, NO_UNIT, normalcyClass, modifiedInd);
	};

	PARTO_GRAPH_BASE.clearHoverMap(this.HOVER_KEY);

	recordData.CONTRACTION.sort(function(a, b) {
		return new Date(a.RESULT_DATE) - new Date(b.RESULT_DATE);
	});
	var intensityHoverValue = '';
	var imageHTML = '';
	for (i = 0; i < dataLen; i++) {
		var contraction = recordData.CONTRACTION[i];

		// There will be no point plotted on the graph if the intensity is charted but frequency is not.
		if (contraction.FREQUENCY && contraction.FREQUENCY.length > 0) {
			var frequencyVal = parseInt(contraction.FREQUENCY, 10);
			//The intensity will be of the format "<text>;<nomenclature ID>"
			var arr = contraction.INTENSITY.split(";");
			var timestamp = PARTO_GRAPH_BASE.getLocalDateTime(contraction.RESULT_DATE);
			var frequencyHoverValue = buildFrequencyValue(contraction);
			if (arr.length < 2) {
				plotLines[stateMap.NO_INTEN_DOC].push([timestamp, frequencyVal]);
				PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, timestamp, '', frequencyKey, frequencyHoverValue);
				continue;
			}
			var nomenID = parseInt($.trim(arr[1]),10);

			//check in which bucket the current data point falls into.
			if (this.NOMEN_MAPPING.STRONG) {
				if (this.isPartOfIntensity(this.NOMEN_MAPPING.STRONG, nomenID)) {
					intensityHoverValue = buildIntensityValue(contraction, stateNameMap.STRONG);
					imageHTML = '<div class="' + stateImageMap.STRONG + '"><div>';
					plotLines[stateMap.STRONG].push([timestamp, frequencyVal]);
					PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, timestamp, '', frequencyKey, frequencyHoverValue);
					PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, timestamp, imageHTML, intensityKey, intensityHoverValue);
				}
			}
			if (this.NOMEN_MAPPING.MODERATE) {
				if (this.isPartOfIntensity(this.NOMEN_MAPPING.MODERATE, nomenID)) {
					intensityHoverValue = buildIntensityValue(contraction, stateNameMap.MODERATE);
					imageHTML = '<div class="' + stateImageMap.MODERATE + '"><div>';
					plotLines[stateMap.MODERATE].push([timestamp, frequencyVal]);
					PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, timestamp, '', frequencyKey, frequencyHoverValue);
					PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, timestamp, imageHTML, intensityKey, intensityHoverValue);
				}
			}
			if (this.NOMEN_MAPPING.WEAK) {
				if (this.isPartOfIntensity(this.NOMEN_MAPPING.WEAK, nomenID)) {
					intensityHoverValue = buildIntensityValue(contraction, stateNameMap.WEAK);
					imageHTML = '<div class="' + stateImageMap.WEAK + '"><div>';
					plotLines[stateMap.WEAK].push([timestamp, frequencyVal]);
					PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, timestamp, '', frequencyKey, frequencyHoverValue);
					PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, timestamp, imageHTML, intensityKey, intensityHoverValue);
				}
			}
			if (this.NOMEN_MAPPING.NOT_PALP) {
				if (this.isPartOfIntensity(this.NOMEN_MAPPING.NOT_PALP, nomenID)) {
					intensityHoverValue = buildIntensityValue(contraction, stateNameMap.NOT_PALP);
					imageHTML = '<div class="' + stateImageMap.NOT_PALP + '"><div>';
					plotLines[stateMap.NOT_PALP].push([timestamp, frequencyVal]);
					PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, timestamp, '', frequencyKey, frequencyHoverValue);
					PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, timestamp, imageHTML, intensityKey, intensityHoverValue);
				}
			}
		}
	}
	//to let the graph render, as jqplot doesn't render the graph if the 1st element in the series doesn't have any data.
	if (plotLines[0].length === 0) {
		plotLines[0].push([null]);
	}
	return plotLines;
};

/**
 * A wrapper function to get the HTML for the component.
 * @return ComponentHTML {String}: The HTML of the component
 */
PartogramContractComponentWF.prototype.getComponentHTML = function() {
	var compID = this.getStyles().getContentId();
	var compHTML = '<div class="partogram-container">';
	compHTML += '<div class="partogram-container-col-1">';
	compHTML += this.getLegendHTML();
	compHTML += '</div>';
	compHTML += '<div class="partogram-container-col-2">';
	compHTML += PARTO_GRAPH_BASE.createTopBar(this.getImageFolderPath(), "GRAPH");
	compHTML += '<div id="partogram-contract-graph-container' + compID + '"><div id="partogram-contract-graph-' + compID + '" class="partogramGraphDiv"></div></div>';
	compHTML += "</div>";
	compHTML += "</div>";
	return compHTML;
};

/**
 * @method Returns the legend HTML for the component
 * @return legendHTML {String}: The HTML of the legend
 */
PartogramContractComponentWF.prototype.getLegendHTML = function() {
	var layoutHTML = '',
		imageClassName;
	var compID = this.getComponentId();
	layoutHTML += '<div class="partogram-legend" id="partogram-legend-' + compID + '">';
	var labelArr = [this.strongIntensityLabel, this.moderateIntensityLabel, this.weakIntensityLabel, this.notPalpableIntensityLabel, this.contractionI18n.NO_INTENSITY_DOC];
	var stateMap = ['STRONG', 'MODERATE', 'WEAK', 'NOT_PALP'];
	var imageClassNames = ['partoContractStrong', 'partoContractMod', 'partoContractWeak', 'partoContractNotPalp', 'partoContractNoInten'];
	for (var i = 0; i < 4; i++) {
		if (this.NOMEN_MAPPING[stateMap[i]]) {
			imageClassName = 'partoContractSprite ' + imageClassNames[i];
			layoutHTML += '<div class="partogram-contract-legend-item">';
			layoutHTML += '<div class="partogram-contract-legend-img">';
			layoutHTML += '<div class="' + imageClassName + '"></div>';
			layoutHTML += '</div>';
			layoutHTML += '<div title="' + labelArr[i] + '" class="partogram-contract-legend-item-name"><span>' + labelArr[i] + '</span></div>';
			layoutHTML += '</div>';
		}
	}
	// no intensity documented is displayed in any case
	imageClassName = 'partoContractSprite ' + imageClassNames[4];
	layoutHTML += '<div class="partogram-contract-legend-item">';
	layoutHTML += '<div class="partogram-contract-legend-img">';
	layoutHTML += '<div class="' + imageClassName + '"></div>';
	layoutHTML += '</div>';
	layoutHTML += '<div title="' + labelArr[4] + '" class="partogram-contract-legend-item-name"><span>' + labelArr[4] + '</span></div>';
	layoutHTML += '</div>';
	layoutHTML += '</div>'; //legend
	return layoutHTML;
};

/**
 * This function returns the callback for tooltip for data points
 */
PartogramContractComponentWF.prototype.graphToolTipContent = function() {
	var component = this;
	/**
	 * @param seriesIndex - the index on the series which the mouse hover was triggered
	 * @param pointIndex -  the nth data point in the selected series array
	 * @param plot - the JQplot graph
	 */
	var tooltipFunction = function(str, seriesIndex, pointIndex, plot) {
		PARTO_GRAPH_BASE.setToolTipLocation(plot, seriesIndex, pointIndex);
		/*
		 * data[0] - dateTime, 
		 * data[1] - Result value
		 */
		var data = plot.data[seriesIndex][pointIndex];
		var time = data[0];
		return PARTO_GRAPH_BASE.getHoverHTML(component.HOVER_KEY, time);
	};

	return tooltipFunction;
};


/**
 * @method A wrapper function which generates the jqplot graph from the json data
 */
PartogramContractComponentWF.prototype.plotGraph = function() {
	var contentID = this.getStyles().getContentId();
	//important to append the container HTML before preparing the jqplot data, as the width of the container is used to draw the last refreshed time bar
	var compHTML = this.getComponentHTML();
	jQuery("#" + contentID).append(compHTML);
	var contractPlots = this.getPlotLines();
	var options = this.generateGraphOptions();
	var widthOffset = PARTO_GRAPH_BASE.getWidthOffsetForGraph();
	var currentWidth = parseInt($('#partogram-contract-graph-' + contentID).css('width'), 10);
	$('#partogram-contract-graph-' + contentID).css('width', currentWidth - widthOffset);
	var plot = $.jqplot("partogram-contract-graph-" + contentID, contractPlots, options);
	this.setPlot(plot);
	this.setGraphElement(document.getElementById('partogram-contract-graph-' + contentID));
	PARTO_GRAPH_BASE.setGraphsCommonCSS();
	if (!PARTO_GRAPH_BASE.topBarGraphHTML) {
		PARTO_GRAPH_BASE.refreshTopbar(contentID);
	}
};

/**
 * @method Generates series object consumable by jqplot
 * @return series {Array}: An array of length 5 representing the lines on the graph
 */
PartogramContractComponentWF.prototype.getSeriesObjects = function() {
	var seriesArray = [];
	var contractNPImage = new Image();
	contractNPImage.src = this.getImageFolderPath() + 'partoContractNotPalp.png';
	var highlighterOption = {
		tooltipContentEditor: this.graphToolTipContent(),
		showTooltip: true,
		tooltipLocation: 'n'
	};
	var series = function(colorVal) {
		return {
			markerOptions: {
				show: true,
				style: "filledSquare",
				shadow: false
			},
			showLine: false,
			xaxis: "x2axis",
			yaxis: "yaxis",
			lineWidth: 1,
			color: colorVal,
			highlighter: highlighterOption
		};
	};

	var colorVals = ['#ca0813', '#fc6621', '#ffc20a', '#ffffff', '#505050'];
	//Strong
	seriesArray.push(series(colorVals[0]));
	//Moderate
	seriesArray.push(series(colorVals[1]));
	//Weak
	seriesArray.push(series(colorVals[2]));
	//Not Palpable is quite different than the other ones
	seriesArray.push({
		markerRenderer: $.jqplot.ImageMarkerRenderer,
		markerOptions: {
			show: true,
			imageElement: contractNPImage,
			xOffset: -5.5,
			yOffset: -5,
			shadow: false
		},
		showLine: false,
		xaxis: "x2axis",
		yaxis: "yaxis",
		color: '#505050',
		highlighter: highlighterOption
	});
	//No intensity documented.
	seriesArray.push(series(colorVals[4]));
	return seriesArray;
};

/**
 * @method Creates jqplot graph options. The dependencies are injected for future flexibility.
 * @param startDt {Integer} : The start date(in milliseconds) of the plot for X Axis
 * @param endDt {Integer} : The end date(in milliseconds) of the plot for X Axis
 * @param hourticks {Array} : An array of values of time in milliseconds where the hour ticks will be drawn, the major grid lines
 * @param quarterticks {Array} : An array of values of time in milliseconds where the minutes ticks will be drawn, the minor grid lines
 * @param seriesObjs{Array} : An array of json objects representing the lines.
 * @param canvasOverlayObjs {Array} : An array of canvas overlay objects
 * @return options {Object} : A options javascript object representing jqplot graph options
 */
PartogramContractComponentWF.prototype.getGraphOptions = function(startDt, endDt, hourticks, quarterticks, seriesObjs, canvasOverlayObjs) {
	return {
		graphName: "partogram-contract-graph-" + this.getStyles().getId(),
		series: seriesObjs,
		seriesDefaults: {
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
				min: 0,
				max: 10,
				tickInterval: 1,
				tickOptions: {
					showMark: false,
					showLabel: true,
					formatString: "%d"
				},
				//Adding a padding on the Y-Axis to show the 0th point fully at the bottom of the graph.
				ticks: (function() {
					var labels = [
						['-1', '']
					];
					for (var i = 0; i <= 10; i++) {
						labels.push(i + '');
					}
					return labels;
				})()
			},
			xaxis: {
				renderer: $.jqplot.DateAxisRenderer,
				show: true,
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
 * Generates the options object for the jqplot.
 */
PartogramContractComponentWF.prototype.generateGraphOptions = function() {
	var endDt = PARTO_GRAPH_BASE.getEndDate();
	var canvasOverlayObjs = [];
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
 * Renders the Partogram Contractions component visuals. This method will be called after Partogram Contractions has been initialized and setup.
 *
 * @param recordData  - has the information about the contraction frequency/intensity of the patient
 */
PartogramContractComponentWF.prototype.renderComponent = function(recordData) {
	var timerRenderComponent = MP_Util.CreateTimer(this.getComponentRenderTimerName(), this.getCriterion().category_mean);
	var renderingCAPTimer = new CapabilityTimer("CAP:MPG.PARTOGRAMCONTRACT.O2 - rendering component", this.getCriterion().category_mean);
	if (renderingCAPTimer) {
		renderingCAPTimer.capture();
	}
	try {
		var basei18n = i18n.discernabu.partogrambaseutil_o2;
		var noDataHTML = "<span class='res-none'>" + basei18n.NO_RESULTS_FOUND + "</span>";
		var resultsCount = recordData.CNT;
		this.loadTimer.addMetaData("component.resultcount", resultsCount);
		if (resultsCount > 0) {
			PARTO_GRAPH_BASE.addSubscriber(this);
			recordData.FREQUENCY_EVENT_CODE_NAME = PARTO_GRAPH_BASE.removeColonEndOfString(recordData.FREQUENCY_EVENT_CODE_NAME);
			recordData.INTENSITY_EVENT_CODE_NAME = PARTO_GRAPH_BASE.removeColonEndOfString(recordData.INTENSITY_EVENT_CODE_NAME);
			this.finalizeComponent("", MP_Util.CreateTitleText(this, ""));
			this.setRecordData(recordData);
			this.plotGraph();
			PARTO_GRAPH_BASE.addTimeScaleButtons(this.getStyles().getId());
		} else {
			this.finalizeComponent(noDataHTML, MP_Util.CreateTitleText(this, ""));
		}
		$('#' + this.getStyles().getId()).css('margin-bottom', PARTO_GRAPH_BASE.getComponentBottomPadding());
	} catch (err) {
		MP_Util.LogJSError(err, this, "partogramcontract.js", "RenderComponent");
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
