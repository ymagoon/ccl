function PeriopTrackComponentStyle(){this.initByNamespace("ptr");
}PeriopTrackComponentStyle.inherits(ComponentStyle);
function PeriopTrackComponent(criterion){this.setCriterion(criterion);
this.setStyles(new PeriopTrackComponentStyle());
this.setComponentLoadTimerName("USR:MPG.PERIOPTRACK.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.PERIOPTRACK.O1 - render component");
this.setIncludeLineNumber(false);
this.setScope(3);
this.setResourceRequired(true);
this.m_periopCaseObj=null;
PeriopTrackComponent.method("InsertData",function(){CERN_PERIOP_TRACK_O1.GetPeriopTrackTable(this);
});
PeriopTrackComponent.method("HandleSuccess",function(recordData){CERN_PERIOP_TRACK_O1.RenderComponent(this,recordData);
});
PeriopTrackComponent.method("RetrieveRequiredResources",function(){var caseResource=MP_Resources.getSharedResource("periopCaseIds");
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
PeriopTrackComponent.method("loadCaseData",function(element,caseData){try{var casesJSON=JSON.parse(caseData).CASES_REC;
var periopCase=new MP_Core.PeriopCases();
var countDown=casesJSON.PROC_CNTDWN;
periopCase.setCaseID(casesJSON.CASE_ID);
periopCase.setDays(countDown.DAYS);
periopCase.setHours(countDown.HOURS);
periopCase.setMins(countDown.MINS);
periopCase.setCntdwnDscFlg(countDown.CNTDWN_DESC_FLAG);
this.m_periopCaseObj=periopCase;
CERN_PERIOP_TRACK_O1.GetPeriopTrackTable(this);
}catch(err){MP_Util.LogJSError(err,this,"periop-track.js","loadCaseData");
var errMsg=[];
errMsg.push("<strong>",i18n.JS_ERROR,"</strong><br><ul><li>",i18n.MESSAGE,": ",err.message,"</li><li>",i18n.NAME,": ",err.name,"</li><li>",i18n.NUMBER,": ",(err.number&65535),"</li><li>",i18n.DESCRIPTION,": ",err.description,"</li></ul>");
MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(),errMsg.join("")),this,"");
}});
PeriopTrackComponent.method("openTab",function(){var criterion=this.getCriterion();
var sParms="/PERSONID="+criterion.person_id+" /ENCNTRID="+criterion.encntr_id+" /FIRSTTAB=^"+this.getLink()+"+^";
APPLINK(0,criterion.executable,sParms);
this.InsertData();
});
}PeriopTrackComponent.inherits(MPageComponent);
var CERN_PERIOP_TRACK_O1=function(){return{GetPeriopTrackTable:function(component){var sendAr=[];
var criterion=component.getCriterion();
var periopCase=component.m_periopCaseObj;
sendAr.push("^MINE^",periopCase.getCaseID()+".0","^"+criterion.category_mean+"^");
MP_Core.XMLCclRequestWrapper(component,"MP_GET_PR_TRACKING",sendAr,true);
},RenderComponent:function(component,recordData){var timerRenderComponent=MP_Util.CreateTimer(component.getComponentRenderTimerName());
try{var df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
var jsPtrHTML=[];
var ptrHTML="";
var ptrLen=0;
var ptrObj=recordData.ITEM;
ptrLen=ptrObj.length;
var ptrOmit=["TESURADDON","TEALLERGYICO","TEALLERGYIND","TESURCCL","TESURCHKIN","TESURCHKOUT","TESURCREICO","TEEVTICON","TESURMOVE","TENEWORDERS","TENEWRESULT","TERADIMAGE","TESTICKNOTE","TESURAPRTASK","TEETICONCOL"];
var ptrDt=["TESURABEGDT","TESURAEDDT","TESURANSDT","TESURANEDT","TESURCCLDT","TESURCHKODT","TESURSBEGDT","TESURSENDDT","TESURCREDT","TESURABEGDT","TESURAEDDT"];
var ptrTm=["TESURABEGTM","TESURAEDTM","TESURANSTM","TESURANETM","TESURCCLTM","TESURCHKOTM","TESURSBEGTM","TESURCRETM","TESURSENDTM","TESURCHKOTM","TESURCCLTM","TESURAEDTM","TESURABEGTM"];
var ptrDtTm=["TESURABEGDTT","TESURAEDDTT","TESURANEDTT","TESURCCLDTT","TESURCHKODTT","TESURSBEGDTT","TESURSENDDTT","TESURCREDTT","TESURABEGDTT","TESURAEDDTT","TESURCCLDTT","TESURCHKODTT","TESURANSDTT","TEEVENTCOL"];
function ptrFindItem(itm,arr){var found=false;
for(var i=0,l=arr.length;
i<l;
i++){if(itm.CODE_MEANING==arr[i]){found=true;
break;
}}return found;
}function ptrBuildRow(item){var row="";
if(!ptrFindItem(item,ptrOmit)){var ptrVal=item.ITEM_VAL;
if(ptrFindItem(item,ptrDtTm)){if(ptrVal){var ptrVal=df.formatISO8601(ptrVal,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
}}else{if(ptrFindItem(item,ptrDt)){if(ptrVal){var ptrVal=df.formatISO8601(ptrVal,mp_formatter.DateTimeFormatter.SHORT_DATE_2YEAR);
}}else{if(ptrFindItem(item,ptrTm)){if(ptrVal){var ptrVal=df.formatISO8601(ptrVal,mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS);
}}}}row="<h3 class='ptr-info-hd'><span>Tracking Information</span></h3><dl class='ptr-info'><dt><span>"+ptrItem.DISPLAY_VAL+"</span></dt><dd><span>"+ptrVal+"</span></dd></dl>";
}return row;
}for(var i=0;
i<ptrLen;
i++){var ptrItem=ptrObj[i];
jsPtrHTML.push(ptrBuildRow(ptrItem));
}ptrHTML=jsPtrHTML.join("");
var content=[];
content.push("<div class='",MP_Util.GetContentClass(component,ptrLen-1),"'>",ptrHTML,"</div>");
var countText="";
MP_Util.Doc.FinalizeComponent(content.join(""),component,countText);
}catch(err){var errMsg=[];
errMsg.push("<b>",i18n.JS_ERROR,"</b><br><ul><li>",i18n.MESSAGE,": ",err.message,"</li><li>",i18n.NAME,": ",err.name,"</li><li>",i18n.NUMBER,": ",(err.number&65535),"</li><li>",i18n.DESCRIPTION,": ",err.description,"</li></ul>");
MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(),errMsg.join("")),component,countText);
if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}}};
}();