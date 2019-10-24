function ProceduralInfoComponentStyle(){this.initByNamespace("pri");
}ProceduralInfoComponentStyle.inherits(ComponentStyle);
function ProceduralInfoComponent(criterion){this.setCriterion(criterion);
this.setStyles(new ProceduralInfoComponentStyle());
this.setComponentLoadTimerName("USR:MPG.PROCEDURALINFO.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.PROCEDURALINFO.O1 - render component");
this.setIncludeLineNumber(false);
this.setScope(3);
this.setScopeHTML("<div id='priSc' class='sub-title-disp'></div>");
this.setResourceRequired(true);
this.m_periopCaseObj=null;
ProceduralInfoComponent.method("InsertData",function(){CERN_PROCEDURAL_INFO_O1.GetProceduralInfoTable(this);
});
ProceduralInfoComponent.method("HandleSuccess",function(recordData){CERN_PROCEDURAL_INFO_O1.RenderComponent(this,recordData);
});
ProceduralInfoComponent.method("RetrieveRequiredResources",function(){var caseResource=MP_Resources.getSharedResource("periopCaseIds");
var criterion=this.getCriterion();
var scriptParams=[];
if(caseResource){if(caseResource.isResourceAvailable()){this.loadCaseData(null,caseResource.getResourceData());
return;
}else{caseResource.retrieveSharedResourceData();
CERN_EventListener.addListener(this,"periopCaseInfoAvailable",this.loadCaseData,this);
}}else{scriptParams=["^MINE^",criterion.person_id+".0",criterion.encntr_id+".0",criterion.provider_id+".0",criterion.position_cd+".0",criterion.ppr_cd+".0",1];
caseResource=MP_Resources.createSharedResourceObj("periopCaseIds",this,"mp_get_cases",scriptParams,"periopCaseInfoAvailable");
if(caseResource){caseResource.retrieveSharedResourceData();
CERN_EventListener.addListener(this,"periopCaseInfoAvailable",this.loadCaseData,this);
}}});
ProceduralInfoComponent.method("loadCaseData",function(element,caseData){try{var casesJSON=JSON.parse(caseData).CASES_REC;
var periopCase=new MP_Core.PeriopCases();
var countDown=casesJSON.PROC_CNTDWN;
periopCase.setCaseID(casesJSON.CASE_ID);
periopCase.setDays(countDown.DAYS);
periopCase.setHours(countDown.HOURS);
periopCase.setMins(countDown.MINS);
periopCase.setCntdwnDscFlg(countDown.CNTDWN_DESC_FLAG);
this.m_periopCaseObj=periopCase;
CERN_PROCEDURAL_INFO_O1.GetProceduralInfoTable(this);
}catch(err){MP_Util.LogJSError(err,this,"procedural-info.js","loadCaseData");
var errMsg=[];
errMsg.push("<strong>",i18n.JS_ERROR,"</strong><br><ul><li>",i18n.MESSAGE,": ",err.message,"</li><li>",i18n.NAME,": ",err.name,"</li><li>",i18n.NUMBER,": ",(err.number&65535),"</li><li>",i18n.DESCRIPTION,": ",err.description,"</li></ul>");
MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(),errMsg.join("")),this,"");
}});
ProceduralInfoComponent.method("openTab",function(){var criterion=this.getCriterion();
var sParms="/PERSONID="+criterion.person_id+" /ENCNTRID="+criterion.encntr_id+" /FIRSTTAB=^"+this.getLink()+"+^";
APPLINK(0,criterion.executable,sParms);
this.InsertData();
});
}ProceduralInfoComponent.inherits(MPageComponent);
var CERN_PROCEDURAL_INFO_O1=function(){return{GetProceduralInfoTable:function(component){var ar=[];
var caseId=0;
var caseIdParam="";
var cntdwnDscFlg=0;
var cntDwnTxt="";
var days=0;
var hours=0;
var mins=0;
var procInfoI18n=null;
var periopCase=null;
var sendAr=[];
periopCase=component.m_periopCaseObj;
caseId=periopCase.getCaseID();
caseIdParam=(caseId)?caseId+".0":"0.0";
if(caseId>0){procInfoI18n=i18n.discernabu.procedural_info_o1;
days=periopCase.getDays();
hours=periopCase.getHours();
mins=periopCase.getMins();
cntdwnDscFlg=periopCase.getCntdwnDscFlg();
if(days>0){cntDwnTxt=days+" "+procInfoI18n.DAYS+" ";
}if(hours>0){cntDwnTxt=cntDwnTxt+hours+" "+procInfoI18n.HOURS+" ";
}cntDwnTxt=cntDwnTxt+mins+" "+procInfoI18n.MINS+" ";
if(cntDwnTxt!=""){switch(cntdwnDscFlg){case 1:cntDwnTxt=cntDwnTxt+procInfoI18n.UNTL_ANT_STRT_TM;
break;
case 2:cntDwnTxt=cntDwnTxt+procInfoI18n.PAST_ANT_STRT_TM;
break;
case 3:cntDwnTxt=cntDwnTxt+procInfoI18n.SINCE_SRUG_STRT_TM;
break;
case 4:cntDwnTxt=cntDwnTxt+procInfoI18n.SINCE_SURG_STOP_TM;
break;
}ar.push(cntDwnTxt);
}MP_Util.Doc.ReplaceSubTitleText(component,ar.join(""));
}if(caseId>0){sendAr.push("^MINE^",caseIdParam);
MP_Core.XMLCclRequestWrapper(component,"MP_GET_PROC_INFO",sendAr,true);
}else{MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()),component,"");
}},RenderComponent:function(component,recordData){var timerRenderComponent=MP_Util.CreateTimer(component.getComponentRenderTimerName());
try{var df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
var proc_info_i18n=i18n.discernabu.procedural_info_o1;
var criterion=component.getCriterion();
var periopCase=component.m_periopCaseObj;
var jsPriHTML=[];
var priHTML="";
var sSecondProcs=[];
var priLen=0;
var priObj=recordData.PROCEDURE;
priLen=priObj.length;
var secProcs=[];
var noResultIndicator="--";
for(var i=0;
i<priLen;
i++){var priItem=priObj[i];
if(priItem.PRIMARY_IND=="1"){var anesthesia=[];
var caseAnesth=recordData.CASE_ANESTHESIA_TYPE_DISP;
if(caseAnesth!=""){anesthesia.push(caseAnesth);
}else{for(var j=0;
j<priLen;
j++){var unique=true;
var curAnesth=priObj[j].ANESTHESIA_TYPE_DISP;
for(var k=0,n=anesthesia.length;
k<n;
k++){if(curAnesth.toUpperCase()==anesthesia[k].toUpperCase()){unique=false;
}}if(unique){if(anesthesia.length>0){anesthesia.push(", ");
}anesthesia.push(curAnesth);
}}if(anesthesia==""){anesthesia=noResultIndicator;
}}jsPriHTML.push("<dl class='pri-info'><dt><span>",proc_info_i18n.CASE_NUMBER,":</span></dt><dd class='pri-case-num'><span>",recordData.SURG_CASE_ID,"</span></dd></dl><dl class='pri-info'><dt><span>",proc_info_i18n.PRIMARY_PROC,":</span></dt><dd class='pri-name'><span>",priItem.NAME,"</span></dd></dl>");
var priMod=priItem.MODIFIERS;
if(priMod!=""){jsPriHTML.push("<dl class='pri-info'><dt><span>",proc_info_i18n.MODIFIERS,":</span></dt><dd class='pri-modifiers'><span>",priMod,"</span></dd></dl>");
}var priTxt=priItem.EVENT_TEXT;
if(priTxt!=""){jsPriHTML.push("<dl class='pri-info'><dt><span>",proc_info_i18n.SURGICAL_FREE_TXT,":</span></dt><dd class='pri-event-txt'><span>",priTxt,"</span></dd></dl>");
}if(recordData.SURG_START_DT_TM){var surgStrtDtTm=df.formatISO8601(recordData.SURG_START_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
}else{var surgStrtDtTm=noResultIndicator;
}if(recordData.SURG_STOP_DT_TM){var surgStopDtTm=df.formatISO8601(recordData.SURG_STOP_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
}else{var surgStopDtTm=noResultIndicator;
}if(recordData.ANESTH_START_DT_TM){var anesthStrtDtTm=df.formatISO8601(recordData.ANESTH_START_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
}else{var anesthStrtDtTm=noResultIndicator;
}if(recordData.ANESTH_STOP_DT_TM){var anesthStopDtTm=df.formatISO8601(recordData.ANESTH_STOP_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
}else{var anesthStopDtTm=noResultIndicator;
}jsPriHTML.push("<dl class='pri-info'><dt><span>",proc_info_i18n.ANESTHESIA_TYPES,":</span></dt><dd class='pri-anesth'><span>",anesthesia,"</span></dd></dl><dl class='pri-info'><dt><span>",proc_info_i18n.SURGEON,":</span></dt><dd class='pri-surgeon'><span>",priItem.PRIM_SURGEON_NAME_FULL,"</span></dd></dl><dl class='pri-info'><dt><span>",proc_info_i18n.SURGERY_STRT,":</span></dt><dd class='pri-surg-start'><span>",surgStrtDtTm,"</span></dd></dl><dl class='pri-info'><dt><span>",proc_info_i18n.SURGERY_STOP,":</span></dt><dd class='pri-surg-stop'><span>",surgStopDtTm,"</span></dd></dl><dl class='pri-info'><dt><span>",proc_info_i18n.ANESTH_STRT,":</span></dt><dd class='pri-anesth-start'><span>",anesthStrtDtTm,"</span></dd></dl><dl class='pri-info'><dt><span>",proc_info_i18n.ANESTH_STOP,":</span></dt><dd class='pri-anesth-stop'><span>",anesthStopDtTm,"</span></dd></dl>");
}else{secProcs.push(priItem);
}}if(priLen>1){function secProcSort(a,b){var sortRes=0;
if(a.NAME<b.NAME){sortRes=-1;
}else{sortRes=1;
}return sortRes;
}secProcs.sort(secProcSort);
for(var i=0,l=secProcs.length;
i<l;
i++){var secItem=secProcs[i];
if(secItem.EVENT_TEXT==""){var sEvntTxt=noResultIndicator;
}else{var sEvntTxt=secItem.EVENT_TEXT;
}sSecondProcs.push("<dl class='pri-sc-info'><dt><span>",proc_info_i18n.SECONDARY_PROCS,":</span></dt><dd class='pri-sc-name'><span>",secItem.NAME,"</span></dd><dd class='pri-sc-event-txt'><span>",sEvntTxt,"</span></dd></dl>");
}jsPriHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Hide Section'>-</span><span class='sub-sec-title'>",proc_info_i18n.SECONDARY_PROCS," (",priLen-1,")","</span>","</h3><div class='sub-sec-content'><div class='pri-sc-hd'>  <dl class='pri-sc-hdr'><dt class='pri-sc-name-hd'><span>",proc_info_i18n.PROCEDURE_NAME,"</span></dt><dd class='pri-sc-event-txt-hd'>","<span>",proc_info_i18n.SURGICAL_FREE_TXT,"</span></dd></dl></div>");
var content=[];
content.push("<div class='",MP_Util.GetContentClass(component,priLen-1),"'>",sSecondProcs.join(""),"</div></div></div>");
jsPriHTML=jsPriHTML.concat(content);
}priHTML=jsPriHTML.join("");
var countText="";
MP_Util.Doc.FinalizeComponent(priHTML,component,countText);
}catch(err){var errMsg=[];
errMsg.push("<b>",i18n.JS_ERROR,"</b><br><ul><li>",i18n.MESSAGE,": ",err.message,"</li><li>",i18n.NAME,": ",err.name,"</li><li>",i18n.NUMBER,": ",(err.number&65535),"</li><li>",i18n.DESCRIPTION,": ",err.description,"</li></ul>");
MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(),errMsg.join("")),component,countText);
if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}}};
}();
