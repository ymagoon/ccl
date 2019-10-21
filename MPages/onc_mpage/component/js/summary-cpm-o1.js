function CPMO1ComponentStyle(){this.initByNamespace("cpm-summary");
}CPMO1ComponentStyle.prototype=new ComponentStyle();
CPMO1ComponentStyle.prototype.constructor=ComponentStyle;
function CPMCO1Component(criterion){this.setCriterion(criterion);
this.setStyles(new CPMO1ComponentStyle());
this.setComponentLoadTimerName("USR:MPG.CPM.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.CPM.O1 - render component");
this.setScope(1);
this.setIncludeLineNumber(true);
this.m_cpmController=null;
this.m_cpmResourceManager=null;
this.m_fullCPMList=null;
this.m_suggestedCPMList=null;
this.m_nodeConfiguration=null;
this.m_pathwayTypeMean="";
this.m_pathwayTypeCd=0;
this.m_pathwayId=0;
this.m_pathwayInstance=null;
this.m_conceptConfiguration=null;
}CPMCO1Component.prototype=new MPageComponent();
CPMCO1Component.prototype.constructor=MPageComponent;
CPMCO1Component.prototype.getCPMResourceManager=function(){return this.m_cpmResourceManager;
};
CPMCO1Component.prototype.setFullCPMList=function(list){this.m_fullCPMList=list;
};
CPMCO1Component.prototype.getFullCPMList=function(){var cpmResourceManager=this.getCPMResourceManager();
if(!this.m_fullCPMList){this.m_fullCPMList=cpmResourceManager.getCPMResourceList();
this.m_fullCPMList.sort(this.sortByDispFunc);
if(!this.m_fullCPMList.length){this.m_fullCPMList=null;
}}return this.m_fullCPMList;
};
CPMCO1Component.prototype.setSuggestedCPMList=function(list){this.m_suggestedCPMList=list;
};
CPMCO1Component.prototype.getSuggestedCPMList=function(){var cpmResourceManager=this.getCPMResourceManager();
if(!this.m_suggestedCPMList){this.m_suggestedCPMList=cpmResourceManager.getSuggestedCPMResourceList();
this.m_suggestedCPMList.sort(this.sortByDispFunc);
if(!this.m_suggestedCPMList.length){this.m_suggestedCPMList=null;
}}return this.m_suggestedCPMList;
};
CPMCO1Component.prototype.setCPMResourceManager=function(resourceManager){if(resourceManager!==null&&!CPMResourceManager.prototype.isPrototypeOf(resourceManager)){throw new Error("Type Error: resourceManager passed into CPMCO1Component method setCPMResourceManager not an instance of CPMResourceManager or null");
}this.m_cpmResourceManager=resourceManager;
};
CPMCO1Component.prototype.getCPMController=function(){if(!this.m_cpmController){this.m_cpmController=new CPMController();
}return this.m_cpmController;
};
CPMCO1Component.prototype.getPathwayId=function(){return this.m_pathwayId;
};
CPMCO1Component.prototype.setPathwayId=function(pathwayId){if(typeof pathwayId!=="number"){throw new Error("Type Error: Invalid 'conceptCd' passed into MPageCPNodeController method 'setPathwayId'");
}this.m_pathwayId=pathwayId;
};
CPMCO1Component.prototype.getPathwayTypeCd=function(){return this.m_pathwayTypeCd;
};
CPMCO1Component.prototype.setPathwayTypeCd=function(pathwayTypeCd){if(typeof pathwayTypeCd!=="number"){throw new Error("Type Error: Invalid 'conceptCd' passed into MPageCPNodeController method 'setPathwayTypeCd'");
}this.m_pathwayTypeCd=pathwayTypeCd;
};
CPMCO1Component.prototype.getPathwayTypeMean=function(){return this.m_pathwayTypeMean;
};
CPMCO1Component.prototype.setPathwayTypeMean=function(pathwayTypeMean){if(typeof pathwayTypeMean!=="string"){throw new Error("Type Error: Invalid 'conceptCd' passed into MPageCPNodeController method 'pathwayTypeMean'");
}this.m_pathwayTypeMean=pathwayTypeMean;
};
CPMCO1Component.prototype.getPathwayInstance=function(){return this.m_pathwayInstance;
};
CPMCO1Component.prototype.setPathwayInstance=function(pathwayInstance){if(typeof pathwayInstance!=="object"){throw new Error("Type Error: Invalid 'conceptCd' passed into MPageCPNodeController method 'pathwayTypeMean'");
}this.m_pathwayInstance=pathwayInstance;
};
CPMCO1Component.prototype.getConceptConfig=function(){return this.m_conceptConfiguration;
};
CPMCO1Component.prototype.setConceptConfig=function(conceptConfig){this.m_conceptConfiguration=conceptConfig;
};
CPMCO1Component.prototype.preProcessing=function(){this.setPlusAddEnabled(false);
};
CPMCO1Component.prototype.resizeComponent=function(){MPageComponent.prototype.resizeComponent.call(this);
var compId=this.getStyles().getId();
var jqComponent=$(this.getSectionContentNode());
var jqContentBody=jqComponent.children(".content-body");
if(!jqContentBody.length){return;
}var domContentBody=jqContentBody.get(0);
var jqTabHeader=$("#tabs"+compId);
var jqCPMTabContent=$("#tabPage"+compId).children(".cpm-tab");
var tabContentHeight;
jqContentBody.css({"overflow-x":"hidden"});
tabContentHeight=parseInt(jqContentBody.css("max-height"),10)-(jqTabHeader.outerHeight(true)+12);
jqCPMTabContent.css({"max-height":tabContentHeight+"px","overflow-x":"hidden"});
jqContentBody.css("min-height","0px");
if(domContentBody.scrollHeight<=parseFloat(jqContentBody.css("max-height"))){jqContentBody.css("min-height",domContentBody.scrollHeight+"px");
}};
CPMCO1Component.prototype.cpmTabClickedTimerTrigger=function(timerMetaData){var criterion=this.getCriterion();
var catMean=criterion.category_mean;
var timer=new CapabilityTimer("CAP:MPG_CPM-o1_SELECTED",catMean);
timer.addMetaData("rtms.legacy.metadata.1",timerMetaData);
timer.capture();
};
CPMCO1Component.prototype.handleTabClick=function(tabType){var compId=this.getStyles().getId();
var cpmController=this.getCPMController();
var tabId="";
var tabPageId="tabPage"+compId;
var html="";
cpmController.dispose();
switch(tabType){case"SUMMARY":tabId=compId+"TabSummary";
html+=this.buildCardsHtml(this.getSuggestedCPMList()||[]);
break;
case"ADD_CPM":tabId=compId+"TabAdd";
html+=this.buildAddCPMHtml();
break;
}$("#"+tabPageId).html(html);
$("#tabs"+compId).find("li").removeClass("cpm-tab-active-header");
$("#"+tabId).addClass("cpm-tab-active-header");
$("#chxTabsMenu"+compId).empty();
if(tabType==="SUMMARY"){this.attachCardEventHandlers();
}if(tabType==="ADD_CPM"){this.handleAddClick();
}this.resizeComponent();
};
CPMCO1Component.prototype.attachCardEventHandlers=function(){var compId=this.getStyles().getId();
$("#cardArea"+compId).on("click",".card-begin-link",this.cardOpenClick.bind(this));
};
CPMCO1Component.prototype.cardOpenClick=function(event){var domElement=event.currentTarget||event.srcElement;
var jqOpenBtn=$(domElement);
var cpmResourceId=jqOpenBtn.attr("data-resource-id");
this.addDynamicView(cpmResourceId);
};
CPMCO1Component.prototype.cpmTabClick=function(event){var domElement=event.currentTarget||event.srcElement;
var jqTab=$(domElement);
var tabType;
var resourceId;
if(jqTab.hasClass("cpm-tab-active-header")){return;
}tabType=jqTab.attr("data-tab-type");
resourceId=jqTab.attr("data-resource-id");
this.handleTabClick(tabType,resourceId);
};
CPMCO1Component.prototype.attachEventHandlers=function(){$("#tabs"+this.getStyles().getId()).on("click","li.cpm-tab-header",this.cpmTabClick.bind(this));
this.attachCardEventHandlers();
};
CPMCO1Component.prototype.buildTabContainerTimerTrigger=function(timerMetaData){var criterion=this.getCriterion();
var catMean=criterion.category_mean;
var timer=new CapabilityTimer("CAP:MPG_CPM-o1_TRIGGERED",catMean);
timer.addMetaData("rtms.legacy.metadata.1",timerMetaData);
timer.capture();
};
CPMCO1Component.prototype.buildTabsContainerHtml=function(){var summaryI18N=i18n.discernabu.summary_cpm_o1;
var compId=this.getStyles().getId();
var suggestedCPMResources=this.getSuggestedCPMList()||[];
var timerMetaData;
var metaDataArray=[];
var html="";
html+="<div class='cpm-tab-container' id='tabContainer"+compId+"'>";
html+="<div class='cpm-tabs' id='tabs"+compId+"'>";
html+="<ul>";
html+="<li id='"+compId+"TabSummary' class='cpm-tab-header cpm-tab-active-header' data-tab-type='SUMMARY'>";
html+="<span class='cpm-tab-left-edge'>&nbsp;</span>";
html+="<span class='cpm-tab-text'>"+summaryI18N.SUMMARY+"</span>";
html+="<span class='cpm-tab-right-edge'>&nbsp;</span>";
html+="</li>";
timerMetaData=metaDataArray.join(",");
if(timerMetaData!==""){this.buildTabContainerTimerTrigger(timerMetaData);
}html+="<li id='"+compId+"TabAdd' class='cpm-tab-header' data-tab-type='ADD_CPM'>";
html+="<span class='cpm-tab-left-edge'>&nbsp;</span>";
html+="<span class='cpm-tab-text'>+</span>";
html+="<span class='cpm-tab-right-edge'>&nbsp;</span>";
html+="</li>";
html+="</ul>";
html+="<div id='chxTabsMenu"+compId+"'></div>";
html+="</div>";
html+="<hr /><div class='cpm-tabs-content' id='tabContentContainer"+compId+"'>";
html+="<div class='cpm-tabpage' id='tabPage"+compId+"'>"+this.buildCardsHtml(suggestedCPMResources)+"</div>";
html+="</div>";
html+="</div>";
return html;
};
CPMCO1Component.prototype.retrieveComponentData=function(){var criterion=this.getCriterion();
var personId=criterion.person_id;
var encounterId=criterion.encntr_id;
var prsnlId=criterion.provider_id;
var pprCd=criterion.ppr_cd;
var sendAr=[];
var request;
var loadTimer=new RTMSTimer(this.getComponentLoadTimerName(),criterion.category_mean);
var renderTimer=new RTMSTimer(this.getComponentRenderTimerName(),criterion.category_mean);
sendAr.push("^MINE^",personId+".0",encounterId+".0",prsnlId+".0",pprCd+".0",1);
request=new ComponentScriptRequest();
request.setProgramName("MP_GET_CPM_PATHWAY_STATUS");
request.setParameterArray(sendAr);
request.setAsyncIndicator(true);
request.setName("getCPMsByPatient");
request.setComponent(this);
request.setResponseHandler(this.handleGetCPMReply.bind(this));
request.setLoadTimer(loadTimer);
request.setRenderTimer(renderTimer);
request.performRequest();
};
CPMCO1Component.prototype.handleGetCPMReply=function(reply){var response;
var compId=this.getStyles().getId();
if(!reply){this.finalizeComponent(MP_Util.HandleErrorResponse(compId,"CPM retrieval failed."),"");
return;
}if(reply.getStatus()==="S"||reply.getStatus()==="Z"){try{response=reply.getResponse();
this.createCPMResources(response.ACTIVITY_QUAL||[]);
this.setFullCPMList(null);
this.setSuggestedCPMList(null);
this.renderComponent();
}catch(err){logger.logError(err.message);
throw err;
}}else{this.finalizeComponent(MP_Util.HandleErrorResponse(compId,"CPM retrieval failed."),"");
}};
CPMCO1Component.prototype.buildCPMSearchListItemHtml=function(cpmResource){if(!CPMResource.prototype.isPrototypeOf(cpmResource)){throw new Error("Type Error: cpmResource passed into CPMCO1Component method buildCPMSearchListItemHtml not instance of CPMResource");
}return"<li class='cpm-search-result-entry' data-resource-id='"+cpmResource.getId()+"'>"+cpmResource.getConceptDisp()+"</li>";
};
CPMCO1Component.prototype.buildCPMSearchList=function(cpmResourceList){if(!cpmResourceList||!cpmResourceList.length){return"";
}cpmResourceList.sort(this.sortByDispFunc);
var html="";
var cpmResource;
var cLen=cpmResourceList.length;
var i;
for(i=0;
i<cLen;
i++){cpmResource=cpmResourceList[i];
html+=this.buildCPMSearchListItemHtml(cpmResource);
}return html;
};
CPMCO1Component.prototype.buildAddCPMHtml=function(){var summaryI18N=i18n.discernabu.summary_cpm_o1;
var compId=this.getStyles().getId();
var cpmResourceList=this.getFullCPMList()||[];
var html="";
html+="<h2 class='cpm sec-hd'>";
html+="<span class='sec-title'>";
html+="<span class='comp-title'>"+summaryI18N.ADD_CARE_PROCESS_MODEL+"</span>";
html+="<span class='header-separator'>&nbsp;</span>";
html+="</span>";
html+="</h2>";
html+="<div id='addCpmSecContent"+compId+"' class='cpm-summary sec-content'>";
html+="<div id='addCpmSearchContainer"+compId+"' class='search-container'>";
html+="<div id='addCpmSearchArea"+compId+"' class='search-area'>";
html+="<span id='addCpmSearchText"+compId+"' class='search-text'>"+summaryI18N.SEARCH_TEXT+":</span>";
html+="<input id='addCpmSearchbox"+compId+"' type='text' class='search-box'>";
html+="</div>";
html+="</div>";
html+="<ul id='addCpmCpmList"+compId+"' class='cpm-list'>";
html+=this.buildCPMSearchList(cpmResourceList);
html+="</ul>";
html+="<div class='cpm-summary button-container'>";
html+="<button id='addCpmAddButton"+compId+"' class='add button'>"+summaryI18N.ADD_BUTTON+"</button>";
html+="<button id='addCpmCancelButton"+compId+"' class='cancel button'>"+summaryI18N.CANCEL_BUTTON+"</button>";
html+="</div>";
html+="</div>";
return html;
};
CPMCO1Component.prototype.handleAddClick=function(){var compId=this.getStyles().getId();
var jqSecContent=$("#addCpmSecContent"+compId);
var jqCPMList=$("#addCpmCpmList"+compId);
var jqSearchBox=$("#addCpmSearchbox"+compId);
jqCPMList.on("click","li",this.cpmListItemClick.bind(this));
jqCPMList.on("dblclick","li",this.cpmListItemDoubleClick.bind(this));
jqSecContent.on("click","button",this.searchButtonsClick.bind(this));
jqSearchBox.keyup(this.searchBoxKeyup.bind(this));
jqSearchBox.focus();
};
CPMCO1Component.prototype.cpmListItemClick=function(event){var domElement=event.currentTarget||event.srcElement;
var jqListItem=$(domElement);
var jqCPMList=$("#addCpmCpmList"+this.getStyles().getId());
var clickedItemId=jqListItem.attr("data-resource-id");
jqCPMList.find("li.selected").not("[data-resource-id='"+clickedItemId+"']").removeClass("selected");
jqListItem.toggleClass("selected");
};
CPMCO1Component.prototype.cpmListItemDoubleClick=function(event){var domElement=event.currentTarget||event.srcElement;
var jqListItem=$(domElement);
var clickedItemId=jqListItem.attr("data-resource-id");
jqListItem.addClass("selected");
this.addDynamicView(clickedItemId);
};
CPMCO1Component.prototype.searchButtonsClick=function(event){var compId=this.getStyles().getId();
var domElement=event.currentTarget||event.srcElement;
var buttonId=domElement.id;
var jqCPMList=$("#addCpmCpmList"+compId);
var jqSelectedItem=jqCPMList.find("li.selected");
var cpmResourceId="";
var jqSearchBox=null;
if(buttonId==="addCpmAddButton"+compId){cpmResourceId=jqSelectedItem.attr("data-resource-id");
this.addDynamicView(cpmResourceId);
}else{if(buttonId==="addCpmCancelButton"+compId){jqSearchBox=$("#addCpmSearchbox"+compId);
jqSelectedItem.removeClass("selected");
jqSearchBox.val("").keyup();
jqSearchBox.focus();
}}};
CPMCO1Component.prototype.searchBoxKeyup=function(event){var domElement=event.currentTarget||event.srcElement;
var searchValue=$.trim($(domElement).val()).toLowerCase();
var cpmResource;
var cpmTerm;
var cpmList=this.getFullCPMList()||[];
var cLen=cpmList.length;
var i;
var html="";
for(i=0;
i<cLen;
i++){cpmResource=cpmList[i];
cpmTerm=cpmResource.getConceptDisp().toLowerCase();
if(cpmTerm.indexOf(searchValue)>=0){html+=this.buildCPMSearchListItemHtml(cpmResource);
}}$("#addCpmCpmList"+this.getStyles().getId()).html(html);
};
CPMCO1Component.prototype.buildCardsHtml=function(suggestedCPMResources){var summaryI18N=i18n.discernabu.summary_cpm_o1;
var compId=this.getStyles().getId();
var cpmResource;
var sLen=suggestedCPMResources.length;
var html="";
var i;
var triggerTypes=CPMResource.TRIGGER_TYPES;
html+="<div class='cpm-summary card-area' id='cardArea"+compId+"'>";
var metaDataArray=[];
for(i=0;
i<sLen;
i++){var card=suggestedCPMResources[i];
var mean=card.getConceptDisp();
metaDataArray.push(mean);
}var timerMetaData=metaDataArray.join(",");
if(timerMetaData!==""){this.buildTabContainerTimerTrigger(timerMetaData);
}for(i=0;
i<sLen;
i++){cpmResource=suggestedCPMResources[i];
html+="<div class='cpmo1-card-wrapper'>";
html+="<div class='card'>";
html+="<div class='card-header'>";
html+="<span class='card-title' title='"+cpmResource.getConceptDisp()+"'>"+cpmResource.getConceptDisp()+"</span>";
html+="<span class='card-begin-link' data-resource-id='"+cpmResource.getId()+"' title='"+summaryI18N.OPEN+"' >"+summaryI18N.OPEN+"</span>";
html+="</div>";
html+="<div class='reason-included'>"+summaryI18N.REASON_INCLUDED+"</div>";
html+="<div class='reasons'>";
switch(cpmResource.getTriggerType()){case triggerTypes.DIAGNOSIS:case triggerTypes.PROBLEM:html+="<span class='category'>"+summaryI18N.PROBLEM+":</span>";
html+="<span class='result'>"+cpmResource.getTriggerDescription()+"</span>";
break;
case triggerTypes.PATHWAY_STATUS:html+="<span class='category'>"+summaryI18N.PROPOSED_BY+":</span>";
html+="<span class='result'>"+cpmResource.getProposedByName()+"</span>";
break;
}html+="</div>";
html+="</div>";
html+="</div>";
}html+="</div>";
return html;
};
CPMCO1Component.prototype.addDynamicView=function(resourceId){var cpm=this.getCPMResourceManager().getCPMResourceById(resourceId);
var mean="DYN_"+cpm.getConceptCd();
var viewExists=MP_Viewpoint.getTabControlObject().tabExists(mean);
if(mean!==this.m_summaryMean){this.cpmTabClickedTimerTrigger(mean);
}var cpmWorkflow=new CPMWorkflow();
cpmWorkflow.setCPMResource(cpm);
cpmWorkflow.setCategoryMean(mean);
var viewContainer=new ViewContainer(mean);
viewContainer.setViewType("DYN_CPM");
viewContainer.setViewName(cpm.getConceptDisp());
viewContainer.setCategoryMean(mean);
viewContainer.setSequence(0);
viewContainer.setViewObject(cpmWorkflow);
if(viewExists){$("#"+mean+"tab").click();
}else{MP_Viewpoint.addDynamicTab(viewContainer,true);
}};
CPMCO1Component.prototype.isPreviouslyActivated=function(mean){var viewContainerArray=MP_Viewpoint.getViewpointObject().getViewContainerArray();
var y=0;
for(y;
y<viewContainerArray.length;
y++){if(mean===viewContainerArray[y].getCategoryMean()){return true;
}}return false;
};
CPMCO1Component.prototype.createCPMResources=function(cpmResponseList){if(!cpmResponseList||typeof cpmResponseList!=="object"){throw new Error("Type Error: cpmResponse passed into CPMCO1Component method createCPMResources is undefined or not an object");
}var cpmResourceManager=this.getCPMResourceManager();
if(!cpmResourceManager){cpmResourceManager=new CPMResourceManager();
this.setCPMResourceManager(cpmResourceManager);
}cpmResourceManager.removeAllCPMResources();
var conceptList=cpmResponseList||[];
var cLen=conceptList.length;
var i;
for(i=0;
i<cLen;
i++){var cpmResource=CPMResourceManager.createCPMResource(conceptList[i]);
cpmResourceManager.addCPMResource(cpmResource);
}};
CPMCO1Component.prototype.sortByDispFunc=function(a,b){var aDisp=a.getConceptDisp();
var bDisp=b.getConceptDisp();
if(aDisp<bDisp){return -1;
}else{if(aDisp>bDisp){return 1;
}else{return 0;
}}};
CPMCO1Component.prototype.renderComponent=function(){var html="";
html+="<div class='content-body'>";
html+=this.buildTabsContainerHtml();
html+="</div>";
this.finalizeComponent(html);
this.attachEventHandlers();
};
MP_Util.setObjectDefinitionMapping("WF_CPM_COMP",CPMCO1Component);