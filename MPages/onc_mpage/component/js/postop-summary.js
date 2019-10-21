function PostopSummaryComponentStyle(){this.initByNamespace("pso");
}PostopSummaryComponentStyle.inherits(ComponentStyle);
function PostopSummaryComponent(criterion){this.impTypeCodes=null;
this.impDescCodes=null;
this.impSerNumCodes=null;
this.impLotNumCodes=null;
this.impMfctCodes=null;
this.impCatNumCodes=null;
this.impSizeCodes=null;
this.impExpDtCodes=null;
this.impSiteCodes=null;
this.impQtyCodes=null;
this.impEventCodes=null;
this.dwaDescCodes=null;
this.dwaLocCodes=null;
this.dwaCondCodes=null;
this.dwaDrainCodes=null;
this.dwaCareCodes=null;
this.paLocCodes=null;
this.paRatingCodes=null;
this.paScaleCodes=null;
this.paQualCodes=null;
this.paIntvCodes=null;
this.setResourceRequired(true);
this.m_periopCaseObj=null;
this.m_implntExplnt=null;
this.m_implntDesc=null;
this.m_implntSerNbr=null;
this.m_implntLotNbr=null;
this.m_implntManu=null;
this.m_implntCatNbr=null;
this.m_implntSize=null;
this.m_implntExpDt=null;
this.m_implntSite=null;
this.m_implntQty=null;
this.m_dress_cond=null;
this.m_dress_drn=null;
this.m_dressDesc=null;
this.m_dressCare=null;
this.m_dressCLoc=null;
this.m_PainLoc=null;
this.m_PainRtng=null;
this.m_PainScale=null;
this.m_PainQual=null;
this.m_PainInterv=null;
this.setCriterion(criterion);
this.setStyles(new PostopSummaryComponentStyle());
this.setComponentLoadTimerName("USR:MPG.POSTOPSUMMARY.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.POSTOPSUMMARY.O1 - render component");
this.setIncludeLineNumber(false);
this.setScope(3);
PostopSummaryComponent.method("InsertData",function(){CERN_POSTOP_SUMMARY_O1.GetPostopSummaryTable(this);
});
PostopSummaryComponent.method("HandleSuccess",function(recordData){CERN_POSTOP_SUMMARY_O1.RenderComponent(this,recordData);
});
PostopSummaryComponent.method("RetrieveRequiredResources",function(){var caseResource=MP_Resources.getSharedResource("periopCaseIds");
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
PostopSummaryComponent.method("loadCaseData",function(element,caseData){try{var casesJSON=JSON.parse(caseData).CASES_REC;
var periopCase=new MP_Core.PeriopCases();
var countDown=casesJSON.PROC_CNTDWN;
periopCase.setCaseID(casesJSON.CASE_ID);
periopCase.setDays(countDown.DAYS);
periopCase.setHours(countDown.HOURS);
periopCase.setMins(countDown.MINS);
periopCase.setCntdwnDscFlg(countDown.CNTDWN_DESC_FLAG);
this.m_periopCaseObj=periopCase;
CERN_POSTOP_SUMMARY_O1.GetPostopSummaryTable(this);
}catch(err){MP_Util.LogJSError(err,this,"postop-summary.js","loadCaseData");
var errMsg=[];
errMsg.push("<strong>",i18n.JS_ERROR,"</strong><br><ul><li>",i18n.MESSAGE,": ",err.message,"</li><li>",i18n.NAME,": ",err.name,"</li><li>",i18n.NUMBER,": ",(err.number&65535),"</li><li>",i18n.DESCRIPTION,": ",err.description,"</li></ul>");
MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(),errMsg.join("")),this,"");
}});
PostopSummaryComponent.method("openTab",function(){var criterion=this.getCriterion();
var sParms="/PERSONID="+criterion.person_id+" /ENCNTRID="+criterion.encntr_id+" /FIRSTTAB=^"+this.getLink()+"+^";
APPLINK(0,criterion.executable,sParms);
this.InsertData();
});
PostopSummaryComponent.method("setImplantExplant",function(value){this.m_implntExplnt=value;
});
PostopSummaryComponent.method("getImplantExplant",function(){if(this.m_implntExplnt){return this.m_implntExplnt;
}});
PostopSummaryComponent.method("setImplantDesc",function(value){this.m_implntDesc=value;
});
PostopSummaryComponent.method("getImplantDesc",function(){if(this.m_implntDesc){return this.m_implntDesc;
}});
PostopSummaryComponent.method("setImplantSerNbr",function(value){this.m_implntSerNbr=value;
});
PostopSummaryComponent.method("getImplantSerNbr",function(){if(this.m_implntSerNbr){return this.m_implntSerNbr;
}});
PostopSummaryComponent.method("setImplantLotNbr",function(value){this.m_implntLotNbr=value;
});
PostopSummaryComponent.method("getImplantLotNbr",function(){if(this.m_implntLotNbr){return this.m_implntLotNbr;
}});
PostopSummaryComponent.method("setImplantManu",function(value){this.m_implntManu=value;
});
PostopSummaryComponent.method("getImplantManu",function(){if(this.m_implntManu){return this.m_implntManu;
}});
PostopSummaryComponent.method("setImplantCatNbr",function(value){this.m_implntCatNbr=value;
});
PostopSummaryComponent.method("getImplantCatNbr",function(){if(this.m_implntCatNbr){return this.m_implntCatNbr;
}});
PostopSummaryComponent.method("setImplantSize",function(value){this.m_implntSize=value;
});
PostopSummaryComponent.method("getImplantSize",function(){if(this.m_implntSize){return this.m_implntSize;
}});
PostopSummaryComponent.method("setImplantExpDt",function(value){this.m_implntExpDt=value;
});
PostopSummaryComponent.method("getImplantExpDt",function(){if(this.m_implntExpDt){return this.m_implntExpDt;
}});
PostopSummaryComponent.method("setImplantSite",function(value){this.m_implntSite=value;
});
PostopSummaryComponent.method("getImplantSite",function(){if(this.m_implntSite){return this.m_implntSite;
}});
PostopSummaryComponent.method("setImplantQty",function(value){this.m_implntQty=value;
});
PostopSummaryComponent.method("getImplantQty",function(){if(this.m_implntQty){return this.m_implntQty;
}});
PostopSummaryComponent.method("setDressCond",function(value){this.m_dress_cond=value;
});
PostopSummaryComponent.method("getDressCond",function(){if(this.m_dress_cond){return this.m_dress_cond;
}});
PostopSummaryComponent.method("setDressDrain",function(value){this.m_dress_drn=value;
});
PostopSummaryComponent.method("getDressDrain",function(){if(this.m_dress_drn){return this.m_dress_drn;
}});
PostopSummaryComponent.method("setDressDesc",function(value){this.m_dressDesc=value;
});
PostopSummaryComponent.method("getDressDesc",function(){if(this.m_dressDesc){return this.m_dressDesc;
}});
PostopSummaryComponent.method("setDressCare",function(value){this.m_dressCare=value;
});
PostopSummaryComponent.method("getDressCare",function(){if(this.m_dressCare){return this.m_dressCare;
}});
PostopSummaryComponent.method("setDressLoc",function(value){this.m_dressCLoc=value;
});
PostopSummaryComponent.method("getDressLoc",function(){if(this.m_dressCLoc){return this.m_dressCLoc;
}});
PostopSummaryComponent.method("setPainLoc",function(value){this.m_PainLoc=value;
});
PostopSummaryComponent.method("getPainLoc",function(){if(this.m_PainLoc){return this.m_PainLoc;
}});
PostopSummaryComponent.method("setPainRating",function(value){this.m_PainRtng=value;
});
PostopSummaryComponent.method("getPainRating",function(){if(this.m_PainRtng){return this.m_PainRtng;
}});
PostopSummaryComponent.method("setPainRating",function(value){this.m_PainRtng=value;
});
PostopSummaryComponent.method("getPainRating",function(){if(this.m_PainRtng){return this.m_PainRtng;
}});
PostopSummaryComponent.method("setPainScale",function(value){this.m_PainScale=value;
});
PostopSummaryComponent.method("getPainScale",function(){if(this.m_PainScale){return this.m_PainScale;
}});
PostopSummaryComponent.method("setPainQual",function(value){this.m_PainQual=value;
});
PostopSummaryComponent.method("getPainQual",function(){if(this.m_PainQual){return this.m_PainQual;
}});
PostopSummaryComponent.method("setPainInterv",function(value){this.m_PainInterv=value;
});
PostopSummaryComponent.method("getPainInterv",function(){if(this.m_PainInterv){return this.m_PainInterv;
}});
}PostopSummaryComponent.inherits(MPageComponent);
var CERN_POSTOP_SUMMARY_O1=function(){function dwaSort(a,b){var sortRes=0;
if(a.DOC_DT_TM<b.DOC_DT_TM){sortRes=1;
}else{sortRes=-1;
}return sortRes;
}function buildHvr(hvrData){var psoHvr=["<h4 class='det-hd'><span>",i18n.discernabu.postop_summary_i18n.RESULT_DETAILS,"</span></h4><div class='hvr'><dl><dt><span>",i18n.discernabu.postop_summary_i18n.DOC_BY,":</span></dt><dd><span>",hvrData,"</span></dd></dl></div>"];
return psoHvr.join("");
}function psoBuildHd(hdRowLbl,hdData,hdHvr){var psoHd=["<tr><th>&nbsp;</th>"];
for(var dataIdx=0,lmt=hdData.length;
dataIdx<lmt;
dataIdx++){psoHd.push("<th><dl class='pso-info'><dt>",hdRowLbl,":</dt><dd>",hdData[dataIdx],"</dd></dl>",(hdHvr&&hdHvr[dataIdx])?buildHvr(hdHvr[dataIdx]):"","</th>");
}psoHd.push("</tr>");
return psoHd.join("");
}function psoBuildRow(rowNum,rowName,rowData){var rowClass="odd";
if(rowNum%2===0){rowClass="even";
}var psoRow=["<tr class='",rowClass,"'><td class='pso-lbl'><span class='row-lbl'>",rowName,"</span></td>"];
for(var dataIdx=0;
dataIdx<rowData.length;
dataIdx++){psoRow.push("<td class='pso-res'><dl class='pso-info'><dt>",rowName,"</dt><dd>",rowData[dataIdx],"</dd></dl></td>");
}psoRow.push("</tr>");
return psoRow.join("");
}function pushDataValue(dataValue,isMapped,container){if(dataValue){container.push(dataValue);
}else{pushNoResultIndicator(isMapped,container);
}}function pushNoResultIndicator(isMapped,container){if(isMapped){container.push(CERN_POSTOP_SUMMARY_O1.noResultIndicator);
}}return{noResultIndicator:"--",GetPostopSummaryTable:function(component){var ImpMappedEventCount=0;
function convertIDsToFloats(iDList){if(iDList){for(var i=0,lmt=iDList.length;
i<lmt;
i++){iDList[i]+=".0";
}}}function formatForCodeList(eventCodeList){if(eventCodeList&&eventCodeList.length){return eventCodeList.length+".0, "+eventCodeList.join(", ");
}}var implntExplnt=component.getImplantExplant();
convertIDsToFloats(implntExplnt);
component.impTypeCodes=formatForCodeList(implntExplnt);
var implntDsc=component.getImplantDesc();
convertIDsToFloats(implntDsc);
component.impDescCodes=formatForCodeList(implntDsc);
var implntSrNbr=component.getImplantSerNbr();
convertIDsToFloats(implntSrNbr);
component.impSerNumCodes=formatForCodeList(implntSrNbr);
var implntLtNbr=component.getImplantLotNbr();
convertIDsToFloats(implntLtNbr);
component.impLotNumCodes=formatForCodeList(implntLtNbr);
var implntMnu=component.getImplantManu();
convertIDsToFloats(implntMnu);
component.impMfctCodes=formatForCodeList(implntMnu);
var implntCtNbr=component.getImplantCatNbr();
convertIDsToFloats(implntCtNbr);
component.impCatNumCodes=formatForCodeList(implntCtNbr);
var implntSz=component.getImplantSize();
convertIDsToFloats(implntSz);
component.impSizeCodes=formatForCodeList(implntSz);
var implntExpDt=component.getImplantExpDt();
convertIDsToFloats(implntExpDt);
component.impExpDtCodes=formatForCodeList(implntExpDt);
var implntSt=component.getImplantSite();
convertIDsToFloats(implntSt);
component.impSiteCodes=formatForCodeList(implntSt);
var implntQty=component.getImplantQty();
convertIDsToFloats(implntQty);
component.impQtyCodes=formatForCodeList(implntQty);
var tmpCodeList=[];
if(component.impTypeCodes){tmpCodeList.push(component.impTypeCodes);
}if(component.impDescCodes){tmpCodeList.push(component.impDescCodes);
}if(component.impSerNumCodes){tmpCodeList.push(component.impSerNumCodes);
}if(component.impLotNumCodes){tmpCodeList.push(component.impLotNumCodes);
}if(component.impMfctCodes){tmpCodeList.push(component.impMfctCodes);
}if(component.impCatNumCodes){tmpCodeList.push(component.impCatNumCodes);
}if(component.impSizeCodes){tmpCodeList.push(component.impSizeCodes);
}if(component.impExpDtCodes){tmpCodeList.push(component.impExpDtCodes);
}if(component.impSiteCodes){tmpCodeList.push(component.impSiteCodes);
}if(component.impQtyCodes){tmpCodeList.push(component.impQtyCodes);
}var formattedCodes=formatForCodeList(tmpCodeList);
var impEventCodes=[];
if(formattedCodes.length){impEventCodes.push(formattedCodes);
}var periopEventCodes=formatForCodeList(impEventCodes);
component.impEventCodes=(periopEventCodes&&periopEventCodes.length)?"value("+periopEventCodes+")":"0.0";
var drssCnd=component.getDressCond();
component.dwaCondCodes=(drssCnd&&drssCnd.length)?"value("+drssCnd.join(".0,")+".0)":"0.0";
var drssDrn=component.getDressDrain();
component.dwaDrainCodes=(drssDrn&&drssDrn.length)?"value("+drssDrn.join(".0,")+".0)":"0.0";
var drssDsc=component.getDressDesc();
component.dwaDescCodes=(drssDsc&&drssDsc.length)?"value("+drssDsc.join(".0,")+".0)":"0.0";
var drssCr=component.getDressCare();
component.dwaCareCodes=(drssCr&&drssCr.length)?"value("+drssCr.join(".0,")+".0)":"0.0";
var drssLoc=component.getDressLoc();
component.dwaLocCodes=(drssLoc&&drssLoc.length)?"value("+drssLoc.join(".0,")+".0)":"0.0";
var pnLoc=component.getPainLoc();
component.paLocCodes=(pnLoc&&pnLoc.length)?"value("+pnLoc.join(".0,")+".0)":"0.0";
var pnRtng=component.getPainRating();
component.paRatingCodes=(pnRtng&&pnRtng.length)?"value("+pnRtng.join(".0,")+".0)":"0.0";
var pnScl=component.getPainScale();
component.paScaleCodes=(pnScl&&pnScl.length)?"value("+pnScl.join(".0,")+".0)":"0.0";
var pnQl=component.getPainQual();
component.paQualCodes=(pnQl&&pnQl.length)?"value("+pnQl.join(".0,")+".0)":"0.0";
var pnIntv=component.getPainInterv();
component.paIntvCodes=(pnIntv&&pnIntv.length)?"value("+pnIntv.join(".0,")+".0)":"0.0";
var sendAr=[];
var criterion=component.getCriterion();
var periopCase=component.m_periopCaseObj;
var case_id=periopCase.getCaseID();
if(case_id===null){case_id=0;
}sendAr.push("^MINE^",criterion.person_id+".0",case_id+".0",criterion.provider_id+".0",criterion.ppr_cd+".0",component.impEventCodes,component.dwaCondCodes,component.dwaDrainCodes,component.dwaDescCodes,component.dwaCareCodes,component.dwaLocCodes,component.paLocCodes,component.paRatingCodes,component.paScaleCodes,component.paQualCodes,component.paIntvCodes);
MP_Core.XMLCclRequestWrapper(component,"MP_GET_POSTOP_SUMMARY_v2",sendAr,true);
},convertDataArrayToTableArray:function(dataArray,columnsToDisplay,putFirstRowInHover){var entryNumbers=[];
var colCnt=dataArray[0].length-1;
var psoHTMlTable=[];
var rowStart;
var entryNum=colCnt;
if(columnsToDisplay===0){columnsToDisplay=colCnt;
}for(var entryIdx=1;
entryIdx<=columnsToDisplay;
entryIdx++){if(entryNum>0){entryNumbers.push(i18n.discernabu.postop_summary_i18n.ENTRY+" "+entryNum);
entryNum--;
}else{entryNumbers.push("&nbsp");
}}if(putFirstRowInHover){var tempHeaderRowData=[];
tempHeaderRowData=dataArray[0].slice(1,colCnt+1);
psoHTMlTable.push(psoBuildHd(i18n.discernabu.postop_summary_i18n.ENTRY,entryNumbers,tempHeaderRowData));
rowStart=1;
}else{psoHTMlTable.push(psoBuildHd(i18n.discernabu.postop_summary_i18n.ENTRY,entryNumbers,null));
rowStart=0;
}for(var rowIdx=rowStart,lmt=dataArray.length;
rowIdx<lmt;
rowIdx++){var tempRowData=[];
for(var colIdx=1;
colIdx<=columnsToDisplay;
colIdx++){if(dataArray[rowIdx][colIdx]&&dataArray[rowIdx][colIdx].length){tempRowData.push(dataArray[rowIdx][colIdx]);
}else{tempRowData.push(CERN_POSTOP_SUMMARY_O1.noResultIndicator);
}}psoHTMlTable.push(psoBuildRow(rowIdx,dataArray[rowIdx][0]+":",tempRowData));
}return psoHTMlTable.join("");
},RenderComponent:function(component,recordData){var timerRenderComponent=MP_Util.CreateTimer(component.getComponentRenderTimerName());
try{var jsPsoHTML=[];
var psoHTML="";
var jsIpSec=[];
var jsDwaSec=[];
var jsPaSec=[];
var dwaLen=0;
var paLen=0;
var psoTotCnt=0;
var psoObj=recordData;
var postop_summary_i18n=i18n.discernabu.postop_summary_i18n;
var df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
var implntExplnt=component.getImplantExplant();
var implntDsc=component.getImplantDesc();
var implntSrNbr=component.getImplantSerNbr();
var implntLtNbr=component.getImplantLotNbr();
var implntMnu=component.getImplantManu();
var implntCtNbr=component.getImplantCatNbr();
var implntSz=component.getImplantSize();
var implntExpDt=component.getImplantExpDt();
var implntSt=component.getImplantSite();
var implntQty=component.getImplantQty();
var drssCnd=component.getDressCond();
var drssDrn=component.getDressDrain();
var drssDsc=component.getDressDesc();
var drssCr=component.getDressCare();
var drssLoc=component.getDressLoc();
var pnLoc=component.getPainLoc();
var pnRtng=component.getPainRating();
var pnScl=component.getPainScale();
var pnQl=component.getPainQual();
var pnIntv=component.getPainInterv();
var dwaCodeCnt=0;
var paCodeCnt=0;
var numRows=0;
var maxColumnsToDisplay=3;
var colCnt;
var ipCodeCnt;
var sHtml="";
var rowIdx;
var tempResult;
var criterion=component.getCriterion();
if(implntExplnt||implntDsc||implntSrNbr||implntLtNbr||implntMnu||implntCtNbr||implntSz||implntExpDt||implntSt||implntQty){var sizeIdx;
var expDateIdx;
numRows+=1;
var impArray=[];
impArray.push([postop_summary_i18n.DOC_BY]);
if(implntExplnt){impArray.push([postop_summary_i18n.IMPLNT_EXPLNT]);
}if(implntDsc){impArray.push([postop_summary_i18n.DESC]);
}if(implntSrNbr){impArray.push([postop_summary_i18n.SER_NUM]);
}if(implntLtNbr){impArray.push([postop_summary_i18n.LOT_NUM]);
}if(implntMnu){impArray.push([postop_summary_i18n.MNFCTR]);
}if(implntCtNbr){impArray.push([postop_summary_i18n.CAT_NUM]);
}if(implntSz){impArray.push([postop_summary_i18n.SIZE]);
sizeIdx=impArray.length-1;
}if(implntExpDt){impArray.push([postop_summary_i18n.EXP_DT_TM]);
expDateIdx=impArray.length-1;
}if(implntSt){impArray.push([postop_summary_i18n.IMPLNT_SITE]);
}if(implntQty){impArray.push([postop_summary_i18n.QNTY]);
}ipCodeCnt=impArray.length-1;
numRows+=ipCodeCnt;
var colList=[];
colList=psoObj.IMPLANT;
colCnt=colList.length;
if(colCnt){for(var colIdx=0;
colIdx<colCnt;
colIdx++){impArray[0][colIdx+1]=colList[colIdx].DOC_BY;
eventList=colList[colIdx].EVENTS;
for(var eventIdx=0,lmt=eventList.length;
eventIdx<lmt;
eventIdx++){rowIdx=eventList[eventIdx].SEQ;
tempResult=eventList[eventIdx].RESULT;
if(rowIdx===sizeIdx){var splitSize=tempResult.toString().split("|");
if(!isNaN(splitSize[0])){if(parseFloat(splitSize[0])!=parseInt(splitSize[0],10)){splitSize[0]=MP_Util.Measurement.SetPrecision(splitSize[0],1);
}tempResult=splitSize[0];
if(splitSize[1]){tempResult=tempResult+" "+splitSize[1];
}}}if(rowIdx===expDateIdx){tempResult=df.formatISO8601(tempResult,mp_formatter.DateTimeFormatter.SHORT_DATE_2YEAR);
}impArray[rowIdx][colIdx+1]=tempResult;
}}}jsIpSec=CERN_POSTOP_SUMMARY_O1.convertDataArrayToTableArray(impArray,maxColumnsToDisplay,true);
psoTotCnt+=ipCodeCnt;
jsPsoHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title="+postop_summary_i18n.HIDE_SECTION+">-</span><span class='sub-sec-title'>"+postop_summary_i18n.IMPLANT_PROSTHETIC+" (",colCnt,")");
if(colCnt>maxColumnsToDisplay){var showAllDialog=new ModalDialog("showAllDialog_pso_imp").setHeaderTitle(postop_summary_i18n.IMPLANT_PROSTHETIC).setIsBodySizeFixed(false);
showAllDialog.setBodyDataFunction(function(modalObj){var dialogBodySec=[];
dialogBodySec.push("<div class='pso-full-scroll'><table class='pso-tbl-full'>");
dialogBodySec.push(CERN_POSTOP_SUMMARY_O1.convertDataArrayToTableArray(impArray,0,false));
dialogBodySec.push("</table></div>");
modalObj.setBodyHTML(dialogBodySec.join(""));
});
MP_ModalDialog.addModalDialogObject(showAllDialog);
sHtml="<a class='pso-show-all' onclick='MP_ModalDialog.showModalDialog(\"showAllDialog_pso_imp\");'>"+postop_summary_i18n.SHOW_ALL+"</a>";
jsPsoHTML.push(sHtml);
}jsPsoHTML.push("</span></h3><div class='sub-sec-content'><table class='pso-table'>",jsIpSec,"</table></div></div>");
}if(drssDsc||drssLoc||drssCnd||drssDrn||drssCr){numRows=numRows+1;
var dwaDescCd=0;
var dwaTypeCd=1;
var dwaLocCd=0;
var dwaCondCd=0;
var dwaDrainCd=0;
var dwaCareCd=0;
var columnsToDisplay;
numRows++;
if(drssDsc){dwaDescCd=1;
numRows=numRows+1;
}if(drssLoc){dwaLocCd=1;
numRows=numRows+1;
}if(drssCnd){dwaCondCd=1;
numRows=numRows+1;
}if(drssDrn){dwaDrainCd=1;
numRows=numRows+1;
}if(drssCr){dwaCareCd=1;
numRows=numRows+1;
}dwaCodeCnt=dwaDescCd+dwaLocCd+dwaCondCd+dwaDrainCd+dwaCareCd;
if(dwaCodeCnt>0){var dwaObj=psoObj.DRESSING_ASSESSMENT;
var dwaCatCount=dwaObj.length;
var dwaItems=[];
for(var i=0;
i<dwaCatCount;
i++){var dwaCat=dwaObj[i].DATEARRAY;
var dwaItmCount=dwaCat.length;
if(dwaItmCount>0){for(var j=0;
j<dwaItmCount;
j++){var dwaItm=dwaCat[j];
var dwaItmObj={DRESSING:dwaItm.DRESSING,TYPE:dwaItm.TYPE,LOCATION:dwaItm.LOCATION,CONDITION:dwaItm.CONDITION,DRAINAGE:dwaItm.DRAINAGE,CARE:dwaItm.CARE,DOC_DT_TM:dwaItm.DOC_DT_TM,DOC_BY:dwaItm.DOC_BY};
dwaItems.push(dwaItm);
}}}dwaLen=dwaItems.length;
dwaItems.sort(dwaSort);
psoTotCnt+=dwaCodeCnt;
var dwaType=[];
var dwaNum=[];
var dwaDress=[];
var dwaDesc=[];
var dwaLoc=[];
var dwaCond=[];
var dwaDrain=[];
var dwaCare=[];
var dwaDocDt=[];
var dwaDocBy=[];
for(var i=0;
i<maxColumnsToDisplay;
i++){if(i<dwaLen){var dwaItem=dwaItems[i];
pushDataValue(dwaItem.DRESSING,drssDsc,dwaDress);
pushDataValue(dwaItem.TYPE,true,dwaType);
pushDataValue(dwaItem.LOCATION,drssLoc,dwaLoc);
pushDataValue(dwaItem.CONDITION,drssCnd,dwaCond);
pushDataValue(dwaItem.DRAINAGE,drssDrn,dwaDrain);
pushDataValue(dwaItem.CARE,drssCr,dwaCare);
if(dwaItem.DOC_DT_TM){dwaDocDt.push(df.formatISO8601(dwaItem.DOC_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR));
}dwaDocBy.push(dwaItem.DOC_BY);
}else{pushNoResultIndicator(false,dwaNum);
pushNoResultIndicator(drssDsc,dwaDress);
pushNoResultIndicator(true,dwaType);
pushNoResultIndicator(drssLoc,dwaLoc);
pushNoResultIndicator(drssCnd,dwaCond);
pushNoResultIndicator(drssDrn,dwaDrain);
pushNoResultIndicator(drssCr,dwaCare);
dwaDocDt.push("");
dwaDocBy.push("");
}}jsDwaSec.push(psoBuildHd(i18n.discernabu.postop_summary_i18n.DOC_DT_TM,dwaDocDt,dwaDocBy));
var dwaRowCnt=0;
function dwaBuildRow(rowCd,rowName,rowData){if(rowCd>0){dwaRowCnt++;
return psoBuildRow(dwaRowCnt,rowName,rowData);
}}jsDwaSec.push(dwaBuildRow(dwaDescCd,postop_summary_i18n.DRESSING+":",dwaDress));
jsDwaSec.push(dwaBuildRow(dwaTypeCd,postop_summary_i18n.TYPE+":",dwaType));
jsDwaSec.push(dwaBuildRow(dwaLocCd,postop_summary_i18n.LOCATION+":",dwaLoc));
jsDwaSec.push(dwaBuildRow(dwaCondCd,postop_summary_i18n.CONDITION+":",dwaCond));
jsDwaSec.push(dwaBuildRow(dwaDrainCd,postop_summary_i18n.DRAINAGE+":",dwaDrain));
jsDwaSec.push(dwaBuildRow(dwaCareCd,postop_summary_i18n.CARE+":",dwaCare));
jsPsoHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title="+postop_summary_i18n.HIDE_SECTION+">-</span><span class='sub-sec-title'>"+postop_summary_i18n.DRESS_WOUND_ASSES+" (",dwaLen,")");
if(dwaLen>maxColumnsToDisplay){var jsDwaShowAllSec=[];
for(var i=maxColumnsToDisplay;
i<dwaLen;
i++){var dwaItem=dwaItems[i];
pushDataValue(dwaItem.DRESSING,drssDsc,dwaDress);
pushDataValue(dwaItem.TYPE,true,dwaType);
pushDataValue(dwaItem.LOCATION,drssLoc,dwaLoc);
pushDataValue(dwaItem.CONDITION,drssCnd,dwaCond);
pushDataValue(dwaItem.DRAINAGE,drssDrn,dwaDrain);
pushDataValue(dwaItem.CARE,drssCr,dwaCare);
if(dwaItem.DOC_DT_TM){dwaDocDt.push(df.formatISO8601(dwaItem.DOC_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR));
}dwaDocBy.push(dwaItem.DOC_BY);
}jsDwaShowAllSec.push(psoBuildHd(i18n.discernabu.postop_summary_i18n.DOC_DT_TM,dwaDocDt,null));
dwaRowCnt=0;
jsDwaShowAllSec.push(dwaBuildRow(true,postop_summary_i18n.DOC_BY+":",dwaDocBy));
jsDwaShowAllSec.push(dwaBuildRow(dwaDescCd,postop_summary_i18n.DRESSING+":",dwaDress));
jsDwaShowAllSec.push(dwaBuildRow(dwaTypeCd,postop_summary_i18n.TYPE+":",dwaType));
jsDwaShowAllSec.push(dwaBuildRow(dwaLocCd,postop_summary_i18n.LOCATION+":",dwaLoc));
jsDwaShowAllSec.push(dwaBuildRow(dwaCondCd,postop_summary_i18n.CONDITION+":",dwaCond));
jsDwaShowAllSec.push(dwaBuildRow(dwaDrainCd,postop_summary_i18n.DRAINAGE+":",dwaDrain));
jsDwaShowAllSec.push(dwaBuildRow(dwaCareCd,postop_summary_i18n.CARE+":",dwaCare));
var showAllDialog=new ModalDialog("showAllDialog_pso_dwa").setHeaderTitle(postop_summary_i18n.DRESS_WOUND_ASSES).setIsBodySizeFixed(false);
showAllDialog.setBodyDataFunction(function(modalObj){var dialogBodySec=[];
dialogBodySec.push("<div class='pso-full-scroll'><table class='pso-tbl-full'>");
dialogBodySec.push(jsDwaShowAllSec.join(""));
dialogBodySec.push("</table></div>");
modalObj.setBodyHTML(dialogBodySec.join(""));
});
MP_ModalDialog.addModalDialogObject(showAllDialog);
sHtml="<a class='pso-show-all' onclick='MP_ModalDialog.showModalDialog(\"showAllDialog_pso_dwa\");'>"+postop_summary_i18n.SHOW_ALL+"</a>";
jsPsoHTML.push(sHtml);
}jsPsoHTML.push("</span></h3><div class='sub-sec-content'><table class='pso-table'>",jsDwaSec.join(""),"</table></div></div>");
}}if(pnLoc||pnRtng||pnScl||pnQl||pnIntv){numRows=numRows+1;
var paLocCd=0;
var paIntensityCd=0;
var paScaleCd=0;
var paQualCd=0;
var paInterventionCd=0;
if(pnLoc){paLocCd=1;
numRows=numRows+1;
}if(pnRtng){paIntensityCd=1;
numRows=numRows+1;
}if(pnScl){paScaleCd=1;
numRows=numRows+1;
}if(pnQl){paQualCd=1;
numRows=numRows+1;
}if(pnIntv){paInterventionCd=1;
numRows=numRows+1;
}paCodeCnt=paLocCd+paIntensityCd+paScaleCd+paQualCd+paInterventionCd;
var paObj=psoObj.PAIN_ASSESSMENT;
paLen=paObj.length;
psoTotCnt+=paCodeCnt;
var paLoc=[];
var paIntensity=[];
var paScale=[];
var paQual=[];
var paIntervention=[];
var paDocDt=[];
var paDocBy=[];
for(var i=0;
i<maxColumnsToDisplay;
i++){if(i<paLen){var paItem=paObj[i];
pushDataValue(paItem.LOCATION,pnLoc,paLoc);
if(paItem.INTENSITY_RATING){if(!isNaN(paItem.INTENSITY_RATING)){var rtg=paItem.INTENSITY_RATING;
if(parseFloat(paItem.INTENSITY_RATING)!=parseInt(paItem.INTENSITY_RATING,10)){rtg=MP_Util.Measurement.SetPrecision(paItem.INTENSITY_RATING,1);
}paIntensity.push(rtg);
}else{paIntensity.push(paItem.INTENSITY_RATING);
}}else{pushNoResultIndicator(pnRtng,paIntensity);
}pushDataValue(paItem.SCALE_USED,pnScl,paScale);
pushDataValue(paItem.QUALITY,pnQl,paQual);
pushDataValue(paItem.INTERVENTIONS,pnIntv,paIntervention);
if(paItem.DOC_DT_TM){paDocDt.push(df.formatISO8601(paItem.DOC_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR));
}paDocBy.push(paItem.DOC_BY);
}else{pushNoResultIndicator(pnLoc,paLoc);
pushNoResultIndicator(pnRtng,paIntensity);
pushNoResultIndicator(pnScl,paScale);
pushNoResultIndicator(pnQl,paQual);
pushNoResultIndicator(pnIntv,paIntervention);
paDocDt.push("");
paDocDt.push("");
}}jsPaSec.push(psoBuildHd(i18n.discernabu.postop_summary_i18n.DOC_DT_TM,paDocDt,paDocBy));
var paRowCnt=0;
function paBuildRow(rowCd,rowName,rowData){if(rowCd>0){paRowCnt++;
return psoBuildRow(paRowCnt,rowName,rowData);
}}jsPaSec.push(paBuildRow(paLocCd,postop_summary_i18n.PAIN_LOC+":",paLoc));
jsPaSec.push(paBuildRow(paIntensityCd,postop_summary_i18n.PAIN_INTENSITY_SCALE_RATE+":",paIntensity));
jsPaSec.push(paBuildRow(paScaleCd,postop_summary_i18n.PAIN_INTENSITY_SCALE_USED+":",paScale));
jsPaSec.push(paBuildRow(paQualCd,postop_summary_i18n.PAIN_QUALITY+":",paQual));
jsPaSec.push(paBuildRow(paInterventionCd,postop_summary_i18n.INTERVENTIONS+":",paIntervention));
jsPsoHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title="+postop_summary_i18n.HIDE_SECTION+">-</span><span class='sub-sec-title'>"+postop_summary_i18n.PAIN_ASSESSMENT+" (",paLen,")");
if(paLen>maxColumnsToDisplay){var jsPaShowAllSec=[];
for(var i=maxColumnsToDisplay;
i<paLen;
i++){var paItem=paObj[i];
pushDataValue(paItem.LOCATION,pnLoc,paLoc);
if(paItem.INTENSITY_RATING){if(!isNaN(paItem.INTENSITY_RATING)){var rtg=paItem.INTENSITY_RATING;
if(parseFloat(paItem.INTENSITY_RATING)!=parseInt(paItem.INTENSITY_RATING,10)){rtg=MP_Util.Measurement.SetPrecision(paItem.INTENSITY_RATING,1);
}paIntensity.push(rtg);
}else{paIntensity.push(paItem.INTENSITY_RATING);
}}else{pushNoResultIndicator(pnRtng,paIntensity);
}pushDataValue(paItem.SCALE_USED,pnScl,paScale);
pushDataValue(paItem.QUALITY,pnQl,paQual);
pushDataValue(paItem.INTERVENTIONS,pnIntv,paIntervention);
if(paItem.DOC_DT_TM){paDocDt.push(df.formatISO8601(paItem.DOC_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR));
}paDocBy.push(paItem.DOC_BY);
}jsPaShowAllSec.push(psoBuildHd(i18n.discernabu.postop_summary_i18n.DOC_DT_TM,paDocDt,null));
paRowCnt=0;
jsPaShowAllSec.push(paBuildRow(true,postop_summary_i18n.DOC_BY+":",paDocBy));
jsPaShowAllSec.push(paBuildRow(paLocCd,postop_summary_i18n.PAIN_LOC+":",paLoc));
jsPaShowAllSec.push(paBuildRow(paIntensityCd,postop_summary_i18n.PAIN_INTENSITY_SCALE_RATE+":",paIntensity));
jsPaShowAllSec.push(paBuildRow(paScaleCd,postop_summary_i18n.PAIN_INTENSITY_SCALE_USED+":",paScale));
jsPaShowAllSec.push(paBuildRow(paQualCd,postop_summary_i18n.PAIN_QUALITY+":",paQual));
jsPaShowAllSec.push(paBuildRow(paInterventionCd,postop_summary_i18n.INTERVENTIONS+":",paIntervention));
var showAllDialog=new ModalDialog("showAllDialog_pso_pa").setHeaderTitle(postop_summary_i18n.PAIN_ASSESSMENT).setIsBodySizeFixed(false);
showAllDialog.setBodyDataFunction(function(modalObj){var dialogBodySec=[];
dialogBodySec.push("<div class='pso-full-scroll'><table class='pso-tbl-full'>");
dialogBodySec.push(jsPaShowAllSec.join(""));
dialogBodySec.push("</table></div>");
modalObj.setBodyHTML(dialogBodySec.join(""));
});
MP_ModalDialog.addModalDialogObject(showAllDialog);
sHtml="<a class='pso-show-all' onclick='MP_ModalDialog.showModalDialog(\"showAllDialog_pso_pa\");'>"+postop_summary_i18n.SHOW_ALL+"</a>";
jsPsoHTML.push(sHtml);
}jsPsoHTML.push("</span></h3><div class='sub-sec-content'><table class='pso-table'>",jsPaSec.join(""),"</table></div></div>");
}var totCodeCnt=ipCodeCnt+dwaCodeCnt+paCodeCnt;
if(totCodeCnt===0){jsPsoHTML.push(i18n.NO_DATA);
}var content=[];
content.push("<div class='",MP_Util.GetContentClass(component,numRows),"'>",jsPsoHTML.join(""),"</div>");
countText="";
MP_Util.Doc.FinalizeComponent(content.join(""),component,countText);
}catch(err){var errMsg=[];
errMsg.push("<b>",i18n.JS_ERROR,"</b><br><ul><li>",i18n.MESSAGE,": ",err.message,"</li><li>",i18n.NAME,": ",err.name,"</li><li>",i18n.NUMBER,": ",(err.number&65535),"</li><li>",i18n.DESCRIPTION,": ",err.description,"</li></ul>");
MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(),errMsg.join("")),component,"");
if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}}};
}();