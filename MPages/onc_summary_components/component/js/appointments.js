function AppointmentsComponentStyle(){this.initByNamespace("reh_app");
}AppointmentsComponentStyle.inherits(ComponentStyle);
function AppointmentsComponent(criterion){this.setCriterion(criterion);
this.setStyles(new AppointmentsComponentStyle());
this.setComponentLoadTimerName("USR:MPG.appointments.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.appointments.O1 - render component");
this.setIncludeLineNumber(true);
AppointmentsComponent.method("HandleSuccess",function(recordData){CERN_APPOINTMENTS_O1.RenderComponent(this,recordData);
});
AppointmentsComponent.method("InsertData",function(){CERN_APPOINTMENTS_O1.Getappointments(this);
});
}AppointmentsComponent.inherits(MPageComponent);
var CERN_APPOINTMENTS_O1=function(){return{Getappointments:function(component){var sendAr=[];
var program="mp_reh_get_appointments";
var criterion=component.getCriterion();
var prsnlInfo=criterion.getPersonnelInfo();
var encntrs=prsnlInfo.getViewableEncounters();
var encntrVal=(component.getScope()==1)?"value("+encntrs+")":criterion.encntr_id;
sendAr.push("^MINE^",criterion.person_id+".0",criterion.provider_id+".0",encntrVal);
MP_Core.XMLCclRequestWrapper(component,program,sendAr,true);
return;
},RenderComponent:function(component,recordData){try{var countText="";
var jsHTML=[];
var jsonToday=[];
var jsonFuture=[];
var jsToday=[];
var jsFuture=[];
var appointmentsCount=recordData.TODAY_APPOINTMENT_CNT;
var futureCount=recordData.FUTURE_APPOINTMENT_CNT;
for(var p=(appointmentsCount-1);
p>=0;
p--){jsonToday.push(recordData.TODAY_APPOINTMENT[p]);
}for(var f=0;
f<futureCount;
f++){jsonFuture.push(recordData.FUTURE_APPOINTMENT[f]);
}if(appointmentsCount>0){jsHTML=PopulateSubSections(jsonToday,"Today");
}if(futureCount>0){jsHTML=jsHTML.concat(PopulateSubSections(jsonFuture,"Future"));
}var appLen=appointmentsCount+futureCount;
var content=[];
content.push("<div class ='",MP_Util.GetContentClass(component,appLen),"'>",jsHTML.join(""),"</div>");
var apphtml=content.join("");
countText=MP_Util.CreateTitleText(component,appLen);
MP_Util.Doc.FinalizeComponent(apphtml,component,countText);
}catch(err){alert("An error has occurred in appointments : "+err.name+" - "+err.message);
}finally{}}};
function PopulateSubSections(jsData,sectionName){var DataCount=jsData.length;
var jsSection=[];
var jsHTMLContent=[];
for(p=0;
p<DataCount;
p++){var DataObj=jsData[p];
jsSection.push("<dl class='reh_app-info'>","<dt class='reh_app-dt'>","Date","</dt>","<dd class='reh_app-dt'>",DataObj.DATE,"</dd><dt class='reh_app-tp'>","Type","</dt>","<dd class='reh_app-tp'>",DataObj.TYPE,"</dd>","<dt class='reh_app-lc'>","Location","</dt>","<dd class='reh_app-lc'>",DataObj.LOCATION," </dd></dl>","<h4 class='reh_app-det-hd'><span>",i18n.APPOINTMENT_DETAILS,"</span></h4>","<div class='hvr'><dl class='reh_app-det'>","<dt class='reh_app-det-vr'><span>","Appointment Reason",":</span></dt>","<dd class='reh_app-det-vr'>",DataObj.DESCRIPTION,"</dd></dl> </div>");
}jsHTMLContent.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='",i18n.HIDE_SECTION,"'>-</span><span class='sub-sec-title'>",sectionName," (",DataCount,") </span></h3>","<div class='sub-sec-content'>","<div class='content-hdr'><dl class ='reh_app-info-hdr'>","<dd class ='reh_app-dt'><span>",i18n.DATE,"</span></dd>","<dd class ='reh_app-tp'><span>",i18n.TYPE,"</span></dd>","<dd class ='reh_app-lc'><span>",i18n.LOCATION,"</span></dd></dl></div>","<div class='content-body'>");
if(jsSection.length>0){jsHTMLContent.push(jsSection.join(""));
}else{jsHTMLContent.push(i18n.NO_RESULTS_FOUND);
}jsHTMLContent.push("</div></div></div>");
return jsHTMLContent;
}}();
