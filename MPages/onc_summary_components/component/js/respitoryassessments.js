function RespAssessmentsComponentStyle()
{
	this.initByNamespace("resa");
}
/*
	ComponentStyle is defined in js/core/mp_component_defs.js
*/
RespAssessmentsComponentStyle.inherits(ComponentStyle);
/**
 * The Respiratory Assessment component will retrieve all information associated to the patient
 * 		and monitoring their ventilation
 * 
 * @param {Criterion} criterion
 */
function RespAssessmentsComponent(criterion){
	this.setCriterion(criterion);
	this.setStyles(new RespAssessmentsComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.RESP_ASSESSMENTS.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.RESP_ASSESSMENTS.O1 - render component");
    this.setIncludeLineNumber(false);
	
	RespAssessmentsComponent.method("InsertData", function(){
		CERN_RESP_ASSESSMENT_O1.GetRespAssessmentData(this);
	});
	
	RespAssessmentsComponent.method("HandleSuccess", function(recordData){
		CERN_RESP_ASSESSMENT_O1.RenderRespAssessment(this, recordData);
	});
}
/*
	MPageComponent is defined in js/core/mp_component_defs.js
*/
RespAssessmentsComponent.inherits(MPageComponent);

/**
  * Respiratory Assessment methods
  * @namespace CERN_RESP_ASSESSMENT_O1
  * @static
  * @global
  */
var CERN_RESP_ASSESSMENT_O1 = function(){
	return {
		RenderRespAssessment : function(component, recordData){
			var countText = "", sHTML = "", jsHTML = [], nameSpace = component.getStyles().getNameSpace();
			var orgnzdAGB_ar = null;
			var i = 0;
			
			var criterion = component.getCriterion();
			var personid = criterion.person_id + ".0";
			var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
			var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
			
			var abgObj = recordData.ABGS;  // Base object for ABG sections
			var abgLen = abgObj.length;
			var latestAbgHTML = "";  // HTML for Latest ABG section
			var prevAbgHTML = "";  // HTML for Previous ABG section
			var latestAbgDt = "";  // Date/Time of Latest ABG results
			var prevAbgDt = "";  // Date/Time of Previous ABG results
			
			// Start component for scrolling  ; kds added <hr/> below
			sHTML += "<hr />";
			
			
			/***************** Start O2 Therapy sub-component *****************/
			// Do not show if no data to show
			var o2_therapy_cnt = recordData.O2_THERAPY_QUAL;
			if (o2_therapy_cnt > 0)
			{
				jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>",
							i18n.O2_THERAPY_TITRATION, "</span></h3><div class='sub-sec-content'><div class='", MP_Util.GetContentClass(component, o2_therapy_cnt),
							"'><h3 class='info-hd'><span>", i18n.O2_THERAPY_TITRATION_DETAILS, "</span></h3>");
				
				for (i=0;i<o2_therapy_cnt;i++)
				{
					var dataElem = recordData.O2_THERAPY[i];
					var statusObj = MP_Util.GetValueFromArray(dataElem.STATUS_CD, codeArray);
					var statusMean = statusObj.meaning;
					var statusDisp = statusObj.display;
					var resultDtTm = new Date();
					resultDtTm.setISO8601(dataElem.EVENT_END_DT_TM);
					var dataDtTm = df.format(resultDtTm, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
					var hvrDataDtTm = df.format(resultDtTm, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
					//data
					jsHTML.push("<dl class='", nameSpace, "-info'><dt><span>", dataElem.NAME, ":</span></dt><dd><span>",
					EventViewerLink(personid, dataElem.ENCOUNTER_ID, dataElem.EVENT_ID, dataElem.VALUE), "</span>", getStatusInd(statusMean), "</dd><dd><span class='date-time'>",
					dataDtTm, "</span></dd></dl>");
					//hover tip
					if (dataElem.VALUE !== "--")
					{
						jsHTML.push("<h4 class='det-hd'><span>", i18n.RESULT_DETAILS, "</span></h4><div class='hvr'><dl class='", nameSpace, "-det'><dt><span>", dataElem.NAME,
									":</span></dt><dd class='", nameSpace, "-det-name'><span>", dataElem.VALUE, " ", dataElem.VALUE_UNITS, "</span></dd><dt><span>",
									i18n.RESULT_DT_TM, ":</span></dt><dd><span>", hvrDataDtTm, "</span></dd><dt><span>", i18n.DOCUMENTED_BY, ":</span></dt><dd class='", nameSpace,
									"-det-ord-by'><span>", dataElem.DOCUMENTED_BY, "</span></dd><dt><span>", i18n.STATUS, ":</span></dt><dd class='", nameSpace,
									"-det-status'><span>", statusDisp, "</span></dd></dl></div>");
					}
				}
				jsHTML.push("</div></div></div><hr />");
			}
			/***************** Close O2 Therapy sub-component *****************/           

			
			/***************** Start Latest ABG sub-component *****************/

			if (abgLen > 0) {  // Results exist for Latest ABGs
				var curDf = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
				var curAbg = abgObj[0];
				// Get HTML for section content
				latestAbgHTML = createAbgContent(curAbg, personid);
				// Build HTML for result date/time display
				latestAbgDt = "<span class='resa-abg-dt'>" + curDf.formatISO8601(curAbg.EVENT_END_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR) + "</span>";
			}
			else {  // No results exist for Latest ABGs
				// Build HTML for empty section content
				latestAbgHTML = "<span class='res-none'>" + i18n.NO_RESULTS_FOUND + "</span>";
			}				
			// Build HTML for Latest ABG section
			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>",
						i18n.LATEST_BLOOD_GAS_ARTERIAL_RESULTS, "</span>", latestAbgDt, "</h3><div class='sub-sec-content'>", latestAbgHTML, "</div></div>");
			
			/***************** End Latest ABG sub-component *****************/
			
			/***************** Start Previous ABG sub-component *****************/
			
			/* Previous ABG Section */
			if (abgLen > 1) {  // Results exist for Previous ABGs
				var prevDf = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
				var prevAbg = abgObj[1];
				// Get HTML for section content
				prevAbgHTML = createAbgContent(prevAbg, personid);
				// Build HTML for result date/time display
				prevAbgDt = "<span class='resa-abg-dt'>" + prevDf.formatISO8601(prevAbg.EVENT_END_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR) + "</span>";
			}
			else {  // No results exist for Previous ABGs
				// Build HTML for empty section content
				prevAbgHTML = "<span class='res-none'>" + i18n.NO_RESULTS_FOUND + "</span>";
			}
			// Build HTML for Previous ABG section
			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>",
						i18n.PREVIOUS_BLOOD_GAS_ARTERIAL_RESULTS, "</span>", prevAbgDt, "</h3><div class='sub-sec-content'>", prevAbgHTML, "</div></div>");			
			
			/***************** End Previous ABG sub-component *****************/
			
			jsHTML.push("<p class='resa-disclaim'>", i18n.RESPIRATORY_DISCLAIMER, "</p>");
			
			
			/***************** Start Artifical Airway sub-component *****************/
			// Do not show if no data to show
			var art_airway_cnt = recordData.ART_AIRWAY_QUAL;
			if (art_airway_cnt > 0){
				jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>",
							i18n.ARTIFICIAL_AIRWAY, "</span></h3><div class='sub-sec-content'><div class='", MP_Util.GetContentClass(component, art_airway_cnt),
							"'><h3 class='info-hd'><span>", i18n.ARTIFICIAL_AIRWAY_DETAILS, "</span></h3>");
				
				for (i=0;i<art_airway_cnt;i++){
					var dataElem = recordData.ART_AIRWAY[i];
					var statusObj = MP_Util.GetValueFromArray(dataElem.STATUS_CD, codeArray);
					var statusMean = statusObj.meaning;
					var statusDisp = statusObj.display;
					var resultDtTm = new Date();
					resultDtTm.setISO8601(dataElem.EVENT_END_DT_TM);
					var dataDtTm = df.format(resultDtTm, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
					var hvrDataDtTm = df.format(resultDtTm, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
					//data
					jsHTML.push("<dl class='", nameSpace, "-info'><dt><span>", dataElem.NAME, ":</span></dt><dd><span>",
								EventViewerLink(personid, dataElem.ENCOUNTER_ID, dataElem.EVENT_ID, dataElem.VALUE), "</span>", getStatusInd(statusMean),
								"</dd><dd><span class='date-time'>", dataDtTm, "</span></dd></dl>");
					//hover tip
					if (dataElem.VALUE !== "--")
					{
						jsHTML.push("<h4 class='det-hd'><span>", i18n.RESULT_DETAILS, "</span></h4><div class='hvr'><dl class='", nameSpace, "-det'><dt><span>", dataElem.NAME,
									":</span></dt><dd class='", nameSpace, "-det-name'><span>", dataElem.VALUE, " ", dataElem.VALUE_UNITS, "</span></dd><dt><span>",
									i18n.RESULT_DT_TM, ":</span></dt><dd><span>", hvrDataDtTm, "</span></dd><dt><span>", i18n.DOCUMENTED_BY, ":</span></dt><dd class='", nameSpace,
									"-det-ord-by'><span>", dataElem.DOCUMENTED_BY, "</span></dd><dt><span>", i18n.STATUS, ":</span></dt><dd class='", nameSpace,
									"-det-status'><span>", statusDisp, "</span></dd></dl></div>");
					}
				}
				jsHTML.push("</div></div></div><hr />");
			}
			/***************** Close Artifical Airway sub-component *****************/
						
			/***************** Start Breath Sounds sub-component *****************/
			// show section even when no data
			var breath_sounds_cnt = recordData.BREATH_SOUNDS_QUAL;
			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>",
						i18n.BREATH_SOUNDS_ASSESSMENT, "</span></h3><div class='sub-sec-content'><div class='", MP_Util.GetContentClass(component, breath_sounds_cnt),
						"'><h3 class='info-hd'><span>", i18n.BREATH_SOUNDS_ASSESSMENT_DETAILS, "</span></h3>");
			
			for (i=0;i<breath_sounds_cnt;i++){
				var dataElem = recordData.BREATH_SOUNDS[i];
				var statusObj = MP_Util.GetValueFromArray(dataElem.STATUS_CD, codeArray);
				var statusMean = statusObj.meaning;
				var statusDisp = statusObj.display;
				var resultDtTm = new Date();
				resultDtTm.setISO8601(dataElem.EVENT_END_DT_TM);
				var dataDtTm = df.format(resultDtTm, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
				var hvrDataDtTm = df.format(resultDtTm, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
				//data
				jsHTML.push("<dl class='", nameSpace, "-info'><dt><span>", dataElem.NAME, ":</span></dt><dd><span>",
							EventViewerLink(personid, dataElem.ENCOUNTER_ID, dataElem.EVENT_ID, dataElem.VALUE), "</span>", getStatusInd(statusMean),
							"</dd><dd><span class='date-time'>", dataDtTm, "</span></dd></dl>");
				//hover tip
				if (dataElem.VALUE != "--")
				{
					jsHTML.push("<h4 class='det-hd'><span>", i18n.RESULT_DETAILS, "</span></h4><div class='hvr'><dl class='", nameSpace, "-det'><dt><span>", dataElem.NAME,
								":</span></dt><dd class='", nameSpace, "-det-name'><span>", dataElem.VALUE, " ", dataElem.VALUE_UNITS, "</span></dd><dt><span>",
								i18n.RESULT_DT_TM, ":</span></dt><dd><span>", hvrDataDtTm, "</span></dd><dt><span>", i18n.DOCUMENTED_BY, ":</span></dt><dd class='", nameSpace,
								"-det-ord-by'><span>", dataElem.DOCUMENTED_BY, "</span></dd><dt><span>", i18n.STATUS, ":</span></dt><dd class='", nameSpace, "-det-status'><span>",
								statusDisp, "</span></dd></dl></div>");
				}   
			}
			if (breath_sounds_cnt == 0){
				jsHTML.push("<span class='res-none'>", i18n.NO_RESULTS_FOUND, "</span>");
			}
			jsHTML.push("</div></div></div><hr />");
			/***************** Close Breath Sounds sub-component *****************/
			
			/***************** Start Respiratory Description sub-component *****************/
			var resp_descr_cnt = recordData.RESP_DESCR_QUAL;
			// show section even when no data
			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>",
						i18n.RESPIRATORY_DESCRIPTION, "</span></h3><div class='sub-sec-content'><div class='", MP_Util.GetContentClass(component, resp_descr_cnt),
						"'><h3 class='info-hd'><span>", i18n.RESPIRATORY_DESCRIPTION_DETAILS, "</span></h3>");
			
			for (i=0;i<resp_descr_cnt;i++){
				var dataElem = recordData.RESP_DESCR[i];
				var statusObj = MP_Util.GetValueFromArray(dataElem.STATUS_CD, codeArray);
				var statusMean = statusObj.meaning;
				var statusDisp = statusObj.display;
				var resultDtTm = new Date();
				resultDtTm.setISO8601(dataElem.EVENT_END_DT_TM);
				var dataDtTm = df.format(resultDtTm, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
				var hvrDataDtTm = df.format(resultDtTm, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
				//data
				jsHTML.push("<dl class='", nameSpace, "-info'><dt><span>", dataElem.NAME, ":</span></dt><dd><span>",
							EventViewerLink(personid, dataElem.ENCOUNTER_ID, dataElem.EVENT_ID, dataElem.VALUE), "</span>", getStatusInd(statusMean),
							"</dd><dd><span class='date-time'>", dataDtTm, "</span></dd></dl>");
				//hover tip
				if (dataElem.VALUE != "--")
				{
					jsHTML.push("<h4 class='det-hd'><span>", i18n.RESULT_DETAILS, "</span></h4><div class='hvr'><dl class='", nameSpace, "-det'><dt><span>", dataElem.NAME,
								":</span></dt><dd class='", nameSpace, "-det-name'><span>", dataElem.VALUE, " ", dataElem.VALUE_UNITS, "</span></dd><dt><span>", i18n.RESULT_DT_TM,
								":</span></dt><dd><span>", hvrDataDtTm, "</span></dd><dt><span>", i18n.DOCUMENTED_BY, ":</span></dt><dd class='", nameSpace, "-det-ord-by'><span>",
								dataElem.DOCUMENTED_BY, "</span></dd><dt><span>", i18n.STATUS, ":</span></dt><dd class='", nameSpace, "-det-status'><span>", statusDisp,
								"</span></dd></dl></div>");
				}   
			}
			if (resp_descr_cnt == 0){
				jsHTML.push("<span class='res-none'>", i18n.NO_RESULTS_FOUND, "</span>");
			}
			jsHTML.push("</div></div></div><hr />");
			/***************** Close Respiratory Description sub-component *****************/
			
			countText = "";
			sHTML += jsHTML.join("");
				
			MP_Util.Doc.FinalizeComponent(sHTML, component, countText);
				
		    return;
		},
		GetRespAssessmentData : function(component){
			var criterion = component.getCriterion();
            var lookBackUnits = component.getLookbackUnits();
            var lookBackUnitTypeFlag = component.getLookbackUnitTypeFlag();
			var sABGCds = "0.0";
			var sArtificalAirwayCds = "0.0";
			var sOxygenTherapyCds = "0.0";
			var sBreathSoundsCds = "0.0";
			var sRespDescrCds = "0.0";  
			
			//Sequence Event Sets
			var groups = component.getGroups();
			var x1 = (groups != null) ? groups.length : 0;
			for (var x=0; x < x1; x++){
				var group = groups[x];
				if (group instanceof MPageEventSetGroup) {
					grpName = group.getGroupName();
                	switch (grpName){
            		case "MP_RESP_ABG":
            			sABGCds =("value(" + group.getEventSets()+ ")");
            			break;
            		case "MP_RESP_ART_AIR":
            			sArtificalAirwayCds =("value(" + group.getEventSets()+ ")");
            			break;
            		case "MP_RESP_O2_TIT":
            			sOxygenTherapyCds =("value(" + group.getEventSets()+ ")");
            			break;
            		case "MP_RESP_BRTH_SOUND":
            			sBreathSoundsCds =("value(" + group.getEventSets()+ ")");
            			break;       
            		case "MP_RESP_DESC":
            			sRespDescrCds =("value(" + group.getEventSets()+ ")");
            			break;  
                	}
				}
			}
				
			var sendArr = ["^MINE^",criterion.person_id + ".0",((component.getScope() == 2) ? criterion.encntr_id + ".0" : "0.0"),lookBackUnits,lookBackUnitTypeFlag, sABGCds, sArtificalAirwayCds, sOxygenTherapyCds, sBreathSoundsCds, sRespDescrCds, criterion.provider_id+".0",criterion.ppr_cd+".0", 1];
			MP_Core.XMLCclRequestWrapper(component, "MP_RETRIEVE_RESP_ASSESSMENTS", sendArr, true);
		    return;



		}
	};

	
	/**
	 * Build the HTML for linking to the result viewer 
	 * @param {float} personid : The Person ID for the patient
	 * @param {float} encntrid : The Encounter ID for the patient
	 * @param {float} eventid : The Event ID for the result in question
	 * @param {string} result : The result string displayed in MPage
	 * 
	 * @return {string} : The HTML for linking to the result viewer for the value
	 */
	
	function EventViewerLink(personid, encntrid, eventid, result){
		var ar = [];
		var params = [ personid, encntrid, eventid, "\"EVENT\"" ]
		ar.push("<a onclick='MP_Util.LaunchClinNoteViewer(", params.join(","),"); return false;' href='#'>", result, "</a>")
		return ar.join("");
	}


	/**
	 * Return the HTML for the content of an ABG section
	 * @param {object} abgItem : The object for all ABG results to be displayed in the section
	 * @param {float} persId : The Person ID for the patient
	 * 
	 * @return {string} : The HTML for the ABG section's content
	 */
	function createAbgContent(abgItem, persId) {
		var abgHTML = [];  // HTML for entire section
		var curAbgHdr = [];  // HTML for header row
		var curAbgCont = [];  // HTML for value row
		var colMask = "";  // Class representing the number of columns
		var curAbgData = abgItem.ABG_DATA;
		var abgResCnt = curAbgData.length;

		// Apply the appropriate mask based on the number of columns/results shown
		switch(abgResCnt) {
			case 1:
				colMask = "resa-1col";
				break;
			case 2:
				colMask = "resa-2col";
				break;
			case 3:
				colMask = "resa-3col";
				break;
			case 4:
				colMask = "resa-4col";
				break;
			case 5:
				colMask = "resa-5col";
				break;
			case 6:
				colMask = "resa-6col";
				break;
			default:
				colMask = "";
				break;
		}
		
		// Construct table of ABG results
		abgHTML.push("<table class='resa-abg-table ", colMask, "'><tr class='hdr'>");
		// Build header and result cells for each ABG value
		for (var i=0; i<abgResCnt; i++) {
			var curAbgItem = curAbgData[i];
			var curAbgVal = curAbgItem.VALUE;
			if (curAbgVal) {  // Value exists for this ABG
				curAbgVal = EventViewerLink(persId, curAbgItem.ENCOUNTER_ID, curAbgItem.EVENT_ID, curAbgItem.VALUE)
			}
			else {  // No value for this ABG
				curAbgVal = "--";
			}
			
			// Create both cells in sync
			curAbgHdr.push("<th class='resa-abg-res'>", curAbgItem.NAME, "</th>");
			curAbgCont.push("<td class='resa-abg-res'><span class='res-value'>", curAbgVal, "</span>", getStatusInd(curAbgItem.STATUS), "</td>");
		}
		// Assemble the table from the pieces
		abgHTML = abgHTML.concat(curAbgHdr);
		abgHTML.push("</tr><tr>");
		abgHTML = abgHTML.concat(curAbgCont);
		abgHTML.push("</tr></table>");
		return abgHTML.join("");
	}
	
	/**
	 * Build the HTML for showing the "modified" indicator, if needed
	 * @param {string} stat : The status meaning for the item
	 * 
	 * @return {string} : The HTML for the "modified" indicator, blank if not modified
	 */
	function getStatusInd(stat) {
		var ind = "";
		// Display icon for both Modified and Altered results
		if (stat === "MODIFIED" || stat === "ALTERED") {
			ind = "<span class='res-modified'>&nbsp;</span>";
		}
		return ind;
	}

}();