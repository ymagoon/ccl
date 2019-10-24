function OrdersComponentStyle() {
	this.initByNamespace("ord");
}

OrdersComponentStyle.prototype = new ComponentStyle();
OrdersComponentStyle.prototype.constructor = ComponentStyle;

function OrdersComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new OrdersComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.ORDERS.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.ORDERS.O1 - render component");
	this.setIncludeLineNumber(true);

	this.m_wasListenerAdded = false;
}

OrdersComponent.prototype = new MPageComponent();
OrdersComponent.prototype.constructor = MPageComponent;
OrdersComponent.prototype.retrieveComponentData = function() {
		var criterion = this.getCriterion();
		var sendAr = [];
		var encntrOption = (this.getScope() === 2) ? criterion.encntr_id + ".0" : "0.0";
		if (!this.getWasListenerAdded()){
			CERN_EventListener.addListener(this, EventListener.EVENT_ORDER_ACTION, this.retrieveComponentData, this);
			this.setWasListenerAdded(true);
		}
		/* outdev, 
		 * inputPersonID, 
		 * inputEncounterID, 
		 * inputPersonnelID, 
		 * lookbackUnits, 
		 * lookbackUnitTypeFlag, 
		 * categoryType, 
		 * orderStatuses, 
		 * pprCd*/
		sendAr = ["^MINE^", 
				criterion.person_id + ".0", 
				encntrOption, 
				criterion.provider_id + ".0", 
				this.getLookbackUnits(), 
				this.getLookbackUnitTypeFlag(),
				MP_Util.CreateParamArray(this.getCatalogCodes(), 1),
				MP_Util.CreateParamArray(this.getOrderStatuses(), 1),
				criterion.ppr_cd + ".0" ];
		MP_Core.XMLCclRequestWrapper(this, "MP_GET_OUTSTANDING_ORDERS", sendAr, true);
};
/**
 * Sets the m_wasListenerAdded member variable to the value provided.
 * @param {Boolean} value : true or false value to indicate if the event listener has been added.
 * @returns {undefined} - undefined
 */
OrdersComponent.prototype.setWasListenerAdded = function(value) {
	this.m_wasListenerAdded = value;
};
/**
 * Gets the m_wasListenerAdded member variable value.
 * @returns {Boolean} - the wasListenerAdded flag
 */
OrdersComponent.prototype.getWasListenerAdded = function() {
	return this.m_wasListenerAdded;
};
OrdersComponent.prototype.setCatalogCodes = function(value) {
	this.m_catalogCodes = value;
};
OrdersComponent.prototype.getCatalogCodes = function() {
	return this.m_catalogCodes;
};
OrdersComponent.prototype.setOrderStatuses = function(value) {
	this.m_orderStatuses = value;
};
OrdersComponent.prototype.addOrderStatus = function(value) {
	if(this.m_orderStatuses === null) {
		this.m_orderStatuses = [];
	}
	this.m_orderStatuses.push(value);
};
OrdersComponent.prototype.getOrderStatuses = function() {
	return this.m_orderStatuses;
};

/**
 * Create a object containing the information need for construction of the HTML markup for a given measurement
 * @param {Object} orders [REQUIRED] The orders object to construct the hover
 * @class
 */
OrdersComponent.prototype.HoverResults = function (orders) {
	var ord_i18n = i18n.discernabu.orders_o1;
	var dateTime = new Date();
	//Orig order date time
	dateTime.setISO8601(orders.ORIG_ORDER_DT_TM);
	var ordLongDateTime = dateTime.format("longDateTime3");
	//Start date time
	dateTime.setISO8601(orders.CURRENT_START_DT_TM);
	var strtLongDateTime = dateTime.format("longDateTime3");
	var ar = ["<div class = 'ord-hover'><dl class='ord-det'><dt class='ord-det-type'><span>",

			ord_i18n.ORDER_NAME, ":</span></dt><dd><span>", orders.HOVER_NAME, "</span></dd><dt class='ord-det-type'><span>",

			ord_i18n.ORDER_DETAILS, ":</span></dt><dd><span>", orders.CLINICAL_DISPLAY_LINE, "</span></dd><dt class='ord-det-type'><span>",

			ord_i18n.ORDER_COMMENTS, ":</span></dt><dd><span>", orders.ORDER_COMMENT.replace(/\n/g, "<br />"), "</span></dd><dt class='ord-det-type'><span>",

			ord_i18n.ORDER_DATE, ":</span></dt><dd><span>", ordLongDateTime, "</span></dd><dt class='ord-det-type'><span>",

			ord_i18n.START_DT_TM, ":</span></dt><dd><span>", strtLongDateTime, "</span></dd><dt class='ord-det-type'><span>",

			ord_i18n.ORDER_STATUS, ":</span></dt><dd><span>", orders.STATUS, "</span></dd><dt class='ord-det-type'><span>",
	
			ord_i18n.ORDER_PHYS, ":</span></dt><dd><span>", orders.RESPONSIBLE_PROVIDER, "</span></dd></dl></div>"]; 
	return ar.join("");
};

/**
 * Process the results for the component table
 * 
 * @param {Object} recordData [REQUIRED] The retrieved JSON to generate the HTML markup
 * @returns {object} newResults - The results that are going to be rendered.
 */
OrdersComponent.prototype.processResultsForRender = function(recordData) {
	var results = recordData.ORDERS;
	var resultLength = results.length;
	var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	var dateTime = new Date();
	var result;
	var newResults = [];
	for (var x = 0; x<resultLength; x++) {
		if(results[x])
		{
			result = results[x];
	
			// Set up the Order name
			result["REPORT_ORDER_NAME"] = result.NAME || "--";
	
			// Set up the ordered date
			dateTime.setISO8601(result.ORIG_ORDER_DT_TM);
			result["REPORT_DATE_DISPLAY"] = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
	
			// Set up the result
			result["REPORT_ORDER_STATUS"] = result.STATUS || "--";
			
			// Set up the hover data
			result["REPORT_HOVER_RESULTS"] = this.HoverResults(result);
			newResults.push(result);
		}
	}
	return newResults;
};

OrdersComponent.prototype.renderComponent = function(recordData) {
	var numberResults = 0;
	var results = null;
	var orderso1Table = null;
	var ord_i18n = i18n.discernabu.orders_o1;
	// Get result information
	results = this.processResultsForRender(recordData);
	numberResults = results.length;
	// Get the component table (the first time this is called, it is created)
	orderso1Table = new ComponentTable();
	orderso1Table.setNamespace(this.getStyles().getId());
	orderso1Table.setZebraStripe(false);
	orderso1Table.setCustomClass("ord-comp-table");
	var rowSelection = new TableRowHoverExtension();
	
	// Create the name column
	var orderNameColumn = new TableColumn();
	orderNameColumn.setColumnId("NAME");
	orderNameColumn.setColumnDisplay("&nbsp;");
	orderNameColumn.setCustomClass("ord-name");
	orderNameColumn.setRenderTemplate('${ REPORT_ORDER_NAME }');

	// Create the date column
	var dateColumn = new TableColumn();
	dateColumn.setColumnId("DATE");
	dateColumn.setCustomClass("ord-date");
	dateColumn.setColumnDisplay(ord_i18n.ORDERED);
	dateColumn.setRenderTemplate('${ REPORT_DATE_DISPLAY }');

	// Create the result column
	var orderStatusColumn = new TableColumn();
	orderStatusColumn.setColumnId("RESULT");
	orderStatusColumn.setColumnDisplay(ord_i18n.STATUS);
	orderStatusColumn.setCustomClass("ord-status");
	orderStatusColumn.setRenderTemplate('${ REPORT_ORDER_STATUS }');

	// Add the columns to the table
	orderso1Table.addColumn(orderNameColumn);
	orderso1Table.addColumn(orderStatusColumn);
	orderso1Table.addColumn(dateColumn);
	rowSelection.setHoverRenderer('<span">${ RESULT_DATA.REPORT_HOVER_RESULTS }</span>');
	
	// Bind the data to the results
	orderso1Table.bindData(results);
	orderso1Table.addExtension(rowSelection);
	
	// Store off the component table
	this.setComponentTable(orderso1Table);
	
	// Finalize the component using the socialo2Table.render() method to create
	// the table html
	this.finalizeComponent(orderso1Table.render(), MP_Util.CreateTitleText(
			this, numberResults));

	//honoring the bedrock setting for scroll.
	var node = this.getSectionContentNode();
		if(this.isScrollingEnabled() && this.getScrollNumber() )
			{
				
				//shifts the header only when the scroll is applied.
				if(numberResults > this.getScrollNumber())
				{
					$("#ord"+this.getComponentId()+"tableBody").addClass("scrollable");
					$("#ord"+this.getComponentId()+"hdr").addClass("shifted");
				}
				//enable scrolling - 3.5 is the line height for row.
				MP_Util.Doc.InitScrolling(Util.Style.g("scrollable", node, "div"), this.getScrollNumber(), "3.5");
			}

	// Update the component result count
	CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE,
			{
				"count": numberResults
			});
};


