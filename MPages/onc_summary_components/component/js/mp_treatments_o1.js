function TreatmentsComponentO1Style(){this.initByNamespace("treat");
}TreatmentsComponentO1Style.inherits(ComponentStyle);
function TreatmentsComponentO1(criterion){this.m_OTTreatments=null;
this.m_PTTreatments=null;
this.m_SLPTreatments=null;
this.setCriterion(criterion);
this.setStyles(new TreatmentsComponentO1Style());
this.setComponentLoadTimerName("USR:MPG.Treatments.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.Treatments.O1 - render component");
this.setIncludeLineNumber(true);
TreatmentsComponentO1.method("InsertData",function(){CERN_TreatmentsO1.GetTreatmentsO1Table(this);
});
TreatmentsComponentO1.method("HandleSuccess",function(recordData){CERN_TreatmentsO1.RenderComponent(this,recordData);
});
TreatmentsComponentO1.method("openTab",function(){var criterion=this.getCriterion();
var par=criterion.person_id+"|"+criterion.encntr_id+"|"+0+"|0|0";
MP_Util.LogMpagesEventInfo(this,"POWERFORM",par,"mp_treatments_o1.js","openTab");
javascript:MPAGES_EVENT("POWERFORM",par);
});
TreatmentsComponentO1.method("openDropDown",function(formID){var criterion=this.getCriterion();
var par=criterion.person_id+"|"+criterion.encntr_id+"|"+formID+"|0|0";
MP_Util.LogMpagesEventInfo(this,"POWERFORM",par,"mp_treatments_o1.js","openDropDown");
javascript:MPAGES_EVENT("POWERFORM",par);
});
TreatmentsComponentO1.method("setOTTreatments",function(value){this.rowCount++;
this.m_OTTreatments=value;
});
TreatmentsComponentO1.method("addOTTreatments",function(value){if(this.m_OTTreatments==null){this.m_OTTreatments=[];
}this.m_OTTreatments.push(value);
});
TreatmentsComponentO1.method("getOTTreatments",function(){return this.m_OTTreatments;
});
TreatmentsComponentO1.method("setPTTreatments",function(value){this.rowCount++;
this.m_PTTreatments=value;
});
TreatmentsComponentO1.method("addPTTreatments",function(value){if(this.m_PTTreatments==null){this.m_PTTreatments=[];
}this.m_PTTreatments.push(value);
});
TreatmentsComponentO1.method("getPTTreatments",function(){return this.m_PTTreatments;
});
TreatmentsComponentO1.method("setSLPTreatments",function(value){this.rowCount++;
this.m_SLPTreatments=value;
});
TreatmentsComponentO1.method("addSLPTreatments",function(value){if(this.m_SLPTreatments==null){this.m_SLPTreatments=[];
}this.m_SLPTreatments.push(value);
});
TreatmentsComponentO1.method("getSLPTreatments",function(){return this.m_SLPTreatments;
});
}TreatmentsComponentO1.inherits(MPageComponent);
var CERN_TreatmentsO1=function(){return{GetTreatmentsO1Table:function(component){var sendTPR=[];
var criterion=component.getCriterion();
var treato1_lookBackType=0;
var treato1_lookBackUnits=0;
var treato1_encntrOption=(component.getScope()==1)?"0.0":(criterion.encntr_id+".0");
treato1_lookBackUnits=(component.getLookbackUnits()!=null)?component.getLookbackUnits():"0";
treato1_lookBackType=(component.getLookbackUnitTypeFlag()!=null)?component.getLookbackUnitTypeFlag():"-1";
sendTPR.push("^MINE^",criterion.person_id+".0",treato1_encntrOption,criterion.provider_id+".0",criterion.position_cd+".0",criterion.ppr_cd+".0",treato1_lookBackUnits,treato1_lookBackType,criterion.encntr_id+".0");
sendTPR.push((component.getOTTreatments()!=null)?"value("+component.getOTTreatments().join(",")+")":"0.0");
sendTPR.push((component.getPTTreatments()!=null)?"value("+component.getPTTreatments().join(",")+")":"0.0");
sendTPR.push((component.getSLPTreatments()!=null)?"value("+component.getSLPTreatments().join(",")+")":"0.0");
MP_Core.XMLCclRequestWrapper(component,"mp_reh_treatments",sendTPR,true);
},RenderComponent:function(component,recordData){try{var jsTreatO1HTML=[];
var criterion=component.getCriterion();
var patResult="";
var TreatRows=3;
var totEvents=4;
for(var i=0;
i<recordData.CNT;
i++){TreatRows=TreatRows+recordData.TREATMENTS[i].TOT_VAL_CNT;
}jsTreatO1HTML.push("<div class='",MP_Util.GetContentClass(component,TreatRows),"'>");
jsTreatO1HTML.push("<div class='content-hdr'><dl class ='treat-info-hdr'><dt class ='treat-dt'><span>Treatment</span></dt><dd class ='treat-dd'><span>Detail</span></dd></dl></div>");
for(var i=0;
i<recordData.CNT;
i++){totEvents=recordData.TREATMENTS[i].TOT_VAL_CNT;
jsTreatO1HTML.push("<div class='sub-sec treat-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='",patResult,"'>-</span><span class='sub-sec-title'>",recordData.TREATMENTS[i].NAME,"</span></h3><div class='sub-sec-content'><div class='content-body'>");
if(recordData.TREATMENTS[i].DG_TREATMENTS.DG_CNT>0){for(var k=0;
k<recordData.TREATMENTS[i].DG_TREATMENTS.DG_CNT;
k++){jsTreatO1HTML.push("<div class='sub-sec treat-sec'><div><h3 class='sub-sec-hd'>"+recordData.TREATMENTS[i].DG_TREATMENTS.LABELDG[k].DG_NAME+"</h3></div>");
for(var l=0;
l<recordData.TREATMENTS[i].DG_TREATMENTS.LABELDG[k].VALUESDG_CNT;
l++){jsTreatO1HTML.push("<div class='sub-sec treat-sec'><dl class='treat-info'><dt class='treat-dt'><span>"+recordData.TREATMENTS[i].DG_TREATMENTS.LABELDG[k].VALUESDG[l].DISPLAY_TEXT+"</span></dt><dd class='treat-dd'><span>",recordData.TREATMENTS[i].DG_TREATMENTS.LABELDG[k].VALUESDG[l].DISPLAY_VALUE,"</span></dd></dl></div>");
}jsTreatO1HTML.push("</div>");
}}if(recordData.TREATMENTS[i].NONDG_TREATMENTS.VAL_CNT>0){jsTreatO1HTML.push("<div class='sub-sec treat-sec'><h5 class='sub-sec-hd'><span class='sub-sec-title'> Treatments </span></h5></div>");
}for(var j=recordData.TREATMENTS[i].NONDG_TREATMENTS.VAL_CNT-1;
j>=0;
j--){jsTreatO1HTML.push("<div class='sub-sec treat-sec'><dl class='treat-info'><dt class='treat-dt'><span>"+recordData.TREATMENTS[i].NONDG_TREATMENTS.VALUES[j].DISPLAY_TEXT+"</span></dt><dd class='treat-dd'><span>",recordData.TREATMENTS[i].NONDG_TREATMENTS.VALUES[j].DISPLAY_VALUE,"</span></dd></dl></div>");
}jsTreatO1HTML.push("</div></div></div>");
}jsTreatO1HTML.push("</div>");
jsTreatO1HTML=jsTreatO1HTML.join("");
MP_Util.Doc.FinalizeComponent(jsTreatO1HTML,component,"");
}catch(err){throw (err);
}finally{}}};
}();
