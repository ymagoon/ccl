function RespAssessmentsComponentStyle(){this.initByNamespace("resa");
}RespAssessmentsComponentStyle.inherits(ComponentStyle);
function RespAssessmentsComponent(criterion){this.setCriterion(criterion);
this.setStyles(new RespAssessmentsComponentStyle());
this.setComponentLoadTimerName("USR:MPG.RESP_ASSESSMENTS.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.RESP_ASSESSMENTS.O1 - render component");
this.setIncludeLineNumber(false);
RespAssessmentsComponent.method("InsertData",function(){CERN_RESP_ASSESSMENT_O1.GetRespAssessmentData(this);
});
RespAssessmentsComponent.method("HandleSuccess",function(recordData){CERN_RESP_ASSESSMENT_O1.RenderRespAssessment(this,recordData);
});
}RespAssessmentsComponent.inherits(MPageComponent);
var CERN_RESP_ASSESSMENT_O1=function(){return{RenderRespAssessment:function(component,recordData){var countText="",sHTML="",jsHTML=[],nameSpace=component.getStyles().getNameSpace();
var orgnzdAGB_ar=null;
var i=0;
var criterion=component.getCriterion();
var personid=criterion.person_id+".0";
var df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
var codeArray=MP_Util.LoadCodeListJSON(recordData.CODES);
var abgObj=recordData.ABGS;
var abgLen=abgObj.length;
var latestAbgHTML="";
var prevAbgHTML="";
var latestAbgDt="";
var prevAbgDt="";
sHTML+="<hr />";
var o2_therapy_cnt=recordData.O2_THERAPY_QUAL;
if(o2_therapy_cnt>0){jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='",i18n.HIDE_SECTION,"'>-</span><span class='sub-sec-title'>",i18n.O2_THERAPY_TITRATION,"</span></h3><div class='sub-sec-content'><div class='",MP_Util.GetContentClass(component,o2_therapy_cnt),"'><h3 class='info-hd'><span>",i18n.O2_THERAPY_TITRATION_DETAILS,"</span></h3>");
for(i=0;
i<o2_therapy_cnt;
i++){var dataElem=recordData.O2_THERAPY[i];
var statusObj=MP_Util.GetValueFromArray(dataElem.STATUS_CD,codeArray);
var statusMean=statusObj.meaning;
var statusDisp=statusObj.display;
var resultDtTm=new Date();
resultDtTm.setISO8601(dataElem.EVENT_END_DT_TM);
var dataDtTm=df.format(resultDtTm,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
var hvrDataDtTm=df.format(resultDtTm,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
jsHTML.push("<dl class='",nameSpace,"-info'><dt><span>",dataElem.NAME,":</span></dt><dd><span>",EventViewerLink(personid,dataElem.ENCOUNTER_ID,dataElem.EVENT_ID,dataElem.VALUE),"</span>",getStatusInd(statusMean),"</dd><dd><span class='date-time'>",dataDtTm,"</span></dd></dl>");
if(dataElem.VALUE!=="--"){jsHTML.push("<h4 class='det-hd'><span>",i18n.RESULT_DETAILS,"</span></h4><div class='hvr'><dl class='",nameSpace,"-det'><dt><span>",dataElem.NAME,":</span></dt><dd class='",nameSpace,"-det-name'><span>",dataElem.VALUE," ",dataElem.VALUE_UNITS,"</span></dd><dt><span>",i18n.RESULT_DT_TM,":</span></dt><dd><span>",hvrDataDtTm,"</span></dd><dt><span>",i18n.DOCUMENTED_BY,":</span></dt><dd class='",nameSpace,"-det-ord-by'><span>",dataElem.DOCUMENTED_BY,"</span></dd><dt><span>",i18n.STATUS,":</span></dt><dd class='",nameSpace,"-det-status'><span>",statusDisp,"</span></dd></dl></div>");
}}jsHTML.push("</div></div></div><hr />");
}if(abgLen>0){var curDf=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
var curAbg=abgObj[0];
latestAbgHTML=createAbgContent(curAbg,personid);
latestAbgDt="<span class='resa-abg-dt'>"+curDf.formatISO8601(curAbg.EVENT_END_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR)+"</span>";
}else{latestAbgHTML="<span class='res-none'>"+i18n.NO_RESULTS_FOUND+"</span>";
}jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='",i18n.HIDE_SECTION,"'>-</span><span class='sub-sec-title'>",i18n.LATEST_BLOOD_GAS_ARTERIAL_RESULTS,"</span>",latestAbgDt,"</h3><div class='sub-sec-content'>",latestAbgHTML,"</div></div>");
if(abgLen>1){var prevDf=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
var prevAbg=abgObj[1];
prevAbgHTML=createAbgContent(prevAbg,personid);
prevAbgDt="<span class='resa-abg-dt'>"+prevDf.formatISO8601(prevAbg.EVENT_END_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR)+"</span>";
}else{prevAbgHTML="<span class='res-none'>"+i18n.NO_RESULTS_FOUND+"</span>";
}jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='",i18n.HIDE_SECTION,"'>-</span><span class='sub-sec-title'>",i18n.PREVIOUS_BLOOD_GAS_ARTERIAL_RESULTS,"</span>",prevAbgDt,"</h3><div class='sub-sec-content'>",prevAbgHTML,"</div></div>");
jsHTML.push("<p class='resa-disclaim'>",i18n.RESPIRATORY_DISCLAIMER,"</p>");
var art_airway_cnt=recordData.ART_AIRWAY_QUAL;
if(art_airway_cnt>0){jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='",i18n.HIDE_SECTION,"'>-</span><span class='sub-sec-title'>",i18n.ARTIFICIAL_AIRWAY,"</span></h3><div class='sub-sec-content'><div class='",MP_Util.GetContentClass(component,art_airway_cnt),"'><h3 class='info-hd'><span>",i18n.ARTIFICIAL_AIRWAY_DETAILS,"</span></h3>");
for(i=0;
i<art_airway_cnt;
i++){var dataElem=recordData.ART_AIRWAY[i];
var statusObj=MP_Util.GetValueFromArray(dataElem.STATUS_CD,codeArray);
var statusMean=statusObj.meaning;
var statusDisp=statusObj.display;
var resultDtTm=new Date();
resultDtTm.setISO8601(dataElem.EVENT_END_DT_TM);
var dataDtTm=df.format(resultDtTm,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
var hvrDataDtTm=df.format(resultDtTm,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
jsHTML.push("<dl class='",nameSpace,"-info'><dt><span>",dataElem.NAME,":</span></dt><dd><span>",EventViewerLink(personid,dataElem.ENCOUNTER_ID,dataElem.EVENT_ID,dataElem.VALUE),"</span>",getStatusInd(statusMean),"</dd><dd><span class='date-time'>",dataDtTm,"</span></dd></dl>");
if(dataElem.VALUE!=="--"){jsHTML.push("<h4 class='det-hd'><span>",i18n.RESULT_DETAILS,"</span></h4><div class='hvr'><dl class='",nameSpace,"-det'><dt><span>",dataElem.NAME,":</span></dt><dd class='",nameSpace,"-det-name'><span>",dataElem.VALUE," ",dataElem.VALUE_UNITS,"</span></dd><dt><span>",i18n.RESULT_DT_TM,":</span></dt><dd><span>",hvrDataDtTm,"</span></dd><dt><span>",i18n.DOCUMENTED_BY,":</span></dt><dd class='",nameSpace,"-det-ord-by'><span>",dataElem.DOCUMENTED_BY,"</span></dd><dt><span>",i18n.STATUS,":</span></dt><dd class='",nameSpace,"-det-status'><span>",statusDisp,"</span></dd></dl></div>");
}}jsHTML.push("</div></div></div><hr />");
}var breath_sounds_cnt=recordData.BREATH_SOUNDS_QUAL;
jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='",i18n.HIDE_SECTION,"'>-</span><span class='sub-sec-title'>",i18n.BREATH_SOUNDS_ASSESSMENT,"</span></h3><div class='sub-sec-content'><div class='",MP_Util.GetContentClass(component,breath_sounds_cnt),"'><h3 class='info-hd'><span>",i18n.BREATH_SOUNDS_ASSESSMENT_DETAILS,"</span></h3>");
for(i=0;
i<breath_sounds_cnt;
i++){var dataElem=recordData.BREATH_SOUNDS[i];
var statusObj=MP_Util.GetValueFromArray(dataElem.STATUS_CD,codeArray);
var statusMean=statusObj.meaning;
var statusDisp=statusObj.display;
var resultDtTm=new Date();
resultDtTm.setISO8601(dataElem.EVENT_END_DT_TM);
var dataDtTm=df.format(resultDtTm,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
var hvrDataDtTm=df.format(resultDtTm,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
jsHTML.push("<dl class='",nameSpace,"-info'><dt><span>",dataElem.NAME,":</span></dt><dd><span>",EventViewerLink(personid,dataElem.ENCOUNTER_ID,dataElem.EVENT_ID,dataElem.VALUE),"</span>",getStatusInd(statusMean),"</dd><dd><span class='date-time'>",dataDtTm,"</span></dd></dl>");
if(dataElem.VALUE!="--"){jsHTML.push("<h4 class='det-hd'><span>",i18n.RESULT_DETAILS,"</span></h4><div class='hvr'><dl class='",nameSpace,"-det'><dt><span>",dataElem.NAME,":</span></dt><dd class='",nameSpace,"-det-name'><span>",dataElem.VALUE," ",dataElem.VALUE_UNITS,"</span></dd><dt><span>",i18n.RESULT_DT_TM,":</span></dt><dd><span>",hvrDataDtTm,"</span></dd><dt><span>",i18n.DOCUMENTED_BY,":</span></dt><dd class='",nameSpace,"-det-ord-by'><span>",dataElem.DOCUMENTED_BY,"</span></dd><dt><span>",i18n.STATUS,":</span></dt><dd class='",nameSpace,"-det-status'><span>",statusDisp,"</span></dd></dl></div>");
}}if(breath_sounds_cnt==0){jsHTML.push("<span class='res-none'>",i18n.NO_RESULTS_FOUND,"</span>");
}jsHTML.push("</div></div></div><hr />");
var resp_descr_cnt=recordData.RESP_DESCR_QUAL;
jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='",i18n.HIDE_SECTION,"'>-</span><span class='sub-sec-title'>",i18n.RESPIRATORY_DESCRIPTION,"</span></h3><div class='sub-sec-content'><div class='",MP_Util.GetContentClass(component,resp_descr_cnt),"'><h3 class='info-hd'><span>",i18n.RESPIRATORY_DESCRIPTION_DETAILS,"</span></h3>");
for(i=0;
i<resp_descr_cnt;
i++){var dataElem=recordData.RESP_DESCR[i];
var statusObj=MP_Util.GetValueFromArray(dataElem.STATUS_CD,codeArray);
var statusMean=statusObj.meaning;
var statusDisp=statusObj.display;
var resultDtTm=new Date();
resultDtTm.setISO8601(dataElem.EVENT_END_DT_TM);
var dataDtTm=df.format(resultDtTm,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
var hvrDataDtTm=df.format(resultDtTm,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
jsHTML.push("<dl class='",nameSpace,"-info'><dt><span>",dataElem.NAME,":</span></dt><dd><span>",EventViewerLink(personid,dataElem.ENCOUNTER_ID,dataElem.EVENT_ID,dataElem.VALUE),"</span>",getStatusInd(statusMean),"</dd><dd><span class='date-time'>",dataDtTm,"</span></dd></dl>");
if(dataElem.VALUE!="--"){jsHTML.push("<h4 class='det-hd'><span>",i18n.RESULT_DETAILS,"</span></h4><div class='hvr'><dl class='",nameSpace,"-det'><dt><span>",dataElem.NAME,":</span></dt><dd class='",nameSpace,"-det-name'><span>",dataElem.VALUE," ",dataElem.VALUE_UNITS,"</span></dd><dt><span>",i18n.RESULT_DT_TM,":</span></dt><dd><span>",hvrDataDtTm,"</span></dd><dt><span>",i18n.DOCUMENTED_BY,":</span></dt><dd class='",nameSpace,"-det-ord-by'><span>",dataElem.DOCUMENTED_BY,"</span></dd><dt><span>",i18n.STATUS,":</span></dt><dd class='",nameSpace,"-det-status'><span>",statusDisp,"</span></dd></dl></div>");
}}if(resp_descr_cnt==0){jsHTML.push("<span class='res-none'>",i18n.NO_RESULTS_FOUND,"</span>");
}jsHTML.push("</div></div></div><hr />");
countText="";
sHTML+=jsHTML.join("");
MP_Util.Doc.FinalizeComponent(sHTML,component,countText);
return;
},GetRespAssessmentData:function(component){var criterion=component.getCriterion();
var lookBackUnits=component.getLookbackUnits();
var lookBackUnitTypeFlag=component.getLookbackUnitTypeFlag();
var sABGCds="0.0";
var sArtificalAirwayCds="0.0";
var sOxygenTherapyCds="0.0";
var sBreathSoundsCds="0.0";
var sRespDescrCds="0.0";
var groups=component.getGroups();
var x1=(groups!=null)?groups.length:0;
for(var x=0;
x<x1;
x++){var group=groups[x];
if(group instanceof MPageEventSetGroup){grpName=group.getGroupName();
switch(grpName){case"MP_RESP_ABG":sABGCds=("value("+group.getEventSets()+")");
break;
case"MP_RESP_ART_AIR":sArtificalAirwayCds=("value("+group.getEventSets()+")");
break;
case"MP_RESP_O2_TIT":sOxygenTherapyCds=("value("+group.getEventSets()+")");
break;
case"MP_RESP_BRTH_SOUND":sBreathSoundsCds=("value("+group.getEventSets()+")");
break;
case"MP_RESP_DESC":sRespDescrCds=("value("+group.getEventSets()+")");
break;
}}}var sendArr=["^MINE^",criterion.person_id+".0",((component.getScope()==2)?criterion.encntr_id+".0":"0.0"),lookBackUnits,lookBackUnitTypeFlag,sABGCds,sArtificalAirwayCds,sOxygenTherapyCds,sBreathSoundsCds,sRespDescrCds,criterion.provider_id+".0",criterion.ppr_cd+".0",1];
MP_Core.XMLCclRequestWrapper(component,"MP_RETRIEVE_RESP_ASSESSMENTS",sendArr,true);
return;
}};
function EventViewerLink(personid,encntrid,eventid,result){var ar=[];
var params=[personid,encntrid,eventid,'"EVENT"'];
ar.push("<a onclick='MP_Util.LaunchClinNoteViewer(",params.join(","),"); return false;' href='#'>",result,"</a>");
return ar.join("");
}function createAbgContent(abgItem,persId){var abgHTML=[];
var curAbgHdr=[];
var curAbgCont=[];
var colMask="";
var curAbgData=abgItem.ABG_DATA;
var abgResCnt=curAbgData.length;
switch(abgResCnt){case 1:colMask="resa-1col";
break;
case 2:colMask="resa-2col";
break;
case 3:colMask="resa-3col";
break;
case 4:colMask="resa-4col";
break;
case 5:colMask="resa-5col";
break;
case 6:colMask="resa-6col";
break;
default:colMask="";
break;
}abgHTML.push("<table class='resa-abg-table ",colMask,"'><tr class='hdr'>");
for(var i=0;
i<abgResCnt;
i++){var curAbgItem=curAbgData[i];
var curAbgVal=curAbgItem.VALUE;
if(curAbgVal){curAbgVal=EventViewerLink(persId,curAbgItem.ENCOUNTER_ID,curAbgItem.EVENT_ID,curAbgItem.VALUE);
}else{curAbgVal="--";
}curAbgHdr.push("<th class='resa-abg-res'>",curAbgItem.NAME,"</th>");
curAbgCont.push("<td class='resa-abg-res'><span class='res-value'>",curAbgVal,"</span>",getStatusInd(curAbgItem.STATUS),"</td>");
}abgHTML=abgHTML.concat(curAbgHdr);
abgHTML.push("</tr><tr>");
abgHTML=abgHTML.concat(curAbgCont);
abgHTML.push("</tr></table>");
return abgHTML.join("");
}function getStatusInd(stat){var ind="";
if(stat==="MODIFIED"||stat==="ALTERED"){ind="<span class='res-modified'>&nbsp;</span>";
}return ind;
}}();