function PartogramVitalsComponentWFStyle() {
    this.initByNamespace("parto-vitals-wf");
}
PartogramVitalsComponentWFStyle.prototype = new ComponentStyle();
PartogramVitalsComponentWFStyle.prototype.constructor = ComponentStyle;

/**
 * The Partogram Vital Signs component will retrieve the clinical information about the Blood Pressure,
 * Maternal Heart Rate, SPO2, Respiratory Rate, Temperature(Oral and Axillary) of the patient
 *
 *  @param criterion {Criterion} - The Criterion object which contains information needed to render the component.
 */
function PartogramVitalsComponentWF(criterion) {
    this.setCriterion(criterion);
    this.setStyles(new PartogramVitalsComponentWFStyle());
    this.setComponentLoadTimerName("USR:MPG.PARTOGRAMVITALS.O2 - load component");
    this.setComponentRenderTimerName("ENG:MPG.PARTOGRAMVITALS.O2 - render component");
    this.setImageFolderPath(criterion.static_content + '/images/');
    this.m_BPGroup = null;
    this.groupNameMap = {};
    this.setRefreshEnabled(false);
    // Flag for resource required
    this.setResourceRequired(true);
    this.loadTimer = null;
}
PartogramVitalsComponentWF.prototype = new MPageComponent();
PartogramVitalsComponentWF.prototype.constructor = MPageComponent;
MP_Util.setObjectDefinitionMapping("WF_PARTO_VITALS", PartogramVitalsComponentWF);

PartogramVitalsComponentWF.prototype.Y_AXIS_MAX = 200;
PartogramVitalsComponentWF.prototype.HOVER_KEY = "VITALS";

/**
 * @method Returns the image folder path
 */

PartogramVitalsComponentWF.prototype.getImageFolderPath = function() {
    return this.imageFolderPath;
};
/**
 * @method Stores the path to where images are stored in the static content
 *         folder.
 */
PartogramVitalsComponentWF.prototype.setImageFolderPath = function(path) {
    this.imageFolderPath = path;
};

/**
 * @method gets the reference to the recordData object
 * @return the reference to recordData object
 */
PartogramVitalsComponentWF.prototype.getRecordData = function() {
    return this.recordData;
};

/**
 * @method Store a reference to the recordData object
 * @param {object} plot - A reference to the recordData object
 */
PartogramVitalsComponentWF.prototype.setRecordData = function(data) {
    this.recordData = data;
};

/**
 * @method gets the reference to the jqplot object
 * 
 * @return the reference to the JqPlot graph
 */
PartogramVitalsComponentWF.prototype.getPlot = function() {
    return this.plot;
};

/**
 * @method Store a reference to the jqplot object
 * @param {object} plot - A reference to the jqplot object
 */
PartogramVitalsComponentWF.prototype.setPlot = function(plot) {
    this.plot = plot;
};


/**
 * @method gets the reference to the graph element
 * @return the reference to graph element
 */
PartogramVitalsComponentWF.prototype.getGraphElement = function() {
    return this.graphElement;
};

/**
 * @method Store a reference to the graph element
 * @param {HTML Element} el - A reference to the graph element
 */
PartogramVitalsComponentWF.prototype.setGraphElement = function(el) {
    this.graphElement = el;
};

/**
 * Sets the result entered for BPGroup(Systolic/Diastolic) event in Interactive View.
 */
PartogramVitalsComponentWF.prototype.setBPGroup = function(value) {
    this.m_BPGroup = value;
};

/**
 * Gets the result entered for BPResGroup(Systolic/Diastolic) event in Interactive View.
 * if value has not been initialized, returns an empty array
 */
PartogramVitalsComponentWF.prototype.getBPGroup = function() {
    return this.m_BPGroup || [];
};

PartogramVitalsComponentWF.prototype.loadFilterMappings = function() {
    // Add the filter mapping object for the BP Group
    this.addFilterMappingObject("WF_PARTO_VITALS_BP_GROUP", {
        setFunction: this.setBPGroup,
        type: "Array",
        field: "PARENT_ENTITY_ID"
    });
};

PartogramVitalsComponentWF.prototype.RetrieveRequiredResources = function() {
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
 * necessary script call to retrieve the vital sign data
 */
PartogramVitalsComponentWF.prototype.retrieveComponentData = function() {
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
            var groupNames = ["WF_PARTO_VITALS_MHR", "WF_PARTO_VITALS_SPO2", "WF_PARTO_VITALS_RESP_RATE", "WF_PARTO_VITALS_BP", "WF_PARTO_VITALS_TEMP_ORAL", "WF_PARTO_VITALS_TEMP_TYMPANIC", "WF_PARTO_VITALS_TEMP_TEMPORAL", "WF_PARTO_VITALS_TEMP_AX", "WF_PARTO_VITALS_TEMP_SKIN"];
            for (i = 0; i < groupNames.length; i++) {
                this.groupNameMap[groupNames[i]] = [0];
                if (groupNames[i] === "WF_PARTO_VITALS_BP") {
                    this.groupNameMap[groupNames[i]][1] = 0;
                }
            }
            var SYSTOLIC = 1;
            var DIASTOLIC = 2;
            for (i = 0; i < groupsLength; i++) {
                var group = groups[i];
                if (group instanceof MPageEventCodeGroup) {
                    //BP will be populated separately
                    if (group.m_groupName === 'WF_PARTO_VITALS_BP') {
                        continue;
                    }
                    this.groupNameMap[group.m_groupName] = group.getEventCodes();
                }
            }
            var allBP = this.getBPGroup();
            if (allBP.length > 0) {
                this.groupNameMap.WF_PARTO_VITALS_BP = [allBP[SYSTOLIC], allBP[DIASTOLIC]];
            }

            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.ppr_cd + ".0", criterion.encntr_id + ".0", "^" + partogramStartDate + "^");
            for (i = 0; i < groupNames.length; i++) {
                var valLength = this.groupNameMap[groupNames[i]].length;
                for (var count = 0; count < valLength; count++) {
                    sendAr.push(MP_Util.CreateParamArray([this.groupNameMap[groupNames[i]][count]], 1));
                }
            }

            var scriptRequest = new ComponentScriptRequest();
            scriptRequest.setProgramName("MP_GET_PARTOGRAM_VITALS");
            scriptRequest.setParameterArray(sendAr);
            scriptRequest.setComponent(this);
            scriptRequest.setLoadTimer(this.loadTimer);
            scriptRequest.setRenderTimer(renderTimer);
            scriptRequest.performRequest();
        } else {
            var noEventCodeMappedMessage = "<span class='res-none'>" + i18n.discernabu.partogrambaseutil_o2.NOT_CONFIGURED_BEDROCK_ERR + "</span>";
            this.finalizeComponent(noEventCodeMappedMessage, "");
        }
    } catch (err) {
        MP_Util.LogJSError(err, this, "partogramvitals.js", "retrieveComponentData");
    }
};

/**
 * A wrapper function to get the HTML for the component.
 * @return ComponentHTML {String}: The HTML of the component
 */
PartogramVitalsComponentWF.prototype.getComponentHTML = function() {
    var compID = this.getStyles().getContentId();
    var imageFolder = this.getImageFolderPath();
    var compHTML = '<div class="partogram-container">';
    compHTML += '<div class="partogram-container-col-1">';
    compHTML += this.getLegendHTML();
    compHTML += '</div>';
    compHTML += '<div class="partogram-container-col-2">';
    compHTML += PARTO_GRAPH_BASE.createTopBar(imageFolder, "GRAPH");
    compHTML += '<div id="partogram-vitals-graph-container' + compID + '"><div id="partogram-vitals-graph-' + compID + '" class="partogramGraphDiv partoGraphDivVitals"></div></div>';
    compHTML += "</div>";
    compHTML += "</div>";
    return compHTML;
};

/**
 * This functions returns the HTML for the legend of this component.
 * @return LegendHTML {String}: The HTML for the Legend
 */
PartogramVitalsComponentWF.prototype.getLegendHTML = function() {
    var compID = this.getComponentId();
    var ORAL = 4;
    var SKIN = 9;
    var layoutHTML = '',
        i;
    var rfi18n = i18n.discernabu.partogramvitals_o2;
    var jsonData = this.getRecordData();
    layoutHTML += '<div class="partogram-legend" id="partogram-legend-' + compID + '">';
    var groupNames = ["WF_PARTO_VITALS_BP", "WF_PARTO_VITALS_MHR", "WF_PARTO_VITALS_SPO2", "WF_PARTO_VITALS_RESP_RATE", "WF_PARTO_VITALS_TEMP_ORAL", "WF_PARTO_VITALS_TEMP_AX", "WF_PARTO_VITALS_TEMP_TYMPANIC", "WF_PARTO_VITALS_TEMP_TEMPORAL", "WF_PARTO_VITALS_TEMP_SKIN"];
    var labelArr = [rfi18n.BLOOD_PRESSURE, jsonData.MHR_EVENT_CODE_NAME, jsonData.SPO2_EVENT_CODE_NAME, jsonData.RESP_RATE_EVENT_CODE_NAME, jsonData.TEMP_ORAL_EVENT_CODE_NAME, jsonData.TEMP_AXIL_EVENT_CODE_NAME,
        jsonData.TEMP_TYMPANIC_EVENT_CODE_NAME, jsonData.TEMP_TEMPORAL_EVENT_CODE_NAME, jsonData.TEMP_SKIN_EVENT_CODE_NAME
    ];
    var imageClasses = ['partoBP-ON', 'partoMHR-ON', 'partoSPO2-ON', 'partoRR-ON', 'partoOral-ON', 'partoAxillary-ON', 'partoTympanic-ON', 'partoTemporal-ON', 'partoSkin-ON'];
    var imageIDs = ['partoBP', 'partoMHR', 'partoSPO2', 'partoRR', 'partoOral', 'partoAxillary', 'partoTympanic', 'partoTemporal', 'partoSkin'];
    var temperatureConfigured = false;

    var legendRow = function(imageClassName, imageID, label, tempLegend) {
        var rowHTML = '';
        //temperature legend has slightly different css properties
        if (tempLegend) {
            rowHTML += '<div class="partogram-vitals-temp-legend-item">';
            rowHTML += '<div class="partogram-vitals-temp-legend-img">';
        } else {
            rowHTML += '<div class="partogram-vitals-legend-item">';
            rowHTML += '<div class="partogram-vitals-legend-img">';
        }
        rowHTML += '<div id="' + imageID + compID + '" class="partoVitalsSprite ' + imageClassName + '" ></div>';
        rowHTML += '</div>';
        rowHTML += '<div title="' + label + '" class="partogram-vitals-legend-item-name"><span>' + label + '</span></div>';
        rowHTML += '</div>';
        return rowHTML;
    };

    for (i = 0; i < 4; i++) {
        if (this.groupNameMap[groupNames[i]][0]) {
            layoutHTML += legendRow(imageClasses[i], imageIDs[i], labelArr[i], false);
        }
    }
    //need to break from the top for loop as there's a Temperature heading in between
    //make sure atleast one of the temperature types have been configured in bedrock
    for (i = ORAL; i < SKIN; i++) {
        if (this.groupNameMap[groupNames[i]][0]) {
            if (!temperatureConfigured) {
                temperatureConfigured = true;
                layoutHTML += '<hr class="partoVitalsHorizontalRuler" />';
                layoutHTML += '<div class="partogram-vitals-legend-item">';
                layoutHTML += '<div class="partogram-vitals-legend-img">';
                layoutHTML += '<div class="partoVitalsSprite partoTemp-Group-ON partoTempGroupLegend"></div>';
                layoutHTML += '</div>';
                layoutHTML += '<div class="partogram-vitals-legend-item-name partogram-vitals-temp-text" title="' + rfi18n.TEMPERATURE + '"><span>' + rfi18n.TEMPERATURE;
                if (this.TEMPERATURE_UNIT) {
                    layoutHTML += ' (' + this.TEMPERATURE_UNIT + ')';
                }
                layoutHTML += '</span></div></div>';
            }
            layoutHTML += legendRow(imageClasses[i], imageIDs[i], labelArr[i], true);
        }
    }

    layoutHTML += '</div>'; //legend
    return layoutHTML;
};

/**
 * @method Generates series object consumable by jqplot
 * @return series {Array}: An array of length 3 representing the lines on the graph
 */
PartogramVitalsComponentWF.prototype.getSeriesObjects = function() {
    var imageFolderPath = this.getImageFolderPath();
    var spo2Img = new Image();
    var tempOralImg = new Image();
    var tempAxillaryImg = new Image();
    var tempTympanicImg = new Image();
    var tempSkinImg = new Image();
    spo2Img.src = imageFolderPath + 'partoSPO2-HOVER.png';
    tempOralImg.src = imageFolderPath + 'partoOral-ON.png';
    tempAxillaryImg.src = imageFolderPath + 'partoAxillary-ON.png';
    tempTympanicImg.src = imageFolderPath + 'partoTympanic-ON.png';
    tempSkinImg.src = imageFolderPath + 'partoSkin-ON.png';

    var seriesArray = [{
        //BLOOD PRESSURE
        renderer: $.jqplot.HLWhiskerRenderer,
        showLine: false,
        shadow: false,
        rendererOptions: {
            hiColor: "#505050",
            lowColor: "#505050",
            hiWidth: 2,
            lowWidth: 2,
            lineWidth: 2,
            wickColor: "#505050",
            wickWidth: 1,
            tickLength: 7,
            enableNormalcyRange: true
        },
        xaxis: "x2axis",
        yaxis: "yaxis",
        fillColor: '#FF0000'
    }, {
        //MHR
        markerOptions: {
            show: true,
            style: "filledCircle"
        },
        xaxis: "x2axis",
        yaxis: "yaxis",
        lineWidth: 1,
        color: '#0CB9CE',
        shadow: false
    }, {
        //SPO2
        markerRenderer: $.jqplot.ImageMarkerRenderer,
        markerOptions: {
            show: true,
            imageElement: spo2Img,
            xOffset: -3,
            yOffset: -5,
            shadow: false
        },
        xaxis: "x2axis",
        yaxis: "yaxis",
        lineWidth: 1,
        color: '#ff4a00',
        shadow: false
    }, {
        //RESP RATE
        markerOptions: {
            show: true,
            style: "filledSquare"
        },
        xaxis: "x2axis",
        yaxis: "yaxis",
        lineWidth: 1,
        color: '#970000',
        shadow: false
    }, {
        //TEMPERATURE ORAL
        markerRenderer: $.jqplot.ImageMarkerRenderer,
        markerOptions: {
            show: true,
            imageElement: tempOralImg,
            xOffset: -5.5,
            yOffset: -5,
            shadow: false
        },
        xaxis: "x2axis",
        yaxis: "yaxis",
        lineWidth: 1,
        color: '#4DAF4A',
        breakOnNull: true,
        shadow: false
    }, {
        //TEMPERATURE AXILLARY
        markerRenderer: $.jqplot.ImageMarkerRenderer,
        markerOptions: {
            show: true,
            imageElement: tempAxillaryImg,
            xOffset: -5,
            yOffset: -5,
            shadow: false
        },
        xaxis: "x2axis",
        yaxis: "yaxis",
        lineWidth: 1,
        color: '#4DAF4A',
        breakOnNull: true,
        shadow: false
    }, {
        //TEMPERATURE TYMPANIC
        markerRenderer: $.jqplot.ImageMarkerRenderer,
        markerOptions: {
            show: true,
            imageElement: tempTympanicImg,
            xOffset: -5.5,
            yOffset: -5,
            shadow: false
        },
        xaxis: "x2axis",
        yaxis: "yaxis",
        lineWidth: 1,
        color: '#4DAF4A',
        breakOnNull: true,
        shadow: false
    }, {
        //TEMPERATURE TEMPORAL
        markerOptions: {
            show: true,
            style: "x",
            size: 6
        },
        xaxis: "x2axis",
        yaxis: "yaxis",
        lineWidth: 1,
        color: '#4DAF4A',
        breakOnNull: true,
        shadow: false
    }, {
        //TEMPERATURE SKIN
        markerRenderer: $.jqplot.ImageMarkerRenderer,
        markerOptions: {
            show: true,
            imageElement: tempSkinImg,
            xOffset: -5.5,
            yOffset: -5,
            shadow: false
        },
        xaxis: "x2axis",
        yaxis: "yaxis",
        lineWidth: 1,
        color: '#4DAF4A',
        breakOnNull: true,
        shadow: false
    }];
    return seriesArray;
};

/**
 * A seperate method for caclulating normalcy for Blood Pressure, from sysNormalcy and diaNormalcy
 * Returns CSS class for final Normalcy.
 */
PartogramVitalsComponentWF.prototype.getBPNormalcyClass = function(sysNormalcy, diaNormalcy) {
    var sysNormalcyClass = PARTO_GRAPH_BASE.getNormalcyClass(sysNormalcy);
    var diaNormalcyClass = PARTO_GRAPH_BASE.getNormalcyClass(diaNormalcy);
    if (sysNormalcyClass === "res-severe" ||
        diaNormalcyClass === "res-severe") {
        return "res-severe";
    } else if (sysNormalcyClass === "res-high" ||
        diaNormalcyClass === "res-high") {
        return "res-high";
    } else if (sysNormalcyClass === "res-low" ||
        diaNormalcyClass === "res-low") {
        return "res-low";
    } else if (sysNormalcyClass === "res-abnormal" ||
        diaNormalcyClass === "res-abnormal") {
        return "res-abnormal";
    } else {
        return "res-normal";
    }
};

/**
 * A method to populate data for hover over datapoints on the graph.
 */
PartogramVitalsComponentWF.prototype.populateHoverData = function() {
    var jsonData = this.getRecordData();
    var self = this;
    var rfi18n = i18n.discernabu.partogramvitals_o2;
    var imageClasses = ['partoBP-HOVER', 'partoMHR-HOVER', 'partoSPO2-HOVER', 'partoRR-HOVER', 'partoOral-ON', 'partoAxillary-ON', 'partoTympanic-ON', 'partoTemporal-ON', 'partoSkin-ON'];
    var eventCodeNames = [rfi18n.BLOOD_PRESSURE, jsonData.MHR_EVENT_CODE_NAME, jsonData.SPO2_EVENT_CODE_NAME, jsonData.RESP_RATE_EVENT_CODE_NAME, jsonData.TEMP_ORAL_EVENT_CODE_NAME, jsonData.TEMP_AXIL_EVENT_CODE_NAME, jsonData.TEMP_TYMPANIC_EVENT_CODE_NAME, jsonData.TEMP_TEMPORAL_EVENT_CODE_NAME, jsonData.TEMP_SKIN_EVENT_CODE_NAME];
    var units = [jsonData.BP_UNIT, jsonData.MHR_UNIT, jsonData.SPO2_UNIT, jsonData.RESP_RATE_UNIT, jsonData.TEMP_ORAL_UNIT, jsonData.TEMP_AXIL_UNIT, jsonData.TEMP_TYMPANIC_UNIT, jsonData.TEMP_TEMPORAL_UNIT, jsonData.TEMP_SKIN_UNIT];
    var vitalsData = [jsonData.BP, jsonData.MHR, jsonData.SPO2, jsonData.RESP_RATE, jsonData.TEMP_ORAL, jsonData.TEMP_AXIL, jsonData.TEMP_TYMPANIC, jsonData.TEMP_TEMPORAL, jsonData.TEMP_SKIN];
    var vitalsLen = vitalsData.length;
    //A seperate method to handle Blood Pressure value due to different display requirement (Systolic value / Diastolic value).
    //Returns the HTML for the value column of the hover.
    var buildBPValue = function(bpPoint) {
        var resultValue = bpPoint.SYS_RESULT_VALUE + '/' + bpPoint.DIA_RESULT_VALUE;
        var normalcyClass = self.getBPNormalcyClass(bpPoint.SYS_RESULT_NORMALCY, bpPoint.DIA_RESULT_NORMALCY);
        var modifiedInd = 0;
        //show modified if either of systolic or diastolic's modified indicator is set.
        if (bpPoint.SYS_RESULT_MODIFIED_IND === 1 ||
            bpPoint.DIA_RESULT_MODIFIED_IND === 1) {
            modifiedInd = 1;
        }
        var valueHTML = '';
        valueHTML += PARTO_GRAPH_BASE.getResultIndHTML(resultValue, units[0], normalcyClass, modifiedInd);
        return valueHTML;
    };
    //A helper method to build the value for all Vitals except blood pressure. Returns the HTML for the value column of the hover.
    var buildValue = function(vitalsPoint, index) {
        var resultValue = vitalsPoint.RESULT_VALUE;
        var normalcyClass = PARTO_GRAPH_BASE.getNormalcyClass(vitalsPoint.RESULT_NORMALCY);
        var modifiedInd = vitalsPoint.RESULT_MODIFIED_IND;
        var valueHTML = '';
        valueHTML += PARTO_GRAPH_BASE.getResultIndHTML(resultValue, units[index], normalcyClass, modifiedInd);
        return valueHTML;
    };

    for (var i = 0; i < vitalsLen; i++) {
        var series = vitalsData[i];
        var icon = '<div class="partoVitalsSprite ' + imageClasses[i] + '"></div>';
        var key = eventCodeNames[i];
        var seriesLen = series.length;
        for (var j = 0; j < seriesLen; j++) {
            var dataPoint = series[j];
            var timestamp = PARTO_GRAPH_BASE.getLocalDateTime(dataPoint.RESULT_DATE);
            var value = '';
            if (i === 0) {
                value = buildBPValue(dataPoint);
            } else {
                value = buildValue(dataPoint, i);
            }
            PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY, timestamp, icon, key, value);
        }
    }
};

/**
 * This function returns the callback for tooltip for data points
 */
PartogramVitalsComponentWF.prototype.graphToolTipContent = function() {
    var component = this;
    /**
     * @param seriesIndex - the index on the series which the mouse hover was triggered
     * @param pointIndex -  the nth datapoint in the selected series array
     * @param plot - the JQplot graph
     * 
     */
    var tooltipFunction = function(str, seriesIndex, pointIndex, plot) {
        //for systolic to have the same index as diastolic
        var data = plot.data[seriesIndex][pointIndex % plot.data[seriesIndex].length];
        /* For BP
         * data[0] - dateTime, 
         * data[1] - Sys Result value
         * data[2] - Dia Result value
         * data[3] - Sys Color value
         * data[4] - Dia Color value
         */
        /* For others
         * data[0] - dateTime, data[1] - Result value
         */

        var time = data[0];
        PARTO_GRAPH_BASE.setToolTipLocation(plot, seriesIndex, pointIndex);
        var dataPopulated = PARTO_GRAPH_BASE.isHoverDataPopulated(component.HOVER_KEY);
        if (!dataPopulated) {
            component.populateHoverData();
        }
        var hoverHTML = PARTO_GRAPH_BASE.getHoverHTML(component.HOVER_KEY, time);
        return hoverHTML;
    };
    return tooltipFunction;
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
PartogramVitalsComponentWF.prototype.getGraphOptions = function(startDt, endDt, hourticks, quarterticks, seriesObjs, canvasOverlayObjs) {
    var highlighterOption = {
        tooltipContentEditor: this.graphToolTipContent(),
        showTooltip: true,
        tooltipLocation: "n"
    };
    return {
        graphName: "partogram-vitals-graph-" + this.getStyles().getId(),
        series: seriesObjs,
        seriesDefaults: {
            showMarker: false,
            pointLabels: {
                show: false
            },
            hoverable: false,
            highlightMouseDown: false,
            highlighter: highlighterOption,
            shadow: false
        },
        axes: {
            yaxis: {
                min: 0,
                max: this.Y_AXIS_MAX,
                tickInterval: 10,
                tickOptions: {
                    showMark: false,
                    showLabel: true,
                    formatString: "%d"
                }
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
PartogramVitalsComponentWF.prototype.generateGraphOptions = function() {
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
 * @method This function filters the data points into appropriate buckets (event cd)described by the bedrock mappings into
 * a format accepted by JQplot series (line vs Whisker) renderer
 * @return An array of array containing [time in ms,resultVal] except for BP.The diastolic and systolic 
 * made at the same time are clubbed together as one datapoint. The array for Bp will contain [time in ms,diastolic BP val, systolic BP Val, diastolic color, 
 * systolic color]
 */
PartogramVitalsComponentWF.prototype.getPlotLines = function() {
    var recordData = this.getRecordData();
    var plotLines = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ];
    var bpDataLen = recordData.BP_CNT;
    var mhrDataLen = recordData.MHR_CNT;
    var spo2DataLen = recordData.SPO2_CNT;
    var respRateDataLen = recordData.RESP_RATE_CNT;
    var stateMap = {
        BLOOD_PRESSURE: 0,
        MHR: 1,
        SPO2: 2,
        RESP_RATE: 3,
        TEMP_ORAL: 4,
        TEMP_AXILLARY: 5,
        TEMP_TYMPANIC: 6,
        TEMP_TEMPORAL: 7,
        TEMP_SKIN: 8
    };

    var NORMALCY_COLOR_MAP = {
        SEVERE: '#CC0000',
        HIGH: '#FF8300',
        NORMAL: '#505050',
        LOW: '#0052E5'
    };

    var getNormalcyColor = function(normalcyMean) {
        var normalcyClass = PARTO_GRAPH_BASE.getNormalcyClass(normalcyMean);
        var res = NORMALCY_COLOR_MAP.NORMAL;
        if (normalcyClass === "res-severe") {
            res = NORMALCY_COLOR_MAP.SEVERE;
        } else if (normalcyClass === "res-high") {
            res = NORMALCY_COLOR_MAP.HIGH;
        } else if (normalcyClass === "res-low") {
            res = NORMALCY_COLOR_MAP.LOW;
        }
        return res;
    };

    var bpData = recordData.BP;
    var i = 0,
        bpPoint;
    //insert Blood Pressure Data points, has to be of 5 elements[<timestamp>, <diastolic value>, <systolic value>, <diastolic color>, <systolic color>]
    for (i = 0; i < bpDataLen; i++) {
        bpPoint = bpData[i];
        var systolicVal = bpPoint.SYS_RESULT_VALUE;
        if (systolicVal > this.Y_AXIS_MAX) {
            systolicVal = this.Y_AXIS_MAX;
        }
        plotLines[stateMap.BLOOD_PRESSURE].push([PARTO_GRAPH_BASE.getLocalDateTime(bpPoint.RESULT_DATE), bpPoint.DIA_RESULT_VALUE, systolicVal, getNormalcyColor(bpPoint.DIA_RESULT_NORMALCY), getNormalcyColor(bpPoint.SYS_RESULT_NORMALCY)]);
    }

    //insert MHR Data points
    for (i = 0; i < mhrDataLen; i++) {
        var mhrPoint = recordData.MHR[i];
        plotLines[stateMap.MHR].push([PARTO_GRAPH_BASE.getLocalDateTime(mhrPoint.RESULT_DATE), mhrPoint.RESULT_VALUE]);
    }

    //insert SPO2 Data points
    for (i = 0; i < spo2DataLen; i++) {
        var spo2Point = recordData.SPO2[i];
        plotLines[stateMap.SPO2].push([PARTO_GRAPH_BASE.getLocalDateTime(spo2Point.RESULT_DATE), spo2Point.RESULT_VALUE]);
    }

    //insert Respiratory Rate Data points
    for (i = 0; i < respRateDataLen; i++) {
        var respRatePoint = recordData.RESP_RATE[i];
        plotLines[stateMap.RESP_RATE].push([PARTO_GRAPH_BASE.getLocalDateTime(respRatePoint.RESULT_DATE), respRatePoint.RESULT_VALUE]);
    }

    var temperatureData = this.getTemperatureData();
    plotLines[stateMap.TEMP_ORAL] = temperatureData[0];
    plotLines[stateMap.TEMP_AXILLARY] = temperatureData[1];
    plotLines[stateMap.TEMP_TYMPANIC] = temperatureData[2];
    plotLines[stateMap.TEMP_TEMPORAL] = temperatureData[3];
    plotLines[stateMap.TEMP_SKIN] = temperatureData[4];

    //sort all series data except temperature(as temperature data are already sorted), need this for jqplot to get the time on hover correctly. 
    for (i = 0; i <= stateMap.RESP_RATE; i++) {
        plotLines[i].sort(function(point1, point2) {
            return point1[0] - point2[0];
        });
    }

    //to let the graph render, as jqplot doesn't render the graph if the 1st element in the series doesn't have any data.
    if (plotLines[0].length === 0) {
        plotLines[0].push([null]);
    }
    return plotLines;
};

/**
 * A helper method to get all 5 temperatures which has null points in it to break the line if the method of measuring temperature has changed.
 */
PartogramVitalsComponentWF.prototype.getTemperatureData = function() {
    var recordData = this.getRecordData();
    var tempOralDataLen = recordData.TEMP_ORAL_CNT;
    var tempAxilDataLen = recordData.TEMP_AXIL_CNT;
    var tempTympanicDataLen = recordData.TEMP_TYMPANIC_CNT;
    var tempTemporalDataLen = recordData.TEMP_TEMPORAL_CNT;
    var tempSkinDataLen = recordData.TEMP_SKIN_CNT;
    var temperatureData = [
        [],
        [],
        [],
        [],
        []
    ];
    var dataArray = [];
    var tempMap = {
        ORAL: 0,
        AXILLARY: 1,
        TYMPANIC: 2,
        TEMPORAL: 3,
        SKIN: 4
    };
    var i = 0;
    this.TEMPERATURE_UNIT = recordData.TEMP_ORAL_UNIT || recordData.TEMP_AXIL_UNIT || recordData.TEMP_TYMPANIC_UNIT || recordData.TEMP_TEMPORAL_UNIT || recordData.TEMP_SKIN_UNIT || '';

    //insert Temperature Oral Data points
    for (i = 0; i < tempOralDataLen; i++) {
        dataArray.push([recordData.TEMP_ORAL[i], tempMap.ORAL]);
    }

    //insert Temperature Axillary Data points
    for (i = 0; i < tempAxilDataLen; i++) {
        dataArray.push([recordData.TEMP_AXIL[i], tempMap.AXILLARY]);
    }

    //insert Temperature Tympanic Data points
    for (i = 0; i < tempTympanicDataLen; i++) {
        dataArray.push([recordData.TEMP_TYMPANIC[i], tempMap.TYMPANIC]);
    }

    //insert Temperature Temporal Data points
    for (i = 0; i < tempTemporalDataLen; i++) {
        dataArray.push([recordData.TEMP_TEMPORAL[i], tempMap.TEMPORAL]);
    }

    //insert Temperature Skin Data points
    for (i = 0; i < tempSkinDataLen; i++) {
        dataArray.push([recordData.TEMP_SKIN[i], tempMap.SKIN]);
    }

    //sort the array in ascending order of their dates
    dataArray.sort(function(dataPoint1, dataPoint2) {
        var date1 = PARTO_GRAPH_BASE.getLocalDateTime(dataPoint1[0].RESULT_DATE);
        var date2 = PARTO_GRAPH_BASE.getLocalDateTime(dataPoint2[0].RESULT_DATE);
        if (date1 <= date2) {
            return -1;
        }
        return 1;
    });

    var dataArrayLen = dataArray.length;
    if (dataArrayLen === 0) {
        return temperatureData;
    }
    var prevMethod = dataArray[0][1];
    temperatureData[prevMethod].push([PARTO_GRAPH_BASE.getLocalDateTime(dataArray[0][0].RESULT_DATE), dataArray[0][0].RESULT_VALUE]);
    //start with point 1 and see if the method is changed. If yes, then push a null object to break the line for jqplot
    for (i = 1; i < dataArrayLen; i++) {
        var bpPoint = dataArray[i][0];
        var currentMethod = dataArray[i][1];
        if (currentMethod !== prevMethod) {
            temperatureData[prevMethod].push([PARTO_GRAPH_BASE.getLocalDateTime(bpPoint.RESULT_DATE), null]);
        }
        temperatureData[currentMethod].push([PARTO_GRAPH_BASE.getLocalDateTime(bpPoint.RESULT_DATE), bpPoint.RESULT_VALUE]);
        prevMethod = currentMethod;
    }

    return temperatureData;
};

/**
 * @method A wrapper function which generates the jqplot graph from the json data
 */
PartogramVitalsComponentWF.prototype.plotGraph = function() {
    var contentID = this.getStyles().getContentId();
    //important to append the container HTML before preparing the jqplot data, as the width of the container is used to draw the last refreshed time bar
    var componentHTML = this.getComponentHTML();
    jQuery("#" + contentID).append(componentHTML);
    var options = this.generateGraphOptions();
    var vitalPlots = this.getPlotLines();
    this.jqplotData = vitalPlots;
    var widthOffset = PARTO_GRAPH_BASE.getWidthOffsetForGraph();
    var currentWidth = parseInt($('#partogram-vitals-graph-' + contentID).css('width'), 10);
    $('#partogram-vitals-graph-' + contentID).css('width', currentWidth - widthOffset);
    var plot = $.jqplot("partogram-vitals-graph-" + contentID, vitalPlots, options);
    this.setPlot(plot);
    this.setGraphElement(document.getElementById('partogram-vitals-graph-' + contentID));
    PARTO_GRAPH_BASE.setGraphsCommonCSS();
    if (!PARTO_GRAPH_BASE.topBarGraphHTML) {
        PARTO_GRAPH_BASE.refreshTopbar(contentID);
    }
};


/**
 * This function register all the events for the component.
 */
PartogramVitalsComponentWF.prototype.registerEvents = function() {
    var component = this,
        i;
    var compID = this.getComponentId();
    var imageIDs = ['partoBP', 'partoMHR', 'partoSPO2', 'partoRR', 'partoOral', 'partoAxillary', 'partoTympanic', 'partoTemporal', 'partoSkin'];
    //This is only for Capability timer. This should NOT be used for display purposes. For displaying on screen, use i18n object or event names from the server script.
    var nameMappings = ['Blood Pressure', 'Maternal Heart Rate', 'SPO2', 'Respiratory Rate'];
    var TOTAL_SERIES = 4; //change this to 9 to individually toggle each temperature
    function toggleEventHandler(index) {
        return function(event) {
            var jqplotGraph = component.getPlot();
            var current = jqplotGraph.series[index].show;
            if (current) {
                $(event.target).removeClass(imageIDs[index] + '-ON').addClass(imageIDs[index] + '-OFF');
            } else {
                $(event.target).removeClass(imageIDs[index] + '-OFF').addClass(imageIDs[index] + '-ON');
            }
            jqplotGraph.series[index].show = !current;
            jqplotGraph.redraw();
            PARTO_GRAPH_BASE.setGraphsCommonCSS();
            var legendToggleTimer = new CapabilityTimer("CAP:MPG.PARTOGRAMVITALS.O2 - legend toggle", component.criterion.category_mean);
            if (legendToggleTimer) {
                legendToggleTimer.addMetaData('rtms.legacy.metadata.1', nameMappings[index]);
                legendToggleTimer.capture();
            }
        };
    }
    for (i = 0; i < TOTAL_SERIES; i++) {
        $('#' + imageIDs[i] + compID).click(toggleEventHandler(i));
    }

    $('.partoTempGroupLegend').click(function(e) {
        var from = '-ON';
        var to = '-OFF';
        var isON = $(e.target).hasClass('partoTemp-Group-ON');
        if (!isON) {
            from = '-OFF';
            to = '-ON';
        }
        $(e.target).removeClass('partoTemp-Group' + from).addClass('partoTemp-Group' + to);
        var jqplotGraph = component.getPlot();
        var ORAL = 4;
        var SKIN = 9;
        for (i = ORAL; i < SKIN; i++) {
            $('#' + imageIDs[i] + compID).removeClass(imageIDs[i] + from).addClass(imageIDs[i] + to);
            jqplotGraph.series[i].show = !isON;
        }
        jqplotGraph.redraw();
        PARTO_GRAPH_BASE.setGraphsCommonCSS();
        var legendToggleTimer = new CapabilityTimer("CAP:MPG.PARTOGRAMVITALS.O2 - legend toggle", component.criterion.category_mean);
        if (legendToggleTimer) {
            //capture the new state
            legendToggleTimer.addMetaData('rtms.legacy.metadata.1', 'Temperature');
            legendToggleTimer.capture();
        }
    });
};


/**
 * Renders the Partogram Vitals component visuals. This method will be called after Partogram Vital Signs has been initialized and setup.
 *
 * @param recordData  - has the information about the Blood Pressure, MHR, SPO2, Respiratory Rate, Temperature of the patient
 */
PartogramVitalsComponentWF.prototype.renderComponent = function(recordData) {
    var timerRenderComponent = MP_Util.CreateTimer(this.getComponentRenderTimerName(), this.getCriterion().category_mean);
    var renderingCAPTimer = new CapabilityTimer("CAP:MPG.PARTOGRAMVITALS.O2 - rendering component", this.getCriterion().category_mean);
    if (renderingCAPTimer) {
        renderingCAPTimer.capture();
    }
    try {
        var basei18n = i18n.discernabu.partogrambaseutil_o2;
        var noDataHTML = "<span class='res-none'>" + basei18n.NO_RESULTS_FOUND + "</span>";
        //check if any data exists for each series
        var resultsCount = recordData.MHR_CNT + recordData.SPO2_CNT + recordData.RESP_RATE_CNT + recordData.BP_CNT + recordData.TEMP_ORAL_CNT + recordData.TEMP_AXIL_CNT + recordData.TEMP_TYMPANIC_CNT + recordData.TEMP_TEMPORAL_CNT + recordData.TEMP_SKIN_CNT;
        this.loadTimer.addMetaData("component.resultcount", resultsCount);
        if (resultsCount > 0) {
            PARTO_GRAPH_BASE.addSubscriber(this);
            this.finalizeComponent("", MP_Util.CreateTitleText(this, ""));
            this.setRecordData(recordData);
            this.plotGraph();
            PARTO_GRAPH_BASE.addTimeScaleButtons(this.getStyles().getId());
            this.registerEvents();
        } else {
            this.finalizeComponent(noDataHTML, MP_Util.CreateTitleText(this, ""));
        }
        $('#' + this.getStyles().getId()).css('margin-bottom', PARTO_GRAPH_BASE.getComponentBottomPadding());
    } catch (err) {
        MP_Util.LogJSError(err, this, "partogramvitals.js", "RenderComponent");
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
