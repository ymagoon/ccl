function NotesRemindersComponentStyle(){this.initByNamespace("nr");
}NotesRemindersComponentStyle.prototype=new ComponentStyle();
NotesRemindersComponentStyle.prototype.constructor=ComponentStyle;
function NotesRemindersComponent(criterion){this.setCriterion(criterion);
this.setStyles(new NotesRemindersComponentStyle());
this.setComponentLoadTimerName("USR:MPG.NOTES_REMINDERS.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.NOTES_REMINDERS.O1 - render component");
this.setIncludeLineNumber(true);
this.setScope(1);
this.m_stickyNoteTypeCodes=null;
this.m_stickyNoteFilter=true;
this.setPregnancyLookbackInd(true);
this.resultsCount=0;
this.notesCount=0;
this.remindersCount=0;
this.notesI18n=i18n.discernabu.notesreminders_o1;
this.isOrganizerLevel=false;
this.myAssignedRemindersFlag=true;
this.myAssignedProcessedReminders=null;
this.processedReminders=null;
this.assignedPrsnl="";
this.assignedID=0;
this.validSubTypes=[];
this.subType=this.notesI18n.ALL_SUBTYPES;
this.subtypetimeOut=null;
this.lookforwardCode=0;
this.isRenderComponentTable=false;
this.remindersTable=null;
this.m_viewableEncntrs="";
this.setResourceRequired(true);
this.setViewFlag();
this.provider_id=criterion.provider_id;
NotesRemindersComponent.method("RetrieveRequiredResources",function(){if(this.isOrganizerLevel){this.retrieveComponentData();
}else{var veObj=MP_Core.GetViewableEncntrs(this.getCriterion().person_id);
if(veObj.isResourceAvailable()&&veObj.getResourceData()){this.setViewableEncntrs(veObj.getResourceData());
this.retrieveComponentData();
}else{CERN_EventListener.addListener(this,"viewableEncntrInfoAvailable",this.HandleViewableEncounters,this);
}}});
NotesRemindersComponent.method("setViewableEncntrs",function(value){this.m_viewableEncntrs=value;
});
NotesRemindersComponent.method("getViewableEncntrs",function(){return(this.m_viewableEncntrs);
});
NotesRemindersComponent.method("setStickyNoteTypeCodes",function(value){this.m_stickyNoteTypeCodes=value;
});
NotesRemindersComponent.method("addStickyNoteTypeCode",function(value){if(this.m_stickyNoteTypeCodes===null){this.m_stickyNoteTypeCodes=[];
}this.m_stickyNoteTypeCodes.push(value);
});
NotesRemindersComponent.method("getStickyNoteTypeCodes",function(){return this.m_stickyNoteTypeCodes;
});
}NotesRemindersComponent.prototype=new MPageComponent();
NotesRemindersComponent.prototype.constructor=MPageComponent;
NotesRemindersComponent.prototype.setStickyNotesFilter=function(value){this.m_stickyNoteFilter=value;
};
NotesRemindersComponent.prototype.getStickyNotesFilter=function(){return this.m_stickyNoteFilter;
};
NotesRemindersComponent.prototype.createComponentLookForward=function(){var rComponent=this;
var lookforwardItems=[this.notesI18n.ALL,this.notesI18n.TODAY,this.notesI18n.TOMORROW,this.notesI18n.NEXT_WEEK,this.notesI18n.NEXT_MONTH,this.notesI18n.NEXT_YEAR];
var uniqueComponentId=this.getComponentId();
var staticContentLocation=this.getCriterion().static_content;
function handleLookforwardClick(menuItem,lookforwardItem){return function(){var menuItems=lookforwardMenu.getMenuItemArray();
for(var i=0;
i<menuItems.length;
i++){menuItems[i].setIsSelected(false);
}menuItem.setIsSelected(true);
$("#lookforwardDisplay"+uniqueComponentId).html(lookforwardItem);
rComponent.lookforwardCode=lookforwardItems.indexOf(lookforwardItem);
rComponent.filterReminders();
};
}var lookforwardDisplayText=this.notesI18n.ALL;
var lookforwardId="lookforwardDisplay"+uniqueComponentId;
var lookforwardContainer=$("<div></div>").attr("id","lookforwardContainer"+uniqueComponentId);
lookforwardContainer.append($("<span></span>").attr("id","resultRange"+uniqueComponentId).html(this.notesI18n.RESULT_RANGE+": ").css("padding-right","2px"));
lookforwardContainer.append($("<span></span>").attr({id:lookforwardId,"class":"nr-lookforward"}).html(lookforwardDisplayText));
var lookforwardMenu=new Menu("lookforwardMenu"+uniqueComponentId);
lookforwardMenu.setAnchorElementId("lookforwardMenu"+uniqueComponentId);
lookforwardMenu.setAnchorConnectionCorner(["bottom","left"]);
lookforwardMenu.setContentConnectionCorner(["top","left"]);
lookforwardMenu.setIsRootMenu(true);
for(var x=0;
x<lookforwardItems.length;
x++){var lookforwardItem=lookforwardItems[x];
var lookforwardMenuSelector=new MenuSelection("lookforwardMenuItem"+uniqueComponentId+"-"+x);
lookforwardMenuSelector.setCloseOnClick(true);
lookforwardMenuSelector.setLabel(lookforwardItem);
lookforwardMenuSelector.setClickFunction(handleLookforwardClick(lookforwardMenuSelector,lookforwardItem));
lookforwardMenu.addMenuItem(lookforwardMenuSelector);
}MP_MenuManager.updateMenuObject(lookforwardMenu);
if(this.isOrganizerLevel){staticContentLocation=staticContentLocation+"/UnifiedContent";
}var lookforwardDropDown=$("<a></a>").append($("<img></img>").attr({id:"lookforwardMenu"+uniqueComponentId,src:staticContentLocation+"/images/3943_16.gif"}));
lookforwardDropDown.click(function(){if(!lookforwardMenu.isActive()){MP_MenuManager.showMenu("lookforwardMenu"+uniqueComponentId);
}else{MP_MenuManager.closeMenuStack(true);
}});
lookforwardDropDown.appendTo(lookforwardContainer);
return lookforwardContainer;
};
NotesRemindersComponent.prototype.postProcessing=function(){MPageComponent.prototype.postProcessing.call(this);
if(this.remindersCount===0){CERN_EventListener.fireEvent(this,this,EventListener.EVENT_COUNT_UPDATE,{count:0});
}};
NotesRemindersComponent.prototype.setViewFlag=function(){var criterion=this.getCriterion();
this.isOrganizerLevel=(criterion.person_id===0&&criterion.encntr_id===0&&criterion.ppr_cd===0);
var self=this;
var compId=this.getComponentId();
if(this.isOrganizerLevel){$(document).on("careManagerSelected",function(event){self.provider_id=event.careManagerId;
self.retrieveComponentData();
});
}};
NotesRemindersComponent.prototype.HandleViewableEncounters=function(event,srObj){if(srObj.isResourceAvailable()&&srObj.getResourceData()){this.setViewableEncntrs(srObj.getResourceData());
this.retrieveComponentData();
}else{var errMsg="No viewable encounters available for this patient";
this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(),errMsg),(this.isLineNumberIncluded()?"(0)":""));
}};
NotesRemindersComponent.prototype.loadFilterMappings=function(){this.addFilterMappingObject("DEFINE_STICKY_NOTE",{setFunction:this.setStickyNotesFilter,type:"Boolean",field:"FREETEXT_DESC"});
};
NotesRemindersComponent.prototype.retrieveComponentData=function(){var compId=this.getComponentId();
var criterion=this.getCriterion();
var sStickyNoteTypes=MP_Util.CreateParamArray(this.getStickyNoteTypeCodes(),1);
var prsnlInfo=criterion.getPersonnelInfo();
var encntrs=this.getViewableEncntrs();
var encntrVal=(encntrs)?"value("+encntrs+")":"0.0";
var lookbackUnits=(this.getLookbackUnits())?this.getLookbackUnits():"0";
var lookbackUnitTypeFlag=this.getLookbackUnitTypeFlag();
var loadTimer=new RTMSTimer(this.getComponentLoadTimerName(),criterion.category_mean);
var self=this;
this.validSubTypes=[];
var scriptRequest=new ScriptRequest();
scriptRequest.setProgramName("MP_RETRIEVE_NOTE_REMINDER_JSON");
scriptRequest.setParameterArray(["^MINE^",criterion.person_id+".0",sStickyNoteTypes,15,encntrVal,lookbackUnits,lookbackUnitTypeFlag,this.provider_id+".0",criterion.ppr_cd+".0"]);
scriptRequest.setLoadTimer(loadTimer);
scriptRequest.setResponseHandler(function(scriptReply){$("#"+compId+"subtypeDropdown").remove();
if(scriptReply.getStatus()=="S"){self.renderComponent(scriptReply.getResponse());
}else{$("#filterSubType"+compId).remove();
$("#optsMenupersonalize"+compId).removeClass("opts-personalize-sec-divider");
self.finalizeComponent(self.generateNoDataFoundHTML(),(self.isLineNumberIncluded()?"(0)":""));
}});
scriptRequest.performRequest();
};
NotesRemindersComponent.prototype.createPatientChartViewerLink=function(personId,encntrId,patientName){var patientLink="";
if(personId){if(!CERN_Platform.inMillenniumContext()){patientLink=patientName;
}else{patientLink="<a href=\"javascript:APPLINK(0,'Powerchart.exe','/PERSONID="+personId+" /ENCNTRID="+encntrId+" /FIRSTTAB=^^')\">"+patientName+"</a>";
}}return patientLink;
};
NotesRemindersComponent.prototype.createReminderViewerLink=function(taskId,taskUID,compId,msgSub,readOnly,assignedID){var subjectLink="";
if(taskId>0){if(!CERN_Platform.inMillenniumContext()){subjectLink=msgSub;
}else{subjectLink="<a id="+taskId+" onclick='NotesRemindersComponent.prototype.launchReminderViewer("+taskId+',"'+taskUID+'",'+compId+","+assignedID+","+readOnly+","+this.isOrganizerLevel+"); return false;' href='#'>"+msgSub+"</a>";
}return(subjectLink);
}};
NotesRemindersComponent.prototype.launchReminderViewer=function(taskId,taskUID,compId,pId,readOnly,viewFlag){var comp=MP_Util.GetCompObjById(compId);
try{var viewerObj=CERN_Platform.getDiscernObject("PVVIEWERMPAGE");
MP_Util.LogDiscernInfo(null,"PVVIEWERMPAGE","notesreminders.js","launchReminderViewer");
if(viewFlag){if(typeof viewerObj.LaunchRemindersWithUIDViewer==="undefined"){viewerObj.LaunchRemindersViewer(taskId);
}else{viewerObj.LaunchRemindersWithUIDViewer(taskUID,readOnly);
}}else{if(typeof viewerObj.LaunchRemindersWithOwnerViewer==="undefined"){viewerObj.LaunchRemindersViewer(taskId);
}else{viewerObj.LaunchRemindersWithOwnerViewer(taskId,pId,readOnly);
}}if(!readOnly){comp.retrieveComponentData();
}}catch(err){MP_Util.LogJSError(err,comp,"notesreminders.js","launchReminderViewer");
}};
NotesRemindersComponent.prototype.isAssignedToReminder=function(task){var pId=this.getCriterion().provider_id;
if(task.ASSIGN_PRSNL_LIST.length===0){task.ASSIGNED="&nbsp;";
task.ASSIGNEDID=pId;
task.READONLY=false;
return true;
}for(var l=task.ASSIGN_PRSNL_LIST.length;
l--;
){if(task.ASSIGN_PRSNL_LIST[l].ASSIGN_PRSNL_ID===pId){task.ASSIGNED=task.ASSIGN_PRSNL_LIST[l].ASSIGN_PRSNL_NAME;
task.ASSIGNEDID=pId;
task.READONLY=false;
return true;
}}if(task.ASSIGN_PRSNL_LIST.length===1){task.ASSIGNED=task.ASSIGN_PRSNL_LIST[0].ASSIGN_PRSNL_NAME;
}else{task.ASSIGNED=this.notesI18n.MULTIPLE;
}task.READONLY=true;
task.ASSIGNEDID=task.ASSIGN_PRSNL_LIST[0].ASSIGN_PRSNL_ID;
return false;
};
NotesRemindersComponent.prototype.getPriorityIcon=function(){var ar=["<span class='res-severe'><span class='res-ind'>&nbsp;</span></span>"];
return ar.join("");
};
NotesRemindersComponent.prototype.SortReminders=function(a,b){if(a.SCHEDULED_DT_TM>b.SCHEDULED_DT_TM){return -1;
}else{if(a.SCHEDULED_DT_TM<b.SCHEDULED_DT_TM){return 1;
}else{if(a.TASK_DT_TM>b.TASK_DT_TM){return -1;
}else{if(a.TASK_DT_TM<b.TASK_DT_TM){return 1;
}}}}return 0;
};
NotesRemindersComponent.prototype.processResultsForRender=function(recordData){var self=this;
var compId=this.getComponentId();
var compNS=this.getStyles().getNameSpace();
var reminders=recordData.REMINDERS;
var prsnlArray=recordData.PRSNL;
var remLength=reminders.length;
var curDate=new Date();
var validReminders=[];
var validMyReminders=[];
var subjectLink="";
var readOnly="";
var overdueOverride=compNS+"-overdue-override";
if(remLength>0){reminders.sort(this.SortReminders);
}for(var x=0;
x<remLength;
x++){var reminder=reminders[x];
var remindDate=new Date();
remindDate.setISO8601(reminder.REMIND_DT_TM);
if(remindDate&&remindDate<=curDate){var msgSubj=reminder.MSG_SUBJECT;
var taskId=reminder.TASK_ID;
var taskUID=reminder.TASK_UID;
var overdueClass="";
var df=MP_Util.GetDateFormatter();
var dueDateDisplay="";
var dueDate=(reminder.SCHEDULED_DT_TM.search("0000-00-00")!==-1)?null:new Date();
if(dueDate){dueDate.setISO8601(reminder.SCHEDULED_DATE);
dueDateDisplay=df.format(dueDate,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
overdueClass=(dueDate<=curDate)?"res-severe":"";
}else{dueDateDisplay="--";
}reminder.DUE_DATE_DISPLAY="<span class = '"+overdueClass+"' 'nr-content'>"+dueDateDisplay+"</span>";
if(reminder.STAT_IND===1){reminder.PRIORITY_DISPLAY=self.getPriorityIcon();
}this.isAssignedToReminder(reminder);
readOnly=reminder.READONLY;
assignedID=reminder.ASSIGNEDID;
subjectLink=(msgSubj!=="")?self.createReminderViewerLink(taskId,taskUID,compId,msgSubj,((this.isOrganizerLevel)?false:readOnly),assignedID):"("+self.notesI18n.NO_SUBJECT+")";
var subtypeDisplay=reminder.TASK_SUBTYPE_DISPLAY;
if(subtypeDisplay){if(self.validSubTypes.indexOf(subtypeDisplay)===-1){self.validSubTypes.push(subtypeDisplay);
}}reminder.SUBJECT_SUBTYPE_DISPLAY="<span class = '"+overdueClass+"' 'nr-content'>"+subjectLink+"</span> <br><span class = '"+overdueOverride+"' 'nr-content'>"+(subtypeDisplay?subtypeDisplay:"&nbsp;")+"</span>";
reminder.ASSIGNED_DISPLAY="<span class = '"+overdueClass+"' 'nr-content'>"+reminder.ASSIGNED+"</span>";
if(self.isOrganizerLevel){var patientName=reminder.PERSON_NAME;
var personId=reminder.PATIENT_ID;
var encntrId=reminder.ENCNTR_ID;
var patientLink="--";
var patientDOB="--";
var patientMRN="--";
if(reminder.PATIENT_ID>0&&reminder.PERSON_NAME){patientLink="<span class = '"+overdueClass+"' 'nr-content'><b>"+self.createPatientChartViewerLink(personId,encntrId,patientName)+" </b></span>";
if(reminder.MRN){patientMRN=reminder.MRN;
}}var patientGender=reminder.GENDER.charAt(0);
var patientAge="&nbsp;";
var parseBirthDate=Date.parse(reminder.BIRTH_DATE);
if(!isNaN(parseBirthDate)){var patientBirthDtTm=new Date();
patientBirthDtTm.setISO8601(reminder.BIRTH_DATE);
patientAge=MP_Util.CalcAge(patientBirthDtTm,new Date()).replace(" ","&nbsp;");
patientDOB=patientBirthDtTm.format(dateFormat.masks.shortdate);
}reminder.PATIENT_INFO=patientLink+patientAge+"&nbsp;"+patientGender+"<br>"+self.notesI18n.DOB+":&nbsp;"+patientDOB+" "+self.notesI18n.MRN+":&nbsp;"+patientMRN;
}validReminders.push(reminder);
if(self.isAssignedToReminder(reminder)){validMyReminders.push(reminder);
}}}this.myAssignedProcessedReminders=validMyReminders;
this.processedReminders=validReminders;
this.remindersCount=(this.isOrganizerLevel)?validReminders.length:validMyReminders.length;
};
NotesRemindersComponent.prototype.filterReminders=function(){var compId=this.getComponentId();
var reminders=this.processedReminders;
if(!this.isOrganizerLevel&&this.myAssignedRemindersFlag){reminders=this.myAssignedProcessedReminders;
}reminders=this.filterRemindersByForwardDate(reminders);
if(this.subType===this.notesI18n.ALL_SUBTYPES){this.remindersTable.bindData(reminders);
this.remindersCount=reminders.length;
$("#reminderCount").text(this.notesI18n.REMINDERS+" ("+this.remindersCount+")");
}else{var newReminders=[];
for(var x=0;
x<reminders.length;
x++){var reminder=reminders[x];
if(reminder.TASK_SUBTYPE_DISPLAY===this.subType){newReminders.push(reminder);
}}this.remindersTable.bindData(newReminders);
this.remindersCount=newReminders.length;
$("#reminderCount").text(this.notesI18n.REMINDERS+" ("+this.remindersCount+"), "+this.subType);
}if(this.isRenderComponentTable){this.isRenderComponentTable=false;
$("#"+compId+"tableview").html(this.remindersTable.render());
}else{this.remindersTable.refresh();
}this.resultsCount=this.remindersCount+this.notesCount;
$("#nr"+compId+" .sec-total").text("("+this.resultsCount+")");
if(!this.isOrganizerLevel){if(this.myAssignedRemindersFlag){$("#nr"+compId+"table .nr-assignedto").hide();
this.reSizeColumns(67,25);
}else{$("#nr"+compId+"table .nr-assignedto").show();
this.reSizeColumns(45,21);
}}};
NotesRemindersComponent.prototype.filterRemindersByForwardDate=function(reminders){var filterDate=new Date();
filterDate.setHours(23,59,59);
switch(this.lookforwardCode){case 1:break;
case 2:filterDate.setDate(filterDate.getDate()+1);
break;
case 3:filterDate.setDate(filterDate.getDate()+7);
break;
case 4:filterDate.setMonth(filterDate.getMonth()+1);
break;
case 5:filterDate.setFullYear(filterDate.getFullYear()+1);
break;
default:return reminders;
}var filteredReminders=[];
for(var i=0;
i<reminders.length;
i++){var reminder=reminders[i];
var dueDate=(reminder.SCHEDULED_DT_TM.search("0000-00-00")!==-1)?null:new Date();
if(dueDate){dueDate.setISO8601(reminder.SCHEDULED_DATE);
if(dueDate<=filterDate){filteredReminders.push(reminder);
}}else{filteredReminders.push(reminder);
}}return filteredReminders;
};
NotesRemindersComponent.prototype.reSizeColumns=function(subjectWidth,dueDateWidth){var compId=this.getComponentId();
$("#nr"+compId+"table .nr-subject").css({width:subjectWidth+"%"});
$("#nr"+compId+"table .nr-due-date").css({width:dueDateWidth+"%"});
};
NotesRemindersComponent.prototype.generateSubtypeDropdown=function(){var compId=this.getComponentId();
var compNS=this.getStyles().getNameSpace();
var subTypesHtml="<div id ='"+compId+"subtypeDropdown' style='display:none' ><div id='"+compId+this.notesI18n.ALL_SUBTYPES+"' class='nr-opts-menu-subtype-item'>"+this.notesI18n.ALL_SUBTYPES+"</div>";
for(var i=0;
i<this.validSubTypes.length;
i++){subTypesHtml=subTypesHtml+"<div id='"+compId+this.validSubTypes[i]+"' class='nr-opts-menu-subtype-item'>"+this.validSubTypes[i]+"</div>";
}subTypesHtml=subTypesHtml+"</div>";
return subTypesHtml;
};
NotesRemindersComponent.prototype.generateNotesHtml=function(recordData){var notesHtml=[];
var noteCnt=0;
var notes=recordData.NOTES;
var personnelArray=MP_Util.LoadPersonelListJSON(recordData.PRSNL);
var xl=notes.length;
if(notes.length>0){notesHtml.push("<dl class='nr-info-hdr hdr'><dd class='nr-auth-hd nr-wrap'><span>",this.notesI18n.AUTHOR,"</span></dd><dd class='nr-dt-hd nr-wrap'><span>",this.notesI18n.DATE,"</span></dd><dd class='nr-txt-hd nr-wrap'><span>",this.notesI18n.TEXT,"</span></dd></dl>");
for(var x=0;
x<xl;
x++){noteCnt=noteCnt+1;
var note=notes[x];
var prov=MP_Util.GetValueFromArray(note.AUTHOR_ID,personnelArray);
var authorName=(prov)?prov.fullName:"";
var notesDate=(note.NOTE_DATE!=="")?MP_Util.GetDateFormatter().formatISO8601(note.NOTE_DATE,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR):"";
notesHtml.push("<dl class='nr-info'><dd class='nr-auth nr-wrap'><span>",authorName,"</span></dd><dd class='nr-dt nr-wrap'><span class='date-time'>",notesDate,"</span></dd><dd class='nr-txt nr-wrap'><span>",note.TEXT,"</span></dd></dl>");
}}this.notesCount=noteCnt;
return notesHtml;
};
NotesRemindersComponent.prototype.renderComponent=function(reply){var self=this;
var compId=this.getComponentId();
var compNS=this.getStyles().getNameSpace();
var errMsg=[];
var recordData=reply;
var timerRenderComponent=null;
var remindersHtml=[];
var df=MP_Util.GetDateFormatter();
try{timerRenderComponent=MP_Util.CreateTimer(this.getComponentRenderTimerName());
var notesHtml=[];
if(!this.isOrganizerLevel&&this.m_stickyNoteFilter){notesHtml=this.generateNotesHtml(recordData);
}remindersHtml.push("<div id ='"+compId+"mainContainer' class ='"+compNS+"-maincontainer "+compNS+"-maincontainer-position'>");
remindersHtml.push("<div id ='"+compId+"tableview' class='"+compNS+"-table'>");
this.processResultsForRender(recordData);
this.remindersTable=new ComponentTable();
this.remindersTable.setNamespace(this.getStyles().getId());
var priorityColumn=this.createRemindersColumn("PRIORITY","nr-priority nr-rem-wrap",this.getPriorityIcon(),"${ PRIORITY_DISPLAY }");
var patientColumn=this.createRemindersColumn("PATIENT","nr-patient nr-rem-wrap",this.notesI18n.PATIENT,"${ PATIENT_INFO }");
var subject_subtypecolumn=this.createRemindersColumn("SUBJECT_SUBTYPE","nr-subject nr-rem-wrap",this.notesI18n.SUBJECT+" / "+this.notesI18n.SUBTYPE,"${ SUBJECT_SUBTYPE_DISPLAY }");
var dueDateColumn=this.createRemindersColumn("DUEDATE","nr-due-date nr-rem-wrap",this.notesI18n.DUE,"${ DUE_DATE_DISPLAY }");
var assignedColumn=this.createRemindersColumn("ASSIGNED","nr-assignedto nr-rem-wrap",this.notesI18n.ASSIGNED,"${ ASSIGNED_DISPLAY }");
this.remindersTable.addColumn(priorityColumn);
if(this.isOrganizerLevel){this.remindersTable.addColumn(patientColumn);
this.remindersTable.addColumn(subject_subtypecolumn);
this.remindersTable.addColumn(dueDateColumn);
}else{this.remindersTable.addColumn(subject_subtypecolumn);
this.remindersTable.addColumn(dueDateColumn);
this.remindersTable.addColumn(assignedColumn);
}if(!this.myAssignedRemindersFlag||this.subType!==this.notesI18n.ALL_SUBTYPES){this.filterReminders();
}else{if(this.isOrganizerLevel){this.remindersTable.bindData(this.processedReminders);
}else{this.remindersTable.bindData(this.myAssignedProcessedReminders);
this.isRenderComponentTable=(this.myAssignedProcessedReminders.length===0)?true:false;
}}this.setComponentTable(this.remindersTable);
this.remindersTable.sortByColumnInDirection("PRIORITY",TableColumn.SORT.DESCENDING);
remindersHtml.push(this.remindersTable.render());
var filterSubTypeDivId="filterSubType"+compId;
var dropDowDivId="#"+compId+"subtypeDropdown";
if(this.validSubTypes.length>0){this.addMenuOption(filterSubTypeDivId,filterSubTypeDivId,self.notesI18n.FILTER_SUBTYPE,false,"mouseenter",function(){clearTimeout(self.subtypetimeOut);
$(dropDowDivId).addClass("nr-opts-menu-content");
$(dropDowDivId).show();
});
}var assignedRemindersDivId="myReminders"+compId;
if(!this.isOrganizerLevel){this.addMenuOption(assignedRemindersDivId,assignedRemindersDivId,self.notesI18n.MY_REMINDERS,false,"click",function(){self.myAssignedRemindersFlag=!(self.myAssignedRemindersFlag);
if(self.myAssignedRemindersFlag){$("#"+assignedRemindersDivId).append("<span class='opts-menu-def-exp'>&nbsp;</span>");
}else{$("#"+assignedRemindersDivId).find("span").remove();
}self.filterReminders();
});
}this.createMenu();
if(this.myAssignedRemindersFlag){$("#"+assignedRemindersDivId).append("<span class='opts-menu-def-exp'>&nbsp;</span>");
}var jsNrHTML=[];
if(!this.isOrganizerLevel&&this.m_stickyNoteFilter){jsNrHTML=["<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='",this.notesI18n.HIDE_SECTION,"'>-</span><span class='sub-sec-title'>",this.notesI18n.STICKY_NOTES," (",this.notesCount,")</span></h3><div class='sub-sec-content'>",notesHtml.join(""),"</div></div><div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='",this.notesI18n.HIDE_SECTION,"'>-</span><span class='sub-sec-title' id ='reminderCount'>",this.notesI18n.REMINDERS," (",this.remindersCount,")</span></h3><div class='sub-sec-content'>",remindersHtml.join(""),"</div></div></div>"];
}else{jsNrHTML=["<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='",this.notesI18n.HIDE_SECTION,"'>-</span><span class='sub-sec-title' id ='reminderCount'>",this.notesI18n.REMINDERS," (",this.remindersCount,")</span></h3><div class='sub-sec-content'>",remindersHtml.join(""),"</div></div></div>"];
}this.resultsCount=this.remindersCount+this.notesCount;
this.finalizeComponent(jsNrHTML.join(""),MP_Util.CreateTitleText(this,this.resultsCount));
CERN_EventListener.fireEvent(this,this,EventListener.EVENT_COUNT_UPDATE,{count:this.remindersCount});
$("#moreOptMenu"+compId).append(self.generateSubtypeDropdown());
if(!this.isOrganizerLevel&&this.myAssignedRemindersFlag){$("#nr"+compId+"table .nr-assignedto").hide();
this.reSizeColumns(67,25);
}$(dropDowDivId).mouseenter(function(){clearTimeout(self.subtypetimeOut);
$(dropDowDivId).addClass("nr-opts-menu-content");
$(dropDowDivId).show();
});
$("#"+filterSubTypeDivId).mouseleave(function(){self.subtypetimeOut=setTimeout(function(){$(dropDowDivId).hide();
},200);
});
$(dropDowDivId).mouseleave(function(){self.subtypetimeOut=setTimeout(function(){$(dropDowDivId).hide();
},333);
});
$("#"+compId+"subtypeDropdown > div").on("click",function(e){self.subType=$(this).text();
self.filterReminders();
$(dropDowDivId).hide();
});
$("#sttnr"+compId).html(this.createComponentLookForward());
$("#nrContent"+compId).css({overflow:"auto"});
$("#nrContent"+compId).children().css({"min-width":"350px","overflow-x":"auto"});
}catch(err){if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}MP_Util.LogJSError(this,err,"notesreminders.js","renderComponent");
throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}};
NotesRemindersComponent.prototype.createRemindersColumn=function(columnId,customClass,columnDisplay,renderTemplate){var tableColumn=new TableColumn().setColumnId(columnId).setCustomClass(customClass).setColumnDisplay(columnDisplay).setRenderTemplate(renderTemplate);
return tableColumn;
};
MP_Util.setObjectDefinitionMapping("notes",NotesRemindersComponent);
