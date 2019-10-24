function RespTreatmentsComponentStyle()
{
	this.initByNamespace("respt");
}
/*
	ComponentStyle is defined in js/core/mp_component_defs.js
*/
RespTreatmentsComponentStyle.inherits(ComponentStyle);
/**
 * The Ventilation Monitoring component will retrieve all information associated to the patient
 * 		and monitoring their ventilation
 * 
 * @param {Criterion} criterion
 */
function RespTreatmentsComponent(criterion){
	this.setCriterion(criterion);
	this.setStyles(new RespTreatmentsComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.RESP_TREATMENTS.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.RESP_TREATMENTS.O1 - render component");
    this.setIncludeLineNumber(false);
	
	RespTreatmentsComponent.method("InsertData", function(){
		CERN_RESP_TREATMENT_O1.GetRespTreatmentData(this);
	});
	
	RespTreatmentsComponent.method("HandleSuccess", function(recordData){
		CERN_RESP_TREATMENT_O1.RenderRespTreatment(this, recordData);
	});
}
/*
	MPageComponent is defined in js/core/mp_component_defs.js
*/
RespTreatmentsComponent.inherits(MPageComponent);

/**
  * Respiratory Treatment methods
  * @namespace CERN_RESP_TREATMENT_O1
  * @static
  * @global
  */
var CERN_RESP_TREATMENT_O1 = function(){
	return {
		RenderRespTreatment : function(component, recordData){
			var countText = "", sHTML = "", jsHTML = [], nameSpace = component.getStyles().getNameSpace();
			var i = 0;
			
			var criterion = component.getCriterion();
			var personid = criterion.person_id + ".0"
			var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
			var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);

			/***************** Start Aerosol Therapy sub-component *****************/
			// Do not show if no data to show
			var aerosol_therapy_cnt = recordData.AEROSOL_THERAPY_QUAL;
			if (aerosol_therapy_cnt > 0)
			{
				jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>",
							i18n.AEROSOL_THERAPY, "</span></h3><div class='sub-sec-content'><div class='", 
							MP_Util.GetContentClass(component, aerosol_therapy_cnt), "'><h3 class='info-hd'><span>", i18n.AEROSOL_THERAPY_DETAILS, "</span></h3>");
				
				for (i=0;i<aerosol_therapy_cnt;i++)
				{
					var dataElem = recordData.AEROSOL_THERAPY[i];
					var statusObj = MP_Util.GetValueFromArray(dataElem.STATUS_CD, codeArray);
					var statusMean = statusObj.meaning;
					var statusDisp = statusObj.display;
					
					var resultDtTm = new Date();
					resultDtTm.setISO8601(dataElem.EVENT_END_DT_TM);
					var dataDtTm = df.format(resultDtTm, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
					var hvrDtTm=df.format(resultDtTm,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
					
					
					//data
					jsHTML.push("<dl class='", nameSpace, "-info'><dt><span>", dataElem.NAME, ":</span></dt><dd><span>", EventViewerLink(personid, dataElem.ENCOUNTER_ID, dataElem.EVENT_ID, dataElem.VALUE), "</span>");
					if (statusMean == "MODIFIED" || statusMean == "ALTERED") {
						jsHTML.push("<span class='res-modified'>&nbsp;</span>");
					}
					jsHTML.push("</dd><dd><span class='date-time'>", dataDtTm, "</span></dd></dl>");
					if (dataElem.VALUE != "--")
					{
						//hover tip
						jsHTML.push("<h4 class='det-hd'><span>", i18n.RESULT_DETAILS, "</span></h4><div class='hvr'><dl class='", nameSpace, "-det'><dt><span>", dataElem.NAME,
									":</span></dt><dd class='", nameSpace, "-det-name'><span>", dataElem.VALUE, " ", dataElem.VALUE_UNITS, "</span></dd><dt><span>",
									i18n.RESULT_DT_TM, ":</span></dt><dd><span>", hvrDtTm, "</span></dd><dt><span>", i18n.DOCUMENTED_BY, ":</span></dt><dd class='", nameSpace,
									"-det-ord-by'><span>", dataElem.DOCUMENTED_BY, "</span></dd><dt><span>", i18n.STATUS, ":</span></dt><dd class='", nameSpace,
									"-det-status'><span>", statusDisp, "</span></dd></dl></div>");
					}
				}
				jsHTML.push("</div></div></div><hr/>");
			}
			/***************** Close Aerosol Therapy sub-component *****************/
			
			
			/***************** Start Incentive Spirometry sub-component *****************/
			// Do not show if no data to show
			var incentive_spiro_cnt = recordData.INCENTIVE_SPIRO_QUAL;
			if (incentive_spiro_cnt > 0)
			{
				jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>",
							i18n.INCENTIVE_SPIROMETRY, "</span></h3><div class='sub-sec-content'><div class='",
							MP_Util.GetContentClass(component, incentive_spiro_cnt), "'><h3 class='info-hd'><span>", i18n.INCENTIVE_SPIROMETRY_DETAILS, "</span></h3>");
				
				for (i=0;i<incentive_spiro_cnt;i++)
				{
					var dataElem = recordData.INCENTIVE_SPIRO[i];
					var statusObj = MP_Util.GetValueFromArray(dataElem.STATUS_CD, codeArray);
					var statusMean = statusObj.meaning;
					var statusDisp = statusObj.display;
					var resultDtTm = new Date();
					resultDtTm.setISO8601(dataElem.EVENT_END_DT_TM);
					var dataDtTm = df.format(resultDtTm, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
					var hvrDtTm=df.format(resultDtTm,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
					
					//data
					jsHTML.push("<dl class='", nameSpace, "-info'><dt><span>", dataElem.NAME, ":</span></dt><dd><span>", EventViewerLink(personid, dataElem.ENCOUNTER_ID, dataElem.EVENT_ID, dataElem.VALUE), "</span>");
					if (statusMean == "MODIFIED" || statusMean == "ALTERED") {
						jsHTML.push("<span class='res-modified'>&nbsp;</span>");
					}
					jsHTML.push("</dd><dd><span class='date-time'>", dataDtTm, "</span></dd></dl>");
					if (dataElem.VALUE != "--")
					{
						//hover tip
						jsHTML.push("<h4 class='det-hd'><span>", i18n.RESULT_DETAILS, "</span></h4><div class='hvr'><dl class='", nameSpace, "-det'><dt><span>", dataElem.NAME,
									":</span></dt><dd class='", nameSpace, "-det-name'><span>", dataElem.VALUE, " ", dataElem.VALUE_UNITS, "</span></dd><dt><span>",
									i18n.RESULT_DT_TM, ":</span></dt><dd><span>", hvrDtTm, "</span></dd><dt><span>", i18n.DOCUMENTED_BY, ":</span></dt><dd class='", nameSpace,
									"-det-ord-by'><span>", dataElem.DOCUMENTED_BY, "</span></dd><dt><span>", i18n.STATUS, ":</span></dt><dd class='", nameSpace,
									"-det-status'><span>", statusDisp, "</span></dd></dl></div>");
					}
				}
				jsHTML.push("</div></div></div><hr/>");
			}
			/***************** Close Incentive Spirometry sub-component *****************/
			
			
			/***************** Start Cough Suction sub-component *****************/
			// Do not show if no data to show
			var cough_suction_cnt = recordData.COUGH_SUCTION_QUAL;
			if (cough_suction_cnt > 0)
			{
				jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>",
							i18n.COUGH_SUCTION, "</span></h3><div class='sub-sec-content'><div class='",
							MP_Util.GetContentClass(component, cough_suction_cnt), "'><h3 class='info-hd'><span>", i18n.COUGH_SUCTION_DETAILS, "</span></h3>");
				
				for (i=0;i<cough_suction_cnt;i++)
				{
					var dataElem = recordData.COUGH_SUCTION[i];
					var statusObj = MP_Util.GetValueFromArray(dataElem.STATUS_CD, codeArray);
					var statusMean = statusObj.meaning;
					var statusDisp = statusObj.display;
					var resultDtTm = new Date();
					resultDtTm.setISO8601(dataElem.EVENT_END_DT_TM);
					var dataDtTm = df.format(resultDtTm, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
					var hvrDtTm=df.format(resultDtTm,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
					
					//data
					jsHTML.push("<dl class='", nameSpace, "-info'><dt><span>", dataElem.NAME, ":</span></dt><dd><span>", EventViewerLink(personid, dataElem.ENCOUNTER_ID, dataElem.EVENT_ID, dataElem.VALUE), "</span>");
					if (statusMean == "MODIFIED" || statusMean == "ALTERED") {
						jsHTML.push("<span class='res-modified'>&nbsp;</span>");
					}
					jsHTML.push("</dd><dd><span class='date-time'>", dataDtTm, "</span></dd></dl>");
					if (dataElem.VALUE != "--")
					{
						//hover tip
						jsHTML.push("<h4 class='det-hd'><span>", i18n.RESULT_DETAILS, "</span></h4><div class='hvr'><dl class='", nameSpace, "-det'><dt><span>", dataElem.NAME,
									":</span></dt><dd class='", nameSpace, "-det-name'><span>", dataElem.VALUE, " ", dataElem.VALUE_UNITS, "</span></dd><dt><span>",
									i18n.RESULT_DT_TM, ":</span></dt><dd><span>", hvrDtTm, "</span></dd><dt><span>", i18n.DOCUMENTED_BY, ":</span></dt><dd class='", nameSpace,
									"-det-ord-by'><span>", dataElem.DOCUMENTED_BY, "</span></dd><dt><span>", i18n.STATUS, ":</span></dt><dd class='", nameSpace,
									"-det-status'><span>", statusDisp, "</span></dd></dl></div>");
					}
				}
				jsHTML.push("</div></div></div><hr/>");
			}
			/***************** Close Cough Suction sub-component *****************/
			
			
			/***************** Start Chest Physiotherapy sub-component *****************/
			// Do not show if no data to show
			var chest_physio_cnt = recordData.CHEST_PHYSIO_QUAL;
			if (chest_physio_cnt > 0)
			{
				jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>",
							i18n.CHEST_PHYSIOTHERAPY, "</span></h3><div class='sub-sec-content'><div class='",
							MP_Util.GetContentClass(component, chest_physio_cnt), "'><h3 class='info-hd'><span>", i18n.CHEST_PHYSIOTHERAPY_DETAILS, "</span></h3>");
				
				for (i=0;i<chest_physio_cnt;i++)
				{
					var dataElem = recordData.CHEST_PHYSIO[i];
					var statusObj = MP_Util.GetValueFromArray(dataElem.STATUS_CD, codeArray);
					var statusMean = statusObj.meaning;
					var statusDisp = statusObj.display;
					var resultDtTm = new Date();
					resultDtTm.setISO8601(dataElem.EVENT_END_DT_TM);
					var dataDtTm = df.format(resultDtTm, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
					var hvrDtTm=df.format(resultDtTm,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
					
					//data
					jsHTML.push("<dl class='", nameSpace, "-info'><dt><span>", dataElem.NAME, ":</span></dt><dd><span>", EventViewerLink(personid, dataElem.ENCOUNTER_ID, dataElem.EVENT_ID, dataElem.VALUE), "</span>");
					if (statusMean == "MODIFIED" || statusMean == "ALTERED") {
						jsHTML.push("<span class='res-modified'>&nbsp;</span>");
					}
					jsHTML.push("</dd><dd><span class='date-time'>", dataDtTm, "</span></dd></dl>");
					if (dataElem.VALUE != "--")
					{
						//hover tip
						jsHTML.push("<h4 class='det-hd'><span>", i18n.RESULT_DETAILS, "</span></h4><div class='hvr'><dl class='", nameSpace, "-det'><dt><span>", dataElem.NAME,
						":</span></dt><dd class='", nameSpace, "-det-name'><span>", dataElem.VALUE, " ", dataElem.VALUE_UNITS, "</span></dd><dt><span>", i18n.RESULT_DT_TM,
						":</span></dt><dd><span>", hvrDtTm, "</span></dd><dt><span>", i18n.DOCUMENTED_BY, ":</span></dt><dd class='", nameSpace, "-det-ord-by'><span>",
						dataElem.DOCUMENTED_BY, "</span></dd><dt><span>", i18n.STATUS, ":</span></dt><dd class='", nameSpace, "-det-status'><span>", statusDisp,
						"</span></dd></dl></div>");
					}
				}
				jsHTML.push("</div></div></div><hr />");
			}
			/***************** Close Chest Physiotherapy sub-component *****************/
							
			countText = "";
			sHTML += jsHTML.join("");
			
			MP_Util.Doc.FinalizeComponent(sHTML, component, countText);	
				
		    return;
		},
		GetRespTreatmentData : function(component){
			var criterion = component.getCriterion();
            var lookBackUnits = component.getLookbackUnits();
            var lookBackUnitTypeFlag = component.getLookbackUnitTypeFlag();
            var sAerosolTherapyCds =  "0.0";
			var sIncentiveSpiroCds = "0.0";
			var sCoughSuctionCds = "0.0";
			var sChestPhysioCds = "0.0";
			
			//Sequence Event Sets
			 var groups = component.getGroups();
                var xl = (groups != null) ? groups.length : 0;
                for (var x = 0; x < xl; x++) {
                    var group = groups[x];
                    if (group instanceof MPageEventSetGroup) {
                    	grpName = group.getGroupName()
                    	switch (grpName){
                    		case "MP_RESP_AER":
                    			sAerosolTherapyCds =("value(" + group.getEventSets()+ ")");
                    			break;
                    		case "MP_RESP_INCENT":
                    			sIncentiveSpiroCds =("value(" + group.getEventSets()+ ")");
                    			break;
                    		case "MP_RESP_COUGH":
                    			sCoughSuctionCds =("value(" + group.getEventSets()+ ")");
                    			break;
                    		case "MP_RESP_CHEST_PHYS":
                    			sChestPhysioCds =("value(" + group.getEventSets()+ ")");
                    			break;                    			
                    	}
                    }
				}
			
			var sendArr = ["^MINE^",criterion.person_id + ".0",((component.getScope() == 2) ? criterion.encntr_id + ".0" : "0.0"),lookBackUnits,lookBackUnitTypeFlag, sAerosolTherapyCds, sIncentiveSpiroCds, sCoughSuctionCds, sChestPhysioCds, criterion.provider_id+".0",criterion.ppr_cd+".0"];
			MP_Core.XMLCclRequestWrapper(component, "MP_RETRIEVE_RESP_TREATMENTS", sendArr, true);
		    return;
		}
	};
	
	function EventViewerLink(personid, encntrid, eventid, result){
		var ar = [];
		var params = [ personid, encntrid, eventid, "\"EVENT\"" ]
		ar.push("<a onclick='MP_Util.LaunchClinNoteViewer(", params.join(","),"); return false;' href='#'>", result, "</a>")
		return ar.join("");
	}
}();
