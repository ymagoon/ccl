function PregAssessment3Style(){this.initByNamespace("pa3");
}PregAssessment3Style.inherits(ComponentStyle);
function PregAssessment3Component(criterion){this.setCriterion(criterion);
this.setStyles(new PregAssessment3Style());
this.setIncludeLineNumber(true);
this.setComponentLoadTimerName("USR:MPG.PREGASSESSMENT3.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.PREGASSESSMENT3.O1 - render component");
this.setResourceRequired(true);
PregAssessment3Component.method("InsertData",function(){CERN_PREG_ASSESSMENT3_O1.GetPregAssessment3Data(this);
});
PregAssessment3Component.method("HandleSuccess",function(recordData){CERN_PREG_ASSESSMENT_BASE_O1.RenderAssessmentSection(this,recordData,3);
});
PregAssessment3Component.method("RetrieveRequiredResources",function(){var patientGenderInfo=criterion.getPatientInfo().getSex();
var pai18n=i18n.discernabu.pregassessmentbase;
if(patientGenderInfo===null){messageHTML="<h3 class='info-hd'><span class='res-normal'>"+pai18n.GENDER_UNDEFINED+"</span></h3><span class='res-none'>"+pai18n.GENDER_UNDEFINED+"</span>";
MP_Util.Doc.FinalizeComponent(messageHTML,this,"(0)");
return;
}var pregInfoObj=null;
pregInfoObj=MP_Resources.getSharedResource("pregnancyInfo");
if(pregInfoObj&&pregInfoObj.isResourceAvailable()){this.InsertData();
}else{PREGNANCY_BASE_UTIL_O1.LoadPregnancyData(this.getCriterion());
}});
PregAssessment3Component.method("setAntepartumNote3",function(value){this.m_antepartumNote3=value;
});
PregAssessment3Component.method("getAntepartumNote3",function(){return this.m_antepartumNote3;
});
CERN_EventListener.addListener(this,"pregnancyInfoAvailable",this.InsertData,this);
}PregAssessment3Component.inherits(MPageComponent);
var CERN_PREG_ASSESSMENT3_O1=function(){function updateComponentMenu(component){var compId=component.getComponentId();
var criterion=component.getCriterion();
var pai18n=i18n.discernabu.pregassessmentbase;
var menuOptionNames=component.getMenuOptionNames();
var menuOptions=this.getMenuOptions;
var optionCnt=menuOptionNames.length;
component.addMenuOption("laborGraph"+compId,"laborGraph"+compId,pai18n.LABOR_GRAPH,false,"click",function(){var fundalGraphItem=new MenuSelection("laborGraph"+compId);
fundalGraphItem.setLabel(pai18n.LABOR_GRAPH);
var pregInfoSR=null;
var pregInfoObj=null;
pregInfoSR=MP_Resources.getSharedResource("pregnancyInfo");
pregInfoObj=pregInfoSR.getResourceData();
var pregDiscernObject=null;
try{pregDiscernObject=window.external.DiscernObjectFactory("PREGNANCY");
MP_Util.LogDiscernInfo(this,"PREGNANCY","pregnancyassessment3-o1.js","menuItemOnClickHandler");
pregDiscernObject.LaunchLaborGraph(window,criterion.person_id,pregInfoObj.getPregnancyId());
}catch(discernErr){MP_Util.LogJSError(discernErr,this,"pregnancyassessment3-o1.js","menuItemOnClickHandler");
return;
}});
component.addMenuOption("fundalGraph"+compId,"fundalGraph"+compId,pai18n.FUNDAL_HEIGHT,false,"click",function(){var fundalGraphItem=new MenuSelection("fundalGraph"+compId);
fundalGraphItem.setLabel(pai18n.FUNDAL_HEIGHT);
var pregInfoSR=null;
var pregInfoObj=null;
pregInfoSR=MP_Resources.getSharedResource("pregnancyInfo");
pregInfoObj=pregInfoSR.getResourceData();
var pregDiscernObject2=null;
try{pregDiscernObject2=window.external.DiscernObjectFactory("PREGNANCY");
MP_Util.LogDiscernInfo(this,"PREGNANCY","pregnancyassessment3-o1.js","menuItemOnClickHandler");
pregDiscernObject2.LaunchFundalHeightGraph(window,criterion.person_id,pregInfoObj.getPregnancyId());
}catch(discernErr){MP_Util.LogJSError(discernErr,this,"pregnancyassessment3-o1.js","menuItemOnClickHandler");
return;
}});
component.createMenu();
}return{GetPregAssessment3Data:function(component){var sendAr=[];
var criterion=component.getCriterion();
var messageHTML="";
var pai18n=i18n.discernabu.pregassessmentbase;
var pregInfoObj=null;
var pregInfoSR=MP_Resources.getSharedResource("pregnancyInfo");
var pregnancyId=0;
var lookBackUnits=component.getLookbackUnits();
var lookBackUnitTypeFlag=component.getLookbackUnitTypeFlag();
var df=MP_Util.GetDateFormatter();
if(criterion.getPatientInfo().getSex().meaning!=="FEMALE"){messageHTML="<h3 class='info-hd'><span class='res-normal'>"+pai18n.NOT_FEMALE+"</span></h3><span class='res-none'>"+pai18n.NOT_FEMALE+"</span>";
MP_Util.Doc.FinalizeComponent(messageHTML,component,"(0)");
return;
}else{if(pregInfoSR&&pregInfoSR.isResourceAvailable()){pregInfoObj=pregInfoSR.getResourceData();
pregnancyId=pregInfoObj.getPregnancyId();
if(pregnancyId===-1){messageHTML="<h3 class='info-hd'><span class='res-normal'>"+pai18n.PREG_DATA_ERROR+"</span></h3><span class='res-none'>"+pai18n.PREG_DATA_ERROR+"</span>";
MP_Util.Doc.FinalizeComponent(messageHTML,component,"(0)");
return;
}else{if(!pregnancyId){messageHTML="<h3 class='info-hd'><span class='res-normal'>"+pai18n.NO_ACTIVE_PREG+"</span></h3><span class='res-none'>"+pai18n.NO_ACTIVE_PREG+"</span>";
MP_Util.Doc.FinalizeComponent(messageHTML,component,"(0)");
return;
}else{sendAr.push("^MINE^",criterion.person_id+".0",criterion.provider_id+".0",criterion.position_cd+".0",criterion.ppr_cd+".0",pregInfoObj.getLookBack(),"3");
sendAr.push(MP_Util.CreateParamArray(component.getAntepartumNote3(),1));
var groups=component.getGroups();
for(var i=0;
i<groups.length;
i++){var group=groups[i];
if(group instanceof MPageEventSetGroup){sendAr.push(MP_Util.CreateParamArray(group.getEventSets(),1));
}}updateComponentMenu(component);
sendAr.push(lookBackUnits,lookBackUnitTypeFlag);
MP_Core.XMLCclRequestWrapper(component,"MP_GET_PREG_ASSESSMENT",sendAr,true);
}}}}}};
}();