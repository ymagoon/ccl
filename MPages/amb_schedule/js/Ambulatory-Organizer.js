startLoadTimer();
var WKLISTREPLY = {};
var firstLoadIndicator = true;
var calendarFirstLoadIndication = true;
var timelineFirstLoadIndication = true;
var user_resource = "";
var openItemsCount = 0;
var myday_tab = "MY_DAY";
var calendar_tab = "CALENDAR";
var openitems_tab = "OPEN_ITEMS";
var upcoming_tab = "UPCOMING";
var upcoming_ndx = 3;
var myday_ndx = 0;
var calendar_ndx = 1;
var openitems_ndx = 2;
var undo_data;
var myDayApptFlag = false;
var openItemsApptFlag = false;
var upcomingItemsApptFlag = false;
var resourceApply = false;
var gblproviderNoteInd, gblvisitChargeInd, gbltaskListInd, gblvisitSummaryInd, gblhpInd, gblconsentInd, gblpreopInd;
var APPT_TYPE_AMB = 1; //indicator for office visit appointment
var APPT_TYPE_SURG = 2 ;//indicator for surgery appointment
var VERSIONSTR = "AOv1.3";

var SEENBYPHYSIC = "SEENBYPHYSIC";
var SEENBYMIDLEV = "SEENBYMIDLEV";
var SEENBYMEDSTU = "SEENBYMEDSTU";
var SEENBYRESIDE = "SEENBYRESIDE";
var SEENBYNURSE = "SEENBYNURSE";
var SEENBYGEN1 = "SEENBYGEN1";
var SEENBYGEN2 = "SEENBYGEN2";
var SEENBYGEN3 = "SEENBYGEN3";
var SEENBYGEN4 = "SEENBYGEN4";
var PRE_OP = "PREOP";
var INTRA_OP = "INTRAOP";
var POST_OP = "POSTOP";
var CONFIRMED = "CONFIRMED";
var CONFIRM = "CONFIRM";//14232
var SCHEDULED = "SCHEDULED";
var SCHEDULE = "SCHEDULE";//14232
var CHECKED_IN = "CHECKED IN";
var CHECKIN = "CHECKIN";//14232
var CHECKED_OUT = "CHECKED OUT";
var NO_SHOW = "NOSHOW";
var HOLD = "HOLD";
var CANCELED = "CANCELED";
var CANCEL = "CANCEL";//14232

MpageDriver.setListSource("MP_AMB_SCHEDULING","mp_get_amb_wl_resrc_favs","mp_amb_wklst_get_my_day_appts");
MpageDriver.displayDisclaimer(false);
MpageDriver.displayListLoadingIcon(true);
MpageDriver.addObserver("tab-finished-loading-MY_DAY", tabFinLoadMyDay);
MpageDriver.addObserver("tab-finished-loading-OPEN_ITEMS", tabFinLoadOpenItems);
MpageDriver.addObserver("tab-finished-loading-UPCOMING", tabFinLoadUpcomingItems);

MpageDriver.setBedrockTopicMeaning("MP_AMBULATORY_ORG");
MpageDriver.setLayout({
	"LAYOUT" : {
		"TITLE" : "",
		"TABS" : [{
			"MEANING" : "MY_DAY",
			"SOURCE_SCRIPT" : "mp_amb_wklst_get_my_day_appts", 
			"TITLE" : "My Day",
			"COLUMNS" : [{
				"MEANING" : "PATIENT",
				"TITLE" : ""
			}]
		},
		{
			"MEANING" : "CALENDAR",
			"TITLE" : "Calendar",
			"COLUMNS" : [{
				"MEANING" : "",
				"TITLE" : ""
			}]
		},
		{
			"MEANING" : "OPEN_ITEMS",
			"SOURCE_SCRIPT" : "mp_amb_get_open_items_appts", 
			"TITLE" : "Open Items",
			"COLUMNS" : [{
				"MEANING" : "OPEN_ITEMS",
				"TITLE" : ""
			}]
		
		}, {
				"MEANING" : "UPCOMING",
				"SOURCE_SCRIPT" : "mp_amb_get_upcoming_appts",
				"TITLE" : "Upcoming Items",
				"COLUMNS" : [{
						"MEANING" : "UPCOMING",
						"TITLE" : ""
					}
				]
			}
		
	]}
});

var driverTimer;
function startLoadTimer() {
    driverTimer = createSLATimer("USR:MPG.Amb_Org_load - load component",VERSIONSTR);
}

function stopLoadTimer() {
    if(driverTimer!=null){
        driverTimer.Stop();
    }
}
//My Day
var myDayButtonClickTimer;
function startMyDayButtonClickTimer() {
	myDayButtonClickTimer = createSLATimer("USR:MPG.Amb_Org_load - Button Click(MY_DAY)",VERSIONSTR);
	
}

function stopMyDayButtonClickTimer() {
    if(myDayButtonClickTimer!=null){
    	myDayButtonClickTimer.Stop();
    	myDayButtonClickTimer = null;
    }
}

var myDayRefreshTimer;
function startMyDayRefreshTimer() {
	myDayRefreshTimer = createSLATimer("USR:MPG.Amb_Org_load - Refresh(MY_DAY)",VERSIONSTR);
}

function stopMyDayRefreshTimer() {
    if(myDayRefreshTimer!=null){
    	myDayRefreshTimer.Stop();
    	myDayRefreshTimer = null;
    }
}

var myDayResourceChangeTimer;
function startMyDayResourceChangeTimer() {
	myDayResourceChangeTimer = createSLATimer("USR:MPG.Amb_Org_load - Resource Change(MY_DAY)",VERSIONSTR);
}

function stopMyDayResourceChangeTimer() {
    if(myDayResourceChangeTimer!=null){
    	myDayResourceChangeTimer.Stop();
    	myDayResourceChangeTimer = null ;
    }
}

// Calendar

var calendarButtonClickTimer;
function startCalendarButtonClickTimer() {
	calendarButtonClickTimer = createSLATimer("USR:MPG.Amb_Org_load - Button Click(CALENDAR)",VERSIONSTR);
	
}

function stopCalendarButtonClickTimer() {
    if(calendarButtonClickTimer!=null){
    	calendarButtonClickTimer.Stop();
    	calendarButtonClickTimer = null;
    }
}

var calendarRefreshTimer;
function startCalendarRefreshTimer() {
	calendarRefreshTimer = createSLATimer("USR:MPG.Amb_Org_load - Refresh(CALENDAR)",VERSIONSTR);
}

function stopCalendarRefreshTimer() {
    if(calendarRefreshTimer!=null){
    	calendarRefreshTimer.Stop();
    	calendarRefreshTimer = null;
    }
}

var calendarResourceChangeTimer;
function startCalendarResourceChangeTimer() {
	calendarResourceChangeTimer = createSLATimer("USR:MPG.Amb_Org_load - Resource Change(CALENDAR)",VERSIONSTR);
}

function stopCalendarResourceChangeTimer() {
    if(calendarResourceChangeTimer!=null){
    	calendarResourceChangeTimer.Stop();
    	calendarResourceChangeTimer = null ;
    }
}

// Open Items
var openItemsButtonClickTimer;
function startOpenItemsButtonClickTimer() {
	openItemsButtonClickTimer = createSLATimer("USR:MPG.Amb_Org_load - Button Click(OPEN_ITEMS)",VERSIONSTR);
	
}

function stopOpenItemsButtonClickTimer() {
    if(openItemsButtonClickTimer!=null){
    	openItemsButtonClickTimer.Stop();
    	openItemsButtonClickTimer = null;
    }
}

var openItemsRefreshTimer;
function startOpenItemsRefreshTimer() {
	openItemsRefreshTimer = createSLATimer("USR:MPG.Amb_Org_load - Refresh(OPEN_ITEMS)",VERSIONSTR);
}

function stopOpenItemsRefreshTimer() {
    if(openItemsRefreshTimer!=null){
    	openItemsRefreshTimer.Stop();
    	openItemsRefreshTimer = null;
    }
}

var openItemsResourceChangeTimer;
function startOpenItemsResourceChangeTimer() {
	openItemsResourceChangeTimer = createSLATimer("USR:MPG.Amb_Org_load - Resource Change(OPEN_ITEMS)",VERSIONSTR);
}

function stopOpenItemsResourceChangeTimer() {
    if(openItemsResourceChangeTimer!=null){
    	openItemsResourceChangeTimer.Stop();
    	openItemsResourceChangeTimer = null ;
    }
}


//Upcoming Tab Timers
var upcomingButtonClickTimer;
function startUpcomingButtonClickTimer() {
	upcomingButtonClickTimer = createSLATimer("USR:MPG.Amb_Org_load - Button Click(UPCOMING)",VERSIONSTR);
	
}

function stopUpcomingButtonClickTimer() {
    if(upcomingButtonClickTimer!=null){
    	upcomingButtonClickTimer.Stop();
    	upcomingButtonClickTimer = null;
    }
}

var upcomingRefreshTimer;
function startUpcomingRefreshTimer() {
	upcomingRefreshTimer = createSLATimer("USR:MPG.Amb_Org_load - Refresh(UPCOMING)",VERSIONSTR);
}

function stopUpcomingRefreshTimer() {
    if(upcomingRefreshTimer!=null){
    	upcomingRefreshTimer.Stop();
    	upcomingRefreshTimer = null;
    }
}

var upcomingResourceChangeTimer;
function startUpcomingResourceChangeTimer() {
	upcomingResourceChangeTimer = createSLATimer("USR:MPG.Amb_Org_load - Resource Change(UPCOMING)",VERSIONSTR);
}

function stopUpcomingResourceChangeTimer() {
    if(upcomingResourceChangeTimer!=null){
    	upcomingResourceChangeTimer.Stop();
    	upcomingResourceChangeTimer = null ;
    }
}



function showErrorMessage(errorMessage, functionName, strStatus, strParameters) {
	var completeErrorMessageArr = [];
	completeErrorMessageArr.push("Error Message: ", errorMessage, "\nFunction: ", functionName, "\nStatus: ", strStatus, "\nParameters: ", strParameters);
	alert(completeErrorMessageArr.join(""));
}

function unescapeJSON(jsonString){
	// check if any characters to unescape
	// if so -> recursively call with the unescaped string
	if(jsonString.indexOf("%25") >= 0 && jsonString.indexOf("{") == -1){
		return unescapeJSON(unescape(jsonString));
	}
	// else return the current json string which is unescaped completely
	else {
		return (unescape(jsonString));
	}
}

MpageDriver.setRowIdentifiers(["ORG_APPT_ID","ORG_APPT_TYPE","PRIMARY_TAB"]);
MpageDriver.setPrimaryTabCustomView("CALENDAR",function(viewElement,patientsData,tabElement,tabSeq){
	AmbulatoryWorklist.loadCalendar(viewElement);
});
MpageDriver.defineCustomTabs(function(){AmbulatoryWorklist.addButtons();});

var AmbulatoryWorklist = function() {
	var calendar_ind = 0;
	var open_item_ind = 0;
	var upcoming_ind = 0;
	
	var updateButtons = true;
	var selectedTab;
	var myday_limit = 5;
	var calendar_limit = 1;
	var worklistData = {};
	var hoverTimer = null;
	return {
		pushData : function (columnMeaning, columnData) {
			if(!worklistData[columnMeaning]){
				worklistData[columnMeaning] = [];
			}
			worklistData[columnMeaning] = worklistData[columnMeaning].concat(columnData);
		},
		getData : function () {
			return worklistData;
		},
		clearData : function () {
			worklistData = {};
		},
		getUndoData: function () {
			return undo_data;
		},
		setUndoData: function (jsonResponse) {
			undo_data = AjaxHandler.parse_json(jsonResponse.response.REPLY.UNDO_DATA).UNDO_DATA;
			if(typeof undo_data!="undefined")
				{
					if(undo_data.UNDO_IND==1){
						AmbulatoryWorklist.CreatePageMenu();
					}
				}
		},
		fetchUndoData: function () { 
			var cclParam = "'MINE'";
			cclParam = cclParam.replace(/"/g, "'");
			AjaxHandler.ajax_request({
				request: {
					type: "XMLCCLREQUEST",
					target: "mp_amb_wklst_get_undo_data",
					parameters: cclParam
				},
				response: {
					type: "JSON",
					target: AmbulatoryWorklist.setUndoData,
					parameters: []
				}
			});
		},
	setBrTabList : function(brTabs){
			var BrTabStr = AmbulatoryWorklist.cnvtJsonToString(brTabs);
			WorklistStorage.set("BrTabPrefList",BrTabStr,false);
		},
		getBrTabList : function(){
			var BrTabList = AjaxHandler.parse_json(WorklistStorage.get("BrTabPrefList",false));
			return BrTabList;
		},
tabViewBedrockIndicator : function() {
var BrTabList =AmbulatoryWorklist.getBrTabList();		
		if(typeof BrTabList == "undefined"){
			
			var cclParam = 'MINE';

			cclParam = cclParam.replace(/"/g, "'");

			AjaxHandler.ajax_request({
				request : {
					type : "XMLCCLREQUEST",
					target : "mp_amb_tab_disable_br",
					parameters : cclParam
				},
				response : {
					type : "JSON",
					target : AmbulatoryWorklist.tabViewBedrockIndicatorResponse

				}

			});
	}
	else{
	AmbulatoryWorklist.tabViewBedrockIndicatorResponse(BrTabList);
	
	
	}
},	

 tabViewBedrockIndicatorResponse: function(jsonResponse) {
		
				
				AmbulatoryWorklist.setBrTabList(jsonResponse);	
				
				calendar_ind = jsonResponse.response.VIEW_IND.QUAL[0].CALENDAR_IND;
				open_item_ind = jsonResponse.response.VIEW_IND.QUAL[0].OPEN_ITEM_IND;
				upcoming_ind = jsonResponse.response.VIEW_IND.QUAL[0].UPCOMING_IND;
				var addbuttonTimer = createSLATimer("USR:MPG.Amb_Org_load - Addbutton",VERSIONSTR);
			if(!Util.Style.g("seg-cntrl", document)[0]) {
				var currTab = MpageDriver. getCurrentPrimaryTabMeaning();
				var selectedArray = AmbulatoryWorklist.getSelectedResources(); 
				var tabs = AmbulatoryWorklist.getTabsElement();
				AmbulatoryWorklist.fetchUserPref();			
				AmbulatoryWorklist.CreateDateControl();
				var segCntrl = Util.cep('ul',{className : "seg-cntrl"});
				var myDayTab = Util.cep('li',{onclick : function() {
					startMyDayButtonClickTimer();
					Util.Style.acss(myDayTab,'tab-layout-active');
					Util.Style.rcss(calendarTab,'tab-layout-active');
					Util.Style.rcss(openItemsTab,'tab-layout-active');
					Util.Style.rcss(upcomingTab, 'tab-layout-active');
					Util.gc(tabs,0).click();
					AmbulatoryWorklist.updateResourceList();
					Util.gc(_g("open-items-seg-cntrl-id"),1).innerHTML=""+i18n.OPEN_ITEMS;
					AmbulatoryWorklist.getOpenItemsCnt();
					var menuSpanId = $("#menu-span-id");
					if(menuSpanId){
						if(!myDayApptFlag){
							menuSpanId.parent("td").addClass("hidden");
							
						}
						else
						{
							menuSpanId.parent("td").removeClass("hidden");
							setTimeout(function(){stopMyDayButtonClickTimer();},10); //USR:MPG.Amb_Org_load - Button Click(MY_DAY)
						}
					}
					AmbulatoryWorklist.showDateControl('show');
					var autoRefreshEnabled = MyDay.getEnableAutoRefresh();
					if(autoRefreshEnabled){
						MyDay.startAutoRefreshTimer();
					}
				}});
				var calendarTab = Util.cep('li',{onclick : function() {
					startCalendarButtonClickTimer();
					Util.Style.acss(calendarTab,'tab-layout-active');
					Util.Style.rcss(myDayTab,'tab-layout-active');
					Util.Style.rcss(openItemsTab,'tab-layout-active');
					Util.Style.rcss(upcomingTab, 'tab-layout-active');
					Util.gc(tabs,1).click();
					AmbulatoryWorklist.updateResourceList();
					Util.gc(_g("open-items-seg-cntrl-id"),1).innerHTML=""+i18n.OPEN_ITEMS;
					AmbulatoryWorklist.getOpenItemsCnt();
					var menuSpanId = $("#menu-span-id");
					if(menuSpanId){
						menuSpanId.parent("td").addClass("hidden");
					}
					AmbulatoryWorklist.showDateControl('hide');
					MyDay.stopAutoRefreshTimer();
						
					setTimeout(function(){stopCalendarButtonClickTimer();},10); //USR:MPG.Amb_Org_load - Button Click(CALENDAR)
					
					
				}});
				var openItemsTab = Util.cep('li',{onclick : function() {
					startOpenItemsButtonClickTimer();
					Util.Style.acss(openItemsTab,'tab-layout-active');
					Util.Style.rcss(myDayTab,'tab-layout-active');
					Util.Style.rcss(calendarTab,'tab-layout-active');
					Util.Style.rcss(upcomingTab, 'tab-layout-active');
					Util.gc(tabs,2).click();
					AmbulatoryWorklist.updateResourceList();
					var menuSpanId = $("#menu-span-id");
					if(typeof undo_data=="undefined"){
						AmbulatoryWorklist.fetchUndoData();
					}
					if(menuSpanId){
						if(typeof undo_data=="undefined" || (undo_data.UNDO_IND==0 && !openItemsApptFlag)){
							menuSpanId.parent("td").addClass("hidden");
						}
						else
						{
							menuSpanId.parent("td").removeClass("hidden");
							setTimeout(function(){stopOpenItemsButtonClickTimer();},10); //USR:MPG.Amb_Org_load - Button Click(OPEN_ITEMS)
						}
					}					
					AmbulatoryWorklist.showDateControl('hide');
					MyDay.stopAutoRefreshTimer();
					var openItemsCount = " "+Util.Style.g("sec-total", Util.gc(tabs,2))[0].innerHTML;
					Util.gc(_g("open-items-seg-cntrl-id"),1).innerHTML=""+i18n.OPEN_ITEMS + openItemsCount;
					
				  }});  
                  var upcomingTab = Util.cep('li', {
						onclick : function () {
							startUpcomingButtonClickTimer();
							Util.Style.acss(upcomingTab, 'tab-layout-active')
							Util.Style.rcss(openItemsTab, 'tab-layout-active');
							Util.Style.rcss(myDayTab, 'tab-layout-active');
							Util.Style.rcss(calendarTab, 'tab-layout-active');
							Util.gc(tabs, 3).click();
							AmbulatoryWorklist.updateResourceList();
							Util.gc(_g("open-items-seg-cntrl-id"), 1).innerHTML = "" + i18n.OPEN_ITEMS;
							AmbulatoryWorklist.getOpenItemsCnt();
							var menuSpanId = $("#menu-span-id");
							if (typeof undo_data == "undefined") {
								AmbulatoryWorklist.fetchUndoData();
							}
							if (menuSpanId) {
								if (typeof undo_data == "undefined" ||(!upcomingItemsApptFlag)) {
									menuSpanId.parent("td").addClass("hidden");
								} else {
									menuSpanId.parent("td").removeClass("hidden");
									setTimeout(function(){stopUpcomingButtonClickTimer();},10); //USR:MPG.Amb_Org_load - Button Click(UPCOMING)
								}
							}							
							AmbulatoryWorklist.showDateControl('hide');
							MyDay.stopAutoRefreshTimer();

						}
					});
   				if(currTab=="MY_DAY") {
					Util.Style.acss(myDayTab,'tab-layout-active');
					if(!resourceApply){
						resourceApply = true;
						AmbulatoryWorklist.getOpenItemsCnt();
					}
				}
				else if(currTab=="CALENDAR") {
					Util.Style.acss(calendarTab,'tab-layout-active');
					if(!resourceApply){
						resourceApply = true;
						AmbulatoryWorklist.getOpenItemsCnt();
						AmbulatoryWorklist.showDateControl('hide');
					}
				} else if (currTab == "OPEN_ITEMS") {
					AmbulatoryWorklist.fetchUndoData();
					Util.Style.acss(openItemsTab,'tab-layout-active');
					AmbulatoryWorklist.showDateControl('hide');
				} else {
					AmbulatoryWorklist.fetchUndoData();
					Util.Style.acss(upcomingTab, 'tab-layout-active');
					if(!resourceApply){
						resourceApply = true;
						AmbulatoryWorklist.getOpenItemsCnt();
						AmbulatoryWorklist.showDateControl('hide');
					}
				}
				var openItemsCount = " "+Util.Style.g("sec-total", Util.gc(tabs,2))[0].innerHTML;
				
				var myDayRight = 'myDayRight';
				var calendarRight = 'calendarRight';
				var openItemsRight = 'openItemsRight';
				var upcomingItemsRight = 'extremeRight';
                     
				
				if(upcoming_ind == '0'){
					openItemsRight = 'extremeRight';
				}
				if(upcoming_ind == '0' && open_item_ind == '0' ){
					calendarRight = 'extremeRight';
				}
				if(upcoming_ind == '0' && open_item_ind == '0' && calendar_tab == '0'){
					myDayRight = 'extremeRight';
				}
				                     
				var myDay = Util.cep("div", {
					className : "my-day-seg-cntrl seg-cntrl-clicked",
					innerHTML : "<div id='myDayLeft'></div><div id='myDayCenter'>" + i18n.MY_DAY + "</div><div id="+myDayRight+"></div>"
				});
				myDayTab.appendChild(myDay);
				var calendar = Util.cep("div", {
					className : "calendar-seg-cntrl",
					innerHTML : "<div id='calendarLeft'></div><div id='calendarCenter'>" + i18n.CALENDAR+ "</div><div id="+ calendarRight+"></div>"

				});
				calendarTab.appendChild(calendar);
				var openItems = Util.cep("div", {
					id: "open-items-seg-cntrl-id",
					className : "open-items-seg-cntrl",
					innerHTML : "<div id='openItemsLeft'></div><div id='openItemsCenter'>" + i18n.OPEN_ITEMS + openItemsCount + "</div><div id="+openItemsRight+"></div>"
				});
				openItemsTab.appendChild(openItems);

				var upcomingItems = Util.cep("div", {
						id : "upcoming-seg-cntrl-id",
						className : "upcoming-seg-cntrl",
						innerHTML : "<div id='upcomingItemsLeft'></div><div id='upcomingItemsCenter'>" + i18n.UPCOMING + "</div><div id="+upcomingItemsRight+"></div>"
					});
				upcomingTab.appendChild(upcomingItems);

				var tabCell = Util.cep("td", {
					valign : "top"
				});
				
				if (calendar_ind == 0) {
					$(calendar).hide();

				}

				if (open_item_ind == 0) {
					$(openItems).hide();
				}
				
				if (upcoming_ind == 0) {
					$(upcomingItems).hide();
				}
				
				segCntrl.appendChild(myDayTab);
				segCntrl.appendChild(calendarTab);
				segCntrl.appendChild(openItemsTab);
				segCntrl.appendChild(upcomingTab);
				tabCell.appendChild(segCntrl);
				var pt_sel_lists = "";
				if(_g("WLTable-id")){
					pt_sel_lists = _g("WLTable-id");
				}
				else{
					pt_sel_lists = Util.Style.g("WLTable", document)[0];
					pt_sel_lists.id = "WLTable-id";
				}
				var headerRow = AmbulatoryWorklist.getParentRow(pt_sel_lists);
				headerRow.insertBefore(tabCell, headerRow.firstChild);
				fixMinWidthForIE(myDay.childNodes[1]);
				fixMinWidthForIE(calendar.childNodes[1]);
				fixMinWidthForIE(openItems.childNodes[1]);
				var neededWidth = myDayTab.offsetWidth + calendarTab.offsetWidth + openItemsTab.offsetWidth + upcomingTab.offsetWidth +  45 + "px";
				segCntrl.style.width = neededWidth;
				segCntrl.parentNode.style.width = neededWidth;
				AmbulatoryWorklist.setResourcesWidth();
				AmbulatoryWorklist.currentResourceDisplay();
				
				AmbulatoryWorklist.updateButtons=false;
				$('#divOpenWrklist').resize(function(){AmbulatoryWorklist.setResourcesWidth();
							                           AmbulatoryWorklist.currentResourceDisplay();});
			} else {//(resource apply) take out old tabs, insert new
				var oldtabs = Util.Style.g("seg-cntrl", document)[0];
				var parent = oldtabs.parentNode.parentNode;
				parent.removeChild(oldtabs.parentNode);
				AmbulatoryWorklist.updateButtons=true;
				AmbulatoryWorklist.addButtons();
			}
			
			addbuttonTimer.Stop();

	},

		undoClickRequest: function (){
			var scriptName = "mp_amb_wklst_set_sat_openitm_2";
			var cclParamArr = [];
			cclParamArr.push("'MINE'", "0.0", "''", "0.0", "''", "0");
			cclParamArr.push("0.0","0","1");
			var cclParam = cclParamArr.join(",");
			cclParam = cclParam.replace(/"/g, "'");
			AjaxHandler.ajax_request({
				request: {
					type: "XMLCCLREQUEST",
					target: scriptName,
					parameters: cclParam
				},
				response: {
					type: "JSON",
					target: AmbulatoryWorklist.undoClickResponse,
					parameters: []
				}
			});  
		},
		undoClickResponse: function (jsonResponse) {
			if(jsonResponse.response.REPLY.STATUS_DATA.STATUS == "N"){
				undo_data.UNDO_IND = 0;
				MyDay.alertConfirm(i18n.UNDO_ALERT,i18n.UNDO_STATUS,i18n.OK,"",true,function(){window.location.reload();});
			}
			else{
				window.location.reload();    
			}
		},
		getOrgApptIdFromParentRow : function(node) {
			var patientRow = AmbulatoryWorklist.getParentRow(node);
			var id = (patientRow.id).split("_");
			//orgapptid_orgappttype_primarytab
			if((id.length-3)<0){
				AjaxHandler.append_text("Invalid amount of id elements in appointment row<br/>appointment row id = "+patientRow.id);
				return -1;
			}
			return id[id.length - 3];
		},
		getOrgApptTypeFromParentRow : function(node) {
			var patientRow = AmbulatoryWorklist.getParentRow(node);
			var id = (patientRow.id).split("_");
			//_orgapptid_orgappttype
			if((id.length-2)<0){
				AjaxHandler.append_text("Invalid amount of id elements in appointment row<br/>appointment row id = "+patientRow.id);
				return -1;
			}
			var orgApptType = id[id.length - 2];
			return orgApptType;
		},
		getPrimaryTabFromParentRow : function(node) {
			var patientRow = AmbulatoryWorklist.getParentRow(node);
			var id = (patientRow.id).split("_");
			//_orgapptid_orgappttype
			if((id.length-1)<0){
				AjaxHandler.append_text("Invalid amount of id elements in appointment row<br/>appointment row id = "+patientRow.id);
				return -1;
			}
			var primaryTab = id[id.length - 1];
			return primaryTab;
		},
		getParentRow : function(node) {
			while(node.nodeName != "TR") {
				node = Util.gp(node);
			}
			return node;
		},
		cnvtJsonToString : function(jsonObj){
		  try{
			var jsonString = JSON.stringify(jsonObj,function (key, value) {
			  if (typeof value == 'number') {
				if(value > 1){
				  return String(parseInt(value,10).toFixed(2));
				}
				else{
				  return String(value);
				}
			  }
				return value;
			  });
			return jsonString;
		  }
		  catch(error){
			showErrorMessage(error.message,"cnvtJsonToString","","");
		  }
		},
		setResourceFavList: function(sourceList) {
			var sourceString = AmbulatoryWorklist.cnvtJsonToString(sourceList);
			//convert to a more efficient record structure before saving to prefs table
			var resFavsStr = AmbulatoryWorklist.cnvtJsonToString(AmbulatoryWorklist.cnvtOtherSourcesToResFavs(sourceList));
			WorklistStorage.set("_RES_FAVS", resFavsStr, true);
			WorklistStorage.set("StoredOtherSourcesList", sourceString, false);
			WorklistStorage.set("StoredOtherSourceTypeIndex", 0, false);
	        	WorklistStorage.set("StoredOtherSourceIndex", 0, false);
		},
		setUserPrefList : function(userPrefs){
			var userPref = AmbulatoryWorklist.cnvtJsonToString(userPrefs);
			WorklistStorage.set("StoredUserPreferences",userPref,false);
			WorklistStorage.set("_USERPREFMENU",userPref,true); 
		},
		getUserPrefList : function(){
			var userPrefs = AjaxHandler.parse_json(WorklistStorage.get("StoredUserPreferences",false));
			if(typeof userPrefs == "undefined"){
			userPrefs = AjaxHandler.parse_json(WorklistStorage.get("_USERPREFMENU",true));
			}
			return userPrefs;
		},
		setDateTime : function (storageName, dateTime) {
			WorklistStorage.set(storageName, dateTime, false);
		},
		getDateTime : function (storageName) {
			var dateTime = unescapeJSON(WorklistStorage.get(storageName, false));
			if (dateTime == "undefined" || typeof dateTime == "undefined" || Object.prototype.toString.call(dateTime) === "[object Date]"){
				var date = new Date();
				dateTime = date.toString();
				AmbulatoryWorklist.setDateTime(storageName, dateTime);
			}
			dateTime = new Date(dateTime);
			return dateTime;
		},
		
		addTimeline : function () {
			var timeLinePref = AmbulatoryWorklist.getUserPrefList().TIMELINE; //get user 's MP_AMBULATORY_ORG_TIMELINE preference
			var myDayContainerClassName = "";
			var timelineContainerClassName = "";
			var	timeLineButtonClassName = "";
			var timeLineArrowClassName = "";
			var timeLineButtonId = "timeline-button-id";
			var timeLineArrowId = "timeline-arrow-id";
			var timelineHTML = "";
			var timelineHTMLArr = [];
			var selectedArray = AmbulatoryWorklist.getSelectedResources(); //mt4217

			var myDayContainer = Util.Style.g('table-layout-wrapper', document, 'div')[0];
			if (timeLinePref === "Expand")  
			{
				myDayContainerClassName = "my-day-container timeline-expanded";
				Util.gc(myDayContainer, 0).style.width = myDayContainer.offsetWidth - 300;
				timelineContainerClassName = "timeline-container";
				timeLineButtonClassName = "timeline-button button-expanded header-hover";
				timeLineArrowClassName = "timeline-arrow left-arrow expanded";
				timelineHTMLArr = [];
				timelineHTMLArr.push("<div id = '",timeLineButtonId,"' class='", timeLineButtonClassName, "' onclick='AmbulatoryWorklist.timelineButtonClick(this);' onmouseover='AmbulatoryWorklist.headerHover(this);' onmouseout='AmbulatoryWorklist.headerHoverOut(this);'><div id = '",timeLineArrowId,"' class='", timeLineArrowClassName, "'></div>", i18n.TIMELINE, "</div>");
				timelineHTML = timelineHTMLArr.join("") ;
			}
			else //Collapse or nothing(user has not have timeline preference, default to collapse)
			{
				myDayContainerClassName = "my-day-container";
				timelineContainerClassName = "timeline-container hidden";
				timeLineButtonClassName = "timeline-button"; //display timeline button as collapse and enabled
				timeLineArrowClassName = "timeline-arrow left-arrow";
				//check to see if more than 1 resource selected, then disable the Timeline button.
				if (selectedArray.length > 1)
				{
					timelineContainerClassName += " timeline-disabled";
					timeLineButtonClassName = "timeline-button button-disabled"; //mt4217 display timeline button as collapse and disabled
					timelineHTMLArr = [];
					timelineHTMLArr.push("<div id = '",timeLineButtonId,"' class='", timeLineButtonClassName, "'><div id = '",timeLineArrowId,"' class='", timeLineArrowClassName, "'></div>", i18n.TIMELINE, "</div>");
					timelineHTML = timelineHTMLArr.join("");
				}
				else //selectedArray.length = 1
				{
					timeLineButtonClassName = "timeline-button"; //display timeline button as collapse and enabled.
					timelineHTMLArr = [];
					timelineHTMLArr.push("<div id ='",timeLineButtonId,"' class='", timeLineButtonClassName, "' onclick='AmbulatoryWorklist.timelineButtonClick(this);' onmouseover='AmbulatoryWorklist.headerHover(this);' onmouseout='AmbulatoryWorklist.headerHoverOut(this);'><div id = '",timeLineArrowId,"' class='", timeLineArrowClassName, "'>&nbsp;</div>", i18n.TIMELINE, "</div>");
					timelineHTML = timelineHTMLArr.join("");
				}
			}


			var timelineleft = Util.cep("div", {className: "clearDiv"});
			var timelineright = Util.cep("div", {className: "clearDiv"});
			var timeline = Util.cep("span", {
				className: "timeline-wrapper",
				innerHTML: timelineHTML //mt4217
			});
			if($("#TAB_CONTENT_CALENDAR")){$("#TAB_CONTENT_CALENDAR").innerHTML="";}
			var timelineContainer = Util.cep("div", {
				id: "timeline-container-id",
				className: timelineContainerClassName, 
				innerHTML: getTimeLineHTML()
			});

			Util.gc(myDayContainer, 0).className = myDayContainerClassName; 
			Util.gc(myDayContainer, 0).id = "my-day-container-id" ; 
			myDayContainer.appendChild(timelineleft);
			myDayContainer.appendChild(timelineContainer);
			myDayContainer.appendChild(timelineright);
			myDayContainer.appendChild(Util.gc(timeline, 0));
			if (selectedArray.length > 0 & timeLinePref === "Expand")
			{
				if (selectedArray.length == 1)
				{
					calReady(selectedArray[0][0],selectedArray[0][1] ,"timeline");
					timelineFirstLoadIndication = false;
				}
			}
		},
		getTabsElement : function(){
			var tabElement =_g("tab-layout-nav-id");
			if(tabElement === null){ 
				tabElement = Util.Style.g("tab-layout-nav", document)[0];
				tabElement.id = "tab-layout-nav-id" ; 
			}
			return tabElement;
		},
		addButtons : function() {

			AmbulatoryWorklist.tabViewBedrockIndicator();

		},
		headerHover : function(d) {
			Util.Style.acss(d, "header-hover");
		},
		headerHoverOut : function(d) {
			Util.Style.rcss(d, "header-hover");
		},
		timelineButtonClick : function(buttonDiv) {			

			var selectedArray = AmbulatoryWorklist.getSelectedResources(); 
			if (selectedArray.length == 1 && timelineFirstLoadIndication)
			{
				calReady(selectedArray[0][0],selectedArray[0][1], "timeline");
				timelineFirstLoadIndication = false;
			}

			Util.Style.tcss(buttonDiv, 'button-expanded');
			var arrowDiv = _g("timeline-arrow-id"); 
			Util.Style.tcss(arrowDiv, 'expanded');
			var myDayContainer = _g("my-day-container-id");
			Util.Style.tcss(myDayContainer, 'timeline-expanded');
			if(Util.Style.ccss(myDayContainer, 'timeline-expanded')){
				myDayContainer.style.width = myDayContainer.parentNode.offsetWidth - 300;
			} else {
				myDayContainer.style.width = myDayContainer.parentNode.offsetWidth;
			}
			var timelineDiv = _g('timeline-container-id'); 
			Util.Style.tcss(timelineDiv, 'hidden');

			var userPrefs = AmbulatoryWorklist.getUserPrefList();
			if (Util.Style.ccss(timelineDiv, 'hidden')) 
			{
				//save user pref for TimeLine collapses 
				userPrefs.TIMELINE = "Collapse";				
			}
			else { 
				//save user pref for TimeLine Expand 
				userPrefs.TIMELINE = "Expand";
			}
			AmbulatoryWorklist.setUserPrefList(userPrefs);
		},
		loadCalendar : function(calendarDiv) {
			var source_id;
			var selected;
			var source_cd;
			var storedSources = AjaxHandler.parse_json(unescapeJSON(WorklistStorage.get("StoredOtherSourcesList",false)));
			if(typeof storedSources != "undefined")
			{
				var arrLength = storedSources[calendar_ndx].SOURCES.length;
				for(var k=0;k<arrLength;k++) {
					selected = parseInt(storedSources[calendar_ndx].SOURCES[k].SELECTED_IND,10);
					if( selected == 1)
					{
						source_cd = storedSources[calendar_ndx].SOURCES[k].SOURCE_CD;
						source_id = storedSources[calendar_ndx].SOURCES[k].SOURCE_ID;
					}
				}
				if (calendarFirstLoadIndication)
				{
					calendarDiv.innerHTML = getCalHTML();
					calReady(source_cd, source_id,"calendar");
					WorklistSelection.resetSelectLoadingInProgress();
					calendarFirstLoadIndication=false;
				}
			}
		},
		
		fetchUserPref: function(){
			var userPrefMenu =	{
					"NOTES_IND":"Y",
					"ORDERS_IND":"Y",
					"TASK_IND":"Y",
					"SUMMARY_IND" : "Y",
					"HP_IND" : "N",
					"CONSENT_IND" : "N",
					"PREOP_IND" : "N",
					"TIMELINE":"Expand"
			};

			var userPrefTemp = AmbulatoryWorklist.getUserPrefList();
			if(typeof userPrefTemp !== "undefined"){
				if(typeof userPrefTemp.TIMELINE === "undefined"){
					var timelinePref = WorklistStorage.get("_TIMELINE", true);
					if(timelinePref != ""){
						userPrefTemp.TIMELINE = timelinePref;
					}
					else{
						userPrefTemp.TIMELINE = "Expand"; //default setting of timeline pref if we don't have a pref already defined.
					}
				}
				if(typeof userPrefTemp.TASK_IND === "undefined"){
						
						userPrefTemp.TASK_IND = "Y"; 
				}
				if(typeof userPrefTemp.SUMMARY_IND === "undefined"){
						
						userPrefTemp.SUMMARY_IND = "Y"; 
				}
				if (typeof userPrefTemp.HP_IND === "undefined") {

					userPrefTemp.HP_IND = "N";
				}
				if (typeof userPrefTemp.CONSENT_IND === "undefined") {

					userPrefTemp.CONSENT_IND = "N";
				}
				if (typeof userPrefTemp.PREOP_IND === "undefined") {

					userPrefTemp.PREOP_IND = "N";
				}
				userPrefMenu = userPrefTemp;
			}
			WorklistStorage.set("StoredUserPreferences",AmbulatoryWorklist.cnvtJsonToString(userPrefMenu),false);
		},

		CreatePageMenu: function (){
			var menuId = "userPrefMenu";
			var pt_sel_lists = "";
			if(_g("WLTable-id")){
				pt_sel_lists = _g("WLTable-id");
			}
			else{
				pt_sel_lists = Util.Style.g("WLTable", document)[0];
				pt_sel_lists.id = "WLTable-id";
			}
			var headerRow = AmbulatoryWorklist.getParentRow(pt_sel_lists);
			var tabUserPref = Util.cep("td", {
				valign : "top"
			});
					if(!_g(menuId)){
					var	optMenu = Util.cep("span", {
						id: "menu-span-id",
						className: "menu-span"
					});

					var htmlStrArr = [];
					htmlStrArr.push("<div id=", menuId, " class='opts-menu-content'></div><br><br><br>", "<ul id='opt' class='opts-menu-sub menu-hide'>");
					htmlStrArr.push("<li class='opts-menu-head'><span class='item'>", i18n.DISPLAY, ":", "</span></li>"); 
					htmlStrArr.push("<li class='opts-menu-item' id='opt1'><input class='opts-check' id='opt1tick' type='checkbox'/><span class='item'>", i18n.NOTES_IND, "</span></li>"); 
					htmlStrArr.push("<li class='opts-menu-item' id='opt2'><input class='opts-check' id='opt2tick' type='checkbox'/><span class='item'>", i18n.ORDERS_IND, "</span></li>");
					htmlStrArr.push("<li class='opts-menu-item' id='opt3'><input class='opts-check' id='opt3tick' type='checkbox'/><span class='item'>", i18n.TASK_IND, "</span></li>");
					htmlStrArr.push("<li class='opts-menu-item' id='opt4'><input class='opts-check' id='opt4tick' type='checkbox'/><span class='item'>", i18n.SUMMARY_IND, "</span></li>");
					htmlStrArr.push("<li class='opts-menu-item' id='opt5'><input class='opts-check' id='opt5tick' type='checkbox'/><span class='item'>", i18n.HP_IND, "</span></li>");
					htmlStrArr.push("<li class='opts-menu-item' id='opt6'><input class='opts-check' id='opt6tick' type='checkbox'/><span class='item'>", i18n.CONSENT_IND, "</span></li>");
					htmlStrArr.push("<li class='opts-menu-item last-item' id='opt7'><input class='opts-check' id='opt7tick' type='checkbox'/><span class='item'>", i18n.PREOP_IND, "</span></li>");
					htmlStrArr.push("<li class='opts-menu-item' id='opt8'><span class='undo-opt' id='opt8tick'></span><span class='item'>", i18n.UNDO_IND, "</span></li>");
					htmlStrArr.push("<li class='opts-menu-buttons'><button type='button' class='opts-drop-down-apply'>", i18n.APPLY,"</button><button type='button' class='opts-drop-down-cancel'>", i18n.CANCEL, "</button>", "</li>", "</ul>");
					optMenu.innerHTML = htmlStrArr.join("");

					tabUserPref.appendChild(optMenu);
					optMenu.parentNode.style.width = "5%";
					headerRow.appendChild(tabUserPref);
					$(".opts-menu-sub").delegate('.opts-menu-item', 'hover', function(e){
						$(this).toggleClass('menu-hover');
						});
					}	
		},
		
		CreateDateControl : function () {
			var dateCtrlId = "dateCtrlId";
			
			if (!_g(dateCtrlId)) {
				var pt_sel_lists = _g("WLTable-id");
				if (pt_sel_lists === null) {
					pt_sel_lists = Util.Style.g("WLTable", document)[0];
					pt_sel_lists.id = "WLTable-id";
				}
				var headerRow = AmbulatoryWorklist.getParentRow(pt_sel_lists);
				var dateCtrlTd = Util.cep("td", {
					valign : "top"
				});
				
				var dateController = Util.cep("div", {
						id : dateCtrlId,
						className : "date-controller"
					});

				var htmlStrArr = [];
				
				htmlStrArr.push("<div class ='prev-button' id = 'prevBtnId'></div>",
								"<div id='todaybtn' class='fbutton calendar-seg-cntrl'>",
								"<div id='todayLeft'></div><div id='todayCenter'>"+i18n["TODAY"]+ 
								"</div><div id='todayRight'></div></div>",
								"<div class = 'next-button' id = 'nextBtnId'></div>",
								"<input type='hidden' name='txtshow' id='showTxtId'>",
								"<div  id='showDatePickerId'>",
								"<span id='showDateId'></span>",
								"<span id ='displayArrowId'></span></div></input>");

				dateController.innerHTML = htmlStrArr.join("");
				dateCtrlTd.appendChild(dateController);
				headerRow.appendChild(dateCtrlTd);

				var currDate = AmbulatoryWorklist.getDateTime("currentAppointmentDateTime");
				var show = dateFormat(currDate, dateFormat.masks.longDate);
					$("#showDateId").text(show);

					$("#showDatePickerId").delegate('#showDateId, #displayArrowId', 'hover', function (e) {
						$('#showDatePickerId').toggleClass('date-hover');
					});	
					
					$("#showTxtId").datepicker({
						picker : "#showDatePickerId",
						showtarget : $("#showDatePickerId"),
						onReturn : function (r) {
						resourceApply = false;
						calendarFirstLoadIndication = true;
						timelineFirstLoadIndication = true;
						AmbulatoryWorklist.setDateTime("currentAppointmentDateTime", r);
						updateAppointmentData(r);
						}
					});
			}
		},
		
		showDateControl: function(display){
			if ($("#dateCtrlId")){
				if(display === 'show'){
					$("#dateCtrlId").css("visibility", "visible");
				}
				else{	
					$("#dateCtrlId").css("visibility", "hidden");
				}
			}
			
		},
		
		/*The prefInd Array contains the current preference values for the 7 reminder tasks (4 office visit and 3 surgery)
		 * and the indicator for the Undo action menu item, which is the last element in the array
		 */ 
		setUserPrefMenu: function (prefIndArray) {
			var menuSpanId = $("#menu-span-id");
			if(menuSpanId){
				if (prefIndArray[0] == 0 && prefIndArray[1] == 0 && prefIndArray[2] == 0 && prefIndArray[3] == 0 && prefIndArray[4] == 0 && prefIndArray[5] == 0 && prefIndArray[6] == 0 && prefIndArray[7] == 0) {
					menuSpanId.parent("td").addClass("hidden");
				}else{
					menuSpanId.parent("td").removeClass("hidden");
				}
			}
			var i = 0;
			var length = prefIndArray.length;
			for (i=0; i<length; i++){
				AmbulatoryWorklist.prefOptionView(i+1, prefIndArray[i]);
			}
		},
		
		prefOptionView : function(option, indicator){
			var optionString = "opt" + option ; 
			if(indicator == 1){
				if (_g(optionString)) {
						$("#"+optionString).removeClass("hidden");
					}
			}
			else{
				if (_g(optionString)) {
					$("#"+optionString).addClass("hidden");
				}
			}
		},
		
		setMenuEvent : function(){
			var userPrefMenu = AmbulatoryWorklist.getUserPrefList();
			var prefs = [];
			prefs[1] = userPrefMenu.NOTES_IND;
			prefs[2] = userPrefMenu.ORDERS_IND;
			prefs[3] = userPrefMenu.TASK_IND;
			prefs[4] = userPrefMenu.SUMMARY_IND;
			prefs[5] = userPrefMenu.HP_IND;
			prefs[6] = userPrefMenu.CONSENT_IND;
			prefs[7] = userPrefMenu.PREOP_IND;
			
			for(var i = 1; i < 8; i++){
				if(_g("opt" + i)){
					$('#opt' + i + 'tick').prop('checked', (prefs[i]=="Y") ? true : false);
				}
			}			
		},

		hidemenu : function(dropDownparentNode){
			// To hide the dropdown menu	
			$(document).click(function(e){
				if ($(e.target).closest(dropDownparentNode).get(0) == null )
				{
				    $('#curr-resource-display-id').css({
						"border-right" : "none"
					});
					Util.Style.rcss(dropDownparentNode, "expand");
					$(document).unbind('click');	
				}
			});
		},

		menu : function(d){
			if(d.className!='row-exp-col'){
				var aBox = d.childNodes[0];
				var ulBox = d.parentNode.childNodes[1];
				if(ulBox){
					if(aBox){
						ulBox.style.minWidth = aBox.offsetWidth + 18 + "px";
					}
					else
					{
						ulBox.style.minWidth = d.offsetWidth + 18 + "px";
					}
					fixMinWidthForIE(ulBox);
				}
			}
			if(Util.Style.ccss(d.parentNode, "expand"))
			{
				$(document).unbind('click');
			}
			else
			{
				// To hide the dropdown menu
				AmbulatoryWorklist.hidemenu(d.parentNode);
			}
			Util.Style.tcss(d.parentNode, "expand");
		},
		
		expandCurrentResourcesMenu : function (d) {
			var currResDisply = $('#curr-resource-display-id');
			if (currResDisply[0].scrollWidth <= $('#displayTrimList').width()) {
				currResDisply.css({
					"border-right" : "1px solid #568ECB"
				});
			} else {
				currResDisply.css({
					"border-right" : "none"
				});
			}
			if (Util.Style.ccss(d.parentNode, "expand")) {
			    currResDisply.css({
					"border-right" : "none"
				});
				$(document).unbind('click');
			} else {
				// To hide the dropdown menu
				AmbulatoryWorklist.hidemenu(d.parentNode);
			}
			Util.Style.tcss(d.parentNode, "expand");
			AmbulatoryWorklist.addScrollToResourceDropDown();
		},
		togglePadding : function(d){
			var frozenHeader =  $('.table-layout-table-th');
			var wrapperTable = $('.table-layout-wrapper-table');
			var currList = $('.curr-li',d.parentNode.parentNode);
			var dropdownTopPosition = currList.offset().top ;
			var dropdownSize = $('.loc-ul',d.parentNode).height();
			var containerHeight = wrapperTable.height();
			// If drop down is expanded
			if(dropdownTopPosition+dropdownSize > containerHeight && Util.Style.ccss(currList[0],"expand")){
				padding =  dropdownTopPosition + dropdownSize - containerHeight;
				// Max to Drop down size
				if(padding>dropdownSize ) padding = dropdownSize;
				// Min to 80px
				if(padding<80) padding = 80;
				
				wrapperTable.css({
				"padding-bottom":padding +"px"				
				});
			}else{
				//default to 80px
					wrapperTable.css({
				"padding-bottom":"80px"	
				});	
			}		
					
		},
		//This function is used to get the current tab when the page is loaded for the first time or refreshed
		getCurrTab : function() {
			var currTab = MpageDriver.getCurrentPrimaryTabMeaning();	
			if(typeof(currTab) == "undefined")
			{
				var currentTabindex = WorklistStorage.get('StoredTabSeq');
				if(currentTabindex == 'undefined')
				{
					currentTabindex='0';
				}
				switch(currentTabindex){
				case '0':
					currTab = myday_tab;	
					break;
				case '1':
					currTab = calendar_tab;
					break;
				case '2':
					currTab = openitems_tab;
					break;
				case '3':
					currTab = upcoming_tab;
					break;
				} 
			}
			return currTab;
		},

		//This function is used to return an array of resource li elements (also includes the add, message, and add/cancel buttons) from the drop down menu
		getResourcelist : function(){
			var resourceDropDown = _g("resources-id");
			var resourceList = Util.Style.g('resource-li', resourceDropDown, 'li');
			return resourceList;
		},

		getSelectedResources : function() {
			var resourceDiv = _g('curr-resource-display-id');
			var selectedResources = Util.Style.g('selected-resources',resourceDiv,'span')[0];
			var resourceArray = selectedResources.innerHTML.split("|");

			var selectedArray = [];
			for(var i=0;i<resourceArray.length;i++) {

				selectedArray[i] = resourceArray[i].split(",");
			}
			return selectedArray;//selectedArray[][0] = resource_cd || selectedArray[][1] = prsnl_id
		},

		getOpenItemsCnt: function() {
			var count = 0; 
			var cclParam = AmbulatoryWorklist.createGetOpenItemsCountParams();
			cclParam=cclParam.replace(/"/g,"'");
			if(cclParam !== ""){
				AjaxHandler.ajax_request({
					request : {
						type : "XMLCCLREQUEST",
						target : "mp_amb_wklst_get_open_item_cnt",
						async:false,
						parameters : cclParam
	
					},
					response : {
						type : "JSON",
						target : AmbulatoryWorklist.parseGetOpenItemsCountResponse,
						parameters : []
					}
				});
			}
		},

		parseGetOpenItemsCountResponse: function(jsonResponse){
			openItemsCount = jsonResponse.response.OPENITEMS.OPEN_ITEMS_CNT;
			var notesCompleted = [];
			var orderCompleted = [];
			var taskCompleted = [];
			var visitSummaryCompleted = [];
			var hpCompleted = [];
			var consentCompleted = [];
			var preopCompleted = [];
			var apptType = [];
			var i=0;
			var arraylength = jsonResponse.response.OPENITEMS.APPOINTMENT.length;
			for ( i=0; i<arraylength; i++)
			{
				apptType[i] = jsonResponse.response.OPENITEMS.APPOINTMENT[i].ORG_APPT_TYPE;
				notesCompleted[i] = jsonResponse.response.OPENITEMS.APPOINTMENT[i].NOTES_COMPLETED;
				orderCompleted[i] = jsonResponse.response.OPENITEMS.APPOINTMENT[i].ORDER_COMPLETED;
				taskCompleted[i] =  jsonResponse.response.OPENITEMS.APPOINTMENT[i].TASK_LIST_COMPLETED;
				visitSummaryCompleted[i] = jsonResponse.response.OPENITEMS.APPOINTMENT[i].VISIT_SUMMARY_COMPLETED;
				hpCompleted[i] = jsonResponse.response.OPENITEMS.APPOINTMENT[i].H_P_COMPLETED;
				consentCompleted[i] = jsonResponse.response.OPENITEMS.APPOINTMENT[i].CONSENT_COMPLETED;
				preopCompleted[i] = jsonResponse.response.OPENITEMS.APPOINTMENT[i].PREOP_ORDER_COMPLETE;
			}

			var userPrefMenu = AmbulatoryWorklist.getUserPrefList();
			var notesPref = userPrefMenu.NOTES_IND;
			var ordersPref = userPrefMenu.ORDERS_IND;
			var taskPref = userPrefMenu.TASK_IND;
			var summaryPref = userPrefMenu.SUMMARY_IND;
			var hpPref = userPrefMenu.HP_IND;
			var consentPref = userPrefMenu.CONSENT_IND;
			var preopPref = userPrefMenu.PREOP_IND;
			    openItemsCount = 0;
			for (i = 0; i< arraylength; i++) 
			{
			  if(apptType[i] == APPT_TYPE_AMB){
				  if ( (notesPref == "Y" && notesCompleted[i] == "N") || (ordersPref == "Y" && orderCompleted[i] == "N") || (taskPref == "Y" && taskCompleted[i] == "N") || (summaryPref == "Y" && visitSummaryCompleted[i] == "N")) 
				  {
				    openItemsCount++; 
				  }
			 }else if(apptType[i] == APPT_TYPE_SURG){
				 if ((hpPref == "Y" && hpCompleted[i] == "N") || (consentPref == "Y" && consentCompleted[i] == "N") || (preopPref == "Y" && preopCompleted[i] == "N")){
					 openItemsCount++; 
				 }
			 }
			}
			
			Util.gc(_g("open-items-seg-cntrl-id"),1).innerHTML=""+i18n.OPEN_ITEMS+ " (" +openItemsCount +")";
		},


		createGetOpenItemsCountParams : function () {
			var parameterStrArr = [] ;
			var resourceArray = [];
			var selectedArray = AmbulatoryWorklist.getSelectedResources(); 
			if(selectedArray[0][0] !== ""){
				parameterStrArr.push("'MINE',^{'resources':{'qual':");
				for ( var i=0; i<selectedArray.length ; i++ )
				{//adding the parameter prsnl_id to retrieve surgery appointments
					resourceArray.push({"resource_cd" : parseInt(selectedArray[i][0],10).toFixed(2),"prsnl_id" : parseInt(selectedArray[i][1],10).toFixed(2)});
				}
				parameterStrArr.push(AjaxHandler.stringify_json(resourceArray), "}}^");
			}
			return(parameterStrArr.join(""));
		},

		updateResourceListDisplay : function(){
			var resourceDropDown =  _g("resources-id");
			var resourceDiv = Util.Style.g('curr-resource-display', resourceDropDown, 'div')[0];
			var resourceList = Util.Style.g('resource-li', resourceDropDown, 'li');
			var html = "";
			var hiddenHTML = "";
			var checkedCnt = 0;
			var l = resourceList.length;
			for(var i=0;i<l;i++){
				if (Util.Style.ccss(resourceList[i], "add-other-li")) {
					break;
				}
				if(Util.gc(resourceList[i],0).checked){
					checkedCnt++;
					if(html!==""){html+=";  ";hiddenHTML+="|";}
					html+=Util.gc(resourceList[i],1).innerHTML;
					hiddenHTML+= Util.gc(resourceList[i],3).innerHTML + "," + Util.gc(resourceList[i],2).innerHTML;
				}
			}
			if(html===""){html=i18n.NO_RESOURCE_SELECTED;}
            html += '<img align="middle" src="../img/5322_down.png"><span class="selected-resources hidden">' + hiddenHTML + '</span>';  			
			resourceDiv.innerHTML = html;
			//Check to see if more than 1 selected resource, then disable the Timeline.
			if(checkedCnt>1){	
				AmbulatoryWorklist.disableTimeline();		
			}
		},
		resourceApply : function(){
			var currTab = AmbulatoryWorklist.getCurrTab();
			if(currTab == openitems_tab){
				startOpenItemsResourceChangeTimer();
			}else if(currTab == myday_tab){
				MyDay.stopAutoRefreshTimer();
				startMyDayResourceChangeTimer();	
			}else if(currTab == upcoming_tab){
				startUpcomingResourceChangeTimer();
			}
			else{
				startCalendarResourceChangeTimer();
			}
				
			
			AmbulatoryWorklist.expandCurrentResourcesMenu(_g('curr-resource-display-id'));
			calendarFirstLoadIndication=true;
			timelineFirstLoadIndication=true;
			AmbulatoryWorklist.updateResourceListDisplay();
			WorklistSelection.verifyOtherListSelection(0,0);
			resourceApply = true;
            		myDayApptFlag = false;
		    	openItemsApptFlag = false;
          upcomingItemsApptFlag = false;
			var prefIndArray = []; 
			
				// Cannot directly pass undo_data.UNDO_IND as it might break the code if undo_data.UNDO_IND is null or undefined
				if(currTab == openitems_tab){
					if(undo_data.UNDO_IND == 1){
						prefIndArray.push(0,0,0,0,0,0,0,undo_data.UNDO_IND);
					}
					else{
					prefIndArray.push(0,0,0,0,0,0,0,0);
					}
				} else if (currTab == upcoming_tab) {
				
				if(resourceApply){
						AmbulatoryWorklist.getOpenItemsCnt();
					}
				
				if (undo_data.UNDO_IND == 1) {
					prefIndArray.push(0, 0, 0, 0,0,0,0, undo_data.UNDO_IND);
				} else {
					prefIndArray.push(0,0,0,0, 0, 0, 0, 0);
				}

			}	
				else{
					prefIndArray.push(0,0,0,0,0,0,0,0);
					if(resourceApply){
						AmbulatoryWorklist.getOpenItemsCnt();
					}
				}
			AmbulatoryWorklist.setUserPrefMenu(prefIndArray);
			AmbulatoryWorklist.resourceDropDownHoverController();
		},
		resourceCancel : function() {
			var currResDiv = _g('curr-resource-display-id');
			var resListCell;
			if(AmbulatoryWorklist.getParentRow(currResDiv).children.length>1){
				resListCell = Util.gc(AmbulatoryWorklist.getParentRow(currResDiv),1);
			} else {
				resListCell = Util.gc(AmbulatoryWorklist.getParentRow(currResDiv),0);
			}
			resListCell.innerHTML = WorklistSelection.buildOtherSourceSelections(null);
			AmbulatoryWorklist.setResourcesWidth();
			AmbulatoryWorklist.updateResourceListDisplay();	
                         AmbulatoryWorklist.currentResourceDisplay();
			AmbulatoryWorklist.resourceDropDownHoverController();
			AmbulatoryWorklist.addScrollToResourceDropDown();
		},
		resourceDelete : function(d) {
			var resourceLi = d.parentNode;
			var parentDom = resourceLi.parentNode;
			parentDom.removeChild(resourceLi);
			calendarFirstLoadIndication=true;
			timelineFirstLoadIndication=true;			
			var wasChecked = AmbulatoryWorklist.removeResource(resourceLi);
			if (wasChecked) {
				AmbulatoryWorklist.updateResourceList();
				if (AmbulatoryWorklist.getCurrTab() != openitems_tab) {
					AmbulatoryWorklist.getOpenItemsCnt();
				}
				WorklistSelection.verifySelections(1);
			}
		    AmbulatoryWorklist.currentResourceDisplay();
			AmbulatoryWorklist.addScrollToResourceDropDown();
		},
		resourceAdd : function(personID, resourceSchId, displayName) {
			var prsnlId = parseInt(personID,10).toFixed(2);
			var resourceCd = parseInt(resourceSchId,10).toFixed(2);
			var criterion = MpageDriver.getCriterion();
			var resourceIsUser = false;
			var currTab = MpageDriver.getCurrentPrimaryTabMeaning();
			if(parseInt(personID,10)==parseInt(criterion.personnel_id,10)){
				resourceIsUser = true;
			}

			if(resourceSchId>0){
				var resourceExists = false;
				var resourceDropDown = _g("resources-id");
				var resourceList = Util.Style.g('resource-li', resourceDropDown,'li');
				var l = AmbulatoryWorklist.getResourceListCount();
				for(var i=0;i<l;i++){	
					if(displayName==Util.Style.g('resource-display',resourceList[i],'span')[0].innerHTML){resourceExists=true;break;}
				}
				if (!resourceExists) {
					
					var resourceUL = resourceList[0].parentNode;
					var addButtonLI = resourceList[l];
					//if calendar or open items, remove all checks first
					if(AmbulatoryWorklist.getCurrTab()!=myday_tab){
						AmbulatoryWorklist.removeResourceChecks();
					}
					
					var innerHTMLArr = [];
					innerHTMLArr.push("<input class='resource-check' type='checkbox' name='resource' checked='true'/><span class='resource-display'>", displayName, "</span><span class='person-id hidden'>", personID, "</span><span class='resource-cd hidden'>", resourceSchId, "</span><div class='delete-res'/>");
					var newResource = Util.cep("li", {
						"className": "resource-li",
						"innerHTML":  innerHTMLArr.join("") 
					});
					resourceUL.insertBefore(newResource, addButtonLI);
					AmbulatoryWorklist.addScrollToResourceDropDown();
					WorklistSelection.updatePreferencesList(prsnlId,resourceCd,displayName);
					calendarFirstLoadIndication=true;
					timelineFirstLoadIndication=true;
					AmbulatoryWorklist.updateResourceListDisplay();
					WorklistSelection.verifyOtherListSelection(0,0);
					if(AmbulatoryWorklist.getCurrTab()!=openitems_tab){
						AmbulatoryWorklist.getOpenItemsCnt();
					}
					var prefIndArray = [];
					var menuSpanId = $("#menu-span-id");
					
					if (currTab == openitems_tab) {
						if (undo_data.UNDO_IND == 1) {
							menuSpanId.parent("td").removeClass("hidden");
						} else {
							menuSpanId.parent("td").addClass("hidden");
						}
					} else if (currTab == upcoming_tab) {

						if (resourceApply) {
							AmbulatoryWorklist.getOpenItemsCnt();
						}

						if (undo_data.UNDO_IND == 1) {
							menuSpanId.parent("td").removeClass("hidden");
						} else {
							menuSpanId.parent("td").addClass("hidden");
						}

					} else {
						menuSpanId.parent("td").addClass("hidden");
						if (resourceApply) {
							AmbulatoryWorklist.getOpenItemsCnt();
						}
					}
					AmbulatoryWorklist.resourceDropDownHoverController();					
				}

			}
		},
        /*This function is used to set the width of WLTable class, Which allocates the width for Resources selected*/
		setResourcesWidth : function(){
		// 0.08 refers to the a % of total width (work list), 5% of the width goes for user pref menu and 3% is kept as buffer.
		var menuWidthBuffer =0.08;
		var wlTableWidth = parseFloat($('#divOpenWrklist').outerWidth(true) - $('.seg-cntrl').outerWidth(true) -
		$('#dateCtrlId').outerWidth(true) - $('#divOpenWrklist').outerWidth(true) * menuWidthBuffer);
		$('.resources-wrapper').width(parseFloat(wlTableWidth));
		},
		currentResourceDisplay : function () {
			var dropdownImageDiv = _g("display-trim-list-image-id");
			var currResDisply = $('#curr-resource-display-id');
			if (currResDisply[0].scrollWidth > $('#displayTrimList').width()) {
			    currResDisply.css({
					"width" : "100%"
				});
				Util.Style.rcss(dropdownImageDiv, 'hidden');
			} else {
			    currResDisply.css({
					"width" : "auto"
				}); 
				Util.Style.acss(dropdownImageDiv, 'hidden');
			}
		},
		getResourceListCount : function(){
			var resourceList = AmbulatoryWorklist.getResourcelist();
			var l = resourceList.length;		

			for(var i=0;i<l;i++){
				//when we get to the add other row, exit loop
				if (Util.Style.ccss(resourceList[i], "add-other-li")) {
					break;
				}
			}
			return i;
		},
		resourceDropDownHoverController: function(){

			$(".resource-ul")
			//delegate event to add a hover on the delete button of each resource
			.delegate('.delete-res', 'hover', function(){$(this).toggleClass('delete-hover');})

			//delegate event to add a hover on to each resource element within the drop down list 'resource-li' '.resource-li.add-other-li' class 
			.delegate('.resource-li, .resource-li.add-other-li', 'hover', function(){$(this).toggleClass('resource-hover');})

			//delegate event to remove the hover on alert message, resource apply and cancel button 
			.delegate('.resource-li.add-message-li, .resource-li.button', 'hover', function(){$(this).removeClass('resource-hover');});

		}, 

		/*This function is used to remove a resource from all the preference list when a resource is deleted and 
		checks if the removed resource JSON object is selected in any other tabs. */								
		removeResource : function (item){
			var value = (Util.Style.g('resource-display',item,'span')[0].innerHTML);
			var i = 0;				
			var storedSources = AjaxHandler.parse_json(unescapeJSON(WorklistStorage.get("StoredOtherSourcesList", false)));
			var wasChecked=false;
			
			if (typeof storedSources != "undefined") {
				for (i = 0; i < storedSources[myday_ndx].SOURCES.length; i++) {
					if (storedSources[myday_ndx].SOURCES[i].SOURCE_DISPLAY == value) {
					// The check condition needs to be applied on all the tabs else the updated JSON will not be called.
					    if (storedSources[myday_ndx].SOURCES[i].SELECTED_IND ==1 || storedSources[calendar_ndx].SOURCES[i].SELECTED_IND ==1
						    || storedSources[openitems_ndx].SOURCES[i].SELECTED_IND ==1 || storedSources[upcoming_ndx].SOURCES[i].SELECTED_IND ==1)
						{
						 wasChecked=true;
						}
						storedSources[myday_ndx].SOURCES.splice(i, 1);
						storedSources[calendar_ndx].SOURCES.splice(i, 1);
						storedSources[openitems_ndx].SOURCES.splice(i, 1);
						storedSources[upcoming_ndx].SOURCES.splice(i, 1);
					}
				}
				AmbulatoryWorklist.setResourceFavList(storedSources);				
			}
			return wasChecked;
		},					

		/*This function is called to unselect all resources in the resource dropdown box*/	
		removeResourceChecks: function(){
			var resourceList = AmbulatoryWorklist.getResourcelist();
			var l = resourceList.length;		

			for(var i=0;i<l;i++){
				//when we get to the add other row, exit loop
				if (Util.Style.ccss(resourceList[i], "add-other-li")) {
					break;
				}
				if (Util.gc(resourceList[i], 0).checked) {
					Util.gc(resourceList[i], 0).checked = false;
				}
			}
		},		

		/*This function is used to build the resource list selection based on the tab selected with respect to corresponding preference list */						
		updateResourceList: function(){
			var currResDiv = _g('curr-resource-display-id');	
			var resListCell;			
			if(AmbulatoryWorklist.getParentRow(currResDiv).children.length>1){
				resListCell = Util.gc(AmbulatoryWorklist.getParentRow(currResDiv),1);
			} else {
				resListCell = Util.gc(AmbulatoryWorklist.getParentRow(currResDiv),0);
			}

			resListCell.innerHTML = WorklistSelection.buildOtherSourceSelections(null);	
			AmbulatoryWorklist.setResourcesWidth();
			AmbulatoryWorklist.currentResourceDisplay();
			AmbulatoryWorklist.resourceDropDownHoverController();
			AmbulatoryWorklist.addScrollToResourceDropDown();
		},		

		addHover : function(d, classStr){
			Util.Style.acss(d, classStr);
		},
		removeHover : function(d, classStr){
			Util.Style.rcss(d, classStr);
		},


		//This function is used to return the count of number of resources selected 
		getSelectedResourceCount : function(){
			var resourceList = AmbulatoryWorklist.getResourcelist();
			var checkedCnt = 0;
			var l = resourceList.length;
			for(var i=0;i<l;i++){
				if (Util.Style.ccss(resourceList[i], "add-other-li")) {
					break;
				}
				if(Util.gc(resourceList[i],0).checked){
					checkedCnt++;
				}
			}
			return checkedCnt;
		},		

		resourceClick : function(resourceLI) {
			if(AmbulatoryWorklist.getCurrTab()==myday_tab)
			{
				if(resourceLI.firstChild.checked){resourceLI.firstChild.checked = false;}
				else {resourceLI.firstChild.checked = true;}
			}
			else
			{
				AmbulatoryWorklist.removeResourceChecks();
				resourceLI.firstChild.checked = true;
			}
		},
		
		resourceCheckboxClick : function(resourceLI) {
			if(AmbulatoryWorklist.getCurrTab()!=myday_tab)
			{
				AmbulatoryWorklist.removeResourceChecks();
				resourceLI.firstChild.checked = true;
			}
		},
		
		/**
		cnvtDurationToDisplayString: This function is used to convert duration into hours and minutes string 
		@param: duration: Total duration of the status is passed as an input.
		*/
		cnvtDurationToDisplayString : function(duration){
			var hrs =0, 
				mins = 0, 
				dislayString = "";
			if(duration == 0){
				duration = 1;
			}
			if(duration >= 60){
				hrs = Math.floor(duration/60);
				mins = (duration%60);
						if(hrs < 48 && (mins >= 0 && mins < 60)){
						displayString = AmbulatoryWorklist.cnvtHoursToString(hrs);
							if(mins > 0){
								displayString = displayString + " " + AmbulatoryWorklist.cnvtMinsToString(mins);
							}		
						}
						else{
							hrs = 48;
							displayString = AmbulatoryWorklist.cnvtHoursToString(hrs);
						}
			}
			else{
				displayString = AmbulatoryWorklist.cnvtMinsToString(duration);
			}
			return displayString;
		},
		
		/**
		cnvtHoursToString: This function is used to apply internationalization to hours 
		@param: hours: Total hours is passed as an input.
		*/
		cnvtHoursToString : function(hours){
			var hrString = ""; 
			if(hours > 1){
				if(hours!=48){
					hrString = i18n.WITHIN_HOURS.replace("{0}", hours);
				}
				else{
					hrString = i18n.WITHIN_HOURS.replace("{0}", "48+");
				}
			 }
			 else{
				hrString = i18n.WITHIN_HOUR.replace("{0}", hours);
			 }
			 return hrString;
		
		},
		/**
		cnvtMinsToString: This function is used to apply internationalization to minutes 
		@param: hours: Total minutes is passed as an input.
		*/
		cnvtMinsToString : function(mins){
			 var minString = "";
			 if(mins > 1){
				minString = i18n.WITHIN_MINS.replace("{0}", mins);
			 }
			 else{
				minString = i18n.WITHIN_MIN.replace("{0}", mins);
			 }
			 return minString;
		},
		
		disableTimeline : function() {
			var timelineDiv = _g('timeline-container-id');
			//check to see if timeline is expanded/hidden. if it is expanded, then collapse and save prefs 
			//so that when it is reloaded, it will display collapse and it will set the timeline to be disabled at that time.
			//we cannot make it to disable here because the reload logic will clean the page and it won't be able to find the timeline div
			//to toggle classes.
			if(timelineDiv){
				if (!Util.Style.ccss(timelineDiv, 'hidden')) 
				{	
					//currently expand, the collapse, save prefs and disable timeline
					var userPrefs = AmbulatoryWorklist.getUserPrefList();
					userPrefs.TIMELINE = "Collapse";//save it to collapse so when prefs is loaded, it will be collapsed
					AmbulatoryWorklist.setUserPrefList(userPrefs);					
				}	
			}
		},//end disableTimeline
		/**
		 * Calculates difference between two dates given and returns string with appropriate units
		 * If no endDate is given it is assumed the endDate is the current date/time
		 * 
		 * @param beginDate [REQUIRED] Begin <code>Date</code> for Calculation
		 * @param endDate [OPTIONAL] End <code>Date</code> for Calculation
		 * @param mathFlag [OPTIONAL] <code>Integer</code> Flag to determine if Math.Ceil or Math.Floor is used defaults to Math.floor 1 = Floor, 0 = Ceil		
		 * @param abbreviateFlag [REQUIRED] <code>Boolean</code> to determine if shortened versions of Month,Year,Weeks,Days should be used such as in the case of a within string					
		 */
		GetDateDiffString : function(beginDate, endDate, mathFlag, abbreviateFlag){
			var i18nCore = i18n.discernabu;
			var timeDiff = 0;
			var returnVal = "";
			//Set endDate to current time if it's not passed in
			endDate = (!endDate) ? new Date() : endDate;
			mathFlag = (!mathFlag) ? 0 : mathFlag;
			var one_minute = 1000*60;
			var one_hour = one_minute*60;
			var one_day = one_hour*24;
			var one_week = one_day*7;

			var valMinutes = 0;
			var valHours = 0;
			var valDays = 0;
			var valWeeks = 0;
			var valMonths = 0;
			var valYears = 0;
			//time diff in milliseconds
			timeDiff = (endDate.getTime() - beginDate.getTime());

			//Choose if ceiling or floor should be applied
			var mathFunc = null;
			var comparisonFunc = null;
			if (mathFlag == 0) {
				mathFunc = function(val){
					return Math.ceil(val);
				};
				comparisonFunc = function(lowerVal, upperVal){
					return( lowerVal <= upperVal);
				};
			}
			else{
				mathFunc = function(val){
					return Math.floor(val);
				};
				comparisonFunc = function(lowerVal, upperVal){
					return( lowerVal < upperVal);
				};
			}

			var calcMonths = function () {
				var removeCurYr = 0;
				var removeCurMon = 0;
				var yearDiff = 0;
				var monthDiff = 0;
				var dayDiff = endDate.getDate();
				if(endDate.getMonth() > beginDate.getMonth()) {
					monthDiff = endDate.getMonth() - beginDate.getMonth();
					if(endDate.getDate() < beginDate.getDate()) {
						removeCurMon = 1;
					}
				}
				else if (endDate.getMonth() < beginDate.getMonth()) {
					monthDiff = 12 - beginDate.getMonth() + endDate.getMonth();
					removeCurYr = 1;
					if(endDate.getDate() < beginDate.getDate()) {
						removeCurMon = 1;
					}
				}
				else if(endDate.getDate() < beginDate.getDate()) {
					removeCurYr = 1;
					monthDiff = 11;
				}


				if(endDate.getDate() >= beginDate.getDate()) {
					dayDiff = endDate.getDate() - beginDate.getDate();
				}

				yearDiff = (endDate.getFullYear() - beginDate.getFullYear()) - removeCurYr;
				//days are divided by 32 to ensure the number will always be less than zero
				monthDiff += (yearDiff*12) + (dayDiff/32) - removeCurMon;

				return monthDiff;
			};

			valMinutes = mathFunc(timeDiff / one_minute);
			valHours = mathFunc(timeDiff / one_hour);
			valDays = mathFunc(timeDiff / one_day);
			valWeeks = mathFunc(timeDiff / one_week);
			valMonths = calcMonths();
			valMonths = mathFunc(valMonths);
			valYears = mathFunc(valMonths/12);


			if (comparisonFunc(valHours,2)){		//Less than 2 hours, display number of minutes. Use abbreviation of "mins". 
				returnVal = abbreviateFlag ? (i18n.WITHIN_MINS.replace("{0}", valMinutes)): (i18n.X_MINUTES.replace("{0}", valMinutes));}
			else if (comparisonFunc(valDays,2)){ 	//Less than 2 days, display number of hours. Use abbreviation of "hrs". 
				returnVal = abbreviateFlag ? (i18n.WITHIN_HOURS.replace("{0}", valHours)) : (i18n.X_HOURS.replace("{0}", valHours));}
			else if (comparisonFunc(valWeeks,2)){	//Less than 2 weeks, display number of days. Use "days".
				returnVal = abbreviateFlag ? (i18n.WITHIN_DAYS.replace("{0}", valDays)) : (i18n.X_DAYS.replace("{0}", valDays)) ;}
			else if (comparisonFunc(valMonths,2)){	//Less than 2 months, display number of weeks. Use abbreviation of "wks".
				returnVal = abbreviateFlag ? (i18n.WITHIN_WEEKS.replace("{0}", valWeeks)) : (i18n.X_WEEKS.replace("{0}", valWeeks));}
			else if (comparisonFunc(valYears,2)){	//Less than 2 years, display number of months. Use abbreviation of "mos".
				returnVal = abbreviateFlag ? (i18n.WITHIN_MONTHS.replace("{0}", valMonths)) : (i18n.X_MONTHS.replace("{0}", valMonths)) ;}
			else{ 					//Over 2 years, display number of years.  Use abbreviation of "yrs".
				returnVal = abbreviateFlag ? (i18n.WITHIN_YEARS.replace("{0}", valYears)) : (i18n.X_YEARS.replace("{0}", valYears));}
			return (returnVal);
		},
		billingHover : function(billingSpan) {
			if(!hoverTimer){
				hoverTimer = setTimeout(function(){AmbulatoryWorklist.addBillingHover(billingSpan);}, 100);
			} 
		},
		addBillingHover : function(billingSpan){
			//get row data
			var worklistData = AmbulatoryWorklist.getData();
			var tabName = AmbulatoryWorklist.getCurrTab();
			var jsonData;
			if (tabName == myday_tab) {
				jsonData = worklistData.MY_DAY;
			} else if (tabName == openitems_tab) {
				jsonData = worklistData.OPEN_ITEMS;
			} else {
				jsonData = worklistData.UPCOMING;
			}
			var rowData = MyDay.getApptFromJsonData(jsonData,AmbulatoryWorklist.getOrgApptIdFromParentRow(billingSpan),AmbulatoryWorklist.getOrgApptTypeFromParentRow(billingSpan));
			var isoDate = new Date();
			var localeLanguage = i18nUtility.getLocaleLanguage();
			var localeCountry = i18nUtility.getLocaleCountry();
			var MPAGE_LOCALE = AmbulatoryWorklist.getMpageLocale(localeLanguage, localeCountry);
			var dateString;
			var titleString;
			var statusString;
			var orderName;
			var orderStatus;
			var orderedBy;
			var hoverHtmlArr = [];
			var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
			if(rowData.ORG_APPT_TYPE == APPT_TYPE_AMB){
				dateString = df.formatISO8601(rowData.BILLING_ORDER_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
				titleString = i18n.ORDER;
				statusString = i18n.ORDER_STATUS;
				orderName = rowData.ORDER_MNEMONIC;
				orderStatus = rowData.ORDER_STATUS;
				orderedBy = rowData.ORDERED_BY;
			} else if (rowData.ORG_APPT_TYPE == APPT_TYPE_SURG) {
				if(rowData.PREOP_ORDER_ID > 0.0){
					dateString = df.formatISO8601(rowData.PREOP_ORDER_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
					titleString = i18n.ORDER;
					statusString = i18n.ORDER_STATUS;
					orderName = rowData.PREOP_ORDER_MNEMONIC;
					orderStatus = rowData.PREOP_ORDER_STATUS; 
					orderedBy = rowData.PREOP_ORDERED_BY;
				}else if(rowData.PREOP_POWERPLAN_ID > 0.0){
					dateString = df.formatISO8601(rowData.POWERPLAN_INITIATED_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
					titleString = i18n.POWERPLAN;
					statusString = i18n.POWERPLAN_STATUS;
					orderName = rowData.PREOP_POWERPLAN_DESCRIPTION;
					orderStatus = rowData.PREOP_POWERPLAN_STATUS;
					orderedBy = rowData.POWERPLAN_INITIATED_BY;
				}
			}
			hoverHtmlArr.push("<div class='hvr-label'><span class='pat-hvr-span'>", titleString, ":</span><br/><span class='pat-hvr-span'>", statusString, ":</span><br/><span class='pat-hvr-span'>");
			hoverHtmlArr.push(i18n.ORDERED_BY, ":</span><br/><span class='pat-hvr-span'>", i18n.DATE_ORDERED, ":</span></div><div class='hvr-details'><span class='pat-hvr-span'>");
			hoverHtmlArr.push(orderName, "</span><br/><span class='pat-hvr-span'>", orderStatus, "</span><br/><span class='pat-hvr-span'>");
			hoverHtmlArr.push(orderedBy, "</span><br/><span class='pat-hvr-span'>", dateString, "</span></div>");
			//adding new event, take off add hover event
			billingSpan.onmouseover = null;
			billingSpan.onmouseout = null;

			UtilPopup.attachHover({
				"elementDOM": billingSpan,
				"event": "mousemove",
				"content": hoverHtmlArr.join(""),
				"displayTimeOut": 300
			});	
		},
		clearHoverTimer : function() {
			if(hoverTimer){
				clearTimeout(hoverTimer);
				hoverTimer=null;
			}
		},
		openItemTagHover : function(orderTag) {
			var parentDOM = orderTag.parentNode;
			Util.Style.rcss(Util.Style.g("openitem-checkbox", parentDOM, "input")[0], "hidden");
			Util.Style.acss(Util.Style.g("open-item-icon", parentDOM, "img")[0], "hidden");
		},
		openItemTagHoverOut : function(orderTag) {
			var parentDOM = orderTag.parentNode;
			Util.Style.acss(Util.Style.g("openitem-checkbox", parentDOM, "input")[0], "hidden");
			Util.Style.rcss(Util.Style.g("open-item-icon", parentDOM, "img")[0], "hidden");
		},
		reminderCheckboxClick : function (checkBox, orgApptId, resourceCd, tabName, tag, parentEntityName, surgCaseId,patientRow) {
			var satisfied;
			var scriptName = "mp_amb_wklst_set_satisfier_2";
			var cclParamArr = [];
			var openItemType = "";
			var openItemTag = "";
			var orgApptIdParam = orgApptId;
			switch (tag) {
				case 'note':
					openItemType = "'NOTE'";
					openItemTag = "noteTag";
					break;
				case 'order':
					openItemType = "'ORDER'";
					openItemTag = "orderTag";
					break;
				case 'task':
					openItemType = "'TASK'";
					openItemTag = "taskTag";
					break;
				case 'hp':
					openItemType = "'HP'";
					openItemTag = "hp-tag";
					//For all other tasks, orgApptIdParam will be the same as orgApptId thats passed in. Only for H&P it would be different as it requires the surg_case_id to be passed in.
					orgApptIdParam = surgCaseId;
					break;
				case 'consent':
					openItemType = "'CONSENT'";
					openItemTag = "consent-tag";
					break;
				case 'preop':
					openItemType = "'PREOP'";
					openItemTag = "preop-tag";
					break;

			}
			if (checkBox.checked == true) {
				cclParamArr.push("'MINE'", (parseInt(orgApptIdParam, 10).toFixed(2)), parentEntityName, (parseInt(resourceCd, 10).toFixed(2)), openItemType, "1");
				satisfied = true;
			} else {
				cclParamArr.push("'MINE'", (parseInt(orgApptIdParam, 10).toFixed(2)), parentEntityName, (parseInt(resourceCd, 10).toFixed(2)), openItemType, "0");
				satisfied = false;
			}
			if (tabName == "OPEN_ITEMS") {
				scriptName = "mp_amb_wklst_set_sat_openitm_2";
				var undo_ind = 0;
				var worklistData = AmbulatoryWorklist.getData();
				var rowData;
				var apptID;	//will carry SCH_APPT_ID fpr office visit appointments and SURG_CASE_ID for surgery appointments
				worklistData = worklistData[tabName];
				if(tag == "note" || tag == "order" || tag =="task"){
					rowData = MyDay.getApptFromJsonData(worklistData, orgApptId, 1); // office visit appointment
					apptID = rowData.SCH_APPT_ID;
				} else if(tag == "hp" || tag == "consent" || tag =="preop"){
					rowData = MyDay.getApptFromJsonData(worklistData, orgApptId, 2); // surgery appointment
					apptID = rowData.SURGCASE[0].SURG_CASE_ID;
				}
				if ((satisfied == true) && (rowData.OPEN_ITEM_CNT == 1)) {
					undo_ind = 1;
				}
				undo_data.UNDO_IND = undo_ind;
				cclParamArr.push((parseInt(apptID, 10).toFixed(2)), undo_ind, "0");
			}

			if (tabName == upcoming_tab) {

				scriptName = "mp_amb_wklst_set_sat_openitm_2";
				var undo_ind = 0;
				var worklistData = AmbulatoryWorklist.getData();
				var rowData;
				var apptID; //will carry SCH_APPT_ID fpr office visit appointments and SURG_CASE_ID for surgery appointments
				worklistData = worklistData[tabName];
				if (tag == "hp" || tag == "consent" || tag == "preop") {
					rowData = MyDay.getApptFromJsonData(worklistData, orgApptId, 2); // surgery appointment
					apptID = rowData.SURGCASE[0].SURG_CASE_ID;
				}
				if ((satisfied == true) && (rowData.OPEN_ITEM_CNT == 1)) {
					undo_ind = 1;
				}
				undo_data.UNDO_IND = undo_ind;
				cclParamArr.push((parseInt(apptID, 10).toFixed(2)), undo_ind, "0");

				//cclParamArr.push((parseInt(apptID, 10).toFixed(2)), "0", "0");

			}

			var cclParam = cclParamArr.join(",");
			cclParam = cclParam.replace(/"/g, "'");
			AjaxHandler.ajax_request({
				request: {
					type: "XMLCCLREQUEST",
					target: scriptName,
					parameters: cclParam
				},
				response: {
					type: "JSON",
					target: AmbulatoryWorklist.setManSatisfyReturn,
					parameters: [openItemTag, patientRow, tabName, satisfied]
				}
			});
		},
		setManSatisfyReturn : function(jsonResponse){
			var jdata = jsonResponse.response.REPLY.STATUS_DATA.STATUS;
			var itemType = jsonResponse.parameters[0];			
			var patientRow = jsonResponse.parameters[1];
			var tabName = jsonResponse.parameters[2];
			var satisfied = jsonResponse.parameters[3];
			if (tabName == openitems_tab) {
				curTabObj = OpenItems;
			} else if (tabName == myday_tab) {
				curTabObj = MyDay;
			} else if (tabName == upcoming_tab) {
				curTabObj = UpcomingItems;
			} else {
				return;
			}			
			// Upcoming Items tab does not have orderLinkString, docLinkString, taskLinkString declared
			if (tabName != upcoming_tab) {
				var orderLinkString = curTabObj.getOrderLink();
				var docLinkString = curTabObj.getDocLink();
				var taskLinkString = curTabObj.getTaskLink();
			}
			var hpLinkString = curTabObj.getHPLink();
			var consentLinkString = curTabObj.getConsentLink();
			var preopLinkString = curTabObj.getPreopLink();
			var orgApptId = AmbulatoryWorklist.getOrgApptIdFromParentRow(patientRow);
			if (jdata == "S") {
				var worklistData = AmbulatoryWorklist.getData();
				worklistData = worklistData[tabName];
				var openItemCnt = Util.Style.g('open-items-cnt-hidden', patientRow, 'span')[0];
				var rowData = curTabObj.getApptFromJsonData(worklistData, AmbulatoryWorklist.getOrgApptIdFromParentRow(patientRow), AmbulatoryWorklist.getOrgApptTypeFromParentRow(patientRow));
				var statusInd = Util.Style.g("status-ind", patientRow, "span")[0];
				if (itemType == "orderTag") {					
						
						for (var i = 0; i < worklistData.length; i++) {
						if(worklistData[i].SCH_EVENT_ID == rowData.SCH_EVENT_ID){
						var currentRowId = "_"+worklistData[i].ORG_APPT_ID+"_"+worklistData[i].ORG_APPT_TYPE+"_"+worklistData[i].PRIMARY_TAB;
						var currentRow = _g(currentRowId);
						var orderTag = Util.Style.g("orderTag", currentRow, "span")[0];
						var statusInd = Util.Style.g("status-ind", currentRow, "span")[0];
						checkBox = $("#_"+worklistData[i].ORG_APPT_ID+"_"+worklistData[i].ORG_APPT_TYPE+"_"+worklistData[i].PRIMARY_TAB+" .orderTag .openitem-checkbox");
						checkBox.prop('checked', satisfied);
						var orderTagArr = [];
						if (satisfied == true) {
							orderTagArr.push("<span class='complete-billing completed-item'");
							orderTagArr.push("onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='order' value='1'>");
							orderTagArr.push("<img class='open-item-icon' src='../img/order_dithered.png' >   ", i18n.ORDER_COMPLETED, "</span><br/>");
						} else {
							if (orderLinkString !== "") {
								if (orderLinkString.indexOf("+") == -1) {
									orderLinkString = orderLinkString + "+";
								}
							}
							orderTagArr.push("<a class='item-link' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);' href='javascript:APPLINK(0,\"powerchart.exe\",\"/PERSONID=", worklistData[i].PERSON_ID, " /ENCNTRID=", worklistData[i].ENCNTR_ID, " /FIRSTTAB=^", orderLinkString, "^\");'");
							orderTagArr.push("><img class='open-item-icon' src='../img/order.png' >  ");
							orderTagArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='order' value='1'>");
							orderTagArr.push(i18n.ORDER_NOT_STARTED, "</a><br/>");
						}
						orderTag.innerHTML = orderTagArr.join("");
						
							worklistData[i].ORDER_ID = 0;
							worklistData[i].ORDER_MNEMONIC = "";
							worklistData[i].ORDERED_BY = "";
							worklistData[i].ORDER_MANUAL_IND = 1;
							if (satisfied == true) {
								worklistData[i].BILLING_ORDER_PRESENT = "Y";
								worklistData[i].OPEN_ITEM_CNT = worklistData[i].OPEN_ITEM_CNT - 1;
							} else {
								worklistData[i].BILLING_ORDER_PRESENT = "N";
								worklistData[i].OPEN_ITEM_CNT = worklistData[i].OPEN_ITEM_CNT + 1;
							}
							if (tabName == myday_tab) {
								openItemCnt.innerHTML = worklistData[i].OPEN_ITEM_CNT;
								if (worklistData[i].OPEN_ITEM_CNT == 0) {
									Util.Style.rcss(statusInd, "open-items");
								} else {
									Util.Style.acss(statusInd, "open-items");
								}
							}else {
								if (worklistData[i].OPEN_ITEM_CNT == 0) {
									var id = "#" + patientRow.id;
									var $a = $(id);
									$a = $a.parent();
									$a.children(".break-row").detach();
									Util.de(patientRow);
									curTabObj.insertRowBreak();
								}
							}					
						}
					}
				} else if (itemType == "noteTag") {
					
					for(var i=0; i<worklistData.length;i++){
						
						if(worklistData[i].SCH_EVENT_ID == rowData.SCH_EVENT_ID){
						
							var currentRowId = "_"+worklistData[i].ORG_APPT_ID+"_"+worklistData[i].ORG_APPT_TYPE+"_"+worklistData[i].PRIMARY_TAB;
							var currentRow = _g(currentRowId);
							var noteTag = Util.Style.g("noteTag", currentRow, "span")[0];
							var statusInd = Util.Style.g("status-ind", currentRow, "span")[0];
							//var rowData = curTabObj.getApptFromJsonData(worklistData, AmbulatoryWorklist.getOrgApptIdFromParentRow(currentRow),AmbulatoryWorklist.getOrgApptTypeFromParentRow(currentRow));
							checkBox = $("#_"+worklistData[i].ORG_APPT_ID+"_"+worklistData[i].ORG_APPT_TYPE+"_"+worklistData[i].PRIMARY_TAB+" .noteTag.reminder-task .openitem-checkbox");
							checkBox.prop('checked', satisfied);
							var isResidentNoteExist = jsonResponse.response.REPLY.PHYSICIAN_NOTE_COMPLETED_BY_RESIDENT;
							var isNoteCompleted = jsonResponse.response.REPLY.PHYSICIAN_NOTE_COMPLETED;			
							worklistData[i].PHYSICIAN_NOTE_COMPLETED = isNoteCompleted;
							worklistData[i].PHYSICIAN_NOTE_COMPLETED_BY_RESIDENT = isResidentNoteExist ;
							var noteTagArr = [];
							if (satisfied == true) { 
								noteTagArr.push("<span class='completed-item' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
								noteTagArr.push("><img class='open-item-icon' src='../img/note_dithered.png' ><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='note' value='1'>   ");
								noteTagArr.push(i18n.NOTE_COMPLETED, "</span><br/>");
							}
							else {
								
								if (worklistData[i].PHYSICIAN_NOTE_COMPLETED_BY_RESIDENT == "Y") {
									noteTagArr.push(AmbulatoryWorklist.manuallySatisfyResidentNote(worklistData[i], docLinkString));
									noteTagArr.push("<br/>");
								}else{
											if(docLinkString !== ""){
											if(docLinkString.indexOf("+") == -1){
												docLinkString=docLinkString + "+";
											}
										}
										noteTagArr.push("<a class='item-link' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'  href='javascript:APPLINK(0,\"powerchart.exe\",\"/PERSONID=",worklistData[i].PERSON_ID," /ENCNTRID=",worklistData[i].ENCNTR_ID," /FIRSTTAB=^",docLinkString,"^\");'");
										noteTagArr.push("><img class='open-item-icon' src='../img/note.png' >  ");
										noteTagArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='note' value='1'>");
										noteTagArr.push(i18n.NOTE_NOT_STARTED,"</a><br/>");
								}
							}
							noteTag.innerHTML = noteTagArr.join("");
							worklistData[i].PHYSICIAN_NOTE_EVENT_ID = 0;
							worklistData[i].NOTE_MANUAL_IND = 1;
							if (satisfied == true) {
								//Dont decrease for Nurse
								if(!(worklistData[i].PHYSICIAN_NOTE_COMPLETED == "Y" && worklistData[i].PHYSICIAN_NOTE_COMPLETED_BY_RESIDENT =='Y')){															
									worklistData[i].OPEN_ITEM_CNT = worklistData[i].OPEN_ITEM_CNT - 1;
									worklistData[i].PHYSICIAN_NOTE_COMPLETED = "Y";
								}
								
							} else {
							//Dont increase for Nurse
								if(!(worklistData[i].PHYSICIAN_NOTE_COMPLETED == "Y" && worklistData[i].PHYSICIAN_NOTE_COMPLETED_BY_RESIDENT =='Y')){
									worklistData[i].PHYSICIAN_NOTE_COMPLETED = "N";
									worklistData[i].OPEN_ITEM_CNT = worklistData[i].OPEN_ITEM_CNT + 1;
								}
							}
							if (tabName == myday_tab) {
								openItemCnt.innerHTML = worklistData[i].OPEN_ITEM_CNT;
								if (worklistData[i].OPEN_ITEM_CNT == 0) {
									Util.Style.rcss(statusInd, "open-items");
								} else {
									Util.Style.acss(statusInd, "open-items");
								}
							}else {
								if (worklistData[i].OPEN_ITEM_CNT == 0) {
									var id = "#" + patientRow.id;
									var $a = $(id);
									$a = $a.parent();
									$a.children(".break-row").detach();
									Util.de(patientRow);
									curTabObj.insertRowBreak();
								}
							}
						}				
					}
				} else if (itemType == "taskTag") {
					for (var i = 0; i < worklistData.length; i++) {
						if(worklistData[i].SCH_EVENT_ID == rowData.SCH_EVENT_ID){
						var currentRowId = "_"+worklistData[i].ORG_APPT_ID+"_"+worklistData[i].ORG_APPT_TYPE+"_"+worklistData[i].PRIMARY_TAB;
						var currentRow = _g(currentRowId);
						var taskTag = Util.Style.g("taskTag", currentRow, "span")[0];
						var statusInd = Util.Style.g("status-ind", currentRow, "span")[0];
						checkBox = $("#_"+worklistData[i].ORG_APPT_ID+"_"+worklistData[i].ORG_APPT_TYPE+"_"+worklistData[i].PRIMARY_TAB+" .taskTag.reminder-task .openitem-checkbox");
						checkBox.prop('checked', satisfied);
						var taskTagArr = [];
					
						if (satisfied == true) {
						taskTagArr.push("<span class='completed-item' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'>",
							"<img class='open-item-icon' src='../img/task_dithered.png' ><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='task' value='1'>   ", i18n.TASK_LIST_COMPLETE, "</span><br/>");
						} else {
							if (taskLinkString !== "") {
								if (taskLinkString.indexOf("+") == -1) {
									taskLinkString = taskLinkString + "+";
								}
							}
							taskTagArr.push("<a class='item-link' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'  href='javascript:APPLINK(0,\"powerchart.exe\",\"/PERSONID=", worklistData[i].PERSON_ID, " /ENCNTRID=", worklistData[i].ENCNTR_ID, " /FIRSTTAB=^", taskLinkString, "^\");'",
								"><img class='open-item-icon' src='../img/task.png'> <input class='openitem-checkbox hidden' type='checkbox' name='task' value='1'>", i18n.TASK_LIST_NOT_COMPLETE, "</a><br/>");
						}
						taskTag.innerHTML = taskTagArr.join("");
							worklistData[i].TASK_LIST_MANUAL_IND = 1;
							if (satisfied == true) {
								worklistData[i].TASK_LIST_COMPLETED = "Y";
								worklistData[i].OPEN_ITEM_CNT = worklistData[i].OPEN_ITEM_CNT - 1;
							} else {
								worklistData[i].TASK_LIST_COMPLETED = "N";
								worklistData[i].OPEN_ITEM_CNT = worklistData[i].OPEN_ITEM_CNT + 1;
							}
							if (tabName == myday_tab) {
								openItemCnt.innerHTML = worklistData[i].OPEN_ITEM_CNT;
								if (worklistData[i].OPEN_ITEM_CNT == 0) {
									Util.Style.rcss(statusInd, "open-items");
								} else {
									Util.Style.acss(statusInd, "open-items");
								}
							} else {
								if (worklistData[i].OPEN_ITEM_CNT == 0) {
									var id = "#" + patientRow.id;
									var $a = $(id);
									$a = $a.parent();
									$a.children(".break-row").detach();
									Util.de(patientRow);
									curTabObj.insertRowBreak();
								}
							}
						}
					}

				} else if (itemType == "hp-tag") {
					
					for (var i = 0; i < worklistData.length; i++) {
						if (worklistData[i].ORG_APPT_TYPE == APPT_TYPE_SURG 
						&& worklistData[i].SURGCASE[0].SURG_CASE_ID == rowData.SURGCASE[0].SURG_CASE_ID) {
						var currentRowId = "_"+worklistData[i].ORG_APPT_ID+"_"+worklistData[i].ORG_APPT_TYPE+"_"+worklistData[i].PRIMARY_TAB;
						var currentRow = _g(currentRowId);
						var hpTag = Util.Style.g("hp-tag", currentRow, "span")[0];
						var statusInd = Util.Style.g("status-ind", currentRow, "span")[0];	
						checkBox = $("#_"+worklistData[i].ORG_APPT_ID+"_"+worklistData[i].ORG_APPT_TYPE+"_"+worklistData[i].PRIMARY_TAB+" .hp-tag .openitem-checkbox");
						checkBox.prop('checked', satisfied);						
						var hpTagArr = [];
						if (satisfied == true) {
							hpTagArr.push("<span class='completed-item' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
							hpTagArr.push("><img class='open-item-icon' src='../img/note_dithered.png' ><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='hp' value='1'>   ");
							hpTagArr.push(i18n.HP_COMPLETED, "</span><br/>");
						} else {
							if (hpLinkString !== "") {
								if (hpLinkString.indexOf("+") == -1) {
									hpLinkString = hpLinkString + "+";
								}
							}
							hpTagArr.push("<a class='item-link' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);' href='javascript:APPLINK(0,\"powerchart.exe\",\"/PERSONID=", worklistData[i].PERSON_ID, " /ENCNTRID=", worklistData[i].ENCNTR_ID, " /FIRSTTAB=^", hpLinkString, "^\");'");
							hpTagArr.push("><img class='open-item-icon' src='../img/note.png' >  ");
							hpTagArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='hp' value='1'>");
							hpTagArr.push(i18n.HP_NOT_STARTED, "</a><br/>");
						}
						hpTag.innerHTML = hpTagArr.join("");
							worklistData[i].HP_MANUAL_IND = 1;
							if (satisfied == true) {
								worklistData[i].H_P_COMPLETED = "Y";
								worklistData[i].OPEN_ITEM_CNT = worklistData[i].OPEN_ITEM_CNT - 1;
							} else {
								worklistData[i].H_P_COMPLETED = "N";
								worklistData[i].OPEN_ITEM_CNT = worklistData[i].OPEN_ITEM_CNT + 1;
							}
							if (tabName == myday_tab) {
								openItemCnt.innerHTML = worklistData[i].OPEN_ITEM_CNT;
								if (worklistData[i].OPEN_ITEM_CNT == 0) {
									Util.Style.rcss(statusInd, "open-items");
								} else {
									Util.Style.acss(statusInd, "open-items");
								}
							}else {

								if (worklistData[i].OPEN_ITEM_CNT == 0) {
									var id = "#" + patientRow.id;
									var $a = $(id);
									$a = $a.parent();
									$a.children(".break-row").detach();
									Util.de(patientRow);
									curTabObj.insertRowBreak();
								}
							}
						}
					}

				} else if (itemType == "consent-tag") {
					var consentTag = Util.Style.g("consent-tag", patientRow, "span")[0];
					var consentTagArr = [];

					if (satisfied == true) {
						consentTagArr.push("<span class='completed-item' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
						consentTagArr.push("><img class='open-item-icon' src='../img/note_dithered.png' ><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='consent' value='1'>   ");
						consentTagArr.push(i18n.CONSENT_COMPLETED, "</span><br/>");
					} else {
						if (consentLinkString !== "") {
							if (consentLinkString.indexOf("+") == -1) {
								consentLinkString = consentLinkString + "+";
							}
						}
						consentTagArr.push("<a class='item-link' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);' href='javascript:APPLINK(0,\"powerchart.exe\",\"/PERSONID=", rowData.PERSON_ID, " /ENCNTRID=", rowData.ENCNTR_ID, " /FIRSTTAB=^", consentLinkString, "^\");'");
						consentTagArr.push("><img class='open-item-icon' src='../img/note.png' >  ");
						consentTagArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='consent' value='1'>");
						consentTagArr.push(i18n.CONSENT_NOT_STARTED, "</a><br/>");
					}
					consentTag.innerHTML = consentTagArr.join("");
					for (var i = 0; i < worklistData.length; i++) {
						if (worklistData[i].ORG_APPT_ID == orgApptId) {
							worklistData[i].CONSENT_MANUAL_IND = 1;
							if (satisfied == true) {
								worklistData[i].CONSENT_COMPLETED = "Y";
								worklistData[i].OPEN_ITEM_CNT = worklistData[i].OPEN_ITEM_CNT - 1;
							} else {
								worklistData[i].CONSENT_COMPLETED = "N";
								worklistData[i].OPEN_ITEM_CNT = worklistData[i].OPEN_ITEM_CNT + 1;
							}
							if (tabName == myday_tab) {
								openItemCnt.innerHTML = worklistData[i].OPEN_ITEM_CNT;
								if (worklistData[i].OPEN_ITEM_CNT == 0) {
									Util.Style.rcss(statusInd, "open-items");
								} else {
									Util.Style.acss(statusInd, "open-items");
								}
							} else if (tabName == openitems_tab) {
								if (worklistData[i].OPEN_ITEM_CNT == 0) {
									var id = "#" + patientRow.id;
									var $a = $(id);
									$a = $a.parent();
									$a.children(".break-row").detach();
									Util.de(patientRow);
									OpenItems.insertRowBreak();
								}
							} else {

								if (worklistData[i].OPEN_ITEM_CNT == 0) {
									var id = "#" + patientRow.id;
									var $a = $(id);
									$a = $a.parent();
									$a.children(".break-row").detach();
									Util.de(patientRow);
									UpcomingItems.insertRowBreak();
								}
							}
							break;
						}
					}

				} else if (itemType == "preop-tag") {
					var preopTag = Util.Style.g("preop-tag", patientRow, "span")[0];
					var preopTagArr = [];

					if (satisfied == true) {
						preopTagArr.push("<span class='complete-billing completed-item'");
						preopTagArr.push("onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='preop' value='1'>");
						preopTagArr.push("<img class='open-item-icon' src='../img/order_dithered.png' >   ", i18n.PREOP_ORDER_COMPLETE, "</span><br/>");
					} else {
						if (preopLinkString !== "") {
							if (preopLinkString.indexOf("+") == -1) {
								preopLinkString = preopLinkString + "+";
							}
						}
						preopTagArr.push("<a class='item-link' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);' href='javascript:APPLINK(0,\"powerchart.exe\",\"/PERSONID=", rowData.PERSON_ID, " /ENCNTRID=", rowData.ENCNTR_ID, " /FIRSTTAB=^", preopLinkString, "^\");'");
						preopTagArr.push("><img class='open-item-icon' src='../img/order.png' >  ");
						preopTagArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='preop' value='1'>");
						preopTagArr.push(i18n.PREOP_ORDER_NOT_STARTED, "</a><br/>");
					}

					preopTag.innerHTML = preopTagArr.join("");
					for (var i = 0; i < worklistData.length; i++) {
						if (worklistData[i].ORG_APPT_ID == orgApptId) {
							worklistData[i].PREOP_MANUAL_IND = 1;
							if (satisfied == true) {
								worklistData[i].PREOP_ORDER_COMPLETE = "Y";
								worklistData[i].OPEN_ITEM_CNT = worklistData[i].OPEN_ITEM_CNT - 1;
							} else {
								worklistData[i].PREOP_ORDER_COMPLETE = "N";
								worklistData[i].OPEN_ITEM_CNT = worklistData[i].OPEN_ITEM_CNT + 1;
							}
							if (tabName == myday_tab) {
								openItemCnt.innerHTML = worklistData[i].OPEN_ITEM_CNT;
								if (worklistData[i].OPEN_ITEM_CNT == 0) {
									Util.Style.rcss(statusInd, "open-items");
								} else {
									Util.Style.acss(statusInd, "open-items");
								}
							} else if (tabName == openitems_tab) {
								if (worklistData[i].OPEN_ITEM_CNT == 0) {
									var id = "#" + patientRow.id;
									var $a = $(id);
									$a = $a.parent();
									$a.children(".break-row").detach();
									Util.de(patientRow);
									OpenItems.insertRowBreak();
								}
							} else {

								if (worklistData[i].OPEN_ITEM_CNT == 0) {
									var id = "#" + patientRow.id;
									var $a = $(id);
									$a = $a.parent();
									$a.children(".break-row").detach();
									Util.de(patientRow);
									UpcomingItems.insertRowBreak();
								}
							}
							break;
						}
					}

				}
			}
		}, //end setManSatisfyReturn
		manuallySatisfyResidentNote : function(rowData,docLink){
			
			var htmlArr = [];

			
			
			/* for Physician enable the text and provide link to New Note*/
			if (rowData.PHYSICIAN_NOTE_COMPLETED == "N") {
				htmlArr.push("<a class='item-link'");
				htmlArr.push(" onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
				
				if (docLink !== "") {
					if (docLink.indexOf("+") == -1) {
						docLink = docLink + "+";
					}
				}
				htmlArr.push(' href=\'javascript:APPLINK(0,"powerchart.exe","/PERSONID=', rowData.PERSON_ID, " /ENCNTRID=", rowData.ENCNTR_ID, " /FIRSTTAB=^", docLink, "^\");'");
				htmlArr.push("><img class='open-item-icon' src='../img/note.png' >  ");	
				htmlArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='note' value='1'>");
				htmlArr.push(i18n.NOTE_COMPLETED_BY_RESIDENT_MANUALLY, "</a>");
			} else {
				/* for users other than Physician & Resident dither the text and provide link to New Note*/
				htmlArr.push("<span class='completed-item'>");
				htmlArr.push("<a class='item-link'");
				htmlArr.push(" onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
				
				if (docLink !== "") {
					if (docLink.indexOf("+") == -1) {
						docLink = docLink + "+";
					}
				}
				htmlArr.push(' href=\'javascript:APPLINK(0,"powerchart.exe","/PERSONID=', rowData.PERSON_ID, " /ENCNTRID=", rowData.ENCNTR_ID, " /FIRSTTAB=^", docLink, "^\");'");
				htmlArr.push("><img class='open-item-icon' src='../img/note_dithered.png' >  ");	
				htmlArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='note' value='1'>");
				htmlArr.push(i18n.NOTE_COMPLETED_BY_RESIDENT_MANUALLY,"</a>");
				htmlArr.push("</span>");
				
			}
				
		        
			return htmlArr.join("");
				
		},
		getResidentNoteStatus : function(rowData){
			if(rowData.PHYSICIAN_NOTE_COMPLETED_BY_RESIDENT_STATUS == 1)
				return i18n.NOTE_SAVED_BY_RESIDENT;
			else 
				return i18n.NOTE_COMPLETED_BY_RESIDENT;
		},
		patInfoColGenHTML : function(rowData){
			var htmlArr = [];
			var isoDate = new Date();
			var ageString = "";
			if (rowData.DOB_DISPLAY) {
				isoDate.setISO8601(rowData.DOB_DISPLAY);
				ageString = AmbulatoryWorklist.GetDateDiffString(isoDate, new Date(), 1, false);
			}
			htmlArr.push("<a class='pat-link' href='javascript:APPLINK(0,\"powerchart.exe\",\"/PERSONID=",rowData.PERSON_ID," /ENCNTRID=",rowData.ENCNTR_ID," /FIRSTTAB=^^\");'><span class='patInfo' onmouseover='AmbulatoryWorklist.patInfoHover(this);' onmouseout='AmbulatoryWorklist.clearHoverTimer();'>");
			htmlArr.push("<span class='patient-name'>",rowData.PERSON_NAME,"</span><span class='pat-age-sex'><span class='sub-detail'>",ageString,"</span>&nbsp;<span class='sub-detail'>",rowData.GENDER,"</span></span>");
			htmlArr.push("</span></a>");
			return htmlArr.join("");
		},
		patInfoHover : function(patInfoSpan){
			if(!hoverTimer){
				hoverTimer = setTimeout(function(){AmbulatoryWorklist.addPatInfoHover(patInfoSpan);}, 100);
			} 
		},
		addPatInfoHover: function(patInfoSpan){
			var labelArr = [];
			var detailsArr = [];
			var isoDate = new Date();
			var tabName = AmbulatoryWorklist.getCurrTab();
			var rowData;
			var jsonData;
			if(tabName == myday_tab){
				jsonData = AmbulatoryWorklist.getData().MY_DAY;
				rowData = MyDay.getApptFromJsonData(jsonData,AmbulatoryWorklist.getOrgApptIdFromParentRow(patInfoSpan),AmbulatoryWorklist.getOrgApptTypeFromParentRow(patInfoSpan));
			}
			else if (tabName == openitems_tab) {
				jsonData = AmbulatoryWorklist.getData().OPEN_ITEMS;
				rowData = OpenItems.getApptFromJsonData(jsonData,AmbulatoryWorklist.getOrgApptIdFromParentRow(patInfoSpan),AmbulatoryWorklist.getOrgApptTypeFromParentRow(patInfoSpan));
 } else {
jsonData = AmbulatoryWorklist.getData().UPCOMING;
				rowData = UpcomingItems.getApptFromJsonData(jsonData, AmbulatoryWorklist.getOrgApptIdFromParentRow(patInfoSpan), AmbulatoryWorklist.getOrgApptTypeFromParentRow(patInfoSpan));

			}
			var dateString = "";
			if(rowData.DOB_DISPLAY){
				var localeLanguage = i18nUtility.getLocaleLanguage();
				var localeCountry = i18nUtility.getLocaleCountry();
				var MPAGE_LOCALE = AmbulatoryWorklist.getMpageLocale(localeLanguage, localeCountry);
				var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
				dateString = df.formatISO8601(rowData.DOB_DISPLAY, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
			}
			labelArr.push("<div class='hvr-label'><span class='pat-hvr-span'>",i18n.NAME,":</span>");
			detailsArr.push("<div class='hvr-details'><span class='pat-hvr-span'>",rowData.PERSON_NAME,"</span>");
			if(rowData.MRN.length !=0){
			labelArr.push("<br/><span class='pat-hvr-span'>",i18n.MRN,":</span>");
			detailsArr.push("<br/><span class='pat-hvr-span'>",rowData.MRN,"</span>");
			}
			if (tabName == myday_tab && rowData.FIN_NBR.length !=0) {
				labelArr.push("<br/><span class='pat-hvr-span'>",i18n.FIN,":</span>");
				detailsArr.push("<br/><span class='pat-hvr-span'>",rowData.FIN_NBR,"</span>");
			}
			else if( tabName != myday_tab && rowData.FNBR.length !=0) {
				labelArr.push("<br/><span class='pat-hvr-span'>",i18n.FIN,":</span>");
				detailsArr.push("<br/><span class='pat-hvr-span'>",rowData.FNBR,"</span>");
			}
			if (dateString > "") {
				labelArr.push("<br/><span class='pat-hvr-span'>",i18n.DOB,":</span>");
				detailsArr.push("<br/><span class='pat-hvr-span'>",dateString,"</span>");
			}
			var phoneCnt = rowData.PHONE_CNT;
			var i;
			for (i = 0; i < phoneCnt; i++) {
				labelArr.push("<br/><span class='pat-hvr-span'>",rowData.PHONE_QUAL[i].PHONE_TYPE,":</span>");
				if (tabName == myday_tab) {
					detailsArr.push("<br/><span class='pat-hvr-span'>", rowData.PHONE_QUAL[i].PHONE_NUMBER, "</span>");
				}
				else {
					detailsArr.push("<br/><span class='pat-hvr-span'>", rowData.PHONE_QUAL[i].PHONE_NUM, "</span>");
				}
			}
			labelArr.push("</div>");
			detailsArr.push("</div>");
			var contentArr = [labelArr.join(""),detailsArr.join("")];
			var contentStr = contentArr.join(""); 
			patInfoSpan.onmouseover = null;
			patInfoSpan.onmouseout = null;
			UtilPopup.attachHover({
				"elementDOM": patInfoSpan,
				"event": "mousemove",
				"content": contentStr,
				"displayTimeOut": 300
			});
		},
		/**
		statusInfoHover: This function will display the hover for status history 
		@param: statusInfoSpan: the status-info container.
		*/
		statusInfoHover : function (statusInfoSpan) {
			if (!hoverTimer) {
				hoverTimer = setTimeout(function () {
						AmbulatoryWorklist.addstatusInfoHover(statusInfoSpan);
					}, 100);
			}				
		},
		
		/**
		addstatusInfoHover: This function will use the UtilPopup.attachHover() to attach the status history hover details div to status-info span. 
		@param: statusInfoSpan: the status-info container.
		*/
		addstatusInfoHover : function (statusInfoSpan) {
			var statusHTMLArr = [];
			var rowData;
			var jsonData;
			jsonData = AmbulatoryWorklist.getData().MY_DAY;
			rowData = MyDay.getApptFromJsonData(jsonData, AmbulatoryWorklist.getOrgApptIdFromParentRow(statusInfoSpan), AmbulatoryWorklist.getOrgApptTypeFromParentRow(statusInfoSpan));
			var length = rowData.APPT_STATUS_HISTORY.length;
			statusHTMLArr.push("<div class='hvr-details'>");
			for (var i = 0; i < length; i++)
			{
				statusHTMLArr.push("<span class='status-display-span'>",rowData.APPT_STATUS_HISTORY[i].STATUS_DISPLAY,"<span class='time-display-span'> (", AmbulatoryWorklist.cnvtDurationToDisplayString(rowData.APPT_STATUS_HISTORY[i].TOTAL_STATUS_DURATION), ")</span></span><br/>");
			}
			/*The total time in office is only displayed when status is either in seen by status or is in checked out status. 
			  It doesn't display when in checked in status*/
			if(length > 1 || rowData.STATE_MEANING === CHECKED_OUT){
				statusHTMLArr.push("<span class='status-display-span'>",i18n.TOTAL_TIME_IN_OFFICE,"<span class='time-display-span'> (", AmbulatoryWorklist.cnvtDurationToDisplayString(rowData.APPT_STATUS_TOTAL_TIME), ")</span></span>");
			}
			statusHTMLArr.push("</div>");
			var contentStr = statusHTMLArr.join("");
			statusInfoSpan.onmouseover = null;
			statusInfoSpan.onmouseout = null;
			UtilPopup.attachHover({
				"elementDOM" : statusInfoSpan,
				"event" : "mousemove",
				"content" : contentStr,
				"displayTimeOut" : 10

			});
		},
		apptDetailsColGenHTML : function(rowData) {
			var detailsArr = [];
			var displaySchedComment = "" ;
			if (rowData.APPT_SCHED_COMMENT)
			{
				displaySchedComment  = rowData.APPT_SCHED_COMMENT ;
			}
			else
			{
				displaySchedComment = "<span>&nbsp;</span>" ;
			}
			if (rowData.ORG_APPT_TYPE == APPT_TYPE_SURG) //if surgery appt, display primary procedure(modifier if existed). 
			{
				var displaySchedModifier = "" ;
				if (rowData.SURGCASE[0].SURGCASE_DETAILS[0].SCHED_MODIFIER)
				{
					displaySchedModifier  = rowData.SURGCASE[0].SURGCASE_DETAILS[0].SCHED_MODIFIER ;
				}
				else
				{
					displaySchedModifier = "<span>&nbsp;</span>" ;
				}
				
				detailsArr.push("<div class='surg-appt-details-container'><div class='surgeryInfo' onmouseover='AmbulatoryWorklist.surgApptDetailsHover(this);' onmouseout='AmbulatoryWorklist.clearHoverTimer();'><div class='surg-notes-div'><span class='surg-main-detail'>",rowData.SURGCASE[0].SURGCASE_DETAILS[0].SURG_PROC_DISP,"</span>");
				if (rowData.SURGCASE[0].SURGCASE_DETAILS_CNT > 1 ) //if more than 1 procedure, display total number of procedures.
				{
					 detailsArr.push("<span class='surg-main-num-proc'> (",rowData.SURGCASE[0].SURGCASE_DETAILS_CNT,")</span></div><div class='surg-notes-div'><span class='sub-detail appt-desc'>",displaySchedModifier,"</span></div></div></div>");
				}
				else
				{
					detailsArr.push("</div><div class='surg-notes-div'><span class='sub-detail appt-desc'>",displaySchedModifier,"</span></div></div></div>");
				}
			}
			else //office visit appt
			{
				detailsArr.push("<div class='appt-details-container'><div class='notes-div' onmouseover='AmbulatoryWorklist.apptDetailsHover(this);' onmouseout='AmbulatoryWorklist.clearHoverTimer();'><span class='main-detail'>",rowData.APPT_TYPE,"</span></div><div class='notes-div' onmouseover='AmbulatoryWorklist.apptDetailsHover(this);' onmouseout='AmbulatoryWorklist.clearHoverTimer();'><span class='sub-detail appt-desc'>",displaySchedComment,"</span></div></div>");			
			}
			return detailsArr.join("");
		},
		apptDetailsHover : function(apptDetailsDiv){
			if(!hoverTimer){
				hoverTimer = setTimeout(function(){AmbulatoryWorklist.addDetailsHover(apptDetailsDiv);}, 100);
			} 
		},
		addDetailsHover : function(apptDetailsDiv){
			if (apptDetailsDiv.scrollWidth > apptDetailsDiv.offsetWidth) {
				apptDetailsDiv.onmouseover = null;
				apptDetailsDiv.onmouseout = null;
				UtilPopup.attachHover({
					"elementDOM": apptDetailsDiv,
					"event": "mousemove",
					"content": "<div class='notes-hvr'>" + apptDetailsDiv.firstChild.innerHTML + "</div>",
					"displayTimeOut": 300
				});
			}
		},
		
		/**
			surgStatusHover: This function will display the hover for surgery status column when text is long for status or location.
			@param: surgStatusDiv: the surgery status container.
		*/
		surgStatusHover : function(surgStatusDiv){
			if(!hoverTimer){
				hoverTimer = setTimeout(function(){AmbulatoryWorklist.addSurgStatusHover(surgStatusDiv);}, 100);
			} 
		},
		/**
			addSurgStatusHover: This function will use the UtilPopup.attachHover() to populate the full text for status/location 
			that was truncated when the text is long into the pop-up hover window. 
			@param: surgStatusDiv: the surgery status container.
		*/
		addSurgStatusHover : function(surgStatusDiv){
			if (surgStatusDiv.scrollWidth > surgStatusDiv.offsetWidth) {
				surgStatusDiv.onmouseover = null;
				surgStatusDiv.onmouseout = null;
				UtilPopup.attachHover({
					"elementDOM": surgStatusDiv,
					"event": "mousemove",
					"content": "<div class='surg-status-hvr'>" + surgStatusDiv.firstChild.innerHTML + "</div>",
					"displayTimeOut": 300
				});
			}
		},
		/**
			surgApptDetailsHover: This function will display the hover for surgery appointment details.
			@param: surgApptDetailsSpan: the surgery appointment details container.
		*/
		surgApptDetailsHover : function(surgApptDetailsSpan){
			if(!hoverTimer){
				hoverTimer = setTimeout(function(){AmbulatoryWorklist.addSurgApptDetailsHover(surgApptDetailsSpan);}, 100);
			} 
		},
		
		/**
			addSurgApptDetailsHover: This function will use the UtilPopup.attachHover() to populate the surgery appointment details into the popup hover window. 
			The first section of the hover will display the primary procedure (modifer if existed) and Anesthesia Type (if existed), Anesthesiologist (if existed) and Surgeon name.
			If a surgery appointment has more than 1 procedures, then it will display a line separator after the primary section, 
			then the secondary procedure name (modifier if existed),then surgeon name and so on.
			@param: surgApptDetailsSpan: the surgery appointment details container.
		*/
		addSurgApptDetailsHover: function(surgApptDetailsSpan){
			var labelArr = [];
			var detailsArr = [];
			var isoDate = new Date();
			var tabName = AmbulatoryWorklist.getCurrTab();
			var rowData;
			var jsonData;
			
			if(tabName == myday_tab){
				jsonData = AmbulatoryWorklist.getData().MY_DAY;
				rowData = MyDay.getApptFromJsonData(jsonData,AmbulatoryWorklist.getOrgApptIdFromParentRow(surgApptDetailsSpan),AmbulatoryWorklist.getOrgApptTypeFromParentRow(surgApptDetailsSpan));
			}
			else if (tabName == openitems_tab)  {
				jsonData = AmbulatoryWorklist.getData().OPEN_ITEMS;
				rowData = OpenItems.getApptFromJsonData(jsonData,AmbulatoryWorklist.getOrgApptIdFromParentRow(surgApptDetailsSpan),AmbulatoryWorklist.getOrgApptTypeFromParentRow(surgApptDetailsSpan));
} else {
				jsonData = AmbulatoryWorklist.getData().UPCOMING;
				rowData = UpcomingItems.getApptFromJsonData(jsonData, AmbulatoryWorklist.getOrgApptIdFromParentRow(surgApptDetailsSpan), AmbulatoryWorklist.getOrgApptTypeFromParentRow(surgApptDetailsSpan));
		}
			var surgDetailsCnt = rowData.SURGCASE[0].SURGCASE_DETAILS_CNT;
			var sHover = [];
			
			sHover.push("<div class ='surg-hvr-container'>");
			for (var cnt = 0; cnt < surgDetailsCnt; cnt++)
			{
				var displayProcedureLabel = i18n.PROCEDURE;
				var displayModifier = "";
				if (rowData.SURGCASE[0].SURGCASE_DETAILS[cnt].SCHED_MODIFIER)
				{
					displayModifier = " (" + rowData.SURGCASE[0].SURGCASE_DETAILS[cnt].SCHED_MODIFIER + ")";
				}
				
				var displayAnesthTypeLabel = "";
				var displayAnesthType = "";
				if (rowData.SURGCASE[0].ANESTH_TYPE)
				{
					displayAnesthTypeLabel = "<dt class='surg-hvr-details'><span class ='surg-hvr-label'>"+ i18n.ANESTHESIA_TYPE + ":</span></dt>";
					displayAnesthType = "<dd class='surg-hvr-details'><span>"+rowData.SURGCASE[0].ANESTH_TYPE +"</span></dd>";
				}
				 
				var displayAnesthLabel = "";
				var displayAnesthName = "";
				if (rowData.SURGCASE[0].ANESTH_NAME)
				{
					displayAnesthLabel = "<dt class='surg-hvr-details'><span class ='surg-hvr-label'>"+ i18n.ANESTHESIOLOGIST + ":</span></dt>";
					displayAnesthName = "<dd class='surg-hvr-details'><span>"+rowData.SURGCASE[0].ANESTH_NAME +"</span></dt>";
				}
				
				if (surgDetailsCnt == 1)
				{
					displayProcedureLabel = i18n.PROCEDURE;
				}
				else
				{
					displayProcedureLabel = i18n.PROCEDURE + " " +(cnt +1);
				}
				
				if (cnt === 0) //first section is the Primary procedure section.
				{
					sHover.push("<div class ='surg-hvr-main-section'><dl class = 'surg-hvr-list'>");
					//display procedure and modifier
					sHover.push("<dt class = 'surg-hvr-details'><span class='surg-hvr-proc'>",displayProcedureLabel,":</span></dt>");	
					sHover.push("<dd class = 'surg-hvr-details'><span class='surg-hvr-proc'>",rowData.SURGCASE[0].SURGCASE_DETAILS[cnt].SURG_PROC_DISP, displayModifier,"</span></dd>");							
					//display Anesthesia type (if existed)
					sHover.push(displayAnesthTypeLabel,displayAnesthType);	 
					//display Anesthesiologist (if existed)
					sHover.push(displayAnesthLabel,displayAnesthName);	
					//display surgeon
					sHover.push("<dt class = 'surg-hvr-surgeon'><span class ='surg-hvr-label'>",i18n.SURGEON,":</span></dt>");	
					sHover.push("<dd class = 'surg-hvr-surgeon'>",rowData.SURGCASE[0].SURGCASE_DETAILS[cnt].SURGEON_NAME,"</dd></dl></div>");														 
				}
				else // if more than 1 procedure, display procedure name(modifier) and surgeon for each secondary procedure.
				{
					//display procedure section separator
					sHover.push("<span class='surg-hvr-section-separator'></span>");
					//begin to display the secondary section
					sHover.push("<div class ='surg-hvr-section'><dl class = 'surg-hvr-list'>");
					//display procedure and modifier if existed
					sHover.push("<dt class = 'surg-hvr-details'><span class='surg-hvr-proc'>",displayProcedureLabel,":</span></dt>");	
					sHover.push("<dd class = 'surg-hvr-details'><span class='surg-hvr-proc'>",rowData.SURGCASE[0].SURGCASE_DETAILS[cnt].SURG_PROC_DISP, displayModifier,"</span></dd>");							
					//display surgeon
					sHover.push("<dt class = 'surg-hvr-surgeon'><span class ='surg-hvr-label'>",i18n.SURGEON,":</span></dt>");	
					sHover.push("<dd class = 'surg-hvr-surgeon'>",rowData.SURGCASE[0].SURGCASE_DETAILS[cnt].SURGEON_NAME,"</dd></dl></div>");		
				}	
			}
			sHover.push("</div>"); 
			var contentStr = sHover.join("");
			surgApptDetailsSpan.onmouseover = null;
			surgApptDetailsSpan.onmouseout = null;
			UtilPopup.attachHover({
				"elementDOM": surgApptDetailsSpan,
				"event": "mousemove",
				"content": contentStr,
				"displayTimeOut": 300 
			});
		},
		
		getMpageLocale : function(language, country){
			var MPAGE_LOCALE;
			switch(language){
			/* EN is for Engish (Country-Specific) */
			case "EN": 		
				switch(country){
				/* US is for United States */
				case "US":
					MPAGE_LOCALE = new mp_formatter.Locale(MPAGE_LC.en_US);
					break;
					/* AU is for Australia */
				case "AU":
					MPAGE_LOCALE = new mp_formatter.Locale(MPAGE_LC.en_AU);
					break;
					/* GB is for Great Britain */
				case "GB":
					MPAGE_LOCALE = new mp_formatter.Locale(MPAGE_LC.en_GB);
					break;
					/* Default to en_US*/
				default:
					MPAGE_LOCALE = new mp_formatter.Locale(MPAGE_LC.en_US);
				}							
				break;
				/* DE is for German (Country-Specific) */				
			case "DE": 		
				MPAGE_LOCALE = new mp_formatter.Locale(MPAGE_LC.de_DE);			
				break;
				/* FR is for French  */
			case "FR":
				MPAGE_LOCALE = new mp_formatter.Locale(MPAGE_LC.fr_FR);
				break;
				/* SP and ES both refer to Spanish (Country-Specific) */
			case "SP":
			case "ES": 		
				MPAGE_LOCALE = new mp_formatter.Locale(MPAGE_LC.es_ES);
				break;
				/* Default to en_US*/
			default:
				MPAGE_LOCALE = new mp_formatter.Locale(MPAGE_LC.en_US);
			}
			return MPAGE_LOCALE;
		},
		addScrollToResourceDropDown : function(){
			// enable scrolling when resource list dropdown has multiple resources
				var myDaywindowHeight = $(window).height(); 
		    	var resourceDivHeight = $('#resources-id ul.resource-ul').height();
		    	if(!($('#resources-id ul.resource-ul').hasClass("cssDone")))
				{
					var resourceDropDownWidth = $('#resources-id ul.resource-ul').width();
					$('#resources-id ul.resource-ul').css({"width":(resourceDropDownWidth +16) + "px"});
					$('#resources-id ul.resource-ul').addClass("cssDone");
				}
		    	if(resourceDivHeight >= (myDaywindowHeight*.5))  {
		      		$('#resources-id ul.resource-ul').css({'height':(myDaywindowHeight*.5)+'px','overflow-y':'auto','overflow-x':'hidden'});
		    	}
			},
		/*
		 * Take a OTHER_SOURCES_TYPES json structure (comes from worklist's listreply),
		 * convert to the more efficient resource_favorites structure.
		 */
		cnvtOtherSourcesToResFavs : function(otherSources) {
			var resourceFavs = {
				"RESOURCES" : [],
				"SELECTED_LISTS" : [
					{
						"MEANING": "MY_DAY_RESOURCES",
						"SELECTED_RESOURCES": []
					},
					{
						"MEANING": "CALENDAR_RESOURCES",
						"SELECTED_RESOURCES": []
					},
					{
						"MEANING": "OPEN_ITEMS_RESOURCES",
						"SELECTED_RESOURCES": []
					},
					{
						"MEANING": "UPCOMING_RESOURCES",
						"SELECTED_RESOURCES": []
					}
				]
			};
			//loop through 1 list's resources (they should all be the same), add to resources array
			for (var x = 0; x < otherSources[0].SOURCES.length; x++) {
				resourceFavs.RESOURCES.push({
					"PRSNL_ID": otherSources[0].SOURCES[x].SOURCE_ID,
					"RESOURCE_CD": otherSources[0].SOURCES[x].SOURCE_CD,
					"RESOURCE_DISPLAY": otherSources[0].SOURCES[x].SOURCE_DISPLAY
				});
				for (var y = 0; y < 4; y++){
					//if selected, add to tab's selected list
					if (otherSources[y].SOURCES[x].SELECTED_IND == 1) {
						resourceFavs.SELECTED_LISTS[y].SELECTED_RESOURCES.push({
							"RESOURCE_CD": otherSources[y].SOURCES[x].SOURCE_CD
						});
					}
				}
			}
			return resourceFavs;			
		}
	};
}();
MpageDriver.addObserver("list-selected",function(){AmbulatoryWorklist.clearData();});

//SLATimer - test create timer call/locate in common JS file
function createSLATimer(timerName,metaData1,metaData2,metaData3){
	var mpageName = "Ambulatory Schedule";  //constant for Summary name for subtimer name
	var slaTimer;
	try{
		slaTimer = window.external.DiscernObjectFactory("SLATIMER");
	}catch(err){
		return null;
	}
	if(slaTimer){
		slaTimer.TimerName = timerName;
		slaTimer.SubtimerName = mpageName;
		if(metaData1)
		{slaTimer.Metadata1 = String(metaData1);}
		if(metaData2)
		{slaTimer.Metadata2 = String(metaData2);}
		if(metaData3)
		{slaTimer.Metadata3 = String(metaData3);}		
		slaTimer.Start();
		return slaTimer;
	}else{
		alert(i18n.SLATIMER_OBJ_CREATION_FAILED);
		return null;
	}
}
function CreateClinNoteLink (patient_id, encntr_id, event_id, display, docViewerType, pevent_id){
	var docType = (docViewerType && docViewerType > "") ? docViewerType : 'STANDARD';
	var doclink = "";
	if (event_id > 0) {
		var ar = [];
		ar.push(patient_id, encntr_id, event_id,"\""+docType+"\"", pevent_id);
		doclink = "<a onclick='javascript:LaunchClinNoteViewer(" + ar.join(",") + "); return false;' href='#'>" + display + "</a>";	
	}
	else {
		doclink = display;
	}
	return (doclink);
}
function LaunchClinNoteViewer (patient_id, encntr_id, event_id, docViewerType, pevent_id){
	var x = 0;
	var m_dPersonId = parseFloat(patient_id);
	var m_dEncntrId = parseFloat(encntr_id);
	var m_dPeventId = parseFloat(pevent_id);
	var viewerObj = window.external.DiscernObjectFactory("PVVIEWERMPAGE");
	try {
		if(docViewerType=='DOC'){
			viewerObj.CreateDocViewer(m_dPersonId);
			viewerObj.AppendDocEvent(event_id);
			viewerObj.LaunchDocViewer();
		}
	} 
	catch (err) {
		alert(i18n.ERROR_LAUNCH_DOC_VIEWER);
	}
}
function fixMinWidthForIE(elem){
	try{
		if(!document.body.currentStyle){
			return;
		} //IE only
	}
	catch(e){
		return;
	}
	var eCurStyle = elem.currentStyle;
	var l_minWidth = (eCurStyle.minWidth) ? eCurStyle.minWidth : eCurStyle.getAttribute("min-width"); //IE7 : IE6
	if(l_minWidth && l_minWidth != 'auto'){
		var shim = document.createElement("DIV");
		shim.style.cssText = 'margin:0 !important; padding:0 !important; border:0 !important; line-height:0 !important; height:0 !important; BACKGROUND:RED;';
		shim.style.width = l_minWidth;
		shim.appendChild(document.createElement("&nbsp;"));
		if(elem.canHaveChildren){
			elem.appendChild(shim);
		}
	}
}

//For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};

//For i18n formatting...
Date.prototype.setISO8601 = function (string) {
	var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
	"(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
	"(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
	var d = string.match(new RegExp(regexp));

	var offset = 0;
	var date = new Date(d[1], 0, 1);

	if (d[3]) { date.setMonth(d[3] - 1); }
	if (d[5]) { date.setDate(d[5]); }
	if (d[7]) { date.setHours(d[7]); }
	if (d[8]) { date.setMinutes(d[8]); }
	if (d[10]) { date.setSeconds(d[10]); }
	if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
	if (d[14]) {
		offset = (Number(d[16]) * 60) + Number(d[17]);
		offset *= ((d[15] == '-') ? 1 : -1);
	}

	offset -= date.getTimezoneOffset();
	time = (Number(date) + (offset * 60 * 1000));
	this.setTime(Number(time));
};

WorklistSelection.buildOtherSourceSelections = function(otherSourcesList){
	var currTab = AmbulatoryWorklist.getCurrTab();
	var criterion = MpageDriver.getCriterion();
	var index ;
	var favoritesJson;
	var checkgblStoredCount =3;
	var checkcnt = 0;
	switch(currTab){
	case myday_tab:
		index = myday_ndx;
		break;
	case calendar_tab:
		index = calendar_ndx;
		break;
	case openitems_tab:
		index = openitems_ndx;
		break;
	case upcoming_tab:
		index = upcoming_ndx;
		break;
	}

	//otherSourcesList came from mp_get_amb_wl_resrc_favs
	if(otherSourcesList != null){

	//Initialize the session storage resource list
	    var otherSourcesDataString = AmbulatoryWorklist.cnvtJsonToString(otherSourcesList);
	    WorklistStorage.set("StoredOtherSourcesList",otherSourcesDataString,false);
	    WorklistStorage.set("StoredOtherSourceTypeIndex", 0, false);
	    WorklistStorage.set("StoredOtherSourceIndex", 0, false);
		favoritesJson = otherSourcesList;
	}
	//came from action within the Ambulatory Organizer, pull resources from session storage resource list
	else{
	    favoritesJson = AjaxHandler.parse_json(unescapeJSON(WorklistStorage.get("StoredOtherSourcesList",false)));
	}

	var strSourceHTML = "";
	var strSourceHTMLArr = [];
	var strListHTMLArr = [];
	var arrLength = favoritesJson[index].SOURCES.length;

	//Loop through the record structure to generate the selected resources display string.
	strListHTMLArr.push("<NOBR>", "<span id = 'WLTable-id' class='WLTable other-source-selections' >", "<div class='resources-wrapper'>", "<div class='resource-div'>", i18n.PATIENTS_FOR, ":  </div>", "<ul class='resources' id='resources-id'><li class='curr-li'>", "<div id='curr-resource-div-id' class='curr-resource-div'>");
	var currDisplay = "";
	var selectedHTML="";
	for(var j=0;j<arrLength;j++) {
		if(favoritesJson[index].SOURCES[j] && parseInt(favoritesJson[index].SOURCES[j].SELECTED_IND,10) === 1) {
			if(currDisplay!=""){currDisplay += "; ";}
			currDisplay += favoritesJson[index].SOURCES[j].SOURCE_DISPLAY;
			if(selectedHTML!=""){selectedHTML+="|";}
			selectedHTML+=favoritesJson[index].SOURCES[j].SOURCE_CD + "," + favoritesJson[index].SOURCES[j].SOURCE_ID;
			checkcnt = checkcnt+1;
		}
	}
	if(currDisplay==""){currDisplay= i18n.NO_RESOURCE_SELECTED;}
	strListHTMLArr.push("<div id='displayTrimList' class='resource-disply-trim'><div id='curr-resource-display-id' class='curr-resource-display'>", currDisplay, "<img align='middle' src='../img/5322_down.png'><span class='selected-resources hidden'>", selectedHTML, "</span></div></div><div id='display-trim-list-image-id' class='display-trim-list-image hidden'><img align='middle' src='../img/5322_down.png'></div></div>", "<ul class='resource-ul'>");
	var selected = 0;
	//Generate html for resource drop down list
	for(var k=0;k<arrLength;k++) {
		selected = parseInt(favoritesJson[index].SOURCES[k].SELECTED_IND,10);
		strSourceHTMLArr.push('<li class="resource-li"><input class="resource-check" type="checkbox" name="resource"');

		//Verify if the stored value is not undefined.
		if(selected === 1 || selected === 3 ) {
			strSourceHTMLArr.push(' checked="true"');

		}
		strSourceHTMLArr.push('/>', '<span class="resource-display">', favoritesJson[index].SOURCES[k].SOURCE_DISPLAY, '</span>', '<span class="person-id hidden">',
				favoritesJson[index].SOURCES[k].SOURCE_ID,'</span>', '<span class="resource-cd hidden">', favoritesJson[index].SOURCES[k].SOURCE_CD, '</span>');
		if(parseInt(criterion.personnel_id,10) != parseInt(favoritesJson[index].SOURCES[k].SOURCE_CD,10))
		{
			strSourceHTMLArr.push('<div class="delete-res"></div>');
		}
		
		strSourceHTMLArr.push('</li>');
	}
	strSourceHTML = strSourceHTMLArr.join('');
	strListHTMLArr.push(strSourceHTML, '<li class="resource-li add-other-li">',i18n.ADD_OTHER,'</li>');
	if(currTab!=myday_tab){
		strListHTMLArr.push("<li class='resource-li add-message-li message-active' >", i18n.SELECTION_LIMIT_ALERT, " 1</li>");
	}
	strListHTMLArr.push("<li class='resource-li button'><button type='button' class='drop-down-apply'>", i18n.APPLY, 
			"</button><button type='button' class='drop-down-cancel'>", i18n.CANCEL, "</button>",
			"</ul>", "</li>", "</ul>", "</div>", "</span>", "</NOBR>");

	return (strListHTMLArr.join(""));
};
//Delegate event controller for elements in the html
$(document).ready(function(){   
	$("body")

	//delegate event for onclick to delete a resource
	.delegate(".delete-res","click", function(){AmbulatoryWorklist.resourceDelete(this);
	$('#resources-id ul.resource-ul').css({'height':'auto'});
	})

	//delegate event for onclick to select a resource when mouse clicked on the resource name
	.delegate(".resource-display","click", function(){AmbulatoryWorklist.resourceClick(this.parentNode);})

	//delegate event for onclick to select a resource when mouse clicked on the check box
	.delegate(".resource-check","click", function(){AmbulatoryWorklist.resourceCheckboxClick(this.parentNode);})

	//delegate event for onclick to call resource apply when apply button clicked
	.delegate(".drop-down-apply","click", function(){AmbulatoryWorklist.resourceApply();})

	//delegate event for onclick to call resource cancel when cancel button clicked
	.delegate(".drop-down-cancel","click", function(){AmbulatoryWorklist.resourceCancel();})

	//delegate event for onclick to call comments div to expand when notes icon clicked
	.delegate(".row-exp-col","click", function(e){
		if(!Util.Style.ccss(this.parentNode,"expand")){
			$(document).click();
		}
		if(!MyDay.getCommentsLoadedFlag()){
			MyDay.initComments();
			MyDay.setCommentsLoadedFlag(true);
		}
		
		AmbulatoryWorklist.menu(this);
		e.stopImmediatePropagation();
		})  

	//delegate event for onclick to call Add other resources window
	.delegate(".resource-li.add-other-li","click", function(){ConfirmWindow(''+ i18n.SEARCH_FOR + ':','' + i18n.RESOURCES_SEARCH + '', ' ' + i18n.OK + '', ' ' + i18n.CANCEL + '', 'true');})

	//delegate event for onclick to expand the resource drop down when the ellipsis mode image is displayed
	.delegate("#display-trim-list-image-id", "click", function (e) {
		if (!Util.Style.ccss(this.parentNode.parentNode, "expand")) {
			$(document).click();
		}
		AmbulatoryWorklist.expandCurrentResourcesMenu(this.parentNode);
		e.stopImmediatePropagation();
	})
     
	 //delegate event for onclick to expand the resource drop down when clicking on selected resources
	.delegate("#curr-resource-display-id", "click", function (e) {
		if (!Util.Style.ccss(this.parentNode.parentNode.parentNode, "expand")) {
			$(document).click();
		}
		AmbulatoryWorklist.expandCurrentResourcesMenu(this.parentNode.parentNode);
		e.stopImmediatePropagation();
	})
	
	.delegate("#userPrefMenu","click", function(e){
		if(Util.Style.ccss(_g("opt"), "menu-hide")) {
			$("#opt").removeClass("menu-hide");
			$("#opt").addClass("menu-open");
			var currTab = AmbulatoryWorklist.getCurrTab();
			var prefIndArray = [];
			
			if (currTab == openitems_tab) {
			// Depending upon if appt. are present and status of the undo indicator the pref array is populated.
		    if(openItemsApptFlag==1 && undo_data.UNDO_IND==1 ){
				    prefIndArray.push(gblproviderNoteInd,gblvisitChargeInd,gbltaskListInd,gblvisitSummaryInd,gblhpInd, gblconsentInd, gblpreopInd, undo_data.UNDO_IND);
			}else if(openItemsApptFlag==1 && undo_data.UNDO_IND==0 ){		
				    prefIndArray.push(gblproviderNoteInd,gblvisitChargeInd,gbltaskListInd,gblvisitSummaryInd,gblhpInd, gblconsentInd, gblpreopInd, 0);
			}else if(openItemsApptFlag==0 && undo_data.UNDO_IND==1 ){
					prefIndArray.push(0, 0, 0, 0, 0, 0, 0, undo_data.UNDO_IND);
			}else{
					prefIndArray.push(0, 0, 0, 0, 0, 0, 0, 0);	
			}
		
		} else if (currTab == upcoming_tab) {
			// Depending upon if appt. are present and status of the undo indicator the pref array is populated.
		    if(upcomingItemsApptFlag==1 && undo_data.UNDO_IND==1 ){
				    prefIndArray.push(0,0,0,0,gblhpInd, gblconsentInd, gblpreopInd, undo_data.UNDO_IND);
			}else if(upcomingItemsApptFlag==1 && undo_data.UNDO_IND==0 ){		
				    prefIndArray.push(0,0,0,0,gblhpInd, gblconsentInd, gblpreopInd, 0);
			}else if(upcomingItemsApptFlag==0 && undo_data.UNDO_IND==1 ){
					prefIndArray.push(0, 0, 0, 0, 0, 0, 0, undo_data.UNDO_IND);
			}else{
					prefIndArray.push(0, 0, 0, 0, 0, 0, 0, 0);	
			}
			
		}
			else{
				prefIndArray.push(gblproviderNoteInd,gblvisitChargeInd,gbltaskListInd,gblvisitSummaryInd,gblhpInd,gblconsentInd,gblpreopInd,0);
			}
			AmbulatoryWorklist.setUserPrefMenu(prefIndArray);
			AmbulatoryWorklist.setMenuEvent();	
		}
		else {
			$("#opt").addClass("menu-hide");
			$("#opt").removeClass("menu-open");
		}
		e.stopImmediatePropagation();
		// To hide the dropdown menu
		$(document).click(function(e){
			var dropDown = _g("opt");
			if(Util.Style.ccss(_g("opt"), "menu-open")){
				Util.Style.acss(dropDown, "menu-hide");
				Util.Style.rcss(_g("opt"), "menu-open");
			}
		}); 
	})

	.delegate("#opt1, #opt2, #opt3, #opt4, #opt5, #opt6, #opt7", "click", function (e) {
		e.stopImmediatePropagation();
		var optsCheck = $(this).children("input");
		optsCheck.prop('checked', !optsCheck.prop('checked')); //flip the checkbox on clicking the text item next to it
	})
	
	.delegate("#opt1tick, #opt2tick, #opt3tick, #opt4tick, #opt5tick, #opt6tick, #opt7tick", "click", function (e) {
		e.stopImmediatePropagation();
	})
	
	.delegate("#opt8", "click", function () {
		AmbulatoryWorklist.undoClickRequest();
	})
	
	//delegate event for onclick to save prefs and call visible modify when apply button clicked
	.delegate(".opts-drop-down-apply", "click", function () {
		var userPrefMenu = AmbulatoryWorklist.getUserPrefList();

		var prefs = [];
		var openItemTags = [];
		var openItemTagCnt =0;
		var optCheck ="";
		
		/*Get the 'checked' status of each check box and determine if its different from the stored values.
		 * If its different, add it to the list of open item tags and update the pref list
		 */
		
		optCheck = ($('#opt1tick').prop('checked') == true) ? "Y" : "N";
		if (userPrefMenu.NOTES_IND != optCheck) {
			openItemTags[openItemTagCnt] = "noteTag";
			prefs[openItemTagCnt] = optCheck;
			openItemTagCnt++;
			userPrefMenu.NOTES_IND = optCheck;
		}
		optCheck = ($('#opt2tick').prop('checked') == true) ? "Y" : "N";
		if (userPrefMenu.ORDERS_IND != optCheck) {
			openItemTags[openItemTagCnt] = "orderTag";
			prefs[openItemTagCnt] = optCheck;
			openItemTagCnt++;
			userPrefMenu.ORDERS_IND = optCheck;
		}
		optCheck = ($('#opt3tick').prop('checked') == true) ? "Y" : "N";
		if (userPrefMenu.TASK_IND != optCheck) {
			openItemTags[openItemTagCnt] = "taskTag";
			prefs[openItemTagCnt] = optCheck;
			openItemTagCnt++;
			userPrefMenu.TASK_IND = optCheck;
		}
		optCheck = ($('#opt4tick').prop('checked') == true) ? "Y" : "N";
		if (userPrefMenu.SUMMARY_IND != optCheck) {
			openItemTags[openItemTagCnt] = "visitSummTag";
			prefs[openItemTagCnt] = optCheck;
			openItemTagCnt++;
			userPrefMenu.SUMMARY_IND = optCheck;
		}
		optCheck = ($('#opt5tick').prop('checked') == true) ? "Y" : "N";
		if (userPrefMenu.HP_IND != optCheck) {
			openItemTags[openItemTagCnt] = "hp-tag";
			prefs[openItemTagCnt] = optCheck;
			openItemTagCnt++;
			userPrefMenu.HP_IND = optCheck;
		}
		optCheck = ($('#opt6tick').prop('checked') == true) ? "Y" : "N";
		if (userPrefMenu.CONSENT_IND != optCheck) {
			openItemTags[openItemTagCnt] = "consent-tag";
			prefs[openItemTagCnt] = optCheck;
			openItemTagCnt++;
			userPrefMenu.CONSENT_IND = optCheck;
		}
		optCheck = ($('#opt7tick').prop('checked') == true) ? "Y" : "N";
		if (userPrefMenu.PREOP_IND != optCheck) {
			openItemTags[openItemTagCnt] = "preop-tag";
			prefs[openItemTagCnt] = optCheck;
			openItemTagCnt++;
			userPrefMenu.PREOP_IND = optCheck;
		}
		
		AmbulatoryWorklist.setUserPrefList(userPrefMenu);
		
		var tabs;
		var patientRows;
		var arrLength;
		var jsonData;
		if (_g("TBODY_MY_DAY")) {
			patientRows = _gbt("tr", _g("TBODY_MY_DAY"));
			arrLength = patientRows.length;
			jsonData = AmbulatoryWorklist.getData().MY_DAY;
			for (var i = 0; i < arrLength; i++) {
				if (!Util.Style.ccss(patientRows[i], "break-row")) {
					MyDay.modifyVisibilityMyDay(openItemTags,prefs,patientRows[i]);
					MyDay.checkHover(patientRows[i], jsonData);
					MyDay.updateOpenItemCnt(patientRows[i], jsonData);
				}
			}
		} 
		if(_g("TBODY_OPEN_ITEMS")){
			patientRows = _gbt("tr", _g("TBODY_OPEN_ITEMS"));
			tabs = AmbulatoryWorklist.getTabsElement();
			jsonData = AmbulatoryWorklist.getData().OPEN_ITEMS;
			arrLength = patientRows.length;
			for (var i = 0; i < arrLength; i++) {
				if (!Util.Style.ccss(patientRows[i], "break-row")) {
					OpenItems.modifyVisibilityOpenItems(openItemTags,prefs,patientRows[i],jsonData);
					OpenItems.updateSectionTotals(tabs);
				}else{
					Util.de(patientRows[i]);
					arrLength = arrLength - 1;
					i--;
				}
			}
		}
		if (_g("TBODY_UPCOMING")) {

			patientRows = _gbt("tr", _g("TBODY_UPCOMING"));
			tabs = AmbulatoryWorklist.getTabsElement();
			jsonData = AmbulatoryWorklist.getData().UPCOMING;
			arrLength = patientRows.length;
			for (var i = 0; i < arrLength; i++) {
				if (!Util.Style.ccss(patientRows[i], "break-row")) {
					UpcomingItems.modifyVisibilityUpcomingItems(openItemTags, prefs, patientRows[i], jsonData);

				} else {
					Util.de(patientRows[i]);
					arrLength = arrLength - 1;
					i--;
				}
			}

		}
		var currTab = AmbulatoryWorklist.getCurrTab();
		if (currTab != openitems_tab) {
			AmbulatoryWorklist.getOpenItemsCnt();
		}
		if (_g("TBODY_OPEN_ITEMS")) {
			OpenItems.insertRowBreak();
		}
		if (_g("TBODY_UPCOMING")) {
			UpcomingItems.insertRowBreak();
		}
	})

	//delegate event for onclick to check/uncheck notes or orders completed checkbox
	.delegate(".openitem-checkbox", "click", function () {
		var tabName = AmbulatoryWorklist.getCurrTab();
		var rowData;
		var rowId;
		var jsonData;
		var tab;
		var tag;
		var checkedInd = this.checked;
		if (tabName == myday_tab) {
			jsonData = AmbulatoryWorklist.getData().MY_DAY;
			rowData = MyDay.getApptFromJsonData(jsonData, AmbulatoryWorklist.getOrgApptIdFromParentRow(this), AmbulatoryWorklist.getOrgApptTypeFromParentRow(this));
			curTabObj = OpenItems;
		} else if(tabName == openitems_tab){
			jsonData = AmbulatoryWorklist.getData().OPEN_ITEMS;
			rowData = OpenItems.getApptFromJsonData(jsonData, AmbulatoryWorklist.getOrgApptIdFromParentRow(this), AmbulatoryWorklist.getOrgApptTypeFromParentRow(this));
			curTabObj = MyDay;
		} else if(tabName == upcoming_tab){
			jsonData = AmbulatoryWorklist.getData().UPCOMING;
			rowData = UpcomingItems.getApptFromJsonData(jsonData, AmbulatoryWorklist.getOrgApptIdFromParentRow(this), AmbulatoryWorklist.getOrgApptTypeFromParentRow(this));
			curTabObj = UpcomingItems;
		}else{}
		
		if(curTabObj != UpcomingItems){
		var orderLinkString = curTabObj.getOrderLink();
		var docLinkString = curTabObj.getDocLink();
		var taskLinkString = curTabObj.getTaskLink();
		}
		var hpLinkString = curTabObj.getHPLink();
		var value = this.name;
	
		rowId = "_"+rowData.ORG_APPT_ID+"_"+rowData.ORG_APPT_TYPE+"_"+rowData.PRIMARY_TAB
		var patientRow = _g(rowId);
		if( rowData.ORG_APPT_TYPE == APPT_TYPE_SURG && value == "hp"){
			var hpTag = Util.Style.g("hp-tag", patientRow, "span")[0];
			var hpTagArr = [];
			if (checkedInd == true) {
				hpTagArr.push("<span class='completed-item' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
				hpTagArr.push("><img class='open-item-icon' src='../img/note_dithered.png' ><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='hp' value='1'>   ");
				hpTagArr.push(i18n.HP_COMPLETED, "</span><br/>");
			} else {
				hpTagArr.push("<a class='item-link' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);' href='javascript:APPLINK(0,\"powerchart.exe\",\"/PERSONID=", rowData.PERSON_ID, " /ENCNTRID=", rowData.ENCNTR_ID, " /FIRSTTAB=^",hpLinkString,"^\");'");
				hpTagArr.push("><img class='open-item-icon' src='../img/note.png' >  ");
				hpTagArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='hp' value='1'>");
				hpTagArr.push(i18n.HP_NOT_STARTED, "</a><br/>");
			}
			hpTag.innerHTML  = hpTagArr.join("");
			
		}else if(value == "order"){
			
			var orderTag = Util.Style.g("orderTag", patientRow, "span")[0];
			var orderTagArr = [];
			if (checkedInd == true) {
				orderTagArr.push("<span class='completed-item' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
				orderTagArr.push("><img class='open-item-icon' src='../img/order_dithered.png' ><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='order' value='1'>   ");
				orderTagArr.push(i18n.ORDER_COMPLETED, "</span><br/>");
			} else {
				orderTagArr.push("<a class='item-link' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);' href='javascript:APPLINK(0,\"powerchart.exe\",\"/PERSONID=", rowData.PERSON_ID, " /ENCNTRID=", rowData.ENCNTR_ID, " /FIRSTTAB=^",orderLinkString,"^\");'");
				orderTagArr.push("><img class='open-item-icon' src='../img/order.png' >  ");
				orderTagArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='order' value='1'>");
				orderTagArr.push(i18n.ORDER_NOT_STARTED, "</a><br/>");
			}
			orderTag.innerHTML  = orderTagArr.join("");
		}else if(value =="note"){
			var noteTag = Util.Style.g("noteTag", patientRow, "span")[0];
			var noteTagArr = [];
			if (checkedInd == true) {
				noteTagArr.push("<span class='completed-item' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
				noteTagArr.push("><img class='open-item-icon' src='../img/note_dithered.png' ><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='note' value='1'>   ");
				noteTagArr.push(i18n.NOTE_COMPLETED, "</span><br/>");
			} else {
				noteTagArr.push("<a class='item-link' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);' href='javascript:APPLINK(0,\"powerchart.exe\",\"/PERSONID=", rowData.PERSON_ID, " /ENCNTRID=", rowData.ENCNTR_ID, " /FIRSTTAB=^",docLinkString,"^\");'");
				noteTagArr.push("><img class='open-item-icon' src='../img/note.png' >  ");
				noteTagArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='note' value='1'>");
				noteTagArr.push(i18n.NOTE_NOT_STARTED, "</a><br/>");
			}
			noteTag.innerHTML  = noteTagArr.join("");
		}else if(value =="task"){
			var taskTag = Util.Style.g("taskTag", patientRow, "span")[0];
			var taskTagArr = [];
			if (checkedInd == true) {
				taskTagArr.push("<span class='completed-item' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
				taskTagArr.push("><img class='open-item-icon' src='../img/note_dithered.png' ><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='task' value='1'>   ");
				taskTagArr.push(i18n.TASK_LIST_COMPLETE, "</span><br/>");
			} else {
				taskTagArr.push("<a class='item-link' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);' href='javascript:APPLINK(0,\"powerchart.exe\",\"/PERSONID=", rowData.PERSON_ID, " /ENCNTRID=", rowData.ENCNTR_ID, " /FIRSTTAB=^",taskLinkString,"^\");'");
				taskTagArr.push("><img class='open-item-icon' src='../img/note.png' >  ");
				taskTagArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='task' value='1'>");
				taskTagArr.push(i18n.TASK_LIST_NOT_COMPLETE, "</a><br/>");
			}
			taskTag.innerHTML  = taskTagArr.join("");
		}
		
		if (value == "note" || value == "order" || value == "task") {
			AmbulatoryWorklist.reminderCheckboxClick(this, rowData.SCH_EVENT_ID, rowData.RESOURCE_CD, tabName, value, "'SCH_EVENT'", 0,patientRow);
		} else if (value == "hp") {
			AmbulatoryWorklist.reminderCheckboxClick(this, rowData.ORG_APPT_ID, rowData.RESOURCE_CD, tabName, value, "'SURGICAL_CASE'", rowData.SURGCASE[0].SURG_CASE_ID,patientRow);
		} else if (value == "consent" || value == "preop") {
			AmbulatoryWorklist.reminderCheckboxClick(this, rowData.ORG_APPT_ID, rowData.RESOURCE_CD, tabName, value, "'SURG_CASE_PROCEDURE'", 0,patientRow);
		}
	})

	//delegate event for onclick to select an option from seen by drop down or location drop down
	.delegate(".loc-li","click", function(){
		var rowData;
		var jsonData;			
		jsonData = AmbulatoryWorklist.getData().MY_DAY;
		rowData = MyDay.getApptFromJsonData(jsonData,AmbulatoryWorklist.getOrgApptIdFromParentRow(this),AmbulatoryWorklist.getOrgApptTypeFromParentRow(this));

		if(this.firstChild.className == "main-detail")
		{
			var l = rowData.SCH_ACTION_CD_CNT;
			var value = this.firstChild.innerHTML;
			var index = -1;
			for(var i=0;i<l;i++){
				if(value==rowData.SCH_ACTION_CD_QUAL[i].SCH_ACTION_DISPLAY)
				{
					index = i;
					break;
				}
			}
			MyDay.statClick(this,rowData.SCH_ACTION_CD_QUAL[index].SCH_ACTION_CD,rowData.SCH_ACTION_CD_QUAL[index].SCH_ACTION_MEANING);
		}
		else
		{
			MyDay.locClick(this,rowData.ENCNTR_ID);
		}
	})

	//delegate event for onclick to expand seen by drop down or location drop down
	.delegate(".curr-div","click", function(e){
		var rowData;
		var jsonData;
		jsonData = AmbulatoryWorklist.getData().MY_DAY;
		rowData = MyDay.getApptFromJsonData(jsonData,AmbulatoryWorklist.getOrgApptIdFromParentRow(this),AmbulatoryWorklist.getOrgApptTypeFromParentRow(this));
		var apptCheckedIn = true;
		if (rowData.STATE_MEANING === CONFIRMED || rowData.STATE_MEANING === CHECKED_OUT || rowData.STATE_MEANING === CANCELED || rowData.STATE_MEANING === NO_SHOW || rowData.STATE_MEANING === HOLD) {
			apptCheckedIn = false;
		}
		if(apptCheckedIn){
			//This is to hide the hover containing the status history
			var popupHover = $('.hvr-details').parent()
			popupHover.hide();
		    	var status = $('.status-info',this).text();
			var replaceString = "<span class='status-info'>"+status+"</span>"
				// Here the status-info span is replaced with new span element as to detach the hover applied by utilpopup 
				$('.status-info',this).replaceWith(replaceString);
			if(!Util.Style.ccss(this.parentNode,"expand")){
				$(document).click();
			}
			AmbulatoryWorklist.menu(this);
			AmbulatoryWorklist.togglePadding(this);
			e.stopImmediatePropagation();
		}
	})
	/*delegate event for mouseenter to display the status history in hover details. Also it checks if the drop down
	  is not in expand mode	
	*/
	.delegate(".status-info", "mouseenter", function(){
		if(!Util.Style.ccss(this.parentNode.parentNode.parentNode, "expand")){
			AmbulatoryWorklist.addstatusInfoHover(this);
		}
	})
	
	.delegate(".status-info", "mouseleave", function(){
		AmbulatoryWorklist.clearHoverTimer();
	})
	
	.delegate("#prevBtnId", "click", function () {
		resourceApply = false;
		calendarFirstLoadIndication = true;
		timelineFirstLoadIndication = true;
		processAppointmentDate("currentAppointmentDateTime", -1);
	})

	.delegate("#todaybtn", "click", function () {
		resourceApply = false;
		calendarFirstLoadIndication = true;
		timelineFirstLoadIndication = true;
		var date = new Date();
		AmbulatoryWorklist.setDateTime("currentAppointmentDateTime", date);
		updateAppointmentData(date);
	})

	.delegate("#nextBtnId", "click", function () {
		resourceApply = false;
		calendarFirstLoadIndication = true;
		timelineFirstLoadIndication = true;
		processAppointmentDate("currentAppointmentDateTime", 1);
	});
	AmbulatoryWorklist.addScrollToResourceDropDown();
});

WorklistSelection.verifyOtherListSelection = function(typeIndex,sourceIndex) {
	try {
		var storedSources = AjaxHandler.parse_json(unescapeJSON(WorklistStorage.get("StoredOtherSourcesList",false)));

		if(typeof storedSources != "undefined"){				
			var currTab = AmbulatoryWorklist.getCurrTab();
			var index;
			var date = "\/Date(0000-00-00T00:00:00.000+00:00)\/";

			switch(currTab)
			{
			case myday_tab:
				index = myday_ndx;
				break;
			case calendar_tab:
				index = calendar_ndx;
				break;
			case openitems_tab:
				index = openitems_ndx;				
				break;
			case upcoming_tab:
				index = upcoming_ndx;				
				break;
			}
			
			var resourceDropDown = _g("resources-id");
			var resourceList = Util.Style.g('resource-li', resourceDropDown,'li');
			var listLength = resourceList.length;
			var selectedInd = 0;
			var dateObj = AmbulatoryWorklist.getDateTime("currentAppointmentDateTime");
			//update list selections into stored sources json
			for(var i=0;i<listLength;i++) {//last 2 li holds the buttons
				if (Util.Style.ccss(resourceList[i], "add-other-li") || !storedSources[index].SOURCES[i]) {
					break;
				}
				if(Util.gc(resourceList[i],0).checked){
					storedSources[index].SOURCES[i].SELECTED_IND =  1;
					if(index == myday_ndx){
						storedSources[index].SOURCES[i].SOURCE_DT_TM = "\/Date(" + dateObj.getYear() + "-" + scaleNumber(dateObj.getMonth() + 1) + "-" + scaleNumber(dateObj.getDate()) + "T00:00:00.000+00:00)\/";
					}
				} else {
					storedSources[index].SOURCES[i].SELECTED_IND = 0;
					storedSources[index].SOURCES[i].SOURCE_DT_TM = "\/Date(0000-00-00T00:00:00.000+00:00)\/";
				}
				if(index != myday_ndx){
					if(storedSources[myday_ndx].SOURCES[i].SELECTED_IND == 1){
						storedSources[myday_ndx].SOURCES[i].SOURCE_DT_TM = "\/Date(" + dateObj.getYear() + "-" + scaleNumber(dateObj.getMonth() + 1) + "-" + scaleNumber(dateObj.getDate()) + "T00:00:00.000+00:00)\/";
					}
				}
			}
			AmbulatoryWorklist.setResourceFavList(storedSources);
			WorklistSelection.verifySelections(1);
			AmbulatoryWorklist.resourceDropDownHoverController();
		}
	} catch (error) {
		showErrorMessage(error.message, "verifyOtherListSelection", "", "");
	}
};

/*This is used update all the preference list with any new resource being added from search option*/
WorklistSelection.updatePreferencesList = function(sourceId,sourceCd,sourceDisplay) {
	try {
		var storedSources = AjaxHandler.parse_json(unescapeJSON(WorklistStorage.get("StoredOtherSourcesList",false)));
		var selectedInd =0;
		// If the sources length is zero (It should be to all tabs,Hence used myday_ndx only) make the resource JSON object selected across all tabs(adding new resource).
		if(storedSources[myday_ndx].SOURCES.length ==0) {selectedInd=1;}
		if(typeof storedSources != "undefined")
		{
			storedSources[myday_ndx].SOURCES.push({"SOURCE_ID":sourceId,"SOURCE_CD":sourceCd,"SOURCE_DISPLAY":sourceDisplay,"SOURCE_DESCRIPTION":"","SOURCE_MEANING":"","SOURCE_DT_TM": "\/Date(0000-00-00T00:00:00.000+00:00)\/","SELECTED_IND":selectedInd});
			storedSources[calendar_ndx].SOURCES.push({"SOURCE_ID":sourceId,"SOURCE_CD":sourceCd,"SOURCE_DISPLAY":sourceDisplay,"SOURCE_DESCRIPTION":"","SOURCE_MEANING":"","SOURCE_DT_TM": "\/Date(0000-00-00T00:00:00.000+00:00)\/","SELECTED_IND":selectedInd});
			storedSources[openitems_ndx].SOURCES.push({"SOURCE_ID":sourceId,"SOURCE_CD":sourceCd,"SOURCE_DISPLAY":sourceDisplay,"SOURCE_DESCRIPTION":"","SOURCE_MEANING":"","SOURCE_DT_TM": "\/Date(0000-00-00T00:00:00.000+00:00)\/","SELECTED_IND":selectedInd});
			storedSources[upcoming_ndx].SOURCES.push({"SOURCE_ID":sourceId,"SOURCE_CD":sourceCd,"SOURCE_DISPLAY":sourceDisplay,"SOURCE_DESCRIPTION":"","SOURCE_MEANING":"","SOURCE_DT_TM": "\/Date(0000-00-00T00:00:00.000+00:00)\/","SELECTED_IND":selectedInd});			
			AmbulatoryWorklist.setResourceFavList(storedSources);
		}

	} catch (error) {
		showErrorMessage(error.message, "updatePreferencesList", "", "");
	}
};


function processAppointmentDateCal(StorageName, selection) {
	var date = AmbulatoryWorklist.getDateTime(StorageName);
	date = DateAdd("d", selection, date);
	AmbulatoryWorklist.setDateTime(StorageName, date);
	updateAppointmentDataCal(date);
};

function updateAppointmentDataCal(date) {
	myDayApptFlag = false;
	$("#menu-span-id").parent("td").addClass("hidden");
	var show = dateFormat(date, dateFormat.masks.longDate);
	$("#showDateId").text(show);
	WorklistSelection.verifyOtherListSelection(0, 0);
};

function processAppointmentDate(StorageName, selection) {
	var date = AmbulatoryWorklist.getDateTime(StorageName);
	date = DateAdd("d", selection, date);
	AmbulatoryWorklist.setDateTime(StorageName, date);
	updateAppointmentData(date);
};

function updateAppointmentData(date) {
	myDayApptFlag = false;
	MyDay.stopAutoRefreshTimer();
	$("#menu-span-id").parent("td").addClass("hidden");
	var show = dateFormat(date, dateFormat.masks.longDate);
	$("#showDateId").text(show);
	WorklistSelection.verifyOtherListSelection(0, 0);
};

function DateAdd(interval, number, idate) {
	number = parseInt(number,10);
	var date;
	if (typeof (idate) == "string") {
		date = idate.split(/\D/);
		eval("var date = new Date(" + date.join(",") + ")");
	}

	if (typeof (idate) == "object") {
		date = new Date(idate.toString());
	}
	switch (interval) {
	case "y": date.setFullYear(date.getFullYear() + number); break;
	case "m": date.setMonth(date.getMonth() + number); break;
	case "d": date.setDate(date.getDate() + number); break;
	case "w": date.setDate(date.getDate() + 7 * number); break;
	case "h": date.setHours(date.getHours() + number); break;
	case "n": date.setMinutes(date.getMinutes() + number); break;
	case "s": date.setSeconds(date.getSeconds() + number); break;
	case "l": date.setMilliseconds(date.getMilliseconds() + number); break;
	}
	return date;
};
function scaleNumber(num)
{
	if (num<10)
	{
		return "0"+num;
	}
	else
	{
		return ""+num;
	}
};


/**
 * NOTE: This function is modeled after the logic of the mp_core.AlertConfirm(). 
 * The function/css are being modified to accommodate to meet the requirement for the Resource Search dialog.
 * Message box similar to alert or confirm with customizable options. 
 * @param msg {string} String message or html to display in message box
 * @param title {string} [OPTIONAL] Title of the message box
 * @param btnTrueText {string} [OPTIONAL] Text value of the true option button, will default to 'OK' if omitted.
 * @param btnFalseText {string} [OPTIONAL] Text value of the false option button.  No false button will be created if omitted.
 * @param falseBtnFocus {boolean} [OPTIONAL] Sets the default focus to the false button.
 * @param cb {object} [OPTIONAL] Callback function to fire on true button click. 
 */
var resourceArr = []; //to store JSON data of resource list returned from the script.

function ConfirmWindow (msg, title, btnTrueText, btnFalseText, falseBtnFocus, cb) {
	var btnTrue = "<button id='ambOrgSearchTrueButton' data-val='1' class = 'amb-org-search-ok-btn'>" + ((btnTrueText) ? btnTrueText : + i18n.OK) + "</button>";
	var btnFalse = "";
	if (btnFalseText) {
		btnFalse = "<button id='ambOrgSearchFalseButton' data-val='0' class = 'amb-org-search-cancel-btn'>" + btnFalseText + "</button>";
	}
	if (!title) {
		title = "&nbsp;";
	}

	var closeBox = function () {
		var btnVal = parseInt(this.getAttribute('data-val'), 10);

		if (btnVal === 1) //if it is ok button, then get selected row.
		{
			getSelectedRow();
		}
		else //cancel ok, nothing return
		{
			AmbulatoryWorklist.resourceAdd(0,0,"");
		}

		$(".amb-org-search-modal-div").remove();
		$(".amb-org-search-modal-dialog").remove();
		$("html").css("overflow", "auto"); //reset overflow
		if(btnVal && typeof cb==="function") {
			cb();
		}

	};

	var modalDiv = Util.cep("div", {"className": "amb-org-search-modal-div"});
	var dialog = Util.cep("div", {"className": "amb-org-search-modal-dialog"});   
	var dialogHTMLArr = [];
	dialogHTMLArr.push("<div class='amb-org-search-modal-dialog-hd'>", title, "</div>", "<div class='amb-org-search-modal-dialog-content'>", msg,
			"<div><input type='text' name='ResourceName' value='' id ='ambOrgSearchInputBoxId' class = 'amb-org-search-input-box' onkeydown='checkEnterKey(event)' />",
			"<button id='ambOrgFindResourceButton' class ='amb-org-search-find-btn'>", i18n.FIND, "</button><br />", "<div>", i18n.RESOURCES_LIST, ":</div>",
			"<select class ='amb-org-search-resource-list' id = 'ambOrgSearchResourceListId' size='13'><option value =''>&nbsp;</option></select>", "</div>", "</div>", "<div class='amb-org-search-modal-dialog-ft'><div class='amb-org-search-modal-dialog-btns'>", btnTrue, btnFalse, "</div></div>");
	dialog.innerHTML = dialogHTMLArr.join("");
	var docBody = document.body;
	Util.ac(modalDiv, docBody);
	Util.ac(dialog, docBody);

	if (btnTrueText) {
		Util.addEvent(_g('ambOrgSearchTrueButton'), "click", closeBox);		//click event for the true button (OK button)	 
	}

	Util.addEvent(_g('ambOrgFindResourceButton'), "click", searchResource); //click event for Find button

	if (btnFalseText) {
		Util.addEvent(_g('ambOrgSearchFalseButton'), "click", closeBox);
	}

	if (falseBtnFocus && btnFalseText) {
		_g('ambOrgSearchFalseButton').focus();
	}
	else {
		_g('ambOrgSearchTrueButton').focus();
	}

	$("html").css("overflow", "hidden"); //disable page scrolling when modal is enabled
	$(modalDiv).height($(document).height());

	_g('ambOrgSearchInputBoxId').focus(); //set focus to the input text box
}

/**
 * searchResource: This function will call the script mp_retrieve_sched_resources to get resources based on the given search string.
 * @param none.
 */		 
function searchResource(){
	var ambOrgSearchStringField = _g("ambOrgSearchInputBoxId");
	var searchString = "";

	if (ambOrgSearchStringField)
	{
		searchString = ambOrgSearchStringField.value ;
	}
	if (searchString)		
	{
		clearSearchResourceList(); //clear the current list before searching a new one.
		var cclParam = "^MINE^,^" + searchString + "^"; // (i.e. mp_retrieve_sched_resources "MINE","Test")
		AjaxHandler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : "mp_retrieve_sched_resources",  
				parameters : cclParam
			},
			response : {
				type : "JSON",
				target : loadResourceJSonData
				//parameters : [] // keep this as a reference for the format of AjaxHandler.ajax_request.
			}
		});
	}
}//searchResource

/**
 * loadResourceJSonData: This function will return data from the script mp_retrieve_sched_resources.
 * @param none.
 */	
function loadResourceJSonData(jsonResponse) {
	var jsonData = jsonResponse.response.RECORD_DATA;
	var scriptStatus = jsonData.STATUS_DATA.STATUS;
	var resourceListField = (_g("ambOrgSearchResourceListId"));

	if (scriptStatus === 'S' || scriptStatus === 'Z')
	{	
		var okTrueBtn = _g('ambOrgSearchTrueButton');
		if (okTrueBtn)
		{
			okTrueBtn.disabled = false; //enable ok button
		}
		if (jsonData.LIST_CNT > 0) 
		{
			var oList = jsonData.LIST;
			var oListLen = jsonData.LIST.length;

			if (resourceListField)
			{
				for (a = 0; a< oListLen; a++)
				{
					resourceArr.push(oList[a]);
					resourceListField.options.add(new Option(oList[a].DESC,oList[a].RESOURCE_CD)); // add each resource name using html option into the resource select tag.
				}
			}
		}
		else //cnt = 0
		{
			if (resourceListField)
			{
				resourceListField.options.add(new Option(i18n.NO_RESULTS_FOUND,0));
			}
		}
	}
	else //scriptStatus = F
	{
		if (resourceListField)
		{
			resourceListField.options.add(new Option(i18n.ERROR_RETRIEVING_RESULTS,0));
			var okTrueBtn = _g('ambOrgSearchTrueButton');
			if (okTrueBtn)
			{
				okTrueBtn.disabled = true; //disable Ok button
			}
		}
	}//end if	
}//end loadResourceJSonData

/**
 * getSelectedRow: This function will look for the selected row from the Resource list, then call resourceAdd() to return info to the Resource List dropdown box.
 * If a row is found, it will get the selected resource info. Else will send 0 info.
 * @param none.
 */		
function getSelectedRow()
{
	var resourceListField = (_g("ambOrgSearchResourceListId"));
	if (resourceListField)
	{
		var selectedIndex =  resourceListField.selectedIndex;
		if (selectedIndex > -1)
		{
			var rsArrLen = resourceArr.length;
			if (rsArrLen)
			{	
				for (a=0; a < rsArrLen; a++)
				{
					var resourceAdd = resourceArr[a];
					if (resourceAdd.RESOURCE_CD == resourceListField[selectedIndex].value)
					{
						AmbulatoryWorklist.resourceAdd(resourceAdd.PERSON_ID,resourceAdd.RESOURCE_CD,resourceAdd.DESC);	
						break; //one found, get out of the loop.
					}
				}
			}
			else
			{
				AmbulatoryWorklist.resourceAdd(0,0,"");
			}
		}
		else //nothing selected index = -1
		{
			AmbulatoryWorklist.resourceAdd(0,0,"");
		}
	}
} //getSelectedRow	

/**
 * clearSearchResourceList: This function will clear the previous displayed resource list (if it found) so that it will be ready to display the new list.
 * This is called when a new search is started.
 * @param none.
 */		
function clearSearchResourceList(){
	var resourceListField = (_g("ambOrgSearchResourceListId"));
	var rsListLen = resourceListField.length;

	if (resourceListField)
	{
		//loop thru the list and remove the 1st item at a time.
		for (a=0; a < rsListLen; a++)
		{
			resourceListField.remove(0); //remove the first item from the list 
		}
	}
} //clearSearchResourceList


/**
 * checkEnterKey: This function will check if a user presses the Enter key after entering a string to search for resources. 
 * If Enter key is pressed, then it will start to search resources.
 * @param e (event): key press event.
 */		
function checkEnterKey(e)
{
	var keynum;

	if (window.event) // IE8 and earlier
	{
		keynum = e.keyCode;
	}
	else if(e.which) // IE9/Firefox/Chrome/Opera/Safari
	{
		keynum = e.which;
	}

	if (keynum === 13) //enter key
	{
		searchResource() ;
	}
} //checkEnterKey

mp_formatter={};
mp_formatter.Locale=function(properties){this._className="mp_formatter.Locale";
this._parseList=function(names,expectedItems){var array=[];
if(names===null){throw"Names not defined";
}else{if(typeof names=="object"){array=names;
}else{if(typeof names=="string"){array=names.split(";",expectedItems);
for(var i=0;
i<array.length;
i++){if(array[i][0]=='"'&&array[i][array[i].length-1]=='"'){array[i]=array[i].slice(1,-1);
}else{throw"Missing double quotes";
}}}else{throw"Names must be an array or a string";
}}}if(array.length!=expectedItems){throw"Expected "+expectedItems+" items, got "+array.length;
}return array;
};
this._validateFormatString=function(formatString){if(typeof formatString=="string"&&formatString.length>0){return formatString;
}else{throw"Empty or no string";
}};
if(properties===null||typeof properties!="object"){throw"Error: Invalid/missing locale properties";
}if(typeof properties.decimal_point!="string"){throw"Error: Invalid/missing decimal_point property";
}this.decimal_point=properties.decimal_point;
if(typeof properties.thousands_sep!="string"){throw"Error: Invalid/missing thousands_sep property";
}this.thousands_sep=properties.thousands_sep;
if(typeof properties.grouping!="string"){throw"Error: Invalid/missing grouping property";
}this.grouping=properties.grouping;
if(properties===null||typeof properties!="object"){throw"Error: Invalid/missing time locale properties";
}try{this.time24hr=this._validateFormatString(properties.time24hr);
}catch(error){throw"Error: Invalid time24hr property: "+error;
}try{this.time24hrnosec=this._validateFormatString(properties.time24hrnosec);
}catch(error){throw"Error: Invalid time24hrnosec property: "+error;
}try{this.shortdate2yr=this._validateFormatString(properties.shortdate2yr);
}catch(error){throw"Error: Invalid shortdate2yr property: "+error;
}try{this.fulldate4yr=this._validateFormatString(properties.fulldate4yr);
}catch(error){throw"Error: Invalid fulldate4yr property: "+error;
}try{this.fulldate2yr=this._validateFormatString(properties.fulldate2yr);
}catch(error){throw"Error: Invalid fulldate2yr property: "+error;
}try{this.fullmonth4yrnodate=this._validateFormatString(properties.fullmonth4yrnodate);
}catch(error){throw"Error: Invalid fullmonth4yrnodate property: "+error;
}try{this.full4yr=this._validateFormatString(properties.full4yr);
}catch(error){throw"Error: Invalid full4yr property: "+error;
}try{this.fulldatetime2yr=this._validateFormatString(properties.fulldatetime2yr);
}catch(error){throw"Error: Invalid fulldatetime2yr property: "+error;
}try{this.fulldatetime4yr=this._validateFormatString(properties.fulldatetime4yr);
}catch(error){throw"Error: Invalid fulldatetime4yr property: "+error;
}try{this.fulldatetimenoyr=this._validateFormatString(properties.fulldatetimenoyr);
}catch(error){throw"Error: Invalid fulldatetimenoyr property: "+error;
}};
mp_formatter._getPrecision=function(optionsString){if(typeof optionsString!="string"){return -1;
}var m=optionsString.match(/\.(\d)/);
if(m){return parseInt(m[1],10);
}else{return -1;
}};
mp_formatter._isNumber=function(arg){if(typeof arg=="number"){return true;
}if(typeof arg!="string"){return false;
}var s=arg+"";
return(/^-?(\d+|\d*\.\d+)$/).test(s);
};
mp_formatter._isDate=function(arg){if(arg.getDate){return true;
}return false;
};
mp_formatter._trim=function(str){var whitespace=" \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
for(var i=0;
i<str.length;
i++){if(whitespace.indexOf(str.charAt(i))===-1){str=str.substring(i);
break;
}}for(i=str.length-1;
i>=0;
i--){if(whitespace.indexOf(str.charAt(i))===-1){str=str.substring(0,i+1);
break;
}}return whitespace.indexOf(str.charAt(0))===-1?str:"";
};
mp_formatter._splitNumber=function(amount){if(typeof amount=="number"){amount=amount+"";
}var obj={};
if(amount.charAt(0)=="-"){amount=amount.substring(1);
}var amountParts=amount.split(".");
if(!amountParts[1]){amountParts[1]="";
}obj.integer=amountParts[0];
obj.fraction=amountParts[1];
return obj;
};
mp_formatter._formatIntegerPart=function(intPart,grouping,thousandsSep){if(thousandsSep===""||grouping=="-1"){return intPart;
}var groupSizes=grouping.split(";");
var out="";
var pos=intPart.length;
var size;
while(pos>0){if(groupSizes.length>0){size=parseInt(groupSizes.shift(),10);
}if(isNaN(size)){throw"Error: Invalid grouping";
}if(size==-1){out=intPart.substring(0,pos)+out;
break;
}pos-=size;
if(pos<1){out=intPart.substring(0,pos+size)+out;
break;
}out=thousandsSep+intPart.substring(pos,pos+size)+out;
}return out;
};
mp_formatter._formatFractionPart=function(fracPart,precision){for(var i=0;
fracPart.length<precision;
i++){fracPart=fracPart+"0";
}return fracPart;
};
mp_formatter._hasOption=function(option,optionsString){if(typeof option!="string"||typeof optionsString!="string"){return false;
}if(optionsString.indexOf(option)!=-1){return true;
}else{return false;
}};
mp_formatter._validateFormatString=function(formatString){if(typeof formatString=="string"&&formatString.length>0){return true;
}else{return false;
}};
mp_formatter.NumericFormatter=function(locale){if(typeof locale!="object"||locale._className!="mp_formatter.Locale"){throw"Constructor error: You must provide a valid mp_formatter.Locale instance";
}this.lc=locale;
this.format=function(number,options){if(typeof number=="string"){number=mp_formatter._trim(number);
}if(!mp_formatter._isNumber(number)){throw"Error: The input is not a number";
}var floatAmount=parseFloat(number,10);
var reqPrecision=mp_formatter._getPrecision(options);
if(reqPrecision!=-1){floatAmount=Math.round(floatAmount*Math.pow(10,reqPrecision))/Math.pow(10,reqPrecision);
}var parsedAmount=mp_formatter._splitNumber(String(floatAmount));
var formattedIntegerPart;
if(floatAmount===0){formattedIntegerPart="0";
}else{formattedIntegerPart=mp_formatter._hasOption("^",options)?parsedAmount.integer:mp_formatter._formatIntegerPart(parsedAmount.integer,this.lc.grouping,this.lc.thousands_sep);
}var formattedFractionPart=reqPrecision!=-1?mp_formatter._formatFractionPart(parsedAmount.fraction,reqPrecision):parsedAmount.fraction;
var formattedAmount=formattedFractionPart.length?formattedIntegerPart+this.lc.decimal_point+formattedFractionPart:formattedIntegerPart;
if(mp_formatter._hasOption("~",options)||floatAmount===0){return formattedAmount;
}else{if(mp_formatter._hasOption("+",options)||floatAmount<0){if(floatAmount>0){return"+"+formattedAmount;
}else{if(floatAmount<0){return"-"+formattedAmount;
}else{return formattedAmount;
}}}else{return formattedAmount;
}}};
};
mp_formatter.DateTimeFormatter=function(locale){if(typeof locale!="object"||locale._className!="mp_formatter.Locale"){throw"Constructor error: You must provide a valid mp_formatter.Locale instance";
}this.lc=locale;
this.formatISO8601=function(dateStr,option){if(!mp_formatter._validateFormatString(dateStr)){throw"Error: The input is either empty or no string";
}var date=new Date();
date.setISO8601(dateStr);
return this.format(date,option);
};
this.format=function(dateTime,option){if(!mp_formatter._isDate(dateTime)){throw"Error: The input is not a date object";
}switch(option){case mp_formatter.DateTimeFormatter.TIME_24HOUR:return dateTime.format(this.lc.time24hr);
case mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS:return dateTime.format(this.lc.time24hrnosec);
case mp_formatter.DateTimeFormatter.SHORT_DATE_2YEAR:return dateTime.format(this.lc.shortdate2yr);
case mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR:return dateTime.format(this.lc.fulldate4yr);
case mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR:return dateTime.format(this.lc.fulldate2yr);
case mp_formatter.DateTimeFormatter.FULL_MONTH_4YEAR_NO_DATE:return dateTime.format(this.lc.fullmonth4yrnodate);
case mp_formatter.DateTimeFormatter.FULL_4YEAR:return dateTime.format(this.lc.full4yr);
case mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR:return dateTime.format(this.lc.fulldatetime2yr);
case mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR:return dateTime.format(this.lc.fulldatetime4yr);
case mp_formatter.DateTimeFormatter.FULL_DATE_TIME_NO_YEAR:return dateTime.format(this.lc.fulldatetimenoyr);
default:alert("Unhandled date time formatting option");
}};
};
mp_formatter.DateTimeFormatter.TIME_24HOUR=1;
mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS=2;
mp_formatter.DateTimeFormatter.SHORT_DATE_2YEAR=3;
mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR=4;
mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR=5;
mp_formatter.DateTimeFormatter.FULL_MONTH_4YEAR_NO_DATE=6;
mp_formatter.DateTimeFormatter.FULL_4YEAR=7;
mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR=8;
mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR=9;
mp_formatter.DateTimeFormatter.FULL_DATE_TIME_NO_YEAR=10;
function getXMLCclRequest(){var xmlHttp=null;
if(location.protocol.substr(0,4)=="http"&&location.href.indexOf("discern")>0){try{xmlHttp=new XMLHttpRequest();
}catch(e){try{xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
}catch(e){xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
}}}else{xmlHttp=new XMLCclRequest();
}return xmlHttp;
}var popupWindowHandle;
function getPopupWindowHandle(){return popupWindowHandle;
}XMLCclRequest=function(options){this.onreadystatechange=function(){return null;
};
this.options=options||{};
this.readyState=0;
this.responseText="";
this.status=0;
this.statusText="";
this.sendFlag=false;
this.errorFlag=false;
this.responseBody=this.responseXML=this.async=true;
this.requestBinding=null;
this.requestText=null;
this.blobIn=null;
this.onerror=this.abort=this.getAllResponseHeaders=this.getResponseHeader=function(){return null;
};
this.open=function(method,url,async){if(method.toLowerCase()!="get"&&method.toLowerCase()!="post"){this.errorFlag=true;
this.status=405;
this.statusText="Method not Allowed";
return false;
}this.method=method.toUpperCase();
this.url=url;
this.async=async!=null?(async?true:false):true;
this.requestHeaders=null;
this.responseText="";
this.responseBody=this.responseXML=null;
this.readyState=1;
this.sendFlag=false;
this.requestText="";
this.onreadystatechange();
};
this.send=function(param){if(this.readyState!=1){this.errorFlag=true;
this.status=409;
this.statusText="Invalid State";
return false;
}if(this.sendFlag){this.errorFlag=true;
this.status=409;
this.statusText="Invalid State";
return false;
}this.sendFlag=true;
this.requestLen=param.length;
this.requestText=param;
var uniqueId=this.url+"-"+(new Date()).getTime()+"-"+Math.floor(Math.random()*99999);
XMLCCLREQUESTOBJECTPOINTER[uniqueId]=this;
window.location='javascript:XMLCCLREQUEST_Send("'+uniqueId+'")';
};
this.setRequestHeader=function(name,value){if(this.readyState!=1){this.errorFlag=true;
this.status=409;
this.statusText="Invalid State";
return false;
}if(this.sendFlag){this.errorFlag=true;
this.status=409;
this.statusText="Invalid State";
return false;
}if(!value){return false;
}if(!this.requestHeaders){this.requestHeaders=[];
}this.requestHeaders[name]=value;
};
this.setBlobIn=function(blob){this.blobIn=blob;
};
};
XMLCCLREQUESTOBJECTPOINTER=[];
function evaluate(x){return eval(x);
}function CCLLINK__(program,param,nViewerType){}function CCLLINK(program,param,nViewerType){var paramLength=param.length;
if(paramLength>2000){param=param.substring(0,2000);
}var el=document.body.appendChild(document.createElement("a"));
el.href='javascript:CCLLINK__("'+program+'","'+param+'",'+nViewerType+","+paramLength+")";
el.click();
}function CCLNEWWINDOW(url){var newWindow=window.open(url,"","fullscreen=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=yes,titlebar=yes,toolbar=no");
newWindow.focus();
}function CCLEVENT__(eventId,eventData){}function CCLEVENT(eventId,eventData){var el=document.body.appendChild(document.createElement("a"));
el.href='javascript:CCLEVENT__("'+eventId+'")';
el.click();
}function CCLNEWSESSIONWINDOW__(sUrl,sName,sFeatures,bReplace,bModal){}function CCLNEWSESSIONWINDOW(sUrl,sName,sFeatures,bReplace,bModal){var el=document.body.appendChild(document.createElement("a"));
el.href='javascript:CCLNEWSESSIONWINDOW__("'+sUrl+'","'+sName+'","'+sFeatures+'",'+bReplace+","+bModal+")";
el.click();
if(bModal==0){popupWindowHandle=window.open(sUrl,sName,sFeatures,bReplace);
if(popupWindowHandle){popupWindowHandle.focus();
}}}function APPLINK(mode,appname,param){if(mode==0){window.open("file:///"+appname+" "+param);
}else{window.location="file:///"+appname+" "+param;
}}function MPAGES_EVENT__(eventType,eventParams){}function MPAGES_EVENT(eventType,eventParams){var paramLength=eventParams.length;
if(!document.getElementById("__ID_CCLPostParams_32504__")){linkObj=document.body.appendChild(document.createElement("a"));
linkObj.id="__ID_CCLPostParams_32504__";
}if(paramLength>2000){document.getElementById("__ID_CCLPostParams_32504__").value='"'+eventParams+'"';
eventParams=eventParams.substring(0,2000);
}window.location.href="javascript:MPAGES_EVENT__('"+eventType+"','"+eventParams+"',"+paramLength+")";
}function MPAGES_SVC_EVENT__(uri,params){}function MPAGES_SVC_EVENT(uri,params){var paramLength=params.length;
if(!document.getElementById("__ID_CCLPostParams_32504__")){linkObj=document.body.appendChild(document.createElement("a"));
linkObj.id="__ID_CCLPostParams_32504__";
}if(paramLength>2000){document.getElementById("__ID_CCLPostParams_32504__").value='"'+params+'"';
params=params.substring(0,2000);
}var el=document.getElementById("__ID_CCLPostParams_32504__");
el.href='javascript:MPAGES_SVC_EVENT__("'+uri+'","'+params+'",'+paramLength+")";
el.click();
}function CCLLINKPOPUP__(program,param,sName,sFeatures,bReplace){}function CCLLINKPOPUP(program,param,sName,sFeatures,bReplace){var paramLength=param.length;
if(!document.getElementById("__ID_CCLPostParams_32504__")){linkObj=document.body.appendChild(document.createElement("a"));
linkObj.id="__ID_CCLPostParams_32504__";
}if(paramLength>2000){document.getElementById("__ID_CCLPostParams_32504__").value='"'+param+'"';
param=param.substring(0,2000);
}var el=document.getElementById("__ID_CCLPostParams_32504__");
el.href='javascript:CCLLINKPOPUP__("'+program+'","'+param+'","'+sName+'","'+sFeatures+'",'+bReplace+","+paramLength+")";
el.click();
}function CCLNEWPOPUPWINDOW(sUrl,sName,sFeatures,bReplace){popupWindowHandle=window.open(sUrl,sName,sFeatures,bReplace);
popupWindowHandle.focus();
}function ArgumentURL(){this.getArgument=_getArg;
this.setArgument=_setArg;
this.removeArgument=_removeArg;
this.toString=_toString;
this.arguments=new Array();
var separator=",";
var equalsign="=";
var str=window.location.search.replace(/%20/g," ");
var index=str.indexOf("?");
var sInfo;
var infoArray=new Array();
var tmp;
if(index!=-1){sInfo=str.substring(index+1,str.length);
infoArray=sInfo.split(separator);
}for(var i=0;
i<infoArray.length;
i++){tmp=infoArray[i].split(equalsign);
if(tmp[0]!=""){var t=tmp[0];
this.arguments[tmp[0]]=new Object();
this.arguments[tmp[0]].value=tmp[1];
this.arguments[tmp[0]].name=tmp[0];
}}function _toString(){var s="";
var once=true;
for(i in this.arguments){if(once){s+="?";
once=false;
}s+=this.arguments[i].name;
s+=equalsign;
s+=this.arguments[i].value;
s+=separator;
}return s.replace(/ /g,"%20");
}function _getArg(name){if(typeof(this.arguments[name].name)!="string"){return null;
}else{return this.arguments[name].value;
}}function _setArg(name,value){this.arguments[name]=new Object();
this.arguments[name].name=name;
this.arguments[name].value=value;
}function _removeArg(name){this.arguments[name]=null;
}return this;
}function getTimeLineHTML(){var HTML="<div id='timelinecalhead' style='padding-left:1px;padding-right:1px;'>				<div id='timelinedvCalMain' class='calmain printborder'>					<div id='timelinegridcontainer' style='overflow-y: visible;'></div>				</div>		</div>";
return HTML;
}var PatientColumn=(function(){var defaultSortCSS;
var titleArr=[];
var loadJsondataCnt=0;
titleArr.push("<span class='heading-span'><span class='status-ind-header'><div class='sort-ind'></div></span><span class='appt-time-header'><div class='sort-ind'></div>",i18n.APPTTIME,"</span><span class='patient-header'><div class='sort-ind'></div>",i18n.PATIENT,"</span><span class='appt-details-header'>",i18n.APPTDETAILS,"</span><span class='status-header'><div class='sort-ind'></div>","<div id='statusHeaderId'>",i18n.STATUS," </div><div id='statusHeaderTimeStampId'></div>","</span><span class='notes-header'>",i18n.NOTES,"</span></span>");
return{meaning:"PATIENT",title:titleArr.join(""),cssClass:"amb-schedule-headers",isDefaultSortable:true,isSortable:function(){return false;
},setSortCSS:function(sortCSS){defaultSortCSS=sortCSS;
},getDefaultSortOrder:function(){return 0;
},getCurrentSortSelection:function(node){var sortSelection=Util.Style.g(defaultSortCSS,node)[0];
if(sortSelection){return(sortSelection.innerHTML);
}else{return("");
}},load:function(parentTable,columnIndex,headerCellDOM,criterion){if(MyDay.getSortheaderNotLoadedFlag()){MyDay.startLoadTimer();
MpageDriver.setSortableHeader({table:parentTable,columnObject:PatientColumn,columnIndex:columnIndex,headerCellNode:headerCellDOM,headerCSS:"appt-time-header",sortCSS:"appt-time-hidden"});
MpageDriver.setSortableHeader({table:parentTable,columnObject:PatientColumn,columnIndex:columnIndex,headerCellNode:headerCellDOM,headerCSS:"patient-header",sortCSS:"patient-hidden"});
MpageDriver.setSortableHeader({table:parentTable,columnObject:PatientColumn,columnIndex:columnIndex,headerCellNode:headerCellDOM,headerCSS:"status-header",sortCSS:"status-hidden"});
MpageDriver.setSortableHeader({table:parentTable,columnObject:PatientColumn,columnIndex:columnIndex,headerCellNode:headerCellDOM,headerCSS:"status-ind-header",sortCSS:"light-ind-flag-hidden"});
MyDay.setSortheaderNotLoadedFlag(false);
}var cclParamArr=[];
cclParamArr.push("'MINE',^",criterion.params,"^");
var cclParam=cclParamArr.join("");
cclParam=cclParam.replace(/"/g,"'");
AjaxHandler.ajax_request({request:{type:"XMLCCLREQUEST",target:"mp_amb_wklst_get_appts",parameters:cclParam},response:{type:"JSON",target:this.loadJsonData,parameters:[parentTable,columnIndex]}});
},loadJsonData:function(jsonResponse){var parentTable=jsonResponse.parameters[0];
if(!parentTable||parentTable.innerHTML===""){return false;
}var columnIndex=jsonResponse.parameters[1],jsonData=jsonResponse.response.APPTS;
if(jsonData.APPT_QUAL.length>0){TableLayout.insertColumnData({tableDOM:parentTable,columnIndex:columnIndex,JSONList:jsonData.APPT_QUAL,JSONRef:["STATE_MEANING","APPT_TIME_DISPLAY","NAME_DISPLAY","APPT_TYPE_DESC_DISPLAY","APPT_STATUS","APPT_REASON_DISPLAY","APPT_BEG_DT_TM","PERSON_NAME","APPT_STATUS","OPEN_ITEM_CNT","OPEN_ITEM_CNT"],JSONRefCSS:["status-ind","appt-time","patient","appt-details","status","notes","appt-time-hidden hidden","patient-hidden hidden","status-hidden hidden","open-items-cnt-hidden hidden","light-ind-flag-hidden hidden"],JSONRowId:["ORG_APPT_ID","ORG_APPT_TYPE","PRIMARY_TAB"]});
}AmbulatoryWorklist.pushData("MY_DAY",jsonData.APPT_QUAL);
if(loadJsondataCnt==0){defaultSortCSS="appt-time-hidden";
MyDay.setParentTable(parentTable);
MyDay.setDocLink(jsonData.DOCUMENT_TAB_LINK);
MyDay.setHPLink(jsonData.H_P_TAB_LINK);
MyDay.setConsentLink(jsonData.CONSENT_TAB_LINK);
MyDay.setPreopLink(jsonData.PREOP_ORDERS_TAB_LINK);
MyDay.setOrderLink(jsonData.ORDER_TAB_LINK);
MyDay.setTaskLink(jsonData.TASK_TAB_LINK);
MyDay.setVisitChargeInd(jsonData.VISIT_CHARGE_IND);
MyDay.setProviderNoteInd(jsonData.PROVIDER_VISIT_NOTE_IND);
MyDay.setTaskListInd(jsonData.TASK_LIST_IND);
MyDay.setVisitSummaryInd(jsonData.VISIT_SUMMARY_IND);
MyDay.setManualSatisfyInd(jsonData.MANUAL_SATISFY_IND);
MyDay.setVisitSummaryFormId(jsonData.VISIT_SUMMARY_FORM_ID);
MyDay.setHPInd(jsonData.H_AND_P_IND);
MyDay.setConsentInd(jsonData.CONSENT_IND);
MyDay.setPreopInd(jsonData.PREOP_IND);
MyDay.setVisitSummaryStaticContentLocation(jsonData.VISIT_SUMM_STATIC_CONTENT_LOC);
MyDay.setPositionCd(jsonData.POSITION_CD);
MyDay.setEnableAutoRefresh(jsonData.AUTOMATIC_REFRESH_IND);
MyDay.setRefreshTimer(jsonData.AUTOMATIC_REFRESH_TIMER);
MyDay.setGenericStatusColor(jsonData.SEEN_BY_GEN_COLOR);
loadJsondataCnt++;
}MpageDriver.finishedLoading(this.meaning);
}};
}());
MpageDriver.register({column:PatientColumn});
var MyDay=function(){var timerApptLoad;
var timerApptRender;
var startRefreshTimer;
var refreshTimerinMilliSeconds=0;
var enableAutoRefresh=false;
var docLink="";
var orderLink="";
var taskLink="";
var hpLink="";
var consentLink="";
var preopLink="";
var visitChargeInd=0;
var providerNoteInd=0;
var taskListInd=0;
var visitSummaryInd=0;
var hpInd=0;
var consentInd=0;
var preopInd=0;
var manualSatisfyInd=0;
var visitSummaryFormId=0;
var commentsLoaded=false;
var parentTable;
var visitSummStaticContentLoc="";
var positionCd=0;
var sortheaderNotLoaded=true;
var genericStatusColor=[];
var timeArr=[];
var elementArr=[];
return{clearTimeArr:function(){timeArr.length=0;
},clearElementArr:function(){elementArr.length=0;
},setTimeArr:function(timeArray){for(var i=0;
i<timeArray.length;
i++){timeArr[i]=timeArray[i];
}},getTimeArr:function(){return timeArr;
},setElementArr:function(elementArray){for(var i=0;
i<elementArray.length;
i++){elementArr[i]=elementArray[i];
}},getElementArr:function(){return elementArr;
},setParentTable:function(parTable){parentTable=parTable;
},getParentTable:function(){return parentTable;
},setCommentsLoadedFlag:function(boolVal){commentsLoaded=boolVal;
},getCommentsLoadedFlag:function(){return commentsLoaded;
},setSortheaderNotLoadedFlag:function(issortNotLoaded){sortheaderNotLoaded=issortNotLoaded;
},getSortheaderNotLoadedFlag:function(){return sortheaderNotLoaded;
},setDocLink:function(docLinkString){docLink=docLinkString;
},getDocLink:function(){return docLink;
},setHPLink:function(hpLinkString){hpLink=hpLinkString;
},getHPLink:function(){return hpLink;
},setConsentLink:function(consentLinkString){consentLink=consentLinkString;
},getConsentLink:function(){return consentLink;
},setPreopLink:function(preopLinkString){preopLink=preopLinkString;
},getPreopLink:function(){return preopLink;
},setOrderLink:function(orderLinkString){orderLink=orderLinkString;
},getOrderLink:function(){return orderLink;
},setTaskLink:function(taskLinkString){taskLink=taskLinkString;
},getTaskLink:function(){return taskLink;
},setVisitChargeInd:function(nVisitChargeIndicator){visitChargeInd=nVisitChargeIndicator;
},setProviderNoteInd:function(nProviderNoteIndicator){providerNoteInd=nProviderNoteIndicator;
},setTaskListInd:function(nTaskListIndicator){taskListInd=nTaskListIndicator;
},setVisitSummaryInd:function(nVisitSummInd){visitSummaryInd=nVisitSummInd;
},setManualSatisfyInd:function(nManualSatisfyIndicator){manualSatisfyInd=nManualSatisfyIndicator;
},setVisitSummaryFormId:function(powerformId){visitSummaryFormId=powerformId;
},setVisitSummaryStaticContentLocation:function(staticContentLoc){visitSummStaticContentLoc=staticContentLoc;
},setPositionCd:function(positionCode){positionCd=positionCode;
},setHPInd:function(nHPIndicator){hpInd=nHPIndicator;
},setPreopInd:function(nPreopIndicator){preopInd=nPreopIndicator;
},setConsentInd:function(nConsentIndicator){consentInd=nConsentIndicator;
},getManualSatisfyInd:function(){return manualSatisfyInd;
},setRefreshTimer:function(timerInMilliSeconds){refreshTimerinMilliSeconds=timerInMilliSeconds;
},getRefreshTimer:function(){return refreshTimerinMilliSeconds;
},setEnableAutoRefresh:function(enableAutoRefreshInd){if(enableAutoRefreshInd==1){enableAutoRefresh=true;
}else{enableAutoRefresh=false;
}},getEnableAutoRefresh:function(){return enableAutoRefresh;
},setGenericStatusColor:function(genericStatusArray){for(var index=0;
index<genericStatusArray.length;
index++){genericStatusColor[genericStatusArray[index].STATE_MEANING]=genericStatusArray[index].STATE_COLOR;
}},getGenericStatusColor:function(genericStatusMeaning){return genericStatusColor[genericStatusMeaning];
},startLoadTimer:function(){timerApptLoad=createSLATimer("USR:MPG.Amb_Org_load - build columns(MY_DAY)",VERSIONSTR);
},startRenderTimer:function(){timerApptRender=createSLATimer("USR:MPG.Amb_Org_load - edit rows(MY_DAY)",VERSIONSTR);
},stopLoadTimer:function(){if(timerApptLoad!=null){timerApptLoad.Stop();
}},stopRenderTimer:function(){if(timerApptRender!=null){timerApptRender.Stop();
}},startAutoRefreshTimer:function(){MyDay.stopAutoRefreshTimer();
var refreshTimerinMilliSeconds=MyDay.getRefreshTimer();
startRefreshTimer=setTimeout(function(){MyDay.autoRefresh();
},refreshTimerinMilliSeconds);
},stopAutoRefreshTimer:function(){if(startRefreshTimer){clearTimeout(startRefreshTimer);
}},statusIndHover:function(statusIndHover,prefCnt){if(statusIndHover){Util.Style.rcss(statusIndHover,"hidden");
if($(statusIndHover.parentNode.parentNode.parentNode).index()==0){$(statusIndHover).find(".open-items-content").css("top","0px");
}else{if(prefCnt<4){if(prefCnt==3){$(statusIndHover).find(".open-items-content").css("top","-20px");
}else{if(prefCnt==2){$(statusIndHover).find(".open-items-content").css("top","-10px");
}else{$(statusIndHover).find(".open-items-content").css("top","0px");
}}}}}},statusIndHoverOut:function(statusIndSpan){var statusIndHover=Util.Style.g("open-items-hover",statusIndSpan,"div")[0];
var surgStatusIndHover=Util.Style.g("surg-open-items-hover",statusIndSpan,"div")[0];
if(statusIndHover){Util.Style.acss(statusIndHover,"hidden");
}if(surgStatusIndHover){Util.Style.acss(surgStatusIndHover,"hidden");
}},getApptFromJsonData:function(jsonData,org_appt_id,org_appt_type){var dataFound=false;
for(var i=0,l=jsonData.length;
i<l;
i++){if(jsonData[i].ORG_APPT_ID==org_appt_id&&jsonData[i].ORG_APPT_TYPE==org_appt_type){dataFound=true;
return jsonData[i];
}}if(!dataFound){AjaxHandler.append_text("Appointment data not found<br/>org appt id = "+org_appt_id+"<br/>org appt type = "+org_appt_type);
}},editRows:function(jsonData){var localeLanguage=i18nUtility.getLocaleLanguage();
var localeCountry=i18nUtility.getLocaleCountry();
var MPAGE_LOCALE=AmbulatoryWorklist.getMpageLocale(localeLanguage,localeCountry);
var df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
var patientRows=_gbt("tr",_g("TBODY_MY_DAY"));
var arrLength=patientRows.length;
var rowData;
var prevRowData;
var resources=AmbulatoryWorklist.getSelectedResources();
var multResources=false;
var userIsResource=false;
var criterion=MpageDriver.getCriterion();
var statusIndHTML="";
var apptTimeHTML="";
var patInfoHTML="";
var apptDetailsHTML="";
var apptStatusHTML="";
var apptNotesHTML="";
var statusIndCell;
var apptTimeCell;
var prevApptTimeCell;
var patCell;
var apptDetailsCell;
var statusCell;
var notesCell;
var apptTimeHiddenCell;
var patientRowTD;
if(resources.length>1){multResources=true;
}var userPrefMenu=AmbulatoryWorklist.getUserPrefList();
var notesPref=(providerNoteInd==1)?userPrefMenu.NOTES_IND:"N";
var ordersPref=(visitChargeInd==1)?userPrefMenu.ORDERS_IND:"N";
var taskPref=(taskListInd==1)?userPrefMenu.TASK_IND:"N";
var summaryPref=(visitSummaryInd==1)?userPrefMenu.SUMMARY_IND:"N";
var hpPref=(hpInd==1)?userPrefMenu.HP_IND:"N";
var consentPref=(consentInd==1)?userPrefMenu.CONSENT_IND:"N";
var preopPref=(preopInd==1)?userPrefMenu.PREOP_IND:"N";
var currLocationHeader="";
var currApptType=0;
var heading="";
var tableBody=_g("TBODY_MY_DAY");
var nLocationHeaderCnt=0;
for(var i=0;
i<arrLength;
i++){prevRowData=rowData;
rowData=MyDay.getApptFromJsonData(jsonData,AmbulatoryWorklist.getOrgApptIdFromParentRow(patientRows[i]),AmbulatoryWorklist.getOrgApptTypeFromParentRow(patientRows[i]));
statusIndCell=Util.Style.g("status-ind",patientRows[i],"span")[0];
prevApptTimeCell=apptTimeCell;
apptTimeCell=Util.Style.g("appt-time",patientRows[i],"span")[0];
var sDate=new Date(df.formatISO8601(rowData.APPT_BEG_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR));
timeArr[timeArr.length]=sDate;
elementArr[elementArr.length]=rowId="_"+rowData.ORG_APPT_ID+"_"+rowData.ORG_APPT_TYPE+"_"+rowData.PRIMARY_TAB;
patCell=Util.Style.g("patient",patientRows[i],"span")[0];
apptDetailsCell=Util.Style.g("appt-details",patientRows[i],"span")[0];
statusCell=Util.Style.g("status",patientRows[i],"span")[0];
notesCell=Util.Style.g("notes",patientRows[i],"span")[0];
apptTimeHiddenCell=Util.Style.g("appt-time-hidden",patientRows[i],"span")[0];
patientRowTD=Util.Style.g("table-layout-table-td",patientRows[i],"td")[0];
if(notesCell){apptNotesHTML=MyDay.apptNotesColGenHTML(rowData);
notesCell.innerHTML=apptNotesHTML;
}else{notesCell=Util.cep("span",{className:"notes"});
patientRowTD.insertBefore(notesCell,apptTimeHiddenCell);
}if(statusCell){apptStatusHTML=MyDay.apptStatusColGenHTML(rowData);
statusCell.innerHTML=apptStatusHTML;
}else{statusCell=Util.cep("span",{className:"status"});
patientRowTD.insertBefore(statusCell,notesCell);
if(rowData.ORG_APPT_TYPE==APPT_TYPE_SURG){apptStatusHTML=MyDay.apptStatusColGenHTML(rowData);
statusCell.innerHTML=apptStatusHTML;
}}if(apptDetailsCell){apptDetailsHTML=AmbulatoryWorklist.apptDetailsColGenHTML(rowData);
apptDetailsCell.innerHTML=apptDetailsHTML;
}else{apptDetailsCell=Util.cep("span",{className:"appt-details"});
patientRowTD.insertBefore(apptDetailsCell,statusCell);
}if(patCell){patInfoHTML=AmbulatoryWorklist.patInfoColGenHTML(rowData);
patCell.innerHTML=patInfoHTML;
}else{patCell=Util.cep("span",{className:"patient"});
patientRowTD.insertBefore(patCell,apptDetailsCell);
}if(apptTimeCell){apptTimeHTML=MyDay.apptTimeColGenHTML(rowData,multResources);
apptTimeCell.innerHTML=apptTimeHTML;
}else{apptTimeCell=Util.cep("span",{className:"appt-time"});
patientRowTD.insertBefore(apptTimeCell,patCell);
}if(statusIndCell){statusIndHTML=MyDay.statusIndColGenHTML(statusIndCell,rowData,notesPref,ordersPref,taskPref,summaryPref,hpPref,consentPref,preopPref);
statusIndCell.innerHTML=statusIndHTML;
}else{statusIndCell=Util.cep("span",{className:"status-ind"});
patientRowTD.insertBefore(statusIndCell,apptTimeCell);
if(rowData.ORG_APPT_TYPE==APPT_TYPE_SURG){statusIndHTML=MyDay.statusIndColGenHTML(statusIndCell,rowData,notesPref,ordersPref,taskPref,summaryPref,hpPref,consentPref,preopPref);
statusIndCell.innerHTML=statusIndHTML;
}}if(rowData.ORG_APPT_TYPE==APPT_TYPE_AMB){if(notesPref=="Y"||ordersPref=="Y"||taskPref=="Y"||summaryPref=="Y"){var prefCntAmb=(notesPref=="Y")+(ordersPref=="Y")+(taskPref=="Y")+(summaryPref=="Y");
statusIndCell.onmouseover=function(){return MyDay.statusIndHover(Util.Style.g("open-items-hover",this,"div")[0],prefCntAmb);
};
}}else{if(rowData.ORG_APPT_TYPE==APPT_TYPE_SURG){if(hpPref=="Y"||consentPref=="Y"||preopPref=="Y"){var prefCntSurg=(hpPref=="Y")+(consentPref=="Y")+(preopPref=="Y");
statusIndCell.onmouseover=function(){return MyDay.statusIndHover(Util.Style.g("surg-open-items-hover",this,"div")[0],prefCntSurg);
};
}}}if(prevApptTimeCell&&(rowData.STATE_MEANING!==CANCELED&&rowData.STATE_MEANING!==NO_SHOW)){var k=i-1;
while(apptTimeCell.innerHTML===prevApptTimeCell.innerHTML){if(prevRowData.STATE_MEANING!==CANCELED&&prevRowData.STATE_MEANING!==NO_SHOW){Util.Style.acss(apptTimeCell,"double-booked");
Util.Style.acss(prevApptTimeCell,"double-booked");
break;
}k--;
if(!patientRows[k]){break;
}prevApptTimeCell=Util.Style.g("appt-time",patientRows[k],"span")[0];
if(!prevApptTimeCell){break;
}prevRowData=MyDay.getApptFromJsonData(jsonData,AmbulatoryWorklist.getOrgApptIdFromParentRow(patientRows[k]),AmbulatoryWorklist.getOrgApptTypeFromParentRow(patientRows[k]));
}}statusIndCell.onmouseout=function(){return MyDay.statusIndHoverOut(this);
};
Util.Style.acss(patientRows[i],"appointment-row");
if(rowData.ORG_APPT_TYPE==APPT_TYPE_SURG){MyDay.surgeryStyleIndicator(patientRows[i],rowData.STATE_MEANING);
}else{MyDay.styleIndicator(patientRows[i],rowData.STATE_MEANING);
}MyDay.updateLightSortFlag(patientRows[i],rowData.OPEN_ITEM_CNT,rowData.STATE_MEANING);
if(!userIsResource){if(parseInt(rowData.PRSNL_ID,10)==parseInt(criterion.personnel_id,10)){userIsResource=true;
}}if(resources.length==1){if((rowData.APPT_MAIN_LOC!==currLocationHeader)||(rowData.ORG_APPT_TYPE!==currApptType)){currLocationHeader=rowData.APPT_MAIN_LOC;
currApptType=rowData.ORG_APPT_TYPE;
nLocationHeaderCnt=nLocationHeaderCnt+1;
var locId="t_loc_header_"+nLocationHeaderCnt;
if(rowData.ORG_APPT_TYPE==APPT_TYPE_SURG){heading=i18n.SURGERY+" - "+rowData.APPT_MAIN_LOC;
}else{heading=i18n.CLINIC+" - "+rowData.APPT_MAIN_LOC;
}var rowBreak=Util.cep("tr",{id:locId,colspan:"1",className:"break-row"});
rowBreak.appendChild(Util.cep("td",{"class":"table-layout-table-td brdr",innerHTML:heading}));
tableBody.insertBefore(rowBreak,patientRows[i]);
i++;
arrLength++;
}}}var prefIndArray=[];
AmbulatoryWorklist.CreatePageMenu();
prefIndArray.push(providerNoteInd,visitChargeInd,taskListInd,visitSummaryInd,hpInd,consentInd,preopInd,0);
AmbulatoryWorklist.setUserPrefMenu(prefIndArray);
myDayApptFlag=true;
gblproviderNoteInd=providerNoteInd;
gblvisitChargeInd=visitChargeInd;
gbltaskListInd=taskListInd;
gblvisitSummaryInd=visitSummaryInd;
gblhpInd=hpInd;
gblconsentInd=consentInd;
gblpreopInd=preopInd;
if(userIsResource){if(resources.length>1){for(var j=0;
j<arrLength;
j++){rowData=MyDay.getApptFromJsonData(jsonData,AmbulatoryWorklist.getOrgApptIdFromParentRow(patientRows[j]),AmbulatoryWorklist.getOrgApptTypeFromParentRow(patientRows[j]));
var statusInd=Util.Style.g("status-ind",patientRows[j],"span")[0];
if((parseInt(rowData.PRSNL_ID,10)!=parseInt(criterion.personnel_id,10))&&statusInd){if(statusInd.firstChild){Util.Style.acss(statusInd.firstChild,"other-resource");
}}}}}},buildAutoRefreshCclParam:function(){var patientRows=_gbt("tr",_g("TBODY_MY_DAY"));
var arrLength=patientRows.length;
var jsonData=AmbulatoryWorklist.getData().MY_DAY;
var noParam=true;
var cclParamArray=[];
cclParamArray.push("'MINE',^{'patients':{'qual':[");
for(var i=0;
i<arrLength;
i++){var rowData=MyDay.getApptFromJsonData(jsonData,AmbulatoryWorklist.getOrgApptIdFromParentRow(patientRows[i]),APPT_TYPE_AMB);
if(typeof rowData!="undefined"){if(rowData.STATE_MEANING!==CHECKED_OUT&&rowData.STATE_MEANING!==CANCELED&&rowData.STATE_MEANING!==NO_SHOW&&rowData.STATE_MEANING!==HOLD){noParam=false;
if(i>0){cclParamArray.push(",");
}cclParamArray.push("{'PERSON_ID' :");
cclParamArray.push(parseInt(rowData.PERSON_ID,10).toFixed(2));
cclParamArray.push(",'ENCNTR_ID' :");
cclParamArray.push(parseInt(rowData.ENCNTR_ID,10).toFixed(2));
cclParamArray.push(",'SCH_EVENT_ID' :");
cclParamArray.push(parseInt(rowData.SCH_EVENT_ID,10).toFixed(2));
cclParamArray.push(",'SCHEDULE_ID' :");
cclParamArray.push(parseInt(rowData.SCHEDULE_ID,10).toFixed(2));
cclParamArray.push(",'ORG_APPT_ID' :");
cclParamArray.push(parseInt(rowData.ORG_APPT_ID,10).toFixed(2));
cclParamArray.push(",'ORG_APPT_TYPE' :");
cclParamArray.push(rowData.ORG_APPT_TYPE);
cclParamArray.push(",'PRIMARY_TAB' :");
cclParamArray.push(rowData.PRIMARY_TAB);
cclParamArray.push(",'APPT_STATUS' :'");
cclParamArray.push(rowData.APPT_STATUS);
cclParamArray.push("','STATE_MEANING' :'");
cclParamArray.push(rowData.STATE_MEANING);
cclParamArray.push("','ROOM' :'");
cclParamArray.push(rowData.ROOM);
cclParamArray.push("'}");
}}}cclParamArray.push("]}}^");
var cclParamStr=cclParamArray.join("");
if(noParam){cclParamStr="";
}return cclParamStr;
},autoRefresh:function(){var cclParam=MyDay.buildAutoRefreshCclParam();
cclParam=cclParam.replace(/"/g,"'");
if(cclParam!=""){AjaxHandler.ajax_request({request:{type:"XMLCCLREQUEST",target:"mp_amb_wklst_refresh_appts",parameters:cclParam},response:{type:"JSON",target:MyDay.updateRows,parameters:[]}});
}},updateRows:function(jsonResponse){var jsonResponse=jsonResponse.response;
var length=jsonResponse.REFRESHEDAPPTS.APPTS.length;
var locWrapperStatusClass=".loc-wrapper:first";
var locWrapperLocClass=".loc-wrapper:last";
var searchClassMainDetails=".curr-loc.main-detail";
var serachClassSubDetails=".curr-loc.sub-detail";
var flagForUserPreference=false;
var userPrefMenu;
var notesPref="N";
var ordersPref="N";
var taskPref="N";
var summaryPref="N";
var hpPref="N";
var consentPref="N";
var preopPref="N";
for(i=0;
i<length;
i++){var orgApptId=jsonResponse.REFRESHEDAPPTS.APPTS[i].ORG_APPT_ID;
var orgApptType=jsonResponse.REFRESHEDAPPTS.APPTS[i].ORG_APPT_TYPE;
var primaryTab=jsonResponse.REFRESHEDAPPTS.APPTS[i].PRIMARY_TAB;
var id="#_"+orgApptId+"_"+orgApptType+"_"+primaryTab;
var jsonData=AmbulatoryWorklist.getData().MY_DAY;
var rowData=MyDay.getApptFromJsonData(jsonData,orgApptId,orgApptType);
if(jsonResponse.REFRESHEDAPPTS.APPTS[i].APPT_STATUS_IND==1){var replaceString="";
var newApptCheckedIn=true;
var newClassName="curr-loc main-detail";
var searchClass=searchClassMainDetails;
var replaceStringArr=[];
var newStateMeaning=jsonResponse.REFRESHEDAPPTS.APPTS[i].STATE_MEANING;
var apptStatus=jsonResponse.REFRESHEDAPPTS.APPTS[i].APPT_STATUS;
if(rowData.STATE_MEANING===CONFIRMED){searchClass=serachClassSubDetails;
}if(newStateMeaning===CHECKED_OUT||newStateMeaning===CANCELED||newStateMeaning===NO_SHOW||newStateMeaning===HOLD){newApptCheckedIn=false;
newClassName="curr-loc sub-detail";
}replaceStringArr.push("<a href='Javascript:void(0);' class='",newClassName,"'>");
if(jsonResponse.REFRESHEDAPPTS.APPTS[i].APPT_STATUS_HISTORY.length>0){replaceStringArr.push("<span class='status-info'>",apptStatus,"</span>");
}else{replaceStringArr.push(apptStatus);
}replaceStringArr.push("</a>");
replaceString=replaceStringArr.join("");
$(id+" "+locWrapperStatusClass+" "+searchClass).replaceWith(replaceString);
var patientRow=$(id)[0];
Util.Style.g("status-hidden",patientRow,"span")[0].innerHTML=jsonResponse.REFRESHEDAPPTS.APPTS[i].APPT_STATUS;
MyDay.styleStatus(patientRow,Util.Style.g("curr-loc",patientRow,"a")[0],jsonResponse.REFRESHEDAPPTS.APPTS[i].STATE_MEANING);
if(!newApptCheckedIn){$(id+" "+locWrapperLocClass).addClass("hidden");
if($(id+" "+locWrapperStatusClass+" .curr-li").hasClass("expand")){$(id+" "+locWrapperStatusClass+" .curr-li").removeClass("expand");
}}else{if($(id+" "+locWrapperLocClass).hasClass("hidden")){$(id+" "+locWrapperLocClass).removeClass("hidden");
$(id+" "+locWrapperLocClass+" "+serachClassSubDetails).removeClass("not-selectable");
}}rowData.APPT_STATUS=apptStatus;
rowData.STATE_MEANING=newStateMeaning;
if(newStateMeaning!==CANCELED||newStateMeaning!==NO_SHOW){rowData.APPT_STATUS_TOTAL_TIME=jsonResponse.REFRESHEDAPPTS.APPTS[i].APPT_STATUS_TOTAL_TIME;
if(jsonResponse.REFRESHEDAPPTS.APPTS[i].APPT_STATUS_HISTORY.length>0){rowData.APPT_STATUS_HISTORY=[];
rowData.APPT_STATUS_HISTORY=rowData.APPT_STATUS_HISTORY.concat(jsonResponse.REFRESHEDAPPTS.APPTS[i].APPT_STATUS_HISTORY);
}}}else{if(rowData.STATE_MEANING!==CONFIRMED){rowData.APPT_STATUS_TOTAL_TIME=jsonResponse.REFRESHEDAPPTS.APPTS[i].APPT_STATUS_TOTAL_TIME;
if(jsonResponse.REFRESHEDAPPTS.APPTS[i].APPT_STATUS_HISTORY.length>0){rowData.APPT_STATUS_HISTORY=[];
rowData.APPT_STATUS_HISTORY=rowData.APPT_STATUS_HISTORY.concat(jsonResponse.REFRESHEDAPPTS.APPTS[i].APPT_STATUS_HISTORY);
}}}if(jsonResponse.REFRESHEDAPPTS.APPTS[i].LOCATION_IND==1){rowData.ROOM=jsonResponse.REFRESHEDAPPTS.APPTS[i].ROOM;
var apptCheckedIn=true;
if(rowData.STATE_MEANING===CONFIRMED||rowData.STATE_MEANING===CHECKED_OUT||rowData.STATE_MEANING===CANCELED||rowData.STATE_MEANING===NO_SHOW||rowData.STATE_MEANING===HOLD){apptCheckedIn=false;
}if(apptCheckedIn){$(id+" "+locWrapperLocClass+" "+serachClassSubDetails).text(jsonResponse.REFRESHEDAPPTS.APPTS[i].ROOM);
}}if(jsonResponse.REFRESHEDAPPTS.APPTS[i].UPDATED_ENCNTR_IND==1){rowData.ENCNTR_ID=jsonResponse.REFRESHEDAPPTS.APPTS[i].ENCNTR_ID;
rowData.MRN=jsonResponse.REFRESHEDAPPTS.APPTS[i].MRN;
rowData.FIN_NBR=jsonResponse.REFRESHEDAPPTS.APPTS[i].FIN_NBR;
var patCell=$(id+" .patient");
var patInfoHTML=AmbulatoryWorklist.patInfoColGenHTML(rowData);
patCell.html(patInfoHTML);
if(!flagForUserPreference){userPrefMenu=AmbulatoryWorklist.getUserPrefList();
notesPref=(providerNoteInd==1)?userPrefMenu.NOTES_IND:"N";
ordersPref=(visitChargeInd==1)?userPrefMenu.ORDERS_IND:"N";
taskPref=(taskListInd==1)?userPrefMenu.TASK_IND:"N";
summaryPref=(visitSummaryInd==1)?userPrefMenu.SUMMARY_IND:"N";
hpPref=(hpInd==1)?userPrefMenu.HP_IND:"N";
consentPref=(consentInd==1)?userPrefMenu.CONSENT_IND:"N";
preopPref=(preopInd==1)?userPrefMenu.PREOP_IND:"N";
flagForUserPreference=true;
}var statusIndicatorCell=$(id+" .status-ind");
var statusIndHTML=MyDay.statusIndColGenHTML($(id+" .status-ind"),rowData,notesPref,ordersPref,taskPref,summaryPref,hpPref,consentPref,preopPref);
statusIndicatorCell.html(statusIndHTML);
}}var now=new Date();
var hours=now.getHours();
var minutes=now.getMinutes();
if(hours>12){hours=hours-12;
}if(hours==0){hours=12;
}if(minutes<10){minutes="0"+minutes;
}var timeStamp=hours+":"+minutes;
$("#statusHeaderTimeStampId").text("("+timeStamp+")");
MyDay.startAutoRefreshTimer();
},adjustCommentListHeight:function(commentList){var maxHeight=$(document).height()*0.5;
var commUL=commentList.parentNode.parentNode;
commentList.style.height="auto";
Util.Style.acss(commUL,"get-hidden-height");
var listHeight=$(commUL).height()-68;
Util.Style.rcss(commUL,"get-hidden-height");
if(listHeight>maxHeight){commentList.style.height=parseInt(maxHeight,10);
}},styleIndicator:function(patientRow,status){switch(status){case CONFIRMED:Util.Style.acss(patientRow,"confirmed-row");
break;
case CHECKED_OUT:Util.Style.acss(patientRow,"checked-out-row");
break;
case CANCELED:case NO_SHOW:case HOLD:Util.Style.acss(patientRow,"canceled-row");
break;
case CHECKED_IN:Util.Style.acss(patientRow,"checked-in-row");
break;
case SEENBYMEDSTU:Util.Style.acss(patientRow,"med-stu-row");
break;
case SEENBYMIDLEV:Util.Style.acss(patientRow,"mid-lev-row");
break;
case SEENBYNURSE:Util.Style.acss(patientRow,"nurse-row");
break;
case SEENBYPHYSIC:Util.Style.acss(patientRow,"physician-row");
break;
case SEENBYRESIDE:Util.Style.acss(patientRow,"resident-row");
break;
case SEENBYGEN1:case SEENBYGEN2:case SEENBYGEN3:case SEENBYGEN4:if(MyDay.getGenericStatusColor(status)==1){Util.Style.acss(patientRow,"gen-status-green-row");
}else{Util.Style.acss(patientRow,"gen-status-orange-row");
}break;
default:Util.Style.acss(patientRow,"confirmed-row");
break;
}},surgeryStyleIndicator:function(patientRow,status){switch(status){case PRE_OP:Util.Style.acss(patientRow,"preop-row");
break;
case INTRA_OP:Util.Style.acss(patientRow,"intraop-row");
break;
case POST_OP:Util.Style.acss(patientRow,"postop-row");
break;
case CONFIRMED:case SCHEDULED:Util.Style.acss(patientRow,"confirmed-row");
break;
case CHECKED_IN:Util.Style.acss(patientRow,"checked-in-row");
break;
case CANCELED:case NO_SHOW:case HOLD:Util.Style.acss(patientRow,"canceled-row");
break;
case CHECKED_OUT:Util.Style.acss(patientRow,"surgery-status checked-out-row");
break;
default:break;
}},styleStatus:function(patientRow,d,status){Util.Style.rcss(patientRow,"confirmed-row");
Util.Style.rcss(patientRow,"checked-out-row");
Util.Style.rcss(patientRow,"canceled-row");
Util.Style.rcss(patientRow,"checked-in-row");
Util.Style.rcss(patientRow,"med-stu-row");
Util.Style.rcss(patientRow,"mid-lev-row");
Util.Style.rcss(patientRow,"nurse-row");
Util.Style.rcss(patientRow,"physician-row");
Util.Style.rcss(patientRow,"resident-row");
Util.Style.rcss(patientRow,"gen-status-green-row");
Util.Style.rcss(patientRow,"gen-status-orange-row");
MyDay.styleIndicator(patientRow,status);
MyDay.updateLightSortFlag(patientRow,parseInt(Util.Style.g("open-items-cnt-hidden",patientRow,"span")[0].innerHTML,10),status);
},hoverController:function(){$(".heading-span").delegate(".status-ind-header, .appt-time-header, .patient-header, .status-header","hover",function(){$(this).toggleClass("header-hover");
});
},statClick:function(d,statusCD,statusMeaning){MyDay.updateDropdown(d);
var parentRow=AmbulatoryWorklist.getParentRow(d);
if(AmbulatoryWorklist.getOrgApptTypeFromParentRow(parentRow)!="1"){return;
}var jsonData=AmbulatoryWorklist.getData().MY_DAY;
var rowData=MyDay.getApptFromJsonData(jsonData,AmbulatoryWorklist.getOrgApptIdFromParentRow(d),AmbulatoryWorklist.getOrgApptTypeFromParentRow(d));
var eventID=rowData.SCH_EVENT_ID;
var item=d.getElementsByTagName("a")[0].innerHTML;
if(rowData.APPT_STATUS!=item){MyDay.styleStatus(parentRow,Util.Style.g("curr-loc",parentRow,"a")[0],statusMeaning);
var cclParamArr=[];
cclParamArr.push("'MINE',",(parseInt(eventID,10).toFixed(2)),",",(parseInt(statusCD,10).toFixed(2)),"");
var cclParam=cclParamArr.join("");
cclParam=cclParam.replace(/"/g,"'");
AjaxHandler.ajax_request({request:{type:"XMLCCLREQUEST",target:"mp_amb_wklst_updt_sch_appt",parameters:cclParam},response:{type:"JSON",target:MyDay.statusSelectReturn,parameters:[parentRow]}});
}AmbulatoryWorklist.togglePadding($(".curr-div",d.parentNode.parentNode)[0]);
},updateDropdown:function(d){var itemID=d.value;
var item=d.getElementsByTagName("a")[0].innerHTML;
var currItem=d.parentNode.parentNode;
currItem.value=itemID;
if(d.firstChild.className=="main-detail"){currItem.getElementsByTagName("span")[0].innerHTML=item;
}else{currItem.getElementsByTagName("a")[0].innerHTML=item;
}Util.Style.tcss(currItem,"expand");
},locClick:function(d,encntrId){var locID=$(d).attr("data-locCd");
MyDay.updateDropdown(d);
var cclParamArr=[];
cclParamArr.push("'MINE',",(parseInt(encntrId,10).toFixed(2)),",",(parseInt(locID,10).toFixed(2)),"");
var cclParam=cclParamArr.join("");
cclParam=cclParam.replace(/"/g,"'");
AjaxHandler.ajax_request({request:{type:"XMLCCLREQUEST",target:"mp_amb_wklst_updt_encntr_loc",parameters:cclParam},response:{type:"JSON",target:MyDay.locSelectReturn,parameters:[]}});
},locSelectReturn:function(jsonResponse){},statusSelectReturn:function(jsonResponse){var parentRow=jsonResponse.parameters[0];
var curStatus=Util.Style.g("status-info",parentRow,"span")[0].innerHTML;
Util.Style.g("status-hidden",parentRow,"span")[0].innerHTML=curStatus;
var jsonData=AmbulatoryWorklist.getData().MY_DAY;
var rowData=MyDay.getApptFromJsonData(jsonData,AmbulatoryWorklist.getOrgApptIdFromParentRow(parentRow),AmbulatoryWorklist.getOrgApptTypeFromParentRow(parentRow));
rowData.APPT_STATUS=curStatus;
},updateLightSortFlag:function(parentRow,openItmCnt,status){var lightIndSpan=Util.Style.g("light-ind-flag-hidden",parentRow,"span")[0];
if((status==CHECKED_OUT||status==SEENBYPHYSIC)&&openItmCnt>0){lightIndSpan.innerHTML="1";
}else{lightIndSpan.innerHTML="0";
}},modifyVisibilityMyDay:function(itemTypes,prefs,patientRow){var statusInd;
var nodeType;
for(var j=0;
j<itemTypes.length;
j++){statusInd=Util.Style.g("open-items-content",patientRow,"div")[0];
nodeType=Util.Style.g(itemTypes[j],statusInd,"span")[0];
if(nodeType){if(prefs[j]=="N"){Util.Style.acss(nodeType,"hidden");
}else{Util.Style.rcss(nodeType,"hidden");
}}}},checkHover:function(patientRow,jsonData){var userPrefMenuSettings=AmbulatoryWorklist.getUserPrefList();
var rowData=MyDay.getApptFromJsonData(jsonData,AmbulatoryWorklist.getOrgApptIdFromParentRow(patientRow),AmbulatoryWorklist.getOrgApptTypeFromParentRow(patientRow));
var statusInd=Util.Style.g("status-ind",patientRow,"span")[0];
var prefCntAmb=(userPrefMenuSettings.NOTES_IND=="Y"&&providerNoteInd==1)+(userPrefMenuSettings.ORDERS_IND=="Y"&&visitChargeInd==1)+(userPrefMenuSettings.TASK_IND=="Y"&&taskListInd==1)+(userPrefMenuSettings.SUMMARY_IND=="Y"&&visitSummaryInd==1);
var prefCntSurg=(userPrefMenuSettings.HP_IND=="Y"&&hpInd==1)+(userPrefMenuSettings.CONSENT_IND=="Y"&&consentInd==1)+(userPrefMenuSettings.PREOP_IND=="Y"&&preopInd==1);
if(rowData.ORG_APPT_TYPE==APPT_TYPE_AMB){if(prefCntAmb==0){statusInd.onmouseover=function(){return MyDay.statusIndHoverOut(patientRow);
};
}else{statusInd.onmouseover=function(){return MyDay.statusIndHover(Util.Style.g("open-items-hover",patientRow,"div")[0],prefCntAmb);
};
}}else{if(rowData.ORG_APPT_TYPE==APPT_TYPE_SURG){if(prefCntSurg==0){statusInd.onmouseover=function(){return MyDay.statusIndHoverOut(patientRow);
};
}else{statusInd.onmouseover=function(){return MyDay.statusIndHover(Util.Style.g("surg-open-items-hover",patientRow,"div")[0],prefCntSurg);
};
}}}},updateOpenItemCnt:function(patientRow,jsonData){var userPrefMenuSettings=AmbulatoryWorklist.getUserPrefList();
var rowData=MyDay.getApptFromJsonData(jsonData,AmbulatoryWorklist.getOrgApptIdFromParentRow(patientRow),AmbulatoryWorklist.getOrgApptTypeFromParentRow(patientRow));
var statusInd=Util.Style.g("status-ind",patientRow,"span")[0];
if(rowData.ORG_APPT_TYPE==APPT_TYPE_AMB){rowData.OPEN_ITEM_CNT=(userPrefMenuSettings.NOTES_IND=="Y"&&rowData.PHYSICIAN_NOTE_COMPLETED=="N")+(userPrefMenuSettings.ORDERS_IND=="Y"&&rowData.BILLING_ORDER_PRESENT=="N")+(userPrefMenuSettings.TASK_IND=="Y"&&rowData.TASK_LIST_COMPLETED=="N")+(userPrefMenuSettings.SUMMARY_IND=="Y"&&rowData.VISIT_SUMMARY_COMPLETED=="N"&&rowData.DECLINE_POWERFORM_COMPLETED=="N");
}else{if(rowData.ORG_APPT_TYPE==APPT_TYPE_SURG){rowData.OPEN_ITEM_CNT=(userPrefMenuSettings.HP_IND=="Y"&&rowData.H_P_COMPLETED=="N")+(userPrefMenuSettings.CONSENT_IND=="Y"&&rowData.CONSENT_COMPLETED=="N")+(userPrefMenuSettings.PREOP_IND=="Y"&&rowData.PREOP_ORDER_COMPLETE=="N");
}}if(rowData.OPEN_ITEM_CNT>0){Util.Style.acss(statusInd,"open-items");
}else{Util.Style.rcss(statusInd,"open-items");
}var openItemCnt=Util.Style.g("open-items-cnt-hidden",patientRow,"span")[0];
openItemCnt.innerHTML=rowData.OPEN_ITEM_CNT;
},alertConfirm:function(msg,title,btnTrueText,btnFalseText,falseBtnFocus,cb){var btnTrue="<button id='acTrueButton' data-val='1'>"+((btnTrueText)?btnTrueText:"OK")+"</button>";
var btnFalse="";
if(btnFalseText){btnFalse="<button id='acFalseButton' data-val='0'>"+btnFalseText+"</button>";
}if(!title){title="&nbsp;";
}var closeBox=function(){var btnVal=parseInt(this.getAttribute("data-val"),10);
$(".modal-div").remove();
$(".modal-dialog").remove();
$("html").css("overflow","auto");
if(btnVal&&typeof cb==="function"){cb();
}};
var modalDiv=Util.cep("div",{className:"modal-div"});
var dialog=Util.cep("div",{className:"modal-dialog"});
var dialoginnerHTMLArr=[];
dialoginnerHTMLArr.push("<div class='modal-dialog-hd'>",title,"</div><div class='modal-dialog-content'>",msg,"</div><div class='modal-dialog-ft'><div class='modal-dialog-btns'>",btnTrue,btnFalse,"</div></div>");
dialog.innerHTML=dialoginnerHTMLArr.join("");
var docBody=document.body;
Util.ac(modalDiv,docBody);
Util.ac(dialog,docBody);
Util.addEvent(_g("acTrueButton"),"click",closeBox);
if(btnFalseText){Util.addEvent(_g("acFalseButton"),"click",closeBox);
}if(falseBtnFocus&&btnFalseText){_g("acFalseButton").focus();
}else{_g("acTrueButton").focus();
}$("html").css("overflow","hidden");
$(modalDiv).height($(document).height());
},loadWithCBParameters:function(url,parameters,callback,refEl){AjaxHandler.ajax_request({request:{type:"XMLCCLREQUEST",target:url,parameters:parameters},response:{type:"JSON",target:callback,parameters:[refEl]}});
},stripeComments:function(patientRow){var commentsContainer=Util.Style.g("comment-list",patientRow,"dl")[0];
var comments=Util.Style.g("comment",commentsContainer,"div");
var commentCnt=comments.length;
var i;
var commentClass="comment-even";
for(i=0;
i<commentCnt;
i++){Util.Style.acss(comments[i],commentClass);
if(commentClass==="comment-even"){Util.Style.acss(comments[i],commentClass);
Util.Style.rcss(comments[i],"comment-odd");
commentClass="comment-odd";
}else{Util.Style.acss(comments[i],commentClass);
Util.Style.rcss(comments[i],"comment-even");
commentClass="comment-even";
}}},initComments:function(){$(".comment-list").each(function(index){MyDay.adjustCommentListHeight($(this)[0]);
});
$("textarea[maxlength]").bind("input propertychange",function(){var limit=parseInt($(this).attr("maxlength"),10);
var text=$(this).val();
var chars=text.length;
if(chars>limit){var new_text=text.substr(0,limit);
if($(this).siblings(".comm-max").length){$(this).siblings(".comm-max").html("<span class='comm-max'>"+i18n.COMMENT_CHAR_MAX+"</span>");
}else{$(this).next().next().after("<span class='comm-max'>"+i18n.COMMENT_CHAR_MAX+"</span>");
}$(this).val(new_text);
$(this).siblings(".comm-max").delay(3000).fadeOut(1500,function(){$(this).remove();
});
}});
$(".comm-new").each(function(index){if($(this).text()==="Add comment here"||$(this).text()===$(this).attr("title")){$(this).text($(this).attr("title")).css({color:"#999"});
}$(this).focusin(function(){if($(this).val()===$(this).attr("title")){$(this).val("").css({color:"#505050"});
}});
$(this).focusout(function(){if(!$(this).val()){$(this).val($(this).attr("title")).css({color:"#999"});
}});
});
var updateComment=function(jResponse){var commentBox=jResponse.parameters[0];
var jsonResponse=jResponse.response;
if(jsonResponse){var jsReply=jsonResponse.REPLY;
var patientRow=AmbulatoryWorklist.getParentRow(commentBox.get(0));
var comCurrentBox=Util.Style.g("comment-list",patientRow)[0];
if((jsReply.STATUS_DATA.STATUS==="S")&&(jsReply.STICKY_NOTE_TEXT)){var commDel='<div class="comm-del" onmouseover="$(this).addClass(\'del-hover\');" onmouseout="$(this).removeClass(\'del-hover\');"></div>';
var updateHTMLArr=[];
updateHTMLArr.push("<div class='comment' onmouseover='$(this).addClass(\"comment-hover\");' onmouseout='$(this).removeClass(\"comment-hover\");' data-com-id='",jsReply.STICKY_NOTE_ID,"'><dd class='comm-txt'>",unescape(jsReply.STICKY_NOTE_TEXT),commDel,"</dd><dd class='comm-det'>",jsReply.UPDT_NAME,"</dd></div>");
var updateHTML=updateHTMLArr.join("");
$(comCurrentBox).prepend(updateHTML);
var comment=Util.Style.g("comm-del",comCurrentBox,"div")[0];
$(comment).click(function(){if($(this).hasClass("comm-no-del")){return;
}var commId=$(this).closest(".comment").attr("data-com-id");
var schEventID=$(comCurrentBox).attr("sch-event-id");
var commentDiv=$(this).closest(".comment");
var delComment=function(){commentDiv.remove();
if(commId&&schEventID){var cclParamArr=[];
cclParamArr.push("'MINE'",",",(parseInt(commId,10).toFixed(2)),",",(parseInt(schEventID,10).toFixed(2)),"");
var cclParam=cclParamArr.join("");
cclParam=cclParam.replace(/"/g,"'");
MyDay.loadWithCBParameters("mp_amb_wklst_del_comment",cclParam,updateComment,$(commentBox));
}};
MyDay.alertConfirm(i18n.COMMENT_DELETE_MESSAGE,i18n.COMMENT_DELETE_TITLE,i18n.DELETE,i18n.CANCEL,true,delComment);
});
}commentBox.val(commentBox.attr("title")).css({color:"#999"});
MyDay.stripeComments(patientRow);
MyDay.adjustCommentListHeight(comCurrentBox);
var commImg=Util.Style.g("row-exp-col",patientRow)[0];
if(comCurrentBox.innerHTML>""){Util.Style.rcss(commImg,"no-comments");
}else{Util.Style.acss(commImg,"no-comments");
}}else{alert(i18n.COMMENT_ERROR);
}};
$(".comm-new").focus(function(){if($(this).next(".comm-save").attr("sch-event-id")>""){$(".comm-save").show();
}$(".comm-cancel").show();
});
$(".comm-new").focusout(function(){if($(this).text()==="Add comment here"||$(this).text()===$(this).attr("title")){$(".comm-save").hide();
$(".comm-cancel").hide();
}});
$(".comm-save").click(function(){var commentBox=$(this).prev(".comm-new");
var commentText=commentBox.val();
var schEventID=$(this).attr("sch-event-id");
if(commentText==i18n.ADD_NEW_COMMENT){return;
}if(commentText.length>255){$(this).next(".comm-cancel").after("<span class='comm-max'>"+i18n.COMMENT_CHAR_MAX+"</span>");
commentBox.val(commentText.substr(0,255));
$(this).siblings(".comm-max").delay(3000).fadeOut(1500,function(){$(this).remove();
});
}else{if(commentText&&schEventID){var paramsArr=[];
paramsArr.push("'MINE'",",","1, 0.0, 'MPCOMMENT', 0.0, ",(parseInt(schEventID,10).toFixed(2)),", 'SCH_APPT', '",escape(commentText),"','',0.0,1");
var cclParam=paramsArr.join("");
cclParam=cclParam.replace(/"/g,"'");
MyDay.loadWithCBParameters("dc_mp_upd_sticky_note",cclParam,updateComment,commentBox);
}}$(".comm-save").hide();
$(".comm-cancel").hide();
});
$(".comm-cancel").click(function(){$(".comm-new").text($(".comm-new").attr("title")).css({color:"#999"});
$(".comm-save").hide();
$(".comm-cancel").hide();
});
$(".comm-del").click(function(){if($(this).hasClass("comm-no-del")){return;
}var commentBox=$(this).closest(".comment-list").prevAll(".comment-form:first").children(".comm-new:first");
var commId=$(this).closest(".comment").attr("data-com-id");
var schEventID=$(this).closest(".comment-list").attr("sch-event-id");
var commentDiv=$(this).closest(".comment");
var delComment=function(){commentDiv.remove();
if(commId&&schEventID){var cclParamArr=[];
cclParamArr.push("'MINE'",",",(parseInt(commId,10).toFixed(2)),",",(parseInt(schEventID,10).toFixed(2)),"");
var cclParam=cclParamArr.join("");
cclParam=cclParam.replace(/"/g,"'");
MyDay.loadWithCBParameters("mp_amb_wklst_del_comment",cclParam,updateComment,commentBox);
}};
MyDay.alertConfirm(i18n.COMMENT_DELETE_MESSAGE,i18n.COMMENT_DELETE_TITLE,i18n.DELETE,i18n.CANCEL,true,delComment);
});
},statusIndColGenHTML:function(statusIndCell,rowData,notesPref,ordersPref,taskPref,summaryPref,hpPref,consentPref,preopPref){var htmlArr=[];
var hasOpenItems=false;
var manSatInd=MyDay.getManualSatisfyInd();
var hpLinkString=hpLink;
var consentLinkString=consentLink;
var preopLinkString=preopLink;
rowData.OPEN_ITEM_CNT=0;
if(rowData.HIDE_REM_TASKS=="0"){if(rowData.ORG_APPT_TYPE==APPT_TYPE_AMB){if(notesPref=="Y"&&rowData.PHYSICIAN_NOTE_COMPLETED=="N"){hasOpenItems=true;
rowData.OPEN_ITEM_CNT=rowData.OPEN_ITEM_CNT+1;
}if(ordersPref=="Y"&&rowData.BILLING_ORDER_PRESENT=="N"){hasOpenItems=true;
rowData.OPEN_ITEM_CNT=rowData.OPEN_ITEM_CNT+1;
}if(taskPref=="Y"&&rowData.TASK_LIST_COMPLETED=="N"){hasOpenItems=true;
rowData.OPEN_ITEM_CNT=rowData.OPEN_ITEM_CNT+1;
}if(summaryPref=="Y"&&rowData.VISIT_SUMMARY_COMPLETED=="N"&&rowData.DECLINE_POWERFORM_COMPLETED=="N"){hasOpenItems=true;
rowData.OPEN_ITEM_CNT=rowData.OPEN_ITEM_CNT+1;
}}else{if(rowData.ORG_APPT_TYPE==APPT_TYPE_SURG){if(hpPref=="Y"&&rowData.H_P_COMPLETED=="N"){hasOpenItems=true;
rowData.OPEN_ITEM_CNT=rowData.OPEN_ITEM_CNT+1;
}if(consentPref=="Y"&&rowData.CONSENT_COMPLETED=="N"){hasOpenItems=true;
rowData.OPEN_ITEM_CNT=rowData.OPEN_ITEM_CNT+1;
}if(preopPref=="Y"&&rowData.PREOP_ORDER_COMPLETE=="N"){hasOpenItems=true;
rowData.OPEN_ITEM_CNT=rowData.OPEN_ITEM_CNT+1;
}}}}if(hasOpenItems){Util.Style.acss(statusIndCell,"open-items");
}if(rowData.ORG_APPT_TYPE==APPT_TYPE_AMB){htmlArr.push("<div class='color-ind'>");
if(rowData.HIDE_REM_TASKS=="0"){htmlArr.push("<div class='open-items-light'></div></div>");
htmlArr.push("<div class='open-items-hover hidden'><div class='open-items-arrow'></div><div class='open-items-content'><span class='orderTag reminder-task");
if(ordersPref=="N"){htmlArr.push(" hidden");
}htmlArr.push("'>");
if(visitChargeInd==1){if(rowData.BILLING_ORDER_PRESENT!="Y"){if(orderLink!==""){if(orderLink.indexOf("+")==-1){orderLink=orderLink+"+";
}}htmlArr.push("<a class='item-link'");
if(manSatInd==1){htmlArr.push(" onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
}htmlArr.push(' href=\'javascript:APPLINK(0,"powerchart.exe","/PERSONID=',rowData.PERSON_ID," /ENCNTRID=",rowData.ENCNTR_ID," /FIRSTTAB=^",orderLink,"^\");'");
htmlArr.push("><img class='open-item-icon' src='../img/order.png'>  ");
if(manSatInd==1){htmlArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='order' value='1'>");
}htmlArr.push(i18n.ORDER_NOT_STARTED,"</a>");
}else{htmlArr.push("<span class='complete-billing completed-item'");
if(rowData.ORDER_MANUAL_IND==0){htmlArr.push(" onmouseover='AmbulatoryWorklist.billingHover(this);' onmouseout='AmbulatoryWorklist.clearHoverTimer();'>");
}else{htmlArr.push("onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='order' value='1'>");
}htmlArr.push("<img class='open-item-icon' src='../img/order_dithered.png' > ",i18n.ORDER_COMPLETED,"</span>");
}htmlArr.push("<br/>");
}htmlArr.push("</span><span class='noteTag reminder-task");
if(notesPref=="N"){htmlArr.push(" hidden");
}htmlArr.push("'>");
if(providerNoteInd==1){if(rowData.PHYSICIAN_NOTE_EVENT_ID==0){if(rowData.NOTE_MANUAL_IND==1){if(rowData.PHYSICIAN_NOTE_COMPLETED_BY_RESIDENT=="Y"){htmlArr.push(AmbulatoryWorklist.manuallySatisfyResidentNote(rowData,docLink));
}else{htmlArr.push("<span class='completed-item' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
htmlArr.push("><img class='open-item-icon' src='../img/note_dithered.png' ><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='note' value='1'> ");
htmlArr.push(i18n.NOTE_COMPLETED,"</span>");
}}else{htmlArr.push("<a class='item-link'");
if(manSatInd==1){htmlArr.push(" onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
}if(docLink!==""){if(docLink.indexOf("+")==-1){docLink=docLink+"+";
}}htmlArr.push(' href=\'javascript:APPLINK(0,"powerchart.exe","/PERSONID=',rowData.PERSON_ID," /ENCNTRID=",rowData.ENCNTR_ID," /FIRSTTAB=^",docLink,"^\");'");
htmlArr.push("><img class='open-item-icon' src='../img/note.png' >  ");
if(manSatInd==1){htmlArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='note' value='1'>");
}htmlArr.push(i18n.NOTE_NOT_STARTED,"</a>");
}}else{if(rowData.PHYSICIAN_NOTE_COMPLETED_BY_RESIDENT=="Y"){if(rowData.PHYSICIAN_NOTE_COMPLETED=="N"){htmlArr.push(CreateClinNoteLink(rowData.PERSON_ID,rowData.ENCNTR_ID,rowData.PHYSICIAN_NOTE_EVENT_ID,"<img class='open-item-icon' src='../img/note.png' >  "+AmbulatoryWorklist.getResidentNoteStatus(rowData)+"","DOC",rowData.PHYSICIAN_NOTE_EVENT_ID));
}else{if(rowData.PHYSICIAN_NOTE_COMPLETED=="Y"){htmlArr.push("<span class='completed-item'>",CreateClinNoteLink(rowData.PERSON_ID,rowData.ENCNTR_ID,rowData.PHYSICIAN_NOTE_EVENT_ID,"<img class='open-item-icon' src='../img/note_dithered.png' >  "+AmbulatoryWorklist.getResidentNoteStatus(rowData)+"","DOC",rowData.PHYSICIAN_NOTE_EVENT_ID),"</span>");
}}}else{if(rowData.PHYSICIAN_NOTE_COMPLETED=="Y"){htmlArr.push("<span class='completed-item'>",CreateClinNoteLink(rowData.PERSON_ID,rowData.ENCNTR_ID,rowData.PHYSICIAN_NOTE_EVENT_ID,"<img class='open-item-icon' src='../img/note_dithered.png' >   "+i18n.NOTE_COMPLETED+"","DOC",rowData.PHYSICIAN_NOTE_EVENT_ID),"</span>");
}else{htmlArr.push(CreateClinNoteLink(rowData.PERSON_ID,rowData.ENCNTR_ID,rowData.PHYSICIAN_NOTE_EVENT_ID,"<img class='open-item-icon' src='../img/note.png' >   "+i18n.NOTE_SAVED+"","DOC",rowData.PHYSICIAN_NOTE_EVENT_ID));
}}}htmlArr.push("<br/>");
}htmlArr.push("</span><span class='taskTag reminder-task");
if(taskPref=="N"){htmlArr.push(" hidden");
}htmlArr.push("'>");
if(taskListInd==1){if(taskLink!==""){if(taskLink.indexOf("+")==-1){taskLink=taskLink+"+";
}}if(rowData.TASK_LIST_COMPLETED!="Y"){htmlArr.push("<a class='item-link'");
if(manSatInd==1){htmlArr.push(" onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
}htmlArr.push(' href=\'javascript:APPLINK(0,"powerchart.exe","/PERSONID=',rowData.PERSON_ID," /ENCNTRID=",rowData.ENCNTR_ID," /FIRSTTAB=^",taskLink,"^\");'","><img class='open-item-icon' src='../img/task.png'>");
if(manSatInd==1){htmlArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='task' value='1'> ");
}htmlArr.push(i18n.TASK_LIST_NOT_COMPLETE,"</a>");
}else{htmlArr.push("<span class='completed-item'");
if(rowData.TASK_LIST_MANUAL_IND==1){htmlArr.push("onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'><img class='open-item-icon' src='../img/task_dithered.png' ><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='task' value='1'> ",i18n.TASK_LIST_COMPLETE,"</span>");
}else{htmlArr.push('><a href=\'javascript:APPLINK(0,"powerchart.exe","/PERSONID=',rowData.PERSON_ID," /ENCNTRID=",rowData.ENCNTR_ID," /FIRSTTAB=^",taskLink,"^\");'","><img class='open-item-icon' src='../img/task_dithered.png' > ",i18n.TASK_LIST_COMPLETE,"</a></span>");
}}htmlArr.push("<br/>");
}htmlArr.push("</span><span class='visitSummTag reminder-task");
if(summaryPref=="N"){htmlArr.push(" hidden");
}htmlArr.push("'>");
if(visitSummaryInd==1){if(rowData.VISIT_SUMMARY_COMPLETED=="Y"){htmlArr.push("<span class='completed-item'><img class='open-item-icon' src='../img/VisitSummaryIcon_Complete.png' > ",i18n.VISIT_SUMM_COMPLETE,"</span>");
}else{if(rowData.DECLINE_POWERFORM_COMPLETED=="Y"){htmlArr.push("<span class='completed-item'><img class='open-item-icon' src='../img/VisitSummaryIcon_Complete.png' > ",i18n.VISIT_SUMM_DECLINE_COMPLETE,"</span>");
}else{htmlArr.push("<img class='open-item-icon' src='../img/VisitSummaryIcon_Incomplete.png'>");
htmlArr.push("<span class='visit-summary-wrapper'><ul class='visit-summ-actions-ul'><li class='visit-summ-actions-li'>");
var criterion=MpageDriver.getCriterion();
var link='javscript:CCLLINK("mp_clinical_summary_driver", "^MINE^, '+rowData.PERSON_ID+".0,"+rowData.ENCNTR_ID+".0,"+criterion.personnel_id+".0,"+positionCd+".0,"+rowData.PPR_CD+".0,^powerchart.exe^, ^"+visitSummStaticContentLoc+"^, ^MP_CLIN_SUM^,8,"+rowData.SCH_EVENT_ID+'.0",0)';
htmlArr.push("<a href='javascript:CCLNEWSESSIONWINDOW(%22",link,'%22,"_blank","height=800,width=800",0,1)\'>');
htmlArr.push(i18n.VISIT_SUMM_START,"</a></li><li class='visit-summ-actions-li'>");
if(!visitSummaryFormId>0){htmlArr.push('<a href=\'javascript:APPLINK(0,"powerchart.exe","/PERSONID=',rowData.PERSON_ID," /ENCNTRID=",rowData.ENCNTR_ID," /FIRSTTAB=^^\");'>");
}else{htmlArr.push('<a href=\'javascript:MPAGES_EVENT("POWERFORM","',rowData.PERSON_ID,"|",rowData.ENCNTR_ID,"|",visitSummaryFormId,"|0|0\")'>");
}htmlArr.push(i18n.VISIT_SUMM_DECLINE,"</a></li></ul>");
htmlArr.push("<span class='visit-summary'>",i18n.VISIT_SUMM_NOT_STARTED,"</span></span>");
}}}htmlArr.push("</span></div>");
}htmlArr.push("</div>");
}else{if(rowData.ORG_APPT_TYPE==APPT_TYPE_SURG){htmlArr.push("<div class='color-ind'>");
if(rowData.HIDE_REM_TASKS=="0"){htmlArr.push("<div class='surg-open-items-light");
if(rowData.STATE_MEANING===CANCELED){htmlArr.push(" hidden");
}htmlArr.push("'></div></div>");
htmlArr.push("<div class='surg-open-items-hover hidden'><div class='open-items-arrow'></div><div class='open-items-content'><span class='hp-tag reminder-task");
if(hpPref=="N"){htmlArr.push(" hidden");
}htmlArr.push("'>");
if(hpInd==1){if(rowData.H_P_EVENT_ID==0){if(rowData.HP_MANUAL_IND==1){htmlArr.push("<span class='completed-item' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
htmlArr.push("><img class='open-item-icon' src='../img/note_dithered.png' ><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='hp' value='1'> ");
htmlArr.push(i18n.HP_COMPLETED,"</span>");
}else{htmlArr.push("<a class='item-link'");
if(manSatInd==1){htmlArr.push(" onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
}if(hpLinkString!==""){if(hpLinkString.indexOf("+")==-1){hpLinkString=hpLinkString+"+";
}}htmlArr.push(' href=\'javascript:APPLINK(0,"powerchart.exe","/PERSONID=',rowData.PERSON_ID," /ENCNTRID=",rowData.ENCNTR_ID," /FIRSTTAB=^",hpLinkString,"^\");'");
htmlArr.push("><img class='open-item-icon' src='../img/note.png' >  ");
if(manSatInd==1){htmlArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='hp' value='1'>");
}htmlArr.push(i18n.HP_NOT_STARTED,"</a>");
}}else{if(rowData.H_P_COMPLETED=="Y"){htmlArr.push("<span class='completed-item'>",CreateClinNoteLink(rowData.PERSON_ID,rowData.ENCNTR_ID,rowData.H_P_EVENT_ID,"<img class='open-item-icon' src='../img/note_dithered.png' >   "+i18n.HP_COMPLETED+"","DOC",rowData.H_P_EVENT_ID),"</span>");
}else{htmlArr.push(CreateClinNoteLink(rowData.PERSON_ID,rowData.ENCNTR_ID,rowData.H_P_EVENT_ID,"<img class='open-item-icon' src='../img/note.png' >   "+i18n.HP_SAVED+"","DOC",rowData.H_P_EVENT_ID));
}}htmlArr.push("<br/>");
}htmlArr.push("</span><span class='consent-tag reminder-task");
if(consentPref=="N"){htmlArr.push(" hidden");
}htmlArr.push("'>");
if(consentInd==1){if(rowData.CONSENT_EVENT_ID==0){if(rowData.CONSENT_MANUAL_IND==1){htmlArr.push("<span class='completed-item' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
htmlArr.push("><img class='open-item-icon' src='../img/note_dithered.png' ><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='consent' value='1'> ");
htmlArr.push(i18n.CONSENT_COMPLETED,"</span>");
}else{htmlArr.push("<a class='item-link'");
if(manSatInd==1){htmlArr.push(" onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
}if(consentLinkString!==""){if(consentLinkString.indexOf("+")==-1){consentLinkString=consentLinkString+"+";
}}htmlArr.push(' href=\'javascript:APPLINK(0,"powerchart.exe","/PERSONID=',rowData.PERSON_ID," /ENCNTRID=",rowData.ENCNTR_ID," /FIRSTTAB=^",consentLinkString,"^\");'");
htmlArr.push("><img class='open-item-icon' src='../img/note.png' >  ");
if(manSatInd==1){htmlArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='consent' value='1'>");
}htmlArr.push(i18n.CONSENT_NOT_STARTED,"</a>");
}}else{if(rowData.CONSENT_COMPLETED=="Y"){htmlArr.push("<span class='completed-item'>",CreateClinNoteLink(rowData.PERSON_ID,rowData.ENCNTR_ID,rowData.CONSENT_EVENT_ID,"<img class='open-item-icon' src='../img/note_dithered.png' >   "+i18n.CONSENT_COMPLETED+"","DOC",rowData.CONSENT_EVENT_ID),"</span>");
}else{htmlArr.push(CreateClinNoteLink(rowData.PERSON_ID,rowData.ENCNTR_ID,rowData.CONSENT_EVENT_ID,"<img class='open-item-icon' src='../img/note.png' >   "+i18n.CONSENT_SAVED+"","DOC",rowData.CONSENT_EVENT_ID));
}}htmlArr.push("<br/>");
}htmlArr.push("</span><span class='preop-tag reminder-task");
if(preopPref=="N"){htmlArr.push(" hidden");
}htmlArr.push("'>");
if(preopInd==1){if(rowData.PREOP_ORDER_COMPLETE!="Y"){if(preopLinkString!==""){if(preopLinkString.indexOf("+")==-1){preopLinkString=preopLinkString+"+";
}}htmlArr.push("<a class='item-link'");
if(manSatInd==1){htmlArr.push(" onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
}htmlArr.push(' href=\'javascript:APPLINK(0,"powerchart.exe","/PERSONID=',rowData.PERSON_ID," /ENCNTRID=",rowData.ENCNTR_ID," /FIRSTTAB=^",preopLinkString,"^\");'");
htmlArr.push("><img class='open-item-icon' src='../img/order.png' >  ");
if(manSatInd==1){htmlArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='preop' value='1'>");
}htmlArr.push(i18n.PREOP_ORDER_NOT_STARTED,"</a>");
}else{htmlArr.push("<span class='complete-billing completed-item'");
if(rowData.PREOP_MANUAL_IND==0){htmlArr.push(" onmouseover='AmbulatoryWorklist.billingHover(this);' onmouseout='AmbulatoryWorklist.clearHoverTimer();'>");
}else{htmlArr.push("onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='preop' value='1'>");
}htmlArr.push("<img class='open-item-icon' src='../img/order_dithered.png' > ",i18n.PREOP_ORDER_COMPLETE,"</span>");
}htmlArr.push("<br/>");
}htmlArr.push("</span></div></div>");
}htmlArr.push("</div>");
}}return htmlArr.join("");
},apptTimeColGenHTML:function(rowData,multResources){var htmlArr=[];
if(multResources){htmlArr.push(rowData.APPT_TIME_DISPLAY,"<br/><span class='sub-detail'>",rowData.MNEMONIC,"</span>");
return htmlArr.join("");
}else{if(rowData.PRSNL_ID>0){return rowData.APPT_TIME_DISPLAY;
}else{htmlArr.push(rowData.APPT_TIME_DISPLAY,"<br/><span class='sub-detail'>",rowData.PROVIDER_MNEMONIC,"</span>");
return htmlArr.join("");
}}},apptStatusColGenHTML:function(rowData){var className="";
var apptCheckedIn=true;
var numberOfResources=AmbulatoryWorklist.getSelectedResources().length;
if(rowData.STATE_MEANING===CONFIRMED||rowData.STATE_MEANING===CHECKED_OUT||rowData.STATE_MEANING===CANCELED||rowData.STATE_MEANING===HOLD||rowData.STATE_MEANING===NO_SHOW||rowData.STATE_MEANING===""){apptCheckedIn=false;
}var statusHtmlArr=[];
if(apptCheckedIn){className="curr-loc main-detail";
}else{className="curr-loc sub-detail";
}statusHtmlArr.push("<div class='loc-wrapper'><ul class='locations'><li class='curr-li'>");
if(rowData.ORG_APPT_TYPE==APPT_TYPE_SURG){var displayStatus="";
switch(rowData.STATE_MEANING){case PRE_OP:displayStatus=i18n.PRE_OP;
break;
case INTRA_OP:displayStatus=i18n.INTRA_OP;
break;
case POST_OP:displayStatus=i18n.POST_OP;
break;
case CONFIRMED:case CHECKED_IN:case CHECKED_OUT:case NO_SHOW:case HOLD:case CANCELED:case SCHEDULED:displayStatus=rowData.APPT_STATUS;
break;
default:displayStatus="&nbsp;";
break;
}statusHtmlArr.push("<div class = 'surg-status-container'><div class='surg-status-div' onmouseover='AmbulatoryWorklist.surgStatusHover(this);' onmouseout='AmbulatoryWorklist.clearHoverTimer();'><span class='surg-status-main-detail'>",displayStatus,"</span></div>");
}else{statusHtmlArr.push("<div class='curr-div'><a href='Javascript:void(0);' class='",className,"'>");
if(rowData.APPT_STATUS_HISTORY.length>0){statusHtmlArr.push("<span class='status-info'>",rowData.APPT_STATUS,"</span>");
}else{statusHtmlArr.push(rowData.APPT_STATUS);
}statusHtmlArr.push("</a></div>");
}if(apptCheckedIn){statusHtmlArr.push("<ul class='loc-ul'>");
var l=rowData.SCH_ACTION_CD_CNT;
for(var i=0;
i<l;
i++){statusHtmlArr.push("<li class='loc-li'>");
statusHtmlArr.push("<a class='main-detail' href='Javascript:void(0);'>",rowData.SCH_ACTION_CD_QUAL[i].SCH_ACTION_DISPLAY,"</a></li>");
}statusHtmlArr.push("</ul>");
}statusHtmlArr.push("</li></ul></div>");
if(rowData.ORG_APPT_TYPE==APPT_TYPE_SURG){if(numberOfResources>1){statusHtmlArr.push("<div class='loc-wrapper'><div class = 'surg-status-container'><div class='surg-status-div' onmouseover='AmbulatoryWorklist.surgStatusHover(this);' onmouseout='AmbulatoryWorklist.clearHoverTimer();'>");
statusHtmlArr.push("<span class='sub-detail'>",rowData.APPT_MAIN_LOC,"</span></div></div></div>");
}statusHtmlArr.push("<div class='loc-wrapper'><div class = 'surg-status-container'><div class='surg-status-div' onmouseover='AmbulatoryWorklist.surgStatusHover(this);' onmouseout='AmbulatoryWorklist.clearHoverTimer();'>");
statusHtmlArr.push("<span class='sub-detail'>",rowData.SURGCASE[0].SCHED_SURG_AREA_DISP," | ",rowData.SURGCASE[0].SCHED_OP_LOC_DISP,"</div></div>");
}else{if(numberOfResources>1){statusHtmlArr.push("<div class='loc-wrapper'><div class = 'status-container'><div class='status-div' onmouseover='AmbulatoryWorklist.apptDetailsHover(this);' onmouseout='AmbulatoryWorklist.clearHoverTimer();'>");
statusHtmlArr.push("<span class='sub-detail'>",rowData.APPT_MAIN_LOC,"</span></div></div></div>");
}var room;
var locLength=rowData.APPT_LOC_CNT;
if(typeof rowData.ROOM==="undefined"){room=i18n.LOCATION_NOT_DEFINED;
}else{rowData.ROOM===""?room=i18n.LOCATION_NOT_DEFINED:room=rowData.ROOM;
}statusHtmlArr.push("<div class='loc-wrapper");
if(!apptCheckedIn){statusHtmlArr.push(" hidden");
}statusHtmlArr.push("'><ul class='locations'><li class='curr-li'><div class='curr-div'><a class='curr-loc sub-detail");
if(!apptCheckedIn){statusHtmlArr.push(" not-selectable");
}statusHtmlArr.push("' href='Javascript:void(0);'>",room,"</a></div>");
if(locLength>0){statusHtmlArr.push("<ul class='loc-ul'>");
for(var k=0;
k<locLength;
k++){statusHtmlArr.push("<li class='loc-li' data-locCd='",rowData.APPT_LOC_QUAL[k].LOCATION_CD,"'><a class='sub-detail' href='Javascript:void(0);'>",rowData.APPT_LOC_QUAL[k].LOCATION,"</a></li>");
}statusHtmlArr.push("</ul>");
}}statusHtmlArr.push("</li></ul></div>");
return statusHtmlArr.join("");
},apptNotesColGenHTML:function(rowData){var notesHtmlArr=[];
var commIndClass="";
if(rowData.COMMENTS.length===0){commIndClass=" no-comments";
}if(rowData.SCH_EVENT_ID!==0){notesHtmlArr.push("<div class='com-wrapper'><ul class='locations'><li class='curr-li'><div class='row-exp-col",commIndClass,"'></div><ul class='comm-ul'><li class='comm-li'>");
notesHtmlArr.push("<span class='comm-hd'>",i18n.COMMENTS,"</span><div class='comment-form'><textarea class='comm-new' rows='2' maxlength='255' title='",i18n.ADD_NEW_COMMENT,"'>",i18n.ADD_NEW_COMMENT,"</textarea><button class='comm-save' sch-event-id='",rowData.SCH_EVENT_ID,"'>",i18n.SAVE,"</button><button class='comm-cancel'>",i18n.CANCEL,"</button></div>");
notesHtmlArr.push("<dl class='comment-list' sch-event-id='",rowData.SCH_EVENT_ID,"'>");
}else{notesHtmlArr.push("<div class='com-wrapper'><ul class='locations'><li class='curr-li'><ul class='comm-ul'><li class='comm-li'>");
}var commentCnt=rowData.COMMENTS.length;
var i;
var commentClass="comment-even";
var commDate;
var commDateNoon;
var currDate;
var dateString;
var dayDiff;
var localeLanguage=i18nUtility.getLocaleLanguage();
var localeCountry=i18nUtility.getLocaleCountry();
var MPAGE_LOCALE=AmbulatoryWorklist.getMpageLocale(localeLanguage,localeCountry);
var df=new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
for(i=0;
i<commentCnt;
i++){commDate=new Date();
commDateNoon=new Date();
currDate=new Date();
commDate.setISO8601(rowData.COMMENTS[i].COMMENT_UPDT_DT_TM);
commDateNoon.setISO8601(rowData.COMMENTS[i].COMMENT_UPDT_DT_TM);
commDateNoon.setHours(12,0,0,0);
currDate.setHours(12,0,0,0);
dayDiff=currDate.getTime()-commDateNoon.getTime();
dayDiff=dayDiff/(86400000);
if(dayDiff===0){dateString=i18n.TODAY;
dateString+=" "+commDate.format("HH:MM");
}else{if(dayDiff===1){dateString=i18n.YESTERDAY;
dateString+=" "+commDate.format("HH:MM");
}else{if(dayDiff===2){dateString=i18n.TWO_DAYS_AGO;
dateString+=" "+commDate.format("HH:MM");
}else{dateString=df.formatISO8601(rowData.COMMENTS[i].COMMENT_UPDT_DT_TM,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
}}}notesHtmlArr.push("<div class='comment ",commentClass,"' onmouseover='$(this).addClass(\"comment-hover\");' onmouseout='$(this).removeClass(\"comment-hover\");' data-com-id='",rowData.COMMENTS[i].COMMENT_SN_ID,"'><div class='comm-txt'>");
notesHtmlArr.push(unescape(rowData.COMMENTS[i].COMMENT_TEXT));
notesHtmlArr.push("<div class='comm-del' onmouseover='$(this).addClass(\"del-hover\");' onmouseout='$(this).removeClass(\"del-hover\");'></div>");
notesHtmlArr.push("</div><div class='comm-det'>",rowData.COMMENTS[i].COMMENT_UPDT_BY," (",dateString,")</div></div>");
if(commentClass==="comment-even"){commentClass="comment-odd";
}else{commentClass="comment-even";
}}notesHtmlArr.push("</dl></li></ul></li></ul></div><div class='notes-container'>");
if(rowData.APPT_REASON){notesHtmlArr.push("<div class='notes-div' onmouseover='AmbulatoryWorklist.apptDetailsHover(this);' onmouseout='AmbulatoryWorklist.clearHoverTimer();'><span class='main-detail'><span class='sub-detail'>",i18n.REASON,": </span>",rowData.APPT_REASON,"</span></div>");
}if(rowData.CHIEF_COMPLAINT){notesHtmlArr.push("<div class='notes-div' onmouseover='AmbulatoryWorklist.apptDetailsHover(this);' onmouseout='AmbulatoryWorklist.clearHoverTimer();'><span class='main-detail'><span class='sub-detail'>",i18n.CHIEF_COMPLAINT,": </span>",rowData.CHIEF_COMPLAINT,"</span></div>");
}notesHtmlArr.push("</div>");
return notesHtmlArr.join("");
},insertLocationHeader:function(){var currLocationHeader="";
var currApptType=0;
var heading="";
var tableBody=_g("TBODY_MY_DAY");
var patientRows=_gbt("tr",tableBody);
if(AmbulatoryWorklist.getSelectedResources().length===1){var arrLength=patientRows.length;
var worklistData=AmbulatoryWorklist.getData();
var jsonData=worklistData.MY_DAY;
var nLocationHeaderCnt=0;
for(var i=0;
i<arrLength;
i++){var rowData=MyDay.getApptFromJsonData(jsonData,AmbulatoryWorklist.getOrgApptIdFromParentRow(patientRows[i]),AmbulatoryWorklist.getOrgApptTypeFromParentRow(patientRows[i]));
if(rowData.APPT_MAIN_LOC!==currLocationHeader||(rowData.ORG_APPT_TYPE!==currApptType)){currLocationHeader=rowData.APPT_MAIN_LOC;
currApptType=rowData.ORG_APPT_TYPE;
nLocationHeaderCnt=nLocationHeaderCnt+1;
var locId="t_loc_header_"+nLocationHeaderCnt;
if(rowData.ORG_APPT_TYPE==APPT_TYPE_SURG){heading=i18n.SURGERY+" - "+rowData.APPT_MAIN_LOC;
}else{heading=i18n.CLINIC+" - "+rowData.APPT_MAIN_LOC;
}var rowBreak=Util.cep("tr",{id:locId,colspan:"1",className:"break-row"});
rowBreak.appendChild(Util.cep("td",{"class":"table-layout-table-td brdr",innerHTML:heading}));
tableBody.insertBefore(rowBreak,patientRows[i]);
i++;
arrLength++;
}}}}};
}();
function tabFinLoadMyDay(){MyDay.stopLoadTimer();
MyDay.startRenderTimer();
MyDay.setSortheaderNotLoadedFlag(true);
if(myDayResourceChangeTimer==null&&myDayButtonClickTimer==null){startMyDayRefreshTimer();
}if(_g("TBODY_MY_DAY")){var worklistData=AmbulatoryWorklist.getData();
var resizeTimer=null;
var localeLanguage=i18nUtility.getLocaleLanguage();
MyDay.editRows(worklistData.MY_DAY);
$(".visit-summary-wrapper").mouseover(function(){Util.Style.acss(this.parentNode,"expand");
});
$(".visit-summary-wrapper").mouseout(function(){Util.Style.rcss(this.parentNode,"expand");
});
var tableObj=$("#TABLE_MY_DAY");
tableObj.bind("sorton",function(event,sortSettings){$(".break-row",this).remove();
if($(".appt-time-header.is-sortable-header.header.headerSortUp").length){MyDay.insertLocationHeader();
}});
if(localeLanguage="EN"){$(".status-header").css("width","16%");
$(".status").css("width","16%");
$(".notes").css("width","35%");
$(".notes-header").css("width","35%");
}MyDay.setCommentsLoadedFlag(false);
AmbulatoryWorklist.addTimeline();
if(_g("TABLE_MY_DAY")){var tabOuterContainer=$(".tabOuterContainer");
if(tabOuterContainer.width()>1200){var selectedArray=AmbulatoryWorklist.getSelectedResources();
if(selectedArray.length>1){var myDayContainer=_g("my-day-container-id");
var contentWidth=tabOuterContainer[0].offsetWidth-21;
myDayContainer.style.width=myDayContainer.parentNode.offsetWidth;
_g("TABLE_MY_DAY").style.width=contentWidth;
var buttonDiv=_g("timeline-button-id");
Util.Style.acss(buttonDiv,"hidden");
Util.Style.rcss(myDayContainer,"timeline-expanded");
var timelineDiv=_g("timeline-container-id");
Util.Style.acss(timelineDiv,"hidden");
if(timelineFirstLoadIndication){calReady(selectedArray[0][0],selectedArray[0][1],"timeline");
}}else{if(selectedArray.length>0){var myDayContainer=_g("my-day-container-id");
myDayContainer.style.width=myDayContainer.parentNode.offsetWidth-300;
_g("TABLE_MY_DAY").style.width=myDayContainer.offsetWidth-21;
Util.Style.rcss(myDayContainer,"timeline-expanded");
var buttonDiv=_g("timeline-button-id");
Util.Style.acss(buttonDiv,"hidden");
var timelineDiv=_g("timeline-container-id");
Util.Style.rcss(timelineDiv,"hidden");
Util.Style.acss(timelineDiv,"timeline-docked");
if(timelineFirstLoadIndication){calReady(selectedArray[0][0],selectedArray[0][1],"timeline");
}}}timelineFirstLoadIndication=false;
}else{_g("TABLE_MY_DAY").style.width=tabOuterContainer[0].offsetWidth-21;
}var apptTimeArr=MyDay.getTimeArr();
var apptIdArr=MyDay.getElementArr();
var currTime=new Date();
var pos;
var len=apptTimeArr.length;
for(var i=0;
i<len;
i++){if((currTime.getHours()*60+currTime.getMinutes())<=(apptTimeArr[i].getHours()*60+apptTimeArr[i].getMinutes())){pos=i;
break;
}}var scrollHeight=$(".table-layout-wrapper-table").height()*0.5-50;
var singleApptHeight=$("#"+apptIdArr[pos]).height();
var numOfApptToScroll=Math.floor(scrollHeight/singleApptHeight);
if(pos>numOfApptToScroll){pos=pos-numOfApptToScroll;
var topElementId=apptIdArr[pos];
document.getElementById(topElementId).scrollIntoView();
}MyDay.clearTimeArr();
MyDay.clearElementArr();
function resizeContainer(){if(resizeTimer){clearTimeout(resizeTimer);
}resizeTimer=setTimeout(resizeMyDay,100);
}function resizeMyDay(){if(_g("TABLE_MY_DAY")){var myDayContainer=_g("my-day-container-id");
var timelineDiv=_g("timeline-container-id");
var tabOuterContainer=$(".tabOuterContainer");
var contentWidth=tabOuterContainer[0].offsetWidth-21;
if(tabOuterContainer.width()>1200){if(Util.Style.ccss(timelineDiv,"timeline-disabled")){myDayContainer.style.width=myDayContainer.parentNode.offsetWidth;
_g("TABLE_MY_DAY").style.width=contentWidth;
Util.Style.acss(timelineDiv,"hidden");
}else{var newWidth;
if(myDayContainer.parentNode.offsetWidth-300<0){newWidth=0;
}else{newWidth=myDayContainer.parentNode.offsetWidth-300;
}myDayContainer.style.width=newWidth;
_g("TABLE_MY_DAY").style.width=contentWidth-300;
}if(!Util.Style.ccss(timelineDiv,"timeline-docked")){var buttonDiv=_g("timeline-button-id");
var arrowDiv=_g("timeline-arrow-id");
Util.Style.rcss(myDayContainer,"timeline-expanded");
Util.Style.rcss(buttonDiv,"button-expanded");
Util.Style.rcss(arrowDiv,"expanded");
Util.Style.acss(buttonDiv,"hidden");
if(!Util.Style.ccss(timelineDiv,"timeline-disabled")){Util.Style.rcss(timelineDiv,"hidden");
}Util.Style.acss(timelineDiv,"timeline-docked");
if(timelineFirstLoadIndication){var selectedArray=AmbulatoryWorklist.getSelectedResources();
calReady(selectedArray[0][0],selectedArray[0][1],"timeline");
timelineFirstLoadIndication=false;
}}}else{if(Util.Style.ccss(myDayContainer,"timeline-expanded")){var newWidth;
if(myDayContainer.parentNode.offsetWidth-300<0){newWidth=0;
}else{newWidth=myDayContainer.parentNode.offsetWidth-300;
}myDayContainer.style.width=newWidth;
}else{myDayContainer.style.width=myDayContainer.parentNode.offsetWidth;
}_g("TABLE_MY_DAY").style.width=contentWidth;
var buttonDiv=_g("timeline-button-id");
Util.Style.rcss(buttonDiv,"hidden");
if(Util.Style.ccss(timelineDiv,"timeline-docked")){Util.Style.rcss(buttonDiv,"button-expanded");
Util.Style.acss(timelineDiv,"hidden");
Util.Style.rcss(timelineDiv,"timeline-docked");
}}}}_g("my-day-container-id").parentNode.onresize=resizeContainer;
}MyDay.hoverController();
var autoRefreshEnabled=MyDay.getEnableAutoRefresh();
if(autoRefreshEnabled){MyDay.startAutoRefreshTimer();
}$(".appt-time-header.is-sortable-header.header").addClass("headerSortUp");
}$("#TABLE_MY_DAY").css("table-layout","fixed");
setTimeout(function(){MyDay.stopRenderTimer();
},10);
if(myDayRefreshTimer){setTimeout(function(){stopMyDayRefreshTimer();
},10);
}setTimeout(function(){stopMyDayButtonClickTimer();
},10);
setTimeout(function(){stopMyDayResourceChangeTimer();
},10);
setTimeout(function(){stopLoadTimer();
},10);
}var OpenItemsColumn=(function(){var defaultSortCSS;
var loadJsondataCnt=0;
var loadCnt=0;
var titleArr=[];
titleArr.push("<span class='heading-span'><span class='no-sort-status-ind-header'></span><span class='no-sort-patient-header'>",i18n.PATIENT,"</span><span class='appt-details-header'>",i18n.APPTDETAILS,"</span><span class='notes-header'>",i18n.NOTES,"</span><span class='outstanding-actions-header'>",i18n.OUTSTANDING_ACTIONS,"</span></span>");
return{meaning:"OPEN_ITEMS",title:titleArr.join(""),cssClass:"amb-schedule-headers",isDefaultSortable:true,isSortable:function(){return false;
},setSortCSS:function(sortCSS){defaultSortCSS=sortCSS;
},getDefaultSortOrder:function(){return 0;
},getCurrentSortSelection:function(node){var sortSelection=Util.Style.g(defaultSortCSS,node)[0];
if(sortSelection){return(sortSelection.innerHTML);
}else{return("");
}},load:function(parentTable,columnIndex,headerCellDOM,criterion){if(loadCnt==0){OpenItems.startLoadTimer();
loadCnt++;
}var cclParamArr=[];
cclParamArr.push("^MINE^,^",criterion.params,"^");
var cclParam=cclParamArr.join("");
cclParam=cclParam.replace(/"/g,"'");
AjaxHandler.ajax_request({request:{type:"XMLCCLREQUEST",target:"mp_amb_wklst_get_open_items",parameters:cclParam},response:{type:"JSON",target:this.loadJsonData,parameters:[parentTable,columnIndex]}});
},loadJsonData:function(jsonResponse){var parentTable=jsonResponse.parameters[0];
if(!parentTable||parentTable.innerHTML===""){return false;
}var columnIndex=jsonResponse.parameters[1],jsonData=jsonResponse.response.OPEN_ITEMS;
if(jsonData.CNT>0){TableLayout.insertColumnData({tableDOM:parentTable,columnIndex:columnIndex,JSONList:jsonData.QUAL,JSONRef:["OPEN_ITEM_CNT","NAME_DISPLAY","APPT_TYPE_DESC_DISPLAY","APPT_REASON_DISPLAY","OPEN_ITEM_CNT","DAYS_PAST_DUE_IND","BEG_DT_TM"],JSONRefCSS:["status-ind","patient","appt-details","notes","outstanding-actions","group-ind-hidden hidden","appt-time-hidden hidden"],JSONRowId:["ORG_APPT_ID","ORG_APPT_TYPE","PRIMARY_TAB"]});
}AmbulatoryWorklist.pushData("OPEN_ITEMS",jsonData.QUAL);
if(loadJsondataCnt==0){defaultSortCSS="appt-time-hidden";
OpenItems.setParentTable(parentTable);
OpenItems.setDocLink(jsonData.DOCUMENT_TAB_LINK);
OpenItems.setHPLink(jsonData.H_P_TAB_LINK);
OpenItems.setConsentLink(jsonData.CONSENT_TAB_LINK);
OpenItems.setPreopLink(jsonData.PREOP_ORDERS_TAB_LINK);
OpenItems.setOrderLink(jsonData.ORDER_TAB_LINK);
OpenItems.setTaskLink(jsonData.TASK_TAB_LINK);
OpenItems.setVisitChargeInd(jsonData.VISIT_CHARGE_IND);
OpenItems.setProviderNoteInd(jsonData.PROVIDER_VISIT_NOTE_IND);
OpenItems.setTaskListInd(jsonData.TASK_LIST_IND);
OpenItems.setHPInd(jsonData.H_AND_P_IND);
OpenItems.setConsentInd(jsonData.CONSENT_IND);
OpenItems.setPreopInd(jsonData.PREOP_IND);
OpenItems.setVisitSummaryInd(jsonData.VISIT_SUMMARY_IND);
OpenItems.setVisitSummaryFormId(jsonData.VISIT_SUMMARY_FORM_ID);
OpenItems.setManualSatisfyInd(jsonData.MANUAL_SATISFY_IND);
OpenItems.setVisitSummaryFormId(jsonData.VISIT_SUMMARY_FORM_ID);
OpenItems.setVisitSummaryStaticContentLocation(jsonData.VISIT_SUMM_STATIC_CONTENT_LOC);
OpenItems.setPositionCd(jsonData.POSITION_CD);
loadJsondataCnt++;
}MpageDriver.finishedLoading(this.meaning);
}};
}());
MpageDriver.register({column:OpenItemsColumn});
var OpenItems=function(){var timerOpenItemsLoad;
var timerOpenItemsRender;
var docLink="";
var orderLink="";
var taskLink="";
var hpLink="";
var consentLink="";
var preopLink="";
var visitChargeInd=0;
var providerNoteInd=0;
var taskListInd=0;
var visitSummaryInd=0;
var visitSummaryFormId=0;
var manualSatisfyInd=0;
var visitSummaryFormId=0;
var hpInd=0;
var consentInd=0;
var preopInd=0;
var visitSummStaticContentLoc="";
var positionCd=0;
var parentTable;
return{setParentTable:function(parTable){parentTable=parTable;
},getParentTable:function(){return parentTable;
},setHPLink:function(hpLinkString){hpLink=hpLinkString;
},getHPLink:function(){return hpLink;
},setConsentLink:function(consentLinkString){consentLink=consentLinkString;
},getConsentLink:function(){return consentLink;
},setPreopLink:function(preopLinkString){preopLink=preopLinkString;
},getPreopLink:function(){return preopLink;
},setDocLink:function(docLinkString){docLink=docLinkString;
},getDocLink:function(){return docLink;
},setOrderLink:function(orderLinkString){orderLink=orderLinkString;
},getOrderLink:function(){return orderLink;
},setTaskLink:function(taskLinkString){taskLink=taskLinkString;
},getTaskLink:function(){return taskLink;
},setVisitChargeInd:function(nVisitChargeIndicator){visitChargeInd=nVisitChargeIndicator;
},setHPInd:function(nHPIndicator){hpInd=nHPIndicator;
},setConsentInd:function(nConsentIndicator){consentInd=nConsentIndicator;
},setPreopInd:function(nPreopIndicator){preopInd=nPreopIndicator;
},setProviderNoteInd:function(nProviderNoteIndicator){providerNoteInd=nProviderNoteIndicator;
},setVisitSummaryInd:function(nVisitSummInd){visitSummaryInd=nVisitSummInd;
},getVisitSummaryInd:function(){return visitSummaryInd;
},setVisitSummaryFormId:function(powerformId){visitSummaryFormId=powerformId;
},getVisitChargeInd:function(){return visitChargeInd;
},getProviderNoteInd:function(){return providerNoteInd;
},setTaskListInd:function(nTaskListIndicator){taskListInd=nTaskListIndicator;
},setManualSatisfyInd:function(nManualSatisfyIndicator){manualSatisfyInd=nManualSatisfyIndicator;
},getManualSatisfyInd:function(){return manualSatisfyInd;
},setVisitSummaryStaticContentLocation:function(staticContentLoc){visitSummStaticContentLoc=staticContentLoc;
},setPositionCd:function(positionCode){positionCd=positionCode;
},startLoadTimer:function(){timerOpenItemsLoad=createSLATimer("USR:MPG.Amb_Org_load - build columns(OPEN_ITEMS)",VERSIONSTR);
},startRenderTimer:function(){timerOpenItemsRender=createSLATimer("USR:MPG.Amb_Org_load - edit rows(OPEN_ITEMS)",VERSIONSTR);
},stopLoadTimer:function(){if(timerOpenItemsLoad!=null){timerOpenItemsLoad.Stop();
}},stopRenderTimer:function(){if(timerOpenItemsRender!=null){timerOpenItemsRender.Stop();
}},setVisitSummaryFormId:function(powerformId){visitSummaryFormId=powerformId;
},genOutActionsHTML:function(rowData,ordersPref,notesPref,taskPref,summaryPref,hpPref,consentPref,preopPref){var manSatInd=OpenItems.getManualSatisfyInd();
var hpLinkString=hpLink;
var consentLinkString=consentLink;
var preopLinkString=preopLink;
rowData.OPEN_ITEM_CNT=0;
if(rowData.ORG_APPT_TYPE==APPT_TYPE_AMB){if(notesPref=="Y"||ordersPref=="Y"||taskPref=="Y"){if(notesPref=="Y"&&rowData.PHYSICIAN_NOTE_COMPLETED=="N"){rowData.OPEN_ITEM_CNT=rowData.OPEN_ITEM_CNT+1;
}if(ordersPref=="Y"&&rowData.BILLING_ORDER_PRESENT=="N"){rowData.OPEN_ITEM_CNT=rowData.OPEN_ITEM_CNT+1;
}if(taskPref=="Y"&&rowData.TASK_LIST_COMPLETED=="N"){rowData.OPEN_ITEM_CNT=rowData.OPEN_ITEM_CNT+1;
}if(summaryPref=="Y"&&rowData.VISIT_SUMMARY_COMPLETED=="N"&&rowData.DECLINE_POWERFORM_COMPLETED=="N"){rowData.OPEN_ITEM_CNT=rowData.OPEN_ITEM_CNT+1;
}}}else{if(rowData.ORG_APPT_TYPE==APPT_TYPE_SURG){if(hpPref=="Y"||consentPref=="Y"||preopPref=="Y"){if(hpPref=="Y"&&rowData.H_P_COMPLETED=="N"){rowData.OPEN_ITEM_CNT=rowData.OPEN_ITEM_CNT+1;
}if(consentPref=="Y"&&rowData.CONSENT_COMPLETED=="N"){rowData.OPEN_ITEM_CNT=rowData.OPEN_ITEM_CNT+1;
}if(preopPref=="Y"&&rowData.PREOP_ORDER_COMPLETE=="N"){rowData.OPEN_ITEM_CNT=rowData.OPEN_ITEM_CNT+1;
}}}}var outActionsArr=[];
if(rowData.ORG_APPT_TYPE==APPT_TYPE_AMB){outActionsArr.push("<span class='orderTag");
if(ordersPref=="N"){outActionsArr.push(" hidden");
}outActionsArr.push("'>");
if(visitChargeInd==1){if(rowData.BILLING_ORDER_PRESENT!="Y"){outActionsArr.push("<a class='item-link'");
if(manSatInd==1){outActionsArr.push(" onmouseover='AmbulatoryWorklist.openItemTagHover(this)' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
}if(orderLink!==""){if(orderLink.indexOf("+")==-1){orderLink=orderLink+"+";
}}outActionsArr.push(' href=\'javascript:APPLINK(0,"powerchart.exe","/PERSONID=',rowData.PERSON_ID," /ENCNTRID=",rowData.ENCNTR_ID," /FIRSTTAB=^",orderLink,"^\");'");
outActionsArr.push("><img class='open-item-icon' src='../img/order.png' >  ");
if(manSatInd==1){outActionsArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='order' value='1'>");
}outActionsArr.push(i18n.ORDER_NOT_STARTED,"</a>");
}else{outActionsArr.push("<span class='complete-billing completed-item'");
if(rowData.ORDER_MANUAL_IND==0){outActionsArr.push(" onmouseover='AmbulatoryWorklist.billingHover(this);' onmouseout='AmbulatoryWorklist.clearHoverTimer();'>");
}else{outActionsArr.push(" onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='order' value='1'>");
}outActionsArr.push("<img class='open-item-icon' src='../img/order_dithered.png' > ",i18n.ORDER_COMPLETED,"</span>");
}outActionsArr.push("<br/>");
}outActionsArr.push("</span><span class='noteTag");
if(notesPref=="N"){outActionsArr.push(" hidden");
}outActionsArr.push("'>");
if(providerNoteInd==1){if(rowData.PHYSICIAN_NOTE_EVENT_ID==0){if(rowData.NOTE_MANUAL_IND==1){if(rowData.PHYSICIAN_NOTE_COMPLETED_BY_RESIDENT=="Y"){outActionsArr.push(AmbulatoryWorklist.manuallySatisfyResidentNote(rowData,docLink));
}else{outActionsArr.push("<span class='completed-item' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
outActionsArr.push("><img class='open-item-icon' src='../img/note_dithered.png' ><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='note' value='1'> ");
outActionsArr.push(i18n.NOTE_COMPLETED,"</span>");
}}else{outActionsArr.push("<a class='item-link'");
if(manSatInd==1){outActionsArr.push(" onmouseover='AmbulatoryWorklist.openItemTagHover(this)' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
}if(docLink!==""){if(docLink.indexOf("+")==-1){docLink=docLink+"+";
}}outActionsArr.push(' href=\'javascript:APPLINK(0,"powerchart.exe","/PERSONID=',rowData.PERSON_ID," /ENCNTRID=",rowData.ENCNTR_ID," /FIRSTTAB=^",docLink,"^\");'");
outActionsArr.push("><img class='open-item-icon' src='../img/note.png' >  ");
if(manSatInd==1){outActionsArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='note' value='1'>");
}outActionsArr.push(i18n.NOTE_NOT_STARTED,"</a>");
}}else{if(rowData.PHYSICIAN_NOTE_COMPLETED_BY_RESIDENT=="Y"){if(rowData.PHYSICIAN_NOTE_COMPLETED=="N"){outActionsArr.push("<img class='open-item-icon' src='../img/note.png' >",CreateClinNoteLink(rowData.PERSON_ID,rowData.ENCNTR_ID,rowData.PHYSICIAN_NOTE_EVENT_ID,"   "+AmbulatoryWorklist.getResidentNoteStatus(rowData)+"","DOC",rowData.PHYSICIAN_NOTE_EVENT_ID));
}else{if(rowData.PHYSICIAN_NOTE_COMPLETED=="Y"){outActionsArr.push("<span class='completed-item'>",CreateClinNoteLink(rowData.PERSON_ID,rowData.ENCNTR_ID,rowData.PHYSICIAN_NOTE_EVENT_ID,"<img class='open-item-icon' src='../img/note_dithered.png' >  "+AmbulatoryWorklist.getResidentNoteStatus(rowData)+"","DOC",rowData.PHYSICIAN_NOTE_EVENT_ID),"</span>");
}}}else{if(rowData.PHYSICIAN_NOTE_COMPLETED=="Y"){outActionsArr.push("<span class='completed-item'>",CreateClinNoteLink(rowData.PERSON_ID,rowData.ENCNTR_ID,rowData.PHYSICIAN_NOTE_EVENT_ID,"<img class='open-item-icon' src='../img/note_dithered.png' >   "+i18n.NOTE_COMPLETED+"","DOC",rowData.PHYSICIAN_NOTE_EVENT_ID),"</span>");
}else{outActionsArr.push("<img class='open-item-icon' src='../img/note.png' >",CreateClinNoteLink(rowData.PERSON_ID,rowData.ENCNTR_ID,rowData.PHYSICIAN_NOTE_EVENT_ID,"   "+i18n.NOTE_SAVED+"","DOC",rowData.PHYSICIAN_NOTE_EVENT_ID));
}}}outActionsArr.push("<br/>");
}outActionsArr.push("</span>");
outActionsArr.push("<span class='taskTag");
if(taskPref=="N"){outActionsArr.push(" hidden");
}outActionsArr.push("'>");
if(taskListInd==1){if(taskLink!==""){if(taskLink.indexOf("+")==-1){taskLink=taskLink+"+";
}}if(rowData.TASK_LIST_COMPLETED!="Y"){outActionsArr.push("<a class='item-link'");
if(manSatInd==1){outActionsArr.push(" onmouseover='AmbulatoryWorklist.openItemTagHover(this)' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
}outActionsArr.push(' href=\'javascript:APPLINK(0,"powerchart.exe","/PERSONID=',rowData.PERSON_ID," /ENCNTRID=",rowData.ENCNTR_ID," /FIRSTTAB=^",taskLink,"^\");'","><img class='open-item-icon' src='../img/task.png'>");
if(manSatInd==1){outActionsArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='task' value='1'> ");
}outActionsArr.push(i18n.TASK_LIST_NOT_COMPLETE,"</a>");
}else{outActionsArr.push("<span class='completed-item'");
if(rowData.TASK_LIST_MANUAL_IND==1){outActionsArr.push("onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'><img class='open-item-icon' src='../img/task_dithered.png' ><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='task' value='1'> ",i18n.TASK_LIST_COMPLETE,"</span>");
}else{outActionsArr.push('><a href=\'javascript:APPLINK(0,"powerchart.exe","/PERSONID=',rowData.PERSON_ID," /ENCNTRID=",rowData.ENCNTR_ID," /FIRSTTAB=^",taskLink,"^\");'","><img class='open-item-icon' src='../img/task_dithered.png' > ",i18n.TASK_LIST_COMPLETE,"</a></span>");
}}outActionsArr.push("<br/>");
}outActionsArr.push("</span><span class='visitSummTag");
if(summaryPref=="N"){outActionsArr.push(" hidden");
}outActionsArr.push("'>");
if(visitSummaryInd==1){if(rowData.VISIT_SUMMARY_COMPLETED=="Y"){outActionsArr.push("<span class='completed-item'><img class='open-item-icon' src='../img/VisitSummaryIcon_Complete.png' > ",i18n.VISIT_SUMM_COMPLETE,"</span>");
}else{if(rowData.DECLINE_POWERFORM_COMPLETED=="Y"){outActionsArr.push("<span class='completed-item'><img class='open-item-icon' src='../img/VisitSummaryIcon_Complete.png' > ",i18n.VISIT_SUMM_DECLINE_COMPLETE,"</span>");
}else{outActionsArr.push("<img class='open-item-icon' src='../img/VisitSummaryIcon_Incomplete.png'>");
outActionsArr.push("<span class='visit-summary-wrapper'><ul class='visit-summ-actions-ul'><li class='visit-summ-actions-li'>");
var criterion=MpageDriver.getCriterion();
var link='javscript:CCLLINK("mp_clinical_summary_driver", "^MINE^, '+rowData.PERSON_ID+".0,"+rowData.ENCNTR_ID+".0,"+criterion.personnel_id+".0,"+positionCd+".0,"+rowData.PPR_CD+".0,^powerchart.exe^, ^"+visitSummStaticContentLoc+"^, ^MP_CLIN_SUM^,8,"+rowData.SCH_EVENT_ID+'.0",0)';
outActionsArr.push("<a href='javascript:CCLNEWSESSIONWINDOW(%22",link,'%22,"_blank","height=800,width=800",0,1)\'>');
outActionsArr.push(i18n.VISIT_SUMM_START,"</a></li><li class='visit-summ-actions-li'>");
if(!visitSummaryFormId>0){outActionsArr.push('<a href=\'javascript:APPLINK(0,"powerchart.exe","/PERSONID=',rowData.PERSON_ID," /ENCNTRID=",rowData.ENCNTR_ID," /FIRSTTAB=^^\");'>");
}else{outActionsArr.push('<a href=\'javascript:MPAGES_EVENT("POWERFORM","',rowData.PERSON_ID,"|",rowData.ENCNTR_ID,"|",visitSummaryFormId,"|0|0\")'>");
}outActionsArr.push(i18n.VISIT_SUMM_DECLINE,"</a></li></ul><span class='visit-summary'>",i18n.VISIT_SUMM_NOT_STARTED,"</span></span>");
}}}outActionsArr.push("</span>");
}else{if(rowData.ORG_APPT_TYPE==APPT_TYPE_SURG){outActionsArr.push("<span class='hp-tag");
if(hpPref=="N"){outActionsArr.push(" hidden");
}outActionsArr.push("'>");
if(hpInd==1){if(rowData.H_P_EVENT_ID==0){if(rowData.HP_MANUAL_IND==1){outActionsArr.push("<span class='completed-item' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
outActionsArr.push("><img class='open-item-icon' src='../img/note_dithered.png' ><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='hp' value='1'> ");
outActionsArr.push(i18n.HP_COMPLETED,"</span>");
}else{outActionsArr.push("<a class='item-link'");
if(manSatInd==1){outActionsArr.push(" onmouseover='AmbulatoryWorklist.openItemTagHover(this)' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
}if(hpLinkString!==""){if(hpLinkString.indexOf("+")==-1){hpLinkString=hpLinkString+"+";
}}outActionsArr.push(' href=\'javascript:APPLINK(0,"powerchart.exe","/PERSONID=',rowData.PERSON_ID," /ENCNTRID=",rowData.ENCNTR_ID," /FIRSTTAB=^",hpLinkString,"^\");'");
outActionsArr.push("><img class='open-item-icon' src='../img/note.png' >  ");
if(manSatInd==1){outActionsArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='hp' value='1'>");
}outActionsArr.push(i18n.HP_NOT_STARTED,"</a>");
}}else{if(rowData.H_P_COMPLETED=="Y"){outActionsArr.push("<span class='completed-item'>",CreateClinNoteLink(rowData.PERSON_ID,rowData.ENCNTR_ID,rowData.H_P_EVENT_ID,"<img class='open-item-icon' src='../img/note_dithered.png' >   "+i18n.HP_COMPLETED+"","DOC",rowData.H_P_EVENT_ID),"</span>");
}else{outActionsArr.push("<img class='open-item-icon' src='../img/note.png' >",CreateClinNoteLink(rowData.PERSON_ID,rowData.ENCNTR_ID,rowData.H_P_EVENT_ID,"   "+i18n.HP_SAVED+"","DOC",rowData.H_P_EVENT_ID));
}}outActionsArr.push("<br/>");
}outActionsArr.push("</span><span class='consent-tag");
if(consentPref=="N"){outActionsArr.push(" hidden");
}outActionsArr.push("'>");
if(consentInd==1){if(rowData.CONSENT_EVENT_ID==0){if(rowData.CONSENT_MANUAL_IND==1){outActionsArr.push("<span class='completed-item' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
outActionsArr.push("><img class='open-item-icon' src='../img/note_dithered.png' ><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='consent' value='1'> ");
outActionsArr.push(i18n.CONSENT_COMPLETED,"</span>");
}else{outActionsArr.push("<a class='item-link'");
if(manSatInd==1){outActionsArr.push(" onmouseover='AmbulatoryWorklist.openItemTagHover(this)' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
}if(consentLinkString!==""){if(consentLinkString.indexOf("+")==-1){consentLinkString=consentLinkString+"+";
}}outActionsArr.push(' href=\'javascript:APPLINK(0,"powerchart.exe","/PERSONID=',rowData.PERSON_ID," /ENCNTRID=",rowData.ENCNTR_ID," /FIRSTTAB=^",consentLinkString,"^\");'");
outActionsArr.push("><img class='open-item-icon' src='../img/note.png' >  ");
if(manSatInd==1){outActionsArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='consent' value='1'>");
}outActionsArr.push(i18n.CONSENT_NOT_STARTED,"</a>");
}}else{if(rowData.CONSENT_COMPLETED=="Y"){outActionsArr.push("<span class='completed-item'>",CreateClinNoteLink(rowData.PERSON_ID,rowData.ENCNTR_ID,rowData.CONSENT_EVENT_ID,"<img class='open-item-icon' src='../img/note_dithered.png' >   "+i18n.CONSENT_COMPLETED+"","DOC",rowData.CONSENT_EVENT_ID),"</span>");
}else{outActionsArr.push("<img class='open-item-icon' src='../img/note.png' >",CreateClinNoteLink(rowData.PERSON_ID,rowData.ENCNTR_ID,rowData.CONSENT_EVENT_ID,"   "+i18n.CONSENT_SAVED+"","DOC",rowData.CONSENT_EVENT_ID));
}}outActionsArr.push("<br/>");
}outActionsArr.push("</span><span class='preop-tag");
if(preopPref=="N"){outActionsArr.push(" hidden");
}outActionsArr.push("'>");
if(preopInd==1){if(rowData.PREOP_ORDER_COMPLETE!="Y"){outActionsArr.push("<a class='item-link'");
if(manSatInd==1){outActionsArr.push(" onmouseover='AmbulatoryWorklist.openItemTagHover(this)' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
}if(preopLinkString!==""){if(preopLinkString.indexOf("+")==-1){preopLinkString=preopLinkString+"+";
}}outActionsArr.push(' href=\'javascript:APPLINK(0,"powerchart.exe","/PERSONID=',rowData.PERSON_ID," /ENCNTRID=",rowData.ENCNTR_ID," /FIRSTTAB=^",preopLinkString,"^\");'");
outActionsArr.push("><img class='open-item-icon' src='../img/order.png' >  ");
if(manSatInd==1){outActionsArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='preop' value='1'>");
}outActionsArr.push(i18n.PREOP_ORDER_NOT_STARTED,"</a>");
}else{outActionsArr.push("<span class='complete-billing completed-item'");
if(rowData.PREOP_MANUAL_IND==0){outActionsArr.push(" onmouseover='AmbulatoryWorklist.billingHover(this);' onmouseout='AmbulatoryWorklist.clearHoverTimer();'>");
}else{outActionsArr.push(" onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='preop' value='1'>");
}outActionsArr.push("<img class='open-item-icon' src='../img/order_dithered.png' > ",i18n.PREOP_ORDER_COMPLETE,"</span>");
}outActionsArr.push("<br/>");
}outActionsArr.push("</span>");
}}return outActionsArr.join("");
},getApptFromJsonData:function(jsonData,org_appt_id,org_appt_type){var l=jsonData.length;
var dataFound=false;
for(var i=0;
i<l;
i++){if(jsonData[i].ORG_APPT_ID==org_appt_id&&jsonData[i].ORG_APPT_TYPE==org_appt_type){dataFound=true;
return jsonData[i];
}}if(!dataFound){AjaxHandler.append_text("Appointment data not found<br/>org appt id = "+org_appt_id+"<br/>org appt type = "+org_appt_type);
}},editRows:function(jsonData){var tableBody=_g("TBODY_OPEN_ITEMS");
var tabs=AmbulatoryWorklist.getTabsElement();
var patientRows=_gbt("tr",tableBody);
var arrLength=patientRows.length;
var rowShowingCnt=arrLength;
var rowData;
var userPrefMenu=AmbulatoryWorklist.getUserPrefList();
var notesPref=(providerNoteInd==1)?userPrefMenu.NOTES_IND:"N";
var ordersPref=(visitChargeInd==1)?userPrefMenu.ORDERS_IND:"N";
var taskPref=(taskListInd==1)?userPrefMenu.TASK_IND:"N";
var summaryPref=(visitSummaryInd==1)?userPrefMenu.SUMMARY_IND:"N";
var hpPref=(hpInd==1)?userPrefMenu.HP_IND:"N";
var consentPref=(consentInd==1)?userPrefMenu.CONSENT_IND:"N";
var preopPref=(preopInd==1)?userPrefMenu.PREOP_IND:"N";
var currGroupInd=4;
var heading="";
var groupInd=0;
var moreThan2Cnt=0;
var twoDaysCnt=0;
var yesterdayCnt=0;
var todayCnt=0;
var moreThan2daysRow;
var twoDaysRow;
var yesterdayRow;
var todayRow;
for(var i=0;
i<arrLength;
i++){rowData=OpenItems.getApptFromJsonData(jsonData,AmbulatoryWorklist.getOrgApptIdFromParentRow(patientRows[i]),AmbulatoryWorklist.getOrgApptTypeFromParentRow(patientRows[i]));
var statusIndCell=Util.Style.g("status-ind",patientRows[i],"span")[0];
var patCell=Util.Style.g("patient",patientRows[i],"span")[0];
var apptDetailsCell=Util.Style.g("appt-details",patientRows[i],"span")[0];
var notesCell=Util.Style.g("notes",patientRows[i],"span")[0];
var outActionsCell=Util.Style.g("outstanding-actions",patientRows[i],"span")[0];
var groupIndHiddenCell=Util.Style.g("group-ind-hidden hidden",patientRows[i],"span")[0];
var patientRowTD=Util.Style.g("table-layout-table-td",patientRows[i],"td")[0];
if(outActionsCell){outActionsHTML=OpenItems.genOutActionsHTML(rowData,ordersPref,notesPref,taskPref,summaryPref,hpPref,consentPref,preopPref);
outActionsCell.innerHTML=outActionsHTML;
}else{outActionsCell=Util.cep("span",{className:"outstanding-actions"});
patientRowTD.insertBefore(outActionsCell,groupIndHiddenCell);
}if(notesCell){apptNotesHTML=OpenItems.apptNotesColGenHTML(rowData);
notesCell.innerHTML=apptNotesHTML;
}else{notesCell=Util.cep("span",{className:"notes"});
patientRowTD.insertBefore(notesCell,outActionsCell);
}if(apptDetailsCell){apptDetailsHTML=AmbulatoryWorklist.apptDetailsColGenHTML(rowData);
apptDetailsCell.innerHTML=apptDetailsHTML;
}else{apptDetailsCell=Util.cep("span",{className:"appt-details"});
patientRowTD.insertBefore(apptDetailsCell,notesCell);
}if(patCell){patInfoHTML=AmbulatoryWorklist.patInfoColGenHTML(rowData);
patCell.innerHTML=patInfoHTML;
}else{patCell=Util.cep("span",{className:"patient"});
patientRowTD.insertBefore(patCell,apptDetailsCell);
}if(!statusIndCell){statusIndCell=Util.cep("span",{className:"status-ind"});
patientRowTD.insertBefore(statusIndCell,patCell);
}statusIndCell.innerHTML="<div class='color-ind'><div class='open-items-light'></div></div>";
Util.Style.acss(statusIndCell,"open-items");
Util.Style.acss(patientRows[i],"appointment-row checked-out-row open-items");
if(rowData.ORG_APPT_TYPE==APPT_TYPE_AMB){if(!((notesPref=="Y"&&rowData.PHYSICIAN_NOTE_COMPLETED=="N")||(ordersPref=="Y"&&rowData.BILLING_ORDER_PRESENT=="N")||(taskPref=="Y"&&rowData.TASK_LIST_COMPLETED=="N")||(summaryPref=="Y"&&rowData.VISIT_SUMMARY_COMPLETED=="N"&&rowData.DECLINE_POWERFORM_COMPLETED=="N"))){Util.Style.acss(patientRows[i],"hidden");
rowShowingCnt--;
}}else{if(rowData.ORG_APPT_TYPE==APPT_TYPE_SURG){if(!((hpPref=="Y"&&rowData.H_P_COMPLETED=="N")||(consentPref=="Y"&&rowData.CONSENT_COMPLETED=="N")||(preopPref=="Y"&&rowData.PREOP_ORDER_COMPLETE=="N"))){Util.Style.acss(patientRows[i],"hidden");
rowShowingCnt--;
}}}if(!Util.Style.ccss(patientRows[i],"hidden")){groupInd=rowData.DAYS_PAST_DUE_IND;
if(groupInd==3){moreThan2Cnt++;
}else{if(groupInd==2){twoDaysCnt++;
}else{if(groupInd==1){yesterdayCnt++;
}else{if(groupInd==0){todayCnt++;
}}}}if(groupInd<currGroupInd){currGroupInd=groupInd;
if(currGroupInd==3){heading=i18n.MORE_THAN_2_DAYS_AGO;
}else{if(currGroupInd==2){heading=i18n.TWO_DAYS_AGO;
}else{if(currGroupInd==1){heading=i18n.YESTERDAY;
}else{heading=i18n.TODAY;
}}}var rowBreak=Util.cep("tr",{id:"_0.00",colspan:"1",className:"break-row"});
rowBreak.appendChild(Util.cep("td",{"class":"table-layout-table-td brdr",innerHTML:heading+" ("}));
tableBody.insertBefore(rowBreak,patientRows[i]);
if(groupInd==3){moreThan2daysRow=rowBreak;
}else{if(groupInd==2){twoDaysRow=rowBreak;
}else{if(groupInd==1){yesterdayRow=rowBreak;
}else{if(groupInd==0){todayRow=rowBreak;
}}}}i++;
arrLength++;
}}}if(moreThan2daysRow){Util.gc(moreThan2daysRow,0).innerHTML+=moreThan2Cnt+")";
}if(twoDaysRow){Util.gc(twoDaysRow,0).innerHTML+=twoDaysCnt+")";
}if(yesterdayRow){Util.gc(yesterdayRow,0).innerHTML+=yesterdayCnt+")";
}if(todayRow){Util.gc(todayRow,0).innerHTML+=todayCnt+")";
}Util.gc(_g("open-items-seg-cntrl-id"),1).innerHTML=""+i18n.OPEN_ITEMS+" ("+(moreThan2Cnt+twoDaysCnt+yesterdayCnt+todayCnt)+")";
Util.Style.g("sec-total",Util.gc(tabs,2))[0].innerHTML=" ("+(moreThan2Cnt+twoDaysCnt+yesterdayCnt+todayCnt)+")";
var undo=AmbulatoryWorklist.getUndoData();
var prefIndArray=[];
AmbulatoryWorklist.CreatePageMenu();
prefIndArray.push(providerNoteInd,visitChargeInd,taskListInd,visitSummaryInd,hpInd,consentInd,preopInd,undo.UNDO_IND);
AmbulatoryWorklist.setUserPrefMenu(prefIndArray);
openItemsApptFlag=true;
gblproviderNoteInd=providerNoteInd;
gblvisitChargeInd=visitChargeInd;
gbltaskListInd=taskListInd;
gblvisitSummaryInd=visitSummaryInd;
gblhpInd=hpInd;
gblconsentInd=consentInd;
gblpreopInd=preopInd;
var countStrArr=[];
countStrArr.push("(",rowShowingCnt,")");
var countStr=countStrArr.join("");
var buttonStrArr=[];
buttonStrArr.push(i18n.OPEN_ITEMS," ",countStr);
Util.gc(_g("open-items-seg-cntrl-id"),1).innerHTML=buttonStrArr.join("");
Util.Style.g("sec-total",Util.gc(tabs,2))[0].innerHTML=countStr;
},insertRowBreak:function(){var tableBody=_g("TBODY_OPEN_ITEMS");
var openItemsRows=_gbt("tr",tableBody);
var currGroupInd=4;
var heading="";
var groupInd=0;
var moreThan2Cnt=0;
var twoDaysCnt=0;
var yesterdayCnt=0;
var todayCnt=0;
var moreThan2daysRow;
var twoDaysRow;
var yesterdayRow;
var todayRow;
var tabs=AmbulatoryWorklist.getTabsElement();
var l=openItemsRows.length;
for(var i=0;
i<l;
i++){if(!Util.Style.ccss(openItemsRows[i],"hidden")){groupInd=Util.Style.g("group-ind-hidden",openItemsRows[i],"span")[0].innerHTML;
if(groupInd==3){moreThan2Cnt++;
}else{if(groupInd==2){twoDaysCnt++;
}else{if(groupInd==1){yesterdayCnt++;
}else{if(groupInd==0){todayCnt++;
}}}}if(groupInd<currGroupInd){currGroupInd=groupInd;
if(currGroupInd==3){heading=i18n.MORE_THAN_2_DAYS_AGO;
}else{if(currGroupInd==2){heading=i18n.TWO_DAYS_AGO;
}else{if(currGroupInd==1){heading=i18n.YESTERDAY;
}else{heading=i18n.TODAY;
}}}var rowBreak=Util.cep("tr",{id:"_0.00",colspan:"1",className:"break-row"});
rowBreak.appendChild(Util.cep("td",{"class":"table-layout-table-td brdr",innerHTML:heading+" ("}));
tableBody.insertBefore(rowBreak,openItemsRows[i]);
if(groupInd==3){moreThan2daysRow=rowBreak;
}else{if(groupInd==2){twoDaysRow=rowBreak;
}else{if(groupInd==1){yesterdayRow=rowBreak;
}else{if(groupInd==0){todayRow=rowBreak;
}}}}i++;
l++;
}}}if(moreThan2daysRow){Util.gc(moreThan2daysRow,0).innerHTML+=moreThan2Cnt+")";
}if(twoDaysRow){Util.gc(twoDaysRow,0).innerHTML+=twoDaysCnt+")";
}if(yesterdayRow){Util.gc(yesterdayRow,0).innerHTML+=yesterdayCnt+")";
}if(todayRow){Util.gc(todayRow,0).innerHTML+=todayCnt+")";
}Util.gc(_g("open-items-seg-cntrl-id"),1).innerHTML=""+i18n.OPEN_ITEMS+" ("+(moreThan2Cnt+twoDaysCnt+yesterdayCnt+todayCnt)+")";
Util.Style.g("sec-total",Util.gc(tabs,2))[0].innerHTML=" ("+(moreThan2Cnt+twoDaysCnt+yesterdayCnt+todayCnt)+")";
},modifyVisibilityOpenItems:function(itemTypes,prefs,patientRow,jsonData){for(var j=0;
j<itemTypes.length;
j++){var statusInd=Util.Style.g("outstanding-actions",patientRow,"span")[0];
var rowData=OpenItems.getApptFromJsonData(jsonData,AmbulatoryWorklist.getOrgApptIdFromParentRow(patientRow),AmbulatoryWorklist.getOrgApptTypeFromParentRow(patientRow));
var nodeType=Util.Style.g(itemTypes[j],statusInd,"span")[0];
if(!(nodeType==null)){if(prefs[j]=="N"){Util.Style.acss(nodeType,"hidden");
OpenItems.modifyRow(rowData,patientRow);
}else{Util.Style.rcss(nodeType,"hidden");
OpenItems.modifyRow(rowData,patientRow);
}}}},modifyRow:function(rowData,patientRow){var userPrefMenu=AmbulatoryWorklist.getUserPrefList();
if(rowData.ORG_APPT_TYPE==APPT_TYPE_AMB){rowData.OPEN_ITEM_CNT=(userPrefMenu.NOTES_IND=="Y"&&rowData.PHYSICIAN_NOTE_COMPLETED=="N")+(userPrefMenu.ORDERS_IND=="Y"&&rowData.BILLING_ORDER_PRESENT=="N")+(userPrefMenu.TASK_IND=="Y"&&rowData.TASK_LIST_COMPLETED=="N")+(userPrefMenu.SUMMARY_IND=="Y"&&rowData.VISIT_SUMMARY_COMPLETED=="N"&&rowData.DECLINE_POWERFORM_COMPLETED=="N");
}else{if(rowData.ORG_APPT_TYPE==APPT_TYPE_SURG){rowData.OPEN_ITEM_CNT=(userPrefMenu.HP_IND=="Y"&&rowData.H_P_COMPLETED=="N")+(userPrefMenu.CONSENT_IND=="Y"&&rowData.CONSENT_COMPLETED=="N")+(userPrefMenu.PREOP_IND=="Y"&&rowData.PREOP_ORDER_COMPLETE=="N");
}}if(rowData.OPEN_ITEM_CNT>0){Util.Style.rcss(patientRow,"hidden");
}else{Util.Style.acss(patientRow,"hidden");
}},updateSectionTotals:function(tabs){var userPrefMenu=AmbulatoryWorklist.getUserPrefList();
if(userPrefMenu.NOTES_IND=="N"&&userPrefMenu.ORDERS_IND=="N"&&userPrefMenu.TASK_IND=="N"&&userPrefMenu.SUMMARY_IND=="N"&&userPrefMenu.HP_IND=="N"&&userPrefMenu.CONSENT_IND=="N"&&userPrefMenu.PREOP_IND=="N"){Util.gc(_g("open-items-seg-cntrl-id"),1).innerHTML=i18n.OPEN_ITEMS+" (0)";
Util.Style.g("sec-total",Util.gc(tabs,2))[0].innerHTML="(0)";
}else{Util.gc(_g("open-items-seg-cntrl-id"),1).innerHTML=i18n.OPEN_ITEMS+" "+Util.Style.g("sec-total",Util.gc(tabs,2))[0].innerHTML;
}},apptNotesColGenHTML:function(rowData){var notesHtmlArr=[];
notesHtmlArr.push("<div class='notes-container'>");
if(rowData.APPT_REASON){notesHtmlArr.push("<div class='notes-div' onmouseover='AmbulatoryWorklist.apptDetailsHover(this);' onmouseout='AmbulatoryWorklist.clearHoverTimer();'><span class='main-detail'><span class='sub-detail'>",i18n.REASON,": </span>",rowData.APPT_REASON,"</span></div>");
}if(rowData.CHIEF_COMPLAINT){notesHtmlArr.push("<div class='notes-div' onmouseover='AmbulatoryWorklist.apptDetailsHover(this);' onmouseout='AmbulatoryWorklist.clearHoverTimer();'><span class='main-detail'><span class='sub-detail'>",i18n.CHIEF_COMPLAINT,": </span>",rowData.CHIEF_COMPLAINT,"</span></div>");
}notesHtmlArr.push("</div>");
return notesHtmlArr.join("");
}};
}();
function tabFinLoadOpenItems(){setTimeout(function(){OpenItems.stopLoadTimer();
},10);
OpenItems.startRenderTimer();
if(openItemsResourceChangeTimer==null&&openItemsButtonClickTimer==null){startOpenItemsRefreshTimer();
}if(_g("TBODY_OPEN_ITEMS")){var worklistData=AmbulatoryWorklist.getData();
OpenItems.editRows(worklistData.OPEN_ITEMS);
$(".visit-summary-wrapper").mouseover(function(){Util.Style.acss(this.parentNode,"expand");
});
$(".visit-summary-wrapper").mouseout(function(){Util.Style.rcss(this.parentNode,"expand");
});
}$("#TABLE_OPEN_ITEMS").css("table-layout","fixed");
setTimeout(function(){OpenItems.stopRenderTimer();
},10);
if(openItemsRefreshTimer){setTimeout(function(){stopOpenItemsRefreshTimer();
},10);
}setTimeout(function(){stopOpenItemsButtonClickTimer();
},10);
setTimeout(function(){stopOpenItemsResourceChangeTimer();
},10);
setTimeout(function(){stopLoadTimer();
},10);
}var UpcomingColumn=(function(){var defaultSortCSS;
var loadJsondataCnt=0;
var loadCnt=0;
var titleArr=[];
titleArr.push("<span class='heading-span'><span class='no-sort-status-ind-header'></span><span class='no-sort-patient-header'>",i18n.PATIENT,"</span><span class='appt-details-header'>",i18n.APPTDETAILS,"</span><span class='notes-header'>",i18n.NOTES,"</span><span class='outstanding-actions-header'>",i18n.OUTSTANDING_ACTIONS,"</span></span>");
return{meaning:"UPCOMING",title:titleArr.join(""),cssClass:"amb-schedule-headers",isDefaultSortable:true,isSortable:function(){return false;
},setSortCSS:function(sortCSS){defaultSortCSS=sortCSS;
},getDefaultSortOrder:function(){return 0;
},getCurrentSortSelection:function(node){var sortSelection=Util.Style.g(defaultSortCSS,node)[0];
if(sortSelection){return(sortSelection.innerHTML);
}else{return("");
}},load:function(parentTable,columnIndex,headerCellDOM,criterion){if(loadCnt==0){UpcomingItems.startLoadTimer();
loadCnt++;
}var cclParamArr=[];
cclParamArr.push("^MINE^,^",criterion.params,"^");
var cclParam=cclParamArr.join("");
cclParam=cclParam.replace(/"/g,"'");
AjaxHandler.ajax_request({request:{type:"XMLCCLREQUEST",target:"mp_amb_get_upcoming_data",parameters:cclParam},response:{type:"JSON",target:this.loadJsonData,parameters:[parentTable,columnIndex]}});
},loadJsonData:function(jsonResponse){var parentTable=jsonResponse.parameters[0];
if(!parentTable||parentTable.innerHTML===""){return false;
}var columnIndex=jsonResponse.parameters[1],jsonData=jsonResponse.response.UPCOMING_ITEMS;
if(jsonData.CNT>0){TableLayout.insertColumnData({tableDOM:parentTable,columnIndex:columnIndex,JSONList:jsonData.QUAL,JSONRef:["APPT_STATUS_MEANING","NAME_DISPLAY","APPT_TYPE_DESC_DISPLAY","APPT_REASON_DISPLAY","OPEN_ITEM_CNT","DAYS_UNTIL_GRP_IND"],JSONRefCSS:["status-ind","patient","appt-details","notes","outstanding-actions","group-ind-hidden hidden"],JSONRowId:["ORG_APPT_ID","ORG_APPT_TYPE","PRIMARY_TAB"]});
}AmbulatoryWorklist.pushData("UPCOMING",jsonData.QUAL);
if(loadJsondataCnt==0){defaultSortCSS="appt-time-hidden";
UpcomingItems.setParentTable(parentTable);
UpcomingItems.setOrderLink(jsonData.ORDER_TAB_LINK);
UpcomingItems.setDocLink(jsonData.DOCUMENT_TAB_LINK);
UpcomingItems.setHPLink(jsonData.H_P_TAB_LINK);
UpcomingItems.setConsentLink(jsonData.CONSENT_TAB_LINK);
UpcomingItems.setPreopLink(jsonData.PREOP_ORDERS_TAB_LINK);
UpcomingItems.setTaskListInd(jsonData.TASK_LIST_IND);
UpcomingItems.setHPInd(jsonData.H_AND_P_IND);
UpcomingItems.setConsentInd(jsonData.CONSENT_IND);
UpcomingItems.setPreopInd(jsonData.PREOP_IND);
UpcomingItems.setManualSatisfyInd(jsonData.MANUAL_SATISFY_IND);
loadJsondataCnt++;
}MpageDriver.finishedLoading(this.meaning);
}};
}());
MpageDriver.register({column:UpcomingColumn});
var UpcomingItems=function(){var timerUpcomingLoad;
var timerUpcomingRender;
var orderLink="";
var hpLink="";
var consentLink="";
var preopLink="";
var providerNoteInd=0;
var taskListInd=0;
var manualSatisfyInd=0;
var hpInd=0;
var consentInd=0;
var preopInd=0;
var parentTable;
return{setParentTable:function(parTable){parentTable=parTable;
},getParentTable:function(){return parentTable;
},setHPLink:function(hpLinkString){hpLink=hpLinkString;
},getHPLink:function(){return hpLink;
},setConsentLink:function(consentLinkString){consentLink=consentLinkString;
},getConsentLink:function(){return consentLink;
},setPreopLink:function(preopLinkString){preopLink=preopLinkString;
},getPreopLink:function(){return preopLink;
},setDocLink:function(docLinkString){docLink=docLinkString;
},getDocLink:function(){return docLink;
},setOrderLink:function(orderLinkString){orderLink=orderLinkString;
},getOrderLink:function(){return orderLink;
},setTaskLink:function(taskLinkString){taskLink=taskLinkString;
},getTaskLink:function(){return taskLink;
},setVisitChargeInd:function(nVisitChargeIndicator){visitChargeInd=nVisitChargeIndicator;
},setHPInd:function(nHPIndicator){hpInd=nHPIndicator;
},setConsentInd:function(nConsentIndicator){consentInd=nConsentIndicator;
},setPreopInd:function(nPreopIndicator){preopInd=nPreopIndicator;
},setTaskListInd:function(nTaskListIndicator){taskListInd=nTaskListIndicator;
},setManualSatisfyInd:function(nManualSatisfyIndicator){manualSatisfyInd=nManualSatisfyIndicator;
},getManualSatisfyInd:function(){return manualSatisfyInd;
},setVisitSummaryStaticContentLocation:function(staticContentLoc){visitSummStaticContentLoc=staticContentLoc;
},setPositionCd:function(positionCode){positionCd=positionCode;
},startLoadTimer:function(){timerUpcomingLoad=createSLATimer("USR:MPG.Amb_Org_load - build columns(UPCOMING)",VERSIONSTR);
},startRenderTimer:function(){timerUpcomingRender=createSLATimer("USR:MPG.Amb_Org_load - edit rows(UPCOMING)",VERSIONSTR);
},stopLoadTimer:function(){if(timerUpcomingLoad!=null){timerUpcomingLoad.Stop();
}},stopRenderTimer:function(){if(timerUpcomingRender!=null){timerUpcomingRender.Stop();
}},genOutActionsHTML:function(rowData,hpPref,consentPref,preopPref){var manSatInd=UpcomingItems.getManualSatisfyInd();
var hpLinkString=hpLink;
var consentLinkString=consentLink;
var preopLinkString=preopLink;
rowData.OPEN_ITEM_CNT=0;
if(hpPref=="Y"||consentPref=="Y"||preopPref=="Y"){if(hpPref=="Y"&&rowData.H_P_COMPLETED=="N"){rowData.OPEN_ITEM_CNT=rowData.OPEN_ITEM_CNT+1;
}if(consentPref=="Y"&&rowData.CONSENT_COMPLETED=="N"){rowData.OPEN_ITEM_CNT=rowData.OPEN_ITEM_CNT+1;
}if(preopPref=="Y"&&rowData.PREOP_ORDER_COMPLETE=="N"){rowData.OPEN_ITEM_CNT=rowData.OPEN_ITEM_CNT+1;
}}var outActionsArr=[];
outActionsArr.push("<span class='hp-tag");
if(hpPref=="N"){outActionsArr.push(" hidden");
}outActionsArr.push("'>");
if(hpInd==1){if(rowData.H_P_EVENT_ID==0){if(rowData.HP_MANUAL_IND==1){outActionsArr.push("<span class='completed-item' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
outActionsArr.push("><img class='open-item-icon' src='../img/note_dithered.png' ><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='hp' value='1'> ");
outActionsArr.push(i18n.HP_COMPLETED,"</span>");
}else{outActionsArr.push("<a class='item-link'");
if(manSatInd==1){outActionsArr.push(" onmouseover='AmbulatoryWorklist.openItemTagHover(this)' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
}if(hpLinkString!==""){if(hpLinkString.indexOf("+")==-1){hpLinkString=hpLinkString+"+";
}}outActionsArr.push(' href=\'javascript:APPLINK(0,"powerchart.exe","/PERSONID=',rowData.PERSON_ID," /ENCNTRID=",rowData.ENCNTR_ID," /FIRSTTAB=^",hpLinkString,"^\");'");
outActionsArr.push("><img class='open-item-icon' src='../img/note.png' >  ");
if(manSatInd==1){outActionsArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='hp' value='1'>");
}outActionsArr.push(i18n.HP_NOT_STARTED,"</a>");
}}else{if(rowData.H_P_COMPLETED=="Y"){outActionsArr.push("<span class='completed-item'>",CreateClinNoteLink(rowData.PERSON_ID,rowData.ENCNTR_ID,rowData.H_P_EVENT_ID,"<img class='open-item-icon' src='../img/note_dithered.png' >   "+i18n.HP_COMPLETED+"","DOC",rowData.H_P_EVENT_ID),"</span>");
}else{outActionsArr.push("<img class='open-item-icon' src='../img/note.png' >",CreateClinNoteLink(rowData.PERSON_ID,rowData.ENCNTR_ID,rowData.H_P_EVENT_ID,"   "+i18n.HP_SAVED+"","DOC",rowData.H_P_EVENT_ID));
}}outActionsArr.push("<br/>");
}outActionsArr.push("</span><span class='consent-tag");
if(consentPref=="N"){outActionsArr.push(" hidden");
}outActionsArr.push("'>");
if(consentInd==1){if(rowData.CONSENT_EVENT_ID==0){if(rowData.CONSENT_MANUAL_IND==1){outActionsArr.push("<span class='completed-item' onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
outActionsArr.push("><img class='open-item-icon' src='../img/note_dithered.png' ><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='consent' value='1'> ");
outActionsArr.push(i18n.CONSENT_COMPLETED,"</span>");
}else{outActionsArr.push("<a class='item-link'");
if(manSatInd==1){outActionsArr.push(" onmouseover='AmbulatoryWorklist.openItemTagHover(this)' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
}if(consentLinkString!==""){if(consentLinkString.indexOf("+")==-1){consentLinkString=consentLinkString+"+";
}}outActionsArr.push(' href=\'javascript:APPLINK(0,"powerchart.exe","/PERSONID=',rowData.PERSON_ID," /ENCNTRID=",rowData.ENCNTR_ID," /FIRSTTAB=^",consentLinkString,"^\");'");
outActionsArr.push("><img class='open-item-icon' src='../img/note.png' >  ");
if(manSatInd==1){outActionsArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='consent' value='1'>");
}outActionsArr.push(i18n.CONSENT_NOT_STARTED,"</a>");
}}else{if(rowData.CONSENT_COMPLETED=="Y"){outActionsArr.push("<span class='completed-item'>",CreateClinNoteLink(rowData.PERSON_ID,rowData.ENCNTR_ID,rowData.CONSENT_EVENT_ID,"<img class='open-item-icon' src='../img/note_dithered.png' >   "+i18n.CONSENT_COMPLETED+"","DOC",rowData.CONSENT_EVENT_ID),"</span>");
}else{outActionsArr.push("<img class='open-item-icon' src='../img/note.png' >",CreateClinNoteLink(rowData.PERSON_ID,rowData.ENCNTR_ID,rowData.CONSENT_EVENT_ID,"   "+i18n.CONSENT_SAVED+"","DOC",rowData.CONSENT_EVENT_ID));
}}outActionsArr.push("<br/>");
}outActionsArr.push("</span><span class='preop-tag");
if(preopPref=="N"){outActionsArr.push(" hidden");
}outActionsArr.push("'>");
if(preopInd==1){if(rowData.PREOP_ORDER_COMPLETE!="Y"){outActionsArr.push("<a class='item-link'");
if(manSatInd==1){outActionsArr.push(" onmouseover='AmbulatoryWorklist.openItemTagHover(this)' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'");
}if(preopLinkString!==""){if(preopLinkString.indexOf("+")==-1){preopLinkString=preopLinkString+"+";
}}outActionsArr.push(' href=\'javascript:APPLINK(0,"powerchart.exe","/PERSONID=',rowData.PERSON_ID," /ENCNTRID=",rowData.ENCNTR_ID," /FIRSTTAB=^",preopLinkString,"^\");'");
outActionsArr.push("><img class='open-item-icon' src='../img/order.png' >  ");
if(manSatInd==1){outActionsArr.push("<input class='openitem-checkbox hidden' type='checkbox' name='preop' value='1'>");
}outActionsArr.push(i18n.PREOP_ORDER_NOT_STARTED,"</a>");
}else{outActionsArr.push("<span class='complete-billing completed-item'");
if(rowData.PREOP_MANUAL_IND==0){outActionsArr.push(" onmouseover='AmbulatoryWorklist.billingHover(this);' onmouseout='AmbulatoryWorklist.clearHoverTimer();'>");
}else{outActionsArr.push(" onmouseover='AmbulatoryWorklist.openItemTagHover(this);' onmouseout='AmbulatoryWorklist.openItemTagHoverOut(this);'><input class='openitem-checkbox hidden' type='checkbox' checked='true' name='preop' value='1'>");
}outActionsArr.push("<img class='open-item-icon' src='../img/order_dithered.png' > ",i18n.PREOP_ORDER_COMPLETE,"</span>");
}outActionsArr.push("<br/>");
}outActionsArr.push("</span>");
return outActionsArr.join("");
},getApptFromJsonData:function(jsonData,org_appt_id,org_appt_type){var l=jsonData.length;
var dataFound=false;
for(var i=0;
i<l;
i++){if(jsonData[i].ORG_APPT_ID==org_appt_id&&jsonData[i].ORG_APPT_TYPE==org_appt_type){dataFound=true;
return jsonData[i];
}}if(!dataFound){AjaxHandler.append_text("Appointment data not found<br/>org appt id = "+org_appt_id+"<br/>org appt type = "+org_appt_type);
}},editRows:function(jsonData){var tableBody=_g("TBODY_UPCOMING");
var tabs=AmbulatoryWorklist.getTabsElement();
var patientRows=_gbt("tr",tableBody);
var arrLength=patientRows.length;
var rowShowingCnt=arrLength;
var rowData;
var userPrefMenu=AmbulatoryWorklist.getUserPrefList();
var hpPref=(hpInd==1)?userPrefMenu.HP_IND:"N";
var consentPref=(consentInd==1)?userPrefMenu.CONSENT_IND:"N";
var preopPref=(preopInd==1)?userPrefMenu.PREOP_IND:"N";
var currGroupInd=-1;
var heading="";
var groupInd=0;
var todayCnt=0;
var tomorrowCnt=0;
var twoDaysCnt=0;
var moreThanTwoDaysCnt=0;
var moreThan2daysRow;
var twoDaysRow;
var tomorrowRow;
var todayRow;
for(var i=0;
i<arrLength;
i++){rowData=UpcomingItems.getApptFromJsonData(jsonData,AmbulatoryWorklist.getOrgApptIdFromParentRow(patientRows[i]),AmbulatoryWorklist.getOrgApptTypeFromParentRow(patientRows[i]));
var statusIndCell=Util.Style.g("status-ind",patientRows[i],"span")[0];
var patCell=Util.Style.g("patient",patientRows[i],"span")[0];
var apptDetailsCell=Util.Style.g("appt-details",patientRows[i],"span")[0];
var notesCell=Util.Style.g("notes",patientRows[i],"span")[0];
var outActionsCell=Util.Style.g("outstanding-actions",patientRows[i],"span")[0];
var groupIndHiddenCell=Util.Style.g("group-ind-hidden hidden",patientRows[i],"span")[0];
var patientRowTD=Util.Style.g("table-layout-table-td",patientRows[i],"td")[0];
if(outActionsCell){outActionsHTML=UpcomingItems.genOutActionsHTML(rowData,hpPref,consentPref,preopPref);
outActionsCell.innerHTML=outActionsHTML;
}else{outActionsCell=Util.cep("span",{className:"outstanding-actions"});
patientRowTD.insertBefore(outActionsCell,groupIndHiddenCell);
}if(notesCell){apptNotesHTML=UpcomingItems.apptNotesColGenHTML(rowData);
notesCell.innerHTML=apptNotesHTML;
}else{notesCell=Util.cep("span",{className:"notes"});
patientRowTD.insertBefore(notesCell,outActionsCell);
}if(apptDetailsCell){apptDetailsHTML=AmbulatoryWorklist.apptDetailsColGenHTML(rowData);
apptDetailsCell.innerHTML=apptDetailsHTML;
}else{apptDetailsCell=Util.cep("span",{className:"appt-details"});
patientRowTD.insertBefore(apptDetailsCell,notesCell);
}if(patCell){patInfoHTML=AmbulatoryWorklist.patInfoColGenHTML(rowData);
patCell.innerHTML=patInfoHTML;
}else{patCell=Util.cep("span",{className:"patient"});
patientRowTD.insertBefore(patCell,apptDetailsCell);
}if(!statusIndCell){statusIndCell=Util.cep("span",{className:"status-ind"});
patientRowTD.insertBefore(statusIndCell,patCell);
}statusIndCell.innerHTML="<div class='color-ind'><div class='surg-open-items-light'></div></div>";
Util.Style.acss(statusIndCell,"open-items");
Util.Style.acss(patientRows[i],"appointment-row open-items");
UpcomingItems.surgStyleIndicator(patientRows[i],rowData.APPT_STATUS_MEANING);
if(rowData.ORG_APPT_TYPE==APPT_TYPE_SURG){if(!((hpPref=="Y"&&rowData.H_P_COMPLETED=="N")||(consentPref=="Y"&&rowData.CONSENT_COMPLETED=="N")||(preopPref=="Y"&&rowData.PREOP_ORDER_COMPLETE=="N"))){Util.Style.acss(patientRows[i],"hidden");
rowShowingCnt--;
}}if(!Util.Style.ccss(patientRows[i],"hidden")){groupInd=rowData.DAYS_UNTIL_GRP_IND;
if(groupInd==3){moreThanTwoDaysCnt++;
}else{if(groupInd==2){twoDaysCnt++;
}else{if(groupInd==1){tomorrowCnt++;
}else{if(groupInd==0){todayCnt++;
}}}}if(groupInd>currGroupInd){currGroupInd=groupInd;
if(currGroupInd==3){heading=i18n.MORE_THAN_2_DAYS;
}else{if(currGroupInd==2){heading=i18n.TWO_DAYS;
}else{if(currGroupInd==1){heading=i18n.TOMORROW;
}else{heading=i18n.TODAY;
}}}var rowBreak=Util.cep("tr",{id:"_0.00",colspan:"1",className:"break-row"});
rowBreak.appendChild(Util.cep("td",{"class":"table-layout-table-td brdr",innerHTML:heading+" ("}));
tableBody.insertBefore(rowBreak,patientRows[i]);
if(groupInd==3){moreThan2daysRow=rowBreak;
}else{if(groupInd==2){twoDaysRow=rowBreak;
}else{if(groupInd==1){tomorrowRow=rowBreak;
}else{if(groupInd==0){todayRow=rowBreak;
}}}}i++;
arrLength++;
}}}if(moreThan2daysRow){Util.gc(moreThan2daysRow,0).innerHTML+=moreThanTwoDaysCnt+")";
}if(twoDaysRow){Util.gc(twoDaysRow,0).innerHTML+=twoDaysCnt+")";
}if(tomorrowRow){Util.gc(tomorrowRow,0).innerHTML+=tomorrowCnt+")";
}if(todayRow){Util.gc(todayRow,0).innerHTML+=todayCnt+")";
}var undo=AmbulatoryWorklist.getUndoData();
var prefIndArray=[];
AmbulatoryWorklist.CreatePageMenu();
prefIndArray.push(0,0,0,0,hpInd,consentInd,preopInd,undo.UNDO_IND);
AmbulatoryWorklist.setUserPrefMenu(prefIndArray);
upcomingItemsApptFlag=true;
gblhpInd=hpInd;
gblconsentInd=consentInd;
gblpreopInd=preopInd;
},surgStyleIndicator:function(patientRow,status){switch(status){case PRE_OP:Util.Style.acss(patientRow,"preop-row");
break;
case CONFIRMED:case CONFIRM:case SCHEDULED:case SCHEDULE:Util.Style.acss(patientRow,"confirmed-row");
break;
case CHECKED_IN:case CHECKIN:Util.Style.acss(patientRow,"checked-in-row");
break;
case CANCELED:case CANCEL:case NO_SHOW:Util.Style.acss(patientRow,"canceled-row");
break;
case CHECKED_OUT:Util.Style.acss(patientRow,"surgery-status checked-out-row");
break;
default:break;
}},insertRowBreak:function(){var tableBody=_g("TBODY_UPCOMING");
var upcomingRows=_gbt("tr",tableBody);
var currGroupInd=-1;
var heading="";
var groupInd=0;
var todayCnt=0;
var tomorrowCnt=0;
var twoDaysCnt=0;
var moreThanTwoDaysCnt=0;
var moreThan2daysRow;
var twoDaysRow;
var tomorrowRow;
var todayRow;
var tabs=AmbulatoryWorklist.getTabsElement();
var l=upcomingRows.length;
for(var i=0;
i<l;
i++){if(!Util.Style.ccss(upcomingRows[i],"hidden")){groupInd=Util.Style.g("group-ind-hidden",upcomingRows[i],"span")[0].innerHTML;
if(groupInd==3){moreThanTwoDaysCnt++;
}else{if(groupInd==2){twoDaysCnt++;
}else{if(groupInd==1){tomorrowCnt++;
}else{todayCnt++;
}}}if(groupInd>currGroupInd){currGroupInd=groupInd;
if(currGroupInd==3){heading=i18n.MORE_THAN_2_DAYS;
}else{if(currGroupInd==2){heading=i18n.TWO_DAYS;
}else{if(currGroupInd==1){heading=i18n.TOMORROW;
}else{heading=i18n.TODAY;
}}}var rowBreak=Util.cep("tr",{id:"_0.00",colspan:"1",className:"break-row"});
rowBreak.appendChild(Util.cep("td",{"class":"table-layout-table-td brdr",innerHTML:heading+" ("}));
tableBody.insertBefore(rowBreak,upcomingRows[i]);
if(groupInd==3){moreThan2daysRow=rowBreak;
}else{if(groupInd==2){twoDaysRow=rowBreak;
}else{if(groupInd==1){tomorrowRow=rowBreak;
}else{if(groupInd==0){todayRow=rowBreak;
}}}}i++;
l++;
}}}if(moreThan2daysRow){Util.gc(moreThan2daysRow,0).innerHTML+=moreThanTwoDaysCnt+")";
}if(twoDaysRow){Util.gc(twoDaysRow,0).innerHTML+=twoDaysCnt+")";
}if(tomorrowRow){Util.gc(tomorrowRow,0).innerHTML+=tomorrowCnt+")";
}if(todayRow){Util.gc(todayRow,0).innerHTML+=todayCnt+")";
}},modifyVisibilityUpcomingItems:function(itemTypes,prefs,patientRow,jsonData){for(var j=0;
j<itemTypes.length;
j++){var statusInd=Util.Style.g("outstanding-actions",patientRow,"span")[0];
var rowData=UpcomingItems.getApptFromJsonData(jsonData,AmbulatoryWorklist.getOrgApptIdFromParentRow(patientRow),AmbulatoryWorklist.getOrgApptTypeFromParentRow(patientRow));
var nodeType=Util.Style.g(itemTypes[j],statusInd,"span")[0];
if(!(nodeType==null)){if(prefs[j]=="N"){Util.Style.acss(nodeType,"hidden");
UpcomingItems.modifyRow(rowData,patientRow);
}else{Util.Style.rcss(nodeType,"hidden");
UpcomingItems.modifyRow(rowData,patientRow);
}}}},modifyRow:function(rowData,patientRow){var userPrefMenu=AmbulatoryWorklist.getUserPrefList();
if(rowData.ORG_APPT_TYPE==APPT_TYPE_SURG){rowData.OPEN_ITEM_CNT=(userPrefMenu.HP_IND=="Y"&&rowData.H_P_COMPLETED=="N")+(userPrefMenu.CONSENT_IND=="Y"&&rowData.CONSENT_COMPLETED=="N")+(userPrefMenu.PREOP_IND=="Y"&&rowData.PREOP_ORDER_COMPLETE=="N");
}if(rowData.OPEN_ITEM_CNT>0){Util.Style.rcss(patientRow,"hidden");
}else{Util.Style.acss(patientRow,"hidden");
}},apptNotesColGenHTML:function(rowData){var notesHtmlArr=[];
notesHtmlArr.push("<div class='notes-container'>");
if(rowData.APPT_REASON){notesHtmlArr.push("<div class='notes-div' onmouseover='AmbulatoryWorklist.apptDetailsHover(this);' onmouseout='AmbulatoryWorklist.clearHoverTimer();'><span class='main-detail'><span class='sub-detail'>",i18n.REASON,": </span>",rowData.APPT_REASON,"</span></div>");
}if(rowData.CHIEF_COMPLAINT){notesHtmlArr.push("<div class='notes-div' onmouseover='AmbulatoryWorklist.apptDetailsHover(this);' onmouseout='AmbulatoryWorklist.clearHoverTimer();'><span class='main-detail'><span class='sub-detail'>",i18n.CHIEF_COMPLAINT,": </span>",rowData.CHIEF_COMPLAINT,"</span></div>");
}notesHtmlArr.push("</div>");
return notesHtmlArr.join("");
}};
}();
function tabFinLoadUpcomingItems(){setTimeout(function(){UpcomingItems.stopLoadTimer();
},10);
UpcomingItems.startRenderTimer();
if(upcomingResourceChangeTimer==null&&upcomingButtonClickTimer==null){startUpcomingRefreshTimer();
}if(_g("TBODY_UPCOMING")){var worklistData=AmbulatoryWorklist.getData();
UpcomingItems.editRows(worklistData.UPCOMING);
}$("#TABLE_UPCOMING").css("table-layout","fixed");
setTimeout(function(){UpcomingItems.stopRenderTimer();
},10);
if(upcomingRefreshTimer){setTimeout(function(){stopUpcomingRefreshTimer();
},10);
}setTimeout(function(){stopUpcomingButtonClickTimer();
},10);
setTimeout(function(){stopUpcomingResourceChangeTimer();
},10);
setTimeout(function(){stopLoadTimer();
},10);
}function calReady(personId,resourceId,tabName){var TIMELINE="timeline";
var _MH;
var view="week";
if(tabName==TIMELINE){view="day";
_MH=$("#timeline-container-id").height();
}else{tabName="";
Util.Style.acss(showweekbtn,"tab-layout-active");
Util.Style.rcss(showtodaybtn,"tab-layout-active");
_MH=$("#TAB_CONTENT_CALENDAR").height();
}var op={view:view,theme:3,showday:new Date(),onBeforeRequestData:cal_beforerequest,onAfterRequestData:cal_afterrequest,onRequestDataError:cal_onerror,autoload:true,personId:personId,resourceId:resourceId,tabName:tabName};
var $dv=$("#"+tabName+"calhead");
var dvH=$("#"+tabName+"caltoolbar").height();
var width=$("#"+tabName+"caltoolbar").width();
op.height=_MH-dvH;
op.width=width;
op.eventItems=[];
var date;
if(tabName==TIMELINE){date=AmbulatoryWorklist.getDateTime("currentAppointmentDateTime");
op.showday=date;
}else{date=AmbulatoryWorklist.getDateTime("CalendarcurrentAppointmentDateTime");
op.showday=date;
}var p=$("#"+tabName+"gridcontainer").bcalendar(op).BcalGetOp();
$("#"+tabName+"caltoolbar").noSelect();
$("#"+tabName+"hdtxtshow").datepicker({picker:"#"+tabName+"txtdatetimeshow",showtarget:$("#"+tabName+"txtdatetimeshow"),onReturn:function(r){var p=$("#"+tabName+"gridcontainer").gotoDate(r).BcalGetOp();
AmbulatoryWorklist.setDateTime("CalendarcurrentAppointmentDateTime",r);
if(p&&p.datestrshow){$("#"+tabName+"txtdatetimeshow").text(p.datestrshow);
}}});
function cal_beforerequest(type){var t=i18n.REQUEST_PROCESS;
$("#"+tabName+"errorpannel").hide();
}function cal_afterrequest(type){switch(type){case 2:case 3:case 4:var p=$("#"+tabName+"gridcontainer").BcalGetOp();
if(p&&p.datestrshow){$("#"+tabName+"txtdatetimeshow").text(p.datestrshow);
}$("#"+tabName+"caltoolbar").noSelect();
break;
}}function cal_onerror(type,data){$("#"+tabName+"errorpannel").show();
}$("#"+tabName+"showweekbtn").click(function(e){$("#"+tabName+"caltoolbar div.fcurrent").each(function(){$(this).removeClass("fcurrent");
});
$(this).addClass("fcurrent");
var p=$("#"+tabName+"gridcontainer").swtichView("week").BcalGetOp();
if(p&&p.datestrshow){$("#"+tabName+"txtdatetimeshow").text(p.datestrshow);
}if(tabName!=TIMELINE){Util.Style.acss(showweekbtn,"tab-layout-active");
Util.Style.rcss(showtodaybtn,"tab-layout-active");
}});
$("#"+tabName+"showtodaybtn").click(function(e){op.view="day";
var date=AmbulatoryWorklist.getDateTime("CalendarcurrentAppointmentDateTime");
op.showday=date;
var p=$("#"+tabName+"gridcontainer").bcalendar(op).BcalGetOp();
if(p&&p.datestrshow){$("#"+tabName+"txtdatetimeshow").text(p.datestrshow);
}if(tabName!=TIMELINE){Util.Style.rcss(showweekbtn,"tab-layout-active");
Util.Style.acss(showtodaybtn,"tab-layout-active");
}});
$("#"+tabName+"sfprevbtn").click(function(e){var p=$("#"+tabName+"gridcontainer").previousRange().BcalGetOp();
if(p&&p.datestrshow){$("#"+tabName+"txtdatetimeshow").text(p.datestrshow);
}});
$("#"+tabName+"sfnextbtn").click(function(e){var p=$("#"+tabName+"gridcontainer").nextRange().BcalGetOp();
if(p&&p.datestrshow){$("#"+tabName+"txtdatetimeshow").text(p.datestrshow);
}});
}function showCal(date){var calendarDiv=Util.Style.g("calendar-wrapper",document,"div")[0];
calendarDiv.innerHTML=getCalHTML();
}function getCalHTML(){var HTML="<div id='calhead' style='padding-left:1px;padding-right:1px;'>  		<div class='cHead'>            <div id='caltoolbar' class='ctoolbar'>			<div id='errorpannel' class='ptogtitle loaderror' style='display: none;'>"+i18n.ERROR_LOADING+"</div>            <div id='showtodaybtn' class='fbutton calendar-seg-cntrl'>				<div id='todayLeft'></div><div id='todayCenter'>"+i18n.DAY+"</div><div id='todayRight'></div>            </div>              <div  id='showweekbtn' class='fbutton calendar-seg-cntrl'>             <div id='weekLeft'></div><div id='weekCenter'>"+i18n.WEEK+"</div><div id='weekRight'></div>            </div>             <div class='dtrangewrapper'>            <div id='sfprevbtn' title='Prev'  class='fbutton'>              <IMG STYLE='position:absolute; TOP: WIDTH:15px; HEIGHT:15px' SRC='../img/arrow_left.png'>            </div>            <div class='fshowdatep fbutton'>                    <div>                        <input type='hidden' name='txtshow' id='hdtxtshow' />                        <span id='txtdatetimeshow'>Loading</span>                    </div>            </div>	    <div id='sfnextbtn' title='Next' class='fbutton'>               		 <IMG STYLE='position:absolute; TOP: WIDTH:15px; HEIGHT:15px' SRC='../img/arrow_right.png'>            </div>        </div>      </div>	</div>      <div style='padding:1px;'>        <div id='dvCalMain' class='calmain printborder'>            <div id='gridcontainer' style='overflow-y: visible;'>            </div>        </div>        </div>           </div>";
return HTML;
}(function($){var genericStatusColor=[];
var __WDAY=new Array(i18n.xgcalendar.dateformat.sun,i18n.xgcalendar.dateformat.mon,i18n.xgcalendar.dateformat.tue,i18n.xgcalendar.dateformat.wed,i18n.xgcalendar.dateformat.thu,i18n.xgcalendar.dateformat.fri,i18n.xgcalendar.dateformat.sat);
var __MonthName=new Array(i18n.xgcalendar.dateformat.jan,i18n.xgcalendar.dateformat.feb,i18n.xgcalendar.dateformat.mar,i18n.xgcalendar.dateformat.apr,i18n.xgcalendar.dateformat.may,i18n.xgcalendar.dateformat.jun,i18n.xgcalendar.dateformat.jul,i18n.xgcalendar.dateformat.aug,i18n.xgcalendar.dateformat.sep,i18n.xgcalendar.dateformat.oct,i18n.xgcalendar.dateformat.nov,i18n.xgcalendar.dateformat.dec);
if(!Clone||typeof(Clone)!="function"){var Clone=function(obj){var objClone=new Object();
if(obj.constructor==Object){objClone=new obj.constructor();
}else{objClone=new obj.constructor(obj.valueOf());
}for(var key in obj){if(objClone[key]!=obj[key]){if(typeof(obj[key])=="object"){objClone[key]=Clone(obj[key]);
}else{objClone[key]=obj[key];
}}}objClone.toString=obj.toString;
objClone.valueOf=obj.valueOf;
return objClone;
};
}if(!dateFormat||typeof(dateFormat)!="function"){var dateFormat=function(format){var o={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"H+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),w:"0123456".indexOf(this.getDay()),W:__WDAY[this.getDay()],L:__MonthName[this.getMonth()]};
if(/(y+)/.test(format)){format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));
}for(var k in o){if(new RegExp("("+k+")").test(format)){format=format.replace(RegExp.$1,RegExp.$1.length==1?o[k]:("00"+o[k]).substr((""+o[k]).length));
}}return format;
};
}if(!DateAdd||typeof(DateDiff)!="function"){var DateAdd=function(interval,number,idate){number=parseInt(number,10);
var date;
if(typeof(idate)=="string"){date=idate.split(/\D/);
eval("var date = new Date("+date.join(",")+")");
}if(typeof(idate)=="object"){date=new Date(idate.toString());
}switch(interval){case"y":date.setFullYear(date.getFullYear()+number);
break;
case"m":date.setMonth(date.getMonth()+number);
break;
case"d":date.setDate(date.getDate()+number);
break;
case"w":date.setDate(date.getDate()+7*number);
break;
case"h":date.setHours(date.getHours()+number);
break;
case"n":date.setMinutes(date.getMinutes()+number);
break;
case"s":date.setSeconds(date.getSeconds()+number);
break;
case"l":date.setMilliseconds(date.getMilliseconds()+number);
break;
}return date;
};
}if(!DateDiff||typeof(DateDiff)!="function"){var DateDiff=function(interval,d1,d2){switch(interval){case"d":case"w":d1=new Date(d1.getFullYear(),d1.getMonth(),d1.getDate());
d2=new Date(d2.getFullYear(),d2.getMonth(),d2.getDate());
break;
case"h":d1=new Date(d1.getFullYear(),d1.getMonth(),d1.getDate(),d1.getHours());
d2=new Date(d2.getFullYear(),d2.getMonth(),d2.getDate(),d2.getHours());
break;
case"n":d1=new Date(d1.getFullYear(),d1.getMonth(),d1.getDate(),d1.getHours(),d1.getMinutes());
d2=new Date(d2.getFullYear(),d2.getMonth(),d2.getDate(),d2.getHours(),d2.getMinutes());
break;
case"s":d1=new Date(d1.getFullYear(),d1.getMonth(),d1.getDate(),d1.getHours(),d1.getMinutes(),d1.getSeconds());
d2=new Date(d2.getFullYear(),d2.getMonth(),d2.getDate(),d2.getHours(),d2.getMinutes(),d2.getSeconds());
break;
}var t1=d1.getTime(),t2=d2.getTime();
var diff=NaN;
switch(interval){case"y":diff=d2.getFullYear()-d1.getFullYear();
break;
case"m":diff=(d2.getFullYear()-d1.getFullYear())*12+d2.getMonth()-d1.getMonth();
break;
case"d":diff=Math.floor(t2/86400000)-Math.floor(t1/86400000);
break;
case"w":diff=Math.floor((t2+345600000)/(604800000))-Math.floor((t1+345600000)/(604800000));
break;
case"h":diff=Math.floor(t2/3600000)-Math.floor(t1/3600000);
break;
case"n":diff=Math.floor(t2/60000)-Math.floor(t1/60000);
break;
case"s":diff=Math.floor(t2/1000)-Math.floor(t1/1000);
break;
case"l":diff=t2-t1;
break;
}return diff;
};
}if($.fn.noSelect==undefined){$.fn.noSelect=function(p){if(p==null){prevent=true;
}else{prevent=p;
}if(prevent){return this.each(function(){if($.browser.msie||$.browser.safari){$(this).bind("selectstart",function(){return false;
});
}else{if($.browser.mozilla){$(this).css("MozUserSelect","none");
$("body").trigger("focus");
}else{if($.browser.opera){$(this).bind("mousedown",function(){return false;
});
}else{$(this).attr("unselectable","on");
}}}});
}else{return this.each(function(){if($.browser.msie||$.browser.safari){$(this).unbind("selectstart");
}else{if($.browser.mozilla){$(this).css("MozUserSelect","inherit");
}else{if($.browser.opera){$(this).unbind("mousedown");
}else{$(this).removeAttr("unselectable","on");
}}}});
}};
}$.fn.bcalendar=function(option){var timerApptLoad;
var timerApptRender;
var def={view:"week",weekstartday:1,theme:0,height:false,eventItems:[],showday:new Date(),onBeforeRequestData:false,onAfterRequestData:false,onRequestDataError:false,onWeekOrMonthToDay:false,autoload:false,readonly:true,extParam:[],enableDrag:false,tabName:"",loadDateR:[]};
var eventDiv=$("#gridEvent");
if(eventDiv.length==0){eventDiv=$("<div id='gridEvent' style='display:none;'></div>").appendTo(document.body);
}var gridcontainer=$(this);
option=$.extend(def,option);
var __SCOLLEVENTTEMP='<DIV style="WIDTH:${width};top:${top};left:${left};" title="${title}" class="chip "> <div class="dhdV" style="display:none">${data}</div> <DL style="-webkit-border-radius: 8px; -moz-border-radius: 8px; border-radius: 8px; width: 99.9%; HEIGHT: ${height}px;" class = ${status}><DD> ${content}</DD><DT><DIV class="long-text-display"> ${description} </DIV></br>${reasonforvisitLabel}</DT></DL></DIV>';
var __ALLDAYEVENTTEMP='<div class="rb-o ${eclass}" id="${id}" title="${title}" style="color:${color};"><div class="dhdV" style="display:none">${data}</div><div class="${extendClass} rb-m" style="background-color:${color}">${extendHTML}<div class="rb-i">${content}</div></div></div>';
var __MonthDays=[31,28,31,30,31,30,31,31,30,31,30,31];
var __LASSOTEMP="<div class='drag-lasso' style='left:${left}px;top:${top}px;width:${width}px;height:${height}px;'>&nbsp;</div>";
var _dragdata;
var _dragevent;
clearcontainer();
if(!option.height){option.height=document.documentElement.clientHeight;
}gridcontainer.css("overflow-y","visible").height(option.height-8);
if(option.autoload){populate();
}else{render();
}function clearcontainer(){gridcontainer.empty();
}function getRdate(){return{start:option.vstart,end:option.vend};
}function render(){var showday=new Date(option.showday.getFullYear(),option.showday.getMonth(),option.showday.getDate());
var events=option.eventItems;
var config={view:option.view,weekstartday:option.weekstartday,theme:option.theme};
if(option.view=="day"||option.view=="week"){var $dvtec=$("#"+option.tabName+"dvtec");
if($dvtec.length>0){option.scoll=$dvtec.attr("scrollTop");
}}switch(option.view){case"day":BuildDaysAndWeekView(showday,1,events,config);
break;
case"week":BuildDaysAndWeekView(showday,7,events,config);
break;
default:alert(i18n.xgcalendar.no_implement);
break;
}initevents(option.view);
ResizeView();
setTimeout(function(){stopCalendarButtonClickTimer();
},10);
setTimeout(function(){stopCalendarResourceChangeTimer();
},10);
if(calendarRefreshTimer){setTimeout(function(){stopCalendarRefreshTimer();
},10);
}setTimeout(function(){stopCalLoadTimer();
},10);
setTimeout(function(){stopCalRenderTimer();
},10);
setTimeout(function(){stopLoadTimer();
},10);
}function BuildDaysAndWeekView(startday,l,events,config){var days=[];
if(l==1){var show=dateFormat.call(startday,i18n.xgcalendar.dateformat.Md);
days.push({display:show,date:startday,day:startday.getDate(),year:startday.getFullYear(),month:startday.getMonth()+1});
option.datestrshow=CalDateShow(days[0].date);
$("#"+option.tabName+"txtdatetimeshow").text(option.datestrshow);
option.vstart=days[0].date;
option.vend=days[0].date;
var today=CalDateShow(new Date());
if(option.tabName!="timeline"){if(option.view=="week"){Util.Style.rcss(showtodaybtn,"tab-layout-active");
}else{Util.Style.acss(showtodaybtn,"tab-layout-active");
}}}else{var w=0;
if(l==7){w=config.weekstartday-startday.getDay();
if(w>0){w=w-7;
}}var ndate;
for(var i=w,j=0;
j<l;
i=i+1,j++){ndate=DateAdd("d",i,startday);
var show=dateFormat.call(ndate,i18n.xgcalendar.dateformat.Md);
days.push({display:show,date:ndate,day:ndate.getDate(),year:ndate.getFullYear(),month:ndate.getMonth()+1});
}option.vstart=days[0].date;
option.vend=days[l-1].date;
option.datestrshow=CalDateShow(days[0].date,days[l-1].date);
$("#"+option.tabName+"txtdatetimeshow").text(option.datestrshow);
}var allDayEvents=[];
var scollDayEvents=[];
var dM=PropareEvents(days,events,allDayEvents,scollDayEvents);
var html=[];
html.push('<div id="'+option.tabName+'test" > <table cellspacing="0" cellpadding="0" border="0"  width="100%"><tr><td> ');
html.push('<div id="'+option.tabName+'dvwkcontaienr" class="wktopcontainer">');
html.push('<table class="wk-top" border="0" cellpadding="0" cellspacing="0" width="100%" >');
BuildWT(html,days,dM);
html.push("</div>");
html.push("</table>");
html.push("</td></tr><tr><td>");
html.push('<div id="'+option.tabName+'dvtec"  class="scolltimeevent">');
if(option.tabName=="timeline"){html.push('<table style="height: 2484px" id="'+option.tabName+'tgTable" class=" tg-timedevents" BORDER="2" CELLPADDING="4">');
}else{html.push('<table style="height:  4875px" id="'+option.tabName+'tgTable" class=" tg-timedevents" BORDER="2" CELLPADDING="4">');
}BuildDayScollEventContainer(html,days,scollDayEvents);
html.push("</tbody></table></div>");
html.push("</td></tr></table></div>");
gridcontainer.html(html.join(""));
html=null;
}function closeCc(){$("#"+option.tabName+"cal-month-cc").css("visibility","hidden");
}function parseDateFromDatabase(value){if((typeof value=="object")&&(value.constructor==Date)){return value;
}value+="";
var date=NaN;
var dateTimeArray=value.split("T");
var dateArray=[];
var timeArray=[];
if(dateTimeArray.length!=3){dateArray=value.split("-");
}if(dateTimeArray.length==2){dateArray=dateTimeArray[0].split("-");
var month=parseInt(dateArray[1],10);
var day=parseInt(dateArray[2],10);
var year=parseInt(dateArray[0],10);
if(year<100){var today=new Date();
var todayYear=today.getFullYear();
var century=parseInt(todayYear/100,10);
year=100*century+year;
if((year-todayYear)>30){year=year-100;
}if((todayYear-year)>70){year=year+100;
}}var hour;
var minute;
timeArray=dateTimeArray[1].split(":");
if(timeArray.length>=2){hour=parseInt(timeArray[0],10);
minute=parseInt(timeArray[1],10);
}if(!(isNaN(day)||isNaN(month)||isNaN(year)||isNaN(hour)||isNaN(minute))){date=new Date(year,month-1,day,hour,minute,0);
var newMonth=date.getMonth()+1;
var newDay=date.getDate();
var newYear=date.getFullYear();
var newHour=date.getHours();
var newMinute=date.getMinutes();
if((newYear!=year)||(newMonth!=month)||(newDay!=day)||(newMinute!=minute)||(newHour!=hour)){date=NaN;
}}}return date;
}function splitEventsStartEnd(sD,eD,fE,event){var tmp_sD=new Date(sD.getFullYear(),sD.getMonth(),sD.getDate(),sD.getHours(),sD.getMinutes(),0);
var tmp_eD=new Date(eD.getFullYear(),eD.getMonth(),eD.getDate(),eD.getHours(),eD.getMinutes()-1,0);
while(tmp_sD.getDate()!=tmp_eD.getDate()){var s={};
s.event=event;
s.day=tmp_sD.getDate();
s.year=tmp_sD.getFullYear();
s.month=tmp_sD.getMonth()+1;
s.daystr=[s.year,s.month,s.day].join("/");
s.st={};
s.st.hour=tmp_sD.getHours();
s.st.minute=tmp_sD.getMinutes();
s.st.p=s.st.hour*60+s.st.minute;
s.et={};
s.et.hour=24;
s.et.minute=0;
s.et.p=s.et.hour*60+s.et.minute;
s.eD=eD;
s.sD=sD;
fE.push(s);
tmp_sD.setDate(tmp_sD.getDate()+1);
tmp_sD.setMinutes(0);
tmp_sD.setHours(0);
}var s={};
s.event=event;
s.day=tmp_sD.getDate();
s.year=tmp_sD.getFullYear();
s.month=tmp_sD.getMonth()+1;
s.daystr=[s.year,s.month,s.day].join("/");
s.st={};
s.st.hour=tmp_sD.getHours();
s.st.minute=tmp_sD.getMinutes();
s.st.p=s.st.hour*60+s.st.minute;
s.et={};
s.et.hour=eD.getHours();
s.et.minute=eD.getMinutes();
s.et.p=s.et.hour*60+s.et.minute;
if(((s.et.p-s.st.p)<=10)&((s.st.p+10)<=1440)){s.et.p=s.st.p+10;
}s.eD=eD;
s.sD=sD;
fE.push(s);
}function PropareEvents(dayarrs,events,aDE,sDE){var l=dayarrs.length;
var el=events.length;
var fE=[];
var deB=aDE;
var deA=sDE;
for(var j=0;
j<el;
j++){var sD=parseDateFromDatabase(events[j].APPT_BEG_DT_TM);
var eD=parseDateFromDatabase(events[j].APPT_END_DT_TM);
if(sD.getDate()!=eD.getDate()||sD.getMonth()!=eD.getMonth()||sD.getFullYear()!=eD.getFullYear()){splitEventsStartEnd(sD,eD,fE,events[j]);
}else{var s={};
s.event=events[j];
s.day=sD.getDate();
s.year=sD.getFullYear();
s.month=sD.getMonth()+1;
s.daystr=[s.year,s.month,s.day].join("/");
s.st={};
s.st.hour=sD.getHours();
s.st.minute=sD.getMinutes();
s.st.p=s.st.hour*60+s.st.minute;
s.et={};
s.et.hour=eD.getHours();
s.et.minute=eD.getMinutes();
s.et.p=s.et.hour*60+s.et.minute;
if(((s.et.p-s.st.p)<=10)&((s.st.p+10)<=1440)){s.et.p=s.st.p+10;
}s.eD=eD;
s.sD=sD;
fE.push(s);
}}fE.sort(function(a,b){return a.st.p-b.st.p;
});
var dMax=0;
for(var i=0;
i<l;
i++){var da=dayarrs[i];
deA[i]=[];
deB[i]=[];
da.daystr=da.year+"/"+da.month+"/"+da.day;
for(var j=0;
j<fE.length;
j++){if(!fE[j].crossday&&!fE[j].allday){if(da.daystr==fE[j].daystr){deA[i].push(fE[j]);
}}else{if(da.daystr==fE[j].daystr){deB[i].push(fE[j]);
dMax++;
}else{if(i==0&&da.date>=fE[j].event[2]&&da.date<=fE[j].event[3]){deB[i].push(fE[j]);
dMax++;
}}}}}var lrdate=dayarrs[l-1].date;
for(var i=0;
i<l;
i++){var de=deB[i];
if(de.length>0){for(var j=0;
j<de.length;
j++){var end=DateDiff("d",lrdate,de[j].event[3])>0?lrdate:de[j].event[3];
de[j].colSpan=DateDiff("d",dayarrs[i].date,end)+1;
}}de=null;
}for(var i=0;
i<l;
i++){var de=deA[i];
if(de.length>0){var x=[];
var y=[];
var D=[];
var dl=de.length;
var Ia;
for(var j=0;
j<dl;
++j){var ge=de[j];
for(var La=ge.st.p,Ia=0;
y[Ia]>La;
){Ia++;
}ge.PO=Ia;
ge.ne=[];
y[Ia]=ge.et.p||1440;
x[Ia]=ge;
if(!D[Ia]){D[Ia]=[];
}D[Ia].push(ge);
if(Ia!=0){ge.pe=[x[Ia-1]];
x[Ia-1].ne.push(ge);
}for(Ia=Ia+1;
y[Ia]<=La;
){Ia++;
}if(x[Ia]){var k=x[Ia];
ge.ne.push(k);
k.pe.push(ge);
}ge.width=1/(ge.PO+1);
ge.left=1-ge.width;
}var k=Array.prototype.concat.apply([],D);
x=y=D=null;
var t=k.length;
for(var y=t;
y--;
){var H=1;
var La=0;
var x=k[y];
for(var D=x.ne.length;
D--;
){var Ia=x.ne[D];
La=Math.max(La,Ia.VL);
H=Math.min(H,Ia.left);
}x.VL=La+1;
x.width=H/(x.PO+1);
x.left=H-x.width;
}for(var y=0;
y<t;
y++){var x=k[y];
x.left=0;
if(x.pe){for(var D=x.pe.length;
D--;
){var H=x.pe[D];
x.left=Math.max(x.left,H.left+H.width);
}}var p=(1-x.left)/x.VL;
x.width=Math.max(x.width,p);
x.aQ=Math.min(1-x.left,x.width);
}de=null;
deA[i]=k;
}}return dMax;
}function suffixDate(d){var tmp=d%10;
if(d==11||d==12||d==13){return i18n.xgcalendar.restDays;
}if(tmp==1){return i18n.xgcalendar.firstDay;
}else{if(tmp==2){return i18n.xgcalendar.secondDay;
}else{if(tmp==3){return i18n.xgcalendar.thridDay;
}else{return i18n.xgcalendar.restDays;
}}}}function BuildWT(ht,dayarrs,dMax){ht.push(" <thead><tr>",'<th width="80" rowspan="0"></th>');
for(var i=0;
i<dayarrs.length;
i++){var ev,title,cl;
if(dayarrs.length==1){ev="";
title="";
cl="";
}else{ev="";
title=i18n.xgcalendar.to_date_view;
cl="wk-daylink";
}var istoday=dateFormat.call(dayarrs[i].date,"yyyyMMdd")==dateFormat.call(new Date(),"yyyyMMdd");
var istoday=dateFormat.call(dayarrs[i].date,"yyyyMMdd")==dateFormat.call(new Date(),"yyyyMMdd");
var onedaymoretoday=false;
if(i!=0){onedaymoretoday=dateFormat.call(dayarrs[i-1].date,"yyyyMMdd")==dateFormat.call(new Date(),"yyyyMMdd");
}if((istoday||onedaymoretoday)&&option.view=="week"){if(i==6){ht.push('<th height="25" abbr=\'',dateFormat.call(dayarrs[i].date,i18n.xgcalendar.dateformat.fulldayvalue),"' class='gcweekname' scope=\"col\"><div title='",title,"' ",ev," class='wk-dayname-highlight-sunday'><span class='",cl,"'>",dayarrs[i].display+suffixDate(dayarrs[i].date.getDate()),"</span></div></th>");
}else{if(onedaymoretoday){ht.push('<th height="25" abbr=\'',dateFormat.call(dayarrs[i].date,i18n.xgcalendar.dateformat.fulldayvalue),"' class='gcweekname' scope=\"col\"><div title='",title,"' ",ev," class='wk-dayname-nextday-highlight'><span class='",cl,"'>",dayarrs[i].display+suffixDate(dayarrs[i].date.getDate()),"</span></div></th>");
}else{ht.push('<th height="25" abbr=\'',dateFormat.call(dayarrs[i].date,i18n.xgcalendar.dateformat.fulldayvalue),"' class='gcweekname' scope=\"col\"><div title='",title,"' ",ev," class='wk-dayname-highlight'><span class='",cl,"'>",dayarrs[i].display+suffixDate(dayarrs[i].date.getDate()),"</span></div></th>");
}}}else{if(i==6){ht.push('<th height="25" abbr=\'',dateFormat.call(dayarrs[i].date,i18n.xgcalendar.dateformat.fulldayvalue),"' class='gcweekname' scope=\"col\"><div title='",title,"' ",ev," class='wk-dayname-sunday'><span class='",cl,"'>",dayarrs[i].display+suffixDate(dayarrs[i].date.getDate()),"</span></div></th>");
}else{ht.push('<th height="25" abbr=\'',dateFormat.call(dayarrs[i].date,i18n.xgcalendar.dateformat.fulldayvalue),"' class='gcweekname' scope=\"col\"><div title='",title,"' ",ev," class='wk-dayname'><span class='",cl,"'>");
if(option.tabName=="timeline"){ht.push(dayarrs[i].display.split(",")[0]);
}else{ht.push(dayarrs[i].display+suffixDate(dayarrs[i].date.getDate()));
}ht.push("</span></div></th>");
}}}ht.push('<th width="21" rowspan="0"></th>');
ht.push("</tr></thead>");
}function BuildDayScollEventContainer(ht,dayarrs,events){ht.push("<tr>");
ht.push("<td style='width:80px;'></td>");
ht.push("<td");
if(dayarrs.length>1){ht.push(" colSpan='",dayarrs.length,"'");
}ht.push('><div id="'+option.tabName+'tgspanningwrapper" class="tg-spanningwrapper"><div style="font-size: 20px" class="tg-hourmarkers">');
ht.push('<div class="tg-emptymarker"></div>');
for(var i=0;
i<48;
i++){ht.push('<div class="tg-dualmarker"></div>');
if(option.tabName!="timeline"){ht.push('<div class="tg-dottedmarker"></div>');
}}var now=new Date();
var h=now.getHours();
var m=now.getMinutes();
var mHg=gP(h,m)-4;
var mhh=mHg+4;
ht.push('<div id="'+option.tabName+'tgnowmarker" class="tg-hourmarker tg-nowmarker" style="left:-20px;top:',mhh,'px"></div>');
ht.push("</div>");
ht.push('<IMG STYLE="position:absolute; TOP:',mHg,'px; LEFT:-30px; WIDTH:9px; HEIGHT:9px" SRC="../img/currentTimeBall.png">');
ht.push("</div></td></tr>");
ht.push("<tr>");
ht.push('<td style="width: 80px" class="tg-times">');
var tmt="";
for(var i=0;
i<48;
i++){tmt=fomartTimeShow(i);
if(option.tabName=="timeline"){ht.push('<div style="height: 51px" class="tg-time">',tmt,"</div>");
}else{ht.push('<div style="height: 101px" class="tg-time">',tmt,"</div>");
}}ht.push("</td>");
var l=dayarrs.length;
for(var i=0;
i<l;
i++){var istoday=dateFormat.call(dayarrs[i].date,"yyyyMMdd")==dateFormat.call(new Date(),"yyyyMMdd");
var onedaymoretoday=false;
if(i!=0){onedaymoretoday=dateFormat.call(dayarrs[i-1].date,"yyyyMMdd")==dateFormat.call(new Date(),"yyyyMMdd");
}if((istoday||onedaymoretoday)&&option.view=="week"){if(i==6){ht.push('<td class="tg-col-highlight-sunday"  style="border-spacing:0 10px;" ch=\'qkadd\' abbr=\'',dateFormat.call(dayarrs[i].date,i18n.xgcalendar.dateformat.fulldayvalue),"'>");
}else{ht.push("<td class=\"tg-col-highlight\" ch='qkadd' abbr='",dateFormat.call(dayarrs[i].date,i18n.xgcalendar.dateformat.fulldayvalue),"'>");
}if(istoday){ht.push('<div style="margin-bottom: -5095px; height:5095px" class="tg-today">&nbsp;</div>');
}}else{if(i==6){ht.push("<td class=\"tg-col-sunday\" ch='qkadd' abbr='",dateFormat.call(dayarrs[i].date,i18n.xgcalendar.dateformat.fulldayvalue),"'>");
}else{ht.push("<td class=\"tg-col\" ch='qkadd' abbr='",dateFormat.call(dayarrs[i].date,i18n.xgcalendar.dateformat.fulldayvalue),"'>");
}}ht.push('<div  style="margin-bottom: -4848px; height: 4848px" id=\''+option.tabName+"tgCol",i,'\' class="tg-col-eventwrapper">');
BuildEvents(ht,events[i],dayarrs[i]);
ht.push("</div>");
ht.push("</td>");
}ht.push("</tr>");
}function BuildEvents(hv,events,sday){for(var i=0;
i<events.length;
i++){var c;
var istoday=dateFormat.call(sday.date,"yyyyMMdd")==dateFormat.call(new Date(),"yyyyMMdd");
if(istoday){c=tc(events[i].event[7]);
}else{c=tc();
}var tt=BuildDayEvent(c,events[i],i);
hv.push(tt);
}}function GetStatus(statusString){var status="";
switch(statusString){case CHECKED_OUT:status="checkedout";
break;
case SEENBYPHYSIC:status="seenbydoctor";
break;
case SEENBYMIDLEV:status="seenbydoctor";
break;
case SEENBYMEDSTU:status="seenbynurse";
break;
case SEENBYRESIDE:status="seenbydoctor";
break;
case SEENBYNURSE:status="seenbynurse";
break;
case SEENBYGEN1:case SEENBYGEN2:case SEENBYGEN3:case SEENBYGEN4:if(getGenericStatusColor(statusString)==1){status="seenbygengreen";
}else{status="seenbygenorange";
}break;
case CHECKED_IN:status="checkedin";
break;
case CONFIRMED:status="confirmed";
break;
case CANCELED:status="cancelled";
break;
case NO_SHOW:status="cancelled";
break;
case HOLD:status="cancelled";
break;
default:status="confirmed";
}return status;
}function BuildDayEvent(theme,e,index){var p={bdcolor:theme[0],bgcolor2:theme[0],bgcolor1:theme[2],width:"70%",icon:"",title:"",data:""};
var StateMeaning="";
var apptStatus="";
if(e.event.ORG_APPT_TYPE==APPT_TYPE_SURG){if(e.event.STATE_MEANING!=null){switch(e.event.STATE_MEANING){case PRE_OP:StateMeaning=i18n.PRE_OP;
p.status="pre-op";
break;
case INTRA_OP:StateMeaning=i18n.INTRA_OP;
p.status="intra-op";
break;
case POST_OP:StateMeaning=i18n.POST_OP;
p.status="post-op";
break;
case CHECKED_IN:StateMeaning=e.event.APPT_STATUS;
p.status="checkedin";
break;
case CONFIRMED:StateMeaning=e.event.APPT_STATUS;
p.status="confirmed";
break;
case SCHEDULED:StateMeaning=e.event.APPT_STATUS;
p.status="confirmed";
break;
case CHECKED_OUT:StateMeaning=e.event.APPT_STATUS;
p.status="checkedout";
break;
case NO_SHOW:StateMeaning=e.event.APPT_STATUS;
p.status="cancelled";
break;
case HOLD:StateMeaning=e.event.APPT_STATUS;
p.status="cancelled";
break;
case"":StateMeaning="";
p.status="cancelled";
break;
case CANCELED:StateMeaning=e.event.APPT_STATUS;
p.status="cancelled";
break;
default:StateMeaning="";
p.status="confirmed";
}}else{StateMeaning="";
p.status="confirmed";
}}else{StateMeaning=e.event.APPT_STATUS;
p.status=GetStatus(e.event.STATE_MEANING);
if(p.status==null){p.status="confirmed";
}}p.starttime=pZero(e.sD.getHours())+":"+pZero(e.sD.getMinutes());
p.endtime=pZero(e.eD.getHours())+":"+pZero(e.eD.getMinutes());
p.description=e.event.APPT_DESC;
p.data=e.event.PERSON_ID+"$"+e.event.ENCNTR_ID;
if(option.tabName=="timeline"||e.event.APPT_REASON_FREE==""){p.reasonforvisit="";
p.reasonforvisitLabel="";
}else{p.reasonforvisit=i18n.REASON+": "+e.event.APPT_REASON_FREE;
p.reasonforvisitLabel=i18n.REASON+"...";
}if(parseInt(e.event.SLOT_TYPE_ID)===0||e.event.PERSON_ID>0){p.title=p.starttime+" - "+p.endtime+"\n"+e.event.PATIENT_NAME+"\n"+e.event.APPT_DESC+"\n"+StateMeaning+"\n"+p.reasonforvisit;
p.content=e.event.PATIENT_NAME;
}else{p.title=p.starttime+" - "+p.endtime+"\n"+e.event.SLOT_MNEMONIC;
p.content='<div class="long-text-display"> '+e.event.SLOT_MNEMONIC+" </div>";
}var icons=[];
icons.push('<I class="cic cic-tmr">&nbsp;</I>');
if(e.reevent){icons.push('<I class="cic cic-spcl">&nbsp;</I>');
}p.icon=icons.join("");
var sP=gP(e.st.hour,e.st.minute);
if(((e.et.hour*60+e.et.minute)-(e.st.hour*60+e.st.minute))<10){if((e.st.hour*60+e.st.minute)+10<=1440){var eP=gP(e.st.hour,e.st.minute+10);
}else{var eP=gP(24,0);
var sP=gP(23,50);
}}else{var eP=gP(e.et.hour,e.et.minute);
}p.top=sP+"px";
p.left=(e.left*100)+"%";
p.width=(e.aQ*100)+"%";
p.height=(eP-sP);
p.i=index;
if(option.enableDrag){p.drag="drag";
p.redisplay="block";
}else{p.drag="";
p.redisplay="none";
}var newtemp=Tp(__SCOLLEVENTTEMP,p);
p=null;
return newtemp;
}function populate(){if(calendarResourceChangeTimer==null&&calendarButtonClickTimer==null&&myDayButtonClickTimer==null&&myDayRefreshTimer==null&&myDayResourceChangeTimer==null){startCalendarRefreshTimer();
}if(option.isloading){return true;
}option.isloading=true;
if(option.onBeforeRequestData&&$.isFunction(option.onBeforeRequestData)){option.onBeforeRequestData(1);
}var zone=new Date().getTimezoneOffset()/60*-1;
var param=[{name:"showdate",value:dateFormat.call(option.showday,i18n.xgcalendar.dateformat.fulldayvalue)},{name:"viewtype",value:option.view},{name:"timezone",value:zone}];
if(option.extParam){for(var pi=0;
pi<option.extParam.length;
pi++){param[param.length]=option.extParam[pi];
}}var testdate=new Date();
if(option.view=="week"){var w=0;
var days=[];
var w=option.weekstartday-option.showday.getDay();
if(w>0){w=w-7;
}var j=0;
var ndate;
for(var i=w,j=0;
j<7;
i=i+1,j++){ndate=DateAdd("d",i,option.showday);
var show=dateFormat.call(ndate,i18n.xgcalendar.dateformat.Md);
days.push({display:show,date:ndate,day:ndate.getDate(),year:ndate.getFullYear(),month:ndate.getMonth()+1});
}option.vstart=days[0].date;
option.vend=days[7-1].date;
var startdate=scaleNumber(option.vstart.getMonth()+1)+"/"+scaleNumber(option.vstart.getDate())+"/"+option.vstart.getYear();
var enddate=scaleNumber(option.vend.getMonth()+1)+"/"+scaleNumber(option.vend.getDate())+"/"+option.vend.getYear();
}else{var startdate=scaleNumber(option.showday.getMonth()+1)+"/"+scaleNumber(option.showday.getDate())+"/"+option.showday.getYear();
var enddate=scaleNumber(option.showday.getMonth()+1)+"/"+scaleNumber(option.showday.getDate())+"/"+option.showday.getYear();
}if(option.personId==""){option.personId=0;
}if(option.resourceId==""){option.resourceId=0;
}var cclParam="'MINE','"+startdate+"','"+enddate+"',"+(parseInt(option.personId,10).toFixed(2))+","+(parseInt(option.resourceId,10).toFixed(2))+"";
cclParam=cclParam.replace(/"/g,"'");
startCalLoadTimer();
AjaxHandler.ajax_request({request:{type:"XMLCCLREQUEST",target:"mp_amb_wklst_get_calendar",async:false,parameters:cclParam},response:{type:"JSON",target:getCalData,async:false,parameters:[]}});
}function getCalData(jsonResponse){startCalRenderTimer();
var respData=jsonResponse.response;
var data={events:[],isSort:false,start:option.vstart,end:option.vend,error:null};
if(respData!=null&&respData.error!=null){if(option.onRequestDataError){option.onRequestDataError(1,data);
}}else{setGenericStatusColor(respData.RECORD_DATA.SEEN_BY_GEN_COLOR);
data.events=respData.RECORD_DATA.APPT_QUAL;
$.each(data.events,function(index,value){value[5]=parseDate(value[5]);
});
responseData(data,data.start,data.end);
}if(option.onAfterRequestData&&$.isFunction(option.onAfterRequestData)){option.onAfterRequestData(1);
}option.isloading=false;
}function setGenericStatusColor(genericStatusArray){for(var index=0;
index<genericStatusArray.length;
index++){genericStatusColor[genericStatusArray[index].STATE_MEANING]=genericStatusArray[index].STATE_COLOR;
}}function getGenericStatusColor(genericStatusMeaning){return genericStatusColor[genericStatusMeaning];
}function scaleNumber(num){if(num<10){return"0"+num;
}else{return""+num;
}}function responseData(data,start,end){var events;
if(data.isSort==true){if(data.events&&data.events.length>0){events=data.sort(function(l,r){return l[5]>r[5]?-1:1;
});
}else{events=[];
}}else{events=data.events;
}if(!events){events=[];
}else{option.eventItems=events;
}render();
}function clearrepeat(events,start,end){var jl=events.length;
if(jl>0){var es=events[0][2];
var el=events[jl-1][2];
for(var i=0,l=option.eventItems.length;
i<l;
i++){if(option.eventItems[i][2]>el||jl==0){break;
}if(option.eventItems[i][2]>=es){for(var j=0;
j<jl;
j++){if(option.eventItems[i][0]==events[j][0]&&option.eventItems[i][2]<start){events.splice(j,1);
jl--;
break;
}}}}}}function ConcatEvents(events,start,end){if(!events){events=[];
}if(events){if(option.eventItems.length==0){option.eventItems=events;
}else{clearrepeat(events,start,end);
var l=events.length;
var sl=option.eventItems.length;
var sI=-1;
var eI=sl;
var s=start;
var e=end;
if(option.eventItems[0][2]>e){option.eventItems=events.concat(option.eventItems);
return;
}if(option.eventItems[sl-1][2]<s){option.eventItems=option.eventItems.concat(events);
return;
}for(var i=0;
i<sl;
i++){if(option.eventItems[i][2]>=s&&sI<0){sI=i;
continue;
}if(option.eventItems[i][2]>e){eI=i;
break;
}}var e1=sI<=0?[]:option.eventItems.slice(0,sI);
var e2=eI==sl?[]:option.eventItems.slice(eI);
option.eventItems=[].concat(e1,events,e2);
events=e1=e2=null;
}}}function weekormonthtoday(e){var th=$(this);
var daystr=th.attr("abbr");
option.showday=strtodate(daystr+" 00:00");
option.view="day";
render();
var istoday=dateFormat.call(option.showday,"yyyyMMdd")==dateFormat.call(new Date(),"yyyyMMdd");
if(option.view=="day"){Util.Style.acss(showtodaybtn,"tab-layout-active");
Util.Style.rcss(showweekbtn,"tab-layout-active");
}else{Util.Style.rcss(showtodaybtn,"tab-layout-active");
Util.Style.acss(showweekbtn,"tab-layout-active");
}if(option.onweekormonthtoday){option.onweekormonthtoday(option);
}return false;
}function parseDate(str){return new Date(Date.parse(str));
}function gP(h,m){var height;
if(option.tabName=="timeline"){height=102;
}else{height=202;
}if(option.view=="day"){return 26+h*height+parseInt(m/60*height,10);
}else{return 25+h*height+parseInt(m/60*height,10);
}}function pZero(n){return n<10?"0"+n:""+n;
}function tc(d){function zc(c,i){var d="666666888888aaaaaabbbbbbdddddda32929cc3333d96666e69999f0c2c2b1365fdd4477e67399eea2bbf5c7d67a367a994499b373b3cca2cce1c7e15229a36633cc8c66d9b399e6d1c2f029527a336699668cb399b3ccc2d1e12952a33366cc668cd999b3e6c2d1f01b887a22aa9959bfb391d5ccbde6e128754e32926265ad8999c9b1c2dfd00d78131096184cb05288cb8cb8e0ba52880066aa008cbf40b3d580d1e6b388880eaaaa11bfbf4dd5d588e6e6b8ab8b00d6ae00e0c240ebd780f3e7b3be6d00ee8800f2a640f7c480fadcb3b1440edd5511e6804deeaa88f5ccb8865a5aa87070be9494d4b8b8e5d4d47057708c6d8ca992a9c6b6c6ddd3dd4e5d6c6274878997a5b1bac3d0d6db5a69867083a894a2beb8c1d4d4dae54a716c5c8d8785aaa5aec6c3cedddb6e6e41898951a7a77dc4c4a8dcdccb8d6f47b08b59c4a883d8c5ace7dcce";
return"#"+d.substring(c*30+i*6,c*30+(i+1)*6);
}var c=d!=null&&d!=undefined?d:option.theme;
return[zc(c,0),zc(c,1),zc(c,2),zc(c,3)];
}function Tp(temp,dataarry){return temp.replace(/\$\{([\w]+)\}/g,function(s1,s2){var s=dataarry[s2];
if(typeof(s)!="undefined"){return s;
}else{return s1;
}});
}function fomartTimeShow(h){var hour="";
if(h%2==0){if(h==24){return h/2+":00 "+i18n.xgcalendar.timeSuffix_PM;
}if(h/2==0||h==48){h=24;
}if(h/2<=12){hour=h/2+":00 "+i18n.xgcalendar.timeSuffix_AM;
}else{hour=(h/2-12)+":00 "+i18n.xgcalendar.timeSuffix_PM;
}}else{if(h==25){return(h/2-0.5)+":30 "+i18n.xgcalendar.timeSuffix_PM;
}if(h/2==0.5){h=25;
}if(h/2<=12.5){hour=(h/2-0.5)+":30 "+i18n.xgcalendar.timeSuffix_AM;
}else{hour=(h/2-0.5-12)+":30 "+i18n.xgcalendar.timeSuffix_PM;
}}return hour;
}function getymformat(date,comparedate,isshowtime,isshowweek,showcompare){var showyear=isshowtime!=undefined?(date.getFullYear()!=new Date().getFullYear()):true;
var showmonth=true;
var showday=true;
var showtime=isshowtime||false;
var showweek=isshowweek||false;
if(comparedate){showyear=comparedate.getFullYear()!=date.getFullYear();
if(comparedate.getFullYear()==date.getFullYear()&&date.getMonth()==comparedate.getMonth()&&date.getDate()==comparedate.getDate()){showyear=showmonth=showday=showweek=false;
}}var a=[];
if(showyear){a.push(i18n.xgcalendar.dateformat.fulldayshow);
}else{if(showmonth){a.push(i18n.xgcalendar.dateformat.Md3);
}else{if(showday){a.push(i18n.xgcalendar.dateformat.day);
}}}a.push(showweek?" (W)":"",showtime?" HH:mm":"");
return a.join("");
}function CalDateShow(startday,endday,isshowtime,isshowweek){if(!endday){return dateFormat.call(startday,getymformat(startday,null,isshowtime));
}else{var strstart=dateFormat.call(startday,getymformat(startday,null,isshowtime,isshowweek));
var strend=dateFormat.call(endday,getymformat(endday,null,isshowtime,isshowweek));
var join=(strend!=""?" - ":"");
return[strstart,strend].join(join);
}}function dochange(){var d=getRdate();
var loaded=checkInEr(d.start,d.end);
if(!loaded){populate();
}}function checkInEr(start,end){var ll=option.loadDateR.length;
if(ll==0){return false;
}var r=false;
var r2=false;
for(var i=0;
i<ll;
i++){r=false,r2=false;
var dr=option.loadDateR[i];
if(start>=dr.startdate&&start<=dr.enddate){r=true;
}if(dateFormat.call(start,"yyyyMMdd")==dateFormat.call(dr.startdate,"yyyyMMdd")||dateFormat.call(start,"yyyyMMdd")==dateFormat.call(dr.enddate,"yyyyMMdd")){r=true;
}if(!end){r2=true;
}else{if(end>=dr.startdate&&end<=dr.enddate){r2=true;
}if(dateFormat.call(end,"yyyyMMdd")==dateFormat.call(dr.startdate,"yyyyMMdd")||dateFormat.call(end,"yyyyMMdd")==dateFormat.call(dr.enddate,"yyyyMMdd")){r2=true;
}}if(r&&r2){break;
}}return r&&r2;
}function strtodate(str){var arr=str.split(" ");
var arr2=arr[0].split(i18n.xgcalendar.dateformat.separator);
var arr3=arr[1].split(":");
var y=arr2[i18n.xgcalendar.dateformat.year_index];
var m=arr2[i18n.xgcalendar.dateformat.month_index].indexOf("0")==0?arr2[i18n.xgcalendar.dateformat.month_index].substr(1,1):arr2[i18n.xgcalendar.dateformat.month_index];
var d=arr2[i18n.xgcalendar.dateformat.day_index].indexOf("0")==0?arr2[i18n.xgcalendar.dateformat.day_index].substr(1,1):arr2[i18n.xgcalendar.dateformat.day_index];
var h=arr3[0].indexOf("0")==0?arr3[0].substr(1,1):arr3[0];
var n=arr3[1].indexOf("0")==0?arr3[1].substr(1,1):arr3[1];
return new Date(y,parseInt(m,10)-1,d,h,n);
}function ResizeView(){var _MH;
if(option.tabName=="timeline"){_MH=$("#TAB_CONTENT_CALENDAR").height();
}else{_MH=$("#timeline-container-id").height();
}var _viewType=option.view;
if(_viewType=="day"||_viewType=="week"){var $dvwkcontaienr=$("#"+option.tabName+"dvwkcontaienr");
var $dvtec=$("#"+option.tabName+"dvtec");
if($dvwkcontaienr.length==0||$dvtec.length==0){alert(i18n.xgcalendar.view_no_ready);
return;
}var dvwkH=$dvwkcontaienr.height()+2;
var calH=option.height-8-dvwkH;
$dvtec.height(calH);
if(typeof(option.scoll)=="undefined"){var currentday=new Date();
var h=currentday.getHours();
var m=currentday.getMinutes();
var th;
if(option.tabName=="timeline"){if(h<13){th=gP(9,53);
}else{th=gP(15,53);
}}else{th=gP(h,m);
}var ch=$dvtec.attr("clientHeight");
var sh=th-0.5*ch;
var ph=$dvtec.attr("scrollHeight");
if(sh<0){sh=0;
}if(sh>ph-ch){sh=ph-ch-10*(23-h);
}$dvtec.attr("scrollTop",sh);
}else{$dvtec.attr("scrollTop",option.scoll);
}}}function returnfalse(){return false;
}function initevents(viewtype){if(viewtype=="week"||viewtype=="day"){$("div.chip",gridcontainer).each(function(i){var chip=$(this);
chip.dblclick(function(){var hddata=chip.find("div.dhdV");
if(hddata.length==1){var str=hddata.text();
data=str.split("$");
location.href='javascript:APPLINK(0,"powerchart.exe","/PERSONID='+data[0]+"/ENCNTRID="+data[1]+'/FIRSTTAB=^^")';
}return false;
});
chip.mousedown(returnfalse);
});
$("div.rb-o",gridcontainer).each(function(i){var chip=$(this);
chip.mousedown(returnfalse);
});
if(option.readonly==false){$("td.tg-col",gridcontainer).each(function(i){$(this).mousedown(function(e){dragStart.call(this,"dw1",e);
return false;
});
});
$("#"+option.tabName+"weekViewAllDaywk").mousedown(function(e){dragStart.call(this,"dw2",e);
return false;
});
}if(viewtype=="week"){$("#"+option.tabName+"dvwkcontaienr th.gcweekname").each(function(i){$(this).click(weekormonthtoday);
});
}}}function startCalLoadTimer(){timerApptLoad=createSLATimer("USR:MPG.DisplayMyCalendar - load component",VERSIONSTR);
}function startCalRenderTimer(){timerApptRender=createSLATimer("ENG:MPG.DisplayMyCalendar - render component",VERSIONSTR);
}function stopCalLoadTimer(){if(timerApptLoad!=null){timerApptLoad.Stop();
}}function stopCalRenderTimer(){if(timerApptRender!=null){timerApptRender.Stop();
}}var c={sv:function(view){if(view==option.view){return;
}clearcontainer();
option.view=view;
populate();
},rf:function(){populate();
},gt:function(d){if(!d){d=new Date();
}option.showday=d;
populate();
},pv:function(){switch(option.view){case"day":var date=AmbulatoryWorklist.getDateTime("CalendarcurrentAppointmentDateTime");
date=DateAdd("d",-1,date);
option.showday=date;
AmbulatoryWorklist.setDateTime("CalendarcurrentAppointmentDateTime",date);
break;
case"week":var date=AmbulatoryWorklist.getDateTime("CalendarcurrentAppointmentDateTime");
date=DateAdd("w",-1,date);
option.showday=date;
AmbulatoryWorklist.setDateTime("CalendarcurrentAppointmentDateTime",date);
break;
}populate();
},nt:function(){switch(option.view){case"day":var date=AmbulatoryWorklist.getDateTime("CalendarcurrentAppointmentDateTime");
date=DateAdd("d",1,date);
option.showday=date;
AmbulatoryWorklist.setDateTime("CalendarcurrentAppointmentDateTime",date);
break;
case"week":var date=AmbulatoryWorklist.getDateTime("CalendarcurrentAppointmentDateTime");
date=DateAdd("w",1,date);
option.showday=date;
AmbulatoryWorklist.setDateTime("CalendarcurrentAppointmentDateTime",date);
break;
}populate();
},go:function(){return option;
},so:function(p){option=$.extend(option,p);
}};
this[0].bcal=c;
return this;
};
$.fn.swtichView=function(view){return this.each(function(){if(this.bcal){this.bcal.sv(view);
}});
};
$.fn.reload=function(){return this.each(function(){if(this.bcal){this.bcal.rf();
}});
};
$.fn.initialCalendarLoad=function(op){return this.each(function(){if(this[0].bcal){bcalendar(op);
return this[0].bcal.go();
}return null;
});
};
$.fn.gotoDate=function(d){return this.each(function(){if(this.bcal){this.bcal.gt(d);
}});
};
$.fn.previousRange=function(){return this.each(function(){if(this.bcal){this.bcal.pv();
}});
};
$.fn.nextRange=function(){return this.each(function(){if(this.bcal){this.bcal.nt();
}});
};
$.fn.BcalGetOp=function(){if(this[0].bcal){return this[0].bcal.go();
}return null;
};
$.fn.BcalSetOp=function(p){if(this[0].bcal){return this[0].bcal.so(p);
}};
})(jQuery);
(function($){if(!dateFormat||typeof(dateFormat)!="function"){var dateFormat=function(format){var o={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"H+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),w:"0123456".indexOf(this.getDay()),S:this.getMilliseconds()};
if(/(y+)/.test(format)){format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));
}for(var k in o){if(new RegExp("("+k+")").test(format)){format=format.replace(RegExp.$1,RegExp.$1.length==1?o[k]:("00"+o[k]).substr((""+o[k]).length));
}}return format;
};
}if(!DateAdd||typeof(DateDiff)!="function"){var DateAdd=function(interval,number,idate){number=parseInt(number,10);
var date;
if(typeof(idate)=="string"){date=idate.split(/\D/);
eval("var date = new Date("+date.join(",")+")");
}if(typeof(idate)=="object"){date=new Date(idate.toString());
}switch(interval){case"y":date.setFullYear(date.getFullYear()+number);
break;
case"m":date.setMonth(date.getMonth()+number);
break;
case"d":date.setDate(date.getDate()+number);
break;
case"w":date.setDate(date.getDate()+7*number);
break;
case"h":date.setHours(date.getHours()+number);
break;
case"n":date.setMinutes(date.getMinutes()+number);
break;
case"s":date.setSeconds(date.getSeconds()+number);
break;
case"l":date.setMilliseconds(date.getMilliseconds()+number);
break;
}return date;
};
}if(!DateDiff||typeof(DateDiff)!="function"){var DateDiff=function(interval,d1,d2){switch(interval){case"d":case"w":d1=new Date(d1.getFullYear(),d1.getMonth(),d1.getDate());
d2=new Date(d2.getFullYear(),d2.getMonth(),d2.getDate());
break;
case"h":d1=new Date(d1.getFullYear(),d1.getMonth(),d1.getDate(),d1.getHours());
d2=new Date(d2.getFullYear(),d2.getMonth(),d2.getDate(),d2.getHours());
break;
case"n":d1=new Date(d1.getFullYear(),d1.getMonth(),d1.getDate(),d1.getHours(),d1.getMinutes());
d2=new Date(d2.getFullYear(),d2.getMonth(),d2.getDate(),d2.getHours(),d2.getMinutes());
break;
case"s":d1=new Date(d1.getFullYear(),d1.getMonth(),d1.getDate(),d1.getHours(),d1.getMinutes(),d1.getSeconds());
d2=new Date(d2.getFullYear(),d2.getMonth(),d2.getDate(),d2.getHours(),d2.getMinutes(),d2.getSeconds());
break;
}var t1=d1.getTime(),t2=d2.getTime();
var diff=NaN;
switch(interval){case"y":diff=d2.getFullYear()-d1.getFullYear();
break;
case"m":diff=(d2.getFullYear()-d1.getFullYear())*12+d2.getMonth()-d1.getMonth();
break;
case"d":diff=Math.floor(t2/86400000)-Math.floor(t1/86400000);
break;
case"w":diff=Math.floor((t2+345600000)/(604800000))-Math.floor((t1+345600000)/(604800000));
break;
case"h":diff=Math.floor(t2/3600000)-Math.floor(t1/3600000);
break;
case"n":diff=Math.floor(t2/60000)-Math.floor(t1/60000);
break;
case"s":diff=Math.floor(t2/1000)-Math.floor(t1/1000);
break;
case"l":diff=t2-t1;
break;
}return diff;
};
}var userAgent=window.navigator.userAgent.toLowerCase();
$.browser.msie8=$.browser.msie&&/msie 8\.0/i.test(userAgent);
$.browser.msie7=$.browser.msie&&/msie 7\.0/i.test(userAgent);
$.browser.msie6=!$.browser.msie8&&!$.browser.msie7&&$.browser.msie&&/msie 6\.0/i.test(userAgent);
if($.fn.noSelect==undefined){$.fn.noSelect=function(p){if(p==null){prevent=true;
}else{prevent=p;
}if(prevent){return this.each(function(){if($.browser.msie||$.browser.safari){$(this).bind("selectstart",function(){return false;
});
}else{if($.browser.mozilla){$(this).css("MozUserSelect","none");
$("body").trigger("focus");
}else{if($.browser.opera){$(this).bind("mousedown",function(){return false;
});
}else{$(this).attr("unselectable","on");
}}}});
}else{return this.each(function(){if($.browser.msie||$.browser.safari){$(this).unbind("selectstart");
}else{if($.browser.mozilla){$(this).css("MozUserSelect","inherit");
}else{if($.browser.opera){$(this).unbind("mousedown");
}else{$(this).removeAttr("unselectable","on");
}}}});
}};
}$.fn.datepicker=function(o){var def={weekStart:0,weekName:[i18n.datepicker.dateformat.sun,i18n.datepicker.dateformat.mon,i18n.datepicker.dateformat.tue,i18n.datepicker.dateformat.wed,i18n.datepicker.dateformat.thu,i18n.datepicker.dateformat.fri,i18n.datepicker.dateformat.sat],monthName:[i18n.datepicker.dateformat.jan,i18n.datepicker.dateformat.feb,i18n.datepicker.dateformat.mar,i18n.datepicker.dateformat.apr,i18n.datepicker.dateformat.may,i18n.datepicker.dateformat.jun,i18n.datepicker.dateformat.jul,i18n.datepicker.dateformat.aug,i18n.datepicker.dateformat.sep,i18n.datepicker.dateformat.oct,i18n.datepicker.dateformat.nov,i18n.datepicker.dateformat.dec],monthp:i18n.datepicker.dateformat.postfix,Year:new Date().getFullYear(),Month:new Date().getMonth()+1,Day:new Date().getDate(),today:new Date(),btnOk:i18n.datepicker.ok,btnCancel:i18n.datepicker.cancel,btnToday:i18n.datepicker.today,inputDate:null,onReturn:false,version:"1.1",applyrule:false,showtarget:null,picker:""};
$.extend(def,o);
var cp=$("#BBIT_DP_CONTAINER");
if(cp.length==0){var cpHA=[];
cpHA.push("<div id='BBIT_DP_CONTAINER' class='bbit-dp' style='position:absolute; left:200px;top:200px;width:196px;z-index:999;'>");
if($.browser.msie6){cpHA.push('<iframe style="position:absolute;z-index:-1;width:100%;height:205px;top:100;left:100;scrolling:no;" frameborder="0" src="about:blank"></iframe>');
}cpHA.push("<table class='dp-maintable' cellspacing='0' cellpadding='0' style='width:190px;'><tbody><tr><td>");
cpHA.push("<table class='bbit-dp-top' cellspacing='0'><tr><td class='bbit-dp-top-left'> <a id='BBIT_DP_LEFTBTN' href='javascript:void(0);' title='",i18n.datepicker.prev_month_title,"'>&nbsp;</a></td><td class='bbit-dp-top-center' align='center'><em><button id='BBIT_DP_YMBTN'></button></em></td><td class='bbit-dp-top-right'><a id='BBIT_DP_RIGHTBTN' href='javascript:void(0);' title='",i18n.datepicker.next_month_title,"'>&nbsp;</a></td></tr></table>");
cpHA.push("</td></tr>");
cpHA.push("<tr><td>");
cpHA.push("<table id='BBIT_DP_INNER' class='bbit-dp-inner' cellspacing='0'><thead><tr>");
for(var i=def.weekStart,j=0;
j<7;
j++){cpHA.push("<th><span>",def.weekName[i],"</span></th>");
if(i==6){i=0;
}else{i++;
}}cpHA.push("</tr></thead>");
cpHA.push("<tbody></tbody></table>");
cpHA.push("</td></tr>");
cpHA.push("<tr><td class='bbit-dp-bottom' align='center'><button id='BBIT-DP-TODAY'>",def.btnToday,"</button></td></tr>");
cpHA.push("</tbody></table>");
cpHA.push("<div id='BBIT-DP-MP' class='bbit-dp-mp'  style='z-index:auto;'><table id='BBIT-DP-T' style='width: 190px; height: 193px' border='0' cellspacing='0'><tbody>");
cpHA.push("<tr>");
cpHA.push("<td class='bbit-dp-mp-month' xmonth='0'><a href='javascript:void(0);'>",def.monthName[0],"</a></td><td class='bbit-dp-mp-month bbit-dp-mp-sep' xmonth='6'><a href='javascript:void(0);'>",def.monthName[6],"</a></td><td class='bbit-dp-mp-ybtn' align='middle'><a id='BBIT-DP-MP-PREV' class='bbit-dp-mp-prev'></a></td><td class='bbit-dp-mp-ybtn' align='middle'><a id='BBIT-DP-MP-NEXT' class='bbit-dp-mp-next'></a></td>");
cpHA.push("</tr>");
cpHA.push("<tr>");
cpHA.push("<td class='bbit-dp-mp-month' xmonth='1'><a href='javascript:void(0);'>",def.monthName[1],"</a></td><td class='bbit-dp-mp-month bbit-dp-mp-sep' xmonth='7'><a href='javascript:void(0);'>",def.monthName[7],"</a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td>");
cpHA.push("</tr>");
cpHA.push("<tr>");
cpHA.push("<td class='bbit-dp-mp-month' xmonth='2'><a href='javascript:void(0);'>",def.monthName[2],"</a></td><td class='bbit-dp-mp-month bbit-dp-mp-sep' xmonth='8'><a href='javascript:void(0);'>",def.monthName[8],"</a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td>");
cpHA.push("</tr>");
cpHA.push("<tr>");
cpHA.push("<td class='bbit-dp-mp-month' xmonth='3'><a href='javascript:void(0);'>",def.monthName[3],"</a></td><td class='bbit-dp-mp-month bbit-dp-mp-sep' xmonth='9'><a href='javascript:void(0);'>",def.monthName[9],"</a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td>");
cpHA.push("</tr>");
cpHA.push("<tr>");
cpHA.push("<td class='bbit-dp-mp-month' xmonth='4'><a href='javascript:void(0);'>",def.monthName[4],"</a></td><td class='bbit-dp-mp-month bbit-dp-mp-sep' xmonth='10'><a href='javascript:void(0);'>",def.monthName[10],"</a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td>");
cpHA.push("</tr>");
cpHA.push("<tr>");
cpHA.push("<td class='bbit-dp-mp-month' xmonth='5'><a href='javascript:void(0);'>",def.monthName[5],"</a></td><td class='bbit-dp-mp-month bbit-dp-mp-sep' xmonth='11'><a href='javascript:void(0);'>",def.monthName[11],"</a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td>");
cpHA.push("</tr>");
cpHA.push("<tr class='bbit-dp-mp-btns'>");
cpHA.push("<td colspan='4'><button id='BBIT-DP-MP-OKBTN' class='bbit-dp-mp-ok'>",def.btnOk,"</button><button id='BBIT-DP-MP-CANCELBTN' class='bbit-dp-mp-cancel'>",def.btnCancel,"</button></td>");
cpHA.push("</tr>");
cpHA.push("</tbody></table>");
cpHA.push("</div>");
cpHA.push("</div>");
var s=cpHA.join("");
$(document.body).append(s);
cp=$("#BBIT_DP_CONTAINER");
initevents();
}function initevents(){$("#BBIT-DP-TODAY").click(returntoday);
cp.click(returnfalse);
$("#BBIT_DP_INNER tbody").click(tbhandler);
$("#BBIT_DP_LEFTBTN").click(prevm);
$("#BBIT_DP_RIGHTBTN").click(nextm);
$("#BBIT_DP_YMBTN").click(showym);
$("#BBIT-DP-MP").click(mpclick).dblclick(mpdblclick);
$("#BBIT-DP-MP-PREV").click(mpprevy);
$("#BBIT-DP-MP-NEXT").click(mpnexty);
$("#BBIT-DP-MP-OKBTN").click(mpok);
$("#BBIT-DP-MP-CANCELBTN").click(mpcancel);
}function mpcancel(){$("#BBIT-DP-MP").animate({top:-193},{duration:200,complete:function(){$("#BBIT-DP-MP").hide();
}});
return false;
}function mpok(){def.Year=def.cy;
def.Month=def.cm+1;
def.Day=1;
$("#BBIT-DP-MP").animate({top:-193},{duration:200,complete:function(){$("#BBIT-DP-MP").hide();
}});
writecb();
return false;
}function mpprevy(){var y=def.ty-10;
def.ty=y;
rryear(y);
return false;
}function mpnexty(){var y=def.ty+10;
def.ty=y;
rryear(y);
return false;
}function rryear(y){var s=y-4;
var ar=[];
for(var i=0;
i<5;
i++){ar.push(s+i);
ar.push(s+i+5);
}$("#BBIT-DP-MP td.bbit-dp-mp-year").each(function(i){if(def.Year==ar[i]){$(this).addClass("bbit-dp-mp-sel");
}else{$(this).removeClass("bbit-dp-mp-sel");
}$(this).html("<a href='javascript:void(0);'>"+ar[i]+"</a>").attr("xyear",ar[i]);
});
}function mpdblclick(e){var et=e.target||e.srcElement;
var td=getTd(et);
if(td==null){return false;
}if($(td).hasClass("bbit-dp-mp-month")||$(td).hasClass("bbit-dp-mp-year")){mpok(e);
}return false;
}function mpclick(e){var panel=$(this);
var et=e.target||e.srcElement;
var td=getTd(et);
if(td==null){return false;
}if($(td).hasClass("bbit-dp-mp-month")){if(!$(td).hasClass("bbit-dp-mp-sel")){var ctd=panel.find("td.bbit-dp-mp-month.bbit-dp-mp-sel");
if(ctd.length>0){ctd.removeClass("bbit-dp-mp-sel");
}$(td).addClass("bbit-dp-mp-sel");
def.cm=parseInt($(td).attr("xmonth"),10);
}}if($(td).hasClass("bbit-dp-mp-year")){if(!$(td).hasClass("bbit-dp-mp-sel")){var ctd=panel.find("td.bbit-dp-mp-year.bbit-dp-mp-sel");
if(ctd.length>0){ctd.removeClass("bbit-dp-mp-sel");
}$(td).addClass("bbit-dp-mp-sel");
def.cy=parseInt($(td).attr("xyear"),10);
}}return false;
}function showym(){var mp=$("#BBIT-DP-MP");
var y=def.Year;
def.cy=def.ty=y;
var m=def.Month-1;
def.cm=m;
var ms=$("#BBIT-DP-MP td.bbit-dp-mp-month");
for(var i=ms.length-1;
i>=0;
i--){var ch=$(ms[i]).attr("xmonth");
if(ch==m){$(ms[i]).addClass("bbit-dp-mp-sel");
}else{$(ms[i]).removeClass("bbit-dp-mp-sel");
}}rryear(y);
mp.css("top",-193).show().animate({top:0},{duration:200});
}function getTd(elm){if(elm.tagName.toUpperCase()=="TD"){return elm;
}else{if(elm.tagName.toUpperCase()=="BODY"){return null;
}else{var p=$(elm).parent();
if(p.length>0){if(p[0].tagName.toUpperCase()!="TD"){return getTd(p[0]);
}else{return p[0];
}}}}return null;
}function tbhandler(e){var et=e.target||e.srcElement;
var td=getTd(et);
if(td==null){return false;
}var $td=$(td);
if(!$(td).hasClass("bbit-dp-disabled")){var s=$td.attr("xdate");
cp.data("indata",stringtodate(s));
returndate();
}return false;
}function returnfalse(){return false;
}function stringtodate(datestr){try{var arrs=datestr.split(i18n.datepicker.dateformat.separator);
var year=parseInt(arrs[i18n.datepicker.dateformat.year_index],10);
var month=parseInt(arrs[i18n.datepicker.dateformat.month_index],10)-1;
var day=parseInt(arrs[i18n.datepicker.dateformat.day_index],10);
return new Date(year,month,day);
}catch(e){return null;
}}function prevm(){if(def.Month==1){def.Year--;
def.Month=12;
}else{def.Month--;
}writecb();
return false;
}function nextm(){if(def.Month==12){def.Year++;
def.Month=1;
}else{def.Month++;
}writecb();
return false;
}function returntoday(){cp.data("indata",new Date());
returndate();
}function returndate(){var ct=cp.data("ctarget");
var ck=cp.data("cpk");
var re=cp.data("onReturn");
var ndate=cp.data("indata");
var ads=cp.data("ads");
var ade=cp.data("ade");
var dis=false;
if(ads&&ndate<ads){dis=true;
}if(ade&&ndate>ade){dis=true;
}if(dis){return;
}if(re&&jQuery.isFunction(re)){re.call(ct[0],cp.data("indata"));
}else{ct.val(dateFormat.call(cp.data("indata"),i18n.datepicker.dateformat.fulldayvalue));
}ck.attr("isshow","0");
cp.removeData("ctarget").removeData("cpk").removeData("indata").removeData("onReturn").removeData("ads").removeData("ade");
cp.css("visibility","hidden");
ct=ck=null;
}function writecb(){var tb=$("#BBIT_DP_INNER tbody");
$("#BBIT_DP_YMBTN").html(def.monthName[def.Month-1]+def.monthp+" "+def.Year);
var firstdate=new Date(def.Year,def.Month-1,1);
var diffday=def.weekStart-firstdate.getDay();
var showmonth=def.Month-1;
if(diffday>0){diffday-=7;
}var startdate=DateAdd("d",diffday,firstdate);
var enddate=DateAdd("d",42,startdate);
var ads=cp.data("ads");
var ade=cp.data("ade");
var bhm=[];
var tds=dateFormat.call(def.today,i18n.datepicker.dateformat.fulldayvalue);
var indata=cp.data("indata");
var ins=indata!=null?dateFormat.call(indata,i18n.datepicker.dateformat.fulldayvalue):"";
for(var i=1;
i<=42;
i++){if(i%7==1){bhm.push("<tr>");
}var ndate=DateAdd("d",i-1,startdate);
var tdc=[];
var dis=false;
if(ads&&ndate<ads){dis=true;
}if(ade&&ndate>ade){dis=true;
}if(ndate.getMonth()<showmonth){tdc.push("bbit-dp-prevday");
}else{if(ndate.getMonth()>showmonth){tdc.push("bbit-dp-nextday");
}}if(dis){tdc.push("bbit-dp-disabled");
}else{tdc.push("bbit-dp-active");
}var s=dateFormat.call(ndate,i18n.datepicker.dateformat.fulldayvalue);
if(s==tds){tdc.push("bbit-dp-today");
}if(s==ins){tdc.push("bbit-dp-selected");
}bhm.push("<td class='",tdc.join(" "),"' title='",dateFormat.call(ndate,i18n.datepicker.dateformat.fulldayvalue),"' xdate='",dateFormat.call(ndate,i18n.datepicker.dateformat.fulldayvalue),"'><a href='javascript:void(0);'><em><span>",ndate.getDate(),"</span></em></a></td>");
if(i%7==0){bhm.push("</tr>");
}}tb.html(bhm.join(""));
}return $(this).each(function(){var obj=$(this).addClass("bbit-dp-input");
var picker=$(def.picker);
def.showtarget==null&&obj.after(picker);
picker.click(function(e){var pickerId=picker.attr("id");
var isshow=$(this).attr("isshow");
var me=$(this);
if(cp.css("visibility")=="visible"){me.attr("isshow","0");
cp.removeData("ctarget").removeData("cpk").removeData("indata");
cp.css("visibility","hidden");
$("#showDatePickerId").removeClass("date-expand");
}if(isshow=="1"){me.attr("isshow","0");
cp.removeData("ctarget").removeData("cpk").removeData("indata").removeData("onReturn");
return false;
}var v=obj.val();
if(v!=""){v=stringtodate(v);
}if(v==null||v==""){def.Year=new Date().getFullYear();
def.Month=new Date().getMonth()+1;
def.Day=new Date().getDate();
def.inputDate=null;
}else{def.Year=v.getFullYear();
def.Month=v.getMonth()+1;
def.Day=v.getDate();
def.inputDate=v;
}var currDate=AmbulatoryWorklist.getDateTime(pickerId=="showDatePickerId"?"currentAppointmentDateTime":"CalendarcurrentAppointmentDateTime");
def.Year=currDate.getFullYear();
def.Month=currDate.getMonth()+1;
def.Day=currDate.getDate();
def.today=currDate;
def.inputDate=currDate;
cp.data("ctarget",obj).data("cpk",me).data("indata",def.inputDate).data("onReturn",def.onReturn);
if(def.applyrule&&$.isFunction(def.applyrule)){var rule=def.applyrule.call(obj,obj[0].id);
if(rule){if(rule.startdate){cp.data("ads",rule.startdate);
}else{cp.removeData("ads");
}if(rule.enddate){cp.data("ade",rule.enddate);
}else{cp.removeData("ade");
}}}else{cp.removeData("ads").removeData("ade");
}writecb();
$("#BBIT-DP-T").height(cp.height());
var t=def.showtarget||obj;
var pos=t.offset();
var height=t.outerHeight();
var w=cp.width();
var h=cp.height();
var positionRight=0;
var positionHeight=5;
if(pickerId=="showDatePickerId"){positionRight=(w-t.width())+4;
positionHeight=0;
picker.addClass("date-expand");
}var newpos={left:pos.left-positionRight,top:pos.top+height+positionHeight};
var bw=document.body.clientWidth;
var bh=document.body.clientHeight;
if((newpos.left+w)>=bw){newpos.left=bw-w-2;
}if((newpos.top+h)>=bh){newpos.top=pos.top-h-2;
}if(newpos.left<0){newpos.left=10;
}if(newpos.top<0){newpos.top=10;
}$("#BBIT-DP-MP").hide();
newpos.visibility="visible";
cp.css(newpos);
$(this).attr("isshow","1");
$(document).one("click",function(e){me.attr("isshow","0");
cp.removeData("ctarget").removeData("cpk").removeData("indata");
cp.css("visibility","hidden");
$("#showDatePickerId").removeClass("date-expand");
});
return false;
});
});
};
})(jQuery);
