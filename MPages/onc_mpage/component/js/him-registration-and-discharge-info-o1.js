function RegistrationDischargeInfoComponentStyle(){this.initByNamespace("rdi2014");
}RegistrationDischargeInfoComponentStyle.inherits(ComponentStyle);
function RegistrationDischargeInfoComponent(criterion){this.setCriterion(criterion);
this.setStyles(new RegistrationDischargeInfoComponentStyle());
var rdiI18n=i18n.accesshim.him.RegistrationDischargeInfoComponent;
var nameSpace=this.getStyles().getNameSpace();
this.setComponentLoadTimerName("USR:MPG.HIM_REGISTRATION_AND_DISCHARGE_INFO.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.HIM_REGISTRATION_AND_DISCHARGE_INFO.O1 - render component");
function VIP(){var _enabled=false;
function generateHTML(recordData){if(!isEnabled()||recordData.PERSON.VIP_IND===0){return"";
}return"<tr><td colspan='2' class='"+nameSpace+"-vip-title'>"+rdiI18n.VIP+"</td></tr>";
}function isEnabled(){return _enabled;
}function setEnabled(enabled){_enabled=enabled;
}this.generateHTML=generateHTML;
this.isEnabled=isEnabled;
this.setEnabled=setEnabled;
}this.vipHeader=new VIP();
function DataRow(displayName,generateRightColumnValueHTML,enabled){var _enabled=enabled;
var _displayName=displayName;
var _displaySequence=0;
function generateRowHTML(recordData){if(!isEnabled()){return"";
}var rowArray=[];
rowArray.push("<tr><td class='"+nameSpace+"-row-title'>"+getDisplayName()+"</td>");
rowArray.push("<td>",generateRightColumnValueHTML(recordData),"</td></tr>");
return rowArray.join("");
}function isEnabled(){return _enabled;
}function setEnabled(enabled){_enabled=enabled;
}function getDisplayName(){return _displayName;
}function setDisplayName(displayName){if(displayName){_displayName=displayName;
}}function getDisplaySequence(){return _displaySequence;
}function setDisplaySequence(displaySequence){_displaySequence=parseInt(displaySequence);
}this.generateRowHTML=generateRowHTML;
this.isEnabled=isEnabled;
this.setEnabled=setEnabled;
this.setDisplayName=setDisplayName;
this.getDisplaySequence=getDisplaySequence;
this.setDisplaySequence=setDisplaySequence;
}function formatTime(dateToFormat){var dateFormatter=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
if(dateToFormat==""){return dateToFormat;
}var dateTime=new Date();
dateTime.setISO8601(dateToFormat);
return dateFormatter.format(dateTime,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
}var dataRowIndices={ENCOUNTER_TYPE_ROW:0,ATTENDING_PHYSICIAN_ROW:1,FACILITY_ROW:2,PAYER_ROW:3,SECONDARY_PAYER_ROW:4,REGISTRATION_DATE_ROW:5,ADMIT_DATE_ROW:6,ADMIT_SOURCE_ROW:7,DISCHARGE_DATE_ROW:8,DISCHARGE_DISPOSITION_ROW:9,DISCHARGE_LOCATION_ROW:10,DECEASED_DATE_ROW:11,CAUSE_OF_DEATH_ROW:12,LENGTH_OF_STAY_ROW:13,BIRTH_NUMBER:14,DEATH_NUMBER:15,NATIONAL_HEALTH_NUMBER:16};
this.dataRowIndices=dataRowIndices;
var dataRows=[];
dataRows[dataRowIndices.ENCOUNTER_TYPE_ROW]=new DataRow(rdiI18n.ENCOUNTER_TYPE,function(recordData){return recordData.ENCNTR.ENCNTR_TYPE;
},true);
dataRows[dataRowIndices.ATTENDING_PHYSICIAN_ROW]=new DataRow(rdiI18n.ATTENDING_PHYSICIAN,function(recordData){return recordData.ENCNTR.ATTENDING_PHYSICIAN;
},true);
dataRows[dataRowIndices.FACILITY_ROW]=new DataRow(rdiI18n.FACILITY,function(recordData){return recordData.ENCNTR.FACILITY;
},true);
dataRows[dataRowIndices.PAYER_ROW]=new DataRow(rdiI18n.PAYER,function(recordData){return recordData.ENCNTR.PAYER;
},true);
dataRows[dataRowIndices.SECONDARY_PAYER_ROW]=new DataRow(rdiI18n.SECONDARY_PAYER,function(recordData){return recordData.ENCNTR.SECONDARY_PAYER;
},true);
dataRows[dataRowIndices.REGISTRATION_DATE_ROW]=new DataRow(rdiI18n.REGISTRATION_DATE,function(recordData){return formatTime(recordData.ENCNTR.REGISTRATION_DATE);
},true);
dataRows[dataRowIndices.ADMIT_DATE_ROW]=new DataRow(rdiI18n.ADMIT_DATE,function(recordData){return formatTime(recordData.ENCNTR.ADMIT_DATE);
},true);
dataRows[dataRowIndices.ADMIT_SOURCE_ROW]=new DataRow(rdiI18n.ADMIT_SOURCE,function(recordData){return recordData.ENCNTR.ADMIT_SOURCE;
},true);
dataRows[dataRowIndices.DISCHARGE_DATE_ROW]=new DataRow(rdiI18n.DISCHARGE_DATE,function(recordData){return formatTime(recordData.ENCNTR.DISCHARGE_DATE);
},true);
dataRows[dataRowIndices.DISCHARGE_DISPOSITION_ROW]=new DataRow(rdiI18n.DISCHARGE_DISPOSITION,function(recordData){return recordData.ENCNTR.DISCHARGE_DISPOSITION;
},true);
dataRows[dataRowIndices.DISCHARGE_LOCATION_ROW]=new DataRow(rdiI18n.DISCHARGE_LOCATION,function(recordData){return recordData.ENCNTR.DISCHARGE_LOCATION;
},true);
dataRows[dataRowIndices.DECEASED_DATE_ROW]=new DataRow(rdiI18n.DECEASED_DATE,function(recordData){return formatTime(recordData.PERSON.DECEASED_DATE);
},true);
dataRows[dataRowIndices.CAUSE_OF_DEATH_ROW]=new DataRow(rdiI18n.CAUSE_OF_DEATH,function(recordData){return recordData.PERSON.CAUSE_OF_DEATH;
},true);
dataRows[dataRowIndices.BIRTH_NUMBER]=new DataRow(rdiI18n.BIRTH_NUMBER,function(recordData){return recordData.PERSON.BIRTH_NUMBER;
},false);
dataRows[dataRowIndices.DEATH_NUMBER]=new DataRow(rdiI18n.DEATH_NUMBER,function(recordData){return recordData.PERSON.DEATH_NUMBER;
},false);
dataRows[dataRowIndices.NATIONAL_HEALTH_NUMBER]=new DataRow(rdiI18n.NATIONAL_HEALTH_NUMBER,function(recordData){return recordData.PERSON.NATIONAL_HEALTH_NUMBER;
},false);
function generateLengthOfStayValueHTML(recordData){var rowArray=[];
if(recordData.ENCNTR.LENGTH_OF_STAY>1){rowArray.push(recordData.ENCNTR.LENGTH_OF_STAY+" <span class='"+nameSpace+"-units'>"+rdiI18n.DAYS+"</span>");
}else{if(recordData.ENCNTR.LENGTH_OF_STAY==1){rowArray.push(recordData.ENCNTR.LENGTH_OF_STAY+" <span class='"+nameSpace+"-units'>"+rdiI18n.DAY+"</span>");
}}return rowArray.join("");
}dataRows[dataRowIndices.LENGTH_OF_STAY_ROW]=new DataRow(rdiI18n.LENGTH_OF_STAY,generateLengthOfStayValueHTML,true);
this.dataRows=dataRows;
}RegistrationDischargeInfoComponent.prototype=new MPageComponent();
RegistrationDischargeInfoComponent.prototype.constructor=MPageComponent;
RegistrationDischargeInfoComponent.prototype.loadFilterMappings=function(){function addFilterMappings(registrationDischargeInfoComponent,dataRowsIndex,filterNamePrefix){registrationDischargeInfoComponent.addFilterMappingObject(filterNamePrefix+"_IS_ENABLED",{setFunction:registrationDischargeInfoComponent.dataRows[dataRowsIndex].setEnabled,type:"BOOLEAN",field:"FREETEXT_DESC"});
registrationDischargeInfoComponent.addFilterMappingObject(filterNamePrefix+"_DISPLAY_NAME",{setFunction:registrationDischargeInfoComponent.dataRows[dataRowsIndex].setDisplayName,type:"STRING",field:"FREETEXT_DESC"});
registrationDischargeInfoComponent.addFilterMappingObject(filterNamePrefix+"_DISPLAY_SEQ",{setFunction:registrationDischargeInfoComponent.dataRows[dataRowsIndex].setDisplaySequence,type:"STRING",field:"FREETEXT_DESC"});
}addFilterMappings(this,this.dataRowIndices.ENCOUNTER_TYPE_ROW,"HIM_ENC_TYPE");
addFilterMappings(this,this.dataRowIndices.ATTENDING_PHYSICIAN_ROW,"HIM_ATTEND_PHYS");
addFilterMappings(this,this.dataRowIndices.FACILITY_ROW,"HIM_FACILITY");
addFilterMappings(this,this.dataRowIndices.PAYER_ROW,"HIM_PAYER");
addFilterMappings(this,this.dataRowIndices.SECONDARY_PAYER_ROW,"HIM_SECOND_PAYER");
addFilterMappings(this,this.dataRowIndices.REGISTRATION_DATE_ROW,"HIM_REG_DATE");
addFilterMappings(this,this.dataRowIndices.ADMIT_DATE_ROW,"HIM_ADMIT_DATE");
addFilterMappings(this,this.dataRowIndices.ADMIT_SOURCE_ROW,"HIM_ADMIT_SOURCE");
addFilterMappings(this,this.dataRowIndices.DISCHARGE_DATE_ROW,"HIM_DISCHG_DATE");
addFilterMappings(this,this.dataRowIndices.DISCHARGE_DISPOSITION_ROW,"HIM_DISCHG_DISP");
addFilterMappings(this,this.dataRowIndices.DISCHARGE_LOCATION_ROW,"HIM_DISCHG_LOC");
addFilterMappings(this,this.dataRowIndices.DECEASED_DATE_ROW,"HIM_DATE_DEATH");
addFilterMappings(this,this.dataRowIndices.CAUSE_OF_DEATH_ROW,"HIM_CAUSE_DEATH");
addFilterMappings(this,this.dataRowIndices.LENGTH_OF_STAY_ROW,"HIM_LENGTH_STAY");
addFilterMappings(this,this.dataRowIndices.BIRTH_NUMBER,"HIM_BIRTH_NUMBER");
addFilterMappings(this,this.dataRowIndices.DEATH_NUMBER,"HIM_DEATH_NUMBER");
addFilterMappings(this,this.dataRowIndices.NATIONAL_HEALTH_NUMBER,"HIM_NHN");
this.addFilterMappingObject("HIM_VIP_IS_ENABLED",{setFunction:this.vipHeader.setEnabled,type:"BOOLEAN",field:"FREETEXT_DESC"});
};
RegistrationDischargeInfoComponent.prototype.retrieveComponentData=function(){var criterion=this.getCriterion();
var loadTimer=new RTMSTimer(this.getComponentLoadTimerName(),this.getCriterion().category_mean);
var renderTimer=new RTMSTimer(this.getComponentRenderTimerName(),this.getCriterion().category_mean);
var scriptRequest=new ComponentScriptRequest();
scriptRequest.setProgramName("him_mp_get_reg_dsch_info");
scriptRequest.setParameterArray(["^MINE^",criterion.person_id+".0",criterion.encntr_id+".0"]);
scriptRequest.setComponent(this);
scriptRequest.setLoadTimer(loadTimer);
scriptRequest.setRenderTimer(renderTimer);
scriptRequest.performRequest();
};
RegistrationDischargeInfoComponent.prototype.renderComponent=function(reply){var nameSpace=this.getStyles().getNameSpace();
var compareDataRowsByDisplaySequence=function(dataRow1,dataRow2){if(dataRow1.getDisplaySequence()>dataRow2.getDisplaySequence()){return 1;
}else{if(dataRow1.getDisplaySequence()<dataRow2.getDisplaySequence()){return -1;
}}return 0;
};
var generateReadmissionBannerHTML=function(readmissionIndicator,criterion){var rdiI18n=i18n.accesshim.him.RegistrationDischargeInfoComponent;
iconImagePath=criterion.static_content.replace(/%5C/g,"\\");
iconImagePath=iconImagePath.replace(/%20/g," ");
var bannerHTMLArray=[];
if(readmissionIndicator&&readmissionIndicator!="0"){bannerHTMLArray.push("<table class='rdi2014-banner' id='"+nameSpace+"-banner-message-table'>");
bannerHTMLArray.push("<tr><td class='"+nameSpace+"-banner-image'>");
bannerHTMLArray.push('<img src="'+iconImagePath+'\\images\\4015_16.gif"/></td>');
var readmissionHours="";
switch(readmissionIndicator){case"1":readmissionHours=rdiI18n.READMISSION_24;
break;
case"2":readmissionHours=rdiI18n.READMISSION_72;
break;
}if(readmissionHours){bannerHTMLArray.push("<td class='him-banner-text'><b>"+readmissionHours+rdiI18n.READMISSION_HR_ADMISSION+"</b>"+rdiI18n.READMISSION_MSG_1+readmissionHours+rdiI18n.READMISSION_MSG_2+"</td>");
bannerHTMLArray.push("</table></br>");
}}return(bannerHTMLArray.join(""));
};
var mainHTMLArray=[];
mainHTMLArray.push(generateReadmissionBannerHTML(reply.ENCNTR.READMISSION_IND,this.getCriterion()));
mainHTMLArray.push("<table id='"+nameSpace+"-admt-dchg-table' class='"+nameSpace+"-table'>");
mainHTMLArray.push(this.vipHeader.generateHTML(reply));
var orderedDataRowsArray=this.dataRows.sort(compareDataRowsByDisplaySequence);
for(var index=0;
index<orderedDataRowsArray.length;
index++){mainHTMLArray.push(orderedDataRowsArray[index].generateRowHTML(reply));
}mainHTMLArray.push("</table>");
MP_Util.Doc.FinalizeComponent(mainHTMLArray.join(""),this);
};
MP_Util.setObjectDefinitionMapping("HIM_REG_DISCH_INFO",RegistrationDischargeInfoComponent);