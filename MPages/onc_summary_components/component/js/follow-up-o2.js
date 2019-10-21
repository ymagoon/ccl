function FollowUpComponentO2Style() {
	this.initByNamespace("fu-o2");
}
FollowUpComponentO2Style.prototype = new ComponentStyle();
FollowUpComponentO2Style.prototype.constructor = ComponentStyle;
function FollowUpComponentO2(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new FollowUpComponentO2Style());
	this.setComponentLoadTimerName("USR:MPG.FOLLOWUP.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.FOLLOWUP.O2 - render component");
	this.setIncludeLineNumber(true);
	this.setScope(2);
	this.m_trackingGroupCd = 0;
	this.m_selectedFollowupArray = [];
	this.m_clinicalFollowupArray = [];
	this.m_favoriteFollowupArray = [];
	this.m_addressFollowupArray = [];
	this.m_withinDateRangeArray = [];
	this.m_predefinedCommentsArray = [];
	this.m_followupComponentIndex = {
		PROVIDER : 0,
		LOCATION : 1
	};
	this.m_commentCharLimit = 255;
	this.m_followupDetails = new this.FollowupDetailsInstance();
	this.m_selectedTab = this.m_followupComponentIndex.PROVIDER;
	this.m_tabNames = [];
	this.m_tabsData = [];
	// the side panel object for followUp  Component Table
	this.m_sidePanel = null;
	this.m_showPanel = false;
	this.m_sidePanelContainer = null;
	this.m_clickedRow = null;
	this.m_prevSelectedAddress = "";
	// offset for adjusting scroll to specified row
	this.m_offsetTopAdjustment = null;
	this.m_resultCount = 0;
}
FollowUpComponentO2.prototype = new MPageComponent();
FollowUpComponentO2.prototype.constructor = MPageComponent;
FollowUpComponentO2.prototype.setPlusAddEnabled = function () {
	this.m_isPlusAdd = true;
};
FollowUpComponentO2.prototype.openTab = function () {
	try {
		var criterion = this.getCriterion();
		var followupObj = {};
		followupObj = window.external.DiscernObjectFactory("PATIENTEDUCATION");
		MP_Util.LogDiscernInfo(this, "PATIENTEDUCATION", "followup.js", "openTab");
		var personId = criterion.person_id;
		var encntrId = criterion.encntr_id;
		followupObj.SetPatient(personId, encntrId);
		followupObj.SetDefaultTab(1);
		followupObj.DoModal();
		this.retrieveComponentData();
	} catch (err) {
		MP_Util.LogJSError(err, null, "follow-up-02.js", "openTab");
	}
};
/**
 * Returns selected follow up count.
 * @return {numeric} This function returns the selected follow up count value
 */
FollowUpComponentO2.prototype.getResultCount = function () {
	return this.m_resultCount;
};
/**
 * Holds the count of the selected follow up.
 * @return {undefined} This function does not return a value
 */
FollowUpComponentO2.prototype.setResultCount = function (count) {
	this.m_resultCount = count;
};
FollowUpComponentO2.prototype.setTrackingGroupCd = function (trackingGroupCd) {
	this.m_trackingGroupCd = trackingGroupCd;
};
FollowUpComponentO2.prototype.getTrackingGroupCd = function () {
	return this.m_trackingGroupCd;
};
FollowUpComponentO2.prototype.setSelectedFollowupArray = function (followupArray) {
	this.m_selectedFollowupArray = followupArray;
};
FollowUpComponentO2.prototype.getSelectedFollowupArray = function () {
	return this.m_selectedFollowupArray;
};
FollowUpComponentO2.prototype.setClinicalFollowupArray = function (clinicalArray) {
	this.m_clinicalFollowupArray = clinicalArray;
};
FollowUpComponentO2.prototype.getClinicalFollowupArray = function () {
	return this.m_clinicalFollowupArray;
};
FollowUpComponentO2.prototype.setFavoritesFollowupArray = function (favoriteFollowupArray) {
	this.m_favoriteFollowupArray = favoriteFollowupArray;
};
FollowUpComponentO2.prototype.getFavoritesFollowupArray = function () {
	return this.m_favoriteFollowupArray;
};
FollowUpComponentO2.prototype.setDateRangeArray = function (dateRangeArray) {
	this.m_withinDateRangeArray = dateRangeArray;
};
FollowUpComponentO2.prototype.getDateRangeArray = function () {
	return this.m_withinDateRangeArray;
};
FollowUpComponentO2.prototype.MapObject = function (name, value) {
	this.name = name;
	this.value = value;
};
FollowUpComponentO2.prototype.getPredefinedCommentsArray = function () {
	return this.m_predefinedCommentsArray;
};
FollowUpComponentO2.prototype.setPredefinedCommentsArray = function (commentsObj) {
	this.m_predefinedCommentsArray = commentsObj;
};
FollowUpComponentO2.prototype.FollowupDetailsInstance = function () {
	this.id = 0;
	this.patEdFollowupId = 0;
	this.whoId = 0;
	this.whoType = "";
	this.whoString = "";
	this.whenDtTm = "";
	this.whenWithIn = "";
	this.whenWithInCd = 0;
	this.whenNeededInd = 0;
	this.addressLongText = "";
	this.daysOrWeek = -1;
	this.followupDays = 0;
	this.addressLongTextId = 0;
	this.addressId = 0;
	this.commentText = "";
	this.organizationId = 0;
	this.quickPickCd = 0;
	this.date = "";
	this.time = "";
	this.favoriteInfo = "";
	this.addressList = [];
	this.phoneList = [];
	this.isFollowupTypeFavorite = false;
};
FollowUpComponentO2.prototype.preProcessing = function () {
	var i18nFollowUp = i18n.discernabu.FollowupComponent_O2;
	var numberOfTabs = 2;
	this.m_tabNames[this.m_followupComponentIndex.PROVIDER] = i18nFollowUp.PROVIDER;
	this.m_tabNames[this.m_followupComponentIndex.LOCATION] = i18nFollowUp.LOCATION;
	for (var tabIndex = 0; tabIndex <= numberOfTabs;tabIndex++) {
		this.m_tabsData.push({
			hideMenu : true,
			count : null,
			html : "",
			menuHtml : "",
			tabPostProcess : null
		});
	}
};
FollowUpComponentO2.prototype.refreshComponent = function () {
	this.m_selectedTab = this.m_followupComponentIndex.PROVIDER;
	this.m_clickedRow = null;
	this.retrieveComponentData();
};
FollowUpComponentO2.prototype.retrieveComponentData = function () {
	var criterion = this.getCriterion();
	this.m_clickedRow = null;
	var followupInd = 1;
	var sendAr = [];
	var scriptRequest = new ComponentScriptRequest();
	sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", followupInd);
	scriptRequest.setParameterArray(sendAr);
	scriptRequest.setComponent(this);
	scriptRequest.setProgramName("MP_RETRIEVE_FOLLOWUP");
	scriptRequest.setAsyncIndicator(true);
	scriptRequest.performRequest();
};
FollowUpComponentO2.prototype.renderComponent = function (recordData) {
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var criterion = this.getCriterion();
	var i18nFollowUp = i18n.discernabu.FollowupComponent_O2;
	var numberOfTabs = this.m_tabNames.length;
	var tabName;
	var capTimer = MP_Util.CreateTimer("CAP:MPG.FOLLOWUP.O2 - Rendering component");
	var timerRenderComponent = MP_Util.CreateTimer(this.getComponentRenderTimerName(), this.getCriterion().category_mean);
	try {
		var htmlArray = ["<div class='" + compNS + "-content' id='" + compNS + compId + "-content'><div class='" + compNS + "-top-container'><div class='" + compNS + "-favorites-container' id='favoritesContainer" + compId + "'><div class='" + compNS + "-legend'>" + i18nFollowUp.PERSONAL_FAVORITES + "</div><div id='" + compNS + "-favorites-fieldset" + compId + "' class='" + compNS + "-favorites-content'></div></div><div class='" + compNS + "-facility-container'><div class='" + compNS + "-legend'>" + i18nFollowUp.QUICK_PICKS + "</div><div class='" + compNS + "-facility-inner-container'><div id='quickPicksContainer" + compId + "'  class='" + compNS + "-quick-picks-container'><div id='" + compNS + "-quick-picks-fieldset" + compId + "' class='" + compNS + "-quick-picks-content'></div></div></div></div><div class='" + compNS + "-tab-container' id='tabContainer"+compId+"'><div class='" + compNS + "-legend'>" + i18nFollowUp.SEARCH + "</div><div class='" + compNS + "-search-content'><div class='" + compNS + "-tabs'>"];		
		htmlArray.push("<div id='autosearch-" + compId + "' class='" + compNS + "-search'>" + MP_Util.CreateAutoSuggestBoxHtml(this) + "</div>");
		for (var tabCount = 0;
			tabCount < numberOfTabs;
			tabCount++) {
			tabName = this.m_tabNames[tabCount];
			if (tabCount===0) {
				htmlArray.push("<div class='" + compNS + "-search-button'><input class='" + compNS + "-tab' type='radio' name='provider"+compId+"'  value='In' id='" + compId + "-" + tabCount + "'  checked><span class='" + compNS + "-search-button-name'>", tabName, "</span></div>");
			} else {
				htmlArray.push("<div class='" + compNS + "-search-button'><input class='" + compNS + "-tab' type='radio' name='provider"+compId+"'  value='In' id='" + compId + "-" + tabCount + "' ><span class='" + compNS + "-search-button-name'>", tabName, "</span></div>");
			}
		}
		htmlArray.push("</div></div></div></div><div class='" + compNS + "-instructions-container' id='" + compNS + compId + "-table-container'></div></div>");
		this.setResultCount(recordData.FOLLOW_UP.length);
		this.updateSatisfierRequirementIndicator();
		this.finalizeComponent(htmlArray.join(""), "");
		this.renderFollowUpTable(recordData);
		$("#autosearch-"+compId).append("<span id='" + compId + "-clear-sugg-text' class='" + compNS + "-clear-sugg-text'></span>");
		this.attachListners();
		this.setClinicalOrganization(recordData.ORGANIZATIONS);
		this.displayQuickPickDetails(recordData);
		this.setDateRangeArray(recordData.WITH_IN_RANGE);
		this.setTrackingGroupCd(recordData.TRACKING_GROUP_CD);
		this.getFollowUpFavorites();
		this.setPredefinedCommentsArray(MP_Util.GetCodeSet(20501, false));
	} catch (err) {
		if (timerRenderComponent) {
			timerRenderComponent.Abort();
			timerRenderComponent = null;
		}
		if (capTimer) {
			capTimer.SubtimerName = criterion.category_mean;
			capTimer.Stop();
		}
		throw (err);
	}
	finally {
		if (timerRenderComponent) {
			timerRenderComponent.Stop();
		}
		if (capTimer) {
			capTimer.SubtimerName = criterion.category_mean;
			capTimer.Stop();
		}
	}
};
FollowUpComponentO2.prototype.processResultsForRender = function (recordData) {
	var self = this;
	var compNS = this.getStyles().getNameSpace();
	var i18nFollowUp = i18n.discernabu.FollowupComponent_O2;
	var followupArr = [];
	var followupResult;
	var followupResults = recordData.FOLLOW_UP;
	var followupLength = followupResults.length;
	if (followupLength <= 0) {
		followupResult = followupResults;
		followupResult.FOLLOWUP_NAME = "<span class='" + compNS + "-no-value'>" + i18nFollowUp.NO_FOLLOWUP_ADDED + "</span>";
		followupArr.push(followupResult);
	} else {

		for (var x = 0;
			x < followupLength;
			x++) {
			var followupData = followupResults[x];
			if (followupData) {
				var timeFrame = "";
				var followUpId = followupData.PAT_ED_FOLLOWUP_ID;
				var followupDate = "";
				var date = null;
				var sNOResultFoundHtml = "<span class='" + compNS + "-no-value'>--</span>";				
				if (followupData.FOL_WITHIN_RANGE) {
					followupDate = followupData.FOL_WITHIN_RANGE;
				} else {
					if (followupData.FOL_DAYS) {
						var daysOrWeeksArray = [[-1, ""], [0, i18nFollowUp.DAYS], [1, i18nFollowUp.WEEKS], [2, i18nFollowUp.MONTHS], [3, i18nFollowUp.YEARS]];
						var arrayLength = daysOrWeeksArray.length;
						var selectedValue = "";
						for (var arrayIndex = 0;
							arrayIndex < arrayLength;
							arrayIndex++) {
							if (daysOrWeeksArray[arrayIndex][0] == followupData.DAY_OR_WEEK) {
								selectedValue = daysOrWeeksArray[arrayIndex][1];
							}
						}
						followupDate = followupData.FOL_DAYS + " " + selectedValue;
					} else {
						if (followupData.FOLLOWUP_DT_TM && followupData.FOLLOWUP_DT_TM != "TZ") {
							date = new Date();
							date.setISO8601(followupData.FOLLOWUP_DT_TM);
							followupDate = date.format("mmm dd, yyyy a't' HH:MM");
						}
					}
				}
				followupDate = (followupData.FOLLOWUP_NEEDED_IND > 0) ? followupDate + " " + i18nFollowUp.ONLY_IF_NEEDED : followupDate;
				timeFrame = followupDate || sNOResultFoundHtml;

				var followupComments = followupData.LONG_TEXT;
				var commentsData = followupComments;
				var commentLength = followupComments.length;
				if (commentLength) {
					if (commentLength > self.m_commentCharLimit) {
						commentsData = followupComments.substring(0, self.m_commentCharLimit) + "...";
					}
				} else {
					commentsData = sNOResultFoundHtml;
				}

				followupResult = followupResults[x];
				var followupProviderName = followupData.PROVIDER_NAME || sNOResultFoundHtml;
				followupResult.FOLLOWUP_NAME = "<span data-followup-id=' " + followUpId + "'>" + followupProviderName + "</span>";

				followupResult.TIME_FRAME = "<span data-followup-id='" + followUpId + "'>" + timeFrame + "</span>";
				followupResult.COMMENTS = "<span data-followup-id='" + followUpId + "'>" + commentsData + "</span>";
				followupResult.FOLLOWUP_DETAILS = "<span data-followup-id='" + followUpId + "'><span>" + followupProviderName + "</span></br><span>" + timeFrame + "</span></span>";
				followupResult.FOLLOWUP_ID = followUpId;
				followupResult.FOL_WITHIN_RANGE = followupData.FOL_WITHIN_RANGE;
				followupResult.FOL_DAYS = followupData.FOL_DAYS;
				followupResult.DAY_OR_WEEK = followupData.DAY_OR_WEEK;
				followupResult.FOLLOWUP_DT_TM = followupData.FOLLOWUP_DT_TM;
				followupResult.FOLLOWUP_NEEDED_IND = followupData.FOLLOWUP_NEEDED_IND;
				followupResult.CMT_LONG_TEXT_ID = followupData.CMT_LONG_TEXT_ID;
				followupResult.ADD_LONG_TEXT_ID = followupData.ADD_LONG_TEXT_ID;
				followupResult.QUICK_PICK_CD = followupData.QUICK_PICK_CD;
				followupResult.ORGANIZATION_ID = followupData.ORGANIZATION_ID;
				followupResult.ADDRESS_TYPE_CD = followupData.ADDRESS_TYPE_CD;
				followupResult.ACTIVE_IND = followupData.ACTIVE_IND;
				followupResult.CUSTOM_ID = followupData.CUSTOM_ID;
				followupArr.push(followupResult);
			}
		}
	}
	return followupArr;

};
FollowUpComponentO2.prototype.renderFollowUpTable = function (recordData) {
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var i18nFollowUp = i18n.discernabu.FollowupComponent_O2;
	var followupResultArr = null;
	var followupResults=recordData.FOLLOW_UP;
   	var followupLength=followupResults.length;
	this.createfollowupTableObject(recordData);
	followupResultArr = this.processResultsForRender(recordData);

	var followupo2Table = null;
	followupo2Table = new ComponentTable();
	followupo2Table.setNamespace(this.getStyles().getId());
	
	var followupDetailsColumn  = new TableColumn();
	followupDetailsColumn.setColumnDisplay(i18nFollowUp.ADDED_FOLLOWUP);
	followupDetailsColumn.setColumnId("followupDetails");
    followupDetailsColumn.setCustomClass(compNS+"-sp-hide-first-col");
	followupDetailsColumn.setRenderTemplate("${ FOLLOWUP_DETAILS }");
	
	var nameColumn = new TableColumn();
	nameColumn.setColumnDisplay(i18nFollowUp.ADDED_FOLLOWUP);
	nameColumn.setColumnId("newFollowup");
	nameColumn.setCustomClass(compNS + "-provider-col");
	nameColumn.setRenderTemplate("${ FOLLOWUP_NAME }");
	
	var dateColumn = new TableColumn();
	dateColumn.setColumnDisplay(i18nFollowUp.TIME_FRAME);
	dateColumn.setColumnId("timeFrame");
	dateColumn.setCustomClass(compNS+"-time-frame-col");
	dateColumn.setRenderTemplate("${ TIME_FRAME }");
	
	var resultColumn = new TableColumn();
	resultColumn.setColumnDisplay(i18nFollowUp.COMMENTS);
	resultColumn.setColumnId("comments");
	resultColumn.setCustomClass("fu-o2-comments-col");
	resultColumn.setRenderTemplate("${ COMMENTS}");
	
	followupo2Table.addColumn(nameColumn);
	followupo2Table.addColumn(dateColumn);
	followupo2Table.addColumn(resultColumn);
	followupo2Table.addColumn(followupDetailsColumn);
	
	followupo2Table.bindData(followupResultArr);
	this.followupo2Table = followupo2Table;
	var fuo2ComponentTableArray = [];
	this.setComponentTable(followupo2Table);
	fuo2ComponentTableArray.push('<div id="fu-o2' + compId + '-full-table" class="fu-o2-full-table">' + followupo2Table.render() + '</div><div id="fu-o2-' + compId + '-instructions-container"></div>');
	$("#fu-o2"+compId+"-table-container").empty();
	$("#fu-o2" + compId + "-table-container").append(fuo2ComponentTableArray);		
	if (followupLength>0) {
	this.addCellClickExtension();
	}
	this.m_componentTable.finalize();
	if (this.m_showPanel) {
		this.m_showPanel = false;
	}
	if (followupLength>0) {
		this.initializeSidePanel();
		this.resetTableCellHeight();
	}
};

/**
 * Checks the satisfier condition
 * @return {boolean} Returns boolean value based on selected follow up count
 */
FollowUpComponentO2.prototype.isRequirementSatisfied = function () {
	var count = this.getResultCount() || 0;
	return count > 0;
};
/**
 * Updates the icon in the navigator section by firing event listener
 * @return {undefined} This function does not return a value
 */
FollowUpComponentO2.prototype.updateSatisfierRequirementIndicator = function () {
	if (this.getGapCheckRequiredInd()) {
		var isReqSatisfied = this.isRequirementSatisfied();
		this.setSatisfiedInd(isReqSatisfied);
		CERN_EventListener.fireEvent(this, this, EventListener.EVENT_SATISFIER_UPDATE, {
			satisfied : isReqSatisfied
		});
		this.updateComponentRequiredIndicator();
	}
};
FollowUpComponentO2.prototype.resizeComponent = function () {
	var compId = this.getComponentId();
	var calcHeight = "";
	var compHeight = 0;
	var compDOMObj = null;
	var compType = this.getStyles().getComponentType();
	var container = null;
	var contentBodyHeight = 0;
	var contentBodyObj = null;
	var miscHeight = 20;
	var viewHeight = 0;
	if (compType === CERN_COMPONENT_TYPE_WORKFLOW) {
		container = $("#vwpBody");
		if (!container.length) {
			return;
		}
		viewHeight = container.height();
		compDOMObj = $("#" + this.getStyles().getId());
		if (!compDOMObj.length) {
			return;
		}
		contentBodyObj = compDOMObj.find(".content-body");
		if (contentBodyObj.length) {
			compHeight = compDOMObj.height();
			contentBodyHeight = contentBodyObj.height();
			calcHeight = (viewHeight - (compHeight - contentBodyHeight + miscHeight))+"px";
			var viewModeHeight = 260;
			var tableHeaderHeight= $("#fu-o2"+compId+"headerWrapper").height();
			var calculatedHeight = (viewModeHeight - tableHeaderHeight)+"px";
			contentBodyObj.css("max-height", calculatedHeight).css("overflow-y", "auto");			
			if (this.m_showPanel) {
				var sidePanelHeight = $("#sidePanel" + compId).height() - 1;
				var followupTableHeight = (sidePanelHeight - tableHeaderHeight) + "px";
				contentBodyObj.css("max-height", followupTableHeight).css("overflow-y", "auto");
				if (contentBodyHeight > 400) {
					this.scrollToSelectedRow();
				}
			}
		}
	}
	
	if (this.getComponentTable()) {
		this.getComponentTable().updateAfterResize();
	}
    //reset the offset adjustment
    this.m_offsetTopAdjustment = null;	
};
/*
 * scrollToSelectedRow() functions checks if any row is selected and
 * if scrollbar is visible, moves the scrollbar to the currently selected row.
 */
FollowUpComponentO2.prototype.scrollToSelectedRow = function () {
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	if(this.m_clickedRow){
		var tableBodyObj =  $("#" + compNS + compId+"tableBody");
		//move the scrollbar to the selected row when it is enabled.
		if(tableBodyObj[0].scrollHeight > tableBodyObj.innerHeight()){
			tableBodyObj.scrollTo($("#"+this.m_clickedRow.id.replace(/:/g,"\\:")));			
		}
	}
};
/*
 *resetTableCellHeight() functions calls resets the height of the table cells.
 *This function has to be called upon resizing the component and on showing/hiding the side panel
 *to make equal height of all the columns for each row so as to enable click event on any part of the table column 
 */
FollowUpComponentO2.prototype.resetTableCellHeight = function () {
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var followupTableRow = $("#" + compNS + compID + "tableBody").find('.result-info');
	followupTableRow.each(function () {
		var tableRow = $(this);
		var tableRowHeight = tableRow.height();
		var i = 0;
		tableRow.find('dd').each(function () {
			i++;
			var currentElem = $(this);
			if (i < 4 && (!currentElem.hasClass('fu-o2-comments-col'))) {
				currentElem.height(tableRowHeight);
			}

		});
	});
};
FollowUpComponentO2.prototype.addCellClickExtension = function () {
	var component = this;
	var cellClickExtension = new TableCellClickCallbackExtension();
	cellClickExtension.setCellClickCallback(function (event, data) {
		//event.button = 2  and event.which = 3 specify right mouse button was clicked.
		//filter for mouse left click
		if (event.which !== 3 || event.button !== 2) {
			component.onRowClick(event, data);
			component.resizeComponent();
		}
		//filter for mouse right click
		if (event.which == 3 || event.button == 2) {
			component.onRowLeftClick(event, data);
		}
	});
	this.followupo2Table.addExtension(cellClickExtension);
};
FollowUpComponentO2.prototype.createfollowupTableObject = function (recordData) {
	var followupLength = recordData.FOLLOW_UP.length;
	var followupArray = [];
	var i18nFollowUp = i18n.discernabu.FollowupComponent_O2;
	for (var followupCount = 0;followupCount < followupLength;followupCount++) {
		var followupDate = "";
		var date = null;
		var selectedFollowupDetails = recordData.FOLLOW_UP[followupCount];
		if (selectedFollowupDetails.FOL_WITHIN_RANGE) {
			followupDate = selectedFollowupDetails.FOL_WITHIN_RANGE;
		} else {
			if (selectedFollowupDetails.FOL_DAYS) {
				var daysOrWeeksArray = [[-1, ""], [0, i18nFollowUp.DAYS], [1, i18nFollowUp.WEEKS], [2, i18nFollowUp.MONTHS], [3, i18nFollowUp.YEARS]];
				var arrayLength = daysOrWeeksArray.length;
				var selectedValue = "";
				for (var arrayIndex = 0;arrayIndex < arrayLength;arrayIndex++) {
					if (daysOrWeeksArray[arrayIndex][0] === selectedFollowupDetails.DAY_OR_WEEK) {
						selectedValue = daysOrWeeksArray[arrayIndex][1];
					}
				}
				followupDate = selectedFollowupDetails.FOL_DAYS + " " + selectedValue;
			} else {
				if (selectedFollowupDetails.FOLLOWUP_DT_TM && selectedFollowupDetails.FOLLOWUP_DT_TM != "TZ") {
					date = new Date();
					date.setISO8601(selectedFollowupDetails.FOLLOWUP_DT_TM);
					followupDate = date.format("mmm dd, yyyy a't' HH:MM");
				}
			}
		}
		followupDate = (selectedFollowupDetails.FOLLOWUP_NEEDED_IND > 0) ? followupDate + " " + i18nFollowUp.ONLY_IF_NEEDED : followupDate;
		var FollowupObj = new this.FollowupDetailsInstance();
		var followupElement = selectedFollowupDetails;
		if (selectedFollowupDetails.ORGANIZATION_ID > 0) {
			FollowupObj.whoId = selectedFollowupDetails.ORGANIZATION_ID;
			FollowupObj.whoType = this.m_followupComponentIndex.LOCATION;
		} else if (selectedFollowupDetails.PROVIDER_ID > 0) {
			FollowupObj.whoId = selectedFollowupDetails.PROVIDER_ID;
			FollowupObj.whoType = 2;
		} else if (selectedFollowupDetails.LOCATION_CD > 0) {
			FollowupObj.whoId = selectedFollowupDetails.LOCATION_CD;
			FollowupObj.whoType = this.m_followupComponentIndex.LOCATION;
		} else if (selectedFollowupDetails.QUICK_PICK_CD > 0) {
			FollowupObj.whoId = selectedFollowupDetails.QUICK_PICK_CD;
			FollowupObj.whoType = 4;
		}

		FollowupObj.id = followupElement.PAT_ED_FOLLOWUP_ID;
		FollowupObj.whoString = followupElement.PROVIDER_NAME;
		FollowupObj.whenDtTm = date;
		FollowupObj.whenWithIn = followupElement.FOL_WITHIN_RANGE;
		FollowupObj.daysOrWeek = followupElement.DAY_OR_WEEK;
		FollowupObj.followupDays = followupElement.FOL_DAYS;
		FollowupObj.whenNeededInd = followupElement.FOLLOWUP_NEEDED_IND;
		FollowupObj.addressLongText = followupElement.ADD_LONG_TEXT;
		FollowupObj.commentText = followupElement.LONG_TEXT;
		FollowupObj.patEdFollowupId = followupElement.PAT_ED_FOLLOWUP_ID;

		var dateRangeArray = this.getDateRangeArray();

		var dateRangeArrLength = dateRangeArray.length;
		if (followupElement.FOL_WITHIN_RANGE && dateRangeArrLength > 0) {
			for (var index = 0;index < dateRangeArrLength;index++) {
				if (dateRangeArray[index].DISPLAY_VALUE === followupElement.FOL_WITHIN_RANGE) {
					FollowupObj.whenWithInCd = dateRangeArray[index].CODE_VALUE;
				}
			}
		}

		var mapObj = new this.MapObject(FollowupObj.id, FollowupObj);
		followupArray.push(mapObj);
	}
	this.setSelectedFollowupArray(followupArray);
};
FollowUpComponentO2.prototype.autoOpenSidePanel = function () {
	var compId = this.getComponentId();
	$("#fu-o2" + compId + "\\:row0").addClass("fu-o2-wf-selected-row selected");
	$("#fu-o2" + compId + "table").addClass("fu-o2-sp-hide-mode");
	if (!this.m_showPanel) {
		// shrink the table and show the panel
		$("#fu-o2" + compId + "-full-table").addClass("fu-o2-table");
		this.m_sidePanelContainer.css("display", "inline-block");
		this.m_showPanel = true;
		this.m_sidePanel.showPanel();
	}
	var allRows = this.followupo2Table.getRowMap();
	var allRowKeys = Object.keys(allRows);
	var row = allRows[allRowKeys[0]];
	this.m_clickedRow = row;
	this.m_clickedRow.id = "fu-o2" + compId + ":row0";
};
/**
 * This function will serve as the click handler for the Label table delegate.
 *
 * @param {jQuery.Event}
 *                event - The DOM event that occurred.
 * @param {JSON}
 *                data - The data behind the DOM element as received from ComponentTable.
 */
FollowUpComponentO2.prototype.onRowClick = function (event, data) {
	var target = event.target.parentElement;
	if (!target) {
		return;
	}
	this.setPanelContentsToClickedRow(event, data);
};
FollowUpComponentO2.prototype.onRowLeftClick = function (event, data) {
	var target = event.target.parentElement;
	if (!target) {
		return;
	}
	this.attachFolloupTableListners(event, data);
};
FollowUpComponentO2.prototype.setPanelContentsToClickedRow = function (event, dataObj) {
	// Retrieve component ID
	var componentId = this.getComponentId();

	if (this.m_clickedRow && event.currentTarget.parentNode.id == this.m_clickedRow.id) {
		this.m_sidePanel.m_cornerCloseButton.trigger('click');
		return;
	}
	$("#fu-o2" + componentId + "table").addClass("fu-o2-sp-hide-mode");
	if (!this.m_showPanel) {
		// shrink the table and show the panel
		$("#fu-o2" + componentId + "-full-table").addClass("fu-o2-table");
		this.m_sidePanelContainer.css("display", "inline-block");
		this.m_showPanel = true;
		this.m_sidePanel.showPanel();
	}
	// Event exists only when the group name is clicked
	if (event) {
		// If the group name is clicked then retrieve the row label of that cell
		var currentRowSelected = event.currentTarget.parentNode;
		this.m_clickedRow = currentRowSelected;

		// Highlight the selected row
		this.highlightSelectedRow(currentRowSelected, false);
	}
	this.setSidePanelContents(dataObj.RESULT_DATA);
};
FollowUpComponentO2.prototype.setPanelContentsToLeftClickedRow = function (event, dataObj) {
	// Retrieve component ID
	var componentId = this.getComponentId();
	$("#fu-o2" + componentId + "table").addClass("fu-o2-sp-hide-mode");
	if (!this.m_showPanel) {
		// shrink the table and show the panel
		$("#fu-o2" + componentId + "-full-table").addClass("fu-o2-table");
		this.m_sidePanelContainer.css("display", "inline-block");
		this.m_showPanel = true;
		this.m_sidePanel.showPanel();
	}
	// Event exists only when the group name is clicked
	if (event) {
		// If the group name is clicked then retrieve the row label of that cell
		var currentRowSelected = event.currentTarget.parentNode;
		this.m_clickedRow = currentRowSelected;
		// Highlight the selected row
		this.highlightSelectedRow(currentRowSelected, false);
	}

	this.saveEditPanelDetails(dataObj.RESULT_DATA);

};
FollowUpComponentO2.prototype.setSidePanelContents = function (dataObj) {
	var self = this;
	var componentId = this.getComponentId();
	var i18nFollowUp = i18n.discernabu.FollowupComponent_O2;
	var selectedFollowupDetails = dataObj;
	var sNOResultFoundHtml = "<span class='fu-o2-novalue'>--</span>";
	var whoNameHtml = selectedFollowupDetails.PROVIDER_NAME || sNOResultFoundHtml;
	var dateHtml = "";
	var commentData = selectedFollowupDetails.LONG_TEXT || sNOResultFoundHtml;
	var tempAddress = "";
	var followupAddress = "";
	var followupPhone = "";
	var followUpId = selectedFollowupDetails.PAT_ED_FOLLOWUP_ID;
	var followupDate = "";
	this.m_addressArray = [];
	this.m_phoneArray = [];
	this.m_prevSelectedAddress = "";

	var sidePanelHTML = "<div id='sidePanelScrollContainer" + componentId + "' class='sp-add-scroll'><div id='fu-o2" + componentId + "sidePanelResultList' class='fu-o2-side-panel-result-list'>";

	$("#sidePanel" + componentId).find('.loading-screen').remove();
	self.getDetailsFromLongText(selectedFollowupDetails.ADD_LONG_TEXT, selectedFollowupDetails.CMT_LONG_TEXT_ID);
	var spaddressArray = this.m_addressArray;
	var spaddressArrayLength = spaddressArray.length;
	if (spaddressArrayLength) {
		var addressObj = spaddressArray[0].value;
		var streetInfo = addressObj.STREET ? addressObj.STREET + "</br>" : "";
		tempAddress = streetInfo + addressObj.CITY + " " + addressObj.STATE + " " + addressObj.ZIP_CODE;
		followupAddress = "<div class='fu-o2-view-address'>" + tempAddress + "</div>";
	} else {
		followupAddress = sNOResultFoundHtml;
	}

	var spphoneArray = this.m_phoneArray;
	var spphoneArrayLength = spphoneArray.length;
	if (spphoneArrayLength) {
		var phone = spphoneArray[0].value.PHONE_NUMBER;
		followupPhone = "<div class='fu-o2-view-address'>" + phone + "</div>";
	} else {
		followupPhone = sNOResultFoundHtml;
	}

	if (selectedFollowupDetails.FOL_WITHIN_RANGE) {
		followupDate = selectedFollowupDetails.FOL_WITHIN_RANGE;
	} else if (selectedFollowupDetails.FOL_DAYS) {
		var daysOrWeeksArray = [[-1, ""], [0, i18nFollowUp.DAYS], [1, i18nFollowUp.WEEKS], [2, i18nFollowUp.MONTHS], [3, i18nFollowUp.YEARS]];
		var arrayLength = daysOrWeeksArray.length;
		var selectedValue = "";
		for (var arrayIndex = 0; arrayIndex < arrayLength; arrayIndex++) {
			if (daysOrWeeksArray[arrayIndex][0] === selectedFollowupDetails.DAY_OR_WEEK) {
				selectedValue = daysOrWeeksArray[arrayIndex][1];
			}
		}
		followupDate = selectedFollowupDetails.FOL_DAYS + " " + selectedValue;
	} else if (selectedFollowupDetails.FOLLOWUP_DT_TM && selectedFollowupDetails.FOLLOWUP_DT_TM != "TZ") {
		var date = new Date();
		date.setISO8601(selectedFollowupDetails.FOLLOWUP_DT_TM);
		followupDate = date.format("mmm dd, yyyy a't' HH:MM");
	}
	followupDate = (selectedFollowupDetails.FOLLOWUP_NEEDED_IND) ? followupDate + " " + i18nFollowUp.ONLY_IF_NEEDED : followupDate;
	dateHtml = followupDate || sNOResultFoundHtml;

	// Create the header and action HTML
	this.m_sidePanel.setMinHeight('280px');
	this.m_sidePanel.setTitleText(whoNameHtml);
	this.m_sidePanel.setActionsAsHTML("<div id='followUpSPAction" + componentId + "' class='al-sp-actions'><div class='sp-button2 fu-o2-sp-delete-button' id='followupDeleteButton" + componentId + "'>"+i18nFollowUp.DELETE+"</div><div class='sp-button2 fu-o2-sp-modify-button' id='followupModifyButton" + componentId + "'>"+i18nFollowUp.MODIFY+"</div></div>");

	var followUpHTML = "<div><div class='fu-o2-view-timeframe-details'><dl class='fu-o2-view-details'><dt class='fu-o2-view-title secondary-text'>" + i18nFollowUp.TIME_FRAME + "</dt><dd>" + dateHtml + "</dd></dl><dl class='fu-o2-view-details'><dt class='fu-o2-view-title secondary-text'>" + i18nFollowUp.ADDRESS + "</dt><dd>" + followupAddress + "</dd></dl><dl class='fu-o2-view-details'><dt class='fu-o2-view-title secondary-text'>" + i18nFollowUp.PHONE + "</dt><dd>" + followupPhone + "</dd></dl></div><div class='fu-o2-view-comments-details'><dl class='fu-o2-view-details'><dt class='fu-o2-view-title secondary-text'>" + i18nFollowUp.COMMENTS + "</dt><dd class='fu-o2-view-comments'>" + commentData + "</dd></dl></div></div>";

	sidePanelHTML += followUpHTML + "</div></div>";

	this.m_sidePanel.setContents(sidePanelHTML, "fu-o2Content" + componentId);

	var modifyBtn = $("#followupModifyButton" + componentId);
	var deleteBtn = $("#followupDeleteButton" + componentId);
	modifyBtn.click(function () {
		self.saveEditPanelDetails(dataObj);
		self.resizeComponent();
	});
	deleteBtn.click(function () {
		self.deleteSelectedFollowup(followUpId);		
	});
};

FollowUpComponentO2.prototype.saveEditPanelDetails = function (currentFollowUpObj) {
	try {
		var self = this;
		var i18nFollowUp = i18n.discernabu.FollowupComponent_O2;
		var componentId = this.getComponentId();

		var modifyPersonalDetailsHTML = "";
		var modifyDateControlHTML = "";
		var modifyCommentsHTML = "";
		var modifyfavoritesHTML = "";

		var sidePanelBodyContainerElem = $("#sidePanelBodyContents" + componentId);
		var resultListElem = "";
		var cancelBtnAction = "";
		var saveBtnAction = "";

		var followupName = currentFollowUpObj.PROVIDER_NAME;
		var commentText = (currentFollowUpObj.LONG_TEXT) ? currentFollowUpObj.LONG_TEXT : "";
		var onlyIfNeeded = (currentFollowUpObj.FOLLOWUP_NEEDED_IND) ? "checked" : "";
		this.m_addressArray = [];
		this.m_phoneArray = [];
		this.m_prevSelectedAddress = "";

		if (!this.m_showPanel) {
			// shrink the table and show the panel
			this.m_tableContainer.addClass("fu-o2-side-panel-addition");
			this.m_sidePanelContainer.css("display", "inline-block");
			this.m_showPanel = true;
			this.m_sidePanel.showPanel();
		}

		$("#sidePanel" + componentId).find('.loading-screen').remove();
		//Remove any lingering listener
		CERN_EventListener.removeListener(null, "optionsRendered" + componentId, null, null);

		// Create the header and action HTML
		this.m_sidePanel.setMinHeight("460px");
		this.m_sidePanel.setMaxHeight('460px');
		this.m_sidePanel.setTitleText(followupName);

		this.m_sidePanel.setActionsAsHTML("<div id='followUpSPAction" + componentId + "' class='fu-o2-sp-actions fu-o2-edit-mode'><div class='sp-button2 fu-o2-cancel-button' id='followUpCancelButton" + componentId + "'>" + i18n.CANCEL + "</div><div class='sp-button2 fu-o2-save-button' id='followUpSaveButton" + componentId + "'>" + i18n.SAVE + "</div></div>");
		sidePanelBodyContainerElem.html("");
		sidePanelBodyContainerElem.append("<div id='sidePanelScrollContainer" + componentId + "' class='sp-add-scroll'><div id='fu-o2" + componentId + "sidePanelResultList' class='fu-o2-side-panel-result-list'>");

		resultListElem = $("#fu-o2" + componentId + "sidePanelResultList");

		//Listener to remove spinner once all fields are loaded
		CERN_EventListener.addListener(self, "optionsRendered" + componentId, function () {
			//Remove spinner
			$("#sidePanel" + componentId).find('.loading-screen').remove();
		});

		modifyPersonalDetailsHTML += "<div><div class='fu-o2-address-details'><div class='fu-o2-street-info section'><dl><dt class='fu-o2-title-text secondary-text'>" + i18nFollowUp.ADDRESS + "</dt><dd class='fu-o2-address-input'>" + MP_Util.CreateAutoSuggestBoxHtml(self, "addressControl") + "</dd></dl></div><div class='fu-o2-area-info'><dl class='fu-o2-city-info'><dt class='secondary-text'>" + i18nFollowUp.CITY + "</dt><dd><input class='fu-o2-city-input fu-o2-address-input' id='city-" + componentId + "' type='text' data-input='input-data'/></dd></dl><dl class='fu-o2-state-info'><dt class='secondary-text'>" + i18nFollowUp.STATE + "</dt><dd><input class='fu-o2-state-input fu-o2-address-input' id='state-" + componentId + "' type='text' data-input='input-data'/></dd></dl><dl class='fu-o2-zipcode-info'><dt class='secondary-text'>" + i18nFollowUp.ZIP_CODE + "</dt><dd><input class='fu-o2-zipcode-input fu-o2-address-input' id='zipCode-" + componentId + "' type='text' data-input='input-data'/></dd></dl></div><div class='fu-o2-phone-details section'><dl><dt class='secondary-text'>" + i18nFollowUp.PHONE + "</dt><dd class='fu-o2-address-input'>" + MP_Util.CreateAutoSuggestBoxHtml(self, "phoneControl") + "</dd></dl></div></div><div class='fu-o2-time-details'><div><div><span class='fu-o2-timeframe-title secondary-text'>" + i18nFollowUp.TIME_FRAME + "</span></div></div><div class='fu-o2-needed-container'><input id='needed-" + componentId + "' class='fu-o2-checkbox' type='checkbox'" + onlyIfNeeded + "/><span>" + i18nFollowUp.ONLY_IF_NEEDED + "</span></div><div id='fu-o2-timeframe-" + componentId + "' class='fu-o2-timeframe-options'></div></div></div>";

		modifyCommentsHTML += "<div class='fu-o2-comments-section'><div class='fu-o2-predefined-comment'><span class='secondary-text'>" + i18nFollowUp.PREDEFINED_COMMENTS + "</span><div class='fu-o2-comments-list' id='fu-o2-comments-list-" + componentId + "'></div></div><div class='fu-o2-comments'><span class='secondary-text'>" + i18nFollowUp.COMMENTS + " </span><div class='fu-o2-sp-comments-sec'><textarea class='fu-o2-comments-input' id='comments-" + componentId + "'>" + commentText + "</textarea></div></div></div>";
		modifyfavoritesHTML = "<div class='fu-o2-side-panel-favorites-content'><input class='fu-o2-checkbox' type='checkbox' id='add-to-favorite-" + componentId + "'/><span>" + i18nFollowUp.SAVE_AS_FAVORITE + "</span></div>";

		resultListElem.append(modifyPersonalDetailsHTML + modifyDateControlHTML + modifyCommentsHTML + modifyfavoritesHTML);
		var scrollContainerObj = $("#sidePanelScrollContainer" + componentId);

		this.m_sidePanel.setContents(scrollContainerObj, "fu-o2Content" + componentId);

		MP_Util.LoadSpinner("sidePanel" + componentId);

		this.renderPredefinedComments();
		this.renderFollowupDateControl(currentFollowUpObj);
		this.getDetailsFromLongText(currentFollowUpObj.ADD_LONG_TEXT, currentFollowUpObj.CMT_LONG_TEXT_ID);
		this.getAddressPhoneDetails(currentFollowUpObj);

		var addresssAutoSuggestControl = new AutoSuggestControl(self, self.searchAddressInstructions, self.handleAddressSelection, self.createAddressSuggestionLine, "addressControl");
		var phoneAutoSuggestControl = new AutoSuggestControl(self, self.searchPhoneInstructions, self.handlePhoneSelection, self.createPhoneSuggestionLine, "phoneControl");

		resultListElem.on("keypress", ".fu-o2-address-input", function(event) {
			event = event || window.event;
			var charCode = event.which || event.keyCode;
			var CARET_KEYCODE = 94;
			var SEMICOLON_KEYCODE = 59;
			var TILDA_KEYCODE = 126;
			if(charCode == CARET_KEYCODE || charCode == SEMICOLON_KEYCODE || charCode == TILDA_KEYCODE){
				return false;
			}
		});
		var addressTextBox = $(addresssAutoSuggestControl.textbox);
		var addressHandler = function () {
			addressTextBox.off('click');
			var addressArray = self.m_addressArray;
			setTimeout(function () {
				addressTextBox.click(addressHandler);
			}, 1000);
			if (addressArray.length) {
				addresssAutoSuggestControl.autosuggest(addressArray);
			}
		};
		addressTextBox.click(addressHandler);

		var phoneTextBox = $(phoneAutoSuggestControl.textbox);
		var phoneHandler = function () {
			phoneTextBox.off('click');
			var phoneNoArray = self.m_phoneArray;
			setTimeout(function () {
				phoneTextBox.click(phoneHandler);
			}, 1000);
			phoneAutoSuggestControl.autosuggest(phoneNoArray);
		};
		phoneTextBox.click(phoneHandler);
		cancelBtnAction = $("#followUpCancelButton" + componentId);
		cancelBtnAction.click(function () {
			self.m_sidePanel.m_cornerCloseButton.trigger("click");
		});
		saveBtnAction = $("#followUpSaveButton" + componentId);

		saveBtnAction.click(function () {
			self.saveFollowupDetails(currentFollowUpObj);
		});
	} catch (err) {
		logger.logJSError(err, this, "followup_o2.js", "modifyFollowupDetails");
	}
};
FollowUpComponentO2.prototype.autoPopulateAddressPhoneInfo = function (addressLongTxt) {
	var addressArray = this.m_addressArray;
	var compId = this.getComponentId();
	var addressLength = addressArray.length;
	if (addressLength) {
		var addressInfo = null;
		if (!addressLongTxt && (addressLength === 1)) {
			addressInfo = addressArray[0].value;
		} else {
			for (var i = 0; i < addressLength; i++) {
				var addressContent = addressArray[i].value;
				if (addressContent.SAVED_ADDRESS) {
					addressInfo = addressContent;
					break;
				} else if (!addressLongTxt && addressContent.DEFAULT) {
					addressInfo = addressContent;
					break;
				}
			}
		}
		if (addressInfo !== null) {
			$("#fu-o2addressControl" + compId).val(addressInfo.STREET);
			$("#city-" + compId).val(addressInfo.CITY);
			$("#state-" + compId).val(addressInfo.STATE);
			$("#zipCode-" + compId).val(addressInfo.ZIP_CODE);
		}
	}
	var phoneArray = this.m_phoneArray;
	var phoneArrayLength = phoneArray.length;
	if (phoneArrayLength) {
		var phoneInfo = null;
		if (!addressLongTxt && (phoneArrayLength === 1)) {
			phoneInfo = phoneArray[0].value;
		} else {
			for (var x = 0; x < phoneArrayLength; x++) {
				var phoneContent = phoneArray[x].value;
				if (phoneContent.SAVED_PHONENO) {
					phoneInfo = phoneContent;
					break;
				} else if (!addressLongTxt && phoneContent.DEFAULT) {
					phoneInfo = phoneContent;
					break;
				}
			}
		}
		if (phoneInfo !== null) {
			$("#fu-o2phoneControl" + compId).val(phoneInfo.PHONE_NUMBER);
		}
	}
};
FollowUpComponentO2.prototype.saveFollowupDetails = function (rowDataObj) {
	var saveFollowupTimerObj = null;
	try {
		var component = this;
		var criterion = component.getCriterion();
		saveFollowupTimerObj = new RTMSTimer("ENG:MPG.FOLLOWUP.O2 - Add or Update Follow up", criterion.category_mean);
		if (saveFollowupTimerObj) {
			saveFollowupTimerObj.addMetaData("rtms.legacy.metadata.1", "Save Followup");
			saveFollowupTimerObj.start();
		}
		var componentId = component.getComponentId();
		var followupDttm = "";
		var addLongTextId = rowDataObj.ADD_LONG_TEXT_ID;
		var patEdFollowId = rowDataObj.PAT_ED_FOLLOWUP_ID;
		var addressId = rowDataObj.ADDRESS_TYPE_CD;
		var providerName = rowDataObj.PROVIDER_NAME;
		var providerId = rowDataObj.PROVIDER_ID;
		var organizationId = rowDataObj.ORGANIZATION_ID;
		var quickPickCd = rowDataObj.QUICK_PICK_CD;

		var onlyIfNeededInd = $("#needed-" + componentId).is(":checked") ? 1 : 0;
		var withInRange = $("#followupWithInSelect" + componentId + " :selected").text() || "";
		var withInCd = $("#followupWithInSelect" + componentId + " :selected").val() || "0";
		var followupDays = $("#followupDaysInput" + componentId).val() || 0;
		var dayOrweek = $("#followupDaysCombo" + componentId + " :selected").val() || -1;
		var commentLongTxt = $("#comments-" + componentId).val().replace(/^\s+|\s+$/g, "") || "";
		var commentLongTxtId = rowDataObj.CMT_LONG_TEXT_ID;
		var defaultDate = "--/--/----";
		var dateObj = $("#followupCalendarInput" + componentId);
		var date = (dateObj.val() !== defaultDate) ? dateObj.datepicker("getDate") : "";
		var defaultTime = "--:--";
		var timeObj = $("#followupTimeInput" + componentId);
		var time = (timeObj.val() !== defaultTime) ? timeObj.val().replace(/\;/g, " ") : "";
		var street = $("#fu-o2addressControl" + componentId).val().replace(/\;/g, " ") || "";
		var city = $("#city-" + componentId).val().replace(/\;/g, " ") || "";
		var state = $("#state-" + componentId).val().replace(/\;/g, " ") || "";
		var zipcode = $("#zipCode-" + componentId).val().replace(/\;/g, " ") || "";
		var phoneNo = $("#fu-o2phoneControl" + componentId).val().replace(/\;/g, " ") || "";
		var addToFavoriteInd = $("#add-to-favorite-" + componentId).is(":checked") ? 1 : 0;
		var tempAddText = street + city + state + zipcode + phoneNo;
		var addLongText = (tempAddText) ? "^" + street + "^" + city + "^" + state + "^" + zipcode + ";" + phoneNo + ";" : this.m_prevSelectedAddress;
		var personId = criterion.person_id;
		var encntrId = criterion.encntr_id;

		try {
			if (date) {
				followupDttm = date.format("dd-mmm-yyyy") + " " + time;
			}
		} catch (err) {
			followupDttm = "";
			MP_Util.LogScriptCallInfo(null, this, "followup-o2.js", "Incorrect Date and Time is entered.");
		}
		addLongText = (addLongText) ? addLongText : "";
		MP_Util.LoadSpinner("sidePanel" + componentId);
		var sendAr = ["^MINE^", personId + ".0", encntrId + ".0", providerId + ".0", "~" + providerName + "~", commentLongTxtId + ".0","^" + followupDttm + "^", addLongTextId + ".0", "~" + addLongText + "~", "^" + withInRange + "^", followupDays, dayOrweek, organizationId + ".0", "0.0", patEdFollowId + ".0", quickPickCd + ".0", addressId + ".0", "0.0", onlyIfNeededInd, addToFavoriteInd, withInCd + ".0", criterion.provider_id + ".0", 0];

		var modifyFollowupScriptRequest = new ScriptRequest();
		modifyFollowupScriptRequest.setProgramName("MP_ADD_UPD_FOLLOWUP");
		modifyFollowupScriptRequest.setParameterArray(sendAr);
		modifyFollowupScriptRequest.setDataBlob(commentLongTxt);
		modifyFollowupScriptRequest.setResponseHandler(function (scriptReply) {
			$("#sidePanel" + componentId).find('.loading-screen').remove();
			if (saveFollowupTimerObj) {
				saveFollowupTimerObj.stop();
			}
			if (scriptReply.getResponse().STATUS_DATA.STATUS === "S") {
				component.m_sidePanel.m_cornerCloseButton.show();
				component.getSelectedFollowup('open');
				if(addToFavoriteInd){
					component.getFollowUpFavorites();
				}
			} else {
				var errorBanner = new MPageUI.AlertBanner();
				errorBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
				errorBanner.setPrimaryText(i18n.discernabu.FollowupComponent_O2.UNABLE_TO_SAVE_FOLLOWUP);
				errorMessageHTML = errorBanner.render();
				$("#fu-o2" + componentId + "sidePanelResultList").append(errorMessageHTML);
			}
		});
		modifyFollowupScriptRequest.performRequest();
	}catch (err) {
		if (saveFollowupTimerObj) {
			saveFollowupTimerObj.fail();
			saveFollowupTimerObj = null;
		}
		logger.logJSError(err, this, "followup_o2.js", "saveFollowupDetails");
	}
};
FollowUpComponentO2.prototype.renderPredefinedComments = function () {
	var result = this.getPredefinedCommentsArray();
	if (result) {
		var predefinedCommentElem = $("#fu-o2-comments-list-" + this.m_componentId);
		var sidePanelListElem = $("#fu-o2" + this.m_componentId + "sidePanelResultList");
		var commentsHTML = "";

		//Insert items into commentsHtml
		var len = result.length;
		for (var i = 0; i < len; i++) {
			if (result.hasOwnProperty(i)) {
				commentsHTML += "<dl class='fu-o2-comment-value' value='" + result[i].value.codeValue + "'>" + result[i].value.display + "</dl>";
			}
		}
		predefinedCommentElem.append(commentsHTML);
		sidePanelListElem.on('click', ".fu-o2-comment-value", function () {
			var clickElem = $(this);
			var commentsObj = sidePanelListElem.find('.fu-o2-comments-input');
			var savedComments = commentsObj.val();
			savedComments = (savedComments) ? savedComments + " " : "";
			commentsObj.focus();
			commentsObj.val(savedComments + clickElem.text());
		});
	}
};
FollowUpComponentO2.prototype.getDetailsFromLongText = function (addressTxt, cmtLongTxtId) {
	try {
		var self = this;
		var addressId = cmtLongTxtId;
		while (addressTxt !== "") {
			addressId = addressId++;
			var addressObj = {};
			var followupAddress = "";
			var streetDisplay = "";
			var pos = addressTxt.indexOf("^");
			if (pos === -1) {
				break;
			}
			addressTxt = addressTxt.slice(pos + 1);

			pos = addressTxt.indexOf("^");
			if (pos === -1) {
				break;
			}
			var street = addressTxt.slice(0, pos);
			street = street.replace(/\;/g, " ");
			street = street.replace(/^\s+|\s+$/g,"");
			streetDisplay = street ? street+"</br>" : "";
			followupAddress = followupAddress + streetDisplay;
			addressObj.STREET = street;
			addressTxt = addressTxt.slice(pos + 1);

			pos = addressTxt.indexOf("^");
			if (pos === -1) {
				break;
			}
			var city = addressTxt.slice(0, pos);
			addressObj.CITY = city;
			addressTxt = addressTxt.slice(pos + 1);
			followupAddress = followupAddress + city + " ";
			pos = addressTxt.indexOf("^");
			if (pos === -1) {
				break;
			}
			var state = addressTxt.slice(0, pos);
			followupAddress = followupAddress + state + " ";
			addressObj.STATE = state;
			addressTxt = addressTxt.slice(pos + 1);

			pos = addressTxt.indexOf(";");
			if (pos === -1) {
				break;
			}
			var zip = addressTxt.slice(0, pos);
			addressObj.ZIP_CODE = zip;
			followupAddress = followupAddress + zip;
			addressTxt = addressTxt.slice(pos + 1);

			pos = addressTxt.indexOf(";");
			if (pos === -1) {
				break;
			}
			var phoneNo = addressTxt.slice(0, pos);
			followupAddress = followupAddress.replace(/^\s+|\s+$/g,"");
			addressObj.PHONE_NO = phoneNo;
			addressObj.addressTxt = followupAddress;
			addressObj.id = addressId;
			addressObj.SAVED_ADDRESS = true;
			addressTxt = addressTxt.slice(pos + 1);
			if (followupAddress && (followupAddress !== "</br>")) {
				var mapObj = new self.MapObject(addressObj.id, addressObj);
				self.m_addressArray.push(mapObj);
			}
			if (phoneNo !== "") {
				var phoneObj = {};
				phoneObj.id = 1;
				phoneObj.PHONE_NUMBER = phoneNo;
				phoneObj.DEFAULT = 0;
				phoneObj.SAVED_PHONENO = true;
				phoneMapObj = new self.MapObject(phoneObj.id, phoneObj);
				self.m_phoneArray.push(phoneMapObj);
			}
			this.m_prevSelectedAddress = "^" + street + "^" + city + "^" + state + "^" + zip + ";" + phoneNo + ";";
			addressTxt = "";
		}
	} catch (err) {
		logger.logJSError(err, this, "follow-up-o2.js", "getDetailsFromLongText");
	}
};
FollowUpComponentO2.prototype.getAddressPhoneDetails = function (followupObj) {
	var addressFollowupTimerObj = null;
	try {
		var cclParam = [];
		var scriptRequest = new ScriptRequest();
		var self = this;
		var whoId = 0;
		var followupFlag = 0;
		var providerId = followupObj.PROVIDER_ID;
		var organizationId = followupObj.ORGANIZATION_ID;
		var locationId = followupObj.LOCATION_CD;
		var addressLongText = followupObj.ADD_LONG_TEXT;
		if (organizationId > 0) {
			whoId = organizationId;
			followupFlag = 1;
		} else if (locationId > 0) {
			whoId = locationId;
			followupFlag = 1;
		} else if (providerId > 0) {
			whoId = providerId;
			followupFlag = 2;
		}
		if (whoId) {
			addressFollowupTimerObj = new RTMSTimer("ENG:MPG.FOLLOWUP.O2 - Retrieve Address of the Provider", self.criterion.category_mean);
			if (addressFollowupTimerObj) {
				addressFollowupTimerObj.addMetaData("rtms.legacy.metadata.1", "Retrieve Address");
				addressFollowupTimerObj.start();
			}
			cclParam.push("^MINE^", whoId + ".0", self.getTrackingGroupCd() + ".0", followupFlag);
			scriptRequest.setParameterArray(cclParam);
			scriptRequest.setProgramName("MP_RETRIEVE_FOLLOWUP_ADDRESS");
			scriptRequest.setAsyncIndicator(false);
			scriptRequest.setResponseHandler(function (scriptReply) {
				if (addressFollowupTimerObj) {
					addressFollowupTimerObj.stop();
				}
				if (scriptReply.getStatus() === "S") {
					var addressReply = scriptReply.getResponse();
					var addressReplyCount = addressReply.ADDRESS_LIST.length;
					var addressArray = self.m_addressArray;
					var addressArrayLength = addressArray.length;

					if (addressReplyCount) {
						for (var addrCount = 0; addrCount < addressReplyCount; addrCount++) {
							var addressElement = addressReply.ADDRESS_LIST[addrCount];
							var addressObj = {};
							var streetInfo = "";
							var streetDisplay = "";
							var street = "";
							addressObj.id = addressElement.ADDRESS_ID;
							streetInfo = addressElement.STREET_ADDR + " " + addressElement.STREET_ADDR2 + " " + addressElement.STREET_ADDR3 + " " + addressElement.STREET_ADDR4;
							streetDisplay = streetInfo.replace(/^\s+|\s+$/g, "") ? streetInfo.replace(/^\s+|\s+$/g, "") + "</br>" : "";
							street = streetInfo.replace(/^\s+|\s+$/g, "");
							addressObj.STREET = street || "";
							addressObj.STATE = addressElement.STATE;
							addressObj.ZIP_CODE = addressElement.ZIPCODE;
							addressObj.CITY = addressElement.CITY;
							addressObj.DEFAULT = addressElement.DEFAULT;
							addressObj.SAVED_ADDRESS = false;
							addressObj.addressTxt = (streetDisplay + addressObj.CITY + " " + addressObj.STATE + " " + addressElement.ZIPCODE).replace(/^\s+|\s+$/g,"");
							if ((addressArrayLength > 0) && (addressArray[0].value.addressTxt === addressObj.addressTxt)) {
								continue;
							} else {
								var mapObj = new self.MapObject(addressObj.id, addressObj);
								self.m_addressArray.push(mapObj);
							}
						}
					}

					var phoneReplyCount = addressReply.PHONE_LIST.length;
					var phoneArray = self.m_phoneArray;
					var phoneArrayLength = phoneArray.length;
					for (var phoneCount = 0; phoneCount < phoneReplyCount; phoneCount++) {
						var phoneObj = {};
						var phoneElement = addressReply.PHONE_LIST[phoneCount];
						phoneObj.id = phoneElement.PHONE_ID;
						phoneObj.PHONE_NUMBER = phoneElement.PHONE_NUMBER;
						phoneObj.DEFAULT = phoneElement.DEFAULT;
						phoneObj.SAVED_PHONENO = false;
						if (phoneElement.PHONE_NUMBER !== "") {
							if (phoneArrayLength > 0 && (phoneArray[0].value.PHONE_NUMBER === phoneElement.PHONE_NUMBER)) {
								continue;
							} else {
								var phoneMapObj = new self.MapObject(phoneObj.id, phoneObj);
								self.m_phoneArray.push(phoneMapObj);
							}
						}
					}
				}
				CERN_EventListener.fireEvent(null, self, "optionsRendered" + self.m_componentId, null);
				self.autoPopulateAddressPhoneInfo(addressLongText);
			});
			scriptRequest.performRequest();
		} else {
			CERN_EventListener.fireEvent(null, self, "optionsRendered" + self.m_componentId, null);
			self.autoPopulateAddressPhoneInfo(addressLongText);
		}
	} catch (err) {
		if (addressFollowupTimerObj) {
			addressFollowupTimerObj.fail();
			addressFollowupTimerObj = null;
		}
		logger.logJSError(err, this, "follow-up-o2.js", "getAddressPhoneDetails");
	}
};
FollowUpComponentO2.prototype.createAddressSuggestionLine = function (suggestionObj, searchVal) {
	return this.component.HighlightValue(suggestionObj.value.addressTxt, searchVal);
};
FollowUpComponentO2.prototype.handleAddressSelection = function (suggestionObj, textBox, component) {
	var compId = component.getComponentId();
	$("#fu-o2addressControl" + compId).val(suggestionObj.value.STREET);
	$("#city-" + compId).val(suggestionObj.value.CITY);
	$("#state-" + compId).val(suggestionObj.value.STATE);
	$("#zipCode-" + compId).val(suggestionObj.value.ZIP_CODE);
};
FollowUpComponentO2.prototype.searchAddressInstructions = function (callback, textBox, component) {
	try {
		var addressArray = component.m_addressArray;
		var resultArray = [];
		var searchText = textBox.value.replace(/^\s+|\s+$/g, "");
		var matcher = new RegExp("^" + searchText, "i");
		if (addressArray.length) {
			for (var i = 0; i < addressArray.length; i++) {
				var address = addressArray[i].value.addressTxt;
				var found = matcher.test(address);
				if (found) {
					resultArray.push(addressArray[i]);
				}
			}
			callback.autosuggest(resultArray);
		}
	} catch (err) {
		logger.logJSError(err, this, "followup_o2.js", "searchAddressInstructions");
	}
};

FollowUpComponentO2.prototype.createPhoneSuggestionLine = function (suggestionObj, searchVal) {
	return this.component.HighlightValue(suggestionObj.value.PHONE_NUMBER, searchVal);
};

FollowUpComponentO2.prototype.handlePhoneSelection = function (suggestionObj, textBox, component) {
	var compId = component.getComponentId();
	$("#fu-o2phoneControl" + compId).val(suggestionObj.value.PHONE_NUMBER);
};
FollowUpComponentO2.prototype.searchPhoneInstructions = function (callback, textBox, component) {
	try {
		var phoneArray = component.m_phoneArray;
		var resultArray = [];
		var searchText = textBox.value.replace(/^\s+|\s+$/g, "").replace("\(", "\[\(\]").replace("\)", "\[\)\]");
		var matcher = new RegExp("^(" + searchText + ")");
		if (phoneArray.length) {
			for (var i = 0; i < phoneArray.length; i++) {
				var phoneNo = phoneArray[i].value.PHONE_NUMBER;
				var found = matcher.test(phoneNo);
				if (found) {
					resultArray.push(phoneNo);
				}
			}
			callback.autosuggest(resultArray);
		}
	} catch (err) {
		logger.logJSError(err, this, "followup_o2.js", "searchPhoneInstructions");
	}
};
FollowUpComponentO2.prototype.isTextSelected = function (input) {
	if (typeof input.selectionStart == "number") {
		return input.selectionStart === 0 && input.selectionEnd == input.value.length;
	} else if (typeof document.selection != "undefined") {
		input.focus();
		return document.selection.createRange().text == input.value;
	}
};
	
//validate entered date for mm/dd/yy
FollowUpComponentO2.prototype.isDate = function (txtDate) {
	var objDate, // date object initialized from the txtDate string
	mSeconds, // txtDate in milliseconds
	day, // day
	month, // month
	year; // year

	// extract month, day and year from the txtDate (expected format is mm/dd/yyyy)
	// subtraction will cast variables to integer implicitly (needed
	// for !== comparing)
	month = txtDate.substring(0, 2) - 1; // because months in JS start from 0
	day = txtDate.substring(3, 5) - 0;
	year = txtDate.substring(6, 10) - 0;

	// convert txtDate to milliseconds
	mSeconds = (new Date(year, month, day)).getTime();
	// initialize Date() object from calculated milliseconds
	objDate = new Date();
	objDate.setTime(mSeconds);
	// compare input date and parts from Date() object
	// if difference exists then date isn't valid
	if (objDate.getFullYear() !== year ||
		objDate.getMonth() !== month ||
		objDate.getDate() !== day) {
		return false;
	}
	// otherwise return true
	return true;
};
FollowUpComponentO2.prototype.renderFollowupDateControl = function (rowDataObj) {
	var self = this;
	var compId = this.m_componentId;
	var dateControlElem = $("#fu-o2-timeframe-" + compId);
	var selectedOption = "";
	var dateFormat = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	var fullDateTime4Year = mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR;
	var dateObj = new Date();
	var todayDate = dateFormat.format(dateObj, fullDateTime4Year);
	var followupDays = (rowDataObj.FOL_DAYS) ? rowDataObj.FOL_DAYS : "";
	var followupDayorWeek = rowDataObj.DAY_OR_WEEK;
	var followupWithIn = (rowDataObj.FOL_WITHIN_RANGE) ? rowDataObj.FOL_WITHIN_RANGE : "";
	var followupOn = (rowDataObj.FOLLOWUP_DT_TM && rowDataObj.FOLLOWUP_DT_TM !== "TZ" && !followupDays) ? rowDataObj.FOLLOWUP_DT_TM : "";
	var defaultDate = "--/--/----";
	var defaultTime = "--:--";
	var followupDate = defaultDate;
	var followupTime = defaultTime;
	var followupDateFormat = MP_Util.GetDateFormatter().lc.fulldate2yr;
	var i18nFollowUp = i18n.discernabu.FollowupComponent_O2;

	if (followupOn) {
		var date = new Date();
		date.setISO8601(followupOn);
		followupDate = (date) ? dateFormat.format(date, fullDateTime4Year) : defaultDate;
		followupTime = dateFormat.format(date, mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS);
	}
	if (followupDays) {
		selectedOption = "in";
	} else if (followupWithIn) {
		selectedOption = "within";
	} else if (followupOn) {
		selectedOption = "on";
	}
	var dateControlHTML = "<dl><dt class='fu-o2-date-control-selector'><select id='fu-o2-date-selector-" + compId + "'><option value='-1'></option><option value='in'>" + i18nFollowUp.IN + "</option><option value='within'>" + i18nFollowUp.WITHIN + "</option><option value='on'>" + i18nFollowUp.ON + "</option><option value='none'>" + i18nFollowUp.NONE + "</option></select></dt><dd class='fu-o2-date-control-value'>";
	dateControlHTML += "<div class='fu-o2-date-info' id='followupInDetails" + compId + "'><input id='followupDaysInput" + compId + "' class='fu-o2-followup-days' value='" + followupDays + "'/><select id='followupDaysCombo" + compId + "'>";
	var daysOrWeeksArray = [[-1, ""], [0, i18nFollowUp.DAYS], [1, i18nFollowUp.WEEKS], [2, i18nFollowUp.MONTHS], [3, i18nFollowUp.YEARS]];
	var arrayLength = daysOrWeeksArray.length;
	for (var index = 0; index < arrayLength; index++) {
		var selectedValue = (daysOrWeeksArray[index][0] === followupDayorWeek) ? "selected" : "";
		dateControlHTML += "<option value='" + daysOrWeeksArray[index][0] + "' " + selectedValue + ">" + daysOrWeeksArray[index][1] + "</option>";
	}
	dateControlHTML += "</select></div><select id='followupWithInSelect" + compId + "'></select>";
	dateControlHTML += "<div id='followupDateControlInput" + compId + "' class='fu-o2-sp-date-info'><input type='text' maxlength='10' class='fu-o2-calendar-input' value='" + followupDate + "' id='followupCalendarInput" + compId + "'/><input type='text' maxlength='5' class='fu-o2-time-input' id='followupTimeInput" + compId + "' value='" + followupTime + "'/></div>";
	dateControlHTML += "</dd>";
	dateControlElem.append(dateControlHTML);
	self.renderWithInOption(rowDataObj.FOL_WITHIN_RANGE);

	//date control objects
	var selectorElem = $("#fu-o2-date-selector-" + compId);
	var inOptionElem = $("#followupInDetails" + compId);
	var aboutOptionElem = $("#followupWithInSelect" + compId);
	var onOptionElem = $("#followupDateControlInput" + compId);
	var daysInputElem = $("#followupDaysInput" + compId);
	var daysSelectElem = $("#followupDaysCombo" + compId);
	var calendarInputElem = $("#followupCalendarInput" + compId);
	var timeInputElem = $("#followupTimeInput" + compId);
	var selectorOption = $("#fu-o2-date-selector-" + compId + " option[value='-1']");

	if (selectedOption) {
		selectorElem.val(selectedOption);
	}

	function daysInMonth(iMonth, iYear) {
		return 32 - new Date(iYear, iMonth, 32).getDate();
	}
	function handleDateControl() {
		var selectedValue = selectorElem.val();
		if (selectedValue !== "-1") {
			selectorOption.remove();
		}
		switch (selectedValue) {
		case "on":
			onOptionElem.removeClass("hidden");
			inOptionElem.addClass("hidden");
			aboutOptionElem.addClass("hidden");
			if (calendarInputElem.val() === defaultDate) {
				calendarInputElem.datepicker("setDate", todayDate).datepicker("show");
				calendarInputElem.removeClass("required-field-input");
				timeInputElem.addClass("required-field-input");
				timeInputElem.prop("disabled", false);
				if (timeInputElem.val() === defaultTime) {
					self.disableFollowupSaveButton();
				}
			}
			break;
		case "in":
			inOptionElem.removeClass("hidden");
			onOptionElem.addClass("hidden");
			aboutOptionElem.addClass("hidden");
			break;
		case "within":
			aboutOptionElem.removeClass("hidden");
			inOptionElem.addClass("hidden");
			onOptionElem.addClass("hidden");
			break;
		case "none":
			aboutOptionElem.addClass("hidden");
			inOptionElem.addClass("hidden");
			onOptionElem.addClass("hidden");
			break;
		default:
			aboutOptionElem.addClass("hidden");
			inOptionElem.addClass("hidden");
			onOptionElem.addClass("hidden");
			break;
		}
	}
	
	handleDateControl();
	daysInputElem.trigger('blur');
	
	daysInputElem.on({
		blur : function () {
			if ($.trim($(this).val()) === "") {
				daysSelectElem.prop('selectedIndex', 0);
				daysSelectElem.prop("disabled", true);
			} else {
				daysSelectElem.prop("disabled", false);
			}
		},
		keypress : function (event) {
			event = event || window.event;
			var charCode = event.which || event.keyCode;
			if (charCode != 8 && charCode !== 0 &&(charCode < 48 || charCode > 57)) {
				return false;
			} else {
				if (daysSelectElem.prop('selectedIndex') === 0) {
					daysSelectElem.prop('selectedIndex', 1);
				}
				daysSelectElem.prop("disabled", false);
			}
		}
	});

	daysSelectElem.on({
		change : function () {
			if (daysSelectElem.prop('selectedIndex') === 0) {
				daysSelectElem.addClass("required-field-input");
				self.disableFollowupSaveButton();
			} else {
				daysSelectElem.removeClass("required-field-input");
				self.enableFollowupSaveButton();
			}
		}
	});
	timeInputElem.on({
		click : function(){
			if(timeInputElem.val() === defaultTime){
				timeInputElem.val("");
			}
		},
		keypress : function (event) {
			event = event || window.event;
			var charCode = event.which || event.keyCode;
			/*
			Key codes used in keyup validation
			8 - Backspace
			46 - Delete
			78 - Alphabet N
			110 - Alphabet n
			65-90 - A to Z
			 */
			var BACKSPACE_KEYCODE = 8;
			var DELETE_KEYCODE = 46;
			var CAPSN_KEYCODE = 78;
			var SMALLN_KEYCODE = 110;
			if ((charCode == BACKSPACE_KEYCODE || charCode == DELETE_KEYCODE) || !timeInputElem.val()) {
				timeInputElem.val("");
				self.disableFollowupSaveButton();
				timeInputElem.addClass("required-field-input");
			}
			if ((charCode > 31 && (charCode < 48 || charCode > 58) && charCode != 37 && charCode != 39)) {
				if (charCode == CAPSN_KEYCODE || charCode == SMALLN_KEYCODE) {
					var dateFormat = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
					var timeFormat = mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS;
					var dateObj = new Date();
					var followupTime = dateFormat.format(dateObj, timeFormat);
					timeInputElem.val(followupTime);
					self.enableFollowupSaveButton();
					timeInputElem.removeClass("required-field-input");
				}
				return false;
			}
		},
		keyup : function () {
			var timeVal = timeInputElem.val();
			var regexp = /^([0-9]|0[0-9]|1[0-9]|2[0-3])[0-5][0-9]$/;
			timeVal = timeVal.replace(/:/, "");
			var numberCheck = regexp.exec(timeVal);
			if (numberCheck === null || timeVal.length > 4) {
				timeInputElem.addClass("required-field-input");
				self.disableFollowupSaveButton();
				return;
			} else {
				//Give : after hours
				var timeValue = timeVal.substring(0, timeVal.length - 2);
				timeValue = timeValue + ':' + timeVal.substring(timeVal.length - 2, timeVal.length);
				timeInputElem.val(timeValue);
				timeInputElem.removeClass("required-field-input");
				self.enableFollowupSaveButton();
			}
		}
	});
	
	//to set cursor position
	(function($)
	{
		$.fn.setCursorPosition = function (pos)
		{
			if ($(this).get(0).setSelectionRange)
			{
				$(this).get(0).setSelectionRange(pos, pos);
			} else if ($(this).get(0).createTextRange)
			{
				var range = $(this).get(0).createTextRange();
				range.collapse(true);
				range.moveEnd('character', pos);
				range.moveStart('character', pos);
				range.select();
			}
		};
	}) (jQuery);
	
	calendarInputElem.on({
		click : function(){
			if(calendarInputElem.val() === defaultDate){
				calendarInputElem.val("");
			}
		},
		keydown : function (event) {
			var characterCode;
			if (event && event.which) { // NN4 specific code
				event = event;
				characterCode = event.which;
			} else {
				characterCode = event.keyCode;
				// IE specific code
			}
			var key_code = characterCode,
			currentDate = new Date();
			var eventValue = window.event||event;
			var Obj = this;
			var requiredDate = "";
			switch (key_code) {
			case 84:
				//t -> today
				requiredDate = String(currentDate.getMonth() + 1).padL(2, "0") + "/" + String(currentDate.getDate()).padL(2, "0") + "/" + currentDate.getFullYear();
				break;
			case 89:
				//y -> beginning of year
				requiredDate = String(1).padL(2, "0") + "/" + String(1).padL(2, "0") + "/" + currentDate.getFullYear();
				break;
			case 82:
				//r -> end of year
				requiredDate = String(12).padL(2, "0") + "/" + String(31).padL(2, "0") + "/" + currentDate.getFullYear();
				break;
			case 77:
				//m -> beginning of month
				requiredDate = String(currentDate.getMonth() + 1).padL(2, "0") + "/" + String(1).padL(2, "0") + "/" + currentDate.getFullYear();
				break;
			case 72:
				//h -> end of month
				requiredDate = String(currentDate.getMonth() + 1).padL(2, "0") + "/" + String(daysInMonth(currentDate.getMonth(), currentDate.getFullYear())).padL(2, "0") + "/" + currentDate.getFullYear();
				break;
			case 87:
				//w -> beginning of week
				requiredDate = String(currentDate.getMonth() + 1).padL(2, "0") + "/" + String(currentDate.getDate() - currentDate.getDay()).padL(2, "0") + "/" + currentDate.getFullYear();
				break;
			case 75:
				//k -> end of week
				requiredDate = String(currentDate.getMonth() + 1).padL(2, "0") + "/" + String(currentDate.getDate() + (6 - currentDate.getDay())).padL(2, "0") + "/" + currentDate.getFullYear();
				break;
			}
			if (requiredDate) {
				Obj.value = dateFormat.format(new Date(requiredDate), fullDateTime4Year);
			}
			//date format is mm/dd/yyyy
			if ((followupDateFormat === "mm/dd/yy") && !eventValue.shiftKey && !eventValue.ctrlKey && !eventValue.altKey) {
				if ((key_code > 47 && key_code < 58) || (key_code > 95 && key_code < 106)) {
					if (key_code > 95) {
						key_code -= (95 - 47);
					}

					var idx = Obj.value.search(/[\-]/);
					//allow to replace '-' with 0 or 1 at month position
					if (idx === 0 && (String.fromCharCode(key_code) === '0' || String.fromCharCode(key_code) === '1')) {
						var test = Obj.value.replace(/[\-]/, String.fromCharCode(key_code));

						idx = test.search(/[\-]/);
						if (idx == -1) {
							if (self.isDate(test)) {
								Obj.value = Obj.value.replace(/[\-]/, String.fromCharCode(key_code));
							}
						} else {
							Obj.value = Obj.value.replace(/[\-]/, String.fromCharCode(key_code));
						}
					}
					//allow to replace '-' with 0/1/2/3 at date position.
					else if (idx == 3 &&
						(String.fromCharCode(key_code) == '0' ||
							String.fromCharCode(key_code) == '1' ||
							String.fromCharCode(key_code) == '2' ||
							String.fromCharCode(key_code) == '3')) {

						var testStr = Obj.value.replace(/[\-]/, String.fromCharCode(key_code));
						idx = testStr.search(/[\-]/);

						if (idx == -1) {
							if (self.isDate(testStr)) {
								Obj.value = Obj.value.replace(/[\-]/, String.fromCharCode(key_code));
							}
						} else {
							Obj.value = Obj.value.replace(/[\-]/, String.fromCharCode(key_code));
						}
					} else if (idx == 4) {
						var testString = Obj.value.replace(/[\-]/, String.fromCharCode(key_code));
						idx = testString.search(/[\-]/);

						if (idx == -1) {
							if (self.isDate(testString)) {
								Obj.value = Obj.value.replace(/[\-]/, String.fromCharCode(key_code));
							}
						} else {
							//if 3 is entered at date position allow to enter 1/0
							if (Obj.value.substring(3, 4) == '3') {
								if (String.fromCharCode(key_code) == '0' || String.fromCharCode(key_code) == '1') {
									Obj.value = Obj.value.replace(/[\-]/, String.fromCharCode(key_code));
								}
							} else if (Obj.value.substring(3, 4) == '0') {
								if (String.fromCharCode(key_code) != '0') {
									Obj.value = Obj.value.replace(/[\-]/, String.fromCharCode(key_code));
								}
							} else {
								Obj.value = Obj.value.replace(/[\-]/, String.fromCharCode(key_code));
							}
						}
					} else if (idx !== 0 && idx != 3) {
						var testStrValue = Obj.value.replace(/[\-]/, String.fromCharCode(key_code));
						idx = testStrValue.search(/[\-]/);
						if (idx == -1) {
							if (self.isDate(testStrValue)) {
								Obj.value = Obj.value.replace(/[\-]/, String.fromCharCode(key_code));
							}
						} else {
							Obj.value = Obj.value.replace(/[\-]/, String.fromCharCode(key_code));
						}
					}
				}

				//on backspace replace the number with '-'
				if (key_code == 8) {
					try{
						if (!Obj.value.match(/^[\-0-9]{2}\/[\-0-9]{2}\/[\-0-9]{4}$/)) {
							Obj.value = defaultDate;
						} else if (Obj.value.match(/^[\-0-9]{2}\/[\-0-9]{2}\/[\-0-9]{4}$/) && self.isTextSelected(Obj)) {
							Obj.value = defaultDate;
						}
						var range = document.selection.createRange();
						range.moveStart('character', -Obj.value.length);
						var index = range.text.length;
						if (Obj.value.charAt(index - 1) != "/") {
							Obj.value = Obj.value.replaceAt(index - 1, "-");
						}
						$(Obj).setCursorPosition(index - 1);
						eventValue.returnValue = 0;
					}catch(err){
						MP_Util.LogJSError(err, self, "follow-up-o2.js", "createRange is not supported in the current browser");
					}
				}

				if (key_code == 46) {
					Obj.value = defaultDate;
				}
			}
			if (key_code != 9 && key_code != 37 && key_code != 39) {
				eventValue.returnValue = false;
				return false;
			}
		},
		keyup : function () {
			var selectedDateValue = calendarInputElem.val();
			var isValidDate = false;
			if (selectedDateValue && selectedDateValue !== defaultDate) {
				isValidDate = self.validateEnteredDate(selectedDateValue, followupDateFormat);
			}
			if (!isValidDate) {
				timeInputElem.val(defaultTime);
				timeInputElem.prop("disabled", true);
				calendarInputElem.addClass("required-field-input");
				self.disableFollowupSaveButton();
			} else {
				timeInputElem.prop("disabled", false);
				calendarInputElem.removeClass("required-field-input");
				if(timeInputElem.val() !== defaultTime){
					timeInputElem.removeClass("required-field-input");
					self.enableFollowupSaveButton();
				}
			}
		}
	});
	selectorElem.on('change', function () {
		var selectedValue = selectorElem.val();
		handleDateControl();
		selectorOption.remove();
		self.enableFollowupSaveButton();
		//clear the vlaues
		aboutOptionElem.prop('selectedIndex', 0);
		daysSelectElem.prop('selectedIndex', 0);
		daysSelectElem.prop("disabled", true);
		if (selectedValue !== "on") {
			calendarInputElem.val(defaultDate);
			timeInputElem.prop("disabled", true);
		} else {
			timeInputElem.prop("disabled", false);
			if (timeInputElem.val() === defaultTime) {
				self.disableFollowupSaveButton();
			}
		}
		timeInputElem.val(defaultTime);
		daysInputElem.val("");
	});
	var datepicker_opts = {
		showOn : "both",
		buttonImage : CERN_static_content + "/images/4974.png",
		buttonImageOnly : true,
		buttonText : i18n.discernabu.FollowupComponent_O2.CALENDAR,
		//The hidden field to receive the date
		altField : "#followupCalendarInput" + compId,
		//The format we want
		altFormat : followupDateFormat,
		//The format the user actually sees
		dateFormat : followupDateFormat,
		onSelect : function () {
			timeInputElem.prop("disabled", false);
			if (timeInputElem.val() === defaultTime) {
				timeInputElem.addClass("required-field-input");
				self.disableFollowupSaveButton();
			}
			calendarInputElem.removeClass("required-field-input");
		}
	};
	calendarInputElem.datepicker(datepicker_opts);
};
//prepend 0 when single digit appears
String.prototype.padL = function (nLength, sChar) {
	var sreturn = this;
	while (sreturn.length < nLength) {
		sreturn = String(sChar) + sreturn;
	}
	return sreturn;
};
//replace with the character at specified index.
String.prototype.replaceAt = function (index, character) {
	return this.substr(0, index) + character + this.substr(index + character.length);
};
/**
 * Disables/Dither the Save Button
 * @param {null}
 */
FollowUpComponentO2.prototype.disableFollowupSaveButton = function () {
	var compId = this.getComponentId();
	var saveButtonObj = $("#followUpSaveButton" + compId);
	if (saveButtonObj && !saveButtonObj.prop("disabled")) {
		saveButtonObj.addClass("disabled").prop('disabled', true);
	}
};

/**
 * Enables the Save Button
 * @param {null} Button Id with the component Id
 */
FollowUpComponentO2.prototype.enableFollowupSaveButton = function () {
	var compId = this.getComponentId();
	var saveButtonObj = $("#followUpSaveButton" + compId);
	if (saveButtonObj && saveButtonObj.prop("disabled")) {
		saveButtonObj.removeClass("disabled").removeProp('disabled');
	}
};
FollowUpComponentO2.prototype.validateEnteredDate = function (value, dateFormat) {
	dateFormat = dateFormat || 'mm/dd/yyyy'; // default format

	delimiter = /[^mdy]/.exec(dateFormat)[0];
	theFormat = dateFormat.split(delimiter);
	theDate = value.split(delimiter);

	isDate = function (date, format) {
		var month,day,year;
		var arrayLength = format.length;
		for (var i = 0, len = arrayLength; i < len; i++) {
			if (/m/.test(format[i])){month = date[i];}
			if (/d/.test(format[i])){day = date[i];}
			if (/y/.test(format[i])){year = date[i];}
		}
		return (
			month > 0 && month < 13 &&
			year && year.length === 4 &&
			day > 0 && day <= (new Date(year, month, 0)).getDate());
	};

	return isDate(theDate, theFormat);
};
FollowUpComponentO2.prototype.renderWithInOption = function (withInRange) {
	var result = this.getDateRangeArray();
	var selectElem = $("#followupWithInSelect" + this.m_componentId);
	var followupWithIn = (withInRange) ? withInRange : "";
	if (result) {
		var selectedOption = null;
		var optionsHTML = "<option value=''></option>";

		//Insert items into dateControlHTML
		var len = result.length;
		for (var i = 0; i < len; i++) {
			if (result.hasOwnProperty(i)) {
				selectedOption = (result[i].DISPLAY_VALUE === followupWithIn) ? "selected" : "";
				optionsHTML += "<option value='" + result[i].CODE_VALUE + "' " + selectedOption + ">" + result[i].DISPLAY_VALUE + "</option>";
			}
		}
		selectElem.append(optionsHTML);
	}
};

FollowUpComponentO2.prototype.highlightSelectedRow = function (selRowObj, isInitialLoad) {
	try {
		var compID = this.getComponentId();
		var rowID = "";

		// Fix up the element ids, remove the :'s and set them up with escape
		// chars, we only want to do this when selRowObj is true

		if (selRowObj) {
			var rowParts = selRowObj.id.split(":");
			for (var i = 0; i < rowParts.length; i++) {
				rowID += rowParts[i];
				// If not the last part, add an escaped colon
				if ((i + 1) !== rowParts.length) {
					rowID += "\\:";
				}
			}
		}

		var tableViewObj = $("#fu-o2" + compID + "table");
		var prevRow = tableViewObj.find(".selected");

		// Remove the background color of previous selected row.
		if (prevRow.length) {
			if (prevRow.hasClass("fu-o2-wf-selected-row selected")) {
				prevRow.removeClass("fu-o2-wf-selected-row selected");
			}
			if (prevRow.hasClass("fu-o2-wf-selected-row-init selected")) {
				prevRow.removeClass("fu-o2-wf-selected-row-init selected");
			}
		}

		// Change the background color to indicate that the row is selected. If
		// its an initial load then the first row has a different styling
		var newClass = "fu-o2-wf" + (isInitialLoad ? "-selected-row-init" : "-selected-row") + " selected";
		$("#" + rowID).addClass(newClass);
		
		////scroll to specified row
		var compDOMObj = $("#" + this.getStyles().getContentId());
		var contentBodyObj = $(compDOMObj).find(".content-body");
		if (this.m_offsetTopAdjustment === null) {
			var firstRow = contentBodyObj.find(".result-info").eq(0);
			m_offsetTopAdjustment = -firstRow[0].offsetTop;
		}
		var newScrollTop = contentBodyObj[0].scrollTop;
		var rowOffsetTop = selRowObj.offsetTop + m_offsetTopAdjustment;
		var rowOffsetHeight = selRowObj.offsetHeight;
		var contentBodyHeight = contentBodyObj[0].clientHeight;
		//if the top of selected row is outside of viewing area, scroll the container up to show the row.
		if (rowOffsetTop < newScrollTop) {
			newScrollTop = rowOffsetTop;
		}
		//if the bottom of selected is outside of viewing area, scroll the container down to show the row.
		if (rowOffsetTop + rowOffsetHeight > newScrollTop + contentBodyHeight) {
			newScrollTop = rowOffsetTop + rowOffsetHeight - contentBodyHeight;
		}	
		contentBodyObj.scrollTop(newScrollTop);
	} catch (err) {
		MP_Util.LogJSError(err, this, "follow-up-o2.js", "highlightSelectedRow");
	}
};
FollowUpComponentO2.prototype.initializeSidePanel = function () {
	var self = this;
	var compID = this.getComponentId();
	var sidePanelContId = "fu-o2" + compID + "sidePanelContainer";
	this.m_sidePanelContainer = $("#" + sidePanelContId);
	this.m_sidePanelMinHeight = "280px";
	var windowPadding = 70; //extra padding at bottom of pane between window
	var maxViewHeight = ($("#vwpBody").height() - windowPadding) + "px";
	this.m_tableContainer = $("#fu-o2" + compID + "table");

	// Add a container to hold side panel
	var followUpPanelContent = $("#fu-o2-" + compID + "-instructions-container");

	// Create a side panel object only first time
	if (!this.m_sidePanelContainer.length) {
		var followUpSidePanelContainer = "<div id='" + sidePanelContId + "' class='fu-o2-side-panel'>&nbsp;</div>";
		followUpPanelContent.append(followUpSidePanelContainer);
	}

	// Create the side panel
	this.m_sidePanel = new CompSidePanel(compID, sidePanelContId);
	this.m_sidePanel.setExpandOption(this.m_sidePanel.expandOption.EXPAND_DOWN);
	this.m_sidePanel.setFullPanelScrollOn(true);
	this.m_sidePanel.setMinHeight(this.m_sidePanelMinHeight);
	this.m_sidePanel.setMaxHeight(maxViewHeight);
	this.m_sidePanel.renderPreBuiltSidePanel();
	this.m_sidePanel.showCornerCloseButton();
	// Set the function that will be called when the close button on the side panel is clicked
	this.m_sidePanel.setCornerCloseFunction(function () {
		self.m_tableContainer.removeClass("fu-o2-sp-hide-mode");
		self.highlightSelectedRow(false, false);
		self.m_showPanel = false;
		self.m_clickedRow = null;
		self.m_sidePanelContainer.css("display", "none");
		self.resizeComponent();
		
		// Remove the class "fu-o2-table" from component table so that the hidden column's are visible
		$("#fu-o2" + compID + "-full-table").removeClass("fu-o2-table");
	});

	this.m_sidePanelContainer = $("#" + sidePanelContId);
};
FollowUpComponentO2.prototype.displayQuickPickDetails = function (recordData) {
	var compNS = this.getStyles().getNameSpace();
	var compID = this.getComponentId();
	var i18nFollowUp = i18n.discernabu.FollowupComponent_O2;
	var quickPickLength = recordData.QUICK_PICKS.length;
	var pcpLength = recordData.PRIMARY_CARE_PHYSICIAN.length;
	var phyisicianLength = recordData.ATTENDING_PHYSICIAN.length;
	var htmlArray = [];
	var quickPickList = [];
	for (var pcpCount = 0;
		pcpCount < pcpLength;
		pcpCount++) {
		var pcpVal = recordData.PRIMARY_CARE_PHYSICIAN[pcpCount];
		htmlArray.push("<div class='" + compNS + "-pcp-val' pcp-id='" + pcpVal.PRIMARY_PHYS_ID + "' pcp-name='" + pcpVal.PRIMARY_PHYS_NAME  + "'><span>"+i18nFollowUp.PCP+"- </span>" + pcpVal.PRIMARY_PHYS_NAME + "</div>");
	}	
	for (var phyisicianCount = 0;
		phyisicianCount < phyisicianLength;
		phyisicianCount++) {
		var physicianVal = recordData.ATTENDING_PHYSICIAN[phyisicianCount];
		htmlArray.push("<div class='" + compNS + "-att-phys-val' att-phys-id='" + physicianVal.ATTENDING_PHYS_ID + "' att-phys-name='" + physicianVal.ATTENDING_PHYS_NAME + "'><span>"+i18nFollowUp.ATTENDING_PHYSICIAN+"- </span>" + physicianVal.ATTENDING_PHYS_NAME + "</div>");
	}	
	for (var quickPickCount = 0;
		quickPickCount < quickPickLength;
		quickPickCount++) {
		var quickPickVal = recordData.QUICK_PICKS[quickPickCount];
		htmlArray.push("<div class='" + compNS + "-quick-pick-val' quick-pick-id='" + quickPickVal.CV + "'>" + quickPickVal.DISPLAY + "</div>");
		var quickPickObject = {};
		quickPickObject.WHO_ID = quickPickVal.CV;
		quickPickObject.WHO_NAME = quickPickVal.DISPLAY;
		var mapObj = new this.MapObject(quickPickObject.WHO_ID, quickPickObject);
		quickPickList.push(mapObj);
	}
	var quickPicHtml=htmlArray.join("");
	$("#"+compNS+"-quick-picks-fieldset"+compID).append(quickPicHtml);
};
FollowUpComponentO2.prototype.setClinicalOrganization = function (clinicalOrgList) {
	var organizationList = [];
	for (var orgIndex = 0;orgIndex < clinicalOrgList.length;orgIndex++) {
		var objOrganization = clinicalOrgList[orgIndex];
		var orgObject = {};
		orgObject.WHO_ID = objOrganization.ORGANIZATION_ID;
		orgObject.WHO_NAME = objOrganization.ORG_NAME;
		var mapObj = new this.MapObject(orgObject.WHO_ID, orgObject);
		organizationList.push(mapObj);
	}
	this.setClinicalFollowupArray(organizationList);
};
FollowUpComponentO2.prototype.displayFollowUpFavorites = function (recordData) {
	var compNS = this.getStyles().getNameSpace();
	var compID = this.getComponentId();
	var orgArray = this.getClinicalFollowupArray();
	var favoriteLength = recordData.FAVORITES.length;
	var favoriteList = [];
	var i18nFollowUp = i18n.discernabu.FollowupComponent_O2;
	var jsTabContent = "";
	for (var favoriteCount = 0;favoriteCount < favoriteLength;favoriteCount++) {
		var whoString = "";
		var date = null;
		var favoriteInfo = "";
		var whenWithIn = "";
		var favoriteInstElement = recordData.FAVORITES[favoriteCount];
		if (orgArray && (favoriteInstElement.WHO_NAME === "ORGANIZATION")) {
			var orgDetails = MP_Util.GetValueFromArray(favoriteInstElement.WHO_ID, orgArray);
			whoString = orgDetails.WHO_NAME;
		} else {
			whoString = favoriteInstElement.WHO_STRING;
		}
		if (favoriteInstElement.WHEN_WITHIN_CD) {
			var dateRangeArray = this.getDateRangeArray();
			var dateRangeLength = dateRangeArray.length;
			for (var arrayCount = 0;arrayCount < dateRangeLength;arrayCount++) {
				if (dateRangeArray[arrayCount].CODE_VALUE === favoriteInstElement.WHEN_WITHIN_CD) {
					favoriteInfo = i18nFollowUp.WITHIN + " " + dateRangeArray[arrayCount].DISPLAY_VALUE;
					whenWithIn = dateRangeArray[arrayCount].DISPLAY_VALUE;
				}
			}
		} else {
			if (favoriteInstElement.WHEN_IN_VAL && (favoriteInstElement.WHEN_IN_TYPE_FLAG > -1)) {
				var daysOrWeeksArray = [[-1, ""], [0, i18nFollowUp.DAYS], [1, i18nFollowUp.WEEKS], [2, i18nFollowUp.MONTHS], [3, i18nFollowUp.YEARS]];
				var arrayLength = daysOrWeeksArray.length;
				var selectedValue = "";
				for (var arrayIndex = 0;arrayIndex < arrayLength;arrayIndex++) {
					if (daysOrWeeksArray[arrayIndex][0] === favoriteInstElement.WHEN_IN_TYPE_FLAG) {
						selectedValue = daysOrWeeksArray[arrayIndex][1];
					}
				}
				favoriteInfo = i18nFollowUp.IN + " " + favoriteInstElement.WHEN_IN_VAL + " " + selectedValue;
			} else {
				if (favoriteInstElement.WHEN_DATE && favoriteInstElement.WHEN_DATE !== "TZ") {
					var dateFormat = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
					date = new Date();
					date.setISO8601(favoriteInstElement.WHEN_DATE);
					favoriteInfo = (date) ? dateFormat.format(date, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR) : "";
				}
			}
		}
		favoriteInfo = favoriteInfo + ((favoriteInstElement.WHEN_NEEDED_IND > 0) ? " ," + i18nFollowUp.ONLY_IF_NEEDED : "");
		favoriteInfo = favoriteInfo.replace(/^ ,/, " ");
		favoriteInfo = (favoriteInfo) ? " - " + favoriteInfo : "";
		jsTabContent = jsTabContent + "<dl id='" + favoriteInstElement.FAVORITE_ID + "' class='" + compNS + "-fav-res'><dt class='" + compNS + "-fav-name'>" + whoString + favoriteInfo + "</dt><dd class='" + compNS + "-fav-val'></dd></dl>";
		var FollowupObj = new this.FollowupDetailsInstance();
		FollowupObj.id = favoriteInstElement.FAVORITE_ID;
		FollowupObj.whoId = favoriteInstElement.WHO_ID;
		FollowupObj.whoType = favoriteInstElement.WHO_NAME;
		FollowupObj.whoString = whoString;
		FollowupObj.whenDtTm = date;
		FollowupObj.whenWithIn = whenWithIn;
		FollowupObj.whenWithInCd = favoriteInstElement.WHEN_WITHIN_CD;
		FollowupObj.daysOrWeek = favoriteInstElement.WHEN_IN_TYPE_FLAG;
		FollowupObj.followupDays = favoriteInstElement.WHEN_IN_VAL;
		FollowupObj.whenNeededInd = favoriteInstElement.WHEN_NEEDED_IND;
		FollowupObj.addressLongText = favoriteInstElement.WHERE_TXT;
		FollowupObj.commentText = favoriteInstElement.COMMENT_TXT;
		FollowupObj.favoriteInfo = favoriteInfo;
		var mapObj = new this.MapObject(FollowupObj.id, FollowupObj);
		favoriteList.push(mapObj);
	}
	this.setFavoritesFollowupArray(favoriteList);
	$("#" + compNS + "-favorites-fieldset" + compID).append(jsTabContent);
};

FollowUpComponentO2.prototype.setTitleForSearchField = function (tabIndex) {
	var component = this;
	var compId = component.getComponentId();
	var compNS = component.getStyles().getNameSpace();
	var autoSuggCtrlObject = $("#" + compNS + "ContentCtrl" + compId);
	var i18nFollowUp = i18n.discernabu.FollowupComponent_O2;
	switch (tabIndex) {
	case component.m_followupComponentIndex.PROVIDER:
		autoSuggCtrlObject.attr("title", i18nFollowUp.SEARCH_PROVIDER);
		break;
	case component.m_followupComponentIndex.LOCATION:
		autoSuggCtrlObject.attr("title", i18nFollowUp.SEARCH_LOCATION);
		break;
	default:
		break;
	}
};
FollowUpComponentO2.prototype.attachListners = function () {
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var component = this;
	var criterion = component.getCriterion();
	var tabContentObject = $("#tabContainer" + compId);
	var quickPicksObject = $("#quickPicksContainer" + compId);
	var favoritesObject = $("#favoritesContainer" + compId);

	//Check and clean up objects which are no longer used
	var autoSuggCtrlObject = $("#" + compNS + "ContentCtrl" + compId);
	var clearSearchTxtObject = $("#" + compId + "-clear-sugg-text");

	var i18nFollowUp = i18n.discernabu.FollowupComponent_O2;
	var BACKSPACE_KEYCODE = 8;
	var DELETE_KEYCODE = 46;

	component.setTitleForSearchField(component.m_selectedTab);
	autoSuggCtrlObject.keydown(function (event) {
		if (((event.keyCode === BACKSPACE_KEYCODE) || (event.keyCode === DELETE_KEYCODE)) && (autoSuggCtrlObject.length === 1)) {
			clearSearchTxtObject.css("visibility", "hidden");
		}
	});
	autoSuggCtrlObject.keyup(function (event) {
		if (((event.keyCode === BACKSPACE_KEYCODE) || (event.keyCode === DELETE_KEYCODE)) && (autoSuggCtrlObject.val().length === 0)) {
			clearSearchTxtObject.css("visibility", "hidden");
		}
	});
	autoSuggCtrlObject.focus(function () {
		if ($(this).val() === $(this)[0].title) {
			$(this).removeClass(compNS + "-search-title").val("");
		}
	});
	autoSuggCtrlObject.focusout(function () {
		if ($(this).val() === "") {
			$(this).addClass(compNS + "-search-title");
			$(this).val($(this)[0].title);
		}
	});
	clearSearchTxtObject.mouseenter(function () {
		clearSearchTxtObject.addClass(compNS + "-delete-hover");
	});
	clearSearchTxtObject.mouseout(function () {
		clearSearchTxtObject.removeClass(compNS + "-delete-hover");
	});

	clearSearchTxtObject.click(function () {
		autoSuggCtrlObject.val("");
		autoSuggCtrlObject.focusout();
		clearSearchTxtObject.removeClass(compNS + "-delete-hover").css("visibility", "hidden");
	});

	quickPicksObject.on("click", "." + compNS + "-quick-pick-val, ." + compNS + "-att-phys-val , ." + compNS + "-pcp-val", function () {
		var clickedElement = $(this);
		var defaultInd = null;
		var selectedClass = clickedElement.attr("Class");
		component.m_followupDetails = new component.FollowupDetailsInstance();
		var followupDetails = component.m_followupDetails;
		switch (selectedClass) {
		case compNS + "-quick-pick-val":
			followupDetails.quickPickCd = clickedElement.attr("quick-pick-id");
			followupDetails.whoString = clickedElement.text();
			defaultInd = 0;
			break;
		case compNS + "-att-phys-val":
			followupDetails.whoId = clickedElement.attr("att-phys-id");
			followupDetails.whoString = clickedElement.attr("att-phys-name");
			defaultInd = 1;
			break;
		case compNS + "-pcp-val":
			followupDetails.whoId = clickedElement.attr("pcp-id");
			followupDetails.whoString = clickedElement.attr("pcp-name");
			defaultInd = 1;
			break;
		default:
			break;
		}
		component.addUpdateFollowup(defaultInd, 'open');
	});
	favoritesObject.on("click", "." + compNS + "-fav-res", function () {
		var clickedElement = $(this);
		var orgProviderList;
		component.m_followupDetails = new component.FollowupDetailsInstance();
		var selectedFollowupDetail = component.m_followupDetails;
		selectedFollowupDetail.addressList = [];
		selectedFollowupDetail.phoneList = [];
		var favoriteId = clickedElement.attr("id");
		orgProviderList = MP_Util.GetValueFromArray(favoriteId, component.getFavoritesFollowupArray());
		component.m_followupDetails = jQuery.extend(true, {}, MP_Util.GetValueFromArray(favoriteId, component.getFavoritesFollowupArray()));
		selectedFollowupDetail = component.m_followupDetails;
		selectedFollowupDetail.whoType = orgProviderList.whoType;
		selectedFollowupDetail.addressList = [];
		selectedFollowupDetail.phoneList = [];
		selectedFollowupDetail.patEdFollowupId = 0;
		selectedFollowupDetail.isFollowupTypeFavorite = true;
		component.addUpdateFollowup(0, 'open');

	});
	favoritesObject.on("contextmenu", "." + compNS + "-fav-res", function (event) {
		var contextMenu = null;
		var removeFavorite = null;
		var self = this;
		contextMenu = MP_MenuManager.getMenuObject("FollowupFavoriteContextMenu");
		if (!contextMenu) {
			contextMenu = new ContextMenu("FollowupFavoriteContextMenu").setAnchorElementId("FollowupFavoriteContextMenuAnchor").setAnchorConnectionCorner(["top", "left"]).setContentConnectionCorner(["top", "left"]);
			removeFavorite = new MenuSelection("Remove from Favorite");
			removeFavorite.setLabel(i18nFollowUp.DELETE);
			contextMenu.addMenuItem(removeFavorite);
			MP_MenuManager.addMenuObject(contextMenu);
		}
		removeFavorite = contextMenu.getMenuItemArray()[0];
		var followupId = $(self).attr("id");
		if (followupId === 0) {
			removeFavorite.setIsDisabled(true);
		}
		removeFavorite.setClickFunction(function () {
			$("#"+compNS+"-favorites-fieldset"+compId).empty().append("<span class='"+compNS+"-load'/>");
			var removeFavoritesTimerObj = null;
			removeFavoritesTimerObj = new RTMSTimer("ENG:MPG.FOLLOWUP.O2 - Remove from Favorite", criterion.category_mean);
			if (removeFavoritesTimerObj) {
				removeFavoritesTimerObj.addMetaData("rtms.legacy.metadata.1", "Remove from Favorite");
				removeFavoritesTimerObj.start();
			}
			var sendAr = ["^MINE^", followupId + ".0"];
			var scriptRequest = new ScriptRequest();

			scriptRequest.setProgramName("MP_ADD_UPD_FOLLOWUP_FAVORITE");
			scriptRequest.setParameterArray(sendAr);
			scriptRequest.setAsyncIndicator(true);
			scriptRequest.setResponseHandler(function (scriptReply) {
				if (removeFavoritesTimerObj) {
					removeFavoritesTimerObj.stop();
				}
				if ((scriptReply.getStatus() === "S")) {
					component.getFollowUpFavorites();
				}
			});
			scriptRequest.performRequest();

		});
		contextMenu.setXOffset(event.pageX).setYOffset(event.pageY).setAnchorElement();
		MP_MenuManager.showMenu("FollowupFavoriteContextMenu");
		contextMenu.removeAnchorElement();
		return false;
	});

	tabContentObject.on("click", "." + compNS + "-tab", function () {
		var elementId = $(this).attr("id");
		if (elementId) {
			var index = elementId.split("-")[1];
			clearSearchTxtObject.removeClass(compNS + "-delete-hover").css("visibility", "hidden");
			index = parseInt(index, 10);
			if (index === component.m_selectedTab) {
				return;
			}
			component.setTitleForSearchField(index);
			component.switchTab(index);
			autoSuggCtrlObject.val("");
			autoSuggCtrlObject.focusout();
		}
	});

	MP_Util.AddAutoSuggestControl(component, component.searchInstructions, component.HandleSelection, component.CreateSuggestionLine);
	autoSuggCtrlObject.focusout();
};

FollowUpComponentO2.prototype.deleteSelectedFollowup =  function(followupId){
	var deleteFollowupTimerObj = null;
	try {
		var self = this;
		var componentId = self.getComponentId();
		if (followupId) {
			var deleteInd = "delete";
			deleteFollowupTimerObj = new RTMSTimer("ENG:MPG.FOLLOWUP.O2 - Remove Follow up", self.criterion.category_mean);
			if (deleteFollowupTimerObj) {
				deleteFollowupTimerObj.addMetaData("rtms.legacy.metadata.1", "Delete Followup");
				deleteFollowupTimerObj.start();
			}
			MP_Util.LoadSpinner("sidePanel" + componentId);
			var cclParam = [];
			var scriptRequest = new ScriptRequest();
			cclParam.push("^MINE^", followupId + ".0");
			scriptRequest.setParameterArray(cclParam);
			scriptRequest.setProgramName("MP_DELETE_FOLLOWUP");
			scriptRequest.setAsyncIndicator(true);
			scriptRequest.setResponseHandler(function (scriptReply) {
				if (deleteFollowupTimerObj) {
					deleteFollowupTimerObj.stop();
				}
				if (scriptReply.getResponse().STATUS_DATA.STATUS === "S") {
					self.m_clickedRow = null;
					self.m_sidePanel.m_cornerCloseButton.show();
					self.getSelectedFollowup(deleteInd);
				} else {
					var errorBanner = new MPageUI.AlertBanner();
					errorBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
					errorBanner.setPrimaryText(i18n.discernabu.FollowupComponent_O2.UNABLE_TO_DELETE_FOLLOWUP);
					errorMessageHTML = errorBanner.render();
					$("#fu-o2" + componentId + "sidePanelResultList").append(errorMessageHTML);
				}
			});
			scriptRequest.performRequest();
		}
	} catch (err) {
		if (deleteFollowupTimerObj) {
			deleteFollowupTimerObj.fail();
			deleteFollowupTimerObj = null;
		}
		logger.logJSError(err, this, "followup_o2.js", "delete followup");
	}
};
FollowUpComponentO2.prototype.attachFolloupTableListners = function (event, data) {
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var component = this;
	var i18nFollowUp = i18n.discernabu.FollowupComponent_O2;
	var criterion = component.getCriterion();
	var tableContextObject = $("#fu-o2" + compId + "tableBody");
	tableContextObject.on("contextmenu", ".table-cell", function (event) {
		var contextMenu = null;
		var savetofavoritesFollowup = null;
		var modifyFollowup = null;
		var deleteFollowup = null;
		var self = this;
		contextMenu = MP_MenuManager.getMenuObject("FollowupTableContextMenu");
		if (!contextMenu) {
			contextMenu = new ContextMenu("FollowupTableContextMenu").setAnchorElementId("FollowupTableContextMenuAnchor").setAnchorConnectionCorner(["top", "left"]).setContentConnectionCorner(["top", "left"]);
			modifyFollowup = new MenuSelection("Modify");
			modifyFollowup.setLabel(i18nFollowUp.MODIFY);
			contextMenu.addMenuItem(modifyFollowup);
			deleteFollowup = new MenuSelection("Delete");
			deleteFollowup.setLabel(i18nFollowUp.DELETE);
			contextMenu.addMenuItem(deleteFollowup);
			savetofavoritesFollowup = new MenuSelection("Save to Favorites");
			savetofavoritesFollowup.setLabel(i18nFollowUp.SAVE_TO_FAVORITES);
			contextMenu.addMenuItem(savetofavoritesFollowup);
			MP_MenuManager.addMenuObject(contextMenu);
		}
		modifyFollowup = contextMenu.getMenuItemArray()[0];
		deleteFollowup = contextMenu.getMenuItemArray()[1];
		savetofavoritesFollowup = contextMenu.getMenuItemArray()[2];
		var followupId = $(self).children().attr("data-followup-id");
		var currentRowSelected=event.currentTarget.parentNode;
		
		//Check for  the correct row-id and make modification
		var autoOpenInd = true;
		if ($(self).hasClass("fu-o2-provider-col") || $(self).hasClass("fu-o2-time-frame-col") || $(self).hasClass("fu-o2-comments-col")) {
			autoOpenInd = false;
		}

		if (followupId === 0) {
			deleteFollowup.setIsDisabled(true);
		}
		deleteFollowup.setClickFunction(function () {
			if (event && autoOpenInd) {
				//Highlight the selected row
				component.highlightSelectedRow(currentRowSelected, false);
			}
			component.deleteSelectedFollowup(followupId);
		});
		modifyFollowup.setClickFunction(function () {
			component.setPanelContentsToLeftClickedRow(event, data);
			component.resizeComponent();
		});
		savetofavoritesFollowup.setClickFunction(function () {
			$("#"+compNS+"-favorites-fieldset"+compId).empty().append("<span class='"+compNS+"-load'/>");
			var saveToFavoritesTableTimerObj = null;
			saveToFavoritesTableTimerObj = new RTMSTimer("ENG:MPG.FOLLOWUP.O2 - Add to favorite", criterion.category_mean);
			if (saveToFavoritesTableTimerObj) {
				saveToFavoritesTableTimerObj.addMetaData("rtms.legacy.metadata.1", "Save to Favorites");
				saveToFavoritesTableTimerObj.start();
			}
			var followupDetails = MP_Util.GetValueFromArray(followupId, component.getSelectedFollowupArray());
			var whoName = "";
			var whoString = "";
			var followupDttm = "";
			switch (followupDetails.whoType) {
				case 0:
					whoString = followupDetails.whoString;
					break;
				case 1:
					whoName = "ORGANIZATION";
					break;
				case 2:
					whoName = "PRSNL";
					break;
				case 4:
					whoName = "CODE_VALUE";
					break;
				default:
					break;
			}
			try {
				if (followupDetails.whenDtTm !== null) {
					var tempDate = new Date(followupDetails.whenDtTm);
					followupDttm = tempDate.format("dd-mmm-yyyy HH:MM");
				}
			} catch (err) {
				followupDttm = "";
				MP_Util.LogScriptCallInfo(null, this, "master-component.js", "Incorrect Date and Time is entered.");
			}
			var sendAr = ["^MINE^", 0 + ".0", criterion.provider_id + ".0", "~" + whoName + "~", followupDetails.whoId + ".0", "~" + followupDetails.whoString + "~", "^" + followupDttm + "^", followupDetails.whenWithInCd + ".0", followupDetails.followupDays, followupDetails.daysOrWeek, followupDetails.whenNeededInd, "~" + followupDetails.addressLongText + "~", "~" + followupDetails.commentText + "~"];
			var scriptRequest = new ScriptRequest();
			scriptRequest.setProgramName("MP_ADD_UPD_FOLLOWUP_FAVORITE");
			scriptRequest.setParameterArray(sendAr);
			scriptRequest.setAsyncIndicator(true);
			scriptRequest.setResponseHandler(function (scriptReply) {
				if (saveToFavoritesTableTimerObj) {
					saveToFavoritesTableTimerObj.stop();
				}
				if ((scriptReply.getStatus() === "S")) {
					component.getFollowUpFavorites();
				}
			});
			scriptRequest.performRequest();
		});
		contextMenu.setXOffset(event.pageX).setYOffset(event.pageY).setAnchorElement();
		MP_MenuManager.showMenu("FollowupTableContextMenu");
		contextMenu.removeAnchorElement();
		return false;

	});
};
FollowUpComponentO2.prototype.HandleSelection = function (suggestionObj, textBox, component) {
	var componentId = component.getComponentId();
	var autosearchObject = $("#autosearch-" + componentId);
	component.m_followupDetails = new component.FollowupDetailsInstance();
	var selectedFollowupDetail = component.m_followupDetails;
	selectedFollowupDetail.addressList = [];
	selectedFollowupDetail.phoneList = [];
	var selectedTabIndex = this.component.m_selectedTab;
	var name = autosearchObject.find("input").val();
	var editInd = 1;

	switch (selectedTabIndex) {
	case this.component.m_followupComponentIndex.PROVIDER:
		selectedFollowupDetail.whoId = suggestionObj.PERSON_ID;
		if (suggestionObj.PERSON_ID === 0) {
			selectedFollowupDetail.whoString = name;
		} else {
			selectedFollowupDetail.whoString = suggestionObj.PERSON_NAME;
			selectedFollowupDetail.whoType = "PRSNL";
		}

		break;
	case this.component.m_followupComponentIndex.LOCATION:
		selectedFollowupDetail.whoId = suggestionObj.value.WHO_ID;
		if (suggestionObj.value.WHO_ID === 0) {
			selectedFollowupDetail.whoString = name;
		} else {
			selectedFollowupDetail.whoString = suggestionObj.value.WHO_NAME;
			selectedFollowupDetail.whoType = "ORGANIZATION";
			selectedFollowupDetail.organizationId = suggestionObj.value.WHO_ID;
		}
		break;
	default:
		break;
	}
	component.addUpdateFollowup(editInd,'edit');
};
FollowUpComponentO2.prototype.CreateSuggestionLine = function (suggestionObj, searchVal) {
	var component  = this.component;
	var selectedTabIndex = component.m_selectedTab;
	var index = component.m_followupComponentIndex;
	if(selectedTabIndex === index.PROVIDER){
		return component.HighlightValue(suggestionObj.PERSON_NAME, searchVal);
	}else if(selectedTabIndex === index.LOCATION){
		return component.HighlightValue(suggestionObj.value.WHO_NAME, searchVal);
	}
};
FollowUpComponentO2.prototype.HighlightValue = function (inString, term) {
	return "<strong >" + inString.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1").split(" ").join("|") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "</strong><strong class='highlight'>$1</strong><strong>") + "</strong>";

};
FollowUpComponentO2.prototype.getSelectedFollowup = function (pannelInd) {
	var component = this;
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var autoSuggCtrlObject = $("#" + compNS + "ContentCtrl" + compId);
	var clearSearchTxtObject = $("#" + compId + "-clear-sugg-text");
	var followupInd = 0;
	var criterion = component.getCriterion();
	var personId = criterion.person_id;
	var encntrId = criterion.encntr_id;
	var getSelectedFollowupTimerObj = null;
	getSelectedFollowupTimerObj = new RTMSTimer("ENG:MPG.FOLLOWUP.O2 - Fetch selected follow up details", criterion.category_mean);
	if (getSelectedFollowupTimerObj) {
		getSelectedFollowupTimerObj.addMetaData("rtms.legacy.metadata.1", "Fetch selected follow up details");
		getSelectedFollowupTimerObj.start();
	}
	var sendAr = ["^MINE^", personId + ".0", encntrId + ".0", followupInd];
	var scriptRequest = new ScriptRequest();
	scriptRequest.setProgramName("MP_RETRIEVE_FOLLOWUP");
	scriptRequest.setParameterArray(sendAr);
	scriptRequest.setAsyncIndicator(true);
	scriptRequest.setResponseHandler(function (scriptReply) {
		if (getSelectedFollowupTimerObj) {
			getSelectedFollowupTimerObj.stop();
		}
		if ((scriptReply.getStatus() === "S")) {
			var recordData = scriptReply.getResponse();
			component.renderFollowUpTable(recordData);
			
			component.setResultCount(recordData.FOLLOW_UP.length);
			component.updateSatisfierRequirementIndicator();
			if (pannelInd) {
				switch (pannelInd) {
				case "open":
					component.autoOpenSidePanel();
					component.setSidePanelContents(recordData.FOLLOW_UP[0]);
					break;
				case "edit":
					component.autoOpenSidePanel();
					component.saveEditPanelDetails(recordData.FOLLOW_UP[0]);
					//Remove the typed value in the search box
					autoSuggCtrlObject.val("");
					autoSuggCtrlObject.focusout();
					clearSearchTxtObject.removeClass(compNS + "-delete-hover").css("visibility", "hidden");
					break;
				default:
					break;
				}
			}
			component.resizeComponent();

		}
	});
	scriptRequest.performRequest();
};
FollowUpComponentO2.prototype.addUpdateFollowup = function (editModeInd, panelMode) {
	var component = this;
	var criterion = component.getCriterion();
	var followupDttm = "";
	var followupObj = this.m_followupDetails;
	var addLongTextId = followupObj.addressLongTextId;
	var addLongText = followupObj.addressLongText;
	var addressId = followupObj.addressId;
	var providerName = followupObj.whoString;
	var providerId = followupObj.whoId;
	var commentLongTxt = followupObj.commentText;
	var commentLongTxtId = 0;
	var organizationId = followupObj.organizationId;
	var quickPickCd = followupObj.quickPickCd;
	var onlyIfNeededInd = followupObj.whenNeededInd;
	var withInRange = followupObj.whenWithIn;
	var withInRangeCd =  followupObj.whenWithInCd;
	var followupDays = followupObj.followupDays;
	var dayOrweek = followupObj.daysOrWeek;
	var patEdFollowId = followupObj.patEdFollowupId;
	var personId = criterion.person_id;
	var encntrId = criterion.encntr_id;
	var pannelInd = panelMode;
	try {
		if (followupObj.whenDtTm && followupObj.whenDtTm != "TZ") {
			followupDttm = followupObj.whenDtTm;
			var tempDate = new Date(followupDttm);
			followupDttm = tempDate.format("dd-mmm-yyyy HH:MM");
		}

	} catch (err) {
		followupDttm = "";
		MP_Util.LogScriptCallInfo(null, this, "follow-up-o2.js", "Incorrect Date and Time is entered.");
	}
	var addUpdateFollowupTimerObj = null;
	addUpdateFollowupTimerObj = new RTMSTimer("ENG:MPG.FOLLOWUP.O2 - Add or Update Follow up", criterion.category_mean);
	if (addUpdateFollowupTimerObj) {
		addUpdateFollowupTimerObj.addMetaData("rtms.legacy.metadata.1", "Add or Update Follow up");
		addUpdateFollowupTimerObj.start();
	}
	var sendAr = ["^MINE^", personId + ".0", encntrId + ".0", providerId + ".0", "~" + providerName + "~", commentLongTxtId + ".0","^" + followupDttm + "^", addLongTextId + ".0", "~" + addLongText + "~", "^" + withInRange + "^", followupDays, dayOrweek, organizationId + ".0", "0.0", patEdFollowId + ".0", quickPickCd + ".0", addressId + ".0", "0.0", onlyIfNeededInd, 0, withInRangeCd + ".0", 0 + ".0", editModeInd];

	var scriptRequest = new ScriptRequest();
	scriptRequest.setProgramName("MP_ADD_UPD_FOLLOWUP");
	scriptRequest.setParameterArray(sendAr);
	scriptRequest.setDataBlob(commentLongTxt);
	scriptRequest.setAsyncIndicator(true);
	scriptRequest.setResponseHandler(function (scriptReply) {
		if (addUpdateFollowupTimerObj) {
			addUpdateFollowupTimerObj.stop();
		}
		if ((scriptReply.getStatus() === "S")) {
			component.getSelectedFollowup(pannelInd);
		}
	});
	scriptRequest.performRequest();
};
FollowUpComponentO2.prototype.getValueFromArray = function (name, array) {
	if (array !== null) {
		for (var x = 0, xi = array.length; x < xi; x++) {
			if (array[x].PAT_ED_FOLLOWUP_ID === name) {
				return array[x];
			}
		}
	}
	return null;
};

FollowUpComponentO2.prototype.switchTab = function (tabIndex) {
	var component = this;
	if (typeof tabIndex === "number") {
		component.m_selectedTab = tabIndex;
	} else {
		tabIndex = component.m_selectedTab;
	}
};
FollowUpComponentO2.prototype.getFollowUpFavorites = function () {
	var compID = this.getComponentId();
	var component = this;
	var compNS = this.getStyles().getNameSpace();
	var criterion = component.getCriterion();
	var getFollowUpFavoritesTimerObj = null;
	$("#"+compNS+"-favorites-fieldset"+compID).empty().append("<span class='"+compNS+"-load'/>");
	getFollowUpFavoritesTimerObj = new RTMSTimer("ENG:MPG.FollowUpComponent.O2 - load Favorites", component.criterion.category_mean);
	if (getFollowUpFavoritesTimerObj) {
		getFollowUpFavoritesTimerObj.addMetaData("rtms.legacy.metadata.1", "load Favorites");
		getFollowUpFavoritesTimerObj.start();
	}
	var sendAr = ["^MINE^", criterion.provider_id + ".0"];
	var scriptRequest = new ScriptRequest();
	scriptRequest.setProgramName("MP_GET_FOLLOWUP_FAVORITES");
	scriptRequest.setParameterArray(sendAr);
	scriptRequest.setAsyncIndicator(true);
	scriptRequest.setResponseHandler(function (scriptReply) {
		if (getFollowUpFavoritesTimerObj) {
			getFollowUpFavoritesTimerObj.stop();
		}
		$("#"+compNS+"-favorites-fieldset"+compID).empty();
		if ((scriptReply.getStatus() === "Z")) {
			var text = "";
			text = "<span class='" + compNS + "-no-favorites'>" + i18n.discernabu.NO_RESULTS_FOUND + "</span>";
			$("#" + compNS + "-favorites-fieldset" + compID).append(text);
		}
		else{
		if ((scriptReply.getStatus() === "S")) {
			var recordData = scriptReply.getResponse();
			component.displayFollowUpFavorites(recordData);
		}
		else{
		MP_Util.LogScriptCallError(this, this, "mp_core.js", "Error retrieving Favorites");	
		}
		}		
	});
	scriptRequest.performRequest();
};
FollowUpComponentO2.prototype.addFreeText = function (component) {
	var compID = component.getComponentId();
	var autosearchObject = $("#autosearch-" + compID);
	autosearchObject.find('.suggestions').children().last().css("border-top", "1px solid #A0A0A0");
};
/**
 * Creates the filterMappings that will be used when loading the component's
 * bedrock settings
 */
FollowUpComponentO2.prototype.loadFilterMappings = function () {
	// Add the filter mapping object for the Follow up Workflow component
	this.addFilterMappingObject("WF_FOLLOWUP_REQD", {
		setFunction : this.setGapCheckRequiredInd,
		type : "Boolean",
		field : "FTXT"
	});
	this.addFilterMappingObject("WF_FOLLOWUP_REQ_OVR", {
		setFunction : this.setOverrideInd,
		type : "Boolean",
		field : "FTXT"
	});
	this.addFilterMappingObject("WF_FOLLOWUP_HELP_TXT", {
		setFunction : this.setRequiredCompDisclaimerText,
		type : "STRING",
		field : "FTXT"
	});
};

FollowUpComponentO2.prototype.searchInstructions = function (callback, textBox, component) {
	try {
		var compID = component.getComponentId();
		var i18nFollowUp = i18n.discernabu.FollowupComponent_O2;
		var searchLimit = 0;
		var selectedTabIndex = this.component.m_selectedTab;
		var searchVal = "";
		var autosearchObject = $("#autosearch-" + compID);
		var searchText = textBox.value.replace(/^\s+|\s+$/g, "");
		if (searchText.length > 0) {
			$("#" + compID + "-clear-sugg-text").css("visibility", "visible");
		}
		if (searchText.length < 3) {
			return;
		}

		var freeTextName = autosearchObject.find("input").val();
		freeTextName = '"' + freeTextName + '"';
		switch (selectedTabIndex) {
		case component.m_followupComponentIndex.PROVIDER:
			var providerSearchTimerObj = null;
			providerSearchTimerObj = new RTMSTimer("ENG:MPG.PATIENTEDUCATION.O2 - load Tab Contents", component.criterion.category_mean);
			if (providerSearchTimerObj) {
				providerSearchTimerObj.addMetaData("rtms.legacy.metadata.1", "load Tab Contents");
				providerSearchTimerObj.start();
			}
			var sendAr = ["^MINE^", "^" + searchText + "^", searchLimit];
			var scriptRequest = new ScriptRequest();
			scriptRequest.setProgramName("MP_RETRIEVE_FOLLOWUP_PROVIDER");
			scriptRequest.setParameterArray(sendAr);
			scriptRequest.setAsyncIndicator(true);
			scriptRequest.setResponseHandler(function (scriptReply) {
				if (providerSearchTimerObj) {
					providerSearchTimerObj.stop();
				}
				var recordData = scriptReply.getResponse();
				var freeTextString = {
					PERSON_ID : 0,
					PERSON_NAME : i18nFollowUp.ADD_AS_FREE_TEXT.replace("{0}", freeTextName)
				};
				recordData.PRSNL_LIST.push(freeTextString);
				callback.autosuggest(recordData.PRSNL_LIST);
				if ((scriptReply.getStatus() === "S")) {
					component.addFreeText(component);
				}
			});
			scriptRequest.performRequest();
			break;
		case component.m_followupComponentIndex.LOCATION:
			searchVal = searchText.toUpperCase();
			var orgArray = component.getClinicalFollowupArray();
			var resultArray = [];
			for (var i = 0;i < orgArray.length;i++) {
				var orgDetails = orgArray[i];
				var foundOrganizationName = false;
				if (orgDetails.value.WHO_NAME.toUpperCase().indexOf(searchVal) !== -1) {
					foundOrganizationName = true;
				}

				if (foundOrganizationName) {
					resultArray.push(orgDetails);
				}
			}
			var clinicalTextString = {};
			clinicalTextString.WHO_ID = 0;
			clinicalTextString.WHO_NAME = i18nFollowUp.ADD_AS_FREE_TEXT.replace("{0}", freeTextName);
			var mapObj = new component.MapObject(clinicalTextString.WHO_ID, clinicalTextString);
			resultArray.push(mapObj);
			callback.autosuggest(resultArray);
			component.addFreeText(component);
			break;

		default:
			break;

		}

	} catch (err) {
		logger.logJSError(err, this, "follow-up-o2.js", "searchInstructions");
	}
};
MP_Util.setObjectDefinitionMapping("WF_FOLLOWUP", FollowUpComponentO2);