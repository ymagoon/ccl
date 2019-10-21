function MufxComponentStyle(){this.initByNamespace("mufx");
}MufxComponentStyle.prototype=new ComponentStyle();
MufxComponentStyle.prototype.constructor=ComponentStyle;
function Mufx(criterion){this.setCriterion(criterion);
this.setStyles(new MufxComponentStyle());
this.setComponentLoadTimerName("USR:MPG.MUFX.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.MUFX.O1 - render component");
this.setIncludeLineNumber(true);
this.setScope(3);
}Mufx.prototype=new MPageComponent();
Mufx.prototype.constructor=MPageComponent;
Mufx.prototype.constructInfoModal=function(){var infoModalDialog=MP_ModalDialog.retrieveModalDialogObject("infoModalDialog");
if(infoModalDialog instanceof ModalDialog){MP_ModalDialog.showModalDialog(infoModalDialog.getId());
return;
}infoModalDialog=new ModalDialog("infoModalDialog");
infoModalDialog.setHeaderTitle(i18n.discernabu.Mufx.INFO);
infoModalDialog.setTopMarginPercentage(10).setBottomMarginPercentage(55).setRightMarginPercentage(35).setLeftMarginPercentage(35).setIsBodySizeFixed(false);
var closeButton=new ModalButton("closeButton");
closeButton.setText(i18n.discernabu.Mufx.CLOSE).setCloseOnClick(true);
infoModalDialog.addFooterButton(closeButton);
infoModalDialog.setBodyDataFunction(function(){var cmslink="http://www.cms.gov/Regulations-and-Guidance/Legislation/EHRIncentivePrograms/index.html?redirect=/EHRIncentivePrograms/32_Attestation.asp ";
infoModalDialog.setBodyHTML("<div></br>"+i18n.discernabu.Mufx.INFO_MSG+"<a href= 'javascript:APPLINK(100,\""+cmslink+'" ," " ) \' > cms.gov/Regulations-and-Guidance/EHRIncentivePrograms</a></br> </br></div>');
});
MP_ModalDialog.addModalDialogObject(infoModalDialog);
MP_ModalDialog.showModalDialog(infoModalDialog.getId());
};
Mufx.prototype.preProcessing=function(){var mufxPrefObj=this.getPreferencesObj()||2;
this.savedStage=mufxPrefObj;
this.encounterType=0;
var self=this;
var criterion=this.getCriterion();
var scriptRequest;
var sendAr=["^MINE^",criterion.provider_id,criterion.encntr_id];
this.deferred=$.Deferred();
scriptRequest=new ComponentScriptRequest();
scriptRequest.setProgramName("LH_MP_MU_STAGES");
scriptRequest.setParameterArray(sendAr);
scriptRequest.setComponent(this);
scriptRequest.setAsyncIndicator(true);
scriptRequest.setResponseHandler(function(reply){self.replyMeasures.STAGE=reply.m_responseData.STAGE;
self.replyMeasures.DESC=reply.m_responseData.DESC;
self.replyMeasures.STAGES=reply.m_responseData.STAGES;
if(reply.m_responseData.ENCNTR_FLAG===1){self.encounterType=1;
}self.deferred.resolve(self.savedStage);
var id=self.getStyles().getId();
var compMenu=self.getMenu();
for(var i=0;
i<self.replyMeasures.STAGES.length;
i++){var stage=self.replyMeasures.STAGES[i];
var buttonId="stage"+stage.ID+id;
var menuItem=new MenuSelection(buttonId);
menuItem.setLabel(i18n.discernabu.Mufx[stage.DESC]);
menuItem.stage=stage.ID;
if(stage.ID==mufxPrefObj){menuItem.setIsSelected(true);
}menuItem.setClickFunction(function(){var menuItems=compMenu.getMenuItemArray();
for(var j=0;
j<menuItems.length;
j++){menuItems[j].setIsSelected(false);
}this.setIsSelected(true);
self.loadStage(this.stage);
});
compMenu.insertMenuItem(menuItem,i);
MP_MenuManager.updateMenuObject(compMenu);
}});
scriptRequest.performRequest();
var id=this.getStyles().getId();
var menuId="mainCompMenu"+this.getStyles().getId();
var compMenu=this.getMenu();
var information="information"+id;
var info=new MenuSelection(information);
info.setLabel(i18n.discernabu.Mufx.INFO);
info.setClickFunction(function(){this.setIsSelected(false);
self.constructInfoModal();
});
compMenu.insertMenuItem(info,0);
var help="help"+id;
var helpmenu=new MenuSelection(help);
helpmenu.setLabel(i18n.discernabu.Mufx.HELP);
helpmenu.setClickFunction(function(){this.setIsSelected(false);
var helplink="https://wiki.ucern.com/display/reference/Meaningful+Use+Functional+Reports+Reference+Pages";
APPLINK(100,helplink,"");
});
compMenu.insertMenuItem(helpmenu,1);
MP_MenuManager.updateMenuObject(compMenu);
};
Mufx.prototype.loadComponentSettings=function(compSettings){MPageComponent.prototype.loadComponentSettings.call(this,compSettings);
var filterMappingObj=this.getFilterMappingsObj();
var filterCnt=compSettings.FILT.length;
var criterion=this.getCriterion();
var id=this.getComponentId();
for(var x=0;
x<filterCnt;
x++){var compFilter=compSettings.FILT[x];
var mappedFilter=filterMappingObj[compFilter.F_MN];
if(!mappedFilter){if((compFilter.F_MN.indexOf("PF",compFilter.F_MN.length-"PF".length)!==-1)||(compFilter.F_MN.indexOf("PF2",compFilter.F_MN.length-"PF2".length)!==-1)){var pfArr=this.getFilterValues(compFilter);
var powerFormArr=[];
for(var i=0;
i<pfArr.length;
i++){powerFormEle={};
powerFormEle.desc=pfArr[i].m_description;
powerFormEle.link='<a class="mufx-pwx-result-link mu-measure-desc" id="'+pfArr[i].m_id+id+'" onclick="Mufx.prototype.openPowerForm('+criterion.person_id+","+criterion.encntr_id+", "+pfArr[i].m_id+", '%s')\" >%s</a>";
powerFormEle.altLink='<p class="mufx-powerform-links mufx-hidden">&nbsp;&nbsp;<a id="'+pfArr[i].m_id+id+'" onclick="Mufx.prototype.openPowerForm('+criterion.person_id+","+criterion.encntr_id+", "+pfArr[i].m_id+",'%s')\"  >"+pfArr[i].m_description+"</a></p>";
powerFormArr.push(powerFormEle);
}this.subMeasures.pwPowerform[compFilter.F_MN]=powerFormArr;
}else{if((compFilter.F_MN.indexOf("CP",compFilter.F_MN.length-"CP".length)!==-1)||(compFilter.F_MN.indexOf("CP2",compFilter.F_MN.length-"CP2".length)!==-1)){var pfArr=this.getFilterValues(compFilter);
if(pfArr[0].m_description){this.subMeasures.pwComponent[compFilter.F_MN]={desc:pfArr[0].m_description,link:'<a class="mufx-pwx-result-link mu-measure-desc" id="'+pfArr[0].m_description+id+'" href="#" onclick="Mufx.prototype.openApplink('+criterion.person_id+", "+criterion.encntr_id+", '"+pfArr[0].m_description+"', '%s')\" >%s</a>",altLink:'<p class="mufx-powerform-links mufx-hidden">&nbsp;&nbsp;<a id="'+pfArr[0].m_description+id+'" href="#" onclick="Mufx.prototype.openApplink('+criterion.person_id+", "+criterion.encntr_id+", '"+pfArr[0].m_description+"', '%s')\" >"+pfArr[0].m_description+"</a></p>"};
}else{this.subMeasures.pwComponent[compFilter.F_MN]={};
}}else{if((compFilter.F_MN.indexOf("TEXT",compFilter.F_MN.length-"TEXT".length)!==-1)||(compFilter.F_MN.indexOf("TEXT2",compFilter.F_MN.length-"TEXT2".length)!==-1)){var pfArr=this.getFilterValues(compFilter);
this.subMeasures.altMeasureDesc[compFilter.F_MN]=pfArr[0].m_description;
}else{if((compFilter.F_MN.indexOf("LINK",compFilter.F_MN.length-"LINK".length)!==-1)||(compFilter.F_MN.indexOf("LINK2",compFilter.F_MN.length-"LINK2".length)!==-1)){var pfArr=this.getFilterValues(compFilter);
this.subMeasures.measureLink[compFilter.F_MN]="<a href=\"javascript:APPLINK(100,'"+pfArr[0].m_description+"',' ')\">Reference Link</a></br>";
}else{if((compFilter.F_MN.indexOf("IND",compFilter.F_MN.length-"IND".length)!==-1)||(compFilter.F_MN.indexOf("IND2",compFilter.F_MN.length-"IND2".length)!==-1)){var pfArr=this.getFilterValues(compFilter);
this.subMeasures.showMeasure[compFilter.F_MN]=pfArr[0].m_description;
}else{if((compFilter.F_MN.indexOf("MOD",compFilter.F_MN.length-"MOD".length)!==-1)||(compFilter.F_MN.indexOf("MOD2",compFilter.F_MN.length-"MOD2".length)!==-1)){var pfArr=this.getFilterValues(compFilter);
this.subMeasures.moduleLink[compFilter.F_MN]={desc:pfArr[0].m_description,link:'<a class="mu-measure-desc mufx-pwx-result-link" id="'+pfArr[0].m_description+id+'" onclick="Mufx.prototype.openWinModule('+criterion.person_id+", "+criterion.encntr_id+", "+criterion.provider_id+",'"+pfArr[0].m_description+"', '%s')\" >%s</a>",altLink:'<p class="mufx-powerform-links mufx-hidden">&nbsp;&nbsp;<a id="'+pfArr[0].m_description+id+'" onclick="Mufx.prototype.openWinModule('+criterion.person_id+", "+criterion.encntr_id+", "+criterion.provider_id+",'"+pfArr[0].m_description+"', '%s')\" >"+pfArr[0].m_description+"</a></p>"};
}}}}}}}}};
Mufx.prototype.loadFilterMappings=function(){this.addFilterMappingObject("MUFX_REALTIME_MODE",{setFunction:function(realTimeMode){this.realTimeMode=realTimeMode;
},type:"BOOLEAN",field:"FTXT"});
};
Mufx.prototype.openTab=function(){var criterion=this.getCriterion();
var paramString=criterion.person_id+"|"+criterion.encntr_id+"|"+0+"|0|0";
MP_Util.LogMpagesEventInfo(null,"POWERFORM",paramString,"mufx-o1.js","openTab");
MPAGES_EVENT("POWERFORM",paramString);
};
Mufx.prototype.openWinModule=function(person_id,encntr_id,user_id,moduleName,measureDesc){var measureCapTimer=new CapabilityTimer("CAP:MPG.MUFX.O1 - "+measureDesc);
measureCapTimer.capture();
var patedObject={};
patedObject=CERN_Platform.getDiscernObject(moduleName);
if(moduleName=="PATIENTEDUCATION"){patedObject.SetPatient(person_id,encntr_id);
patedObject.SetDefaultTab(1);
patedObject.DoModal();
}else{if(moduleName=="DISCHARGEPROCESS"){patedObject.person_id=person_id;
patedObject.encounter_id=encntr_id;
patedObject.user_id=user_id;
patedObject.LaunchDischargeDialog();
}}};
Mufx.prototype.openPowerForm=function(person_id,encntr_id,formID,measureDesc){var measureCapTimer=new CapabilityTimer("CAP:MPG.MUFX.O1 - "+measureDesc);
measureCapTimer.capture();
var paramString=person_id+"|"+encntr_id+"|"+formID+"|0|0";
logger.logMPagesEventInfo(null,"POWERFORM",paramString,"mufx-o1.js","openPowerForm");
MPAGES_EVENT("POWERFORM",paramString);
return false;
};
Mufx.prototype.openApplink=function(person_id,encntr_id,componentLink,measureDesc){var measureCapTimer=new CapabilityTimer("CAP:MPG.MUFX.O1 - "+measureDesc);
measureCapTimer.capture();
var paramString="/PERSONID="+person_id+" /ENCNTRID="+encntr_id+" /FIRSTTAB=^"+componentLink+"^";
logger.logMPagesEventInfo(null,"POWERFORM",paramString,"mufx-o1.js","openComponent");
APPLINK(0,"Powerchart.exe",paramString);
return false;
};
Mufx.prototype.loadStage=function(stageId){var criterion=this.getCriterion();
this.savedStage=stageId;
this.setPreferencesObj(stageId);
this.savePreferences(true);
this.loadTimer=new RTMSTimer(this.getComponentLoadTimerName(),this.getCriterion().category_mean);
this.loadTimer.start();
for(var i=this.replyMeasures.STAGES[stageId-1].MEASURES.length-1;
i>=0;
i--){measure=this.replyMeasures.STAGES[stageId-1].MEASURES[i];
if(this.subMeasures.showMeasure[measure.IND]==0){this.replyMeasures.NUM_MEASURES++;
if(this.replyMeasures.NUM_MEASURES==this.replyMeasures.STAGES[stageId-1].MEASURES.length){this.loadTimer.stop();
this.renderComponent();
this.replyMeasures.MEASURES=[];
this.replyMeasures.NUM_MEASURES=0;
return;
}continue;
}var scriptRequest=new ComponentScriptRequest();
scriptRequest.setProgramName("LH_MP_MU_STATUS");
var sendAr=["^MINE^",criterion.person_id+".0",criterion.encntr_id+".0",criterion.provider_id+".0",criterion.position_cd+".0",criterion.ppr_cd+".0",stageId,this.realTimeMode?1:0,measure.PARAM,this.encounterType];
scriptRequest.setParameterArray(sendAr);
scriptRequest.setComponent(this);
scriptRequest.setResponseHandler(this.loadMeasure.bind(this));
(function(s){window.setTimeout(function(){s.performRequest();
},1);
})(scriptRequest);
}this.finalizeComponent("<div style='height: 265px;top: 1156px;'> Loading... </div>");
MP_Util.LoadSpinner("mufxContent"+this.getStyles().m_componentId);
};
Mufx.prototype.loadMeasure=function(reply){this.replyMeasures.NUM_MEASURES++;
if((reply.m_responseData.MEASURES.length!=0)&&!(reply.m_responseData.MEASURES[0].DESC==="Clinical Summary"&&this.encounterType===1)){if(reply.m_responseData.STATUS_DATA.STATUS=="S"){var measures=this.replyMeasures.STAGES[reply.m_responseData.STAGE-1].MEASURES;
this.replyMeasures.MEASURES.push(reply.m_responseData.MEASURES[0]);
}if(reply.m_responseData.MSG!==""){this.replyMeasures.MSG=reply.m_responseData.MSG;
}if(this.replyMeasures.NUM_MEASURES==this.replyMeasures.STAGES[reply.m_responseData.STAGE-1].MEASURES.length){this.loadTimer.stop();
this.renderComponent();
this.replyMeasures.MEASURES=[];
this.replyMeasures.NUM_MEASURES=0;
}}};
Mufx.prototype.retrieveComponentData=function(){this.deferred.done(this.loadStage.bind(this,this.savedStage));
};
Mufx.prototype.subMeasures={pwComponent:{},pwPowerform:{},showMeasure:{},altMeasureDesc:{},measureLink:{},moduleLink:{}};
Mufx.prototype.replyMeasures={NUM_MEASURES:0,STAGES:{},MEASURES:[]};
Mufx.prototype.sprintf=function(format){var arg=arguments;
var i=1;
return format.replace(/%((%)|s)/g,function(m){return m[2]||arg[i++];
});
};
Mufx.prototype.processResultsForRender=function(reply){if($(".mu-buttonfilter").children().length<3){this.getRenderStrategy().addComponentSection(this.getRootComponentNode().firstChild,Mufx.prototype.generateButton());
}var criterion=this.getCriterion();
for(var i=0;
i<reply.MEASURES.length;
i++){var measure=reply.MEASURES[i];
var markup="";
var title="";
var refLink=this.subMeasures.measureLink[measure.REF_LINK]||"";
measure.measureDesc=this.subMeasures.altMeasureDesc[measure.TEXT]||measure.DESC;
var links=[];
if(this.subMeasures.moduleLink.hasOwnProperty(measure.MOD)){links.push(this.subMeasures.moduleLink[measure.MOD]);
}if(this.subMeasures.pwComponent.hasOwnProperty(measure.CP)){links.push(this.subMeasures.pwComponent[measure.CP]);
}if(this.subMeasures.pwPowerform.hasOwnProperty(measure.PF)){for(var j=0;
j<this.subMeasures.pwPowerform[measure.PF].length;
j++){links.push(this.subMeasures.pwPowerform[measure.PF][j]);
}}if(measure.MET){measure.MET_HTML="<span class='mufx-met-icon mufx-icon-prop'></span>";
measure.STATUS_HTML="<span>"+i18n.discernabu.Mufx.MET+"</span>";
}else{measure.MET_HTML="<span class='mufx-unmet-icon mufx-icon-prop'></span>";
measure.STATUS_HTML="<span>"+i18n.discernabu.Mufx.NOTMET+"</span>";
}if(!links.length){title="Not configured";
markup+="<a class='mu-measure-desc mufx-pwx-result-link' href='#' >"+measure.measureDesc+"</a>";
}else{if(links.length==1){title=links[0].desc;
markup+=this.sprintf(links[0].link,measure.DESC,measure.measureDesc);
}else{markup+="<a class='mu-measure-desc' href='#' > <span class='mufx-closedropdown-icon'></span>"+measure.measureDesc+"</a>";
for(var l=0;
l<links.length;
l++){title+=links[l].desc+"</br>";
markup+=links[l].altLink;
}}}markup+='<div class="mufx-tooltip mufx-hidden" >'+refLink+title+"</div>";
measure.DESC_HTML=markup;
}};
Mufx.prototype.renderComponent=function(){var renderTimer=new RTMSTimer(this.getComponentRenderTimerName(),this.getCriterion().category_mean);
renderTimer.start();
if(this.replyMeasures.MEASURES.length==0){HTMLString="<div class='mufx-nodata'>";
HTMLString+="<div class='mufx-nodata-icon' style='height:300px;'>";
HTMLString+="</div>";
HTMLString+="<p style='margin-top:-50px;'>"+i18n.discernabu.Mufx.NO_MEASURES_FOUND+"</p>";
HTMLString+="</div>";
this.finalizeComponent(HTMLString);
}else{var HTMLComponent="";
this.processResultsForRender(this.replyMeasures);
var docI18n=i18n.discernabu.Mufx;
var self=this;
if(this.replyMeasures.MSG){var ERROR_MSG=this.replyMeasures.MSG;
HTMLComponent="<div class='msg-info'><span class='spaces'></span><span>"+eval("i18n.discernabu.Mufx."+ERROR_MSG)+"</span></div><br>";
}var measuresTable=new ComponentTable();
var id=this.getStyles().getId();
measuresTable.setNamespace(id);
var measureColumn=new TableColumn();
measureColumn.setColumnId("Desc"+id);
measureColumn.setCustomClass("mufx-measurescol");
measureColumn.setColumnDisplay(docI18n.DESC);
measureColumn.setPrimarySortField("measureDesc");
measureColumn.setIsSortable(true);
measureColumn.setRenderTemplate("${DESC_HTML}");
var statusColumn=new TableColumn();
statusColumn.setColumnId("Status"+id);
statusColumn.setCustomClass("mufx-statuscol");
statusColumn.setColumnDisplay(docI18n.STATUS);
statusColumn.setPrimarySortField("STATUS_HTML");
statusColumn.setIsSortable(true);
statusColumn.setRenderTemplate("${STATUS_HTML}");
var iconColumn=new TableColumn();
iconColumn.setColumnId("icon"+id);
iconColumn.setCustomClass("mufx-iconcol");
iconColumn.setRenderTemplate("${MET_HTML}");
measuresTable.addColumn(iconColumn);
measuresTable.addColumn(measureColumn);
measuresTable.addColumn(statusColumn);
measuresTable.setCustomClass("mufx-measuresTable");
measuresTable.bindData(this.replyMeasures.MEASURES);
measuresTable.sortByColumnInDirection("Status"+id,TableColumn.SORT.DESCENDING);
this.setComponentTable(measuresTable);
HTMLComponent+=measuresTable.render();
this.finalizeComponent(HTMLComponent);
this.attachEventListeners();
CERN_EventListener.fireEvent(this,this,EventListener.EVENT_COUNT_UPDATE,{count:this.replyMeasures.MEASURES.length});
$("#mufx"+this.getComponentId()+"header").on("click",".sort-option",function(){self.attachEventListeners();
});
$(".mufx-filters, .mufx-filters-right").on("click",function(){var id=$(this).attr("data");
var measureCapTimer;
var showEle;
if(id=="mufx-met-icon"){measureCapTimer=new CapabilityTimer("CAP:MPG.MUFX.O1 - Met Measure Filter");
measureCapTimer.capture();
$(".mufx-unmet-icon").parents("dl").hide();
showEle=$("."+id).parents("dl");
}else{if(id=="mufx-unmet-icon"){measureCapTimer=new CapabilityTimer("CAP:MPG.MUFX.O1 - Not Met Measure Filter");
measureCapTimer.capture();
$(".mufx-met-icon").parents("dl").hide();
showEle=$("."+id).parents("dl");
}else{measureCapTimer=new CapabilityTimer("CAP:MPG.MUFX.O1 - All Measure Filter");
measureCapTimer.capture();
showEle=$("#mufx"+self.getComponentId()+"tableBody .result-info");
}}$(showEle).each(function(i,item){if((i%2)==0){$(item).removeClass("odd").addClass("even").show();
}else{$(item).removeClass("even").addClass("odd").show();
}});
$(".mufx-filters, .mufx-filters-right").removeClass("mufx-filters-selected");
$(this).addClass("mufx-filters-selected");
});
}renderTimer.stop();
};
Mufx.prototype.attachEventListeners=function(){$("#mufxContent"+this.getStyles().m_componentId+" .mu-measure-desc").on("click",function(e){var hasHiddenClass=$(this).parent().children(".mufx-powerform-links").hasClass("mufx-hidden");
$(this).find("span").toggleClass("mufx-closedropdown-icon mufx-opendropdown-icon");
if(hasHiddenClass){$(this).parents("dl").addClass("mufx-measures-active");
$(this).parent().children(".mufx-powerform-links").removeClass("mufx-hidden");
}else{$(this).parents("dl").removeClass("mufx-measures-active");
$(this).parent().children(".mufx-powerform-links").addClass("mufx-hidden");
}});
$("#mufxContent"+this.getStyles().m_componentId+" .mu-measure-desc").on("mouseenter",function(event){var tooltip=$(this).siblings(".mufx-tooltip");
$(tooltip).removeClass("mufx-hidden");
$(tooltip).css({top:$(this).position().top+$(this).height()/2-$(tooltip).height()/2,left:$(this).position().left+$(this).width()+10});
});
$("#mufxContent"+this.getStyles().m_componentId+" .mu-measure-desc").on("mouseleave",function(event){var tooltipEle=$(this).siblings(".mufx-tooltip");
var timeoutId=setTimeout(function(){$(tooltipEle).addClass("mufx-hidden");
},100);
$(tooltipEle).data("timeoutId",timeoutId);
});
$("#mufxContent"+this.getStyles().m_componentId+" .mufx-tooltip").on("mouseenter",function(event){clearTimeout($(this).data("timeoutId"));
});
$("#mufxContent"+this.getStyles().m_componentId+" .mufx-tooltip").on("mouseleave",function(event){$(this).addClass("mufx-hidden");
});
$(".mufx-filters-selected").trigger("click");
};
Mufx.prototype.generateButton=function(){var HTMLComponent="<div class='mu-buttonfilter'><button align='right' data='mu-measures' class='mufx-filters-right mufx-filters-selected mufx-pull-right'>"+i18n.discernabu.Mufx.ALL+"</button>";
HTMLComponent+="<button align='right' data='mufx-unmet-icon' class='mufx-filters mufx-pull-right '>"+i18n.discernabu.Mufx.NOTMET+"</button>";
HTMLComponent+="<button align='right' data='mufx-met-icon' class='mufx-filters  mufx-pull-right '>"+i18n.discernabu.Mufx.MET+"</button></div>";
return HTMLComponent;
};
MP_Util.setObjectDefinitionMapping("WF_MUFX",Mufx);