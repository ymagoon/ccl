function ICUFlowsheetComponentStyle() {
	this.initByNamespace("icufs");
}

ICUFlowsheetComponentStyle.inherits(ComponentStyle);

function ICUFlowsheetComponent(criterion) {
	// Create variables to hold names for each tab
	this.vitalLabel = "";
	this.labLabel = "";
	this.respLabel = "";
	this.neuroLabel = "";
	this.endoLabel = "";
	// Create variables to hold event set codes for each item mapped
	this.tempCodes = "0.0";
	this.vitalCodes = "0.0";
	this.labCodes = "0.0";
	this.respCodes = "0.0";
	this.neuroCodes = "0.0";
	this.endoCodes = "0.0";
	this.m_hemoMultumClasses = null;
	this.hemoMultumClassIds = "0.0";
	this.hemoShowNonTitrate = false;
	this.m_respMultumClasses = null;
	this.respMultumClassIds = "0.0";
	this.respShowNonTitrate = false;
	this.m_neuroMultumClasses = null;
	this.neuroMultumClassIds = "0.0";
	this.neuroShowNonTitrate = false;
	this.m_endoMultumClasses = null;
	this.endoMultumClassIds = "0.0";
	this.endoShowNonTitrate = false;
	this.selectedTab = 1;
    this.setCriterion(criterion);
    this.setIncludeLineNumber(false);
	this.setScope(2);
    this.setStyles(new ICUFlowsheetComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.ICUFLOWSHEET.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.ICUFLOWSHEET.O1 - render component");
    this.setResourceRequired(true);
    this.shiftStrHour = null;
    this.isShift = null;
    this.sPrevious = null;      // handle previous button action in shift base view.
    this.sFirstShift = null;
    this.sNextButton = null;
    this.sNext = null;
	this.isScrollBarWidthSet = false;
	
    ICUFlowsheetComponent.method("getScrollBarWidthSet",function(){
		return this.isScrollBarWidthSet;
	});
	ICUFlowsheetComponent.method("setScrollBarWidthSet",function(value){
		this.isScrollBarWidthSet = value;
	});
    ICUFlowsheetComponent.method("InsertData", function(){
        CERN_ICUFLOWSHEET_O1.setFlowsheetLookBack(this);
        CERN_ICUFLOWSHEET_O1.callIcufsScript(this);
		CERN_ICUFLOWSHEET_O1.GetIcufsGraphSecData(this);
		CERN_ICUFLOWSHEET_O1.GetIcufsWtIOSecData(this);
    });

    ICUFlowsheetComponent.method("HandleSuccess", function(recordData){
        CERN_ICUFLOWSHEET_O1.RenderComponent(this, recordData);
    });
    ICUFlowsheetComponent.method("RetrieveRequiredResources", function(){
        var IO2GResource = MP_Resources.getSharedResource("IO2GShiftStart");
    	var criterion = this.getCriterion();
    	
    	//Case resource has already been created.  
    	if(IO2GResource){
    		//Check for availability
    		if(IO2GResource.isResourceAvailable()){ 
    			//Continue to load the component
    			this.getShiftStrHr(null, IO2GResource.getResourceData());
				return;
    		}
    		else{
    			//Kick off the resource retrieval
    			IO2GResource.retrieveSharedResourceData();
    			//Register for the shared resource reply
    			CERN_EventListener.addListener(this, "shiftStartHrInfoAvailable", this.getShiftStrHr, this);
    		}
    	}
    	else{
    		var scriptParams = ['^MINE^'];

    		IO2GResource = MP_Resources.createSharedResourceObj("IO2GShiftStart", this, "mp_retrieve_IO2G_prefs", scriptParams, "shiftStartHrInfoAvailable");
    		if(IO2GResource){
	    		IO2GResource.retrieveSharedResourceData();
	    		//Register for the Data availability event
    			CERN_EventListener.addListener(this, "shiftStartHrInfoAvailable", this.getShiftStrHr, this);
    		}
    	}       
    });ICUFlowsheetComponent.method("getShiftStrHr", function(element, caseData){
    	try{
	        var casesJSON = JSON.parse(caseData).RECORD_DATA;
            this.shiftStrHour = casesJSON.DAY_STR_HR;           
            this.InsertData();
		}
		catch(err){
			MP_Util.LogJSError(err, this, "icuflowsheet.js", "getShiftStrHr");
			var errMsg = [];
            errMsg.push("<strong>", i18n.JS_ERROR, "</strong><br><ul><li>", i18n.MESSAGE, ": ", err.message, "</li><li>", i18n.NAME, ": ", err.name, "</li><li>", i18n.NUMBER, ": ", (err.number & 0xFFFF), "</li><li>", i18n.DESCRIPTION, ": ", err.description, "</li></ul>");
            MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(), errMsg.join("")), this, "");
		}	             
    });
//CERTRN - ToDo - for future Bedrock default view timeframe
	ICUFlowsheetComponent.method("setDefaultTimeframe", function(value){this.m_timeframe = value;});
	ICUFlowsheetComponent.method("getDefaultTimeframe", function(){return (this.m_timeframe);});

	ICUFlowsheetComponent.method("setBPGraphTitle", function(value){this.m_bp_title = value;});
	ICUFlowsheetComponent.method("getBPGraphTitle", function(){return (this.m_bp_title);});
	
	
	// Getter/Setter methods for Vitals & Hemodynamics tab
	ICUFlowsheetComponent.method("setVitalLabel", function(value){this.vitalLabel = value;});
	ICUFlowsheetComponent.method("getVitalLabel", function(){return (this.vitalLabel);});
	ICUFlowsheetComponent.method("setHemoMultumClasses", function(value){if(!this.m_hemoMultumClasses){this.m_hemoMultumClasses = value;}});
	ICUFlowsheetComponent.method("setHemoMultumSeqClasses", function(value){
		var tempArr = value;
		var a=0, b=0;
		for(b=tempArr.length, a=0; b--; a++) {
			this.m_hemoMultumClasses[a] = tempArr[b];
		}
	});
	ICUFlowsheetComponent.method("getHemoMultumClasses", function(){return (this.m_hemoMultumClasses);});
	ICUFlowsheetComponent.method("setHemoNonTitrateInd", function(value){this.hemoShowNonTitrate = value;});
	ICUFlowsheetComponent.method("getHemoNonTitrateInd", function(){return this.hemoShowNonTitrate;});
	
	// Getter/Setter methods for Labs tab label
	ICUFlowsheetComponent.method("setLabLabel", function(value){this.labLabel = value;});
	ICUFlowsheetComponent.method("getLabLabel", function(){return (this.labLabel);});
	
	// Getter/Setter methods for Respiratory tab
	ICUFlowsheetComponent.method("setRespLabel", function(value){this.respLabel = value;});
	ICUFlowsheetComponent.method("getRespLabel", function(){return (this.respLabel);});
	ICUFlowsheetComponent.method("setRespMultumClasses", function(value){if(!this.m_respMultumClasses){this.m_respMultumClasses = value;}});
	ICUFlowsheetComponent.method("setRespMultumSeqClasses", function(value){
		var tempArr = value;
		var a=0, b=0;
		for(b=tempArr.length, a=0; b--; a++) {
			this.m_respMultumClasses[a] = tempArr[b];
		}
	});
	ICUFlowsheetComponent.method("getRespMultumClasses", function(){return (this.m_respMultumClasses);});
	ICUFlowsheetComponent.method("setRespNonTitrateInd", function(value){this.respShowNonTitrate = value;});
	ICUFlowsheetComponent.method("getRespNonTitrateInd", function(){return this.respShowNonTitrate;});
	
	// Getter/Setter methods for Neurology tab
	ICUFlowsheetComponent.method("setNeuroLabel", function(value){this.neuroLabel = value;});
	ICUFlowsheetComponent.method("getNeuroLabel", function(){return (this.neuroLabel);});
	ICUFlowsheetComponent.method("setNeuroMultumClasses", function(value){if(!this.m_neuroMultumClasses){this.m_neuroMultumClasses = value;}});
	ICUFlowsheetComponent.method("setNeuroMultumSeqClasses", function(value){
		var tempArr = value;
		var a=0, b=0;
		for(b=tempArr.length, a=0; b--; a++) {
			this.m_neuroMultumClasses[a] = tempArr[b];
		}
	});
	ICUFlowsheetComponent.method("getNeuroMultumClasses", function(){return (this.m_neuroMultumClasses);});
	ICUFlowsheetComponent.method("setNeuroNonTitrateInd", function(value){this.neuroShowNonTitrate = value;});
	ICUFlowsheetComponent.method("getNeuroNonTitrateInd", function(){return this.neuroShowNonTitrate;});
	
	// Getter/Setter methods for Endocrinology tab
	ICUFlowsheetComponent.method("setEndoLabel", function(value){this.endoLabel = value;});
	ICUFlowsheetComponent.method("getEndoLabel", function(){return (this.endoLabel);});
	ICUFlowsheetComponent.method("setEndoMultumClasses", function(value){if(!this.m_endoMultumClasses){this.m_endoMultumClasses = value;}});
	ICUFlowsheetComponent.method("setEndoMultumSeqClasses", function(value){
		var tempArr = value;
		var a=0, b=0;
		for(b=tempArr.length, a=0; b--; a++) {
			this.m_endoMultumClasses[a] = tempArr[b];
		}
	});
	ICUFlowsheetComponent.method("getEndoMultumClasses", function(){return (this.m_endoMultumClasses);});
	ICUFlowsheetComponent.method("setEndoNonTitrateInd", function(value){this.endoShowNonTitrate = value;});
	ICUFlowsheetComponent.method("getEndoNonTitrateInd", function(){return this.endoShowNonTitrate;});
	ICUFlowsheetComponent.method("setShiftSelected", function(value){this.isShift = value;});
	ICUFlowsheetComponent.method("getShiftSelected", function(){return this.isShift;});

}

ICUFlowsheetComponent.inherits(MPageComponent);

var CERN_ICUFLOWSHEET_O1 = function(){
	var bDttm = new Date();
	var eDttm = new Date();
	var anchorDttm = new Date();
	var columnCnt = 24;
	var curDtTmColumn = 0;
	var lbUnits = 0;
	var lbUnitsFlag = 0;
	var viewPage = 1;		//page to view w/lookback - 1 = current page/lookback of 8/12/24 hours
	var compObj = null;
	var sBeginDate = "";
	var sEndDate = "";
	var sAnchorDttm = "";
	var sIOAnchorDttm = "";
	var maxRenderCnt = 0;
	var totalRenderCnt = 0;
	var millisecondsPerHour = 3600000;

	anchorDttm.setMinutes(59);		//set minutes up to next hour
	anchorDttm.setSeconds(59);			//set clear seconds up to next hour
	anchorDttm.setMilliseconds(990);		//set milliseconds to next hour
	sIOAnchorDttm = CreateDateParameter(anchorDttm);
	anchorDttm.setMinutes(0);		//clear minutes
	anchorDttm.setSeconds(0);			//clear seconds
	anchorDttm.setMilliseconds(0);		//clear milliseconds
	anchorDttm.setHours(anchorDttm.getHours() + 1);			//move anchor hour upto next hour
	sAnchorDttm = CreateDateParameter(anchorDttm);
	return {

		setFlowsheetLookBack : function(component){			//set globals for all methods
			var dummyDate = new Date();
			dummyDate.setTime(anchorDttm.getTime());
			var dummyDate1 = new Date();
			dummyDate1.setTime(anchorDttm.getTime());
			/**
			 * If the time frame specified is the time frame in focus, returns a class indicating as much.
			 * 
			 * @param {int} optVal : The value of the specified time frame option
			 * @param {int} curTimeFrame : The time frame currently in focus
			 *
			 * @return {string} : The class name (or lack thereof) indicating whether the timeframe is in focus
			 */
			function getSelectedTimeFrameClass(optVal, curTimeFrame) {
				var tmFrmClass = "";
				// Check whether the value of the specified option matches the current time frame in focus
				if (optVal === curTimeFrame) {
					tmFrmClass = "icufs-opt-selected";
				}
				return tmFrmClass;
			}
			var icufsI18n = i18n.discernabu.icu_flowsheet_o1;
			var compId = component.getComponentId();
			// If accessed on page load (lbUnits = 0) obtain time frame from pref or use default.  Otherwise use time frame in context.
			if (!lbUnits) {  // Page load
				var curTimePref = component.getSelectedTimeFrame();
				// Set the time frame in focus to the value in the saved pref, if it exists
				if (curTimePref) {  // Pref exists, use value from pref
					component.setDefaultTimeframe(curTimePref);
					lbUnits = curTimePref;
				}
				else {  // No pref exists, use default value and save default to pref
					component.setDefaultTimeframe(24);
					lbUnits = 24;
					// Save to pref
					component.setSelectedTimeFrame(24);
					MP_Core.AppUserPreferenceManager.SaveCompPreferences(compId);
				}
			}
			else {  // Triggered by event, use timeframe in context
				lbUnits = component.getDefaultTimeframe();
			}
			
			lbUnitsFlag = 1;		//Flag  1 = Hours, 2 = Days, 3 = Weeks, 4 = Months , 5 = Years
			compObj = component;
			if (lbUnits === -1 && compObj.shiftStrHour!= null )
			{
			    bDttm.setTime(anchorDttm.getTime());
			    bDttm.setHours(0); //Set the very beginning of the day
                /* This flag would be used to select shift base time 
                   frame and 12 hour time frame as both these time frames
                    are 12 hours based
                */
                
                component.setShiftSelected("true");   
                if(viewPage === 1)
                {
                    dummyDate.setTime(anchorDttm.getTime() - millisecondsPerHour);
					dummyDate1.setTime(anchorDttm.getTime());
					dummyDate.setHours(dummyDate.getHours());
					dummyDate1.setHours(0);
					dummyDate1.setTime(dummyDate1.getTime() + millisecondsPerHour*(compObj.shiftStrHour+12));
					if(dummyDate.getTime() >= dummyDate1.getTime())
                    {
                        if( compObj.sNextButton )       // handle next button action
                        {
                            compObj.sNext ="true";
                            bDttm.setTime(bDttm.getTime() + millisecondsPerHour*compObj.shiftStrHour);
                        }else
                        {
                            bDttm.setTime(bDttm.getTime() + millisecondsPerHour*(compObj.shiftStrHour+12));
                            compObj.sPrevious ="true";      // flag to handle previous button action 
                        }
                        
                    }else
                    {
                        bDttm.setTime(bDttm.getTime() + millisecondsPerHour*compObj.shiftStrHour);
                    }
                     
                }else{
                    if(compObj.sPrevious)       // handle previous button action
                    {
                        bDttm.setTime(bDttm.getTime() + millisecondsPerHour*compObj.shiftStrHour);
                        compObj.sPrevious =null;
                        compObj.sFirstShift = "true";       // flag to enable <next> button for shift based view
                        viewPage--;     // decrement the viewPage count
                    }else{
                        bDttm.setTime(bDttm.getTime() + millisecondsPerHour*(compObj.shiftStrHour-(12*(viewPage-1))));
                     }
                }
			eDttm.setTime(bDttm.getTime() + 12*millisecondsPerHour);
			eDttm.setHours(eDttm.getHours());
			eDttm.setSeconds(eDttm.getSeconds() - 1);	//pull date/time back 1 sec. for proper display
			eDttm.setMilliseconds(99);	//pull date/time back 1 mill sec. for proper display
			sBeginDate = CreateDateParameter(bDttm);
			sEndDate = CreateDateParameter(eDttm);
			}else
			{
		        lbUnitsFlag = 1;		//Flag  1 = Hours, 2 = Days, 3 = Weeks, 4 = Months , 5 = Years
			    compObj = component;
				bDttm.setTime(anchorDttm.getTime() - (millisecondsPerHour*lbUnits * viewPage))
				bDttm.setHours(bDttm.getHours());
				eDttm.setTime(bDttm.getTime() + millisecondsPerHour*lbUnits);
				eDttm.setHours(eDttm.getHours());
			    eDttm.setSeconds(eDttm.getSeconds() - 1);	//pull date/time back 1 sec. for proper display
			    eDttm.setMilliseconds(99);	//pull date/time back 1 mill sec. for proper display
			    sBeginDate = CreateDateParameter(bDttm);
			    sEndDate = CreateDateParameter(eDttm);
			}
			curDtTmColumn = CERN_ICUFLOWSHEET_O1.findCurDtTmColumnIndex();
			
			// Determine time range for present data and display under component header
			var tempDt = new Date();  // Current date/time
			// If the present day and hour is in focus, use the current time as the end time; otherwise use the 59th minute of the initial load time's hour
			if (viewPage === 1) {  // Today
				var anchorHr = anchorDttm.getHours();
				var tempHr = tempDt.getHours();				
				// If the page was loaded between 00:00 and 00:59, change anchorHr from 0 to 24 for accurate "last hour" calculation
				if (anchorHr === 0) {
					anchorHr = 24;
				}
				// If the page was not loaded this hour, use the 59th minute of the original load time's hour
				// NOTE: anchorHr-1 is used to account for the original +1 adjustment of the anchor hour
				if (anchorHr-1 !== tempHr) {
					tempDt = eDttm;
				}
				if (lbUnits === -1)     // shift based time frame -- set shift end date as the end date
				{
				    tempDt = eDttm;
				}
			}
			else {  // Not today, use the 59th minute of the original load time's hour
				tempDt = eDttm;
			}
			/**
			 * Set the correct title for the 12 hour shift
			 */
			dummyDate.setTime(bDttm.getTime());
			dummyDate.setHours(0);
			dummyDate.setTime(dummyDate.getTime() + compObj.shiftStrHour*millisecondsPerHour);
			var curHoursBeg = parseInt(dummyDate.getHours(),10); //The hour mark showing the beginning of the current 12 hour shift (also, the end of the previous 12 hour shift)
			dummyDate1.setTime(dummyDate.getTime() + 12*millisecondsPerHour);
			var curHoursEnd = parseInt(dummyDate1.getHours(),10); //The hour mark showing the end of the current 12 hour shift
			var nextHoursBeg = curHoursEnd //These are essentially the same value 
			dummyDate1.setTime(dummyDate1.getTime() + 12*millisecondsPerHour); 
			var nextHoursEnd = parseInt(dummyDate1.getHours(),10); //The hour mark showing the end of the Next 12 hour shift

			if(curHoursBeg < 10){
				curHoursBeg = "0" + curHoursBeg;
			}
			if(curHoursEnd < 10){
				curHoursEnd = "0" + curHoursEnd;
				nextHoursBeg = curHoursEnd;
			}
			if(nextHoursEnd < 10){
				nextHoursEnd = "0" + nextHoursEnd;
			}
			// Replace the "sub title" (text below the component header) with the time range in focus and view hour links
			var viewHoursSelectHTML = "<span class='icufs-tmfrm-lbl'>" + icufsI18n.HOURLY_TIME_FRAMES + ":</span><div class='icufs-tmfrm-opts'><a class='icufs-tmfrm-opt " +
				getSelectedTimeFrameClass(2, lbUnits) + "' onclick='CERN_ICUFLOWSHEET_O1.selectViewTime(2," + compId + "); return false;' href='#'>2</a><a class='icufs-tmfrm-opt " + 
				getSelectedTimeFrameClass(4, lbUnits) + "' onclick='CERN_ICUFLOWSHEET_O1.selectViewTime(4," + compId + "); return false;' href='#'>4</a><a class='icufs-tmfrm-opt " +
				getSelectedTimeFrameClass(8, lbUnits) + "' onclick='CERN_ICUFLOWSHEET_O1.selectViewTime(8," + compId + "); return false;' href='#'>8</a><a class='icufs-tmfrm-opt " +
				getSelectedTimeFrameClass(12, lbUnits) + "' onclick='CERN_ICUFLOWSHEET_O1.selectViewTime(12," + compId + "); return false;' href='#'>12</a><a class='icufs-tmfrm-opt " +
				getSelectedTimeFrameClass(24, lbUnits) + "' onclick='CERN_ICUFLOWSHEET_O1.selectViewTime(24," + compId + "); return false;' href='#'>24</a>";
				if (compObj.shiftStrHour !== null)       // display shift details only if shift start hour is available
				{
				    viewHoursSelectHTML = viewHoursSelectHTML+"<a class='icufs-tmfrm-opt " +
				    getSelectedTimeFrameClass(-1,lbUnits) + "' onclick='CERN_ICUFLOWSHEET_O1.selectShiftViewTime(-1,"+ compId + "); return false;' href='#' title='"+curHoursBeg+":00"+" - "+curHoursEnd+":00\n"+nextHoursBeg+":00"+" - "+nextHoursEnd+":00'>"+icufsI18n.TWELVE_HOUR_SHIFT+"</a></div>";
				}else
	    			{
			                viewHoursSelectHTML = viewHoursSelectHTML+"</div>";
				}
			MP_Util.Doc.ReplaceSubTitleText(component, (bDttm.format("longDateTime3") + " - " + tempDt.format("longDateTime3") + viewHoursSelectHTML));
		},
		
		GetIcufsGraphSecData : function(component){
			var sendArr = [];
			var criterion = component.getCriterion();
			var heartRateCds = "0.0";
			var invSystolicCds = "0.0";
			var invDiastolicCds = "0.0";
			var nonInvSystolicCds = "0.0";
			var nonInvDiastolicCds = "0.0";
			var invMapCds = "0.0";
			var nonInvMapCds = "0.0";
			var bpItemCnt = 6;
			var seriesItemCnt = 1;

            var brGroups = component.getGroups();  // Event Set Code Groups
            var brGroupLen = brGroups.length;

			// Associate event set codes to the appropriate items
			for (var i=brGroupLen; i--;) {
				var curGroup = brGroups[i];
				var curCodes = curGroup.getEventSets();  // All event set codes for group
				var groupName = curGroup.getGroupName();  // Group name from Bedrock
				// Assign all event set codes for a group to the appropriate variable in value(*) format
				switch(groupName) {
					case "HR_CE":
						heartRateCds = "value(" + curCodes.join(".0,") + ".0)";
						break;
					case "BP_GRAPH_SYS_NONINVASIVE":
						nonInvSystolicCds = "value(" + curCodes.join(".0,") + ".0)";
						break;
					case "BP_GRAPH_DIAS_NONINVASIVE":
						nonInvDiastolicCds = "value(" + curCodes.join(".0,") + ".0)";
						break;
					case "BP_GRAPH_MAP_CUFF":
						nonInvMapCds = "value(" + curCodes.join(".0,") + ".0)";
						break;
					case "BP_GRAPH_SYS_INVASIVE":
						invSystolicCds = "value(" + curCodes.join(".0,") + ".0)";
						break;
					case "BP_GRAPH_DIAS_INVASIVE":
						invDiastolicCds = "value(" + curCodes.join(".0,") + ".0)";
						break;
					case "BP_GRAPH_MAP_INVASIVE":
						invMapCds = "value(" + curCodes.join(".0,") + ".0)";
						break;
					default:
						// Do nothing
				}
			}

			sendArr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", criterion.ppr_cd + ".0",
			1000, "^"+sBeginDate+"^", "^"+sEndDate+"^", bpItemCnt, seriesItemCnt, invSystolicCds, invDiastolicCds, nonInvSystolicCds,
			nonInvDiastolicCds, invMapCds, nonInvMapCds, heartRateCds);
			var request = new MP_Core.ScriptRequest(component, "ENG:MPG.ICUFLOWSHEET.O1 - load ICU Flowsheet graph section");
			request.setParameters(sendArr);
			request.setName("GetIcufsGraphSecData");
			request.setProgramName("MP_RETRIEVE_FLOWSHEET_BP");
			MP_Core.XMLCCLRequestCallBack(component, request, CERN_ICUFLOWSHEET_O1.RenderIcufsGraphSec);
		},

		GetIcufsWtIOSecData : function(component){
			var sendArr = [];
			var criterion = component.getCriterion();
			var weightCds = "0.0";
            var brGroups = component.getGroups();  // Event Set Code Groups
            var brGroupLen = brGroups.length;

			// Associate event set codes to the appropriate items
			for (var i=brGroupLen; i--;) {
				var curGroup = brGroups[i];
				var curCodes = curGroup.getEventSets();  // All event set codes for group
				var groupName = curGroup.getGroupName();  // Group name from Bedrock
				// Assign all event set codes for a group to the appropriate variable in value(*) format
				if(groupName === "WT_CE") {
						weightCds = "value(" + curCodes.join(".0,") + ".0)";
				}
			}

			sendArr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", criterion.ppr_cd + ".0",
			1000, "^"+sIOAnchorDttm+"^", weightCds);
			var request = new MP_Core.ScriptRequest(component, "ENG:MPG.ICUFLOWSHEET.O1 - load ICU Flowsheet weight and IO section");
			request.setParameters(sendArr);
			request.setName("GetIcufsWtIOSecData");
			request.setProgramName("MP_RETRIEVE_FLOWSHEET_WT_IO");
			MP_Core.XMLCCLRequestCallBack(component, request, CERN_ICUFLOWSHEET_O1.RenderIcufsWtIOSec);
		},

		RenderIcufsWtIOSec : function(reply)
		{
			var icufsI18n = i18n.discernabu.icu_flowsheet_o1;
			var component = reply.getComponent();
			var compId = component.getComponentId();
			var wtIOLine = _g("icufsWtIOLine" + compId);
			if (reply.getStatus() === "S") {
				var recordData = reply.getResponse();
				var criterion = component.getCriterion();
				var	strHTML = "";
				var	jsHTML = []; 
				/************************* Create HTML *******************************/
				
 				var nf = MP_Util.GetNumericFormatter();
 				var viewerLink = "";
 				var recWeightToday = recordData.WEIGHT_TODAY;
 				var recWeightPrevious = recordData.WEIGHT_PREVIOUS;
 				var recWeightAdmit = recordData.WEIGHT_ADMIT;
 				var recPrevNetIO = recordData.PREV_TIMEFRAME_NETIO;
 				var recTotalNetIO = recordData.TOTAL_NETIO;
 				var todayWeight = (recWeightToday.TYPE_FLAG === 1)?nf.format(recWeightToday.VAL_RAW, "^."+recWeightToday.PREC):recWeightToday.VALUE;
 				var todayWeightUOM = recWeightToday.VALUE_UNITS;
 				var prevWeight = (recWeightPrevious.TYPE_FLAG === 1)?nf.format(recWeightPrevious.VAL_RAW, "^."+recWeightPrevious.PREC):recWeightPrevious.VALUE;
				var prevWeightUOM = recWeightPrevious.VALUE_UNITS;
 				var admitWeight = (recWeightAdmit.TYPE_FLAG === 1)?nf.format(recWeightAdmit.VAL_RAW, "^."+recWeightAdmit.PREC):recWeightAdmit.VALUE;
				var admitWeightUOM = recWeightAdmit.VALUE_UNITS;
 				var prevIOTotal = (recPrevNetIO.VALUE === "--")?recPrevNetIO.VALUE:recPrevNetIO.VALUE_IND + nf.format(recPrevNetIO.VAL_RAW, "^."+null);
 				var prevIOTotalHover = (recPrevNetIO.VALUE === "--")?recPrevNetIO.VALUE:recPrevNetIO.VALUE_IND + nf.format(recPrevNetIO.VAL_RAW, "^."+null) + recPrevNetIO.VALUE_UNITS;
 				var admitIOTotal = (recTotalNetIO.VALUE === "--")?recTotalNetIO.VALUE:recTotalNetIO.VALUE_IND + nf.format(recTotalNetIO.VAL_RAW, "^."+null);
 				var admitIOTotalHover = (recTotalNetIO.VALUE === "--")?recTotalNetIO.VALUE:recTotalNetIO.VALUE_IND + nf.format(recTotalNetIO.VAL_RAW, "^."+null) + recTotalNetIO.VALUE_UNITS;
 				var tempDate = "";
				var df = MP_Util.GetDateFormatter();
				
				var prevIOTotalNorm = "res-normal";
				if(recPrevNetIO.VALUE_IND === "-"){
					prevIOTotalNorm = "res-severe";
				}
				
				var admitIOTotalNorm = "res-normal";
				if(recTotalNetIO.VALUE_IND === "-"){
					admitIOTotalNorm = "res-severe";
				}
				
				var resModified = (recWeightToday.MODIFIED_FLAG > 0)? "<span class='res-modified'>&nbsp;</span>" : "";
				if(todayWeight !== "--"){
					viewerLink = CERN_ICUFLOWSHEET_O1.createViewerLink(criterion.person_id, recWeightToday.EVENT_ID, todayWeight+"<span class='unit'>"+todayWeightUOM+"</span>");
				}else{
					viewerLink = todayWeight;
				}
				jsHTML.push("<dl class='icufs-info icufs-result-line-wt-data'><dt class='icufs-wt-name'><span>",
					icufsI18n.TODAY_WEIGHT, ":</span></dt><dd class='icufs-wt-result'><span>", viewerLink, "</span>", resModified, "</dd></dl>");
				if(todayWeight !== "--"){		//add hover for date
					tempDate = "";
					if (recWeightToday.EFFECTIVE_DATE !== "") {
						tempDate = df.formatISO8601(recWeightToday.EFFECTIVE_DATE, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
					}
					jsHTML.push("<h4 class='det-hd'><span>", icufsI18n.DETAILS, ":</span></h4><div class='hvr'><dl class='icufs-det'><dt><span>",
						icufsI18n.TYPE, ":</span></dt><dd class='icufs-det-name'><span>", recWeightToday.NAME, "</span></dd><dt><span>",
						icufsI18n.DATE_TIME, ":</span></dt><dd class='icufs-det-dt'><span>", tempDate, "</span></dd><dt><span>",
						icufsI18n.STATUS, ":</span></dt><dd class='icufs-det-status'><span>", recWeightToday.STATUS, "</span></dd></dl></div>");
				}

				resModified = (recWeightPrevious.MODIFIED_FLAG > 0)? "<span class='res-modified'>&nbsp;</span>" : "";
				if(prevWeight !== "--"){
					viewerLink = CERN_ICUFLOWSHEET_O1.createViewerLink(criterion.person_id, recWeightPrevious.EVENT_ID, prevWeight+"<span class='unit'>"+prevWeightUOM+"</span>");
				}else{
					viewerLink = prevWeight;
				}
				jsHTML.push("<dl class='icufs-info icufs-result-line-wt-data'><dt class='icufs-wt-name'><span>",
					icufsI18n.PREV_WEIGHT, ":</span></dt><dd class='icufs-wt-result'><span>", viewerLink, "</span>", resModified, "</dd></dl>");
				if(prevWeight !== "--"){		//add hover for date
					tempDate = "";
					if (recWeightPrevious.EFFECTIVE_DATE !== "") {
						tempDate = df.formatISO8601(recWeightPrevious.EFFECTIVE_DATE, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
					}
					jsHTML.push("<h4 class='det-hd'><span>", icufsI18n.DETAILS, ":</span></h4><div class='hvr'><dl class='icufs-det'><dt><span>",
						icufsI18n.TYPE, ":</span></dt><dd class='icufs-det-name'><span>", recWeightPrevious.NAME, "</span></dd><dt><span>",
						icufsI18n.DATE_TIME, ":</span></dt><dd class='icufs-det-dt'><span>", tempDate, "</span></dd><dt><span>",
						icufsI18n.STATUS, ":</span></dt><dd class='icufs-det-status'><span>", recWeightPrevious.STATUS, "</span></dd></dl></div>");
				}

				resModified = (recWeightAdmit.MODIFIED_FLAG > 0)? "<span class='res-modified'>&nbsp;</span>" : "";
				if(admitWeight !== "--"){
					viewerLink = CERN_ICUFLOWSHEET_O1.createViewerLink(criterion.person_id, recWeightAdmit.EVENT_ID, admitWeight+"<span class='unit'>"+admitWeightUOM+"</span>");
				}else{
					viewerLink = admitWeight;
				}
				jsHTML.push("<dl class='icufs-info icufs-result-line-wt-data'><dt class='icufs-wt-name'><span>",
					icufsI18n.ADMIT_WEIGHT, ":</span></dt><dd class='icufs-wt-result'><span>", viewerLink, "</span>", resModified, "</dd></dl>");
				if(admitWeight !== "--"){		//add hover for date
					tempDate = "";
					if (recWeightAdmit.EFFECTIVE_DATE !== "") {
						tempDate = df.formatISO8601(recWeightAdmit.EFFECTIVE_DATE, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
					}
					jsHTML.push("<h4 class='det-hd'><span>", icufsI18n.DETAILS, ":</span></h4><div class='hvr'><dl class='icufs-det'><dt><span>",
						icufsI18n.TYPE, ":</span></dt><dd class='icufs-det-name'><span>", recWeightAdmit.NAME, "</span></dd><dt><span>",
						icufsI18n.DATE_TIME, ":</span></dt><dd class='icufs-det-dt'><span>", tempDate, "</span></dd><dt><span>",
						icufsI18n.STATUS, ":</span></dt><dd class='icufs-det-status'><span>", recWeightAdmit.STATUS, "</span></dd></dl></div>");
				}

				var tempBeginDtTm = "";
				var tempEndDtTm = "";
				var timeFrame = "";
				jsHTML.push("<dl class='icufs-info icufs-result-line-io-data'><dt class='icufs-io-name'><span>",
					icufsI18n.FLUID_BALANCE, ":</span></dt><dd class='icufs-io-result'><span class='", prevIOTotalNorm, "'>", prevIOTotal, "</span>", "<span class='unit'>",
					icufsI18n.YESTERDAY, "</span>", "</dd></dl>");
				if(prevIOTotal !== "--"){		//add hover for date range
					tempBeginDtTm = "";
					tempEndDtTm = "";
					timeFrame = "";
					if (recPrevNetIO.BEGIN_DATE_TIME !== "") {
						tempBeginDtTm = df.formatISO8601(recPrevNetIO.BEGIN_DATE_TIME, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
						tempEndDtTm = df.formatISO8601(recPrevNetIO.END_DATE_TIME, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
						timeFrame = tempBeginDtTm + " - " + tempEndDtTm;
					}
					jsHTML.push("<h4 class='det-hd'><span>", icufsI18n.DETAILS, ":</span></h4><div class='hvr'><dl class='icufs-det'><dt><span>",
						icufsI18n.FLUID_BALANCE, ":</span></dt><dd class='icufs-det-dt'><span class='", prevIOTotalNorm, "'>", prevIOTotalHover, "</span></dd><dt><span>",
						icufsI18n.TIME_FRAME, ":</span></dt><dd class='icufs-det-dt'><span>", timeFrame, "</span></dd></dl></div>");
				}
    
				jsHTML.push("<dl class='icufs-info icufs-result-line-io-data'><dt class='icufs-io-name'><span>",
					icufsI18n.FLUID_BALANCE, ":</span></dt><dd class='icufs-io-result'><span class='", admitIOTotalNorm, "'>", admitIOTotal, "</span>", "<span class='unit'>",
					icufsI18n.SINCE_ADMISSION, "</span>", "</dd></dl>");
				if(admitIOTotal !== "--"){		//add hover for date range
					tempBeginDtTm = "";
					tempEndDtTm = "";
					timeFrame = "";
					if (recTotalNetIO.BEGIN_DATE_TIME !== "") {
						tempBeginDtTm = df.formatISO8601(recTotalNetIO.BEGIN_DATE_TIME, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
						tempEndDtTm = df.formatISO8601(recTotalNetIO.END_DATE_TIME, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
						timeFrame = tempBeginDtTm + " - " + tempEndDtTm;
					}
					jsHTML.push("<h4 class='det-hd'><span>", icufsI18n.DETAILS, ":</span></h4><div class='hvr'><dl class='icufs-det'><dt><span>",
						icufsI18n.FLUID_BALANCE, ":</span></dt><dd class='icufs-det-dt'><span class='", admitIOTotalNorm, "'>", admitIOTotalHover, "</span></dd><dt><span>",
						icufsI18n.TIME_FRAME, ":</span></dt><dd class='icufs-det-dt'><span>", timeFrame, "</span></dd></dl></div>");
				}
				strHTML = jsHTML.join("");
				wtIOLine.innerHTML = strHTML;
				// Initialize hovers
				MP_Util.Doc.InitHovers("icufs-info", wtIOLine, component);
			}else{
				wtIOLine.innerHTML = "<span class='res-none'>"+icufsI18n.ERROR_RET_RESULTS+"</span>";
			}
			totalRenderCnt += 1;
			MP_FLWSHT_GRAPHS.resizeGraph("#flwshtBPGraph" + compId,compId);
		},

		RenderIcufsGraphSec : function(reply)
		{
			var icufsI18n = i18n.discernabu.icu_flowsheet_o1;
			var component = reply.getComponent();
			var compId = component.getComponentId();
			var graphData = MP_FLWSHT_GRAPHS.getGraphDataByComponentId(compId);
			var graphLegend = _g("flwshtBPSelect" + compId);
			var bpTitle = component.getBPGraphTitle();
			var df = MP_Util.GetDateFormatter();
			if (reply.getStatus() === "S") {
				var recordData = reply.getResponse();
				var criterion = component.getCriterion();
				var	strHTML = "";
				var	jsHTML = []; 
				var	graph_data = recordData.GRAPH_DATA.QUAL;
				var	graph_data_cnt = recordData.GRAPH_DATA.QUAL_CNT;
				var normClass = "";					

				/************************* Prepare Data ******************************/
				var bpData = [[[]],[[]],[[]],[[]],[[]],[[]],[[]]], prevSeq = -1;
				bpData[0].push([]);
				bpData[0][1].push({label:"",uom:""});
				bpData[1].push([]);
				bpData[1][1].push({label:"",uom:""});
				bpData[2].push([]);
				bpData[2][1].push({label:"",uom:""});
				bpData[3].push([]);
				bpData[3][1].push({label:"",uom:""});
				bpData[4].push([]);
				bpData[4][1].push({label:"",uom:""});
				bpData[5].push([]);
				bpData[5][1].push({label:"",uom:""});
				bpData[6].push([]);
				bpData[6][1].push({label:"",uom:""});

				for (var i=0,tmlnLen=graph_data.length;i<tmlnLen;i++)
				{
					var vDate = new Date();
					vDate.setISO8601(graph_data[i].EVAL_EVENT_END_DT_TM_UTC);
					var formattedDate = df.format(vDate, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
					normClass = CERN_ICUFLOWSHEET_O1.getNormalcyClass(graph_data[i].NORMALCY_MEAN);
					var	valueStr = "<span class='"+normClass+"'><span class='res-ind'>&nbsp;</span><span class='res-value'>"+graph_data[i].VALUE+"</span></span>";
					var	normalcyStr = "<br /><span class='icufs-bp-range-txt'>"+icufsI18n.NORMAL_LOW+":</span>&nbsp;"+graph_data[i].NORMAL_LOW;
						normalcyStr += "<br /><span class='icufs-bp-range-txt'>"+icufsI18n.NORMAL_HIGH+":</span>&nbsp;"+graph_data[i].NORMAL_HIGH;
						normalcyStr += "<br /><span class='icufs-bp-range-txt'>"+icufsI18n.CRITICAL_LOW+":</span>&nbsp;"+graph_data[i].CRITICAL_LOW;
						normalcyStr += "<br /><span class='icufs-bp-range-txt'>"+icufsI18n.CRITICAL_HIGH+":</span>&nbsp;"+graph_data[i].CRITICAL_HIGH;
					var	statusStr = "<br /><span class='icufs-bp-range-txt'>"+icufsI18n.STATUS+":</span>&nbsp;"+graph_data[i].STATUS;
					var unitDisp = (graph_data[i].VALUE_UNITS !== "")?[" (",graph_data[i].VALUE_UNITS,")"].join(""):"";
					var dateDisp = [formattedDate.toString()].join("");
					var bpSeq = (parseInt(graph_data[i].VALUE_SEQ, 10) - 1);
					if (prevSeq != bpSeq)
					{
						switch (bpSeq) {
							case 0: // Invasive Systolic
								bpData[bpSeq][1].label = icufsI18n.SBP;
								bpData[bpSeq][1].uom = unitDisp;
								break;
							case 1: // Invasive Diastolic
								bpData[bpSeq][1].label = icufsI18n.DBP;
								bpData[bpSeq][1].uom = unitDisp;
								break;
							case 2: // Non-Invasive Systolic
								bpData[bpSeq][1].label = icufsI18n.SBP;
								bpData[bpSeq][1].uom = unitDisp;
								break;
							case 3: // Non-Invasive Diastolic
								bpData[bpSeq][1].label = icufsI18n.DBP;
								bpData[bpSeq][1].uom = unitDisp;
								break;
							case 4: // Invasive MAP
								bpData[bpSeq][1].label = icufsI18n.MAP;
								bpData[bpSeq][1].uom = unitDisp;
								break;
							case 5: // Non-Invasive MAP
								bpData[bpSeq][1].label = icufsI18n.MAP;
								bpData[bpSeq][1].uom = unitDisp;
								break;
							case 6: // Heart Rate
								bpData[bpSeq][1].label = icufsI18n.HEART_RATE;
								bpData[bpSeq][1].uom = unitDisp;
								break;
						}
						prevSeq = bpSeq;
					}
					bpData[bpSeq][0].push([vDate.getTime(),graph_data[i].VALUE,valueStr,normalcyStr,statusStr,"",graph_data[i].CLINSIG_UPDT_DT_TM,dateDisp,graph_data[i].EVENT_END_DT_TM]);
				}
			
				var iMinDate = new Date();
				iMinDate.setISO8601(recordData.GRAPH_DATA.MIN_DT_TM_UTC);
				var iMaxDate = new Date();
				iMaxDate.setISO8601(recordData.GRAPH_DATA.MAX_DT_TM_UTC);
				if(lbUnits === -1)
				{
				    lbUnits= 12;
				}
				DAR_HELPERS.minuteCntPerTickSpecial = lbUnits * 60/columnCnt; //column width in minutes and flag for special JQPlot tick rendering
				var tickStr = DAR_HELPERS.minuteCntPerTickSpecial + " minutes";
				/* setting up axis options */
				var yAxis = {autoscale: true, numberTicks: 6, ticks:[], tickInterval: null, tickOptions: {fontSize: 12,textColor: "#000000",mark:'outside',showGridline:true, gridStyle:'dashed', weight: 1.0, color: "#000000"}, pad: 10, min: null, max: null};
				var x2Axis = {show: true, autoscaleOnZoom:false, useSeriesColor:false, renderer: $.jqplot.DateAxisRenderer, labelRenderer: $.jqplot.CanvasAxisLabelRenderer, tickOptions: {textColor: "#000000",weight: 1.0, color: "#000000", fontSize: 12,mark:'outside',showGridline:true}, useDST: false, specialFormat: true, specialFormatFlag: 3, autoscale: false, tickInterval: tickStr, pad: 1, min: iMinDate, max: iMaxDate};
				
				/************************ Create Graph
				* @param {String} iId: DOM Id of main graph. REQUIRED
				* @param {String} iRBtns: DOM Id of radio button select. If null or blank, then it is not shown
				* @param {String} assignedTo: variable name that this function is going to return the "plot" to.
				* @param {Array} iDataSeries: format [[[[xData,yData,normLowHTML,normHighHTML,critLowHTML,critHighHTML]],seriesOptionObject (see jqPlotOptions.txt => seriesDefault)]]
				* @param {Object} iX1AxisObj: x Axis 1 Options object. Will be on bottom of graph. Null will not show axis. (see jqPlotOptions.txt => axesDefault)
				* @param {Object} iX2AxisObj: x Axis 2 Options object. Will be on top of graph. REQUIRED. (see jqPlotOptions.txt => axesDefault)
				* @param {Object} iYAxisObj: y Axis 1 Options object. Will be to the left of graph. REQUIRED. (see jqPlotOptions.txt => axesDefault)
				* @param {Object} iY2AxisObj: y Axis 2 Options object. Will be to the right of graph. (see jqPlotOptions.txt => axesDefault)
				*****************************/
				graphData.gPlots.push(MP_FLWSHT_GRAPHS.drawWhiskerGraph( compId, "flwshtBPGraph" + compId, "flwshtBPSelect" + compId, ["MP_FLWSHT_GRAPHS.getGraphDataByComponentId(" + compId + ").gPlots[",graphData.gPlots.length,"]"].join(""), bpData, null, x2Axis, yAxis, null));
				if (bpData[0][0].length === 0 && bpData[1][0].length === 0 && bpData[2][0].length === 0 && bpData[3][0].length === 0 && bpData[4][0].length === 0 && bpData[5][0].length === 0 && bpData[6][0].length === 0){
					graphLegend.innerHTML = MP_Util.HandleNoDataResponse("");
				}
			}else{			//problem
				graphLegend.innerHTML = MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(),"");
			}
			totalRenderCnt += 1;
		},

        callIcufsScript: function(component){
            var sendAr = [];  // Params for script
            var criterion = component.getCriterion();

            var brGroups = component.getGroups();  // Event Set Code Groups
            var brGroupLen = brGroups.length;

			// Associate event set codes to the appropriate items
			for (var i=brGroupLen; i--;) {
				var curGroup = brGroups[i];
				var curCodes = curGroup.getEventSets();  // All event set codes for group
				var groupName = curGroup.getGroupName();  // Group name from Bedrock
				// Assign all event set codes for a group to the appropriate variable in value(*) format
				switch(groupName) {
					case "TEMP_CE":
						component.tempCodes = "value(" + curCodes.join(".0,") + ".0)";
						break;
					case "VITALS_HEMO_CE":
						component.vitalCodes = "value(" + curCodes.join(".0,") + ".0)";
						break;
					case "LAB_ES":
						component.labCodes = "value(" + curCodes.join(".0,") + ".0)";
						break;
					case "RESPIRATORY_CE":
						component.respCodes = "value(" + curCodes.join(".0,") + ".0)";
						break;
					case "NEURO_CE":
						component.neuroCodes = "value(" + curCodes.join(".0,") + ".0)";
						break;
					case "ENDO_CE":
						component.endoCodes = "value(" + curCodes.join(".0,") + ".0)";
						break;						
					default:
						// Do nothing
				}
			}
			//Cont. Meds.
			component.hemoMultumClassIds = (component.getHemoMultumClasses() !== null) ? "value(" + component.getHemoMultumClasses().join(".0,") + ".0)" : "0.0";
			component.respMultumClassIds = (component.getRespMultumClasses() !== null) ? "value(" + component.getRespMultumClasses().join(".0,") + ".0)" : "0.0";
			component.neuroMultumClassIds = (component.getNeuroMultumClasses() !== null) ? "value(" + component.getNeuroMultumClasses().join(".0,") + ".0)" : "0.0";
			component.endoMultumClassIds = (component.getEndoMultumClasses() !== null) ? "value(" + component.getEndoMultumClasses().join(".0,") + ".0)" : "0.0";

			// Temporary implementation - Call RenderComponent method manually
			CERN_ICUFLOWSHEET_O1.RenderComponent(component, "Dummy Data");  // Temp for rendering component
        },
        
        RenderComponent: function(component, recordData){
			var icufsI18n = i18n.discernabu.icu_flowsheet_o1;
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
			
            try {
				var compId = component.getComponentId();
				var crit=component.getCriterion();
				// Create tabbed flowsheet and append to HTML after graph
				var sHTML = createFlowsheet();
				MP_Util.Doc.FinalizeComponent(sHTML,component,"");
				var thisFs = _g("icufsTabCont" + compId);
				// Retrieve selected tab information from prefs, if one exists
				var curTabPref = component.getSelectedDataGroup();
				if (curTabPref) {
					component.selectedTab = curTabPref;
				}
				// Associate appropriate click events to "tabs"
				initTabs(thisFs);
					
				/**
				 * Create the framework for the ICU Flowsheet
				 *
				 * @return {string} : The HTML for the flowsheet framework
				 */
				function createFlowsheet(){
					var fsHTML = [];
					var pnHTML = "";
					var subSecTgl = "";
					var bpTitle = component.getBPGraphTitle();
					if (viewPage > 1 || component.sFirstShift || component.sNext) {
						pnHTML = "<tr><th class='prev-next'>&lt;<a onclick='CERN_ICUFLOWSHEET_O1.scrollData(\"+\","+compId+",null); return false;' href='#'><span>" + icufsI18n.PREVIOUS + "</span></a>&nbsp;|&nbsp;" +
							"<a onclick='CERN_ICUFLOWSHEET_O1.scrollData(\"-\","+compId+",true); return false;' href='#'><span>" + icufsI18n.NEXT + "</span></a>&gt;</th></tr>";
							component.sFirstShift =null;
							component.sNext = null;
					}
					else {
						pnHTML = "<tr><th class='prev-next'>&lt;<a onclick='CERN_ICUFLOWSHEET_O1.scrollData(\"+\","+compId+",null); return false;' href='#'><span>" +
							icufsI18n.PREVIOUS + "</span></a>&nbsp;|&nbsp;<span>" + icufsI18n.NEXT + "</span>&gt;</th></tr>";
					}
					
					var jsonObject={};
					jsonObject.user_prefs={};
					var userPrefs=jsonObject.user_prefs;

					fsHTML.push("<div class='icufs'><div class='icufs-graph-cont' id='icufsGraphCont", compId, "'>",
							"<div class='icufs-result-line' id='icufsWtIOLine", compId, "'>", icufsI18n.LOADING, "...</div><div class='",subSecTgl,"sub-sec'><h3 class='sub-sec-hd'>",
							"<a class='icufs-rst-zoom-btn' onclick='MP_FLWSHT_GRAPHS.resetZoom(", compId, "); return false;' href='#'><span>",icufsI18n.RESET_ZOOM,"</span></a>","<span class='sub-sec-title'>",bpTitle,
							"</h3><div class='sub-sec-content icufs-bp-backgrnd' id='flwshtBPSection",compId,
							"'><ul class='icufs-v-graph'><li class='icufs-legend'><div class='icufs-bpselect' id='flwshtBPSelect",compId,"'>", icufsI18n.LOADING,
							"...</div></li><li><div class='icufs-bpgraph' id='flwshtBPGraph",compId,
							"'></div></li></ul></div></div></div><div class='icufs-temp-table-sec'><div class='icufs-temp-cont' id='icufsTemperatureCont", compId,
							"'></div></div><div class='icufs-tab-cont' id='icufsTabCont", compId, "'><div class='icufs-tab-hd'><span class='icufs-tab-item icufs-tab1'>",
							component.getVitalLabel(), "</span><span class='icufs-tab-item icufs-tab2'>", component.getLabLabel(), "</span><span class='icufs-tab-item icufs-tab3'>",
							component.getRespLabel(), "</span><span class='icufs-tab-item icufs-tab4'>", component.getNeuroLabel(), "</span><span class='icufs-tab-item icufs-tab5'>",
							component.getEndoLabel(), "</span></div><div class='icufs-tab-body'><div class='icufs-tab-data icufs-data1 icufs-list-tab'><table class='icufs-table icufs-evt-tbl'>",
							CERN_ICUFLOWSHEET_O1.constructTimeHdrRow(), "</table><div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl'>&nbsp;</span><span class='sub-sec-title'>",
							icufsI18n.HEMODYNAMICS, "</span></h3><div class='sub-sec-content icufs-vs-data'>", icufsI18n.LOADING, "...</div></div>",
							//Cont. Meds.
							"<div id='contMed' class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl'>&nbsp;</span><span class='sub-sec-title'>",
							icufsI18n.CONTINUOUS_MEDICATIONS, "</span></h3><div class='sub-sec-content icufs-hemo-medadmin-data'>", icufsI18n.LOADING, "...</div></div>",
							"<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl'>&nbsp;</span><span class='sub-sec-title'>", icufsI18n.I_AND_O, "</span></h3><div class='sub-sec-content icufs-io-data'>", icufsI18n.LOADING, "...</div></div>",
							"</div><div class='icufs-tab-data icufs-data2 icufs-group-tab'>", icufsI18n.LOADING, "...</div>",
							"<div class='icufs-tab-data icufs-data3 icufs-list-tab'><div class='sub-sec-content icufs-event-data3'>", icufsI18n.LOADING, "...</div>",
							//Cont. Meds.
							"<div id='contMedTab1' class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl'>&nbsp;</span><span class='sub-sec-title'>",
							icufsI18n.CONTINUOUS_MEDICATIONS, "</span></h3><div class='sub-sec-content icufs-resp-medadmin-data'>", icufsI18n.LOADING, "...</div></div></div>",
							"<div class='icufs-tab-data icufs-data4 icufs-list-tab'><div class='sub-sec-content icufs-event-data4'>", icufsI18n.LOADING, "...</div>",
							//Cont. Meds.
							"<div id='contMedTab2' class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl'>&nbsp;</span><span class='sub-sec-title'>",
							icufsI18n.CONTINUOUS_MEDICATIONS, "</span></h3><div class='sub-sec-content icufs-neuro-medadmin-data'>", icufsI18n.LOADING, "...</div></div></div>",
							"<div class='icufs-tab-data icufs-data5 icufs-list-tab'><div class='sub-sec-content icufs-event-data5'>", icufsI18n.LOADING, "...</div>",
							//Cont. Meds.
							"<div id='contMedTab3' class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl'>&nbsp;</span><span class='sub-sec-title'>",
							icufsI18n.CONTINUOUS_MEDICATIONS, "</span></h3><div class='sub-sec-content icufs-endo-medadmin-data'>", icufsI18n.LOADING, "...</div></div></div>",
							"</div></div></div><div class='icufs-previous-next'><table>", pnHTML, "</table></div>");
					return fsHTML.join("");
				}
				
				/**
				 * Change the tab in focus
				 *
				 * @param {object} tabCont : The tab content object (where tab data is displayed)
				 * @param {int} tabIdx : The index/number of the tab (first tab = 1)
				 */
				function changeTab(tabCont, tabIdx){
					if (tabIdx) {  // Tab index > 0
						// Change class name of tab content div to reflect tab in focus
						tabCont.className = "icufs-tab-cont icufs-tabview" + tabIdx;
						var curTab = Util.Style.g("icufs-data" + tabIdx, tabCont, "DIV")[0];
						if (curTab) {  // Tab exists
							// Save context of selected tab
							component.setSelectedDataGroup(tabIdx);
							MP_Core.AppUserPreferenceManager.SaveCompPreferences(compId);
							// Mark current tab as selected
							component.selectedTab = tabIdx;
							// Check if tab has cached data; do nothing if data is cached
							if (!Util.Style.ccss(curTab, "cached")) {
								// Mark tab as cached
								Util.Style.acss(curTab, "cached");
								if (Util.Style.ccss(curTab, "icufs-data1")) {  // Vitals & Hemodynamics tab
									maxRenderCnt = 6;
									renderEventGroupTab(tabCont, "icufs-vs-data", component.vitalCodes, 0);
									renderMedAdminsData(tabCont, "icufs-hemo-medadmin-data", component.hemoMultumClassIds, component.getHemoNonTitrateInd());
									renderIOData(tabCont,"icufs-io-data");
								}
								if (Util.Style.ccss(curTab, "icufs-data2")) {  // Labs tab
									maxRenderCnt = 4;
									renderLabsTab(tabCont, "icufs-data2", component.labCodes);
								}
								if (Util.Style.ccss(curTab, "icufs-data3")) {  // Respiratory tab
									maxRenderCnt = 5;
									renderEventGroupTab(tabCont, "icufs-event-data3", component.respCodes, 1);
									renderMedAdminsData(tabCont, "icufs-resp-medadmin-data", component.respMultumClassIds, component.getRespNonTitrateInd());
								}
								if (Util.Style.ccss(curTab, "icufs-data4")) {  // Neuro tab
									maxRenderCnt = 5;
									renderEventGroupTab(tabCont, "icufs-event-data4", component.neuroCodes, 1);
									renderMedAdminsData(tabCont, "icufs-neuro-medadmin-data", component.neuroMultumClassIds, component.getNeuroNonTitrateInd());
								}
								if (Util.Style.ccss(curTab, "icufs-data5")) {  // Endo tab
									maxRenderCnt = 5;
									renderEventGroupTab(tabCont, "icufs-event-data5", component.endoCodes, 1);
									renderMedAdminsData(tabCont, "icufs-endo-medadmin-data", component.endoMultumClassIds, component.getEndoNonTitrateInd());
								}
							}
							else{
								MP_FLWSHT_GRAPHS.resizeGraph("#flwshtBPGraph" + compId,compId);
							}
						}
					}
				}
				
				/**
				 * Create and insert the HTML for the Labs tab
				 *
				 * @param {object} tabCont : The tab content object (where tab data is displayed)
				 * @param {string} tab : the div corresponding to the correct tab/containing element
				 * @param {string} esCodes : The event set codes for the tab to be displayed
				 */
				function renderLabsTab(tabCont, tab, esCodes) {
					// Call script with appropriate parameters
					var labParams = "^MINE^," + crit.person_id + ".0," + crit.encntr_id + ".0," + crit.provider_id + ".0," + crit.ppr_cd + ".0," + esCodes + ",^" + sBeginDate + "^,^" + sEndDate + "^,2,1,"+columnCnt+","+lbUnits;  
					var request = new MP_Core.ScriptRequest(null, null);
					request.setProgramName("MP_RETRIEVE_FLOWSHEET_DATA");
					request.setParameters([labParams]);
					MP_Core.XMLCCLRequestCallBack(null, request, function(replyObj){
						var recordData = replyObj.getResponse();
						var labTab = Util.Style.g(tab, tabCont, "DIV")[0];  // "Tab" content where data is to be shown
						if(recordData){
							MP_Util.LogScriptCallInfo(null, this, "icuflowsheet.js", "renderLabsTab");
							var recordStatus = replyObj.getStatus();
							if (recordStatus === "S") {  // Succesful response with results
								var sHTML = "";
								var htmlArr = [];
								var j=0, k=0, l=0;
								var maxResCnt = recordData.MAX_RES_CNT;
								var evtSets = recordData.EVENT_SETS;
								var evtSetLen = evtSets.length;
								var df = MP_Util.GetDateFormatter();
								var nf = MP_Util.GetNumericFormatter();
								// Create subsections for each event set mapped
								for (var i=0; i<evtSetLen; i++) {
									var curEvtSet = evtSets[i];
									var curEvtSetName = curEvtSet.EVENT_SET_NAME;
									var primEvtSets = curEvtSet.PRIM_EVENT_SETS;
									var primEvtSetLen = primEvtSets.length;
									var evtSetNames = [];
									var resTimes = curEvtSet.RESULT_TIMES;
									var resTimesLen = resTimes.length;
									var curGroupName = curEvtSet.GROUP_NAME;
									
									// Create subsection if measurement results exist for this event set
									if (resTimesLen > 0) {  // One or more measurement results
										htmlArr.push("<table class='icufs-table'><tr class='hdr'><th class='icufs-evt-set-nm sub-sec-hd'><span class='sub-sec-hd-tgl'>&nbsp;</span><span class='sub-sec-title' title='", 
												curGroupName.replace(/'/g, '&#39;'), "'>", curGroupName, "</span></th>");
										// Store the current event set name in the first index of the event set name array
										evtSetNames.push(curEvtSetName);
										// Populate array of all primitive event set names used in this event set, in order
										for (j=0; j<primEvtSetLen; j++) {
											var curPrimEvtSet = primEvtSets[j];
											var curPrimEvtSetName = curPrimEvtSet.PRIM_EVENT_SET_NAME;
											evtSetNames.push(curPrimEvtSetName);
											var curPrimEvCodeName = curPrimEvtSet.PRIM_EVENT_CODE_DISP;
											
											// Create header cell for primitive event set, which actually uses DISPLAY of the event code.
											htmlArr.push("<th class='icufs-prim-evt' title='", curPrimEvCodeName.replace(/'/g, '&#39;'), "'>", curPrimEvCodeName, "</th>");
										}
										// Construct empty header cells as needed to ensure all subsections have the same number of columns
										if (primEvtSetLen < maxResCnt) {  // Empty columns needed
											for (j=primEvtSetLen; j<maxResCnt; j++) {
												htmlArr.push("<th class='icufs-prim-evt'>&nbsp;</th>");
											}
										}
										// End header row
										htmlArr.push("</tr>");
										// Create rows for result time
										for (j=0; j<resTimesLen; j++) {
											var curResTime = resTimes[j];
											var curTimeResults = curResTime.RESULT_GROUPS;
											var curTimeResLen = curTimeResults.length;
											// Format date for first cell (index 0)
											var formattedDt = df.formatISO8601(curResTime.EFFECTIVE_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
											var formattedHvrDt = df.formatISO8601(curResTime.EFFECTIVE_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
											// Store table cells individually in an array
											var curRowCells = ["<td><span class='row-label'>" + formattedDt + "</span></td>"];
											// Begin row
											htmlArr.push("<tr>");
											// Populate row with appropriate number of blank cells
											for (k=maxResCnt; k--;) {
												curRowCells.push("<td>&nbsp;</td>");
											}
											// Populate row with data at the appropriate location(s)
											for (k=curTimeResLen; k--;) {
												var curResGroup = curTimeResults[k];
												var curRes = curResGroup.RESULTS[0];
												var curResHTML = [];
												var prevResHTML = [];
												var normalcyMeans = [];
												var curNorm = CERN_ICUFLOWSHEET_O1.getNormalcyClass(curRes.NORMALCY_MEAN);
												var modInd = "";
												var curResVal = curRes.VALUE;
												var multClass = "";
												var curResCnt = curResGroup.RESULTS.length;
												var evtIdArr = [];
												var sEvtIds = "";
												var resValArr = [];
												var resDtArr = [];
												var statusArr= [];
												var curModInd = "";
												// Format result appropriately if it is of type Date/Time
												if (curRes.TYPE_FLAG === 3) {
													curResVal = df.formatISO8601(curResVal, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
												}
												// Format result appropriately if it is of type Numeric
												else if(curRes.TYPE_FLAG === 1) {
													curResVal = nf.format(curRes.VAL_RAW, "^."+curRes.PREC);
												}
												
												// Obtain relevant information from other results in the result group
												for (l=0; l<curResCnt; l++) {
													var currentResult = curResGroup.RESULTS[l];
													var curStat = currentResult.STATUS_MEAN;
													normalcyMeans.push(currentResult.NORMALCY_MEAN);
													if (currentResult.TYPE_FLAG === 3) {
														var curResultFormatted = df.formatISO8601(currentResult.VALUE, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
														resValArr.push(curResultFormatted);
													}
													else if(currentResult.TYPE_FLAG === 1) {
														resValArr.push(nf.format(currentResult.VAL_RAW, "^."+currentResult.PREC));
													}
													else {
														resValArr.push(currentResult.VALUE);
													}
													resDtArr.push(currentResult.EFFECTIVE_DT_TM);
													// Apply modify indicator if any result in the group has been modified
													statusArr.push(curStat);
													if (curStat === "MODIFIED" || curStat === "ALTERED") {
														modInd = "<span class='res-modified'>&nbsp;</span>";
														if (!l) {
															curModInd = "<span class='res-modified'>&nbsp;</span>";
														}
													}
												}
												// Add event IDs in reverse order
												for (l=curResCnt; l--;) {													
													evtIdArr.push(curResGroup.RESULTS[l].EVENT_ID);
												}

												// Add appropriate hoverClass
												var hoverClass = (curResCnt > 1) ? "icufs-cur-det" : "icufs-cur-det-noprev";
												if (curResCnt > 1) {
													prevResHTML.push("<div class='icufs-prev-det'><div class='icufs-prev-res-hdr'>", icufsI18n.ADDITIONAL_RESULTS, "</div><ol>");
													for (l=1; l<curResCnt; l++) {
														var prevModInd = "";
														var prevStat = statusArr[l];
														if (prevStat === "MODIFIED" || prevStat === "ALTERED") {
															prevModInd = "<span class='res-modified'>&nbsp;</span>";
														}
														prevResHTML.push("<li><span class='", CERN_ICUFLOWSHEET_O1.getNormalcyClass(normalcyMeans[l]), "'><span class='res-ind'>&nbsp;</span><span class='res-value'>",
																		 resValArr[l], "</span></span><span class='icufs-prev-dt date-time'>", df.formatISO8601(resDtArr[l],
																		 mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS), "</span>", prevModInd, "</li>");
													}
													prevResHTML.push("</ol></div>");
												}
												// Convert Event ID Array to usable string format
												sEvtIds = "[" + evtIdArr.join(".0,") + ".0]";
												// Construct the HTML for the table cell
												curResHTML.push("<td><dl class='icufs-info'><dt class='icufs-val'>", icufsI18n.VALUE, ":</dt><dd class='icufs-val'><span class='", curNorm,
																"'><span class='res-ind'>&nbsp;</span><span class='res-value ", multClass, "'>", CERN_ICUFLOWSHEET_O1.createViewerLink(crit.person_id, sEvtIds, curResVal), "</span>", modInd, "</span>",
																CERN_ICUFLOWSHEET_O1.getMultipleIndicator(normalcyMeans),"</dd></dl><h4 class='det-hd'>", icufsI18n.RESULT_DETAILS, "</h4><div class='hvr icufs-additional-result'><div class='",hoverClass,"'><dl class='icufs-det'><dt><span>", curRes.NAME,
																":</span></dt><dd><span class='", curNorm, "'>", curResVal, " ", curRes.UNIT, "</span>", curModInd, "</dd><dt><span>",icufsI18n.DATE_TIME,":</span></dt><dd><span>", formattedHvrDt,
																"</span></dd><dt><span>",icufsI18n.NORMAL_LOW,":</span></dt><dd><span>",((curRes.NORMAL_LOW)?nf.format(curRes.NORMAL_LOW_RAW, "^."+curRes.NORMAL_LOW_PREC):curRes.NORMAL_LOW),"</span></dd><dt><span>", icufsI18n.NORMAL_HIGH, ":</span></dt><dd><span>",
																((curRes.NORMAL_HIGH)?nf.format(curRes.NORMAL_HIGH_RAW, "^."+curRes.NORMAL_HIGH_PREC):curRes.NORMAL_HIGH), "</span></dd><dt><span>", icufsI18n.CRITICAL_LOW, ":</span></dt><dd><span>", ((curRes.CRITICAL_LOW)?nf.format(curRes.CRITICAL_LOW_RAW, "^."+curRes.CRITICAL_LOW_PREC):curRes.CRITICAL_LOW),"</span></dd><dt><span>", icufsI18n.CRITICAL_HIGH, ":</span></dt><dd><span>",
																((curRes.CRITICAL_HIGH)?nf.format(curRes.CRITICAL_HIGH_RAW, "^."+curRes.CRITICAL_HIGH_PREC):curRes.CRITICAL_HIGH), "</span></dd><dt><span>", icufsI18n.STATUS, ":</span></dt><dd><span>", curRes.STATUS_DISP,"</span></dd></dl></div>", prevResHTML.join(""), "</div></td>");
												curRowCells[curRes.INDEX] = curResHTML.join("");
											}
											// End row
											htmlArr.push(curRowCells.join(""), "</tr>");
										}
										// End table/subsection
										htmlArr.push("</table>");
									}
								}
								// Convert the HTML to a string and insert into page
								sHTML = htmlArr.join("");
								labTab.innerHTML = sHTML;
								// Initialize hovers
								MP_Util.Doc.InitHovers("icufs-info", labTab, component);
								// Initialize subsection expand/collapse
								initIcufsExpCol(labTab);
							}
							else if (recordStatus === "Z") {  // No results
								labTab.innerHTML = MP_Util.HandleNoDataResponse("");
							}
							else {  // Error
								labTab.innerHTML = "<span class='res-none'>" + icufsI18n.ERROR_RET_RESULTS + "</span>";
							}
						}else{
							//Done but not successful -> script missing or backend issue
							labTab.innerHTML = "<span class='res-none'>" + icufsI18n.ERROR_RET_RESULTS + "</span>";
						}
						totalRenderCnt += 1;
						MP_FLWSHT_GRAPHS.resizeGraph("#flwshtBPGraph" + compId,compId);
					});
					
					curDtTmColumn = CERN_ICUFLOWSHEET_O1.findCurDtTmColumnIndex();	//set current date time column to highlight if viewPage = 1
				}

				/**
				 * Create and insert the HTML for the tabs grouped by event set and distributed by hour blocks
				 *
				 * @param {object} tabCont : The tab content object (where tab data is displayed)
				 * @param {string} tab : the div corresponding to the correct tab/containing element
				 * @param {string} esCodes : The event set codes for the tab to be displayed
				 * @param {boolean} hdrFlag : Flag that determines whether or not to construct a header row (0 = no, 1 = yes)
				 */
				function renderEventGroupTab(tabCont, tab, esCodes, hdrFlag) {
					// Call script with appropriate parameters
					var respParams = "^MINE^," + crit.person_id + ".0," + crit.encntr_id + ".0," + crit.provider_id + ".0," + crit.ppr_cd + ".0," + esCodes + ",^" + sBeginDate + "^,^" + sEndDate + "^,1,1,"+columnCnt+","+lbUnits;
					var request = new MP_Core.ScriptRequest(null, null);
					request.setProgramName("MP_RETRIEVE_FLOWSHEET_DATA");
					request.setParameters([respParams]);
					MP_Core.XMLCCLRequestCallBack(null, request, function(replyObj){
						var recordData = replyObj.getResponse();
						var eventTab = Util.Style.g(tab, tabCont, "DIV")[0];  // "Tab" content where data is to be shown
						if(recordData){				//success
							MP_Util.LogScriptCallInfo(null, this, "icuflowsheet.js", "renderEventGroupTab");
							var recordStatus = replyObj.getStatus();
							if (recordStatus === "S") {  // Succesful response with results
								var sHTML = "";
								var htmlArr = [];
								var k=0, l=0;
								var evtSets = recordData.EVENT_SETS;
								var evtSetLen = evtSets.length;
								var df = MP_Util.GetDateFormatter();
								var nf = MP_Util.GetNumericFormatter();
								
								// Begin table construction
								htmlArr.push("<table class='icufs-table icufs-evt-tbl'>");
								// Construct Header Row if hdrFlag > 0
								if (hdrFlag) {
									htmlArr.push(CERN_ICUFLOWSHEET_O1.constructTimeHdrRow());
								}
								// Create row for each event set mapped
								for (var i=0; i<evtSetLen; i++) {
									var curEvtSet = evtSets[i];
									var curEvtSetName = curEvtSet.EVENT_SET_NAME;
									var primEvtSets = curEvtSet.PRIM_EVENT_SETS;
									var primEvtSetLen = primEvtSets.length;
									var curGroupName = curEvtSet.GROUP_NAME;  //Use first Event Display instread
									// Create row if measurement results exist for this event set
									if (primEvtSetLen > 0) {  // One or more measurement results
										// Populate array of all primitive event set names used in this event set, in order
										for (var j=0; j<primEvtSetLen; j++) {
											var curPrimEvtSet = primEvtSets[j];
											var curPrimEvtSetName = curPrimEvtSet.PRIM_EVENT_SET_NAME;
											var curEventResults = curPrimEvtSet.RESULT_GROUPS;
											var curEventResLen = curEventResults.length;
											// Begin row
											
											htmlArr.push("<tr class='dose-hdr'>");
											// Store table cells individually in an array
											var curRowCells = ["<td class='icufs-lbl icufs-data-ellipses icufs-word-fix'><span class='row-label' title='" + curGroupName.replace(/'/g, '&#39;') + "'>" + curGroupName + "</span></td>"];
											
											// If column is the last column and today's view, apply correct class for style.
											for (k = 0; k < columnCnt; k++) {
												var placeholder = "<td>&nbsp;</td>";
												if(k===curDtTmColumn){
													placeholder = "<td class='icufs-res-curhr icufs-data-ellipses icufs-word-fix'>&nbsp;</td>";
												}
												// Populate row with appropriate number of blank cells
												curRowCells.push(placeholder);
											}
											//Populate row with data at the appropriate location(s)
											for (k=curEventResLen; k--;) {
												var curResGroup = curEventResults[k];
												var curRes = curResGroup.RESULTS[0];
												var curResHTML = [];
												var prevResHTML = [];
												var normalcyMeans = [];
												var curNorm = CERN_ICUFLOWSHEET_O1.getNormalcyClass(curRes.NORMALCY_MEAN);
												var modInd = "";
												var curResVal = curRes.VALUE;
												var multClass = "";
												var curResCnt = curResGroup.RESULTS.length;
												var evtIdArr = [];
												var sEvtIds = "";
												var resValArr = [];
												var resDtArr = [];
												var statusArr = [];
												var curModInd = "";
												var formattedHvrDt = "";
												// Variables for "Latest" column
												var ltDtTm = curRes.EFFECTIVE_DT_TM;
												var ltModInd = "";
												var ltPrevResHTML = [];
												var ltResCnt = 0;
												var ltEvtIdArr = [];
												var ltEvtIds = "";
												var ltNormalcyMeans = [];
												// Format result appropriately if it is of type Date/Time
												if (curRes.TYPE_FLAG === 3) {
													curResVal = df.formatISO8601(curResVal, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
												}
												// Format result appropriately if it is of type Numeric
												else if(curRes.TYPE_FLAG === 1) {
													curResVal = nf.format(curRes.VAL_RAW, "^."+curRes.PREC);
												}
												// Obtain relevant information from other results in the result group
												var currentResult = null;
												var curDtTm = "";
												for (l=0; l<curResCnt; l++) {
													currentResult = curResGroup.RESULTS[l];
													var curStat = currentResult.STATUS_MEAN;
													curDtTm = currentResult.EFFECTIVE_DT_TM;
													normalcyMeans.push(currentResult.NORMALCY_MEAN);
													// Store the normalcy means for the "Latest" result(s) and increment the "Latest" result count
													if (curDtTm === ltDtTm && !k) {
														ltNormalcyMeans.push(currentResult.NORMALCY_MEAN);
														ltResCnt++;
													}
													if (currentResult.TYPE_FLAG === 3) {
														var curResultFormatted = df.formatISO8601(currentResult.VALUE, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
														resValArr.push(curResultFormatted);
													}
													else if(currentResult.TYPE_FLAG === 1) {
														resValArr.push(nf.format(currentResult.VAL_RAW, "^."+currentResult.PREC));
													}
													else {
														resValArr.push(currentResult.VALUE);
													}
													resDtArr.push(curDtTm);
													// Apply modify indicator if any result in the group has been modified
													statusArr.push(curStat);
													if (curStat === "MODIFIED" || curStat === "ALTERED") {
														modInd = "<span class='res-modified'>&nbsp;</span>";
														// Mark the current result as modified if applicable
														if (!l) {
															curModInd = "<span class='res-modified'>&nbsp;</span>";
															ltModInd = modInd;
														}
														// If one of the "Latest" results not shown face up is modified, mark this
														else if (curDtTm === ltDtTm && !k) {
															ltModInd = modInd;
														}
													}
												}
												// Add event IDs in reverse order
												for (l=curResCnt; l--;) {
													currentResult = curResGroup.RESULTS[l];
													var curEvtId = currentResult.EVENT_ID;
													curDtTm = currentResult.EFFECTIVE_DT_TM;
													evtIdArr.push(curEvtId);
													// Add event IDs for "Latest" result(s)
													if (curDtTm === ltDtTm && !k) {
														ltEvtIdArr.push(curEvtId);
													}
												}
												
												// Determine the classes required to display hover correctly
												var hoverClass = (curResCnt > 1) ? "icufs-cur-det" : "icufs-cur-det-noprev"; 
												var hoverClassLatest = (ltResCnt > 1) ? "icufs-cur-det" : "icufs-cur-det-noprev"; 
												
												// Populate "Additional Result" information for results not shown face up
												if (curResCnt > 1) {
													prevResHTML.push("<div class='icufs-prev-det'><div class='icufs-prev-res-hdr'>", icufsI18n.ADDITIONAL_RESULTS, "</div><ol>");
													// Populate "Additional Result" info for "Latest" results if needed
													if (ltResCnt > 1) {
														ltPrevResHTML.push("<div class='icufs-prev-det'><div class='icufs-prev-res-hdr'>", icufsI18n.ADDITIONAL_RESULTS, "</div><ol>");
													}
													for (l=1; l<curResCnt; l++) {
														var prevModInd = "";
														var prevStat = statusArr[l];
														var prevLi = [];
														curDtTm = resDtArr[l];
														if (prevStat === "MODIFIED" || prevStat === "ALTERED") {
															prevModInd = "<span class='res-modified'>&nbsp;</span>";
														}
														prevLi.push("<li><span class='", CERN_ICUFLOWSHEET_O1.getNormalcyClass(normalcyMeans[l]), "'><span class='res-ind'>&nbsp;</span><span class='res-value'>",
																		 resValArr[l], "</span></span><span class='icufs-prev-dt date-time'>", df.formatISO8601(curDtTm,
																		 mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS), "</span>", prevModInd, "</li>");
														prevResHTML = prevResHTML.concat(prevLi);
														// Add list item to "Latest" result markup if appropriate
														if (curDtTm === ltDtTm && !k) {
															ltPrevResHTML = ltPrevResHTML.concat(prevLi);
														}
													}
													prevResHTML.push("</ol></div>");
													// End "Latest" result "Additional Results" markup if needed
													if (ltResCnt > 1) {
														ltPrevResHTML.push("</ol></div>");
													}
												}
												//Convert Event ID Arrays to usable string format
												sEvtIds = "[" + evtIdArr.join(".0,") + ".0]";
												ltEvtIds = "[" + ltEvtIdArr.join(".0,") + ".0]";
												formattedHvrDt = df.formatISO8601(curRes.EFFECTIVE_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);

												//Apply icufs-res-curhr class if the result is within the last column and today's view
												var idx = 0;
												idx = curRes.INDEX;
												var rsltClass = "";
												if (idx === (curDtTmColumn + 1) ){
													rsltClass =  " icufs-res-curhr";
												}
	
												//Construct the HTML for the table cell
												curResHTML.push("<td class='icufs-data-ellipses icufs-word-fix" + rsltClass + "'>", "<dl class='icufs-info'><dt class='icufs-val'>", icufsI18n.VALUE, ":</dt><dd class='icufs-val'><span class='", curNorm,
																"'><span class='res-ind'>&nbsp;</span><span class='res-value'>", CERN_ICUFLOWSHEET_O1.createViewerLink(crit.person_id, sEvtIds, curResVal), "</span>", modInd, "</span>",
																CERN_ICUFLOWSHEET_O1.getMultipleIndicator(normalcyMeans), "</dd></dl><h4 class='det-hd'>", icufsI18n.RESULT_DETAILS, "</h4><div class='hvr icufs-additional-result'><div class=",hoverClass,"><dl class='icufs-det'><dt><span>", curRes.NAME,
																":</span></dt><dd><span class='", curNorm, "'>", curResVal, " ", curRes.UNIT, "</span>", curModInd, "</dd><dt><span>", icufsI18n.DATE_TIME, ":</span></dt><dd><span>", formattedHvrDt,
																"</span></dd><dt><span>", icufsI18n.NORMAL_LOW, ":</span></dt><dd><span>", ((curRes.NORMAL_LOW)?nf.format(curRes.NORMAL_LOW_RAW, "^."+curRes.NORMAL_LOW_PREC):curRes.NORMAL_LOW), "</span></dd><dt><span>", icufsI18n.NORMAL_HIGH, ":</span></dt><dd><span>",
																((curRes.NORMAL_HIGH)?nf.format(curRes.NORMAL_HIGH_RAW, "^."+curRes.NORMAL_HIGH_PREC):curRes.NORMAL_HIGH), "</span></dd><dt><span>", icufsI18n.CRITICAL_LOW, ":</span></dt><dd><span>", ((curRes.CRITICAL_LOW)?nf.format(curRes.CRITICAL_LOW_RAW, "^."+curRes.CRITICAL_LOW_PREC):curRes.CRITICAL_LOW), "</span></dd><dt><span>", icufsI18n.CRITICAL_HIGH, ":</span></dt><dd><span>",
																((curRes.CRITICAL_HIGH)?nf.format(curRes.CRITICAL_HIGH_RAW, "^."+curRes.CRITICAL_HIGH_PREC):curRes.CRITICAL_HIGH), "</span></dd><dt><span>", icufsI18n.STATUS, ":</span></dt><dd><span>", curRes.STATUS_DISP, "</span></dd></dl></div>", prevResHTML.join(""), "</div></td>");
												curRowCells[idx] = curResHTML.join("");
											}
											// End row
											htmlArr.push(curRowCells.join(""), "</tr>");
										}
									}
								}
								// End table/subsection
								htmlArr.push("</table>");

								// Convert the HTML to a string and insert into page
								sHTML = htmlArr.join("");
								eventTab.innerHTML = sHTML;
								// Initialize hovers
								MP_Util.Doc.InitHovers("icufs-info", eventTab, component);
							}
							else if (recordStatus === "Z") {  // No results
								eventTab.innerHTML = MP_Util.HandleNoDataResponse("");
							}
							else {  // Error
								eventTab.innerHTML = "<span class='res-none'>" + icufsI18n.ERROR_RET_RESULTS + "</span>";
							}
						}else{		//Done but not successful -> script missing or backend issue
							eventTab.innerHTML = "<span class='res-none'>" + icufsI18n.ERROR_RET_RESULTS + "</span>";
						}
						totalRenderCnt += 1;
					});
					curDtTmColumn = CERN_ICUFLOWSHEET_O1.findCurDtTmColumnIndex();	//set current date time column to highlight if viewPage = 1
				}
				
				/**
				 * Create and insert the HTML for the continuous medication subsection by drug class ids and distributed by hour blocks
				 *
				 * @param {object} tabCont : The tab content object (where tab data is displayed)
				 * @param {string} tab : the div corresponding to the correct tab/containing element
				 * @param {string} classIds : The drug class ids for the section to be displayed
				 * @param {boolean} flag : The indicator for the non-titratable section to be displayed
				 */
				function renderMedAdminsData(tabCont, tab, classIds, showNonTitrate) {
					var medAdminSection = Util.Style.g(tab, tabCont, "DIV")[0];  // tab section content where data is to be shown
					if(classIds != "0.0")			//call script and populate section if configured
					{
						// Call script with appropriate parameters
						var marParams = "^MINE^," + crit.person_id + ".0," + crit.encntr_id + ".0," + crit.provider_id + ".0," + crit.position_cd + ".0," + crit.ppr_cd + ".0," + classIds + ",^" + sBeginDate + "^,^" + sEndDate + "^,"+columnCnt+","+lbUnits;
						var request = new MP_Core.ScriptRequest(null, null);
						request.setProgramName("MP_RETRIEVE_FLOWSHEET_MAR");
						request.setParameters([marParams]);
						MP_Core.XMLCCLRequestCallBack(null, request, function(replyObj){
							var recordData = replyObj.getResponse();
							if(recordData){  	//success
								MP_Util.LogScriptCallInfo(null, this, "icuflowsheet.js", "renderMedAdminsData");
								var recordStatus = replyObj.getStatus();
								//sort order lists by sequence number
								var tempArray = recordData.TITRATABLE_ORDERS;
								tempArray.sort(bySeq);
								tempArray = recordData.NON_TITRATABLE_ORDERS;
								tempArray.sort(bySeq);
								if (recordStatus === "S") {  // Successful response with results
									var columnData = null;
									var curTable = null;
									var nonTitrateOrder = null;
									var titrateOrder = null;
									var doseColumnHTML = [];
									var evntIdArray = [];
									var htmlArr = [];
									var nonTitrateVolumeRow = [];
									var rsltHoverHTML = [];
									var tgls = [];
									var titrateDoseRow = [];
									var titrateVolumeRow = [];
									var volumeColumnHTML = [];
									var addCnt = 0, addCntL = 0;
									var additiveCnt = 0;
									var cnt = 0, cntL = 0;	
									var columnIdx = 0;
									var doseCnt = 0, doseCntL = 0;
									var i = 0;
									var j = 0, jl = 0;
									var k = 0, kl = 0;
									var l = 0, ll = 0;	
									var resultCnt = 0;	
									var tglCnt = 0;
									var z = 0, zl = 0;
									var actionDetails = "";
									var additiveDose = "";
									var doseClass = "";	
									var doseStr = "";	
									var modInd = "";				
									var orderDtTm = "";									
									var orderStr = "";									
									var placeholder = "";
									var secDivider = "";
									var sEvntIds = "";
									var tempStr = "";
									var uomStr = "";
									var volumeClass = "";
									var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);	

									for(cnt = 0, cntL = recordData.TITRATABLE_ORDERS.length; cnt < cntL; cnt++){	//start titrate orders
										htmlArr.push("<table class='icufs-table icufs-medadm-table'>");
										secDivider = " icufs-medadm-non-titrate";
										titrateOrder = recordData.TITRATABLE_ORDERS[cnt];
										orderStr = "";
										uomStr = "";
										for(addCnt = 0, addCntL = titrateOrder.ADDITIVES.length; addCnt < addCntL; addCnt++){	//get additives
											if(addCnt > 0){
												orderStr += "</br>";
												uomStr += "</br>";
											}
											orderStr += "<span class='icufs-medadm-lbl'>" + titrateOrder.ADDITIVES[addCnt].ADDITIVE_NAME + "</span>";
											uomStr += titrateOrder.ADDITIVES[addCnt].ADDITIVE_UOM;
										}

										orderDtTm = df.formatISO8601(titrateOrder.ORDER_DTTM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
										titrateDoseRow = ["<tr class='dose-hdr'><td class='icufs-medadm-lbl'><span class='sub-sec-hd-tgl'>&nbsp;</span><dl class='icufs-info'><dt></dt><dd>" +
																"<div class='icufs-row-label-left'>" + orderStr + "</div><div class='icufs-row-label-right'>" + uomStr + "</div>" +
																"</dd></dl><h4 class='det-hd'>&nbsp;</h4><div class='hvr'><dl class='icufs-det'><dt><span>Order:&nbsp;</span></dt><dd><span>" +
																titrateOrder.ORDERED_AS_MNEMONIC + "</span></dd><dt><span>Order Date/Time:&nbsp;</span></dt><dd><span>" +
																orderDtTm + "</span></dd><dt><span>Order Details:&nbsp;</span></dt><dd><span>" +
																titrateOrder.CLINICAL_DISPLAY + "</span></dd><dt><span>Responsible Provider:&nbsp;</span></dt><dd><span>" +
																titrateOrder.RESP_PROVIDER_NAME + "</span></dd></dl></div></td>"];
										
										var titrateVolumeRow = ["<tr class='icufs-medadm-volrow'><td class='icufs-volume-rate-label'><div class='icufs-row-label-left'>" + icufsI18n.VOLUME_RATE + "</div><div class='icufs-row-label-right'>" + titrateOrder.VOLUME_UOM + "</div></td>"];
										// Populate dose row with appropriate number of blank cells
										placeholder = "";
										for (j = 0, jl = columnCnt; j < jl; j++) {
											if((titrateOrder.PRIOR_BEGIN_BAG_IND === 1) || (titrateOrder.BEGIN_BAG_COLUMN > 0 && titrateOrder.BEGIN_BAG_COLUMN <= j)){
												placeholder = "<td class='icufs-medadm-rslt'>--</td>";		//set running indicator if begin bag event
											}else{
												placeholder = "<td class='icufs-medadm-rslt'>&nbsp;</td>";
											}
											if(j === curDtTmColumn ){
												if((titrateOrder.PRIOR_BEGIN_BAG_IND === 1) || (titrateOrder.BEGIN_BAG_COLUMN > 0 && titrateOrder.BEGIN_BAG_COLUMN <= j)){
													placeholder = "<td class='icufs-medadm-rslt icufs-res-curhr'>--</td>";		//set running indicator if begin bag event
												}else{
													placeholder = "<td class='icufs-medadm-rslt icufs-res-curhr'>&nbsp;</td>";
												}
											}
											titrateDoseRow.push(placeholder);
											titrateVolumeRow.push(placeholder);
										}

										columnData = titrateOrder.COLUMN;				
										for (k = 0, kl = columnData.length; k < kl; k++) {
											doseColumnHTML = [];
											volumeColumnHTML = [];
											rsltHoverHTML = [];
											evntIdArray = [];
											sEvntIds = "";
											resultCnt = columnData[k].MED_ADMINS.length;
											columnIdx = columnData[k].COLUMN_ID;
											
											//Apply icufs-res-curhr class if the dose result is within the last column and today's view
											doseClass = "";
											if (columnIdx === (curDtTmColumn + 1) ){
												doseClass = " icufs-res-curhr";
											}

											//add event IDs in reverse order
											for (l = resultCnt; l--;) {													
												evntIdArray.push(columnData[k].MED_ADMINS[l].EVENT_ID);
											}
											//assemble hover details
											for (l = 0, ll = resultCnt; l < ll; l++) {
												actionDetails = "";
												if(columnData[k].MED_ADMINS[l].SHOW_ADDITIVES_IND > 0){
													additiveCnt = columnData[k].MED_ADMINS[l].ADDITIVES.length;
													additiveDose = "";
													for (z = 0, zl = additiveCnt; z < zl; z++) {
														if(columnData[k].MED_ADMINS[l].ADDITIVES[z].DOSE > ""){
															additiveDose = columnData[k].MED_ADMINS[l].ADDITIVES[z].DOSE;
														}else{
															additiveDose = "--";
														}
														actionDetails += "<span>" + columnData[k].MED_ADMINS[l].ADDITIVES[z].ADDITIVE_NAME + ": " + additiveDose + "&nbsp;"
														+ columnData[k].MED_ADMINS[l].ADDITIVES[z].DOSE_UOM + "</span>";
														actionDetails += "</br>";
													}
												}
												if(columnData[k].MED_ADMINS[l].USE_CONT_DOSE_IND > 0){
													actionDetails += "<span>" + icufsI18n.VOLUME_RATE + ": " + columnData[k].MED_ADMINS[l].DOSE + "&nbsp;"
													+ columnData[k].MED_ADMINS[l].DOSE_UOM + "</span>";
												}else{
													actionDetails += "<span>" + icufsI18n.VOLUME_RATE + ": " + columnData[k].MED_ADMINS[l].VOLUME + "&nbsp;"
													+ columnData[k].MED_ADMINS[l].VOLUME_UOM + "</span>";
												}
												rsltHoverHTML.push("<dl class='icufs-medadm-hvr-info'><dt></dt><dd class='icufs-medadm-hvr-action'><span>",columnData[k].MED_ADMINS[l].ACTION, "</span></dd><dd class='icufs-medadm-hvr-dt'><span class='date-time'>",
													df.formatISO8601(columnData[k].MED_ADMINS[l].ACTION_DTTM, mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS),"</span></dd><dd class='icufs-medadm-hvr-detail'>", actionDetails, "</dd></dl>");
											}
											rsltHoverHTML.push("</ol></div>");
											sEvntIds = "[" + evntIdArray.join(".0,") + ".0]";

											tempStr = "";
											doseStr = "";
											modInd = "";
											if(columnData[k].BOLUS_IND){
												tempStr = "+";
											}else if(columnData[k].INFUSE_IND && resultCnt === 1){
												tempStr = "+";
											}
											if (columnData[k].MODIFIED_IND) {
												modInd = "<span class='res-modified'>&nbsp;</span>";
											}
											for(doseCnt = 0, doseCntl = columnData[k].ADDITIVES.length; doseCnt < doseCntl; doseCnt++,tempStr = ""){	//get additives
												if(columnData[k].ADDITIVES[doseCnt].DOSE > ""){
													tempStr += columnData[k].ADDITIVES[doseCnt].DOSE;
												}else{
													tempStr += "--";
												}
												if(doseCnt === 0){
													doseStr += "<span>" + tempStr + "</span>";
													if(resultCnt > 1){
														doseStr += "<span class='res-multiple'>[" + resultCnt + "]</span>" + modInd;
													}
												}else{
													doseStr += "</br><span>" + tempStr + "</span>" + modInd;
												}
											}

											doseColumnHTML.push("<td class='icufs-medadm-rslt medadm-sub-hd",doseClass,"'><dl class='icufs-info'><dt class='icufs-val'>", icufsI18n.VALUE, ":</dt><dd class='icufs-val'>",
												"<span>", CERN_ICUFLOWSHEET_O1.createViewerLink(crit.person_id, sEvntIds, doseStr), "</span></dd></dl><h4 class='det-hd'>",
												icufsI18n.RESULT_DETAILS, "</h4><div class='hvr'>", rsltHoverHTML.join(""), "</div></td>");
											titrateDoseRow[columnIdx] = doseColumnHTML.join("");
											
											volumeColumnHTML.push("<td class='icufs-medadm-rslt medadm-sub-hd",doseClass,"'><dl class='icufs-info'><dt class='icufs-val'>",
												icufsI18n.VALUE, ":</dt><dd class='icufs-val'><span>", columnData[k].VOLUME, "</span></dd></dl></td>");
											titrateVolumeRow[columnIdx] = volumeColumnHTML.join("");
										}
										htmlArr.push(titrateDoseRow.join(""),"</tr>");
										htmlArr.push(titrateVolumeRow.join(""),"</tr>");
										htmlArr.push("</table>");
									}

									if(showNonTitrate === true){			//handle non-titratables
										htmlArr.push("<table class='icufs-table icufs-medadm-table" + secDivider + "'>");
										for(cnt = 0, cntL = recordData.NON_TITRATABLE_ORDERS.length; cnt < cntL; cnt++){	//start titrate orders
											nonTitrateOrder = recordData.NON_TITRATABLE_ORDERS[cnt];
											orderDtTm = df.formatISO8601(nonTitrateOrder.ORDER_DTTM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
											nonTitrateVolumeRow = ["<tr class='dose-hdr'><td class='icufs-medadm-lbl'><dl class='icufs-info'><dt></dt><dd>" +
																	"<div class='icufs-row-label-left'>" + nonTitrateOrder.ORDERED_AS_MNEMONIC + "</div><div class='icufs-row-label-right'>" + nonTitrateOrder.VOLUME_UOM + "</div>" +
																	"</dd></dl><h4 class='det-hd'>&nbsp;</h4><div class='hvr'><dl class='icufs-det'><dt><span>Order:&nbsp;</span></dt><dd><span>" +
																	nonTitrateOrder.ORDERED_AS_MNEMONIC + "</span></dd><dt><span>Order Date/Time:&nbsp;</span></dt><dd><span>" +
																	orderDtTm + "</span></dd><dt><span>Order Details:&nbsp;</span></dt><dd><span>" +
																	nonTitrateOrder.CLINICAL_DISPLAY + "</span></dd><dt><span>Responsible Provider:&nbsp;</span></dt><dd><span>" +
																	nonTitrateOrder.RESP_PROVIDER_NAME + "</span></dd></dl></div></td>"];

											placeholder = "";
											for (j = 0, jl = columnCnt; j < jl; j++) {
												if((nonTitrateOrder.PRIOR_BEGIN_BAG_IND === 1) || (nonTitrateOrder.BEGIN_BAG_COLUMN > 0 && nonTitrateOrder.BEGIN_BAG_COLUMN <= j)){
													placeholder = "<td class='icufs-medadm-rslt'>--</td>";		//set running indicator if begin bag event
												}else{
													placeholder = "<td class='icufs-medadm-rslt'>&nbsp;</td>";
												}
												if(j === curDtTmColumn ){
													if((nonTitrateOrder.PRIOR_BEGIN_BAG_IND === 1) || (nonTitrateOrder.BEGIN_BAG_COLUMN > 0 && nonTitrateOrder.BEGIN_BAG_COLUMN <= j)){
														placeholder = "<td class='icufs-medadm-rslt icufs-res-curhr'>--</td>";		//set running indicator if begin bag event
													}else{
														placeholder = "<td class='icufs-medadm-rslt icufs-res-curhr'>&nbsp;</td>";
													}

												}
												nonTitrateVolumeRow.push(placeholder);
											}

											columnData = nonTitrateOrder.COLUMN;					
											for (k = 0, kl = columnData.length; k < kl; k++) {
												volumeColumnHTML = [];
												rsltHoverHTML = [];
												evntIdArray = [];
												sEvntIds = "";
												resultCnt = columnData[k].MED_ADMINS.length;
												columnIdx = columnData[k].COLUMN_ID;
												//Apply icufs-res-curhr class if the dose result is within the last column and today's view
												volumeClass = "";
												if (columnIdx === (curDtTmColumn + 1) ){
													volumeClass = " icufs-res-curhr";
												}

												//add event IDs in reverse order
												for (l = resultCnt; l--;) {													
													evntIdArray.push(columnData[k].MED_ADMINS[l].EVENT_ID);
												}
												//assemble hover details
												for (l = 0, ll = resultCnt; l < ll; l++) {
													actionDetails = "";
													if(columnData[k].MED_ADMINS[l].SHOW_ADDITIVES_IND > 0){
														additiveCnt = columnData[k].MED_ADMINS[l].ADDITIVES.length;
														additiveDose = "";
														for (z = 0; z < additiveCnt; z++) {
															if(columnData[k].MED_ADMINS[l].ADDITIVES[z].DOSE > ""){
																additiveDose = columnData[k].MED_ADMINS[l].ADDITIVES[z].DOSE;
															}else{
																additiveDose = "--";
															}
															actionDetails += "<span>" + columnData[k].MED_ADMINS[l].ADDITIVES[z].ADDITIVE_NAME + ": " + columnData[k].MED_ADMINS[l].ADDITIVES[z].DOSE + "&nbsp;"+
															columnData[k].MED_ADMINS[l].ADDITIVES[z].DOSE_UOM + "</span>";
															actionDetails += "</br>";
														}
													}

													if(columnData[k].MED_ADMINS[l].USE_CONT_DOSE_IND > 0){
														actionDetails += "<span>" + icufsI18n.VOLUME_RATE + ": " + columnData[k].MED_ADMINS[l].DOSE + "&nbsp;" +
														columnData[k].MED_ADMINS[l].DOSE_UOM + "</span>";
													}else{
														actionDetails += "<span>" + icufsI18n.VOLUME_RATE + ": " + columnData[k].MED_ADMINS[l].VOLUME + "&nbsp;" +
														columnData[k].MED_ADMINS[l].VOLUME_UOM + "</span>";
													}
													rsltHoverHTML.push("<dl class='icufs-medadm-hvr-info'><dt></dt><dd class='icufs-medadm-hvr-action'><span>",columnData[k].MED_ADMINS[l].ACTION, "</span></dd><dd class='icufs-medadm-hvr-dt'><span class='date-time'>",
														df.formatISO8601(columnData[k].MED_ADMINS[l].ACTION_DTTM, mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS),"</span></dd><dd class='icufs-medadm-hvr-detail'>", actionDetails, "</dd></dl>");
												}
												rsltHoverHTML.push("</ol></div>");
												sEvntIds = "[" + evntIdArray.join(".0,") + ".0]";

												tempStr = "<span>";
												modInd = "";
												if(columnData[k].BOLUS_IND){
													tempStr = "+";
												}else if(columnData[k].INFUSE_IND && resultCnt === 1){
													tempStr = "+";
												}
												if (columnData[k].MODIFIED_IND) {
													modInd = "<span class='res-modified'>&nbsp;</span>";
												}
												
												if(columnData[k].VOLUME > ""){
													tempStr += columnData[k].VOLUME + "</span>";
												}else{
													tempStr += "--</span>";
												}

												if(resultCnt > 1){
													tempStr += "<span class='res-multiple'>[" + resultCnt + "]</span>" + modInd;
												}else{
													tempStr += modInd;
												}
												volumeColumnHTML.push("<td class='icufs-medadm-rslt medadm-sub-hd",volumeClass,"'><dl class='icufs-info'><dt class='icufs-val'>", icufsI18n.VALUE, ":</dt><dd class='icufs-val'>",
													"<span>", CERN_ICUFLOWSHEET_O1.createViewerLink(crit.person_id, sEvntIds, tempStr), "</span></dd></dl><h4 class='det-hd'>",
													icufsI18n.RESULT_DETAILS, "</h4><div class='hvr'>", rsltHoverHTML.join(""), "</div></td>");
												nonTitrateVolumeRow[columnIdx] = volumeColumnHTML.join("");
											}
											htmlArr.push(nonTitrateVolumeRow.join(""),"</tr>");
										}
										htmlArr.push("</table>");
									}

									medAdminSection.innerHTML = htmlArr.join("");
									// Initialize hovers
									MP_Util.Doc.InitHovers("icufs-info", medAdminSection, component);
									// Initialize subsection expand/collapse
									initIcufsExpCol(medAdminSection);
									//default volume line to collapsed
									tgls = Util.Style.g("sub-sec-hd-tgl", medAdminSection, "SPAN");
									tglCnt = tgls.length;
									for (i = tglCnt; i--;) {
										curTable = Util.gp(Util.gp(Util.gp(tgls[i])));
										Util.Style.tcss(curTable, "closed");
									}
								}
								else if (recordStatus === "Z") {  // No results
									medAdminSection.innerHTML = MP_Util.HandleNoDataResponse("");
								}
								else {  // Error
									medAdminSection.innerHTML = "<span class='res-none'>" + icufsI18n.ERROR_RET_RESULTS + "</span>";
								}
							}else{		//Done but not successful -> script missing or backend issue
								medAdminSection.innerHTML = "<span class='res-none'>" + icufsI18n.ERROR_RET_RESULTS + "</span>";
							}
							totalRenderCnt += 1;
							MP_FLWSHT_GRAPHS.resizeGraph("#flwshtBPGraph" + compId,compId);
						});
						curDtTmColumn = CERN_ICUFLOWSHEET_O1.findCurDtTmColumnIndex();	//set current date time column to highlight if viewPage = 1
					}else{			//nothing to call for display
						medAdminSection.innerHTML = MP_Util.HandleNoDataResponse("");
						totalRenderCnt += 1;
					}
				}

				/**
				 * Create and insert the HTML for the io subsection grouped by event set and distributed by hour blocks
				 *
				 * @param {object} tabCont : The tab content object (where tab data is displayed)
				 * @param {string} tab : the div corresponding to the correct tab/containing element
				 */
				function renderIOData(tabCont, tab) {
					// Call script with appropriate parameters
					var ioParams = "^MINE^," + crit.person_id + ".0," + crit.encntr_id + ".0," + crit.provider_id + ".0," + crit.ppr_cd + ".0,^" + sBeginDate + "^,^" + sEndDate + "^";		
					var request = new MP_Core.ScriptRequest(null, null);
					request.setProgramName("mp_retrieve_icufs_io");
					request.setParameters([ioParams]);
					MP_Core.XMLCCLRequestCallBack(null, request, function(replyObj){
						var recordData = replyObj.getResponse();
						var ioTab = Util.Style.g(tab, tabCont, "DIV")[0];  // "Tab" content where data is to be shown
						if(recordData){  	//success
							MP_Util.LogScriptCallInfo(null, this, "icuflowsheet.js", "renderIOData");
							var recordStatus = replyObj.getStatus();
							if (recordStatus === "S") {  // Succesful response with results
								var nf = MP_Util.GetNumericFormatter();
								var curBal = null;
								var ioDailyTotalData = null;
								var ioFbData = null;
								var fbHTML = [];
								var htmlArr = [];
								var ioFbRow = [];
								var curBalNorm = "";
								var placeholder = "";
								var ioFbLen = 0;
								var j = 0, jl = 0;
								
								// Create rows for intake results
								htmlArr.push(getIORows(1,recordData.INTAKE));
									
								//Create rows for Output results
								htmlArr.push(getIORows(2,recordData.OUTPUT));
								
								// Fluid Balance - Begin Row
								htmlArr.push("<table class='icufs-table icufs-io-table'><tr>");
								ioFbRow = ["<td class='icufs-io-lbl'><div class='icufs-row-label-left'><span class='sub-sec-title'>" + icufsI18n.HOURLY_FLUID_BAL + "</span></div><div class='icufs-row-label-right'>mL</div></td>"];

								// Populate row with appropriate number of blank cells
								for (j = 0, jl = columnCnt; j < jl; j++) {
										placeholder = "<td>&nbsp;</td>";
										if(j===curDtTmColumn ){
											placeholder = "<td class='icufs-res-curhr'>&nbsp;</td>";
										}
										ioFbRow.push(placeholder);
								}
								
								ioFbData = recordData.FLUID_BAL.TIME_GROUPS;
								ioFbLen = ioFbData.length;
								ioDailyTotalData = recordData.FLUID_BAL.DAY_NETIO;
								
								for (var k=0; k<ioFbLen; k++) {
									fbHTML.length = 0;
									var curBal = ioFbData[k];
									var fbIdx = findColumnIndex(curBal.INDEX_DTTM);
									//Apply icufs-res-curhr class if the result is within the last column and today's view
									var fbClass = "";
									if (fbIdx === (curDtTmColumn + 1) ){
										fbClass = " class='icufs-res-curhr'";
									}

									curBalNorm = "res-normal";
									if(curBal.VALUE_IND === "-"){
										curBalNorm = "res-severe";
									}
									//Construct HTML for header row
									fbHTML.push("<td",fbClass,"><dl class='icufs-info'><dt class='icufs-val'>",icufsI18n.VALUE,":</dt><dd class='icufs-val'><span class='",curBalNorm,"'>", curBal.VALUE_IND, nf.format(curBal.BALANCE_VALUE, "^."+null), "</span></dd></dl></td>");
									ioFbRow[fbIdx] = fbHTML.join("");
								}
								htmlArr.push(ioFbRow.join(""),"</tr>");

								if(ioDailyTotalData.VALUE !== "--"){
									var tempHTML = [];
									var ioTotalRow = ["<tr class='content-hdr'><td class='icufs-io-lbl'><div class='icufs-row-label-left'><span class='sub-sec-title'>" + icufsI18n.TWENTY_FOUR_HOUR_TOTAL + "</span></div><div class='icufs-row-label-right'>mL</div></td>"];
									for (var l = 0; l < columnCnt; l++) {
											placeholder = "<td>&nbsp;</td>";
											if(l===curDtTmColumn ){
												placeholder = "<td class='icufs-res-curhr'>&nbsp;</td>";
											}
											ioTotalRow.push(placeholder);
									}
									var totalIdx = findColumnIndex(ioDailyTotalData.INDEX_DTTM);
									curBalNorm = "res-normal";
									if(ioDailyTotalData.VALUE_IND === "-"){
										curBalNorm = "res-severe";
									}
									var ioDailyTotalTxt = ioDailyTotalData.VALUE_IND + nf.format(ioDailyTotalData.VAL_RAW, "^."+null);
									tempHTML.push("<td class='icufs-io-day-total-rslt'><dl class='icufs-info'><dt class='icufs-val'>",icufsI18n.VALUE,":</dt><dd class='icufs-val'><span class='",curBalNorm,"'>", ioDailyTotalTxt, "</span></dd></dl></td>");
									ioTotalRow[totalIdx] = tempHTML.join("");
									htmlArr.push(ioTotalRow.join(""),"</tr>");
								}

								htmlArr.push("</table>");
								
								// Convert the HTML to a string and insert into page
								ioTab.innerHTML = htmlArr.join("");
								// Initialize hovers
								MP_Util.Doc.InitHovers("icufs-info", ioTab, component);
								// Initialize subsection expand/collapse
								initIcufsExpCol(ioTab);
							}
							else if (recordStatus === "Z") {  // No results
								ioTab.innerHTML = MP_Util.HandleNoDataResponse("");
							}
							else {  // Error
								ioTab.innerHTML = "<span class='res-none'>" + icufsI18n.ERROR_RET_RESULTS + "</span>";
							}
						}else{		//Done but not successful -> script missing or backend issue
							ioTab.innerHTML = "<span class='res-none'>" + icufsI18n.ERROR_RET_RESULTS + "</span>";
						}
						totalRenderCnt += 1;
						MP_FLWSHT_GRAPHS.resizeGraph("#flwshtBPGraph" + compId,compId);
					});

					curDtTmColumn = CERN_ICUFLOWSHEET_O1.findCurDtTmColumnIndex();	//set current date time column to highlight if viewPage = 1
				}

				/**
				 * Create the HTML for the total and individual rows for the Intake and Output subsections of I&O
				 *
				 * @param {int} ioType : The type of result. Acceptable values are 1 (input) or 2 (output)
				 * @param {object} data : the corresponding JSON structure for intake or output
				 */
				function getIORows(ioType, data) {
					var jHTML = [];
					var nf = MP_Util.GetNumericFormatter();
					var placeholder = "";
					//Construct Totals Row
					var ioTotData = data.TOTALS;
					var ioTotLen = ioTotData.length;
					var sType = "";
					if (ioType === 1) {
						sType = icufsI18n.HOURLY_INTAKE;
					}
					else {
						sType = icufsI18n.HOURLY_OUTPUT;
					}		
						
					// Begin row
					var ioTotRow = ["<table class='icufs-table icufs-io-table'><tr class='hdr'><th class='icufs-io-lbl io-sub-hd'><span class='sub-sec-hd-tgl'>&nbsp;</span><span class='sub-sec-title'><div class='icufs-row-label-left'>" + sType + "</div><div class='icufs-row-label-right'>mL</div></span></th>"];//<th class='icufs-io-unit'><span class='unit'>mL</span></th>"];
					// Populate row with appropriate number of blank cells
					for (var j = 0; j < columnCnt; j++) {
							placeholder = "<th class='icufs-io-rslt'>&nbsp;</th>";
							if(j===curDtTmColumn ){
								placeholder = "<th class='icufs-io-rslt icufs-res-curhr'>&nbsp;</th>";
							}
							ioTotRow.push(placeholder);
					}
					for (var k=0; k<ioTotLen; k++) {
						var ioHTML = [];
						var curTotal = ioTotData[k];
						var totIdx = findColumnIndex(curTotal.INDEX_DTTM);
						
						//Apply icufs-res-curhr class if the result is within the last column and today's view
						var totClass = "";
						if (totIdx === (curDtTmColumn + 1) ){
							totClass = " icufs-res-curhr";
						}

						//Construct HTML for header row
						ioHTML.push("<th class='icufs-io-rslt io-sub-hd",totClass,"'><dl class='icufs-info'><dt class='icufs-val'>",icufsI18n.VALUE,":</dt><dd class='icufs-val'><span class='res-value'>", nf.format(curTotal.VOL_TOTAL, "^."+null), "</span></span></dd></dl></th>");
						ioTotRow[totIdx] = ioHTML.join("");
					}
					jHTML.push(ioTotRow.join(""),"</tr>");
					
					// Construct Individual Result Rows	
					var ioEvtData = data.EVENTS;
					var ioEvtLen = ioEvtData.length;
					
					for (var l=0; l<ioEvtLen; l++) {
						// Begin row
						jHTML.push("<tr>");
						var ioResRow = ["<td class='icufs-io-label'><div class='icufs-row-label-left'><span class='icufs-io-rsltlbl'>"  + ioEvtData[l].EVENT_NAME + "</span></div><div class='icufs-row-label-right'>mL</div></td>"];
						
						// Populate row with appropriate number of blank cells
						for (var m = 0; m < columnCnt; m++) {
							placeholder = "<td>&nbsp;</td>";
							if(m===curDtTmColumn ){
								placeholder = "<td class='icufs-res-curhr'>&nbsp;</td>";
							}
							ioResRow.push(placeholder);
						}
										
						var ioResData = ioEvtData[l].TIME_GROUPS;
						var ioResLen = ioResData.length;
						for (var n=0; n<ioResLen; n++) {
							var ioHTML = [];
							var curRes = ioResData[n];
							var curResVal = nf.format(curRes.VOLUME, "^."+null);
							var curEvntCnt = curRes.EVENT_CNT;
							var curEvntIds = curRes.EVENT_IDS;
							var evntIdArray = [];
							var sEvntIds = "";
							
							//assemble all event_ids for use in event viewer
							for (var p=0; p<curEvntCnt; p++){
								evntIdArray.push(curEvntIds[p].ID);
							}
							sEvntIds = "[" + evntIdArray.join(".0,") + ".0]";
							
							//Verify the index to put the result in the correct time slot
							var idx = findColumnIndex(curRes.EFFECTIVE_DT_TM);
							
							//Apply icufs-res-curhr class if the result is within the last column and today's view
							var rsltClass = "";
							if (idx === (curDtTmColumn + 1) ){
								rsltClass = " icufs-res-curhr";
							}
														
							//Construct HTML for result 
							ioHTML.push("<td class='icufs-io-rlst",rsltClass,"'><dl class='icufs-info'><dt class='icufs-val'>",icufsI18n.VALUE,":</dt><dd class='icufs-val'><span class='icufs-io-rslt'><span class='res-value'>", CERN_ICUFLOWSHEET_O1.createViewerLink(crit.person_id, sEvntIds, curResVal), 
									"</span></span></dd></dl></td>"); 
							ioResRow[idx] = ioHTML.join("");
						}
						jHTML.push(ioResRow.join(""),"</tr>");
					}
					jHTML.push("</table>");
					return jHTML.join("");
				}

				function findColumnIndex (resultDate) {
					var columnIncr = 0;
					var beginDateTime = new Date(bDttm);
					var resultDt = new Date(); 
					resultDt.setISO8601(resultDate);
					var colEndDateTime = beginDateTime;

					columnIncr = lbUnits * 60/columnCnt;	//calc minute increment per column
					for(var column = 1; column <= columnCnt;column++){
						colEndDateTime.setMinutes(colEndDateTime.getMinutes()+columnIncr);
						if(resultDt < colEndDateTime){
							return column;
						}
					}
					return -1;		//column not found -> result outside view?
				}

				/**
				 * Initialize tabs (associate click events)
				 *
				 * @param {object} container : The entire ICU Flowsheet container object 
				 */
				function initTabs(container) {
					var allTabs = Util.Style.g("icufs-tab-item", container, "SPAN");
					var fsContainer = Util.gp(container);
					// Associate click events
					for (var x=allTabs.length; x--;) {
						switch (x) {
							case 0:
								Util.addEvent(allTabs[x], "click", function(){changeTab(container, 1);});
								break;
							case 1:
								Util.addEvent(allTabs[x], "click", function(){changeTab(container, 2);});
								break;
							case 2:
								Util.addEvent(allTabs[x], "click", function(){changeTab(container, 3);});
								break;
							case 3:
								Util.addEvent(allTabs[x], "click", function(){changeTab(container, 4);});
								break;
							case 4:
								Util.addEvent(allTabs[x], "click", function(){changeTab(container, 5);});
								break;
							default:
								// Do nothing
						}
					}
					// Render the temperature table
					renderEventGroupTab(fsContainer, "icufs-temp-cont", component.tempCodes, 0);
					// Render the selected tab
					changeTab(container, component.selectedTab);
				}
				
				/**
				 * Initialize subsection expand/collapse controls for the component.
				 * @param {node} par : The parent element
				 */
				function initIcufsExpCol(par) {
					var tgls = Util.Style.g("sub-sec-hd-tgl", par, "SPAN");
					var tglCnt = tgls.length;
					for (var i=tglCnt; i--;) {
						Util.addEvent(tgls[i], "click", icufsExpCol);
					}
				}
				
				/**
				 * Expand or collapse the section by adding/removing the "closed" class
				 */
				function icufsExpCol() {
					var curTable = Util.gp(Util.gp(Util.gp(this)));
					Util.Style.tcss(curTable, "closed");
				}

				/**
				 * Sort for orders by sequence number
				 */
				function bySeq(a,b) { 
					return parseInt(a.SEQ, 10) - parseInt(b.SEQ, 10); 
				}
            }
            catch (err) {
                if (timerRenderComponent) {
                    timerRenderComponent.Abort();
                    timerRenderComponent = null;
                }
                throw (err);
            }
            finally {
                if (timerRenderComponent) {
                    timerRenderComponent.Stop();
                }
            }
        },
				
		findCurDtTmColumnIndex: function() {
			var columnIncr = 0;
			var beginDateTime = new Date(bDttm);
			var curDateTime = new Date();
			var colEndDateTime = new Date();
			colEndDateTime.setTime(beginDateTime.getTime());
			var millisecondsPerSecond = 1000;
			var millisecondsPerMinute = 60 * millisecondsPerSecond;
			var millisecondsPerHour = millisecondsPerMinute * 60;
			
			columnIncr = lbUnits * millisecondsPerHour/columnCnt;	//calc millisecond increment per column
			//12 hour shift can place the graph and flowsheet in the future
			colEndDateTime.setTime(colEndDateTime.getTime() + columnIncr*columnCnt);
			//Ensure the current date/time exists within the timeframe shown so we don't unnecessarily loop through all of the columns
			if(curDateTime > beginDateTime && curDateTime < colEndDateTime){
				colEndDateTime.setTime(beginDateTime.getTime());
				for(var column = 0; column < columnCnt;column++){
					colEndDateTime.setTime(colEndDateTime.getTime()+columnIncr)
					if(curDateTime < colEndDateTime){
						return column;
					}
				}
			}
			
			return -1;		//column not found
		},

		constructTimeHdrRow: function() {
			var htmlArr = [];
			var hdf = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);					
			var columnIncr = 0;
			var colDateTime = new Date(bDttm);
			var curDateTime = new Date();
			var dummyFinalDate;
			var hrStr = "";

			// Begin row; first cell is blank
			htmlArr.push("<tr class='hdr'><th class='icufs-time-hdr-evt'>&nbsp;</th>");
			if (lbUnits === -1)
			{
			    lbUnits =12;
			}
			var millisecondsPerSecond = 1000;
			var millisecondsPerMinute = 60 * millisecondsPerSecond;
			var millisecondsPerHour = millisecondsPerMinute * 60;
			dummyFinalDate = new Date(bDttm);
			dummyFinalDate.setTime(dummyFinalDate.getTime() + lbUnits*millisecondsPerHour);
			columnIncr = lbUnits * millisecondsPerHour/columnCnt;	//calc minute increment per column

			//If/else with two seperate for loops to avoid unnecessary calculations if the current date and time doesn't fall within the range of the data set.
			if(curDateTime > colDateTime && curDateTime < dummyFinalDate){
				//Current date and time DOES fall within the range of the data set, find out which column is the current date/time
				var columnFound = false;
				for(column = 0; column < columnCnt;column++, colDateTime.setTime(colDateTime.getTime()+columnIncr)){
					if(columnFound == false){
						if(colDateTime > curDateTime){
							curDateTimeColumn = column;
						}
					}
					hrStr = "";
					hrStr = hdf.format(colDateTime, mp_formatter.DateTimeFormatter.TIME_24HOUR);
					// Remove seconds for display
					hrStr = hrStr.substring(0,5);
					// Add header cell
					htmlArr.push("<th class='icufs-time-hdr-tm'>", hrStr, "</th>");
				}
			}
			else{
				//Current date and time does NOT fall within the range of the data set.
				for(column = 0; column < columnCnt;column++, colDateTime.setTime(colDateTime.getTime()+columnIncr)){
					hrStr = "";
					hrStr = hdf.format(colDateTime, mp_formatter.DateTimeFormatter.TIME_24HOUR);
					// Remove seconds for display
					hrStr = hrStr.substring(0,5);
					// Add header cell
					htmlArr.push("<th class='icufs-time-hdr-tm'>", hrStr, "</th>");
				}
			}
			htmlArr.push("</tr>");
			return htmlArr.join("");
		},

		/**
		 * Returns the normalcy class that corresponds to the provided meaning
		 * @param {string} meaning : The CDF meaning for the normalcy code
		 * 
		 * @return {string} : The HTML class for the normalcy meaning provided
		 */
		getNormalcyClass: function(meaning){
			var normalcy = "";
			switch(meaning) {
				case "LOW":
					normalcy = "res-low";
					break;
				case "HIGH":
					normalcy = "res-high";
					break;
				case "CRITICAL":
				case "EXTREMEHIGH":
				case "PANICHIGH":
				case "EXTREMELOW":
				case "PANICLOW":
				case "VABNORMAL":
				case "POSITIVE":
					normalcy = "res-severe";
					break;
				case "ABNORMAL":
					normalcy = "res-abnormal";
					break;
				default:
					normalcy = "res-normal";
			}
			return normalcy;
		},
				
		getMultipleIndicator: function(meanings) {
			var prevHTML = "";
			var meanLen = meanings.length;
					// Logic and HTML not needed if there is only one result
			if (meanLen > 1) {
				var prevClass = "res-normal";					
				var meanIdx = meanLen-1;
				var normFlag = 0;
						// Evaluate all results except the first; evaluation can be stop if a critical result is found
				while (meanIdx > 0 && normFlag < 4) {
					var curMean = meanings[meanIdx];
					var tempClass = CERN_ICUFLOWSHEET_O1.getNormalcyClass(curMean);
							var tempNormFlag = 0;  // Flag for severity, higher number = higher severity
					switch(tempClass) {
						case "res-severe":
								tempNormFlag = 4;
							break;
						case "res-high":
								tempNormFlag = 3;
							break;
						case "res-low":
								tempNormFlag = 2;
							break;
						case "res-abnormal":
								tempNormFlag = 1;
							break;
						default:
								tempNormFlag = 0;
					}
					
							// Set flag and class if current severity is highest severity found to date
					if (tempNormFlag > normFlag) {
						normFlag = tempNormFlag;
						prevClass = tempClass;
					}
					meanIdx--;
				}
				prevHTML = "<span class='res-multiple'>[<span class='" + prevClass + "'>" + meanLen + "</span>]</span>";
			}
			return prevHTML;
		},

		scrollData: function(direction,compId,nxtBt){
			if(totalRenderCnt < maxRenderCnt){
				return;
			}
			maxRenderCnt = 0;
			totalRenderCnt = 0;
			var graphData = MP_FLWSHT_GRAPHS.getGraphDataByComponentId(compId);
			if(graphData.gPlots.length > 0){
				graphData.gPlots.splice(0, 1);
			}
			if(direction === "+"){
				viewPage++;
			}else{
				viewPage--;
			}
			if (nxtBt)
			{
				compObj.sNextButton = "true";
			}
			compObj.InsertData();
		},

		/**
		 * Build the HTML for linking to the result viewer
		 * @param {float} pId : The Person ID for the patient
		 * @param {string} evtIds : The event ID(s) of the event(s) to display
		 * @param {string} disp : The value to display in the link
		 * 
		 * @return {string} : The HTML for linking to the result viewer for the value
		 */
		createViewerLink: function(pId, evtIds, disp) {
			var valLink = "<a onclick='MP_Util.LaunchClinNoteViewer(" + pId + ".0, 0.0, " + evtIds + ", \"EVENT\", 0.0); return false;' href='#'>" + disp + "</a>";
			return valLink;
		},
		selectShiftViewTime: function(viewHours,compId){
		
            if ( compObj.getShiftSelected())    // Shift based time frame already clicked.... return
            {              
                return;
            }
			compObj.setShiftSelected("true");
			
			maxRenderCnt = 0;
			totalRenderCnt = 0;
			var pageIncr = 0;
			var graphData = MP_FLWSHT_GRAPHS.getGraphDataByComponentId(compId);
			if(graphData.gPlots.length > 0){
				graphData.gPlots.splice(0, 1);
			}
			//calculate view page for new view hours to nearest boundry of end time of the current view
			pageIncr = Math.floor(((viewPage - 1)* compObj.shiftStrHour)/12);
			pageIncr++;
			viewPage = pageIncr;		//set new timeframe view to nearest boundry of end time of the current view
			compObj.setDefaultTimeframe(-1);        // -1 time frame indicates shift based time frame
			compObj.setSelectedTimeFrame(-1);
			MP_Core.AppUserPreferenceManager.SaveCompPreferences(compId);
			compObj.InsertData();
	    },

		selectViewTime: function(viewHours,compId){
			if( (viewHours === lbUnits && !compObj.getShiftSelected()) || (totalRenderCnt < maxRenderCnt)){
				return;
			}
			
			compObj.setShiftSelected(null);
			maxRenderCnt = 0;
			totalRenderCnt = 0;
			var pageIncr = 0;
			var graphData = MP_FLWSHT_GRAPHS.getGraphDataByComponentId(compId);
			if(graphData.gPlots.length > 0){
				graphData.gPlots.splice(0, 1);
			}
			//calculate view page for new view hours to nearest boundry of end time of the current view
			pageIncr = Math.floor(((viewPage - 1)*lbUnits)/viewHours);
			pageIncr++;
			viewPage = pageIncr;		//set new timeframe view to nearest boundry of end time of the current view
			compObj.setDefaultTimeframe(viewHours);
			compObj.setSelectedTimeFrame(viewHours);
			MP_Core.AppUserPreferenceManager.SaveCompPreferences(compId);
			compObj.InsertData();
		}
	};

	function CreateDateParameter(date){
		var day = date.getDate();
		if(day < 10){
			day = "0" + day;
		}
		var mon = date.getMonth();
		var year = date.getFullYear();
		var hours = date.getHours();
		if(hours < 10){
			hours = "0" + hours;
		}
		var mins = date.getMinutes();
		if(mins < 10){
			mins = "0" + mins;
		}
		var secs = date.getSeconds();
		if(secs < 10){
			secs = "0" + secs;
		}
		var msec = date.getMilliseconds();
		if(msec < 10){
			msec = "0" + msec;
		}
		var month = "";
		var rest = year + " " + hours + ":" + mins + ":" + secs + ":" + msec;
		switch (mon){
			case (0):
				month = "JAN";
				break;
			case (1):
				month = "FEB";
				break;
			case (2):
				month = "MAR";
				break;
			case (3):
				month = "APR";
				break;
			case (4):
				month = "MAY";
				break;
			case (5):
				month = "JUN";
				break;
			case (6):
				month = "JUL";
				break;
			case (7):
				month = "AUG";
				break;
			case (8):
				month = "SEP";
				break;
			case (9):
				month = "OCT";
				break;
			case (10):
				month = "NOV";
				break;
			case (11):
				month = "DEC";
				break;
			default:
				alert("unknown month");
		}
		return (day + "-" + month + "-" + rest);
	}
}();

Date.ABBR_MONTHNAMES = [];
Date.MONTHNAMES = [];

var MP_FLWSHT_GRAPHS = function(){
    var m_graphDataAr = [];

    function GraphDataItem(componentId) {
        if (componentId <= 0) {
            alert("'componentId' must be greater than zero.");
            return;
        }
        this.componentId = componentId;
        this.gPlots = [];
        this.isZoomed = false;
        this.invLines = [];
        this.invSys = [];
        this.invDia = [];
        this.invMAP = [];
        this.tInv = [];
        this.tInvMAP = [];
        this.nonLines = [];
        this.nonSys = [];
        this.nonDia = [];
        this.nonMAP = [];
        this.tNon = [];
        this.tNonMAP = [];
        this.hrtRate = [];
        this.bpValuesShown = '';
        this.tData = [];
        this.curWidth = 0;
        this.widthInit = 1;
    }

	return {

		/**
		 * This function displays a blood pressure whisker graph with radio buttons for each series according to user specifications.
		 *		NOTES: 	* Time data points must have the timestamp set to a Non-UTC value.
		 *				* Page must be loaded and DOM created before running this function.
		 *				* Colors/shapes will be defined in function, but can be overridden by setting in the series.
		 *				* Series 1 is Systolic Invasive, Series 2 is Diastolic Invasive, Series 3 is Systolic Non-Invasive, Series 4 is Diastolic Non-Invasive, Series 5 is 
		 *					MAP Invasive, and Series 6 is MAP Non-invasive
		 *				* MAP will be calculated on the fly using the equation if no values are provided (2*DBP + SBP)/2
		 * 
		 * @param {Value} compId: calling component ID. REQUIRED
		 * @param {String} iId: DOM Id of main graph. REQUIRED
		 * @param {String} iRBtns: DOM Id of radio button select. If null or blank, then it is not shown
		 * @param {String} assignedTo: variable name that this function is going to return the "plot" to.
		 * @param {Array} iDataSeries: format [[[[xData,yData,normLowHTML,normHighHTML,critLowHTML,critHighHTML]],seriesOptionObject (see jqPlotOptions.txt => seriesDefault)]]
		 * @param {Object} iX1AxisObj: x Axis 1 Options object. Will be on bottom of graph. Null will not show axis. (see jqPlotOptions.txt => axesDefault)
		 * @param {Object} iX2AxisObj: x Axis 2 Options object. Will be on top of graph. REQUIRED. (see jqPlotOptions.txt => axesDefault)
		 * @param {Object} iYAxisObj: y Axis 1 Options object. Will be to the left of graph. REQUIRED. (see jqPlotOptions.txt => axesDefault)
		 * @param {Object} iY2AxisObj: y Axis 2 Options object. Will be to the right of graph. (see jqPlotOptions.txt => axesDefault)
		 * @author Brian Heits
		 */
		drawWhiskerGraph : function( compId, iId, iRBtns, assignedTo, iDataSeries, iXAxisObj, iX2AxisObj, iYAxisObj, iY2AxisObj )
		{
			var icufsI18n = i18n.discernabu.icu_flowsheet_o1;
			Date.ABBR_MONTHNAMES.push([i18n.JANUARY[0],i18n.FEBRUARY[0],i18n.MARCH[0],i18n.APRIL[0],i18n.MAY[0],i18n.JUNE[0],i18n.JULY[0],i18n.AUGUST[0],i18n.SEPTEMBER[0],i18n.OCTOBER[0],i18n.NOVEMBER[0],i18n.DECEMBER[0]]);
			Date.MONTHNAMES.push([i18n.JANUARY[1],i18n.FEBRUARY[1],i18n.MARCH[1],i18n.APRIL[1],i18n.MAY[1],i18n.JUNE[1],i18n.JULY[1],i18n.AUGUST[1],i18n.SEPTEMBER[1],i18n.OCTOBER[1],i18n.NOVEMBER[1],i18n.DECEMBER[1]]);
		
			var tPlot = null, sSeries = [], bSeries = [], bHTML = [], sCnt = 0;
			var bpColors = ["#E41A1C","#E41A1C","#E41A1C","#E41A1C","#104404","#000064","#011214"];
			var bpShapes = ["downVee","upVee","downVee","upVee","filledCircle","filledCircle","filledTriangleUp"];
			var graphData = MP_FLWSHT_GRAPHS.getGraphDataByComponentId(compId);
			var wDataInv = [];
			var wDataNon = [];
			
			/* Determining min and max values */
			var maxSys = [Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY], maxDia = [Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY], 
				maxMAP = [Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY], maxHRT = [Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY];
			var minSys = [Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY], minDia = [Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY], 
				minMAP = [Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY], minHRT = [Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY];
				
			/* setting up different events to be assigned to more recognizible variables */
			graphData.invSys = iDataSeries[0][0].sort(MP_FLWSHT_GRAPHS.dateSort);
			graphData.invDia = iDataSeries[1][0].sort(MP_FLWSHT_GRAPHS.dateSort);
			graphData.invMAP = iDataSeries[4][0].sort(MP_FLWSHT_GRAPHS.dateSort);
			graphData.nonSys = iDataSeries[2][0].sort(MP_FLWSHT_GRAPHS.dateSort);
			graphData.nonDia = iDataSeries[3][0].sort(MP_FLWSHT_GRAPHS.dateSort);
			graphData.nonMAP = iDataSeries[5][0].sort(MP_FLWSHT_GRAPHS.dateSort);
			graphData.hrtRate = iDataSeries[6][0].sort(MP_FLWSHT_GRAPHS.dateSort);
			
			/* Finding Matched Sys and Dia values.  If found and MAP array length is zero, calculate MAP */
			var invSysLen = graphData.invSys.length, invDiaLen = graphData.invDia.length, invMAPLen = graphData.invMAP.length;
			var nonSysLen = graphData.nonSys.length, nonDiaLen = graphData.nonDia.length, nonMAPLen = graphData.nonMAP.length;
			var hrLen = graphData.hrtRate.length;
			var maxInvL = Math.max(invSysLen,invDiaLen), invSysIsLonger = (maxInvL == invSysLen), minInvL = ((invSysIsLonger)?invDiaLen:invSysLen);
			var maxNonL = Math.max(nonSysLen,nonDiaLen), nonSysIsLonger = (maxNonL == nonSysLen), minNonL = ((nonSysIsLonger)?nonDiaLen:nonSysLen);
			var i=0;
			var j=0;
			var matchFnd = false;
			
			/* Performing matching for Invasive BP values */
			for (i=0; i<maxInvL; i++)
			{
				matchFnd = false;
				for (j=0; j<minInvL; j++)
				{
					if (invSysIsLonger)
					{
						if (graphData.invSys[i][6] == graphData.invDia[j][6] && graphData.invSys[i][7] == graphData.invDia[j][7])
						{
							matchFnd = true;
							graphData.invLines.push([graphData.invSys[i][0], graphData.invSys[i][0], graphData.invSys[i][1], graphData.invDia[j][1]]);
							graphData.tInv.push([graphData.invSys[i][0],[graphData.invSys[i][1],"/",graphData.invDia[j][1]].join("")]);
							wDataInv.push([graphData.invSys[i][0], graphData.invSys[i][1], graphData.invDia[j][1]]);
						}
						else if (graphData.tInv.length===0 || graphData.tInv[graphData.tInv.length-1][0]<graphData.invDia[j][0])
						{
							graphData.tInv.push([graphData.invDia[j][0],["--/",graphData.invDia[j][1]].join("")]);
						}
						maxDia[0] = Math.max(maxDia[0],graphData.invDia[j][1]);
						minDia[0] = Math.min(minDia[0],graphData.invDia[j][1]);
					}
					else if (!invSysIsLonger)
					{
						if (graphData.invSys[j][6] == graphData.invDia[i][6] && graphData.invSys[j][7] == graphData.invDia[i][7])
						{
							matchFnd = true;
							graphData.invLines.push([graphData.invSys[j][0], graphData.invSys[j][0], graphData.invSys[j][1], graphData.invDia[i][1]]);
							graphData.tInv.push([graphData.invSys[j][0],[graphData.invSys[j][1],"/",graphData.invDia[i][1]].join("")]);
							wDataInv.push([graphData.invSys[j][0], graphData.invSys[j][1], graphData.invDia[i][1]]);
						}
						else if (graphData.tInv.length===0 || graphData.tInv[graphData.tInv.length-1][0]<graphData.invSys[j][0])
						{
							graphData.tInv.push([graphData.invSys[j][0],[graphData.invSys[j][1],"/--"].join("")]);
						}
						maxSys[0] = Math.max(maxSys[0],graphData.invSys[j][1]);
						minSys[0] = Math.min(minSys[0],graphData.invSys[j][1]);
					}
				}
				if (invSysIsLonger)
				{
					if (!matchFnd)
					{
						graphData.tInv.push([graphData.invSys[i][0],[graphData.invSys[i][1],"/--"].join("")]);
					}
					maxSys[0] = Math.max(maxSys[0],graphData.invSys[i][1]);
					minSys[0] = Math.min(minSys[0],graphData.invSys[i][1]);
				}
				else
				{
					if (!matchFnd)
					{
						graphData.tInv.push([graphData.invDia[i][0],["--/",graphData.invDia[i][1]].join("")]);
					}
					maxDia[0] = Math.max(maxDia[0],graphData.invDia[i][1]);
					minDia[0] = Math.min(minDia[0],graphData.invDia[i][1]);
				}
			}

			/* Storing MAP values for Invasive if they exist and finding their min and max */
			for (i=0;i<invMAPLen;i++)
			{
				graphData.tInvMAP.push([graphData.invMAP[i][0],graphData.invMAP[i][1],graphData.invMAP[i][2],graphData.invMAP[i][3],graphData.invMAP[i][4],graphData.invMAP[i][5],graphData.invMAP[i][6],graphData.invMAP[i][7]]);
				maxMAP[0] = Math.max(maxMAP[0],graphData.tInvMAP[graphData.tInvMAP.length-1][1]);
				minMAP[0] = Math.min(minMAP[0],graphData.tInvMAP[graphData.tInvMAP.length-1][1]);
			}
			
			/* Performing matching for Non-Invasive BP values */
			for (i=0; i<maxNonL; i++)
			{
				matchFnd = false;
				for (j=0; j<minNonL; j++)
				{
					if (nonSysIsLonger)
					{
						if (graphData.nonSys[i][6] == graphData.nonDia[j][6] && graphData.nonSys[i][7] == graphData.nonDia[j][7])
						{
							matchFnd = true;
							graphData.nonLines.push([graphData.nonSys[i][0], graphData.nonSys[i][0], graphData.nonSys[i][1], graphData.nonDia[j][1]]);
							graphData.tNon.push([graphData.nonSys[i][0],[graphData.nonSys[i][1],"/",graphData.nonDia[j][1]].join("")]);
							wDataNon.push([graphData.nonSys[i][0], graphData.nonSys[i][1], graphData.nonDia[j][1]]);
						}
						else if (graphData.tNon.length===0 || graphData.tNon[graphData.tNon.length-1][0]<graphData.nonDia[j][0])
						{
							graphData.tNon.push([graphData.nonDia[j][0],["--/",graphData.nonDia[j][1]].join("")]);
						}
						maxDia[1] = Math.max(maxDia[1],graphData.nonDia[j][1]);
						minDia[1] = Math.min(minDia[1],graphData.nonDia[j][1]);
					}
					else if (!nonSysIsLonger)
					{
						if (graphData.nonSys[j][6] == graphData.nonDia[i][6] && graphData.nonSys[j][7] == graphData.nonDia[i][7])
						{
							matchFnd = true;
							graphData.nonLines.push([graphData.nonSys[j][0], graphData.nonSys[j][0], graphData.nonSys[j][1], graphData.nonDia[i][1]]);
							graphData.tNon.push([graphData.nonSys[j][0],[graphData.nonSys[j][1],"/",graphData.nonDia[i][1]].join("")]);
							wDataNon.push([graphData.nonSys[j][0], graphData.nonSys[j][1], graphData.nonDia[i][1]]);
						}
						else if (graphData.tNon.length===0 || graphData.tNon[graphData.tNon.length-1][0]<graphData.nonSys[j][0])
						{
							graphData.tNon.push([graphData.nonSys[j][0],[graphData.nonSys[j][1],"/--"].join("")]);
						}
						maxSys[1] = Math.max(maxSys[1],graphData.nonSys[j][1]);
						minSys[1] = Math.min(minSys[1],graphData.nonSys[j][1]);
					}
				}
				if (nonSysIsLonger)
				{
					if (!matchFnd)
					{
						graphData.tNon.push([graphData.nonSys[i][0],[graphData.nonSys[i][1],"/--"].join("")]);
					}
					maxSys[1] = Math.max(maxSys[1],graphData.nonSys[i][1]);
					minSys[1] = Math.min(minSys[1],graphData.nonSys[i][1]);
				}
				else
				{
					if (!matchFnd)
					{
						graphData.tNon.push([graphData.nonDia[i][0],["--/",graphData.nonDia[i][1]].join("")]);
					}
					maxDia[1] = Math.max(maxDia[1],graphData.nonDia[i][1]);
					minDia[1] = Math.min(minDia[1],graphData.nonDia[i][1]);
				}
			}

			/* Storing MAP values for Non-Invasive if they exist and finding their min and max */
			for (i=0;i<nonMAPLen;i++)
			{
				graphData.tNonMAP.push([graphData.nonMAP[i][0],graphData.nonMAP[i][1],graphData.nonMAP[i][2],graphData.nonMAP[i][3],graphData.nonMAP[i][4],graphData.nonMAP[i][5],graphData.nonMAP[i][6],graphData.nonMAP[i][7]]);
				maxMAP[1] = Math.max(maxMAP[1],graphData.tNonMAP[graphData.tNonMAP.length-1][1]);
				minMAP[1] = Math.min(minMAP[1],graphData.tNonMAP[graphData.tNonMAP.length-1][1]);
			}
			
			/* Sorting incase of date order issues on table data */
			graphData.tInv.sort(MP_FLWSHT_GRAPHS.dateSort);
			graphData.tInvMAP.sort(MP_FLWSHT_GRAPHS.dateSort);
			graphData.tNon.sort(MP_FLWSHT_GRAPHS.dateSort);
			graphData.tNonMAP.sort(MP_FLWSHT_GRAPHS.dateSort);
		
			/* Heart rate - finding the min and max */
			for (i=0;i<hrLen;i++)
			{
				maxHRT[1] = Math.max(maxHRT[1],graphData.hrtRate[i]);
				minHRT[1] = Math.min(minHRT[1],graphData.hrtRate[i]);
			}
			var invShow = true, nonShow = !invShow;
			graphData.bpValuesShown='inv';
			/* creating buttons for BP events */
			if (iRBtns && assignedTo){
				if (graphData.hrtRate.length > 0)
				{
					var sCnt = 6;
					bHTML.push(	"<div class='icufs-btn-select'><div onclick=\"MP_FLWSHT_GRAPHS.selectSeries(this,1,",assignedTo,", \'icufs-filledtriangleup\');\" id='",
							iRBtns,"btn_",sCnt,
							"' class='icufs-btn icufs-series-on icufs-graph-icon-sprite icufs-filledtriangleup'>",
							"<canvas id='",iRBtns,"canvas_",sCnt,"'></canvas>",
							"</div>&nbsp;<span>",iDataSeries[sCnt][1].label,"<span id='minMax",iId,"_",sCnt,"'></span></span></div>");
				}

				if (graphData.invSys.length > 0 || graphData.invDia.length > 0 || graphData.invMAP.length > 0)
				{
					bHTML.push(	"<div class='icufs-rbtn'><input type='radio'",((invShow)?" checked='checked'":"")," name='bpVal' value='inv' onclick='MP_FLWSHT_GRAPHS.showBPData(this,",
								assignedTo,",",compId,");'/>&nbsp;",icufsI18n.A_LINE,"</div>",
								"<div id='bp_inv",compId,"'><div class='icufs-rbtn-data'><canvas id='",iRBtns,"canvas_0'></canvas>&nbsp;<span>", icufsI18n.SBP, "</span><span id='minMax",
								iId,"_0'></span></div>",
								"<div class='icufs-rbtn-data'><canvas id='",iRBtns,"canvas_2'></canvas>&nbsp;<span>", icufsI18n.MAP, "</span><span id='minMax",iId,"_2'></span></div>",
								"<div class='icufs-rbtn-data'><canvas id='",iRBtns,"canvas_1'></canvas>&nbsp;<span>", icufsI18n.DBP, "</span><span id='minMax",iId,"_1'></span></div></div>");
				}
				if (graphData.nonSys.length > 0 || graphData.nonDia.length > 0 || graphData.nonMAP.length > 0)
				{
					if (graphData.invSys.length === 0 && graphData.invDia.length === 0 && graphData.invMAP.length === 0)
					{
						nonShow = true;
						invShow = false;
						graphData.bpValuesShown='non';
					}
					bHTML.push(	"<div class='icufs-rbtn'><input type='radio'",((nonShow)?" checked='checked'":"")," name='bpVal' value='non' onclick='MP_FLWSHT_GRAPHS.showBPData(this,",
								assignedTo,",",compId,");'/>&nbsp;",icufsI18n.CUFF,"</div>",
								"<div id='bp_non",compId,"'><div class='icufs-rbtn-data'><canvas id='",iRBtns,"canvas_3'></canvas>&nbsp;<span>", icufsI18n.SBP, "</span><span id='minMax",
								iId,"_3'></span></div>",
								"<div class='icufs-rbtn-data'><canvas id='",iRBtns,"canvas_5'></canvas>&nbsp;<span>", icufsI18n.MAP, "</span><span id='minMax",iId,"_5'></span></div>",
								"<div class='icufs-rbtn-data'><canvas id='",iRBtns,"canvas_4'></canvas>&nbsp;<span>", icufsI18n.DBP, "</span><span id='minMax",iId,"_4'></span></div></div>");
				}
				$("#"+iRBtns).html(bHTML.join(""));
			}
			var sSeries = [
			{xaxis:'x2axis',minY:((minSys[0] != Number.POSITIVE_INFINITY)?minSys[0]:null),maxY:((maxSys[0] != Number.NEGATIVE_INFINITY)?maxSys[0]:null),
			showLine:false,show:invShow,label:icufsI18n.SBP+" "+iDataSeries[0][1].uom,color:bpColors[0],
			markerOptions:{whiskerData:wDataInv,shadow:false,lineWidth:1,size:6,style:bpShapes[0]},pointLabels:{show:false}},/*invSys*/

			{xaxis:'x2axis',minY:((minDia[0] != Number.POSITIVE_INFINITY)?minDia[0]:null),maxY:((maxDia[0] != Number.NEGATIVE_INFINITY)?maxDia[0]:null),
			showLine:false,show:invShow,label:icufsI18n.DBP+" "+iDataSeries[1][1].uom,color:bpColors[1],
			markerOptions:{shadow:false,lineWidth:1,size:6,style:bpShapes[1]},pointLabels:{show:false}},/*invDia*/

			{xaxis:'x2axis',minY:((minMAP[0] != Number.POSITIVE_INFINITY)?minMAP[0]:null),maxY:((maxMAP[0] != Number.NEGATIVE_INFINITY)?maxMAP[0]:null),
			showLine:false,show:invShow,label:icufsI18n.MAP+" "+iDataSeries[4][1].uom,color:bpColors[4],
			markerOptions:{shadow:false,lineWidth:1,size:6,style:bpShapes[4]},pointLabels:{show:false}},/*invMAP*/

			{xaxis:'x2axis',minY:((minSys[1] != Number.POSITIVE_INFINITY)?minSys[1]:null),maxY:((maxSys[1] != Number.NEGATIVE_INFINITY)?maxSys[1]:null),
			showLine:false,show:nonShow,label:icufsI18n.SBP+" "+iDataSeries[2][1].uom,color:bpColors[2],
			markerOptions:{whiskerData:wDataNon,shadow:false,lineWidth:1,size:6,style:bpShapes[2]},pointLabels:{show:false}},/*nonSys*/

			{xaxis:'x2axis',minY:((minDia[1] != Number.POSITIVE_INFINITY)?minDia[1]:null),maxY:((maxDia[1] != Number.NEGATIVE_INFINITY)?maxDia[1]:null),
			showLine:false,show:nonShow,label:icufsI18n.DBP+" "+iDataSeries[3][1].uom,color:bpColors[3],
			markerOptions:{shadow:false,lineWidth:1,size:6,style:bpShapes[3]},pointLabels:{show:false}},/*nonDia*/

			{xaxis:'x2axis',minY:((minMAP[1] != Number.POSITIVE_INFINITY)?minMAP[1]:null),maxY:((maxMAP[1] != Number.NEGATIVE_INFINITY)?maxMAP[1]:null),
			showLine:false,show:nonShow,label:icufsI18n.MAP+" "+iDataSeries[5][1].uom,color:bpColors[5],
			markerOptions:{shadow:false,lineWidth:1,size:6,style:bpShapes[5]},pointLabels:{show:false}},/*nonMAP*/

			{xaxis:'x2axis',minY:((minHRT[0] != Number.POSITIVE_INFINITY)?minHRT[0]:null),maxY:((maxHRT[0] != Number.NEGATIVE_INFINITY)?maxHRT[0]:null),
			shadow:false,lineWidth:1,showLine:true,show:true,label:icufsI18n.HEART_RATE+" "+iDataSeries[6][1].uom,color:bpColors[6],
			markerOptions:{shadow:false,lineWidth:1,size:6,style:bpShapes[6]},pointLabels:{show:false}}];/*heart rate*/

			MP_FLWSHT_GRAPHS.updateYAxis( sSeries, iYAxisObj);
			MP_FLWSHT_GRAPHS.resizeGraph("#"+iId,compId);
			
			/* plotting graph */
			tPlot = $.jqplot(iId, [graphData.invSys,graphData.invDia,graphData.invMAP,graphData.nonSys,graphData.nonDia,graphData.nonMAP,graphData.hrtRate],{
				graphName: 'flwshtBPGraph',
				performOnPlot: function(){
					MP_FLWSHT_GRAPHS.resizeGraph(tPlot.targetId,compId);
					MP_FLWSHT_GRAPHS.findMinMax(tPlot,compId);
				},
				performAfterPlot: function(){MP_FLWSHT_GRAPHS.drawWhiskerLines(tPlot,compId);},
				seriesDefaults:{neighborThreshold:0},
				cursor:{
					zoom:true,
					showTooltip:false,
					constrainZoomTo: 'x',
					snapZoomTo: 'minutes',
					dblClickReset: false, 
					performAfterZoom: function(){
						tPlot.redraw();
						MP_FLWSHT_GRAPHS.findMinMax(tPlot,compId);
						MP_FLWSHT_GRAPHS.drawWhiskerLines(tPlot,compId);
					}, 
					performOnZoom: function(){graphData.isZoomed = true;}
				},
				grid: {
					borderColor: "#000000",
					shadow: false
				},
				axes: {
					xaxis:iXAxisObj,
					x2axis:iX2AxisObj,
					yaxis:iYAxisObj,
					y2axis:iY2AxisObj
				},
				highlighter: {
					showMarker:false,
					sizeAdjust: 10,
					tooltipAxes: 'x',		//this is ordered for the %s replacements in the formatString below
					tooltipLocation: 'nw',
					fadeTooltip: true,
					tooltipFadeSpeed: "fast",
					useAxesFormatters: true,
					formatString: ["<span class='icufs-bp-range-txt'>%l:</span>&nbsp;%1<br /><span class='icufs-bp-range-txt'>",icufsI18n.RESULT_DT_TM,":</span>&nbsp;%6%2%3"].join("")
				},
				legend:{show: false},
				series:sSeries
			});
			
			/* creating shapes for legend */
			for (i=0; iRBtns != null && assignedTo != null && iRBtns !== "" && i < 7; i++){
				var cObj = _g(iRBtns+"canvas_"+i);
				if (cObj != null)
				{
					try {
							G_vmlCanvasManager.initElement(cObj);	
					}
					catch(err) {
						// Do Nothing
					}
					
					var context = cObj.getContext('2d');
					var bMarker = new $.jqplot.MarkerRenderer();
					bMarker.init({shadow:false,lineWidth:1,size:6,color:tPlot.series[i].color,style:tPlot.series[i].markerOptions.style});
					bMarker.draw(7,7,context,{});
					if (i==5 && (graphData.invSys.length > 0 || graphData.invDia.length > 0 || graphData.invMAP.length > 0)){
						$("#bp_non"+compId).addClass("closed");
					}
				}	
			}
			MP_FLWSHT_GRAPHS.drawWhiskerLines(tPlot,compId);
			MP_FLWSHT_GRAPHS.findMinMax(tPlot,compId);
			
			$(window).resize(function(){
				var checkSavedScrollbarSetting = true; //The order of resizing is different, so scrollbars may show up/be removed during the course of a resize, but upon finalization of resizing, it will keep the same properties as before.
				MP_FLWSHT_GRAPHS.resizeGraph("#flwshtBPGraph" + compId,compId,checkSavedScrollbarSetting);
			});
			return tPlot;
		},

		resetZoom : function(compId)
		{
			var graphData = MP_FLWSHT_GRAPHS.getGraphDataByComponentId(compId);
			if (graphData.isZoomed)
			{
				var p = graphData.gPlots[0];
				graphData.isZoomed = false;
				p.plugins.cursor.resetZoom(p,p.plugins.cursor);
				MP_FLWSHT_GRAPHS.updateYAxis( p.series, p.axes.yaxis );
			}
		},

		selectSeries : function( iBtn, mSelected, plot )
		{
			var p = plot;
			var numSelected = 0;
			for (var i=0,sLen=p.series.length;i<sLen;i++)
			{
				if (p.series[i].show){
					numSelected++;
				}
			}
			
			if (p != null)
			{
				var actionNeeded = false;
				if (iBtn != null && iBtn !== "")
				{
					var idSplit = iBtn.id.split("_");
					var index = idSplit[1];
					if (!p.series[index].show && numSelected != mSelected)
					{
						iBtn.className = "icufs-btn icufs-series-on icufs-graph-icon-sprite icufs-filledtriangleup";
						p.series[index].show = true;
						actionNeeded = true;
					}
					else if (p.series[index].show)
					{
						iBtn.className = "icufs-btn icufs-series-off icufs-graph-icon-sprite icufs-filledtriangleup";
						p.series[index].show = false;
						actionNeeded = true;
					}
				}
				if (actionNeeded)
				{
					MP_FLWSHT_GRAPHS.updateYAxis( p.series, p.axes.yaxis );
					p.redraw();
				}
			}
			return true;
		},

		/* helper function for drawWhiskerGraph */
		showBPData : function(iObj, iPlot, componentId)
		{
			var graphData = MP_FLWSHT_GRAPHS.getGraphDataByComponentId(componentId);
			var bpInvID = "bp_inv" + componentId;
			var bpNonID = "bp_non" + componentId;
			var i;
			if (iObj.value === "inv") {
				_g(bpInvID).className = "";
				var nonObj = _g(bpNonID);
				if (nonObj != null){
					nonObj.className = "closed";
				}
				graphData.bpValuesShown = 'inv';
				for (i=0;i<3;i++)
				{
					iPlot.series[i].show = true;
				}
				for (i=3;i<6;i++)
				{
					iPlot.series[i].show = false;
				}
				MP_FLWSHT_GRAPHS.updateYAxis( iPlot.series, iPlot.axes.yaxis);
				iPlot.redraw();
			}
			else if (iObj.value === "non") {
				_g(bpNonID).className = "";
				var invObj = _g(bpInvID);
				if (invObj != null){
					invObj.className = "closed";
				}
				graphData.bpValuesShown = 'non';
				for (i=0;i<3;i++)
				{
					iPlot.series[i].show = false;
				}
				for (i=3;i<6;i++)
				{
					iPlot.series[i].show = true;
				}
				MP_FLWSHT_GRAPHS.updateYAxis( iPlot.series, iPlot.axes.yaxis);
				iPlot.redraw();
			}
		},

		dateSort: function (thisObj, thatObj) {
			return thisObj[0] - thatObj[0];
		},

		getGraphDataByComponentId: function (componentId) {
			var retItem = m_graphDataAr[componentId];
			if (!retItem) {
				retItem = new GraphDataItem(componentId);
				m_graphDataAr[componentId] = retItem;
			}
			return retItem;
		},
		
		addGraphData: function (graphData) {
			m_graphDataAr[graphData.componentId] = graphData;
		},
		
		// function to calculate the precision of the value being plotted
		calculatePrecision: function (valRes) {
			var precision = 0;
			var strVal = valRes + '';
			var decLoc = strVal.search(/\.(\d)/);  						//locate the decimal point
			if (decLoc !== -1) {
				var strSize = strVal.length;
				precision = strSize - decLoc - 1;
			}
			return precision;
		},
		
		// function to format numeric values
		formatResult: function (valRes) {
			var nf = new mp_formatter.NumericFormatter(MPAGE_LOCALE);
			var result = 0.0;
			if (!isNaN(valRes)) {
				var prec = MP_FLWSHT_GRAPHS.calculatePrecision(valRes);
				result = nf.format(valRes, "." + prec);
			}
			else {
				result = null;
			}
			return result;
		},
		
		/* helper function for drawWhiskerGraph */
		findMinMax: function (iPlot, compId) {
			var xAxis = iPlot.axes.x2axis;
			for (var i=0,sLen=iPlot.series.length;i<sLen;i++){
				var normRangeObj = _g("minMax"+iPlot.targetId.replace(/\#/,"")+"_"+i);
				if (normRangeObj)
				{
					var pAxis = iPlot.series[i].xaxis;
					var minX = iPlot.axes[pAxis].min, maxX = iPlot.axes[pAxis].max;
					var minY = Number.POSITIVE_INFINITY;
					var maxY = Number.NEGATIVE_INFINITY;
					var tempMinY = minY;
					var tempMaxY = maxY;
					
					for (var j=0,dLen=iPlot.series[i].data.length;j<dLen;j++)
					{
						if (parseInt(iPlot.series[i].data[j][0], 10)>=minX && parseInt(iPlot.series[i].data[j][0], 10)<=maxX)
						{
							if (parseFloat(iPlot.series[i].data[j][1]) < minY) {
								tempMinY = iPlot.series[i].data[j][1];
									minY = MP_FLWSHT_GRAPHS.formatResult(parseFloat(Math.round(tempMinY * 10) / 10));
							}
							if (parseFloat(iPlot.series[i].data[j][1]) > maxY) {
								tempMaxY = iPlot.series[i].data[j][1];
									maxY = MP_FLWSHT_GRAPHS.formatResult(parseFloat(Math.round(tempMaxY * 10) / 10));
							}
						}
					}
					if (minY != Number.POSITIVE_INFINITY && maxY != Number.NEGATIVE_INFINITY) {
						normRangeObj.innerHTML = (minY != Number.POSITIVE_INFINITY)?["&nbsp;[",minY," - ",maxY,"]"].join(""):"";
					}
					else {
						normRangeObj.innerHTML = "";
					}
				}
			}
			return true;
		},

		/* helper function for showBPData, selectSeries, drawWhiskerGraph */
		updateYAxis: function (iSeries, iAxis) {
			var minVal = Number.POSITIVE_INFINITY, maxVal = Number.NEGATIVE_INFINITY;
				for (var i = 0, sLen = iSeries.length; i < sLen; i++) {
					if (iSeries[i].show && iSeries[i].minY && iSeries[i].maxY) {
					minVal = Math.min(minVal,parseFloat(iSeries[i].minY));
					maxVal = Math.max(maxVal,parseFloat(iSeries[i].maxY));
				}
			}
			var isPositive = (minVal > 0);
			var newMax = (maxVal != Number.NEGATIVE_INFINITY)?maxVal*1.1:1;
			var newMin = (minVal != Number.POSITIVE_INFINITY)?minVal*0.9:0;
			newMin = (isPositive && newMin<0)?0:newMin;
			//set to fixed Y axis
			iAxis.min = 0;
			iAxis.max = 250;
		},

		/* helper function for drawWhiskerGraph */
		drawWhiskerLines: function (iPlot, compId) {
			var graphData = MP_FLWSHT_GRAPHS.getGraphDataByComponentId(compId);
			var ctx = iPlot.eventCanvas._ctx;
			var bpArr = [];
			if(graphData.bpValuesShown == 'inv'){
				bpArr = graphData.invLines;
			}
			else if (graphData.bpValuesShown == "non"){
				bpArr = graphData.nonLines;
			}
			
			var xAxis = iPlot.axes.x2axis;
			var yAxis = iPlot.axes.yaxis;
			for (var i=0,bpLen=bpArr.length;i<bpLen;i++)
			{
				ctx.save();
				ctx.beginPath();
				ctx.moveTo(Math.round(xAxis.series_u2p(bpArr[i][0])),Math.round(yAxis.series_u2p(bpArr[i][2])));
				ctx.lineTo(Math.round(xAxis.series_u2p(bpArr[i][1])),Math.round(yAxis.series_u2p(bpArr[i][3])));
				ctx.strokeStyle = '#000000';
				ctx.lineWidth = 0.2;
				ctx.stroke();
				ctx.restore();
			}
		},

		/* helper function for all graphs to resize accordingly */
		resizeGraph: function (iPlotTarget, compId, checkSavedScrollbarSetting) {
			var component = MP_Util.GetCompObjById(compId);
			var graphData = MP_FLWSHT_GRAPHS.getGraphDataByComponentId(compId);
			var target = $(iPlotTarget);
			var legend = target.parent().parent().children(".icufs-legend");
			if(graphData && target.length && legend.length){	
				var tabContent = _g("icufsTabCont" + compId);
				var curClass = tabContent.className.split(" ");
				var curTab = null;
				var scrollbarWidth = 0;
				for(var i = curClass.length;i--;){
					if(curClass[i].substring(0,13) == "icufs-tabview"){
						curTab = Util.gc(tabContent,1);
						curTab = Util.gc(curTab,parseInt(curClass[i].substring(13,curClass[i].length),10) - 1);
						break;
					}
				}
				if(curTab){
					if(checkSavedScrollbarSetting){
						if(component.getScrollBarWidthSet()){
							scrollbarWidth = 19;
						}
					}
					else{
						if(curTab.scrollHeight > curHeight){
							scrollbarWidth = 19;
							component.setScrollBarWidthSet(true);
						}
						else{
							component.setScrollBarWidthSet(false);
						}
					}
					var curHeight = $(curTab).height() + 18; //18 px for padding bottom;
					if($(curTab).find("table:first").length){
						tableWidth = $(curTab).find("table:first").width();
					}
					else{
						tableWidth = $(curTab).width() - parseFloat($(curTab).css("padding-right")) - parseFloat($(curTab).css("margin-left")) - parseFloat($(curTab).css("padding-left")) - parseFloat($(curTab).css("margin-left"));
					}
					if(curTab.scrollHeight > curHeight){
						scrollbarWidth = 19;
						component.setScrollBarWidthSet(true);
					}
					else{
						component.setScrollBarWidthSet(false);
					}
					var legendOffset = 3;
					var tableOffset = 0;
					if(scrollbarWidth > 0){
						legendOffset = 3;
						tableOffset = 15;
					}
					var tableLabelCell = curTab.clientWidth * .129;
					var legendWidth = tableLabelCell - 45 + legendOffset;
					legend.width((legendWidth) + "px");
					target.css("left",(legendWidth - 7) + "px");
					
					target.width((tableWidth - legendWidth + 24) + "px");
					if($("#icufsTemperatureCont" + compId).length){
						var fullWidth = (tableWidth + 7);
						$("#icufsTemperatureCont" + compId).width(fullWidth + "px");
						var labelWidth = parseFloat((fullWidth*.129 + 7)/fullWidth)*100;
						var remainingCellWidths = parseFloat((100 - labelWidth)/24);
						var i = 0;
						$("#icufsTemperatureCont" + compId + " tr").each(function(){
							var self = $(this);
							i = 0;
							self.children("td").each(function(){
								if(i == 0){
									$(this).css("width", labelWidth + "%");
								}
								else{
									$(this).css("width", remainingCellWidths + "%");
								}
								i++;
							});
						});
					}
					var gClass = $('.icufs-sec:first');
					var contWidth = (tableWidth - legendWidth + scrollbarWidth + 1)
					if(graphData.curWidth != contWidth && contWidth > 0){
						graphData.curWidth = contWidth;
						for(var i=0;i<graphData.gPlots.length;i++){
							graphData.gPlots[i].replot();
						}
					}
				}else{
					var table = $("#icufsTabCont" + compId)
					var tableWidth = (table.width() - 7)*.966;
					var tableLabelCell = tableWidth*.129;
					var trueTableLabelSize = tableLabelCell//parseFloat(tableLabelCell.width()) + parseFloat(tableLabelCell.css("padding-left")) * 2 + parseFloat(tableLabelCell.css("borderLeftWidth")) * 2 + 6; //plus 6 px because there is padding to the left of the table below it
					var legendWidth = trueTableLabelSize - 45; //50 px are for the width and padding of the graph axis - minus 3 px since the padding overlaps the border of the graph
					legend.css("width",legendWidth + "px");
					target.css("left",(legendWidth) + "px"); //The border of the graph and the padding of the axis overlap by appr. 3 pixels
					target.css("width",(tableWidth + 21 - (legendWidth + scrollbarWidth + 27)) + "px"); // About 21 pixel offset by: 7 pixels from padding of the axis, 8 pixels on padding on the right of the graph (this takes away from its width), and 6 pixels from the padding left on the table below
					$("#icufsTemperatureCont" + compId).width((tableWidth - scrollbarWidth) + "px");
					var contWidth = (tableWidth + 21 - (legendWidth + scrollbarWidth + 27));
				}
				if(graphData.widthInit){
					graphData.widthInit = 0;
					graphData.curWidth = tableWidth - legendWidth - 60;
				}
			}
			return contWidth;
		}
	};
}();