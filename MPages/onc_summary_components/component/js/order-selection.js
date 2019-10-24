function OrderSelectionComponentStyle(){this.initByNamespace("ordsel");
}OrderSelectionComponentStyle.inherits(ComponentStyle);
function OrderSelectionComponent(criterion){this.setCriterion(criterion);
this.setStyles(new OrderSelectionComponentStyle());
this.setComponentLoadTimerName("USR:MPG.ORDERSELECTION.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.ORDERSELECTION.O1 - render component");
this.setIncludeLineNumber(true);
this.m_FolderIds=null;
this.m_ActiveDiv=null;
this.m_ActiveScratchPad=null;
this.m_modalScratchPadEnabled=false;
OrderSelectionComponent.method("setFavFolderId",function(value){if(this.m_FolderIds===null){this.m_FolderIds=[];
}this.m_FolderIds.push(value);
});
OrderSelectionComponent.method("getFavFolderId",function(){return this.m_FolderIds;
});
OrderSelectionComponent.method("InsertData",function(){CERN_ORDER_SELECTION_O1.GetOrderSelections(this);
});
OrderSelectionComponent.method("HandleSuccess",function(recordData){CERN_ORDER_SELECTION_O1.RenderComponent(this,recordData);
});
OrderSelectionComponent.method("UnCheckAllFavs",function(){CERN_ORDER_SELECTION_O1.DeselectAll(this);
});
OrderSelectionComponent.method("setActiveDiv",function(value){this.m_ActiveDiv=value;
});
OrderSelectionComponent.method("getActiveDiv",function(){return this.m_ActiveDiv;
});
OrderSelectionComponent.method("setActiveScratchPad",function(value){this.m_ActiveScratchPad=value;
});
OrderSelectionComponent.method("getActiveScratchPad",function(){return this.m_ActiveScratchPad;
});
OrderSelectionComponent.method("setModalScratchPadEnabled",function(value){this.m_modalScratchPadEnabled=(value===1?true:false);
});
OrderSelectionComponent.method("isModalScratchPadEnabled",function(){return this.m_modalScratchPadEnabled;
});
OrderSelectionComponent.method("RemoveFavorite",function(event,removeObject){CERN_ORDER_SELECTION_O1.SPModalDialogRemovesFavorite(this,event,removeObject);
});
OrderSelectionComponent.method("getSubsecArray",function(){var subsections={};
var component=this;
var compDOMObj=$("#"+component.getStyles().getId());
var contentBodyObj=$(compDOMObj).find(".content-body");
$(contentBodyObj).find(".sub-sec").each(function(){subsections[$(this).attr("id")]=($(this).hasClass("closed"))?false:true;
});
return subsections;
});
OrderSelectionComponent.method("getPreferencesObj",function(){var existingPreferences=MPageComponent.prototype.getPreferencesObj.call(this,null);
var newPreferences=this.getSubsecArray();
if($.isEmptyObject(newPreferences)){return existingPreferences;
}else{return newPreferences;
}});
CERN_EventListener.addListener(this,EventListener.EVENT_SCRATCHPAD_UPDATES_COMPONENT,this.RemoveFavorite,this);
}OrderSelectionComponent.inherits(MPageComponent);
OrderSelectionComponent.prototype.preProcessing=function(){MPageComponent.prototype.preProcessing.call(this);
var viewpointIndicator=(typeof m_viewpointJSON=="undefined")?false:true;
if(viewpointIndicator){this.setModalScratchPadEnabled(1);
}};
var CERN_ORDER_SELECTION_O1=function(){return{GetOrderSelections:function(component){var criterion=component.getCriterion();
var sendAr=[];
var style=component.getStyles();
var folderId=MP_Util.CreateParamArray(component.getFavFolderId(),1);
sendAr.push("^MINE^",criterion.person_id+".0",criterion.encntr_id+".0",criterion.provider_id+".0",criterion.position_cd+".0",folderId);
var request=new MP_Core.ScriptRequest(component,component.getComponentLoadTimerName());
request.setProgramName("MP_GET_ORDER_FOLDERS");
request.setParameters(sendAr);
request.setAsync(true);
MP_Core.XMLCCLRequestCallBack(component,request,CERN_ORDER_SELECTION_O1.RenderComponent);
},selOrdWrapper:function(comp){return function(){selOrd(this,comp);
};
},RenderComponent:function(reply){var recordData=reply.getResponse();
CERN_ORDER_SELECTION_O1.SortRecordData(recordData);
var component=reply.getComponent();
var componentId=component.getComponentId();
var timerRenderComponent=MP_Util.CreateTimer(component.getComponentRenderTimerName(),component.getCriterion().category_mean);
try{var style=component.getStyles();
var compNS=style.getNameSpace();
var osi18n=i18n.discernabu.orderselection_o1;
var ordFolders=recordData.FOLDER;
var ofLen=ordFolders.length;
var strHTML="";
var arrHTML=[];
var i=0;
var eleIndex=0;
var subsecPreferences=component.getPreferencesObj();
if(reply.getStatus()!=="F"){if(reply.getStatus()==="S"){CERN_EventListener.addListener(component,EventListener.EVENT_ORDER_ACTION,component.UnCheckAllFavs,component);
arrHTML.push("<div class='",MP_Util.GetContentClass(component,ofLen),"'>");
for(i=0;
i<ofLen;
i++){var curFolder=ordFolders[i];
var itLen=curFolder.ITEM.length;
var subsecState="closed";
var subsecId=componentId+"_"+curFolder.FOLD_ID;
if(subsecPreferences!=null){$.each(subsecPreferences,function(){if(typeof subsecPreferences[subsecId]!="undefined"){var expanded=subsecPreferences[subsecId];
if(expanded){subsecState="";
}}});
}if(!curFolder.ROOT_LEVEL_IND){arrHTML.push("<div  id=",subsecId,' class="sub-sec ',subsecState,'"><h3 class="',style.getSubSecHeaderClass(),'"><span class="sub-sec-hd-tgl" title="Collapse">-</span><span class="ordsel-folder">&nbsp;</span><span class="',style.getSubSecTitleClass(),'">',curFolder.S_DESCRIP,' </span></h3><div class="',style.getSubSecContentClass(),'"><div class="',style.getContentBodyClass(),'">');
}for(var j=0;
j<itLen;
j++){var curItem=curFolder.ITEM[j];
if(curItem.TYPE_CD===2){eleIndex++;
var sentDisp=(curItem.SENT_DISP)?curItem.SENT_DISP:"";
if(curItem.SENT_ALIAS){sentDisp=curItem.SENT_ALIAS;
}var itemDisp=(curItem.ITEM_ALIAS)?curItem.ITEM_ALIAS:curItem.ITEM_DISP;
if(curItem.ORDERABLE_TYPE_FLAG===6){arrHTML.push("<h3 class='info-hd'><span class='","'>",itemDisp,"</span><span class='","'>",sentDisp,"</span></h3>","<dl id='",componentId,"ordSelRow",j,"' class='ordsel-info'><dt><span><input type='checkbox' class='ordsel-checkbox' /></span><span class='ordsel-careset-icon'>&nbsp;</span></dt>","<dd class='ordsel-name' data-sp-name='",curItem.ITEM_DISP,"' data-sp-sentence='",curItem.SENT_DISP,"' data-sp-usage-flag='",curItem.USAGE_FLAG,"'><span class='","'>",itemDisp,"</span><span class='ordsel-disp'>",sentDisp,"</span></dd>","<dt class='ordsel-order-syn-and-sent-ids'>","TODO: Order Synonym and Sentence Ids",":</dt><dd class='ordsel-syn'>",curItem.SYN_ID,"</dd><dd class='ordsel-sent'>",curItem.SENT_ID,"</dd><dt class='ordsel-order-type'>","TODO: Order Event Type",":</dt><dd class='ordsel-order-type'>1</dd><dt class='ordsel-component-id'>","TODO:Component Id",":</dt><dd class='ordsel-component-id'>",componentId,"</dd></dl>");
arrHTML.push("<h4 class='det-hd'><span>",osi18n.ORDER_DETAILS,"</span></h4><div class='hvr'><dl class='",compNS,"-det'><dt><span>",osi18n.ORDER_SYNONYM,":</span></dt><dd class='",compNS,"-det-name'><span>",curItem.ITEM_DISP,"</span></dd><dt><span>",osi18n.ORDER_SENTENCE,":</span></dt><dd class='",compNS,"-det-subj'><span>",curItem.SENT_DISP,"</span></dd></dl></div>");
}else{arrHTML.push("<h3 class='info-hd'><span class='","'>",itemDisp,"</span><span class='","'>",sentDisp,"</span></h3>","<dl id='",componentId,"ordSelRow",j,"' class='ordsel-info'><dt><span><input type='checkbox' class='ordsel-checkbox' /></span></dt>","<dd class='ordsel-name' data-sp-name='",curItem.ITEM_DISP,"' data-sp-sentence='",curItem.SENT_DISP,"' data-sp-usage-flag='",curItem.USAGE_FLAG,"'><span class='","'>",itemDisp,"</span><span class='ordsel-disp'>",sentDisp,"</span></dd>","<dt class='ordsel-order-syn-and-sent-ids'>","TODO: Order Synonym and Sentence Ids",":</dt><dd class='ordsel-syn'>",curItem.SYN_ID,"</dd><dd class='ordsel-sent'>",curItem.SENT_ID,"</dd><dt class='ordsel-order-type'>","TODO:Order Event Type",":</dt><dd class='ordsel-order-type'>0</dd><dt class='ordsel-component-id'>","TODO:Component Id",":</dt><dd class='ordsel-component-id'>",componentId,"</dd></dl>");
arrHTML.push("<h4 class='det-hd'><span>",osi18n.ORDER_DETAILS,"</span></h4><div class='hvr'><dl class='",compNS,"-det'><dt><span>",osi18n.ORDER_SYNONYM,":</span></dt><dd class='",compNS,"-det-name'><span>",curItem.ITEM_DISP,"</span></dd><dt><span>",osi18n.ORDER_SENTENCE,":</span></dt><dd class='",compNS,"-det-subj'><span>",curItem.SENT_DISP,"</span></dd></dl></div>");
}}else{if(curItem.TYPE_CD===6){eleIndex++;
var itemDisp=(curItem.ITEM_ALIAS)?curItem.ITEM_ALIAS:curItem.ITEM_DISP;
arrHTML.push("<h3 class='info-hd'><span class='","'>",itemDisp,"</span></h3>","<dl id='",componentId,"ordSelRow",j,"' class='ordsel-info'><dt><span><input type='checkbox' class='ordsel-checkbox' /></span><span class='ordsel-pp-icon'>&nbsp;</span></dt>","<dd class='ordsel-name' data-sp-name='",curItem.ITEM_DISP,"' data-sp-sentence='",curItem.SENT_DISP,"' data-sp-usage-flag='",curItem.USAGE_FLAG,"'><span class='","'>",itemDisp,"</span></dd>","<dt class='ordsel-order-syn-and-sent-ids'>","TODO: Powerplan catalog and synonym IDs",":</dt><dd class='ordsel-syn'>",curItem.PATH_CAT_ID,"</dd><dd class='ordsel-sent'>",curItem.PW_CAT_SYN_ID,"</dd><dt class='ordsel-order-type'>","TODO: Order Event Type",":</dt><dd class='ordsel-order-type'>2</dd><dt class='ordsel-component-id'>","TODO:Component Id",":</dt><dd class='ordsel-component-id'>",componentId,"</dd></dl>");
arrHTML.push("<h4 class='det-hd'><span>",osi18n.ORDER_DETAILS,"</span></h4><div class='hvr'><dl class='",compNS,"-det'><dt><span>",osi18n.ORDER_SYNONYM,":</span></dt><dd class='",compNS,"-det-name'><span>",curItem.ITEM_DISP,"</span></dd><dt><span>",osi18n.ORDER_SENTENCE,":</span></dt><dd class='",compNS,"-det-subj'><span>",curItem.SENT_DISP,"</span></dd></dl></div>");
}}}if(!curFolder.ROOT_LEVEL_IND){arrHTML.push("</div></div></div>");
}}arrHTML.push("</div>");
strHTML=arrHTML.join("");
}else{if(reply.getStatus()==="Z"){strHTML=arrHTML.join("");
strHTML+="<h3 class='info-hd'><span class='res-normal'>"+osi18n.NO_FAVORITES_FOUND+"</span></h3><span class='res-none'>"+osi18n.NO_FAVORITES_FOUND+"</span>";
}}MP_Util.Doc.FinalizeComponent(strHTML,component,"");
$("#"+compNS+componentId).delegate(".ordsel-info","click",CERN_ORDER_SELECTION_O1.selOrdWrapper(component));
component.setActiveDiv(Util.Style.g("div-tab-item-selected",document.body,"DIV")[0]);
}else{MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(style.getNameSpace(),reply.getError()),component,"");
}var contentBody=$("#"+component.getStyles().getContentId()).find(".content-body");
$(contentBody).find(".sub-sec-hd-tgl").each(function(){Util.removeEvent($(this).get(0),"click",MP_Util.Doc.ExpandCollapse);
$(this).on("click",function(){var i18nCore=i18n.discernabu;
if($(this).closest(".sub-sec").hasClass("closed")){$(this).closest(".sub-sec").removeClass("closed");
$(this).html("-");
$(this).attr("title",i18nCore.HIDE_SECTION);
}else{$(this).closest(".sub-sec").addClass("closed");
$(this).html("+");
$(this).attr("title",i18nCore.SHOW_SECTION);
}var currentView=$(this).parents(".div-tab-item-selected").attr("id");
MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences("","",null,true,currentView);
});
});
}catch(err){if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}},SortRecordData:function(recordData){if(recordData.FAVORITES_SORT!=1||!recordData.FOLDER){return;
}var rootLevelIndex=null;
var rootFolder=null;
recordData.FOLDER.sort(CERN_ORDER_SELECTION_O1.SortBy("S_DESCRIP"));
$.each(recordData.FOLDER,function(i,folder){if(folder.ROOT_LEVEL_IND===1){rootLevelIndex=i;
}folder.ITEM.sort(CERN_ORDER_SELECTION_O1.SortBy("ITEM_DISP"));
});
if(rootLevelIndex!==null){rootFolder=recordData.FOLDER.splice(rootLevelIndex,1);
recordData.FOLDER.unshift(rootFolder[0]);
}},SortBy:function(parameter){return function(a,b){var aName=a[parameter].toLowerCase();
var bName=b[parameter].toLowerCase();
return((aName<bName)?-1:((aName>bName)?1:0));
};
},DeselectAll:function(component){var rootOrdSecCont=component.getSectionContentNode();
var selOrdRows=Util.Style.g("ordsel-selected",rootOrdSecCont,"dl");
var selOrdLen=selOrdRows.length;
for(var i=selOrdLen;
i--;
){var selOrdRow=selOrdRows[i];
var checkbox=_gbt("input",selOrdRow);
if(checkbox[0]){checkbox[0].checked=false;
Util.Style.rcss(selOrdRow,"ordsel-selected");
}}component.setActiveDiv(Util.Style.g("div-tab-item-selected",document.body,"DIV")[0]);
component.setActiveScratchPad(null);
CERN_ORDER_SELECTION_O1.CheckPendingSR(component.getComponentId(),0);
},RemoveFavFromSP:function(removeButton,noeComponentId,componentId,synonymId,sentenceId){var noei18n=i18n.discernabu.noe_o1;
var scratchPad=_g("noeScratchPad"+noeComponentId);
var scratchPadData=_gbt("DL",scratchPad);
var scratchPadCnt=0;
var fav=null;
if(scratchPadData){scratchPadCnt=scratchPadData.length;
}var intComponentId=parseInt(componentId,10);
var ordselComponent=MP_Util.GetCompObjById(intComponentId);
if(!ordselComponent){ordselComponent=MP_Util.GetCompObjById(componentId);
}var selOrdRows=Util.Style.g("ordsel-selected",ordselComponent.getSectionContentNode(),"dl");
for(var i=selOrdRows.length;
i--;
){var synId=Util.gns(Util.Style.g("ordsel-order-syn-and-sent-ids",selOrdRows[i],"DT")[0]);
var sentId=Util.gns(synId);
if(synId&&sentId&&parseInt(synonymId,10)===parseInt(synId.innerHTML,10)&&parseInt(sentenceId,10)===parseInt(sentId.innerHTML,10)){var orderRow=Util.gp(synId);
var checkbox=null;
if(orderRow){checkbox=Util.Style.g("ordsel-checkbox",orderRow,"input");
Util.Style.rcss(orderRow,"ordsel-selected");
if(checkbox[0]){checkbox[0].checked=false;
}fav=Util.gp(removeButton);
if(fav){Util.de(fav);
scratchPadCnt--;
decrementSPCount(noeComponentId);
}}break;
}}if(Util.Style.g("ordsel-selected",ordselComponent.getSectionContentNode(),"dl").length===0){CERN_ORDER_SELECTION_O1.CheckPendingSR(componentId,0);
}if(scratchPadCnt===0){var scratchPadCont=_g("noeScratchPadCont"+noeComponentId);
if(scratchPadCont){Util.Style.acss(scratchPadCont,"hidden");
}}},CheckPendingSR:function(compId,pendingInd){var srObj=null;
var strCompId=String(compId);
var dataObj={};
srObj=MP_Resources.getSharedResource("pendingDataSR");
if(!srObj){srObj=initPendingData();
}dataObj=srObj.getResourceData();
var pendingArr=dataObj.pendingDataCompArr;
if(pendingInd){if(pendingArr.join("|").indexOf(strCompId)===-1){pendingArr.push(strCompId);
}}else{var idx=pendingArr.length;
while(idx--){if(strCompId===pendingArr[idx]){pendingArr.splice(idx,1);
break;
}}}dataObj.pendingDataCompArr=pendingArr;
dataObj.pendingDataObj.SetPendingData(dataObj.pendingDataCompArr.length===0?0:1);
MP_Resources.setSharedResourceData("pendingDataSR",dataObj);
},AddToOrRemoveFromScratchpadSR:function(scratchpadObj,isRemovingObj){var srObj=CERN_ORDER_SELECTION_O1.GetScratchpadSharedResourceObject();
if(srObj){var dataObj=srObj.getResourceData();
if(!dataObj){return null;
}else{var scratchpadArr=dataObj.scratchpadObjArr;
if(scratchpadArr){if(isRemovingObj){var idx=scratchpadArr.length;
while(idx--){if(scratchpadArr[idx].favSynId==scratchpadObj.favSynId&&scratchpadArr[idx].favSentId==scratchpadObj.favSentId){scratchpadArr.splice(idx,1);
break;
}}}else{scratchpadArr.push(scratchpadObj);
}}dataObj.scratchpadObjArr=scratchpadArr;
MP_Resources.setSharedResourceData(srObj.getName(),dataObj);
srObj.notifyResourceConsumers();
return dataObj;
}}},GetScratchpadSharedResourceObject:function(){var srObj=null;
var sharedResourceName="scratchpadSR";
srObj=MP_Resources.getSharedResource(sharedResourceName);
if(!srObj){srObj=initScratchpadSR(sharedResourceName);
}return srObj;
},SPModalDialogRemovesFavorite:function(component,event,removeObject){if(removeObject.componentId){if(component.getComponentId()==removeObject.componentId){var ordSelCompFav=_g(removeObject.favoriteId);
var checkbox=null;
if(ordSelCompFav){checkbox=Util.Style.g("ordsel-checkbox",ordSelCompFav,"input");
Util.Style.rcss(ordSelCompFav,"ordsel-selected");
if(checkbox[0]){checkbox[0].checked=false;
}}}}}};
function selOrd(element,component){var synId,sentId,orderType;
var dataObj=null;
var componentId=component.getComponentId();
var checkbox=_gbt("input",element);
var spData=Util.Style.g("ordsel-name",element,"dd")[0];
var favName=spData.getAttribute("data-sp-name");
var favDisp=spData.getAttribute("data-sp-sentence");
var favUsageFlag=spData.getAttribute("data-sp-usage-flag");
var venueType=(favUsageFlag==="2"?1:0);
var favSynId=Util.Style.g("ordsel-syn",element,"dd")[0].innerHTML;
var favSentId=Util.Style.g("ordsel-sent",element,"dd")[0].innerHTML;
var favType=parseInt(Util.Style.g("ordsel-order-type",element,"dd")[0].innerHTML,10);
var favParam=favSynId+".0|"+venueType+"|"+favSentId+".0";
var favPPEvent=null;
var favPPEventType=null;
if(component.isModalScratchPadEnabled()){var scratchpadObj={};
scratchpadObj.componentId=componentId;
scratchpadObj.addedFrom="OrderSelection";
scratchpadObj.favId=element.id;
scratchpadObj.favType=favType;
scratchpadObj.favName=favName;
scratchpadObj.favOrderSentDisp=favDisp;
scratchpadObj.favParam=favParam;
scratchpadObj.favSynId=null;
scratchpadObj.favVenueType=null;
scratchpadObj.favSentId=null;
scratchpadObj.favOrdSet=0;
var params=favParam.split("|");
if(favType===2){scratchpadObj.favSynId=params[0];
scratchpadObj.favSentId=params[2];
scratchpadObj.favPPEventType=1;
}else{if(favType===1){scratchpadObj.favSynId=params[0];
scratchpadObj.favVenueType=params[1];
scratchpadObj.favSentId=params[2];
scratchpadObj.favOrdSet=6;
}else{scratchpadObj.favSynId=params[0];
scratchpadObj.favVenueType=params[1];
scratchpadObj.favSentId=params[2];
}}scratchpadObj.favNomenIds='""';
if(!Util.Style.ccss(element,"ordsel-selected")){Util.Style.acss(element,"ordsel-selected");
if(checkbox[0]){checkbox[0].checked=true;
}dataObj=CERN_ORDER_SELECTION_O1.AddToOrRemoveFromScratchpadSR(scratchpadObj,false);
CERN_ORDER_SELECTION_O1.CheckPendingSR(componentId,1);
}else{dataObj=CERN_ORDER_SELECTION_O1.AddToOrRemoveFromScratchpadSR(scratchpadObj,true);
Util.Style.rcss(element,"ordsel-selected");
if(checkbox[0]){checkbox[0].checked=false;
}if(dataObj){var componentIsDirty=false;
var scratchpadArr=dataObj.scratchpadObjArr;
if(scratchpadArr){var idx=scratchpadArr.length;
while(idx--){if(scratchpadArr[idx].componentId==componentId){componentIsDirty=true;
break;
}}}if(!componentIsDirty){CERN_ORDER_SELECTION_O1.CheckPendingSR(componentId,0);
}}}}else{if(!component.getActiveScratchPad()){component.setActiveScratchPad(Util.Style.g("noe-scratch",component.getActiveDiv())[0]);
}var scratchPad=component.getActiveScratchPad();
if(scratchPad){var noeNumId=scratchPad.id.replace("noeScratchPad","");
var scratchPadCont=Util.gp(scratchPad);
var noeComponent=MP_Util.GetCompObjById(noeNumId);
var noeComponentId=noeComponent.getComponentId();
var selectedOrdCnt=noeComponent.incSearchOrdersCnt();
if(!Util.Style.ccss(element,"ordsel-selected")){Util.Style.acss(element,"ordsel-selected");
var noOrdMsg=Util.Style.g("res-none",scratchPad,"SPAN");
if(noOrdMsg){Util.de(noOrdMsg[0]);
}var scratchFav=Util.cep("dl",{className:"noe-info",id:"sp"+noeComponentId+"searchRow"+selectedOrdCnt});
var favHTML=[];
if(favType===1){favHTML.push("<span class='noe-scr-remove-icon' onclick='CERN_ORDER_SELECTION_O1.RemoveFavFromSP(this, \"",noeComponentId,'", "',componentId,'", "',favSynId,'", "',favSentId,"\")'></span><span class='noe-careset-icon'>&nbsp;</span><dt>","TODO: Order name",":</dt><dd class='noe-scr-name'>",favName,"</dd><dt>","TODO: Order display line",":</dt><dd class='noe-scr-disp'>",favDisp,"</dd><dt>","TODO: Order paramaters",":</dt><dd class='det-hd'>",favParam,"</dd><dt>","TODO: ORDER NOMEN",":</dt><dd class='det-hd'></dd><dt>","TODO: ORDER SET",":</dt><dd class='det-hd'>6</dd><dt>","TODO: Non Order Event",":</dt><dd class='det-hd'>1</dd>");
}else{if(favType===2){favPPEventType=1;
favPPEvent=2;
favHTML.push("<span class='noe-scr-remove-icon' onclick='CERN_ORDER_SELECTION_O1.RemoveFavFromSP(this, \"",noeComponentId,'", "',componentId,'", "',favSynId,'", "',favSentId,"\")'></span><span class='noe-pp-icon'>&nbsp;</span><dt>","TODO: Order name",":</dt><dd class='noe-scr-name'>",favName,"</dd><dt>","TODO: Order display line",":</dt><dd class='noe-sys-name-disp'>",favDisp,"</dd><dt>","TODO: Order paramaters",":</dt><dd class='det-hd'>",favParam,"</dd><dt>","TODO: ORDER NOMEN",":</dt><dd class='det-hd'></dd><dt>","TODO: ORDER SET",":</dt><dd class='det-hd'>0</dd>","<dt>","TODO: Non Order Event",":</dt><dd class='det-hd'>",favPPEvent,"</dd>","<dt>","TODO: Powerplan Event Type",":</dt><dd class='det-hd'>",favPPEventType,"</dd>");
}else{favHTML.push("<span class='noe-scr-remove-icon' onclick='CERN_ORDER_SELECTION_O1.RemoveFavFromSP(this, \"",noeComponentId,'", "',componentId,'", "',favSynId,'", "',favSentId,"\")'></span><dt>","TODO: Order name",":</dt><dd class='noe-scr-name'>",favName,"</dd><dt>","TODO: Order display line",":</dt><dd class='noe-scr-disp'>",favDisp,"</dd><dt>","TODO: Order paramaters",":</dt><dd class='det-hd'>",favParam,"</dd><dt>","TODO: ORDER NOMEN",":</dt><dd class='det-hd'></dd><dt>","TODO: ORDER SET",":</dt><dd class='det-hd'>0</dd>");
}}scratchFav.innerHTML=favHTML.join("");
Util.ac(scratchFav,scratchPad);
incrementSPCount(noeComponentId);
Util.Style.rcss(scratchPadCont,"hidden");
if(checkbox[0]){checkbox[0].checked=true;
}CERN_ORDER_SELECTION_O1.CheckPendingSR(componentId,1);
}else{Util.Style.rcss(element,"ordsel-selected");
var synIds=Util.Style.g("det-hd",scratchPad,"DD");
for(i=synIds.length;
i--;
){var orderInfo=synIds[i].innerHTML.split("|");
if(favSynId==parseInt(orderInfo[0],10)&&favSentId==parseInt(orderInfo[2],10)){var scratchPadRow=Util.gp(synIds[i]);
Util.de(scratchPadRow);
decrementSPCount(noeNumId);
break;
}}noeComponent.m_searchOrdersCnt--;
var scratchPadData=_gbt("DL",scratchPad);
var scratchPadCnt=0;
if(scratchPadData){scratchPadCnt=scratchPadData.length;
}if(scratchPadCnt===0&&scratchPadCont){Util.Style.acss(scratchPadCont,"hidden");
}var selOrdRows=Util.Style.g("ordsel-selected",component.getSectionContentNode(),"dl");
if(selOrdRows.length===0){CERN_ORDER_SELECTION_O1.CheckPendingSR(componentId,0);
}if(checkbox[0]){checkbox[0].checked=false;
}}}}}function incrementSPCount(noeComponentId){var scratchPadCountDiv=_g("noeScratchPadCount"+noeComponentId);
if(scratchPadCountDiv){var oldCount=parseInt(scratchPadCountDiv.innerHTML,10);
var newCount=oldCount+1;
scratchPadCountDiv.innerHTML=newCount;
}}function decrementSPCount(noeComponentId){var scratchPadCountDiv=_g("noeScratchPadCount"+noeComponentId);
if(scratchPadCountDiv){var scratchPadCnt=parseInt(scratchPadCountDiv.innerHTML,10);
scratchPadCnt--;
scratchPadCountDiv.innerHTML=scratchPadCnt;
}}function initPendingData(){var srObj=null;
var dataObj={};
var pendingSR=MP_Resources.getSharedResource("pendingDataSR");
srObj=new SharedResource("pendingDataSR");
dataObj.pendingDataObj=window.external.DiscernObjectFactory("PVFRAMEWORKLINK");
dataObj.pendingDataCompArr=[];
srObj.setIsAvailable(true);
srObj.setResourceData(dataObj);
MP_Resources.addSharedResource("pendingDataSR",srObj);
return srObj;
}}();
