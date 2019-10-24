/**
 * Create the component style object which will be used to style various aspects of our component
 */
function OrdersOpt2ComponentStyle() {
	this.initByNamespace("ord2");
}
OrdersOpt2ComponentStyle.inherits(ComponentStyle);

/**
 * @constructor
 * Initialize the Outstanding Orders Option 2 component
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 */
function OrdersOpt2Component(criterion) {
	//These are the catalog codes for the orders that should be returned in the data retrieval
	this.m_catalogCodes = [];
	//These are the status codes for the orders that should be returned in the data retrieval
	this.m_orderStatuses = [];
	
	this.setCriterion(criterion);
	this.setStyles(new OrdersOpt2ComponentStyle());
	//Set the timer names so the architecture will create the correct timers for our use
	this.setComponentLoadTimerName("USR:MPG.ORDERS.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.ORDERS.O2 - render component");
	
	//Make sure the architecture includes the result count when creating the count text
	this.setIncludeLineNumber(true);

	//Set the flag to always show this component as expanded
	this.setAlwaysExpanded(true);
	
	//Add a listener for any Order action so we can refresh the component if a new order is added
	CERN_EventListener.addListener(this, EventListener.EVENT_ORDER_ACTION, this.retrieveComponentData, this);
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
OrdersOpt2Component.prototype = new MPageComponent();
OrdersOpt2Component.prototype.constructor = MPageComponent;

/* Supporting functions */

/**
 * Sets the catalog codes used to determine which outstanding order results to retrieve.
 * @param {[float]} catalogCodes : An array of catalog codes that will be used when retrieving outstanding orders.
 */
OrdersOpt2Component.prototype.setCatalogCodes = function(catalogCodes) {
	this.m_catalogCodes = catalogCodes;
};

/**
 * Retrieves the array of catalog codes that will be used when retrieving outstanding orders.
 * @return {[float]} An array of catalog codes which will be used when retrieving outstanding orders
 */
OrdersOpt2Component.prototype.getCatalogCodes = function() {
	return this.m_catalogCodes;
};

/**
 * Sets the array of order status codes used when determining which outstanding orders results to retrieve.
 * @param {[float]} orderStatuses : An array of order status codes which will be used to determine which 
 * outstanding orders to retrieve
 */
OrdersOpt2Component.prototype.setOrderStatuses = function(orderStatuses) {
	this.m_orderStatuses = orderStatuses;
};

/**
 * Retrieves the array of order status codes that will be used when retrieving outstanding order.
 * @return {[float]} An array of order status codes which will be used when retrieving outstanding orders
 */
OrdersOpt2Component.prototype.getOrderStatuses = function() {
	return this.m_orderStatuses;
};

/**
 * The OrdersOptComponent implementation of the resizeComponent.  This function is being overridden because it needs
 * to perform special logic when the component is being resized.
 */
OrdersOpt2Component.prototype.resizeComponent = function() {
	//Call the base class functionality to resize the component
	MPageComponent.prototype.resizeComponent.call(this, null);

	//Adjust the component headers if scrolling is applied
	var sectionNode = this.getSectionContentNode();
	var contentBody = $(sectionNode).find(".content-body");
	if(contentBody.length) {
		var maxHeight = parseInt($(contentBody).css("max-height").replace("px", ""), 10);
		if(!isNaN(maxHeight)) {
			var totalHeightOfAllElements = 0;
			$(contentBody).find('.ord2-info').each(function() {
				totalHeightOfAllElements += $(this).height();
			});
			
			if(totalHeightOfAllElements >= maxHeight) {
				$(sectionNode).find('.content-hdr').addClass("ord2-hdr-shifted");
			}
			else {
				$(sectionNode).find('.content-hdr').removeClass("ord2-hdr-shifted");

			}
		}
	}
};

/* Main rendering functions */

/**
 * Creates the filterMappings that will be used when loading the component's bedrock settings
 */
OrdersOpt2Component.prototype.loadFilterMappings = function(){
	
	//Add the filter mapping object for the Catalog Type Codes
	this.addFilterMappingObject("WF_INCOMPLETE_ORDERS_CAT_TYPE", {
		setFunction: this.setCatalogCodes,
		type: "ARRAY",
		field: "PARENT_ENTITY_ID"
	});
	//Add the filter mapping object for the Order Status Codes
	this.addFilterMappingObject("WF_INCOMPLETE_ORDERS_STATUS", {
		setFunction: this.setOrderStatuses,
		type: "ARRAY",
		field: "PARENT_ENTITY_ID"
	});
};

/**
 * This is the OrdersOpt2Component implementation of the retrieveComponentData function.  
 * It creates the necessary parameter array for the data acquisition script call and the associated Request object.
 */
OrdersOpt2Component.prototype.retrieveComponentData = function() {
	var criterion = null;
	var encntrOption = "0.0";
	var request = null;
	var self = this;
	var sendAr = null;

	/**
	 * mp_get_outstanding_orders script parameters:
	 * outdev, inputPersonID, inputEncounterID, inputPersonnelID, lookbackUnits, lookbackUnitTypeFlag, 
	 * categoryType, orderStatuses, PPRCd
	 */
	//Create the parameter array for our script call
	criterion = this.getCriterion();
	encntrOption = (this.getScope() == 2) ? (criterion.encntr_id + ".0") : "0.0";
	sendAr = ["^MINE^", criterion.person_id + ".0", encntrOption, criterion.provider_id + ".0", 
		this.getLookbackUnits(), this.getLookbackUnitTypeFlag(), MP_Util.CreateParamArray(this.getCatalogCodes(), 1), 
		MP_Util.CreateParamArray(this.getOrderStatuses(), 1), criterion.ppr_cd + ".0"];

	request = new MP_Core.ScriptRequest(this, this.getComponentLoadTimerName());
	request.setProgramName("MP_GET_OUTSTANDING_ORDERS");
	request.setParameters(sendAr);
	request.setAsync(true);

	MP_Core.XMLCCLRequestCallBack(this, request, function(reply) {
		self.renderComponent(reply);
	});
};

/**
 * This is the OrderOpt2Component implementation of the renderComponent function.  It takes the information retrieved from the script
 * call and renders the component's visuals.  There is no check on the status of the script call's reply since that is handled in the 
 * call to XMLCCLRequestWrapper.
 * @param {MP_Core.ScriptReply} The ScriptReply object returned from the call to MP_Core.XMLCCLRequestCallBack function in the 
 * retrieveComponentData function of this object.
 */
OrdersOpt2Component.prototype.renderComponent = function(reply) {
	var compId = this.getComponentId();
	var countText = "";
	var dateTime = new Date();
	var errMsg = [];
	var j = 0;
	var ordArray = [];
	var ordDateTime = "";
	var orderLen = 0;
	var orders = null;
	var ordI18n = i18n.discernabu.orders_o2;
	var ordLongDateTime = "";
	var recordData = null;
	var replyStatus = "";
	var strtLongDateTime = "";
	var timerRenderComponent = null;
	var zebraStripe = "";
	
	try {
		//Create the render timer
		timerRenderComponent = MP_Util.CreateTimer(this.getComponentRenderTimerName());
		
		//Check to see if the component script call returned successfully.  If not handle the response appropriately
		replyStatus = reply.getStatus();
		if(replyStatus !== "S"){
			if(replyStatus == "F") {
				errMsg.push(reply.getError());
				this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(), errMsg.join("<br />")), "");
			}
			else {
				this.finalizeComponent(MP_Util.HandleNoDataResponse(this.getStyles().getNameSpace()), "(0)");
			}
			// update count text in the navigation pane
			CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
				"count" : 0
			});
			return;
		}
		
		//Create the header row for the component display
		ordArray.push("<div class='content-hdr'><dl class='result-info ord2-info-hdr hdr'><dd class='ord2-nm-hd'>&nbsp;</dd><dd class='ord2-st-hd'>", ordI18n.STATUS, "</dd><dd class='ord2-dt-hd'>", ordI18n.ORDERED, "</dd></dl></div>");

		//Create the actual content body for the component
		recordData = reply.getResponse();
		ordArray.push("<div class='content-body'>");
		orderLen = recordData.ORDERS.length;
		for( j = 0; j < orderLen; j++) {
			orders = recordData.ORDERS[j];

			//Orig order date time
			dateTime.setISO8601(orders.ORIG_ORDER_DT_TM);
			ordDateTime = dateTime.format("longDateTime2");
			ordLongDateTime = dateTime.format("longDateTime3");

			//Start date time
			dateTime.setISO8601(orders.CURRENT_START_DT_TM);
			strtLongDateTime = dateTime.format("longDateTime3");
			
			//Create the HTML for this order
			zebraStripe = (j % 2) ? "odd" : "even";
			ordArray.push("<h3 class='info-hd'>", i18n.RESULT, "</h3><dl class='result-info ord2-info ", zebraStripe,"'><dd class='ord2-name'>", orders.NAME, "</dd><dd class='ord2-status'>", orders.STATUS, "</dd><dd class='ord2-date date-time'>", ordDateTime, "</dd></dl><div class='result-details'><dl class='ord2-det'><dt><span>", ordI18n.ORDER_NAME, ":</span></dt><dd><span>", orders.HOVER_NAME, "</span></dd><dt><span>", ordI18n.ORDER_DETAILS, ":</span></dt><dd><span>", orders.CLINICAL_DISPLAY_LINE, "</span></dd><dt><span>", ordI18n.ORDER_COMMENTS, ":</span></dt><dd><span>", orders.ORDER_COMMENT.replace(/\n/g, "<br />"), "</span></dd><dt><span>", ordI18n.ORDER_DATE, ":</span></dt><dd><span>", ordLongDateTime, "</span></dd><dt><span>", ordI18n.START_DT_TM, ":</span></dt><dd><span>", strtLongDateTime, "</span></dd><dt><span>", ordI18n.ORDER_STATUS, ":</span></dt><dd><span>", orders.STATUS, "</span></dd><dt><span>", ordI18n.ORDER_PHYS, ":</span></dt><dd><span>", orders.RESPONSIBLE_PROVIDER, "</span></dd></dl></div>");
		}
		ordArray.push("</div>");
		
		//Create the component count text
		countText = MP_Util.CreateTitleText(this, orderLen);
		
		//Apply the styling template for this component
		this.applyTemplate("list-as-table");
		
		//Load the html into the component and initialize hovers and other elements
		this.finalizeComponent(ordArray.join(""), countText);

		//Notifies whoever is listening that we have a new count to display
		CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
			"count" : orderLen
		});		
	}
	catch (err) {
		if(timerRenderComponent) {
			timerRenderComponent.Abort();
			timerRenderComponent = null;
		}
		MP_Util.LogJSError(this, err, "orders-o2.js", "renderComponent");
		//Throw the error to the architecture
		throw (err);
	}
	finally {
		if(timerRenderComponent) {
			timerRenderComponent.Stop();
		}
	}
};

/**
 * Map the Outstanding Orders option 2 object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "WF_INCOMPLETE_ORDERS" filter 
 */
MP_Util.setObjectDefinitionMapping("WF_INCOMPLETE_ORDERS", OrdersOpt2Component);
