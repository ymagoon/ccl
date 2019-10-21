/**
 * Create the component style object which will be used to style various aspects
 * of our component
 */
function BBOverviewComponentStyle() {
	this.initByNamespace("bbo");
}

BBOverviewComponentStyle.inherits(ComponentStyle);

/**
 * @constructor Initialize the Blood BankOverview component
 * @param {Criterion}
 *            criterion : The Criterion object which contains information needed
 *            to render the component.
 */
function BBOverviewComponent(criterion) {

	// These are the bb Orderbale codes for the orders that should be be
	// considered for specimen availability
	this.m_bbOrderableCodes = [];
	this.setCriterion(criterion);
	this.setStyles(new BBOverviewComponentStyle());

	// Set the timer names so the architecture will create the timers and can be used for the lights on network
	this.setComponentLoadTimerName("USR:MPG.BBOVERVIEW.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.BBOVERVIEW.O1 - render component");

	// set the line number display to false in the header 
	this.setIncludeLineNumber(false);
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent
 * object
 */
BBOverviewComponent.prototype = new MPageComponent();
BBOverviewComponent.prototype.constructor = MPageComponent;

/* Supporting functions */
/**
 * Sets the bb Orderable codes for the orders that should be be considered for
 * specimen availability.
 *
 * @param {[float]}
 *            cbbOrderableCodes : An array of BB Orderable codes that will be
 *            used when determining specimen availability.
 */
BBOverviewComponent.prototype.setBBOrderableCodes = function(bbOrderableCodes) {
	this.m_bbOrderableCodes = bbOrderableCodes;
};

/**
 * Retrieves the array of bb Orderable codes for the orders that should be be
 * considered for specimen availability.
 *
 * @return {[float]} An array of BB Orderable codes that will be used when
 *         determining specimen availability.
 */
BBOverviewComponent.prototype.getBBOrderableCodes = function() {
	return this.m_bbOrderableCodes;
};

/* Main rendering functions */

/**
 * Creates the filterMappings that will be used when loading the component's
 * bedrock settings
 */
BBOverviewComponent.prototype.loadFilterMappings = function() {

	// Add the filter mapping object for the BB Orderable Type Codes
	this.addFilterMappingObject("BB_ORDERS", {
		setFunction : this.setBBOrderableCodes,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
};

/**
 * function to internationalize the date time. 
 */
BBOverviewComponent.prototype.overviewI18nDateTime = function(bboDateTime) {
	var resultDtTm = new Date();
	resultDtTm.setISO8601(bboDateTime);
	return resultDtTm.format("longDateTime3");
};

/**
 * This is the BBOverviewComponent implementation of the retrieveComponentData
 * function. It creates the necessary parameter array for the data acquisition
 * script call and the associated Request object.
 */
BBOverviewComponent.prototype.retrieveComponentData = function() {
	var self = this;
	var criterion = this.getCriterion();
	var sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", MP_Util.CreateParamArray(this.getBBOrderableCodes(), 1) ];
	var request = new MP_Core.ScriptRequest(this, this.getComponentLoadTimerName());
	request.setProgramName("MP_BBSUM_OVERVIEW");
	request.setParameters(sendAr);
	request.setAsync(true);
	MP_Core.XMLCCLRequestCallBack(this, request, function(reply) {
		self.renderComponent(reply);
	});
};

/**
 * This is the BBOverviewComponent implementation of the renderComponent
 * function. It takes the information retrieved from the script call and renders
 * the component's visuals. There is no check on the status of the script call's
 * reply since that is handled in the call to XMLCCLRequestWrapper.
 *
 * @param {MP_Core.ScriptReply}
 *            The ScriptReply object returned from the call to
 *            MP_Core.XMLCCLRequestCallBack function in the
 *            retrieveComponentData function of this object.
 */

BBOverviewComponent.prototype.renderComponent = function(reply) {
	//null expire date. requires global scope
	var nullDateTime           = "\/Date(0000-00-00T00:00:00.000+00:00)\/";
	// Error message
	var errMsg                 = [];
	var replyStatus            = "";
	var timerRenderComponent   = null;
	
	try {

		// Create the render timer
		timerRenderComponent = MP_Util.CreateTimer(this.getComponentRenderTimerName());

		// Check to see if the component script call returned successfully. If
		// not handle the response appropriately
		replyStatus = reply.getStatus();
		if (replyStatus !== "S") {
			if (replyStatus === "F") {
				errMsg.push(reply.getError());
				this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(), errMsg.join("<br />")), "");
			} else {
				this.finalizeComponent(MP_Util.HandleNoDataResponse(this.getStyles().getNameSpace()), "(0)");
			}
			return;
		}

		// Create the actual content body for the component
		var recordData = reply.getResponse();
		var bboArray = [];

		/*
		 * post the Blood Group
		 */
		bboArray.push("<div class='content-body'><table><tr><td>" + i18n.lab.bbt_overview_o1.BLOOD_GROUP + "</td>");
		if (recordData.BLOOD_GROUP_CNT < 1) {
			bboArray.push("<td class='bbo_noresult'>" + i18n.lab.bbt_overview_o1.NO_BLOOD_GROUP);
		} else {
			bboArray.push("<td>", recordData.BLOOD_GROUP);
		}
		bboArray.push("</td></tr>"); 

		/*
		 * post the Antibody List
		 */
		bboArray.push("<tr><td>" + i18n.lab.bbt_overview_o1.ANTIBODIES + "</td>");
		var ABRecLen = recordData.ANTIBODYLIST.length;
		if (ABRecLen === 0) {
			bboArray.push("<td class='bbo_noresult'>" + i18n.lab.bbt_overview_o1.NO_ANTIBODIES);
		} else {
			bboArray.push("<td>");
			for (var i = 0, allLen = ABRecLen; i < allLen; i++) {
				bboArray.push(recordData.ANTIBODYLIST[i].ANTIBODY_CHART_NAME);
				if (i < ABRecLen - 1) {
					bboArray.push(", ");
				}
			}
		}
		bboArray.push("</td></tr>");

		/*
		 * post the Transfusion requirements List
		 */
		bboArray.push("<tr><td>" + i18n.lab.bbt_overview_o1.TRANSFUSION_REQUIREMENTS + "</td>");
		var TRRecLen = recordData.TRANSREQLIST.length;
		if (TRRecLen === 0) {
			bboArray.push("<td class='bbo_noresult'>" + i18n.lab.bbt_overview_o1.NO_TRANS_REQ);
		} else {
			bboArray.push("<td>");
			for (var i = 0, allLen = TRRecLen; i < allLen; i++) {
				bboArray.push(recordData.TRANSREQLIST[i].REQUIREMENT_DISP);

				if (i < TRRecLen - 1) {
					bboArray.push(", ");
				}
			}
		}
		bboArray.push("</td></tr>");

		/*
		 * Post the Antigen list
		 */
		bboArray.push("<tr><td>" + i18n.lab.bbt_overview_o1.ANTIGENS + " </td>");
		var ANGenLen = recordData.ANTIGENLIST.length;
		if (ANGenLen === 0) {
			bboArray.push("<td class='bbo_noresult'>" + i18n.lab.bbt_overview_o1.NO_ANTIGENS);
		} else {
			bboArray.push("<td>");
			for (var i = 0, GLen = ANGenLen; i < GLen; i++) {
				bboArray.push(recordData.ANTIGENLIST[i].DISPLAY);
				if (i < ANGenLen - 1) {
					bboArray.push(" ");
				}
			}
		}
		bboArray.push("</td></tr>");

		/*
		 * Posting the Specimen Availability
		 */
		bboArray.push("<tr><td>" + i18n.lab.bbt_overview_o1.SPECIMEN_AVAILABILITY + "</td>");

		// Check if there is any specimen available
		if (recordData.EXPIRY_DT_TM === nullDateTime) {
			bboArray.push("<td class='bbo_noresult'>" + i18n.lab.bbt_overview_o1.NO_SPECIMEN + "</td></tr></table></div>");
		}
		// Display the expire date if specimen available
		else {
			bboArray.push("<td>" + i18n.lab.bbt_overview_o1.CURRENT_UNTIL + ": " 
					+ this.overviewI18nDateTime(recordData.EXPIRY_DT_TM_STR) + "</td></tr></table></div>");
		}
		// Create the component count text
		var countText = MP_Util.CreateTitleText(this, 0);

		// Load the html into the component and initialize hovers and other
		// elements
		this.finalizeComponent(bboArray.join(""), countText);
	} catch (err) {
		if (timerRenderComponent) {
			timerRenderComponent.Abort();
			timerRenderComponent = null;
		}
		MP_Util.LogJSError(this, err, "mp_bbsum_overview.js", "renderComponent");
		// Throw the error to the architecture
		throw (err);
		// end the timer
	} finally {
		if (timerRenderComponent) {
			timerRenderComponent.Stop();
		}
	}
};

/**
 * Map the Outstanding Orders option 2 object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "BB_ORDERS" filter
 */
MP_Util.setObjectDefinitionMapping("MP_BBT_OVERVIEW_LAYOUT", BBOverviewComponent);
