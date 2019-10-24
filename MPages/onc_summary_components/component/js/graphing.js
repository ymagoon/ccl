function VSTimelineComponentStyle() {
    this.initByNamespace("tmln");
}
VSTimelineComponentStyle.inherits(ComponentStyle);

/**
 * The Vital Sign Timeline component will retrieve all information associated to the patient
 * 		and display in a timeline view
 * 
 * @param {Criterion} criterion
 */
function VSTimelineComponent(criterion) {
    this.setCriterion(criterion);
    this.setStyles(new VSTimelineComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.TIMELINE_VS.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.TIMELINE_VS.O1 - render component");
    this.setIncludeLineNumber(false);

    VSTimelineComponent.method("getDefaultSelected", function () { return (this.m_def_select); });
    VSTimelineComponent.method("setDefaultSelected", function (value) { this.m_def_select = value; });
    VSTimelineComponent.method("addDefaultSelected", function (value) {
        if (this.m_def_select === null) {
            this.m_def_select = [];
        }
        this.m_def_select.push(value);
    });
    VSTimelineComponent.method("getMasterGraphTitle", function () { return (this.m_master_title); });
    VSTimelineComponent.method("setMasterGraphTitle", function (value) { this.m_master_title = value; });
    VSTimelineComponent.method("getVitalSignTitle", function () { return (this.m_vs_title); });
    VSTimelineComponent.method("setVitalSignTitle", function (value) { this.m_vs_title = value; });
    VSTimelineComponent.method("getBloodPressureTitle", function () { return (this.m_bp_title); });
    VSTimelineComponent.method("setBloodPressureTitle", function (value) { this.m_bp_title = value; });
    VSTimelineComponent.method("getTableGraphTitle", function () { return (this.m_table_title); });
    VSTimelineComponent.method("setTableGraphTitle", function (value) { this.m_table_title = value; });
    /* generic function that lets the object know how many CE groups there are */
    VSTimelineComponent.method("getDataNum", function () { return ((this.m_data_num === null) ? 0 : this.m_data_num); });
    VSTimelineComponent.method("setDataNum", function (value) {
        this.m_data_num = value;
        if (this.m_data_num) {
            for (var data_cnt = 0; data_cnt < this.m_data_num; data_cnt++) {
                eval(["VSTimelineComponent.method('getTimelineCds", (data_cnt + 1), "', function (){return this.m_temp", (data_cnt + 1), ";});"].join(""));
                eval(["VSTimelineComponent.method('setTimelineCds", (data_cnt + 1), "', function (value){this.m_temp", (data_cnt + 1), " = value;});"].join(""));
                eval(["VSTimelineComponent.method('addTimelineCd", (data_cnt + 1), "', function (value){if (this.m_temp", (data_cnt + 1), " == null) this.m_temp", (data_cnt + 1), " = []; this.m_temp", (data_cnt + 1), ".push(value);});"].join(""));
            }
        }
    });
    /**
     * Sets whether or not the blood pressure section is disabled in the component
     * @param  {Boolean} isDisplayed Sets whether or not the blood pressure should be displayed in the component
     * @return {undefined}           Undefined
     */
    VSTimelineComponent.method("setIsBloodPressureDisplayed", function(isDisplayed){
        this.m_bp_displayed = isDisplayed;
    });
    /**
     * Returns whether or not the blood pressure section should be displayed in the component
     * @return {Boolean}   Returns true if the BP section is displayed, false otherwise
     */
    VSTimelineComponent.method("isBloodPressureDisplayed", function(){
        return this.m_bp_displayed;
    });

    this.setDataNum(16); /* should be 16 values total including BP values */
    this.setIsBloodPressureDisplayed(true);
    VSTimelineComponent.method("InsertData", function () {
        CERN_VS_TIMELINE_O1.GetVSTimelineData(this);
    });
    VSTimelineComponent.method("HandleSuccess", function (recordData) {
    	try {
        	CERN_VS_TIMELINE_O1.RenderVSTimeline(this, recordData);
       	}
       	catch(err) {
       		this.setLoaded(false);
       	}
    });
}
/*
MPageComponent is defined in js/core/mp_component_defs.js
*/
VSTimelineComponent.inherits(MPageComponent);


/**
  * Vital Sign Timeline methods
  * @namespace CERN_VS_TIMELINE_O1
  * @static
  * @global
  */
var CERN_VS_TIMELINE_O1 = function () {
    return {
        GetVSTimelineData: function (component) {
            var sendArr = [];
            var criterion = component.getCriterion();
            var data_num = component.getDataNum();
            var lookBackUnits = component.getLookbackUnits();
            var lookBackUnitTypeFlag = component.getLookbackUnitTypeFlag();
            var defSelectCds = component.getDefaultSelected();
            var iDefSelectCds = MP_Util.CreateParamArray(defSelectCds, 1);
            var prsnlInfo = criterion.getPersonnelInfo();
            var encntrs = prsnlInfo.getViewableEncounters();
            var encntrVal = (encntrs) ? "value(" + encntrs + ")" : "0.0";
            sendArr.push("^MINE^", criterion.person_id + ".0", ((component.getScope() == 2) ? criterion.encntr_id + ".0" : "0.0"), lookBackUnits, lookBackUnitTypeFlag, data_num, iDefSelectCds, encntrVal, criterion.provider_id + ".0", criterion.ppr_cd + ".0");
            for (var data_cnt = 0; data_cnt < data_num; data_cnt++) {
                eval(["var tempCds = component.getTimelineCds", (data_cnt + 1), "();"].join(""));
                sendArr.push(MP_Util.CreateParamArray(tempCds, 1));
            }
            MP_Core.XMLCclRequestWrapper(component, "MP_GET_TIMELINE_VS_V4", sendArr, true);
        },
        RenderVSTimeline: function (component, recordData) {
            var countText = "", sHTML = "",
                nameSpace = component.getStyles().getNameSpace(),
                timeline = recordData.QUAL,
                timeline_cnt = recordData.QUAL_CNT;
            var df = MP_Util.GetDateFormatter();
            var timeline_dt_tm = df.formatISO8601(recordData.MIN_DT_TM_UTC, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
            var componentId = component.getComponentId();
            var graphData = MP_GRAPHS.getGraphDataByComponentId(componentId);
            var sHTMLArray = [];

            /************************* Create HTML *******************************/
            var cntrTitle = [component.getMasterGraphTitle(), " (", timeline_dt_tm, " ----> ", i18n.CURRENT, ")"].join("");
            var vsTitle = [component.getVitalSignTitle(), i18n.ACCORDING_TO_ZOOM].join("");
            var bpTitle = [component.getBloodPressureTitle(), i18n.ACCORDING_TO_ZOOM].join("");
            var tableTitle = [component.getTableGraphTitle(), i18n.ACCORDING_TO_ZOOM].join("");
            var subSecTgl = "";

            if (component.isAlwaysExpanded() && !component.isExpanded()) {
                subSecTgl = "closed ";
            }
            sHTMLArray.push("<div class='", subSecTgl, "sub-sec'><h3 class='sub-sec-hd'>",
                        "<span class='sub-sec-title' title='", cntrTitle, "'>", cntrTitle, "</span><span class='sec-total'></span></h3>",
                        "<div class='sub-sec-content'><ul class='v-graph'>",
                        "<li class='legend'><div id='resetBtns", componentId, "' class='tmln-graph-selection tmln-reset-buttons'></div></li>",
                        "<li class='v-g'><div id='ctrGraph", componentId, "' class='tmln-control-graph'></div></li></ul></div></div>",

                        "<div class='", subSecTgl, "sub-sec'><h3 class='sub-sec-hd'>",
                        "<span class='sub-sec-title' title='", vsTitle, "'>", vsTitle, "</span><span class='sec-total'></span></h3>",
                        "<div class='sub-sec-content' id='vsSection", componentId, "'><ul class='v-graph'>",
                        "<li class='legend'><div id='vsSelect", componentId, "' class='tmln-graph-selection tmln-vitals-selection'></div></li>",
                        "<li class='v-g'><div id='vsGraph", componentId, "' class='tmln-vitals-graph'></div></li></ul></div></div>");
            //Add Blood Pressure Graph only if enabled
            if (component.isBloodPressureDisplayed()){
                sHTMLArray.push("<div class='", subSecTgl, "sub-sec'><h3 class='sub-sec-hd'>",
                        "<span class='sub-sec-title' title='", bpTitle, "'>", bpTitle, "</span><span class='sec-total'></span></h3>",
                        "<div class='sub-sec-content' id='bpSection", componentId, "'><ul class='v-graph'>",
                        "<li class='legend'><div id='bpSelect", componentId, "' class='tmln-graph-selection tmln-bp-selection'></div></li>",
                        "<li class='v-g'><div id='bpGraph", componentId, "' class='tmln-bp-graph'></div></li></ul></div></div>");
            }
            sHTMLArray.push("<div class='", subSecTgl, "sub-sec'><h3 class='sub-sec-hd'>",
						"<span class='sub-sec-title' title='", tableTitle, "'>", tableTitle, "</span><span class='sec-total'></span></h3>",
						"<div class='sub-sec-content' id='tableSection", componentId, "'><ul class='v-graph'>",
						"<li class='v-g'><div id='tableGraph", componentId, "' class='tmln-table-graph'></div></li></ul></div><div class='tmln-disc'><span><br />", i18n.TABLE_GRAPH_DISCLAIMER, "</span></div></div>");
            sHTML = sHTMLArray.join("");

            countText = "";
            MP_Util.Doc.FinalizeComponent(sHTML, component, countText);

            /************************* Prepare Data ******************************/
            var vsData = [], bpData = [[[]], [[]], [[]], [[]], [[]], [[]]], prevSeq = -1, vsSeq = -1, vsMaxSeq = 9, bpMaxSeq = vsMaxSeq + 6;
            var vsShapes = ['filledHeart', 'filledHeart', 'filledSquare', 'filledRectVertical', 'filledTriangleDown', 'filledTriangleUp', 'filledStar', 'filledTriangleRight', 'filledTriangleLeft', 'plus'];
            var vsColors = ['#E41A1C', '#970000', '#0CB9CE', '#FF4A00', '#4DAF4A', '#000064', '#0032FF', '#104404', '#64336A', '#FF8000'];
            for (var i = 0, tmlnLen = timeline.length; i < tmlnLen; i++) {
                var vDate = new Date();
                vDate.setISO8601(timeline[i].EVAL_EVENT_END_DT_TM_UTC);
                var formattedDate = df.format(vDate, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                var formattedValue = CERN_VS_TIMELINE_O1.formatResult(timeline[i].VALUE);
                var unitDisp = (timeline[i].VALUE_UNITS !== "") ? [" (", timeline[i].VALUE_UNITS, ")"].join("") : "", shownSeries = false,
					nlStr = (timeline[i].NORMAL_LOW && timeline[i].NORMAL_LOW !== "") ? ["<br/><span style='font-weight:bolder'>", i18n.NORMAL_LOW, ":</span>&nbsp;", CERN_VS_TIMELINE_O1.formatResult(timeline[i].NORMAL_LOW)].join("") : "",
					nhStr = (timeline[i].NORMAL_HIGH && timeline[i].NORMAL_HIGH !== "") ? ["<br/><span style='font-weight:bolder'>", i18n.NORMAL_HIGH, ":</span>&nbsp;", CERN_VS_TIMELINE_O1.formatResult(timeline[i].NORMAL_HIGH)].join("") : "",
					clStr = (timeline[i].CRITICAL_LOW && timeline[i].CRITICAL_LOW !== "") ? ["<br/><span style='font-weight:bolder'>", i18n.CRITICAL_LOW, ":</span>&nbsp;", CERN_VS_TIMELINE_O1.formatResult(timeline[i].CRITICAL_LOW)].join("") : "",
					chStr = (timeline[i].CRITICAL_HIGH && timeline[i].CRITICAL_HIGH !== "") ? ["<br/><span style='font-weight:bolder'>", i18n.CRITICAL_HIGH, ":</span>&nbsp;", CERN_VS_TIMELINE_O1.formatResult(timeline[i].CRITICAL_HIGH)].join("") : "",
				    dateDisp = [formattedDate.toString()].join(""),
					valueDisp = [formattedValue.toString()].join("");

                if (parseInt(timeline[i].VALUE_SEQ, 10) <= (vsMaxSeq + 1)) {
                    if (prevSeq !== timeline[i].VALUE_SEQ) {
                        vsData.push([[]]);
                        vsSeq++;
                        prevSeq = timeline[i].VALUE_SEQ;
                        if (timeline[i].SHOWN_IND === 1) {
                            shownSeries = true;
                        }
                        vsData[vsSeq].push({ xaxis: 'x2axis', minY: parseFloat(timeline[i].VALUE), maxY: parseFloat(timeline[i].VALUE), lineWidth: 2, show: shownSeries, label: timeline[i].NAME + unitDisp, color: vsColors[(parseInt(timeline[i].VALUE_SEQ, 10) - 1) % (vsColors.length)], markerOptions: { style: vsShapes[(parseInt(timeline[i].VALUE_SEQ, 10) - 1) % (vsShapes.length)] }, pointLabels: { show: false} });
                    }
                    vsData[vsSeq][0].push([vDate.getTime(), timeline[i].VALUE, nlStr, nhStr, clStr, chStr, timeline[i].NAME + unitDisp, dateDisp, valueDisp]);
                    vsData[vsSeq][1].minY = (vsData[vsSeq][1].minY > parseFloat(timeline[i].VALUE)) ? parseFloat(timeline[i].VALUE) : vsData[vsSeq][1].minY;
                    vsData[vsSeq][1].maxY = (vsData[vsSeq][1].maxY < parseFloat(timeline[i].VALUE)) ? parseFloat(timeline[i].VALUE) : vsData[vsSeq][1].maxY;
                }
                else if (parseInt(timeline[i].VALUE_SEQ, 10) <= (bpMaxSeq + 1)) {
                    var bpSeq = (parseInt(timeline[i].VALUE_SEQ, 10) - (vsMaxSeq + 2));
                    bpData[bpSeq][0].push([vDate.getTime(), timeline[i].VALUE, nlStr, nhStr, clStr, chStr, timeline[i].CLINSIG_UPDT_DT_TM, dateDisp, timeline[i].EVENT_END_DT_TM]);
                }
            }

            var iMinDate = new Date();
            iMinDate.setISO8601(recordData.MIN_DT_TM_UTC);

            var iMaxDate = new Date();
            /* precalculating to make consistent after zooming */
            DAR_HELPERS.createdNow = false;
            var tickVals = DAR_HELPERS.DynamicRangeTickCalc(iMinDate.getTime(), iMaxDate.getTime()), tickLen = tickVals.length;
            var newDtMin = (tickLen > 1) ? tickVals[0] : 0;
            var newDtMax = (tickLen > 1) ? tickVals[tickLen - 1] : tickVals[0];

            /* setting up axis options */
            var yAxis = { autoscale: true, numberTicks: null, ticks: [], tickInterval: null, tickOptions: { fontSize: 12, mark: 'outside', showGridline: true, formatString: '%.0f' }, pad: 10, min: null, max: null};
            var xAxis = { show: true, autoscaleOnZoom: false, useSeriesColor: false, renderer: $.jqplot.DateAxisRenderer, labelRenderer: $.jqplot.CanvasAxisLabelRenderer, tickOptions: { fontSize: 12, mark: 'outside', showGridline: true }, useDST: false, specialFormat: true, specialFormatFlag: 1, autoscale: false, pad: 1, min: newDtMin, max: newDtMax };
            var x2Axis = { show: true, autoscaleOnZoom: false, useSeriesColor: false, renderer: $.jqplot.DateAxisRenderer, labelRenderer: $.jqplot.CanvasAxisLabelRenderer, tickOptions: { fontSize: 12, mark: 'outside', showGridline: true }, useDST: false, specialFormat: true, specialFormatFlag: 0, autoscale: false, pad: 1, min: newDtMin, max: newDtMax };
            var x2Axis_tbl = { show: true, autoscaleOnZoom: false, useSeriesColor: false, renderer: $.jqplot.DateAxisRenderer, labelRenderer: $.jqplot.CanvasAxisLabelRenderer, tickOptions: { fontSize: 12, mark: 'outside', showGridline: true }, useDST: false, specialFormat: true, specialFormatFlag: 2, autoscale: false, pad: 1, min: newDtMin, max: newDtMax };
            /************************ Creating Graphs *****************************/
           	if (graphData.gPlots.length > 0) {
				graphData.gPlots.splice(0,graphData.gPlots.length);
			}
            graphData.gPlots.push(MP_GRAPHS.drawCtrGraph("ctrGraph" + componentId, "resetBtns" + componentId, "MP_GRAPHS.getGraphDataByComponentId(" + componentId + ").gPlots[0]", null, x2Axis, yAxis, componentId));

            if (vsData.length > 0 && vsData[0].length > 0) {
                graphData.gPlots.push(MP_GRAPHS.drawChoiceGraph("vsGraph" + componentId, "vsSelect" + componentId, ["MP_GRAPHS.getGraphDataByComponentId(" + componentId + ").gPlots[", graphData.gPlots.length, "]"].join(""), 3, vsData, null, x2Axis, yAxis, componentId));
                $.jqplot.Cursor.zoomProxy(graphData.gPlots[graphData.gPlots.length - 1], graphData.gPlots[0], true);
            }
            else {
                _g("vsSection" + componentId).innerHTML = ["<dl class='", nameSpace, "-info'><dt><dd><span>", i18n.NO_RESULTS_FOUND, "</span></dd></dt></dl>"].join("");
            }
            // Insert Blood Pressure Graph only if section is set to show
            if (component.isBloodPressureDisplayed()){
                if (bpData[0][0].length > 0 || bpData[1][0].length > 0 || bpData[2][0].length > 0 || bpData[3][0].length > 0 || bpData[4][0].length > 0 || bpData[5][0].length > 0) {
                    graphData.gPlots.push(MP_GRAPHS.drawWhiskerGraph("bpGraph" + componentId, "bpSelect" + componentId, ["MP_GRAPHS.getGraphDataByComponentId(" + componentId + ").gPlots[", graphData.gPlots.length, "]"].join(""), bpData, null, x2Axis, yAxis, componentId));
                    $.jqplot.Cursor.zoomProxy(graphData.gPlots[graphData.gPlots.length - 1], graphData.gPlots[0], true);
                }
                else {
                    _g("bpSection" + componentId).innerHTML = ["<dl class='", nameSpace, "-info'><dt><dd><span>", i18n.NO_RESULTS_FOUND, "</span></dd></dt></dl>"].join("");
                }
            }
            if (graphData.gPlots.length > 1) {
                MP_GRAPHS.drawTableGraph("tableGraph" + componentId, componentId);
            }
            else {
                _g("tableSection" + componentId).innerHTML = ["<dl class='", nameSpace, "-info'><dt><dd><span>", i18n.NO_RESULTS_FOUND, "</span></dd></dt></dl>"].join("");
            }
            return;
        },
        // function to calculate the precision of the value being plotted
        calculatePrecision: function (valRes) {
            var precision = 0;
            var strVal = valRes + '';
            var decLoc = strVal.search(/\.(\d)/);  						//locate the decimal point
            if (decLoc !== -1) {
                var strSize = strVal.length;
                precision = strSize - decLoc - 1;
            }
            return precision;
        },
        // function to format numeric values
        formatResult: function (valRes) {
            var nf = new mp_formatter.NumericFormatter(MPAGE_LOCALE);
            var result = 0.0;
            if (!isNaN(valRes)) {
                var prec = CERN_VS_TIMELINE_O1.calculatePrecision(valRes);
                result = nf.format(valRes, "." + prec);
            }
            else {
                result = null;
            }

            return result;
        }
    };
} ();
