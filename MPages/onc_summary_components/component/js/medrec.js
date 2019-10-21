//
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
    window.medrec_mpage = criterion.category_mean;
    var dischargeMedCd = 0;
    
    MedicationReconciliationComponent.method("InsertData", function(){
        CERN_MEDS_REC_O1.GetMedsRecTable(this);
    });
    MedicationReconciliationComponent.method("HandleSuccess", function(recordData){
        CERN_MEDS_REC_O1.RenderComponent(this, recordData);
    });
    MedicationReconciliationComponent.method("openTab", function(){
        // --- Code for Timers 
		var slaTimer =MP_Util.CreateTimer("CAP:MPG Med-Rec Add");			
			if (slaTimer) {
				slaTimer.SubtimerName = medrec_mpage;          
			    slaTimer.Start();
				slaTimer.Stop();
			}
		//  ---- Code for Timers
        var criterion = this.getCriterion();
        var mrObject = {};
		MP_Util.LogDiscernInfo(this, "ORDERS", "medrec.js", "openTab");
        mrObject = window.external.DiscernObjectFactory("ORDERS");
        mrObject.PersonId = criterion.person_id;
        mrObject.EncntrId = criterion.encntr_id;
        mrObject.reconciliationMode = 3;
        mrObject.defaultVenue = getDischargeCode();
        mrObject.LaunchOrdersMode(2, 0, 0); //2 -  Meds Rec
        this.InsertData();
    });
    
    function getDischargeCode() {
        if (dischargeMedCd === 0){
            var code = MP_Util.GetCodeValueByMeaning("DISCHARGEMED", 54732);
            dischargeMedCd = (code) ? code.codeValue : 0;
        }
        return dischargeMedCd;
    }
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
            var orgSecurity = 1;  ///orgSecurity ON
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", orgSecurity);
            MP_Core.XMLCclRequestWrapper(component, "mp_get_meds_rec", sendAr, true);
        },
        RenderComponent: function(component, recordData){

            try {
                var sHTML = "", countText = "", jsHTML = [];
                var len = 0;
                var medReci18n = i18n.discernabu.medicationreconciliation;
                var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                var dateTime = new Date();
                jsHTML.push("<div class='", MP_Util.GetContentClass(component, recordData.NEW.length + recordData.CONTINUE.length + recordData.CONTINUE_WITH_CHANGES.length + recordData.DISCONTINUED.length + recordData.CONTACT_PHYSICIAN.length), "'>");
                jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", medReci18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", medReci18n.NEW, " (", recordData.NEW.length, ")</span></h3><div class='sub-sec-content'>");
                var contMeds = "";
                if (recordData.NEW.length > 0) {
                    len += recordData.NEW.length;
                    contMeds = getMedsRow(recordData.NEW, medReci18n);
                    jsHTML.push(contMeds, "</div></div>");
                }
                else {
                    jsHTML.push("<span class='res-none'>", medReci18n.NO_RESULTS_FOUND, "</span></div></div>");
                }
                    
                jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", medReci18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", medReci18n.CONTINUE, " (", recordData.CONTINUE.length, ")</span></h3><div class='sub-sec-content'>");
                if (recordData.CONTINUE.length > 0) {
                    len += recordData.CONTINUE.length;
                    contMeds = getMedsRow(recordData.CONTINUE, medReci18n);
                    jsHTML.push(contMeds);
                    jsHTML.push("</div></div>");
                }
                else {
                    jsHTML.push("<span class='res-none'>", medReci18n.NO_RESULTS_FOUND, "</span></div></div>");
                }
                
                jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", medReci18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", medReci18n.CONTINUE_WITH_CHANGES, " (", recordData.CONTINUE_WITH_CHANGES.length, ")</span></h3><div class='sub-sec-content'>");
                if (recordData.CONTINUE_WITH_CHANGES.length > 0) {                    
                    for (var n = 0, l = recordData.CONTINUE_WITH_CHANGES.length; n < l; n++) {
                        var cwithchng = recordData.CONTINUE_WITH_CHANGES[n];
                        if (cwithchng.CURRENT.length > 0) {
                            for (var j = 0, t = cwithchng.CURRENT.length; j < t; j++) {
                                var contWithChangesMed = cwithchng.CURRENT[j];
                                jsHTML.push("<dl class='medrec-info'><dt><span>", medReci18n.MED_DETAIL, ":</span></dt><dd class='medrec-name'><span>", contWithChangesMed.ORDER_NAME, "</span></dd><dt><span>", medReci18n.SIGNATURE_LINE, ":</span></dt><dd class='medrec-sig'><span class='detail-line'>", contWithChangesMed.ORDER_DETAIL_LINE, "</span></dd></dl>");
                                jsHTML.push("<h4 class='det-hd'><span></span></h4><div class='hvr'><dl class='medrec-det'><dt><span>", medReci18n.NAME, " :</span></dt><dd class='medrec-det-dt'><span>", contWithChangesMed.ORDER_NAME, "</span></dd><dt><span>", medReci18n.ORDERING_PHYSICIAN, ":</span></dt><dd class='medrec-det-dt'><span>", contWithChangesMed.ORDERING_PHYSICIAN, "</span></dd><dt><span>", medReci18n.COMMENTS, " :</span></dt><dd class='medrec-det-dt'><span>", contWithChangesMed.ORDER_COMMENTS, "</span></dd>");
                                jsHTML.push("<dt><span>", medReci18n.START, ":</span></dt><dd class='medrec-det-dt'><span>", contWithChangesMed.ORDER_NAME, " ", contWithChangesMed.ORDER_DETAIL_LINE, "</span></dd>");
                                if (cwithchng.ORIGINAL.length > 0) {
                                    for (var m = 0, u = cwithchng.ORIGINAL.length; m < u; m++) {
                                        var origMed = cwithchng.ORIGINAL[m];
                                        jsHTML.push("<dt><span>", medReci18n.STOP, " :</span></dt><dd class='medrec-det-dt'><span>", origMed.ORDER_NAME, " ", origMed.ORDER_DETAIL_LINE, "</span></dd>");
                                    }
                                }
                                jsHTML.push("</dl></div>");
                            }
                        }
                        
                    }
                    jsHTML.push("</div></div>");
                    len += recordData.CONTINUE_WITH_CHANGES.length;
                }
                else {
                    jsHTML.push("<span class='res-none'>", medReci18n.NO_RESULTS_FOUND, "</span></div></div>");
                }
                
                jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", medReci18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", medReci18n.NO_LONGER_TAKING, " (", recordData.DISCONTINUED.length, ")</span></h3><div class='sub-sec-content'>");
                if (recordData.DISCONTINUED.length > 0) {
                    len += recordData.DISCONTINUED.length;
                    var discontMeds = getMedsRow(recordData.DISCONTINUED, medReci18n);
                    jsHTML.push(discontMeds, "</div></div>");
                }
                else {
                    jsHTML.push("<span class='res-none'>", medReci18n.NO_RESULTS_FOUND, "</span></div></div>");
                }
                
				
				
                jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", medReci18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", medReci18n.CONTACT_PHYSICIAN, " (", recordData.CONTACT_PHYSICIAN.length, ")</span></h3><div class='sub-sec-content'>");
                if (recordData.CONTACT_PHYSICIAN.length > 0) {
                    len += recordData.CONTACT_PHYSICIAN.length;
                    var contactPhysMeds = getMedsRow(recordData.CONTACT_PHYSICIAN, medReci18n);
                    jsHTML.push(contactPhysMeds, "</div></div>");
                }
                else {
                    jsHTML.push("<span class='res-none'>", medReci18n.NO_RESULTS_FOUND, "</span></div></div>");
                }
                    
                jsHTML.push("</div>");
                
                countText = MP_Util.CreateTitleText(component, len);
                sHTML = jsHTML.join("");
                MP_Util.Doc.FinalizeComponent(sHTML, component, countText);
            } 
            catch (err) {
                
                throw (err);
            }
            finally {
                //do nothing
            }
        }
    };
    
    function getMedsRow(medData, medReci18n){
        var jsHTML = [];
        var strHTML = "";
        for (var j = 0, l = medData.length; j < l; j++) {
            var medDetail = medData[j];
            jsHTML.push("<dl class='medrec-info'><dt><span>", medReci18n.MED_DETAIL, ":</span></dt><dd class='medrec-name'><span>", medDetail.ORDER_NAME, "</span></dd><dt><span>", medReci18n.SIGNATURE_LINE, ":</span></dt><dd class='medrec-sig'><span class='detail-line'>", medDetail.ORDER_DETAIL_LINE, "</span></dd></dl>");
            jsHTML.push("<h4 class='det-hd'><span></span></h4><div class='hvr'><dl class='medrec-det'><dt><span>", medReci18n.NAME, " :</span></dt><dd class='medrec-det-dt'><span>", medDetail.ORDER_NAME, "</span></dd><dt><span>", medReci18n.ORDERING_PHYSICIAN, ":</span></dt><dd class='medrec-det-dt'><span>", medDetail.ORDERING_PHYSICIAN, "</span></dd><dt><span>", medReci18n.COMMENTS, " :</span></dt><dd class='medrec-det-dt'><span>", medDetail.ORDER_COMMENTS, "</span></dd></dl></div>");
        }
        strHTML = jsHTML.join("");
        return strHTML;
    }
}();
