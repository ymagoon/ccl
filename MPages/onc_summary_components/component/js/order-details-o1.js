/**
 * Create the component style object which will be used to style various aspects of our component
 * @returns {undefined} undefined
 */
function OrderDetailsComponentStyle() {
	this.initByNamespace("od");
}

OrderDetailsComponentStyle.prototype = new ComponentStyle();
OrderDetailsComponentStyle.prototype.constructor = ComponentStyle;

/**
 * constructor
 * Initialize the Order Details Component component
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 * @returns {undefined} undefined
 */
function OrderDetailsComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new OrderDetailsComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.ORDERDETAILS.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.ORDERDETAILS.O1 - render component");

	this.orderDetailsArray = [];
	this.m_lookbackOptions = [];
	this.m_synonymIDs = [];
	this.lookbackUnits = 7;
	this.lookbackType = 2;

	//set the default look back option to 7 days
	this.setLookbackUnits(this.lookbackUnits);
	this.setLookbackUnitTypeFlag(this.lookbackType);
	this.setScope(1);

	//public boolean for loading the first order's details by default
	this.defaultLoad = false;
	this.sidePanel = null;

	this.m_wasListenerAdded = false;
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
OrderDetailsComponent.prototype = new MPageComponent();
OrderDetailsComponent.prototype.constructor = MPageComponent;

/* Supporting functions */

/**
 *This function sets the m_wasListenerAdded flag to the supplied value
 * @param {Boolean} value : The indicator for if the EVENT_ORDER_ACTION listener has been added
 * @returns {undefined} undefined
 */
OrderDetailsComponent.prototype.setWasListenerAdded = function(value) {
	this.m_wasListenerAdded = value;
};

/**
 *This function gets the value of the m_wasListenerAdded flag
 * @return {Boolean} m_wasListenerAdded : The stored event listener added flag.
 */
OrderDetailsComponent.prototype.getWasListenerAdded = function() {
	return this.m_wasListenerAdded;
};

/**
 * This function sets a component level object with the order synonym IDs specified within Bedrock
 * @param  {object} synonymIDs : The order synonym filter object necessary for retrieving and displaying orders
 * @returns {undefined} undefined
 */
OrderDetailsComponent.prototype.setSynonymIDs = function(synonymIDs) {
	this.m_synonymIDs = synonymIDs;
};

/**
 * This function retrieves the stored order synonym IDs that were specified within Bedrock
 * @return {object} m_synonymIDs : The stored order synonym object
 */
OrderDetailsComponent.prototype.getSynonymIDs = function() {
	return this.m_synonymIDs;
};

/**
 * Set the public orderDetailsArray variable with the array of data built from the JSON reply
 * @param {object} arrayObject : The array object built from the JSON reply
 * @returns {undefined} undefined
 */
OrderDetailsComponent.prototype.setDetailsArray = function(arrayObject) {
	this.orderDetailsArray = arrayObject;
};

/**
 * Get the public orderDetailsArray variable that contains the data from the JSON reply
 * @return {object} orderDetailsArray : The public order details array object
 */
OrderDetailsComponent.prototype.getDetailsArray = function() {
	return this.orderDetailsArray;
};

/**
 * The OrdersOptComponent implementation of the resizeComponent.  This function is being overridden because it needs
 * to perform special logic when the component is being resized.
 * @returns {undefined} undefined
 */
OrderDetailsComponent.prototype.resizeComponent = function() {
	//call the base class function
	MPageComponent.prototype.resizeComponent.call(this, null);

	var compTableHeight = $("#od" + this.getComponentId() + "table").css("height");

	if (compTableHeight && this.sidePanel) {
		this.sidePanel.setHeight(compTableHeight);
		this.sidePanel.resizePanel();
	}
};

/**
 * Creates the filterMappings that will be used when loading the component's bedrock settings
 * @returns {undefined} undefined
 */
OrderDetailsComponent.prototype.loadFilterMappings = function() {
	this.addFilterMappingObject("WF_SYNONYM_IDS", {
		setFunction: this.setSynonymIDs,
		type: "ARRAY",
		field: "PARENT_ENTITY_ID"
	});
};

/**
 * This function overwrites the base class function to handle the functionality associated with the look back menu in the component header
 * @returns {undefined} undefined
 */
OrderDetailsComponent.prototype.preProcessing = function() {
	//add default lookback button
	var lookbackMenuItems = this.getLookbackMenuItems() || [];
	var menuItem = new ResultRangeSelection();

	//create the default 7 day lookback item
	menuItem.setUnits("" + this.lookbackUnits + "");
	menuItem.setType(this.lookbackType);
	menuItem.setDisplay(ResultRangeSelectionUtility.getDisplayText(menuItem));

	//remove the default created 'All Visits' look back item
	lookbackMenuItems.pop();

	//add the  default 7 day look back item
	lookbackMenuItems.push(menuItem);

	this.setLookbackMenuItems(lookbackMenuItems);
};

/* Main rendering functions */
/**
 * This is the OrderDetailsComponent implementation of the retrieveComponentData function.
 * It creates the necessary parameter array for the data acquisition script call and the associated Request object.
 * @returns {undefined} undefined
 */
OrderDetailsComponent.prototype.retrieveComponentData = function() {
	var criterion = this.getCriterion();
	var sendAr = [];
	var encntrs = criterion.getPersonnelInfo().getViewableEncounters();
	var encntrsList = (encntrs) ? "value(" + encntrs + ")" : "0.0";
	var lookbackUnits = this.getLookbackUnits();
	var lookbackType = this.getLookbackUnitTypeFlag();
	var orderSynList = this.getSynonymIDs();

	if(this.sidePanel){
		//at this stage there should not be a side panel since we haven't rendered the table yet.
		this.sidePanel = null;
	}

	sendAr.push("^MINE^", criterion.person_id + ".0", encntrsList, criterion.provider_id + ".0", lookbackUnits, lookbackType, criterion.ppr_cd + ".0", MP_Util.CreateParamArray(orderSynList, 1));
	MP_Core.XMLCclRequestWrapper(this, "MP_RETRIEVE_ORDERS_BY_SYNONYM", sendAr, true);
};


/**
 * This function is an override of the MPageComponent level version of the method. It handles any processing that needs to take place
 * after the component has been renderd. 
 * Note: The base function is still called within this new implementation.
 * @returns {undefined} undefined
 */
OrderDetailsComponent.prototype.postProcessing = function() {
	MPageComponent.prototype.postProcessing.call(this);
	
	if(!this.getWasListenerAdded()){
		CERN_EventListener.addListener(this, EventListener.EVENT_ORDER_ACTION, this.retrieveComponentData, this);
		this.setWasListenerAdded(true);
	}
};


/**
 * This is the OrderDetailsComponent implementation of the renderComponent function.  It takes the information retrieved from the script
 * call and renders the component's visuals.
 * @param {MP_Core.ScriptReply} scriptReply - The ScriptReply object returned from the call to MP_Core.XMLCCLRequestCallBack function in the
 * retrieveComponentData function of this object.
 * @returns {undefined} undefined
 */
OrderDetailsComponent.prototype.renderComponent = function(scriptReply) {
	var reply = scriptReply;
	var comp = this;
	var compId = "od" + comp.getComponentId();
	var tableHTML = [];

	//build the results array
	comp.setDetailsArray(comp.buildResultsArray(reply));

	//build HTML for the component table
	tableHTML.push(comp.createComponentTable(comp.getDetailsArray()));

	//add html for side panel container
	tableHTML.push("<div id='" + compId + "SidePanel' class='od-sidepanel-cont'></div>");

	//render the component
	comp.finalizeComponent(tableHTML.join(""));

	comp.initSidePanel();

	//simulate the mouse up event on the first result in the list to load the side panel data.
	var firstResult = $("#" + compId + "tableBody").find(".table-cell")[0];
	if (firstResult) {
		comp.defaultLoad = true;
		$(firstResult).mouseup();
	}
};

/**
 * This function builds an array of objects from the JSON reply
 * @param {object} ordersReply : The JSON reply of orders from mp_retrieve_orders_by_synonym
 * @return {array} ordDetailsArray : The array of objects created from the JSON reply
 */
OrderDetailsComponent.prototype.buildResultsArray = function(ordersReply) {
	var i18nOD = i18n.discernabu.orderDetails;
	var df = MP_Util.GetDateFormatter();
	var ordReplyArr = ordersReply.ORDERS;
	var ordersLen = ordReplyArr.length;
	var codesArray = MP_Util.LoadCodeListJSON(ordersReply.CODES);
	var prsnlArray = MP_Util.LoadPersonelListJSON(ordersReply.PRSNL);
	var inactiveStatuses = ["DISCONTINUED", "CANCELED", "COMPLETED", "PENDING", "DELETED", "VOIDEDWRSLT", "TRANS/CANCEL"];
	var thisOrderObj = null;
	var ordDetailsArray = [];
	var ordStatus = "";
	var prsnl = "";
	var statusType = "";
	var statusDisp = "";
	var venueType = "";
	var idx = 0;

	for ( idx = 0; idx < ordersLen; idx++) {
		var curEntry = ordReplyArr[idx];
		var isRx = false;
		var isDocMed = false;
		var ordStatusTxt = "";
		//get the order status info
		ordStatus = MP_Util.GetValueFromArray(curEntry.CORE.STATUS_CD, codesArray);
		prsnl = MP_Util.GetValueFromArray(curEntry.CORE.RESPONSIBLE_PROVIDER_ID, prsnlArray);

		//check if the order is active, future, or inactive
		if ($.inArray(ordStatus.meaning, inactiveStatuses) > -1) {
			//order is inactive
			statusType = "INACTIVE";
			statusDisp = i18nOD.INACTIVE_ORDERS;
		} else if (ordStatus.meaning === "FUTURE") {
			//order will be displayed under future subsection
			statusType = "FUTURE";
			statusDisp = i18nOD.FUTURE_ORDERS;
		} else {
			//order is active
			statusType = "ACTIVE";
			statusDisp = i18nOD.ACTIVE_ORDERS;
		}

		//determine the venue type
		if (curEntry.MEDICATION_INFORMATION.ORIGINALLY_ORDERED_AS_TYPE.DOCUMENTED_IND) {
			if(ordStatus.meaning === "ORDERED"){
				isDocMed = true;
			}
			venueType = i18nOD.DOCUMENTED;
		} else if (curEntry.VENUE.ACUTE_IND) {
			venueType = i18nOD.INPATIENT;
		} else if (curEntry.VENUE.AMBULATORY_IND) {
			venueType = i18nOD.AMBULATORY;
		} else if (curEntry.VENUE.RX_MEDS_IND) {
			if(ordStatus.meaning === "ORDERED"){
				isRx = true;
			}
			venueType = i18nOD.PRESCRIPTION;
		} else {
			venueType = i18nOD.UNSPECIFIED;
		}

		//determine the proper order status text to display
		if(isDocMed){
			ordStatusTxt = i18n.DOCUMENTED;
		}
		else if(isRx){
			ordStatusTxt = i18n.PRESCRIBED;
		}
		else{
			ordStatusTxt = ordStatus.display;
		}

		//set the data object for this particular order
		thisOrderObj = {
			ORDER: (curEntry.DISPLAYS.DISPLAY_PREF_NAME) ? curEntry.DISPLAYS.DISPLAY_PREF_NAME : curEntry.DISPLAYS.CLINICAL_NAME,
			ORDER_ID: curEntry.CORE.ORDER_ID,
			ORDER_DISPLAY_LINE: curEntry.DISPLAYS.CLINICAL_DISPLAY_LINE,
			ORDERING_PROVIDER: (prsnl) ? prsnl.fullName : "--",
			ORDER_START_DT_TM: df.formatISO8601(curEntry.SCHEDULE.CURRENT_START_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR),
			ORDER_START_DT_TM_UTC: curEntry.SCHEDULE.CURRENT_START_DT_TM,
			ORDER_STATUS: ordStatusTxt,
			ORDER_STATUS_TYPE: statusType,
			ORDER_STATUS_DISP: statusDisp,
			VENUE_TYPE: venueType
		};

		ordDetailsArray.push(thisOrderObj);
	}

	function sortByStatusType(a, b){
		if (a.ORDER_STATUS_TYPE < b.ORDER_STATUS_TYPE) {
			return -1;
		}
		if (a.ORDER_STATUS_TYPE > b.ORDER_STATUS_TYPE) {
			return 1;
		}
		return 0;
	}

	ordDetailsArray.sort(sortByStatusType);

	return ordDetailsArray;
};

/**
 * This function creates the main display of results using the ComponentTable API
 * @param {array} orderResultsObjArr : The array of order objects built from the JSON reply
 * @return {string} orderDetailsTable.render() : The HTML string for the order details component table
 */
OrderDetailsComponent.prototype.createComponentTable = function(orderResultsObjArr) {
	var i18nOD = i18n.discernabu.orderDetails;
	var comp = this;
	var compNS = comp.getStyles().getId();
	var compId = comp.getComponentId();
	var odResults = orderResultsObjArr;
	var orderDetailsTable = new ComponentTable();
	var clickExtension = new TableCellClickCallbackExtension();
	var colArr = [];
	var idx = 0;

	//set basic options
	orderDetailsTable.setNamespace(compNS);
	orderDetailsTable.setCustomClass("od-sidepanel-adj");
	orderDetailsTable.setZebraStripe(true);

	//create column array
	colArr = [{
		ID: "ORDER",
		CLASS: "od-order-col",
		DISPLAY: i18n.ORDER_NAME,
		SORTABLE: true,
		PRIMARY_SORT: "ORDER",
		SECONDARY_SORT: "ORDER_DISPLAY_LINE",
		RENDER_TEMPLATE: "<span>${ORDER}</span> <span class='det-txt'>${ORDER_DISPLAY_LINE}</span>"
	}, {
		ID: "ORDER_START",
		CLASS: "od-col",
		DISPLAY: i18nOD.ORDER_START,
		SORTABLE: true,
		PRIMARY_SORT: "ORDER_START_DT_TM_UTC",
		SECONDARY_SORT: "ORDER",
		RENDER_TEMPLATE: "${ORDER_START_DT_TM}"
	}, {
		ID: "ORDER_STATUS",
		CLASS: "od-col",
		DISPLAY: i18n.STATUS,
		SORTABLE: true,
		PRIMARY_SORT: "ORDER_STATUS",
		SECONDARY_SORT: "ORDER",
		RENDER_TEMPLATE: "${ORDER_STATUS}"
	}];

	//create columns
	var colLen = colArr.length;
	for ( idx = 0; idx < colLen; idx++) {
		var curCol = colArr[idx];
		var column = new TableColumn();

		column.setColumnId(curCol.ID);
		column.setCustomClass(curCol.CLASS);
		column.setColumnDisplay(curCol.DISPLAY);

		if (curCol.SORTABLE) {
			column.setPrimarySortField(curCol.PRIMARY_SORT);
			column.addSecondarySortField(curCol.SECONDARY_SORT, TableColumn.SORT.ASCENDING);
			column.setIsSortable(curCol.SORTABLE);
		}

		column.setRenderTemplate(curCol.RENDER_TEMPLATE);

		orderDetailsTable.addColumn(column);
	}

	//bind the data
	orderDetailsTable.bindData(odResults);

	//set grouping
	orderDetailsTable.quickGroup("ORDER_STATUS_TYPE", "${ORDER_STATUS_DISP}", false);

	//disable collapse functionality for groups
	if (orderDetailsTable.groupMap && orderDetailsTable.groupMap.ACTIVE) {
		orderDetailsTable.groupMap.ACTIVE.setCanCollapse(false);
	}
	if (orderDetailsTable.groupMap && orderDetailsTable.groupMap.INACTIVE) {
		orderDetailsTable.groupMap.INACTIVE.setCanCollapse(false);
	}
	if (orderDetailsTable.groupMap && orderDetailsTable.groupMap.FUTURE) {
		orderDetailsTable.groupMap.FUTURE.setCanCollapse(false);
	}

	//ensure active orders are displayed before inactive
	if (orderDetailsTable.getGroupSequence()[0] !== "ACTIVE") {
		orderDetailsTable.groupSequence.reverse();
	}

	//set default sorting
	orderDetailsTable.sortByColumnInDirection("ORDER_START", TableColumn.SORT.DESCENDING);

	//set the component table for this component to enable sorting and resizing
	comp.setComponentTable(orderDetailsTable);

	//set up side panel details retrieval click extension
	clickExtension.setCellClickCallback(function(event, data) {
		comp.getSidePanelDetails(event, data);
	});

	orderDetailsTable.addExtension(clickExtension);

	return orderDetailsTable.render();
};

/**
 * Initializes the side panel artifact.
 * @returns {undefined} undefined
 */
OrderDetailsComponent.prototype.initSidePanel = function(){
	var comp = this;
	var compId = comp.getComponentId();

	this.sidePanel = new CompSidePanel(compId, "od" + compId + "SidePanel");
	this.sidePanel.setExpandOption(this.sidePanel.expandOption.EXPAND_DOWN);
	var compTableHeight = $("#od" + compId + "table").height();
	this.sidePanel.setHeight(compTableHeight + "px");
	this.sidePanel.renderSidePanel();
};

/**
 * Retrieves the complete history of the selected order by calling  the mp_retrieve_order_details program
 * @param {event} e : The event that occurred
 * @param {object} data : The associated data to the order row that was clicked
 * @returns {undefined} undefined
 */
OrderDetailsComponent.prototype.getSidePanelDetails = function(e, data) {
	var comp = this;
	var compId = comp.getComponentId();
	var grabDetails = false;
	var mainContentDiv = $("#od" + comp.getComponentId() + "tableBody");
	//grab the row element. the target will always either be a nested span or a child element
	var clickedRow = (e.target.nodeName === "SPAN") ? e.target.parentNode.parentNode : e.target.parentNode;
	var orderData = data.RESULT_DATA;

	//highlight clicked order row
	//only add the highlight class once
	if (comp.defaultLoad) {
		//initial load, use inactive highlight on first row
		$(clickedRow).addClass("od-selected-default");
		comp.defaultLoad = false;
		grabDetails = true;
	} else if ($(clickedRow).hasClass("od-selected-row") === false) {
		if ($(clickedRow).hasClass("od-selected-default") === false) {
			grabDetails = true;
		}
		if (mainContentDiv.find(".od-selected-default").length > 0) {
			//remove default highlight
			mainContentDiv.find(".od-selected-default").removeClass("od-selected-default");
		} else {
			//remove previously selected highlight
			mainContentDiv.find(".od-selected-row").removeClass("od-selected-row");
		}
		$(clickedRow).addClass("od-selected-row");
	}

	if (grabDetails) {
		//render the side panel with the load spinner icon
		this.sidePanel = (this.sidePanel) ? this.sidePanel : new CompSidePanel(compId, "od" + compId + "SidePanel");
		var vertOffset = (this.sidePanel.m_sidePanelContents.outerHeight() - this.sidePanel.m_sidePanelContents.height());
		//if the side panel is currently at its initial height, use that height with a vertical offset for proper alignment. If not, use the height of the side panel contents.
		var loaderDivHeight = (this.sidePanel.m_sidePanelObj.outerHeight() != this.sidePanel.m_height.replace("px", "")) ? this.sidePanel.m_sidePanelContents.height() : (this.sidePanel.m_sidePanelObj.height() - vertOffset);
		this.sidePanel.setFullPanelScrollOn(false);
		//render a full size side panel with a loading indicator in the center. We need to offset the height by 30px for proper alignment
		this.sidePanel.setContents("<div class='loading-spinner' style='height:" + loaderDivHeight + "px;'>&nbsp;</div>", "odContent" + compId);

		//set up the request if a new order was clicked
		var sendAr = ["^MINE^", orderData.ORDER_ID + ".0"];
		var request = new MP_Core.ScriptRequest(this);
		request.setProgramName("MP_RETRIEVE_ORDER_DETAILS");
		request.setParameters(sendAr);
		request.setAsync(true);

		MP_Core.XMLCCLRequestCallBack(null, request, function(reply) {
			var orderName = orderData.ORDER;
			var displayLine = orderData.ORDER_DISPLAY_LINE;
			comp.updateSidePanel(reply, orderName, displayLine);
		});
	}
};

/**
 * Updates the Side Panel information with the action history of the currently selected order
 * @param {object} reply : The JSON object returned from mp_retrieve_order_details
 * @param {string} orderName : The order name passed in from mp_retrieve_orders_by_synonym
 * @param {string} displayLine : The current clinical display line from mp_retrieve_orders_by_synonym
 * @returns {undefined} undefined
 */
OrderDetailsComponent.prototype.updateSidePanel = function(reply, orderName, displayLine) {
	var comp = this;
	var compId = comp.getComponentId();
	var orderData = comp.getDetailsArray();
	var orderDataLen = orderData.length;
	var thisOrderData = null;
	var ordDetailsJSON = reply.getResponse();
	var orderDetails = ordDetailsJSON.ORDER_HISTORY;
	var actionLen = orderDetails.ACTION_CNT;
	var historyDetailsArr = null;
	var sidePanelId = "od" + compId + "SidePanel";
	var orderDetailsSP = (this.sidePanel) ? this.sidePanel : new CompSidePanel(compId, sidePanelId);
	var compTableHeight = $("#od" + compId + "table").height();
	var spHTML = [];
	var commentInd = false;
	var commentIdx = null;
	var actionInfoStr = "";
	var idx = 0;
	var x = 0;

	//grab the matching order data from the results array
	for ( x = 0; x < orderDataLen; x++) {
		if (orderDetails.ORDER_ID === orderData[x].ORDER_ID) {
			thisOrderData = orderData[x];
			break;
		}
	}

	historyDetailsArr = comp.buildDetailsArray(ordDetailsJSON);

	//push side panel header info
	spHTML.push("<div class='od-sp-header'>", orderName, "</div><div class='od-sp-detail-line'>", displayLine, "</div><div class='sp-separator'></div>");

	//push scrollable container
	spHTML.push("<div id='sidePanelScrollContainer" + compId + "' class='od-sp-content'>");

	//push history details
	for ( idx = 0; idx < actionLen; idx++) {
		var thisAction = historyDetailsArr[idx];
		var actionType = thisAction.ACTION_TYPE;

		//check if this action has a comment associated with it
		if(thisAction.COMMENT_IND && !commentInd){
			commentIdx = idx;
			commentInd = true;
			actionType += "<strong style='vertical-align:super;'> &#149;</strong>"; //&#149; is the ascii code for a bullet point
		}

		//build the date/time/provider string
		actionInfoStr = thisAction.ACTION_DT_TM + " (" + thisAction.ACTION_PRSNL + ")";
		//order action type
		spHTML.push("<div class='od-order-action'><ul><li class='od-sp-detail-value'>", actionType, "</li><li class='od-sp-detail-line'>", thisAction.CLINICAL_DISP_LINE, "</li><li class='od-sp-action-info'>", actionInfoStr, "</li></ul></div>");
	}
	//close scroll container div and add separator
	spHTML.push("<div class='sp-separator'></div>");

	//push encounter type, ordering physician, and comments (if any)
	spHTML.push("<div class='od-sp-orig-details'><div class='od-sp-detail-line'><span>", i18n.TYPE, "</span><span>", i18n.ORDERING_PHYSICIAN, "</span></div>");
	spHTML.push("<div class='od-sp-detail-value'><span>", thisOrderData.VENUE_TYPE, "</span><span>", thisOrderData.ORDERING_PROVIDER, "</span></div>");

	//push the comment info if one exists
	if (commentInd) {
		var commentLabel = "<strong style='vertical-align:super;'>&#149; </strong>" + i18n.COMMENTS; //&#149; is the ascii code for a bullet point
		spHTML.push("<div class='od-sp-comments'>");
		spHTML.push("<ul><li class='od-sp-comment-detail'>", commentLabel, "</li><li class='od-sp-detail-value'>", historyDetailsArr[commentIdx].COMMENT, "</li></ul></div>");
	}
	spHTML.push("</div></div>");

	//set side panel content with selected order details
	orderDetailsSP.setFullPanelScrollOn(true);
	orderDetailsSP.setContents(spHTML.join(""), "odContent" + compId);
	//resize side panel if it's height is less than the component table's
	if(orderDetailsSP.m_sidePanelObj.height() <= compTableHeight && orderDetailsSP.m_expCollapseIconObj.hasClass("sp-collapse")){
		orderDetailsSP.expandCollapseSidePanel();
	}
};

/**
 * Builds an object array from the order history details JSON that passed back from mp_retrieve_order_details
 * @param {object} detailsJSON : The order history details JSON
 * @return {array}  detailsArray : The array object containing the order details data
 */
OrderDetailsComponent.prototype.buildDetailsArray = function(detailsJSON) {
	var orderHistoryJSON = detailsJSON.ORDER_HISTORY;
	var orderActions = orderHistoryJSON.ACTIONS;
	var prsnlList = MP_Util.LoadPersonelListJSON(detailsJSON.PRSNL);
	var actionLen = orderHistoryJSON.ACTION_CNT;
	var df = MP_Util.GetDateFormatter();
	var thisOrderAction = null;
	var detailsArray = [];
	var actnDtTm = "";
	var ordDtTm = "";
	var actionProv = "";
	var orderProv = "";
	var idx = 0;

	for ( idx = 0; idx < actionLen; idx++) {
		var actnDate = new Date();
		var ordDate = new Date();
		var curAction = orderActions[idx];
		//grab the personnel info
		actionProv = MP_Util.GetValueFromArray(curAction.ACTION_PERSONNEL_ID, prsnlList);
		orderProv = MP_Util.GetValueFromArray(curAction.ORDER_PROVIDER_ID, prsnlList);

		//format the dates
		actnDate.setISO8601(curAction.ACTION_DT_TM);
		actnDtTm = actnDate.format("mediumDate") + " " + actnDate.format("militaryTime");
		ordDate.setISO8601(curAction.ORDER_DT_TM);
		ordDtTm = ordDate.format("mediumDate") + " " + ordDate.format("militaryTime");

		//create the data object for this action
		thisOrderAction = {
			ACTION_DT_TM: actnDtTm,
			ACTION_DT_TM_UTC: actnDate,
			ACTION_PRSNL: (actionProv.fullName) ? actionProv.fullName : "--",
			ACTION_TYPE: (curAction.ACTION_TYPE_DESC) ? curAction.ACTION_TYPE_DESC : "--",
			CLINICAL_DISP_LINE: (curAction.CLINICAL_DISP_LINE) ? curAction.CLINICAL_DISP_LINE : "--",
			COMMENT_IND: curAction.COMMENT_FLAG,
			COMMENT: curAction.COMMENT_TEXT,
			COMMUNICATION_TYPE: curAction.COMMUNICATION_TYPE_DISP,
			ORDER_DETAIL_LINE: (curAction.ORDER_DETAIL_LINE) ? curAction.ORDER_DETAIL_LINE : "--",
			ORDER_DT_TM: ordDtTm,
			ORDER_DT_TM_UTC: ordDate,
			ORDER_PRSNL: (orderProv) ? orderProv.fullName : "--"
		};

		detailsArray.push(thisOrderAction);
	}

	function sortDetailsByDate(a, b) {
		return a.ACTION_DT_TM_UTC > b.ACTION_DT_TM_UTC ? -1 : a.ACTION_DT_TM_UTC < b.ACTION_DT_TM_UTC ? 1 : 0;
	}


	detailsArray.sort(sortDetailsByDate);

	return detailsArray;
};

/**
 * Map the Order Details Component object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "WF_ORDER_DETAILS" filter
 */
MP_Util.setObjectDefinitionMapping("WF_ORDER_DETAILS", OrderDetailsComponent);
