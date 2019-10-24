function LhQualityMeasureStyle() {
    this.initByNamespace("lh");
}
LhQualityMeasureStyle.prototype = new ComponentStyle();
LhQualityMeasureStyle.prototype.constructor = ComponentStyle;

/**
  * The Quality Measures Component  will retrieve the incomplete/complete outcomes of applicable conditions
  * 
  * @constructor
  * @param {Criterion} criterion
  */
function LhQualityMeasures(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new LhQualityMeasureStyle());
	this.setComponentLoadTimerName("USR:MPG.QM_SUMMARY.01 - load component");
	this.setComponentRenderTimerName("ENG:MPG.QM_SUMMARY.01 - render component");
	this.setIncludeLineNumber(true);
	this.setScope(1);
	this.resultCount = 0;
}

LhQualityMeasures.prototype = new MPageComponent();
LhQualityMeasures.prototype.constructor = MPageComponent;

/** 
  *
  * This function loads the component with the outcomes for the selected patient. This function calls
  * 'LH_MP_COMPONENT' and retrieves the data
  *
  **/
LhQualityMeasures.prototype.retrieveComponentData = function () {
	var component = this; 
	var index = this.getCookieIndex();
    var cookieContent = JSON.parse(this.getCookie('LhQualityMeasures'));
	var criterion = component.getCriterion();
	var sendAr = [ "^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", criterion.position_cd + ".0", criterion.ppr_cd + ".0", 2.0,2.0,2.0];
	var conditionIndex = cookieContent.data[index].selectedIndex;
	if (conditionIndex)
	{
		sendAr.push(conditionIndex);
	}
	else
	{
		sendAr.push(0.0);
	}

    var loadTimer = new RTMSTimer(component.getComponentLoadTimerName(), criterion.category_mean);
    var renderTimer = new RTMSTimer(component.getComponentRenderTimerName(), criterion.category_mean);
	var request = new ComponentScriptRequest();
	request.setComponent(component);
	request.setLoadTimer(loadTimer);
	request.setRenderTimer(renderTimer);
	/** Start Component specific implementation **/
	request.setProgramName("lh_mp_component");
	request.setParameterArray(sendAr);
	/** End Component specific implementation */
	request.performRequest();
};

/** 
  * This function renders the components data to the display and attaches the event handlers
  * @param {object} 
  *               replyObj is the data returned from the retrieveComponentData() function
  **/
LhQualityMeasures.prototype.renderComponent = function (replyObj) {
    var index = this.getCookieIndex();
    var cookieContent = JSON.parse(this.getCookie('LhQualityMeasures'));
	var renderResults=[];
	var comp = this;
	var compId = comp.getComponentId();
	var criterion = comp.getCriterion();
    
	try{
		
        var recordData = replyObj;
		
		var totalOutcomes=recordData.OUTCOMES_COMPLETE.length+recordData.OUTCOMES_INCOMPLETE.length;
		renderResults.push("<div class='lh-content-body' style='max-height: initial;'>");

		renderResults.push("<div class='lh-qm-cbo'><form><span class='lh-qm-cond-lbl'>", recordData.FILTERDISPLAY, "</span><select id='qmTask",compId,"'>");
		var strAlarmClock = "";
		var condtionsLength = recordData.CONDITIONS.length;
		for(var i=0;i<condtionsLength;i++){
			var activeCondition = recordData.CONDITIONS[i];
			var selectInd = activeCondition.CONDITION === recordData.SELECTED_CONDITION_ID ? "selected" : "";
			renderResults.push("<option value="+activeCondition.CONDITION_ID
						+" selected="+selectInd+">"+activeCondition.CONDITION_NAME+"</option>")	
		}
		
		renderResults.push("</select></form></div>");

		//DIV for Incomplete and Compelete
		renderResults.push("<div id='condID",compId,"'>");

		//Incomplete Section
		renderResults.push("<div id='incomp" + compId + "' class='lh-sub-sec'>");

			renderResults.push("<h3 class='lh-sub-sec-hd'><span class='lh-sub-sec-hd-tgl' title=",i18n.HIDE_SECTION,">-</span><span class='lh-sub-sec-title'>"
					,i18n.QM_INCOMPLETE," (",recordData.OUTCOMES_INCOMPLETE.length,")</span></h3>");

			renderResults.push("<div class='lh-sub-sec-content'>");

			if(recordData.OUTCOMES_INCOMPLETE.length>0)
			{
				var incompleteOutcomesLength = recordData.OUTCOMES_INCOMPLETE.length;
				for(var j=0;j<incompleteOutcomesLength;j++){
					//*Create new section for each outcome (ex:VTE Overlap Therapy)
					renderResults.push("<div class='lh-sub-sub-sec-content'>"); //*001 New class

						var tip = "Tip" + j;

						var hoverDisplay = "";
						var outcomeIncomplete = recordData.OUTCOMES_INCOMPLETE[j];
						hoverDisplay = outcomeIncomplete.HOVERDISPLAY;

							//Hover Div
							renderResults.push("<div id= ",tip," left='' top='' style='position:absolute; z-index:1000;background-color:#FFC;border:1px solid #000;padding:5px; visibility: hidden;'>"
							,hoverDisplay,"</div>");
                            
						//*Create Outcome header with toggle

						strAlarmClock = "";
						if (outcomeIncomplete.SHOWICONIND == '1')
						{
							strAlarmClock= "<span>&nbsp;&nbsp;&nbsp;<img class='lh-alarm'></img></span>";
						}

						renderResults.push("<h3 class='lh-sub-sec-hd-test'><span class='lh-sub-sec-hd-tgl' title=",i18n.HIDE_SECTION
							,">-</span><span class='lh-sub-sec-title' onmouseover='LhQualityMeasures.prototype.ShowHover(\"" + outcomeIncomplete.HOVERDISPLAY + "\"," + j + "," + 0 + "," + -15 + ");' onmouseout='LhQualityMeasures.prototype.HideHover(",j,");'>"
							,outcomeIncomplete.OUTCOME_NAME,"</span>",strAlarmClock,"</h3>");
						renderResults.push("<div class='lh-sub-sec-content'>");

							//Loop through each Measure
							var incompleteMeasuresLength = recordData.OUTCOMES_INCOMPLETE[j].MEASURES.length;
							for(var k=0;k<incompleteMeasuresLength;k++){
                                var incompleteMeasures = recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k];
								//Reset for each Measure
								firstTaskFound = 0;
                                
								//Create each Measures (ex:Warfarin)
								renderResults.push("<dl class='lh-qm-info'>");
								renderResults.push("<dt><span>measure</span></dt><dd class='lh-qm-ic-name'><span>"
								,incompleteMeasures.NAME,"</span></dd>");
								renderResults.push("</dl>");


								//Create each Measures Data (ex:Order Administer Reconcile)
								renderResults.push("<dl class='lh-qm-info'>");
								renderResults.push("<dt>");
								renderResults.push("<dd class='lh-qm-ic-name-grp'>"); //* New Class 001

								//If ORDERS is part of this Measure
								if (incompleteMeasures.ORDERSETIND == 1){

									if (incompleteMeasures.ORDERPRESENTIND == 1){
										renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayInOrder'>" //* New Class 001
										,incompleteMeasures.ORDERINCOMPLETEDISPLAY,"</span>");
									} else {
										if (outcomeIncomplete.DITHERMEASUREIND == 1 && incompleteMeasures.DITHERMEASUREIND == 1){
											renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.ORDERDISPLAY,"</span>");
										}
										else if (incompleteMeasures.ORDERTASKIND == 1){
											renderResults.push("<a id = 'openInOrder' onclick='LhQualityMeasures.OpenQMOrderWindow(" + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.ORDERDISPLAY,"</a>");
										}
										else if (incompleteMeasures.ORDERTASKIND == 2){
											renderResults.push("<a id = 'openInOrder' onclick='LhQualityMeasures.OpenQMOrderProfileWindow(" + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.ORDERDISPLAY,"</a>");
										}

									}
									firstTaskFound = 1;

								}

								//If COLLECT is part of this Measure
								if (incompleteMeasures.COLSETIND == 1){

									if (firstTaskFound == 1){
										renderResults.push(" | ");
									}
 
									if (incompleteMeasures.COLPRESENTIND == 1){
										renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayInCol'>" //* New Class 001
										,incompleteMeasures.COLINCOMPLETEDISPLAY,"</span>");
									} else {
										if (incompleteMeasures.COLTASKIND == 1){ //MOEW
											renderResults.push("<a id = 'openInPresOrder' onclick='LhQualityMeasures.OpenQMOrderWindow("+ recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.COLDISPLAY,"</a>");
										}
										else if (incompleteMeasures.COLTASKIND == 3){ // POWERFORM
											renderResults.push("<a id = 'openInColForm' onclick='LhQualityMeasures.OpenQMForm("+ recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + "," +incompleteMeasures.COLFORMID +")'>",recordData.COLDISPLAY,"</a>");
										}
										else if (incompleteMeasures.COLTASKIND == 4){ //IVIEW
											renderResults.push("<a id = 'openInDocView' onclick='LhQualityMeasures.OpenChartTab(\"" + incompleteMeasures.COLTABNAME + "\" ," + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.COLDISPLAY,"</a>");
										}
										else if (incompleteMeasures.COLTASKIND == 5){ //PowerNote
										    //support old powernote as well
											if (incompleteMeasures.COLTABNAME.indexOf("!") > 0){
											    renderResults.push("<a id = 'openInDocNote' onclick='LhQualityMeasures.OpenQMPowerNote(\"" + incompleteMeasures.COLTABNAME + "\"," + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.COLDISPLAY,"</a>");
											}
											else{
											    renderResults.push("<a id = 'openInDocNote' onclick='LhQualityMeasures.AddEPByCKI(\"" + incompleteMeasures.COLTABNAME + "\"," + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.COLDISPLAY,"</a>");
											}
										}
									}
									firstTaskFound = 1;
								}
								//If ADMINISTER is part of this Measure
								if (incompleteMeasures.ADMINSETIND == 1){

									if (firstTaskFound == 1){
										renderResults.push(" | ");
									}

									if (incompleteMeasures.ADMINPRESENTIND == 1){
										renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayInAdmin'>" //* New Class 001
										,incompleteMeasures.ADMININCOMPLETEDISPLAY,"</span>");
									} else{
										if (outcomeIncomplete.DITHERMEASUREIND == 1 && incompleteMeasures.DITHERMEASUREIND == 1){
											renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.ADMINDISPLAY,"</span>");
										}
										else if (incompleteMeasures.ADMINTASKIND == 2){ //MAR
											renderResults.push("<a id = 'openInAdminMAR' onclick='LhQualityMeasures.OpenChartTab(\"" + incompleteMeasures.ADMINTABNAME + "\" ," + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.ADMINDISPLAY,"</a>");
										}
										else if (incompleteMeasures.ADMINTASKIND == 3){ //PowerForm
											renderResults.push("<a id = 'openInAdminForm' onclick='LhQualityMeasures.OpenQMForm("+ recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + "," +incompleteMeasures.ADMINFORMID +")'>",recordData.ADMINDISPLAY,"</a>");
										}
										else if (incompleteMeasures.ADMINTASKIND == 4){ //IView
											renderResults.push("<a id = 'openInAdminView' onclick='LhQualityMeasures.OpenChartTab(\"" + incompleteMeasures.ADMINTABNAME + "\" ," + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.ADMINDISPLAY,"</a>");
										}

									}

									firstTaskFound = 1;
								}


								//If PRESCRIBE is part of this Measure
								if (incompleteMeasures.PRESSETIND == 1){
									if (firstTaskFound == 1){
										renderResults.push(" | ");
									}

									if (incompleteMeasures.PRESPRESENTIND == 1){
										renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayInPres'>" //* New Class 001
										,incompleteMeasures.PRESINCOMPLETEDISPLAY,"</span>");
									} else{
										if (outcomeIncomplete.DITHERACEIPRESIND == 1 && incompleteMeasures.DITHERPRESAMIIND == 1){
											renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.PRESDISPLAY,"</span>");
										}
										else if (outcomeIncomplete.DITHERARBPRESIND == 1 && incompleteMeasures.DITHERPRESAMIIND == 1){
											renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.PRESDISPLAY,"</span>");
										}
										else if (outcomeIncomplete.DITHERMEASUREIND == 1 && incompleteMeasures.DITHERMEASUREIND == 1){
											renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.PRESDISPLAY,"</span>");
										}
										else if (incompleteMeasures.PRESTASKIND == 1){ //MOEW
											renderResults.push("<a id = 'openInPresOrder' onclick='LhQualityMeasures.OpenQMOrderWindow("+ recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.PRESDISPLAY,"</a>");
										}
										else if (incompleteMeasures.PRESTASKIND == 6){ //MedsRec
											renderResults.push("<a id = 'openInPresRec' onclick='LhQualityMeasures.OpenQMMedsRec("+ recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.PRESDISPLAY,"</a>");
										}
									}

									firstTaskFound = 1;
								}


								//If DOCUMENT is part of this Measure
								if (incompleteMeasures.DOCSETIND == 1){

									if (firstTaskFound == 1){
										renderResults.push(" | ");
									}
									if (incompleteMeasures.DOCPRESENTIND == 1){

										if (outcomeIncomplete.DITHERDOCIND == 1 && incompleteMeasures.DELAYDITHERIND == 1){
											renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.DOCDISPLAY,"</span>");
										}
										else if (outcomeIncomplete.DITHERDOCIND == 1 && incompleteMeasures.VANCOPRESIND == 1){
											renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.DOCDISPLAY,"</span>");
										//PCI Delay = 2
										}
										else if (outcomeIncomplete.DITHERDOCIND == 2 && incompleteMeasures.DELAYDITHERIND == 2){
											renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.DOCDISPLAY,"</span>");
										}
										else {
											renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>" //* New Class 001
											,incompleteMeasures.DOCINCOMPLETEDISPLAY,"</span>");
										}
									} else{

										if (outcomeIncomplete.DITHERMEASUREIND == 1 && incompleteMeasures.DITHERMEASUREIND == 1){
											renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.DOCDISPLAY,"</span>");
										} //VTE Oral Factor Xa
										else if (outcomeIncomplete.DITHERDOCIND == 3 && incompleteMeasures.ORALFACTORDITHER == 1){
											renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.DOCDISPLAY,"</span>");
										}
										else if (outcomeIncomplete.ADMINMETIND == 1 && incompleteMeasures.CONTRAIND == 1){
											renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.DOCDISPLAY,"</span>");
										}
										else if (outcomeIncomplete.PRESMETIND == 1 && incompleteMeasures.CONTRAIND == 1){
											renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.DOCDISPLAY,"</span>");
										}
										else if (outcomeIncomplete.DITHERDOCIND == 1 && incompleteMeasures.DELAYDITHERIND == 1){
											renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.DOCDISPLAY,"</span>");
										}
										else if (outcomeIncomplete.DITHERDOCIND == 1 && incompleteMeasures.VANCOPRESIND == 1){
											renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.DOCDISPLAY,"</span>");
										}

										else if (incompleteMeasures.DOCTASKIND == 1){ //MOEW
											renderResults.push("<a id = 'openInDocOrder' onclick='LhQualityMeasures.OpenQMOrderWindow(" + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.DOCDISPLAY,"</a>");
										}
										else if (incompleteMeasures.DOCTASKIND == 3){ //PowerForm

											renderResults.push("<a id = 'openInDocForm' onclick='LhQualityMeasures.OpenQMForm(" + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + "," + incompleteMeasures.DOCFORMID +")'>",recordData.DOCDISPLAY,"</a>");
										}
										else if (incompleteMeasures.DOCTASKIND == 4){ //IVIEW
											renderResults.push("<a id = 'openInDocView' onclick='LhQualityMeasures.OpenChartTab(\"" + incompleteMeasures.DOCTABNAME + "\" ," + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.DOCDISPLAY,"</a>");
										}
										else if (incompleteMeasures.DOCTASKIND == 5){ //PowerNote
												//support old powernote as well
												if (incompleteMeasures.DOCTABNAME.indexOf("!") > 0)
													{renderResults.push("<a id = 'openInDocNote' onclick='LhQualityMeasures.OpenQMPowerNote(\"" + incompleteMeasures.DOCTABNAME + "\"," + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.DOCDISPLAY,"</a>");}
												else
													{renderResults.push("<a id = 'openInDocNote' onclick='LhQualityMeasures.AddEPByCKI(\"" + incompleteMeasures.DOCTABNAME + "\"," + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.DOCDISPLAY,"</a>");}
											
										}

									}

									firstTaskFound = 1;
								}

								renderResults.push("</dd>");
								renderResults.push("</dt>");
								renderResults.push("</dl>");

							} //for(var k=0;k<outcomeIncomplete.MEASURES.length;k++){ , Loop through each measure


						renderResults.push("</div>");//ar.push("<div class='lh-sub-sec-content'>");

						//*Close DIV for Outcome
						renderResults.push("</div>"); //ar.push("<div class='lh-sub-sub-sec-content'>"); //*001 New class

						//*Shows docuemnt icon on mouseover* ar.push("<dl class='lh-qm-info' onmouseover='CERN_QUALITY_MEASURES_O1.ShowIcon(this)' onmouseout='CERN_QUALITY_MEASURES_O1.HideIcon(this)'>");
						//*Prints outcome name* ar.push("<dt><span>measure</span></dt><dd class='lh-qm-ic-name'><span>"+outcomeIncomplete.OUTCOME_NAME+"</span></dd>");
						//*Lauches specific Powerform for outcome* ar.push("<dt><span>measure</span></dt><dd class='qm-doc'><span class='cmp-doc' onclick='CERN_QUALITY_MEASURES_O1.OpenQMDoc("+outcomeIncomplete.FORM_REF_ID+","+outcomeIncomplete.FORM_ACT_ID+")'>&nbsp;</span></dd>");
						//*Close dl* ar.push("</dl>");

					} //for(var j=0;j<recordData.OUTCOMES_INCOMPLETE.length;j++){ , Loop through each outcome


				}else{ //(recordData.OUTCOMES_INCOMPLETE.length>0)
					renderResults.push("<span class='lh-res-none'>",i18n.NO_RESULTS_FOUND,"</span>");
				}

			renderResults.push("</div>"); //renderResults.push("<div class='lh-sub-sec-content'>");
		renderResults.push("</div>");	//renderResults.push("<div class='lh-sub-sec'>");, Incomplete Section

		//Complete Section
		renderResults.push("<div id='comp" + compId + "' class='lh-sub-sec'>");

			renderResults.push("<h3 class='lh-sub-sec-hd'><span class = 'lh-sub-sec-hd-tgl' title="+i18n.HIDE_SECTION+"></span><span class='lh-sub-sec-title'>"
				+i18n.QM_COMPLETE+" (",recordData.OUTCOMES_COMPLETE.length,")</span></h3>");

				renderResults.push("<div class='lh-sub-sec-content'>");

				if(recordData.OUTCOMES_COMPLETE.length>0){

					var completeOutcomeLength = recordData.OUTCOMES_COMPLETE.length;
					for(var j=0;j<completeOutcomeLength;j++){

						//*Create new section for each outcome (ex:VTE Overlap Therapy)
						renderResults.push("<div class='lh-sub-sub-sec-content'>"); //*001 New class

						var tip2 = "TipA" + j;
						var outcomeComplete = recordData.OUTCOMES_COMPLETE[j];
						var hover2Display = "";
						hover2Display = outcomeComplete.HOVERDISPLAY;

						//Hover Div
						renderResults.push("<div id= ",tip2," left='' top='' style='position:absolute; z-index:1000;background-color:#FFC;border:1px solid #000; visibility:hidden;'>"
							,hover2Display,"</div>");

						strAlarmClock = "";
						if (outcomeComplete.SHOWICONIND == '1')
						{
							strAlarmClock = "<span>&nbsp;&nbsp;&nbsp;"+"<img class='lh-alarm'></img>"+"</span>";
						}

						//*Create Outcome header with toggle
						renderResults.push("<h3 class='lh-sub-sec-hd-test'><span class='lh-sub-sec-hd-tgl' title=",i18n.HIDE_SECTION
						,">-</span><span class='lh-sub-sec-title' onmouseover='LhQualityMeasures.prototype.ShowHover(\"" + outcomeComplete.HOVERDISPLAY + "\"," + j + "," + 0 + "," + -15 + ",\"TipA\");' onmouseout='LhQualityMeasures.prototype.HideHover("+ j + ",\"TipA\");'>"
						,outcomeComplete.OUTCOME_NAME,"</span>",strAlarmClock,"</h3>");

						renderResults.push("<div class='lh-sub-sec-content'>");

						//Loop through each Measure
						var completeMeasuresLength = outcomeComplete.MEASURES.length;
						for(var k=0;k<completeMeasuresLength;k++){
							var completeMeasure = outcomeComplete.MEASURES[k];
							//Reset for each Measure
							firstTaskFound = 0;

							//Create each Measures (ex:Warfarin)
							renderResults.push("<dl class='lh-qm-info'>");
							renderResults.push("<dt><span>measure</span></dt><dd class='lh-qm-ic-name'><span>"
								,completeMeasure.NAME,"</span></dd>");
							renderResults.push("</dl>");


							//Create each Measures Data (ex:Order Administer Reconcile)
							renderResults.push("<dl class='lh-qm-info'>");
							renderResults.push("<dt>");
							renderResults.push("<dd class='lh-qm-ic-name-grp'>"); //* New Class 001

							//If ORDERS is part of this Measure
							if (completeMeasure.ORDERSETIND == 1){

								if (completeMeasure.ORDERPRESENTIND == 1){
									renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayOrder'>" //* New Class 001
									,completeMeasure.ORDERCOMPLETEDISPLAY,"</span>");
								} else{
									renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayOrder'>",recordData.ORDERDISPLAY,"</span>");
								}

								firstTaskFound = 1;
							}

							//If Collect is part of this Measure
							if (completeMeasure.COLSETIND == 1){

								if (firstTaskFound == 1){
									renderResults.push(" | ");
								}

								if (completeMeasure.COLPRESENTIND == 1){
									renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayCol'>" //* New Class 001
									,completeMeasure.COLCOMPLETEDISPLAY,"</span>");
								} else{
									renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayCol'>",recordData.COLDISPLAY,"</span>");
								}

								firstTaskFound = 1;
							}

							//If ADMINISTER is part of this Measure
							if (completeMeasure.ADMINSETIND == 1){
								if (firstTaskFound == 1){
									renderResults.push(" | ");
								}
								if (completeMeasure.ADMINPRESENTIND == 1){
									renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayAdmin'>" //* New Class 001
									,completeMeasure.ADMINCOMPLETEDISPLAY,"</span>");
								} else {
									renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayAdmin'>",recordData.ADMINDISPLAY,"</span>");
								}

								firstTaskFound = 1;
							}

							//If PRESCRIBE is part of this Measure
							if (completeMeasure.PRESSETIND == 1){
								if (firstTaskFound == 1){
									renderResults.push(" | ");
								}
								if (completeMeasure.PRESPRESENTIND == 1){
									renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayPres'>" //* New Class 001
									,completeMeasure.PRESCOMPLETEDISPLAY,"</span>");
								} else{
									renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayPres'>",recordData.PRESDISPLAY,"</span>");
								}

								firstTaskFound = 1;
							}

							//If DOCUMENT is part of this Measure
							if (completeMeasure.DOCSETIND == 1){
								if (firstTaskFound == 1){
									renderResults.push(" | ");
								}
								if (completeMeasure.DOCPRESENTIND == 1){

									if (outcomeComplete.DITHERDOCIND == 1 && completeMeasure.DELAYDITHERIND == 1){
										renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayDoc'>" //* New Class 001
										,recordData.DOCDISPLAY,"</span>");
									}
									else if (outcomeComplete.DITHERDOCIND == 2 && completeMeasure.DELAYDITHERIND == 2){
										renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayDoc'>" //* New Class 001
										,recordData.DOCDISPLAY,"</span>");
									}
									else if (outcomeComplete.DITHERDOCIND == 1 && completeMeasure.VANCOPRESIND == 1) {
										renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayDoc'>" //* New Class 001
										,recordData.DOCDISPLAY,"</span>");
									}

									else{

										renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayDoc'>" //* New Class 001
										,completeMeasure.DOCCOMPLETEDISPLAY,"</span>");
									}

								} else{
									renderResults.push("<span class = 'lh-qm-ic-name-display' id = 'displayDoc'>",recordData.DOCDISPLAY,"</span>");
								}

								firstTaskFound = 1;
							}

							renderResults.push("</dd>");
							renderResults.push("</dt>");
							renderResults.push("</dl>");
						}

						renderResults.push("</div>"); 
						//*Close DIV for Outcome
						renderResults.push("</div>"); 
					}
				}else{
					if(recordData.OUTCOMES_COMPLETE.length===0){
						renderResults.push("<span class='lh-res-none'>",i18n.NO_RESULTS_FOUND,"</span>");
					}
				}
				renderResults.push("</div>");
         		renderResults.push("</div>");
         		renderResults.push("</div>");
         		renderResults.push("</div>");
		}catch(err){
			logger.logJSError(err,this, "LhQualityMeasures.js","renderComponent");
		}

    this.finalizeComponent(renderResults.join(""), MP_Util.CreateTitleText(this, totalOutcomes));
	
    var lastChild = comp.getRootComponentNode().lastChild;
	var dropDown = document.getElementById("qmTask"+compId);
	var condition = cookieContent.data[index].selectedCond;
	// Set default selected condition to "All" if the cookie has not been set and dropdown has more than 1 option
	if (condition == "" && dropDown.options.length > 1) condition = "All"; 
	
	for(var i=0; i<dropDown.options.length; i++) {
		if(dropDown.options[i].text == condition){
			dropDown.selectedIndex = i;			 
		}
	}
	
	//Init subsection toggles
	//NOTE this will not work outside of Cerner's architecture
	MP_Util.Doc.InitSubToggles(lastChild, 'lh-sub-sec-hd-tgl');
  
	// Complete Section Toggle based on bedrock indicator
	var completeSectionToggle = document.getElementById("comp" + compId).childNodes[0].firstChild;
		
	completeSectionToggle.onclick = function (e) {
	    cookieContent.data[index].expcollInd = this.title;
	    LhQualityMeasures.prototype.setCookie('LhQualityMeasures',cookieContent);
	};
	
	var expcoll_ind = cookieContent.data[index].expcollInd;
	if(expcoll_ind == ""){
		var conditions = [];
		for(var j=0 ; j < recordData.CONDITIONS.length ; j++){
			if(JSON.stringify(recordData.CONDITIONS[j].COLLAPSE_IND) == 1)
			{
				conditions.push(recordData.CONDITIONS[j].CONDITION_NAME);
			}
		}
		
		if(recordData.CONDITIONS.length==1 && conditions.length==1){
		    condition = recordData.CONDITIONS.CONDITION_NAME;
			completeSectionToggle.click();
		}else{
			for(var m=0 ; m < conditions.length ; m++)
			{
			    if (condition == conditions[m]) {
					completeSectionToggle.click();	
				}
			}
		}
	}
	else{
	    if (expcoll_ind === 'Expand') {
			completeSectionToggle.click();	
		}
	}
	
	var self = this;
	dropDown.onchange = function (e) {
	    var index = self.getCookieIndex();
	    var cookieContent = JSON.parse(self.getCookie('LhQualityMeasures'));
	    cookieContent.data[index].selectedIndex = this.value;
	    cookieContent.data[index].selectedCond = this.options[this.selectedIndex].text;
	    cookieContent.data[index].expcollInd = '';
	    LhQualityMeasures.prototype.setCookie('LhQualityMeasures', cookieContent);
		comp.retrieveComponentData();
	};
};

/**
  * This function creates a cookie and sets a value to it
  * @param {cName} 
  *         cName - cookie Name
  */
LhQualityMeasures.prototype.getCookie = function(cName) {
	var trimString = function(str) {
	    return str.replace(/^\s+|\s+$/g,''); 
	};
	
	var name = cName + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
        var c = trimString(ca[i]);
		if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	}
	return "";
};

/**
  * This function shows the hover over the measures. Global function which is added to the prototype
  * @param {strHoverText, idValue, xOffSet, yOffSet, idStr}
**/
LhQualityMeasures.prototype.ShowHover = function(strHoverText, idValue, xOffSet, yOffSet, idStr){

	idStr = idStr || "Tip";
	
	var x = "";
	var y = "";
	var tmpID = idStr + idValue;
	var tDIV = document.getElementById(tmpID);
	
	tDIV.style.left = '';
	tDIV.style.top = '';

	x = tDIV.offsetLeft;
	tDIV.setAttribute('left',x);
	y = tDIV.offsetTop;
	tDIV.setAttribute('top',y);

	x = parseInt(x) - parseInt(xOffSet);
	y = parseInt(y) - parseInt(yOffSet);

	tDIV.style.left = x;
	tDIV.style.top = y;

	tDIV.style.width = "250px";
	tDIV.style.visibility = "visible";
};

/**
  * This function Hides the hover the measures.
  * @param {valueHide,idHide}
**/
LhQualityMeasures.prototype.HideHover = function(valueHide,idHide){
	
	idHide = idHide || "Tip";
	var tmpId = idHide + valueHide;
	var tDIV = document.getElementById(tmpId);
	tDIV.style.visibility = "hidden";
};

LhQualityMeasures.OpenQMOrderWindow = function(qmPersonId, qmEncntrId){

	var orderWindowString = qmPersonId + "|" + qmEncntrId + "|";
	orderWindowString += "{ORDER|0|0|0|0|0}";
	orderWindowString += "|24|{2|127}{3|127}|8";
	MP_Util.LogMpagesEventInfo(null,"ORDERS",orderWindowString,"LhQualityMeasures.js","OpenQMOrderWindow");
	MPAGES_EVENT("Orders",orderWindowString);
};

LhQualityMeasures.OpenQMOrderProfileWindow = function(qmPersonId, qmEncntrId){

	var mrObject = {};
	mrObject = CERN_Platform.getDiscernObject("ORDERS");
	if(mrObject != null)
	{
	    mrObject.PersonId = qmPersonId;
 	    mrObject.EncntrId = qmEncntrId;
 	    mrObject.reconciliationMode = 0;
	    MP_Util.LogMpagesEventInfo(null,"ORDERS","OpenQMMedsRec","LhQualityMeasures.js","OpenQMMedsRec");
	    mrObject.LaunchOrdersMode(0, 0, 0); //2 - Meds Rec
    }
};

LhQualityMeasures.OpenQMForm = function(qmPersonId, qmEncntrId, formId){
	
	var dPersonId = qmPersonId;
	var dEncounterId = qmEncntrId;
	var activityId = 0.0;
	var chartMode = 0;
	var mpObj = CERN_Platform.getDiscernObject("POWERFORM");
	if(mpObj != null)
	{
	    mpObj.OpenForm(dPersonId, dEncounterId, formId, activityId, chartMode);
    }		
};

LhQualityMeasures.OpenChartTab = function(tabName, qmPersonId, qmEncntrId){
	APPLINK(0,'$APP_AppName$','/PERSONID=' + qmPersonId + ' /ENCNTRID=' + qmEncntrId + ' /FIRSTTAB=^' + tabName + '^');
};

LhQualityMeasures.OpenQMPowerNote = function(noteName, qmPersonId, qmEncntrId){

	var personId = qmPersonId;
	var encounterId = qmencntrId;
	var noteset = "";
	noteset = personId + "|" + encounterId + "|"+noteName+"|0";
	var noteXmlStr = MPAGES_EVENT("POWERNOTE", noteset);
};

LhQualityMeasures.AddEPByCKI = function(noteName,qmPersonId, qmEncntrId){

	var mdPersonId = qmPersonId;
    var mdEncounterId = qmEncntrId;
	var mbStrEPCKISource = "";
	var mbStrEPCKIIdentifier = "";
	if (noteName.indexOf("---") >0) {
		mbStrEPCKISource = noteName.split("---")[0];
		mbStrEPCKIIdentifier = noteName.split("---")[1];;
	}
	else {
		mbStrEPCKISource = "CKI";
		mbStrEPCKIIdentifier = noteName;
	}

	var PowerNoteMPageUtils = CERN_Platform.getDiscernObject("POWERNOTE");
	if(PowerNoteMPageUtils != null)
	{
	    PowerNoteMPageUtils.BeginNoteFromEncounterPathway(mdPersonId, mdEncounterId, mbStrEPCKISource, mbStrEPCKIIdentifier);
	}
};

LhQualityMeasures.OpenQMMedsRec = function(qmPersonId, qmEncntrId){
	var mrObject = {};
	var code = MP_Util.GetCodeValueByMeaning("DISCHARGEMED", 54732);
	mrObject = CERN_Platform.getDiscernObject("ORDERS"); 
	if(mrObject != null)
	{
	    mrObject.PersonId = qmPersonId; 
	    mrObject.EncntrId = qmEncntrId; 
	    mrObject.reconciliationMode = 3;
	    mrObject.defaultVenue = (code) ? code.codeValue : 0;
	    MP_Util.LogMpagesEventInfo(null,"ORDERS","OpenQMMedsRec","LhQualityMeasures.js","OpenQMMedsRec");
	    mrObject.LaunchOrdersMode(2, 0, 0); //2 - Meds Rec
	}
};
/**
  * This function gets the index of the 
  * Encounter (that is opened in the component) from the cookie
**/
LhQualityMeasures.prototype.getCookieIndex = function () {
    var cookieHolder = this.getCookie('LhQualityMeasures');
    var component = this;
	var criterion = component.getCriterion();
    var encntrData = {
            ID: criterion.encntr_id,
            selectedIndex: '',
            selectedCond: '',
            expcollInd: ''
    };
    var data = {
        frameWork: "",
        data: [encntrData]
    };
    if (cookieHolder === '') {       
        LhQualityMeasures.prototype.setCookie('LhQualityMeasures', data);
        return 0; 
    }
    else {
        var obj = JSON.parse(cookieHolder);
        for (var i = 0; i < obj.data.length; i++) {
            if (obj.data[i].ID == criterion.encntr_id) {
                return i;
            }
        }
        obj.data.push(encntrData);
        LhQualityMeasures.prototype.setCookie('LhQualityMeasures',obj)
        return (obj.data.length-1);           
    }
};

/**
  * This function sets the cookie and assigns a value to it
      * @params: {cookieName, data}
      *           cookieName - Name of the cookie
      *           data - Value of the cookie
**/
LhQualityMeasures.prototype.setCookie = function (cookieName, data) {
    if (data && cookieName) {   
        document.cookie = cookieName+ '=' + JSON.stringify(data);
    }
};

MP_Util.setObjectDefinitionMapping("SM_QM", LhQualityMeasures);