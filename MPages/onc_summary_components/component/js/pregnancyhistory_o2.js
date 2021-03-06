function PregnancyHistoryComponentO2Style(){this.initByNamespace("preg-o2");
}PregnancyHistoryComponentO2Style.inherits(ComponentStyle);
function PregnancyHistoryComponentO2(criterion){this.setCriterion(criterion);
this.setStyles(new PregnancyHistoryComponentO2Style());
this.setComponentLoadTimerName("USR:MPG.PREGNANCY_HISTORY.O2 - load component");
this.setComponentRenderTimerName("ENG:MPG.PREGNANCY_HISTORY.O2 - render component");
this.setScope(1);
this.setIncludeLineNumber(true);
PregnancyHistoryComponentO2.method("InsertData",function(){CERN_PREG_HISTORY_O2.GetPregTable(this);
});
PregnancyHistoryComponentO2.method("setRecordData",function(value){this.recordData=value;
});
PregnancyHistoryComponentO2.method("resizeComponent",function(){MPageComponent.prototype.resizeComponent.call(this,null);
var contentBody=$("#"+this.getStyles().getContentId()).find(".content-body");
if(contentBody.length){var maxHeight=parseInt($(contentBody).css("max-height").replace("px",""),10);
if(!isNaN(maxHeight)){if($(contentBody).outerHeight()>=maxHeight){$("#preg-o2HdrRow"+this.getComponentId()).addClass("shifted");
}else{$("#preg-o2HdrRow"+this.getComponentId()).removeClass("shifted");
}}}});
}PregnancyHistoryComponentO2.inherits(MPageComponent);
var CERN_PREG_HISTORY_O2=function(){return{GetPregTable:function(component){var messageHTML="";
var phi18n=i18n.discernabu.pregnancyhistory_o2;
var criterion=component.getCriterion();
if(!(criterion.getPatientInfo().getSex())||(criterion.getPatientInfo().getSex().meaning!=="FEMALE")){messageHTML="<h3 class='info-hd'><span class='res-normal'>"+phi18n.NOT_FEMALE+"</span></h3><span class='res-none'>"+phi18n.NOT_FEMALE+"</span>";
MP_Util.Doc.FinalizeComponent(messageHTML,component,"(0)");
CERN_EventListener.fireEvent(component,component,EventListener.EVENT_COUNT_UPDATE,{count:0});
return;
}else{var request=null;
var sendAr=[];
sendAr.push("^MINE^",criterion.person_id+".0",criterion.encntr_id+".0");
request=new MP_Core.ScriptRequest(component,component.getComponentLoadTimerName());
request.setProgramName("MP_GET_PREGNANCY_HISTORY");
request.setParameters(sendAr);
request.setAsync(true);
MP_Core.XMLCCLRequestCallBack(component,request,function(reply){var timerRenderComponent=MP_Util.CreateTimer(component.getComponentRenderTimerName());
try{if(reply.getStatus()==="S"){var recordData=reply.getResponse();
component.setRecordData(recordData);
CERN_PREG_HISTORY_O2.RenderComponent(component,recordData);
}else{if(reply.getStatus()==="F"){var errMsg=[];
errMsg.push(reply.getError());
MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(),errMsg.join("<br />")),component,"");
}else{if(reply.getStatus()==="Z"){var countText=(component.isLineNumberIncluded()?"(0)":"");
var text="<span class='res-none'>"+i18n.discernabu.NO_RESULTS_FOUND+"</span>";
MP_Util.Doc.FinalizeComponent(text,component,countText);
CERN_EventListener.fireEvent(component,component,EventListener.EVENT_COUNT_UPDATE,{count:0});
}}}}catch(err){if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}});
}},SensIndHover:function(img,divelmt){img.onmouseenter=function(){divelmt.style.visibility="hidden";
};
img.onmouseout=function(){divelmt.style.visibility="visible";
};
},RenderComponent:function(component,recordData){var timerRenderComponent=MP_Util.CreateTimer(component.getComponentRenderTimerName());
function createWeightClmn(childRecord){jsColHTML=[];
htmlString="--";
var wString=parseFloat(childRecord.INFANT_WT);
if(wString>0){htmlString=(childRecord.INFANT_WT!=="")?(wString+"<span class='unit'>"+pregHistI18N.GRAMS+"</span>"):"";
}jsPregHTML.push("<td class='preg-o2-columns preg-o2-wgt'>",htmlString,"</td>");
return jsColHTML.join("");
}function createGenderClmn(childRecord){jsColHTML=[];
htmlString="&nbsp;";
if(childRecord.CHILD_GENDER){eventObj=MP_Util.GetValueFromArray(childRecord.CHILD_GENDER,codeArray);
htmlString=eventObj.display;
}else{htmlString="--";
}jsColHTML.push("<td class='preg-o2-columns'>",htmlString,"</td>");
return jsColHTML.join("");
}function createNeonateClmn(childRecord){jsColHTML=[];
htmlString="&nbsp;";
if(childRecord.NEONATE_OUTCOME>0){eventObj=MP_Util.GetValueFromArray(childRecord.NEONATE_OUTCOME,codeArray);
htmlString=eventObj.display;
}jsColHTML.push("<td class='preg-o2-columns'>",htmlString,"</td>");
return jsColHTML.join("");
}function createLengthOfLaborClmn(childRecord){var lengthOfLabor=childRecord.LENGTH_LABOR;
var htmlString="";
var hr=0;
var mins=0;
jsColHTML=[];
htmlString="";
if(lengthOfLabor.indexOf("h")!==-1){hr=lengthOfLabor.substring(0,lengthOfLabor.indexOf("h"));
}if(lengthOfLabor.indexOf("m")!==-1){if(lengthOfLabor.indexOf("h")!==-1){mins=lengthOfLabor.substring(lengthOfLabor.indexOf("h")+3,lengthOfLabor.indexOf("m"));
}else{mins=lengthOfLabor.substring(0,lengthOfLabor.indexOf("m"));
}}if(hr===0&&mins===0){if(childRecord.LENGTH_LABOR<=0){htmlString="--";
}else{htmlString=childRecord.LENGTH_LABOR;
}}else{htmlString="<span>"+hr+"<span class='unit'>"+pregHistI18N.HOURS+"</span>&nbsp;"+mins+"<span class='unit'>"+pregHistI18N.MINUTES+"</span></span>";
}jsColHTML.push("<td class='preg-o2-columns'>",htmlString,"</td>");
return jsColHTML.join("");
}function createPregOutcomeClmn(childRecord){jsColHTML=[];
htmlString="";
var eventObj="";
if(childRecord.PREG_OUTCOME>0){eventObj=MP_Util.GetValueFromArray(childRecord.PREG_OUTCOME,codeArray);
htmlString=eventObj.display;
}jsColHTML.push("<td class='preg-o2-columns preg-o2-outcome'><p class='preg-o2-outcome-txt'>",htmlString,"</p></td>");
return jsColHTML.join("");
}function createGestationAgeClmn(childRecord){jsColHTML=[];
htmlString="";
var gesPrd=childRecord.GEST_AT_BIRTH;
var weeks=0;
var days=0;
if(gesPrd.indexOf("w")!==-1){weeks=gesPrd.substring(0,gesPrd.indexOf("w"));
}if(gesPrd.indexOf("d")!=-1){if(gesPrd.indexOf("w")!==-1){days=gesPrd.substring(gesPrd.indexOf("w")+3,gesPrd.indexOf("d"));
}else{days=gesPrd.substring(0,gesPrd.indexOf("d"));
}}if(weeks===""&&days===""){if(childRecord.GEST_AT_BIRTH<=0){htmlString="--";
}else{htmlString=childRecord.GEST_AT_BIRTH;
}}else{htmlString="<span>"+weeks+"<span class='unit'>"+pregHistI18N.WEEKS+"</span>&nbsp;"+days+"<span class='unit'>"+pregHistI18N.DAYS+"</span></span>";
}jsColHTML.push("<td class='preg-o2-columns'>",htmlString,"</td>");
return jsColHTML.join("");
}function createPregnancyClmn(childRecord){jsColHTML=[];
htmlString="";
var dateTime=new Date();
if(childRecord.DLV_DATE_PRECISION_FLG===0){dateTime.setISO8601(childRecord.DLV_DATE);
htmlString=dateTime.format("shortDate3");
}else{htmlString=childRecord.DLV_DATE;
}jsColHTML.push("<td class='preg-o2-columns'>",htmlString,"</td>");
return jsColHTML.join("");
}function createBabyClmn(childRecord,childCnt){jsColHTML=[];
htmlString="";
jsColHTML.push("<td class='preg-o2-columns'>",babyNames[childCnt],"</td>");
return jsColHTML.join("");
}try{var pregHistI18N=i18n.discernabu.pregnancyhistory_o2;
var jsPregHTML=[];
var buildSec=[];
var pregHTML="";
var childRecord="";
var codeArray=MP_Util.LoadCodeListJSON(recordData.CODES);
var len=recordData.PREG_CNT;
var compID=component.getComponentId();
var htmlString="";
var i=0;
var childObjArr=[];
var jsColHTML=[];
var pregSpan="";
var pregNum="";
var babyNames=[pregHistI18N.BABY_A,pregHistI18N.BABY_B,pregHistI18N.BABY_C,pregHistI18N.BABY_D,pregHistI18N.BABY_E,pregHistI18N.BABY_F,pregHistI18N.BABY_G,pregHistI18N.BABY_H,pregHistI18N.BABY_I,pregHistI18N.BABY_J,pregHistI18N.BABY_K,pregHistI18N.BABY_L,pregHistI18N.BABY_M,pregHistI18N.BABY_N,pregHistI18N.BABY_O];
jsPregHTML.push("<div class = 'preg-o2-info-hdrwrap'><div id='preg-o2HdrRow",compID,"' class='preg-o2-info-hdr hdr'><table class ='preg-o2-table'><tr>");
jsPregHTML.push("<th class='preg-o2-sens-hdr'>&nbsp;</th>");
jsPregHTML.push("<th class='preg-o2-hdr'>",pregHistI18N.PREGNANCY,"</th>");
jsPregHTML.push("<th class='preg-o2-hdr'>",pregHistI18N.DELIVERYDATE,"</th>");
jsPregHTML.push("<th class='preg-o2-hdr'>",pregHistI18N.BABY,"</th>");
jsPregHTML.push("<th class='preg-o2-hdr'>",pregHistI18N.GESTATIONAL_AGE,"</th>");
jsPregHTML.push("<th class='preg-o2-hdr preg-o2-outcome'>",pregHistI18N.PREG_OUTCOME,"</th>");
jsPregHTML.push("<th class='preg-o2-hdr'>",pregHistI18N.DURATION_OF_LABOR,"</th>");
jsPregHTML.push("<th class='preg-o2-hdr'>",pregHistI18N.NEONATE_OUTCOME,"</th>");
jsPregHTML.push("<th class='preg-o2-hdr'>",pregHistI18N.GENDER,"</th>");
jsPregHTML.push("<th class='preg-o2-hdr preg-o2-wgt'>",pregHistI18N.WEIGHT,"</th>");
jsPregHTML.push("</tr></table></div></div>");
jsPregHTML.push("<div class ='",MP_Util.GetContentClass(component,len),"'>");
for(i=0;
i<=len-1;
i++){pregNum=i+1;
var pregRecord=recordData.PREG[i];
var childCnt=pregRecord.CHILD_CNT;
var zebraStriping=(i%2===0)?"odd":"even";
var trPregtabid="preg-o2"+compID+"table"+i;
var trPregid="preg-o2"+compID+"row"+i;
var cName="";
var childObj={divPregid:"preg-o2"+compID+"div"+i,pregPic:"preg-o2"+compID+"pregPic"+i,dlvHosp:"",fatherName:"",childHvr:""};
if(pregRecord.BSENSITIVITYIND===1){pregSpan="<span id='"+childObj.pregPic+"' class='preg-o2-pic' title='"+pregHistI18N.SENSITIVE+"'></span>";
}else{pregSpan="<span class='preg-o2-result'>&nbsp;</span>";
}jsPregHTML.push("<div id = '",trPregtabid,"' class='",zebraStriping,"'><table  class='preg-o2-table'>");
for(var j=0;
j<childCnt;
j++){if(j){pregSpan="&nbsp;";
pregNum="&nbsp;";
}jsPregHTML.push("<tr><td class='preg-o2-sens-hdr'>",pregSpan,"</td><td class='preg-o2-columns'>",pregNum,"</td>");
childRecord=pregRecord.CHILD[j];
cName=(childRecord.CHILD_NAME!=="")?childRecord.CHILD_NAME:"--";
childObj.dlvHosp=(childRecord.DLV_HOSP!=="")?(childRecord.DLV_HOSP):"--";
childObj.fatherName=(childRecord.FATHER_NAME!=="")?(childRecord.FATHER_NAME):"--";
childObj.childHvr+="("+babyNames[j]+"):&nbsp;"+cName+"<br />";
jsPregHTML.push(createPregnancyClmn(childRecord));
jsPregHTML.push(createBabyClmn(childRecord,j));
jsPregHTML.push(createGestationAgeClmn(childRecord));
jsPregHTML.push(createPregOutcomeClmn(childRecord));
jsPregHTML.push(createLengthOfLaborClmn(childRecord));
jsPregHTML.push(createNeonateClmn(childRecord));
jsPregHTML.push(createGenderClmn(childRecord));
jsPregHTML.push(createWeightClmn(childRecord));
jsPregHTML.push("</tr>");
}jsPregHTML.push("</table></div>");
childObjArr[i]=childObj;
}jsPregHTML.push("</div>");
for(i=len-1;
i>=0;
i--){var childName;
if(recordData.PREG[i].CHILD_CNT==1){childName=recordData.PREG[i].CHILD[0].CHILD_NAME!==""?recordData.PREG[i].CHILD[0].CHILD_NAME:"--";
}else{childName=childObjArr[i].childHvr;
}jsPregHTML.push("<h4 class='det-hd'><span>",i18n.PREGNANCY_DETAILS,"</span></h4><div id='",childObjArr[i].divPregid,"' class='hvr hover'><dl  class='preg-o2-det'><dt><span>",pregHistI18N.DELIVERY_HOSPITAL,":</span></dt><dd><span>",childObjArr[i].dlvHosp,"</span></dd> <dt><span>",pregHistI18N.FATHER_NAME,":</span></dt><dd><span>",childObjArr[i].fatherName,"</span></dd> <dt><span>",pregHistI18N.CHILD_NAME,":</span></dt><dd><span>",childName,"</span></dd></dl></div>");
}pregHTML=jsPregHTML.join("");
countText=MP_Util.CreateTitleText(component,len);
MP_Util.Doc.FinalizeComponent(pregHTML,component,countText);
CERN_EventListener.fireEvent(component,component,EventListener.EVENT_COUNT_UPDATE,{count:len});
for(i=0;
i<len;
i++){var hvrElmnt=document.getElementById("preg-o2"+component.getComponentId()+"table"+i);
var hvrDetail=document.getElementById("preg-o2"+component.getComponentId()+"div"+i);
hs(hvrElmnt,hvrDetail,component);
}for(i=0;
i<len;
i++){var pRecord=recordData.PREG[i];
var picId=[];
var hsdiv=[];
picId[i]=document.getElementById("preg-o2"+component.getComponentId()+"pregPic"+i);
hsdiv[i]=document.getElementById("preg-o2"+component.getComponentId()+"div"+i);
if(pRecord.BSENSITIVITYIND==1){CERN_PREG_HISTORY_O2.SensIndHover(picId[i],hsdiv[i]);
}}}catch(err){MP_Util.LogJSError(err,null,"pregnancyhistory_o2.js","RenderComponent");
if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}}};
}();
