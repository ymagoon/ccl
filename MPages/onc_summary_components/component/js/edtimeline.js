function TimelineComponentStyle(){
    this.initByNamespace("tl");
}

TimelineComponentStyle.inherits(ComponentStyle);


/**
 * The Timline component gives a summary of a patients stay since checkin to the
 * emergency department
 *
 * @param {Criterion} criterion
 */
function TimelineComponent(criterion){
	this.setScope(1);
    this.setCriterion(criterion);
    this.setStyles(new TimelineComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.ED_TIMELINE.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.ED_TIMELINE.O1 - render component");
    this.m_LabRadsCds = null;
    this.m_DocCds = null;
    this.m_ActivityListExpanded = false;
    this.m_TotalTableDivisions = 0;
    this.m_EventCellWidth = 0;
    this.m_ArrivalDt = null;
    this.m_CurDateRounded = null;
    this.m_DateList = [];
    this.m_ActivityList = [];
    this.m_HoverList = [];
    this.m_HTML = [];
    this.m_etlArray = [];
	this.m_losHours = 0;
	this.m_hourSections = 0;
    
    TimelineComponent.method("InsertData", function(){
        CERN_TIMELINE_O1.GetTimelineTable(this);
    });
    TimelineComponent.method("HandleSuccess", function(recordData){
        CERN_TIMELINE_O1.RenderComponent(this, recordData);
    });
    TimelineComponent.method("setLabRadCatalogTypes", function(value){
        this.m_LabRadCds = value;
    });
    TimelineComponent.method("getLabRadCatalogTypes", function(){
        return (this.m_LabRadCds);
    });
    TimelineComponent.method("addLabRadCatalogTypes", function(value){
        if (!this.m_LabRadCds){ 
            this.m_LabCds = [];
        }
        this.m_LabCds.push(value);
    });
    TimelineComponent.method("setDocCatalogCds", function(value){
        this.m_DocCds = value;
    });
    TimelineComponent.method("getDocCatalogCds", function(){
        return (this.m_DocCds);
    });
    TimelineComponent.method("addDocCatalogCds", function(value){
        if (!this.m_DocCds){ 
            this.m_DocCds = [];
        }
        this.m_DocCds.push(value);
    });
    TimelineComponent.method("isActivityListExpanded", function(){
       return(this.m_ActivityListExpanded);
    });
    TimelineComponent.method("setActivityListExpanded", function(value){
       this.m_ActivityListExpanded = value;
    });
    TimelineComponent.method("getTotalTableDivisions", function(){
       return(this.m_TotalTableDivisions);
    });
    TimelineComponent.method("setTotalTableDivisions", function(value){
       this.m_TotalTableDivisions = value;
    });
    TimelineComponent.method("getEventCellWidth", function(){
       return(this.m_EventCellWidth);
    });
    TimelineComponent.method("setEventCellWidth", function(value){
       this.m_EventCellWidth = value;
    });
    TimelineComponent.method("getArrivalDt", function(){
       return(this.m_ArrivalDt);
    });
    TimelineComponent.method("setArrivalDt", function(value){
       this.m_ArrivalDt = value;
    });
    TimelineComponent.method("getActivityList", function(){
       return(this.m_ActivityList);
    });
    TimelineComponent.method("getNumOfActivities", function(){
       return(this.m_ActivityList.length);
    });   
    TimelineComponent.method("addActivityListItem", function(value){
       this.m_ActivityList.push(value);
    });
    TimelineComponent.method("getHoverList", function(){
       return(this.m_HoverList);
    });
    TimelineComponent.method("addHoverListItem", function(value){
       this.m_HoverList.push(value);
    });
    TimelineComponent.method("setHoverListItem", function(index, value){
       this.m_HoverList[index].push(value);
    });
    TimelineComponent.method("getDateList", function(){
       return(this.m_DateList);
    });
    TimelineComponent.method("setDateList", function(value){
       this.m_DateList = value;
    });
    TimelineComponent.method("getCurDateRounded", function(){
       return(this.m_CurDateRounded);
    });
    TimelineComponent.method("setCurDateRounded", function(value){
       this.m_CurDateRounded = value;
    });
    
    TimelineComponent.method("setEtlArray", function(value){
       this.m_etlArray = value;
    });
    TimelineComponent.method("getEtlArray", function(value){
       return (this.m_etlArray);
    });
    TimelineComponent.method("setLosHours", function(value){
       this.m_losHours = value;
    });
    TimelineComponent.method("getLosHours", function(value){
       return (this.m_losHours);
    });
    TimelineComponent.method("setHourSections", function(value){
       this.m_hourSections = value;
    });
    TimelineComponent.method("getHourSections", function(value){
       return (this.m_hourSections);
    });    
    
}

TimelineComponent.inherits(MPageComponent);

/**
 * ED Timeline methods
 * @static
 * @global
 */
var CERN_TIMELINE_O1 = function(){
    //Divy width of timeline
    var minutesPerSection = 15;
    var divisionsPerSection = 3;
    
	//CCL Script Name Calls
	var medsOrderProgram = "mp_get_orders";
	var medsAdminProgram = "mp_get_med_admins";
	var labsOrderProgram = "mp_ed_get_lab";
	var labsResultProgram = "mp_get_results_by_order";
	var ordersProgram = "mp_get_ed_orders";
	var documentsProgram = "mp_retrieve_documents_json_dp";
	var eventsProgram = "mp_get_tracking_events";
			         
    return {
        GetTimelineTable: function(component){
        	MP_Util.Doc.ReplaceSubTitleText(component , "");
            var groups = component.getGroups();
            var events = (groups && groups.length > 0) ? groups[0].getEventSets() : null;
            var docCds = events ? "value(" + events.join(",") + ")" : "0.0";
            var sendAr = [];
            var criterion = component.getCriterion();
            sendAr.push("^MINE^", criterion.encntr_id + ".0");
            MP_Core.XMLCclRequestWrapper(component, "mp_get_ed_encounter", sendAr, true);
        },
        RenderComponent: function(component, recordData){
            
            var edtimelinei18n = i18n.discernabu.edtimeline_o1;
            try {
            	var dtArray = [];
            	var minuteDivisions = 0;
				var secondsRemaining = 0;
				var totalTableDivisons = 0;
				var eventCellWidth = 0;
				var arrivalDt;
				var componentId = component.getComponentId();
                var groups = component.getGroups();
                var docCds = (groups && groups.length > 0) ? groups[0].getEventSets() : null;
                var orderCds = component.getDocCatalogCds();
                var labRadCds = component.getLabRadCatalogTypes();
                
                var docCdsSendStr = docCds ? "value(" + docCds.join(",") + ")" : "0.0";
                var orderCdsSendStr = orderCds  ? "value(" + orderCds.join(",") + ")" : "0.0";
                var labRadCdsSendStr = labRadCds  ? "value(" + labRadCds.join(",") + ")" : "0.0";
                var edtlData = recordData;
                var etlArray =[];
                var losHours = 0;
                var hourSections = 0;
                var mgr = new MP_Core.XMLCCLRequestThreadManager(CERN_TIMELINE_O1.RenderReply, component, false);
                var criterion = component.getCriterion();
    		    var request = null;
			    var thread = null;    
                
                if (edtlData.ARRIVAL_DT_TM) {
                    arrivalDt = new Date();
					arrivalDt.setISO8601(edtlData.ARRIVAL_DT_TM);
                }
                else {
                    arrivalDt = new Date();
					arrivalDt.setISO8601(edtlData.REG_DT_TM);
                }
                component.setArrivalDt(arrivalDt);
                
                var arrivalDtTm = arrivalDt.format("longDateTime3");
                var losInfo = getLos(edtlData);
                var los = losInfo[0];
                losHours = losInfo[1];
                component.setLosHours(losHours);
                var etlhtml = "";
                
                //Width of tables
                var setWidth = getWidth();
                var tabWidth = setWidth.width;
                var incol1Width = Math.round(tabWidth * 0.072);
                
                //Determine how many hours to display on the timeline default is 3
                var notificationText = edtimelinei18n.RESULTS_SINCE_ADMITTED;
                var hoursToDisplay = 3;
                var intLosHours = parseInt(losHours, 10);
                
                if ((intLosHours <= 24) && (intLosHours > 3)) {
                    hoursToDisplay = intLosHours;
                }
                else if (intLosHours > 24) {
                    hoursToDisplay = 24;
                    notificationText = edtimelinei18n.FIRST_24HRS_VISIT;
                }
                //Change the subtext text to display what was cut out of the header below
                MP_Util.Doc.ReplaceSubTitleText(component , notificationText);
                //Determine how may cells to create
                hourSections = (hoursToDisplay * 60) / minutesPerSection;
                if (hoursToDisplay < 24) {
                    hourSections++;
                }
                component.setHourSections(hourSections);
                minuteDivisions = Math.floor(minutesPerSection / divisionsPerSection);
                secondsRemaining = ((minutesPerSection / divisionsPerSection) * 60) % 60;
                totalTableDivisions = hourSections * divisionsPerSection;
                component.setTotalTableDivisions(totalTableDivisions);
                eventCellWidth = Math.round(incol1Width / divisionsPerSection);
                component.setEventCellWidth(eventCellWidth);
                
                var currentDt = new Date();
                currentDt.setDate(currentDt.getDate());
                
                var curDate = roundDate(currentDt, 1);
                var currentDt2 = new Date(currentDt);
                
                roundTime(currentDt2, minuteDivisions);
                var curDateRounded = currentDt2.getTime();
                component.setCurDateRounded(curDateRounded);
                var intervalDt = new Date(arrivalDt);
                var admissionDt = new Date(currentDt);
                
                admissionDt.setHours(admissionDt.getHours() - 1);
                
                var timelineStDt = new Date(admissionDt);
                roundTime(timelineStDt, 15);
                
                var d1 = new Date(arrivalDt);
                roundTime(d1, 15);
                
                for (var dt = 0; dt < (totalTableDivisions + 1); dt++) {
                    dtArray[dt] = d1.getTime();
                    d1.setMinutes(d1.getMinutes() + minuteDivisions);
                    d1.setSeconds(d1.getSeconds() + secondsRemaining);
                }
                component.setDateList(dtArray);
                
                //Header line
                etlArray.push("<div class='clearfix'>","<div class='tl-row-labels' ><table id='tlTimelineRowNames", componentId,"' >", "<tr><td class='tl-spacer'>&nbsp;</td></tr><tr><td class='tl-spacer'>&nbsp;</td></tr>" 
                ,"<tr><td class='tl-row-label'><span class='tl-row-label-display' title='", edtimelinei18n.MEDICATIONS,"'>", edtimelinei18n.MEDICATIONS, "</span></td></tr><tr><td class='tl-row-label'>&nbsp</td></tr><tr><td class='tl-row-label'><span class='tl-row-label-display' title='", edtimelinei18n.LABRAD,"'>", edtimelinei18n.LABRAD,"</span></td></tr>", "<tr><td class='tl-row-label'>&nbsp;</td></tr>", "<tr><td class='tl-row-label'><span class='tl-row-label-display' title='", edtimelinei18n.ORDERS, "'>", edtimelinei18n.ORDERS, "</span></td></tr>", "<tr><td class='tl-row-label'><span class='tl-row-label-display' title='", edtimelinei18n.DOCUMENTS, "'>", edtimelinei18n.DOCUMENTS, "</span></td></tr>", "<tr><td class='tl-row-label'><span class='tl-row-label-display' title='", edtimelinei18n.EVENTS, "'>", edtimelinei18n.EVENTS, "</span></td></tr>"
                ,"</table>", "<div id='tlLegendExpDiv", componentId,"' class='tl-legend-exp'><a id='tlLegendExpCol", componentId,"' class='tl-time-val' href='#' onClick='CERN_TIMELINE_O1.ExpandCollapseLegend(", componentId, "); return false;'><span class='legend-collapsed'>&nbsp;</span> ", edtimelinei18n.SHOW_LEGEND, "</a></div></div>"
                ,"<div id='tlHeaderContainer", componentId, "' class='tl-header-div'><div class='tl-los-hd' ><span class='tl-label' >", edtimelinei18n.ARRIVAL, ":</span> ", arrivalDtTm, "</div><div class='tl-los' ><span class='tl-label'> ", edtimelinei18n.LENGTH_OF_STAY, ":</span> ", los, "</div><div id='tlActvListExpCell", componentId,"' class='tl-actvlst-inactiv'>", "<div id='tlActvListHeaderIn", componentId,"' class='tl-actv-list-hd-in'><a onClick=\"CERN_TIMELINE_O1.ExpandCollapseActivityList(null, ", componentId, "); return false;\" id='tlExpCollapseActv", componentId,"'  href='#' class='tl-toggle-exp tl-collapse'>&nbsp;&nbsp;&nbsp;&nbsp;</a><span class='tl-actv-list-txt tl-text-val' id='tlActvListTxt", componentId,"'>", edtimelinei18n.ACTIVITY_LIST, "</span></div>", "<div class='tl-actv-list-cap-dbl'>&nbsp</div></div></div>"
                ,"<div id='tlFullContainer", componentId,"' class='tl-full-container'><div id='tlScrollContainer", componentId,"' class='tl-scroll-cont'><div id='tlTimelineScroll", componentId,"' class='tl-scroll' ><table ><tr><td><table class='tl-tabel'>","</><table class='tl-table'><tr>");
                
                //This area will display the current time
                var currentTimeFound = 0;
                var firstCellWidth = 0;
                var i = 0;
                for (i = 0; i < (totalTableDivisions); i++) {
                    if ((dtArray[i] <= parseInt(curDateRounded, 10)) && (parseInt(curDateRounded,10) < dtArray[i + 1]) && (currentTimeFound === 0)) {
                        firstCellWidth = eventCellWidth * (i);
                        currentTimeFound = 1;
                        curDateRounded = dtArray[i];
                    }
                }
                if (currentTimeFound == 1) {
                    var secondCellWidth = (totalTableDivisions * eventCellWidth) - firstCellWidth;
                    var firstMinusWidth = Math.round(incol1Width - (incol1Width * 0.9));
                    var secondMinusWidth = Math.round(incol1Width - (incol1Width * 0.1));
                    firstCellWidth = firstCellWidth > 0 ? firstCellWidth - firstMinusWidth : 0;
                    secondCellWidth = secondCellWidth - secondMinusWidth;
                    secondCellWidth = secondCellWidth > 0 ? secondCellWidth : 0;
                    etlArray.push("<td style='width:", firstCellWidth, "px' ><span class='tl-text-val'> &nbsp;</span></td>", "<td style='width:", incol1Width, "px' class='tl-dispcurdt'><span class='tl-num-val'>&nbsp;", curDate, "</span></td>", "<td style='width:", secondCellWidth, "px' ><span class='tl-text-val'> &nbsp;</span></td>");
                }
                else {
                    etlArray.push("<td style='width:", eventCellWidth * totalTableDivisions, "px' ><span class='tl-text-val'> &nbsp;</span></td>");
                }
                
                //This is the area that displays the time sections
                etlArray.push("</tr></table></td></tr><tr><td><table class='tl-table'><tr>");
                for (i = 0; i < (hourSections); i++) {
                    var timeInterval = roundDate(intervalDt, minutesPerSection);
                    var minutes = intervalDt.getMinutes();
                    minutes += 15;
                    intervalDt.setMinutes(minutes);
                    var timeIntervalNext = roundDate(intervalDt, minutesPerSection);
                    etlArray.push("<td  class='tl-disp-section tl-time-intervals'><dl class='tl-info'><dt>Time:</dt><dd class='tl-time-val'> &nbsp;", timeInterval, "</dd></dl>", "<h4 class='tl-hvr-hd'><span>15 Min Details</span></h4><div class='hvr'  >", timeInterval, " - ", timeIntervalNext, "<br><div class='tl-time-hvr-contents' id='tl15MinHover" + i + componentId+ "'>", edtimelinei18n.NO_RESULTS, "</div></div></td>");
                    //Increase Interval
                    //timeSectionHoverArray.push([]);
                    component.addHoverListItem([]);
                }
                
                var lookBackHrs = Math.ceil((currentDt2.getTime() - arrivalDt.getTime()) / (1000 * 60 * 60)) + 1;
                
                //Medications 1
                var sendAr = [];
                sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", lookBackHrs, "257", "1", "0", "1", "2", "0", "0", "0", "1");
                //passing order status & scope with  default values and pprcd 
                sendAr.push("0,0", criterion.ppr_cd + ".0");
				request = new MP_Core.ScriptRequest(component, "ENG:MPG.ED-TIMELINE.O1 - Med Orders");
				request.setProgramName(medsOrderProgram);
				request.setParameters(sendAr);
				request.setAsync(true);
				thread = new MP_Core.XMLCCLRequestThread("GetMedOrd", component, request);
				mgr.addThread(thread);
                
                //Medications 2
                sendAr = [];
                sendAr.push("^MINE^", criterion.person_id + ".0", "value(" + criterion.encntr_id + ".0)", criterion.provider_id + ".0", lookBackHrs, criterion.position_cd + ".0", criterion.ppr_cd + ".0", "1");
				request = new MP_Core.ScriptRequest(component, "ENG:MPG.ED-TIMELINE.O1 - Med Admins");
				request.setProgramName(medsAdminProgram);
				request.setParameters(sendAr);
				request.setAsync(true);
				thread = new MP_Core.XMLCCLRequestThread("GetMedAdm", component, request);
				mgr.addThread(thread);
                
                //Lab/Radiology 1
                sendAr = [];
                sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", labRadCdsSendStr, lookBackHrs, "1", criterion.provider_id + ".0", criterion.ppr_cd + ".0");	
				request = new MP_Core.ScriptRequest(component, "ENG:MPG.ED-TIMELINE.O1 - Lab Orders");
				request.setProgramName(labsOrderProgram);
				request.setParameters(sendAr);
				request.setAsync(true);
				thread = new MP_Core.XMLCCLRequestThread("GetLabOrd", component, request);
				mgr.addThread(thread);
                
                //LabsResultsRow
                sendAr = [];
                sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", labRadCdsSendStr, "0.0", lookBackHrs, "0.0", criterion.ppr_cd +".0", "1");
				request = new MP_Core.ScriptRequest(component, "ENG:MPG.ED-TIMELINE.O1 - Lab Results");
				request.setProgramName(labsResultProgram);
				request.setParameters(sendAr);
				request.setAsync(true);
				thread = new MP_Core.XMLCCLRequestThread("GetLabResult", component, request);
				mgr.addThread(thread);
                
                //Orders
                sendAr = [];
                sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", orderCdsSendStr, lookBackHrs, "1", criterion.provider_id + ".0", criterion.ppr_cd + ".0");
				request = new MP_Core.ScriptRequest(component, "ENG:MPG.ED-TIMELINE.O1 - Other Orders");
				request.setProgramName(ordersProgram);
				request.setParameters(sendAr);
				request.setAsync(true);
				thread = new MP_Core.XMLCCLRequestThread("GetOrd", component, request);
				mgr.addThread(thread);
                
                
                //Assesments
                sendAr = [];
				sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", lookBackHrs, docCdsSendStr, "0.00",criterion.ppr_cd + ".0", "1");
				request = new MP_Core.ScriptRequest(component, "ENG:MPG.ED-TIMELINE.O1 - Documents");
				request.setProgramName(documentsProgram);
				request.setParameters(sendAr);
				request.setAsync(true);
				thread = new MP_Core.XMLCCLRequestThread("GetDoc", component, request);
				mgr.addThread(thread);
                
                //Events
                sendAr = [];
                sendAr.push("^MINE^", criterion.encntr_id + ".0", lookBackHrs, "1");
				request = new MP_Core.ScriptRequest(component, "ENG:MPG.ED-TIMELINE.O1 - Tracking Events");
				request.setProgramName(eventsProgram);
				request.setParameters(sendAr);
				request.setAsync(true);
				thread = new MP_Core.XMLCCLRequestThread("GetEvent", component, request);
				mgr.addThread(thread);
                
                component.setEtlArray(etlArray);
                mgr.begin();
                
            } 
            catch (err) {
                
                throw (err);
            }
            finally {
                //do nothing
            }
            
        },
        
         RenderReply : function(replyAr, component) {
			var edtimelinei18n = i18n.discernabu.edtimeline_o1;
            var criterion = component.getCriterion();
            var hourSec = component.getHourSections();
            var elArr = component.getEtlArray();
            var losHrs = component.getLosHours();
            var medOrd_recordData;
            var medAdm_recordData;
            var labOrd_recordData;
            var labRes_recordData;
            var ord_recordData;
            var doc_recordData;
            var event_recordData;
            
            var componentId = component.getComponentId();
            //Width of tables
            var setWidth = getWidth();
            var tabWidth = setWidth.width;
            var incol1Width = Math.round(tabWidth * 0.072);

				for(var x = replyAr.length; x--; ) {
					var reply = replyAr[x];
					if(reply.getStatus() == "S") {
						switch (reply.getName()) {
							case "GetMedOrd":
							medOrd_recordData = reply.getResponse();
							break;
							case "GetMedAdm":
							medAdm_recordData = reply.getResponse();
							break;
							case "GetLabOrd":
							labOrd_recordData = reply.getResponse();							
							break;
							case "GetLabResult":
							labRes_recordData = reply.getResponse();
							break;
							case "GetOrd":
    						ord_recordData = reply.getResponse();
							break;
							case "GetDoc":
							doc_recordData = reply.getResponse();
							break;
							case "GetEvent":
							event_recordData = reply.getResponse();
							break;
						}
					} else{
					
                            switch (reply.getName()) {
							case "GetMedOrd":
							medOrd_recordData = -1;
							case "GetMedAdm":
							medAdm_recordData = -1;
							break;
							case "GetLabOrd":
							labOrd_recordData = -1;
							break;
							case "GetLabResult":
							labRes_recordData = -1;							
							break;
							case "GetOrd":
							ord_recordData = -1;
							break;
							case "GetDoc":
							doc_recordData = -1;							
							break;
							case "GetEvent":
							event_recordData = -1;
							break;
							}
					}
				}				
				
				buildMedsOrderRow(medOrd_recordData, component, elArr);
				buildMedsAdminRow(medAdm_recordData, component, elArr);
				buildLabsOrderRow(labOrd_recordData, component, elArr);
				buildLabsResultsRow(labRes_recordData, component, elArr);
				buildOrdersRow(ord_recordData, component, elArr);
				buildDocumentsRow(doc_recordData, component, elArr);
				buildEventsRow(event_recordData, component, elArr);
				
                //Spacing
                elArr.push("</table></div>", "<div id='tlTimelineLegend", componentId,"' class='tl-legend hidden'  ><table class='legend-table' ><tr>", "<td class='tl-legend-label' >", edtimelinei18n.INCOMPLETE_ORDERS, ":<span class='legend-ordered-nf'>&nbsp;</span><span class='legend-ordered-mnf'>&nbsp;</span></td>", "<td class='tl-legend-label'  >", edtimelinei18n.RESULTS_RETURNED, ":<span class='legend-admin'>&nbsp;</span><span class='legend-madmin'>&nbsp</span> </td>", "<td class='tl-legend-label'  > ", edtimelinei18n.CRITICAL_RESULTS, ": <span class='legend-crit'>&nbsp;</span></td></tr>", "<tr><td class='tl-legend-label'  >", edtimelinei18n.COMPLETE_ORDERS, ": <span class='legend-ordered-f'>&nbsp;</span><span class='legend-ordered-mf'>&nbsp;</span></td>", "<td class='tl-legend-label' > ", edtimelinei18n.MEDS_ADMINISTERED, ": <span class='legend-admin'>&nbsp;</span><span class='legend-madmin'>&nbsp;</span></td>", "<td class='tl-legend-label'  ><span class='filler'>&nbsp;</span></td></tr>", "</table></div></td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr>", "</table></div>");
                
                //Make the activity list
                createActivityList(componentId, component.getActivityList(),elArr);
                elArr.push("</div></div>");
                etlhtml = elArr.join("");
                MP_Util.Doc.FinalizeComponent(etlhtml, component, "");
                //Fill in 15 minute hovers
                fillSectionHovers(hourSec, component.getHoverList(), componentId);
                if (losHrs > 3){ 
                    scrollTimeline("MAX", false, componentId);
                }
    
    },   
        
        SelectActivity: function(actvId, componentId){
        	
        	var component = MP_Util.GetCompObjById(componentId);
            //Remove the Selected class
            var setWidth = getWidth();
            var tabWidth = setWidth.width;
            var col1Width = Math.round(tabWidth * 0.1);
            var numOfActivities = component.getNumOfActivities();
            var i = 0;
            var critical;
            var actvList = _g('tlActvList' + componentId);
            for (i = 0; i < numOfActivities; i++) {
                var activityRow = _g(("tlActivityRow" + i) + componentId);
                critical = _g(("tlCritical" + i) + componentId);
                if (Util.Style.ccss(activityRow, 'tl-selected')) {
                    Util.Style.rcss(activityRow, 'tl-selected');
                    activityRow.style.color = "#000";
                }
                if ((activityRow.rel % 2) === 0) {
                    Util.Style.acss(activityRow, 'tl-even');
                }
                if (critical) {
                    critical.style.color = "#FF0000";
                }
            }
            
            if (!component.isActivityListExpanded()) {
                var tempX = 0;
                var tempY = 0;
                
                if (ieVersion > 0) {
                    tempX = event.clientX + document.body.scrollLeft;
                    tempY = event.clientY + document.body.scrollTop;
                }
                else {
                    tempX = e.pageX;
                    tempY = e.pageY;
                }
                tempX = tempX - (col1Width * 0.7);
                var clickPercent = tempX / parseInt(_g('tlTimelineScroll' + componentId).offsetWidth, 10);
                if (clickPercent < 0.45) {
                    clickPercent = 0;
                }
                
                CERN_TIMELINE_O1.ExpandCollapseActivityList(clickPercent, componentId);
            }
            
            var approxWidthPerRow = Math.round(actvList.scrollHeight / numOfActivities);
            var actvIds = actvId.split("-");
            for (i = 0; i < actvIds.length; i++) {
                var selected = _g(("tlActivityRow" + actvIds[i]) + componentId);
                critical = _g(("tlCritical" + actvIds[i])+ componentId);
                if (critical) {
                    critical.style.color = "#FFF";
                }
                Util.Style.rcss(selected, 'tl-odd');
                Util.Style.rcss(selected, 'tl-even');
                Util.Style.acss(selected, 'tl-selected');
                selected.style.color = "#FFF";
                scrollLoc = approxWidthPerRow * (parseInt(selected.rel, 10) + 1) - 80; //+1 accounts for header row - 80 will place selection close to middle
                if (scrollLoc < 0) {
                    scrollLoc = 0;
                }
                actvList.scrollTop = scrollLoc;
            }
            return false;
        },
        
        ExpandCollapseActivityList: function(clickPercent, componentId){
        	
        	var component = MP_Util.GetCompObjById(componentId);
        	
            component.setActivityListExpanded(!component.isActivityListExpanded());
            var scrollContainer = _g('tlScrollContainer'+ componentId);
            var actvList = _g('tlActvList'+ componentId);
            var expCollapseAct = _g('tlExpCollapseActv'+ componentId);
            var toggleExp1 = _g('tlActvListTxt'+ componentId);
            var actvListExpCol = _g('tlActvListExpCell'+ componentId);
            var actvListHeader = _g('tlActvListHeaderIn'+ componentId);
            var tlHeaderContainer = _g('tlHeaderContainer'+ componentId);
            
            if (component.isActivityListExpanded()) {
                scrollContainer.style.width = "66%";
                scrollContainer.style.display = "inline-block";
                tlHeaderContainer.style.display = "inline-block";
            }
            else {
                scrollContainer.style.width = "";
                scrollContainer.style.display = "inline";
                tlHeaderContainer.style.display = "inline";
            }
            
            if (Util.Style.tcss(actvList, 'hidden')) {
                Util.Style.rcss(expCollapseAct, 'tl-expand');
                Util.Style.acss(expCollapseAct, 'tl-collapse');
                Util.Style.rcss(actvListExpCol, 'tl-actvlst-activ');
                Util.Style.acss(actvListExpCol, 'tl-actvlst-inactiv');
                actvListHeader.style.width = '100px';
                toggleExp1.style.paddingRight = "0px";
                _g('tlActvListExpCell'+ componentId).style.display = "";
                Util.Style.tcss(_g('tlActvListCont'+ componentId), 'hidden');
                
            }
            else {
            
                Util.Style.rcss(expCollapseAct, 'tl-collapse');
                Util.Style.acss(expCollapseAct, 'tl-expand');
                Util.Style.rcss(actvListExpCol, 'tl-actvlst-inactiv');
                Util.Style.acss(actvListExpCol, 'tl-actvlst-activ');
                _g('tlActvListExpCell'+ componentId).style.display = "none";
                Util.Style.tcss(_g('tlActvListCont'+ componentId), 'hidden');
                if (clickPercent) {
                    scrollTimeline((parseInt(_g('tlActvList'+ componentId).offsetWidth, 10) * clickPercent), true, componentId);
                   }
            }
            return false;
            
        },
        
        ExpandCollapseLegend: function(componentId){
        	var edtimelinei18n = i18n.discernabu.edtimeline_o1;
            var legend = _g('tlTimelineLegend'+ componentId);
            var actvList = _g('tlActvList'+ componentId);
            var legendExpColLink = _g('tlLegendExpCol'+ componentId);
            if (Util.Style.tcss(legend, 'hidden')) {
                legendExpColLink.innerHTML = "<span class='legend-collapsed'>&nbsp;</span> " + edtimelinei18n.SHOW_LEGEND;
                actvList.style.height = '160px';
            }
            else {
            
                legendExpColLink.innerHTML = "<span class='legend-expanded'>&nbsp;</span> " + edtimelinei18n.HIDE_LEGEND;
                actvList.style.height = '228px';
            }
        }
        
    };
    
    
    
    function buildMedsOrderRow(medsOrderJson, component, etlArray){
    
        etlArray.push("</tr></table></td></tr><tr><td><table class='tl-table'><tr class='tl-even'>");
        var dtArray = component.getDateList();
        var curDateRounded = component.getCurDateRounded();
        var dateTimeArray = [];
        var medsOrderArraySize = 0;
        var numSkipped = 0;
        var i = 0;
        if (medsOrderJson != -1) {
            medsOrderArraySize = medsOrderJson.ORDERS.length;
            medsOrderJson.ORDERS.sort(sortByDateMeds);
            
        }
        
        for (i = 0; i < medsOrderArraySize; i++) {
            var date1 = new Date();
            date1.setISO8601(medsOrderJson.ORDERS[i].SCHEDULE.ORIG_ORDER_DT_TM);
            if (date1.getTime() >= component.getArrivalDt().getTime()) {
                dateTimeArray.push(date1);
            }
            else {
                numSkipped++;
            }
        }
        
        medsOrderArraySize = dateTimeArray.length;
        var dateCnt = 0;
        var dispMultIcon = false;
        var done = false;
        var activityInCell = false;
        var relString = "";
        var curDateCell = false;
        var classString = "";
        var dispClass = "";
        var status = "";
        var foundOrdered = false;
        var personnelArray = MP_Util.LoadPersonelListJSON(medsOrderJson.PRSNL);
        var codesArray = MP_Util.LoadCodeListJSON(medsOrderJson.CODES);
        var numOfActivities = 0;
        
        for (i = 0; i < (component.getTotalTableDivisions()); i++) {
        	numOfActivities = component.getNumOfActivities();
            classString = "";
            if ((((i + 1) % divisionsPerSection) === 0)) {
                if ((dtArray[i] < curDateRounded)) {
                    classString += " tl-disp-section";
                }
                else if (dtArray[i] > curDateRounded) {
                    classString += " tl-disp-section-future";
                }
            }
            activityInCell = false;
            if ((medsOrderArraySize > 0) && (!done)) {
                if (((parseInt(dtArray[i], 10) <= parseInt(dateTimeArray[dateCnt].getTime(), 10)) && (parseInt(dateTimeArray[dateCnt].getTime(), 10) < parseInt(dtArray[i + 1], 10)))) {
                    activityInCell = true;
                    foundOrdered = false;
                }
            }
            if (dtArray[i] == curDateRounded) {
                curDateCell = true;
            }
            if (activityInCell) {
                var j = 0;
                dispMultIcon = false;
                var singleClass = "";
                var multClass = "";
                do {
                	numOfActivities = component.getNumOfActivities();
                    relString = (j > 0) ? relString + "-" + numOfActivities : numOfActivities;
                    var hoverNumber = Math.floor(i / divisionsPerSection);
                    status = "";
                    dispClass = "";
                    if (medsOrderJson.ORDERS[dateCnt].CORE.STATUS_CD !== 0) {
                        var provCodeObj = MP_Util.GetValueFromArray(medsOrderJson.ORDERS[dateCnt + numSkipped].CORE.STATUS_CD, codesArray);
                        status = provCodeObj.meaning;
                    }
                    if (status == "COMPLETED") {
                        dispClass = "meds-of";
                    }
                    else if (status == "ORDERED") {
                        dispClass = "meds-onf";
                        foundOrdered = true;
                    }
                    var medsOrderEvent = getMedsOrderEventFromJson(medsOrderJson.ORDERS[dateCnt + numSkipped], codesArray);
                    addToActivityListAndHover(component, dateTimeArray[dateCnt], (medsOrderEvent), dispClass, status, hoverNumber);
                    if ((dateCnt + 1) < medsOrderArraySize) {
                        dateCnt++;
                    }
                    else {
                        done = true;
                    }
                    if (curDateCell) {
                        classString += " tl-disp-dt";
                        curDateCell = false;
                    }
                    dispMultIcon = (j > 0) ? true : false;
                    multClass = foundOrdered ? " meds-monf" : " meds-mof";
                    singleClass = foundOrdered ? " meds-onf" : " meds-of";
                    j++;
                }
                while (((parseInt(dtArray[i], 10) <= parseInt(dateTimeArray[dateCnt].getTime(), 10)) && (parseInt(dateTimeArray[dateCnt].getTime(), 10) < parseInt(dtArray[i + 1], 10))) && (!done));
                createDataCell(component, classString, multClass, singleClass, relString, dispMultIcon,null, etlArray);
            }
            else {
                curDateCell = createEmptyCell(component, i, " tl-row-even-future", curDateCell, classString,curDateRounded, etlArray);
            }
        }
    }
    
    function buildMedsAdminRow(medsAdminJson, component, etlArray){
        etlArray.push("</tr><tr class='tl-even'>");
        var dtArray = component.getDateList();
        var curDateRounded = component.getCurDateRounded();
        var dateTimeArray = [];
        var medsAdminArraySize = 0;
        var numSkipped = 0;
        var i = 0;
        if (medsAdminJson != -1) {
            medsAdminArraySize = medsAdminJson.MED_ADMINS_LIST.length;
            medsAdminJson.MED_ADMINS_LIST.sort(sortByDateMedsAdmin);
            
        }
        for (i = 0; i < medsAdminArraySize; i++) {
            var date1 = new Date();
            date1.setISO8601(medsAdminJson.MED_ADMINS_LIST[i].ADMINISTRATION_DATE);
            if (date1.getTime() >= component.getArrivalDt().getTime()) {
                dateTimeArray.push(date1);
            }
            else {
                numSkipped++;
            }
        }
        
        medsAdminArraySize = dateTimeArray.length;
        
        var dateCnt = 0;
        var dispMultIcon = false;
        var done = false;
        var activityInCell = false;
        var relString = "";
        var curDateCell = false;
        var classString = "";
        var display = "";
        var personnelArray = MP_Util.LoadPersonelListJSON(medsAdminJson.PRSNL);
        var codesArray = MP_Util.LoadCodeListJSON(medsAdminJson.CODES);
        var numOfActivities = 0;
        
        for (i = 0; i < (component.getTotalTableDivisions()); i++) {
        	numOfActivities = component.getNumOfActivities();
            classString = "";
            if ((((i + 1) % divisionsPerSection) === 0)) {
                if ((dtArray[i] < curDateRounded)) {
                    classString += " tl-disp-section";
                }
                else if (dtArray[i] > curDateRounded) {
                    classString += " tl-disp-section-future";
                }
            }
            
            activityInCell = false;
            
            if ((medsAdminArraySize > 0) && (!done)) {
                if (((parseInt(dtArray[i], 10) <= parseInt(dateTimeArray[dateCnt].getTime(), 10)) && (parseInt(dateTimeArray[dateCnt].getTime(), 10) < parseInt(dtArray[i + 1], 10)))){ 
                    activityInCell = true;
                   }
            }
            if (dtArray[i] == curDateRounded) {
                curDateCell = true;
            }
            if (activityInCell) {
                if (!done) {
                    relString = numOfActivities;
                    var hoverNumber = Math.floor(i / divisionsPerSection);
                    var medsAdminEvent = getMedsAdminEventFromJson(medsAdminJson.MED_ADMINS_LIST[dateCnt + numSkipped], codesArray);
                    addToActivityListAndHover(component, dateTimeArray[dateCnt], medsAdminEvent, "meds-adm", "ADMINISTERED", hoverNumber);
                    if ((dateCnt + 1) < medsAdminArraySize) {
                        dateCnt++;
                    }
                    else {
                        done = true;
                    }
                    if (curDateCell) {
                        classString += " tl-disp-dt ";
                        curDateCell = false;
                    }
                    while (((parseInt(dtArray[i], 10) <= parseInt(dateTimeArray[dateCnt].getTime(), 10)) && (parseInt(dateTimeArray[dateCnt].getTime(), 10) < parseInt(dtArray[i + 1], 10))) && (!done)) {
                        dispMultIcon = true;
                        numOfActivities = component.getNumOfActivities();
                        relString = relString + "-" + numOfActivities;
                        
                        medsAdminEvent = getMedsAdminEventFromJson(medsAdminJson.MED_ADMINS_LIST[dateCnt + numSkipped], codesArray);
                        addToActivityListAndHover(component, dateTimeArray[dateCnt], medsAdminEvent, "meds-adm", "ADMINISTERED", hoverNumber);
                        
                        if ((dateCnt + 1) < medsAdminArraySize) {
                            dateCnt++;
                        }
                        else {
                            done = true;
                        }
                    }
                    createDataCell(component, classString, " meds-madm", " meds-adm", relString, dispMultIcon,null, etlArray);
                    dispMultIcon = false;
                }
            }
            else {
                curDateCell = createEmptyCell(component, i, " tl-row-even-future", curDateCell, classString, curDateRounded,etlArray);
            }
        }
    }
    
    function buildLabsOrderRow(labsOrderJson, component, etlArray){
        etlArray.push("</tr><tr class='tl-odd'>");
        var dtArray = component.getDateList();
        var curDateRounded = component.getCurDateRounded();
        var dateTimeArray = [];
        var labsArraySize = 0;
        var numSkipped = 0;
        var i = 0;
        if (labsOrderJson != -1) {
            labsArraySize = labsOrderJson.ORDERS.length;
        }
        
        for (i = 0; i < labsArraySize; i++) {
            var date1 = new Date();
            date1.setISO8601(labsOrderJson.ORDERS[i].ORIG_ORD_DT_TM);
            if (date1.getTime() >= component.getArrivalDt().getTime()) {
                dateTimeArray.push(date1);
            }
            else {
                numSkipped++;
            }
        }
        labsArraySize = dateTimeArray.length;
        var dateCnt = 0;
        var dispMultIcon = false;
        var done = false;
        var activityInCell = false;
        var relString = "";
        var curDateCell = false;
        var classString = "";
        var status = "";
        var foundOrdered = false;
        var dispClass = "";
        var orderStatusDate = "";
        var numOfActivities = 0;
        
        for (i = 0; i < (component.getTotalTableDivisions()); i++) {
        	numOfActivities = component.getNumOfActivities();
            classString = "";
            dispClass = "";
            if ((((i + 1) % divisionsPerSection) === 0)) {
                if ((dtArray[i] < curDateRounded)) {
                    classString += " tl-disp-section";
                }
                else if (dtArray[i] > curDateRounded) {
                    classString += " tl-disp-section-future";
                }
            }
            
            activityInCell = false;
            if ((labsArraySize > 0) && (!done)) {
            
                if (((parseInt(dtArray[i], 10) <= parseInt(dateTimeArray[dateCnt].getTime(), 10)) && (parseInt(dateTimeArray[dateCnt].getTime(), 10) < parseInt(dtArray[i + 1], 10)))){ 
                    activityInCell = true;
                   }
            }
            if (dtArray[i] == curDateRounded) {
                curDateCell = true;
            }
            if (activityInCell) {
                if (!done) {
                    relString = numOfActivities;
                    var hoverNumber = Math.floor(i / divisionsPerSection);
                    status = labsOrderJson.ORDERS[dateCnt + numSkipped].ORDER_STATUS;
                    foundOrdered = false;
                    if (status == "COMPLETED") {
                        dispClass = "labs-of";
                        orderStatusDate = new Date();
						orderStatusDate.setISO8601(labsOrderJson.ORDERS[dateCnt + numSkipped].STATUS_DT_TM);
                    }
                    else if (status == "ORDERED") {
                        dispClass = "labs-onf";
                        foundOrdered = true;
                        orderStatusDate = dateTimeArray[dateCnt];
                    }
                    
                    addToActivityListAndHover(component, dateTimeArray[dateCnt], (labsOrderJson.ORDERS[dateCnt + numSkipped].ORDER_MNEMONIC + " "), dispClass, status, hoverNumber, orderStatusDate);
                    
                    if ((dateCnt + 1) < labsArraySize) {
                        dateCnt++;
                    }
                    else {
                        done = true;
                    }
                    if (curDateCell) {
                        classString += " tl-disp-dt";
                        curDateCell = false;
                    }
                    while (((parseInt(dtArray[i], 10) <= parseInt(dateTimeArray[dateCnt].getTime(), 10)) && (parseInt(dateTimeArray[dateCnt].getTime(), 10) < parseInt(dtArray[i + 1], 10))) && (!done)) {
                        dispMultIcon = true;
                        numOfActivities = component.getNumOfActivities();
                        relString = relString + "-" + numOfActivities;
                        status = labsOrderJson.ORDERS[dateCnt + numSkipped].ORDER_STATUS;
                        if (status === "COMPLETED") {
                            dispClass = "labs-of";
                            orderStatusDate = new Date();
							orderStatusDate.setISO8601(labsOrderJson.ORDERS[dateCnt + numSkipped].STATUS_DT_TM);
                        }
                        else if (status === "ORDERED") {
                            dispClass = "labs-onf";
                            foundOrdered = true;
                            orderStatusDate = dateTimeArray[dateCnt];
                        }
                        
                        addToActivityListAndHover(component, dateTimeArray[dateCnt], (labsOrderJson.ORDERS[dateCnt + numSkipped].ORDER_MNEMONIC + " "), dispClass, status, hoverNumber, orderStatusDate);
                        
                        if ((dateCnt + 1) < labsArraySize) {
                            dateCnt++;
                        }
                        else {
                            done = true;
                        }
                        
                    }
                    var multClass = foundOrdered ? " labs-monf" : " labs-mof";
                    var singleClass = foundOrdered ? " labs-onf" : " labs-of";
                    createDataCell(component, classString, multClass, singleClass, relString, dispMultIcon,null, etlArray);
                    dispMultIcon = false;
                }
            }
            else {
                curDateCell = createEmptyCell(component, i, " tl-row-odd-future", curDateCell, classString, curDateRounded,etlArray);
            }
        }
    }
    
    function buildLabsResultsRow(labsResultsJson, component, etlArray){
    	var edtimelinei18n = i18n.discernabu.edtimeline_o1;
        etlArray.push("</tr><tr class='tl-odd'>");
        var dtArray = component.getDateList();
        var dateTimeArray = [];
        var labsArraySize = 0;
        var numSkipped = 0;
        var curDateRounded = component.getCurDateRounded();
        var i=0;
        if (labsResultsJson != -1) {
            labsArraySize = labsResultsJson.EVENT_LIST.length;
            labsResultsJson.EVENT_LIST.sort(ResultSorter);
        }
        //Sort before getting the date
        
        for (i = 0; i < labsArraySize; i++) {
        
            var date1 = new Date();
            var date = getLatestParticipationDate(labsResultsJson.EVENT_LIST[i]);
            date1.setISO8601(getLatestParticipationDate(labsResultsJson.EVENT_LIST[i]));
            if (date1.getTime() >= component.getArrivalDt().getTime()) {
                dateTimeArray.push(date1);
            }
            else {
                numSkipped++;
            }
        }
        
        labsArraySize = dateTimeArray.length;
        var dateCnt = 0;
        var dispMultIcon = false;
        var done = false;
        var activityInCell = false;
        var relString = "";
        var curDateCell = false;
        var classString = "";
        var status = "";
        var criticalFound = false;
        var dispClass = "";
        var validResultFound = false;
        var personnelArray = MP_Util.LoadPersonelListJSON(labsResultsJson.PRSNL);
        var codesArray = MP_Util.LoadCodeListJSON(labsResultsJson.CODES);
        var numOfActivities = 0;
        var validStatusLiteral = oc(["ALTERED", "AUTH", "C_TRANSCRIBE", "DICTATED", "MODIFIED", "TRANSCRIBED"]);
        for (i = 0; i < (component.getTotalTableDivisions()); i++) {
        	numOfActivities = component.getNumOfActivities();
            classString = "";
            if ((((i + 1) % divisionsPerSection) === 0)) {
                if ((dtArray[i] < curDateRounded)) {
                    classString += " tl-disp-section";
                }
                else if (dtArray[i] > curDateRounded) {
                    classString += " tl-disp-section-future";
                }
            }
            
            activityInCell = false;
            if ((labsArraySize > 0) && (!done)) {
            
                if (((parseInt(dtArray[i],10) <= parseInt(dateTimeArray[dateCnt].getTime(), 10)) && (parseInt(dateTimeArray[dateCnt].getTime(), 10) < parseInt(dtArray[i + 1], 10)))) {
                    activityInCell = true;
                }
            }
            if (dtArray[i] == curDateRounded) {
            
                curDateCell = true;
            }
            if (activityInCell) {
                if (!done) {
                    var validOrderCount = 0;
                    var statusObject = MP_Util.GetValueFromArray(labsResultsJson.EVENT_LIST[dateCnt + numSkipped].STATUS_CD, codesArray);
                    var hoverNumber = Math.floor(i / divisionsPerSection);
                    var eventObject;
                    var labEvent;
                    var particEventObject;
                    validResultFound = false;
                    criticalFound = false;
                    relString = "";
                    if (statusObject.meaning in validStatusLiteral) {
                        eventObject = MP_Util.GetValueFromArray(labsResultsJson.EVENT_LIST[dateCnt + numSkipped].EVENT_CD, codesArray);
                        labEvent = null;
                        particEventObject = null; 
                        var latestPart = getLatestParticipation(labsResultsJson.EVENT_LIST[dateCnt + numSkipped]);
                        
                        if (latestPart){ 
                            particEventObject = MP_Util.GetValueFromArray(latestPart.TYPE_CD, codesArray);
                           }
                        validResultFound = true;
                        validOrderCount++;
                        relString = numOfActivities;                        
                        dispClass = "labs-r";
                        
                        if (parseInt(labsResultsJson.EVENT_LIST[dateCnt + numSkipped].CRITICAL_FLG, 10) === 1) {
                            dispClass = "crit";
                            criticalFound = true;
                        }
                        if (particEventObject) {
                            labEvent = new LabResultEvent(eventObject.display, (edtimelinei18n.LAST_PARTICIPATION + ": " + particEventObject.display + ", "));
                        }
                        else {
                            labEvent = new LabResultEvent(eventObject.display, "");
                        }
                        status = statusObject.display;
                        addToActivityListAndHover(component, dateTimeArray[dateCnt], labEvent, dispClass, status, hoverNumber);
                        
                    }
                    if ((dateCnt + 1) < labsArraySize) {
                        dateCnt++;
                    }
                    else {
                        done = true;
                    }
                    if (curDateCell) {
                        classString = " tl-disp-dt";
                        curDateCell = false;
                    }
                    
                    while (((parseInt(dtArray[i], 10) <= parseInt(dateTimeArray[dateCnt].getTime(), 10)) && (parseInt(dateTimeArray[dateCnt].getTime(), 10) < parseInt(dtArray[i + 1], 10))) && (!done)) {
                    	numOfActivities = component.getNumOfActivities();
                        statusObject = MP_Util.GetValueFromArray(labsResultsJson.EVENT_LIST[dateCnt + numSkipped].STATUS_CD, codesArray);
                        if (statusObject.meaning in validStatusLiteral) {
                            validOrderCount++;
                            eventObject = MP_Util.GetValueFromArray(labsResultsJson.EVENT_LIST[dateCnt + numSkipped].EVENT_CD, codesArray);
                            particEventObject = MP_Util.GetValueFromArray(getLatestParticipation(labsResultsJson.EVENT_LIST[dateCnt + numSkipped]).TYPE_CD, codesArray);
                            labEvent = null;
                            relString = validResultFound ? relString + "-" + numOfActivities : numOfActivities;
                            validResultFound = true;
                            dispClass = "labs-r";
                            if (parseInt(labsResultsJson.EVENT_LIST[dateCnt + numSkipped].CRITICAL_FLG, 10) == 1) {
                                dispClass = "crit";
                                criticalFound = true;
                            }
                            status = statusObject.display;
                            if (particEventObject) {
                                labEvent = new LabResultEvent(eventObject.display, (edtimelinei18n.LAST_PARTICIPATION + ": " + particEventObject.display + ", "));
                            }
                            else {
                                labEvent = new LabResultEvent(eventObject.display, "");
                            }
                            addToActivityListAndHover(component, dateTimeArray[dateCnt], labEvent, dispClass, status, hoverNumber);
                        }
                        if ((dateCnt + 1) < labsArraySize) {
                            dateCnt++;
                        }
                        else {
                            done = true;
                        }
                        
                    }
                    if (validOrderCount > 1) {
                        dispMultIcon = true;
                    }
                    if (validResultFound) {
                        var multClass = criticalFound ? " crit" : " labs-mr";
                        var singleClass = criticalFound ? " crit" : " labs-r";
                        createDataCell(component, classString, multClass, singleClass, relString, dispMultIcon, null, etlArray);
                        dispMultIcon = false;
                    }
                    else {
                        curDateCell = createEmptyCell(component, i, " tl-row-odd-future", curDateCell, classString,curDateRounded, etlArray);
                    }
                }
            }
            else {
                curDateCell = createEmptyCell(component, i, " tl-row-odd-future", curDateCell, classString,curDateRounded, etlArray);
            }
        }
    }
    
    function buildOrdersRow(ordersJson, component, etlArray){
    
        etlArray.push("</tr><tr class='tl-even'>");
        var dtArray = component.getDateList();
        var curDateRounded = component.getCurDateRounded();
        var dateTimeArray = [];
        var ordersArraySize = 0;
        var numSkipped = 0;
        var i = 0;
        if (ordersJson != -1) {
            ordersArraySize = ordersJson.ORDERS.length;
        }
        
        for (i = 0; i < ordersArraySize; i++) {

            var date1 = new Date();
            date1.setISO8601(ordersJson.ORDERS[i].ORIG_ORD_DT_TM);
            if (date1.getTime() >= component.getArrivalDt().getTime()) {
                dateTimeArray.push(date1);
            }
            else {
                numSkipped++;
            }
        }
        ordersArraySize = dateTimeArray.length;
        var dateCnt = 0;
        var dispMultIcon = false;
        var done = false;
        var activityInCell = false;
        var relString = "";
        var curDateCell = false;
        var classString = "";
        var status = "";
        var foundOrdered = false;
        var dispClass = "";
        var orderStatusDate = "";
        var numOfActivities = 0;
        
        for (i = 0; i < (component.getTotalTableDivisions()); i++) {
        	numOfActivities = component.getNumOfActivities();
            classString = "";
            foundOrdered = false;
            if ((((i + 1) % divisionsPerSection) === 0)) {
                if ((dtArray[i] < curDateRounded)) {
                    classString += " tl-disp-section";
                }
                else if (dtArray[i] > curDateRounded) {
                    classString += " tl-disp-section-future";
                }
            }
            
            activityInCell = false;
            if ((ordersArraySize > 0) && (!done)) {
            
                if (((parseInt(dtArray[i], 10) <= parseInt(dateTimeArray[dateCnt].getTime(), 10)) && (parseInt(dateTimeArray[dateCnt].getTime(), 10) < parseInt(dtArray[i + 1], 10)))){ 
                    activityInCell = true;
                   }
            }
            if (dtArray[i] == curDateRounded) {
            
                curDateCell = true;
            }
            if (activityInCell) {
                if (!done) {
                    relString = numOfActivities;
                    var hoverNumber = Math.floor(i / divisionsPerSection);
                    status = ordersJson.ORDERS[dateCnt + numSkipped].ORDER_STATUS;
                    if (status == "COMPLETED") {
                        dispClass = "orders-c";
                        orderStatusDate = new Date();
						orderStatusDate.setISO8601(ordersJson.ORDERS[dateCnt + numSkipped].STATUS_DT_TM);
                    }
                    else if (status == "ORDERED") {
                        dispClass = "orders-nc";
                        foundOrdered = true;
                        orderStatusDate = dateTimeArray[dateCnt];
                    }
                    
                    addToActivityListAndHover(component, dateTimeArray[dateCnt], (ordersJson.ORDERS[dateCnt + numSkipped].ORDER_MNEMONIC + " "), dispClass, status, hoverNumber, orderStatusDate);
                    
                    if ((dateCnt + 1) < ordersArraySize) {
                        dateCnt++;
                    }
                    else {
                        done = true;
                    }
                    if (curDateCell) {
                        classString += " tl-disp-dt";
                        curDateCell = false;
                    }
                    while (((parseInt(dtArray[i], 10) <= parseInt(dateTimeArray[dateCnt].getTime(), 10)) && (parseInt(dateTimeArray[dateCnt].getTime(), 10) < parseInt(dtArray[i + 1], 10))) && (!done)) {
                        dispMultIcon = true;
                        numOfActivities = component.getNumOfActivities();
                        relString = relString + "-" + numOfActivities;
                        status = ordersJson.ORDERS[dateCnt + numSkipped].ORDER_STATUS;
                        if (status == "COMPLETED") {
                            dispClass = "orders-c";
                            orderStatusDate = new Date();
							orderStatusDate.setISO8601(ordersJson.ORDERS[dateCnt + numSkipped].STATUS_DT_TM);
                        }
                        else if (status == "ORDERED") {
                            dispClass = "orders-nc";
                            foundOrdered = true;
                            orderStatusDate = dateTimeArray[dateCnt];
                        }
                        
                        addToActivityListAndHover(component, dateTimeArray[dateCnt], (ordersJson.ORDERS[dateCnt + numSkipped].ORDER_MNEMONIC + " "), dispClass, status, hoverNumber, orderStatusDate);
                        
                        if ((dateCnt + 1) < ordersArraySize) {
                            dateCnt++;
                        }
                        else {
                            done = true;
                        }
                        
                    }
                    var singleClass = foundOrdered ? " orders-nc" : " orders-c";
                    var multClass = foundOrdered ? " orders-mnc" : " orders-mc";
                    createDataCell(component, classString, multClass, singleClass, relString, dispMultIcon, null,etlArray);
                    dispMultIcon = false;
                }
            }
            else {
                curDateCell = createEmptyCell(component, i, " tl-row-even-future", curDateCell, classString,curDateRounded, etlArray);
            }
        }
    }
    
    function buildDocumentsRow(docsJson, component, etlArray){
    	var edtimelinei18n = i18n.discernabu.edtimeline_o1;
        etlArray.push("</tr><tr class='tl-odd'>");
        var curDateRounded = component.getCurDateRounded();
        var dtArray = component.getDateList();
        var dateTimeArray = [];
        var docArraySize = 0;
        var numSkipped = 0;
        var i = 0;
        if (docsJson != -1) {
            docArraySize = docsJson.DOCS.length;
        }
        
		for(i=docArraySize;i--;)
		{
        
            var date1 = new Date();
            date1.setISO8601(docsJson.DOCS[i].EFFECTIVE_DATE);
            if (date1.getTime() >= component.getArrivalDt().getTime()) {
                dateTimeArray.push(date1);
            }
            else {
                numSkipped++;
            }
        }
        docArraySize = dateTimeArray.length;
        var dateCnt = 0;
        var dispMultIcon = false;
        var done = false;
        var activityInCell = false;
        var relString = "";
        var curDateCell = false;
        var classString = "";
        var numOfActivities = 0;
        for (i = 0; i < (component.getTotalTableDivisions()); i++) {
            classString = "";
            numOfActivities = component.getNumOfActivities();
            if ((((i + 1) % divisionsPerSection) === 0)) {
                if ((dtArray[i] < curDateRounded)) {
                    classString += " tl-disp-section";
                }
                else if (dtArray[i] > curDateRounded) {
                    classString += " tl-disp-section-future";
                }
            }
            
            activityInCell = false;
            if ((docArraySize > 0) && (!done)) {
                if (((parseInt(dtArray[i], 10) <= parseInt(dateTimeArray[dateCnt].getTime(), 10)) && (parseInt(dateTimeArray[dateCnt].getTime(), 10) < parseInt(dtArray[i + 1], 10)))){ 
                    activityInCell = true;
                   }
            }
            if (dtArray[i] == curDateRounded) {
                curDateCell = true;
            }
            if (activityInCell) {
                if (!done) {
                    relString = numOfActivities;
                    var hoverNumber = Math.floor(i / divisionsPerSection);
		    var type = docsJson.DOCS[dateCnt + numSkipped].EVENT_CD_DISP;
                    var x = 0, xl = 0;
                    var author = "";
					for(x=0;x<docsJson.DOCS[dateCnt+numSkipped].ACTION_PROVIDERS.length;x++)
					{
						
						if(docsJson.DOCS[dateCnt+numSkipped].ACTION_PROVIDERS[x].TYPE_CD_MEANING=="SIGN")
							{

							author=edtimelinei18n.AUTHOR+": "+docsJson.DOCS[dateCnt+numSkipped].ACTION_PROVIDERS[x].PRSNL_NAME+" ";

							}
					}
                    
                    addToActivityListAndHover(component, dateTimeArray[dateCnt], (new DocumentEvent(type, author)), "assesments-adm", "COMPLETED", hoverNumber);
                    if ((dateCnt + 1) < docArraySize) {
                        dateCnt++;
                    }
                    else {
                        done = true;
                    }
                    if (curDateCell) {
                        classString += " tl-disp-dt";
                        curDateCell = false;
                    }
                    while (((parseInt(dtArray[i], 10) <= parseInt(dateTimeArray[dateCnt].getTime(), 10)) && (parseInt(dateTimeArray[dateCnt].getTime(), 10) < parseInt(dtArray[i + 1], 10))) && (!done)) {
                        dispMultIcon = true;
                        numOfActivities = component.getNumOfActivities();
                        relString = relString + "-" + numOfActivities;
                        author = "";
						type=docsJson.DOCS[dateCnt+numSkipped].EVENT_CD_DISP;
						for(x=0,xl=docsJson.DOCS[dateCnt+numSkipped].ACTION_PROVIDERS.length;x<xl;x++)
						{
							
							if(docsJson.DOCS[dateCnt+numSkipped].ACTION_PROVIDERS[x].TYPE_CD_MEANING==="SIGN")
								{
								author=" , Author: "+docsJson.DOCS[dateCnt+numSkipped].ACTION_PROVIDERS[x].PRSNL_NAME+" ";
								}
						}
								
                        addToActivityListAndHover(component, dateTimeArray[dateCnt], (new DocumentEvent(type, author)), "assesments-adm", "COMPLETED", hoverNumber);
                        if ((dateCnt + 1) < docArraySize) {
                            dateCnt++;
                            
                        }
                        else {
                            done = true;
                        }
                        
                    }
                    createDataCell(component, classString, " assesments-madm", " assesments-adm", relString, dispMultIcon, null, etlArray);
                    dispMultIcon = false;
                }
            }
            else {
                curDateCell = createEmptyCell(component, i, " tl-row-odd-future", curDateCell, classString, curDateRounded,etlArray);
            }
            
        }
    }
    
    function buildEventsRow(eventsJson, component, etlArray){ 	 
        etlArray.push("</tr><tr class='tl-even'>");
        var curDateRounded = component.getCurDateRounded();
        var dtArray = component.getDateList();
        var completeDateTimeArray = [];
        var eventsArraySize = 0;
        var numSkipped = 0;
        if (eventsJson != -1) {
            eventsArraySize = eventsJson.TRACKING_EVENT.length;
        }
        for (i = 0; i < eventsArraySize; i++) {
            var date1 = new Date();
			date1.setISO8601(eventsJson.TRACKING_EVENT[i].COMPLETE_DT_TM);
            if (date1.getTime() >= component.getArrivalDt().getTime()) {
            
                completeDateTimeArray.push(date1);
            }
            else {
                numSkipped++;
            }
        }
        eventsArraySize = completeDateTimeArray.length;
        var dateCnt = 0;
        var dispMultIcon = false;
        var done = false;
        var activityInCell = false;
        var relString = "";
        var curDateCell = false;
        var classString = "";
        var numOfActivities = 0;
        for (i = 0; i < (component.getTotalTableDivisions()); i++) {
        	numOfActivities = component.getNumOfActivities();
            classString = "";
            if ((((i + 1) % divisionsPerSection) === 0)) {
                if ((dtArray[i] < curDateRounded)) {
                    classString += " tl-disp-section";
                }
                else if (dtArray[i] > curDateRounded) {
                    classString += " tl-disp-section-future";
                }
            }
            
            activityInCell = false;
            if ((eventsArraySize > 0) && (!done)) {
                if (((parseInt(dtArray[i], 10) <= parseInt(completeDateTimeArray[dateCnt].getTime(), 10)) && (parseInt(completeDateTimeArray[dateCnt].getTime(), 10) < parseInt(dtArray[i + 1], 10)))){ 
                    activityInCell = true;
                   }
            }
            if (dtArray[i] == curDateRounded) {
                curDateCell = true;
            }
            if (activityInCell) {
                if (!done) {
                    relString = numOfActivities;
                    var hoverNumber = Math.floor(i / divisionsPerSection);
                    addToActivityListAndHover(component, completeDateTimeArray[dateCnt], (eventsJson.TRACKING_EVENT[dateCnt + numSkipped].DESCRIPTION + " (" + eventsJson.TRACKING_EVENT[dateCnt + numSkipped].TRACKING_GROUP_DISP + ")"), "events-comp", "COMPLETED", hoverNumber);
                    
                    if ((dateCnt + 1) < eventsArraySize) {
                        dateCnt++;
                    }
                    else {
                        done = true;
                    }
                    if (curDateCell) {
                        classString += " tl-disp-dt";
                        curDateCell = false;
                    }
                    while (((parseInt(dtArray[i], 10) <= parseInt(completeDateTimeArray[dateCnt].getTime(), 10)) && (parseInt(completeDateTimeArray[dateCnt].getTime(), 10) < parseInt(dtArray[i + 1], 10))) && (!done)) {
                    	numOfActivities = component.getNumOfActivities();
                        dispMultIcon = true;
                        relString = relString + "-" + numOfActivities;
                        addToActivityListAndHover(component, completeDateTimeArray[dateCnt], (eventsJson.TRACKING_EVENT[dateCnt + numSkipped].DESCRIPTION + " (" + eventsJson.TRACKING_EVENT[dateCnt + numSkipped].TRACKING_GROUP_DISP + ")"), "events-comp", "COMPLETED", hoverNumber);
                        
                        if ((dateCnt + 1) < eventsArraySize) {
                            dateCnt++;
                        }
                        else {
                            done = true;
                        }
                    }
                    createDataCell(component, classString, " events-mcomp", " events-comp", relString, dispMultIcon, curDateCell, etlArray);
                    dispMultIcon = false;
                    
                }
            }
            else {
                curDateCell = createEmptyCell(component, i, " tl-row-even-future", curDateCell, classString,curDateRounded, etlArray);
            }
        }
        etlArray.push("</tr></table></td></tr>");
        
    }
    
    function createEmptyCell(component, index, zebraType, curDateCell, classString, curDateRounded, etlArray){
    	var dtArray = component.getDateList();
    	var eventCellWidth = component.getEventCellWidth();
        if (curDateCell) {
            classString += " tl-disp-dt";
            etlArray.push("<td style='width:", (eventCellWidth - 2), "px' class='", classString, "'><span class='tl-text-val'> &nbsp;</span></td>");
            
        }
        else if (dtArray[index] > curDateRounded) {
            classString += zebraType;
            etlArray.push("<td style='width:", eventCellWidth, "px' class='", classString, "'><span class='tl-text-val'> &nbsp; &nbsp;</span></td>");
        }
        else {
            etlArray.push("<td style='width:", eventCellWidth, "px' class='", classString, "'><span class='tl-text-val'> &nbsp; &nbsp;</span></td>");
        }
        return false;
        
    }
    
    function createDataCell(component, classString, multClass, singleClass, relString, dispMultIcon, curDateCell, etlArray){
    	var eventCellWidth = component.getEventCellWidth();
        var width = curDateCell ? (eventCellWidth - 2) : eventCellWidth;
        if (dispMultIcon) {
            classString += multClass;
            etlArray.push("<td style='width:", width, "px' class='", classString, "'><span class='tl-text-val'><a href='#' rel='", relString, "' onClick=\"CERN_TIMELINE_O1.SelectActivity(this.rel,", component.getComponentId(), "); return false;\" class='tl-actv-link'> &nbsp; &nbsp; </a></span></td>");
        }
        else {
            classString += singleClass;
            etlArray.push("<td style='width:", width, "px' class='", classString, "'><span class='tl-text-val'><a href='#' rel='", relString, "' onClick=\"CERN_TIMELINE_O1.SelectActivity(this.rel,", component.getComponentId(), "); return false;\" class='tl-actv-link'> &nbsp; &nbsp; </a></span></td>");
        }
        
    }
    
    function getMedsAdminEventFromJson(medAdminJson, codesArray){
        var dose = "";
        var route = "";
        var name = "";
        var medIngred;
        for (var x = 0, xl = medAdminJson.MEDICATION_INGREDIENTS.length; x < xl; x++) {
            medIngred = medAdminJson.MEDICATION_INGREDIENTS[x];
            if (medIngred.ORDER_CATALOG_CD){
                name += MP_Util.GetValueFromArray(medIngred.ORDER_CATALOG_CD, codesArray).display;
               }
        }
        
        if (medAdminJson.ROUTE_CD) {
            route = MP_Util.GetValueFromArray(medAdminJson.ROUTE_CD, codesArray).display;
           }
        
        if (medAdminJson.IS_CONTINUOUS_IND === 1) {
            for (x = 0; x < medAdminJson.CONTINUOUS_INFORMATION.length; x++) {
                var contInfo = medAdminJson.CONTINUOUS_INFORMATION[x];
                if (contInfo.DOSE) {
                    dose += contInfo.DOSE;
                    if (contInfo.DOSE_UNIT_CD){ 
                        dose += " " + MP_Util.GetValueFromArray(contInfo.DOSE_UNIT_CD, codesArray).display;
                       }
                }
                if (contInfo.VOLUME) {
                    dose += contInfo.VOLUME;
                    if (contInfo.VOLUME_UNIT_CD) {
                        dose += " " + MP_Util.GetValueFromArray(contInfo.VOLUME_UNIT_CD, codesArray).display;
                       }
                }
            }
        }
        else {
            for (x = 0; x < medAdminJson.MEDICATION_INGREDIENTS.length; x++) {
                medIngred = medAdminJson.MEDICATION_INGREDIENTS[x];
                if (medIngred.DOSE) {
                    dose = medIngred.DOSE;
                    if (medIngred.DOSE_UNIT_CD) {
                        dose += " " + MP_Util.GetValueFromArray(medIngred.DOSE_UNIT_CD, codesArray).display;
                       }
                }
                if (medIngred.VOLUME) {
                    dose += medIngred.VOLUME;
                    if (medIngred.VOLUME_UNIT_CD){ 
                        dose += " " + MP_Util.GetValueFromArray(medIngred.VOLUME_UNIT_CD, codesArray).display;
                       }
                }
                if (medIngred.STRENGTH) {
                    dose += medIngred.STRENGTH;
                    if (medIngred.STRENGTH_UNIT_CD) {
                        dose += " " + MP_Util.GetValueFromArray(medIngred.STRENGTH_UNIT_CD, codesArray).display;
                       }
                }
            }
        }
        return new MedicationEvent(name, route, dose, "");
    }
    
    function getMedsOrderEventFromJson(medsOrderJson, codesArray){
    
        var name = "";
        var route = "";
        var dose = "";
        var freq = "";
        
        name = medsOrderJson.DISPLAYS.REFERENCE_NAME;
        
        for (var x = 0, xl = medsOrderJson.MEDICATION_INFORMATION.INGREDIENTS.length; x < xl; x++) {
            var ingred = medsOrderJson.MEDICATION_INFORMATION.INGREDIENTS[x];
            
            if (ingred.DOSE.STRENGTH) {
                dose += ingred.DOSE.STRENGTH;
                if (ingred.DOSE.STRENGTH_UNIT_CD) {
                    dose += " " + MP_Util.GetValueFromArray(ingred.DOSE.STRENGTH_UNIT_CD, codesArray).display;
                   }
            }
            if (ingred.DOSE.VOLUME) {
                dose += ingred.DOSE.VOLUME;
                if (ingred.DOSE.VOLUME_UNIT_CD) {
                    dose += " " + MP_Util.GetValueFromArray(ingred.DOSE.VOLUME_UNIT_CD, codesArray).display;
                   }
            }
            
        }
        if (medsOrderJson.SCHEDULE.ROUTE) {
            route = medsOrderJson.SCHEDULE.ROUTE;
        }
        if (medsOrderJson.SCHEDULE.FREQUENCY.FREQUENCY_CD > 0) {
            freq = MP_Util.GetValueFromArray(medsOrderJson.SCHEDULE.FREQUENCY.FREQUENCY_CD, codesArray).display;
        }
        return (new MedicationEvent(name, route, dose, freq));
    }
    
    function getWidth(){
    
        var theBody = _gbt('body').item(0);
        var widthObj = {};
        widthObj.width = (parseInt(theBody.clientWidth, 10) - 10);
        return (widthObj);
    }
    
    function roundDate(theDate, roundTo){
        var minutes = theDate.getMinutes();
        var hours = theDate.getHours();
        
        minutes = Math.floor(minutes / roundTo) * roundTo;
        if (minutes == 60) {
            hours++;
            minutes = 0;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (hours < 10) {
            hours = "0" + hours;
        }
        var time = hours + ":" + minutes;
        return time;
    }
    
    function roundTime(theDate, minuteDivisions){
        var minutes = theDate.getMinutes();
        var hours = theDate.getHours();
        minutes = Math.floor(minutes / minuteDivisions) * minuteDivisions;
        if (minutes == 60) {
            hours++;
            minutes = 0;
        }
        theDate.setMinutes(minutes);
        theDate.setHours(hours);
        theDate.setSeconds(0);
        theDate.setMilliseconds(0);
        
    }
    
    function scrollTimeline(scrollAmount, addIndicator, componentId){
        addIndicator = addIndicator || false;
        var scroll = _g('tlTimelineScroll' + componentId);
        if (scrollAmount == "MAX") {
            scrollAmount = scroll.scrollWidth;
        }
        if (addIndicator) {
            scroll.scrollLeft = scrollAmount + scroll.scrollLeft;
        }
        else {
            scroll.scrollLeft = scrollAmount;
        }
    }
    
    function getLos(recordData){
        var dischargeDtTm = recordData.DISCHARGE_DT_TM;
        var departDtTm = recordData.DEPART_DT_TM;
        var oneDay = 1000 * 60 * 60 * 24;
        var curDate = new Date();
        var los = 0;
        var arrivalDtTm = new Date();
        curDate.setDate(curDate.getDate());
        
        if (recordData.ARRIVAL_DT_TM) {
			arrivalDtTm.setISO8601(recordData.ARRIVAL_DT_TM);
        }
        else {
			arrivalDtTm.setISO8601(recordData.REG_DT_TM);
        }
        if (!dischargeDtTm) {
            los = (curDate.getTime() - arrivalDtTm.getTime()) / (1000 * 60);
        }
        else {
            var dischargeDt = new Date();
			dischargeDt.setISO8601(dischargeDtTm);
            los = (dischargeDt.getTime() - arrivalDtTm.getTime()) / (1000 * 60);
        }
        var HH = Math.floor((los / 60) % 24);
        var losHours = Math.ceil(los / 60);
        
        if (HH < 10) {
            HH = "0" + HH;
        }
        
        var MM = Math.floor(los % 60);
        if (MM < 10) {
            MM = "0" + MM;
        }
        
        var DD = Math.floor(los / (60 * 24));
        if (DD < 10) {
            DD = "0" + DD;
        }
        
        return ([DD + ":" + HH + ":" + MM, losHours]);
    }
    
    function addToActivityListAndHover(component, dateTime, eventDetails, eventType, eventStatus, hoverNumber, statusDate){
        var newActivity = new Activity(dateTime, eventDetails, eventType, eventStatus, component.getNumOfActivities(), statusDate);
        //timeSectionHoverArray[hoverNumber].push(newActivity);
        //activityList[activityList.length++] = newActivity;
        component.addActivityListItem(newActivity);
        component.setHoverListItem(hoverNumber,newActivity);
        //numOfActivities++;
    }
    
    function fillSectionHovers(hourSections, hoverList, componentId){
    	var edtimelinei18n = i18n.discernabu.edtimeline_o1;
        for (var i = 0; i < hourSections; i++) {
            var curHover = hoverList[i];
            if (curHover.length > 0) {
                var curHoverHtmlArray = [];
                var curHoverDivHTML = "";
                curHover.sort(sortByDateChron);
                for (var j = 0; j < curHover.length; j++) {
                    switch (curHover[j].EventType) {
                    
                        case "labs-r":
                            curHoverHtmlArray.push("<div class='tl-section-hvr-cont'><div class='tl-section-hvr'><span style='width:16px' class='", curHover[j].EventType, "'> &nbsp; &nbsp;</span></div><div class='tl-section-hvr'>", curHover[j].EventDetails.Name, "</div><div class='tl-section-hvr'><p> " ,edtimelinei18n.STATUS, ": ", curHover[j].Status, "; ", curHover[j].EventDetails.Participation, curHover[j].DateTime.format("longDateTime3"), "</p></div></div>");
                            break;
                        case "events-comp":
                            curHoverHtmlArray.push("<div class='tl-section-hvr-cont'><div class='tl-section-hvr'><span style='width:16px' class='", curHover[j].EventType, "'> &nbsp; &nbsp;</span></div><div class='tl-section-hvr'>", curHover[j].EventDetails, "</div><div class='tl-section-hvr'><p>", edtimelinei18n.COMPLETED, ": ", curHover[j].DateTime.format("longDateTime3"), "</p></div></div>");
                            break;
                        case "crit":
                            curHoverHtmlArray.push("<div class='tl-section-hvr-cont'><div class='tl-section-hvr'><span style='width:16px' class='", curHover[j].EventType, "'> &nbsp; &nbsp;</span></div><div class='tl-section-hvr tl-critical'>", curHover[j].EventDetails.Name, "</div><div class='tl-section-hvr'><p> " ,edtimelinei18n.STATUS, ":", curHover[j].Status, "; ", curHover[j].EventDetails.Participation, curHover[j].DateTime.format("longDateTime3"), "</p></div></div>");
                            break;
                        case "labs-of":
                        case "orders-c":
                            curHoverHtmlArray.push("<div class='tl-section-hvr-cont'><div class='tl-section-hvr'><span class='", curHover[j].EventType, "'> &nbsp; &nbsp;</span></div><div class='tl-section-hvr'>", curHover[j].EventDetails, "</div><div class='tl-section-hvr'><p> ", edtimelinei18n.ORDERED, ": ", curHover[j].DateTime.format("longDateTime3"), ";  ", edtimelinei18n.COMPLETED, ": ", curHover[j].StatusDate.format("longDateTime3"), "</p></div></div>");
                            break;
                        case "labs-onf":
                        case "orders-nc":
                            curHoverHtmlArray.push("<div class='tl-section-hvr-cont'><div class='tl-section-hvr'><span class='", curHover[j].EventType, "'> &nbsp; &nbsp;</span></div><div class='tl-section-hvr'>", curHover[j].EventDetails, "</div><div class='tl-section-hvr'><p> ", edtimelinei18n.ORDERED, ": ", curHover[j].DateTime.format("longDateTime3"), "</p></div></div>");
                            break;
                        case "assesments-adm":
                            curHoverHtmlArray.push("<div class='tl-section-hvr-cont'><div class='tl-section-hvr'><span class='", curHover[j].EventType, "'> &nbsp; &nbsp;</span></div><div class='tl-section-hvr'>", curHover[j].EventDetails.Type, "</div><div class='tl-section-hvr'><p>", curHover[j].EventDetails.Author, "; ", edtimelinei18n.COMPLETED, ": ", curHover[j].DateTime.format("longDateTime3"), "</p></div></div>");
                            break;
                        case "meds-onf":
                        case "meds-of":
                            curHoverHtmlArray.push("<div class='tl-section-hvr-cont'><div class='tl-section-hvr'><span class='", curHover[j].EventType, "'> &nbsp; &nbsp;</span></div><div class='tl-section-hvr'>", curHover[j].EventDetails.Name, " ", curHover[j].EventDetails.Dose, " ", curHover[j].EventDetails.Route, " ", curHover[j].EventDetails.Freq, "</div><div class='tl-section-hvr'><p>", edtimelinei18n.ORDERED, ": ", curHover[j].DateTime.format("longDateTime3"), "</p></div></div>");
                            break;
                        case "meds-adm":
                            curHoverHtmlArray.push("<div class='tl-section-hvr-cont'><div class='tl-section-hvr'><span class='", curHover[j].EventType, "'> &nbsp; &nbsp;</span></div><div class='tl-section-hvr'>", curHover[j].EventDetails.Name, " ", curHover[j].EventDetails.Dose, " ", curHover[j].EventDetails.Route, "</div><div class='tl-section-hvr'><p>", edtimelinei18n.ADMINISTERED, ": ", curHover[j].DateTime.format("longDateTime3"), "</p></div></div>");
                            break;
                            
                        default:
                            
                            
                    }
                    
                }
                curHoverDiv = _g(('tl15MinHover' + i) + componentId);
                curHoverDivHTML = curHoverHtmlArray.join("");
                curHoverDiv.innerHTML = curHoverDivHTML;
            }
            
            
        }
    }
    
    function createActivityList(componentId, activityList, etlArray){
    	
    	var edtimelinei18n = i18n.discernabu.edtimeline_o1;
        etlArray.push("<div id='tlActvListCont", componentId,"' class='tl-actv-list-cont hidden'><div class='tl-actv-list-cap-sgl'>&nbsp</div><div id='tlActvListHeaderOut", componentId,"' class='tl-actv-list-hd-out'><a onClick=\"CERN_TIMELINE_O1.ExpandCollapseActivityList(null, ", componentId , "); return false;\" id='tlExpCollapseActv", componentId,"'  href='#' class='tl-toggle-exp tl-collapse'>&nbsp;&nbsp;&nbsp;&nbsp;</a><span class='tl-actv-list-txt tl-text-val' id='tlActvListTxt", componentId,"'>", edtimelinei18n.ACTIVITY_LIST, "</span></div><div class='tl-actv-list hidden' id='tlActvList", componentId,"'>", "<table class='tl-actv-list-table' ><tr><td class='tl-actv-list-icon' style='width:5%'>&nbsp;</td><td style='width:70% ' ><span class='tl-actv-list-hd'>", edtimelinei18n.NAME, "</span></td><td style='width:25% ' ><span class='tl-actv-list-hd'>", edtimelinei18n.WITHIN, "</span></td></tr>");
        
        activityList.sort(sortByDateReverseChron);
        var withinString = "";
        var trclass = "tl-odd";
        for (var i = 0; i < activityList.length; i++) {
            withinString = MP_Util.CalcWithinTime(activityList[i].DateTime);
            trclass = "tl-odd";
            if (i % 2 === 0){ 
                trclass = "tl-even";
               }
            switch (activityList[i].EventType) {
                case "labs-r":
                    etlArray.push("<tr id=tlActivityRow", activityList[i].ActivityId, componentId, " rel=", i, " class=", trclass, "><td ><dl class='tl-info' ><dt> Activity List Item: </dt> <dd  class='tl-actv-text ", activityList[i].EventType, "'>&nbsp;&nbsp;</dd> </dl><h4 class='tl-hvr-hd'>Activity List Hover Item</h4><div class='hvr'><div class='tl-section-hvr-cont'><div class='tl-section-hvr'><span style='width:16px' class='", activityList[i].EventType, "'> &nbsp; &nbsp;</span></div><div class='tl-section-hvr'>", activityList[i].EventDetails.Name, "</div><div class='tl-section-hvr'><p> " ,edtimelinei18n.STATUS, ":", activityList[i].Status, "; ", activityList[i].EventDetails.Participation, activityList[i].DateTime.format("longDateTime3"), "</p></div></div></div></td><td ><span class='tl-actv-text'> ", activityList[i].EventDetails.Name, "</span></td> <td  ><span class='tl-actv-text'> ", withinString, "</span></td></tr>");
                    break;
                case "events-comp":
                    etlArray.push("<tr id=tlActivityRow", activityList[i].ActivityId, componentId, " rel=", i, " class=", trclass, "><td ><dl class='tl-info' ><dt> Activity List Item: </dt> <dd  class='tl-actv-text ", activityList[i].EventType, "'>&nbsp;&nbsp;</dd> </dl><h4 class='tl-hvr-hd'>Activity List Hover Item</h4><div class='hvr'><div class='tl-section-hvr-cont'><div class='tl-section-hvr'><span style='width:16px' class='", activityList[i].EventType, "'> &nbsp; &nbsp;</span></div><div class='tl-section-hvr'>", activityList[i].EventDetails, "</div><div class='tl-section-hvr'><p>", edtimelinei18n.COMPLETED, ": ", activityList[i].DateTime.format("longDateTime3"), "</p></div></div></div></td><td ><span class='tl-actv-text'> ", activityList[i].EventDetails, "</span></td> <td  ><span class='tl-actv-text'> ", withinString, "</span></td></tr>");
                    break;
                case "crit":
                    etlArray.push("<tr id=tlActivityRow", activityList[i].ActivityId, componentId, " rel=", i, " class=", trclass, "><td ><dl class='tl-info' ><dt> Activity List Item: </dt> <dd  class='tl-actv-text ", activityList[i].EventType, "'>&nbsp;&nbsp;</dd> </dl><h4 class='tl-hvr-hd'>Activity List Hover Item</h4><div class='hvr'><div class='tl-section-hvr-cont'><div class='tl-section-hvr'><span style='width:16px' class='", activityList[i].EventType, "'> &nbsp; &nbsp;</span></div><div class='tl-section-hvr tl-critical'>", activityList[i].EventDetails.Name, "</div><div class='tl-section-hvr'><p> " ,edtimelinei18n.STATUS, ":", activityList[i].Status, "; ", activityList[i].EventDetails.Participation, activityList[i].DateTime.format("longDateTime3"), "</p></div></div></div></td><td ><span id=tlCritical", activityList[i].ActivityId, componentId, " class='tl-actv-text tl-critical'> ", activityList[i].EventDetails.Name, "</span></td> <td  ><span class='tl-actv-text'> ", withinString, "</span></td></tr>");
                    break;
                case "orders-nc":
                case "labs-onf":
                    etlArray.push("<tr id=tlActivityRow", activityList[i].ActivityId, componentId, " rel=", i, " class=", trclass, "><td ><dl class='tl-info' ><dt> Activity List Item: </dt> <dd  class='tl-actv-text ", activityList[i].EventType, "'>&nbsp;&nbsp;</dd> </dl><h4 class='tl-hvr-hd'>Activity List Hover Item</h4><div class='hvr'><div class='tl-section-hvr-cont'><div class='tl-section-hvr'><span style='width:16px' class='", activityList[i].EventType, "'> &nbsp; &nbsp;</span></div><div class='tl-section-hvr'>  ", activityList[i].EventDetails, "</div><div class='tl-section-hvr'><p> ", edtimelinei18n.ORDERED, ": ", activityList[i].DateTime.format("longDateTime3"), "</p></div></div></div></td><td ><span class='tl-actv-text'> ", activityList[i].EventDetails, "</span></td> <td  ><span class='tl-actv-text'> ", withinString, "</span></td></tr>");
                    break;
                case "orders-c":
                case "labs-of":
                    etlArray.push("<tr id=tlActivityRow", activityList[i].ActivityId, componentId, " rel=", i, " class=", trclass, "><td ><dl class='tl-info' ><dt> Activity List Item: </dt> <dd  class='tl-actv-text ", activityList[i].EventType, "'>&nbsp;&nbsp;</dd> </dl><h4 class='tl-hvr-hd'>Activity List Hover Item</h4><div class='hvr'><div class='tl-section-hvr-cont'><div class='tl-section-hvr'><span style='width:16px' class='", activityList[i].EventType, "'> &nbsp; &nbsp;</span></div><div class='tl-section-hvr'> ", activityList[i].EventDetails, "</div><div class='tl-section-hvr'><p> ", edtimelinei18n.ORDERED, ": ", activityList[i].DateTime.format("longDateTime3"), ";  ", edtimelinei18n.COMPLETED, ": ", activityList[i].StatusDate.format("longDateTime3"), "</p></div></div></div></td><td ><span class='tl-actv-text'> ", activityList[i].EventDetails, "</span></td> <td  ><span class='tl-actv-text'> ", withinString, "</span></td></tr>");
                    break;
                case "assesments-adm":
                    etlArray.push("<tr id=tlActivityRow", activityList[i].ActivityId, componentId, " rel=", i, " class=", trclass, "><td><dl class='tl-info' ><dt> Activity List Item: </dt> <dd  class='tl-actv-text ", activityList[i].EventType, "'>&nbsp;&nbsp;</dd> </dl><h4 class='tl-hvr-hd'>Activity List Hover Item</h4><div class='hvr'><div class='tl-section-hvr-cont'><div class='tl-section-hvr'><span class='", activityList[i].EventType, "'> &nbsp; &nbsp;</span></div><div class='tl-section-hvr'>", activityList[i].EventDetails.Type, "</div><div class='tl-section-hvr'><p>", activityList[i].EventDetails.Author, "; ", edtimelinei18n.COMPLETED, ": ", activityList[i].DateTime.format("longDateTime3"), "</p></div></div> </div></td><td ><span class='tl-text-val'> ", activityList[i].EventDetails.Type, "</span></td> <td ><span class='tl-actv-text'> ", withinString, "</span></td></tr>");
                    break;
                case "meds-adm":
                    etlArray.push("<tr id=tlActivityRow", activityList[i].ActivityId, componentId, " rel=", i, " class=", trclass, "><td><dl class='tl-info' ><dt> Activity List Item: </dt> <dd  class='tl-actv-text ", activityList[i].EventType, "'>&nbsp;&nbsp;</dd> </dl><h4 class='tl-hvr-hd'>Activity List Hover Item</h4><div class='hvr'><div class='tl-section-hvr-cont'><div class='tl-section-hvr'><span class='", activityList[i].EventType, "'> &nbsp; &nbsp;</span></div><div class='tl-section-hvr'>", activityList[i].EventDetails.Name, " ", activityList[i].EventDetails.Route, " ", activityList[i].EventDetails.Dose, "</div><div class='tl-section-hvr'><p>", edtimelinei18n.ADMINISTERED, ": ", activityList[i].DateTime.format("longDateTime3"), "</p></div></div> </div></td><td ><span class='tl-text-val'> ", activityList[i].EventDetails.Name, "</span></td> <td ><span class='tl-actv-text'> ", withinString, "</span></td></tr>");
                    break;
                case "meds-onf":
                case "meds-of":
                    etlArray.push("<tr id=tlActivityRow", activityList[i].ActivityId, componentId, " rel=", i, " class=", trclass, "><td><dl class='tl-info' ><dt> Activity List Item: </dt> <dd class='tl-actv-text  ", activityList[i].EventType, "'>&nbsp;&nbsp;</dd> </dl><h4 class='tl-hvr-hd'>Activity List Hover Item</h4><div class='hvr'><div class='tl-section-hvr-cont'><div class='tl-section-hvr'><span class='", activityList[i].EventType, "'> &nbsp; &nbsp;</span></div><div class='tl-section-hvr'>", activityList[i].EventDetails.Name, " ", activityList[i].EventDetails.Route, " ", activityList[i].EventDetails.Dose, " ", activityList[i].EventDetails.Freq, "</div><div class='tl-section-hvr'><p>", edtimelinei18n.ORDERED, ": ", activityList[i].DateTime.format("longDateTime3"), "</p></div></div> </div></td><td ><span class='tl-text-val'> ", activityList[i].EventDetails.Name, "</span></td> <td ><span class='tl-actv-text'> ", withinString, "</span></td></tr>");
                    break;
                    
                    
                    
                default:
                //do stuff
            
            }
        }
        etlArray.push("</table></div></div>");
    }
    
    function sortByDateReverseChron(a, b){
        var x = a.DateTime.getTime();
        var y = b.DateTime.getTime();
        return ((y < x) ? -1 : ((y > x) ? 1 : 0));
    }
    
    function sortByDateChron(a, b){
        var x = a.DateTime.getTime();
        var y = b.DateTime.getTime();
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }
    
    function sortByDateMeds(a, b){
        var x = a.SCHEDULE.ORIG_ORDER_DT_TM;
        var y = b.SCHEDULE.ORIG_ORDER_DT_TM;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }
    
    function sortByDateMedsAdmin(a, b){
        var x = a.ADMINISTRATION_DATE;
        var y = b.ADMINISTRATION_DATE;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }
    
    function Activity(dateTime, eventDetails, eventType, status, activityId, statusDate){
        this.DateTime = dateTime;
        this.EventDetails = eventDetails;
        this.EventType = eventType;
        this.ActivityId = activityId;
        this.Status = status;
        this.StatusDate = statusDate;
    }
    
    function DocumentEvent(type, author){
        this.Author = author;
        this.Type = type;
    }
    
    function MedicationEvent(name, route, dose, freq){
        this.Name = name;
        this.Route = route;
        this.Dose = dose;
        this.Freq = freq;
    }
    
    function LabResultEvent(name, lastParticipationStatus){
        this.Name = name;
        this.Participation = lastParticipationStatus;
    }
    function oc(a){
        var o = {};
        for (var i = 0; i < a.length; i++) {
            o[a[i]] = '';
        }
        return o;
    }
    
	function ResultSorter(a, b) {
		var aPart = getLatestParticipation(a);
		var bPart = getLatestParticipation(b);
		var aDate;
		var bDate;

		if(aPart) {
			aDate = aPart.DATE;
		} else {
			aDate = a.EFFECTIVE_DATE;
		}

		if(bPart) {
			bDate = bPart.DATE;
		} else {
			bDate = b.EFFECTIVE_DATE;
		}

		if(aDate > bDate) {
			return 1;
		} else if(aDate < bDate) {
			return -1;
		} else {
			return 0;
		}
	}

    function getLatestParticipation(result){
        var returnPart = null;
        for (var x = 0, xl = result.PARTICIPATIONS.length; x < xl; x++) {
            if (!returnPart || result.PARTICIPATIONS[x].DATE > returnPart.DATE) {
                returnPart = result.PARTICIPATIONS[x];
            }
        }
        
        return (returnPart);
    }
    function getLatestParticipationDate(result){
        var returnDate = null;
        for (var x = 0, xl = result.PARTICIPATIONS.length; x < xl; x++) {
            if (!returnDate || result.PARTICIPATIONS[x].DATE > returnDate.DATE) {
            
                returnDate = result.PARTICIPATIONS[x].DATE;
            }
            
        }
        if (!returnDate) {
            returnDate = result.EFFECTIVE_DATE;
        }
        
        return (returnDate);
    }

}();