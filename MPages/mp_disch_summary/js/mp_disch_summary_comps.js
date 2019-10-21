/**
 * Project: mp_activities_o1.js
 * Version 1.0.0
 * Released 10/04/2010
 * @author Randy Rogers
 */
 
function ActivitiesComponentStyle(){
    this.initByNamespace("act");
}

ActivitiesComponentStyle.inherits(ComponentStyle);

function ActivitiesComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new ActivitiesComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.ACTIVITIES.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.ACTIVITIES.O1 - render component");
	this.setIncludeLineNumber(true);
	this.setScope(2);
    ActivitiesComponent.method("InsertData", function(){
        CERN_ACTIVITIES_O1.GetActivitiesTable(this);
    });
    ActivitiesComponent.method("HandleSuccess", function(recordData){
        CERN_ACTIVITIES_O1.RenderComponent(this, recordData);
    });
	ActivitiesComponent.method("openTab", function(){
		var criterion = this.getCriterion();
		var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + 0 + "|0|0";
		javascript: MPAGES_EVENT("POWERFORM", paramString);
		this.InsertData();
	});
	
	ActivitiesComponent.method("openDropDown", function(formID){
		var criterion = this.getCriterion();
		var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + formID + "|0|0";
        javascript: MPAGES_EVENT("POWERFORM", paramString);  
        CERN_ACTIVITIES_O1.GetActivitiesTable(this);
	});
}

ActivitiesComponent.inherits(MPageComponent);

var CERN_ACTIVITIES_O1 = function(){
    return {
        GetActivitiesTable: function(component){
            var groups = component.getGroups();
			var events = (groups != null && groups.length > 0) ? groups[0].getEventSets() : null;
			var sEventSet = (events != null) ? "value(" + events.join(",") + ")" : "0.0";
			var criterion = component.getCriterion();
		
            var sendAr = [];	
		
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", 1, sEventSet,0);
            sendAr.push("^measurement^", component.getLookbackUnits(), criterion.position_cd + ".0", criterion.ppr_cd + ".0",component.getLookbackUnitTypeFlag());
	
            MP_Core.XMLCclRequestWrapper(component, "MP_GET_N_RESULTS", sendAr, true);
        },
		
        RenderComponent: function(component, recordData){
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
                var sHTML = "", countText = "";
                var ar = [];
                var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                var results = recordData.RESULTS;

				ar.push("<div class='", MP_Util.GetContentClass(component, results.length), "'>");
				
				results.sort(SortByEffectiveEndDate);
				
				for (var i = 0, l = results.length; i < l; i++) {
					for (var j=0,jl=results[i].CLINICAL_EVENTS.length;j<jl;j++) {
						var display = "", sDate = "";
						var meas = results[i].CLINICAL_EVENTS[j];
						if (meas.EVENT_CD != "") {
							var ecObj = MP_Util.GetValueFromArray(meas.EVENT_CD, codeArray);
							display = ecObj.display;
						}
						
						ar.push("<dl class ='act-info'><dt class ='act-disp-lbl'>", display, "</dt><dd class ='act-name'>", display, "</dd><dt class ='act-res-lbl'>", i18n.RESULT, " </dt><dd class ='act-res'>")
						if (meas.EFFECTIVE_DATE != "") {
							var dateTime = new Date();
							dateTime.setISO8601(meas.EFFECTIVE_DATE);
							sDate = dateTime.format("longDateTime2")
						}
						for (var k = 0, m = meas.MEASUREMENTS.length; k < m; k++) {
							var result = MP_Util.Measurement.GetString(meas.MEASUREMENTS[k], codeArray, "longDateTime2");
							ar.push(result, "</dd><dt class= 'actdate'>", sDate, " </dt><dd class ='act-dt'>", sDate, "</dd></dl>")
						}
						
					}
				}
				
				ar.push("</div>");
				
				sHTML = ar.join("");
				countText = MP_Util.CreateTitleText(component, results.length);
			
				var compNS = component.getStyles().getNameSpace();
                MP_Util.Doc.FinalizeComponent(sHTML, component, countText);				
            } 
            catch (err) {
                if (timerRenderComponent) {
                    timerRenderComponent.Abort();
                    timerRenderComponent = null;
                }
                throw (err);
            }
            finally {
                if (timerRenderComponent) 
                    timerRenderComponent.Stop();
            }
        }
    };
	
	function SortByEffectiveEndDate(a, b)
	{
		var aPart = GetClinEventPart(a);
        var bPart = GetClinEventPart(b);
        if (aPart) 
            var aDate = aPart.EFFECTIVE_DATE;
        if (bPart) 
            var bDate = bPart.EFFECTIVE_DATE;
        
        if (aDate > bDate) 
            return -1;
        else if (aDate < bDate) 
            return 1;
        else 
            return 0;
	}
	function GetClinEventPart(result){
        var returnPart = null;
		for (var x = result.CLINICAL_EVENTS.length; x--;) {
			var part = result.CLINICAL_EVENTS[x];
			if (returnPart == null || part.EFFECTIVE_DATE > returnPart.EFFECTIVE_DATE)
				returnPart = part;
		}
        return (returnPart);
    }
}();
/**
 * Project: mp_demographics_o1.js
 * Version 1.0.1-SNAPSHOT
 * Released 7/23/2010
 * @author Greg Howdeshell (GH7199)
 */
var CERN_DEMO_BANNER_O1 = function(){
    return {
        GetPatientDemographics: function(demoBanner, criterion){
            timerPatDemLoad = MP_Util.CreateTimer("USR:MPG.DEMO_BANNER.O1 - load component");
            if (timerPatDemLoad) 
                timerPatDemLoad.Start();
            
            var info = new XMLCclRequest();
            
            info.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200) {
                    var timer = MP_Util.CreateTimer("ENG:MPG.DEMO_BANNER.O1 – render component");
                    try {
                        var jsHTML = new Array();
                        var sHTML = "", birthDate = "", visitReason = "", mrnNbr, finNbr = "", age = "", isolation = "";
                        
                        var jsonText = JSON.parse(this.responseText);
                        var codeArray = MP_Util.LoadCodeListJSON(jsonText.RECORD_DATA.CODES);
                        var patInfo = jsonText.RECORD_DATA.DEMOGRAPHICS.PATIENT_INFO;
                        var nameFull = patInfo.PATIENT_NAME.NAME_FULL;
                        var enCodeArray = [];
                        var formattedAliasArray = [];
                        
                        var dateTime = new Date();
                        if (patInfo.BIRTH_DT_TM != "") {
                            dateTime.setISO8601(patInfo.BIRTH_DT_TM);
                            birthDate = dateTime.format("shortDate2");
                            age = MP_Util.CalculateAge(dateTime);
                        }
                        
                        var oSex = MP_Util.GetValueFromArray(patInfo.SEX_CD, codeArray); //codeObject.display - will give the display name associated with the code value
                        var encntrInfo = jsonText.RECORD_DATA.DEMOGRAPHICS.ENCOUNTER_INFO;
                        for (var j = 0, e = encntrInfo.length; j < e; j++) {
                            visitReason = encntrInfo[j].REASON_VISIT;
                            for (var i = 0, l = encntrInfo[j].ALIAS.length; i < l; i++) {
                                enCodeArray[i] = MP_Util.GetValueFromArray(encntrInfo[j].ALIAS[i].ALIAS_TYPE_CD, codeArray);
                                if (enCodeArray[i].meaning == "FIN NBR") {
                                    finNbr = encntrInfo[j].ALIAS[i].FORMATTED_ALIAS;
                                }
                                if (enCodeArray[i].meaning == "MRN") {
                                    mrnNbr = encntrInfo[j].ALIAS[i].FORMATTED_ALIAS;
                                }
                            }
                            if (encntrInfo[j].ISOLATION_CD > 0) 
                                var isoObj = MP_Util.GetValueFromArray(encntrInfo[j].ISOLATION_CD, codeArray);
                            if (isoObj) 
                                isolation = isoObj.display
                        }
                        
                        var sexAbb = (oSex != null) ? oSex.display : i18n.UNKNOWN;
                        
                        jsHTML.push("<dl class='dmg-info'><dt class='dmg-pt-name-lbl'><span>", i18n.NAME, "</span></dt><dd class='dmg-pt-name'><span>", nameFull, "</span></dd><dt class='dmg-sex-age-lbl'><span>", i18n.SEX, " ", i18n.AGE, "</span></dt><dd class='dmg-sex-age'><span>", sexAbb, " ", age, "</span></dd><dt><span>", i18n.DOB, ":</span></dt><dd class='dmg-dob'><span>", birthDate, "</span></dd><dt><span>", i18n.MRN, ":</span></dt><dd class='dmg-mrn'><span>", mrnNbr, "</span></dd><dt><span>", i18n.FIN, ":</span></dt><dd class='dmg-fin'><span>", finNbr, "</span></dd><dt><span>", i18n.ISOLATION, ":</span></dt><dd class='dmg-isolation'><span>", isolation, "</span></dd><dt><span>", i18n.VISIT_REASON, ":</span></dt><dd class='dmg-rfv'><span>", visitReason, "</span></dd></dl>");
                        
                        demoBanner.innerHTML = jsHTML.join("");
                    }
                    finally {
                        if (timer) 
                            timer.Stop();
                        
                        if (timerPatDemLoad) 
                            timerPatDemLoad.Stop();
                    }
                }
                if (this.readyState == 4) {
                    MP_Util.ReleaseRequestReference(this);
                }
            } //function
            //  Call the ccl progam and send the parameter string
            info.open('GET', "MP_GET_PATIENT_DEMO", 0);
            var sendVal = "^MINE^, " + criterion.person_id + ".0, " + criterion.encntr_id + ".0";
            info.send(sendVal);
        }
    };
}();
/**
 * Project: mp_diagnoses_o1.js
 * Version 1.2.0-SNAPSHOT
 * Released 7/23/2010
 * @author Greg Howdeshell (GH7199)
 * @author Megha Rao (MR018925)
 * @author Kiran Handi (KH019391)
 * @author Sreenivas Thirumalachar (ST017230)
 */
function DiagnosesComponentStyle(){
    this.initByNamespace("dx");
}

DiagnosesComponentStyle.inherits(ComponentStyle);

/**
 * The Diagnoses component will retrieve all diagnoses information associated to the encounter
 *
 * @param {Criterion} criterion
 * @author Greg Howdeshell
 * @author Megha Rao (MR018925)
 * @author Kiran Handi (KH019391)
 */
function DiagnosesComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new DiagnosesComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.DIAGNOSES.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.DIAGNOSES.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
    
    DiagnosesComponent.method("InsertData", function(){
        CERN_DIAGNOSES_O1.GetDiagnosisTable(this);
    });
    DiagnosesComponent.method("HandleSuccess", function(recordData){
        CERN_DIAGNOSES_O1.RenderComponent(this, recordData);
    });
    
    DiagnosesComponent.method("setDiagnosisType", function(value){
        this.m_diagnosisType = value;
    });
    
    DiagnosesComponent.method("getDiagnosisType", function(){
        if (this.m_diagnosisType != null) 
            return this.m_diagnosisType;
    });
}

DiagnosesComponent.inherits(MPageComponent);

/**
 * Diagnoses methods
 * @namespace CERN_DIAGNOSES_O1
 * @static
 * @global
 * @dependencies Script: mp_get_diagnoses
 */
var CERN_DIAGNOSES_O1 = function(){
    return {
        GetDiagnosisTable: function(component){
            var sendAr = [];
            var criterion = component.getCriterion();
            
            var encntrOption = (component.getScope() == 2) ? (criterion.encntr_id + ".0") : "0.0";
            sendAr.push("^MINE^", criterion.person_id + ".0", encntrOption, 0);
            
            var types = component.getDiagnosisType();
            var diagnosisType = (types != null && types.length > 0) ? "value(" + types.join(",") + ")" : "0.0";
            sendAr.push(diagnosisType);
            sendAr.push(criterion.provider_id+".0",criterion.ppr_cd+".0");
            MP_Core.XMLCclRequestWrapper(component, "MP_GET_DIAGNOSES", sendAr, true);
        },
        RenderComponent: function(component, recordData){
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
                var jsDxHTML = [];
                var dxHTML = "", countText = "";
                var diagDate = dxCode = dxAnnot = dxName = dxFaceUp = comm = responProvider = "";
                var dateTime = new Date();
                var personnelArray = new Array();
                
                personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
                var diagnosisArray = recordData.DIAGNOSIS;
                diagnosisArray.sort(SortByDiagnosesName)
                jsDxHTML.push("<div class ='", MP_Util.GetContentClass(component, diagnosisArray.length), "'>");
                for (var i = 0, l = diagnosisArray.length; i < l; i++) {
                    var diagnose = diagnosisArray[i];
                    dxName = diagnose.NAME;
                    if (diagnose.DISPLAY_AS != "") {
                        dxAnnot = dxFaceUp = diagnose.DISPLAY_AS;
                    }
                    else {
                        dxAnnot = dxFaceUp = dxName;
                    }
                    if (diagnose.CODE != "" && diagnose.CODE != "()") {
                        dxCode = diagnose.CODE;
                    }
                    if (diagnose.DIAG_DT_TM != "") {
                        diagDate = diagnose.DIAG_DT_TM;
                        dateTime.setISO8601(diagDate);
                        diagDate = dateTime.format("shortDate2");
                    }
                    else 
                        diagDate = "";
                    
                    if (diagnose.COMMENTS != "") {
                        var message = diagnose.COMMENTS;
                        comm = message.replace(/\\/g, "<br />")
                    }
                    else 
                        comm = "";
                    
                    if (diagnose.PRSNL_ID > 0) {
                        var prsnlObj = MP_Util.GetValueFromArray(diagnose.PRSNL_ID, personnelArray);
                        responProvider = prsnlObj.fullName;
                    }
                    else 
                        responProvider = "";
                    jsDxHTML.push("<h3 class='dx-info-hd'><span>", dxName, "</span></h3><dl class='dx-info'><dt><span>", i18n.DIAGNOSES, ":</span></dt><dd class='dx-name'><span>", dxFaceUp, "</span></dd><dt><span>", i18n.CODE, ":</span></dt><dd class='dx-code'><span>", dxCode, "</span></dd></dl><h4 class='dx-det-hd'><span>", i18n.DETAILS, ":</span></h4><div class='hvr'><dl class='dx-det'><dt><span>", i18n.DIAGNOSES_NAME, ":</span></dt><dd><span>", dxName, "</span></dd><dt><span>", i18n.ANNOTATED_DISPLAY, ":</span></dt><dd><span>", dxAnnot, "</span></dd><dt><span>", i18n.DIAGNOSES_DATE, ":</span></dt><dd><span>", diagDate, "</span></dd><dt><span>", i18n.RESPONSIBLE_PROVIDER_NAME, ":</span></dt><dd><span>", responProvider, "</span></dd><dt><span>", i18n.COMMENTS, ":</span></dt><dd><span>", comm, "</span></dd></dl></div>");
                }
                jsDxHTML.push("</div>")
                dxHTML = jsDxHTML.join("");
                countText = MP_Util.CreateTitleText(component, l);
                MP_Util.Doc.FinalizeComponent(dxHTML, component, countText);
            } 
            catch (err) {
                if (timerRenderComponent) {
                    timerRenderComponent.Abort();
                    timerRenderComponent = null;
                }
                throw (err);
            }
            finally {
                if (timerRenderComponent) 
                    timerRenderComponent.Stop();
            }
        }
    };
    function SortByDiagnosesName(a, b){
        var aName = (a.DISPLAY_AS != "" && a.DISPLAY_AS != null && a.DISPLAY_AS != a.NAME) ? a.DISPLAY_AS.toUpperCase() : a.NAME.toUpperCase();
        var bName = (b.DISPLAY_AS != "" && b.DISPLAY_AS != null && b.DISPLAY_AS != a.NAME) ? b.DISPLAY_AS.toUpperCase() : b.NAME.toUpperCase();
        
        if (aName < bName) 
            return -1;
        else if (aName > bName) 
            return 1;
        else 
            return 0;
    }
}();
/**
 * Project: mp_discharge_indicator_o1.js
 * Version 1.0.1
 * Released 12/8/2010
 * @author Megha Rao (MR018925)
 *         Randy Rogers (RR4690)
 */
var filePath = "";
var m_component;
function DischargeIndicatorComponentStyle(){
    this.initByNamespace("disch");
}

DischargeIndicatorComponentStyle.inherits(ComponentStyle);

function DischargeIndicatorComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new DischargeIndicatorComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.DISCHARGEINDICATOR.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.DISCHARGEINDICATOR.O1 - render component");
    DischargeIndicatorComponent.method("InsertData", function(){
        CERN_DISCH_INDICATOR_O1.GetDischargeIndicatorComponentTable(this);
    });
    DischargeIndicatorComponent.method("HandleSuccess", function(recordData){
        CERN_DISCH_INDICATOR_O1.RenderComponent(this, recordData);
    });
}

DischargeIndicatorComponent.inherits(MPageComponent);

var CERN_DISCH_INDICATOR_O1 = function(){
    return {
        GetDischargeIndicatorComponentTable: function(component){
            var criterion = component.getCriterion();
            var sendAr = [];
            var mpageName = component.getMPageName();
            sendAr.push("^MINE^", criterion.encntr_id + ".0", criterion.person_id + ".0", "^" + mpageName + "^");
            MP_Core.XMLCclRequestWrapper(component, "MP_DRD_GET_STATUS_IND", sendAr, true);
        },
        
        RenderComponent: function(component, recordData){
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
                m_component = component;
                var criterion = component.getCriterion();
                var encntrId = criterion.encntr_id;
                var personId = criterion.person_id;
                var providerId = criterion.provider_id;
                var inputMPAGENAME = component.getMPageName();
                var ar = [], sHTML = "", countText = "", headerString = [], dataRow = [];
                var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                var loc = component.getCriterion().static_content;
                filePath = loc;
                var widthClass = 0;
		var sectionLen = recordData.SECTIONS.length - 1 ; // because readiness component is also returned as a section parameter
		if (sectionLen > 0) {
			var numOfCOl = sectionLen+3;
			widthClass = 100 / numOfCOl;
		}
		else {
			widthClass = 100/1;
		}
                var dateTime = new Date();
                var estDate = "";
                estDate = recordData.EST_DC;
                if (estDate != "") {
                    dateTime.setISO8601(estDate);
                    estDate = dateTime.format("shortDate2");
                }
                ar.push("<div class='", MP_Util.GetContentClass(component, "1"), "'>");
                headerString.push("<table class='disch-table-hdr' ><tr class ='disch-tbl-hdr'><td class='pat-los' style='width: ", widthClass, "%'><span>", i18n.LOS, "</span></td><td class='pat-est-dc' style='width: ", widthClass, "%'><span>", i18n.ESTIMATED_DISCHARGE_DATE, "</span></td>")
                dataRow.push("<table class='disch-table' ><tr class ='test'>")
                dataRow.push("<td class='pat-los 'style='width: ", widthClass, "%'><span>", recordData.LOS, "</span></td><td class='pat-est-dc' style='width: ", widthClass, "%'><span>", estDate, "</span></td>")
               	
                for (var c = 0; c < sectionLen ; c++) {
                    var imgID = "img" + c;
                    var comp = recordData.SECTIONS[c];
                    var newIndVal = -1;
                    var updtInd = false;
                    var compName = "";
                    var flg = 0;
                    flg = comp.STATUS_FLAG;
					
                    //STATUS_FLAG values:
                    //  Manual:
                    //    0 - Not Started (not possible to have Not Started manual status)
                    //    1 - Complete
                    //    2 - In Progress
                    //  System:
                    //    3 - Not Started
                    //    4 - Complete
                    //    5 - In Progress
					
                    if (comp.NAME == "mp_dc_pat_ed") {
                        compName = "PAT_ED"
                    }
                    else if (comp.NAME == "mp_dc_followup") {
                        compName = "FOLLOWUP"
                    }
                    else {
                        compName = comp.NAME;
                    }
                    if (comp.NAME == "mp_dc_results" || comp.NAME == "mp_dc_order" || comp.NAME == "mp_dc_med_rec" || comp.NAME == "mp_dc_care_mgmt" || comp.NAME == "mp_dc_qm") {
                        var tdClass = "disch-ind";
                    }
                    else {
                        var tdClass = "disch-pointer";
                    }
                    if (comp.NAME == "mp_dc_diagnosis" || comp.NAME == "mp_dc_followup" || comp.NAME == "mp_dc_pat_ed" || comp.NAME == "mp_dc_clin_doc" || comp.NAME == "mp_dc_social" || comp.NAME == "mp_dc_activities") {
                        if (flg == 4) {
                            updtInd = false;
                            newIndVal = -1;
                        }
                        if (flg == 3 || flg == 5 || flg == 2) {
                            updtInd = true;
                            newIndVal = 1;
                        }
                        if (flg == 1) {
                            updtInd = true;
                            newIndVal = 2;
                        }
                        headerString.push("<td class='", tdClass, "' style='width: " + widthClass + "%'><span>" + comp.LABEL + "</span></td>");
                        var icnStr = CERN_DISCH_INDICATOR_O1.GetIcon(flg, loc, imgID, newIndVal, compName, updtInd, encntrId, providerId); ////' onClick = 'SetScript(newIndVal,compName,updtInd)'		
                        dataRow.push("<td class='", tdClass, "' style='width: ", widthClass, "%'><span class= 'disch-img-span'>", icnStr, "</span></td>")
                    }
                    if (comp.NAME == "mp_dc_med_rec" || comp.NAME == "mp_dc_results" || comp.NAME == "mp_dc_order" || comp.NAME == "mp_dc_care_mgmt" || comp.NAME == "mp_dc_qm") {
	                    var icnStr = "";
                        if (comp.NAME == "mp_dc_med_rec" || comp.NAME == "mp_dc_order" || comp.NAME == "mp_dc_care_mgmt" || comp.NAME == "mp_dc_qm") {
                            icnStr = CERN_DISCH_INDICATOR_O1.GetIcon(flg, loc, imgID, newIndVal, compName, updtInd, encntrId, providerId);
                        }
                        else if (comp.NAME == "mp_dc_results") {
                            icnStr = CERN_DISCH_INDICATOR_O1.GetResultIcon(flg, loc, imgID);
                        }
                        headerString.push("<td class='", tdClass, "' style='width: " + widthClass + "%'><span>" + comp.LABEL + "</span></td>");
                        dataRow.push("<td class='", tdClass, "' style='width: " + widthClass + "%'><span>", icnStr, "</span></td>");
                    }
                }
                var hdrstring = "", dRow = "";
                headerString.push("</tr></table>")
                dataRow.push("</tr></table>")  
		// creating second row with the same umber of columns for the Review and Sign button

		var revRow = [];
		revRow.push ("<table class= 'disch-tbl-rev'><tr class= 'rev'>")
		revRow.push("<td class='pat-los 'style='width: ", widthClass, "%'><span>&nbsp;</span></td><td class='pat-est-dc' style='width: ", widthClass, "%'><span>&nbsp;</span></td>")

		for (var d = 0; d < sectionLen - 1; d++) {
			revRow.push ("<td style='width: " + widthClass + "%'><span>&nbsp;</span></td>")
		}
		
                revRow.push ("<td class='ind-button' style='width: " + widthClass + "%'><span><button type='btnR' onclick = 'javascript:CERN_DISCH_INDICATOR_O1.OpenDischargeProcess(" + encntrId + "," + personId + "," + providerId +")'>" + i18n.DC_REVIEWSIGN + "</button></span></td>")
				revRow.push("</tr></table>")

				hdrstring = headerString.join("");
                dRow = dataRow.join("");
				var rRow = revRow.join ("");
					
                ar.push(hdrstring, dRow,rRow, "</div>");
                sHTML = ar.join("");
                var countText = "&nbsp;";
			
                MP_Util.Doc.FinalizeComponent(sHTML, component, countText);
            } 
            catch (err) {
                if (timerRenderComponent) {
                    timerRenderComponent.Abort();
                    timerRenderComponent = null;
                }
                throw (err);
            }
            finally {
                if (timerRenderComponent) 
                    timerRenderComponent.Stop();
            }
        },
        
        SetScript: function(newIndVal, compName, updtInd, encntrId, providerId, imgID){
            if (updtInd) {
                var info = new XMLCclRequest();
                info.onreadystatechange = function(){
                    if (this.readyState == 4 && this.status == 200) {
                        var comp = filePath + "\\images\\3918_16.gif";
                        var ntStarted = filePath + "\\images\\5970_16.gif";
                        var inProg = filePath + "\\images\\5971_16.gif";
                        if (newIndVal == 2) {
                            var resetIndVal = 1;                         
                            var img = document.getElementById(imgID)
                            img.onclick = function(){
                                javascript: CERN_DISCH_INDICATOR_O1.SetScript(resetIndVal, compName, updtInd, encntrId, providerId, imgID)						
                            };
                        }
                        if (newIndVal == 1) {
                            var resetIndVal = 2;
                            document[imgID].src = comp;
                            document[imgID].title = i18n.DC_COMPLETE;
                            var img = document.getElementById(imgID)
                            img.onclick = function(){
                                javascript: CERN_DISCH_INDICATOR_O1.SetScript(resetIndVal, compName, updtInd, encntrId, providerId, imgID);																	
                            };
                        }
                    }
                    if (this.readyState == 4) {
                        m_component.InsertData();	
                        MP_Util.ReleaseRequestReference(this);
                    }
                    
                }
                var sendVal = [];
                info.open('GET', "mp_drd_set_status_ind");
                sendVal.push("^MINE^", encntrId + ".0", providerId + ".0", "^" + compName + "^", newIndVal)
                info.send(sendVal.join(","));
				
                return;
            }
        },
        GetResultIcon: function(stat, loc, imgID){
            var imgLnk = "";
            var comp = loc + "\\images\\5278.gif";
            var crit = loc + "\\images\\6272_16.gif";
            if (stat == 3) {
                imgLnk = "--"
                return imgLnk;
            }
            else if (stat == 4) {
                imgLnk = "<img id='" + imgID + "' src='" + comp + "' />"
                return imgLnk;
            }
            else if (stat == 5) {
                imgLnk = "<img id='" + imgID + "' src='" + crit + "' />"
                return imgLnk;
            }
        },
        GetIcon: function(stat, loc, imgID, newIndVal, compName, updtInd, encntrId, providerId){
            var comp = loc + "\\images\\3918_16.gif";
            var ntStarted = loc + "\\images\\5970_16.gif";
            var inProg = loc + "\\images\\5971_16.gif";
            var imgLnk = "";
            
            if (stat == 0 || stat == 3) {
                imgLnk = "<img id='" + imgID + "' onClick =javascript:CERN_DISCH_INDICATOR_O1.SetScript(" + newIndVal + ",'" + compName + "'," + updtInd + "," + encntrId + "," + providerId + ",'" + imgID + "') name='" + imgID + "' title='" + i18n.DC_NOT_STARTED + "'src='" + ntStarted + "' />"
                return imgLnk;
            }
            else if (stat == 1 || stat == 4) {
                imgLnk = "<img id='" + imgID + "'  onClick =javascript:CERN_DISCH_INDICATOR_O1.SetScript(" + newIndVal + ",'" + compName + "'," + updtInd + "," + encntrId + "," + providerId + ",'" + imgID + "')  name = '" + imgID + "' title='" + i18n.DC_COMPLETE + "'src='" + comp + "' />"
                return imgLnk;
            }
            else if (stat == 2 || stat == 5) {
                imgLnk = "<img id='" + imgID + "'  onClick =javascript:CERN_DISCH_INDICATOR_O1.SetScript(" + newIndVal + ",'" + compName + "'," + updtInd + "," + encntrId + "," + providerId + ",'" + imgID + "') name = '" + imgID + "' title='" + i18n.DC_IN_PROGRESS + "'src='" + inProg + "' />"
                return imgLnk;
            }
            else {
                imgLnk = "<img id='" + imgID + "'  onClick =javascript:CERN_DISCH_INDICATOR_O1.SetScript(" + newIndVal + ",'" + compName + "'," + updtInd + "," + encntrId + "," + providerId + ",'" + imgID + "') name = '" + imgID + "' title='" + i18n.DC_NOT_STARTED + "'src='" + ntStarted + "' />"
                return imgLnk;
            }
        },
		OpenDischargeProcess :function (encntrId, personId, userId){
           //var js_criterion = JSON.parse(m_criterionJSON);
           //var criterion = MP_Util.GetCriterion(js_criterion);
			var dpObject = new Object(); 
            dpObject = window.external.DiscernObjectFactory("DISCHARGEPROCESS");
            //dpObject.Window = window;
            dpObject.person_id = personId;
            dpObject.encounter_id = encntrId;			
            dpObject.user_id = userId;
			dpObject.LaunchDischargeDialog();
		
		}
        
        
    };
}();
/**
 * Project: mp_disch_orders_o1.js
 * Version 1.0.1
 * Released 12/8/2010
 * @author Megha Rao
 * @author Randy Rogers
 */
 
function DischargeOrdersComponentStyle()
{
	this.initByNamespace("dishord");
}
DischargeOrdersComponentStyle.inherits(ComponentStyle);

function DischargeOrdersComponent(criterion){
	this.setCriterion(criterion);
	this.setStyles(new DischargeOrdersComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.DISCH_ORDERS.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.DISCH_ORDERS.O1 - render component");
	this.setIncludeLineNumber(true);
	this.setScope(2);
	
	DischargeOrdersComponent.method("InsertData", function(){
		CERN_DISCH_ORDERS_O1.GetOrdersTable(this);
	});
	DischargeOrdersComponent.method("HandleSuccess", function(recordData){
		CERN_DISCH_ORDERS_O1.RenderComponent(this, recordData);
		 
	});
	DischargeOrdersComponent.method("setCatalogCodes", function(value){
		this.m_catalogCodes = value;
	});
	DischargeOrdersComponent.method("addCatalogCode", function(value){
		if(this.m_catalogCodes == null)
			this.m_catalogCodes = new Array();
		this.m_catalogCodes.push(value);		
	});
	DischargeOrdersComponent.method("getCatalogCodes", function(){
		if (this.m_catalogCodes != null)
			return this.m_catalogCodes;

		return this.m_catalogCodes;
	});
		
	DischargeOrdersComponent.method("openTab", function(){
		var criterion = this.getCriterion();
		
		var params = [criterion.person_id, ".0|", criterion.encntr_id, ".0|"];
		params.push("{ORDER|0|0|0|0|0}"); 
		params.push("|0|{2|127}|8");  
		MPAGES_EVENT("ORDERS", params.join(""));
		
		this.InsertData();
	});
	
}
DischargeOrdersComponent.inherits(MPageComponent);

var CERN_DISCH_ORDERS_O1 = function(){
    return {
        GetOrdersTable : function(component){
			var sendAr = [];
			var criterion = component.getCriterion();
			sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0");
			var codes = component.getCatalogCodes(); 
			var catCd = (codes != null && codes.length > 0) ? codes : null;
			if (catCd != null)
				sendAr.push("value(" + catCd.join(",") + ")");
			else
				sendAr.push("0");
		
			MP_Core.XMLCclRequestWrapper(component, "MP_GET_DISCH_ORDERS", sendAr, true);
        },
        RenderComponent: function(component, recordData){
			var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
			try{
				var countText = "";
				var ordHTML = "",  jsORDHTML = [];
                var jsOrdSec = [];
                var jsDiscSec = [];
                var discCount = 0;
                var ordCount = 0;
				var isPlusAddEnabled  =component.isPlusAddEnabled()
                tableBody = [], ordItem = [];
				if (recordData.ORDERS.length ==0){	
					ordItem.push(i18n.NO_RESULTS_FOUND);
					ordHTML = ordItem.join("");
					countText = "(0)";	
				}
				
				else {
					var ordLen = recordData.ORDERS.length;
					recordData.ORDERS.sort(OrderDateSort);
		
					for (var j=0;j<ordLen;j++) {
						var orders = recordData.ORDERS[j];
						var ordName = "", ordDate = "", statusTypeDisp = "", orderDetails = "";
						ordItem = [];
						var dateTime = new Date();
						if (orders != null) 
						{
							dateTime.setISO8601(orders.ORIG_ORDER_DT_TM);
							ordDate = dateTime.format("longDateTime3");
							
							statusTypeDisp = orders.ORDER_STATUS
							orderDetails = orders.ORDER_DETAIL
						}
						
						if (orders.ORDER_DISPLAY != null) {
							ordName = orders.ORDER_DISPLAY;
						}
	
						ordItem.push("<dl class='dishord-info'><dd class= 'dishord-name'>", ordName,"</dd></dl><h4 class='dishord-det-hd'><span>", 
							"</span></h4><div class='hvr'><dl class='dishord-det'><dt><span>", 
							i18n.ORDER_NAME, ":</span></dt><dd class='dishord-det-dt'><span>", ordName, "</span></dd><dt><span>", 
							i18n.ORDER_DETAILS, ":</span></dt><dd class='dishord-det-dt'><span>", orderDetails, "</span></dd><dt><span>",
							i18n.ORDER_DATE, ":</span></dt><dd class='dishord-det-dt'><span>", ordDate, "</span></dd><dt><span>", 
							i18n.ORDER_STATUS, ":</span></dt><dd class='dishord-det-dt'><span>", statusTypeDisp, "</span></dd></dl></div>");
						
							jsOrdSec = jsOrdSec.concat(ordItem);
							ordCount++;
					}
					jsORDHTML.push(jsOrdSec.join(""), "</span></div></div></div>");
					tableBody = tableBody.concat(jsORDHTML);
					ordHTML = tableBody.join("")
				
				    countText = "("+ (ordLen) + ")";
				}

				var compNS = component.getStyles().getNameSpace();
                MP_Util.Doc.FinalizeComponent(ordHTML, component, countText);
				if (component.isPlusAddEnabled()) {
                    appendDropDown(compNS, component, recordData, component.getCriterion().static_content);
                }
			}
            catch (err) {
                if (timerRenderComponent){
					timerRenderComponent.Abort();
					timerRenderComponent = null;
				}
                throw (err);
            }
            finally {
                if (timerRenderComponent) 
                    timerRenderComponent.Stop();
            }
        }
    };
    function OrderDateSort(a, b){
        if (a.ORIG_ORDER_DT_TM > b.ORIG_ORDER_DT_TM) 
            return -1;
        else if (a.ORIG_ORDER_DT_TM < b.ORIG_ORDER_DT_TM) 
            return 1;
        else 
            return 0;
    }
	
	function appendDropDown(preSec, component, recdata, contentPath) {
        if (preSec != "dishord") {
            return;
        }
        pre = component.getStyles().getId();
        if ((_g(pre + "Drop") != null) && _g(pre + "Menu") != null) {
            return; //already defined
        }
        var img = Util.cep("img", { 'src': contentPath + '\\images\\3943_16.gif' });
        var link = Util.cep("a", { 'className': 'drop-Down', 'id': pre + 'Drop' });
        var menu = Util.cep("div", { 'id': pre + 'Menu', 'className': 'form-menu menu-hide' })
        Util.ac(img, link);
        var sec = _g(component.getStyles().getId());

        var secCL = Util.Style.g("sec-title", sec, "span");
        var secSpan = secCL[0]; 
        Util.ac(link, secSpan);
        Util.ac(menu, secSpan);
        LoadDropDown(recdata, component);
    };
	
	
    function LoadDropDown(recdata, component) {
        try {
            var jsonRecdata = recdata; 
        }
        catch (err) {
            alert(err.description);
        }
        var docDropId = component.getStyles().getId() + "Drop";
        var docDrop = _g(docDropId); 
        var htmlStr = [];
        var numId = 0;
        var ordRec = jsonRecdata.DISCH_ORDERABLES; 

        if (ordRec[0] === null) {
            htmlStr.push('<div>', i18n.DOCUMENT_FAVS, '<span class="favHidden" id="docCKI', numId, '">', ' ', '</span></div>');
        }
        else {
            var crit = component.getCriterion();
            for (var j = 0, l = ordRec.length; j < l; j++) {
                var rec = ordRec[j];
                
                numId = numId + 1;
                htmlStr.push('<div><a id="doc', numId, '" href="#">', rec.ORDER_DISPLAY, '</a>',  //disp
					'<span class="favHidden" id="docCKI', numId, '">', rec.SYNONYM_ID, '</span>', //store synonym_id to be used later to default order to scratchpad
					'<span class="favHidden" id="docStyleID', numId, '">', component.getStyles().getId(), '</span>',
					'</div>');
            }
        }
		
        var ddarray = htmlStr.join('');
        var newSpan = Util.cep('span');
        newSpan.innerHTML = ddarray;
        var docMenuId = component.getStyles().getId() + "Menu";
        var docMenu = _g(docMenuId);
        Util.ac(newSpan, docMenu);

        //doc more add options
        var docMenuList = _gbt('a', docMenu);
        var dmLen = docMenuList.length;
        for (var i = dmLen; i--; ) {
            Util.addEvent(docMenuList[i], "click", addDocDet);
        }
        //set up menu close
        closeMenuInit(docMenu, component.getStyles().getId());
        //set up doc flyout menu
        Util.addEvent(docDrop, "click",
			function() {
			    if (Util.Style.ccss(Util.gns(this), "menu-hide")) {
			        _g(component.getStyles().getId()).style.zIndex = 2; //'doc'
			        Util.preventDefault();
			        Util.Style.rcss(Util.gns(this), "menu-hide");
			    }
			    else {
			        _g(component.getStyles().getId()).style.zIndex = 1; //'doc'
			        Util.Style.acss(Util.gns(this), "menu-hide");
			    }

			}
		);
    }

    function addDocDet() {
		
        var menuVal = Util.gns(this); 
        var synonymId = menuVal.firstChild.data;
        var spanDocStyleID = Util.gns(menuVal); 
        //get the exact component from global array
        for (var x = 0, xl = CERN_MPageComponents.length; x < xl; x++) {
            var comp = CERN_MPageComponents[x];
		    var styles = comp.getStyles();
            if (styles.getId() == spanDocStyleID.firstChild.data) {
                break;
            }
        }
        var crit = comp.getCriterion();
		
		var params = [crit.person_id, ".0|", crit.encntr_id, ".0|"];
		params.push("{ORDER|" + synonymId + "|0|0|0|0}"); 
		params.push("|0|{2|127}|32");
		MPAGES_EVENT("ORDERS", params.join(""));
		
        CERN_DISCH_ORDERS_O1.GetOrdersTable(comp);
    }

    function closeMenuInit(inMenu, compId) {
        var menuId;
        var docMenuId = compId + "Menu";
        if (inMenu.id == docMenuId) {
            menuId = compId;
        }
        if (!e) var e = window.event;
        if (window.attachEvent) {
            Util.addEvent(inMenu, "mouseleave", function() {
                Util.Style.acss(inMenu, "menu-hide");
                _g(menuId).style.zIndex = 1;
            });
        }
        else {
            Util.addEvent(inMenu, "mouseout", menuLeave);
        }
		
        function menuLeave(e) {
            if (!e) var e = window.event;
            var relTarg = e.relatedTarget || e.toElement;
            if (e.relatedTarget.id == inMenu.id) {
                Util.Style.acss(inMenu, "menu-hide");
                _g(menuId).style.zIndex = 1;
            }
            e.stopPropagation();
            Util.cancelBubble(e);
        }
    }	
}();



/**
 * Project: mp_documents_base_o1.js
 * Version 1.0.1
 * Released 9/20/2010
 * @author Greg Howdeshell (GH7199)
 * @author Manas Wadke (MW016312)
 * @author Subash Katageri (SK018948)
 * @author Anantha Ramu (AR018249)
 *
 * The Document Base Component is to allow for other 'document' based components to share the same
 * look and feel without having to duplicate the logic for retrieval of documents.
 */
function DocumentBaseComponent(){
    this.m_resultStatusCodes = null;
    //meanings is used to allow loading of the status codes
    //when needed aka 'lazy loading'.  Hence why the retrieval of
    //meanings is not exposed to the consumer.  Only retrieval of codes
    //is available.
    this.m_resultStatusMeanings = null;
    this.m_includeHover = true;
    
    this.setIncludeLineNumber(true);
    
    DocumentBaseComponent.method("InsertData", function(){
        CERN_DOCUMENT_BASE_O1.GetDocumentsTable(this);
    });
    DocumentBaseComponent.method("setResultStatusCodes", function(value){
        this.m_resultStatusCodes = value;
    });
    DocumentBaseComponent.method("addResultStatusCode", function(value){
        if (this.m_resultStatusCodes == null) 
            this.m_resultStatusCodes = new Array();
        this.m_resultStatusCodes.push(value);
    });
    DocumentBaseComponent.method("getResultStatusCodes", function(){
        if (this.m_resultStatusCodes != null) 
            return this.m_resultStatusCodes;
        else if (this.m_resultStatusMeanings != null) {
            //load up codes from meanings
            var resStatusCodeSet = MP_Util.GetCodeSet(8, false);
			if (this.m_resultStatusMeanings && this.m_resultStatusMeanings.length > 0) {
				for (var x = this.m_resultStatusMeanings.length; x--;) {
					var code = MP_Util.GetCodeByMeaning(resStatusCodeSet, this.m_resultStatusMeanings[x]);
					if (code != null) 
						this.addResultStatusCode(code.codeValue);
				}
			}
        }
        return this.m_resultStatusCodes;
    });
    DocumentBaseComponent.method("addResultStatusMeaning", function(value){
        if (this.m_resultStatusMeanings == null) 
            this.m_resultStatusMeanings = new Array();
        this.m_resultStatusMeanings.push(value);
    });
    DocumentBaseComponent.method("setResultStatusMeanings", function(value){
        this.m_resultStatusMeanings = value;
    });
    DocumentBaseComponent.method("isHoverEnabled", function(){
        return this.m_includeHover;
    })
    DocumentBaseComponent.method("setHoverEnabled", function(value){
        this.m_includeHover = value;
    })
    DocumentBaseComponent.method("HandleSuccess", function(recordData){
        CERN_DOCUMENT_BASE_O1.RenderComponent(this, recordData);
    });
}

DocumentBaseComponent.inherits(MPageComponent);

/**
 * Base Document methods
 * @namespace CERN_DOCUMENT_BASE_O1
 * @static
 * @global
 */
var CERN_DOCUMENT_BASE_O1 = function(){
    return {
        GetDocumentsTable: function(component){
            var sendAr = [];
            var criterion = component.getCriterion();
            var groups = component.getGroups();
            var codes = component.getResultStatusCodes();
            var events = (groups != null && groups.length > 0) ? groups[0].getEventSets() : null;
            var results = (codes != null && codes.length > 0) ? codes : null;
            
            var encntrOption = (component.getScope() == 2) ? (criterion.encntr_id + ".0") : "0.0";
            sendAr.push("^MINE^", criterion.person_id + ".0", encntrOption, criterion.provider_id + ".0", component.getLookbackUnits());
            if (events != null) 
                sendAr.push("value(" + events.join(",") + ")");
            else 
                sendAr.push("0.0");
            
            if (results != null) 
                sendAr.push("value(" + results.join(",") + ")");
            else 
                sendAr.push("0.0");
            var unitType = component.getLookbackUnitTypeFlag();
            sendAr.push(criterion.position_cd + ".0", criterion.ppr_cd + ".0", unitType)
            MP_Core.XMLCclRequestWrapper(component, "MP_GET_DOCUMENTS", sendAr, true);
        },
        RenderComponent: function(component, recordData){
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
                var sHTML = "", countText = "";
                var jsHTML = [];
                var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
                
                var compNS = component.getStyles().getNameSpace();
                
                jsHTML.push("<div class='content-hdr'><dl class='", compNS, "-info-hdr'><dd class='", compNS + "-cat-hd'><span></span></dd>");
                jsHTML.push("<dd class='", compNS, "-auth-hd'><span>", i18n.AUTHOR, "</span></dd>");
                
                if (PathologyComponent && (component instanceof PathologyComponent)) {
                    jsHTML.push("<dd class='", compNS, "-dt-hd'><span>", i18n.DATE, "</span></dd>");
                }
                else {
                    jsHTML.push("<dd class='", compNS, "-dt-hd'><span>", i18n.DATE_TIME, "</span></dd>");
                }
                if (component.getDateFormat() == 3) {////1 = date only,2= date/time and 3 = elapsed time
                    jsHTML.push("<dd class='", compNS + "-cat-hd'><span></span></dd><dd class='", compNS, "-auth-hd'><span></span></dd><dd class='", compNS, "-dt-hd'><span>", i18n.WITHIN, "</span></dd>");
                }
                jsHTML.push("</dl></div>");
                /*				else {
                 jsHTML.push("<dd class='", compNS, "-dt-hd'><span>", i18n.DATE_TIME, "</span></dd></dl></div>");
                 }
                 */
                recordData.DOCS.sort(DocumentSorter);
                
                jsHTML.push("<div class='", MP_Util.GetContentClass(component, recordData.DOCS.length), "'>");
                for (var x = 0, xl = recordData.DOCS.length; x<xl;x++) {
                    var dt = "", dtHvr = "", withinDate = "", author = "", lastPrsnl = "";
                    var document = recordData.DOCS[x];
                    var patId = document.PERSON_ID;
                    var enctrId = document.ENCNTR_ID;
                    var evntId = document.EVENT_ID;
                    var doc = MP_Util.GetValueFromArray(document.EVENT_CD, codeArray);
                    
                    //info related to participation
                    var recentPart = GetLatestParticipation(document);
                    var authorPart = GetAuthorParticipant(document, codeArray);
                    
                    if (authorPart != null) 
                        author = MP_Util.GetValueFromArray(authorPart.PRSNL_ID, personnelArray).fullName;
                    else 
                        author = i18n.UNKNOWN;
                    
                    if (recentPart && recentPart.PRSNL_ID > 0) {
                        lastPrsnl = MP_Util.GetValueFromArray(recentPart.PRSNL_ID, personnelArray).fullName;
                        var dtTm = new Date();
                        if (recentPart.EVENT_DT_TM != "") {
                            dtTm.setISO8601(recentPart.EVENT_DT_TM);
                            dt = MP_Util.DisplayDateByOption(component, dtTm); //dtTm.format("longDateTime2")
                            dtHvr = dtTm.format("longDateTime3")
                            withinDate = MP_Util.CalcWithinTime(dtTm);
                        }
                        else {
                            dt = i18n.UNKNOWN;
                            withinDate = i18n.UNKNOWN;
                        }
                    }
                    else {
                        lastPrsnl = i18n.UNKNOWN;
                        dt = i18n.UNKNOWN;
                        withinDate = i18n.UNKNOWN;
                    }
                    
                    
                    jsHTML.push("<dl class='", compNS, "-info'><dd class='", compNS + "-cat'><span>", doc.display, "</span></dd>");
                    jsHTML.push("<dd class='", compNS, "-auth'><span>", author, "</span></dd>");
                    if (component.getDateFormat() == 3) {//1 = date only,2= date/time and 3 = elapsed time
                        jsHTML.push("<dd class='", compNS, "-dt'><span>", MP_Util.CreateClinNoteLink(patId, enctrId, evntId, withinDate), "</span></dd></dl>");
                    }
                    else {
                        jsHTML.push("<dd class='", compNS, "-dt'><span>", MP_Util.CreateClinNoteLink(patId, enctrId, evntId, dt), "</span></dd></dl>");
                    }
                    
                    //Build the hover
                    if (component.isHoverEnabled()) {
                        jsHTML.push("<h4 class='", compNS, "-det-hd'><span>", i18n.DOCUMENTATION_DETAILS, "</span></h4><div class='hvr'><dl class='", compNS, "-det'><dt><span>", i18n.NAME, ":</span></dt><dd class='", compNS, "-det-name'><span>", doc.display, "</span></dd><dt><span>", i18n.SUBJECT, ":</span></dt><dd class='", compNS, "-det-subj'><span>", document.SUBJECT, "</span></dd><dt><span>", i18n.STATUS, ":</span></dt><dd class='", compNS, "-det-status'><span>", MP_Util.GetValueFromArray(document.RESULT_STATUS_CD, codeArray).display, "</span></dd><dt><span>", i18n.LAST_UPDATED, ":</span></dt><dd class='", compNS, "-det-dt'><span>", dtHvr, "</span></dd><dt><span>", i18n.LAST_UPDATED_BY, ":</span></dt><dd class='", compNS, "-det-dt'><span>", lastPrsnl, "</span></dd></dl></div>");
                    }
                }
                jsHTML.push("</div>");
                sHTML = jsHTML.join("");
                countText = MP_Util.CreateTitleText(component, recordData.DOCS.length);
                MP_Util.Doc.FinalizeComponent(sHTML, component, countText);
                //add dropdown
                if (component.isPlusAddEnabled()) {
                    appendDropDown(compNS, component, recordData, component.getCriterion().static_content);
                }
                if (component.isScrollingEnabled() && (recordData.DOCS.length >= component.getScrollNumber())) {
                    //scrollable
                    var xNode = Util.Style.g("doc-info-hdr", document.body, "DL");
                    if (xNode[0]) {
                        Util.Style.acss(xNode[0], "doc-info-hdr-scroll");
                    }
                }
                
            } 
            catch (err) {
                if (timerRenderComponent) {
                    timerRenderComponent.Abort();
                    timerRenderComponent = null;
                }
                throw (err);
            }
            finally {
                if (timerRenderComponent) 
                    timerRenderComponent.Stop();
            }
        }
    };
    function GetLatestParticipation(doc){
        var returnPart = null;
        for (var x = doc.PARTICIPANTS.length; x--;) {
            var part = doc.PARTICIPANTS[x];
            if (returnPart == null || part.EVENT_DT_TM > returnPart.EVENT_DT_TM) {
                returnPart = part;
            }
        }
        for (var y = doc.CONTRIBUTORS.length; y--;) {
            var contrib = doc.CONTRIBUTORS[y];
            for (var z = contrib.PARTICIPANTS.length; z--;) {
                var part = contrib.PARTICIPANTS[z];
                if (returnPart == null || part.EVENT_DT_TM > returnPart.EVENT_DT_TM) {
                    returnPart = part;
                }
            }
        }
        return (returnPart);
    };
    
    function DocumentSorter(a, b){
        var aPart = GetLatestParticipation(a);
        var bPart = GetLatestParticipation(b);
        if (aPart) 
            var aDate = aPart.EVENT_DT_TM;
        if (bPart) 
            var bDate = bPart.EVENT_DT_TM;
        
        if (aDate > bDate) 
            return -1;
        else if (aDate < bDate) 
            return 1;
        else 
            return 0;
    };
    
    function GetAuthorParticipant(doc, codeArray){
        //the author of a document, according to doc services, will be on the Contribution object.  It’s the PERFORM action in the participation list.
        var returnPart = null;
        for (var y = doc.CONTRIBUTORS.length; y--;) {
            var contrib = doc.CONTRIBUTORS[y];
            for (var z = contrib.PARTICIPANTS.length; z--;) {
                var part = contrib.PARTICIPANTS[z];
                var code = MP_Util.GetValueFromArray(part.TYPE_CD, codeArray);
                if (code != null && code.meaning == "PERFORM") {
                    returnPart = part;
                    break;
                }
            }
        }
        return (returnPart);
    }
    
    
    //below are the functions for favourites
    function appendDropDown(preSec, component, epFav, contentPath){
        if (preSec != "doc") {
            return;
        }
        pre = component.getStyles().getId();
        if ((_g(pre + "Drop") != null) && _g(pre + "Menu") != null) {
            return; //already defined
        }
        var img = Util.cep("img", {
            'src': contentPath + '\\images\\3943_16.gif'
        });
        var link = Util.cep("a", {
            'className': 'drop-Down',
            'id': pre + 'Drop'
        });
        var menu = Util.cep("div", {
            'id': pre + 'Menu',
            'className': 'form-menu menu-hide'
        })
        Util.ac(img, link);
        var sec = _g(component.getStyles().getId());
        
        var secCL = Util.Style.g("sec-title", sec, "span");
        var secSpan = secCL[0]; //Util.gc(secCL[0]);
        Util.ac(link, secSpan);
        Util.ac(menu, secSpan);
        epathLoad(epFav, component);
    };
    
    function epathLoad(epFav, component){
        //load documents
        try {
            var jsonEpFav = epFav; // JSON.parse(msgEP);
        } 
        catch (err) {
            alert(err.description);
        }
        
        var docDropId = component.getStyles().getId() + "Drop";
        var docDrop = _g(docDropId); //d1 "docDrop"
        var htmlEpFav = [];
        var numId = 0;
        var ep = jsonEpFav.FAVORITES;
        ep.sort(function(obj1, obj2){
            function checkStrings(s1, s2){
                return (s1 === s2) ? 0 : ((s1 > s2) ? 1 : -1);
            }
            //return checkStrings(obj1.pathway.Display.toUpperCase(), obj2.pathway.Display.toUpperCase());
            return checkStrings(obj1.DISPLAY.toUpperCase(), obj2.DISPLAY.toUpperCase());
        });
        
        if (ep[0] === null) {
            htmlEpFav.push('<div>', i18n.DOCUMENT_FAVS, '<span class="favHidden" id="docCKI', numId, '">', ' ', '</span></div>');
        }
        else {
            var crit = component.getCriterion(); //person_id
            for (var j = 0, l = ep.length; j < l; j++) {
                var epPathway = ep[j];
                numId = numId + 1;
                htmlEpFav.push('<div><a id="doc', numId, '" href="#">', epPathway.DISPLAY, '</a>', '<span class="favHidden" id="docCKI', numId, '">', epPathway.SOURCE_IDENTIFIER, '</span>', '<span class="favHidden" id="docStyleID', numId, '">', component.getStyles().getId(), '</span>', '</div>');
            }
        }
        
        var eparray = htmlEpFav.join('');
        var newSpan = Util.cep('span');
        newSpan.innerHTML = eparray;
        var docMenuId = component.getStyles().getId() + "Menu";
        var docMenu = _g(docMenuId); //m1 "docMenu"
        Util.ac(newSpan, docMenu);
        
        //doc more add options
        var docMenuList = _gbt('a', docMenu);
        var dmLen = docMenuList.length;
        for (var i = dmLen; i--;) {
            Util.addEvent(docMenuList[i], "click", addDocDet); //docMenuList[i], component
        }
        //set up menu close
        closeMenuInit(docMenu, component.getStyles().getId());
        //set up doc flyout menu
        Util.addEvent(docDrop, "click", function(){
            if (Util.Style.ccss(Util.gns(this), "menu-hide")) {
                _g(component.getStyles().getId()).style.zIndex = 2; //'doc'
                Util.preventDefault();
                Util.Style.rcss(Util.gns(this), "menu-hide");
            }
            else {
                _g(component.getStyles().getId()).style.zIndex = 1; //'doc'
                Util.Style.acss(Util.gns(this), "menu-hide");
            }
            
        });
    }
    //end epath load
    
    //function addDocDet(docCKINode, component) {
    function addDocDet(){
        var menuVal = Util.gns(this); //docCKINode
        var cki = menuVal.firstChild.data;
        var spanDocStyleID = Util.gns(menuVal); //spanEntrID
        //get the exact component from global array
        for (var x = 0, xl = CERN_MPageComponents.length; x < xl; x++) {
            var comp = CERN_MPageComponents[x];
            var styles = comp.getStyles();
            if (styles.getId() == spanDocStyleID.firstChild.data) {
                break; //found
            }
        }
        var crit = comp.getCriterion();
        var paramString = crit.person_id + "|" + crit.encntr_id + "|" + cki + "|0.0";
        javascript: MPAGES_EVENT("POWERNOTE", paramString); //uncomment these two and comment alert
        CERN_DOCUMENT_BASE_O1.GetDocumentsTable(comp);
    } //end addDocDet
    function closeMenuInit(inMenu, compId){
        var menuId;
        var docMenuId = compId + "Menu";
        if (inMenu.id == docMenuId) {//m2 'docMenu'
            menuId = compId;
        }
        if (!e) 
            var e = window.event;
        if (window.attachEvent) {
            Util.addEvent(inMenu, "mouseleave", function(){
                Util.Style.acss(inMenu, "menu-hide");
                _g(menuId).style.zIndex = 1;
            });
        }
        else {
            Util.addEvent(inMenu, "mouseout", menuLeave);
        }
        
        function menuLeave(e){
            if (!e) 
                var e = window.event;
            var relTarg = e.relatedTarget || e.toElement;
            if (e.relatedTarget.id == inMenu.id) {
                Util.Style.acss(inMenu, "menu-hide");
                _g(menuId).style.zIndex = 1;
            }
            e.stopPropagation();
            Util.cancelBubble(e);
        }
    }
}();
/**
 * Project: mp_documents_o1.js
 * Version 1.0.0
 * Released 7/26/2010
 * @author Greg Howdeshell (GH7199)
 * @dependency http://scm.discern-abu.cerner.corp/svn/standardized-components/tags/documents-base-o1-1.0.0
 */
function DocumentComponentStyle(){
    this.initByNamespace("doc");
}

DocumentComponentStyle.inherits(ComponentStyle);

/**
 * The Document component will retrieve all documents associated to the encounter for the specified lookback days defined by the component.
 * @param {Criterion} criterion
 * @dependency @see DocumentBaseComponent
 */
function DocumentComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new DocumentComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.DOCUMENTS.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.DOCUMENTS.O1 - render component");
    
    DocumentComponent.method("openTab", function(){
        var criterion = this.getCriterion();
        var sParms = '/PERSONID=' + criterion.person_id + ' /ENCNTRID=' + criterion.encntr_id + ' /FIRSTTAB=^' + this.getLink() + '+^';
        APPLINK(0, criterion.executable, sParms);
        this.InsertData();
    });
}

DocumentComponent.inherits(DocumentBaseComponent);
/**
 * Project: mp_follow_up_o1.js
 * Version 1.0.1
 * Released 12/13/2010
 * @author Megha Rao (MR018925)
 */
function FollowUpComponentStyle(){
    this.initByNamespace("fu");
}

FollowUpComponentStyle.inherits(ComponentStyle);

/**
 * The follow up component will retrieve all follow up details associated to the patient
 *
 * @param {Criterion} criterion
 */
function FollowUpComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new FollowUpComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.FOLLOWUP.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.FOLLOWUP.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
    FollowUpComponent.method("openTab", function(){
        var criterion = this.getCriterion();
        var fuObject = new Object();
        fuObject = window.external.DiscernObjectFactory("PATIENTEDUCATION");
        var personId = criterion.person_id
        var encntrId = criterion.encntr_id
        fuObject.SetPatient(personId, encntrId);
        fuObject.SetDefaultTab(1); //Followup
        fuObject.DoModal();
        this.InsertData();
    });
    
    FollowUpComponent.method("InsertData", function(){
        CERN_FOLLOWUP_O1.GetFollowUpTable(this);
    });
    FollowUpComponent.method("HandleSuccess", function(recordData){
        CERN_FOLLOWUP_O1.RenderComponent(this, recordData);
    });
}

FollowUpComponent.inherits(MPageComponent);

/**
 * @namespace
 * @static
 * @global
 * @dependencies Script:
 */
var CERN_FOLLOWUP_O1 = function(){
    return {
        GetFollowUpTable: function(component){
        
            var criterion = component.getCriterion();
            var sendAr = [];
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0")
            
            MP_Core.XMLCclRequestWrapper(component, "mp_get_followup", sendAr, true);
        },
        
        RenderComponent: function(component, recordData){
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
                var sHTML = "", countText = "", jsHTML = [];
                var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                var dateTime = new Date();
                jsHTML.push("<div class='", MP_Util.GetContentClass(component, recordData.FOLLOW_UP.length), "'>");
                for (var i = 0, l = recordData.FOLLOW_UP.length; i < l; i++) {
                    var events = recordData.FOLLOW_UP[i];
                    if (events.DISPLAY != "") {
                        var rep = "^"
                        var address = "";
                        address = events.PROVIDERADDRESS;
                        var myNewAddress = address.replace(/\^/gi, ",")
                        var newnewad = myNewAddress.replace(/\;/gi, "<br/>")
                        jsHTML.push("<h3 class='fu-info-hd'><span>", events.NAME, "</span></h3><dl class='fu-info'><dt><span>", events.PROVIDERNAME, "</span></dt><dd class = 'fu-name'><span>", events.PROVIDERNAME, "</span></dd><dd class='fu-ph'><span>", events.PROVIDERPHONE, "</span></dd><dt><span>Range:</span></dt><dd class='fu-range'><span>", events.FOLLOWUPRANGE, "</span></dd></dl>");
                        jsHTML.push("<h4 class='fu-det-hd'><span>", "</span></h4><div class='hvr'><dl class='ord-det'><dt><span>", i18n.FU_NAME, "</span></dt><dd class='ord-det-dt'><span>", events.PROVIDERNAME, "</span></dd><dt><span>", i18n.FU_ADDRESS, "</span></dt><dd class='ord-det-dt'><span>", newnewad, "</span></dd></dl></div>")
                    }
                }
                jsHTML.push("</div>")
                countText = MP_Util.CreateTitleText(component, recordData.FOLLOW_UP.length);
                sHTML = jsHTML.join("");
                MP_Util.Doc.FinalizeComponent(sHTML, component, countText);
            } 
            catch (err) {
                if (timerRenderComponent) {
                    timerRenderComponent.Abort();
                    timerRenderComponent = null;
                }
                throw (err);
            }
            finally {
                if (timerRenderComponent) 
                    timerRenderComponent.Stop();
            }
        }
    };
}();
/**
 * Project: mp_meds_rec_o1.js
 * Version 1.0.2
 * Released 12/9/2010
 * @author Megha Rao (MR018925)
           Randy Rogers(RR4690)
 */
function MedicationReconciliationComponentStyle(){
    this.initByNamespace("medrec");
}

MedicationReconciliationComponentStyle.inherits(ComponentStyle);

function MedicationReconciliationComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new MedicationReconciliationComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.MEDS-REC.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.MEDS-REC.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
    
    MedicationReconciliationComponent.method("InsertData", function(){
        CERN_MEDS_REC_O1.GetMedsRecTable(this);
    });
    MedicationReconciliationComponent.method("HandleSuccess", function(recordData){
        CERN_MEDS_REC_O1.RenderComponent(this, recordData);
    });
    MedicationReconciliationComponent.method("openTab", function(){
        var criterion = this.getCriterion();
        var mrObject = new Object()
        mrObject = window.external.DiscernObjectFactory("ORDERS");
        mrObject.PersonId = criterion.person_id;
        mrObject.EncntrId = criterion.encntr_id;
        mrObject.reconciliationMode = 3;
        mrObject.LaunchOrdersMode(2, 0, 0); //2 -  Meds Rec
        this.InsertData();
    });
}

MedicationReconciliationComponent.inherits(MPageComponent);

/**
 * Medication Reconciliation methods
 * @namespace CERN_MEDS_REC_O1
 * @static
 * @global
 * @dependencies Script: mp_get_meds_rec
 */
var CERN_MEDS_REC_O1 = function(){
    return {
        GetMedsRecTable: function(component){
            var criterion = component.getCriterion();
            var sendAr = [];
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0");
            MP_Core.XMLCclRequestWrapper(component, "mp_get_meds_rec", sendAr, true);
        },
        RenderComponent: function(component, recordData){
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
                var sHTML = "", countText = "", jsHTML = [];
                var len = 0;
                var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                var dateTime = new Date();
                jsHTML.push("<div class='", MP_Util.GetContentClass(component, recordData.NEW.length + recordData.CONTINUE.length + recordData.CONTINUE_WITH_CHANGES.length + recordData.DISCONTINUED.length + recordData.CONTACT_PHYSICIAN.length), "'>");
                jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.NEW, " (", recordData.NEW.length, ")</span></h3><div class='sub-sec-content'>")
                if (recordData.NEW.length > 0) {
                    len += recordData.NEW.length;
                    var contMeds = getMedsRow(recordData.NEW);
                    jsHTML.push(contMeds, "</div></div>")
                }
                else
                    jsHTML.push(i18n.NO_RESULTS_FOUND, "</div></div>")
                    
                jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.CONTINUE, " (", recordData.CONTINUE.length, ")</span></h3><div class='sub-sec-content'>")
                if (recordData.CONTINUE.length > 0) {
                    len += recordData.CONTINUE.length;
                    var contMeds = getMedsRow(recordData.CONTINUE);
                    jsHTML.push(contMeds);
                    jsHTML.push("</div></div>")
                }
                else
                    jsHTML.push(i18n.NO_RESULTS_FOUND, "</div></div>")
                
                jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.CONTINUE_WITH_CHANGES, " (", recordData.CONTINUE_WITH_CHANGES.length, ")</span></h3><div class='sub-sec-content'>")
                if (recordData.CONTINUE_WITH_CHANGES.length > 0) {                    
                    for (var n = 0, l = recordData.CONTINUE_WITH_CHANGES.length; n < l; n++) {
                        var cwithchng = recordData.CONTINUE_WITH_CHANGES[n];
                        if (cwithchng.CURRENT.length > 0) {
                            for (var j = 0, t = cwithchng.CURRENT.length; j < t; j++) {
                                var contWithChangesMed = cwithchng.CURRENT[j];
                                jsHTML.push("<dl class='medrec-info'><dt><span>", i18n.MED_DETAIL, ":</span></dt><dd class='medrec-name'><span>", contWithChangesMed.ORDER_NAME, "</span></dd><dt><span>", i18n.SIGNATURE_LINE, ":</span></dt><dd class='medrec-sig'><span>", contWithChangesMed.ORDER_DETAIL_LINE, "</span></dd></dl>")
                                jsHTML.push("<h4 class='medrec-det-hd'><span></span></h4><div class='hvr'><dl class='medrec-det'><dt><span>", i18n.NAME, " :</span></dt><dd class='medrec-det-dt'><span>", contWithChangesMed.ORDER_NAME, "</span></dd><dt><span>", i18n.ORDERING_PHYSICIAN, ":</span></dt><dd class='medrec-det-dt'><span>", contWithChangesMed.ORDERING_PHYSICIAN, "</span></dd><dt><span>", i18n.COMMENTS, " :</span></dt><dd class='medrec-det-dt'><span>", contWithChangesMed.ORDER_COMMENTS, "</span></dd>")
                                jsHTML.push("<dt><span>", i18n.START, ":</span></dt><dd class='medrec-det-dt'><span>", contWithChangesMed.ORDER_NAME, " ", contWithChangesMed.ORDER_DETAIL_LINE, "</span></dd>")
                            }
                        }
                        if (cwithchng.ORIGINAL.length > 0) {
                            for (var m = 0, u = cwithchng.ORIGINAL.length; m < u; m++) {
                                var origMed = cwithchng.ORIGINAL[m]
                                jsHTML.push("<dt><span>", i18n.STOP, " :</span></dt><dd class='medrec-det-dt'><span>", origMed.ORDER_NAME, " ", origMed.ORDER_DETAIL_LINE, "</span></dd></dl></div>")
                            }
                        }
                    }
                    jsHTML.push("</div></div>")
                    len += recordData.CONTINUE_WITH_CHANGES.length;
                }
                else
                    jsHTML.push(i18n.NO_RESULTS_FOUND, "</div></div>")
                
                jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.NO_LONGER_TAKING, " (", recordData.DISCONTINUED.length, ")</span></h3><div class='sub-sec-content'>")
                if (recordData.DISCONTINUED.length > 0) {
                    len += recordData.DISCONTINUED.length;
                    var discontMeds = getMedsRow(recordData.DISCONTINUED);
                    jsHTML.push(discontMeds, "</div></div>")
                }
                else
                    jsHTML.push(i18n.NO_RESULTS_FOUND, "</div></div>")
                
				
				
                jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.CONTACT_PHYSICIAN, " (", recordData.CONTACT_PHYSICIAN.length, ")</span></h3><div class='sub-sec-content'>")
                if (recordData.CONTACT_PHYSICIAN.length > 0) {
                    len += recordData.CONTACT_PHYSICIAN.length;
                    var contactPhysMeds = getMedsRow(recordData.CONTACT_PHYSICIAN);
                    jsHTML.push(contactPhysMeds, "</div></div>")
                }
                else
                    jsHTML.push(i18n.NO_RESULTS_FOUND, "</div></div>")
                    
                jsHTML.push("</div>")
                
                countText = MP_Util.CreateTitleText(component, len);
                sHTML = jsHTML.join("");
                MP_Util.Doc.FinalizeComponent(sHTML, component, countText);
            } 
            catch (err) {
                if (timerRenderComponent) {
                    timerRenderComponent.Abort();
                    timerRenderComponent = null;
                }
                throw (err);
            }
            finally {
                if (timerRenderComponent) 
                    timerRenderComponent.Stop();
            }
        }
    };
    
    
    
    function getMedsRow(medData){
        var jsHTML = [];
        var strHTML = ""
        for (var j = 0, l = medData.length; j < l; j++) {
            var medDetail = medData[j];
            jsHTML.push("<dl class='medrec-info'><dt><span>", i18n.MED_DETAIL, ":</span></dt><dd class='medrec-name'><span>", medDetail.ORDER_NAME, "</span></dd><dt><span>", i18n.SIGNATURE_LINE, ":</span></dt><dd class='medrec-sig'><span>", medDetail.ORDER_DETAIL_LINE, "</span></dd></dl>")
            jsHTML.push("<h4 class='medrec-det-hd'><span></span></h4><div class='hvr'><dl class='medrec-det'><dt><span>", i18n.NAME, " :</span></dt><dd class='medrec-det-dt'><span>", medDetail.ORDER_NAME, "</span></dd><dt><span>", i18n.ORDERING_PHYSICIAN, ":</span></dt><dd class='medrec-det-dt'><span>", medDetail.ORDERING_PHYSICIAN, "</span></dd><dt><span>", i18n.COMMENTS, " :</span></dt><dd class='medrec-det-dt'><span>", medDetail.ORDER_COMMENTS, "</span></dd></dl></div>")
        }
        strHTML = jsHTML.join("");
        return strHTML;
    }
    
    
}();
/**
 * Project: mp_orders_o1.js
 * Version 1.1.2
 * Released 01/05/2011
 * @author Greg Howdeshell (GH7199)
 * @author Todd Gray (TG6712)
 * @author Randy Rogers (RR4690)
 * @author Kiran Handi (KH019391)
 * @author Megha Rao (MR018925)
 * @author Subash katageri (SK018948)
 */
function OrdersComponentStyle(){
    this.initByNamespace("ord");
}

OrdersComponentStyle.inherits(ComponentStyle);

function OrdersComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new OrdersComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.ORDERS.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.ORDERS.O1 - render component");
    this.setIncludeLineNumber(true);
    
    OrdersComponent.method("InsertData", function(){
        CERN_ORDERS_O1.GetOrdersTable(this);
    });
    OrdersComponent.method("HandleSuccess", function(recordData){
        CERN_ORDERS_O1.RenderComponent(this, recordData);
    });
    OrdersComponent.method("setCatalogCodes", function(value){
        this.m_catalogCodes = value;
    });
    OrdersComponent.method("addCatalogCode", function(value){
        if (this.m_catalogCodes == null) 
            this.m_catalogCodes = new Array();
        this.m_catalogCodes.push(value);
    });
    OrdersComponent.method("getCatalogCodes", function(){
        if (this.m_catalogCodes != null) 
            return this.m_catalogCodes;
    });
    OrdersComponent.method("setOrderStatuses", function(value){
        this.m_orderStatuses = value;
    });
    OrdersComponent.method("addOrderStatus", function(value){
        if (this.m_orderStatuses == null) 
            this.m_orderStatuses = new Array();
        this.m_orderStatuses.push(value);
    });
    OrdersComponent.method("getOrderStatuses", function(){
        if (this.m_orderStatuses != null) 
            return this.m_orderStatuses;
    });
}

OrdersComponent.inherits(MPageComponent);

/**
 * Orders methods
 * Version .9 (Jun-18-2010)
 * @namespace CERN_ORDERS_O1
 * @static
 * @global
 */
var CERN_ORDERS_O1 = function(){
    return {
        GetOrdersTable: function(component){
            var sendAr = [];
            var criterion = component.getCriterion();
            //outdev, inputPersonID, inputEncounterID, inputPersonnelID, lookbackUnits, orderStatuses, medOrderCriteria, nonMedOrderCriteria,orderDetailInd, 
            //dateCriteria, fullDayInd, mobileInd, categoryType, lookbackUnitTypeFlag
            
            var encntrOption = (component.getScope() == 2) ? (criterion.encntr_id + ".0") : "0.0";
            
            sendAr.push("^MINE^", criterion.person_id + ".0", encntrOption, criterion.provider_id + ".0", component.getLookbackUnits(), 129, 63, 2, 0, 1, 0, 0);
            var codes = component.getCatalogCodes();
            var catType = (codes != null && codes.length > 0) ? "value(" + codes.join(",") + ")" : "0.0";
            sendAr.push(catType);
            sendAr.push(component.getLookbackUnitTypeFlag());
            var statuses = component.getOrderStatuses();
            var ordStatuses = (statuses != null && statuses.length > 0) ? "value(" + statuses.join(",") + ")" : "0.0";
            sendAr.push(ordStatuses);
            sendAr.push("0", criterion.ppr_cd + ".0");//scope and pprCd
            MP_Core.XMLCclRequestWrapper(component, "MP_GET_ORDERS", sendAr, true);
        },
        RenderComponent: function(component, recordData){
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
                var ordHTML = "", countText = "", blank = "";
                var ordArray = [];
                var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                var personnelArray = [];
                personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
                var compNS = component.getStyles().getNameSpace();
                
                ordArray.push("<div class='content-hdr'><dl class='", compNS, "-info-hdr'>");
                ordArray.push("<dt class='", compNS, "-nm-hd'><span>", blank ,"</span></dt><dt class='", compNS, "-st-hd'><span>", i18n.STATUS,"</span></dt><dt class='", compNS, "-dt-hd'><span>", i18n.ORDERED, "</span></dt></dl></div>");   //i18n.STATUS
                
                recordData.ORDERS.sort(OrderDateSort);
                
                var orderLen = recordData.ORDERS.length;
                ordArray.push("<div class ='", MP_Util.GetContentClass(component, orderLen), "'>");
                for (var j = 0; j < orderLen; j++) {
                    var orders = recordData.ORDERS[j];
                    var ordName = ordDateTime = strtDateTime= statusTypeDisp = orderDetails = ordLongDateTime = strtLongDateTime = responProvider = "";
                    var dateTime = new Date();
                    
                    if (orders.SCHEDULE != "") {
                        dateTime.setISO8601(orders.SCHEDULE.ORIG_ORDER_DT_TM);
                        ordDateTime = dateTime.format("longDateTime2");
                        ordLongDateTime = dateTime.format("longDateTime3");
                    }
                    
					 if (orders.SCHEDULE != "") {
                        dateTime.setISO8601(orders.SCHEDULE.CURRENT_START_DT_TM);
                        strtDateTime = dateTime.format("longDateTime2");
                        strtLongDateTime = dateTime.format("longDateTime3");
                    }
					
                    if (orders.CORE != "") {
                        if (orders.CORE.STATUS_CD > 0) {
                            var statusTypeObj = MP_Util.GetValueFromArray(orders.CORE.STATUS_CD, codeArray);
                            statusTypeDisp = statusTypeObj.display;
                        }
                        else 
                            statusTypeDisp = "";
                        
                        if (orders.CORE.RESPONSIBLE_PROVIDER_ID > 0) {
                            var prsnlObj = MP_Util.GetValueFromArray(orders.CORE.RESPONSIBLE_PROVIDER_ID, personnelArray);
                            responProvider = prsnlObj.fullName
                        }
                        else 
                            responProvider = "";
                    }
                    
                    if (orders.DISPLAYS != "") {
                        ordName = orders.DISPLAYS.CLINICAL_NAME;
                        if (ordName == "") {
                            ordName = orders.DISPLAYS.REFERENCE_NAME;
                        }
                        if (ordName == "") {
                            ordName = orders.DISPLAYS.DEPARTMENT_NAME;
                        }
                    }
                    var odetails = orders.DISPLAYS.CLINICAL_DISPLAY_LINE;
                    ;
                    /*
                     if (orders.DETAILS != "") {
                     if (orders.DETAILS.LAST_DOSE_DT_TM != "") {
                     dateTime.setISO8601(orders.DETAILS.LAST_DOSE_DT_TM);
                     orderDetails = dateTime.format("longDateTime2") + ", ";
                     }
                     if (orders.DETAILS.NEXT_DOSE_DT_TM != "") {
                     dateTime.setISO8601(orders.DETAILS.NEXT_DOSE_DT_TM);
                     orderDetails += dateTime.format("longDateTime2") + +", ";
                     }
                     orderDetails += orders.DETAILS.COMPLIANCE_STATUS_CD;
                     }
                     
                     */
                   ordArray.push("<dl class='ord-info'><dd class= 'ord-name'><span>", ordName, "</span></dd><dd class= 'ord-status'><span>",statusTypeDisp, "</span></dd><dd class= 'ord-date'><span>",ordDateTime, "</span></dd></dl><h4 class='ord-det-hd'><span>", "</span></h4><div class='hvr'><dl class='ord-det'><dt><span>", i18n.ORDER_NAME, ":</span></dt><dd><span>", ordName, "</span></dd><dt><span>", i18n.ORDER_DETAILS, ":</span></dt><dd><span>", odetails, "</span></dd><dt><span>", i18n.ORDER_DATE, ":</span></dt><dd><span>", ordLongDateTime, "</span></dd><dt><span>", i18n.START_DT_TM, ":</span></dt><dd><span>", strtLongDateTime, "</span></dd>   <dt><span>", i18n.ORDER_STATUS, ":</span></dt><dd><span>", statusTypeDisp, "</span></dd><dt><span>", i18n.ORDER_PHYS, ":</span></dt><dd><span>", responProvider, "</span></dd></dl></div>");
                }
                ordHTML = ordArray.join("");
                countText = MP_Util.CreateTitleText(component, orderLen);
                MP_Util.Doc.FinalizeComponent(ordHTML, component, countText);
            } 
            catch (err) {
                if (timerRenderComponent) {
                    timerRenderComponent.Abort();
                    timerRenderComponent = null;
                }
                throw (err);
            }
            finally {
                if (timerRenderComponent) 
                    timerRenderComponent.Stop();
            }
        }
    };
    function OrderDateSort(a, b){
        if (a.SCHEDULE.ORIG_ORDER_DT_TM > b.SCHEDULE.ORIG_ORDER_DT_TM) 
            return -1;
        else if (a.SCHEDULE.ORIG_ORDER_DT_TM < b.SCHEDULE.ORIG_ORDER_DT_TM) 
            return 1;
        else 
            return 0;
    }
}();



/**
 * Project: mp_pathology_o1.js
 * Version 1.0.0
 * Released 7/26/2010
 * @author Greg Howdeshell (GH7199)
 * @dependency http://scm.discern-abu.cerner.corp/svn/standardized-components/tags/documents-base-o1-1.0.0
 */
function PathologyComponentStyle(){
    this.initByNamespace("path");
}

PathologyComponentStyle.inherits(ComponentStyle);

/**
 * The Pathology component will retrieve all documents associated to the encounter for the
 * specified lookback days defined by the component.
 * @param {Criterion} criterion
 * @dependency on @see DocumentBaseComponent
 */
function PathologyComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new PathologyComponentStyle());
    this.setHoverEnabled(false);
    this.setComponentLoadTimerName("USR:MPG.PATHOLOGY.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.PATHOLOGY.O1 - render component");
}

PathologyComponent.inherits(DocumentBaseComponent);
/**
 * Project: mp_patient_family_edu_sum_o1.js
 * Version 1.0.0
 * Released 7/26/2010
 * @author Greg Howdeshell (GH7199)
 * @author Megha Rao (MR018925)
 * @author Mark Davenport (MD019066)
 * @author Randy Rogers (RR4690)
 */
function PatientFamilyEduSumComponentStyle(){
    this.initByNamespace("pfe");
}

PatientFamilyEduSumComponentStyle.inherits(ComponentStyle);

function PatientFamilyEduSumComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new PatientFamilyEduSumComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.PATFAMEDUSUM.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.PATFAMEDUSUM.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
    
    PatientFamilyEduSumComponent.method("InsertData", function(){
        CERN_PAT_FAMILY_EDU_SUM_O1.GetPatientFamilyEducation(this);
    });
    PatientFamilyEduSumComponent.method("HandleSuccess", function(recordData){
        CERN_PAT_FAMILY_EDU_SUM_O1.RenderComponent(this, recordData);
    });
    PatientFamilyEduSumComponent.method("openTab", function(){
        var criterion = this.getCriterion();
        var peObject = new Object();
        
        peObject = window.external.DiscernObjectFactory("PATIENTEDUCATION");
        //dpObject.Window = window;
        var personId = criterion.person_id
        var encntrId = criterion.encntr_id
        peObject.SetPatient(personId, encntrId);
        peObject.SetDefaultTab(0); //Instructions
        peObject.DoModal();
        
        this.InsertData();
    });
}

PatientFamilyEduSumComponent.inherits(MPageComponent);

var CERN_PAT_FAMILY_EDU_SUM_O1 = function(){
    return {
        GetPatientFamilyEducation: function(component){
            var sendAr = [];
            var criterion = component.getCriterion();
            var groups = component.getGroups();
            var events = (groups != null && groups.length > 0) ? groups[0].getEventSets() : null;
            var sEventSet = (events != null) ? "value(" + events.join(",") + ")" : "0.0";
            
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", sEventSet);
            
            MP_Core.XMLCclRequestWrapper(component, "mp_get_pat_edu_sum", sendAr, true);
        },
        RenderComponent: function(component, recordData){
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
                var strHTML = "", countText = "", pfeAr = [];
                var dateTime = new Date();
                pfeAr.push("<div class='", MP_Util.GetContentClass(component, recordData.EVENTS.length), "'>");
                recordData.EVENTS.sort(SortByDate);
                for (var i = 0, l = recordData.EVENTS.length; i < l; i++) {
                    var events = recordData.EVENTS[i];
                    if (events.DATE != "") {
                        dateTime.setISO8601(events.DATE);
                    }
                    if (events.DISPLAY != "") {
                        pfeAr.push("<h3 class='pfe-info-hd'><span>", events.DISPLAY, "</span></h3><dl class='pfe-info'><dt><span>", events.DISPLAY, "</span></dt><dd class='pfe-name'><span>", events.DISPLAY, "</span></dd><dt><span>", i18n.DATE_TIME, ":</span></dt><dd class='pfe-date'><span>", dateTime.format("longDateTime2"), "</span></dd></dl>");
                        pfeAr.push("<h4 class='pfe-det-hd '><span>", "</span></h4><div class='hvr'><dl class='ord-det'><dt><span>", i18n.PE_INSTRUCTION, "</span></dt><dd class='ord-det-dt'><span>", events.DISPLAY, "</span></dd><dt><span>", i18n.PE_DATE, "</span></dt><dd class='ord-det-dt'><span>", dateTime.format("longDateTime2"), "</span></dd><dt><span>", i18n.PE_PROVIDER, "</span></dt><dd class='ord-det-dt'><span>", events.PROVIDER, "</span></dd></dl></div>")
                    }
                }
                pfeAr.push("</div>")
                countText = MP_Util.CreateTitleText(component, recordData.EVENTS.length);
                strHTML = pfeAr.join("");
                MP_Util.Doc.FinalizeComponent(strHTML, component, countText);
            } 
            catch (err) {
                if (timerRenderComponent) {
                    timerRenderComponent.Abort();
                    timerRenderComponent = null;
                }
                throw (err);
            }
            finally {
                if (timerRenderComponent) 
                    timerRenderComponent.Stop();
            }
        }
    };
    
    function SortByDate(a, b){
        if (a.DATE > b.DATE) 
            return -1;
        else if (a.DATE < b.DATE) 
            return 1;
        else 
            return 0;
    }
}();
/**
 * Project: mp_patinfo_o1.js
 * Version 1.1.1
 * Released 10/05/2010
 * @author Anantha Ramu (AR018249)
 * @author Randy Rogers (RR4690)
 * @author Subash Katageri(SK018948)
 */
function PatientInfoComponentStyle(){
    this.initByNamespace("pt");
}

PatientInfoComponentStyle.inherits(ComponentStyle);

/**
 * The Patient Information component will retrieve all information associated to the patient
 *
 * @param {Criterion} criterion
 * @author Randy Rogers
 */
function PatientInfoComponent(criterion){
    this.rowCount = 0;
    this.setCriterion(criterion);
    this.setStyles(new PatientInfoComponentStyle());
    this.m_visitTypeMeanings = null;
    this.m_visitTypeCodes = null;
    this.m_chiefComplaintCodes = null;
    this.m_estimatedDischargeDateCodes = null;
    this.m_displayMedicalService = false;
    this.m_displayRFV = false;
    this.m_primaryPhysDisplay = false;
    this.m_attedingPhysDisplay = false;
    this.m_admittingPhysDisplay = false;
    this.m_roombedDisplay = false;
    this.m_admitDateDisplay = false;
    this.m_modeofArrval = null;
    this.m_advancedDirectives = null;
    this.m_resusOrderCodes = null;
    this.m_emergencyContactsDisplay = false;
    this.m_documentTypeCodes = null;
    
    this.setComponentLoadTimerName("USR:MPG.PATINFO.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.PATINFO.O1 - render component");
    
    
    PatientInfoComponent.method("HandleSuccess", function(recordData){
        CERN_PATINFO_O1.GetPatientInfo(this, recordData);
    });
    
    PatientInfoComponent.method("InsertData", function(){
        CERN_PATINFO_O1.SendPatientData(this);
    });
    PatientInfoComponent.method("setVisitTypeCodes", function(value){
        this.m_visitTypeCodes = value;
    });
    PatientInfoComponent.method("addVisitTypeCode", function(value){
        if (this.m_visitTypeCodes == null) 
            this.m_visitTypeCodes = [];
        this.m_visitTypeCodes.push(value);
    });
    PatientInfoComponent.method("getVisitTypeCodes", function(){
        if (this.m_visitTypeCodes != null) 
            return this.m_visitTypeCodes;
    });
    
    PatientInfoComponent.method("setChiefComplaint", function(value){
        this.rowCount++;
        this.m_chiefComplaintCodes = value;
    });
    
    
    PatientInfoComponent.method("addChiefComplaint", function(value){
        if (this.m_chiefComplaintCodes == null) 
            this.m_chiefComplaintCodes = [];
        this.m_chiefComplaintCodes.push(value);
    });
    PatientInfoComponent.method("getChiefComplaint", function(){
        return this.m_chiefComplaintCodes;
    });
    
    PatientInfoComponent.method("setAdvancedDirectives", function(value){
        this.rowCount++;
        this.m_advancedDirectives = value;
    });
    PatientInfoComponent.method("addAdvancedDirectives", function(value){
        if (this.m_advancedDirectives == null) 
            this.m_advancedDirectives = [];
        this.m_advancedDirectives.push(value);
    });
    PatientInfoComponent.method("getAdvancedDirectives", function(){
        return this.m_advancedDirectives;
    });
    
    PatientInfoComponent.method("setResusOrders", function(value){
        this.rowCount++;
        this.m_resusOrderCodes = value;
    });
    PatientInfoComponent.method("addResusOrders", function(value){
        if (this.m_resusOrderCodes == null) 
            this.m_resusOrderCodes = [];
        this.m_resusOrderCodes.push(value);
    });
    PatientInfoComponent.method("getResusOrders", function(){
        return this.m_resusOrderCodes;
    });
    
    PatientInfoComponent.method("setEstimatedDischargeDate", function(value){
        this.rowCount++;
        this.m_estimatedDischargeDateCodes = value;
    });
    PatientInfoComponent.method("addEstimatedDischargeDate", function(value){
        if (this.m_estimatedDischargeDateCodes == null) 
            this.m_estimatedDischargeDateCodes = [];
        this.m_estimatedDischargeDateCodes.push(value);
    });
    PatientInfoComponent.method("getEstimatedDischargeDate", function(){
        return this.m_estimatedDischargeDateCodes;
    });
    
    PatientInfoComponent.method("setModeofArrival", function(value){
        this.rowCount++;
        this.m_modeofArrival = value;
    });
    PatientInfoComponent.method("addModeofArrival", function(value){
        if (this.m_modeofArrival == null) 
            this.m_modeofArrival = [];
        this.m_modeofArrival.push(value);
    });
    PatientInfoComponent.method("getModeofArrival", function(){
        return this.m_modeofArrival;
    });
    
    PatientInfoComponent.method("setDocumentTypes", function(value){
        this.m_documentTypeCodes = value;
    });
    PatientInfoComponent.method("addDocumentTypes", function(value){
        if (this.m_documentTypeCodes == null) 
            this.m_documentTypeCodes = [];
        this.m_documentTypeCodes.push(value);
    });
    PatientInfoComponent.method("getDocumentTypes", function(){
        return this.m_documentTypeCodes;
    });
    
    PatientInfoComponent.method("isMedicalServiceDisplay", function(){
        return this.m_displayMedicalService;
    });
    PatientInfoComponent.method("setMedicalServiceDisplay", function(value){
        if (value == 1) 
            this.rowCount++;
        this.m_displayMedicalService = (value == 1 ? true : false);
    });
    PatientInfoComponent.method("isRFVDisplay", function(){
        return this.m_displayRFV;
    });
    PatientInfoComponent.method("setRFVDisplay", function(value){
        if (value == 1) 
            this.rowCount++;
        this.m_displayRFV = (value == 1 ? true : false);
    });
    PatientInfoComponent.method("isPrimaryPhysDisplay", function(){
        return this.m_primaryPhysDisplay;
    });
    PatientInfoComponent.method("setPrimaryPhysDisplay", function(value){
        if (value == 1) 
            this.rowCount++;
        this.m_primaryPhysDisplay = (value == 1 ? true : false);
    });
    PatientInfoComponent.method("isAttendingPhysDisplay", function(){
        return this.m_attedingPhysDisplay;
    });
    PatientInfoComponent.method("setAttendingPhysDisplay", function(value){
        if (value == 1) 
            this.rowCount++;
        this.m_attedingPhysDisplay = (value == 1 ? true : false);
    });
    PatientInfoComponent.method("isAdmittingPhysDisplay", function(){
        return this.m_admittingPhysDisplay;
    });
    PatientInfoComponent.method("setAdmittingPhysDisplay", function(value){
        if (value == 1) 
            this.rowCount++;
        this.m_admittingPhysDisplay = (value == 1 ? true : false);
    });
    PatientInfoComponent.method("isRoomBedDisplay", function(){
        return this.m_roombedDisplay;
    });
    PatientInfoComponent.method("setRoomBedDisplay", function(value){
        if (value == 1) 
            this.rowCount++;
        this.m_roombedDisplay = (value == 1 ? true : false);
    });
    
    PatientInfoComponent.method("isAdmitDateDisplay", function(){
        return this.m_admitDateDisplay;
    });
    PatientInfoComponent.method("setAdmitDateDisplay", function(value){
        if (value == 1) 
            this.rowCount++;
        this.m_admitDateDisplay = (value == 1 ? true : false);
    });
    PatientInfoComponent.method("isEmergencyContactsDisplay", function(){
        return this.m_emergencyContactsDisplay;
    });
    PatientInfoComponent.method("setEmergencyContactsDisplay", function(value){
        this.m_emergencyContactsDisplay = (value == 1 ? true : false);
    });
    
    PatientInfoComponent.method("getRowCount", function(){
        return this.rowCount;
    });
    
    
    
}

PatientInfoComponent.inherits(MPageComponent);

/**
 * Patinfo methods
 * @namespace CERN_PATINFO_O1
 * @static
 * @global
 * @dependencies Script: mp_get_patinfo
 */
var CERN_PATINFO_O1 = function(){
    var timerPatInfoLoad = null;
    return {
        SendPatientData: function(component){
            var criterion = component.getCriterion();
            
            var sendVal = [];
            sendVal.push("^MINE^");
            sendVal.push(criterion.person_id + ".0");
            sendVal.push(criterion.encntr_id + ".0");
            
            var codes = component.getVisitTypeCodes();
            
            sendVal.push((codes != null && codes.length > 0) ? "value(" + codes.join(",") + ")" : "0");
            sendVal.push((component.getEstimatedDischargeDate() != null) ? "value(" + component.getEstimatedDischargeDate().join(",") + ")" : "0.0");
            sendVal.push((component.getChiefComplaint() != null) ? "value(" + component.getChiefComplaint().join(",") + ")" : "0.0");
            sendVal.push((component.getModeofArrival() != null) ? "value(" + component.getModeofArrival().join(",") + ")" : "0.0");
            sendVal.push((component.getAdvancedDirectives() != null) ? "value(" + component.getAdvancedDirectives().join(",") + ")" : "0.0");
            sendVal.push((component.getResusOrders() != null) ? "value(" + component.getResusOrders().join(",") + ")" : "0.0");
            sendVal.push((component.getDocumentTypes() != null) ? "value(" + component.getDocumentTypes().join(",") + ")" : "0.0");
            
            MP_Core.XMLCclRequestWrapper(component, "mp_get_patinfo", sendVal, true);
            return;
        },
        GetPatientInfo: function(component, reportData){
        
            var jsPtHTML = [];
            var ptHTML = ""
            var countText = "";
            var rfv = i18n.NO_RESULTS_FOUND;
            var roomBed = i18n.NO_RESULTS_FOUND;
            var admitDiag = i18n.NO_RESULTS_FOUND;
            var admitDate = i18n.NO_RESULTS_FOUND;
            var primPhys = i18n.NO_RESULTS_FOUND;
            var chiefComplaint = "";
            var attPhys = i18n.NO_RESULTS_FOUND;
            var admPhys = i18n.NO_RESULTS_FOUND;
            var medService = i18n.NO_RESULTS_FOUND;
            var dischargeDate = i18n.NO_RESULTS_FOUND;
            var recCount = 0;
            var dateTime = new Date();
            var contact = 5;
            
            
            var visitListCnt = reportData.VISIT_LIST.length;
            var multVisitTypeInd = reportData.MULT_VISIT_TYPE_IND;
            
            if (reportData.RFV != "") {
                rfv = reportData.RFV;
            }
            
            
            
            if (reportData.ROOM_BED != "") {
                roomBed = reportData.ROOM_BED;
            }
            
            
            if (reportData.ADMIT_DT_TM != "") {
                admitDate = reportData.ADMIT_DT_TM;
                dateTime.setISO8601(admitDate);
                admitDate = dateTime.format("shortDate2");
            }
            
            
            if (reportData.PRIMARY_PHYS != "") {
                primPhys = reportData.PRIMARY_PHYS;
            }
            
            
            if (reportData.ATTENDING_PHYS != "") {
                attPhys = reportData.ATTENDING_PHYS;
            }
            
            if (reportData.ADMITTING_PHYS != "") {
                admPhys = reportData.ADMITTING_PHYS;
            }
            
            
            if (reportData.MED_SERVICE != "") {
                medService = reportData.MED_SERVICE;
            }
            
            if (reportData.ESTIMATED_DEPART_DT_TM != "") {
                dischargeDate = reportData.ESTIMATED_DEPART_DT_TM;
            }
            
            jsPtHTML.push("<div class='", MP_Util.GetContentClass(component, component.getRowCount()), "'>");
            
            if (component.getChiefComplaint() != null) {
            
                if (reportData.CHIEFCOMPLAINTS.length > 0) {
                    for (i = 0, k = reportData.CHIEFCOMPLAINTS.length; i < k; i++) {
                        if (i > 0) {
                            chiefComplaint += "; ";
                        }
                        
                        chiefComplaint += reportData.CHIEFCOMPLAINTS[i].CHIEFCOMPLAINT;
                        
                        
                    }
                }
                else {
                    chiefComplaint = i18n.NO_RESULTS_FOUND;
                }
                jsPtHTML.push("<dl class='pt-info'><dt class='pt-label'><span>", i18n.CHIEF_COMPLAINT, ":</span></dt><dd class='pt-detail'><span>", chiefComplaint, "</span></dd></dl>");
                
            }
            
            if (component.isRFVDisplay()) {
                jsPtHTML.push("<dl class='pt-info'><dt class='pt-label'><span>", i18n.RFV, ":</span></dt><dd class='pt-detail'><span>", rfv, "</span></dd></dl>");
            }
            
            if (component.isPrimaryPhysDisplay()) {
                jsPtHTML.push("<dl class='pt-info'><dt  class='pt-label'><span>", i18n.PRIM_PHYS, ":</span></dt><dd class='pt-detail'><span>", primPhys, "</span></dd></dl>");
            }
            
            if (component.isAttendingPhysDisplay()) {
                jsPtHTML.push("<dl class='pt-info'><dt  class='pt-label'><span>", i18n.ATTEND_PHYS, ":</span></dt><dd class='pt-detail'><span>", attPhys, "</span></dd></dl>");
            }
            
            if (component.isAdmittingPhysDisplay()) {
                jsPtHTML.push("<dl class='pt-info'><dt  class='pt-label'><span>", i18n.ADMIT_PHYS, ":</span></dt><dd class='pt-detail'><span>", admPhys, "</span></dd></dl>");
            }
            
            if (component.isMedicalServiceDisplay()) {
                jsPtHTML.push("<dl class='pt-info'><dt  class='pt-label'><span>", i18n.SERVICE, ":</span></dt><dd class='pt-detail'><span>", medService, "</span></dd></dl>");
            }
            
            if (component.isRoomBedDisplay()) {
                jsPtHTML.push("<dl class='pt-info'><dt class='pt-label'><span>", i18n.ROOM_BED, ":</span></dt><dd class='pt-detail'><span>", roomBed, "</span></dd></dl>");
            }
            
            if (component.isAdmitDateDisplay()) {
                jsPtHTML.push("<dl class='pt-info'><dt class='pt-label'><span>", i18n.ADMIT_DATE, ":</span></dt><dd class='pt-detail'><span>", admitDate, "</span></dd></dl>");
            }
            if (component.getEstimatedDischargeDate() != null) {
                jsPtHTML.push("<dl class='pt-info'><dt class='pt-label'><span>", i18n.TARGETED_DISCHARGE_DATE, ":</span></dt><dd class='pt-detail'><span>", dischargeDate, "</span></dd></dl>");
            }
            
            if (component.getModeofArrival() != null) {
            
                var modeofArrival = "";
                for (i = 0, k = reportData.MODESOFARRIVAL.length; i < k; i++) {
                    if (i > 0) {
                        modeofArrival += ", ";
                    }
                    modeofArrival += reportData.MODESOFARRIVAL[i].MODEOFARRIVAL;
                }
                if (modeofArrival == "") 
                    modeofArrival = i18n.NO_RESULTS_FOUND;
                
                jsPtHTML.push("<dl class='pt-info'><dt class='pt-label'><span>", i18n.MODE_OF_ARRVAL, ":</span></dt><dd class='pt-detail'><span>", modeofArrival, "</span></dd></dl>");
            }
            if (component.getAdvancedDirectives() != null) {
                var advancedirective = "";
                for (i = 0, k = reportData.ADVANCEDDIRECTIVES.length; i < k; i++) {
                    if (i > 0) {
                        advancedirective += ", ";
                    }
                    
                    
                    advancedirective += reportData.ADVANCEDDIRECTIVES[i].ADVANCEDIRECTIVE;
                }
                if (advancedirective == "") 
                    advancedirective = i18n.NO_RESULTS_FOUND;
                
                jsPtHTML.push("<dl class='pt-info'><dt class='pt-label'><span>", i18n.ADVANCE_DIRECTIVE, ":</span></dt><dd class='pt-detail'><span>", advancedirective, "</span></dd></dl>");
            }
            
            
            
            if (visitListCnt > 0) {
                    if (reportData.PREVIOUSDOCEVENTID) {
                        jsPtHTML.push("<dl class='pt-info'><dt class='pt-label'><span>", i18n.LAST_VISIT, ":</span></dt><dd class='pt-detail'><span>", MP_Util.CreateClinNoteLink(component.getCriterion().person_id, component.getCriterion().encntr_id, reportData.PREVIOUSDOCEVENTID, reportData.VISIT_LIST[0].DATE_TYPE), "</span></dd></dl>");
                    }
                    else {
                        jsPtHTML.push("<dl class='pt-info'><dt class='pt-label'><span>", i18n.LAST_VISIT, ":</span></dt><dd class='pt-detail'><span>", reportData.VISIT_LIST[0].DATE_TYPE, "</span></dd></dl>");
                    }
                
                if (visitListCnt > 1) {
                    jsPtHTML.push("<h4 class='pt-det-hd'><span>", i18n.DETAILS, "</span></h4><div class='hvr'><dl class='pt-det'>");
                    if (multVisitTypeInd == 0) {
                        for (var j = 0, m = reportData.VISIT_LIST.length; j < m; j++) {
                            jsPtHTML.push("<dd><span>", reportData.VISIT_LIST[j].DATE, "</span></dd><br/>");
                        }
                    }
                    else if (multVisitTypeInd == 1) {
                        for (var j = 0, m = reportData.VISIT_LIST.length; j < m; j++) {
                            jsPtHTML.push("<dd><span>", reportData.VISIT_LIST[j].DATE_TYPE, "</span></dd><br/>");
                        }
                    }
                    jsPtHTML.push("</dl>");
                    jsPtHTML.push("</div>");
                    
                }
            }
            else {
                jsPtHTML.push("<dl class='pt-info'><dt class='pt-label'><span>", i18n.LAST_VISIT, ":</span></dt><dd class='pt-detail'><span>", i18n.NO_RESULTS_FOUND, "</span></dd></dl>");
            }
            if (component.getResusOrders() != null) {
                var codeStatus = "";
                var codeStatusDetails = ""
                for (i = 0, k = reportData.RESUSCITATION.length; i < k; i++) {
                    if (i > 0) {
                        codeStatus += ", ";
                    }
                    
                    codeStatus += reportData.RESUSCITATION[i].CODE_STATUS;
                    codeStatusDetails = reportData.RESUSCITATION[i].CODE_STATUS_DETAILS;
                }
                if (codeStatus == "") {
                    codeStatus = i18n.NO_RESULTS_FOUND;
                    codeStatusDetails = ""
                }
                
                jsPtHTML.push("<dl class='pt-info'><dt  class='pt-label'><span>", i18n.CODE_STATUS, ":</span></dt><dd class='pt-detail'><span class='res-severe'>", codeStatus, "</span></dd></dl>");
                if (codeStatusDetails != "") {
                    jsPtHTML.push("<h4 class='pt-det-hd'><span>", i18n.DETAILS, "</span></h4><div class='hvr'><dl class='pt-det'>" +
                    "<dd><span>", codeStatusDetails, "</span></dd>" +
                    "</dl></div>");
                }
            }
            
            
            
            if (component.isEmergencyContactsDisplay()) {
                var contactList = reportData.CONTACT_LIST;
                
                if (contactList.length > 0) {
                    jsPtHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl'>-</span><span class='sub-sec-title'>", i18n.EMER_CONTACT, " (", contactList.length, ")</span></h3><div class='sub-sec-content'>")
                    
                    for (var j = 0, m = contactList.length; j < m; j++) {
                        jsPtHTML.push("<dl class='pt-info'><dt class='pt-label'><span>", contactList[j].NAME, ":</span></dt><dd class='pt-detail'><span>", contactList[j].NUMBER, "</span></dd></dl>");
                        jsPtHTML.push("<h4 class='pt-det-hd'><span>", i18n.DETAILS, "</span></h4><div class='hvr'><dl class='pt-det'>");
                        for (var x = 0, y = contactList[j].CONTACT_PHONE.length; x < y; x++) {
                            jsPtHTML.push("<dd><span>", contactList[j].CONTACT_PHONE[x].NUMBER, "</span></dd><br/>");
                        }
                        jsPtHTML.push("</dl></div>");
                    }
                    jsPtHTML.push("</div></div>");
                }
                else {
                    jsPtHTML.push("<div class='sub-sec closed'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl'>-</span><span class='sub-sec-title'>", i18n.EMER_CONTACT, " (0)</span></h3><div class='sub-sec-content'><span>", i18n.NO_RESULTS_FOUND, "</span></div></div>");
                }
            }
            jsPtHTML.push("</div>");
            ptHTML = jsPtHTML.join("");
            
            countText = MP_Util.CreateTitleText(component, component.getRowCount(), false, false, false);
            MP_Util.Doc.FinalizeComponent(ptHTML, component, countText);
            
            return;
        }
    };
    
    
}();
/**
 * Project: mp_quality_measures_o1.js
 * Version 1.0.0
 * Released 12/8/2010
 * @author Megha Rao
 *         Randy Rogers(RR4690)
 */

var qmComponent ;
function QualityMeasuresComponentStyle(){
    this.initByNamespace("qm");
}


QualityMeasuresComponentStyle.inherits(ComponentStyle);

function QualityMeasuresComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new QualityMeasuresComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.QUALITYMEASURES.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.QUALITYMEASURES.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
    
    QualityMeasuresComponent.method("InsertData", function(){
       CERN_QUALITY_MEASURES_O1.GetQualityMeasuresTable(this, 0);
    });
    QualityMeasuresComponent.method("HandleSuccess", function(recordData){
        CERN_QUALITY_MEASURES_O1.RenderComponent(this, recordData);
    });
   
	 //Functions to set plan status filters
    QualityMeasuresComponent.method("setPlanStatusCodes", function(value){
        this.m_planStatusCodes = value;
    });
    QualityMeasuresComponent.method("addPlanStatusCode", function(value){
        if (this.m_planStatusCodes == null) 
            this.m_planStatusCodes = new Array();
        this.m_planStatusCodes.push(value);
    });
    QualityMeasuresComponent.method("getPlanStatusCodes", function(){
        if (this.m_planStatusCodes != null) 
            return this.m_planStatusCodes;
    });
    QualityMeasuresComponent.method("openTab", function(){
	var criterion = this.getCriterion();
		
	var params = [criterion.person_id, ".0|", criterion.encntr_id, ".0|"];
	params.push("{ORDER|0|0|0|0|0}"); 
	params.push("|0|{2|127}|8");  
	MPAGES_EVENT("ORDERS", params.join(""));
		
	this.InsertData();
	});
}

QualityMeasuresComponent.inherits(MPageComponent);

var CERN_QUALITY_MEASURES_O1 = function(){
    return {
            GetQualityMeasuresTable: function(component, selectedCondition){
		    var criterion = component.getCriterion();
            var sendAr = [];
			var codes = component.getPlanStatusCodes();
            var status_cds = (codes != null && codes.length > 0) ? "value(" + codes.join(",") + ")" : "0.0";

            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", criterion.position_cd + ".0", criterion.ppr_cd + ".0");
          	sendAr.push (status_cds,component.getScope(), component.getLookbackUnits(),component.getLookbackUnitTypeFlag(), selectedCondition)
            MP_Core.XMLCclRequestWrapper(component, "mp_get_quality_measures", sendAr, true);

        },
        RenderComponent: function(component , recordData){
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
				qmComponent = component;
                var sHTML = "", countText = "";
                var ar = [];
				var criterion = component.getCriterion();
				var loc = component.getCriterion().static_content;
				var totalOutcomes = recordData.OUTCOMES_COMPLETE.length + recordData.OUTCOMES_INCOMPLETE.length;
   				ar.push("<div class='", MP_Util.GetContentClass(component, totalOutcomes+1), "'>");
  				ar.push ("<div class = 'qm-cbo'><form>" + i18n.QM_CONDITION + "&nbsp&nbsp&nbsp&nbsp<select id='qmTask' onchange='loadCondition(this.form.qmTask)'>")
		
				for (var i = 0; i < recordData.CONDITIONS.length; i++) {
                    if(recordData.CONDITIONS[i].CONDITION_ID == recordData.SELECTED_CONDITION_ID)
                        ar.push("<option value="+recordData.CONDITIONS[i].CONDITION_ID+" selected = 'selected'>"+recordData.CONDITIONS[i].CONDITION_NAME+"</option>")	
                    else
                        ar.push("<option value="+recordData.CONDITIONS[i].CONDITION_ID+">"+recordData.CONDITIONS[i].CONDITION_NAME+"</option>")				
				}
				ar.push ("</select></div>")
				ar.push ("<div id = 'condID'>" )
				ar.push ("<div class='sub-sec'>" )
				ar.push ("<h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title=" + i18n.HIDE_SECTION + ">-</span><span class='sub-sec-title'>" + i18n.QM_INCOMPLETE + " (", recordData.OUTCOMES_INCOMPLETE.length, ")</span></h3>" )
				ar.push ("<div class='sub-sec-content'>" )
			
				if (recordData.OUTCOMES_INCOMPLETE.length > 0) {
					for (var j = 0; j < recordData.OUTCOMES_INCOMPLETE.length; j++) {						
						ar.push("<dl class='qm-info' onmouseover='showIcon(this)' onmouseout='hideIcon(this)'>")
						ar.push("<dt class='qm-info-hd'><span>measure</span></dt><dd class='qm-ic-name'><span>" + recordData.OUTCOMES_INCOMPLETE[j].OUTCOME_NAME + "</span></dd>")
                        ar.push("<dt class='qm-info-hd'><span>measure</span></dt><dd class='qm-doc'><span class='cmp-doc' onclick='openQMDoc(" + recordData.OUTCOMES_INCOMPLETE[j].FORM_REF_ID + "," + recordData.OUTCOMES_INCOMPLETE[j].FORM_ACT_ID + ")'>&nbsp;</span></dd>")				
						ar.push("</dl>")
					}
				}
				else if (recordData.OUTCOMES_INCOMPLETE.length == 0)
				{
					ar.push("<dl class='qm-info'>")
					ar.push("<dt class= 'qm-info-hd'><span>measure</span></dt><dd class='qm-ic-name'><span>" + i18n.NO_RESULTS_FOUND + "</span></dd>")
					ar.push("</dl>")	
				}
				ar.push ("</div>" )
				ar.push ("</div>" )

				ar.push ("<div class='sub-sec'>" )
				ar.push ("<h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title=" + i18n.HIDE_SECTION + ">-</span><span class='sub-sec-title'>" + i18n.QM_COMPLETE + " (", recordData.OUTCOMES_COMPLETE.length, ")</span></h3>" )
				ar.push ("<div class='sub-sec-content'>" )
        		ar.push ("<dl class='qm-info'>" )
		
			if (recordData.OUTCOMES_COMPLETE.length > 0) {
					for (var k = 0; k < recordData.OUTCOMES_COMPLETE.length; k++) {
						var icon = ""; 
                        
						if (  recordData.OUTCOMES_COMPLETE[k].LAST_MET_IND == 0)
							icn = loc+ "\\images\\6376_16.png"						
						else  if (  recordData.OUTCOMES_COMPLETE[k].LAST_MET_IND == 1)
							icn = loc+ "\\images\\4022_16.png"
						
						ar.push("<dl class='qm-info' onmouseover='showIcon(this)' onmouseout='hideIcon(this)'>")
						ar.push ("<dt class='qm-info-hd'>icon</dt><dd class='qm-cmp-icon'><img src='" + icn + "' /></dd>")
						ar.push("<dt class='qm-info-hd'><span>measure</span></dt><dd class='qm-cmp-name'><span>" + recordData.OUTCOMES_COMPLETE[k].OUTCOME_NAME + "</span></dd>")                                                                
						ar.push("<dt class='qm-info-hd'><span>measure</span></dt><dd class='qm-doc'><span class='cmp-doc' onclick='openQMDoc("+ recordData.OUTCOMES_COMPLETE[k].FORM_REF_ID + "," + recordData.OUTCOMES_COMPLETE[k].FORM_ACT_ID +")'>&nbsp;</span></dd>")                        						
						ar.push("</dl>")
					}
				}
				else if (recordData.OUTCOMES_COMPLETE.length == 0){
					ar.push("<dl class='qm-info'>")
					ar.push("<dt class= 'qm-info-hd'><span>measure</span></dt><dd class='qm-cmp-name'><span>" + i18n.NO_RESULTS_FOUND + "</span></dd>")
					ar.push("</dl>")	
				}
        		ar.push ("</div>" )
				ar.push ("</div>" )
    			ar.push("</div>"); //qm
				ar.push("</div>"); //content
                sHTML = ar.join("");
              	countText = "(" +totalOutcomes +")"
                var compNS = component.getStyles().getNameSpace();
                MP_Util.Doc.FinalizeComponent(sHTML, component, countText);
            } 
            catch (err) {
                if (timerRenderComponent) {
                    timerRenderComponent.Abort();
                    timerRenderComponent = null;
                }
                throw (err);
            }
            finally {
                if (timerRenderComponent) 
                    timerRenderComponent.Stop();
            }
        }
    };
   
}();

function loadCondition (id){
	var selected_condition = id.value;
 	var gid = document.getElementById('condID')
	gid.className = 'qm-cond';
	CERN_QUALITY_MEASURES_O1.GetQualityMeasuresTable(qmComponent, selected_condition);
}

function openQMDoc(formRefID, formActID)
{
 	var criterion = qmComponent.getCriterion();
    var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + formRefID + "|" + formActID + "|0";
    javascript: MPAGES_EVENT("POWERFORM", paramString);
}

function showIcon(id)
{
	Util.Style.acss(id, "has-icon")
   
}

function hideIcon(id)
{
	Util.Style.rcss(id, "has-icon")
 
}   

function DischargePlanningComponentStyle(){
    this.initByNamespace("cm");
}

DischargePlanningComponentStyle.inherits(ComponentStyle);
/*
 * Project: rcm_discharge_planning_o1.js
 * Version 1.0.0
 * Released 9/21/2010
 * @param {Criterion} criterion
 * @author Justin Rosendahl
 */
function DischargePlanningComponent(criterion){

    this.setCriterion(criterion);
    this.setStyles(new DischargePlanningComponentStyle());
	
	this.setComponentLoadTimerName("USR:MPG.NW-CM-DISCHARGE-PLANNING.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.NW-CM-DISCHARGE-PLANNING.O1 - render component");
	
	this.setIncludeLineNumber(true);
	this.setScope(2);
	
    DischargePlanningComponent.method("InsertData", function(){
        CERN_DischargePlanningInfo.getDischargePlanningData(this);
    });
    DischargePlanningComponent.method("HandleSuccess", function(recordData){
        CERN_DischargePlanningInfo.RenderComponent(this, recordData);
    });
	
	DischargePlanningComponent.method("setDischScreenPlan", function(value){
		this.m_dischScreenPlanCodes = value;
	});
	DischargePlanningComponent.method("addDischScreenPlan", function(value){
		if(this.m_dischScreenPlanCodes == null)
			this.m_dischScreenPlanCodes = [];
		this.m_dischScreenPlanCodes.push(value);			
	});
	DischargePlanningComponent.method("getDischScreenPlan", function(){
		 return this.m_dischScreenPlanCodes ;
	});
	
	DischargePlanningComponent.method("setDischDisposition", function(value){
		this.m_dischDispositionCodes = value;
	});
	DischargePlanningComponent.method("addDischDisposition", function(value){
		if(this.m_dischDispositionCodes == null)
			this.m_dischDispositionCodes = [];
		this.m_dischDispositionCodes.push(value);			
	});
	DischargePlanningComponent.method("getDischDisposition", function(){
		 return this.m_dischDispositionCodes ;
	});
	
	DischargePlanningComponent.method("setDocTransArrangement", function(value){
		this.m_docTransArrangementCodes = value;
	});
	DischargePlanningComponent.method("addDocTransArrangement", function(value){
		if(this.m_docTransArrangementCodes == null)
			this.m_docTransArrangementCodes = [];
		this.m_docTransArrangementCodes.push(value);			
	});
	DischargePlanningComponent.method("getDocTransArrangement", function(){
		 return this.m_docTransArrangementCodes ;
	});
	
	DischargePlanningComponent.method("setProfSkillServices", function(value){
		this.m_profSkillServicesCodes = value;
	});
	DischargePlanningComponent.method("addProfSkillServices", function(value){
		if(this.m_profSkillServicesCodes == null)
			this.m_profSkillServicesCodes = [];
		this.m_profSkillServicesCodes.push(value);			
	});
	DischargePlanningComponent.method("getProfSkillServices", function(){
		 return this.m_profSkillServicesCodes ;
	});
	
	DischargePlanningComponent.method("setDurableMedEquipment", function(value){
		this.m_durableMedEquipmentCodes = value;
	});
	DischargePlanningComponent.method("addDurableMedEquipment", function(value){
		if(this.m_durableMedEquipmentCodes == null)
			this.m_durableMedEquipmentCodes = [];
		this.m_durableMedEquipmentCodes.push(value);			
	});
	DischargePlanningComponent.method("getDurableMedEquipment", function(){
		 return this.m_durableMedEquipmentCodes ;
	});
	
	DischargePlanningComponent.method("setDurableMedEquipmentCoordinated", function(value){
		this.m_durableMedEquipmentCoordinatedCodes = value;
	});
	DischargePlanningComponent.method("addDurableMedEquipmentCoordinated", function(value){
		if(this.m_durableMedEquipmentCoordinatedCodes == null)
			this.m_durableMedEquipmentCoordinatedCodes = [];
		this.m_durableMedEquipmentCoordinatedCodes.push(value);			
	});
	DischargePlanningComponent.method("getDurableMedEquipmentCoordinated", function(){
		 return this.m_durableMedEquipmentCoordinatedCodes ;
	});
	
	DischargePlanningComponent.method("setPlannedDischDate", function(value){
		this.m_plannedDischDateCodes = value;
	});
	DischargePlanningComponent.method("addPlannedDischDate", function(value){
		if(this.m_plannedDischDateCodes == null)
			this.m_plannedDischDateCodes = [];
		this.m_plannedDischDateCodes.push(value);			
	});
	DischargePlanningComponent.method("getPlannedDischDate", function(){
		 return this.m_plannedDischDateCodes ;
	});
	
	DischargePlanningComponent.method("setAdmissionMIMSigned", function(value){
		this.m_admissionMIMSignedCodes = value;
	});
	DischargePlanningComponent.method("addAdmissionMIMSigned", function(value){
		if(this.m_admissionMIMSignedCodes == null)
			this.m_admissionMIMSignedCodes = [];
		this.m_admissionMIMSignedCodes.push(value);			
	});
	DischargePlanningComponent.method("getAdmissionMIMSigned", function(){
		 return this.m_admissionMIMSignedCodes ;
	});
	
	DischargePlanningComponent.method("setDischMIMGiven", function(value){
		this.m_dischMIMGivenCodes = value;
	});
	DischargePlanningComponent.method("addDischMIMGiven", function(value){
		if(this.m_dischMIMGivenCodes == null)
			this.m_dischMIMGivenCodes = [];
		this.m_dischMIMGivenCodes.push(value);			
	});
	DischargePlanningComponent.method("getDischMIMGiven", function(){
		 return this.m_dischMIMGivenCodes ;
	});
}

DischargePlanningComponent.inherits(MPageComponent);

/**
 * @author JR4171
 */
var CERN_DischargePlanningInfo = function(){
    return {
	
        getDischargePlanningData: function(component){
            var sendAr = [];
            var criterion = component.getCriterion();
            var groups = component.getGroups();
            var events = [];
            
			var dc_dc_plan = "", dc_dc_disp = "", dc_transp_arrange = "", dc_prof_skill_ant = "", dc_dme_ant = "", dc_dme_coord = "";
			var dc_plan_dc_dt_tm = "", dc_adm_mim ="", dc_disch_mim = "";
						
			dc_dc_plan = (component.getDischScreenPlan()!= null)  ? component.getDischScreenPlan() : "";
            dc_dc_disp =( component.getDischDisposition()!= null)  ? component.getDischDisposition() : "";
            dc_transp_arrange = (component.getDocTransArrangement()!= null)  ? component.getDocTransArrangement() : "";
            dc_prof_skill_ant = (component.getProfSkillServices()!= null)  ? component.getProfSkillServices() : "";
            dc_dme_ant = (component.getDurableMedEquipment()!= null)  ? component.getDurableMedEquipment() : "";
            dc_dme_coord = (component.getDurableMedEquipmentCoordinated()!= null)  ? component.getDurableMedEquipmentCoordinated() : "";
            dc_plan_dc_dt_tm = (component.getPlannedDischDate()!= null) ? component.getPlannedDischDate() : "";
            dc_adm_mim = (component.getAdmissionMIMSigned()!= null)  ? component.getAdmissionMIMSigned() : "";
            dc_disch_mim = (component.getDischMIMGiven()!= null) ? component.getDischMIMGiven() : "";

			if (dc_dc_plan != "")
				events.push(dc_dc_plan);
			if (dc_dc_disp != "")
				events.push(dc_dc_disp);
			if (dc_transp_arrange != "")
				events.push(dc_transp_arrange);
			if (dc_prof_skill_ant != "")
				events.push(dc_prof_skill_ant);
			if (dc_dme_ant != "")
				events.push(dc_dme_ant);
			if (dc_dme_coord != "")
				events.push(dc_dme_coord);
			if (dc_plan_dc_dt_tm != "")
				events.push(dc_plan_dc_dt_tm);
			if (dc_adm_mim != "")
				events.push(dc_adm_mim);
			if (dc_disch_mim != "")
				events.push(dc_disch_mim);
				
			var sEvents = (events != null) ? "value(" + events.join(",") + ")" : "0.0";
			
            sendAr.push("^MINE^", criterion.person_id + ".0", +criterion.encntr_id + ".0", "0", sEvents); 
            MP_Core.XMLCclRequestWrapper(component, "RCM_MPC_DISCHARGE_PLAN", sendAr, true);
        },
        
        RenderComponent: function(component, recordData){
			var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
			
			try{
				var admitMimSignedDtTm = "", dischargeMimSignedDtTm = "", plannedDischDtTm = "", sHTML = ""; 
	
				var dc_dc_plan_arr = [], dc_dc_disp_arr = [], dc_transp_arrange_arr = [], dc_prof_skill_ant_arr = [], dc_dme_ant_arr = [], dc_dme_coord_arr = [];
				var dc_plan_dc_dt_tm_arr = [], dc_adm_mim_arr = [], dc_disch_mim_arr = [];
				
				var doc_plan_screen = "", planned_disch_disp = "", transportation_arranged = "", prof_skill_anticipated = "", dme_anticipated = "", dme_coord = ""; 
				var plannedDischDtTm = "", admitMimSignedDtTm = "", dischargeMimSignedDtTm = "";
				
				var jsHTML = [];
				var dateTime = new Date();
				var recordValue = ""
				
				var dischargeInfo = recordData.DISCHARGE_PLANNING;
				var displayValue = "";
				var eventType = "";
				
				dc_dc_plan_arr = (component.getDischScreenPlan()!= null)  ? component.getDischScreenPlan() : "";
				dc_dc_disp_arr = (component.getDischDisposition()!= null)  ? component.getDischDisposition() : "";
				dc_transp_arrange_arr = (component.getDocTransArrangement()!= null)  ? component.getDocTransArrangement() : "";
				dc_prof_skill_ant_arr = (component.getProfSkillServices()!= null)  ? component.getProfSkillServices() : "";
				dc_dme_ant_arr =( component.getDurableMedEquipment()!= null)  ? component.getDurableMedEquipment() : "";
				dc_dme_coord_arr = (component.getDurableMedEquipmentCoordinated()!= null)  ? component.getDurableMedEquipmentCoordinated() : "";
				dc_plan_dc_dt_tm_arr = (component.getPlannedDischDate()!= null)  ? component.getPlannedDischDate() : "";
				dc_adm_mim_arr = (component.getAdmissionMIMSigned()!= null)  ? component.getAdmissionMIMSigned() : "";
				dc_disch_mim_arr = (component.getDischMIMGiven()!= null)  ? component.getDischMIMGiven() : "";
			
				for (i=0; i < recordData.QUAL.length; i++){
					eventType = recordData.QUAL[i].EVENT_TYPE; 
					if(eventType == "TXT"){
						displayValue = recordData.QUAL[i].TEXT;
					}
					else if(eventType == "DATE"){
						displayValue = recordData.QUAL[i].DATE_VAL;
						if (displayValue != null && displayValue != "") {
							dateTime.setISO8601(displayValue);
							displayValue = dateTime.format("shortDate2");
						}
						else {
							displayValue = "";
						}
					}
					else{
						displayValue = recordData.QUAL[i].EVENT_END_DATE;
						if (displayValue != null && displayValue != "") {
							dateTime.setISO8601(displayValue);
							displayValue = dateTime.format("shortDate2");
						}
						else {
							displayValue = "";
						}
					}
					if(displayValue != ""){
						recordValue = recordData.QUAL[i].VALUE

						for (x=0; x < dc_dc_plan_arr.length; x++){
							if(recordValue == dc_dc_plan_arr[x]){
								if(doc_plan_screen == "")
									doc_plan_screen = displayValue;
								else
									doc_plan_screen += "," + displayValue;
								break;
							}
					
						}

						for (x=0; x < dc_dc_disp_arr.length; x++){
							if(recordValue == dc_dc_disp_arr[x]){
								if(planned_disch_disp == "")
									planned_disch_disp = displayValue;
								else
									planned_disch_disp += "," + displayValue;
								break;
							}
						}
						
						for (x=0; x < dc_transp_arrange_arr.length; x++){
							if(recordValue == dc_transp_arrange_arr[x]){
								if(transportation_arranged == "")
									transportation_arranged = displayValue;
								else
									transportation_arranged += "," + displayValue;
								break;
							}
						}
						for (x=0; x < dc_prof_skill_ant_arr.length; x++){
							if(recordValue == dc_prof_skill_ant_arr[x]){
								if(prof_skill_anticipated == "")
									prof_skill_anticipated = displayValue;
								else
									prof_skill_anticipated += "," + displayValue;
								break;
							}
						}
				
						for (x=0; x < dc_dme_ant_arr.length; x++){
							if(recordValue == dc_dme_ant_arr[x]){
								if(dme_anticipated == "")
									dme_anticipated = displayValue;
								else
									dme_anticipated += "," + displayValue;
								break;
							}
						}
					
						for (x=0; x < dc_dme_coord_arr.length; x++){
							if(recordValue == dc_dme_coord_arr[x]){
								if(dme_coord == "")
									dme_coord = displayValue;
								else 
									dme_coord += "," + displayValue;
								break;
							}
						}

						for (x=0; x < dc_plan_dc_dt_tm_arr.length; x++){
							if(recordValue == dc_plan_dc_dt_tm_arr[x]){
								if(plannedDischDtTm == "")
									plannedDischDtTm = displayValue;
								else
									plannedDischDtTm += "," + displayValue;
								break;
							}
						}

						for (x=0; x < dc_adm_mim_arr.length; x++){
							if(recordValue == dc_adm_mim_arr[x]){
								if(admitMimSignedDtTm == "")
									admitMimSignedDtTm = displayValue;
								else 
									admitMimSignedDtTm += "," + displayValue;
								break;
							}
						}

						for (x=0; x < dc_disch_mim_arr.length; x++){
							if(recordValue == dc_disch_mim_arr[x]){
								if(dischargeMimSignedDtTm == "")
									dischargeMimSignedDtTm = displayValue;
								else
									dischargeMimSignedDtTm += "," + displayValue;
								break;
							}
						}
					}

				}
				var rcmdisRowCount = 0;
				
				if (recordData.FIN_CLASS == "MEDICARE") {
					rcmdisRowCount = 11;
				}else{
					rcmdisRowCount = 9;
				}
				
				jsHTML.push("<div class='", MP_Util.GetContentClass(component,rcmdisRowCount), "'>");
				jsHTML.push("<dl class='cm-info'><dt><span>", i18n.CUR_DOC_PLAN_SCREEN, ":</span></dt><dd class='cm-detail'><span>", doc_plan_screen, "</span></dd></dl>");	
				jsHTML.push("<dl class='cm-info'><dt><span>", i18n.PLANNED_DISCHARGE_DISP, ":</span></dt><dd class='cm-detail'><span>", planned_disch_disp, "</span></dd></dl>");	
				jsHTML.push("<dl class='cm-info'><dt><span>", i18n.TRANSPORATION_ARRANGED, ":</span></dt><dd class='cm-detail'><span>", transportation_arranged, "</span></dd></dl>");				
				if (recordData.FIN_CLASS == "MEDICARE") {
					jsHTML.push("<dl class='cm-info'><dt><span>", i18n.MIM_SIGNED, ":</span></dt><dd class='cm-detail'><span>", admitMimSignedDtTm, "</span></dd></dl>");				
					jsHTML.push("<dl class='cm-info'><dt ><span>", i18n.DISCHARGE_MIM_SIGNED, ":</span></dt><dd class='cm-detail'><span>", dischargeMimSignedDtTm, "</span></dd></dl>");				
				}
	
				jsHTML.push("<dl class='cm-info'><dt><span>", i18n.PROFSKILLEDSERVICESANTICIPATED, ":</span></dt><dd class='cm-detail'><span>", prof_skill_anticipated, "</span></dd></dl>");				
				jsHTML.push("<dl class='cm-info'><dt><span>", i18n.DME_ANTICIPATED, ":</span></dt><dd class='cm-detail'><span>", dme_anticipated, "</span></dd></dl>");				
				jsHTML.push("<dl class='cm-info'><dt><span>", i18n.DME_COORD, ":</span></dt><dd class='cm-detail'><span>", dme_coord, "</span></dd></dl>");				
				jsHTML.push("<dl class='cm-info'><dt><span>", i18n.PLANNED_DISCHARGE_DT_TM, ":</span></dt><dd class='cm-detail'><span>", plannedDischDtTm, "</span></dd></dl>");				
				jsHTML.push("<dl class='cm-info'><dt><span>", i18n.DISCHARGE_PLANNER, ":</span></dt><dd class='cm-detail'><span>", recordData.DISCH_PLANNER, "</span></dd></dl>");
				// currentlly a hack to get the last row to show in the div because of the Selected Visit row 
				jsHTML.push("<dl class='cm-info'><dt><span></span></dt><dd class='cm-detail'><span></span></dd></dl>");				
	
				jsHTML.push("</div>")
				sHTML = jsHTML.join("");				
				countText ="&nbsp;";
				MP_Util.Doc.FinalizeComponent(sHTML, component, countText);
				return;
			}
			catch (err) {
                if (timerRenderComponent) {
                    timerRenderComponent.Abort();
                    timerRenderComponent = null;
                }
                throw (err);
            }
            finally {
                if (timerRenderComponent) 
                    timerRenderComponent.Stop();
            }
        } 
    };
}(); 
/**
 * Project: mp_results_o1.js
 * Version 1.0.0
 * Released 10/04/2010
 * @author Randy Rogers
 */
function ResultsComponentStyle(){
    this.initByNamespace("rslt");
}

ResultsComponentStyle.inherits(ComponentStyle);

function ResultsComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new ResultsComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.RESULTS.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.RESULTS.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
    this.setLookbackUnits(24);
    this.setLookbackUnitTypeFlag(1);
    
    ResultsComponent.method("InsertData", function(){
        CERN_RESULTS_O1.GetResultsTable(this);
    });
    ResultsComponent.method("HandleSuccess", function(recordData){
        CERN_RESULTS_O1.RenderComponent(this, recordData);
    });
}

ResultsComponent.inherits(MPageComponent);

var CERN_RESULTS_O1 = function(){
    return {
        GetResultsTable: function(component){
            var groups = component.getGroups();
            var events = (groups != null && groups.length > 0) ? groups[0].getEventSets() : null;
            var sEventSet = (events != null) ? "value(" + events.join(",") + ")" : "0.0";
            var criterion = component.getCriterion();
            
            var sendAr = [];
            
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", 1, sEventSet, 0);
            sendAr.push("^measurement^", component.getLookbackUnits(), criterion.position_cd + ".0", criterion.ppr_cd + ".0", component.getLookbackUnitTypeFlag());
            MP_Core.XMLCclRequestWrapper(component, "MP_GET_N_RESULTS", sendAr, true);
        },
        
        getNormalcy: function(measurement){
            if (measurement.NORMALCY_CD > 0) {
                switch (measurement.NORMALCY_CD_MEAN) {
                    case "LOW":
                        normalcyIcon = "<span class='lo'></span></dd><dd class ='rslt-lo'>";
                        break;
                    case "HIGH":
                        normalcyIcon = "<span class='hi'></span></dd><dd class ='rslt-hi'>";
                        break;
                    case "CRITICAL":
                    case "PANICHIGH":
                    case "PANICLOW":
                    case "EXTREMEHIGH":
                    case "EXTREMELOW":
                        normalcyIcon = "<span class='crit'></span></dd><dd class ='rslt-crit'>";
                        break;
                    default:
                        normalcyIcon = "<span>&nbsp</span></dd><dd class ='rslt-norm'>";
                }
            }
            else {
                normalcyIcon = "<span>&nbsp</span></dd><dd class ='rslt-norm'>";
            }
            return normalcyIcon
            
        },
        RenderComponent: function(component, recordData){
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
                var sHTML = "", countText = "";
                var ar = [];
                var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                var results = recordData.RESULTS;
                var icnStr = "";
                ar.push("<div class='", MP_Util.GetContentClass(component, results.length), "'>");
                
                results.sort(SortByNormalcy);
                
                for (var i = 0, l = results.length; i < l; i++) {
                    for (var j=0,jl=results[i].CLINICAL_EVENTS.length;j<jl;j++) {
                        var display = "", sDate = "";
                        var meas = results[i].CLINICAL_EVENTS[j];
                        for (var k = 0, m = meas.MEASUREMENTS.length; k < m; k++) {
                            icnStr = CERN_RESULTS_O1.getNormalcy(meas.MEASUREMENTS[k])
                        }
                        if (meas.EVENT_CD != "") {
                            var ecObj = MP_Util.GetValueFromArray(meas.EVENT_CD, codeArray);
                            display = ecObj.display;
                        }
                        ar.push("<dl class ='rslt-info'><dt class ='rslt-disp-lbl'>", display, "</dt><dd class = 'rslt-disp'><span>", display, "</span></dd><dt class ='rslt-res-lbl'>", i18n.RESULT, " </dt>")
                        if (meas.EFFECTIVE_DATE != "") {
                            var dateTime = new Date();
                            dateTime.setISO8601(meas.EFFECTIVE_DATE);
                            sDate = dateTime.format("longDateTime2")
                        }
                        for (var k = 0, m = meas.MEASUREMENTS.length; k < m; k++) {
                            var result = MP_Util.Measurement.GetString(meas.MEASUREMENTS[k], codeArray, "longDateTime2");
                            ar.push("<dd class= 'rslt-icn'>", icnStr, result, "</span></dd><dt class= 'rsltdate'>", sDate, " </dt><dd class ='rslt-dt'>", sDate, "</dd></dl>")
                        }
                    }
                }
                
                ar.push("</div>");
                
                sHTML = ar.join("");
                countText = MP_Util.CreateTitleText(component, results.length);
                MP_Util.Doc.FinalizeComponent(sHTML, component, countText);
            } 
            catch (err) {
                if (timerRenderComponent) {
                    timerRenderComponent.Abort();
                    timerRenderComponent = null;
                }
                throw (err);
            }
            finally {
                if (timerRenderComponent) 
                    timerRenderComponent.Stop();
            }
        }
    };
    function SortByNormalcy(a, b){
        //Primary sort on normalcy mean, secondary sort on effective date desc
        var mean1 = GetNormalcyWeight(a);
        var mean2 = GetNormalcyWeight(b);
        
        if (mean1 > mean2) 
            return -1;
        else if (mean1 < mean2) 
            return 1;
        else 
            return SortByEffectiveEndDate(a, b);
    }
    
    function SortByEffectiveEndDate(a, b){
        var aPart = GetClinEventPart(a);
        var bPart = GetClinEventPart(b);
        if (aPart) 
            var aDate = aPart.EFFECTIVE_DATE;
        if (bPart) 
            var bDate = bPart.EFFECTIVE_DATE;
        
        if (aDate > bDate) 
            return -1;
        else if (aDate < bDate) 
            return 1;
        else 
            return 0;
    }
    
    function GetNormalcyWeight(result){
        for (var x = result.CLINICAL_EVENTS.length; x--;) {
            var event = result.CLINICAL_EVENTS[x];
            for (var y = event.MEASUREMENTS.length; y--;) {
                var meas = event.MEASUREMENTS[y];
            }
        }
        switch (meas.NORMALCY_CD_MEAN) {
            case "CRITICAL":
            case "PANICHIGH":
            case "PANICLOW":
            case "EXTREMEHIGH":
            case "EXTREMELOW":
                return 1;
            default:
                return 0;
        }
    }
    
    function GetClinEventPart(result){
        var returnPart = null;
        for (var x = result.CLINICAL_EVENTS.length; x--;) {
            var part = result.CLINICAL_EVENTS[x];
            if (returnPart == null || part.EFFECTIVE_DATE > returnPart.EFFECTIVE_DATE) 
                returnPart = part;
        }
        return (returnPart);
    }
    
}();
/**
 * Project: mp_social_o1.js
 * Version 1.0.0
 * Released 10/04/2010
 * @author Randy Rogers
 */
function SocialComponentStyle(){
    this.initByNamespace("soc");
}

SocialComponentStyle.inherits(ComponentStyle);

function SocialComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new SocialComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.SOCIAL.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.SOCIAL.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
    
    SocialComponent.method("InsertData", function(){
        CERN_SOCIAL_O1.GetSocialTable(this);
    });
    SocialComponent.method("HandleSuccess", function(recordData){
        CERN_SOCIAL_O1.RenderComponent(this, recordData);
    });
    SocialComponent.method("openTab", function(){
        var criterion = this.getCriterion();
        var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + 0 + "|0|0";
        javascript: MPAGES_EVENT("POWERFORM", paramString);
        this.InsertData();
    });
    
    SocialComponent.method("openDropDown", function(formID){
        var criterion = this.getCriterion();
        var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + formID + "|0|0";
        javascript: MPAGES_EVENT("POWERFORM", paramString);
        CERN_SOCIAL_O1.GetSocialTable(this);
    });
}

SocialComponent.inherits(MPageComponent);

var CERN_SOCIAL_O1 = function(){
    return {
        GetSocialTable: function(component){
            var groups = component.getGroups();
            var events = (groups != null && groups.length > 0) ? groups[0].getEventSets() : null;
            var sEventSet = (events != null) ? "value(" + events.join(",") + ")" : "0.0";
            var criterion = component.getCriterion();
            
            var sendAr = [];
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", 1, sEventSet, 0);
            sendAr.push("^measurement^", component.getLookbackUnits(), criterion.position_cd + ".0", criterion.ppr_cd + ".0", component.getLookbackUnitTypeFlag());
            
            MP_Core.XMLCclRequestWrapper(component, "MP_GET_N_RESULTS", sendAr, true);
        },
        RenderComponent: function(component, recordData){
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
                var sHTML = "", countText = "";
                var ar = [];
                var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                var results = recordData.RESULTS;
                
                ar.push("<div class='", MP_Util.GetContentClass(component, results.length), "'>");
                
                results.sort(SortByEffectiveEndDate);
                
                for (var i = 0, l = results.length; i < l; i++) {
                    for (var j=0,jl=results[i].CLINICAL_EVENTS.length;j<jl;j++) {
                        var display = "", sDate = "";
                        var meas = results[i].CLINICAL_EVENTS[j];
                        if (meas.EVENT_CD != "") {
                            var ecObj = MP_Util.GetValueFromArray(meas.EVENT_CD, codeArray);
                            display = ecObj.display;
                        }
                        
                        ar.push("<dl class ='soc-info'><dt class ='soc-disp-lbl'>", display, "</dt><dd class ='soc-name'>", display, "</dd><dt class ='soc-res-lbl'>", i18n.RESULT, " </dt><dd class ='soc-res'>")
                        if (meas.EFFECTIVE_DATE != "") {
                            var dateTime = new Date();
                            dateTime.setISO8601(meas.EFFECTIVE_DATE);
                            sDate = dateTime.format("longDateTime2")
                        }
                        for (var k = 0, m = meas.MEASUREMENTS.length; k < m; k++) {
                            var result = MP_Util.Measurement.GetString(meas.MEASUREMENTS[k], codeArray, "longDateTime2");
                            ar.push(result, "</dd><dt class= 'socdate'>", sDate, " </dt><dd class ='soc-dt'>", sDate, "</dd></dl>")
                        }
                    }
                }
                
                ar.push("</div>");
                
                sHTML = ar.join("");
                countText = MP_Util.CreateTitleText(component, results.length);
                
                var compNS = component.getStyles().getNameSpace();
                MP_Util.Doc.FinalizeComponent(sHTML, component, countText);
                
            } 
            catch (err) {
                if (timerRenderComponent) {
                    timerRenderComponent.Abort();
                    timerRenderComponent = null;
                }
                throw (err);
            }
            finally {
                if (timerRenderComponent) 
                    timerRenderComponent.Stop();
            }
        }
    };
    
    function SortByEffectiveEndDate(a, b){
        var aPart = GetClinEventPart(a);
        var bPart = GetClinEventPart(b);
        if (aPart) 
            var aDate = aPart.EFFECTIVE_DATE;
        if (bPart) 
            var bDate = bPart.EFFECTIVE_DATE;
        
        if (aDate > bDate) 
            return -1;
        else if (aDate < bDate) 
            return 1;
        else 
            return 0;
    }
    
    function GetClinEventPart(result){
        var returnPart = null;
        for (var x = result.CLINICAL_EVENTS.length; x--;) {
            var part = result.CLINICAL_EVENTS[x];
            if (returnPart == null || part.EFFECTIVE_DATE > returnPart.EFFECTIVE_DATE) 
                returnPart = part;
        }
        return (returnPart);
    }
    
}();
