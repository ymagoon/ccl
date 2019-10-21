function Pathologyo2ComponentStyle() {
	this.initByNamespace("path-o2");
}

Pathologyo2ComponentStyle.prototype = new ComponentStyle();
Pathologyo2ComponentStyle.prototype.constructor = ComponentStyle;

/**
 * The Pathology prototype component will retrieve all documents associated to the encounter for the
 * specified lookback days defined by the component.
 * @param {Criterion} criterion
 */
function Pathologyo2Component(criterion) {
	this.setCriterion(criterion);
	this.setLookBackDropDown(true);
	this.setStyles(new Pathologyo2ComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.PATHOLOGY.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.PATHOLOGY.O2 - render component");
	
	//Flag for pregnancy onset date lookback time frame
	this.setPregnancyLookbackInd(true);
	
	//meanings is used to allow loading of the status codes
	//when needed aka 'lazy loading'.  Hence why the retrieval of
	//meanings is not exposed to the consumer.  Only retrieval of codes
	//is available.
	this.m_resultStatusMeanings = null;
	this.setIncludeLineNumber(true);
	this.m_timerLoadComponent = null;
	this.resultCount = 0;
}

Pathologyo2Component.prototype = new MPageComponent();
Pathologyo2Component.prototype.constructor = MPageComponent;

Pathologyo2Component.prototype.postProcessing = function() {
	MPageComponent.prototype.postProcessing.call(this);
	if(this.resultCount === 0) {
		//Update the component result count
		CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
			"count" : 0
		});
	}
};

Pathologyo2Component.prototype.processResultsForRender = function(results) {
	var resultLength = results.length;
	for(resultLength; resultLength--;) {
		var pathologyResult = results[resultLength];		
		pathologyResult.REPORT_NAME_DISPLAY = pathologyResult.EVENT_CD_DISP ? "<a>"+ pathologyResult.EVENT_CD_DISP +"</a>": "--";
		//Set up the date									
		var dateTimeString = "--";
		var dateTime = new Date();
		if (pathologyResult.EFFECTIVE_DATE) {
			dateTime.setISO8601(pathologyResult.EFFECTIVE_DATE);
			dateTimeString = MP_Util.DisplayDateByOption(this, dateTime);
		}
		pathologyResult.REPORT_DATE_DISPLAY = dateTimeString;
		//Set up the status
		pathologyResult.REPORT_STATUS_DISPLAY = pathologyResult.RESULT_STATUS_CD_DISP || "--";
		if(pathologyResult.RESULT_STATUS_CD_MEAN === "MODIFIED" || pathologyResult.RESULT_STATUS_CD_MEAN === "ALTERED") {
			pathologyResult.REPORT_NAME_DISPLAY += '<span class="res-modified">&nbsp;</span>';
		}
	}
};

Pathologyo2Component.prototype.retrieveComponentData = function() {
	var criterion = null;
	var encntrOption = "0.0";
	var request = null;
	var self = this;
	var sendAr = null;
	var groups = this.getGroups();
	var events = (groups && groups.length > 0) ? groups[0].getEventSets() : null;

	criterion = this.getCriterion();
	encntrOption = (this.getScope() == 2) ? (criterion.encntr_id + ".0") : "0.0";
	
	sendAr = ["^MINE^", criterion.person_id + ".0", encntrOption, criterion.provider_id + ".0",
	    this.getLookbackUnits(), MP_Util.CreateParamArray(events,1), MP_Util.CreateParamArray(null,1),criterion.ppr_cd + ".0",
	    this.getLookbackUnitTypeFlag(), 0, 0, 1
	];
	MP_Core.XMLCclRequestWrapper(this, "MP_RETRIEVE_DOCUMENTS_JSON_DP", sendAr, true);
};

Pathologyo2Component.prototype.renderComponent = function(reply) {
	var numberResults = 0;
	var results = null;
	var docI18n = i18n.discernabu.pathology_o2;
	var dateText = docI18n.DATE_TIME;
	var pathologyTable = null;
	var nameText = docI18n.REPORT_NAME;
	var statusText = docI18n.STATUS;
	if(this.getDateFormat() == 3) {
		dateText += "<br />" + docI18n.AGO;
		nameText += "<br />&nbsp;";
		statusText += "<br />&nbsp;";
	}
	//Get result information
	results = reply.DOCS;
	numberResults = results.length;
	this.resultCount = numberResults;
	
	//Process the results so rendering becomes more trivial
	this.processResultsForRender(results);
	
	//Get the component table (the first time this is called, it is created)
	pathologyTable = new ComponentTable();
	pathologyTable.setNamespace(this.getStyles().getId());
	//Create the name column
	var nameColumn = new TableColumn();
	nameColumn.setColumnId("NAME");
	nameColumn.setCustomClass("path-o2-name");
	nameColumn.setColumnDisplay(nameText);
	nameColumn.setPrimarySortField("EVENT_CD_DISP");
	nameColumn.setIsSortable(true);
	nameColumn.setRenderTemplate('${ REPORT_NAME_DISPLAY }');
	
	//Create the date column
	var dateColumn = new TableColumn();
	dateColumn.setColumnId("DATE");
	dateColumn.setCustomClass("path-o2-date");
	dateColumn.setColumnDisplay(dateText);
	dateColumn.setPrimarySortField("EFFECTIVE_DATE");
	dateColumn.setIsSortable(true);
	dateColumn.setRenderTemplate('${ REPORT_DATE_DISPLAY }');
	dateColumn.addSecondarySortField("EVENT_CD_DISP", TableColumn.SORT.ASCENDING);
	
	//Create the status column
	var statusColumn = new TableColumn();
	statusColumn.setColumnId("STATUS");
	statusColumn.setCustomClass("path-o2-status");
	statusColumn.setColumnDisplay(statusText);
	statusColumn.setPrimarySortField("RESULT_STATUS_CD_DISP");
	statusColumn.setIsSortable(true);
	statusColumn.setRenderTemplate('${ REPORT_STATUS_DISPLAY }');
	statusColumn.addSecondarySortField("EVENT_CD_DISP", TableColumn.SORT.ASCENDING);
	
	//Add the columns to the table
	pathologyTable.addColumn(nameColumn);
	pathologyTable.addColumn(dateColumn);
	pathologyTable.addColumn(statusColumn);
	
	//Bind the data to the results
	pathologyTable.bindData(results);
	
	//Default the sorting to the Date Column descending
	pathologyTable.sortByColumnInDirection("DATE", TableColumn.SORT.DESCENDING);
		
	//Store off the component table
	this.setComponentTable(pathologyTable);
	//Create a cell click callback so we can open documents
	pathologyTable.addExtension(new TableCellClickCallbackExtension().setCellClickCallback(
		function(event, data){
			var pathData = data.RESULT_DATA;
			var target = event.target;
			if(data.COLUMN_ID === "NAME" && $(target).is("a")){
				//If document type clicked call document viewer
				ResultViewer.launchAdHocViewer(pathData.EVENT_ID);
			}
		}
	));
	//Finalize the component using the pathologyTable.render() method to create the table html
	this.finalizeComponent(pathologyTable.render(), MP_Util.CreateTitleText(this, numberResults));
	
	//Update the component result count
	CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
		"count" : numberResults
	});
};

/**
 * Map the Pathology O2 object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "WF_PATH" filter 
 */
MP_Util.setObjectDefinitionMapping("WF_PATH", Pathologyo2Component);
