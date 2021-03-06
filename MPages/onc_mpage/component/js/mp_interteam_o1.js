function InterTeamComponentO1Style(){this.initByNamespace("intm");
}InterTeamComponentO1Style.inherits(ComponentStyle);
function InterTeamComponentO1(criterion){this.setCriterion(criterion);
this.setStyles(new InterTeamComponentO1Style());
this.setComponentLoadTimerName("USR:MPG.InterTeam.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.InterTeam.O1 - render component");
this.setIncludeLineNumber(false);
this.setScope(0);
this.rowCount=0;
this.m_teamConfOrder=null;
this.m_lastTeamDiscussionDocumented=null;
this.m_barriersToDischargeDocumented=null;
this.m_primaryOccupationalTherapists=null;
this.m_primaryPhysicalTherapists=null;
this.m_primarySpeechTherapists=null;
this.m_powerFormName=null;
this.m_componentID=this.getComponentId();
this.m_primaryPsychologists=null;
this.m_primaryPsychiatrists=null;
this.m_primarySocialWorkers=null;
this.m_primaryCouncilors=null;
this.m_primaryClinPharms=null;
this.m_otherCareProviders1=null;
this.m_otherCareProviders2=null;
this.m_otherCareProviders3=null;
this.m_otherCareProviderLbl1=null;
this.m_otherCareProviderLbl2=null;
this.m_otherCareProviderLbl3=null;
InterTeamComponentO1.method("InsertData",function(){CERN_InterTeamO1.GetInterTeamO1Table(this);
});
InterTeamComponentO1.method("HandleSuccess",function(recordData){CERN_InterTeamO1.RenderComponent(this,recordData);
});
InterTeamComponentO1.method("setTeamConfOrder",function(value){this.rowCount++;
this.m_teamConfOrder=value;
});
InterTeamComponentO1.method("addTeamConfOrder",function(value){if(this.m_lastTeamDiscussionDocumented==null){this.m_lastTeamDiscussionDocumented=[];
}this.m_teamConfOrder.push(value);
});
InterTeamComponentO1.method("getTeamConfOrder",function(){return this.m_teamConfOrder;
});
InterTeamComponentO1.method("setLastTeamDiscussionDocumented",function(value){this.rowCount++;
this.m_lastTeamDiscussionDocumented=value;
});
InterTeamComponentO1.method("addLastTeamDiscussionDocumented",function(value){if(this.m_lastTeamDiscussionDocumented==null){this.m_lastTeamDiscussionDocumented=[];
}this.m_lastTeamDiscussionDocumented.push(value);
});
InterTeamComponentO1.method("getLastTeamDiscussionDocumented",function(){return this.m_lastTeamDiscussionDocumented;
});
InterTeamComponentO1.method("setBarriersToDischargeDocumented",function(value){this.rowCount++;
this.m_barriersToDischargeDocumented=value;
});
InterTeamComponentO1.method("addBarriersToDischargeDocumented",function(value){if(this.m_barriersToDischargeDocumented==null){this.m_barriersToDischargeDocumented=[];
}this.m_barriersToDischargeDocumented.push(value);
});
InterTeamComponentO1.method("getBarriersToDischargeDocumented",function(){return this.m_barriersToDischargeDocumented;
});
InterTeamComponentO1.method("setPrimaryOccupationalTherapists",function(value){this.rowCount++;
this.m_primaryOccupationalTherapists=value;
});
InterTeamComponentO1.method("addPrimaryOccupationalTherapists",function(value){if(this.m_primaryOccupationalTherapists==null){this.m_primaryOccupationalTherapists=[];
}this.m_primaryOccupationalTherapists.push(value);
});
InterTeamComponentO1.method("getPrimaryOccupationalTherapists",function(){return this.m_primaryOccupationalTherapists;
});
InterTeamComponentO1.method("setPrimaryPhysicalTherapists",function(value){this.rowCount++;
this.m_primaryPhysicalTherapists=value;
});
InterTeamComponentO1.method("addPrimaryPhysicalTherapists",function(value){if(this.m_primaryPhysicalTherapists==null){this.m_primaryPhysicalTherapists=[];
}this.m_primaryPhysicalTherapists.push(value);
});
InterTeamComponentO1.method("getPrimaryPhysicalTherapists",function(){return this.m_primaryPhysicalTherapists;
});
InterTeamComponentO1.method("setPrimarySpeechTherapists",function(value){this.rowCount++;
this.m_primarySpeechTherapists=value;
});
InterTeamComponentO1.method("addPrimarySpeechTherapists",function(value){if(this.m_primarySpeechTherapists==null){this.m_primarySpeechTherapists=[];
}this.m_primarySpeechTherapists.push(value);
});
InterTeamComponentO1.method("getPrimarySpeechTherapists",function(){return this.m_primarySpeechTherapists;
});
InterTeamComponentO1.method("openTab",function(){var criterion=this.getCriterion();
var paramString=criterion.person_id+"|"+criterion.encntr_id+"|"+0+"|0|0";
MP_Util.LogMpagesEventInfo(this,"POWERFORM",paramString,"mp_interteam_o1.js","openTab");
javascript:MPAGES_EVENT("POWERFORM",paramString);
});
InterTeamComponentO1.method("openDropDown",function(formID){var criterion=this.getCriterion();
var paramString=criterion.person_id+"|"+criterion.encntr_id+"|"+formID+"|0|0";
MP_Util.LogMpagesEventInfo(this,"POWERFORM",paramString,"mp_interteam_o1.js","openDropDown");
javascript:MPAGES_EVENT("POWERFORM",paramString);
});
InterTeamComponentO1.method("setPrimaryPsychologists",function(value){this.rowCount++;
this.m_primaryPsychologists=value;
});
InterTeamComponentO1.method("addPrimaryPsychologists",function(value){if(this.m_primaryPsychologists==null){this.m_primaryPsychologists=[];
}this.m_primaryPsychologists.push(value);
});
InterTeamComponentO1.method("getPrimaryPsychologists",function(){return this.m_primaryPsychologists;
});
InterTeamComponentO1.method("setPrimaryPsychiatrists",function(value){this.rowCount++;
this.m_primaryPsychiatrists=value;
});
InterTeamComponentO1.method("addPrimaryPsychiatrists",function(value){if(this.m_primaryPsychiatrists==null){this.m_primaryPsychiatrists=[];
}this.m_primaryPsychiatrists.push(value);
});
InterTeamComponentO1.method("getPrimaryPsychiatrists",function(){return this.m_primaryPsychiatrists;
});
InterTeamComponentO1.method("setPrimarySocialWorkers",function(value){this.rowCount++;
this.m_primarySocialWorkers=value;
});
InterTeamComponentO1.method("addPrimarySocialWorkers",function(value){if(this.m_primarySocialWorkers==null){this.m_primarySocialWorkers=[];
}this.m_primarySocialWorkers.push(value);
});
InterTeamComponentO1.method("getPrimarySocialWorkers",function(){return this.m_primarySocialWorkers;
});
InterTeamComponentO1.method("setPrimaryCouncilors",function(value){this.rowCount++;
this.m_primaryCouncilors=value;
});
InterTeamComponentO1.method("addPrimaryCouncilors",function(value){if(this.m_primaryCouncilors==null){this.m_primaryCouncilors=[];
}this.m_primaryCouncilors.push(value);
});
InterTeamComponentO1.method("getPrimaryCouncilors",function(){return this.m_primaryCouncilors;
});
InterTeamComponentO1.method("setPrimaryClinPharms",function(value){this.rowCount++;
this.m_primaryClinPharms=value;
});
InterTeamComponentO1.method("addPrimaryClinPharms",function(value){if(this.m_primaryClinPharms==null){this.m_primaryClinPharms=[];
}this.m_primaryClinPharms.push(value);
});
InterTeamComponentO1.method("getPrimaryClinPharms",function(){return this.m_primaryClinPharms;
});
InterTeamComponentO1.method("setOtherCareProviders1",function(value){this.rowCount++;
this.m_otherCareProviders1=value;
});
InterTeamComponentO1.method("addOtherCareProviders1",function(value){if(this.m_otherCareProviders1==null){this.m_otherCareProviders1=[];
}this.m_otherCareProviders1.push(value);
});
InterTeamComponentO1.method("getOtherCareProviders1",function(){return this.m_otherCareProviders1;
});
InterTeamComponentO1.method("setOtherCareProviders2",function(value){this.rowCount++;
this.m_otherCareProviders2=value;
});
InterTeamComponentO1.method("addOtherCareProviders2",function(value){if(this.m_otherCareProviders2==null){this.m_otherCareProviders2=[];
}this.m_otherCareProviders2.push(value);
});
InterTeamComponentO1.method("getOtherCareProviders2",function(){return this.m_otherCareProviders2;
});
InterTeamComponentO1.method("setOtherCareProviders3",function(value){this.rowCount++;
this.m_otherCareProviders3=value;
});
InterTeamComponentO1.method("addOtherCareProviders3",function(value){if(this.m_otherCareProviders3==null){this.m_otherCareProviders3=[];
}this.m_otherCareProviders3.push(value);
});
InterTeamComponentO1.method("getOtherCareProviders3",function(){return this.m_otherCareProviders3;
});
InterTeamComponentO1.method("setOtherCareProviderLbl1",function(value){this.rowCount++;
this.m_otherCareProviderLbl1=value;
});
InterTeamComponentO1.method("addOtherCareProviderLbl1",function(value){if(this.m_otherCareProviderLbl1==null){this.m_otherCareProviderLbl1=[];
}this.m_otherCareProviderLbl1.push(value);
});
InterTeamComponentO1.method("getOtherCareProviderLbl1",function(){return this.m_otherCareProviderLbl1;
});
InterTeamComponentO1.method("setOtherCareProviderLbl2",function(value){this.rowCount++;
this.m_otherCareProviderLbl2=value;
});
InterTeamComponentO1.method("addOtherCareProviderLbl2",function(value){if(this.m_otherCareProviderLbl2==null){this.m_otherCareProviderLbl2=[];
}this.m_otherCareProviderLbl2.push(value);
});
InterTeamComponentO1.method("getOtherCareProviderLbl2",function(){return this.m_otherCareProviderLbl2;
});
InterTeamComponentO1.method("setOtherCareProviderLbl3",function(value){this.rowCount++;
this.m_otherCareProviderLbl3=value;
});
InterTeamComponentO1.method("addOtherCareProviderLbl3",function(value){if(this.m_otherCareProviderLbl3==null){this.m_otherCareProviderLbl3=[];
}this.m_otherCareProviderLbl3.push(value);
});
InterTeamComponentO1.method("getOtherCareProviderLbl3",function(){return this.m_otherCareProviderLbl3;
});
}InterTeamComponentO1.inherits(MPageComponent);
var CERN_InterTeamO1=function(){return{GetInterTeamO1Table:function(component){var sendAr=[];
var criterion=component.getCriterion();
var io1_encntrOption=0;
io1_encntr=criterion.encntr_id+".0";
sendAr.push("^MINE^",criterion.person_id+".0",io1_encntr);
sendAr.push((component.getTeamConfOrder()!=null)?"value("+component.getTeamConfOrder().join(",")+")":"0.0");
sendAr.push((component.getLastTeamDiscussionDocumented()!=null)?"value("+component.getLastTeamDiscussionDocumented().join(",")+")":"0.0");
sendAr.push((component.getBarriersToDischargeDocumented()!=null)?"value("+component.getBarriersToDischargeDocumented().join(",")+")":"0.0");
sendAr.push((component.getPrimaryOccupationalTherapists()!=null)?"value("+component.getPrimaryOccupationalTherapists().join(",")+")":"0.0");
sendAr.push((component.getPrimaryPhysicalTherapists()!=null)?"value("+component.getPrimaryPhysicalTherapists().join(",")+")":"0.0");
sendAr.push((component.getPrimarySpeechTherapists()!=null)?"value("+component.getPrimarySpeechTherapists().join(",")+")":"0.0");
sendAr.push((component.getPrimaryPsychologists()!=null)?"value("+component.getPrimaryPsychologists().join(",")+")":"0.0");
sendAr.push((component.getPrimaryPsychiatrists()!=null)?"value("+component.getPrimaryPsychiatrists().join(",")+")":"0.0");
sendAr.push((component.getPrimarySocialWorkers()!=null)?"value("+component.getPrimarySocialWorkers().join(",")+")":"0.0");
sendAr.push((component.getPrimaryCouncilors()!=null)?"value("+component.getPrimaryCouncilors().join(",")+")":"0.0");
sendAr.push((component.getPrimaryClinPharms()!=null)?"value("+component.getPrimaryClinPharms().join(",")+")":"0.0");
sendAr.push((component.getOtherCareProviders1()!=null)?"value("+component.getOtherCareProviders1().join(",")+")":"0.0");
sendAr.push((component.getOtherCareProviders2()!=null)?"value("+component.getOtherCareProviders2().join(",")+")":"0.0");
sendAr.push((component.getOtherCareProviders3()!=null)?"value("+component.getOtherCareProviders3().join(",")+")":"0.0");
sendAr.push((component.getOtherCareProviderLbl1()!=null)?("^"+component.getOtherCareProviderLbl1()+"^"):"^^");
sendAr.push((component.getOtherCareProviderLbl2()!=null)?("^"+component.getOtherCareProviderLbl2()+"^"):"^^");
sendAr.push((component.getOtherCareProviderLbl3()!=null)?("^"+component.getOtherCareProviderLbl3()+"^"):"^^");
MP_Core.XMLCclRequestWrapper(component,"mp_reh_get_inter_team",sendAr,true);
},RenderComponent:function(component,recordData){var m_rootComponentNode=null;
m_rootComponentNode=component.getRootComponentNode();
try{var jsINTO1HTML=[];
var criterion=component.getCriterion();
var df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
jsINTO1HTML.push("<div class = 'seo2_scrollable'>");
for(var i=0;
i<recordData.QUAL_CNT;
i++){var oDate=new Date();
var sDate="";
if(recordData.QUAL[i].DATE!=""){oDate.setISO8601(recordData.QUAL[i].DATE);
sDate=(oDate)?df.format(oDate,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR):"";
}if(recordData.QUAL[i].LABEL==="Last Team Discussion"){jsINTO1HTML.push("<dl class='intm-info'><dt class='intm-label'>",recordData.QUAL[i].LABEL," :</dt><dd class='intm-detail'><a onclick='CERN_InterTeamO1.displayDetail(\"",component.m_componentID,"\")'><span>Discussion Details</span></a></dd>","<dd class='intm-dt'>",sDate,"</dd>","<dd id='discDet",component.m_componentID,"' class='intm-hide'><br><span class='intm-disc-det'>",recordData.QUAL[i].VALUE,"</span></br></dd>","</dl>");
}else{if(recordData.QUAL[i].LABEL!=""){jsINTO1HTML.push("<dl class='intm-info'><dt class='intm-label'>",recordData.QUAL[i].LABEL," :</dt><dd class='intm-detail'>",recordData.QUAL[i].VALUE,"</dd>","<dd class='intm-dt'>",sDate,"</dd>","</dl>");
}}}jsINTO1HTML.push("</div>");
jsINTO1HTML=jsINTO1HTML.join("");
MP_Util.Doc.FinalizeComponent(jsINTO1HTML,component,"");
if(component.isScrollingEnabled()){if(component.getScrollNumber()<recordData.QUAL_CNT){MP_Util.Doc.InitScrolling(Util.Style.g("seo2_scrollable",m_rootComponentNode,"div"),component.getScrollNumber(),"1.6");
}}}catch(err){throw (err);
}finally{}},displayDetail:function(compID){var detail=document.getElementById("discDet"+compID);
if(detail.className=="intm-hide"){detail.className="intm-show";
}else{detail.className="intm-hide";
}}};
}();
