/**
 * The social component style
 * @class
 */
function SocialComponentStyle() {
	this.initByNamespace("soc-o1");
}

SocialComponentStyle.prototype = new ComponentStyle();
SocialComponentStyle.prototype.constructor = ComponentStyle;
/**
 * The social component
 * @param criterion The criterion containing the requested information
 * @class
 */
function SocialComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new SocialComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.SOCIAL.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.SOCIAL.O1 - render component");
	this.setIncludeLineNumber(true);
	this.setScope(2);
	this.m_iViewAdd = false;
	this.m_openNewInd = false;
	this.bandName = "";
	this.sectionName = "";
	this.itemName = "";
}

SocialComponent.prototype = new MPageComponent();
SocialComponent.prototype.constructor = MPageComponent;

/**
 * Retrieving the social data on page load.
 * @function
 * @name retrieveComponentData
 * This function handles the logic to make a ccl script call and retrieve the social data.
 */
SocialComponent.prototype.retrieveComponentData = function() {
	var self = this;
	var groups = this.getGroups();
	if (groups && groups.length > 0) {
		var criterion = this.getCriterion();
		var resultCount = 1;
		var sendAr = [];
		var viewCategoryMean = this.getCriterion().category_mean;
		var loadTimer = new RTMSTimer(this.getComponentLoadTimerName(), viewCategoryMean);
		var renderTimer = new RTMSTimer(this.getComponentRenderTimerName(), viewCategoryMean);
		var scriptRequest = new ComponentScriptRequest();

		var sEncntr = (this.getScope() === 2) ? criterion.encntr_id + ".0" : "0.0";
		var sEventSets = "0.0";
		var sEventCodes = "0.0";
		for (var x = 0, xl = groups.length; x < xl; x++) {
			var group = groups[x];
			if ( group instanceof MPageEventSetGroup) {
				sEventSets = MP_Util.CreateParamArray(group.getEventSets(), 1);
			}
			else if ( group instanceof MPageEventCodeGroup) {
				sEventCodes = MP_Util.CreateParamArray(group.getEventCodes(), 1);
			}
			else if ( group instanceof MPageSequenceGroup) {
				var mapItems = group.getMapItems();
				sEventSets = MP_Util.CreateParamArray(MP_Util.GetValueFromArray("CODE_VALUE", mapItems), 1);
			}
			else if ( group instanceof MPageGrouper) {
				var g = group.getGroups();
				var eventCodeArray = [];
				for (var y = 0, yl = g.length; y < yl; y++) {
					if (g[y] instanceof MPageEventCodeGroup) {
						eventCodeArray = eventCodeArray.concat(g[y].getEventCodes());
					}
				}
				sEventCodes = MP_Util.CreateParamArray(eventCodeArray, 1);
			}
		}

		sendAr.push("^MINE^", criterion.person_id + ".0", sEncntr, criterion.provider_id + ".0", criterion.ppr_cd + ".0", resultCount, "^^", sEventSets, sEventCodes, this.getLookbackUnits(), this.getLookbackUnitTypeFlag(), 1, "^^", "^^", 0);

		scriptRequest.setProgramName("MP_RETRIEVE_N_RESULTS_JSON");
		scriptRequest.setParameterArray(sendAr);
		scriptRequest.setComponent(self);
		scriptRequest.setLoadTimer(loadTimer);
		scriptRequest.setRenderTimer(renderTimer);
		scriptRequest.performRequest();

	}
	else {
		// handles throwing "Error retrieving results" if there are no groups
		var err = new Error("No eventsets are defined in bedrock.");
		logger.logJSError(err, this, "social.js", "retrieveComponentData");

		var errMsg = [];
		this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(), errMsg.join("<br />")), "(0)");
	}
};

SocialComponent.prototype.setIViewAdd = function(value) {
	this.m_iViewAdd = value;
};

SocialComponent.prototype.isIViewAdd = function() {
	return (this.m_iViewAdd);
};
/**
 * Sets the indicator, m_openNewInd, to either open a new form or the most recent, existing form.
 * @param {boolean} value true = open a new form, false = open most recent, existing form
 */
SocialComponent.prototype.setOpenNewInd = function(value) {
	this.m_openNewInd = value;
};
/**
 * Returns the value of the indicator, m_openNewInd, to determine whether to open a new form or the most recent, existing form.
 * @return {boolean} true = open a new form, false = open most recent, existing form
 */
SocialComponent.prototype.getOpenNewInd = function() {
	return (this.m_openNewInd);
};

SocialComponent.prototype.openTab = function() {
	var criterion = this.getCriterion();
	var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + 0 + "|0|0";
	MP_Util.LogMpagesEventInfo(this, "POWERFORM", paramString, "social.js", "openTab");
	MPAGES_EVENT("POWERFORM", paramString);
	this.retrieveComponentData();
};

SocialComponent.prototype.openDropDown = function(formID) {
	var self = this;
	var criterion = this.getCriterion();
	if (!this.getOpenNewInd()) {
		//Open new form
		var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + formID + "|0|0";
		MP_Util.LogMpagesEventInfo(null, "POWERFORM", paramString, "social.js", "openDropDown");
		MPAGES_EVENT("POWERFORM", paramString);
		self.retrieveComponentData();
	}
	else {
		//Open existing form
		var sendAr = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", formID + ".0"];
		var request = new MP_Core.ScriptRequest(self, self.getComponentLoadTimerName());
		request.setProgramName("INN_MP_GET_FORM_ACTIVITY_ID");
		request.setParameters(sendAr);
		request.setAsync(true);
		MP_Core.XMLCCLRequestCallBack(self, request, function(reply) {
			var recordData = reply.getResponse();
			var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + formID + "|" + recordData.FORM_ACTIVITY_ID + "|0";
			MP_Util.LogMpagesEventInfo(null, "POWERFORM", paramString, "social.js", "openExistingForm");
			MPAGES_EVENT("POWERFORM", paramString);
			self.retrieveComponentData();
		});
	}
};

SocialComponent.prototype.openIView = function() {
	var criterion = this.getCriterion();
	var paramString = "'" + this.bandName + "','" + this.sectionName + "','" + this.itemName + "'," + criterion.person_id + "," + criterion.encntr_id;
	MP_Util.LogMpagesEventInfo(this, "IVIEW", paramString, "social.js", "openIView");
	try {
		var launchIViewApp = window.external.DiscernObjectFactory("TASKDOC");
		launchIViewApp.LaunchIView(this.bandName, this.sectionName, this.itemName, criterion.person_id, criterion.encntr_id);

		CERN_EventListener.fireEvent(null, this, EventListener.EVENT_CLINICAL_EVENT, "Social");
	}
	catch (err) {
		MP_Util.LogJSError(err, null, "social.js", "openIView");
	}
};

/**
 * Creates the filterMappings that will be used when loading the component's
 * bedrock settings
 */
SocialComponent.prototype.loadFilterMappings = function() {

	// Add the filter mapping object for the Social Summary component
	this.addFilterMappingObject("SOC_CHART_LAUNCH_IND", {
		setFunction : this.setIViewAdd,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
	// Add the filter mapping object for opening the latest, existing powerform
	this.addFilterMappingObject("SOCIAL_PF_IND", {
		setFunction : this.setOpenNewInd,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
};

/**
 * Process and render the results for the component table
 * @param recordData The retrieved JSON to generate the HTML markup
 */
SocialComponent.prototype.processResultsForRender = function(recordData) {
	var resultLength = recordData.RESULTS.length;
	var results = recordData.RESULTS;
	var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
	var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	var dateTime;
	var sDate;
	var socialResult;
	var newResults = [];
	var criticalFlag = 0;
	var measurement = new MP_Core.Measurement();

	for (var x = 0; x < resultLength; x++) {
		if (results[x].CLINICAL_EVENTS[0].MEASUREMENTS[0]) {
			socialResult = results[x];

			//Set up the date
			dateTime = new Date();
			measurement.initFromRec(socialResult.CLINICAL_EVENTS[0].MEASUREMENTS[0], codeArray);
			dateTime.setISO8601(socialResult.CLINICAL_EVENTS[0].MEASUREMENTS[0].EFFECTIVE_DATE);
			sDate = (dateTime) ? df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR) : "";

			//critical indicators in the navigator
			normalcy = MP_Core.GetNormalcyClass(measurement);
			if (criticalFlag === 0 && normalcy === "res-severe") {
				CERN_EventListener.fireEvent(this, this, EventListener.EVENT_CRITICAL_UPDATE, {
					"critical" : true
				});
				criticalFlag = 1;
			}

			socialResult.REPORT_NAME_DISPLAY = socialResult.EVENT_SET_DISP || "--";
			socialResult.REPORT_DATE_DISPLAY = sDate;
			socialResult.REPORT_RESULT = MP_Core.GetNormalcyResultDisplay(measurement, false);
			newResults.push(socialResult);
		}
	}

	return newResults;
};

/**
 * Renders the retrieved data for the component into HTML markup to display within the document
 * @param recordData The retrieved JSON to parser to generate the HTML markup
 */
SocialComponent.prototype.renderComponent = function(recordData) {
	var numberResults = 0;
	var results = null;
	var socialTable = null;

	//Get result information
	results = this.processResultsForRender(recordData);
	numberResults = results.length;

	//Get the component table (the first time this is called, it is created)
	socialTable = new ComponentTable();

	socialTable.setNamespace(this.getStyles().getId());
	socialTable.setIsHeaderEnabled(false);
	socialTable.setZebraStripe(false);
	socialTable.setCustomClass("soc-o1-result-table");

	//Create the name column
	var nameColumn = new TableColumn();
	nameColumn.setColumnId("NAME");
	nameColumn.setCustomClass("soc-o1-name");
	nameColumn.setRenderTemplate('${REPORT_NAME_DISPLAY}');

	//Create the result column
	var resultColumn = new TableColumn();
	resultColumn.setColumnId("RESULT");
	resultColumn.setCustomClass("soc-o1-result");
	resultColumn.setRenderTemplate('${REPORT_RESULT}');

	//Create the date column
	var dateColumn = new TableColumn();
	dateColumn.setColumnId("DATE");
	dateColumn.setCustomClass("soc-o1-date");
	dateColumn.setRenderTemplate('${REPORT_DATE_DISPLAY}');

	//Add the columns to the table
	socialTable.addColumn(nameColumn);
	socialTable.addColumn(resultColumn);
	socialTable.addColumn(dateColumn);

	//Bind the data to the results
	socialTable.bindData(results);

	//Store off the component table
	this.setComponentTable(socialTable);

	//Finalize the component using the socialTable.render() method to create the table html
	this.finalizeComponent(socialTable.render(), MP_Util.CreateTitleText(this, numberResults));

	// Honoring bedrock setting for scrolling
	var node = this.getSectionContentNode();
	if (this.isScrollingEnabled() && this.getScrollNumber()) {
		//Add the scrollable class
		if (numberResults > this.getScrollNumber()) {
			$('#soc-o1' + this.getComponentId() + 'tableBody').addClass('scrollable');
		}
		//Enable scrolling, 1.6 is the min-height
		MP_Util.Doc.InitScrolling(Util.Style.g("scrollable", node, "div"), this.getScrollNumber(), "1.6");
	}

	//Update the component result count
	CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
		"count" : numberResults
	});
};

/**
 * Map the Social O1 object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "social" filter
 */
MP_Util.setObjectDefinitionMapping("social", SocialComponent); 
