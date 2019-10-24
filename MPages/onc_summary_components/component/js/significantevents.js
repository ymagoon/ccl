function SignificantEventO1ComponentStyle(){this.initByNamespace("seo2");
}

SignificantEventO1ComponentStyle.inherits(ComponentStyle);
function SignificantEventO1Component(criterion){this.setCriterion(criterion);
this.setStyles(new SignificantEventO1ComponentStyle());
this.setComponentLoadTimerName("USR:MPG.SignificantEvent.O2 - load component");
this.setComponentRenderTimerName("ENG:MPG.SignificantEvent.O2 - render component");
this.setIncludeLineNumber(false);
this.setPlusAddEnabled(true);
this.m_patNameFull="";
this.m_seo2ActiveList=[];
this.m_sortType=0;
this.m_sortOrder=0;
SignificantEventO1Component.method("InsertData",function(){CERN_SignificantEventO1.GetSignificantEventsO2Table(this);
});
SignificantEventO1Component.method("HandleSuccess",function(recordData){CERN_SignificantEventO1.RenderComponent(this,recordData);
});
SignificantEventO1Component.method("openTab",function(){var criterion=this.getCriterion();
CERN_SignificantEventO1.initProtocol(criterion.person_id,criterion.encntr_id);
});
SignificantEventO1Component.method("setEventFilters",function(value){this.m_eventFilters=value;
});
SignificantEventO1Component.method("getEventFilters",function(){if(this.m_eventFilters){return this.m_eventFilters;
}});
SignificantEventO1Component.method("setPatientFullName",function(value){this.m_patNameFull=value;
});
SignificantEventO1Component.method("getPatientFullName",function(){return this.m_patNameFull;
});
SignificantEventO1Component.method("setSEO2ActiveList",function(value){this.m_seo2ActiveList=value;
});
SignificantEventO1Component.method("getSEO2ActiveList",function(){return this.m_seo2ActiveList;
});
SignificantEventO1Component.method("addSEO2ActiveListItem",function(item){this.m_seo2ActiveList.push(item);
});
SignificantEventO1Component.method("setSEO2ActiveListSort",function(sortFunction){this.m_seo2ActiveList.sort(sortFunction);
});
SignificantEventO1Component.method("setSortType",function(value){this.m_sortType=value;
});
SignificantEventO1Component.method("getSortType",function(){return this.m_sortType;
});
SignificantEventO1Component.method("setSortOrder",function(value){this.m_sortOrder=value;
});
SignificantEventO1Component.method("getSortOrder",function(){return this.m_sortOrder;
});
}SignificantEventO1Component.inherits(MPageComponent);

var CERN_SignificantEventO1=function(){
	
	return{
		GetSignificantEventsO2Table:function(component){
			
			var sendAr=[];
			var criterion=component.getCriterion();
			var seo2_lookBackType=0;
			var seo2_lookBackUnits=0;
			var seo2_viewableEncntrs="";
			
			if(component.getScope()===1){
				var prsnlInfo=criterion.getPersonnelInfo();
				var encntrs=prsnlInfo.getViewableEncounters();
				seo2_viewableEncntrs=(encntrs)?"value("+encntrs+")":"0";
			}
			else{
				seo2_viewableEncntrs=criterion.encntr_id;
			}
			
			var seo2_encntrOption=(component.getScope()===1)?"0.0":(criterion.encntr_id+".0");
			seo2_lookBackUnits=(component.getLookbackUnits())?component.getLookbackUnits():"0";
			seo2_lookBackType=(component.getLookbackUnitTypeFlag())?component.getLookbackUnitTypeFlag():"-1";
			sendAr.push("^MINE^",criterion.person_id+".0",seo2_encntrOption,criterion.provider_id+".0",criterion.position_cd+".0",criterion.ppr_cd+".0",seo2_lookBackUnits,seo2_lookBackType,criterion.encntr_id+".0");
			var seo2_types=component.getEventFilters();
			var significantEventFilters=MP_Util.CreateParamArray(seo2_types,1);
			sendAr.push(significantEventFilters);
			sendAr.push(seo2_viewableEncntrs);
			MP_Core.XMLCclRequestWrapper(component,"mp_get_sig_events",sendAr,true);
		
		},
        RenderComponent: function (component, recordData) {
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {

                var sei18n = i18n.discernabu.significantevents_o1;
                var compId = component.getComponentId();
                var df = MP_Util.GetDateFormatter();
                var nf = MP_Util.GetNumericFormatter();
                var totEvents = 0;
                var totInterv = 0;
                var jsSEO2HTML = [];
                var SEO2HTML = "";
                var countText = "";
                var patResult = "";
                var i = 0;
                var j = 0;
                var k = 0;
                var recIdx = 0;
                var foundRRT = false;
                var criterion = component.getCriterion();
                var endDate = "";
                var tempDate = "";
                var tempEventName = "";
                var resultDisplay = "";
                var resultName = "";
                var resultTitle = "";
                var resultValue = "";
                var mainStat = "";
                var dateTime = new Date();
                var m_rootComponentNode = component.getRootComponentNode();
                var m_contentNode = component.getSectionContentNode();
                var defaultLoc = '"' + recordData.PAT_LOCATION + '"';
                var replaceStr = ""; //001 Use string for RRT replacement
                var replaceActivateStr = ""; //001 Use string to replace Activate
                var replaceActivationStr = ""; //001 Use string to replace Activation 
                var showIND = 0; //001 1 = Show interevntion, 0 = do not display intervention
                var replaceActivateHoverStr = ""; //001 Use string to replace Activate Hover
                var rrtDate;
                var sepDate;
                var fallsDate;
                var rrtEventName = "";
                var sepEventName = "";
                var fallsEventName = "";
                var rrtRecIDx = 0;
                var sepRecIDx = 0;
                var fallsRecIdx = 0;
                var defaultIndicatorPosition = -1;
                var fallEventName = "Fall";
                var spanTag = "";
                var dateResLen = "";
                var showSepsisLink = false;
                totEvents = recordData.EVENTS.length;
                component.setPatientFullName(recordData.USER_NAME);            
                
                jsSEO2HTML.push("<div class = 'seo2_scrollable'>");

                //001 replacing Rapid Response/RRT string
                if (recordData.REPLACERRTSTR > "") {
                    replaceStr = recordData.REPLACERRTSTR;
                } else {
                    replaceStr = "Rapid Response Team";
                }


                //001 replacing Rapid Response/RRT string
                if (recordData.ACTIVATERRT > "") {
                    replaceActivateStr = recordData.ACTIVATERRT;
                } else {
                    replaceActivateStr = "Rapid Response Team";
                }

                //001 replacing Rapid Response/RRT string
                if (recordData.ACTIVATEHOVERRRT > "") {
                    replaceActivateHoverStr = recordData.ACTIVATEHOVERRRT;
                } else {
                    replaceActivateHoverStr = "Rapid Response Team";
                }

                //001 replacing Rapid Response/RRT string
                if (recordData.ACTIVATIONRRT > "") {
                    replaceActivationStr = recordData.ACTIVATIONRRT;
                } else {
                    replaceActivationStr = "Rapid Response Team";
                }

                if (totEvents > 0) {
                    for (i = 0; i < totEvents; i++) {
                        if (recordData.EVENTS[i].NAME.toUpperCase() === "RAPID RESPONSE TEAM") {
                            rrtEventName = recordData.EVENTS[i].NAME;
                            rrtRecIdx = i;
                            if (recordData.EVENTS[i].DATETIME) {
                                rrtDate = new Date();
                                rrtDate = dateTime.setISO8601(recordData.EVENTS[i].DATETIME);
                                rrtDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                            }
                        }
						
						 if (recordData.EVENTS[i].NAME.toUpperCase() === "RAPID RESPONSE TEAM") {
                            rrtEventName = recordData.EVENTS[i].NAME;
                            rrtRecIdx = i;
                            if (recordData.EVENTS[i].DATETIME) {
                                rrtDate = new Date();
                                rrtDate = dateTime.setISO8601(recordData.EVENTS[i].DATETIME);
                                rrtDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                            }
                        }
						else  
						{
							if (recordData.EVENTS[i].NAME ===replaceStr){
							rrtEventName = recordData.EVENTS[i].NAME;
                            rrtRecIdx = i;
                            if (recordData.EVENTS[i].DATETIME) {
                                rrtDate = new Date();
                                rrtDate = dateTime.setISO8601(recordData.EVENTS[i].DATETIME);
                                rrtDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
								}
							}
						}
                        if (recordData.EVENTS[i].NAME.toUpperCase() === "SEPSIS") {
                            showSepsisLink = true;
                            sepEventName = recordData.EVENTS[i].NAME;
                            sepRecIDx = i;
                            if (recordData.EVENTS[i].DATETIME) {
                                sepDate = new Date();
                                sepDate = dateTime.setISO8601(recordData.EVENTS[i].DATETIME);
                                sepDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                            }

                        }
                        if (recordData.EVENTS[i].NAME.toUpperCase() === "FALL") {
                            fallsEventName = recordData.EVENTS[i].NAME;
                            fallsRecIdx = i;

                            if (recordData.EVENTS[i].DATE_RES[0].VALUE) {
                                fallsDate = new Date();
                                dateTime.setISO8601(recordData.EVENTS[i].DATE_RES[0].VALUE);
                                fallsDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                            }

                        }

                    } //endfor	

                    if (fallsDate) {
                        tempDate = fallsDate;
                        tempEventName = fallsEventName;
                        recIdx = fallsRecIdx;
                        if (rrtDate && rrtDate > tempDate) {
                            tempDate = rrtDate;
                            tempEventName = rrtEventName;
                            recIdx = rrtRecIdx;
                        }
                        if (sepDate && sepDate > tempDate) {
                            tempDate = sepDate;
                            tempEventName = sepEventName;
                            recIdx = sepRecIDx;
                        }
                    } else if (rrtDate) {
                        tempDate = rrtDate;
                        tempEventName = rrtEventName;
                        recIdx = rrtRecIdx;
                        if (sepDate && sepDate > tempDate) {
                            tempDate = sepDate;
                            tempEventName = sepEventName;
                            recIdx = sepRecIDx;
                        }

                    } else if (sepDate) {
                        tempDate = sepDate;
                        tempEventName = sepEventName;
                        recIdx = sepRecIDx;
                    }


                    //Red Box start
                    if (tempEventName != "") {
                        if (tempDate)
                            endDate = tempDate;

                        if (tempEventName == fallEventName) {
                            jsSEO2HTML.push("<div class='seo2-brdr'><dl class='seo2-info'>");
                            jsSEO2HTML.push("<dl class='seo2-dl-res'><dt class='seo2-dt-res'><span class='seo2-img-res'>&nbsp;</span>", sei18n.RESULTS_FROM, ":</dt><dd class='seo2-dd'><span class='res-severe'><span class='seo2-spac'>", sei18n.LAST_EVENT.replace("{0}", tempEventName), " ", endDate, "</span></span></dd></dl>");
                            //check verified date time for fall related injury- should match with verified date time for date time of fall
                            if (recordData.EVENTS[recIdx].DATE_RES[0].DATETIME && recordData.EVENTS[recIdx].RESULTS[0].DATETIME) {
                                if (recordData.EVENTS[recIdx].DATE_RES[0].DATETIME === recordData.EVENTS[recIdx].RESULTS[0].DATETIME) {
                                    resultName = recordData.EVENTS[recIdx].RESULTS[0].NAME;
                                    resultValue = recordData.EVENTS[recIdx].RESULTS[0].VALUE;
                                }
                            }
                            if (resultName && resultValue) {
                                jsSEO2HTML.push("<dl class='seo2-dl-res'><dt class='seo2-dt-res'><span>", resultName, ":</span></dt>");
                          
                                jsSEO2HTML.push("<dd class='seo2-dd'><span>", resultValue, "</span></dd></dl>");
                                
                            }
							jsSEO2HTML.push("</div>")
                        } 
						else {
                            //Red Box start
					jsSEO2HTML.push("<div class='seo2-brdr'><dl class='seo2-info'>");
					jsSEO2HTML.push("<dl class='seo2-dl-res'><dt class='seo2-dt-res'><span class='seo2-img-res'>&nbsp;</span>",sei18n.RESULTS_FROM,":</dt><dd class='seo2-dd'><span class='res-severe'><span class='seo2-spac'>",sei18n.LAST_EVENT.replace("{0}",tempEventName)," ",endDate,"</span></span></dd></dl>");
					
					for(j=0;j<recordData.EVENTS[recIdx].RESULTS.length;j++){
						resultName=recordData.EVENTS[recIdx].RESULTS[j].NAME;
						resultName=resultName.replace("Condition triggered by",sei18n.CONDITION_TRIGGERED_BY);
						resultValue=recordData.EVENTS[recIdx].RESULTS[j].VALUE;
						
						
						
						resultValue=resultValue.replace(/^\s+/,"");
						resultValue=resultValue.replace(/\s+$/,"");
						
						
						
						if(isNaN(parseFloat(resultValue))||(!/^-?(\d+|\d*\.\d+)$/.test(resultValue))){
							resultValue=resultValue.replace("Rule",sei18n.RULE);
							resultValue=resultValue.replace("PowerPlan",sei18n.POWER_PLAN);
							resultValue=resultValue.replace("Clinical Event",sei18n.CLINICAL_EVENT);
							resultValue=resultValue.replace("Manual activation of Rapid Response Team",sei18n.MANUAL_ACTIVATION);
						}
						else{
							resultValue=nf.format(resultValue);
						}
						
						
						
						jsSEO2HTML.push("<dl class='seo2-dl-res'><dt class='seo2-dt-res'><span>",resultName,":</span></dt>");
						
						
						if(recordData.EVENTS[recIdx].RESULTS[j].NORMALCY){
							jsSEO2HTML.push("<dd class='seo2-dd-ico'>",CERN_SignificantEventO1.getResultIcon(recordData.EVENTS[recIdx].RESULTS[j].NORMALCY),"</dd><dd class='seo2-dd'><span class='",CERN_SignificantEventO1.getResultClass(recordData.EVENTS[recIdx].RESULTS[j].NORMALCY),"'>",resultValue,"</span></dd></dl>");
						}else{
							jsSEO2HTML.push("<dd class='seo2-dd'><span class='",CERN_SignificantEventO1.getResultClass(recordData.EVENTS[recIdx].RESULTS[j].NORMALCY),"'>",resultValue,"</span></dd></dl>");
						}
					}

                    jsSEO2HTML.push("</dl><h4 class='det-hd'><span>patResult</span></h4> <div class='hvr'>");

					for(k=0;k<recordData.EVENTS[recIdx].TRIG_CRITERION.length;k++){
						resultDisplay=recordData.EVENTS[recIdx].TRIG_CRITERION[k].DISPLAY;
						resultDisplay=resultDisplay.replace("Rule",sei18n.RULE);
						resultDisplay=resultDisplay.replace("PowerPlan",sei18n.POWER_PLAN);
						resultDisplay=resultDisplay.replace("Clinical Event",sei18n.CLINICAL_EVENT);
						resultDisplay=resultDisplay.replace("Manual activation of Rapid Response Team",sei18n.MANUAL_ACTIVATION);
						resultTitle=recordData.EVENTS[recIdx].TRIG_CRITERION[k].TITLE;
						resultTitle=resultTitle.replace("Condition triggered by",sei18n.CONDITION_TRIGGERED_BY);
						jsSEO2HTML.push("<dl><dt><span>",resultTitle,":</span></dt><dd><span class='seo2-spac'>",resultDisplay,"</span></dd></dl>");
					}
					
					jsSEO2HTML.push("</div></div>");
                    }
                } //end tempEvents
                //Red box end
				} //end totEvents

                if (recordData.RRT_FLG == 1) {
                    jsSEO2HTML.push("<div><dl class='seo2-btn'>");

                    //Links start
                    if (recordData.RRT_RULE_FLG == 1) { //001 adding ==1 
                        //001 jsSEO2HTML.push("<dt><span><a class='seo2-btn-txt' onclick='CERN_SignificantEventO1.activateRRT(",defaultLoc,',"',compId,"\")'>",sei18n.RRT_ACTIVATION,"</a></span></dt>");
                        //replace rapid response team/rrt with string
                        jsSEO2HTML.push("<dt><span><a class='seo2-btn-txt' onclick='CERN_SignificantEventO1.activateRRT(", defaultLoc, ',"', compId, "\")'>", replaceActivationStr, "</a></span></dt>"); //001
                    }
                    if (recordData.RRT_LINK == 1) { //001 adding ==1
                        jsSEO2HTML.push("<dt><span class='seo2-hide'><a class='seo2-btn-txt'>", sei18n.RRT_SBAR, "</a></span></dt>");
                    }
                    if (recordData.RRT_MOEW == 1) { //001 adding ==1
                        jsSEO2HTML.push("<dt><span><a class='seo2-btn-txt' onclick='CERN_SignificantEventO1.initProtocol(", criterion.person_id, ", ", criterion.encntr_id, ")'>", sei18n.INITIATE_PROTOCOL, "</a></span></dt>");
                    }
                    
                    if (showSepsisLink && recordData.SEPSIS_ADVISOR_LINK) {
                        var advisor_link_params = "/PERSONID="+criterion.person_id+" /ENCNTRID="+criterion.encntr_id+" /FIRSTTAB=^" + recordData.SEPSIS_ADVISOR_LINK + "^";
                        jsSEO2HTML.push("<dt><span><a class='seo2-btn-txt' href='javascript:APPLINK(0,\"$APP_APPNAME$\",\"" + advisor_link_params + "\");'>", recordData.SEPSIS_ADVISOR_LINK_LBL, "</a></span></dt>");
                    }

                    jsSEO2HTML.push("</dl></div>");

                } else  {
                    if (showSepsisLink && recordData.SEPSIS_ADVISOR_LINK) {
                        jsSEO2HTML.push("<div><dl class='seo2-btn'>");                    
                        var advisor_link_params = "/PERSONID="+criterion.person_id+" /ENCNTRID="+criterion.encntr_id+" /FIRSTTAB=^" + recordData.SEPSIS_ADVISOR_LINK + "^";
                        jsSEO2HTML.push("<dt><span><a class='seo2-btn-txt' href='javascript:APPLINK(0,\"$APP_APPNAME$\",\"" + advisor_link_params + "\");'>", recordData.SEPSIS_ADVISOR_LINK_LBL, "</a></span></dt>");
                        jsSEO2HTML.push("</dl></div>");
                    }
                }

                //001 jsSEO2HTML.push("<div id='rrtAct",compId,"' class='seo2-hide'><div class='seo2-dl-res'><div class='seo2-rrt-div'><dl class='seo2-rrt-act'><dt class='seo2-rrt-act'>",sei18n.ENTER_PATIENT_LOCATION," : <br/><span class='seo2-rrt-btn'><input class='seo2-rrt-btn' type='button' title='",sei18n.ACTIVATE_RRT,"' value='",sei18n.ACTIVATE_RRT,"' id='rrtOk",compId,"' onclick='CERN_SignificantEventO1.rrtOk(",criterion.provider_id,",",criterion.person_id,",",criterion.encntr_id,",",compId,")' /></span></dt><dd class='seo2-rrt-act'><input class='seo2-rrt-txt' id='rrtlocation",compId,"' type='text' name='rrtlocation' onchange='CERN_SignificantEventO1.chkText(",compId,")' onkeyup='CERN_SignificantEventO1.chkText(",compId,")' /><br/><input class='seo2-rrt-btn' type='button' title='",sei18n.CANCEL,"' value='",sei18n.CANCEL,"' onclick='CERN_SignificantEventO1.rrtCancel(",compId,")' /></dd></dl></div></div></div>");
                //Replace button text with RRT updated string
                jsSEO2HTML.push("<div id='rrtAct", compId, "' class='seo2-hide'><div class='seo2-dl-res'><div class='seo2-rrt-div'><dl class='seo2-rrt-act'><dt class='seo2-rrt-act'>", sei18n.ENTER_PATIENT_LOCATION, " : <br/><span class='seo2-rrt-btn'><input class='seo2-rrt-btn' type='button' title='", replaceActivateHoverStr, "' value='", replaceActivateStr, "' id='rrtOk", compId, "' onclick='CERN_SignificantEventO1.rrtOk(", criterion.provider_id, ",", criterion.person_id, ",", criterion.encntr_id, ",", compId, ")' /></span></dt><dd class='seo2-rrt-act'><input class='seo2-rrt-txt' id='rrtlocation", compId, "' type='text' name='rrtlocation' onchange='CERN_SignificantEventO1.chkText(", compId, ")' onkeyup='CERN_SignificantEventO1.chkText(", compId, ")' /><br/><input class='seo2-rrt-btn' type='button' title='", sei18n.CANCEL, "' value='", sei18n.CANCEL, "' onclick='CERN_SignificantEventO1.rrtCancel(", compId, ")' /></dd></dl></div></div></div>"); //001

                if (totEvents > 0) {
                    //Drop down box of events
                    //If no default if chosen, default All Events

                    if (recordData.NODEFAULTIND == 1) { //001
                        jsSEO2HTML.push("<div class='seo2-fltr'><span class='seo2-fltr-txt'>", sei18n.FILTER_BY, ":</span><select id='eventFilter", compId, "' class ='seo2-drp-txt' onchange='CERN_SignificantEventO1.changeEvents(", compId, ");'><optgroup label='", sei18n.EVENTS, "'><option value='1' selected='selected'>-- ", sei18n.ALL_EVENTS, " --</option></optgroup><optgroup label='", sei18n.TRIGGERING_CRITERIA, "'>");
                    } else { //001 Allowing end user to set filter default

                        jsSEO2HTML.push("<div class='seo2-fltr'><span class='seo2-fltr-txt'>", sei18n.FILTER_BY, ":</span><select id='eventFilter", compId, "' class ='seo2-drp-txt' onchange='CERN_SignificantEventO1.changeEvents(", compId, ");'><optgroup label='", sei18n.EVENTS, "'><option value='1'>-- ", sei18n.ALL_EVENTS, " --</option></optgroup><optgroup label='", sei18n.TRIGGERING_CRITERIA, "'>"); //001
                    } //001

                    //Drop down box of events
                    for (i = 0; i < totEvents; i++) {
                        //001 If default is set from CCL, use that as default for drop down box
                        if (recordData.EVENTS[i].DEFAULTIND == 1) {
                            jsSEO2HTML.push("<option selected='selected' value='", recordData.EVENTS[i].NAME, "' id='", recordData.EVENTS[i].NAME, "'>", recordData.EVENTS[i].NAME, "</option>");
                        } else {
                            jsSEO2HTML.push("<option value='", recordData.EVENTS[i].NAME, "' id='", recordData.EVENTS[i].NAME, "'>", recordData.EVENTS[i].NAME, "</option>");
                        }

                    }
                    jsSEO2HTML.push("</optgroup></select></div>");
                    jsSEO2HTML.push("<div class='sub-sec' id='events", compId, "'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", patResult, "'>-</span><span class='sub-sec-title'>", sei18n.EVENTS, " (", totEvents, ")</span></h3>", "<div class='sub-sec-content'><div class='content-hdr'><dl class ='seo2-info-hdr'><dt class ='seo2-dt'><span>", sei18n.DATE_TIME, " </span></dt><dd class ='seo2-dd'><span>", sei18n.CONDITION_EVENT, "</span></dd><dd class ='seo2-ico-dd'><span>", sei18n.INTERVENTIONS, "</span></dd></dl></div><div class='content-body'>");

                    //Events Section
                    for (i = 0; i < totEvents; i++) {
                        dateResLen = recordData.EVENTS[i].DATE_RES.length;
                        if (recordData.EVENTS[i].DATETIME) {
                            dateTime.setISO8601(recordData.EVENTS[i].DATETIME);
                            endDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                        }
                        jsSEO2HTML.push("<h3 class='seo2-info-hd'><span>patResult</span></h3><dl class='seo2-info'><dt class='seo2-dt'><span>", endDate, "</span></dt><dd class='seo2-dd'><span>", recordData.EVENTS[i].NAME, "</span></dd>");
                        jsSEO2HTML.push("<dd class ='seo2-ico-dd'>")

                        if (recordData.EVENTS[i].NAME.toUpperCase() == "FALL" && dateResLen > 0) {
                            spanTag = "";
							
                            if (recordData.EVENTS[i].FALLS_INT_STATUS === 0) {
                                spanTag = "<span class='seo2-img-nost'>&nbsp;</span>";
                            }
                            if (recordData.EVENTS[i].FALLS_INT_STATUS === 1) {
                                spanTag = "<span class='seo2-img-comp'>&nbsp;</span>";
                            }
                            jsSEO2HTML.push(spanTag, "</dd>")
                        } else {
                            spanTag = "";
                            if (recordData.EVENTS[i].INTERV_STATUS === 0) {
                                spanTag = "<span class='seo2-img-nost'>&nbsp;</span>";
                            }

                            if (recordData.EVENTS[i].INTERV_STATUS === 1) {
                                spanTag = "<span class='seo2-img-prog'>&nbsp;</span>";
                            }
                            if (recordData.EVENTS[i].INTERV_STATUS === 2) {
                                spanTag = "<span class='seo2-img-comp'>&nbsp;</span>";
                            }
                            jsSEO2HTML.push(spanTag, "</dd>")
                        }

                        jsSEO2HTML.push("</dl><h4 class='det-hd'><span>patResult</span></h4> <div class='hvr'>");

                        if (recordData.EVENTS[i].NAME.toUpperCase() == "FALL" && dateResLen > 0) {
                            if (recordData.EVENTS[i].DATE_RES.length > 0) {
                                if (recordData.EVENTS[i].DATE_RES[0].VALUE) {
                                    resultName = recordData.EVENTS[i].DATE_RES[0].NAME;
                                    dateTime.setISO8601(recordData.EVENTS[i].DATE_RES[0].VALUE);
                                    resultValue = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                                }
                                jsSEO2HTML.push("<dl><dt><span>", resultName, ":</span></dt>", resultValue, "&nbsp;</span></dd></dl>");
                            }
                            if (recordData.EVENTS[i].RESULTS.length > 0) {
                                if (recordData.EVENTS[i].RESULTS[0].VALUE) {
                                    if (recordData.EVENTS[i].DATE_RES[0].DATETIME && recordData.EVENTS[i].RESULTS[0].DATETIME) {
                                        var date_res_dt_tm = "";
                                        var str_res_st_tm = "";

                                        dateTime.setISO8601(recordData.EVENTS[i].DATE_RES[0].DATETIME);
                                        date_res_dt_tm = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);

                                        dateTime.setISO8601(recordData.EVENTS[i].RESULTS[0].DATETIME);
                                        str_res_st_tm = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);

                                        if (date_res_dt_tm === str_res_st_tm) {
                                            resultName = recordData.EVENTS[i].RESULTS[0].NAME;
                                            resultValue = recordData.EVENTS[i].RESULTS[0].VALUE;
                                            jsSEO2HTML.push("<dl><dt><span>", resultName, ":</span></dt>", resultValue, "&nbsp;</span></dd></dl>");
                                        }
                                    }

                                }
                            }
                            jsSEO2HTML.push("<dl><dt><span>", sei18n.TOTAL_EVENTS.replace("{0}", recordData.EVENTS[i].NAME), ":</span></dt><dd><span class='seo2-spac'>", recordData.EVENTS[i].TOTAL_FALLS, "</span></dd></dl>");
                        } else {

                            for (j = 0; j < recordData.EVENTS[i].RESULTS.length; j++) {
                                resultName = recordData.EVENTS[i].RESULTS[j].NAME;
                                resultName = resultName.replace("Condition triggered by", sei18n.CONDITION_TRIGGERED_BY);
                                resultValue = recordData.EVENTS[i].RESULTS[j].VALUE;
                                resultValue = resultValue.replace(/^\s+/, "");
                                resultValue = resultValue.replace(/\s+$/, "");

                                if (isNaN(parseFloat(resultValue)) || (!/^-?(\d+|\d*\.\d+)$/.test(resultValue))) {
                                    resultValue = resultValue.replace("Rule", sei18n.RULE);
                                    resultValue = resultValue.replace("PowerPlan", sei18n.POWER_PLAN);
                                    resultValue = resultValue.replace("Clinical Event", sei18n.CLINICAL_EVENT);
                                    resultValue = resultValue.replace("Manual activation of Rapid Response Team", sei18n.MANUAL_ACTIVATION);
                                } else {
                                    resultValue = nf.format(resultValue);
                                }
                                jsSEO2HTML.push("<dl><dt><span>", resultName, ":</span></dt><dd class='seo2-dd-ico'>", CERN_SignificantEventO1.getResultIcon(recordData.EVENTS[i].RESULTS[j].NORMALCY), "</dd><dd><span class='", CERN_SignificantEventO1.getResultClass(recordData.EVENTS[i].RESULTS[j].NORMALCY), "'>", resultValue, "&nbsp;", recordData.EVENTS[i].RESULTS[j].UNIT_OF_MEASURE, "</span></dd></dl>");
                            }
                            jsSEO2HTML.push("<dl><dt><span>", sei18n.TOTAL_EVENTS.replace("{0}", recordData.EVENTS[i].NAME), ":</span></dt><dd><span class='seo2-spac'>", recordData.EVENTS[i].OCCUR_CNT, "</span></dd></dl>");
                        }

                        jsSEO2HTML.push("</div>");
                    }

                    jsSEO2HTML.push("</div></div></div>");
                    jsSEO2HTML.push("<div class='seo2-hide' id='triggers", compId, "'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", patResult, "'>-</span><span class='sub-sec-title'>", sei18n.TRIGGERING_CRITERIA, "</span></h3>", "<div class='sub-sec-content'><div class='content-body' id='trigResults", compId, "'>");

                    var intervNote = ""
                    for (i = 0; i < totEvents; i++) {
                        dateResLen = recordData.EVENTS[i].DATE_RES.length;
                        if (recordData.EVENTS[i].NAME.toUpperCase() == "FALL" && dateResLen > 0) {
                            var dtResultNameValue = "";
                            var strResultNameValue = ""
                            jsSEO2HTML.push("<div id='" + recordData.EVENTS[i].NAME + "'>")
                            if (recordData.EVENTS[i].DATE_RES.length > 0) {
                                if (recordData.EVENTS[i].DATE_RES[0].VALUE && recordData.EVENTS[i].DATE_RES[0].VALUE) {
                                    resultName = recordData.EVENTS[i].DATE_RES[0].NAME;
                                    dateTime.setISO8601(recordData.EVENTS[i].DATE_RES[0].VALUE);
                                    resultValue = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                                }
                                jsSEO2HTML.push("<dl class='seo2-info'><dt class='seo2-dt-res'><span>", resultName, ":</span></dt><dd class='seo2-dd'><span class='&nbsp;'>", resultValue, "&nbsp;</span></dd></dl>");
                            }
                            if (recordData.EVENTS[i].RESULTS.length > 0) {
                                if (recordData.EVENTS[i].RESULTS[0].VALUE) {
                                    if (recordData.EVENTS[i].DATE_RES[0].VALUE && recordData.EVENTS[i].RESULTS[0].DATETIME) {
                                        var date_res_dt_tm = "";
                                        var str_res_st_tm = "";

                                        dateTime.setISO8601(recordData.EVENTS[i].DATE_RES[0].DATETIME);
                                        date_res_dt_tm = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);

                                        dateTime.setISO8601(recordData.EVENTS[i].RESULTS[0].DATETIME);
                                        str_res_st_tm = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                                        resultName = recordData.EVENTS[i].RESULTS[0].NAME;

                                        if (date_res_dt_tm === str_res_st_tm) {
                                            resultValue = recordData.EVENTS[i].RESULTS[0].VALUE;
                                            jsSEO2HTML.push("<dl class='seo2-info'><dt class='seo2-dt-res'><span>", resultName, ":</span></dt><dd class='seo2-dd'><span class='&nbsp;'>", resultValue, "&nbsp;</span></dd></dl>");
                                        }
                                    }

                                }
                            }
                            jsSEO2HTML.push("</div>");
                        } else {
                            for (j = 0; j < recordData.EVENTS[i].RESULTS.length; j++) {
                                dateResLen = recordData.EVENTS[i].DATE_RES.length;
                                resultName = recordData.EVENTS[i].RESULTS[j].NAME;
                                resultName = resultName.replace("Condition triggered by", sei18n.CONDITION_TRIGGERED_BY);
                                resultValue = recordData.EVENTS[i].RESULTS[j].VALUE;
                                resultValue = resultValue.replace(/^\s+/, "");
                                resultValue = resultValue.replace(/\s+$/, "");

                                if (isNaN(parseFloat(resultValue)) || (!/^-?(\d+|\d*\.\d+)$/.test(resultValue))) {
                                    resultValue = resultValue.replace("Rule", sei18n.RULE);
                                    resultValue = resultValue.replace("PowerPlan", sei18n.POWER_PLAN);
                                    resultValue = resultValue.replace("Clinical Event", sei18n.CLINICAL_EVENT);
                                    resultValue = resultValue.replace("Manual activation of Rapid Response Team", sei18n.MANUAL_ACTIVATION);
                                } else {
                                    resultValue = nf.format(resultValue);
                                }

                                if (recordData.EVENTS[i].RESULTS[j].NORMALCY) {
                                    jsSEO2HTML.push("<div id='" + recordData.EVENTS[i].NAME + "'><dl class='seo2-info'><dt class='seo2-dt-res'><span>" + resultName + ":&nbsp;</span></dt><dd class='seo2-dd-ico'>", CERN_SignificantEventO1.getResultIcon(recordData.EVENTS[i].RESULTS[j].NORMALCY), "</dd><dd class='seo2-dd'><span class='" + CERN_SignificantEventO1.getResultClass(recordData.EVENTS[i].RESULTS[j].NORMALCY) + "'>" + resultValue + "&nbsp;" + recordData.EVENTS[i].RESULTS[j].UNIT_OF_MEASURE + "</span></dd></dl></div>");
                                } else {
                                    jsSEO2HTML.push("<div id='" + recordData.EVENTS[i].NAME + "'><dl class='seo2-info'><dt class='seo2-dt-res'><span>" + resultName + ":&nbsp;</span></dt><dd class='seo2-dd'><span class='" + CERN_SignificantEventO1.getResultClass(recordData.EVENTS[i].RESULTS[j].NORMALCY) + "'>" + resultValue + "&nbsp;" + recordData.EVENTS[i].RESULTS[j].UNIT_OF_MEASURE + "</span></dd></dl></div>");
                                }
                            }
                        }

                        totInterv = totInterv + recordData.EVENTS[i].INTERVENTIONS.length;
                        dateResLen = recordData.EVENTS[i].DATE_RES.length;
                        jsSEO2HTML.push("<div id='", recordData.EVENTS[i].NAME, "'>")
                        jsSEO2HTML.push("<dl class='seo2-info'><dt class='seo2-dt-res'><span>", sei18n.INTERVENTIONS, ":&nbsp;</span></dt>");
                        if (recordData.EVENTS[i].NAME.toUpperCase() == "FALL" && dateResLen > 0) {
                            if (recordData.EVENTS[i].FALLS_INT_STATUS === 0) {
                                jsSEO2HTML.push("<dd class ='seo2-dd'><span class='seo2-img-nost'>&nbsp;</span></dd></dl></div>");
                            }
                            if (recordData.EVENTS[i].FALLS_INT_STATUS === 1) {
                                jsSEO2HTML.push("<dd class ='seo2-dd'><span class='seo2-img-comp'>&nbsp;</span></dd></dl></div>");
                            }
                        } else {
                            if (recordData.EVENTS[i].INTERV_STATUS === 0) {
                                jsSEO2HTML.push("<dd class ='seo2-dd'><span class='seo2-img-nost'>&nbsp;</span></dd></dl></div>");
                            }
                            if (recordData.EVENTS[i].INTERV_STATUS === 1) {
                                jsSEO2HTML.push("<dd class ='seo2-dd'><span class='seo2-img-prog'>&nbsp;</span></dd></dl></div>");
                            }
                            if (recordData.EVENTS[i].INTERV_STATUS === 2) {
                                jsSEO2HTML.push("<dd class ='seo2-dd'><span class='seo2-img-comp'>&nbsp;</span></dd></dl></div>");
                            }
                        }


                        if (recordData.EVENTS[i].NAME.toUpperCase() == "FALL") {
                            //	jsSEO2HTML.push("<div id='"+recordData.EVENTS[i].NAME+"'>&nbsp;</div>");
                            // don't display events fired, if its a fall event!
                        } else {
                            if (recordData.EVENTS[i].DATETIME) {
                                dateTime.setISO8601(recordData.EVENTS[i].DATETIME);
                                endDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                            }
                            jsSEO2HTML.push("<div id='" + recordData.EVENTS[i].NAME + "'><dl class='seo2-info'><dt class='seo2-dt-res'><span>", sei18n.EVENT_FIRED, ":</span></dt><dd class='seo2-dd'><span class='seo2-spac'>" + endDate + "</span></dd></dl></div>");
                        }
                    }

                    jsSEO2HTML.push("</div></div></div>");
                    jsSEO2HTML.push("<div> <div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='" + patResult + "'>-</span><span class='sub-sec-title' id='totinv", compId, "'>", sei18n.INTERVENTIONS, " (" + totInterv + ")</span></h3><div class='content-body'><div class='sub-sec-content'><h3 class='seo2-info-hd'><span>patResult</span></h3>");
                    jsSEO2HTML.push("<dl class ='seo2-info-hdr'><span class='seo2-rrt-li'>", sei18n.INTERVENTION_NOTE, "</span></dl>");
                    jsSEO2HTML.push("<dl class ='seo2-info-hdr'><dt class ='seo2-dt' onclick='CERN_SignificantEventO1.sortPatients(0,", compId, ")'><span>", sei18n.DATE_TIME, "</span></dt><dd class ='seo2-dd' onclick='CERN_SignificantEventO1.sortPatients(1,", compId, ")'><span>", sei18n.TITLE, "</span></dd></dl><div id='intervCont", compId, "'>");

                    //Interventions sections
                    for (i = 0; i < totEvents; i++) {
                        for (j = 0; j < recordData.EVENTS[i].INTERVENTIONS.length; j++) {

                            showIND = 1; //Re-set showIND = 1

                            //001 start determine whether to show values
                            //If No DateTime Exists
                            if (recordData.EVENTS[i].INTERVENTIONS[j].DATETIME == "") {

                                //And its set to not show if no results exists
                                if (recordData.CESHOWIND == 0 && recordData.EVENTS[i].INTERVENTIONS[j].CEIND == 1) {
                                    showIND = 0;
                                }
                                if (recordData.PPSHOWIND == 0 && recordData.EVENTS[i].INTERVENTIONS[j].PPIND == 1) {
                                    showIND = 0;
                                }
                                if (recordData.ORDERSSHOWIND == 0 && recordData.EVENTS[i].INTERVENTIONS[j].ORDERSIND == 1) {
                                    showIND = 0;
                                }
                                if (recordData.BROADSHOWIND == 0 && recordData.EVENTS[i].INTERVENTIONS[j].BROADIND == 1) {
                                    showIND = 0;
                                }
                                if (recordData.VASOSHOWIND == 0 && recordData.EVENTS[i].INTERVENTIONS[j].VASOIND == 1) {
                                    showIND = 0;
                                }
                                if (recordData.IVSHOWIND == 0 && recordData.EVENTS[i].INTERVENTIONS[j].IVIND == 1) {
                                    showIND = 0;
                                }
                                if (recordData.GLUCOSHOWIND == 0 && recordData.EVENTS[i].INTERVENTIONS[j].GLUCOIND == 1) {
                                    showIND = 0;
                                }

                            }
                            //001 end
                            //If Intervention is supposed to be shown
                            if (showIND == 1) {
                                endDate = "<span class='seo2-no-date'>--</span>";


                                if (recordData.EVENTS[i].INTERVENTIONS[j].DATETIME) {
                                    dateTime.setISO8601(recordData.EVENTS[i].INTERVENTIONS[j].DATETIME);
                                    endDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                                }

                                var patDate = recordData.EVENTS[i].INTERVENTIONS[j].DATETIME;
                                var patTITLE = recordData.EVENTS[i].INTERVENTIONS[j].INV_NAME;

                                patTITLE = patTITLE.replace("RRT Activated", sei18n.RRT_ACTIVATED);
                                patTITLE = patTITLE.replace("RRT Assessment", sei18n.RRT_ASSESSMENT);
                                mainStat = recordData.EVENTS[i].INTERVENTIONS[j].MAIN_STAT;

                                if (recordData.EVENTS[i].INTERVENTIONS[j].QUANTITY_IND !== 1) {
                                    mainStat = mainStat.replace("Administered", sei18n.ADMINISTERED);
                                    mainStat = mainStat.replace("Initiated", sei18n.INITIATED);
                                    mainStat = mainStat.replace("Not ordered", sei18n.NOT_ORDERED);
                                    mainStat = mainStat.replace("Not initiated", sei18n.NOT_INITIATED);
                                    mainStat = mainStat.replace("No results found", sei18n.NO_RESULTS_FOUND);
                                    mainStat = mainStat.replace("Not administered", sei18n.NOT_ADMINISTERED);
                                    mainStat = mainStat.replace("No order found", sei18n.NO_ORDER_FOUND);
                                    mainStat = mainStat.replace("Ordered", sei18n.ORDERED);
                                } else {
                                    quantityObj = recordData.EVENTS[i].INTERVENTIONS[j].QUANTITY_VALUE;
                                    mainStat = quantityObj.MODIFIER + nf.format(quantityObj.NUMBER) + " " + quantityObj.UNITS;
                                    mainStat = mainStat.replace(/^\s+/, "");
                                    mainStat = mainStat.replace(/\s+$/, "");
                                } if (mainStat.indexOf(sei18n.NOT_ORDERED) >= 0 || mainStat.indexOf(sei18n.NOT_INITIATED) >= 0 || mainStat.indexOf(sei18n.NOT_ADMINISTERED) >= 0 || mainStat.indexOf(sei18n.NO_RESULTS_FOUND) >= 0 || mainStat.indexOf(sei18n.NO_ORDER_FOUND) >= 0) {
                                    resultSevere = "res-severe";
                                } else {
                                    resultSevere = "";
                                }

                                var patHTML = [];
                                var patEvent = recordData.EVENTS[i].NAME;
                                patHTML.push("<div id='" + patEvent + "'><dl class='seo2-info'><dt class='seo2-dt'>" + endDate + "</dt><dd class='seo2-inv-dd'>" + patTITLE + "&nbsp; <span class='" + resultSevere + "'>" + mainStat + "</span>");

                                if (recordData.EVENTS[i].INTERVENTIONS[j].INTER_DATA.length > 0) {
                                    patHTML.push("<ul>");
                                    for (k = 0; k < recordData.EVENTS[i].INTERVENTIONS[j].INTER_DATA.length; k++) {

                                        endDate = "<span class='seo2-no-date'>--</span>";

                                        if (recordData.EVENTS[i].INTERVENTIONS[j].INTER_DATA[k].TIME !== "") {
                                            dateTime.setISO8601(recordData.EVENTS[i].INTERVENTIONS[j].INTER_DATA[k].TIME);
                                            endDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                                        }

                                        patHTML.push("<li class='seo2-rrt-li'><span class='seo2-rrt-asm'>" + endDate + "&nbsp;" + recordData.EVENTS[i].INTERVENTIONS[j].INTER_DATA[k].NAME + " :</span> ");

                                        if (recordData.EVENTS[i].INTERVENTIONS[j].INTER_DATA[k].DATE_IND === 1) {
                                            endDate = "<span class='seo2-no-date'>--</span>";
                                            if (recordData.EVENTS[i].INTERVENTIONS[j].INTER_DATA[k].VALUE !== "") {
                                                dateTime.setISO8601(recordData.EVENTS[i].INTERVENTIONS[j].INTER_DATA[k].VALUE);
                                                endDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                                                patHTML.push("<span class='seo2-rrt-res'>" + endDate + "</span></li>");
                                            }
                                        } else {
                                            patHTML.push("<span class='seo2-rrt-res'>" + recordData.EVENTS[i].INTERVENTIONS[j].INTER_DATA[k].VALUE + "</span></li>");
                                        }
                                    }

                                    patHTML.push("</ul>");
                                } //(recordData.EVENTS[i].INTERVENTIONS[j].INTER_DATA.length>0)

                                //Hover for individual Interventions
                                //001 hover for interventions patHTML.push("</dd></dl><h4 class='det-hd'><span>patResult</span></h4> <div class='hvr'>",sei18n.CRITERION_APPLIES," :&nbsp;"+patEvent+"</div></div>");
                                var createHoverText = sei18n.CRITERION_APPLIES + ": " + patEvent; //001 new hover

                                createHoverText = createHoverText + "<br />";


                                for (k = 0; k < recordData.EVENTS[i].INTERVENTIONS[j].HOVER_CNT; k++) { //001 new hover

                                    if (recordData.EVENTS[i].INTERVENTIONS[j].HOVER[k].HOVERSTR > '') { //001 new hover

                                        createHoverText = createHoverText + "&nbsp;" + recordData.EVENTS[i].INTERVENTIONS[j].HOVER[k].HOVERSTR; //001 new hover
                                        createHoverText = createHoverText + "<br />"; //001 new hover
                                    }
                                }

                                patHTML.push("</dd></dl><h4 class='det-hd'><span>patResult</span></h4> <div class='hvr'>" + createHoverText + "</div></div>"); //001 new hover

                                jsSEO2HTML.push(patHTML.join(""));
                                var tempHTML = "";
                                tempHTML = patHTML.join("");
                                var thisPat = {
                                    DATE: patDate,
                                    TITLE: patTITLE,
                                    EVENT: patEvent,
                                    HTML: tempHTML
                                };
                                component.addSEO2ActiveListItem(thisPat);


                            }

                        } //for(j=0;j<recordData.EVENTS[i].INTERVENTIONS.length;j++){
                    }

                    component.setSortType(0);
                    component.setSortOrder(0);
                    jsSEO2HTML.push("</div></div></div></div></div>");


                } //if(totEvents>0)

                SEO2HTML = jsSEO2HTML.join("");
                countText = MP_Util.CreateTitleText(component, 0);
                MP_Util.Doc.FinalizeComponent(SEO2HTML, component, countText);

                if (recordData.PAT_LOCATION) {
                    CERN_SignificantEventO1.chkText(compId);
                }

                if (component.isScrollingEnabled()) {
                    var xNode = Util.Style.g("seo2-info", document.body, "DL");

                    if (xNode.length > component.getScrollNumber()) {
                        MP_Util.Doc.InitScrolling(Util.Style.g("seo2_scrollable", m_rootComponentNode, "div"), component.getScrollNumber(), "1.6");
                    }
                }

                //Reset default on each refresh
                if (totEvents > 0) { //001
                    CERN_SignificantEventO1.changeEvents(compId); //001
                } //001


            } catch (err) {
                if (timerRenderComponent) {
                    timerRenderComponent.Abort();
                    timerRenderComponent = null;
                }
                throw (err);
            } finally {
                if (timerRenderComponent) {
                    timerRenderComponent.Stop();
                }
            }
        },









activateRRT:function(location,compId){var activateRRT=_g("rrtAct"+compId);
activateRRT.className="seo2-show";
var rrttext=_g("rrtlocation"+compId);
rrttext.value=location;
CERN_SignificantEventO1.chkText(compId);
},rrtOk:function(uid,pid,eid,compId){var sei18n=i18n.discernabu.significantevents_o1;
var component=MP_Util.GetCompObjById(compId);
var activateRRT=_g("rrtAct"+compId);
var rrttext=_g("rrtlocation"+compId);
if(rrttext.value!==""){var newCom="<P>USR_PERSONID="+uid+".0<P>TEXTVALUE=MP_RRT_ACTIVATION<P>USER_NAME="+component.getPatientFullName()+"<P>ACTIVATION="+CERN_SignificantEventO1.trim(rrttext.value);
var noteParams="^COMMITRULE^,^"+pid+".0^,^"+eid+".0^,^0.0^,^MP_RRT_ACTIVATION^,^"+newCom+"^";
CCLLINK("EKS_CALL_SYNCH_EVENT",noteParams,1);
rrttext.value="";
activateRRT.className="seo2-hide";
alert(sei18n.LOCATION_NOTIFIED);
}},rrtCancel:function(compId){var activateRRT=_g("rrtAct"+compId);
var rrttext=_g("rrtlocation"+compId);
rrttext.value="";
activateRRT.className="seo2-hide";
var okbtn=_g("rrtOk"+compId);
okbtn.disabled=false;
},initProtocol:function(pid,eid){var params=[pid,".0|",eid,".0|{ORDER|0|0|0|0|0}|24|{2|127}{3|127}|8"];
MP_Util.LogMpagesEventInfo(null,"ORDERS",params.join(""),"significantevents.js","initProtocol");
MPAGES_EVENT("ORDERS",params.join(""));
},chkText:function(compId){var rrttext=_g("rrtlocation"+compId);
var okbtn=_g("rrtOk"+compId);
if(CERN_SignificantEventO1.validate(rrttext.value)!=1){okbtn.disabled=true;
}else{okbtn.disabled=false;
}},getResultIcon:function(normalcy){var normalcyIcon="<span>&nbsp;</span>";
if(normalcy){if(normalcy==="LOW"){normalcyIcon="<span class='res-low-icon'>&nbsp;</span>";
}else{if(normalcy==="HIGH"){normalcyIcon="<span class='res-high-icon'>&nbsp;</span>";
}else{if(normalcy==="CRITICAL"||normalcy==="EXTREMEHIGH"||normalcy==="PANICHIGH"||normalcy==="EXTREMELOW"||normalcy==="PANICLOW"||normalcy==="VABNORMAL"||normalcy==="POSITIVE"){normalcyIcon="<span class='res-severe-icon'>&nbsp;</span>";
}else{if(normalcy==="ABNORMAL"){normalcyIcon="<span class='res-abnormal-icon'>&nbsp;</span>";
}}}}}return normalcyIcon;
},getResultClass:function(normalcy){var resClass="";
if(normalcy){if(normalcy==="LOW"){resClass="res-low";
}else{if(normalcy==="HIGH"){resClass="res-high";
}else{if(normalcy==="CRITICAL"||normalcy==="EXTREMEHIGH"||normalcy==="PANICHIGH"||normalcy==="EXTREMELOW"||normalcy==="PANICLOW"||normalcy==="VABNORMAL"||normalcy==="POSITIVE"){resClass="res-severe";
}else{if(normalcy==="ABNORMAL"){resClass="res-abnormal";
}}}}}return resClass;
},validate:function(val){val=CERN_SignificantEventO1.trim(val);
return val.length!==0;
},trim:function(val){var ret=val.replace(/^\s+/,"");
ret=ret.replace(/\s+$/,"");
return ret;
},sortPatients:function(typ,compId){var component=MP_Util.GetCompObjById(compId);
var order=0;
var sortType=component.getSortType();
var sortOrder=component.getSortOrder();
if(typ===sortType){order=(sortOrder+1)%2;
}else{if(typ===0){order=1;
}}component.setSortOrder(order);
component.setSortType(typ);
switch(typ){case 0:function sortByDate(a,b){var sortRes=0;
if(a.DATE>b.DATE){sortRes=1;
}else{sortRes=-1;
}if(order===1){sortRes=sortRes*-1;
}return sortRes;
}component.setSEO2ActiveListSort(sortByDate);
break;
case 1:function sortByTitle(a,b){var sortRes=0;
if(a.TITLE<b.TITLE){sortRes=1;
}else{sortRes=-1;
}if(order===1){sortRes=sortRes*-1;
}return sortRes;
}component.setSEO2ActiveListSort(sortByTitle);
break;
}var jsActiveInter=[];
var activeInter="";
var activeList=component.getSEO2ActiveList();
for(var i=activeList.length;
i--;
){jsActiveInter.push(activeList[i].HTML);
}activeInter=jsActiveInter.join("");
var intervContent=_g("intervCont"+compId);
intervContent.innerHTML=activeInter;
CERN_SignificantEventO1.hvrInit("seo2-info",intervContent);
CERN_SignificantEventO1.changeEvents(compId);
},hvrInit:function(trg,par){gen=Util.Style.g(trg,par,"DL");
for(var i=0,l=gen.length;
i<l;
i++){var m=gen[i];
if(m){var nm=Util.gns(Util.gns(m));
if(nm){if(Util.Style.ccss(nm,"hvr")){hs(m,nm);
}}}}},

changeEvents:function(compId){var sei18n=i18n.discernabu.significantevents_o1;
var mainFilter=_g("events"+compId);
var mainTrigger=_g("triggers"+compId);
var eventFilters=_g("eventFilter"+compId);
var curFilter=eventFilters.options.selectedIndex;
var curVal=eventFilters.options.value;
var intv=_g("intervCont"+compId);
var invChilds=intv.childNodes;
var trigs=_g("trigResults"+compId);
var trigChilds=trigs.childNodes;
var newinvcnt=_g("totinv"+compId);
var totInterv=0;

if(curFilter>0){mainFilter.className="seo2-hide";
mainTrigger.className="seo2-show";
newinvcnt.innerHTML=sei18n.INTERVENTIONS+" ("+totInterv+")";
for(i=invChilds.length;
i--;
){if(invChilds[i]&&(invChilds[i].nodeName=="DIV")){if(invChilds[i].id==curVal){invChilds[i].className="seo2-show";
totInterv++;
}else{invChilds[i].className="seo2-hide";
}}}for(i=trigChilds.length;
i--;
){if(trigChilds[i]&&(trigChilds[i].nodeName=="DIV")){if(trigChilds[i].id==curVal){trigChilds[i].className="seo2-show";
}else{trigChilds[i].className="seo2-hide";
}}}newinvcnt.innerHTML=sei18n.INTERVENTIONS+" ("+totInterv+")";
}else{if(curFilter===0){for(i=invChilds.length;
i--;
){if(invChilds[i]&&(invChilds[i].nodeName=="DIV")){invChilds[i].className="seo2-show";
totInterv++;
}}mainFilter.className="seo2-show";
mainTrigger.className="seo2-hide";
}}
		newinvcnt.innerHTML=sei18n.INTERVENTIONS+" ("+totInterv+")";
		}
	};
}();