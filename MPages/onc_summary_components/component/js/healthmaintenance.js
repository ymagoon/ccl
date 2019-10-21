function HmiComponentStyle(){this.initByNamespace("hmi");
}HmiComponentStyle.inherits(ComponentStyle);
function HmiComponent(criterion){this.setCriterion(criterion);
this.setStyles(new HmiComponentStyle());
this.setComponentLoadTimerName("USR:MPG.HEALTH_MAINT.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.HEALTH_MAINT.O1 - render component");
this.setIncludeLineNumber(false);
this.setScope(1);
HmiComponent.method("InsertData",function(){CERN_HMI_O1.GetHmiTable(this);
});
HmiComponent.method("HandleSuccess",function(reply){var timerRenderComponent=MP_Util.CreateTimer(this.getComponentRenderTimerName());
var countText="";
try{if(reply.getStatus()=="S"){CERN_HMI_O1.DisplayHmiStaleDataMsg(this,reply.getResponse());
CERN_HMI_O1.RenderComponent(this,reply.getResponse());
}else{var errMsg=[];
if(reply.getStatus()=="Z"){CERN_HMI_O1.DisplayHmiStaleDataMsg(this,reply.getResponse());
MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(this.getStyles().getNameSpace()),this,countText);
}else{errMsg.push(reply.getError());
MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(),errMsg.join("<br />")),this,countText);
}}}catch(err){if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}});
HmiComponent.method("openTab",function(){var criterion=this.getCriterion();
var sParms="/PERSONID="+criterion.person_id+" /ENCNTRID="+criterion.encntr_id+" /FIRSTTAB=^"+this.getLink()+"+^";
APPLINK(0,criterion.executable,sParms);
this.InsertData();
});
}HmiComponent.inherits(MPageComponent);
var CERN_HMI_O1=function(){return{GetHmiTable:function(component){var sendAr=[];
var criterion=component.getCriterion();
sendAr.push("^MINE^",criterion.person_id+".0",criterion.provider_id+".0",criterion.encntr_id+".0");
var request=new MP_Core.ScriptRequest(component,component.getComponentLoadTimerName());
request.setProgramName("MP_GET_HMI");
request.setParameters(sendAr);
request.setAsync(true);
MP_Core.XMLCCLRequestCallBack(component,request,function(reply){component.HandleSuccess(reply);
});
},RenderComponent:function(component,recordData){var hmiCompId=component.getComponentId();
try{var sHTML="";
var jsHTML=[];
var countText="";
var hmiObject=recordData.RECS;
jsHTML.push("<div class='content-hd'>","<dl class='hmi-head hdr'><dd class='hmi-name'><span>",i18n.discernabu.healthmaint_o1.EXPECTATION,"</span></dd>","<dd class='hmi-date'><span>",i18n.discernabu.healthmaint_o1.NEXT_DUE,"</span></dd></dl>");
jsHTML.push("<div class='",MP_Util.GetContentClass(component,hmiObject.length),"'>");
for(var x=0,l=hmiObject.length;
x<l;
x++){var records=hmiObject[x];
var recStatus=records.STATUS;
var item=[];
var dueDate="";
var exptName="&nbsp;";
var dateTime=new Date();
var hmiName=records.EXPECT_STEP;
if(records.EXPECT_STEP!==""){hmiName=records.EXPECT_STEP;
}if(records.DUE_DATE!==""){dateTime.setISO8601(records.DUE_DATE_UTC);
dueDate=dateTime.format("shortDate3");
}if(records.DATE_IND===0){jsHTML.push("<dl class='hmi-info'><dt class='hmi-name'>",i18n.discernabu.healthmaint_o1.EXPECTATION,"</dt>","<dd class='hmi-name overdue'><span>",hmiName,"</span></dd>","<dd class='hmi-date'><span class='date-time'>",dueDate);
jsHTML.push("</span></dd></dl>");
}else{if(records.DATE_IND===1){jsHTML.push("<dl class='hmi-info'><dt class='hmi-name'>",i18n.discernabu.healthmaint_o1.EXPECTATION,"</dt>","<dd class='hmi-name'><span>",hmiName,"</span></dd>","<dd class='hmi-date'><span class='date-time'>",dueDate,"</span></dd></dl>");
}}}jsHTML.push("</div>");
hmiHTML=jsHTML.join("");
countText="("+recordData.OVERDUE_CNT+" "+i18n.discernabu.healthmaint_o1.OVERDUE+" | "+recordData.DUE_CNT+" "+i18n.discernabu.healthmaint_o1.DUE+")";
MP_Util.Doc.FinalizeComponent(hmiHTML,component,countText);
}catch(err){throw (err);
}finally{}},DisplayHmiStaleDataMsg:function(component,recordData){if(typeof(recordData.COHERENCY_ACTIVE_IND)!=="undefined"){if(recordData.COHERENCY_ACTIVE_IND===0){if(recordData.COHERENCY_VALID_DT_TM){var hmiContent=$("#hmiContent"+component.getComponentId());
if(hmiContent.length){var dateTime=new Date();
var df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
var hmiWarnDateStr="";
dateTime.setISO8601(recordData.COHERENCY_VALID_DT_TM);
hmiWarnDateStr=df.format(dateTime,mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR)+" "+df.format(dateTime,mp_formatter.DateTimeFormatter.TIME_24HOUR);
var hmiWarnStr='<div class="sub-title-disp hmi-stale-warning">'+i18n.discernabu.healthmaint_o1.STALE_DATA_MSG.replace("{0}",hmiWarnDateStr)+"</div>";
$(hmiContent).before(hmiWarnStr);
}}}}}};
}();