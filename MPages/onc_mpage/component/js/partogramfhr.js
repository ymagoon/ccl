function PartogramFHRComponentWFStyle(){this.initByNamespace("parto-fhr-wf");
}PartogramFHRComponentWFStyle.prototype=new ComponentStyle();
PartogramFHRComponentWFStyle.prototype.constructor=ComponentStyle;
function PartogramFHRComponentWF(criterion){this.setCriterion(criterion);
this.setStyles(new PartogramFHRComponentWFStyle());
this.setComponentLoadTimerName("USR:MPG.PARTOGRAMFHR.O2 - load component");
this.setComponentRenderTimerName("ENG:MPG.PARTOGRAMFHR.O2 - render component");
this.setImageFolderPath(criterion.static_content+"/images/");
this.setMaxAllowedBabies(3);
this.FHR_UNIT=null;
this.IS_FHR=true;
this.setRefreshEnabled(false);
this.babyPlots=null;
this.groupNameMap={};
this.setResourceRequired(true);
this.loadTimer=null;
}PartogramFHRComponentWF.prototype=new MPageComponent();
PartogramFHRComponentWF.prototype.constructor=MPageComponent;
PartogramFHRComponentWF.prototype.HOVER_KEY="FHR";
MP_Util.setObjectDefinitionMapping("WF_PARTO_FHR",PartogramFHRComponentWF);
PartogramFHRComponentWF.prototype.getImageFolderPath=function(){return this.imageFolderPath;
};
PartogramFHRComponentWF.prototype.setImageFolderPath=function(path){this.imageFolderPath=path;
};
PartogramFHRComponentWF.prototype.getPlot=function(){return this.plot;
};
PartogramFHRComponentWF.prototype.setPlot=function(plot){this.plot=plot;
};
PartogramFHRComponentWF.prototype.getRecordData=function(){return this.recordData;
};
PartogramFHRComponentWF.prototype.setRecordData=function(data){this.recordData=data;
};
PartogramFHRComponentWF.prototype.getMaxAllowedBabies=function(){return this.maxAllowedBabies;
};
PartogramFHRComponentWF.prototype.setMaxAllowedBabies=function(count){this.maxAllowedBabies=count;
};
PartogramFHRComponentWF.prototype.getGraphElement=function(){return this.graphElement;
};
PartogramFHRComponentWF.prototype.setGraphElement=function(el){this.graphElement=el;
};
PartogramFHRComponentWF.prototype.RetrieveRequiredResources=function(){if(PartogramBaseComponent.prototype.getPartogramViewID()!==this.getCriterion().category_mean){var messageHTML="<span class='res-none'>"+i18n.discernabu.partogrambaseutil_o2.NOT_PARTOGRAM_VIEW+"</span>";
this.finalizeComponent(messageHTML,"");
return;
}var partogramInfoSR=MP_Resources.getSharedResource("partogramInfo");
if(partogramInfoSR&&partogramInfoSR.isResourceAvailable()&&!jQuery.isEmptyObject(partogramInfoSR.getResourceData())){this.retrieveComponentData();
}else{CERN_EventListener.addListener(this,"partogramInfoAvailable",this.retrieveComponentData,this);
}};
PartogramFHRComponentWF.prototype.getResultsCount=function(recordData){var babyCount=recordData.CNT;
var babyArray=recordData.BABY;
var resCount=0,i,babyRecordData;
for(i=0;
i<babyCount;
i++){babyRecordData=babyArray[i];
resCount+=babyRecordData.BASELINE_CNT+babyRecordData.INTERMITTENT_CNT;
}return resCount;
};
PartogramFHRComponentWF.prototype.retrieveComponentData=function(){try{var criterion=this.getCriterion();
if(PartogramBaseComponent.prototype.getPartogramViewID()!==criterion.category_mean){var messageHTML="<span class='res-none'>"+i18n.discernabu.partogrambaseutil_o2.NOT_PARTOGRAM_VIEW+"</span>";
this.finalizeComponent(messageHTML,"");
return;
}this.loadTimer=new RTMSTimer(this.getComponentLoadTimerName());
var renderTimer=new RTMSTimer(this.getComponentRenderTimerName());
var groups=this.getGroups();
var groupsLength=groups.length;
if(groupsLength>0){var sendAr=[],i;
var partogramInfoSR=MP_Resources.getSharedResource("partogramInfo");
var partogramStartDate=partogramInfoSR.getResourceData().getPartogramStartDate();
partogramStartDate=MP_Util.CreateDateParameter(partogramStartDate);
var groupNames=["WF_PARTO_FHR_FETAL_HR_BASELINE","WF_PARTO_FHR_FETAL_HR"];
for(i=0;
i<groupNames.length;
i++){this.groupNameMap[groupNames[i]]=[0];
}sendAr.push("^MINE^",criterion.person_id+".0",criterion.provider_id+".0",criterion.ppr_cd+".0",criterion.encntr_id+".0");
for(i=0;
i<groupsLength;
i++){var group=groups[i];
if(group instanceof MPageEventCodeGroup){this.groupNameMap[group.m_groupName]=group.getEventCodes();
}}for(i=0;
i<groupNames.length;
i++){sendAr.push(MP_Util.CreateParamArray(this.groupNameMap[groupNames[i]],1));
}sendAr.push("^"+partogramStartDate+"^");
var scriptRequest=new ComponentScriptRequest();
scriptRequest.setProgramName("MP_GET_PARTOGRAM_FHR");
scriptRequest.setParameterArray(sendAr);
scriptRequest.setComponent(this);
scriptRequest.setLoadTimer(this.loadTimer);
scriptRequest.setRenderTimer(renderTimer);
scriptRequest.performRequest();
}else{var noEventCodeMappedMessage="<span class='res-none'> "+i18n.discernabu.partogrambaseutil_o2.NOT_CONFIGURED_BEDROCK_ERR+"</span>";
this.finalizeComponent(noEventCodeMappedMessage,"");
}}catch(err){MP_Util.LogJSError(err,this,"partogramfhr.js","retrieveComponentData");
}};
PartogramFHRComponentWF.prototype.getBabyIndexMap=function(babyArray,length){var index=0;
var babyMap={};
while(index<length){babyMap[babyArray[index].DYNAMIC_LABEL_ID]=index;
index++;
}return babyMap;
};
PartogramFHRComponentWF.prototype.getBabyDynamicLabels=function(babyArray,length){var index=0;
var labelArray=[];
while(index<length){labelArray.push(babyArray[index].DYNAMIC_LABEL);
index++;
}return labelArray;
};
PartogramFHRComponentWF.prototype.getPlotLines=function(){var babyPlots=[];
var jsonData=this.getRecordData();
var babyArray=jsonData.BABY;
var babyCount=jsonData.CNT;
var babyIndexMap=this.getBabyIndexMap(babyArray,babyCount);
var INTERMITTENT=0;
var BASELINE=1;
var maxBabies=this.getMaxAllowedBabies();
var EMPTY_SPACE=" ";
var count=0;
for(var i=0;
i<babyCount&&i<maxBabies;
i++){var baby=[[],[]];
var babyRecordData=babyArray[i];
var bLen=babyRecordData.BASELINE_CNT;
var iLen=babyRecordData.INTERMITTENT_CNT;
var bData=babyRecordData.FHR_BASELINE;
var iData=babyRecordData.FHR_INTERMITTENT;
var babyData=[];
for(count=0;
count<iLen;
count++){babyData.push([iData[count],INTERMITTENT]);
}for(count=0;
count<bLen;
count++){babyData.push([bData[count],BASELINE]);
}babyData.sort(function(dataPoint1,dataPoint2){var date1=PARTO_GRAPH_BASE.getLocalDateTime(dataPoint1[0].RESULT_DATE);
var date2=PARTO_GRAPH_BASE.getLocalDateTime(dataPoint2[0].RESULT_DATE);
if(date1<=date2){return -1;
}return 1;
});
var dataArrayLen=babyData.length;
if(dataArrayLen===0){babyPlots[babyIndexMap[babyRecordData.DYNAMIC_LABEL_ID]]=baby;
continue;
}var prevMethod=babyData[0][1];
baby[prevMethod].push([PARTO_GRAPH_BASE.getLocalDateTime(babyData[0][0].RESULT_DATE),babyData[0][0].RESULT_VALUE]);
for(count=1;
count<dataArrayLen;
count++){var dataPoint=babyData[count][0];
var currentMethod=babyData[count][1];
if(currentMethod!==prevMethod){baby[prevMethod].push([PARTO_GRAPH_BASE.getLocalDateTime(dataPoint.RESULT_DATE),null]);
}baby[currentMethod].push([PARTO_GRAPH_BASE.getLocalDateTime(dataPoint.RESULT_DATE),dataPoint.RESULT_VALUE]);
prevMethod=currentMethod;
}babyPlots[babyIndexMap[babyRecordData.DYNAMIC_LABEL_ID]]=baby;
if(!this.FHR_UNIT){var displayValue=babyData[0][0].RESULT_DISPLAY;
var unit=displayValue.split(EMPTY_SPACE)[1];
this.FHR_UNIT=(unit)?unit:"";
}}if(babyPlots[0][0].length===0){babyPlots[0][0].push([null]);
}return babyPlots;
};
PartogramFHRComponentWF.prototype.babySorter=function(babyA,babyB){var sortRes=0;
if(babyA&&babyA.DYNAMIC_LABEL===""){sortRes=1;
}else{if(babyB&&babyB.DYNAMIC_LABEL===""){sortRes=-1;
}else{var isEqual=((babyA.DYNAMIC_LABEL).toUpperCase()===(babyB.DYNAMIC_LABEL).toUpperCase());
if(isEqual){sortRes=((babyA.DYNAMIC_LABEL_ID>babyB.DYNAMIC_LABEL_ID)?1:-1);
}else{sortRes=((babyA.DYNAMIC_LABEL).toUpperCase()>(babyB.DYNAMIC_LABEL).toUpperCase()?1:-1);
}}}return sortRes;
};
PartogramFHRComponentWF.prototype.getGraphOptions=function(startDt,endDt,hourticks,quarterticks,seriesObjs,canvasOverlayObjs){return{graphName:"partogram-fhr-graph-"+this.getStyles().getId(),series:seriesObjs,seriesDefaults:{breakOnNull:true,showMarker:false,pointLabels:{show:false},hoverable:false,highlightMouseDown:true,shadow:false},axes:{yaxis:{min:60,max:210,tickInterval:10,tickOptions:{showMark:false,showLabel:true,formatString:"%d"}},xaxis:{renderer:$.jqplot.DateAxisRenderer,tickOptions:{show:true,showLabel:false,showMark:false},min:startDt,max:endDt,ticks:quarterticks},x2axis:{renderer:$.jqplot.DateAxisRenderer,tickOptions:{showMark:false,showLabel:false,formatString:"%R"},min:startDt,max:endDt,ticks:hourticks}},axesDefaults:{tickOptions:{textColor:PARTO_GRAPH_BASE.COLOR_DARK_GRAY,fontSize:"11px"}},canvasOverlay:{show:true,objects:canvasOverlayObjs},grid:{drawGridLines:true,hoverable:false,shadow:false,background:PARTO_GRAPH_BASE.GRID_BACKGROUND_COLOR,gridLineWidth:1,gridLineColor:PARTO_GRAPH_BASE.MINOR_GRID_LINE_COLOR,drawBorder:false},cursor:{showTooltip:false,show:false}};
};
PartogramFHRComponentWF.prototype.getComponentHTML=function(){var compID=this.getStyles().getContentId();
var imageFolder=this.getImageFolderPath();
var compHTML='<div class="partogram-container">';
compHTML+='<div class="partogram-container-col-1">';
compHTML+=this.getLegendHTML();
compHTML+="</div>";
compHTML+='<div class="partogram-container-col-2">';
compHTML+=PARTO_GRAPH_BASE.createTopBar(imageFolder,"GRAPH");
compHTML+='<div id="partogram-fhr-graph-container'+compID+'" style="overflow-x:hidden"><div id="partogram-fhr-graph-'+compID+'" class="partogramGraphDiv partoGraphDivFhr"></div></div>';
compHTML+="</div>";
compHTML+="</div>";
return compHTML;
};
PartogramFHRComponentWF.prototype.getLegendHTML=function(){var layoutHTML="";
var jsonData=this.getRecordData();
var heartRate=jsonData.FHRINTERMITTENT_EVENT_CODE_NAME;
var heartRateBaseline=jsonData.FHRBASELINE_EVENT_CODE_NAME;
var compID=this.getComponentId();
var maxBabies=this.getMaxAllowedBabies();
var imageRoot="partoFHRBaby";
var babyCount=jsonData.CNT;
layoutHTML+='<div class="partogram-legend" id="partogram-legend-'+compID+'">';
for(var i=0;
i<babyCount&&i<maxBabies;
i++){var babyi=jsonData.BABY[i];
var toggleImageSrcONClass="partoFHRSprite "+imageRoot+(i+1)+"-ON";
var baselineImageONClass="partoFHRSprite "+imageRoot+(i+1)+"Base-ON";
var intermittentImageONClass="partoFHRSprite "+imageRoot+(i+1)+"Inter-ON";
layoutHTML+='<div class="partogram-fhr-legend-item">';
layoutHTML+="<div>";
layoutHTML+='<div class="partogram-fhr-legend-header-img">';
layoutHTML+='<div id="babyToggle'+compID+babyi.DYNAMIC_LABEL_ID+'" class="'+toggleImageSrcONClass+'"></div>';
layoutHTML+="</div>";
layoutHTML+='<div title="'+babyi.DYNAMIC_LABEL+'" class="partogram-fhr-legend-header-item-name"><span class="partogram-fhr-legend-item-baby-name">'+babyi.DYNAMIC_LABEL+"</span></div>";
layoutHTML+="</div>";
layoutHTML+='<div class="partogram-fhr-legend-item-baby-heartrate-header">';
if(this.groupNameMap.WF_PARTO_FHR_FETAL_HR[0]){layoutHTML+='<div class="partogram-fhr-legend-item-baby-heartrate-unit">';
layoutHTML+='<div class="partogram-fhr-legend-heartrate-img">';
layoutHTML+='<div id="babyIntermittent'+compID+babyi.DYNAMIC_LABEL_ID+'" class="'+intermittentImageONClass+'"></div>';
layoutHTML+="</div>";
layoutHTML+='<div title="'+heartRate+'" class="partogram-fhr-legend-item-baby-heartrate"><span>'+heartRate+"</span></div>";
layoutHTML+="</div>";
}if(this.groupNameMap.WF_PARTO_FHR_FETAL_HR_BASELINE[0]){layoutHTML+='<div class="partogram-fhr-legend-item-baby-heartrate-unit">';
layoutHTML+='<div class="partogram-fhr-legend-heartrate-img">';
layoutHTML+='<div id="babyBaseline'+compID+babyi.DYNAMIC_LABEL_ID+'" class="'+baselineImageONClass+'"></div>';
layoutHTML+="</div>";
layoutHTML+='<div title="'+heartRateBaseline+'" class="partogram-fhr-legend-item-baby-heartrate"><span>'+heartRateBaseline+"</span></div>";
layoutHTML+="</div>";
}layoutHTML+="</div>";
layoutHTML+="</div>";
if(i+1!==babyCount&&i+1!==maxBabies){layoutHTML+='<hr class="partoFHRHorizontalRuler" />';
}}layoutHTML+="</div>";
return layoutHTML;
};
PartogramFHRComponentWF.prototype.registerEvents=function(){var component=this;
var jsonData=this.getRecordData();
var compID=this.getComponentId();
var babyArray=jsonData.BABY;
var maxBabies=this.getMaxAllowedBabies();
var babyCount=jsonData.CNT;
function toggleEventHandler(index,dynID,dynLabel){return function(event){var jqplotGraph=component.getPlot();
var current=jqplotGraph.series[index*2].show;
if(current){$(event.target).removeClass("partoFHRBaby"+(index+1)+"-ON").addClass("partoFHRBaby-OFF");
$("#babyBaseline"+compID+dynID).removeClass("partoFHRBaby"+(index+1)+"Base-ON").addClass("partoFHRBase-OFF");
$("#babyIntermittent"+compID+dynID).removeClass("partoFHRBaby"+(index+1)+"Inter-ON").addClass("partoFHRInter-OFF");
}else{$(event.target).removeClass("partoFHRBaby-OFF").addClass("partoFHRBaby"+(index+1)+"-ON");
$("#babyBaseline"+compID+dynID).removeClass("partoFHRBase-OFF").addClass("partoFHRBaby"+(index+1)+"Base-ON");
$("#babyIntermittent"+compID+dynID).removeClass("partoFHRInter-OFF").addClass("partoFHRBaby"+(index+1)+"Inter-ON");
}jqplotGraph.series[index*2].show=!current;
jqplotGraph.series[index*2+1].show=!current;
jqplotGraph.redraw();
PARTO_GRAPH_BASE.setGraphsCommonCSS();
var babyToggleTimer=new CapabilityTimer("CAP:MPG.PARTOGRAMFHR.O2 - legend toggle",component.criterion.category_mean);
if(babyToggleTimer){babyToggleTimer.addMetaData("rtms.legacy.metadata.1",dynLabel);
babyToggleTimer.capture();
}};
}for(var i=0;
i<babyCount&&i<maxBabies;
i++){$("#babyToggle"+compID+babyArray[i].DYNAMIC_LABEL_ID).click(toggleEventHandler(i,babyArray[i].DYNAMIC_LABEL_ID,babyArray[i].DYNAMIC_LABEL));
}};
PartogramFHRComponentWF.prototype.graphToolTipContent=function(){var component=this;
var tooltipFunction=function(str,seriesIndex,pointIndex,plot){var data=plot.data[seriesIndex][pointIndex];
var time=data[0];
PARTO_GRAPH_BASE.setToolTipLocation(plot,seriesIndex,pointIndex);
var dataPopulated=PARTO_GRAPH_BASE.isHoverDataPopulated(component.HOVER_KEY);
if(!dataPopulated){component.populateHoverData();
}return PARTO_GRAPH_BASE.getHoverHTML(component.HOVER_KEY,time);
};
return tooltipFunction;
};
PartogramFHRComponentWF.prototype.populateHoverData=function(){var jsonData=this.getRecordData();
var self=this;
var intermittentKey=jsonData.FHRINTERMITTENT_EVENT_CODE_NAME;
var baselineKey=jsonData.FHRBASELINE_EVENT_CODE_NAME;
var babyCount=jsonData.CNT;
var maxBabies=this.getMaxAllowedBabies();
babyCount=Math.min(babyCount,maxBabies);
var i,j,value,timestamp;
var buildValue=function(fhrPoint,dynLabel){var resultValue=fhrPoint.RESULT_VALUE;
var normalcyClass=PARTO_GRAPH_BASE.getNormalcyClass(fhrPoint.RESULT_NORMALCY);
var modifiedInd=fhrPoint.RESULT_MODIFIED_IND;
var valueHTML="";
valueHTML+="<span class='parto-graph-wf-unit'>["+dynLabel+"]</span>";
valueHTML+=PARTO_GRAPH_BASE.getResultIndHTML(resultValue,self.FHR_UNIT,normalcyClass,modifiedInd);
return valueHTML;
};
for(i=0;
i<babyCount;
i++){var babyData=jsonData.BABY[i];
var dynLabel=jsonData.BABY[i].DYNAMIC_LABEL;
var intermittentIcon='<div class="partoFHRSprite partoFHRBaby'+(i+1)+'Inter-ON"></div>';
var intermittentCnt=babyData.INTERMITTENT_CNT;
var intermittentData=babyData.FHR_INTERMITTENT;
var baselineIcon='<div class="partoFHRSprite partoFHRBaby'+(i+1)+'Base-ON"></div>';
var baselineCnt=babyData.BASELINE_CNT;
var baselineData=babyData.FHR_BASELINE;
for(j=0;
j<intermittentCnt;
j++){var intermittentPoint=intermittentData[j];
value=buildValue(intermittentPoint,dynLabel);
timestamp=PARTO_GRAPH_BASE.getLocalDateTime(intermittentPoint.RESULT_DATE);
PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY,timestamp,intermittentIcon,intermittentKey,value);
}for(j=0;
j<baselineCnt;
j++){var baselinePoint=baselineData[j];
value=buildValue(baselinePoint,dynLabel);
timestamp=PARTO_GRAPH_BASE.getLocalDateTime(baselinePoint.RESULT_DATE);
PARTO_GRAPH_BASE.insertSeriesIntoHoverMap(this.HOVER_KEY,timestamp,baselineIcon,baselineKey,value);
}}};
PartogramFHRComponentWF.prototype.getShadedOverlay=function(){return{rectangle:{ymin:110,xminOffset:"0px",xmaxOffset:"0px",ymax:160,color:"rgba(221, 221, 221, 0.2)",showTooltip:false}};
};
PartogramFHRComponentWF.prototype.getSeriesObjects=function(){var highlighterOption={tooltipContentEditor:this.graphToolTipContent(),showTooltip:true,tooltipLocation:"n"};
var imageFolderPath=this.getImageFolderPath();
var baseImageBaby1=new Image();
baseImageBaby1.src=imageFolderPath+"partoFHRBaby1Base-ON.png";
var baseImageBaby2=new Image();
baseImageBaby2.src=imageFolderPath+"partoFHRBaby2Base-ON.png";
var baseImageBaby3=new Image();
baseImageBaby3.src=imageFolderPath+"partoFHRBaby3Base-ON.png";
var seriesBaseline=function(index,colorVal,image){return{label:"baby"+index+"_Baseline",markerRenderer:$.jqplot.ImageMarkerRenderer,markerOptions:{show:true,imageElement:image,xOffset:-5.5,yOffset:-5,shadow:false},showLine:true,xaxis:"x2axis",yaxis:"yaxis",lineWidth:1,color:colorVal,highlighter:highlighterOption};
};
var seriesIntermittent=function(index,colorVal){return{label:"baby"+index+"_Intermittent",markerOptions:{show:true,style:"filledCircle",shadow:false},showLine:false,x2axis:"x2axis",yaxis:"yaxis",lineWidth:1,color:colorVal,highlighter:highlighterOption};
};
var seriesArray=[];
var jsonData=this.getRecordData();
var maxBabies=this.getMaxAllowedBabies();
var seriesColors=["#5E34B1","#008836","#FF3399"];
var baseImages=[baseImageBaby1,baseImageBaby2,baseImageBaby3];
var babyCount=jsonData.CNT;
for(var i=0;
i<babyCount&&i<maxBabies;
i++){seriesArray.push(seriesIntermittent(i+1,seriesColors[i]));
seriesArray.push(seriesBaseline(i+1,seriesColors[i],baseImages[i]));
}return seriesArray;
};
PartogramFHRComponentWF.prototype.generateGraphOptions=function(){var canvasOverlayObjs=[];
var endDt=PARTO_GRAPH_BASE.getEndDate();
canvasOverlayObjs.push(this.getShadedOverlay());
canvasOverlayObjs=canvasOverlayObjs.concat(PARTO_GRAPH_BASE.getMajorGridLines());
canvasOverlayObjs=canvasOverlayObjs.concat(PARTO_GRAPH_BASE.getOxytocinVerticalLines());
canvasOverlayObjs=canvasOverlayObjs.concat(PARTO_GRAPH_BASE.getEpiduralVerticalLines());
if(endDt>=PARTO_GRAPH_BASE.getPartogramLastLoadTime()){canvasOverlayObjs=canvasOverlayObjs.concat(PARTO_GRAPH_BASE.getTodayVerticalBar());
}var hourticks=PARTO_GRAPH_BASE.getHourTicks();
var quarterticks=PARTO_GRAPH_BASE.getQuarterTicks();
var seriesObjs=this.getSeriesObjects();
var options=this.getGraphOptions(PARTO_GRAPH_BASE.getStartDate(),endDt,hourticks,quarterticks,seriesObjs,canvasOverlayObjs);
return options;
};
PartogramFHRComponentWF.prototype.plotGraph=function(){var INTERMITTENT=0;
var BASELINE=1;
var contentID=this.getStyles().getContentId();
var componentHTML=this.getComponentHTML();
jQuery("#"+contentID).append(componentHTML);
var options=this.generateGraphOptions();
var babyPlots=this.getPlotLines();
this.babyPlots=babyPlots;
var jqplotData=[];
var babyPlotLen=babyPlots.length;
for(var babyi=0;
babyi<babyPlotLen;
babyi++){jqplotData.push(babyPlots[babyi][INTERMITTENT]);
jqplotData.push(babyPlots[babyi][BASELINE]);
}var widthOffset=PARTO_GRAPH_BASE.getWidthOffsetForGraph();
var currentWidth=parseInt($("#partogram-fhr-graph-"+contentID).css("width"),10);
$("#partogram-fhr-graph-"+contentID).css("width",currentWidth-widthOffset);
var plot=$.jqplot("partogram-fhr-graph-"+contentID,jqplotData,options);
this.setPlot(plot);
this.setGraphElement(document.getElementById("partogram-fhr-graph-"+contentID));
PARTO_GRAPH_BASE.setGraphsCommonCSS();
if(!PARTO_GRAPH_BASE.topBarGraphHTML){PARTO_GRAPH_BASE.refreshTopbar(contentID);
}};
PartogramFHRComponentWF.prototype.renderComponent=function(recordData){var timerRenderComponent=MP_Util.CreateTimer(this.getComponentRenderTimerName(),this.getCriterion().category_mean);
var renderingCAPTimer=new CapabilityTimer("CAP:MPG.PARTOGRAMFHR.O2 - rendering component",this.getCriterion().category_mean);
if(renderingCAPTimer){renderingCAPTimer.capture();
}try{var basei18n=i18n.discernabu.partogrambaseutil_o2;
var noDataHTML="<span class='res-none'>"+basei18n.NO_RESULTS_FOUND+"</span>";
this.loadTimer.addMetaData("component.resultcount",this.getResultsCount(recordData));
if(recordData.CNT>0){PARTO_GRAPH_BASE.addSubscriber(this);
this.finalizeComponent("",MP_Util.CreateTitleText(this,""));
recordData.BABY.sort(this.babySorter);
recordData.FHRINTERMITTENT_EVENT_CODE_NAME=PARTO_GRAPH_BASE.removeColonEndOfString(recordData.FHRINTERMITTENT_EVENT_CODE_NAME);
recordData.FHRBASELINE_EVENT_CODE_NAME=PARTO_GRAPH_BASE.removeColonEndOfString(recordData.FHRBASELINE_EVENT_CODE_NAME);
this.setRecordData(recordData);
this.plotGraph();
PARTO_GRAPH_BASE.addTimeScaleButtons(this.getStyles().getId());
this.registerEvents();
}else{this.finalizeComponent(noDataHTML,MP_Util.CreateTitleText(this,""));
}$("#"+this.getStyles().getId()).css("margin-bottom",PARTO_GRAPH_BASE.getComponentBottomPadding());
}catch(err){MP_Util.LogJSError(err,this,"partogramfhr.js","RenderComponent");
if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}}};
