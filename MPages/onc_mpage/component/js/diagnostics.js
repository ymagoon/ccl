function DiagnosticsComponentStyle(){this.initByNamespace("dg");
}DiagnosticsComponentStyle.inherits(ComponentStyle);
function DiagnosticsComponent(criterion){this.setCriterion(criterion);
this.setLookBackDropDown(true);
this.setStyles(new DiagnosticsComponentStyle());
this.setComponentLoadTimerName("USR:MPG.DIAGNOSTICS.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.DIAGNOSTICS.O1 - render component");
this.setIncludeLineNumber(true);
this.m_docImagesInd=false;
this.setPregnancyLookbackInd(true);
var chestEvents="0.0";
var ekgEvents="0.0";
var otherEvents="0.0";
DiagnosticsComponent.method("InsertData",function(){initGroupConfigs(this);
CERN_DIAGNOSTICS_O1.GetDiagnostics(this);
});
DiagnosticsComponent.method("HandleSuccess",function(recordData){CERN_DIAGNOSTICS_O1.RenderComponent(this,recordData);
});
DiagnosticsComponent.method("getChestEvents",function(){return chestEvents;
});
DiagnosticsComponent.method("getEKGEvents",function(){return ekgEvents;
});
DiagnosticsComponent.method("getOtherEvents",function(){return otherEvents;
});
DiagnosticsComponent.method("isChestConfigured",function(){return(chestEvents!=="0.0")?true:false;
});
DiagnosticsComponent.method("isEKGConfigured",function(){return(ekgEvents!=="0.0")?true:false;
});
DiagnosticsComponent.method("isOtherConfigured",function(){return(otherEvents!=="0.0")?true:false;
});
DiagnosticsComponent.method("isDocImagesInd",function(){return this.m_docImagesInd;
});
DiagnosticsComponent.method("setDocImagesInd",function(value){this.m_docImagesInd=(value==1?true:false);
});
function initGroupConfigs(component){var groups=component.getGroups();
var xl=(groups)?groups.length:0;
for(var x=xl;
x--;
){var group=groups[x];
switch(group.getGroupName()){case"CXR_ABD_CE":case"ED_CXR_ABD_CE":case"IS_CXR_ABD_CE":case"NC_CXR_ABD_CE":chestEvents=MP_Util.CreateParamArray(group.getEventSets(),1);
break;
case"EKG_CE":case"ED_EKG_CE":case"IS_EKG_CE":case"NC_EKG_CE":ekgEvents=MP_Util.CreateParamArray(group.getEventSets(),1);
break;
case"OTHER_RAD_ES":case"ED_OTHER_RAD_ES":case"IS_OTHER_RAD_ES":case"NC_OTHER_RAD_ES":otherEvents=MP_Util.CreateParamArray(group.getEventSets(),1);
break;
}}}}DiagnosticsComponent.inherits(MPageComponent);
DiagnosticsComponent.prototype.loadFilterMappings=function(){this.addFilterMappingObject("DIAG_URL_IMAGES",{setFunction:this.setDocImagesInd,type:"BOOLEAN",field:"FREETEXT_DESC"});
};
var CERN_DIAGNOSTICS_O1=function(){var diagI18n=i18n.discernabu.diagnostics_o1;
function sortByEffectiveDate(a,b){if(a.DT_TM>b.DT_TM){return -1;
}else{if(a.DT_TM<b.DT_TM){return 1;
}}return 0;
}function createSubsection(recData,title,component,isConfigured){if(!isConfigured){return"";
}var criterion=component.getCriterion();
var ar=[];
var recSize=recData.length;
ar.push('<div class="sub-sec"><h3 class="sub-sec-hd"><span class="sub-sec-hd-tgl" title=',diagI18n.HIDE_SECTION,'>-</span><span class="sub-sec-title">',title," (",recSize,")</span></h3>");
ar.push('<div class="sub-sec-content"><div class="content-body">');
if(recSize>0){recData.sort(sortByEffectiveDate);
for(var x=0;
x<recSize;
x++){var rec=recData[x];
var sDate="";
var sDateHvr="";
var imageUrl=rec.IMAGE_URL;
var link="";
var providerId=criterion.provider_id;
var imageIndicator=0;
var effectiveDate=(rec.DT_TM.search("0000-00-00")!==-1)?"":new Date();
if(effectiveDate){effectiveDate.setISO8601(rec.DATE);
sDate=MP_Util.DisplayDateByOption(component,effectiveDate);
sDateHvr=effectiveDate.format("longDateTime3");
}if(CERN_BrowserDevInd){var sParams=[];
var arDisplay=[];
sParams.push(rec.PERSON_ID+".0",rec.ENCNTR_ID+".0",rec.EVENT_ID+".0",'"'+rec.DISPLAY+'"','"'+rec.VIEWER_TYPE+'"',rec.PARENT_EVENT_ID+".0",'"'+imageUrl+'"',providerId+".0",imageIndicator,'"'+rec.DISPLAY+'"');
arDisplay.push("<a onclick='MD_reachViewerDialog.LaunchReachClinNoteViewer(",sParams,"); return false;' href='#'>",rec.DISPLAY,"</a>");
link=arDisplay.join("");
}else{link=MP_Util.CreateClinNoteLink(rec.PERSON_ID+".0",rec.ENCNTR_ID+".0",rec.EVENT_ID+".0",rec.DISPLAY,rec.VIEWER_TYPE,rec.PARENT_EVENT_ID+".0");
}ar.push('<h3 class="info-hd">',rec.DISPLAY,"</h3>");
ar.push('<dl class="dg-info"><dt><span>',diagI18n.DIAGNOSTICS,':</span></dt><dd class="dg-name"><span>',link,"</span>");
if(rec.STATUS_MEAN==="MODIFIED"||rec.STATUS_MEAN==="ALTERED"){ar.push("<span class='res-modified'>&nbsp;</span>");
}ar.push("</dd><dt><span>",diagI18n.DATE_TIME,':</span></span></dt><dd class="dg-within">',sDate,"</dd><dt><span>",diagI18n.STATUS,":</span></dt><dd class='dg-stat'><span>",rec.STATUS,"</span></dd><dd class='dg-image'>");
var urlParam="";
if(rec.IMAGE_URL!==""){if(CERN_BrowserDevInd){imageIndicator=1;
var iParams=[];
var arImage=[];
iParams.push(rec.PERSON_ID+".0",rec.ENCNTR_ID+".0",rec.EVENT_ID+".0",'"'+rec.DISPLAY+'"','"'+rec.VIEWER_TYPE+'"',rec.PARENT_EVENT_ID+".0",'"'+imageUrl+'"',providerId+".0",imageIndicator,'"'+rec.DISPLAY+'"');
arImage.push("'#' onclick ='MD_reachViewerDialog.LaunchReachClinNoteViewer(",iParams,"); return false;'");
var imageLink=arImage.join("");
ar.push("<a class='dg-image-found' href='",imageLink,"'>&nbsp;</a>");
}else{urlParam='javascript:MPAGES_SVC_EVENT("'+rec.IMAGE_URL+'",^MINE,$PAT_PersonId$^)';
ar.push("<a class='dg-image-found' href='",urlParam,"'>&nbsp;</a>");
}}else{ar.push("&nbsp;");
}ar.push("</dd></dl>");
ar.push("<h4 class=det-hd><span>",diagI18n.DIAGNOSTIC_DETAILS,"</span></h4><div class=hvr><dl class=dg-det><dt><span>",diagI18n.STUDY,":</span></dt><dd><span>",rec.DISPLAY,"</span></dd><dt><span>",diagI18n.DATE_TIME,":</span></dt><dd><span>",sDateHvr,"</span></dd></dl></div>");
}}else{ar.push("<div ><span class='res-none'>"+diagI18n.NO_RESULTS_FOUND+"</span></div>");
}ar.push("</div></div></div>");
return ar.join("");
}return{GetDiagnostics:function(component){var sendAr=[];
var criterion=component.getCriterion();
var encntrOption=(component.getScope()==2)?(criterion.encntr_id+".0"):"0.0";
sendAr.push("^MINE^",criterion.person_id+".0",encntrOption,criterion.provider_id+".0",criterion.ppr_cd+".0",component.getLookbackUnits(),component.getLookbackUnitTypeFlag(),component.getChestEvents(),component.getEKGEvents(),component.getOtherEvents());
sendAr.push(component.isDocImagesInd()?1:0);
MP_Core.XMLCclRequestWrapper(component,"MP_RETRIEVE_DIAGNOSTICS",sendAr,true);
},RenderComponent:function(component,recordData){var arHTML=[];
var totalCnt=recordData.CHEST.length+recordData.EKG.length+recordData.OTHER.length;
arHTML.push('<div class ="',MP_Util.GetContentClass(component,totalCnt),'">');
arHTML.push('<dl class="dg-info-hdr hdr"><dd class=dg-name-hd><span>&nbsp;</span></dd><dd class=dg-within-hd><span>');
arHTML.push(diagI18n.DATE_TIME);
if(component.getDateFormat()==3){arHTML.push("<br />",diagI18n.WITHIN);
}arHTML.push("</span></dd><dd class=dg-stat-hd><span>",diagI18n.STATUS,"</span></dd></dl>");
arHTML.push(createSubsection(recordData.CHEST,diagI18n.CHEST,component,component.isChestConfigured()));
arHTML.push(createSubsection(recordData.EKG,diagI18n.EKG,component,component.isEKGConfigured()));
arHTML.push(createSubsection(recordData.OTHER,diagI18n.OTHER,component,component.isOtherConfigured()));
arHTML.push("</div>");
var sHTML=arHTML.join("");
var countText=MP_Util.CreateTitleText(component,totalCnt);
MP_Util.Doc.FinalizeComponent(sHTML,component,countText);
}};
}();
