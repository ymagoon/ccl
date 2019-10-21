function PartoTable3StyleWF() {
    this.initByNamespace("parto-table3-wf");
}

PartoTable3StyleWF.inherits(ComponentStyle);

/**
 * The Partogram Table3 component retrieves the results documented for a patient for various assessments.
 * 
 * @param {criterion}
 *            criterion : The Criterion object which contains information needed to render the component.
 */
function PartoTable3ComponentWF(criterion) {
    this.setCriterion(criterion);
    this.setStyles(new PartoTable3StyleWF());
    this.setComponentLoadTimerName("USR:MPG.PARTOTABLE3.O2 - load component");
    this.setComponentRenderTimerName("ENG:MPG.PARTOTABLE3.O2 - render component");
    this.imageFolderPath = this.getCriterion().static_content + "/images/";
    // Constant to represent the component
    this.tableSectionFlag = 3;
    this.recordData = null;
    this.setRefreshEnabled(false);
    this.setResourceRequired(true);
    this.componentID = null;
    this.loadTimer = null;
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object.
 */
PartoTable3ComponentWF.prototype = new MPageComponent();
PartoTable3ComponentWF.prototype.constructor = MPageComponent;

/**
 * Map the Table Component Option 2 object to the bedrock filter mapping so the architecture will know what object to create when it finds the
 * "WF_PARTO_TABLE" filter.
 */
MP_Util.setObjectDefinitionMapping("WF_PARTO_TABLE3", PartoTable3ComponentWF);

/**
 * Creates the necessary parameter array for the data acquisition and makes the necessary script call to retrieve the Partogram table data.
 */
PartoTable3ComponentWF.prototype.retrieveComponentData = function() {
    var criterion = this.getCriterion();
    if (PartogramBaseComponent.prototype.getPartogramViewID() !== criterion.category_mean) {
        var messageHTML = "<span class='res-none'>" + i18n.discernabu.partogrambaseutil_o2.NOT_PARTOGRAM_VIEW + "</span>";
        this.finalizeComponent(messageHTML, "");
        return;
    }
    this.loadTimer = new RTMSTimer(this.getComponentLoadTimerName());
    var renderTimer = new RTMSTimer(this.getComponentRenderTimerName());
    var groups = this.getGroups();
    var groupsLength = groups.length;

    if (groupsLength > 0) {
        var sendAr = [];
        var partogramInfoSR = MP_Resources.getSharedResource("partogramInfo");
        var partogramStartDate = partogramInfoSR.getResourceData().getPartogramStartDate();
        partogramStartDate = MP_Util.CreateDateParameter(partogramStartDate);

        sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.position_cd + ".0", criterion.ppr_cd + ".0",
            this.tableSectionFlag);

        for (var i = 0; i < groupsLength; i++) {
            var group = groups[i];
            if (group instanceof MPageEventCodeGroup) {
                sendAr.push(MP_Util.CreateParamArray(group.getEventCodes(), 1));
            }
        }

        sendAr.push(criterion.encntr_id + ".0");
        sendAr.push("^" + partogramStartDate + "^");
        var scriptRequest = new ComponentScriptRequest();
        scriptRequest.setProgramName("MP_GET_PARTOGRAM_TABLE");
        scriptRequest.setParameterArray(sendAr);
        scriptRequest.setComponent(this);
        scriptRequest.setLoadTimer(this.loadTimer);
        scriptRequest.setRenderTimer(renderTimer);
        scriptRequest.performRequest();
    } else {
        var noEventCodeMappedMessage = "<span class='res-none'>" + i18n.discernabu.partogrambaseutil_o2.NOT_CONFIGURED_BEDROCK_ERR + "</span>";
        this.finalizeComponent(noEventCodeMappedMessage, "");
    }
};
/**
 * @method Returns the path where images are stored in the static content folder
 * @return the relative path
 */
PartoTable3ComponentWF.prototype.getImageFolderPath = function() {
    return this.imageFolderPath;
};

/**
 * Retrieves the partogram information from the shared resources to check whether the patient is in active labor or not.
 */
PartoTable3ComponentWF.prototype.RetrieveRequiredResources = function() {
    // Check to see if this component is part of a partogram view, if not, no need to check
    // the partogramInfo object
    if (PartogramBaseComponent.prototype.getPartogramViewID() !== this.getCriterion().category_mean) {
        var messageHTML = "<span class='res-none'>" + i18n.discernabu.partogrambaseutil_o2.NOT_PARTOGRAM_VIEW + "</span>";
        this.finalizeComponent(messageHTML, "");
        return;
    }
    // Check to see if the partogramInfo object is available to use
    var partogramInfoSR = MP_Resources.getSharedResource("partogramInfo");
    if (partogramInfoSR && partogramInfoSR.isResourceAvailable() && !jQuery.isEmptyObject(partogramInfoSR.getResourceData())) {
        this.retrieveComponentData();
    } else {
        // Add a listener so we can refresh the component if partogram info updates
        CERN_EventListener.addListener(this, "partogramInfoAvailable", this.retrieveComponentData, this);
    }
};

/**
 * Renders the Partogram Table3 component by calling the Table Base component.
 * 
 * @param recordData -
 *            has the information retrieved from the Partogram Table script call.
 */
PartoTable3ComponentWF.prototype.renderComponent = function(recordData) {
    this.recordData = recordData;
    var renderingCAPTimer = new CapabilityTimer("CAP:MPG.PARTOGRAMTAB3.O2 - rendering component", this.getCriterion().category_mean);
    if (renderingCAPTimer) {
        renderingCAPTimer.capture();
    }
    var recordDataLength = recordData.QUAL.length,
        i, resultsCount = 0,
        unit;
    for (i = 0; i < recordDataLength; i++) {
        unit = recordData.QUAL[i];
        resultsCount += unit.TABLE_DATA.length + unit.DYNAMIC_LIST.length;
    }
    this.loadTimer.addMetaData("component.resultcount", resultsCount);
    PARTO_TABLE_BASE.renderTableSection(this);
    this.componentID = this.getStyles().getId();
    $('#' + this.componentID).css('margin-bottom', PARTO_GRAPH_BASE.getComponentBottomPadding());
};
/**
 * Post processing to keep graph and table components in sync.
 */
PartoTable3ComponentWF.prototype.postProcessing = function() {
    if (this.recordData != null && this.recordData.STATUS_DATA.STATUS === "S") {
        PARTO_GRAPH_BASE.addTimeScaleButtons(this.componentID);
        PARTO_TABLE_BASE.addPartogramTableAttributes(this.componentID);
    }
};

PartoTable3ComponentWF.prototype.resizeComponent = function() {
    if (this.recordData != null && this.recordData.STATUS_DATA.STATUS === "S") {
        PARTO_TABLE_BASE.setFlowSheetTableDimensions(this.componentID);
        PARTO_TABLE_BASE.displayCurrentTimeBar(this.componentID);
    }
};

/**
 * A callback method to reset the scroll position of the flowsheet Table after the component's drag/drop.
 */
PartoTable3ComponentWF.prototype.postDOMLocationChange = function() {
    if (this.recordData != null && this.recordData.STATUS_DATA.STATUS === "S") {
        var uniqueComp = $("#" + this.componentID + "resultsTabletable");
        var currentLeft = uniqueComp.scrollLeft();
        if (parseInt(PARTO_TABLE_BASE.scrollLeft) != currentLeft) {
            uniqueComp.scrollLeft(PARTO_TABLE_BASE.scrollLeft);
        }
    }
};
