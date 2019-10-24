function NeonateTransfusionComponentStyle(){this.initByNamespace("neotrans");
}NeonateTransfusionComponentStyle.inherits(ComponentStyle);
function NeonateTransfusionComponent(criterion){this.setCriterion(criterion);
this.setStyles(new NeonateTransfusionComponentStyle());
this.setIncludeLineNumber(true);
var transfuseEvents="0.0";
var momBldEvents="0.0";
var babyBldEvents="0.0";
this.setComponentLoadTimerName("USR:MPG.NeonateTransfusionComponent.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.NeonateTransfusionComponent.O1 - render component");
NeonateTransfusionComponent.method("InsertData",function(){retrieveGroups(this);
CERN_NB_TRANSFUSION_O1.GetTransfusionTable(this);
});
NeonateTransfusionComponent.method("HandleSuccess",function(recordData){CERN_NB_TRANSFUSION_O1.RenderComponent(this,recordData);
});
NeonateTransfusionComponent.method("getBabyBldTypeEvents",function(){return babyBldEvents;
});
NeonateTransfusionComponent.method("getMomBldTypeEvents",function(){return momBldEvents;
});
NeonateTransfusionComponent.method("getTransfusionEvents",function(){return transfuseEvents;
});
function retrieveGroups(component){var groups=component.getGroups();
var xl=(groups)?groups.length:0;
for(var x=xl;
x--;
){var group=groups[x];
switch(group.getGroupName()){case"NEO_BABY_BLD_TYPE":babyBldEvents=MP_Util.CreateParamArray(group.getEventSets(),1);
break;
case"NEO_MOM_BLD_TYPE":momBldEvents=MP_Util.CreateParamArray(group.getEventSets(),1);
break;
case"NEO_BLD_PRODUCT":transfuseEvents=MP_Util.CreateParamArray(group.getEventSets(),1);
break;
}}}}NeonateTransfusionComponent.inherits(MPageComponent);
var CERN_NB_TRANSFUSION_O1=function(){return{GetTransfusionTable:function(component){var sendAr=[];
var criterion=component.getCriterion();
var dob='""';
var dobTmp=criterion.getPatientInfo().getDOB();
if(dobTmp!=null){dob='"'+criterion.getPatientInfo().getDOB().format("dd-mmm-yyyy HH:MM")+'"';
}sendAr.push("^MINE^",criterion.person_id+".0",criterion.provider_id+".0",criterion.ppr_cd+".0",dob,component.getTransfusionEvents(),component.getMomBldTypeEvents(),component.getBabyBldTypeEvents());
MP_Core.XMLCclRequestWrapper(component,"MP_GET_NEONATE_TRANSFUSION",sendAr,true);
},RenderComponent:function(component,recordData){var i18n_nt=i18n.discernabu.neonatetransfusion_o1;
var df=MP_Util.GetDateFormatter();
var contentId=component.getStyles().getContentId();
var bloodProd="<table class='neotrans-table'>								<tr class='sub-sec-hd'><td>"+i18n_nt.BLOOD_TYPE_RH+"</td><td>"+i18n_nt.TYPE+"</td></tr>								{bloodtypes}								<tr class='sub-sec-hd'><td>"+i18n_nt.TRANSFUSIONS+"</td><td>"+i18n_nt.DATE_PERFORMED+"</td></tr>								{transfusions}							</table>";
var noResults="<tr><td class='res-none'>"+i18n_nt.NO_RESULTS_FOUND+"</td><td>&nbsp;</td></tr>";
var transTMP=[];
jQuery.each(recordData.TRANSFUSIONS,function(t){transTMP.push("<tr><td>"+this.LABEL+" - "+this.RESULT_VALUE+"</td><td>"+df.formatISO8601(this.RESULT_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR)+"</td></tr>");
});
var transfusions=transTMP.join("");
var bloodTMP=[];
jQuery.each(recordData.BLOOD_TYPES,function(b){bloodTMP.push("<tr><td>"+this.LABEL+"</td><td>"+this.RESULT_VALUE+"</td></tr>");
});
var bloodtypes=bloodTMP.join("");
_g(contentId).innerHTML=bloodProd.interpolate({transfusions:(transfusions!=="")?transfusions:noResults,bloodtypes:(bloodtypes!=="")?bloodtypes:noResults});
var rootComponentNode=component.getRootComponentNode();
var totalCount=Util.Style.g("sec-total",rootComponentNode,"span");
totalCount[0].innerHTML="";
}};
}();
