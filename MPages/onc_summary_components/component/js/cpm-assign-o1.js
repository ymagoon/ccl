/* globals CPMResource, CPMResourceManager */
/**
 * Create the component style object which will be used to style various aspects of our component
 * @returns {undefined} - undefined
 */
function CPMAssignO1ComponentStyle(){
    this.initByNamespace("cpmao1");
}
CPMAssignO1ComponentStyle.prototype = new ComponentStyle();
CPMAssignO1ComponentStyle.prototype.constructor = ComponentStyle;

/**
 * Initialize the CPM Assign Component
 * @param {Criterion} criterion : The Criterion object contains information needed to render the component
 * @constructor
 */
function CPMAssignO1Component(criterion){
    this.setCriterion(criterion);
    this.setStyles(new CPMAssignO1ComponentStyle());
    //Set the timers
    this.setComponentLoadTimerName("USR:MPG.CPM.Assign.O1_load_component");
    this.setComponentRenderTimerName("ENG:MPG.CPM.Assign.O1_render_component");

    //Set scope to show all visits
    this.setScope(2);

    this.m_cpmResourceManager = null;
    this.m_unassignedList = null;
}

/**
 * Inherits from MPageComponent
 */
CPMAssignO1Component.prototype = new MPageComponent();
CPMAssignO1Component.prototype.constructor = MPageComponent;

CPMAssignO1Component.prototype.getCPMResourceManager = function(){
    return this.m_cpmResourceManager;
};

/**
 * Retrieves stored list of unassigned CPMs
 * @returns {[]} - array of unassigned CPMs
 */
CPMAssignO1Component.prototype.getUnassignedCPMsList = function(){
    if (!this.m_unassignedList){
        this.m_unassignedList = [];
    }
    return this.m_unassignedList;
};

/**
 * Sets component's CPMResourceManager
 * @param {null | CPMResourceManager} resourceManager - instance of a CPMResourceManager, or null
 * @returns {undefined} - undefined
 */
CPMAssignO1Component.prototype.setCPMResourceManager = function(resourceManager){
    if (resourceManager !== null && !CPMResourceManager.prototype.isPrototypeOf(resourceManager)){
        throw new Error("Type Error: resourceManager passed into CPMAssignO1Component method setCPMResourceManager not an instance of CPMResourceManager or null");
    }
    this.m_cpmResourceManager = resourceManager;
};

/**
 * Sets component's unassigned CPMs list
 * @param {null | []} list - an array of CPMResource[s] or null
 * @returns {undefined} - undefined
 */
CPMAssignO1Component.prototype.setUnassignedCPMsList = function(list){
    if (list !== null && !Array.prototype.isPrototypeOf(list)){
        throw new Error("Type Error: list passed into CPMAssignO1Component method setUnassignedCPMsList not an array or null");
    }
    this.m_unassignedList = list;
};

/**
 * Processes the data from the component's data retrieval script
 * Creates CPMResource objects based on the response provided
 * @param {{}} cpmResponse - JSON response from data retrieval script
 * @returns {undefined} - undefined
 */
CPMAssignO1Component.prototype.processCPMResponse = function(cpmResponse){
    if (!cpmResponse || typeof cpmResponse !== "object"){
        throw new Error("Type Error: cpmResponse passed into CPMAssignO1Component method processCPMResponse is undefined or not an object");
    }

    //Create the CPM resource manager
    var cpmResourceManager = this.getCPMResourceManager();
    if (!cpmResourceManager){
        cpmResourceManager = new CPMResourceManager();
        this.setCPMResourceManager(cpmResourceManager);
    }

    //Let's clear out the existing list of CPM Resources in case component was refreshed
    cpmResourceManager.removeAllCPMResources();

    //Create the CPM Resources
    var conceptList = cpmResponse.ACTIVITY_QUAL || [];
    var cLen = conceptList.length;
    var i;
    for (i = 0; i < cLen; i++){
        var cpmResource = CPMResourceManager.createCPMResource(conceptList[i]);
        cpmResourceManager.addCPMResource(cpmResource);
    }
};

/**
 * Handles flow based on the data retrieval reply
 * @param {ScriptReply }scriptReply - response from the component's initial data retrieval script
 * @returns {undefined} - undefined
 */
CPMAssignO1Component.prototype.handleGetCPMReply = function(scriptReply){
    //This method will also start the engineering timer
    var status;

    if (!scriptReply) {
        status = "F";
    } else {
        status = scriptReply.getStatus();
    }

    if (status === "Z") {
        this.finalizeComponent(this.generateNoDataFoundHTML(), "");
    } else if (status === "S") {
        this.processCPMResponse(scriptReply.getResponse());
        this.renderComponent();
    } else {
        this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(), "Component Data Retrieval Failed"), ""); // eslint-disable-line new-cap
    }
};

/**
 * Data retrieval method
 * AJAX CCL call to retrieve data needed for component's initial load
 * @returns {undefined} - undefined
 */
CPMAssignO1Component.prototype.retrieveComponentData = function(){
    var criterion = this.getCriterion();
    var sendAr = [];
    var request;
    var loadTimer = new RTMSTimer(this.getComponentLoadTimerName(), criterion.category_mean);
    var renderTimer = new RTMSTimer(this.getComponentRenderTimerName(), criterion.category_mean);

    sendAr.push(
        "^MINE^"
        , criterion.person_id + ".0"
        , criterion.encntr_id + ".0"
        , criterion.provider_id + ".0"
        , criterion.ppr_cd + ".0"
    );

    request = new ComponentScriptRequest();
    request.setProgramName("MP_GET_CPM_PATHWAY_STATUS");
    request.setParameterArray(sendAr);
    request.setAsyncIndicator(true);
    request.setName("getCPMByPatient");
    request.setComponent(this);
    request.setResponseHandler(this.handleGetCPMReply.bind(this));
    request.setLoadTimer(loadTimer);
    request.setRenderTimer(renderTimer);
    request.performRequest();
};

/**
* AJAX CCL call that adds or removes a CPM depending on the cpmResourceStatus that is passe in
* @param {cpmResourceStatus} cpmResourceStatus - The status that the script will set
* @param {number} pathwayInstanceId - The id of the pathway instance
* @param {string} requestName - The name to assign to the request
* @param {CPMResource} cpmResource - an instance of CPMResource to be activated or removed
* @returns {undefined} - undefined
*/
CPMAssignO1Component.prototype.callAddPathwayScript = function(cpmResourceStatus, pathwayInstanceId, requestName, cpmResource){
	var criterion = this.getCriterion();
	var request;
	var sendAr = [];

	sendAr.push(
        "^MINE^"
        , criterion.person_id + ".0"
        , criterion.encntr_id + ".0"
        , criterion.provider_id + ".0"
        , cpmResource.getPathwayId() + ".0"
        , "^" + cpmResourceStatus + "^"
        , pathwayInstanceId
    );

	request = new ScriptRequest();
	request.setProgramName("cp_add_pathway_activity");
    request.setParameterArray(sendAr);
    request.setAsyncIndicator(true);
    request.setName(requestName);
    request.setResponseHandler(this.retrieveComponentData.bind(this));
    request.performRequest();
    this.loadSpinner(this.getSectionContentNode().id);
};

/**
 * Calls the callAddPathway method to assign a CPM to a patient
 * @param {CPMResource} cpmResource - an instance of CPMResource to be activated
 * @returns {undefined} - undefined
 */
CPMAssignO1Component.prototype.assignCPM = function(cpmResource){
    this.callAddPathwayScript(CPMResource.STATUSES.PROPOSED, 0, "assignCPM", cpmResource);
};

/**
 * Calls the callAddPathway method to inactivate a cpm, and therefore remove it from a patient
 * @param {CPMResource} cpmResource - an instance of CPMResource to be removed
 * @returns {undefined} - undefined
 */
CPMAssignO1Component.prototype.removeCPM = function(cpmResource){
	this.callAddPathwayScript(CPMResource.STATUSES.INACTIVE, cpmResource.getPathwayInstanceId(), "removeCPM", cpmResource);
};


/**
 * Creates a Loading Spinner over the element with the specified id
 * @param {string} containerId - DOM element's id
 * @returns {undefined} - undefined
 */
CPMAssignO1Component.prototype.loadSpinner = function(containerId){
    if(containerId && typeof containerId === "string"){
        var resultContainer = $("#" + containerId);
        var contentHeight = resultContainer.outerHeight();
        var offset = resultContainer.offsetParent();
        var loadingIconTop = offset.height() - contentHeight;

        resultContainer.append("<div class='loading-screen' style='height: " + contentHeight + "px; top: " + loadingIconTop + "px; left:0px; '><div class='loading-spinner'>&nbsp;</div></div>");
    }
};

/**
 * Generates HTML for a No results fond list item
 * This HTML would be used when no list items exist in a list
 * @returns {string} - List item HTML representing No results found
 */
CPMAssignO1Component.prototype.buildNoListItemsHtml = function(){
    var html = "";
    html += "<li class='cpmao1-no-results'>" + i18n.discernabu.NO_RESULTS_FOUND + "</li>";
    return html;
};

/**
 * Generates the list item HTML for a CPMResource
 * @param {CPMResource} cpmResource - an instance of a CPMResource
 * @returns {string} - List item HTML representing a CPMResource
 */
CPMAssignO1Component.prototype.buildCPMListItemHtml = function(cpmResource){
    /* eslint-disable no-multi-spaces */
    if (!CPMResource.prototype.isPrototypeOf(cpmResource)){
        throw new Error("Type Error: cpmResource passed into CPMAssignO1Component method buildCPMListItemHtml not instance of CPMResource");
    }
    var cpmResourceId = cpmResource.getId();
    var html = "";
    var cpmIsActive = cpmResource.getStatusMean() === CPMResource.STATUSES.PROPOSED;

    html += "<li id='" + this.getStyles().getId() + cpmResourceId + "' class='cpmao1-list-item' data-resource-id='" + cpmResourceId + "' >";
    html +=     "<span class='cpmao1-cpm-item-disp'>" + cpmResource.getConceptDisp() + "</span>";
    if (cpmIsActive){
        html += "<a class='cpmao1-remove-link' data-resource-id='" + cpmResourceId + "'>" + "</a>";
    }
    else{
        html += "<a class='cpmao1-add-link' data-resource-id='" + cpmResourceId + "'>" + i18n.discernabu.cpm_assign_o1.ADD + "</a>";
    }
    html += "</li>";

    return html;
    /* eslint-enable no-multi-spaces */
};

/**
 * Generates the Assigned CPMs section HTML
 * @param {[]} cpmResourceList - An array of CPMResource items
 * @returns {string} - html for the assigned CPMs section
 */
CPMAssignO1Component.prototype.buildAssignedCPMsHtml = function(cpmResourceList){
    /* eslint-disable no-multi-spaces */
    if (!Array.prototype.isPrototypeOf(cpmResourceList)){
        throw new Error("Type Error: cpmResourceList passed into CPMAssignO1Component method buildAssignedCPMsHtml not an array");
    }
    var compId = this.getStyles().getId();
    var myi18n = i18n.discernabu.cpm_assign_o1;
    var cLen = cpmResourceList.length;
    var i;
    var html = "";

    html += "<div id='" + compId + "AssignedCPMsContainer' class='cpmao1-list-cont' >";
    html +=     "<div class='cpmao1-sec-hdr'>" + myi18n.PROPOSED_CPMS + "</div>";
    html +=     "<ul id='" + compId + "AssignedCPMsList' class='cpmao1-list'>";
    for (i = 0; i < cLen; i++){
        html += this.buildCPMListItemHtml(cpmResourceList[i]);
    }

    if (!cLen){
        html += "<li class='cpmao1-no-results'>" + myi18n.ADD_PROPOSED + "</li>";
    }

    html +=     "</ul>";
    html += "</div>";

    return html;
    /* eslint-enable no-multi-spaces */
};

/**
 * Generates search box HTML
 * @returns {string} - HTML representing a search box
 */
CPMAssignO1Component.prototype.buildSearchHtml = function(){
    /* eslint-disable no-multi-spaces */
    var html = "";
    html += "<div class='cpmao1-search-cont'>";
    html +=     "<div class='cpmao1-row'>";
    html +=     "<span class='cpmao1-search-box-cont'>";
    html +=         "<input class='cpmao1-search-box search-box cpmao1-default' type='text' value='" + i18n.discernabu.cpm_assign_o1.SEARCH_CPMS + "' />";
    html +=     "</span>";
    html +=     "</div>";
    html += "</div>";

    return html;
    /* eslint-enable no-multi-spaces */
};

/**
 * Generates the Unassigned CPMs section HTML
 * @param {[]} cpmResourceList - An array of CPMResource items
 * @returns {string} - html for the unassigned CPMs section
 */
CPMAssignO1Component.prototype.buildUnassignedCPMsHtml = function(cpmResourceList){
    /* eslint-disable no-multi-spaces */
    if (!Array.prototype.isPrototypeOf(cpmResourceList)){
        throw new Error("Type Error: cpmResourceList passed into CPMAssignO1Component method buildUnassignedCPMsHtml not an array");
    }
    var compId = this.getStyles().getId();
    var myi18n = i18n.discernabu.cpm_assign_o1;
    var cLen = cpmResourceList.length;
    var i;
    var html = "";

    html += "<div id='" + compId + "UnassignedCPMsContainer' class='cpmao1-list-cont' >";
    html +=     this.buildSearchHtml();
    html +=     "<div class='cpmao1-sec-hdr'>";
    html +=          myi18n.AVAILABLE_CPMS;
    html +=     "</div>";
    html +=     "<ul id='" + compId + "UnassignedCPMsList' class='cpmao1-list cpmao1-unassigned-list'>";
    for (i = 0; i < cLen; i++){
        html += this.buildCPMListItemHtml(cpmResourceList[i]);
    }
    if (!cLen){
        html += this.buildNoListItemsHtml();
    }

    html +=     "</ul>";
    html += "</div>";

    return html;
    /* eslint-enable no-multi-spaces */
};

/**
 * Handles an unassigned CPM list item click event
 * Any previously selected items will become deselected
 * @param {{}} event - browser event
 * @returns {undefined} - undefined
 */
CPMAssignO1Component.prototype.unassignedItemClick = function(event){
    var compId = this.getStyles().getId();
    var currentItemWasSelected = false;
    var jqUnassignedList = $("#" + compId + "UnassignedCPMsContainer");
    var jqSelectedItems = jqUnassignedList.find("li.selected");
    var domElement = event.currentTarget || event.srcElement;
    var clickedItemId = domElement.id;
    var sLen = jqSelectedItems.length;
    var i;
    for (i = 0; i < sLen; i++){
        var selectedId = jqSelectedItems.get(i).id;
        if (selectedId !== clickedItemId){
            $(jqSelectedItems.get(i)).removeClass("selected");
        } else {
            currentItemWasSelected = true;
        }
    }
    //Toggle selection
    $(domElement).toggleClass("selected");
    //Toggle Add button
    $("#" + compId + "UnassignedAddBtn").prop("disabled", currentItemWasSelected);
};

/**
 * Handles the Available CPM Add link click event
 * Sets the CPM's pathway activity status to Proposed
 * @param {{}} event - browser event
 * @returns {undefined} - undefined
 */
CPMAssignO1Component.prototype.availableAddClick = function(event){
    var domElement = event.currentTarget || event.srcElement;
    var cpmResourceId = $(domElement).attr("data-resource-id");
    var cpmResourceManager = this.getCPMResourceManager();
    if (!cpmResourceManager){
        return;
    }
    var cpmResource = cpmResourceManager.getCPMResourceById(cpmResourceId);
    if (!cpmResource){
        logger.logError("CPMAssignO1Component method availableAddClick unable to retrieve cpmResource using id: " + cpmResourceId);
        return;
    }
    this.assignCPM(cpmResource);
};

/**
 *Handles the Proposed CPM Remove link click event
 * Sets the CPM's pathway status to INACTIVE
 * @param {{}} event - browser event
 * @returns {undefined} - undefined
 */
CPMAssignO1Component.prototype.proposedRemoveClick = function(event){
	var domElement = event.currentTarget || event.srcElement;
	var cpmResourceId = $(domElement).attr("data-resource-id");
	var cpmResourceManager = this.getCPMResourceManager();
	if (!cpmResourceManager){
		return;
	}
	var cpmResource = cpmResourceManager.getCPMResourceById(cpmResourceId);
	if (!cpmResource){
		logger.logError("CPMAssignO1Component method proposedRemoveClick unable to retrieve cpmResource using id: " + cpmResourceId);
		return;
	}
	this.removeCPM(cpmResource);
};

/**
 * Handles the unassigned CPMs section search box keyup event
 * Filters the list of unassigned CPMs to those that contain the search term
 * @param {{}} event - browser event
 * @returns {undefined} - undefined
 */
CPMAssignO1Component.prototype.unassignedSearchKeyup = function(event){
    var compId = this.getStyles().getId();
    var domElement = event.currentTarget || event.srcElement;
    var searchValue = $.trim($(domElement).val()).toLowerCase();
    var unassignedCPMs = this.getUnassignedCPMsList();
    var uLen = unassignedCPMs.length;
    var i;
    var html = "";

    for (i = 0; i < uLen; i++){
        var cpmResource = unassignedCPMs[i];
        var cpmTerm = cpmResource.getConceptDisp().toLowerCase();
        if (!searchValue){
            html += this.buildCPMListItemHtml(cpmResource);
        } else if (cpmTerm.indexOf(searchValue) >= 0) {
            html += this.buildCPMListItemHtml(cpmResource);
        }
    }
    if (!html){
        html += this.buildNoListItemsHtml();
    }

    $("#" + compId + "UnassignedCPMsList").html(html);
    $("#" + compId + "UnassignedAddBtn").prop("disabled", true);
};

/**
 * Handles the unassigned CPMs section search box focus event
 * Clears out the search box default message
 * @param {{}} event - browser event
 * @returns {undefined} - undefined
 */
CPMAssignO1Component.prototype.unassignedSearchFocus = function(event){
    var domElement = event.currentTarget || event.srcElement;
    var jqSearchBox = $(domElement);
    //If the element has the default class assigned, then we can clear out the contents
    if (jqSearchBox.hasClass("cpmao1-default")){
        jqSearchBox.val("");
        jqSearchBox.removeClass("cpmao1-default");
    }
};

/**
 * Handles the unassigned CPMs section search box blur event
 * Inserts default text if search box is empty
 * @param {{}} event - browser event
 * @returns {undefined} - undefined
 */
CPMAssignO1Component.prototype.unassignedSearchBlur = function(event){
    var domElement = event.currentTarget || event.srcElement;
    var jqSearchBox = $(domElement);
    var searchValue = $.trim(jqSearchBox.val());
    if (!searchValue){
        jqSearchBox.addClass("cpmao1-default");
        jqSearchBox.val(i18n.discernabu.cpm_assign_o1.SEARCH_CPMS);
    }
};

/**
 * Attaches any event delegates after component is rendered
 * @returns {undefined} - undefined
 */
CPMAssignO1Component.prototype.attachEventDelegates = function(){
	var compId = this.getStyles().getId();
    var jqUnassignedList = $("#" + compId + "UnassignedCPMsContainer");
    var jqAssignedList = $("#" + compId + "AssignedCPMsContainer");
    // unassigned container
    jqUnassignedList.on("click", "a.cpmao1-add-link", this.availableAddClick.bind(this));
    jqUnassignedList.on("keyup", "input.cpmao1-search-box", this.unassignedSearchKeyup.bind(this));
    jqUnassignedList.on("focus", "input.cpmao1-search-box", this.unassignedSearchFocus.bind(this));
    jqUnassignedList.on("blur", "input.cpmao1-search-box", this.unassignedSearchBlur.bind(this));
    // assigned container
    jqAssignedList.on("click", "a.cpmao1-remove-link", this.proposedRemoveClick.bind(this));
};

/**
 * Sort function to sort an array of CPMResource objects based on the CPMResource conceptDisp
 * @param {CPMResource} a - CPMResource object
 * @param {CPMResource} b - CPMResource object
 * @returns {number} - indicator of order to place two CPMResource objects
 */
CPMAssignO1Component.prototype.sortByDispFunc = function(a, b){
    var aDisp = a.getConceptDisp();
    var bDisp = b.getConceptDisp();

    if (aDisp < bDisp){
        return -1;
    } else if (aDisp > bDisp){
        return 1;
    } else {
        return 0;
    }
};

/*
 //This method likely to be used in phase 2 of component
CPMAssignO1Component.prototype.createProposedTable = function(cpmList){
    var myi18n = i18n.discernabu.cpm_assign_o1;
    var table = new ComponentTable();
    table.setNamespace(this.getStyles().getId());
    table.setCustomClass("cpmao1-proposed-table");
    table.setZebraStripe(false);
    table.setNoresultsString(myi18n.ADD_PROPOSED);

    var cpmDisplayCol = new TableColumn();
    cpmDisplayCol.setColumnId("CPM_DISPLAY");
    cpmDisplayCol.setCustomClass("cpmao1-proposed-disp");
    cpmDisplayCol.setColumnDisplay(myi18n.PROPOSED_CPMS);
    cpmDisplayCol.setRenderTemplate("<span>${getConceptDisp()}</span>");

    var cpmPerformedByCol = new TableColumn();
    cpmPerformedByCol.setColumnId("CPM_PROPOSED_BY");
    cpmPerformedByCol.setCustomClass("cpmao1-proposed-by");
    cpmPerformedByCol.setColumnDisplay(myi18n.PROPOSED_BY);
    cpmPerformedByCol.setRenderTemplate("<span>${getProposedByName()}</span>");

    table.addColumn(cpmDisplayCol);
    table.addColumn(cpmPerformedByCol);

    table.bindData(cpmList);

    return table;
};
*/
/**
 * Responsible for rendering the component and attaching event listeners
 * @returns {undefined} - undefined
 */
CPMAssignO1Component.prototype.renderComponent = function(){
    var cpmResourceManager = this.getCPMResourceManager();
    var CPM_STATUSES = CPMResource.STATUSES;
    var html = "";

    var assignedCPMsList = cpmResourceManager.getCPMResourceListWithStatus(CPM_STATUSES.PROPOSED);
    var unassignedCPMsList = cpmResourceManager.getCPMResourceListWithoutStatus(CPM_STATUSES.PROPOSED);

    //Sort the lists
    assignedCPMsList.sort(this.sortByDispFunc);
    unassignedCPMsList.sort(this.sortByDispFunc);

    this.setUnassignedCPMsList(unassignedCPMsList);

    html += this.buildUnassignedCPMsHtml(unassignedCPMsList);
    html += this.buildAssignedCPMsHtml(assignedCPMsList);
    this.finalizeComponent(html, "");
    this.attachEventDelegates();
};

MP_Util.setObjectDefinitionMapping("CPM_ASSIGN_COMP", CPMAssignO1Component);
