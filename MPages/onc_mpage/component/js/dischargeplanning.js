function DischargePlanningComponentStyle(){this.initByNamespace("cm");
}DischargePlanningComponentStyle.inherits(ComponentStyle);
function DischargePlanningComponent(criterion){this.setCriterion(criterion);
this.setStyles(new DischargePlanningComponentStyle());
this.setComponentLoadTimerName("USR:MPG.NW-CM-DISCHARGE-PLANNING.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.NW-CM-DISCHARGE-PLANNING.O1 - render component");
this.setIncludeLineNumber(true);
this.setScope(2);
DischargePlanningComponent.method("InsertData",function(){CERN_DischargePlanningInfo.getDischargePlanningData(this);
});
DischargePlanningComponent.method("HandleSuccess",function(recordData){CERN_DischargePlanningInfo.RenderComponent(this,recordData);
});
DischargePlanningComponent.method("setDischScreenPlan",function(value){this.m_dischScreenPlanCodes=value;
});
DischargePlanningComponent.method("addDischScreenPlan",function(value){if(this.m_dischScreenPlanCodes==null){this.m_dischScreenPlanCodes=[];
}this.m_dischScreenPlanCodes.push(value);
});
DischargePlanningComponent.method("getDischScreenPlan",function(){return this.m_dischScreenPlanCodes;
});
DischargePlanningComponent.method("setDischDisposition",function(value){this.m_dischDispositionCodes=value;
});
DischargePlanningComponent.method("addDischDisposition",function(value){if(this.m_dischDispositionCodes==null){this.m_dischDispositionCodes=[];
}this.m_dischDispositionCodes.push(value);
});
DischargePlanningComponent.method("getDischDisposition",function(){return this.m_dischDispositionCodes;
});
DischargePlanningComponent.method("setDocTransArrangement",function(value){this.m_docTransArrangementCodes=value;
});
DischargePlanningComponent.method("addDocTransArrangement",function(value){if(this.m_docTransArrangementCodes==null){this.m_docTransArrangementCodes=[];
}this.m_docTransArrangementCodes.push(value);
});
DischargePlanningComponent.method("getDocTransArrangement",function(){return this.m_docTransArrangementCodes;
});
DischargePlanningComponent.method("setProfSkillServices",function(value){this.m_profSkillServicesCodes=value;
});
DischargePlanningComponent.method("addProfSkillServices",function(value){if(this.m_profSkillServicesCodes==null){this.m_profSkillServicesCodes=[];
}this.m_profSkillServicesCodes.push(value);
});
DischargePlanningComponent.method("getProfSkillServices",function(){return this.m_profSkillServicesCodes;
});
DischargePlanningComponent.method("setDurableMedEquipment",function(value){this.m_durableMedEquipmentCodes=value;
});
DischargePlanningComponent.method("addDurableMedEquipment",function(value){if(this.m_durableMedEquipmentCodes==null){this.m_durableMedEquipmentCodes=[];
}this.m_durableMedEquipmentCodes.push(value);
});
DischargePlanningComponent.method("getDurableMedEquipment",function(){return this.m_durableMedEquipmentCodes;
});
DischargePlanningComponent.method("setDurableMedEquipmentCoordinated",function(value){this.m_durableMedEquipmentCoordinatedCodes=value;
});
DischargePlanningComponent.method("addDurableMedEquipmentCoordinated",function(value){if(this.m_durableMedEquipmentCoordinatedCodes==null){this.m_durableMedEquipmentCoordinatedCodes=[];
}this.m_durableMedEquipmentCoordinatedCodes.push(value);
});
DischargePlanningComponent.method("getDurableMedEquipmentCoordinated",function(){return this.m_durableMedEquipmentCoordinatedCodes;
});
DischargePlanningComponent.method("setPlannedDischDate",function(value){this.m_plannedDischDateCodes=value;
});
DischargePlanningComponent.method("addPlannedDischDate",function(value){if(this.m_plannedDischDateCodes==null){this.m_plannedDischDateCodes=[];
}this.m_plannedDischDateCodes.push(value);
});
DischargePlanningComponent.method("getPlannedDischDate",function(){return this.m_plannedDischDateCodes;
});
DischargePlanningComponent.method("setAdmissionMIMSigned",function(value){this.m_admissionMIMSignedCodes=value;
});
DischargePlanningComponent.method("addAdmissionMIMSigned",function(value){if(this.m_admissionMIMSignedCodes==null){this.m_admissionMIMSignedCodes=[];
}this.m_admissionMIMSignedCodes.push(value);
});
DischargePlanningComponent.method("getAdmissionMIMSigned",function(){return this.m_admissionMIMSignedCodes;
});
DischargePlanningComponent.method("setDischMIMGiven",function(value){this.m_dischMIMGivenCodes=value;
});
DischargePlanningComponent.method("addDischMIMGiven",function(value){if(this.m_dischMIMGivenCodes==null){this.m_dischMIMGivenCodes=[];
}this.m_dischMIMGivenCodes.push(value);
});
DischargePlanningComponent.method("getDischMIMGiven",function(){return this.m_dischMIMGivenCodes;
});
}DischargePlanningComponent.inherits(MPageComponent);
var CERN_DischargePlanningInfo=function(){return{getDischargePlanningData:function(component){var sendAr=[];
var criterion=component.getCriterion();
var groups=component.getGroups();
var events=[];
var dc_dc_plan="",dc_dc_disp="",dc_transp_arrange="",dc_prof_skill_ant="",dc_dme_ant="",dc_dme_coord="";
var dc_plan_dc_dt_tm="",dc_adm_mim="",dc_disch_mim="";
dc_dc_plan=(component.getDischScreenPlan()!=null)?component.getDischScreenPlan():"";
dc_dc_disp=(component.getDischDisposition()!=null)?component.getDischDisposition():"";
dc_transp_arrange=(component.getDocTransArrangement()!=null)?component.getDocTransArrangement():"";
dc_prof_skill_ant=(component.getProfSkillServices()!=null)?component.getProfSkillServices():"";
dc_dme_ant=(component.getDurableMedEquipment()!=null)?component.getDurableMedEquipment():"";
dc_dme_coord=(component.getDurableMedEquipmentCoordinated()!=null)?component.getDurableMedEquipmentCoordinated():"";
dc_plan_dc_dt_tm=(component.getPlannedDischDate()!=null)?component.getPlannedDischDate():"";
dc_adm_mim=(component.getAdmissionMIMSigned()!=null)?component.getAdmissionMIMSigned():"";
dc_disch_mim=(component.getDischMIMGiven()!=null)?component.getDischMIMGiven():"";
if(dc_dc_plan!=""){events.push(dc_dc_plan);
}if(dc_dc_disp!=""){events.push(dc_dc_disp);
}if(dc_transp_arrange!=""){events.push(dc_transp_arrange);
}if(dc_prof_skill_ant!=""){events.push(dc_prof_skill_ant);
}if(dc_dme_ant!=""){events.push(dc_dme_ant);
}if(dc_dme_coord!=""){events.push(dc_dme_coord);
}if(dc_plan_dc_dt_tm!=""){events.push(dc_plan_dc_dt_tm);
}if(dc_adm_mim!=""){events.push(dc_adm_mim);
}if(dc_disch_mim!=""){events.push(dc_disch_mim);
}var sEvents=(events!=null)?"value("+events.join(",")+")":"0.0";
sendAr.push("^MINE^",criterion.person_id+".0",+criterion.encntr_id+".0","0",sEvents);
MP_Core.XMLCclRequestWrapper(component,"RCM_MPC_DISCHARGE_PLAN",sendAr,true);
},RenderComponent:function(component,recordData){try{var admitMimSignedDtTm="",dischargeMimSignedDtTm="",plannedDischDtTm="",sHTML="";
var dc_dc_plan_arr=[],dc_dc_disp_arr=[],dc_transp_arrange_arr=[],dc_prof_skill_ant_arr=[],dc_dme_ant_arr=[],dc_dme_coord_arr=[];
var dc_plan_dc_dt_tm_arr=[],dc_adm_mim_arr=[],dc_disch_mim_arr=[];
var doc_plan_screen="",planned_disch_disp="",transportation_arranged="",prof_skill_anticipated="",dme_anticipated="",dme_coord="";
var plannedDischDtTm="",admitMimSignedDtTm="",dischargeMimSignedDtTm="";
var jsHTML=[];
var dateTime=new Date();
var recordValue="";
var dischargeInfo=recordData.DISCHARGE_PLANNING;
var displayValue="";
var eventType="";
dc_dc_plan_arr=(component.getDischScreenPlan()!=null)?component.getDischScreenPlan():"";
dc_dc_disp_arr=(component.getDischDisposition()!=null)?component.getDischDisposition():"";
dc_transp_arrange_arr=(component.getDocTransArrangement()!=null)?component.getDocTransArrangement():"";
dc_prof_skill_ant_arr=(component.getProfSkillServices()!=null)?component.getProfSkillServices():"";
dc_dme_ant_arr=(component.getDurableMedEquipment()!=null)?component.getDurableMedEquipment():"";
dc_dme_coord_arr=(component.getDurableMedEquipmentCoordinated()!=null)?component.getDurableMedEquipmentCoordinated():"";
dc_plan_dc_dt_tm_arr=(component.getPlannedDischDate()!=null)?component.getPlannedDischDate():"";
dc_adm_mim_arr=(component.getAdmissionMIMSigned()!=null)?component.getAdmissionMIMSigned():"";
dc_disch_mim_arr=(component.getDischMIMGiven()!=null)?component.getDischMIMGiven():"";
for(i=0;
i<recordData.QUAL.length;
i++){eventType=recordData.QUAL[i].EVENT_TYPE;
if(eventType=="TXT"){displayValue=recordData.QUAL[i].TEXT;
}else{if(eventType=="DATE"){displayValue=recordData.QUAL[i].DATE_VAL;
if(displayValue!=null&&displayValue!=""){dateTime.setISO8601(displayValue);
displayValue=dateTime.format("shortDate2");
}else{displayValue="";
}}else{displayValue=recordData.QUAL[i].EVENT_END_DATE;
if(displayValue!=null&&displayValue!=""){dateTime.setISO8601(displayValue);
displayValue=dateTime.format("shortDate2");
}else{displayValue="";
}}}if(displayValue!=""){recordValue=recordData.QUAL[i].VALUE;
for(x=0;
x<dc_dc_plan_arr.length;
x++){if(recordValue==dc_dc_plan_arr[x]){if(doc_plan_screen==""){doc_plan_screen=displayValue;
}else{doc_plan_screen+=","+displayValue;
}break;
}}for(x=0;
x<dc_dc_disp_arr.length;
x++){if(recordValue==dc_dc_disp_arr[x]){if(planned_disch_disp==""){planned_disch_disp=displayValue;
}else{planned_disch_disp+=","+displayValue;
}break;
}}for(x=0;
x<dc_transp_arrange_arr.length;
x++){if(recordValue==dc_transp_arrange_arr[x]){if(transportation_arranged==""){transportation_arranged=displayValue;
}else{transportation_arranged+=","+displayValue;
}break;
}}for(x=0;
x<dc_prof_skill_ant_arr.length;
x++){if(recordValue==dc_prof_skill_ant_arr[x]){if(prof_skill_anticipated==""){prof_skill_anticipated=displayValue;
}else{prof_skill_anticipated+=","+displayValue;
}break;
}}for(x=0;
x<dc_dme_ant_arr.length;
x++){if(recordValue==dc_dme_ant_arr[x]){if(dme_anticipated==""){dme_anticipated=displayValue;
}else{dme_anticipated+=","+displayValue;
}break;
}}for(x=0;
x<dc_dme_coord_arr.length;
x++){if(recordValue==dc_dme_coord_arr[x]){if(dme_coord==""){dme_coord=displayValue;
}else{dme_coord+=","+displayValue;
}break;
}}for(x=0;
x<dc_plan_dc_dt_tm_arr.length;
x++){if(recordValue==dc_plan_dc_dt_tm_arr[x]){if(plannedDischDtTm==""){plannedDischDtTm=displayValue;
}else{plannedDischDtTm+=","+displayValue;
}break;
}}for(x=0;
x<dc_adm_mim_arr.length;
x++){if(recordValue==dc_adm_mim_arr[x]){if(admitMimSignedDtTm==""){admitMimSignedDtTm=displayValue;
}else{admitMimSignedDtTm+=","+displayValue;
}break;
}}for(x=0;
x<dc_disch_mim_arr.length;
x++){if(recordValue==dc_disch_mim_arr[x]){if(dischargeMimSignedDtTm==""){dischargeMimSignedDtTm=displayValue;
}else{dischargeMimSignedDtTm+=","+displayValue;
}break;
}}}}var rcmdisRowCount=0;
if(recordData.FIN_CLASS=="MEDICARE"){rcmdisRowCount=11;
}else{rcmdisRowCount=9;
}jsHTML.push("<div class='",MP_Util.GetContentClass(component,rcmdisRowCount),"'>");
jsHTML.push("<dl class='cm-info'><dt><span class='row-label'>",i18n.CUR_DOC_PLAN_SCREEN,":</span></dt><dd class='cm-detail'><span>",doc_plan_screen,"</span></dd></dl>");
jsHTML.push("<dl class='cm-info'><dt><span class='row-label'>",i18n.PLANNED_DISCHARGE_DISP,":</span></dt><dd class='cm-detail'><span>",planned_disch_disp,"</span></dd></dl>");
jsHTML.push("<dl class='cm-info'><dt><span class='row-label'>",i18n.TRANSPORATION_ARRANGED,":</span></dt><dd class='cm-detail'><span>",transportation_arranged,"</span></dd></dl>");
if(recordData.FIN_CLASS=="MEDICARE"){jsHTML.push("<dl class='cm-info'><dt><span class='row-label'>",i18n.MIM_SIGNED,":</span></dt><dd class='cm-detail'><span>",admitMimSignedDtTm,"</span></dd></dl>");
jsHTML.push("<dl class='cm-info'><dt><span class='row-label'>",i18n.DISCHARGE_MIM_SIGNED,":</span></dt><dd class='cm-detail'><span>",dischargeMimSignedDtTm,"</span></dd></dl>");
}jsHTML.push("<dl class='cm-info'><dt><span class='row-label'>",i18n.PROFSKILLEDSERVICESANTICIPATED,":</span></dt><dd class='cm-detail'><span>",prof_skill_anticipated,"</span></dd></dl>");
jsHTML.push("<dl class='cm-info'><dt><span class='row-label'>",i18n.DME_ANTICIPATED,":</span></dt><dd class='cm-detail'><span>",dme_anticipated,"</span></dd></dl>");
jsHTML.push("<dl class='cm-info'><dt><span class='row-label'>",i18n.DME_COORD,":</span></dt><dd class='cm-detail'><span>",dme_coord,"</span></dd></dl>");
jsHTML.push("<dl class='cm-info'><dt><span class='row-label'>",i18n.PLANNED_DISCHARGE_DT_TM,":</span></dt><dd class='cm-detail'><span>",plannedDischDtTm,"</span></dd></dl>");
jsHTML.push("<dl class='cm-info'><dt><span class='row-label'>",i18n.DISCHARGE_PLANNER,":</span></dt><dd class='cm-detail'><span>",recordData.DISCH_PLANNER,"</span></dd></dl>");
jsHTML.push("<dl class='cm-info'><dt><span></span></dt><dd class='cm-detail'><span></span></dd></dl>");
jsHTML.push("</div>");
sHTML=jsHTML.join("");
countText="&nbsp;";
MP_Util.Doc.FinalizeComponent(sHTML,component,countText);
return;
}catch(err){throw (err);
}finally{}}};
}();
