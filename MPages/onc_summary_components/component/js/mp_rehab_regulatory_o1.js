function RehabRegulatoryComponentO1Style(){this.initByNamespace("rehabr");
}RehabRegulatoryComponentO1Style.inherits(ComponentStyle);
function RehabRegulatoryComponentO1(criterion){this.setCriterion(criterion);
this.setStyles(new RehabRegulatoryComponentO1Style());
this.setCriterion(criterion);
this.setComponentLoadTimerName("USR:MPG.REHAB_REGULATORY.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.REHAB_REGULATORY.O1 - render component");
}RehabRegulatoryComponentO1.prototype=new MPageComponent();
RehabRegulatoryComponentO1.prototype.constructor=MPageComponent;
RehabRegulatoryComponentO1.prototype.setPreadmitPFs=function(preadmitPFs){this.m_preadmitPFs=preadmitPFs;
};
RehabRegulatoryComponentO1.prototype.getPreadmitPFs=function(){return this.m_preadmitPFs;
};
RehabRegulatoryComponentO1.prototype.setPreadmitPNs=function(preadmitPNs){this.m_preadmitPNs=preadmitPNs;
};
RehabRegulatoryComponentO1.prototype.getPreadmitPNs=function(){return this.m_preadmitPNs;
};
RehabRegulatoryComponentO1.prototype.setPostadmitPFs=function(postadmitPFs){this.m_postadmitPFs=postadmitPFs;
};
RehabRegulatoryComponentO1.prototype.getPostadmitPFs=function(){return this.m_postadmitPFs;
};
RehabRegulatoryComponentO1.prototype.setPostadmitPNs=function(postadmitPNs){this.m_postadmitPNs=postadmitPNs;
};
RehabRegulatoryComponentO1.prototype.getPostadmitPNs=function(){return this.m_postadmitPNs;
};
RehabRegulatoryComponentO1.prototype.setPostadmitEvents=function(postadmitEvents){this.m_postadmitEvents=postadmitEvents;
};
RehabRegulatoryComponentO1.prototype.getPostadmitEvents=function(){return this.m_postadmitEvents;
};
RehabRegulatoryComponentO1.prototype.setOpocPFs=function(opocPFs){this.m_opocPFs=opocPFs;
};
RehabRegulatoryComponentO1.prototype.getOpocPFs=function(){return this.m_opocPFs;
};
RehabRegulatoryComponentO1.prototype.setOpocPNs=function(opocPNs){this.m_opocPNs=opocPNs;
};
RehabRegulatoryComponentO1.prototype.getOpocPNs=function(){return this.m_opocPNs;
};
RehabRegulatoryComponentO1.prototype.setRestraintCatalogCodes=function(catalogCodes){this.m_restraintCatalogCodes=catalogCodes;
};
RehabRegulatoryComponentO1.prototype.getRestraintCatalogCodes=function(){return this.m_restraintCatalogCodes;
};
RehabRegulatoryComponentO1.prototype.setRestraintEventCodes=function(eventCodes){this.m_restraintEventCodes=eventCodes;
};
RehabRegulatoryComponentO1.prototype.getRestraintEventCodes=function(){return this.m_restraintEventCodes;
};
RehabRegulatoryComponentO1.prototype.setOTVisitTypeCodes=function(otVisitTypeCodes){this.m_otVisitTypeCodes=otVisitTypeCodes;
};
RehabRegulatoryComponentO1.prototype.getOTVisitTypeCodes=function(){return this.m_otVisitTypeCodes;
};
RehabRegulatoryComponentO1.prototype.setPTVisitTypeCodes=function(ptVisitTypeCodes){this.m_ptVisitTypeCodes=ptVisitTypeCodes;
};
RehabRegulatoryComponentO1.prototype.getPTVisitTypeCodes=function(){return this.m_ptVisitTypeCodes;
};
RehabRegulatoryComponentO1.prototype.setSLPVisitTypeCodes=function(slpVisitTypeCodes){this.m_slpVisitTypeCodes=slpVisitTypeCodes;
};
RehabRegulatoryComponentO1.prototype.getSLPVisitTypeCodes=function(){return this.m_slpVisitTypeCodes;
};
RehabRegulatoryComponentO1.prototype.setCancelReasons=function(cancelReasons){this.m_cancelReasons=cancelReasons;
};
RehabRegulatoryComponentO1.prototype.getCancelReasons=function(){return this.m_cancelReasons;
};
RehabRegulatoryComponentO1.prototype.setMissedOTEvents=function(missedOTEvents){this.m_missedOTEvents=missedOTEvents;
};
RehabRegulatoryComponentO1.prototype.getMissedOTEvents=function(){return this.m_missedOTEvents;
};
RehabRegulatoryComponentO1.prototype.setMissedPTEvents=function(missedPTEvents){this.m_missedPTEvents=missedPTEvents;
};
RehabRegulatoryComponentO1.prototype.getMissedPTEvents=function(){return this.m_missedPTEvents;
};
RehabRegulatoryComponentO1.prototype.setMissedSLPEvents=function(missedSLPEvents){this.m_missedSLPEvents=missedSLPEvents;
};
RehabRegulatoryComponentO1.prototype.getMissedSLPEvents=function(){return this.m_missedSLPEvents;
};
RehabRegulatoryComponentO1.prototype.setOTCertLetterPFs=function(otCertLetterPFs){this.m_otCertLetterPFs=otCertLetterPFs;
};
RehabRegulatoryComponentO1.prototype.getOTCertLetterPFs=function(){return this.m_otCertLetterPFs;
};
RehabRegulatoryComponentO1.prototype.setPTCertLetterPFs=function(ptCertLetterPFs){this.m_ptCertLetterPFs=ptCertLetterPFs;
};
RehabRegulatoryComponentO1.prototype.getPTCertLetterPFs=function(){return this.m_ptCertLetterPFs;
};
RehabRegulatoryComponentO1.prototype.setSLPCertLetterPFs=function(slpCertLetterPFs){this.m_slpCertLetterPFs=slpCertLetterPFs;
};
RehabRegulatoryComponentO1.prototype.getSLPCertLetterPFs=function(){return this.m_slpCertLetterPFs;
};
RehabRegulatoryComponentO1.prototype.setOTCertLetterPNs=function(otCertLetterPNs){this.m_otCertLetterPNs=otCertLetterPNs;
};
RehabRegulatoryComponentO1.prototype.getOTCertLetterPNs=function(){return this.m_otCertLetterPNs;
};
RehabRegulatoryComponentO1.prototype.setPTCertLetterPNs=function(ptCertLetterPNs){this.m_ptCertLetterPNs=ptCertLetterPNs;
};
RehabRegulatoryComponentO1.prototype.getPTCertLetterPNs=function(){return this.m_ptCertLetterPNs;
};
RehabRegulatoryComponentO1.prototype.setSLPCertLetterPNs=function(slpCertLetterPNs){this.m_slpCertLetterPNs=slpCertLetterPNs;
};
RehabRegulatoryComponentO1.prototype.getSLPCertLetterPNs=function(){return this.m_slpCertLetterPNs;
};
RehabRegulatoryComponentO1.prototype.setOTCertLetterDue=function(otCertLetterDue){this.m_otCertLetterDue=otCertLetterDue;
};
RehabRegulatoryComponentO1.prototype.getOTCertLetterDue=function(){return this.m_otCertLetterDue;
};
RehabRegulatoryComponentO1.prototype.setPTCertLetterDue=function(ptCertLetterDue){this.m_ptCertLetterDue=ptCertLetterDue;
};
RehabRegulatoryComponentO1.prototype.getPTCertLetterDue=function(){return this.m_ptCertLetterDue;
};
RehabRegulatoryComponentO1.prototype.setSLPCertLetterDue=function(slpCertLetterDue){this.m_slpCertLetterDue=slpCertLetterDue;
};
RehabRegulatoryComponentO1.prototype.getSLPCertLetterDue=function(){return this.m_slpCertLetterDue;
};
RehabRegulatoryComponentO1.prototype.setPTPrimaryLimitation=function(ptPrimaryLimitation){this.m_ptPrimaryLimitation=ptPrimaryLimitation;
};
RehabRegulatoryComponentO1.prototype.getPTPrimaryLimitation=function(){return this.m_ptPrimaryLimitation;
};
RehabRegulatoryComponentO1.prototype.setOTPrimaryLimitation=function(otPrimaryLimitation){this.m_otPrimaryLimitation=otPrimaryLimitation;
};
RehabRegulatoryComponentO1.prototype.getOTPrimaryLimitation=function(){return this.m_otPrimaryLimitation;
};
RehabRegulatoryComponentO1.prototype.setSLPPrimaryLimitation=function(slpPrimaryLimitation){this.m_slpPrimaryLimitation=slpPrimaryLimitation;
};
RehabRegulatoryComponentO1.prototype.getSLPPrimaryLimitation=function(){return this.m_slpPrimaryLimitation;
};
RehabRegulatoryComponentO1.prototype.setOTFuncMod=function(otFuncMod){this.m_otFuncMod=otFuncMod;
};
RehabRegulatoryComponentO1.prototype.getOTFuncMod=function(){return this.m_otFuncMod;
};
RehabRegulatoryComponentO1.prototype.setPTFuncMod=function(ptFuncMod){this.m_ptFuncMod=ptFuncMod;
};
RehabRegulatoryComponentO1.prototype.getPTFuncMod=function(){return this.m_ptFuncMod;
};
RehabRegulatoryComponentO1.prototype.setSLPFuncMod=function(slpFuncMod){this.m_slpFuncMod=slpFuncMod;
};
RehabRegulatoryComponentO1.prototype.getSLPFuncMod=function(){return this.m_slpFuncMod;
};
RehabRegulatoryComponentO1.prototype.setAdditionalEventsLabel=function(additionalEventsLabel){this.m_additionalEventsLabel=additionalEventsLabel;
};
RehabRegulatoryComponentO1.prototype.getAdditionalEventsLabel=function(){return this.m_additionalEventsLabel;
};
RehabRegulatoryComponentO1.prototype.setAdditionalEvents=function(additionalEvents){this.m_additionalEvents=additionalEvents;
};
RehabRegulatoryComponentO1.prototype.getAdditionalEvents=function(){return this.m_additionalEvents;
};
RehabRegulatoryComponentO1.prototype.loadFilterMappings=function(){this.addFilterMappingObject("MP_REHAB_PREADMIT_PF",{setFunction:this.setPreadmitPFs,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_PREADMIT_PN",{setFunction:this.setPreadmitPNs,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_POSTADMIT_PF",{setFunction:this.setPostadmitPFs,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_POSTADMIT_PN",{setFunction:this.setPostadmitPNs,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_POSTADMIT_EVENT",{setFunction:this.setPostadmitEvents,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_INDIV_POC_PF",{setFunction:this.setOpocPFs,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_INDIV_POC_PN",{setFunction:this.setOpocPNs,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_RESTRAINT",{setFunction:this.setRestraintCatalogCodes,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_RESTRAINT_TYPE",{setFunction:this.setRestraintEventCodes,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_OT_VISIT",{setFunction:this.setOTVisitTypeCodes,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_PT_VISIT",{setFunction:this.setPTVisitTypeCodes,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_SLP_VISIT",{setFunction:this.setSLPVisitTypeCodes,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_CANCEL_REASONS",{setFunction:this.setCancelReasons,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_MISSED_OT",{setFunction:this.setMissedOTEvents,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_MISSED_PT",{setFunction:this.setMissedPTEvents,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_MISSED_SLP",{setFunction:this.setMissedSLPEvents,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_OP_CERT_OT_PF",{setFunction:this.setOTCertLetterPFs,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_OP_CERT_OT_PN",{setFunction:this.setOTCertLetterPNs,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_OP_CERT_PT_PF",{setFunction:this.setPTCertLetterPFs,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_OP_CERT_PT_PN",{setFunction:this.setPTCertLetterPNs,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_OP_CERT_SLP_PF",{setFunction:this.setSLPCertLetterPFs,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_OP_CERT_SLP_PN",{setFunction:this.setSLPCertLetterPNs,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_OP_CERT_OT_DUE",{setFunction:this.setOTCertLetterDue,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_OP_CERT_PT_DUE",{setFunction:this.setPTCertLetterDue,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_OP_CERT_SLP_DUE",{setFunction:this.setSLPCertLetterDue,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_OT_PRIM_LIMIT",{setFunction:this.setOTPrimaryLimitation,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_PT_PRIM_LIMIT",{setFunction:this.setPTPrimaryLimitation,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_SLP_PRIM_LIMIT",{setFunction:this.setSLPPrimaryLimitation,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_OT_FUNC_MOD",{setFunction:this.setOTFuncMod,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_PT_FUNC_MOD",{setFunction:this.setPTFuncMod,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_SLP_FUNC_MOD",{setFunction:this.setSLPFuncMod,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("MP_REHAB_ADDITIONAL_LABEL",{setFunction:this.setAdditionalEventsLabel,type:"STRING",field:"FREETEXT_DESC"});
this.addFilterMappingObject("MP_REHAB_ADDITIONAL",{setFunction:this.setAdditionalEvents,type:"ARRAY",field:"PARENT_ENTITY_ID"});
};
RehabRegulatoryComponentO1.prototype.retrieveComponentData=function(){var self=this;
var criterion=this.getCriterion();
i18n.discernabu.RehabRegulatoryComponentO1.ADDITIONAL_EVENTS=this.getAdditionalEventsLabel();
var paramArray=["^MINE^",this.getCriterion().person_id+".0",this.getCriterion().encntr_id+".0",MP_Util.CreateParamArray(this.getPreadmitPFs(),1),MP_Util.CreateParamArray(this.getPreadmitPNs(),1),MP_Util.CreateParamArray(this.getPostadmitPFs(),1),MP_Util.CreateParamArray(this.getPostadmitPNs(),1),MP_Util.CreateParamArray(this.getPostadmitEvents(),1),MP_Util.CreateParamArray(this.getOpocPFs(),1),MP_Util.CreateParamArray(this.getOpocPNs(),1),MP_Util.CreateParamArray(this.getRestraintCatalogCodes(),1),MP_Util.CreateParamArray(this.getRestraintEventCodes(),1),MP_Util.CreateParamArray(this.getOTVisitTypeCodes(),1),MP_Util.CreateParamArray(this.getPTVisitTypeCodes(),1),MP_Util.CreateParamArray(this.getSLPVisitTypeCodes(),1),MP_Util.CreateParamArray(this.getCancelReasons(),1),MP_Util.CreateParamArray(this.getMissedOTEvents(),1),MP_Util.CreateParamArray(this.getMissedPTEvents(),1),MP_Util.CreateParamArray(this.getMissedSLPEvents(),1),MP_Util.CreateParamArray(this.getOTCertLetterPFs(),1),MP_Util.CreateParamArray(this.getOTCertLetterPNs(),1),MP_Util.CreateParamArray(this.getOTCertLetterDue(),1),MP_Util.CreateParamArray(this.getPTCertLetterPFs(),1),MP_Util.CreateParamArray(this.getPTCertLetterPNs(),1),MP_Util.CreateParamArray(this.getPTCertLetterDue(),1),MP_Util.CreateParamArray(this.getSLPCertLetterPFs(),1),MP_Util.CreateParamArray(this.getSLPCertLetterPNs(),1),MP_Util.CreateParamArray(this.getSLPCertLetterDue(),1),MP_Util.CreateParamArray(this.getOTPrimaryLimitation(),1),MP_Util.CreateParamArray(this.getPTPrimaryLimitation(),1),MP_Util.CreateParamArray(this.getSLPPrimaryLimitation(),1),MP_Util.CreateParamArray(this.getOTFuncMod(),1),MP_Util.CreateParamArray(this.getPTFuncMod(),1),MP_Util.CreateParamArray(this.getSLPFuncMod(),1),MP_Util.CreateParamArray(this.getAdditionalEvents(),1)];
MP_Core.XMLCclRequestWrapper(this,"lhc_rehab_regulatory_driver",paramArray,true);
};
RehabRegulatoryComponentO1.prototype.assembleHTML=function(header,dataObj,isTopLevelElem){var container="<div class='rehabr-container'>";
var lightStripe=" rehabr-light-striped ";
var darkStripe=" rehabr-dark-striped ";
var dlElem=" rehabr-list-elem ";
var listText=" rehabr-list-text ";
container+=isTopLevelElem?"<h1 class='rehabr-header'><span>"+i18n.discernabu.RehabRegulatoryComponentO1[header]+"</span></h1>":"<h2 class='rehabr-subheader'><span>"+i18n.discernabu.RehabRegulatoryComponentO1[header]+"</span></h2>";
var recordCounter=0;
var eventCounter=0;
if(dataObj instanceof Array&&dataObj.length>0){container+="<dl class='rehabr-list'><dt class='rehabr-hidden-name'>"+i18n.discernabu.RehabRegulatoryComponentO1[header]+"</dt>";
for(var dataIndex=0,arrLength=dataObj.length;
dataIndex<arrLength;
dataIndex++){for(recordKey in dataObj[dataIndex]){var record=dataObj[dataIndex][recordKey];
if(typeof dataObj[dataIndex].EVENT_LABEL!=="undefined"){container+=eventCounter%2!==1?"<dd class='"+lightStripe+dlElem+"'>":"<dd class='"+darkStripe+dlElem+"'>";
if(typeof record==="string"&&record.length===0){container+="--&nbsp</dd>";
}else{container+=record+"</dd>";
}}else{if(typeof record!="function"){container+=recordCounter%2!==1?"<dd class='"+lightStripe+"'><p class='"+listText+"'>":"<dd class='"+darkStripe+"'><p class='"+listText+"'>";
if(typeof record==="string"&&record.length===0){container+="--&nbsp</p></dd>";
}else{container+=record+"</p></dd>";
}recordCounter++;
}}}eventCounter++;
}container+="</dl>";
}else{container+="<dl class=rehabr-list>";
for(record in dataObj){if(dataObj.hasOwnProperty(record)&&typeof dataObj[record]!="function"){if(typeof dataObj[record]==="object"){container+="<dt class='rehabr-hidden-name'>"+record+"</dt>";
container+="<dd>"+this.assembleHTML(record,dataObj[record],false)+"</dd>";
}else{container+=recordCounter%2!==1?"<dt class='"+lightStripe+dlElem+"'>"+i18n.discernabu.RehabRegulatoryComponentO1[record]+"</dt>":"<dt class='"+darkStripe+dlElem+"'>"+i18n.discernabu.RehabRegulatoryComponentO1[record]+"</dt>";
container+=recordCounter%2!==1?"<dd class='"+lightStripe+dlElem+"'>":"<dd class='"+darkStripe+dlElem+"'>";
if(typeof dataObj[record]==="string"&&dataObj[record].length===0){container+="--&nbsp</dd>";
}else{container+=dataObj[record]+"</dd>";
}}recordCounter++;
}}container+="</dl>";
}return container+"</div>";
};
RehabRegulatoryComponentO1.prototype.renderComponent=function(reply){var compID=this.getComponentId();
var bodyHTML="<div id='rehabr' class='content-body'>";
try{var renderTimer=MP_Util.CreateTimer(this.getComponentRenderTimerName(),this.getCriterion().category_mean);
for(record in reply){if(record!=="STATUS_DATA"){if(record==="ADDITIONAL_EVENTS"){if(reply[record].length>0){bodyHTML+=this.assembleHTML(record,reply[record],true);
}}else{bodyHTML+=this.assembleHTML(record,reply[record],true);
}}}bodyHTML+="</div>";
MP_Util.Doc.FinalizeComponent(bodyHTML,this,"");
}catch(err){MP_Util.LogJSError(err,this,"master-components.js","handleLoad");
if(renderTimer){renderTimer.Abort();
renderTimer=null;
}}finally{if(renderTimer){renderTimer.Stop();
}}};
MP_Util.setObjectDefinitionMapping("MP_VB_REHAB_REGULATORY",RehabRegulatoryComponentO1);
