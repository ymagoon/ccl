function FamilyHistoryComponentStyle(){
    this.initByNamespace("fmh");
}
FamilyHistoryComponentStyle.inherits(ComponentStyle);

function FamilyHistoryComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new FamilyHistoryComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.FAMILY_HISTORY.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.FAMILY_HISTORY.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(1);
    FamilyHistoryComponent.method("InsertData", function(){
        CERN_FAM_HISTORY_O1.GetFamilyTable(this);
    });
    FamilyHistoryComponent.method("HandleSuccess", function(recordData){
        CERN_FAM_HISTORY_O1.RenderComponent(this, recordData);
    });
}
FamilyHistoryComponent.inherits(MPageComponent);

/**
 * Family methods
 * @namespace CERN_FAM_HISTORY_O1
 * @static
 * @global
 */
var CERN_FAM_HISTORY_O1 = function(){
    return {
        GetFamilyTable: function(component){
            var sendAr = [];
            var criterion = component.getCriterion();
            sendAr.push("^MINE^", criterion.person_id + ".0");
            sendAr.push(criterion.provider_id+".0",criterion.ppr_cd+".0");            
            MP_Core.XMLCclRequestWrapper(component, "MP_GET_FAMILY_HISTORY", sendAr, true);
        },
        RenderComponent: function(component, recordData){
            
            try {
                var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                var jsFamHTML = [];
                var famHTML = "";
				var fhxi18n = i18n.discernabu.family_history_o1;
				
				//collect checkbox information
                var fhxSummary= "";
				var sLen = 0;
                var fhxSummaryInd = "";
				var allHistNeg = "";
				if(recordData.PATIENT_ADOPTED_IND == 1) {
					fhxSummary = fhxi18n.ADOPTED;
					sLen += 1;
				}
				//all documented histories are negative
				if(recordData.HIST_NEG_IND == 1){
                	allHistNeg = fhxi18n.FAMILY_HISTORY_NEGATIVE;
				}
				//negative checkbox selected
                if(recordData.NEGATIVE_IND == 1){
                	fhxSummaryInd = fhxi18n.FAMILY_HISTORY_NEGATIVE;
					sLen += 1;
                }else if(recordData.UNKNOWN_IND == 1){
                	fhxSummaryInd = fhxi18n.FAMILY_HISTORY_UNKNOWN;
					sLen += 1;
                }else if(recordData.UNABLE_TO_OBTAIN_IND == 1){
                	fhxSummaryInd = fhxi18n.UNABLE_TO_OBTAIN;
					sLen += 1;
                }     

            	if(fhxSummaryInd != "" && recordData.CONDITION_CNT == 0){
            		if(fhxSummary == ""){
            			fhxSummary = fhxSummaryInd;
                	} else {
                		fhxSummary += "; " + fhxSummaryInd;
                		}
                } 
				if(allHistNeg != "" && recordData.CONDITION_CNT == 0){
            		if(fhxSummary == ""){
            			fhxSummary = allHistNeg;
                	} else {
                		fhxSummary += "; " + allHistNeg;
                		}
                } 
				
				
                //getting CONDITION_CNT value
                var len = recordData.CONDITION_CNT;
                jsFamHTML.push("<div class ='", MP_Util.GetContentClass(component, len), "'>"); 
               	jsFamHTML.push("<dl class='fmh-info'><dt class='fmh-cond'><span>",i18n.CONDITION, "</span></dt><dd class='fmh-cond'><span>", fhxSummary, " </span></dd></dl>");
                
               	
                //looping  CONDITION_CNT value
                var conditions = "";
                var familyLen = "";
                var member = "";
                var familyMem = "";
                for (var i = 0; i < len; i++) {
                    conditions = recordData.CONDITIONS[i];
                    familyLen = conditions.FAMILY_CNT;
                    member = "";
                    for (var j = 0; j < familyLen; j++) {
                        family = conditions.FAMILY[j];
                        if (family.MEMBER > 0) {
                            var codeObj = MP_Util.GetValueFromArray(family.MEMBER, codeArray);
                            member += codeObj.display;
                            
                            codeObj = MP_Util.GetValueFromArray(family.DECEASED_CD, codeArray);

                            if (codeObj && codeObj.meaning == "YES"){
                                member += " (" + i18n.DECEASED + ")";
                            }
                            
                            if (j != (familyLen - 1)){ 
                                member += ", ";
                            }
                        }
                    }
                    jsFamHTML.push("<h3 class='info-hd'><span>", conditions.CONDITION, "</span></h3><dl class='fmh-info'><dt class='fmh-cond'><span>", i18n.CONDITION, "</span></dt><dd class='fmh-cond'><span>", conditions.CONDITION, ": </span></dd><dt class='fmh-mbr'><span>", i18n.MEMBERS, ":</span></dt><dd class='fmh-mbr'><span class='detail-line'>", member, "</span></dd></dl>");
                }
                jsFamHTML.push("</div>");
                famHTML = jsFamHTML.join("");
				len += sLen;
                countText = MP_Util.CreateTitleText(component, len);
                MP_Util.Doc.FinalizeComponent(famHTML, component, countText);
            } 
            catch (err) {
                
                throw (err);
            }
            finally {
                //do nothing
            }
        }
    };
}();
