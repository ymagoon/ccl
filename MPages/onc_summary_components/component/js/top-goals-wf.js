function TopGoalsWfComponentStyle(){this.initByNamespace("top-goals-wf");
}TopGoalsWfComponentStyle.prototype=new ComponentStyle();
TopGoalsWfComponentStyle.prototype.constructor=ComponentStyle;
function TopGoalsWfComponent(criterion){this.setCriterion(criterion);
this.setStyles(new TopGoalsWfComponentStyle());
this.setComponentLoadTimerName("USR:MPG.TopGoalsWfComponent - load component");
this.setComponentRenderTimerName("ENG:MPG.TopGoalsWfComponent - render component");
this.goalsPriority=0;
}TopGoalsWfComponent.prototype=new MPageComponent();
TopGoalsWfComponent.prototype.constructor=MPageComponent;
TopGoalsWfComponent.prototype.setGoalsPriority=function(value){this.goalsPriority=value;
};
TopGoalsWfComponent.prototype.getGoalsPriority=function(){return this.goalsPriority;
};
TopGoalsWfComponent.prototype.loadFilterMappings=function(){this.addFilterMappingObject("TOP_3_WF_NUM",{setFunction:this.setGoalsPriority,type:"Number",field:"FREETEXT_DESC"});
};
TopGoalsWfComponent.prototype.retrieveComponentData=function(){var self=this;
var criterion=self.getCriterion();
var prsnlInfo=criterion.getPersonnelInfo();
var encntrs=prsnlInfo.getViewableEncounters();
var encntrVal=encntrs?"value("+encntrs+")":"0.0";
var goalsPriority=self.getGoalsPriority();
var scriptRequest;
var sendAr=["^MINE^,"+criterion.person_id.toFixed(1)+","+encntrVal+",0,0,0,0,"+goalsPriority];
if(typeof ComponentScriptRequest!=="undefined"){scriptRequest=new ComponentScriptRequest();
scriptRequest.setProgramName("inn_mp_gwf_get_goals");
scriptRequest.setParameterArray(sendAr);
scriptRequest.setAsyncIndicator(true);
scriptRequest.setComponent(self);
scriptRequest.setResponseHandler(self.renderComponent);
var loadTimer=new RTMSTimer(self.getComponentLoadTimerName());
scriptRequest.setLoadTimer(loadTimer);
scriptRequest.performRequest();
}else{scriptRequest=new MP_Core.ScriptRequest(self,self.getComponentLoadTimerName());
scriptRequest.setProgramName("inn_mp_gwf_get_goals");
scriptRequest.setParameters(sendAr);
scriptRequest.setAsync(true);
MP_Core.XMLCCLRequestCallBack(self,scriptRequest,self.renderComponent);
}};
TopGoalsWfComponent.prototype.renderComponent=function(scriptReply){var component=scriptReply.getComponent();
var compId=component.getComponentId();
var goalsPriority=component.getGoalsPriority();
var recordData=scriptReply.getResponse();
var scriptStatus=recordData.STATUS_DATA.STATUS;
var timerRenderComponent=MP_Util.CreateTimer(component.getComponentRenderTimerName(),component.getCriterion().category_mean);
try{switch(scriptStatus){case"S":var barrierArr=[];
var category=[];
var sidePanelArr=[];
var type=[];
var unmetOutcome=null;
var unmetOutcomes=recordData.UNMET_OUTCOMES;
unmetOutcomes.sort(function(a,b){return a.PRIORITY-b.PRIORITY;
});
var curData=[];
if(goalsPriority===0){curData=unmetOutcomes;
}else{var goalsIdx=0;
for(var i=0,il=unmetOutcomes.length;
i<il;
i++){unmetOutcome=unmetOutcomes[i];
if(unmetOutcome.PRIORITY<=goalsPriority){goalsIdx=i+1;
type.length=0;
category.length=0;
barrierArr.length=0;
var j;
var jl;
for(j=0,jl=unmetOutcome.TYPE.length;
j<jl;
j++){type.push(unmetOutcome.TYPE[j].DISPLAY);
}for(j=0,jl=unmetOutcome.CATEGORY.length;
j<jl;
j++){category.push(unmetOutcome.CATEGORY[j].DISPLAY);
}for(j=0,jl=unmetOutcome.BARRIER.length;
j<jl;
j++){barrierArr.push(unmetOutcome.BARRIER[j].DISPLAY);
}var startDtTm=new Date();
startDtTm.setISO8601(unmetOutcome.STARTDTTM);
var contentHTML="<div id='sidePanelScrollContainer"+compId+"' class='top-goals-wf-bottom-half'><div class='top-goals-wf-sp-label'>"+i18n.innov.topgoalswf.TITLE_CREATOR+"</div><div class='top-goals-wf-sp-label'>"+i18n.innov.topgoalswf.TITLE_TYPE+"</div><div class='top-goals-wf-sp-text'>"+unmetOutcome.CREATOR+"</div><div class='top-goals-wf-sp-text'>"+type.join("; ")+"</div><div class='top-goals-wf-sp-label'>"+i18n.innov.topgoalswf.TITLE_CATEGORY+"</div><div class='top-goals-wf-sp-label'>"+i18n.innov.topgoalswf.TITLE_BARRIERS+"</div><div class='top-goals-wf-sp-text'>"+category.join("; ")+"</div><div class='top-goals-wf-sp-text'>"+barrierArr.join("; ")+"</div>";
for(j=0,jl=unmetOutcome.INTERVENTIONS.length;
j<jl;
j++){contentHTML+="<div class='top-goals-wf-sp-int-label'>"+i18n.innov.topgoalswf.TITLE_INTERVENTION.replace("{x}",(j+1))+"</div><div class='top-goals-wf-sp-int-text'>"+unmetOutcome.INTERVENTIONS[j].SAVED_DESCRIPTION+"</div>";
}contentHTML+="</div>";
sidePanelArr.push({html:contentHTML,title:unmetOutcome.SAVED_DESCRIPTION,subtitle:i18n.innov.topgoalswf.TITLE_LAST_MODIFIED+": "+unmetOutcome.LAST_MODIFIED_USER+(unmetOutcome.LAST_MODIFICATION_DATE_DISPLAY?(" ("+unmetOutcome.LAST_MODIFICATION_DATE_DISPLAY+")"):"")});
}else{goalsIdx=i;
break;
}}curData=unmetOutcomes.slice(0,goalsIdx);
}var curTable=new ComponentTable();
curTable.setNamespace(component.getStyles().getId());
var priorityColumn=new TableColumn();
priorityColumn.setColumnId("PRIORITY");
priorityColumn.setColumnDisplay(i18n.innov.topgoalswf.TITLE_PRIORITY);
priorityColumn.setCustomClass("top-goals-wf-priority-col");
priorityColumn.setIsSortable(false);
priorityColumn.setRenderTemplate("${ PRIORITY } ");
var goalColumn=new TableColumn();
goalColumn.setColumnId("GOAL");
goalColumn.setColumnDisplay(i18n.innov.topgoalswf.TITLE_GOAL);
goalColumn.setCustomClass("top-goals-wf-name-col");
goalColumn.setIsSortable(false);
goalColumn.setRenderTemplate("${ SAVED_DESCRIPTION } ");
var statusColumn=new TableColumn();
statusColumn.setColumnId("STATUS");
statusColumn.setColumnDisplay(i18n.innov.topgoalswf.TITLE_STATUS);
statusColumn.setCustomClass("top-goals-wf-col");
statusColumn.setIsSortable(false);
statusColumn.setRenderTemplate("${ GOAL_STATUS.CURRENT_STATUS_DISPLAY }");
var startDtColumn=new TableColumn();
startDtColumn.setColumnId("STARTDT");
startDtColumn.setColumnDisplay(i18n.innov.topgoalswf.TITLE_START_DATE);
startDtColumn.setCustomClass("top-goals-wf-col");
startDtColumn.setIsSortable(false);
startDtColumn.setRenderTemplate("${ STARTDTTM }");
var endDtColumn=new TableColumn();
endDtColumn.setColumnId("ENDDT");
endDtColumn.setColumnDisplay(i18n.innov.topgoalswf.TITLE_END_DATE);
endDtColumn.setCustomClass("top-goals-wf-col");
endDtColumn.setIsSortable(false);
endDtColumn.setRenderTemplate("${ ENDDTTM }");
curTable.addColumn(priorityColumn);
curTable.addColumn(goalColumn);
curTable.addColumn(statusColumn);
curTable.addColumn(startDtColumn);
curTable.addColumn(endDtColumn);
curTable.bindData(curData);
component.setComponentTable(curTable);
var tableHtml="<div id='goalsTableContainer"+compId+"'>"+curTable.render()+"</div></div></div><div id='actSidePanelContainer"+compId+"' class='top-goals-wf-act-side-panel'>&nbsp;</div>";
break;
case"Z":tableHtml=i18n.innov.topgoalswf.NODATA;
break;
case"F":tableHtml=i18n.innov.topgoalswf.ERROR;
break;
}component.finalizeComponent(tableHtml,"");
component.m_sidePanelContainer=$("#actSidePanelContainer"+compId);
if(component.m_sidePanelContainer.length){try{var self=component;
var tableContainer=_g("goalsTableContainer"+compId);
var tableBody=_g("top-goals-wf"+compId+"tableBody");
var rows=_gbt("DL",tableBody);
var selectedRows=null;
var row=null;
component.sidePanel=new CompSidePanel(compId,"actSidePanelContainer"+compId);
component.sidePanel.setExpandOption(component.sidePanel.expandOption.EXPAND_DOWN);
component.sidePanel.setFullPanelScrollOn(true);
component.sidePanel.renderPreBuiltSidePanel();
component.sidePanel.showCornerCloseButton();
component.sidePanel.setCornerCloseFunction(function(){self.m_showPanel=false;
self.m_sidePanelContainer.hide();
Util.Style.rcss(tableContainer,"top-goals-wf-left-side");
selectedRows=Util.Style.g("top-goals-wf-selected",tableContainer,"DL");
for(i=selectedRows.length;
i--;
){row=selectedRows[i];
Util.Style.rcss(row,"top-goals-wf-selected");
}});
self.m_showPanel=false;
self.m_sidePanelContainer.hide();
var curRow=null;
var rowClick=function(){selectedRows=Util.Style.g("top-goals-wf-selected",tableContainer,"DL");
for(j=selectedRows.length;
j--;
){curRow=selectedRows[j];
Util.Style.rcss(curRow,"top-goals-wf-selected");
}Util.Style.acss(tableContainer,"top-goals-wf-left-side");
Util.Style.acss(this,"top-goals-wf-selected");
self.sidePanel.setContents(sidePanelArr[this.num].html,"top-goals-wfContent"+compId);
self.sidePanel.setTitleText(sidePanelArr[this.num].title);
self.sidePanel.setSubtitleText(sidePanelArr[this.num].subtitle);
self.m_sidePanelContainer.css("display","inline-block");
self.m_showPanel=true;
self.sidePanel.showPanel();
self.sidePanel.setHeight($("#goalsTableContainer"+compId).css("height"));
self.sidePanel.resizePanel();
};
for(i=rows.length;
i--;
){row=rows[i];
row.num=i;
row.onclick=rowClick;
}}catch(e){alert(e.message+" caused in creating sidePanel");
}}}catch(err){if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}};
MP_Util.setObjectDefinitionMapping("TOP_3_PARAMS_WF",TopGoalsWfComponent);
