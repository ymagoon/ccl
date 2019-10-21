function PartoTableBaseStyleWF(){this.initByNamespace("parto-tb-wf");
}var PARTO_TABLE_BASE=function(){function PartoTableBase(){this.HOUR_WINDOW=12;
this.tableComponentsMap={};
var ONE_HOUR_MS=1*60*60*1000;
this.HOUR_WINDOW_IN_MS=this.HOUR_WINDOW*ONE_HOUR_MS;
this.TABLE_START_TIME=null;
this.TABLE_END_TIME=null;
var STATIC_CONTENT_PATH;
this.scrollLeft=0;
this.prevEdgeTruncatedColumns={};
this.legendColumnWidth=0;
this.tableBodyWidth=0;
this.extraHoursToBeDrawn=24;
this.setFlowSheetTableDimensions=function(uniqueCompId){var compDOMObj=$("#"+uniqueCompId);
if(!compDOMObj.length){return;
}var labelTableDiv=$(compDOMObj).find(".fs-label-table");
var resultsTableDiv=$("#"+uniqueCompId+"resultsTabletable");
var resultsTableBodyDiv=$("#"+uniqueCompId+"resultsTabletableBody");
var resultsTableBodyDivTableId=document.getElementById(uniqueCompId+"resultsTabletableBodyId");
var percentageWidthAllocatedForLegendContainer=0.12;
var graphAxisWidth=25;
this.legendColumnWidth=this.legendColumnWidth||percentageWidthAllocatedForLegendContainer*compDOMObj.width();
var graphCol1containerWidth=this.legendColumnWidth+graphAxisWidth;
var plotWidth=PARTO_GRAPH_BASE.getComponentWidth();
labelTableDiv.css({width:graphCol1containerWidth});
resultsTableDiv.css({width:plotWidth});
this.tableBodyWidth=this.tableBodyWidth||resultsTableBodyDivTableId.scrollWidth;
var scrollLeft=this.getScrollLeftForTable(this.tableBodyWidth);
$(resultsTableBodyDiv).css({width:this.tableBodyWidth+"px"});
$("#"+uniqueCompId+" .partoTopBarContainer.table").css({"margin-left":graphCol1containerWidth});
resultsTableDiv.scrollLeft(scrollLeft);
};
this.addPartogramTableAttributes=function(uniqueCompId){var resultsTableDiv=$("#"+uniqueCompId+"resultsTabletable");
var currentTimeDiv="<div class = 'parto-table-currentTimeOverlay' id='"+uniqueCompId+"currentTimeOverlay'></div>";
var resultsTableBodyDiv=$("#"+uniqueCompId+"resultsTabletableBody");
$("#"+uniqueCompId).addClass("partogramTableDiv");
$("#"+uniqueCompId+"resultsTabletableBody table").prop("id",uniqueCompId+"resultsTabletableBodyId");
this.setFlowSheetTableDimensions(uniqueCompId);
if(!PARTO_GRAPH_BASE.topBarTableHTML){PARTO_GRAPH_BASE.refreshTopbar(uniqueCompId);
}this.setCursorHand("OPEN",uniqueCompId);
resultsTableBodyDiv.addClass("partogramTableBodyDiv");
resultsTableDiv.prepend(currentTimeDiv);
this.displayCurrentTimeBar(uniqueCompId);
this.truncateEdgeColumnCells(uniqueCompId);
};
this.truncateEdgeColumnCells=function(uniqueCompId){var tableObj=$("#"+uniqueCompId+"resultsTabletableBodyId").get(0);
var tableBodyWidth=$("#"+uniqueCompId+"resultsTabletable").outerWidth();
var edgeColumns=this.getEdgeColumns(tableObj);
var rowCnt=tableObj.rows.length;
this.resetPreviousEdgeTruncation(uniqueCompId);
var ELLIPSES="...";
var EMPTY_CELL="&nbsp;";
var EMPTY_STRING="";
var leftEdgeData=[];
var rightEdgeData=[];
var leftEdgeCutpoint=this.scrollLeft;
var rightEdgeCutpoint=leftEdgeCutpoint+tableBodyWidth;
var newCellHTML;
for(var i=0;
i<rowCnt;
i++){var tableRowsCell=tableObj.rows[i].cells;
var leftTableCell=tableRowsCell[edgeColumns.LEFT_INDEX];
var rightTableCell=tableRowsCell[edgeColumns.RIGHT_INDEX];
if(!leftTableCell||!rightTableCell){continue;
}var leftTableSpan=$(leftTableCell).find("span");
var rightTableSpan=$(rightTableCell).find("span");
if(leftTableSpan.length>0&&leftTableSpan[0].innerHTML!==EMPTY_STRING&&leftTableSpan[0].innerHTML!==EMPTY_CELL){leftTableSpan=$(leftTableSpan).get(0);
var leftCellLeft=leftTableCell.offsetLeft;
var leftSpanLeft=leftTableSpan.offsetLeft;
var leftSpanWidth=$(leftTableSpan).outerWidth();
var leftSpanStart=leftCellLeft+leftSpanLeft;
var leftSpanEnd=leftSpanStart+leftSpanWidth;
var leftCellHTML=leftTableCell.innerHTML;
newCellHTML=leftCellHTML;
if(leftSpanStart<leftEdgeCutpoint&&leftSpanEnd>leftEdgeCutpoint){leftEdgeData.push({ROW:i,COL:edgeColumns.LEFT_INDEX,HTML:leftCellHTML});
newCellHTML=ELLIPSES;
}leftTableCell.innerHTML=newCellHTML;
}if(rightTableSpan.length>0&&rightTableSpan[0].innerHTML!==EMPTY_STRING&&rightTableSpan[0].innerHTML!==EMPTY_CELL){rightTableSpan=$(rightTableSpan).get(0);
var rightCellLeft=rightTableCell.offsetLeft;
var rightSpanLeft=rightTableSpan.offsetLeft;
var rightSpanWidth=$(rightTableSpan).outerWidth();
var rightSpanStart=rightCellLeft+rightSpanLeft;
var rightSpanEnd=rightSpanStart+rightSpanWidth;
var rightCellHTML=rightTableCell.innerHTML;
newCellHTML=rightCellHTML;
if(rightSpanStart<rightEdgeCutpoint&&rightSpanEnd>rightEdgeCutpoint){rightEdgeData.push({ROW:i,COL:edgeColumns.RIGHT_INDEX,HTML:rightCellHTML});
newCellHTML=ELLIPSES;
}rightTableCell.innerHTML=newCellHTML;
}}this.prevEdgeTruncatedColumns[uniqueCompId].LEFT_EDGE=leftEdgeData;
this.prevEdgeTruncatedColumns[uniqueCompId].RIGHT_EDGE=rightEdgeData;
};
this.resetPreviousEdgeTruncation=function(uniqueCompId){var cellData,i;
if(typeof(this.prevEdgeTruncatedColumns[uniqueCompId])==="undefined"){this.prevEdgeTruncatedColumns[uniqueCompId]={};
return;
}if($.isEmptyObject(this.prevEdgeTruncatedColumns[uniqueCompId])){return;
}var tableObj=$("#"+uniqueCompId+"resultsTabletableBodyId").get(0);
var leftEdgeData=this.prevEdgeTruncatedColumns[uniqueCompId].LEFT_EDGE;
var rightEdgeData=this.prevEdgeTruncatedColumns[uniqueCompId].RIGHT_EDGE;
var leftRowCnt=leftEdgeData.length;
var rightRowCnt=rightEdgeData.length;
for(i=0;
i<leftRowCnt;
i++){cellData=leftEdgeData[i];
tableObj.rows[cellData.ROW].cells[cellData.COL].innerHTML=cellData.HTML;
}for(i=0;
i<rightRowCnt;
i++){cellData=rightEdgeData[i];
tableObj.rows[cellData.ROW].cells[cellData.COL].innerHTML=cellData.HTML;
}this.prevEdgeTruncatedColumns[uniqueCompId]={};
};
this.getEdgeColumns=function(){var startTime=PARTO_GRAPH_BASE.getStartDate();
var timeForOneColumn=this.getColumnsinHours()*ONE_HOUR_MS;
var leftCol=Math.floor((startTime-this.TABLE_START_TIME)/timeForOneColumn);
var rightCol=leftCol+this.HOUR_WINDOW/this.getColumnsinHours();
return{LEFT_INDEX:leftCol,RIGHT_INDEX:rightCol};
};
this.setCursorHand=function(type,uniqueCompID){var cursorPath=STATIC_CONTENT_PATH+"/images";
switch(type){case"OPEN":cursorPath+="/partoOpenHand.cur";
break;
case"CLOSE":cursorPath+="/partoClosedHand.cur";
break;
}if(uniqueCompID){$("#"+uniqueCompID+"resultsTabletable").css("cursor","url("+cursorPath+"), default");
}else{$(".partogramTableBodyDiv").css("cursor","url("+cursorPath+"), default");
}};
this.getScrollLeftForTable=function(tableBodyWidth){var startDate=PARTO_GRAPH_BASE.getStartDate();
var totalTableTime=this.TABLE_END_TIME-this.TABLE_START_TIME;
var amountOfTimePassedSinceStartDate=this.TABLE_END_TIME-startDate;
var amountOfTimePassedSinceStartDateInPixels=tableBodyWidth*(amountOfTimePassedSinceStartDate/totalTableTime);
this.scrollLeft=tableBodyWidth-amountOfTimePassedSinceStartDateInPixels;
return this.scrollLeft;
};
this.getColumnsinHours=function(){switch(this.HOUR_WINDOW){case 1:return 0.25;
case 4:return 1;
case 8:return 1;
case 12:return 2;
case 24:return 3;
}};
this.EventResultBucket=function(eventDate,eventDateDisp,eventSeq){var mEventData=eventDate;
var mEventDateDisp=eventDateDisp;
var mSeq=eventSeq;
var mResults=[];
this.getEventDate=function(){return mEventData;
};
this.getEventDateDisp=function(){return mEventDateDisp;
};
this.addResult=function(result){mResults.push(result);
};
this.getResults=function(){return mResults;
};
this.getSeq=function(){return mSeq;
};
};
this.EventResult=function(eventResult,eventData,eventLabel,eventCode){var mEventData=eventResult.DATE;
var mEventCode=eventCode;
var mDynamicLabel=eventLabel;
var mUom=eventData.UNIT;
var mResult=eventData.RESULT;
var mNormalcy=eventData.NORMALCY;
var mModifiedIndicator=eventData.MODIFIED_IND;
this.getResult=function(){return mResult;
};
this.getEventDate=function(){return mEventData;
};
this.getEventCode=function(){return mEventCode;
};
this.isDynamicLabel=function(){if(mDynamicLabel===null){return false;
}return true;
};
this.getDynamicLabel=function(){return mDynamicLabel;
};
this.getDisplay=function(){return mEventCode.display;
};
this.getUnitOfMeasure=function(){return mUom;
};
this.getNormalcy=function(){return mNormalcy;
};
this.getModifiedIndicator=function(){return mModifiedIndicator;
};
};
this.EventRow=function(label,buckets,dynamicLabelRow,unit){var mLabel=label;
var mBuckets=buckets;
var mDynamicLabel=dynamicLabelRow;
var mUnit=unit;
this.getLabel=function(){return mLabel;
};
this.getBuckets=function(){return mBuckets;
};
this.isDynamicLabelRow=function(){return mDynamicLabel;
};
this.getRowUnit=function(){return mUnit;
};
};
this.AssessmentTable=function(buckets){var mRows=[];
var mBuckets=buckets;
this.initAssessmentData=function(results,events){var resultsLength=results.length;
for(var x=0;
x<resultsLength;
x++){var data=results[x].DATA;
var dataLength=data.length;
for(var y=0;
y<dataLength;
y++){var unitData=data[y];
var eventCode=unitData.CODE;
var unit=unitData.UNIT;
var newBuckets=null;
var eventRow=null;
var eventResult=null;
var eventSeq=PARTO_TABLE_BASE.getRowSequence(eventCode,events);
eventResult=new PARTO_TABLE_BASE.EventResult(results[x],unitData,null,eventCode);
eventRow=mRows[eventSeq];
if(!eventRow){newBuckets=this.createEventRowBuckets(mBuckets);
eventRow=new PARTO_TABLE_BASE.EventRow(PARTO_TABLE_BASE.getRowLabel(eventCode,events),newBuckets,false,unit);
if(eventSeq!==-1){mRows[eventSeq]=eventRow;
}}this.addResultToBucket(eventResult,eventRow);
}var labels=results[x].LABELS;
var labelsLength=labels.length;
for(var z=0;
z<labelsLength;
z++){var lablesDataLength=labels[z].LABEL_DATA.length;
for(var k=0;
k<lablesDataLength;
k++){var labelData=labels[z].LABEL_DATA[k];
var labelEventCode=labelData.CODE;
var labelNewBuckets=null;
var labelEventRow=null;
var labelEventResult=null;
var labelEventSeq=PARTO_TABLE_BASE.getRowSequence(labelEventCode,events);
var rowUnit=labelData.UNIT;
labelEventResult=new PARTO_TABLE_BASE.EventResult(results[x],labelData,labels[z].LABEL,labelEventCode);
labelEventRow=mRows[labelEventSeq];
if(!labelEventRow){labelNewBuckets=this.createEventRowBuckets(mBuckets);
labelEventRow=new PARTO_TABLE_BASE.EventRow(PARTO_TABLE_BASE.getRowLabel(labelEventCode,events),labelNewBuckets,true,rowUnit);
if(labelEventSeq!==-1){mRows[labelEventSeq]=labelEventRow;
}}this.addResultToBucket(labelEventResult,labelEventRow);
}}}};
this.getRows=function(){return mRows;
};
this.addResultToBucket=function(result,eventRow){var resultDate=result.getEventDate();
var eventTime=resultDate.getTime();
var rowBuckets=eventRow.getBuckets();
var rowBucketsLength=rowBuckets.length;
var stepHrs=PARTO_TABLE_BASE.getColumnsinHours()*ONE_HOUR_MS;
for(var x=0;
x<rowBucketsLength;
x++){var rowBucket=rowBuckets[x];
var bucketMinLimit=rowBucket.getEventDate().getTime();
var bucketMaxLimit=bucketMinLimit+stepHrs;
if(eventTime>=bucketMinLimit&&eventTime<=bucketMaxLimit){rowBucket.addResult(result);
break;
}}};
this.createEventRowBuckets=function(bucketsTemplate){var rowBuckets=[];
var bucketsTemplateLength=bucketsTemplate.length;
for(var x=0;
x<bucketsTemplateLength;
x++){rowBuckets.push(new PARTO_TABLE_BASE.EventResultBucket(bucketsTemplate[x].getEventDate(),bucketsTemplate[x].getEventDateDisp(),bucketsTemplate[x].getSeq()));
}return rowBuckets;
};
};
this.formatNumber=function(num){if(typeof num==="string"){num=mp_formatter._trim(num);
}if(!mp_formatter._isNumber(num)){return num;
}return MP_Util.GetNumericFormatter().format(num);
};
this.unpackReply=function(recordData){var i,j,k;
var events=[];
var eventDate;
var recordDataLength=recordData.QUAL.length;
for(i=0;
i<recordDataLength;
i++){var data=[];
var tableDataLength=recordData.QUAL[i].TABLE_DATA.length;
var qual=recordData.QUAL[i];
var dynamicListLength=recordData.QUAL[i].DYNAMIC_LIST.length;
var labels=[];
eventDate=new Date();
eventDate.setISO8601(recordData.QUAL[i].DATA_DT_TM);
for(j=0;
j<tableDataLength;
j++){var rslt;
var tableDataUnit=qual.TABLE_DATA[j];
if(tableDataUnit.RESULT_TYPE_FLAG===5){rslt=PARTO_GRAPH_BASE.getFormattedLocalDateTime(tableDataUnit.EVENT_RESULT,"FULL_DATE_TIME");
}else{rslt=this.formatNumber(tableDataUnit.EVENT_RESULT);
}data.push({CODE:tableDataUnit.EVENT_CODE,RESULT:rslt,UNIT:tableDataUnit.EVENT_RESULT_UNITS,LABEL_FLAG:tableDataUnit.DYNAMIC_LABEL_FLAG,NORMALCY:tableDataUnit.RESULT_NORMALCY,MODIFIED_IND:tableDataUnit.RESULT_MODIFIED_IND});
}for(j=0;
j<dynamicListLength;
j++){var labelData=[];
var dynamicData=qual.DYNAMIC_LIST[j];
var dynamicDataLength=dynamicData.DYNAMIC_DATA.length;
for(k=0;
k<dynamicDataLength;
k++){var rslt1;
var dynamicDataUnit=dynamicData.DYNAMIC_DATA[k];
if(dynamicDataUnit.EVENT_RESULT&&dynamicDataUnit.RESULT_TYPE_FLAG===5){rslt1=PARTO_GRAPH_BASE.getFormattedLocalDateTime(dynamicDataUnit.EVENT_RESULT,"FULL_DATE_TIME");
}else{rslt1=this.formatNumber(dynamicDataUnit.EVENT_RESULT);
}labelData.push({CODE:dynamicDataUnit.EVENT_CODE,RESULT:rslt1,UNIT:dynamicDataUnit.EVENT_RESULT_UNITS,NORMALCY:dynamicDataUnit.RESULT_NORMALCY,MODIFIED_IND:dynamicDataUnit.RESULT_MODIFIED_IND});
}labels.push({LABEL:PARTO_GRAPH_BASE.removeColonEndOfString(dynamicData.DYNAMIC_LABEL),ID:dynamicData.DYNAMIC_LABEL_ID,LABEL_DATA:labelData});
}events.push({DATE:eventDate,DYNAMIC_LABEL:qual.DYNAMIC_LABEL,LABEL_ID:qual.DYNAMIC_LABEL_ID,DATA:data,LABELS:labels});
}events.sort(function(a,b){return b.DATE.getTime()-a.DATE.getTime();
});
return events;
};
this.getDynamicLabels=function(recordData,maxDynamicLabelsCnt){var j;
var i;
var dynLabels=[];
var dynKeys=[];
var qual=recordData.QUAL;
var qualLength=qual.length;
for(i=0;
i<qualLength;
i++){var qualunit=qual[i];
var qualunitDynLabel=qualunit.DYNAMIC_LIST;
var qualunitDynLabelLen=qualunitDynLabel.length;
for(j=0;
j<qualunitDynLabelLen;
j++){var dynLabelunit=qualunitDynLabel[j];
if(dynKeys.indexOf(dynLabelunit.DYNAMIC_LABEL_ID)===-1){dynLabels.push({LABEL:dynLabelunit.DYNAMIC_LABEL,ID:dynLabelunit.DYNAMIC_LABEL_ID});
dynKeys.push(dynLabelunit.DYNAMIC_LABEL_ID);
}}}dynLabels.sort(function sortDynamicLabelSort(label1,label2){var sortRes=0;
if(label1&&label1.LABEL===""){sortRes=1;
}else{if(label2&&label2.LABEL===""){sortRes=-1;
}else{sortRes=((label1.LABEL).toUpperCase()<(label2.LABEL).toUpperCase())?-1:1;
}}return sortRes;
});
return(maxDynamicLabelsCnt)?dynLabels.slice(0,maxDynamicLabelsCnt):dynLabels;
};
this.getRowLabels=function(recordData){var i,l;
var rowLabels=[];
var codeLength=recordData.CODES.length;
for(i=0,l=codeLength;
i<l;
i++){var eventRow=recordData.CODES[i];
if(!eventRow){continue;
}var display=PARTO_GRAPH_BASE.removeColonEndOfString(eventRow.DISPLAY);
rowLabels.push({CODE:eventRow.CODE,DISPLAY:display,SEQUENCE:i});
}return rowLabels;
};
this.getRowLabel=function(codeValue,eventList){var i;
var eventListLength=eventList.length;
for(i=0;
i<eventListLength;
i++){if(eventList[i].CODE===codeValue){return eventList[i].DISPLAY;
}}return"";
};
this.getRowSequence=function(codeValue,eventList){var i;
var eventListLength=eventList.length;
for(i=0;
i<eventListLength;
i++){if(eventList[i].CODE===codeValue){return eventList[i].SEQUENCE;
}}return -1;
};
this.createResultHover=function(result){var hoverHTML=[];
var row=result.RESULT_DATA;
var columnId=result.COLUMN_ID;
var columnDateKey=columnId.substring(4,columnId.indexOf("_"));
var hoverTxt=row.DATA[columnDateKey].HOVER;
var rowLabel=row.LABEL;
var hoverLabel=(rowLabel.indexOf("<br/>")>=0)?rowLabel.substring(0,rowLabel.indexOf("<br/>"))+"</span>":rowLabel;
var partoTablebasei18n=i18n.discernabu.partogramtablebase_o2;
if(hoverTxt===null||hoverTxt===undefined||hoverTxt===""){return null;
}hoverHTML.push("<table class= 'partogram-table-tooltip'><th class = 'partogram-table-tooltip-th'>"+hoverLabel+"</th>");
hoverHTML.push("<th class = 'partogram-table-tooltip-th'><span title='time'>"+partoTablebasei18n.TOOLTIP_TIME+"</th>");
hoverHTML.push(hoverTxt);
hoverHTML.push("</table>");
return hoverHTML.join("");
};
this.shorten=function(prefix,text,maxLength){var ret="";
text="<span>"+text+"</span>";
var secondaryTextFormat="<span class='parto-tb1-wf-unit'>";
if(prefix){if(prefix.length>maxLength){ret=secondaryTextFormat+prefix.substr(0,maxLength-3)+"</span>&hellip;";
}else{if((prefix+text).length>maxLength){ret=secondaryTextFormat+prefix+"</span>"+text.substr(0,maxLength-prefix.length-3)+"&hellip;";
}else{ret=secondaryTextFormat+prefix+"</span>"+text;
}}}else{if(text.length>maxLength){ret=text.substr(0,maxLength-3)+"&hellip;";
}else{ret=text;
}}return ret;
};
this.getTruncationByColumn=function(component,columnCnt){var labelColumnWidth=204;
var pixelBuffer=2;
var contentTableVisibleWidth=$(component.getSectionContentNode()).width()-labelColumnWidth-pixelBuffer;
switch(columnCnt){case 1:return contentTableVisibleWidth;
case 2:return 58;
case 3:return 48;
case 4:return 36;
case 5:return 30;
default:return 24;
}};
this.createResultHoverForColumn=function(dataObj){return PARTO_TABLE_BASE.createResultHover(dataObj);
};
this.setPartogramTableStartEndRange=function(){var colHourRatioInMs=this.getColumnsinHours()*ONE_HOUR_MS;
var partogramEndDate=new Date(PARTO_GRAPH_BASE.getPartogramLastLoadTime());
partogramEndDate.setHours(partogramEndDate.getHours()+this.extraHoursToBeDrawn);
var offset=-1*partogramEndDate.getTimezoneOffset()*60*1000;
var partogramEndDateAdjusted=partogramEndDate.getTime()+offset;
var endTime=Math.floor(partogramEndDateAdjusted/colHourRatioInMs)*colHourRatioInMs+colHourRatioInMs-offset;
var partogramStartDate=new Date(PARTO_GRAPH_BASE.finalStartTime);
var partogramStartDateAdjusted=partogramStartDate.getTime()+offset;
var startTime=Math.floor(partogramStartDateAdjusted/colHourRatioInMs)*colHourRatioInMs-offset;
this.TABLE_START_TIME=startTime;
this.TABLE_END_TIME=endTime;
};
this.refreshTable=function(){var scrollLeft=null;
var tableBodyWidth=this.tableBodyWidth;
for(var uniqueCompId in this.tableComponentsMap){if(this.tableComponentsMap.hasOwnProperty(uniqueCompId)){tableBodyWidth=tableBodyWidth||$("#"+uniqueCompId+"resultsTabletableBody").outerWidth();
scrollLeft=scrollLeft||this.getScrollLeftForTable(tableBodyWidth);
$("#"+uniqueCompId+"resultsTabletable").scrollLeft(scrollLeft);
this.displayCurrentTimeBar(uniqueCompId);
this.truncateEdgeColumnCells(uniqueCompId);
}}this.setCursorHand("OPEN");
};
this.redrawTable=function(hourWindow){this.setHourWindow(hourWindow);
this.tableBodyWidth=0;
for(var uniqueCompId in this.tableComponentsMap){if(this.tableComponentsMap.hasOwnProperty(uniqueCompId)){this.resetPreviousEdgeTruncation(uniqueCompId);
PARTO_TABLE_BASE.renderTableSection(this.tableComponentsMap[uniqueCompId]);
PARTO_TABLE_BASE.addPartogramTableAttributes(uniqueCompId);
this.truncateEdgeColumnCells(uniqueCompId);
}}};
this.setHourWindow=function(hourWindow){this.HOUR_WINDOW=hourWindow;
this.HOUR_WINDOW_IN_MS=this.HOUR_WINDOW*ONE_HOUR_MS;
};
this.displayCurrentTimeBar=function(uniqueCompId){var partogramLastLoadTime=PARTO_GRAPH_BASE.getPartogramLastLoadTime();
var endDt=PARTO_GRAPH_BASE.getEndDate();
var startDt=PARTO_GRAPH_BASE.getStartDate();
var adjustedEnddt=endDt+60000;
var currentTimeBarOverLayDiv=$("#"+uniqueCompId+"currentTimeOverlay");
if(startDt<=partogramLastLoadTime&&partogramLastLoadTime<=adjustedEnddt){var resultsTableBodyDivHeight=$("#"+uniqueCompId+"labelTabletable").height()-50;
var plotWidth=PARTO_GRAPH_BASE.getComponentWidth();
var posResultsTable=this.legendColumnWidth+25+8;
var difference=partogramLastLoadTime-startDt;
var PixelPerMsRatio=plotWidth/this.HOUR_WINDOW_IN_MS;
var overLayDivWidth=currentTimeBarOverLayDiv.width();
var left=(PixelPerMsRatio*difference)+posResultsTable;
if(left>=plotWidth+posResultsTable){left=plotWidth+posResultsTable-overLayDivWidth;
}else{if(left<posResultsTable){left=posResultsTable;
}else{left=left-overLayDivWidth;
}}var currentTimecss={left:left,height:resultsTableBodyDivHeight};
currentTimeBarOverLayDiv.css(currentTimecss);
currentTimeBarOverLayDiv.show();
}else{currentTimeBarOverLayDiv.hide();
}};
this.processFlowsheetData=function(rows,columns,events,dynamicLabels,truncateSize){var FLOWSHEET_DATA=[];
var eventRow=null;
var eventRowBuckets=[];
var aRow=null;
var columnObj=[];
var emptyRow="";
var x,b,y;
var eventsLength=events.length;
if(eventsLength>0){for(x=0;
x<eventsLength;
x++){eventRow=rows[x];
var bucketRow=[];
var rowData=[];
var rowLabel="";
var data=[];
var pad="",paddingCount;
for(b=0;
b<columns.length;
b++){var ky=columns[b].DATE_KEY;
bucketRow[ky]={DISPLAY:emptyRow};
}if(eventRow===null||eventRow===undefined){var noRowLabel="<span title='"+events[x].DISPLAY+"'>"+events[x].DISPLAY;
var noData=bucketRow;
FLOWSHEET_DATA.push({LABEL:noRowLabel,DATA:noData});
}else{rowData=bucketRow;
eventRowBuckets=eventRow.getBuckets();
if(eventRowBuckets){var eventRowBucketsLen=eventRowBuckets.length;
for(y=0;
y<eventRowBucketsLen;
y++){var sFullResultDisplay="";
var sShortenResultDisplay="";
var sHoverResultDisplay="";
var sResult="",shortenText="";
var bucket=eventRowBuckets[y];
var bucketResults=bucket.getResults();
aRow=rowData[eventRowBuckets[y].getSeq()];
var dl,z,count=0;
var normalcyClass,modInd,formattedDate,uom,eventDate;
if(eventRow.isDynamicLabelRow()){sShortenResultDisplay="";
sHoverResultDisplay="";
var noDLData=0;
var dynLabelLength=dynamicLabels.length;
for(dl=0;
dl<dynLabelLength;
dl++){count=0;
var bucketResLength=bucketResults.length;
for(z=0;
z<bucketResLength;
z++){if(dynamicLabels[dl].LABEL.toUpperCase()===bucketResults[z].getDynamicLabel().toUpperCase()){sResult=bucketResults[z].getResult();
var dynamicLabelName=bucketResults[z].getDynamicLabel();
eventDate=new Date(bucketResults[z].getEventDate());
formattedDate=PARTO_GRAPH_BASE.getFormattedLocalDateTime(eventDate,"FULL_DATE_TIME");
normalcyClass=PARTO_GRAPH_BASE.getNormalcyClass(bucketResults[z].getNormalcy());
modInd=bucketResults[z].getModifiedIndicator();
uom=bucketResults[z].getUnitOfMeasure()?"<span class='parto-tb1-wf-unit'>"+bucketResults[z].getUnitOfMeasure()+"</span>":"";
if(sResult){if(count===0){shortenText=this.shorten("["+dynamicLabelName+"]  ",sResult,truncateSize);
sShortenResultDisplay+=this.getModifiedCriticalityHTMLFaceUp(shortenText,normalcyClass,modInd,null);
}sHoverResultDisplay+=this.getModifiedCriticalityHTMLHover(dynamicLabelName,sResult,uom,formattedDate,normalcyClass,modInd);
count++;
}else{sFullResultDisplay=emptyRow;
}}}if(count===0){sShortenResultDisplay+=emptyRow;
noDLData+=1;
}if(count>1){sShortenResultDisplay+="<span class='parto-tb1-wf-unit'>&nbsp;&nbsp;("+count+")</span>";
}sShortenResultDisplay+="<br />";
}if(dynLabelLength===1){sShortenResultDisplay+="<br />";
}sShortenResultDisplay="<span class='parto-table-container-cell-span'>"+sShortenResultDisplay+"</span>";
aRow.DISPLAY=sShortenResultDisplay;
if(noDLData===dynamicLabels.length){aRow.HOVER=emptyRow;
}else{aRow.HOVER=sHoverResultDisplay;
}pad="";
paddingCount=(eventRow.getRowUnit())?dynamicLabels.length-2:dynamicLabels.length-1;
for(var p=0;
p<paddingCount;
p++){pad+="<br/>&nbsp;";
}}else{count=0;
for(z=0;
z<bucketResults.length;
z++){sResult=bucketResults[z].getResult();
if(sResult){normalcyClass=PARTO_GRAPH_BASE.getNormalcyClass(bucketResults[z].getNormalcy());
modInd=bucketResults[z].getModifiedIndicator();
uom=bucketResults[z].getUnitOfMeasure()?"<span class='parto-tb1-wf-unit'>"+bucketResults[z].getUnitOfMeasure()+"</span>":"";
eventDate=new Date(bucketResults[z].getEventDate());
formattedDate=PARTO_GRAPH_BASE.getFormattedLocalDateTime(eventDate,"FULL_DATE_TIME");
if(count===0){var sLength=(bucketResults.length>1)?"<span class='parto-tb1-wf-unit'>("+bucketResults.length+")</span>":"";
shortenText=this.shorten("",sResult,truncateSize);
sFullResultDisplay=this.getModifiedCriticalityHTMLFaceUp(shortenText,normalcyClass,modInd,sLength);
}sHoverResultDisplay+=this.getModifiedCriticalityHTMLHover(null,sResult,uom,formattedDate,normalcyClass,modInd);
count++;
}else{sFullResultDisplay=emptyRow;
}}aRow.DISPLAY=(sFullResultDisplay==="")?emptyRow:"<span class='parto-table-container-cell-span'>"+sFullResultDisplay+"</span>";
if(eventRow.getRowUnit()){aRow.DISPLAY=aRow.DISPLAY+"<br/><br/>";
}aRow.HOVER=(sHoverResultDisplay==="")?emptyRow:sHoverResultDisplay;
}aRow.DATE=eventRowBuckets[y].getEventDateDisp();
data.push(aRow);
}rowLabel+="<span title='"+eventRow.getLabel()+"'>"+eventRow.getLabel();
rowLabel+=(eventRow.getRowUnit())?"<br/><span title='"+eventRow.getRowUnit()+"' class   ='parto-tb1-wf-unit'>"+eventRow.getRowUnit():"";
rowLabel+=(pad+"</span></span>");
FLOWSHEET_DATA.push({LABEL:rowLabel,DATA:data});
}}}}columnObj={RESULTS:FLOWSHEET_DATA};
return columnObj;
};
this.getModifiedCriticalityHTMLFaceUp=function(value,normalcyClass,modifiedInd,count){value=value||"";
normalcyClass=normalcyClass||"";
modifiedInd=modifiedInd||0;
var critHTML;
critHTML="<span class='"+normalcyClass+"'>";
critHTML+="<span class='res-ind'></span>"+value;
critHTML+="</span>";
if(modifiedInd>0){critHTML+="<span class='res-modified'></span>";
}if(count){critHTML+=count;
}return critHTML;
};
this.getModifiedCriticalityHTMLHover=function(dynamicLabelName,value,unit,date,normalcyClass,modifiedInd){value=value||"";
normalcyClass=normalcyClass||"";
modifiedInd=modifiedInd||0;
var critHTML="<TR> <TD class='partogram-table-tooltip-td'>";
if(dynamicLabelName){critHTML+="<span class='parto-tb1-wf-unit'>["+dynamicLabelName+"] </span> ";
}critHTML+="<span class='"+normalcyClass+"'>";
critHTML+="<span class='res-ind'></span>"+value+"</span>";
critHTML+=unit;
if(modifiedInd>0){critHTML+="<span class='res-modified'></span>";
}critHTML+="</TD>";
critHTML+="<TD class='partogram-table-tooltip-td'>"+date+"</TD></TR>";
return critHTML;
};
this.renderTableSection=function(component){var timerRenderComponent=MP_Util.CreateTimer(component.getComponentRenderTimerName());
try{var compId=component.getComponentId();
var MAX_DYNAMIC_LABELS_CNT=3;
var buckets=[];
var componentUniqueKey=component.getStyles().getId();
var df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
var data=[];
var events=[];
var dynamicLabels=[];
var columns=[];
var dateSeq=-1;
var erb,j;
var recordData=component.recordData;
data=this.unpackReply(recordData);
events=this.getRowLabels(recordData);
dynamicLabels=this.getDynamicLabels(recordData,MAX_DYNAMIC_LABELS_CNT);
var step=this.getColumnsinHours();
var stepHrs=step*ONE_HOUR_MS;
this.setPartogramTableStartEndRange();
var hours_difference=(this.TABLE_END_TIME-this.TABLE_START_TIME)/ONE_HOUR_MS;
var columnCount=hours_difference/step;
var initColTime=this.TABLE_START_TIME;
while(initColTime<=this.TABLE_END_TIME-stepHrs){var latestDate="";
var eventDate=new Date(initColTime);
latestDate=df.format(eventDate,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
dateSeq+=1;
var dateDisplay="<span class='fs-new-day'>"+df.format(eventDate,mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR)+"<br />"+df.format(eventDate,mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS)+"</span>";
erb=new this.EventResultBucket(eventDate,latestDate,dateSeq);
buckets.push(erb);
columns.push({DATE:eventDate,COLUMN_DISPLAY:dateDisplay,DATE_KEY:dateSeq});
initColTime+=stepHrs;
}if(typeof this.tableComponentsMap[componentUniqueKey]==="undefined"){this.tableComponentsMap[componentUniqueKey]=component;
STATIC_CONTENT_PATH=component.getCriterion().static_content;
}var assessmentTable=new this.AssessmentTable(buckets);
assessmentTable.initAssessmentData(data,events);
var partogramTableFlowSheet=null;
var hoverExtension=new TableCellHoverExtension();
var column="";
var flowsheetData=null;
var topBarHtml=[];
var plotWidth=PARTO_GRAPH_BASE.getComponentWidth();
var pixelToTimeRatio=plotWidth/this.HOUR_WINDOW_IN_MS;
var columnWidth=ONE_HOUR_MS*pixelToTimeRatio*this.getColumnsinHours();
var truncateSize=this.getTruncationByColumn(component,columnCount);
partogramTableFlowSheet=new FlowsheetTable();
partogramTableFlowSheet.addExtension(hoverExtension);
partogramTableFlowSheet.setNamespace(component.getStyles().getId());
flowsheetData=this.processFlowsheetData(assessmentTable.getRows(),columns,events,dynamicLabels,truncateSize);
partogramTableFlowSheet.resultsTable.setIsHeaderEnabled(false);
partogramTableFlowSheet.addLabelColumn(new TableColumn().setColumnId("EventName").setRenderTemplate("<span>${LABEL}</span>"));
for(j=0;
j<columnCount;
j++){column=new TableColumn().setColumnId("data"+j+"_"+compId).setColumnDisplay(columns[j].COLUMN_DISPLAY).setCustomClass("parto-tb1-wf-content-column").setRenderTemplate("${DATA['"+columns[j].DATE_KEY+"'].DISPLAY}");
column.setWidth(columnWidth);
partogramTableFlowSheet.addResultColumn(column);
hoverExtension.addHoverForColumn(column,this.createResultHoverForColumn);
}partogramTableFlowSheet.bindData(flowsheetData.RESULTS);
component.setFlowsheetTable(partogramTableFlowSheet);
component.finalizeComponent(partogramTableFlowSheet.render());
topBarHtml.push(PARTO_GRAPH_BASE.createTopBar(component.getImageFolderPath(),"TABLE"));
$("#"+componentUniqueKey+"flowsheetContainer").prepend(topBarHtml.join(""));
}catch(err){if(timerRenderComponent){timerRenderComponent.Abort();
timerRenderComponent=null;
}throw (err);
}finally{if(timerRenderComponent){timerRenderComponent.Stop();
}if(component.m_loadTimer){component.m_loadTimer.Stop();
}}};
}var partoTableBaseObj=new PartoTableBase();
return partoTableBaseObj;
}();