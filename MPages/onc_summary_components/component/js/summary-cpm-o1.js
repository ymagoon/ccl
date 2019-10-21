/*global ViewContainer,CPMWorkflow */

/**
 * Create the component style object which will be used to style various aspects of our component
 */
function CPMO1ComponentStyle(){
    this.initByNamespace("cpm-summary");
}
CPMO1ComponentStyle.prototype = new ComponentStyle();
CPMO1ComponentStyle.prototype.constructor = ComponentStyle;

/**
 * Initialize the CPM Container Component
 * @param {Criterion} criterion : The Criterion object contains information needed to render the component
 * @constructor
 */
function CPMCO1Component(criterion){
    this.setCriterion(criterion);
    this.setStyles(new CPMO1ComponentStyle());
    //Set the timers
    this.setComponentLoadTimerName("USR:MPG.CPM.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.CPM.O1 - render component");

    //Set scope to show all visits
    this.setScope(1);
    //Display the result count in the component header
    this.setIncludeLineNumber(true);

    this.m_cpmController = null;
    this.m_cpmResourceManager = null;
    this.m_fullCPMList = null;
    this.m_suggestedCPMList = null;
    
    // experimental member variables
    this.m_nodeConfiguration = null;
    this.m_pathwayTypeMean = "";
    this.m_pathwayTypeCd = 0;
    this.m_pathwayId = 0;
    this.m_pathwayInstance = null;
    this.m_conceptConfiguration = null;
}

/**
 * Inherits from MPageComponent
 */
CPMCO1Component.prototype = new MPageComponent();
CPMCO1Component.prototype.constructor = MPageComponent;

/**
 * Retrieves the component's CPMResourceManager
 * @returns {CPMResourceManager | null} - instance of CPMResourceManager or null
 */
CPMCO1Component.prototype.getCPMResourceManager = function(){
    return this.m_cpmResourceManager;
};

/**
* Sets the full CPM list
* @param {[] | null} list - array of all CPMResources, or null
 * @returns {undefined} - undefined
*/
CPMCO1Component.prototype.setFullCPMList = function(list){
    this.m_fullCPMList = list;
};

/**
 * Returns a sorted array of all CPMResources, or null if none exist in the CPMResourceManager
 * CPMResources sorted by conceptDisp
 * @returns {null | []} - array of all CPMResources, or null
 */
CPMCO1Component.prototype.getFullCPMList = function(){
    var cpmResourceManager = this.getCPMResourceManager();
    if (!this.m_fullCPMList){
        this.m_fullCPMList = cpmResourceManager.getCPMResourceList();
        this.m_fullCPMList.sort(this.sortByDispFunc);
        if (!this.m_fullCPMList.length){
            this.m_fullCPMList = null;
        }
    }
    return this.m_fullCPMList;
};

/**
 * Sets the suggested CPM list
 * @param {[] | null} list - array of suggested CPMResources, or null
 * @returns {undefined} - undefined
 */
CPMCO1Component.prototype.setSuggestedCPMList = function(list){
    this.m_suggestedCPMList = list;
};

/**
 * Returns an array of suggested CPMResources, or null if none exist in the CPMResourceManager
 * CPMResources sorted by conceptDisp
 * @returns {null | []} - array of suggested CPMResources, or null
 */
CPMCO1Component.prototype.getSuggestedCPMList = function(){
    var cpmResourceManager = this.getCPMResourceManager();
    if (!this.m_suggestedCPMList){
        this.m_suggestedCPMList = cpmResourceManager.getSuggestedCPMResourceList();
        this.m_suggestedCPMList.sort(this.sortByDispFunc);
        if (!this.m_suggestedCPMList.length){
            this.m_suggestedCPMList = null;
        }
    }
    return this.m_suggestedCPMList;
};

/**
 * Sets component's CPMResourceManager
 * @param {null | CPMResourceManager} resourceManager - instance of a CPMResourceManager, or null
 * @returns {undefined} - undefined
 */
CPMCO1Component.prototype.setCPMResourceManager = function(resourceManager){
    /* eslint-disable no-undef */
    if (resourceManager !== null && !CPMResourceManager.prototype.isPrototypeOf(resourceManager)){
        throw new Error("Type Error: resourceManager passed into CPMCO1Component method setCPMResourceManager not an instance of CPMResourceManager or null");
    }
    this.m_cpmResourceManager = resourceManager;
    /* eslint-enable no-undef */
};

/**
 * Gets the component's instance of the CPM Controller
 * Note: Controller handles rendering of CPM sub-components
 * @returns {CPMController} : An instance of CPMController
 */
CPMCO1Component.prototype.getCPMController = function(){
    /* eslint-disable no-undef */
    if (!this.m_cpmController){
        this.m_cpmController = new CPMController();
    }
    return this.m_cpmController;
    /* eslint-enable no-undef */

};

/*
 * Experimental getters and setters
 */

/**
 * Gets the Pathway ID
 * @returns {number}
 */
CPMCO1Component.prototype.getPathwayId = function(){
    return this.m_pathwayId;
};

/**
 * Sets the Pathway ID
 * Throws an error if passed in 'pathwayId' is not a number
 * @param {number} pathwayId - Pathway ID
 */
CPMCO1Component.prototype.setPathwayId = function(pathwayId){
    if (typeof pathwayId !== 'number'){
        throw new Error("Type Error: Invalid 'conceptCd' passed into MPageCPNodeController method 'setPathwayId'");
    }
    this.m_pathwayId = pathwayId;
};

/**
 * Gets the Pathway Type Code Value
 * @returns {number}
 */
CPMCO1Component.prototype.getPathwayTypeCd = function(){
    return this.m_pathwayTypeCd;
};

/**
 * Sets the Pathway Type Code Value
 * Throws an error if passed in 'pathwayTypeCd' is not a number
 * @param {number} pathwayTypeCd - Pathway Type Code
 */
CPMCO1Component.prototype.setPathwayTypeCd = function(pathwayTypeCd){
    if (typeof pathwayTypeCd !== 'number'){
        throw new Error("Type Error: Invalid 'conceptCd' passed into MPageCPNodeController method 'setPathwayTypeCd'");
    }
    this.m_pathwayTypeCd = pathwayTypeCd;
};

/**
 * Gets the Pathway Type Code Value
 * @returns {number}
 */
CPMCO1Component.prototype.getPathwayTypeMean = function(){
    return this.m_pathwayTypeMean;
};

/**
 * Sets the Pathway Type Code Value
 * Throws an error if passed in 'pathwayTypeMean' is not a string
 * @param {number} pathwayTypeMean - Pathway Type Mean
 */
CPMCO1Component.prototype.setPathwayTypeMean = function(pathwayTypeMean){
    if (typeof pathwayTypeMean !== 'string'){
        throw new Error("Type Error: Invalid 'conceptCd' passed into MPageCPNodeController method 'pathwayTypeMean'");
    }
    this.m_pathwayTypeMean = pathwayTypeMean;
};

/**
 * Gets the Pathway Instance 
 * @returns {number}
 */
CPMCO1Component.prototype.getPathwayInstance = function(){
    return this.m_pathwayInstance;
};

/**
 * Sets the Pathway Instance
 * Throws an error if passed in 'pathwayInstance' is not a object
 * @param {Object} pathwayInstance - Pathway Instance
 */
CPMCO1Component.prototype.setPathwayInstance = function(pathwayInstance){
    if (typeof pathwayInstance !== 'object'){
        throw new Error("Type Error: Invalid 'conceptCd' passed into MPageCPNodeController method 'pathwayTypeMean'");
    }
    this.m_pathwayInstance = pathwayInstance;
};

/**
 * Gets the Concept Configuration
 * @returns {object}
 */
CPMCO1Component.prototype.getConceptConfig = function(){
    return this.m_conceptConfiguration;
};

/**
 * Sets the Concept Configuration 
 * @param {object} conceptConfig - Concept Configuration
 */
CPMCO1Component.prototype.setConceptConfig = function(conceptConfig){
    this.m_conceptConfiguration = conceptConfig;
};

/*
 * End experimental Getters and setters
 */

/**
 * Override component's preProcessing method to disable the PLUS button in the header
 * @returns {undefined} - undefined
 */
CPMCO1Component.prototype.preProcessing = function(){
    this.setPlusAddEnabled(false);
};

/**
 * Handles resizing the component
 * @returns {undefined} - undefined
 */
CPMCO1Component.prototype.resizeComponent = function() {
    MPageComponent.prototype.resizeComponent.call(this);
    var compId = this.getStyles().getId();
    var jqComponent = $(this.getSectionContentNode());
    var jqContentBody = jqComponent.children(".content-body");
    if (!jqContentBody.length){
        return;
    }
    var domContentBody = jqContentBody.get(0);
    var jqTabHeader = $("#tabs" + compId);
    var jqCPMTabContent = $("#tabPage" + compId).children(".cpm-tab");
    var tabContentHeight;

    jqContentBody.css({
        "overflow-x": "hidden"
    });

    tabContentHeight = parseInt(jqContentBody.css("max-height"), 10) - (jqTabHeader.outerHeight(true) + 12);
    jqCPMTabContent.css({
        "max-height": tabContentHeight + "px",
        "overflow-x": "hidden"
    });
    //Prevents issue occuring in IE
    jqContentBody.css("min-height", "0px");
    if (domContentBody.scrollHeight <= parseFloat(jqContentBody.css("max-height"))){
        jqContentBody.css("min-height", domContentBody.scrollHeight + "px");
    }
};

/**
 * Handles triggering a Capability Timer
 * @param {String} timerMetaData - timer meta data
 * @returns {undefined} - undefined
 */
CPMCO1Component.prototype.cpmTabClickedTimerTrigger = function(timerMetaData){
    /* eslint-disable no-undef */
    var criterion = this.getCriterion();
    var catMean = criterion.category_mean;
    var timer = new CapabilityTimer("CAP:MPG_CPM-o1_SELECTED", catMean);
    timer.addMetaData("rtms.legacy.metadata.1", timerMetaData);
    timer.capture();
    /* eslint-enable no-undef */
};

/**
 * Handles changing the component's contents based on the tab that was clicked
 * @param {string} tabType - the type of tab that was clicked (i.e. SUMMARY, CPMRESOURCE, ADD_CPM)
 * @param {string} resourceId - the id of a CPMResource
 * @returns {undefined} - undefined
 */
CPMCO1Component.prototype.handleTabClick = function(tabType, resourceId){
    var compId = this.getStyles().getId();
    var cpmController = this.getCPMController();
    var tabId = "";
    var tabPageId = "tabPage" + compId;
    var html = "";

    //Clean up existing view
    cpmController.dispose();

    switch(tabType){
        case "SUMMARY":
            tabId = compId + "TabSummary";
            html += this.buildCardsHtml(this.getSuggestedCPMList() || []);
            break;
        case "ADD_CPM":
            tabId = compId + "TabAdd";
            html += this.buildAddCPMHtml();
            break;
    }

    //Place loading screen
    $("#" + tabPageId).html(html);
    //Update selected tabs
    $("#tabs" + compId).find("li").removeClass("cpm-tab-active-header");
    $("#" + tabId).addClass("cpm-tab-active-header");
    //Remove the tab level menu.
    $("#chxTabsMenu" + compId).empty();

    if (tabType === "SUMMARY") {
        this.attachCardEventHandlers();
    }
    if(tabType === "ADD_CPM"){
        this.handleAddClick();
    }
    this.resizeComponent();

};

/**
 * Attaches event handlers for each card's begin button
 * @returns {undefined} - undefined
 */
CPMCO1Component.prototype.attachCardEventHandlers = function(){
    var compId = this.getStyles().getId();
    $("#cardArea" + compId).on("click", ".card-begin-link", this.cardOpenClick.bind(this));
};

/**
 * Handles a card's Open button click event
 * Opens up the tab associated with the card
 * @param {window.event} event - browser event
 * @returns {undefined} - undefined
 */
CPMCO1Component.prototype.cardOpenClick = function(event){
    var domElement = event.currentTarget || event.srcElement;
    var jqOpenBtn = $(domElement);
    var cpmResourceId = jqOpenBtn.attr("data-resource-id");
    this.addDynamicView(cpmResourceId);
};

/**
 * Handles tab click event
 * Method will return right away if the clicked tab is already active
 * @param {window.event} event - browser event
 * @returns {undefined} - undefined
 */
CPMCO1Component.prototype.cpmTabClick = function(event){
    var domElement = event.currentTarget || event.srcElement;
    var jqTab = $(domElement);
    var tabType;
    var resourceId;
    if (jqTab.hasClass("cpm-tab-active-header")){
        return;
    }
    tabType = jqTab.attr("data-tab-type");
    resourceId = jqTab.attr("data-resource-id");
    this.handleTabClick(tabType, resourceId);
};

/**
 * Attaches event handlers that handle when a tab is clicked
 * @returns {undefined} - undefined
 */
CPMCO1Component.prototype.attachEventHandlers = function(){
    //Bind event handler to the tab header container
    $("#tabs" + this.getStyles().getId()).on("click", "li.cpm-tab-header", this.cpmTabClick.bind(this));
    this.attachCardEventHandlers();
};

/**
 * Triggers the Capability Timer for when a CPM is selected
 * @param {String} timerMetaData - timer meta data
 * @returns {undefined} - undefined
 */
CPMCO1Component.prototype.buildTabContainerTimerTrigger = function(timerMetaData){
    var criterion = this.getCriterion();
    var catMean = criterion.category_mean;
    var timer = new CapabilityTimer("CAP:MPG_CPM-o1_TRIGGERED", catMean); // eslint-disable-line no-undef
    timer.addMetaData("rtms.legacy.metadata.1", timerMetaData);
    timer.capture();
};

/**
 * Builds the tabs container HTML and populates default tabs
 * @returns {string} - HTML representation of the tab container, including any tabs that are shown on initial load
 */
CPMCO1Component.prototype.buildTabsContainerHtml = function(){
    /* eslint-disable no-multi-spaces */
    var summaryI18N = i18n.discernabu.summary_cpm_o1;
    var compId = this.getStyles().getId();
    var suggestedCPMResources = this.getSuggestedCPMList() || [];
    var timerMetaData;
    var metaDataArray = [];
    var html = "";

    html += "<div class='cpm-tab-container' id='tabContainer" + compId + "'>";
    //Create tab section
    html +=     "<div class='cpm-tabs' id='tabs" + compId + "'>";
    html +=         "<ul>";
    //Create summary tab
    html +=             "<li id='" + compId + "TabSummary' class='cpm-tab-header cpm-tab-active-header' data-tab-type='SUMMARY'>";
    html +=                 "<span class='cpm-tab-left-edge'>&nbsp;</span>";
    html +=                 "<span class='cpm-tab-text'>" + summaryI18N.SUMMARY + "</span>";
    html +=                 "<span class='cpm-tab-right-edge'>&nbsp;</span>";
    html +=             "</li>";
    //Create tabs for suggested CPMs
    timerMetaData = metaDataArray.join(",");
    if(timerMetaData !== ""){
        this.buildTabContainerTimerTrigger(timerMetaData);
    }
    //Create add tab
    html +=             "<li id='" + compId + "TabAdd' class='cpm-tab-header' data-tab-type='ADD_CPM'>";
    html +=                 "<span class='cpm-tab-left-edge'>&nbsp;</span>";
    html +=                 "<span class='cpm-tab-text'>" + "+" + "</span>";
    html +=                 "<span class='cpm-tab-right-edge'>&nbsp;</span>";
    html +=             "</li>";
    html +=         "</ul>";
    //Create CPM Tab specific menu
    html +=			"<div id='chxTabsMenu" + compId + "'></div>";
    html +=     "</div>";
    //Create content section
    html +=     "<hr /><div class='cpm-tabs-content' id='tabContentContainer" + compId + "'>";
    html +=         "<div class='cpm-tabpage' id='tabPage" + compId + "'>" + this.buildCardsHtml(suggestedCPMResources) + "</div>";
    html +=     "</div>";
    html += "</div>";

    return html;
    /* eslint-enable no-multi-spaces */
};

/**
 * Component's Data retrieval script.
 * Retrieves all available CPMs in the system
 * @returns {undefined} - undefined
 */
CPMCO1Component.prototype.retrieveComponentData = function(){
    var criterion = this.getCriterion();
    var personId = criterion.person_id;
    var encounterId = criterion.encntr_id;
    var prsnlId = criterion.provider_id;
    var pprCd = criterion.ppr_cd;
    var sendAr = [];
    var request;
    var loadTimer = new RTMSTimer(this.getComponentLoadTimerName(), criterion.category_mean);
    var renderTimer = new RTMSTimer(this.getComponentRenderTimerName(), criterion.category_mean);

    sendAr.push(
        "^MINE^"
        , personId + ".0"
        , encounterId + ".0"
        , prsnlId + ".0"
        , pprCd + ".0"
        , 1 //Returns all CPMs, including those without a pathway id
    );

    request = new ComponentScriptRequest();
    request.setProgramName("MP_GET_CPM_PATHWAY_STATUS");
    request.setParameterArray(sendAr);
    request.setAsyncIndicator(true);
    request.setName("getCPMsByPatient");
    request.setComponent(this);
    request.setResponseHandler(this.handleGetCPMReply.bind(this));
    request.setLoadTimer(loadTimer);
    request.setRenderTimer(renderTimer);
    request.performRequest();
};

/**
 * Handles the reply from the data retrieval script and attempts to render the component
 * @param {{}} reply : AJAX Response
 * @returns {undefined} - undefined
 */
CPMCO1Component.prototype.handleGetCPMReply = function(reply){
    var response;
    var compId = this.getStyles().getId();
    if (!reply){
        this.finalizeComponent(MP_Util.HandleErrorResponse(compId, "CPM retrieval failed."), ""); //eslint-disable-line new-cap
        return;
    }
    if (reply.getStatus() === "S" || reply.getStatus() === "Z"){
        try {
            response = reply.getResponse();
            this.createCPMResources(response.ACTIVITY_QUAL || []);
            this.setFullCPMList(null);
            this.setSuggestedCPMList(null);
            this.renderComponent();
        } catch (err){
            logger.logError(err.message);
            //Send it back up the stack
            throw err;
        }
    } else {
        this.finalizeComponent(MP_Util.HandleErrorResponse(compId, "CPM retrieval failed."), ""); //eslint-disable-line new-cap
    }
};

/**
 * Builds the HTML for an individual CPM list item
 * CPM list items appear in the searchable CPM listbox
 * @param {CPMResource} cpmResource - a CPMResource object
 * @returns {string} - HTML representation of a CPM list item
 */
CPMCO1Component.prototype.buildCPMSearchListItemHtml = function(cpmResource){
    if (!CPMResource.prototype.isPrototypeOf(cpmResource)){ // eslint-disable-line no-undef
        throw new Error("Type Error: cpmResource passed into CPMCO1Component method buildCPMSearchListItemHtml not instance of CPMResource");
    }
    return "<li class='cpm-search-result-entry' data-resource-id='" + cpmResource.getId() + "'>" + cpmResource.getConceptDisp() + "</li>";
};

/**
 * Builds the HTML for the searchable CPMs list box
 * @param {[]} cpmResourceList - Array of CPMResources to render in the list box
 * @returns {string} - HTML representation of the searchable CPMs list box
 */
CPMCO1Component.prototype.buildCPMSearchList = function(cpmResourceList){
    if (!cpmResourceList || !cpmResourceList.length){
        return "";
    }
    cpmResourceList.sort(this.sortByDispFunc);
    var html = "";
    var cpmResource;
    var cLen = cpmResourceList.length;
    var i;
    for(i = 0; i < cLen; i++){
        cpmResource = cpmResourceList[i];
        html += this.buildCPMSearchListItemHtml(cpmResource);
    }
    return html;
};

/**
 * Builds out the html inside of the Add CPM tab window
 * @returns {string} : HTML - Add CPM Content HTML
 */
CPMCO1Component.prototype.buildAddCPMHtml = function(){
    var summaryI18N = i18n.discernabu.summary_cpm_o1;
    var compId = this.getStyles().getId();
    var cpmResourceList = this.getFullCPMList() || [];
    var html = "";

     // Title with separator
    html += 	"<h2 class='cpm sec-hd'>";
    html += 		"<span class='sec-title'>";
    html += 			"<span class='comp-title'>" + summaryI18N.ADD_CARE_PROCESS_MODEL + "</span>";
    html += 			"<span class='header-separator'>&nbsp;</span>";
    html += 		"</span>";
    html += 	"</h2>";
    html +=	"<div id='addCpmSecContent" + compId + "' class='cpm-summary sec-content'>";
    // Search container holds the search-text and search-box
    html +=		"<div id='addCpmSearchContainer" + compId + "' class='search-container'>";
    html +=			"<div id='addCpmSearchArea" + compId + "' class='search-area'>";
    html +=				"<span id='addCpmSearchText" + compId + "' class='search-text'>" + summaryI18N.SEARCH_TEXT + ":</span>";
    html +=				"<input id='addCpmSearchbox" + compId + "' type='text' class='search-box'>";
    html +=			"</div>";
    html +=		"</div>";
    // CPMs List
    html +=			"<ul id='addCpmCpmList" + compId + "' class='cpm-list'>";
    html += this.buildCPMSearchList(cpmResourceList);
    html +=			"</ul>";
    // Add and Cancel Buttons
    html += 	"<div class='cpm-summary button-container'>";
    html +=			"<button id='addCpmAddButton" + compId + "' class='add button'>" + summaryI18N.ADD_BUTTON + "</button>";
    html +=			"<button id='addCpmCancelButton" + compId + "' class='cancel button'>" + summaryI18N.CANCEL_BUTTON + "</button>";
    html +=		"</div>";
    html +=	"</div>";
    return html;
};

/**
 * Attaches event delegates for the Add CPM tab, and places cursor focus on the search box
 * @returns {undefined} - undefined
 */
CPMCO1Component.prototype.handleAddClick = function(){
    var compId = this.getStyles().getId();

    //Grab necessary DOM elements to bind delegates to
    var jqSecContent = $("#addCpmSecContent" + compId);
    var jqCPMList = $("#addCpmCpmList" + compId);
    var jqSearchBox = $("#addCpmSearchbox" + compId);

    //Bind the event listeners
    jqCPMList.on("click", "li", this.cpmListItemClick.bind(this));
    jqCPMList.on("dblclick", "li", this.cpmListItemDoubleClick.bind(this));
    jqSecContent.on("click", "button", this.searchButtonsClick.bind(this));
    jqSearchBox.keyup(this.searchBoxKeyup.bind(this));

    //Set focus on the search box so user can type right way
    jqSearchBox.focus();
};

/**
 * Handles the add CPM section list item click event
 * Clicking a CPM in the list box will toggle its selection, and deselect any previously selected CPM
 * @param {window.event} event - browser event
 * @returns {undefined} - undefined
 */
CPMCO1Component.prototype.cpmListItemClick = function(event){
    var domElement = event.currentTarget || event.srcElement;
    var jqListItem = $(domElement);

    var jqCPMList = $("#addCpmCpmList" + this.getStyles().getId());
    var clickedItemId = jqListItem.attr("data-resource-id");
    jqCPMList.find("li.selected").not("[data-resource-id='" + clickedItemId + "']").removeClass("selected");
    //Toggle selection
    jqListItem.toggleClass("selected");
};

/**
 * Handles the add CPM section list item double click event
 * Double clicking a CPM in the list box will create and/or open the selected CPM's tab
 * @param {window.event} event - browser event
 * @returns {undefined} - undefined
 */
CPMCO1Component.prototype.cpmListItemDoubleClick = function(event){
    var domElement = event.currentTarget || event.srcElement;
    var jqListItem = $(domElement);
    var clickedItemId = jqListItem.attr("data-resource-id");
	jqListItem.addClass("selected");
    this.addDynamicView(clickedItemId);
};

/**
 * Handles the add CPM section add/cancel button click events
 * The Add button will create and/or open the selected CPM's tab
 * The Cancel button will clear the search
 * @param {window.event} event - browser event
 * @returns {undefined} - undefined
 */
CPMCO1Component.prototype.searchButtonsClick = function(event){
    var compId = this.getStyles().getId();
    var domElement = event.currentTarget || event.srcElement;
    var buttonId = domElement.id;

    var jqCPMList = $("#addCpmCpmList" + compId);
    var jqSelectedItem = jqCPMList.find("li.selected");
	var cpmResourceId = "";
	var jqSearchBox = null;
	
    if (buttonId === "addCpmAddButton" + compId){
        cpmResourceId = jqSelectedItem.attr("data-resource-id");
        this.addDynamicView(cpmResourceId);
    } else if (buttonId === "addCpmCancelButton" + compId){
        jqSearchBox = $("#addCpmSearchbox" + compId);
        jqSelectedItem.removeClass("selected");
        jqSearchBox.val("").keyup();
        jqSearchBox.focus();
    }
};

/**
 * Handles the add CPM section search box keyup event
 * Filters the list of CPMs to those that contain the search term
 * @param {window.event} event - browser event
 * @returns {undefined} - undefined
 */
CPMCO1Component.prototype.searchBoxKeyup = function(event){
    var domElement = event.currentTarget || event.srcElement;
    var searchValue = $.trim($(domElement).val()).toLowerCase();
    var cpmResource;
    var cpmTerm;
    var cpmList = this.getFullCPMList() || [];
    var cLen = cpmList.length;
    var i;
    var html = "";
    for (i = 0; i < cLen; i++){
        cpmResource = cpmList[i];
        cpmTerm = cpmResource.getConceptDisp().toLowerCase();
		if (cpmTerm.indexOf(searchValue) >= 0){
            html += this.buildCPMSearchListItemHtml(cpmResource);
        }
    }
    $("#addCpmCpmList" + this.getStyles().getId()).html(html);
};

/**
 * Builds the HTML for the cards representing all the suggested CPMs
 * @param {[]} suggestedCPMResources - array of suggested CPMResources
 * @returns {string} - html representation of the suggested CPMs cards
 */
CPMCO1Component.prototype.buildCardsHtml = function(suggestedCPMResources){
    var summaryI18N = i18n.discernabu.summary_cpm_o1;
    var compId = this.getStyles().getId();
    var cpmResource;
    var sLen = suggestedCPMResources.length;
    var html = "";
    var i;
    var triggerTypes = CPMResource.TRIGGER_TYPES; // eslint-disable-line no-undef
    html += "<div class='cpm-summary card-area' id='cardArea" + compId + "'>";
	
	var metaDataArray = [];
	for (i = 0; i < sLen; i++){
		var card = suggestedCPMResources[i];
		var mean = card.getConceptDisp();
		metaDataArray.push(mean);
	}
	
	var timerMetaData = metaDataArray.join(',');
	if(timerMetaData !== ""){
		this.buildTabContainerTimerTrigger(timerMetaData);
	}

    for (i = 0; i < sLen; i++){
        cpmResource = suggestedCPMResources[i];
        html += "<div class='cpmo1-card-wrapper'>";
        html += "<div class='card'>";
        html += 	"<div class='card-header'>";
        html += 		"<span class='card-title' title='" + cpmResource.getConceptDisp() + "'>" + cpmResource.getConceptDisp() + "</span>";
        html += 		"<span class='card-begin-link' data-resource-id='" + cpmResource.getId() + "' title='" + summaryI18N.OPEN + "' >" + summaryI18N.OPEN + "</span>";
        html += 	"</div>";
        html += 	"<div class='reason-included'>" + summaryI18N.REASON_INCLUDED + "</div>";
        html +=		"<div class='reasons'>";
        switch (cpmResource.getTriggerType()){
            //Diagnosis and Problem both display the same, so using intentional fallthrough
            case triggerTypes.DIAGNOSIS:
            case triggerTypes.PROBLEM:
                html += "<span class='category'>" + summaryI18N.PROBLEM + ":</span>";
                html += "<span class='result'>" + cpmResource.getTriggerDescription() + "</span>";
                break;
            case triggerTypes.PATHWAY_STATUS:
                html += "<span class='category'>" + summaryI18N.PROPOSED_BY + ":</span>";
                html += "<span class='result'>" + cpmResource.getProposedByName() + "</span>";
                break;
        }
        html +=		"</div>";
        html += "</div>";
        html += "</div>";
    }
    html += "</div>";

    return html;
};

/**
 * Creates a tab if necessary, and attempts to render it.
 * @param {string} resourceId - id of CPMResource to render tab for
 * @returns {undefined} - undefined
 */
CPMCO1Component.prototype.addDynamicView = function(resourceId){
	var cpm = this.getCPMResourceManager().getCPMResourceById(resourceId);
	var mean = "DYN_" + cpm.getConceptCd();
	var viewExists = MP_Viewpoint.getTabControlObject().tabExists(mean);
	
	if (mean != this.m_summaryMean){
		this.cpmTabClickedTimerTrigger(mean);
	}
	
	var cpmWorkflow = new CPMWorkflow();
	cpmWorkflow.setCPMResource(cpm);
	cpmWorkflow.setCategoryMean(mean);
	
	var viewContainer = new ViewContainer(mean);
	viewContainer.setViewType("DYN_CPM");
	viewContainer.setViewName(cpm.getConceptDisp());
	viewContainer.setCategoryMean(mean);
	viewContainer.setSequence(0);
	viewContainer.setViewObject(cpmWorkflow);

	// view exists so let's not do a bunch of work, let's just switch to the tab
	if(viewExists){
		$("#" + mean + "tab").click();
	}
	// view doesn't exist so let's go out and create it.
	else{
		MP_Viewpoint.addDynamicTab(viewContainer, true);
	}
};

/**
 * Checks the DOM to check if the selected cpm was previously activated
 * @param {string} mean - The category mean from the selected cpm with a prepended "DYN_"
 * @returns {boolean} - returns whether the selected cpm was previously activated or not
 */
CPMCO1Component.prototype.isPreviouslyActivated = function(mean){
	var viewContainerArray = MP_Viewpoint.getViewpointObject().getViewContainerArray();
	var y = 0;
	
	for(y; y < viewContainerArray.length; y++){
		if(mean === viewContainerArray[y].getCategoryMean()){
			viewContainer = viewContainerArray[y];
			return true;
		}
	}
	return false;
};

/**
 * Creates and adds CPMResource objects to the CPMResourceManager based on the JSON Array passed in
 * Throws an error if cpmResponseList is not an object
 * @param {[]} cpmResponseList - Array of CPMResource configurations
 * @returns {undefined} - undefined
 */
CPMCO1Component.prototype.createCPMResources = function(cpmResponseList){
    if (!cpmResponseList || typeof cpmResponseList !== "object"){
        throw new Error("Type Error: cpmResponse passed into CPMCO1Component method createCPMResources is undefined or not an object");
    }
    var cpmResourceManager = this.getCPMResourceManager();
    if (!cpmResourceManager){
        cpmResourceManager = new CPMResourceManager(); // eslint-disable-line no-undef
        this.setCPMResourceManager(cpmResourceManager);
    }
    cpmResourceManager.removeAllCPMResources();

    var conceptList = cpmResponseList || [];
    var cLen = conceptList.length;
    var i;
    for (i = 0; i < cLen; i++){
        var cpmResource = CPMResourceManager.createCPMResource(conceptList[i]); // eslint-disable-line no-undef
        cpmResourceManager.addCPMResource(cpmResource);
    }
};

/**
 * Sort function to sort an array of CPMResource objects based on the CPMResource conceptDisp
 * @param {CPMResource} a - CPMResource object
 * @param {CPMResource} b - CPMResource object
 * @returns {number} - indicator of order to place two CPMResource objects
 */
CPMCO1Component.prototype.sortByDispFunc = function(a, b){
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

/**
 * Renders the component and attaches event listeners
 * @returns {undefined} - undefined
 */
CPMCO1Component.prototype.renderComponent = function(){
    var html = "";

    //build tab container (includes default tabs)
    html += "<div class='content-body'>";
    html += this.buildTabsContainerHtml();
    html += "</div>";

    this.finalizeComponent(html);

    //Attach event handlers
    this.attachEventHandlers();
};

MP_Util.setObjectDefinitionMapping("WF_CPM_COMP", CPMCO1Component);
