/* global CERN_AC_O1 */
/* eslint mp-camelcase:[1, "cp_mpage", "date_qual_cnt", "warfarin_settings", "CERN_BrowserDevInd", "prescriptions_by_order", "order_id", "discontinued_by_order", "pres_order_id"] */
/* eslint complexity:0 */

function AcComponentStyle() {
    this.initByNamespace("ac");
}

AcComponentStyle.inherits(ComponentStyle);

/**
 * The Anti-Coagulation Component
 *
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 */
function AcComponent(criterion) {

    this.setCriterion(criterion);
    this.setStyles(new AcComponentStyle());
    this.setScope(1);
    this.m_compObject = {
        cvObject: [],
        cvModRootId: null,
        cvCompId: null,
        cvCompSec: null,
        sec: "",
        criterion: null
    };
    //These are the default values to store user preferences for graph legend and table legend
    this.m_ptCheckbox = -1;
    this.m_takenCheckbox = -1;
    this.m_administeredCheckbox = -1;
    this.m_prescribedCheckbox = -1;
    this.m_discontinuedCheckbox = -1;
    this.m_takenToggle = -1;
    this.m_administeredToggle = -1;
    this.m_prescribedToggle = -1;
    this.m_discontinuedToggle = -1;
    //These are the INR code values that should be sent to CCL during data retrieval
    this.m_inrCodes = [];
    //These are the PT code values that should be sent to CCL during data retrieval
    this.m_ptCodes = [];
    //These are the Goal INR High code values that should be sent to CCL during data retrieval
    this.m_goalInrHighCodes = [];
    //These are the Goal INR Low code values that should be sent to CCL during data retrieval
    this.m_goalInrLowCodes = [];
    //These are the Indication for Treatment code values that should be sent to CCL during data retrieval
    this.m_indTreatCodes = [];
    //These are the Anticipated End Date code values that should be sent to CCL during data retrieval
    this.m_antiDateCodes = [];
    //These are the 7 Day Total code values that should be sent to CCL during data retrieval
    this.m_7DayTotalCodes = [];
    //These are the Warfarin catalog code values that should be sent to CCL during data retrieval
    this.m_warfarinCodes = [];

    window.cp_mpage = criterion.category_mean;

    AcComponent.method("getPrefJson", function() {
        var json = {"WARFARIN_MGT_PREFS":
            {
               "PT_CHECKBOX_PREF": this.m_ptCheckbox,
               "TAKEN_CHECKBOX_PREF": this.m_takenCheckbox,
               "ADMINISTERED_CHECKBOX_PREF": this.m_administeredCheckbox,
               "PRESCRIBED_CHECKBOX_PREF": this.m_prescribedCheckbox,
               "DISCONTINUED_CHECKBOX_PREF": this.m_discontinuedCheckbox,
               "TAKEN_TOGGLE_PREF": this.m_takenToggle,
               "ADMINISTERED_TOGGLE_PREF": this.m_administeredToggle,
               "PRESCRIBED_TOGGLE_PREF": this.m_prescribedToggle,
               "DISCONTINUED_TOGGLE_PREF": this.m_discontinuedToggle
            }
         };
      return json;
    });

    AcComponent.method("InsertData", function() {
        this.acHelper.GetCvTable(this);
    });
    AcComponent.method("HandleSuccess", function(conditionData) {
        this.acHelper.RenderComponent(this, conditionData);
    });
    // This returns the goalInrCount for low and high
    AcComponent.method("getGoalInrCodeCnt", function() {
        var goalHighCodeCnt = this.m_goalInrHighCodes.length;
        var goalLowCodeCnt = this.m_goalInrLowCodes.length;
        return [goalHighCodeCnt, goalLowCodeCnt];
    });

    this.acHelper = CERN_AC_O1();
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
AcComponent.prototype = new MPageComponent();
AcComponent.prototype.constructor = MPageComponent;

/**
 * Map the Anti-Coagulation Component object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "ANTI_COAG" filter
 */
MP_Util.setObjectDefinitionMapping("ANTI_COAG", AcComponent);
MP_Util.setObjectDefinitionMapping("WF_ANTI_COAG", AcComponent);

AcComponent.inherits(MPageComponent);

/**
 * Sets the code values for INR as setup in bedrock.
 * @param {[float]} inrCodes : An array of code values for INR as setup in bedrock.
 */
AcComponent.prototype.setInrCodes = function(inrCodes) {
    this.m_inrCodes = inrCodes;
};

/**
 * Returns the code values for INR as setup in bedrock.
 * @return {[float]}: An array of code values for INR as setup in bedrock.
 */
AcComponent.prototype.getInrCodes = function() {
    return this.m_inrCodes;
};

/**
 * Sets the code values for PT as setup in bedrock.
 * @param {[float]} ptCodes : An array of code values for PT as setup in bedrock.
 */
AcComponent.prototype.setPtCodes = function(ptCodes) {
    this.m_ptCodes = ptCodes;
};

/**
 * Returns the code values for INR as setup in bedrock.
 * @return {[float]}: An array of code values for INR as setup in bedrock.
 */
AcComponent.prototype.getPtCodes = function() {
    return this.m_ptCodes;
};

/**
 * Sets the code values for Goal INR High as setup in bedrock.
 * @param {[float]} goalInrHighCodes : An array of code values for Goal INR High as setup in bedrock.
 */
AcComponent.prototype.setGoalInrHighCodes = function(goalInrHighCodes) {
    this.m_goalInrHighCodes = goalInrHighCodes;
};

/**
 * Returns the code values for Goal INR High as setup in bedrock.
 * @return {[float]}: An array of code values for Goal INR High as setup in bedrock.
 */
AcComponent.prototype.getGoalInrHighCodes = function() {
    return this.m_goalInrHighCodes;
};

/**
 * Sets the code values for Goal INR Low as setup in bedrock.
 * @param {[float]} goalInrLowCodes : An array of code values for Goal INR Low as setup in bedrock.
 */
AcComponent.prototype.setGoalInrLowCodes = function(goalInrLowCodes) {
    this.m_goalInrLowCodes = goalInrLowCodes;
};

/**
 * Returns the code values for Goal INR Low as setup in bedrock.
 * @return {[float]}: An array of code values for Goal INR Low as setup in bedrock.
 */
AcComponent.prototype.getGoalInrLowCodes = function() {
    return this.m_goalInrLowCodes;
};

/**
 * Sets the code values for Indication for Treatment as setup in bedrock.
 * @param {[float]} indTreatCodes : An array of code values for Indication for Treatment as setup in bedrock.
 */
AcComponent.prototype.setIndTreatCodes = function(indTreatCodes) {
    this.m_indTreatCodes = indTreatCodes;
};

/**
 * Returns the code values for Indication for Treatment as setup in bedrock.
 * @return {[float]}: An array of code values for Indication for Treatment as setup in bedrock.
 */
AcComponent.prototype.getIndTreatCodes = function() {
    return this.m_indTreatCodes;
};

/**
 * Sets the code values for Anticipated End Date as setup in bedrock.
 * @param {[float]} antiDateCodes : An array of code values for Anticipated End Date as setup in bedrock.
 */
AcComponent.prototype.setAntiDateCodes = function(antiDateCodes) {
    this.m_antiDateCodes = antiDateCodes;
};

/**
 * Returns the code values for Anticipated End Date as setup in bedrock.
 * @return {[float]}: An array of code values for Anticipated End Date as setup in bedrock.
 */
AcComponent.prototype.getAntiDateCodes = function() {
    return this.m_antiDateCodes;
};

/**
 * Sets the code values for 7 Day Total as setup in bedrock.
 * @param {[float]} DayTotalCodes : An array of code values for 7 Day Total as setup in bedrock.
 */
AcComponent.prototype.set7DayTotalCodes = function(DayTotalCodes) {
    this.m_7DayTotalCodes = DayTotalCodes;
};

/**
 * Returns the code values for 7 Day Total as setup in bedrock.
 * @return {[float]}: An array of code values for 7 Day Total as setup in bedrock.
 */
AcComponent.prototype.get7DayTotalCodes = function() {
    return this.m_7DayTotalCodes;
};

/**
 * Sets the catalog code values for Warfarin as setup in bedrock.
 * @param {[float]} warfarinCodes : An array of catalog code values for Warfarin as setup in bedrock.
 */
AcComponent.prototype.setWarfarinCodes = function(warfarinCodes) {
    this.m_warfarinCodes = warfarinCodes;
};

/**
 * Returns the catalog code values for Warfarin as setup in bedrock.
 * @return {[float]}: An array of catalog code values for Warfarin as setup in bedrock.
 */
AcComponent.prototype.getWarfarinCodes = function() {
    return this.m_warfarinCodes;
};


/**
 * Creates the filterMappings that will be used when loading the component's bedrock settings
 */
AcComponent.prototype.loadFilterMappings = function(){
    //Add the filter mapping object for the med Codes
    this.addFilterMappingObject("ANTI_COAG_INR", {
        setFunction: this.setInrCodes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });
    //Add the filter mapping object for the lab Codes
    this.addFilterMappingObject("ANTI_COAG_PT", {
        setFunction: this.setPtCodes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });
    //Add the filter mapping object for the med Codes
    this.addFilterMappingObject("ANTI_COAG_GOAL_INR_HIGH", {
        setFunction: this.setGoalInrHighCodes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });
    //Add the filter mapping object for the lab Codes
    this.addFilterMappingObject("ANTI_COAG_GOAL_INR_LOW", {
        setFunction: this.setGoalInrLowCodes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });
    //Add the filter mapping object for the med Codes
    this.addFilterMappingObject("ANTI_COAG_TREATMENT", {
        setFunction: this.setIndTreatCodes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });
    //Add the filter mapping object for the med Codes
    this.addFilterMappingObject("ANTI_COAG_END_DATE", {
        setFunction: this.setAntiDateCodes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });
    //Add the filter mapping object for the lab Codes
    this.addFilterMappingObject("ANTI_COAG_7DAY_TOTAL", {
        setFunction: this.set7DayTotalCodes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });
    //Add the filter mapping object for the med Codes
    this.addFilterMappingObject("ANTI_COAG_WARFARIN", {
        setFunction: this.setWarfarinCodes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });

    // for workflow components
    //Add the filter mapping object for the med Codes
    this.addFilterMappingObject("WF_ANTI_COAG_INR", {
        setFunction: this.setInrCodes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });
    //Add the filter mapping object for the lab Codes
    this.addFilterMappingObject("WF_ANTI_COAG_PT", {
        setFunction: this.setPtCodes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });
    //Add the filter mapping object for the med Codes
    this.addFilterMappingObject("WF_ANTI_COAG_GOAL_INR_HIGH", {
        setFunction: this.setGoalInrHighCodes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });
    //Add the filter mapping object for the lab Codes
    this.addFilterMappingObject("WF_ANTI_COAG_GOAL_INR_LOW", {
        setFunction: this.setGoalInrLowCodes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });
    //Add the filter mapping object for the med Codes
    this.addFilterMappingObject("WF_ANTI_COAG_TREATMENT", {
        setFunction: this.setIndTreatCodes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });
    //Add the filter mapping object for the med Codes
    this.addFilterMappingObject("WF_ANTI_COAG_END_DATE", {
        setFunction: this.setAntiDateCodes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });
    //Add the filter mapping object for the lab Codes
    this.addFilterMappingObject("WF_ANTI_COAG_7DAY_TOTAL", {
        setFunction: this.set7DayTotalCodes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });
    //Add the filter mapping object for the med Codes
    this.addFilterMappingObject("WF_ANTI_COAG_WARFARIN", {
        setFunction: this.setWarfarinCodes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });
};

/**
 * This function is called before anything happens in this component.
 * its a overridden function of the parent class (MPageComponent).
*/
AcComponent.prototype.preProcessing = function(){
    if(this.getStyles().getComponentType() === CERN_COMPONENT_TYPE_WORKFLOW){
        //Load and render timers for workflow component
        this.setComponentLoadTimerName("USR:MPG.ANTICOAG.O2 - load component");
        this.setComponentRenderTimerName("ENG:MPG.ANTICOAG.O2 - render component");
    }
    else{
        //Load and render timers for summary component
        this.setComponentLoadTimerName("USR:MPG.ANTICOAG.O1 - load component");
        this.setComponentRenderTimerName("ENG:MPG.ANTICOAG.O1 - render component");
    }
};

/**
 * This function flexes the width and height and other properties of various elements
 * inside component.
 * @param {parentElem} : Reference to the root element of the component
 * @param {executeFlag}: To decide whether some part of the function gets executed or not.
*/

AcComponent.prototype.resizeComponent = function(){
    var parentElem = Util.Style.g("acOuterComponent", this.m_compObject.cvCompSec, "div")[0];
    var yaxisRef = _g("yaxis" + this.m_compObject.cvCompId);
    var graphContainLeftRef = Util.Style.g("graphContainerLeft", parentElem, "div")[0];
    var legendRef = Util.Style.g("ac-legend-wrapper", parentElem, "div")[0];
    var yaxisRight = 0;
    var acGraphContainerRef = Util.Style.g("acGraphContainer", parentElem, "div")[0];
    var graphRef = Util.Style.g("acGraph", acGraphContainerRef, "div")[0];
    var graphWidth = $(graphRef).width();
    var parentElemWidth = $(parentElem).outerWidth();
    var newGraphContWidth = 0;
    var newGraphContLeftWidth = 0;
    var tempNewGraphContWidth = 0;
    var availableWidth = 0;

    //call the baseclass function
    MPageComponent.prototype.resizeComponent.call(this, null);

    if(parentElem){
        //alter the width of graphcontainer anf graphlegends container
        // 74 = width of y2Axis + width of 7 day total image on the right
        availableWidth = parentElemWidth - 74 - parseFloat($(parentElem).css("padding-left"));
        newGraphContLeftWidth = availableWidth * 0.19;
        tempNewGraphContWidth = availableWidth * 0.77;
        if(graphWidth < tempNewGraphContWidth){
            var diff = tempNewGraphContWidth - graphWidth - 10;
            newGraphContWidth = graphWidth + 10;

            newGraphContLeftWidth = newGraphContLeftWidth + diff;
        }
        else{
            newGraphContWidth = tempNewGraphContWidth;
        }
        $(graphContainLeftRef).width(newGraphContLeftWidth);
        $(acGraphContainerRef).width(newGraphContWidth);

        //To make the y-axis stick to the graph
        yaxisRight = $(graphContainLeftRef).width() - $(legendRef).width() - 58;
        yaxisRef.style.right = -Math.abs(yaxisRight) + "px";

        //Make the table line up with the table legend on the left
        var tableLegendRef = _g("acTableLegends" + this.m_compObject.cvCompId);
        var tableLabRef = _g("acLabTable" + this.m_compObject.cvCompId);

        if(tableLegendRef.offsetTop !== tableLabRef.offsetTop){
            var newTop = tableLegendRef.offsetTop - tableLabRef.offsetTop;
            var tableSpaceRef = _g("acTableSpace" + this.m_compObject.cvCompId);
            var tableSpaceHeight = $(tableSpaceRef).height();
            newTop = tableSpaceHeight + newTop;
            newTop = newTop > 0 ? newTop : 0;
            $(tableSpaceRef).height(newTop);
        }

        //Adjust the position of scrollbar to be on right always
        $(acGraphContainerRef).scrollLeft(graphWidth);
    }
};

/**
 * Calculate graph lookback dates and return the previous date - current date display
 * @param {Number} lookBackUnit - The unit for the lookback
 * @param {Number} lookBackUnitTypeFlag - Lookback type flag
 * @returns {String} A string which contains lookback date range for graph
 */
AcComponent.prototype.displayDates = function(lookBackUnit, lookBackUnitTypeFlag){
    var previousDate = new Date();
    var currentDate = new Date();

    switch(lookBackUnitTypeFlag){
        case 1: //hours
            previousDate.setHours(previousDate.getHours() - lookBackUnit);
            break;

        case 2: //days
            previousDate.setDate(previousDate.getDate() - lookBackUnit);
            break;

        case 3: //weeks
            previousDate.setDate(previousDate.getDate() - lookBackUnit * 7);
            break;

        case 4: //months
            previousDate.setMonth(previousDate.getMonth() - lookBackUnit);
            break;

        case 5: //years
            previousDate.setYear(previousDate.getFullYear() - lookBackUnit);
            break;

        default:
            previousDate.setMonth(previousDate.getMonth() - 3);
    }

    return previousDate.format(dateFormat.masks.mediumDate) + " - " + currentDate.format(dateFormat.masks.mediumDate);
};

/**
 * This function reloads the whole component. Overriding the base function.
 * @return {undefined}
*/
AcComponent.prototype.refreshComponent = function(){
    this.acHelper.refresh();
    MPageComponent.prototype.refreshComponent.call(this);
};

/**
 * Anti-coagulation methods
 * @dependencies Script: MP_ANTICOAG_GRAPH_RSLTS
 */
var CERN_AC_O1 = function() {
    //Variable declarations
    var acI18n = i18n.discernabu.anti_coagulation_o1;
    var graphPlot
    ,yaxisPlot
    ,y2axisPlot
    ,recordData = acI18n.RecordData
    ,graphData = []
    ,graphSeries = []
    ,minYaxis = 0
    ,maxYaxis = 5
    ,minY2axis = 0
    ,maxY2axis = 5
    ,y2AxisInterval = 1
    ,y1AxisInterval = 1
    ,maxGoalINR = 0
    ,maxINR = 0
    ,maxPT = 0
    ,maxAdmin = 0
    ,maxPres = 0
    ,maxDisc = 0
    ,highSeriesGoalInr = []
    ,lowSeriesGoalInr = []
    ,inrLbl = acI18n.InrLBL
    ,goalInrLbl = acI18n.GoalInr
    ,ptLbl = acI18n.PT
    ,takenLbl = acI18n.Taken
    ,adminLbl = acI18n.Administered
    ,prescLbl = acI18n.Prescribed
    ,warfarinLbl = acI18n.Warfarin
    ,discLbl = acI18n.Discountinued
    ,labLbl = acI18n.Labs
    ,heldLbl = acI18n.Held
    ,specialInstLbl = acI18n.SpecialInstruction
    ,indicationForTreatmentLbl = acI18n.Indication
    ,anticipatedEndDateLbl = acI18n.Anticipated
    ,bedrockConfigError = acI18n.Bedrock
    ,graphLegendLbl = acI18n.GraphLegend
    ,graphLegend = []
    ,dateQual = []
    ,prescriptions_by_order = {}
    ,discontinued_by_order = {}
    ,dismedcnt = 0
    ,graphNotDisplay = acI18n.GraphNotDisplay //"Graph not displaying all meds, review table details"
    ,canvasOverlayArr = []
    ,presTableHd = {}
    ,discTableHd = {};


    var shapes = ["filledSquare", "x", "filledRectHorizontal", "filledTriangleUp", "filledStar", "filledDiamond", "filledCircle", "filledTriangleDown"];

/*
 *  This object represents an item in the legend.
 *
 *  @param {string} grouping : represents the group for this legend item i.e. Goal INR/INR/PT/Taken/Administered etc.
 *  @param {boolean} header : flag to print legend item as header
 */
    function legendItem(grouping, headFlag){
        var self = this;

        if(headFlag == undefined) {
            headFlag = false;
        }

        //the label to be displayed on the legend
        self.label = grouping;
        //the minimum value for the series
        self.min = 999999.0;
        //the maximum value for the series
        self.max = 0.0;
        //the units for the series
        self.units = "";
        //an array of indices corresponding to graphPlot.series
        self.indices = [];
        //flag to print legendItem as a header instead
        self.header = headFlag;
        //css icon class legend item
        self.iconClass = "series_icons";
        self.iconId = "";
        //show/hide the checkbox
        self.checkbox = true;
        //special legend is for held and special instruction
        self.specialLegend = false;
        //color of the series
        self.shape = "";
        //color of the series symbol
        self.color = "";
        //Flag to diaply the range or not
        self.isNotEmpty = true;

        self.getVisibleLabel = function(){
            var container = Util.cep("div", {
                "className": "ac-legendItem"
            }),
            iconEl,
            labelEl,
            textVal,
            rangeEl,
            unitsEl,
            checkEl;

            if(this.header){
                container.className += " ac-legendHeader";
                container.innerText = this.label;
            } else {
                if (this.specialLegend) {
                    container.className += " ac-special-legend";
                    if (this.iconClass !== "") {
                    //Hard coded class names that link to static images. Removed <canvas> tags.
                            switch(grouping)
                            {
                                case specialInstLbl:
                                    iconEl = Util.cep("div", {className: "ac-specialinstructionsIcon"});
                                    break;
                                case heldLbl:
                                    iconEl = Util.cep("div", {className: "ac-heldIcon"});
                            }
                        iconEl.style.display = "inline-block";
                        iconEl.style.position = "relative";
                        Util.ac(iconEl, container);
                    }
                    labelEl = Util.cep("span", {
                        className: "ac-legendLabel"
                    });
                    labelEl.innerText = this.label;
                    Util.ac(labelEl, container);
                } else {
                    if (this.checkbox) {
                        checkEl = Util.cep("input", {
                            type: "checkbox",
                            name: "ac-legendCheck",
                            checked: true
                        });
                        Util.ac(checkEl, container);
                    }
                    if (this.iconClass !== "") {
                        //Hard coded class names that link to static images. Removed <canvas> tags.
                        switch(grouping)
                            {
                                case ptLbl:
                                    iconEl = Util.cep("div", {className: "ac-PTIcon"});
                                    break;
                                case takenLbl:
                                    iconEl = Util.cep("div", {className: "ac-takenIcon"});
                                    break;
                                case goalInrLbl:
                                    iconEl = Util.cep("div", {className: "ac-goalINRIcon"});
                                    break;
                                case adminLbl:
                                    iconEl = Util.cep("div", {className: "ac-administeredIcon"});
                                    break;
                                case prescLbl:
                                    iconEl = Util.cep("div", {className: "ac-prescribedIcon"});
                                    break;
                                case discLbl:
                                    iconEl = Util.cep("div", {className: "ac-discontinuedIcon"});
                                    break;
                                case inrLbl:
                                    iconEl = Util.cep("div", {className: "ac-INRIcon"});
                                    break;
                                case graphNotDisplay:
                                    iconEl = Util.cep("div", {className: "ac-graphNotDisplayIcon"});
                                    break;
                                default:
                                    iconEl = Util.cep("div", {className: ""});
                            }
                        iconEl.style.display = "inline-block";
                        iconEl.style.position = "relative";
                        Util.ac(iconEl, container);
                    }
                    labelEl = Util.cep("span", {
                        className: "ac-legendLabel"
                    });
                    labelEl.innerText = this.label;
                    Util.ac(labelEl, container);
                    if (this.isNotEmpty) {
                        textVal = ["[", this.min, "-", this.max, "]"];
                        rangeEl = Util.cep("span", {
                            className: "ac-legendRange"
                        });
                        rangeEl.innerText = textVal.join("");
                        Util.ac(rangeEl, container);
                    }
                    if (this.units !== "" && this.isNotEmpty) {
                        textVal = ["(", this.units, ")"];
                        unitsEl = Util.cep("span", {
                            className: "ac-legendUnits within"
                        });
                        unitsEl.innerText = textVal.join("");
                        Util.ac(unitsEl, container);
                    }
                }
            }
            return container;
        };
        return self;
    }

/**
 * This function designs the container and the skull of the component and then makes call to different function.
 *
 * @param {component} component
 */
    function graphcontain(component){
        var bodyHTML = []
        ,errorSource = ""
        ,contentNode = Util.Style.g("sec-hd", component.getRootComponentNode())[0]
        ,componentWidth = contentNode.offsetWidth - 20
        ,graphContainerLeft = 300
        ,yaxisWidth = 60
        ,y2axisWidth = 50
        ,graphContainerWidth
        ,date_qual_cnt = recordData.DATE_QUAL_CNT
        ,warfarin_settings = recordData.SETTINGS
        ,graphWidth = 110 * date_qual_cnt
        ,acTakenClass = component.criterion.locale_id.toUpperCase();

        try{
            if(warfarin_settings !== null){
                component.m_ptCheckbox = warfarin_settings.PT_CHECKBOX_PREF;
                component.m_takenCheckbox = warfarin_settings.TAKEN_CHECKBOX_PREF;
                component.m_administeredCheckbox = warfarin_settings.ADMINISTERED_CHECKBOX_PREF;
                component.m_prescribedCheckbox = warfarin_settings.PRESCRIBED_CHECKBOX_PREF;
                component.m_discontinuedCheckbox = warfarin_settings.DISCONTINUED_CHECKBOX_PREF;
                component.m_takenToggle = warfarin_settings.TAKEN_TOGGLE_PREF;
                component.m_administeredToggle = warfarin_settings.ADMINISTERED_TOGGLE_PREF;
                component.m_prescribedToggle = warfarin_settings.PRESCRIBED_TOGGLE_PREF;
                component.m_discontinuedToggle = warfarin_settings.DISCONTINUED_TOGGLE_PREF;
            }
            if(recordData.DATE_QUAL_CNT != 0){
                graphContainerWidth = componentWidth - yaxisWidth - y2axisWidth - graphContainerLeft - 50;
                if(graphWidth < graphContainerWidth){
                    graphContainerWidth = graphWidth;
                }

                errorSource = "graphDataCollection";
                graphDataCollection(component);

                errorSource = "buildingSkeleton";

                bodyHTML = [
                    "<div class='content-body acOuterComponent' style='background-color:#F0F1F2;'>",
                    "<div class='acDispHeader acheader'>" + displayHeaderView(component.getGoalInrCodeCnt()) + "</div>",
                    "<div class = 'graphContainerLeft acOuterBorder'>",
                    "<div class='ac-legend-wrapper'><div id='dmGraphLegend" + component.m_compObject.cvCompId + "'><div>", graphLegendLbl, "</div></div></div>",
                    "<div class = 'ac-yaxis-wrapper'><div id='yaxis" + component.m_compObject.cvCompId + "' class = 'ac-yaxis'></div></div>",
                    "<div id='acTableLegends" + component.m_compObject.cvCompId + "' class='ac-table-legend'></div>",
                    "<div class='acdisplayDates'>" + component.displayDates(component.getLookbackUnits(), component.getLookbackUnitTypeFlag()) + "</div>",
                    "<div class='acrecordBegins'>" + recordBeginsFrom() + "</div></div>",
                    "<div id='acGraphContainer" + component.m_compObject.cvCompId + "' class = 'acGraphContainer acOuter' >",
                    "<div id='acGraph" + component.m_compObject.cvCompId + "' class = 'acGraph' style=' width:" + graphWidth + "px; '></div>",
                    "<div id='acDate" + component.m_compObject.cvCompId + "' style=' width:" + graphWidth + "px; ' >" + dateTimeView() + "</div>",
                    "<div id='acTableSpace" + component.m_compObject.cvCompId + "' class='ac-table-space'>&nbsp</div>",
                    "<div id='acLabTable" + component.m_compObject.cvCompId + "' style=' width:" + graphWidth + "px; ' >" + labTable() + "</div>",
                    "<div id='warfarinTakenMedTotal" + component.m_compObject.cvCompId + "' style=' width:" + graphWidth + "px; ' >" + wfTakenMedTotalView(component) + "</div>",
                    "<div id='warfarinAdministered" + component.m_compObject.cvCompId + "' style=' width:" + graphWidth + "px; ' >" + wfAdministeredView(component) + "</div>",
                    "<div id='acActivePrescribed" + component.m_compObject.cvCompId + "' style=' width:" + graphWidth + "px; ' >" + activePrescribed(component) + "</div>",
                    "<div id='acDiscPrescribed" + component.m_compObject.cvCompId + "' style=' width:" + graphWidth + "px; ' >" + discontinuedPrescribed(component) + "</div>",
                    "</div>",
                    "<div class = 'ac-y2axis'><div id='y2axis" + component.m_compObject.cvCompId + "' class = 'ac-y2axis-inner'></div></div>",
                    "<div class = 'acTakenTotal'><span class='", acTakenClass, "'></span></div>",
                    "</div>"
                ];
                errorSource = "FinalizeComponent with data";
                MP_Util.Doc.FinalizeComponent(bodyHTML.join(""), component, "");


                errorSource = "plotGraph";
                plotGraph(component);

                errorSource = "graphLegendCreation";
                graphLegendCreation(component);


                errorSource = "tableLegend";
                tableLegend(component);
                toggleSpreadsheet(_g("acTableLegends" + component.m_compObject.cvCompId), component);

                errorSource = "createYAxes";
                createYAxes(component);
                setYAxesParams(5, minYaxis, maxYaxis, minY2axis, maxY2axis);
            }
            else{
                errorSource = "FinalizeComponent without data";
                MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), component, "");
            }
        }
        catch (err) {
                alert(errorSource + ": " + err.description);
                throw err;
            }
    }

/**
 * find out graph starting date and display it
 * @returns {String} A string which contains graph starting date
 */
   function recordBeginsFrom () {
        var date_qual_cnt = recordData.DATE_QUAL_CNT;
        var qual = recordData.DATE_QUAL[date_qual_cnt - 1];
        var dtObj = new Date();
        dtObj.setISO8601(qual.RESULT_DT_TM);
        var resultDtTm1 = dtObj;
        var resultDt = resultDtTm1.format(dateFormat.masks.mediumDate);
        return acI18n.RecordData + " " + resultDt;
      }


/**
 *
 * This function is used to  Display current Goal INR atop the component.
 *
**/
   function displayHeaderView(goalInrCodeCount){
       var displayHTML = [];
       var date_qual_cnt = recordData.DATE_QUAL_CNT;
       var qual;
       var inrLowVal;
       var inrHighVal;
       var displayHead = " ";
       var col;
       var indiForTreatment = recordData.TREATMENT_INDICATION;
       var anticipatedEndDate = recordData.ANTICIPATED_END_DT_TM;
       if(anticipatedEndDate != ""){
           anticipatedEndDate = (new Date(anticipatedEndDate)).format(dateFormat.masks.longDate);
       }
       for(col = 0; col < date_qual_cnt; col++){
           qual = recordData.DATE_QUAL[col];
            inrLowVal = qual.INR_GOAL_LOW_VALUE.toFixed(1);
            inrHighVal = qual.INR_GOAL_HIGH_VALUE.toFixed(1);
           if(inrHighVal != 0 && inrLowVal != 0){
               break;
            }
        }

       if(inrLowVal != 0 || inrHighVal != 0){
          displayHTML.push('<div class="acDispWrapper"><div class="acDisp acDispLabel">', goalInrLbl, ":", "</div>");
           if(goalInrCodeCount[0] == 1 && goalInrCodeCount[1] == 1) {
              if(inrLowVal == inrHighVal) {
                 displayHTML.push('<div class="ac-dispValueDiv acDispValue">', inrHighVal, "</div></div>");
               }
                else{
                   if(inrLowVal > inrHighVal){
                      displayHTML.push('<div class="ac-dispValueDiv acDispValue">', inrHighVal, "&nbsp;", "-", "&nbsp;", inrLowVal, "</div></div>");
                   }
                    else{
                       displayHTML.push('<div class="ac-dispValueDiv acDispValue">', inrLowVal, "&nbsp;", "-", "&nbsp;", inrHighVal, "</div></div>");
                   }
               }
           }
            else{
               displayHTML.push('<div class="ac-dispValueDiv acDispValue" >', bedrockConfigError, "</div></div>");
           }
       }

       if(indiForTreatment != ""){
           displayHTML.push('<div class="acDispWrapper"><div class="acDisp acDispLabel ">', indicationForTreatmentLbl, ":", "</div>");
           displayHTML.push('<div class="ac-treatment-Ellipsis ac-dispValueDiv acDispValue" title="' + indiForTreatment + '">', indiForTreatment, "</div></div>");
       }
       if(anticipatedEndDate != ""){
           displayHTML.push('<div class="acDispWrapper"><div class="acDisp acDispLabel">', anticipatedEndDateLbl, ":", "</div>");
           displayHTML.push('<div class="ac-dispValueDiv acDispValue">', anticipatedEndDate, "</div></div>");
       }

       displayHead = displayHTML.join("");

        return displayHead;
   }

/**
 * Draw the legends for the table(row headers on the left)
 *
*/
    function tableLegend(component){
        var parentNode = _g("acTableLegends" + component.m_compObject.cvCompId);
        var tableHtml = [];
        var oddevenClass = "";
        var medStrength = acI18n.Mg;
        var ptUnit = acI18n.Seconds;
        var labs = acI18n.Labs;
        var lbl = "";
        var unit = "";
        var cnt = 0;
        var orderArr;
        var medOrder;

        //create the legend for labs
        tableHtml.push("<table id='acLabLegend" + component.m_compObject.cvCompId + "' class='ac-lab-legend'>");
        tableHtml.push("<tr><td class='ac-lab-hdr ac-hdr'><span>", labs, "</span></td></tr>");
        tableHtml.push("<tr class='odd acPT'><td class='ac-lab-item ac-sub-item'><span>", inrLbl, "</span></td></tr>");
        tableHtml.push("<tr class='even acPT'><td class='ac-lab-item ac-sub-item'><span>", ptLbl, "</span>");
        tableHtml.push("&nbsp;<span class='within'>", "(" + ptUnit + ")", "</span></td></tr>");
        tableHtml.push("</table>");
        //create the legend for the warfarin
        tableHtml.push("<table id='acWarfarinLegend" + component.m_compObject.cvCompId + "' class='ac-warfarin-Legend'>");
        tableHtml.push("<tr><td class='ac-warfarin-hdr ac-hdr'><span>", warfarinLbl, "</span></td></tr>");
        //for Taken meds
        if (component.m_takenToggle == 0){
            tableHtml.push("<tr><table id='acTakenLegend" + component.m_compObject.cvCompId + "' class='ac-taken-legend closed'>");
        }
        else{
            tableHtml.push("<tr><table id='acTakenLegend" + component.m_compObject.cvCompId + "' class='ac-taken-legend'>");
        }
        tableHtml.push("<tr><td class='ac-taken-hdr ac-sub-hdr'><h3 class='acsub-sec-hd'>");
        tableHtml.push("<span class='acsub-sec-hd-tgl'>-</span><span class='acsub-sec-title ac-bold' title='", takenLbl, "'>", takenLbl, "</span></h3>");
        tableHtml.push("</td></tr>");
        tableHtml.push("<tr class='odd'><td class='ac-taken-item ac-sub-sub-item'>");
        tableHtml.push("<span>", warfarinLbl, "</span>&nbsp;<span class='within'>", "(" + medStrength + ")", "</span></td></tr>");
        tableHtml.push("</table></tr>");
        //for Administered meds
        if (component.m_administeredToggle == 0){
            tableHtml.push("<tr><table id='acAdministeredLegend" + component.m_compObject.cvCompId + "' class='ac-administered-legend closed'>");
        }
        else{
            tableHtml.push("<tr><table id='acAdministeredLegend" + component.m_compObject.cvCompId + "' class='ac-administered-legend'>");
        }
        tableHtml.push("<tr><td class='ac-admin-hdr ac-sub-hdr'><h3 class='acsub-sec-hd'>");
        tableHtml.push("<span class='acsub-sec-hd-tgl'>-</span><span class='acsub-sec-title ac-bold' title='", adminLbl, "'>", adminLbl, "</span></h3>");
        tableHtml.push("</td></tr>");
        tableHtml.push("<tr class='odd'><td class='ac-admin-item ac-sub-sub-item'>");
        tableHtml.push("<span>", warfarinLbl, "</span>&nbsp;<span class='within'>", "(" + medStrength + ")", "</span></td></tr>");
        tableHtml.push("</table></tr>");
        //for Prescribed meds
        if (component.m_prescribedToggle == 0){
            tableHtml.push("<tr><table id='acPrescribedLegend" + component.m_compObject.cvCompId + "' class='ac-prescribed-legend closed'>");
        }
        else{
            tableHtml.push("<tr><table id='acPrescribedLegend" + component.m_compObject.cvCompId + "' class='ac-prescribed-legend'>");
        }
        tableHtml.push("<tr><td class='ac-pres-hdr ac-sub-hdr'><h3 class='acsub-sec-hd'>");
        tableHtml.push("<span class='acsub-sec-hd-tgl'>-</span><span class='acsub-sec-title ac-bold' title='", prescLbl, "'>", prescLbl, "</span></h3>");
        tableHtml.push("</td></tr>");
        for(medOrder in presTableHd){
            orderArr = presTableHd[medOrder];
            oddevenClass = cnt % 2 == 0 ? "odd" : "even";
            unit = orderArr[2] != "" ? "(" + orderArr[2] + ")" : "";
            lbl = orderArr[3] + " " + unit;
            tableHtml.push("<tr class='", oddevenClass, "'><td class='ac-pres-item ac-sub-sub-item'>");
            tableHtml.push("<div class = 'ac-label'><span title='", lbl, "'>", orderArr[3], "</span>&nbsp;<span class='within'>", unit, "</span></div>");
            tableHtml.push("</td></tr>");
            cnt = cnt + 1;
        }
        tableHtml.push("</table></tr>");
        //for Discontinued meds
        cnt = 0;
        if (component.m_discontinuedToggle == 0){
            tableHtml.push("<tr><table id='acDiscontinuedLegend" + component.m_compObject.cvCompId + "' class='ac-discontinued-legend'>");
        }
        else{
            tableHtml.push("<tr><table id='acDiscontinuedLegend" + component.m_compObject.cvCompId + "' class='ac-discontinued-legend closed'>");
        }
        tableHtml.push("<tr><td class='ac-disc-hdr ac-sub-hdr'><h3 class='acsub-sec-hd'>");
        tableHtml.push("<span class='acsub-sec-hd-tgl'>-</span><span class='acsub-sec-title ac-bold' title='", discLbl, "'>", discLbl, "</span></h3>");
        tableHtml.push("</td></tr>");
        for(medOrder in discTableHd){
            orderArr = discTableHd[medOrder];
            oddevenClass = cnt % 2 == 0 ? "odd" : "even";
            unit = orderArr[2] != "" ? "(" + orderArr[2] + ")" : "";
            lbl = orderArr[3] + " " + unit;
            tableHtml.push("<tr class='", oddevenClass, "'><td class='ac-disc-item ac-sub-sub-item'>");
            tableHtml.push("<div class = 'ac-label'><span title='", lbl, "'>", orderArr[3], "</span>&nbsp;<span class='within'>", unit, "</span></div>");
            tableHtml.push("</td></tr>");
            cnt = cnt + 1;
        }
        tableHtml.push("</table></tr>");
        tableHtml.push("</table>");
        //Push the above generated HTML into the legend node
        parentNode.innerHTML = tableHtml.join("");

    }

 /**
 *
 * This function is used to create expand/collapse click events on the spreadsheet
 *
*/
    function toggleSpreadsheet(parentNode, component){

        function ExpandCollapse() {
            var i18nCore = i18n.discernabu;
            var gpp = Util.gp(Util.gp(Util.gp(Util.gp(Util.gp(this)))));
            var gppClass = gpp.className;
                gppClass = gppClass.split(" ")[0];
            var acGraphContainerRef = Util.Style.g("acGraphContainer", component.m_compObject.cvCompSec, "div")[0];
            var tableRef = Util.Style.g(gppClass, acGraphContainerRef, "div")[0];

            if (Util.Style.ccss(tableRef, "closed") && Util.Style.ccss(gpp, "closed")) {
                Util.Style.rcss(tableRef, "closed");
                Util.Style.rcss(gpp, "closed");
                this.innerHTML = "-";
                this.title = i18nCore.HIDE_SECTION;
                if (gpp.id == "acTakenLegend" + component.m_compObject.cvCompId){
                    component.m_takenToggle = 1;
                }
                else if (gpp.id == "acAdministeredLegend" + component.m_compObject.cvCompId){
                    component.m_administeredToggle = 1;
                }
                else if (gpp.id == "acPrescribedLegend" + component.m_compObject.cvCompId){
                    component.m_prescribedToggle = 1;
                }
                else{
                    component.m_discontinuedToggle = 0;
                }
            }
            else {
                Util.Style.acss(tableRef, "closed");
                Util.Style.acss(gpp, "closed");
                this.innerHTML = "+";
                this.title = i18nCore.SHOW_SECTION;
                if (gpp.id == "acTakenLegend" + component.m_compObject.cvCompId){
                    component.m_takenToggle = 0;
                 }
                else if (gpp.id == "acAdministeredLegend" + component.m_compObject.cvCompId){
                    component.m_administeredToggle = 0;
                 }
                else if (gpp.id == "acPrescribedLegend" + component.m_compObject.cvCompId){
                    component.m_prescribedToggle = 0;
                 }
                else{
                    component.m_discontinuedToggle = 1;
                 }
            }
            component.acHelper.WritePreferences(component.getPrefJson(), "WARFARIN_MGT_PREFS", true, component.getComponentId());
        }

        var i18nCore = i18n.discernabu;
        var toggleArray = Util.Style.g("acsub-sec-hd-tgl", parentNode, "span");
        for (var k = 0; k < toggleArray.length; k++) {
            Util.addEvent(toggleArray[k], "click", ExpandCollapse);
            var checkClosed = Util.gp(Util.gp(toggleArray[k]));
            if (Util.Style.ccss(checkClosed, "closed")) {
                toggleArray[k].innerHTML = "+";
                toggleArray[k].title = i18nCore.SHOW_SECTION;
            }
        }
    }

/**
 *
 * This function is used to display the indicator based on the INR and PT values.
 *
*/

    function getNormalancyClass(rsltVal, normalFlag){
        var className = "res-normal";

        switch(normalFlag){
            case -2:    //critical low
                className = "res-severe";
                break;
            case -1:    //low
                className = "res-low";
                break;
            case 0:     //normal
                className = "res-normal";
                break;
            case 1:     //high
                className = "res-high";
                break;
            case 2:     //critical high
                className = "res-severe";
                break;
            default:    //default is normal
                className = "res-normal";
        }
        return className;
    }
/**
 *
 * This function is used to display event date/time between the graph and the table.
 *
*/

    function dateTimeView() {
        var dateRowCol = " ";
        var dateHTML = [];
        var rowCount = 2;
        var today = new Date();
        var todaysDate = today.format(dateFormat.masks.mediumDate);
        var yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        var yesterDate = yesterday.format(dateFormat.masks.mediumDate);
        var dateLen = dateQual.length;
        var currentDt, currentTm, nextDt;
        var len;
        var current;
        var count;

        dateHTML.push("<div>");
        dateHTML.push("<table>");
        for (var row = 0; row < rowCount; row++) {
            if (row === 0) {
                dateHTML.push("<tr>");
                for (len = 0; len < dateLen; len++) {
                    current = dateQual[0, len];
                    count = len + 1;
                    var next = dateQual[0, count];
                    var currentDate = current[0].format(dateFormat.masks.mediumDateNoYear);

                    currentDt = current[0].format(dateFormat.masks.mediumDate);
                    if(next){
                        nextDt = next[0].format(dateFormat.masks.mediumDate);
                    }
                    else{
                        nextDt = next;
                    }

                    if (count < dateLen && currentDt === nextDt) {
                       dateHTML.push("<td class = 'ac-table-cell acDateInv'></td>");
                    } else if(currentDt === todaysDate && count === dateLen){
                       dateHTML.push("<td class = 'ac-table-cell acBackColor acDateToday'>", acI18n.Today, "</td>");
                    } else if(currentDt === todaysDate) {
                       dateHTML.push("<td class ='ac-table-cell acDateToday'>", acI18n.Today, "</td>");
                    } else if(currentDt === yesterDate && count === dateLen){
                       dateHTML.push("<td class = 'ac-table-cell acBackColor acDateColumn'>", acI18n.Yesterday, "</td>");
                    } else if(currentDt === yesterDate){
                       dateHTML.push("<td class ='ac-table-cell acDateColumn'>", acI18n.Yesterday, "</td>");
                    } else if (count === dateLen) {
                       dateHTML.push("<td class = 'ac-table-cell acBackColor acDateColumn'>", currentDate, "</td>");
                    } else {
                       dateHTML.push("<td class ='ac-table-cell acDateColumn'>", currentDate, "</td>");
                    }
                }
                dateHTML.push("</tr>");
            }
            if (row === 1) {
                dateHTML.push("<tr>");
                for (len = 0; len < dateLen; len++) {
                    current = dateQual[0, len];
                    count = len + 1;

                    currentDt = current[0].format(dateFormat.masks.mediumDate);
                    currentTm = current[0].format("HH:MM");

                    if (count <= dateLen && currentDt === todaysDate) {
                        if (count === dateLen) {
                          dateHTML.push("<td class = 'ac-table-cell acBackColor acTimeToday'>", currentTm, "</td>");
                        } else {
                          dateHTML.push("<td class ='ac-table-cell acTimeColumn'>", currentTm, "</td>");
                        }
                    }  else if(count === dateLen){
                       dateHTML.push("<td class = 'ac-table-cell acBackColor acTimeColumn'>", currentTm, "</td>");
                    } else {
                       dateHTML.push("<td class ='ac-table-cell acTimeColumn'>", currentTm, "</td>");
                    }
                }
                dateHTML.push("</tr>");
            }
        }
        dateHTML.push("</table>");
        dateHTML.push("</div>");
        dateRowCol = dateHTML.join("");
        return dateRowCol;
    }


/**
 *
 * This function is used to create a table for the lab values.
 *
*/



    function labTable(){
          var date_qual_cnt = recordData.DATE_QUAL_CNT;
          var labRowCol = " ";
          var labHTML = [];
          var qual;
          var strVal;
          var rowCount = 2;
          var nrmlClass = "";
          var inrFlag;
          var strBlank = "--";
          var column;
          var ptFlag;

          labHTML.push("<div class='acResultTable'>");
          labHTML.push("<table id='acLabResultTable'>");
          labHTML.push("<tr><td colspan=" + date_qual_cnt + " class='ac-hdr'>&nbsp;</td></tr>");

          for(var row = 0; row < rowCount; row++){
            if (row % 2 === 0) {
                labHTML.push("<tr class='odd acPT'>");
            } else {
                labHTML.push("<tr class='even acPT'>");
            }


              if(row === 0){
                  for(column = date_qual_cnt - 1; column >= 0; column--){
                      qual = recordData.DATE_QUAL[column];
                      strVal = qual.INR_VALUE;
                      inrFlag = qual.INR_NORM_FLAG;

                      nrmlClass = getNormalancyClass(parseFloat(strVal), parseInt(inrFlag, 10));
                    if(column == 0){
                        labHTML.push("<td class='acBackColor ac-table-cell acTableCellProperties'>");
                    }
                    else{
                        labHTML.push("<td class = 'ac-table-cell acTableCellProperties'>");
                    }
                    labHTML.push("<span class='", nrmlClass, "'>");
                    labHTML.push("<span class='acIndFlag'>&nbsp;</span><span class='res-ind'>&nbsp;</span>");
                    if (strVal === "" || strVal === undefined || strVal === 0) {
                        labHTML.push("<span class='acHeld'>", strBlank, "</span>");
                    } else {
                        labHTML.push("<span class='acHeld'>", parseFloat(strVal).toFixed(1), "</span>");
                    }
                      labHTML.push("</span>");
                      labHTML.push("</td>");
                  }
              }

              if(row === 1){
                  for(column = date_qual_cnt - 1; column >= 0; column--){
                      qual = recordData.DATE_QUAL[column];
                      strVal = qual.PT_VALUE;
                      ptFlag = qual.PT_NORM_FLAG;

                      nrmlClass = getNormalancyClass(parseFloat(strVal), parseInt(ptFlag, 10));
                    if(column == 0){
                        labHTML.push("<td class='acBackColor ac-table-cell acTableCellProperties'>");
                    }
                    else{
                        labHTML.push("<td class = 'ac-table-cell acTableCellProperties'>");
                    }
                    labHTML.push('<span class="', nrmlClass, '">');
                    labHTML.push('<span class="acIndFlag">&nbsp;</span><span class="res-ind">&nbsp;</span>');
                    if (strVal === "" || strVal === undefined || strVal === 0) {
                        labHTML.push("<span class='acHeld'>", strBlank, "</span>");
                    } else {
                        labHTML.push("<span class='acHeld'>", parseFloat(strVal).toFixed(1), "</span>");
                    }
                      labHTML.push("</span>");
                      labHTML.push("</td>");
                  }
              }
          }

          labHTML.push("</table>");
          labHTML.push("</div>");
          labRowCol = labHTML.join("");
          return labRowCol;
      }

    /**
    *
    * This function creates the warfarin 7 Day Taken Total table to display retrieved values from database.
    *
    */

    function wfTakenMedTotalView(component) {
        var date_qual_cnt = recordData.DATE_QUAL_CNT;
        var labRowCol = " ";
        var labHTML = [];
        var qual;
        var strVal;
        var strBlank = "--";
        if (component.m_takenToggle == 0){
        labHTML.push('<div class="acResultTable ac-taken-legend closed">');
        }
        else{
        labHTML.push('<div class="acResultTable ac-taken-legend">');
        }
        labHTML.push('<table id="wfTakenMedTotalView">');
        labHTML.push("<tr><td colspan=" + date_qual_cnt + ' class="ac-hdr">&nbsp;</td></tr>');
        labHTML.push("<tr><td colspan=" + date_qual_cnt + ' class="acSubHdr">&nbsp;</td></tr>');
        labHTML.push('<tr class="odd">');

                for (var column = date_qual_cnt - 1;column >= 0;column--) {
                    qual = recordData.DATE_QUAL[column];
                    strVal = qual.TAKENMEDTOTAL;
                    if(column == 0){
                        labHTML.push("<td class='acBackColor ac-table-cell acTaken acTableCellProperties'>");
                    }
                    else{
                        labHTML.push("<td class = 'ac-table-cell acTaken acTableCellProperties'>");
                    }
                    if (strVal === "" || strVal === 0 || strVal === undefined) {
                        labHTML.push("<span class='acHeld acTaken'>", strBlank, "</span>");
                    } else {
                        labHTML.push("<span class='acHeld acTaken'>", strVal, "</span>");
            }
            labHTML.push("</td>");
        }

        labHTML.push("</tr>");
        labHTML.push("</table>");
        labHTML.push("</div>");
        labRowCol = labHTML.join("");
        return labRowCol;
    }
    function specialHeldInfo(splIns) {
        var labHTML = [];
        labHTML.push('<dl class ="ac-info">');
        labHTML.push('<span class="acInstIcon">&nbsp;</span>');
        labHTML.push("</dl>");
        labHTML.push("<h4 class='acSplInst'>special Instruction</h4>");
        labHTML.push("<div class='hvr ac-hvr ac-det'><span>", splIns, "</span>");
        labHTML.push("</div>");
        return labHTML.join("");
    }
    function adminInfo(heldLbl, splIns) {
        var labHTML = [];
        labHTML.push("<span class='acHeld'>", heldLbl, "</span>");
        if (splIns != "") {
            labHTML.push("<span class='acInst acHeld'>", specialHeldInfo(splIns), "</span>");
        }
        return labHTML.join("");
    }
    /**
    *
    * This function creates the administered warfarin table to display retrieved values from database.
    *
    */

    function wfAdministeredView(component){
        var date_qual_cnt = recordData.DATE_QUAL_CNT;
        var labRowCol = " ";
        var labHTML = [];
        var qual;
        var strVal;
        var isAdminHeld;
        var strBlank = "--";
        var splIns;
        if (component.m_administeredToggle == 0){
            labHTML.push("<div class='acResultTable ac-administered-legend closed'>");
        }
        else{
            labHTML.push("<div class='acResultTable ac-administered-legend'>");
        }
        labHTML.push("<table id='wfAdminView'>");
        labHTML.push("<tr><td colspan=" + date_qual_cnt + " class='acSubHdr'>&nbsp;</td></tr>");
        labHTML.push("<tr class='odd'>");

            for (var column = date_qual_cnt - 1; column >= 0; column--) {
             qual = recordData.DATE_QUAL[column];
             strVal = qual.ADMINMEDSTRENGTH;
             isAdminHeld = qual.ADMINMEDHELD;
             splIns = qual.ADMINMEDHELDREASON;
            if(column == 0){
                labHTML.push("<td class='acBackColor ac-table-cell acTableCellProperties'>");
            }
            else{
                labHTML.push("<td class = 'ac-table-cell acTableCellProperties'>");
            }
            if (isAdminHeld == 1 && splIns !== "") {
                labHTML.push("<div>", adminInfo(heldLbl, splIns), "</div>");
            } else {
                if (strVal === "" || strVal === 0 || strVal === undefined) {
                    labHTML.push("<span class='acHeld acHeight'>", strBlank, "</span>");
                } else {
                    labHTML.push("<span class='acHeld acHeight'>", strVal, "</span>");
                }
            }
            labHTML.push("</td>");
        }

        labHTML.push("</tr>");
        labHTML.push("</table>");
        labHTML.push("</div>");
        labRowCol = labHTML.join("");
        return labRowCol;
    }


/**
 *
 * This function is used to create a table for active prescribed and fetch the values from back end.
 *
*/
     function activePrescribed(component) {
        var date_qual_cnt = recordData.DATE_QUAL_CNT;
        var labRowCol = " ";
        var labHTML = [];
        var prescribedArr = [];
        var presQualLength = 0;
        var rowCount = 0;
        var strengthVal;
        var actionSeqCurr;
        var actionSeqPrev;

        if (component.m_prescribedToggle == 0){
            labHTML.push("<div class='acResultTable ac-prescribed-legend closed'>");
        }
        else{
            labHTML.push("<div class='acResultTable ac-prescribed-legend'>");
        }
        labHTML.push("<table id='acActivePrescribed'>");
        labHTML.push("<tr><td colspan=" + date_qual_cnt + " class='acSubHdr'>&nbsp;</td></tr>");


        for(var order_id in prescriptions_by_order) {
            prescribedArr = prescriptions_by_order[order_id];
            presQualLength = prescribedArr.length;
            var presMedQualCnt = 0;
            actionSeqCurr = 0;
            actionSeqPrev = 0;
            if (rowCount % 2 !== 0) {
                labHTML.push("<tr class='even'>");
            } else {
                labHTML.push("<tr class='odd'>");
            }
            for (var i = 0;
                i < date_qual_cnt;
                i++) {
                if(i == (date_qual_cnt - 1)){
                labHTML.push("<td class = 'acBackColor ac-table-cell acPres acTableCellProperties' >");
                }
                else{
                labHTML.push("<td class = 'ac-table-cell acPres acTableCellProperties'>");
                }
                if(presMedQualCnt < presQualLength && dateQual[i][0] == prescribedArr[presMedQualCnt][0]){
                   if(prescribedArr[presMedQualCnt][3]){
                        strengthVal = prescribedArr[presMedQualCnt][4];
                    }
                    else{
                        strengthVal = prescribedArr[presMedQualCnt][1];
                    }
                   if(prescribedArr[presMedQualCnt][10] === 1){
                       labHTML.push("<span class='acHeld'>", heldLbl, "</span>");
                       labHTML.push("<span class='acInstIcon acInstAlign'></span>");
                   } else {
                       if (prescribedArr[presMedQualCnt][2] !== "") {
                           labHTML.push("<span class='acHeld acHeight'>" + strengthVal + "</span>");
                           labHTML.push("<dl class ='ac-info acInst'>");
                           actionSeqCurr = prescribedArr[presMedQualCnt][8];
                           if(prescribedArr[presMedQualCnt][9] == 1 && (actionSeqCurr != actionSeqPrev )) {
                              labHTML.push("<span class='acInstIcon acInstAlign'></span>");
                              actionSeqPrev = actionSeqCurr;
                            } else {
                            labHTML.push("<span class='acInstIconConstant acInstAlign'></span>");
                            }
                            labHTML.push("</dl>");
                            labHTML.push("<h4 class='acSplInst'>special Instruction</h4>");
                            labHTML.push("<div class='hvr ac-hvr ac-det'>", prescribedArr[presMedQualCnt][2], "</div>");
                       } else {
                        labHTML.push("<span class='acHeld acHeight'>" + strengthVal + "</span>");
                       }
                   }
                    presMedQualCnt = presMedQualCnt + 1;
                } else {
                    labHTML.push("<span class='acHeld acHeight'>--</span>");
                                }
                labHTML.push("</td>");
            }
            labHTML.push("</tr>");
            rowCount = rowCount + 1;
        }

        labHTML.push("</table>");
        labHTML.push("</div>");
        labRowCol = labHTML.join("");
        return labRowCol;
    }

/**
 *
 * This function is used to create a table for discontinued medication and fetch the values from back end.
 *
**/
    function discontinuedPrescribed(component) {
        var date_qual_cnt = recordData.DATE_QUAL_CNT;
        var labRowCol = " ";
        var labHTML = [];
        var discontinuedArr = [];
        var discQualLength = 0;
        var rowCount = 0;
        var strengthVal;
        var actionSeqCurr;
        var actionSeqPrev;

        if (component.m_discontinuedToggle == 0){
            labHTML.push("<div class='acResultTable ac-discontinued-legend'>");
        }
        else{
            labHTML.push("<div class='acResultTable ac-discontinued-legend closed'>");
        }

        labHTML.push("<table id='acDiscPrescribed'>");
        labHTML.push("<tr><td colspan=" + date_qual_cnt + " class='acSubHdr'>&nbsp;</td></tr>");
        for (var order_id in discontinued_by_order) {
            dismedcnt = dismedcnt + 1;
            discontinuedArr = discontinued_by_order[order_id];
            discQualLength = discontinuedArr.length;
            var discMedQualCnt = 0;
            actionSeqCurr = 0;
            actionSeqPrev = 0;
            if (rowCount >= 0) {
                labHTML.push("<tr class='acDiscBackground'>");
            }
            for (var cnt = 0; cnt < date_qual_cnt; cnt++) {
                labHTML.push("<td class = 'ac-table-cell acDisc acTableCellProperties'>");
                if (discMedQualCnt < discQualLength && dateQual[cnt][0] == discontinuedArr[discMedQualCnt][0]) {
                    if (discontinuedArr[discMedQualCnt][3]) {
                        strengthVal = discontinuedArr[discMedQualCnt][4];
                    } else {
                        strengthVal = discontinuedArr[discMedQualCnt][1];
                    }
                    if(discontinuedArr[discMedQualCnt][10] == 1){
                        labHTML.push("<span class='acHeld'>", heldLbl, "</span>");
                        labHTML.push("<span class='acInstIcon acInstAlign'></span>");
                    } else {
                         if (discontinuedArr[discMedQualCnt][2] !== "") {
                             labHTML.push("<span class='acHeld acHeight'>" + strengthVal + "</span>");
                             labHTML.push("<dl class ='ac-info acInst'>");
                             actionSeqCurr = discontinuedArr[discMedQualCnt][8];
                             if(discontinuedArr[discMedQualCnt][9] == 1 && (actionSeqCurr != actionSeqPrev )) {
                                labHTML.push("<span class='acInstIcon acInstAlign'></span>");
                                actionSeqPrev = actionSeqCurr;
                              } else {
                                 labHTML.push("<span class='acInstIconConstant acInstAlign'></span>");
                              }
                              labHTML.push("</dl>");
                              labHTML.push("<h4 class='acSplInst'>special Instruction</h4>");
                              labHTML.push("<div class='hvr ac-hvr ac-det'>", discontinuedArr[discMedQualCnt][2], "</div>");
                          } else {
                              labHTML.push("<span class='acHeld acHeight'>" + strengthVal + "</span>");
                           }
                    }
                    discMedQualCnt = discMedQualCnt + 1;
                } else {
                    labHTML.push("<span class='acHeld acHeight'>--</span>");
                }
                labHTML.push("</td>");
            }
            labHTML.push("</tr>");
            rowCount = rowCount + 1;
        }
        labHTML.push("</table>");
        labHTML.push("</div>");
        labRowCol = labHTML.join("");
        return labRowCol;
    }


/**
 * This function creates the legends for the graph.
 *
 * @param {number} cnt : Numeric identifier of a lab or med
 */
    function graphLegendCreation(component){
        var cnt = graphLegend.length
            ,legendParent = _g("dmGraphLegend" + component.m_compObject.cvCompId),
            i;

        for(i = 0; i < cnt; i++){
            var legendItem = graphLegend[i];

            if(legendParent) {
                var newLegendItemNode = legendItem.getVisibleLabel(i);

                if(legendItem.checkbox){
                    var newLegendItemSelect = $(newLegendItemNode).find("input[type='checkbox']")[0];
                    if (legendItem.label == ptLbl) {
                        if (component.m_ptCheckbox != 0){
                        newLegendItemSelect.checked = true;
                        }
                        else{
                        newLegendItemSelect.checked = false;
                        }
                    }
                    else if (legendItem.label == takenLbl) {
                        if (component.m_takenCheckbox != 0){
                        newLegendItemSelect.checked = true;
                        }
                        else{
                        newLegendItemSelect.checked = false;
                        }
                    }
                    else if (legendItem.label == adminLbl) {
                        if (component.m_administeredCheckbox != 0){
                        newLegendItemSelect.checked = true;
                        }
                        else{
                        newLegendItemSelect.checked = false;
                        }
                    }
                    else if (legendItem.label == prescLbl) {
                        if (component.m_prescribedCheckbox != 0){
                        newLegendItemSelect.checked = true;
                        }
                        else {
                        newLegendItemSelect.checked = false;
                        }
                    }
                    else {
                        if (component.m_discontinuedCheckbox != 1){
                        newLegendItemSelect.checked = false;
                        }
                        else {
                        newLegendItemSelect.checked = true;
                        }
                    }
                    newLegendItemSelect.value = i;
                    if(legendItem.isNotEmpty){
                        Util.addEvent(newLegendItemSelect, "click", function() {
                            var cLegendItem = graphLegend[this.value],
                                cCnt = cLegendItem.indices.length;

                            for(i = 0; i < cCnt; i++){
                                var cIndex = cLegendItem.indices[i];
                                graphPlot.series[cIndex].show = this.checked;
                                if (cLegendItem.label == ptLbl) {
                                    var y1AxisMaxVal = 0;
                                    if (this.checked){
                                    component.m_ptCheckbox = 1;
                                    y1AxisMaxVal = Math.max(maxPT, maxAdmin, maxPres, maxGoalINR, maxINR);
                                    }
                                    else{
                                    component.m_ptCheckbox = 0;
                                    y1AxisMaxVal = Math.max(maxAdmin, maxPres, maxGoalINR, maxINR);
                                    }
                                    y1AxisMaxVal = y1AxisMaxVal + 5;
                                    maxYaxis = y1AxisMaxVal;
                                    setYAxesParams(5, minYaxis, maxYaxis, minY2axis, maxY2axis);
                                }
                                else if (cLegendItem.label == takenLbl) {
                                    if (this.checked){
                                    component.m_takenCheckbox = 1;
                                    }
                                    else{
                                    component.m_takenCheckbox = 0;
                                    }
                                    graphPlot.redraw(true);
                                }
                                else if (cLegendItem.label == adminLbl) {
                                    if (this.checked){
                                    component.m_administeredCheckbox = 1;
                                    }
                                    else{
                                    component.m_administeredCheckbox = 0;
                                    }
                                    graphPlot.redraw(true);
                                }
                                else if (cLegendItem.label == prescLbl){
                                    if (this.checked){
                                    component.m_prescribedCheckbox = 1;
                                    }
                                    else{
                                    component.m_prescribedCheckbox = 0;
                                    }
                                    graphPlot.redraw(true);
                                }
                                else {
                                    if (this.checked){
                                    component.m_discontinuedCheckbox = 1;
                                    }
                                    else{
                                    component.m_discontinuedCheckbox = 0;
                                    }
                                    graphPlot.redraw(true);
                                }
                            }
                            component.acHelper.WritePreferences(component.getPrefJson(), "WARFARIN_MGT_PREFS", true, component.getComponentId());
                        });
                    }
                }
                newLegendItemNode = Util.ac(newLegendItemNode, legendParent);
            }
        }
    }



/**
 * This function creates Y axes on left and right side of the graph.
 * Axes are created explicitly because we want to make them fixed and not move when we scroll through the graph.
 */
    function createYAxes(component){

        yaxisPlot = $.jqplot("yaxis" + component.m_compObject.cvCompId, [["", 0]], {
            axes: {
                xaxis: {
                    min: 0,
                    max: 0,
                    showTicks: false

                },
                yaxis: {
                    label: "y1",
                    showLabel: false,
                    tickInterval: y1AxisInterval,
                    min: minYaxis,
                    max: maxYaxis
                }
            },
            grid: {
                drawGridlines: false,
                gridLineWidth: 0.0,
                borderWidth: 0.0,
                shadow: false,
                top: 0
            }
        });

        y2axisPlot = $.jqplot("y2axis" + component.m_compObject.cvCompId, [["", 0]], {
            seriesDefaults: {
                        show: true,
                        xaxis: "xaxis",
                        yaxis: "y2axis",
                        shadow: true,
                        shadowAngle: 45,
                        shadowOffset: 2.25,
                        color: "#ff4466",
                        lineWidth: 5
                    },
            axes: {
                    xaxis: {
                        min: 0,
                        max: 0,
                        showTicks: false

                    },
                    yaxis: {
                        label: "y1",
                        showLabel: false,
                        tickInterval: 0,
                        min: 0,
                        max: 0,
                        showTicks: false
                    },
                    y2axis: {
                        label: "y2",
                        showLabel: false,
                        tickInterval: y2AxisInterval,
                        min: minY2axis,
                        max: maxY2axis
                    }
                },
                grid: {
                        drawGridlines: false,
                        gridLineWidth: 0.0,
                        borderWidth: 0.0,
                        shadow: false,
                        top: 0
                    }
        });
    }

    /**
     * This function will set the minimum, maximum, and tick count for the graph plot and y1 and y2 axes.
     * The same tick count will be applied to the graph plot and both axes.
     * @param {number} tickCount The number of ticks to apply to the graph plot and y1 and y2 axes.
     * @param {number} minY1axis The minimum value for the y1 axis.
     * @param {number} maxY1axis The maximum value for the y1 axis.
     * @param {number} minY2axis The minimum value for the y2 axis.
     * @param {number} maxY2axis The maximum value for the y2 axis.
     * @returns {undefined} Nothing.
     */
    function setYAxesParams(tickCount, minY1axis, maxY1axis, minY2axis, maxY2axis) {
        var y1TickSum = minY1axis,
        y2TickSum = minY2axis,
        y1Ticks = [minY1axis],
        y2Ticks = [minY2axis],
        y1TickInterval = Math.round((maxY1axis - minY1axis) / tickCount),
        y2TickInterval = Math.round((maxY2axis - minY2axis) / tickCount),
        tickIdx;

        // build the tick mark array
        for (tickIdx = 0; tickIdx < tickCount; tickIdx++) {
            y1TickSum += y1TickInterval;
            y2TickSum += y2TickInterval;
            y1Ticks.push(y1TickSum);
            y2Ticks.push(y2TickSum);
        }

        // set the properties for the y axes
        yaxisPlot.replot({
            resetAxes: true,
            axes: {
                yaxis: {
                    min: minYaxis,
                    max: maxYaxis,
                    ticks: y1Ticks,
                    tickOptions: {
                        formatString: "%d"
                    }
                },
                y2axis: {
                    min: minY2axis,
                    max: maxY2axis,
                    ticks: y2Ticks,
                    tickOptions: {
                        formatString: "%d"
                    }
                }
            }
        });

        // set the properties for the axes inside of the graph plot
        graphPlot.axes.yaxis.min = minY1axis;
        graphPlot.axes.yaxis.max = maxY1axis;
        graphPlot.axes.yaxis.ticks = y1Ticks;

        graphPlot.axes.y2axis.min = minY2axis;
        graphPlot.axes.y2axis.max = maxY2axis;
        graphPlot.axes.y2axis.ticks = y2Ticks;

        // note that adding any input parameters to replot will cause the show/hide properties of the series to revert back to when the component was last refreshed
        //  in other words, do not add any parameters to this function
        graphPlot.replot();
    }

/**
 * This function populates the canvasOverlayArr array to contain the different properties of each canvas overlay sections.
 *
 * @param {float} xMin: Tick value of the left side of column
 * @param {float} xMax: Tick value of the right side of column
 */
    function canvasOverlayCreation(xMin, xMax){

        canvasOverlayArr.push(
            {rectangle: {
                name: "rectangle",
                lineWidth: 5,
                color: "rgba(0, 0, 0, 0.1)",
                shadow: false,
                xmin: xMin,
                xmax: xMax,
                yOffset: 0
            }},
            {dashedVerticalLine: {
                name: "pebbles",
                x: xMin,
                lineWidth: 1,
                yOffset: 0,
                lineCap: "butt",
                color: "rgb(0, 0, 0)",
                shadow: false
            }},
            {dashedVerticalLine: {
                name: "pebbles",
                x: xMax,
                lineWidth: 1,
                yOffset: 0,
                lineCap: "butt",
                color: "rgb(0, 0, 0)",
                shadow: false
            }}
        );
    }


/**
 * This function populates the graphSeries array to contain the different properties of each series.
 *
 * @param {string} Yaxis: which Y axis to use(yaxis or y2axis)
 * @param {string} Color: Color code for the graph line
 * @param {string} MarkerColor: Color of the marker for each point on the graph
 * @param {string} Style: Shape of the marker(star, diamond, etc)
 * @param {string} Label: Text value of the series, which would appear on the legend also.
 * @param {boolean} Show: To show the series on graph or not.
 * @param {boolean} ShowLine: To join the point on the graph or not.
 * @param {boolean} BreakOnNull: To break the line whe a null value is encountered.
 * @param {string} hoverFormat: Formatting for the tooltip on hover of series
 * @param {boolean} markerShow: To show the marker on the points
 * @param {boolean} seriesShadow: To show the shadow for the series line
 */
    function seriesCreation(Yaxis, Color, MarkerColor, Style, Label, Show, ShowLine, BreakOnNull, hoverFormat, markerShow, seriesShadow){

        hoverFormat = hoverFormat || "";

        graphSeries.push({
            yaxis: Yaxis,
            shadow: seriesShadow,
            shadowAngle: 0,
            shadowOffset: 0,
            shadowDepth: 0,
            lineWidth: 1,
            color: Color,
            label: Label,
            markerOptions: {
                show: markerShow,
                size: 10.0,
                color: MarkerColor,
                style: Style,
                shadow: false
            },
            show: Show,
            showLine: ShowLine,
            breakOnNull: BreakOnNull,
            highlighter: {
                    // 'hoverFormat' will have a value of %6 for prescribed, and %6 for everything else (INR, PT,etc..)
                    // '%1' points to the formatting in INR, PT,Taken,Administered, %6 is non existent in these series thus nothing will be displayed.
                    // %6 points to the formatting variable in Prescribed and Discontinued, %1 points to the Special Instruction Value.
                formatString: "<div style='background:#FFC;border:solid #000 1px;padding:0px 5px 0px 5px;'>" + hoverFormat + "</div>"

                }
        });
    }

/**
 * This function would traverse through the reply Json and parse the different results into there specific arrays.
 * At the end it would combine all the arrays into a single array called graphData, which would be consumed by the graph API to plot the values
 */
    function graphDataCollection(component){

        var date_qual_cnt = recordData.DATE_QUAL_CNT
        ,splInstArr = []
        ,splInstArrDisc = []
        ,lineColor
        ,markerColor
        ,markerStyle
        ,inrArr = []
        ,takenArr = []
        ,prescribedArr = []
        ,discontinuedArr = []
        ,administeredArr = []
        ,ptArr = []
        ,inrMaxGoalArr = []
        ,inrMinGoalArr = []
        ,heldArr = []
        ,suspendInPresArr = []
        ,suspendInDiscArr = []
        ,isInrEmpty = true
        ,isTakenEmpty = true
        ,isPrescribedEmpty = true
        ,isDiscontinuedEmpty = true
        ,isAdministeredEmpty = true
        ,isPtEmpty = true
        ,isInrGoalEmpty = true
        ,strVal = ""
        ,qual
        ,medQual
        ,resultDtTm
        ,inrLegendItem = new legendItem(inrLbl)
        ,goalInrLegendItem = new legendItem(goalInrLbl)
        ,ptLegendItem = new legendItem(ptLbl)
        ,graphLegendItem = new legendItem(graphNotDisplay)
        ,takenLegendItem = new legendItem(takenLbl)
        ,adminLegendItem = new legendItem(adminLbl)
        ,prescLegendItem = new legendItem(prescLbl)
        ,discLegendItem = new legendItem(discLbl)
        ,heldLegendItem = new legendItem(heldLbl)
        ,specialInstLegendItem = new legendItem(specialInstLbl)
        ,compareVal
        ,tempHighGoal
        ,tempLowGoal
        ,isAdminHeld
        ,heldPosition
        ,splInstPos
        ,canvasOver = {}
        ,volumeVal = 0
        ,maxPTVal = 0
        ,y2AxisMaxVal = 0
        ,y1AxisMaxVal = 0
        ,medStrength = acI18n.Mg
        ,ptUnit = acI18n.Seconds
        ,dtTm
        ,i
        ,j;

        //traverse through the reply structure
        for(i = 0; i < date_qual_cnt ; i++){
            qual = recordData.DATE_QUAL[i];
            dtTm = new Date();
            dtTm.setISO8601(qual.RESULT_DT_TM);
            resultDtTm = dtTm;
                 var medQualCnt = qual.PRESCRIBEDMEDCNT;
                 var discMedCnt = qual.DISCMEDCNT;


            //collect all the dates, which are all the x-axis tick values
            dateQual.push([resultDtTm, 0]);

            //collect INR
            inrLegendItem.checkbox = false;
            strVal = qual.INR_VALUE;
            compareVal = parseFloat(strVal);
            var inrFormat = ["<span style='font-weight:bold;color:#787878 '>", inrLbl, ": ", "</span>", "<span style='color:#000'>", strVal, "</span>"].join("");
            if(strVal != ""){
                inrLegendItem.max = Math.max(compareVal, inrLegendItem.max);
                inrLegendItem.min = Math.min(compareVal, inrLegendItem.min);
                inrArr.push([resultDtTm, strVal, inrFormat]);
                isInrEmpty = false;
            }


            //collect GOAL INR Max
            goalInrLegendItem.checkbox = false;
            //handle the case if the user enters the low value in high field and vice-versa.
            tempHighGoal = Math.max(parseFloat(qual.INR_GOAL_HIGH_VALUE), parseFloat(qual.INR_GOAL_LOW_VALUE));
            tempLowGoal = Math.min(parseFloat(qual.INR_GOAL_HIGH_VALUE), parseFloat(qual.INR_GOAL_LOW_VALUE));

            //handle the case where high and low value is equal but not equal with a value of 0
            if(tempHighGoal == tempLowGoal && tempHighGoal > 0 && tempLowGoal > 0){
                tempLowGoal = tempLowGoal - 0.05;
            }

            compareVal = parseFloat(tempHighGoal).toFixed(1);
            if(tempHighGoal <= 0){
                inrMaxGoalArr.push([resultDtTm, null]);
            }
            else{
                inrMaxGoalArr.push([resultDtTm, String(tempHighGoal)]);
                goalInrLegendItem.max = Math.max(compareVal, goalInrLegendItem.max);
                isInrGoalEmpty = false;
            }

            //collect GOAL INR Min
            compareVal = parseFloat(tempLowGoal).toFixed(1);
            if(tempLowGoal <= 0){
                inrMinGoalArr.push([resultDtTm, null]);
            }
            else{
                goalInrLegendItem.min = Math.min(compareVal, goalInrLegendItem.min);
                inrMinGoalArr.push([resultDtTm, String(tempLowGoal)]);
            }

            //collect PT
            strVal = qual.PT_VALUE;
            compareVal = parseFloat(strVal);
            var ptFormat = ["<span style='font-weight:bold;color:#787878'>", ptLbl, ": ", "</span>", "<span style='color:#000'>", strVal, " ", ptUnit, "</span>"].join("");
            if(strVal != ""){
                ptLegendItem.max = Math.max(compareVal, ptLegendItem.max);
                ptLegendItem.min = Math.min(compareVal, ptLegendItem.min);
                ptArr.push([resultDtTm, strVal, ptFormat]);
                isPtEmpty = false;
                }


            //collect Medication TAKEN
            strVal = qual.TAKENMEDTOTAL;
            compareVal = parseFloat(strVal);
            var takenFormat = ["<span style='font-weight:bold;color:#787878'>", takenLbl, ": ", "</span>", "<span style='color:#000'>", strVal, " ", medStrength, "</span>"].join("");
            if(strVal != ""){
                takenLegendItem.max = Math.max(compareVal, takenLegendItem.max);
                takenLegendItem.min = Math.min(compareVal, takenLegendItem.min);
                takenArr.push([resultDtTm, strVal, takenFormat]);
                isTakenEmpty = false;
            }


            //collect Medication Administered
            strVal = qual.ADMINMEDSTRENGTH;
            //To account for volume dose if present
            volumeVal = qual.ADMINMEDVOLUME;
            if(volumeVal > 0 || (volumeVal == 0 && strVal == 0 && qual.ADMINMEDLABEL != "")){
                if(!canvasOver[resultDtTm]){
                    canvasOver[resultDtTm] = date_qual_cnt - i;
                }
                strVal = 0.0;
            }

            compareVal = parseFloat(strVal);
            isAdminHeld = qual.ADMINMEDHELD;
            if(isAdminHeld == 1){
                administeredArr.push([resultDtTm, null]);
                heldArr.push([resultDtTm, 1]);
            }
            else if (strVal == ""){
                heldArr.push([resultDtTm, null]);
            }
            else{
                adminLegendItem.max = Math.max(compareVal, adminLegendItem.max);
                adminLegendItem.min = Math.min(compareVal, adminLegendItem.min);
                var administeredFormat = ["<span style='font-weight:bold;color:#787878'>", adminLbl, ": ", "</span>", "<span style='color:#000'>", strVal, " ", medStrength, "</span>"].join("");
                administeredArr.push([resultDtTm, strVal, administeredFormat]);
                isAdministeredEmpty = false;
            }

            //collect Medication Prescribed
            var splInstActivePres = false;
            var splInstDisc = false;
            var volIdent = false;
            var volStr = "";
            var medUnit = "";
            var medLbl = "";
            var spInstFlag = false;
            var medActionSeq = 0;
            var isInsChange = 0;
            var isMedSuspend = 0;
            var suspendInPres = false;
            var suspendInDisc = false;
            var order_id;
            var splIns;
            var discMed;

            for(j = 0; j < medQualCnt; j++){
                medQual = qual.PRESCRIBEDMEDQUAL[j];
                var pres_order_id = medQual.PRESMED_ORDER_ID;
                strVal = medQual.PRESMED_STRENGTH;
                splIns = medQual.PRESMED_SPEC_INS;
                medUnit = medQual.PRESMED_UNIT;
                medLbl = medQual.PRESMED_LBL;
                spInstFlag = false;
                medActionSeq = medQual.PRESMED_ACTION_SEQUENCE;
                isInsChange = medQual.PRESMED_INST_CHANGE;
                isMedSuspend = medQual.PRESMED_SUSPEND_IND;

                //To account for volume dose if present
                volumeVal = medQual.PRESMED_VOLUME;
                if((volumeVal > 0 && strVal == 0) || (volumeVal == 0 && strVal == 0 && medLbl != "")){
                    if(!canvasOver[resultDtTm]){
                        canvasOver[resultDtTm] = date_qual_cnt - i;
                    }
                    strVal = 0.0;
                    volIdent = true;

                    if(volumeVal > 0){
                        volStr = volumeVal + " " + medUnit;
                    }
                    else{
                        volStr = "<span class='ac-no-info'></span>";
                    }
                }
                else{
                    compareVal = parseFloat(strVal);
                    volIdent = false;
                    volStr = "";
                    prescLegendItem.max = Math.max(compareVal, prescLegendItem.max);
                    prescLegendItem.min = Math.min(compareVal, prescLegendItem.min);
                }

                if(isMedSuspend === 1){
                    if(!canvasOver[resultDtTm]){
                          canvasOver[resultDtTm] = date_qual_cnt - i;
                      }
                      suspendInPres = true;
                      strVal = null;
                }

                else if(splIns !== ""){
                    splInstActivePres = true;
                    spInstFlag = true;
                }
                // 'activeFormat' formats the prescriptions label, strength, and special instruction for the hover formatting.
                var activeFormat = ["<span style='font-weight:bold;color:#787878'>", prescLbl, "</span>", "<span style='color:#000'>", ": ", strVal, " ", medStrength, "<br/>", splIns, "</span>"].join("");
                if(prescriptions_by_order[pres_order_id]){
                    if(spInstFlag){
                        presTableHd[pres_order_id][1] = true;
                    }
                    prescriptions_by_order[pres_order_id].push([resultDtTm, strVal, splIns, volIdent, volStr, medUnit, medLbl, activeFormat, medActionSeq, isInsChange, isMedSuspend]);
                }
                else{
                    presTableHd[pres_order_id] = [resultDtTm, spInstFlag, medUnit, medLbl];
                    //Add 'activeFormat' to 'prescriptions_by_order[pres_order_id]' otherwise hover will not be formatted for the last column.
                    prescriptions_by_order[pres_order_id] = [[resultDtTm, strVal, splIns, volIdent, volStr, medUnit, medLbl, activeFormat, medActionSeq, isInsChange, isMedSuspend]];
                    isPrescribedEmpty = false;
                }
            }

            //collect discountinued meds
            for (j = 0;j < discMedCnt;j++) {
                discMed = qual.DISCMEDQUAL[j];
                var discOrderId = discMed.DISCMED_ORDER_ID;
                strVal = discMed.DISCMED_STRENGTH;
                splIns = discMed.DISCMED_SPEC_INS;
                volStr = "";
                volIdent = false;
                medUnit = discMed.DISCMED_UNIT;
                medLbl = discMed.DISCMED_LBL;
                spInstFlag = false;
                medActionSeq = discMed.DISCMED_ACTION_SEQUENCE;
                isInsChange = discMed.DISCMED_INST_CHANGE;
                isMedSuspend = discMed.DISCMED_SUSPEND_IND;

                //To account for volume dose if present
                volumeVal = discMed.DISCMED_VOLUME;
                if((volumeVal > 0 && strVal == 0) || (volumeVal == 0 && strVal == 0 && medLbl != "")){
                    if(!canvasOver[resultDtTm]){
                        canvasOver[resultDtTm] = date_qual_cnt - i;
                    }
                    strVal = 0.0;
                    volIdent = true;

                    if(volumeVal > 0){
                        volStr = volumeVal + " " + medUnit;
                    }
                    else{
                        volStr = "<span class='ac-no-info'></span>";
                    }
                }
                else{
                    compareVal = parseFloat(strVal);
                    volIdent = false;
                    volStr = "";
                    discLegendItem.max = Math.max(compareVal, discLegendItem.max);
                    discLegendItem.min = Math.min(compareVal, discLegendItem.min);
                }

                if(isMedSuspend === 1){
                    if(!canvasOver[resultDtTm]){
                         canvasOver[resultDtTm] = date_qual_cnt - i;
                     }
                     suspendInDisc = true;
                     strVal = null;
                }

                else if(splIns !== ""){
                    splInstDisc = true;
                    spInstFlag = true;
                }
                var discontinuedFormat = ["<span style='font-weight:bold;color:#787878'>", discLbl, "</span>", "<span style='color:#000'>", ": ", strVal, " ", medStrength, "<br/>", splIns, "</span>"].join("");
                if (discontinued_by_order[discOrderId]) {
                    if(spInstFlag){
                        discTableHd[discOrderId][1] = true;
                    }
                    discontinued_by_order[discOrderId].push([resultDtTm, strVal, splIns, volIdent, volStr, medUnit, medLbl, discontinuedFormat, medActionSeq, isInsChange, isMedSuspend]);
                }
                else {
                    discTableHd[discOrderId] = [resultDtTm, spInstFlag, medUnit, medLbl];
                    discontinued_by_order[discOrderId] = [[resultDtTm, strVal, splIns, volIdent, volStr, medUnit, medLbl, discontinuedFormat, medActionSeq, isInsChange, isMedSuspend]];
                    isDiscontinuedEmpty = false;
                }
            }

            if(splInstActivePres == true){
                splInstArr.push([resultDtTm, 1 ]);
            }
            if(splInstDisc == true){
                splInstArrDisc.push([resultDtTm, 1 ]);
            }

            if(suspendInPres === true){
                suspendInPresArr.push([resultDtTm, 1 ]);
            }

            if(suspendInDisc === true){
                suspendInDiscArr.push([resultDtTm, 1 ]);
            }
        }

        //dateQual into graphData array and create series for it on yaxis, but it will never be displayed.
        graphData.push(dateQual.reverse());
        lineColor = "#FFFFFF";
        markerColor = lineColor;
        markerStyle = shapes[0];
        seriesCreation("yaxis", lineColor, markerColor, markerStyle, "tempYaxis", true, true, false, "", false, false);

        //dateQual into graphData array and create series for it on y2axis, but it will never be displayed.
        graphData.push(dateQual);
        seriesCreation("y2axis", lineColor, markerColor, markerStyle, "tempY2axis", true, true, false, "", false, false);

        //to create labs header inside legends
        var labHeader = new legendItem(labLbl, true);
        labHeader.checkbox = false;
        graphLegend.push(labHeader);

        //GOAL INR into graphData array and create series for it
        if(isInrGoalEmpty == false){
            handleGoalInr(inrMaxGoalArr.reverse(), inrMinGoalArr.reverse(), goalInrLbl, goalInrLegendItem);
        }
        else{
            goalInrLegendItem.isNotEmpty = false;
            goalInrLegendItem.shape = shapes[2];
            goalInrLegendItem.color = "#9ed4ed";
            graphLegend.push(goalInrLegendItem);
        }

        //INR into graphData array and create series for it
        lineColor = "#259f27";
        markerColor = lineColor;
        markerStyle = shapes[0];
        if(isInrEmpty == false){
            graphData.push(inrArr.reverse());
            seriesCreation("yaxis", lineColor, markerColor, markerStyle, inrLbl, true, true, false, "%1", true, false);
            inrLegendItem.indices.push(graphData.length - 1);
        }
        else{
            inrLegendItem.isNotEmpty = false;
        }
        inrLegendItem.shape = markerStyle;
        inrLegendItem.color = markerColor;
        graphLegend.push(inrLegendItem);


        //PT into graphData array and create series for it
        lineColor = "#F57636";
        markerColor = lineColor;
        markerStyle = shapes[1];
        var ptUserPref = component.m_ptCheckbox == 0 ? false : true;
        if(isPtEmpty == false){
            graphData.push(ptArr.reverse());
            seriesCreation("yaxis", lineColor, markerColor, markerStyle, ptLbl, ptUserPref, true, false, "%1", true, false);
            ptLegendItem.indices.push(graphData.length - 1);
            ptLegendItem.units = acI18n.Seconds;
        }
        else{
            ptLegendItem.isNotEmpty = false;
        }
        ptLegendItem.shape = markerStyle;
        ptLegendItem.color = markerColor;
        graphLegend.push(ptLegendItem);


        //To create warfarin header inside the legend
        var warfarinHeader = new legendItem(warfarinLbl, true);
        warfarinHeader.checkbox = false;
        graphLegend.push(warfarinHeader);



        //To create Graph Not displaying header inside the legend

        graphLegendItem.checkbox = false;
        graphLegendItem.isNotEmpty = false;
        graphLegendItem.shape = shapes[2];
        graphLegendItem.color = "rgba (0, 0, 0, 0.1)";
        graphLegend.push(graphLegendItem);

        //Medication Taken into graphData array and create series for it
        lineColor = "#89408f";
        markerColor = lineColor;
        markerStyle = shapes[3];
        var takenUserPref = component.m_takenCheckbox == 0 ? false : true;
        if(isTakenEmpty == false){
            graphData.push(takenArr.reverse());
            seriesCreation("y2axis", lineColor, markerColor, markerStyle, takenLbl, takenUserPref, true, false, "%1", true, false);
            takenLegendItem.indices.push(graphData.length - 1);
            takenLegendItem.units = acI18n.Mg;
        }
        else{
            takenLegendItem.isNotEmpty = false;
        }
        takenLegendItem.shape = markerStyle;
        takenLegendItem.color = markerColor;
        graphLegend.push(takenLegendItem);


        //Medication Administered into graphData array and create series for it
        lineColor = "#8f7751";
        markerColor = lineColor;
        markerStyle = shapes[4];
        var adminUserPref = component.m_administeredCheckbox == 0 ? false : true;
        if(isAdministeredEmpty == false){
            graphData.push(administeredArr.reverse());
            seriesCreation("yaxis", lineColor, markerColor, markerStyle, adminLbl, adminUserPref, true, true, "%1", true, false);
            adminLegendItem.indices.push(graphData.length - 1);
            adminLegendItem.units = acI18n.Mg;
            graphData.push(heldArr.reverse());
        seriesCreation("y2axis", "white", "#cc0000", shapes[5], heldLbl, adminUserPref, false, true, "", true, false);
        adminLegendItem.indices.push(graphData.length - 1);
        }
        else{
            adminLegendItem.isNotEmpty = false;
        }
        adminLegendItem.shape = markerStyle;
        adminLegendItem.color = markerColor;
        graphLegend.push(adminLegendItem);


        // To create held legend inside the legends
        heldLegendItem.checkbox = false;
        heldLegendItem.specialLegend = true;
        heldLegendItem.shape = shapes[5];
        heldLegendItem.color = "#cc0000";
        graphLegend.push(heldLegendItem);

        //Medication Prescribed into graphData array and create series for it
        lineColor = "#003c71";
        markerColor = lineColor;
        markerStyle = shapes[6];
        var presUserPref = component.m_prescribedCheckbox == 0 ? false : true;
        if(isPrescribedEmpty == false){
            for(order_id in prescriptions_by_order){
                prescribedArr = prescriptions_by_order[order_id];
                if(prescribedArr[0][3]){
                    prescribedArr.reverse();
                    continue;
                }
                graphData.push(prescribedArr.reverse());
                seriesCreation("yaxis", lineColor, markerColor, markerStyle, prescLbl, presUserPref, true, true, "%6", true, false);
                prescLegendItem.indices.push(graphData.length - 1);
            }
            graphData.push(splInstArr.reverse());
            seriesCreation("y2axis", "white", "#CC0000", shapes[7], "special", presUserPref, false, true, "", true, false);
            prescLegendItem.indices.push(graphData.length - 1);

            graphData.push(suspendInPresArr.reverse());
            seriesCreation("y2axis", "white", "#CC0000", shapes[5], "Suspend", presUserPref, false, true, "", true, false);
            prescLegendItem.indices.push(graphData.length - 1);

            prescCnt = prescLegendItem.indices.length;
            prescLegendItem.units = acI18n.Mg;
        }
        else{
            prescLegendItem.isNotEmpty = false;
        }
        prescLegendItem.shape = markerStyle;
        prescLegendItem.color = markerColor;
        graphLegend.push(prescLegendItem);

        // To create special instruction legend inside the legends
        specialInstLegendItem.checkbox = false;
        specialInstLegendItem.specialLegend = true;
        specialInstLegendItem.shape = shapes[7];
        specialInstLegendItem.color = "#cc0000";
        graphLegend.push(specialInstLegendItem);

        //Medication Discontinued into graphData array and create series for it

        lineColor = "#A9A9A9";
        markerColor = lineColor;
        markerStyle = shapes[6];
        var discUserPref = component.m_discontinuedCheckbox === 1 ? true : false;
        if (isDiscontinuedEmpty == false) {
            for (order_id in discontinued_by_order) {
                discontinuedArr = discontinued_by_order[order_id];
                if (discontinuedArr[0][3]) {
                    discontinuedArr.reverse();
                    continue;
                }
                graphData.push(discontinuedArr.reverse());
                seriesCreation("yaxis", lineColor, markerColor, markerStyle, discLbl, discUserPref, true, true, "%6", true, false);
                discLegendItem.indices.push(graphData.length - 1);
            }
            graphData.push(splInstArrDisc.reverse());
            seriesCreation("y2axis", "white", "#CC0000", shapes[7], "special", discUserPref, false, true, "", true, false);
            discLegendItem.indices.push(graphData.length - 1);

            graphData.push(suspendInDiscArr.reverse());
            seriesCreation("y2axis", "white", "#CC0000", shapes[5], "suspend", discUserPref, false, true, "", true, false);
            discLegendItem.indices.push(graphData.length - 1);

            dismedcnt = discLegendItem.indices.length;
            discLegendItem.units = acI18n.Mg;
        } else {
            discLegendItem.isNotEmpty = false;
        }
        discLegendItem.shape = markerStyle;
        discLegendItem.color = markerColor;
        graphLegend.push(discLegendItem);

        //Add a special instruction icon under discontinued in the legend.
        graphLegend.push(specialInstLegendItem);

        //to do the grey overlay on the graph
        var currentIndex = 0
        ,prevIndex = 0
        ,indexArr = []
        ,flag = false
        ,arrLen;

        for(dtTm in canvasOver){
            currentIndex = canvasOver[dtTm];
            if(indexArr.length > 0 && currentIndex !== prevIndex - 1){
                flag = true;
            }
            if(flag){
                arrLen = indexArr.length - 1;
                indexArr.sort(function(a, b){return a - b;});
                canvasOverlayCreation(indexArr[0] - 0.5, indexArr[arrLen] + 0.5);
                indexArr = [];
                flag = false;
            }
            indexArr.push(currentIndex);
            prevIndex = currentIndex;
        }
        if(indexArr.length > 0){
            arrLen = indexArr.length - 1;
            indexArr.sort(function(a, b){return a - b;});
            canvasOverlayCreation(indexArr[0] - 0.5, indexArr[arrLen] + 0.5);
        }

        // To do canvas overlay on the last column (column with latest result) to have orange color
        canvasOverlayArr.push(
            {rectangle: {
                name: "rectangle",
                lineWidth: 5,
                color: "rgba(255, 236, 199, 0.7)",
                shadow: false,
                xmin: date_qual_cnt - 0.5,
                xmax: date_qual_cnt + 0.5,
                yOffset: 0
            }},
            {dashedVerticalLine: {
                name: "pebbles",
                x: date_qual_cnt - 0.5,
                lineWidth: 1,
                yOffset: 0,
                lineCap: "butt",
                color: "rgba(252, 191, 50, 1)",
                shadow: false
            }}
        );

        maxGoalINR = goalInrLegendItem.max;
        maxINR = inrLegendItem.max;
        maxPT = ptLegendItem.max;
        maxAdmin = adminLegendItem.max;
        maxPres = prescLegendItem.max;
        maxDisc = discLegendItem.max;
        if(component.m_ptCheckbox !== 0){
            maxPTVal = maxPT;
        }
        //set the max value of y1axis and y2axis (y1axis on left and y2axis which is on right hand side)
        y1AxisMaxVal = Math.max(maxPTVal, maxAdmin, maxPres, maxDisc, maxGoalINR, maxINR);
        y2AxisMaxVal = takenLegendItem.max;
        if(y1AxisMaxVal !== 0)
        {
            y1AxisMaxVal = y1AxisMaxVal + 5;
            y1AxisInterval = Math.round(y1AxisMaxVal / 5);
            maxYaxis = y1AxisMaxVal;
        }
        if(y2AxisMaxVal !== 0)
        {
            y2AxisMaxVal = y2AxisMaxVal + 5;
            y2AxisInterval = Math.round(y2AxisMaxVal / 5);
            maxY2axis = y2AxisMaxVal;
        }

        // medication held and create series for it
        for (i = 0; i < heldArr.length; i++) {
            if (heldArr[i][1] != "" && heldArr[i][1] != null) {
                heldPosition = y2AxisInterval * 0.15;
                heldArr[i][1] = heldPosition;
            }
        }



        //To create special instruction legend on the graph and series for it.
        for (i = 0; i < splInstArr.length; i++) {
            if (splInstArr[i][1] != "" && splInstArr[i][1] != null) {
                splInstPos = y2AxisInterval * 0.15;
                splInstArr[i][1] = splInstPos;
            }
        }

        for (i = 0; i < splInstArrDisc.length; i++) {
            if (splInstArrDisc[i][1] != "" && splInstArrDisc[i][1] != null) {
                splInstPos = y2AxisInterval * 0.15;
                splInstArrDisc[i][1] = splInstPos;
            }
        }

        //to Create suspend series in the graph
        for (i = 0; i < suspendInPresArr.length; i++) {
            if (suspendInPresArr[i][1] != "" && suspendInPresArr[i][1] != null) {
                splInstPos = y2AxisInterval * 0.15;
                suspendInPresArr[i][1] = splInstPos;
            }
        }

         for (i = 0; i < suspendInDiscArr.length; i++) {
            if (suspendInDiscArr[i][1] != "" && suspendInDiscArr[i][1] != null) {
                splInstPos = y2AxisInterval * 0.15;
                suspendInDiscArr[i][1] = splInstPos;
            }
        }


      }

/**
 * This function would create different series for variable Goal INR values, with each one having its high line and low line
 * The high line and low line will be filled with color and the actual line would not show on front-end
 * @param {array} inrGoalArray: Array which contains the goal INR and the associated dates with it
 * @param {string} goalInrLbl: Label for goal INR
 */
    function handleGoalInr(inrMaxGoalArray, inrMinGoalArray, goalInrLbl, goalInrLegendItem){
        var seriesCnt = graphSeries.length
        ,dateValue
        ,maxGoalInrVal
        ,minGoalInrVal
        ,prevMaxGoalInrVal = ""
        ,prevMinGoalInrVal = ""
        ,masterGoalInrArr = []
        ,tempMaxGoalInrArr = []
        ,tempMinGoalInrArr = []
        ,tempArrCnt = 0
        ,nullCheck = 0;

        //It goes through the passed in goal INR array and creates different array from it and pushes the created arrays into masterGoalInrArr.
        //The inner logic is: On the graph, the line should be on the same level of y-axis util it changes. so when it changes,
        //we need to end that series and create a new series for the changed value.
        for(var goalInrCnt = 0; goalInrCnt < inrMaxGoalArray.length; goalInrCnt++){
            dateValue = inrMaxGoalArray[goalInrCnt][0];
            maxGoalInrVal = inrMaxGoalArray[goalInrCnt][1];
            minGoalInrVal = inrMinGoalArray[goalInrCnt][1];
            if(maxGoalInrVal != null){
                if(tempMaxGoalInrArr.length > 0){
                    if(maxGoalInrVal == tempMaxGoalInrArr[tempArrCnt - 1][1] && minGoalInrVal == tempMinGoalInrArr[tempArrCnt - 1][1]){
                        tempMaxGoalInrArr.push([dateValue, maxGoalInrVal]);
                        tempMinGoalInrArr.push([dateValue, minGoalInrVal]);
                        tempArrCnt++;
                    }
                    else{
                        tempMaxGoalInrArr.push([dateValue, tempMaxGoalInrArr[tempArrCnt - 1][1]]);
                        tempMinGoalInrArr.push([dateValue, tempMinGoalInrArr[tempArrCnt - 1][1]]);
                        tempArrCnt++;
                        masterGoalInrArr.push([tempMaxGoalInrArr, tempMinGoalInrArr]);
                        tempMaxGoalInrArr = [];
                        tempMinGoalInrArr = [];
                        tempArrCnt = 0;
                        tempMaxGoalInrArr.push([dateValue, maxGoalInrVal]);
                        tempMinGoalInrArr.push([dateValue, minGoalInrVal]);
                        tempArrCnt++;
                    }

                }
                else{
                    tempMaxGoalInrArr.push([dateValue, maxGoalInrVal]);
                    tempMinGoalInrArr.push([dateValue, minGoalInrVal]);
                    tempArrCnt++;
                }
            }
            else{
                if(goalInrCnt > 0 && nullCheck === 1){
                    if(prevMaxGoalInrVal != null){
                        tempMaxGoalInrArr.push([dateValue, prevMaxGoalInrVal]);
                        tempMinGoalInrArr.push([dateValue, prevMinGoalInrVal]);
                        tempArrCnt++;
                    }
                    else{
                        tempMaxGoalInrArr.push([dateValue, tempMaxGoalInrArr[tempArrCnt - 1][1]]);
                        tempMinGoalInrArr.push([dateValue, tempMinGoalInrArr[tempArrCnt - 1][1]]);
                        tempArrCnt++;
                    }
                }
            }
            if(maxGoalInrVal != null){
                nullCheck = 1;
            }
            prevMaxGoalInrVal = maxGoalInrVal;
            prevMinGoalInrVal = minGoalInrVal;
        }

        if(tempMaxGoalInrArr.length > 0){
            masterGoalInrArr.push([tempMaxGoalInrArr, tempMinGoalInrArr]);
        }

        //this part just goes and creates the different series on the graph.
        //different series are the different array elements of masterGoalInrArr
        for(var goalInrSeries = 0; goalInrSeries < masterGoalInrArr.length; goalInrSeries++){
            createGoalInrSeries(masterGoalInrArr[goalInrSeries][0], masterGoalInrArr[goalInrSeries][1], goalInrLbl);
            highSeriesGoalInr.push(seriesCnt);
            goalInrLegendItem.indices.push(seriesCnt);
            seriesCnt++;
            lowSeriesGoalInr.push(seriesCnt);
            goalInrLegendItem.indices.push(seriesCnt);
            seriesCnt++;
        }
        goalInrLegendItem.shape = shapes[2];
        goalInrLegendItem.color = "#9ed4ed";
        graphLegend.push(goalInrLegendItem);
    }

/**
 * This function would create a the series and push the data into graphdata array for that particular goal INR series
 * @param {array} inrGoalSeriesArr: Array which contains a particular goal INR series and the associated dates with it
 * @param {string} goalInrLbl: high goal INR value for that particular goal INR series
 */
    function createGoalInrSeries(maxinrGoalSeriesArr, mininrGoalSeriesArr, goalInrLbl){
        var lineColor = "#9ed4ed";
        var markerColor = lineColor;
        var markerStyle = shapes[2];
        var showAndMarkerShow = false;

        //Shows the goal INR high/low on graph when there is no other column to draw the range
        if(maxinrGoalSeriesArr.length === 1){
            showAndMarkerShow = true;
        }

        graphData.push(maxinrGoalSeriesArr.reverse());
        seriesCreation("yaxis", lineColor, markerColor, markerStyle, goalInrLbl, showAndMarkerShow, false, false, "", showAndMarkerShow, true);

        graphData.push(mininrGoalSeriesArr.reverse());
        seriesCreation("yaxis", lineColor, markerColor, markerStyle, goalInrLbl, showAndMarkerShow, false, false, "", showAndMarkerShow, true);

    }


/**
 * This function would call the graph API to plot the graph
 */
    function plotGraph(component) {
            $.jqplot.config.enablePlugins = true;

            //push the canvas overlay to the back of series.
            $.jqplot.postDrawHooks.push(function(){
                $(component.m_compObject.cvCompSec).find(".acGraphContainer .jqplot-overlayCanvas-canvas").css("z-index", "0");
                $(component.m_compObject.cvCompSec).find(".acGraphContainer .jqplot-series-canvas").css("z-index", "1");
                $(component.m_compObject.cvCompSec).find(".acGraphContainer .jqplot-series-shadowCanvas").css("z-index", "1");
                $(component.m_compObject.cvCompSec).find(".acGraphContainer .jqplot-lineRenderer-highlight-canvas").css("z-index", "1");

                $(component.m_compObject.cvCompSec).find(".acGraphContainer .jqplot-highlighter-tooltip").css({
                                                                        "background": "rgba(255, 255, 255, 0)", //Set background to transparent for those series that should not hover.
                                                                        "z-index": "99",
                                                                        "border": "none",
                                                                        "max-width": "200px",
                                                                        "white-space": "pre-line"
                                                                    });
                $(component.m_compObject.cvCompSec).find(".acGraphContainer .jqplot-event-canvas").css({"z-index": "5"});

            });

            //We are binding a mousse event to the graph so that when the tooltip goes off the set width of the graph, it is not cut-off.
            //The tooltip has been given a maximum width of 200px, the if statement checks for the position of the mousse.
            //If the x position is less than 180px, there is a chance that the tooltip might be cut-off, for precautions purposes, we've
            //repositioned the left coordinates of the tooltip to the current position of the mousse.
            $(component.m_compObject.cvCompSec).find(".acGraphContainer").bind("jqplotMouseMove", function (ev, gridpos) {
                var x = gridpos.x;
                var z = $(".acGraphContainer").scrollLeft();
                if (x - z < 180) {
                    $(".acGraphContainer .jqplot-highlighter-tooltip").css("left", x + "px");
                }
            });

            graphPlot = $.jqplot("acGraph" + component.m_compObject.cvCompId, graphData, {
                gridPadding: {left: 0, right: 0, bottom: 0, top: 0},
                seriesDefaults: {
                    rendererOptions: {
                        smooth: false,
                        animation: {
                            show: false
                        }
                    }
                },
                cursor: {
                    show: false
                },
                grid: {
                    drawGridlines: true,
                    gridLineWidth: 0.4,
                    borderWidth: 1.0,
                    shadow: false
                },
                axes: {
                    xaxis: {
                        show: true,
                        label: "Date/Time",
                        showLabel: false,
                        showTicks: true,
                        renderer: $.jqplot.CategoryAxisRenderer
                    },
                    yaxis: {
                        label: "y1",
                        showLabel: false,
                        tickInterval: y1AxisInterval,
                        min: minYaxis,
                        max: maxYaxis,
                        showTicks: false
                    },
                    y2axis: {
                        label: "y2",
                        showLabel: false,
                        tickInterval: y2AxisInterval,
                        min: minY2axis,
                        max: maxY2axis,
                        showTicks: false
                    }
                },
                legend: {
                    show: false,
                    placement: "outside"
                },
                series: graphSeries,
                fillBetween: {
                    // series1: Required, if missing won't fill.
                    series1: highSeriesGoalInr,
                    // series2: Required, if  missing won't fill.
                    series2: lowSeriesGoalInr,
                    // color: Optional, defaults to fillColor of series1.
                    color: "rgba(12, 148, 210, 0.25)",
                    baseSeries: 0,
                    // fill:  Optional, defaults to true.  False to turn off fill.
                    fill: true
                },
                canvasOverlay: {
                    show: true,
                    objects: canvasOverlayArr
                },
                highlighter: {
                    sizeAdjust: 10,
                    tooltipLocation: "sw"
                }
            });
        return;
    }

    return {
/**
 * This is the anticoagulationComponent implementation of the retrieveComponentData function.
 * It creates the necessary parameter array for the data acquisition script call and the associated Request object.
 */
        GetCvTable: function(component) {
            this.refresh(); //clean the variables
            component.m_compObject.cvCompId = component.getComponentId();
            component.m_compObject.cvModRootId = "ac" + component.m_compObject.cvCompId;
            component.m_compObject.cvCompSec = $("#" + component.m_compObject.cvModRootId).get(0);
            component.m_compObject.criterion = component.getCriterion();

            var sendAr = [];
            sendAr.push("^MINE^", component.m_compObject.criterion.person_id + ".0", component.m_compObject.criterion.encntr_id + ".0");
            sendAr.push(MP_Util.CreateParamArray(component.getInrCodes(), 1));
            sendAr.push(MP_Util.CreateParamArray(component.getPtCodes(), 1));
            sendAr.push(MP_Util.CreateParamArray(component.getWarfarinCodes(), 1));
            sendAr.push("1", component.m_compObject.criterion.provider_id + ".0", component.m_compObject.criterion.ppr_cd + ".0", component.m_compObject.criterion.position_cd + ".0");
            sendAr.push(MP_Util.CreateParamArray(component.getGoalInrHighCodes(), 1));
            sendAr.push(MP_Util.CreateParamArray(component.getGoalInrLowCodes(), 1));
            sendAr.push(MP_Util.CreateParamArray(component.get7DayTotalCodes(), 1));
            sendAr.push(MP_Util.CreateParamArray(component.getIndTreatCodes(), 1));
            sendAr.push(MP_Util.CreateParamArray(component.getAntiDateCodes(), 1));
            sendAr.push(component.getLookbackUnits() || 3);
            sendAr.push(component.getLookbackUnitTypeFlag() || 4);
            MP_Core.XMLCclRequestWrapper(component, "MP_ANTICOAG_MGT", sendAr, true);

        },

/**
 * This is the anticoagulationComponent implementation of the renderComponent function.  It takes the information retrieved from the script
 * call and renders the component's visuals.  There is no check on the status of the script call's reply since that is handled in the
 * call to XMLCCLRequestWrapper.
 * @param {MP_Core.ScriptReply} reply: The ScriptReply object returned from the call to MP_Core.XMLCCLRequestCallBack function in the
 * retrieveComponentData function of this object.
 */
        RenderComponent: function(component, reply){
            try {
                recordData = reply;
                graphcontain(component);
            }
            catch (err) {
                throw err;
            }
        },

        refresh: function(){
            graphData = [];
            graphSeries = [];
            minYaxis = 0;
            maxYaxis = 5;
            minY2axis = 0;
            maxY2axis = 5;
            y2AxisInterval = 1;
            y1AxisInterval = 1;
            maxGoalINR = 0;
            maxINR = 0;
            maxPT = 0;
            maxAdmin = 0;
            maxPres = 0;
            highSeriesGoalInr = [];
            lowSeriesGoalInr = [];
            graphLegend = [];
            dateQual = [];
            prescriptions_by_order = {};
            discontinued_by_order = {};
            dismedcnt = 0;
            canvasOverlayArr = [];
            presTableHd = {};
            discTableHd = {};
        },

        /**
        * Writes to the app_prefs table
        * pvc_name =  WARFARIN_MGT_PREFS
        *
        * @param {numeric} compID - the unique id of the consolidated problems component
        */
        WritePreferences: function(jsonObject, prefIdent, saveAsync, compID) {
            var info = CERN_BrowserDevInd ? new XMLHttpRequest() : new XMLCclRequest();
            //If SaveAync is anything but true, its set to false
            if(!saveAsync){
                saveAsync = false;
            }
            info.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    MP_Util.LogScriptCallInfo(null, this, "mp_core.js", "WritePreferences");
                    var jsonEval = JSON.parse(this.responseText);
                    var recordData = jsonEval.RECORD_DATA;
                    if (recordData.STATUS_DATA.STATUS == "Z") {
                        return;
                    }
                    else if (recordData.STATUS_DATA.STATUS == "S") {
                        return;
                    }
                    else {
                        MP_Util.LogScriptCallError(null, this, "mp_core.js", "WritePreferences");
                        var errAr = [];
                        var statusData = recordData.STATUS_DATA;
                        errAr.push("STATUS: " + statusData.STATUS);
                        for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
                            var ss = statusData.SUBEVENTSTATUS[x];
                            errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
                        }
                        window.status = "Error saving user preferences: " + errAr.join(",");
                    }
                }
            };
            var component = MP_Util.GetCompObjById(compID);
            var sJson = jsonObject != null ? JSON.stringify(jsonObject) : "";
            var ar = ["^mine^", component.m_compObject.criterion.provider_id + ".0", "^" + prefIdent + "^", "~" + sJson + "~"];
            if (CERN_BrowserDevInd) {
                var url = "MP_MAINTAIN_USER_PREFS?parameters=" + ar.join(",");
                info.open("GET", url, saveAsync);
                info.send(null);
            }
            else {
                info.open("GET", "MP_MAINTAIN_USER_PREFS", saveAsync);
                info.send(ar.join(","));
            }
        }
    };

};
