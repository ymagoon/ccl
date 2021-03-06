function RiskFactorComponentWFStyle(){this.initByNamespace("rf-wf");
}RiskFactorComponentWFStyle.inherits(ComponentStyle);
function RiskFactorComponentWF(criterion){this.setCriterion(criterion);
this.setStyles(new RiskFactorComponentWFStyle());
this.setComponentLoadTimerName("USR:MPG.RISKFACTOR.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.RISKFACTOR.O1 - render component");
this.setIncludeLineNumber(true);
this.riskFactorPowerFormId=0;
this.setPregnancyLookbackInd(true);
this.setResourceRequired(true);
this.m_componentResultCount=0;
this.m_riskFactorEventCode=null;
this.m_arrRiskFactors=[];
this.m_arrOtherRiskFactors=[];
CERN_EventListener.addListener(this,EventListener.EVENT_CLINICAL_EVENT,this.retrieveComponentData,this);
CERN_EventListener.addListener(this,"pregnancyInfoAvailable",this.retrieveComponentData,this);
}RiskFactorComponentWF.prototype=new MPageComponent();
RiskFactorComponentWF.prototype.constructor=MPageComponent;
MP_Util.setObjectDefinitionMapping("WF_PREG_RISK_FACTORS",RiskFactorComponentWF);
RiskFactorComponentWF.prototype.RetrieveRequiredResources=function(){var pregInfoSR=MP_Resources.getSharedResource("pregnancyInfo");
if(pregInfoSR&&pregInfoSR.isResourceAvailable()){this.retrieveComponentData();
}else{PREGNANCY_BASE_UTIL_O1.LoadPregnancyData(this.getCriterion());
}};
RiskFactorComponentWF.prototype.setRiskFactorPF=function(powerFormId){this.riskFactorPowerFormId=powerFormId;
};
RiskFactorComponentWF.prototype.openTab=function(){if(this.riskFactorPowerFormId>0){var criterion=this.getCriterion();
var paramString=criterion.person_id+"|"+criterion.encntr_id+"|"+this.riskFactorPowerFormId+"|0|0";
MPAGES_EVENT("POWERFORM",paramString);
CERN_EventListener.fireEvent(null,this,EventListener.EVENT_CLINICAL_EVENT);
}};
RiskFactorComponentWF.prototype.setRiskFactor=function(value){this.m_riskFactorEventCode=value;
};
RiskFactorComponentWF.prototype.getRiskFactor=function(){return this.m_riskFactorEventCode||[];
};
RiskFactorComponentWF.prototype.setComponentResultCount=function(count){this.m_componentResultCount=count;
};
RiskFactorComponentWF.prototype.getComponentResultCount=function(){return this.m_componentResultCount;
};
RiskFactorComponentWF.prototype.loadFilterMappings=function(){this.addFilterMappingObject("WF_PREG_RISK_FACTORS_PF",{setFunction:this.setRiskFactorPF,type:"NUMBER",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("WF_PREG_RISK_FACTORS_CE",{setFunction:this.setRiskFactor,type:"Array",field:"PARENT_ENTITY_ID"});
};
RiskFactorComponentWF.prototype.openDropDown=function(powerFormId){var criterion=this.getCriterion();
var paramString=criterion.person_id+"|"+criterion.encntr_id+"|"+powerFormId+"|0|0";
MPAGES_EVENT("POWERFORM",paramString);
CERN_EventListener.fireEvent(null,this,EventListener.EVENT_CLINICAL_EVENT);
};
RiskFactorComponentWF.prototype.retrieveComponentData=function(){try{var rfi18n=i18n.discernabu.riskfactor_o1;
var component=this;
var criterion=this.getCriterion();
var encntrs=criterion.getPersonnelInfo().getViewableEncounters();
var encntrVal=(encntrs)?"value("+encntrs+")":"0.0";
var groups=this.getGroups();
var componentHTML="";
var pregInfoObj=null;
var pregInfoSR=MP_Resources.getSharedResource("pregnancyInfo");
var pregnancyId=0;
var sendAr=[];
var countText="";
var patientGenderInfo=criterion.getPatientInfo().getSex();
if(patientGenderInfo===null||patientGenderInfo.meaning===null||patientGenderInfo.meaning!=="FEMALE"){componentHTML="<h3 class='info-hd'><span class='res-normal'>"+rfi18n.NOT_FEMALE+"</span></h3><span class='res-none'>"+rfi18n.NOT_FEMALE+"</span>";
this.finalizeComponent(componentHTML,countText);
return;
}else{if(pregInfoSR&&pregInfoSR.isResourceAvailable()){pregInfoObj=pregInfoSR.getResourceData();
pregnancyId=pregInfoObj.getPregnancyId();
if(pregnancyId===-1){componentHTML="<h3 class='info-hd'><span class='res-normal'>"+rfi18n.PREG_DATA_ERROR+"</span></h3><span class='res-none'>"+rfi18n.PREG_DATA_ERROR+"</span>";
this.finalizeComponent(componentHTML,countText);
return;
}else{if(!pregnancyId){componentHTML="<h3 class='info-hd'><span class='res-normal'>"+rfi18n.PREGNANCY_NOT_FOUND+"</span></h3><span class='res-none'>"+rfi18n.PREGNANCY_NOT_FOUND+"</span>";
this.finalizeComponent(componentHTML,countText);
return;
}else{sendAr.push("^MINE^",criterion.person_id+".0",criterion.provider_id+".0",encntrVal,MP_Util.CreateParamArray(this.getRiskFactor(),1),criterion.ppr_cd+".0",pregInfoObj.getLookBack());
var request=new MP_Core.ScriptRequest(this,this.getComponentLoadTimerName());
request.setProgramName("MP_GET_RISK_FACTORS");
request.setParameters(sendAr);
request.setAsync(true);
MP_Core.XMLCCLRequestCallBack(this,request,function(reply){component.renderComponent(reply.getResponse());
return;
});
}}}}}catch(err){MP_Util.LogJSError(err,this,"risk-factor.js","retrieveComponentData");
throw (err);
}};
RiskFactorComponentWF.prototype.renderComponent=function(recordData){var timerRenderComponent=MP_Util.CreateTimer(this.getComponentRenderTimerName(),this.getCriterion().category_mean);
try{var rfi18n=i18n.discernabu.riskfactor_o1;
var componentResultCount=0;
var compId=this.getComponentId();
var criterion=this.getCriterion();
var messageHTML="";
var noDataHTML="<span class='res-none'>"+rfi18n.NO_RISK_FACTOR_DATA+"</span>";
var slaTimer=MP_Util.CreateTimer("CAP:MPG.RISKFACTOR.O1 - rendering component");
if(slaTimer){slaTimer.SubtimerName=criterion.category_mean;
slaTimer.Stop();
}if(recordData.CNT){this.processData(recordData);
componentResultCount=this.getComponentResultCount();
if(componentResultCount){messageHTML=this.buildRiskFactorTable();
this.attachListeners();
}else{messageHTML=noDataHTML;
}}else{messageHTML=noDataHTML;
}this.finalizeComponent(messageHTML,MP_Util.CreateTitleText(this,componentResultCount));
CERN_EventListener.fireEvent(this,this,EventListener.EVENT_COUNT_UPDATE,{count:componentResultCount});
}catch(err){MP_Util.LogJSError(err,this,"risk-factor.js","RenderComponent");
if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}};
RiskFactorComponentWF.prototype.processData=function(recordData){var riskFactorsData=recordData.RISKFACTORLIST;
var rfDataLength=riskFactorsData.length;
if(rfDataLength>0){var colonSpace=": ";
var colon=":";
var arrRiskFactors=[];
var arrOtherRiskFactors=[];
var strOther="";
var strOtherLength=0;
var riskFactorKeys=[];
var rfDataSeparator=recordData.RISK_FACTOR_SEPARATOR;
var rfDTAData="";
var rfDTAResults=[];
var rfFreeTextData="";
var rfFreeTextResult="";
for(var i=0;
i<rfDataLength;
i++){rfDTAData=riskFactorsData[i].RISK_FACTOR_RESULT;
rfDTAResults=[];
rfFreeTextData=riskFactorsData[i].FREE_TEXT_RISK_FACTOR_RESULT.split(colon);
rfFreeTextResult="";
if(rfFreeTextData.length>0){strOther=rfFreeTextData[0]+colonSpace;
if(rfFreeTextData.length>1){strOtherLength=strOther.length;
rfFreeTextResult=riskFactorsData[i].FREE_TEXT_RISK_FACTOR_RESULT.substr(strOtherLength);
}else{rfFreeTextResult=riskFactorsData[i].FREE_TEXT_RISK_FACTOR_RESULT;
}}if(rfDTAData){rfDTAResults=rfDTAData.split(rfDataSeparator);
}var dateTimeObj=new Date();
dateTimeObj.setISO8601(riskFactorsData[i].RISK_FACTOR_START_DT_TM);
var rfDateTimeValue=dateFormat(dateTimeObj,dateFormat.masks.longDate);
var rfAddedBy=riskFactorsData[i].RISK_FACTOR_ADDED_BY;
if(rfFreeTextResult){arrOtherRiskFactors.push({RiskFactor:rfFreeTextResult,AddedBy:rfAddedBy,DateAdded:rfDateTimeValue,ISODateAdded:dateTimeObj});
}var rfDTAResultsLength=rfDTAResults.length;
if(rfDTAData&&rfDTAResultsLength){for(var j=0;
j<rfDTAResultsLength;
j++){if(!riskFactorKeys[rfDTAResults[j]]){riskFactorKeys[rfDTAResults[j]]=[{AddedBy:rfAddedBy,FullDate:rfDateTimeValue,DateObject:dateTimeObj}];
}}}}var key=[];
for(key in riskFactorKeys){if(riskFactorKeys.hasOwnProperty(key)){riskFactorData=riskFactorKeys[key][0];
if(riskFactorData&&key!==strOther){arrRiskFactors.push({RiskFactor:key,AddedBy:riskFactorData.AddedBy,DateAdded:riskFactorData.FullDate,ISODateAdded:riskFactorData.DateObject});
}}}arrRiskFactors.reverse();
arrOtherRiskFactors.reverse();
this.m_arrRiskFactors=arrRiskFactors;
this.m_arrOtherRiskFactors=arrOtherRiskFactors;
this.setComponentResultCount(arrRiskFactors.length+arrOtherRiskFactors.length);
}};
RiskFactorComponentWF.prototype.buildRiskFactorTable=function(){var rfi18n=i18n.discernabu.riskfactor_o1;
var componentResultCount=0;
var compId=this.getComponentId();
var jsRiskFactorHTML=[];
var riskFactorHTML="";
var riskFactorTable=new ComponentTable();
riskFactorTable.setNamespace(this.getStyles().getNameSpace());
riskFactorTable.setZebraStripe(true);
var resultColumn=new TableColumn();
resultColumn.setColumnId("RiskFactor"+compId);
resultColumn.setCustomClass("rf-wf-table-header-column");
resultColumn.setColumnDisplay(rfi18n.RISK_FACTOR);
resultColumn.setPrimarySortField("RiskFactor");
resultColumn.setRenderTemplate("${RiskFactor}");
var addedByColumn=new TableColumn();
addedByColumn.setColumnId("AddedBy"+compId);
addedByColumn.setCustomClass("rf-wf-table-header-column");
addedByColumn.setColumnDisplay(rfi18n.ADDED_BY);
addedByColumn.setPrimarySortField("AddedBy");
addedByColumn.setRenderTemplate("${AddedBy}");
var dateColumn=new TableColumn();
dateColumn.setColumnId("DateAdded"+compId);
dateColumn.setCustomClass("rf-wf-table-header-column");
dateColumn.setColumnDisplay(rfi18n.DATE_ADDED);
dateColumn.setPrimarySortField("DateAdded");
dateColumn.setRenderTemplate("${DateAdded}");
riskFactorTable.addColumn(resultColumn);
riskFactorTable.addColumn(addedByColumn);
riskFactorTable.addColumn(dateColumn);
var riskFactorsLength=this.m_arrRiskFactors.length;
var otherRiskFactorsLength=this.m_arrOtherRiskFactors.length;
if(riskFactorsLength>0){var riskFactorsGrp=new TableGroup();
var riskFactorHdr=rfi18n.RISK_FACTOR;
riskFactorsGrp.setDisplay(riskFactorHdr).setGroupId("RISK_FACTORS"+compId).setShowCount(false);
riskFactorsGrp.bindData(this.m_arrRiskFactors);
riskFactorTable.addGroup(riskFactorsGrp);
}if(otherRiskFactorsLength>0){var otherRiskFactorsGrp=new TableGroup();
var otherRiskFactorsHdr=rfi18n.OTHER;
otherRiskFactorsGrp.setDisplay(otherRiskFactorsHdr).setGroupId("OTHERS"+compId).setShowCount(false);
otherRiskFactorsGrp.bindData(this.m_arrOtherRiskFactors);
riskFactorTable.addGroup(otherRiskFactorsGrp);
}this.setComponentTable(riskFactorTable);
jsRiskFactorHTML.push(riskFactorTable.render());
riskFactorHTML=jsRiskFactorHTML.join("");
return riskFactorHTML;
};
RiskFactorComponentWF.prototype.attachListeners=function(){var riskFactorTable=this.getComponentTable();
var compId=this.getComponentId();
riskFactorTable.updateAfterResize=function(){ComponentTable.prototype.updateAfterResize.call(this);
$("#rf-wf\\:RISK_FACTORS"+compId+"\\:header").addClass("rf-wf-table-section-header");
};
};
