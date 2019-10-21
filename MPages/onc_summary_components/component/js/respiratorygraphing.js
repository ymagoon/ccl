function RespTimelineComponentStyle() {
    this.initByNamespace("resp-tmln");
}
RespTimelineComponentStyle.inherits(ComponentStyle);

/**
* The Respiratory Timeline component will retrieve all information associated to the patient
* 		and display in a timeline view
*
* @param {Criterion} criterion
*/
function RespTimelineComponent(criterion) {
    this.setCriterion(criterion);
    this.setStyles(new RespTimelineComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.TIMELINE_RESP.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.TIMELINE_RESP.O1 - render component");
    this.setIncludeLineNumber(false);
    //if ($.browser.msie && parseInt($.browser.version, 10) <= 6) {
        //this.setAlwaysExpanded(true);
    //}

    RespTimelineComponent.method("getDefaultSelected", function () {
        return (this.m_def_select);
    });
    RespTimelineComponent.method("setDefaultSelected", function (value) {
        this.m_def_select = value;
    });
    RespTimelineComponent.method("addDefaultSelected", function (value) {
        if (!this.m_def_select) {
            this.m_def_select = [];
        }
        this.m_def_select.push(value);
    });
    /* generic function that lets the object know how many CE groups there are */
    RespTimelineComponent.method("getDataNum", function () {
        return ((this.m_data_num) ? this.m_data_num : 0);
    });
    RespTimelineComponent.method("setDataNum", function (value) {
        this.m_data_num = value;
        if (this.m_data_num) {
            for (var data_cnt = 0; data_cnt < this.m_data_num; data_cnt++) {
                eval(["RespTimelineComponent.method('getTimelineCds", (data_cnt + 1), "', function (){return this.m_temp", (data_cnt + 1), ";});"].join(""));
                eval(["RespTimelineComponent.method('setTimelineCds", (data_cnt + 1), "', function (value){this.m_temp", (data_cnt + 1), " = value;});"].join(""));
                eval(["RespTimelineComponent.method('addTimelineCd", (data_cnt + 1), "', function (value){if (this.m_temp", (data_cnt + 1), " == null) this.m_temp", (data_cnt + 1), " = []; this.m_temp", (data_cnt + 1), ".push(value);});"].join(""));
            }
        }
    });

    this.setDataNum(15); /* should only be 15 values used */
    RespTimelineComponent.method("InsertData", function () {
        CERN_RESP_TIMELINE_O1.GetRespTimelineData(this);
    });

    RespTimelineComponent.method("HandleSuccess", function (recordData) {
        CERN_RESP_TIMELINE_O1.RenderRespTimeline(this, recordData);
    });
}

/*
MPageComponent is defined in js/core/mp_component_defs.js
*/
RespTimelineComponent.inherits(MPageComponent);

/**
* Vital Sign Timeline methods
* @namespace CERN_RESP_TIMELINE_O1
* @static
* @global
*/
var CERN_RESP_TIMELINE_O1 = function () {
    return {
        GetRespTimelineData: function (component) {
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
        RenderRespTimeline: function (component, recordData) {
            var countText = "", sHTML = "", jsHTML = [],
                nameSpace = component.getStyles().getNameSpace(),
                timeline = recordData.QUAL,
                timeline_cnt = recordData.QUAL_CNT;
            var df = MP_Util.GetDateFormatter();
            var timeline_dt_tm = df.formatISO8601(recordData.MIN_DT_TM_UTC, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
            var componentId = component.getComponentId();
            var graphData = MP_GRAPHS.getGraphDataByComponentId(componentId);

            /************************* Create HTML *******************************/
            var cntrTitle = [i18n.MASTER_GRAPH, "&nbsp;(", timeline_dt_tm, " ----> ", i18n.CURRENT, ")"].join("");
            var vsTitle = [i18n.RESP_MONITORING, i18n.ACCORDING_TO_ZOOM].join("");
            var tableTitle = [i18n.ALL_DATA, i18n.ACCORDING_TO_ZOOM].join("");
            var subSecTgl = "";

            if (component.isAlwaysExpanded() && !component.isExpanded()) {
                subSecTgl = "closed ";
            }

            jsHTML.push("<div class='", subSecTgl, "sub-sec'><h3 class='sub-sec-hd'>",
						"<span class='sub-sec-title' title='", cntrTitle, "'>", cntrTitle, "</span><span class='sec-total'></span></h3>",
						"<div class='sub-sec-content'><ul class='v-graph'>",
						"<li class='legend'><div id='resetBtns", componentId, "' class='resp-tmln-graph-selection resp-tmln-reset-buttons'></div></li>",
						"<li class='v-g'><div id='ctrGraph", componentId, "' class='resp-tmln-control-graph'></div></li></ul></div></div>",

						"<div class='", subSecTgl, "sub-sec'><h3 class='sub-sec-hd'>",
						"<span class='sub-sec-title' title='", vsTitle, "'>", vsTitle, "</span><span class='sec-total'></span></h3>",
						"<div class='sub-sec-content'><ul class='v-graph'>",
						"<li class='legend'><div id='respSelect", componentId, "' class='resp-tmln-graph-selection resp-tmln-vitals-selection'></div></li>",
						"<li class='v-g'><div id='respGraph", componentId, "' class='resp-tmln-vitals-graph'></div></li></ul></div></div>",

						"<div class='", subSecTgl, "sub-sec'><h3 class='sub-sec-hd'>",
						"<span class='sub-sec-title' title='", tableTitle, "'>", tableTitle, "</span><span class='sec-total'></span></h3>",
						"<div class='sub-sec-content' id='tableSection", componentId, "'><ul class='v-graph'>",
						"<li class='v-g'><div id='tableGraph", componentId, "' class='resp-tmln-table-graph'></div></li></ul><span><b>", i18n.TABLE_GRAPH_DISCLAIMER, "</b></span></div></div>");

            countText = "";
            sHTML = jsHTML.join("");

            MP_Util.Doc.FinalizeComponent(sHTML, component, countText);

            /************************* Prepare Data ******************************/
            var respData = [], tableData = [], prevSeq = -1, respSeq = -1;
                        	
           	var respShapes = ['filledHeart', 'filledSquare', 'filledStar', 'filledTriangleUp', 'filledTriangleDown', 'filledRectVertical', 'filledStar', 'filledTriangleRight', 'filledTriangleLeft', 'plus'],
				respColors = ['#E41A1C', '#0CB9CE', '#0032FF', '#000064', '#4DAF4A', '#FF4A00', '#0032FF', '#104404', '#64336A', '#FF8000'];

				
            for (var i = 0, tmlnLen = timeline.length; i < tmlnLen; i++) {
                var vDate = new Date();
                vDate.setISO8601(timeline[i].EVAL_EVENT_END_DT_TM_UTC);
                var formattedDate = df.format(vDate, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                var formattedValue = CERN_RESP_TIMELINE_O1.formatResult(timeline[i].VALUE);
                var unitDisp = (timeline[i].VALUE_UNITS && timeline[i].VALUE_UNITS !== "") ? " (" + timeline[i].VALUE_UNITS + ")" : "", shownSeries = false;
                var nlStr = (timeline[i].NORMAL_LOW && timeline[i].NORMAL_LOW !== "") ? ["<br/><span style='font-weight:bolder'>", i18n.NORMAL_LOW, ":</span>&nbsp;", CERN_RESP_TIMELINE_O1.formatResult(timeline[i].NORMAL_LOW)].join("") : "",
					nhStr = (timeline[i].NORMAL_HIGH && timeline[i].NORMAL_HIGH !== "") ? ["<br/><span style='font-weight:bolder'>", i18n.NORMAL_HIGH, ":</span>&nbsp;", CERN_RESP_TIMELINE_O1.formatResult(timeline[i].NORMAL_HIGH)].join("") : "",
					clStr = (timeline[i].CRITICAL_LOW && timeline[i].CRITICAL_LOW !== "") ? ["<br/><span style='font-weight:bolder'>", i18n.CRITICAL_LOW, ":</span>&nbsp;", CERN_RESP_TIMELINE_O1.formatResult(timeline[i].CRITICAL_LOW)].join("") : "",
					chStr = (timeline[i].CRITICAL_HIGH && timeline[i].CRITICAL_HIGH !== "") ? ["<br/><span style='font-weight:bolder'>", i18n.CRITICAL_HIGH, ":</span>&nbsp;", CERN_RESP_TIMELINE_O1.formatResult(timeline[i].CRITICAL_HIGH)].join("") : "",
					dateDisp = [formattedDate.toString()].join(""),
					valueDisp = [formattedValue.toString()].join("");
                if (prevSeq != timeline[i].VALUE_SEQ) {
                    respData.push([[]]);
                    respSeq++;
                    prevSeq = timeline[i].VALUE_SEQ;
                    if (timeline[i].SHOWN_IND === 1) {
                        shownSeries = true;
                    }
                    respData[respSeq].push({
                        xaxis: 'x2axis',
                        minY: parseFloat(timeline[i].VALUE),
                        maxY: parseFloat(timeline[i].VALUE),
                        lineWidth: 2,
                        show: shownSeries,
                        label: timeline[i].NAME + unitDisp,
                        color: respColors[(parseInt(timeline[i].VALUE_SEQ, 10) - 1) % (respColors.length)],
                        markerOptions: {
                            style: respShapes[(parseInt(timeline[i].VALUE_SEQ, 10) - 1) % (respShapes.length)]
                        },
                        pointLabels: {
                            show: false
                        }
                    });
                }
                respData[respSeq][0].push([vDate.getTime(), timeline[i].VALUE, nlStr, nhStr, clStr, chStr, timeline[i].NAME + unitDisp, dateDisp, valueDisp]);
                respData[respSeq][1].minY = (respData[respSeq][1].minY > parseFloat(timeline[i].VALUE)) ? parseFloat(timeline[i].VALUE) : respData[respSeq][1].minY;
                respData[respSeq][1].maxY = (respData[respSeq][1].maxY < parseFloat(timeline[i].VALUE)) ? parseFloat(timeline[i].VALUE) : respData[respSeq][1].maxY;
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
            var yAxis = { autoscale: true, numberTicks: null, ticks: [], tickInterval: null, tickOptions: { fontSize: 12, mark: 'outside', showGridline: true, formatString: '%.0f' }, pad: 10, min: null, max: null };
            var xAxis = { show: true, autoscaleOnZoom: false, useSeriesColor: false, renderer: $.jqplot.DateAxisRenderer, labelRenderer: $.jqplot.CanvasAxisLabelRenderer, tickOptions: { fontSize: 12, mark: 'outside', showGridline: true }, useDST: false, specialFormat: true, specialFormatFlag: 1, autoscale: false, pad: 1, min: newDtMin, max: newDtMax };
            var x2Axis = { show: true, autoscaleOnZoom: false, useSeriesColor: false, renderer: $.jqplot.DateAxisRenderer, labelRenderer: $.jqplot.CanvasAxisLabelRenderer, tickOptions: { fontSize: 12, mark: 'outside', showGridline: true }, useDST: false, specialFormat: true, specialFormatFlag: 0, autoscale: false, pad: 1, min: newDtMin, max: newDtMax };
            var x2Axis_tbl = { show: true, autoscaleOnZoom: false, useSeriesColor: false, renderer: $.jqplot.DateAxisRenderer, labelRenderer: $.jqplot.CanvasAxisLabelRenderer, tickOptions: { fontSize: 12, mark: 'outside', showGridline: true }, useDST: false, specialFormat: true, specialFormatFlag: 2, autoscale: false, pad: 1, min: newDtMin, max: newDtMax };

            /************************ Creating Graphs *****************************/
            graphData.gPlots.push(MP_GRAPHS.drawCtrGraph("ctrGraph" + componentId, "resetBtns" + componentId, "MP_GRAPHS.getGraphDataByComponentId(" + componentId + ").gPlots[0]", null, x2Axis, yAxis, componentId));
            graphData.gPlots.push(MP_GRAPHS.drawChoiceGraph("respGraph" + componentId, "respSelect" + componentId, "MP_GRAPHS.getGraphDataByComponentId(" + componentId + ").gPlots[1]", 3, respData, null, x2Axis, yAxis, componentId));
            $.jqplot.Cursor.zoomProxy(graphData.gPlots[graphData.gPlots.length - 1], graphData.gPlots[0], true);
            MP_GRAPHS.drawTableGraph("tableGraph" + componentId, componentId);
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
                var prec = CERN_RESP_TIMELINE_O1.calculatePrecision(valRes);
                result = nf.format(valRes, "." + prec);
            }
            else {
                result = null;
            }

            return result;
        }
    };
} ();