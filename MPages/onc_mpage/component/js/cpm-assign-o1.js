function CPMAssignO1ComponentStyle(){this.initByNamespace("cpmao1");
}CPMAssignO1ComponentStyle.prototype=new ComponentStyle();
CPMAssignO1ComponentStyle.prototype.constructor=ComponentStyle;
function CPMAssignO1Component(criterion){this.setCriterion(criterion);
this.setStyles(new CPMAssignO1ComponentStyle());
this.setComponentLoadTimerName("USR:MPG.CPM.Assign.O1_load_component");
this.setComponentRenderTimerName("ENG:MPG.CPM.Assign.O1_render_component");
this.setScope(2);
this.m_cpmResourceManager=null;
this.m_unassignedList=null;
}CPMAssignO1Component.prototype=new MPageComponent();
CPMAssignO1Component.prototype.constructor=MPageComponent;
CPMAssignO1Component.prototype.getCPMResourceManager=function(){return this.m_cpmResourceManager;
};
CPMAssignO1Component.prototype.getUnassignedCPMsList=function(){if(!this.m_unassignedList){this.m_unassignedList=[];
}return this.m_unassignedList;
};
CPMAssignO1Component.prototype.setCPMResourceManager=function(resourceManager){if(resourceManager!==null&&!CPMResourceManager.prototype.isPrototypeOf(resourceManager)){throw new Error("Type Error: resourceManager passed into CPMAssignO1Component method setCPMResourceManager not an instance of CPMResourceManager or null");
}this.m_cpmResourceManager=resourceManager;
};
CPMAssignO1Component.prototype.setUnassignedCPMsList=function(list){if(list!==null&&!Array.prototype.isPrototypeOf(list)){throw new Error("Type Error: list passed into CPMAssignO1Component method setUnassignedCPMsList not an array or null");
}this.m_unassignedList=list;
};
CPMAssignO1Component.prototype.processCPMResponse=function(cpmResponse){if(!cpmResponse||typeof cpmResponse!=="object"){throw new Error("Type Error: cpmResponse passed into CPMAssignO1Component method processCPMResponse is undefined or not an object");
}var cpmResourceManager=this.getCPMResourceManager();
if(!cpmResourceManager){cpmResourceManager=new CPMResourceManager();
this.setCPMResourceManager(cpmResourceManager);
}cpmResourceManager.removeAllCPMResources();
var conceptList=cpmResponse.ACTIVITY_QUAL||[];
var cLen=conceptList.length;
var i;
for(i=0;
i<cLen;
i++){var cpmResource=CPMResourceManager.createCPMResource(conceptList[i]);
cpmResourceManager.addCPMResource(cpmResource);
}};
CPMAssignO1Component.prototype.handleGetCPMReply=function(scriptReply){var status;
if(!scriptReply){status="F";
}else{status=scriptReply.getStatus();
}if(status==="Z"){this.finalizeComponent(this.generateNoDataFoundHTML(),"");
}else{if(status==="S"){this.processCPMResponse(scriptReply.getResponse());
this.renderComponent();
}else{this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(),"Component Data Retrieval Failed"),"");
}}};
CPMAssignO1Component.prototype.retrieveComponentData=function(){var criterion=this.getCriterion();
var sendAr=[];
var request;
var loadTimer=new RTMSTimer(this.getComponentLoadTimerName(),criterion.category_mean);
var renderTimer=new RTMSTimer(this.getComponentRenderTimerName(),criterion.category_mean);
sendAr.push("^MINE^",criterion.person_id+".0",criterion.encntr_id+".0",criterion.provider_id+".0",criterion.ppr_cd+".0");
request=new ComponentScriptRequest();
request.setProgramName("MP_GET_CPM_PATHWAY_STATUS");
request.setParameterArray(sendAr);
request.setAsyncIndicator(true);
request.setName("getCPMByPatient");
request.setComponent(this);
request.setResponseHandler(this.handleGetCPMReply.bind(this));
request.setLoadTimer(loadTimer);
request.setRenderTimer(renderTimer);
request.performRequest();
};
CPMAssignO1Component.prototype.callAddPathwayScript=function(cpmResourceStatus,pathwayInstanceId,requestName,cpmResource){var criterion=this.getCriterion();
var request;
var sendAr=[];
sendAr.push("^MINE^",criterion.person_id+".0",criterion.encntr_id+".0",criterion.provider_id+".0",cpmResource.getPathwayId()+".0","^"+cpmResourceStatus+"^",pathwayInstanceId);
request=new ScriptRequest();
request.setProgramName("cp_add_pathway_activity");
request.setParameterArray(sendAr);
request.setAsyncIndicator(true);
request.setName(requestName);
request.setResponseHandler(this.retrieveComponentData.bind(this));
request.performRequest();
this.loadSpinner(this.getSectionContentNode().id);
};
CPMAssignO1Component.prototype.assignCPM=function(cpmResource){this.callAddPathwayScript(CPMResource.STATUSES.PROPOSED,0,"assignCPM",cpmResource);
};
CPMAssignO1Component.prototype.removeCPM=function(cpmResource){this.callAddPathwayScript(CPMResource.STATUSES.INACTIVE,cpmResource.getPathwayInstanceId(),"removeCPM",cpmResource);
};
CPMAssignO1Component.prototype.loadSpinner=function(containerId){if(containerId&&typeof containerId==="string"){var resultContainer=$("#"+containerId);
var contentHeight=resultContainer.outerHeight();
var offset=resultContainer.offsetParent();
var loadingIconTop=offset.height()-contentHeight;
resultContainer.append("<div class='loading-screen' style='height: "+contentHeight+"px; top: "+loadingIconTop+"px; left:0px; '><div class='loading-spinner'>&nbsp;</div></div>");
}};
CPMAssignO1Component.prototype.buildNoListItemsHtml=function(){var html="";
html+="<li class='cpmao1-no-results'>"+i18n.discernabu.NO_RESULTS_FOUND+"</li>";
return html;
};
CPMAssignO1Component.prototype.buildCPMListItemHtml=function(cpmResource){if(!CPMResource.prototype.isPrototypeOf(cpmResource)){throw new Error("Type Error: cpmResource passed into CPMAssignO1Component method buildCPMListItemHtml not instance of CPMResource");
}var cpmResourceId=cpmResource.getId();
var html="";
var cpmIsActive=cpmResource.getStatusMean()===CPMResource.STATUSES.PROPOSED;
html+="<li id='"+this.getStyles().getId()+cpmResourceId+"' class='cpmao1-list-item' data-resource-id='"+cpmResourceId+"' >";
html+="<span class='cpmao1-cpm-item-disp'>"+cpmResource.getConceptDisp()+"</span>";
if(cpmIsActive){html+="<a class='cpmao1-remove-link' data-resource-id='"+cpmResourceId+"'></a>";
}else{html+="<a class='cpmao1-add-link' data-resource-id='"+cpmResourceId+"'>"+i18n.discernabu.cpm_assign_o1.ADD+"</a>";
}html+="</li>";
return html;
};
CPMAssignO1Component.prototype.buildAssignedCPMsHtml=function(cpmResourceList){if(!Array.prototype.isPrototypeOf(cpmResourceList)){throw new Error("Type Error: cpmResourceList passed into CPMAssignO1Component method buildAssignedCPMsHtml not an array");
}var compId=this.getStyles().getId();
var myi18n=i18n.discernabu.cpm_assign_o1;
var cLen=cpmResourceList.length;
var i;
var html="";
html+="<div id='"+compId+"AssignedCPMsContainer' class='cpmao1-list-cont' >";
html+="<div class='cpmao1-sec-hdr'>"+myi18n.PROPOSED_CPMS+"</div>";
html+="<ul id='"+compId+"AssignedCPMsList' class='cpmao1-list'>";
for(i=0;
i<cLen;
i++){html+=this.buildCPMListItemHtml(cpmResourceList[i]);
}if(!cLen){html+="<li class='cpmao1-no-results'>"+myi18n.ADD_PROPOSED+"</li>";
}html+="</ul>";
html+="</div>";
return html;
};
CPMAssignO1Component.prototype.buildSearchHtml=function(){var html="";
html+="<div class='cpmao1-search-cont'>";
html+="<div class='cpmao1-row'>";
html+="<span class='cpmao1-search-box-cont'>";
html+="<input class='cpmao1-search-box search-box cpmao1-default' type='text' value='"+i18n.discernabu.cpm_assign_o1.SEARCH_CPMS+"' />";
html+="</span>";
html+="</div>";
html+="</div>";
return html;
};
CPMAssignO1Component.prototype.buildUnassignedCPMsHtml=function(cpmResourceList){if(!Array.prototype.isPrototypeOf(cpmResourceList)){throw new Error("Type Error: cpmResourceList passed into CPMAssignO1Component method buildUnassignedCPMsHtml not an array");
}var compId=this.getStyles().getId();
var myi18n=i18n.discernabu.cpm_assign_o1;
var cLen=cpmResourceList.length;
var i;
var html="";
html+="<div id='"+compId+"UnassignedCPMsContainer' class='cpmao1-list-cont' >";
html+=this.buildSearchHtml();
html+="<div class='cpmao1-sec-hdr'>";
html+=myi18n.AVAILABLE_CPMS;
html+="</div>";
html+="<ul id='"+compId+"UnassignedCPMsList' class='cpmao1-list cpmao1-unassigned-list'>";
for(i=0;
i<cLen;
i++){html+=this.buildCPMListItemHtml(cpmResourceList[i]);
}if(!cLen){html+=this.buildNoListItemsHtml();
}html+="</ul>";
html+="</div>";
return html;
};
CPMAssignO1Component.prototype.unassignedItemClick=function(event){var compId=this.getStyles().getId();
var currentItemWasSelected=false;
var jqUnassignedList=$("#"+compId+"UnassignedCPMsContainer");
var jqSelectedItems=jqUnassignedList.find("li.selected");
var domElement=event.currentTarget||event.srcElement;
var clickedItemId=domElement.id;
var sLen=jqSelectedItems.length;
var i;
for(i=0;
i<sLen;
i++){var selectedId=jqSelectedItems.get(i).id;
if(selectedId!==clickedItemId){$(jqSelectedItems.get(i)).removeClass("selected");
}else{currentItemWasSelected=true;
}}$(domElement).toggleClass("selected");
$("#"+compId+"UnassignedAddBtn").prop("disabled",currentItemWasSelected);
};
CPMAssignO1Component.prototype.availableAddClick=function(event){var domElement=event.currentTarget||event.srcElement;
var cpmResourceId=$(domElement).attr("data-resource-id");
var cpmResourceManager=this.getCPMResourceManager();
if(!cpmResourceManager){return;
}var cpmResource=cpmResourceManager.getCPMResourceById(cpmResourceId);
if(!cpmResource){logger.logError("CPMAssignO1Component method availableAddClick unable to retrieve cpmResource using id: "+cpmResourceId);
return;
}this.assignCPM(cpmResource);
};
CPMAssignO1Component.prototype.proposedRemoveClick=function(event){var domElement=event.currentTarget||event.srcElement;
var cpmResourceId=$(domElement).attr("data-resource-id");
var cpmResourceManager=this.getCPMResourceManager();
if(!cpmResourceManager){return;
}var cpmResource=cpmResourceManager.getCPMResourceById(cpmResourceId);
if(!cpmResource){logger.logError("CPMAssignO1Component method proposedRemoveClick unable to retrieve cpmResource using id: "+cpmResourceId);
return;
}this.removeCPM(cpmResource);
};
CPMAssignO1Component.prototype.unassignedSearchKeyup=function(event){var compId=this.getStyles().getId();
var domElement=event.currentTarget||event.srcElement;
var searchValue=$.trim($(domElement).val()).toLowerCase();
var unassignedCPMs=this.getUnassignedCPMsList();
var uLen=unassignedCPMs.length;
var i;
var html="";
for(i=0;
i<uLen;
i++){var cpmResource=unassignedCPMs[i];
var cpmTerm=cpmResource.getConceptDisp().toLowerCase();
if(!searchValue){html+=this.buildCPMListItemHtml(cpmResource);
}else{if(cpmTerm.indexOf(searchValue)>=0){html+=this.buildCPMListItemHtml(cpmResource);
}}}if(!html){html+=this.buildNoListItemsHtml();
}$("#"+compId+"UnassignedCPMsList").html(html);
$("#"+compId+"UnassignedAddBtn").prop("disabled",true);
};
CPMAssignO1Component.prototype.unassignedSearchFocus=function(event){var domElement=event.currentTarget||event.srcElement;
var jqSearchBox=$(domElement);
if(jqSearchBox.hasClass("cpmao1-default")){jqSearchBox.val("");
jqSearchBox.removeClass("cpmao1-default");
}};
CPMAssignO1Component.prototype.unassignedSearchBlur=function(event){var domElement=event.currentTarget||event.srcElement;
var jqSearchBox=$(domElement);
var searchValue=$.trim(jqSearchBox.val());
if(!searchValue){jqSearchBox.addClass("cpmao1-default");
jqSearchBox.val(i18n.discernabu.cpm_assign_o1.SEARCH_CPMS);
}};
CPMAssignO1Component.prototype.attachEventDelegates=function(){var compId=this.getStyles().getId();
var jqUnassignedList=$("#"+compId+"UnassignedCPMsContainer");
var jqAssignedList=$("#"+compId+"AssignedCPMsContainer");
jqUnassignedList.on("click","a.cpmao1-add-link",this.availableAddClick.bind(this));
jqUnassignedList.on("keyup","input.cpmao1-search-box",this.unassignedSearchKeyup.bind(this));
jqUnassignedList.on("focus","input.cpmao1-search-box",this.unassignedSearchFocus.bind(this));
jqUnassignedList.on("blur","input.cpmao1-search-box",this.unassignedSearchBlur.bind(this));
jqAssignedList.on("click","a.cpmao1-remove-link",this.proposedRemoveClick.bind(this));
};
CPMAssignO1Component.prototype.sortByDispFunc=function(a,b){var aDisp=a.getConceptDisp();
var bDisp=b.getConceptDisp();
if(aDisp<bDisp){return -1;
}else{if(aDisp>bDisp){return 1;
}else{return 0;
}}};
CPMAssignO1Component.prototype.renderComponent=function(){var cpmResourceManager=this.getCPMResourceManager();
var CPM_STATUSES=CPMResource.STATUSES;
var html="";
var assignedCPMsList=cpmResourceManager.getCPMResourceListWithStatus(CPM_STATUSES.PROPOSED);
var unassignedCPMsList=cpmResourceManager.getCPMResourceListWithoutStatus(CPM_STATUSES.PROPOSED);
assignedCPMsList.sort(this.sortByDispFunc);
unassignedCPMsList.sort(this.sortByDispFunc);
this.setUnassignedCPMsList(unassignedCPMsList);
html+=this.buildUnassignedCPMsHtml(unassignedCPMsList);
html+=this.buildAssignedCPMsHtml(assignedCPMsList);
this.finalizeComponent(html,"");
this.attachEventDelegates();
};
MP_Util.setObjectDefinitionMapping("CPM_ASSIGN_COMP",CPMAssignO1Component);
