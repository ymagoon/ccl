function OrderSelectionComponentO2Style(){this.initByNamespace("ordsel-o2");
}OrderSelectionComponentO2Style.prototype=new ComponentStyle();
OrderSelectionComponentO2Style.prototype.constructor=ComponentStyle;
function OrderSelectionComponentO2(criterion){this.m_FolderIds=null;
this.m_ActiveDiv=null;
this.m_ActiveScratchPad=null;
this.m_modalScratchPadEnabled=false;
this.m_saveOnExpandEnabled=null;
this.m_subsectionDefaultExpanded=null;
this.m_isPersonalFavorite=false;
this.m_venueValue=1;
this.setCriterion(criterion);
this.os2i18n=i18n.discernabu.orderselection_o2;
this.setStyles(new OrderSelectionComponentO2Style());
this.setComponentLoadTimerName("USR:MPG.ORDERSELECTION.O2 - load component");
this.setComponentRenderTimerName("ENG:MPG.ORDERSELECTION.O2 - render component");
this.ordselo2PrefObj={subFolderExpanded:{},compLabel:"",compFolderId:""};
this.venueCache=[];
this.m_wasListenerAdded=false;
}OrderSelectionComponentO2.prototype=new MPageComponent();
OrderSelectionComponentO2.prototype.constructor=MPageComponent;
OrderSelectionComponentO2.prototype.setWasListenerAdded=function(value){this.m_wasListenerAdded=value;
};
OrderSelectionComponentO2.prototype.getWasListenerAdded=function(){return this.m_wasListenerAdded;
};
OrderSelectionComponentO2.prototype.setVenue=function(value){this.m_venueValue=value;
};
OrderSelectionComponentO2.prototype.getVenue=function(){return this.m_venueValue;
};
OrderSelectionComponentO2.prototype.setFavFolderId=function(value){if(this.m_FolderIds===null){this.m_FolderIds=[];
}this.m_FolderIds.push(value);
};
OrderSelectionComponentO2.prototype.getFavFolderId=function(){return this.m_FolderIds;
};
OrderSelectionComponentO2.prototype.clearSelections=function(){this.dSelectAll(this);
};
OrderSelectionComponentO2.prototype.setActiveDiv=function(value){this.m_ActiveDiv=value;
};
OrderSelectionComponentO2.prototype.getActiveDiv=function(){return this.m_ActiveDiv;
};
OrderSelectionComponentO2.prototype.setActiveScratchPad=function(value){this.m_ActiveScratchPad=value;
};
OrderSelectionComponentO2.prototype.getIsPersonalFavorite=function(){return this.m_isPersonalFavorite;
};
OrderSelectionComponentO2.prototype.setIsPersonalFavorite=function(value){this.m_isPersonalFavorite=(value===1?true:false);
};
OrderSelectionComponentO2.prototype.getActiveScratchPad=function(){return this.m_ActiveScratchPad;
};
OrderSelectionComponentO2.prototype.setModalScratchPadEnabled=function(value){this.m_modalScratchPadEnabled=(value===1?true:false);
};
OrderSelectionComponentO2.prototype.isModalScratchPadEnabled=function(){return this.m_modalScratchPadEnabled;
};
OrderSelectionComponentO2.prototype.setSaveOnExpandEnabled=function(value){this.m_saveOnExpandEnabled=(value?true:false);
};
OrderSelectionComponentO2.prototype.isSaveOnExpandEnabled=function(){return this.m_saveOnExpandEnabled;
};
OrderSelectionComponentO2.prototype.setSubsectionDefaultExpanded=function(value){this.m_subsectionDefaultExpanded=(value?true:false);
};
OrderSelectionComponentO2.prototype.isSubsectionDefaultExpanded=function(){return this.m_subsectionDefaultExpanded;
};
OrderSelectionComponentO2.prototype.removeFavorite=function(event,removeObject){this.SPModalDialogRemovesFavorite(this,event,removeObject);
};
OrderSelectionComponentO2.prototype.getPreferencesObj=function(){return MPageComponent.prototype.getPreferencesObj.call(this,null);
};
OrderSelectionComponentO2.prototype.getFilterMappingsObj=function(){var reportMean=this.getReportMean().toUpperCase();
var compNum=/[0-9]+$/.exec(reportMean);
this.addFilterMappingObject("ORD_SEL_ORD_FOLDER_"+compNum,{type:"ARRAY",field:"PARENT_ENTITY_ID",setFunction:this.setFavFolderId});
this.addFilterMappingObject("ORD_SEL_SUBSEC_DEFAULT_"+compNum,{type:"BOOLEAN",field:"FREETEXT_DESC",setFunction:this.setSubsectionDefaultExpanded});
return this.m_filterMappingsObj;
};
OrderSelectionComponentO2.prototype.loadMappedSettings=function(mappedFilter,compFilter){MPageComponent.prototype.loadMappedSettings.call(this,mappedFilter,compFilter);
};
OrderSelectionComponentO2.prototype.preProcessing=function(){var compMenu=this.getMenu();
var compID=this.getComponentId();
var style=this.getStyles();
var savedUserPrefs=null;
MPageComponent.prototype.preProcessing.call(this);
var viewpointIndicator=(typeof m_viewpointJSON=="undefined")?false:true;
if(viewpointIndicator){this.setModalScratchPadEnabled(1);
}if(compMenu&&this.getIsPersonalFavorite()){var compMenuRemove=new MenuSelection("compMenuRemove"+compID);
compMenuRemove.setLabel(this.os2i18n.REMOVE_FAVORITE);
compMenuRemove.setIsDisabled(false);
compMenu.addMenuItem(compMenuRemove);
var returnFav=function(comp){return function(clickEvent){clickEvent.id="mnuRemove"+compID;
call(comp.removeFolder);
};
};
compMenuRemove.setClickFunction(returnFav(this));
MP_MenuManager.updateMenuObject(compMenu);
}savedUserPrefs=this.getPreferencesObj();
if(savedUserPrefs){this.ordselo2PrefObj=savedUserPrefs;
}};
OrderSelectionComponentO2.prototype.addCellClickExtension=function(){var component=this;
var cellClickExtension=new TableCellClickCallbackExtension();
cellClickExtension.setCellClickCallback(function(event,data){var cellSelectionTimer=MP_Util.CreateTimer("CAP:MPG:ORDERSELECTION.O2_Cell_Click");
if(cellSelectionTimer){cellSelectionTimer.Start();
cellSelectionTimer.Stop();
}if(component.isModalScratchPadEnabled()){component.addItemToPendingOrdersSP(event,data);
}else{component.addItemToNOESP(event,data);
var noeScratchPadContainer=Util.Style.g("noe-scratch",component.getActiveDiv())[0];
}});
orderSelectionTable.addExtension(cellClickExtension);
};
OrderSelectionComponentO2.prototype.addRemoveMenuOption=function(){var getRemoveClick=function(comp){return function(event){comp.removeFolder();
};
};
this.addMenuOption("mnuRemove","mnuRemove"+this.getComponentId(),this.os2i18n.REMOVE_FAVORITE,false,"click",getRemoveClick(this));
this.createMenu();
};
OrderSelectionComponentO2.prototype.changeViewVenue=function(event,venue){var activeView=MP_Viewpoint.getActiveViewId();
var ordselId="ordsel-o2"+this.getComponentId();
var component=$("#"+activeView).find("#"+ordselId);
if(component.length>0){var node=this.getSectionContentNode();
var nodeHtml=$(node).html();
var currVenue=this.getVenue();
if(currVenue===3){currVenue=1;
}if(this.venueCache[currVenue]){this.venueCache[currVenue].html=nodeHtml;
this.venueCache[currVenue].comp_table=this.getComponentTable();
}var pageLevelVenue=venue.VALUE;
if(pageLevelVenue===3){pageLevelVenue=1;
}this.setVenue(pageLevelVenue);
var cachedHtml=this.venueCache[pageLevelVenue];
if(cachedHtml){var cachedInnerHtml=cachedHtml.html;
var cachedTable=cachedHtml.comp_table;
if(cachedInnerHtml){$(node).html(cachedInnerHtml);
if(cachedTable){this.setComponentTable(cachedTable);
cachedTable.finalize();
}}}else{$(node).html("<div class='ordsel-o2-preloader-icon'></div>");
this.retrieveComponentData();
}}};
OrderSelectionComponentO2.prototype.removeFolder=function(){var i18nCore=i18n.discernabu;
var removeFun=function(comp){return function(){$("#"+comp.getStyles().getId()).remove();
$("#moreOptMenu"+comp.getComponentId()).remove();
CERN_EventListener.fireEvent(comp,comp,EventListener.EVENT_REMOVE_PERSONAL_FAV_FOLDER,comp);
MP_Core.AppUserPreferenceManager.SavePreferences(false);
};
};
MP_Util.AlertConfirm(this.os2i18n.REMOVE_FAV_DIALOG,this.os2i18n.REMOVE_PERSONAL_FAV_COMP,this.os2i18n.CONFIRM_REMOVE,i18nCore.CONFIRM_CANCEL,true,removeFun(this));
};
OrderSelectionComponentO2.prototype.addItemToPendingOrdersSP=function(event,data){var component=this;
var componentId=component.getComponentId();
var element=$(event.target).closest("dd.ordsel-o2-info")[0];
var orderRecord=data.RESULT_DATA;
var favType=orderRecord.FAV_TYPE;
var favSynId=(favType===2)?orderRecord.PATH_CAT_ID:orderRecord.SYN_ID;
var favSentId=(favType===2)?orderRecord.PW_CAT_SYN_ID:orderRecord.SENT_ID;
var venueType=0;
switch(this.getVenue()){case 0:venueType=orderRecord.RX_INDICATOR;
break;
case 1:venueType=0;
break;
case 2:venueType=1;
break;
}var favParam=favSynId+".0|"+venueType+"|"+favSentId+".0";
var favPPEvent=null;
var favPPEventType=null;
var scratchpadObj={};
scratchpadObj.componentId=componentId;
scratchpadObj.addedFrom="OrderSelection";
scratchpadObj.favId=element.id;
scratchpadObj.favType=orderRecord.FAV_TYPE;
scratchpadObj.favParam=favParam;
scratchpadObj.favSynId=null;
scratchpadObj.favSentId=null;
scratchpadObj.favOrdSet=0;
scratchpadObj.favVenueType=venueType;
var params=favParam.split("|");
if(favType===2){scratchpadObj.favSynId=params[0];
scratchpadObj.favSentId=params[2];
scratchpadObj.favName=orderRecord.ITEM_DISP;
scratchpadObj.favOrderSentDisp=orderRecord.SENT_DISP;
scratchpadObj.favPPEventType=1;
}else{if(favType===1){scratchpadObj.favSynId=params[0];
scratchpadObj.favSentId=params[2];
scratchpadObj.favName=orderRecord.ITEM_DISP;
scratchpadObj.favOrderSentDisp=orderRecord.SENT_DISP;
scratchpadObj.favOrdSet=6;
}else{scratchpadObj.favSynId=params[0];
scratchpadObj.favSentId=params[2];
scratchpadObj.favName=orderRecord.ITEM_DISP;
scratchpadObj.favOrderSentDisp=orderRecord.SENT_DISP;
scratchpadObj.displayRxIcon=orderRecord.RX_INDICATOR;
}}scratchpadObj.favNomenIds='""';
if(!Util.Style.ccss(element,"ordsel-o2-selected")){Util.Style.acss(element,"ordsel-o2-selected");
dataObj=component.addToOrRemoveFromScratchpadSR(scratchpadObj,false);
component.checkPendingSR(componentId,1);
}else{dataObj=component.addToOrRemoveFromScratchpadSR(scratchpadObj,true);
Util.Style.rcss(element,"ordsel-o2-selected");
if(dataObj){var componentIsDirty=false;
var scratchpadArr=dataObj.scratchpadObjArr;
if(scratchpadArr){var idx=scratchpadArr.length;
while(idx--){if(scratchpadArr[idx].componentId==componentId){componentIsDirty=true;
break;
}}}if(!componentIsDirty){component.checkPendingSR(componentId,0);
}}}};
OrderSelectionComponentO2.prototype.decrementSPCount=function(noeComponentId){var scratchPadCountDiv=_g("noeScratchPadCount"+noeComponentId);
if(scratchPadCountDiv){var scratchPadCnt=parseInt(scratchPadCountDiv.innerHTML,10);
scratchPadCnt--;
scratchPadCountDiv.innerHTML=scratchPadCnt;
}};
OrderSelectionComponentO2.prototype.incrementSPCount=function(noeComponentId){var scratchPadCountDiv=_g("noeScratchPadCount"+noeComponentId);
if(scratchPadCountDiv){var oldCount=parseInt(scratchPadCountDiv.innerHTML,10);
var newCount=oldCount+1;
scratchPadCountDiv.innerHTML=newCount;
}};
OrderSelectionComponentO2.prototype.addItemToNOESP=function(event,data){var component=this;
var componentId=component.getComponentId();
var element=$(event.target).closest("dd.ordsel-o2-info")[0];
var orderRecord=data.RESULT_DATA;
var venueType=(this.getVenue()===2?1:0);
var favType=orderRecord.FAV_TYPE;
var favSynId=(favType===2)?orderRecord.PATH_CAT_ID:orderRecord.SYN_ID;
var favSentId=(favType===2)?orderRecord.PW_CAT_SYN_ID:orderRecord.SENT_ID;
var favName=null;
var favDisp=null;
var favParam=favSynId+".0|"+venueType+"|"+favSentId+".0";
var favPPEvent=null;
var favPPEventType=null;
var favHTML=[];
if(favType===2){favName=orderRecord.ITEM_DISP;
favDisp=orderRecord.SENT_DISP;
}else{favName=orderRecord.ITEM_DISP;
favDisp=orderRecord.SENT_DISP;
}if(!component.getActiveScratchPad()){var noeScratchPadContainer=Util.Style.g("noe-scratch",component.getActiveDiv())[0];
component.setActiveScratchPad(noeScratchPadContainer);
}var scratchPad=component.getActiveScratchPad();
if(scratchPad){var noeNumId=parseInt(scratchPad.id.replace("noeScratchPad",""),10);
var scratchPadCont=Util.gp(scratchPad);
var noeComponent=MP_Util.GetCompObjById(noeNumId);
var noeComponentId=noeComponent.getComponentId();
var selectedOrdCnt=noeComponent.incSearchOrdersCnt();
if(!Util.Style.ccss(element,"ordsel-o2-selected")){Util.Style.acss(element,"ordsel-o2-selected");
var noOrdMsg=Util.Style.g("res-none",scratchPad,"SPAN");
if(noOrdMsg){Util.de(noOrdMsg[0]);
}var scratchFav=Util.cep("dl",{className:"noe-info",id:"sp"+noeComponentId+"searchRow"+selectedOrdCnt});
favHTML.length=0;
if(favType===1){favHTML.push("<span class='noe-scr-remove-icon'></span><span class='noe-careset-icon'>&nbsp;</span><dt>","TODO: Order name",":</dt><dd class='noe-scr-name'>",favName,"</dd><dt>","TODO: Order display line",":</dt><dd class='noe-scr-disp'>",favDisp,"</dd><dt>","TODO: Order paramaters",":</dt><dd class='det-hd'>",favParam,"</dd><dt>","TODO: ORDER NOMEN",":</dt><dd class='det-hd'></dd><dt>","TODO: ORDER SET",":</dt><dd class='det-hd'>6</dd><dt>","TODO: Non Order Event",":</dt><dd class='det-hd'>1</dd>");
}else{if(favType===2){favPPEventType=1;
favPPEvent=2;
favHTML.push("<span class='noe-scr-remove-icon' ></span><span class='noe-pp-icon'>&nbsp;</span><dt>","TODO: Order name",":</dt><dd class='noe-scr-name'>",favName,"</dd><dt>","TODO: Order display line",":</dt><dd class='noe-sys-name-disp'>",favDisp,"</dd><dt>","TODO: Order paramaters",":</dt><dd class='det-hd'>",favParam,"</dd><dt>","TODO: ORDER NOMEN",":</dt><dd class='det-hd'></dd><dt>","TODO: ORDER SET",":</dt><dd class='det-hd'>0</dd>","<dt>","TODO: Non Order Event",":</dt><dd class='det-hd'>",favPPEvent,"</dd>","<dt>","TODO: Powerplan Event Type",":</dt><dd class='det-hd'>",favPPEventType,"</dd>");
}else{favHTML.push("<span class='noe-scr-remove-icon'></span><dt>","TODO: Order name",":</dt><dd class='noe-scr-name'>",favName,"</dd><dt>","TODO: Order display line",":</dt><dd class='noe-scr-disp'>",favDisp,"</dd><dt>","TODO: Order paramaters",":</dt><dd class='det-hd'>",favParam,"</dd><dt>","TODO: ORDER NOMEN",":</dt><dd class='det-hd'></dd><dt>","TODO: ORDER SET",":</dt><dd class='det-hd'>0</dd>");
}}scratchFav.innerHTML=favHTML.join("");
Util.ac(scratchFav,scratchPad);
component.incrementSPCount(noeComponentId);
Util.Style.rcss(scratchPadCont,"hidden");
component.checkPendingSR(componentId,1);
$(scratchFav).click(component.removeFavHandler(component,noeComponentId,favSynId,favSentId));
}else{Util.Style.rcss(element,"ordsel-o2-selected");
var synIds=Util.Style.g("det-hd",scratchPad,"DD");
for(i=synIds.length;
i--;
){var orderInfo=synIds[i].innerHTML.split("|");
if(favSynId==parseInt(orderInfo[0],10)&&favSentId==parseInt(orderInfo[2],10)){var scratchPadRow=Util.gp(synIds[i]);
Util.de(scratchPadRow);
component.decrementSPCount(noeNumId);
break;
}}noeComponent.m_searchOrdersCnt--;
var scratchPadData=_gbt("DL",scratchPad);
var scratchPadCnt=0;
if(scratchPadData){scratchPadCnt=scratchPadData.length;
}if(scratchPadCnt===0&&scratchPadCont){Util.Style.acss(scratchPadCont,"hidden");
}var selOrdRows=Util.Style.g("ordsel-o2-selected",component.getSectionContentNode(),"dl");
if(selOrdRows.length===0){component.checkPendingSR(componentId,0);
}}}};
OrderSelectionComponentO2.prototype.processResultsForRender=function(subFolder){var component=this;
var compId=component.getComponentId();
var iconHTML=null;
var subFolderLength=subFolder.length;
var targetFavs=[];
var arrHTML=[];
for(var j=0;
j<subFolderLength;
j++){arrHTML=[];
var curItem=subFolder[j];
var sentDisp=(curItem.SENT_DISP)?curItem.SENT_DISP:"";
if(curItem.SENT_ALIAS){sentDisp=curItem.SENT_ALIAS;
}var itemDisp=(curItem.ITEM_ALIAS)?curItem.ITEM_ALIAS:curItem.ITEM_DISP;
if(curItem.TYPE_CD===2){if(curItem.ORDERABLE_TYPE_FLAG===6){iconHTML="<span class='ordsel-o2-careset-icon'>&nbsp;</span>";
curItem.FAV_TYPE=1;
}else{curItem.FAV_TYPE=0;
iconHTML="";
}arrHTML.push(iconHTML,"<span data-syn-id='",curItem.SYN_ID,"'>",itemDisp,"</span><span class='ordsel-o2-disp' data-sent-id='",curItem.SENT_ID,"'>",sentDisp,"</span>");
}else{if(curItem.TYPE_CD===6){iconHTML="<span class='ordsel-o2-pp-icon'>&nbsp;</span>";
arrHTML.push(iconHTML,"<span data-sent-id='",curItem.PW_CAT_SYN_ID,"'>",itemDisp,"</span><span class='ordsel-o2-disp' data-syn-id='",curItem.PATH_CAT_ID,"'>",sentDisp,"</span>");
curItem.FAV_TYPE=2;
}}curItem.ITEM_DISPLAY=arrHTML.join("");
if(curItem.TYPE_CD===6){curItem.ITEM_HOVER="<div class = 'ordsel-o2-hover'><dl class='ordsel-o2-det'><dt class='ordsel-o2-det-type'><span>"+component.os2i18n.POWERPLAN_DISPLAY+":</span></dt><dd><span>"+curItem.ITEM_DISP+"</span></dd><dt class='ordsel-o2-det-type'><span>"+component.os2i18n.POWERPLAN_DESCRIPTION+":</span></dt><dd><span>"+curItem.SENT_DISP+"</span></dd></dl></div>";
}else{curItem.ITEM_HOVER="<div class = 'ordsel-o2-hover'><dl class='ordsel-o2-det'><dt class='ordsel-o2-det-type'><span>"+component.os2i18n.ORDER_SYNONYM+":</span></dt><dd><span>"+curItem.ITEM_DISP+"</span></dd><dt class='ordsel-o2-det-type'><span>"+component.os2i18n.ORDER_SENTENCE+":</span></dt><dd><span>"+curItem.SENT_DISP+"</span></dd></dl></div>";
}}};
OrderSelectionComponentO2.prototype.retrieveComponentData=function(){var criterion=this.getCriterion();
var sendAr=[];
var folderId=MP_Util.CreateParamArray(this.getFavFolderId(),1);
if(!this.getWasListenerAdded()){CERN_EventListener.addListener(this,EventListener.EVENT_SCRATCHPAD_UPDATES_COMPONENT,this.removeFavorite,this);
CERN_EventListener.addListener(this,EventListener.EVENT_ORDER_ACTION,this.clearSelections,this);
CERN_EventListener.addListener(this,EventListener.EVENT_QOC_VIEW_VENUE_CHANGED,this.changeViewVenue,this);
this.setWasListenerAdded(true);
}if(folderId==0){MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(),"Order folder not set"),this,"");
}else{var currVenue=this.getVenue();
sendAr.push("^MINE^",criterion.person_id+".0",criterion.encntr_id+".0",criterion.provider_id+".0",criterion.position_cd+".0",folderId,currVenue+".0");
var request=new MP_Core.ScriptRequest(this,this.getComponentLoadTimerName());
request.setProgramName("mp_obtain_order_folders");
request.setParameters(sendAr);
request.setAsync(true);
MP_Core.XMLCCLRequestCallBack(this,request,this.renderComponent);
}};
OrderSelectionComponentO2.prototype.renderComponent=function(reply){var recordData=reply.getResponse();
var ordFolders;
var orderFolderLength;
var hideSubfolder=0;
var rootFolderId=null;
var subsecId=null;
var curFolder=null;
var i=0;
var component=reply.getComponent();
var componentId=component.getComponentId();
var subsecPreferences=component.getPreferencesObj();
var timerRenderComponent=MP_Util.CreateTimer(component.getComponentRenderTimerName(),component.getCriterion().category_mean);
if(component.getIsPersonalFavorite()&&recordData){component.sortRecordData(recordData);
}function isGroupExpanded(subsecId,subsecPreferences){var enabled=component.isSubsectionDefaultExpanded();
var isExpanded=(component.isSubsectionDefaultExpanded()?true:false);
if(subsecPreferences!=null&&component.isSaveOnExpandEnabled()){$.each(subsecPreferences,function(){isExpanded=(subsecPreferences.subFolderExpanded[subsecId])?true:false;
});
}return isExpanded;
}var currVenue=component.getVenue();
var pageVenue;
var isCurrentVenue;
try{var finalizedHtml="";
if(reply.getStatus()!=="F"){ordFolders=recordData.FOLDER;
orderFolderLength=ordFolders.length;
pageVenue=recordData.VENUE_TYPE;
isCurrentVenue=(pageVenue===currVenue);
if(component.venueCache[pageVenue]){return;
}if(reply.getStatus()==="S"&&isCurrentVenue){orderSelectionTable=new ComponentTable();
orderSelectionTable.setNamespace(component.getStyles().getId()+"venue"+component.getVenue());
orderSelectionTable.setIsHeaderEnabled(false);
orderSelectionTable.setZebraStripe(false);
orderSelectionTable.setNoresultsString(component.os2i18n.NO_FAVORITES_FOUND);
var favoriteDisplayCol=new TableColumn();
favoriteDisplayCol.setColumnId("DISPLAY_NAME");
favoriteDisplayCol.setCustomClass("ordsel-o2-info");
favoriteDisplayCol.setRenderTemplate("${ ITEM_DISPLAY }");
orderSelectionTable.addColumn(favoriteDisplayCol);
for(i=0;
i<orderFolderLength;
i++){curFolder=ordFolders[i];
component.processResultsForRender(curFolder.ITEM);
if(curFolder.ROOT_LEVEL_IND&&curFolder.ITEM.length===0){hideSubfolder=1;
}else{hideSubfolder=0;
}if(!hideSubfolder){if(curFolder.ROOT_LEVEL_IND){rootFolderId=curFolder.FOLD_ID;
}folderGrp=new TableGroup();
folderHdr=curFolder.S_DESCRIP;
folderGrp.setDisplay(folderHdr).setGroupId(curFolder.FOLD_ID).setShowCount(false);
folderGrp.bindData(curFolder.ITEM);
if(!curFolder.ROOT_LEVEL_IND){subsecId=componentId+"_"+curFolder.FOLD_ID;
folderGrp.setIsExpanded(isGroupExpanded(subsecId,subsecPreferences));
}orderSelectionTable.addGroup(folderGrp);
}}var hoverExtension=new TableCellHoverExtension();
hoverExtension.addHoverForColumn(favoriteDisplayCol,function(data){return"<span>"+data.RESULT_DATA.ITEM_HOVER+"</span>";
});
orderSelectionTable.addExtension(hoverExtension);
if(component.isSaveOnExpandEnabled()){var grpToggleExtension=new TableGroupToggleCallbackExtension();
grpToggleExtension.setGroupToggleCallback(function(event,data){var compTable=component.m_componentTable;
var gMap=compTable.getGroupMap();
var gSequence=compTable.getGroupSequence();
var idx=gSequence.length;
while(idx--){var subSecExpanded=gMap[gSequence[idx]].expanded;
component.ordselo2PrefObj.subFolderExpanded[component.getComponentId()+"_"+gSequence[idx]]=subSecExpanded;
}component.setPreferencesObj(component.ordselo2PrefObj);
component.savePreferences(true);
});
orderSelectionTable.addExtension(grpToggleExtension);
}component.setComponentTable(orderSelectionTable);
component.addCellClickExtension();
finalizedHtml=orderSelectionTable.render();
component.finalizeComponent(finalizedHtml,"");
if(rootFolderId){rootGroup=orderSelectionTable.getGroupById(rootFolderId);
var rootFolderDomId=component.getStyles().getId()+"venue"+component.getVenue()+":"+rootFolderId+":header";
var rootFolderObj=_g(rootFolderDomId);
Util.Style.acss(rootFolderObj,"ordsel-o2-root-subsec");
}}else{if(reply.getStatus()==="Z"&&isCurrentVenue){finalizedHtml="<h3 class='info-hd'><span class='res-normal'>"+component.os2i18n.NO_FAVORITES_FOUND+"</span></h3><span class='res-none'>"+component.os2i18n.NO_FAVORITES_FOUND+"</span>";
MP_Util.Doc.FinalizeComponent(finalizedHtml,component,"");
}}}else{finalizedHtml=MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(),reply.getError());
MP_Util.Doc.FinalizeComponent(finalizedHtml,component,"");
}if(isCurrentVenue&&!component.venueCache[pageVenue]){if(pageVenue===0||pageVenue===1||pageVenue===2){component.venueCache[pageVenue]={};
component.venueCache[pageVenue].html=finalizedHtml;
if(reply.getStatus()==="S"){component.venueCache[pageVenue].comp_table=component.getComponentTable();
}}}}catch(err){if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}};
OrderSelectionComponentO2.prototype.sortRecordData=function(recordData){if(recordData.FAVORITES_SORT!=1||!recordData.FOLDER){return;
}var rootLevelIndex=null;
var rootFolder=null;
recordData.FOLDER.sort(this.sortBy("S_DESCRIP"));
$.each(recordData.FOLDER,function(i,folder){if(folder.ROOT_LEVEL_IND===1){rootLevelIndex=i;
}folder.ITEM.sort(OrderSelectionComponentO2.prototype.sortBy("ITEM_DISP"));
});
if(rootLevelIndex!==null){rootFolder=recordData.FOLDER.splice(rootLevelIndex,1);
recordData.FOLDER.unshift(rootFolder[0]);
}};
OrderSelectionComponentO2.prototype.sortBy=function(parameter){return function(a,b){var aName=a[parameter].toLowerCase();
var bName=b[parameter].toLowerCase();
return((aName<bName)?-1:((aName>bName)?1:0));
};
};
OrderSelectionComponentO2.prototype.dSelectAll=function(component){var rootOrdSecCont=component.getSectionContentNode();
var selOrdRows=Util.Style.g("ordsel-o2-selected",rootOrdSecCont,"dd");
var selOrdLen=selOrdRows.length;
for(var i=selOrdLen;
i--;
){var selOrdRow=selOrdRows[i];
Util.Style.rcss(selOrdRow,"ordsel-o2-selected");
}for(var i=component.venueCache.length;
i--;
){if(component.venueCache[i]){if(component.venueCache[i].html.indexOf("ordsel-o2-selected")>-1){component.venueCache[i].html=component.venueCache[i].html.replace(/ordsel-o2-selected/g,"");
}}}component.setActiveDiv(Util.Style.g("div-tab-item-selected",document.body,"DIV")[0]);
component.setActiveScratchPad(null);
component.checkPendingSR(component.getComponentId(),0);
};
OrderSelectionComponentO2.prototype.removeFavHandler=function(component,noeComponentId,favSynId,favSentId){return function(){component.removeFavFromSP(this,component,noeComponentId,favSynId,favSentId);
};
};
OrderSelectionComponentO2.prototype.removeFavFromSP=function(event,component,noeComponentId,synonymId,sentenceId){var componentId=this.getComponentId();
var fav=event;
var noei18n=i18n.discernabu.noe_o1;
var scratchPad=_g("noeScratchPad"+noeComponentId);
var scratchPadData=_gbt("DL",scratchPad);
var scratchPadCnt=0;
if(scratchPadData){scratchPadCnt=scratchPadData.length;
}var intComponentId=parseInt(componentId,10);
var ordselComponent=MP_Util.GetCompObjById(intComponentId);
if(!ordselComponent){ordselComponent=MP_Util.GetCompObjById(componentId);
}var selOrdRows=Util.Style.g("ordsel-o2-selected",ordselComponent.getSectionContentNode(),"dd");
for(var i=selOrdRows.length;
i--;
){var synId=$(selOrdRows[i]).find("span[data-syn-id]:first")[0];
var sentId=Util.gns(synId);
if(synId&&sentId&&parseInt(synonymId,10)===parseInt(synId.getAttribute("data-syn-id"),10)&&parseInt(sentenceId,10)===parseInt(sentId.getAttribute("data-sent-id"),10)){var checkbox=null;
Util.Style.rcss(selOrdRows[i],"ordsel-o2-selected");
if(fav){Util.de(fav);
scratchPadCnt--;
component.decrementSPCount(noeComponentId);
}break;
}}if(Util.Style.g("ordsel-o2-selected",ordselComponent.getSectionContentNode(),"dl").length===0){component.checkPendingSR(componentId,0);
}if(scratchPadCnt===0){var scratchPadCont=_g("noeScratchPadCont"+noeComponentId);
if(scratchPadCont){Util.Style.acss(scratchPadCont,"hidden");
}}};
OrderSelectionComponentO2.prototype.checkPendingSR=function(compId,pendingInd){var srObj=null;
var strCompId=String(compId);
var dataObj={};
function initPendingData(){var srObj=null;
var dataObj={};
var pendingSR=MP_Resources.getSharedResource("pendingDataSR");
srObj=new SharedResource("pendingDataSR");
dataObj.pendingDataObj=(!CERN_BrowserDevInd)?window.external.DiscernObjectFactory("PVFRAMEWORKLINK"):null;
dataObj.pendingDataCompArr=[];
srObj.setIsAvailable(true);
srObj.setResourceData(dataObj);
MP_Resources.addSharedResource("pendingDataSR",srObj);
return srObj;
}srObj=MP_Resources.getSharedResource("pendingDataSR");
if(!srObj){srObj=initPendingData();
}dataObj=srObj.getResourceData();
if(!dataObj.pendingDataObj){MP_Util.LogError("Unable to create PVFRAMEWORKLINK");
return;
}var pendingArr=dataObj.pendingDataCompArr;
if(pendingInd){if(pendingArr.join("|").indexOf(strCompId)===-1){pendingArr.push(strCompId);
}}else{var idx=pendingArr.length;
while(idx--){if(strCompId===pendingArr[idx]){pendingArr.splice(idx,1);
break;
}}}dataObj.pendingDataCompArr=pendingArr;
dataObj.pendingDataObj.SetPendingData(dataObj.pendingDataCompArr.length===0?0:1);
MP_Resources.setSharedResourceData("pendingDataSR",dataObj);
};
OrderSelectionComponentO2.prototype.addToOrRemoveFromScratchpadSR=function(scratchpadObj,isRemovingObj){var srObj=this.getScratchpadSharedResourceObject();
if(srObj){var dataObj=srObj.getResourceData();
if(!dataObj){return null;
}else{var scratchpadArr=dataObj.scratchpadObjArr;
if(scratchpadArr){if(isRemovingObj){var idx=scratchpadArr.length;
while(idx--){if(scratchpadArr[idx].favSynId==scratchpadObj.favSynId&&scratchpadArr[idx].favSentId==scratchpadObj.favSentId&&scratchpadArr[idx].favVenueType==scratchpadObj.favVenueType){scratchpadArr.splice(idx,1);
break;
}}}else{scratchpadArr.push(scratchpadObj);
}}dataObj.scratchpadObjArr=scratchpadArr;
MP_Resources.setSharedResourceData(srObj.getName(),dataObj);
srObj.notifyResourceConsumers();
return dataObj;
}}};
OrderSelectionComponentO2.prototype.getScratchpadSharedResourceObject=function(){var srObj=null;
var sharedResourceName="scratchpadSR";
srObj=MP_Resources.getSharedResource(sharedResourceName);
if(!srObj){srObj=MP_ScratchPadMgr.initScratchpadSR(sharedResourceName);
}return srObj;
};
OrderSelectionComponentO2.prototype.SPModalDialogRemovesFavorite=function(component,event,removeObject){if(removeObject.componentId){if(component.getComponentId()==removeObject.componentId){var ordSelCompFav=_g(removeObject.favoriteId);
var checkbox=null;
if(ordSelCompFav){Util.Style.rcss(ordSelCompFav,"ordsel-o2-selected");
}else{var orderSelectedCSS='class="table-cell ordsel-o2-info ordsel-o2-selected"';
var orderDeselectedCSS='class="table-cell ordsel-o2-info"';
var id="id=";
var selectedRowHTML1=id+removeObject.favoriteId+" "+orderSelectedCSS;
var removeSelection1=id+removeObject.favoriteId+" "+orderDeselectedCSS;
var selectedRowHTML2=id+'"'+removeObject.favoriteId+'" '+orderSelectedCSS;
var removeSelection2=id+'"'+removeObject.favoriteId+'" '+orderDeselectedCSS;
var selectedRowHTML3=orderSelectedCSS+" "+id+'"'+removeObject.favoriteId+'"';
var removeSelection3=orderDeselectedCSS+" "+id+'"'+removeObject.favoriteId+'"';
for(var i=component.venueCache.length;
i--;
){if(component.venueCache[i]){if(component.venueCache[i].html.indexOf(selectedRowHTML1)>-1){component.venueCache[i].html=component.venueCache[i].html.replace(selectedRowHTML1,removeSelection1);
matchFound=true;
break;
}if(component.venueCache[i].html.indexOf(selectedRowHTML2)>-1){component.venueCache[i].html=component.venueCache[i].html.replace(selectedRowHTML2,removeSelection2);
break;
}if(component.venueCache[i].html.indexOf(selectedRowHTML3)>-1){component.venueCache[i].html=component.venueCache[i].html.replace(selectedRowHTML3,removeSelection3);
break;
}}}}}}};
OrderSelectionComponentO2.prototype.isDisplayable=function(){if(this.isComponentFiltered()||(!CERN_BrowserDevInd&&!CERN_Platform.inMillenniumContext())){return false;
}return this.m_compDisp;
};
OrderSelectionComponentO2.prototype.isComponentFiltered=function(){if(!CERN_BrowserDevInd&&!CERN_Platform.inMillenniumContext()){return true;
}return(MPageComponent.prototype.isComponentFiltered.call(this));
};
MP_Util.setObjectDefinitionMapping("ORD_SEL_1",OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_2",OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_3",OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_4",OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_5",OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_6",OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_7",OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_8",OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_9",OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_10",OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_11",OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_12",OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_13",OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_14",OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_15",OrderSelectionComponentO2);
MP_Util.setObjectDefinitionMapping("ORD_SEL_PRSNL",OrderSelectionComponentO2);
