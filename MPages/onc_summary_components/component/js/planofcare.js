function PlanofCareComponentStyle(){
    this.initByNamespace("pc");
}
PlanofCareComponentStyle.inherits(ComponentStyle);

/**
 * The plan of care component will retrieve the plans for the patient
 *
 * @param {Criterion} criterion
 */
function PlanofCareComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new PlanofCareComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.PLANOFCARE.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.PLANOFCARE.O1 - render component");
    this.setIncludeLineNumber(true);
    this.m_planStatusCodes = null;
    this.m_planClassificationCodes = null;
    
    PlanofCareComponent.method("InsertData", function(){
        CERN_PLANOFCARE_O1.GetPlans(this);
    });
    PlanofCareComponent.method("HandleSuccess", function(recordData){
        CERN_PLANOFCARE_O1.RenderComponent(this, recordData);
    });
    
    //Functions to set plan status filters
    PlanofCareComponent.method("setPlanStatusCodes", function(value){
        this.m_planStatusCodes = value;
    });
    PlanofCareComponent.method("addPlanStatusCode", function(value){
        if (this.m_planStatusCodes == null){
            this.m_planStatusCodes = [];
        }
        this.m_planStatusCodes.push(value);
    });
    PlanofCareComponent.method("getPlanStatusCodes", function(){
        if (this.m_planStatusCodes != null){
            return this.m_planStatusCodes;
        }
    });
    
    //Functions to set classification cd filter
    PlanofCareComponent.method("setPlanClassificationCodes", function(value){
        this.m_planClassificationCodes = value;
    });
    PlanofCareComponent.method("addPlanClassificationCode", function(value){
        if (this.m_planClassificationCodes == null){
            this.m_planClassificationCodes = [];
        }
        this.m_planClassificationCodes.push(value);
    });
    PlanofCareComponent.method("getPlanClassificationCodes", function(){
        if (this.m_planClassificationCodes != null){ 
            return this.m_planClassificationCodes;
        }
    });
}
PlanofCareComponent.inherits(MPageComponent);

/**
 * Plan of Care methods
 * @static
 * @global
 */
var CERN_PLANOFCARE_O1 = function(){
    return {
        GetPlans: function(component){
            var sendAr = [];
            var criterion = component.getCriterion();
            var status_cds = MP_Util.CreateParamArray(component.getPlanStatusCodes(),1);
            var classification_cds = MP_Util.CreateParamArray(component.getPlanClassificationCodes(),1);
            
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", criterion.position_cd + ".0", criterion.ppr_cd + ".0", status_cds, classification_cds);
            MP_Core.XMLCclRequestWrapper(component, "MP_GET_PLANS", sendAr, true);
        },
        RenderComponent: function(component, recordData){

            var jsPcHTML = [];
            var pcHTML = "";
            var countText = "";
            var dateTime = new Date();
            var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
            var plans = recordData.PLANS;
            
            jsPcHTML.push("<div class='content-hdr'><dl class='pc-info-hdr hdr'><dt><dd class='pc-name-hd'><span>", i18n.PLAN_NAME, "</span></dd><dd class='pc-status-hd'><span>", i18n.STATUS, "</span></dd><dd class='pc-dt-hd'><span>", i18n.DATE_TIME, "</span></dd></dt></dl></div>");
            
            jsPcHTML.push("<div class='", MP_Util.GetContentClass(component, plans.length), "'>");
            for (var i = 0, il = plans.length; i < il; i++) {
                var planName = "", planStatus = "", startDate = "";
                
                if (plans[i].NAME != ""){ 
                    planName = plans[i].NAME;
                }
                jsPcHTML.push("<dl class='pc-info'><dt><dd class='pc-name'><span>", planName, "</span></dd>");
                
                if (plans[i].STATUS_CD != "" && plans[i].STATUS_CD > 0) {
                    var statusCode = MP_Util.GetValueFromArray(plans[i].STATUS_CD, codeArray);
                    planStatus = statusCode.display;
                }
                jsPcHTML.push("<dd class='pc-status'><span>", planStatus, "</span></dd>");
                
                if (plans[i].START_DT_TM != "") {
                    startDate = plans[i].START_DT_TM;
                    dateTime.setISO8601(startDate);
                    startDate = dateTime.format("longDateTime2");
                }
                jsPcHTML.push("<dd class='pc-dt'><span class='date-time'>", startDate, "</span></dd></dt></dl>");
                
            }
            jsPcHTML.push("</div>");
            pcHTML = jsPcHTML.join("");
            countText = MP_Util.CreateTitleText(component, plans.length);
            MP_Util.Doc.FinalizeComponent(pcHTML, component, countText);
        }
    };
}();
