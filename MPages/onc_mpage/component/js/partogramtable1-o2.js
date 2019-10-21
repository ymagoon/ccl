function PartoTable1StyleWF(){this.initByNamespace("parto-table1-wf");
}PartoTable1StyleWF.inherits(ComponentStyle);
function PartoTable1ComponentWF(criterion){this.setCriterion(criterion);
this.setStyles(new PartoTable1StyleWF());
this.setComponentLoadTimerName("USR:MPG.PARTOTABLE1.O2 - load component");
this.setComponentRenderTimerName("ENG:MPG.PARTOTABLE1.O2 - render component");
this.imageFolderPath=this.getCriterion().static_content+"/images/";
this.tableSectionFlag=1;
this.recordData=null;
this.setRefreshEnabled(false);
this.setResourceRequired(true);
this.componentID=null;
this.loadTimer=null;
}PartoTable1ComponentWF.prototype=new MPageComponent();
PartoTable1ComponentWF.prototype.constructor=MPageComponent;
MP_Util.setObjectDefinitionMapping("WF_PARTO_TABLE1",PartoTable1ComponentWF);
PartoTable1ComponentWF.prototype.retrieveComponentData=function(){var criterion=this.getCriterion();
if(PartogramBaseComponent.prototype.getPartogramViewID()!==criterion.category_mean){var messageHTML="<span class='res-none'>"+i18n.discernabu.partogrambaseutil_o2.NOT_PARTOGRAM_VIEW+"</span>";
this.finalizeComponent(messageHTML,"");
return;
}this.loadTimer=new RTMSTimer(this.getComponentLoadTimerName());
var renderTimer=new RTMSTimer(this.getComponentRenderTimerName());
var groups=this.getGroups();
var groupsLength=groups.length;
if(groupsLength>0){var sendAr=[];
var partogramInfoSR=MP_Resources.getSharedResource("partogramInfo");
var partogramStartDate=partogramInfoSR.getResourceData().getPartogramStartDate();
partogramStartDate=MP_Util.CreateDateParameter(partogramStartDate);
sendAr.push("^MINE^",criterion.person_id+".0",criterion.provider_id+".0",criterion.position_cd+".0",criterion.ppr_cd+".0",this.tableSectionFlag);
for(var i=0;
i<groups.length;
i++){var group=groups[i];
if(group instanceof MPageEventCodeGroup){sendAr.push(MP_Util.CreateParamArray(group.getEventCodes(),1));
}}sendAr.push(criterion.encntr_id+".0");
sendAr.push("^"+partogramStartDate+"^");
var scriptRequest=new ComponentScriptRequest();
scriptRequest.setProgramName("MP_GET_PARTOGRAM_TABLE");
scriptRequest.setParameterArray(sendAr);
scriptRequest.setComponent(this);
scriptRequest.setLoadTimer(this.loadTimer);
scriptRequest.setRenderTimer(renderTimer);
scriptRequest.performRequest();
}else{var noEventCodeMappedMessage="<span class='res-none'>"+i18n.discernabu.partogrambaseutil_o2.NOT_CONFIGURED_BEDROCK_ERR+"</span>";
this.finalizeComponent(noEventCodeMappedMessage,"");
}};
PartoTable1ComponentWF.prototype.getImageFolderPath=function(){return this.imageFolderPath;
};
PartoTable1ComponentWF.prototype.renderComponent=function(recordData){this.recordData=recordData;
var renderingCAPTimer=new CapabilityTimer("CAP:MPG.PARTOGRAMTAB1.O2 - rendering component",this.getCriterion().category_mean);
if(renderingCAPTimer){renderingCAPTimer.capture();
}var recordDataLength=recordData.QUAL.length,i,resultsCount=0,unit;
for(i=0;
i<recordDataLength;
i++){unit=recordData.QUAL[i];
resultsCount+=unit.TABLE_DATA.length+unit.DYNAMIC_LIST.length;
}this.loadTimer.addMetaData("component.resultcount",resultsCount);
PARTO_TABLE_BASE.renderTableSection(this);
this.componentID=this.getStyles().getId();
$("#"+this.componentID).css("margin-bottom",PARTO_GRAPH_BASE.getComponentBottomPadding());
};
PartoTable1ComponentWF.prototype.postProcessing=function(){if(this.recordData!=null&&this.recordData.STATUS_DATA.STATUS==="S"){PARTO_GRAPH_BASE.addTimeScaleButtons(this.componentID);
PARTO_TABLE_BASE.addPartogramTableAttributes(this.componentID);
}};
PartoTable1ComponentWF.prototype.resizeComponent=function(){if(this.recordData!=null&&this.recordData.STATUS_DATA.STATUS==="S"){PARTO_TABLE_BASE.setFlowSheetTableDimensions(this.componentID);
PARTO_TABLE_BASE.displayCurrentTimeBar(this.componentID);
}};
PartoTable1ComponentWF.prototype.RetrieveRequiredResources=function(){if(PartogramBaseComponent.prototype.getPartogramViewID()!==this.getCriterion().category_mean){var messageHTML="<span class='res-none'>"+i18n.discernabu.partogrambaseutil_o2.NOT_PARTOGRAM_VIEW+"</span>";
this.finalizeComponent(messageHTML,"");
return;
}var partogramInfoSR=MP_Resources.getSharedResource("partogramInfo");
if(partogramInfoSR&&partogramInfoSR.isResourceAvailable()&&!jQuery.isEmptyObject(partogramInfoSR.getResourceData())){this.retrieveComponentData();
}else{CERN_EventListener.addListener(this,"partogramInfoAvailable",this.retrieveComponentData,this);
}};
PartoTable1ComponentWF.prototype.postDOMLocationChange=function(){if(this.recordData!=null&&this.recordData.STATUS_DATA.STATUS==="S"){var uniqueComp=$("#"+this.componentID+"resultsTabletable");
var currentLeft=uniqueComp.scrollLeft();
if(parseInt(PARTO_TABLE_BASE.scrollLeft)!=currentLeft){uniqueComp.scrollLeft(PARTO_TABLE_BASE.scrollLeft);
}}};