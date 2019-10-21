function ImmunizationsO2ComponentStyle(){this.initByNamespace("immun-o2");
}ImmunizationsO2ComponentStyle.inherits(ComponentStyle);
function ImmunizationsO2Component(criterion){this.setCriterion(criterion);
this.setStyles(new ImmunizationsO2ComponentStyle());
this.setIncludeLineNumber(true);
this.setComponentLoadTimerName("USR:MPG.IMMUNIZATIONS.O2 - load component");
this.setComponentRenderTimerName("ENG:MPG.IMMUNIZATIONS.O2 - render component");
this.immunizationsTable=null;
this.immuni18n=i18n.discernabu.immunization_o2;
this.lastSelectedRow="";
this.bStartTimer=true;
this.patientDOB=this.getCriterion().getPatientInfo().getDOB();
this.m_personnelArray=null;
this.compNS=this.getStyles().getNameSpace();
this.compID=0;
this.resultCount=0;
}ImmunizationsO2Component.prototype=new MPageComponent();
ImmunizationsO2Component.prototype.constructor=MPageComponent;
ImmunizationsO2Component.prototype.postProcessing=function(){MPageComponent.prototype.postProcessing.call(this);
CERN_EventListener.fireEvent(this,this,EventListener.EVENT_COUNT_UPDATE,{count:this.resultCount});
};
ImmunizationsO2Component.prototype.processResultsForRender=function(immunRecs){var immunRecsLength=immunRecs.length;
var immunResult=null;
var dateTime=new Date();
var adminDate="--";
for(immunRecsLength;
immunRecsLength--;
){immunResult=immunRecs[immunRecsLength];
if(immunResult.ADMIN_DATE!==""){dateTime.setISO8601(immunResult.ADMIN_DATE);
adminDate=dateTime.format("shortDate3");
}immunResult.ADMIN_DATE_STRING=adminDate+(immunResult.ADMIN_DATE_MODIFIED?"<span class='res-modified'></span>":"");
immunResult.PATIENT_AGE=dateTime-this.patientDOB;
immunResult.PATIENT_AGE_STRING=this.calculateAge(dateTime);
var listLength=immunResult.NOTES.length;
for(var index=0;
index<listLength;
index++){var noteObj=immunResult.NOTES[index];
var provider=MP_Util.GetValueFromArray(noteObj.ACTION_PROV_ID,this.m_personnelArray);
var providerName=(provider===null)?"--":provider.fullName;
var notes=noteObj.TEXT.split("<br/>");
var notesLength=notes.length;
noteObj.NOTE=[];
var count=-1;
for(var noteIndex=0;
noteIndex<notesLength;
noteIndex++){var note=notes[noteIndex];
if(""===note){continue;
}var pos=note.indexOf("]");
var newNote=true;
var actionDate=null;
var action_date="";
if(pos>0){var noteDateString=note.substring(1,pos);
actionDate=new Date(noteDateString);
if(!isNaN(actionDate)){note=note.substring(pos+1,note.length);
action_date=actionDate.format("mediumDate");
}else{if(count>=0){newNote=false;
}}}else{if(count>=0){newNote=false;
}}if(newNote){if(action_date===""&&noteObj.ACTION_DATE){actionDate=new Date();
actionDate.setISO8601(noteObj.ACTION_DATE);
action_date=actionDate.format("mediumDate");
}count++;
noteObj.NOTE[count]={};
noteObj.NOTE[count].TEXT=note;
noteObj.NOTE[count].ACTION_DATE=action_date;
noteObj.NOTE[count].PROVIDER_NAME=providerName;
}else{if(count>=0&&noteObj.NOTE[count]){noteObj.NOTE[count].TEXT+="<br/>"+note;
}}}}}};
ImmunizationsO2Component.prototype.calculateAge=function(toDate){var component=this;
var calcMonthsDiff=function(){var removeCurYr=0;
var removeCurMon=0;
var monthDiff=0;
var fMonth=fromDate.getMonth();
var fDay=fromDate.getDate();
var tMonth=toDate.getMonth();
var tDay=toDate.getDate();
var dayDiff=tDay-fDay;
if(tMonth>fMonth){monthDiff=tMonth-fMonth;
if(tDay<fDay){removeCurMon=1;
}}else{if(tMonth<fMonth){monthDiff=12-fMonth+tMonth;
removeCurYr=1;
if(tDay<fDay){removeCurMon=1;
}}else{if(tDay<fDay){removeCurYr=1;
monthDiff=11;
}}}if(dayDiff<0){var tDate=new Date(toDate);
tDate.setMonth(fMonth+1,0);
dayDiff=tDate.getDate()-fDay+tDay;
}monthDiff+=((yearDiff-removeCurYr)*12)+(dayDiff/32)-removeCurMon;
return monthDiff;
};
var calcYearMonth=function(){var monthDiff=toDate.getMonth()-fromDate.getMonth();
var dayDiff=toDate.getDate()-fromDate.getDate();
if(dayDiff<0){--monthDiff;
}if(monthDiff<0){monthDiff+=12;
}var yearString=component.immuni18n.AGE_YEAR.replace("{0}",valYears);
var monthString=component.immuni18n.AGE_MONTH.replace("{0}",monthDiff);
return((valYears!==0&&monthDiff!==0)?yearString+" "+monthString:(monthDiff===0?yearString:monthString));
};
var calcMonthWeek=function(){var monthDiff=Math.floor(valMonths);
var weekDiff=Math.floor((valMonths-monthDiff)*32/7);
var monthString=component.immuni18n.AGE_MONTH.replace("{0}",monthDiff);
var weekString=component.immuni18n.AGE_WEEKS.replace("{0}",weekDiff);
return((monthDiff!==0&&weekDiff!==0)?monthString+" "+weekString:(monthDiff===0?weekString:monthString));
};
var calcWeekDay=function(){var weekDiff=valWeeks;
var dayDiff=valDays-(weekDiff*7);
var weekString=component.immuni18n.AGE_WEEKS.replace("{0}",weekDiff);
var dayString=component.immuni18n.AGE_DAYS.replace("{0}",dayDiff);
return((weekDiff!==0&&dayDiff!==0)?weekString+" "+dayString:(dayDiff===0?weekString:dayString));
};
var age="";
var fromDate=this.patientDOB;
var yearDiff=toDate.getFullYear()-fromDate.getFullYear();
var one_minute=1000*60;
var one_hour=one_minute*60;
var one_day=one_hour*24;
var one_week=one_day*7;
timeDiff=(toDate.getTime()-fromDate.getTime());
valHours=Math.floor(timeDiff/one_hour);
valDays=Math.floor(timeDiff/one_day);
valWeeks=Math.floor(timeDiff/one_week);
valMonths=calcMonthsDiff();
valYears=Math.floor(valMonths/12);
if(valYears>=2){age=calcYearMonth();
}else{if(valMonths>=2){age=calcMonthWeek();
}else{if(valWeeks>=2){age=calcWeekDay();
}else{if(valDays>=2){age=component.immuni18n.AGE_DAYS.replace("{0}",valDays);
}else{age=valHours>0?component.immuni18n.AGE_HOURS.replace("{0}",valHours):component.immuni18n.AGE_HOURS.replace("{0}","<24");
}}}}return age;
};
ImmunizationsO2Component.prototype.retrieveComponentData=function(){var sendAr=[];
var criterion=this.getCriterion();
sendAr.push("^MINE^",criterion.person_id+".0",criterion.provider_id+".0",criterion.encntr_id+".0",criterion.ppr_cd+".0",1);
MP_Core.XMLCclRequestWrapper(this,"mp_get_immunizations",sendAr,true);
};
ImmunizationsO2Component.prototype.addReadPane=function(){var component=this;
var compID=component.compID;
var compNS=component.compNS;
var initPane=function(){var jsHTML=[];
jsHTML.push("<div id="+compID+"rp-content class='"+compNS+"-rp-content'>");
jsHTML.push("<div id="+compID+"rp-title class='"+compNS+"-rp-title'/>");
jsHTML.push("<div id="+compID+"rp-scroll-container><div id="+compID+"rp-bottom-container>");
jsHTML.push("<div class='"+compNS+"-rp-main-separator'>");
jsHTML.push("<div id="+compID+"rp-history-separator class='"+compNS+"-rp-section-separator'>");
jsHTML.push("<span id="+compID+"rp-history-title-text class='"+compNS+"-rp-history-title-text'>"+component.immuni18n.HISTORY+"</span></div></div>");
jsHTML.push("<div id="+compID+"rp-history class='"+compNS+"-rp-history'/>");
jsHTML.push("<div id="+compID+"rp-comment-main-separator class='"+compNS+"-rp-main-separator'>");
jsHTML.push("<div id="+compID+"rp-comment-separator class='"+compNS+"-rp-section-separator'>");
jsHTML.push("<div id="+compID+"rp-comments-note-indicator class='"+compNS+"-rp-indicator'>&nbsp;</div>");
jsHTML.push("<span id="+compID+"rp-comments-title-text class='"+compNS+"-rp-comments-title-text'>"+component.immuni18n.COMMENTS+"</span></div></div>");
jsHTML.push("<div id="+compID+"rp-comments class='"+compNS+"-rp-comments'/>");
jsHTML.push("</div></div></div>");
jsHTML.push("<div id="+compID+"-rp-expand-collapse class='"+compNS+"-expand-collapse hidden'>");
jsHTML.push("<div id="+compID+"-rp-expand-collapse-icon class='"+compNS+"-expand-collapse-icon'></div></div>");
return jsHTML.join("");
};
var readPane=$("#"+compID+"readpane");
if(readPane.length>0){var pp=new MPageControls.PreviewPane(compNS,compID,readPane,initPane);
pp.renderPane();
var tableViewObj=$("#"+compID+"tableview");
var tableRowArr=tableViewObj.find(".result-info");
var rowId=-1;
rowId=this.getRowId(tableRowArr[0]);
this.updateInfo(tableRowArr[0],this.immunizationsTable.getRowById(rowId).getResultData(),true);
}};
ImmunizationsO2Component.prototype.addCellClickExtension=function(){var component=this;
var cellClickExtension=new TableCellClickCallbackExtension();
cellClickExtension.setCellClickCallback(function(event,data){component.onRowClick(event,data);
});
this.immunizationsTable.addExtension(cellClickExtension);
};
ImmunizationsO2Component.prototype.onRowClick=function(event,data){if(this.bStartTimer){var rowClickTimer=MP_Util.CreateTimer("CAP:MPG.IMMUNIZATIONS.O2");
if(rowClickTimer){rowClickTimer.Stop();
this.bStartTimer=false;
}}var selRow=$(event.target).parents("dl.result-info");
if(!selRow.length||data.RESULT_DATA===null){return;
}this.updateInfo(selRow,data.RESULT_DATA,false);
var expClpsIconObj=$("#"+this.compID+"-rp-expand-collapse-icon");
if(expClpsIconObj.hasClass(this.compNS+"-collapse")){var scrollContainer=$("#"+this.compID+"rp-scroll-container");
if(scrollContainer[0].scrollHeight>scrollContainer.height()){scrollContainer.css("margin-right",-20+"px");
}else{scrollContainer.css("margin-right",0+"px");
}}};
ImmunizationsO2Component.prototype.updateInfo=function(selRow,data,isInitialLoad){var rowId=this.getRowId(selRow);
if(this.lastSelectedRow===rowId){return;
}this.updateSelRowBgColor(selRow,isInitialLoad);
this.renderReadingPane(data);
this.lastSelectedRow=rowId;
};
ImmunizationsO2Component.prototype.renderReadingPane=function(data){var titleObj=$("#"+this.compID+"rp-title");
if(titleObj.length){titleObj[0].innerHTML="<span>"+data.NAME+"</span>";
}this.displayHistoryInfo(data);
this.displayCommentsInfo(data);
};
ImmunizationsO2Component.prototype.displayCommentsInfo=function(data){var jsHTML=[];
var listLength=data.NOTES.length;
var commentHeaderObj=$("#"+this.compID+"rp-comment-main-separator");
var commentsObj=$("#"+this.compID+"rp-comments");
if(!commentsObj.length){return;
}if(!listLength){commentsObj[0].innerHTML="";
commentHeaderObj.addClass("hidden");
return;
}if(commentHeaderObj.hasClass("hidden")){commentHeaderObj.removeClass("hidden");
}for(var index=0;
index<listLength;
index++){var noteObj=data.NOTES[index];
var noteLength=noteObj.NOTE.length;
for(noteLength;
noteLength--;
){var singleNoteObj=noteObj.NOTE[noteLength];
jsHTML.push("<span class='"+this.compNS+"-rp-comments-details'>"+singleNoteObj.ACTION_DATE+" ("+singleNoteObj.PROVIDER_NAME+")</span>");
jsHTML.push("<span class='"+this.compNS+"-rp-comments-text'>"+singleNoteObj.TEXT+"</span>");
}}commentsObj[0].innerHTML=jsHTML.join("");
};
ImmunizationsO2Component.prototype.displayHistoryInfo=function(data){var jsHTML=[];
var historyObj=$("#"+this.compID+"rp-history");
if(!historyObj.length){return;
}listLength=data.HISTORY.length;
for(var index=0;
index<listLength;
index++){var histObj=data.HISTORY[index];
var date=new Date();
var action_date="--";
var age="";
if(histObj.ADMIN_DATE!==""){date.setISO8601(histObj.ADMIN_DATE);
action_date=date.format("shortDate3");
}age=this.calculateAge(date);
jsHTML.push("<dl class='"+this.compNS+"-rp-history-content'>");
var modifyInd=(histObj.ADMIN_DATE_MODIFIED?"<span class='res-modified'></span>":"");
jsHTML.push("<dd class='"+this.compNS+"-rp-history-content-data'>"+action_date+modifyInd+"</dd>");
jsHTML.push("<dd class='"+this.compNS+"-rp-history-content-data'>"+age+"</dd>");
jsHTML.push("<dd class='"+this.compNS+"-rp-history-content-data'>");
var indicatorObject=histObj.HAS_NOTE?("<span class='"+this.compNS+"-rp-indicator'>&nbsp;</span>"):"";
jsHTML.push("<span class='"+this.compNS+"-rp-history-content-note-indicator'>"+this.getStatusText(histObj.RESULT_STATUS_CD)+"</span>"+indicatorObject+"</dd>");
jsHTML.push("</dl>");
}historyObj[0].innerHTML=jsHTML.join("");
};
ImmunizationsO2Component.prototype.getStatusText=function(status){var statusText="--";
switch(status){case 1:statusText=this.immuni18n.MODIFIED;
break;
case 2:statusText=this.immuni18n.ADMINISTERED;
break;
case 3:statusText=this.immuni18n.NOT_GIVEN;
break;
default:break;
}return statusText;
};
ImmunizationsO2Component.prototype.getRowId=function(rowObj){var rowId="";
var identifiers=$(rowObj).attr("id").split(":");
if(identifiers.length>0){rowId=identifiers[1];
}return rowId;
};
ImmunizationsO2Component.prototype.updateSelRowBgColor=function(selRowObj,isInitialLoad){var tableViewObj=$("#"+this.compID+"tableview");
var prevRow=tableViewObj.find(".selected");
if(prevRow.length>0&&this.lastSelectedRow===this.getRowId(prevRow)){prevRow.removeClass(this.compNS+"-row-selected");
prevRow.removeClass(this.compNS+"-row-selected-init");
prevRow.removeClass("selected");
}$(selRowObj).addClass(this.compNS+(isInitialLoad?"-row-selected-init":"-row-selected")+" selected");
};
ImmunizationsO2Component.prototype.resizeComponent=function(){this.collapsePane();
MPageComponent.prototype.resizeComponent.call(this,null);
var minHeight=251;
var $previewPane=$("#pp_"+this.compID+"_"+this.compNS);
var $tableViewObj=$("#"+this.compID+"tableview");
$previewPane.css({height:Math.max($tableViewObj.height(),minHeight)+"px"});
};
ImmunizationsO2Component.prototype.createColumn=function(colInfo){var column=new TableColumn();
column.setColumnId(colInfo.ID);
column.setCustomClass(colInfo.CLASS);
column.setColumnDisplay(colInfo.DISPLAY);
column.setPrimarySortField(colInfo.PRIMARY_SORT_FIELD);
column.setIsSortable(true);
column.addSecondarySortField(colInfo.SEC_SORT_FIELD,TableColumn.SORT.ASCENDING);
column.setRenderTemplate("${ "+colInfo.RENDER_TEMPLATE+"}");
return column;
};
ImmunizationsO2Component.prototype.attachListeners=function(){var component=this;
var expClpsIconObj=$("#"+this.compID+"-rp-expand-collapse-icon");
var expClpsBarObj=$("#"+this.compID+"-rp-expand-collapse");
var immunContent=$("#"+this.compNS+"Content"+this.compID);
var ppId="#pp_"+this.compID+"_"+this.compNS;
var ppObject=$(ppId);
immunContent.on("mouseenter",ppId,function(){if($(this)[0].scrollHeight-21>$(this)[0].offsetHeight){expClpsIconObj.addClass(component.compNS+"-expand");
expClpsIconObj.removeClass(component.compNS+"-collapse");
expClpsBarObj.removeClass("hidden");
}});
immunContent.on("mouseleave",ppId,function(){if(expClpsIconObj.hasClass(component.compNS+"-expand")){expClpsBarObj.addClass("hidden");
}});
expClpsIconObj.click(function(){component.onExpandCollapsePane();
});
ppObject.focusout(function(){var expClpsIconObj=$("#"+component.compID+"-rp-expand-collapse-icon");
if(!expClpsIconObj.hasClass(component.compNS+"-collapse")){return;
}if(!$("#"+component.compNS+component.compID).has($("*:focus")).length){component.collapsePane();
}else{ppObject.focus();
}});
};
ImmunizationsO2Component.prototype.onExpandCollapsePane=function(){var ppObject=$("#pp_"+this.compID+"_"+this.compNS);
if(!ppObject.length){return;
}var scrollContainer=$("#"+this.compID+"rp-scroll-container");
var contentObj=$("#"+this.compID+"rp-content");
var expClpsIconObj=$("#"+this.compID+"-rp-expand-collapse-icon");
var maincontainerobj=$("#"+this.compID+"maincontainer");
var $readPane=$("#"+this.compID+"readpane");
if(expClpsIconObj.hasClass(this.compNS+"-expand")){$readPane.css({position:"absolute"});
var minHeight=251;
var miscHeight=38;
var maxViewHeight=$("#vwpBody").height()-miscHeight*2.5;
var contentHeight=contentObj[0].offsetHeight;
var titleHeight=$("#"+this.compID+"rp-title")[0].offsetHeight;
var ppHeight=(contentHeight>maxViewHeight)?maxViewHeight:(contentHeight+miscHeight);
ppHeight=Math.max(ppHeight,minHeight);
ppObject.css("height",ppHeight+"px");
var maxheight=ppHeight-(titleHeight+miscHeight);
scrollContainer.css("max-height",maxheight+"px");
scrollContainer.addClass(this.compNS+"-on-expand");
if(scrollContainer[0].scrollHeight>scrollContainer.height()){scrollContainer.css("margin-right",-20+"px");
}expClpsIconObj.addClass(this.compNS+"-collapse");
expClpsIconObj.removeClass(this.compNS+"-expand");
ppObject.addClass(this.compNS+"-focusin");
}else{this.collapsePane();
$readPane.css({position:"relative"});
}};
ImmunizationsO2Component.prototype.collapsePane=function(){var expClpsIconObj=$("#"+this.compID+"-rp-expand-collapse-icon");
var scrollContainer=$("#"+this.compID+"rp-scroll-container");
if(expClpsIconObj.hasClass(this.compNS+"-collapse")){var infoHeight=$("#"+this.compID+"tableview").height();
var expClpsBarObj=$("#"+this.compID+"-rp-expand-collapse");
var ppObject=$("#pp_"+this.compID+"_"+this.compNS);
var maincontainerobj=$("#"+this.compID+"maincontainer");
ppObject.css("height",Math.max(251,infoHeight-4)+"px");
scrollContainer.css("max-height","none");
scrollContainer.removeClass(this.compNS+"-on-expand");
scrollContainer.css("margin-right",0+"px");
expClpsIconObj.removeClass(this.compNS+"-collapse");
expClpsBarObj.addClass("hidden");
ppObject.removeClass(this.compNS+"-focusin");
}};
ImmunizationsO2Component.prototype.renderComponent=function(recordData){var timerRenderComponent=MP_Util.CreateTimer(this.getComponentRenderTimerName(),this.getCriterion().category_mean);
var jsHtml=[];
var countText="";
var component=this;
try{this.compID=this.getComponentId();
this.m_personnelArray=MP_Util.LoadPersonelListJSON(recordData.PRSNL);
jsHtml.push("<div id ='"+this.compID+"maincontainer' class ='"+this.compNS+"-maincontainer "+this.compNS+"-maincontainer-position'>");
jsHtml.push("<div id='"+this.compID+"tableview' class='"+this.compNS+"-table'>");
this.processResultsForRender(recordData.IMMUN);
this.immunizationsTable=new ComponentTable();
this.immunizationsTable.setNamespace(this.compNS+this.compID);
var vaccineColInfo={ID:"VACCINE",CLASS:this.compNS+"-vaccine",DISPLAY:this.immuni18n.VACCINE,PRIMARY_SORT_FIELD:"NAME",SEC_SORT_FIELD:"",RENDER_TEMPLATE:"NAME"};
var lastAdminDateColInfo={ID:"LAST_ADMIN_DATE",CLASS:this.compNS+"-last-admin-date",DISPLAY:this.immuni18n.LAST_ADMIN_DATE,PRIMARY_SORT_FIELD:"ADMIN_DATE",SEC_SORT_FIELD:"ADMIN_DATE",RENDER_TEMPLATE:"ADMIN_DATE_STRING"};
var patientAgeColInfo={ID:"PATIENT_AGE",CLASS:this.compNS+"-patient-age",DISPLAY:this.immuni18n.PATIENT_AGE,PRIMARY_SORT_FIELD:"PATIENT_AGE",SEC_SORT_FIELD:"NAME",RENDER_TEMPLATE:"PATIENT_AGE_STRING"};
this.immunizationsTable.addColumn(this.createColumn(vaccineColInfo));
this.immunizationsTable.addColumn(this.createColumn(lastAdminDateColInfo));
this.immunizationsTable.addColumn(this.createColumn(patientAgeColInfo));
this.immunizationsTable.bindData(recordData.IMMUN);
this.setComponentTable(this.immunizationsTable);
this.immunizationsTable.sortByColumnInDirection("VACCINE",TableColumn.SORT.ASCENDING);
this.addCellClickExtension();
this.resultCount=recordData.IMMUN_CNT;
countText=MP_Util.CreateTitleText(this,this.resultCount);
jsHtml.push(this.immunizationsTable.render());
jsHtml.push("</div>");
jsHtml.push("<div id='"+this.compID+"readpane' class='"+this.compNS+"-readpane'></div></div>");
this.finalizeComponent(jsHtml.join(""),countText);
this.addReadPane();
var $previewPane=$("#pp_"+this.compID+"_"+this.compNS);
$previewPane.css({width:"100%"});
this.attachListeners();
this.immunizationsTable.toggleColumnSort=function(columnId){ComponentTable.prototype.toggleColumnSort.call(this,columnId);
var tableViewObj=$("#"+component.compID+"tableview");
var tableRowArr=tableViewObj.find(".result-info");
var rowId=-1;
rowId=component.getRowId(tableRowArr[0]);
component.lastSelectedRow="";
component.updateInfo(tableRowArr[0],component.immunizationsTable.getRowById(rowId).getResultData(),true);
};
}catch(err){if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}};
MP_Util.setObjectDefinitionMapping("WF_IMMUNIZATIONS",ImmunizationsO2Component);