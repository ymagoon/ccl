/*
 * Modified the Document Component. A user can now select the documents
 * that are written by him/her. Moreover, the list of documents can be
 * sorted in ascending or descending order according to Document Name, Author Name
 * or Date.
 * Modified by CJ025362
 */
function DocumentComponentStyle() {
	this.initByNamespace("doc");
}

DocumentComponentStyle.prototype = new ComponentStyle();
DocumentComponentStyle.prototype.constructor = ComponentStyle;

/**
 * The Document component will retrieve all documents associated to the encounter for the specified lookback days defined by the
 * component.
 *
 * @param {Criterion}
 *            criterion
 */
function DocumentComponent(criterion) {
	this.setCriterion(criterion);
	this.setLookBackDropDown(true);
	this.setStyles(new DocumentComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.DOCUMENTS.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.DOCUMENTS.O1 - render component");
	this.m_resultStatusCodes = null;
	// meanings is used to allow loading of the status codes
	// when needed aka 'lazy loading'. Hence why the retrieval of
	// meanings is not exposed to the consumer. Only retrieval of codes
	// is available.
	this.m_resultStatusMeanings = null;
	this.setIncludeLineNumber(true);
	this.m_PowerNoteFavInd = false;
	this.m_docImagesInd = false;
	this.DocI18n = i18n.discernabu.documents_o1;
	this.processedDocs = [];
	this.myDocs = [];
	this.docCount = 0;
	this.documentsTable = null;
	this.checked = false;
	this.setPregnancyLookbackInd(true);

	CERN_EventListener.addListener(this, EventListener.EVENT_ADD_DOC, this.retrieveComponentData, this);
}

DocumentComponent.prototype = new MPageComponent();
DocumentComponent.prototype.constructor = MPageComponent;

/**
 * To launch either the Millennium viewer or web viewer on whether the component is being shown within the browser or within
 * Millennium.
 *
 * @param (number)
 *            eventId The event Id associated with the document to be shown in the viewer
 * @return null
 */
DocumentComponent.prototype.launchDocumentViewer = function(eventId) {
	var timer = new CapabilityTimer("CAP:MPG Documents O1 View Result", this.getCriterion().category_mean);
	timer.capture();
	// If document type clicked call document viewer
	ResultViewer.launchAdHocViewer(eventId);
};

/**
 * To launch the the web document viewer or to navigate to the URL associated with any images associated with a specific document.
 *
 * @param (number)
 *            eventId The event Id associated with the document to be shown in the viewer
 * @return null
 */
DocumentComponent.prototype.launchDocumentImageViewer = function(eventId) {
	var timer = new CapabilityTimer("CAP:MPG Documents O1 View Image", this.getCriterion().category_mean);
	timer.capture();
	// If image clicked call the image viewer
	ResultViewer.launchAdHocImageViewer(eventId);
};
DocumentComponent.prototype.setResultStatusCodes = function(value) {
	this.m_resultStatusCodes = value;
};
DocumentComponent.prototype.addResultStatusCode = function(value) {
	if (!this.m_resultStatusCodes) {
		this.m_resultStatusCodes = [];
	}
	this.m_resultStatusCodes.push(value);
};
DocumentComponent.prototype.getResultStatusCodes = function() {
	if (this.m_resultStatusCodes) {
		return this.m_resultStatusCodes;
	}
	else {
		if (this.m_resultStatusMeanings) {
			// load up codes from meanings
			var resStatusCodeSet = MP_Util.GetCodeSet(8, false);
			if (this.m_resultStatusMeanings && this.m_resultStatusMeanings.length > 0) {
				for (var x = this.m_resultStatusMeanings.length; x--; ) {
					var code = MP_Util.GetCodeByMeaning(resStatusCodeSet, this.m_resultStatusMeanings[x]);
					if (code) {
						this.addResultStatusCode(code.codeValue);
					}
				}
			}
		}
	}
	return this.m_resultStatusCodes;
};
DocumentComponent.prototype.addResultStatusMeaning = function(value) {
	if (!this.m_resultStatusMeanings) {
		this.m_resultStatusMeanings = [];
	}
	this.m_resultStatusMeanings.push(value);
};
DocumentComponent.prototype.setResultStatusMeanings = function(value) {
	this.m_resultStatusMeanings = value;
};
DocumentComponent.prototype.FilterRefresh = function() {
	this.retrieveComponentData();
};
DocumentComponent.prototype.openTab = function() {
	var criterion = this.getCriterion();
	var sParms = "/PERSONID=" + criterion.person_id + " /ENCNTRID=" + criterion.encntr_id + " /FIRSTTAB=^" + this.getLink() + "+^";
	APPLINK(0, criterion.executable, sParms);
};
DocumentComponent.prototype.getPowerNoteFavInd = function() {
	return this.m_PowerNoteFavInd;
};
DocumentComponent.prototype.setPowerNoteFavInd = function(value) {
	this.m_PowerNoteFavInd = (value == 1 ? true : false);
};
DocumentComponent.prototype.isDocImagesInd = function() {
	return this.m_docImagesInd;
};
DocumentComponent.prototype.setDocImagesInd = function(value) {
	this.m_docImagesInd = (value == 1 ? true : false);
};
DocumentComponent.prototype.postProcessing = function() {
	MPageComponent.prototype.postProcessing.call(this);
	if (this.isScrollingEnabled() && this.getScrollNumber()) {
		// honoring the bedrock setting for scroll.
		var node = this.getSectionContentNode();
		// enable scrolling - 1.6 is minimum height
		MP_Util.Doc.InitScrolling(Util.Style.g("scrollable", node, "div"), this.getScrollNumber(), "1.6");
		// shifts the header only when the scroll is applied.
		if (this.docCount > this.getScrollNumber()) {
			$("#doc" + this.getComponentId() + "tableBody").addClass("scrollable");
			$("#doc" + this.getComponentId() + "header").addClass("shifted");
		}
	}
};
/**
 * Creates the filterMappings that will be used when loading the component's bedrock settings
 */
DocumentComponent.prototype.loadFilterMappings = function () {
	// Add the filter mapping object for the retrieving MMF Document URL Images
	this.addFilterMappingObject("DOC_URL_IMAGES", {
		setFunction: this.setDocImagesInd,
		type: "BOOLEAN",
		field: "FREETEXT_DESC"
	});
};
/*
 * retrieveComponentData, Implementation of retrieveComponentData
 */
DocumentComponent.prototype.retrieveComponentData = function() {
	var sendAr = [];
	var component = this;
	var criterion = component.getCriterion();
	var deferViewerTypeRetrieval = 1;
	var groups = component.getGroups();
	var codes = component.getResultStatusCodes();
	var viewCategoryMean = this.getCriterion().category_mean;
	var loadTimer = new RTMSTimer(this.getComponentLoadTimerName(), viewCategoryMean);
	var renderTimer = new RTMSTimer(this.getComponentRenderTimerName(), viewCategoryMean);
	var events = (groups && groups.length > 0) ? groups[0].getEventSets() : null;
	var results = (codes && codes.length > 0) ? codes : null;

	var encntrOption = (component.getScope() === 2) ? (criterion.encntr_id + ".0") : "0.0";
	sendAr.push("^MINE^", criterion.person_id + ".0", encntrOption, criterion.provider_id + ".0", component.getLookbackUnits());
	if (component.getGrouperFilterEventSets()) {
		var filterESArray = component.getGrouperFilterEventSets();
		sendAr.push(MP_Util.CreateParamArray(filterESArray, 1));
		sendAr.push(MP_Util.CreateParamArray(codes, 1));
	}
	else {
		sendAr.push(MP_Util.CreateParamArray(events, 1));
		sendAr.push(MP_Util.CreateParamArray(results, 1));
	}

	var unitType = component.getLookbackUnitTypeFlag();
	sendAr.push(criterion.ppr_cd + ".0", unitType);
	sendAr.push(component.isDocImagesInd() ? 1 : 0);
	if (component.isPlusAddEnabled()) {
		var pnFavInd = component.getPowerNoteFavInd();
		sendAr.push( pnFavInd ? 1 : 0);
	}
	else {
		sendAr.push(0);
	}

	// Set the flag to defer viewer type retrieval
	sendAr.push(deferViewerTypeRetrieval);

	var scriptRequest = new ComponentScriptRequest();
	scriptRequest.setProgramName("MP_RETRIEVE_DOCUMENTS_JSON_DP");
	scriptRequest.setParameterArray(sendAr);
	scriptRequest.setResponseHandler(function(scriptReply) {
		component.renderComponent(scriptReply);
	});
	scriptRequest.setComponent(component);
	scriptRequest.setLoadTimer(loadTimer);
	scriptRequest.setRenderTimer(renderTimer);
	scriptRequest.performRequest();
};

/**
 * Appends the dropdown to the header.
 */
DocumentComponent.prototype.appendDropdown = function(pcnFav) {
	var component = this;
	var uniqueComponentId = component.getStyles().getId();
	// If there are no favorites, don't bother adding the drop down menu
	if (!pcnFav || !pcnFav.length) {
		return;
	}
	// If we have already added the menu, don't add it again
	if ($(component.getRootComponentNode()).find("#headerMenu" + uniqueComponentId).length) {
		return;
	}
	// replace the image element with the span.
	var dropDownSpan = Util.cep("span", {
		"className": "drop-down-ctrl"
	});
	var link = Util.cep("a", {
		"className": "drop-Down",
		"id": "headerMenu" + uniqueComponentId
	});
	var menu = Util.cep("div", {
		"id": uniqueComponentId + "Menu",
		"className": "form-menu menu-hide"
	});
	Util.ac(dropDownSpan, link);
	var sec = _g(component.getStyles().getId());

	var secCL = Util.Style.g("sec-hd", sec, "h2");
	var secSpan = secCL[0];
	// Append the chevron icon to the title.
	var secTitle = Util.Style.g("sec-title", secSpan, "span");
	var secTitleSpan = secTitle[0];
	Util.ac(link, secTitleSpan);
	Util.ac(secTitleSpan, secSpan);
	Util.ac(menu, secSpan);
	this.pcnFavLoad(pcnFav, component);
};

/**
 * ProcessResultsForRender Process the document object so that rendering becomes trivial.
 */
DocumentComponent.prototype.processResultsForRender = function(documentsArr) {
	var component = this;
	var DocI18n = i18n.discernabu.documents_o1;
	var compNS = this.getStyles().getNameSpace();

	/*
	 * ProcessDocumentHover Processes document object so that rendering of hover becomes trivial.
	 */

	function processDocumentHover(documentObj) {
		var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
		var docName = documentObj.EVENT_CD_DISP;
		var docSubject = (documentObj.SUBJECT).replace(/</g, "&lt;").replace(/>/g, "&gt;");
		var docStatus = documentObj.RESULT_STATUS_CD_DISP;
		var lastUpdated = component.DocI18n.UNKNOWN;
		var lastUpdatedBy = component.DocI18n.UNKNOWN;

		var recentPart = getLatestParticipation(documentObj);
		if (recentPart && recentPart.PRSNL_NAME !== "") {
			lastUpdatedBy = recentPart.PRSNL_NAME;
			var dtTm = new Date();
			if (recentPart.DATE !== "") {
				dtTm.setISO8601(recentPart.DATE);
				lastUpdated = df.format(dtTm, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
			}
			else {
				lastUpdated = component.DocI18n.UNKNOWN;
			}
		}
		else {
			lastUpdatedBy = component.DocI18n.UNKNOWN;
			lastUpdated = component.DocI18n.UNKNOWN;
		}
		// Creates the hover markup
		return "<div class = 'doc-hover'><dl class='doc-det'><dt class='doc-det-type'><span><span>" + component.DocI18n.NAME + ":</span></dt><dd><span>" + docName + "</span></dd><dt class='doc-det-type'><span>" + component.DocI18n.SUBJECT + ":</span></dt><dd><span>" + docSubject + "</span></dd><dt class='doc-det-type'><span>" + component.DocI18n.STATUS + "</span>:</dt><dd><span>" + docStatus + "</span></dd><dt class='doc-det-type'><span>" + component.DocI18n.LAST_UPDATED + "</span>:</dt><dd><span>" + lastUpdated + "</span></dd><dt class='doc-det-type'><span>" + component.DocI18n.LAST_UPDATED_BY + "</span>:</dt><dd><span>" + lastUpdatedBy + "</span></dd></dl></div>";

	}

	function getLatestParticipation(doc) {
		var actionProviders = doc.ACTION_PROVIDERS;
		var providerLength = actionProviders.length;
		var latesParticipant = actionProviders[providerLength - 1];
		for (var x = providerLength; x--; ) {
			var part = actionProviders[x];
			if (part.DATE > latesParticipant.DATE) {
				latesParticipant = part;
			}
		}
		return (latesParticipant);
	}

	function getAuthorParticipant(doc) {
		// the author of a document, according to doc services, will be on the
		// Contribution object. It�s the PERFORM action in the participation
		// list.
		var returnPart = null, typeCd = null, statusCd = null, part = null, strPerform = "PERFORM", strCompleted = "COMPLETED";
		for (var y = doc.ACTION_PROVIDERS.length; y--; ) {
			part = doc.ACTION_PROVIDERS[y];
			typeCd = part.TYPE_CD_MEANING;
			statusCd = part.STATUS_CD_MEANING;
			if ((typeCd === strPerform) && (statusCd === strCompleted)) {
				returnPart = part;
				break;
			}
		}
		return (returnPart);
	}

	var docArrLen = documentsArr.length;
	for (docArrLen; docArrLen--; ) {

		var docObj = documentsArr[docArrLen];
		var docStatus = docObj.RESULT_STATUS_CD_MEAN;
		var doc = docObj.EVENT_CD_DISP;
		var imageUrl = docObj.IMAGE_URL;

		var dateOfService = null;
		var withinDateDos = null;
		var dateTime = new Date();

		// Create the display for the document type
		docObj.CATEGORY_DISPLAY = "<span><a>" + doc + "</a></span>";

		if (docStatus === "MODIFIED" || docStatus === "ALTERED") {
			docObj.CATEGORY_DISPLAY += "<span class='res-modified'>&nbsp;</span>";
		}
		// FACE UP DATE
		if (docObj.EFFECTIVE_DATE) {
			dateTime.setISO8601(docObj.EFFECTIVE_DATE);
			dateOfService = MP_Util.DisplayDateByOption(component, dateTime);
			withinDateDos = MP_Util.CalcWithinTime(dateTime);
		}
		else {
			dateOfService = DocI18n.UNKNOWN;
			withinDateDos = DocI18n.UNKNOWN;
		}
		if (component.getDateFormat() === 3) {// 1 = date only,2= date/time
			// and 3 = elapsed time
			docObj.DATE_OF_SERVICE_DIPSLAY = "<span>" + withinDateDos + "</span>";
		}
		else {
			docObj.DATE_OF_SERVICE_DIPSLAY = "<span>" + dateOfService + "</span>";
		}
		// info related to participation
		var authorPart = getAuthorParticipant(docObj);
		if (authorPart) {
			docObj.AUTHOR_DISPLAY = "<span>" + authorPart.PRSNL_NAME + "</span>";
			docObj.AUTHORID = authorPart.PRSNL_ID;
		}
		else {
			docObj.AUTHOR_DISPLAY = "<span>" + DocI18n.UNKNOWN + "</span>";
			docObj.AUTHORID = 0.0;
		}

		// Include a link to document images if they are available
		if (imageUrl !== "") {
			var imageClass = compNS + "-image-found";
			docObj.URLPARAM = "<span><a class='" + imageClass + "'>&nbsp;</a></span>";
		}
		else {
			docObj.URLPARAM = "&nbsp;";
		}
		docObj.REPORT_DOC_HOVER = processDocumentHover(docObj);
		this.docCount++;

	}
	return documentsArr;
};

/*
 * Generates the html for checkbox
 */
DocumentComponent.prototype.generateCheckBoxHTML = function() {
	var compId = this.getComponentId();
	return "<div><input type ='checkbox' id='DocFilter" + compId + "'" + (this.checked ? "checked='checked'" : "") + "/><span>" + this.DocI18n.MY_DOCUMENTS + "</span></div>";
};

/*
 * generateDocTableHTML Encapsulates the creation of the Component table object so that it can be used by filterDocument method.
 */
DocumentComponent.prototype.generateDocTableHTML = function(data) {
	var component = this;
	component.documentsTable = new ComponentTable();
	component.documentsTable.setNamespace(this.getStyles().getId());
	component.documentsTable.setZebraStripe(false);
	component.documentsTable.setCustomClass("doc-o1-table");

	// Create a cell click callback so we can open documents
	component.documentsTable.addExtension(new TableCellClickCallbackExtension().setCellClickCallback(function(event, data) {
		var docData = data.RESULT_DATA;

		if (data.COLUMN_ID === "CATEGORY") {
			component.launchDocumentViewer(docData.EVENT_ID);
		}
		else if (data.COLUMN_ID === "IMAGE" && docData.IMAGE_URL) {
			component.launchDocumentImageViewer(docData.EVENT_ID);
		}
	}));

	// Create the status column
	var categoryColumn = new TableColumn();
	categoryColumn.setColumnId("CATEGORY");
	categoryColumn.setCustomClass("doc-cat");
	categoryColumn.setColumnDisplay(this.DocI18n.NOTE_TYPE);
	categoryColumn.setIsSortable(true);
	categoryColumn.setRenderTemplate("${ CATEGORY_DISPLAY }");
	categoryColumn.setPrimarySortField("EVENT_CD_DISP");

	// Create the subject column
	var authorColumn = new TableColumn();
	authorColumn.setColumnId("AUTHOR");
	authorColumn.setCustomClass("doc-auth");
	authorColumn.setColumnDisplay(this.DocI18n.AUTHOR);
	authorColumn.setIsSortable(true);
	authorColumn.setRenderTemplate("${ AUTHOR_DISPLAY }");
	authorColumn.setPrimarySortField("AUTHOR_DISPLAY");

	// Create the status column
	var dateColumn = new TableColumn();
	dateColumn.setColumnId("DATE");
	dateColumn.setCustomClass("doc-date");
	if (component.getDateFormat() === 1) {// //1 = date only,2= date/time and
		// 3 = elapsed time
		dateColumn.setColumnDisplay(this.DocI18n.DATE);
	}
	else if (component.getDateFormat() === 2) {
		dateColumn.setColumnDisplay(this.DocI18n.DATE_TIME);
	}
	else {
		dateColumn.setColumnDisplay(this.DocI18n.DATE_TIME + "<br>" + this.DocI18n.WITHIN);
	}

	dateColumn.setIsSortable(true);
	dateColumn.setRenderTemplate("${ DATE_OF_SERVICE_DIPSLAY}");
	dateColumn.setPrimarySortField("EFFECTIVE_DATE");
	// dateColumn.setDefaultSort(TableColumn.SORT.DESCENDING);

	var imageColumn = new TableColumn();
	imageColumn.setColumnId("IMAGE");
	imageColumn.setCustomClass("doc-image");
	imageColumn.setColumnDisplay("&nbsp;");
	imageColumn.setIsSortable(false);
	imageColumn.setRenderTemplate("${ URLPARAM }");

	var hvrExtension = new TableRowHoverExtension();

	// Add the columns to the table
	this.documentsTable.addColumn(categoryColumn);
	this.documentsTable.addColumn(authorColumn);
	this.documentsTable.addColumn(dateColumn);
	this.documentsTable.addColumn(imageColumn);
	// Bind the data to the results
	this.documentsTable.bindData(data);

	// Store off the component table
	this.setComponentTable(this.documentsTable);

	// Default sorting of documents based upon date, if there has'nt been any
	// sort performed on the table.

	this.documentsTable.sortByColumnInDirection("DATE", TableColumn.SORT.DESCENDING);
	hvrExtension.setHoverRenderer("<span>${RESULT_DATA.REPORT_DOC_HOVER}</span>");
	this.documentsTable.addExtension(hvrExtension);

	return this.documentsTable.render();

};

/**
 * Function related to the favorites
 */
DocumentComponent.prototype.pcnFavLoad = function(pcnFav) {
	var component = this;
	var uniqueComponentId = component.getStyles().getId();
	var criterion = component.getCriterion();
	var docDropId = "headerMenu" + uniqueComponentId;
	var docDrop = _g(docDropId);
	var numId = 0;
	pcnFav.sort(function(obj1, obj2) {
		function checkStrings(s1, s2) {
			return (s1 === s2) ? 0 : ((s1 > s2) ? 1 : -1);
		}

		return checkStrings(obj1.DISPLAY.toUpperCase(), obj2.DISPLAY.toUpperCase());
	});

	function handleDocumentClickFunction(encounterPathVal, ckiIdent, ckiSource, sourceIdent) {
		return function() {
			try {
				var PowerNoteMPageUtils = window.external.DiscernObjectFactory("POWERNOTE");
				MP_Util.LogDiscernInfo(null, "POWERNOTE", "document.js", "handleDocumentClickFunction");
				if (PowerNoteMPageUtils) {
					// determine call based on Favorite type
					if (encounterPathVal === 0) {
						PowerNoteMPageUtils.BeginNoteFromPrecompletedNote(parseFloat(criterion.person_id), parseFloat(criterion.encntr_id), parseFloat(sourceIdent));
					}
					else if (encounterPathVal === 1) {
						PowerNoteMPageUtils.BeginNoteFromEncounterPathway(parseFloat(criterion.person_id), parseFloat(criterion.encntr_id), ckiSource, ckiIdent);
					}
					component.retrieveComponentData();
				}
			}
			catch (exe) {
				alert("An error has occured calling DiscernObjectFactory('POWERNOTE'): " + exe.name + " " + exe.message);
				return;
			}
		};
	}

	// Create the header menu
	var headerMenu = new Menu("headerMenu" + uniqueComponentId);
	headerMenu.setTypeClass("header-dropdown-menu");
	headerMenu.setAnchorElementId("headerMenu" + uniqueComponentId);
	headerMenu.setAnchorConnectionCorner(["bottom", "left"]);
	headerMenu.setContentConnectionCorner(["top", "left"]);
	headerMenu.setIsRootMenu(true);
	// Attach the click event to the header drop down
	$(docDrop).click(function() {
		if (!headerMenu.isActive()) {
			MP_MenuManager.showMenu("headerMenu" + uniqueComponentId);
		}
		else {
			MP_MenuManager.closeMenuStack(true);
		}
	});
	for (var j = 0, l = pcnFav.length; j < l; j++) {
		var pcNote = pcnFav[j];
		numId = numId + 1;
		// Create a menu item and add it
		var headerMenuItem = new MenuSelection("pcnFavorite" + uniqueComponentId + "-" + j);
		headerMenuItem.setCloseOnClick(true);
		headerMenuItem.setClickFunction(handleDocumentClickFunction(pcNote.PRE_ENCPTH_VAL, pcNote.CKI_IDENT, pcNote.CKI_SRC, pcNote.SOURCE_IDENTIFIER));
		headerMenuItem.setLabel(pcNote.DISPLAY);
		headerMenu.addMenuItem(headerMenuItem);
	}
	MP_MenuManager.updateMenuObject(headerMenu);
};

/*
 * Attaches listners to: the "My Documents" check box
 */
DocumentComponent.prototype.attachListeners = function() {
	var component = this;
	$("#DocFilter" + component.getComponentId()).on("click", function() {
		component.filterDocument();
	});
};

/*
 * Filter document Function to filter the documents written only by a specific author.
 */
DocumentComponent.prototype.filterDocument = function() {
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();

	if (!this.checked) {
		this.checked = true;
		this.docCount = this.myDocs.length;
		if (this.docCount === 0) {
			// Usually the component table will not render for an empty array.
			$("#" + compNS + compID + "headerWrapper").hide();
		}
		this.documentsTable.bindData(this.myDocs);
	}
	else {
		// Would need to remove the header the header
		if (!$("div#" + compNS + compID + "headerWrapper").is(":visible")) {
			$("div#" + compNS + compID + "headerWrapper").show();
		}
		this.checked = false;
		this.docCount = this.processedDocs.length;
		this.documentsTable.bindData(this.processedDocs);
	}
	this.documentsTable.refresh();
	// Updating the documents count in the header. It includes the logic
	// implemented in the finalizeComponent of the MPageComponent class.
	var resultCountText = MP_Util.CreateTitleText(this, this.docCount);
	// replace count text
	var rootComponentNode = this.getRootComponentNode();
	// There are certain circumstances where a components DOM element will have
	// been removed.
	// ie. selecting a view from the viewpoint drop down and then selecting
	// another.
	if (rootComponentNode) {
		var totalCount = Util.Style.g("sec-total", rootComponentNode, "span");
		if (resultCountText) {
			// Make sure the count text is not hidden.
			$(totalCount).removeClass("hidden");
			totalCount[0].innerHTML = resultCountText;
		}
		else {
			// If there is no count text to show then hide the element so it
			// doesn't take up space.
			$(totalCount).addClass("hidden");
		}
	}
};

/**
 * RenderComponent
 *
 * @param {Object}
 *            recordData, JSON object returned by a call on the mp_retrieve_documents_json_dp script
 */
DocumentComponent.prototype.renderComponent = function(scriptReply) {
	var component = this;
	var recordData = scriptReply.getResponse();
	var repStatus = scriptReply.getStatus();
	var countText = "";
	var compNS = component.getStyles().getNameSpace();
	var compID = component.getComponentId();
	// The speciality filter dropdown and the lookback menu dropdwon calls the
	// renderComponent method everytime a selection is made. Both of these
	// values need to be reset to default.
	this.docCount = 0;
	this.checked = false;

	/*
	 * Filters documents array for a specific author
	 */
	function filterMyDocs() {
		var activeDocs = component.processedDocs;
		var activeLen = activeDocs.length;
		var criterion = component.getCriterion();
		var myDocArr = [];
		// Display only the documents which are written by the current user.
		for (var a = 0; a < activeLen; a++) {
			var prsnlId = activeDocs[a].AUTHORID;
			if (prsnlId === criterion.provider_id) {// USER ID
				myDocArr.push(activeDocs[a]);
			}
		}
		return myDocArr;
	}

	try {
		var documentData = recordData.DOCS;
		var documentDataLength = documentData.length;
		if (repStatus.toUpperCase() === "F") {
			var err = new Error("No eventsets are defined in bedrock.");
			logger.logJSError(err, this, "document.js", "renderComponent");
			var errMsg = [];
			errMsg.push(scriptReply.getError());
			this.finalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("<br />")), "(0)");
		}
		else {
			if (component.isPlusAddEnabled()) {
				var favData = recordData.PRE_COMPLETED;
				if (favData) {
					var favDataLength = favData.length;
					if (favDataLength > 0) {
						this.appendDropdown(favData, component.getCriterion().static_content);
					}
				}
			}
			if (documentDataLength > 0) {
				this.processedDocs = this.processResultsForRender(documentData);
				this.myDocs = filterMyDocs();
				var tableViewHTML = "<div id='" + compNS + compID + "tableView' class='" + compNS + "-table'>";
				tableViewHTML += this.generateDocTableHTML(this.processedDocs) + "</div>";

				// Main component container having both component table and reading
				// pane.
				var compContainerHTML = "<div id='" + compID + "mainContainer' class ='" + compNS + "-maincontainer'>";
				// Append both table view and checkbox to main container
				compContainerHTML += this.generateCheckBoxHTML();
				// Append the main container markup to component markup
				compContainerHTML += tableViewHTML;
				// Finalize the component with the html containing the checkbox and
				// the table objects.
				this.finalizeComponent(compContainerHTML, MP_Util.CreateTitleText(this, this.docCount));
				this.attachListeners();
			}
			else {
				countText = "(0)";
				this.finalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), countText);
			}
		}
	}
	catch (error) {
		logger.logJSError(error, this, "document.js", "renderComponent");
		throw (error);
	}
}; 
