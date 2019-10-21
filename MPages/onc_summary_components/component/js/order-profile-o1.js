function OrderProfileComponentStyle() {
	this.initByNamespace("op");
}

OrderProfileComponentStyle.prototype = new ComponentStyle();
OrderProfileComponentStyle.prototype.constructor = ComponentStyle;

function OrderProfileComponent(criterion) {
	this.setCriterion(criterion);
	this.setLookBackDropDown(true);
	this.setScrollingEnabled(false);
	this.setAlwaysExpanded(true);
	this.setScope(2);
	this.setStyles(new OrderProfileComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.ORDERPROFILE.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.ORDERPROFILE.O1 - render component");
	this.setIncludeLineNumber(true);
	this.markedOrders = [];
	this.opOrdersArray = [];
	this.opPendingOrders = [];
	this.opCatArray = [];
	this.opVenueArray = [];
	this.opPendingCatArray = [];
	this.opPendingStatuses = [];
	this.opFiltersArray = [];
	this.opOrderGrouping = 1;
	this.opSortField = 4;
	this.opSortDirection = 0;
	this.opFilterSets = null;
	this.hasPriv = false;
	this.hasException = false;
	this.compTableArray = new Array(6);
	this.compTableContainer = null;
	this.sidePanel = null;
	this.sidePanelObj = null;
	this.showPanel = false;
	this.currentFilter = null;
	this.opPendingOrdObj = null;
	this.opPrefObj = {
		catSubSecs: {},
		venueSubSecs: {},
		groupByPref: 0 //1 = Category | 2 = Venue | 3 = None
	};
	this.m_wasListenerAdded = false;
	this.opAllowDailyReview = false;
	this.opDailyReviewObj = null;
	this.opReqOrdGrpArr = [];
	this.m_opData = null;
}

OrderProfileComponent.prototype = new MPageComponent();
OrderProfileComponent.prototype.constructor = MPageComponent;

/**
 *This function sets the m_wasListenerAdded flag to the supplied value
 * @param {Boolean} value : The indicator for if the event listener has been added
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.setWasListenerAdded = function(value) {
	this.m_wasListenerAdded = value;
};

/**
 *This function gets the value of the m_wasListenerAdded flag
 * @return {Boolean} m_wasListenerAdded : The stored event listener added flag.
 */
OrderProfileComponent.prototype.getWasListenerAdded = function() {
	return this.m_wasListenerAdded;
};

OrderProfileComponent.prototype.setOPOrderGrouping = function(value) {
	this.opOrderGrouping = value;
};

OrderProfileComponent.prototype.getOPOrderGrouping = function() {
	return this.opOrderGrouping;
};

OrderProfileComponent.prototype.setOPPendingOrderStatuses = function(value) {
	this.opPendingStatuses = value;
};

OrderProfileComponent.prototype.getOPPendingOrderStatuses = function() {
	return this.opPendingStatuses;
};

/**
 * Sets the currentFilter to the value of advFilterObj
 * @param {object} value : This object has the information of currentFilter
 * @return null
 */

OrderProfileComponent.prototype.setCurrentFilter = function(value) {
	this.currentFilter = value;
};

/**
 * This prototype function retrieves the currentFilter value
 * @return {object} currentFilter : The object that stores currentFilter information.
 */

OrderProfileComponent.prototype.getCurrentFilter = function() {
	return this.currentFilter;
};

/**
 * Sets the opPendingOrdObj to the value of pendingOrdObj
 * @param {object} value : This object has the id of the pending order checkbox
 * @return null
 */

OrderProfileComponent.prototype.setPendingOrderObj = function(value) {
	this.opPendingOrdObj = value;
};

/**
 * This prototype function retrieves the pendingOrdObj value
 * @return {object} currentFilter : The object that stores the id of the pending order checkbox
 */
OrderProfileComponent.prototype.getPendingOrderObj = function() {
	return this.opPendingOrdObj;
};

/**
 * getOPData returns the JSON with all the Order results and associated information
 * @return {object} m_opData : Stored object of Order detail
 */
OrderProfileComponent.prototype.getOPData = function () {
	return this.m_opData;
};
/**
 *  The setOPData function sets the value
 * @param {Object} value contains the JSON with all the Order results and associated information.
 * @return {undefined} undefined
 */
OrderProfileComponent.prototype.setOPData = function (value) {
	this.m_opData = value;
};

/**
 * Sets the opReqOrdGrpArr to the value of opReqOrdGrpObj
 * @param {object} value : This object has the synonym id's of the Required Orders
 * @return {undefined} undefined
 */
OrderProfileComponent.prototype.setRequiredOrdGrpArr = function (value) {
	this.opReqOrdGrpArr.push(value);
	if (!this.getGapCheckRequiredInd()) {
		this.setGapCheckRequiredInd(true);
	}
};

/**
 * This prototype function retrieves the opReqOrdGrp1 value
 * @return {object} opReqOrdGrp1 : The object that stores the synonym id's of the Orders
 */
OrderProfileComponent.prototype.getRequiredOrdGrpArr = function() {
	return this.opReqOrdGrpArr;
};

/**
 * Sets the local component-level preference object with the stored user preferences
 * @param {object} value : The stored user preference object
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.setLocalPrefs = function(value) {
	this.opPrefObj.catSubSecs = value.catSubSecs;
	this.opPrefObj.venueSubSecs = value.venueSubSecs;
	if (value.groupByPref) {
		this.opPrefObj.groupByPref = value.groupByPref;
	} else {
		//if there are user prefs from 1.0.2 or earlier, groupByPref will not exist. This ensures the field is still here.
		this.opPrefObj.groupByPref = this.getOPOrderGrouping();
	}
};

/**
 * Sets the catSubSecs or venueSubSecs structure of the opPrefObj structure so that expand/collapse prefs will be saved when grouped by category
 * @param {componentTable} compTable : The componentTable object this is about to be rendered.
 * @param {object} groupExpandStates : The preference object that stores the expand/collapse preferences when grouping by category or venue
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.setExpandCollapseStates = function(compTable, groupExpandStates) {
	var groupIds = compTable.getGroupSequence();
	var xl = groupIds.length;

	for (var x = 0; x < xl; x++) {
		//store each subsection's expand/collapse property
		var thisGroup = compTable.getGroupById(groupIds[x]);
		groupExpandStates[thisGroup.getGroupId()] = thisGroup.isExpanded();
	}
};

/**
 *  This prototype function retrieves the user prefs for grouping the result data
 * @return {object} opPrefObj : The component-level object that stores the user preferences
 */
OrderProfileComponent.prototype.getGroupByPrefs = function() {
	var compId = this.getComponentId();
	var groupByObj = $("#opGroupBy" + compId);
	var choice = groupByObj.length > 0 ? parseInt(groupByObj.val(), 10) : null;

	if (!this.opPrefObj.groupByPref && !choice) {
		//pref does not exist, use the default grouping from bedrock
		this.opPrefObj.groupByPref = this.getOPOrderGrouping();
	} else if (choice) {
		//pref does not exist, but there is an option selected in the DOM, use it
		this.opPrefObj.groupByPref = choice;
	}

	return this.opPrefObj;
};

/**
 * Checks for order grouping (category, venue) then sets the appropriate prefs
 * @param {componentTable} compTable : The componentTable object this is about to be rendered.
 * @return {object} opPrefObj : The component level object that stores preference information.
 */
OrderProfileComponent.prototype.getExpandCollapsePreferences = function(compTable) {
	this.getGroupByPrefs();

	if (this.opPrefObj.groupByPref === 1) {
		//component is grouped by category, set expand/collapse info
		this.setExpandCollapseStates(compTable, this.opPrefObj.catSubSecs);
	} else if (this.opPrefObj.groupByPref === 2) {
		//component is grouped by venue, set expand/collapse info
		this.setExpandCollapseStates(compTable, this.opPrefObj.venueSubSecs);
	}

	return this.opPrefObj;
};

/**
 * Sets the dailyReviewObj to the value of opDailyReviewObj
 * @param {object} dailyReviewObj : Daily order review object
 * @return null
 */
OrderProfileComponent.prototype.setDailyReviewObj = function (dailyReviewObj) {
	this.opDailyReviewObj = dailyReviewObj;
};

/**
 * This prototype function retrieves the opDailyReviewObj value
 * @return {object} opDailyReviewObj : The object that stores daily order review object
 */
OrderProfileComponent.prototype.getDailyReviewObj = function () {
	return (this.opDailyReviewObj);
};

/**
 * Sets the dailyReviewFlag to the value of opAllowDailyReview
 * @param {boolean} dailyReviewFlag : boolean value
 * @return null
 */
OrderProfileComponent.prototype.setAllowDailyReview = function(dailyReviewFlag) {
	this.opAllowDailyReview = dailyReviewFlag;
};

/**
 * This prototype function retrieves the opAllowDailyReview boolean value
 * @return {boolean} opAllowDailyReview : Boolean value that stores daily order review flag
 */
OrderProfileComponent.prototype.getAllowDailyReview = function() {
	return (this.opAllowDailyReview);
};

/**
 * This function is used to load the filters that are associated to this component. 
 */
OrderProfileComponent.prototype.loadFilterMappings = function(){
	this.addFilterMappingObject("WF_ORDER_PROFILE_DLY_REV", {
		setFunction : this.setAllowDailyReview,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});
	
	//Add the filter mapping object for the disclaimer text to be displayed in error banner when gap-check requirements are unsatisfied
    this.addFilterMappingObject("WF_ORDER_PROFILE_HELP_TXT", {
        setFunction: this.setRequiredCompDisclaimerText,
        type: "STRING",
        field: "FREETEXT_DESC"
    });

    //Add the filter mapping for deciding whether override functionality is required or not
    this.addFilterMappingObject("WF_ORDER_PROFILE_REQ_OVR", {
        setFunction: this.setOverrideInd,
        type: "Boolean",
        field: "FREETEXT_DESC"
    });

    //Add the filter mapping object for selecting the required orderables from Group 1
    this.addFilterMappingObject("WF_ORDER_PROFILE_REQD_GRP1", {
        setFunction: this.setRequiredOrdGrpArr,
        type: "Array",
        field: "PARENT_ENTITY_ID"
    });

    //Add the filter mapping object for selecting the required orderables from Group 2
    this.addFilterMappingObject("WF_ORDER_PROFILE_REQD_GRP2", {
        setFunction: this.setRequiredOrdGrpArr,
        type: "Array",
        field: "PARENT_ENTITY_ID"
    });

    //Add the filter mapping object for selecting the required orderables from Group 3
    this.addFilterMappingObject("WF_ORDER_PROFILE_REQD_GRP3", {
        setFunction: this.setRequiredOrdGrpArr,
        type: "Array",
        field: "PARENT_ENTITY_ID"
    });

    //Add the filter mapping object for selecting the required orderables from Group 4
    this.addFilterMappingObject("WF_ORDER_PROFILE_REQD_GRP4", {
        setFunction: this.setRequiredOrdGrpArr,
        type: "Array",
        field: "PARENT_ENTITY_ID"
    });

    //Add the filter mapping object for selecting the required orderables from Group 5
    this.addFilterMappingObject("WF_ORDER_PROFILE_REQD_GRP5", {
        setFunction: this.setRequiredOrdGrpArr,
        type: "Array",
        field: "PARENT_ENTITY_ID"
    });
};

/**
 * Returns a true or false value if the side panel is currently displayed
 * @return {bool} this.showPanel : The boolean that is used to determine if the side panel is displayed or not
 */
OrderProfileComponent.prototype.isSidePanelDisplayed = function() {
	return this.showPanel;
};

/**
 * Checks for order grouping (category, venue) then applies the appropriate prefrences to the componentTable object
 * @param {componentTable} compTable : The componentTable object this is about to be rendered.
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.applyExpandCollapsePreferences = function(compTable) {
	var userPrefs = this.getGroupByPrefs();
	var groupIds = compTable.getGroupSequence();
	var idLen = groupIds.length;
	var subSecs = null;

	switch(userPrefs.groupByPref) {
		case 1:
			subSecs = this.opPrefObj.catSubSecs;
			break;
		case 2:
			subSecs = this.opPrefObj.venueSubSecs;
	}

	for (var x = 0; x < idLen; x++) {
		var thisGroup = compTable.getGroupById(groupIds[x]);
		//set to expanded by default if there are no preferences saved
		var thisGroupVal = subSecs.hasOwnProperty(thisGroup.getGroupId()) ? subSecs[thisGroup.getGroupId()] : true;
		thisGroup.setIsExpanded(thisGroupVal);
	}
};

/**
 * Wrapper function that contains all the necessary override functions for the ComponentTable class
 * @param {componentTable} comptTable : The componentTable object that is currently displayed
 * @param {boolean} retainSelected : Boolean value to determine if selected rows should be retained
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.compTableOverrides = function(compTable) {
	var comp = this;
	var textArray = ["STATUS", "STATUS_DT", "ORDER", "START_DT", "PROVIDER", "CATEGORY"];

	/**
	 * Overrides the default ComponentTable method to save the expand/collapse value for each subsection.
	 * @param {number} groupId the id of the group to be toggled
	 * @returns {undefined} undefined
	 */
	compTable.toggleGroup = function(groupId) {
		var group = this.getGroupById(groupId);
		if (group.isExpanded()) {
			this.collapseGroup(groupId);
		} else {
			this.openGroup(groupId);
		}

		//save expand/collapse prefs
		var userPrefs = comp.getExpandCollapsePreferences(compTable);
		comp.setPreferencesObj(userPrefs);
		comp.savePreferences(true);
	};

	/**
	 * Overrides the renderRows function for the ComponentTable class. This function allows selected/canceled rows to be retained after sorting/grouping
	 * @param {object} rows - The rows that need to be rendered.
	 * @param {number} groupId - The id for the group.
	 * @return {string} rowsHtml - The html string for the rendered rows.
	 */
	compTable.renderRows = function(rows, groupId) {
		var rowsHtml = "";
		//ontouchstart is currently commented out until further testing can be done (currently gives a false positive for chrome and firefox)
		var browserClass = (/*('ontouchstart' in window) || */(navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints > 0) || CERN_Platform.isTouchModeEnabled()) ? "browser-view " : "";
		var columnSequence = this.getColumnSequence();
		var numberColumns = columnSequence.length;
		groupId = groupId ? (":" + groupId) : "";
		var cellId = "";
		var srObj = comp.getScratchpadSharedResourceObject();

		for (var i = 0; i < rows.length; i++) {
			var row = rows[i];
			var selectedClass = row.resultData.SELECTED ? "op-row-selected " : "";
			var rowClass = "result-info " + browserClass + selectedClass + this.getStripeClass(i);
			var rowId = this.namespace + groupId + ":" + row.getId();
			var actionFound = false;

			rowsHtml += "<" + this.getRowTag() + " id='" + rowId + "' class='" + rowClass + "'>";
			//check the shared resource for order actions that have been added to the scratchpad
			if (srObj) {
				var dataObj = srObj.getResourceData();
				if (dataObj) {
					var scratchpadArr = dataObj.scratchpadObjArr;
					if (scratchpadArr) {
						var arrLen = scratchpadArr.length;
						for (var x = 0; x < arrLen; x++) {
							if (scratchpadArr[x].ordId == row.resultData.ORDER_ID) {
								actionFound = true;
								break;
							}
						}
					}
				}
			}
			//open table-row
			for (var j = 0; j < numberColumns; j++) {
				var column = this.getColumnMap()[columnSequence[j]];
				var canceledClass = "";
				var style = "style='{0}{1}'";
				if (textArray.indexOf(column.columnId) !== -1) {
					canceledClass = (row.resultData.CANCELED || actionFound) ? "op-cancelled " : "";
				}
				var tableCellClass = "table-cell " + canceledClass + column.getCustomClass();
				var columnID = column.getColumnId();
				//if the column's width has been set, convert it to a percentage value for resize purposes
				if (column.getWidth()) {
					style = style.replace("{0}", "width:" + column.getWidth() + "px;");
				}
				if (comp.showPanel) {
					//ensure hidden columns remain hidden
					switch(columnID) {
						case "STATUS":
						case "STATUS_DT":
						case "PROVIDER":
						case "CATEGORY":
							style = style.replace("{1}", "display:none;");
							break;
					}
				}
				//ensure the style string does not contain any placeholders
				style = style.replace("{0}", "").replace("{1}", "");

				cellId = this.namespace + groupId + ":" + row.getId() + ":" + columnID;
				rowsHtml += "<" + this.getColumnTag() + " id='" + cellId + "' class='" + tableCellClass + "'" + style + ">";
				//open table-cell
				rowsHtml += column.getRenderTemplate().render(row.getResultData()) || "<span>&nbsp;</span>";
				rowsHtml += "</" + this.getColumnTag() + ">";
				//close table-cell
			}
			rowsHtml += "</" + this.getRowTag() + ">";
		}
		return rowsHtml;
	};
};

/**
 * The OrderProfileComponent implementation of the resizeComponent.  This function is being overridden because it needs
 * to perform special logic when the component is being resized.
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.resizeComponent = function() {
	//call the base class function
	MPageComponent.prototype.resizeComponent.call(this, null);
	var compTableHeight = this.compTableContainer.css("height");

	if (compTableHeight && this.showPanel) {
		var compId = "#op" + this.getComponentId();
		var columnMap = this.m_componentTable.getColumnMap();
		var compTableBody = $(compId + "tableBody");
		var venueClassCols = compTableBody.find(".op-venue");
		var notificationsCol = compTableBody.find(".op-notifications");
		var orderCol = compTableBody.find(".op-name");
		var startCol = compTableBody.find(".op-orderdt");

		this.sidePanel.setHeight(compTableHeight);
		this.sidePanel.resizePanel();

		//Make sure table column widths match column header widths
		venueClassCols.width($(compId + "columnHeaderMULTI_SELECT").width());
		notificationsCol.width($(compId + "columnHeaderNOTIFICATIONS").width());
		orderCol.width($(compId + "columnHeaderORDER").width());
		startCol.width($(compId + "columnHeaderSTART_DT").width());

		//Store the newly resized widths for each viewable column
		columnMap.MULTI_SELECT.setWidth(venueClassCols.outerWidth());
		columnMap.NOTIFICATIONS.setWidth(notificationsCol.outerWidth());
		columnMap.ORDER.setWidth(orderCol.outerWidth());
		columnMap.START_DT.setWidth(startCol.outerWidth());

		if (columnMap.VENUE) {
			columnMap.VENUE.setWidth(venueClassCols.outerWidth());
		}
	}
};

/**
 * This is the OrderProfileComponent implementation of the retrieveComponentData function.
 * It creates the necessary parameter array for the data acquisition script call and the associated Request object.
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.retrieveComponentData = function() {
	var criterion = null;
	var request = null;
	var sendAr = null;
	var statusBitMask = 0;
	var medCriteria = 0;
	var nonMedCriteria = 0;
	this.compTableArray = new Array(6);

	//on component-level refresh sets the show filter to "All Active Orders"
	if (this.getCurrentFilter()) {
		(this.currentFilter).val('1');
	}

	//on component-level refresh Pending Orders checkbox is unchecked, if checked
	if (this.getPendingOrderObj()) {
		(this.opPendingOrdObj).attr('checked', false);
	}

	if (!statusBitMask) {
		//retrieve only active orders by default
		statusBitMask = 63;
	}
	if (!medCriteria) {
		//retrieve only Inpatient, Prescription, and Ambulatory orders
		medCriteria = 35;
	}
	if (!nonMedCriteria) {
		nonMedCriteria = 2;
	}

	/**
	 * mp_get_order_profile wrapper script parameters:
	 * outdev, inputPersonID, inputEncounterID, inputProviderID, orderStatusInd, medOrderCriteria,
	 * nonMedOrderCriteria, orderDetailInd, PPRCd
	 */
	/*
	 * Medication Criteria Indicators (medCriteria)
	 * None = 0
	 * Inpatient = 1
	 * Prescription = 2
	 * Ambulatory = 32
	 * 35 = Inpatient + Prescription + Ambulatory
	 *
	 * Order Status Indicators (statusBitMask)
	 * Active:
	 * None = 0
	 * Ordered = 1
	 * Inprocess = 2
	 * Future = 4
	 * Incomplete = 8
	 * Suspended = 16
	 * On Hold, Med Student = 32
	 * Inactive:
	 * Discontinued = 64
	 * Cancelled = 128
	 * Completed = 256
	 * Pending Complete = 512
	 * Voided = 1024
	 * Voided With Results = 2048
	 * Transfer/Cancelled = 4096
	 * 63 = Active Orders (Ordered + Inprocess + Future + Incomplete + Suspended + On Hold, Med Student)
	 * 8128 = Inactive Orders (Discontinued, Cancelled, Completed, Pending Complete, Voided, Voided With Results, Transfer/Cancelled)
	 */

	criterion = this.getCriterion();
	sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", statusBitMask, medCriteria, nonMedCriteria, criterion.ppr_cd + ".0"];

	request = new MP_Core.ScriptRequest(this, this.getComponentLoadTimerName());
	request.setProgramName("MP_GET_ORDER_PROFILE");
	request.setParameters(sendAr);
	request.setAsync(true);

	MP_Core.XMLCCLRequestCallBack(this, request, this.handleFilteredResults);
};

/**
 * This function is an override of the MPageComponent level version of the method. It handles any processing that needs to take place
 * after the component has been renderd.
 * Note: The base function is still called within this new implementation.
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.postProcessing = function() {
	MPageComponent.prototype.postProcessing.call(this);

	if (!this.getWasListenerAdded()) {
		CERN_EventListener.addListener(this, EventListener.EVENT_ORDER_ACTION, this.getFilteredData, this);
		CERN_EventListener.addListener(this, EventListener.EVENT_SCRATCHPAD_REMOVED_ORDER_ACTION, this.undoOrderAction, this);
		CERN_EventListener.addListener(this, EventListener.EVENT_SCRATCHPAD_RECIEVED_ORDER_ACTION, this.updateComponentOrders, this);
		this.setWasListenerAdded(true);
	}
};

/*This function creates the split button which is to be added in the UI
 *if Daily Order Review filter is set in the bedrock
 @param {object} opDORObject - instance of daily order review
 @return {string} - html content of split button 
 */
OrderProfileComponent.prototype.renderSplitButton = function () {
	var component = this;
	var opDORObject = component.getDailyReviewObj();
	var compId = component.getComponentId();
	var reviewButtonHTML = [];
	var dailyReviewArray = opDORObject.getReviewOrders();
	var totalPendingOrders = dailyReviewArray.length;
	//custom classs for split button
	var reviewButtonClass = "review-split-btn_" + compId;
	var opi18n = i18n.discernabu.order_profile_o1;
	
	var callbackLaunchOrderReview = function () {
		var filterSelection = $("#opAdvFilters" + compId).children("option:selected").text();
		opDORObject.setSelectedFilter(filterSelection);
		opDORObject.launchOrderReviewModal();
	};
		
	//adding split button in the UI for Daily Order Review functionality
	var ordersCountText = (totalPendingOrders !== 0) ? " ("+totalPendingOrders+")" : "";
	var splitButton = new MPageUI.SplitButton();
	splitButton.setStyle(reviewButtonClass);
	splitButton.setLabel(opi18n.OP_BUTTON_LABEL + ordersCountText);
	splitButton.setLabelButtonClickCallback(function () {
		var filterSelection = $("#opAdvFilters" + compId).children("option:selected").text();
		opDORObject.setSelectedFilter(filterSelection);
		if (filterSelection && filterSelection !== opi18n.ALL_ACTIVE) {
			opDORObject.launchOrderReviewModal();
		} else {
			opDORObject.markOrdersAsReviewed("","", reviewButtonClass);
		}
		
	});
	splitButton.addOptions([{
			label : opi18n.SPLIT_BUTTON_Option1,
			onSelect : callbackLaunchOrderReview
		}
	]);
	reviewButtonHTML.push("<br/><br/>" + splitButton.render());
	$("#reviewButton"+compId).html(reviewButtonHTML);
	splitButton.attachEvents();
};

/**
 * This is the OrderProfileComponent implementation of the renderComponent function.  It takes the information retrieved from the script
 * call and renders the component's visuals.  There is no check on the status of the script call's reply since that is handled in the
 * call to XMLCCLRequestWrapper.
 * @param {MP_Core.ScriptReply} recordData - The ScriptReply object returned from the call to MP_Core.XMLCCLRequestCallBack function in the
 * retrieveComponentData function of this object.
 * @param {object} component - The orderProfile component.
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.renderComponent = function (recordData, component) {
	if (!component) {
		component = this;
	}
	if (CERN_Platform.inMillenniumContext()) {
		this.initPendingSR(component);
	}
	var compId = component.getComponentId();
	var compNamespace = component.getStyles().getId();
	var opi18n = i18n.discernabu.order_profile_o1;
	var orderGrouping = component.getOPOrderGrouping();
	var userPrefs = component.getPreferencesObj();
	var headerCnt = $("#op" + compId).find(".sec-total");
	var pendingCnt = $("#pendingCnt" + compId);
	var pendingOrdObj = $("#opPendingOrders" + compId);
	var pendingInd = pendingOrdObj.length > 0 ? pendingOrdObj.is(":checked") : false;
	var advFilterObj = $("#opAdvFilters" + compId);
	component.setCurrentFilter(advFilterObj);
	component.setPendingOrderObj(pendingOrdObj);
	var compTable = null;
	var sHTML = [];
	var pendingOrderCount = "()";
	var contentDiv = $("#" + compNamespace + "table");
	var hmDisclaimerType = MPageControls.AlertMessage.MessageTypes.INFORMATION;
	var hmDisclaimerMessage = "<span>" + opi18n.HM_DISCLAIMER + "</span>";
	var template = MPageControls.getDefaultTemplates().messageBar;

	if (userPrefs !== null) {
		//check for user preferences and set the local pref object
		if (userPrefs.hasOwnProperty("catSubSecs")) {
			component.setLocalPrefs(userPrefs);
			orderGrouping = userPrefs.groupByPref;
		}
	}

	//build array for sorting
	component.buildOPOrdersArray(recordData);

	pendingOrderCount = " (" + component.opPendingOrders.length + ")";

	switch (orderGrouping) {
	case 2:
		compTable = component.getVenueTable(pendingInd);
		break;
	case 3:
		compTable = component.getDateTimeTable(pendingInd);
		break;
	default:
		compTable = component.getCategoryTable(pendingInd);
		break;
	}

	//apply group subsection expand/collapse prefs
	component.applyExpandCollapsePreferences(compTable);
	//apply ComponentTable override functions
	component.compTableOverrides(compTable);

	//we only need to push this HTML once on initial load
	if (advFilterObj.length < 1) {
		sHTML.push("<div class='op-controls' id='ordProfControls", compId, "'>");
		sHTML.push("<input type='checkbox' id='opPendingOrders", compId, "' value='pending' style='margin:0px 10px;'><span>", opi18n.PENDING_ORDERS, "</span><span id='pendingCnt", compId, "'>", pendingOrderCount, "</span>");
		sHTML.push("<span class='op-filters'>", opi18n.GROUP_BY, "</span><select id='opGroupBy", compId, "'>");

		if (orderGrouping === 1) {
			sHTML.push("<option value='1' selected='selected'>", opi18n.CLINICAL_CATEGORY, "</option>");
		} else {
			sHTML.push("<option value='1'>", opi18n.CLINICAL_CATEGORY, "</option>");
		}
		if (orderGrouping === 2) {
			sHTML.push("<option value='2' selected='selected'>", opi18n.ORDER_TYPE_DROP_DOWN, "</option>");
		} else {
			sHTML.push("<option value='2'>", opi18n.ORDER_TYPE_DROP_DOWN, "</option>");
		}
		if (orderGrouping === 3) {
			sHTML.push("<option value='3' selected='selected'>", opi18n.NONE, "</option>");
		} else {
			sHTML.push("<option value='3'>", opi18n.NONE, "</option>");
		}
		sHTML.push("</select></div>");

		//create the container element for the home medications disclaimer
		component.createHomeMedicationsDisclaimer(compId);

		//push HTML for component table wrapper
		sHTML.push("<div id='", compNamespace, "tableWrapper' class='op-comp-table'>");

		//push HTML for componentTable
		sHTML.push(compTable.render());

		//close table wrapper
		sHTML.push("</div>");

		//push HTML for side panel shell
		sHTML.push("<div id='op" + compId + "SidePanel' class='op-side-panel'></div>");

		component.finalizeComponent(sHTML.join(""), MP_Util.CreateTitleText(component, component.opOrdersArray.length));

		component.compTableContainer = $("#" + compNamespace + "tableWrapper");
		component.sidePanelObj = $("#" + compNamespace + "SidePanel");

		component.initSidePanel();

		//make sure we only retrieve the filter sets once
		component.opFilterSets = {
			"FILTER_CNT" : recordData.FILTER_CNT,
			"PREF_GROUPS" : recordData.PREF_GROUPS,
			"CANCEL_ORDER_PRIV" : recordData.CANCELORDERPRIV,
			"HAS_EXCEPTION" : recordData.HAS_EXCEPTION
		};
		component.buildPrefSelector(component.opFilterSets);

		//create and render the Home Meds Disclaimer
		var hmDisclaimerElement = $("#opHomeMedsDisclaimer" + compId);
		var control = new MPageControls.AlertMessage(hmDisclaimerElement, template, hmDisclaimerType);
		control.render(hmDisclaimerMessage);

	} else {
		//inject the new componentTable HTML
		contentDiv[0].innerHTML = compTable.render();
		compTable.finalize();

		//update the pending orders and header counts
		headerCnt.text("(" + recordData.ORDERS.length + ")");
		pendingCnt.text("(" + component.opPendingOrders.length + ")");
	}

	if (component.getAllowDailyReview()) {
		$("#opContent" + compId).append("<div id='reviewButton" + compId + "'></div>");
		//adding split button in the UI for Daily Order Review functionality
		component.renderSplitButton();
		//disables the review button if there are no orders qualified for review
		var opDORObject = component.getDailyReviewObj();
		var reviewButtonClass = "review-split-btn_" + compId;
		var dailyReviewArray = opDORObject.getReviewOrders();
		var totalPendingOrders = dailyReviewArray.length;
		if (totalPendingOrders === 0) {
			$("." + reviewButtonClass).attr("disabled", true);
		}
	}

	// notifies whoever is listening that we have a new count
	var eventArg = {
		"count" : recordData.ORDERS.length
	};
	CERN_EventListener.fireEvent(component, component, EventListener.EVENT_COUNT_UPDATE, eventArg);
};

/**
 * This function checks if the required orders from Order Group filter have been charted as Active Order
 * @param {object[]} ordProfile - Array of Order objects having Order details.
 * @return {boolean} true- atleast one order is charted as Active order; false-at least one required order from each Order Group is not available
 */
OrderProfileComponent.prototype.getOrderGroupCheckSatisfier = function (ordProfile) {
	var component = this;
	var satisfiedGrpIndexArr = [];
	var ordersCount = ordProfile.length;
	var isReqSatisfied = false;
	if (ordersCount) {
		for (var x = 0; x < ordersCount; x++) {
			var ordDetailInfo = ordProfile[x];
			satisfiedGrpIndexArr = satisfiedGrpIndexArr.concat(component.getOrderGroupSatisfiedIndexArr(ordDetailInfo));
		}
		var distinctGrpIndexArr = [];
		$.each(satisfiedGrpIndexArr, function (i, el) {
			if ($.inArray(el, distinctGrpIndexArr) === -1) {
				distinctGrpIndexArr.push(el);
			}
		});
		if (distinctGrpIndexArr.length === component.getRequiredOrdGrpArr().length) {
			isReqSatisfied = true;
		}
	}
	return isReqSatisfied;
};
/**
 * This function returns the an array of Indices of Order groups which have satisfied the Gap Check requirements
 * @param {object} ordDetailInfo - Order detail information as object
 * @return {array} Indices of Order Groups satisfying Gap Check Indicator requirements
 */
OrderProfileComponent.prototype.getOrderGroupSatisfiedIndexArr = function (ordDetailInfo) {
	var ordGrpSatisfier = false;
	var component = this;
	var recordData = component.getOPData();
	var codesArray = MP_Util.LoadCodeListJSON(recordData.CODES);
	var activeStatuses = ["ORDERED", "INPROCESS", "INCOMPLETE", "FUTURE", "SUSPENDED", "MEDSTUDENT"];
	var ordStatus = MP_Util.GetValueFromArray(ordDetailInfo.STATUS_CD, codesArray);
	var reqOrdGrpArr = component.getRequiredOrdGrpArr();
	var reqOrdGrpArrLen = reqOrdGrpArr.length;
	var satisfiedGrpIndexArr = [];
	var reqOrdGrp = null;

	for (var x = 0; x < reqOrdGrpArrLen; x++) {
		reqOrdGrp = reqOrdGrpArr[x];
		var reqOrdGrpSatisfierFlag = false;
		if (reqOrdGrp.length) {
			if ((reqOrdGrp.indexOf(ordDetailInfo.ORDER_SYNONYM_ID) !== -1) && (activeStatuses.indexOf(ordStatus.meaning) !== -1)) {
				satisfiedGrpIndexArr.push(x);
			}
		}
	}
	return satisfiedGrpIndexArr;
};

/**
 * Checks if the required orders Across the Order Groups have been charted as Active Order
 * @return {boolean} true- If all Order Groups satisfies requirements; false-at least one Order Group not satisfied requirements across Order Groups
 */
OrderProfileComponent.prototype.isGapCheckRequirementSatisfied = function () {
	var component = this;
	var ordGrpCheckSatisfied = false;
	var recordData = component.getOPData();
	var ordProfile = recordData.ORDERS;
	ordGrpCheckSatisfied = component.getOrderGroupCheckSatisfier(ordProfile);
	return ordGrpCheckSatisfied;
};
/**
 * Initiates EVENT_SATISFIER_UPDATE method to change the icon based on the value returned from the satisfier condition
 * and updates the satisfied indicator.
 * @return {undefined} undefined
 */
OrderProfileComponent.prototype.updateSatisfierRequirementIndicator = function () {
	if (this.getGapCheckRequiredInd()) {
		var component = this;
		var isRequirementSatisfied = component.isGapCheckRequirementSatisfied();
		this.setSatisfiedInd(isRequirementSatisfied);
		CERN_EventListener.fireEvent(component, component, EventListener.EVENT_SATISFIER_UPDATE, {
			satisfied : isRequirementSatisfied
		});
		component.updateComponentRequiredIndicator();
	}
};
/**
 * Call the orders service and retrieve a new set of results based on the filter set chosen
 * @param {string} selection : This is the text of the filter that has been selected
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.getFilteredData = function(selection) {
	var opi18n = i18n.discernabu.order_profile_o1;
	var compId = this.getComponentId();
	var compNamespace = this.getStyles().getId();
	var medCriteria = 0;
	//default value to set medication criteria
	var nonMedCriteria = 2;
	//default value to view all non-medication orders
	var orderTypeFilter = 0;
	//0 = no filter type ordering, 1 = meds only, 2 = non-meds only
	var statusBitMask = 8191;
	//default value to load all status indicators
	var lookbackDays = 0;
	var contentDiv = $("#" + compNamespace + "table");
	var controlsDiv = $("#ordProfControls" + compId);
	var disclaimerDiv = $("#opDisclaimer" + compId);
	var refreshInd = false;
	var totalOrderStatusBitMask = 0;
	var orderStatusIndicators = 12;  // Ex : Ordered,Future,In process,On-hold,Suspended ...

	if (disclaimerDiv.length > 0) {
		//remove any disclaimer messages that might be hanging around
		disclaimerDiv.remove();
	}
	if ( typeof selection !== "string") {
		//reset the marked orders array since this was called through "refresh"
		this.markedOrders = [];

		//this function was not passed a proper selection, lets grab it
		var advFilterObj = $("#opAdvFilters" + compId);
		refreshInd = true;
		selection = advFilterObj.children("option:selected").text();
	}

	for (var z = 0; z < this.opFiltersArray.length; z++) {
		//cycle through the filter sets to find the one that was selected and load its preferences
		var thisEntry = this.opFiltersArray[z];
		if (thisEntry.filterdisplayname === selection) {
			orderTypeFilter = thisEntry.filterordertype;

			//determine the lookback range, we want the greater of the two
			lookbackDays = Math.max(thisEntry.activedays, thisEntry.inactivedays);

			//if we have two unique lookback ranges, tell the user we're only using the greater of the two
			if (thisEntry.activedaysind == 1 && thisEntry.inactivedaysind == 1 && thisEntry.activedays != thisEntry.inactivedays) {
				var uniqueLookbackTimer = MP_Util.CreateTimer("CAP:MPG OP-o1_distinct_lookback_ranges");
				if (uniqueLookbackTimer) {
					uniqueLookbackTimer.Start();
					uniqueLookbackTimer.Stop();
				}
				var disclaimer = opi18n.LOOKBACK_DISCLAIMER.replace("{0}", lookbackDays);
				controlsDiv.append("<div id='opDisclaimer" + compId + "'><span class='op-disclaimer'>" + disclaimer + "</span></div>");
			}

			if (orderTypeFilter != 2) {
				//set up medication criteria bitmask
				//each order type ind is passed as a string, if it does not exist, it will be defaulted as true
				medCriteria += thisEntry.inpatientordertypeind ? parseInt(thisEntry.inpatientordertypeind, 10) : 1;
				medCriteria += thisEntry.prescriptionordertypeind ? parseInt(thisEntry.prescriptionordertypeind, 10) * 2 : 2;
				medCriteria += thisEntry.ambulatoryordertypeind ? parseInt(thisEntry.ambulatoryordertypeind, 10) * 32 : 32;
				if (thisEntry.inpatientordertypeind != 1) {
					//we don't want to display non med orders with prescription, documented meds, or ambulatory meds
					nonMedCriteria = 0;
				}
				if (orderTypeFilter == 1) {
					//only display medication orders
					nonMedCriteria = 0;
				}
			} else {
				//only display non-medication orders
				medCriteria = 0;
			}
			//set the bitmask for order statuses
			statusBitMask = thisEntry.checkmarkbitmask;
			break;
		}
	}
	// Assign bitmask values for different order statuses.
	for (var i = orderStatusIndicators; i >= 0; i--) {
		var orderStatusBit = Math.pow(2, i);
		var orderStatusValue = "";
		if (orderStatusBit <= statusBitMask) {// Checking the multiple order statuses of filters.
			statusBitMask = statusBitMask - orderStatusBit;
			switch (orderStatusBit) {
				case 2:
					// In-process
					orderStatusValue = 4;
					break;
				case 4:
					// Future
					orderStatusValue = 2;
					break;
				case 8:
					// Incomplete
					orderStatusValue = 32;
					break;
				case 32:
					// On Hold, Med Student
					orderStatusValue = 8;
					break;
				case 64:
					// Discontinued
					orderStatusValue = 128;
					break;
				case 128:
					// Cancelled
					orderStatusValue = 64;
					break;
				case 1024:
					// Voided without Results
					orderStatusValue = 2048;
					break;
				case 2048:
					// Voided With Results
					orderStatusValue = 1024;
					break;
				default:
					// Ordered , Completed , Pending Complete and Transfer-Canceled
					orderStatusValue = orderStatusBit;
			}
			totalOrderStatusBitMask = totalOrderStatusBitMask + orderStatusValue; // adding different order status bitmask values based on the combination of filter. 
		}
	}
	this.orderStatusBitMaskVal = totalOrderStatusBitMask;
	//clear component table array since we will have new data to display
	this.compTableArray = new Array(6);
	//clear content body and display load icon if this function was called via a filter change
	if (!refreshInd) {
		$(contentDiv).html("<div class='op-preloader-icon'></div>");
	}

	//set up the parameter and request and call the script
	var sendAr = [];
	var criterion = this.getCriterion();

	sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", totalOrderStatusBitMask, medCriteria, nonMedCriteria, criterion.ppr_cd + ".0", lookbackDays);

	var request = new MP_Core.ScriptRequest(this, this.getComponentLoadTimerName());
	request.setProgramName("MP_GET_ORDER_PROFILE");
	request.setParameters(sendAr);
	request.setAsync(true);

	MP_Core.XMLCCLRequestCallBack(this, request, this.handleFilteredResults);
};

/**
 * This is the getter for the categoryTable, if it does not exist, the createCategoryTable method will be called.
 * @param {boolean} pendingInd : An optional parameter that determines if only pending orders will be displayed.
 * @return {componentTable} categoryTable : The categoryTable object
 */
OrderProfileComponent.prototype.getCategoryTable = function(pendingInd) {
	if (!pendingInd && this.compTableArray[0] == undefined) {
		//regular orders
		return this.createCategoryTable();
	} else if (pendingInd && this.compTableArray[1] == undefined) {
		//pending orders
		return this.createCategoryTable(pendingInd);
	} else if (!pendingInd) {
		//regular orders
		return this.compTableArray[0];
	} else {
		//pending orders
		return this.compTableArray[1];
	}
};

/**
 * This prototype function creates a componentTable grouped by Category
 * @param {boolean} pendingInd : A boolean that determines if only pending orders will be displayed.
 * @return {componentTable} dateTimeTable : The componentTable object
 */
OrderProfileComponent.prototype.createCategoryTable = function(pendingInd) {
	var clickExtension = new TableCellClickCallbackExtension();
	var categoryTable = new ComponentTable();
	var catLen = pendingInd ? this.opPendingCatArray.length : this.opCatArray.length;
	var groupSequence = categoryTable.getGroupSequence();

	/*~~~~~~ ComponentTable Override Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	/**
	 * This function overrides a componentTable's quick grouping functionality
	 * @param {String} key : key value for grouping.
	 * @param {String} template : template to build
	 * @param {boolean} showCount: count for available group
	 * @param {Object} order object
	 * @return null
	 */

	categoryTable.quickGroup = function(key, template, showCount) {
		this.groupedBy = key;
		this.groupTemplate = TemplateBuilder.buildTemplate(template);
		this.showGroupCount = showCount;
		var tableRows = this.getRows();
		var numberOfRows = tableRows.length;
		//If the data hasn't been bound, we stop here
		if (!numberOfRows) {
			return;
		}
		this.groupMap = {};
		//Iterate through the rows and add them to their respective groups
		for (var i = 0; i < numberOfRows; i++) {
			this.addRowToGroup(key, tableRows[i], showCount);
		}
	};

	/**
	 * This function overrides a componentTable's addRowsToGroup functionality
	 * @param {String} groupKey : key value for grouping.
	 * @param {String} row : Order row
	 * @param {boolean} showCount: count for available group
	 * @param {Object} order object
	 * @returns {undefined} undefined
	 */

	categoryTable.addRowToGroup = function(groupKey, row, showCount) {
		var rowData = row.getResultData();
		var rowKey = (rowData[groupKey] || "UNKNOWN").replace(/[\s]/gi, "_").replace(/[\W]/gi, "").toUpperCase();
		var gMap = this.getGroupMap();
		if (!gMap[rowKey]) {
			gMap[rowKey] = new TableGroup().setKey(groupKey).setValue(rowKey).setDisplay(this.groupTemplate.render(rowData)).setGroupId(rowKey).setShowCount(showCount);
		}
		gMap[rowKey].addRow(row);
	};
	/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

	var comp = this;
	categoryTable.setNamespace(this.getStyles().getId());
	categoryTable.setZebraStripe(true);

	categoryTable = this.createColumns(categoryTable, 1);

	if (pendingInd) {
		categoryTable.bindData(this.opPendingOrders);
	} else {
		categoryTable.bindData(this.opOrdersArray);
	}
	/* set the table's groupSequence according to the category order */
	for (var x = 0; x < catLen; x++) {
		if (pendingInd) {
			groupSequence.push(this.opPendingCatArray[x].display.replace(/[\s]/gi, "_").replace(/[\W]/gi, "").toUpperCase());
		} else {
			groupSequence.push(this.opCatArray[x].display.replace(/[\s]/gi, "_").replace(/[\W]/gi, "").toUpperCase());
		}
	}

	categoryTable.quickGroup("DEPT", "${DEPT}", true);
	categoryTable.sortByColumnInDirection("ORDER", TableColumn.SORT.ASCENDING);

	this.setComponentTable(categoryTable);
	if (pendingInd) {
		this.compTableArray[1] = categoryTable;
	} else {
		this.compTableArray[0] = categoryTable;
	}

	//set up the click extension
	clickExtension.setCellClickCallback(function(event, data) {
		comp.ordRowSel(event, data);
	});
	categoryTable.addExtension(clickExtension);

	return categoryTable;
};

/**
 * This is the getter for the venueTable, if it does not exist, the createVenueTable method will be called.
 * @param {boolean} pendingInd : An optional parameter that determines if only pending orders will be displayed.
 * @return {componentTable} venueTable : The venueTable object
 */
OrderProfileComponent.prototype.getVenueTable = function(pendingInd) {
	if (!pendingInd && this.compTableArray[2] == undefined) {
		//regular orders
		return this.createVenueTable();
	} else if (pendingInd && this.compTableArray[3] == undefined) {
		//pending orders
		return this.createVenueTable(pendingInd);
	} else if (!pendingInd) {
		//regular orders
		return this.compTableArray[2];
	} else {
		//pending orders
		return this.compTableArray[3];
	}
};

/**
 * This prototype function creates a componentTable grouped by Venue
 * @param {boolean} pendingInd : A boolean that determines if only pending orders will be displayed.
 * @return {componentTable} VenueTable : The componentTable object
 */
OrderProfileComponent.prototype.createVenueTable = function(pendingInd) {
	var clickExtension = new TableCellClickCallbackExtension();
	var venueTable = new ComponentTable();
	var comp = this;
	venueTable.setNamespace(this.getStyles().getId());
	venueTable.setCustomClass("op-comp-table");
	venueTable.setZebraStripe(true);

	venueTable = this.createColumns(venueTable, 2);

	if (pendingInd) {
		venueTable.bindData(this.opPendingOrders);
	} else {
		venueTable.bindData(this.opOrdersArray);
	}
	venueTable.quickGroup("VENUE", "${VENUE}", true);
	venueTable.sortByColumnInDirection("ORDER", TableColumn.SORT.ASCENDING);

	this.setComponentTable(venueTable);
	if (pendingInd) {
		this.compTableArray[3] = venueTable;
	} else {
		this.compTableArray[2] = venueTable;
	}

	//set up the click extension
	clickExtension.setCellClickCallback(function(event, data) {
		comp.ordRowSel(event, data);
	});
	venueTable.addExtension(clickExtension);

	return venueTable;
};

/**
 * This is the getter for the dateTimeTable, if it does not exist, the createDateTimeTable method will be called.
 * @param {boolean} pendingInd : An optional parameter that determines if only pending orders will be displayed.
 * @return {componentTable} dateTimeTable : The dateTimeTable object
 */

OrderProfileComponent.prototype.getDateTimeTable = function(pendingInd) {
	if (!pendingInd && this.compTableArray[4] == undefined) {
		//regular orders
		return this.createDateTimeTable();
	} else if (pendingInd && this.compTableArray[5] == undefined) {
		//pending orders
		return this.createDateTimeTable(pendingInd);
	} else if (!pendingInd) {
		//regular orders
		return this.compTableArray[4];
	} else {
		//pending orders
		return this.compTableArray[5];
	}
};

/**
 * This prototype function creates a componentTable with no grouping
 * @param {boolean} pendingInd : A boolean that determines if only pending orders will be displayed.
 * @return {componentTable} dateTimeTable : The componentTable object
 */
OrderProfileComponent.prototype.createDateTimeTable = function(pendingInd) {
	var clickExtension = new TableCellClickCallbackExtension();
	var dateTimeTable = new ComponentTable();
	var comp = this;
	dateTimeTable.setNamespace(this.getStyles().getId());
	dateTimeTable.setCustomClass("op-comp-table");
	dateTimeTable.setZebraStripe(true);

	dateTimeTable = this.createColumns(dateTimeTable, 3);

	if (pendingInd) {
		dateTimeTable.bindData(this.opPendingOrders);
	} else {
		dateTimeTable.bindData(this.opOrdersArray);
	}
	dateTimeTable.sortByColumnInDirection("START_DT", TableColumn.SORT.DESCENDING);

	this.setComponentTable(dateTimeTable);
	if (pendingInd) {
		this.compTableArray[5] = dateTimeTable;
	} else {
		this.compTableArray[4] = dateTimeTable;
	}

	//set up the click extension
	clickExtension.setCellClickCallback(function(event, data) {
		comp.ordRowSel(event, data);
	});
	dateTimeTable.addExtension(clickExtension);

	return dateTimeTable;
};

/**
 * This prototype function creates a structure for each column of the table and dynamically creates and adds them according to the specified table type
 * @param {componentTable} compTable : The componentTable object for which the columns are being created and added to
 * @param {number} type : The type of table that is being created. 1 = Category | 2 = Venue | 3 = None
 * @return {componentTable} compTable : The componentTable object
 */
OrderProfileComponent.prototype.createColumns = function(compTable, type) {
	var opi18n = i18n.discernabu.order_profile_o1;
	var colArr = [];
	var hoverExtension = new TableCellHoverExtension();
	var groupedBy = {
		CATEGORY: 1,
		VENUE: 2
	};
	var columnNum = {
		ORDER_ID: 0,
		ORDER_SYN_ID: 1,
		MULTI_SELECT: 2,
		NOTIFICATIONS: 3,
		VENUE: 4,
		ORDER: 5,
		START_DT: 6,
		STATUS: 7,
		STATUS_DT: 8,
		PROVIDER: 9,
		CATEGORY: 10
	};

	//set up column objects
	colArr = [{
		ID: "ORDER_ID",
		CLASS: "det-hd",
		DISPLAY: "",
		SORTABLE: false,
		RENDER_TEMPLATE: "${ORDER_ID}"
	}, {
		ID: "ORDER_SYN_ID",
		CLASS: "det-hd",
		DISPLAY: "",
		SORTABLE: false,
		RENDER_TEMPLATE: "${SYNONYM_ID}"
	}, {
		ID: "MULTI_SELECT",
		CLASS: "op-venue",
		DISPLAY: "&nbsp;",
		SORTABLE: false,
		RENDER_TEMPLATE: "${CHECKBOX_HTML}"
	}, {
		ID: "NOTIFICATIONS",
		CLASS: "op-notifications",
		DISPLAY: "&nbsp;",
		SORTABLE: false,
		RENDER_TEMPLATE: "${NOTIFY_HTML}"
	}, {
		ID: "VENUE",
		CLASS: "op-venue",
		DISPLAY: opi18n.ORDER_TYPE_HEADER,
		PRIMARY_SORT: "VENUE",
		SORTABLE: true,
		RENDER_TEMPLATE: "${VENUE_HTML}"
	}, {
		ID: "ORDER",
		CLASS: "op-name",
		DISPLAY: opi18n.ORDER,
		PRIMARY_SORT: "ORDER",
		SORTABLE: true,
		RENDER_TEMPLATE: "<span class='op-ord-name'>${ORDER}</span> <span class='op-detail'>${ORD_DETAILS}</span>"
	}, {
		ID: "START_DT",
		CLASS: "op-orderdt",
		DISPLAY: opi18n.START_DT_TM,
		PRIMARY_SORT: "START_DTTM_UTC",
		SORTABLE: true,
		RENDER_TEMPLATE: "${ORIG_DTTM}"
	}, {
		ID: "STATUS",
		CLASS: "op-status",
		DISPLAY: opi18n.STATUS,
		PRIMARY_SORT: "STATUS",
		SORTABLE: true,
		RENDER_TEMPLATE: "${STATUS}"
	}, {
		ID: "STATUS_DT",
		CLASS: "op-statusdt",
		DISPLAY: opi18n.STATUS_UPDATED,
		PRIMARY_SORT: "STATUS_UPDT_DTTM_UTC",
		SORTABLE: true,
		RENDER_TEMPLATE: "${STATUS_UPDT_DTTM}"
	}, {
		ID: "PROVIDER",
		CLASS: "op-provider",
		DISPLAY: opi18n.ORDERING_PROVIDER,
		PRIMARY_SORT: "ORIGPROV",
		SORTABLE: true,
		RENDER_TEMPLATE: "${ORIGPROV}"
	}, {
		ID: "CATEGORY",
		CLASS: "op-category",
		DISPLAY: opi18n.CLINICAL_CATEGORY,
		PRIMARY_SORT: "DEPT",
		SORTABLE: true,
		RENDER_TEMPLATE: "${DEPT}"
	}];

	//create columns
	var colLen = colArr.length;
	for (var x = 0; x < colLen; x++) {
		var curCol = colArr[x];
		var column = new TableColumn();

		column.setColumnId(curCol.ID);
		column.setCustomClass(curCol.CLASS);
		column.setColumnDisplay(curCol.DISPLAY);

		if (curCol.SORTABLE) {
			column.setPrimarySortField(curCol.PRIMARY_SORT);
			column.setIsSortable(curCol.SORTABLE);
		}

		column.setRenderTemplate(curCol.RENDER_TEMPLATE);
		colArr[x] = column;
	}

	//add columns to table
	for (var y = 0; y < colLen; y++) {
		if ((y === columnNum.VENUE && type === groupedBy.VENUE) || (y === columnNum.CATEGORY && type === groupedBy.CATEGORY)) {
			//don't push a type col when grouping by venue
			//don't push a category col when grouping by category
		} else {
			compTable.addColumn(colArr[y]);
		}
	}

	//Create hover extension for the notifications column
	hoverExtension.addHoverForColumn(colArr[columnNum.NOTIFICATIONS], function(data) {
		var thisThing = data.EVENT.target;
		if (thisThing.className === "op-comments-icon") {
			//we only want to display this if the user hovers over the comments icon
			return "<div class='hvr'><dl><dd>" + data.RESULT_DATA.ORDER_COMMENT + "</dd></dl></div>";
		}
	});

	/**
	 * Override the finalize() method of the TableCellHoverExtension class
	 * @param {object} table - The table object
	 * @returns {undefined} undefined
	 */
	hoverExtension.finalize = function(table) {
		var thiz = this;
		var tableBodyTag = "#" + table.getNamespace() + "tableBody";
		var elementMap = {};
		//Bind the mouseover event so we know when a user has hovered over an item
		$(tableBodyTag).on("mouseover", this.getTarget(), function(event) {
			var anchor = this;
			var anchorId = $(this).attr("id");

			if (!elementMap[anchorId]) {
				elementMap[anchorId] = {};
			}
			thiz.onHover(event);
			//Store of a flag that we're hovered on this element
			elementMap[anchorId].TIMEOUT = setTimeout(function() {
				thiz.showHover(event, table, anchor);
			}, 500);
		});
		//Bind the mouseout event
		$(tableBodyTag).on("mouseout", this.getTarget(), function(event) {
			clearTimeout(elementMap[$(this).attr("id")].TIMEOUT);
			thiz.onLeave(event);
		});
	};

	//add the hover extension to the table
	compTable.addExtension(hoverExtension);

	return compTable;
};

/**
 * Called once on page load to initialize the side panel object
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.initSidePanel = function() {
	var comp = this;
	var compId = comp.getComponentId();
	var compTableHeight = $("#op" + compId + "table").height();

	comp.sidePanel = new CompSidePanel(compId, "op" + compId + "SidePanel");
	comp.sidePanel.setExpandOption(comp.sidePanel.expandOption.EXPAND_DOWN);
	comp.sidePanel.setFullPanelScrollOn(true);
	comp.sidePanel.setHeight(compTableHeight + "px");
	comp.sidePanel.renderSidePanel();
	comp.sidePanel.showCloseButton();
	comp.sidePanel.setCloseFunction(function() {
		return;
	});
};

/**
 * Highlights the clicked row and loads its information into the side panel. Also allows the user to take an action on the order if in a Millennium environment,
 * @param {object} e - Event
 * @param {object} data : The data object associated with the selected row
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.ordRowSel = function(e, data) {
	var inMillennium = CERN_Platform.inMillenniumContext();
	var opi18n = i18n.discernabu.order_profile_o1;
	var clickedThing = e.target.nodeName;
	var isCheckbox = (clickedThing === "INPUT");
	var isChecked = false;
	var orderInfo = data.RESULT_DATA;
	var clickedRow = clickedThing == "SPAN" || isCheckbox ? e.target.parentNode.parentNode : e.target.parentNode;
	var orderId = orderInfo.ORDER_ID;
	var opNamespace = this.getStyles().getId();
	var tableBody = $("#" + opNamespace + "tableBody");
	var compId = this.getComponentId();
	var criterion = this.getCriterion();
	var ipath = criterion.static_content;
	var checked = $("#" + opNamespace + "tableBody :checked");
	var checkedLen = checked.length;
	var checkedCnt = checkedLen;
	var selectedRows = tableBody.find(".op-row-selected");
	var multiSelect = (isCheckbox || checked.length > 0) ? true : false;
	var multiOrdersMsg = "";
	var cancelSelCnt = 0;
	var canceledRows = 0;
	var prevSelectedRow = null;
	var resultData = null;
	var spHTML = [];

	if (isCheckbox) {
		if (e.target.checked === false) {
			//at this point, the check box has not been checked yet
			checkedCnt++;
			isChecked = true;
		} else {
			checkedCnt--;
		}

		if (checkedLen === 0 && selectedRows.length > 0) {
			//multi select was just enabled, remove highlight of previously selected row and update the orders array
			prevSelectedRow = selectedRows.find(".table-cell")[0];
			resultData = ComponentTableDataRetriever.getResultFromTable(this.m_componentTable, prevSelectedRow);
			selectedRows.removeClass("op-row-selected");
			this.updateOrderArrays(resultData.ORDER_ID, "select");
		}
	}

	//grab the status type of the order (active, inactive)
	var orderStatusType = orderInfo.STATUS_TYPE;

	if (clickedThing !== "INPUT" && multiSelect) {
		//only allow check box selecting when multi-select is active
		return;
	} else {
		if (($(clickedRow).hasClass("op-row-selected") && isCheckbox && e.target.checked) || ($(clickedRow).hasClass("op-row-selected") && !isCheckbox)) {
			//remove row highlight if this row has already been selected via row click or check box
			$(clickedRow).removeClass("op-row-selected");
			if ($(clickedRow).find(".op-cancelled").length > 0) {
				cancelSelCnt--;
			}
		} else {
			if (selectedRows.length > 0 && !multiSelect) {
				//remove highlight of previously selected row and update the orders array
				prevSelectedRow = selectedRows.find(".table-cell")[0];
				resultData = ComponentTableDataRetriever.getResultFromTable(this.m_componentTable, prevSelectedRow);
				selectedRows.removeClass("op-row-selected");
				if (selectedRows.find(".op-cancelled").length > 0) {
					cancelSelCnt--;
				}
				this.updateOrderArrays(resultData.ORDER_ID, "select");
			}
			$(clickedRow).addClass("op-row-selected");
			if ($(clickedRow).find(".op-cancelled").length > 0) {
				cancelSelCnt++;
			}
		}

		//Build HTML for action buttons
		spHTML.push("<div class='sp-action-holder'><span id='opResetBtn", compId, "' class='sp-button disabled'>", i18n.discernabu.CONFIRM_CLEAR, "</span><span id='opCancelBtn", compId, "' class='sp-button disabled'>", opi18n.CANCEL_DC, "</span></div>");

		//check for multiple selected orders
		if (checkedCnt > 1) {
			multiOrdersMsg = opi18n.MULTIPLE_ORDERS_SELECTED.replace("{0}", checkedCnt);
			spHTML.push("<div class='op-sp-centered secondary-text' align='center'>", multiOrdersMsg, "</div>");
		} else if ($(clickedRow).hasClass("op-row-selected") === false && checkedCnt === 1) {
			//display the currently checked row in the side panel
			selectedRows = tableBody.find(".op-row-selected");
			prevSelectedRow = selectedRows.find(".table-cell")[0];
			resultData = ComponentTableDataRetriever.getResultFromTable(this.m_componentTable, prevSelectedRow);
			spHTML.push(this.buildSidePanelHTML(resultData));
		} else {
			spHTML.push(this.buildSidePanelHTML(orderInfo));
		}
		//set side panel contents
		this.sidePanel.setContents(spHTML.join(""), "opContent" + compId);
		//remove any previously set click event from the side panel's close button and replace it with a call to the custom hideSidePanel function
		var comp = this;
		var closeBtnId = "#closeButton" + comp.getComponentId();
		var closeBtn = $(closeBtnId);
		comp.sidePanel.m_sidePanelObj.off("click", closeBtnId);
		closeBtn.off("click");
		closeBtn.on("click", function() {
			comp.clearSelectedRows();
			comp.hideSidePanel(comp);
		});
		if (!this.showPanel) {
			this.showSidePanel();
		}
	}

	selectedRows = tableBody.find(".op-row-selected");
	var selectedLen = selectedRows.length;
	//look for any selected rows that have been marked as canceled
	selectedRows.each(function() {
		if ($(this).find(".op-cancelled").length > 0) {
			canceledRows++;
		}
	});

	//hide side panel if there are no selected rows
	if (this.showPanel && selectedLen <= 0) {
		this.hideSidePanel();
	}

	if (inMillennium && orderStatusType === "active") {
		var cancelBtn = $("#opCancelBtn" + compId);
		var clearBtn = $("#opResetBtn" + compId);
		//Cancel/DC & Clear button disable/enable logic
		if (selectedLen > 0 && (cancelSelCnt > 0 || canceledRows > 0)) {
			clearBtn.removeClass("disabled");
			if (selectedLen === canceledRows) {
				cancelBtn.addClass("disabled");
			} else {
				cancelBtn.removeClass("disabled");
			}
		} else if (selectedLen > 0 && (cancelSelCnt === 0 || canceledRows === 0) && (this.hasPriv || this.hasException)) {
			cancelBtn.removeClass("disabled");
			if (cancelSelCnt < 0) {
				clearBtn.addClass("disabled");
			}
		} else {
			clearBtn.addClass("disabled");
			cancelBtn.addClass("disabled");
		}
		//add click events to action buttons
		cancelBtn.on("click", this.markRow);
		clearBtn.on("click", this.resetOrderMods);
	}
	this.updateOrderArrays(orderId, "select", isChecked);
};

/**
 * Builds the HTML string that will be used to populate the side panel
 * @param {object} orderData : The data structure containing the current order's information/details
 * @return {string} tHTML : The built HTML string
 */
OrderProfileComponent.prototype.buildSidePanelHTML = function(orderData) {
	var compId = this.getComponentId();
	var opi18n = i18n.discernabu.order_profile_o1;
	var tHTML = [];

	//Header
	tHTML.push("<div class='sp-header'>", orderData.ORDER, "</div><div class='op-sp-detail-line'>", orderData.ORD_DETAILS, "</div><div class='sp-separator'></div>");

	//Dose, Route, Frequency
	tHTML.push("<div id='sidePanelScrollContainer" + compId + "' class='op-sp-content'>");
	tHTML.push("<div class='op-sp-group'><div class='op-sp-detail-line'><span>", opi18n.DOSE, "</span><span>", opi18n.ROUTE, "</span><span>", opi18n.FREQUENCY, "</span></div>");
	tHTML.push("<div class='op-sp-detail-value'><span>", orderData.DOSE, "</span><span>", orderData.ROUTE, "</span><span>", orderData.FREQUENCY, "</span></div></div>");

	//Associated Problems
	tHTML.push("<div class='op-sp-group'><div class='op-sp-detail-line'><span>", i18n.TYPE, "</span><span>", i18n.STATUS, "</span><span>", opi18n.LAST_STATUS_UPDATE, "</div>");
	tHTML.push("<div class='op-sp-detail-value'><span>", orderData.VENUE, "</span><span>", orderData.STATUS, "</span><span>", orderData.STATUS_UPDT_DTTM, "</span></div>");
	tHTML.push("</div>");

	//Ordering Physician, Start, Stop
	tHTML.push("<div class='op-sp-group'><div class='op-sp-detail-line'><span>", i18n.ORDERING_PHYSICIAN, "</span><span>", i18n.START, "</span><span>", i18n.STOP, "</span></div>");
	tHTML.push("<div class='op-sp-detail-value'><span>", orderData.ORIGPROV, "</span><span>", orderData.ORIG_DTTM, "</span><span>", orderData.STOP_DT_TM, "</span></div></div>");

	//Clinical Category
	tHTML.push("<div class='op-sp-group'><div class='op-sp-detail-line'>", i18n.CATEGORY, "</div>");
	tHTML.push("<div class='op-sp-detail-value'>", orderData.DEPT, "</div></div>");

	//comments
	tHTML.push("<div class='op-sp-group'><div class='op-sp-detail-line'>", i18n.COMMENTS, "</div>");
	tHTML.push("<div class='op-sp-detail-value'>", orderData.ORDER_COMMENT, "</div></div></div>");

	return tHTML.join("");
};

/**
 * Show the side panel using animated styles and hide the necessary columns for proper display
 */
OrderProfileComponent.prototype.showSidePanel = function() {
	var comp = this;
	var venueClassCols = comp.compTableContainer.find(".op-venue");
	var notificationsCol = comp.compTableContainer.find(".op-notifications");
	var orderCol = comp.compTableContainer.find(".op-name");
	var startCol = comp.compTableContainer.find(".op-orderdt");

	//set a static pixel width for each column we want to display
	venueClassCols.width(venueClassCols.width());
	notificationsCol.width(notificationsCol.width());
	orderCol.width(orderCol.width());
	startCol.width(startCol.width());

	//hide the columns we don't want to display
	comp.compTableContainer.find(".op-status").hide();
	comp.compTableContainer.find(".op-statusdt").hide();
	comp.compTableContainer.find(".op-provider").hide();
	comp.compTableContainer.find(".op-category").hide();

	comp.showPanel = true;
	comp.compTableContainer.animate({
		width: "60%"
	}, 125);
	comp.sidePanelObj.show().animate({
		width: "40%"
	}, 150, function() {
		$(this).css("display", "inline-block");
	});

	setTimeout(function() {
		var tableWidth = comp.compTableContainer.width();
		var venueWidthPercentage = ((venueClassCols.outerWidth() / tableWidth) * 100) + "%";
		var notificationsWidthPercentage = ((notificationsCol.outerWidth() / tableWidth) * 100) + 1 + "%";
		var orderNameWidthPercentage = ((orderCol.outerWidth() / tableWidth) * 100) + 1 + "%";
		var startDtWidthPercentage = ((startCol.outerWidth() / tableWidth) * 100) + 1 + "%";

		venueClassCols.css({
			"width": venueWidthPercentage
		});
		notificationsCol.css({
			"width": notificationsWidthPercentage
		});
		orderCol.css({
			"width": orderNameWidthPercentage
		});
		startCol.css({
			"width": startDtWidthPercentage
		});

		comp.resizeComponent();
	}, 150);
};

/**
 * Hide the side panel using animated styles and show any previously hidden table columns
 * @param {object} component : The current instance of the OrderProfileComponent object. This parameter is optional.
 */
OrderProfileComponent.prototype.hideSidePanel = function(component) {
	var comp = component ? component : this;
	var venueClassCols = comp.compTableContainer.find(".op-venue");
	var notificationsCol = comp.compTableContainer.find(".op-notifications");
	var orderCol = comp.compTableContainer.find(".op-name");
	var startCol = comp.compTableContainer.find(".op-orderdt");
	var columnMap = comp.m_componentTable.getColumnMap();

	//set a static width for each column we want to display
	venueClassCols.width(venueClassCols.width());
	notificationsCol.width(notificationsCol.width());
	orderCol.width(orderCol.width());
	startCol.width(startCol.width());

	//use a timeout to ensure proper display during the animation
	setTimeout(function() {
		venueClassCols.removeAttr("style");
		notificationsCol.removeAttr("style");
		orderCol.removeAttr("style");
		startCol.removeAttr("style");

		columnMap.MULTI_SELECT.setWidth(0);
		columnMap.NOTIFICATIONS.setWidth(0);
		columnMap.ORDER.setWidth(0);
		columnMap.START_DT.setWidth(0);

		if (columnMap.VENUE) {
			columnMap.VENUE.setWidth(0);
		}

		comp.compTableContainer.find(".op-status").show();
		comp.compTableContainer.find(".op-statusdt").show();
		comp.compTableContainer.find(".op-provider").show();
		comp.compTableContainer.find(".op-category").show();
	}, 150);

	comp.showPanel = false;
	comp.compTableContainer.animate({
		width: "100%"
	}, 150);
	comp.sidePanelObj.animate({
		width: "0%"
	}, 150, function() {
		$(this).hide();
	});
};

/**
 * Called when the cancel/dc button is pressed. Order is sent to the scratchpad and is marked as a pending cancel/dc order
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.markRow = function(e) {
	var compId = parseInt(this.id.replace(/[^\d]/g, ""), 10);
	var component = MP_Util.GetCompObjById(compId);
	var opNamespace = component.getStyles().getId();
	var tableBody = $("#" + opNamespace + "tableBody");
	var selectedRows = tableBody.find(".op-row-selected");
	var selRowLen = selectedRows.length;

	//loop through selected orders and add their data to the scratchpad object
	for (var x = 0; x < selRowLen; x++) {
		var curRow = selectedRows[x];
		var curRowOrdId = curRow.children[0].innerHTML;
		var curRowSynId = curRow.children[1].innerHTML;
		var scratchpadObj = {};
		//convert compId to a string before assigning it to scratchpadObj
		compId = compId.toString();
		scratchpadObj.componentId = compId;
		scratchpadObj.addedFrom = "OrderProfile";

		//face up strikethrough for DOM element and scratchpad logic
		if ($(curRow).find(".op-cancelled").length === 0) {
			//we only need to perform this logic if the row hasn't been marked
			var curRowName = "";
			var curRowDetails = "";
			var curRowId = curRow.id;
			var reg = /\s|(&nbsp;)/g; //whitespace or non-breaking spaces
			$(curRow).children().each(function() {
				if (this.className === "table-cell op-name") {
					//get the order name and details
					curRowName = this.children[0].innerHTML;
					curRowDetails = this.children[1].innerHTML;
				}
				var content = this.innerText || this.textContent;
				if (content) {
					content = content.replace(reg, "");
					if (content.length > 0 && this.id.indexOf("ORDER_ID") === -1 && this.id.indexOf("ORDER_SYN_ID") === -1) {
						//field is not empty and is not one of the hidden order or synonym id fields. Add strikethrough
						$(this).addClass("op-cancelled");
					}
				}
			});
			scratchpadObj.favId = curRowId;
			scratchpadObj.favName = curRowName;
			scratchpadObj.favOrderSentDisp = curRowDetails;
			scratchpadObj.favParam = curRowSynId + ".0|0|0.0";
			scratchpadObj.favSynId = curRowSynId + ".0";
			scratchpadObj.ordAction = "cancel";
			scratchpadObj.ordId = curRowOrdId;
			$(curRow).attr("ORDID", curRowOrdId);
			//send this to the scratchpad
			var dataObj = component.addRemoveFromScratchpad(scratchpadObj, false);
			component.checkPendingSR(compId, 1);
		}
		$(curRow).removeClass("op-row-selected");

		component.updateOrderArrays(curRowOrdId, "cancel");
	}
	component.clearSelectedRows();
	component.hideSidePanel();
};

/**
 * Remove the selected order from the scratchpad and undo whatever action was pending on the order.
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.resetOrderMods = function(e) {
	var compId = parseInt(this.id.replace(/[^\d]/g, ""), 10);
	var component = MP_Util.GetCompObjById(compId);
	var opNamespace = component.getStyles().getId();
	var dataObj = null;
	var tableBody = $("#" + opNamespace + "tableBody");
	var selectedRows = tableBody.find(".op-row-selected");
	var selRowLen = selectedRows.length;
	var scratchpadObj = {};

	//convert compId to a string before assigning it to scratchpadObj
	compId = compId.toString();
	scratchpadObj.componentId = compId;
	scratchpadObj.addedFrom = "OrderProfile";

	for (var x = 0; x < selRowLen; x++) {
		var curRow = selectedRows[x];
		var curRowName = "";
		var curRowId = "";
		var curRowOrdId = curRow.children[0].innerHTML;
		if ($(curRow).find(".op-cancelled").length > 0) {
			curRowId = curRow.id;
			$(curRow).children().each(function() {
				if (this.className === "op-name") {
					//get the order name, we don't need the order sentence
					curRowName = this.innerHTML.slice(0, this.innerHTML.indexOf(" <span"));
				}
				if ($(this).hasClass("op-cancelled")) {
					$(this).removeClass("op-cancelled");
				}
			});
			scratchpadObj.favId = curRowId;
			scratchpadObj.favName = curRowName;
			scratchpadObj.favParam = "0.0|0|0.0";
			scratchpadObj.ordAction = "clear";
			scratchpadObj.ordId = curRowOrdId;
			//remove this order from the scratchpad
			dataObj = component.addRemoveFromScratchpad(scratchpadObj, true);
		}
		$(curRow).removeClass("op-row-selected");

		//check to see if any instance of this component is still dirty after removing one scratchpad object
		if (dataObj) {
			var componentIsDirty = false;
			var scratchpadArr = dataObj.scratchpadObjArr;
			if (scratchpadArr) {
				var idx = scratchpadArr.length;
				while (idx--) {
					if (scratchpadArr[idx].componentId == compId) {
						componentIsDirty = true;
						break;
					}
				}
			}
			if (!componentIsDirty) {
				component.checkPendingSR(compId, 0);
			}
		}

		component.updateOrderArrays(curRowOrdId, "clear");
	}
	component.clearSelectedRows();
	component.hideSidePanel();
};

/**
 * Updates the global order array to handle any modified css classes that have been added due to actions being taken on the order
 * @param {string} orderId : The order id associated with the row that was clicked
 * @param {string} action : A string that designates the type of action placed on the clicked row
 * @param {boolean} checkedInd : Optional boolean value that is passed if the order was selected via the multi-select check box
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.updateOrderArrays = function(orderId, action, checkedInd) {
	var ordersArrLen = this.opOrdersArray.length;

	for (var m = 0; m < ordersArrLen; m++) {
		var curOrder = this.opOrdersArray[m];
		if (orderId == curOrder.ORDER_ID) {
			if (action === "select") {
				if (curOrder.SELECTED && !checkedInd) {
					//only remove this if the check box wasn't clicked while the row was selected
					curOrder.SELECTED = !curOrder.SELECTED;
				} else {
					curOrder.SELECTED = true;
				}
				if (checkedInd) {
					curOrder.CHECKBOX_HTML = "<input type='checkbox' checked='true'>";
				} else {
					curOrder.CHECKBOX_HTML = "<input type='checkbox'>";
				}
				break;
			} else if (action === "clear") {
				curOrder.SELECTED = false;
				curOrder.CHECKBOX_HTML = "<input type='checkbox'>";
				if (curOrder.CANCELED) {
					curOrder.CANCELED = !curOrder.CANCELED;
					//remove the order id from the component level array
					this.markedOrders.splice(this.markedOrders.indexOf(curOrder.ORDER_ID), 1);
					break;
				}
			} else {
				//cancel action
				curOrder.SELECTED = false;
				curOrder.CHECKBOX_HTML = "<input type='checkbox'>";
				if (!curOrder.CANCELED) {
					curOrder.CANCELED = true;
					if (this.markedOrders.indexOf(curOrder.ORDER_ID) === -1) {
						//order does not exist in component level array
						this.markedOrders.push(curOrder.ORDER_ID);
						break;
					}
				}
			}
		}
	}
};

/**
 * Clears all currently selected rows in the table
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.clearSelectedRows = function() {
	var compId = this.getComponentId();
	var contentBody = $("#opContent" + compId);
	var selectedRows = contentBody.find(".op-row-selected");
	var selRowLen = selectedRows.length;

	for (var x = 0; x < selRowLen; x++) {
		var cur = selectedRows[x];
		var curOrdId = cur.children[0].innerHTML;

		$(cur).removeClass("op-row-selected");
		this.updateOrderArrays(curOrdId, "select");
	}

	//un check all check boxes
	this.compTableContainer.find("input:checkbox").attr("checked", false);
};

/**
 * Handle the response from mp_get_order_history after changing filter sets
 * Calls the renderComponent function if data is successfully retrieved.
 * Render the component by handling Error response if the status is "F"
 * Render the component by handling No Data response if the status is "Z"
 * @this {OrderProfileComponent}
 * @param {reply} reply struct of data retrieved by mp_get_order_history
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.handleFilteredResults = function(reply) {
	var component = reply.getComponent();
	var compId = component.getComponentId();
	var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
	var errMsg = [];
	try {
		var IsAllowDailyRreview = component.getAllowDailyReview();
		var criterion = component.getCriterion();
		var userTimeZone = criterion.client_tz;
		var person_id = criterion.person_id;
		var encounter_id = criterion.encntr_id;
		var provider_id = criterion.provider_id;
		var opReviewObj = new OrderProfileOrderReview(compId);
		component.setDailyReviewObj(opReviewObj);
		opReviewObj.setScriptRequestParams({PERSON_ID : person_id, ENCOUNTER_ID : encounter_id, PRSNL_ID : provider_id});
		opReviewObj.setTimeZone(userTimeZone);
		// Set response to component data
		component.setOPData(reply.getResponse());
		//Gap Check required functionality will be validated to display indicators
		component.updateSatisfierRequirementIndicator();
		if (reply.getStatus() === "S") {
			if(IsAllowDailyRreview){
				opReviewObj.getQualifiedDailyOrders(function(){
					component.renderComponent(reply.getResponse(), component);
				});
			}else{
				component.renderComponent(reply.getResponse(), component);
			}
		} else {
			var countText = "(0)";
			errMsg = [];

			if (reply.getStatus() === "F") {
				errMsg.push(reply.getError());
				MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("<br />")), component, countText);
			} else {
				//There are no active orders, however, we still want to render the controls if there are inactive orders
				if(IsAllowDailyRreview){
					opReviewObj.getQualifiedDailyOrders(function(){
						component.renderComponent(reply.getResponse(), component);
					});
				}else{
					component.renderComponent(reply.getResponse(), component);
				}
			}
			// update count text in the navigation pane
			CERN_EventListener.fireEvent(component, component, EventListener.EVENT_COUNT_UPDATE, {
				"count": 0
			});
		}
	} catch(err) {
		if (timerRenderComponent) {
			timerRenderComponent.Abort();
			timerRenderComponent = null;
		}
		errMsg = [];
		if ( err instanceof Error) {
			errMsg.push("<b>", i18n.CONTACT_ADMINISTRATOR, "</b><br><ul><li>", i18n.MESSAGE, ": ", err.message, "</li></ul>");
			MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, "");
		}
		MP_Util.LogJSError(err, null, "order-profile-o1.js", "handleFilteredResults");
		throw err;
	} finally {
		if (timerRenderComponent) {
			timerRenderComponent.Stop();
		}
	}
};

/**
 * This function is called whenever the scratchpad object removes an order action
 * @this {OrderProfileComponent}
 * @param {removeObject} the order object that has been removed by the scratchpad
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.undoOrderAction = function(event, removeObject) {
	this.scratchpadRemovedOrderAction(removeObject);
};

/**
 * This function is called whenever the scratchpad object has an order action added to it or removed from it
 * @this {OrderProfileComponent}
 * @param {orderAction} the order action object that has been received by the scratchpad
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.updateComponentOrders = function(event, orderAction) {
	this.scratchpadReceivedOrderAction(orderAction);
};

/**
 * This function will initialize the Pending Shared Resource object if it does not exist.
 */
OrderProfileComponent.prototype.initPendingSR = function(component) {
	var srObj = null;
	var dataObj = {};
	var pendingSR = MP_Resources.getSharedResource("pendingDataSR");
	if (!pendingSR) {
		srObj = new SharedResource("pendingDataSR");
		//Create the object that will be stored in the SharedResource
		dataObj.pendingDataObj = window.external.DiscernObjectFactory("PVFRAMEWORKLINK");
		dataObj.pendingDataCompArr = [];
		//Set the available flag to true
		srObj.setIsAvailable(true);
		//Set the shared resource data object
		srObj.setResourceData(dataObj);
		//Add the shared resource so other components can access it
		MP_Resources.addSharedResource("pendingDataSR", srObj);
	} else {
		//The shared resource exists
		dataObj = pendingSR.getResourceData();
		var idx = dataObj.pendingDataCompArr.length;
		//Since the shared resource exists ONLY remove the current component from pending Array as other components may contain pending data.
		while (idx--) {
			//From testing JS wants to convert the componentID to string when added to the pendingDataCompArr.  DON'T change to '==='.
			if (component.getComponentId() == dataObj.pendingDataCompArr[idx]) {
				dataObj.pendingDataCompArr.splice(idx, 1);
				break;
			}
		}
		//Update the shared resource with current data.
		MP_Resources.setSharedResourceData("pendingDataSR", dataObj);
	}
	//If components contain pending data notify the Powerchart framework
	dataObj.pendingDataObj.SetPendingData(dataObj.pendingDataCompArr.length === 0 ? 0 : 1);
};

/**
 * Create scratchpad Shared Resource.
 * @param {string} sharedResourceName : The name of the shared resource to create
 * @return {Object} srObj : Scratchpad shared resource object
 */
OrderProfileComponent.prototype.initScratchpadSR = function(sharedResourceName) {
	var srObj = null;
	var dataObj = {};
	srObj = new SharedResource(sharedResourceName);
	//Create the object that will be stored in the SharedResource
	dataObj.scratchpadObjArr = [];
	//Set the available flag to true
	srObj.setIsAvailable(true);
	//Set the shared resource data object
	srObj.setResourceData(dataObj);
	//Set the shared resource event listener object
	var object = {};
	srObj.setEventListenerObject(object);
	//Set the shared resource event listener flag
	srObj.setEventListenerFlag(EventListener.EVENT_SCRATCHPAD_COUNT_UPDATE);
	//Add the shared resource so other components can access it
	MP_Resources.addSharedResource(srObj.getName(), srObj);
	return srObj;
};
/**
 * This function removes the cancelled css class when an order action is removed from the scratchpad
 * @param {OrderProfileComponent} component : This instance of the component
 * @param {object} removeObject : The order object that was removed from the scratchpad
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.scratchpadRemovedOrderAction = function(removeObject) {
	var compId = this.getComponentId();
	var contentBody = $("#opContent" + compId);
	var canceledRows = contentBody.find(".op-cancelled");
	var xl = canceledRows.length;
	var cnclOrder = null;

	//find the row that is marked and needs to be unmarked
	for (var x = 0; x < xl; x++) {
		var curCell = canceledRows[x];
		if (curCell.parentNode.children[0].innerHTML === removeObject.favSynId) {
			cnclOrder = curCell.parentNode;
			break;
		}
	}

	if (cnclOrder) {
		//order found, un-mark it
		var cnclOrdId = cnclOrder.children[0].innerHTML;
		$(cnclOrder).children().each(function() {
			if ($(this).hasClass("op-cancelled")) {
				$(this).removeClass("op-cancelled");
			}
		});
		//check if this row was highlighted, if so...remove the highlight
		if ($(cnclOrder).hasClass("op-row-selected")) {
			$(cnclOrder).removeClass("op-row-selected");
			//we also need to disable the "Clear" button
			$("#opResetBtn" + compId).addClass("disabled");
		}
		this.updateOrderArrays(cnclOrdId, removeObject.ordAction);
	}
};

/**
 *  This function is called whenever an instance of Order Profile adds or removes an order action to the scratchpad.
 * @param {OrderProfileComponent} component : This instance of the component
 * @param {object} orderAction :  The order action object that was received by the scratchpad
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.scratchpadReceivedOrderAction = function(orderAction) {
	var compId = this.getComponentId();
	var contentBody = $("#opContent" + compId);
	var ordersArr = contentBody.find(".result-info");
	var ordersArrLen = ordersArr.length;
	var orderCompId = parseInt(orderAction.favId.match(/\d+/), 10);
	var canceledRow = 0;
	var clearBtn = $("#opResetBtn" + compId);
	var cancelBtn = $("#opCancelBtn" + compId);
	var selectedRows = contentBody.find(".op-row-selected");
	var selectedRowsLength = selectedRows.length;

	if (compId !== orderCompId) {
		for (var x = 0; x < ordersArrLen; x++) {
			var curOrd = ordersArr[x];
			var curOrdId = curOrd.children[0].innerHTML;
			if (curOrdId === orderAction.ordId) {
				//order id found, mark as cancelled
				if (!$(curOrd).attr("ORDID")) {
					$(curOrd).attr("ORDID", curOrdId);
				}
				$(curOrd).children().each(function() {
					if (this.innerText.length > 1 && this.id.indexOf("ORDER_ID") === -1 && this.id.indexOf("ORDER_SYN_ID") === -1) {
						if ($(this).hasClass("op-cancelled")) {
							$(this).removeClass("op-cancelled");
						} else {
							$(this).addClass("op-cancelled");
						}
					}
				});
				this.updateOrderArrays(curOrdId, orderAction.ordAction);
				break;
			}
		}
		selectedRows.each(function() {
			if ($(this).find(".op-cancelled").length > 0) {
				canceledRow++;
			}
		});
		if (canceledRow > 0 && canceledRow < selectedRowsLength) {
			//at least one of the previously selected rows is marked for cancel, ensure both buttons are enabled
			clearBtn.removeClass("disabled");
			cancelBtn.removeClass("disabled");
		} else if (canceledRow > 0 && canceledRow === selectedRowsLength) {
			//all previously selected rows are marked for cancel, enable clear button and disable cancel button
			clearBtn.removeClass("disabled");
			cancelBtn.addClass("disabled");
		} else if (canceledRow === 0 && selectedRowsLength > 0) {
			//none of the previously selected rows are marked for cancel, enable cancel button and disable clear button
			clearBtn.addClass("disabled");
			cancelBtn.removeClass("disabled");
		}
	}
};

/**
 * Toggle the pending data flag used by the PVFRAMEWORKLINK discernobject factory object.
 * @param {char} compId : The New Order Entry component_id
 * @param {boolean} pendingInd : true = current component has pending data.  Prompt the user before they navigate away from the chart
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.checkPendingSR = function(compId, pendingInd) {
	var srObj = null;
	var dataObj = {};
	//Get the shared resource
	srObj = MP_Resources.getSharedResource("pendingDataSR");

	if (srObj) {
		//Retrieve the object from the shared resource.
		dataObj = srObj.getResourceData();
		if (dataObj) {
			var pendingArr = dataObj.pendingDataCompArr;
			if (pendingInd) {
				//Add component to the array of pending components.  Keep a distinct list of component ID's
				if (pendingArr.join("|").indexOf(compId) === -1) {
					pendingArr.push(compId);
				}
			} else {
				//The component no longer has pending data.  Remove the component id from the array.
				var idx = pendingArr.length;
				while (idx--) {
					if (pendingArr[idx].indexOf(compId) !== -1) {
						pendingArr.splice(idx, 1);
						break;
					}
				}
			}
			dataObj.pendingDataCompArr = pendingArr;
			//If there are no other components that have pending actions communicate to the PVFRAMEWORKLINK object that there is no pending components.
			dataObj.pendingDataObj.SetPendingData(dataObj.pendingDataCompArr.length === 0 ? 0 : 1);
			//Update the SharedResource.
			MP_Resources.setSharedResourceData("pendingDataSR", dataObj);
		}
	}
};

/**
 * Add or remove scratchpad object to the shared resource array of objects
 * @param {Object} scratchpadObj : Scratchpad object to add or remove
 * @param {boolean} isRemovingObj : true = remove object from scracthpad shared resource. false = add it to scracthpad shared resource
 * @return {Object} dataObj : Scratchpad shared resource data object
 */
OrderProfileComponent.prototype.addRemoveFromScratchpad = function(scratchpadObj, isRemovingObj) {
	var srObj = this.getScratchpadSharedResourceObject();
	var isFromOtherInstance = false;
	var otherInstanceCompId = null;
	if (srObj) {
		var dataObj = srObj.getResourceData();
		if (!dataObj) {
			return null;
		} else {
			var scratchpadArr = dataObj.scratchpadObjArr;
			var isCompDirty = false;
			if (scratchpadArr) {
				if (isRemovingObj) {
					var idx = scratchpadArr.length;
					while (idx--) {
						//check if other instance is dirty
						if (isFromOtherInstance) {
							if (scratchpadArr[idx].componentId == otherInstanceCompId) {
								isCompDirty = true;
								break;
							}
						}
						if (scratchpadArr[idx].ordId == scratchpadObj.ordId) {
							if (scratchpadArr[idx].componentId != this.getComponentId()) {
								//removed an order placed by another instance of Order Profile
								otherInstanceCompId = scratchpadArr[idx].componentId;
								isFromOtherInstance = true;
							}
							scratchpadArr.splice(idx, 1);
						}
					}
					if (!isCompDirty) {
						this.checkPendingSR(otherInstanceCompId, 0);
					}
				} else {
					scratchpadArr.push(scratchpadObj);
				}
			}

			dataObj.scratchpadObjArr = scratchpadArr;

			//Update the SharedResource.
			MP_Resources.setSharedResourceData(srObj.getName(), dataObj);

			//notify consumers that something has been added to or deleted from the shared resource
			srObj.notifyResourceConsumers(isRemovingObj, scratchpadObj);

			return dataObj;
		}
	}
};

/**
 * Get Scratchpad Shared Resource object
 * @return {Object} srObj : Scratchpad shared resource object
 */
OrderProfileComponent.prototype.getScratchpadSharedResourceObject = function() {
	var srObj = null;
	var sharedResourceName = "scratchpadSR";
	//Get the shared resource
	srObj = MP_Resources.getSharedResource(sharedResourceName);
	if (!srObj) {
		srObj = this.initScratchpadSR(sharedResourceName);
	}
	return srObj;
};

/**
 * Build the advanced filters drop down menu and load the filter entries for each set
 * @param {OrderProfileComponent} component : This instance of the Order Profile Component
 * @param {array} prefRec : The array that holds the available default filter prefs
 * @return null
 */

OrderProfileComponent.prototype.buildPrefSelector = function(prefRec) {
	var compId = this.getComponentId();
	var opi18n = i18n.discernabu.order_profile_o1;
	var filterPrefs = null;
	var controlsDiv = $("#ordProfControls" + compId);
	var selectHTML = [];
	var prefArr = [];
	var thisGroupPref = null;
	var idx = 2;

	if (prefRec) {
		filterPrefs = prefRec.PREF_GROUPS;
		this.hasPriv = prefRec.CANCEL_ORDER_PRIV;
		this.hasException = prefRec.HAS_EXCEPTION;
	}

	//set up the default filter option (All Active Orders)
	thisGroupPref = {
		activeallind: "1",
		activedays: "0",
		activedaysind: "0",
		ambulatoryordertypeind: "1",
		checkmarkbitmask: "63",
		documentedmedsordertypeind: "1",
		filterdisplayname: opi18n.ALL_ACTIVE,
		filterordertype: "0",
		inactiveallind: "1",
		inactivedays: "0",
		inactivedaysind: "0",
		inpatientordertypeind: "1",
		prescriptionordertypeind: "1"
	};

	prefArr.push(thisGroupPref);

	//push the html for the drop down and add the default filter (All Active Orders)
	selectHTML.push("<span class='op-filters'>", opi18n.SHOW, "</span><select id='opAdvFilters", compId, "'><option value='1'>", opi18n.ALL_ACTIVE, "</option>");

	//loop through the filters retrieved from PreferenceManager
	if (filterPrefs) {
		var groupLen = filterPrefs.length;
		for (var x = 0; x < groupLen; x++) {
			var entryLen = filterPrefs[x].ENTRIES.length;
			thisGroupPref = {};
			for (var y = 0; y < entryLen; y++) {
				var curEntry = filterPrefs[x].ENTRIES[y];
				//add the entry to the data structure
				thisGroupPref[curEntry.ENTRY_NAME] = curEntry.VAL;
			}
			/*
			 * Medication Criteria Indicators (medCriteria)
			 * None = 0
			 * Inpatient = 1
			 * Prescription = 2
			 * Ambulatory = 32
			 * 35 = Inpatient + Prescription + Ambulatory
			 *
			 * Order Status Indicators
			 * Active:
			 * None = 0
			 * Ordered = 1
			 * Inprocess = 2
			 * Future = 4
			 * Incomplete = 8
			 * Suspended = 16
			 * On Hold, Med Student = 32
			 * Inactive:
			 * Discontinued = 64
			 * Cancelled = 128
			 * Completed = 256
			 * Pending Complete = 512
			 * Voided = 1024
			 * Voided With Results = 2048
			 * Transfer/Cancelled = 4096
			 * 63 = Active Orders (Ordered + Inprocess + Future + Incomplete + Suspended + On Hold, Med Student)
			 * 8128 = Inactive Orders (Discontinued, Cancelled, Completed, Pending Complete, Voided, Voided With Results, Transfer/Cancelled)
			 */

			if ((thisGroupPref.checkmarkbitmask == 63 || thisGroupPref.checkmarkbitmask == 8128) && thisGroupPref.activeallind == 1 && thisGroupPref.inactiveallind == 1 && thisGroupPref.filterordertype == 0) {
				//Filter passed initial check for All Active Orders or All Inactive Orders, now check venues
				if (thisGroupPref.ambulatoryordertypeind == 1 || thisGroupPref.documentedmedsordertypeind == 1 || thisGroupPref.inpatientordertypeind == 1 || thisGroupPref.prescriptionordertypeind == 1) {
					//Filter has venue types set, check for all venue indicators
					if (!(thisGroupPref.ambulatoryordertypeind == 1 && thisGroupPref.documentedmedsordertypeind == 1 && thisGroupPref.inpatientordertypeind == 1 && thisGroupPref.prescriptionordertypeind == 1)) {
						//this filter does not match the hardcoded filters, add it to the list
						selectHTML.push("<option value='", idx, "'>", thisGroupPref.filterdisplayname, "</option>");
						idx++;
					}
				}
			} else {
				if (thisGroupPref.ambulatoryordertypeind == 0 && thisGroupPref.documentedmedsordertypeind == 0 && thisGroupPref.inpatientordertypeind == 0 && thisGroupPref.prescriptionordertypeind == 0) {
					//this filter was built without any venues selected, default all of these to 1
					thisGroupPref.ambulatoryordertypeind = 1;
					thisGroupPref.documentedmedsordertypeind = 1;
					thisGroupPref.inpatientordertypeind = 1;
					thisGroupPref.prescriptionordertypeind = 1;
				}
				//add the filter name to the drop down menu
				selectHTML.push("<option value='", idx, "'>", thisGroupPref.filterdisplayname, "</option>");
				idx++;
			}
			prefArr.push(thisGroupPref);
		}
	}
	//setup the Inactive Orders filter set
	thisGroupPref = {
		activeallind: "1",
		activedays: "0",
		activedaysind: "0",
		ambulatoryordertypeind: "1",
		checkmarkbitmask: "8128",
		documentedmedsordertypeind: "1",
		filterdisplayname: opi18n.ALL_INACTIVE,
		filterordertype: "0",
		inactiveallind: "1",
		inactivedays: "0",
		inactivedaysind: "0",
		inpatientordertypeind: "1",
		prescriptionordertypeind: "1"
	};

	prefArr.push(thisGroupPref);

	//add the inactive orders filter to the drop down (this will always be the last filter in the list)
	selectHTML.push("<option value='", idx, "'>", opi18n.ALL_INACTIVE, "</option></select>");

	this.opFiltersArray = prefArr;
	controlsDiv.append(selectHTML.join(""));

	this.addHdrEvents(compId);
};

/**
 * Adds event handlers to filter controls and column headers
 * @param {number} compId: The component ID number
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.addHdrEvents = function(compId) {
	var component = this;
	var grouperObj = $("#opGroupBy" + compId);
	var pendingOrdObj = $("#opPendingOrders" + compId);
	var pendingInd = pendingOrdObj.is(":checked");
	var advFilterObj = $("#opAdvFilters" + compId);
	var headerDiv = $("#ordProfileHdr" + compId);
	var hdrColArr = headerDiv.find(".sort-option");
	var cancelBtn = $("#opCancelBtn" + compId);
	var resetBtn = $("#opResetBtn" + compId);
	var compTable = null;
	var contentDiv = component.compTableContainer;

	//add listener to pending order checkbox
	pendingOrdObj.click(function() {
		var pendingOrdTimer = MP_Util.CreateTimer("CAP:MPG OP-o1_pending_orders");
		if (pendingOrdTimer) {
			pendingOrdTimer.Start();
			pendingOrdTimer.Stop();
		}

		//clear all currently selected rows & close side panel if it is displayed
		component.clearSelectedRows();

		if (component.showPanel) {
			component.hideSidePanel();
		}

		//make sure actions buttons are disabled
		cancelBtn.addClass("disabled");
		resetBtn.addClass("disabled");

		var groupByVal = parseInt(grouperObj.val(), 10);
		pendingInd = pendingOrdObj.is(":checked");
		switch(groupByVal) {
			case 2:
				compTable = component.getVenueTable(pendingInd);
				break;
			case 3:
				compTable = component.getDateTimeTable(pendingInd);
				break;
			default:
				compTable = component.getCategoryTable(pendingInd);
				break;
		}
		//apply group subsection expand/collapse prefs
		component.applyExpandCollapsePreferences(compTable);
		//apply ComponentTable override functions
		component.compTableOverrides(compTable);
		//set the new table as the current component table
		component.setComponentTable(compTable);
		//inject new compTable html into the content body
		contentDiv.html(compTable.render());
		compTable.finalize();
		component.resizeComponent();
	});

	//add listeners to group drop down
	grouperObj.change(function() {
		var groupTimer = MP_Util.CreateTimer("CAP:MPG OP-o1_group_filter");
		if (groupTimer) {
			groupTimer.Start();
			groupTimer.Stop();
		}

		//clear all currently selected rows & close side panel if it is displayed
		component.clearSelectedRows();
		if (component.showPanel) {
			component.hideSidePanel();
		}

		//save group by selection prefs
		var userPrefs = component.getGroupByPrefs();
		component.setPreferencesObj(userPrefs);
		component.savePreferences(true);

		//make sure the action buttons are disabled
		cancelBtn.addClass("disabled");
		resetBtn.addClass("disabled");

		var choice = parseInt($(this).val(), 10);
		pendingInd = pendingOrdObj.is(":checked");
		switch(choice) {
			case 2:
				compTable = component.getVenueTable(pendingInd);
				break;
			case 3:
				compTable = component.getDateTimeTable(pendingInd);
				break;
			default:
				compTable = component.getCategoryTable(pendingInd);
				break;
		}
		//apply group subsection expand/collapse prefs
		component.applyExpandCollapsePreferences(compTable);
		//apply ComponentTable override functions
		component.compTableOverrides(compTable);
		//set the new table as the current component table
		component.setComponentTable(compTable);
		//inject compTable html into the content body
		contentDiv.html(compTable.render());
		compTable.finalize();
		component.resizeComponent();
	});
	//add listeners to advanced filters drop down
	advFilterObj.change(function() {
		var filterTimer = MP_Util.CreateTimer("CAP:MPG OP-o1_filter_results");
		if (filterTimer) {
			filterTimer.Start();
			filterTimer.Stop();
		}
		var selection = advFilterObj.children("option:selected").text();

		//make sure action buttons are disabled
		cancelBtn.addClass("disabled");
		resetBtn.addClass("disabled");

		if (component.showPanel) {
			component.hideSidePanel();
		}

		component.getFilteredData(selection);
	});
};

/**
 * Creates an empty container element that will be used to hold the html for an AlertMessage control
 * @param {number} compId : The unique id for this instance of the Order Profile component
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.createHomeMedicationsDisclaimer = function(compId) {
	var hmDisclaimerDiv = _g("opHomeMedsDisclaimer" + compId);
	if (hmDisclaimerDiv) {
		//element exists, do nothing
		return;
	}
	hmDisclaimerDiv = Util.cep("div", {
		"className": "message-container",
		"id": "opHomeMedsDisclaimer" + compId
	});
	var m_contentNode = this.getRootComponentNode();
	if (m_contentNode) {
		var m_contentNodeHd = _gbt("H2", m_contentNode)[0];
		Util.ia(hmDisclaimerDiv, m_contentNodeHd);
	}
};

/**
 * Retrieves a value from the given array. This is used to pull information from a code array based on a string
 * @param {string} name : Name of the value that needs to be retrieved
 * @param {array} array : The array that the value will be pulled from
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.pullObjFromArray = function(name, array) {
	if (array !== null) {
		for (var x = 0, xi = array.length; x < xi; x++) {
			if (array[x].value.meaning == name) {
				return (array[x].value);
			}
		}
	}
	return null;
};

/**
 * Returns the full display for the order's status (including order and departmental status)
 * @param  {Object} order       Object representing the order to display the status of
 * @param  {Object} orderStatus Object representing a CodeValue for order status
 * @returns {String}             String representing the full status
 */
OrderProfileComponent.prototype.getFullStatusDisplay = function(order, orderStatus) {
	var statusDisplay = this.getOrderStatusDisplay(order, orderStatus);
	//Add departmental status to order status if present (present when SHOW_DEPT_STATUS pref is on, and order is non-pharmacy)
	if(order.DEPT_STATUS_DISPLAY) {
		statusDisplay += " (" + order.DEPT_STATUS_DISPLAY + ")";
	}
	return statusDisplay;
};

/**
 * Returns the order status display
 * @param  {Object} order       Object representing the order to display the status of
 * @param  {Object} orderStatus Object representing a CodeValue for order status
 * @returns {String}             String representing the order status
 */
OrderProfileComponent.prototype.getOrderStatusDisplay = function(order, orderStatus) {
	var statusDisplay = "";
	//Use prescribed status for prescription meds that are in ordered status; otherwise use display from code set
	if (order.VENUE.RX_MEDS_IND && orderStatus.meaning === "ORDERED"){
		statusDisplay += i18n.PRESCRIBED;
	}
	else{
		statusDisplay += orderStatus.display;
	}
	return statusDisplay;
};

/**
 * Handles updating the category arrays based on a passed order category
 * @param {Boolean} pendingInd        Returns true if the order category is being added from a pending order
 * @param {Array} categoryArr         Array of categories (departments) to be stored
 * @param {Array} pendingCategoryArr  Array of pending categories (departments) to be stored
 * @param {Object} orderCategory      Code Value for order category to add to pending and normal category arrays
 */
OrderProfileComponent.prototype.addToCategoryArray = function(pendingInd, categoryArr, pendingCategoryArr, orderCategory) {
	function checkForCategoryInArray(catArray, searchCat) {
		var len = catArray.length;
		var x = 0;
		for (x = 0; x < len; x++) {
			if (catArray[x].display === searchCat.display) {
				return true;
			}
		}
		return false;
	};

	if(pendingInd && !checkForCategoryInArray(pendingCategoryArr, orderCategory)) {
		pendingCategoryArr.push(orderCategory);
	}

	if (!checkForCategoryInArray(categoryArr, orderCategory)){
		categoryArr.push(orderCategory);
	}
};

/**
 * Reads the struct returned by mp_get_orders and populates the ordProfile array,
 * then builds the HTML for each row and pushes it onto the opOrdersArray for sorting
 * @param {Object[]} recordData : The array holding the data retrieved by mp_get_order_history
 * @param {Number} compId : The component ID number
 * @returns {undefined} undefined
 */
OrderProfileComponent.prototype.buildOPOrdersArray = function(recordData) {
	var opi18n = i18n.discernabu.order_profile_o1;
	var df = MP_Util.GetDateFormatter();
	var ordProfile = recordData.ORDERS;
	var prsnlArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
	var codesArray = MP_Util.LoadCodeListJSON(recordData.CODES);
	var arrLen = ordProfile.length;
	var pendingStatusesArr = this.getOPPendingOrderStatuses();
	var tempCatArr = [];
	var tempVenueArr = [];
	var tempPendingCatArr = [];
	var markedInd = false;
	var idx = -1;
	var provName = "";
	var provNameFull = "";
	var ordStatus = "";
	var ordDept = "";
	var ordVenue = "";
	var medType = "";
	var deptStatus = "";
	var statusType = "";
	var frequency = "";
	var thisOrderAct = null;
	var x = 0;
	var IVtype = false;
	var tempOrd = this.pullObjFromArray("IVSOLUTIONS", codesArray);
	var inactiveStatuses = ["DISCONTINUED", "CANCELED", "COMPLETED", "PENDING", "DELETED", "VOIDEDWRSLT", "TRANS/CANCEL"];
	var notifyHtml = [];
	var venueHtml = [];
	var fullDateTimeTwoYear = mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR;
	var noResult = "--";
	var pendingInd = false;
	var orderCategory = null;

	this.opOrdersArray = [];
	this.opPendingOrders = [];

	for ( x = 0; x < arrLen; x++) {
		notifyHtml = [];
		venueHtml = [];
		provName = MP_Util.GetValueFromArray(ordProfile[x].PROVIDER_ID, prsnlArray);
		ordStatus = MP_Util.GetValueFromArray(ordProfile[x].STATUS_CD, codesArray);
		ordDept = MP_Util.GetValueFromArray(ordProfile[x].DEPT_CD, codesArray);
		medType = MP_Util.GetValueFromArray(ordProfile[x].MED_ORD_TYPE_CD, codesArray);
		deptStatus = MP_Util.GetValueFromArray(ordProfile[x].DEPT_STATUS_CD, codesArray);
		frequency = MP_Util.GetValueFromArray(ordProfile[x].FREQUENCY_CD, codesArray);
		pendingInd = jQuery.inArray(deptStatus.codeValue, pendingStatusesArr) !== -1;

		//check for any marked orders
		idx = this.markedOrders.indexOf(ordProfile[x].ORDER_ID);
		if (idx !== -1) {
			markedInd = true;
		} else {
			markedInd = false;
		}

		//set default value for ordDept if no clinical category code has been set
		if (ordDept === null) {
			ordDept = this.pullObjFromArray("NONCAT", codesArray);
		}

		//check if the order is active or inactive
		if ($.inArray(ordStatus.meaning, inactiveStatuses) > -1) {
			//order is inactive
			statusType = "inactive";
		} else {
			//order is active
			statusType = "active";
		}

		//check if this order's med type is IV, if so, make sure it's part of the Continuous Infusions category
		if (medType && medType.display === "IV") {
			IVtype = true;
		} else {
			IVtype = false;
		}

		//build HTML string for displaying notification icons
		if (ordProfile[x].PHYS_COSIGN_STATUS_REQ_IND) {
			notifyHtml.push("<span class='opSprite op-cosign' title='", opi18n.COSIGN_HOVER, "'></span>");
		}
		if (ordProfile[x].CARE_PLAN_NAME) {
			notifyHtml.push("<span class='opSprite op-powerplan' title='", ordProfile[x].CARE_PLAN_NAME, "'></span>");
		}
		if (ordProfile[x].ORDER_COMMENT) {
			notifyHtml.push("<span class='op-comments-icon'></span>");
		}

		//build HTML string for displaying venue icon
		if (ordProfile[x].VENUE.DOCUMENTED_IND) {
			if (ordStatus.meaning === "ORDERED") {
				ordStatus.display = i18n.DOCUMENTED;
			}
			ordVenue = opi18n.DOCUMENTED;
			venueHtml.push("<span class='op-doc-icon' title='", opi18n.DOCUMENTED, "'>&nbsp;</span>");
		} else if (ordProfile[x].VENUE.ACUTE_IND) {
			ordVenue = opi18n.INPATIENT;
			venueHtml.push("<span class='op-inpat-icon' title='", opi18n.INPATIENT, "'>&nbsp;</span>");
		} else if (ordProfile[x].VENUE.AMBULATORY_IND) {
			ordVenue = opi18n.AMBULATORY;
			venueHtml.push("<span class='op-amb-icon' title='", opi18n.AMBULATORY, "'>&nbsp;</span>");
		} else if (ordProfile[x].VENUE.RX_MEDS_IND) {
			ordVenue = opi18n.PRESCRIPTION;
			venueHtml.push("<span class='op-rx-icon' title='", opi18n.PRESCRIPTION, "'>&nbsp;</span>");
		} else {
			ordVenue = opi18n.UNSPECIFIED;
			venueHtml.push("<span>&nbsp</span>");
		}

		orderCategory = IVtype ? tempOrd :  ordDept;
		this.addToCategoryArray(pendingInd, tempCatArr, tempPendingCatArr, orderCategory);

		//add venue to array only if it does not already exist
		if ($.inArray(ordVenue, tempVenueArr) === -1) {
			tempVenueArr.push(ordVenue);
		}

		// check if we have a valid provider name. If not, we will have double dashes.
		provNameFull = noResult;
		if (provName !== null && provName.fullName) {
			provNameFull = provName.fullName;
		}

		//create the data structure for the row
		thisOrderAct = {
			ORDER : ordProfile[x].ORDER_NAME,
			ORDER_ID : ordProfile[x].ORDER_ID,
			ORDER_COMMENT : ordProfile[x].ORDER_COMMENT ? ordProfile[x].ORDER_COMMENT : noResult,
			SYNONYM_ID : ordProfile[x].ORDER_SYNONYM_ID,
			STATUS : this.getFullStatusDisplay(ordProfile[x], ordStatus),
			STATUS_MEANING : ordStatus.meaning,
			STATUS_TYPE : statusType,
			ORIGPROV : provNameFull,
			ORD_DETAILS : ordProfile[x].MED_ORD_TYPE_CD !== 0 ? ordProfile[x].SIMPLIFIED_DISPLAY_LINE : ordProfile[x].CLINICAL_DISPLAY_LINE,
			DOSE : ordProfile[x].DOSE ? ordProfile[x].DOSE : noResult,
			ROUTE : ordProfile[x].ROUTE ? ordProfile[x].ROUTE : noResult,
			FREQUENCY : frequency ? frequency.display : noResult,
			START_DTTM_UTC : ordProfile[x].CURRENT_START_DT_TM,
			ORIG_DTTM : df.formatISO8601(ordProfile[x].CURRENT_START_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR),
			STOP_DT_TM : ordProfile[x].CURRENT_STOP_DT_TM ? df.formatISO8601(ordProfile[x].CURRENT_STOP_DT_TM, fullDateTimeTwoYear) : noResult,
			STATUS_UPDT_DTTM_UTC : ordProfile[x].ACTION_DT_TM,
			STATUS_UPDT_DTTM : df.formatISO8601(ordProfile[x].ACTION_DT_TM, fullDateTimeTwoYear),
			DEPT : IVtype ? tempOrd.display : ordDept.display,
			VENUE : ordVenue,
			DEPT_STATUS : deptStatus.codeValue,
			SELECTED : false,
			CANCELED : markedInd,
			NOTIFY_HTML : "",
			VENUE_HTML : "",
			CHECKBOX_HTML : "<input type='checkbox'>"
		};
		thisOrderAct.NOTIFY_HTML = notifyHtml.join("");
		thisOrderAct.VENUE_HTML = venueHtml.join("");
		this.opOrdersArray.push(thisOrderAct);

		if (pendingInd) {
			//this order qualifies as a pending order, push it into the pending orders array as well
			this.opPendingOrders.push(thisOrderAct);
		}

	}

	//sort clinical category array
	function sortCatArray(a, b) {
		if (a.sequence < b.sequence) {
			return -1;
		}
		if (a.sequence > b.sequence) {
			return 1;
		}
		return 0;
	}


	tempCatArr.sort(sortCatArray);
	tempPendingCatArr.sort(sortCatArray);

	//sort venue array
	function sortVenueArray(a, b) {
		if (a.toLowerCase() < b.toLowerCase()) {
			return -1;
		}
		if (a.toLowerCase() > b.toLowerCase()) {
			return 1;
		}
		return 0;
	}


	tempVenueArr.sort(sortVenueArray);

	this.opCatArray = tempCatArr;
	this.opVenueArray = tempVenueArr;
	this.opPendingCatArray = tempPendingCatArr;
};

/**
 * Map the Order Profile object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "WF_ORDER_PROFILE" filter
 */
MP_Util.setObjectDefinitionMapping("WF_ORDER_PROFILE", OrderProfileComponent);
