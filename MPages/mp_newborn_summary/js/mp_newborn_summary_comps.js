/**
 * Project: mp_allergies_o1.js
 * Version 1.1.0
 * Released 9/28/2010
 * @author Greg Howdeshell (GH7199)
 */
function AllergyComponentStyle(){
    this.initByNamespace("al");
}

AllergyComponentStyle.inherits(ComponentStyle);

/**
 * The Allergy component will retrieve all allergies associated to the patient
 *
 * @param {Criterion} criterion
 */
function AllergyComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new AllergyComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.ALLERGY.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.ALLERGY.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(1);
    
    AllergyComponent.method("InsertData", function(){
        CERN_ALLERGY_O1.GetAllergyTable(this);
    });
    AllergyComponent.method("HandleSuccess", function(recordData){
        CERN_ALLERGY_O1.RenderComponent(this, recordData);
    });
    AllergyComponent.method("openTab", function(){
        var criterion = this.getCriterion();
        var sParms = '/PERSONID=' + criterion.person_id + ' /ENCNTRID=' + criterion.encntr_id + ' /FIRSTTAB=^' + this.getLink() + '+^';
        APPLINK(0, criterion.executable, sParms);
        this.InsertData();
    });
}

AllergyComponent.inherits(MPageComponent);

/**
 * Allergy methods
 * @namespace CERN_ALLERGY_O1
 * @static
 * @global
 * @dependencies Script: mp_get_allergies
 */
var CERN_ALLERGY_O1 = function(){
    return {
        GetAllergyTable: function(component){
            var sendAr = [];
            var criterion = component.getCriterion();
            sendAr.push("^MINE^", criterion.person_id + ".0", "0.0", 0, criterion.provider_id + ".0", criterion.ppr_cd + ".0");
            
            MP_Core.XMLCclRequestWrapper(component, "MP_GET_ALLERGIES", sendAr, true);
        },
        RenderComponent: function(component, recordData){
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
                var jsAlHTML = [];
                var alHTML = "";
                var countText = "";
                
                var severityCodeObj, jsSeverity, jsSeverityDisp = "", statusCodeObj;
                var dateTime = new Date();
                var onsetDate = "";
                var datetimeFlag = 0;
                var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
                jsAlHTML.push("<div class='", MP_Util.GetContentClass(component, recordData.ALLERGY.length), "'>");
                var allergyArray = recordData.ALLERGY;
                
                for (var i=0,il=allergyArray.length;i<il;i++) {
                    jsSeverityDisp = "";
                    if (recordData.ALLERGY[i].ONSET_DT_TM != "") {
                        onsetDate = recordData.ALLERGY[i].ONSET_DT_TM;
                        dateTime.setISO8601(onsetDate);
                    }
                    datetimeFlag = recordData.ALLERGY[i].ONSETDATE_FLAG;
                    
                    switch (datetimeFlag) {
                        case 20:
                        case 30:
                            onsetDate = dateTime.format("shortDate3");
                            break;
                        case 40:
                            onsetDate = dateTime.format("shortDate4");
                            break;
                        case 50:
                            onsetDate = dateTime.format("shortDate5");
                            break;
                        case 0:
                            onsetDate = "";
                            break;
                        default:
                            onsetDate = dateTime.format("longDateTime3");
                            break;
                    }
                    if (recordData.ALLERGY[i].STATUS_CD) {
                        statusCodeObj = MP_Util.GetValueFromArray(recordData.ALLERGY[i].STATUS_CD, codeArray);
                    }
                    
                    if (recordData.ALLERGY[i].SEVERITY_CD) {
                        severityCodeObj = MP_Util.GetValueFromArray(recordData.ALLERGY[i].SEVERITY_CD, codeArray);
                        jsSeverity = severityCodeObj.meaning;
                        jsSeverityDisp = severityCodeObj.display;
                    }
                    if (jsSeverity == "SEVERE" || jsSeverityDisp.toUpperCase() == "ANAPHYLLAXIS") {
                        jsSeverity = "res-severe";
                    }
                    else {
                        jsSeverity = "res-normal";
                    }
                    jsAlHTML.push("<h3 class='al-info-hd'><span class='", jsSeverity, "'>", recordData.ALLERGY[i].NAME, "</span></h3><dl class='al-info'><dt><span>" + i18n.ALLERGY + ":</span></dt><dd class='al-name'><span class='", jsSeverity, "'>", recordData.ALLERGY[i].NAME, "</span></dd><dt><span>" + i18n.REACTION + ":</span></dt><dd class='al-reac'><span class='", jsSeverity, "'>");
                    
                    for (var j = 0, m = recordData.ALLERGY[i].REACTIONS.length; j < m; j++) {
                        if (j > 0) {
                            jsAlHTML.push(", ");
                        }
                        jsAlHTML.push(recordData.ALLERGY[i].REACTIONS[j].REACTION_NAME);
                    }
                    
                    jsAlHTML.push("</span></dd></dl><h4><span class='al-det-hd'>" + i18n.DETAILS + ":</span></h4><div class='hvr'><dl class='al-det'><dt><span>" + i18n.ALLERGY_NAME + ":</span></dt><dd class='al-det-name'><span class='", jsSeverity, "'>", recordData.ALLERGY[i].NAME, "</span></dd><dt><span>" + i18n.REACTION + ":</span></dt><dd class='al-det-reac'><span class='", jsSeverity, "'>");
                    
                    for (var j = 0, m = recordData.ALLERGY[i].REACTIONS.length; j < m; j++) {
                        if (j > 0) {
                            jsAlHTML.push(", ");
                        }
                        jsAlHTML.push(recordData.ALLERGY[i].REACTIONS[j].REACTION_NAME);
                    }
                    
                    jsAlHTML.push("</span></dd><dt><span>", i18n.SEVERITY, ":</span></dt><dd class='al-det-sev'><span class='", jsSeverity, "'>", jsSeverityDisp, "</span></dd><dt><span>", i18n.STATUS, ":</span></dt><dd class='al-det-status'><span>", statusCodeObj.display, "</span></dd><dt><span>", i18n.ONSET_DATE, ":</span></dt><dd class='al-det-dt'><span>", onsetDate, "</span></dd><dt><span>", i18n.COMMENTS, ":</span></dt><dd class='al-det-comment'><span>", MP_Util.Doc.GetComments(allergyArray[i], personnelArray), "</span></dd></dl></div>");
                }
                jsAlHTML.push("</div>")
                alHTML = jsAlHTML.join("");
                countText = MP_Util.CreateTitleText(component, recordData.ALLERGY.length);
                MP_Util.Doc.FinalizeComponent(alHTML, component, countText);
            } 
            catch (err) {
                var errMsg = [];
                errMsg.push("<b>", i18n.JS_ERROR, "</b><br><ul><li>", i18n.MESSAGE, ": ", err.message, "</li><li>", i18n.NAME, ": ", err.name, "</li><li>", i18n.NUMBER, ": ", (err.number & 0xFFFF), "</li><li>", i18n.DESCRIPTION, ": ", err.description, "</li></ul>");
                MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, countText);
                
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
var CERN_NB_DEMO_BANNER_O1 = function(){
    return {
        GetPatientDemographics: function(demoBanner, criterion){
    		timerPatDemLoad = MP_Util.CreateTimer("ENG:MPG.DEMO_BANNER.O1 - load component");
    		if (timerPatDemLoad)
    			timerPatDemLoad.Start();    	
    	
            var info = new XMLCclRequest();
            
            info.onreadystatechange = function(){
                if (info.readyState == 4 && info.status == 200) {
                	var timer = MP_Util.CreateTimer("ENG:MPG.DEMO_BANNER.O1 – render component");
                	try{                		
						var jsHTML = new Array();

	                    var jsonText = JSON.parse(info.responseText);
						var patInfo = jsonText.RECORD_DATA;	  
	                    var gestAge = (patInfo.BIRTH_GEST_AGE !== 0) ? ageFormat(patInfo.BIRTH_GEST_AGE) : i18n_nb.DND;
						var pma = (patInfo.BIRTH_GEST_AGE !== 0) ? ageFormat(patInfo.PMA) : i18n_nb.DND;
						
						function ageFormat(days){
							var weeks = Math.floor(days/7);
							var remDays = days%7;
							return [weeks, i18n_nb.WEEKS, remDays, i18n_nb.DAYS].join(" ");
						}
						
						if(patInfo.DOB == "")
							{jsHTML.push("<dl class='dmg-info'><dt class='dmg-pt-name-lbl'><span>",
								i18n_nb.NAME,"</span></dt><dd class='dmg-pt-name'><span>",
								patInfo.NAME, "</span></dd><dt class='dmg-item'><span>",
								i18n_nb.MRN, ":</span></dt><dd class='dmg-item'><span>", 
								patInfo.MRN, "</span></dd><dt><span>",
								i18n_nb.FIN, ":</span></dt><dd class='dmg-item'><span>",
								patInfo.FIN, "</span></dd></dl>")}
						else
							{jsHTML.push("<dl class='dmg-info'><dt class='dmg-pt-name-lbl'><span>",
								i18n_nb.NAME,"</span></dt><dd class='dmg-pt-name'><span>",
								patInfo.NAME, "</span></dd><dt class='dmg-sex-age-lbl'><span>",
								i18n_nb.GENDER,"</span></dt><dd class='dmg-sex-age'><span>",
								patInfo.GENDER,"</span></dd><dt><span>",
								i18n_nb.DOB, ":</span></dt><dd class='dmg-item'><span>",
								patInfo.DOB, "</span></dd><dt><span>", 
								i18n_nb.MRN, ":</span></dt><dd class='dmg-item'><span>", 
								patInfo.MRN, "</span></dd><dt><span>",
								i18n_nb.FIN, ":</span></dt><dd class='dmg-item'><span>",
								patInfo.FIN, "</span></dd><dt><span>",
								i18n_nb.DAYS_OF_LIFE, ":</span></dt><dd class='dmg-item'><span>",
								patInfo.DAYS_OF_LIFE, "</span></dd><dt><span>",
								i18n_nb.GA_BIRTH, ":</span></dt><dd class='dmg-item'><span>",
								gestAge, "</span></dd><dt><span class='dmg-item'>",
								i18n_nb.PMA, ":</span></dt><dd class='dmg-item'><span>",
								pma, "</span></dd></dl>")};
	
	                    demoBanner.innerHTML = jsHTML.join("");
					}
					finally
					{
						if(timer)
							timer.Stop();

						if (timerPatDemLoad)
							timerPatDemLoad.Stop();						
					}	                    
                }; //if
                            } //function
            //  Call the ccl progam and send the parameter string
            info.open('GET', "MP_NB_GET_PAT_DEMOG", 0);
            var sendVal = "^MINE^, " + criterion.person_id + ".0, " + criterion.provider_id + ".0, " + criterion.encntr_id + ".0, " + criterion.position_cd + ".0";
			info.send(sendVal);
        }
    };
}();
/**
 * Project: mp_diagnoses_o1.js
 * Version 1.1.0
 * Released 7/23/2010
 * @author Greg Howdeshell (GH7199)
 * @author Megha Rao (MR018925)
 * @author Kiran Handi (KH019391)
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
 * Project: mp_diagnostics_o1.js
 * Version 2.0.0
 * Released 9/27/2010
 * @author Greg Howdeshell (GH7199)
 * @author Kiran Handi (KH019391)
 * @author Mark Davenport (MD019066)
 * @author Ryan Wareham (RW012837)
 * @author Sean Turk (ST012419)
 */
function DiagnosticsComponentStyle(){
    this.initByNamespace("dg");
}

DiagnosticsComponentStyle.inherits(ComponentStyle);

function DiagnosticsComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new DiagnosticsComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.DIAGNOSTICS.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.DIAGNOSTICS.O1 - render component");
    this.setIncludeLineNumber(true);
    
    DiagnosticsComponent.method("InsertData", function(){
        var nameSpace = new CERN_DIAGNOSTICS_O1();
        nameSpace.GetDiagnostics(this);
    });
    
    /**
     * Because retreival of diagnostic information within the 'Other Diagnostic' subsection is by
     * event set, the diagnostic component is only retrieving verified items.  The is because
     * get_n_results will only return verified procedure results which mimics what powerchart flowsheet
     * does for diagnostic information.
     */
    DiagnosticsComponent.method("setResultStatusCodes", function(value){
        this.m_resultStatusCodes = value;
    });
    DiagnosticsComponent.method("addResultStatusCode", function(value){
        if (this.m_resultStatusCodes == null) 
            this.m_resultStatusCodes = new Array();
        this.m_resultStatusCodes.push(value);
    });
    DiagnosticsComponent.method("getResultStatusCodes", function(){
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
    DiagnosticsComponent.method("addResultStatusMeaning", function(value){
        if (this.m_resultStatusMeanings == null) 
            this.m_resultStatusMeanings = new Array();
        this.m_resultStatusMeanings.push(value);
    });
    DiagnosticsComponent.method("setResultStatusMeanings", function(value){
        this.m_resultStatusMeanings = value;
    });
}

DiagnosticsComponent.inherits(MPageComponent);

/**
 * Document methods
 * @namespace CERN_DIAGNOSTICS_O1
 * @static
 * @global
 */
var CERN_DIAGNOSTICS_O1 = function(){
    var isErrorLoadingData = false;
    var isDataFound = false;
    var totalResultCount = 0;
    var m_comp = null;
    var m_contentNode = null;
    var m_rootComponentNode = null;
    var m_threadCount = 0;
    return {
        GetDiagnostics: function(component){
            m_comp = component;
            var styles = component.getStyles();
            m_rootComponentNode = component.getRootComponentNode();
            m_contentNode = component.getSectionContentNode();
            
            var groups = component.getGroups();
            var xl = (groups != null) ? groups.length : 0;
            m_threadCount = xl;
            CreateInfoHeader(m_contentNode);
            if (component.getDateFormat() == 3) {
                CreateWithinHeader(m_contentNode);
            }
            
            for (var x = 0; x < xl; x++) {
                var group = groups[x];
                var subSection = CreateSubHeader(group.getGroupName());
                
                //spawn threads
                GetVariousAssessment(group, subSection);
            }
            
            if (m_threadCount == 0) {
                FinalizeComponent();
            }
        }
        
    };
    
    function CreateWithinHeader(contentNode){
        var dl = Util.cep("dl", {
            "className": "dg-info-hdr"
        });
        var dd = Util.cep("dd", {
            "className": "dg-name-hd"
        });
        Util.ac(dd, dl);
        var span = Util.cep("span");
        Util.ac(span, dd);
        
        var txtNbsp = document.createTextNode(String.fromCharCode(160))
        Util.ac(txtNbsp, span);
        
        var ddWithin = Util.cep("dd", {
            "className": "dg-within-hd"
        });
        Util.ac(ddWithin, dl);
        var spanWithin = Util.cep("span");
        Util.ac(spanWithin, ddWithin)
        var txtWithin = document.createTextNode(i18n.WITHIN);
        Util.ac(txtWithin, spanWithin);
        
        Util.ac(dl, contentNode);
    }
    
    
    function CreateInfoHeader(contentNode){
        var dl = Util.cep("dl", {
            "className": "dg-info-hdr"
        });
        var dd = Util.cep("dd", {
            "className": "dg-name-hd"
        });
        Util.ac(dd, dl);
        var span = Util.cep("span");
        Util.ac(span, dd);
        
        var txtNbsp = document.createTextNode(String.fromCharCode(160))
        Util.ac(txtNbsp, span);
        
        var ddWithin = Util.cep("dd", {
            "className": "dg-within-hd"
        });
        Util.ac(ddWithin, dl);
        var spanWithin = Util.cep("span");
        Util.ac(spanWithin, ddWithin)
        var txtWithin = document.createTextNode(i18n.DATE_TIME);
        Util.ac(txtWithin, spanWithin);
        var ddStat = Util.cep("dd", {
            "className": "dg-stat-hd"
        });
        Util.ac(ddStat, dl);
        var spanStat = Util.cep("span");
        Util.ac(spanStat, ddStat);
        var txtStat = document.createTextNode(i18n.STATUS);
        Util.ac(txtStat, spanStat);
        
        Util.ac(dl, contentNode);
    }
    
    function CreateSubHeader(label){
        var subSec = Util.cep("div", {
            "className": "sub-sec"
        });
        var h3 = Util.cep("h3", {
            "className": "sub-sec-hd"
        });
        subSec.appendChild(h3);
        
        var spanTgl = Util.cep("span", {
            "className": "sub-sec-hd-tgl",
            "title": i18n.HIDE_SECTION
        });
        h3.appendChild(spanTgl);
        
        var TgltxtNode = document.createTextNode("-");
        spanTgl.appendChild(TgltxtNode);
        
        var spanTitle = Util.cep("span", {
            "className": "sub-sec-title"
        });
        h3.appendChild(spanTitle);
        
        var labelTextNode = document.createTextNode(label);
        spanTitle.appendChild(labelTextNode);
        
        m_contentNode.appendChild(subSec);
        return (subSec);
    }
    
    function GetNResults(group, subSection, subSecTitle, events){
        var ar = [];
        var info = new XMLCclRequest();
        
        info.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                m_threadCount--;
                
                var strHTML = "", sDate = "", sDateHvr = "", sDisplay = "", sResult = "", sStatus = "";
                var jsonEval = JSON.parse(this.responseText);
                var subCnt = 0;
                if (jsonEval.RECORD_DATA.STATUS_DATA.STATUS == "S") {
                    isDataFound = true;
                    var codeArray = MP_Util.LoadCodeListJSON(jsonEval.RECORD_DATA.CODES);
                    var results = jsonEval.RECORD_DATA.RESULTS;
                    
                    var finalAr = [];
                    if (group.isSequenced() == false) {
                        //need to flatten retuls to sort
                        for (var i = 0, l = results.length; i < l; i++) {
                            var ce = results[i].CLINICAL_EVENTS;
                            if (ce.length > 0) {
                                for (var j = 0, jl = ce.length; j < jl; j++) {
                                    finalAr.push(ce[j]);
                                }
                            }
                        }
                        finalAr.sort(SortByEffectiveDate);
                    }
                    else {
                        for (var i = 0, l = results.length; i < l; i++) {
                            var ce = results[i].CLINICAL_EVENTS;
                            if (ce.length > 0) {
                                ce.sort(SortByEffectiveDate);
                                for (var j = 0, jl = ce.length; j < jl; j++) {
                                    finalAr.push(ce[j]);
                                }
                            }
                        }
                    }
                    if (finalAr.length > 0) {
                        ar.push("<div class='content-body'>");
                        for (var i = 0, il = finalAr.length; i < il; i++) {
                            var event = finalAr[i];
                            if (event.EVENT_CD != "") {
                                var eventObj = MP_Util.GetValueFromArray(event.EVENT_CD, codeArray);
                                sDisplay = eventObj.display;
                            }
                            if (event.EFFECTIVE_DATE != "") {
                                var dateTime = new Date();
                                dateTime.setISO8601(event.EFFECTIVE_DATE);
                                sDate = MP_Util.DisplayDateByOption(m_comp, dateTime);
                                sDateHvr = dateTime.format("longDateTime3");
                            }
                            if (event.STATUS_CD > 0) {
                                var statusObj = MP_Util.GetValueFromArray(event.STATUS_CD, codeArray);
                                sStatus = statusObj.display;
                            }
                            
                            
                            var link = MP_Util.CreateClinNoteLink(event.PERSON_ID, event.ENCNTR_ID, event.EVENT_ID, sDate);
                            ar.push("<h3 class='dg-info-hd'>", sDisplay, "</h3><dl class ='dg-info'><dt><span>" + i18n.DIAGNOSTIC + ":</span></dt><dd class ='dg-name'><span>", sDisplay, "</span></dd><dt><span>", i18n.DATE_TIME, "</span></dt><dd class ='dg-within'>", link, "</dd><dt><span>", i18n.STATUS, ":</span></dt><dd class='dg-stat'><span>", sStatus, "</span></dd></dl>");
                            
                            //Build the hover
                            ar.push("<h4 class='dg-det-hd'><span>", i18n.DIAGNOSTIC_DETAILS, "</span></h4><div class='hvr'><dl class='dg-det'><dt><span>", i18n.STUDY, ":</span></dt><dd><span>", sDisplay, "</span></dd><dt><span>", i18n.DATE_TIME, ":</span></dt><dd><span>", sDateHvr, "</span></dd></dl></div>");
                            
                            subCnt++;
                        }
                        ar.push("</div>");
                        
                        strHTML = ar.join("");
                        subSecTitle[0].innerHTML = group.getGroupName() + " (" + subCnt + ")";
                        
                        totalResultCount += subCnt;
                        
                        var subContent = Util.cep("div", {
                            "className": "sub-sec-content"
                        });
                        subSection.appendChild(subContent);
                        
                        var contentBody = Util.cep("div", {
                            "className": "content-body"
                        });
                        subContent.appendChild(contentBody);
                        contentBody.innerHTML = strHTML;
                    }
                    else {
                        subSecTitle[0].innerHTML = group.getGroupName() + " (0)";
                    }
                }
                else if (jsonEval.RECORD_DATA.STATUS_DATA.STATUS == "Z") {
                    subSecTitle[0].innerHTML = group.getGroupName() + " (0)"
                    var subContent1 = Util.cep("div", {
                        "className": "sub-sec-content"
                    });
                    subSection.appendChild(subContent1);
                    var contentBody1 = Util.cep("div", {
                        "className": "content-body"
                    });
                    subContent1.appendChild(contentBody1);
                    
                    contentBody1.innerHTML = "<div ><span class='res-none'>" + i18n.NO_RESULTS_FOUND + "</span> </div>";
                }
                else if (jsonEval.RECORD_DATA.STATUS_DATA.STATUS != "Z") {
                    isErrorLoadingData = true;
                }
                
                if (m_threadCount == 0) 
                    FinalizeComponent();
            }
            if (this.readyState == 4) {
                MP_Util.ReleaseRequestReference(this);
            }
        }
        var criterion = m_comp.getCriterion();
        info.open('GET', "MP_GET_N_RESULTS");
        
        var encntrOption = (m_comp.getScope() == 2) ? (criterion.encntr_id + ".0") : "0.0";
        var eventCodes = (events != null) ? "value(" + events.join(",") + ")" : "0.0"
        var sendAr = [];
        sendAr.push("^MINE^", criterion.person_id + ".0", encntrOption, criterion.provider_id + ".0", 999, "0.0", eventCodes, "^procedure_result^", m_comp.getLookbackUnits(), criterion.position_cd + ".0", criterion.ppr_cd + ".0", m_comp.getLookbackUnitTypeFlag());
        info.send(sendAr.join(","));
        return;
    }
    
    function GetDocResults(group, subSection, subSecTitle, events){
        var ar = [];
        var info = new XMLCclRequest();
        
        info.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                m_threadCount--;
                
                var strHTML = "", sDate = "", sDateHvr = "", sDisplay = "", sResult = "", sStatus = "";
                var jsonEval = JSON.parse(this.responseText);
                var subCnt = 0;
                if (jsonEval.RECORD_DATA.STATUS_DATA.STATUS == "S") {
                    isDataFound = true;
                    var codeArray = MP_Util.LoadCodeListJSON(jsonEval.RECORD_DATA.CODES);
                    
                    ar.push("<div class='content-body'>");
                    var docs = jsonEval.RECORD_DATA.DOCS;
                    docs.sort(SortByEffectiveDate);
                    for (var i = 0, l = docs.length; i < l; i++) {
                        var ce = docs[i];
                        
                        if (ce.EVENT_CD != "") {
                            var eventObj = MP_Util.GetValueFromArray(ce.EVENT_CD, codeArray);
                            sDisplay = eventObj.display;
                        }
                        if (ce.EFFECTIVE_DATE != "") {
                            var dateTime = new Date();
                            dateTime.setISO8601(ce.EFFECTIVE_DATE);
                            sDate = MP_Util.DisplayDateByOption(m_comp, dateTime);
                            sDateHvr = dateTime.format("longDateTime3");
                        }
                        if (ce.RESULT_STATUS_CD > 0) {
                            var statusObj = MP_Util.GetValueFromArray(ce.RESULT_STATUS_CD, codeArray);
                            sStatus = statusObj.display;
                        }
                        
                        
                        var link = MP_Util.CreateClinNoteLink(ce.PERSON_ID, ce.ENCNTR_ID, ce.EVENT_ID, sDate);
                        ar.push("<h3 class='dg-info-hd'>", sDisplay, "</h3><dl class ='dg-info'><dt><span>" + i18n.DIAGNOSTIC + ":</span></dt><dd class ='dg-name'><span>", sDisplay, "</span></dd><dt><span>", i18n.DATE_TIME, "</span></dt><dd class ='dg-within'>", link, "</dd><dt><span>", i18n.STATUS, ":</span></dt><dd class='dg-stat'><span>", sStatus, "</span></dd><dd class='dg-image'>");
                        if (ce.IMAGE_URL != "") {
                            var urlParam = 'javascript:MPAGES_SVC_EVENT("' + ce.IMAGE_URL + '",^MINE,$PAT_PersonId$^)';
                            ar.push("<a class='dg-image-found' href='", urlParam, "'>&nbsp;</a>");    
                        }
                        else {
                            ar.push("&nbsp;");
                        }
                        ar.push("</dd></dl>");
                        //Build the hover
                        ar.push("<h4 class='dg-det-hd'><span>", i18n.DIAGNOSTIC_DETAILS, "</span></h4><div class='hvr'><dl class='dg-det'><dt><span>", i18n.STUDY, ":</span></dt><dd><span>", sDisplay, "</span></dd><dt><span>", i18n.DATE_TIME, ":</span></dt><dd><span>", sDateHvr, "</span></dd></dl></div>");
                        subCnt++;
                    }
                    ar.push("</div>");
                    
                    strHTML = ar.join("");
                    subSecTitle[0].innerHTML = group.getGroupName() + " (" + subCnt + ")";
                    
                    totalResultCount += subCnt;
                    
                    var subContent = Util.cep("div", {
                        "className": "sub-sec-content"
                    });
                    subSection.appendChild(subContent);
                    
                    var contentBody = Util.cep("div", {
                        "className": "content-body"
                    });
                    subContent.appendChild(contentBody);
                    contentBody.innerHTML = strHTML;
                }
                else if (jsonEval.RECORD_DATA.STATUS_DATA.STATUS == "Z") {
                    subSecTitle[0].innerHTML = group.getGroupName() + " (0)";
                    
                    var subContent1 = Util.cep("div", {
                        "className": "sub-sec-content"
                    });
                    subSection.appendChild(subContent1);
                    var contentBody1 = Util.cep("div", {
                        "className": "content-body"
                    });
                    subContent1.appendChild(contentBody1);
                    
                    contentBody1.innerHTML = "<div ><span class='res-none'>" + i18n.NO_RESULTS_FOUND + "</span> </div>";
                }
                else if (jsonEval.RECORD_DATA.STATUS_DATA.STATUS != "Z") {
                    isErrorLoadingData = true;
                }
                
                if (m_threadCount == 0) 
                    FinalizeComponent();
            }
            if (this.readyState == 4) {
                MP_Util.ReleaseRequestReference(this);
            }
        }
        var criterion = m_comp.getCriterion();
        info.open('GET', "MP_GET_DOCUMENTS");
        var encntrOption = (m_comp.getScope() == 2) ? (criterion.encntr_id + ".0") : "0.0";
        var codes = m_comp.getResultStatusCodes();
        var statusCodes = (codes != null && codes.length > 0) ? "value(" + codes.join(",") + ")" : "0.0";
        var eventCodes = (events != null && events.length > 0) ? "value(" + events.join(",") + ")" : "0.0";
        var sendAr = [];
        sendAr.push("^MINE^", criterion.person_id + ".0", encntrOption, criterion.provider_id + ".0", m_comp.getLookbackUnits(), eventCodes, statusCodes, criterion.position_cd + ".0", criterion.ppr_cd + ".0", m_comp.getLookbackUnitTypeFlag(), 1);
        info.send(sendAr.join(","));
        return;
    }
    
    function GetVariousAssessment(group, subSection){
        var isEventCdDriven = (group instanceof MPageEventCodeGroup) ? true : false;
        var events = null;
        if (isEventCdDriven) 
            events = (group.getEventCodes() != null && group.getEventCodes().length > 0) ? group.getEventCodes() : null;
        else {
            events = (group.getEventSets() != null && group.getEventSets().length > 0) ? group.getEventSets() : null;
        }
        
        var subSecTitle = Util.Style.g("sub-sec-title", subSection, "SPAN")
        if (events == null) {
            subSecTitle[0].innerHTML = group.getGroupName() + " (0)";
            m_threadCount--;
            return;
        }
        
        if (isEventCdDriven) 
            GetNResults(group, subSection, subSecTitle, events);
        else 
            GetDocResults(group, subSection, subSecTitle, events);
    }
    
    function SortByEffectiveDate(a, b){
        if (a.EFFECTIVE_DATE > b.EFFECTIVE_DATE) 
            return -1;
        else if (a.EFFECTIVE_DATE < b.EFFECTIVE_DATE) 
            return 1;
        else 
            return 0;
    }
    
    function FinalizeComponent(){
        var styles = m_comp.getStyles();
        var totalCount = Util.Style.g("sec-total", m_rootComponentNode, "span");
        var sResultText = "";
        if (isErrorLoadingData) {
            m_contentNode.innerHTML = MP_Util.HandleErrorResponse(styles.getNameSpace());
        }
        else if (totalResultCount == 0) {
            sResultText = MP_Util.CreateTitleText(m_comp, totalResultCount);
            m_contentNode.innerHTML = MP_Util.HandleNoDataResponse(styles.getNameSpace());
        }
        else {
            sResultText = MP_Util.CreateTitleText(m_comp, totalResultCount);
            
            var contentHtml = [];
            contentHtml.push("<div class ='", MP_Util.GetContentClass(m_comp, totalResultCount), "'>");
            contentHtml.push(m_contentNode.innerHTML);
            contentHtml.push("</div>");
            m_contentNode.innerHTML = contentHtml.join("");
            
            //init hovers
            MP_Util.Doc.InitHovers(styles.getInfo(), m_contentNode);
            
            //init subsection toggles
            MP_Util.Doc.InitSubToggles(m_contentNode, "sub-sec-hd-tgl");
            //init scrolling
            MP_Util.Doc.InitScrolling(Util.Style.g("scrollable", m_contentNode, "div"), m_comp.getScrollNumber(), 1.6);
            
        }
        totalCount[0].innerHTML = sResultText;
    }
};

/**
 * Project: mp_discharge_plan_o1_nb.js
 * based on mp_disccharge_plan_o1-1.0.2
 * http://scm.discern-abu.cerner.corp/svn/standardized-components/tags/discharge-plan-o1-1.0.2
 * Uses event sets instead of event codes from Bedrock
 */
function DischargePlanComponentStyle(){
    this.initByNamespace("dp");
}

DischargePlanComponentStyle.inherits(ComponentStyle);

function DischargePlanComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new DischargePlanComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.DISCHARGE_PLAN.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.DISCHARGE_PLAN.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
    
    DischargePlanComponent.method("InsertData", function(){
        CERN_DISCHARGE_PLAN_O1.GetDischargePlanTable(this);
    });
    DischargePlanComponent.method("HandleSuccess", function(recordData){
        CERN_DISCHARGE_PLAN_O1.RenderComponent(this, recordData);
    });
}

DischargePlanComponent.inherits(MPageComponent);

var CERN_DISCHARGE_PLAN_O1 = function(){
    return {
        GetDischargePlanTable: function(component){
            var criterion = component.getCriterion();
            var group = component.getGroups()[0];
            var events = (group && group.getEventSets() != null && group.getEventSets().length > 0) ? group.getEventSets() : null;
            var sendAr = [];
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", 1);
            if (events != null) 
                sendAr.push("value(" + events.join(",") + ")");
            else 
                sendAr.push(0);
            sendAr.push(0, "^measurement^", component.getLookbackUnits(), criterion.position_cd + ".0", criterion.ppr_cd + ".0")
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
                
                for (var i = 0, l = results.length; i < l; i++) {
                    for (var j = 0, jl = results[i].CLINICAL_EVENTS.length; j<jl;j++) {
                        var display = "", sDate = "";
                        var meas = results[i].CLINICAL_EVENTS[j];
                        if (meas.EVENT_CD != "") {
                            var ecObj = MP_Util.GetValueFromArray(meas.EVENT_CD, codeArray);
                            display = ecObj.display;
                        }
                        
                        ar.push("<dl class ='dp-info'><dt class ='dp-disp-lbl'>", display, "</dt><dd class ='dp-name'>", display, "</dd><dt class ='dp-res-lbl'>", i18n.RESULT, " </dt><dd class ='dp-res'>")
                        if (meas.EFFECTIVE_DATE != "") {
                            var dateTime = new Date();
                            dateTime.setISO8601(meas.EFFECTIVE_DATE);
                            sDate = dateTime.format("longDateTime2")
                        }
                        for (var k = 0, m = meas.MEASUREMENTS.length; k < m; k++) {
                            var result = MP_Util.Measurement.GetString(meas.MEASUREMENTS[k], codeArray, "longDateTime2");
                            ar.push(result, "</dd><dt class= 'dpdate'>", sDate, " </dt><dd class ='dp-dt'>", sDate, "</dd></dl>")
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
}();
/**
 * Project: mp_documents_base_o1.js
 * Version 2.0.0
 * Released 9/27/2010
 * @author Greg Howdeshell (GH7199)
 * @author Manas Wadke (MW016312)
 * @author Subash Katageri (SK018948)
 * @author Anantha Ramu (AR018249)
 * @author Sean Turk
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
                        jsHTML.push("<dd class='", compNS, "-dt'><span>", MP_Util.CreateClinNoteLink(patId, enctrId, evntId, dt), "</span></dd>");
                    }
                    //retrieve document images
                    jsHTML.push("<dd class='", compNS, "-image'>");
                    if (document.IMAGE_URL != "") {
                        var urlParam = 'javascript:MPAGES_SVC_EVENT("' + document.IMAGE_URL + '",^MINE,$PAT_PersonId$^)';
                        jsHTML.push("<a class='", compNS, "-image-found' href='", urlParam, "'>&nbsp;</a>");
                    }
                    else {
                        jsHTML.push("&nbsp;");
                    }
                    jsHTML.push("</dd></dl>");
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
function EducationComponentStyle(){
    this.initByNamespace("educ");
}

EducationComponentStyle.inherits(ComponentStyle);

function EducationComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new EducationComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.EDUCATION.O1 - load component");
	this.setComponentRenderTimerName("USR:MPG.EDUCATION.O1 - render component");
	this.setIncludeLineNumber(true);

    EducationComponent.method("InsertData", function(){
        CERN_EDUCATION_O1.GetEducationTable(this);
    });
    EducationComponent.method("HandleSuccess", function(recordData){
        CERN_EDUCATION_O1.RenderComponent(this, recordData);
    });
}

EducationComponent.inherits(MPageComponent);

var CERN_EDUCATION_O1 = function(){
    return {
        GetEducationTable: function(component){
            var criterion = component.getCriterion();
			if (!component.getGroups()) {
				return;
			}
            var group = component.getGroups()[0];
			if (!group) {
				return;
			}
            var events = (group.getEventSets() != null && group.getEventSets().length > 0) ? group.getEventSets() : null;

            var sendAr = [];
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", 1);
            if (events != null) 
                sendAr.push("value(" + events.join(",") + ")");
            else 
                sendAr.push(0);
			sendAr.push(0, "^measurement^", component.getLookbackUnits(), criterion.position_cd + ".0", criterion.ppr_cd + ".0")
			MP_Core.XMLCclRequestWrapper(component, "MP_GET_N_RESULTS", sendAr, true)		
			
        },
        RenderComponent: function(component, recordData){
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
                var sHTML = "", countText = "";
                var ar = [];
                var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                var results = recordData.RESULTS;
                ar.push("<div class='", MP_Util.GetContentClass(component, results.length), "'>");
                
                for (var i = 0, l = results.length; i < l; i++) {
					results[i].CLINICAL_EVENTS.each(function(meas){
                        var display = "", sDate = "";
                        if (meas.EVENT_CD != "") {
                            var ecObj = MP_Util.GetValueFromArray(meas.EVENT_CD, codeArray);
                            display = ecObj.display;
                        }
                        
                        ar.push("<dl class ='dp-info'><dt class ='dp-disp-lbl'>", display, "</dt><dd class ='dp-name'>", display, "</dd><dt class ='dp-res-lbl'>", i18n_nb.RESULT, " </dt><dd class ='dp-res'>")
                        if (meas.EFFECTIVE_DATE != "") {
                            var dateTime = new Date();
                            dateTime.setISO8601(meas.EFFECTIVE_DATE);
                            sDate = dateTime.format("longDateTime2")
                        }
                        for (var k = 0, m = meas.MEASUREMENTS.length; k < m; k++) {
                            var result = MP_Util.Measurement.GetString(meas.MEASUREMENTS[k], codeArray, "longDateTime2");
                            ar.push(result, "</dd><dt class= 'dpdate'>", sDate, " </dt><dd class ='dp-dt'>", sDate, "</dd></dl>")
                        }
                    });
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
}();
function BilirubinComponentStyle(){
	this.initByNamespace("blood");
}

BilirubinComponentStyle.inherits(ComponentStyle);

function BilirubinComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new BilirubinComponentStyle());
    this.setIncludeLineNumber(true);
    this.setComponentLoadTimerName("USR:MPG.BILIRUBIN.O1 - load component");
    this.setComponentRenderTimerName("USR:MPG.BILIRUBIN.O1 - render component");
    
    BilirubinComponent.method("InsertData", function(){
        CERN_BILIRUBIN_O1.GetBilirubinTable(this);
    });
    BilirubinComponent.method("HandleSuccess", function(recordData){
        CERN_BILIRUBIN_O1.RenderComponent(this, recordData);
    });
    
}

BilirubinComponent.inherits(MPageComponent);

 /**
  * Bilirubin methods
  * @namespace CERN_BILIRUBIN_O1
  * @static
  * @global
  * @dependencies Script: mp_nbs_hyperbili
  */
var CERN_BILIRUBIN_O1 = function(){
	
	var bilirubinGrapher = function(component, bilirubinData, dob, unitDisplay, photoStart, photoStop) {
		//Private Data and Methods
		//var plot = null; //reference to the plot object returned from jQuery.plot()
		var previousPoint = null;
		
		var componentId = component.getStyles().getContentId();
		var rootId = component.getStyles().getId();
		//Note:
		//It seems that allowing the biligraph element to be augmented by Prototype (for example, by 
		//retrieving it via $) will ruin flot/jQuery's day.  So, beware.  The perils of framework mixing I suppose.
		
		//These hashes are a somewhat dirty hack around the problem that I couldn't find a good way to associate
		//extra data with the datapoints passed to Flot.  We need to know the number of decimal places returned
		//for each datapoint in the JSON in order to accurately display the values in the hover.  (Otherwise all we 
		//have is a Number and we're stuck with how toString or toLocaleString handle precision.  Neither are bad
		//but we can't display the value exactly as documented)  Each hash uses the timestamps of the results from 
		//the two datasets as a key and the value is the number of decimal places to display.  This does mean,
		//unfortunately, that if we have two values in the same dataset at the exact same time that we can't keep a
		//precision for both of them.  We'll use the greatest precision out of all the colliding values to avoid
		//losing precision but it does mean we would get extra trailing zeros on some of them)
		//
		//The correct approach would probably be to write a plugin for Flot to allow associating arbitrary data
		//with the points of a dataset 
		var serumDisplayHash = new Hash();
		var transDisplayHash = new Hash();
		
		var serumLabel = i18n_nb.SERUM_BILIRUBIN + "(" + unitDisplay + ")";
		var transLabel = i18n_nb.TRANS_BILIRUBIN + "(" + unitDisplay + ")";
		
		var base = new Date(dob.getTime());
		var markings = [];
		
		var lowrange = [[20, 4.8], [24,5], [28,5.6], [40,7.8], [44,8.1], [48,8.6], [60,9.6], [72,11.15], [84,11.7], [96,12.4], [120,13.3], [132,13.2]];
		var midrange = [[20, 5.85], [24,6.4], [28,7], [40,9.9], [44,10.15], [48,10.8], [60,12.6], [72,13.45], [84,14.7], [96,15.15], [120,15.85], [132,15.5]];
		var highrange = [[20, 7.4], [24,7.85], [28,8.9], [40,12.15], [44,12.5], [48,13.2], [60,15.2], [72,15.9], [84,16.75], [96,17.45], [120,17.65], [132,17.5]];;
		var lowtail_points = [[132,13.2], [168, 13.2]];
		var midtail_points = [[132,15.5], [168, 15.5]];
		var hightail_points = [[132,17.5], [168, 17.5]];
		var lowpre_points = [[12,3.9],[20, 4.8]];
		var midpre_points = [[12,4.7],[16, 5.3],[20,5.85]];
		var highpre_points = [[12,6.8],[16, 6.4],[20,7.4]];
		
		//x values of the reference sets are in hours of age, need to transform into timestamps offset from DoB
		function transformReferencePoints(dataset) {
			return dataset.map(function(p) {
				var xDate = new Date(dob.getTime())
				xDate.setHours(xDate.getHours()+p[0])
				return [xDate.getTime(), p[1]];
			});
		};
		
		lowrange = transformReferencePoints(lowrange)
		midrange = transformReferencePoints(midrange)
		highrange = transformReferencePoints(highrange)

		
		var endDt = new Date(dob.getTime());
		endDt.setDate(endDt.getDate()+7);
		var biliPoints = buildDataSet(bilirubinData, "SERUM", serumDisplayHash);
		var transPoints = buildDataSet(bilirubinData, "TRANSCUTANEOUS", transDisplayHash);
		
		var plus24 = new Date(dob.getTime());
		plus24.setDate(plus24.getDate()+1);

		var photoStartPoints;
		if (photoStart) {
			photoStartPoints = [[photoStart.getTime(),0],[photoStart.getTime()+5000,25]];
		}

		var photoStopPoints;
		if (photoStop) {
			photoStopPoints = [[photoStop.getTime(),0],[photoStop.getTime()+5000,25]];
		}		
		
		markings = function(axes) {
			var marks = [];
			var x = axes.xaxis.min;
			do {
			  marks.push({xaxis:{from:x, to:x}, yaxis:{from:0,to:.5}, color:'#CCC'});
			  x += 7200000; //2 hours
			} while (x < axes.xaxis.max);
			
			if (photoStart){
				marks.push({ color: '#66FF33', lineWidth: 1, xaxis: { from: photoStart.getTime(), to: photoStart.getTime() } });
			}
			
			if (photoStop){
				marks.push({ color: '#FF0000', lineWidth: 1, xaxis: { from: photoStop.getTime(), to: photoStop.getTime() } });
			}
			
			$R(1,24).each(function(i) {
				marks.push({xaxis:{from:axes.xaxis.min, to:axes.xaxis.max}, yaxis:{from:i,to:i}, color:'#CFCFCF', lineWidth:.5});
			});
			return marks;
			
		}
		
		//markings = [];
		var options = {
			xaxis: {
				mode: "time",
				min: (base.getTime()),
				max: (endDt.getTime()),
				//timeformat: "%H%M",
				//tickSize: [12, "hour"]
				ticks: hourTicksGenerator
			},
			yaxis: {
				min: 0,
				max: 25
			},	
			x2axis: {
				mode: "time",
				min: (base.getTime()),
				max: (endDt.getTime()),				
				timeformat: "%m/%d/%y",
				tickSize: [1, "day"]
			},		
			grid: {
				markings: markings,
				hoverable: true
			},
			legend: {
				noColumns: 3,
				position: "sw",
				margin: [0, 10],
				backgroundOpacity: 0,
				show: false //the color boxes in the legend look odd, suspect IE issue.  good enough for now.
			}
			
		};
		var set = {
			data: biliPoints,
			points: {show: true},
			color: "#99CCFF"
		};
		//haven't found a better way to get a top and bottom xaxis label than to plot the same data twice
		var set2 = {
			data: biliPoints,
			points: {show: true},
			label: serumLabel,		
			xaxis: 2,
			color: "#99CCFF"
		};
		var set3 = {
			data: transPoints,
			points: {show: true},
			label: transLabel,		
			xaxis: 2,
			color: "#FF6633"	
		};
		
		var photoStartLine = {
			data: (photoStart) ? photoStartPoints : [],
			lines: {show: true},
			points: {show: true},
			hoverable: true,
			color: "#66FF33",
			 //using this a quick and dirty hack to have a means to identify the series object
			//in the hover callback without relying on the series index.  Not sure if it's a bad
			//idea to add additional properties to the objects used by Flot, but oh well.
			phototherapyStart:true
		};
		
		var photoStopLine = {
			data: (photoStop) ? photoStopPoints : [],
			lines: {show: true},
			points: {show: true},
			hoverable: true,
			color: "#FF0000",
			 //using this a quick and dirty hack to have a means to identify the series object
			//in the hover callback without relying on the series index.  Not sure if it's a bad
			//idea to add additional properties to the objects used by Flot, but oh well.
			phototherapyStop:true
		};
		
		var low = {
			data: lowrange,
			lines: {show: true},
			points: {show: true, radius: 2},
			hoverable: false, 
			color: "#666"
		};
		var mid = {
			data: midrange,
			lines: {show: true},
			points: {show: true, radius: 2},
			hoverable: false, 
			color: "#666"
		};	
		var high = {
			data: highrange,
			lines: {show: true},
			points: {show: true, radius: 2},
			hoverable: false, 
			color: "#666"
		};	
		var lowtail = {
			data: transformReferencePoints(lowtail_points),
			lines: {show: true, lineWidth: .5},
			hoverable: false, 
			color: "#CCC"
		};
		var midtail = {
			data: transformReferencePoints(midtail_points),
			lines: {show: true, lineWidth: 1},
			hoverable: false, 
			color: "#CCC"
		};
		
		var hightail = {
			data: transformReferencePoints(hightail_points),
			lines: {show: true, lineWidth: 1},
			hoverable: false, 
			color: "#CCC"	
		};		
		

		var lowpre = {
			data: transformReferencePoints(lowpre_points),
			lines: {show: true, lineWidth: 1},
			hoverable: false, 
			color: "#CCC"		
		};

		var midpre = {
			data: transformReferencePoints(midpre_points),
			lines: {show: true, lineWidth: 1},
			hoverable: false, 
			color: "#CCC"
		};

		var highpre = {
			data: transformReferencePoints(highpre_points),
			lines: {show: true, lineWidth: 1},
			hoverable: false, 
			color: "#CCC"		
		};
		
		function buildDataSet(bilirubinData, type, precisionHash) {
			return bilirubinData.inject([], function(results, d){
				var resultDt = new Date();
				resultDt.setISO8601(d.RESULT_DT_TM);
				if (d.TYPE === type){
					results.push([resultDt.getTime(), d.RESULT_VALUE]);
					
					//Using result timestamp and result value as key to hash to handle case 
					//when two results are documented at the exact same time, but have different precision
					var precision = precisionHash.get(resultDt.getTime()+d.RESULT_VALUE);
					if (precision === undefined) {
						precisionHash.set(resultDt.getTime()+d.RESULT_VALUE, d.RESULT_DISPLAY);
					}
				}
				return results;
			});
		}
		
		function hourTicksGenerator(axis){
			var res = [];
			var v = axis.min;
			var i = 0;
			do {
			  res.push([v, i]);
			  i+=12;
			  v += 43200000; //12 hours
			} while (v <= axis.max);
			return res;
		}
		
		function showTooltip(x, y, contents) {
			jQuery('<div id="biligraph-tooltip" class="flot-tooltip">' + contents + '</div>').css( {
				top: y + 5,
				left: x + 5
			}).appendTo("body").fadeIn(200);
		}
		
		function elapsedHours(start, end) {
			//this does seem to account correctly for DST changes
			var elapsedMilliseconds = end - start;
			var hours = elapsedMilliseconds / (1000 * 60 * 60);
			return Math.floor(hours);
		}
		
		function bindHover() {
			var biligraph = jQuery('#biligraph');
			if (!biligraph){
				return;
			}
			
			biligraph.bind("plothover", function (event, pos, item) {
				if (item) {
					if (previousPoint != item.datapoint) {
						previousPoint = item.datapoint;
						
						jQuery("#biligraph-tooltip").remove();
						var x = item.datapoint[0],
							y = item.datapoint[1];

						if (item.series.phototherapyStart) {
							showTooltip(item.pageX, item.pageY, i18n_nb.PHOTOTHERAPY_START);
						}
						else if (item.series.phototherapyStop) {
							showTooltip(item.pageX, item.pageY, i18n_nb.PHOTOTHERAPY_STOP);
						}
						else {
							var dt = new Date(x);	
							var displayHash = (item.series.label === serumLabel) ? serumDisplayHash : transDisplayHash;
							//Hash key is result timestamp + result value
							var display = displayHash.get(x+y);
							
							var tooltipText = i18n_nb.DATE_COLLECTED + " "  + dt.format("longDateTime3", true) + "<br>" +
								i18n_nb.RESULT + " " + display + "<br>" +
								i18n_nb.AGE_HOURS + " " + elapsedHours(dob, dt);
							
							showTooltip(item.pageX, item.pageY, tooltipText);
						}
					}
				}
				else {
					jQuery("#biligraph-tooltip").remove();
					previousPoint = null;            
				}
			});	
		}

		//removing + readding the graph container div and replotting the graph proved to be much too slow
		//especially as more labels were added to the graph.  Had to settle for a fixed size graph and
		//the only pupose of this function now is to draw the graph for the first time in the case where
		//the bilirubin section is loaded as intially collapsed and we can't draw the graph in it at first
		var redrawGraph = function() {
			var biligraph = $('biligraph');
			if (!biligraph && (!jQuery('#' + rootId).hasClass("closed"))){
				drawGraphImpl();
			}
			else{
				return;
			}
			
		};		
		/*var redrawGraph = function() {
			//this might be inefficient but couldn't find a better way to resize the flot graph
			//than to wipe it out and replot it in a new div
			var biligraph = jQuery('#biligraph');
			//TODO - now need to trigger a redraw on section expand, since the graph will still be at
			//the original size it was before the collapse
			//this approach (http://stackoverflow.com/questions/1950038/jquery-fire-event-if-css-class-changed)
			//may work but would require modifying the healthe code to send the trigger when toggling the class
			//as there's no native event for a css class change on an element.
			//This doesn't seem like a huge problem, so leaving it as is for now
			if (biligraph && (!jQuery('#' + rootId).hasClass("closed"))){
				biligraph.remove();
			}
			else{
				return;
			}
			drawGraphImpl();
		};	*/
		
		//Public methods
		var drawGraphImpl = function() {
			//Redrawing the graph on resize just got too slow and without time to see if it could be improved instead we'll
			//just plot it at a fixed size and center it.  383x300 is just big enough to display the entire graph when PowerChart
			//is full screen at 1024x768
		
			//trying to plot the graph into a div with display:none will cause an execption from flot
			//so don't plot if the section is closed. 
			if ((!jQuery('#' + rootId).hasClass("closed"))) {
				jQuery("#"+componentId).append("<div id='biligraph' style='width:383px;height:300px;'></div>");
				var plot = jQuery.plot(jQuery("#biligraph"), [photoStartLine, photoStopLine, low, mid, high, lowtail, midtail, hightail, lowpre, midpre, highpre, set, set2, set3], options)	
				bindHover();
				var o;
				
				o = plot.pointOffset({x: endDt.getTime(), y: 20});
				jQuery('#biligraph').append('<div style="position:absolute;left:' + (o.left - 50) + 'px;top:' + o.top + 'px;color:#666;font-size:smaller">High Risk</div>');			
				o = plot.pointOffset({x: endDt.getTime(), y: 17.4});
				jQuery('#biligraph').append('<div style="position:absolute;left:' + (o.left - 100) + 'px;top:' + o.top + 'px;color:#666;font-size:smaller">High Intermediate Risk</div>');	
				o = plot.pointOffset({x: endDt.getTime(), y: 15});
				jQuery('#biligraph').append('<div style="position:absolute;left:' + (o.left - 100) + 'px;top:' + o.top + 'px;color:#666;font-size:smaller">Low Intermediate Risk</div>');	
				o = plot.pointOffset({x: endDt.getTime(), y: 11.8});
				jQuery('#biligraph').append('<div style="position:absolute;left:' + (o.left - 50) + 'px;top:' + o.top + 'px;color:#666;font-size:smaller">Low Risk</div>');					
				
				o = plot.pointOffset({x: highpre.data[0][0], y: 6.8});
				jQuery('#biligraph').append('<div style="position:absolute;left:' + (o.left - 20) + 'px;top:' + (o.top-10) + 'px;color:#666;font-size:smaller">95%</div>');					
			
				o = plot.pointOffset({x: midpre.data[0][0], y: 4.7});
				jQuery('#biligraph').append('<div style="position:absolute;left:' + (o.left-20) + 'px;top:' + (o.top-10) + 'px;color:#666;font-size:smaller">75%</div>');					
			
				o = plot.pointOffset({x: lowpre.data[0][0], y: 3.9});
				jQuery('#biligraph').append('<div style="position:absolute;left:' + (o.left-20) + 'px;top:' + (o.top-5) + 'px;color:#666;font-size:smaller">40%</div>');							
			
				jQuery("#"+componentId).append("<div id='bilirubin-xaxislabel'>"+i18n_nb.AGE_IN_HOURS+"</div");
				jQuery("#"+componentId).append("<div id='bilirubin-xaxislabel'>"+i18n_nb.BILIRUBIN_COPYRIGHT+"</div");
			}
		}
		
		//Bilirubin Graph object 
		return {
			//draws the graph and hooks the window.onresize event to redraw
			drawGraph : function(){
				drawGraphImpl();		
				//bind to the resize event
				jQuery(window).resize(redrawGraph);
			}
		};

	}

	return {
        GetBilirubinTable : function(component){
			var sendAr = [];
			var criterion = component.getCriterion();
			sendAr.push("^MINE^", 
				criterion.person_id + ".0",
				criterion.provider_id + ".0",
				"0.0", /*Encounter doesn't matter*/
				criterion.position_cd + ".0",
				criterion.ppr_cd + ".0");
			MP_Core.XMLCclRequestWrapper(component, "MP_NBS_HYPERBILI", sendAr, true);
        },
        RenderComponent: function(component, recordData){
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
				var contentId = component.getStyles().getContentId();
				var bloodProd = "<table class='blood-table'>\
									<tr class='sub-sec-hd'><td>"+i18n_nb.RISK_CATEGORY+"</td><td>"+i18n_nb.DATE_RECORDED+"</td></tr>\
									#{risk}\
									<tr class='sub-sec-hd'><td>"+i18n_nb.BLOOD_TYPE_RH+"</td><td>"+i18n_nb.TYPE+"</td></tr>\
									#{bloodtypes}\
									<tr class='sub-sec-hd'><td>"+i18n_nb.PHOTOTHERAPY+"</td><td>"+i18n_nb.DATE_RECORDED+"</td></tr>\
									#{phototherapy}\
									<tr class='sub-sec-hd'><td>"+i18n_nb.TRANSFUSIONS+"</td><td>"+i18n_nb.DATE_PERFORMED+"</td></tr>\
									#{transfusions}\
								</table><div class='bilirubin-legend'>"+"<span class='serum-icon'>o</span><span class='bilirubin-legend-item'>"
								+i18n_nb.SERUM_BILIRUBIN+"("+recordData.BILIRUBIN_UNIT+")"+$R(1,12).collect(function(){return "&nbsp;"}).join("")
								+"</span><span class='trans-icon'>o</span><span class='bilirubin-legend-item'>"+i18n_nb.TRANS_BILIRUBIN+"("+recordData.BILIRUBIN_UNIT+")"+"</span><div>";

				var noResults = "<tr><td>"+i18n_nb.NO_RESULTS_FOUND+"</td><td>&nbsp;</td></tr>";
								
				var transfusions = recordData.TRANSFUSIONS.collect(function(t){
					return "<tr><td>"+t.LABEL+" - "+t.RESULT_VALUE+"</td><td>"+t.RESULT_DT_TM+"</td></tr>";
				}).join("");

				var bloodtypes = recordData.BLOOD_TYPES.collect(function(b){
					return "<tr><td>"+b.LABEL+"</td><td>"+b.RESULT_VALUE+"</td></tr>";
				}).join("");

				var phototherapy = recordData.PHOTOTHERAPY.collect(function(p){
					return "<tr><td>"+p.RESULT_VALUE+"</td><td>"+p.RESULT_DT_TM+"</td></tr>";
				}).join("");
				
				var risk = recordData.RISK_CATEGORY.collect(function(r){
					return "<tr><td>"+r.RESULT_VALUE+"</td><td>"+r.RESULT_DT_TM+"</td></tr>";
				}).join("");
								
				jQuery("#"+contentId).append(bloodProd.interpolate({
					transfusions:(transfusions !== "") ? transfusions : noResults,
					bloodtypes:(bloodtypes !== "") ? bloodtypes : noResults ,
					phototherapy:(phototherapy !== "") ? phototherapy : noResults,
					risk:(risk !== "") ? risk : noResults
				}));	
			
				var dateOfBirth = new Date();
				dateOfBirth.setISO8601(recordData.DOB);
				
				if (recordData.PHOTOTHERAPY_START_DTTM) {
					var photoStart = new Date();
					photoStart.setISO8601(recordData.PHOTOTHERAPY_START_DTTM);
				}
				
				if (recordData.PHOTOTHERAPY_STOP_DTTM) {
					var photoStop = new Date();
					photoStop.setISO8601(recordData.PHOTOTHERAPY_STOP_DTTM);
				}
				
				var bilirubinGraph = bilirubinGrapher(component, recordData.BILIRUBIN_DATAPOINTS, dateOfBirth, recordData.BILIRUBIN_UNIT, photoStart, photoStop);
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
}();


	

/**
 * Project: mp_intake_output_o1.js
 * Version 1.0.2
 * Released 12/2/2010
 * @author Kiran Handi (KH019391)
 * @author Mark Davenport (MD019066)
 * @author Greg Howdeshell (GH7199)
 */
function IntakeOutputStyle(){
    this.initByNamespace("io");
}

IntakeOutputStyle.inherits(ComponentStyle);

/**
 * The Immunizations component will retrieve all Immunizations details associated to the patient
 * @author Kiran Handi
 * @Version 0.19
 * @param {Criterion} criterion
 * @author
 */
function IntakeOutputComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new IntakeOutputStyle());
    this.setComponentLoadTimerName("USR:MPG.IO.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.IO.O1 - render component");
    this.setIncludeLineNumber(false);
    this.setLookbackDays(3);
    this.setScope(2);
    
    
    IntakeOutputComponent.method("InsertData", function(){
        CERN_INTAKEOUTPUT.GetIntakeOutputTable(this);
    });
    IntakeOutputComponent.method("HandleSuccess", function(recordData){
        CERN_INTAKEOUTPUT.RenderComponent(this, recordData);
    });
}

IntakeOutputComponent.inherits(MPageComponent);



var CERN_INTAKEOUTPUT = function(){
    return {
        GetIntakeOutputTable: function(component){
            var sendAr = [];
            var criterion = component.getCriterion();
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0");
            MP_Core.XMLCclRequestWrapper(component, "MP_GET_FLUID_BAL", sendAr, true);
        },
        RenderComponent: function(component, recordData){
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
            
                var IntakeHTML = countText = scrollStyl = "";
                var jsHTML = [], sHTML = [], ioTimes_ar = [], intake_ar = [], output_ar = [];
                var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                // FLUID BALANCE / I&O component
                // TIMES FOR I&O
                var ioTimes_cnt = 0;
                
                var ioTimes_var = recordData.IO_TIMES;
                var lenIoTimes = 0;
                for (var times_cnt = 0, lenIoTimes = ioTimes_var.length; times_cnt < lenIoTimes; times_cnt++) {
                    var ioTimes_list = ioTimes_var[times_cnt];
                    LoadArrayIO_Times(ioTimes_list, ioTimes_ar, times_cnt);
                }
                // INTAKE
                var intake_var = recordData.IO_INTAKE;
                var intakeLen = 0;
                for (var intake_cnt = 0, intakeLen = intake_var.length; intake_cnt < intakeLen; intake_cnt++) {
                    var intake_list = intake_var[intake_cnt];
                    LoadArrayIO(intake_list, intake_ar, intake_cnt, codeArray);
                }
                // OUTPUT
                var output_var = recordData.IO_OUTPUT;
                var outputLen = 0;
                for (var output_cnt = 0, outputLen = output_var.length; output_cnt < outputLen; output_cnt++) {
                    var output_list = output_var[output_cnt];
                    LoadArrayIO(output_list, output_ar, output_cnt, codeArray);
                }
                //For scrolling adding 3 to the intake + output len because 3 rows exists always for headers
                jsHTML.push("<div class ='", MP_Util.GetContentClass(component, intakeLen + outputLen + 3), "'>");
                //BULD HEADER ROW ONLY IF AT LEAST ONE RESULTS EXISTS
                
                var noteComnt = "";
                if ((intakeLen + outputLen) > 0) {
                    jsHTML.push("<dl class='io-dates-range'><dd class='io-spacer'><span>&nbsp;</span></dd><dd class='io-sub-date'><span>&nbsp;</span></dd><dd class='io-dates'><span>", ioTimes_ar[0].start_time + "*", "</span></dd><dd class='io-dates'><span>", ioTimes_ar[1].start_time, "</span></dd><dd class='io-dates'><span>", ioTimes_ar[2].start_time, "</span></dd></dl>");
                    
                    //Note comment at the bottom
                    noteComnt = "<div class=sub-title-disp><span class='io-ind'>" + i18n.NOTE_INDICATOR + "</span></div>";
                }
                
                var totalIntakeArHTML = [];
                var totalOutputArHTML = [];
                var totalIntakeAr = BuildSubsection(i18n.TOTAL_FL_INTAKE, intake_ar, totalIntakeArHTML, component);
                var totalOutputAr = BuildSubsection(i18n.TOTAL_FL_OUTPUT, output_ar, totalOutputArHTML, component);
                
                //TOTAL
                var totFlBal1 = +totalIntakeAr[0] - +totalOutputAr[0];
                var totFlBal2 = +totalIntakeAr[1] - +totalOutputAr[1];
                var totFlBal3 = +totalIntakeAr[2] - +totalOutputAr[2];
                
                //add the fluid balance
                
                jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='io-spacer' >&nbsp;</span>");
                jsHTML.push("<span class='io-types'>", i18n.TOTAL_FL_BAL, "<span class='unit'>&#160;mL</span></span><span class='io-total'>", totFlBal1.toFixed(2), "</span><span class='io-total'>", totFlBal2.toFixed(2), "</span><span class='io-total'>", totFlBal3.toFixed(2), "</span></h3></div>");
                
                jsHTML = jsHTML.concat(totalIntakeArHTML);
                jsHTML = jsHTML.concat(totalOutputArHTML);
                
                jsHTML.push(noteComnt);
                jsHTML.push("</div>");
                sHTML = jsHTML.join("");
                countText = MP_Util.CreateTitleText(component, intake_ar.length + output_ar.length);
                
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


function LoadArrayIO_Times(JSonObj, aObj, cntP){
    var start_dateTime = new Date();
    var end_dateTime = new Date();
    
    
    if (aObj[cntP] == null) 
        aObj[cntP] = new Object();
    
    if (JSonObj.TIME_SEQ != "") {
        aObj[cntP].time = JSonObj.TIME_SEQ;
        aObj[cntP].start_time = JSonObj.START_TIME;
        aObj[cntP].end_time = JSonObj.END_TIME;
    }
}

function LoadArrayIO(JSonObj, aObj, cntP, codeArray){
    if (aObj[cntP] == null) {
        aObj[cntP] = new Object();
    }
    aObj[cntP].display = JSonObj.DISPLAY;
    
    if (JSonObj.UOM && JSonObj.UOM > 0) {
        var eventObj = MP_Util.GetValueFromArray(JSonObj.UOM, codeArray);
        aObj[cntP].uom = eventObj.display;
    }
    else 
        aObj[cntP].uom = "";
    
    
    aObj[cntP].accum_ind = JSonObj.ACCUM_IND;
    
    var IOtime = JSonObj.DAY_QUAL;
    
    aObj[cntP].times = new Array();
    for (var index = 0; index < IOtime.length; index++) {
        aObj[cntP].times[index] = new Object();
        aObj[cntP].times[index].total = IOtime[index].TOTAL;
    }
}

function BuildSubsection(name, ar, jsHTML, component){
    var total1 = 0.00, total2 = 0.00, total3 = 0.00;
    var ioExists = false;
    var arrLen = ar.length;
    //LOOP THROUGH EACH OUTPUT ITEM TO CALCULATE TOTALS FOR CURRENT AND PREVIOUS
    for (i = 0; i < arrLen; i++) {
        if (ar[i].accum_ind == "1") {
            total1 += ar[i].times[0].total;
            total2 += ar[i].times[1].total;
            total3 += ar[i].times[2].total;
        }
        if (ar[i].times[0].total > 0 || ar[i].times[1].total > 0 || ar[i].times[2].total > 0) {
            ioExists = true;
        }
    } //ENDFOR
    total1 = total1.toFixed(2);
    total2 = total2.toFixed(2);
    total3 = total3.toFixed(2);
    
    //BUILD THE SUBSECTION
    jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span>");
    jsHTML.push("<span class='io-types'>", name, "<span class='unit'>&#160;mL</span></span><span class='io-total'>", total1, "</span><span class='io-total'>", total2, "</span><span class='io-total'>", total3, "</span></h3>");
    
    
    //CHECK TO SEE IF OUTPUT VALUES EXIST
    if (ioExists) {
        var resultClass = "io-result";
        if (component.isScrollingEnabled()) {
            resultClass = "io-result-scroll";
        }
        jsHTML.push("<div class='sub-sec-content'>");
        
        //NOW LOOP THROUGH EACH ITEM AND CREATE ROW
        for (i = 0; i < arrLen; i++) {
            jsHTML.push("<dl class='io-values'><dd class='io-spacer'><span>&nbsp;</span></dd><dd class='io-names'><span>", ar[i].display, "<span class='unit'>&#160;", ar[i].uom, "</span></span></dd><dd class='", resultClass, "'><span>", ar[i].times[0].total.toFixed(2), "</span></dd><dd class='", resultClass, "'><span>", ar[i].times[1].total.toFixed(2), "</span></dd><dd class='", resultClass, "'><span>", ar[i].times[2].total.toFixed(2), "</span></dd></dl>");
        }
        jsHTML.push("</div>");
    }
    jsHTML.push("</div>");
    //TOTAL
    return ([total1, total2, total3]);
}
/**
 * Project: mp_laboratory_o1.js
 * Version 1.1.2
 * Released 9/20/2010
 * @author Greg Howdeshell (GH7199)
 * @author Sean Turk (ST017230)
 * @author Mark Davenport (MD019066)
 * @author Ryan Wareham (RW012837)
 */
function LaboratoryComponentStyle(){
    this.initByNamespace("lab");
}

LaboratoryComponentStyle.inherits(ComponentStyle);

/**
 * The Laboratory component will retrieve all labs associated to the patient
 *
 * @param {Criterion} criterion
 * @author Greg Howdeshell
 */
function LaboratoryComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new LaboratoryComponentStyle());
    this.setIncludeLineNumber(false);
    this.m_graphLink = 1;
    this.m_primaryLabel = i18n.PRIMARY_RESULTS;
    
    LaboratoryComponent.method("InsertData", function(){
        var nameSpace = new CERN_LABORATORY_O1();
        nameSpace.GetLaboratoryTable(this);
    });
    LaboratoryComponent.method("setGraphFlag", function(value){
        this.m_graphLink = value;
    });
    LaboratoryComponent.method("getGraphFlag", function(){
        return (this.m_graphLink)
    });
    LaboratoryComponent.method("setPrimaryLabel", function(value){
        this.m_primaryLabel = value;
    });
    LaboratoryComponent.method("getPrimaryLabel", function(){
        return (this.m_primaryLabel);
    });
    
}

LaboratoryComponent.inherits(MPageComponent);

/**
 * @namespace CERN_LABORATORY_O1
 * @dependencies Script: mp_get_n_results
 */
var CERN_LABORATORY_O1 = function(){
    var isErrorLoadingData = false;
    var isDataFound = false;
    var totalResultCount = 0;
    var m_comp = null;
    var m_contentNode = null;
	var m_contentSecNode = null;
    var m_rootComponentNode = null;
    var m_threadCount = 0;
    
    return {
        GetLaboratoryTable: function(component){
            //need to create two placeholders for the primary and secondary results.
            m_comp = component;
            var styles = component.getStyles();
            m_rootComponentNode = component.getRootComponentNode();
            m_contentNode = component.getSectionContentNode();
            
            var groups = component.getGroups();
            var xl = (groups != null) ? groups.length : 0;
            m_threadCount = xl;
            
            CreateInfoHeader(m_contentNode)
            
            for (var x = 0; x < xl; x++) {
                var group = groups[x];
                var subSection = CreateSubHeader(group.getGroupName(), false);
                
                //spawn threads
                GetResultsByGroup(group, subSection);
            }
            if (m_threadCount == 0) 
                FinalizeComponent();
            
        }
    };
    
    function CreateInfoHeader(secContentNode){
        var contentHdr = Util.cep("div", {
            "className": "content-hdr"
        });
        Util.ac(contentHdr, secContentNode);
        
        var ar = [];
        var withinTH = "";
        
        if (m_comp.getDateFormat() == 3) 
            withinTH = "<P><span>" + i18n.WITHIN + "</span>";
        
        ar.push("<TABLE class=lab-table><TR class=lab-hdr><TH class=lab-lbl><SPAN>&nbsp;</SPAN></TH><TH class=lab-icn1><SPAN>&nbsp;</SPAN></TH><TH class=lab-res1><SPAN>", i18n.LATEST, "</SPAN>");
        ar.push(withinTH, "</TH><TH class=lab-icn2><SPAN>&nbsp;</SPAN></TH><TH class=lab-res2><SPAN>", i18n.PREVIOUS, "</SPAN>");
        ar.push(withinTH, "</TH><TH class=lab-icn3><SPAN>&nbsp;</SPAN></TH><TH class=lab-res3><SPAN>", i18n.PREVIOUS, "</SPAN>", withinTH, "</TH></TR></TABLE>");
        
        contentHdr.innerHTML = ar.join("");
		m_contentSecNode = Util.cep("div", {
			"className" : "content-body"
		});
		
		Util.ac(m_contentSecNode, secContentNode);
		
		
    }
    function FinalizeComponent(){
        var styles = m_comp.getStyles();
        var totalCount = Util.Style.g("sec-total", m_rootComponentNode, "span");
        var sResultText = "";
        if (isErrorLoadingData) {
            m_contentNode.innerHTML = MP_Util.HandleErrorResponse(styles.getNameSpace());
        }
        else if (totalResultCount == 0) {
            sResultText = MP_Util.CreateTitleText(m_comp, totalResultCount);
            m_contentNode.innerHTML = MP_Util.HandleNoDataResponse(styles.getNameSpace());
        }
        else {
            sResultText = MP_Util.CreateTitleText(m_comp, totalResultCount);
			//Add scrolling class if count is more than scrollnumber
			if (totalResultCount > m_comp.getScrollNumber() && m_comp.isScrollingEnabled()) {
				Util.Style.acss(m_contentSecNode, "scrollable ");
				var contentHdr = Util.Style.g("content-hdr", m_rootComponentNode, "div");
			 	Util.Style.acss(contentHdr[0], "lab-scrl-tbl-hd")
			}
            //init hovers
            MP_Util.Doc.InitHovers(styles.getInfo(), m_contentSecNode);
            
            //init subsection toggles
            MP_Util.Doc.InitSubToggles(m_contentSecNode, "sub-sec-hd-tgl");
			
			 if (m_comp.isScrollingEnabled()) {
			 	MP_Util.Doc.InitScrolling(Util.Style.g("scrollable", m_rootComponentNode, "div"), m_comp.getScrollNumber(), "2.8")
				
			 }
        }
        totalCount[0].innerHTML = sResultText;
    }
    
    function CreateSubHeader(label, includeContentBody){
        var subSec = Util.cep("div", {
            "className": "sub-sec"
        });
        var h3 = Util.cep("h3", {
            "className": "sub-sec-hd lab-sub-scrl-hd"
        });
        subSec.appendChild(h3);
        
        var spanTgl = Util.cep("span", {
            "className": "sub-sec-hd-tgl",
            "title": i18n.HIDE_SECTION
        });
        h3.appendChild(spanTgl);
        
        var TgltxtNode = document.createTextNode("-");
        spanTgl.appendChild(TgltxtNode);
        
        var spanTitle = Util.cep("span", {
            "className": "sub-sec-title"
        });
        h3.appendChild(spanTitle);
        
        var labelTextNode = document.createTextNode(label);
        spanTitle.appendChild(labelTextNode);
        
        if (includeContentBody) {
            var subContent = Util.cep("div", {
                "className": "sub-sec-content"
            });
            subSec.appendChild(subContent);
            
            var contentBody = Util.cep("div", {
                "className": "content-body"
            });
            subContent.appendChild(contentBody);
        }
        m_contentSecNode.appendChild(subSec);
        return (subSec);
    }
    
    function GetResultsByGroup(group, subSection){
        var sEC = "0.0", sES = "0.0"; //defaults 
        var es = group.getEventSets();
        if (es != null && es.length > 0) 
            sES = "value(" + es.join(",") + ")"
        var info = new XMLCclRequest();
        info.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                m_threadCount--;
                var sHTML = "", countText = "";
                var subCnt = 0;
                var jsonEval = JSON.parse(this.responseText);
                var recordData = jsonEval.RECORD_DATA;
                
                var subSecTitle = Util.Style.g("sub-sec-title", subSection, "SPAN")
                
                if (recordData.STATUS_DATA.STATUS == "S") {
                    var ar = [];
                    var codeArray = MP_Util.LoadCodeListJSON(jsonEval.RECORD_DATA.CODES);
                    var personnelArray = MP_Util.LoadPersonelListJSON(jsonEval.RECORD_DATA.PRSNL);
                    var mapObjects = CERN_LABORATORY_O1_UTIL.LoadMeasurementData(jsonEval, personnelArray, codeArray);
                    //because the map objects are grouped either by distinct event code or non-distince event set,
                    // once must differ between the two for calculation of results that are display per subsection
                    
                    if (group.getGroupName() == i18n.PRIMARY_RESULTS) {
                        var subContent = Util.cep("div", {
                            "className": "sub-sec-content"
                        });
                        subSection.appendChild(subContent);
                        
                        var secContentBody = Util.cep("div", {
                            "className": "content-body"
                        });
                        subContent.appendChild(secContentBody);
                        
                        subCnt = mapObjects.length;
                        var measAr = [];
                        for (var x = 0, xl = mapObjects.length; x < xl; x++) {
                            measAr.push(mapObjects[x].value)
                        }
                        AssociateResultsToGroup(subSection, m_comp.getPrimaryLabel(), measAr, subSecTitle[0], secContentBody)
                        
                 
                        
                    }
                    else {
                        var sGroupName = "";
                        var sub = null, measAr = [];
                        if (mapObjects.length == 0) 
                            subSecTitle[0].innerHTML = group.getGroupName() + " (0)";
                        else {
                            m_contentSecNode.removeChild(subSection); //remove no longer necessary placeholder for secondary results
                            var secContentBody = null;
                            for (var x = 0, xl = mapObjects.length; x < xl; x++) {
                                if (sGroupName != mapObjects[x].name) { //create new group if non-existent
                                    sGroupName = mapObjects[x].name;
                                    sub = CreateSubHeader(sGroupName)
                                    measAr = [];
                                    
                                    var subContent = Util.cep("div", {
                                        "className": "sub-sec-content"
                                    });
                                    sub.appendChild(subContent);
                                    
                                    secContentBody = Util.cep("div", {
                                        "className": "content-body"
                                    });
                                    subContent.appendChild(secContentBody);
                                    
                                    subSecTitle = Util.Style.g("sub-sec-title", sub, "SPAN")
                                }
                                //add results to measure array
                                measAr.push(mapObjects[x].value)
                                
                                subCnt = measAr.length;
                                if ((x == (xl - 1)) /*last item in mapObjects*/ || (x != (xl - 1) && mapObjects[x + 1].name != sGroupName)/*next group will be a new item*/) {
                                    AssociateResultsToGroup(sub, sGroupName, measAr, subSecTitle[0], secContentBody)
                                
                                }
                            }
                        }
                        
                    }
                }
                else if (recordData.STATUS_DATA.STATUS == "Z") {
                    subSecTitle[0].innerHTML = group.getGroupName() + " (0)";
                }
                else {
                    isErrorLoadingData = true;
                }
                
                if (m_threadCount == 0) 
                    FinalizeComponent();
            }
            if (this.readyState == 4) {
                MP_Util.ReleaseRequestReference(this);
            }
        }
        //only load up initial three items to improve overall performance
        var criterion = m_comp.getCriterion()
        info.open('GET', "MP_GET_N_RESULTS");
        var sEncntr = (m_comp.getScope() == 2) ? criterion.encntr_id + ".0" : "0.0";
        var sendAr = [];
        sendAr.push("^MINE^", criterion.person_id + ".0", sEncntr, criterion.provider_id + ".0", 3, sES, sEC, "^measurement^", m_comp.getLookbackUnits(), criterion.position_cd + ".0", criterion.ppr_cd + ".0", m_comp.getLookbackUnitTypeFlag());
        info.send(sendAr.join(","));
    }
    
    function AssociateResultsToGroup(subSection, subGroupName, measurements, subSecTitle, secContentBody){
        var subCnt = measurements.length;
        var criterion = m_comp.getCriterion();
        
        var encntrOption = (m_comp.getScope() == 1) ? "0" : (criterion.encntr_id);
        var lookBackUnits = (m_comp.getLookbackUnits() != null) ? m_comp.getLookbackUnits() : "365";
        var lookBackType = (m_comp.getLookbackUnitTypeFlag() != null) ? m_comp.getLookbackUnitTypeFlag() : "0";
        var staticContent = "\"" + escape(criterion.static_content) + "\"";
        
        var ar = [];
        
        ar.push("<table class='lab-table'>")
        
        //for each row
        for (var x = 0, xl = measurements.length; x < xl; x++) {
            var meas = measurements[x];
            var rowClass = (x % 2) ? "even" : "odd";
            var m1 = meas[0];
            ar.push("<tr class='", rowClass, "'>");
            if (m_comp.getGraphFlag() == 1) {
                ar.push("<td class='lab-lbl'><span><a class='lr-link' onClick='MP_Util.GraphResults(", m1.getPersonId(), ",", encntrOption, ",", m1.getEventCode().codeValue, ",", staticContent, ",", "0,", criterion.provider_id, ",", criterion.position_cd, ",", criterion.ppr_cd, ",", lookBackUnits, ",", lookBackType, ");'>", m1.getEventCode().display, "</a></span></td>");
                
            }
            else {
                ar.push("<td class='lab-lbl'><span>", m1.getEventCode().display, "</span></td>");
            }
            ar.push(CERN_LABORATORY_O1_UTIL.CreateResultCell(meas[0], 0, m_comp));
            ar.push(CERN_LABORATORY_O1_UTIL.CreateResultCell(meas[1], 1, m_comp));
            ar.push(CERN_LABORATORY_O1_UTIL.CreateResultCell(meas[2], 2, m_comp));
            ar.push("</tr>")
        }
        ar.push("</table>")
        secContentBody.innerHTML = ar.join("");
        subSecTitle.innerHTML = subGroupName + " (" + subCnt + ")";
        totalResultCount += subCnt;
    }
};

/**
 * Contains common methods utilized across the laboratory table and the laboratory graph
 * @namespace CERN_LABORATORY_O1_UTIL
 * @static
 * @global
 */
var CERN_LABORATORY_O1_UTIL = function(){
    return {
        LoadMeasurementData: function(jsonEval, personnelArray, codeArray){
            var mapObjects = [];
            var results = jsonEval.RECORD_DATA.RESULTS;
            for (var i = 0, il = results.length; i < il; i++) {
                if (results[i].CLINICAL_EVENTS.length > 0) {
                    var measureArray = [];
                    var mapObject = null;
                    if (results[i].EVENT_CD > 0) 
                        mapObject = new MP_Core.MapObject(results[i].EVENT_CD, measureArray);
                    else 
                        mapObject = new MP_Core.MapObject(results[i].EVENT_SET_GROUPER_NAME, measureArray);
                    results[i].CLINICAL_EVENTS.sort(SortByEffectiveDate)
                    for (var j = 0, jl = results[i].CLINICAL_EVENTS.length; j < jl; j++) {
                        var meas = results[i].CLINICAL_EVENTS[j];
                        var eventCode = MP_Util.GetValueFromArray(meas.EVENT_CD, codeArray);
                        
                        var dateTime = dateTime = new Date();
                        dateTime.setISO8601(meas.EFFECTIVE_DATE);
                        
                        //create measurement object
                        for (var k = 0, kl = meas.MEASUREMENTS.length; k<kl;k++) {
                            var measurement = new MP_Core.Measurement();
                            var obj = MP_Util.Measurement.GetObject(meas.MEASUREMENTS[k], codeArray);
                            measurement.init(meas.EVENT_ID, meas.PERSON_ID, meas.ENCNTR_ID, eventCode, dateTime, MP_Util.Measurement.GetObject(meas.MEASUREMENTS[k], codeArray));
                            measurement.setNormalcy(MP_Util.GetValueFromArray(meas.MEASUREMENTS[k].NORMALCY_CD, codeArray));
                            measureArray.push(measurement);
                        }
                    }
                    if (measureArray.length > 0) 
                        mapObjects.push(mapObject);
                }
            }
            return mapObjects;
        },
        CreateResultCell: function(result, idx, component){
            var ar = [];
            if (result == null) {
                ar.push("<td class= 'lab-icn", idx, "'>&nbsp;</td><td class='lab-res", idx, "'><dl class= 'lab-info'><dt><span>", i18n.VALUE, "</span></dt><dd class='lab-res'><span>--</span></dd></dl></td>")
            }
            else {
                var obj = result.getResult();
                var resStr = GetStringResult(obj, false);
                var resHvrStr = GetStringResult(obj, true);
                var display = result.getEventCode().display;
                var dateTime = result.getDateTime();
                var labNormalcy = CalculateNormalcy(result);
                var within = MP_Util.CalcWithinTime(dateTime);
                
                
                var sCritHigh = "", sCritLow = "", sNormHigh = "", sNormLow = "";
                if (obj instanceof MP_Core.QuantityValue) {
                    var refRange = obj.getRefRange();
                    if (refRange != null) {
                        if (refRange.getCriticalHigh() != 0 || refRange.getCriticalLow() != 0) {
                            sCritHigh = refRange.getCriticalHigh();
                            sCritLow = refRange.getCriticalLow();
                        }
                        if (refRange.getNormalHigh() != 0 || refRange.getNormalLow() != 0) {
                            sNormHigh = refRange.getNormalHigh();
                            sNormLow = refRange.getNormalLow();
                        }
                    }
                }
                
                ar.push("<td class= 'lab-icn", idx, "'>", GetIcon(result), "</td><td class='lab-res", idx, "'><dl class= 'lab-info'><dt><span>", i18n.VALUE, "</span></dt><dd class='lab-res'><span class='", labNormalcy, "'>", resStr, "</span>");
                if (component.getDateFormat() != 4) //DO NOT DISPLAY DATE
                    ar.push("<br/><span class='within'>", MP_Util.DisplayDateByOption(component, dateTime), "</span>");
                
                ar.push("</dd></dl><h4 class='lab-det-hd'><span>", i18n.LABORATORY_DETAILS, "</span></h4><div class='hvr'><dl class='lab-det'><dt class= 'lab-det-type'><span>", display, ":</span></dt><dd class='result'><span class='", labNormalcy, "'>", resHvrStr, "</span></dd><dt class= 'lab-det-type'><span>", i18n.DATE_TIME, ":</span></dt><dd class='result'><span>", dateTime.format("longDateTime3"), "</span></dd><dt class= 'lab-det-type'><span>", i18n.NORMAL_LOW, ":</span></dt><dd class='result'><span>", sNormLow, "</span></dd><dt class= 'lab-det-type'><span>", i18n.NORMAL_HIGH, ":</span></dt><dd class='result'><span>", sNormHigh, "</span></dd><dt class= 'lab-det-type'><span>", i18n.CRITICAL_LOW, ":</span></dt><dd class='result'><span>", sCritLow, "</span></dd><dt class= 'lab-det-type'><span>", i18n.CRITICAL_HIGH, ":</span></dt><dd class='result'><span>", sCritHigh, "</span></dd></dl></div></td>");
            }
            return ar.join("");
        }
    }
    function SortByEffectiveDate(a, b){
        if (a.EFFECTIVE_DATE > b.EFFECTIVE_DATE) 
            return -1;
        else if (a.EFFECTIVE_DATE < b.EFFECTIVE_DATE) 
            return 1;
        else 
            return 0;
    }
    function CreateHoverForMeasurement(measurement){
        var ar = [];
        var obj = measurement.getResult();
        var resStr = GetStringResult(obj, false);
        var resHvrStr = GetStringResult(obj, true);
        var display = measurement.getEventCode().display;
        var dateTime = measurement.getDateTime();
        var labNormalcy = CalculateNormalcy(measurement);
        
        var sCritHigh = "", sCritLow = "", sNormHigh = "", sNormLow = "";
        if (obj instanceof MP_Core.QuantityValue) {
            var refRange = obj.getRefRange();
            if (refRange != null) {
                if (refRange.getCriticalHigh() != 0 || refRange.getCriticalLow() != 0) {
                    sCritHigh = refRange.getCriticalHigh();
                    sCritLow = refRange.getCriticalLow();
                }
                if (refRange.getNormalHigh() != 0 || refRange.getNormalLow() != 0) {
                    sNormHigh = refRange.getNormalHigh();
                    sNormLow = refRange.getNormalLow();
                }
            }
        }
        
        ar.push('<dt class=lab-res><span>', display, ':</span></dt><dd class=lab-det-type><span class=', labNormalcy, '>', resHvrStr, '</span></dd><dt class=lab-res><span>', i18n.DATE_TIME, ':</span></dt><dd class=lab-det-type><span>', dateTime.format("longDateTime3"), '</span></dd><dt class=lab-res><span>', i18n.NORMAL_LOW, ':</span></dt><dd class=lab-det-type><span>', sNormLow, '</span></dd><dt class=lab-res><span>', i18n.NORMAL_HIGH, ':</span></dt><dd class=lab-det-type><span>', sNormHigh, '</span></dd><dt class=lab-res><span>', i18n.CRITICAL_LOW, ':</span></dt><dd class=lab-det-type><span>', sCritLow, '</span></dd><dt class=lab-res><span>', i18n.CRITICAL_HIGH, ':</span></dt><dd class=lab-det-type><span>', sCritHigh, '</span></dd>');
        
        return (ar.join(""));
        
    }
    
    function GetStringResult(result, includeUOM){
        var value = "";
        if (result instanceof MP_Core.QuantityValue) 
            if (includeUOM) 
                value = result.toString();
            else 
                value = result.getValue();
        else if (result instanceof Date) 
            value = result.format("longDateTime3");
        else 
            value = result;
        return value;
    }
    
    function GetIcon(measObject){
        var normalcyIcon = "<span>&nbsp;</span>";
        var nomalcy = measObject.getNormalcy();
        if (nomalcy != null) {
            var normalcyMeaning = nomalcy.meaning;
            if (normalcyMeaning == "LOW" || normalcyMeaning == "EXTREMELOW") {
                normalcyIcon = "<span class='res-low-icon'>&nbsp;</span>";
            }
            else if (normalcyMeaning == "HIGH" || normalcyMeaning == "EXTREMEHIGH") {
                normalcyIcon = "<span class='res-high-icon'>&nbsp;</span>";
            }
            else if (normalcyMeaning == "CRITICAL" || normalcyMeaning == "PANICHIGH" || normalcyMeaning == "PANICLOW") {
                normalcyIcon = "<span class='res-severe-icon'>&nbsp;</span>";
            }
        }
        return normalcyIcon;
    }
    function CalculateCriticalRange(result){
        var rv = "";
        if (result instanceof MP_Core.QuantityValue) {
            var rr = result.getRefRange();
            if (rr != null) 
                rv = rr.toCriticalInlineString();
        }
        return rv;
    }
    
    function CalculateNormalRange(result){
        var rv = "";
        if (result instanceof MP_Core.QuantityValue) {
            var rr = result.getRefRange();
            if (rr != null) 
                rv = rr.toNormalInlineString();
        }
        return rv;
    }
    function CalculateNormalcy(result){
        var normalcy = "";
        var nc = result.getNormalcy()
        if (nc != null) {
            var normalcyMeaning = nc.meaning;
            if (normalcyMeaning != null) {
                if (normalcyMeaning == "LOW" || normalcyMeaning == "EXTREMELOW") {
                    normalcy = "res-low";
                }
                else if (normalcyMeaning == "HIGH" || normalcyMeaning == "EXTREMEHIGH") {
                    normalcy = "res-high";
                }
                else if (normalcyMeaning == "CRITICAL" || normalcyMeaning == "PANICHIGH" || normalcyMeaning == "PANICLOW") {
                    normalcy = "res-severe";
                }
            }
        }
        return normalcy;
    }
}();
/**
 * Project: mp_lines_tubes_drains_o1.js
 * Version 1.0.2
 * Released 9/20/2010
 * @author Jacob Anderson (JA017481)
 * @author Greg Howdeshell (GH7199)
 * @author Mark Davenport (MD019066)
 */
function LinesTubesDrainsComponentStyle(){
    this.initByNamespace("ld");
}

LinesTubesDrainsComponentStyle.inherits(ComponentStyle);


/**
 * The Lines Tubes and Drains component will retrieve Lines Tubes and Drains information of the patient
 *
 * @param {Criterion} criterion
 */
function LinesTubesDrainsComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new LinesTubesDrainsComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.LINES_TUBES.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.LINES_TUBES.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
    
    this.m_lines = null;
    this.m_tubes = null;
    
    LinesTubesDrainsComponent.method("InsertData", function(){
        CERN_LINESTUBESDRAINS_O1.GetLinesTubesDrainsTable(this);
    });
    LinesTubesDrainsComponent.method("HandleSuccess", function(recordData){
        CERN_LINESTUBESDRAINS_O1.RenderComponent(this, recordData);
    });
    LinesTubesDrainsComponent.method("getLineCodes", function(){
        return (this.m_lines);
    })
    LinesTubesDrainsComponent.method("setLineCodes", function(value){
        this.m_lines = value;
    })
    LinesTubesDrainsComponent.method("addLineCode", function(value){
        if (this.m_lines == null) 
            this.m_lines = [];
        this.m_lines.push(value);
    })
    
    LinesTubesDrainsComponent.method("getTubeCodes", function(){
        return (this.m_tubes);
    })
    LinesTubesDrainsComponent.method("setTubeCodes", function(value){
        this.m_tubes = value;
    })
    LinesTubesDrainsComponent.method("addTubeCode", function(value){
        if (this.m_tubes == null) 
            this.m_tubes = [];
        this.m_tubes.push(value);
    })
}

LinesTubesDrainsComponent.inherits(MPageComponent);

/**
 * LinesTubesDrains methods
 * @namespace CERN_LINESTUBESDRAINS_O1
 * @static
 * @global
 * @dependencies Script: mp_lines_tubes_drains
 */
var CERN_LINESTUBESDRAINS_O1 = function(){
    return {
        GetLinesTubesDrainsTable: function(component){
            var sendAr = [];
            var criterion = component.getCriterion();
            var lineCodes = component.getLineCodes();
            var tubeCodes = component.getTubeCodes();
            var sLines = (lineCodes != null && lineCodes.length > 0) ? "value(" + lineCodes.join(',') + ")" : "0.0";
            var sTubes = (tubeCodes != null && tubeCodes.length > 0) ? "value(" + tubeCodes.join(',') + ")" : "0.0";
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", sLines, sTubes);
            MP_Core.XMLCclRequestWrapper(component, "mp_lines_tubes_drains", sendAr, true);
        },
        RenderComponent: function(component, recordData){
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
                var jsLTDHTML = [];
                var ltdHTML = "", countText = "";
                var headDtTm = component.getDateFormat() == 3 ? i18n.LAST_DOC_WITHIN : i18n.LAST_DOC
                jsLTDHTML.push("<dl class='ld-info-hdr'><dd class='ld-name'></dd><dd class='ld-dt'>", headDtTm, "</dd></dl>");
                
                jsLTDHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.LINES, " (", recordData.LINES.length, ")</span></h3><div class='sub-sec-content'>");
                
                if (recordData.LINES.length > 0) {
                    recordData.LINES.sort(SortLinesTubesDrainsByDate);
                    jsLTDHTML.push("<div class='", MP_Util.GetContentClass(component, recordData.LINES.length), "'>");
                    
                    for (var i = 0; i < recordData.LINES.length; i++) {
                        var ltd = recordData.LINES[i]
                        jsLTDHTML.push(CreateLTDRow(ltd, component));
                    }
                    jsLTDHTML.push("</div>");
                }
                
                jsLTDHTML.push("</div></div>");
                
                jsLTDHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.TUBES_DRAINS, " (", recordData.TUBES_DRAINS.length, ")</span></h3><div class='sub-sec-content'>");
                
                if (recordData.TUBES_DRAINS.length > 0) {
                    recordData.TUBES_DRAINS.sort(SortLinesTubesDrainsByDate);
                    jsLTDHTML.push("<div class='", MP_Util.GetContentClass(component, recordData.TUBES_DRAINS.length), "'>");
                    
                    for (var i = 0; i < recordData.TUBES_DRAINS.length; i++) {
                        var ltd = recordData.TUBES_DRAINS[i]
                        jsLTDHTML.push(CreateLTDRow(ltd, component));
                    }
                    jsLTDHTML.push("</div>");
                }
                jsLTDHTML.push("</div></div>");
                ltdHTML = jsLTDHTML.join("");
                countText = MP_Util.CreateTitleText(component, recordData.LINES.length + recordData.TUBES_DRAINS.length);
                MP_Util.Doc.FinalizeComponent(ltdHTML, component, countText);
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
    function CreateLTDRow(ltd, component){
        var ar = [];
        var sDetStart = "<dl class='ld-info'><dd class='ld-name'><span>"
        var sDetMid = "</span></dd><dd class='ld-dt'><span>"
        var sDetEnd = "</span></dd></dl>"
        
        var sLTDTitle = (ltd.DYN_LBL_NAME != "") ? ltd.TYPE + "  (" + ltd.DYN_LBL_NAME + ")" : ltd.TYPE;
        
        var evntDtTm = new Date();
        var sEvntDtTm = "";
        if (ltd.LAST_DT_TM != "") {
            evntDtTm.setISO8601(ltd.LAST_DT_TM);
            sEvntDtTm = MP_Util.DisplayDateByOption(component, evntDtTm);
        }
        
        ar.push(sDetStart, sLTDTitle, sDetMid, sEvntDtTm, sDetEnd)
        
        var objDet = ltd.DETAILS;
        
        if (objDet != null && objDet.length > 0) {
            ar.push(CreateHover(objDet, ltd));
        }
        ar.push("</dl>");
        return ar.join("");
    }
    function CreateHover(objDet, ltd){
        var ar = [];
        var sHvrDetStart = "<dt><span>"
        var sHvrDetMid = "</span></dt><dd><span>"
        var sHvrDetEnd = "</span></dd>"
        var sColon = ":"
        
        ar.push("<h4 class=ld-det-hd><span>" + i18n.DETAILS + "</span></h4><div class='hvr'><dl>");
        for (var j = 0; j < objDet.length; j++) {
			var resultDisplay = "";
			if (objDet[j].RESULT_TYPE_FLAG == 1) {
				var resultDtTm = new Date();
				resultDtTm.setISO8601(objDet[j].RESULT);
				resultDisplay = resultDtTm.format("longDateTime3");
			}
			else {
				resultDisplay = objDet[j].RESULT;
			}
            var sChar = objDet[j].NAME.substring(objDet[j].NAME.length - 1)
            if (sChar == ":") {
				ar.push(sHvrDetStart, objDet[j].NAME, sHvrDetMid, resultDisplay, sHvrDetEnd)
				
            }
            else {
                ar.push(sHvrDetStart, objDet[j].NAME, sColon, sHvrDetMid, resultDisplay, sHvrDetEnd)
            }
            
        }
        
        if (ltd.FIRST_DT_TM != "") {
            var evntDtTm = new Date();
            evntDtTm.setISO8601(ltd.FIRST_DT_TM)
            var sEvntDtTm = evntDtTm.format("longDateTime3");
            ar.push("<dt><span>", i18n.INIT_DOC_DT_TM, ":</span></dt><dd><span>", sEvntDtTm, "</span></dd>");
        }
        ar.push("</div>")
        return ar.join("");
    }
    function SortLinesTubesDrainsByDate(a, b){
        var x = a.LAST_DT_TM;
        var y = b.LAST_DT_TM;
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        
    }
    
}();
function MeasurementComponentStyle()
{
	this.initByNamespace("meas");
}
MeasurementComponentStyle.inherits(ComponentStyle);

/**
 * The Measurements component will retrieve measurements associated to the patient
 * from the defined event sets
 * 
 * @param {Criterion} criterion
 * @author Wes Dembinski
 */
function MeasurementComponent(criterion){
	this.setCriterion(criterion);
	this.setStyles(new MeasurementComponentStyle());
	this.setIncludeLineNumber(true);
	
	MeasurementComponent.method("InsertData", function(){
		CERN_MEASUREMENTS_O1.GetMeasurementsTable(this);
	});
	MeasurementComponent.method("HandleSuccess", function(recordData){	
		CERN_MEASUREMENTS_O1.RenderComponent(this, recordData);
	});
}
MeasurementComponent.inherits(MPageComponent);

 /**
  * Measurements and Weights methods
  * @namespace CERN_MEASUREMENTS_O1
  * @static
  * @global
  * @dependencies Script: mp_nb_get_measures
  */
var CERN_MEASUREMENTS_O1 = function(){
    return {
        GetMeasurementsTable : function(component){
			var sendAr = [];
			var criterion = component.getCriterion();
			sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", "0.0", criterion.position_cd + ".0");
			MP_Core.XMLCclRequestWrapper(component, "MP_NB_GET_MEASURES", sendAr, true);
        },
        RenderComponent: function(component, recordData){
			var contentId = component.getStyles().getContentId();
			var measurements = ["<table class='meas-table'>\
						<th class='meas-col1-hd'></th>\
						<th class='meas-col-hd'>"+i18n_nb.BIRTH+"</th>\
						<th class='meas-col-hd'>"+i18n_nb.LATEST_RESULT+"</th>\
						<th class='meas-col-hd'>"+i18n_nb.PERCENT_CHANGE+"</th>\
						<th class='meas-col-hd'>"+i18n_nb.PREV_RESULT+"</th>"];
					
			measurements.push(CreateResultRow(i18n_nb.WEIGHT, recordData.WEIGHT[0], 0));
			measurements.push(CreateResultRow(i18n_nb.LENGTH, recordData.LENGTH[0], 1));
			measurements.push(CreateResultRow(i18n_nb.HEAD_CIRC, recordData.HEAD_CIRC[0], 2));
			measurements.push(CreateResultRow(i18n_nb.AB_CIRC, recordData.AB_CIRC[0], 3));
			measurements.push("</table>");
						
			_g(contentId).innerHTML = measurements.join("");
			
			//setup the hovers on all divs with the hvr class under the content div
			Util.Style.g('hvr', _g(contentId), 'div').each(function(div){
				hs(Util.gp(div), div);
			});
			
			var countText = MP_Util.CreateTitleText(component, recordData.RESULT_CNT);
			var totalCount = Util.Style.g("sec-total", component.getRootComponentNode(), "span");
			totalCount[0].innerHTML = countText;			
        }
    };
	
	function CreateResultRow(type, measObj, rowNum){
			
		var rowHTML = "<tr class='#{rowClass}'><td>#{resultType}</td>\
			<td>#{birth}&nbsp;#{birthHover}</td><td>#{latest}&nbsp;#{latestHover}</td>\
			<td>#{change}</td><td>#{previous}&nbsp;#{previousHover}</td></tr>";
			
		var rowClass = (rowNum % 2) ? "even" : "odd";
			
		return rowHTML.interpolate({
			rowClass: rowClass,
			resultType: type,
			birth: measObj.BIRTH_DISPLAY,
			latest: measObj.LATEST_DISPLAY,
			previous: measObj.PREVIOUS_DISPLAY,
			change: CalcPercentChange(measObj.LATEST_RESULT, measObj.BIRTH_RESULT),
			birthHover: (measObj.BIRTH_RESULT > 0) ? AddResultDetail(type, measObj.BIRTH_DTTM_DISPLAY) : "",
			latestHover: (measObj.LATEST_RESULT > 0) ? AddResultDetail(type, measObj.LATEST_DTTM_DISPLAY) : "",
			previousHover: (measObj.PREVIOUS_RESULT > 0) ? AddResultDetail(type, measObj.PREVIOUS_DTTM_DISPLAY) : ""
		});
			
	}
	
	function AddResultDetail(type, dateDisplay){
		var hoverHTML = "<div class='hvr'><dl><dt><span>"+i18n_nb.RESULT_TYPE+": </span></dt>\
			<dd><span>#{resultType}</span></dd><dt><span>"+i18n_nb.DATE_TIME+": </span></dt><dd><span>#{date}</span></dd>\
			</dl></div>";
			
		return hoverHTML.interpolate({resultType:type, date:dateDisplay});
	}
	
	function CalcPercentChange(current, previous){
		if(current === 0 || previous === 0)
			return "";
			
		return MP_Util.Measurement.SetPrecision((current/previous - 1) * 100,2) + i18n_nb.PERCENT;
	}
}();/**
 * Project: mp_medications_o1.js
 * Version 1.2.5
 * Released 10/05/2010
 * @author Greg Howdeshell (GH7199)
 * @author Subash Katageri (SK018948)
 * @author Mark Davenport (MD019066)
 */
function MedicationsComponentStyle(){
    this.initByNamespace("med");
}

MedicationsComponentStyle.inherits(ComponentStyle);

function MedicationsComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new MedicationsComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.MEDS.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.MEDS.O1 - render component");
    this.m_prnLookback = 0;
    this.setIncludeLineNumber(false);
    this.setScope(2);
    //indicator for loading the medicines depending on bedrosk settings
    this.m_scheduled = false;
    this.m_continuous = false;
    this.m_prn = false;
    this.m_admin = false;
    this.m_susp = false;
    this.m_discont = false;
	//Sorting indicators
	this.m_scheduledSort = 0;
	this.m_prnAdminSort = 0;
	this.m_prnUnschedAvailSort = 0;
	this.m_continuousSort = 0;
	//FaceUp Date indicator
	this.m_faceUpDtSched = false;
	this.m_faceUpDtPRN = false;
    //look back hours for admin
    this.m_lookBkHrsForAdm = 24;
    this.m_lookBkHrsForDisCont = 24;
	//Look forward hours scheduled
	this.m_schedLookAhead = 0;

    MedicationsComponent.method("InsertData", function(){
        CERN_MEDS_O1.GetMedicationData(this);
    });
    //sections
    MedicationsComponent.method("setPRNLookbackDays", function(value){
        this.m_prnLookback = value;
    });
    MedicationsComponent.method("getPRNLookbackDays", function(){
        return (this.m_prnLookback);
    });
	
    MedicationsComponent.method("setScheduled", function(value){
        this.m_scheduled = value;
    });
    MedicationsComponent.method("isScheduled", function(){
        return this.m_scheduled;
    });
    MedicationsComponent.method("setContinuous", function(value){
        this.m_continuous = value;
    });
    MedicationsComponent.method("isContinuous", function(){
        return (this.m_continuous);
    });
    MedicationsComponent.method("setPRN", function(value){
        this.m_prn = value;
    });
    MedicationsComponent.method("isPRN", function(){
        return (this.m_prn);
    });
    MedicationsComponent.method("setAdministered", function(value){
        this.m_admin = value;
    });
    MedicationsComponent.method("isAdministered", function(){
        return this.m_admin;
    });
    MedicationsComponent.method("setSuspended", function(value){
        this.m_susp = value;
    });
    MedicationsComponent.method("isSuspended", function(){
        return this.m_susp;
    });
    MedicationsComponent.method("setDiscontinued", function(value){
        this.m_discont = value;
    });
    MedicationsComponent.method("isDiscontinued", function(){
        return this.m_discont;
    });
        
    MedicationsComponent.method("setAdministeredLookBkHrs", function(value){
        this.m_lookBkHrsForAdm = value;
    });
    MedicationsComponent.method("getAdministeredLookBkHrs", function(){
        return this.m_lookBkHrsForAdm;
    });
    
    MedicationsComponent.method("setDiscontinuedLookBkHr", function(value){
        this.m_lookBkHrsForDisCont = value;
    });
    MedicationsComponent.method("getDiscontinuedLookBkHr", function(){
        return this.m_lookBkHrsForDisCont;
    });
	
	MedicationsComponent.method("setSchedLookaheadHrs", function(value){
		this.m_schedLookAhead = value;
	});
	MedicationsComponent.method("getSchedLookaheadHrs", function(){
		return (this.m_schedLookAhead);
	});
	//Sort Getters/Setters
	MedicationsComponent.method("setScheduledSort", function(value){
		this.m_scheduledSort = value;
	});
	MedicationsComponent.method("getScheduledSort", function(){
		return (this.m_scheduledSort);
	});
	MedicationsComponent.method("setPRNAdminSort", function(value){
		this.m_prnAdminSort = value;
	});
	MedicationsComponent.method("getPRNAdminSort", function(){
		return (this.m_prnAdminSort);
	});
	MedicationsComponent.method("setPRNUnschedAvailSort", function(value){
		this.m_prnUnschedAvailSort = value;
	});
	MedicationsComponent.method("getPRNUnschedAvailSort", function(){
		return (this.m_prnUnschedAvailSort);
	});
	MedicationsComponent.method("setContinuousSort", function(value){
		this.m_continuousSort = value;
	});
	MedicationsComponent.method("getContinuousSort", function(){
		return (this.m_continuousSort);
	});
	MedicationsComponent.method("setDisplayScheduleFaceUpDt", function(value){
		this.m_faceUpDtSched = value;
	});
	MedicationsComponent.method("getDisplayScheduleFaceUpDt", function(){
		return (this.m_faceUpDtSched);
	});
	MedicationsComponent.method("setDisplayPRNFaceUpDt", function(value){
		this.m_faceUpDtPRN = value;
	});
	MedicationsComponent.method("getDisplayPRNFaceUpDt", function(){
		return (this.m_faceUpDtPRN);
	});
	
	MedicationsComponent.method("openTab", function(){
	    var criterion = this.getCriterion();
	    
	    var sParms = '/PERSONID=' + criterion.person_id + ' /ENCNTRID=' + criterion.encntr_id + ' /FIRSTTAB=^' + this.getLink() + '+^';
	    APPLINK(0, criterion.executable, sParms);
	    this.InsertData();
    });
}

MedicationsComponent.inherits(MPageComponent);

/**
 * Medication methods
 * @namespace CERN_MEDS_O1
 * @static
 * @global
 */

var CERN_MEDS_O1 = function(){
    return {
        GetMedicationData: function(component){
            var mgr = new MP_Core.XMLCCLRequestThreadManager(CERN_MEDS_O1.RenderReply, component, true);
            var criterion = component.getCriterion();
            /*	
             LOAD INDICATOR						BASE10	INCLUDE
             load_ordered_ind					1		YES
             load_future_ind					2		YES
             load_in_process_ind				4		YES
             load_on_hold_ind					8		YES
             load_suspended_ind					16		NO
             load_incomplete_ind				32		YES
             load_canceled_ind					64		NO
             load_discontinued_ind				128		NO
             load_completed_ind					256		NO
             load_pending_complete_ind			512		NO
             load_voided_with_results_ind		1024	NO
             load_voided_without_results_ind	2048	NO
             load_transfer_canceled_ind			4096	NO
             */
            if (component.isScheduled() || component.isContinuous() || component.isPRN()) {
                var sendAr = []
				
				sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", 0, 47, 57, 0, 1, 0, 0, 0, 0, 2);
				
                var request = new MP_Core.ScriptRequest(component, "ENG:MPG.MEDS.O1 - load sch, cont, prn data");
                request.setProgramName("MP_GET_ORDERS");
                request.setParameters(sendAr);
                request.setAsync(true);
                
                var thread = new MP_Core.XMLCCLRequestThread("GetMostMedData", component, request);
                mgr.addThread(thread);
            }
            /*	
             LOAD INDICATOR						BASE10	INCLUDE
             load_ordered_ind					1		YES
             load_future_ind					2		YES
             load_in_process_ind				4		YES
             load_on_hold_ind					8		YES
             load_suspended_ind					16		YES
             load_incomplete_ind				32		YES
             load_canceled_ind					64		YES
             load_discontinued_ind				128		YES
             load_completed_ind					256		YES
             load_pending_complete_ind			512		YES
             load_voided_with_results_ind		1024	YES
             load_voided_without_results_ind	2048	YES
             load_transfer_canceled_ind			4096	YES
             */
            if (component.isAdministered()) {
                var sendAr = []
                sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", component.getAdministeredLookBkHrs(), 8191, 57, 0, 1, 0, 0, 0, 0, 2);
                
                var request = new MP_Core.ScriptRequest(component, "ENG:MPG.MEDS.O1 - load administered data");
                request.setProgramName("MP_GET_ORDERS");
                request.setParameters(sendAr);
                request.setAsync(true);
                
                var thread = new MP_Core.XMLCCLRequestThread("GetAdministeredData", component, request);
                mgr.addThread(thread);
            }
            /*	
             LOAD INDICATOR						BASE10	INCLUDE
             load_ordered_ind					1		NO
             load_future_ind					2		NO
             load_in_process_ind				4		NO
             load_on_hold_ind					8		NO
             load_suspended_ind					16		YES
             load_incomplete_ind				32		NO
             load_canceled_ind					64		NO
             load_discontinued_ind				128		NO
             load_completed_ind					256		NO
             load_pending_complete_ind			512		NO
             load_voided_with_results_ind		1024	NO
             load_voided_without_results_ind	2048	NO
             load_transfer_canceled_ind			4096	NO
             */
            if (component.isSuspended()) {
                var sendAr = []
                sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", 0, 16, 57, 0, 1, 4, 0, 0, 0, 2);
                
                var request = new MP_Core.ScriptRequest(component, "ENG:MPG.MEDS.O1 - load suspended data");
                request.setProgramName("MP_GET_ORDERS");
                request.setParameters(sendAr);
                request.setAsync(true);
                
                var thread = new MP_Core.XMLCCLRequestThread("GetSuspendedData", component, request);
                mgr.addThread(thread);
            }
            /*	
             LOAD INDICATOR						BASE10	INCLUDE
             load_ordered_ind					1		NO
             load_future_ind					2		NO
             load_in_process_ind				4		NO
             load_on_hold_ind					8		NO
             load_suspended_ind					16		NO
             load_incomplete_ind				32		NO
             load_canceled_ind					64		YES
             load_discontinued_ind				128		YES
             load_completed_ind					256		NO
             load_pending_complete_ind			512		NO
             load_voided_with_results_ind		1024	NO
             load_voided_without_results_ind	2048	NO
             load_transfer_canceled_ind			4096	NO
             64+128 = 192
             */
            if (component.isDiscontinued()) {
                var sendAr = []
                sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", component.getDiscontinuedLookBkHr(), 192, 57, 0, 1, 4, 0, 0, 0, 1);
                
                var request = new MP_Core.ScriptRequest(component, "ENG:MPG.MEDS.O1 - load discontinued data");
                request.setProgramName("MP_GET_ORDERS");
                request.setParameters(sendAr);
                request.setAsync(true);
                
                var thread = new MP_Core.XMLCCLRequestThread("GetDiscontinuedData", component, request);
                mgr.addThread(thread);
            }
            
            mgr.begin();
        },
        RenderReply: function(replyAr, component){
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
                var dateTime = new Date();
                var sHTML = "", countText = "", jsHTML = [];
                var codeAr = [];
                var prsnlAr = [];
                
                var jsScheduled = [];
                var jsContinous = [];
                var jsPRNAdmin = [];
				var jsPRNUnschedAvail = [];
                var jsAdministered = [];
                var jsSuspended = [];
                var jsDiscontinued = [];
				var prnLast48Orders = [];
                
                var prnCount = 0;
				var prnUnschedAvailCount = 0;
                var continousCount = 0;
                var scheduledCount = 0;
                var AdministeredCount = 0;
                var SuspendedCount = 0;
                var DiscontinuedCount = 0;
                
                for (var x = replyAr.length; x--;) {
                    var reply = replyAr[x];
                    if (reply.getStatus() == "S") {
                        switch (reply.getName()) {
                            case "GetMostMedData":
                                var recordData = reply.getResponse();
                                var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                                var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
                                
                                recordData.ORDERS.sort(SortByMedicationName);
                                
                                var prnLookbackDays = component.getPRNLookbackDays();
                                var prnLookbackDate = new Date();
                                var hrs = prnLookbackDate.getHours() - (24 * prnLookbackDays);
                                prnLookbackDate.setHours(hrs);
								
								var schedLookaheadHrs = component.getSchedLookaheadHrs();
								var schedLookaheadDate = new Date();
								var schedHrs = schedLookaheadDate.getHours() + schedLookaheadHrs;
								schedLookaheadDate.setHours(schedHrs);
                                
                                var orderPrnAdmin = [];
								var orderScheduled = [];
								var orderPRNUnschedAvail = [];
								var orderContinuous = [];
                                //for PRN/Unscheduled, Scheduled, and Continous only retrieve these type of medications if
                                //they are in the following status:
                                //ordered, inprocess, future, incomplete, onhold.
                                
                                for (var y = 0, yl = recordData.ORDERS.length; y < yl; y++) {
                                    var order = recordData.ORDERS[y];
                                    var orderStatus = MP_Util.GetValueFromArray(order.CORE.STATUS_CD, codeArray);
                                    
                                    if (orderStatus) {
                                        var item = null;
                                        switch (orderStatus.meaning) {
                                            case "ORDERED":
                                            case "INPROCESS":
                                            case "FUTURE":
                                            case "INCOMPLETE":
                                            case "MEDSTUDENT":
                                                if (order.SCHEDULE.PRN_IND == 1 || order.SCHEDULE.FREQUENCY.UNSCHEDULED_IND == 1) {
                                                    if (prnLookbackDays > 0) {
														var sDate = GetHeadsUpMedicationDate(order);
														if (sDate != "") {
															var dateTime = new Date();
															dateTime.setISO8601(sDate);
															if (dateTime >= prnLookbackDate) {
																orderPrnAdmin.push(order);
																prnCount++;
															}
															orderPRNUnschedAvail.push(order);
															prnUnschedAvailCount++;

														}
														else {
															orderPRNUnschedAvail.push(order);
															prnUnschedAvailCount++;
														}
													}
													else {
														orderPRNUnschedAvail.push(order);
														prnUnschedAvailCount++;
													}
                                                    
                                                    
                                                }
                                                else if (order.SCHEDULE.CONSTANT_IND == 1) {
                                                    orderContinuous.push(order);
                                                    continousCount++;
                                                }
                                                else if (order.SCHEDULE.SUSPENDED_DT_TM == "") {
													if (schedLookaheadHrs > 0) {
														var sDate = GetHeadsUpMedicationDate(order);
														if (sDate != "") {
																var dateTime = new Date();
																dateTime.setISO8601(sDate);
																if (dateTime <= schedLookaheadDate) {
																	orderScheduled.push(order);
																	scheduledCount++;
																}
															}
														}
														else{
															orderScheduled.push(order);
															scheduledCount++;
														}   
                                                }
                                                break;
                                        }
                                    }
                                }
								var prnSort = component.getPRNAdminSort()
								SortMedications(orderPrnAdmin,prnSort)
								jsPRNAdmin = CreateMedicationItemFromArray(orderPrnAdmin, codeArray, personnelArray, true);
								
								var schedSort = component.getScheduledSort()
								SortMedications(orderScheduled, schedSort)
								jsScheduled = CreateMedicationItemFromArray(orderScheduled, codeArray, personnelArray, component.getDisplayScheduleFaceUpDt(), schedSort);
								
								var prnUnschedAvailSort = component.getPRNUnschedAvailSort();
								SortMedications(orderPRNUnschedAvail, prnUnschedAvailSort);
								jsPRNUnschedAvail = CreateMedicationItemFromArray(orderPRNUnschedAvail, codeArray, personnelArray, component.getDisplayPRNFaceUpDt());
								
								var continuousSort = component.getContinuousSort()
								SortMedications(orderContinuous, continuousSort);
								jsContinous = CreateMedicationItemFromArray(orderContinuous, codeArray, personnelArray);
								


                                break;
                            case "GetAdministeredData":
                                var adminLookback = new Date();
                                adminLookback.setHours(adminLookback.getHours() - component.getAdministeredLookBkHrs());
                                
                                var recordData = reply.getResponse();
                                var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                                var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
                                
                                recordData.ORDERS.sort(SortByMedicationName);
                                for (var z = 0, zl = recordData.ORDERS.length; z < zl; z++) {
                                    var order = recordData.ORDERS[z];
                                    if (order.DETAILS.LAST_DOSE_DT_TM != "") {
                                        dateTime.setISO8601(order.DETAILS.LAST_DOSE_DT_TM);
                                        if (dateTime >= adminLookback) {
                                            jsAdministered.push(CreateMedicationItem(order, codeArray, personnelArray))
                                            AdministeredCount++;
                                        }
                                    }
                                }
                                break;
                            case "GetSuspendedData":
                                var recordData = reply.getResponse();
                                var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                                var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
                                
                                recordData.ORDERS.sort(SortByMedicationName);
                                for (var z = 0, zl = recordData.ORDERS.length; z < zl; z++) {
                                    var order = recordData.ORDERS[z];
                                    var item = CreateMedicationItem(order, codeArray, personnelArray)
                                    jsSuspended.push(item);
                                    SuspendedCount++
                                }
                                break;
                            case "GetDiscontinuedData":
                                var recordData = reply.getResponse();
                                var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                                var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
                                
                                recordData.ORDERS.sort(SortByMedicationName);
                                for (var z = 0, zl = recordData.ORDERS.length; z < zl; z++) {
                                    var order = recordData.ORDERS[z];
                                    var item = CreateMedicationItem(order, codeArray, personnelArray)
                                    jsDiscontinued.push(item);
                                    DiscontinuedCount++;
                                }
                                break;
                        }
                    }
                }
                if (component.isScheduled()) {
					var lookFwdText = "";
					if(schedLookaheadHrs > 0){
						//Add Code for Nursing
						lookFwdText = " " + i18n.NEXT_N_HOURS.replace("{0}", component.getSchedLookaheadHrs());
					}
                    jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.SCHEDULED, " (", scheduledCount, ")", lookFwdText," </span></h3>");
                    if ((schedLookaheadHrs > 0) && (scheduledCount > 0) && (component.getDisplayScheduleFaceUpDt())) {
                        jsHTML.push("<div class='sub-sec-content'><div class='content-hdr'><dl class='med-info-hdr'><dd class='med-name'></dd><dd class='med-date'>", i18n.NEXT_DOSE, "</dd></dl></div><div class='content-body'", ">", jsScheduled.join(""), "</div></div>");
                    }
					else if(scheduledCount > 0)
					{
						jsHTML.push("<div class='sub-sec-content'><div class='content-body'", ">", jsScheduled.join(""), "</div></div>");
					}
                    jsHTML.push("</div>");
                }
                if (component.isContinuous()) {
                    jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.CONTINOUS, " (", continousCount, ")</span></h3>");
                    if (continousCount > 0) {
                        jsHTML.push("<div class='sub-sec-content'><div class='content-body'", ">", jsContinous.join(""), "</div></div>");
                    }
                    jsHTML.push("</div>");
                }
                if (component.getPRNLookbackDays() > 0) {
                    jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.PRN, "/", i18n.UNSCHEDULED," (", prnCount, ")");
                    jsHTML.push(" ",i18n.ADMIN_LAST_N_HOURS.replace("{0}", component.getPRNLookbackDays() * 24))
                    jsHTML.push("</span></h3>");
					if(prnCount > 0)
                    	jsHTML.push("<div class='sub-sec-content'><div class='content-hdr'><dl class='med-info-hdr'><dd class='med-name'></dd><dd class='med-date'>", i18n.LAST_GIVEN, "</dd></dl></div><div class='content-body'", ">", jsPRNAdmin.join(""), "</div></div>");     
                    jsHTML.push("</div>");
					
                }
				
				if (component.isPRN()) {
					jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.PRN_UNSCHEDULED, " (", prnUnschedAvailCount, ")");
                    jsHTML.push("</span></h3>");
                    if (prnUnschedAvailCount > 0) {
						if (component.getDisplayPRNFaceUpDt()) {
							jsHTML.push("<div class='sub-sec-content'><div class='content-hdr'><dl class='med-info-hdr'><dd class='med-name'></dd><dd class='med-date'>", i18n.LAST_GIVEN, "</dd></dl></div><div class='content-body'", ">", jsPRNUnschedAvail.join(""), "</div></div>");
						}
						else{
							 jsHTML.push("<div class='sub-sec-content'><div class='content-body'", ">", jsPRNUnschedAvail.join(""), "</div></div>");
						}
                    }
                    jsHTML.push("</div>");
				}
                if (component.isAdministered()) {
                
                    jsHTML.push("<div class='sub-sec closed'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.SHOW_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.ADMINISTERED, " (", AdministeredCount, ")");
                    if (component.getAdministeredLookBkHrs() > 0) 
                        jsHTML.push(" ", i18n.LAST_N_HOURS.replace("{0}", component.getAdministeredLookBkHrs()))
                    jsHTML.push("</span></h3>");
                    if (AdministeredCount > 0) {
                        jsHTML.push("<div class='sub-sec-content'><div class='content-body'>", jsAdministered.join(""), "</div></div>");
                    }
                    jsHTML.push("</div>");
                }
                if (component.isSuspended()) {
                
                    jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.SUSPENDED, " (", SuspendedCount, ")</span></h3>");
                    if (SuspendedCount > 0) {
                        jsHTML.push("<div class='sub-sec-content'><div class='content-body'>", jsSuspended.join(""), "</div></div>");
                    }
                    jsHTML.push("</div>");
                }
                if (component.isDiscontinued()) {
                    jsHTML.push("<div class='sub-sec closed'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl ' title='", i18n.SHOW_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.DISCONTINUED, " (", DiscontinuedCount, ")");
                    if (component.getDiscontinuedLookBkHr() > 0) 
                        jsHTML.push(" ", i18n.LAST_N_HOURS.replace("{0}", component.getDiscontinuedLookBkHr()))
                    jsHTML.push("</span></h3>");
                    if (DiscontinuedCount > 0) {
                        jsHTML.push("<div class='sub-sec-content'><div class='content-body'>", jsDiscontinued.join(""), "</div></div>");
                    }
                    jsHTML.push("</div>");
                }
                var content = [];
                var totalLength = DiscontinuedCount + SuspendedCount + AdministeredCount + prnCount + continousCount + scheduledCount + prnUnschedAvailCount;
                content.push("<div class='", MP_Util.GetContentClass(component, totalLength), "'>", jsHTML.join(""), "</div>");
                sHTML = content.join("");
                countText = MP_Util.CreateTitleText(component, totalLength);
                MP_Util.Doc.FinalizeComponent(sHTML, component, countText);
                
            } 
            catch (err) {
                var errMsg = [];
                errMsg.push("<b>", i18n.JS_ERROR, "</b><br><ul><li>", i18n.MESSAGE, ": ", err.message, "</li><li>", i18n.NAME, ": ", err.name, "</li><li>", i18n.NUMBER, ": ", (err.number & 0xFFFF), "</li><li>", i18n.DESCRIPTION, ": ", err.description, "</li></ul>");
                MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, countText);
                
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
    function CreateMedicationItem(orders, codeAr, prsnlAr, faceUpDateFlag, severityFlag){
        var item = [];
        var medOrigDate = "", medHvrOrigDate = "", startDate = "" ,origOrderDate = "", stopDate = "", stopReason = "", nextDoseDate = "", lastDoesDate = "", respProv = "";
        var currentDate = new Date();
        var orderStatus = MP_Util.GetValueFromArray(orders.CORE.STATUS_CD, codeAr);
        
        var medName = GetMedicationDisplayName(orders);
        var dateTime = new Date();
        var sDate = GetHeadsUpMedicationDate(orders);
        if (sDate != "") {
            dateTime.setISO8601(sDate);
            medOrigDate = dateTime.format("longDateTime2");
            medHvrOrigDate = dateTime.format("longDateTime3");
        }
        
        if (orders.SCHEDULE.CURRENT_START_DT_TM != "") {
            dateTime.setISO8601(orders.SCHEDULE.CURRENT_START_DT_TM);
            startDate = dateTime.format("longDateTime3");
        }
		if (orders.SCHEDULE.ORIG_ORDER_DT_TM != ""){
			dateTime.setISO8601(orders.SCHEDULE.ORIG_ORDER_DT_TM);
			origOrderDate = dateTime.format("longDateTime3");
		}
        if (orders.SCHEDULE.PROJECTED_STOP_DT_TM != "") {
            dateTime.setISO8601(orders.SCHEDULE.PROJECTED_STOP_DT_TM);
            stopDate = dateTime.format("longDateTime3");
            var reason = MP_Util.GetValueFromArray(orders.SCHEDULE.STOP_TYPE_CD, codeAr);
            if (reason != null) {
                stopReason = reason.display;
            }
        }
        if (orders.DETAILS.NEXT_DOSE_DT_TM != "") {
            dateTime.setISO8601(orders.DETAILS.NEXT_DOSE_DT_TM);
            nextDoseDate = dateTime.format("longDateTime3");
        }
        if (orders.DETAILS.LAST_DOSE_DT_TM != "") {
            dateTime.setISO8601(orders.DETAILS.LAST_DOSE_DT_TM);
            lastDoesDate = dateTime.format("longDateTime3");
        }
        
        var jsSeverity = ""
        if (orders.SCHEDULE.PRN_IND == 0 && orders.SCHEDULE.CONSTANT_IND == 0 && orders.SCHEDULE.SUSPENDED_DT_TM == "") {
            if (orders.DETAILS.NEXT_DOSE_DT_TM != "") {
                dateTime.setISO8601(orders.DETAILS.NEXT_DOSE_DT_TM);
                if (!(dateTime < currentDate)) {
                    jsSeverity = "res-normal";
                }
				else if(severityFlag){
					jsSeverity = "res-severe";
				}
            }
        }
        
        if (orders.CORE.RESPONSIBLE_PROVIDER_ID != 0) {
            var prov = MP_Util.GetValueFromArray(orders.CORE.RESPONSIBLE_PROVIDER_ID, prsnlAr);
            respProv = prov.fullName;
        }
        
        
        //for the date that is displayed heads up is either last given for PRN, no date for continous, and next does for scheduled
        item.push("<h3 class='med-info-hd'><span>", medName, "</span></h3>")
		if (faceUpDateFlag) {
			item.push("<dl class='med-info'><dd class= 'med-name'><span class='", jsSeverity, "'>", medName, "</span><span class='med-sig'>", GetDoseRouteInfo(orders, codeAr), "</span></dd><dd class= 'med-date'><span class='", jsSeverity, "'>", medOrigDate, "</span></dd></dl>")
		}
		else {
			item.push("<dl class='med-info'><dd><span class='", jsSeverity, "'>", medName, "</span><span class='med-sig'>", GetDoseRouteInfo(orders, codeAr), "</span></dd></dl>")
		}
			
        item.push("<h4 class='med-det-hd'><span>", i18n.MED_DETAILS, "</span></h4>", "<div class='hvr'><dl class='med-det'>", "<dt><span>", i18n.MED_NAME, ":</span></dt><dd class='med-det-name'><span>", GetMedicationDisplayNameForHover(orders), "</span></dd>")
        if (medName != "") 
            item.push("<dt><span>", i18n.REQUESTED_START, ":</span></dt><dd class='med-det-dt'><span>", startDate, "</span></dd>");
        else 
            item.push("<dt><span>", i18n.REQUESTED_START, ":</span></dt><dd class='med-det-dt'><span>&nbsp;</span></dd>");
			
		item.push("<dt><span>", i18n.ORIG_DT_TM, ":</span></dt><dd class='med-det-dt'><span>", origOrderDate, "</span></dd>");
		/*
        STOP_DT_TM: "Stop Date/Time",
        STOP_REASON: "Stop Reason",
         */
		
        item.push("<dt><span>", i18n.LAST_DOSE_DT_TM, ":</span></dt><dd class='med-det-dt'><span>", lastDoesDate, "</span></dd>");
        item.push("<dt><span>", i18n.NEXT_DOSE_DT_TM, ":</span></dt><dd class='med-det-dt'><span>", nextDoseDate, "</span></dd>");
		item.push("<dt><span>", i18n.STOP_DT_TM,":</span></dt><dd class='med-det-dt'><span>", stopDate, "</span></dd>",
				  "<dt><span>", i18n.STOP_REASON,":</span></dt><dd class='med-det-dt'><span>", stopReason, "</span></dd>");
        item.push("<dt><span>", i18n.RESPONSIBLE_PROVIDER, ":</span></dt><dd class='med-det-dt'><span>", respProv, "</span></dd>");
        item.push("<dt><span>", i18n.STATUS, ":</span></dt><dd class='med-det-dt'><span>", orderStatus.display, "</span></dd>", "<dt><span>", i18n.DETAILS, ":</span></dt><dd class='med-det-dt'><span>", GetDoseRouteInfo(orders, codeAr, true), "</span></dd>", "</dl></div>")
        
        return (item.join(""));
    }
	function CreateMedicationItemFromArray(ordersArray, codeArray, personnelArray, faceUpDateFlag,  severityFlag)
	{
		var jsMedItem = []
		for(var z=0, zl = ordersArray.length; z < zl; z++)
		{
			jsMedItem.push(CreateMedicationItem(ordersArray[z], codeArray, personnelArray, faceUpDateFlag,  severityFlag))
		}
		return jsMedItem;
	}
    function GetHeadsUpMedicationDate(a){
        if (a.SCHEDULE.PRN_IND == 1 || a.SCHEDULE.FREQUENCY.UNSCHEDULED_IND == 1) 
            return a.DETAILS.LAST_DOSE_DT_TM;
        else if (a.SCHEDULE.CONSTANT_IND == 1) 
            return "";
        else if (a.SCHEDULE.SUSPENDED_DT_TM == "") 
            return a.DETAILS.NEXT_DOSE_DT_TM;
        else 
            return "";
    }
    
    function SortByMedicationName(a, b){
        var aName = GetMedicationDisplayName(a);
        var bName = GetMedicationDisplayName(b);
        var aUpper = (aName != null) ? aName.toUpperCase() : "";
        var bUpper = (bName != null) ? bName.toUpperCase() : "";
        
        if (aUpper > bUpper) 
            return 1;
        else if (aUpper < bUpper) 
            return -1;
        return 0
    }
    
    function SortByLastDose(a, b){
        if (a.DETAILS.LAST_DOSE_DT_TM > b.DETAILS.LAST_DOSE_DT_TM) 
            return -1;
        else if (a.DETAILS.LAST_DOSE_DT_TM < b.DETAILS.LAST_DOSE_DT_TM) 
            return 1;
        else 
            return 0;
    }
    
    function SortByNextDose(a, b){
        if (a.DETAILS.NEXT_DOSE_DT_TM > b.DETAILS.NEXT_DOSE_DT_TM) 
            return 1;
        else if (a.DETAILS.NEXT_DOSE_DT_TM < b.DETAILS.NEXT_DOSE_DT_TM) 
            return -1;
        else 
            return 0;
    }
    
    function GetMedicationDisplayName(order){
        var medName = "";
        if (order.DISPLAYS != null) {
            medName = order.DISPLAYS.CLINICAL_NAME;
            if (medName == "") {
                medName = order.DISPLAYS.REFERENCE_NAME;
            }
            if (medName == "") {
                medName = order.DISPLAYS.DEPARTMENT_NAME;
            }
        }
        return (medName);
    }
    
    function GetMedicationDisplayNameForHover(order){
        var medName = "";
        if (order.DISPLAYS != null) {
            medName = order.DISPLAYS.REFERENCE_NAME;
            if (medName == "") {
                medName = order.DISPLAYS.CLINICAL_NAME;
            }
            else {
                if (order.DISPLAYS.CLINICAL_NAME != "" && order.DISPLAYS.CLINICAL_NAME != medName) {
                    medName = medName.concat(" (", order.DISPLAYS.CLINICAL_NAME, ")")
                }
            }
            if (medName == "") {
                medName = order.DISPLAYS.DEPARTMENT_NAME;
            }
        }
        return (medName);
    }
    
    function GetDoseRouteInfo(order, codeArray, hoverFlag){
        //return (order.DISPLAYS.CLINICAL_DISPLAY_LINE);
        
        if (hoverFlag && (order.DISPLAYS.SIMPLIFIED_DISPLAY_LINE != "")) {
            return order.DISPLAYS.SIMPLIFIED_DISPLAY_LINE;
        }
        var returnVal = new Array();
        
        for (var x = 0, xl = order.MEDICATION_INFORMATION.INGREDIENTS.length; x < xl; x++) {
            var ingred = order.MEDICATION_INFORMATION.INGREDIENTS[x];
            if (x != 0) {
                returnVal.push("  ");
            }
            if (ingred.DOSE.STRENGTH != 0) {
                returnVal.push(ingred.DOSE.STRENGTH);
                if (ingred.DOSE.STRENGTH_UNIT_CD != 0) 
                    returnVal.push(" ", MP_Util.GetValueFromArray(ingred.DOSE.STRENGTH_UNIT_CD, codeArray).display);
            }
            if (ingred.DOSE.VOLUME != 0) {
                returnVal.push(ingred.DOSE.VOLUME);
                if (ingred.DOSE.VOLUME_UNIT_CD != 0) 
                    returnVal.push(" ", MP_Util.GetValueFromArray(ingred.DOSE.VOLUME_UNIT_CD, codeArray).display);
            }
            if (order.SCHEDULE.ROUTE != "") {
                returnVal.push("  ", order.SCHEDULE.ROUTE);
            }
            if (order.SCHEDULE.FREQUENCY.FREQUENCY_CD > 0) {
                returnVal.push("  ", MP_Util.GetValueFromArray(order.SCHEDULE.FREQUENCY.FREQUENCY_CD, codeArray).display);
            }
        }
        
        return returnVal.join("");
    }
	
	function SortMedications(orders, sortType){
		switch(sortType) {
	case CERN_MEDS_O1.LastDoseDateTime:
	    orders.sort(SortByLastDose)
		break;
	case CERN_MEDS_O1.NextDoseDateTime:
		orders.sort(SortByNextDose)
		break;
	default: 
		orders.sort(SortByMedicationName)
	}


	}
}();
CERN_MEDS_O1.LastDoseDateTime = 1; 
CERN_MEDS_O1.NextDoseDateTime = 2;/**
 * Project: mp_microbiology_o1.js
 * Version 1.0.0
 * Released 7/26/2010
 * @author Greg Howdeshell (GH7199)
 * @author Megha Rao (MR018925)
 * @author Mark Davenport (MD019066)
 * @author Ryan Wareham (RW012837)
 */
function MicrobiologyComponentStyle(){
    this.initByNamespace("mic");
}

MicrobiologyComponentStyle.inherits(ComponentStyle);

/**
 * The Microbiology component will retrieve all micro data associated to the patient
 *
 * @param {Criterion} criterion
 */
function MicrobiologyComponent(criterion){

    this.setCriterion(criterion);
    this.setStyles(new MicrobiologyComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.MICRO.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.MICRO.O1 - render component");
    this.setIncludeLineNumber(true);
    
    MicrobiologyComponent.method("InsertData", function(){
        CERN_MICROBIOLOGY_O1.GetMicrobiologyTable(this);
    });
    MicrobiologyComponent.method("HandleSuccess", function(recordData){
        CERN_MICROBIOLOGY_O1.RenderComponent(this, recordData);
    });
}

MicrobiologyComponent.inherits(MPageComponent);

var CERN_MICROBIOLOGY_O1 = function(){
    var encntrOption = 0;
    var lookBackUnits = 0;
    var lookBackType = 0;
    
    return {
    
        GetMicrobiologyTable: function(component){
        
            var groups = component.getGroups();
            var events = (groups != null && groups.length > 0) ? groups[0].getEventSets() : null;
            var sEvents = (events != null) ? "value(" + events.join(",") + ")" : "0.0";
            var criterion = component.getCriterion();
            
            encntrOption = (component.getScope() == 1) ? "0.0" : (criterion.encntr_id + ".0");
            lookBackUnits = (component.getLookbackUnits() != null) ? component.getLookbackUnits() : "0";
            lookBackType = (component.getLookbackUnitTypeFlag() != null) ? component.getLookbackUnitTypeFlag() : "0";
            
            var sendAr = [];
            
            sendAr.push("^MINE^", criterion.person_id + ".0", encntrOption, criterion.provider_id + ".0", lookBackUnits, sEvents, criterion.position_cd + ".0", criterion.ppr_cd + ".0", lookBackType);
            MP_Core.XMLCclRequestWrapper(component, "mp_get_micro_by_eventset", sendAr, true);
        },
        RenderComponent: function(component, recordData){
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            
            try {
            
                var jsHTML = [];
                var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                var jsMicHTML = [];
                var micObj = recordData.MICRO_CULTURE;
                micObj.sort(SortByDate);
                var micNum = micObj.length;
                var dtFormat = component.getDateFormat();
                var collectedLabel = i18n.COLLECTED;
                
                jsMicHTML.push("<dl class='mic-info-hdr'><dd class='mic-catalog-hd'><span>&nbsp</span></dd><dd class='mic-src-hd'><span>", i18n.SOURCE, "</span></dd><dd class='mic-within-hd'><span>", i18n.COLLECTED);
                
                if (component.getDateFormat() == 3) //1 = date only,2= date/time and 3 = elapsed time	
                    jsMicHTML.push("<br/>", i18n.WITHIN, "</span></dd>");
                
                jsMicHTML.push("<dd class='mic-norm-hd'><span>", i18n.NORMALITY, "</span></dd></dl>");
                
                jsMicHTML.push("<div class='", MP_Util.GetContentClass(component, micNum), "'>");
                
                for (var i = 0; i < micNum; i++) {
                    var sTaskStatus = "", sSusceptibility = "", sCatalog = "";
                    var collectedDtTm = new Date();
                    var updtDtTm = new Date();
                    var growth_ind = micObj[i].GROWTH_IND;
                    var source = MP_Util.GetValueFromArray(micObj[i].SPECIMEN_COLLECTION.SOURCE_CD, codeArray).meaning;
                    updtDtTm.setISO8601(micObj[i].UPDT_DATE);
                    collectedDtTm.setISO8601(micObj[i].SPECIMEN_COLLECTION.COLLECTED_DATE);
                    var collectedDtTmDisp = MP_Util.DisplayDateByOption(component, collectedDtTm)
                    
                    var sCatalog = (micObj[i].ORDERS[0].CATALOG_CD > 0) ? MP_Util.GetValueFromArray(micObj[i].ORDERS[0].CATALOG_CD, codeArray).display : "";
                    var site = (micObj[i].SPECIMEN_COLLECTION.BODY_SITE_CD > 0) ? MP_Util.GetValueFromArray(micObj[i].SPECIMEN_COLLECTION.BODY_SITE_CD, codeArray).display : "";
                    var normalcy = (micObj[i].SPECIMEN_COLLECTION.MICROBIOLOGY_INTERPRETATION_CD > 0) ? MP_Util.GetValueFromArray(micObj[i].SPECIMEN_COLLECTION.MICROBIOLOGY_INTERPRETATION_CD, codeArray) : null;
                    var isGrowth = "", growthIndClass = "";
                    if (micObj[i].TASK_CD > 0) {
                        sTaskStatus = MP_Util.GetValueFromArray(micObj[i].TASK_CD, codeArray).display;
                    }
                    else {
                        sTaskStatus = "--"
                    }
                    if (growth_ind == 1) {
                        growthIndClass = "<span class='res-severe'>";
                        isGrowth = i18n.GROWTH;
                    }
                    else {
                        growthIndClass = "<span>";
                        isGrowth = i18n.NO_GROWTH;
                    }
                    if (micObj[i].SUSCEPTIBILITY_IND == 1) {
                        sSusceptibility = i18n.DONE;
                    }
                    else {
                        sSusceptibility = i18n.NOT_DONE;
                    }
                    var sourceSite = "";
                    if ((site != null && site != "") && (source != null && source != "")) {
                        sourceSite = source + ", " + site;
                    }
                    else if (site != null && site != "") {
                        sourceSite = site;
                    }
                    else if (source != null && source != "") {
                        sourceSite = source
                    }
                    
                    jsMicHTML.push("<h3 class='mic-info-hd'><span> Microbiology</span></h3><dl class='mic-info'><dt><span>", i18n.MICRO, ":</span></dt><dd class='mic-catalog'>", growthIndClass, sCatalog, "</span></dd><dd class='mic-src'>", growthIndClass, sourceSite, "</span></dd><dd class='mic-within'>", growthIndClass, MP_Util.CreateClinNoteLink(micObj[i].PERSON_ID + ".0", micObj[i].ENCNTR_ID + ".0", micObj[i].EVENT_ID, collectedDtTmDisp), "</span></dd><dd class='mic-norm'>", growthIndClass, isGrowth, "</span></dd></dl><h4 class='mic-det-hd'><span>", i18n.MICRO_DETAILS, "</span></h4><div class='hvr'><dl class = 'mic-det'><dt><span>", i18n.SOURCE_SITE, ":</span></dt><dd><span>", sourceSite, "</span></dd><dt><span>", i18n.COLLECTED_DATE_TIME, ":</span></dt><dd><span>", collectedDtTm.format("longDateTime3"), "</span></dd><dt><span>", i18n.SUSCEPTIBILITY, ":</span></dt><dd><span>", sSusceptibility, "</span></dd><dt><span>", i18n.STATUS, ":</span></dt><dd><span>", sTaskStatus, "</span></dd></dl></div>");
                    
                }
                jsMicHTML.push("</div>")
                sHTML = jsMicHTML.join("");
                countText = MP_Util.CreateTitleText(component, micNum);
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
    
    function SortByDate(a, b){
        if (a.SPECIMEN_COLLECTION.COLLECTED_DATE > b.SPECIMEN_COLLECTION.COLLECTED_DATE) {
            return -1;
        }
        else if (a.SPECIMEN_COLLECTION.COLLECTED_DATE < b.SPECIMEN_COLLECTION.COLLECTED_DATE) {
            return 1;
        }
        return 0;
    }
}();
function OverviewComponentStyle()
{
	this.initByNamespace("overview");
}
OverviewComponentStyle.inherits(ComponentStyle);

function OverviewComponent(criterion){
	this.setCriterion(criterion);
	this.setStyles(new OverviewComponentStyle());
	this.setIncludeLineNumber(false);
	
    OverviewComponent.method("InsertData", function(){
		var nameSpace = new CERN_NB_OVERVIEW_O1();
		nameSpace.GetOverviewTable(this);
    });
	OverviewComponent.method("HandleSuccess", function(recordData){		
		var nameSpace = new CERN_NB_OVERVIEW_O1();
		nameSpace.RenderComponent(this, recordData);
	});
}
OverviewComponent.inherits(MPageComponent);

 /**
  * Document methods
  * @namespace CERN_NB_OVERVIEW_O1
  * @static
  * @global
  */
var CERN_NB_OVERVIEW_O1 = function(){
    return {
        GetOverviewTable : function(component){
			var sendAr = [];
			var criterion = component.getCriterion();
			sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.encntr_id + ".0", criterion.position_cd + ".0", criterion.ppr_cd + ".0");
			MP_Core.XMLCclRequestWrapper(component, "MP_NB_GET_OVERVIEW", sendAr, true);
        },
		
		RenderComponent : function(component, recordData){
			try{
				var contentId = component.getStyles().getContentId();
				var rootId = component.getStyles().getId();
				var contacts = recordData.CONTACT_INFO.CONTACT;
				//This is a quick hack to work around a non passive change in how CCL generates JSON
				//CONTACT_INFO could either be an object or an array containing a single object
				//If we don't get the CONTACT array the first way, try the second
				//(We could also change the script so that the contact_info item in the record structure
				//is variable length instead of fixed)
				if (contacts === undefined) {
					contacts = recordData.CONTACT_INFO[0].CONTACT;
				}
				var contactTableHTML = ""
				var deliveryTable = ["<table class='overview-table'>"];
				var dateOfBirth = new Date();
				dateOfBirth.setISO8601(recordData.DOB);
				var ageHours = recordData.AGE_HOURS;
				var dayOfLife = recordData.DAYS_OF_LIFE;
				
				//There's got to be a better way to generate column oriented tables but its escaping me so this is the best i could do
				//maybe it would be better to restructure the script reply than to build column1 here
				var column1 = [];
				column1.push({LABEL: i18n_nb.BIRTH_DT, VALUE: dateOfBirth.format("longDateTime3", true)}); 
				//not sure if it would be better to send the date from the script differently so it doesn't require UTC flag
				column1.push({LABEL: i18n_nb.EGA_BALLARD, VALUE: recordData.EGA_BALLARD, 
					HOVER_DATA: recordData.BALLARD_DETAILS, HOVER_FXN: ballardDetails});
				column1.push({LABEL: i18n_nb.SEX, VALUE: recordData.SEX});
				column1.push({LABEL: i18n_nb.APGAR_1, VALUE: recordData.APGAR1MIN, 
					HOVER_DATA: recordData.APGAR1DETAILS, HOVER_FXN: generateDetails});
				column1.push({LABEL: i18n_nb.APGAR_5, VALUE: recordData.APGAR5MIN, 
					HOVER_DATA: recordData.APGAR5DETAILS, HOVER_FXN: generateDetails});
				column1.push({LABEL: i18n_nb.APGAR_10, VALUE: recordData.APGAR10MIN, 
					HOVER_DATA: recordData.APGAR10DETAILS, HOVER_FXN: generateDetails});
				
				recordData.DELIVERY.sortBy(function(s){return s.SEQ;});
				recordData.DELIVERY.each(function(i){column1.push(i)});
								
				var column2 = recordData.NEWBORN;
				column2.sortBy(function(s){return s.SEQ;});
				
				var column3 = recordData.MATERNAL;
				column3.sortBy(function(s){return s.SEQ;});
				
				//generate as many rows as the needed for the column with the most items
				var rowCount = Math.max(column1.size(), column2.size(), column3.size());		
				(rowCount).times(generateDeliveryRow);
				
				function generateDeliveryRow(n) {
					function generateDeliveryCells(item) {
						var label = (!item) ? "&nbsp;" : item.LABEL + ": ";
						var value = (!item) ? "&nbsp;" : item.VALUE;
						var hoverHTML = "";
						
						//if it exists, invoke the hover generating callback for this item
						if (item && item.HOVER_DATA && item.VALUE !== "") {
							hoverHTML = item.HOVER_FXN(item.HOVER_DATA);
						}
						return "<td class='label'>"+label+"</td><td class='value'>"+value+hoverHTML+"</td>"
					}
					var col1 = generateDeliveryCells(column1[n]);
					var col2 = generateDeliveryCells(column2[n]);
					var col3 = generateDeliveryCells(column3[n]);
					var rowHTML = "<tr>" + col1 + col2 + col3 + "</tr>";
					deliveryTable.push(rowHTML);
				}
				
				//generic detail hover generating callback that expects an array of objects
				//with LABEL and VALUE properties
				function generateDetails(detailData) {
					if (detailData.size() === 0){
						return "";
					};
				
					var detailsHTML = detailData.collect(function(d){
						return "<dt><span>"+d.LABEL+": </span></dt><dd><span>"+d.VALUE+"</span></dd>";
					}).join("");
					return "<div class='hvr'><dl>"+detailsHTML+"</dl><div>"; 	
				}
				
				//generates the hover div for the ballard details
				function ballardDetails(detailData) {
					var detailsHTML = [];
					function addDetails(header, details){
						if (details.size() === 0) {
							return;
						}
						detailsHTML.push(header+"<p>");  
						var subDetailsHTML = details.collect(function(d){
							return "<dt><span>"+d.LABEL+": </span></dt><dd><span>"+d.VALUE+"</span></dd>";
						}).join("");
						detailsHTML.push("<dl>"+subDetailsHTML+"</dl><br>")
					};
					if (!detailData) {
						return "";
					}
					//This is a quick hack to work around a non passive change in how CCL generates JSON
					//detailData could either be an object or an array containing a single object
					//If we don't get the NEURO or PHYSICIAL arrays the first way, try the second				
					if (detailData.NEURO === undefined || detailData.PHYSICAL === undefined) {
						detailData = detailData[0];
					}
					addDetails(i18n_nb.NEURO, detailData.NEURO);
					addDetails(i18n_nb.PHYSICAL, detailData.PHYSICAL);

					return "<div class='hvr'>"+detailsHTML.join("")+"<div>";
				}
				
				deliveryTable.push("</table>");
				var deliveryTableHTML = deliveryTable.join("");
				
				//Generate the HTML table for the contacts tab
				var mother = contacts.find(function(c){return c.TYPE === "MOTHER"})
				var father = contacts.find(function(c){return c.TYPE === "FATHER"})	
				//if nothing matches, findAll returns an empty array so it's safe to assume peds is not undefined
				var peds = contacts.findAll(function(c){return c.TYPE === "PEDIATRICIAN"})	
				
				contactTableHTML = "<table class='contact-table'>" + generateContactRow(mother) + generateContactRow(father) + 
					peds.collect(function(dr){return generateContactRow(dr)}).join("") + "</table>";
				//TODO: surely there's a better way to make sure the table cells are wide enough than adding spaces
				var tabMenuHTML = "<table><tr><td>\
									<ul class='tabmenu'>\
									<li ><a id='overview-tab1' class='active' href=''>"+i18n_nb.DELIVERY_SUMMARY+$R(1,12).collect(function(){return "&nbsp;"}).join("")+"</a></li>\
									<li ><a id='overview-tab2' class='inactive' href=''>"+i18n_nb.CONTACT_INFO+$R(1,19).collect(function(){return "&nbsp;"}).join("")+"</a></li>\
									</ul></td><td class='day-of-life'>"+i18n_nb.DAYS_OF_LIFE+": "+dayOfLife+"<div class='hvr'>"+ageHours+" "+i18n_nb.HOURS+"</div><td></tr>\
								</table>";
				var tempAr = new Array();
				jQuery("#"+contentId).append(tabMenuHTML);
				jQuery("#"+contentId).append("<div id='delivery-summary-tab'>"+deliveryTableHTML+"</div>");
				jQuery("#"+contentId).append("<div id='contact-info-tab' style='display:none'>"+contactTableHTML+"</div>");
				
				//add the classes for zebra stripe styling to the contact table rows.  it just seemed easier to do
				//it this way than when generating the HTML.
				//get the set of <tr> element descendents of the contact-table, and add the "odd" class to every other element
				jQuery(".contact-table tr").filter(":odd").addClass("odd")
				
				function generateContactRow(contact) {
					if (!contact) {
						return "";
					}
					var name = contact.LABEL + ": " + contact.NAME;
					var phones = contact.PHONE.collect(function(p){return p.LABEL + ": " + p.NUMBER}).join("<p>");
					var addr = (contact.STREET_ADDRESS !== "") ? i18n_nb.ADDRESS + ": " + contact.STREET_ADDRESS : "";
					var addr2 = contact.CITY + " " + contact.STATE + " " + contact.ZIP
					
					var rowHTML = "<tr><td>"+name+"</td><td>"+phones+"</td><td>"+addr+"</td><td>"+addr2+"</td></tr>"
					return rowHTML;
				}
				
				//TODO: probably want to declare this elsewhere.  i think doing so here will cause overviewData to persist
				//longer than needed.  maybe not a huge deal though.
				var activateTab = function() {
					//define a mapping (as a Prototype Hash object) between the tab <a> elements 
					//and the tab content <divs>
					var tab2div = $H({
						"overview-tab1": "delivery-summary-tab", 
						"overview-tab2": "contact-info-tab"
					});
					return function(event){
						//select all <a> elements containing "overview-tab" in the id and inactivate them
						//really, it would probably be better to figure out how to limit the selector
						//to just the elements under the overview div than in the entire document,
						//but for now it'll work.
						event.preventDefault();
						jQuery("a[id*='overview-tab']").attr("class", "inactive");
						//and hide the div associated to each tab
						tab2div.each(function(x){jQuery("#"+x[1]).css("display", "none")});
						
						//and now activate the selected tab
						//(jQuery binds "this" in the event callback to the element on which the event was triggered)
						jQuery(this).attr("class", "active");
						//and display the div associated to it
						jQuery("#"+tab2div.get(jQuery(this).attr("id"))).css("display", "block");
					}
				}();
				
				//bind the click event on the tab <a>'s to our handler
				jQuery("a[id*='overview-tab']").click(activateTab);
				
				Util.Style.g('hvr', _g(rootId), 'div').each(function(div){
					 hs(Util.gp(div), div);
				});
				
				//i'm not sure if it's preferable to override the width this way
				//or to create a different hover class in the css to handle a hover
				//where it doesn't make sense to use the same width as all the other
				//hovers
				jQuery(".day-of-life .hvr").css("width", "5em");
			
				var sResultText = MP_Util.CreateTitleText(component, 0);
				var totalCount = Util.Style.g("sec-total", component.getRootComponentNode(), "span");
				totalCount[0].innerHTML = sResultText;
			}
			catch(err){
				alert(err.message);
			}
		}
    };
        
};
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
 * Project: mp_problems_o1.js
 * Version 1.0.0
 * Released 7/23/2010
 * @author Greg Howdeshell (GH7199)
 * @author Megha Rao (MR018925)
 * @author Mark Davenport (MD019066)
 */
function ProblemsComponentStyle(){
    this.initByNamespace("pl");
}

ProblemsComponentStyle.inherits(ComponentStyle);

/**
 * The Problem component will retrieve all problem information associated to the patient
 *
 * @param {Criterion} criterion
 */
function ProblemsComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new ProblemsComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.PROBLEMS.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.PROBLEMS.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(1);
    
    ProblemsComponent.method("InsertData", function(){
        CERN_PROBLEMS_O1.GetProblemsTable(this);
    });
    ProblemsComponent.method("HandleSuccess", function(recordData){
        CERN_PROBLEMS_O1.RenderComponent(this, recordData);
    });
}

ProblemsComponent.inherits(MPageComponent);

/**
 * Problems methods
 * @namespace CERN_PROBLEMS_O1
 * @static
 * @global
 * @dependencies Script: mp_get_problems
 */
var CERN_PROBLEMS_O1 = function(){
    return {
        GetProblemsTable: function(component){
            var sendAr = [];
            var criterion = component.getCriterion();
            sendAr.push("^MINE^", criterion.person_id + ".0");
            MP_Core.XMLCclRequestWrapper(component, "MP_GET_PROBLEMS", sendAr, true);
        },
        RenderComponent: function(component, recordData){
            try {
                var jsPlHTML = [];
                var countText = ""
                var plHTML = "";
                var onsetDate = "";
                var dateTime = new Date();
                var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
                var probLen = (recordData.PROBLEM != null) ? recordData.PROBLEM.length : 0;
                jsPlHTML.push("<div class='", MP_Util.GetContentClass(component, probLen), "'>");
                var problemArray = recordData.PROBLEM;
                for (var i = 0, l = problemArray.length; i < l; i++) {
                    var responsibleProvider = "";
                    var type = "";
                    if (problemArray[i].ONSET_DT_TM != "") {
                        onsetDate = problemArray[i].ONSET_DT_TM;
                        dateTime.setISO8601(onsetDate);
                        onsetDate = dateTime.format("longDateTime3");
                    }
                    
                    if (problemArray[i].PROVIDER_ID != 0) {
                        var provCodeObj = MP_Util.GetValueFromArray(problemArray[i].PROVIDER_ID, personnelArray);
                        responsibleProvider = provCodeObj.fullName;
                    }
                    
                    var plCode = "";
                    
                    var plName = problemArray[i].NAME;
                    
                    if (problemArray[i].DISPLAY_AS != null) {
                        var plAnnot = problemArray[i].DISPLAY_AS;
                    }
                    var plFaceUp = plAnnot;
                    if (plAnnot == null || plAnnot == "" || plAnnot == plName) {
                        plAnnot = "&nbsp;";
                        plFaceUp = plName;
                    }
                    
                    if (problemArray[i].CODE != "" && problemArray[i].CODE != null) {
                        plCode = "(" + problemArray[i].CODE + ")";
                        
                    }
                    
                    if (problemArray[i].PARENT_PROBLEM_ID == 0) {
                    
                        type = "pl-name";
                    }
                    else {
                        type = "pl-assoc-name";
                    }
                    jsPlHTML.push("<h3 class='pl-info-hd'><span>", plName, "</span></h3><dl class='pl-info'><dt><span>", i18n.PROBLEMS, ":</span></dt><dd class=" + type + "><span>", plFaceUp, "</span></dd><dt><span>", i18n.CODE, ":</span></dt><dd class='pl-code'><span>", plCode, "</span></dd></dl><h4 class='pl-det-hd'><span>", i18n.PROBLEMS_DETAILS, ":</span></h4><div class='hvr'><dl class='pl-det'><dt><span>", i18n.PROBLEM, ":</span></dt><dd class='pl-det-name'><span>", plName, "</span></dd><dt><span>", i18n.ANNOTATED_DISPLAY, ":</span></dt><dd class='pl-det-annot'><span>", plAnnot, "</span></dd><dt><span>", i18n.ONSET_DATE, ":</span></dt><dd class='pl-det-dt'><span>", onsetDate, "</span></dd><dt><span>", i18n.RESPONSIBLE_PROVIDER_NAME, ":</span></dd><dd class='pl-det-dt'><span>", responsibleProvider, "</span></dd><dt><span>", i18n.COMMENTS, ":</span></dt><dd class='pl-det-comment'><span>", MP_Util.Doc.GetComments(problemArray[i], personnelArray), "</span></dd></dl></div>");
                }
                plHTML = jsPlHTML.join("");
                countText = MP_Util.CreateTitleText(component, probLen);
                jsPlHTML.push("</div>");
                MP_Util.Doc.FinalizeComponent(plHTML, component, countText);
            } 
            catch (err) {
                var countText = (component.isLineNumberIncluded() ? "(0)" : "")
                var errMsg = [];
                errMsg.push("<b>", i18n.JS_ERROR, "</b><br><ul><li>", i18n.MESSAGE, ": ", err.message, "</li><li>", i18n.NAME, ": ", err.name, "</li><li>", i18n.NUMBER, ": ", (err.number & 0xFFFF), "</li><li>", i18n.DESCRIPTION, ": ", err.description, "</li></ul>");
                MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, countText);
                throw (err);
            }
        }
    };
}();
/**
 * Project: mp_procedures_o1.js
 * Version 1.1.0
 * Released 9/30/2010
 * @author Anantha Ramu (AR018249)
 * @author Greg Howdeshell (GH7199)
 */
function ProcedureComponentStyle(){
    this.initByNamespace("proc");
}

ProcedureComponentStyle.inherits(ComponentStyle);

function ProcedureComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new ProcedureComponentStyle());
    this.setIncludeLineNumber(true);
    this.setScope(1);
    this.setComponentLoadTimerName("USR:MPG.PROCEDURE.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.PROCEDURE.O1 - render component");
    
    ProcedureComponent.method("InsertData", function(){
        CERN_PROCEDURE_O1.GetProcedureTable(this);
    });
    ProcedureComponent.method("HandleSuccess", function(recordData){
        CERN_PROCEDURE_O1.RenderComponent(this, recordData);
    });
    
}

ProcedureComponent.inherits(MPageComponent);

var CERN_PROCEDURE_O1 = function(){
    return {
        GetProcedureTable: function(component){
            var sendAr = [];
            var criterion = component.getCriterion();
            var prsnlInfo = criterion.getPersonnelInfo();
            var encntrs = prsnlInfo.getViewableEncounters();
            var encntrVal = (encntrs) ? "value("+encntrs+")" : "0.0";
            
            sendAr.push("^MINE^", criterion.person_id + ".0", encntrVal, criterion.provider_id + ".0", criterion.ppr_cd + ".0");
            MP_Core.XMLCclRequestWrapper(component, "mp_get_procedures", sendAr, true);
            
        },
        RenderComponent: function(component, recordData){
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
                var jsHTML = [];
                jsHTML.push("<div class='", MP_Util.GetContentClass(component, recordData.PROC_CNT), "'>");
                for (var i = 0; i < recordData.PROC_CNT; i++) {
                    var commentString = "";
                    
                    jsHTML.push("  <h3 class='proc-info-hd'><SPAN>", recordData.PROC[i].DISPLAY_AS, "</SPAN></h3>" +
                    "<dl class='proc-info'><dt class='proc-name'><span>", i18n.PROCEDURE, "</span></dt>" +
                    "<dd class='proc-name'><span>", recordData.PROC[i].DISPLAY_AS, "</span></dd>" +
                    "<dt class='proc-date'><span><abbr title='Signature Line'>", i18n.SIG_LINE, "</abbr></span></dt>" +
                    "<dd class='proc-date'><span>", recordData.PROC[i].ONSET, "</span></dd></dl>" +
                    "<h4 class='proc-det-hd'><span>", i18n.PROCEDURE_DETAILS, "</span></h4>" +
                    "<div class='proc-det hvr'>" +
                    "<dt class='proc-det-name'><span>", i18n.PROCEDURE, ":</span></dt>" +
                    "<dd class='proc-det-name'>", recordData.PROC[i].NAME, "</dd>" +
                    "<dt class='proc-det-name'><span>", i18n.DISPLAY_AS, ":</span></dt>" +
                    "<dd class='proc-det-name'>", recordData.PROC[i].DISPLAY_AS, "</dd>" +
                    "<dt class='proc-det-name'><span>", i18n.PROCEDURE_DATE, ":</span></dt>" +
                    "<dd class='proc-det-name'>", recordData.PROC[i].ONSET, "</dd>" +
                    "<dt class='proc-det-name'><span>", i18n.STATUS, ":</span></dt>" +
                    "<dd class='proc-det-name'>", recordData.PROC[i].STATUS, "</dd>" +
                    "<dt class='proc-det-name'><span>", i18n.PROVIDER, ":</span></dt>" +
                    "<dd class='proc-det-name'>", recordData.PROC[i].PROVIDER, "</dd>" +
                    "<dt class='proc-det-name'><span>", i18n.LOCATION, ":</span></dt>" +
                    "<dd class='proc-det-name'>", recordData.PROC[i].LOCATION, "</dd>" +
                    "<dt class='proc-det-name'><span>", i18n.COMMENTS, ":</span></dt>");
                    
                    for (var k = 0; k < recordData.PROC[i].COMMENTS.length; k++) {
                        var begin_dttm = formatDateTimeUTC(recordData.PROC[i].COMMENTS[k].BEG_EFFECTIVE_DT_TM, "longDateTime3");
                        
                        commentString += begin_dttm + " - " + recordData.PROC[i].COMMENTS[k].NAME_FULL_FORMATTED + "<br/>" + recordData.PROC[i].COMMENTS[k].LONG_TEXT + "<br/>";
                    }
                    jsHTML.push("<dd class='proc-det-name'>", commentString, "</dd>");
                    jsHTML.push("</div>");
                }
                jsHTML.push("</div>");
                var countText = MP_Util.CreateTitleText(component, recordData.PROC_CNT);
                
                MP_Util.Doc.FinalizeComponent(jsHTML.join(""), component, countText);
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
            return;
        }
    };
    function formatDateTimeUTC(dttm, format){
        var dateTime = new Date();
        dateTime.setISO8601(dttm);
        return dateTime.format(format);
    }
}();


function TaskTimelineComponentStyle()
{
	this.initByNamespace("tasks");
}
TaskTimelineComponentStyle.inherits(ComponentStyle);


/**
 * The TaskTimeline component will display a table indicating on which days of 
 * a newborn's life certain "tasks" have been completed.  The tasks here are not
 * actual order-based tasks but instead clincal events that have some result value
 * documented that can be interpreted as "complete"  Currently this can only be
 * alpha responses and the bedrock content allows for selecting the set of alpha 
 * respsonses that indicate that a result value means "complete"  Alternately, if no
 * alpha responses are defined for a type of result, then any value that exists for the
 * result will be considered oomplete.
 * 
 * @param {Criterion} criterion
 * @author Will Gorman
 */
function TaskTimelineComponent(criterion){
	this.setCriterion(criterion);
	this.setStyles(new TaskTimelineComponentStyle());

	TaskTimelineComponent.method("InsertData", function(){
		CERN_TASKTIMELINE_O1.GetTaskTimelineTable(this);
	});
	TaskTimelineComponent.method("HandleSuccess", function(recordData){
		CERN_TASKTIMELINE_O1.RenderComponent(this, recordData);
	});
}
TaskTimelineComponent.inherits(MPageComponent);

 /**
  * TaskTimeline methods
  * @namespace CERN_TASKTIMELINE_O1
  * @static
  * @global
  * @dependencies Script: mp_nbs_task_timeline
  */
var CERN_TASKTIMELINE_O1 = function(){
    return {
        GetTaskTimelineTable : function(component){
			var sendAr = [];
			var criterion = component.getCriterion();
			sendAr.push("^MINE^", 
				criterion.person_id + ".0",
				criterion.provider_id + ".0",
				"0.0", /*Encounter doesn't matter*/
				criterion.position_cd + ".0",
				criterion.ppr_cd + ".0");
			MP_Core.XMLCclRequestWrapper(component, "MP_NBS_TASK_TIMELINE", sendAr, true);
        },
        RenderComponent: function(component, recordData){
			var timelineData = recordData;
			var contentId = component.getStyles().getContentId();
			var tableHTML = "<div class='sub-sec-hd'>#{dobLabel}: #{dob}</div>\
							<table class='ttl-table'>#{header}#{rows}</table>";
			var headerTR = "<tr><th>#{day}</th>#{columns}</tr>"
			var header = "";
			var rows = [];
			
			//header row
			header = timelineData.COLUMNS.collect(function (c) {
				var th = "<th>#{heading}</th>";
				return th.interpolate({heading: c.COLUMN});
			}).join("");
			
			rows = timelineData.DAY.collect(function (d, idx) {

				var cells = [];
				var rowHTML = "<tr #{shading}>#{cells}</tr>";
				//add the day of life for the row
				cells.push("<td>#{day}</td>".interpolate({day: idx + 1}));
				
				//add cells for each column
				timelineData.COLUMNS.each(function (c, i) {
					var cellHTML = "<td #{completed}>&nbsp;#{details}</td>";
					var detailHvr = "";
					var details = "";
					//if the day's results contains a value for this column, set the appropriate class
					var result = d.RESULT.find(function(r) {return r.COLUMN === i+1;});	
					var cellClass = (result) ? "class='checked'" : "";
					if (result && result.DETAILS.length > 0) {
						details = result.DETAILS.collect(function(dtl) {
							return "<dt><span>"+dtl.DISPLAY+": </span></dt><dd><span>"+dtl.VALUE+"</span></dd>";
						}).join("");
						detailHvr = "<div class='hvr'><dl>"+details+"</dl><div>";
					}
					cells.push(cellHTML.interpolate({completed: cellClass, details: detailHvr}));
				});
				
				return rowHTML.interpolate({cells: cells.join(""), shading: (idx%2===0)?"":"class='odd'"});
				
			});
			
			_g(contentId).innerHTML = tableHTML.interpolate({
				header: headerTR.interpolate({day: i18n_nb.DAY_OF_LIFE, columns: header}),
				rows: rows.join(""),
				dobLabel: i18n_nb.DATE_OF_BIRTH,
				dob: timelineData.DOB
				}
			);
			
			//setup the hovers on all divs with the hvr class under the content div
			Util.Style.g('hvr', _g(contentId), 'div').each(function(div){
				hs(Util.gp(div), div);
			});
			
			//clear the loading indicator from the section header
			var rootComponentNode = component.getRootComponentNode();
			var totalCount = Util.Style.g("sec-total", rootComponentNode, "span");
			totalCount[0].innerHTML = "";
        }
    };
}();/**
 * Project: mp_vitalsigns_o1.js
 * Version 1.1.0
 * Released TBD
 * @author Mark Davenport (MD019066)
 * @author Greg Howdeshell (GH7199)
 * @author Sreenivasan Thirumalachar (st017230)
 *
 */
function VitalSignComponentStyle(){
    this.initByNamespace("vs");
}

VitalSignComponentStyle.inherits(ComponentStyle);

/**
 * Vital Signs Component
 *
 * @param {Criterion} criterion
 */
function VitalSignComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new VitalSignComponentStyle());
    this.setIncludeLineNumber(false);
    this.m_graphLink = 1;
	   
    VitalSignComponent.method("InsertData", function(){
        var nameSpace = new CERN_VITALSIGN_O1();
        nameSpace.GetVitalSignsTable(this);
    });
    VitalSignComponent.method("setGraphFlag", function(value){
        this.m_graphLink = value;
    });
    VitalSignComponent.method("getGraphFlag", function(){
        return (this.m_graphLink)
    });
    
    VitalSignComponent.method("openTab", function(){  
        var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + 0 + "|0|0";
        MPAGES_EVENT("POWERFORM", paramString);
        var contentNode = this.getSectionContentNode()
        contentNode.innerHTML = "";
        this.InsertData();
        //Clear out 48 hour max cache
        CERN_VITALSIGNS_O1_UTIL.ClearMaxTemp();
        
        
    });
    
    VitalSignComponent.method("openDropDown", function(formID){
        var criterion = this.getCriterion();
        var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + formID + "|0|0";
        MPAGES_EVENT("POWERFORM", paramString);
        var contentNode = this.getSectionContentNode()
        contentNode.innerHTML = "";
        this.InsertData();
        //Clear out 48 hour max cache
        CERN_VITALSIGNS_O1_UTIL.ClearMaxTemp();
        
    });
}

VitalSignComponent.inherits(MPageComponent);

/**
 * @namespace CERN_VITAL_SIGNS_O1
 * @dependencies Script: mp_get_n_results
 */
var CERN_VITALSIGN_O1 = function(){
    var isErrorLoadingData = false;
    var isDataFound = false;
    var totalResultCount = 0;
    var m_comp = null;
    var m_contentNode = null;
    var m_rootComponentNode = null;
    var m_threadCount = 0;
    var m_seqArry = [];
    var m_contentHTML = [];
    var m_isSequenced = false;
    var m_isBPAssociated = true;
    
    return {
        GetVitalSignsTable: function(component){
            //need to create two placeholders for the primary and secondary results.
            var timerRenderComponent = MP_Util.CreateTimer("ENG:MPG.VITALSIGNS.O1 - render component");
            try {
                m_comp = component;
                var styles = component.getStyles();
                m_rootComponentNode = component.getRootComponentNode();
                m_contentNode = component.getSectionContentNode();
                
                var groups = component.getGroups();
                var xl = (groups != null) ? groups.length : 0;
                m_threadCount = xl;
                CreateInfoHeader(m_contentNode)
                
                //Check for sequencing
                for (var x = 0; x < xl; x++) {
                    var group = groups[x];
                    if (group instanceof MPageSequenceGroup) {
                        m_seqArry = group.getItems().toString().split(',');
                        m_isSequenced = true;
                    }
                    
                }
                for (var x = 0; x < groups.length; x++) {
                    var group = groups[x];
                    if ((group.getGroupName() != "")) 
                        GetResultsByGroup(group, 1);
                    else if (group.getGroupName() == "") 
                        GetResultsByGroup(group, 0);
                }
                if (m_threadCount == 0) 
                    FinalizeComponent();
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
    
    function CreateInfoHeader(secContentNode){
        var contentHdr = Util.cep("div", {
            "className": "content-hdr"
        });
        Util.ac(contentHdr, secContentNode);
        var vitalsI18n = i18n.discernabu.vitals_o1;
        var withinText = (m_comp.getDateFormat() == 3) ? ("<span>" + vitalsI18n.WITHIN + "</span>") : "";
        var ar = [];
        ar.push("<TABLE class=vs-table><TR class=vs-hdr><TH class=vs-lbl><SPAN>&nbsp;</SPAN></TH><TH class=vs-icn1><SPAN>&nbsp;</SPAN></TH><TH class=vs-res1><SPAN>", vitalsI18n.LATEST, "</SPAN><P>", withinText, "</TH><TH class=vs-icn2><SPAN>&nbsp;</SPAN></TH><TH class=vs-res2><SPAN>", vitalsI18n.PREVIOUS, "</SPAN><P>", withinText, "</TH><TH class=vs-icn3><SPAN>&nbsp;</SPAN></TH><TH class=vs-res3><SPAN>", vitalsI18n.PREVIOUS, "</SPAN><P>", withinText, "</TH></TR></TABLE>");
        contentHdr.innerHTML = ar.join("");
    }
    function FinalizeComponent(){
        var styles = m_comp.getStyles();
        var totalCount = Util.Style.g("sec-total", m_rootComponentNode, "span");
        var sResultText = "";
        if (isErrorLoadingData) {
            m_contentNode.innerHTML = MP_Util.HandleErrorResponse(styles.getNameSpace());
        }
        else if (totalResultCount == 0) {
            sResultText = MP_Util.CreateTitleText(m_comp, totalResultCount);
            m_contentNode.innerHTML = MP_Util.HandleNoDataResponse(styles.getNameSpace());
        }
        else {
            if ((totalResultCount > m_comp.getScrollNumber()) && m_comp.isScrollingEnabled()) {
                var secContentBody = Util.cep("div", {
                    "className": "content-body scrollable vs-scrl-tbl"
                });
                var contentHdr = Util.Style.g("content-hdr", m_rootComponentNode, "div");
                Util.Style.acss(contentHdr[0], "vs-scrl-tbl-hd");
            }
            else {
                var secContentBody = Util.cep("div", {
                    "className": "content-body"
                });
            }
            //Put in the HTML
            secContentBody.innerHTML = m_contentHTML.join("");
            m_contentNode.appendChild(secContentBody);
            sResultText = MP_Util.CreateTitleText(m_comp, totalResultCount);
            //Init Striping
            InitZebraStriping(secContentBody);
            //init hovers
            MP_Util.Doc.InitHovers(styles.getInfo(), m_contentNode);
            //Init Scrolling
            if (m_comp.isScrollingEnabled()) 
                MP_Util.Doc.InitScrolling(Util.Style.g("scrollable", m_rootComponentNode, "div"), m_comp.getScrollNumber(), "1.6")
            
        }
        totalCount[0].innerHTML = sResultText;
    }
    
    function GetResultsByGroup(group, setFlag){
        var sEC = "0.0", sES = "0.0"; //defaults 
        if (group instanceof MPageEventCodeGroup) {
            var ec = group.getEventCodes();
            if (ec != null && ec.length > 0) {
                sEC = "value(" + ec.join(",") + ")";
                
            }
            m_isBPAssociated = false;
        }
        if (group instanceof MPageEventSetGroup) {
            var es = group.getEventSets();
            if (es != null && es.length > 0) 
                sES = "value(" + es.join(",") + ")"
        }
        else if (group instanceof MPageSequenceGroup) {
            var esMap = group.getMapItems();
            var es = [];
            if (esMap != null) {
                for (var x = 0, xl = esMap.length; x < xl; x++) {
                    if (esMap[x].name == "CODE_VALUE") {
                        es = esMap[x].value;
                    }
                }
            }
            if (es != null && es.length > 0) 
                sES = "value(" + es.join(",") + ")";
            if (group.getGroupName() == i18n.discernabu.vitals_o1.TEMPERATURE) {
            }
        }
        else if (group instanceof MPageGrouper) {
            var bpGroups = group.getGroups();
            var ec = [];
            for (var y = 0; y < bpGroups.length; y++) {
            
                if (bpGroups[y] instanceof MPageEventCodeGroup) {
                    ec.push(bpGroups[y].getEventCodes());
                }
                
            }
            sEC = "value(" + ec.join(",") + ")";
            setFlag = 1;
        }
        
        var timerLoadComponent = MP_Util.CreateTimer("USR:MPG.VITALSIGNS.O1 - load component");
        var info = new XMLCclRequest();
        info.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                try {
                    m_threadCount--;
                    var sHTML = "", countText = "";
                    var jsonEval = JSON.parse(this.responseText);
                    var recordData = jsonEval.RECORD_DATA;
                    
                    if (recordData.STATUS_DATA.STATUS == "S") {
                        var ar = [];
                        var codeArray = MP_Util.LoadCodeListJSON(jsonEval.RECORD_DATA.CODES);
                        var personnelArray = MP_Util.LoadPersonelListJSON(jsonEval.RECORD_DATA.PRSNL);
                        if (setFlag == 1) {
                            var mapObjects = CERN_VITALSIGNS_O1_UTIL.LoadSetMeasurementData(jsonEval, personnelArray, codeArray);
                        }
                        else {
                            var mapObjects = CERN_VITALSIGNS_O1_UTIL.LoadMeasurementData(jsonEval, personnelArray, codeArray);
                        }
                        
                        var sGroupName = "";
                        var measAr = [];
                        if (mapObjects.length != 0) {
                            for (var x = 0, xl = mapObjects.length; x < xl; x++) {
                                if (sGroupName != mapObjects[x].name) {
                                    if (setFlag == 1) {
                                        sGroupName = group.getGroupName();
                                    }
                                    else 
                                        sGroupName = "";
                                }
                                //add results to measure array
                                measAr.push(mapObjects[x])
                                if ((x == (xl - 1)) /*last item in mapObjects*/) {
                                    AssociateResultsToGroup(sGroupName, measAr, group)
                                }
                            }
                            
                        }
                    }
                    
                    else if (recordData.STATUS_DATA.STATUS == "Z") {
                        //No data for that section
                    }
                    else {
                        isErrorLoadingData = true;
                    }
                } 
                catch (err) {
                    if (timerLoadComponent) {
                        timerLoadComponent.Abort();
                        timerLoadComponent = null;
                    }
                }
                finally {
                    if (timerLoadComponent) 
                        timerLoadComponent.Stop();
                }
            }
            if (timerLoadComponent) 
                timerLoadComponent.Abort();
            if (m_threadCount == 0) {
                FinalizeComponent();
            }
            if (this.readyState == 4) {
                MP_Util.ReleaseRequestReference(this);
            }
        }
        //only load up initial three items to improve overall performance
        var criterion = m_comp.getCriterion()
        info.open('GET', "MP_GET_N_RESULTS", true);
        var sEncntr = (m_comp.getScope() == 2) ? criterion.encntr_id + ".0" : "0.0";
        var sendAr = [];
        var includeEventSetInfo = (setFlag == 0) ? 1 : 0;
        sendAr.push("^MINE^", criterion.person_id + ".0", sEncntr, criterion.provider_id + ".0", 3, sES, sEC, "^measurement^", m_comp.getLookbackUnits(), criterion.position_cd + ".0", criterion.ppr_cd + ".0", m_comp.getLookbackUnitTypeFlag(), includeEventSetInfo);
        info.send(sendAr.join(","));
    }
    
    function AssociateResultsToGroup(subGroupName, measurements, group){
        var criterion = m_comp.getCriterion();
        var encntrOption;
        if (m_comp.getScope() == 1) {
            var prsnlInfo = criterion.getPersonnelInfo();
            var encntrs = prsnlInfo.getViewableEncounters();
            encntrOption = (encntrs) ? "\"value(" + encntrs + ")\"" : "0";
        }
        else {
            encntrOption = criterion.encntr_id;
        }
        var lookBackUnits = (m_comp.getLookbackUnits() != null) ? m_comp.getLookbackUnits() : "365";
        var lookBackType = (m_comp.getLookbackUnitTypeFlag() != null) ? m_comp.getLookbackUnitTypeFlag() : "0";
        var staticContent = "\"" + escape(criterion.static_content) + "\"";
        var isEventCodeDriven = subGroupName ? false : true;
        
        var ar = [];
        for (var x = 0, xl = measurements.length; x < xl; x++) {
            ar = [];
            ar.push("<table class='vs-table'>")
            var eventSetGrouper = measurements[x].name
            var sequenceId = (eventSetGrouper > 0) ? eventSetGrouper : group.getGroupId();
            var sequenceVal = GetOverallSequence(sequenceId);
            var meas = measurements[x].value;
            var m1 = meas[0];
            var eventCodes = (isEventCodeDriven) ? m1.getEventCode().codeValue : 0;
            var resultDisplay = (subGroupName) ? subGroupName : m1.getEventCode().display;
            ar.push("<tr>");
            if (m_comp.getGraphFlag() == 1) {
                ar.push("<td class='vs-lbl'><span><a class='lr-link' onClick='MP_Util.GraphResults(", m1.getPersonId(), ",", encntrOption, ",", eventCodes, ",", staticContent, ",", sequenceId, ",", criterion.provider_id, ",", criterion.position_cd, ",", criterion.ppr_cd, ",", lookBackUnits, ",", lookBackType, ");'>", resultDisplay, "</a></span></td>");
            }
            else {
                ar.push("<td class='vs-lbl'><span>", resultDisplay, "</span></td>");
            }
            if ((subGroupName != i18n.discernabu.vitals_o1.BLOOD_PRESSURE) || (m_isBPAssociated == false)) {
                if (subGroupName == i18n.discernabu.vitals_o1.TEMPERATURE) {
                    //Get Max Temp in last 48 hours
                    
                    ar.push(CERN_VITALSIGNS_O1_UTIL.CreateResultCell(meas[0], 0, m_comp, group));
                    ar.push(CERN_VITALSIGNS_O1_UTIL.CreateResultCell(meas[1], 1, m_comp, group));
                    ar.push(CERN_VITALSIGNS_O1_UTIL.CreateResultCell(meas[2], 2, m_comp, group));
                    
                    
                }
                else {
                    ar.push(CERN_VITALSIGNS_O1_UTIL.CreateResultCell(meas[0], 0, m_comp));
                    ar.push(CERN_VITALSIGNS_O1_UTIL.CreateResultCell(meas[1], 1, m_comp));
                    ar.push(CERN_VITALSIGNS_O1_UTIL.CreateResultCell(meas[2], 2, m_comp));
                }
            }
            else {
                var measObjArry = []
                var bpMeas1 = [], bpMeas2 = [], bpMeas3 = [];
                var measCnt = 0;
                var label1 = "", label2 = "", label3 = "";
                var currMeas = 0;
                var bpEventCds = []
                for (var j = 0; ((j < meas.length) && (measCnt < 3)); j++) {
                    var currMeas = meas[j];
                    var k = j;
                    var matchFound = false;
                    var label = [];
                    var meas1, meas2;
                    if (currMeas != -1) {
						if (k + 1 < (meas.length)) {
							while (((new Date(currMeas.getDateTime())).getTime() == (new Date(meas[k + 1].getDateTime())).getTime())) {
								if (new Date(currMeas.getUpdateDateTime()).getTime() == new Date(meas[k + 1].getUpdateDateTime()).getTime()) {
									label = CheckBPPair(currMeas.getEventCode().codeValue, meas[k + 1].getEventCode().codeValue, group);
									if (label[0]) {
										matchFound = true;
										measCnt++;
										if (label[1]) {
											meas1 = currMeas;
											meas2 = meas[k + 1];
										}
										else {
											meas2 = currMeas;
											meas1 = meas[k + 1];
										}
										if (measCnt == 1) {
											bpMeas1.push(meas1);
											bpMeas1.push(meas2);
											label1 = label[0];
										}
										if (measCnt == 2) {
											bpMeas2.push(meas1);
											bpMeas2.push(meas2);
											label2 = label[0];
										}
										if (measCnt == 3) {
											bpMeas3.push(meas1);
											bpMeas3.push(meas2);
											label3 = label[0];
										}
										meas[k + 1] = -1;
									}
									
									k++;
									if (k >= (meas.length - 1)) {
										break;
									}
								}
								else {
									k++;
									if (k >= (meas.length - 1)) {
										break;
									}
									
								}
							}
						}
                        if (!matchFound) {
                            measCnt++;
                            //Get Label
                            var labelOrder = getBPLabel(currMeas.getEventCode().codeValue, group);
                            //Create Result with single result
                            if (labelOrder[1] == 0) {
                                meas1 = currMeas;
                                meas2 = 0
                            }
                            else {
                                meas2 = currMeas;
                                meas1 = 0
                            }
                            if (measCnt == 1) {
                                bpMeas1.push(meas1);
                                bpMeas1.push(meas2);
                                label1 = labelOrder[0];
                            }
                            if (measCnt == 2) {
                                bpMeas2.push(meas1);
                                bpMeas2.push(meas2);
                                label2 = labelOrder[0];
                            }
                            if (measCnt == 3) {
                                bpMeas3.push(meas1);
                                bpMeas3.push(meas2);
                                label3 = labelOrder[0];
                            }
                            
                            
                        }
                    }
                    
                }
                ar.push(CERN_VITALSIGNS_O1_UTIL.CreateBPResultCell(bpMeas1, 0, label1, m_comp));
                ar.push(CERN_VITALSIGNS_O1_UTIL.CreateBPResultCell(bpMeas2, 1, label2, m_comp));
                ar.push(CERN_VITALSIGNS_O1_UTIL.CreateBPResultCell(bpMeas3, 2, label3, m_comp));
            }
            ar.push("</tr>")
            totalResultCount++;
            ar.push("</table>")
            if (m_isSequenced) {
                m_contentHTML[sequenceVal] = ar.join("");
            }
            else {
                m_contentHTML.push(ar.join(""));
            }
            
            
        }
    }
    function GetOverallSequence(sequenceIdentifier){
        for (var i = 0; i < m_seqArry.length; i++) {
            if (m_seqArry[i] == sequenceIdentifier) {
                return i;
            }
        }
        
    }
    function CheckBPPair(eventCd1, eventCd2, group){
        var cd1Fnd = false, cd2Fnd = false;
        var ec = "";
        var correctOrder = true;
        var ecArry = [];
        if (group instanceof MPageGrouper) {
            var bpGroups = group.getGroups();
            for (var y = 0; y < bpGroups.length; y++) {
                if (bpGroups[y] instanceof MPageEventCodeGroup) {
                    ecArry = []
                    ecArry = (bpGroups[y].getEventCodes()).toString().split(',');
                    for (var i = 0; i < ecArry.length; i++) {
                        if (ecArry[i] == eventCd1) {
                            cd1Fnd = true;
                            if (i == 0) 
                                correctOrder = true;
                            else 
                                correctOrder = false;
                        }
                        if (ecArry[i] == eventCd2) {
                            cd2Fnd = true;
                        }
                    }
                    if (cd1Fnd && cd2Fnd) 
                        return ([bpGroups[y].getGroupName(), correctOrder]);
                }
                cd1Fnd = false;
                cd2Fnd = false;
                
            }
        }
		return([false, false]);
    }
    //Returns the label of the group and The order 1st or 2nd of the pair
    function getBPLabel(codeValue, group){
        if (group instanceof MPageGrouper) {
            var bpGroups = group.getGroups();
            for (var y = 0; y < bpGroups.length; y++) {
                if (bpGroups[y] instanceof MPageEventCodeGroup) {
                    var groupName = bpGroups[y].getGroupName();
                    ecArry = []
                    ecArry = (bpGroups[y].getEventCodes()).toString().split(',');
                    for (var i = 0; i < ecArry.length; i++) {
                        if (ecArry[i] == codeValue) {
                            if (i == 0) 
                                return [groupName, 0];
                            else 
                                return [groupName, 1];
                        }
                    }
                }
            }
        }
    }
    function InitZebraStriping(contentNode){
        var resultRows = _gbt("tr", contentNode);
        for (var i = 0; i < resultRows.length; i++) {
            var zebraClass = ((i % 2) == 0) ? "odd" : "even";
            Util.Style.acss(resultRows[i], zebraClass);
        }
        
    }
    
    
};

/**
 * Contains common methods for Vital Signs
 * @namespace CERN_VITALSIGNS_O1_UTIL
 * @static
 * @global
 */
var CERN_VITALSIGNS_O1_UTIL = function(){
    var m_maxTemp = "";
    var m_df = null;
    return {
        CreateTempHvr: function(cell, personId, encntrId, providerId, positionCd, pprCd, hvrData){
            var df = GetDateFormatter();
            var hoverInfo = hvrData.split("&");
            var sES = "value(" + hoverInfo[8].split("-").join(",") + ")";
            var vitalsI18N = i18n.discernabu.vitals_o1;
            var hoverHtml = [];
            hoverHtml.push("<h4 class='vs-det-hd'><span>", vitalsI18N.LABORATORY_DETAILS, "</span></h4><div class='hvr1'><dl class='vs-det'><dt class= 'vs-det-type'><span>", hoverInfo[0], ":</span></dt><dd class='result'><span class='", hoverInfo[1], "'>", hoverInfo[2], "</span></dd><dt class= 'vs-det-type'><span>", vitalsI18N.DATE_TIME, ":</span></dt><dd class='result'><span>", hoverInfo[3], "</span></dd><dt class= 'vs-det-type'><span>", vitalsI18N.NORMAL_LOW, ":</span></dt><dd class='result'><span>", hoverInfo[4], "</span></dd><dt class= 'vs-det-type'><span>", vitalsI18N.NORMAL_HIGH, ":</span></dt><dd class='result'><span>", hoverInfo[5], "</span></dd><dt class= 'vs-det-type'><span>", vitalsI18N.CRITICAL_LOW, ":</span></dt><dd class='result'><span>", hoverInfo[6], "</span></dd><dt class= 'vs-det-type'><span>", vitalsI18N.CRITICAL_HIGH, ":</span></dt><dd class='result'><span>", hoverInfo[7], "</span></dd><dt class= 'vs-det-type'><span>", vitalsI18N.TWO_DAY_MAX, ":</span></dt><dd class='result'><span class='vs-temp-max'> Loading... </span></dd></dl></div></td>");            
            if (!Util.Style.ccss(cell, "vs-cached")) {
                // Create and initialize hover div
                var hvr = Util.cep("div", {
                    "className": "hvr"
                });
                Util.ac(hvr, cell);
                hs(cell, hvr);
                // Add cached status to eliminate redundant script calls
                Util.Style.acss(cell, "vs-cached");
                // Display loading text
                hvr.innerHTML = hoverHtml.join("");
                var params = "^MINE^, " + personId + ".0," + encntrId + ".0," + providerId + "," + positionCd + ".0" + pprCd;
                //Call get last n results
                var tempSpanNd = Util.Style.g("vs-temp-max", hvr, "span");
                var maxTempMeas = null;
                var maxTempVal = 0;
                var maxTempUom = "";
                
                if (m_maxTemp == "") {
                    var timerGetMaxTemp = MP_Util.CreateTimer("ENG:MPG.VITALSIGNS.O1 - get 48 hour max temp");
                    var info = new XMLCclRequest();
                    info.onreadystatechange = function(){
                        if (this.readyState == 4 && this.status == 200) {
                            try {
                                var sHTML = "", countText = "";
                                var jsonEval = JSON.parse(this.responseText);
                                var recordData = jsonEval.RECORD_DATA;
                                
                                if (recordData.STATUS_DATA.STATUS == "S") {
                                    //Find Max for the 24 hours
                                    var codeArray = MP_Util.LoadCodeListJSON(jsonEval.RECORD_DATA.CODES);
                                    var personnelArray = MP_Util.LoadPersonelListJSON(jsonEval.RECORD_DATA.PRSNL);
                                    var mapObjects = CERN_VITALSIGNS_O1_UTIL.LoadSetMeasurementData(jsonEval, personnelArray, codeArray);
                                    var measAr = [];
                                    
                                    if (mapObjects.length != 0) {
                                        for (var x = 0, xl = mapObjects.length; x < xl; x++) {
                                            //add results to measure array
                                            measAr.push(mapObjects[x])
                                        }
                                        for (var x = 0, xl = measAr.length; x < xl; x++) {
                                            var meas = measAr[x].value;
                                            var resVal = null;
                                            var UOM = "";
                                            var currMax = 0;
                                            for (var y = 0, yl = meas.length; y < yl; y++) {
                                                var resVal = meas[y].getResult();
                                                var UOM = resVal.getUOM() ? resVal.getUOM().meaning : "";
                                                var uomDisplay = resVal.getUOM() ? resVal.getUOM().display : "";
                                                if (UOM == "DEGC") {
                                                    currMax = (parseInt(GetStringResult(resVal, false)) * 1.8) + 32;
                                                    //convert to farenheit
                                                }
                                                else if (UOM == "DEGF") {
                                                    currMax = parseInt(GetStringResult(resVal, false))
                                                }
                                                else if (UOM == "") {
                                                    var intResult = parseInt(GetStringResult(resVal, false));
                                                    if (intResult >= 55) {
                                                        //farenheit
                                                        currMax = intResult;
                                                        uomDisplay = vitalsI18N.DEGF;
                                                    }
                                                    else {
                                                        //Celsius
                                                        currMax = (parseInt(GetStringResult(resVal, false)) * 1.8) + 32;
                                                        uomDisplay = vitalsI18N.DEGC;
                                                    }
                                                    
                                                }
                                                if (y == 0) {
                                                    maxTempMeas = meas[y];
                                                    maxTempVal = currMax;
                                                    maxTempUom = uomDisplay;
                                                }
                                                else if (currMax > maxTempVal) {
                                                    maxTempVal = currMax;
                                                    maxTempMeas = meas[y];
                                                    maxTempUom = uomDisplay
                                                }
                                            }
                                            
                                        }
                                    }
                                    else {
                                        m_maxTemp = "&nbsp;";
                                    }
                                    var resNormalcy = CalculateNormalcy(maxTempMeas);
                                    m_maxTemp = "<span class='" + resNormalcy + "' >" + GetStringResult(maxTempMeas.getResult(), false) + "&nbsp;" + maxTempUom + "</span>&nbsp;<span>" + df.format(maxTempMeas.getDateTime(), mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR) + "</span>";                                    
                                    tempSpanNd[0].innerHTML = m_maxTemp;
                                    
                                }
                                else if (recordData.STATUS_DATA.STATUS == "Z") {
                                    m_maxTemp = "&nbsp;";
                                    tempSpanNd[0].innerHTML = m_maxTemp;
                                }
                                else {
                                    m_maxTemp = vitalsI18N.ERROR_RETREIVING_DATA;
                                    tempSpanNd[0].innerHTML = m_maxTemp;
                                }
                            } 
                            catch (err) {
                                if (timerGetMaxTemp) {
                                    timerGetMaxTemp.Abort();
                                    timerGetMaxTemp = null;
                                }
                            }
                            finally {
                                if (timerGetMaxTemp) 
                                    timerGetMaxTemp.Stop();
                            }
                        }
                        if (this.readyState == 4) {
                            MP_Util.ReleaseRequestReference(this);
                        }
                    }
                    if (timerGetMaxTemp) 
                        timerGetMaxTemp.Abort();
                    info.open('GET', "MP_GET_N_RESULTS", true);
                    var sendAr = [];
                    sendAr.push("^MINE^", personId + ".0", encntrId, providerId + ".0", 200, sES, "0", "^measurement^", 2, positionCd + ".0", pprCd + ".0", 2);
                    info.send(sendAr.join(","));
                }
                else {
                    tempSpanNd[0].innerHTML = m_maxTemp;
                }
                
            }
            
        },
        LoadMeasurementData: function(jsonEval, personnelArray, codeArray){
            var mapObjects = [];
            var results = jsonEval.RECORD_DATA.RESULTS;
            for (var i = 0, il = results.length; i < il; i++) {
                if (results[i].CLINICAL_EVENTS.length > 0) {
                    var measureArray = [];
                    var mapObject = null;
                    if (results[i].EVENT_CD > 0) 
                        mapObject = new MP_Core.MapObject(results[i].EVENT_CD, measureArray);
                    else 
                        mapObject = new MP_Core.MapObject(results[i].EVENT_SET_GROUPER_CD, measureArray);
                    results[i].CLINICAL_EVENTS.sort(SortByEffectiveUpdateDate)
                    for (var j = 0, jl = results[i].CLINICAL_EVENTS.length; j < jl; j++) {
                        var meas = results[i].CLINICAL_EVENTS[j];
                        var eventCode = MP_Util.GetValueFromArray(meas.EVENT_CD, codeArray);
                        
                        var dateTime = dateTime = new Date();
                        dateTime.setISO8601(meas.EFFECTIVE_DATE);
                        var updateTime = new Date();
                        updateTime.setISO8601(meas.UPDATE_DATE);
                        
                        //create measurement object
                        for (var k = 0, kl = meas.MEASUREMENTS.length; k < kl; k++) {
                            var measurement = new MP_Core.Measurement();
                            var obj = MP_Util.Measurement.GetObject(meas.MEASUREMENTS[k], codeArray);
                            measurement.init(meas.EVENT_ID, meas.PERSON_ID, meas.ENCNTR_ID, eventCode, dateTime, MP_Util.Measurement.GetObject(meas.MEASUREMENTS[k], codeArray), updateTime);
                            measurement.setNormalcy(MP_Util.GetValueFromArray(meas.MEASUREMENTS[k].NORMALCY_CD, codeArray));
                            measureArray.push(measurement);
                        }
                    }
                    if (measureArray.length > 0) 
                        mapObjects.push(mapObject);
                }
            }
            return mapObjects;
        },
        //Rolls all the measurements into one array.
        LoadSetMeasurementData: function(jsonEval, personnelArray, codeArray){
            var mapObjects = [];
            var results = jsonEval.RECORD_DATA.RESULTS;
            var allClinicalEvents = [];
            for (var i = 0, il = results.length; i < il; i++) {
                if (results[i].CLINICAL_EVENTS.length > 0) {
                    for (var j = 0, jl = results[i].CLINICAL_EVENTS.length; j < jl; j++) {
                        allClinicalEvents.push(results[i].CLINICAL_EVENTS[j]);
                    }
                }
            }
            if (allClinicalEvents.length > 0) {
                var measureArray = [];
                var mapObject = null;
                mapObject = new MP_Core.MapObject(results[0].EVENT_SET_CD, measureArray);
                allClinicalEvents.sort(SortByEffectiveUpdateDate)
                for (var j = 0, jl = allClinicalEvents.length; j < jl; j++) {
                    var meas = allClinicalEvents[j];
                    var eventCode = MP_Util.GetValueFromArray(meas.EVENT_CD, codeArray);
                    var dateTime = dateTime = new Date();
                    dateTime.setISO8601(meas.EFFECTIVE_DATE);
                    
                    var updateTime = new Date();
                    updateTime.setISO8601(meas.UPDATE_DATE);
                    //create measurement object
                    for (var k = 0, kl = meas.MEASUREMENTS.length; k < kl; k++) {
                        var measurement = new MP_Core.Measurement();
                        var obj = MP_Util.Measurement.GetObject(meas.MEASUREMENTS[k], codeArray);
                        measurement.init(meas.EVENT_ID, meas.PERSON_ID, meas.ENCNTR_ID, eventCode, dateTime, MP_Util.Measurement.GetObject(meas.MEASUREMENTS[k], codeArray), updateTime);
                        measurement.setNormalcy(MP_Util.GetValueFromArray(meas.MEASUREMENTS[k].NORMALCY_CD, codeArray));
                        measureArray.push(measurement);
                    }
                }
                if (measureArray.length > 0) 
                    mapObjects.push(mapObject);
            }
            
            return mapObjects;
        },
        CreateResultCell: function(result, idx, component, group){
            var ar = [];
            var vitalsI18n = i18n.discernabu.vitals_o1;
            var df = GetDateFormatter();
            if (result == null) {
                ar.push("<td class= 'vs-icn", idx, "'>&nbsp;&nbsp;</td><td class='vs-res", idx, "'><dl class= 'vs-info'><dt><span>", i18n.discernabu.vitals_o1.VALUE, "</span></dt><dd class='vs-res'><span>--</span></dd></dl></td>")
            }
            else {
                var obj = result.getResult();
                var resStr = GetStringResult(obj, false);
                var resHvrStr = GetStringResult(obj, true);
                var display = result.getEventCode().display;
                var dateTime = result.getDateTime();
                var faceUpDtTm = MP_Util.DisplayDateByOption(component, dateTime);
                var labNormalcy = CalculateNormalcy(result);
                var maxResultStr = "";
                var sCritHigh = "", sCritLow = "", sNormHigh = "", sNormLow = "";
                if (obj instanceof MP_Core.QuantityValue) {
                    var refRange = obj.getRefRange();
                    if (refRange != null) {
                        if (refRange.getCriticalHigh() != 0 || refRange.getCriticalLow() != 0) {
                            sCritHigh = refRange.getCriticalHigh();
                            sCritLow = refRange.getCriticalLow();
                        }
                        if (refRange.getNormalHigh() != 0 || refRange.getNormalLow() != 0) {
                            sNormHigh = refRange.getNormalHigh();
                            sNormLow = refRange.getNormalLow();
                        }
                    }
                }
                if (group != null) {
                    var es = group.getEventSets();
                    var criterion = component.getCriterion();
                    var sEncntr = (component.getScope() == 2) ? criterion.encntr_id + ".0" : "0.0";
                    var hoverData = "";
                    hoverData = display + "&" + labNormalcy + "&" + resHvrStr + "&" + df.format(dateTime , mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR) + "&" + sNormLow + "&" + sNormHigh + "&" + sCritLow + "&" + sCritHigh + "&" + es.join("-");
                    ar.push("<td  class= 'vs-icn", idx, "'>", GetIcon(result), "</td><td onmouseover='javascript:CERN_VITALSIGNS_O1_UTIL.CreateTempHvr(this, ", criterion.person_id + ".0", ", ", sEncntr, ", ", criterion.provider_id + ".0", ", ", criterion.position_cd + ".0", ", ", criterion.ppr_cd + ".0", ",\"", hoverData, "\" )' class='vs-res", idx, "'><dl class= 'vs-info'><dt><span>", vitalsI18n.VALUE, "</span></dt><dd class='vs-res'><span class='", labNormalcy, "'>", resStr, "</span><br/><span class='within'>", faceUpDtTm, "</span></dd></dl></td>");
                }
                else {
                    ar.push("<td class= 'vs-icn", idx, "'>", GetIcon(result), "</td><td class='vs-res", idx, "'><dl class= 'vs-info'><dt><span>", vitalsI18n.VALUE, "</span></dt><dd class='vs-res'><span class='", labNormalcy, "'>", resStr, "</span><br/><span class='within'>", faceUpDtTm, "</span></dd></dl><h4 class='vs-det-hd'><span>", vitalsI18n.LABORATORY_DETAILS, "</span></h4><div class='hvr'><dl class='vs-det'><dt class= 'vs-det-type'><span>", display, ":</span></dt><dd class='result'><span class='", labNormalcy, "'>", resHvrStr, "</span></dd><dt class= 'vs-det-type'><span>", vitalsI18n.DATE_TIME, ":</span></dt><dd class='result'><span>", df.format(dateTime , mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR), "</span></dd><dt class= 'vs-det-type'><span>", vitalsI18n.NORMAL_LOW, ":</span></dt><dd class='result'><span>", sNormLow, "</span></dd><dt class= 'vs-det-type'><span>", vitalsI18n.NORMAL_HIGH, ":</span></dt><dd class='result'><span>", sNormHigh, "</span></dd><dt class= 'vs-det-type'><span>", vitalsI18n.CRITICAL_LOW, ":</span></dt><dd class='result'><span>", sCritLow, "</span></dd><dt class= 'vs-det-type'><span>", vitalsI18n.CRITICAL_HIGH, ":</span></dt><dd class='result'><span>", sCritHigh, "</span></dd>", maxResultStr, "</dl></div></td>");
                }
            }
            return ar.join("");
        },
        CreateBPResultCell: function(result, idx, label, component){
            var ar = [];
            var df = GetDateFormatter();
            var vitalsI18n = i18n.discernabu.vitals_o1;
            if (result[0] == null || result[1] == null) {
                ar.push("<td class= 'vs-icn", idx, "'>&nbsp;</td><td class='vs-res", idx, "'><dl class= 'vs-info'><dt><span>", i18n.discernabu.vitals_o1.VALUE, "</span></dt><dd class='vs-res'><span>--</span></dd></dl></td>")
            }
            else {
                var dateTime = "";
                if (result[0] != 0) {
                    var obj1 = result[0].getResult();
                    var resStr1 = GetStringResult(obj1, false);
                    var resHvrStr1 = GetStringResult(obj1, true);
                    var display1 = result[0].getEventCode().display;
                    dateTime = result[0].getDateTime();
                    var labNormalcy1 = CalculateNormalcy(result[0]);
                }
                else {
                    var obj1 = "--";
                    var resStr1 = "--";
                    var resHvrStr1 = "--";
                    var display1 = "--";
                    var labNormalcy1 = "--";
                    
                }
                if (result[1] != 0) {
                    var obj2 = result[1].getResult();
                    var resStr2 = GetStringResult(obj2, false);
                    var resHvrStr2 = GetStringResult(obj2, true);
                    var display2 = result[1].getEventCode().display;
                    dateTime = result[1].getDateTime();
                    var labNormalcy2 = CalculateNormalcy(result[1]);
                    
                }
                else {
                    var obj2 = "--";
                    var resStr2 = "--";
                    var resHvrStr2 = "--";
                    var display2 = "--";
                    var labNormalcy2 = "--";
                    
                }
                //var within = MP_Util.CalcWithinTime(dateTime);
                var faceUpDtTm = MP_Util.DisplayDateByOption(component, dateTime);
                
                var sCritHigh1 = "--", sCritLow1 = "--", sNormHigh1 = "--", sNormLow1 = "--", sCritHigh2 = "--", sCritLow2 = "--", sNormHigh2 = "--", sNormLow2 = "--", sNormLow = "", sNormHigh = "", sCritHigh = "", sCritLow = "";
                if (obj1 instanceof MP_Core.QuantityValue) {
                    var refRange1 = obj1.getRefRange();
                    if (refRange1 != null) {
                        if (refRange1.getCriticalHigh() != 0 || refRange1.getCriticalLow() != 0) {
                            sCritHigh1 = refRange1.getCriticalHigh();
                            sCritLow1 = refRange1.getCriticalLow();
                        }
                        if (refRange1.getNormalHigh() != 0 || refRange1.getNormalLow() != 0) {
                            sNormHigh1 = refRange1.getNormalHigh();
                            sNormLow1 = refRange1.getNormalLow();
                        }
                    }
                }
                if (obj2 instanceof MP_Core.QuantityValue) {
                    var refRange2 = obj2.getRefRange();
                    if (refRange2 != null) {
                        if (refRange2.getCriticalHigh() != 0 || refRange2.getCriticalLow() != 0) {
                            sCritHigh2 = refRange2.getCriticalHigh();
                            sCritLow2 = refRange2.getCriticalLow();
                        }
                        if (refRange2.getNormalHigh() != 0 || refRange2.getNormalLow() != 0) {
                            sNormHigh2 = refRange2.getNormalHigh();
                            sNormLow2 = refRange2.getNormalLow();
                        }
                    }
                }
                
                var resultIcon1 = (result[0] == 0) ? "" : GetIcon(result[0]);
                var resultIcon2 = (result[1] == 0) ? "" : GetIcon(result[1]);
                if (!((sNormLow1 == "--") && (sNormLow2 == "--"))) {
                    sNormLow = sNormLow1 + " / " + sNormLow2;
                }
                if (!((sNormHigh1 == "--") && (sNormHigh2 == "--"))) {
                    sNormHigh = sNormHigh1 + " / " + sNormHigh2;
                }
                if (!((sCritLow1 == "--") && (sCritLow2 == "--"))) {
                    sCritLow = sCritLow1 + " / " + sCritLow2;
                }
                if (!((sCritHigh1 == "--") && (sCritHigh2 == "--"))) {
                    sCritHigh = sCritHigh1 + "/ " + sCritHigh2;
                }
                ar.push("<TD class=vs-icn", idx, "><SPAN>&nbsp;&nbsp;</SPAN></TD>");
                ar.push("<td class='vs-res", idx, "'><dl class= 'vs-info'><dt><span>", vitalsI18n.VALUE, "</span></dt><dd class='vs-res'><span class='", labNormalcy1, "'>", resultIcon1, resStr1, "</span>/<span class='", labNormalcy2, "'>", resultIcon2, resStr2, "</span><br/><span class='within'>&nbsp;&nbsp;&nbsp;", faceUpDtTm, "</span></dd></dl><h4 class='vs-det-hd'><span>", vitalsI18n.LABORATORY_DETAILS, "</span></h4><div class='hvr'><dl class='vs-det'><dt class= 'vs-det-type'><span>", label, ":</span></dt><dd class='result'><span class='", labNormalcy1, "'>", resHvrStr1, "</span>/<span class='", labNormalcy2, "'>", resHvrStr2, "</span></dd><dt class= 'vs-det-type'><span>", vitalsI18n.DATE_TIME, ":</span></dt><dd class='result'><span>", df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR), "</span></dd><dt class= 'vs-det-type'><span>", vitalsI18n.NORMAL_LOW, ":</span></dt><dd class='result'><span>", sNormLow, "</span></dd><dt class= 'vs-det-type'><span>", vitalsI18n.NORMAL_HIGH, ":</span></dt><dd class='result'><span>", sNormHigh, "</span></dd><dt class= 'vs-det-type'><span>", vitalsI18n.CRITICAL_LOW, ":</span></dt><dd class='result'><span>", sCritLow, "</span></dd><dt class= 'vs-det-type'><span>", vitalsI18n.CRITICAL_HIGH, ":</span></dt><dd class='result'><span>", sCritHigh, "</span></dd>", "</dl></div></td>");
            }
            return ar.join("");
        },
        ClearMaxTemp: function(){
            m_maxTemp = "";
        }
    }
    function SortByEffectiveUpdateDate(a, b){
        
		if (a.EFFECTIVE_DATE > b.EFFECTIVE_DATE) 
			return -1;
		else if (a.EFFECTIVE_DATE < b.EFFECTIVE_DATE) 
			return 1;
		else if (a.UPDATE_DATE > b.UPDATE_DATE) 
			return -1;
		else if (a.UPDATE_DATE < b.UPDATE_DATE) 
			return 1;
		else 
			return 0;
			
    }
    function CreateHoverForMeasurement(measurement){
        var ar = [];
        var obj = measurement.getResult();
        var resStr = GetStringResult(obj, false);
        var resHvrStr = GetStringResult(obj, true);
        var display = measurement.getEventCode().display;
        var dateTime = measurement.getDateTime();
        var labNormalcy = CalculateNormalcy(measurement);
        var vitalsI18n = i18n.discernabu.vitals_o1;
        var df = GetDateFormatter();
        
        var sCritHigh = "", sCritLow = "", sNormHigh = "", sNormLow = "";
        if (obj instanceof MP_Core.QuantityValue) {
            var refRange = obj.getRefRange();
            if (refRange != null) {
                if (refRange.getCriticalHigh() != 0 || refRange.getCriticalLow() != 0) {
                    sCritHigh = refRange.getCriticalHigh();
                    sCritLow = refRange.getCriticalLow();
                }
                if (refRange.getNormalHigh() != 0 || refRange.getNormalLow() != 0) {
                    sNormHigh = refRange.getNormalHigh();
                    sNormLow = refRange.getNormalLow();
                }
            }
        }
        
        ar.push('<dt class=vs-res><span>', display, ':</span></dt><dd class=vs-det-type><span class=', labNormalcy, '>', resHvrStr, '</span></dd><dt class=vs-res><span>', vitalsI18n.DATE_TIME, ':</span></dt><dd class=vs-det-type><span>', df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR), '</span></dd><dt class=vs-res><span>', vitalsI18n.NORMAL_LOW, ':</span></dt><dd class=vs-det-type><span>', sNormLow, '</span></dd><dt class=vs-res><span>', vitalsI18n.NORMAL_HIGH, ':</span></dt><dd class=vs-det-type><span>', sNormHigh, '</span></dd><dt class=vs-res><span>', vitalsI18n.CRITICAL_LOW, ':</span></dt><dd class=vs-det-type><span>', sCritLow, '</span></dd><dt class=vs-res><span>', vitalsI18n.CRITICAL_HIGH, ':</span></dt><dd class=vs-det-type><span>', sCritHigh, '</span></dd>');
        
        return (ar.join(""));
        
    }
    
    function GetStringResult(result, includeUOM){
        var value = "";
        var df = GetDateFormatter();
        if (result instanceof MP_Core.QuantityValue) 
            if (includeUOM) 
                value = result.toString();
            else 
                value = result.getValue();
        else if (result instanceof Date) 
            value = df.format(result, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
        else 
            value = result;
        return value;
    }
    
    function GetIcon(measObject){
        var normalcyIcon = "<span>&nbsp;</span>";
        var nomalcy = measObject.getNormalcy();
        if (nomalcy != null) {
            var normalcyMeaning = nomalcy.meaning;
            if (normalcyMeaning == "LOW" || normalcyMeaning == "EXTREMELOW") {
                normalcyIcon = "<span class='res-low-icon'>&nbsp;&nbsp;</span>";
            }
            else if (normalcyMeaning == "HIGH" || normalcyMeaning == "EXTREMEHIGH") {
                normalcyIcon = "<span class='res-high-icon'>&nbsp;&nbsp;</span>";
            }
            else if (normalcyMeaning == "CRITICAL" || normalcyMeaning == "PANICHIGH" || normalcyMeaning == "PANICLOW") {
                normalcyIcon = "<span class='res-severe-icon'>&nbsp;&nbsp;</span>";
            }
        }
        return normalcyIcon;
    }
    function CalculateCriticalRange(result){
        var rv = "";
        if (result instanceof MP_Core.QuantityValue) {
            var rr = result.getRefRange();
            if (rr != null) 
                rv = rr.toCriticalInlineString();
        }
        return rv;
    }
    
    function CalculateNormalRange(result){
        var rv = "";
        if (result instanceof MP_Core.QuantityValue) {
            var rr = result.getRefRange();
            if (rr != null) 
                rv = rr.toNormalInlineString();
        }
        return rv;
    }
    function CalculateNormalcy(result){
        var normalcy = "";
        var nc = result.getNormalcy()
        if (nc != null) {
            var normalcyMeaning = nc.meaning;
            if (normalcyMeaning != null) {
                if (normalcyMeaning == "LOW" || normalcyMeaning == "EXTREMELOW") {
                    normalcy = "res-low";
                }
                else if (normalcyMeaning == "HIGH" || normalcyMeaning == "EXTREMEHIGH") {
                    normalcy = "res-high";
                }
                else if (normalcyMeaning == "CRITICAL" || normalcyMeaning == "PANICHIGH" || normalcyMeaning == "PANICLOW") {
                    normalcy = "res-severe";
                }
            }
        }
        return normalcy;
    }
    
    function GetDateFormatter(){        
        if (m_df == null) 
            m_df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
        return m_df;
        return new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
    }
}();
