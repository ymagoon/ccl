function DiscernAnalyticsComponentStyle() {this.initByNamespace("da"); }

DiscernAnalyticsComponentStyle.inherits(ComponentStyle);

function DiscernAnalyticsComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new DiscernAnalyticsComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.DISCERNANALYTICS.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.DISCERNANALYTICS.O1 - render component");
	this.setIncludeLineNumber(true);
	this.setScope(1);
	this.daFilter = 1;	//filter defaults to not met
	this.custTxt = "";
	this.formId = "";


	DiscernAnalyticsComponent.method("setDAFilter", function (value) {
        this.daFilter = value;
    });
	DiscernAnalyticsComponent.method("getDAFilter", function () {
        return (this.daFilter);
    });
	DiscernAnalyticsComponent.method("setCustTxt", function (value) {
        this.custTxt = value;
    });
	DiscernAnalyticsComponent.method("getCustTxt", function () {
        return (this.custTxt);
    });
	DiscernAnalyticsComponent.method("setFormId", function (value) {
        this.formId = value;
    });
	DiscernAnalyticsComponent.method("getFormId", function () {
        return (this.formId);
    });

    DiscernAnalyticsComponent.method("InsertData", function () {
        CERN_DISCERN_ANALYTICS_O1.GetDiscernAnalyticsTable(this);
    });
    DiscernAnalyticsComponent.method("HandleSuccess", function (recordData) {
		CERN_DISCERN_ANALYTICS_O1.RenderComponent(this, recordData);
	});
}

DiscernAnalyticsComponent.inherits(MPageComponent);

// DiscernAnalyticsComponent Begins
/**
 * The Discern Analytics namespace <CODE>CERN_DISCERN_ANALYTICS_O1</code> is utilized for retrieving and rendering
 * the information for a specific patient contained within Discern Analytics, most notably Chronic Condition Manamgent Information
 */

var CERN_DISCERN_ANALYTICS_O1 = function () {
    return {
        GetDiscernAnalyticsTable: function (component) {
            var sendAr = [];
			var criterion = component.getCriterion();
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.ppr_cd + ".0 ", "^" + criterion.category_mean + "^"); 
            MP_Core.XMLCclRequestWrapper(component, "mp_get_discern_analytics", sendAr, true);
        },
		
        RenderComponent: function (component, recordData) {
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
				component.setEditMode(false);
                var daArray = [];
				var daHTML = "";
				var countText = "";
				var daResultsFlg = 1;
				
				//If no results are returned, set HTML to display No Results Found
				if(recordData.CONDITION_CNT === 0) {
					daArray.push("<span class='res-none'>" + i18n.NO_RESULTS_FOUND + "</span>");
					daHTML = daArray.join("");
					countText = "(0)";	
					daResultsFlg = 0;
				}
				else {
					var componentId = component.getComponentId();
					var dai18n = i18n.discernabu.discern_analytics_o1;
					var daFilterStg = component.getDAFilter();	//current setting of the filter
					var notMetFilterCnt = recordData.MEAS_NM_CNT;
					var totMeasCnt = 0;
					var filtMeasCnt = 0;
					

					//Setup Custom Text and Link for Algorithms
					var algLink = recordData.ALG_LINK;
					if (algLink || component.getCustTxt()) { 		//only render static info row in the component when an algorithm link and/or custom text has not been provided in Bedrock
						daArray.push("<div><table class='da-staticinfo'><tr><td class='da-updt'>", component.getCustTxt(), "</td>");

						if (algLink) {
							var algorithm = "<a onclick='MP_Util.Doc.LaunchHelpWindow(\"" + algLink + "\")'>" + dai18n.ALGORITHMS + "</a>";
							daArray.push("<td class='da-algorithm'>", algorithm,  "</td>");
						}
						daArray.push("</tr></table></div>");
					}
					
					//Add Drop Down filter
					daArray.push("<div class='da-cbo'><form><span class='da-cond-lbl'>" + dai18n.DISPLAY + ":</span><select id='daOption", componentId, "'>", SortFilterOptions(component, dai18n), "</select></form></div>");

					//Display the static information with "All Measures Met" if the filter is set to Not Met and there are only measures with positive outcomes
					if (daFilterStg === 1 && notMetFilterCnt === 0) {
						daArray.push("<h3 class='info-hd'><span class='res-normal'>" + dai18n.ALL_MET + "</span></h3><span class='res-none'>" + dai18n.ALL_MET + "</span>");
					}
					else {
						var condition = recordData.CONDITION;
						var condCnt = recordData.CONDITION_CNT;  //number of conditions
						if (daFilterStg === 1) {  //determine the number of measures present based on the filter setting
							filtMeasCnt = recordData.MEAS_NM_CNT;
						}
						else {
							filtMeasCnt = recordData.MEAS_CNT;
						}
						//Construct Component Content
						daArray.push("<div class='", MP_Util.GetContentClass(component, filtMeasCnt), "'>");

						for (var i=0; i<condCnt; i++) {
							var allMeasCnt = condition[i].CMEAS_CNT;  //store count of all measures returned regardless of outcome group
							var measCnt = 0;
							if (daFilterStg == 1) {  //determine the number of measures for each condition based on the filter setting
								measCnt = condition[i].CMEAS_NM_CNT;
							}
							else {
								measCnt  = condition[i].CMEAS_CNT;
							}
							
							if (measCnt) {  //only render the condition header if measures exist for that condition based on the filter setting
								daArray.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", condition[i].COND_NAME, " (", measCnt, ")</span></h3><div class='sub-sec-content'>");
								
								for (var j=0; j<allMeasCnt; j++) {
									var measure = condition[i].MEASURES[j];
									var measOutcome = measure.OUTCOME_GRP;
									
									//if the filter is set to Not Met (1), only display the measures that meet that criteria
									if (daFilterStg == 1) {
										if(measOutcome > 1) {
											daArray.push(buildMeasure(measure, measOutcome, dai18n));
										}
									}
									else {
										daArray.push(buildMeasure(measure, measOutcome, dai18n));
									}
								}
								daArray.push("</div></div>");
							}
						}
					}
					daHTML = daArray.join("");
					countText = MP_Util.CreateTitleText(component, filtMeasCnt);
				}
                MP_Util.Doc.FinalizeComponent(daHTML, component, countText);
				appendDaCompEvents(component, daResultsFlg);
			} 
			
            catch (err) {
                if (timerRenderComponent) {
                    timerRenderComponent.Abort();
                    timerRenderComponent = null;
                }
                throw (err);
            }
            finally {
                if (timerRenderComponent){ 
                    timerRenderComponent.Stop();
                }
            }
		}
    };

/**
 * Build the proper HTML output for the drop down menu according to what has been selected/defaulted
 * @param {object} component : the component object
 * @param {string} compi18n : the designation for the proper component internationalization information
 */
function SortFilterOptions (component, compi18n) {
	var daFilterOptions = "";
	if (component.getDAFilter() === 1) {
		daFilterOptions = "<option value='selected'>" + compi18n.NOTMET + "</option><option>" + compi18n.ALL + "</option>";
	}
	else {
	daFilterOptions = "<option value='selected'>" + compi18n.ALL + "</option><option>" + compi18n.NOTMET + "</option>";
	}
	return daFilterOptions;
};

/**
 * Build the individual rows for each measure
 * @param {object} measure : the measure object containing the details of each Discern Aanlytics measure
 * @param {string} outcomeGrp : a number indicating the group the outcome belongs to
 * @param {string} compi18n : the designation for the proper component internationalization information
 */
function buildMeasure (measure, outcomeGrp, compi18n) {
	var measureAr = [];
	var measIcon = "";		
	switch (outcomeGrp) {		//assign class to display the appropriate icon
		case 0:
			measIcon = "da-meas-exclude";
			break;
		case 1:
			measIcon = "da-meas-done";
			break;
		case 2:
			measIcon = "da-meas-notdone";
			break;
		case 3:
			measIcon = "da-meas-notmet";
			break;
		default:
			//do nothing
	};
	
	//format date for hover
	var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	var updateDT = new Date();
	var updatedTime = "";
	if (measure.EXTRACT_DTTM) {
		updateDT.setISO8601(measure.EXTRACT_DTTM);
		updatedTime=df.format(updateDT,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
	}
	
	measureAr.push("<dl class='da-info'><dt class='da-val'>", i18n.MEASUREMENT_DETAILS, "</dt><dd class='da-measure'><span>",measure.MEASURE,"</span></dd><dd class='da-icon'><span class='",measIcon,"'>&nbsp;</span></dd><dd class = 'da-outcome'><span>",measure.OUTCOME_DISP,"</span></dd></dl>")
	measureAr.push("<h4 class='det-hd'>",i18n.DETAILS,"</h4><div class='hvr'><dl class='da-det'><dt><span>", compi18n.LASTUPDATED, " :</span></dt><dd><span>", updatedTime, "</span></dd></dl></div>");
	
	return measureAr.join("");
};

/**
 * Append the PlusAdd icon to the component header if a Powerform has been selected in Bedrock and adds the on change event to the drop down menu (only if results have been returned)
 * @param {object} component : the component object
 * @param {string} resultsFlg : a flag indicating whether results have been returned by the data retrieval (0 = no results / 1 = results returned)
 */
function appendDaCompEvents (component, resultsFlg) {
	var ns = component.getStyles().getNameSpace();
	var componentId = component.getComponentId();
	
	//Insert Plus Add if a Powerform has been specified in Bedrock
	if(component.getFormId()) {
		var link = Util.cep("a", { className: 'add-plus da-add', 'id': ns + componentId + 'Add' });  //create anchor element for plus add link
		var img = Util.cep("span", { className: 'add-icon' }); //create element for link image
		Util.ac(img, link);
		
		var secCL = Util.Style.g("sec-title", _g(ns + componentId), "span");
		var secSpanAr = Util.gcs(secCL[0]);
		var secSpanLen = secSpanAr.length - 1; //find the last span in this node
		var secSpan = secSpanAr[secSpanLen];
		
		Util.ac(link, secSpan);
		Util.addEvent(_g(ns + componentId + "Add"), "click", function(){daAddFn(component)});  //add onclick event to plus add link
	}
	
	//add onchange event for filter options if results are returned
	if(resultsFlg > 0) {
		Util.addEvent(_g("daOption" + componentId), "change", 
			function() {
			component.setEditMode(true);		//prevent hovers from rendering while component is being refreshed
				if (component.getDAFilter() === 0) {
					component.setDAFilter(1);
				}
				else {
					component.setDAFilter(0);
				}
				component.InsertData();
			}
		); 
	}
};

/**
 * Function to launch a powerform from the PlusAdd icon
 * @param {object} comp : the component object
 */
function daAddFn(comp) {
	var criterion = comp.getCriterion();
	var formId = comp.getFormId();
	var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + formId +".0|0|0";
	try {
		MP_Util.LogMpagesEventInfo(comp, "POWERFORM", paramString, "discernanalytics.js", "daAddFn");
		MPAGES_EVENT("POWERFORM", paramString);
	}
	catch(err) {
		MP_Util.LogJSError(err,null,"discernanalytics.js","daAddFn");
	}
}
}();

// DiscernAnalyticsComponent Ends
