function RespiratoryComponentStyle(){this.initByNamespace("resp");
}RespiratoryComponentStyle.inherits(ComponentStyle);
function RespiratoryComponent(criterion){this.setCriterion(criterion);
this.setIncludeLineNumber(false);
this.setStyles(new RespiratoryComponentStyle());
this.setComponentLoadTimerName("USR:MPG.RESPIRATORY.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.RESPIRATORY.O1 - render component");
RespiratoryComponent.method("InsertData",function(){CERN_RESPIRATORY_O1.callRespiratoryScript(this);
});
RespiratoryComponent.method("HandleSuccess",function(recordData){CERN_RESPIRATORY_O1.RenderComponent(this,recordData);
});
}RespiratoryComponent.inherits(MPageComponent);
var CERN_RESPIRATORY_O1=function(){return{callRespiratoryScript:function(component){var criterion=component.getCriterion();
var encntrOption=(component.getScope()===1?"0.0":(criterion.encntr_id+".0"));
var lookBackUnits=(component.getLookbackUnits()?component.getLookbackUnits():"0");
var lookBackUnitTypeFlag=component.getLookbackUnitTypeFlag();
var groups=component.getGroups();
var group=null;
var groupName="";
var nGrpLen=(groups)?groups.length:0;
var sendAr=[];
var sEventSetsArray=null;
this.sMeasAssessCds="0.0";
this.sArtBloodGasCds="0.0";
this.sVenBloodGasCds="0.0";
this.sCapBloodGasCds="0.0";
this.sSettingsCds="0.0";
this.sWeanParamCds="0.0";
this.sAlarmSettingsCds="0.0";
var i;
if(groups&&nGrpLen>0){for(i=nGrpLen;
i--;
){group=groups[i];
sEventSetsArray=MP_Util.CreateParamArray(group.getEventSets(),1);
groupName=group.getGroupName();
switch(groupName){case"MP_VENT_MEAS":case"MP_VENT_MEAS_OV":this.sMeasAssessCds=sEventSetsArray;
break;
case"MP_VENT_WEAN":case"MP_VENT_WEAN_OV":this.sWeanParamCds=sEventSetsArray;
break;
case"RESP_OTHER":this.sArtBloodGasCds=sEventSetsArray;
break;
case"MP_VENT_CBG":this.sCapBloodGasCds=sEventSetsArray;
break;
case"MP_VENT_VBG":this.sVenBloodGasCds=sEventSetsArray;
break;
case"SETTINGS":this.sSettingsCds=sEventSetsArray;
break;
case"MP_VENT_ALARM":case"MP_VENT_ALARM_OV":this.sAlarmSettingsCds=sEventSetsArray;
break;
}}}sendAr.push("^MINE^",criterion.person_id+".0",encntrOption,lookBackUnits,lookBackUnitTypeFlag,this.sSettingsCds,this.sMeasAssessCds,this.sAlarmSettingsCds,this.sWeanParamCds,this.sArtBloodGasCds,this.sVenBloodGasCds,this.sCapBloodGasCds,criterion.ppr_cd+".0",criterion.provider_id+".0");
MP_Core.XMLCclRequestWrapper(component,"MP_GET_OXY_VENT",sendAr,true);
},RenderComponent:function(component,recordData){try{function getStatusInd(status){var ind="";
if(status==="MODIFIED"||status==="ALTERED"){ind="<span class='res-modified'>&nbsp;</span>";
}return ind;
}function eventViewerLink(personID,encntrID,eventID,result){var params=[personID,encntrID,eventID,'"EVENT"'];
return"<a onclick='MP_Util.LaunchClinNoteViewer("+params.join(",")+"); return false;' href='#'>"+result+"</a>";
}function createBgContent(bgItem,personId){var bgHTML=[];
var curBgHdr=[];
var curBgCont=[];
var colMask="";
var bgResCnt=bgItem.length;
var curBgItem=null;
var curBgVal="";
var i;
if(1<=bgResCnt&&bgResCnt<=6){colMask="resp-"+bgResCnt+"col";
}for(i=0;
i<bgResCnt;
i++){curBgItem=bgItem[i];
if(curBgItem.VALUE){curBgVal=eventViewerLink(personId,0,curBgItem.ID,curBgItem.VALUE);
bloodGasesResCntAr=bloodGasesResCntAr+1;
}else{curBgVal="--";
}curBgHdr.push("<th class='resp-bg-res'>",curBgItem.NAME,"</th>");
curBgCont.push("<td class='resp-bg-res'><span class='res-value'>",curBgVal,"</span>",getStatusInd(curBgItem.STATUS),"</td>");
}return bgHTML.concat(["<table class='resp-bg-table ",colMask,"'><tr class='hdr'>"],curBgHdr,["</tr><tr>"],curBgCont,["</tr></table>"]).join("");
}function createSubSection(dataObj,referenceName){var ssHTMLAr=[];
var ssTempHTMLAr=[];
var ssDataElem=null;
var ssDataDtTm="";
var ssDataDtTmHvr="";
var ssDataValue="";
var ssDataValueHVR="";
var numResults=0;
var sortFunc=function(a,b){return a.VALUE_SEQ-b.VALUE_SEQ;
};
if(dataObj){dataObj.sort(sortFunc);
numResults=dataObj.length;
}var i;
var sSubSecTglClass="";
itemRowCnt+=(numResults>0?numResults:1);
if(numResults>0){for(i=0;
i<numResults;
i++){ssDataElem=dataObj[i];
ssDataDtTm=df.formatISO8601(ssDataElem.EVENT_END_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
ssDataDtTmHvr=df.formatISO8601(ssDataElem.EVENT_END_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
if(ssDataElem.CLASSIFICATION&&ssDataElem.CLASSIFICATION==="DATE_VALUE"){ssDataValue=df.formatISO8601(ssDataElem.VALUE,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
ssDataValueHVR=df.formatISO8601(ssDataElem.VALUE,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
}else{ssDataValue=ssDataElem.VALUE;
ssDataValueHVR=ssDataElem.VALUE;
}ssTempHTMLAr.push("<dl class='resp-info'>","<dt><span >",ssDataElem.NAME,":</span></dt>","<dd><span class='res-value'>",eventViewerLink(personId,ssDataElem.ENCOUNTER_ID,ssDataElem.EVENT_ID,ssDataValue),"</span>",getStatusInd(ssDataElem.STATUS_MEANING),"</dd>","<dt class='resp-vent-hide'>",i18nResp.DATE_TIME,"</dt>","<dd class='resp-last-child'><span class='date-time'>",ssDataDtTm,"</span></dd>","</dl>");
}}if(numResults===0){sSubSecTglClass="closed";
}ssHTMLAr.push("<div class='sub-sec ",sSubSecTglClass,"'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='",i18nResp.HIDE_SECTION,"'>-</span><span class='sub-sec-title resp-subsec-title'>",i18nResp[referenceName]," (",numResults,")","</span></h3><div class='sub-sec-content'><div>",ssTempHTMLAr.join(""),"</div></div></div>");
return ssHTMLAr.join("");
}var criterion=component.getCriterion();
var groups=component.getGroups();
var personId=criterion.person_id;
var bloodGasListAr=["LATEST_BLOOD_GAS_ARTERIAL_RESULTS","PREVIOUS_BLOOD_GAS_ARTERIAL_RESULTS"];
var bloodGasListVen=["LATEST_BLOOD_GAS_VENOUS_RESULTS","PREVIOUS_BLOOD_GAS_VENOUS_RESULTS"];
var bloodGasListCp=["LATEST_BLOOD_GAS_CAPILLARY_RESULTS","PREVIOUS_BLOOD_GAS_CAPILLARY_RESULTS"];
var abgObj=recordData.ARTBLOOD_GASES;
var vbgObj=recordData.VENBLOOD_GASES;
var cbgObj=recordData.CAPBLOOD_GASES;
var bloodGasesResCntAr=0;
var bloodGasesCntAr=(abgObj)?abgObj.length:0;
var bloodGasesCntVn=(vbgObj)?vbgObj.length:0;
var bloodGasesCntCp=(cbgObj)?cbgObj.length:0;
var bloodGasAr=[];
var bloodGasVn=[];
var bloodGasCp=[];
var curAbg=null;
var curVbg=null;
var curCbg=null;
var sHTML="";
var htmlAr=[];
var df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
var i18nResp=i18n.discernabu.respiratory_o1;
var itemRowCnt=0;
var i;
var sSubSecBGTglClass="";
if(this.sSettingsCds!=="0.0"){htmlAr.push(createSubSection(recordData.SETTINGS,"SETTINGS"));
}if(this.sMeasAssessCds!=="0.0"){htmlAr.push(createSubSection(recordData.MEAS_ASSESS,"MEASUREMENTS_ASSESSMENTS"));
}if(this.sAlarmSettingsCds!=="0.0"){htmlAr.push(createSubSection(recordData.ALARM_SETTINGS,"ALARM_SETTINGS"));
}if(this.sWeanParamCds!=="0.0"){htmlAr.push(createSubSection(recordData.WEANING_PARAMS,"WEANING_PARAMETERS"));
}if(this.sArtBloodGasCds!=="0.0"){itemRowCnt+=(bloodGasesCntAr>0?bloodGasesCntAr:1);
if(bloodGasesCntAr>0){for(i=0;
i<bloodGasesCntAr;
i++){curAbg=abgObj[i];
if(curAbg.EFFECTIVE_DT_TM!==""){bloodGasAr.push("<div class='resp-blood-gas-sub-sec'>","<h4><span class='resp-bg-title'>",i18nResp[bloodGasListAr[i]],"</span>","<span class='resp-bg-dt'>",df.formatISO8601(curAbg.EFFECTIVE_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR),"</span></h4>",createBgContent(curAbg.ABG_DATA,personId),"</div>");
}}}sSubSecBGTglClass="";
if(bloodGasesCntAr===0){sSubSecBGTglClass="closed";
}htmlAr.push("<div class='sub-sec ",sSubSecBGTglClass,"'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='",i18nResp.HIDE_SECTION,"'>-</span><span class='sub-sec-title resp-subsec-title'>",i18nResp.ART_BLOOD_GASES," (",bloodGasesResCntAr,")","</span></h3><div class='sub-sec-content'><div>",bloodGasAr.join(""),"</div></div></div>");
bloodGasesResCntAr=0;
}if(this.sVenBloodGasCds!=="0.0"){itemRowCnt+=(bloodGasesCntVn>0?bloodGasesCntVn:1);
if(bloodGasesCntVn>0){for(i=0;
i<bloodGasesCntVn;
i++){curVbg=vbgObj[i];
if(curVbg.EFFECTIVE_DT_TM!==""){bloodGasVn.push("<div class='resp-blood-gas-sub-sec'>","<h4><span class='resp-bg-title'>",i18nResp[bloodGasListVen[i]],"</span>","<span class='resp-bg-dt'>",df.formatISO8601(curVbg.EFFECTIVE_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR),"</span></h4>",createBgContent(curVbg.VBG_DATA,personId),"</div>");
}}}sSubSecBGTglClass="";
if(bloodGasesCntVn===0){sSubSecBGTglClass="closed";
}htmlAr.push("<div class='sub-sec ",sSubSecBGTglClass,"'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='",i18nResp.HIDE_SECTION,"'>-</span><span class='sub-sec-title resp-subsec-title'>",i18nResp.VEN_BLOOD_GASES," (",bloodGasesResCntAr,")","</span></h3><div class='sub-sec-content'><div>",bloodGasVn.join(""),"</div></div></div>");
bloodGasesResCntAr=0;
}if(this.sCapBloodGasCds!=="0.0"){itemRowCnt+=(bloodGasesCntCp>0?bloodGasesCntCp:1);
if(bloodGasesCntCp>0){for(i=0;
i<bloodGasesCntCp;
i++){curCbg=cbgObj[i];
if(curCbg.EFFECTIVE_DT_TM!==""){bloodGasCp.push("<div class='resp-blood-gas-sub-sec'>","<h4><span class='resp-bg-title'>",i18nResp[bloodGasListCp[i]],"</span>","<span class='resp-bg-dt'>",df.formatISO8601(curCbg.EFFECTIVE_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR),"</span></h4>",createBgContent(curCbg.CBG_DATA,personId),"</div>");
}}}sSubSecBGTglClass="";
if(bloodGasesCntCp===0){sSubSecBGTglClass="closed";
}htmlAr.push("<div class='sub-sec ",sSubSecBGTglClass,"'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='",i18nResp.HIDE_SECTION,"'>-</span><span class='sub-sec-title resp-subsec-title'>",i18nResp.CAP_BLOOD_GASES," (",bloodGasesResCntAr,")","</span></h3><div class='sub-sec-content'><div>",bloodGasCp.join(""),"</div></div></div>");
bloodGasesResCntAr=0;
}if(this.sArtBloodGasCds!=="0.0"||this.sVenBloodGasCds!=="0.0"||this.sCapBloodGasCds!=="0.0"){htmlAr.push("<div><p class='resp-disclaimer'>",i18nResp.RESPIRATORY_DISCLAIMER,"</p></div>");
}sHTML="<div class='"+MP_Util.GetContentClass(component,itemRowCnt)+"'>"+htmlAr.join("")+"</div>";
MP_Util.Doc.FinalizeComponent(sHTML,component,"");
}catch(err){throw (err);
}finally{}}};
}();
