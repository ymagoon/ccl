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
        var fuObject = {};
        fuObject = window.external.DiscernObjectFactory("PATIENTEDUCATION");
		MP_Util.LogDiscernInfo(this, "PATIENTEDUCATION", "followup.js", "openTab");
        var personId = criterion.person_id;
        var encntrId = criterion.encntr_id;
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
    FollowUpComponent.method("FormatAddressString", function(address){
        if(address){
        	if(address.length){
        		address=address.replace(/\^/gi,", ");
        		var adLen=address.length;
        		if(address.substring(adLen-1,adLen)===";"){
        			address=address.substring(0,adLen-1);
        		}
        	}
        	address=address.replace(/\, , ,|, ,/gi,", ");
        	address=address.replace(/\, ;;,|, {2};;,/gi,";");
        	address=address.replace(/\; {2},|;;,/gi,";");
        	address=address.replace(/\, {2};|, ;/gi,";");
        	address=address.replace(/^,/gi,"");
        	address=address.replace(/\;/gi,"<br />");
        }
        else{
        	address="--";
        }  
        return address;
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
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0");
            MP_Core.XMLCclRequestWrapper(component, "mp_get_followup", sendAr, true);
        },
        
        RenderComponent: function(component, recordData){
            
            try {
                var sHTML = "";
                var countText = "";
                var jsHTML = [];
                var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                var dateTime = new Date();
                jsHTML.push("<div class='", MP_Util.GetContentClass(component, recordData.FOLLOW_UP.length), "'>");
                for (var i = 0, l = recordData.FOLLOW_UP.length; i < l; i++) {
                    var events = recordData.FOLLOW_UP[i];
                    if (events.DISPLAY !== "") {
                        var rep = "^";
                        var address = "";
                        address=events.PROVIDERADDRESS;
                        address = component.FormatAddressString(address);
                        jsHTML.push("<h3 class='info-hd'><span>", events.NAME, "</span></h3><dl class='fu-info'><dt><span>", events.PROVIDERNAME, "</span></dt><dd class = 'fu-name'><span>", events.PROVIDERNAME, "</span></dd><dd class='fu-ph'><span>", events.PROVIDERPHONE, "</span></dd><dt><span>Range:</span></dt><dd class='fu-range'><span>", events.FOLLOWUPRANGE, "</span></dd></dl>");
                        jsHTML.push("<h4 class='det-hd'><span>", "</span></h4><div class='hvr'><dl class='ord-det'><dt><span>", i18n.FU_NAME, "</span></dt><dd class='ord-det-dt'><span>", events.PROVIDERNAME, "</span></dd><dt><span>", i18n.FU_ADDRESS, "</span></dt><dd class='ord-det-dt'><span>", address, "</span></dd></dl></div>");
                    }
                }
                jsHTML.push("</div>");
                countText = MP_Util.CreateTitleText(component, recordData.FOLLOW_UP.length);
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
   
}();
