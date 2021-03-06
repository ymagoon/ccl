function QualityMeasuresComponentStyle(){this.initByNamespace("qm");
}QualityMeasuresComponentStyle.inherits(ComponentStyle);
function QualityMeasuresComponent(criterion){this.m_planStatusCodes;
this.setCriterion(criterion);
this.setStyles(new QualityMeasuresComponentStyle());
this.setComponentLoadTimerName("USR:MPG.QUALITYMEASURES.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.QUALITYMEASURES.O1 - render component");
this.setIncludeLineNumber(true);
this.setScope(2);
QualityMeasuresComponent.method("InsertData",function(){CERN_QUALITY_MEASURES_O1.GetQualityMeasuresTable(this,0);
});
QualityMeasuresComponent.method("HandleSuccess",function(recordData){CERN_QUALITY_MEASURES_O1.RenderComponent(this,recordData);
});
QualityMeasuresComponent.method("setPlanStatusCodes",function(value){this.m_planStatusCodes=value;
});
QualityMeasuresComponent.method("addPlanStatusCode",function(value){if(!this.m_planStatusCodes){this.m_planStatusCodes=[];
}this.m_planStatusCodes.push(value);
});
QualityMeasuresComponent.method("getPlanStatusCodes",function(){return this.m_planStatusCodes;
});
QualityMeasuresComponent.method("openTab",function(){var criterion=this.getCriterion();
var params=[criterion.person_id,".0|",criterion.encntr_id,".0|"];
params.push("{ORDER|0|0|0|0|0}");
params.push("|0|{2|127}|8");
MP_Util.LogMpagesEventInfo(this,"ORDERS",params.join(""),"qualitymeasures.js","openTab");
MPAGES_EVENT("ORDERS",params.join(""));
this.InsertData();
});
}QualityMeasuresComponent.inherits(MPageComponent);
var CERN_QUALITY_MEASURES_O1=function(){var qmComponent=null;
return{GetQualityMeasuresTable:function(component,selectedCondition){var criterion=component.getCriterion();
var sendAr=[];
var status_cds=MP_Util.CreateParamArray(component.getPlanStatusCodes(),1);
sendAr.push("^MINE^",criterion.person_id+".0",criterion.encntr_id+".0",criterion.provider_id+".0",criterion.position_cd+".0",criterion.ppr_cd+".0");
sendAr.push(status_cds,component.getScope(),component.getLookbackUnits(),component.getLookbackUnitTypeFlag(),selectedCondition);
MP_Core.XMLCclRequestWrapper(component,"mp_get_quality_measures",sendAr,true);
},RenderComponent:function(component,recordData){try{qmComponent=component;
var compId=component.getStyles().getId();
var sHTML="",countText="";
var ar=[];
var criterion=component.getCriterion();
var loc=component.getCriterion().static_content;
var totalOutcomes=recordData.OUTCOMES_COMPLETE.length+recordData.OUTCOMES_INCOMPLETE.length;
ar.push("<div class='",MP_Util.GetContentClass(component,totalOutcomes+1),"'>");
ar.push("<div class='qm-cbo'><form><span class='qm-cond-lbl'>"+i18n.QM_CONDITION+"</span><select id='qmTask",compId,"' onchange='CERN_QUALITY_MEASURES_O1.LoadCondition(this.form.qmTask",compId,',"',compId,"\")'>");
for(var i=0;
i<recordData.CONDITIONS.length;
i++){if(recordData.CONDITIONS[i].CONDITION_ID==recordData.SELECTED_CONDITION_ID){ar.push("<option value="+recordData.CONDITIONS[i].CONDITION_ID+" selected='selected'>"+recordData.CONDITIONS[i].CONDITION_NAME+"</option>");
}else{ar.push("<option value="+recordData.CONDITIONS[i].CONDITION_ID+">"+recordData.CONDITIONS[i].CONDITION_NAME+"</option>");
}}ar.push("</select></form></div>");
ar.push("<div id='condID",compId,"'>");
ar.push("<div class='sub-sec'>");
ar.push("<h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title=",i18n.HIDE_SECTION,">-</span><span class='sub-sec-title'>",i18n.QM_INCOMPLETE," (",recordData.OUTCOMES_INCOMPLETE.length,")</span></h3>");
ar.push("<div class='sub-sec-content'>");
if(recordData.OUTCOMES_INCOMPLETE.length>0){for(var j=0;
j<recordData.OUTCOMES_INCOMPLETE.length;
j++){ar.push("<dl class='qm-info' onmouseover='CERN_QUALITY_MEASURES_O1.ShowIcon(this)' onmouseout='CERN_QUALITY_MEASURES_O1.HideIcon(this)'>");
ar.push("<dt><span>measure</span></dt><dd class='qm-ic-name'><span>"+recordData.OUTCOMES_INCOMPLETE[j].OUTCOME_NAME+"</span></dd>");
ar.push("<dt><span>measure</span></dt><dd class='qm-doc'><span class='cmp-doc' onclick='CERN_QUALITY_MEASURES_O1.OpenQMDoc("+recordData.OUTCOMES_INCOMPLETE[j].FORM_REF_ID+","+recordData.OUTCOMES_INCOMPLETE[j].FORM_ACT_ID+")'>&nbsp;</span></dd>");
ar.push("</dl>");
}}else{ar.push("<span class='res-none'>",i18n.NO_RESULTS_FOUND,"</span>");
}ar.push("</div>");
ar.push("</div>");
ar.push("<div class='sub-sec'>");
ar.push("<h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title="+i18n.HIDE_SECTION+">-</span><span class='sub-sec-title'>"+i18n.QM_COMPLETE+" (",recordData.OUTCOMES_COMPLETE.length,")</span></h3>");
ar.push("<div class='sub-sec-content'>");
ar.push("<dl class='qm-info'>");
if(recordData.OUTCOMES_COMPLETE.length>0){for(var k=0;
k<recordData.OUTCOMES_COMPLETE.length;
k++){var icon="";
if(recordData.OUTCOMES_COMPLETE[k].LAST_MET_IND===0){icon=loc+"\\images\\6376_16.png";
}else{if(recordData.OUTCOMES_COMPLETE[k].LAST_MET_IND===1){icon=loc+"\\images\\4022_16.png";
}}ar.push("<dl class='qm-info' onmouseover='CERN_QUALITY_MEASURES_O1.ShowIcon(this)' onmouseout='CERN_QUALITY_MEASURES_O1.HideIcon(this)'>");
ar.push("<dt>icon</dt><dd class='qm-cmp-icon'><img src='"+icon+"' /></dd>");
ar.push("<dt><span>measure</span></dt><dd class='qm-cmp-name'><span>"+recordData.OUTCOMES_COMPLETE[k].OUTCOME_NAME+"</span></dd>");
ar.push("<dt><span>measure</span></dt><dd class='qm-doc'><span class='cmp-doc' onclick='CERN_QUALITY_MEASURES_O1.OpenQMDoc("+recordData.OUTCOMES_COMPLETE[k].FORM_REF_ID+","+recordData.OUTCOMES_COMPLETE[k].FORM_ACT_ID+")'>&nbsp;</span></dd>");
ar.push("</dl>");
}}else{if(recordData.OUTCOMES_COMPLETE.length===0){ar.push("<span class='res-none'>",i18n.NO_RESULTS_FOUND,"</span>");
}}ar.push("</div></div></div></div>");
sHTML=ar.join("");
countText="("+totalOutcomes+")";
var compNS=component.getStyles().getNameSpace();
MP_Util.Doc.FinalizeComponent(sHTML,component,countText);
}catch(err){throw (err);
}finally{}},LoadCondition:function(id,compId){var selected_condition=id.value;
var gid=document.getElementById("condID"+compId);
gid.className="qm-cond";
CERN_QUALITY_MEASURES_O1.GetQualityMeasuresTable(qmComponent,selected_condition);
},OpenQMDoc:function(formRefID,formActID){var criterion=qmComponent.getCriterion();
var paramString=criterion.person_id+"|"+criterion.encntr_id+"|"+formRefID+"|"+formActID+"|0";
MP_Util.LogMpagesEventInfo(null,"ORDERS",paramString,"qualitymeasures.js","OpenQMDoc");
MPAGES_EVENT("POWERFORM",paramString);
},ShowIcon:function(id){Util.Style.acss(id,"has-icon");
},HideIcon:function(id){Util.Style.rcss(id,"has-icon");
}};
}();
