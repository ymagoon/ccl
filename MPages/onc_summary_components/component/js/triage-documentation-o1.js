function TriageDocComponentStyle(){
    this.initByNamespace("tri");
}

TriageDocComponentStyle.inherits(ComponentStyle);

function TriageDocComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new TriageDocComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.TRIAGE_DOC.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.TRIAGE_DOC.O1 - render component");
    this.setIncludeLineNumber(false);
    this.setScope(2);
    
    TriageDocComponent.method("InsertData", function(){
        CERN_TRIAGE_DOC_O1.GetTriage(this);
    });
    TriageDocComponent.method("HandleSuccess", function(recordData){
        CERN_TRIAGE_DOC_O1.RenderComponent(this, recordData);
    });
}

TriageDocComponent.inherits(MPageComponent);

var CERN_TRIAGE_DOC_O1 = function () {
	return {
		GetTriage: function (component) {
            var sendAr = [];
            var criterion = component.getCriterion();
            var reportId = component.getReportId();
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id+".0", criterion.provider_id+ ".0" ,reportId+".0",1, criterion.ppr_cd + ".0" ,criterion.position_cd + ".0");   
            MP_Core.XMLCclRequestWrapper(component, "mp_get_triage", sendAr, true);
		},

		RenderComponent: function (component, recordData) {
			
			var jsHTML = [];
			var seHTML = "";
			var countText = "";
			var section = null;
			var event = null;
			var hvrDetails = null;
			var triageReci18n=i18n.discernabu.triage_document_o1;
			var hvrHeaderNotAdded = true;
			var unit;
			var systolicBP;
			var diastolicBP;
			var df = MP_Util.GetDateFormatter();
			var rowCount = 0;
			var rowHeight = 0;
			var m_rootComponentNode = component.getRootComponentNode();
					
			jsHTML.push("<div class='tri-scrollable'><div><dl class='tri-info'>");				
			for(var k=0,kl= recordData.SEC_CNT;k<kl;k++){
				
				section = recordData.SEC[k];
				var sectionCnt = section.CE_CNT;
					if(sectionCnt > 0){
						rowCount = rowCount+sectionCnt;
						jsHTML.push("<fieldset id='tri-fieldset'><legend class='tri-legend'>" + section.NAME + "</legend>");
						for(var m=0,m1= sectionCnt;m<m1;m++){
							event = section.CE[m];
							var type = event.TYPE;
							var dateTime = null;
							
							if(event.RESULT_VAL_DATE_IND){
								dateTime = new Date();
								dateTime.setISO8601(event.RESULT_VAL);
								event.RESULT_VAL = df.formatISO8601(event.RESULT_VAL, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
							}
							if(k === 1){
								 switch(type){
									case 1 :
										jsHTML.push("<dl class='tri-result'><dt class='tri-name'><span>"+ triageReci18n.TEMPERATURE +" :</span></dt>"+
													"<dd class='tri-val'><span>" + event.RESULT_VAL + " </span><span class='unit'>" + event.RESULT_UNITS_DISP  +"</span>");
										break;
									case 2 :
										var modInd = 0;
										unit = event.BP_GRP[0].RESULT_UNITS_DISP.length > 0 ? event.BP_GRP[0].RESULT_UNITS_DISP :event.BP_GRP[1].RESULT_UNITS_DISP;
										systolicBP = event.BP_GRP[0].RESULT_VAL.length > 0 ? event.BP_GRP[0].RESULT_VAL : "--";
										diastolicBP = event.BP_GRP[1].RESULT_VAL.length > 0 ? event.BP_GRP[1].RESULT_VAL : "--";											
										jsHTML.push("<dl class='tri-result'><dt class='tri-name'><span>" + triageReci18n.BLOOD_PRESSURE + " :</span></dt>" +
													"<dd class='tri-val'><span>" + systolicBP);
										modInd = parseInt(event.BP_GRP[0].MODIFY_IND, 10);
										if (modInd === 1) {
											jsHTML.push("<span class='res-modified'>&nbsp;</span>");
										}
										
										jsHTML.push("/" + diastolicBP + "</span>");
										modInd = parseInt(event.BP_GRP[1].MODIFY_IND, 10);
										if (modInd === 1) {
											jsHTML.push("<span class='res-modified'>&nbsp;</span>");
										}
										
										jsHTML.push("<span class='unit'> " + unit + "</span>");	
										break;
									case 3:
										jsHTML.push("<dl class='tri-result'><dt class='tri-name'><span>"+ triageReci18n.HEART_RATE +" :</span></dt>"+
													"<dd class='tri-val'><span>" + event.RESULT_VAL + " </span><span class='unit'>" + event.RESULT_UNITS_DISP  +"</span>");
										break;
									default:
										jsHTML.push("<dl class='tri-result'><dt class='tri-name'><span>" + event.EVENT_TITLE_TEXT + " :</span></dt>"+
													"<dd class='tri-val'><span>" + event.RESULT_VAL + " </span><span class='unit'>" + event.RESULT_UNITS_DISP  + "</span>");
								 }
							}
							else{
								jsHTML.push("<dl class='tri-result'><dt class='tri-name'><span>" + event.EVENT_TITLE_TEXT + " :</span></dt>"+
											"<dd class='tri-val'><span>" + event.RESULT_VAL + " " + event.RESULT_UNITS_DISP  +"</span>");
							}				
							if(event.MODIFY_IND === 1){
								jsHTML.push("<span class='res-modified'>&nbsp;</span></dd></dl>");
							}
							else{
								jsHTML.push("</dd></dl>");
							}	
						}
						jsHTML.push("</fieldset>");
					}
			}	
			jsHTML.push("</dl>");
			//set up hover
			for(var i=0,il= recordData.SEC_HVR_CNT;i<il;i++){
				hvrDetails = recordData.SEC_HVR[i];
				if (hvrDetails.CE_CNT > 0){
					if(hvrHeaderNotAdded){
						jsHTML.push("<h4 class='det-hd'><span>"+triageReci18n.TRIAGE_DETAILS +"</span></h4><div class='hvr'>");	
						hvrHeaderNotAdded = false;								
					}
					jsHTML.push("<dl class='tri-hvr-header'><span>"+hvrDetails.NAME+"</span></dl><dl>");
					for(var j=0,j1= hvrDetails.CE_CNT;j<j1;j++){
						event = hvrDetails.CE[j];
						var hvrType = event.TYPE;
						var hvrDateTime = null;
						if(event.RESULT_VAL_DATE_IND){
							hvrDateTime = new Date();
							hvrDateTime.setISO8601(event.RESULT_VAL);
							event.RESULT_VAL = df.formatISO8601(event.RESULT_VAL, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
						}
						if(i === 1){
							switch(hvrType){
								case 1 :
									jsHTML.push("<dt class='tri-det-name'><span>"+ triageReci18n.TEMPERATURE +" :</span></dt>"+
												"<dd class='tri-det-val'><span>" + event.RESULT_VAL + " </span><span class='unit'>" + event.RESULT_UNITS_DISP  +"</span>");
									break;
								case 2 :
									var hvrModInd = 0;
									unit = event.BP_GRP[0].RESULT_UNITS_DISP.length > 0 ? event.BP_GRP[0].RESULT_UNITS_DISP :event.BP_GRP[1].RESULT_UNITS_DISP;
									systolicBP = event.BP_GRP[0].RESULT_VAL.length > 0 ? event.BP_GRP[0].RESULT_VAL : "--";
									diastolicBP = event.BP_GRP[1].RESULT_VAL.length > 0 ? event.BP_GRP[1].RESULT_VAL : "--";											
									jsHTML.push("<dt class='tri-det-name'><span>" + triageReci18n.BLOOD_PRESSURE + " :</span></dt>" +
												"<dd class='tri-det-val'><span>" + systolicBP);
									hvrModInd = parseInt(event.BP_GRP[0].MODIFY_IND, 10);			
									if (hvrModInd === 1) {
										jsHTML.push("<span class='res-modified'>&nbsp;</span>");
									}		
									
									jsHTML.push("/" + diastolicBP + "</span>");
									hvrModInd = parseInt(event.BP_GRP[1].MODIFY_IND, 10);
									if (hvrModInd === 1) {
										jsHTML.push("<span class='res-modified'>&nbsp;</span>");
									}
									
									jsHTML.push("<span class='unit'> " + unit + "</span>");	
									break;
								case 3 :
									jsHTML.push("<dt class='tri-det-name'><span>"+ triageReci18n.HEART_RATE +" :</span></dt>"+
												"<dd class='tri-det-val'><span>" + event.RESULT_VAL + " </span><span class='unit'>" + event.RESULT_UNITS_DISP  +"</span>");
												break;
								default:
									jsHTML.push("<dt class='tri-det-name'><span>" + event.EVENT_TITLE_TEXT + " :</span></dt>"+
												"<dd class='tri-det-val'><span>" + event.RESULT_VAL + " </span><span class='unit'>" + event.RESULT_UNITS_DISP  + "</span>");
							}
						}
						else{
							jsHTML.push("<dt class='tri-det-name'><span>"+event.EVENT_TITLE_TEXT+" :</span></dt>"+
										"<dd class='tri-det-val'><span>"+event.RESULT_VAL+" "+event.RESULT_UNITS_DISP+"</span>");
						}
						if(event.MODIFY_IND === 1){
							jsHTML.push("<span class='res-modified'>&nbsp;</span></dd></dl>");
						}
						else{
							jsHTML.push("</dd></dl>");
						}	
					}	
				}	
			}			  
			jsHTML.push("</div></div></div>");
			countText = MP_Util.CreateTitleText(component,countText);
			seHTML = jsHTML.join("");
			MP_Util.Doc.FinalizeComponent(seHTML, component, countText);
			if(rowCount > 0){
				if(component.isScrollingEnabled()){
					if(component.getScrollNumber()<rowCount){
						// computing the total height in em and dividing it by row count which returns the height of single row
						rowHeight = (($('#triContent'+component.getComponentId())[0].scrollHeight*0.06)/rowCount).toFixed(2).toString(); 
						MP_Util.Doc.InitScrolling(Util.Style.g("tri-scrollable",m_rootComponentNode,"div"),component.getScrollNumber(),rowHeight);
					}
				}
			}
			return;
		}
	};
} ();
