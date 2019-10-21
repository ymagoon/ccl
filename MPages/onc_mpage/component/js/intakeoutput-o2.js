function IntakeOutputOpt2Style(){this.initByNamespace("io2");
}IntakeOutputOpt2Style.prototype=new ComponentStyle();
IntakeOutputOpt2Style.prototype.constructor=ComponentStyle;
function IntakeOutputOpt2Component(criterion){this.setCriterion(criterion);
this.setStyles(new IntakeOutputOpt2Style());
this.setComponentLoadTimerName("USR:MPG.IO.O2 - load component");
this.setComponentRenderTimerName("ENG:MPG.IO.O2 - render component");
this.setIncludeLineNumber(false);
this.setAlwaysExpanded(true);
this.setLookbackDays(10);
this.setScope(2);
this.m_countES=null;
this.m_startDate=null;
this.m_beginDate=null;
this.m_endDate=new Date();
this.m_loadTimer=null;
this.setFooterText(" ");
IntakeOutputOpt2Component.method("InsertData",function(){getIO2GPrefs(this);
});
IntakeOutputOpt2Component.method("HandleSuccess",function(replyAr,component){CERN_INTAKEOUTPUT_O2.RenderComponent(this,replyAr);
});
IntakeOutputOpt2Component.method("setCounts",function(value){this.m_countES=value;
});
IntakeOutputOpt2Component.method("getCounts",function(){return(this.m_countES);
});
IntakeOutputOpt2Component.method("setStartDate",function(value){this.m_startDate=value;
});
IntakeOutputOpt2Component.method("getStartDate",function(){return(this.m_startDate);
});
IntakeOutputOpt2Component.method("setBeginDate",function(value){this.m_beginDate=value;
});
IntakeOutputOpt2Component.method("getBeginDate",function(){return(this.m_beginDate);
});
IntakeOutputOpt2Component.method("setEndDate",function(value){this.m_endDate=value;
});
IntakeOutputOpt2Component.method("getEndDate",function(){return(this.m_endDate);
});
IntakeOutputOpt2Component.method("resizeComponent",function(){MPageComponent.prototype.resizeComponent.call(this,null);
var shiftRow=null;
var contentBody=$("#"+this.getStyles().getContentId()).find(".content-body");
if(contentBody.length){var maxHeight=parseInt($(contentBody).css("max-height").replace("px",""),10);
var contentHeight=0;
contentBody.find(".sub-sec").each(function(index){contentHeight+=$(this).outerHeight(true);
});
if(!isNaN(maxHeight)&&(contentHeight>maxHeight)){if($("#IO2HdrRow"+this.getComponentId()+" .io2-shift").length===0){shiftRow=$("<th />");
shiftRow.addClass("io2-shift");
$("#IO2HdrRow"+this.getComponentId()).append(shiftRow);
contentBody.css({"overflow-y":"auto"});
}}else{$("#IO2HdrRow"+this.getComponentId()+" .io2-shift").remove();
}}});
function getIO2GPrefs(component){component.m_loadTimer=MP_Util.CreateTimer(component.getComponentLoadTimerName());
var request=new MP_Core.ScriptRequest(component,"ENG:MPG.IO.O2 - load io2g prefs");
request.setParameters(["^MINE^"]);
request.setName("getIO2GPrefs");
request.setProgramName("MP_GET_IO2G_PREFS");
MP_Core.XMLCCLRequestCallBack(component,request,getIO2GData);
}function getIO2GData(reply){if(reply.getStatus()==="S"){var request=null;
var thread=null;
var component=reply.getComponent();
var io2gResponse=reply.getResponse();
var criterion=component.getCriterion();
var eDttm=new Date(component.getEndDate());
var bDttm=new Date();
var sEndDate=MP_Util.CreateDateParameter(eDttm);
var ioI18n=i18n.discernabu.intakeoutput_o2;
var df=MP_Util.GetDateFormatter();
bDttm.setISO8601(io2gResponse.START_DATE);
component.setStartDate(new Date(bDttm));
var startDate=component.getStartDate();
if(bDttm>eDttm){bDttm.setHours(bDttm.getHours()-240);
}else{bDttm.setHours(bDttm.getHours()-216);
}component.setBeginDate(bDttm);
var sBeginDate=MP_Util.CreateDateParameter(bDttm);
component.setScope((io2gResponse.FILTER_BY_ENCNTR_IND===1)?2:1);
var sEncntr=(component.getScope()===2)?criterion.encntr_id+".0":"0.0";
var sEncntrOR=(component.getScope()===2)?criterion.encntr_id+".0":MP_Util.CreateParamArray(criterion.getEncounterOverride(),1);
var replaceText=(component.getScope()===2)?ioI18n.SCOPE_VISIT:ioI18n.SCOPE_PATIENT;
var sTextDate=df.format(startDate,mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS);
MP_Util.Doc.ReplaceSubTitleText(component,replaceText.replace("{0}",sTextDate));
var mgr=new MP_Core.XMLCCLRequestThreadManager(CERN_INTAKEOUTPUT_O2.RenderComponent,component,true);
var countES=component.getCounts();
if(countES&&countES.length>0){var sEventSets=MP_Util.CreateParamArray(countES,1);
request=new MP_Core.ScriptRequest(component,"ENG:MPG.IO.O2 - load counts");
request.setProgramName("MP_RETRIEVE_N_RESULTS_JSON");
request.setParameters(["^MINE^",criterion.person_id+".0",sEncntrOR,criterion.provider_id+".0",criterion.ppr_cd+".0",999,"^^",sEventSets,"0.0",0,0,0,"^"+sBeginDate+"^","^"+sEndDate+"^"]);
request.setAsync(true);
thread=new MP_Core.XMLCCLRequestThread(request.getProgramName(),component,request);
mgr.addThread(thread);
}request=new MP_Core.ScriptRequest(component,"ENG:MPG.IO.O2 - load volumes");
request.setProgramName("MP_GET_IO_VOL_JSON");
request.setParameters(["^MINE^",criterion.person_id+".0",sEncntr,criterion.provider_id+".0",criterion.ppr_cd+".0","^"+sBeginDate+"^","^"+sEndDate+"^"]);
request.setAsync(true);
thread=new MP_Core.XMLCCLRequestThread(request.getProgramName(),component,request);
mgr.addThread(thread);
mgr.begin();
}}}IntakeOutputOpt2Component.prototype=new MPageComponent();
IntakeOutputOpt2Component.prototype.constructor=MPageComponent;
var CERN_INTAKEOUTPUT_O2=function(){var IOTable=function(buckets){var m_intake=[];
var m_output=[];
var m_counts=[];
var m_buckets=buckets;
var m_mapIntake=[];
var m_mapOutput=[];
var m_mapCounts=[];
var m_intakeTotals=null;
var m_outputTotals=null;
var m_totalVolumes=null;
this.initIntakeOutput=function(recordData){var codeArray=MP_Util.LoadCodeListJSON(recordData.CODES);
var personnelArray=MP_Util.LoadPersonelListJSON(recordData.PRSNL);
var volumes=recordData.VOLUME;
var nVol=volumes.length;
for(var x=0;
x<nVol;
x++){var volume=volumes[x];
var oVolume=new IOVolume(volume,codeArray,recordData.COMPOSITION);
var key=oVolume.getKey();
var ar=null;
var ioRow=null;
switch(oVolume.getTypeFlag()){case CERN_INTAKEOUTPUT_O2.IO_TYPE_INTAKE:ioRow=m_intake[key];
if(!ioRow){ar=createNewBuckets(m_buckets);
ioRow=new IORow(oVolume.getDisplay(),ar,oVolume.getUnitOfMeasure());
m_intake[key]=ioRow;
m_mapIntake.push(key);
}addResultToBucket(oVolume,ioRow);
break;
case CERN_INTAKEOUTPUT_O2.IO_TYPE_OUTPUT:ioRow=m_output[key];
if(!ioRow){ar=createNewBuckets(m_buckets);
ioRow=new IORow(oVolume.getDisplay(),ar,oVolume.getUnitOfMeasure());
m_output[key]=ioRow;
m_mapOutput.push(key);
}addResultToBucket(oVolume,ioRow);
break;
}}};
this.initCountData=function(recordData){var codeArray=MP_Util.LoadCodeListJSON(recordData.CODES);
var personnelArray=MP_Util.LoadPersonelListJSON(recordData.PRSNL);
var measurements=CERN_MEASUREMENT_BASE_O1.LoadMeasurementDataArray(recordData,null,null,null);
for(var x=0;
x<measurements.length;
x++){var meas=measurements[x];
var ec=meas.getEventCode();
var key=ec.codeValue;
var ar=null;
var ioRow=null;
ioRow=m_counts[key];
if(!ioRow){var result=meas.getResult();
ar=createNewBuckets(m_buckets);
var uom=(result instanceof MP_Core.QuantityValue)?result.getUOM():null;
ioRow=new IORow(ec.display,ar,uom);
m_counts[key]=ioRow;
m_mapCounts.push(key);
}addResultToBucket(meas,ioRow);
}};
this.getIntake=function(){return m_intake;
};
this.getIntakeKeys=function(){return m_mapIntake;
};
this.getIntakeTotalsPerBucket=function(){if(!m_intakeTotals){m_intakeTotals=getTotalsPerBucket(m_mapIntake,m_intake);
}return m_intakeTotals;
};
this.getIntakeTotal=function(){var ar=this.getIntakeTotalsPerBucket();
var returnVal=0;
for(var x=ar.length;
x--;
){returnVal+=ar[x];
}return returnVal;
};
this.getOutputTotal=function(){var ar=this.getOutputTotalsPerBucket();
var returnVal=0;
for(var x=ar.length;
x--;
){returnVal+=ar[x];
}return returnVal;
};
this.getOutput=function(){return m_output;
};
this.getOutputKeys=function(){return m_mapOutput;
};
this.getOutputTotalsPerBucket=function(){if(!m_outputTotals){m_outputTotals=getTotalsPerBucket(m_mapOutput,m_output);
}return m_outputTotals;
};
this.getTotalVolumesPerBucket=function(){var ar=[];
var intakeTotals=this.getIntakeTotalsPerBucket();
var outputTotals=this.getOutputTotalsPerBucket();
for(var x=0,xl=m_buckets.length;
x<xl;
x++){var intakeBucket=intakeTotals[x];
var outputBucket=outputTotals[x];
var intakeTotal=(intakeBucket)?intakeBucket:0;
var outputTotal=(outputBucket)?outputBucket:0;
ar.push(intakeTotal-outputTotal);
}return ar;
};
this.getCounts=function(){return m_counts;
};
this.getCountKeys=function(){return m_mapCounts;
};
function addResultToBucket(result,ioRow){var buckets=ioRow.getBuckets();
for(var x=buckets.length;
x--;
){var bucket=buckets[x];
var dt=(result instanceof IOVolume)?result.getEndDate():result.getDateTime();
if(dt<bucket.getEndDate()&&dt>=bucket.getBeginDate()){bucket.addResult(result);
break;
}}}function createNewBuckets(buckets){var ar=[];
for(var x=0,xl=buckets.length;
x<xl;
x++){ar.push(new IOBucket(buckets[x].getBeginDate(),buckets[x].getEndDate()));
}return ar;
}function getTotalsPerBucket(keyArray,rowArray){var ar=[];
for(var x=0,xl=keyArray.length;
x<xl;
x++){var row=rowArray[keyArray[x]];
var buckets=row.getBuckets();
var total=0;
for(var y=buckets.length;
y--;
){if(ar[y]){ar[y]=ar[y]+buckets[y].getTotal();
}else{ar[y]=buckets[y].getTotal();
}}}return ar;
}};
var IORow=function(display,buckets,uom){var m_display=display;
var m_buckets=buckets;
var m_uom=uom;
this.getDisplay=function(){return m_display;
};
this.getUnitOfMeasure=function(){return m_uom;
};
this.getBuckets=function(){return m_buckets;
};
this.getTotal=function(){var total=0;
for(var x=m_buckets.length;
x--;
){total+=m_buckets[x].getTotal();
}return total;
};
};
var IOBucket=function(beginDate,endDate){var m_beginDate=beginDate;
var m_endDate=endDate;
var m_arResults=[];
var m_total=0;
var m_display=null;
var m_isModified=false;
this.getBeginDate=function(){return m_beginDate;
};
this.getEndDate=function(){return m_endDate;
};
this.addResult=function(val){m_display=val.getEventCode().display;
m_arResults.push(val);
if(val instanceof IOVolume){m_total+=val.getVolume();
}else{var result=val.getResult();
m_total+=(result instanceof MP_Core.QuantityValue)?result.getRawValue():0;
}if(val.isModified()){m_isModified=val.isModified();
}};
this.getResults=function(){return m_arResults;
};
this.getTotal=function(){return m_total;
};
this.getDisplay=function(){return m_display;
};
this.getEventIds=function(){ar=[];
if(m_arResults){for(var x=m_arResults.length;
x--;
){ar.push(m_arResults[x].getEventId());
}}return ar;
};
this.isModified=function(){return m_isModified;
};
};
var IOIngredient=function(ingred,codeArray){var m_catalogCode=MP_Util.GetValueFromArray(ingred.CATALOG_CD,codeArray);
var m_eventCode=MP_Util.GetValueFromArray(ingred.EVENT_CD,codeArray);
var m_eventTitleText=ingred.EVENT_TITLE_TEXT;
var m_initDose=ingred.INITIAL_DOSE;
var m_initDoseCode=MP_Util.GetValueFromArray(ingred.INITIAL_DOSE_UNIT_CD,codeArray);
var m_initVolume=ingred.INITIAL_VOLUME;
var m_initVolumeCode=MP_Util.GetValueFromArray(ingred.INITIAL_VOLUME_UNIT_CD,codeArray);
this.getDisplay=function(){var ar=[m_eventCode.display];
if(m_initDose!==0){ar.push(m_initDose);
if(m_initDoseCode){ar.push(m_initDoseCode.display);
}}if(m_initVolume!==0){ar.push(m_initVolume);
if(m_initVolumeCode){ar.push(m_initVolumeCode.display);
}}return(ar.join(" "));
};
};
var IOVolume=function(volume,codeArray,compositions){var m_df=MP_Util.GetDateFormatter();
var m_commentInd=volume.COMMENT_IND;
var m_compositionId=volume.COMPOSITION_ID;
var m_eventId=volume.EVENT.EVENT_ID;
var m_resultStatus=MP_Util.GetValueFromArray(volume.EVENT.RESULT_STATUS_CD,codeArray);
var m_endDate=new Date();
m_endDate.setISO8601(volume.IO_END_DATE);
var m_startDate=new Date();
m_startDate.setISO8601(volume.IO_START_DATE);
var m_ioStatus=MP_Util.GetValueFromArray(volume.IO_STATUS_CD,codeArray);
var m_ioTypeFlag=volume.IO_TYPE_FLAG;
var m_ioVolume=volume.IO_VOLUME;
var m_eventCode=MP_Util.GetValueFromArray(volume.REFERENCE_EVENT.EVENT_CD,codeArray);
var m_dynamicLabel=volume.REFERENCE_EVENT.DYNAMIC_LABEL;
var m_key=(m_dynamicLabel&&m_dynamicLabel!=="")?m_eventCode.codeValue+":"+m_dynamicLabel+":"+m_compositionId:m_eventCode.codeValue+":"+m_compositionId;
var m_hnaOrderMnemonic=volume.REFERENCE_EVENT.ORDERS.HNA_ORDER_MNEMONIC;
var m_volTypeFlag=volume.VOLUME_TYPE_FLAG;
var m_ingreds=getCompositions(m_compositionId,compositions,codeArray);
var m_uom=MP_Util.GetValueFromArray(volume.REFERENCE_EVENT.RESULT_UNITS_CD,codeArray);
this.getKey=function(){return m_key;
};
this.getVolume=function(){return m_ioVolume;
};
this.getVolumeType=function(){return m_volTypeFlag;
};
this.getTypeFlag=function(){return m_ioTypeFlag;
};
this.getResultStatus=function(){return m_resultStatus;
};
this.getBeginDate=function(){return m_startDate;
};
this.getEndDate=function(){return m_endDate;
};
this.getEventCode=function(){return m_eventCode;
};
this.getDynamicLabel=function(){return m_dynamicLabel;
};
this.getDisplay=function(){if(m_volTypeFlag===CERN_INTAKEOUTPUT_O2.VOLUME_TYPE_IV){return m_hnaOrderMnemonic;
}else{if(m_volTypeFlag===CERN_INTAKEOUTPUT_O2.VOLUME_TYPE_MEDICATION){var ar=[];
for(var x=0,xl=m_ingreds.length;
x<xl;
x++){ar.push(m_ingreds[x].getDisplay());
}return ar.join(" + ");
}else{if(m_dynamicLabel&&m_dynamicLabel!==""){return m_dynamicLabel;
}}}return m_eventCode.display;
};
this.getUnitOfMeasure=function(){return m_uom;
};
this.getEventId=function(){return m_eventId;
};
this.isModified=function(){if(m_resultStatus){var mean=m_resultStatus.meaning;
if(mean==="MODIFIED"||mean==="ALTERED"){return true;
}}return false;
};
this.getIngredients=function(){return m_ingreds;
};
};
function getCompositions(compId,comps,codeArray){var ar=[];
if(comps&&comps.length>0){for(var x=comps.length;
x--;
){var comp=comps[x];
if(compId===comp.COMPOSITION_ID){for(var y=0,yl=comp.INGREDIENT.length;
y<yl;
y++){ar.push(new IOIngredient(comp.INGREDIENT[y],codeArray));
}}}}return ar;
}function createTotalRow(label,totals,flag,bucketCount){var nf=MP_Util.GetNumericFormatter();
var ar=[];
var ioI18n=i18n.discernabu.intakeoutput_o2;
var sML=(flag===CERN_INTAKEOUTPUT_O2.TOTAL_TYPE_BALANCE)?"<span class='unit'>"+ioI18n.MILLILITER+"</span>":"";
var sTR=(flag===CERN_INTAKEOUTPUT_O2.TOTAL_TYPE_NET)?"<tr class='io2-net'>":"<tr class='io2-total'>";
ar.push(sTR,"<td class='io2-lbl'><span class='row-label'>",label,"</span>",sML,"</td>");
for(x=0,xl=totals.length;
x<xl;
x++){var nTotal=totals[x];
var prec=MP_Util.CalculatePrecision(nTotal);
ar.push("<td class='io2-res'><dl class='io2-info'><dt><span>",ioI18n.VALUE,"</span></dt><dd class='io2-res'>");
if(nTotal){ar.push("<span class='res-value'>",nf.format(nTotal,"^."+prec),"</span>");
}else{ar.push("<span>&nbsp;</span>");
}ar.push("</dd></dl></td>");
}for(x=totals.length;
x<bucketCount;
x++){ar.push("<td class='io2-res'><dl class='io2-info'><dt><span>",ioI18n.VALUE,"</span></dt><dd class='io2-res'><span>&nbsp;</span></dd></dl></td>");
}ar.push("</tr>");
return ar.join("");
}function createIORows(label,keys,rows,criterion,arTotals){var ar=[];
var ioI18n=i18n.discernabu.intakeoutput_o2;
var rowAr=[];
var nKeys=keys.length;
var nRows=0;
if(nKeys){rowAr.push("<div class='sub-sec-content'><div><table class='io2-table'>");
for(x=0,xl=nKeys;
x<xl;
x++){key=keys[x];
ioRow=rows[key];
if(ioRow.getTotal()){nRows+=1;
buckets=ioRow.getBuckets();
var uom=ioRow.getUnitOfMeasure();
var sUnit=(uom)?"<span class='unit'>"+uom.display+"</span>":"";
rowAr.push("<tr><td class='io2-lbl'><span class='row-label'>",ioRow.getDisplay(),"</span>",sUnit,"</td>");
if(buckets){var nf=MP_Util.GetNumericFormatter();
for(y=0,yl=buckets.length;
y<yl;
y++){var sHvr="";
var bucket=buckets[y];
var nTotal=bucket.getTotal();
rowAr.push("<td class='io2-res'><dl class='io2-info'><dt><span>",ioI18n.VALUE,"</span></dt><dd class='io2-res'>");
if(nTotal){var prec=MP_Util.CalculatePrecision(nTotal);
rowAr.push(createEventViewerLink(bucket,nf.format(nTotal,"^."+prec),criterion));
sHvr=createIOHover(bucket);
}else{rowAr.push("<span>&nbsp;</span>");
}rowAr.push("</dd></dl>",sHvr,"</td>");
}}rowAr.push("</tr>");
}}if(arTotals&&arTotals.length>0){rowAr.push(createTotalRow(ioI18n.TOTAL,arTotals,CERN_INTAKEOUTPUT_O2.TOTAL_TYPE_NET));
}rowAr.push("</table></div></div>");
}ar.push("<div class='sub-sec closed'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='",label,"'>+</span><span class='sub-sec-title'>",label," (",nRows,")</span></h3>",rowAr.join(""),"</div>");
return ar.join("");
}function createIOHover(oBucket){var ar=[];
var ioI18n=i18n.discernabu.intakeoutput_o2;
var results=oBucket.getResults();
var volType=(results&&results[0].getVolumeType)?results[0].getVolumeType():CERN_INTAKEOUTPUT_O2.VOLUME_TYPE_UNDEFINED;
if(volType===CERN_INTAKEOUTPUT_O2.VOLUME_TYPE_IV){var ingreds=results[0].getIngredients();
if(ingreds&&ingreds.length>0){ar.push("<h4 class='det-hd'><span>",ioI18n.DETAILS,"</span></h4><div class='hvr'><dl class='io2-det'>");
for(var x=0,xl=ingreds.length;
x<xl;
x++){ar.push("<dt class='io2-det-type'><span>",ioI18n.INGREDIENT,":","</span></dt><dd>",ingreds[x].getDisplay(),"</dd>");
}ar.push("</dl></div>");
}}return ar.join("");
}function createEventViewerLink(oBucket,sResult,oCriterion){var ar=[];
var eventIds=oBucket.getEventIds();
var personId=oCriterion.person_id;
var sparams={personId:personId,encounterId:0,eventIdAr:eventIds,viewerType:"EVENT",peventId:0};
ar.push("<span class='res-normal'><span class='res-value'><a class='intake-output-result' params='",JSON.stringify(sparams),"' return false;' href='#'>",sResult,"</a></span>");
if(oBucket.isModified()){ar.push("<span class='res-modified'>&nbsp;</span>");
}ar.push("</span>");
return ar.join("");
}function resultClickHandler(compId){$("#wrkflwContentBody"+compId).on("click",".intake-output-result",function(){var params=JSON.parse($(this).attr("params"));
ResultViewer.launchAdHocViewer(params.eventIdAr);
});
}return{RenderComponent:function(replyAr,component){var timerRenderComponent=MP_Util.CreateTimer(component.getComponentRenderTimerName());
try{var ioI18n=i18n.discernabu.intakeoutput_o2;
var compNS=component.getStyles().getNameSpace();
var compId=component.getComponentId();
var jsHTML=[];
var countHTML=[];
var volHTML=[];
var totalCnt=0;
var key=null;
var buckets=[];
var df=MP_Util.GetDateFormatter();
var criterion=component.getCriterion();
var currentDate=new Date();
var startDate=component.getStartDate();
var curDate=new Date();
var dtOneBack=new Date(startDate);
dtOneBack.setHours(startDate.getHours()-24);
var dtTwoBack=new Date(startDate);
dtTwoBack.setHours(startDate.getHours()-48);
var dtThreeBack=new Date(startDate);
dtThreeBack.setHours(startDate.getHours()-72);
var dtFourBack=new Date(startDate);
dtFourBack.setHours(startDate.getHours()-96);
var dtFiveBack=new Date(startDate);
dtFiveBack.setHours(startDate.getHours()-120);
var dtSixBack=new Date(startDate);
dtSixBack.setHours(startDate.getHours()-144);
var dtSevenBack=new Date(startDate);
dtSevenBack.setHours(startDate.getHours()-168);
var dtEightBack=new Date(startDate);
dtEightBack.setHours(startDate.getHours()-192);
var dtNineBack=new Date(startDate);
dtNineBack.setHours(startDate.getHours()-216);
var dtTenBack=new Date(startDate);
dtTenBack.setHours(startDate.getHours()-240);
if(curDate>startDate){buckets=[new IOBucket(startDate,curDate),new IOBucket(dtOneBack,startDate),new IOBucket(dtTwoBack,dtOneBack),new IOBucket(dtThreeBack,dtTwoBack),new IOBucket(dtFourBack,dtThreeBack),new IOBucket(dtFiveBack,dtFourBack),new IOBucket(dtSixBack,dtFiveBack),new IOBucket(dtSevenBack,dtSixBack),new IOBucket(dtEightBack,dtSevenBack),new IOBucket(dtNineBack,dtEightBack)];
}else{buckets=[new IOBucket(dtOneBack,curDate),new IOBucket(dtTwoBack,dtOneBack),new IOBucket(dtThreeBack,dtTwoBack),new IOBucket(dtFourBack,dtThreeBack),new IOBucket(dtFiveBack,dtFourBack),new IOBucket(dtSixBack,dtFiveBack),new IOBucket(dtSevenBack,dtSixBack),new IOBucket(dtEightBack,dtSevenBack),new IOBucket(dtNineBack,dtEightBack),new IOBucket(dtTenBack,dtNineBack)];
}var oTable=new IOTable(buckets);
for(var z=replyAr.length;
z--;
){var reply=replyAr[z];
var sStatus=reply.getStatus();
if(reply.getName()==="MP_RETRIEVE_N_RESULTS_JSON"){if(sStatus==="Z"){countHTML.push("<div class='sub-sec closed'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='",i18n.SHOW_SECTION,"'>-</span><span class='sub-sec-title'>",ioI18n.COUNTS," (",0,")</span></h3></div>");
}else{if(sStatus==="S"){oTable.initCountData(reply.getResponse());
var oCounts=oTable.getCounts();
var kCounts=oTable.getCountKeys();
countHTML.push(createIORows(ioI18n.COUNTS,kCounts,oCounts,criterion));
totalCnt+=kCounts.length;
}}}else{if(reply.getName()==="MP_GET_IO_VOL_JSON"){if(sStatus==="Z"){volHTML.push("<div class='sub-sec closed'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='",i18n.SHOW_SECTION,"'>-</span><span class='sub-sec-title'>",ioI18n.INTAKE," (",0,")</span></h3></div>");
volHTML.push("<div class='sub-sec closed'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='",i18n.SHOW_SECTION,"'>-</span><span class='sub-sec-title'>",ioI18n.OUTPUT," (",0,")</span></h3></div>");
}else{if(sStatus==="S"){oTable.initIntakeOutput(reply.getResponse());
var oIntakes=oTable.getIntake();
var oOutputs=oTable.getOutput();
var kIntakes=oTable.getIntakeKeys();
var kOutputs=oTable.getOutputKeys();
volHTML.push(createIORows(ioI18n.INTAKE,kIntakes,oIntakes,criterion,oTable.getIntakeTotalsPerBucket(),ioI18n.TOTAL_INTAKE));
volHTML.push(createIORows(ioI18n.OUTPUT,kOutputs,oOutputs,criterion,oTable.getOutputTotalsPerBucket(),ioI18n.TOTAL_OUTPUT));
totalCnt+=kIntakes.length;
totalCnt+=kOutputs.length;
}}}}}jsHTML.push("<table class='io2-table'><tr class='hdr' id='IO2HdrRow",compId,"'><th class='io2-lbl'><span>&nbsp;</span></th>");
for(var x=0,xl=buckets.length;
x<xl;
x++){if(x){jsHTML.push("<th class='io2-res'><span>",df.format(buckets[x].getBeginDate(),mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR),"</span></th>");
}else{jsHTML.push("<th class='io2-res'><span>",df.format(buckets[x].getBeginDate(),mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR),"*</span></th>");
}}jsHTML.push("</tr>");
jsHTML.push("</table>");
var initHeight=0;
if(window.innerHeight){initHeight=window.innerHeight-200;
}else{if(document.body){initHeight=document.body.clientHeight-200;
}}jsHTML.push("<div id='wrkflwContentBody",compId,"' class='content-body'>");
jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>",ioI18n.TOTAL_SUMMARY,"</span></h3>");
jsHTML.push("<table class='io2-table'>");
jsHTML.push(createTotalRow(ioI18n.INTAKE,oTable.getIntakeTotalsPerBucket(),CERN_INTAKEOUTPUT_O2.TOTAL_TYPE_BALANCE,buckets.length));
jsHTML.push(createTotalRow(ioI18n.OUTPUT,oTable.getOutputTotalsPerBucket(),CERN_INTAKEOUTPUT_O2.TOTAL_TYPE_BALANCE,buckets.length));
jsHTML.push(createTotalRow(ioI18n.FLUID_BALANCE,oTable.getTotalVolumesPerBucket(),CERN_INTAKEOUTPUT_O2.TOTAL_TYPE_NET,buckets.length));
jsHTML.push("</table>");
jsHTML.push("</div>");
jsHTML.push(volHTML.join(""),countHTML.join(""));
jsHTML.push("</div>");
var sHTML=jsHTML.join("");
var countText=MP_Util.CreateTitleText(component,totalCnt);
MP_Util.Doc.FinalizeComponent(sHTML,component,countText);
resultClickHandler(compId);
var thisComp=$("#"+compNS+compId);
thisComp.find(".sec-footer").text("* "+i18n.discernabu.intakeoutput_o2.FOOTER);
var secToggles=$("#wrkflwContentBody"+compId+" .sub-sec-hd-tgl");
secToggles.each(function(index){Util.removeEvent($(this).get(0),"click",MP_Util.Doc.ExpandCollapse);
$(this).on("click.io2",function(){var i18nCore=i18n.discernabu;
if($(this).closest(".sub-sec").hasClass("closed")){$(this).closest(".sub-sec").removeClass("closed");
$(this).html("-");
$(this).attr("title",i18nCore.HIDE_SECTION);
}else{$(this).closest(".sub-sec").addClass("closed");
$(this).html("+");
$(this).attr("title",i18nCore.SHOW_SECTION);
}component.resizeComponent();
});
});
}catch(err){if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}if(component.m_loadTimer){component.m_loadTimer.Stop();
}}}};
}();
CERN_INTAKEOUTPUT_O2.IO_TYPE_UNDEFINED=0;
CERN_INTAKEOUTPUT_O2.IO_TYPE_INTAKE=1;
CERN_INTAKEOUTPUT_O2.IO_TYPE_OUTPUT=2;
CERN_INTAKEOUTPUT_O2.VOLUME_TYPE_UNDEFINED=0;
CERN_INTAKEOUTPUT_O2.VOLUME_TYPE_NUMERIC=1;
CERN_INTAKEOUTPUT_O2.VOLUME_TYPE_IV=2;
CERN_INTAKEOUTPUT_O2.VOLUME_TYPE_MEDICATION=3;
CERN_INTAKEOUTPUT_O2.VOLUME_TYPE_NUMERIC_PLACEHOLDER=4;
CERN_INTAKEOUTPUT_O2.VOLUME_TYPE_IV_PLACEHOLDER=5;
CERN_INTAKEOUTPUT_O2.TOTAL_TYPE_BALANCE=1;
CERN_INTAKEOUTPUT_O2.TOTAL_TYPE_NET=2;