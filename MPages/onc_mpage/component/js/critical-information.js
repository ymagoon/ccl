(function(){function b(d){var c='<div class="cic-hover"><div><span class="cic-hover-label">'+(i18n.innov.criticalInformation.ALERT_NAME)+": </span>"+(d.ALERT_NAME)+'</div><div><span class="cic-hover-label">'+(i18n.innov.criticalInformation.ALERT_TIME)+": </span>"+(d.ALERT_DT_TM)+"</div></div>";
return c;
}var a=b;
if(typeof module!=="undefined"&&module.exports){module.exports=a;
}else{if(typeof define==="function"){define(function(){return a;
});
}else{window.render=window.render||{};
window.render.cicCDSHover=a;
}}}());
(function(){function a(d){var c='<div class="cic-hover"><div><span class="cic-hover-label">'+(i18n.innov.criticalInformation.ORDER_DETAILS)+": </span>"+(d.hover)+"</div></div>";
return c;
}var b=a;
if(typeof module!=="undefined"&&module.exports){module.exports=b;
}else{if(typeof define==="function"){define(function(){return b;
});
}else{window.render=window.render||{};
window.render.cicOrderHover=b;
}}}());
(function(){function b(d){var c='<div class="cic-hover"><div><span class="cic-hover-label">'+(i18n.innov.criticalInformation.CONDITION)+": </span>"+(d.NAME)+"</div><div>";
if(d.CATEGORY){c+=(d.CATEGORY)+" - ";
}c+=(d.VOCAB_DISP)+" "+(i18n.innov.criticalInformation.TERM)+": "+(d.ANNOTATED_DISP)+" ("+(d.CODE)+')</div><div><span class="cic-hover-label">'+(i18n.innov.criticalInformation.CLASSIFICATION)+": </span> "+(d.CLASSIFICATION)+"</div></div>";
return c;
}var a=b;
if(typeof module!=="undefined"&&module.exports){module.exports=a;
}else{if(typeof define==="function"){define(function(){return a;
});
}else{window.render=window.render||{};
window.render.cicProblemsHover=a;
}}}());
function CriticalInformationComponentStyle(){this.initByNamespace("cic");
}CriticalInformationComponentStyle.prototype=new ComponentStyle();
CriticalInformationComponentStyle.prototype.constructor=ComponentStyle;
function CriticalInformationComponent(a){this.setCriterion(a);
this.setStyles(new CriticalInformationComponentStyle());
this.hover=new MPageTooltip().setShowDelay(0);
this.setComponentLoadTimerName("USR:MPG.CriticalInformation - load component");
this.setComponentRenderTimerName("ENG:MPG.CriticalInformation - render component");
this._documentTitle="";
this._problemsTitle="";
this._devicesTitle="";
this._clincialDecisionTitle="";
this._DataBedrockFilters=[];
this._advanceDirectiveDisplay=0;
this._resuscitationStatusDisplay=0;
}CriticalInformationComponent.prototype=new MPageComponent();
CriticalInformationComponent.prototype.constructor=MPageComponent;
CriticalInformationComponent.prototype.loadFilterMappings=function(){this.addFilterMappingObject("DOCUMENT_TITLE",{setFunction:this.setDocumentTitle,type:"STRING",field:"FTXT"});
this.addFilterMappingObject("PROBLEMS_TITLE",{setFunction:this.setProblemsTitle,type:"STRING",field:"FTXT"});
this.addFilterMappingObject("CLINICAL_DEC_TITLE",{setFunction:this.setClinicalDecisionTitle,type:"STRING",field:"FTXT"});
this.addFilterMappingObject("DEVICE_TITLE",{setFunction:this.setDevicesTitle,type:"STRING",field:"FTXT"});
this.addFilterMappingObject("ADV_DIR_DISP",{setFunction:this.setAdvanceDirectiveDisplay,type:"STRING",field:"FTXT"});
this.addFilterMappingObject("RESUS_ORD_DISP",{setFunction:this.setResuscitationStatusDisplay,type:"STRING",field:"FTXT"});
this.addFilterMappingObject("ORDER_SYNONYM",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("ORDER_SYNONYM_2",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("ORDER_SYNONYM_3",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("ORDER_SYNONYM_4",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("ORDER_SYNONYM_5",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("RESUS_ORDER",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("ORD_DET_1",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("ORD_DET_2",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("ORD_DET_3",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("ORD_DET_4",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("ORD_DET_5",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("RESUS_ORD_DETAIL",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("ORDER_STATUS",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("RESUS_ORD_STATUS",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("CLINICAL_EVENTS",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("DOCUMENTS",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("DOC_ALL",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("RESUS_DOC",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("EVENT_ALL",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("PROBLEMS",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("LOOK_BACK_ALL",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("CDS_LINKS",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("CDS_LOOKBACK",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("ADV_DIR_EVENT",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("ADV_DIR_DOC",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("CLIN_NOMEN",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("DEVICES",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("RESUS_DOC",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("CCL_OBJECT",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("ORDER_ALL",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("ORDER_ALL_STATUS",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("ORDER_ALL_LOOK",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("PP_CUR_ENC",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("PP_CUR_STATUS",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("PP_ALL_ENC",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("PP_ALL_STATUS",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
this.addFilterMappingObject("PP_ALL_LOOK",{setFunction:this.buildFilterList,type:"FILTER_OBJECT",field:"ALL"});
};
CriticalInformationComponent.prototype.buildFilterList=function(a){if(a){this._DataBedrockFilters.push(a);
}};
CriticalInformationComponent.prototype.setDocumentTitle=function(a){this._documentTitle=a;
};
CriticalInformationComponent.prototype.setDevicesTitle=function(a){this._devicesTitle=a;
};
CriticalInformationComponent.prototype.setProblemsTitle=function(a){this._problemsTitle=a;
};
CriticalInformationComponent.prototype.setClinicalDecisionTitle=function(a){this._clincialDecisionTitle=a;
};
CriticalInformationComponent.prototype.setAdvanceDirectiveDisplay=function(a){this._advanceDirectiveDisplay=parseInt(a,10);
};
CriticalInformationComponent.prototype.setResuscitationStatusDisplay=function(a){this._resuscitationStatusDisplay=parseInt(a,10);
};
CriticalInformationComponent.prototype.openDropDown=function(c){var a=this.getCriterion();
var b=a.person_id+"|"+a.encntr_id+"|"+c+"|0|0";
MP_Util.LogMpagesEventInfo(this,"POWERFORM",b,"critical-information.js","openDropDown");
MPAGES_EVENT("POWERFORM",b);
CERN_EventListener.fireEvent(null,this,EventListener.EVENT_CLINICAL_EVENT,"CriticalInformation");
};
CriticalInformationComponent.prototype.retrieveComponentData=function(){var e=this.getCriterion(),d=new MP_Core.ScriptRequest(),c=e.category_mean;
if(e.category_mean.indexOf("_ssView_")>-1){c=e.category_mean.slice(0,e.category_mean.indexOf("_ssView_"));
}var a={COMPONENT_FILTERS:{FILTERS:this._DataBedrockFilters}};
var f=JSON.stringify(a);
f=f.replace(/_ID":(\d+),/g,'_ID":$1.00,');
d.setRequestBlobIn(f);
d.setProgramName("INN_MP_GET_CRIT_INFO_DATA");
d.setParameters(["^MINE^",e.person_id+".0",e.encntr_id+".0",e.ppr_cd+".0",e.provider_id+".0","^"+c+"^"]);
d.setAsync(true);
var b=this;
MP_Core.XmlStandardRequest(this,d,function(g){b.renderComponent((g.getResponse()).REPLY);
});
};
CriticalInformationComponent.prototype.replaceDates=function(c){var d=/\d{2}\/\d{2}\/\d{2}\s\d{1,2}:\d{1,2}:\d{2}/g;
var a=MP_Util.GetDateFormatter();
var b=c.replace(d,function(e){return a.format(new Date(e),mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
});
return b;
};
CriticalInformationComponent.prototype.renderComponent=function(j){var c={DocumentedEvents:[],ProblemsDiagnosis:[],ClinicalDecision:[],Devices:[]},d=0,p,n=this.getCriterion(),a=": ",f=i18n.innov.criticalInformation,o=0,m=this.getStyles().getId(),g=this;
if(j.ADV_DIR_CE.length===0&&j.ADV_DIR_DOC.length===0){if(this._advanceDirectiveDisplay){o++;
c.DocumentedEvents.push({title:"<span class='res-none' style='padding:0;'>"+f.NO_ADVANCE_DIRECTIVE+"</span>"});
}}else{for(d=0;
d<j.ADV_DIR_CE.length;
d++){p=j.ADV_DIR_CE[d];
c.DocumentedEvents.push({title:"<a href='javascript:MP_Util.LaunchClinNoteViewer("+n.person_id+","+n.encntr_id+","+p.EVENT_ID+',"EVENT", 0);\'>'+p.RESULT_NAME+"</a>"+a+this.buildEventValueDisplay(p)});
}for(d=0;
d<j.ADV_DIR_DOC.length;
d++){p=j.ADV_DIR_DOC[d];
c.DocumentedEvents.push({title:"<a href='javascript:MP_Util.LaunchClinNoteViewer("+n.person_id+","+n.encntr_id+","+p.DOC_EVENT_ID+',"DOC", 0);\'>'+p.DOC_TITLE+"</a>"});
}}if(j.RES_DOC.length===0&&j.RES_ORDS.length===0){if(this._resuscitationStatusDisplay){o++;
c.DocumentedEvents.push({title:"<span class='res-none' style='padding:0;'>"+f.NO_RESUSCITATION_STATUS+"</span>"});
}}else{for(d=0;
d<j.RES_DOC.length;
d++){p=j.RES_DOC[d];
c.DocumentedEvents.push({title:"<a href='javascript:MP_Util.LaunchClinNoteViewer("+n.person_id+","+n.encntr_id+","+p.DOC_EVENT_ID+',"DOC", 0);\'>'+p.DOC_TITLE+"</a>"});
}for(d=0;
d<j.RES_ORDS.length;
d++){p=j.RES_ORDS[d];
c.DocumentedEvents.push({title:p.MNEMONIC+(p.DETAIL_DISPLAY?a+g.replaceDates(p.DETAIL_DISPLAY):""),hover:p.HOVER_DISPLAY});
}}for(d=j.CLINICAL_EVENTS.length;
d--;
){p=j.CLINICAL_EVENTS[d];
c.DocumentedEvents.push({title:"<a href='javascript:MP_Util.LaunchClinNoteViewer("+n.person_id+","+n.encntr_id+","+p.EVENT_ID+',"EVENT", 0);\'>'+p.RESULT_NAME+"</a>"+a+this.buildEventValueDisplay(p)});
}for(d=j.ORDERS.length;
d--;
){p=j.ORDERS[d];
c.DocumentedEvents.push({title:p.MNEMONIC+(p.DETAIL_DISPLAY?a+g.replaceDates(p.DETAIL_DISPLAY):""),hover:p.HOVER_DISPLAY});
}for(d=j.DOCUMENTS.length;
d--;
){p=j.DOCUMENTS[d];
c.DocumentedEvents.push({title:"<a href='javascript:MP_Util.LaunchClinNoteViewer("+n.person_id+","+n.encntr_id+","+p.DOC_EVENT_ID+',"DOC", 0);\'>'+p.DOC_TITLE+"</a>"});
}for(d=j.PROBLEMNDIAG.length;
d--;
){p=j.PROBLEMNDIAG[d];
c.ProblemsDiagnosis.push({title:this.linkFormat(p.NAME,p.DX_LINK)+' <span class="code">('+p.CODE+")</span>"});
}for(d=j.DEVICES.length;
d--;
){p=j.DEVICES[d];
c.Devices.push({title:p.NAME+' <span class="code">('+p.CODE+")</span>"});
}for(d=j.ALERTS.length;
d--;
){p=j.ALERTS[d];
c.ClinicalDecision.push({title:p.ALERT_NAME});
}for(d=j.POWERPLANS.length;
d--;
){p=j.POWERPLANS[d];
c.DocumentedEvents.push({title:p.DISPLAY});
}var i=new ComponentTable();
i.setNamespace(m);
i.setIsHeaderEnabled(false);
i.setZebraStripe(false);
i.addColumn(this.buildTableColumn("cic_column","${title}","cic-column"));
i.addGroup(this.buildTableGroup("DocumentedEvents",c.DocumentedEvents,this._documentTitle));
var b=new ComponentTable();
b.setNamespace(m);
b.setIsHeaderEnabled(false);
b.setZebraStripe(false);
b.addColumn(this.buildTableColumn("cic_column","${title}","cic-column"));
b.addGroup(this.buildTableGroup("ProblemsDiagnosis",c.ProblemsDiagnosis,this._problemsTitle));
var k=new ComponentTable();
k.setNamespace(m);
k.setIsHeaderEnabled(false);
k.setZebraStripe(false);
k.addColumn(this.buildTableColumn("cic_column","${title}","cic-column"));
k.addGroup(this.buildTableGroup("Devices",c.Devices,this._devicesTitle));
var e=new ComponentTable();
e.setNamespace(m);
e.setIsHeaderEnabled(false);
e.setZebraStripe(false);
e.addColumn(this.buildTableColumn("cic_column","${title}","cic-column"));
e.addGroup(this.buildTableGroup("ClinicalDecisionSupport",c.ClinicalDecision,this._clincialDecisionTitle));
var h=["<div class='cic-container'><div class='cic-events-container'>"];
if(this._documentTitle.length>0){h.push(i.render());
}h.push("</div><div class='cic-problems-container'>");
if(this._problemsTitle.length>0){h.push(b.render());
}if(this._devicesTitle.length>0){h.push(k.render());
}h.push("</div><div class='cic-decision-container'>");
if(this._clincialDecisionTitle.length>0){h.push(e.render());
}h.push("</div></div>");
this.finalizeComponent(h.join(""),false);
var r=0,l=$("#"+m);
if(this._documentTitle.length>0){l.find(".cic-events-container").find(".component-table").first().find(".sub-sec-content").find("dl").hover(function(s){var u=$(this).get(0),t=$(this).index();
p=c.DocumentedEvents[t];
if(typeof p.hover!=="undefined"){r=setTimeout(function(){g.hover.setX(s.pageX).setY(s.pageY).setAnchor(u);
g.hover.setContent(window.render.cicOrderHover(p));
g.hover.show();
},500);
}},function(s){if(g.hover.getContent()){g.hover.getContent().remove();
}if(r){clearTimeout(r);
}});
}if(this._problemsTitle.length>0){l.find(".cic-problems-container").find(".component-table").first().find(".result-info").hover(function(s){var t=$(this).get(0),u=j.PROBLEMNDIAG.length-$(this).index()-1;
r=setTimeout(function(){g.hover.setX(s.pageX).setY(s.pageY).setAnchor(t);
g.hover.setContent(window.render.cicProblemsHover(j.PROBLEMNDIAG[u]));
g.hover.show();
},500);
},function(s){if(g.hover.getContent()){g.hover.getContent().remove();
}if(r){clearTimeout(r);
}});
}if(this._devicesTitle.length>0){l.find(".cic-problems-container").find(".component-table").last().find(".result-info").hover(function(s){var u=$(this).get(0),t=j.DEVICES.length-$(this).index()-1;
r=setTimeout(function(){g.hover.setX(s.pageX).setY(s.pageY).setAnchor(u);
g.hover.setContent(window.render.cicProblemsHover(j.DEVICES[t]));
g.hover.show();
},500);
},function(s){if(g.hover.getContent()){g.hover.getContent().remove();
}if(r){clearTimeout(r);
}});
}if(this._clincialDecisionTitle.length>0){l.find(".cic-decision-container").find(".component-table").find(".result-info").hover(function(s){var t=$(this).get(0),u=j.ALERTS.length-$(this).index()-1;
r=setTimeout(function(){g.hover.setX(s.pageX).setY(s.pageY).setAnchor(t);
g.hover.setContent(window.render.cicCDSHover(j.ALERTS[u]));
g.hover.show();
},500);
},function(s){if(g.hover.getContent()){g.hover.getContent().remove();
}if(r){clearTimeout(r);
}});
}if(o>0){var q=l.find(".cic-events-container").find(".sub-sec-total").text();
q=parseInt((/(\d+)/).exec(q),10);
q=q-o;
l.find(".cic-events-container").find(".sub-sec-total").text(" ("+q+")");
}l.find(".cic-events-container").find(".sub-sec-display").parent().append("<span> "+f.MOST_RECENT+"</span>");
l.find(".cic-problems-container").find(".sub-sec-display").first().parent().append("<span> "+f.ACTIVE+"</span>");
l.find(".cic-decision-container").find(".sub-sec-display").parent().append("<span> "+f.LAST+" "+(parseInt(j.ALERT_LOOK_BACK,10)||"0")+" "+f.HOURS+"</span>");
};
CriticalInformationComponent.prototype.buildEventValueDisplay=function(c){var b=[],a=c.RESULT_SEVERITY;
b.push("<span class='");
switch(a){case"CRITICAL":case"EXTREMEHIGH":case"PANICHIGH":case"EXTREMELOW":case"PANICLOW":case"VABNORMAL":case"POSITIVE":b.push("res-severe");
break;
case"HIGH":b.push("res-high");
break;
case"LOW":b.push("res-low");
break;
case"ABNORMAL":b.push("res-abnormal");
break;
case"":b.push("res-normal");
break;
}b.push("'><span class='res-ind'>&nbsp</span>",c.RESULT_VAL,"</span>");
return b.join("");
};
CriticalInformationComponent.prototype.linkFormat=function(a,b){return b.length>0?"<a href='javascript:APPLINK(100,\""+b+'", "")\'>'+a+"</a>":a;
};
CriticalInformationComponent.prototype.buildTableGroup=function(d,b,c){var a=new TableGroup();
a.setGroupId(d);
a.setDisplay(c);
a.setShowCount(true);
a.setCanCollapse(false);
a.bindData(b);
return a;
};
CriticalInformationComponent.prototype.buildTableColumn=function(d,c,b){var a=new TableColumn();
a.setColumnId(d);
a.setColumnDisplay("none");
a.setRenderTemplate(c);
a.setCustomClass(b);
return a;
};
MP_Util.setObjectDefinitionMapping("ADV_CRITICAL_COMP",CriticalInformationComponent);
