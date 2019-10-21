function EducationAndCounselingComponentWFStyle(){this.initByNamespace("ec-wf");
}EducationAndCounselingComponentWFStyle.inherits(ComponentStyle);
function EducationAndCounselingComponentWF(criterion){this.setCriterion(criterion);
this.setStyles(new EducationAndCounselingComponentWFStyle());
this.setComponentLoadTimerName("USR:MPG.EDUCATIONANDCOUNSELING.O2 - load component");
this.setComponentRenderTimerName("ENG:MPG.EDUCATIONANDCOUNSELING.O2 - render component");
this.setIncludeLineNumber(false);
this.eduCounselingPFId=0;
this.firstTrimesterCollapsed=false;
this.secondTrimester1Colapsed=false;
this.thirdTrimesterCollapsed=false;
this.setPregnancyLookbackInd(true);
this.setResourceRequired(true);
CERN_EventListener.addListener(this,EventListener.EVENT_CLINICAL_EVENT,this.retrieveComponentData,this);
CERN_EventListener.addListener(this,"pregnancyInfoAvailable",this.retrieveComponentData,this);
}EducationAndCounselingComponentWF.prototype=new MPageComponent();
EducationAndCounselingComponentWF.prototype.constructor=MPageComponent;
MP_Util.setObjectDefinitionMapping("WF_PREG_EC",EducationAndCounselingComponentWF);
EducationAndCounselingComponentWF.prototype.RetrieveRequiredResources=function(){var pregInfoSR=MP_Resources.getSharedResource("pregnancyInfo");
if(pregInfoSR&&pregInfoSR.isResourceAvailable()){this.retrieveComponentData();
}else{PREGNANCY_BASE_UTIL_O1.LoadPregnancyData(this.getCriterion());
}};
EducationAndCounselingComponentWF.prototype.setEdCounselingPF=function(powerFormId){this.eduCounselingPFId=powerFormId;
};
EducationAndCounselingComponentWF.prototype.setFirstTrimesterState=function(collapse){this.firstTrimesterCollapsed=collapse;
};
EducationAndCounselingComponentWF.prototype.setSecondTrimesterState=function(collapse){this.secondTrimesterCollapsed=collapse;
};
EducationAndCounselingComponentWF.prototype.setThirdTrimesterState=function(collapse){this.thirdTrimesterCollapsed=collapse;
};
EducationAndCounselingComponentWF.prototype.loadFilterMappings=function(){this.addFilterMappingObject("WF_PREG_EC_PF",{setFunction:this.setEdCounselingPF,type:"NUMBER",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("WF_PREG_EC_TRIMESTER1_DISPLAY",{setFunction:this.setFirstTrimesterState,type:"BOOLEAN",field:"FREETEXT_DESC"});
this.addFilterMappingObject("WF_PREG_EC_TRIMESTER2_DISPLAY",{setFunction:this.setSecondTrimesterState,type:"BOOLEAN",field:"FREETEXT_DESC"});
this.addFilterMappingObject("WF_PREG_EC_TRIMESTER3_DISPLAY",{setFunction:this.setThirdTrimesterState,type:"BOOLEAN",field:"FREETEXT_DESC"});
};
EducationAndCounselingComponentWF.prototype.openTab=function(){var criterion=this.getCriterion();
var powerFormId=(this.eduCounselingPFId)?this.eduCounselingPFId:0;
var paramString=criterion.person_id+"|"+criterion.encntr_id+"|"+powerFormId+"|0|0";
MPAGES_EVENT("POWERFORM",paramString);
CERN_EventListener.fireEvent(null,this,EventListener.EVENT_CLINICAL_EVENT);
};
EducationAndCounselingComponentWF.prototype.retrieveComponentData=function(){var component=this;
var sendAr=[];
var criterion=component.getCriterion();
var educationAndCounselingi18n=i18n.discernabu.education_counseling_o2;
var encntrs=criterion.getPersonnelInfo().getViewableEncounters();
var encntrVal=(encntrs)?"value("+encntrs+")":"0.0";
var firstTrimesterES="0.0";
var groups=null;
var secondTrimesterES="0.0";
var thirdTrimesterES="0.0";
var groupIndex=0;
var groupLength=0;
var countText="";
var pregInfoSR=MP_Resources.getSharedResource("pregnancyInfo");
var pregInfoObj=null;
var pregnancyId=0;
var patientGenderInfo=criterion.getPatientInfo().getSex();
if(patientGenderInfo===null||patientGenderInfo.meaning===null||patientGenderInfo.meaning!=="FEMALE"){messageHTML="<h3 class='info-hd'><span class='res-normal'>"+educationAndCounselingi18n.NOT_FEMALE+"</span></h3><span class='res-none'>"+educationAndCounselingi18n.NOT_FEMALE+"</span>";
this.finalizeComponent(messageHTML,countText);
return;
}else{if(pregInfoSR&&pregInfoSR.isResourceAvailable()){pregInfoObj=pregInfoSR.getResourceData();
pregnancyId=pregInfoObj.getPregnancyId();
if(pregnancyId===-1){messageHTML="<h3 class='info-hd'><span class='res-normal'>"+educationAndCounselingi18n.PREG_DATA_ERROR+"</span></h3><span class='res-none'>"+educationAndCounselingi18n.PREG_DATA_ERROR+"</span>";
this.finalizeComponent(messageHTML,countText);
return;
}else{if(!pregnancyId){messageHTML="<h3 class='info-hd'><span class='res-normal'>"+educationAndCounselingi18n.NO_ACTIVE_PREG+"</span></h3><span class='res-none'>"+educationAndCounselingi18n.NO_ACTIVE_PREG+"</span>";
this.finalizeComponent(messageHTML,countText);
return;
}else{groups=component.getGroups();
groupLength=(groups!==null)?groups.length:0;
for(groupIndex=0;
groupIndex<groupLength;
groupIndex++){if(groupIndex===0){firstTrimesterES=MP_Util.CreateParamArray(groups[0].getEventSets(),1);
}else{if(groupIndex===1){secondTrimesterES=MP_Util.CreateParamArray(groups[1].getEventSets(),1);
}else{thirdTrimesterES=MP_Util.CreateParamArray(groups[2].getEventSets(),1);
}}}sendAr.push("^MINE^",criterion.person_id+".0",criterion.provider_id+".0",encntrVal,firstTrimesterES,secondTrimesterES,thirdTrimesterES,criterion.ppr_cd+".0",pregInfoObj.getLookBack());
MP_Core.XMLCclRequestWrapper(this,"MP_PREG_ED_COUNSELINGS",sendAr,true);
}}}}};
EducationAndCounselingComponentWF.prototype.renderComponent=function(recordData){var timerRenderComponent=MP_Util.CreateTimer(this.getComponentRenderTimerName(),this.getCriterion().category_mean);
var component=this;
var compId=this.getComponentId();
var criterion=this.getCriterion();
var educationAndCounselingi18n=i18n.discernabu.education_counseling_o2;
var eduCounselingCompletedArrayLength=recordData.COMPLETED.length;
var slaTimer=MP_Util.CreateTimer("CAP:MPG.EDUCATIONANDCOUNSELING.O2 - rendering component");
if(slaTimer){slaTimer.SubtimerName=criterion.category_mean;
slaTimer.Stop();
}try{var completedArray=null;
var completedEventCount=null;
var categoryResultsArray=null;
var documentedDate=null;
var eduCounsHTML="";
var arrTrimester=[];
var isTrimesterResultsDocumented=false;
var eduCounsTable=null;
var eduTopicColumn=null;
var resultColumn=null;
var dateDocumentedColumn=null;
var trimester1=null;
var trimester2=null;
var trimester3=null;
var trimester1Hdr=educationAndCounselingi18n.FIRST_TRIMESTER;
var trimester2Hdr=educationAndCounselingi18n.SECOND_TRIMESTER;
var trimester3Hdr=educationAndCounselingi18n.THIRD_TRIMESTER;
for(var i=0;
i<eduCounselingCompletedArrayLength;
i++){completedArray=recordData.COMPLETED[i];
completedEventCount=completedArray.LEVENTCNT;
arrTrimester[i]=[];
if(completedEventCount!==0){isTrimesterResultsDocumented=true;
for(var j=0;
j<completedEventCount;
j++){categoryResultsArray=completedArray.CATEGORYRESULTS[j];
documentedDate=this.getFormattedDateTime(categoryResultsArray.SEVENTDATE);
arrTrimester[i].push({EducationTopic:categoryResultsArray.SEVENTDISPLAY,Result:categoryResultsArray.SEVENTRESULT,DocumentedDate:documentedDate});
}}}if(isTrimesterResultsDocumented){eduCounsTable=new ComponentTable();
eduCounsTable.setNamespace(this.getStyles().getNameSpace());
eduCounsTable.setZebraStripe(true);
eduTopicColumn=new TableColumn();
eduTopicColumn.setColumnId("EduName"+compId);
eduTopicColumn.setCustomClass("ec-wf-table-header-column");
eduTopicColumn.setColumnDisplay(educationAndCounselingi18n.EDUCATION_TOPIC);
eduTopicColumn.setRenderTemplate("${EducationTopic}");
resultColumn=new TableColumn();
resultColumn.setColumnId("Result"+compId);
resultColumn.setCustomClass("ec-wf-table-header-column");
resultColumn.setColumnDisplay(educationAndCounselingi18n.RESULTS);
resultColumn.setRenderTemplate("${Result}");
dateDocumentedColumn=new TableColumn();
dateDocumentedColumn.setColumnId("DateDocumented"+compId);
dateDocumentedColumn.setCustomClass("ec-wf-table-header-column");
dateDocumentedColumn.setColumnDisplay(educationAndCounselingi18n.DATE_DOCUMENTED);
dateDocumentedColumn.setRenderTemplate("${DocumentedDate}");
eduCounsTable.addColumn(eduTopicColumn);
eduCounsTable.addColumn(resultColumn);
eduCounsTable.addColumn(dateDocumentedColumn);
trimester1=new TableGroup();
trimester1.setDisplay(trimester1Hdr).setGroupId("EDU_COUNS1"+compId).setShowCount(false);
trimester1.bindData(arrTrimester[0]);
trimester2=new TableGroup();
trimester2.setDisplay(trimester2Hdr).setGroupId("EDU_COUNS2"+compId).setShowCount(false);
trimester2.bindData(arrTrimester[1]);
trimester3=new TableGroup();
trimester3.setDisplay(trimester3Hdr).setGroupId("EDU_COUNS3"+compId).setShowCount(false);
trimester3.bindData(arrTrimester[2]);
eduCounsTable.addGroup(trimester1);
eduCounsTable.addGroup(trimester2);
eduCounsTable.addGroup(trimester3);
this.setComponentTable(eduCounsTable);
eduCounsHTML=eduCounsTable.render();
this.finalizeComponent(eduCounsHTML,"");
if(this.firstTrimesterCollapsed){eduCounsTable.collapseGroup("EDU_COUNS1"+compId);
}if(this.secondTrimesterCollapsed){eduCounsTable.collapseGroup("EDU_COUNS2"+compId);
}if(this.thirdTrimesterCollapsed){eduCounsTable.collapseGroup("EDU_COUNS3"+compId);
}if(!arrTrimester[0].length){$("#ec-wf\\:EDU_COUNS1"+compId+"\\:content").addClass("ec-wf-table-section-content");
}if(!arrTrimester[1].length){$("#ec-wf\\:EDU_COUNS2"+compId+"\\:content").addClass("ec-wf-table-section-content");
}if(!arrTrimester[2].length){$("#ec-wf\\:EDU_COUNS3"+compId+"\\:content").addClass("ec-wf-table-section-content");
}}else{eduCounsHTML="<span class='res-none'>"+educationAndCounselingi18n.NO_RESULTS_FOUND+"</span>";
this.finalizeComponent(eduCounsHTML,"");
}}catch(err){MP_Util.LogJSError(err,this,"education-counseling-o2.js","renderComponent");
if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}};
EducationAndCounselingComponentWF.prototype.getFormattedDateTime=function(dateTime){if(!dateTime){return"--";
}var dateTimeObj=new Date();
dateTimeObj.setISO8601(dateTime);
return dateFormat(dateTimeObj,dateFormat.masks.mediumDate);
};