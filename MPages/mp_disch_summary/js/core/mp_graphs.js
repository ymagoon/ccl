/**
 *		Cerner JQPlot Generic Graphing Functions
 *		Author: Brian Heits
 *		Date: 7/20/2010
 */

/* Predefining Month names according to i18n for jqplot */
Date.ABBR_MONTHNAMES = [i18n.JANUARY[0],i18n.FEBRUARY[0],i18n.MARCH[0],i18n.APRIL[0],i18n.MAY[0],i18n.JUNE[0],i18n.JULY[0],i18n.AUGUST[0],i18n.SEPTEMBER[0],i18n.OCTOBER[0],i18n.NOVEMBER[0],i18n.DECEMBER[0]];
Date.MONTHNAMES = [i18n.JANUARY[1],i18n.FEBRUARY[1],i18n.MARCH[1],i18n.APRIL[1],i18n.MAY[1],i18n.JUNE[1],i18n.JULY[1],i18n.AUGUST[1],i18n.SEPTEMBER[1],i18n.OCTOBER[1],i18n.NOVEMBER[1],i18n.DECEMBER[1]];

var MP_GRAPHS = function(){
return {
	windowResize : 0, choiceData : [], gPlots : [], isZoomed : false, invLines : [], invMAP : [], nonLines : [], nonMAP : [], bpValuesShown : '', tData : [],
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
	 * @author Brian Heits
	 */
	drawCtrGraph : function( iId, iBtns, assignedTo, iXAxisObj, iX2AxisObj, iYAxisObj )
	{
		var tPlot = null, shownData = [[[1]]], sSeries = [{xaxis:'x2axis',show:false,label:"controller",color:"#ffffff",markerOptions:{style:"filledCircle"}}], sCnt = 0;
		if (iBtns && assignedTo)
			$("#"+iBtns).html(["<div class='btns'><input type='reset' value='",i18n.RESET,"' onclick=\"MP_GRAPHS.selectSeries(null,0,",assignedTo,",true);\"/><br/><span id='zoomStatus'>",i18n.NO_ZOOM_APPLIED,"</span></div>"].join(""));
		updateYAxis( sSeries, iYAxisObj);
		resizeGraph("#"+iId);
		/* plotting graph */
		tPlot = $.jqplot(iId, shownData,{
			graphName:'ctrGraph',
			performOnPlot: function(){resizeGraph(tPlot.targetId);},
			performAfterPlot: function(){
				if (MP_GRAPHS.isZoomed && !tPlot.plugins.cursor.zoomOnController)
					drawZoomBox.call(tPlot.plugins.cursor);
			},
			seriesDefaults:{neighborThreshold:0},
			cursor:{
				zoom:true,
				showTooltip:false,
				constrainZoomTo: 'x',
				snapZoomTo: 'minutes',
				dblClickReset: false,
				performAfterZoom:function(){tPlot.redraw();},
				performOnZoom:function(){
					tPlot.redraw();
					drawZoomBox.call(tPlot.plugins.cursor);
				}
			},
			axes: {
				xaxis:iXAxisObj,
				x2axis:iX2AxisObj,
				yaxis:iYAxisObj
			},
			legend:{show: false},
			series:sSeries
		});
		/* window resize has two events.  We want to replot ONLY after window has stopped resizing.  */
		$(window).resize(function(){
			if (MP_GRAPHS.windowResize == 0){
				MP_GRAPHS.windowResize = 1;
			}
			else if (MP_GRAPHS.windowResize == 1){
				MP_GRAPHS.windowResize = 0;
				for(var i=0;i<MP_GRAPHS.gPlots.length;i++)
					MP_GRAPHS.gPlots[i].replot();
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
	 * @author Brian Heits
	 */
	drawChoiceGraph : function( iId, iSelect, assignedTo, maxSelected, iDataSeries, iXAxisObj, iX2AxisObj, iYAxisObj )
	{
		var tPlot = null, shownData = [], sSeries = [], bSeries = [], bHTML = [], sCnt = 0, oneShown = false;
		for (var i=0;i<iDataSeries.length;i++,sCnt++){
			shownData.push(iDataSeries[i][0]);
			sSeries.push(iDataSeries[i][1]);
			if (iDataSeries[i][1].show)
				oneShown = true;
			if (iSelect && assignedTo) {
				if (iDataSeries[i][1] && iDataSeries[i][1].color && iDataSeries[i][1].markerOptions)
					bSeries.push({size:8,color:iDataSeries[i][1].color,style:iDataSeries[i][1].markerOptions.style});
				bHTML.push("<div class='btns'><div onclick=\"MP_GRAPHS.selectSeries(this,",maxSelected,",",assignedTo,");\" id='");
				bHTML.push(iSelect,"btn_",sCnt);
				bHTML.push("' class='btn ",((iDataSeries[i][1].show)?"series-on":"series-off"),"'>");
				bHTML.push("<canvas id='",iSelect,"canvas_",sCnt,"'></canvas>");
				bHTML.push("</div>&nbsp;<span>",iDataSeries[i][1].label,"<span id='minMax",iId,"_",sCnt,"'></span></span></div>");
			}
		}
		MP_GRAPHS.choiceData = shownData;
		if (!oneShown)
			sSeries[0].show = true;
		/* create buttons */
		if (iSelect && assignedTo) {
			$("#"+iSelect).html(bHTML.join(""));
			/* adding images to buttons */
			for (var i=0; i < bSeries.length; i++){
				var cObj = _g(iSelect+"canvas_"+i);
				if ($.browser.msie)
					G_vmlCanvasManager.initElement(cObj);
				var context = cObj.getContext('2d');
				var bMarker = new nMarkerRenderer(bSeries[i]);
				bMarker.draw(12,12,context,{});
				bMarker.drawLine(0,12,23,12,context);
			}
		}
		
		updateYAxis( sSeries, iYAxisObj);
		resizeGraph("#"+iId);
		/* plotting graph */
		tPlot = $.jqplot(iId, shownData,{
			graphName:'choiceGraph',
			performOnPlot: function(){
				resizeGraph(tPlot.targetId);
				findMinMax(tPlot);
			},
			seriesDefaults:{neighborThreshold:0},
			cursor:{
				zoom:true,
				showTooltip:false,
				constrainZoomTo: 'x',
				snapZoomTo: 'minutes',
				dblClickReset: false, 
				performAfterZoom:function(){
					tPlot.redraw();
					findMinMax(tPlot);
				}, 
				performOnZoom: function(){MP_GRAPHS.isZoomed = true;}
			},
			axes: {
				xaxis:iXAxisObj,
				x2axis:iX2AxisObj,
				yaxis:iYAxisObj
			},
			highlighter: {
				sizeAdjust: 10,
				tooltipAxes: 'yx',
				tooltipLocation: 'nw',
				fadeTooltip: true,
				tooltipFadeSpeed: "slow",
				useAxesFormatters: true,
				formatString: ["<b>%l:</b>&nbsp;%s<br/><b>",i18n.RESULT_DT_TM,":</b>&nbsp;%s%1%2%3%4"].join("")
			},
			legend:{show: false},
			series:sSeries
		});
		findMinMax(tPlot);
		/* if all are not show initially, then show 1, plot, then redraw with all back to show:false.  Issue doing it the correct way where all are just "show:false" */
		if (!oneShown){
			tPlot.series[0].show = false;
			sSeries[0].show = false;
			tPlot.redraw();
		}
		/* window resize has two events.  We want to replot ONLY after window has stopped resizing.  */
		$(window).resize(function(){
			if (MP_GRAPHS.windowResize == 0){
				MP_GRAPHS.windowResize = 1;
			}
			else if (MP_GRAPHS.windowResize == 1){
				MP_GRAPHS.windowResize = 0;
				for(var i=0;i<MP_GRAPHS.gPlots.length;i++)
					MP_GRAPHS.gPlots[i].replot();
			}
		});
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
	 * @author Brian Heits
	 */
	drawWhiskerGraph : function( iId, iRBtns, assignedTo, iDataSeries, iXAxisObj, iX2AxisObj, iYAxisObj )
	{	
		var tPlot = null, shownData = [], sSeries = [], bSeries = [], bHTML = [], sCnt = 0;
		var bpColors = ["rgb(228,26,28)","rgb(228,26,28)","rgb(228,26,28)","rgb(228,26,28)","rgb(16,68,4)","rgb(151,0,0)","rgb(0,0,0)"];
		var bpShapes = ["downVee","upVee","downVee","upVee","filledCircle","filledCircle"];
		/* grouping data */
		var invSys = [], invDia = [];
		var nonSys = [], nonDia = [];
		/* determining max length of each group.  going to group both during same loop to help with efficiency */
		var maxLenSys = Math.max(iDataSeries[0][0].length, iDataSeries[2][0].length);
		var maxLenSearch = Math.max(iDataSeries[5][0].length,Math.max(iDataSeries[4][0].length,Math.max(iDataSeries[1][0].length, iDataSeries[3][0].length)));
		
		var maxSys = [Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY], maxDia = [Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY], 
						maxMAP = [Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY];
		var minSys = [Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY], minDia = [Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY], 
						minMAP = [Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY];
		for (var i=0;i < maxLenSys; i++)
		{
			var matchesInvDia = [], matchesNonDia = [];
			var matchesInvMAP = [], matchesNonMAP = [];
			/* matching all data in one loop to be more efficient, hence the multiple if statements */
			for (var j=0; j < maxLenSearch; j++)
			{
				if (i<iDataSeries[0][0].length && j<iDataSeries[1][0].length && iDataSeries[0][0][i][0] == iDataSeries[1][0][j][0])
					matchesInvDia.push(iDataSeries[1][0][j]);
				if (i<iDataSeries[2][0].length && j<iDataSeries[3][0].length && iDataSeries[2][0][i][0] == iDataSeries[3][0][j][0])
					matchesNonDia.push(iDataSeries[3][0][j]);
				if (i<iDataSeries[0][0].length && j<iDataSeries[4][0].length && iDataSeries[0][0][i][0] == iDataSeries[4][0][j][0])
					matchesInvMAP.push(iDataSeries[4][0][j]);
				if (i<iDataSeries[2][0].length && j<iDataSeries[5][0].length && iDataSeries[2][0][i][0] == iDataSeries[5][0][j][0])
					matchesNonMAP.push(iDataSeries[5][0][j]);
			}
			if (matchesInvDia.length > 0 && i<iDataSeries[0][0].length)
			{
				invSys.push(iDataSeries[0][0][i]); 
				maxSys[0] = Math.max(maxSys[0],invSys[invSys.length-1][1]);
				minSys[0] = Math.min(minSys[0],invSys[invSys.length-1][1]);
				invDia.push(matchesInvDia[matchesInvDia.length-1]);
				maxDia[0] = Math.max(maxDia[0],invDia[invDia.length-1][1]);
				minDia[0] = Math.min(minDia[0],invDia[invDia.length-1][1]);
				/* x1, x2, y1, y2 */
				MP_GRAPHS.invLines.push([iDataSeries[0][0][i][0],iDataSeries[0][0][i][0],iDataSeries[0][0][i][1],matchesInvDia[matchesInvDia.length-1][1]]);
				if (matchesInvMAP.length == 0)
					MP_GRAPHS.invMAP.push([iDataSeries[0][0][i][0],((2*parseFloat(matchesInvDia[matchesInvDia.length-1][1]) + parseFloat(iDataSeries[0][0][i][1]))/3)]);
				else
					MP_GRAPHS.invMAP.push(matchesInvMAP[matchesInvMAP.length-1]);
				MP_GRAPHS.invMAP[MP_GRAPHS.invMAP.length-1][1] = Math.round(10*MP_GRAPHS.invMAP[MP_GRAPHS.invMAP.length-1][1])/10;
				maxMAP[0] = Math.max(maxMAP[0],MP_GRAPHS.invMAP[MP_GRAPHS.invMAP.length-1][1]);
				minMAP[0] = Math.min(minMAP[0],MP_GRAPHS.invMAP[MP_GRAPHS.invMAP.length-1][1]);
				
			}	
			if (matchesNonDia.length > 0 && i<iDataSeries[2][0].length)
			{
				nonSys.push(iDataSeries[2][0][i]);
				maxSys[1] = Math.max(maxSys[1],parseFloat(nonSys[nonSys.length-1][1]));
				minSys[1] = Math.min(minSys[1],parseFloat(nonSys[nonSys.length-1][1]));
				nonDia.push(matchesNonDia[matchesNonDia.length-1]);
				maxDia[1] = Math.max(maxDia[1],parseFloat(nonDia[nonDia.length-1][1]));
				minDia[1] = Math.min(minDia[1],parseFloat(nonDia[nonDia.length-1][1]));
				/* x1, x2, y1, y2 */
				MP_GRAPHS.nonLines.push([iDataSeries[2][0][i][0],iDataSeries[2][0][i][0],iDataSeries[2][0][i][1],matchesNonDia[matchesNonDia.length-1][1]]);
				if (matchesNonMAP.length == 0)
					MP_GRAPHS.nonMAP.push([iDataSeries[2][0][i][0],((2*parseFloat(matchesNonDia[matchesNonDia.length-1][1]) + parseFloat(iDataSeries[2][0][i][1]))/3)]);
				else
					MP_GRAPHS.nonMAP.push(matchesNonMAP[matchesNonMAP.length-1]);
				MP_GRAPHS.nonMAP[MP_GRAPHS.nonMAP.length-1][1] = Math.round(10*MP_GRAPHS.nonMAP[MP_GRAPHS.nonMAP.length-1][1])/10;
				maxMAP[1] = Math.max(maxMAP[1],parseFloat(MP_GRAPHS.nonMAP[MP_GRAPHS.nonMAP.length-1][1]));
				minMAP[1] = Math.min(minMAP[1],parseFloat(MP_GRAPHS.nonMAP[MP_GRAPHS.nonMAP.length-1][1]));
			}
				
		}
		
		var invShow = true, nonShow = !invShow;
		MP_GRAPHS.bpValuesShown='inv';
		/* creating buttons for BP events */
		if (iRBtns && assignedTo){
			bHTML.push("<div class='btns'>");
			if (MP_GRAPHS.invLines.length > 0)
			{
				bHTML.push("<div class='rBtn'><input type='radio'",((invShow)?" checked='checked'":"")," name='bpVal' value='inv' onclick='MP_GRAPHS.showBPData(this,",assignedTo,");'/>&nbsp;",i18n.A_LINE,"</div><br/>");
				bHTML.push("<div id='bp_inv'><div class='rBtn_data'><canvas id='",iRBtns,"canvas_0'></canvas>&nbsp;<span>",i18n.SBP,"</span><span id='minMax",iId,"_0'></span></div>");
				bHTML.push("<div class='rBtn_data'><canvas id='",iRBtns,"canvas_2'></canvas>&nbsp;<span>",i18n.MAP,"</span><span id='minMax",iId,"_2'></span></div>");
				bHTML.push("<div class='rBtn_data'><canvas id='",iRBtns,"canvas_1'></canvas>&nbsp;<span>",i18n.DBP,"</span><span id='minMax",iId,"_1'></span></div></div>");
			}
			if (MP_GRAPHS.nonLines.length > 0)
			{
				if (MP_GRAPHS.invLines.length == 0)
				{
					nonShow = true;
					invShow = false;
					MP_GRAPHS.bpValuesShown='non';
				}
				bHTML.push("<div class='rBtn'><input type='radio'",((nonShow)?" checked='checked'":"")," name='bpVal' value='non' onclick='MP_GRAPHS.showBPData(this,",assignedTo,");'/>&nbsp;",i18n.CUFF,"</div><br/>");
				bHTML.push("<div id='bp_non'><div class='rBtn_data'><canvas id='",iRBtns,"canvas_3'></canvas>&nbsp;<span>",i18n.SBP,"</span><span id='minMax",iId,"_3'></span></div>");
				bHTML.push("<div class='rBtn_data'><canvas id='",iRBtns,"canvas_5'></canvas>&nbsp;<span>",i18n.MAP,"</span><span id='minMax",iId,"_5'></span></div>");
				bHTML.push("<div class='rBtn_data'><canvas id='",iRBtns,"canvas_4'></canvas>&nbsp;<span>",i18n.DBP,"</span><span id='minMax",iId,"_4'></span></div></div>");
			}
			bHTML.push("</div>");
			
			$("#"+iRBtns).html(bHTML.join(""));
		}
		
		var sSeries = [
		{xaxis:'x2axis',minY:((minSys[0] != Number.POSITIVE_INFINITY)?minSys[0]:null),maxY:((maxSys[0] != Number.NEGATIVE_INFINITY)?maxSys[0]:null),showLine:false,show:invShow,label:i18n.SBP+" "+i18n.BP_UNIT,color:bpColors[0],markerOptions:{style:bpShapes[0]},pointLabels:{show:false}},/*invSys*/
		{xaxis:'x2axis',minY:((minDia[0] != Number.POSITIVE_INFINITY)?minDia[0]:null),maxY:((maxDia[0] != Number.NEGATIVE_INFINITY)?maxDia[0]:null),showLine:false,show:invShow,label:i18n.DBP+" "+i18n.BP_UNIT,color:bpColors[1],markerOptions:{style:bpShapes[1]},pointLabels:{show:false}},/*invDia*/
		{xaxis:'x2axis',minY:((minMAP[0] != Number.POSITIVE_INFINITY)?minMAP[0]:null),maxY:((maxMAP[0] != Number.NEGATIVE_INFINITY)?maxMAP[0]:null),showLine:false,show:invShow,label:i18n.MAP+" "+i18n.BP_UNIT,color:bpColors[4],markerOptions:{style:bpShapes[4]},pointLabels:{show:false}},/*invMAP*/
		{xaxis:'x2axis',minY:((minSys[1] != Number.POSITIVE_INFINITY)?minSys[1]:null),maxY:((maxSys[1] != Number.NEGATIVE_INFINITY)?maxSys[1]:null),showLine:false,show:nonShow,label:i18n.SBP+" "+i18n.BP_UNIT,color:bpColors[2],markerOptions:{style:bpShapes[2]},pointLabels:{show:false}},/*nonSys*/
		{xaxis:'x2axis',minY:((minDia[1] != Number.POSITIVE_INFINITY)?minDia[1]:null),maxY:((maxDia[1] != Number.NEGATIVE_INFINITY)?maxDia[1]:null),showLine:false,show:nonShow,label:i18n.DBP+" "+i18n.BP_UNIT,color:bpColors[3],markerOptions:{style:bpShapes[3]},pointLabels:{show:false}},/*nonDia*/
		{xaxis:'x2axis',minY:((minMAP[1] != Number.POSITIVE_INFINITY)?minMAP[1]:null),maxY:((maxMAP[1] != Number.NEGATIVE_INFINITY)?maxMAP[1]:null),showLine:false,show:nonShow,label:i18n.MAP+" "+i18n.BP_UNIT,color:bpColors[5],markerOptions:{style:bpShapes[5]},pointLabels:{show:false}}];/*nonMAP*/
		
		updateYAxis( sSeries, iYAxisObj);
		resizeGraph("#"+iId);
		
		/* plotting graph */
		tPlot = $.jqplot(iId, [invSys,invDia,MP_GRAPHS.invMAP,nonSys,nonDia,MP_GRAPHS.nonMAP],{
			graphName: 'bpGraph',
			performOnPlot: function(){
				resizeGraph(tPlot.targetId);
				findMinMax(tPlot);
			},
			performAfterPlot: function(){drawWhiskerLines( tPlot );},
			seriesDefaults:{neighborThreshold:0},
			cursor:{
				zoom:true,
				showTooltip:false,
				constrainZoomTo: 'x',
				snapZoomTo: 'minutes',
				dblClickReset: false, 
				performAfterZoom: function(){
					tPlot.redraw();
					findMinMax(tPlot);
					drawWhiskerLines(tPlot);
				}, 
				performOnZoom: function(){MP_GRAPHS.isZoomed = true;}
			},
			axes: {
				xaxis:iXAxisObj,
				x2axis:iX2AxisObj,
				yaxis:iYAxisObj
			},
			highlighter: {
				sizeAdjust: 10,
				tooltipAxes: 'yx',
				tooltipLocation: 'nw',
				fadeTooltip: true,
				tooltipFadeSpeed: "slow",
				useAxesFormatters: true,
				formatString: ["<b>%l:</b>&nbsp;%s<br/><b>",i18n.RESULT_DT_TM,":</b>&nbsp;%s%1%2%3%4"].join("")
			},
			legend:{show: false},
			series:sSeries
		});
		
		/* creating shapes for legend */
		for (var i=0; iRBtns != null && assignedTo != null && iRBtns != "" && i < 6; i++){
			var cObj = _g(iRBtns+"canvas_"+i);
			if (cObj != null)
			{
				if ($.browser.msie)
					G_vmlCanvasManager.initElement(cObj);
				var context = cObj.getContext('2d');
				var bMarker = new nMarkerRenderer({size:8,color:tPlot.series[i].color,style:tPlot.series[i].markerOptions.style});
				bMarker.draw(12,12,context,{});
				if (i==5 && MP_GRAPHS.invLines.length > 0)
					$("#bp_non").addClass("closed");
			}	
		}
		
		drawWhiskerLines( tPlot );
		findMinMax(tPlot);
		
		/* window resize has two events.  We want to replot ONLY after window has stopped resizing.  */
		$(window).resize(function(){
			if (MP_GRAPHS.windowResize == 0){
				MP_GRAPHS.windowResize = 1;
			}
			else if (MP_GRAPHS.windowResize == 1){
				MP_GRAPHS.windowResize = 0;
				for(var i=0;i<MP_GRAPHS.gPlots.length;i++)
					MP_GRAPHS.gPlots[i].replot();
			}
		});
		return tPlot;
		
	},
	/**
	 * This function displays a table view graph for all data according to user specifications.
	 *		NOTES: 	* Time data points must have the timestamp set to a Non-UTC value.
	 *				* Page must be loaded and DOM created before running this function.
	 *				* This will render a view that looks like a table.
	 *				* Global variables choiceData, nonLines, and invLines must be defined.  If no data on them, they will not be shown in table.
	 * 
	 * @param {String} iId: DOM Id of main graph. REQUIRED
	 * @param {Object} iX1AxisObj: x Axis 1 Options object. Will be on bottom of graph. Null will not show axis. (see jqPlotOptions.txt => axesDefault)
	 * @param {Object} iX2AxisObj: x Axis 2 Options object. Will be on top of graph. REQUIRED. (see jqPlotOptions.txt => axesDefault)
	 * @param {Object} iYAxisObj: y Axis 1 Options object. Will be to the left of graph. REQUIRED. (see jqPlotOptions.txt => axesDefault)
	 * @author Brian Heits
	 */
	drawTableGraph : function(iId, iXAxisObj, iX2AxisObj, iYAxisObj)
	{
		/* Creating a single table data series off all data that exists */
		var tPlot = null, tCnt = MP_GRAPHS.choiceData.length+((MP_GRAPHS.invLines.length>0)?2:0)+((MP_GRAPHS.nonLines.length>0)?2:0), sSeries = [], tTicks = [], pDir = 'n', rowHeight/* in px */ = 38, yOffset=6;
		MP_GRAPHS.tData = [];
		
		/* Manipulating data so that it shows up as needed for table graph */
		if (tCnt > 0)
		{
			for (var i=0;i<MP_GRAPHS.nonLines.length;i++)
			{
				if (i==0)
				{
					MP_GRAPHS.tData.push([]); /* MAP data */
					sSeries.push({xaxis:'x2axis',showLine:false,show:true,label:[i18n.CUFF," ",i18n.MAP," ",i18n.BP_UNIT].join(""),color:'#eeeeee',markerOptions:{show:false},pointLabels:{show:true,location:pDir,ypadding:yOffset}});
					tTicks.push([MP_GRAPHS.tData.length,sSeries[sSeries.length-1].label]);
					MP_GRAPHS.tData.push([]); /* BP data */
					sSeries.push({xaxis:'x2axis',showLine:false,show:true,label:[i18n.CUFF," ",i18n.SBP,"/",i18n.DBP].join(""),color:'#eeeeee',markerOptions:{show:false},pointLabels:{show:true,location:pDir,ypadding:yOffset}});
					tTicks.push([MP_GRAPHS.tData.length,sSeries[sSeries.length-1].label]);
				}
				var mapIndex = MP_GRAPHS.tData.length-2, bpIndex = mapIndex+1;
				MP_GRAPHS.tData[bpIndex].push([MP_GRAPHS.nonLines[i][0],(bpIndex+1),[MP_GRAPHS.nonLines[i][2],"/",MP_GRAPHS.nonLines[i][3]].join("")]);
				MP_GRAPHS.tData[mapIndex].push([MP_GRAPHS.nonMAP[i][0],(mapIndex+1),MP_GRAPHS.nonMAP[i][1]]);
			}
			for (var i=0;i<MP_GRAPHS.invLines.length;i++)
			{
				if (i==0)
				{
					MP_GRAPHS.tData.push([]); /* MAP data */
					sSeries.push({xaxis:'x2axis',showLine:false,show:true,label:[i18n.A_LINE," ",i18n.MAP," ",i18n.BP_UNIT].join(""),color:'#eeeeee',markerOptions:{show:false},pointLabels:{show:true,location:pDir,ypadding:yOffset}});
					tTicks.push([MP_GRAPHS.tData.length,sSeries[sSeries.length-1].label]);
					MP_GRAPHS.tData.push([]); /* BP data */
					sSeries.push({xaxis:'x2axis',showLine:false,show:true,label:[i18n.A_LINE," ",i18n.SBP,"/",i18n.DBP].join(""),color:'#eeeeee',markerOptions:{show:false},pointLabels:{show:true,location:pDir,ypadding:yOffset}});
					tTicks.push([MP_GRAPHS.tData.length,sSeries[sSeries.length-1].label]);
				}
				var mapIndex = MP_GRAPHS.tData.length-2, bpIndex = mapIndex+1;
				MP_GRAPHS.tData[bpIndex].push([MP_GRAPHS.invLines[i][0],(bpIndex+1),[MP_GRAPHS.invLines[i][2],"/",MP_GRAPHS.invLines[i][3]].join("")]);
				MP_GRAPHS.tData[mapIndex].push([MP_GRAPHS.invMAP[i][0],(mapIndex+1),MP_GRAPHS.invMAP[i][1]]);
			}
			for (var i=(MP_GRAPHS.choiceData.length-1);i>=0;i--)
			{
				MP_GRAPHS.tData.push([]);
				sSeries.push({xaxis:'x2axis',showLine:false,show:true,label:'',color:'#eeeeee',markerOptions:{show:false},pointLabels:{show:true,location:pDir,ypadding:yOffset}});
				for (var j=0;j<MP_GRAPHS.choiceData[i].length;j++)
				{
					if (j==0)
					{
						sSeries[sSeries.length-1].label = MP_GRAPHS.choiceData[i][j][6];
						tTicks.push([MP_GRAPHS.tData.length,MP_GRAPHS.choiceData[i][j][6]]);
					}
					MP_GRAPHS.tData[MP_GRAPHS.tData.length-1].push([MP_GRAPHS.choiceData[i][j][0],MP_GRAPHS.tData.length,MP_GRAPHS.choiceData[i][j][1]]);
				}
			}
			
			/* creating table view by redefining axes.  This is assuming that the table will be the last graph created on the page */
			if (iYAxisObj != null)
			{
				tTicks.push([tCnt+1,'&nbsp;']);
				iYAxisObj.ticks = tTicks;
				iX2AxisObj.specialFormatFlag = 2;
			}
			
			/* defining height of table graph.  "87" is the offset height from the x2axis. */
			var target = _g(iId);
			if (target != null)
				target.style.height = (87+(rowHeight*(tCnt)))+"px";
			
			resizeGraph("#"+iId);
			
			/* plotting graph */
			tPlot = $.jqplot(iId, MP_GRAPHS.tData,{
				graphName : 'tableGraph',
				seriesDefaults:{neighborThreshold:0},
				performOnPlot: function(){
					resizeGraph(tPlot.targetId);
					updateTableData( tPlot, MP_GRAPHS.tData );
					tPlot.axes.x2axis.specialFormat = true;
					tPlot.axes.x2axis.specialFormatFlag = 2;
				},
				cursor:{
					zoom:true,
					showTooltip:false,
					constrainZoomTo: 'x',
					snapZoomTo: 'minutes',
					dblClickReset: false, 
					performAfterZoom: function(){
						updateTableData(tPlot,MP_GRAPHS.tData);
						tPlot.redraw();
					}, 
					performOnZoom: function(){MP_GRAPHS.isZoomed = true;}
				},
				axes: {
					xaxis:iXAxisObj,
					x2axis:iX2AxisObj,
					yaxis:iYAxisObj
				},
				highlighter: {show:false},
				legend:{show: false},
				series:sSeries
			});
			updateTableData( tPlot, MP_GRAPHS.tData );
			tPlot.redraw();
			
			/* window resize has two events.  We want to replot ONLY after window has stopped resizing.  */
			$(window).resize(function(){
				if (MP_GRAPHS.windowResize == 0){
					MP_GRAPHS.windowResize = 1;
				}
				else if (MP_GRAPHS.windowResize == 1){
					MP_GRAPHS.windowResize = 0;
					for(var i=0;i<MP_GRAPHS.gPlots.length;i++)
						MP_GRAPHS.gPlots[i].replot();
				}
			});
		}
		return tPlot;
	},

	/* Helper function for drawChoiceGraph and drawCtrGraph function (onclick event for each button) */
	selectSeries : function( iBtn, mSelected, plot )
	{
		var p = plot;
		var numSelected = 0;
		var resetGraph = (arguments.length == 4 && MP_GRAPHS.isZoomed);
		for (var i=0;i<p.series.length;i++)
		{
			if (p.series[i].show)
				numSelected++;
		}
		
		if (p != null)
		{
			var actionNeeded = false;
			if (resetGraph)
				actionNeeded = true;
			else if (iBtn != null && iBtn != "")
			{
				var idSplit = iBtn.id.split("_");
				var index = idSplit[1];
				if (!p.series[index].show && numSelected != mSelected)
				{
					iBtn.className = "btn series-on";
					p.series[index].show = true;
					actionNeeded = true;
				}
				else if (p.series[index].show)
				{
					iBtn.className = "btn series-off";
					p.series[index].show = false;
					actionNeeded = true;
				}
			}
			if (actionNeeded)
			{
				if (resetGraph)
				{
					MP_GRAPHS.isZoomed = false;
					curDtTm = new Date();
					p.plugins.cursor.resetZoom(p,p.plugins.cursor);
				}
				updateYAxis( p.series, p.axes.yaxis );
					
				/* updating all graphs so that changes on one graph can be reflected on the others */
				for (var i=0;i<MP_GRAPHS.gPlots.length;i++)
					MP_GRAPHS.gPlots[i].replot();
			}
		}
		return true;
	},

	/* helper function for drawWhiskerGraph */
	showBPData : function(iObj, iPlot)
	{
		if (iObj.value == "inv") {
			_g("bp_inv").className = "";
			var nonObj = _g("bp_non");
			if (nonObj != null)
				nonObj.className = "closed";
			MP_GRAPHS.bpValuesShown = 'inv';
			for (var i=0;i<3;i++)
			{
				iPlot.series[i].show = true;
			}
			for (var i=3;i<6;i++)
			{
				iPlot.series[i].show = false;
			}
			updateYAxis( iPlot.series, iPlot.axes.yaxis);
			iPlot.redraw();
		}
		else if (iObj.value == "non") {
			_g("bp_non").className = "";
			var invObj = _g("bp_inv");
			if (invObj != null)
				invObj.className = "closed";
			MP_GRAPHS.bpValuesShown = 'non';
			for (var i=0;i<3;i++)
			{
				iPlot.series[i].show = false;
			}
			for (var i=3;i<6;i++)
			{
				iPlot.series[i].show = true;
			}
			updateYAxis( iPlot.series, iPlot.axes.yaxis);
			iPlot.redraw();
		}
	}
};
/* helper function for selectSeries, drawWhiskerGraph, and drawChoiceGraph */
function findMinMax( iPlot )
{
	var xAxis = iPlot.axes.x2axis;
	var txtZoom = _g("zoomStatus");
	if (xAxis != null && txtZoom != null)
	{
		if (MP_GRAPHS.isZoomed) {
			txtZoom.innerHTML = Date.create(xAxis.min).strftime("%#m/%#d/%y&nbsp;%H:%M")+" - "+Date.create(xAxis.max).strftime("%#m/%#d/%y&nbsp;%H:%M");
		}
		else {
			txtZoom.innerHTML = i18n.NO_ZOOM_APPLIED;
		}
	}
	for (var i=0; i < iPlot.series.length; i++){
		var normRangeObj = _g("minMax"+iPlot.targetId.replace(/\#/,"")+"_"+i);
		if (normRangeObj)
		{
			var pAxis = iPlot.series[i].xaxis;
			var minX = iPlot.axes[pAxis].min, maxX = iPlot.axes[pAxis].max;
			var minY = Number.POSITIVE_INFINITY;
			var maxY = Number.NEGATIVE_INFINITY;
			
			for (var j=0; j<iPlot.series[i].data.length; j++)
			{
				if (parseInt(iPlot.series[i].data[j][0])>=minX && parseInt(iPlot.series[i].data[j][0])<=maxX)
				{
					if (parseFloat(iPlot.series[i].data[j][1]) < minY)
						minY = iPlot.series[i].data[j][1];
					if (parseFloat(iPlot.series[i].data[j][1]) > maxY)
						maxY = iPlot.series[i].data[j][1];
				}
			}
			if (minY != Number.POSITIVE_INFINITY && maxY != Number.NEGATIVE_INFINITY)
				normRangeObj.innerHTML = (minY != Number.POSITIVE_INFINITY)?"&nbsp;["+(Math.round(minY*10)/10)+" - "+(Math.round(maxY*10)/10)+"]":"";
			else
				normRangeObj.innerHTML = "";
		}
	}
	return true;
}

/* helper function for drawTableGraph and selectSeries (reset) */
function updateTableData( iPlot, iData )
{
	var xAxis = iPlot.axes.x2axis;
	var minDtTm = Date.create(xAxis.min), maxDtTm = Date.create(xAxis.max), dtTmDiff = xAxis.max-xAxis.min;
	
	var unitSize = {
		"second": 1000,
		"minute": 60 * 1000,
		"hour": 60 * 60 * 1000,
		"day": 24 * 60 * 60 * 1000,
		"month": 30 * 24 * 60 * 60 * 1000,
		"year": 365.2425 * 24 * 60 * 60 * 1000
	};
	if (dtTmDiff<=((2*unitSize["hour"])+(15*unitSize["minute"]))) /* <= 2h 15m */
	{
		for (var i=0;i<iData.length;i++)
		{
			var updtData = [], labels = [];
			for (var j=0;j<iData[i].length;j++)
			{
				var newDtTm = Date.create(iData[i][j][0]);
				if ((newDtTm.getMinutes()%15) != 0 || ((newDtTm.getMinutes()%15) == 0 && (newDtTm.getSeconds()>0 || newDtTm.getMilliseconds()>0)))
					newDtTm.setMinutes(newDtTm.getMinutes()-(newDtTm.getMinutes()%15));		
				if (updtData.length>0 && newDtTm.getTime() == updtData[updtData.length-1][0])
				{
					labels[labels.length-1] = iData[i][j][2];
					updtData[updtData.length-1][2] = iData[i][j][2];
				}
				else
				{
					labels.push(iData[i][j][2]);
					updtData.push([newDtTm.getTime(),iData[i][j][1],iData[i][j][2]]);
				}
			}
			iPlot.series[i].plugins.pointLabels.labels = labels;
			iPlot.series[i].data = updtData;
		}
	}
	else if (dtTmDiff<=((unitSize["day"])+(2*unitSize["hour"]))) /* <= 1d 2h */
	{
		for (var i=0;i<iData.length;i++)
		{
			var updtData = [], labels = [];
			for (var j=0;j<iData[i].length;j++)
			{
				var newDtTm = Date.create(iData[i][j][0]);
				if ((newDtTm.getHours()%2) != 0 || ((newDtTm.getHours()%2) == 0 && (newDtTm.getMinutes()>0 || newDtTm.getSeconds()>0 || newDtTm.getMilliseconds()>0)))
					newDtTm.setHours(newDtTm.getHours()-(newDtTm.getHours()%2));
				newDtTm.setMinutes(0);		
				if (updtData.length>0 && newDtTm.getTime() == updtData[updtData.length-1][0])
				{
					labels[labels.length-1] = iData[i][j][2];
					updtData[updtData.length-1][2] = iData[i][j][2];
				}
				else
				{
					labels.push(iData[i][j][2]);
					updtData.push([newDtTm.getTime(),iData[i][j][1],iData[i][j][2]]);
				}
			}
			iPlot.series[i].plugins.pointLabels.labels = labels;
			iPlot.series[i].data = updtData;
		}
	}
	else if (dtTmDiff<=((2*unitSize["day"])+(4*unitSize["hour"]))) /* <= 2d 4h */
	{
		for (var i=0;i<iData.length;i++)
		{
			var updtData = [], labels = [];
			for (var j=0;j<iData[i].length;j++)
			{
				var newDtTm = Date.create(iData[i][j][0]);
				if ((newDtTm.getHours()%4) != 0 || ((newDtTm.getHours()%4) == 0 && (newDtTm.getMinutes()>0 || newDtTm.getSeconds()>0 || newDtTm.getMilliseconds()>0)))
					newDtTm.setHours(newDtTm.getHours()-(newDtTm.getHours()%4));	
				newDtTm.setMinutes(0);						
				if (updtData.length>0 && newDtTm.getTime() == updtData[updtData.length-1][0])
				{
					labels[labels.length-1] = iData[i][j][2];
					updtData[updtData.length-1][2] = iData[i][j][2];
				}
				else
				{
					labels.push(iData[i][j][2]);
					updtData.push([newDtTm.getTime(),iData[i][j][1],iData[i][j][2]]);
				}
			}
			iPlot.series[i].plugins.pointLabels.labels = labels;
			iPlot.series[i].data = updtData;
		}
	}
	else /* > 2d 4h */
	{
		for (var i=0;i<iData.length;i++)
		{
			var updtData = [], labels = [];
			for (var j=0;j<iData[i].length;j++)
			{
				var newDtTm = Date.create(iData[i][j][0]);
				newDtTm.setMinutes(0);
				newDtTm.setHours(0);				
				if (updtData.length>0 && newDtTm.getTime() == updtData[updtData.length-1][0])
				{
					labels[labels.length-1] = iData[i][j][2];
					updtData[updtData.length-1][2] = iData[i][j][2];
				}
				else
				{
					labels.push(iData[i][j][2]);
					updtData.push([newDtTm.getTime(),iData[i][j][1],iData[i][j][2]]);
				}
			}
			iPlot.series[i].plugins.pointLabels.labels = labels;
			iPlot.series[i].data = updtData;
		}
	}
}

	

	/* helper function for showBPData, selectSeries, drawCtrGraph, drawChoiceGraph, and drawWhiskerGraph */
	function updateYAxis( iSeries, iAxis )
	{
		var minVal = Number.POSITIVE_INFINITY, maxVal = Number.NEGATIVE_INFINITY;
		for (var i=0;i<iSeries.length;i++)
		{
			if (iSeries[i].show && iSeries[i].minY != null && iSeries[i].maxY != null)
			{
				minVal = Math.min(minVal,parseFloat(iSeries[i].minY));
				maxVal = Math.max(maxVal,parseFloat(iSeries[i].maxY));
			}
		}
		var isPositive = (minVal > 0);
		var newMax = (maxVal != Number.NEGATIVE_INFINITY)?maxVal*1.1:1;
		var newMin = (minVal != Number.POSITIVE_INFINITY)?minVal*0.9:0;
		newMin = (isPositive && newMin<0)?0:newMin;
		iAxis.min = newMin;
		iAxis.max = (newMin==newMax)?newMax+1:newMax;
	}

	/* helper function for drawWhiskerGraph */
	function drawWhiskerLines( iPlot )
	{
		var ctx = iPlot.eventCanvas._ctx;
		eval("var bpArr = MP_GRAPHS."+((MP_GRAPHS.bpValuesShown != '')?MP_GRAPHS.bpValuesShown+"Lines;":"[];"));
		
		var xAxis = iPlot.axes.x2axis;
		var yAxis = iPlot.axes.yaxis;
		for (var i=0;i<bpArr.length;i++)
		{
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(Math.round(xAxis.series_u2p(bpArr[i][0])),Math.round(yAxis.series_u2p(bpArr[i][2])));
			ctx.lineTo(Math.round(xAxis.series_u2p(bpArr[i][1])),Math.round(yAxis.series_u2p(bpArr[i][3])));
			ctx.strokeStyle = 'rgb(0,0,0)';
			ctx.stroke();
			ctx.restore();
		}
	}

	/* helper function for all graphs to resize accordingly */
	function resizeGraph( iPlotTarget )
	{
		var target = $(iPlotTarget);
		var containerWidth = parseInt(target.parent().parent().parent().innerWidth());
		var legend = target.parent().parent().children(".legend");
		var legendWidth = (legend && !isNaN(parseInt(legend.innerWidth())))?parseInt(legend.innerWidth()):0;
		var graphWidth = (containerWidth - legendWidth)*0.98;
		target.css("width",graphWidth+"px");
	}
}();