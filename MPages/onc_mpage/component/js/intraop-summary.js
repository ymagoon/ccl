function IntraopSummaryComponentStyle(){this.initByNamespace("ito");
}IntraopSummaryComponentStyle.inherits(ComponentStyle);
function IntraopSummaryComponent(criterion){this.drsTypeCodes=null;
this.drsItemCodes=null;
this.drsSiteDetCodes=null;
this.impTypeCodes=null;
this.impDescCodes=null;
this.impSerNumCodes=null;
this.impLotNumCodes=null;
this.impMfctCodes=null;
this.impCatNumCodes=null;
this.impSizeCodes=null;
this.impExpDtCodes=null;
this.impSiteCodes=null;
this.impQtyCodes=null;
this.culCodes=null;
this.specCodes=null;
this.devTypeCodes=null;
this.devSetCodes=null;
this.tqtTypeCodes=null;
this.tqtTimeCodes=null;
this.eventCodes=null;
this.setResourceRequired(true);
this.m_periopCaseObj=null;
this.setCriterion(criterion);
this.setStyles(new IntraopSummaryComponentStyle());
this.setComponentLoadTimerName("USR:MPG.INTRAOP.SUMMARY.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.INTRAOP.SUMMARY.O1 - render component");
this.setIncludeLineNumber(false);
this.setScope(3);
IntraopSummaryComponent.method("InsertData",function(){CERN_INTRAOP_SUMMARY_O1.GetIntraopSummary(this);
});
IntraopSummaryComponent.method("HandleSuccess",function(recordData){CERN_INTRAOP_SUMMARY_O1.RenderComponent(this,recordData);
});
IntraopSummaryComponent.method("RetrieveRequiredResources",function(){var caseResource=MP_Resources.getSharedResource("periopCaseIds");
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
IntraopSummaryComponent.method("loadCaseData",function(element,caseData){try{var casesJSON=JSON.parse(caseData).CASES_REC;
var periopCase=new MP_Core.PeriopCases();
var countDown=casesJSON.PROC_CNTDWN;
periopCase.setCaseID(casesJSON.CASE_ID);
periopCase.setDays(countDown.DAYS);
periopCase.setHours(countDown.HOURS);
periopCase.setMins(countDown.MINS);
periopCase.setCntdwnDscFlg(countDown.CNTDWN_DESC_FLAG);
this.m_periopCaseObj=periopCase;
CERN_INTRAOP_SUMMARY_O1.GetIntraopSummary(this);
}catch(err){MP_Util.LogJSError(err,this,"intraop-summary.js","loadCaseData");
var errMsg=[];
errMsg.push("<strong>",i18n.JS_ERROR,"</strong><br><ul><li>",i18n.MESSAGE,": ",err.message,"</li><li>",i18n.NAME,": ",err.name,"</li><li>",i18n.NUMBER,": ",(err.number&65535),"</li><li>",i18n.DESCRIPTION,": ",err.description,"</li></ul>");
MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(),errMsg.join("")),this,"");
}});
IntraopSummaryComponent.method("openTab",function(){var criterion=this.getCriterion();
var sParms="/PERSONID="+criterion.person_id+" /ENCNTRID="+criterion.encntr_id+" /FIRSTTAB=^"+this.getLink()+"+^";
APPLINK(0,criterion.executable,sParms);
this.InsertData();
});
}IntraopSummaryComponent.inherits(MPageComponent);
var CERN_INTRAOP_SUMMARY_O1=function(){function buildHvr(hdHvr,idx){var itoHvr=["<h4 class='det-hd'><span>",i18n.discernabu.intraop_summary_o1.RESULT_DETAILS,"</span></h4><div class='hvr'><dl><dt><span>",hdHvr[0],":</span></dt><dd><span>",hdHvr[idx],"</span></dd></dl></div>"];
return itoHvr.join("");
}function itoBuildHd(hdRowLbl,hdData,hdHvr){var itoHd=["<tr><th>&nbsp;</th>"];
for(var dataIdx=0,lmt=hdData.length;
dataIdx<lmt;
dataIdx++){itoHd.push("<th><dl class='ito-info'><dt>",hdRowLbl,":</dt><dd>",hdData[dataIdx],"</dd></dl>",(hdHvr&&hdHvr[dataIdx+1])?buildHvr(hdHvr,dataIdx+1):"","</th>");
}itoHd.push("</tr>");
return itoHd.join("");
}function itoBuildRow(rowNum,rowName,rowData){var rowClass="odd";
if(rowNum%2===0){rowClass="even";
}var itoRow=["<tr class='",rowClass,"'><td class='ito-lbl'><span class='row-lbl'>",rowName,"</span></td>"];
for(var dataIdx=0,lmt=rowData.length;
dataIdx<lmt;
dataIdx++){itoRow.push("<td class='ito-res'><dl class='ito-info'><dt>",rowName,"</dt><dd>",rowData[dataIdx],"</dd></dl></td>");
}itoRow.push("</tr>");
return itoRow.join("");
}return{noResultIndicator:"--",GetIntraopSummary:function(component){var sendAr=[];
var criterion=component.getCriterion();
var periopCase=component.m_periopCaseObj;
var case_id=periopCase.getCaseID();
if(!case_id){case_id=0;
}var itoGroups=component.getGroups();
var itoGroupLen=itoGroups.length;
function convertIDsToFloats(iDList){if(iDList){for(var i=iDList.length;
i--;
){iDList[i]+=".0";
}}}function formatForCodeList(eventCodeList){if(eventCodeList&&eventCodeList.length){return eventCodeList.length+".0, "+eventCodeList.join(", ");
}}for(var i=itoGroupLen;
i--;
){var curGroup=itoGroups[i];
var curCodes=curGroup.getEventCodes();
var groupName=curGroup.getGroupName();
convertIDsToFloats(curCodes);
switch(groupName){case"INTRAOP_DRESS_TYPE":component.drsTypeCodes=formatForCodeList(curCodes);
break;
case"INTRAOP_DRESS_ITEM":component.drsItemCodes=formatForCodeList(curCodes);
break;
case"INTRAOP_DRESS_SITE":component.drsSiteDetCodes=formatForCodeList(curCodes);
break;
case"INTRAOP_IMPLANT_EXPLANT":component.impTypeCodes=formatForCodeList(curCodes);
break;
case"INTRAOP_IMPLANT_DESC":component.impDescCodes=formatForCodeList(curCodes);
break;
case"INTRAOP_IMPLANT_SERIAL_NBR":component.impSerNumCodes=formatForCodeList(curCodes);
break;
case"INTRAOP_IMPLANT_LOT_NBR":component.impLotNumCodes=formatForCodeList(curCodes);
break;
case"INTRAOP_IMPLANT_MANU":component.impMfctCodes=formatForCodeList(curCodes);
break;
case"INTRAOP_IMPLANT_CAT_NBR":component.impCatNumCodes=formatForCodeList(curCodes);
break;
case"INTRAOP_IMPLANT_SIZE":component.impSizeCodes=formatForCodeList(curCodes);
break;
case"INTRAOP_IMPLANT_EXP_DT":component.impExpDtCodes=formatForCodeList(curCodes);
break;
case"INTRAOP_IMPLANT_SITE":component.impSiteCodes=formatForCodeList(curCodes);
break;
case"INTRAOP_IMPLANT_QTY":component.impQtyCodes=formatForCodeList(curCodes);
break;
case"INTRAOP_CULT_ORD":component.culCodes=formatForCodeList(curCodes);
break;
case"INTRAOP_SPEC_ORD":component.specCodes=formatForCodeList(curCodes);
break;
case"INTRAOP_DEVICE_TYPE":component.devTypeCodes=formatForCodeList(curCodes);
break;
case"INTRAOP_DEVICE_SET":component.devSetCodes=formatForCodeList(curCodes);
break;
case"INTRAOP_TOURN_TYPE":component.tqtTypeCodes=formatForCodeList(curCodes);
break;
case"INTRAOP_TOURN_TIME":component.tqtTimeCodes=formatForCodeList(curCodes);
break;
default:}}var tmpCodeList=[];
if(component.drsTypeCodes){tmpCodeList.push(component.drsTypeCodes);
}if(component.drsItemCodes){tmpCodeList.push(component.drsItemCodes);
}if(component.drsSiteDetCodes){tmpCodeList.push(component.drsSiteDetCodes);
}var drsEventCodes=formatForCodeList(tmpCodeList);
tmpCodeList=[];
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
}var impEventCodes=formatForCodeList(tmpCodeList);
tmpCodeList=[];
if(component.culCodes){tmpCodeList.push(component.culCodes);
}if(component.specCodes){tmpCodeList.push(component.specCodes);
}var culEventCodes=formatForCodeList(tmpCodeList);
tmpCodeList=[];
if(component.devTypeCodes){tmpCodeList.push(component.devTypeCodes);
}if(component.devSetCodes){tmpCodeList.push(component.devSetCodes);
}var devEventCodes=formatForCodeList(tmpCodeList);
tmpCodeList=[];
if(component.tqtTypeCodes){tmpCodeList.push(component.tqtTypeCodes);
}if(component.tqtTimeCodes){tmpCodeList.push(component.tqtTimeCodes);
}var tqtEventCodes=formatForCodeList(tmpCodeList);
tmpCodeList=[];
if(drsEventCodes){tmpCodeList.push(drsEventCodes);
}if(impEventCodes){tmpCodeList.push(impEventCodes);
}if(culEventCodes){tmpCodeList.push(culEventCodes);
}if(devEventCodes){tmpCodeList.push(devEventCodes);
}if(tqtEventCodes){tmpCodeList.push(tqtEventCodes);
}var allEventCodes=formatForCodeList(tmpCodeList);
component.allEventCodes=(allEventCodes&&allEventCodes.length)?"value("+allEventCodes+")":"0.0";
sendAr.push("^MINE^",criterion.person_id+".0",case_id+".0",criterion.provider_id+".0",criterion.ppr_cd+".0",component.allEventCodes);
MP_Core.XMLCclRequestWrapper(component,"MP_GET_INTRAOP_SUMMARY_v2",sendAr,true);
},convertDataArrayToTableArray:function(dataArray,columnsToDisplay,putFirstRowInHover){var entryNumbers=[];
var colCnt=dataArray[0].length-1;
var itoHTMLTable=[];
var rowStart;
var entryNum=colCnt;
if(columnsToDisplay===0){columnsToDisplay=colCnt;
}for(var entryIdx=1;
entryIdx<=columnsToDisplay;
entryIdx++){if(entryNum>0){entryNumbers.push(i18n.discernabu.intraop_summary_o1.ENTRY+" "+entryNum);
entryNum--;
}else{entryNumbers.push("&nbsp");
}}if(putFirstRowInHover){itoHTMLTable.push(itoBuildHd(i18n.discernabu.intraop_summary_o1.ENTRY,entryNumbers,dataArray[0]));
rowStart=1;
}else{itoHTMLTable.push(itoBuildHd(i18n.discernabu.intraop_summary_o1.ENTRY,entryNumbers,null));
rowStart=0;
}for(var rowIdx=rowStart,lmt=dataArray.length;
rowIdx<lmt;
rowIdx++){var tempRowData=[];
for(var colIdx=1;
colIdx<=columnsToDisplay;
colIdx++){if(dataArray[rowIdx][colIdx]&&dataArray[rowIdx][colIdx].length){tempRowData.push(dataArray[rowIdx][colIdx]);
}else{tempRowData.push(CERN_INTRAOP_SUMMARY_O1.noResultIndicator);
}}itoHTMLTable.push(itoBuildRow(rowIdx,dataArray[rowIdx][0]+":",tempRowData));
}return itoHTMLTable.join("");
},RenderComponent:function(component,recordData){var filterCheckObj={};
function isMapped(filterMeans){for(var i=filterMeans.length;
i--;
){if(typeof filterCheckObj[filterMeans[i]]!="undefined"){return true;
}}}var timerRenderComponent=MP_Util.CreateTimer(component.getComponentRenderTimerName());
try{var criterion=component.getCriterion();
var periopCase=component.m_periopCaseObj;
var case_id=periopCase.getCaseID();
var df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
var intraop_summary_o1=i18n.discernabu.intraop_summary_o1;
var groups=component.getGroups();
var sectionData=recordData.SECTIONS;
var dressMns=["INTRAOP_DRESS_TYPE","INTRAOP_DRESS_ITEM","INTRAOP_DRESS_SITE"];
var implntMns=["INTRAOP_IMPLANT_EXPLANT","INTRAOP_IMPLANT_DESC","INTRAOP_IMPLANT_SERIAL_NBR","INTRAOP_IMPLANT_LOT_NBR","INTRAOP_IMPLANT_MANU","INTRAOP_IMPLANT_CAT_NBR","INTRAOP_IMPLANT_SIZE","INTRAOP_IMPLANT_EXP_DT","INTRAOP_IMPLANT_SITE","INTRAOP_IMPLANT_QTY"];
var cultMns=["INTRAOP_CULT_ORD","INTRAOP_SPEC_ORD"];
var devMns=["INTRAOP_DEVICE_TYPE","INTRAOP_DEVICE_SET"];
var tqtMns=["INTRAOP_TOURN_TYPE","INTRAOP_TOURN_TIME"];
var jsItoHTML=[];
var sectionHTML;
var colList=[];
var numRows=0;
var itoTotCodeCnt=0;
var sHtml="";
var maxColumnsToDisplay=3;
var colCnt;
var codeCnt;
var eventList=[];
var rowIdx;
var tempResult;
var sectionCnt=0;
if(groups.length===0){jsItoHTML.push(i18n.NO_DATA);
var content=[];
content.push("<div class='",MP_Util.GetContentClass(component,numRows),"'>",jsItoHTML.join(""),"</div>");
MP_Util.Doc.FinalizeComponent(content.join(""),component,"");
return;
}for(var i=groups.length;
i--;
){var group=groups[i];
filterCheckObj[group.m_groupName]=true;
}if(isMapped(dressMns)){sectionCnt++;
numRows+=1;
var drsArray=[];
drsArray.push([intraop_summary_o1.DOC_BY]);
if(component.drsTypeCodes){drsArray.push([intraop_summary_o1.TYPE]);
}if(component.drsItemCodes){drsArray.push([intraop_summary_o1.ITEMS]);
}if(component.drsSiteDetCodes){drsArray.push([intraop_summary_o1.SITE_DETAILS]);
}codeCnt=drsArray.length-1;
numRows+=codeCnt;
colList=[];
for(var sectIdx=0,lmt=sectionData.length;
sectIdx<lmt;
sectIdx++){if(sectionData[sectIdx].SEQ===sectionCnt){colList=sectionData[sectIdx].INSTANCES;
}}colCnt=colList.length;
if(colCnt){for(var colIdx=0;
colIdx<colCnt;
colIdx++){drsArray[0][colIdx+1]=colList[colIdx].DOC_BY;
eventList=colList[colIdx].EVENTS;
for(var eventIdx=0,lmt=eventList.length;
eventIdx<lmt;
eventIdx++){rowIdx=eventList[eventIdx].SEQ;
tempResult=eventList[eventIdx].RESULT;
drsArray[rowIdx][colIdx+1]=tempResult;
}}}sectionHTML=CERN_INTRAOP_SUMMARY_O1.convertDataArrayToTableArray(drsArray,maxColumnsToDisplay,true);
itoTotCodeCnt+=codeCnt;
jsItoHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title="+intraop_summary_o1.HIDE_SECTION+">-</span><span class='sub-sec-title'>"+intraop_summary_o1.DRESSING_PACK+" (",colList.length,")");
if(colCnt>maxColumnsToDisplay){var showAllDialog=new ModalDialog("showAllDialog_ito_dre").setHeaderTitle(intraop_summary_o1.DRESSING_PACK).setIsBodySizeFixed(false);
showAllDialog.setBodyDataFunction(function(modalObj){var dialogBodySec=[];
dialogBodySec.push("<div class='ito-full-scroll'><table class='ito-tbl-full'>");
dialogBodySec.push(CERN_INTRAOP_SUMMARY_O1.convertDataArrayToTableArray(drsArray,0,false));
dialogBodySec.push("</table></div>");
modalObj.setBodyHTML(dialogBodySec.join(""));
});
MP_ModalDialog.addModalDialogObject(showAllDialog);
sHtml="<a class='ito-show-all' onclick='MP_ModalDialog.showModalDialog(\"showAllDialog_ito_dre\");'>"+intraop_summary_o1.SHOW_ALL+"</a>";
jsItoHTML.push(sHtml);
}jsItoHTML.push("</span></h3><div class='sub-sec-content'><table class='ito-table'>",sectionHTML,"</table></div></div>");
}if(isMapped(implntMns)){sectionCnt++;
var sizeIdx;
var expDateIdx;
numRows+=1;
var impArray=[];
impArray.push([intraop_summary_o1.DOC_BY]);
if(component.impTypeCodes){impArray.push([intraop_summary_o1.IMPLNT_EXPLNT]);
}if(component.impDescCodes){impArray.push([intraop_summary_o1.DESC]);
}if(component.impSerNumCodes){impArray.push([intraop_summary_o1.SER_NUM]);
}if(component.impLotNumCodes){impArray.push([intraop_summary_o1.LOT_NUM]);
}if(component.impMfctCodes){impArray.push([intraop_summary_o1.MANUFACTURER]);
}if(component.impCatNumCodes){impArray.push([intraop_summary_o1.CAT_NUM]);
}if(component.impSizeCodes){impArray.push([intraop_summary_o1.SIZE]);
sizeIdx=(impArray.length-1);
}if(component.impExpDtCodes){impArray.push([intraop_summary_o1.EXP_DT]);
expDateIdx=(impArray.length-1);
}if(component.impSiteCodes){impArray.push([intraop_summary_o1.IMPLNT_SITE]);
}if(component.impQtyCodes){impArray.push([intraop_summary_o1.QNTY]);
}codeCnt=impArray.length-1;
numRows+=codeCnt;
colList=[];
for(var sectIdx=0,lmt=sectionData.length;
sectIdx<lmt;
sectIdx++){if(sectionData[sectIdx].SEQ===sectionCnt){colList=sectionData[sectIdx].INSTANCES;
}}colCnt=colList.length;
if(colCnt){for(var colIdx=0;
colIdx<colCnt;
colIdx++){impArray[0][colIdx+1]=colList[colIdx].DOC_BY;
eventList=colList[colIdx].EVENTS;
for(var eventIdx=0,lmt=eventList.length;
eventIdx<lmt;
eventIdx++){rowIdx=eventList[eventIdx].SEQ;
tempResult=eventList[eventIdx].RESULT;
if(rowIdx===sizeIdx){var splitVal=tempResult.toString().split("|");
if(!isNaN(splitVal[0])){if(parseFloat(splitVal[0])!=parseInt(splitVal[0],10)){splitVal[0]=MP_Util.Measurement.SetPrecision(splitVal[0],1);
}tempResult=splitVal[0];
if(splitVal[1]){tempResult=tempResult+" "+splitVal[1];
}}}if(rowIdx===expDateIdx){tempResult=df.formatISO8601(tempResult,mp_formatter.DateTimeFormatter.SHORT_DATE_2YEAR);
}impArray[rowIdx][colIdx+1]=tempResult;
}}}sectionHTML=CERN_INTRAOP_SUMMARY_O1.convertDataArrayToTableArray(impArray,maxColumnsToDisplay,true);
itoTotCodeCnt+=codeCnt;
jsItoHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title="+intraop_summary_o1.HIDE_SECTION+">-</span><span class='sub-sec-title'>"+intraop_summary_o1.IMPLNT_PROSTHETIC+" (",colCnt,")");
if(colCnt>maxColumnsToDisplay){var showAllDialog=new ModalDialog("showAllDialog_ito_imp").setHeaderTitle(intraop_summary_o1.IMPLNT_PROSTHETIC).setIsBodySizeFixed(false);
showAllDialog.setBodyDataFunction(function(modalObj){var dialogBodySec=[];
dialogBodySec.push("<div class='ito-full-scroll'><table class='ito-tbl-full'>");
dialogBodySec.push(CERN_INTRAOP_SUMMARY_O1.convertDataArrayToTableArray(impArray,0,false));
dialogBodySec.push("</table></div>");
modalObj.setBodyHTML(dialogBodySec.join(""));
});
MP_ModalDialog.addModalDialogObject(showAllDialog);
sHtml="<a class='ito-show-all' onclick='MP_ModalDialog.showModalDialog(\"showAllDialog_ito_imp\");'>"+intraop_summary_o1.SHOW_ALL+"</a>";
jsItoHTML.push(sHtml);
var showAllDialog=new ModalDialog("showAllDialog_ito_imp");
}jsItoHTML.push("</span></h3><div class='sub-sec-content'><table class='ito-table'>",sectionHTML,"</table></div></div>");
}if(isMapped(cultMns)){sectionCnt++;
numRows+=1;
var cultArray=[];
cultArray.push([intraop_summary_o1.DOC_BY]);
if(component.culCodes){cultArray.push([intraop_summary_o1.CULTURE_ORDRS_PLCD]);
}if(component.specCodes){cultArray.push([intraop_summary_o1.SPEC_ORDRS_PLCD]);
}codeCnt=cultArray.length-1;
numRows+=codeCnt;
colList=[];
for(var sectIdx=0,lmt=sectionData.length;
sectIdx<lmt;
sectIdx++){if(sectionData[sectIdx].SEQ===sectionCnt){colList=sectionData[sectIdx].INSTANCES;
}}colCnt=colList.length;
if(colCnt){for(var colIdx=0;
colIdx<colCnt;
colIdx++){cultArray[0][colIdx+1]=colList[colIdx].DOC_BY;
eventList=colList[colIdx].EVENTS;
for(var eventIdx=0,lmt=eventList.length;
eventIdx<lmt;
eventIdx++){rowIdx=eventList[eventIdx].SEQ;
tempResult=eventList[eventIdx].RESULT;
cultArray[rowIdx][colIdx+1]=tempResult;
}}}sectionHTML=CERN_INTRAOP_SUMMARY_O1.convertDataArrayToTableArray(cultArray,maxColumnsToDisplay,true);
itoTotCodeCnt+=codeCnt;
jsItoHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title="+intraop_summary_o1.HIDE_SECTION+">-</span><span class='sub-sec-title'>"+intraop_summary_o1.CULT_SPEC+" (",colList.length,")");
if(colCnt>maxColumnsToDisplay){var showAllDialog=new ModalDialog("showAllDialog_ito_cult").setHeaderTitle(intraop_summary_o1.CULT_SPEC).setIsBodySizeFixed(false);
showAllDialog.setBodyDataFunction(function(modalObj){var dialogBodySec=[];
dialogBodySec.push("<div class='ito-full-scroll'><table class='ito-tbl-full'>");
dialogBodySec.push(CERN_INTRAOP_SUMMARY_O1.convertDataArrayToTableArray(cultArray,0,false));
dialogBodySec.push("</table></div>");
modalObj.setBodyHTML(dialogBodySec.join(""));
});
MP_ModalDialog.addModalDialogObject(showAllDialog);
sHtml="<a class='ito-show-all' onclick='MP_ModalDialog.showModalDialog(\"showAllDialog_ito_cult\");'>"+intraop_summary_o1.SHOW_ALL+"</a>";
jsItoHTML.push(sHtml);
}jsItoHTML.push("</span></h3><div class='sub-sec-content'><table class='ito-table'>",sectionHTML,"</table></div></div>");
}if(isMapped(devMns)){sectionCnt++;
numRows+=1;
var devArray=[];
devArray.push([intraop_summary_o1.DOC_BY]);
if(component.devTypeCodes){devArray.push([intraop_summary_o1.TYPE]);
}if(component.devSetCodes){devArray.push([intraop_summary_o1.SETTING]);
}codeCnt=devArray.length-1;
numRows+=codeCnt;
colList=[];
for(var sectIdx=0,lmt=sectionData.length;
sectIdx<lmt;
sectIdx++){if(sectionData[sectIdx].SEQ===sectionCnt){colList=sectionData[sectIdx].INSTANCES;
}}colCnt=colList.length;
if(colCnt){for(var colIdx=0;
colIdx<colCnt;
colIdx++){devArray[0][colIdx+1]=colList[colIdx].DOC_BY;
eventList=colList[colIdx].EVENTS;
for(var eventIdx=0,lmt=eventList.length;
eventIdx<lmt;
eventIdx++){rowIdx=eventList[eventIdx].SEQ;
tempResult=eventList[eventIdx].RESULT;
devArray[rowIdx][colIdx+1]=tempResult;
}}}sectionHTML=CERN_INTRAOP_SUMMARY_O1.convertDataArrayToTableArray(devArray,maxColumnsToDisplay,true);
itoTotCodeCnt+=codeCnt;
jsItoHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title="+intraop_summary_o1.HIDE_SECTION+">-</span><span class='sub-sec-title'>"+intraop_summary_o1.DEVICES+" (",colList.length,")");
if(colCnt>maxColumnsToDisplay){var showAllDialog=new ModalDialog("showAllDialog_ito_dev").setHeaderTitle(intraop_summary_o1.DEVICES).setIsBodySizeFixed(false);
showAllDialog.setBodyDataFunction(function(modalObj){var dialogBodySec=[];
dialogBodySec.push("<div class='ito-full-scroll'><table class='ito-tbl-full'>");
dialogBodySec.push(CERN_INTRAOP_SUMMARY_O1.convertDataArrayToTableArray(devArray,0,false));
dialogBodySec.push("</table></div>");
modalObj.setBodyHTML(dialogBodySec.join(""));
});
MP_ModalDialog.addModalDialogObject(showAllDialog);
sHtml="<a class='ito-show-all' onclick='MP_ModalDialog.showModalDialog(\"showAllDialog_ito_dev\");'>"+intraop_summary_o1.SHOW_ALL+"</a>";
jsItoHTML.push(sHtml);
}jsItoHTML.push("</span></h3><div class='sub-sec-content'><table class='ito-table'>",sectionHTML,"</table></div></div>");
}if(isMapped(tqtMns)){sectionCnt++;
var totTimeIdx;
numRows+=1;
var tqtArray=[];
tqtArray.push([intraop_summary_o1.DOC_BY]);
if(component.tqtTypeCodes){tqtArray.push([intraop_summary_o1.TYPE]);
}if(component.tqtTimeCodes){tqtArray.push([intraop_summary_o1.TOTAL_TIME]);
totTimeIdx=(tqtArray.length-1);
}codeCnt=tqtArray.length-1;
numRows+=codeCnt;
colList=[];
for(var sectIdx=0,lmt=sectionData.length;
sectIdx<lmt;
sectIdx++){if(sectionData[sectIdx].SEQ===sectionCnt){colList=sectionData[sectIdx].INSTANCES;
}}colCnt=colList.length;
if(colCnt){for(var colIdx=0;
colIdx<colCnt;
colIdx++){tqtArray[0][colIdx+1]=colList[colIdx].DOC_BY;
eventList=colList[colIdx].EVENTS;
for(var eventIdx=0,lmt=eventList.length;
eventIdx<lmt;
eventIdx++){rowIdx=eventList[eventIdx].SEQ;
tempResult=eventList[eventIdx].RESULT;
if(rowIdx===totTimeIdx){var splitVal=tempResult.toString().split("|");
if(!isNaN(splitVal[0])){if(parseFloat(splitVal[0])!=parseInt(splitVal[0],10)){splitVal[0]=MP_Util.Measurement.SetPrecision(splitVal[0],1);
}tempResult=splitVal[0];
if(splitVal[1]){tempResult=tempResult+" "+splitVal[1];
}}}tqtArray[rowIdx][colIdx+1]=tempResult;
}}}sectionHTML=CERN_INTRAOP_SUMMARY_O1.convertDataArrayToTableArray(tqtArray,maxColumnsToDisplay,true);
itoTotCodeCnt+=codeCnt;
jsItoHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title="+intraop_summary_o1.HIDE_SECTION+">-</span><span class='sub-sec-title'>"+intraop_summary_o1.TOURQT+" (",colList.length,")");
if(colCnt>maxColumnsToDisplay){var showAllDialog=new ModalDialog("showAllDialog_ito_tqt").setHeaderTitle(intraop_summary_o1.TOURQT).setIsBodySizeFixed(false);
showAllDialog.setBodyDataFunction(function(modalObj){var dialogBodySec=[];
dialogBodySec.push("<div class='ito-full-scroll'><table class='ito-tbl-full'>");
dialogBodySec.push(CERN_INTRAOP_SUMMARY_O1.convertDataArrayToTableArray(tqtArray,0,false));
dialogBodySec.push("</table></div>");
modalObj.setBodyHTML(dialogBodySec.join(""));
});
MP_ModalDialog.addModalDialogObject(showAllDialog);
sHtml="<a class='ito-show-all' onclick='MP_ModalDialog.showModalDialog(\"showAllDialog_ito_tqt\");'>"+intraop_summary_o1.SHOW_ALL+"</a>";
jsItoHTML.push(sHtml);
}jsItoHTML.push("</span></h3><div class='sub-sec-content'><table class='ito-table'>",sectionHTML,"</table></div></div>");
}var rowCnt=numRows+itoTotCodeCnt;
if(itoTotCodeCnt===0){jsItoHTML.push(i18n.NO_DATA);
}var content=[];
content.push("<div class='",MP_Util.GetContentClass(component,numRows),"'>",jsItoHTML.join(""),"</div>");
MP_Util.Doc.FinalizeComponent(content.join(""),component,"");
}catch(err){var errMsg=[];
errMsg.push("<strong>",i18n.JS_ERROR,"</strong><br><ul><li>",i18n.MESSAGE,": ",err.message,"</li><li>",i18n.NAME,": ",err.name,"</li><li>",i18n.NUMBER,": ",(err.number&65535),"</li><li>",i18n.DESCRIPTION,": ",err.description,"</li></ul>");
MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(),errMsg.join("")),component,"");
if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}}};
}();
