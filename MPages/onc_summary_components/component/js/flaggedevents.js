function FlaggedEventsComponentStyle(){
    this.initByNamespace("se");
}

FlaggedEventsComponentStyle.inherits(ComponentStyle);

function FlaggedEventsComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new FlaggedEventsComponentStyle());
    this.setIncludeLineNumber(true);
    this.setScope(2);
    this.setLookbackDays(30); //set a default of 30 days lookback
    this.m_dateSortFlag = true;
    this.m_dateImgType = "down";
    this.m_isDateWithin = false;
    this.m_isFaceupCommentsDisp = false;
    this.m_istEventCodesMapped = false;
    this.setComponentLoadTimerName("USR:MPG.FLAGGED_EVENTS.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.FLAGGED_EVENTS.O1 - render component");
    this.setHasActionsMenu(true);
	
    FlaggedEventsComponent.method("InsertData", function(){
        CERN_FLAG_EVENTS_O1.GetFlaggedEvents(this);
    });
    FlaggedEventsComponent.method("HandleSuccess", function(recordData){
        CERN_FLAG_EVENTS_O1.RenderComponent(this, recordData);
    });
    FlaggedEventsComponent.method("setIsDateWithinInd", function(value){
        this.m_isDateWithin = value;
    });
    FlaggedEventsComponent.method("getIsDateWithinInd", function(value){
        return this.m_isDateWithin;
    });
    FlaggedEventsComponent.method("setFaceupCommentsDisplayEnabled",function(value){
        this.m_isFaceupCommentsDisp=value;
    });
    FlaggedEventsComponent.method("getFaceupCommentsDisplayEnabled",function(value){
        return this.m_isFaceupCommentsDisp;
    });
    FlaggedEventsComponent.method("setISTEventCodesMappedInd",function(value){
        this.m_istEventCodesMapped=value;
    });
    FlaggedEventsComponent.method("getISTEventCodesMappedInd",function(value){
        return this.m_istEventCodesMapped;
    });
}

FlaggedEventsComponent.inherits(MPageComponent);

/**
 * Flagged Events methods
 * @static
 * @global
 */
var CERN_FLAG_EVENTS_O1 = function(){
var recDataAr = [];
    return {
    	sortDate:function(componentId){
    		var component = MP_Util.GetCompObjById(componentId);
    		var dateImgId = document.getElementById("se-date-sort-"+componentId);
		
    		if(Util.Style.ccss(dateImgId,"se-down-icon")){ 
    			component.m_dateImgType = "up";
    		}
    		else{
    			component.m_dateImgType = "down";
    		}
    		function SortByEffectiveDateDesc(a,b){
    			var sortRes = 0;
    			if(a.EVENT_DT_TM>b.EVENT_DT_TM){
    				sortRes = 1;
    			}
    			else if(a.EVENT_DT_TM<b.EVENT_DT_TM){
    				sortRes = -1;
    			}
    			else{
    				sortRes = 0;
    			}
    			if(Util.Style.ccss(dateImgId,"se-up-icon")){
    				sortRes = sortRes * -1;
    			}
    			return sortRes;
    		}
    		recDataAr[componentId].EVENTS.sort(SortByEffectiveDateDesc);
    		component.m_dateSortFlag = false;
    		CERN_FLAG_EVENTS_O1.RenderComponent(component, recDataAr[componentId]);
    	},
    	GetFlaggedEvents: function(component){
            var sendAr = [];
            var criterion = component.getCriterion();
            var mpageName = component.getMPageName();
            var istCodesMapped = (component.getISTEventCodesMappedInd())? 1 : 0 ;
            var tableBody=[];
            var seHTML="";
            var countText="";
            if(criterion.encntr_id){
				sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", component.getLookbackDays(),criterion.position_cd + ".0", criterion.ppr_cd + ".0",  istCodesMapped);
				MP_Core.XMLCclRequestWrapper(component, "mp_get_flagged_results", sendAr, true);
            }else{
				tableBody.push("<span class='res-none'>"+i18n.discernabu.NO_RESULTS_FOUND+"</span>");
				countText=MP_Util.CreateTitleText(component,0);
				seHTML=tableBody.join("");
				MP_Util.Doc.FinalizeComponent(seHTML,component,countText);
            }
        },
        RenderComponent: function(component, recordData){
            
            var eventsArray = [];
            var tableBody = [], seHTML = "", countText = "";
            var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
            var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
            var componentId = component.getComponentId();
            var compHeaderId = component.getStyles().getNameSpace() + componentId;
            var feCompSec = _g(compHeaderId);
            var compNS=component.getStyles().getNameSpace();
            var flagReci18n=i18n.discernabu.flagged_events_o1;
            recDataAr[componentId] = recordData;
            var df = MP_Util.GetDateFormatter();
			
            if (window.name.substring(1) === "0"){
                component.setIsDateWithinInd(true); 
            }
            else if(window.name.substring(1)==="1"){
                component.setIsDateWithinInd(false); 
            }
            tableBody.push("<div class='", MP_Util.GetContentClass(component, recordData.EVENTS.length), "'>");
            
            tableBody.push("<div class='content-hdr'><dl class='", compNS, "-info-hdr hdr'><dd class='", compNS + "-event-comment'><span>&nbsp;</span></dd><dd class='", compNS, "-dt-img'><span id='se-date-sort-",componentId,"' class='se-", component.m_dateImgType +"-icon' onclick='javascript:CERN_FLAG_EVENTS_O1.sortDate(",componentId,")'>&nbsp;</span></dd></dl>");
            tableBody.push("<dl class='", compNS, "-info-hdr hdr'><dd class='", compNS + "-event-comment'><span>", flagReci18n.EVENTS_COMMENTS ,"</span></dd>");
            if (component.getIsDateWithinInd()) {
                tableBody.push("<dd class='", compNS, "-dt-hd'><span>", flagReci18n.DATE_WITHIN, "</span></dd></dl></div>");
            }
            else{
                tableBody.push("<dd class='", compNS, "-dt-hd'><span>", i18n.DATE, "</span></dd></dl></div>");
            }
            if(component.m_dateSortFlag){
            	recordData.EVENTS.sort(SortByEffectiveDate);
            }
            for (var j = 0, jl = recordData.EVENTS.length; j < jl; j++) {
                var dateTime = null;
                var eventObj = {};
                var events = recordData.EVENTS[j];
                var eventCode = MP_Util.GetValueFromArray(events.EVENT_CD, codeArray);
                eventObj.PERSON_ID = events.PERSON_ID;
                eventObj.ENCNTR_ID = events.ENCNTR_ID;
                eventObj.EVENT_ID = events.EVENT_ID;
                eventObj.display = eventCode.display;
                if (events.EVENT_DT_TM) {
                    dateTime = new Date();
                    dateTime.setISO8601(events.EVENT_DT_TM);
                    eventObj.eventDateHvr = df.formatISO8601(events.EVENT_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                if (component.getIsDateWithinInd()) { 
                    eventObj.eventDate = MP_Util.CalcWithinTime(dateTime);
                }
                else{
                    eventObj.eventDate = df.formatISO8601(events.EVENT_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
                }
                }
                if (events.PARTICIPATIONS.length !== 0) {
                    var participationLen = events.PARTICIPATIONS.length;
                    var participationObj = events.PARTICIPATIONS[participationLen - 1];
                    var lastParticipant = MP_Util.GetValueFromArray(participationObj.PRSNL_ID, personnelArray);
                    eventObj.lastParticipant = lastParticipant.fullName;
                    if (participationObj.DATE) {
                       eventObj.enteredDate = df.formatISO8601(participationObj.DATE, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                    }
                }
                for (var k = 0, kl = events.PARTICIPATIONS.length; k < kl; k++) {
                    var eventParticipationObj = events.PARTICIPATIONS[k];
                    if (eventParticipationObj.TYPE_CD) {
                        var codeObj = MP_Util.GetValueFromArray(eventParticipationObj.TYPE_CD, codeArray);
                        if (codeObj.codeSet == "21" && codeObj.meaning == "FLAG") {
                            var flagParticipantObj = MP_Util.GetValueFromArray(eventParticipationObj.PRSNL_ID, personnelArray);
                            eventObj.flagParticipant = flagParticipantObj.fullName;
                            if (eventParticipationObj.DATE) {
                                eventObj.flaggedDate = df.formatISO8601(eventParticipationObj.DATE, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                            }
                            if (eventParticipationObj.COMMENT) {
                                eventObj.flaggedComments = eventParticipationObj.COMMENT;
                                
                            }
                            else {
                                eventObj.flaggedComments = "";
                            }
                        }
                    }
                    break;
                }
                /* Annotation comments*/
                if( eventObj.flaggedComments === ""){
                	if (events.COMMENTS.length !== 0) {
                        var commentsLen = events.COMMENTS.length;
                        var commentsObj = events.COMMENTS[commentsLen - 1];
                        var lastAuthor = MP_Util.GetValueFromArray(commentsObj.PRSNL_ID, personnelArray);
                        eventObj.lastParticipant = lastAuthor.fullName;
                        if (commentsObj.DATE) {
                            eventObj.enteredDate = df.formatISO8601(commentsObj.DATE, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                        }
                    }
                    for (var k2 = 0, k3 = events.COMMENTS.length; k2 < k3; k2++) {
                        var eventCommentsObj = events.COMMENTS[k2];
                        if (eventCommentsObj.TYPE_CD !== "" && eventCommentsObj.TYPE_CD !== null) {
                            var eventCodeObj = MP_Util.GetValueFromArray(eventCommentsObj.TYPE_CD, codeArray);
                            if (eventCodeObj.codeSet == "14" && eventCodeObj.meaning == "RES COMMENT") {
                                var eventFlagParticipantObj = MP_Util.GetValueFromArray(eventCommentsObj.PRSNL_ID, personnelArray);
                                eventObj.flagParticipant = eventFlagParticipantObj.fullName;
                                if (eventCommentsObj.DATE) {
                                    eventObj.flaggedDate = df.formatISO8601(eventCommentsObj.DATE, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                                }
                                if (eventCommentsObj.COMMENT) {
                                    eventObj.flaggedComments = eventCommentsObj.COMMENT;
                                    
                                }
                                else {
                                    eventObj.flaggedComments = "";
                                }
                            }
                        }
                        break;
                    }
                }
				
                eventObj.measurement = loadMeasurementData(events, personnelArray, codeArray);
                eventsArray.push(eventObj);
                
            }
            
            for (var i = 0, il = eventsArray.length; i < il; i++) {
                var event = eventsArray[i];
                var sMeas = (event.measurement !== null && event.measurement.length > 0) ? event.measurement[0] : "";
                var zebraStripping = i % 2 === 0 ? "odd" : "even" ;
                tableBody.push("<h3 class='info-hd'><span>", event.display, "</span></h3><dl class='se-info " + zebraStripping + "'><dt><span>", event.display, ":</span></dt><dd class='se-name'><span>", event.display, "</span></dd><dt><span>", sMeas, ":</span></dt>");
                if (recordData.EVENTS[i].MODIFY_IND == 1) {
                    tableBody.push("<dd class='se-result'>", GetEventViewerLink(event, sMeas), "<span class='res-modified'>&nbsp;</span></dd>");
                }
                else {
                    tableBody.push("<dd class='se-result'>", GetEventViewerLink(event, sMeas), "</dd>");
                }
                
                tableBody.push("<dt><span>", event.eventDate, ":</span></dt><dd class='se-date'><span class='date-time'>", event.eventDate, "</span></dd>");
                if(component.getFaceupCommentsDisplayEnabled()){        
                    if (window.name.substring(0,1) === "1"){
                    	tableBody.push("<dt><span>", event.flaggedComments,":</span></dt><dd class='se-all-comments'><span>",event.flaggedComments,"</span></dd>");
                    }
                    else{
                    	tableBody.push("<dt><span>", event.flaggedComments,":</span></dt><dd class='se-comments'><span>",event.flaggedComments,"</span></dd>");
                    }
                }
                tableBody.push("</dl>");
				
                //set up hover
                tableBody.push("<h4 class='det-hd'><span>Significant Event Details</span></h4><div class='hvr'><dl class='se-det'><dt><span>", i18n.NAME,
                               ":</span></dt><dd class='se-det-name'><span>", event.display, "</span></dd><dt><span>", i18n.DATE_TIME,
                               ":</span></dt><dd class='se-det-name'><span>", event.eventDateHvr, "</span></dd><dt><span>", i18n.ENTERED,
                               ":</span></dt><dd class='se-det-name'><span>", event.enteredDate, "</span> - <span>", event.lastParticipant,
                               "</span></dd><dt><span>", i18n.FLAGGED, ":</span></dt><dd class='se-det-name'><span>", event.flaggedDate, "</span> - <span>",
                               event.flagParticipant, "</span></dd><dt><span>", i18n.COMMENTS, ":</span></dt><dd class='se-det-name'><span>", event.flaggedComments,
                               "</span></dd></dl></div>");
            }
            tableBody.push("</div>");
            countText = MP_Util.CreateTitleText(component, recordData.EVENTS.length);
            seHTML = tableBody.join("");

            if(component.getFaceupCommentsDisplayEnabled()){
                    /* Add the drop down menu to the component header */
				switch (window.name) {
					case "00":
						component.addMenuOption("mnuShowComments", "mnuShowComments" + componentId, flagReci18n.SHOW_ALL_COMMENTS, false);
						component.addMenuOption("mnuDate", "mnuDate" + componentId, i18n.DATE_TIME, false);
						break;
					case "01":
						component.addMenuOption("mnuShowComments", "mnuShowComments" + componentId, flagReci18n.SHOW_ALL_COMMENTS, false);
						component.addMenuOption("mnuDate", "mnuDate" + componentId, flagReci18n.DATE_WITHIN, false);
						break;
					case "10":
						component.addMenuOption("mnuShowComments", "mnuShowComments" + componentId, flagReci18n.ABBREVIATE_COMMENTS, false);
						component.addMenuOption("mnuDate", "mnuDate" + componentId, i18n.DATE_TIME, false);
						break;
					case "11":
						component.addMenuOption("mnuShowComments", "mnuShowComments" + componentId, flagReci18n.ABBREVIATE_COMMENTS, false);
						component.addMenuOption("mnuDate", "mnuDate" + componentId, flagReci18n.DATE_WITHIN, false);
						break;
					default:
						component.addMenuOption("mnuShowComments", "mnuShowComments" + componentId, flagReci18n.SHOW_ALL_COMMENTS, false);

						if(component.getIsDateWithinInd()) {
							component.addMenuOption("mnuDate", "mnuDate" + componentId, i18n.DATE_TIME, false);
						}
						else {
							component.addMenuOption("mnuDate", "mnuDate" + componentId, flagReci18n.DATE_WITHIN, false);
						}
				}

				component.createMenu();
			
                    //add menu click events
                    Util.addEvent(_g("mnuShowComments" + componentId), "click", 
                    function(){
                     	var dateType = "0";
                    	var showComments = "0";
                    	var menuName =_g("mnuShowComments" + componentId);
                    	var commentSec = "";
                    	if(menuName.innerHTML==flagReci18n.SHOW_ALL_COMMENTS){
							component.setMenuOptionText("mnuShowComments", flagReci18n.ABBREVIATE_COMMENTS);
							
                    		commentSec = document.getElementsByClassName('se-comments');  
							
                    		if ( commentSec.length > 0 ){
                    			for ( var i=commentSec.length; i-- ; ){
                    				commentSec[i].className = 'se-all-comments';
                    			}
                    		}
                    		showComments = "1";				
                    	}
                    	else{
							component.setMenuOptionText("mnuShowComments", flagReci18n.SHOW_ALL_COMMENTS);
							
                    		commentSec = document.getElementsByClassName('se-all-comments');  
                    		if ( commentSec.length > 0 ){
                    			for ( var j = commentSec.length; j-- ;){
                    				commentSec[j].className = 'se-comments';
                    			}
                    		}
                    	}
						
                    	menuName =_g("mnuDate" + componentId);	
                    	if(menuName.innerHTML==flagReci18n.DATE_WITHIN){
                    		dateType = "1" ;	
                    	}
                    	setMenuOptions(showComments, dateType);
                    });
			
                    Util.addEvent(_g("mnuDate" + componentId), "click", 
                    function(){
                    	var dateType = "0";
                    	var showComments = "0";
                     	var menuName =_g("mnuDate" + componentId);
					
                    	if(menuName.innerHTML==i18n.DATE_TIME){
							component.setMenuOptionText("mnuDate", flagReci18n.DATE_WITHIN);
                    		component.setIsDateWithinInd(false);
                    		dateType = "1";
                    	}
                    	else{
							component.setMenuOptionText("mnuDate", i18n.DATE_TIME);
                    		component.setIsDateWithinInd(true);
                    	}
					
                    	menuName =_g("mnuShowComments" + componentId);	
                    	if(menuName.innerHTML== flagReci18n.ABBREVIATE_COMMENTS){
                    		showComments = "1" ;	
                    	}
                    	setMenuOptions(showComments, dateType);
                    	CERN_FLAG_EVENTS_O1.RenderComponent(component, recordData);
                    });
			
            }
			
            MP_Util.Doc.FinalizeComponent(seHTML, component, countText);
            return;
        }
    };
    function loadMeasurementData(meas, personnelArray, codeArray){
        var measureAr = [];
        var eventCode = MP_Util.GetValueFromArray(meas.EVENT_CD, codeArray);
        
        var dateTime = new Date();
        dateTime.setISO8601(meas.EVENT_DT_TM);
        //		meas.sort(SortByEffectiveDate);
        
        //create measurement object
        for (var k = 0, kl = meas.MEASUREMENTS.length; k < kl; k++) {
            measureAr.push(MP_Util.Measurement.GetString(meas.MEASUREMENTS[k], codeArray, "longDateTime3"));
        }
        return measureAr;
    }
    function SortByEffectiveDate(a, b){
        if (a.EVENT_DT_TM > b.EVENT_DT_TM) {
            return -1;
        }
        else 
            if (a.EVENT_DT_TM < b.EVENT_DT_TM) {
                return 1;
            }
        return 0;
    }
}();
function GetEventViewerLink(measObject, res){

    var ar = [];
    var params = [measObject.PERSON_ID + ".0", measObject.ENCNTR_ID + ".0", measObject.EVENT_ID + ".0", "\"EVENT\""]
    
    ar.push("<a onclick='MP_Util.LaunchClinNoteViewer(", params.join(","), "); return false;' href='#'>", res, "</a>")
    return ar.join("");
};
function setMenuOptions(showComments, dateType){
	window.name = "";
	window.name = showComments + dateType;
}