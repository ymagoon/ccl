function NeonateTaskTimelineComponentStyle(){this.initByNamespace("neotasks");
}NeonateTaskTimelineComponentStyle.inherits(ComponentStyle);
function NeonateTaskTimelineComponent(criterion){this.setCriterion(criterion);
this.setStyles(new NeonateTaskTimelineComponentStyle());
this.setComponentLoadTimerName("USR:MPG.NeonateTaskTimelineComponent.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.NeonateTaskTimelineComponent.O1 - render component");
var idBandEvents="0.0";
var idBandDetailsEvents="0.0";
var hearingScrEvents="0.0";
var hearingScrDetailsEvents="0.0";
var circumcisionEvents="0.0";
var circumcisionDetailsEvents="0.0";
var metabolicScrEvents="0.0";
var metabolicScrDetailsEvents="0.0";
var newbornDOB="0.0";
var m_idBandNomens=[];
var m_idBandNomenQuals=[];
var m_hearingScrNomens=[];
var m_hearingScrNomenQuals=[];
var m_circumcisionNomens=[];
var m_circumcisionNomenQuals=[];
var m_metabolicScrNomens=[];
var m_metabolicScrNomenQuals=[];
var m_otherNomens=[];
var m_otherNomenQuals=[];
var m_otherNomenValSeqs=[];
var m_otherValSeqs=[];
var m_otherEvents=[];
NeonateTaskTimelineComponent.method("InsertData",function(){retrieveGroups(this);
CERN_NB_TASKTIMELINE_O1.GetTaskTimelineTable(this);
});
NeonateTaskTimelineComponent.method("HandleSuccess",function(recordData){CERN_NB_TASKTIMELINE_O1.RenderComponent(this,recordData);
});
NeonateTaskTimelineComponent.method("getIdBandEvents",function(){return idBandEvents;
});
NeonateTaskTimelineComponent.method("getIdBandDetailsEvents",function(){return idBandDetailsEvents;
});
NeonateTaskTimelineComponent.method("getHearingScrEvents",function(){return hearingScrEvents;
});
NeonateTaskTimelineComponent.method("getHearingScrDetailsEvents",function(){return hearingScrDetailsEvents;
});
NeonateTaskTimelineComponent.method("getCircumcisionEvents",function(){return circumcisionEvents;
});
NeonateTaskTimelineComponent.method("getCircumcisionDetailsEvents",function(){return circumcisionDetailsEvents;
});
NeonateTaskTimelineComponent.method("getMetabolicScrEvents",function(){return metabolicScrEvents;
});
NeonateTaskTimelineComponent.method("getMetabolicScrDetailsEvents",function(){return metabolicScrDetailsEvents;
});
NeonateTaskTimelineComponent.method("getNewbornDOB",function(){return newbornDOB;
});
NeonateTaskTimelineComponent.method("getIdBandNomens",function(){return m_idBandNomens;
});
NeonateTaskTimelineComponent.method("getIdBandNomenQuals",function(){return m_idBandNomenQuals;
});
NeonateTaskTimelineComponent.method("setIdBandNomens",function(value){jQuery.each(value,function(){m_idBandNomens.push(this.nomen_id);
m_idBandNomenQuals.push(this.qual_flag);
});
});
NeonateTaskTimelineComponent.method("getHearingScrNomens",function(){return m_hearingScrNomens;
});
NeonateTaskTimelineComponent.method("getHearingScrNomenQuals",function(){return m_hearingScrNomenQuals;
});
NeonateTaskTimelineComponent.method("setHearingScrNomens",function(value){jQuery.each(value,function(){m_hearingScrNomens.push(this.nomen_id);
m_hearingScrNomenQuals.push(this.qual_flag);
});
});
NeonateTaskTimelineComponent.method("getCircumcisionNomens",function(){return m_circumcisionNomens;
});
NeonateTaskTimelineComponent.method("getCircumcisionNomenQuals",function(){return m_circumcisionNomenQuals;
});
NeonateTaskTimelineComponent.method("setCircumcisionNomens",function(value){jQuery.each(value,function(){m_circumcisionNomens.push(this.nomen_id);
m_circumcisionNomenQuals.push(this.qual_flag);
});
});
NeonateTaskTimelineComponent.method("getMetabolicScrNomens",function(){return m_metabolicScrNomens;
});
NeonateTaskTimelineComponent.method("getMetabolicScrNomenQuals",function(){return m_metabolicScrNomenQuals;
});
NeonateTaskTimelineComponent.method("setMetabolicScrNomens",function(value){jQuery.each(value,function(){m_metabolicScrNomens.push(this.nomen_id);
m_metabolicScrNomenQuals.push(this.qual_flag);
});
});
NeonateTaskTimelineComponent.method("getOtherNomens",function(){return m_otherNomens;
});
NeonateTaskTimelineComponent.method("getOtherNomenQuals",function(){return m_otherNomenQuals;
});
NeonateTaskTimelineComponent.method("getOtherNomenValueSeqs",function(){return m_otherNomenValSeqs;
});
NeonateTaskTimelineComponent.method("setOtherNomens",function(value){jQuery.each(value,function(){m_otherNomens.push(this.nomen_id);
m_otherNomenQuals.push(this.qual_flag);
m_otherNomenValSeqs.push(this.seq);
});
});
NeonateTaskTimelineComponent.method("getOtherEvents",function(){return m_otherEvents;
});
NeonateTaskTimelineComponent.method("getOtherEventValueSeqs",function(){return m_otherValSeqs;
});
NeonateTaskTimelineComponent.method("setOtherEvents",function(value){jQuery.each(value,function(){m_otherEvents.push(this.id);
m_otherValSeqs.push(this.seq);
});
});
function retrieveGroups(component){var groups=component.getGroups();
var xl=(groups)?groups.length:0;
for(var x=xl;
x--;
){var group=groups[x];
switch(group.getGroupName()){case"NEO_ID_BAND":idBandEvents=MP_Util.CreateParamArray(group.getEventCodes(),1);
break;
case"NEO_ID_BAND_DETAILS":idBandDetailsEvents=MP_Util.CreateParamArray(group.getEventSets(),1);
break;
case"NEO_HEARING_SCR":hearingScrEvents=MP_Util.CreateParamArray(group.getEventCodes(),1);
break;
case"NEO_HEARING_SCR_DETAILS":hearingScrDetailsEvents=MP_Util.CreateParamArray(group.getEventSets(),1);
break;
case"NEO_CIRCUMCISION":circumcisionEvents=MP_Util.CreateParamArray(group.getEventCodes(),1);
break;
case"NEO_CIRCUMCISION_DETAILS":circumcisionDetailsEvents=MP_Util.CreateParamArray(group.getEventSets(),1);
break;
case"NEO_METABOLIC_SCR":metabolicScrEvents=MP_Util.CreateParamArray(group.getEventCodes(),1);
break;
case"NEO_METABOLIC_SCR_DETAILS":metabolicScrDetailsEvents=MP_Util.CreateParamArray(group.getEventSets(),1);
break;
case"NEO_TASK_TMLNE_BIRTH_DT_TM":newbornDOB=MP_Util.CreateParamArray(group.getEventCodes(),1);
break;
}}}}NeonateTaskTimelineComponent.inherits(MPageComponent);
var CERN_NB_TASKTIMELINE_O1=function(){return{GetTaskTimelineTable:function(component){var sendAr=[];
var criterion=component.getCriterion();
var dob='""';
var dobTmp=criterion.getPatientInfo().getDOB();
if(dobTmp!=null){dob='"'+criterion.getPatientInfo().getDOB().format("dd-mmm-yyyy HH:MM")+'"';
}var circumcision="0.0";
var circumcisionDetails="0.0";
var circumcisionNomens="0.0";
var circumcisionQuals="0.0";
if(criterion.getPatientInfo().getSex().meaning==="MALE"){circumcision=component.getCircumcisionEvents();
circumcisionDetails=component.getCircumcisionDetailsEvents();
circumcisionNomens=MP_Util.CreateParamArray(component.getCircumcisionNomens(),1);
circumcisionQuals=MP_Util.CreateParamArray(component.getCircumcisionNomenQuals(),2);
}var idBandNomens=MP_Util.CreateParamArray(component.getIdBandNomens(),1);
var idBandNomenQuals=MP_Util.CreateParamArray(component.getIdBandNomenQuals(),2);
var hearingScrNomens=MP_Util.CreateParamArray(component.getHearingScrNomens(),1);
var hearingScrNomenQuals=MP_Util.CreateParamArray(component.getHearingScrNomenQuals(),2);
var metabolicScrNomens=MP_Util.CreateParamArray(component.getMetabolicScrNomens(),1);
var metabolicScrNomenQuals=MP_Util.CreateParamArray(component.getMetabolicScrNomenQuals(),2);
var otherNomens=MP_Util.CreateParamArray(component.getOtherNomens(),1);
var otherNomenQuals=MP_Util.CreateParamArray(component.getOtherNomenQuals(),2);
var otherNomenValSeqs=MP_Util.CreateParamArray(component.getOtherNomenValueSeqs(),2);
var otherValSeqs=MP_Util.CreateParamArray(component.getOtherEventValueSeqs(),2);
var otherEvents=MP_Util.CreateParamArray(component.getOtherEvents(),1);
sendAr.push("^MINE^",criterion.person_id+".0",criterion.provider_id+".0",criterion.ppr_cd+".0",dob,component.getIdBandEvents(),component.getIdBandDetailsEvents(),idBandNomens,idBandNomenQuals,component.getHearingScrEvents(),component.getHearingScrDetailsEvents(),hearingScrNomens,hearingScrNomenQuals,component.getMetabolicScrEvents(),component.getMetabolicScrDetailsEvents(),metabolicScrNomens,metabolicScrNomenQuals,circumcision,circumcisionDetails,circumcisionNomens,circumcisionQuals,otherEvents,otherValSeqs,otherNomens,otherNomenQuals,otherNomenValSeqs,component.getNewbornDOB());
MP_Core.XMLCclRequestWrapper(component,"MP_GET_NEONATE_TASK_TIMELINE",sendAr,true);
},RenderComponent:function(component,recordData){var df=MP_Util.GetDateFormatter();
var i18n_ntt=i18n.discernabu.neonatetasktimeline_o1;
var timelineData=recordData;
var contentId=component.getStyles().getContentId();
var tableHTML="<div class='sub-sec-hd'>{dobLabel}: {dob}</div>							<table class='neotasks-ttl-table'>{header}{rows}</table>";
var headerTR="<tr><th class='sub-sec-hd'>{day}</th>{columns}</tr>";
var header="";
var rows=[];
var rowCnt=0;
String.prototype.interpolate=function(valueMap){return this.replace(/\{([^}]+)\}/g,function(dummy,v){return valueMap[v];
});
};
var headerTMP=[];
jQuery.each(timelineData.COLUMNS,function(c){var th="<th class='sub-sec-hd'>{heading}</th>";
headerTMP.push(th.interpolate({heading:this.COLUMN}));
});
header=headerTMP.join("");
jQuery.each(timelineData.DAY,function(d,idx){var cells=[];
var rowHTML="<tr {rowClass}>{cells}</tr>";
var rowClass="class='hide'";
cells.push("<td>"+(d+1)+"</td>");
var day=this;
jQuery.each(timelineData.COLUMNS,function(c,i){var cellHTML="<td {completed}>{details}</td>";
var detailHvr="";
var details="";
var result="";
var cellClass="";
jQuery.each(day.RESULT,function(){if(this.COLUMN===c+1){result=this;
cellClass=(result)?"class='checked'":"";
if(result&&result.DETAILS.length>0){var detailTMP=[];
jQuery.each(result.DETAILS,function(dtl){var dttm=this.VALUE.indexOf("{date_value}");
var val=this.VALUE;
if(dttm>-1){val=df.formatISO8601(this.VALUE.substr(dttm+12),mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
}detailTMP.push("<dt><span>"+this.DISPLAY+": </span></dt><dd><span>"+val+"</span></dd>");
});
details=detailTMP.join("");
detailHvr="<dl class='result-info'><img src='"+component.getCriterion().static_content+"/images/4022_16.gif' alt='"+i18n_ntt.COMPLETED+"'></dl><div class='result-details hvr'><dl>"+details+"</dl><div>";
}else{if(result){detailHvr="<img src='"+component.getCriterion().static_content+"/images/4022_16.gif' alt='"+i18n_ntt.COMPLETED+"'>";
}}if(result&&rowClass.length>0){rowClass="";
rowCnt++;
}}});
cells.push(cellHTML.interpolate({completed:cellClass,details:detailHvr}));
});
if(rowClass.length>0){rowClass=(rowCnt%2===0)?"class='hide odd'":"class='hide'";
}else{rowClass=(rowCnt%2===0)?"":"class='odd'";
}rows.push(rowHTML.interpolate({cells:cells.join(""),rowClass:rowClass}));
});
var dob_date=null;
dob_date=df.formatISO8601(timelineData.BABYDOB,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
var neoTaskHTML=tableHTML.interpolate({header:headerTR.interpolate({day:i18n_ntt.DAY_OF_LIFE,columns:header}),rows:rows.join(""),dobLabel:i18n_ntt.DATE_OF_BIRTH,dob:dob_date});
component.finalizeComponent(neoTaskHTML,0);
}};
}();
