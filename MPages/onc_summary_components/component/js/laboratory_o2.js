/**
 * The laboratory component style
 *
 * @class
 */
function LaboratoryComponentWFStyle() {
	this.initByNamespace("WF_LAB");
}

LaboratoryComponentWFStyle.prototype = new ComponentStyle();

/**
 * The laboratory component
 *
 * @param {MP_Core.Criterion}
 *                criterion - The criterion containing the requested information
 * @constructor
 */
function LaboratoryComponentWF(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new LaboratoryComponentWFStyle());
	this.setComponentLoadTimerName("USR:MPG.LABORATORY.WF - load component");
	this.setComponentRenderTimerName("ENG:MPG.LABORATORY.WF - render component");
	// setIncludeLineNumber to false so that the count is not shown when no
	// results are found
	this.setIncludeLineNumber(false);
	// Flag for pregnancy onset date lookback time frame
	this.setPregnancyLookbackInd(true);
	this.m_primaryLabel = i18n.discernabu.laboratory_o2.PRIMARY_RESULTS;
	// Placeholders for the various pieces of the Laboratory component
	this.m_tableReferencesSet = false;
	this.m_tableContainer = null;
	this.m_labelTable = null;
	this.m_labelTableContainer = null;
	this.m_labelTableBody = null;
	this.m_contentTableContainer = null;
	this.m_contentTableBody = null;
	this.m_contentTableContents = null;
	this.m_scrollController = null;
	this.m_recordData = null;

	// the side panel object for labs
	this.m_sidePanel = null;
	this.m_sidePanelMinHeight = "187px";
	this.m_graphData = null;
	this.m_plot = null;
	this.m_showPanel = false;
	this.m_sidePanelContainer = null;
	this.m_clickedLabel = null;

	// number of results that will be retrieved from CCL in Flowsheet view
	this.m_flowsheetResultCap = 4000;

	// Number of columns to show for the flowsheet layout if the Latest lookback
	// option is selected
	this.m_latestColumnCap = 0;
	this.m_showingLatestResults = false;

	// If the browser supports Canvas only then show the side panel
	this.SIDE_PANEL_AVAILABLE = CERN_Browser.isCanvasAvailable();
	this.m_ambulatoryColumnCount = 7;

	// Define some of the constants used throughout the component
	this.m_componentHeaderHeight = 34;
	this.m_labelColumnWidth = 204;
	this.m_minColumnWidth = 71;
	this.m_pixelBuffer = 2;

	// These variables hold height or width calculations for various dom
	// elements so they only need to be calculated upon load and resize
	this.m_contentTableWidth = 0;
	this.m_contentTableBodyHeight = 0;
	this.m_contentTableContentsHeight = 0;

	//Display string for custom result range selection option
	this.m_resultRangeSelectionDisplayString = i18n.LATEST + "*";
	// Default the component to utilize the Latest lookback option
	this.setLookbackUnits(10);
	this.setLookbackUnitTypeFlag(ResultRangeSelectionUtility.CustomType);

	// Mapping of element ids and dataObjs for the side panel when a row is
	// selected
	this.m_panelElementData = {};

	//As part of JIRA CERTMPAGES-2121  fix in MPageComponent.js the m_grouper_arr has been used directly which results in null pointer
	// exception if m_grouper_arr.length accessed.
	this.m_grouper_arr = [];
	//store all selected table cell data
	this.m_selectedResultDataObjectList = [];
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
LaboratoryComponentWF.prototype = new MPageComponent();
LaboratoryComponentWF.prototype.constructor = MPageComponent;

LaboratoryComponentWF.prototype.getDiscernObject = function(objectName) {
	if ( typeof objectName !== "string") {
		throw new Error("In LaboratoryComponentWF.prototype.getDiscernObject, invalid parameter objectName");
	}
	return window.external.DiscernObjectFactory(objectName);
};

/**
 * Set up the handler for Toggle click
 *
 * @param {number} index - This indicates the index of the view selected (Flowsheet view is index 0, Ambulatory view is index 1)
 * @returns {undefined} - this function doesn't return anything
 */
LaboratoryComponentWF.prototype.handleHeaderToggleClick = function(index) {
	var compId = this.getComponentId();
	this.setShowAmbulatoryView(index);

	// display a loading spinner when toggling between the two views
	MP_Util.LoadSpinner("WF_LABContent" + compId);

	this.retrieveComponentData();
};

/**
 * Displays a tooltip when hovering over the toggle buttons
 * @returns {undefined} - this function doesn't return anything
 */
LaboratoryComponentWF.prototype.toggleButtonHover = function() {

	this.onmouseover = function(event) {
		var objectClass = $(event.target).attr("class");
		if (objectClass == "hdr-toggle table_active" || objectClass == "hdr-toggle table_inactive") {
			$(event.target).attr("title", i18n.discernabu.laboratory_o2.FLOWSHEET_VIEW);
		}
		else if (objectClass == "hdr-toggle viewer_active" || objectClass == "hdr-toggle viewer_inactive") {
			$(event.target).attr("title", i18n.discernabu.laboratory_o2.AMBULATORY_VIEW);
		}
	};
};

/**
 * I dont believe this section is even being used.
 * @param {String} primaryLabel - Sets the label for the Primary Labs section.
 * @returns {undefined} - this function doesn't return anything
 */
LaboratoryComponentWF.prototype.setPrimaryLabel = function(primaryLabel) {
	this.m_primaryLabel = primaryLabel;
};

LaboratoryComponentWF.prototype.getPrimaryLabel = function() {
	return this.m_primaryLabel;
};

LaboratoryComponentWF.prototype.openTab = function() {
	var criterion = this.getCriterion();
	var sParms = "/PERSONID=" + criterion.person_id + " /ENCNTRID=" + criterion.encntr_id + " /FIRSTTAB=^" + this.getLink() + "+^";
	APPLINK(0, criterion.executable, sParms);
	this.retrieveComponentData();
};

/**
 * The setShowAmbulatoryView function sets a flag which indicates whether to render Ambulatory view by default instead of the
 * Flowsheet view
 *
 * @param {boolean}
 *                showAmbulatoryView - This is a Bedrock indicator indicating if ambulatory view should be set as default
 * @returns {undefined} - this function doesn't return anything
 */
LaboratoryComponentWF.prototype.setShowAmbulatoryView = function(showAmbulatoryView) {
	this.m_showAmbulatoryView = showAmbulatoryView;
};

/**
 * The getShowAmbulatoryView function gets a flag which indicates whether to render Ambulatory view by default instead of the
 * Flowsheet view
 * @returns {Number} this.m_showAmbulatoryView - ShowAmbulatoryView flag determines which view to show, inpatient or ambulatory.
 */
LaboratoryComponentWF.prototype.getShowAmbulatoryView = function() {
	return this.m_showAmbulatoryView;
};

/**
 * The setShowTodayValue function sets a flag which indicates whether to show Today's results in the first column instead of the
 * Latest when rendering the Ambulatory view
 *
 * @param {boolean}
 *                showTodayValue - This is a Bedrock indicator indicating if Today's column should be displayed instead of Latest
 * @returns {undefined} - this function doesn't return anything
 */
LaboratoryComponentWF.prototype.setShowTodayValue = function(showTodayValue) {
	this.m_showTodayValue = showTodayValue;
};

/**
 * The getShowTodayValue function gets a flag which indicates whether to show Today's results in the first column instead of the
 * Latest when rendering the Ambulatory view
 * @returns {Number} this.m_showTodayValue - The flag that determines if today's results is shown rather than latest results
 */
LaboratoryComponentWF.prototype.getShowTodayValue = function() {
	return this.m_showTodayValue;
};

/**
 * The setRecordData function sets the record data
 * @returns {undefined} - this function doesn't return anything
 */
LaboratoryComponentWF.prototype.setRecordData = function(recordData) {
	this.m_recordData = recordData;
};

/**
 * The getRecordData function is to retrieve the record data
 * @returns {{}} - The record data object
 */
LaboratoryComponentWF.prototype.getRecordData = function() {
	return this.m_recordData;
};
/**
 * The setLabelTable function sets the labelTable
 * @returns {undefined} - this function doesn't return anything
 */
LaboratoryComponentWF.prototype.setLabelTable = function(labelTable) {
	this.m_labelTable = labelTable;
};

/**
 * The getLabelTable function is to retrieve the labelTable
 */
LaboratoryComponentWF.prototype.getLabelTable = function() {
	return this.m_labelTable;
};

/**
 * The setSelectedDataObjsList function sets the selectedDataObjsList
 * @param {array} selectedDataObjsList - selected results array
 */
LaboratoryComponentWF.prototype.setSelectedDataObjsList = function(selectedDataObjsList) {
	this.m_selectedResultDataObjectList = selectedDataObjsList;
};

/**
 * The getSelectedDataObjsList function is to retrieve the selectedDataObjsList
 * @return {array} selected results array
 */
LaboratoryComponentWF.prototype.getSelectedDataObjsList = function() {
	return this.m_selectedResultDataObjectList;
};

/**
 * The toggleLabelTableExtension function expands or collapses the labelTable group based on whether the passed in parameter
 * is open or collapsed.
 * @param {jQuery.Event}
 *                event - The DOM event that occurred.
 * @param {Object}
 *                data - The data used for the check for expanded/collapsed.
 */
LaboratoryComponentWF.prototype.toggleLabelTableExtension = function(event, data) {
	var labelTable = this.getLabelTable();
	// Make sure to collapse the label table section as well
	if (data.GROUP_DATA.EXPANDED) {
		labelTable.openGroup(data.GROUP_DATA.GROUP_ID);
	} else {
		labelTable.collapseGroup(data.GROUP_DATA.GROUP_ID);
	}
	// Call the resize function since the visible area has changed
	this.resizeComponent();
};

/**
 * The clearSelectedResults function is to deselect all the selected result cell and return
 * and sets the selectedDataObjsList with an empty array list
 */
LaboratoryComponentWF.prototype.clearSelectedResults = function() {
	var selectedDataObjsList = this.getSelectedDataObjsList();
	$.each(selectedDataObjsList, function(i, elem) {
		$(elem.selectedElem).removeClass("lab-selected-res-tagging");
	});
	selectedDataObjsList = [];
	this.setSelectedDataObjsList(selectedDataObjsList);
};

/**
 * The selectTargetResultCell function is to select the result cell that has been clicked
 * and sets the selectedDataObjsList with the new selected result list
 * @param {domElement} selectedResElem - dom element of selected result cell
 * @param {json} resultData - result data of selected result cell
 */
LaboratoryComponentWF.prototype.selectTargetResultCell = function(selectedResElem, resultData) {
	var selectedList = [];
	var selectedResCell = {selectedElem: selectedResElem, selectedResObj: resultData};
	var selectedDataObjsList = this.getSelectedDataObjsList();
	selectedDataObjsList.push(selectedResCell);
	$(selectedResElem).addClass("lab-selected-res-tagging");
	//removing duplicates from the list
	$.each(selectedDataObjsList, function(index, result) {
		if ($.inArray(result, selectedList) == -1){
			selectedList.push(result);
		}
	});
	this.setSelectedDataObjsList(selectedList);
};

/**
 * The deselectTargetResultCell function is to deselect the result cell if the user want to deselect an already selected result
 * @param {domElement} selectedResElem - dom element of selected result cell
 */
LaboratoryComponentWF.prototype.deselectTargetResultCell = function(selectedResElem) {
	var selectedList = [];
	$(selectedResElem).removeClass("lab-selected-res-tagging");
	var selectedDataObjsList = this.getSelectedDataObjsList();
	//removing duplicates from the list
	$.each(selectedDataObjsList, function(index, e) {
		var resElem = e.selectedElem;
		if($(resElem).hasClass("lab-selected-res-tagging") && $.inArray(e, selectedList) == -1){
			selectedList.push(e);
		}else{
			delete selectedList[index];
		}
	});
	this.setSelectedDataObjsList(selectedList);
};

/**
 * The multipleResultSelection function selects all the result data within the provided range
 * and sets the selectedDataObjsList with the new selected result list
 * @param {domElement} labTable - dom element of lab component table
 * @param {object} firstSelectedRes - first selected result cell element
 * @param {object} lastSelectedRes - last selected result cell element
 *
 */
LaboratoryComponentWF.prototype.multipleResultSelection = function(labTable, firstSelectedRes, lastSelectedRes){
	var compId = this.getStyles().getId();
	var selectedDataObjsList = [];
	var resultCell = null;
	var temp;
	var firstSelectedResDataObj = firstSelectedRes.selectedResObj;
	var firstSelectedResElem = firstSelectedRes.selectedElem;
	var lastSelectedResDataObj = lastSelectedRes.selectedResObj;
	var lastSelectedResElem = lastSelectedRes.selectedElem;

	var firstSelectedResColumnId = firstSelectedResDataObj.COLUMN_ID;
	var lastSelectedResColumnId = lastSelectedResDataObj.COLUMN_ID;
	//rowIndex and columnIndex for the clicked result cell
	var firstSelectedResElemRowIndex = parseInt($(firstSelectedResElem).attr("rowIndex"), 10);
	var lastSelectedResElemRowIndex = parseInt($(lastSelectedResElem).attr("rowIndex"), 10);
	var firstSelectedResElemColIndex = parseInt($(firstSelectedResElem).attr("colIndex"), 10);
	var lastSelectedResElemColIndex = parseInt($(lastSelectedResElem).attr("colIndex"), 10);

	if(firstSelectedResColumnId === lastSelectedResColumnId){//multiple selection across columns within same time frame
		if(firstSelectedResElemRowIndex >= lastSelectedResElemRowIndex){
			temp = firstSelectedResElemRowIndex;
			firstSelectedResElemRowIndex = lastSelectedResElemRowIndex;
			lastSelectedResElemRowIndex = temp;
		}
		resultCell = $(".colIndex" + compId + firstSelectedResElemColIndex);
		resultCell.each(function(index){
			var nextElemRowIndex = $(this).attr("rowIndex");
			if(nextElemRowIndex !== undefined && nextElemRowIndex >= firstSelectedResElemRowIndex && nextElemRowIndex <= lastSelectedResElemRowIndex){
				var resultData = ComponentTableDataRetriever.getResultFromTable(labTable, this);
				if(resultData.TIME_BUCKETS[firstSelectedResColumnId].DISPLAY !== "--"){
					var resultObj = {COLUMN_ID: firstSelectedResColumnId, RESULT_DATA: resultData};
					var selectedResCell = {selectedElem: this, selectedResObj: resultObj};
					selectedDataObjsList.push(selectedResCell);
					$(this).addClass("lab-selected-res-tagging");
				}
			}
		});
	}else if(firstSelectedResElemRowIndex === lastSelectedResElemRowIndex){//multiple selection in same row across time
		if(firstSelectedResElemColIndex >= lastSelectedResElemColIndex){
			temp = firstSelectedResElemColIndex;
			firstSelectedResElemColIndex = lastSelectedResElemColIndex;
			lastSelectedResElemColIndex = temp;
		}
		resultCell = $(".rowIndex" + compId + firstSelectedResElemRowIndex);
		resultCell.each(function(){
			var nextElemcolIndex = $(this).attr("colIndex");
			if((nextElemcolIndex !== undefined) && (nextElemcolIndex >= firstSelectedResElemColIndex && nextElemcolIndex <= lastSelectedResElemColIndex)){
				var resultData = ComponentTableDataRetriever.getResultFromTable(labTable, this);
				var columnId = ComponentTableDataRetriever.getColumnIdFromElement(labTable, this);
				if(resultData.TIME_BUCKETS[columnId].DISPLAY !== "--"){
					var resultObj = {COLUMN_ID: columnId, RESULT_DATA: resultData};
					var selectedResCell = {selectedElem: this, selectedResObj: resultObj};
					selectedDataObjsList.push(selectedResCell);
					$(this).addClass("lab-selected-res-tagging");
				}
			}
		});
	}
	this.setSelectedDataObjsList(selectedDataObjsList);
};

/**
 * Tags a list of results selected by the user
 *
 * @param {Object}
 *                selectedResultList - The selected results to be tagged.
 */
LaboratoryComponentWF.prototype.tagResult = function (selectedResultList) {
	var criterion = this.getCriterion();
	var category_mean = criterion.category_mean;
	var capTimer = null;
	var resultTagList = [];
	var selectedResLen = selectedResultList.length;
	for (var i = selectedResLen; i--; ) {
		var result = selectedResultList[i].selectedResObj;
		var columnId = result.COLUMN_ID;
		// Grab the face up result we are tagging
		var results = result.RESULT_DATA.TIME_BUCKETS[columnId].OBJECT_ARR;
		var resultTag = new TaggedResult();
		if (results.length) {
			var resultObj = results[0];
			// Just tag the face up result which will be the first in the OBJECT_ARR
			resultTag.setTagEntityId(resultObj.EVENT_ID);
			resultTag.setTagDateTime(new Date());
			resultTag.setCategorizationArray(["Laboratory"]);
			resultTag.setEMRType("LABS");
			resultTagList.push(resultTag);
		}
	}
	// Fire off the tagged result call to the tagging handler
	MP_TaggingHandler.saveTaggedResults(resultTagList);
	// We need the cap timers to log how often user tags the results
	capTimer = new CapabilityTimer("CAP:MPG Labs O2 Result Tagging", category_mean);
	if(capTimer){
		capTimer.addMetaData("rtms.legacy.metadata.1", "Result Tagging");
		capTimer.capture();
	}
};

/**
 * Create the filter mappings for the LaboratoryComponentWF component
 */
LaboratoryComponentWF.prototype.loadFilterMappings = function() {
	// Add the filter mapping object for the Primary Labs subsection label
	this.addFilterMappingObject("WF_LAB_PRIMARY_LABEL", {
		setFunction: this.setPrimaryLabel,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	// Add the filter mapping for the Specialty Filters Groups
	this.addFilterMappingObject("WF_LAB_SPECIALTY_GRP1_ES", {
		setFunction: this.setGrp1Criteria,
		type: "ARRAY",
		field: "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("WF_LAB_SPECIALTY_GRP1_LABEL", {
		setFunction: this.setGrp1Label,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("WF_LAB_SPECIALTY_GRP2_ES", {
		setFunction: this.setGrp2Criteria,
		type: "ARRAY",
		field: "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("WF_LAB_SPECIALTY_GRP2_LABEL", {
		setFunction: this.setGrp2Label,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("WF_LAB_SPECIALTY_GRP3_ES", {
		setFunction: this.setGrp3Criteria,
		type: "ARRAY",
		field: "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("WF_LAB_SPECIALTY_GRP3_LABEL", {
		setFunction: this.setGrp3Label,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("WF_LAB_SPECIALTY_GRP4_ES", {
		setFunction: this.setGrp4Criteria,
		type: "ARRAY",
		field: "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("WF_LAB_SPECIALTY_GRP4_LABEL", {
		setFunction: this.setGrp4Label,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("WF_LAB_SPECIALTY_GRP5_ES", {
		setFunction: this.setGrp5Criteria,
		type: "ARRAY",
		field: "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("WF_LAB_SPECIALTY_GRP5_LABEL", {
		setFunction: this.setGrp5Label,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("WF_LAB_SPECIALTY_GRP6_ES", {
		setFunction: this.setGrp6Criteria,
		type: "ARRAY",
		field: "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("WF_LAB_SPECIALTY_GRP6_LABEL", {
		setFunction: this.setGrp6Label,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("WF_LAB_SPECIALTY_GRP7_ES", {
		setFunction: this.setGrp7Criteria,
		type: "ARRAY",
		field: "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("WF_LAB_SPECIALTY_GRP7_LABEL", {
		setFunction: this.setGrp7Label,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("WF_LAB_SPECIALTY_GRP8_ES", {
		setFunction: this.setGrp8Criteria,
		type: "ARRAY",
		field: "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("WF_LAB_SPECIALTY_GRP8_LABEL", {
		setFunction: this.setGrp8Label,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("WF_LAB_SPECIALTY_GRP9_ES", {
		setFunction: this.setGrp9Criteria,
		type: "ARRAY",
		field: "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("WF_LAB_SPECIALTY_GRP9_LABEL", {
		setFunction: this.setGrp9Label,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("WF_LAB_SPECIALTY_GRP10_ES", {
		setFunction: this.setGrp10Criteria,
		type: "ARRAY",
		field: "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("WF_LAB_SPECIALTY_GRP10_LABEL", {
		setFunction: this.setGrp10Label,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	// Add the filtermapping for the InfoButton
	this.addFilterMappingObject("WF_LAB_INFO_BUTTON_IND", {
		setFunction: this.setHasInfoButton,
		type: "BOOLEAN",
		field: "FREETEXT_DESC"
	});

	// Add the filter mappings for Ambulatory View
	this.addFilterMappingObject("WF_LAB_DISPLAY", {
		setFunction: this.setShowAmbulatoryView,
		type: "BOOLEAN",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("WF_LAB_RESULTS_IND", {
		setFunction: this.setShowTodayValue,
		type: "BOOLEAN",
		field: "FREETEXT_DESC"
	});
};

/**
 * Resize the component
 */
LaboratoryComponentWF.prototype.resizeComponent = function() {
	var columnWidth = this.m_minColumnWidth;
	var compDOMObj = null;
	var compId = this.getStyles().getId();
	var componentHeight = 0;
	var contentTable = null;
	var contentTableContainerHeight = 0;
	var contentTableWidth = 0;
	var headerHeight = this.m_componentHeaderHeight;
	var labelTableContainerWidth = this.m_labelColumnWidth;
	var maxHeight = 0;
	var miscHeight = 10;
	var pixelBuffer = this.m_pixelBuffer;
	var scrollerWidth = 18;
	var secContentWidth = 0;
	var tableHeight = 0;
	var timeBucketCnt = 0;
	var viewContainer = null;
	var viewContainerHeight = 0;

	// Reset all of the previously made calculations based on the size of the
	// components
	this.resetSizingCalculations();

	// Check to see that all of the cached references are valid
	if (!this.m_tableReferencesSet) {
		return;
	}
	contentTable = $("#" + compId + "Contenttable");

	// Return if this components isn't being displayed
	if (!this.isDisplayable()) {
		return;
	}

	// grab the container for this MPages Workflow View
	viewContainer = $("#vwpBody");
	if (!viewContainer.length) {
		return;
	}

	// Make sure component is rendered
	compDOMObj = $("#" + compId);
	if (!compDOMObj.length) {
		return;
	}

	// Get the current width of the section content
	secContentWidth = $(this.getSectionContentNode()).width();

	/*
	 * check if side panel is shown if so, subtract its width from sec content because the table is then set to use the remaining width
	 * and space must be left for the side panel
	 */
	if (this.SIDE_PANEL_AVAILABLE && this.m_showPanel) {
		var panelWidth = $("#" + compId + "sidePanelContainer");
		if (panelWidth.length) {
			panelWidth = panelWidth.outerWidth();
			secContentWidth -= panelWidth;
		}
	}

	// Determine the maxHeight for our component
	componentHeight = compDOMObj.height();
	contentTableContainerHeight = this.m_contentTableContainer.height();
	viewContainerHeight = viewContainer.height();

	// calculate the current height of the tables
	this.m_contentTableBody.children("div").each(function() {
		tableHeight += $(this).height();
	});

	// Determine the maxHeight for the table Container
	maxHeight = viewContainerHeight - (componentHeight - contentTableContainerHeight + miscHeight);

	// Apply the scroller if necessary
	if ((tableHeight + headerHeight + scrollerWidth) > maxHeight) {
		// Show the scrollController
		this.m_scrollController.css("max-height", maxHeight - headerHeight - scrollerWidth).addClass("labs-wf-scroll-controller-visible");
		this.m_scrollController.find(".labs-wf-scroller-content").height(tableHeight + scrollerWidth);
		this.m_contentTableContainer.width(secContentWidth - labelTableContainerWidth - scrollerWidth);

		// Adjust the max-height of the table containers
		this.m_labelTableContainer.css("max-height", maxHeight - scrollerWidth + pixelBuffer + "px");
		this.m_contentTableContainer.css("max-height", maxHeight + "px");

		// Grab the table bodies and resize so we can scroll
		this.m_labelTableBody.css("max-height", maxHeight - headerHeight - scrollerWidth + "px");
		this.m_contentTableBody.css("max-height", maxHeight - headerHeight - scrollerWidth + "px");

		// IE8 fix to adjust for scroll bar calculation
		contentTableContainerHeight = this.m_contentTableContainer.height();
		if ((contentTableContainerHeight - contentTable.height()) > 20) {
			this.m_contentTableContainer.css("max-height", (maxHeight - scrollerWidth) + "px");
		}
		else {
			this.m_contentTableContainer.css("max-height", maxHeight + "px");
		}
	}
	else {
		// Remove the scroller if shown
		if (this.m_scrollController.hasClass("labs-wf-scroll-controller-visible")) {
			this.m_scrollController.removeClass("labs-wf-scroll-controller-visible").addClass("labs-wf-scroll-controller-hidden");
			// Adjust the size of the content table
			this.m_contentTableContainer.width(secContentWidth - labelTableContainerWidth);
		}

		// Adjust the max-height of the table containers
		this.m_labelTableContainer.css("max-height", "");
		this.m_contentTableContainer.css("max-height", "");

		// Grab the table bodies and resize so we can scroll
		this.m_labelTableBody.css("max-height", "");
		this.m_contentTableBody.css("max-height", "");
	}

	// Adjust the width of the component before grabbing heights since the old
	// width may have caused the tables to wrap
	if (this.m_scrollController.hasClass("labs-wf-scroll-controller-visible")) {
		this.m_contentTableContainer.width(secContentWidth - labelTableContainerWidth - scrollerWidth);
		contentTableWidth = secContentWidth - labelTableContainerWidth - scrollerWidth - pixelBuffer;
	}
	else {
		this.m_contentTableContainer.width(secContentWidth - labelTableContainerWidth);
		contentTableWidth = secContentWidth - labelTableContainerWidth - pixelBuffer;
	}

	// Adjust the size of the columns
	timeBucketCnt = contentTable.find(".header-item").length;
	if (timeBucketCnt > 0) {
		if (contentTableWidth > (timeBucketCnt * columnWidth)) {
			// Change the column width so the columns will fill the available space
			columnWidth = Math.floor(contentTableWidth / timeBucketCnt);
		}

		contentTable.width(timeBucketCnt * columnWidth + pixelBuffer);
		contentTable.find(".labs-wf-content-col").css("width", columnWidth);

		if (this.getShowAmbulatoryView()) {
			// Find width of the content table for the 'Previous' label to align centrally
			contentTableWidth = contentTable.width();
			// Subtract the width for the Today's column i.e 1 columnWidth
			var previousColumnHeaderWidth = (contentTableWidth - columnWidth) / 2;
			// Increase width of the column header holding 'Previous' label and apply proper css
			$("#WF_LAB" + this.getComponentId() + "ContentcolumnHeaderResultColumn1").width(previousColumnHeaderWidth + "px");
			if (this.getShowTodayValue() && this.getDateFormat() != 4) {
				contentTable.find(".table-cell.labs-wf-ambulatory-latest-col").addClass("labs-wf-first-column-result");
			}
		}
		if (this.m_sidePanel) {
			// get the latest height of table
			tableHeight = $("#WF_LAB" + this.getComponentId() + "TableContainer").css("height");
			this.m_sidePanel.setHeight(tableHeight);

			// call the side panels resize function
			if (this.m_showPanel) {
				this.m_sidePanel.resizePanel();

				// Replot the graph
				var labPlot = this.getLabPlot();
				if (labPlot) {
					labPlot.replot();
				}
			}
		}
	}
};

/**
 * This function is used to scroll the various containers in unison
 */
LaboratoryComponentWF.prototype.scrollTables = function(event) {
	var compId = this.getStyles().getId();
	// Check to see if the scroller is visible and that the tables have been created
	var scrollerTop = 0;
	if (this.m_tableReferencesSet && this.m_scrollController.hasClass("labs-wf-scroll-controller-visible")) {
		scrollerTop = this.m_scrollController.scrollTop();
		if (event.type === "mousewheel") {
			var delta = event.originalEvent.wheelDeltaY || event.originalEvent.wheelDelta;
			scrollerTop -= delta;
			this.m_scrollController.scrollTop(scrollerTop);
		}
		// Apply the correct scrolling to the table bodies
		this.m_labelTableBody.scrollTop(scrollerTop);
		this.m_contentTableBody.scrollTop(scrollerTop);

		return (scrollerTop <= 0 || (scrollerTop + this.getContentTableBodyHeight() >= this.getContentTableContentsHeight()));
	}
};

/**
 * This function is responsible for creating the disclaimer message that will be show to the user when the Latest lookback option is
 * selected
 *
 * @return {string} An i18n string shown the Latest disclaimer
 */
LaboratoryComponentWF.prototype.createDisclaimerMessage = function() {
	var lookbackDisplay = "";
	switch (this.getBrLookbackUnitTypeFlag()) {
		case 1:
			lookbackDisplay = i18n.discernabu.LAST_N_HOURS_LOWER.replace("{0}", this.getBrLookbackUnits());
			break;
		case 2:
			lookbackDisplay = i18n.discernabu.LAST_N_DAYS_LOWER.replace("{0}", this.getBrLookbackUnits());
			break;
		case 3:
			lookbackDisplay = i18n.discernabu.LAST_N_WEEKS_LOWER.replace("{0}", this.getBrLookbackUnits());
			break;
		case 4:
			lookbackDisplay = i18n.discernabu.LAST_N_MONTHS_LOWER.replace("{0}", this.getBrLookbackUnits());
			break;
		case 5:
			lookbackDisplay = i18n.discernabu.LAST_N_YEARS_LOWER.replace("{0}", this.getBrLookbackUnits());
			break;
		default:
			lookbackDisplay = (this.getScope() === 2) ? i18n.discernabu.SELECTED_VISIT_LOWER : i18n.discernabu.All_VISITS_LOWER;
	}
	return "* " + i18n.discernabu.FLOWSHEET_DISCLAIMER.replace("{0}", this.m_latestColumnCap).replace("{1}", lookbackDisplay);
};

/**
 * Create the component menu items and their associated actions
 */
LaboratoryComponentWF.prototype.preProcessing = function() {
	var advFiltMenu = null;
	var compId = this.getStyles().getId();
	var compMenu = this.getMenu();
	var facilityDefinedDisplay = i18n.discernabu.FACILITY_DEFINED_VIEW;
	var groupLength = this.m_grouper_arr.length;
	var labI18n = i18n.discernabu.laboratory_o2;
	var self = this;

	// Check to see if the component is displayable and if there is a component
	// menu
	if (!this.isDisplayable() || !compMenu) {
		return;
	}
	// Add the custom Latest lookback unit to the list of available lookback selections
	var customMenuItem = new ResultRangeSelection();
	customMenuItem.setType(ResultRangeSelectionUtility.CustomType);
	customMenuItem.setDirection(ResultRangeSelectionUtility.direction.BACKWARD);
	customMenuItem.setUnits(0);
	customMenuItem.setScope(this.getScope());
	customMenuItem.setDisplay(this.m_resultRangeSelectionDisplayString);
	ResultRangeSelectionUtility.addCustomResultRangeSelectionItem(this, customMenuItem);

	// Create the menu item for the Advanced Filtering Dialog
	var labsFiltItem = new MenuSelection("compFilters" + compId);
	labsFiltItem.setLabel(labI18n.FILTERS).setClickFunction(function() {
		// If advFiltMenu is not created go ahead and create it
		if (!advFiltMenu) {
			advFiltMenu = new AdvancedFilterMenu("advancedFilterMenu" + compId).setIsRootMenu(true).setIsPersistent(true).setLabel(labI18n.FILTERS);
			advFiltMenu.setWidth(300);
			advFiltMenu.setAnchorElementId(compMenu.getAnchorElementId());
			advFiltMenu.setContentParentId(compId);
			advFiltMenu.setAnchorConnectionCorner(["bottom", "right"]);
			advFiltMenu.setContentConnectionCorner(["top", "right"]);

			// Set the save and cancel buttons
			advFiltMenu.setSaveButtonLabel(labI18n.APPLY);
			advFiltMenu.setIsSaveButtonEnabled(true);
			advFiltMenu.setCancelButtonLabel(i18n.CANCEL);
			advFiltMenu.setIsCancelButtonEnabled(true);

			// Set the action link details
			advFiltMenu.setIsActionLinkEnabled(true);
			advFiltMenu.setActionLinkLabel(i18n.discernabu.RESET_ALL);
			advFiltMenu.setActionLinkFunction(function() {
				// Uncheck all of the filters except for the
				// Facility defined filters item
				var advFiltMenuContents = $("#advFiltMenu" + compId);
				advFiltMenuContents.find(":checked").removeAttr("checked");
				advFiltMenuContents.find(":first-child").find("input").attr("checked", "checked");
			});

			// Create the function for the "Apply" button
			advFiltMenu.setSaveFunction(function() {
				// Show the loading image over the
				// current lab
				// results
				MP_Util.LoadSpinner(compId + "TableContainer");

				// Grab all of the checked filters and
				// add them to the grouperFilterCriteria
				var advFiltMenuContents = $("#advFiltMenu" + compId);
				var filters = [];
				// This next line gets all of the
				// elements that
				// have been checked and
				// grabs their next sibling which
				// contains the
				// filter display
				advFiltMenuContents.find(":checked").next().each(function(indx, element) {
					filters.push(element.innerHTML);
				});

				self.setGrouperFilterCriteria(filters);
				// Close the Menu
				MP_MenuManager.closeMenuStack(true);
				// Call the function to re-gather the
				// data
				self.retrieveComponentData();
				// Save user preferences
				MP_Core.AppUserPreferenceManager.UpdateSingleCompPreferences(self, true);
			});

			// Define cancel function
			advFiltMenu.setCancelFunction(function() {
				// Close the menuStack
				MP_MenuManager.closeMenuStack(true);
			});

			// Define the function that will create the content
			// of the Advanced Filter Menu
			advFiltMenu.setAdvancedFilterCreationFunction(function() {
				var container = null;
				var filterChecked = "";
				var filterCnt = 0;
				var group = null;
				var groupCnt = 0;
				var groupSelection = null;
				var grouperFilterCriteria = self.getGrouperFilterCriteria();
				var selectedFilters = {};
				var x = 0;

				// This function is used to create click
				// actions for each filter selection
				creatFilterClickFunc = function(filter) {
					return function() {
						var checkbox = filter.find(":checkbox");
						if ( typeof checkbox.attr("checked") != "undefined") {
							checkbox.removeAttr("checked");
						}
						else {
							checkbox.attr("checked", "checked");
						}
					};
				};

				// Loop through all of the currently
				// select filters and create a map for
				// quick access
				if (grouperFilterCriteria) {
					filterCnt = grouperFilterCriteria.length;
					for ( x = filterCnt; x--; ) {
						selectedFilters[grouperFilterCriteria[x]] = true;
					}
				}

				// Create the overall container for the
				// filter selection
				container = $("<div id='advFiltMenu" + compId + "'></div>");

				// Create the HTML markup for the
				// facility defined view
				filterChecked = (filterCnt === 0 || typeof selectedFilters[facilityDefinedDisplay] !== "undefined") ? "checked='checked'" : "";
				groupSelection = $("<div class='labs-wf-filter'><input type=checkbox " + filterChecked + " onclick='event.cancelBubble=true;' class='labs-wf-filter-checkbox' /><span class='labs-wf-filter-label'>" + facilityDefinedDisplay + "</span></div>");
				groupSelection.click(creatFilterClickFunc(groupSelection));
				container.append(groupSelection);

				// Create HTML markups for all of the
				// valid specialty filter groups
				// available
				if (self.m_grouper_arr && self.m_grouper_arr.length) {
					groupCnt = self.m_grouper_arr.length;
					for ( x = 0; x < groupCnt; x++) {
						group = self.m_grouper_arr[x];
						// Check to see if this group is
						// defined since there can be
						// gaps in the array. Also make
						// sure there is a label and
						// associated results
						if (group && group.label && group.criteria && group.criteria.length) {
							filterChecked = ( typeof selectedFilters[group.label] !== "undefined") ? "checked='checked'" : "";
							groupSelection = $("<div class='labs-wf-filter'><input type=checkbox onclick='event.cancelBubble=true;' " + filterChecked + " class='labs-wf-filter-checkbox' /><span title='" + group.label + "' class='labs-wf-filter-label'>" + group.label + "</span></div>");
							groupSelection.click(creatFilterClickFunc(groupSelection));
							container.append(groupSelection);
						}
					}
				}
				return container;
			});
			// Add the AdvancedFilterMenu we created to the
			// collection
			MP_MenuManager.addMenuObject(advFiltMenu);
		}
		// Show the menu to the user
		MP_MenuManager.showMenu("advancedFilterMenu" + compId);
	});
	// Add the menuItem to the component menu
	compMenu.addMenuItem(labsFiltItem);
	// Create the menu item for the Infobutton functionality if it is available
	// and it is loaded from PowerChart
	if (this.hasInfoButton()) {
		// Add a menu seperator
		compMenu.addMenuItem(new MenuSeparator());
		var infoButtonSelection = new MenuSelection(compId + "InfoButton").setIsSelected(this.isInfoButtonEnabled());
		infoButtonSelection.setLabel(i18n.discernabu.INFO_BUTTON);
		infoButtonSelection.setCloseOnClick(false);
		infoButtonSelection.setClickFunction(function(clickEvent) {
			if (infoButtonSelection.isSelected()) {
				// Make the info button elements visible
				if (self.m_tableReferencesSet) {
					self.m_labelTableContainer.addClass("labs-wf-info-button-active");
				}
				self.setIsInfoButtonEnabled(1);
			}
			else {
				// Hide the info button elements
				if (self.m_tableReferencesSet) {
					self.m_labelTableContainer.removeClass("labs-wf-info-button-active");
				}
				self.setIsInfoButtonEnabled(0);
			}
			// Update the component preferences
			MP_Core.AppUserPreferenceManager.UpdateSingleCompPreferences(self, true);
		});
		compMenu.addMenuItem(infoButtonSelection);
	}

	// Retrieve the preferences for ambulatory view and set the toggle
	if (this.getShowAmbulatoryView()) {
		this.setActiveHeaderToggleIndex(1);
	}
	else {
		this.setActiveHeaderToggleIndex(0);
	}
	this.setHeaderToggleStyles([{
		active: "table_active",
		inactive: "table_inactive"
	}, {
		active: "viewer_active",
		inactive: "viewer_inactive"
	}]);
};

/**
 * This function is used to reset any sizing calculations made within the component. This allows us to cache previously computed
 * sizes without having to recalculate each time we
 * need a specific size
 */
LaboratoryComponentWF.prototype.resetSizingCalculations = function() {
	this.m_latestColumnCap = 0;
	this.m_contentTableWidth = 0;
	this.m_contentTableBodyHeight = 0;
	this.m_contentTableContentsHeight = 0;
};

/**
 * This function calculates the number of results that will fit within the current width of the component. This calculation is
 * utilized when the 'Latest' lookback option is
 * selected
 *
 * @return {number} The maximum number of columns that will fit within the viewable flowsheet without scrolling
 */
LaboratoryComponentWF.prototype.calculateLatestColumnCap = function() {
	var columnWidth = this.m_minColumnWidth;
	var contentTableWidth = 0;

	if (this.m_latestColumnCap === 0) {
		// Grab the contentTableWidth
		contentTableWidth = this.calculateContentTableWidth();

		// Divide the result by the hardcoded width (minus one of the columns
		// min-width).
		this.m_latestColumnCap = Math.floor(contentTableWidth / columnWidth) - 1;
	}
	return this.m_latestColumnCap;
};

/**
 * This function calculates the width of the content table. If the width has already been calculated, the existing calculation will
 * be returned.
 *
 * @return {number} The width (in pixels) of the content table.
 */
LaboratoryComponentWF.prototype.calculateContentTableWidth = function() {
	var labelColumnWidth = this.m_labelColumnWidth;
	var pixelBuffer = this.m_pixelBuffer;
	var compId = this.getStyles().getId();

	if (this.m_contentTableWidth === 0) {
		this.m_contentTableWidth = $(this.getSectionContentNode()).width() - labelColumnWidth - pixelBuffer;

		// check if side panel is shown if so, subtract its width from sec
		// content
		if (this.SIDE_PANEL_AVAILABLE && this.m_showPanel) {
			var panelWidth = $("#" + compId + "sidePanelContainer");
			if (panelWidth.length) {
				panelWidth = panelWidth.outerWidth();
				this.m_contentTableWidth -= panelWidth;
			}
		}
	}
	return this.m_contentTableWidth;
};

/**
 * This function returns the height of the content table body.
 *
 * @return {number} The current height of the content table body
 */
LaboratoryComponentWF.prototype.getContentTableBodyHeight = function() {
	if (this.m_contentTableBodyHeight === 0) {
		this.m_contentTableBodyHeight = this.m_contentTableBody.height();
	}
	return this.m_contentTableBodyHeight;
};

/**
 * This function returns the height of the content table body.
 *
 * @return {number} The current height of the content table body
 */
LaboratoryComponentWF.prototype.getContentTableContentsHeight = function() {
	if (this.m_contentTableContentsHeight === 0) {
		this.m_contentTableContentsHeight = this.m_contentTableContents.height();
	}
	return this.m_contentTableContentsHeight;
};

/**
 * Make the necessary script call to retrieve the labs data
 */
LaboratoryComponentWF.prototype.retrieveComponentData = function() {
	var columnCap = 0;
	var component = this;
	var viewCategoryMean = this.getCriterion().category_mean;
	var loadTimer = new RTMSTimer(this.getComponentLoadTimerName(), viewCategoryMean);
	var renderTimer = new RTMSTimer(this.getComponentRenderTimerName(), viewCategoryMean);
	var criterion = this.getCriterion();
	var encntrSelection = "";
	var eventSetArrCnt = 0;
	var eventSet = 0;
	var eventSets = null;
	var eventSetString = "";
	var eventSetCnt = 0;
	var facilityDefinedDisplay = i18n.discernabu.FACILITY_DEFINED_VIEW;
	var filterMap = {};
	var uniqueEventSets = {
		SORT_ARRAY: []
	};
	var group = null;
	var groups = this.getGroups();
	var grouperFilterCriteria = "";
	var loadDefaults = false;
	var loadLatestResults = false;
	var lookbackItems = this.getLookbackMenuItems() || [];
	var lookbackUnits = 0;
	var lookbackType = 0;
	var primaryEventSets = 0.0;
	var resultCap = 0;
	var sendAr = [];
	var secondaryEventSets = [];
	var userPrefs = null;
	var userLookbackPrefs = null;
	var x = 0;
	var y = 0;

	// set m_showPanel back to false since we want to collapse the
	// panel upon any new load (toggling views, changing lookback, etc)
	this.m_showPanel = false;
	this.m_clickedLabel = null;

	// Loop through all of the Available filters and map them
	if (this.m_grouper_arr && this.m_grouper_arr.length) {
		for ( x = this.m_grouper_arr.length; x--; ) {
			group = this.m_grouper_arr[x];
			// Check to see if this group is defined since there can be gaps in
			// the array
			if (group) {
				filterMap[group.label] = group;
			}
		}
	}
	// Check the users selected filters and update the map so we can include
	// those event sets also filter out duplicate event sets at the same time
	grouperFilterCriteria = this.getGrouperFilterCriteria();
	if (grouperFilterCriteria && grouperFilterCriteria.length) {
		for ( x = grouperFilterCriteria.length; x--; ) {
			group = grouperFilterCriteria[x];
			if (facilityDefinedDisplay === group) {
				// The user has filters selected, but also has the Facility
				// Defined still selected
				loadDefaults = true;
				// Create a place holder for the Facility Defined Filters
				filterMap[group] = {
					label: facilityDefinedDisplay,
					criteria: []
				};
			}
			else {
				// Add this group's event sets to the uniqueEventSets object if
				// it exists
				if ( typeof filterMap[group] !== "undefined") {
					uniqueEventSets.SORT_ARRAY[x + 1] = filterMap[group].criteria;
				}
			}
		}
	}
	else {
		// The user doesn't have any filters selected so we should load the
		// defaults
		filterMap[facilityDefinedDisplay] = {
			label: facilityDefinedDisplay,
			criteria: []
		};
		loadDefaults = true;
	}

	// If the loadDefaults flag is set we need to load the Primary and Secondary
	// Event Sets
	if (loadDefaults && groups && groups.length) {
		for ( x = groups.length; x--; ) {
			group = groups[x];
			switch (group.getGroupName()) {
				case "WF_LAB_PRIMARY_CE":
				case "WF_LAB_PRIMARY_CE_SEQ":
					// values are event sets
					primaryEventSets = MP_Util.CreateParamArray(group.getEventSets(), 1);
					break;
				case "WF_LAB_SECONDARY_ES":
					// Load the secondary event sets into the group created for the
					// Facility Defined group
					filterMap[facilityDefinedDisplay].criteria = group.getEventSets();
					// Make sure all of the event sets for the Facility Defined set
					// get added to the uniqueEventSets object
					uniqueEventSets.SORT_ARRAY[0] = filterMap[facilityDefinedDisplay].criteria;
					break;
				default:
					break;
			}
		}
	}
	// Create the secondary event sets parameter
	eventSetArrCnt = uniqueEventSets.SORT_ARRAY.length;
	for ( x = 0; x < eventSetArrCnt; x++) {
		eventSets = uniqueEventSets.SORT_ARRAY[x];
		if (eventSets) {
			eventSetCnt = eventSets.length;
			for ( y = 0; y < eventSetCnt; y++) {
				eventSet = eventSets[y];
				eventSetString = eventSet.toString();
				if ( typeof uniqueEventSets[eventSetString] == "undefined") {
					uniqueEventSets[eventSetString] = true;
					secondaryEventSets.push(eventSet);
				}
			}
		}
	}

	// Determine the result cap based on the current view type and lookback
	// selection
	lookbackUnits = this.getLookbackUnits();
	lookbackType = this.getLookbackUnitTypeFlag();

	// See if we need to load the latest results or rely on the user preferences
	if (lookbackType === ResultRangeSelectionUtility.CustomType) {
		lookbackUnits = this.getBrLookbackUnits();
		lookbackType = this.getBrLookbackUnitTypeFlag();
		// We utilize the column count + 5 so hopefully we will not run into the
		// scenario where we have multiple results in one time bucket and empty
		// cells
		columnCap = this.calculateLatestColumnCap();
		this.m_flowsheetResultCap = columnCap + 5;
		this.m_showingLatestResults = true;
	}
	else {
		this.m_showingLatestResults = false;
		this.m_flowsheetResultCap = 4000;
	}

	// Determine the result cap based on the current view type and lookback
	// selection and if the panel is shown
	if (this.getShowAmbulatoryView()) {
		if (this.SIDE_PANEL_AVAILABLE) {
			resultCap = 10;
		}
		else {
			resultCap = this.m_ambulatoryColumnCount;
		}
	}
	else {
		resultCap = this.m_flowsheetResultCap;
	}

	// load corresponding scripts
	encntrSelection = (this.getScope() === 2) ? criterion.encntr_id + ".0" : "0.0";
	sendAr.push("^MINE^", criterion.person_id + ".0", encntrSelection, criterion.provider_id + ".0", criterion.ppr_cd + ".0", lookbackUnits, lookbackType, "^^", "^^", primaryEventSets, MP_Util.CreateParamArray(secondaryEventSets, 1), resultCap);

	var scriptRequest = new ComponentScriptRequest();
	scriptRequest.setProgramName("MP_RETRIEVE_LABS_GROUP_DATA");
	scriptRequest.setParameterArray(sendAr);
	scriptRequest.setComponent(component);
	scriptRequest.setLoadTimer(loadTimer);
	scriptRequest.setRenderTimer(renderTimer);
	scriptRequest.performRequest();
};

/**
 * This function is used to ensure the numerical results and dates are formatted for i18n and saves it back to the object
 *
 * @param {Object}
 *                result - This is a result Object and it contains the information like the result type, result value etc.
 */
LaboratoryComponentWF.prototype.formatResult = function(result) {
	var numberFormatter = MP_Util.GetNumericFormatter();
	if (mp_formatter._isNumber(result.RESULT)) {
		result.RESULT = numberFormatter.format(result.RESULT, "^." + MP_Util.CalculatePrecision(result.RESULT));
	}
	else if (result.RES_TYPE === 3 && ( typeof result.DATE_FORMATTED == "undefined")) {
		// Date time result still needs to be formatted
		dateResult = new Date();
		dateResult.setISO8601(result.RESULT);
		result.RESULT = dateResult.format("longDateTime3");
		result.DATE_FORMATTED = true;
	}
};

/**
 * The formatDate function is used to format the date/time by setting it to ISO standard
 *
 * @param {string}
 *                dateTime - This parameter contains the date/time of the result that needs to be formatted.
 * @return The formatted date/time according to the ISO standards.
 */
LaboratoryComponentWF.prototype.formatDate = function(dateTime) {
	var date = new Date();
	date.setISO8601(dateTime);
	return date.format("longDateTime3");
};

/**
 * This function calculates the appropriate normalcy class of the result depending on the normalcyValue and also the most severe
 * criticality of the additional results depending on
 * the resultIndex and hoverNormalcyClass and also updates the critical indicator if there are any critical results in the list of
 * the results.
 *
 * @param {string}
 *                normalcyValue - This parameter contains the Normalcy Value(CRITICAL,HIGH,LOW..etc) associated with the results
 * @param {number}
 *                resultIndex - This parameter contains the number of results in the particular time bucket and is mainly used to
 * determine the most severe criticality of the
 *                additional results.
 * @param {string}
 *                hoverNormalcyClass - This parameter is used to hold the most severe criticality among the additional results.
 */
LaboratoryComponentWF.prototype.getNormalcy = function(normalcyValue, resultIndex, hoverNormalcyClass) {
	var normalcyClassObj = {
		"NORMALCY": "res-normal",
		"HOVERNORMALCY": hoverNormalcyClass,
		"CRITICAL_IND": null
	};
	// Pull the normalcy info as well so we can determine the class
	switch (normalcyValue) {
		case "CRITICAL":
		case "EXTREMEHIGH":
		case "PANICHIGH":
		case "EXTREMELOW":
		case "PANICLOW":
		case "VABNORMAL":
		case "POSITIVE":
			normalcyClassObj.CRITICAL_IND = true;
			normalcyClassObj.NORMALCY = "res-severe";
			if (resultIndex > 0) {
				normalcyClassObj.HOVERNORMALCY = "res-severe";
			}
			break;
		case "HIGH":
			normalcyClassObj.NORMALCY = "res-high";
			if (resultIndex > 0 && !(hoverNormalcyClass === "res-severe")) {
				normalcyClassObj.HOVERNORMALCY = "res-high";
			}
			break;
		case "LOW":
			normalcyClassObj.NORMALCY = "res-low";
			if (resultIndex > 0 && !("res-high|res-severe".indexOf(hoverNormalcyClass) >= 0)) {
				normalcyClassObj.HOVERNORMALCY = "res-low";
			}
			break;
		case "ABNORMAL":
			normalcyClassObj.NORMALCY = "res-abnormal";
			if (resultIndex > 0 && !("res-high|res-severe|res-low".indexOf(hoverNormalcyClass) >= 0)) {
				normalcyClassObj.HOVERNORMALCY = "res-abnormal";
			}
			break;
	}
	return normalcyClassObj;
};

/**
 * Process and prepare the data for the ComponentTable framework
 */
LaboratoryComponentWF.prototype.processData = function(recordData) {
	var self = this;
	var criticalResultInd = null;
	var curDate = new Date(9999, 1, 1);
	var dateTime = null;
	var formattedTimeBucketRef = "";
	var lastMeasDisplayed = null;
	var meas = null;
	var measCnt = 0;
	var measDisplayedCnt = 0;
	var nextDate = null;
	var primaryGroup = null;
	var primaryGroupInd = false;
	var primaryGroupCnt = 0;
	var resultGroup = null;
	var resultGroupCnt = 0;
	var timeBucket = null;
	var timeBucketCnt = 0;
	var timeBucketRef = "";
	var ambulatoryColumnRef = "";
	var x = 0;
	var y = 0;
	var z = 0;

	// Caching todays date, time and year variables
	var todaysDate = new Date();
	var todaysYearValue = todaysDate.getFullYear();
	var todaysMonthValue = todaysDate.getMonth();
	var todaysDateValue = todaysDate.getDate();

	this.setRecordData(recordData);

	/**
	 * This function is used to create the time Bucket object that will be associated with each result group
	 */
	function timeBucketObjConstructor(timeGroups) {
		var timeBucketObj = {};
		for (var i = timeGroups.length; i--; ) {
			timeBucketObj[timeGroups[i].TIME_DISP_FORMATTED] = {
				"DISPLAY": "--",
				"OBJECT_ARR": [],
				"TIME_BUCKET_ISO8601": timeGroups[i].TIME_DISP
			};
		}
		return timeBucketObj;
	}

	/**
	 * This function is used to create the column object for ambulatory view only
	 */
	function ambulatoryColumnConstructor(columnCount) {
		var ambulatoryColumnObject = {};
		var ambulatoryColumnHeader = "";
		var ambulatoryColumnObjectIndexZero = {};
		for (var i = columnCount; i--; ) {
			// using string index's for the hover to function
			ambulatoryColumnObject["ResultColumn" + i] = {
				"DISPLAY": "--",
				"OBJECT_ARR": [],
				"COLUMN_DISPLAY": "",
				"NEW_DAY_CLASS": ""
			};
		}
		// Set the column's display and class since we know already
		if (columnCount > 0) {
			ambulatoryColumnObjectIndexZero = ambulatoryColumnObject.ResultColumn0;
			if (self.getShowTodayValue()) {
				ambulatoryColumnObjectIndexZero.COLUMN_DISPLAY = "<span>" + i18n.discernabu.laboratory_o2.TODAY + "</span>";
			}
			else {
				ambulatoryColumnObjectIndexZero.COLUMN_DISPLAY = "<span>" + i18n.discernabu.laboratory_o2.LATEST + "</span>";
			}
			ambulatoryColumnObjectIndexZero.NEW_DAY_CLASS = "labs-wf-ambulatory-latest-col labs-wf-first-content-col";
		}

		if (columnCount > 1) {
			ambulatoryColumnObject.ResultColumn1.COLUMN_DISPLAY = "<span>" + i18n.discernabu.laboratory_o2.PREVIOUS + "</span>";
		}

		return ambulatoryColumnObject;
	}

	/**
	 * Create the display for the result. This includes the normalcy indicator and the result count
	 */
	function createResultDisplay(timeBucketObjs) {
		var eventArr = [];
		var dateResult = null;
		var result = null;
		var resultCnt = timeBucketObjs.length;
		var resultDisplay = "";
		var dateTimeDisplay = "";
		var normalcyClassObj;
		var hoverNormalcyClass = "res-normal";
		var i = 0;
		var formattedTimeBucketRef = "";
		timeBucketObjs[0].COMMENTS_IND = "";
		timeBucketObjs[0].SHOW_UOM = "";

		// Create the display and determine the normalcy class
		for ( i = 0; i < resultCnt; i++) {
			// Save the normalcy class for use in the hover creation
			normalcyClassObj = self.getNormalcy(timeBucketObjs[i].NORMALCY, i, hoverNormalcyClass);
			timeBucketObjs[i].NORMALCY_CLASS = normalcyClassObj.NORMALCY;
			hoverNormalcyClass = normalcyClassObj.HOVERNORMALCY;

			// Determine if any of the values have a comment, if yes, show the
			// comment indicator face up
			if (timeBucketObjs[i].HAS_COMMENTS_IND) {
				timeBucketObjs[0].COMMENTS_IND = "<span class='labs-wf-comments-ind'></span>";
			}

			// updating the critical indicator if there is any critical result.
			if (!criticalResultInd) {
				criticalResultInd = normalcyClassObj.CRITICAL_IND;
			}
		}
		// Pull the modified indicator
		timeBucketObjs[0].MODIFIED_IND = (timeBucketObjs[0].STATUS_MEAN === "MODIFIED" || timeBucketObjs[0].STATUS_MEAN === "ALTERED") ? "<span class='res-modified'>&nbsp</span>" : "";

		// If DIFF_UOM is set to something other than "" and "--", display the UOM for a
		// result after the value and before the comments indicator
		if (timeBucketObjs[0].DIFF_UOM && timeBucketObjs[0].DIFF_UOM !== "--") {
			timeBucketObjs[0].SHOW_UOM = " " + timeBucketObjs[0].DIFF_UOM;
		}

		// Ensure the numerical results and dates are formatted for i18n and
		// save it back to the object
		self.formatResult(timeBucketObjs[0]);
		result = timeBucketObjs[0].RESULT;

		// Create the result display and event viewer link
		resultDisplay = timeBucketObjs[0].RES_MOD_DISPLAY + result + timeBucketObjs[0].SHOW_UOM + timeBucketObjs[0].COMMENTS_IND + timeBucketObjs[0].MODIFIED_IND + " " + ((resultCnt > 1) ? "<span class='labs-wf-bracket'>[<span class='" + hoverNormalcyClass + "'>" + resultCnt + "</span>]</span>" : "");
		// return the constructed content

		if (self.getShowAmbulatoryView()) {
			var dateFormat = self.getDateFormat();
			var resultDate = new Date();
			resultDate.setISO8601(timeBucketObjs[0].DTTM);
			var dateTime = MP_Util.DisplayDateByOption(self, resultDate);
			dateTimeDisplay = '<span class="labs-wf-time-within"> ' + dateTime + ' </span>';
			// If no date/time option is selected in the bedrock, no need to
			// display the time/date
			if (dateFormat === 4) {
				return '<span class="' + timeBucketObjs[0].NORMALCY_CLASS + '"><span class="res-ind">&nbsp;</span><span class="res-val">' + resultDisplay + '</span></span>';
			}
			return '<span class="' + timeBucketObjs[0].NORMALCY_CLASS + '"><span class="res-ind">&nbsp;</span><span class="res-val">' + resultDisplay + '</span></span>' + dateTimeDisplay;
		}
		else {
			return '<span class="' + timeBucketObjs[0].NORMALCY_CLASS + '"><span class="res-ind">&nbsp;</span><span class="res-val">' + resultDisplay + '</span></span>';
		}
	}// End of CreateDisplayResult

	// Take and manipulate the recordData returned from the
	// MP_RETRIEVE_LABS_GROUP_DATA script and prepare it for use in the
	// ComponentTable
	// Grab the time buckets and create the column displays for the
	// ComponentTable
	if (!this.getShowAmbulatoryView()) {
		timeBucketCnt = recordData.TG.length;
		// Check to see if we are showing only the latest results. If so limit
		// the time buckets that we will be displaying
		if (this.m_showingLatestResults && timeBucketCnt > this.m_latestColumnCap) {
			recordData.TG = recordData.TG.splice(0, this.m_latestColumnCap);
			timeBucketCnt = recordData.TG.length;
		}

		for ( x = 0; x < timeBucketCnt; x++) {
			timeBucket = recordData.TG[x];
			// Format this time buckets time for display purposes when creating
			// groups
			dateTime = new Date();
			dateTime.setISO8601(timeBucket.TIME_DISP);
			timeBucket.TIME_DISP_FORMATTED = this.formatDate(timeBucket.TIME_DISP);

			nextDate = new Date();
			nextDate.setISO8601(timeBucket.TIME_DISP);

			// Check to see if this is the first time for this Date
			if ((nextDate.getDate() !== curDate.getDate()) || (nextDate.getMonth() !== curDate.getMonth()) || (nextDate.getFullYear() !== curDate.getFullYear())) {
				timeBucket.NEW_DAY_CLASS = "labs-wf-content-col-hdr-new-day";
				// Create the display with full date time display
				timeBucket.COLUMN_DISPLAY = "<span class='" + timeBucket.NEW_DAY_CLASS + "'>" + dateTime.format("mediumDate") + "<br />" + dateTime.format("militaryTime") + "</span>";
				curDate = nextDate;

				// If we are dealing with the first column we need some special
				// styling
				if (x === 0) {
					timeBucket.NEW_DAY_CLASS = "labs-wf-first-content-col";
					// If we are dealing with the first result we might need to
					// override the display to say Today instead of the date
					if ((dateTime.getDate() === todaysDateValue) && (dateTime.getMonth() === todaysMonthValue) && (dateTime.getFullYear() === todaysYearValue)) {
						timeBucket.COLUMN_DISPLAY = "<span>" + i18n.discernabu.laboratory_o2.TODAY + "<br />" + dateTime.format("militaryTime") + "</span>";
					}
				}
			}
			else {
				// Create just the time display
				timeBucket.NEW_DAY_CLASS = "";
				timeBucket.COLUMN_DISPLAY = "<span>&nbsp<br />" + dateTime.format("militaryTime") + "</span>";
			}
		}
	}

	// Create a TimeBucket object for each row which will allow us to associate
	// results to a particular time bucket
	primaryGroupCnt = recordData.PG.length;
	for ( x = primaryGroupCnt; x--; ) {
		primaryGroup = recordData.PG[x];
		// Grab the length of the result groups for this Primary Group
		resultGroupCnt = primaryGroup.RG.length;
		// Set the primary subsection to the proper label and set the primary
		// group indicator so we can populate the correct row name
		if (primaryGroup.SUBSEC_NAME === "PRIMARY") {
			primaryGroupInd = true;
			primaryGroup.SUBSEC_LABEL = this.getPrimaryLabel();
		}
		else {
			primaryGroup.SUBSEC_LABEL = ( typeof primaryGroup.RG[0] != "undefined" && primaryGroup.RG[0].GROUP_NAME) ? primaryGroup.RG[0].GROUP_NAME : primaryGroup.SUBSEC_NAME;
			primaryGroupInd = false;
		}

		// Loop through each result group and prepare the data
		for ( y = resultGroupCnt; y--; ) {
			resultGroup = primaryGroup.RG[y];
			// Check to see if this result group has any measurements. If not
			// remove it so we don't have to deal with it later
			measCnt = resultGroup.MEASUREMENTS.length;
			if (!measCnt) {
				primaryGroup.RG.splice(y, 1);
				continue;
			}
			// Create this result group's time bucket object
			if (!this.getShowAmbulatoryView()) {
				resultGroup.TIME_BUCKETS = timeBucketObjConstructor(recordData.TG);
			}
			else {
				resultGroup.TIME_BUCKETS = ambulatoryColumnConstructor(this.m_ambulatoryColumnCount);
			}

			// Give the group a proper name. If it is a primary result is should
			// use the Event Set Display Name(DISPLAY_NAME).
			// If it is a secondary results is should the the event code display
			// name(RESULT_NAME)
			resultGroup.SECONDARY_GROUP_NAME = ((primaryGroupInd) ? resultGroup.MEASUREMENTS[0].DISPLAY_NAME : resultGroup.MEASUREMENTS[0].RESULT_NAME) || "&nbsp;";

			// Get and store the uom for the first result in each group
			resultGroup.FIRST_RES_UOM = resultGroup.MEASUREMENTS[0].UOM;

			// Flag to identify if the measurement has todays's result
			var isResultZeroToday = false;
			if (this.getShowAmbulatoryView()) {
				// We will show this.m_ambulatoryColumnCount columns for
				// ambulatory view
				measCnt = Math.min(measCnt, this.m_ambulatoryColumnCount);
				if (this.getShowTodayValue()) {
					// Some results are not exactly on the minute mark so we
					// need to remove the seconds from the time string
					var indexZeroResultDateTime = resultGroup.MEASUREMENTS[0].DTTM.replace(/:[0-9][0-9]Z/, ":00Z");
					var indexZeroNewDateTime = new Date();
					indexZeroNewDateTime.setISO8601(indexZeroResultDateTime);
					if (todaysDateValue === indexZeroNewDateTime.getDate() && todaysMonthValue === indexZeroNewDateTime.getMonth() && todaysYearValue === indexZeroNewDateTime.getFullYear()) {
						isResultZeroToday = true;
					}
					else {
						// If measCnt equals 7 only then substract the count by
						// 1 to place them in (z+1) cell instead of z
						if (measCnt === 7) {
							measCnt = measCnt - 1;
						}
					}
				}
			}

			// Loop through the measurements and add the results to each time
			// bucket
			measDisplayedCnt = 0;
			lastMeasDisplayed = null;
			for ( z = measCnt; z--; ) {
				meas = resultGroup.MEASUREMENTS[z];

				// Determine if each result has a different UOM than the first
				// one, if so,
				// set diff_uom flag to the actual UOM, or if there is no UOM,
				// set it to "--"
				if (meas.UOM === resultGroup.FIRST_RES_UOM) {
					meas.DIFF_UOM = "";
				}
				else if (meas.UOM) {
					meas.DIFF_UOM = meas.UOM;
				}
				else {
					meas.DIFF_UOM = "--";
				}

				// Some results are not exactly on the minute mark so we need to
				// remove the seconds from the time string
				timeBucketRef = meas.DTTM.replace(/:[0-9][0-9]Z/, ":00Z");
				if (!this.getShowAmbulatoryView()) {
					formattedTimeBucketRef = this.formatDate(timeBucketRef);
					// Verify that the time bucket exists
					if ( typeof resultGroup.TIME_BUCKETS[formattedTimeBucketRef] !== "undefined") {
						// Push a reference to the actual measurements into the
						// time bucket array so we can display all results in
						// the hover
						resultGroup.TIME_BUCKETS[formattedTimeBucketRef].OBJECT_ARR.push(meas);
						resultGroup.TIME_BUCKETS[formattedTimeBucketRef].DISPLAY = createResultDisplay(resultGroup.TIME_BUCKETS[formattedTimeBucketRef].OBJECT_ARR);
						// Increment the count of result pushed into the time
						// buckets
						measDisplayedCnt++;
						if (measDisplayedCnt === 1) {
							lastMeasDisplayed = meas;
						}
						resultGroup.LATEST_RESULT_COUNT = measDisplayedCnt;
					}
				}
				else {
					ambulatoryColumnRef = resultGroup.TIME_BUCKETS["ResultColumn" + z];
					if (!this.getShowTodayValue()) {
						ambulatoryColumnRef.OBJECT_ARR.push(meas);
						ambulatoryColumnRef.DISPLAY = createResultDisplay(ambulatoryColumnRef.OBJECT_ARR);
					}
					else {
						// Compare the date of the result , if its today then
						// put it in the first cell else shift
						dateTime = new Date();
						dateTime.setISO8601(timeBucketRef);
						if (isResultZeroToday) {
							ambulatoryColumnRef.OBJECT_ARR.push(meas);
							ambulatoryColumnRef.DISPLAY = createResultDisplay(ambulatoryColumnRef.OBJECT_ARR);
						}
						else {
							ambulatoryColumnRef = resultGroup.TIME_BUCKETS["ResultColumn" + (z + 1)];
							if (ambulatoryColumnRef) {
								ambulatoryColumnRef.OBJECT_ARR.push(meas);
								ambulatoryColumnRef.DISPLAY = createResultDisplay(ambulatoryColumnRef.OBJECT_ARR);
							}
						}
					}
				}
			}
			// Check the count of measurements displayed for this result group
			// because we may need to do some specialized logic
			if (!this.getShowAmbulatoryView()) {
				if (measDisplayedCnt === 0) {
					// There are no results that will be displayed for this
					// result so we can remove it from the list. This will
					// typically
					// only apply when the Latest lookback is selected
					primaryGroup.RG.splice(y, 1);
				}
				else if (measDisplayedCnt >= this.m_flowsheetResultCap) {
					// This is a special case where we might have to dither
					// certain cells of a row because we may or may not have
					// retrieved all of the content for those columns
					// Loop through the time buckets in reverse order and add
					// special classes if they do not have results
					// Grab the date of the last measurement displayed so we can
					// use that to compare against the time buckets
					timeBucketRef = lastMeasDisplayed.DTTM.replace(/:[0-9][0-9]Z/, ":00Z");
					// Loop through all of the time buckets in the resultGroup
					for (timeBucket in resultGroup.TIME_BUCKETS) {
						if (resultGroup.TIME_BUCKETS.hasOwnProperty(timeBucket)) {
							// See if the last measurements time bucket is
							// greater than (more recent) the time bucket we are
							// looking at
							if (timeBucketRef > resultGroup.TIME_BUCKETS[timeBucket].TIME_BUCKET_ISO8601) {
								resultGroup.TIME_BUCKETS[timeBucket].DISPLAY = "<span class='labs-wf-results-unknown'>&nbsp;</span>";
							}
						}
					}
				}
			}
		}
		// Check to see if this primary group contains any result groups
		if (!primaryGroup.RG.length) {
			// There are no result groups to display in this Primary group so we
			// can cut it out
			recordData.PG.splice(x, 1);
		}
	}
	// Fire a critical result indicator to be null or true everytime so it
	// resets if the newest
	// view does or doesn't have a face-up critical result
	CERN_EventListener.fireEvent(this, this, EventListener.EVENT_CRITICAL_UPDATE, {
		"critical": criticalResultInd
	});
};

/**
 * Dynamically create a ComponentTable TableColumn for a particular time bucket
 */
LaboratoryComponentWF.prototype.createTableColumn = function(timeBucketObj) {
	return new TableColumn().setColumnId(timeBucketObj.TIME_DISP_FORMATTED).setColumnDisplay(timeBucketObj.COLUMN_DISPLAY).setCustomClass('labs-wf-content-col ' + timeBucketObj.NEW_DAY_CLASS).setRenderTemplate("${TIME_BUCKETS['" + timeBucketObj.TIME_DISP_FORMATTED + "'].DISPLAY}");
};

/**
 * Dynamically create a ComponentTable TableColumn for a Todays column
 */
LaboratoryComponentWF.prototype.createAmbulatoryViewColumn = function(index, ambulatoryColumnObject) {
	return new TableColumn().setColumnId("ResultColumn" + index).setColumnDisplay(ambulatoryColumnObject["ResultColumn" + index].COLUMN_DISPLAY).setCustomClass('labs-wf-content-col ' + ambulatoryColumnObject["ResultColumn" + index].NEW_DAY_CLASS).setRenderTemplate("${TIME_BUCKETS['ResultColumn" + index + "'].DISPLAY}");
};

/**
 * Dynamically create a ComponentTable TableGroup for a particular group of results
 */
LaboratoryComponentWF.prototype.createTableGroup = function(groupObj, addNameInd) {
	return new TableGroup().setGroupId("ESCode" + groupObj.EVENT_SET_CD).bindData(groupObj.RG).setDisplay((addNameInd) ? "<span title='" + groupObj.SUBSEC_LABEL + "'>" + groupObj.SUBSEC_LABEL + "</span>" : "&nbsp;");
};

/**
 * This function will handle the response from MP_GET_EVENT_CLASS_INFO script which is called to retrieve event class information for
 * the measurement object.
 *
 * @param {JSON}
 *                reply - The reply returned from the script call. It is expected that this object contains the event class info as
 * retrieved by mp_get_event_class_info.
 * @param {JSON}
 *                measurement - The measurement object that invoked the script call.
 */
LaboratoryComponentWF.prototype.handleGetMeasurementEventClassInfo = function(reply, measurement) {
	var eventClassInfo = reply.EVENT_CLASS_INFO;
	measurement.EVENT_CLASS_CD = eventClassInfo.EVENT_CLASS_CD;
	measurement.PRIMARY_CRITERIA_CD = eventClassInfo.PRIMARY_CRITERIA_CD;
};

/**
 * This function handles retrieval of the event class info for a measurement object. A call to MP_GET_EVENT_CLASS_INFO is made. When
 * this request returns, the function
 * handleGetMeasurementEventClassInfo is called. The request will be synchronous to prevent timing issues in case of rapid clicking.
 *
 * @param {JSON}
 *                measurement - The measurement for which we are retrieving the event class info.
 */
LaboratoryComponentWF.prototype.retrieveMeasurementEventClassInfo = function(measurement) {
	var self = this;
	var errorRetrievingEventClassInfo = false;
	var eventClassData = null;
	// Create the script request to retrieve the event class info for the
	// measurement object
	var measurementEventClassRequest = new MP_Core.ScriptRequest();
	measurementEventClassRequest.setProgramName("MP_GET_EVENT_CLASS_INFO");
	measurementEventClassRequest.setParameters(["^MINE^", measurement.EVENT_ID + ".0", measurement.EVENT_CD + ".0"]);
	measurementEventClassRequest.setAsync(false);
	measurementEventClassRequest.setExecCallback(true);
	// Use the callback approach and handle the response accordingly
	MP_Core.XMLCCLRequestCallBack(null, measurementEventClassRequest, function(reply) {
		// If we have a non-success status, we simply remember that it was in
		// error. If an error was thrown
		// in the context of this callback, it would be subdued by the
		// architecture, but we want to handle it ourselves.
		if (reply.getStatus() !== "S") {
			errorRetrievingEventClassInfo = true;
		}
		eventClassData = reply.getResponse();
	});

	// If the script request had an error, we now throw an Error to be handled
	// ourselves.
	if (errorRetrievingEventClassInfo) {
		throw new Error("There was an error retrieving the event class info for the measurement");
	}
	self.handleGetMeasurementEventClassInfo(eventClassData, measurement);
};

/**
 * This function handles launching info button for a measurement object.
 *
 * @param {DiscernObject}
 *                infoButtonApp - The external discern object for info button.
 * @param {JSON}
 *                measurement - The measurement object for which info button will be launched.
 */
LaboratoryComponentWF.prototype.launchInfoButtonForMeasurement = function(infoButtonApp, measurement) {
	var criterion = this.getCriterion();
	infoButtonApp.SetInfoButtonData(criterion.person_id, criterion.encntr_id, measurement.PRIMARY_CRITERIA_CD, 1, 2);
	infoButtonApp.AddResult(measurement.EVENT_ID, measurement.EVENT_CD, measurement.EVENT_CLASS_CD, measurement.RESULT, measurement.EVENT_CD, (measurement.QUANTITY_VALUE.length) ? measurement.QUANTITY_VALUE[0].UNIT_CD : 0);
	infoButtonApp.LaunchInfoButton();
};

/**
 * This function will serve as the click handler for the Label table delegate.
 *
 * @param {jQuery.Event}
 *                event - The DOM event that occurred.
 * @param {JSON}
 *                data - The data behind the DOM element as received from ComponentTable.
 */
LaboratoryComponentWF.prototype.labelTableCellClickHandler = function(event, data) {
	var target = event.target;
	var targetClass = "";
	var meas = null;
	if (!target) {
		return;
	}
	targetClass = target.className;
	// The user has clicked an info button, so we must create a new
	// InfoButtonLink
	if (targetClass === "labs-wf-info-button") {
		try {
			// Grab the first result available
			meas = data.RESULT_DATA.MEASUREMENTS[0];
			// Retrieve the external info button application via the object
			// factory
			var launchInfoBtnApp = CERN_Platform.getDiscernObject("INFOBUTTONLINK");
			if (launchInfoBtnApp) {
				// If the event class information for the result has not been
				// retrieved,
				// call MP_GET_EVENT_CLASS_INFO to retrieve the data.
				if (!meas.PRIMARY_CRITERIA_CD || !meas.EVENT_CLASS_CD) {
					this.retrieveMeasurementEventClassInfo(meas);
				}
				// Make the call to launch info-button
				this.launchInfoButtonForMeasurement(launchInfoBtnApp, meas);
			}
		}
		catch (error) {
			var errorName = error.name;
			var errorMessage = error.message || i18n.discernabu.INFO_BUTTON_ERROR_MSG;
			logger.logError(errorName + ":" + errorMessage);
			var errorModal = MP_ModalDialog.retrieveModalDialogObject("infoButtonErrorModal");
			if (!errorModal) {
				errorModal = MP_Util.generateModalDialogBody("infoButtonErrorModal", "error", errorMessage, i18n.discernabu.INFO_BUTTON_ERROR_ACTION);
				errorModal.setHeaderTitle(i18n.ERROR_OCCURED);
				// Create and add the close button
				var closeButton = new ModalButton("closeButton");
				closeButton.setText(i18n.CLOSE).setCloseOnClick(true);
				errorModal.addFooterButton(closeButton);
			}
			MP_ModalDialog.updateModalDialogObject(errorModal);
			MP_ModalDialog.showModalDialog("infoButtonErrorModal");
			return;
		}
	}
	else if (targetClass === "labs-wf-sub-sec-name" || targetClass === "table-cell labs-wf-label-col" || targetClass === "table-cell labs-wf-uom-col" || targetClass === "labs-wf-result-uom") {
		if (this.SIDE_PANEL_AVAILABLE) {
			this.setPanelContentsToClickedRow(event, data);
		}
	}
};

/**
 * @method Returns the jqplot object.
 * @return {object} A reference to the jqplot object.
 */
LaboratoryComponentWF.prototype.getLabPlot = function() {
	return this.m_plot;
};

/**
 * @method Store a reference to the jqplot object
 * @param {object}
 *                plot - A reference to the jqplot object
 */
LaboratoryComponentWF.prototype.setLabPlot = function(plot) {
	this.m_plot = plot;
};

/**
 * @method Returns an array containing all points to be plotted on the graph (times and dates).
 * @return {array} - The list of all plotted points on the graph.
 */
LaboratoryComponentWF.prototype.getGraphData = function() {
	return this.m_graphData;
};

/**
 * @method Store the reference to an array containing all points to be plotted on the graph (data and dates).
 * @param {array}
 *                data - An array containing all points to plot on the graph.
 */
LaboratoryComponentWF.prototype.setGraphData = function(data) {
	this.m_graphData = data;
};

/**
 * @method This method will create the graph using the jqplot API and populate it with the necessary data.
 * @return {null}
 */

LaboratoryComponentWF.prototype.plotLabGraph = function() {

	var graphArray = this.getGraphData();
	var graphDivId = "WF_LAB" + this.getComponentId() + "graphHolder";
	var graphHolder = $(graphDivId);
	var labPlot = this.getLabPlot();

	// Below we need to take the position of the tooltip into account. If the
	// point is near the width (x position) of the graph, the tooltip is hidden
	// underneath
	// the div of the graph.

	$("#WF_LAB" + this.getComponentId() + "graphHolder").bind("jqplotMouseMove", function(ev, gridpos, datapos, neighbor, plot) {
		var x = gridpos.x;
		var y = gridpos.y;
		var plotWidth = plot._width;
		var limitWidth = plotWidth - x;
		var leftMargin = 190;

		var tooltip = "#" + graphDivId + " .jqplot-highlighter-tooltip";
		// If the distance between the point we hovered over and
		// the width of
		// the graph is less than the max width
		// of the tooltip, we will move the tooltip to the left
		// so that it is
		// visible.

		if (limitWidth < leftMargin) {
			if (x > leftMargin) {
				$(tooltip).css('margin-left', '-195px');
			}
			else if (x < limitWidth) {
				$(tooltip).css('margin-left', '-85px');
			}
			else {
				$(tooltip).css('margin-left', '-150px');
			}
		}
		else {
			$(tooltip).css('margin-left', '0');
		}
		// we need to make sure that the tooltip is not hidden
		// when it's over
		// the allowed height of the div.
		if (y < $(tooltip).height()) {
			$(tooltip).css("top", "0px");
		}
	});

	function tooltipEditor(str, seriesIndex, pointIndex, plot) {
		/*
		 * data[0] - dateTime, data[1] - Result value data[2] - Normalcy Class data[3] - Result Name data[4] - Unit of Measure data[5] -
		 * Modified Indicator
		 */

		var data = plot.data[seriesIndex][pointIndex];
		return "<div class ='labs-graph-tooltip'>" + data[3] + " : <span class='" + data[2] + "'><span>" + data[1] + "&nbsp;" + data[4] + "&nbsp;" + data[5] + "</span></span><br><span>" + i18n.discernabu.laboratory_o2.DATE_TIME + " : " + data[0].format("mediumDate") + "&nbsp;" + data[0].format("militaryTime") + "</span></div>";
	}

	var chartOptions = {
		axes: {
			axesDefaults: {
				pad: 2
			},
			xaxis: {
				renderer: $.jqplot.DateAxisRenderer,
				tickOptions: {
					formatString: '%m/%d/%Y',
					showGridline: false,
					showMark: false,
					fontSize: '8pt',
					show: false
				},
				max: graphArray[graphArray.length - 1][0],
				min: graphArray[0][0],
				numberTicks: 2,
				useDST: true
			},
			yaxis: {
				pad: 2,
				tickOptions: {
					show: false
				},
				rendererOptions: {
					drawBaseline: false
				}
			}
		},
		highlighter: {
			show: true,
			tooltipContentEditor: tooltipEditor,
			tooltipLocation: 'ne',
			sizeAdjust: 7
		},
		cursor: {
			show: false
		},
		series: [{
			lineWidth: 2,
			shadow: false,
			color: '#505050',
			markerOptions: {
				show: true,
				size: 8,
				color: '#505050',
				shadow: false
			}
		}],
		grid: {
			background: '#FFFFFF', // CSS color for background color of grid.
			borderColor: '#DDDDDD',
			borderWidth: 2,
			shadow: false,
			showBorder: true
		}
	};
	labPlot = $.jqplot('WF_LAB' + this.getComponentId() + 'graphHolder', [graphArray], chartOptions);
	this.setLabPlot(labPlot);
};

/**
 * This function will get the clicked rows contents and set the side panel to contain the info for up to 10 results from that row
 *
 * @param {jQuery.Event}
 *                event - The DOM event that occurred.
 * @param {JSON}
 *                dataObj - The data behind the DOM element as received from ComponentTable.
 */
LaboratoryComponentWF.prototype.setPanelContentsToClickedRow = function(event, dataObj) {
	// Retrieve component ID
	var componentId = this.getComponentId();
	var labsI18N = i18n.discernabu.laboratory_o2;
	var criterion = this.getCriterion();
	var firstResultUOM = dataObj.RESULT_DATA.FIRST_RES_UOM;

	if (this.m_clickedLabel && dataObj.RESULT_DATA.SECONDARY_GROUP_NAME == this.m_clickedLabel) {
		this.m_sidePanel.m_cornerCloseButton.trigger('click');
		this.m_clickedLabel = null;
		return;
	}

	if (!this.m_showPanel) {
		// shrink the table and show the panel
		this.m_tableContainer.addClass("labs-wf-side-panel-addition");
		this.m_contentTableContainer.css("width", this.m_tableContainer.outerWidth() - 200 - this.m_scrollController.outerWidth() + "px");
		this.m_sidePanelContainer.css("display", "inline-block");
		this.m_showPanel = true;
		this.m_sidePanel.showPanel();
	}

	// Define the number of most recent results the side panel will display for
	// a selected group
	var numberOfMostRecentResults = 10;

	// Event exists only when the group name is clicked
	if (event) {
		// If the group name is clicked then retrieve the row label of that cell
		var currentRowLabelSelected = event.currentTarget.parentNode;

		// Get the row results that match that label (replace labels with
		// content)
		var currentRowResultsSelectedId = currentRowLabelSelected.id.replace("Labels", "Content");
		var currentRowResultsSelected = document.getElementById(currentRowResultsSelectedId);

		// Highlight the selected row
		this.highlightSelectedRow(currentRowLabelSelected, currentRowResultsSelected, false);
	}

	// Create the header
	this.m_sidePanel.setActionsAsHTML("");
	this.m_sidePanel.setTitleText(dataObj.RESULT_DATA.SECONDARY_GROUP_NAME);
	this.m_sidePanel.setSubtitleText(firstResultUOM);

	// Start the side panel html
	var sidePanelHTML = "<div id='WF_LAB" + componentId + "sidePanelResultsContainer'><br/><div id = 'WF_LAB" + componentId + "testResult' class = 'labs-flex-text'></div><div id='WF_LAB" + componentId + "graphHolder' class='labs-canvas-height'></div><div id='WF_LAB" + componentId + "dateRange' class = 'labs-date-range'></div></div><div id='sidePanelScrollContainer" + componentId + "'><div id='WF_LAB" + componentId + "sidePanelResultList' class='labs-wf-side-panel-result-list'>";

	// Prepare the result list html
	var measurementLength = 0;
	var resultHTML = "";
	var todaysDate = new Date();

	var resultDiffUOM = "";
	var measurement = null;
	var dateTime = null;
	var elementId = "";
	var resultObjInfo = null;
	var lastMeasInTableIdx = 3;

	var differentUOM = false;
	var graphArray = [];

	// Determine the measurement length
	if (this.m_showAmbulatoryView) {
		measurementLength = Math.min(dataObj.RESULT_DATA.MEASUREMENTS.length, numberOfMostRecentResults);
	}
	else {
		measurementLength = dataObj.RESULT_DATA.LATEST_RESULT_COUNT;
	}

	// Process results and set up result list with each result
	for (var measIdx = 0; measIdx < measurementLength; measIdx++) {
		// Get the measurement object
		measurement = dataObj.RESULT_DATA.MEASUREMENTS[measIdx];

		// Format the date to show date and time in appropriate format
		dateTime = new Date();
		dateTime.setISO8601(measurement.DTTM);

		// Determine if the result has the modified indicator, if it does not
		// show in the table then it doesn't have one yet
		measurement.MODIFIED_IND = (measurement.STATUS_MEAN === "MODIFIED" || measurement.STATUS_MEAN === "ALTERED") ? "<span class='res-modified'>&nbsp;</span>" : "";

		// First check to see if measurement has normalcy class, if it does not
		// show in the table then it doesn't have one yet
		if (!measurement.NORMALCY_CLASS) {
			measurement.NORMALCY_CLASS = this.getNormalcy(measurement.NORMALCY, 0).NORMALCY;
		}

		// Ensure the numerical results and dates are formatted for i18n and
		// save it back to the object
		this.formatResult(measurement);

		// We need to pass float values to JQPlot, make sure that we are
		// formatting them if they are valid number values. NAN values will not
		// be plotted.
		if (!isNaN(measurement.RESULT)) {
			measurement.RESULT = parseFloat(measurement.RESULT, 10);
		}

		// If measurement is not shown in table, determine if UOM needs to be
		// shown
		if (measurement.UOM === dataObj.RESULT_DATA.FIRST_RES_UOM) {
			// Set the values in the graphArray only if no result display
			// modifier
			if (measurement.RES_MOD_DISPLAY === "") {
				graphArray.push([dateTime, measurement.RESULT, measurement.NORMALCY_CLASS, measurement.RESULT_NAME, measurement.UOM, measurement.MODIFIED_IND]);
			}
		}
		else if (measurement.UOM) {
			// set diff_uom to results actual uom
			measurement.DIFF_UOM = measurement.UOM;
			differentUOM = true;
		}
		else {
			// set diff_uom to dash dash to indicate result does not have a uom
			measurement.DIFF_UOM = "--";
		}

		// check if diff_uom has a value set, if so add a space before it here
		// instead of adding a space below when it may not be needed

		resultDiffUOM = "";
		if (measurement.DIFF_UOM) {
			// add a space here otherwise it would be directly next to the
			// result value
			resultDiffUOM = " " + measurement.DIFF_UOM;
		}

		// set up id mapping for this row
		elementId = "WF_LAB" + componentId + "result" + measIdx;

		resultObjInfo = {
			EVENT_ID: measurement.EVENT_ID,
			NAME: dataObj.RESULT_DATA.SECONDARY_GROUP_NAME
		};
		this.m_panelElementData[elementId] = resultObjInfo;

		// Also dislay the appropriate result indicators
		resultHTML += "<dl><dd class='labs-result-value'><span class=" + measurement.NORMALCY_CLASS + "><span class='res-ind'></span>";
		resultHTML += "<span class='res-val' id='" + elementId + "'>" + measurement.RES_MOD_DISPLAY + measurement.RESULT + resultDiffUOM;

		// check for comments, if at least one exists, add comment indicator
		if (measurement.HAS_COMMENTS_IND) {
			resultHTML += "<span class='labs-wf-comments-ind'></span>";
		}

		// Close res-val span, normalcy span, and dd
		resultHTML += measurement.MODIFIED_IND + "</span></span></dd><dd class='secondary-text labs-result-date'>";

		// The date needs to be displayed as May 20, 2014 09:00 so formatting
		// the date, unless its today check to see if date of result is today
		if (dateTime.getDate() === todaysDate.getDate() && dateTime.getMonth() === todaysDate.getMonth() && dateTime.getFullYear() === todaysDate.getFullYear()) {
			resultHTML += labsI18N.TODAY;
		}
		else {
			resultHTML += dateTime.format("mediumDate");
		}
		resultHTML += "<span class='labs-wf-side-panel-result-item'>" + dateTime.format("militaryTime") + "</span></dd></dl>";
	}

	sidePanelHTML += resultHTML + "</div></div></div>";
	this.m_sidePanel.setContents(sidePanelHTML, "WF_LABContent" + componentId);

	// attach a click event to each result value to launch the result viewer
	this.addClickToResults();
	// override the click event on expand/collapse bar
	var graphHeight = $("#WF_LAB" + componentId + "sidePanelResultsContainer").height();
	this.addClickExpandCollapse(graphHeight);

	// Get the id for the graph holder where the graph will be plotted
	var graphDivId = "#WF_LAB" + this.getComponentId() + "graphHolder";
	var graphHolder = $(graphDivId);
	var testResult = $('#WF_LAB' + this.getComponentId() + 'testResult');
	var graphDateRange = $('#WF_LAB' + this.getComponentId() + 'dateRange');
	var minDate = null;
	var maxDate = null;
	var testResultHTML = "";
	var graphDateHTML = "";

	testResult.empty();
	graphDateRange.empty();

	if (graphArray.length > 0) {
		minDate = graphArray[graphArray.length - 1][0].format("mediumDate");
		maxDate = graphArray[0][0].format("mediumDate");
	}
	graphDateHTML += "<div><span class = 'graph-date-left'>" + minDate + "</span><span class='graph-date-right'>" + maxDate + "</span></div>";

	// Display the 1st result face up before the graph
	if (graphArray.length === 0 || isNaN(graphArray[0][1])) {
		testResultHTML += "<div class = 'labs-no-graph-results'><span class='labs-warning-image'>&nbsp;</span>" + labsI18N.NODATA + "</div>";
		// Hide the graphHolder div and the dateRange div as we do not want to
		// show the empty space
		graphHolder.hide();
		graphDateRange.hide();
	}
	else if (differentUOM) {
		testResultHTML += "<div class = 'labs-not-all-results'><span class='labs-warning-image'>&nbsp;</span>" + labsI18N.NOTALLDATA + "</div>";
	}
	else if (graphArray.length == 1) {
		testResultHTML += "<div class = 'labs-no-graph-results'><span class='labs-warning-image'>&nbsp;</span>" + labsI18N.SINGLEDATAPOINT + "</div>";
		// Hide the graphHolder div and the dateRange div as we do not want to
		// show the empty space
		graphHolder.hide();
		graphDateRange.hide();
	}

	testResult.append(testResultHTML);
	graphDateRange.append(graphDateHTML);

	graphArray.reverse();

	// Set the graph data and plot the graph
	if (graphArray.length > 0) {
		this.setGraphData(graphArray);
		this.plotLabGraph();
	}
	else {
		this.setGraphData(null);
		this.setLabPlot(null);
	}

	// set the value for clicked label
	this.m_clickedLabel = dataObj.RESULT_DATA.SECONDARY_GROUP_NAME;
};

/**
 * This callback function populates the side panel content.
 * @param {ScriptReply} scriptReply
 */
LaboratoryComponentWF.prototype.queryTaggedResultsCallback = function(scriptReply, dataObj){
	var self = this;
	var replyData = scriptReply.getResponse();
	var individualResultSelector = ".ddemrcontentitem";
	var taggedResultsObject = $.parseHTML(replyData.XHTML_TEXT);
	var selectedDataObjsList = self.getSelectedDataObjsList();
	var selectedResultsLen = selectedDataObjsList.length;
	$(taggedResultsObject).find(individualResultSelector).each(function(index, element){
		element = $(element);
		var entityId = Number(element.attr('dd:entityid'));
		for(var i = selectedResultsLen; i--; ){
			var columnId = selectedDataObjsList[i].selectedResObj.COLUMN_ID;
			var results = selectedDataObjsList[i].selectedResObj.RESULT_DATA.TIME_BUCKETS[columnId].OBJECT_ARR;
			if (results.length) {
				var resultObj = results[0];
				if(entityId === resultObj.EVENT_ID){
					selectedDataObjsList[i].taggedStatus = true;
				}
			}
		}
	});
	//populate the side panel data
	var componentId = this.getComponentId();
	var labsI18N = i18n.discernabu.laboratory_o2;
	var criterion = this.getCriterion();
	var resultObject = null;
	var group = null;
	var result = null;
	var eventID = null;
	var timeBucketResults = [];
	var sidePanelHTML = "";
	var resultDetailsHTML = "";
	var resultValueHTML = "";
	var addResultValueHTML = [];
	var resultCount = 0;
	var elementId = null;
	if (!this.m_showPanel) {
		// shrink the table and show the panel
		this.m_tableContainer.addClass("labs-wf-side-panel-addition");
		this.m_contentTableContainer.css("width", this.m_tableContainer.outerWidth() - 200 - this.m_scrollController.outerWidth() + "px");
		this.m_sidePanelContainer.css("display", "inline-block");
		this.m_showPanel = true;
		this.m_sidePanel.showPanel();
	}
	if(selectedResultsLen === 0){
		this.m_sidePanel.m_cornerCloseButton.trigger('click');
	}else if(selectedResultsLen === 1){
		var results = dataObj.RESULT_DATA.TIME_BUCKETS[dataObj.COLUMN_ID].OBJECT_ARR;
		resultCount = results.length;
		//Set the content of the side panel when grey warning icon shown in face up is clicked
		if(resultCount === 0 && dataObj.RESULT_DATA.TIME_BUCKETS[dataObj.COLUMN_ID].DISPLAY !== "--"){
			this.m_sidePanel.setActionsAsHTML("");
			this.m_sidePanel.setTitleText("");
			this.m_sidePanel.setSubtitleAsHTML("<div class='labs-wf-results-unknown labs-wf-results-unknown-icon'></div><div class='secondary-text labs-wf-results-unknown-text'>" + i18n.discernabu.LIMITED_RESULTS + "</div>");
			sidePanelHTML = " ";
		}else{
			// Grab the result information
			resultObject = selectedDataObjsList[0].selectedResObj;
			var taggedStatus = selectedDataObjsList[0].taggedStatus;
			group = resultObject.RESULT_DATA;
			timeBucketResults = group.TIME_BUCKETS[resultObject.COLUMN_ID].OBJECT_ARR;
			var resultCnt = timeBucketResults.length;
			addResultValueHTML.push("<div class = 'sp-separator2'>&nbsp;</div><dl><dd><div class='secondary-text'>" + labsI18N.ADDITIONAL_RESULTS + "</div>");
			for (var x = 0; x < resultCnt; x++) {
				result = timeBucketResults[x];
				eventID = result.EVENT_ID;
				resultObjInfo = {
						EVENT_ID: eventID,
						NAME: resultObject.RESULT_DATA.SECONDARY_GROUP_NAME
				};
				elementId = "WF_LAB" + componentId + "result" + result.RESULT;
				this.m_panelElementData[elementId] = resultObjInfo;
				if (x === 0) {
					resultValueHTML = "<div id = 'WF_LAB" + componentId + "sidePanelResultList'><span class=" + result.NORMALCY_CLASS + "><span class='res-ind'></span>";
					resultValueHTML += "<span class='res-val lab-res-val-selectable' id='" + elementId + "'>" + result.RES_MOD_DISPLAY + result.RESULT + "&nbsp;" + result.UOM;
					// check for comments, if at least one exists, add comment indicator
					if (result.HAS_COMMENTS_IND) {
						resultValueHTML += result.COMMENTS_IND;
					}
					resultValueHTML += result.MODIFIED_IND + "</div>";

					var status = result.STATUS || "--";
					var normalLow = result.NLOW || "--";
					var normalHigh = result.NHIGH || "--";
					var criticalLow = result.CLOW || "--";
					var criticalHigh = result.CHIGH || "--";

					resultDetailsHTML += "<dl><dd class='lab-res-add-info'><div class='secondary-text'>" + labsI18N.DATE_TIME + "</div><div>" + this.formatDate(result.DTTM) + "</div></dd>";
					resultDetailsHTML += "<dd class='lab-res-add-info'><div class='secondary-text'>" + labsI18N.STATUS + "</div><div>" + status + "</div></dd>";
					resultDetailsHTML += "<dd class='lab-res-add-info'><div class='secondary-text'>" + labsI18N.NORMAL_LOW + "</div><div>" + normalLow + "</div></dd>";
					resultDetailsHTML += "<dd class='lab-res-add-info'><div class='secondary-text'>" + labsI18N.NORMAL_HIGH + "</div><div>" + normalHigh + "</div></dd>";
					resultDetailsHTML += "<dd class='lab-res-add-info'><div class='secondary-text'>" + labsI18N.CRITICAL_LOW + "</div><div>" + criticalLow + "</div></dd>";
					resultDetailsHTML += "<dd class='lab-res-add-info'><div class='secondary-text'>" + labsI18N.CRITICAL_HIGH + "</div><div>" + criticalHigh + "</div></dd></dl>";
				}else{
					var modifiedDisplay = (result.STATUS_MEAN === "MODIFIED" || result.STATUS_MEAN === "ALTERED") ? "<span class='res-modified'>&nbsp</span>" : "";
					// Grab only some information from the hidden results
					addResultValueHTML.push("<dl><dd><span class='", result.NORMALCY_CLASS, "'><span class='res-ind'>&nbsp;</span>", result.RES_MOD_DISPLAY, result.RESULT, " ", result.UOM, "</span>");
					// check for comments, if at least one exists, add comment indicator
					if (result.HAS_COMMENTS_IND) {
						addResultValueHTML.push(result.COMMENTS_IND);
					}
					addResultValueHTML.push(modifiedDisplay, "</dd></dl>");
				}
			}
			var sidePanelContentHtml = resultDetailsHTML;
			if (addResultValueHTML.length > 1) {
				addResultValueHTML.push("</dd></dl>");
				sidePanelContentHtml += addResultValueHTML.join("");
			}
			sidePanelHTML = "<div id='sidePanelScrollContainer" + componentId + "' class='lab-wf-side-panel-result-list'>" + sidePanelContentHtml + "</div>";

			//set header and action
			if(MP_TaggingHandler.isTaggingAvailable()){
				if(taggedStatus){
					$(this).removeClass('add-results-to-tagged-list');
					this.m_sidePanel.setActionsAsHTML("<div id='WF_LAB" + componentId + "tagButton' class='sp-button2 add-results-to-tagged-list'>" + labsI18N.REMOVE_TAG + "</div>");
				}else{
					this.m_sidePanel.setActionsAsHTML("<div id='WF_LAB" + componentId + "tagButton' class='sp-button2'>" + labsI18N.TAG + "</div>");
				}
			}
			this.m_sidePanel.setTitleText(resultObject.RESULT_DATA.SECONDARY_GROUP_NAME);
			this.m_sidePanel.setSubtitleAsHTML(resultValueHTML);
		}
	}else{
		resultDetailsHTML += "<dl><dd class='lab-mul-res-info'><div class='lab-mul-res-label-title secondary-text'>" + labsI18N.RESULTS_NAME + "</div><div class='lab-mul-res-text-title secondary-text'>" + labsI18N.RESULTS_VALUE + "</div><div class='lab-mul-res-text-title secondary-text'>" + labsI18N.DATE_TIME + "</div></dd>";
		var countItemsSelected = 0;
		for(var i = 0; i < selectedResultsLen; i++){
			resultObject = selectedDataObjsList[i].selectedResObj;
			group = resultObject.RESULT_DATA;
			var groupName = group.SECONDARY_GROUP_NAME;
			timeBucketResults = group.TIME_BUCKETS[resultObject.COLUMN_ID].OBJECT_ARR;
			resultCount = timeBucketResults.length;
			if (resultCount === 0) {
				var resultElem = selectedDataObjsList[i].selectedElem;
				$(resultElem).removeClass("lab-selected-res-tagging");
			}else{
				countItemsSelected++;
				result = timeBucketResults[0];
				eventID = result.EVENT_ID;
				resultObjInfo = {
						EVENT_ID: eventID,
						NAME: resultObject.RESULT_DATA.SECONDARY_GROUP_NAME
				};
				elementId = "WF_LAB" + componentId + "result" + result.RESULT;
				this.m_panelElementData[elementId] = resultObjInfo;
				resultValueHTML = "<div id = 'WF_LAB" + componentId + "sidePanelResultList'><span class=" + result.NORMALCY_CLASS + "><span class='res-ind'></span>";
				resultValueHTML += "<span class='res-val lab-res-val-selectable' id='" + elementId + "'>" + result.RES_MOD_DISPLAY + result.RESULT + "&nbsp;" + result.UOM;
				// check for comments, if at least one exists, add comment indicator
				if (result.HAS_COMMENTS_IND) {
					resultValueHTML += result.COMMENTS_IND;
				}

				resultValueHTML += result.MODIFIED_IND + "</div>";
				resultDetailsHTML += "<dd class='lab-mul-res-info'><div class='lab-mul-res-label'>" + groupName + "</div><div class='lab-mul-res-text'>" + resultValueHTML+"</div><div class='lab-mul-res-text'>" + this.formatDate(result.DTTM) + "</div></dd>";
			}
		}
		resultDetailsHTML += "<dl>";
		sidePanelHTML += "<div id='sidePanelScrollContainer" + componentId + "' class='lab-wf-side-panel-result-list'>" + resultDetailsHTML + "</div>";
		//set header and action
		var tagButtonLabel = labsI18N.REMOVE_TAG;
		var tagButtonClass = "sp-button2 add-results-to-tagged-list";
		$.each(selectedDataObjsList, function(index) {
			if(!selectedDataObjsList[index].hasOwnProperty('taggedStatus')){
				tagButtonLabel = labsI18N.TAG;
				tagButtonClass = "sp-button2";
				return false;
			}
		});
		if(MP_TaggingHandler.isTaggingAvailable()){
			this.m_sidePanel.setActionsAsHTML("<div id='WF_LAB" + componentId + "tagButton' class='sp-button2'>" + tagButtonLabel + "</div>");
		}
		this.m_sidePanel.setTitleText(countItemsSelected + " " + labsI18N.ITEMS_SELECTED);
		this.m_sidePanel.setSubtitleText("");
	}

	this.m_sidePanel.setContents(sidePanelHTML, "WF_LABContentRes" + componentId);
	// attach a click event to each result value to launch the result viewer
	this.addClickToSidePanelResults(dataObj);
	// override the click event on expand/collapse bar
	this.addClickExpandCollapse();
	// attach a click event to Tag button to add the selected list of results to the tagged list
	this.addClickToTagButton();
};

/**
 * This function will query the page level tagged list and the call the callback function to populate the side panel
 *
 */
LaboratoryComponentWF.prototype.setPanelContentsToSelectedResultCell = function(dataObj) {
	try {
		var self = this;
		var criterion = this.getCriterion();
		var userId = criterion.provider_id;
		var patientId = criterion.person_id;
		var encounterId = criterion.encntr_id;
		var pprCode = criterion.ppr_cd;
		//Create the param array to send to the CCL Script
		var params = ["^MINE^", userId + ".0", patientId + ".0", encounterId + ".0", pprCode + ".0"];
		var tagRequest = new ScriptRequest();
		tagRequest.setProgramName("MP_QUERY_TAGGED_RESULTS");
		tagRequest.setParameterArray(params);
		tagRequest.setResponseHandler(function(scriptReply){
			self.queryTaggedResultsCallback(scriptReply, dataObj);
		});
		tagRequest.performRequest();
	}
	catch(error){
		logger.logJSError(error, null, "laboratory_o2.js", "setPanelContentsToSelectedResultCell");
	}
};

/**
 * This function will be called when panel contents opened when clicked to results cell are set to attach a click event to each result value.
 * Clicking a result will launch the result viewer.
  * @param {JSON} dataObj - The data behind the cell that was clicked, as retrieved by ComponentTable.
 */
LaboratoryComponentWF.prototype.addClickToSidePanelResults = function(dataObj) {
	var compID = this.getComponentId();
	var criterion = this.getCriterion();
	var category_mean = criterion.category_mean;
	var capTimer = null;

	// Function to launch the result viewer when a result is clicked
	$("#WF_LAB" + compID + "sidePanelResultList").on("click", ".res-val", function(event) {
		try {
			results = dataObj.RESULT_DATA.TIME_BUCKETS[dataObj.COLUMN_ID].OBJECT_ARR;
			resultCnt = results.length;
			var resultName = results[0].DISPLAY_NAME;
			var eventIdArray = [];
			for (var y = 0; y < resultCnt; y++) {
				eventIdArray[y] = results[y].EVENT_ID;
			}
			var formatResName = resultName ? (resultName).replace(/'/g, "&#39") : "";
			ResultViewer.launchAdHocViewer(eventIdArray, formatResName);
			// We need the cap timers to log the details about the result
			// viewer.
			capTimer = new CapabilityTimer("CAP:MPG Labs O2 View Result", category_mean);
			if(capTimer){
				capTimer.addMetaData("rtms.legacy.metadata.1", viewName);
				capTimer.capture();
			}
		}
		catch (err) {
			logger.logJSError(err, null, "labs_o2.js", "addClickToSidePanelResults");
		}
	});
};


/**
 * This function will be called when panel contents are set to attach a click event to each result value. Clicking a result will
 * launch a result viewer just like in the tables.
 */
LaboratoryComponentWF.prototype.addClickToResults = function() {
	var self = this;
	var compID = this.getComponentId();
	var criterion = this.getCriterion();
	var personId = criterion.person_id;
	var category_mean = criterion.category_mean;
	var capTimer = null;

	// Function to launch the result viewer when a result is clicked
	$("#WF_LAB" + compID + "sidePanelResultList").on("click", ".res-val", function(event) {
		var results = {};
		var target_id = event.target.id;
		try {
			// Retrieve proper data info about selected result value
			results = self.m_panelElementData[target_id];
			if (results) {
				ResultViewer.launchAdHocViewer(results.EVENT_ID, results.NAME);
				// We need the cap timers to log the details about the result viewer.
				capTimer = new CapabilityTimer("CAP:MPG Labs O2 View Result", category_mean);
				capTimer.addMetaData("rtms.legacy.metadata.1", "Ambulatory Side Panel");
				capTimer.capture();
			}
		}
		catch (err) {
			logger.logJSError(err, null, "labs_o2.js", "addClickToResults");
		}
	});

};

/**
 * This function is called when the expand/collapse bar in the side panel is clicked.
 * Inside this function the side panel prototype function expandSidePanel is overridden to reset the max-height of the side panel scroll container
 * @param {number} graphHeight - The height (in pixels) of the portion that displays graph
 */
LaboratoryComponentWF.prototype.addClickExpandCollapse = function(graphHeight) {
	var self = this;
	self.m_sidePanel.expandSidePanel = function(){
		//if the side panel is not already expanded, then set up the missing pieces
		if (!this.m_sidePanelObj.hasClass("sp-focusin")) {
			//Add expand bar if it is not currently showing
			this.m_expCollapseBarObj.removeClass("hidden");

			// Upon expand, absolute positioning is applied to allow the side panel to
			// expand over other content
			this.m_parentContainer.css({
				position: "absolute"
			});

			// Add the styles like shadow.
			this.m_sidePanelObj.addClass("sp-focusin");

			// Replace the expand-collapse icon
			this.m_expCollapseIconObj.addClass("sp-collapse").removeClass("sp-expand");
		}

		//Set panel obj to have min-height that matches the current panel height (so it does not "expand" shorter)
		this.m_previousMinHeight = this.m_minHeight;

		//convert the "45px" strings to their respective int values 45
		var heightVal = parseInt(this.m_height, 10);
		var minHeightVal = parseInt(this.m_minHeight, 10);

		if (heightVal > minHeightVal) {
			this.setMinHeight(this.m_height);
		}

		//Remove the max-height if its already on the scroll container, otherwise it will not expand to full size
		this.m_scrollContainer.css("max-height", "");

		var titleHeight = null;

		// set up for scrolling the panel if contents exceed panel height
		var bodyContentHeight = this.m_sidePanelBodyContents[0].offsetHeight;
		titleHeight = this.m_sidePanelContents.height() - bodyContentHeight;

		// Set height to auto so it will expand to show contents
		this.m_sidePanelObj.css({
			"height": "auto"
		});

		// Incrementing scrollMaxHeight to prevent issues when the content is the
		// same height as the max (its finicky)
		var scrollMaxHeight = (this.m_sidePanelObj.height() - titleHeight) + 1;

		if(graphHeight && graphHeight!==null && graphHeight !== undefined){
			scrollMaxHeight = scrollMaxHeight - graphHeight;
		}

		// To enable the scroll bar, set the max-height. Need px here for other
		// check below to be number
		this.m_scrollContainer.css("max-height", scrollMaxHeight + "px");

		if (scrollMaxHeight === this.m_scrollContainer.height()) {
			this.m_scrollContainer.addClass("sp-add-scroll");
		}

		if (this.m_onExpandFunc) {
			this.m_onExpandFunc();
		}
	};
};

/**
 * This function will be called when "Tag"/"Remove Tag" Button shown on the side panel is clicked.
 * Clicking this button will add/remove the selected results to/from the tagged list.
 */
LaboratoryComponentWF.prototype.addClickToTagButton = function() {
	var self = this;
	var compID = self.getComponentId();
	var selectedDataObjsList = self.getSelectedDataObjsList();
	var selectedResLen = selectedDataObjsList.length;

	$("#WF_LAB" + compID + "tagButton").on("click", function(event) {
		if($(this).hasClass('add-results-to-tagged-list')){
			$(this).removeClass('add-results-to-tagged-list');
			//removes the selected results from the page level tagged list
			var deleteList = {"DELETE_TAG": {"TAG_LIST": []}};
			for(var i = selectedResLen; i--; ){
				var result = selectedDataObjsList[i].selectedResObj;
				var columnId = result.COLUMN_ID;
				var results = result.RESULT_DATA.TIME_BUCKETS[columnId].OBJECT_ARR;
				if (results.length) {
					var resultObj = results[0];
					deleteList.DELETE_TAG.TAG_LIST.push({"contentType": "LABS", "entityId": resultObj.EVENT_ID + ".0"});
				}
			}
			MP_TaggingHandler.deleteTaggedResults(deleteList);
			$(this).html(i18n.discernabu.laboratory_o2.TAG);
		}else{
			$(this).addClass('add-results-to-tagged-list');
			//add the selected results to the page level tagged list
			self.tagResult(selectedDataObjsList);
			$(this).html(i18n.discernabu.laboratory_o2.REMOVE_TAG);
		}
	});
};

/**
 * Handle the event when the user clicks within a cell of the content table
 *
 * @param {jQuery.Event}
 *                event - The jQuery click event that occurred.
 * @param {JSON}
 *                dataObj - The data behind the cell that was clicked, as retrieved by ComponentTable.
 */
LaboratoryComponentWF.prototype.contentTableCellClickHandler = function(event, dataObj) {
	var criterion = this.getCriterion();
	var compID = this.getComponentId();
	var contextMenu = null;
	var results = [];
	var resultCnt = 0;
	var self = this;
	var tagResultSelection = null;
	var x = 0;
	var category_mean = criterion.category_mean;
	var capTimer = null;
	var viewName = this.m_showAmbulatoryView ? "Ambulatory View" : "Flowsheet View";
	try {
		// Gather information about the result in the cell
		results = dataObj.RESULT_DATA.TIME_BUCKETS[dataObj.COLUMN_ID].OBJECT_ARR;
		resultCnt = results.length;
		if(resultCnt === 0 && dataObj.RESULT_DATA.TIME_BUCKETS[dataObj.COLUMN_ID].DISPLAY === "--"){
			return;
		}
		var targetElem = event.target;
		if (!targetElem) {
			return;
		}
		targetElem = $(targetElem).closest($('.labs-wf-content-col'));

		// Catch the right click event
		if (event.which === 3 || event.button === 2) {
			self.selectTargetResultCell(targetElem, dataObj);
			// Enable result tagging only if the component is launched from
			// Powerchart
			if (MP_TaggingHandler.isTaggingAvailable() && !CERN_BrowserDevInd) {
				// Remove the hover
				$("body .mpage-tooltip").remove();
				contextMenu = MP_MenuManager.getMenuObject("LabsWFContextMenu");
				if (!contextMenu) {
					contextMenu = new ContextMenu("LabsWFContextMenu").setIsRootMenu(true).setAnchorElementId("LabsWFContextMenuAnchor").setAnchorConnectionCorner(["bottom", "left"]).setContentConnectionCorner(["top", "left"]);
					tagResultSelection = new MenuSelection("tagResult").setLabel(i18n.discernabu.laboratory_o2.TAG).setIsSelected(true).setSelectedClass("labs-wf-tag-icon");
					contextMenu.addMenuItem(tagResultSelection);
					MP_MenuManager.addMenuObject(contextMenu);
				}
				// Update the click function for the contextMenu
				tagResultSelection = contextMenu.getMenuItemArray()[0];
				tagResultSelection.setClickFunction(function() {
					var selectedDataObjsList = self.getSelectedDataObjsList();
					self.tagResult(selectedDataObjsList);
					var tagButtonElement = $("#WF_LAB" + compID + "tagButton");
					if(tagButtonElement.hasClass('add-results-to-tagged-list')){
						tagButtonElement.html(i18n.discernabu.laboratory_o2.REMOVE_TAG);
					}else{
						tagButtonElement.addClass('add-results-to-tagged-list');
						tagButtonElement.html(i18n.discernabu.laboratory_o2.REMOVE_TAG);
					}
				});
				// Update the x and y coordinates of the menu and set the anchor
				// element
				contextMenu.setXOffset(event.pageX).setYOffset(event.pageY).setAnchorElement();
				MP_MenuManager.showMenu("LabsWFContextMenu");
				contextMenu.removeAnchorElement();
			}
		}
		else if (event.target.nodeName.toUpperCase() === "SPAN" && !self.SIDE_PANEL_AVAILABLE) {
			// Clicked a result so display the result viewer
			// Launch win32 result viewer if the result is clicked in Powerchart
			// or launch the result viewer if clicked from browser
			targetElem = event.target;
			var encntrId = criterion.encntr_id;
			var personId = criterion.person_id;
			var resultName = results[0].DISPLAY_NAME;
			var eventIdArray = [];
			for (var y = 0; y < resultCnt; y++) {
				eventIdArray[y] = results[y].EVENT_ID;
			}

			var formatResName = resultName ? (resultName).replace(/'/g, "&#39") : "";
			// ResultViewer.launchAdHocViewer(personId, encntrId,eventIdArray,
			// "EVENT", null, null, null, null, formatResName);
			ResultViewer.launchAdHocViewer(eventIdArray, formatResName);

			// We need the cap timers to log the details about the result
			// viewer.
			capTimer = new CapabilityTimer("CAP:MPG Labs O2 View Result", category_mean);
			capTimer.addMetaData("rtms.legacy.metadata.1", viewName);
			capTimer.capture();
		}
		else{
			//prevent default text selection
			self.m_tableContainer.disableSelection();
			if (event.shiftKey) {
				self.selectTargetResultCell(targetElem, dataObj);
				var selectedDataObjsList = self.getSelectedDataObjsList();
				var firstSelectedRes = selectedDataObjsList[0];
				var lastSelectedRes = selectedDataObjsList[selectedDataObjsList.length - 1];
				//highlightSelectedRow() is called to remove the highlight from any row if selected previously
				self.highlightSelectedRow(false, false, false);
				self.multipleResultSelection(self.m_componentTable, firstSelectedRes, lastSelectedRes);
			}
			else if (event.ctrlKey) {
				if($(targetElem).hasClass("lab-selected-res-tagging")){
					self.deselectTargetResultCell(targetElem);
				}else{
					self.selectTargetResultCell(targetElem, dataObj);
				}
			} else{
				//highlightSelectedRow() is called to remove the highlight from any row if selected previously
				self.highlightSelectedRow(false, false, false);
				self.selectTargetResultCell(targetElem, dataObj);
			}
			//opens side panel
			if (self.SIDE_PANEL_AVAILABLE) {
				self.setPanelContentsToSelectedResultCell(dataObj);
			}
		}
	}
	catch (err) {
		logger.logJSError(err, null, "laboratory_o2.js", "contentTableCellClickHandler");
	}
};

/**
 * Create the hover HTML for a group of results
 *
 * @param {JSON}
 *                dataObj - The data behind the cell that was hovered, as retrieved by ComponentTable.
 */
LaboratoryComponentWF.prototype.createResultHover = function(dataObj) {
	var additionalClass = "";
	var dateResult = null;
	var group = null;
	var hoverHTML = [];
	var labsI18N = i18n.discernabu.laboratory_o2;
	var moreHoverHTML = [];
	var result = null;
	var resultCnt = 0;
	var timeBucketResults = [];
	var x = 0;

	// Grab the result information
	group = dataObj.RESULT_DATA;
	timeBucketResults = group.TIME_BUCKETS[dataObj.COLUMN_ID].OBJECT_ARR;
	resultCnt = timeBucketResults.length;
	if (resultCnt === 0) {
		if (group.TIME_BUCKETS[dataObj.COLUMN_ID].DISPLAY.indexOf("labs-wf-results-unknown") >= 0) {
			return "<div class='hvr labs-wf-hover'>" + i18n.discernabu.LIMITED_RESULTS + "</div>";
		}
		return null;
	}

	// Create the HTML for the hover
	hoverHTML.push("<div class='hvr labs-wf-hover'>");
	moreHoverHTML.push("<div class='labs-wf-hover-additional'><div>" + labsI18N.ADDITIONAL_RESULTS + "</div><dl>");
	additionalClass = (resultCnt > 1) ? "labs-wf-hover-seperator" : "";
	for ( x = 0; x < resultCnt; x++) {
		result = timeBucketResults[x];
		if (x === 0) {
			// Grab all of the information for the face up result
			hoverHTML.push("<div class='labs-wf-hover-main ", additionalClass, "'><dl><dt><span>", result.RESULT_NAME, ":</span></dt><dd><span class='", result.NORMALCY_CLASS, "'>", result.RES_MOD_DISPLAY, result.RESULT, " ", result.UOM, "</span>", result.MODIFIED_IND, "</dd><dt><span>", labsI18N.DATE_TIME, ":</span></dt><dd><span>", this.formatDate(result.DTTM), "</span></dd><dt><span>", labsI18N.STATUS, ":</span></dt><dd><span>", result.STATUS || "--", "</span></dd><dt><span>", labsI18N.NORMAL_LOW, ":</span></dt><dd><span>", result.NLOW || "--", "</span></dd><dt><span>", labsI18N.NORMAL_HIGH, ":</span></dt><dd><span>", result.NHIGH || "--", "</span></dd><dt><span>", labsI18N.CRITICAL_LOW, ":</span></dt><dd><span>", result.CLOW || "--", "</span></dd><dt><span>", labsI18N.CRITICAL_HIGH, ":</span></dt><dd><span>", result.CHIGH || "--", "</span></dd></dl></div>");
		}
		else {
			// Ensure the numerical results and dates are formatted for i18n and
			// save it back to the object
			this.formatResult(result);
			modifiedDisplay = (result.STATUS_MEAN === "MODIFIED" || result.STATUS_MEAN === "ALTERED") ? "<span class='res-modified'>&nbsp</span>" : "";
			// Grab only some information from the hidden results
			moreHoverHTML.push("<dd><span class='", result.NORMALCY_CLASS, "'><span class='res-ind'>&nbsp;</span>", result.RES_MOD_DISPLAY, result.RESULT, " ", result.UOM, "</span>", modifiedDisplay, "</dd>");
		}
	}
	if (moreHoverHTML.length > 1) {
		moreHoverHTML.push("</div>");
		hoverHTML.push(moreHoverHTML.join(""));
	}
	hoverHTML.push("</dl></div>");
	return hoverHTML.join("");
};

/**
 * Render the Laboratory component
 */
LaboratoryComponentWF.prototype.renderComponent = function(recordData) {
	var column = null;
	var columnWidth = this.m_minColumnWidth;
	var compId = this.getStyles().getId();
	var contentTable = null;
	var contentTableContainer = null;
	var contentTableWidth = this.calculateContentTableWidth();
	var contextMenuControl = "";
	var disclaimerMessage = "";
	var sidePanelHTML = "";
	var labelTableHTML = "";
	var contentTableHTML = "";
	var wholeCompHTML = "";
	var groupCnt = null;
	var hoverExtension = null;
	var infoButtonActiveClass = this.isInfoButtonEnabled() ? "labs-wf-info-button-active" : "";
	var labelTable = null;
	var labelTableContainer = null;
	var pixelBuffer = this.m_pixelBuffer;
	var scrollController = null;
	var showAmbulatoryView = this.getShowAmbulatoryView();
	var self = this;
	var timeBucketCnt = 0;
	var x = 0;
	var resultViewerTimer = null;

	try {
		// Ensure the script hasn't returned a false positive
		if (!recordData.PG.length) {
			this.finalizeComponent(MP_Util.HandleNoDataResponse(this.getStyles().getNameSpace()));
			return;
		}

		// Prepare all of the Laboratory data for the ComponentTable framework
		this.processData(recordData);

		// Create the label table. This table will house just the labels for
		// each of the result row and will not scroll horizontally
		labelTable = new ComponentTable().setNamespace(this.getStyles().getId() + "Labels").setCustomClass("labs-wf-table");
		if (!showAmbulatoryView) {
		labelTable.addColumn(new TableColumn()
			.setColumnId("labelCol")
			.setColumnDisplay("&nbsp;<br />&nbsp;")
			.setCustomClass('labs-wf-label-col')
			.setRenderTemplate(
				'<span class="labs-wf-info-button">&nbsp;</span><span class="labs-wf-sub-sec-name" title="${SECONDARY_GROUP_NAME}">${SECONDARY_GROUP_NAME}</span>'));
		labelTable.addColumn(new TableColumn()
			.setColumnId("uomCol")
			.setColumnDisplay("&nbsp;<br />&nbsp;")
			.setCustomClass('labs-wf-uom-col')
			.setRenderTemplate('<span title="${FIRST_RES_UOM}" class="labs-wf-result-uom">${FIRST_RES_UOM}</span>'));
	} else {
		labelTable.addColumn(new TableColumn().setColumnId("labelCol").setColumnDisplay("&nbsp;").setCustomClass('labs-wf-label-col').setRenderTemplate(
			'<span class="labs-wf-info-button">&nbsp;</span><span title="${SECONDARY_GROUP_NAME}"' + (self.getDateFormat() !== 4 ? ' class="labs-wf-sub-sec-name"' : '')
				+ '>${SECONDARY_GROUP_NAME}</span><br /><span class="labs-wf-result-uom">${FIRST_RES_UOM}</span>'));
		}

		// Add a group toggle callback extension so we can expand and collapse
		// the group in both the labels and content tables
		labelTable.addExtension(new TableGroupToggleCallbackExtension().setGroupToggleCallback(function(event, data) {
			// Make sure to collapse theContent table section as well
			if (data.GROUP_DATA.EXPANDED) {
				contentTable.openGroup(data.GROUP_DATA.GROUP_ID);
			}
			else {
				contentTable.collapseGroup(data.GROUP_DATA.GROUP_ID);
			}
			// Call the resize function since the visible area has
			// changed
			self.resizeComponent();
		}));
		// Create the cell click callback extension for the info button and
		// potentially discrete graphing
		labelTable.addExtension(new TableCellClickCallbackExtension().setCellClickCallback(function(event, data) {
			self.labelTableCellClickHandler(event, data);
		}));
		// set label table
		this.setLabelTable(labelTable);
		// Create the content table
		contentTable = new ComponentTable().setNamespace(this.getStyles().getId() + "Content").setCustomClass("labs-wf-table");
		// Add a group toggle callback extension so we can expand and collapse
		// the group in both the labels and content tables
		contentTable.addExtension(new TableGroupToggleCallbackExtension().setGroupToggleCallback(function(event, data){
			self.toggleLabelTableExtension(event, data);
		}));
		// Create the hover extension and define special logic for applying
		// hover classes
		hoverExtension = new TableCellHoverExtension();
		// .setHoverClass("");
		contentTable.addExtension(hoverExtension);
		// Create the cell click extension for right click menu
		contentTable.addExtension(new TableCellClickCallbackExtension().setCellClickCallback(function(event, data) {
			self.contentTableCellClickHandler(event, data);
		}));
		timeBucketCnt = recordData.TG.length;
		// Create each of the columns for the content table
		// Determine the width of our columns if there are only a few results
		if (contentTableWidth > (timeBucketCnt * columnWidth)) {
			// Change the column width so the columns will fill the available
			// space
			columnWidth = Math.floor(contentTableWidth / timeBucketCnt);
		}
		if (!showAmbulatoryView) {
			for ( x = 0; x < timeBucketCnt; x++) {
				column = this.createTableColumn(recordData.TG[x]).setWidth(columnWidth);
				if (!this.SIDE_PANEL_AVAILABLE) {
					hoverExtension.addHoverForColumn(column, function (dataObj) {
						return self.createResultHover(dataObj);
					});
				}
				contentTable.addColumn(column);
			}
		}
		else {
			var resultTimeBucket = recordData.PG[0].RG[0].TIME_BUCKETS;
			// using recordData.PG[0].RG[0].TIME_BUCKETS to retrieve the column
			// display and class since that was last processed
			if (resultTimeBucket) {
				for ( x = 0; x < this.m_ambulatoryColumnCount; x++) {
					column = this.createAmbulatoryViewColumn(x, resultTimeBucket).setWidth(columnWidth);
					if (!this.SIDE_PANEL_AVAILABLE) {
						hoverExtension.addHoverForColumn(column, function (dataObj) {
							return self.createResultHover(dataObj);
						});
					}
					contentTable.addColumn(column);
				}
			}
		}

		// Create each of the groups for the table and bind the data
		groupCnt = recordData.PG.length;
		for ( x = 0; x < groupCnt; x++) {
			labelTable.addGroup(this.createTableGroup(recordData.PG[x], true));
			contentTable.addGroup(this.createTableGroup(recordData.PG[x], false));
		}

		// Create the table shells for this component
		contextMenuControl = (MP_TaggingHandler.isTaggingAvailable()) ? "oncontextmenu='return false;'" : "";
		var tableContainerClass = "labs-wf-table-container";

		// Create the disclaimer message if needed
		if (this.m_showingLatestResults && !showAmbulatoryView) {
			disclaimerMessage = "<div class='labs-wf-disclaimer'>" + this.createDisclaimerMessage() + "</div>";
		}

		// Add a place holder for right side panel only if browser version
		// supports Canvas
		if (this.SIDE_PANEL_AVAILABLE) {
			sidePanelHTML += "<div id ='" + compId + "sidePanelContainer' class='labs-wf-side-panel'>&nbsp;</div>";
		}
		if (showAmbulatoryView) {
			// side panel disabled
			tableContainerClass += " labs-wf-ambulatory-table";
		}

		labelTableHTML = labelTable.render();
		this.m_componentTable = contentTable;
		contentTableHTML = contentTable.render();

		wholeCompHTML = "<div id='" + compId + "TableContainer' class='" + tableContainerClass + "'><div id='" + compId + "LabelTableContainer' class='labs-wf-label-table " + infoButtonActiveClass + "'>" + labelTableHTML + "</div><div id='" + compId + "ContentTableContainer' class='labs-wf-content-table' " + contextMenuControl + ">" + contentTableHTML + "</div><div id='" + compId + "ScrollController' class='labs-wf-scroll-controller-hidden'><span class='labs-wf-scroller-content'>&nbsp;</span></div></div>" + sidePanelHTML + disclaimerMessage;

		this.finalizeComponent(wholeCompHTML);
		// Resize the columns based on the number of time buckets
		contentTableContainer = $("#" + compId + "ContentTableContainer");
		// Set the width of the content table container so it will horizontal scroll
		// Regather contentTableWidth in case the side panel was added
		this.m_contentTableWidth = 0;
		contentTableWidth = this.calculateContentTableWidth();
		contentTableContainer.width(contentTableWidth);
		// Set the width of the content table so it will not wrap
		contentTableContainer.find("#" + compId + "Contenttable").width(timeBucketCnt * columnWidth + pixelBuffer);
		// Hide the subsection toggles for the content table
		contentTableContainer.find(".sub-sec-hd-tgl").addClass("labs-wf-content-sub-sec-tgl");
		// Provide inline styline for the first column of the content table to
		// override list-as-table styling
		contentTableContainer.find(".labs-wf-first-content-col").css("padding-left", 6);
		//Provide unique row id and column id
		contentTableContainer.find(".result-info").each(function(index){
			$(this).children().attr("rowIndex", index).addClass("rowIndex" + compId + index);
			$(this).find(".table-cell").each(function(colInd){
				$(this).attr("colIndex", colInd).addClass("colIndex" + compId + colInd);
			});
		});
		// Finalize the ComponentTables so it will apply all of our delegates
		labelTable.finalize();

		// Save references to the table container element so we dont have to get them again
		this.m_tableContainer = $("#" + compId + "TableContainer");
		this.m_labelTableContainer = $("#" + compId + "LabelTableContainer");
		this.m_labelTableBody = this.m_labelTableContainer.find(".content-body");
		this.m_contentTableContainer = contentTableContainer;
		this.m_contentTableBody = this.m_contentTableContainer.find(".content-body");
		this.m_contentTableContents = this.m_contentTableBody.find(":first-child");
		this.m_scrollController = $("#" + compId + "ScrollController");
		this.m_tableReferencesSet = true;

		// Apply special styling to cells where data may be unknown
		this.m_contentTableContainer.find(".labs-wf-results-unknown").parent().addClass("labs-wf-unknown-parent");

		// Add the scroll listeners on the tables
		this.m_tableContainer.on("mousewheel", function(event) {
			return self.scrollTables(event);
		});
		// Attach scroll events to the scroller that will scroll the two tables
		this.m_scrollController.scroll(function(event) {
			self.scrollTables(event);
		});

		// Calls function to show tooltip when hovering over toggle buttons
		this.toggleButtonHover.call();

		// Add the side panel. Have to include this after finalize due to DOM
		// elements not existing until finalize
		if (this.SIDE_PANEL_AVAILABLE) {

			// Initialize the side panel
			this.initializeSidePanel();

			// Show the result data for the first row in the side panel, format
			// the result object correctly
			var firstRowResultObject = recordData.PG[0].RG[0];
			firstRowResultObject.RESULT_DATA = firstRowResultObject;
		}else {
			$(".labs-wf-content-col span").hover(function () {
				$(this).addClass('labs-wf-content-col-ie-low-version');
			});
		}

		// Trigger the CAP timer for the result viewer
		resultViewerTimer = new CapabilityTimer("CAP:MPG Laboratory O2 View Type", this.criterion.category_mean);
		if (resultViewerTimer) {
			if (showAmbulatoryView === true) {
				resultViewerTimer.addMetaData("rtms.legacy.metadata.1", "Ambulatory View");
			}
			else {
				resultViewerTimer.addMetaData("rtms.legacy.metadata.1", "Flowsheet View");
			}
			resultViewerTimer.capture();
		}
	}
	catch (err) {
		logger.logJSError(err, this, "laboratory_o2.js", "renderComponent");
		throw (err);
	}
	finally {
		// nothing
	}
};

/**
 * The postProcessing method calls the CERN_EventListener for lab's retrieveComponentData
 * @returns {undefined} - This function does not return anything.
 */
LaboratoryComponentWF.prototype.postProcessing = function(){
	//call parent's postProcessing
	MPageComponent.prototype.postProcessing.call(this);
	// Add an event listener for clinical event updates
	CERN_EventListener.addListener(this, EventListener.EVENT_CLINICAL_EVENT, this.retrieveComponentData, this);
};

/**
 * This method will be called on each row selection to update the background color of selected row and font color to indicate that
 * this is the currently selected row
 *
 * @param {element}
 *                selRowLabelObj - The current row label element that was selected
 * @param {element}
 *                selRowResultsObj - The current row results element that was selected
 * @param {boolean}
 *                isInitialLoad - A flag to indicate whether it is initial load
 */
LaboratoryComponentWF.prototype.highlightSelectedRow = function(selRowLabelObj, selRowResultsObj, isInitialLoad) {
	try {
		this.clearSelectedResults();
		var compID = this.getComponentId();
		var rowLabelID = "";
		var rowResultID = "";

		// Fix up the element ids, remove the :'s and set them up with escape
		// chars, we only want to do this when selRowLabelObj is true

		if (selRowLabelObj) {
			var labelParts = selRowLabelObj.id.split(":");
			for (var i = 0; i < labelParts.length; i++) {
				rowLabelID += labelParts[i];
				// If not the last part, add an escaped colon
				if ((i + 1) !== labelParts.length) {
					rowLabelID += "\\:";
				}
			}

			var resultParts = selRowResultsObj.id.split(":");
			for ( i = 0; i < resultParts.length; i++) {
				rowResultID += resultParts[i];
				// If not the last part, add an escaped colon
				if ((i + 1) !== resultParts.length) {
					rowResultID += "\\:";
				}
			}
		}

		var tableViewObj = $("#WF_LAB" + compID + "TableContainer");
		var prevRow = tableViewObj.find(".selected");

		// Remove the background color of previous selected row.
		if (prevRow.length) {
			if (prevRow.hasClass("labs-wf-selected-row selected")) {
				prevRow.removeClass("labs-wf-selected-row selected");
			}
			if (prevRow.hasClass("labs-wf-selected-row-init selected")) {
				prevRow.removeClass("labs-wf-selected-row-init selected");
			}
		}

		// Change the background color to indicate that the row is selected. If
		// its an initial load then the first row has a different styling
		var newClass = "labs-wf" + ( isInitialLoad ? "-selected-row-init" : "-selected-row") + " selected";
		$("#" + rowLabelID).addClass(newClass);
		$("#" + rowResultID).addClass(newClass);
	}
	catch (err) {
		logger.logJSError(err, this, "laboratory_o2.js", "highlightSelectedRow");
	}
};

/**
 * This method will be called only one time, after finalizing the component. This method will initialize the side panel by adding the
 * place holders for the group name and table
 * holding the results of selected row.
 */
LaboratoryComponentWF.prototype.initializeSidePanel = function() {
	var self = this;
	var compID = this.getComponentId();
	var sidePanelContId = "WF_LAB" + compID + "sidePanelContainer";
	this.m_sidePanelContainer = $("#" + sidePanelContId);

	// get current height of table
	var tableHeight = $("#WF_LAB" + compID + "TableContainer").css("height");

	// Add place holders for group name and result table
	var sidePanelHTML = "<div id='WF_LAB" + compID + "sidePanelResultsContainer'><div id='WF_LAB" + compID + "sidePanelGroupName' class='labs-wf-side-panel-groupname'>&nbsp;</div><div id='sidePanelScrollContainer" + compID + "'><div class='labs-wf-section-separator'><div class='labs-wf-title-text'>" + i18n.discernabu.laboratory_o2.RESULTS + "</div><div class='sp-separator'>&nbsp;</div></div><div id='WF_LAB" + compID + "sidePanelResultList' class='labs-wf-side-panel-result-list'>&nbsp;</div></div></div>";

	// Create the side panel
	if (this.m_sidePanelContainer.length) {
		// Render the side panel
		this.m_sidePanel = new CompSidePanel(compID, sidePanelContId);
		this.m_sidePanel.setExpandOption(this.m_sidePanel.expandOption.EXPAND_DOWN);
		this.m_sidePanel.setHeight(tableHeight);
		this.m_sidePanel.setMinHeight(this.m_sidePanelMinHeight);
		this.m_sidePanel.renderPreBuiltSidePanel();
		this.m_sidePanel.showCornerCloseButton();
		// Set the function that will be called when the close button on the
		// side panel is clicked
		this.m_sidePanel.setCornerCloseFunction(function() {
			self.m_tableContainer.removeClass("labs-wf-side-panel-addition");
			self.highlightSelectedRow(false, false);
			self.m_showPanel = false;
			self.m_clickedLabel = null;
			self.m_sidePanelContainer.removeAttr("style");
			self.resizeComponent();
		});
	}
};
/**
 * Map the Laboratory option 2 object to the bedrock filter mapping so the architecture will know what object to create when it sees
 * the "WF_LAB" filter
 */
MP_Util.setObjectDefinitionMapping("WF_LAB", LaboratoryComponentWF);
