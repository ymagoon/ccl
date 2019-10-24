	/**
	* @class
	*/
	function NeonateBilirubinComponentStyle()
	{
		this.initByNamespace("neoblood");
	}
	
	
	NeonateBilirubinComponentStyle.inherits(ComponentStyle);
	
	/**
	 * The NeonateBilirubin component 
	 * 
	 * @param {Criterion} criterion
	 */
	function NeonateBilirubinComponent(criterion){
	    this.setCriterion(criterion);
	    this.setStyles(new NeonateBilirubinComponentStyle());
	    this.setIncludeLineNumber(true);
	    this.expandCollapsedButtonClicked = false;
	    
	    var riskEvents = "0.0";
	    var serumEvents = "0.0";
	    var transEvents = "0.0";
	    var photoEvents = "0.0";
	    var photoStartEvents = "0.0";
	    var photoStopEvents = "0.0";
	    var birth_dt_tm = 0.0;
	    
	    var photoStartNomens = [];
		var photoStopNomens = [];
		
	    this.setComponentLoadTimerName("USR:MPG.BILIRUBIN.O1 - load component");
	    this.setComponentRenderTimerName("USR:MPG.BILIRUBIN.O1 - render component");
	    
	    NeonateBilirubinComponent.method("InsertData", function(){
			retrieveGroups(this);    	
	        CERN_BILIRUBIN_O1.GetBilirubinTable(this);
	    });
	    NeonateBilirubinComponent.method("HandleSuccess", function(recordData){
	        CERN_BILIRUBIN_O1.RenderComponent(this, recordData);
	    });
	    NeonateBilirubinComponent.method("getHyperbiliRiskEvents", function () {
	        return riskEvents;
	    });
	    NeonateBilirubinComponent.method("getSerumBiliEvents", function () {
	        return serumEvents;
	    });
	    NeonateBilirubinComponent.method("getTranscutBiliEvents", function () {
	        return transEvents;
	    });
		NeonateBilirubinComponent.method("getPhotoActivityEvents", function () {
	        return photoEvents;
	    });
	    NeonateBilirubinComponent.method("getPhotoStartEvents", function () {
	        return photoStartEvents;
	    });
	    NeonateBilirubinComponent.method("getPhotoStopEvents", function () {
	        return photoStopEvents;
	    });
	    NeonateBilirubinComponent.prototype.getDOB = function(){
	    	return this.birth_dt_tm;
	    };
	    NeonateBilirubinComponent.prototype.setDOB = function(event_code){
	    		this.birth_dt_tm = event_code;
	    };
	    NeonateBilirubinComponent.method("getPhotoStartNomens", function () {
	        return photoStartNomens;
	    });
	    NeonateBilirubinComponent.method("setPhotoStartNomens", function (value) {
	        photoStartNomens = value;
	    });
	    NeonateBilirubinComponent.method("getPhotoStopNomens", function () {
	        return photoStopNomens;
	    });
	    NeonateBilirubinComponent.method("setPhotoStopNomens", function (value) {
	        photoStopNomens = value;
	    });
	    
		function retrieveGroups(component){
	        var groups = component.getGroups();
	        var xl = (groups) ? groups.length : 0;
	        for (var x = xl; x--; ) {
	            var group = groups[x];
	            switch (group.getGroupName()) {
	                case "NEO_HYPERBILI_RISK_CAT":
	                   riskEvents = MP_Util.CreateParamArray(group.getEventSets(), 1);
	                    break;
	                case "NEO_SERUM_BILI":
	                    serumEvents = MP_Util.CreateParamArray(group.getEventSets(), 1);
	                    break;
	                case "NEO_TRANSCUT_BILI":
	                    transEvents = MP_Util.CreateParamArray(group.getEventSets(), 1);
	                    break;
	                case "NEO_PHOTO_ACTIVITY":
	                    photoEvents = MP_Util.CreateParamArray(group.getEventSets(), 1);
	                    break;    
	                case "NEO_PHOTO_START_DT_TM":
	                    photoStartEvents = MP_Util.CreateParamArray(group.getEventCodes(), 1);
	                    break;
	                case "NEO_PHOTO_STOP_DT_TM":
	                    photoStopEvents = MP_Util.CreateParamArray(group.getEventCodes(), 1);
	                    break;       
	            }
	        }
	    } 
	}
	
	NeonateBilirubinComponent.inherits(MPageComponent);
	
	NeonateBilirubinComponent.prototype.loadFilterMappings = function() {
		this.addFilterMappingObject("NEO_HYPERBILI_BIRTH_DT_TM", {
			setFunction : this.setDOB,
			type : "ARRAY",
			field : "PARENT_ENTITY_ID"
		});
	};
	
	NeonateBilirubinComponent.prototype.preProcessing = function() {
		var sEventSets = "0.0";
		var sEventCodes = this.birth_dt_tm;
		var sBeginDate = "^^";
		var sEndDate = "^^";
		var includeEventSetInfo = 1;
		var includeCommentInfo = 1;
		var sendAr = [];
		var criterion = this.getCriterion();
		var encntrs = criterion.getPersonnelInfo().getViewableEncounters();
		var sEncntr = (encntrs) ? "value(" + encntrs + ")" : "0";
		var request = new MP_Core.ScriptRequest(this, this
				.getComponentLoadTimerName());
		var dob = null;
		var df = MP_Util.GetDateFormatter();
		var dateOfBirth = new Date();
		var noOfHours = null;
		var component = this;
		this.babyDob = new Date();
		var dateOfBirthDuration = 0.0;
	
		try {
			if (sEventCodes !== undefined) {
				sendAr.push("^MINE^", criterion.person_id + ".0", sEncntr,
						criterion.provider_id + ".0", criterion.ppr_cd + ".0", 1,
						"^^", sEventSets, sEventCodes + ".0", this.getLookbackUnits(),
						this.getLookbackUnitTypeFlag(), includeEventSetInfo,
						sBeginDate, sEndDate, includeCommentInfo);
	
				request.setProgramName("MP_RETRIEVE_N_RESULTS_JSON");
				request.setParameters(sendAr);
				request.setAsync(false);
				MP_Core.XMLCCLRequestCallBack(
								this,
								request,
								function(reply) {
									var response = reply.getResponse();
									if (reply.getStatus() === 'S') {
										// set DOB returned from new script
										dob = response.RESULTS[0].CLINICAL_EVENTS[0].MEASUREMENTS[0].DATE_VALUE[0].DATE;
										dateOfBirth.setISO8601(dob);
									} else {
										dateOfBirth = null;
									}
								});
				if (dateOfBirth !== null) {
					var curDate = new Date();
					dateOfBirthDuration =  Math.abs(curDate.getTime() - dateOfBirth.getTime()); 
					noOfHours = dateOfBirthDuration/(1000 * 60 * 60);
				}
			}
			if (dateOfBirth === null || noOfHours > 156 || sEventCodes === undefined) {
				this.setDisplayEnabled(false);
			}
		} catch (err) {
			MP_Util.LogJSError(err, this, "neonatebilirubin.js", "preProcessing");
		}
		this.babyDob = dateOfBirth;
	}; 
	
	
	 /**
	  * NeonateBilirubin methods
	  * @namespace CERN_BILIRUBIN_O1
	  * @dependencies Script: mp_nbs_hyperbili
	  */
	var CERN_BILIRUBIN_O1 = function(){
		
		var bilirubinGrapher = function(component, bilirubinData, dob, unitDisplay, photoStart, photoStop) {
			//Private Data and Methods
			//var plot = null; //reference to the plot object returned from jQuery.plot()		
			var i18n_nb = i18n.discernabu.neonatebilirubin_o1;
			var componentId = component.getStyles().getContentId();
			var rootId = component.getStyles().getId();
			//Note:
			
			//These hashes are a somewhat dirty hack around the problem that I couldn't find a good way to associate
			//extra data with the datapoints.  We need to know the number of decimal places returned
			//for each datapoint in the JSON in order to accurately display the values in the hover.  (Otherwise all we 
			//have is a Number and we're stuck with how toString or toLocaleString handle precision.  Neither are bad
			//but we can't display the value exactly as documented)  Each hash uses the timestamps of the results from 
			//the two datasets as a key and the value is the number of decimal places to display.  This does mean,
			//unfortunately, that if we have two values in the same dataset at the exact same time that we can't keep a
			//precision for both of them.  We'll use the greatest precision out of all the colliding values to avoid
			//losing precision but it does mean we would get extra trailing zeros on some of them)
			//
			//The correct approach would probably be to write a plugin to allow associating arbitrary data
			//with the points of a dataset 
			var serumDisplayHash = [];
			var transDisplayHash = [];
			
			var serumLabel = i18n_nb.SERUM_BILIRUBIN + "(" + unitDisplay + ")";
			var transLabel = i18n_nb.TRANS_BILIRUBIN + "(" + unitDisplay + ")";
			
			var base = new Date(dob.getTime());
			//var markings = [];
			
			var lowrange = [[20, 4.8], [24,5], [28,5.6], [40,7.8], [44,8.1], [48,8.6], [60,9.6], [72,11.15], [84,11.7], [96,12.4], [120,13.3], [132,13.2]];
			var midrange = [[20, 5.85], [24,6.4], [28,7], [40,9.9], [44,10.15], [48,10.8], [60,12.6], [72,13.45], [84,14.7], [96,15.15], [120,15.85], [132,15.5]];
			var highrange = [[20, 7.4], [24,7.85], [28,8.9], [40,12.15], [44,12.5], [48,13.2], [60,15.2], [72,15.9], [84,16.75], [96,17.45], [120,17.65], [132,17.5]];
			var lowtail_points = [[132,13.2], [168, 13.2]];
			var midtail_points = [[132,15.5], [168, 15.5]];
			var hightail_points = [[132,17.5], [168, 17.5]];
			var lowpre_points = [[12,3.9],[20, 4.8]];
			var midpre_points = [[12,4.7],[16, 5.3],[20,5.85]];
			var highpre_points = [[12,6.8],[16, 6.4],[20,7.4]];
			
			
	  		   
			//x values of the reference sets are in hours of age, need to transform into timestamps offset from DoB
			function transformReferencePoints(dataset) {
				return dataset.map(function(p) {
					var xDate = new Date(dob.getTime());
					xDate.setHours(xDate.getHours()+p[0]);
					return [xDate.getTime(), p[1]];
				});
			}
			
			function buildDataSet(bilirubinData, type, precisionHash) {
				var dataResults = [];
				jQuery.each(bilirubinData, function(results, d){
					var resultDt = new Date();
					var micromolsTomgConverntionValue = 17.104;
					resultDt.setISO8601(this.RESULT_DT_TM);
					if (this.TYPE === type){
						//To have the values converted in mg/dl from micromol/l
						if(this.CONVERTION_VALUE === 1){
							this.RESULT_VALUE = Math.ceil((this.RESULT_VALUE)/micromolsTomgConverntionValue);
						}
						dataResults.push([resultDt.getTime(), this.RESULT_VALUE]);
						
						//Using result timestamp and result value as key to hash to handle case 
						//when two results are documented at the exact same time, but have different precision
						var precision = precisionHash[resultDt.getTime()+this.RESULT_VALUE]; //TODO: fix this
						if (precision === undefined) {
							precisionHash.push([resultDt.getTime()+this.RESULT_VALUE, this.RESULT_DISPLAY]);
						}
					}
				});
				return dataResults;
			}
			
			function hourTicksGenerator(min, max){
				var res = [];
				var v = min;
				var i = 0;
				do {
				  res.push([v, i]);
				  i+=12;
				  var d = new Date(v);
				  d.setHours(d.getHours() + 12); //12 hours; using date math to consider daylight savings times
				  v = d.getTime();
				} while (v <= max);
				return res;
			}
	
			function dateTicksGenerator(min, max){
				var df = MP_Util.GetDateFormatter();
				var res = [];
				var v = min;
				var d = new Date(min);
				do {
				  res.push([v, df.formatISO8601(d.toJSON(),mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR)]);
				  d = new Date(v);
				  d.setHours(d.getHours() + 24); //24 hours; using date math to consider daylight savings times
				  v = d.getTime();
				} while (v <= max);
				return res;
			}
			
			function micromolTicksGenerator(){
				var res = [];
				var i = 0;
				var bilirubinValue = 0;
				do {
					switch(i)
					{
						case 0 : bilirubinValue = 0;
								 break;
						case 5 : bilirubinValue = 85;
								 break;
						case 10: bilirubinValue = 171;
								 break;
						case 15: bilirubinValue = 257;
								 break;
						case 20: bilirubinValue = 342;
								 break;
						case 25: bilirubinValue  = 428;
								 break;
						default: bilirubinValue = " ";
								 break;
					}
				res.push([i, bilirubinValue]);
				i++;
				} while (i <= 25);
				return res;
			}
			lowrange = transformReferencePoints(lowrange);
			midrange = transformReferencePoints(midrange);
			highrange = transformReferencePoints(highrange);
			
			var endDt = new Date(dob.getTime());
			endDt.setDate(endDt.getDate()+7);
			var biliPoints = buildDataSet(bilirubinData, "SERUM", serumDisplayHash);
			var transPoints = buildDataSet(bilirubinData, "TRANSCUTANEOUS", transDisplayHash);
	
			var photoStartPoints = [];
			if (photoStart) {
				jQuery.each(photoStart, function(pstart,d){
					var pstartDt = new Date();
					pstartDt.setISO8601(this.PHOTOTHERAPY_START_DTTM);
					photoStartPoints.push([pstartDt.getTime(),0], [pstartDt.getTime(),25], [pstartDt.getTime(),-1]);
				});
			}
	
			var photoStopPoints = [];
			if (photoStop) {
				jQuery.each(photoStop, function(pstop,d){
					var pstopDt= new Date();
					pstopDt.setISO8601(this.PHOTOTHERAPY_STOP_DTTM);
					photoStopPoints.push([pstopDt.getTime(),0], [pstopDt.getTime(),25], [pstopDt.getTime(),-1]);
				});
			}		
			
			var hourticks = hourTicksGenerator(base.getTime(),endDt.getTime());
			var dateticks = dateTicksGenerator(base.getTime(),endDt.getTime());
			var micromolticks = micromolTicksGenerator();
			
			var set = biliPoints;
			var set2 = biliPoints;
			var set3 = transPoints;
			
			var photoStartLine =  (photoStart) ? photoStartPoints : [];		
			var photoStopLine =  (photoStop) ? photoStopPoints : [];
			
			var low = lowrange;
			var mid = midrange;	
			var high = highrange;	
			var lowtail = transformReferencePoints(lowtail_points);
			var midtail = transformReferencePoints(midtail_points);
			var hightail = transformReferencePoints(hightail_points);		
			var lowpre = transformReferencePoints(lowpre_points);
			var midpre = transformReferencePoints(midpre_points);
			var highpre = transformReferencePoints(highpre_points);
			
			var options = {
	 			graphName: 'neoblood-biligraph-'+ rootId,
				seriesDefaults: { 
					showMarker:false, 
					pointLabels: { show:false }, 
					hoverable: false, 
					highlightMouseDown: true,
					showDataLabels: true	
				},
				series:[
	        		{ 
						label: 'photoStartLine',
						showLine: true,
						markerOptions: { show: true, style:'circle', size:1 },
						lineWidth: 1,
						hoverable: false,
						color: '#66FF33'
					},
					{ 
						label: 'photoStopLine',
						showLine: true,
						markerOptions: { show: true, style:'circle', size:1 },
						lineWidth: 1,
						hoverable: false,
						color: '#FF0000'
					},
					{ 
						label: 'low',
						showLine: true,
						markerOptions: { show: true, size: 2.5, style:'circle' },
						hoverable: false, 
						color: '#666666'
					},
					{
						label: 'mid',
						showLine: true,
						markerOptions: { show: true, size: 2.5, style:'circle' },
						hoverable: false, 
						color: '#666666'
					},	
					{
						label: 'high',
						showLine: true,
						markerOptions: { show: true, size: 2.5, style:'circle' },
						hoverable: false, 
						color: '#666666'
					},	
					{
					    label: 'lowtail',
						showLine: true, 
						lineWidth: 0.5,
						hoverable: false, 
						color: '#cccccc' 
					},
					{
					    label: 'midtail',
						showLine: true, 
						lineWidth: 1,
						hoverable: false, 
						color: '#cccccc' 
					},
					{
						label: 'hightail',
						showLine: true, 
						lineWidth: 1,
						hoverable: false, 
						color: '#cccccc' 	
					},
					{
						label: 'lowpre',
						showLine: true, 
						lineWidth: 1,
						hoverable: false, 
						color: '#cccccc' 		
					},
					{
						label: 'midpre',
						showLine: true, 
						lineWidth: 1,
						hoverable: false, 
						color: '#cccccc' 
					},
					{
						label: 'highpre',
						showLine: true, 
						lineWidth: 1,
						hoverable: false, 
						color: '#cccccc' 			
					},
					{ 
						label: 'set',
			    		markerOptions: { show: true, style:'circle', size:5.75 },
						showLine: false,			
						color: '#99CCFF'
					},
					{
						//set2
						markerOptions: { show: true, style:'circle', size:5.75 },
						label: serumLabel,		
						xaxis: 'x2axis',
						yaxis: 'y2axis',
						showLine: false,
						color: '#99CCFF'
					},
					{ 
						//set 3
						markerOptions: { show: true, style:'circle', size:5.75 },
						label: transLabel,		
						xaxis: 'x2axis',
						yaxis: 'y2axis',
						showLine: false,
						color: '#FF6633'	
					}
	   			],
				axes: {
	        		xaxis: {
						renderer: $.jqplot.DateAxisRenderer,
						tickOptions: { showMark: false, showLabel: true, formatString:'%#N' },
						min: (base.getTime()),
						max: (endDt.getTime()),
						ticks: hourticks
					},
					yaxis: {
						min: 0,
						max: 25,
						tickInterval: 5,
						tickOptions: { showMark: false, showLabel: true },
						label:i18n_nb.MG_UNIT,
						labelOptions: {fontSize: '10pt'}
					},	
					x2axis: {
						renderer:$.jqplot.DateAxisRenderer,
						tickOptions: { mark: 'cross', show: true, formatString: '%s', fontSize: 9 },
						min: (base.getTime()),
						max: (endDt.getTime()),				
						ticks: dateticks
					},
					y2axis: {
						tickOptions: { showMark: false, showLabel: true, formatString:'%#N' },
						min: 0,
						max: 25,
						ticks: micromolticks,
						label:i18n_nb.MICROMOL_UNIT,
						labelOptions: {fontSize: '10pt'}	
					}	
	    		},
				legend: {
	        		show: false
	    		},
				grid: {
		    		drawGridLines: true,
		    		hoverable: false,
					shadow: false,
					background: '#ffffff'
				},
		 		cursor: {
	       			showTooltip: false 
				}
			};
			
			
	
			//removing + readding the graph container div and replotting the graph proved to be much too slow
			//especially as more labels were added to the graph.  Had to settle for a fixed size graph and
			//the only pupose of this function now is to draw the graph for the first time in the case where
			//the bilirubin section is loaded as intially collapsed and we can't draw the graph in it at first
			var redrawGraph = function() {
				var biligraph = $('neoblood-biligraph-'+ rootId);
				if (!biligraph && (!jQuery('#' + rootId).hasClass("closed"))){
					drawGraphImpl();
				}
				else{
					return;
				}
			};		
			
			//Public methods
			var drawGraphImpl = function() {
				//Redrawing the graph on resize just got too slow and without time to see if it could be improved instead we'll
				//just plot it at a fixed size and center it.  383x300 is just big enough to display the entire graph when PowerChart
				//is full screen at 1024x768
			
					jQuery("#"+componentId).append("<div id='neoblood-bilirubin-graph'><div id='neoblood-biligraph-"+ rootId +"'></div></div>");
					
					var plot = $.jqplot('neoblood-biligraph-'+ rootId,[photoStartLine, photoStopLine, low, mid, high, lowtail, midtail, hightail, lowpre, midpre, highpre, set, set2, set3], options);
					
					// Now bind function to the highlight event to show the tooltip
	  				// and highlight the row in the legend. 
					var previousPoint = null;
					$('#neoblood-biligraph-'+rootId).bind('jqplotDataMouseOver',
	    				function (ev, seriesIndex, pointIndex, data) {    
							var x = data[0];
							var y = data[1]; 
		   					var tooltipText='';
		           
							var df = MP_Util.GetDateFormatter();
							var dt = new Date(x);
					        // Hover text for Photo Start Line
							if (plot.series[seriesIndex].label === 'photoStartLine') {	
								tooltipText=i18n_nb.PHOTOTHERAPY_START + "<br/>" + df.formatISO8601(dt.toJSON(), mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR );
							}
							else {
								// Hover text for Photo Stop Line
								if (plot.series[seriesIndex].label === 'photoStopLine') {
									tooltipText=i18n_nb.PHOTOTHERAPY_STOP + "<br/>" + df.formatISO8601(dt.toJSON(), mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR );
								}
								else {
									// Hover text for data points (i.e serum or transcutaneous data points)
									if (plot.series[seriesIndex].label === serumLabel ||
										plot.series[seriesIndex].label === transLabel ) {
									
										// check to see if the point has been cached (i.e. previous point)
										// if was cached (previous point), pull from the previous point array
										if ((previousPoint !== null) && (previousPoint.sidx === seriesIndex && previousPoint.idx === pointIndex)) {
											tooltipText = previousPoint.tooltipTxt;
										} else {
											// if this is a new point, construct the hover text
											// determine what data attributes to pull from based on data point (series) type
											var displayHash = (plot.series[seriesIndex].label === serumLabel) ? serumDisplayHash : transDisplayHash;
											// since the data attributes of each data point were pushed on chronologically, 
											// please note they are now in the reverse order
											// retrieve data point attributes
											displayHash.reverse();
											var display = y;
											if (displayHash[pointIndex][0]===(x+y)) {
												display = displayHash[pointIndex][1];
											} else {
												displayHash.reverse();
												display = displayHash[pointIndex][1];
											}
											// Construct the hover text
											tooltipText = i18n_nb.DATE_COLLECTED + ": " + df.formatISO8601(dt.toJSON(), mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR )+ "<br/>" + i18n_nb.RESULT + ": " + display + "<br/>" + i18n_nb.AGE_HOURS + ": " + elapsedHours(dob,dt);            
										}
										// Add to previous point cache
										previousPoint = {'sidx':seriesIndex, 'idx':pointIndex, 'tooltipTxt':tooltipText};
									}
								}
							}	
						
							//Display hover text
							if (tooltipText === '') {
								jQuery("#neoblood-biligraph-"+ rootId +" .jqplot-highlighter-tooltip").empty();
								jQuery("#neoblood-biligraph-"+ rootId +" .jqplot-highlighter-tooltip").hide();
							} else {
								if ( (plot.series[seriesIndex].label === serumLabel || plot.series[seriesIndex].label === transLabel) && elapsedHours(dob,dt) >= 108) {
									jQuery("#neoblood-biligraph-"+ rootId +" .jqplot-highlighter-tooltip").css({top:plot.axes.yaxis.u2p(y)+5,left:plot.axes.xaxis.u2p(x)-230});
								} else {
									jQuery("#neoblood-biligraph-"+ rootId +" .jqplot-highlighter-tooltip").css({top:plot.axes.yaxis.u2p(y)+5,left:plot.axes.xaxis.u2p(x)+5});
								}
								jQuery("#neoblood-biligraph-"+ rootId +" .jqplot-highlighter-tooltip").html(tooltipText);
								jQuery("#neoblood-biligraph-"+ rootId +" .jqplot-highlighter-tooltip").show();
							}
	    			});
	   
	  				// Bind a function to the unhighlight event to clean up after highlighting.
	 				$('#neoblood-biligraph-'+ rootId).bind('jqplotDataUnhighlight', 
	      				function (ev, seriesIndex, pointIndex, data) {
	         				 jQuery("#neoblood-biligraph-"+ rootId +" .jqplot-highlighter-tooltip").empty();
	         				 jQuery("#neoblood-biligraph-"+ rootId +" .jqplot-highlighter-tooltip").hide();
	      			});
					
					var xo=plot.axes.xaxis.u2p(endDt.getTime());
					var yo=plot.axes.yaxis.u2p(20.2);
					jQuery("#neoblood-biligraph-"+rootId).append('<div id="neoblood-bilirubin-reflabel" style="left:'+(xo-50)+"px;top:"+yo+'px">'+i18n_nb.HIGH_RISK+'</div>');
					yo=plot.axes.yaxis.u2p(17.6);
					jQuery("#neoblood-biligraph-"+rootId).append('<div id="neoblood-bilirubin-reflabel" style="left:'+(xo-111)+"px;top:"+yo+'px">'+i18n_nb.HIGH_INTERMEDIATE_RISK+'</div>');
					yo=plot.axes.yaxis.u2p(15.4);
					jQuery("#neoblood-biligraph-"+rootId).append('<div id="neoblood-bilirubin-reflabel" style="left:'+(xo-110)+"px;top:"+yo+'px">'+i18n_nb.LOW_INTERMEDIATE_RISK+'</div>');
					yo=plot.axes.yaxis.u2p(12.4);
					jQuery("#neoblood-biligraph-"+rootId).append('<div id="neoblood-bilirubin-reflabel" style="left:'+(xo-49)+"px;top:"+yo+'px">'+i18n_nb.LOW_RISK+'</div>');
					
					xo=plot.axes.xaxis.u2p(highpre[0][0]);
					yo=plot.axes.yaxis.u2p(6.8);
					jQuery("#neoblood-biligraph-"+rootId).append('<div id="neoblood-bilirubin-reflabel" style="left:'+(xo-18)+"px;top:"+(yo-10)+'px">95%</div>');
					xo=plot.axes.xaxis.u2p(midpre[0][0]);
					yo=plot.axes.yaxis.u2p(4.7);
					jQuery("#neoblood-biligraph-"+rootId).append('<div id="neoblood-bilirubin-reflabel" style="left:'+(xo-18)+"px;top:"+(yo-10)+'px">75%</div>');
					xo=plot.axes.xaxis.u2p(lowpre[0][0]);
					yo=plot.axes.yaxis.u2p(3.9);
					jQuery("#neoblood-biligraph-"+rootId).append('<div id="neoblood-bilirubin-reflabel" style="left:'+(xo-18)+"px;top:"+(yo-5)+'px">40%</div>');
				
					jQuery("#"+componentId).append("<div id='neoblood-bilirubin-xaxislabel'>"+i18n_nb.POSTNATAL_AGE_IN_HOURS+"</div");
					jQuery("#"+componentId).append("<div id='neoblood-bilirubin-xaxislabel'>"+i18n_nb.BILIRUBIN_COPYRIGHT+"</div");
			};
			
			 var elapsedHours = function(start, end) {
					//this does seem to account correctly for DST changes
					var endTZ = end.getTimezoneOffset();
					var startTZ = start.getTimezoneOffset();
					var diffTZ = (endTZ - startTZ) / 60;
					var elapsedMilliseconds = end - start;
					var hours = elapsedMilliseconds / (1000 * 60 * 60);
					return Math.floor(hours) - diffTZ;
				};
			
			//Bilirubin Graph object 
			return {
				
				//draws the hyperbilirubinemia graph on click of Collpase/Expand on Component menu option 
				//and hooks the window.onresize event to redraw
				drawGraph : function(){
					if ((!jQuery('#' + rootId).hasClass("closed"))) {
						drawGraphImpl();
					}
					else{
						$("#" + rootId + " .sec-hd-tgl").click(function(){
							 if(component.expandCollapsedButtonClicked === false){
								 component.expandCollapsedButtonClicked = true;
								 drawGraphImpl();
							 }
						});
					}
					//bind to the resize event
					jQuery(window).resize(redrawGraph);
				}
			};
		};
	
		return {
	        GetBilirubinTable : function(component){
				var sendAr = [];
				var criterion = component.getCriterion();
					
				var dob = '""';
				var dobTmp = component.babyDob;
				if(dobTmp !== null){
					dob =  '"' + dobTmp.format("dd-mmm-yyyy HH:MM") + '"';
				}
				
				sendAr.push("^MINE^", 
					criterion.person_id + ".0",
					criterion.provider_id + ".0",
					criterion.ppr_cd + ".0",
					dob,
					component.getSerumBiliEvents(),
					component.getTranscutBiliEvents(),
					component.getHyperbiliRiskEvents(),
					component.getPhotoActivityEvents(),
					component.getPhotoStartEvents(),
					component.getPhotoStopEvents(),
					MP_Util.CreateParamArray(component.getPhotoStartNomens(), 1),
					MP_Util.CreateParamArray(component.getPhotoStopNomens(), 1));
	
				MP_Core.XMLCclRequestWrapper(component, "MP_GET_NEONATE_HYPERBILI", sendAr, true);
	        },
	        RenderComponent: function(component, recordData){
	            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
	            try {
					var contentId = component.getStyles().getContentId();
					var i18n_nb = i18n.discernabu.neonatebilirubin_o1;
					var df = MP_Util.GetDateFormatter();
					var bloodProd = "<table class='neoblood-table'>";
					 	bloodProd += "<tr class='sub-sec-hd'><td>";
						bloodProd += i18n_nb.RISK_CATEGORY+"</td><td>"+i18n_nb.DATE_RECORDED+"</td>";
						bloodProd += "</tr>{risk}<tr class='sub-sec-hd'><td>"+i18n_nb.PHOTOTHERAPY+"</td><td>";
						bloodProd += i18n_nb.DATE_RECORDED+"</td></tr>{phototherapy}</table><div class='neoblood-bilirubin-legend'><br/>";
						bloodProd += "<span class='neoblood-serum-icon'>o</span><span class='neoblood-bilirubin-legend-item'>";
					    	bloodProd += i18n_nb.SERUM_BILIRUBIN;
					    	bloodProd += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
					    	bloodProd += "</span><span class='neoblood-trans-icon'>o</span><span class='neoblood-bilirubin-legend-item'>";
					    	bloodProd += i18n_nb.TRANS_BILIRUBIN+"</span><div>";			
	
					var noResults = "<tr><td class='res-none'>"+i18n_nb.NO_RESULTS_FOUND+"</td><td>&nbsp;</td></tr>";
				
					var photoTMP = [];				
				    jQuery.each(recordData.PHOTOTHERAPY, function(p){
						photoTMP.push("<tr><td>"+this.RESULT_VALUE+"</td><td>"+df.formatISO8601(this.RESULT_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR)+"</td></tr>");
					});
					var phototherapy = photoTMP.join("");
					
					var riskTMP = [];				
				    jQuery.each(recordData.RISK_CATEGORY,function(r){
						riskTMP.push("<tr><td>"+this.RESULT_VALUE+"</td><td>"+df.formatISO8601(this.RESULT_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR)+"</td></tr>");
					});
					var risk = riskTMP.join("");
						
					
					
					_g(contentId).innerHTML = bloodProd.interpolate({
						phototherapy:(phototherapy !== "") ? phototherapy : noResults,
						risk:(risk !== "") ? risk : noResults 
				    });
				
				
					var dateOfBirth = component.babyDob;					
					var bilirubinGraph = bilirubinGrapher(component, recordData.BILIRUBIN_DATAPOINTS, dateOfBirth, recordData.BILIRUBIN_UNIT, recordData.PHOTOTHERAPY_START, recordData.PHOTOTHERAPY_STOP);
					bilirubinGraph.drawGraph();    
				  					
						
					//can't use this since it replaces innerhtml of the section content node, 
					//which would be detrimental to the graph HTML that flot has already generated.
	                //MP_Util.Doc.FinalizeComponent("html", component, "count");
					
					var rootComponentNode = component.getRootComponentNode();
					var totalCount = Util.Style.g("sec-total", rootComponentNode, "span");
					totalCount[0].innerHTML = "";
	            } 
	            catch (err) {
					alert(err.message);
	                if (timerRenderComponent) {
						timerRenderComponent.Abort();
						timerRenderComponent = null;
					}
	                throw (err);
	            }
	            finally {
	                if (timerRenderComponent) {
	                    timerRenderComponent.Stop();
	                }
	            }
	        }
	    };
	}();