function DischargePlanComponentStyle(){this.initByNamespace("dp");
}DischargePlanComponentStyle.inherits(ComponentStyle);
function DischargePlanComponent(criterion){this.setCriterion(criterion);
this.setStyles(new DischargePlanComponentStyle());
this.setComponentLoadTimerName("USR:MPG.DISCHARGE_PLAN.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.DISCHARGE_PLAN.O1 - render component");
this.setIncludeLineNumber(true);
this.setScope(2);
this.setResultCount(1);
DischargePlanComponent.method("HandleSuccess",function(replyAr,component){CERN_DISCHARGE_PLAN_O1.RenderComponent(component,replyAr[0].getResponse());
});
}DischargePlanComponent.inherits(MeasurementBaseComponent);
var CERN_DISCHARGE_PLAN_O1=function(){return{RenderComponent:function(component,recordData){var timerRenderComponent=MP_Util.CreateTimer(component.getComponentRenderTimerName());
try{var sHTML="",countText="";
var ar=[];
var codeArray=MP_Util.LoadCodeListJSON(recordData.CODES);
var personnelArray=MP_Util.LoadPersonelListJSON(recordData.PRSNL);
var measureArray=CERN_MEASUREMENT_BASE_O1.LoadMeasurementDataArrayNoSort(recordData,personnelArray,codeArray);
var df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
var measLen=measureArray.length;
ar.push("<div class='",MP_Util.GetContentClass(component,measLen),"'>");
for(var i=0,l=measureArray.length;
i<l;
i++){var measObject=measureArray[i];
var display=measObject.getEventCode().display;
var oDate=measObject.getDateTime();
var sDate=(oDate)?df.format(oDate,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR):"";
ar.push("<dl class ='dp-info'><dt class ='dp-disp-lbl'>",display,"</dt><dd class ='dp-name'>",display,"</dd><dt class ='dp-res-lbl'>",i18n.discernabu.dischargeplan_o1.RESULT," </dt><dd class ='dp-res'>");
ar.push(MP_Util.Measurement.GetNormalcyResultDisplay(measObject));
ar.push("</dd><dt class= 'dpdate'>",sDate,"</dt><dd class ='dp-dt'><span class='date-time'>",sDate,"</span></dd></dl>");
}ar.push("</div>");
sHTML=ar.join("");
countText=MP_Util.CreateTitleText(component,measLen);
var compNS=component.getStyles().getNameSpace();
MP_Util.Doc.FinalizeComponent(sHTML,component,countText);
}catch(err){if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}}};
}();
