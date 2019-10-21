function TopGoalsSumComponentStyle(){this.initByNamespace("top-goals-sum");
}TopGoalsSumComponentStyle.prototype=new ComponentStyle();
TopGoalsSumComponentStyle.prototype.constructor=ComponentStyle;
function TopGoalsSumComponent(criterion){this.setCriterion(criterion);
this.setStyles(new TopGoalsSumComponentStyle());
this.setComponentLoadTimerName("USR:MPG.TopGoalsSumComponent - load component");
this.setComponentRenderTimerName("ENG:MPG.TopGoalsSumComponent - render component");
this.goalsPriority=0;
}TopGoalsSumComponent.prototype=new MPageComponent();
TopGoalsSumComponent.prototype.constructor=MPageComponent;
TopGoalsSumComponent.prototype.setGoalsPriority=function(value){this.goalsPriority=value;
};
TopGoalsSumComponent.prototype.getGoalsPriority=function(){return this.goalsPriority;
};
TopGoalsSumComponent.prototype.loadFilterMappings=function(){this.addFilterMappingObject("TOP_3_SUM_NUM",{setFunction:this.setGoalsPriority,type:"Number",field:"FREETEXT_DESC"});
};
TopGoalsSumComponent.prototype.retrieveComponentData=function(){var self=this;
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
TopGoalsSumComponent.prototype.renderComponent=function(scriptReply){var component=scriptReply.getComponent();
var goalsPriority=component.getGoalsPriority();
var recordData=scriptReply.getResponse();
var scriptStatus=recordData.STATUS_DATA.STATUS;
var timerRenderComponent=MP_Util.CreateTimer(component.getComponentRenderTimerName(),component.getCriterion().category_mean);
try{switch(scriptStatus){case"S":var unmetOutcomes=recordData.UNMET_OUTCOMES;
var tableHtml="<div class='content-hdr'><dl class='top-goals-sum-outcome-info-hdr hdr'><dd>"+i18n.innov.topgoalssum.TITLE_PRIORITY+"</dd><dd>"+i18n.innov.topgoalssum.TITLE_GOAL+"</dd><dd>"+i18n.innov.topgoalssum.TITLE_STATUS+"</dd></dl></div><div class='content-body'>";
var startDtTm=null;
var unmetOutcome=null;
var barrierArr=[];
var category=[];
var type=[];
var rowHtml="";
var priority=0;
var i=0,il=0,j=0,jl=0;
unmetOutcomes.sort(function(a,b){return a.PRIORITY-b.PRIORITY;
});
for(i=0,il=unmetOutcomes.length;
i<il;
i++){unmetOutcome=unmetOutcomes[i];
priority=unmetOutcome.PRIORITY;
rowHtml="";
if(goalsPriority===0||(priority>=1&&priority<=goalsPriority)){type.length=0;
category.length=0;
barrierArr.length=0;
for(j=0,jl=unmetOutcome.TYPE.length;
j<jl;
j++){type.push(unmetOutcome.TYPE[j].DISPLAY);
}for(j=0,jl=unmetOutcome.CATEGORY.length;
j<jl;
j++){category.push(unmetOutcome.CATEGORY[j].DISPLAY);
}for(j=0,jl=unmetOutcome.BARRIER.length;
j<jl;
j++){barrierArr.push(unmetOutcome.BARRIER[j].DISPLAY);
}startDtTm=new Date();
startDtTm.setISO8601(unmetOutcome.STARTDTTM);
rowHtml+="<dl class='top-goals-sum-outcome-info result-info'><dd>"+priority+"</dd><dd>"+unmetOutcome.SAVED_DESCRIPTION+"</dd><dd>"+unmetOutcome.GOAL_STATUS.CURRENT_STATUS_DISPLAY+"</dd></dl>";
rowHtml+="<div class='hover result-details'><dl>";
rowHtml+="<dt><span>"+i18n.innov.topgoalssum.TITLE_CREATOR+": "+unmetOutcome.CREATOR+"</span>";
rowHtml+="<dt><span>"+i18n.innov.topgoalssum.TITLE_TYPE+": "+type.join("; ")+"</span></dt>";
rowHtml+="<dt><span>"+i18n.innov.topgoalssum.TITLE_CATEGORY+": "+category.join("; ")+"</span></dt>";
rowHtml+="<dt><span>"+i18n.innov.topgoalssum.TITLE_START_DATE+": "+unmetOutcome.STARTDTTM+"</span>";
rowHtml+="<dt><span>"+i18n.innov.topgoalssum.TITLE_END_DATE+": "+unmetOutcome.ENDDTTM+"</span>";
rowHtml+="<dt><span>"+i18n.innov.topgoalssum.TITLE_BARRIERS+": "+barrierArr.join("; ")+"</span></dt>";
rowHtml+="<dt><span>"+i18n.innov.topgoalssum.TITLE_COMMENT+": "+unmetOutcome.COMMENT+"</span></dt>";
rowHtml+="<dt><span>"+i18n.innov.topgoalssum.TITLE_INTERVENTION+":</span>";
for(j=0,jl=unmetOutcome.INTERVENTIONS.length;
j<jl;
j++){rowHtml+="<dt><span>"+(j+1)+". "+unmetOutcome.INTERVENTIONS[j].SAVED_DESCRIPTION+" (";
if(unmetOutcome.INTERVENTIONS[j].FLAG){rowHtml+=i18n.innov.topgoalssum.FLAG_MET;
}else{rowHtml+=i18n.innov.topgoalssum.FLAG_NOTMET;
}rowHtml+=")</span></dt>";
}rowHtml+="</dt>";
rowHtml+="<dt><span>"+i18n.innov.topgoalssum.LASTUPDATE+": "+unmetOutcome.LAST_MODIFIED_USER+(unmetOutcome.LAST_MODIFICATION_DATE_DISPLAY?("&nbsp;("+unmetOutcome.LAST_MODIFICATION_DATE_DISPLAY+")"):"")+"</span></dt>";
rowHtml+="</dl></div>";
tableHtml+=rowHtml;
}}tableHtml+="</div>";
break;
case"Z":tableHtml=i18n.innov.topgoalssum.NODATA;
break;
case"F":tableHtml=i18n.innov.topgoalssum.ERROR;
break;
}component.finalizeComponent(tableHtml,"");
}catch(err){if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw err;
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}};
MP_Util.setObjectDefinitionMapping("TOP_3_PARAMS_SUM",TopGoalsSumComponent);