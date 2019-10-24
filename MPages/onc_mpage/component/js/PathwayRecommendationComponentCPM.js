var recComponentCnt=0;
function PathwayRecommendationComponentCPMStyle(cnt){cnt=cnt||0;
this.initByNamespace("po_rec"+cnt);
}PathwayRecommendationComponentCPMStyle.inherits(ComponentStyle);
function PathwayRecommendationComponentCPM(criterion){this.m_availableOrders=[];
this.m_availableTreatments=[];
this.m_conceptGroupMeanings="ORDEROPTS";
this.m_pathwaysScratchPad=new PathwaysScratchPad();
this.m_suggestedOrders=[];
this.m_suggestedTreatments=[];
this.m_planFavoritesLoadedInd=false;
this.m_planFavorites=[];
this.m_orderedInfo=null;
this.m_loadTimer=null;
this.m_renderTimer=null;
this.setCriterion(criterion);
this.setStyles(new PathwayRecommendationComponentCPMStyle(recComponentCnt));
recComponentCnt++;
CERN_EventListener.addListener(this,"MP_SCRATCHPAD_ORDERS_SIGNED",function(event,payload){CPEventManager.notifyObservers("MP_SCRATCHPAD_ORDERS_SIGNED",payload);
},this);
CERN_EventListener.addListener(this,EventListener.EVENT_SCRATCHPAD_UPDATES_COMPONENT,function(event,payload){CPEventManager.notifyObservers(EventListener.EVENT_SCRATCHPAD_UPDATES_COMPONENT,payload);
},this);
this.missingOrderConfigInd=false;
}PathwayRecommendationComponentCPM.prototype=new CPMMPageComponent();
PathwayRecommendationComponentCPM.prototype.constructor=PathwayRecommendationComponentCPM;
PathwayRecommendationComponentCPM.prototype.getMissingOrderConfigInd=function(){return this.m_missingOrderConfigInd;
};
PathwayRecommendationComponentCPM.prototype.setMissingOrderConfigInd=function(val){this.m_missingOrderConfigInd=val;
};
PathwayRecommendationComponentCPM.prototype.getLoadTimer=function(){return this.m_loadTimer;
};
PathwayRecommendationComponentCPM.prototype.setLoadTimer=function(val){this.m_loadTimer=val;
};
PathwayRecommendationComponentCPM.prototype.getRenderTimer=function(){return this.m_renderTimer;
};
PathwayRecommendationComponentCPM.prototype.setRenderTimer=function(val){this.m_renderTimer=val;
};
PathwayRecommendationComponentCPM.prototype.getAvailableOrders=function(){return this.m_availableOrders;
};
PathwayRecommendationComponentCPM.prototype.getAvailableTreatments=function(){return this.m_availableTreatments;
};
PathwayRecommendationComponentCPM.prototype.getPathwaysScratchPad=function(){return this.m_pathwaysScratchPad;
};
PathwayRecommendationComponentCPM.prototype.getSuggestedOrders=function(){return this.m_suggestedOrders;
};
PathwayRecommendationComponentCPM.prototype.getSuggestedTreatments=function(){return this.m_suggestedTreatments;
};
PathwayRecommendationComponentCPM.prototype.getOrderedInfo=function(){return this.m_orderedInfo;
};
PathwayRecommendationComponentCPM.prototype.setAvailableOrders=function(val){this.m_availableOrders=CERN_PATHWAYS_SHARED_O1.SortOrderArray(val);
};
PathwayRecommendationComponentCPM.prototype.setOrderedInfo=function(val){this.m_orderedInfo=val;
};
PathwayRecommendationComponentCPM.prototype.setAvailableTreatments=function(val){this.m_availableTreatments=CERN_PATHWAYS_SHARED_O1.SortTreatmentArray(val);
};
PathwayRecommendationComponentCPM.prototype.clearPathwaysScratchPad=function(){this.m_pathwaysScratchPad.clear();
};
PathwayRecommendationComponentCPM.prototype.setSuggestedOrders=function(val){this.m_suggestedOrders=CERN_PATHWAYS_SHARED_O1.SortOrderArray(val);
};
PathwayRecommendationComponentCPM.prototype.setSuggestedTreatments=function(val){this.m_suggestedTreatments=CERN_PATHWAYS_SHARED_O1.SortTreatmentArray(val);
};
PathwayRecommendationComponentCPM.prototype.finalizePlansToSuggest=function(plansToSuggest){var finalizedPlansToSuggest=[];
var planFavorites=this.m_planFavorites;
var curQualPlans=[];
var docEventManager=eventManagers.findManager(this.getNodeId());
for(var x=plansToSuggest.length;
x--;
){curQualPlans=[];
for(var y=planFavorites.length;
y--;
){if(planFavorites[y].PATHWAY_CATALOG_ID===plansToSuggest[x].PARENT_ENTITY_ID){curQualPlans.push({PARENT_ENTITY_ID:planFavorites[y].PATHWAY_CATALOG_ID,PARENT_ENTITY_NAME:"PATHWAY_CATALOG",PATHWAY_CUSTOMIZED_PLAN_ID:planFavorites[y].PATHWAY_CUSTOMIZED_PLAN_ID,PLAN_DESCRIPTION:planFavorites[y].NAME,ACTION_TYPE_MEAN:"SUGGEST_POWER_PLAN",RESPONSE_IDENT:plansToSuggest[x].RESPONSE_IDENT,ITEM_OCID:docEventManager.getItemsByResponseIdent(plansToSuggest[x].RESPONSE_IDENT)});
}}if(curQualPlans.length===0){curQualPlans=[{PARENT_ENTITY_ID:plansToSuggest[x].PARENT_ENTITY_ID,PARENT_ENTITY_NAME:"PATHWAY_CATALOG",PATHWAY_CUSTOMIZED_PLAN_ID:0,PLAN_DESCRIPTION:"",ACTION_TYPE_MEAN:"SUGGEST_POWER_PLAN",RESPONSE_IDENT:plansToSuggest[x].RESPONSE_IDENT,ITEM_OCID:docEventManager.getItemsByResponseIdent(plansToSuggest[x].RESPONSE_IDENT)}];
}finalizedPlansToSuggest=finalizedPlansToSuggest.concat(curQualPlans);
}return finalizedPlansToSuggest;
};
PathwayRecommendationComponentCPM.prototype.retrieveComponentData=function(){var that=this;
var nodeId=that.getNodeId();
var pathwayId=that.getPathwayId();
var loadTimerName="USR:MPG.PathwayRecommendation.O2 - load component";
var renderTimerName="ENG:MPG.PathwayRecommendation.O2 - render component";
var loadTimer=new RTMSTimer(loadTimerName);
var renderTimer=new RTMSTimer(renderTimerName);
loadTimer.addMetaData("pathwayId",pathwayId);
loadTimer.addMetaData("nodeId",nodeId);
renderTimer.addMetaData("pathwayId",pathwayId);
renderTimer.addMetaData("nodeId",nodeId);
that.setComponentLoadTimerName(loadTimerName);
that.setComponentRenderTimerName(renderTimerName);
that.setLoadTimer(loadTimer);
that.setRenderTimer(renderTimer);
loadTimer.start();
var componentConfig=that.getComponentConfig();
var conceptCd=that.getConceptCd();
var conceptGroupCd=that.getConceptGroupCd();
var intentionCd=that.getIntentionCd();
var altSelCatIds=[];
var x;
var y;
var i;
var j;
for(y=componentConfig.length;
y--;
){if(componentConfig[y].DETAIL_RELTN_CD_MEAN==="ORDEROPTS"&&componentConfig[y].ENTITY_NAME==="ALT_SEL_CAT"){altSelCatIds.push(componentConfig[y].ENTITY_ID);
}}if(altSelCatIds.length>0){var criterion=that.getCriterion();
var prsnlInfo=criterion.getPersonnelInfo();
var encntrs=prsnlInfo.getViewableEncounters();
var encntrVal=encntrs?("value("+encntrs+")"):"0.0";
var scriptRequest=new ScriptRequest();
altSelCatIds=MP_Util.CreateParamArray(altSelCatIds,1);
scriptRequest.setAsyncIndicator(false);
scriptRequest.setProgramName("CP_GET_AVAIL_ORDER_RECOS");
scriptRequest.setParameterArray(["^MINE^",criterion.person_id+".0",criterion.encntr_id+".0",criterion.provider_id+".0",conceptCd+".0",conceptGroupCd+".0",intentionCd+".0",altSelCatIds,"^^",2,encntrVal]);
scriptRequest.setResponseHandler(function(response){if(response.m_status==="S"){response=response.m_responseData;
var children=null;
var orderList=[];
var usageFlag=0;
var orderSentenceUsageFlags=response.USAGE_FLAGS;
for(x=0,y=response.PARENT.length;
x<y;
x++){children=response.PARENT[x].CHILD;
for(i=0,j=children.length;
i<j;
i++){if(children[i].SYNONYM_ID>0||children[i].PATH_CAT_ID>0||children[i].REG_CAT_SYN_ID>0){usageFlag=0;
if(children[i].SENTENCE_ID>0){for(var sCntr=orderSentenceUsageFlags.CNT;
sCntr--;
){if(children[i].SENTENCE_ID===orderSentenceUsageFlags.QUAL[sCntr].SENTENCE_ID){usageFlag=orderSentenceUsageFlags.QUAL[sCntr].USAGE_FLAG;
break;
}}}children[i].USAGE_FLAG=usageFlag;
orderList.push(children[i]);
}}}that.setAvailableOrders(orderList);
that.setOrderedInfo(response.ORDERED_INFO);
}});
scriptRequest.performRequest();
}else{that.setMissingOrderConfigInd(true);
}loadTimer.stop();
that.setAvailableTreatments(CERN_PATHWAYS_SHARED_O1.GetTreatmentNodes(that));
that.setupComponentDisplay();
};
PathwayRecommendationComponentCPM.prototype.setupComponentDisplay=function(){var that=this;
var renderTimerName="ENG:MPG.PathwayRecommendation.O2 - render component";
var renderTimer=new RTMSTimer(renderTimerName);
var target=$(that.getSectionContentNode());
var resetOrderButton=function(button){button.removeClass("ordered").val("Order");
};
var getOrderEntityName=function(orderType,element){var orderEntityName="";
switch(orderType){case"ORD":orderEntityName="ORDER_CATALOG_SYNONYM";
break;
case"SENT":orderEntityName="ORDER_SENTENCE";
break;
case"REG":orderEntityName="REGIMEN_CATALOG";
break;
case"PP":if(element.attr("favorite-id")){orderEntityName="PATHWAY_CUSTOMIZED_PLAN";
}else{orderEntityName="PATHWAY_CATALOG";
}break;
}return(orderEntityName);
};
var getEntityId=function(entityName,element){var entityId;
switch(entityName){case"ORDER_SENTENCE":entityId=element.attr("sentence-id");
break;
case"PATHWAY_CUSTOMIZED_PLAN":entityId=element.attr("favorite-id");
break;
default:entityId=element.attr("id");
}return(entityId);
};
var addTreatmentAction=function(nodeId){var suggestedTreatmentElements=target.find(".pw-suggested-treatments").find(".pw-treatment-link");
var commitNodeAction={CP_NODE_ID:that.getNodeId(),CP_COMPONENT_ID:that.getCpComponentId(),ACTION_DETAILS:[{PARENT_ENTITY_NAME:"CP_NODE",PARENT_ENTITY_ID:nodeId,ACTION_DETAIL_TYPE_MEAN:"TREATSEL"}]};
var x,y;
for(x=0,y=suggestedTreatmentElements.length;
x<y;
x++){commitNodeAction.ACTION_DETAILS.push({PARENT_ENTITY_NAME:"CP_NODE",PARENT_ENTITY_ID:$(suggestedTreatmentElements[x]).attr("id"),ACTION_DETAIL_TYPE_MEAN:"TREATSUGGEST"});
}CPEventManager.notifyObservers("COMMIT_NODE_ACTION",commitNodeAction);
};
var updateSuggestedToggle=function(){var suggestedOrders=target.find(".pw-suggested-orders");
var toggleOrders=target.find(".pw-toggle-orders");
if(suggestedOrders.find(".ordered").length===suggestedOrders.find(".pw-order-button").length){toggleOrders.html(i18n.innovations.pathways_shared.UNSELECT_ALL);
toggleOrders.removeClass("pw-select-all").addClass("pw-unselect-all");
}else{toggleOrders.html(i18n.innovations.pathways_shared.SELECT_ALL);
toggleOrders.addClass("pw-select-all").removeClass("pw-unselect-all");
}};
target.delegate(".pw-order-button","click",function(){var pathwaysScratchPad=that.getPathwaysScratchPad();
var element=$(this);
var orderId=element.attr("id");
var sentenceId=element.attr("sentence-id")||0;
var favoriteId=element.attr("favorite-id")||sentenceId;
var orderType=element.attr("order-type");
var orderedInd=element.hasClass("ordered");
var nodeId=that.getNodeId();
if(orderedInd){pathwaysScratchPad.removeOrder(orderId,orderType,nodeId,sentenceId);
}else{pathwaysScratchPad.addOrder(orderId,orderType,nodeId,sentenceId);
}var added=CERN_PATHWAYS_SHARED_O1.UpdateScratchpad(that,orderId,element.hasClass("ordered"),orderType,favoriteId);
if(added){element.toggleClass("ordered");
if(element.hasClass("ordered")){element.val("Remove");
}else{element.val("Order");
}}updateSuggestedToggle();
});
target.delegate(".pw-treatment-link","mousedown",function(){var nodeId=$(this).attr("id");
if(parseInt(nodeId,10)!==CERN_PATHWAYS_SHARED_O1.GetActiveTreatmentId()){addTreatmentAction(nodeId);
}CPEventManager.notifyObservers("CP_LOAD_PATHWAY_TREATMENT",nodeId);
});
target.delegate("#btnToggleClinicalTrial","click",function(){PathwayDeviationDialog.launch(that.getPathwayId(),that.getNodeId(),that.getCpComponentId(),$(this).val());
});
target.delegate("#btnToggleOffPathway","click",function(){PathwayDeviationDialog.launch(that.getPathwayId(),that.getNodeId(),that.getCpComponentId(),$(this).val());
});
target.delegate(".pw-toggle-orders","click",function(){var element=$(this);
var items=target.find(".pw-suggested-orders .pw-section-details-item");
var mode,button,x,y;
if(element.hasClass("pw-select-all")){mode="SELECT";
}else{if(element.hasClass("pw-unselect-all")){mode="UNSELECT";
}}if(mode==="SELECT"){for(x=0,y=items.length;
x<y;
x++){button=$(items[x]).children(".pw-order-button");
if(!button.hasClass("ordered")){button.click();
}}}else{for(x=0,y=items.length;
x<y;
x++){button=$(items[x]).children(".pw-order-button");
if(button.hasClass("ordered")){button.click();
}}}updateSuggestedToggle();
return false;
});
target.delegate(".pw-section-header","click",function(){var element=$(this);
var iconContainer=element.children(".pw-icon-container");
var manualState=element.attr("manual-state");
if(manualState==="collapsed"){manualState="expanded";
}else{manualState="collapsed";
}element.attr("manual-state",manualState);
if(iconContainer.hasClass("pw-collapsed-icon")){iconContainer.removeClass("pw-collapsed-icon").addClass("pw-expanded-icon");
element.siblings(".pw-section-details").removeClass("hidden");
}else{if(iconContainer.hasClass("pw-expanded-icon")){iconContainer.removeClass("pw-expanded-icon").addClass("pw-collapsed-icon");
element.siblings(".pw-section-details").addClass("hidden");
}}});
CPEventManager.addObserver("FILTER_RECOMMENDATIONS_BY_ITEM",function(params){var itemOCID=params.ITEM_OCID;
var nodeID=params.CP_NODE_ID;
if(nodeID===that.getNodeId()){CERN_PATHWAYS_SHARED_O1.ResetSuggestionsByItem(that,"ORDER",itemOCID);
}});
CPEventManager.addObserver("CP_NODE_BEHAVIOR_REACTION_PLANS",function(params){var plansToSuggest=[];
if(params.CP_NODE_ID===that.getNodeId()){if(!that.m_planFavoritesLoadedInd){var criterion=that.getCriterion();
var scriptRequest=new ScriptRequest();
scriptRequest.setProgramName("INN_QUERY_CUSTOMIZED_PLANS");
scriptRequest.setParameterArray(["^MINE^",0,criterion.ppr_cd+".0"]);
scriptRequest.setAsyncIndicator(false);
scriptRequest.setResponseHandler(function(response){response=response.getResponse();
that.m_planFavoritesLoadedInd=true;
that.m_planFavorites=response.CUSTOMIZED_PLANS;
plansToSuggest=that.finalizePlansToSuggest(params.PLANS_TO_SUGGEST);
CERN_PATHWAYS_SHARED_O1.HandleNodeActivity(that,"PATHWAY",plansToSuggest);
});
scriptRequest.performRequest();
}else{plansToSuggest=that.finalizePlansToSuggest(params.PLANS_TO_SUGGEST);
CERN_PATHWAYS_SHARED_O1.HandleNodeActivity(that,"PATHWAY",plansToSuggest);
}}});
CPEventManager.addObserver("CP_NODE_BEHAVIOR_REACTION",function(params){if(params.CP_NODE_ID===that.getNodeId()){CERN_PATHWAYS_SHARED_O1.HandleNodeActivity(that,params.TYPE,params.DATA);
}});
CPEventManager.addObserver("DOCUMENT_EVENTS_PROCESSED",function(params){if(that.getSuggestedTreatments().length>0&&params.getNodeId()===that.getNodeId()){var orderContainers=target.find(".pw-suggested-orders, .pw-available-orders");
var x;
for(x=orderContainers.length;
x--;
){orderContainers[x]=$(orderContainers[x]);
orderContainers[x].find(".pw-expanded-icon").parent().click();
}}});
CPEventManager.addObserver("CP_NODE_BEHAVIOR_REACTION_UNDO",function(params){if(params.CP_NODE_ID===that.getNodeId()){CERN_PATHWAYS_SHARED_O1.HandleNodeActivity(that,params.TYPE,params.DATA,true);
}});
CPEventManager.addObserver("MP_SCRATCHPAD_ORDERS_SIGNED",function(eventData){var ordersSigned=eventData.signed_orders;
var selectedOrderElements=target.find(".ordered");
var suggestedOrderElements=target.find(".pw-suggested-orders input.pw-order-button");
var nodeId=that.getNodeId();
var cpComponentId=that.getCpComponentId();
var currentElement;
var currentEntityId;
var currentEntityName;
var currentDetailText;
var x,y;
var actionJSON={CP_NODE_ID:nodeId,CP_COMPONENT_ID:cpComponentId,ACTION_DETAILS:[]};
var v;
var w;
that.clearPathwaysScratchPad();
if(selectedOrderElements.length>0){for(x=0,y=suggestedOrderElements.length;
x<y;
x++){currentElement=$(suggestedOrderElements[x]);
currentEntityName=getOrderEntityName(currentElement.attr("order-type"),currentElement);
currentEntityId=getEntityId(currentEntityName,currentElement);
actionJSON.ACTION_DETAILS.push({PARENT_ENTITY_NAME:currentEntityName,PARENT_ENTITY_ID:parseFloat(currentEntityId),ACTION_DETAIL_TYPE_MEAN:"ORDSUGGEST"});
}for(x=0,y=selectedOrderElements.length;
x<y;
x++){currentElement=$(selectedOrderElements[x]);
currentEntityName=getOrderEntityName(currentElement.attr("order-type"),currentElement);
currentEntityId=parseFloat(getEntityId(currentEntityName,currentElement));
if(currentEntityName==="ORDER_SENTENCE"){currentEntityName="ORDER_CATALOG_SYNONYM";
currentEntityId=currentElement.attr("id");
}actionJSON.ACTION_DETAILS.push({PARENT_ENTITY_NAME:currentEntityName,PARENT_ENTITY_ID:parseFloat(currentEntityId),ACTION_DETAIL_TYPE_MEAN:"ORDSELECT"});
resetOrderButton(currentElement);
}for(v=0,w=ordersSigned.length;
v<w;
v++){currentEntityId=parseFloat(ordersSigned[v].order_id);
currentDetailText=ordersSigned[v].clin_disp;
if(currentEntityId){actionJSON.ACTION_DETAILS.push({PARENT_ENTITY_NAME:"ORDERS",PARENT_ENTITY_ID:parseFloat(currentEntityId),ACTION_DETAIL_TEXT:currentDetailText,ACTION_DETAIL_TYPE_MEAN:"SIGNACT"});
}}}CPEventManager.notifyObservers("COMMIT_NODE_ACTION",actionJSON);
updateSuggestedToggle();
});
CPEventManager.addObserver(EventListener.EVENT_SCRATCHPAD_UPDATES_COMPONENT,function(eventData){var pathwaysScratchPad=that.getPathwaysScratchPad();
var nodeId=that.getNodeId();
var synonymId=parseInt(eventData.favSynId,10);
var sentenceId=parseInt(eventData.favSentId,10);
var orderButton=[];
if(sentenceId>0){orderButton=$("#"+synonymId+".ordered[sentence-id="+sentenceId+"]");
if(orderButton.length===0){orderButton=$("#"+synonymId+".ordered[favorite-id="+sentenceId+"]");
if(orderButton.length===0){orderButton=$("#"+synonymId+".ordered:not([favorite-id])");
}}}else{orderButton=$("#"+synonymId+".ordered");
}if(orderButton.length>0){resetOrderButton(orderButton);
pathwaysScratchPad.removeOrder(synonymId,"",nodeId,sentenceId);
updateSuggestedToggle();
}});
CPEventManager.addObserver("ACTIVITY_INDICATORS_UPDATED",function(){that.updateActivityIndicators();
});
renderTimer.start();
that.finalizeComponent("");
that.updateComponentDisplay();
renderTimer.stop();
};
PathwayRecommendationComponentCPM.prototype.updateComponentDisplay=function(){var that=this;
var target=$(that.getSectionContentNode());
var html="<div class='pw-section-container'><div class='pw-suggested-treatments pw-section'><div class='pw-section-header' manual-state='collapsed'></div><div class='pw-section-details'></div></div><div class='pw-suggested-orders pw-section'><div class='pw-section-header' manual-state='collapsed'></div><div class='pw-section-details'></div></div><div class='pw-available-orders pw-section'><div class='pw-section-header' manual-state='collapsed'></div><div class='pw-section-details'></div></div><div class='pw-deviation-button-container'><span class='pw-deviation-button-wrapper'><input id='btnToggleClinicalTrial' class='pw-button' type='button' /></span><span class='pw-deviation-button-wrapper'><input id='btnToggleOffPathway' class='pw-button' type='button' /></span></div></div>";
target.html(html);
that.updateActivityIndicators();
CERN_PATHWAYS_SHARED_O1.GenerateSectionHtml(this,"SUGGESTED","NODE");
CERN_PATHWAYS_SHARED_O1.GenerateSectionHtml(this,"SUGGESTED","ORDER");
CERN_PATHWAYS_SHARED_O1.GenerateSectionHtml(this,"AVAILABLE","ORDER");
};
PathwayRecommendationComponentCPM.prototype.updateActivityIndicators=function(){var that=this;
var sectionContentNode=$(that.getSectionContentNode());
var clinicalTrialButton=sectionContentNode.find("#btnToggleClinicalTrial");
var offPathwayButton=sectionContentNode.find("#btnToggleOffPathway");
var pwReci18n=i18n.innovations.pathways_recommendation;
var clinicalTrialInd=0;
var offPathwayInd=0;
var activePathway=$.grep(CERN_PATHWAYS_SHARED_O1.GetPathways(),function(pathway){return pathway.PATHWAY_ACTIVITY_STATUS_MEAN==="ACTIVE"&&pathway.CP_PATHWAY_ID===that.getPathwayId();
});
if(activePathway.length>0){activePathway=activePathway[0];
clinicalTrialInd=activePathway.CLINICAL_TRIAL_IND;
offPathwayInd=activePathway.OFF_PATHWAY_IND;
}clinicalTrialButton.val(clinicalTrialInd?pwReci18n.DOC_OFF_CLIN_TRIAL:pwReci18n.DOC_ON_CLIN_TRIAL);
offPathwayButton.val(offPathwayInd?pwReci18n.DOC_ON_PATHWAY:pwReci18n.DOC_OFF_PATHWAY);
};
MP_Util.setObjectDefinitionMapping("PW_RECOMMEND_PARAM",PathwayRecommendationComponentCPM);
