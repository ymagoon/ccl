function BhAssessmentComponentStyle(){this.initByNamespace("bhas");
}BhAssessmentComponentStyle.inherits(ComponentStyle);
function BhAssessmentComponent(criterion){this.m_isEventSetInfo=true;
this.m_isComment=true;
this.setCriterion(criterion);
this.setLookBackDropDown(true);
this.setStyles(new BhAssessmentComponentStyle());
this.setIncludeLineNumber(false);
this.m_iViewAdd=false;
this.m_displayBH=false;
this.m_displayFX=false;
this.m_displayCOG=false;
this.m_displayOTHER=false;
this.setComponentLoadTimerName("USR:MPG.BhAssessment.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.BhAssessment.O1 - render component");
this.bhasLen=0;
this.m_evtSetSectionAr=[];
this.ar=[];
this.count=0;
this.asI18n=i18n.discernabu.bh_assessment_o1;
}BhAssessmentComponent.prototype=new MPageComponent();
BhAssessmentComponent.prototype.constructor=MPageComponent;
BhAssessmentComponent.prototype.setDisplayBH=function(displayBH){if(typeof displayBH!="boolean"){throw new Error("setDisplayBH: Invalid displayBH");
}else{this.m_displayBH=displayBH;
}};
BhAssessmentComponent.prototype.getDisplayBH=function(){return(this.m_displayBH);
};
BhAssessmentComponent.prototype.setDisplayFX=function(DisplayFX){if(typeof DisplayFX!="boolean"){throw new Error("setDisplayFX: Invalid DisplayFX");
}else{this.m_displayFX=DisplayFX;
}};
BhAssessmentComponent.prototype.getDisplayFX=function(){return(this.m_displayFX);
};
BhAssessmentComponent.prototype.setDisplayCOG=function(DisplayCOG){if(typeof DisplayCOG!="boolean"){throw new Error("setDisplayCOG: Invalid DisplayCOG");
}else{this.m_displayCOG=DisplayCOG;
}};
BhAssessmentComponent.prototype.getDisplayCOG=function(){return(this.m_displayCOG);
};
BhAssessmentComponent.prototype.setDisplayOTHER=function(DisplayOTHER){if(typeof DisplayOTHER!="boolean"){throw new Error("setDisplayOTHER: Invalid DisplayOTHER");
}else{this.m_displayOTHER=DisplayOTHER;
}};
BhAssessmentComponent.prototype.getDisplayOTHER=function(){return(this.m_displayOTHER);
};
BhAssessmentComponent.prototype.setIViewAdd=function(iViewAdd){if(typeof iViewAdd!="boolean"){throw new Error("setIViewAdd: Invalid iViewAdd");
}else{this.m_iViewAdd=iViewAdd;
}};
BhAssessmentComponent.prototype.isIViewAdd=function(){return(this.m_iViewAdd);
};
BhAssessmentComponent.prototype.openTab=function(){var paramString=criterion.person_id+"|"+criterion.encntr_id+"|"+0+"|0|0";
MP_Util.LogMpagesEventInfo(this,"POWERFORM",paramString,"bhassessment.js","openTab");
MPAGES_EVENT("POWERFORM",paramString);
CERN_EventListener.fireEvent(null,this,EventListener.EVENT_CLINICAL_EVENT,"BhAssessment");
};
BhAssessmentComponent.prototype.openDropDown=function(formID){var criterion=this.getCriterion();
var paramString=criterion.person_id+"|"+criterion.encntr_id+"|"+formID+"|0|0";
MP_Util.LogMpagesEventInfo(this,"POWERFORM",paramString,"bhassessment.js","openDropDown");
MPAGES_EVENT("POWERFORM",paramString);
CERN_EventListener.fireEvent(null,this,EventListener.EVENT_CLINICAL_EVENT,"BhAssessment");
};
BhAssessmentComponent.prototype.openIView=function(){var criterion=this.getCriterion();
var bandName="";
var sectionName="";
var itemName="";
var paramString="'"+bandName+"','"+sectionName+"','"+itemName+"',"+criterion.person_id+".0,"+criterion.encntr_id+".0";
MP_Util.LogMpagesEventInfo(this,"IVIEW",paramString,"bhassessment.js","openIView");
try{var launchIViewApp=window.external.DiscernObjectFactory("TASKDOC");
launchIViewApp.LaunchIView(bandName,sectionName,itemName,criterion.person_id+".0",criterion.encntr_id+".0");
CERN_EventListener.fireEvent(null,this,EventListener.EVENT_CLINICAL_EVENT,"BhAssessment");
}catch(err){MP_Util.LogJSError(err,null,"bhassessment.js","openIView");
}};
BhAssessmentComponent.prototype.loadFilterMappings=function(){this.addFilterMappingObject("BH_ASSESS",{setFunction:this.setDisplayBH,type:"BOOLEAN",field:"FREETEXT_DESC"});
this.addFilterMappingObject("FX_ASSESS",{setFunction:this.setDisplayFX,type:"BOOLEAN",field:"FREETEXT_DESC"});
this.addFilterMappingObject("COG_ASSESS",{setFunction:this.setDisplayCOG,type:"BOOLEAN",field:"FREETEXT_DESC"});
this.addFilterMappingObject("OTHER_ASSESS",{setFunction:this.setDisplayOTHER,type:"BOOLEAN",field:"FREETEXT_DESC"});
this.addFilterMappingObject("BH_CHART",{setFunction:this.setIViewAdd,type:"BOOLEAN",field:"FREETEXT_DESC"});
};
BhAssessmentComponent.prototype.startComponentDataRetrieval=function(){if(this.isResourceRequired()){this.RetrieveRequiredResources();
}else{this.ar=[];
this.count=0;
this.retrieveComponentData();
}};
BhAssessmentComponent.prototype.getActiveGroups=function(){var Grps=this.getGroups();
var activeGrps=[];
for(var i=0;
i<Grps.length;
i++){if(this.displayGroup(this,Grps[i])){activeGrps.push(Grps[i]);
}}return activeGrps;
};
BhAssessmentComponent.prototype.retrieveComponentData=function(){var groups=this.getActiveGroups();
if(groups&&groups.length>0){var eventSetsAr=[];
var eventCodesAr=[];
this.m_evtSetSectionAr=[];
for(var x=0,xl=groups.length;
x<xl;
x++){var tmpEventSetAr=[];
var tmpEventCodeAr=[];
var group=groups[x];
if(group instanceof MPageEventSetGroup){var currGrpEventSets=group.getEventSets();
tmpEventSetAr=eventSetsAr.concat(currGrpEventSets);
eventSetsAr=tmpEventSetAr.slice();
for(var i=0,i1=currGrpEventSets.length;
i<i1;
i++){var nextEleIndx=this.m_evtSetSectionAr.length;
this.m_evtSetSectionAr[nextEleIndx]=[];
this.m_evtSetSectionAr[nextEleIndx][0]=currGrpEventSets[i];
this.m_evtSetSectionAr[nextEleIndx][1]=x;
}}else{if(group instanceof MPageEventCodeGroup){tmpEventCodeAr=eventCodesAr.concat(group.getEventCodes());
eventCodesAr=tmpEventCodeAr.slice();
}else{if(group instanceof MPageSequenceGroup){var mapItems=group.getMapItems();
tmpEventSetAr=eventSetsAr.concat(MP_Util.GetValueFromArray("CODE_VALUE",mapItems));
eventSetsAr=tmpEventSetAr.slice();
}else{if(group instanceof MPageGrouper){var grps=group.getGroups();
var evtCode=[];
for(var y=0,yl=grps.length;
y<yl;
y++){if(grps[y] instanceof MPageEventCodeGroup){evtCode=evtCode.concat(grps[y].getEventCodes());
}}tmpEventCodeAr=eventCodesAr.concat(evtCode);
eventCodesAr=tmpEventCodeAr.slice();
}else{continue;
}}}}}var criterion=this.getCriterion();
var sBeginDate="^^";
var sEndDate="^^";
var esInfo=(this.m_isEventSetInfo)?1:0;
var commentInfo=(this.m_isComment)?1:0;
var sendAr=[];
var request=null;
var sEncntr=(this.getScope()===2)?criterion.encntr_id+".0":"0.0";
var sEventSets="0.0";
var sEventCodes="0.0";
sEventSets=MP_Util.CreateParamArray(eventSetsAr,1);
sEventCodes=MP_Util.CreateParamArray(eventCodesAr,1);
sendAr.push("^MINE^",criterion.person_id+".0",sEncntr,criterion.provider_id+".0",criterion.ppr_cd+".0",1,"^^",sEventSets,sEventCodes,this.getLookbackUnits(),this.getLookbackUnitTypeFlag(),esInfo,sBeginDate,sEndDate,commentInfo);
var programName="MP_RETRIEVE_N_RESULTS_JSON";
var loadTimer=new RTMSTimer(this.getComponentLoadTimerName());
var renderTimer=new RTMSTimer(this.getComponentRenderTimerName());
var scriptRequest=new ComponentScriptRequest();
scriptRequest.setProgramName(programName);
scriptRequest.setParameterArray(sendAr);
scriptRequest.setComponent(this);
scriptRequest.setLoadTimer(loadTimer);
scriptRequest.setRenderTimer(renderTimer);
scriptRequest.performRequest();
}};
BhAssessmentComponent.prototype.LoadMeasurementDataMap=function(recordData,personnelArray,codeArray,sortOption){var mapObjects=[];
var results=recordData.RESULTS;
if(!codeArray){codeArray=MP_Util.LoadCodeListJSON(recordData.CODES);
}if(!personnelArray){personnelArray=MP_Util.LoadPersonelListJSON(recordData.PRSNL);
}for(var i=0,il=results.length;
i<il;
i++){var result=results[i];
if(result.CLINICAL_EVENTS.length>0){for(var j=0,jl=result.CLINICAL_EVENTS.length;
j<jl;
j++){var measureArray=[];
var mapObject=null;
if(result.EVENT_CD>0){mapObject=new MP_Core.MapObject(result.EVENT_CD,measureArray);
}else{mapObject=new MP_Core.MapObject(result.EVENT_SET_CD,measureArray);
}var meas=result.CLINICAL_EVENTS[j];
for(var k=0,kl=meas.MEASUREMENTS.length;
k<kl;
k++){var measurement=new MP_Core.Measurement();
measurement.initFromRec(meas.MEASUREMENTS[k],codeArray);
measureArray.push(measurement);
}if(measureArray.length>0){if(sortOption){measureArray.sort(sortOption);
}else{measureArray.sort(this.sortByEffectiveDateDesc);
}mapObjects.push(mapObject);
}}}}return mapObjects;
};
BhAssessmentComponent.prototype.sortByEffectiveDateDesc=function(a,b){if(a.getDateTime()>b.getDateTime()){return -1;
}else{if(a.getDateTime()<b.getDateTime()){return 1;
}}return 0;
};
BhAssessmentComponent.prototype.renderComponent=function(reply){try{var renderGrps=this.populateSubSections(reply);
for(var ind=0,ind1=renderGrps.length;
ind<ind1;
ind++){this.ar.push(renderGrps[ind]);
}var content=[];
content.push("<div class ='",MP_Util.GetContentClass(this,this.bhasLen),"'>",this.ar.join(""),"</div>");
sHTML=content.join("");
var countText=MP_Util.CreateTitleText(this,this.bhasLen);
this.finalizeComponent(sHTML,countText);
}catch(err){MP_Util.LogJSError(err,this,"bhassessment.js","renderComponent");
throw (err);
}};
BhAssessmentComponent.prototype.populateSubSections=function(recordData){var renGroups=this.getActiveGroups();
var subSection=[];
var subHTML=[];
var x=0;
var xl=0;
var codeArray=MP_Util.LoadCodeListJSON(recordData.CODES);
var personnelArray=MP_Util.LoadPersonelListJSON(recordData.PRSNL);
var measureArray=this.LoadMeasurementDataMap(recordData,personnelArray,codeArray);
var df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
var measLen=measureArray.length;
this.bhasLen=this.bhasLen+measLen;
var measLenGrp=[];
if(measLen>0){for(x=0,xl=measLen;
x<xl;
x++){for(var index1=0,indexLimit1=this.m_evtSetSectionAr.length;
index1<indexLimit1;
index1++){if(this.m_evtSetSectionAr[index1][0]===measureArray[x].name){var ind=this.m_evtSetSectionAr[index1][1];
if(isNaN(measLenGrp[ind])===true){measLenGrp[ind]=0;
}measLenGrp[ind]=measLenGrp[ind]+1;
break;
}}}}for(var j=0,j1=renGroups.length;
j<j1;
j++){var subSectionText=this.groupDisplayName(renGroups[j])+" ("+measLenGrp[j]+")";
subSection[j]=[];
subSection[j].push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='Collapse'>-</span><span class='sub-sec-title'>"+subSectionText+"</span></h3>");
}if(measLen>0){for(x=0,xl=measLen;
x<xl;
x++){var measObject=measureArray[x].value[0];
var display=measObject.getEventCode().display;
for(var index2=0,indexLimit2=this.m_evtSetSectionAr.length;
index2<indexLimit2;
index2++){if(this.m_evtSetSectionAr[index2][0]===measureArray[x].name){var ind1=this.m_evtSetSectionAr[index2][1];
var result=MP_Util.Measurement.GetNormalcyResultDisplay(measObject);
var status=measObject.getStatus().display;
var oDate=measObject.getDateTime();
var sDate=(oDate)?df.format(oDate,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR):"";
var sDateHover=(oDate)?df.format(oDate,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR):"";
subSection[ind1].push("<div class='sub-sec-content'><div class='content-body'><dl class='result-info bhas-info'><dt >","<dd><span class='bhas-name'>",display,"</span><span class='bhas-res'>",result,"</span><span class='bhas-dt'>",sDate,"</span></dd></dt>","</dl>","<div class='result-details'><h4 class='det-hd'>",this.asI18n.ASSESSMENT_DETAILS,"</h4>","<dl>","<dt><span>",display,":</span></dt>","<dd><span>",result,"</span></dd>","<dt><span>",this.asI18n.RESULT_DT_TM,":</span></dt>","<dd><span>",sDateHover,"</span></dd>","<dt><span>",this.asI18n.STATUS,":</span></dt>","<dd><span>",status,"</span></dd>","</dl>","</div></div></div>");
break;
}}}}for(var k=0,k1=renGroups.length;
k<k1;
k++){subSection[k].push("</div>");
subHTML[k]=subSection[k].join("");
}return subHTML;
};
BhAssessmentComponent.prototype.displayGroup=function(component,group){var displayGroupInd=false;
switch(group.getGroupName()){case"BH_RSLTS":displayGroupInd=component.getDisplayBH();
break;
case"FX_RSLTS":displayGroupInd=component.getDisplayFX();
break;
case"COG_RSLTS":displayGroupInd=component.getDisplayCOG();
break;
case"OTHER_RSLTS":displayGroupInd=component.getDisplayOTHER();
break;
default:displayGroupInd=false;
break;
}return(displayGroupInd);
};
BhAssessmentComponent.prototype.groupDisplayName=function(group){var groupDisplayStr="";
switch(group.getGroupName()){case"BH_RSLTS":groupDisplayStr=this.asI18n.BH_RSLTS;
break;
case"FX_RSLTS":groupDisplayStr=this.asI18n.FX_RSLTS;
break;
case"COG_RSLTS":groupDisplayStr=this.asI18n.COG_RSLTS;
break;
case"OTHER_RSLTS":groupDisplayStr=this.asI18n.OTHER_RSLTS;
break;
default:groupDisplayStr="";
break;
}return groupDisplayStr;
};
MP_Util.setObjectDefinitionMapping("BH_ASSESSMENTS",BhAssessmentComponent);