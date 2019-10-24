function PatientBackgroundComponentStyle(){
	this.initByNamespace("pbg");
}
PatientBackgroundComponentStyle.inherits(ComponentStyle);


/**
 * The Background component will retrieve background information of the patient.  
 * 
 * Bedrock Specific Information:
 * Because of the complexity of the component and integration with bedrock, the loading of specific filter means into a component is handled
 * through the usage of function-to-filter mappings.  These filter mappings allow for retrieved filters to be defined/set into specific 
 * parameters within the individual component.
 * 
 * For example, the function-to-filter mapping for the nursing communication MPage is as follows:
 * {"FUNCTIONS": [
 * {"FILTER_MEAN": "NC_PAIN_SCR","NAME": "setPainScores","TYPE": "Array","FIELD": "PARENT_ENTITY_ID"}, 
 * {"FILTER_MEAN": "NC_ASSIST_DEV","NAME": "setDevices","TYPE": "Array","FIELD": "PARENT_ENTITY_ID"}, 
 * {"FILTER_MEAN": "NC_DIET_ORD","NAME": "setDietOrders","TYPE": "Array","FIELD": "PARENT_ENTITY_ID"}, 
 * {"FILTER_MEAN": "NC_PT_ACT_ORD","NAME": "setPatientActivityOrders","TYPE": "Array","FIELD": "PARENT_ENTITY_ID"}, 
 * {"FILTER_MEAN": "NC_RESUS_ORD","NAME": "setResucitationOrders","TYPE": "Array","FIELD": "PARENT_ENTITY_ID"}, 
 * {"FILTER_MEAN": "NC_SEIZURE_ORD","NAME": "setSeizureOrders","TYPE": "Array","FIELD": "PARENT_ENTITY_ID"}, 
 * {"FILTER_MEAN": "NC_ISOLATION_ORD","NAME": "setIsolationOrders","TYPE": "Array","FIELD": "PARENT_ENTITY_ID"}, 
 * {"FILTER_MEAN": "NC_ADV_DIR","NAME": "setAdvancedDirectives","TYPE": "Array","FIELD": "PARENT_ENTITY_ID"}, 
 * {"FILTER_MEAN": "NC_PARA","NAME": "setParas","TYPE": "Array","FIELD": "PARENT_ENTITY_ID"}, 
 * {"FILTER_MEAN": "NC_GRAVIDA","NAME": "setGravidas","TYPE": "Array","FIELD": "PARENT_ENTITY_ID"}, 
 * {"FILTER_MEAN": "NC_FALL_PRECAUTIONS","NAME": "setFallPrecautions","TYPE": "Array","FIELD": "PARENT_ENTITY_ID"}
 * ]}
 * 
 * @param {Criterion} criterion
 */
function PatientBackgroundComponent(criterion){
	this.setCriterion(criterion);
	this.setStyles(new PatientBackgroundComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.PATBACKGROUND.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.PATBACKGROUND.O1 - render component");
	this.setIncludeLineNumber(false);
	this.setScope(2);

	this.m_pain = [];
	this.m_devices = [];
	this.m_diet = [];
	this.m_patAct = [];
	this.m_resuc = [];
	this.m_seizure = [];
	this.m_isolation = [];
	this.m_advDirectives = [];
	this.m_careLevel = [];
	this.m_para = [];
	this.m_gravida = [];
	this.m_fallPrec = [];
	
	PatientBackgroundComponent.method("InsertData", function(){
		CERN_PATBACKGROUND_O1.GetBackgroundTable(this);
	});
	PatientBackgroundComponent.method("HandleSuccess", function(recordData){
		CERN_PATBACKGROUND_O1.RenderComponent(this, recordData);
	});

	
	PatientBackgroundComponent.method("getPainScores", function() {return (this.m_pain);});
	PatientBackgroundComponent.method("setPainScores", function(value) {this.m_pain = value;});
	PatientBackgroundComponent.method("addPainScore", function(value) {
		if (this.m_pain == null){
			this.m_pain = [];
		}
		this.m_pain.push(value);
	});
	
	PatientBackgroundComponent.method("getDevices", function(){return (this.m_devices);});
	PatientBackgroundComponent.method("setDevices", function(value){this.m_devices = value;});
	PatientBackgroundComponent.method("addDevice", function(value) {
		if (this.m_devices == null){
			this.m_devices = [];
		}
		this.m_devices.push(value);
	});
	
	PatientBackgroundComponent.method("getDietOrders", function(){return (this.m_diet);});
	PatientBackgroundComponent.method("setDietOrders", function(value){this.m_diet = value;});
	PatientBackgroundComponent.method("addDietOrder", function(value) {
		if (this.m_diet == null){
			this.m_diet = [];
		}
		this.m_diet.push(value);
	});
	
	PatientBackgroundComponent.method("getPatientActivityOrders", function(){return (this.m_patAct);});
	PatientBackgroundComponent.method("setPatientActivityOrders", function(value){this.m_patAct = value;});
	PatientBackgroundComponent.method("addPatientActivityOrder", function(value) {
		if (this.m_patAct == null){
			this.m_patAct = [];
		}
		this.m_patAct.push(value);
	});
	
	PatientBackgroundComponent.method("getResucitationOrders", function(){return (this.m_resuc);});
	PatientBackgroundComponent.method("setResucitationOrders", function(value){this.m_resuc = value;});
	PatientBackgroundComponent.method("addResucitationOrder", function(value) {
		if (this.m_resuc == null){
			this.m_resuc = [];
		}
		this.m_resuc.push(value);
	});
	
	PatientBackgroundComponent.method("getSeizureOrders", function(){return (this.m_seizure);});
	PatientBackgroundComponent.method("setSeizureOrders", function(value){this.m_seizure = value;});
	PatientBackgroundComponent.method("addSeizureOrder", function(value) {
		if (this.m_seizure == null){
			this.m_seizure = [];
		}
		this.m_seizure.push(value);
	});
	
	PatientBackgroundComponent.method("getIsolationOrders", function(){return (this.m_isolation);});
	PatientBackgroundComponent.method("setIsolationOrders", function(value){this.m_isolation = value;});
	PatientBackgroundComponent.method("addIsolationOrder", function(value) {
		if (this.m_isolation == null){
			this.m_isolation = [];
		}
		this.m_isolation.push(value);
	});
	
	PatientBackgroundComponent.method("getAdvancedDirectives", function(){return (this.m_advDirectives);});
	PatientBackgroundComponent.method("setAdvancedDirectives", function(value){this.m_advDirectives = value;});
	PatientBackgroundComponent.method("addAdvancedDirective", function(value) {
		if (this.m_advDirectives == null){
			this.m_advDirectives = [];
		}
		this.m_advDirectives.push(value);
	});
	
	PatientBackgroundComponent.method("getParas", function(){return (this.m_para);});
	PatientBackgroundComponent.method("setParas", function(value){this.m_para = value;});
	PatientBackgroundComponent.method("addPara", function(value) {
		if (this.m_para == null){
			this.m_para = [];
		}
		this.m_para.push(value);
	});
	
	PatientBackgroundComponent.method("getGravidas", function(){return (this.m_gravida);});
	PatientBackgroundComponent.method("setGravidas", function(value){this.m_gravida = value;});
	PatientBackgroundComponent.method("addGravida", function(value) {
		if (this.m_gravida == null){
			this.m_gravida = [];
		}
		this.m_gravida.push(value);
	});
	
	PatientBackgroundComponent.method("getFallPrecautions", function(){return (this.m_fallPrec);});
	PatientBackgroundComponent.method("setFallPrecautions", function(value){this.m_fallPrec = value;});
	PatientBackgroundComponent.method("addFallPrecaution", function(value) {
		if (this.m_fallPrec == null){
			this.m_fallPrec = [];
		}
		this.m_fallPrec.push(value);
	});
}
PatientBackgroundComponent.inherits(MPageComponent);

 /**
  * Background methods
  * @namespace CERN_PATBACKGROUND_O1
  * @static
  * @global
  * @dependencies Script: mp_get_pat_bkgrnd
  */
var CERN_PATBACKGROUND_O1 = function(){
	var m_df = null;
	return {
        GetBackgroundTable: function(component){
            var painCds = MP_Util.CreateParamArray(component.getPainScores(), 1);
            var astDevCds = MP_Util.CreateParamArray(component.getDevices(), 1);
            var dietCds = MP_Util.CreateParamArray(component.getDietOrders(), 1);
            var patActCds = MP_Util.CreateParamArray(component.getPatientActivityOrders(), 1);
            var resusCds = MP_Util.CreateParamArray(component.getResucitationOrders(), 1);
            var seizCds = MP_Util.CreateParamArray(component.getSeizureOrders(), 1);
            var isltnCds = MP_Util.CreateParamArray(component.getIsolationOrders(), 1);
            var advDirCds = MP_Util.CreateParamArray(component.getAdvancedDirectives(), 1);
            var paraCd = MP_Util.CreateParamArray(component.getParas(), 1);
            var gravidaCd = MP_Util.CreateParamArray(component.getGravidas(), 1);
            var flRskScoreCd = MP_Util.CreateParamArray(component.getFallPrecautions(), 1);
			var otherEventCd = 0.0;
			var groups = component.getGroups();
			var group = null;
			for(var i = 0, il = groups.length; i < il; i++){
				group = groups[i];
				if(group.getGroupName().toUpperCase() == "NC_CLIN_EVENT"){
					otherEventCd = MP_Util.CreateParamArray(group.getEventCodes(), 1);
				}
			}
            var criterion = component.getCriterion();
            
            var sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0"
			, criterion.provider_id + ".0", criterion.ppr_cd + ".0"
			,painCds,astDevCds,dietCds,patActCds,resusCds,seizCds,isltnCds,advDirCds
			,paraCd,gravidaCd,flRskScoreCd, otherEventCd ];
            MP_Core.XMLCclRequestWrapper(component, "mp_get_pat_bkgrnd", sendAr, true);
        },
        RenderComponent: function(component, recordData){
			var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
			try{
				var jsBgHTML = [];
				var bgHTML = "";
				var countText = "";
				var subCnt = 0;
				var asstDev = recordData.ASSITIVE_DEVICES;
				var patBkgrndI18n = i18n.discernabu.patient_background_o1;
				var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
				var criterion = component.getCriterion();
				/*
				Do not display if no data, except for Advanced Directive, Isolation, Activity Order, Diet, Pain Score, Code Status. 
				* Target Discharge Date, Then display, "No Data" 
				*/
				
				
				//jsBgHTML.push("<div>");
				
				if (recordData.ATTENDING_PHYSICIAN!=""){
					jsBgHTML.push(buildBkgrndHtml(patBkgrndI18n.ATTENDING_PHYSICIAN, recordData.ATTENDING_PHYSICIAN, recordData.ATT_PHYS_DT_TM));
					subCnt = subCnt + 1;
				}
				
				if (recordData.SERVICE!=""){
					jsBgHTML.push(buildBkgrndHtml(patBkgrndI18n.SERVICE, recordData.SERVICE, recordData.SERVICE_DT_TM));
					subCnt = subCnt + 1;
				}
				
				if (recordData.RESUSITATION_STATUS!=""){
					jsBgHTML.push(buildBkgrndHtml(patBkgrndI18n.RESUSITATION_STATUS, recordData.RESUSITATION_STATUS, recordData.RESUS_STATUS_DT_TM));
					subCnt = subCnt + 1;
				}
				else if(component.getResucitationOrders().length > 0){
					jsBgHTML.push(buildBkgrndHtml(patBkgrndI18n.RESUSITATION_STATUS, patBkgrndI18n.NO_RESULTS_FOUND, ""));
					subCnt = subCnt + 1;
				}
				
				if (recordData.ADVANCE_DIRECTIVE!=""){
					var advDirStatus = MP_Util.GetValueFromArray(recordData.ADV_DIR_STATUS_CD, codeArray);
					var adVal = EventDisplay(recordData.ADVANCE_DIRECTIVE, recordData.ADV_DIR_DATE_IND);
					var advDirRes = GetEventViewerLink(criterion, advDirStatus,adVal, recordData.ADV_DIR_EVENT_ID );
					jsBgHTML.push(buildBkgrndHtml(patBkgrndI18n.ADVANCE_DIRECTIVE, advDirRes, recordData.ADV_DIR_DT_TM));
					subCnt = subCnt + 1;
				}
				else if(component.getAdvancedDirectives().length > 0){
					jsBgHTML.push(buildBkgrndHtml(patBkgrndI18n.ADVANCE_DIRECTIVE, patBkgrndI18n.NO_RESULTS_FOUND, ""));
					subCnt = subCnt + 1;
				}
				
				if (recordData.ISOLATION!=""){
					jsBgHTML.push(buildBkgrndHtml(patBkgrndI18n.ISOLATION, recordData.ISOLATION, recordData.ISOL_DT_TM));
					subCnt = subCnt + 1;
				}
				else if(component.getIsolationOrders().length > 0){
					jsBgHTML.push(buildBkgrndHtml(patBkgrndI18n.ISOLATION, patBkgrndI18n.NO_RESULTS_FOUND, ""));
					subCnt = subCnt + 1;
				}
				
				if (recordData.TARGET_DISCH_DT_TM!=""){
					jsBgHTML.push(buildBkgrndHtml(patBkgrndI18n.TARGET_DISCH_DT_TM, "", recordData.TARGET_DISCH_DT_TM));
					subCnt = subCnt + 1;
				}
				
				if (recordData.ACTIVITY_ORDER!=""){
					jsBgHTML.push(buildBkgrndHtml(recordData.ACTIVITY_ORDER, recordData.ACTIVITY_ORDER_DISP, recordData.ACT_ORD_DT_TM));
					subCnt = subCnt + 1;
				}
				else if(component.getPatientActivityOrders().length > 0){
					jsBgHTML.push(buildBkgrndHtml(patBkgrndI18n.ACTIVITY_ORDER, patBkgrndI18n.NO_RESULTS_FOUND, ""));
					subCnt = subCnt + 1;
				}
				
				if (recordData.PARENT_PART_TYPE!=""){
					jsBgHTML.push(buildBkgrndHtml(patBkgrndI18n.PARENT_PART_TYPE, recordData.PARENT_PART_TYPE));
					subCnt = subCnt + 1;
				}
				
				if (recordData.GESTATIONAL_AGE!=""){
					var totalGesDays = recordData.GESTATIONAL_AGE;
					var egaWeeks = Math.floor(totalGesDays / 7);
					var egaDays = totalGesDays % 7;
					var egaString = egaWeeks + " " + i18n.discernabu.patient_background_o1.WEEKS + ", " + egaDays + " " + i18n.discernabu.patient_background_o1.DAYS;
					jsBgHTML.push(buildBkgrndHtml(patBkgrndI18n.GESTATIONAL_AGE, egaString, recordData.GEST_AGE_DT_TM));
					subCnt = subCnt + 1;
				}

				if (recordData.PARA!="" && recordData.GRAVIDA!=""){
					var paraStatus = MP_Util.GetValueFromArray(recordData.PARA_STATUS_CD, codeArray);
					var gravidaStatus = MP_Util.GetValueFromArray(recordData.GRAVIDA_STATUS_CD, codeArray);
					var pVal = EventDisplay(recordData.PARA, recordData.PARA_DATE_IND);
					var gVal = EventDisplay(recordData.GRAVIDA, recordData.GRAVIDA_DATE_IND);
					var paraRes = GetEventViewerLink(criterion, paraStatus,pVal, recordData.PARA_EVENT_ID );
					var gravidaRes = GetEventViewerLink(criterion, paraStatus,gVal, recordData.GRAVIDA_EVENT_ID );
					jsBgHTML.push(buildBkgrndHtml(patBkgrndI18n.GRAVIDA + " " + patBkgrndI18n.PARA, gravidaRes + "/" + paraRes, recordData.PARA_GRAVIDA_DT_TM));
					subCnt = subCnt + 1;
				}
				if (recordData.FALL_RISK_SCORE!=""){
					subCnt = subCnt + 1;
					var severity = 0;
					if (parseInt(recordData.FALL_RISK_SCORE, 10)>44){
						severity=1;
					}
					var fallRiskStatus = MP_Util.GetValueFromArray(recordData.FALL_RISK_STATUS_CD, codeArray);
					var frVal = EventDisplay(recordData.FALL_RISK_SCORE, recordData.FALL_RISK_DATE_IND);
					var fallRiskRes = GetEventViewerLink(criterion, fallRiskStatus,frVal, recordData.FALL_RISK_EVENT_ID );
					jsBgHTML.push(buildBkgrndHtml(patBkgrndI18n.FALL_RISK_SCORE, fallRiskRes, recordData.FALL_SCORE_DT_TM, severity));
					//Add Hover
					jsBgHTML.push("<h4 class='det-hd'><span>", patBkgrndI18n.STATUS, ":</span></h4><div class='hvr'><dl><dt><span>", patBkgrndI18n.STATUS
					, ":</span></dt><dd><span>", fallRiskStatus.display, "</span></dl></div>");
				}
				
				if (recordData.SEIZURE_PRECAUTIONS!=""){
					jsBgHTML.push(buildBkgrndHtml(patBkgrndI18n.SEIZURE_PRECAUTIONS, recordData.SEIZURE_PRECAUTIONS, recordData.SEIZ_DT_TM));
					//Add Hover
					var seizStatus = MP_Util.GetValueFromArray(recordData.SEIZ_STATUS_CD, codeArray);
					jsBgHTML.push("<h4 class='det-hd'><span>", patBkgrndI18n.STATUS, ":</span></h4><div class='hvr'><dl><dt><span>", patBkgrndI18n.STATUS
					, ":</span></dt><dd><span>", seizStatus.display, "</span></dl></div>");
					subCnt = subCnt + 1;
				}
				
				if (recordData.DIET!=""){
					jsBgHTML.push(buildBkgrndHtml(recordData.DIET, recordData.DIET_ORDER_DISP, recordData.DIET_DT_TM));
					subCnt = subCnt + 1;
				}
				else if(component.getDietOrders().length > 0){
					jsBgHTML.push(buildBkgrndHtml(patBkgrndI18n.DIET, patBkgrndI18n.NO_RESULTS_FOUND, ""));
					subCnt = subCnt + 1;
				}
				
				if (recordData.PAIN_SCORE!=""){
					var painScoreStatus = MP_Util.GetValueFromArray(recordData.PAIN_SCORE_STATUS_CD, codeArray);
					var painVal = EventDisplay(recordData.PAIN_SCORE, recordData.PAIN_SCORE_DATE_IND);
					var painScoreRes = GetEventViewerLink(criterion, painScoreStatus,painVal, recordData.PAIN_SCORE_EVENT_ID );
					jsBgHTML.push(buildBkgrndHtml(patBkgrndI18n.PAIN_SCORE, painScoreRes, recordData.PAIN_SCORE_DT_TM ));
					subCnt = subCnt + 1;
				}
				else if(component.getPainScores().length > 0){
					jsBgHTML.push(buildBkgrndHtml(patBkgrndI18n.PAIN_SCORE, patBkgrndI18n.NO_RESULTS_FOUND, ""));
					subCnt = subCnt + 1;
				}
				
				if (recordData.OTHER_EVENTS.length > 0 ){
					var events = recordData.OTHER_EVENTS;
					//Sort according to sequence
					events.sort(SortByEventSeq);
					var otherStatus = null;
					var otherEventCd = null;
					var curEvent = null;
					var otherRes = "";
					for(var i =0, il = events.length; i < il; i++){
						otherStatus = otherEventCd = null;
						otherRes = "";
						curEvent = events[i];
						var otherStatus = MP_Util.GetValueFromArray(curEvent.RESULT_STATUS_CD, codeArray);
						var otherEventCd = MP_Util.GetValueFromArray(curEvent.EVENT_CD, codeArray);
						var otherVal = EventDisplay(curEvent.RESULT_VAL, curEvent.DATE_IND);
						var otherRes = GetEventViewerLink(criterion, otherStatus,otherVal, curEvent.EVENT_ID );
						jsBgHTML.push(buildBkgrndHtml(otherEventCd.display, otherRes, curEvent.EVENT_END_DT_TM ));
						subCnt = subCnt + 1;
					}

				}
				
                
                if (component.getDevices().length > 0) {

                    if (asstDev.length > 0) {
                        jsBgHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl'>-</span><span class='sub-sec-title'>", patBkgrndI18n.ASSISTIVE_DEVICES, " (", asstDev.length, ")</span></h3><div class='sub-sec-content'>");
                        jsBgHTML.push("<dl class='pbg-info hdr'><dt class='pbg-res'><span>&nbsp;</span></dt><dd class='pbg-dt'><span>", patBkgrndI18n.DATE_TIME, "</span></dd></dl>");
                        for (var i = 0, il = asstDev.length; i < il; i++) {
                            var asstDevStatus = MP_Util.GetValueFromArray(asstDev[i].STATUS_CD, codeArray);
							var asstVal = EventDisplay(asstDev[i].NAME, asstDev[i].DATE_IND);
                            var asstDevRes = GetEventViewerLink(criterion, asstDevStatus, asstVal, asstDev[i].EVENT_ID);

                            if (asstDev[i].DT_TM == null || asstDev[i].DT_TM == "") {
                                sDevDtTm = "";
                            }
                            else {
                                var df = GetDateFormatter();
                                sDevDtTm = df.formatISO8601(asstDev[i].DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
                            }
                            jsBgHTML.push("<dl class='pbg-info'><dt class='pbg-res'><span class='res-normal'>", asstDevRes, "</span></dt><dd class='pbg-dt'><span class='date-time'>", sDevDtTm, "</span></dd></dl>");
                        }
                        jsBgHTML.push("</div></div>");
                    }
					else{
						 jsBgHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl'>-</span><span class='sub-sec-title'>", patBkgrndI18n.ASSISTIVE_DEVICES, " (", asstDev.length, ")</span></h3><div class='sub-sec-content'>");
						 jsBgHTML.push("<dl class='pbg-info'><dt class='pbg-res'><span class='res-normal'>",  patBkgrndI18n.NO_RESULTS_FOUND, "</span></dt><dd class='pbg-dt'><span class='date-time'> &nbsp; </span></dd></dl>");
					}
                }
				jsBgHTML.unshift("<div class='", MP_Util.GetContentClass(component, subCnt) ,"'>");
				jsBgHTML.push("</div>");
				bgHTML = jsBgHTML.join("");
				countText = MP_Util.CreateTitleText(component, 0);
				MP_Util.Doc.FinalizeComponent(bgHTML, component, countText);
			}
            catch (err) {
                if (timerRenderComponent){
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
	function buildBkgrndHtml(label,sResult,resDtTm,alrtRed)
	{
		var sDispDtTm = "";
		if(resDtTm){
			var df = GetDateFormatter();
			sDispDtTm = df.formatISO8601(resDtTm, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
		}
		if (alrtRed==1){
			return "<dl class='pbg-info'><dt class='pbg-name'><span>" + 
				label + ":</span></dt><dd class='pbg-reac'><span class='res-severe'>" + 
				sResult + "</span></dd><dd class='pbg-dt'><span class='date-time'>" + 
				sDispDtTm + "</span></dd></dl>";
		}
		else
		{
			return "<dl class='pbg-info'><dt class='pbg-name'><span>" + 
				label + ":</span></dt><dd class='pbg-reac'><span class='res-normal'>" + 
				sResult + "</span></dd><dd class='pbg-dt'><span class='date-time'>" + 
				sDispDtTm + "</span></dd></dl>";
		}
	}
	function GetDateFormatter(){
        if (m_df == null) {
            m_df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
        }
        return m_df;
    }
	function GetEventViewerLink(criterion, statusCd, res, eventId) {
 	 	 	 	 		                
        var ar = [];
        var params = [ criterion.person_id+".0", criterion.encntr_id+".0", eventId+".0", "\"EVENT\"" ];
        ar.push("<a onclick='MP_Util.LaunchClinNoteViewer(", params.join(","),"); return false;' href='#'>", res, "</a>");
		var mean = statusCd.meaning;
		if ( mean === "MODIFIED" || mean ==="ALTERED") {
			ar.push("<span class='res-modified'>&nbsp;</span>");
		}
        return ar.join("");
 	}
	function SortByEventSeq(a, b){
        var x = a.EVENT_SEQ;
        var y = b.EVENT_SEQ;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }
	
	/**
	 * Returns the display for the result, formatting date events if necessary
	 * @param {string} result - the clinical result
	 * @param {boolean}	dateInd - boolean indicating if the event is a date type
	 * @return {string} represents formatted result
	 */
	function EventDisplay(sResult, bDateInd){
		var formattedResult = sResult;
		if(bDateInd === 1){
			var df = GetDateFormatter();
			formattedResult = df.formatISO8601(sResult, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
		}
		return(formattedResult);
	}
}();
