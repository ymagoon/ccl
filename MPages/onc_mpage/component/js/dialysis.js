function DialysisComponentWFStyle(){this.initByNamespace("dialysis");
}DialysisComponentWFStyle.inherits(ComponentStyle);
function DialysisComponentWF(criterion){this.graphData=[];
this.dataArr=[];
this.graphSeries=[];
this.plot=null;
this.weightCodes=[];
this.ufOutCodes=[];
this.startDateCodes=[];
this.stopDateCodes=[];
this.otherEventCodes=[];
this.dialysisI18n=i18n.discernabu.dialysis;
this.setCriterion(criterion);
this.setStyles(new DialysisComponentWFStyle());
this.setComponentLoadTimerName("USR:MPG.DIALYSISCOMPONENT.O2 - load component");
this.setComponentRenderTimerName("ENG:MPG.DIALYSISCOMPONENT.O2 - render component");
this.isDisplayBannerFlag=false;
this.dstDtTm={};
}DialysisComponentWF.prototype=new MPageComponent();
DialysisComponentWF.prototype.constructor=MPageComponent;
MP_Util.setObjectDefinitionMapping("WF_DIALYSIS",DialysisComponentWF);
DialysisComponentWF.prototype.setWeightCodes=function(weightCodes){this.weightCodes=weightCodes;
};
DialysisComponentWF.prototype.getWeightCodes=function(){return this.weightCodes;
};
DialysisComponentWF.prototype.setUfCodes=function(ufOutCodes){this.ufOutCodes=ufOutCodes;
};
DialysisComponentWF.prototype.getUfCodes=function(){return this.ufOutCodes;
};
DialysisComponentWF.prototype.setStartDateCodes=function(startDateCodes){this.startDateCodes=startDateCodes;
};
DialysisComponentWF.prototype.getStartDateCodes=function(){return this.startDateCodes;
};
DialysisComponentWF.prototype.setStopDateCodes=function(stopDateCodes){this.stopDateCodes=stopDateCodes;
};
DialysisComponentWF.prototype.getStopDateCodes=function(){return this.stopDateCodes;
};
DialysisComponentWF.prototype.setOtherEventCodes=function(otherEventCodes){this.otherEventCodes=otherEventCodes;
};
DialysisComponentWF.prototype.getOtherEventCodes=function(){return this.otherEventCodes;
};
DialysisComponentWF.prototype.getPlot=function(){return this.plot;
};
DialysisComponentWF.prototype.refreshComponent=function(){this.graphData=[];
this.dataArr=[];
this.graphSeries=[];
this.plot=null;
MPageComponent.prototype.refreshComponent.call(this);
};
DialysisComponentWF.prototype.loadFilterMappings=function(){this.addFilterMappingObject("WF_DIALYSIS_WEIGHT",{setFunction:this.setWeightCodes,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("WF_DIALYSIS_UF_OUTPUT",{setFunction:this.setUfCodes,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("WF_DIALYSIS_START_DATE_TIME",{setFunction:this.setStartDateCodes,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("WF_DIALYSIS_STOP_DATE_TIME",{setFunction:this.setStopDateCodes,type:"ARRAY",field:"PARENT_ENTITY_ID"});
this.addFilterMappingObject("WF_DIALYSIS_CLINICAL_EVENT",{setFunction:this.setOtherEventCodes,type:"ARRAY",field:"PARENT_ENTITY_ID"});
};
DialysisComponentWF.prototype.setPlot=function(plot){this.plot=plot;
};
DialysisComponentWF.prototype.getGraphData=function(){return this.graphData;
};
DialysisComponentWF.prototype.setGraphData=function(data){this.graphData=data;
};
DialysisComponentWF.prototype.getGraphSeries=function(){return this.graphSeries;
};
DialysisComponentWF.prototype.setGraphSeries=function(data){this.graphSeries=data;
};
DialysisComponentWF.prototype.getDataArr=function(){return this.dataArr;
};
DialysisComponentWF.prototype.setDataArr=function(data){this.dataArr=data;
};
DialysisComponentWF.prototype.setDSTDtTm=function(dstDtTm){this.dstDtTm=dstDtTm;
};
DialysisComponentWF.prototype.getDSTDtTm=function(){return this.dstDtTm;
};
DialysisComponentWF.prototype.retrieveComponentData=function(){var sendAr=[];
var criterion=this.getCriterion();
sendAr.push("^MINE^",criterion.person_id+".0",criterion.encntr_id+".0",criterion.provider_id+".0",criterion.ppr_cd+".0");
sendAr.push(MP_Util.CreateParamArray(this.getStartDateCodes(),1));
sendAr.push(MP_Util.CreateParamArray(this.getStopDateCodes(),1));
sendAr.push(MP_Util.CreateParamArray(this.getUfCodes(),1));
sendAr.push(MP_Util.CreateParamArray(this.getWeightCodes(),1));
sendAr.push(MP_Util.CreateParamArray(this.getOtherEventCodes(),1));
MP_Core.XMLCclRequestWrapper(this,"MP_DIALYSIS",sendAr,true);
};
DialysisComponentWF.prototype.renderComponent=function(recordData){try{var bodyHTML=[];
var bannerHtml="";
this.setDisplayBanner(false);
this.setDSTDtTm(null);
this.setDataArr(recordData);
bodyHTML.push('<div class="dialysis-container content-body">');
bodyHTML.push('<div id="'+this.getComponentId()+'dialysis-banner-container"></div>');
bodyHTML.push(this.createHeader());
bodyHTML.push('<div class="dialysis-container-col-1">');
bodyHTML.push('<div id="'+this.getComponentId()+'dialysisGraphContainer"></div>');
bodyHTML.push("</div>");
bodyHTML.push('<div class="dialysis-container-col-2">');
bodyHTML.push(this.createLegend());
bodyHTML.push("</div><div>");
this.createSeries();
MP_Util.Doc.FinalizeComponent(bodyHTML.join(""),this,"");
if(this.isDisplayAlertBanner()){bannerHtml=this.getBannerHtml();
$("#"+this.getComponentId()+"dialysis-banner-container").html(bannerHtml);
}this.plotGraph();
}catch(err){MP_Util.LogJSError(err,this,"dialysis.js","renderComponent");
alert(err);
throw (err);
}};
DialysisComponentWF.prototype.getDaysBetweenDates=function(startDate,endDate){var startMonth=startDate.getMonth();
var endMonth=endDate.getMonth();
var dateDiff=-1;
var tempStartDiff=0;
var monthDays=[31,28,31,30,31,30,31,31,30,31,30,31];
var isLeap=null;
if(startMonth===endMonth){dateDiff=endDate.getDate()-startDate.getDate();
}else{isLeap=new Date(startDate.getYear(),1,29).getMonth()==1;
monthDays[1]=(isLeap)?29:28;
tempStartDiff=monthDays[startMonth]-startDate.getDate();
dateDiff=endDate.getDate()+tempStartDiff;
}return dateDiff;
};
DialysisComponentWF.prototype.createLegend=function(item){var layoutHTML=[];
var tooltipStartDt=this.dialysisI18n.tooltipStartDt;
var tooltipEndDt=this.dialysisI18n.tooltipEndDt;
var tooltipUF=this.dialysisI18n.tooltipUF;
var measuredWeight=this.dialysisI18n.measuredWeight;
layoutHTML.push('<div class="dialysis-legend" id="dialysis-legend-'+this.getComponentId()+'">');
layoutHTML.push('<div class="dialysis-legend-item"><div class="dialysis-legend-img"><div id="dialysis-right-triangle"></div></div><div title="'+tooltipStartDt+'" class="dialysis-legend-item-name"><span>'+tooltipStartDt+"</span></div></div>");
layoutHTML.push('<div class="dialysis-legend-item"><div class="dialysis-legend-img"><div id="dialysis-left-triangle"></div></div><div title="'+tooltipEndDt+'" class="dialysis-legend-item-name"><span>'+tooltipEndDt+"</span></div></div>");
layoutHTML.push('<div class="dialysis-legend-item"><div class="dialysis-legend-img"><div id="dialysis-star"></div></div><div title="'+tooltipUF+'" class="dialysis-legend-item-name"><span>'+tooltipUF+"</span></div></div>");
layoutHTML.push('<div class="dialysis-legend-item"><div class="dialysis-legend-img"><div id="dialysis-square"></div></div><div title="'+measuredWeight+'" class="dialysis-legend-item-name"><span>'+measuredWeight+"</span></div></div>");
layoutHTML.push("</div>");
return layoutHTML.join("");
};
DialysisComponentWF.prototype.createHeader=function(){var layoutHTML=[];
var cnt,eventName,eventResult,eventUnit,startDtTm,startDate,startTime;
var shortDate3=dateFormat.masks.shortDate3;
var timeFormat=dateFormat.masks.militaryTime;
var data=this.getDataArr();
var otherArr=data.OTHER_EVENT_LIST;
var otherArrLen=otherArr.length;
var startDateObj=new Date();
var commaSeparator;
layoutHTML.push('<div class="dialysis-header" id="dialysis-header-'+this.getComponentId()+'">');
layoutHTML.push("<table>");
if(otherArrLen>0){for(cnt=0;
cnt<otherArrLen;
cnt++){commaSeparator=" ";
eventName=otherArr[cnt].OE_DESCRIPTION;
eventResult=otherArr[cnt].OE_RESULT;
eventUnit=otherArr[cnt].OE_RESULT_UNIT;
startDtTm=otherArr[cnt].OE_RESULT_DT_TM;
startDateObj.setISO8601(startDtTm);
startDate=startDateObj.format(shortDate3);
startTime=startDateObj.format(timeFormat);
if(!eventUnit){commaSeparator="";
}if(cnt%2===0){layoutHTML.push("<tr>");
layoutHTML.push('<td class="dialysis-header-item-cell" title="'+eventName+": "+eventResult+commaSeparator+eventUnit+", "+startDate+" "+startTime+'"><div class="dialysis-header-item"><span class="dialysis-header-item-desc">'+eventName+":&nbsp;</span><span>"+eventResult+commaSeparator+eventUnit+", "+startDate+" "+startTime+"</span></div></td>");
}else{layoutHTML.push('<td class="dialysis-header-item-cell" title="'+eventName+": "+eventResult+commaSeparator+eventUnit+", "+startDate+" "+startTime+'"><div class="dialysis-header-item"><span class="dialysis-header-item-desc">'+eventName+":&nbsp;</span><span>"+eventResult+commaSeparator+eventUnit+", "+startDate+" "+startTime+"</span></div></td>");
layoutHTML.push("</tr>");
}}if(otherArrLen%2===0){layoutHTML.push("</tr>");
}}layoutHTML.push("</table>");
layoutHTML.push("</div>");
return layoutHTML.join("");
};
DialysisComponentWF.prototype.createSeries=function(){var data=this.getDataArr();
var graphData=this.getGraphData();
var graphSeries=this.getGraphSeries();
var seriesQualArr=data.SERIES_QUAL;
var seriesQualArrLen=seriesQualArr.length;
var expArr=data.EXCEPTION_LIST;
var expArrLen=expArr.length;
var weightArr=data.WEIGHT_LIST;
var weightArrLen=weightArr.length;
var seriesIndex,startDate,endDate,startTime,endTime,daysDiff,ufOut,daysCnt,ufOutUnit;
var startDateObj=new Date();
var endDateObj=new Date();
var tooltipStartDt=this.dialysisI18n.tooltipStartDt;
var tooltipEndDt=this.dialysisI18n.tooltipEndDt;
var tooltipProgress=this.dialysisI18n.tooltipProgress;
var tooltipUF=this.dialysisI18n.tooltipUF;
var resultDate=this.dialysisI18n.resultDate;
var weightMeasu=this.dialysisI18n.measuredWeight;
var weekDays=7;
var dates=[];
var counter=0;
var todaysDate=new Date();
var startDatePlusOne=new Date();
var dateFormat2=dateFormat.masks.shortDate2;
var dateFormat3=dateFormat.masks.shortdate;
var timeFormat=dateFormat.masks.isoTime;
var militaryTimeFormat=dateFormat.masks.militaryTime;
var dateFormatLong=dateFormat.masks.longDateTime3;
var eventName,eventResult,eventUnit,eventDesc,formatTooltip,date;
var minStartTime="00:00:00";
var maxEndTime="23:59:59";
var bannerFlag=false;
var dstGraphCoordinatesObj={};
var dstGraphHover="";
for(counter=0;
counter<weekDays;
counter++){date=new Date();
date.setDate(todaysDate.getDate()-counter);
date.setHours(0,0,0,0);
dates.push(["00:00:00",date.format(dateFormat3)]);
}graphData.push(dates);
graphSeries.push(this.formatSeries(false,false,{style:""},{show:false},"#FFFFFF",false));
for(seriesIndex=0;
seriesIndex<seriesQualArrLen;
seriesIndex++){if(seriesQualArrLen===0){break;
}startDtTm=seriesQualArr[seriesIndex].START_DT_TM;
startDateObj.setISO8601(startDtTm);
startDate=startDateObj.format(dateFormat3);
startTime=startDateObj.format(timeFormat);
startTime=this.stripTmZoneInfo(startTime);
endDtTm=seriesQualArr[seriesIndex].STOP_DT_TM;
ufOut=seriesQualArr[seriesIndex].UF_OUT;
ufOutUnit=seriesQualArr[seriesIndex].UF_OUT_UNIT;
if(endDtTm==="CURRENT"){endDateObj=new Date();
formatTooltip=['<div class="dialysis-tooltip"><b>',tooltipStartDt,"</b>: "+startDateObj.format(dateFormatLong)+"<br>","<b>",tooltipEndDt,"</b>: "+tooltipProgress+"<br>","<b>",tooltipUF,"</b>: "+ufOut+"</div>"].join("");
}else{endDateObj.setISO8601(endDtTm);
formatTooltip=['<div class="dialysis-tooltip"><b>',tooltipStartDt,"</b>: "+startDateObj.format(dateFormatLong)+"<br>","<b>",tooltipEndDt,"</b>: "+endDateObj.format(dateFormatLong)+"<br>","<b>",tooltipUF,"</b>: "+ufOut+"</div>"].join("");
}daysDiff=this.getDaysBetweenDates(startDateObj,endDateObj);
if(!startDateObj<date&&!this.isDisplayAlertBanner()){bannerFlag=this.isDisplayBanner(startDateObj,endDateObj);
this.setDisplayBanner(bannerFlag);
}if(daysDiff===0){if(startDateObj<date){continue;
}endDate=endDateObj.format(dateFormat3);
endTime=endDateObj.format(timeFormat);
endTime=this.stripTmZoneInfo(endTime);
graphData.push([[startTime,startDate],[endTime,endDate]]);
graphSeries.push(this.formatSeries(false,true,{style:""},{show:false},"#3299CC",false));
graphData.push([[startTime,startDate]]);
graphSeries.push(this.formatSeries(true,true,{style:"filledTriangleRight",shadow:false},{show:false},"#3299CC",true,{formatString:formatTooltip}));
if(endDtTm!=="CURRENT"){graphData.push([[endTime,endDate]]);
graphSeries.push(this.formatSeries(true,true,{style:"filledTriangleLeft",shadow:false},{labels:[ufOut],show:true,location:"n",ypadding:0},"#3299CC",true,{formatString:formatTooltip}));
}}else{for(daysCnt=0;
daysCnt<=daysDiff;
daysCnt++){if(daysCnt===0){if(endDateObj<date){continue;
}endDate=endDateObj.format(dateFormat3);
endTime=endDateObj.format(timeFormat);
endTime=this.stripTmZoneInfo(endTime);
graphData.push([[endTime,endDate],[minStartTime,endDate]]);
graphSeries.push(this.formatSeries(false,true,{style:""},{show:false},"#3299CC",false));
if(endDtTm!=="CURRENT"){graphData.push([[endTime,endDate]]);
graphSeries.push(this.formatSeries(true,true,{style:"filledTriangleLeft",shadow:false},{labels:[ufOut],show:true,location:"n",ypadding:0},"#3299CC",true,{formatString:formatTooltip}));
}}else{if(daysCnt===daysDiff){if(startDateObj<date){continue;
}graphData.push([[startTime,startDate],[maxEndTime,startDate]]);
graphSeries.push(this.formatSeries(false,true,{style:""},{show:false},"#3299CC",false));
graphData.push([[startTime,startDate]]);
graphSeries.push(this.formatSeries(true,false,{style:"filledTriangleRight",shadow:false},{labels:[],show:false},"#3299CC",true,{formatString:formatTooltip}));
}else{startDatePlusOne.setYear(startDateObj.getFullYear());
startDatePlusOne.setMonth(startDateObj.getMonth());
startDatePlusOne.setDate(startDateObj.getDate()+daysCnt);
graphData.push([[minStartTime,startDatePlusOne.format(dateFormat3)],[maxEndTime,startDatePlusOne.format(dateFormat3)]]);
graphSeries.push(this.formatSeries(false,true,{style:""},{show:false},"#3299CC",false));
}}}}}for(i=0;
i<weightArrLen;
i++){if(weightArrLen===0){break;
}eventName=weightArr[i].WEIGHT_DESC;
eventResult=weightArr[i].WEIGHT;
eventUnit=weightArr[i].WEIGHT_UNIT;
startDtTm=weightArr[i].WEIGHT_DT_TM;
startDateObj.setISO8601(startDtTm);
startDate=startDateObj.format(dateFormat3);
startTime=startDateObj.format(timeFormat);
startTime=this.stripTmZoneInfo(startTime);
if(startDateObj<date){continue;
}graphData.push([[startTime,startDate]]);
graphSeries.push(this.formatSeries(true,false,{style:"filledSquare",shadow:false},{show:true,labels:[eventResult+" "+eventUnit],location:"n",xpadding:100,ypadding:0},"#61B329",true,{formatString:'<div class="dialysis-tooltip"><b>'+weightMeasu+": </b>"+eventResult+" "+eventUnit+"&nbsp;&nbsp;"+startDateObj.format(dateFormat2)+" "+startDateObj.format(militaryTimeFormat)+"</div>"}));
}for(i=0;
i<expArrLen;
i++){if(expArrLen===0){break;
}eventName=expArr[i].EXCPT_EVENT;
eventResult=expArr[i].EXCPT_RESULT;
eventUnit=expArr[i].EXCPT_RESULT_UNIT;
startDtTm=expArr[i].EXCPT_DT_TM;
startDateObj.setISO8601(startDtTm);
if(startDateObj<date){continue;
}startDate=startDateObj.format(dateFormat3);
startTime=startDateObj.format(timeFormat);
startTime=this.stripTmZoneInfo(startTime);
if(eventName==="START"){graphSeries.push(this.formatSeries(true,false,{style:"filledTriangleRight",shadow:false},{labels:[eventResult+" "+eventUnit],show:true,ypadding:0},"#3299CC",true,{formatString:'<div class="dialysis-tooltip"><b>'+tooltipStartDt+":</b> "+startDateObj.format(dateFormat2)+"  "+startDateObj.format(militaryTimeFormat)+"<br><b>"+tooltipUF+": </b>"+eventResult+" "+eventUnit+"</div>"}));
}else{if(eventName==="STOP"){graphSeries.push(this.formatSeries(true,false,{style:"filledTriangleLeft",shadow:false},{labels:[eventResult+" "+eventUnit],show:true,ypadding:0},"#3299CC",true,{formatString:'<div class="dialysis-tooltip"><b>'+tooltipEndDt+":</b> "+startDateObj.format(dateFormat2)+"  "+startDateObj.format(militaryTimeFormat)+"<br><b>"+tooltipUF+": </b>"+eventResult+" "+eventUnit+"</div>"}));
}else{graphSeries.push(this.formatSeries(true,false,{style:"filledStar",shadow:false},{labels:[eventResult+" "+eventUnit],show:true,location:"n",xpadding:10,ypadding:0},"#A68064",true,{formatString:'<div class="dialysis-tooltip"><b>'+tooltipUF+": </b>"+eventResult+" "+eventUnit+"&nbsp;&nbsp;"+startDateObj.format(dateFormat2)+" "+startDateObj.format(militaryTimeFormat)+"</div>"}));
}}graphData.push([[startTime,startDate]]);
}};
DialysisComponentWF.prototype.formatSeries=function(showMarkerBool,showLineBool,markerOptionObj,pointLabelObj,colorString,showHighLight,highLighter,ptLabels){var series={};
highLighter=highLighter||"";
series.showMarker=showMarkerBool;
series.showLine=showLineBool;
series.markerOptions=markerOptionObj;
series.pointLabels=pointLabelObj;
series.color=colorString;
series.highlighter=highLighter;
series.showHighlight=showHighLight;
series.shadow=false;
series.shadowAngle=0;
series.shadowOffset=0;
series.shadowDepth=0;
return series;
};
DialysisComponentWF.prototype.plotGraph=function(){var graphData=this.getGraphData();
var graphSeries=this.getGraphSeries();
var weekDays=7;
var plot=this.getPlot();
var componentId=this.getComponentId();
var graphDiv=componentId+"dialysisGraphContainer";
$("#"+componentId+"dialysisGraphContainer").bind("jqplotMouseMove",function(ev,gridpos,datapos,neighbor,plot){var x=gridpos.x;
var y=gridpos.y;
var plotWidth=plot._width;
var limitWidth=plotWidth-x;
var $tooltip=$("#"+graphDiv+" .jqplot-highlighter-tooltip");
if(limitWidth<200){$($tooltip).addClass("dialysis-tooltip-left");
}else{$($tooltip).removeClass("dialysis-tooltip-left");
}if(y<$($tooltip).height()){$($tooltip).css("top","0px");
}});
plot=$.jqplot(graphDiv,graphData,{series:graphSeries,axes:{xaxis:{pad:1,renderer:$.jqplot.DateAxisRenderer,tickRenderer:$.jqplot.CanvasAxisTickRenderer,tickOptions:{angle:-50,formatString:"%R"},min:"00:00:00",max:"23:59:59",ticks:["00:00:00","01:00:00","02:00:00","03:00:00","04:00:00","05:00:00","06:00:00","07:00:00","08:00:00","09:00:00","10:00:00","11:00:00","12:00:00","13:00:00","14:00:00","15:00:00","16:00:00","17:00:00","18:00:00","19:00:00","20:00:00","21:00:00","22:00:00","23:00:00","23:59:59"]},yaxis:{renderer:$.jqplot.CategoryAxisRenderer}},highlighter:{sizeAdjust:10,tooltipLocation:"ne",show:true},cursor:{show:false}});
this.setPlot(plot);
};
DialysisComponentWF.prototype.resizeComponent=function(){var plot=this.getPlot();
if(plot){plot.replot();
}};
DialysisComponentWF.prototype.getBannerHtml=function(){var dstAlertBanner=new MPageUI.AlertBanner();
var dstDtTm=this.getDSTDtTm();
var dstStartDate=dstDtTm.dstStart.format(dateFormat.masks.longDate);
var dstTime=dstDtTm.dstStart.format(dateFormat.masks.shortTime);
var primaryText=this.dialysisI18n.ALERT_BANNER_PRIMARY_TEXT.replace("{0}",dstStartDate);
primaryText=primaryText.replace("{1}",dstTime);
dstAlertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.INFO);
dstAlertBanner.setPrimaryText(primaryText);
dstAlertBanner.setSecondaryText(this.dialysisI18n.ALERT_BANNER_SECONDARY_TEXT);
return dstAlertBanner.render();
};
DialysisComponentWF.prototype.isDisplayBanner=function(startDate,endDate){var isDstObservedAtStartYear=MP_Timezone.isDSTObserved(startDate.getFullYear());
var isDstObservedAtEndYear=null;
var dstSwithch=null;
var isDisplayInfoBanner=false;
var dstDateTm=null;
if(startDate.getFullYear()===endDate.getFullYear()){isDstObservedAtEndYear=isDstObservedAtStartYear;
}else{isDstObservedAtEndYear=MP_Timezone.isDSTObserved(endDate.getFullYear());
}if(isDstObservedAtStartYear||isDstObservedAtEndYear){if(startDate.getFullYear()===endDate.getFullYear()){dstSwithch=MP_Timezone.getDstSwitches(startDate.getFullYear());
isDisplayInfoBanner=isDataChartedInDSTTime(startDate,endDate,dstSwithch);
if(isDisplayInfoBanner){dstDateTm=getDSTStartAndEndDtTm(startDate,endDate,dstSwithch);
this.setDSTDtTm(dstDateTm);
}}else{if(isDstObservedAtStartYear&&!isDstObservedAtEndYear){dstSwithch=MP_Timezone.getDstSwitches(startDate.getFullYear());
isDisplayInfoBanner=isDataChartedInDSTTime(startDate,endDate,dstSwithch);
if(isDisplayInfoBanner){dstDateTm=getDSTStartAndEndDtTm(startDate,endDate,dstSwithch);
this.setDSTDtTm(dstDateTm);
}}else{if(isDstObservedAtEndYear&&!isDstObservedAtStartYear){dstSwithch=MP_Timezone.getDstSwitches(endDate.getFullYear());
isDisplayInfoBanner=isDataChartedInDSTTime(startDate,endDate,dstSwithch);
if(isDisplayInfoBanner){dstDateTm=getDSTStartAndEndDtTm(startDate,endDate,dstSwithch);
this.setDSTDtTm(dstDateTm);
}}else{if(isDstObservedAtStartYear&&isDstObservedAtEndYear){dstSwithch=MP_Timezone.getDstSwitches(startDate.getFullYear());
isDisplayInfoBanner=isDataChartedInDSTTime(startDate,endDate,dstSwithch);
if(isDisplayInfoBanner){dstDateTm=getDSTStartAndEndDtTm(startDate,endDate,dstSwithch);
this.setDSTDtTm(dstDateTm);
}if(!isDisplayInfoBanner){dstSwithch=MP_Timezone.getDstSwitches(endDate.getFullYear());
isDisplayInfoBanner=isDataChartedInDSTTime(startDate,endDate,dstSwithch);
if(isDisplayInfoBanner){dstDateTm=getDSTStartAndEndDtTm(startDate,endDate,dstSwithch);
this.setDSTDtTm(dstDateTm);
}}}}}}}return isDisplayInfoBanner;
function isDataChartedInDSTTime(startDate,endDate,dstSwitch){var isDataChartedInDSTTimeFlag=false;
var dstFirstFrom=new Date(dstSwitch.first.from);
var dstFirstTo=new Date(dstSwitch.first.to);
var dstSecondFrom=new Date(dstSwitch.second.from);
var dstSecondTo=new Date(dstSwitch.second.to);
if(dstFirstFrom>=startDate&&dstFirstFrom<=endDate){isDataChartedInDSTTimeFlag=true;
}else{if(dstFirstTo>=startDate&&dstFirstTo<=endDate){isDataChartedInDSTTimeFlag=true;
}else{if(dstSecondFrom>=startDate&&dstSecondFrom<=endDate){isDataChartedInDSTTimeFlag=true;
}else{if(dstSecondTo>=startDate&&dstSecondTo<=endDate){isDataChartedInDSTTimeFlag=true;
}else{isDataChartedInDSTTimeFlag=false;
}}}}return isDataChartedInDSTTimeFlag;
}function getDSTStartAndEndDtTm(startDate,endDate,dstSwitch){var dstDetails={dstStart:null,dstEnd:null};
var dstFirstFrom=new Date(dstSwitch.first.from);
var dstFirstTo=new Date(dstSwitch.first.to);
var dstSecondFrom=new Date(dstSwitch.second.from);
var dstSecondTo=new Date(dstSwitch.second.to);
if(dstFirstFrom>=startDate&&dstFirstFrom<=endDate){dstDetails.dstStart=dstFirstFrom;
dstDetails.dstEnd=dstFirstTo;
}else{if(dstFirstTo>=startDate&&dstFirstTo<=endDate){dstDetails.dstStart=dstFirstFrom;
dstDetails.dstEnd=dstFirstTo;
}else{if(dstSecondFrom>=startDate&&dstSecondFrom<=endDate){dstDetails.dstStart=dstSecondFrom;
dstDetails.dstEnd=dstSecondTo;
}else{if(dstSecondTo>=startDate&&dstSecondTo<=endDate){dstDetails.dstStart=dstSecondFrom;
dstDetails.dstEnd=dstSecondTo;
}}}}return dstDetails;
}};
DialysisComponentWF.prototype.isDisplayAlertBanner=function(){return this.isDisplayBannerFlag;
};
DialysisComponentWF.prototype.setDisplayBanner=function(bannerFlag){this.isDisplayBannerFlag=bannerFlag;
};
DialysisComponentWF.prototype.stripTmZoneInfo=function(dateTime){var strIndex=0;
var daylightAbbr=MP_Timezone.getDaylightAbbreviation();
var stdAbbr=MP_Timezone.getStandardAbbreviation();
stripTmZone(daylightAbbr);
stripTmZone(stdAbbr);
return dateTime;
function stripTmZone(abbrevation){if(abbrevation){strIndex=dateTime.indexOf(abbrevation);
if(strIndex>0){dateTime=dateTime.slice(0,strIndex).trim();
}}}};
