/**
 * @class
 * @classdesc Create the component style object which will be used to style various aspects of our component
 * @constructor
 */
function DialysisComponentWFStyle() {
    this.initByNamespace("dialysis");
}
 
DialysisComponentWFStyle.inherits(ComponentStyle);

/**
 * @class
 * @classdesc One Page Dialysis component
 * @constructor
 * @param {Criterion} criterion - The Criterion object which contains information needed to render the component.
 */
function DialysisComponentWF(criterion) {
    this.graphData = [];
    this.dataArr = [];
    this.graphSeries = [];
    this.plot = null;
    //These are the weight code values that should be sent to CCL during data retrieval
    this.weightCodes = [];
    //These are the UF out code values that should be sent to CCL during data retrieval
    this.ufOutCodes = [];
    //These are the start date values that should be sent to CCL during data retrieval
    this.startDateCodes = [];
    //These are the stop date code values that should be sent to CCL during data retrieval
    this.stopDateCodes = [];
    //These are the other event code values that should be sent to CCL during data retrieval
    this.otherEventCodes = [];
    
    this.dialysisI18n = i18n.discernabu.dialysis;
    this.setCriterion(criterion);
    this.setStyles(new DialysisComponentWFStyle());
    this.setComponentLoadTimerName("USR:MPG.DIALYSISCOMPONENT.O2 - load component");
    this.setComponentRenderTimerName("ENG:MPG.DIALYSISCOMPONENT.O2 - render component");

}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
DialysisComponentWF.prototype = new MPageComponent();
DialysisComponentWF.prototype.constructor = MPageComponent;

/**
 * Map the One Page Dialysis Component object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "WF_DIALYSIS" filter
 */
MP_Util.setObjectDefinitionMapping("WF_DIALYSIS", DialysisComponentWF);

/**
 * Sets the code values for Weight as setup in bedrock.
 * @param {[float]} weightCodes : An array of code values for Weight as setup in bedrock.
 */
DialysisComponentWF.prototype.setWeightCodes = function(weightCodes) {
    this.weightCodes = weightCodes;
};

/**
 * Returns the code values for Weight as setup in bedrock.
 * @return {[float]}: An array of code values for Weight as setup in bedrock.
 */
DialysisComponentWF.prototype.getWeightCodes = function() {
    return this.weightCodes;
};

/**
 * Sets the code values for UF out as setup in bedrock.
 * @param {[float]} ufOutCodes : An array of code values for UF out as setup in bedrock.
 */
DialysisComponentWF.prototype.setUfCodes = function(ufOutCodes) {
    this.ufOutCodes = ufOutCodes;
};

/**
 * Returns the code values for UF out as setup in bedrock.
 * @return {[float]}: An array of code values for UF out as setup in bedrock.
 */
DialysisComponentWF.prototype.getUfCodes = function() {
    return this.ufOutCodes;
};

/**
 * Sets the code values for start date as setup in bedrock.
 * @param {[float]} startDateCodes : An array of code values for start date as setup in bedrock.
 */
DialysisComponentWF.prototype.setStartDateCodes = function(startDateCodes) {
    this.startDateCodes = startDateCodes;
};

/**
 * Returns the code values for start date as setup in bedrock.
 * @return {[float]}: An array of code values for start date as setup in bedrock.
 */
DialysisComponentWF.prototype.getStartDateCodes = function() {
    return this.startDateCodes;
};

/**
 * Sets the code values for stop date as setup in bedrock.
 * @param {[float]} stopDateCodes : An array of code values for stop date as setup in bedrock.
 */
DialysisComponentWF.prototype.setStopDateCodes = function(stopDateCodes) {
    this.stopDateCodes = stopDateCodes;
};

/**
 * Returns the code values for stop date as setup in bedrock.
 * @return {[float]}: An array of code values for stop date as setup in bedrock.
 */
DialysisComponentWF.prototype.getStopDateCodes = function() {
    return this.stopDateCodes;
};

/**
 * Sets the code values for other event as setup in bedrock.
 * @param {[float]} otherEventCodes : An array of code values for other event as setup in bedrock.
 */
DialysisComponentWF.prototype.setOtherEventCodes = function(otherEventCodes) {
    this.otherEventCodes = otherEventCodes;
};

/**
 * Returns the code values for other event as setup in bedrock.
 * @return {[float]}: An array of code values for other event as setup in bedrock.
 */
DialysisComponentWF.prototype.getOtherEventCodes = function() {
    return this.otherEventCodes;
};

/**
 * @method Returns the jqplot object.
 * @param {null} 
 * @return {object} A reference to the jqplot object.
 */
DialysisComponentWF.prototype.getPlot = function () {
    return this.plot;
};

/**
 * Refreshed the component. Overloading the base class function.
 * @return {undefined}
 */
DialysisComponentWF.prototype.refreshComponent = function () {
    this.graphData = [];
    this.dataArr = [];
    this.graphSeries = [];
    this.plot = null;
 
    MPageComponent.prototype.refreshComponent.call(this);
};

/**
 * @method Creates the filterMappings that will be used when loading the component's bedrock settings
 * @param {null} 
 * @return {null}
 */
DialysisComponentWF.prototype.loadFilterMappings = function(){
    //Add the filter mapping object for the weight Codes
    this.addFilterMappingObject("WF_DIALYSIS_WEIGHT", {
        setFunction: this.setWeightCodes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });
    //Add the filter mapping object for the UF out Codes
    this.addFilterMappingObject("WF_DIALYSIS_UF_OUTPUT", {
        setFunction: this.setUfCodes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });
    //Add the filter mapping object for the start date Codes
    this.addFilterMappingObject("WF_DIALYSIS_START_DATE_TIME", {
        setFunction: this.setStartDateCodes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });
    //Add the filter mapping object for the stop date Codes
    this.addFilterMappingObject("WF_DIALYSIS_STOP_DATE_TIME", {
        setFunction: this.setStopDateCodes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });
    //Add the filter mapping object for the other event Codes
    this.addFilterMappingObject("WF_DIALYSIS_CLINICAL_EVENT", {
        setFunction: this.setOtherEventCodes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });
};

/**
 * @method Store a reference to the jqplot object
 * @param {object} plot - A reference to the jqplot object
 * @return {null}
 */
DialysisComponentWF.prototype.setPlot = function (plot) {
    this.plot = plot;
};

/**
 * @method Returns an array containing all points to be plotted on the graph (times and dates).
 * @param {null} 
 * @return {array} - The list of all plotted points on the graph.
 */
DialysisComponentWF.prototype.getGraphData = function () {
    return this.graphData;
};

/**
 * @method Store the reference to an array containing all points to be plotted on the graph (times and dates).
 * @param {array} data - An array containing all points to plot on the graph. 
 * @return {null}
 */
DialysisComponentWF.prototype.setGraphData = function (data) {
    this.graphData = data;
};

/**
 * @method Returns an array containing all series specifications (styling) for their corresponding points on the graph.
 * @param {null} 
 * @return {array} - The reference to an array containing all series specification
 */
DialysisComponentWF.prototype.getGraphSeries = function () {
    return this.graphSeries;
};

/**
 * @method Returns an array containing all series specifications (styling) for their corresponding points on the graph.
 * @param {array} data -  An array containing all series specifications
 * @return {null} 
 */
DialysisComponentWF.prototype.setGraphSeries = function (data) {
    this.graphSeries = data;
};

/**
 * @method Returns the reference to the json data returned from the back-end to be plotted on the graph.
 * @param {null} 
 * @return {array} A reference to the json data returned from the back-end .
 */
DialysisComponentWF.prototype.getDataArr = function () {
    return this.dataArr;
};

/**
 * @method Returns the reference to the json data returned from the back-end to be plotted on the graph.
 * @param {array} data - A reference to the json data returned from the back-end .
 * @return {null}
 */
DialysisComponentWF.prototype.setDataArr = function(data) {
    this.dataArr = data;
};

/**
 * @method This is the  dialysis implementation of the retrieveComponentData function.
 * It creates the necessary parameter array for the data acquisition script call and the associated Request object.
 * @param {null} 
 * @return {null}
 */
DialysisComponentWF.prototype.retrieveComponentData = function () {
    var sendAr = [];
    var criterion = this.getCriterion();
    
    sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", criterion.ppr_cd + ".0");
    sendAr.push(MP_Util.CreateParamArray(this.getStartDateCodes(), 1));
    sendAr.push(MP_Util.CreateParamArray(this.getStopDateCodes(), 1));
    sendAr.push(MP_Util.CreateParamArray(this.getUfCodes(), 1));
    sendAr.push(MP_Util.CreateParamArray(this.getWeightCodes(), 1));
    sendAr.push(MP_Util.CreateParamArray(this.getOtherEventCodes(), 1));
    
    MP_Core.XMLCclRequestWrapper(this, "MP_DIALYSIS", sendAr, true);
};

/**
 * @method This is the  dialysis component implementation of the renderComponent function.
 * @param {object} recordData - The JSON object containing all results returned from the CCL. 
 * @return {null}
 */
DialysisComponentWF.prototype.renderComponent = function (recordData) {
    try {
        var bodyHTML = [];
        
        this.setDataArr(recordData);
        
        bodyHTML.push('<div class="dialysis-container content-body">');
        bodyHTML.push(this.createHeader());
        bodyHTML.push('<div class="dialysis-container-col-1">');
        bodyHTML.push('<div id="'+this.getComponentId()+'dialysisGraphContainer"></div>');
        bodyHTML.push('</div>');
        bodyHTML.push('<div class="dialysis-container-col-2">');
        bodyHTML.push(this.createLegend());
        bodyHTML.push('</div><div>');
        
        this.createSeries();
        MP_Util.Doc.FinalizeComponent(bodyHTML.join(""), this, "");
        //Create and append the graph to the dialysisGraphContainer.
        this.plotGraph();
    } 
    catch(err){
        MP_Util.LogJSError(err, this, "dialysis.js", "renderComponent");
        alert(err);
        throw(err);
    }
};

/**
 * @method This method will return the number of days between two dates. It also takes the leap year into account.
 * @param {object} startDate - The start date of the dialysis session
 * @param {object} endDate - The end date of the dialysis session
 * @return {number} - The difference of days between the start and end date.
 */
DialysisComponentWF.prototype.getDaysBetweenDates = function (startDate, endDate){
    var startMonth = startDate.getMonth();
    var endMonth = endDate.getMonth();
    var dateDiff = -1;
    var tempStartDiff = 0;
    var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var isLeap = null;
    
    if(startMonth === endMonth){
        dateDiff = endDate.getDate() - startDate.getDate();
    }
    else{
        //We need to take the leap into account, we will make sure to choose the correct number of days in the month of February.
        isLeap = new Date(startDate.getYear(), 1, 29).getMonth() == 1;
        monthDays[1] = (isLeap) ? 29: 28;
        //In order to the difference of days between the start and end date, we need the remaining number of days until the end of the current month.
        tempStartDiff = monthDays[startMonth] - startDate.getDate();
        //Add the remaining number of days to the current date in the next month.
        dateDiff = endDate.getDate() + tempStartDiff;
    }
    
    return dateDiff; 
};

/**
 * @method This method will create the legend on the side of the graph.
 * @param {null}
 * @return {string} An empty HTML layout for the legend.
 */
DialysisComponentWF.prototype.createLegend = function (item) {
    var layoutHTML = [];
    var tooltipStartDt = this.dialysisI18n.tooltipStartDt;
    var tooltipEndDt = this.dialysisI18n.tooltipEndDt;
    var tooltipUF = this.dialysisI18n.tooltipUF;
    var measuredWeight = this.dialysisI18n.measuredWeight;
    
    layoutHTML.push('<div class="dialysis-legend" id="dialysis-legend-'+this.getComponentId()+'">');
    layoutHTML.push('<div class="dialysis-legend-item"><div class="dialysis-legend-img"><div id="dialysis-right-triangle"></div></div><div title="'+tooltipStartDt+'" class="dialysis-legend-item-name"><span>'+tooltipStartDt+'</span></div></div>');
    layoutHTML.push('<div class="dialysis-legend-item"><div class="dialysis-legend-img"><div id="dialysis-left-triangle"></div></div><div title="'+tooltipEndDt+'" class="dialysis-legend-item-name"><span>'+tooltipEndDt+'</span></div></div>');
    layoutHTML.push('<div class="dialysis-legend-item"><div class="dialysis-legend-img"><div id="dialysis-star"></div></div><div title="'+tooltipUF+'" class="dialysis-legend-item-name"><span>'+tooltipUF+'</span></div></div>');
    layoutHTML.push('<div class="dialysis-legend-item"><div class="dialysis-legend-img"><div id="dialysis-square"></div></div><div title="'+measuredWeight+'" class="dialysis-legend-item-name"><span>'+measuredWeight+'</span></div></div>');
    layoutHTML.push('</div>');
    
    return layoutHTML.join('');
};

/**
 * @method This method will create the header where all information about 'other' data from CCL will be shown.
 * @param {null}
 * @return {string} The HTML layout for the header.
 */
DialysisComponentWF.prototype.createHeader = function () {
    var layoutHTML = [];
    var cnt, eventName, eventResult, eventUnit, startDtTm, startDate, startTime;
    var shortDate3 = dateFormat.masks.shortDate3;
    var timeFormat = dateFormat.masks.isoTime;
    var data = this.getDataArr();
    var otherArr = data.OTHER_EVENT_LIST;
    var otherArrLen = otherArr.length;
    var startDateObj = new Date();
    var commaSeparator;
    
    layoutHTML.push('<div class="dialysis-header" id="dialysis-header-'+this.getComponentId()+'">');
    layoutHTML.push('<table>');
    if(otherArrLen > 0){
        for(cnt=0; cnt<otherArrLen; cnt++){
            commaSeparator = ' ';
            eventName = otherArr[cnt].OE_DESCRIPTION;
            eventResult = otherArr[cnt].OE_RESULT;
            eventUnit = otherArr[cnt].OE_RESULT_UNIT;
            startDtTm = otherArr[cnt].OE_RESULT_DT_TM;
            startDateObj.setISO8601(startDtTm);
            startDate = startDateObj.format(shortDate3);
            startTime = startDateObj.format(timeFormat);
            
            //Add the logic to remove the space the there are units.
            if(!eventUnit){
                commaSeparator = '';
            }
        
            if(cnt%2 === 0){
                layoutHTML.push('<tr>');
                layoutHTML.push('<td class="dialysis-header-item-cell" title="'+eventName+': '+eventResult + commaSeparator+eventUnit + ', '+ startDate +' '+ startTime+'"><div class="dialysis-header-item"><span class="dialysis-header-item-desc">'+eventName+':&nbsp;</span><span>'+eventResult+commaSeparator+eventUnit+', '+startDate +' '+ startTime+'</span></div></td>');        
            }
            else{
                layoutHTML.push('<td class="dialysis-header-item-cell" title="'+eventName+': '+eventResult + commaSeparator+eventUnit + ', '+ startDate +' '+ startTime+'"><div class="dialysis-header-item"><span class="dialysis-header-item-desc">'+eventName+':&nbsp;</span><span>'+eventResult+commaSeparator+eventUnit+', '+startDate +' '+ startTime+'</span></div></td>');        
                layoutHTML.push('</tr>');
            }
        }
        if(otherArrLen%2 === 0){
            layoutHTML.push('</tr>');
        }
    }
    layoutHTML.push('</table>');
    layoutHTML.push('</div>');
    
    return layoutHTML.join('');
};

/**
 * @method This method will populate the correct data and its corresponding styling specs in their respective arrays.
 * @return {null}
 */
DialysisComponentWF.prototype.createSeries = function () {
    var data = this.getDataArr();
    var graphData = this.getGraphData();
    var graphSeries = this.getGraphSeries();
    var seriesQualArr = data.SERIES_QUAL;
    var seriesQualArrLen = seriesQualArr.length;
    var expArr = data.EXCEPTION_LIST;
    var expArrLen = expArr.length;
    var weightArr = data.WEIGHT_LIST;
    var weightArrLen = weightArr.length;
    var seriesIndex, startDate, endDate, startTime, endTime, daysDiff,ufOut, daysCnt, ufOutUnit;
    var startDateObj = new Date();
    var endDateObj = new Date();
    var tooltipStartDt = this.dialysisI18n.tooltipStartDt;
    var tooltipEndDt = this.dialysisI18n.tooltipEndDt;
    var tooltipProgress = this.dialysisI18n.tooltipProgress;
    var tooltipUF = this.dialysisI18n.tooltipUF;
    var resultDate = this.dialysisI18n.resultDate;
    var weightMeasu = this.dialysisI18n.measuredWeight;
    var weekDays = 7;
    var dates = [];
    var counter = 0;
    var todaysDate = new Date();
    var startDatePlusOne = new Date();
    var dateFormat2 = dateFormat.masks.shortDate2;
    var dateFormat3 = dateFormat.masks.shortDate3;
    var timeFormat = dateFormat.masks.isoTime;
    var dateFormatLong = dateFormat.masks.longDateTime3;
    var eventName, eventResult, eventUnit, eventDesc,formatTooltip, date;
    var minStartTime = "00:00:00";
    var maxEndTime = "23:59:59";
    
    //This is a fake series that does not on the graph. It is necessary in order to display the y-axis(category renderer) in the desired order.
    //Must be the very data to be pushed in graphData and graphSeries arrays.
    //DO NOT MOVE - the date variable is being used below to access the last (7th day backward).    
    for(counter=0; counter<weekDays; counter++){ 
        date = new Date();    
        date.setDate(todaysDate.getDate() - counter);
        date.setHours(0,0,0,0); //Set the time to midnight. The last value in this variable will be used as a reference to the seventh day backward.
        dates.push(["00:00:00",date.format(dateFormat3)]);
    }
    graphData.push(dates);
    graphSeries.push(this.formatSeries(false, false, {style:""}, {show:false}, "#FFFFFF",false));
    
    //Get all array for the seriesQual object (regular dialysis)
    for(seriesIndex=0; seriesIndex<seriesQualArrLen; seriesIndex++){
        //We want to break out of this loop if the seriesQual array is empty.
        if(seriesQualArrLen ===0){
            break;
        }
        startDtTm = seriesQualArr[seriesIndex].START_DT_TM;
        startDateObj.setISO8601(startDtTm);
        startDate = startDateObj.format(dateFormat3);
        startTime = startDateObj.format(timeFormat);
        endDtTm = seriesQualArr[seriesIndex].STOP_DT_TM;
        ufOut = seriesQualArr[seriesIndex].UF_OUT;
        ufOutUnit = seriesQualArr[seriesIndex].UF_OUT_UNIT;
        
        //If this session is still in progress, the end time and date would be now.
        if(endDtTm === "CURRENT"){
            endDateObj = new Date();
            formatTooltip = ['<div class="dialysis-tooltip"><b>',tooltipStartDt,'</b>: '+startDateObj.format(dateFormatLong)+'<br>','<b>',tooltipEndDt,'</b>: '+tooltipProgress+'<br>','<b>',tooltipUF,'</b>: '+ufOut+'</div>'].join('');
        }
        else{
            endDateObj.setISO8601(endDtTm);
            formatTooltip = ['<div class="dialysis-tooltip"><b>',tooltipStartDt,'</b>: '+startDateObj.format(dateFormatLong)+'<br>','<b>',tooltipEndDt,'</b>: '+endDateObj.format(dateFormatLong)+'<br>','<b>',tooltipUF,'</b>: '+ufOut+'</div>'].join('');
        }
        
        //Get the number of days between the start and end date.
        daysDiff = this.getDaysBetweenDates(startDateObj, endDateObj);
        
        //If the dialysis session started and ended on the same day.
        if(daysDiff === 0){
            //We need to be sure not to plot a line when it's above the limit seventh day. The date variable was set above when calculating the seven days.                    
            if(startDateObj<date){
                continue;
            }             
            endDate = endDateObj.format(dateFormat3);
            endTime = endDateObj.format(timeFormat);
            
            //Display a line in between with markers at either ends.
            graphData.push([[startTime,startDate],[endTime, endDate]]);
            graphSeries.push(this.formatSeries(false, true, {style:""}, {show:false}, "#3299CC",false));
            
            //Display the start point (right facing triangle) for the dialysis
            //Add the data that needs to be shown as the label (face up)            
            graphData.push([[startTime,startDate]]);
            graphSeries.push(this.formatSeries(true, true, {style:"filledTriangleRight",shadow:false}, {show:false}, "#3299CC",true,{formatString:formatTooltip}));
            
            if (endDtTm !== "CURRENT"){
               //Display the stop  (left facing triangle) for the dialysis.
                graphData.push([[endTime, endDate]]);
                graphSeries.push(this.formatSeries(true, true, {style:"filledTriangleLeft",shadow:false}, {labels:[ufOut],show:true,location:'n',ypadding:0}, "#3299CC",true,{formatString:formatTooltip}));
            } 
        }
        //Otherwise the dialysis session spanned more than one day.
        else{
            //For each day between the start and end date, we will have the three cases below.
            for(daysCnt=0; daysCnt<=daysDiff; daysCnt++){
                //If this is the last day of the dialysis, we want our start time to be midnight of the end date and the end time should be the actual endtime provided by CCL.
                if(daysCnt === 0){
                    //We need to be sure not to plot a line when it's above the limit seventh day. The date variable was set above when calculating the seven days.
                    if(endDateObj<date){
                        continue;
                    }
                    endDate = endDateObj.format(dateFormat3);
                    endTime = endDateObj.format(timeFormat);
                    
                    //Display a line on the last day of the dialysis between the time is ended, and midnight of the same day.
                    graphData.push([[endTime,endDate],[minStartTime,endDate]]);
                    graphSeries.push(this.formatSeries(false, true, {style:""}, {show:false}, "#3299CC",false));
                    
                    //If the dialysis is still in progress, we do not want to show a marker on the last line. We skip the rest of the code.
                    if(endDtTm !== "CURRENT"){                    
                        graphData.push([[endTime, endDate]]);
                        graphSeries.push(this.formatSeries(true, true, {style:"filledTriangleLeft",shadow:false}, {labels:[ufOut],show:true,location:'n',ypadding:0},"#3299CC",true,{formatString:formatTooltip}));          
                    }
                }
                //If this is the start day (series)     
                else if(daysCnt === daysDiff){                   
                    //We need to be sure not to plot a line when it's above the limit seventh day. The date variable was set above when calculating the seven days.                    
                    if(startDateObj<date){
                        continue;
                    }                    
                    //Our start point would be on the time and date the dialysis started, the end points would be 23:59:59 of when the dialysis started 
                    //since it spans more than one day.
                    graphData.push([[startTime, startDate],[maxEndTime, startDate]]);                        
                    graphSeries.push(this.formatSeries(false, true, {style:""}, {show:false}, "#3299CC",false));
                    
                    //Create a right facing triangle indicating that the dialysis started. Set up all data for formatting the tooltip.
                    graphData.push([[startTime, startDate]]);
                    graphSeries.push(this.formatSeries(true,false,{style:"filledTriangleRight",shadow:false},{labels:[],show:false},"#3299CC",true,{formatString:formatTooltip}));                       
                }
                //If there are days between the start and end date, we plot lines from 00:00:00 to 23:59:50 for each day in between
                else{
                    startDatePlusOne.setYear(startDateObj.getFullYear());
                    startDatePlusOne.setMonth(startDateObj.getMonth());
                    startDatePlusOne.setDate(startDateObj.getDate() + daysCnt);
                    
                    //If this is a day in between the start and end date, we want to plot a line without markers (dots) between 00:00:00 and 23:59:59.
                    graphData.push([[minStartTime, startDatePlusOne.format(dateFormat3)],[maxEndTime, startDatePlusOne.format(dateFormat3)]]);
                    graphSeries.push(this.formatSeries(false, true, {style:""}, {show:false}, "#3299CC",false));
                }
            }
        }        
    }
    
    //Get all array for the WEIGHT object 
    for(i=0; i<weightArrLen; i++){
        if(weightArrLen ===0) {
            break;
        }
        eventName = weightArr[i].WEIGHT_DESC;
        eventResult = weightArr[i].WEIGHT;
        eventUnit = weightArr[i].WEIGHT_UNIT;
        //All startDtTm and endDtTm variables have been declared above.
        startDtTm = weightArr[i].WEIGHT_DT_TM;
        startDateObj.setISO8601(startDtTm);
        startDate = startDateObj.format(dateFormat3);
        startTime = startDateObj.format(timeFormat);
        //Do not plot when the result date is beyond or above the seven day limit.
        if(startDateObj<date){
            continue; 
        }        
        graphData.push([[startTime, startDate]]);
        graphSeries.push(this.formatSeries(true, false, {style:"filledSquare",shadow:false}, {show:true,labels:[eventResult+' '+eventUnit],location:'n',xpadding:100,ypadding:0}, "#61B329",true,{formatString:'<div class="dialysis-tooltip"><b>'+weightMeasu+': </b>'+eventResult+' '+eventUnit+'&nbsp;&nbsp;'+startDateObj.format(dateFormat2)+' '+startDateObj.format(timeFormat)+'</div>'}));
    }
    
    //Get all array for the EXCEPTION object 
    for(i=0; i<expArrLen; i++){
        if(expArrLen === 0){
            break;
        }
        eventName = expArr[i].EXCPT_EVENT;
        eventResult = expArr[i].EXCPT_RESULT;
        eventUnit = expArr[i].EXCPT_RESULT_UNIT;        
        startDtTm = expArr[i].EXCPT_DT_TM; 
        //All startDtTm and endDtTm variables have been declared above.
        startDateObj.setISO8601(startDtTm);
        
        //Do not plot when the result date is beyond or above the seven day limit.
        if(startDateObj<date){
            continue;
        } 
        startDate = startDateObj.format(dateFormat3);
        startTime = startDateObj.format(timeFormat);
        
        if(eventName === "START"){
            graphSeries.push(this.formatSeries(true, false, {style:"filledTriangleRight",shadow:false},{labels:[eventResult+' '+eventUnit],show:true,ypadding:0},"#3299CC",true,{formatString:'<div class="dialysis-tooltip"><b>'+tooltipStartDt+':</b> '+startDateObj.format(dateFormat2)+'  '+startDateObj.format(timeFormat)+'<br><b>'+tooltipUF+': </b>'+eventResult+' '+eventUnit+'</div>'}));
        }
        else if(eventName === "STOP"){
            graphSeries.push(this.formatSeries(true, false, {style:"filledTriangleLeft",shadow:false}, {labels:[eventResult+' '+eventUnit],show:true,ypadding:0},"#3299CC",true,{formatString:'<div class="dialysis-tooltip"><b>'+tooltipEndDt+':</b> '+startDateObj.format(dateFormat2)+'  '+startDateObj.format(timeFormat)+'<br><b>'+tooltipUF+': </b>'+eventResult+' '+eventUnit+'</div>'}));
        }
        else{
            graphSeries.push(this.formatSeries(true, false, {style:"filledStar",shadow:false}, {labels:[eventResult+' '+eventUnit],show:true,location:'n',xpadding:10,ypadding:0},"#A68064",true,{formatString:'<div class="dialysis-tooltip"><b>'+tooltipUF+': </b>'+eventResult+' '+eventUnit+'&nbsp;&nbsp;'+startDateObj.format(dateFormat2)+' '+startDateObj.format(timeFormat)+'</div>'}));
        }  
        graphData.push([[startTime, startDate]]);
    }
};

/**
 * @method This method will populate an array containing all the styling options for the series.
 * @param {boolean} showMarkerBool - Whether to show the markers on the series or not.
 * @param {boolean} showLineBool - Whether to show the series line or not.
 * @param {object}  markerOptionObj - ow the ffffThe styling options for the marker.
 * @param {object}  pointLabelObj - The styling options for the point labels.
 * @param {string}  colorString - A string representing the color of the line for the series.
 * @param {boolean}    showHighLight - A bool for whether to the tooltip or not.
 * @param {object}  highLighter - Styling options for the tooltip.
 * @param {object}  ptLabels - The options for the point label.
 * @return {array} An array containing all the styling options for the series.
 */
DialysisComponentWF.prototype.formatSeries = function(showMarkerBool,showLineBool,markerOptionObj,pointLabelObj,colorString,showHighLight,highLighter,ptLabels){
    var series = {};
    
    highLighter = highLighter || "";
    
    series.showMarker = showMarkerBool;
    series.showLine = showLineBool;
    series.markerOptions = markerOptionObj;
    series.pointLabels = pointLabelObj;
    series.color = colorString;
    series.highlighter = highLighter;
    series.showHighlight = showHighLight;
    series.shadow = false;
    series.shadowAngle = 0;
    series.shadowOffset = 0;
    series.shadowDepth = 0;
 
    return series;
};

/**
 * @method This method will create the graph using the jqplot API and populate it with the necessary data.
 * @return {null}
 */
DialysisComponentWF.prototype.plotGraph = function () {
    var graphData = this.getGraphData();
    var graphSeries = this.getGraphSeries();
    var weekDays = 7;
    var plot = this.getPlot();
    var componentId = this.getComponentId();
    var graphDiv = componentId + "dialysisGraphContainer";
    
    //Below we need to take the position of the tooltip into account. If the point is near the width (x position) of the graph, the tooltip is hidden underneath 
    //the div of the graph.
    $("#"+componentId+"dialysisGraphContainer").bind("jqplotMouseMove", function (ev, gridpos, datapos, neighbor, plot) {
        var x = gridpos.x;
        var y = gridpos.y;
        var plotWidth = plot._width;
        var limitWidth = plotWidth - x;
        var $tooltip = $("#"+graphDiv+" .jqplot-highlighter-tooltip");
        
        //The max-width of the tooltip was set to 180. If the distance between the point we hovered over and the width of the graph is less than the max width
        //of the tooltip, we will move the tooltip to the left so that it is visible.
        if(limitWidth<200){
            $($tooltip).addClass("dialysis-tooltip-left");
        }
        else{
            $($tooltip).removeClass("dialysis-tooltip-left");
        }
        //we need to make sure that the tooltip is not hidden when it's over the allowed height of the div.
        if(y < $($tooltip).height() ){
            $($tooltip).css("top","0px");
        }
    });
            
    plot = $.jqplot(graphDiv, graphData , {
        series: graphSeries,
        axes: {
            xaxis: {
                pad: 1,
                // a factor multiplied by the data range on the axis to give the            
                renderer: $.jqplot.DateAxisRenderer,
                tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
                tickOptions: {
                  angle: -50,
                  formatString: '%R'
                },
                min:"00:00:00",
                max:"23:59:59",
                ticks:["00:00:00", "01:00:00", "02:00:00", "03:00:00", "04:00:00", "05:00:00", "06:00:00", "07:00:00", "08:00:00", "09:00:00", "10:00:00","11:00:00","12:00:00","13:00:00","14:00:00","15:00:00","16:00:00","17:00:00","18:00:00","19:00:00","20:00:00","21:00:00","22:00:00","23:00:00","23:59:59"]
            },
            yaxis: {
                renderer: $.jqplot.CategoryAxisRenderer
            }
        },
        highlighter: {
            sizeAdjust:10,
            tooltipLocation:'ne',
            show:true
        },
        cursor: {
            show: false
        }
    });
    
    this.setPlot(plot);
};


/**
 * @method This method will replot the graph when the window size changes. This is necessary otherwise when making the window smaller, hidden part of the graph get cut out.
 * @return {null}
 */
DialysisComponentWF.prototype.resizeComponent = function () {
    var plot = this.getPlot();
    if(plot){
        plot.replot();	
    }   
};
