function OrderHistoryOpt2ComponentStyle(){this.initByNamespace("ohx2");
}OrderHistoryOpt2ComponentStyle.inherits(ComponentStyle);
function OrderHistoryOpt2Component(criterion){this.setCriterion(criterion);
this.setLookBackDropDown(true);
this.setScope(2);
this.setScrollingEnabled(false);
this.setAlwaysExpanded(true);
this.setStyles(new OrderHistoryOpt2ComponentStyle());
this.setComponentLoadTimerName("USR:MPG.ORDERHISTORY.O2 - load component");
this.setComponentRenderTimerName("ENG:MPG.ORDERHISTORY.O2 - render component");
this.setIncludeLineNumber(true);
this.ohCatalogCodes=[];
this.ohOrdersArary=[];
this.ohSortField=4;
this.ohSortDirection=0;
this.ohStatusOpt=1;
OrderHistoryOpt2Component.method("setOHStatusOpt",function(value){this.ohStatusOpt=(value)?1:2;
});
OrderHistoryOpt2Component.method("getOHStatusOpt",function(){return(this.ohStatusOpt);
});
OrderHistoryOpt2Component.method("setOHCatalogCodes",function(value){this.ohCatalogCodes=value;
});
OrderHistoryOpt2Component.method("getOHCatalogCodes",function(){return(this.ohCatalogCodes);
});
OrderHistoryOpt2Component.method("InsertData",function(){this.ohSortDirection=0;
if(this.getGrouperFilterCatalogCodes()){CERN_ORDER_HISTORY_O2.loadCustomGroup(this,this.getGrouperFilterCatLabel(),this.getGrouperFilterCatalogCodes());
}else{CERN_ORDER_HISTORY_O2.getOrderHistoryData(this);
}});
OrderHistoryOpt2Component.method("resizeComponent",function(){var accordion=$("#AccordionContainer"+this.getComponentId());
var isExpanded=false;
if(accordion.length>0){isExpanded=accordion.hasClass("Expanded");
if(isExpanded){accordion.removeClass("Expanded");
}}MPageComponent.prototype.resizeComponent.call(this,null);
if(isExpanded&&accordion.length>0){accordion.addClass("Expanded");
}var contentBody=$("#"+this.getStyles().getContentId()).find(".content-body");
if(contentBody.length){var maxHeight=parseInt($(contentBody).css("max-height").replace("px",""),10);
var contentHeight=0;
contentBody.find(".ord2-hist-info").each(function(index){contentHeight+=$(this).outerHeight(true);
});
if(!isNaN(maxHeight)&&(contentHeight>maxHeight)){$("#OrdHistHdrRow"+this.getComponentId()).addClass("shifted");
}else{$("#OrdHistHdrRow"+this.getComponentId()).removeClass("shifted");
}}});
OrderHistoryOpt2Component.method("FilterRefresh",function(label,ccArray){this.ohSortDirection=0;
CERN_ORDER_HISTORY_O2.loadCustomGroup(this,label,ccArray);
});
OrderHistoryOpt2Component.method("HandleSuccess",function(reply){var timerRenderComponent=MP_Util.CreateTimer(this.getComponentRenderTimerName());
try{if(reply.getStatus()=="S"){CERN_ORDER_HISTORY_O2.renderComponent(this,reply.getResponse());
}else{var errMsg=[];
var countText="(0)";
if(reply.getStatus()=="F"){errMsg.push(reply.getError());
MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(),errMsg.join("<br />")),this,countText);
}else{MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(this.getStyles().getNameSpace()),this,countText);
}CERN_EventListener.fireEvent(this,this,EventListener.EVENT_COUNT_UPDATE,{count:0});
}}catch(err){if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}});
}OrderHistoryOpt2Component.inherits(MPageComponent);
var CERN_ORDER_HISTORY_O2=function(){function buildOHRows(rowObj){var rowHtml=[];
var ohi18n=i18n.discernabu.order_history_o2;
if(rowObj.COSIGN){rowHtml.push("<dd class='ordhistSprite ord2-hist-coicon' title='"+ohi18n.COSIGN+"'>&nbsp;</dd>");
}else{rowHtml.push("<dd class='ord2-hist-iconcol'>&nbsp;</dd>");
}if(rowObj.NRSREVIEW){rowHtml.push("<dd class='ordhistSprite ord2-hist-reicon' title='"+ohi18n.NURSE_REVIEW_HOVER+"'>&nbsp;</dd>");
}else{rowHtml.push("<dd class='ord2-hist-iconcol'>&nbsp;</dd>");
}if(rowObj.POWERPLAN>0){rowHtml.push("<dd class='ordhistSprite ord2-hist-ppicon' title='"+ohi18n.POWERPLAN_HOVER+"'>&nbsp;</dd>");
}else{rowHtml.push("<dd class='ord2-hist-iconcol'>&nbsp;</dd>");
}if(rowObj.CARESET){rowHtml.push("<dd class='ordhistSprite ord2-hist-csicon' title='"+ohi18n.CARESET_HOVER+"'>&nbsp;</dd>");
}else{rowHtml.push("<dd class='ord2-hist-iconcol'>&nbsp;</dd>");
}rowHtml.push("<dd class='ord2-hist-date'>",rowObj.UPDDTTM,"</dd>","<dd class='ord2-hist-ord'>",rowObj.ORDER,"</dd>","<dd class='ord2-hist-detail'>",rowObj.ORD_DETAILS,"</dd>","<dd class='ord2-hist-stat'>",rowObj.STATUS,"</dd>","<dd class='ord2-hist-updt'>",rowObj.UPDTBY,"</dd>","<dd class='ord2-hist-prov'>",rowObj.ORIGPROV,"</dd>","<dd class='ord2-hist-dept'>",rowObj.DEPT,"</dd>","<dd class='ord2-hist-orderdt'>",rowObj.ORIG_DTTM,"</dd></dl>");
var rowHtmlTxt=rowHtml.join("");
return rowHtmlTxt;
}return{getOrderHistoryData:function(component){var sendAr=[];
var criterion=null;
var ohCatCodes=[];
var statusFlag=1;
criterion=component.getCriterion();
ohCatCodes=MP_Util.CreateParamArray(component.getOHCatalogCodes(),1);
sendAr.push("^MINE^",criterion.person_id+".0",criterion.encntr_id+".0",criterion.provider_id+".0",criterion.ppr_cd+".0");
sendAr.push(component.getLookbackUnits(),component.getLookbackUnitTypeFlag(),component.getOHStatusOpt(),ohCatCodes);
var request=new MP_Core.ScriptRequest(component,component.getComponentLoadTimerName());
request.setProgramName("mp_get_order_history");
request.setParameters(sendAr);
request.setAsync(true);
MP_Core.XMLCCLRequestCallBack(component,request,function(reply){component.HandleSuccess(reply);
});
},loadCustomGroup:function(component,filterLabel,filterCCArray){var m_comp=component;
component.m_filterLabel=filterLabel;
var ohCatCodes=MP_Util.CreateParamArray(filterCCArray,1);
var criterion=m_comp.getCriterion();
var encntrOption=criterion.encntr_id+".0";
var sendAr=[];
sendAr.push("^MINE^",criterion.person_id+".0",encntrOption,criterion.provider_id+".0",criterion.ppr_cd+".0");
sendAr.push(component.getLookbackUnits(),component.getLookbackUnitTypeFlag(),component.getOHStatusOpt(),ohCatCodes);
var request=new MP_Core.ScriptRequest(component,component.getComponentLoadTimerName());
request.setProgramName("mp_get_order_history");
request.setParameters(sendAr);
request.setAsync(true);
MP_Core.XMLCCLRequestCallBack(component,request,function(reply){component.HandleSuccess(reply);
});
},renderComponent:function(component,recordData){var ordHTML=[];
var ordersArr=[];
var compNS=component.getStyles().getNameSpace();
var compId=component.getComponentId();
var elementObj=null;
var rowClass="";
var initHeight=0;
component.ohOrdersArray=[];
ordersArr=recordData.ORDERS;
var ordersLen=ordersArr.length;
CERN_ORDER_HISTORY_O2.buildOHOrdersArray(recordData,parseInt(compId,10));
ordHTML=CERN_ORDER_HISTORY_O2.createOHHeaders(parseInt(compId,10));
CERN_ORDER_HISTORY_O2.orderHistorySorter(2,4,compId);
if(window.innerHeight){initHeight=window.innerHeight-200;
}else{if(document.body){initHeight=document.body.clientHeight-200;
}}ordHTML.push("<div id='wrkflwContentBody",compId,"' class='content-body'>");
for(var x=0;
x<ordersLen;
x++){rowClass=(x%2)?"even":"odd";
ordHTML.push("<dl id='ord2-hist-tbl-rows' class='ord2-hist-info ",rowClass,"'>","<dt class='ord2-hist-dt'>&nbsp;</dt>");
ordHTML.push(component.ohOrdersArray[x].HTML);
}ordHTML.push("</div>");
var countText=MP_Util.CreateTitleText(component,ordersLen);
MP_Util.Doc.FinalizeComponent(ordHTML.join(""),component,countText);
var eventArg={count:ordersLen};
CERN_EventListener.fireEvent(component,component,EventListener.EVENT_COUNT_UPDATE,eventArg);
},buildOHOrdersArray:function(recordData,compId){var df=MP_Util.GetDateFormatter();
var ordHistory=recordData.ORDERS;
var prsnlArray=MP_Util.LoadPersonelListJSON(recordData.PRSNL);
var arrLen=ordHistory.length;
var comp=MP_Util.GetCompObjById(compId);
var updtName="";
var provName="";
var thisOrderAct=null;
var x=0;
var provNameFull="";
for(x=0;
x<arrLen;
x++){updtName=MP_Util.GetValueFromArray(ordHistory[x].STATUS_UPDT_BY_ID,prsnlArray);
provName=MP_Util.GetValueFromArray(ordHistory[x].PROVIDER_ID,prsnlArray);
provNameFull="--";
if(provName!==null&&provName.fullName){provNameFull=provName.fullName;
}thisOrderAct={COSIGN:ordHistory[x].COSIGN_IND,COSIGN_FLG:(ordHistory[x].COSIGN_IND)?1:0,NRSREVIEW:ordHistory[x].NURSE_REVIEW_IND,NRSREVIEW_FLG:(ordHistory[x].NURSE_REVIEW_IND)?1:0,POWERPLAN:ordHistory[x].POWERPLAN_ID,CARESET:ordHistory[x].CARESET_IND,UPDDTTM:df.formatISO8601(ordHistory[x].STATUS_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR),ORDER:ordHistory[x].ORDER_MNEMONIC,ORD_DETAILS:(ordHistory[x].ORDER_DETAIL)?ordHistory[x].ORDER_DETAIL:"&nbsp;",STATUS:ordHistory[x].ORDER_STATUS,UPDTBY:updtName.fullName,ORIGPROV:provNameFull,DEPT:ordHistory[x].DEPARTMENT,ORIG_DTTM:df.formatISO8601(ordHistory[x].ORIG_ORDER_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR),HTML:""};
thisOrderAct.HTML=buildOHRows(thisOrderAct);
comp.ohOrdersArray.push(thisOrderAct);
}},createOHHeaders:function(compId){var ohi18n=i18n.discernabu.order_history_o2;
var hdrHTML=[];
hdrHTML.push("<div>");
hdrHTML.push("<dl class='ord2-hist-info-hdr hdr' id='OrdHistHdrRow",compId,"'><dt class='ord2-hist-dt'>&nbsp;</dt>");
hdrHTML.push("<dd class='ord2-hist-info-hdr-sortIcon ordhistSprite ord2-hist-coiconcol' title='"+ohi18n.COSIGN_HOVER+"'; onclick='CERN_ORDER_HISTORY_O2.orderHistorySorter(1, 0, ",compId,"); return false;'><span class='ord2-hist-col-name'>&nbsp;</span></dd>");
hdrHTML.push("<dd class='ord2-hist-info-hdr-sortIcon ordhistSprite ord2-hist-reiconcol' title='"+ohi18n.NURSE_REVIEW_HOVER+"'; onclick='CERN_ORDER_HISTORY_O2.orderHistorySorter(1, 1, ",compId,"); return false;'><span class='ord2-hist-col-name'>&nbsp;</span></dd>");
hdrHTML.push("<dd class='ord2-hist-info-hdr-sortIcon ordhistSprite ord2-hist-ppiconcol' title='"+ohi18n.POWERPLAN_HOVER+"'; onclick = 'CERN_ORDER_HISTORY_O2.orderHistorySorter(1, 2, ",compId,"); return false;'><span class='ord2-hist-col-name'>&nbsp;</span></dd>");
hdrHTML.push("<dd class='ord2-hist-info-hdr-sortIcon ordhistSprite ord2-hist-csiconcol' title='"+ohi18n.CARESET_HOVER+"'; onclick = 'CERN_ORDER_HISTORY_O2.orderHistorySorter(1, 3, ",compId,"); return false;'><span class='ord2-hist-col-name'>&nbsp;</span></dd>");
hdrHTML.push("<dd class='ord2-hist-info-hdr-sortIcon ord2-hist-datecol hdr' onclick='CERN_ORDER_HISTORY_O2.orderHistorySorter(2, 4, ",compId,"); return false;'>",ohi18n.STATUS_DT_TM,"</dd>");
hdrHTML.push("<dd class='ord2-hist-info-hdr-sortIcon ord2-hist-ordcol hdr' onclick='CERN_ORDER_HISTORY_O2.orderHistorySorter(1, 5, ",compId,"); return false;'>",ohi18n.ORDER_NAME,"</dd>");
hdrHTML.push("<dd class='ord2-hist-info-hdr-sortIcon ord2-hist-detailcol hdr' onclick='CERN_ORDER_HISTORY_O2.orderHistorySorter(1, 6, ",compId,"); return false;'>",ohi18n.ORDER_DETAIL,"</dd>");
hdrHTML.push("<dd class='ord2-hist-info-hdr-sortIcon ord2-hist-statcol hdr' onclick='CERN_ORDER_HISTORY_O2.orderHistorySorter(1, 7, ",compId,"); return false;'>",ohi18n.STATUS,"</dd>");
hdrHTML.push("<dd class='ord2-hist-info-hdr-sortIcon ord2-hist-updtcol hdr' onclick='CERN_ORDER_HISTORY_O2.orderHistorySorter(1, 8, ",compId,"); return false;'>",ohi18n.UPDATED_BY,"</dd>");
hdrHTML.push("<dd class='ord2-hist-info-hdr-sortIcon ord2-hist-provcol hdr' onclick='CERN_ORDER_HISTORY_O2.orderHistorySorter(1, 9, ",compId,"); return false;'>",ohi18n.PROVIDER,"</dd>");
hdrHTML.push("<dd class='ord2-hist-info-hdr-sortIcon ord2-hist-deptcol hdr' onclick='CERN_ORDER_HISTORY_O2.orderHistorySorter(1, 10, ",compId,"); return false;'>",ohi18n.DEPARTMENT,"</dd>");
hdrHTML.push("<dd class='ord2-hist-info-hdr-sortIcon ord2-hist-orderdtcol hdr' onclick='CERN_ORDER_HISTORY_O2.orderHistorySorter(2, 11, ",compId,"); return false;'>",ohi18n.ORDER_DT_TM,"</dd></dl></div>");
return hdrHTML;
},updateOHRowHTML:function(compId){var sHTML=[];
var sortedHTML="";
var rowClass="";
var comp=MP_Util.GetCompObjById(compId);
var compNS=comp.getStyles().getNameSpace();
var ordersLen=comp.ohOrdersArray.length;
var initHeight=0;
sHTML=CERN_ORDER_HISTORY_O2.createOHHeaders(compId);
if(window.innerHeight){initHeight=window.innerHeight-200;
}else{if(document.body){initHeight=document.body.clientHeight;
}}sHTML.push("<div id='wrkflwContentBody",compId,"' class='content-body' style='max-height:",initHeight,"px'>");
for(i=0;
i<ordersLen;
i++){rowClass=(i%2)?"even":"odd";
sHTML.push("<dl id='ordHistTblRows",compId,"' class='ord2-hist-info ",rowClass,"'>","<dt class='ord2-hist-dt'>&nbsp;</dt>");
sHTML.push(comp.ohOrdersArray[i].HTML);
}sHTML.push("</div>");
sortedHTML=sHTML.join("");
var countText=MP_Util.CreateTitleText(comp,ordersLen);
MP_Util.Doc.FinalizeComponent(sortedHTML,comp,countText);
var eventArg={count:ordersLen};
CERN_EventListener.fireEvent(comp,comp,EventListener.EVENT_COUNT_UPDATE,eventArg);
},orderHistorySorter:function(type,fieldIdx,compId){var order=0;
var textA="";
var textB="";
var comp=MP_Util.GetCompObjById(compId);
function sortbyText(a,b){switch(fieldIdx){case 0:textA=a.COSIGN;
textB=b.COSIGN;
break;
case 1:textA=a.NRSREVIEW;
textB=b.NRSREVIEW;
break;
case 2:textA=a.POWERPLAN;
textB=b.POWERPLAN;
break;
case 3:textA=a.CARESET;
textB=b.CARESET;
break;
case 5:textA=a.ORDER.toLowerCase();
textB=b.ORDER.toLowerCase();
break;
case 6:textA=a.ORD_DETAILS.toLowerCase();
textB=b.ORD_DETAILS.toLowerCase();
break;
case 7:textA=a.STATUS.toLowerCase();
textB=b.STATUS.toLowerCase();
break;
case 8:textA=a.UPDTBY.toLowerCase();
textB=b.UPDTBY.toLowerCase();
break;
case 9:textA=a.ORIGPROV.toLowerCase();
textB=b.ORIGPROV.toLowerCase();
break;
case 10:textA=a.DEPT.toLowerCase();
textB=b.DEPT.toLowerCase();
break;
}var sortRes=0;
if(textA>textB){sortRes=1;
}else{if(textA<textB){sortRes=-1;
}else{sortRes=0;
}}if(order===1){sortRes=sortRes*-1;
}return sortRes;
}function sortbyDate(a,b){switch(fieldIdx){case 4:dateA=new Date(a.UPDDTTM);
dateB=new Date(b.UPDDTTM);
break;
case 11:dateA=new Date(a.ORIG_DTTM);
dateB=new Date(b.ORIG_DTTM);
break;
}if(order===1){return dateB-dateA;
}else{return dateA-dateB;
}}if(fieldIdx===comp.ohSortField){if(comp.ohSortDirection===0){order=1;
}else{order=0;
}}comp.ohSortField=fieldIdx;
comp.ohSortDirection=order;
switch(type){case 1:comp.ohOrdersArray.sort(sortbyText);
break;
case 2:comp.ohOrdersArray.sort(sortbyDate);
break;
}CERN_ORDER_HISTORY_O2.updateOHRowHTML(compId);
var spnPar=_g("OrdHistHdrRow"+compId);
var tdAr=Util.Style.g("ord2-hist-info-hdr-sortIcon",spnPar,"DD");
var tlen=tdAr.length;
for(var t=0;
t<tlen;
t++){var dd=tdAr[t];
if(t==fieldIdx&&t>=4){if(order===1){Util.Style.acss(dd,"descend");
if(!Util.Style.ccss(dd,"ascend")){Util.Style.rcss(dd,"ascend");
}}else{Util.Style.acss(dd,"ascend");
if(!Util.Style.ccss(dd,"descend")){Util.Style.rcss(dd,"descend");
}}}else{if(Util.Style.ccss(dd,"descend")){Util.Style.rcss(dd,"descend");
}if(Util.Style.ccss(dd,"ascend")){Util.Style.rcss(dd,"ascend");
}}}comp.resizeComponent();
}};
}();
