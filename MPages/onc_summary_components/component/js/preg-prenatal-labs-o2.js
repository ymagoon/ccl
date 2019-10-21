function PrenatalLabComponentStyle() {
    this.initByNamespace("prenatal-labs");
}

PrenatalLabComponentStyle.prototype = new ComponentStyle();
PrenatalLabComponentStyle.prototype.constructor = ComponentStyle;

/**
 * The Prenatal Labs component will allow the user to view Labs
 * info for the patient from within the MPage
 *
 * @param {Criterion} criterion
 */
function PrenatalLabComponent(criterion) {
    this.setCriterion(criterion);
    this.setStyles(new PrenatalLabComponentStyle());
    this.setLookBackDropDown(true);
    this.prenatalTable = null;
    this.setComponentLoadTimerName("USR:MPG.PrenatalLabs.O2 - load component");
    this.setComponentRenderTimerName("ENG:MPG.PrenatalLabs.O2 - render component");
    // Flag for resource required
    this.setResourceRequired(true);

    //Const values
    this.OVERLAPPED_INPUT = "OVERLAPPED_INPUT";
    this.INVALID_INPUT = "INVALID_INPUT";
    this.INCOMPLETE = 1;
    this.MODIFIED = 1;

    this.m_lastSelectedRow = "";
    this.m_lastSelectedGrp = "";
    this.m_sidePanelContainer = null;
    this.m_sidePanel = null;
    this.m_sidePanelVisible = false;
    this.m_sidePanelMinHeight = 251;
    this.prevSelectedRowId = "";
    this.prevSelectedGroup = "";
    
    // Cache the component table element.
    this.m_tableView = null;
    this.reRenderSidePanel = false;

    // Initial group 
    this.labsInitial = "";
    this.labsInitialSeq = "";
    this.labsInitialColl = "";
    this.labsInitialLabel = "";

    // Lab group 1
    this.labsGroup1 = "";
    this.labsGrp1_st_wk = "";
    this.labsGrp1_en_wk = "";
    this.labsGroup1Seq = "";
    this.labsGroup1Coll = "";
    this.labsGroup1Label = "";

    // Lab group 2   
    this.labsGroup2 = "";
    this.labsGrp2_st_wk = "";
    this.labsGrp2_en_wk = "";
    this.labsGroup2Seq = "";
    this.labsGroup2Coll = "";
    this.labsGroup2Label = "";

    // Lab group 3
    this.labsGroup3 = "";
    this.labsGrp3_st_wk = "";
    this.labsGrp3_en_wk = "";
    this.labsGroup3Seq = "";
    this.labsGroup3Coll = "";
    this.labsGroup3Label = "";

    // Lab group 4
    this.labsGroup4 = "";
    this.labsGrp4_st_wk = "";
    this.labsGrp4_en_wk = "";
    this.labsGroup4Seq = "";
    this.labsGroup4Coll = "";
    this.labsGroup4Label = "";

    // Lab group 5
    this.labsGroup5 = "";
    this.labsGrp5_st_wk = "";
    this.labsGrp5_en_wk = "";
    this.labsGroup5Seq = "";
    this.labsGroup5Coll = "";
    this.labsGroup5Label = "";

    // Optional lab
    this.labsOptional = "";
    this.labsOptionalSeq = "";
    this.labsOptionalColl = "";
    this.labsOptionalLabel = "";

    //Store Pregnancy Information Object if it is available from shared resource.
    this.pregnancyInfoObj = null;

    //Prenatal lab data retrieved from back end.
    this.labBinds = null;

    //Holds the Order details for the currently selected row in the table.
    this.currentOrderableData = [];

    //Used to store the prenatal lab ordered items in a list.
    this.orderedData = [];

    //Holds selected result event code & id which would be used for saving a lab for particular gestational range.
    this.selectedEventId = "";
    this.selectedEventCode = "";

    //Selected group id and row id used save or decline a lab.
    this.selectedGroupId = "";
    this.selectedRowId = "";

    //Holds saved and declined lab results.
    this.savedLabData = [];
    this.declinedLabData = [];

    //Whether there is a pending action to be completed formed by the user by selecting decline or save changes button. 
    this.actionPerformed = false;

    //Lab Group Ids used to identify a lab belongs to which group.
    this.labGroupIds = {
    	INITIAL_LAB : "initialLab",
    	LAB_GROUP1 : "labGrp1",
    	LAB_GROUP2 : "labGrp2",
    	LAB_GROUP3 : "labGrp3",
    	LAB_GROUP4 : "labGrp4",
    	LAB_GROUP5 : "labGrp5",
    	OPTIONAL_LAB : "optionalLab"
    };

    //Lab Group Index to get the index of a lab group.
    this.labGroupIndex = [];
    var idx = 0;
    for(var key in this.labGroupIds) {
        if (this.labGroupIds.hasOwnProperty(key)) {
            this.labGroupIndex[this.labGroupIds[key]] = idx++;
    	}
    }

    this.currentGestAge = 0;

    CERN_EventListener.addListener(this, EventListener.EVENT_CLINICAL_EVENT, this.retrieveComponentData, this);

    // Event Listener - To update the component whenever pregnancy 
    // information is available or if pregnanacy information is updated.
    CERN_EventListener.addListener(this, "pregnancyInfoAvailable", this.retrieveComponentData, this);
}

PrenatalLabComponent.prototype = new MPageComponent();
PrenatalLabComponent.prototype.constructor = MPageComponent;

/**
 * Map the Prenatal Lab object to the bedrock filter mapping so the
 * architecture will know what object to create when it sees the
 * "WF_PREG_PREN_LABS" filter
 */
MP_Util.setObjectDefinitionMapping("WF_PREG_PREN_LABS", PrenatalLabComponent);

/**
 * This method sets Initial labs
 * @Param {Initial labs}
 */
PrenatalLabComponent.prototype.setLabsInitial = function(labsInitial) {
    this.labsInitial = labsInitial;
};
/**
 * This method gets Initial labs
 */
PrenatalLabComponent.prototype.getLabsInitial = function() {
    return this.labsInitial;
};
/**
 * This method sets Group 1 labs
 * @Param {Group 1 labs}
 */
PrenatalLabComponent.prototype.setLabsGroup1 = function(labsGroup1) {
    this.labsGroup1 = labsGroup1;
};
/**
 * This method gets Group 1 labs
 */
PrenatalLabComponent.prototype.getLabsGroup1 = function() {
    return this.labsGroup1;
};
/**
 * This method sets Group 1 start week
 * @Param {Group 1 start week}
 */
PrenatalLabComponent.prototype.setLabsGroup1StartWeek = function(labsGrp1_st_wk) {
    this.labsGrp1_st_wk = labsGrp1_st_wk;
};
/**
 * This method gets Group 1 start week
 */
PrenatalLabComponent.prototype.getLabsGroup1StartWeek = function() {
    return this.labsGrp1_st_wk;
};
/**
 * This method sets Group 1 end week
 * @Param {Group 1 end week}
 */
PrenatalLabComponent.prototype.setLabsGroup1EndWeek = function(labsGrp1_en_wk) {
    this.labsGrp1_en_wk = labsGrp1_en_wk;
};
/**
 * This method gets Group 1 end week
 */
PrenatalLabComponent.prototype.getLabsGroup1EndWeek = function() {
    return this.labsGrp1_en_wk;
};
/**
 * This method sets Group 2 labs
 * @Param {Group 2 labs}
 */
PrenatalLabComponent.prototype.setLabsGroup2 = function(labsGroup2) {
    this.labsGroup2 = labsGroup2;
};
/**
 * This method gets Group 2 labs
 */
PrenatalLabComponent.prototype.getLabsGroup2 = function() {
    return this.labsGroup2;
};
/**
 * This method sets Group 2 end week
 * @Param {Group 2 end week}
 */
PrenatalLabComponent.prototype.setLabsGroup2StartWeek = function(labsGrp2_st_wk) {
    this.labsGrp2_st_wk = labsGrp2_st_wk;
};
/**
 * This method gets Group 2 end week
 */
PrenatalLabComponent.prototype.getLabsGroup2StartWeek = function() {
    return this.labsGrp2_st_wk;
};
/**
 * This method sets Group 2 start week
 * @Param {Group 2 start week}
 */
PrenatalLabComponent.prototype.setLabsGroup2EndWeek = function(labsGrp2_en_wk) {
    this.labsGrp2_en_wk = labsGrp2_en_wk;
};
/**
 * This method gets Group 2 start week
 */
PrenatalLabComponent.prototype.getLabsGroup2EndWeek = function() {
    return this.labsGrp2_en_wk;
};
/**
 * This method sets Group 3 labs
 * @Param {Group 3 labs}
 */
PrenatalLabComponent.prototype.setLabsGroup3 = function(labsGroup3) {
    this.labsGroup3 = labsGroup3;
};
/**
 * This method gets Group 3 labs
 */
PrenatalLabComponent.prototype.getLabsGroup3 = function() {
    return this.labsGroup3;
};
/**
 * This method sets Group 3 start week
 * @Param {Group 3 start week}
 */
PrenatalLabComponent.prototype.setLabsGroup3StartWeek = function(labsGrp3_st_wk) {
    this.labsGrp3_st_wk = labsGrp3_st_wk;
};
/**
 * This method gets Group 3 start week
 */
PrenatalLabComponent.prototype.getLabsGroup3StartWeek = function() {
    return this.labsGrp3_st_wk;
};
/**
 * This method sets Group 3 end week
 * @Param {Group 3 end week}
 */
PrenatalLabComponent.prototype.setLabsGroup3EndWeek = function(labsGrp3_en_wk) {
    this.labsGrp3_en_wk = labsGrp3_en_wk;
};
/**
 * This method gets Group 3 end week
 */
PrenatalLabComponent.prototype.getLabsGroup3EndWeek = function() {
    return this.labsGrp3_en_wk;
};
/**
 * This method sets Group 4 labs
 * @Param {Group 4 labs}
 */
PrenatalLabComponent.prototype.setLabsGroup4 = function(labsGroup4) {
    this.labsGroup4 = labsGroup4;
};
/**
 * This method gets Group 4 labs
 */
PrenatalLabComponent.prototype.getLabsGroup4 = function() {
    return this.labsGroup4;
};
/**
 * This method sets Group 4 start week
 * @Param {Group 4 start week}
 */
PrenatalLabComponent.prototype.setLabsGroup4StartWeek = function(labsGrp4_st_wk) {
    this.labsGrp4_st_wk = labsGrp4_st_wk;
};
/**
 * This method gets Group 4 start week
 */
PrenatalLabComponent.prototype.getLabsGroup4StartWeek = function() {
    return this.labsGrp4_st_wk;
};
/**
 * This method sets Group 4 end week
 * @Param {Group 4 end week}
 */
PrenatalLabComponent.prototype.setLabsGroup4EndWeek = function(labsGrp4_en_wk) {
    this.labsGrp4_en_wk = labsGrp4_en_wk;
};
/**
 * This method gets Group 4 end week
 */
PrenatalLabComponent.prototype.getLabsGroup4EndWeek = function() {
    return this.labsGrp4_en_wk;
};
/**
 * This method sets Group 5 labs
 * @Param {Group 5 labs}
 */
PrenatalLabComponent.prototype.setLabsGroup5 = function(labsGroup5) {
    this.labsGroup5 = labsGroup5;
};
/**
 * This method gets Group 5 labs
 */
PrenatalLabComponent.prototype.getLabsGroup5 = function() {
    return this.labsGroup5;
};
/**
 * This method sets Group 5 start week
 * @Param {Group 5 start week}
 */
PrenatalLabComponent.prototype.setLabsGroup5StartWeek = function(labsGrp5_st_wk) {
    this.labsGrp5_st_wk = labsGrp5_st_wk;
};
/**
 * This method gets Group 5 start week
 */
PrenatalLabComponent.prototype.getLabsGroup5StartWeek = function() {
    return this.labsGrp5_st_wk;
};
/**
 * This method sets Group 5 end week
 * @Param {Group 5 end week}
 */
PrenatalLabComponent.prototype.setLabsGroup5EndWeek = function(labsGrp5_en_wk) {
    this.labsGrp5_en_wk = labsGrp5_en_wk;
};
/**
 * This method gets Group 5 end week
 */
PrenatalLabComponent.prototype.getLabsGroup5EndWeek = function() {
    return this.labsGrp5_en_wk;
};
/**
 * This method sets Optional labs
 * @Param {Optional Labs}
 */
PrenatalLabComponent.prototype.setOptionalLab = function(labsOptional) {
    this.labsOptional = labsOptional;
};
/**
 * This method gets optional Labs
 */
PrenatalLabComponent.prototype.getOptionalLab = function() {
    return this.labsOptional;
};
/**
 * This method sets Initial Labs Sequence
 * @Param {Initial Labs Sequence}
 */
PrenatalLabComponent.prototype.setInitialSeq = function(labsInitialSeq) {
    this.labsInitialSeq = labsInitialSeq;
};
/**
 * This method gets Initial Labs Sequence
 */
PrenatalLabComponent.prototype.getInitialSeq = function() {
    return this.labsInitialSeq;
};
/**
 * This method sets Initial Labs Expand collapse boolean
 * @Param {Initial Labs Expand collapse boolean}
 */
PrenatalLabComponent.prototype.setInitialCollapseBool = function(
    labsInitialColl) {
    this.labsInitialColl = labsInitialColl;
};
/**
 * This method gets Initial Labs Expand collapse boolean
 */
PrenatalLabComponent.prototype.getInitialCollapseBool = function() {
    return this.labsInitialColl;
};
/**
 * This method sets Group 1 Labs Sequence
 * @Param {Group 1 Labs Sequence}
 */
PrenatalLabComponent.prototype.setLabsGroup1Seq = function(labsGroup1Seq) {
    this.labsGroup1Seq = labsGroup1Seq;
};
/**
 * This method gets Group 1 Labs Sequence
 */
PrenatalLabComponent.prototype.getLabsGroup1Seq = function() {
    return this.labsGroup1Seq;
};
/**
 * This method sets Group 1 Labs Expand collapse boolean
 * @Param {Group 1 Labs Expand collapse boolean}
 */
PrenatalLabComponent.prototype.setLabsGroup1CollapseBool = function(
    labsGroup1Coll) {
    this.labsGroup1Coll = labsGroup1Coll;
};
/**
 * This method gets Group 1 Labs Expand collapse boolean
 */
PrenatalLabComponent.prototype.getLabsGroup1CollapseBool = function() {
    return this.labsGroup1Coll;
};
/**
 * This method sets Group 2 Labs Sequence
 * @Param {Group 2 Labs Sequence}
 */
PrenatalLabComponent.prototype.setLabsGroup2Seq = function(labsGroup2Seq) {
    this.labsGroup2Seq = labsGroup2Seq;
};
/**
 * This method gets Group 2 Labs Sequence
 */
PrenatalLabComponent.prototype.getLabsGroup2Seq = function() {
    return this.labsGroup2Seq;
};
/**
 * This method sets Group 2 Labs Expand collapse boolean
 * @Param {Group 2 Labs Expand collapse boolean}
 */
PrenatalLabComponent.prototype.setLabsGroup2CollapseBool = function(
    labsGroup2Coll) {
    this.labsGroup2Coll = labsGroup2Coll;
};
/**
 * This method gets Group 2 Labs Expand collapse boolean
 */
PrenatalLabComponent.prototype.getLabsGroup2CollapseBool = function() {
    return this.labsGroup2Coll;
};
/**
 * This method sets Group 3 Labs Sequence
 * @Param {Group 3 Labs Sequence}
 */
PrenatalLabComponent.prototype.setLabsGroup3Seq = function(labsGroup3Seq) {
    this.labsGroup3Seq = labsGroup3Seq;
};
/**
 * This method gets Group 3 Labs Sequence
 */
PrenatalLabComponent.prototype.getLabsGroup3Seq = function() {
    return this.labsGroup3Seq;
};
/**
 * This method sets Group 3 Labs Expand collapse boolean
 * @Param {Group 3 Labs Expand collapse boolean}
 */
PrenatalLabComponent.prototype.setLabsGroup3CollapseBool = function(
    labsGroup3Coll) {
    this.labsGroup3Coll = labsGroup3Coll;
};
/**
 * This method gets Group 3 Labs Expand collapse boolean
 */
PrenatalLabComponent.prototype.getLabsGroup3CollapseBool = function() {
    return this.labsGroup3Coll;
};
/**
 * This method sets Group 4 Labs Sequence
 * @Param {Group 4 Labs Sequence}
 */
PrenatalLabComponent.prototype.setLabsGroup4Seq = function(labsGroup4Seq) {
    this.labsGroup4Seq = labsGroup4Seq;
};
/**
 * This method gets Group 4 Labs Sequence
 */
PrenatalLabComponent.prototype.getLabsGroup4Seq = function() {
    return this.labsGroup4Seq;
};
/**
 * This method sets Group 4 Labs Expand collapse boolean
 * @Param { Group 4 Labs Expand collapse boolean}
 */
PrenatalLabComponent.prototype.setLabsGroup4CollapseBool = function(
    labsGroup4Coll) {
    this.labsGroup4Coll = labsGroup4Coll;
};
/**
 * This method gets Group 4 Labs Expand collapse boolean
 */
PrenatalLabComponent.prototype.getLabsGroup4CollapseBool = function() {
    return this.labsGroup4Coll;
};
/**
 * This method sets Group 5 Labs Sequence
 * @Param {Group 5 Labs Sequence}
 */
PrenatalLabComponent.prototype.setLabsGroup5Seq = function(labsGroup5Seq) {
    this.labsGroup5Seq = labsGroup5Seq;
};
/**
 * This method gets Group 5 Labs Sequence
 */
PrenatalLabComponent.prototype.getLabsGroup5Seq = function() {
    return this.labsGroup5Seq;
};
/**
 * This method sets Group 5 Labs Expand collapse boolean
 * @Param {Group 5 Labs Expand collapse boolean}
 */
PrenatalLabComponent.prototype.setLabsGroup5CollapseBool = function(
    labsGroup5Coll) {
    this.labsGroup5Coll = labsGroup5Coll;
};
/**
 * This method gets Group 5 Labs Expand collapse boolean
 */
PrenatalLabComponent.prototype.getLabsGroup5CollapseBool = function() {
    return this.labsGroup5Coll;
};
/**
 * This method sets Optional Labs Sequence
 * @Param {Optional Labs Sequence}
 */
PrenatalLabComponent.prototype.setOptionalLabSeq = function(labsOptionalSeq) {
    this.labsOptionalSeq = labsOptionalSeq;
};
/**
 * This method gets Optional Labs Sequence
 */
PrenatalLabComponent.prototype.getOptionalLabSeq = function() {
    return this.labsOptionalSeq;
};
/**
 * This method sets Optional Labs Expand collapse boolean
 * @Param {Optional Labs Expand collapse boolean}
 */
PrenatalLabComponent.prototype.setOptionalLabCollapseBool = function(labsOptionalColl) {
    this.labsOptionalColl = labsOptionalColl;
};
/**
 * This method gets Optional Labs Expand collapse boolean
 */
PrenatalLabComponent.prototype.getOptionalLabCollapseBool = function() {
    return this.labsOptionalColl;
};
/**
 * This method sets Initial Labs Label
 * @Param {Initial Labs Label}
 */
PrenatalLabComponent.prototype.setInitialLabel = function(labsInitialLabel) {
    this.labsInitialLabel = labsInitialLabel;
};
/**
 * This method gets Initial Labs Label
 */
PrenatalLabComponent.prototype.getInitialLabel = function() {
    return this.labsInitialLabel;
};
/**
 * This method sets Group 1 Labs Label
 * @Param {Group 1 Labs Label}
 */
PrenatalLabComponent.prototype.setLabsGroup1Label = function(labsGroup1Label) {
    this.labsGroup1Label = labsGroup1Label;
};
/**
 * This method gets Group 1 Labs Label
 */
PrenatalLabComponent.prototype.getLabsGroup1Label = function() {
    return this.labsGroup1Label;
};
/**
 * This method sets Group 2 Labs Label
 * @Param {Group 2 Labs Label}
 */
PrenatalLabComponent.prototype.setLabsGroup2Label = function(labsGroup2Label) {
    this.labsGroup2Label = labsGroup2Label;
};
/**
 * This method gets Group 2 Labs Label
 */
PrenatalLabComponent.prototype.getLabsGroup2Label = function() {
    return this.labsGroup2Label;
};
/**
 * This method sets Group 3 Labs Label
 * @Param {Group 3 Labs Label}
 */
PrenatalLabComponent.prototype.setLabsGroup3Label = function(labsGroup3Label) {
    this.labsGroup3Label = labsGroup3Label;
};
/**
 * This method gets Group 3 Labs Label
 */
PrenatalLabComponent.prototype.getLabsGroup3Label = function() {
    return this.labsGroup3Label;
};
/**
 * This method sets Group 4 Labs Label
 * @Param {Group 4 Labs Label}
 */
PrenatalLabComponent.prototype.setLabsGroup4Label = function(labsGroup4Label) {
    this.labsGroup4Label = labsGroup4Label;
};
/**
 * This method gets Group 4 Labs Label
 */
PrenatalLabComponent.prototype.getLabsGroup4Label = function() {
    return this.labsGroup4Label;
};
/**
 * This method sets Group 5 Labs Label
 * @Param {Group 5 Labs Label}
 */
PrenatalLabComponent.prototype.setLabsGroup5Label = function(labsGroup5Label) {
    this.labsGroup5Label = labsGroup5Label;
};
/**
 * This method gets Group 5 Labs Label
 */
PrenatalLabComponent.prototype.getLabsGroup5Label = function() {
    return this.labsGroup5Label;
};
/**
 * This method sets Optional Labs Label
 * @Param {Optional Labs Label}
 */
PrenatalLabComponent.prototype.setOptionalLabLabel = function(labsOptionalLabel) {
    this.labsOptionalLabel = labsOptionalLabel;
};
/**
 * This method gets Optional Labs Label
 */
PrenatalLabComponent.prototype.getOptionalLabLabel = function() {
    return this.labsOptionalLabel;
};

/**
 * This method checks for empty or undefined string
 */
PrenatalLabComponent.prototype.isValidString = function(inputString) {
    if (!inputString) {
        return false;
    }
    return true;
};

/**
 * Loading Filter Mappings
 */
PrenatalLabComponent.prototype.loadFilterMappings = function() {
    var component = this;

    function addPrenataLabsFilterMap(filterName, functionName, type, field) {
        component.addFilterMappingObject(filterName, {
            setFunction: functionName,
            type: type,
            field: field
        });
    }

    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_INITIAL", this.setLabsInitial, "DEFAULT_FILTER", "ALL");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GROUP1", this.setLabsGroup1, "DEFAULT_FILTER", "ALL");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP1_ST_WK", this.setLabsGroup1StartWeek, "NUMBER", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP1_EN_WK", this.setLabsGroup1EndWeek, "NUMBER", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GROUP2", this.setLabsGroup2, "DEFAULT_FILTER", "ALL");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP2_ST_WK", this.setLabsGroup2StartWeek, "NUMBER", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP2_EN_WK", this.setLabsGroup2EndWeek, "NUMBER", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GROUP3", this.setLabsGroup3, "DEFAULT_FILTER", "ALL");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP3_ST_WK", this.setLabsGroup3StartWeek, "NUMBER", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP3_EN_WK", this.setLabsGroup3EndWeek, "NUMBER", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GROUP4", this.setLabsGroup4, "DEFAULT_FILTER", "ALL");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP4_ST_WK", this.setLabsGroup4StartWeek, "NUMBER", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP4_EN_WK", this.setLabsGroup4EndWeek, "NUMBER", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GROUP5", this.setLabsGroup5, "DEFAULT_FILTER", "ALL");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP5_ST_WK", this.setLabsGroup5StartWeek, "NUMBER", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP5_EN_WK", this.setLabsGroup5EndWeek, "NUMBER", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_OPTIONAL", this.setOptionalLab, "DEFAULT_FILTER", "ALL");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_INIT_SEQ", this.setInitialSeq, "DEFAULT_FILTER", "ALL");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_INIT_COLL", this.setInitialCollapseBool, "Boolean", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP1_SEQ", this.setLabsGroup1Seq, "DEFAULT_FILTER", "ALL");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP1_COLL", this.setLabsGroup1CollapseBool, "Boolean", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP2_SEQ", this.setLabsGroup2Seq, "DEFAULT_FILTER", "ALL");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP2_COLL", this.setLabsGroup2CollapseBool, "Boolean", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP3_SEQ", this.setLabsGroup3Seq, "DEFAULT_FILTER", "ALL");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP3_COLL", this.setLabsGroup3CollapseBool, "Boolean", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP4_SEQ", this.setLabsGroup4Seq, "DEFAULT_FILTER", "ALL");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP4_COLL", this.setLabsGroup4CollapseBool, "Boolean", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP5_SEQ", this.setLabsGroup5Seq, "DEFAULT_FILTER", "ALL");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP5_COLL", this.setLabsGroup5CollapseBool, "Boolean", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_OPT_SEQ", this.setOptionalLabSeq, "DEFAULT_FILTER", "ALL");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_OPT_COLL", this.setOptionalLabCollapseBool, "Boolean", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_INIT_LABEL", this.setInitialLabel, "String", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP1_LABEL", this.setLabsGroup1Label, "String", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP2_LABEL", this.setLabsGroup2Label, "String", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP3_LABEL", this.setLabsGroup3Label, "String", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP4_LABEL", this.setLabsGroup4Label, "String", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_GRP5_LABEL", this.setLabsGroup5Label, "String", "FREETEXT_DESC");
    addPrenataLabsFilterMap("WF_PREG_PREN_LABS_OPT_LABEL", this.setOptionalLabLabel, "String", "FREETEXT_DESC");
};

/**
 *  Retrieve the shared resources.
 */
PrenatalLabComponent.prototype.RetrieveRequiredResources = function() {
    // Check to see if the pregnancyInfo object is available to use
    var pregInfoSR = MP_Resources.getSharedResource("pregnancyInfo");
    if (pregInfoSR && pregInfoSR.isResourceAvailable()) {
        this.retrieveComponentData();
    } else {
        // This component already listens for the pregnancyInfoAvailable event,
        // so it will load when the SharedResource is available.
        PREGNANCY_BASE_UTIL_O1.LoadPregnancyData(this.getCriterion());
    }
};

/**
 * This method checks if the lab is in the desired range considering initial and optional group also.
 *
 * @param groupIndex {Integer} - lab group index
 *
 * @param labData {Object} - lab data object which contains lab result
 * 
 * @param ega {Integer} - Gestational Age when a lab is ordered/result documented
 */
PrenatalLabComponent.prototype.isLabValid = function(groupIndex, labData, ega) {
    var actualEgaIndex = -1;

    if(groupIndex === 6) {
        return true;
    }

    //Verify whether a saved lab result is in the desired lab group range based on index.
    for(var key in this.labGroupIds) {
        if (this.labGroupIds.hasOwnProperty(key)) {
            startWeek = parseInt(this.getStartWeek(this.labGroupIds[key]), 10);
            endWeek = parseInt(this.getEndWeek(this.labGroupIds[key]), 10);

            //Check whether a lab belongs to desired lab range mapped in bedrock.
            if(ega >= startWeek && ega <= endWeek) {
                actualEgaIndex = this.labGroupIndex[this.labGroupIds[key]];
            }
        }
    }

    //If the current lab index (group index) matches the range of EGA return true.
    if (groupIndex === actualEgaIndex) {
        return true;
    }
    else if(actualEgaIndex > 0 && actualEgaIndex < 6) {
        //If the lab matches for any other range, check whether that lab mapped in bedrock for that range.
        //If so, return false for current lab range.
        if(this.isInGroup(actualEgaIndex, this.labBinds, labData.EVENT_SET_CD)) {
            return false;
        }
    }

    //Return true - If the lab doesn't exists in any group or doesn't match EGA range and mapped in INITIAL lab.
    if(groupIndex === 0) {
        return true;
    }

    return false;
};

/**
 * This method checks if the lab is in the desired range as its EGA for that particular group.
 *
 * @param index {Integer} - lab group index
 * 
 * @param labs {Object} - object containing all the results of a lab
 *
 * @param labData {Object} - current processing result of a lab
 */
PrenatalLabComponent.prototype.isValidRange = function(index, labs, labData) {
    //Verify a lab is saved by physician is in the desired range.
    var savedLabResult = this.savedLabData[labData.EVENT_ID];
    if(savedLabResult && savedLabResult.SAVED_DATA) {
        var savedLabIndex = this.getSavedLabDataRangeIndex(savedLabResult.SAVED_DATA);
        if(index === savedLabIndex) {
            return true;
        }
        else if(savedLabIndex >= 0 && savedLabIndex <= 6) {
        	//If the lab matches for any other range, check whether that lab mapped in bedrock for that range.
            //If so, return false for current lab range.
            if(this.isInGroup(savedLabIndex, this.labBinds, labs.EVENT_SET_CD)) {
                return false;
            }
        }
    }
    
    var ega = labData.EGA;
    if ((index === 1 && ega >= this.getLabsGroup1StartWeek() && ega <= this.getLabsGroup1EndWeek()) ||
        (index === 2 && ega >= this.getLabsGroup2StartWeek() && ega <= this.getLabsGroup2EndWeek()) ||
        (index === 3 && ega >= this.getLabsGroup3StartWeek() && ega <= this.getLabsGroup3EndWeek()) ||
        (index === 4 && ega >= this.getLabsGroup4StartWeek() && ega <= this.getLabsGroup4EndWeek()) ||
        (index === 5 && ega >= this.getLabsGroup5StartWeek() && ega <= this.getLabsGroup5EndWeek())) {
            return true;
    }

    return false;
};

/**
 * This method gets index of a saved lab that will come under the desired range of a particular group.
 *
 * @param labResult {Object} - lab data object which contains lab result
 */
PrenatalLabComponent.prototype.getSavedLabDataRangeIndex = function(labResult) {
    if(labResult) {
        var jsonObj = JSON.parse(labResult);
        var results = jsonObj.PLS_PARAMS.RESULTS;
        var startWeek = 0;
        var endWeek = 0;

        //Verify whether a declined lab result is in the desired lab group range based on groupIndex.
        for(var i = 0; i < results.length; i++) {
            var result = results[i];

            for(var key in this.labGroupIds) {
                if (this.labGroupIds.hasOwnProperty(key)) {
                    startWeek = parseInt(this.getStartWeek(this.labGroupIds[key]), 10);
                    endWeek = parseInt(this.getEndWeek(this.labGroupIds[key]), 10);
                    if(startWeek === result.Start_Week && endWeek === result.End_Week) {
                        return this.labGroupIndex[this.labGroupIds[key]];
                    }
                }
            }
        }
    }
    return -1;
};

/** 
 * Sets the declined lab result to valid or invalid based on date time of decline and lab result.
 * 
 * @param groupIndex {Integer} - lab group index
 *
 * @param declinedLabResult {Object} - declined lab object
 * 
 * @param dateTime {Date} - latest ordered or lab placed date time
 */
PrenatalLabComponent.prototype.setDeclinedLabResultStatus = function(groupIndex, declinedLabResult, dateTime) {
    var isDeclinedLabValid = false;
    var resultDate = new Date();
    var resultDateTime = null;
    var declinedDate = new Date();
    var declinedDateTime = null;
    var startWeek = 0;
    var endWeek = 0;
    var index = 0;
    
    if(declinedLabResult && declinedLabResult.SAVED_DATA) {
        //Verify whether a saved lab result is in the desired lab group range based on index.
        for(var key in this.labGroupIds) {
            if (this.labGroupIds.hasOwnProperty(key)) {
                if(index === groupIndex) {
                    startWeek = parseInt(this.getStartWeek(this.labGroupIds[key]), 10);
                    endWeek = parseInt(this.getEndWeek(this.labGroupIds[key]), 10);
                    break;
                }
                index++;
            }
        }

        var labResult = declinedLabResult.SAVED_DATA;
        var jsonObj = JSON.parse(labResult);
        var results = jsonObj.PLS_PARAMS.RESULTS;

        if(dateTime && dateTime !== "--") {
            resultDate.setISO8601(dateTime);
            resultDateTime = resultDate.getTime();
        }
        
        //Verify whether a declined lab result is in the desired lab group range based on groupIndex.
        for(var i = 0; i < results.length; i++) {
            var result = results[i];
            
            if (startWeek === result.Start_Week && endWeek === result.End_Week) {
                if(dateTime && dateTime !== "--") {
                    declinedDate = new Date(result.Date_Time);
                    declinedDateTime = declinedDate.getTime();
                    if(declinedDateTime - resultDateTime > 0) {
                        isDeclinedLabValid = true;
                    }
                }
                else {
                    isDeclinedLabValid = true;
                }
            }
        }
    }

    if(!isDeclinedLabValid) {
        declinedLabResult.isInValid["" + groupIndex] = true;
    }
    else {
        declinedLabResult.isInValid["" + groupIndex] = false;
    }
    return isDeclinedLabValid;
};

/**
 * This method returns the local Date time from the UTC string
 * @Param {UTC Date string}
 */
PrenatalLabComponent.prototype.getLocalDateTime = function(UTCDateStr) {
    var dateTime = new Date();
    dateTime.setISO8601(UTCDateStr);
    return dateTime.getTime();
};

/**
 * This method returns the date in MMM,DD YYYY string format
 * @Param {Date string}
 */
PrenatalLabComponent.prototype.getDisplayDate = function(dateString) {
    var dttmValString = "--";
    if (mp_formatter._validateFormatString(dateString)) {
        var dateObject = new Date(this.getLocalDateTime(dateString));
        //Requirment states to display in only "MMM, DD YYYY" format.
        dttmValString = dateObject.format("mediumDate");
    }
    return dttmValString;
};

/**
 * This is a helper method which processes measurement type results for Initial or
 * Optional labs
 * @Param {IoLabs(labs in Initial or optional Labs), IoMeasurements(measurments in
 * initial or optional labs), TotalLabs(total labs is used for diplaying the total values for the
 * particular lab, total labs =  lab results count of (Measurement+documents +unclassifieds)}
 */
PrenatalLabComponent.prototype.processInitialOptionalMeasurements = function(ioLabs, ioMeasurements, totalLabs) {
    var compNS = this.getStyles().getNameSpace();
    var prenatali18n = i18n.discernabu.preg_prenatal_labs_o2;
    var prenatalColClass = compNS + "-col-class";
    

    var mdttmValString = "--";
    if (this.isValidString(ioMeasurements.DTTM)) {
        mdttmValString = this.getDisplayDate(ioMeasurements.DTTM);
    }
    ioLabs.NEWDTTM = ioMeasurements.DTTM;
    ioLabs.DISPLAY_NAME = "<span class='" + prenatalColClass + "'>" + ioMeasurements.DISPLAY_NAME + "</span>";

    //Show the count of results for a lab for any type of result
    if (totalLabs > 1 && ioResults.MEASUREMENTS.length > ioResults.DOCUMENTS.length &&
        ioResults.MEASUREMENTS.length > ioResults.UNCLASSIFIEDS.length) {
        //Adding the count to display name
        ioLabs.TOTAL_RESULTS = "<span class='" + prenatalColClass + "'><span class='" + compNS + "-table-count'>" +
        ioResults.MEASUREMENTS.length + "</span></span>";
    }

    //Check if the result is critical/normal amd modification, if it is then, add css class for criticality and mnodification indicators
    ioLabs.STATUS =
        this.processResultIndicator(ioMeasurements.RESULT, ioMeasurements.NORMALCY, ioMeasurements.MODIFIED_IND, "table", ioMeasurements.EVENT_ID);
    ioLabs.RESULT = "<span class='" + prenatalColClass + "'>" + prenatali18n.COMPLETE + "</span>";
    ioLabs.DTTM = "<span class='" + prenatalColClass + "'>" + mdttmValString + "</span>";

    //Check for EGA and set the value
    if (ioMeasurements.EGA == "--") {
        ioLabs.EGA_DISPLAY = "<span class='" + prenatalColClass + "'>" + ioMeasurements.EGA + "</span>";
    } else {
        ioLabs.EGA_DISPLAY = "<span class='" + prenatalColClass + "'>" + ioMeasurements.EGA + prenatali18n.WEEKS +
            " " + ioMeasurements.EGA_DAYS + prenatali18n.DAYS + "</span>";
    }
    return (ioLabs);
};

/**
 * This is a helper method which processes document type results for Initial or
 * Optional labs
 * @Param {Labs, IoDocuments, TotalLabs}
 */
PrenatalLabComponent.prototype.processInitialOptionalDocuments = function(ioLabs, ioDocuments, totalLabs) {

    var compNS = this.getStyles().getNameSpace();
    var prenatali18n = i18n.discernabu.preg_prenatal_labs_o2;
    var prenatalColClass = compNS + "-col-class";

    var ddttmValString = "--";
    if (this.isValidString(ioDocuments.EFFECTIVE_DATE)) {
        ddttmValString = this.getDisplayDate(ioDocuments.EFFECTIVE_DATE);
    }
    ioLabs.NEWDTTM = ioDocuments.EFFECTIVE_DATE;
    ioLabs.DISPLAY_NAME = "<span class='" + prenatalColClass + "'>" + ioDocuments.DISPLAY_NAME + "</span>";

    //Show the count of results for a lab for any type of result
    if (totalLabs > 1 &&
        ioResults.DOCUMENTS.length > ioResults.MEASUREMENTS.length &&
        ioResults.DOCUMENTS.length > ioResults.UNCLASSIFIEDS.length) {
        //Adding the count to display name
        ioLabs.TOTAL_RESULTS = "<span class='" + prenatalColClass + "'><span class='" + compNS + "-table-count'>" +
            ioResults.DOCUMENTS.length + "</span></span>";
    }
    ioLabs.STATUS = "<span class='" + prenatalColClass + "'>" + "<span class='" + compNS + "-document-pic'> </span>" + "</span>";
    ioLabs.RESULT = "<span class='" + prenatalColClass + "'>" + prenatali18n.COMPLETE + "</span>";
    ioLabs.DTTM = "<span class='" + prenatalColClass + "'>" + ddttmValString + "</span>";

    //Check for EGA and set the value
    if (ioDocuments.EGA == "--") {
        ioLabs.EGA_DISPLAY = "<span class='" + prenatalColClass + "'>" + ioDocuments.EGA + "</span>";
    } else {
        ioLabs.EGA_DISPLAY = "<span class='" + prenatalColClass + "'>" + ioDocuments.EGA + prenatali18n.WEEKS +
            " " + ioDocuments.EGA_DAYS + prenatali18n.DAYS + "</span>";
    }
    return ioLabs;

};

/**
 * This is a helper method which processes Unclassified type results for Initial or
 * Optional labs
 * @Param {Labs, IoUnclassifieds, TotalLabs}
 */
PrenatalLabComponent.prototype.processInitialOptionalUnclassified = function(ioLabs, ioUnclassifieds, totalLabs) {

    var compNS = this.getStyles().getNameSpace();
    var prenatali18n = i18n.discernabu.preg_prenatal_labs_o2;
    var prenatalColClass = compNS + "-col-class";
    var udttmValString = "--";
    if (this.isValidString(ioUnclassifieds.EFFECTIVE_DATE)) {
        udttmValString = this.getDisplayDate(ioUnclassifieds.EFFECTIVE_DATE);
    }
    ioLabs.NEWDTTM = ioUnclassifieds.EFFECTIVE_DATE;
    ioLabs.DISPLAY_NAME = "<span class='" + prenatalColClass + "'>" + ioUnclassifieds.DISPLAY_NAME + "</span>";

    //Show the count of results for a lab for any type of result
    if (totalLabs > 1 &&
        ioResults.UNCLASSIFIEDS.length > ioResults.MEASUREMENTS.length &&
        ioResults.UNCLASSIFIEDS.length > ioResults.DOCUMENTS.length) {
        //Adding the count to display name
        ioLabs.TOTAL_RESULTS = "<span class='" + prenatalColClass + "'><span class='" + compNS + "-table-count'>" + ioResults.UNCLASSIFIEDS.length +
            "</span></span>";
    }

    //Check if the result is critical/normal amd modification, if it is then, add css class for criticality and mnodification indicators
    ioLabs.STATUS = this.processResultIndicator(ioUnclassifieds.EVENT_TAG, ioUnclassifieds.NORMALCY_CD_MEAN, ioUnclassifieds.MODIFIED_IND, "table", ioUnclassifieds.EVENT_ID);
    ioLabs.RESULT = "<span class='" + prenatalColClass + "'>" + prenatali18n.COMPLETE + "</span>";
    ioLabs.DTTM = "<span class='" + prenatalColClass + "'>" + udttmValString + "</span>";

    //Check for EGA and set the value
    if (ioUnclassifieds.EGA === "--") {
        ioLabs.EGA_DISPLAY = "<span class='" + prenatalColClass + "'>" + ioUnclassifieds.EGA + "</span>";
    } else {
        ioLabs.EGA_DISPLAY = "<span class='" + prenatalColClass + "'>" + ioUnclassifieds.EGA +
            prenatali18n.WEEKS + " " + ioUnclassifieds.EGA_DAYS + prenatali18n.DAYS + "</span>";
    }
    return ioLabs;
};

/**
 * This method process the results for Initial and Optional Labs so that they could be rendered.
 * This method internally calls helper methods for processing Measurments, Unclassified and Document
 * type results.
 *
 * @Param {IoLabs = labs for initial or optional labs, 
 * groupIndex checks if the input is initial lab group or optional lab group}
 */
PrenatalLabComponent.prototype.processResultsForInitialOptionalLabs = function(ioLabs, groupIndex) {
    var component = this;
    var compNS = this.getStyles().getNameSpace();
    var prenatali18n = i18n.discernabu.preg_prenatal_labs_o2;
    var prenatalColClass = compNS + "-col-class";

    //Declaring index, length, result variables for lab result processing
    var ioResultIndex = 0;
    var ioResultLength = ioLabs.RESULTS.length;
    var ioDocumentstIndex = 0;
    var ioMeasurementIndex = 0;
    var ioUnclassifiedsIndex = 0;
    var expectedIndex = 0;
    var measurementsLength = 0;
    var documentsLength = 0;
    var unclassifiedsLength = 0;
    var declinedLabResult = null;
    var resultFound = false;
    var highestEgaResultDate = null;

    //set the display
    ioLabs.DISPLAY_NAME = "<span class='" + prenatalColClass + "'><span class = '" + compNS + "-table-dispName'>" + ioLabs.EVENT_SET_DISPLAY + "</span></span>";

    //Get declined lab result and its status
    declinedLabResult = this.declinedLabData[ioLabs.EVENT_SET_CD];
    var ensureLabDeclinedStatus = function labDeclinedStatus(resultDateTime, resultStatus) {
        //Check whether the lab is declined.
        if(declinedLabResult && component.setDeclinedLabResultStatus(groupIndex, declinedLabResult, resultDateTime)) {
            //If a lab is declined, show declined message.
            component.setDeclinedLabData(ioLabs, resultStatus);
            resultFound = true;
        }
    };

    //If the Complete Status == 1 (incomplete/ordered but not yet charted)
    if (ioLabs.COMPLETE_STATUS_IND == this.INCOMPLETE) {
        var orderedDate = new Date();
        orderedDate.setISO8601(ioLabs.COMPLETED_ORDER_DATA[0].UPDATED_DATE);
        var orderedLabEgaWeek = Math.floor(this.getEgaAge(this.currentGestAge, orderedDate) / 7);

        if(this.isLabValid(groupIndex, ioLabs, orderedLabEgaWeek)) {
            ioLabs = this.setIncompleteLabs(ioLabs);
            highestEgaResultDate = ioLabs.COMPLETED_ORDER_DATA[0].UPDATED_DATE;
        }
        else {
            ioLabs.COMPLETE_STATUS_IND = 0;
        }
    }

    //Verify all the measurements documents and unclassified and show the lab result which is
    //in desired for initial or optional labs based in lab index
    for(ioResultIndex = 0; ioResultIndex < ioResultLength && !resultFound; ioResultIndex++) {
        // Here, since the labs are sorted from CCL script(most recent first) ,
        // and we want to place the first result taken to be displayed on the Initial Labs section for a lab,
        // the lab is being checked if its in Initial group or optional group, and the last result(length -1)
        // is displayed directly to initial Labs group date Or in case of optional labs the latest lab date value.
        // If a lab is saved for initial or optional which is latest, then consider latest value.
        ioResults = ioLabs.RESULTS[ioResultIndex];
        var minimumEGA = 0;
        var totalLabs = 1;

        measurementsLength = ioResults.MEASUREMENTS.length;
        //First check for measurements
        if (measurementsLength > 0) {
            totalLabs = totalLabs + measurementsLength;
            for(ioMeasurementIndex = 0; ioMeasurementIndex < measurementsLength && !resultFound; ioMeasurementIndex++) {
                var ioMeasurements = ioResults.MEASUREMENTS[ioMeasurementIndex];
                if(this.isValidRange(groupIndex, ioLabs, ioMeasurements)) {
                    //Process the results for rendering
                    ioLabs = this.processInitialOptionalMeasurements(ioLabs, ioMeasurements, totalLabs);
                    highestEgaResultDate = ioLabs.NEWDTTM;
                    resultFound = true;
                 }
                 else {
                     //Result is not saved manually and process for actual initial & optional lab results
                     expectedIndex = groupIndex === 0 ? measurementsLength - 1 : 0;
                     if (ioMeasurementIndex === expectedIndex && ioMeasurements.EGA > minimumEGA) {
                         //Process the results for rendering
                         ioLabs = this.processInitialOptionalMeasurements(ioLabs, ioMeasurements, totalLabs);
                         minimumEGA = ioMeasurements.EGA;
                         highestEgaResultDate = ioLabs.NEWDTTM;
                         resultFound = true;
                     }
                 }
             }
        }

        documentsLength = ioResults.DOCUMENTS.length;
        // Check for document type result
        if (documentsLength > 0) {
            totalLabs = totalLabs + ioResults.DOCUMENTS.length;
            for(ioDocumentstIndex = 0; ioDocumentstIndex < documentsLength && !resultFound; ioDocumentstIndex++) {
                var ioDocuments = ioResults.DOCUMENTS[ioDocumentstIndex];
                if(this.isValidRange(groupIndex, ioLabs, ioDocuments)) {
                    //Process the results for rendering
                    ioLabs = this.processInitialOptionalDocuments(ioLabs, ioDocuments, totalLabs);
                    highestEgaResultDate = ioLabs.NEWDTTM;
                    resultFound = true;
                }
                else {
                    //Result is not saved manually and process for actual initial & optional lab results
                    expectedIndex = groupIndex === 0 ? documentsLength - 1 : 0;
                    if (ioDocumentstIndex === expectedIndex && ioDocuments.EGA > minimumEGA) {
                        //Process the results for rendering
                        ioLabs = this.processInitialOptionalDocuments(ioLabs, ioDocuments, totalLabs);
                        minimumEGA = ioDocuments.EGA;
                        highestEgaResultDate = ioLabs.NEWDTTM;
                        resultFound = true;
                    }
                }
            }
        }

        unclassifiedsLength = ioResults.UNCLASSIFIEDS.length;
        //Check for unclassified result
        if (unclassifiedsLength > 0) {
            totalLabs = totalLabs + ioResults.UNCLASSIFIEDS.length;
            for(ioUnclassifiedsIndex = 0; ioUnclassifiedsIndex < unclassifiedsLength && !resultFound; ioUnclassifiedsIndex++) {
                var ioUnclassifieds = ioResults.UNCLASSIFIEDS[ioUnclassifiedsIndex];
                if(this.isValidRange(groupIndex, ioLabs, ioUnclassifieds)) {
                    //Process the results for rendering
                    ioLabs = this.processInitialOptionalUnclassified(ioLabs, ioUnclassifieds, totalLabs);
                    highestEgaResultDate = ioLabs.NEWDTTM;
                    resultFound = true;
                }
                else {
                    //Result is not saved manually and process for actual initial & optional lab results
                    expectedIndex = groupIndex === 0 ? unclassifiedsLength - 1 : 0;
                    if (ioUnclassifiedsIndex === expectedIndex && ioUnclassifieds.EGA > minimumEGA) {
                        //Process the results for rendering
                        ioLabs = this.processInitialOptionalUnclassified(ioLabs, ioUnclassifieds, totalLabs);
                        minimumEGA = ioUnclassifieds.EGA;
                        highestEgaResultDate = ioLabs.NEWDTTM;
                        resultFound = true;
                    }
                }
            }
        }
        ioLabs.RESULTS[ioResultIndex] = ioResults;
        ioLabs.RESULTS.ORDERED = false;
    }

    ensureLabDeclinedStatus(highestEgaResultDate, prenatali18n.COMPLETE);
    if (ioResultLength === 0 && !resultFound) {
        //No data to be displayed
        ioLabs.RESULTS[0] = [];
        ioLabs = this.notOrderedMeasurments(ioLabs);
        ioLabs = this.notOrderedDocuments(ioLabs);
        ioLabs = this.notOrderedUnclassifieds(ioLabs);
        ioLabs.RESULTS.ORDERED = true;

        //Check whether the lab is declined. If declined, show declined message.
        if(declinedLabResult && declinedLabResult.SAVED_DATA && !declinedLabResult.isInValid["" + groupIndex]) {
            this.setDeclinedLabData(ioLabs, prenatali18n.NOT_ORDERED_FOR_RANGE);
        }
    }
    return ioLabs;
};

/**
 * This method process the results for Labs in the groups 1- 5 so that they could be rendered.
 *
 * @Param {Labs = labs for group 1 - 5
 * group Index checks to which group the input belongs to group}
 */
PrenatalLabComponent.prototype.processResultsForGroupLabs = function(labs, groupIndex) {
    var component = this;
    var compNS = this.getStyles().getNameSpace();
    var prenatali18n = i18n.discernabu.preg_prenatal_labs_o2;
    var prenatalColClass = compNS + "-col-class";

    var dttmValueString = "--";
    var resultIndex = 0;
    var measurementIndex = 0;
    var declinedDataInfo = "";
    var declinedLabResult = null;
    var isLabDeclined = false;
    var highestEgaResultDate = null;
    
    //Get declined lab result and its status
    declinedLabResult = this.declinedLabData[labs.EVENT_SET_CD];
    var ensureLabDeclinedStatus = function labDeclinedStatus(resultDateTime, resultStatus) {
        //Check whether the lab is declined.
        if(declinedLabResult && component.setDeclinedLabResultStatus(groupIndex, declinedLabResult, resultDateTime)) {
            //If a lab is declined, show declined message.
            component.setDeclinedLabData(labs, resultStatus);
            isLabDeclined = true;
        }
    };
    
    labs.DISPLAY_NAME = "<span class='" + prenatalColClass + "'></span><span class = '" + compNS + "-table-dispName'>" + labs.EVENT_SET_DISPLAY + "</span></span>";

    if (labs.EVENT_SET_DISPLAY !== this.INVALID_INPUT && labs.EVENT_SET_DISPLAY !== this.OVERLAPPED_INPUT) {
        // Complete Status = 1 is set in CCL script, 
        // which means, the lab is ordered by not yet charted
        if (labs.COMPLETE_STATUS_IND == this.INCOMPLETE) {
            var orderedDate = new Date();
            orderedDate.setISO8601(labs.COMPLETED_ORDER_DATA[0].UPDATED_DATE);
            var orderedLabEgaWeek = Math.floor(this.getEgaAge(this.currentGestAge, orderedDate) / 7);

            if(this.isLabValid(groupIndex, labs, orderedLabEgaWeek)) {
                labs = this.setIncompleteLabs(labs);
                highestEgaResultDate = labs.COMPLETED_ORDER_DATA[0].UPDATED_DATE;
            }
            else {
                labs.COMPLETE_STATUS_IND = 0;
            }
        }

        // Display the first Measurement of the Lab
        var resultLength = labs.RESULTS.length;
        var resultedEvents = 1;
        if (resultLength > 0) {
            for (resultIndex = 0; resultIndex < resultLength; resultIndex++) {
                var results = labs.RESULTS[resultIndex];
                var measureLength = results.MEASUREMENTS.length;
                var docLength = results.DOCUMENTS.length;
                var uclsLength = results.UNCLASSIFIEDS.length;
                var notOrderedFlag = false;
                var highestEGA = 0;
                for (measurementIndex = 0; measurementIndex < measureLength; measurementIndex++) {
                    var measurements = results.MEASUREMENTS[measurementIndex];
                    labs.DISPLAY_NAME = "<span class='" + prenatalColClass + "'></span><span class = '" + compNS + "-table-dispName'>" + measurements.DISPLAY_NAME + "</span></span>";
                    //Adding the count to display name
                    if (resultedEvents > 0) {
                        labs.TOTAL_RESULTS = "<span class='" + prenatalColClass + "'><span class='" + compNS + "-table-count'>" +
                            resultedEvents + "</span></span>";
                    }

                    //For Custom groups, we need to check if the lab fall into a particular range for every group to be displayed onto the main table.
                    if (this.isValidRange(groupIndex, labs, measurements)) {
                        //in a result there can be measurment documents and unclassified data
                        // we need to show the result value which has the highest EGA for that group
                        // between all types of data
                        if (measurements.EGA > highestEGA) {
                            if (this.isValidString(measurements.DTTM)) {
                                dttmValueString = this.getDisplayDate(measurements.DTTM);
                            }
                            labs.NEWDTTM = measurements.DTTM;
                            highestEgaResultDate = labs.NEWDTTM;

                            //Check if the result is critical/normal amd modification, if it is then, add css class for criticality and mnodification indicators
                            labs.STATUS = this.processResultIndicator(measurements.RESULT, measurements.NORMALCY, measurements.MODIFIED_IND, "table", measurements.EVENT_ID);
                            labs.DTTM = "<span class='" + prenatalColClass + "'>" + dttmValueString + "</span>";
                            labs.EGA_DISPLAY = "<span class='" + prenatalColClass + "'>" + measurements.EGA + prenatali18n.WEEKS + " " +
                                measurements.EGA_DAYS + prenatali18n.DAYS + "</span>";
                            labs.RESULT = "<span class='" + prenatalColClass + "'>" + prenatali18n.COMPLETE + "</span>";

                            notOrderedFlag = true;
                            highestEGA = measurements.EGA;
                        }

                    } else {
                        if (notOrderedFlag === false) {
                            //Not Ordered
                            labs = this.setNotOrdered(groupIndex, labs);
                        }
                    }
                    resultedEvents++;
                    results.MEASUREMENTS[measurementIndex] = measurements;
                }
                //All Unclassified results
                for (var uIndex = 0; uIndex < uclsLength; uIndex++) {
                    var unclassifieds = results.UNCLASSIFIEDS[uIndex];
                    labs.DISPLAY_NAME = "<span class='" + prenatalColClass + "'><span class='" + compNS +
                        "-table-count'></span><span class = '" + compNS + "-table-dispName'>" + unclassifieds.DISPLAY_NAME + "</span></span>";
                    //Adding the count to display name
                    if (resultedEvents > 0) {
                        labs.TOTAL_RESULTS = "<span class='" + prenatalColClass + "'><span class='" + compNS + "-table-count'>" +
                            resultedEvents + "</span></span>";
                    }

                    //For Custom groups, we need to check if the lab fall into a particular range for every group to be displayed onto the main table.
                    if (this.isValidRange(groupIndex, labs, unclassifieds)) {
                        //in a result there can be measurment documents and unclassified data
                        // we need to show the result value which has the highest EGA for that group
                        // between all types of data
                        if (unclassifieds.EGA > highestEGA) {
                            if (this.isValidString(unclassifieds.EFFECTIVE_DATE)) {
                                dttmValueString = this.getDisplayDate(unclassifieds.EFFECTIVE_DATE);
                            }
                            labs.NEWDTTM = unclassifieds.EFFECTIVE_DATE;
                            highestEgaResultDate = labs.NEWDTTM;
                            
                            //Check if the result is critical/normal amd modification, if it is then, add css class for criticality and mnodification indicators
                            labs.STATUS = this.processResultIndicator(unclassifieds.EVENT_TAG, unclassifieds.NORMALCY_CD_MEAN, unclassifieds.MODIFIED_IND, "table", unclassifieds.EVENT_ID);
                            labs.RESULT = "<span class='" + prenatalColClass + "'>" + prenatali18n.COMPLETE + "</span>";
                            labs.DTTM = "<span class='" + prenatalColClass + "'>" + dttmValueString + "</span>";
                            labs.EGA_DISPLAY = "<span class='" + prenatalColClass + "'>" + unclassifieds.EGA + prenatali18n.WEEKS + " " +
                                unclassifieds.EGA_DAYS + prenatali18n.DAYS + "</span>";

                            notOrderedFlag = true;
                            highestEGA = unclassifieds.EGA;
                        }
                    } else {
                        if (notOrderedFlag === false) {
                            //Not Ordered
                            labs = this.setNotOrdered(groupIndex, labs);
                        }
                    }
                    resultedEvents++;
                    results.UNCLASSIFIEDS[uIndex] = unclassifieds;
                }
                //All document type results
                for (var docIndex = 0; docIndex < docLength; docIndex++) {
                    var documents = results.DOCUMENTS[docIndex];
                    labs.DISPLAY_NAME = "<span class='" + prenatalColClass + "'><span class = '" + compNS + "-table-dispName'>" + documents.DISPLAY_NAME + "</span></span>";
                    //Adding the count to display name
                    if (resultedEvents > 0) {
                        labs.TOTAL_RESULTS = "<span class='" + prenatalColClass + "'><span class='" + compNS +"-table-count'>" + resultedEvents + "</span></span>";
                    }

                    //For Custom groups, we need to check if the lab fall into a particular range for every group to be displayed onto the main table.
                    if (this.isValidRange(groupIndex, labs, documents)) {
                        //in a result there can be measurment documents and unclassified data
                        // we need to show the result value which has the highest EGA for that group
                        // between all types of data
                        if (documents.EGA > highestEGA) {
                            if (this.isValidString(documents.EFFECTIVE_DATE)) {
                                dttmValueString = this.getDisplayDate(documents.EFFECTIVE_DATE);
                            }
                            labs.NEWDTTM = documents.EFFECTIVE_DATE;
                            highestEgaResultDate = labs.NEWDTTM;

                            labs.STATUS = "<span class='" + prenatalColClass + " " + compNS + "-status-col'><span class='prenatal-labs-document-pic'> </span></span>";
                            labs.RESULT = "<span class='" + prenatalColClass + "'>" + prenatali18n.COMPLETE + "</span>";
                            labs.DTTM = "<span class='" + prenatalColClass + "'>" + dttmValueString + "</span>";
                            labs.EGA_DISPLAY = "<span class='" + prenatalColClass + "'>" + documents.EGA +
                                prenatali18n.WEEKS + " " + documents.EGA_DAYS + prenatali18n.DAYS + "</span>";

                            notOrderedFlag = true;
                            highestEGA = documents.EGA;
                        }

                    } else {
                        if (notOrderedFlag === false) {
                            //Not ordered
                            labs = this.setNotOrdered(groupIndex, labs);
                        }
                    }
                    resultedEvents++;
                    results.DOCUMENTS[docIndex] = documents;
                }
                labs.RESULTS[resultIndex] = results;
            }
            labs.RESULTS.ORDERED = false;
            ensureLabDeclinedStatus(highestEgaResultDate, prenatali18n.COMPLETE);
        }
        else {
            //No data to be displayed
            labs.RESULTS[0] = [];
            labs = this.notOrderedMeasurments(labs);
            labs = this.notOrderedDocuments(labs);
            labs = this.notOrderedUnclassifieds(labs);
            labs.RESULTS.ORDERED = true;

            //Check whether the lab is declined. If declined, show declined message.
            if(declinedLabResult && declinedLabResult.SAVED_DATA) {
                this.setDeclinedLabResultStatus(groupIndex, declinedLabResult, "");
                if(!declinedLabResult.isInValid["" + groupIndex]) {
                    this.setDeclinedLabData(labs, prenatali18n.NOT_ORDERED_FOR_RANGE);
                }
            }
        }
    }
    return labs;
};

/**
 * Create BindData for rendering it to table.
 * This method first checks which group a lab is in.
 * Then checks if data is Measurments/Documents/Unclassified.
 * Creates the data that is rendered onto the main table.
 * if the data is "Not Ordered","Ordered" then dispaly the proper status and values onto the main table.
 * Also, This method creates some fields which are originally not in the records structure so as to show them on the table.
 *
 * This Method first iterates over all the groups.
 * Then checks if they fall in either {Initial/Optional} or {Group1-5}
 * Then Check what type of result the lab has {Measurments/Document/Unclassified}
 *
 * Sets the display elements according to the fields in respective result.
 * @param {bindData}
 */
PrenatalLabComponent.prototype.processResultsForRender = function(bindData) {

    var compNS = this.getStyles().getNameSpace();
    var prenatali18n = i18n.discernabu.preg_prenatal_labs_o2;
    var prenatalColClass = compNS + "-col-class";
    try {
        var bindLength = bindData.length;
        //Iterate through all the data from bind variable
        for (var bIndex = 0; bIndex < bindLength; bIndex++) {
            var labsLength = 0;
            var records = bindData[bIndex];
            labsLength = records.LABS.length;
            //Means Initial or Optional(values of bindData areset in render component function)
            if (bIndex === 0 || bIndex === 6) {
                if (labsLength > 0) {
                    for (var ioLabIndex = 0; ioLabIndex < labsLength; ioLabIndex++) {
                        var ioLabs = records.LABS[ioLabIndex];
                        //process the results for rendering
                        ioLabs = this.processResultsForInitialOptionalLabs(ioLabs, bIndex);
                        bindData[bIndex].LABS[ioLabIndex] = ioLabs;
                    } // end for(var labIndex = 0)
                }
            } // end if (bIndex == 0 || bIndex == 4)
            //For all custom groups
            if (bIndex >= 1 && bIndex <= 5) {
                if (labsLength > 0) {
                    for (var labIndex = 0; labIndex < labsLength; labIndex++) {
                        var labs = bindData[bIndex].LABS[labIndex];
                        //process the results for rendering
                        labs = this.processResultsForGroupLabs(labs, bIndex);
                        bindData[bIndex].LABS[labIndex] = labs;
                    } // end for ( labIndex )
                }
            }
        }
    } catch (err) {
        MP_Util.LogJSError(err, this, "preg-prenatal-labs-o2.js", "processResultsForRender");
    }
};

/**
 * This method creates the display elements for incomplete labs.
 * Incomplete Labs = ordere have been done but not yet documented.
 * Gets the data from the labs and bind those back
 * @param {Labs}
 */
PrenatalLabComponent.prototype.setIncompleteLabs = function(labs) {
    var compNS = this.getStyles().getNameSpace();
    var prenatali18n = i18n.discernabu.preg_prenatal_labs_o2;
    var prenatalColClass = compNS + "-col-class";

    labs.STATUS = "<span class='" + prenatalColClass + "'>" + prenatali18n.ORDERED + "</span>";
    labs.DTTM = "<span class='" + prenatalColClass + "'>" + "--" + "</span>";
    labs.EGA_DISPLAY = "<span class='" + prenatalColClass + "'>" + "--" + "</span>";
    return labs;
};

/**
 * This method creates the display elements for Not Ordered Measurement results
 * Gets the data from the labs and bind those back.
 * 
 * @param groupIndex {Integer} - lab group index
 * 
 * @param labs {Object} - ab data object which contains lab result
 */
PrenatalLabComponent.prototype.setNotOrdered = function(groupIndex, labs) {
    var compNS = this.getStyles().getNameSpace();
    var prenatali18n = i18n.discernabu.preg_prenatal_labs_o2;
    var prenatalColClass = compNS + "-col-class";
    var outsideRangeIndClass = "prenatal-labs-result-indicator";
    var emptyResultVal = "--";
    
    //Check whether the lab is declined. If declined, show declined message.
    var declinedLabResult = this.declinedLabData[labs.EVENT_SET_CD];
    if(declinedLabResult && declinedLabResult.SAVED_DATA) {
        this.setDeclinedLabResultStatus(groupIndex, declinedLabResult, "");
        if(!declinedLabResult.isInValid["" + groupIndex]) {
            return this.setDeclinedLabData(labs, prenatali18n.NOT_ORDERED_FOR_RANGE);
        }
    }

    labs.DTTM = "<span class='" + prenatalColClass + "'>" + emptyResultVal + "</span>";
    labs.EGA_DISPLAY = "<span class='" + prenatalColClass + "'>" + emptyResultVal + "</span>";
    labs.STATUS = "<div class='" + outsideRangeIndClass + "'>" + "</div>";
    labs.RESULT = "<span class='" + prenatalColClass + "'>" + prenatali18n.NOT_ORDERED_FOR_RANGE + "</span>";
    return labs;
};

/**
 * Check whether the lab is declined. If a lab is declined, set declined message for a lab.
 * 
 * @param labs {Object} - lab data object which contains the lab result
 * 
 * @param resultStaus {String} - Status information of a result indicates whether it is completed
 * 		not ordered, not ordered for this range, not excepted for this range, etc.
 */
PrenatalLabComponent.prototype.setDeclinedLabData = function(labs, resultStaus) {
    var compNS = this.getStyles().getNameSpace();
    var prenatali18n = i18n.discernabu.preg_prenatal_labs_o2;
    var prenatalColClass = compNS + "-col-class";
    var emptyResultVal = "";

    //Set the display elements
    labs.DTTM = "<span class='" + prenatalColClass + "'>" + emptyResultVal + "</span>";
    labs.EGA_DISPLAY = "<span class='" + prenatalColClass + "'>" + emptyResultVal + "</span>";
    labs.EFFECTIVE_DATE = "<span class='" + prenatalColClass + "'>" + emptyResultVal + "</span>";
    labs.STATUS = "<span class='" + prenatalColClass + "'>" + prenatali18n.DECLINED + "</span>";
    labs.RESULT = "<span class='" + prenatalColClass + "'>" + prenatali18n.DECLINED + "</span>";
    labs.TOTAL_RESULTS = "<span class='" + compNS + "-table-count'></span>";

    return labs;
};

/**
 * This method creates the display elements for Not Ordered Measurement results
 * Gets the data from the labs and bind those back
 * @param {Labs}
 */
PrenatalLabComponent.prototype.notOrderedMeasurments = function(labs) {
    var compNS = this.getStyles().getNameSpace();
    var prenatali18n = i18n.discernabu.preg_prenatal_labs_o2;
    var prenatalColClass = compNS + "-col-class";

    labs.RESULTS[0].MEASUREMENTS = [];
    labs.RESULTS[0].MEASUREMENTS[0] = [];

    var no_measurement = labs.RESULTS[0].MEASUREMENTS[0];
    no_measurement.GROUP = "--";
    no_measurement.EGA = "--";
    no_measurement.DTTM = "";
    no_measurement.EVENT_ID = "";
    no_measurement.STATUS = prenatali18n.NOT_ORDERED;

    
    
    //Set the display elements
    labs.DTTM = "<span class='" + prenatalColClass + "'>" + "--" + "</span>";
    labs.EGA_DISPLAY = "<span class='" + prenatalColClass + "'>" + "--" + "</span>";
    labs.EFFECTIVE_DATE = "<span class='" + prenatalColClass + "'>" + "--" + "</span>";
    labs.STATUS = "<span class='" + prenatalColClass + "'>" + prenatali18n.NOT_ORDERED + "</span>";
    labs.RESULT = "<span class='" + prenatalColClass + "'>" + prenatali18n.NOT_ORDERED_FOR_RANGE + "</span>";
    labs.TOTAL_RESULTS = "<span class='" + compNS + "-table-count'>0 </span>";

    // Complete Status = 1 is set in CCL script, 
    // which means, the lab is ordered by not yet charted
    if (labs.COMPLETE_STATUS_IND == this.INCOMPLETE) {
        labs.STATUS = "<span class='" + prenatalColClass + "'>" + prenatali18n.ORDERED + "</span>";
        labs.RESULT = "<span class='" + prenatalColClass + "'>" + prenatali18n.ORDERED + "</span>";
        no_measurement.STATUS = prenatali18n.ORDERED;
    }
    labs.RESULTS[0].MEASUREMENTS[0] = no_measurement;
    return labs;
};

/**
 * This method creates the display elements for Not Ordered document results
 * Gets the data from the labs and bind those back
 * @param {Labs}
 */
PrenatalLabComponent.prototype.notOrderedDocuments = function(labs) {
    var compNS = this.getStyles().getNameSpace();
    var prenatali18n = i18n.discernabu.preg_prenatal_labs_o2;
    var prenatalColClass = compNS + "-col-class";

    labs.RESULTS[0].DOCUMENTS = [];
    labs.RESULTS[0].DOCUMENTS[0] = [];

    var no_documents = labs.RESULTS[0].DOCUMENTS[0];
    no_documents.GROUP = "--";
    no_documents.EGA = "--";
    no_documents.EFFECTIVE_DATE = "";
    no_documents.TITLE = prenatali18n.NOT_ORDERED;
    no_documents.EVENT_ID = "";

    labs.DTTM = "<span class='" + prenatalColClass + "'>" + "--" + "</span>";
    labs.EGA_DISPLAY = "<span class='" + prenatalColClass + "'>" + "--" + "</span>";
    labs.EFFECTIVE_DATE = "<span class='" + prenatalColClass + "'>" + "--" + "</span>";
    labs.STATUS = "<span class='" + prenatalColClass + "'>" + prenatali18n.NOT_ORDERED + "</span>";
    labs.RESULT = "<span class='" + prenatalColClass + "'>" + prenatali18n.NOT_ORDERED_FOR_RANGE + "</span>";
    labs.TOTAL_RESULTS = "<span class='" + compNS + "-table-count'>0 </span>";

    // Complete Status = 1 is set in CCL script, 
    // which means, the lab is ordered by not yet charted
    if (labs.COMPLETE_STATUS_IND == this.INCOMPLETE) {
        labs.STATUS = "<span class='" + prenatalColClass + "'>" + prenatali18n.ORDERED + "</span>";
        labs.RESULT = "<span class='" + prenatalColClass + "'>" + prenatali18n.ORDERED + "</span>"; 
        no_documents.TITLE = prenatali18n.ORDERED;
    }
    labs.RESULTS[0].DOCUMENTS[0] = no_documents;
    return labs;
};

/**
 * This method creates the display elements for Not Ordered Unclassified results
 * Gets the data from the labs and bind those back
 * @param {Labs}
 */
PrenatalLabComponent.prototype.notOrderedUnclassifieds = function(labs) {
    var compNS = this.getStyles().getNameSpace();
    var prenatali18n = i18n.discernabu.preg_prenatal_labs_o2;
    var prenatalColClass = compNS + "-col-class";

    labs.RESULTS[0].UNCLASSIFIEDS = [];
    labs.RESULTS[0].UNCLASSIFIEDS[0] = [];

    var no_unclassifieds = labs.RESULTS[0].UNCLASSIFIEDS[0];
    no_unclassifieds.GROUP = "--";
    no_unclassifieds.EGA = "--";
    no_unclassifieds.EFFECTIVE_DATE = "";
    no_unclassifieds.EVENT_TAG = prenatali18n.NOT_ORDERED;
    no_unclassifieds.EVENT_ID = "";

    labs.DTTM = "<span class='" + prenatalColClass + "'>" + "--" + "</span>";
    labs.EGA_DISPLAY = "<span class='" + prenatalColClass + "'>" + "--" + "</span>";
    labs.EFFECTIVE_DATE = "<span class='" + prenatalColClass + "'>" + "--" + "</span>";
    labs.STATUS = "<span class='" + prenatalColClass + "'>" + prenatali18n.NOT_ORDERED + "</span>";
    labs.RESULT = "<span class='" + prenatalColClass + "'>" + prenatali18n.NOT_ORDERED_FOR_RANGE + "</span>";
    labs.TOTAL_RESULTS = "<span class='" + compNS + "-table-count'>0 </span>";

    // Complete Status = 1 is set in CCL script, 
    // which means, the lab is ordered by not yet charted
    if (labs.COMPLETE_STATUS_IND == this.INCOMPLETE) {
        labs.STATUS = "<span class='" + prenatalColClass + "'>" + prenatali18n.ORDERED + "</span>";
        labs.RESULT = "<span class='" + prenatalColClass + "'>" + prenatali18n.ORDERED + "</span>"; 
        no_unclassifieds.EVENT_TAG = prenatali18n.ORDERED;
    }
    labs.RESULTS[0].UNCLASSIFIEDS[0] = no_unclassifieds;
    return labs;
};
/**
 * This method checks for the criticality, based on Normalcy and displays the correct criticality indicator
 * This method also checks for modification indicator and process the "result" for display
 * @param {Result, normalcy_code_mean, modified indicator, Sender, EventId}
 */
PrenatalLabComponent.prototype.processResultIndicator = function(result, normalcy_cd_mean, modified_ind, sender, eventId) {
    //Pull the normalcy info as well so we can determine the class
    var statusResultText = "";
    var compNS = this.getStyles().getNameSpace();
    var classToUse = "";
    var modifiedString = "";
    // check the triggering sender
    if (sender === "table") {
        classToUse = compNS + "-status-col";
    } else {
        classToUse = compNS + "-sp-hyperlink-col " + eventId;
    }
    //check if the values was modified or altered 
    // 1 == true
    if (modified_ind == this.MODIFIED) {
        //modifiedString = "<span class='" + compNS + "-delta-pic'></span>";
        modifiedString = "<span class='res-modified'>&nbsp;</span>";
    }
    //switch case for normalcy, set the status 
    switch (normalcy_cd_mean) {
        case "CRITICAL":
        case "EXTREMEHIGH":
        case "PANICHIGH":
        case "EXTREMELOW":
        case "PANICLOW":
        case "VABNORMAL":
        case "POSITIVE":
            statusResultText = "<span class='" + compNS + "-table-col " + classToUse + "'>" +
                "<span class='res-severe'><span class='res-ind'>&nbsp;</span>" + result + "</span>" + modifiedString + "</span>";
            break;
        case "HIGH":
            statusResultText = "<span class='" + compNS + "-table-col " + classToUse + "'>" +
                "<span class='res-high'><span class='res-ind'>&nbsp;</span>" + result + "</span>" + modifiedString + "</span>";
            break;
        case "LOW":
            statusResultText = "<span class='" + compNS + "-table-col " + classToUse + "'>" +
                "<span class='res-low'><span class='res-ind'>&nbsp;</span>" + result + "</span>" + modifiedString + "</span>";
            break;
        case "ABNORMAL":
            statusResultText = "<span class='" + compNS + "-table-col " + classToUse + "'>" +
                "<span class='res-abnormal'><span class='res-ind'>&nbsp;</span>" + result + "</span>" + modifiedString + "</span>";
            break;
        default:
            statusResultText = "<span class='" + compNS + "-table-col " + classToUse + "'>" +
                "<span class='res-normal'>" + result + "</span>" + modifiedString + "</span>";
            break;
    }
    return statusResultText;
};

/**
 * function to create array of Event Ids for then sending it to ccl script.
 * @Param {Data}
 */
PrenatalLabComponent.prototype.getEventIds = function(data) {
    var eventArr = [];
    if (data) {
        for (var index = 0; index < data.VALS.length; index++) {
            eventArr[index] = data.VALS[index].PE_ID;
        }
    }
    return eventArr;
};

/**
 * Retrieve the Prenatal Lab component information for rendering.
 */
PrenatalLabComponent.prototype.retrieveComponentData = function() {

    var criterion = this.getCriterion();
    var prenatali18n = i18n.discernabu.preg_prenatal_labs_o2;
    var patientGenderInfo = criterion.getPatientInfo().getSex();

    var countText = "";
    var messageHTML = "";
    var pregInfoSR = MP_Resources.getSharedResource("pregnancyInfo");
    var pregInfoObj = null;
    var pregnancyId = 0.0;
    var sendAr = [];

    // Check to make sure the patient is a female with an active pregnancy
    if (patientGenderInfo === null ||
        patientGenderInfo.meaning === null ||
        patientGenderInfo.meaning !== "FEMALE") {
        // Male patient so just show a disclaimer
        messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + prenatali18n.NOT_FEMALE +
            "</span></h3><span class='res-none'>" + prenatali18n.NOT_FEMALE + "</span>";
        this.finalizeComponent(messageHTML, countText);
        return;
    } else if (pregInfoSR && pregInfoSR.isResourceAvailable()) {
        pregInfoObj = pregInfoSR.getResourceData();
        this.pregnancyInfoObj = pregInfoObj;
        pregnancyId = pregInfoObj.getPregnancyId();

        if (pregnancyId === -1) {
            // Error occurred while retrieving pregnancy information
            messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + prenatali18n.PREG_DATA_ERROR +
                "</span></h3><span class='res-none'>" + prenatali18n.PREG_DATA_ERROR + "</span>";
            this.finalizeComponent(messageHTML, countText);
            return;
        } else if (!pregnancyId) {
            // Female patient with no active pregnancy. Show disclaimer and finalize the component.
            messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + prenatali18n.NO_ACTIVE_PREG +
                "</span></h3><span class='res-none'>" + prenatali18n.NO_ACTIVE_PREG + "</span>";
            this.finalizeComponent(messageHTML, countText);
            return;
        } else {
            try {

                var loadTimer = new RTMSTimer(this.getComponentLoadTimerName());
                var renderTimer = new RTMSTimer(this.getComponentRenderTimerName());

                //push all the values from all groups
                sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0",
                    criterion.encntr_id + ".0", criterion.ppr_cd + ".0", pregInfoObj.getLookBack());

                // Send the event ids in the row sequence order selected
                sendAr.push(MP_Util.CreateParamArray(this.getEventIds(this.getInitialSeq()), 1));
                sendAr.push(MP_Util.CreateParamArray(this.getEventIds(this.getLabsGroup1Seq()), 1));
                sendAr.push(MP_Util.CreateParamArray(this.getEventIds(this.getLabsGroup2Seq()), 1));
                sendAr.push(MP_Util.CreateParamArray(this.getEventIds(this.getLabsGroup3Seq()), 1));
                sendAr.push(MP_Util.CreateParamArray(this.getEventIds(this.getLabsGroup4Seq()), 1));
                sendAr.push(MP_Util.CreateParamArray(this.getEventIds(this.getLabsGroup5Seq()), 1));
                sendAr.push(MP_Util.CreateParamArray(this.getEventIds(this.getOptionalLabSeq()), 1));

                // Call the mp_preg_prenatal_labs ccl script
                var scriptRequest = new ComponentScriptRequest();
                scriptRequest.setProgramName("MP_GET_PREG_PRENATAL_LABS");
                scriptRequest.setParameterArray(sendAr);
                scriptRequest.setComponent(this);
                scriptRequest.setLoadTimer(loadTimer);
                scriptRequest.setRenderTimer(renderTimer);

                scriptRequest.performRequest();
            } catch (err) {
                MP_Util.LogJSError(err, this, "preg-prenatal-labs-o2.js", "retrieveComponentData");
            }
        }
    }
};

/**
 * Create a TableColumn object and set the properties like class name, display
 * field
 *
 * @param {colInfo} table col information.
 */
PrenatalLabComponent.prototype.createColumn = function(colInfo) {
    var column = new TableColumn();
    column.setColumnId(colInfo.ID);
    column.setCustomClass(colInfo.CLASS);
    column.setColumnDisplay(colInfo.DISPLAY);
    column.setRenderTemplate('${ ' + colInfo.RENDER_TEMPLATE + '}');
    return column;
};

/**
 * Select the first row in the table as default and render preview pane with
 * that row information.
 *
 * @param {Boolean} flag.
 */
PrenatalLabComponent.prototype.selectDefaultRow = function(flag) {

    if (this.m_tableView && this.m_tableView.length) {

        var tableRowArr = this.m_tableView.find('.result-info');
        var firstRow = tableRowArr[0];
        var rowId = this.getRowId(firstRow);

        this.m_lastSelectedRow = "";
        this.m_lastSelectedGrp = "";

        // render preview pane with first row info.
        //this.updateInfo(firstRow, this.prenatalTable.getRowById(rowId).getResultData(), true, true, false);
    }
};

/**
 * This is a helper method which iterates through result and gets the EventId
 * which will be return to view the result viewer window
 *
 * @param {results, selectedGroup} .
 */
PrenatalLabComponent.prototype.getEventIdForResultVeiwer = function(results, selectedGroup) {
    var eventId = "";
    //Check if the selected group has results and then get the eventId
    var resultLab = [results.MEASUREMENTS, results.DOCUMENTS, results.UNCLASSIFIEDS];
    for (var i = 0; i < resultLab.length; i++) {
        if (resultLab[i].length > 0) {
            var typeLab = resultLab[i];
            for (var j = 0; j < typeLab.length; j++) {
                if (typeLab[j].GROUP === selectedGroup) {
                    // show the respective eventId
                    eventId = typeLab[j].EVENT_ID;
                    break;
                }
                else if (selectedGroup === this.getOptionalLabLabel()) {
                    //If Optional show the first one, values comes sorted from ccl script
                    eventId = typeLab[typeLab.length - 1].EVENT_ID;
                    break;
                }
            }
        }
    }
    return eventId;
};

/**
 * This method returns the label name of the selected group.
 * 
 * @param selectedGroup {String} - selected group Id
 */
PrenatalLabComponent.prototype.getLabGroupsLabel = function(selectedGroup) {
    var groupIds = this.labGroupIds;
	switch (selectedGroup) {
        case groupIds.INITIAL_LAB:
            return this.getInitialLabel();
        case groupIds.LAB_GROUP1:
            return this.getLabsGroup1Label();
        case groupIds.LAB_GROUP2:
            return this.getLabsGroup2Label();
        case groupIds.LAB_GROUP3:
            return this.getLabsGroup3Label();
        case groupIds.LAB_GROUP4:
            return this.getLabsGroup4Label();
        case groupIds.LAB_GROUP5:
            return this.getLabsGroup5Label();
        case groupIds.OPTIONAL_LAB:
            return this.getOptionalLabLabel();
    }
};

/**
 * This method returns the start week of the selected group.
 * 
 * @param selectedGroup {String} - selected group Id
 */
PrenatalLabComponent.prototype.getStartWeek = function(selectedGroup) {
	var groupIds = this.labGroupIds;
	switch (selectedGroup) {
        case groupIds.INITIAL_LAB:
            return -1; //Indicates initial labs;
        case groupIds.LAB_GROUP1:
            return this.getLabsGroup1StartWeek();
        case groupIds.LAB_GROUP2:
            return this.getLabsGroup2StartWeek();
        case groupIds.LAB_GROUP3:
            return this.getLabsGroup3StartWeek();
        case groupIds.LAB_GROUP4:
            return this.getLabsGroup4StartWeek();
        case groupIds.LAB_GROUP5:
            return this.getLabsGroup5StartWeek();
        case groupIds.OPTIONAL_LAB:
            return -1; // Indicates optional labs
    }
};

/**
 * This method returns the end week of the selected group.
 * 
 * @param selectedGroup {String} - selected group Id
 */
PrenatalLabComponent.prototype.getEndWeek = function(selectedGroup) {
	var groupIds = this.labGroupIds;
	switch (selectedGroup) {
        case groupIds.INITIAL_LAB:
            return -1; //Indicates initial labs;
        case groupIds.LAB_GROUP1:
            return this.getLabsGroup1EndWeek();
        case groupIds.LAB_GROUP2:
            return this.getLabsGroup2EndWeek();
        case groupIds.LAB_GROUP3:
            return this.getLabsGroup3EndWeek();
        case groupIds.LAB_GROUP4:
            return this.getLabsGroup4EndWeek();
        case groupIds.LAB_GROUP5:
            return this.getLabsGroup5EndWeek();
        case groupIds.OPTIONAL_LAB:
            return -1; // Indicates optional labs
    }
};

/**
 * This is a callback which will be called on cell click of the component
 * table
 *
 * @param {Event, Data} .
 */
PrenatalLabComponent.prototype.onRowClick = function(event, data) {

    try {
        var compNS = this.getStyles().getNameSpace();
        var selRow = $(event.target).parents(".result-info");

        this.selectedGroupId = this.getGroupId(selRow);
        this.selectedRowId = this.getRowId(selRow);

        // Only have to check for null
        if (!selRow.length || data.RESULT_DATA === null) {
            return;
        }
        // this statement checks if it is initiated from LabName column
        if (event.target.className === compNS + "-table-dispName" || (event.target.id).split(":")[3] === "DISPLAY_NAME") {
            //means activated from click
            this.updateInfo(selRow, data.RESULT_DATA, false, true, true);
        } else {
            this.updateInfo(selRow, data.RESULT_DATA, false, true, false);
        }
        var mEventId = "";
        var dEventId = "";
        var uEventId = "";
        // Result Viewer gets Initiated when we click upon Result-Status column result items or
        // result in side panel
        if ($(event.target).hasClass("res-normal") ||
            $(event.target).hasClass("res-severe") ||
            $(event.target).hasClass("res-high") ||
            $(event.target).hasClass("res-low") ||
            $(event.target).hasClass("res-abnormal") ||
            $(event.target).hasClass(compNS + "-document-pic")) {

            var selectedGroup = this.getGroupId(selRow);
            var rowId = this.getRowId(selRow);
            var index = 0;

            //these are being retrieved , as the result shown on lab group
            //differ by lab groupings.
            selectedGroup = this.getLabGroupsLabel(selectedGroup);

            //Get the event Ids 
            //Launch resultviewer if there is an event id on the clicked target.
            var eventid = this.getEventIdForResultVeiwer(data.RESULT_DATA.RESULTS[0], selectedGroup);
            if (eventid !== "") {
                (new CapabilityTimer("CAP:MPG.PrenatalLabs.O2", this.getCriterion().category_mean)).capture();
                ResultViewer.launchAdHocViewer(eventid);
            }
        }
    } catch (err) {
        MP_Util.LogJSError(err, this, "preg-prenatal-labs-o2.js", "onRowClick");
    }
};

/**
 * Based on the selected row, reading pane will be refresh with data and
 * selected row will be updated as well. If the user select the same row again,
 * rendering will be stopped.
 *
 * @param {SelectedRow, Data, IsInitialLoad}
 */
PrenatalLabComponent.prototype.updateInfo = function(selRow, data,
    isInitialLoad, triggerFromClick, fromDisplay) {
    try {
        var compNS = this.getStyles().getNameSpace();
        var compID = this.getComponentId();

        var selectedGroup = this.getGroupId(selRow);
        var rowId = this.getRowId(selRow);
        if (triggerFromClick === true) {
            // If it is the initial load, allow clicking on the initial row to update
            // its background color, indicating to end user that click was successful
            if (this.m_lastSelectedRow === rowId && this.m_lastSelectedGrp === selectedGroup &&
                !$(selRow).hasClass(this.getStyles().getNameSpace() + "-row-selected-init")) {
                if (fromDisplay === true) {
                    if (this.m_sidePanelVisible === true) {
                        $("#" + compID + "sidePanelContainer").removeClass("" + compNS + "-sidepanel-container").addClass("" + compNS + "-sidepanel-container-hide");
                        $("#" + compID + "tableview").removeClass("" + compNS + "-table").addClass("" + compNS + "-table-expand");
                        this.m_sidePanelVisible = false;
                    } else {
                        $("#" + compID + "tableview").removeClass("" + compNS + "-table-expand").addClass("" + compNS + "-table");
                        $("#" + compID + "sidePanelContainer").removeClass("" + compNS + "-sidepanel-container-hide").addClass("" + compNS + "-sidepanel-container");
                        this.m_sidePanelVisible = true;
                        this.addSidePanel();
                        this.updateInfo(selRow, data, false, false, false);
                        this.m_sidePanel.showPanel();
                    }
                }
                return;
            }
        }

        this.updateSelRowBgColor(selRow, isInitialLoad);
        if (isInitialLoad === true || selectedGroup === "initialLab") {
            if (isInitialLoad === true) {
                this.renderReadingPane(this.getInitialLabel(), data.LABS[0]);
            } else {
                this.renderReadingPane(this.getInitialLabel(), data);
            }
        } else {
            //Set the reading Pane, and provide the groupName from where it was triggered
            this.renderReadingPane(this.getLabGroupsLabel(selectedGroup), data);
        }
        
        // Update the m_lastSelectedRow value with index.
        this.m_lastSelectedRow = rowId;
        this.m_lastSelectedGrp = selectedGroup;
    } catch (err) {
        MP_Util.LogJSError(err, this, "preg-prenatal-labs-o2.js", "updateInfo");
    }
};

/**
 * This function will return the row id from the id of DOM element based on
 * the grouping applied on the table.
 *
 * @param rowObj {Object} - HTML row object
 */
PrenatalLabComponent.prototype.getRowId = function(rowObj) {
    var rowId = "";
    var selectedRow = $(rowObj).attr("id");
    var identifiers = selectedRow.split(":");
    rowId = identifiers[2];

    return rowId;
};

/**
 * This function will return the group Id from the id of DOM element based on
 * the selection on the table.
 *
 *  @param rowObj {Object} - HTML row object
 */
PrenatalLabComponent.prototype.getGroupId = function(rowObj) {
    var groupId = "";
    var selectedRow = $(rowObj).attr("id");
    var identifiers = selectedRow.split(":");
    groupId = identifiers[1];
    return groupId;
};

/**
 * This function updates selected row background color
 *
 * @param {SelRowObj, IsInitialLoad}
 */
PrenatalLabComponent.prototype.updateSelRowBgColor = function(selRowObj, isInitialLoad) {
    var compNS = this.getStyles().getNameSpace();
    var prevRow = this.m_tableView.find(".selected");

    var rowId = "";
    var selectedGroup = "";
    if ($(prevRow).attr("id") !== undefined) {
        selectedGroup = this.getGroupId(prevRow);
        rowId = this.getRowId(prevRow);

        // Remove the background color of previous selected row.
        if (prevRow.length > 0 && this.m_lastSelectedRow === rowId && this.m_lastSelectedGrp === selectedGroup) {
            prevRow.removeClass(compNS + "-row-selected");
            prevRow.removeClass(compNS + "-row-selected-init");
            prevRow.removeClass("selected");
            prevRow.children("*").children("*").css("color", "");
        }
    }
    // Change the background color to indicate that its selected.
    if (isInitialLoad) {
        $(selRowObj).addClass(compNS + "-row-selected-init selected");
    } else {
        $(selRowObj).addClass(compNS + "-row-selected selected");
    }
};

/**
 * Array function to sort by property
 * @param {propertyName}
 */
Array.prototype.sortByProp = function(propertyName) {
    return this.sort(function(value1, value2) {
        return (value1[propertyName] < value2[propertyName]) ? 1 : (value1[propertyName] < value2[propertyName]) ? -1 : 0;
    });
};


/**
 * Initializes the pendingDataSR shared resource, if it hasn't been initialized already.
 * Used to save and get pending actions. If a pending data is set; upon refreshing the
 * component, a win32 dialogue would popup to the user to communicate there are pending
 * actions which will be lost on refreshing.
 */ 
PrenatalLabComponent.prototype.initPendingSR = function() {
	var sharedResourceObj = null;
	var dataObj = {};
	var pendingSR = MP_Resources.getSharedResource("pendingDataSR");
	var pendingDataArrLength = 0;

	if (!pendingSR) {
		sharedResourceObj = new SharedResource("pendingDataSR");

		//Get the external resource PVFRAMEWORKLINK object to store pending actions and to
		//set a boolean value to indicate there is pending data.
		dataObj.pendingDataObj = window.external.DiscernObjectFactory("PVFRAMEWORKLINK");
		dataObj.pendingDataCompArr = [];

		sharedResourceObj.setIsAvailable(true);
		//Set the shared resource data object
		sharedResourceObj.setResourceData(dataObj);

		//Add the shared resource so other components can access it.
		MP_Resources.addSharedResource("pendingDataSR", sharedResourceObj);
	}
	else {//The shared resource exists
		dataObj = pendingSR.getResourceData();
		pendingDataArrLength = dataObj.pendingDataCompArr.length;
		//Since the shared resource exists ONLY remove the current component from pending Array as other components may contain pending data.
		while (pendingDataArrLength--) {
			//From testing, JS wants to convert the componentID to string when added to the pendingDataCompArr.  DON'T change to '==='.
			if (this.getComponentId() == dataObj.pendingDataCompArr[pendingDataArrLength]) {
				dataObj.pendingDataCompArr.splice(pendingDataArrLength, 1);
				break;
			}
		}
		//Update the shared resource with current data.
		MP_Resources.setSharedResourceData("pendingDataSR", dataObj);
	}
	//If components contain pending data notify the Powerchart framework
	dataObj.pendingDataObj.SetPendingData(dataObj.pendingDataCompArr.length === 0 ? 0 : 1);
};

/**
 * Toggle the pending data flag used by the PVFRAMEWORKLINK discernobject factory object.
 * Check and set the pending shared resource based on Boolean flag whether to add or
 * remove a shared resource. If there is data pending for a patient, a win32 dialogue
 * would popup to the user to communicate there are pending actions which will be lost
 * on refreshing.
 * 
 * @param {boolean} pendingInd - If the current component has pending data (value = true) prompt
 * 		the user before they navigate away from the chart.
 */
PrenatalLabComponent.prototype.checkPendingSharedResource = function(pendingInd) {
	var compId = this.getComponentId();
	//Shared resource object
	var sharedResourceObj = null;
	//Data object to retrive "pendingDataSR" shared resource
	var dataObj = {};
	//Pending Data object array length
	var pendingDataArrLength = 0;
	
	//Get the shared resource
	sharedResourceObj = MP_Resources.getSharedResource("pendingDataSR");

	if (sharedResourceObj) {
		//Retrieve the object from the shared resource.
		dataObj = sharedResourceObj.getResourceData();
		if (dataObj) {
			var pendingArr = dataObj.pendingDataCompArr;
			if (pendingInd) {
				//Add component to the array of pending components. Keep a distinct list of component ID's.
				if (pendingArr.join("|").indexOf(compId) === -1) {
					pendingArr.push(compId);
				}
			}
			else {
				//The component no longer has pending data. Remove the component id from the array.
				pendingDataArrLength = pendingArr.length;
				while (pendingDataArrLength--) {
					if (compId === pendingArr[pendingDataArrLength]) {
						pendingArr.splice(pendingDataArrLength, 1);
						break;
					}
				}
			}
			dataObj.pendingDataCompArr = pendingArr;
			//If there are no other components that have pending actions communicate to the PVFRAMEWORKLINK object that there is no pending components.
			dataObj.pendingDataObj.SetPendingData(dataObj.pendingDataCompArr.length === 0 ? 0 : 1);
			//Update the SharedResource.
			MP_Resources.setSharedResourceData("pendingDataSR", dataObj);
		}
	}
};

/**
 * Add the selected Order to the scratch pad if an only if order details are available
 * for an event set.
 */
PrenatalLabComponent.prototype.addItemToScratchPad = function() {
	var compId = this.getComponentId();
	var orderDetails = this.currentOrderableData[0];

	//Create scratchpad object
	var scratchpadObj = {};
	scratchpadObj.componentId = compId;
	//Location where the Order was added from
	scratchpadObj.addedFrom = "PrenatalLabs";
	scratchpadObj.favId = scratchpadObj.addedFrom + "_" + compId + "_OrderSynId_" + orderDetails.SYNONYM_ID;
	//0: Orderable; 1: Careset; 2: PowerPlan - Only Orderable items are supported in Prenatal Labs
	scratchpadObj.favType = 0;
	//Display name of orderable/Careset/PowerPlan
	scratchpadObj.favName = orderDetails.SYNONYM_NAME;
	//Display name of order sentence, or if PowerPlan it displays the system name of the PowerPlan, not the customizable one in favName above
	scratchpadObj.favOrderSentDisp = orderDetails.DESCRIPTION;
	//0: MySearch PowerPlan; 1: Any PowerPlan saved to normal folder structure; 2: My Plan Favorites Folder
	scratchpadObj.favOrdSet = 0;
	scratchpadObj.favSynId = orderDetails.SYNONYM_ID + ".0";
	scratchpadObj.favSentId = orderDetails.SENT_ID + ".0";
	scratchpadObj.favParam = orderDetails.SYNONYM_ID + ".0|" + orderDetails.SENT_ID + ".0";
	// Set displayRxIcon to 1 for pharamacy orders
	scratchpadObj.displayRxIcon = orderDetails.ACTIVITY_TYPE === "PHARMACY" ? 1 : 0;
	scratchpadObj.favNomenIds = '""';

	//Add object to scratchpad shared reource
	var dataObj = this.addToOrRemoveFromScratchpadSR(scratchpadObj, false);

	//Ensure component Id has been added to the pending data shared resource
	this.checkPendingSharedResource(true);
};

/**
 * Add or remove scratchpad object to the shared resource array of objects.
 * 
 * @param {Object} scratchpadObj - Scratchpad object to add or remove
 * 
 * @param {boolean} isRemovingObj - Remove the object from scracthpad shared resource if the value is true,
 * 	else add it to the scracthpad shared resource
 */
PrenatalLabComponent.prototype.addToOrRemoveFromScratchpadSR = function(scratchpadObj, isRemovingObj) {
	var sharedResourceObj = this.getScratchpadSharedResourceObject();
	
	if (sharedResourceObj) {
		//Retrieve the object from the shared resource.
		var dataObj = sharedResourceObj.getResourceData();
		if (!dataObj) {
			return null;
		}
		else {
			var scratchpadArr = dataObj.scratchpadObjArr;
			if (scratchpadArr) {
				if (isRemovingObj) {
					var scratchpadDataLength = scratchpadArr.length;
					while (scratchpadDataLength--) {
						if (scratchpadArr[scratchpadDataLength].favSynId == scratchpadObj.favSynId && scratchpadArr[scratchpadDataLength].favSentId == scratchpadObj.favSentId) {
							scratchpadArr.splice(scratchpadDataLength, 1);
							break;
						}
					}
				}
				else {
					scratchpadArr.push(scratchpadObj);
				}
			}
			dataObj.scratchpadObjArr = scratchpadArr;

			//Update the SharedResource.
			MP_Resources.setSharedResourceData(sharedResourceObj.getName(), dataObj);
			//Notify consumers that something has been added to or deleted from the shared resource
			sharedResourceObj.notifyResourceConsumers();
			return dataObj;
		}
	}
};

/**
 * Get Scratchpad Shared Resource object.
 * 
 * @return {Object} sharedResourceObj - Scratchpad shared resource object
 */
PrenatalLabComponent.prototype.getScratchpadSharedResourceObject = function() {
	var sharedResourceObj = null;
	var sharedResourceName = "scratchpadSR";

	//Get the shared resource
	sharedResourceObj = MP_Resources.getSharedResource(sharedResourceName);
	if (!sharedResourceObj) {
		sharedResourceObj = this.initScratchpadSR(sharedResourceName);
	}

	return sharedResourceObj;
};

/**
 * Create scratchpad Shared Resource.
 * 
 * @param {string} sharedResourceName - The name of the shared resource to create
 */
PrenatalLabComponent.prototype.initScratchpadSR = function(sharedResourceName) {
	var sharedResourceObj = null;
	var dataObj = {};

	sharedResourceObj = new SharedResource(sharedResourceName);
	//Create the object that will be stored in the SharedResource
	dataObj.scratchpadObjArr = [];
	//Set the available flag to true
	sharedResourceObj.setIsAvailable(true);
	//Set the shared resource data object
	sharedResourceObj.setResourceData(dataObj);

	//Set the shared resource event listener object
	var object = {};
	sharedResourceObj.setEventListenerObject(object);
	//Set the shared resource event listener flag
	sharedResourceObj.setEventListenerFlag(EventListener.EVENT_SCRATCHPAD_COUNT_UPDATE);
	//Add the shared resource so other components can access it
	MP_Resources.addSharedResource(sharedResourceObj.getName(), sharedResourceObj);
	return sharedResourceObj;
};

/**
 * This function populates the side panel, from the row selected
 *
 * @param {GroupIndex, Data}
 */
PrenatalLabComponent.prototype.renderReadingPane = function(groupName, data) {
    var prenatali18n = i18n.discernabu.preg_prenatal_labs_o2;
    var component = this;
    var compID = this.getComponentId();
    var compNS = this.getStyles().getNameSpace();
    var sidePanelHtml = "";
    var sidePanelTable = "";
    var sidePanelTableHeader = "";
    var sidePanelTableRows = "";
    var fulfillRangeData = "";
    var dttmValue = new Date();
    var pregInfoSR = MP_Resources.getSharedResource("pregnancyInfo");
    var pregInfoObj = pregInfoSR.getResourceData();
    var sender = "sidePanel";
    var noDataInfoHTML = "";
    var isResultAvailable = false;
    var isFulfillRangeResultAvailable = false;
    var isNonFulfillRangeResultAvailable = false;
    var noDataValue = "";
    var tabelColHdrClass = compNS + "-sp-table-all-col-hdr ";
    var selectTabelHdrColClass = compNS + "-sp-table-select-col-hdr ";
    var actionButtonClass = compNS + "-sp-action-button ";

    // Default value "Not Assigned" i.e., user can select which group result should be
    data.GESTATIONAL_RECOMMENDATION = prenatali18n.SELECT;

    try {
        var resultDisplay = "--";
        var resultIndex = 0;
        var resultLength = data.RESULTS.length;
        var eventId = "";
        this.selectedEventCode = data.EVENT_SET_CD;
        var fulfillingGroup = "";
        var displayResult = "";
        var dttmValueString = "";
        var egaDisplayString = "";
        var fulfillRangeMessage = "";

        //Sort by EGA(show latest first)
        for (resultIndex = 0; resultIndex < resultLength; resultIndex++) {
            data.RESULTS[resultIndex].MEASUREMENTS.sortByProp('EGA');
            data.RESULTS[resultIndex].DOCUMENTS.sortByProp('EGA');
            data.RESULTS[resultIndex].UNCLASSIFIEDS.sortByProp('EGA');
        }

        //Display the result in the header
        resultDisplay = data.RESULT;

        var groupSelectionClass = "";
        var isLabOrderable = data.ORDER_DATA.length > 0 ? true : false;
        var isLabDeclinable = true;
        var isLabDeclined = false;
        var isLabSavable = false;
        var orderBtnStatus = !isLabOrderable ? 'disabled ' :  '';
        var declineBtnStatus = !isLabDeclinable ? 'disabled ' :  '';

        //Check whether the lab is already declined. If declined, can't be declined again.
        var declinedLabResult = this.declinedLabData[this.selectedEventCode];
        if(declinedLabResult && declinedLabResult.SAVED_DATA) {
            if(declinedLabResult.isInValid.length > 0 && declinedLabResult.isInValid["" + this.labGroupIndex[this.selectedGroupId]]) {
                isLabDeclinable = true;
            }
            else {
                isLabDeclinable = false;
                isLabDeclined = true;
            }
        }

        sidePanelTableHeader = "<div class='" + compNS + "-content-hdr'>" + "<dl class='result-info'>" + "<dd class='" + tabelColHdrClass +
        	"'><span>" + prenatali18n.RESULT + "</span></dd>" + "<dd class='" + tabelColHdrClass +
        	"'><span>" + prenatali18n.DATE + "</span></dd>" + "<dd class='" + tabelColHdrClass +
        	"'><span>" + prenatali18n.EGA + "</span></dd>" + "<dd class='" + selectTabelHdrColClass +
        	"'><span>" + prenatali18n.FULFILLS_RANGE + "</span> </dd>" + "</dl>" + "</div>";
        
        var updateFulfillAndNonFulfillTable = function labResultRangeTable(renderingGroupName, dataLength) {
        	//If there is no date available assign the default value
            fulfillingGroup = renderingGroupName;
            if(!isResultAvailable && dataLength === 1) {
            	displayResult = noDataValue;
            	dttmValueString = noDataValue;
            	egaDisplayString = noDataValue;
            	fulfillingGroup = noDataValue;
            }

            //If a lab is not assigned to any lab, that can be selected to save and can't be declined.
            if(renderingGroupName === prenatali18n.SELECT) {
                groupSelectionClass = compNS + "-select";
                isLabDeclinable = false;
                isLabSavable = true;
            }
            else {
                groupSelectionClass = "";
            }
            
            var physicianInfoHTML = "";
       	    //Check if the lab is saved by a physician.
       	    if(component.savedLabData[eventId]) {
       	    	physicianInfoHTML = "<div class='" + compNS + "-result-mark-fulfilled'>" + prenatali18n.MARKED_FULFILLED.replace("{0}", component.savedLabData[eventId].PRSNL_NAME) + "</div>";
       	    }

            if(renderingGroupName.localeCompare(groupName) === 0) {
            	if(isLabDeclined) {
            		fulfillRangeData = prenatali18n.DECLINED;
            	}
            	else {
            		fulfillRangeData += "<dl class='result-info " + compNS + "-side-panel-rows'>" +
                	"<dd class='" + tabelColHdrClass + "'><span>" + displayResult + "</span></dd>" +
                	"<dd class='" + tabelColHdrClass + "'><span>" + dttmValueString + "</span></dd>" +
                	"<dd class='" + tabelColHdrClass + "'><span>" + egaDisplayString + "</span></dd>" +
                	"<dd class='" + tabelColHdrClass + "'><span>" +"&nbsp;" + "</span></dd></dl>" + physicianInfoHTML;
            	}

                sidePanelTable = "<div class='" + compNS + "-result-fulfill-notification'><div class='" + compNS + "-fulfill-range'>" +
				  					prenatali18n.RESULT_FULFILLING_RANGE + "</div>" + "<div id='resultFulfill_" + compID +"' class='" +
				  					 compNS + "-result-fulfill-msg list-as-table'>" + fulfillRangeData + "</div></div>";
                isFulfillRangeResultAvailable = true;
                isLabDeclinable = false;
             }
             else {
                 sidePanelTableRows += "<dl class='result-info " + compNS + "-side-panel-rows'>" +
                	"<dd class='" + tabelColHdrClass + "'><span>" + displayResult + "</span></dd>" +
                	"<dd class='" + tabelColHdrClass + "'><span>" + dttmValueString + "</span></dd>" +
                	"<dd class='" + tabelColHdrClass + "'><span>" + egaDisplayString + "</span></dd>" +
                	"<dd class='" + selectTabelHdrColClass + "'><span id='eventId_" + eventId + "' class='" +
                	groupSelectionClass + "'>" + fulfillingGroup + "</span></dd></dl>";
            	 isNonFulfillRangeResultAvailable = true;
             }
        };

        //For every Measurement, check the data to be displayed and render it on reading pane
        for (resultIndex = 0; resultIndex < resultLength; resultIndex++) {
            dttmValueString = "--";
            var measurementLength = data.RESULTS[resultIndex].MEASUREMENTS.length;
            for (var measrIndex = 0; measrIndex < measurementLength; measrIndex++) {
                var measurements = data.RESULTS[resultIndex].MEASUREMENTS[measrIndex];
                eventId = measurements.EVENT_ID;
                if (this.isValidString(measurements.DTTM)) {
                    dttmValueString = this.getDisplayDate(measurements.DTTM);
                    isResultAvailable = true;
                }

                egaDisplayString = measurements.EGA;
                if (measurements.EGA === undefined) {
                	// display "--" in ega column if no edd
                	egaDisplayString = "--";
                }
                else {
                	egaDisplayString = measurements.EGA + prenatali18n.WEEKS + " " + measurements.EGA_DAYS + prenatali18n.DAYS;
                }

                // Values being check if they are critical or normal
                displayResult = "";
                if (!this.isValidString(measurements.RESULT)) {
                    displayResult = "--";
                } else {
                    if (measurements.RESULT !== "--") {
                        //Check if the result is critical/normal amd modification, if it is then, add css class for criticality and mnodification indicators
                        displayResult = this.processResultIndicator(measurements.RESULT, measurements.NORMALCY, measurements.MODIFIED_IND, sender, eventId);
                    }
                }
 
                updateFulfillAndNonFulfillTable(measurements.GROUP, measurementLength);
                data.RESULTS[resultIndex].MEASUREMENTS[measrIndex] = measurements;
            }
            if (data.RESULTS.ORDERED === false) {
                var docLength = data.RESULTS[resultIndex].DOCUMENTS.length;
                for (var docIndex = 0; docIndex < docLength; docIndex++) {

                    var documents = data.RESULTS[resultIndex].DOCUMENTS[docIndex];
                    eventId = documents.EVENT_ID;
                    if (this.isValidString(documents.EFFECTIVE_DATE)) {
                        dttmValueString = this.getDisplayDate(documents.EFFECTIVE_DATE);
                        isResultAvailable = true;
                    }

                    displayResult = "";
                    if (!this.isValidString(documents.TITLE)) {
                    	displayResult = "--";
                    } else {
                        if (documents.TITLE !== "--") {
                            //Check if the result is critical/normal amd modification, if it is then, add css class for criticality and mnodification indicators
                        	displayResult = this.processResultIndicator(documents.TITLE, documents.NORMALCY_CD_MEAN, documents.MODIFIED_IND, sender, eventId);
                        }
                    }

                    egaDisplayString = documents.EGA;
                    if (documents.EGA !== "--") {
                    	egaDisplayString = documents.EGA + prenatali18n.WEEKS + " " + documents.EGA_DAYS + prenatali18n.DAYS;
                    }

                    updateFulfillAndNonFulfillTable(documents.GROUP, docLength);
                    data.RESULTS[resultIndex].DOCUMENTS[docIndex] = documents;
                }
                var unclasLength = data.RESULTS[resultIndex].UNCLASSIFIEDS.length;
                for (var uclIndex = 0; uclIndex < unclasLength; uclIndex++) {
                    var unclassifieds = data.RESULTS[resultIndex].UNCLASSIFIEDS[uclIndex];
                    eventId = unclassifieds.EVENT_ID;
                    if (this.isValidString(unclassifieds.EFFECTIVE_DATE)) {
                        dttmValueString = this.getDisplayDate(unclassifieds.EFFECTIVE_DATE);
                        isResultAvailable = true;
                    }

                    displayResult = "";
                    if (!this.isValidString(unclassifieds.EVENT_TAG)) {
                        //Check if the result is critical/normal amd modification, if it is then, add css class for criticality and mnodification indicators
                    	displayResult = this.processResultIndicator(data.EVENT_SET_DISPLAY, unclassifieds.NORMALCY_CD_MEAN, unclassifieds.MODIFIED_IND, sender, eventId);
                    } else {
                        if (unclassifieds.EVENT_TAG !== "--") {
                            //Check if the result is critical/normal amd modification, if it is then, add css class for criticality and mnodification indicators
                        	displayResult = this.processResultIndicator(unclassifieds.EVENT_TAG, unclassifieds.NORMALCY_CD_MEAN, unclassifieds.MODIFIED_IND, sender, eventId);
                        }
                    }

                    egaDisplayString = unclassifieds.EGA;
                    if (unclassifieds.EGA !== "--") {
                    	egaDisplayString = unclassifieds.EGA + prenatali18n.WEEKS + " " + unclassifieds.EGA_DAYS + prenatali18n.DAYS;
                    }

                    updateFulfillAndNonFulfillTable(unclassifieds.GROUP, unclasLength);
                    data.RESULTS[resultIndex].UNCLASSIFIEDS[uclIndex] = unclassifieds;
                }
            }
        }
        
        if(!isResultAvailable) {
        	fulfillRangeMessage = isLabDeclined ? prenatali18n.DECLINED : prenatali18n.NO_RESULTS_AVAILABLE;
        	sidePanelTable = "<div class='" + compNS + "-result-fulfill-notification'><div class='" + compNS + "-fulfill-range'>" + prenatali18n.RESULT_FULFILLING_RANGE +
		 	"</div>" + "<div id='resultFulfill_" + compID +"' class='" + compNS + "-result-fulfill-msg " + compNS +
		 	"-result-fulfill-data'>" + fulfillRangeMessage + "</div></div>";
        }
        else if(!isFulfillRangeResultAvailable) {
        	fulfillRangeMessage = isLabDeclined ? prenatali18n.DECLINED : prenatali18n.RESULT_EXISTS_OUTSIDE;
        	sidePanelTable = "<div class='" + compNS + "-result-fulfill-notification'><div class='" + compNS + "-fulfill-range'>" + prenatali18n.RESULT_FULFILLING_RANGE +
		 	"</div>" + "<div id='resultFulfill_" + compID +"' class='" + compNS + "-result-fulfill-msg " + compNS +
		 	"-result-fulfill-data'>" + fulfillRangeMessage + "</div></div>";
        }
        
        sidePanelTable += "<div class='component-table list-as-table'>" + sidePanelTableHeader + "<div class='" + compNS + "-content-body'><div>" + sidePanelTableRows + "</div></div></div>";
        
        if(!isResultAvailable) {
        	//Results are not available in any range - Fulfulling and NonFulfulling
			noDataInfoHTML = "<div class='" + compNS + "-no-result'><div class='" + compNS + "-no-result-icon'></div>";
			noDataInfoHTML += "<div class='" + compNS + "-no-result-text'>" + prenatali18n.NO_RESULTS_FOR_LAB + "</div></div>";
        }
        else if(isFulfillRangeResultAvailable && isNonFulfillRangeResultAvailable === false) {
        	//Results are available in Fulfulling range only
			noDataInfoHTML = "<div class='" + compNS + "-no-result'><div class='" + compNS + "-no-result-icon'></div>";
			noDataInfoHTML += "<div class='" + compNS + "-no-additional-result-text'>" + prenatali18n.NO_ADDITIONAL_RESULTS_MESSAGE + "</div></div>";
        }
        else {
          	noDataInfoHTML = "";
        }

        declineBtnStatus = !isLabDeclinable ? 'disabled ' :  '';
        
        sidePanelHtml = "<div id='sidePanelScrollContainer" + compID + "'>" + sidePanelTable + noDataInfoHTML + "</div>";
        //html for Actions buttons
        this.m_sidePanel.setActionsAsHTML("<div class ='" + compNS + "-action-buttons'><div class='" + actionButtonClass +"'><div id = 'order_" + compID + "' class='sp-button2 " + orderBtnStatus + "'>" + prenatali18n.ORDER + "</div></div><div class='" + actionButtonClass +"'><div id = 'decline_" + compID + "' class='sp-button2 " + declineBtnStatus + "'>" + prenatali18n.DECLINE + "</div></div><div class='" + actionButtonClass +"'><div id = 'saveChanges_" + compID + "' class='sp-button2 disabled'>" + prenatali18n.SAVE_CHANGES + "</div></div></div>");
        //html for Notification
        scratchpadHTML = "<div id='scratchPadMessage_" + compID + "' class='" + compNS + "-scratch-pad-message'>" + "<span class='" + compNS + "-scrtach-pad-icon'>&nbsp;</span>" + "<span class='" + compNS + "-scratch-pad-text'>" + prenatali18n.SCRATCH_PAD_NOTIFICATION + "</span>" + "</div>";
		 
        //this.m_sidePanel.m_headerTitleObj.removeClass("hidden");
        this.m_sidePanel.m_headerTitleObj.html(scratchpadHTML);
        
        this.m_sidePanel.showCornerCloseButton();
		//Event listener on close button
		$("#cornerCloseButton" + compID).click(function() {
			$("#" + compID + "sidePanelContainer").removeClass("" + compNS + "-sidepanel-container").addClass("" + compNS + "-sidepanel-container-hide");
            $("#" + compID + "tableview").removeClass("" + compNS + "-table").addClass("" + compNS + "-table-expand");
            this.m_sidePanelVisible = false;
		  });
		this.m_sidePanel.setSubtitleAsHTML("<div class='" + compNS + "-title'><span>" + data.EVENT_SET_DISPLAY +
                    " <span class='" + compNS + "-grp-class'>(" + groupName + ")</span> </span></div><div id='" + compID + "-sp-result-heading' class='" + compNS + "-rp-last-satisfied' > " +
                    "<span class='" + compNS + "-title-text'>" + resultDisplay + "</span></div>");

        // Render side panel with html of selected row details.
        this.m_sidePanel.setContents(sidePanelHtml, compID + "_Content");
        $("." + compNS + "-sp-hyperlink-col").data("Category", this.getCriterion().category_mean);
        $("." + compNS + "-sp-hyperlink-col").click(
            function() {
                var identifier = this.className.split(" ");
                var eventid = parseInt(identifier[identifier.length - 1], 10);
                var categoryMean = $("." + compNS + "-sp-hyperlink-col").data("Category");
                if (!(isNaN(eventid))) {
                    (new CapabilityTimer("CAP:MPG.PrenatalLabs.O2", categoryMean)).capture();
                    ResultViewer.launchAdHocViewer(eventid);
                }
            });

        //Enable Click functionality for "Order" if and only if selected event set could be Ordered.
        if(isLabOrderable) {
            this.currentOrderableData = data.ORDER_DATA;
            var orderSynonymId = this.currentOrderableData[0].SYNONYM_ID;
            $("#order_" + compID).click(function() {
            	(new CapabilityTimer("CAP:MPG.PrenatalLabs.O2-ORDER", component.getCriterion().category_mean)).capture();
            	var slaTimer = MP_Util.CreateTimer("CAP:MPG.PrenatalLabs.O2-ORDER");
            	if (slaTimer) {
            		slaTimer.SubtimerName = component.criterion.category_mean;
            		slaTimer.Stop();
            	}
            	//If an action is performed and is pending, don't perform another action until it is completed.
                if(!component.actionPerformed) {
                    //Log scratch pad debugging data.
                    logger.logMessage("Adding an Order to Shared Resource - Scratch Pad<br />" +
                            "Component Name: Prenatal Labs" + "<br />" +
                            "Synonym Id: " + component.currentOrderableData[0].SYNONYM_ID + "<br />");
                    component.addItemToScratchPad();
                    //Add Ordered items in an array to know which orders are added to scratch pad.
                    component.addOrderScratchPadItems(component.currentOrderableData[0].SYNONYM_ID);

                    //Show scratch pad Order added notification
                    //$("#scratchPadMessage_" + compID).show();
                    component.m_sidePanel.m_headerTitleObj.removeClass("hidden");
                }
            });
 
            //Display scratch pad Order added notification if an order is added to scratch pad.
            if(component.orderedData[orderSynonymId] >= 1) {
                //$("#scratchPadMessage_" + compID).show();
            	component.m_sidePanel.m_headerTitleObj.removeClass("hidden");
            }
            else {
            	component.m_sidePanel.m_headerTitleObj.addClass("hidden");
            }
        }
        else {
            //If there is no lab to order, set the orderable data to empty.
            this.currentOrderableData = [];
            component.m_sidePanel.m_headerTitleObj.addClass("hidden");
        }

        if(isLabSavable) {
            $("#sidePanelContents" + compID + " ." + compNS + "-select").off();
            $("#sidePanelContents" + compID + " ." + compNS + "-select").on("click", function() {
                //If an action is performed and is pending, don't perform another action until it is completed.
                if(!component.actionPerformed) {
                    $(this).html("");
                    var selectedResultHTML = $(this).closest('dl').html();
                    var selectedResultClass = $(this).closest('dl').attr("class");

                    //On selecting a lab to save, enable "Save Changes" button and disable "Select" option from another lab.
                    $("#sidePanelContents" + compID + " ." + compNS + "-select").off();

                    if(!isFulfillRangeResultAvailable) {
                    	$("#resultFulfill_" + compID).removeClass(compNS + "-result-fulfill-data").html(selectedResultHTML);
                    }
                    else {
                    	var fulFillRangeHTML = "<dl class='" + selectedResultClass + "'>" + selectedResultHTML + "</dl>";
                    	$("#resultFulfill_" + compID ).append(fulFillRangeHTML);
                    }

                    $("#saveChanges_" + compID).removeClass("disabled");
                    $("#sidePanelContents" + compID + " ." + compNS + "-select").removeClass(compNS + "-select");

                    //Saved the selected eventId - Used to save the particular event id (lab data) for the range set in bedrock.
                    component.selectedEventId = $(this).attr('id').split("_")[1];
                    $(this).closest('dl').html("");

                    $("#saveChanges_" + compID).off();
                    $("#saveChanges_" + compID).on("click", function() {
                    	(new CapabilityTimer("CAP:MPG.PrenatalLabs.O2-SAVE-CHANGES", component.getCriterion().category_mean)).capture();
                    	var slaTimer = MP_Util.CreateTimer("CAP:MPG.PrenatalLabs.O2-SAVE-CHANGES");
                    	if (slaTimer) {
                    		slaTimer.SubtimerName = component.criterion.category_mean;
                    		slaTimer.Stop();
                    	}
                         if($(this).attr('class').indexOf("prenatal-labs-btn-disabled") === -1) {
                             //On selecting "Save Changes" button, save the lab event id for a the range set in bedrock.
                             component.savePrenatalLabData(false);
                         }
                    });
                }
            });
        }

        //Enable the decline button only if a lab is declinable.
        if(isLabDeclinable) {
            $("#decline_" + compID).on("click", function() {
            	(new CapabilityTimer("CAP:MPG.PrenatalLabs.O2-DECLINE", component.getCriterion().category_mean)).capture();
            	var slaTimer = MP_Util.CreateTimer("CAP:MPG.PrenatalLabs.O2-DECLINE");
            	if (slaTimer) {
            		slaTimer.SubtimerName = component.criterion.category_mean;
            		slaTimer.Stop();
            	}
                if(!component.actionPerformed) {
                    component.savePrenatalLabData(true);
                }
            });
        }
    }
    catch (err) {
        MP_Util.LogJSError(err, this, "preg-prenatal-labs-o2.js", "renderReadingPane");
    }
};

/**
 * Save the prenatal lab data - Either declined or saved for a particular lab group range.
 * 
 * @param {boolean} isPrenatalLabDataToBeDeclined - whether the data to be saved or declined.
 * 						True - Declined the lab.
 * 						False - Save the lab for particular lab group and gestational range.
 * 						
 */
PrenatalLabComponent.prototype.savePrenatalLabData = function(isPrenatalLabDataToBeDeclined) {
    try {
        var component = this;
        this.actionPerformed = true;
        var scriptRequest = new ComponentScriptRequest();
        var prgName = "mp_preg_add_prenatal_lab_data";
        var sendAr = [];
        var criterion = component.getCriterion();
        var labData = [];
        var isDataToBeSaved = isPrenatalLabDataToBeDeclined === true ? 0 : 1;
        var eventId = component.selectedEventId ? component.selectedEventId + ".0" : "^^";
        var eventCode = component.selectedEventCode ? component.selectedEventCode + ".0" : "^^";
        var lookBackRange = this.pregnancyInfoObj ? this.pregnancyInfoObj.getLookBack() : 0;

        sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.encntr_id + ".0");
        sendAr.push(eventId, eventCode, lookBackRange, isDataToBeSaved);

        labData.push({
            GROUP_ID : component.selectedGroupId,
            START_WEEK : parseInt(component.getStartWeek(component.selectedGroupId), 10),
            END_WEEK : parseInt(component.getEndWeek(component.selectedGroupId), 10)
        });

        var prenatalLabDataJSON = component.buildLabSaveDataJSON(labData, isPrenatalLabDataToBeDeclined);

        scriptRequest.setProgramName(prgName);
        scriptRequest.setParameterArray(sendAr);
        scriptRequest.setAsyncIndicator(true);
        scriptRequest.setDataBlob(prenatalLabDataJSON);
        scriptRequest.setComponent(component);
        scriptRequest.performRequest();

        scriptRequest.setResponseHandler(function(scriptReply) {
            if (scriptReply.getStatus() === "F") {
                // Error object which will be used to log customized error.
                var discernError = new Error("Unable to save or decline a lab.");
                MP_Util.LogJSError(discernError, component, "preg-prenatal-labs-o2.js", "savePrenatalLabData");
            }
            else {
                component.retrieveComponentData();
            }
            return;
        });
    }
    catch(err) {
		// Make ACTIONS button available if any expception occurs - To re-try Save/Decline a lab.
		this.actionPerformed = false;
		MP_Util.LogJSError(err, this, "preg-prenatal-labs-o2.js", "savePrenatalLabData");
	}
};

/**
 * Builds prenatal lab save data JSON based on lab details.
 *
 * @param labData {Array} - Contains prenatal lab details which will be used to save a lab
 * 							for particular group.
 * 
 * @param {boolean} toBeDeclined - whether the data to be saved or declined.
 * 						True - Declined the lab.
 * 						False - Save the lab for particular lab group and gestational range.
 */
PrenatalLabComponent.prototype.buildLabSaveDataJSON = function(labData, toBeDeclined) {
    var labJSON = '{"PLS_PARAMS":{"RESULTS":[';
    var groupJSON = "";
    var labDataLength = labData.length;
    var labIndex = 0;
    var curDateUTC = new Date().toUTCString();

    for(labIndex = 0; labIndex < labDataLength; labIndex++) {
        groupJSON += '{"Group_Id":"' + labData[labIndex].GROUP_ID + '","Start_Week":' + labData[labIndex].START_WEEK;
        groupJSON += ',"End_Week":' + labData[labIndex].END_WEEK + ',"Date_Time":"' + curDateUTC + '"}';
        groupJSON = labIndex > labDataLength - 1 ? groupJSON + ',' : groupJSON;
    }

    var declinedLabResult = this.declinedLabData[this.selectedEventCode];
    if(toBeDeclined && declinedLabResult && declinedLabResult.SAVED_DATA) {
        var jsonObj = JSON.parse(declinedLabResult.SAVED_DATA);
        var results = jsonObj.PLS_PARAMS.RESULTS;
        var resultLength = results.length;

        for(labIndex = 0; labIndex < resultLength; labIndex++) {
            var result = results[labIndex];
            groupJSON += ',{"Group_Id":"' + result.Group_Id + '","Start_Week":' + result.Start_Week;
            groupJSON += ',"End_Week":' + result.End_Week + ',"Date_Time":"' + result.Date_Time + '"}';
        }
    }

    // Build lab data JSON if and only if laba data exists.
    if (labDataLength === 0) {
        labJSON = "";
    }
    else {
        labJSON += groupJSON + "]}}";
    }

    return labJSON;
};
/**
 * Adds the Order synonym id count to an array for which Order has been added to scratch pad.
 * 
 * @param {String} orderSynonymId - Unique Id that represents the order synonym
 */
PrenatalLabComponent.prototype.addOrderScratchPadItems = function(orderSynonymId) {
    //Store the ordered items using order synonym Id as key.
    if(this.orderedData[orderSynonymId] >= 1) {
        this.orderedData[orderSynonymId] += 1;
    }
    else {
        this.orderedData[orderSynonymId] = 1;
    }
};

/**
 * Overriding MPageComponent's resizeComponent method to set the height of
 * side panel.
 */
PrenatalLabComponent.prototype.resizeComponent = function() {
    try {
        // Call the base class functionality to resize the component
        MPageComponent.prototype.resizeComponent.call(this, null);

        if (this.m_sidePanel) {
            this.m_sidePanel.m_expandOption = this.m_sidePanel.expandOption.NONE;
            this.m_sidePanel.m_fullPanelScrollOn = false;
            this.m_sidePanel.resizePanel();
            this.resetSidePanelHeight();
        }
    } catch (err) {
        MP_Util.LogJSError(err, this, "preg-prenatal-labs-o2.js", "resizeComponent");
    }
};

/**
 * Function to reset the height of side panel to component table height. To
 * reset the height, minimum height of side Panel will be set as the height of
 * component table. If the height of component table is less than side panel's
 * min height, side panel's min height will be set. This function will be called
 * whenever the height of component changed(on component resizing , subsection
 * expanding/collapsing).
 */
PrenatalLabComponent.prototype.resetSidePanelHeight = function() {
	var component = this;
	var componentId = component.getComponentId();
	var sidePanelContentMinHeight = component.m_sidePanelMinHeight;
	var sidePanelObj = component.m_sidePanel;
	
    if (this.m_tableView && this.m_tableView.length && sidePanelObj) {
        var minHeight = Math.max(this.m_tableView.height(), sidePanelContentMinHeight);
		sidePanelObj.setMinHeight(minHeight + "px");
		sidePanelObj.setHeight(minHeight + "px");
    }
};

/**
 * This method add the reading pane on page load and everytime there is a click to display the side panel.
 * Initializing the reading pane by adding the place holders for all the info.
 * After Initialization do the rendering with first row details.
 */
PrenatalLabComponent.prototype.addSidePanel = function() {
    var compID = this.getComponentId();
    var compNS = this.getStyles().getNameSpace();
    try {

        if (this.m_sidePanelContainer && this.m_sidePanelContainer.length) {
            // Create the side panel
            this.m_sidePanel = new CompSidePanel(compID, this.m_sidePanelContainer.attr("id"));
            this.m_sidePanel.setExpandOption(this.m_sidePanel.expandOption.EXPAND_DOWN);

            // Render the side panel
            this.m_sidePanel.renderPreBuiltSidePanel();
            $("#sidePanelHeaderText" + compID).addClass('hidden');

            //Setting the close function
            this.m_sidePanel.setCloseFunction(function() {
                $("#" + compID + "sidePanelContainer").removeClass("" + compNS + "-sidepanel-container").addClass("" + compNS + "-sidepanel-container-hide");
                $("#" + compID + "tableview").removeClass("" + compNS + "-table").addClass("" + compNS + "-table-expand");
                this.m_sidePanelVisible = false;
                this.reRenderSidePanel = true;
            });

            // Select the first row and render the respective details on reading pane.
            if (this.reRenderSidePanel === false) {
                this.selectDefaultRow(false);
                this.reRenderSidePanel = true;
                $("#" + compID + "sidePanelContainer").removeClass("" + compNS + "-sidepanel-container").addClass("" + compNS + "-sidepanel-container-hide");
                $("#" + compID + "tableview").removeClass("" + compNS + "-table").addClass("" + compNS + "-table-expand");
                this.m_sidePanelVisible = false;
                this.reRenderSidePanel = true;
            }
            this.resetSidePanelHeight();
        }
    } catch (err) {
        MP_Util.LogJSError(err, this, "preg-prenatal-labs-o2.js", "addSidePanel");
    }
};

/**
 * This method adds cell Click Extension 
 */
PrenatalLabComponent.prototype.addCellClickExtension = function() {

    var component = this;
    var cellClickExtension = new TableCellClickCallbackExtension();
    cellClickExtension.setCellClickCallback(function(event, data) {
        component.onRowClick(event, data);
    });
    this.prenatalTable.addExtension(cellClickExtension);
};

/**
 * This method check if the particular event_set_cd is in the input group.
 * @param { GrpIndex, Binds, Event Set Code}
 */
PrenatalLabComponent.prototype.isInGroup = function(grpIndex, binds, event_set_cd) {
    if (binds[grpIndex].LABS.length > 0) {
        var labsLength = binds[grpIndex].LABS.length;
        for (var lIndex = 0; lIndex < labsLength; lIndex++) {
            if (binds[grpIndex].LABS[lIndex].EVENT_SET_CD == event_set_cd) {
                return true;
            }
        }
    }
    return false;
};

/**
 * This method set the headers to collapse by default, 
 * if user doesnt provide expand collapse value.
 */
PrenatalLabComponent.prototype.setHeadersExpandCollapse = function() {
    if (!this.isValidString(this.getInitialCollapseBool())) {
        this.setInitialCollapseBool(false);
    }
    if (!this.isValidString(this.getLabsGroup1CollapseBool())) {
        this.getLabsGroup1CollapseBool(false);
    }
    if (!this.isValidString(this.getLabsGroup2CollapseBool())) {
        this.getLabsGroup2CollapseBool(false);
    }
    if (!this.isValidString(this.getLabsGroup3CollapseBool())) {
        this.getLabsGroup3CollapseBool(false);
    }
    if (!this.isValidString(this.getLabsGroup4CollapseBool())) {
        this.getLabsGroup4CollapseBool(false);
    }
    if (!this.isValidString(this.getLabsGroup5CollapseBool())) {
        this.getLabsGroup5CollapseBool(false);
    }
    if (!this.isValidString(this.getOptionalLabCollapseBool())) {
        this.getOptionalLabCollapseBool(false);
    }
};

/**
 * This method check what is to be shown(Error Message, Result) by
 * by checking the start and End week values for all the custom groups.
 * @param { Binds}
 */
PrenatalLabComponent.prototype.validateGroups = function(binds) {

    //0 is Initial Lab Group, 
    // It doesnot have start and end date
    var isOverlap = [false];
    var isGrpInvalid = [false];
    var startWeeks = [""];
    var endWeeks = [""];

    //Setting the start weeek values obtained from bedrock
    startWeeks[1] = this.getLabsGroup1StartWeek();
    startWeeks[2] = this.getLabsGroup2StartWeek();
    startWeeks[3] = this.getLabsGroup3StartWeek();
    startWeeks[4] = this.getLabsGroup4StartWeek();
    startWeeks[5] = this.getLabsGroup5StartWeek();

    //Setting the end weeek values obtained from bedrock
    endWeeks[1] = this.getLabsGroup1EndWeek();
    endWeeks[2] = this.getLabsGroup2EndWeek();
    endWeeks[3] = this.getLabsGroup3EndWeek();
    endWeeks[4] = this.getLabsGroup4EndWeek();
    endWeeks[5] = this.getLabsGroup5EndWeek();

    //If the start and end week input are null or invalid, then display an error message in that group
    // index starting from 1 as the 0 is initial group and it doesnt have start and end week values
    for (var index = 1; index <= 5; index++) {
        //Just check if the values are null or if end week is less than start week value
        if ((!this.isValidString(startWeeks[index]) || !this.isValidString(endWeeks[index]) ||
                parseInt(endWeeks[index], 10) < parseInt(startWeeks[index], 10)) &&
            binds[index].LABS.length > 0) {
            isGrpInvalid[index] = true;
        }

        //Iterate through all the groups and check if there is an overlapping group
        for (var endIndex = index + 1; endIndex <= 5; endIndex++) {
            if ((parseInt(endWeeks[index], 10) > parseInt(startWeeks[endIndex], 10)) &&
                binds[index].LABS.length > 0 && binds[endIndex].LABS.length > 0) {
                //All the labs in between the start and end week should get overlap message
                for (var overLapIndex = index; overLapIndex <= endIndex; overLapIndex++) {
                    isOverlap[overLapIndex] = true;
                }
            }
        }
        //If there is an overlapping group
        //Set the error Message for overlapping
        if (isGrpInvalid[index] === true) {
            binds[index].LABS = [];
            binds[index].LABS[0] = [];
            binds[index].LABS[0].RESULTS = [];
            binds[index].LABS[0].EVENT_SET_DISPLAY = this.INVALID_INPUT;
        } else if (isOverlap[index] === true) {
            binds[index].LABS = [];
            binds[index].LABS[0] = [];
            binds[index].LABS[0].RESULTS = [];
            binds[index].LABS[0].EVENT_SET_DISPLAY = this.OVERLAPPED_INPUT;
        }
    }
    return binds;
};

/**
 * This method calculates the estimated gestational age of patient but current gestational age
 * @Param {current gestational age, datetime}
 */
PrenatalLabComponent.prototype.getEgaAge = function(currentGestAge, dateTime) {
    var currentDate = new Date();
    //86400000 =  Number of milliseconds in a day
    var numOfMilliSecsInADay = 86400000;
    return (currentGestAge - Math.floor((currentDate.getTime() - dateTime.getTime()) / numOfMilliSecsInADay));
};

/**
 * This method assigns the group for all results type.
 * @param { Binds}
 */
PrenatalLabComponent.prototype.assignGroup = function(binds) {
    // Making use of shared resource "pregnancy Info" to calculate the EGA
    var dttmValue = new Date();
    var pregInfoSR = MP_Resources.getSharedResource("pregnancyInfo");
    var pregInfoObj = pregInfoSR.getResourceData();
    var currentGestAge = pregInfoObj.getGesAge();
    if (currentGestAge === 0) {
        currentGestAge = pregInfoObj.getDelGesAge();
    }
    this.currentGestAge = currentGestAge;
    var prenatalEGAweeks = '--';
    var prenatalEGDays = '--';
    
    // By default they are made Unassigned 
    // Provide the group in which they fall and thier EGA is in the group range
    // If the lab occurs more than once, then check if the particular result is in the range
    // Initial Labs : first value if set to Initial Lab for a lab, if it occurs in Initial Lab
    // If values occur in Initial Labs and some other group, the group which have the reading takes the priority.
    // If lab is present in Optional Labs section and (any other including optional Lab), The group will be optional Labs.
    // Same applies for Measurment/ docuements/ unclassified results.
    var bindLength = binds.length;
    for (var bIndex = 0; bIndex < bindLength; bIndex++) {
        var labsLength = binds[bIndex].LABS.length;
        for (var lIndex = 0; lIndex < labsLength; lIndex++) {
            var lab = binds[bIndex].LABS[lIndex];
            var resultLength = binds[bIndex].LABS[lIndex].RESULTS.length;
            for (var rIndex = 0; rIndex < resultLength; rIndex++) {

                //Assign group based on the EGA which is calculated here
                var measurLength = binds[bIndex].LABS[lIndex].RESULTS[rIndex].MEASUREMENTS.length;
                for (var mIndex = 0; mIndex < measurLength; mIndex++) {
                    var measurements = binds[bIndex].LABS[lIndex].RESULTS[rIndex].MEASUREMENTS[mIndex];
                    if (this.isValidString(measurements.DTTM)) {	
                        dttmValue.setISO8601(measurements.DTTM);

                        // Calculate Estimated Gestational Age 
                        if (currentGestAge > 0) {
                            var mEgaAge = this.getEgaAge(currentGestAge, dttmValue);
                            if (mEgaAge > 0) {
                                // 7 == number of days in a week
                                prenatalEGAweeks = Math.floor(mEgaAge / 7);
                                prenatalEGDays = Math.floor(mEgaAge % 7);
                            }
                            measurements.EGA = prenatalEGAweeks;
                            measurements.EGA_DAYS = prenatalEGDays;
                        }
                    }
                    //more logic on providing the groups, based on EGA weeks which are obtained above
                    measurements.GROUP = this.provideGroupOnEGA(measurements, binds, lab.EVENT_SET_CD,
                        bIndex, rIndex, mIndex, lIndex, measurLength);
                    binds[bIndex].LABS[lIndex].RESULTS[rIndex].MEASUREMENTS[mIndex] = measurements;
                }
                // end of measurements
                //Assign group based on the EGA which is calculated here
                var docLength = binds[bIndex].LABS[lIndex].RESULTS[rIndex].DOCUMENTS.length;
                for (var dIndex = 0; dIndex < docLength; dIndex++) {
                    var documents = binds[bIndex].LABS[lIndex].RESULTS[rIndex].DOCUMENTS[dIndex];
                    documents.DISPLAY_NAME = binds[bIndex].LABS[lIndex].EVENT_SET_DISPLAY;
                    if (this.isValidString(documents.EFFECTIVE_DATE)) {	
                        dttmValue.setISO8601(documents.EFFECTIVE_DATE);

                        // Calculate Estimated Gestational Age 
                        if (currentGestAge > 0) {
                            var dEgaAge = this.getEgaAge(currentGestAge, dttmValue);
                            if (dEgaAge > 0) {
                                // 7 == number of days in a week
                                prenatalEGAweeks = Math.floor(dEgaAge / 7);
                                prenatalEGDays = Math.floor(dEgaAge % 7);
                            }
                            documents.EGA = prenatalEGAweeks;
                            documents.EGA_DAYS = prenatalEGDays;
                        }
                    }
                    //more logic on providing the groups, based on EGA weeks which are obtained above
                    documents.GROUP = this.provideGroupOnEGA(documents, binds, lab.EVENT_SET_CD,
                        bIndex, rIndex, dIndex, lIndex, docLength);
                    binds[bIndex].LABS[lIndex].RESULTS[rIndex].DOCUMENTS[dIndex] = documents;
                }
                //End of documents
                //Assign group based on the EGA which is calculated here
                var unclassLength = binds[bIndex].LABS[lIndex].RESULTS[rIndex].UNCLASSIFIEDS.length;
                for (var uIndex = 0; uIndex < unclassLength; uIndex++) {
                    var unclassifieds = binds[bIndex].LABS[lIndex].RESULTS[rIndex].UNCLASSIFIEDS[uIndex];
                    unclassifieds.DISPLAY_NAME = binds[bIndex].LABS[lIndex].EVENT_SET_DISPLAY;
                    if (this.isValidString(unclassifieds.EFFECTIVE_DATE)) {
                        dttmValue.setISO8601(unclassifieds.EFFECTIVE_DATE);

                        // Calculate Estimated Gestational Age 
                        if (currentGestAge > 0) {
                            var uEgaAge = this.getEgaAge(currentGestAge, dttmValue);
                            if (uEgaAge > 0) {
                                // 7 == number of days in a week
                                prenatalEGAweeks = Math.floor(uEgaAge / 7);
                                prenatalEGDays = Math.floor(uEgaAge % 7);
                            }
                            unclassifieds.EGA = prenatalEGAweeks;
                            unclassifieds.EGA_DAYS = prenatalEGDays;
                        }
                    }
                    //more logic on providing the groups, based on EGA weeks which are obtained above
                    unclassifieds.GROUP = this.provideGroupOnEGA(unclassifieds, binds, lab.EVENT_SET_CD,
                        bIndex, rIndex, uIndex, lIndex, unclassLength);
                    binds[bIndex].LABS[lIndex].RESULTS[rIndex].UNCLASSIFIEDS[uIndex] = unclassifieds;
                }
                //end of unclassified
            }
        }
    }
    return binds;
};

/**
 * Returns lab group label based on group index.
 * 
 * @param groupIndex {Integer} - lab group index
 */
PrenatalLabComponent.prototype.getLabsGroupLabel = function(groupIndex) {
	switch(groupIndex) {
		case 0: return this.getInitialLabel();
		case 1: return this.getLabsGroup1Label();
		case 2: return this.getLabsGroup2Label();
		case 3: return this.getLabsGroup3Label();
		case 4: return this.getLabsGroup4Label();
		case 5: return this.getLabsGroup5Label();
		case 6: return this.getOptionalLabLabel();
	}
};

/**
 * This is a helper method which checks if the EGA falls in start and end week values
 * and assigns the group.
 * Exception :- 
 * 1) If a lab is in optional  the group is always Optional
 * 2) If a lab is in initial group the first result will always show Initial
 * 3) If a lab fall under multiple groups and initial the first value will be 
 *    the lab group (if it is ordered under that group).
 * @param { EGA, Binds, Event_Set_Cd , Result_Index , 
 * Index of(MEASURMENT/DOCUMENTS/UNCLASSIFIEDS) , length of result type}
 */
PrenatalLabComponent.prototype.provideGroupOnEGA = function(labData,
    binds, event_set_cd, bIndex, rIndex, index, lIndex, length) {

    var prenatali18n = i18n.discernabu.preg_prenatal_labs_o2;
    var ega = labData.EGA;
    //Get the saved lab data
    var savedLabResult = this.savedLabData[labData.EVENT_ID];
    var savedLabIndex = -1;
    var savedLabGroup = "";
    
    if(savedLabResult) {
    	savedLabIndex = this.getSavedLabDataRangeIndex(savedLabResult.SAVED_DATA);
    	//If the lab is saved by physician for a particular range (Group X), check whether the 
    	//lab mapped in bedrock for that particular range. If so, set saved lab group name.
        if(savedLabIndex != -1 && this.isInGroup(savedLabIndex, binds, event_set_cd)) {
        	savedLabGroup = this.getLabsGroupLabel(savedLabIndex);
        }
    }

    // The below code, assigns group w.r.t EGA and start and end inputs of a lab.
    var group = prenatali18n.SELECT;
    if (ega !== "") {
        var groupAssigned = false;
        if (this.isInGroup(1, binds, event_set_cd)) {
            groupAssigned = true;
            if (ega >= this.getLabsGroup1StartWeek() &&
                ega <= this.getLabsGroup1EndWeek()) {
                group = this.getLabsGroup1Label();
            }

            group = savedLabGroup ? savedLabGroup : group;
        }
        if (this.isInGroup(2, binds, event_set_cd)) {
            groupAssigned = true;
            if (ega >= this.getLabsGroup2StartWeek() &&
                ega <= this.getLabsGroup2EndWeek()) {
                group = this.getLabsGroup2Label();
            }

            group = savedLabGroup ? savedLabGroup : group;
        }
        if (this.isInGroup(3, binds, event_set_cd)) {
            groupAssigned = true;
            if (ega >= this.getLabsGroup3StartWeek() &&
                ega <= this.getLabsGroup3EndWeek()) {
                group = this.getLabsGroup3Label();
            }

            group = savedLabGroup ? savedLabGroup : group;
        }
        if (this.isInGroup(4, binds, event_set_cd)) {
            groupAssigned = true;
            if (ega >= this.getLabsGroup4StartWeek() &&
                ega <= this.getLabsGroup4EndWeek()) {
                group = this.getLabsGroup4Label();
            }

            group = savedLabGroup ? savedLabGroup : group;
        }
        if (this.isInGroup(5, binds, event_set_cd)) {
            groupAssigned = true;
            if (ega >= this.getLabsGroup5StartWeek() &&
                ega <= this.getLabsGroup5EndWeek()) {
                group = this.getLabsGroup5Label();
            }

            group = savedLabGroup ? savedLabGroup : group;
        }
        //Complex logic of setting group if  a group is in initial lab
        //as well as any other lab
        //Rule:If a lab occurs twice and that too one is in initial,
        //then the EGA where the lab actually is drawn gets the priority 
        //and the first lab drawn value is is set to group instaed of initial Lab
        if (this.isInGroup(0, binds, event_set_cd)) {
            if (rIndex === 0 && index === (length - 1)) {
                if ((bIndex === 0 && (groupAssigned === false ||
                        group == prenatali18n.SELECT))) {
                    group = this.getInitialLabel();
                }
                if (bIndex !== 0 && group == prenatali18n.SELECT) {
                    group = this.getInitialLabel();
                }
            }

            group = savedLabGroup ? savedLabGroup : group;
        }
        if (this.isInGroup(6, binds, event_set_cd)) {
            //Make all labs a soptional
            group = this.getOptionalLabLabel();
        }
    }
    return group;
};

/**
 * Initialize the variables used to store saved, declined lab and button actions.
 */
PrenatalLabComponent.prototype.initializeSavedAndDclinedData = function() {
	//Clear the saved and declined labs before processing from backend records
	this.savedLabData = [];
    this.declinedLabData = [];

	// Make ACTIONS button available (Save & Decline).
	this.actionPerformed = false;
};

/**
 * Get all the saved and declined lab results for all gestational ranges.
 */
PrenatalLabComponent.prototype.getSavedAndDeclinedLabData = function(records) {
	var dataLength = records.SAVED_LAB_DATA.EVENT_IDS.length;
	var dataIndex = 0;

	this.initializeSavedAndDclinedData();

	for(dataIndex = 0; dataIndex < dataLength; dataIndex++) {
		var eventIds = records.SAVED_LAB_DATA.EVENT_IDS[dataIndex];
		this.savedLabData[eventIds.EVENT_ID] = eventIds;
	}
	
	dataLength = records.SAVED_LAB_DATA.EVENT_CDS.length;

	for(dataIndex = 0; dataIndex < dataLength; dataIndex++) {
		var eventCds = records.SAVED_LAB_DATA.EVENT_CDS[dataIndex];
		this.declinedLabData[eventCds.EVENT_CD] = eventCds;
		this.declinedLabData[eventCds.EVENT_CD].isInValid = [];
	}
};

/**
 * Renders the Prenatal Labs component visuals. This method will be called
 * after Prenatal Labs has been initialized and setup (After retrieving
 * required resources and prenatal labs data).
 * 
 * @param records {array} - has the information on Prenatal Labs & Order details for 
 * which bedrock event sets are associated to.
 */
PrenatalLabComponent.prototype.renderComponent = function(records) {
	//Don't initialize the pending shared resource if the code is executed in
	//browser development - Because the extenal resource "PVFRAMEWORKLINK"
	//could only be retrieved from powerchart application.
	if (!CERN_BrowserDevInd) {
		this.initPendingSR();
	}

    var component = this;
    var compID = component.getComponentId();
    var compNS = component.getStyles().getNameSpace();
    var prenatali18n = i18n.discernabu.preg_prenatal_labs_o2;
    var prenatalHTML = "";
    var tableViewObj = null;
    var compContainerObj = null;
    var countText = "";
    var $sidePanelContainer = null;
    this.m_sidePanelVisible = false;

	(new CapabilityTimer("CAP:MPG.PrenatalLabs.O2", this.getCriterion().category_mean)).capture();
	var slaTimer = MP_Util.CreateTimer("CAP:MPG.PrenatalLabs.O2");
	if (slaTimer) {
		slaTimer.SubtimerName = this.criterion.category_mean;
		slaTimer.Stop();
	}

    try {
    	//Get all saved lab data - Direct Entry
        this.getSavedAndDeclinedLabData(records);

        // Main component container having both component table and reading pane.
        compContainerObj =
            $("<div></div>").attr("id", compID + "maincontainer").addClass(compNS + "-maincontainer");
        tableViewObj = $("<div id='" + compID + "tableview' class='" + compNS + "-table'>");

        // Get the component table (the first time this is called, it is created)
        component.prenatalTable = new ComponentTable();
        component.prenatalTable.setNamespace(compNS + compID);

        //Column details
        var labNameColInfo = {
            ID: "DISPLAY_NAME",
            CLASS: compNS + "-table-hdrDisp-col",
            DISPLAY: prenatali18n.LAB_NAME,
            RENDER_TEMPLATE: "DISPLAY_NAME"
        };
        var statusColInfo = {
            ID: "STATUS",
            CLASS: compNS + "-table-hdrStatus-col",
            DISPLAY: prenatali18n.RESULT + "/" + prenatali18n.STATUS,
            RENDER_TEMPLATE: "STATUS"
        };
        var dueColInfo = {
            ID: "DTTM",
            CLASS: compNS + "-table-hdrDttm-col",
            DISPLAY: prenatali18n.DATE,
            RENDER_TEMPLATE: "DTTM"
        };
        var gestAgeColInfo = {
            ID: "EGA_DISPLAY",
            CLASS: compNS + "-table-hdrEga-col",
            DISPLAY: prenatali18n.GESTATIONAL_AGE,
            RENDER_TEMPLATE: "EGA_DISPLAY"
        };
        var totalResColInfo = {
                ID: "TOTAL_RESULTS",
                CLASS: compNS + "-table-hdrTotal-col",
                DISPLAY: prenatali18n.TOTAL_RESULTS,
                RENDER_TEMPLATE: "TOTAL_RESULTS"
        };

        // Adding column
        var labcol = component.createColumn(labNameColInfo);
        var statcol = component.createColumn(statusColInfo);
        component.prenatalTable.addColumn(labcol);
        component.prenatalTable.addColumn(statcol);
        component.prenatalTable.addColumn(component.createColumn(dueColInfo));
        component.prenatalTable.addColumn(component.createColumn(gestAgeColInfo));
        component.prenatalTable.addColumn(component.createColumn(totalResColInfo));

        // Adding Cell click extension
        component.addCellClickExtension();

        // Creating bind data
        var binds = [];
        binds[0] = records.INITIAL;
        binds[1] = records.GROUP1;
        binds[2] = records.GROUP2;
        binds[3] = records.GROUP3;
        binds[4] = records.GROUP4;
        binds[5] = records.GROUP5;
        binds[6] = records.OPTIONAL_LABS;
        this.labBinds = binds;

        // validate the start and end week dates from bedrock
        binds = this.validateGroups(binds);

        

        binds = this.assignGroup(binds);
        //setting the default value if the expand collapse option is not provided by user
        component.setHeadersExpandCollapse();

        // Bind the results so that they can be rendered.
        component.processResultsForRender(binds);
        var tableGrp = null;
        var tableHeader = "";

        // Add Data to initial Lab; Here 0 means Initial Group, 
        //the value is provided while creating binds array.
        if (binds[0].LABS.length > 0) {
            tableGrp = new TableGroup();
            tableHeader = this.getInitialLabel();
            tableGrp.setDisplay(tableHeader).setGroupId("initialLab").setShowCount(false);
            tableGrp.setDisplay(tableHeader).setIsExpanded(this.getInitialCollapseBool());
            tableGrp.bindData(binds[0].LABS);
            component.prenatalTable.addGroup(tableGrp);
        }
        // Add Data to lab group 1 to group 5
        for (var grpIndex = 1; grpIndex <= 5; grpIndex++) {

            var headerCollapse = false;
            var label = "";
            //getting the label/header and collapse/expand detail for each group
            switch (grpIndex) {
                case 1:
                    headerCollapse = this.getLabsGroup1CollapseBool();
                    label = this.getLabsGroup1Label();
                    break;
                case 2:
                    headerCollapse = this.getLabsGroup2CollapseBool();
                    label = this.getLabsGroup2Label();
                    break;
                case 3:
                    headerCollapse = this.getLabsGroup3CollapseBool();
                    label = this.getLabsGroup3Label();
                    break;
                case 4:
                    headerCollapse = this.getLabsGroup4CollapseBool();
                    label = this.getLabsGroup4Label();
                    break;
                case 5:
                    headerCollapse = this.getLabsGroup5CollapseBool();
                    label = this.getLabsGroup5Label();
                    break;
            }
            if (binds[grpIndex].LABS.length > 0) {
                tableGrp = new TableGroup();
                if (binds[grpIndex].LABS[0].EVENT_SET_DISPLAY === this.INVALID_INPUT) {
                    //Check if there is an invalid group value for start and end date
                    tableHeader = prenatali18n.GROUP + " " + grpIndex + " : " + prenatali18n.DATE_ERRORMSG;
                    tableGrp.setDisplay(tableHeader).setIsExpanded(false);
                } else if (binds[grpIndex].LABS[0].EVENT_SET_DISPLAY === this.OVERLAPPED_INPUT) {
                    //Check if there is an overlapping value for start and end date
                    tableHeader = prenatali18n.GROUP + " " + grpIndex + " : " + prenatali18n.OVERLAP_ERRORMSG;
                    tableGrp.setDisplay(tableHeader).setIsExpanded(false);
                } else {
                    tableHeader = label;
                    tableGrp.bindData(binds[grpIndex].LABS);
                    tableGrp.setDisplay(tableHeader).setIsExpanded(headerCollapse);
                }
                tableGrp.setDisplay(tableHeader).setGroupId("labGrp" + grpIndex).setShowCount(false);
                component.prenatalTable.addGroup(tableGrp);
            }
        }
        //Add Data to optional lab; Here 6 means Optional Group, 
        //the value is provided while creating binds array. 
        if (binds[6].LABS.length > 0) {
            tableGrp = new TableGroup();
            tableHeader = this.getOptionalLabLabel();
            tableGrp.setDisplay(tableHeader).setGroupId("optionalLab").setShowCount(false);
            tableGrp.setDisplay(tableHeader).setIsExpanded(this.getOptionalLabCollapseBool());
            tableGrp.bindData(binds[6].LABS);
            component.prenatalTable.addGroup(tableGrp);
        }

        //Adding Group toggle, so the height of side panel is set
        //dynamically when the group is expanded or collapsed.
        var grpToggleExtension = new TableGroupToggleCallbackExtension();
        grpToggleExtension.setGroupToggleCallback(function(event, data) {
            component.resetSidePanelHeight();
        });
        component.prenatalTable.addExtension(grpToggleExtension);

        // Bind the data to the results
        component.prenatalTable.bindData(binds);

        // Store off the component table
        component.setComponentTable(component.prenatalTable);

        // Append the recommendationsTable object to table view
        tableViewObj.append($(component.prenatalTable.render()));

        // Create the side panel container
        $sidePanelContainer = $("<div id='" + compID + "sidePanelContainer' class='" + compNS + "-sidepanel-container'/>");

        // Append both table view and reading pane to main container
        compContainerObj.append(tableViewObj, $sidePanelContainer);

        // Append the main container markup to component markup
        prenatalHTML +="<div class='prenatal-disclaimer'><span class = 'prenatal-labs-result-indicator'></span><span class = 'prenatal-labs-not-assigned-indicator-text'> " + prenatali18n.RESULT_INDICATOR +"</span></div>";
        prenatalHTML += compContainerObj[0].outerHTML;
        countText = MP_Util.CreateTitleText(component, binds.length);

        // Finalize the component
        component.finalizeComponent(prenatalHTML, countText);

        // Addiing tabeleview nad sidePanelcontainer to component;
        component.m_tableView = $("#" + compID + "tableview");
        component.m_sidePanelContainer = $("#" + compID + "sidePanelContainer");

        // Add the preview pane. Included here as
        // DOM elements does not exist until finalize.
        this.reRenderSidePanel = false;
        component.addSidePanel();
        component.resetSidePanelHeight();
    } catch (err) {
        MP_Util.LogJSError(err, this, "preg-prenatal-labs-o2.js", "renderComponent");
    }
};