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
        var peObject = {};
        
        peObject = window.external.DiscernObjectFactory("PATIENTEDUCATION");
		MP_Util.LogDiscernInfo(this, "PATIENTEDUCATION", "patienteducation.js", "openTab");
        //dpObject.Window = window;
        var personId = criterion.person_id;
        var encntrId = criterion.encntr_id;
        peObject.SetPatient(personId, encntrId);
        peObject.SetDefaultTab(0); //Instructions
        peObject.DoModal();
        
        this.InsertData();
    });
}
PatientFamilyEduSumComponent.inherits(MPageComponent);

var CERN_PAT_FAMILY_EDU_SUM_O1 = function(){
    function SortByDate(a, b){
        if (a.DATE > b.DATE) {
            return -1;
        }
        else if (a.DATE < b.DATE) {
            return 1;
        }
        else {
            return 0;
        }
    }
    return {
        GetPatientFamilyEducation: function(component){
            var sendAr = [];
            var criterion = component.getCriterion();
            var groups = component.getGroups();
            var events = (groups && groups.length > 0) ? groups[0].getEventSets() : null;
            var sEventSet = MP_Util.CreateParamArray(events, 1);
            
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", sEventSet, criterion.ppr_cd + ".0");
            
            MP_Core.XMLCclRequestWrapper(component, "mp_get_pat_edu_sum", sendAr, true);
        },
        RenderComponent: function(component, recordData){
            var strHTML = "", countText = "", pfeAr = [];
            var dateTime = new Date();
            var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
            var patEdi18n = i18n.discernabu.patienteducation;
            pfeAr.push("<div class='", MP_Util.GetContentClass(component, recordData.EVENTS.length), "'>");
            recordData.EVENTS.sort(SortByDate);
            for (var i = 0, l = recordData.EVENTS.length; i < l; i++) {
                var events = recordData.EVENTS[i];
                if (events.DATE !== "") {
                    dateTime.setISO8601(events.DATE);
                }
                if (events.DISPLAY !== "") {
                    pfeAr.push("<h3 class='info-hd'><span>", events.DISPLAY, "</span></h3><dl class='pfe-info'><dt><span>", events.DISPLAY, "</span></dt><dd class='pfe-name'><span>", events.DISPLAY, "</span></dd><dt><span>", patEdi18n.DATE_TIME, ":</span></dt><dd class='pfe-date'><span class='date-time'>", df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR), "</span></dd></dl>");
                    pfeAr.push("<h4 class='det-hd '><span>", "</span></h4><div class='hvr'><dl class='ord-det'><dt><span>", patEdi18n.PE_INSTRUCTION, ":</span></dt><dd class='ord-det-dt'><span>", events.DISPLAY, "</span></dd><dt><span>", patEdi18n.PE_DATE, ":</span></dt><dd class='ord-det-dt'><span>", df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR), "</span></dd><dt><span>", patEdi18n.PE_PROVIDER, ":</span></dt><dd class='ord-det-dt'><span>", events.PROVIDER, "</span></dd></dl></div>");
                }
            }
            pfeAr.push("</div>");
            countText = MP_Util.CreateTitleText(component, recordData.EVENTS.length);
            strHTML = pfeAr.join("");
            MP_Util.Doc.FinalizeComponent(strHTML, component, countText);
        }
    };
}();
