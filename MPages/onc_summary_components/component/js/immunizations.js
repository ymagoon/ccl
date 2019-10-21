function ImmunizationComponentStyle(){
    this.initByNamespace("im");
}
ImmunizationComponentStyle.inherits(ComponentStyle);

function ImmunizationComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new ImmunizationComponentStyle());
    this.setIncludeLineNumber(true);
    this.setScope(1);
    this.setComponentLoadTimerName("USR:MPG.IMMUNIZATION.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.IMMUNIZATION.O1 - render component");
    
    ImmunizationComponent.method("InsertData", function(){
        CERN_IMMUNIZATION_O1.GetImmunizationTable(this);
    });
    ImmunizationComponent.method("HandleSuccess", function(recordData){
        CERN_IMMUNIZATION_O1.RenderComponent(this, recordData);
    });
}
ImmunizationComponent.inherits(MPageComponent);

var CERN_IMMUNIZATION_O1 = function(){
    return {
        GetImmunizationTable: function(component){
            var sendAr = [];
            var criterion = component.getCriterion();
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.encntr_id + ".0", criterion.ppr_cd + ".0");
            MP_Core.XMLCclRequestWrapper(component, "mp_get_immunizations", sendAr, true);
            
        },
        RenderComponent: function(component, recordData){

            try {
                var jsHTML = [];
                var currImmun = null;
                var criterion = component.getCriterion();
                jsHTML.push("<div class='", MP_Util.GetContentClass(component, recordData.IMMUN_CNT), "'>");
                var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
                var nf = new mp_formatter.NumericFormatter(MPAGE_LOCALE);
                var dateTime = new Date();
                var adminDate = "";
                var hvrAdminDate = "";
                var imModClass = "";
                var valRes = "";
                var dose = "";
            
                for (var i = 0, j = recordData.IMMUN_CNT; i < j; i++) {
                	var immunizationi18n = i18n.discernabu.immunization;
		            var expiryDate = "";
                    var commentString = "";
                    var immDetails = "";
                    var precision = 0;
                    currImmun = recordData.IMMUN[i];
                    var resStatus = currImmun.RESULT_STATUS_CD;
                    dose = currImmun.DOSE; 
                    if (dose!="0"){
						valRes = dose.toString();
						var decLoc = valRes.search(/\.(\d)/);
					
						if (decLoc !== -1) {
							var strSize = valRes.length;
							precision = strSize - decLoc -1;						
                    	}
                    	immDetails = nf.format(valRes,"."+precision) +" "+ currImmun.UNIT;
                    } 
                   
                   if (currImmun.ROUTE){
	                  
	                   if (immDetails){
	                   		immDetails = immDetails +", ";                   		
	                   }
                   immDetails = immDetails + currImmun.ROUTE;
                   }
                   if (currImmun.SITE){
                   		
                   		if (immDetails){
                   			immDetails = immDetails +", ";
                   		}
                   		immDetails = immDetails + currImmun.SITE;
                   }
                    if (currImmun.ADMIN_DATE != "") {
                        var adminDt = currImmun.ADMIN_DATE;
                        dateTime.setISO8601(adminDt);
                        adminDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR);
                        hvrAdminDate = df.format(dateTime,mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
                    }else {
                        adminDate = "--";
                        hvrAdminDate = "--";
                    }
                    if (currImmun.EXP_DATE != "") {
                        var expDt = currImmun.EXP_DATE;
                        dateTime.setISO8601(expDt);
                        expiryDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
                    }
                    
                    
                   var imTitleLink = GetEventViewerLink(criterion.person_id + ".0", criterion.encntr_id + ".0", currImmun);
				  
                   var resModClass = "";
                   if (currImmun.RESULT_STATUS_CD === 1) {
                       resModClass = "<span class='res-modified'>&nbsp;</span>";
                   }

				   jsHTML.push("<h3 class='info-hd'><SPAN>",currImmun.NAME, "</SPAN></h3><dl class='im-info result-info'><dd class='im-name'><span>"
				     , imTitleLink,resModClass, "</span></dd><dd class='im-date'><span class='date-time'>", adminDate, "</span></dd></dl><div class='result-details'><dl class='im-det'><dt><span>"
				     , immunizationi18n.IMMUNIZATIONS, ":</span></dt><dd><span>", currImmun.NAME, "</span></dd><dt><span>"
				     , immunizationi18n.TYPE, ":</span></dt><dd><span>", currImmun.TYPE, "</span></dd><dt><span>"
				     , immunizationi18n.STATUS, ":</span></dt><dd><span>", currImmun.RESULT_STATUS_DISP, "</span></dd><dt><span>"
				     , immunizationi18n.PRODUCT, ":</span></dt><dd><span>", currImmun.PRODUCT, "</span></dd><dt><span>"
				     , immunizationi18n.ADMIN_DATE, ":</span></dt><dd><span>", hvrAdminDate, "</span></dd><dt><span>"
				     , immunizationi18n.DOCUMENTED_BY, ":</span></dt><dd><span>", currImmun.ADMIN_NAME, "</span></dd><dt><span>"
				     , immunizationi18n.DETAILS, ":</span></dt><dd><span>", immDetails, "</span></dd><dt><span>"
				     , immunizationi18n.MANUFACTURER, ":</span></dt><dd><span>", currImmun.MANUFACTURER, "</span></dd><dt><span>"
				     , immunizationi18n.LOT, ":</span></dt><dd><span>", currImmun.LOT, "</span></dd><dt><span>"
				     , immunizationi18n.EXP_DATE, ":</span></dt><dd><span>", expiryDate, "</span></dd><dt><span>"
				     , immunizationi18n.ADMIN_NOTES, ":</span></dt>");
				     
					if (currImmun.NOTE !== ""){
                        commentString += currImmun.NOTE + "<br />";
                    }
                    else {
                        for (var k = 0, l = currImmun.ADMIN_NOTE.length; k < l; k++) {
                            commentString += currImmun.ADMIN_NOTE[k].TEXT + "<br />";
                        }
                    }
                    jsHTML.push("<dd><span>", commentString, "</span></dd></dl></div>");
                }
                jsHTML.push("</div>");
                var countText = MP_Util.CreateTitleText(component, recordData.IMMUN_CNT);
                component.finalizeComponent(jsHTML.join("") , countText);
            } 
            catch (err) {
                
                throw (err);
            }
            finally {
                //do nothing
            }
            return;
        }
    };
    function GetEventViewerLink( patientID, encntrID, immObj){
        var ar = [];
        var params = [patientID, encntrID, immObj.EVENT_ID, '"EVENT"'];
        ar.push("<a onclick='MP_Util.LaunchClinNoteViewer(", params.join(","), "); return false;' href='#'>", immObj.NAME, "</a>");
        return ar.join("");	
    }
}();