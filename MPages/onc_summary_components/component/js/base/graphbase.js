Date.ABBR_MONTHNAMES = [];
Date.MONTHNAMES = [];

var MP_GRAPHS = function() {
	var m_graphDataAr = [];

	function GraphDataItem(componentId) {
		if(componentId <= 0) {
			alert("'componentId' must be greater than zero.");
			return;
		}
		this.componentId = componentId;
		this.windowResize = 0;
		this.choiceData = [];
		this.gPlots = [];
		this.isZoomed = false;
		this.invLines = [];
		this.invSys = [];
		this.invDia = [];
		this.invMAP = [];
		this.tInv = [];
		this.tInvMAP = [];
		this.nonLines = [];
		this.nonSys = [];
		this.nonDia = [];
		this.nonMAP = [];
		this.tNon = [];
		this.tNonMAP = [];
		this.bpValuesShown = '';
		this.tData = [];
		this.oGraphWidth = 0;
		this.widthInit = 1;
	}

	return {
		i18nInitDone: false,
		dateSort: function(thisObj, thatObj) {
			return thisObj[0] - thatObj[0];
		},

		getGraphDataByComponentId: function(componentId) {
			var retItem = m_graphDataAr[componentId];
			if(!retItem) {
				retItem = new GraphDataItem(componentId);
				m_graphDataAr[componentId] = retItem;
			}
			return retItem;
		},

		addGraphData: function(graphData) {
			m_graphDataAr[graphData.componentId] = graphData;
		},

		// function to calculate the precision of the value being plotted
		calculatePrecision: function(valRes) {
			var precision = 0;
			var strVal = valRes + '';
			var decLoc = strVal.search(/\.(\d)/);
			//locate the decimal point
			if(decLoc !== -1) {
				var strSize = strVal.length;
				precision = strSize - decLoc - 1;
			}
			return precision;
		},

		// function to format numeric values
		formatResult: function(valRes) {
			var nf = new mp_formatter.NumericFormatter(MPAGE_LOCALE);
			var result = 0.0;
			if(!isNaN(valRes)) {
				var prec = MP_GRAPHS.calculatePrecision(valRes);
				result = nf.format(valRes, "." + prec);
			}
			else {
				result = null;
			}
			return result;
		},

		/* helper function for selectSeries, drawWhiskerGraph, and drawChoiceGraph */
		findMinMax: function(iPlot, compId) {
			var graphData = MP_GRAPHS.getGraphDataByComponentId(compId);
			var xAxis = iPlot.axes.x2axis;
			var txtZoom = _g("zoomStatus" + compId);

			if(xAxis && txtZoom) {
				if(graphData.isZoomed) {
					var min = $.jsDate.createDate(xAxis.min);
					var max = $.jsDate.createDate(xAxis.max);
					txtZoom.innerHTML = [$.jsDate.strftime(min,"%#m/%#d/%y&nbsp;%H:%M"), " - ", $.jsDate.strftime(max,"%#m/%#d/%y&nbsp;%H:%M")].join("");
				}
				else {
					txtZoom.innerHTML = i18n.NO_ZOOM_APPLIED;
				}
			}
			for(var i = 0, sLen = iPlot.series.length; i < sLen; i++) {
				var normRangeObj = _g("minMax" + iPlot.targetId.replace(/\#/, "") + "_" + i);
				if(normRangeObj) {
					var pAxis = iPlot.series[i].xaxis;
					var minX = iPlot.axes[pAxis].min, maxX = iPlot.axes[pAxis].max;
					var minY = Number.POSITIVE_INFINITY;
					var maxY = Number.NEGATIVE_INFINITY;
					var tempMinY = minY;
					var tempMaxY = maxY;

					for(var j = 0, dLen = iPlot.series[i].data.length; j < dLen; j++) {
						if(parseInt(iPlot.series[i].data[j][0], 10) >= minX && parseInt(iPlot.series[i].data[j][0], 10) <= maxX) {
							if(parseFloat(iPlot.series[i].data[j][1]) < minY) {
								tempMinY = iPlot.series[i].data[j][1];
								minY = MP_GRAPHS.formatResult(parseFloat(Math.round(tempMinY * 10) / 10));
							}
							if(parseFloat(iPlot.series[i].data[j][1]) > maxY) {
								tempMaxY = iPlot.series[i].data[j][1];
								maxY = MP_GRAPHS.formatResult(parseFloat(Math.round(tempMaxY * 10) / 10));
							}
						}
					}
					if(minY != Number.POSITIVE_INFINITY && maxY != Number.NEGATIVE_INFINITY) {
						normRangeObj.innerHTML = (minY != Number.POSITIVE_INFINITY) ? ["&nbsp;[", minY, " - ", maxY, "]"].join("") : "";
					}
					else {
						normRangeObj.innerHTML = "";
					}
				}
			}
			return true;
		},

		/* helper function for drawTableGraph and selectSeries (reset) */
		updateTableData: function(iPlot, iData) {
			var xAxis = iPlot.axes.x2axis;
			var i = 0;

			/* getting ticks that will be created and creating buckets. */
			var cTicks = [];
			for( i = 0, tLen = xAxis._ticks.length; i < tLen; i++) {
				var tempTick = xAxis._ticks[i];
				if(!tempTick.showGridline) {
					if(i === 0) {
						cTicks.push({
							'minDtTm': tempTick.value,
							'maxDtTm': new Date().getTime()
						});
					}
					else {
						cTicks[cTicks.length - 1].maxDtTm = tempTick.value;
						cTicks.push({
							'minDtTm': tempTick.value,
							'maxDtTm': new Date().getTime()
						});
					}
				}
			}
			var cCnt = cTicks.length;
			for( i = 0, dLen = iData.length; cCnt > 0 && i < dLen; i++) {
				var updtData = [], labels = [];
				for(var j = 0, d2Len = iData[i].length; j < d2Len; j++) {
					var newDtTm = $.jsDate.createDate(iData[i][j][0]), newTm = newDtTm.getTime();
					for(var k = 0; k < cCnt; k++) {
						if(newTm >= cTicks[k].minDtTm && newTm < cTicks[k].maxDtTm) {
							if(updtData.length > 0 && updtData[updtData.length - 1][0] == cTicks[k].minDtTm) {
								labels[labels.length - 1] = iData[i][j][2];
								updtData[updtData.length - 1][2] = iData[i][j][2];
							}
							else {
								labels.push(iData[i][j][2]);
								updtData.push([cTicks[k].minDtTm, iData[i][j][1], iData[i][j][2]]);
							}
						}
					}
				}
				iPlot.series[i].plugins.pointLabels.labels = labels;
				iPlot.series[i].data = updtData;
			}

		},

		/* helper function for showBPData, selectSeries, drawCtrGraph, drawChoiceGraph, and drawWhiskerGraph */
		updateYAxis: function(iSeries, iAxis) {
			var minVal = Number.POSITIVE_INFINITY, maxVal = Number.NEGATIVE_INFINITY;
			for(var i = 0, sLen = iSeries.length; i < sLen; i++) {
				if(iSeries[i].show && iSeries[i].minY && iSeries[i].maxY) {
					minVal = Math.min(minVal, parseFloat(iSeries[i].minY));
					maxVal = Math.max(maxVal, parseFloat(iSeries[i].maxY));
				}
			}
			var isPositive = (minVal > 0);
			var newMax = (maxVal != Number.NEGATIVE_INFINITY) ? maxVal * 1.1 : 1;
			var newMin = (minVal != Number.POSITIVE_INFINITY) ? minVal * 0.9 : 0;
			newMin = (isPositive && newMin < 0) ? 0 : newMin;
			iAxis.min = newMin;
			iAxis.max = (newMin == newMax) ? newMax + 1 : newMax;
		},

		/* helper function for drawWhiskerGraph */
		drawWhiskerLines: function(iPlot, compId) {
			var graphData = MP_GRAPHS.getGraphDataByComponentId(compId);
			var ctx = iPlot.eventCanvas._ctx;
			eval(["var bpArr = MP_GRAPHS.getGraphDataByComponentId(", compId, ").", ((graphData.bpValuesShown !== '') ? graphData.bpValuesShown + "Lines;" : "[];")].join(""));

			var xAxis = iPlot.axes.x2axis;
			var yAxis = iPlot.axes.yaxis;
			for(var i = 0, bpLen = bpArr.length; i < bpLen; i++) {
				ctx.save();
				ctx.beginPath();
				ctx.moveTo(Math.round(xAxis.series_u2p(bpArr[i][0])), Math.round(yAxis.series_u2p(bpArr[i][2])));
				ctx.lineTo(Math.round(xAxis.series_u2p(bpArr[i][1])), Math.round(yAxis.series_u2p(bpArr[i][3])));
				ctx.strokeStyle = '#000000';
				ctx.stroke();
				ctx.restore();
			}
		},

		/* helper function for all graphs to resize accordingly */
		resizeGraph: function(iPlotTarget, compId) {
			var graphData = MP_GRAPHS.getGraphDataByComponentId(compId);
			var target = $(iPlotTarget);
			var graphClass = target.parent().parent().parent().parent().parent().parent();
			var containerWidth = graphClass.innerWidth();
			var legend = target.parent().parent().children(".legend");
			var legendWidth = (legend && legend.length > 0 && !isNaN(legend.innerWidth())) ? legend.innerWidth() : 0;
			var graphWidth = ( containerWidth - legendWidth) * 0.90;
			target.css("width", graphWidth + "px");
			if(graphData.widthInit === 1) {
				graphData.widthInit = 0;
				graphData.oGraphWidth = graphWidth;
			}
		},
		
		
		/* Get the proper sprite image icon for all graph legends */
		legendIcon: function(fillStyle, lineColor) {
			var iconClass;
			var lowerFillStyle = fillStyle.toLowerCase();
			switch (lowerFillStyle){
  					case "filledheart": 
  						if(lineColor === "#E41A1C"){
  							iconClass = lowerFillStyle +"-red"; //red heart
  						}
  						else{
  							iconClass = lowerFillStyle+"-maroon";  // maroon heart
  						}
  				        break;
  					
  					default:
  						iconClass = lowerFillStyle;
  						break;                 
			}
			return(iconClass);
		},

		/**
		 * This function displays an empty graph with a reset button that can shown or not shown according to user specifications.
		 *		NOTES: 	* Time data points must have the timestamp set to a Non-UTC value.
		 *				* Page must be loaded and DOM created before running this function.
		 *
		 * @param {String} iId: DOM Id of main graph. REQUIRED
		 * @param {String} iBtns: DOM Id of where to place reset button. If null or blank, then it is not shown.
		 * @param {String} assignedTo: variable name that this function is going to return the "plot" to.
		 * @param {Object} iX1AxisObj: x Axis 1 Options object. Will be on bottom of graph. Null will not show axis. (see jqPlotOptions.txt => axesDefault)
		 * @param {Object} iX2AxisObj: x Axis 2 Options object. Will be on top of graph. REQUIRED. (see jqPlotOptions.txt => axesDefault)
		 * @param {Object} iYAxisObj: y Axis 1 Options object. Will be to the left of graph. REQUIRED. (see jqPlotOptions.txt => axesDefault)
		 * @param {Long} compId: The id of the component object that is executing the drawing of the control graph.  REQUIRED
		 * @author Brian Heits
		 */
		drawCtrGraph: function(iId, iBtns, assignedTo, iXAxisObj, iX2AxisObj, iYAxisObj, compId) {
			var graphData = MP_GRAPHS.getGraphDataByComponentId(compId);
			MP_GRAPHS.initI18nArrays();
			var tPlot = null, shownData = [[[1]]], sSeries = [{
				xaxis: 'x2axis',
				show: false,
				label: "controller",
				color: "#ffffff",
				markerOptions: {
					style: "filledCircle"
				}
			}], sCnt = 0;
			if(iBtns && assignedTo) {
				$("#" + iBtns).html(["<div class='btns'><input type='reset' value='", i18n.RESET, "' onclick=\"MP_GRAPHS.resetGraph(", assignedTo, ",", compId, ");\"/><br/><span id='zoomStatus", compId, "'>", i18n.NO_ZOOM_APPLIED, "</span></div>"].join(""));
			}
			MP_GRAPHS.updateYAxis(sSeries, iYAxisObj);
			MP_GRAPHS.resizeGraph("#" + iId, compId);
			/* plotting graph */
			tPlot = $.jqplot(iId, shownData, {
				graphName: iId,
				performOnPlot: function() {
					MP_GRAPHS.resizeGraph(tPlot.targetId, compId);
				},

				performAfterPlot: function() {
					if(graphData.isZoomed && !tPlot.plugins.cursor.zoomOnController) {
						drawZoomBox.call(tPlot.plugins.cursor);
					}
				},

				seriesDefaults: {
					neighborThreshold: 0
				},
				cursor: {
					zoom: true,
					showTooltip: false,
					constrainZoomTo: 'x',
					snapZoomTo: 'minutes',
					dblClickReset: false,
					performAfterZoom: function() {
						tPlot.redraw();
						MP_GRAPHS.drawTableGraph("tableGraph" + compId, compId);
					},

					performOnZoom: function() {
						tPlot.redraw();
						drawZoomBox.call(tPlot.plugins.cursor);
					}

				},
				highlighter: {
					showTooltip: false
				},
				axes: {
					xaxis: iXAxisObj,
					x2axis: iX2AxisObj,
					yaxis: iYAxisObj
				},
				legend: {
					show: false
				},
				series: sSeries
			});
			/* window resize has two events.  We want to replot ONLY after window has stopped resizing.  */
			$(window).resize(function() {
				var graphData = MP_GRAPHS.getGraphDataByComponentId(compId);
				var target = $("#" + iId);
				var graphClass = target.parent().parent().parent().parent().parent().parent();
				var containerWidth = graphClass.innerWidth();
				var legend = target.parent().parent().children(".legend");
				var legendWidth = (legend && legend.length > 0 && !isNaN(legend.innerWidth())) ? legend.innerWidth() : 0;
				var graphWidth = ( containerWidth - legendWidth) * 0.90;
				if(graphData.gPlots.length > 0 && containerWidth > 0) {
					gPlotLen = graphData.gPlots.length;
					if(graphWidth != graphData.oGraphWidth) {
						graphData.oGraphWidth = graphWidth;
						for(var i = 0; i < gPlotLen; i++) {
							graphData.gPlots[i].replot();
						}
						MP_GRAPHS.drawTableGraph("tableGraph" + compId, compId);
					}
				}
			});

			return tPlot;
		},

		/**
		 * This function displays a line graph with selectable buttons for each series according to user specifications.
		 *		NOTES: 	* Time data points must have the timestamp set to a Non-UTC value.
		 *				* Page must be loaded and DOM created before running this function.
		 *
		 * @param {String} iId: DOM Id of main graph. REQUIRED
		 * @param {String} iSelect: DOM Id of choice select. If null or blank, then it is not shown
		 * @param {String} assignedTo: variable name that this function is going to return the "plot" to.
		 * @param {Number} maxSelected: Number specifying the maximum number of values to be shown at one time. REQUIRED
		 * @param {Array} iDataSeries: format [[[[xData,yData,normLowHTML,normHighHTML,critLowHTML,critHighHTML]],seriesOptionObject (see jqPlotOptions.txt => seriesDefault)]]
		 * @param {Object} iX1AxisObj: x Axis 1 Options object. Will be on bottom of graph. Null will not show axis. (see jqPlotOptions.txt => axesDefault)
		 * @param {Object} iX2AxisObj: x Axis 2 Options object. Will be on top of graph. REQUIRED. (see jqPlotOptions.txt => axesDefault)
		 * @param {Object} iYAxisObj: y Axis 1 Options object. Will be to the left of graph. REQUIRED. (see jqPlotOptions.txt => axesDefault)
		 * @param {Long} compId: The id of the component object that is executing the drawing of the control graph.  REQUIRED
		 * @author Brian Heits
		 */
		drawChoiceGraph: function(iId, iSelect, assignedTo, maxSelected, iDataSeries, iXAxisObj, iX2AxisObj, iYAxisObj, compId) {
			MP_GRAPHS.initI18nArrays();
			var tPlot = null, shownData = [], sSeries = [], bSeries = [], bHTML = [], sCnt = 0, oneShown = false, i = 0;
			var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
			var graphData = MP_GRAPHS.getGraphDataByComponentId(compId);
			for( i = 0, len = iDataSeries.length; i < len; i++, sCnt++) {
				shownData.push(iDataSeries[i][0].sort(MP_GRAPHS.dateSort));
				sSeries.push(iDataSeries[i][1]);
				
				//select the proper css class based on color and style
				var legendIconClass = this.legendIcon(sSeries[i].markerOptions.style,sSeries[i].color);
				
				if(iDataSeries[i][1].show) {
					oneShown = true;
				}
				if(iSelect && assignedTo) {
					if(iDataSeries[i][1] && iDataSeries[i][1].color && iDataSeries[i][1].markerOptions) {
						bSeries.push({
							size: 8,
							color: iDataSeries[i][1].color,
							style: iDataSeries[i][1].markerOptions.style
						});
					}
					bHTML.push("<div class='btns'><div  onclick=\"MP_GRAPHS.selectSeries(this,", maxSelected, ",", assignedTo, ",", compId,", \'", legendIconClass,"\');\" id='", iSelect, "btn_", sCnt, "' class='btn ", ((iDataSeries[i][1].show) ? "series-on" : "series-off")," graph-icon-sprite ",legendIconClass,"'>", "</div>&nbsp;<span>", iDataSeries[i][1].label, "<span id='minMax", iId, "_", sCnt, "'></span></span></div>");	
				} 
			}
			graphData.choiceData = shownData;
			if(!oneShown) {
				sSeries[0].show = true;
			}
						
			if(iSelect && assignedTo) {
				$("#" + iSelect).html(bHTML.join(""));
			}
			
			MP_GRAPHS.updateYAxis(sSeries, iYAxisObj);
			MP_GRAPHS.resizeGraph("#" + iId, compId);
			/* plotting graph */
			tPlot = $.jqplot(iId, shownData, {
				graphName: 'choiceGraph',
				performOnPlot: function() {
					MP_GRAPHS.resizeGraph(tPlot.targetId, compId);
					MP_GRAPHS.findMinMax(tPlot, compId);
				},

				seriesDefaults: {
					neighborThreshold: 0
				},
				cursor: {
					zoom: true,
					showTooltip: false,
					constrainZoomTo: 'x',
					snapZoomTo: 'minutes',
					dblClickReset: false,
					performAfterZoom: function() {
						tPlot.redraw();
						MP_GRAPHS.findMinMax(tPlot, compId);
					},

					performOnZoom: function() {
						graphData.isZoomed = true;
					}

				},
				axes: {
					xaxis: iXAxisObj,
					x2axis: iX2AxisObj,
					yaxis: iYAxisObj
				},
				highlighter: {
					sizeAdjust: 10,
					tooltipAxes: 'yx',
					tooltipLocation: 'nw',
					fadeTooltip: true,
					tooltipFadeSpeed: "slow",
					useAxesFormatters: true,
					formatString: ["<span style='font-weight:bolder'>%l:</span>&nbsp;%5<br/><span style='font-weight:bolder'>", i18n.RESULT_DT_TM, ":</span>&nbsp;%6%1%2%3%4"].join("")
				},
				legend: {
					show: false
				},
				series: sSeries
			});
			MP_GRAPHS.findMinMax(tPlot, compId);
			/* if all are not show initially, then show 1, plot, then redraw with all back to show:false.  Issue doing it the correct way where all are just "show:false" */
			if(!oneShown) {
				tPlot.series[0].show = false;
				sSeries[0].show = false;
				tPlot.redraw();
			}

			return tPlot;
		},

		/**
		 * This function displays a blood pressure whisker graph with radio buttons for each series according to user specifications.
		 *		NOTES: 	* Time data points must have the timestamp set to a Non-UTC value.
		 *				* Page must be loaded and DOM created before running this function.
		 *				* Colors/shapes will be defined in function, but can be overridden by setting in the series.
		 *				* Series 1 is Systolic Invasive, Series 2 is Diastolic Invasive, Series 3 is Systolic Non-Invasive, Series 4 is Diastolic Non-Invasive, Series 5 is
		 *					MAP Invasive, and Series 6 is MAP Non-invasive
		 *				* MAP will be calculated on the fly using the equation if no values are provided (2*DBP + SBP)/2
		 *
		 * @param {String} iId: DOM Id of main graph. REQUIRED
		 * @param {String} iRBtns: DOM Id of radio button select. If null or blank, then it is not shown
		 * @param {String} assignedTo: variable name that this function is going to return the "plot" to.
		 * @param {Array} iDataSeries: format [[[[xData,yData,normLowHTML,normHighHTML,critLowHTML,critHighHTML]],seriesOptionObject (see jqPlotOptions.txt => seriesDefault)]]
		 * @param {Object} iX1AxisObj: x Axis 1 Options object. Will be on bottom of graph. Null will not show axis. (see jqPlotOptions.txt => axesDefault)
		 * @param {Object} iX2AxisObj: x Axis 2 Options object. Will be on top of graph. REQUIRED. (see jqPlotOptions.txt => axesDefault)
		 * @param {Object} iYAxisObj: y Axis 1 Options object. Will be to the left of graph. REQUIRED. (see jqPlotOptions.txt => axesDefault)
		 * @param {Long} compId: The id of the component drawing the wisker graph.  REQUIRED
		 * @author Brian Heits
		 */
		drawWhiskerGraph: function(iId, iRBtns, assignedTo, iDataSeries, iXAxisObj, iX2AxisObj, iYAxisObj, compId) {
			MP_GRAPHS.initI18nArrays();
			var tPlot = null, shownData = [], sSeries = [], bSeries = [], bHTML = [], sCnt = 0;
			var bpColors = ["#E41A1C", "#E41A1C", "#E41A1C", "#E41A1C", "#104404", "#000064", "#000000"];
			var bpShapes = ["downVee", "upVee", "downVee", "upVee", "filledCircle", "filledCircle"];
			var graphData = MP_GRAPHS.getGraphDataByComponentId(compId);
			var wDataInv = [];
			var wDataNon = [];

			/* Determining min and max values */
			var maxSys = [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY], maxDia = [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY], maxMAP = [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY];
			var minSys = [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY], minDia = [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY], minMAP = [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY];

			/* setting up different events to be assigned to more recognizible variables */
			graphData.invSys = iDataSeries[0][0].sort(MP_GRAPHS.dateSort);
			graphData.invDia = iDataSeries[1][0].sort(MP_GRAPHS.dateSort);
			graphData.invMAP = iDataSeries[4][0].sort(MP_GRAPHS.dateSort);
			graphData.nonSys = iDataSeries[2][0].sort(MP_GRAPHS.dateSort);
			graphData.nonDia = iDataSeries[3][0].sort(MP_GRAPHS.dateSort);
			graphData.nonMAP = iDataSeries[5][0].sort(MP_GRAPHS.dateSort);

			/* Finding Matched Sys and Dia values.  If found and MAP array length is zero, calculate MAP */
			var invSysLen = graphData.invSys.length, invDiaLen = graphData.invDia.length, invMAPLen = graphData.invMAP.length;
			var nonSysLen = graphData.nonSys.length, nonDiaLen = graphData.nonDia.length, nonMAPLen = graphData.nonMAP.length;
			var maxInvL = Math.max(invSysLen, invDiaLen), invSysIsLonger = (maxInvL == invSysLen), minInvL = ((invSysIsLonger) ? invDiaLen : invSysLen);
			var maxNonL = Math.max(nonSysLen, nonDiaLen), nonSysIsLonger = (maxNonL == nonSysLen), minNonL = ((nonSysIsLonger) ? nonDiaLen : nonSysLen);
			var i = 0;
			var j = 0;
			var matchFnd = false;

			/* Performing matching for Invasive BP values */
			for( i = 0; i < maxInvL; i++) {
				matchFnd = false;
				for( j = 0; j < minInvL; j++) {
					if(invSysIsLonger) {
						if(graphData.invSys[i][6] == graphData.invDia[j][6] && graphData.invSys[i][7] == graphData.invDia[j][7]) {
							matchFnd = true;
							graphData.invLines.push([graphData.invSys[i][0], graphData.invSys[i][0], graphData.invSys[i][1], graphData.invDia[j][1]]);
							graphData.tInv.push([graphData.invSys[i][0], [graphData.invSys[i][1], "/", graphData.invDia[j][1]].join("")]);
							wDataInv.push([graphData.invSys[i][0], graphData.invSys[i][1], graphData.invDia[j][1]]);
						}
						else if(graphData.tInv.length === 0 || graphData.tInv[graphData.tInv.length - 1][0] < graphData.invDia[j][0]) {
							graphData.tInv.push([graphData.invDia[j][0], ["--/", graphData.invDia[j][1]].join("")]);
						}
						maxDia[0] = Math.max(maxDia[0], graphData.invDia[j][1]);
						minDia[0] = Math.min(minDia[0], graphData.invDia[j][1]);
					}
					else if(!invSysIsLonger) {
						if(graphData.invSys[j][6] == graphData.invDia[i][6] && graphData.invSys[j][7] == graphData.invDia[i][7]) {
							matchFnd = true;
							graphData.invLines.push([graphData.invSys[j][0], graphData.invSys[j][0], graphData.invSys[j][1], graphData.invDia[i][1]]);
							graphData.tInv.push([graphData.invSys[j][0], [graphData.invSys[j][1], "/", graphData.invDia[i][1]].join("")]);
							wDataInv.push([graphData.invSys[j][0], graphData.invSys[j][1], graphData.invDia[i][1]]);
						}
						else if(graphData.tInv.length === 0 || graphData.tInv[graphData.tInv.length - 1][0] < graphData.invSys[j][0]) {
							graphData.tInv.push([graphData.invSys[j][0], [graphData.invSys[j][1], "/--"].join("")]);
						}
						maxSys[0] = Math.max(maxSys[0], graphData.invSys[j][1]);
						minSys[0] = Math.min(minSys[0], graphData.invSys[j][1]);
					}
				}
				if(invSysIsLonger) {
					if(!matchFnd) {
						graphData.tInv.push([graphData.invSys[i][0], [graphData.invSys[i][1], "/--"].join("")]);
					}
					maxSys[0] = Math.max(maxSys[0], graphData.invSys[i][1]);
					minSys[0] = Math.min(minSys[0], graphData.invSys[i][1]);
				}
				else {
					if(!matchFnd) {
						graphData.tInv.push([graphData.invDia[i][0], ["--/", graphData.invDia[i][1]].join("")]);
					}
					maxDia[0] = Math.max(maxDia[0], graphData.invDia[i][1]);
					minDia[0] = Math.min(minDia[0], graphData.invDia[i][1]);
				}
			}

			/* Storing MAP values for Invasive if they exist and finding their min and max */
			for( i = 0; i < invMAPLen; i++) {
				graphData.tInvMAP.push([graphData.invMAP[i][0], graphData.invMAP[i][1], graphData.invMAP[i][2], graphData.invMAP[i][3], graphData.invMAP[i][4], graphData.invMAP[i][5], graphData.invMAP[i][6], graphData.invMAP[i][7]]);
				maxMAP[0] = Math.max(maxMAP[0], graphData.tInvMAP[graphData.tInvMAP.length - 1][1]);
				minMAP[0] = Math.min(minMAP[0], graphData.tInvMAP[graphData.tInvMAP.length - 1][1]);
			}

			/* Performing matching for Non-Invasive BP values */
			for( i = 0; i < maxNonL; i++) {
				matchFnd = false;
				for( j = 0; j < minNonL; j++) {
					if(nonSysIsLonger) {
						if(graphData.nonSys[i][6] == graphData.nonDia[j][6] && graphData.nonSys[i][7] == graphData.nonDia[j][7]) {
							matchFnd = true;
							graphData.nonLines.push([graphData.nonSys[i][0], graphData.nonSys[i][0], graphData.nonSys[i][1], graphData.nonDia[j][1]]);
							graphData.tNon.push([graphData.nonSys[i][0], [graphData.nonSys[i][1], "/", graphData.nonDia[j][1]].join("")]);
							wDataNon.push([graphData.nonSys[i][0], graphData.nonSys[i][1], graphData.nonDia[j][1]]);
						}
						else if(graphData.tNon.length === 0 || graphData.tNon[graphData.tNon.length - 1][0] < graphData.nonDia[j][0]) {
							graphData.tNon.push([graphData.nonDia[j][0], ["--/", graphData.nonDia[j][1]].join("")]);
						}
						maxDia[1] = Math.max(maxDia[1], graphData.nonDia[j][1]);
						minDia[1] = Math.min(minDia[1], graphData.nonDia[j][1]);
					}
					else if(!nonSysIsLonger) {
						if(graphData.nonSys[j][6] == graphData.nonDia[i][6] && graphData.nonSys[j][7] == graphData.nonDia[i][7]) {
							matchFnd = true;
							graphData.nonLines.push([graphData.nonSys[j][0], graphData.nonSys[j][0], graphData.nonSys[j][1], graphData.nonDia[i][1]]);
							graphData.tNon.push([graphData.nonSys[j][0], [graphData.nonSys[j][1], "/", graphData.nonDia[i][1]].join("")]);
							wDataNon.push([graphData.nonSys[j][0], graphData.nonSys[j][1], graphData.nonDia[i][1]]);
						}
						else if(graphData.tNon.length === 0 || graphData.tNon[graphData.tNon.length - 1][0] < graphData.nonSys[j][0]) {
							graphData.tNon.push([graphData.nonSys[j][0], [graphData.nonSys[j][1], "/--"].join("")]);
						}
						maxSys[1] = Math.max(maxSys[1], graphData.nonSys[j][1]);
						minSys[1] = Math.min(minSys[1], graphData.nonSys[j][1]);
					}
				}
				if(nonSysIsLonger) {
					if(!matchFnd) {
						graphData.tNon.push([graphData.nonSys[i][0], [graphData.nonSys[i][1], "/--"].join("")]);
					}
					maxSys[1] = Math.max(maxSys[1], graphData.nonSys[i][1]);
					minSys[1] = Math.min(minSys[1], graphData.nonSys[i][1]);
				}
				else {
					if(!matchFnd) {
						graphData.tNon.push([graphData.nonDia[i][0], ["--/", graphData.nonDia[i][1]].join("")]);
					}
					maxDia[1] = Math.max(maxDia[1], graphData.nonDia[i][1]);
					minDia[1] = Math.min(minDia[1], graphData.nonDia[i][1]);
				}
			}

			/* Storing MAP values for Non-Invasive if they exist and finding their min and max */
			for( i = 0; i < nonMAPLen; i++) {
				graphData.tNonMAP.push([graphData.nonMAP[i][0], graphData.nonMAP[i][1], graphData.nonMAP[i][2], graphData.nonMAP[i][3], graphData.nonMAP[i][4], graphData.nonMAP[i][5], graphData.nonMAP[i][6], graphData.nonMAP[i][7]]);
				maxMAP[1] = Math.max(maxMAP[1], graphData.tNonMAP[graphData.tNonMAP.length - 1][1]);
				minMAP[1] = Math.min(minMAP[1], graphData.tNonMAP[graphData.tNonMAP.length - 1][1]);
			}

			/* Sorting incase of date order issues on table data */
			graphData.tInv.sort(MP_GRAPHS.dateSort);
			graphData.tInvMAP.sort(MP_GRAPHS.dateSort);
			graphData.tNon.sort(MP_GRAPHS.dateSort);
			graphData.tNonMAP.sort(MP_GRAPHS.dateSort);

			var invShow = true, nonShow = !invShow;
			graphData.bpValuesShown = 'inv';
			/* creating buttons for BP events */
			if(iRBtns && assignedTo) {
				bHTML.push("<div class='btns'>");
				if(graphData.invSys.length > 0 || graphData.invDia.length > 0 || graphData.invMAP.length > 0) {
					bHTML.push("<div class='rBtn'><input type='radio'", ((invShow) ? " checked='checked'" : ""), " name='bpVal' value='inv' onclick='MP_GRAPHS.showBPData(this,", assignedTo, ",", compId, ");'/>&nbsp;", i18n.A_LINE, "</div><br/>", "<div id='bp_inv", compId, "'><div class='rBtn_data graph-icon-sprite downvee'><span>&emsp;&emsp;", i18n.SBP, "</span><span id='minMax", iId, "_0'></span></div>", "<div class='rBtn_data graph-icon-sprite filledcircle'><span>&emsp;&emsp;", i18n.MAP, "</span><span id='minMax", iId, "_2'></span></div>", "<div class='rBtn_data graph-icon-sprite upvee'><span>&emsp;&emsp;", i18n.DBP, "</span><span id='minMax", iId, "_1'></span></div></div>");
				}
				if(graphData.nonSys.length > 0 || graphData.nonDia.length > 0 || graphData.nonMAP.length > 0) {
					if(graphData.invSys.length === 0 && graphData.invDia.length === 0 && graphData.invMAP.length === 0) {
						nonShow = true;
						invShow = false;
						graphData.bpValuesShown = 'non';
					}
					bHTML.push("<div class='rBtn'><input type='radio'", ((nonShow) ? " checked='checked'" : ""), " name='bpVal' value='non' onclick='MP_GRAPHS.showBPData(this,", assignedTo, ",", compId, ");'/>&nbsp;", i18n.CUFF, "</div><br/>", "<div id='bp_non", compId, "'", (invShow ? " class='closed'" : ""), "><div class='rBtn_data graph-icon-sprite downvee'><span>&emsp;&emsp;", i18n.SBP, "</span><span id='minMax", iId, "_3'></span></div>", "<div class='rBtn_data graph-icon-sprite filledcircle'><span>&emsp;&emsp;", i18n.MAP, "</span><span id='minMax", iId, "_5'></span></div>", "<div class='rBtn_data graph-icon-sprite upvee'><span>&emsp;&emsp;", i18n.DBP, "</span><span id='minMax", iId, "_4'></span></div></div>");
				}
				bHTML.push("</div>");

				$("#" + iRBtns).html(bHTML.join(""));
			}
			sSeries = [{
				xaxis: 'x2axis',
				minY: ((minSys[0] != Number.POSITIVE_INFINITY) ? minSys[0] : null),
				maxY: ((maxSys[0] != Number.NEGATIVE_INFINITY) ? maxSys[0] : null),
				showLine: false,
				show: invShow,
				label: i18n.SBP + " " + i18n.BP_UNIT,
				color: bpColors[0],
				markerOptions: {
					whiskerData: wDataInv,
					style: bpShapes[0]
				},
				pointLabels: {
					show: false
				}
			}, /*invSys*/
			{
				xaxis: 'x2axis',
				minY: ((minDia[0] != Number.POSITIVE_INFINITY) ? minDia[0] : null),
				maxY: ((maxDia[0] != Number.NEGATIVE_INFINITY) ? maxDia[0] : null),
				showLine: false,
				show: invShow,
				label: i18n.DBP + " " + i18n.BP_UNIT,
				color: bpColors[1],
				markerOptions: {
					style: bpShapes[1]
				},
				pointLabels: {
					show: false
				}
			}, /*invDia*/
			{
				xaxis: 'x2axis',
				minY: ((minMAP[0] != Number.POSITIVE_INFINITY) ? minMAP[0] : null),
				maxY: ((maxMAP[0] != Number.NEGATIVE_INFINITY) ? maxMAP[0] : null),
				showLine: false,
				show: invShow,
				label: i18n.MAP + " " + i18n.BP_UNIT,
				color: bpColors[4],
				markerOptions: {
					style: bpShapes[4]
				},
				pointLabels: {
					show: false
				}
			}, /*invMAP*/
			{
				xaxis: 'x2axis',
				minY: ((minSys[1] != Number.POSITIVE_INFINITY) ? minSys[1] : null),
				maxY: ((maxSys[1] != Number.NEGATIVE_INFINITY) ? maxSys[1] : null),
				showLine: false,
				show: nonShow,
				label: i18n.SBP + " " + i18n.BP_UNIT,
				color: bpColors[2],
				markerOptions: {
					whiskerData: wDataNon,
					style: bpShapes[2]
				},
				pointLabels: {
					show: false
				}
			}, /*nonSys*/
			{
				xaxis: 'x2axis',
				minY: ((minDia[1] != Number.POSITIVE_INFINITY) ? minDia[1] : null),
				maxY: ((maxDia[1] != Number.NEGATIVE_INFINITY) ? maxDia[1] : null),
				showLine: false,
				show: nonShow,
				label: i18n.DBP + " " + i18n.BP_UNIT,
				color: bpColors[3],
				markerOptions: {
					style: bpShapes[3]
				},
				pointLabels: {
					show: false
				}
			}, /*nonDia*/
			{
				xaxis: 'x2axis',
				minY: ((minMAP[1] != Number.POSITIVE_INFINITY) ? minMAP[1] : null),
				maxY: ((maxMAP[1] != Number.NEGATIVE_INFINITY) ? maxMAP[1] : null),
				showLine: false,
				show: nonShow,
				label: i18n.MAP + " " + i18n.BP_UNIT,
				color: bpColors[5],
				markerOptions: {
					style: bpShapes[5]
				},
				pointLabels: {
					show: false
				}
			}];
			/*nonMAP*/

			MP_GRAPHS.updateYAxis(sSeries, iYAxisObj);
			MP_GRAPHS.resizeGraph("#" + iId, compId);
			/* plotting graph */
			tPlot = $.jqplot(iId, [graphData.invSys, graphData.invDia, graphData.invMAP, graphData.nonSys, graphData.nonDia, graphData.nonMAP], {
				graphName: 'bpGraph',
				performOnPlot: function() {
					MP_GRAPHS.resizeGraph(tPlot.targetId, compId);
					MP_GRAPHS.findMinMax(tPlot, compId);
				},

				performAfterPlot: function() { MP_GRAPHS.drawWhiskerLines(tPlot, compId);
				},

				seriesDefaults: {
					neighborThreshold: 0
				},
				cursor: {
					zoom: true,
					showTooltip: false,
					constrainZoomTo: 'x',
					snapZoomTo: 'minutes',
					dblClickReset: false,
					performAfterZoom: function() {
						tPlot.redraw();
						MP_GRAPHS.findMinMax(tPlot, compId);
						MP_GRAPHS.drawWhiskerLines(tPlot, compId);
					},

					performOnZoom: function() {
						graphData.isZoomed = true;
					}

				},
				axes: {
					xaxis: iXAxisObj,
					x2axis: iX2AxisObj,
					yaxis: iYAxisObj
				},
				highlighter: {
					sizeAdjust: 10,
					tooltipAxes: 'yx',
					tooltipLocation: 'nw',
					fadeTooltip: true,
					tooltipFadeSpeed: "slow",
					useAxesFormatters: true,
					formatString: ["<span style='font-weight:bolder'>%l:</span>&nbsp;%s<br/><span style='font-weight:bolder'>", i18n.RESULT_DT_TM, ":</span>&nbsp;%6%1%2%3%4"].join("")
				},
				legend: {
					show: false
				},
				series: sSeries
			});
			
			MP_GRAPHS.drawWhiskerLines(tPlot, compId);
			MP_GRAPHS.findMinMax(tPlot, compId);
			return tPlot;

		},

		/**
		 * This function displays a table view graph for all data according to user specifications.
		 *		NOTES: 	* Time data points must have the timestamp set to a Non-UTC value.
		 *				* Page must be loaded and DOM created before running this function.
		 *				* This will render a view as an HTML table.
		 *				* Global variables choiceData, nonLines, and invLines must be defined.  If no data on them, they will not be shown in table.
		 * @author Brian Heits
		 * @author Ryan Wareham
		 */
		drawTableGraph: function(iId, compId) {
			var graphData = MP_GRAPHS.getGraphDataByComponentId(compId);
			/** Calculate half of the width of each th row and offset it by as much **/
			function setOffset(contId, idx) {
				for(var i = 0, il = idx; i < il; i++) {
					var eId = contId + (i + 1);
					var e = _g(eId);
					e.style.right = Math.floor((e.offsetWidth / 2)) + "px";
				}
				return this;
			}

			var iPlot = graphData.gPlots[0], xAxis = iPlot.axes.x2axis, xMin = (Math.round(xAxis.u2p(new $.jsDate(iPlot.axes["x2axis"].min).getTime())) + 0.5), xMax = (Math.round(xAxis.u2p(new $.jsDate(iPlot.axes["x2axis"].max).getTime())) + 0.5), tabWidth = xMax - xMin, resultMargin = 254.0, minCellWidth = 20.0, skipLastCol = 0, vsTable = [], thArr = [], vsHTML = [];
			var i = 0;
			var j = 0;

			MP_GRAPHS.initI18nArrays();

			/* Creating a single table data series off all data that exists */
			var tPlot = null, tCnt = graphData.choiceData.length + ((graphData.tInv.length > 0) ? 1 : 0) + ((graphData.tInvMAP.length > 0) ? 1 : 0) + ((graphData.tNon.length > 0) ? 1 : 0) + ((graphData.tNonMAP.length > 0) ? 1 : 0), sSeries = [], tTicks = [], pDir = 'n', rowHeight/* in px */ = 38, yOffset = 6;
			graphData.tData = [];

			/* Manipulating data so that it shows up as needed for table graph */
			if(tCnt > 0) {
				/* grabbing non-invasive MAP data */
				for( i = 0, nlLen = graphData.tNonMAP.length; i < nlLen; i++) {
					if(i === 0) {
						graphData.tData.push([]);
						/* MAP data */
						sSeries.push({
							xaxis: 'x2axis',
							showLine: false,
							show: true,
							label: [i18n.CUFF, " ", i18n.MAP, " ", i18n.BP_UNIT].join(""),
							color: '#eeeeee',
							markerOptions: {
								show: false
							},
							pointLabels: {
								show: true,
								location: pDir,
								ypadding: yOffset
							}
						});
						tTicks.push([graphData.tData.length, sSeries[sSeries.length - 1].label]);
					}
					graphData.tData[graphData.tData.length - 1].push([graphData.tNonMAP[i][0], (graphData.tData.length), graphData.tNonMAP[i][1]]);
				}

				/* grabbing non-invasive BP data */
				for( i = 0, nlLen = graphData.tNon.length; i < nlLen; i++) {
					if(i === 0) {
						graphData.tData.push([]);
						/* BP data */
						sSeries.push({
							xaxis: 'x2axis',
							showLine: false,
							show: true,
							label: [i18n.CUFF, " ", i18n.SBP, "/", i18n.DBP].join(""),
							color: '#eeeeee',
							markerOptions: {
								show: false
							},
							pointLabels: {
								show: true,
								location: pDir,
								ypadding: yOffset
							}
						});
						tTicks.push([graphData.tData.length, sSeries[sSeries.length - 1].label]);
					}
					graphData.tData[graphData.tData.length - 1].push([graphData.tNon[i][0], (graphData.tData.length), graphData.tNon[i][1]]);
					//alert("graphData.tData is: " + JSON.stringify(graphData.tData));
				}

				/* grabbing invasive MAP data */
				for( i = 0, ilLen = graphData.tInvMAP.length; i < ilLen; i++) {
					if(i === 0) {
						graphData.tData.push([]);
						/* MAP data */
						sSeries.push({
							xaxis: 'x2axis',
							showLine: false,
							show: true,
							label: [i18n.A_LINE, " ", i18n.MAP, " ", i18n.BP_UNIT].join(""),
							color: '#eeeeee',
							markerOptions: {
								show: false
							},
							pointLabels: {
								show: true,
								location: pDir,
								ypadding: yOffset
							}
						});
						tTicks.push([graphData.tData.length, sSeries[sSeries.length - 1].label]);
					}
					graphData.tData[graphData.tData.length - 1].push([graphData.tInvMAP[i][0], (graphData.tData.length), graphData.tInvMAP[i][1]]);
				}

				/* grabbing invasive BP data */
				for( i = 0, ilLen = graphData.tInv.length; i < ilLen; i++) {
					if(i === 0) {
						graphData.tData.push([]);
						/* BP data */
						sSeries.push({
							xaxis: 'x2axis',
							showLine: false,
							show: true,
							label: [i18n.A_LINE, " ", i18n.SBP, "/", i18n.DBP].join(""),
							color: '#eeeeee',
							markerOptions: {
								show: false
							},
							pointLabels: {
								show: true,
								location: pDir,
								ypadding: yOffset
							}
						});
						tTicks.push([graphData.tData.length, sSeries[sSeries.length - 1].label]);
					}
					graphData.tData[graphData.tData.length - 1].push([graphData.tInv[i][0], (graphData.tData.length), graphData.tInv[i][1]]);
				}

				for( i = (graphData.choiceData.length - 1); i >= 0; i--) {
					graphData.tData.push([]);
					sSeries.push({
						xaxis: 'x2axis',
						showLine: false,
						show: true,
						label: '',
						color: '#eeeeee',
						markerOptions: {
							show: false
						},
						pointLabels: {
							show: true,
							location: pDir,
							ypadding: yOffset
						}
					});
					for( j = 0, jLen = graphData.choiceData[i].length; j < jLen; j++) {
						if(j === 0) {
							sSeries[sSeries.length - 1].label = graphData.choiceData[i][j][6];
							tTicks.push([graphData.tData.length, graphData.choiceData[i][j][6]]);
						}
						graphData.tData[graphData.tData.length - 1].push([graphData.choiceData[i][j][0], graphData.tData.length, graphData.choiceData[i][j][1]]);
					}
				}

				/* Define table widths and table header labels */
				thArr.push("<th class='tmln-res' style='width:", resultMargin, "px;'>&nbsp</th>");
				for( i = 1, il = xAxis._ticks.length; i < il; i++) {
					var t1 = new $.jsDate(xAxis._ticks[i].value).getTime();
					var t2 = new $.jsDate(xAxis._ticks[i - 1].value).getTime();
					var cellWidth = (Math.round(xAxis.u2p(t1)) + 0.5) - (Math.round(xAxis.u2p(t2)) + 0.5);
					if(i == il - 1 && cellWidth < minCellWidth) {  //If the final cell is less than 50px don't attempt to write a value
						skipLastCol = 1;
						thArr.push("<th class='tmln-th' style='width:", cellWidth, "px;'><div id='tmlnTabTh_", i, "' class='tmln-tab-hd'><span>&nbsp</span></div></th>");
					}
					else {
						thArr.push("<th class='tmln-th' style='width:", cellWidth, "px;'><div id='tmlnTabTh_", i, "' class='tmln-tab-hd'><span>", xAxis._ticks[i - 1].label, "</span></div></th>");
					}
				}
				vsHTML.push("<table class='tmln-tbl' style='width:", tabWidth + resultMargin, "px;'>");
				vsHTML.push(thArr.join(""));
				/*Outer Loop List of result*/
				/*2nd Loop column place holders (predefined by JQPlot*/
				/*3rd Loop Actual values for each result.  Test if they are between the column buckets defined in the 2nd loop*/
				i = tTicks.length;
				while(i--) {
					vsHTML.push("<tr><td class='tmln-res'>", tTicks[i][1], "</td>");
					for( j = 1, jl = xAxis._ticks.length; j < jl; j++) {
						var t3 = new Date(xAxis._ticks[j - 1].value);
						var t4 = new Date(xAxis._ticks[j].value);
						var hldVal = "&nbsp";
						//If no value exists for a given bucket place a space
						if(j < jl - 1 || (skipLastCol === 0 && j == jl - 1)) {
							var k = graphData.tData[i].length;
							while(k--) {
								var vsDt = new Date(graphData.tData[i][k][0]);
								if(vsDt >= t3 && vsDt < t4) {
									var tempVal = graphData.tData[i][k][2] + '';
									var fsLoc = tempVal.search(/\//);
									if(fsLoc > 0) {
										var sbpVal = MP_GRAPHS.formatResult(parseFloat(tempVal.substring(0, fsLoc)));
										var dbpVal = MP_GRAPHS.formatResult(parseFloat(tempVal.substring(fsLoc + 1)));
										if(!sbpVal) {
											sbpVal = "--";
										}
										if(!dbpVal) {
											dbpVal = "--";
										}
										hldVal = sbpVal + "/" + dbpVal;
									}
									else {
										hldVal = MP_GRAPHS.formatResult(graphData.tData[i][k][2]);
										//Take the last known value for the current bucket.
									}
									break;
								}
							}
						}
						vsHTML.push("<td class='tmln-col'>", hldVal, "</td>");
					}
					vsHTML.push("</tr>");
				}
				vsHTML.push("</table>");

				_g(iId).innerHTML = vsHTML.join("");
				setOffset("tmlnTabTh_", xAxis._ticks.length - 1);

			}
			return this;
		},

		/* Helper function for setting i18n month values in global arrays for JQPlot*/
		initI18nArrays: function() {
			if(MP_GRAPHS.i18nInitDone === false) {
				MP_GRAPHS.i18nInitDone = true;
				Date.ABBR_MONTHNAMES.push([i18n.JANUARY[0], i18n.FEBRUARY[0], i18n.MARCH[0], i18n.APRIL[0], i18n.MAY[0], i18n.JUNE[0], i18n.JULY[0], i18n.AUGUST[0], i18n.SEPTEMBER[0], i18n.OCTOBER[0], i18n.NOVEMBER[0], i18n.DECEMBER[0]]);
				Date.MONTHNAMES.push([i18n.JANUARY[1], i18n.FEBRUARY[1], i18n.MARCH[1], i18n.APRIL[1], i18n.MAY[1], i18n.JUNE[1], i18n.JULY[1], i18n.AUGUST[1], i18n.SEPTEMBER[1], i18n.OCTOBER[1], i18n.NOVEMBER[1], i18n.DECEMBER[1]]);
			}
		},

		resetGraph: function(plot, compId) {
			var curDtTm = new Date();
			var p = plot;
			var graphData = MP_GRAPHS.getGraphDataByComponentId(compId);
			var txtZoom = _g("zoomStatus" + compId);
			if(graphData.isZoomed === true) {
				graphData.isZoomed = false;
				txtZoom.innerHTML = i18n.NO_ZOOM_APPLIED;
				p.plugins.cursor.resetZoom(p, p.plugins.cursor);
				MP_GRAPHS.updateYAxis(p.series, p.axes.yaxis);
				for( i = 0, gLen = graphData.gPlots.length; i < gLen; i++) {
					graphData.gPlots[i].replot();
				}
				MP_GRAPHS.drawTableGraph("tableGraph" + compId, compId);
			}
		},

		/* Helper function for drawChoiceGraph and drawCtrGraph function (onclick event for each button) */
		selectSeries: function(iBtn, mSelected, plot, compId, legendIconClass) { 
			var graphData = MP_GRAPHS.getGraphDataByComponentId(compId);
			var p = plot;
			var numSelected = 0;
			var i = 0;
			for( i = 0, sLen = p.series.length; i < sLen; i++) {
				if(p.series[i].show) {
					numSelected++;
				}
			}

			if(p) {
				var actionNeeded = false;
				if(iBtn) {
					var idSplit = iBtn.id.split("_");
					var index = idSplit[1];
					if(!p.series[index].show && numSelected != mSelected) {
						iBtn.className = "btn series-on graph-icon-sprite " + legendIconClass;
						p.series[index].show = true;
						actionNeeded = true;
					}
					else if(p.series[index].show) {
						iBtn.className = "btn series-off graph-icon-sprite "+ legendIconClass;
						p.series[index].show = false;
						actionNeeded = true;
					}
				}
				if(actionNeeded) {
					MP_GRAPHS.updateYAxis(p.series, p.axes.yaxis);
					p.redraw();
				}
			}
			return true;
		},

		/* helper function for drawWhiskerGraph */
		showBPData: function(iObj, iPlot, compId) {
			var graphData = MP_GRAPHS.getGraphDataByComponentId(compId);
			var bpInvID = "bp_inv" + compId;
			var bpNonID = "bp_non" + compId;

			var i = 0;
			if(iObj.value == "inv") {
				_g(bpInvID).className = "";
				var nonObj = _g(bpNonID);
				if(nonObj) {
					nonObj.className = "closed";
				}
				graphData.bpValuesShown = 'inv';
				for( i = 0; i < 3; i++) {
					iPlot.series[i].show = true;
				}
				for( i = 3; i < 6; i++) {
					iPlot.series[i].show = false;
				}
				MP_GRAPHS.updateYAxis(iPlot.series, iPlot.axes.yaxis);
				iPlot.redraw();
			}
			else if(iObj.value == "non") {
				_g(bpNonID).className = "";
				var invObj = _g(bpInvID);
				if(invObj) {
					invObj.className = "closed";
				}
				graphData.bpValuesShown = 'non';
				for( i = 0; i < 3; i++) {
					iPlot.series[i].show = false;
				}
				for( i = 3; i < 6; i++) {
					iPlot.series[i].show = true;
				}
				MP_GRAPHS.updateYAxis(iPlot.series, iPlot.axes.yaxis);
				iPlot.redraw();
			}
		}

	};
}();
