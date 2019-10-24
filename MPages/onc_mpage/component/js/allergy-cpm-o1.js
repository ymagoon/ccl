function AllergyComponentCPMStyle(){this.initByNamespace("cpmAllergy");
}AllergyComponentCPMStyle.prototype=new ComponentStyle();
AllergyComponentCPMStyle.prototype.constructor=ComponentStyle;
function AllergyComponentCPM(criterion){var cpmDocI18n=i18n.discernabu.allergy_cpm_o1;
this.setComponentLoadTimerName("USR:MPG.ALLERGY.CPM - load component");
this.setComponentRenderTimerName("ENG:MPG.ALLERGY.CPM - render component");
this.setCriterion(criterion);
this.setStyles(new AllergyComponentCPMStyle());
this.setIncludeLineNumber(true);
this.setScope(1);
this.setLabel(cpmDocI18n.LABEL);
this.resultCount=0;
}AllergyComponentCPM.prototype=new CPMMPageComponent();
AllergyComponentCPM.prototype.constructor=AllergyComponentCPM;
AllergyComponentCPM.prototype.buildReaction=function(reactionArray,cssclass){var reactions="<div>";
for(var i=0;
i<reactionArray.length;
i++){reactions+="<span class ="+cssclass+">"+reactionArray[i].REACTION_NAME+"</span>";
if(i<reactionArray.length-1){reactions+="<br />";
}}reactions+="</div>";
return reactions;
};
AllergyComponentCPM.prototype.openTab=function(){var criterion=this.getCriterion();
var sParms="/PERSONID="+criterion.person_id+" /ENCNTRID="+criterion.encntr_id+" /FIRSTTAB=^"+this.getLink()+"+^";
APPLINK(0,criterion.executable,sParms);
};
AllergyComponentCPM.prototype.processResultsForRender=function(results){var resultLength=results.ALLERGY.length;
var jsSeverity,jsSeverityObj,onsetPrecision,reactionType,infoSource,comments="";
var datetimeFlag=0;
var onsetDate="--";
var allergyResult,dateTime=null;
var codeArray=MP_Util.LoadCodeListJSON(results.CODES);
var personnelArray=MP_Util.LoadPersonelListJSON(results.PRSNL);
var df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
for(resultLength;
resultLength--;
){allergyResult=results.ALLERGY[resultLength];
jsSeverityObj=(allergyResult.SEVERITY_CD)?MP_Util.GetValueFromArray(allergyResult.SEVERITY_CD,codeArray):{meaning:"",display:"--"};
jsSeverity=(jsSeverityObj.meaning==="SEVERE"||jsSeverityObj.display.toUpperCase()==="ANAPHYLLAXIS")?"res-severe":"res-normal";
allergyResult.ALLERGY_NAME="<span class ="+jsSeverity+">"+allergyResult.NAME+"</span>";
onsetDate="--";
dateTime=new Date();
datetimeFlag=0;
onsetPrecision=(allergyResult.ONSET_PRECISION_CD)?MP_Util.GetValueFromArray(allergyResult.ONSET_PRECISION_CD,codeArray).display:"";
if(allergyResult.ONSET_DT_TM&&allergyResult.ONSET_DT_TM!==""){dateTime.setISO8601(allergyResult.ONSET_DT_TM);
}datetimeFlag=allergyResult.ONSETDATE_FLAG;
switch(datetimeFlag){case 30:onsetDate=df.format(dateTime,mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
break;
case 40:onsetDate=df.format(dateTime,mp_formatter.DateTimeFormatter.FULL_MONTH_4YEAR_NO_DATE);
break;
case 50:onsetDate=df.format(dateTime,mp_formatter.DateTimeFormatter.FULL_4YEAR);
break;
case 0:onsetDate="--";
break;
default:onsetDate=df.format(dateTime,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
break;
}allergyResult.ALLERGY_DATE="<span class="+jsSeverity+">"+(onsetPrecision?onsetPrecision+"&nbsp;":"")+onsetDate+"</span>";
allergyResult.ALLERGY_SEVERITY="<span class ="+jsSeverity+">"+jsSeverityObj.display+"</span>";
allergyResult.ALLERGY_REACTIONS=(allergyResult.REACTIONS.length!==0)?this.buildReaction(allergyResult.REACTIONS,jsSeverity):"<span class ="+jsSeverity+">--</span>";
reactionType=MP_Util.GetValueFromArray(allergyResult.REACTION_CLASS_CD,codeArray);
allergyResult.ALLERGY_REACTION_TYPE="<span class="+jsSeverity+">"+(reactionType?reactionType.display:"--")+"</span>";
infoSource=MP_Util.GetValueFromArray(allergyResult.SOURCE_OF_INFO_CD,codeArray);
allergyResult.ALLERGY_INFORMATION_SOURCE="<span class ="+jsSeverity+">"+(infoSource?infoSource.display:"--")+"</span>";
comments=MP_Util.Doc.GetComments(allergyResult,personnelArray);
allergyResult.ALLERGY_COMMENTS="<span class ="+jsSeverity+">"+(comments?comments:"--")+"</span>";
allergyResult.NAME_TEXT=allergyResult.NAME;
allergyResult.ONSET_DATE=allergyResult.ONSET_DATE;
allergyResult.SEVERITY_TEXT=allergyResult.SORT_SEQ;
allergyResult.REACTION_TEXT=(allergyResult.REACTIONS.length!==0)?allergyResult.REACTIONS[0].REACTION_NAME:"--";
allergyResult.REACTION_TYPE_TEXT=(reactionType?reactionType.display:"--");
allergyResult.INFO_SOURCE_TEXT=(infoSource?infoSource.display:"--");
allergyResult.COMMENTS_TEXT=comments;
}};
AllergyComponentCPM.prototype.retrieveComponentData=function(){var criterion=this.getCriterion();
var sendAr=["^MINE^",criterion.person_id+".0","0.0",0,criterion.provider_id+".0",criterion.ppr_cd+".0"];
var self=this;
var scriptRequest=new ComponentScriptRequest();
scriptRequest.setProgramName("MP_GET_ALLERGIES");
scriptRequest.setParameterArray(sendAr);
scriptRequest.setComponent(self);
scriptRequest.performRequest();
};
AllergyComponentCPM.prototype.renderComponent=function(reply){var numberResults=0;
var results=null;
var docI18n=i18n.discernabu.allergy_o2;
this.processResultsForRender(reply);
results=reply.ALLERGY;
numberResults=results.length;
this.resultCount=numberResults;
var allergyTable=new ComponentTable();
allergyTable.setNamespace(this.getStyles().getId());
var nameColumn=new TableColumn();
nameColumn.setColumnId("NAME");
nameColumn.setCustomClass("cpm-allergy-o1-col");
nameColumn.setColumnDisplay(docI18n.NAME);
nameColumn.setPrimarySortField("NAME_TEXT");
nameColumn.setIsSortable(true);
nameColumn.setRenderTemplate("${ALLERGY_NAME}");
var severityColumn=new TableColumn();
severityColumn.setColumnId("Severity");
severityColumn.setCustomClass("cpm-allergy-o1-col");
severityColumn.setColumnDisplay(docI18n.SEVERITY);
severityColumn.setPrimarySortField("SEVERITY_TEXT");
severityColumn.setIsSortable(true);
severityColumn.setRenderTemplate("${ALLERGY_SEVERITY}");
severityColumn.addSecondarySortField("NAME_TEXT",TableColumn.SORT.ASCENDING);
var reactionColumn=new TableColumn();
reactionColumn.setColumnId("Reaction");
reactionColumn.setCustomClass("cpm-allergy-o1-col");
reactionColumn.setColumnDisplay(docI18n.REACTION);
reactionColumn.setPrimarySortField("REACTION_TEXT");
reactionColumn.setIsSortable(true);
reactionColumn.setRenderTemplate("${ ALLERGY_REACTIONS}");
reactionColumn.addSecondarySortField("NAME_TEXT",TableColumn.SORT.ASCENDING);
var reacTypeColumn=new TableColumn();
reacTypeColumn.setColumnId("ReactionType");
reacTypeColumn.setCustomClass("cpm-allergy-o1-col");
reacTypeColumn.setColumnDisplay(docI18n.REACTION_TYPE);
reacTypeColumn.setPrimarySortField("REACTION_TYPE_TEXT");
reacTypeColumn.setIsSortable(true);
reacTypeColumn.setRenderTemplate("${ ALLERGY_REACTION_TYPE }");
reacTypeColumn.addSecondarySortField("NAME_TEXT",TableColumn.SORT.ASCENDING);
var sourceColumn=new TableColumn();
sourceColumn.setColumnId("Source");
sourceColumn.setCustomClass("cpm-allergy-o1-col");
sourceColumn.setColumnDisplay(i18n.SOURCE);
sourceColumn.setPrimarySortField("INFO_SOURCE_TEXT");
sourceColumn.setIsSortable(true);
sourceColumn.setRenderTemplate("${ ALLERGY_INFORMATION_SOURCE }");
sourceColumn.addSecondarySortField("NAME_TEXT",TableColumn.SORT.ASCENDING);
var commentColumn=new TableColumn();
commentColumn.setColumnId("Comments");
commentColumn.setCustomClass("cpm-allergy-o1-col");
commentColumn.setColumnDisplay(docI18n.COMMENTS);
commentColumn.setPrimarySortField("COMMENTS_TEXT");
commentColumn.setIsSortable(true);
commentColumn.setRenderTemplate("${ ALLERGY_COMMENTS }");
commentColumn.addSecondarySortField("NAME_TEXT",TableColumn.SORT.ASCENDING);
allergyTable.addColumn(nameColumn);
allergyTable.addColumn(severityColumn);
allergyTable.addColumn(reactionColumn);
allergyTable.addColumn(reacTypeColumn);
allergyTable.addColumn(sourceColumn);
allergyTable.addColumn(commentColumn);
allergyTable.bindData(results);
allergyTable.sortByColumnInDirection("Severity",TableColumn.SORT.DESCENDING);
this.setComponentTable(allergyTable);
this.finalizeComponent(allergyTable.render(),MP_Util.CreateTitleText(this,numberResults));
CERN_EventListener.fireEvent(this,this,EventListener.EVENT_COUNT_UPDATE,{count:numberResults});
};
CPMController.prototype.addComponentMapping("ALLERGY",AllergyComponentCPM);
