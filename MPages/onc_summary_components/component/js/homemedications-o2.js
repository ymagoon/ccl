function HomeMedicationsComponentStyle2() {
    this.initByNamespace("hml2");
}

HomeMedicationsComponentStyle2.prototype = new ComponentStyle();
HomeMedicationsComponentStyle2.prototype.constructor = ComponentStyle;

/**
 * The Home Medication component will retrieve all home medication information associated to the encounter
 *
 * @param {Criterion} criterion - data object that is used to build out the component
 * @returns {undefined} undefined
 */
function HomeMedicationsComponent2(criterion) {
    this.setCriterion(criterion);
    this.setStyles(new HomeMedicationsComponentStyle2());
    this.setComponentLoadTimerName("USR:MPG.HOME_MEDS.O2 - load component");
    this.setComponentRenderTimerName("ENG:MPG.HOME_MEDS.O2 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(1);
    // Med Modification Indicator
    this.m_medModInd = false;
    this.m_editMode = false;
    this.m_medModObj = {};
    this.m_origOrder = {};
    this.m_medRec = false;
    // Medication Reconciliation Statuses
    this.m_medHistory = false;
    this.m_medRecAdmit = false;
    this.m_medRecTransfer = false;
    this.m_medRecCrossEncTx = false;
    this.m_medRecDischarge = false;

    this.setHasActionsMenu(true);
    this.compliance = false;
    this.m_initialRenew = true;
    this.compMenuReference = {};
    this.m_compMenuSequence = [];
    this.inMillennium = CERN_Platform.inMillenniumContext();
    this.m_base = null;
    //As part of JIRA CERTMPAGES-2121  fix in MPageComponent.js the m_grouper_arr has been used directly which results in null pointer exception if m_grouper_arr.length accessed.
    this.m_grouper_arr = [];
    this.m_wasListenerAdded = false;
    this.m_segmentedControl = null;
    this.m_sidePanel = null;
    this.m_sidePanelShowing = false;
    this.m_componentTable = null;
    this.m_tableHoverExtension = null;
    this.m_mfaBanner = null;
    this.m_home_meds_i18n = i18n.discernabu.homemeds_o2;
    // this indicates whether to get millennium home meds data while calling the
    // wrapper script(mp_get_home_meds_json)
    this.m_millDataInd = 1;
    this.pageIndex = 0;
    this.pager = null;
    // Indicates whether we want to view the outside records checkbox
    this.m_viewOutsideRecordsInd = true;
    // Indicates whether to get millennium home meds data while calling the wrapper script(mp_get_home_meds_json)
    this.m_millDataInd = 1;
    // Object Healthe Intent Medications
    this.externalHomeMed = {};
    // Array containing Patient Requested Medications
    this.m_patientRequestList = [];
    // Array containing Millennium Chart Medications
    this.m_otherCharMedsList = [];
    // Flag used to display Healthe Intent Medications
    this.m_displayHiData = false;
    // Privilege that specifies whether a physician can view patient requests.  Yes(2) and Yes w/ exception(3) will display all meds, otherwise(0,1) no.
    this.m_orderInquiryPriv = 1;
    HomeMedicationsComponent2.method("InsertData", function() {
        CERN_HOME_MEDS_O2.GetHomeMedications(this);
    });
    HomeMedicationsComponent2.method("HandleSuccess", function(recordData) {
        var timerRenderComponent = MP_Util.CreateTimer(this.getComponentRenderTimerName());
        try {
            CERN_HOME_MEDS_O2.RenderComponent(this, recordData);

            CERN_HOME_MEDS_O2.initializeSidePanel(this);
        } catch (err) {
            if (timerRenderComponent) {
                timerRenderComponent.Abort();
                timerRenderComponent = null;
            }
            throw (err);
        } finally {
            if (timerRenderComponent) {
                timerRenderComponent.Stop();
            }
        }
    });

    CERN_EventListener.addListener(this, EventListener.EVENT_ORDER_ACTION, this.InsertData, this);
    // Create the getters and setters for component filters/flags
    HomeMedicationsComponent2.method("isMedModInd", function() {
        return this.m_medModInd;
    });
    HomeMedicationsComponent2.method("setMedModInd", function(value) {
        this.m_medModInd = (value == 1 ? true : false);
    });
    HomeMedicationsComponent2.method("setMedRec", function(value) {
        this.m_medRec = (value == 1 ? true : false);
    });
    HomeMedicationsComponent2.method("getMedRec", function(value) {
        return (this.m_medRec);
    });
    // Adding Med rec status related filters getter/setter methods
    HomeMedicationsComponent2.method("setMedHistory", function(value) {
        this.m_medHistory = (value == 1 ? true : false);
    });
    HomeMedicationsComponent2.method("getMedHistory", function() {
        return (this.m_medHistory);
    });
    HomeMedicationsComponent2.method("setMedRecAdmit", function(value) {
        this.m_medRecAdmit = (value == 1 ? true : false);
    });
    HomeMedicationsComponent2.method("getMedRecAdmit", function() {
        return (this.m_medRecAdmit);
    });
    HomeMedicationsComponent2.method("setMedRecTransfer", function(value) {
        this.m_medRecTransfer = (value == 1 ? true : false);
    });
    HomeMedicationsComponent2.method("getMedRecTransfer", function() {
        return (this.m_medRecTransfer);
    });
    HomeMedicationsComponent2.method("setMedRecCrossEncTx", function(value) {
        this.m_medRecCrossEncTx = (value == 1 ? true : false);
    });
    HomeMedicationsComponent2.method("getMedRecCrossEncTx", function() {
        return (this.m_medRecCrossEncTx);
    });
    HomeMedicationsComponent2.method("setMedRecDischarge", function(value) {
        this.m_medRecDischarge = (value == 1 ? true : false);
    });
    HomeMedicationsComponent2.method("getMedRecDischarge", function() {
        return (this.m_medRecDischarge);
    });

    HomeMedicationsComponent2.method("openTab", function() {
        var criterion = this.getCriterion();
        var sParms = '/PERSONID=' + criterion.person_id + ' /ENCNTRID=' + criterion.encntr_id + ' /FIRSTTAB=^' + this.getLink() + '+^';
        APPLINK(0, criterion.executable, sParms);
        this.InsertData();
    });
    /**
     * Set the recordData contained within the component
     * @param {Object} [recordData] recordData containing medication information
     * @return undefined
     */
    HomeMedicationsComponent2.method("setAllData", function(recordData) {
        this.allData = recordData;
    });
    /**
     * Get the recordData contained within the component
     * @return {Object} Record Data containg the component information
     */
    HomeMedicationsComponent2.method("getAllData", function() {
        return this.allData;
    });

    /**
     * set the component table property
     * @param  {ComponentTable} componentTable the component table object
     * @returns {undefined} undefined
     */
    HomeMedicationsComponent2.method("setComponentTable", function(componentTable) {
        this.m_componentTable = componentTable;
    });

    /**
     * get the component table property
     * @return {ComponentTable} the component table object
     */
    HomeMedicationsComponent2.method("getComponentTable", function() {
        return this.m_componentTable;
    });

    /**
     * Get all of the orders from the component
     * @return {Object} JSON Object containing the medicaiton orders
     */
    HomeMedicationsComponent2.prototype.getAllOrders = function() {
        return this.allData.ORDERS;
    };
    /**
     * Set the outside records indicator.  Save the value in a cookie that can be referenced after page refresh or component navigation.
     * This preserves the state of the checkbox throughout the session.  The cookie will be terminated upon logout.
     * @param {Boolean} [value] true or false value used to set the m_viewOutsideRecordsInd variable to;
     * @return undefined
     */
    HomeMedicationsComponent2.prototype.setOutsideRecordsInd = function(value) {
        this.m_viewOutsideRecordsInd = value;
        // Save the View Outside Records indicator as a cookie
        // Note: it is not practical to use true/false because MP_Util.AddCookieProperty returns null for false
        var cookieValue = (value) ? 'yes' : 'no';
        MP_Util.AddCookieProperty(this.getComponentId(), 'VIEW_HOME_MEDS_OUTSIDE_RECORDS', cookieValue);
        MP_Util.WriteCookie();
    };
    /**
     * Get the outside records indicator.  If a cookie exists containing the existing state of the checkbox (checked/unchecked)
     * it will check the value of the cookie and return that the corresponding value of true or false.
     * @return  {Number}  0 means that  view  outside records is disabled, 1 means enabled
     */
    HomeMedicationsComponent2.prototype.getOutsideRecordsInd = function() {
        // Check for an existing cookie value for the outside records preference
        var viewOutsideRecordsCookie = MP_Util.GetCookieProperty(this.getComponentId(), 'VIEW_HOME_MEDS_OUTSIDE_RECORDS');
        if (viewOutsideRecordsCookie) {
            // Set the view outside records preference
            this.setOutsideRecordsInd(viewOutsideRecordsCookie === 'yes');
        }
        return this.m_viewOutsideRecordsInd;
    };
    /**
     * Checks if the View Patient Entered Data bedrock filter is set and if the view outside records checkbox is checked
     * @return {Boolean} True or False dictating whether Patient Entered Data is displayable
     */
    HomeMedicationsComponent2.prototype.isPatientEnteredDataDisplayEnabled = function() {
        return (this.getPatientEnteredDataInd() && this.getOutsideRecordsInd());
    };
    /**
     * Get the Chart Medications List
     * @return  {Array} List containing Existing Chart Medications (Does not include Patient Requests or Healthe Intent)
     */
    HomeMedicationsComponent2.prototype.getOtherChartMedsList = function() {
        return this.m_otherCharMedsList;
    };
    /**
     * Get the patient request list.
     * @return  {Array} List containing all of orders for patient requested medications
     */
    HomeMedicationsComponent2.prototype.getPatientRequestList = function() {
        return this.m_patientRequestList;
    };
    /**
     * Set the m_displayHiData indicator which determines whether to display Healthe Intent Data or not
     * @param {Boolean} value - true or false dictating whether to display Healthe Intent Data
     * @return {undefined}
     */
    HomeMedicationsComponent2.prototype.setDisplayHiDataInd = function(value) {
        this.m_displayHiData = value;
    };
    /**
     * Get the m_displayHiData indicator which determines whether we want to display Healthe Intent Data
     * @return {Boolean} - true or false dictating whether Heathe Intent Data is displayable
     */
    HomeMedicationsComponent2.prototype.getDisplayHiDataInd = function() {
        return this.m_displayHiData;
    };
    /**
     * Set the segmented control button. Used to display Patient Requests and Outside Records
     * @param {Object} value - Segmented Control Button Object
     * @return {undefined}
     */
    HomeMedicationsComponent2.prototype.setSegmentedControl = function(value) {
        this.m_segmentedControl = value;
    };
    /**
     * Get the segmented control. Used to display Patient Requests and Outside Records
     * @param {Object} value - Segmented Control Button Object
     * @return {undefined}
     */
    HomeMedicationsComponent2.prototype.getSegmentedControl = function() {
        return this.m_segmentedControl;
    };
    /**
     * Set med status data json Object.
     * @param {Object} statusData - json object containing med status data
     * @return  {undefined}
     */
    HomeMedicationsComponent2.method("setMedStatusData", function(statusData) {
        this.medStatusData = statusData;
    });
    /**
     * Get the med status data json object.
     * @return  {object} json object containing the med status data
     */
    HomeMedicationsComponent2.method("getMedStatusData", function() {
        return this.medStatusData;
    });
    HomeMedicationsComponent2.method("setCompliance", function(value) {
        this.compliance = value;
    });
    HomeMedicationsComponent2.method("hasCompliance", function() {
        return this.compliance;
    });
    HomeMedicationsComponent2.method("setInitialRenew", function(value) {
        this.m_initialRenew = value;
    });
    HomeMedicationsComponent2.method("getInitialRenew", function() {
        return this.m_initialRenew;
    });


    /**
     * set the hover extension object for the medications component table
     * @param {object} hoverExtension the component table hover extension object
     * @return {undefined} undefined
     */
    HomeMedicationsComponent2.prototype.setTableHoverExtension = function(hoverExtension) {
        this.m_tableHoverExtension = hoverExtension;
    };
    /**
     * get the hover extension object for the medications component table
     * @return {object} the component table hover extension object
     */
    HomeMedicationsComponent2.prototype.getTableHoverExtension = function() {
        return this.m_tableHoverExtension;
    };


    /**
     * Calls the architecture level resizeComponent function while adding some component specific logic.
     * component specific logic.
     * 
     * @this {HomeMedicationsComponent2}
     * @return null
     */
    HomeMedicationsComponent2.prototype.resizeComponent = function() {
        var compDOMObj = null;
        var container = null;
        var viewHeight = 0;
        var componentId = this.getComponentId();
        var accordion = $("#AccordionContainer" + componentId);
        var accordionContent = $("#Accordion" + componentId + "Content");
        var accordionContentStyle;
        var isExpanded = false;
        //Check if the accordion is expanded.  If it is, temporarily collapse it.
        if (accordion.length > 0) {
            isExpanded = accordion.hasClass("Expanded");
            if (isExpanded) {
                accordion.removeClass("Expanded");
                if (accordionContent.length) {
                    accordionContentStyle = accordionContent.attr("style");
                    accordionContent.removeAttr("style");
                }
            }
        }

        container = $("#vwpBody");
        if (!container.length) {
            return;
        }
        viewHeight = container.height();

        // Make sure component is rendered
        compDOMObj = $("#" + this.getStyles().getId());
        if (!compDOMObj.length) {
            return;
        }

        // calculate available height for dynamic elements and perform the resize
        this.calcDynamicSize(compDOMObj, viewHeight);

        //If the accordion was expanded, expand it again
        if (isExpanded && accordion.length > 0) {
            accordion.addClass("Expanded");
            accordionContent.attr("style", accordionContentStyle);
        }
    };


    /**
     * Calculates and adjusts the heights of dynamically sized elements in the content-body
     *
     * @param {$Object}
     *            compDOM the DOM object belonging to the component
     * @param {number}
     *            viewHeight the height available to the component
     * @return {undefined}
     */
    HomeMedicationsComponent2.prototype.calcDynamicSize = function(compDOM, viewHeight) {
        var compId = this.getComponentId();
        // DOM elements
        var extDataTableDOM = compDOM.find("#hml2" + compId + "externaldata");
        var extDataTablePagerDOM = compDOM.find("#pager" + compId);
        var tableDOM = compDOM.find("#hml2" + compId + "table");

        // collect all the main content sections (externalData table and the standard homeMeds table)
        var mainContainersDOM = extDataTableDOM.add(tableDOM.closest(".content-body"));

        // collect the inner content bodies from the main content sections
        var innerContentBodyDOM = mainContainersDOM.find(".content-body");

        // Other
        var sidePanel = this.m_sidePanel;
        var contentBodyMaxHeight = viewHeight;
        var sidePanelMaxHeight = viewHeight;

        var adjacents = ".sec-hd" + ",.hml2-meds-header-info-container" + ",#hml2Ftr" + compId + ",#hml2Content" + compId;

        // retrieve all adjacent elements and store them in a jQuery object
        adjacentElements = compDOM.find(adjacents);

        // elements that remove available height (through padding) from contentBody and sidePanel
        adjacentElements.filter("#hml2Content" + this.getComponentId()).each(function() {
            var paddingSpace = $(this).innerHeight() - $(this).height();
            contentBodyMaxHeight -= paddingSpace;
            sidePanelMaxHeight -= paddingSpace;
        });

        // elements that remove available height from contentBody and sidePanel
        adjacentElements.filter(".sec-hd, .hml2-meds-header-info-container").each(function() {
            var adjElementHeight = $(this).outerHeight();
            contentBodyMaxHeight -= adjElementHeight;
            sidePanelMaxHeight -= adjElementHeight;
        });

        // remove the margin height of the external data table from the available height if showing
        if (extDataTableDOM.length) {
            contentBodyMaxHeight -= parseInt(extDataTableDOM.closest(".hml2-externaldata-container").css("margin-bottom"), 10);

            // remove the height of the pager from the available height if showing
            if (extDataTablePagerDOM.length) {
                contentBodyMaxHeight -= extDataTablePagerDOM.outerHeight();
            }
        }

        // elements that remove available height from only contentBody
        adjacentElements.filter(".hml2-content-ft").each(function() {
            contentBodyMaxHeight -= $(this).outerHeight();
        });

        contentBodyMaxHeight /= mainContainersDOM.length;

        // constrict the outer content body to the maximum height in the current view pane
        mainContainersDOM.css({
            "max-height": contentBodyMaxHeight + "px",
            "overflow-y": "hidden"
        });

        // constrict the inner content body to fit in the outer content body alongside table header
        innerContentBodyDOM.each(function() {
            var _this = $(this);
            var table = _this.closest(".content-body");
            var tableHeaderHeight = table.find(".content-hdr").outerHeight();
            var tableBorderHeight = innerContentBodyDOM.outerHeight() - innerContentBodyDOM.height();
            _this.css({
                "max-height": (contentBodyMaxHeight - tableHeaderHeight - tableBorderHeight) + "px",
                "overflow-y": "auto"
            });
        });

        // If the component has a component table, call the table's post-resize function
        var compTable = this.getComponentTable();
        if (compTable) {
            compTable.updateAfterResize();
        }

        // If the component has a external data table, call the table's post-resize function
        if (this.m_externalDataTable) {
            this.m_externalDataTable.updateAfterResize();
        }

        if (sidePanel && this.m_sidePanelShowing) {
            sidePanel.collapseSidePanel();
            sidePanel.setMinHeight(contentBodyMaxHeight + "px");
            sidePanel.setHeight(contentBodyMaxHeight + "px");
            sidePanel.resizePanel(sidePanelMaxHeight + "px");
            sidePanel.expandSidePanel();
        }
    };

    /**
     * DEPRECATED
     * The following instantiates Home Medication's own "renderAccordion" function. All MPage components have this function, but the following is unique to Home Medication.
     * Particularly, the following creates a drop down list in the accordion which will sort the drugs displayed in Home Medications by the drug class groupings defined in
     * Bedrock. Additionally, any selected grouping will automatically be saved to the component upon refresh. Furthermore, there is also the ability to reset the component's
     * preferences with the following function which is allowable by two elements, a checkbox (uncheck to reset the preferences, check to allow the user to select a grouping)
     * and a "Reset All" button. If the preferences are cleared and no grouping is selected, the drugs will be sorted alphabetically by default.
     * @param {object} component - home medications component
     * @returns {undefined} undefined
     */
    HomeMedicationsComponent2.method("renderAccordion", function(component) {});

}

HomeMedicationsComponent2.inherits(MPageComponent);
/**
 * Sets the wasListenerAdded flag to indicate whether the listener has been added.
 * @param {boolean} value - the value to set the flag to
 * @returns {undefined} undefined 
 */
HomeMedicationsComponent2.prototype.setWasListenerAdded = function(value) {
    this.m_wasListenerAdded = value;
};
/**
 * Gets the value of the wasListenerAdded flag to determine if the event listener has been added yet
 * @returns {boolean} wasListenerAdded flag 
 */
HomeMedicationsComponent2.prototype.getWasListenerAdded = function() {
    return this.m_wasListenerAdded;
};

/**
 * Creates the filterMappings that will be used when loading the component's bedrock settings for InfoButton
 * @returns {undefined} undefined
 */
HomeMedicationsComponent2.prototype.loadFilterMappings = function() {

    //Add the filter mapping object for the Catalog Type Codes
    this.addFilterMappingObject("WF_HOME_MEDS_INFO_BUTTON_IND", {

        setFunction: this.setHasInfoButton,
        type: "BOOLEAN",
        field: "FREETEXT_DESC"
    });
    // Add the filter mapping object for the patient entered data indicator
    this.addFilterMappingObject("WF_PAT_ENTERED_HOME_MEDS", {
        setFunction: this.setPatientEnteredDataInd,
        type: "BOOLEAN",
        field: "FREETEXT_DESC"
    });
    // Add the filter mapping object to set the External Data Indicator used to enable the display Healthe Intent and Patient Requests
    this.addFilterMappingObject("WF_HOME_MEDS_EXT_DATA_IND", {

        setFunction: this.setExternalDataInd,
        type: "BOOLEAN",
        field: "FREETEXT_DESC"
    });
    // Add the filter mapping object to set the Healthe Intent Test URI.  This is only used for testing
    this.addFilterMappingObject("WF_HM_EXT_DATA_TEST_URI", {
        setFunction: this.setHITestUri,
        type: "STRING",
        field: "FREETEXT_DESC"
    });
    // Add the filter mapping object that sets the inidcator to enable Meds History Reconciliation
    this.addFilterMappingObject("WF_HM_MR_HIS_IND", {
        setFunction: this.setMedHistory,
        type: "BOOLEAN",
        field: "FREETEXT_DESC"
    });
    // Add the filter mapping object that sets the inidcator to enable Admissions Med Rec
    this.addFilterMappingObject("WF_HM_MR_ADM_IND", {
        setFunction: this.setMedRecAdmit,
        type: "BOOLEAN",
        field: "FREETEXT_DESC"
    });
    // Add the filter mapping object that sets the inidcator to enable Transfer Med Rec
    this.addFilterMappingObject("WF_HM_MR_TRNS_IND", {
        setFunction: this.setMedRecTransfer,
        type: "BOOLEAN",
        field: "FREETEXT_DESC"
    });
    // Add the filter mapping object that sets the inidcator to enable Cross Transfer Med Rec
    this.addFilterMappingObject("WF_HM_MR_CTRNS_IND", {
        setFunction: this.setMedRecCrossEncTx,
        type: "BOOLEAN",
        field: "FREETEXT_DESC"
    });
    // Add the filter mapping object that sets the inidcator to enable Discharge Med Rec
    this.addFilterMappingObject("WF_HM_MR_DSCH_IND", {
        setFunction: this.setMedRecDischarge,
        type: "BOOLEAN",
        field: "FREETEXT_DESC"
    });
    //Added Gap Check required indicator and Help text filters
    this.addFilterMappingObject("WF_HOME_MEDS_REQD", {
        setFunction: this.setGapCheckRequiredInd,
        type: "BOOLEAN",
        field: "FREETEXT_DESC"
    });
    this.addFilterMappingObject("WF_HOME_MEDS_HELP_TXT", {
        setFunction: this.setRequiredCompDisclaimerText,
        type: "STRING",
        field: "FREETEXT_DESC"
    });
    //Add the filter mapping for deciding whether override functionality is required or not
    this.addFilterMappingObject("WF_HOME_MEDS_REQ_OVR", {
        setFunction: this.setOverrideInd,
        type: "Boolean",
        field: "FREETEXT_DESC"
    });
};

/**
 * invoke the Orders API to open the Medications Reconciliation modal window and refresh the component when that action is complete
 * @param {number} compId - Component id for the home-medications-o2 component
 * @param {number} recMode 1 Admission, 2 Transfer, 3 Discharge Mode
 * @param {number} venueCode - the venue code
 * @returns {undefined} undefined
 */
HomeMedicationsComponent2.prototype.launchMedicationReconciliation = function(compId, recMode, venueCode) {
    var component = MP_Util.GetCompObjById(compId);
    var criterion = component.getCriterion();
    var mrObject = {};
    try {
        MP_Util.LogDiscernInfo(this, "ORDERS", "homemedications-o2.js", "launchMedicationReconciliation");
        mrObject = window.external.DiscernObjectFactory("ORDERS");
        mrObject.PersonId = criterion.person_id;
        mrObject.EncntrId = criterion.encntr_id;
        mrObject.reconciliationMode = recMode;
        mrObject.defaultVenue = venueCode;
        mrObject.LaunchOrdersMode(2, 0, 0);
        component.InsertData();
    } catch (err) {
        MP_Util.LogJSError(err, null, "homemedications.js", "launchMedicationReconciliation");
        alert(i18n.discernabu.homemeds_o2.ERROR_MEDS_REC);
    }
};
/**
 * Checks if the Med rec Discharge Status is Completed
 * @returns {boolean} true-Discharge medrec is in Complete Status; false-Dicharge med rec is in any other status
 */
HomeMedicationsComponent2.prototype.satisfierRequirement = function() {
    var compID = this.getComponentId();
    var component = MP_Util.GetCompObjById(compID);
    var medRecStatusReply = component.getMedStatusData();
    var isSatisfied = medRecStatusReply.MEDREC_DISCHARGE_STATUS.STATUS_FLAG === 0 ? true : false;
    return isSatisfied;
};
/**
 * Initiates EVENT_SATISFIER_UPDATE method to change the icon based on the value returned from the satisfier condition and updates the satisfied indicator.
 * @returns {undefined} undefined
 */
HomeMedicationsComponent2.prototype.updateSatisfierRequirementIndicator = function() {
    if (this.getGapCheckRequiredInd()) {
        var component = this;
        var isRequirementSatisfied = component.satisfierRequirement();
        this.setSatisfiedInd(isRequirementSatisfied);
        CERN_EventListener.fireEvent(this, this, EventListener.EVENT_SATISFIER_UPDATE, {
            satisfied: isRequirementSatisfied
        });
        component.updateComponentRequiredIndicator();
    }
};

/**
 * The following function is used for the component level menu for home-meds-o2. The items in the component level menu also include a fly out sequence by menu which lists
 * out the filters from bedrock and the data is displayed based on the filter selected. It also has some buttons which are based on the selection of the rows. Additionally,
 * any selected grouping will automatically be saved to the component upon click.
 * @returns {undefined} undefined
 */
HomeMedicationsComponent2.prototype.preProcessing = function() {
    // Set the indicator for viewing outside records
    this.setOutsideRecordsInd(this.isPatientEnteredDataDisplayEnabled());
    this.setDisplayHiDataInd(this.getExternalDataInd() && !this.getPatientEnteredDataInd());
    var compMenu = this.getMenu();
    var hmi18n = i18n.discernabu.homemeds_o2;
    var mnuDisplay = "";
    var compID = this.getComponentId();
    var style = this.getStyles();
    var groupNum = -1;
    var groupLen = this.m_grouper_arr.length;
    var firstGroupingLabel = "";
    var uniqueComponentId = style.getId();
    var pageLevelFilters = null;
    var groupingApplied = false;
    var self = this;
    var z = 0;
    if (compMenu) {
        // Declare component menu items and add events to them
        var compMenuSequence = new Menu("compMenuSequence" + compID);
        //InfoButton Menu item
        var compMenuInfoButton = new MenuSelection("compMenuInfoButton" + compID);
        var compMenuSeperator = new MenuSeparator("compMenuSeperator" + compID);
        var compMenuRenew = new MenuSelection("compMenuRenew" + compID);
        var compMenuCancel = new MenuSelection("compMenuCancel" + compID);
        var compMenuComplete = new MenuSelection("compMenuComplete" + compID);
        var compMenuReset = new MenuSelection("compMenuReset" + compID);
        var compMenuGoto = new MenuSelection("compMenuGoto" + compID);
        var compMenuSign = new MenuSelection("compMenuSign" + compID);

        compMenuSequence.setLabel(hmi18n.SEQUENCEBY);
        compMenuSequence.setAnchorConnectionCorner(["top", "left"]);
        compMenuSequence.setContentConnectionCorner(["top", "right"]);
        compMenuSequence.setIsDisabled(false);
        compMenu.addMenuItem(compMenuSequence);

        //Validate InfoButton from Bedrock
        if (self.hasInfoButton()) {
            compMenuInfoButton.setLabel(i18n.discernabu.INFO_BUTTON);
            compMenu.addMenuItem(compMenuInfoButton);
            this.compMenuReference[compMenuInfoButton.getId()] = compMenuInfoButton;
        }
        compMenuInfoButton.setClickFunction(function(clickEvent) {
            clickEvent.id = "mnuInfoButton" + compID;
            CERN_HOME_MEDS_O2.callInfoButtonClick(clickEvent);
        });

        compMenu.addMenuItem(compMenuSeperator);

        compMenuRenew.setLabel(hmi18n.MED_RENEW);
        compMenu.addMenuItem(compMenuRenew);
        compMenuRenew.setIsDisabled(true);
        this.compMenuReference[compMenuRenew.getId()] = compMenuRenew;

        compMenuCancel.setLabel(hmi18n.MED_CANCEL);
        compMenu.addMenuItem(compMenuCancel);
        compMenuCancel.setIsDisabled(true);
        this.compMenuReference[compMenuCancel.getId()] = compMenuCancel;

        compMenuComplete.setLabel(hmi18n.MED_COMPLETE);
        compMenu.addMenuItem(compMenuComplete);
        compMenuComplete.setIsDisabled(true);
        this.compMenuReference[compMenuComplete.getId()] = compMenuComplete;

        compMenuReset.setLabel(hmi18n.MED_RESET);
        compMenu.addMenuItem(compMenuReset);
        compMenuReset.setIsDisabled(true);
        this.compMenuReference[compMenuReset.getId()] = compMenuReset;

        compMenuGoto.setLabel(hmi18n.MED_GTO);
        compMenu.addMenuItem(compMenuGoto);
        compMenuGoto.setIsDisabled(true);
        this.compMenuReference[compMenuGoto.getId()] = compMenuGoto;

        compMenuSign.setLabel(hmi18n.MED_SIGN);
        compMenu.addMenuItem(compMenuSign);
        compMenuSign.setIsDisabled(true);
        this.compMenuReference[compMenuSign.getId()] = compMenuSign;

        compMenuRenew.setClickFunction(function(clickEvent) {
            clickEvent.id = "mnuRenew" + compID;
            CERN_HOME_MEDS_O2.callQueueOrder(clickEvent);
        });

        compMenuCancel.setClickFunction(function(clickEvent) {
            clickEvent.id = "medCnclBtn" + compID;
            CERN_HOME_MEDS_O2.callQueueOrder(clickEvent);
        });

        compMenuComplete.setClickFunction(function(clickEvent) {
            clickEvent.id = "medCmpltBtn" + compID;
            CERN_HOME_MEDS_O2.callQueueOrder(clickEvent);
        });

        compMenuReset.setClickFunction(function(clickEvent) {
            clickEvent.id = "mnuRnwReset" + compID;
            CERN_HOME_MEDS_O2.callResetRows(clickEvent);
        });

        compMenuGoto.setClickFunction(function(clickEvent) {
            clickEvent.id = "mnuGtOrders" + compID;
            CERN_HOME_MEDS_O2.callSignMedMods(clickEvent);
        });

        compMenuSign.setClickFunction(function(clickEvent) {
            clickEvent.id = "mnuSign" + compID;
            CERN_HOME_MEDS_O2.callSignMedMods(clickEvent);
        });

        // if there are no filters defined in bedrock then remove the sequence by filter.
        var bedrockFlag = 0;
        for (var i = 0; i < 10; i++) { //10 is the maximum number of filter labels
            if (self.getGrouperLabel(i)) {
                bedrockFlag = 1;
                break;
            }
        }

        if (bedrockFlag === 0) {
            compMenu.removeMenuItem(compMenuSequence);
            compMenu.removeMenuItem(compMenuSeperator);
        }

        if (self.getGrouperFilterLabel()) {
            mnuDisplay = self.getGrouperFilterLabel();
            groupingApplied = true;
        }

        var groupingFilterItem;

        if (groupLen > 0) {
            groupingFilterItem = new MenuSelection("groupingFilterItem" + uniqueComponentId + "-" + 10);
            groupingFilterItem.setLabel(hmi18n.DEFAULT);
            compMenuSequence.addMenuItem(groupingFilterItem);
            groupingFilterItem.setClickFunction(CERN_HOME_MEDS_O2.createFilterClickFunction(groupingFilterItem, 10, compID));
            if (mnuDisplay === "") {
                groupingFilterItem.setIsSelected(true);
            }
        }

        for (z = 0, c = 0; c < groupLen && z < 10; z++) {
            var currentLabel = self.getGrouperLabel(z);
            if (currentLabel) {
                c++;
                groupingFilterItem = new MenuSelection("groupingFilterItem" + uniqueComponentId + "-" + z);
                groupingFilterItem.setLabel(currentLabel);

                if (currentLabel === mnuDisplay) {
                    groupingFilterItem.setIsSelected(true);
                }

                groupingFilterItem.setClickFunction(CERN_HOME_MEDS_O2.createFilterClickFunction(groupingFilterItem, z, compID));
                compMenuSequence.addMenuItem(groupingFilterItem);
            }
        }

        var groupingFilterNonCatItem = new MenuSelection("groupingFilterNonCatItem" + uniqueComponentId + "-" + groupLen + 1);
        groupingFilterNonCatItem.setLabel(hmi18n.NON_CATEGORIZED);

        if (hmi18n.NON_CATEGORIZED === mnuDisplay) {
            groupingFilterNonCatItem.setIsSelected(true);
        }

        // Get page level filters from shared resource 
        var resourceName = this.getCriterion().category_mean + "pageLevelFilters";

        var pageLevelFilters = MP_Resources.getSharedResource(resourceName);
        if (pageLevelFilters && pageLevelFilters.isResourceAvailable()) {
            //At this point, the codes are already available, so get the data
            var plFilters = pageLevelFilters.getResourceData();
            var plFiltersLen = plFilters.length;
            if (plFiltersLen > 0) {
                for (var index = 0; index < plFiltersLen; index++) {

                    var filterObj = plFilters[index];
                    switch (filterObj.F_MN) {
                        case "WF_HI_LOOKUP_KEY":
                            this.setHILookupKey(filterObj.VALS[0].FTXT);
                            break;
                        case "WF_HI_ALIAS_TYPE":
                            this.setAliasType(filterObj.VALS[0].FTXT);
                            break;
                        case "WF_HI_ALIAS_POOL_CD":
                            this.setAliasPoolCd(filterObj.VALS[0].PE_ID);
                            break;
                    }
                }
            }
        }
        groupingFilterNonCatItem.setClickFunction(CERN_HOME_MEDS_O2.createFilterClickFunction(groupingFilterNonCatItem, groupLen + 1, compID));
        compMenuSequence.addMenuItem(groupingFilterNonCatItem);

        MP_MenuManager.updateMenuObject(compMenu);

        self.m_compMenuSequence = compMenuSequence;
    }

    if (self.getExternalDataInd()) {
      self.authenticateExternalDataAccess();
    }
};

/**
 * This function calls the MFA utility to verify the users ability to view external HI data.
 * Upon successful verification, the HI person search will search HI data.
 * If authentication fails, the search will be restricted to Millennium data.
 */
HomeMedicationsComponent2.prototype.authenticateExternalDataAccess = function() {
    var component = this;
    var authStatus = new Mfa_Auth().RetrieveMfaAuthStatus();
    var authStatusData;
    // MFA error status
    var status = 4;
    var disableExternalData = function(status, message) {
        component.setMfaBanner(status, message);
        component.setExternalDataInd(false);
        component.setDisplayHiDataInd(false);
    }

    if (authStatus.isResourceAvailable()) {
        authStatusData = authStatus.getResourceData();
        if (authStatusData) {
            status = authStatusData.status;
            // If status is not successful and needed still for current session
            if (status !== 0 && status !== 5) {
                disableExternalData(status, authStatusData.message);
            }
        }
    }
    else {
        disableExternalData(status, i18n.discernabu.mfa_auth.MFA_ERROR_MSG);
    }

    component.auditMfaAuth(status);
};

/**
 * This function creates and sets the appropriate mfa alert banner.
 * @param {int} status - status number of the mfa call
 * @param {String} message - the message to display on the alert banner
 */
HomeMedicationsComponent2.prototype.setMfaBanner = function(status, message) {
    var component = this;
    var hmI18n = component.m_home_meds_i18n;
    var alertBanner = new MPageUI.AlertBanner();

    // If user fails to authenticate or cancels authentication
    if (status === 2 || status === 3) {
        alertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.INFO);
    }
    else {
        alertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
    }
    alertBanner
        .setPrimaryText(message)
        .setSecondaryText(hmI18n.MFA_RESTRICTION);
    component.m_mfaBanner = alertBanner;
}

/**
 * This function submits the event audit for MFA.
 * @param {int} status - status number of the mfa call
 */
HomeMedicationsComponent2.prototype.auditMfaAuth = function(status) {
    var component = this;
    var providerID = component.getCriterion().provider_id + '.0';
    var mpEventAudit = new MP_EventAudit();
    var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
    var dateTime = new Date();

    dateTime = dateFormatter.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);

    mpEventAudit.setAuditMode(0);
    mpEventAudit.setAuditEventName('MPD_HOME_MEDICATIONS_MFA_ATTEMPT');
    mpEventAudit.setAuditEventType('SECURITY');
    mpEventAudit.setAuditParticipantType('PERSON');
    mpEventAudit.setAuditParticipantRoleCd('PROVIDER');
    mpEventAudit.setAuditParticipantIDType('PROVIDER_NUMBER');
    mpEventAudit.setAuditParticipantID(providerID);
    mpEventAudit.setAuditParticipantName('STATUS=' + status + ';DATE=' + dateTime);
    mpEventAudit.addAuditEvent();
    mpEventAudit.submit();
};

/**
 * Document methods
 * @namespace CERN_HOME_MEDS_O2
 * @static
 * @global
 */

var CERN_HOME_MEDS_O2 = function() {
    var m_df = null;
    return {

        createFilterClickFunction: function(menuItem, index, compID) {
            return function() {
                var defaultFilterIndex = 10;
                var self = MP_Util.GetCompObjById(compID);
                var compMenuArr = self.m_compMenuSequence ? self.m_compMenuSequence.getMenuItemArray() : null;
                var compMenuArrLength = compMenuArr ? compMenuArr.length : 0;

                for (var a = compMenuArrLength; a--;) {
                    compMenuArr[a].setIsSelected(false);
                }

                menuItem.setIsSelected(true);
                if (index == defaultFilterIndex) { // default is selected
                    firstGroupingLabel = "";
                    CERN_HOME_MEDS_O2.ShowLoadingImage(compID);
                    CERN_HOME_MEDS_O2.DisplayAllData(compID, -1, firstGroupingLabel);
                } else { // bedrock filter is selected
                    var grouperCriteria = self.getGrouperCriteria(index);
                    var recordData = self.getAllData();
                    self.setGrouperFilterLabel(menuItem.getLabel());
                    self.setGrouperFilterCriteria(grouperCriteria);
                    CERN_HOME_MEDS_O2.ShowLoadingImage(compID);
                    MP_Core.AppUserPreferenceManager.UpdateSingleCompPreferences(self, true);
                    if (recordData) {
                        CERN_HOME_MEDS_O2.RenderComponent(self, recordData);
                        CERN_HOME_MEDS_O2.initializeSidePanel(self);
                    }
                }
            };
        },

        /**
         * CCL transaction to retrieve home medications data
         *
         *  Execution flow is as follows:
         *  mp_get_home_meds_json --> mp_get_home_medications --> mp_get_orders --> uar_SrvExecute Request 680202 (ORDERS_GETORDERPROFILE)
         *
         * @Parameter component [required] - home med component object to retrieve data for
         * @return undefined
         */
        GetHomeMedications: function(component) {
            /*
             LOAD INDICATOR						BASE10	INCLUDE
             load_ordered_ind					1		YES
             load_future_ind					2		YES
             load_in_process_ind				4		YES
             load_on_hold_ind					8		YES
             load_suspended_ind					16		YES
             load_incomplete_ind				32		YES
             load_canceled_ind					64		NO
             load_discontinued_ind				128		NO
             load_completed_ind					256		NO
             load_pending_complete_ind			512		NO
             load_voided_with_results_ind		1024	NO
             load_voided_without_results_ind	2048	NO
             load_transfer_canceled_ind			4096	NO

             1 + 2 + 4 + 8 + 16 + 32 = 63
             */
            // Set the variables used in the CCL request
            var sendAr = [];
            var criterion = component.getCriterion();
            var prsnlInfo = criterion.getPersonnelInfo();
            // Get all viewable encounters and format them in a value() array for backend processing
            var encntrs = prsnlInfo.getViewableEncounters();
            var encntrVal = (encntrs) ? "value(" + encntrs + ")" : "0.0";
            var aliasType = component.getAliasType() || "^^";
            var aliasPoolCd = (component.getAliasPoolCd()) ? component.getAliasPoolCd() + ".0" : "0.0";
            var pageIndex = 0;

            // Determines whether we retrieve Chart Medications. (Meds other than Patient Requests and Healthe Intent)
            var millDataInd = 1;

            // Retrieve Compliance and Drug Class Info from mp_get_orders
            // All other renewal info for refills and qty is retrieved via mp_get_home_medications_renew
            var homeMedsInd = 0;

            // Determine whether we retrieve Patient Request information from the Interop Service. 0 = off
            var interopDataInd = (component.getPatientEnteredDataInd() && component.getOutsideRecordsInd()) ? 1 : 0;

            var medStatusReplyFlag = false;

            if (!component.getWasListenerAdded()) {
                CERN_EventListener.addListener(component, EventListener.EVENT_ORDER_ACTION, component.InsertData, component);
                component.setWasListenerAdded(true);
            }

            if (component.getMedHistory() || component.getMedRecAdmit() || component.getMedRecDischarge() || component.getMedRecTransfer() || component.getMedRecCrossEncTx()) {
                medStatusReplyFlag = true;
            }
            // Test URI and Lookup Key used to retrieve mock Healthe Intent data (Only used for testing purposes)
            var hiTestURI = "^^";
            var lookupKey = "^^";
            if (component.getExternalDataInd()) {
                // Get the test URI used to display mock Healthe Intent Data
                hiTestURI = ("^" + component.getHITestUri() + "^");
                // Get the Lookup Key used with the Healthe Intent Test URI to display the Mock HI data
                lookupKey = ("^" + component.getHILookupKey() + "^");
            }
            sendAr.push("^MINE^", criterion.person_id + ".0", encntrVal, criterion.provider_id + ".0", component.getScope(), criterion.ppr_cd + ".0", homeMedsInd, lookupKey, aliasType, aliasPoolCd, hiTestURI, pageIndex, millDataInd, interopDataInd);
            var request = new MP_Core.ScriptRequest(component, component.getComponentLoadTimerName());
            request.setProgramName("MP_GET_HOME_MEDS_JSON");
            request.setParameters(sendAr);
            request.setAsync(true);
            component.m_base = new MPageComponents.HomeMedicationsBase(component);
            component.m_base.setCriterion(criterion);
            component.setInitialRenew(true);
            if (component.m_millDataInd) {
                MP_Core.XMLCCLRequestCallBack(component, request, function(reply) {
                    var recordData = reply.getResponse();
                    if (recordData.STATUS_DATA.STATUS !== "S" && recordData.STATUS_DATA.STATUS !== "Z") {
                        var error = new Error("MP_GET_HOME_MEDS_JSON status failure");
                        MP_Util.LogJSError(error, component, "homemedications-o2.js", "GetHomeMedications");
                        throw error;
                    }
                    if ((component.getMedRec() && medStatusReplyFlag) || component.getGapCheckRequiredInd()) {
                        // Script Request to get Meds Status Data
                        var statusScriptRequest = new ComponentScriptRequest();
                        statusScriptRequest.setProgramName("MP_GET_MED_STATUS");
                        statusScriptRequest.setParameterArray(["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", criterion.ppr_cd + ".0"]);
                        statusScriptRequest.setComponent(component);
                        statusScriptRequest.setName("GetMedsStatusData");
                        // Set the response handler
                        statusScriptRequest.setResponseHandler(function(scriptReply) {
                            if (scriptReply.getStatus() === "S") {
                                // Set the Meds Status Data upon successful script execution
                                component.setMedStatusData(scriptReply.getResponse());
                            }
                            component.HandleSuccess(reply.getResponse());
                        });
                        //assign the response handler to gain full control on how 'Z' and 'F' status are handled.
                        statusScriptRequest.performRequest();
                    } else {
                        component.HandleSuccess(reply.getResponse());
                    }
                });
            } else {
                MP_Core.XMLCCLRequestCallBack(component, request, function(reply) {
                    var compId = component.getComponentId();
                    var response = reply.getResponse();
                    var errMsg = [];
                    try {
                        var status = response.STATUS_DATA.SUBEVENTSTATUS[0].OPERATIONSTATUS;
                        // Handle error condition if the status is "S".
                        if (status === "S") {
                            var allData = component.getAllData();
                            allData.HIURI = response.HIURI;
                            allData.HTTPREPLY = response.HTTPREPLY;
                            component.setAllData(response);
                            var hasExtDataProcessedSuccessfully = CERN_HOME_MEDS_O2.processExtDataForRender(component);
                            if (hasExtDataProcessedSuccessfully) {
                                component.m_externalDataTable.bindData(component.externalHomeMed.groups);
                                component.m_externalDataTable.refresh();
                                component.m_millDataInd = 1;
                            } else {
                                errMsg = [];
                                errMsg.push("Error in retriving external data");
                                $("#hml2" + compId + "externaldata").html(MP_Util.HandleErrorResponse("", errMsg.join("<br/>")));
                                component.m_millDataInd = 1;
                            }
                        } // End if(status==="S")
                        else {
                            errMsg = [];
                            errMsg.push("Error in retriving external data");
                            $("#hml2" + compId + "externaldata").html(MP_Util.HandleErrorResponse("", errMsg.join("<br/>")));
                            component.m_millDataInd = 1;
                        }
                    } catch (err) {
                        MP_Util.LogJSError(err, null, "homemedications.js", "HealtheIntent data pagination");
                        errMsg = [];
                        errMsg.push("Error in retriving external data");
                        $("#hml2" + compId + "externaldata").html(MP_Util.HandleErrorResponse("", errMsg.join("<br/>")));
                        component.m_millDataInd = 1;
                    } finally {
                        $("#hiDataHomeMedication" + compId + "table").find('.loading-screen').remove();
                    }

                });
            }
        },
        RenderComponent: function(component, recordData) {
            var criterion = component.getCriterion();
            var ipath = criterion.static_content;
            var medCompId = component.getComponentId();
            component.m_sidePanelShowing = false;

            try {
                var sHTML = "";
                var countText = "";
                var jsHTML = [];
                var currentDate = new Date();
                var meds = [];
                var medCnt = 0;
                var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
                var df = CERN_HOME_MEDS_O2.getDateFormatter();
                var hmI18n = i18n.discernabu.homemeds_o2;
                component.m_medModObj.jsonRoutes = null;
                component.setCompliance(false);
                var imgType = "";
                var imgClass = "";
                var edtCls = "";
                var catCodeList = "";
                var modHTML = "";
                var displayMedsRec = component.getMedRec();
                var componentId = component.getComponentId();

                //To save time from consistently calling the MP_GET_ORDERS script, the drugs that are retrieved from the beginning of the session will be saved and then retrieved locally for each refresh.
                component.setAllData(recordData);
                CERN_HOME_MEDS_O2.DisplayAllData(componentId);
                var rootNode = component.getRootComponentNode();
                var lookBackContainer = $(rootNode).find('.sec-hd');
                var healthPlanSelectorEle = lookBackContainer.find('.hm-healthplan-selector');
                if (healthPlanSelectorEle.length) {
                    healthPlanSelectorEle.remove();
                }

                //Add Info Button click events
                if (component.hasInfoButton() && component.isInfoButtonEnabled()) {
                    CERN_HOME_MEDS_O2.enableInfoButtonClick(component);
                }
                if (recordData.ORDERS.length > 0) {
                    //create  the menu and add event handlers to the action buttons only when
                    //the medication indicator is set to true
                    if (component.isMedModInd()) {
                        //add button click events
                        Util.addEvent(_g("medRnwBtn" + medCompId), "click", CERN_HOME_MEDS_O2.queueOrder);
                        Util.addEvent(_g("medCnclBtn" + medCompId), "click", CERN_HOME_MEDS_O2.queueOrder);
                        Util.addEvent(_g("medCmpltBtn" + medCompId), "click", CERN_HOME_MEDS_O2.queueOrder);

                        var medModRootId = 'hml2' + medCompId;
                        var medCompSec = _g(medModRootId);
                        //disable native selection to use custom select
                        medCompSec.onselectstart = function() {
                            return false;
                        };
                        //build component actions menu
                        component.addMenuOption("mnuRenew", "mnuRenew" + medCompId, hmI18n.MED_RENEW_RX, true, "click", CERN_HOME_MEDS_O2.queueOrder);
                        component.addMenuOption("mnuCancel", "mnuCancel" + medCompId, hmI18n.MED_CANCEL, true, "click", CERN_HOME_MEDS_O2.queueOrder);
                        component.addMenuOption("mnuComplete", "mnuComplete" + medCompId, hmI18n.MED_COMPLETE, true, "click", CERN_HOME_MEDS_O2.queueOrder);
                        component.addMenuOption("mnuRnwReset", "mnuRnwReset" + medCompId, hmI18n.MED_RESET, true, "click", CERN_HOME_MEDS_O2.resetRows);
                        component.addMenuOption("mnuGtOrders", "mnuGtOrders" + medCompId, hmI18n.MED_GTO, true, "click", CERN_HOME_MEDS_O2.signMedMods);
                        component.addMenuOption("mnuSign", "mnuSign" + medCompId, hmI18n.MED_SIGN, true, "click", CERN_HOME_MEDS_O2.signMedMods);

                        component.createMenu();
                        //add click events
                        Util.addEvent(_g("medSgnBtn" + medCompId), "click", CERN_HOME_MEDS_O2.signMedMods);
                    }

                    //bind click events on the rows
                    CERN_HOME_MEDS_O2.bindMedRowSelection(component);

                    //reset after component refresh
                    component.setEditMode(false);
                }
                if (component.getDisplayHiDataInd() && !component.getPatientEnteredDataInd()) {
                var hiDataControlBtn = document.getElementById("hiDataControlBtn" + component.getComponentId());
                $(hiDataControlBtn).click(function() {
                        // CAP timer used to track usage of HealtheIntent
                    var timer = new CapabilityTimer("CAP:MPG Display HealtheIntent Data");
                    timer.capture();
                    CERN_HOME_MEDS_O2.showHIData(component);
                });
                } else if (component.getExternalDataInd() && component.getDisplayHiDataInd()) {
                    // CAP timer used to track usage of HealtheIntent
                    var timer = new CapabilityTimer("CAP:MPG Display HealtheIntent Data");
                    timer.capture();
                    CERN_HOME_MEDS_O2.showHIData(component);
                }
            } catch (err) {
                throw (err);
            }

            // If the Checkbox is not showing, remove the css that positions the med status line and checkbox
            if (!component.getOutsideRecordsInd()) {
                $("#medStatusContainer" + medCompId).css("margin-top", "0");
            }
        },
        /**
         * The following functions will read the event from the component menu and call the queueOrder function
         * to acheive a sepecific functionality on clicking the component menu items.
         *
         * @param {obj} event - The event object clickEvent.
         * @returns {undefined} undefined
         */
        callQueueOrder: function(event) {

            CERN_HOME_MEDS_O2.queueOrder.call(event, event);
        },

        callResetRows: function(event) {
            CERN_HOME_MEDS_O2.resetRows.call(event, event);
        },
        callSignMedMods: function(event) {
            CERN_HOME_MEDS_O2.signMedMods.call(event, event);
        },
        //Click Event for InfoButton
        callInfoButtonClick: function(event) {
            CERN_HOME_MEDS_O2.infoButtonClick.call(event, event);
        },

        /**
         * The following function will return the object having css class,Status for Med rec status in the home medication's component. 
         * This function handles data to assign to the Status object for different status flags returned from MP_GET_MED_STATUS reply
         *
         * @param sCode  - Status flag to return the respective icons and css class.
         * @param performedBy  - Label that returns the personnel as last performed By for hover detail.
         * @param performedDate  - Performed date of the respective Med rec status for hover detail.
         * @param isMedsHistoryStatus  - Flag to validate Meds History status.
         * @return {object} statusObj - Status object
         */
        getStatusObject: function(sCode, performedBy, performedDate, isMedsHistoryStatus) {
            var dateFormatObj = MP_Util.GetDateFormatter();
            var statusObj = {};
            statusObj.clsName = "";
            statusObj.status = "";
            statusObj.performedBy = performedBy ? performedBy : "";
            statusObj.performedDate = "";

            if (performedDate) {
                var dateTime = new Date();
                dateTime.setISO8601(performedDate);
                statusObj.performedDate = dateFormatObj.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
            }

            var hmI18n = i18n.discernabu.homemeds_o2;
            switch (sCode) {
                case 0:
                    //complete
                    statusObj.clsName = "complete";
                    statusObj.status = hmI18n.COMPLETE;
                    break;
                case 1:
                    //incomplete
                    if (isMedsHistoryStatus) {
                        statusObj.clsName = "not-started";
                        statusObj.status = hmI18n.INCOMPLETE;
                    } else {
                        statusObj.clsName = "partial";
                        statusObj.status = hmI18n.PARTIAL;
                    }
                    break;
                case 2:
                    //In error
                    statusObj.clsName = "inerror";
                    statusObj.status = hmI18n.INERROR;
                    break;
                case 3:
                    //Pending Partial
                    statusObj.clsName = "partial-inprocess";
                    statusObj.status = hmI18n.PENDING_PARTIAL;
                    break;
                case 4:
                    //Pending Complete
                    statusObj.clsName = "partial-complete";
                    statusObj.status = hmI18n.PENDING_COMPLETE;
                    break;
                case 5:
                    //Not Started
                    statusObj.clsName = "not-started";
                    statusObj.status = hmI18n.NOT_STARTED;
                    break;
                default:
                    statusObj.clsName = "unknown";
                    statusObj.status = hmI18n.UNKNOWN;
            }
            return statusObj;
        },

        /**
         * Get the CSS class for the info button column
         * @param {Object} component the home meds component object
         * @return {String} the CSS class for the info button column
         */
        getInfoButtonClass: function(component) {
            var infoIconsClass = "";
            var componentId = component.getComponentId();
            //Determine state of Info Buttons
            if (component.hasInfoButton() && component.isInfoButtonEnabled()) {
                if (!component.compMenuReference["compMenuInfoButton" + componentId].isSelected()) {
                    component.compMenuReference["compMenuInfoButton" + componentId].setIsSelected(true);
                }
                infoIconsClass = "hml2-info-icon-col";
            }
            else {
                infoIconsClass = "hml2-info-icon-col hidden";
            }
            return infoIconsClass;
        },

        /**
         * Creates a list containing all of the modified fields for a single patient requested medication
         * Used to display the patient suggested med modifications within the side panel
         * @param {Object} order single patient requested medication order.
         * @param {String} component the home meds component object
         * @return {Array} List containing the names of all of the modified fields for the given order.
         */
        getFieldsSuggestedForChange: function(order) {
            var modList = [];
            if (order.INTEROP && order.INTEROP.length) {
                var interop = order.INTEROP[0];
                // Check the statuses to determine which fields have been modified
                if (interop.DOSE.STATUS) {
                    modList.push("DOSE");
                }
                if (interop.PHYSICIAN.STATUS) {
                    modList.push("PHYSICIAN");
                }
                if (interop.FREQUENCY.STATUS) {
                    modList.push("FREQUENCY");
                }
                if (interop.STATUS.STATUS) {
                    modList.push("COMPLIANCE");
                }
            }
            // Return the List containing all modified fields
            return modList;
        },
        /**
         * Create table column templates for the home meds component table
         * @param {Object} medications the JSON object containing the medications data
         * @param {Object} component the home meds component object
         */
        processHomeMedsData: function(medications, component) {
            var hmI18n = i18n.discernabu.homemeds_o2;
            var recordData = component.getAllData();
            var criterion = component.getCriterion();
            var ipath = criterion.static_content || "";
            var infoClass = "";
            var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
            var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
            var df = CERN_HOME_MEDS_O2.getDateFormatter();

            var imgType = "";
            var imgClass = "";
            var edtCls = "";
            var catCodeList = "";
            var modHTML = "";
            var bMedMod = component.isMedModInd();

            var orders = [];
            var interopData = null;
            var orderStatus = null;
            var medOrigDate = null;
            var lastDoseDate = null;
            var respProv = null;
            var compliance = null;
            var medName = null;
            var medNameHover = null;
            var dateTime = null;
            var compComment = null;
            var ordComment = null;
            var provider = null;
            var code = null;

            var ordersMedInfo = null;
            var hxInd = null;
            var ordId = null;
            var extId = 0;
            var priCriteriaCd = null;
            var synonymId = null;

            var catCode = null;
            var sigLine = null;
            var medsLength = medications.length;
            var medCompId = component.getComponentId();
            var medIdFrag = medCompId + "_";

            var request = null;
            var patRequestInd = null;
            for (var x = 0; x < medsLength; x++) {
                orders = medications[x];
                orderStatus = MP_Util.GetValueFromArray(orders.CORE.STATUS_CD, codeArray);
                if (orderStatus && orderStatus.meaning !== "MEDSTUDENT") {
                    medOrigDate = "--";
                    lastDoseDate = "--";
                    respProv = "&nbsp;";
                    compliance = "--";
                    compComment = "--";
                    medName = CERN_HOME_MEDS_O2.getMedicationDisplayName(orders);
                    medNameHover = CERN_HOME_MEDS_O2.getMedicationDisplayNameForHover(orders);
                    dateTime = new Date();
                    //check whether a  medication is a patient request
                    if (orders.INTEROP && orders.INTEROP.length) {
                        interopData = orders.INTEROP[0];
                        request = MP_Util.GetValueFromArray(interopData.REQUEST_TYPE, codeArray).meaning;
                        patRequestInd = 1;
                    } else {
                        patRequestInd = 0;
                    }
                    //compliance comment is not displayed for patient request
                    if (!patRequestInd) {
                        compComment = (orders.DETAILS.COMPLIANCE_COMMENT) ? orders.DETAILS.COMPLIANCE_COMMENT : "--";
                        ordComment = (orders.COMMENTS.ORDER_COMMENT) ? orders.COMMENTS.ORDER_COMMENT.replace(/\n/g, "<br />") : "--";
                    }

                    if (orders.SCHEDULE.ORIG_ORDER_DT_TM !== "") {
                        dateTime.setISO8601(orders.SCHEDULE.ORIG_ORDER_DT_TM);
                        medOrigDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
                    }

                    // If the medication is not a patient request, display the last dose date
                    if (!patRequestInd && orders.DETAILS.LAST_DOSE_DT_TM !== "") {
                        dateTime.setISO8601(orders.DETAILS.LAST_DOSE_DT_TM);
                        lastDoseDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
                    }

                    if (orders.CORE.RESPONSIBLE_PROVIDER_ID > 0) {
                        provider = MP_Util.GetValueFromArray(orders.CORE.RESPONSIBLE_PROVIDER_ID, personnelArray);
                        respProv = provider.fullName;
                    }
                    // Check if the medication has a modified compliance, if not display the existing compliance 
                    if (orders.INTEROP.length && interopData.STATUS.MODIFIED_STATUS_CODE.LABEL) {
                        compliance = interopData.STATUS.MODIFIED_STATUS_CODE.LABEL;
                    } else if (orders.INTEROP.length && interopData.STATUS.STATUS_CODE.LABEL) {
                        compliance = interopData.STATUS.STATUS_CODE.LABEL;
                    } else {
                        var complianceCode = MP_Util.GetValueFromArray(orders.DETAILS.COMPLIANCE_STATUS_CD, codeArray);
                        compliance = (complianceCode) ? complianceCode.display : "--";
                    }
                    ordersMedInfo = orders.MEDICATION_INFORMATION;
                    hxInd = ordersMedInfo.ORIGINALLY_ORDERED_AS_TYPE.DOCUMENTED_IND;
                    rxInd = ordersMedInfo.ORIGINALLY_ORDERED_AS_TYPE.PRESCRIPTION_IND;
                    ordId = ordersMedInfo.ORDER_ID;
                    if (orders.INTEROP.length >= 1) {
                        extId = interopData.EXT_DATA_INFO_ID;
                    }
                    priCriteriaCd = ordersMedInfo.PRIMARY_CRITERIA_CD;
                    synonymId = ordersMedInfo.SYNONYM_ID;

                    //check whether it is a prescribed medication or documented medication
                        imgType = '3796_16.png';
                        imgClass = 'hml2-hx';
                    edtCls = '-hx';
                    if (rxInd === 1) { //Prescribed
                        imgType = '4969_16.png';
                        imgClass = 'hml2-rx';
                        edtCls = '';
                    }
                    // if medication modification is enabled in bedrock, concatenate med code to meds catalog list
                    if (bMedMod) {
                        component.m_medModObj.medModCompId = medCompId;
                        component.m_medModObj.medModIdFrag = medIdFrag;
                        catCode = ordersMedInfo.CATALOG_CD;

                        sigLine = '';
                        // if med is not patient request, concantenate med code to the catalog list
                        if (!patRequestInd && catCode) {
                            catCodeList += catCode + ':';
                        }
                        //Placeholders for number of refills and Dispense quantity
                        modHTML =
                            '<span class="hml2-sig detail-line disp-rfl-cnt">' +
                            '</span>' +
                            '<span class="hml2-dur">' +
                            '</span>' +
                            '<span class="hml2-disp-qty-cd">' +
                            '</span>' +
                            '<span class="hml2-cat-cd">' +
                            catCode +
                            '</span>';
                    } //end bmedmod

                    switch (request) {
                        case "ADD":
                            orders.PAT_REQUEST_DISPLAY = "<span>" + hmI18n.ADD + "</span>";
                            break;
                        case "UPDATE":
                            orders.PAT_REQUEST_DISPLAY = "<span>" + hmI18n.MODIFY + "</span>";
                            break;
                        default:
                            orders.PAT_REQUEST_DISPLAY = "<span>--</span>";
                    }

                    if (!request) {
                        orders.INFO_ICON_DISPLAY =
                            '<div class ="hml2-info-icon-div">' +
                            '<span data-patId="' + criterion.person_id + '" data-encId="' + criterion.encntr_id + '" data-synonymId="' + synonymId + '" data-priCriteriaCd="' + priCriteriaCd + '" class="hml2-info-icon">' +
                            '&nbsp;' +
                            '</span>' +
                            '</div>';
                    } else {
                        orders.INFO_ICON_DISPLAY = '<div class ="hml2-info-icon-div"></div>';
                    }


                    //create the template for the medication column
                    var orderInfoId = "hml2Info" + medIdFrag + ordId;
                    var rxIconHtml =
                        '<span class="hml2-rx-hx">' +
                        '<img src="' + ipath + '/images/' + imgType + '" alt="" class="' + imgClass + '"/>' +
                        '</span>';
                    orders.MEDICATION_DISPLAY =
                        rxIconHtml +
                        '<span class="hml2-info" data-synonymId = "' + synonymId + '" data-order-id = "' + ordId + '"ext-data-info-id="' + extId + '" data-pat-request-ind="' + patRequestInd + '" id = "' + orderInfoId + '">' +
                        '<span class="hml2-name">' +
                        medName +
                        '</span>' +
                        '<span class="hml2-sig detail-line">' +
                        orders.DISPLAYS.SIMPLIFIED_DISPLAY_LINE +
                        modHTML +
                        '</span>' +
                        '</span>';

                    //The MEDICATION_TEXT attribute is used when sorting meds by name
                    orders.MEDICATION_TEXT = orders.DISPLAYS.DISPLAY_NAME;
                    orders.MED_ORDER_HOVER = [
                        '<h4 class="det-hd"><span>' + hmI18n.MED_DETAIL + '</span></h4>',
                        '<dl class="hml2-hover">',
                        '<dt><span>' + hmI18n.HOME_MEDICATION + '</span></dt>',
                        '<dd><span>' + medNameHover + '</span></dd>',
                        '<dt><span>' + hmI18n.ORDER_DETAILS + '</span></dt>',
                        '<dd><span>' + orders.DISPLAYS.CLINICAL_DISPLAY_LINE + '</span></dd>',
                        '<dt><span>' + hmI18n.ORDER_COMMENT + '</span></dt>',
                        '<dd><span>' + ordComment + '</span></dd>',
                        '<dt><span>' + hmI18n.ORDER_DATE + '</span></dt>',
                        '<dd><span>' + medOrigDate + '</span></dd>',
                        '<dt><span>' + hmI18n.RESPONSIBLE_PROVIDER + '</span></dt>',
                        '<dd><span>' + respProv + '</span></dd>',
                        '<dt><span>' + hmI18n.TYPE + '</span></dt>',
                        '<dd><span>' + CERN_HOME_MEDS_O2.getHomeMedicationType(orders) + '</span></dd>',
                        '</dl>'
                    ].join("");

                    //Create the template for the last dose date column
                    if (lastDoseDate) {
                        orders.LAST_DOSE_DATE_DISPLAY = "<span>" + lastDoseDate + "</span>";
                    } else {
                        orders.LAST_DOSE_DATE_DISPLAY = "<span>--</span>";
                    }
                    //Create the template for the compliance column
                    orders.COMPLIANCE_DISPLAY = "<span>" + compliance + "</span>";

                    //Create the template for the compliance comments column
                    orders.COMP_COMMENT_DISPLAY = "<span>" + compComment + "</span>";

                    //Create the template for the formulary column
                    orders.FORMULARY_DISPLAY = "";
                }
            }
            component.m_medModObj.catCodeList += catCodeList;
        },

        /**
         * Creates the HTML used to display the Meds History link.
         * If the 'Add Meds By Hx' Privilege is set to 'No' then the HTML returned will not contain a link to Meds History
         * @param {Object} component the home meds component object
         * @return {String} HTML markup used to display the medication request and Meds History Link (if privs allow)
         */
        createMedsHistoryHTML: function(component, requestType, order) {
            var displayHTML = "";
            var hmI18n = component.m_home_meds_i18n;
            var componentId = component.getComponentId();
            if (requestType === "ADD") {
                displayHTML =
                    '<dd>' +
                    hmI18n.ADD_THIS_MEDICATION_WITHIN + ' ' +
                    '<a class="pat-req-meds-hx-link" id="addPatRequest' + componentId + '">' +
                    hmI18n.MEDS_HISTORY + '.' + //Anchor tag responsible for Meds History Link
                    '</a>' +
                    '</dd>';
            }
            else if (requestType === "UPDATE") {
                // Get a list of the requested medication modifications to display in the side panel. This list will
                // contain all the fields that the patient has requested to modify (ie. Dose, Physician, Frequency, Compliance)
                var originalComplianceDisplay = "--";
                if (order.DETAILS.COMPLIANCE_STATUS_CD) {
                    var codeArray = MP_Util.LoadCodeListJSON(component.getAllData().CODES);
                    var originalCompliance = MP_Util.GetValueFromArray(order.DETAILS.COMPLIANCE_STATUS_CD, codeArray);
                    originalComplianceDisplay = (originalCompliance) ? originalCompliance.display : "--";
                }
                var modifiedMeds = CERN_HOME_MEDS_O2.getFieldsSuggestedForChange(order);
                var modifiedMedsCount = modifiedMeds.length;
                displayHTML += '<dd>' +
                    hmI18n.UPDATE_THIS_MEDICATION_WITHIN + " " +
                    '<a class="pat-req-meds-hx-link" id="addPatRequest' + componentId + '">' +
                    hmI18n.MEDS_HISTORY + '.' + // Anchor tag responsible for Meds History Link
                    '</a>' +
                    '</dd>';
                // For each medication, create the appropriate display HTML
                for (var i = 0; i < modifiedMedsCount; i++) {
                    switch (modifiedMeds[i]) {
                        case "DOSE":
                            // Modified Dose
                            displayHTML += '<dd class="hml2-bullet-listed hml2-pat-req-indent">' +
                                hmI18n.CHANGE_DOSE_FROM +
                                ' "' + (order.INTEROP[0].DOSE.DOSE || "--") + '" ' +
                                hmI18n.TO +
                                ' "' + (order.INTEROP[0].DOSE.MODIFIED_DOSE || "--") + '" ';
                            break;
                        case "PHYSICIAN":
                            // Modified Physican
                            displayHTML += '<dd class="hml2-bullet-listed hml2-pat-req-indent">' +
                                hmI18n.CHANGE_PHYSICIAN_FROM +
                                ' "' + (order.INTEROP[0].PHYSICIAN.PHYSICIAN || "--") + '" ' +
                                hmI18n.TO +
                                ' "' + (order.INTEROP[0].PHYSICIAN.MODIFIED_PHYSICIAN || "--") + '" ';
                            break;
                        case "FREQUENCY":
                            // Modified Frequency
                            displayHTML += '<dd class="hml2-bullet-listed hml2-pat-req-indent">' +
                                hmI18n.CHANGE_FREQUENCY_FROM +
                                ' "' + (order.INTEROP[0].FREQUENCY.FREQUENCY || "--") + '" ' +
                                hmI18n.TO +
                                ' "' + (order.INTEROP[0].FREQUENCY.MODIFIED_FREQUENCY || "--") + '" ';
                            break;
                        case "COMPLIANCE":
                            // Modified Compliance
                            displayHTML += '<dd class="hml2-bullet-listed hml2-pat-req-indent">' +
                                hmI18n.CHANGE_COMPLIANCE_FROM +
                                ' "' + originalComplianceDisplay + '" ' +
                                hmI18n.TO +
                                ' "' + (order.INTEROP[0].STATUS.MODIFIED_STATUS_CODE.LABEL || "--") + '" ';
                            break;
                    }
                    displayHTML += '</dd>';
                } // end for
            } // end else if
            return displayHTML;
        },
        /**
         * launch the medications history view
         * @param {Object} component  the home meds component object
         * @return undefined
         */
        launchMedsHistory: function(component) {
            var criterion = component.getCriterion();
            try {
                MP_Util.LogDiscernInfo(component, "POWERORDERS", "homemedications-o2.js", "medsHistory");
                var PowerOrdersMPageUtils = window.external.DiscernObjectFactory("POWERORDERS");
                var m_dPersonId = criterion.person_id;
                var m_dEncounterId = criterion.encntr_id;
                var m_hMOEW = PowerOrdersMPageUtils.CreateMOEW(m_dPersonId, m_dEncounterId, 0, 4, 121);
                PowerOrdersMPageUtils.DisplayMOEW(m_hMOEW);
                PowerOrdersMPageUtils.DestroyMOEW(m_hMOEW);
                component.InsertData();
            } catch (err) {
                logger.logJSError(err, this, "homemedications-o2.js", "launchMedsHistory");
            }
        },
        /**
         * bind click events to the component table rows
         * @param {Object} component the home meds component object
         * @return {undefined} undefined
         */
        bindMedRowSelection: function(component) {
            var rootMedSecCont = component.getSectionContentNode();
            var componentTableElt = Util.Style.g("component-table", rootMedSecCont, "div")[0];

            var medRows = Util.Style.g("result-info", componentTableElt, "dl");
            var mrLen = medRows.length;
            //attach the click event to each medication row
            for (var i = 0; i < mrLen; i++) {
                Util.addEvent(medRows[i], "click", CERN_HOME_MEDS_O2.medRowSel);
            }
        },
        /**
         * Rebind table events on the component table refreshing caused by sorting
         * @param  {Object} component the home meds component object
         * @return {undefined} undefined
         */
        bindColumnHeaderClick: function(component) {
            var componentTable = component.getComponentTable();
            var componentId = component.getComponentId();

            $("#" + componentTable.getNamespace() + "header").on("click", ".sort-option", function() {
                var sidePanel = component.m_sidePanel;
                if (sidePanel && component.m_sidePanelShowing) {
                    //close panel
                    sidePanel.m_cornerCloseButton.click();
                }

                if (component.inMillennium && component.isMedModInd()) {
                    CERN_HOME_MEDS_O2.resetActiveActions(component);
                    CERN_HOME_MEDS_O2.disableActions(component);
                }
                //re-bind click events on the table rows
                CERN_HOME_MEDS_O2.bindMedRowSelection(component);

                //enable click event for info buttons if they are turned on
                if (component.hasInfoButton() && component.isInfoButtonEnabled()) {
                    //show info buttons on the table rows
                    $("#hml2Content" + componentId)
                        .find(".hml2-info-icon-col")
                        .removeClass("hidden");

                    CERN_HOME_MEDS_O2.enableInfoButtonClick(component);
                }
                // Prevents the binding of the header click collapse, when the table columns are sorted
                CERN_HOME_MEDS_O2.disableHeaderClick();
            });
        },
        /**
         * resetActiveActions reset any active actions on the component table
         * @param  {Object} component the home meds component object
         * @return {undefined} undefined
         */
        resetActiveActions: function(component) {
            var componentId = component.getComponentId();
            var rootNode = component.getRootComponentNode();
            component.setInitialRenew(true);

            //Dither sign action
            $("medSgnBtn" + componentId).prop("disabled", true);
            component.compMenuReference["compMenuSign" + componentId].setIsDisabled(true);
            // hide the formulary column
            $(rootNode).find('.hml2-formulary').addClass('hml2-hidden');
        },

        /**
         * Create columns for the component table
         * @param {string} columnId - Column header id to be shown in each column
         * @param {string} columnDisplay - Column header value to be shown in each column
         * @param {boolean} sortable - TRUE if Sortable, FALSE otherwise
         * @param {string} primarySortField - primary sort field
         * @param {string} renderTemplate - template to render
         * @param {string} customClass - custom css class id to be loaded
         * @return {TableColumn} returns a TableColumn object that specifies column properties
         */
        createTableColumn: function(columnId, columnDisplay, sortable, primarySortField, renderTemplate, customClass) {
            var tableColumn = new TableColumn();
            tableColumn.setColumnId(columnId)
                .setColumnDisplay(columnDisplay)
                .setIsSortable(sortable)
                .setPrimarySortField(primarySortField)
                .setRenderTemplate(renderTemplate)
                .setCustomClass(customClass);
            return tableColumn;
        },
        /**
         * show or hide hover on the component table
         * @param  {object} component       the home medications component object
         * @param  {boolean} enableHoverFlag the indicator whether the hover should  be displayed or hidden
         * @param  {object} target          the  jquery object for the  hovered over element
         * @return {undefined} undefined
         */
        toggleTableCellHover: function(component, enableHoverFlag, target) {
            var componentId = component.getComponentId();
            var hoverExtension = component.getTableHoverExtension();
            var hoverTemplate = null;
            var tableColumns = component.getComponentTable().getColumns();
            var tableColumnsCnt = tableColumns.length;
            var tableColumn = null;
            var infoIconId = "infoICon" + componentId;
            var requestId = "request" + componentId;
            var formularyId = "formulary" + componentId;
            var i = 0;

            var tableRow = target.parent();
            var rowId = tableRow.attr("id");

            // retrieve the cells that should not be highlighted
            var selectors = "#" + rowId + ":" + infoIconId + "," +
                "#" + rowId + ":" + requestId + "," +
                "#" + rowId + ":" + formularyId;
            var allCells = target.siblings().add(target);
            var noHoverCells = allCells.filter(selectors.replace(/:/g, "\\:"));


            //show the hover if the indicator is set to true, otherwise remove it.
            if (enableHoverFlag) {
                hoverTemplate = function(data) {
                    return "<span>" + data.RESULT_DATA.MED_ORDER_HOVER + "</span>";
                };

                var marginHeight = null;
                // place the hover on the target and paint over the noHoverCells
                noHoverCells.each(function() {
                    marginHeight = parseInt($(this).css("margin-top")) + parseInt($(this).css("margin-bottom"));
                    // subtract marginHeight of cell so as to not cause an accidental resize
                    $(this).css({
                        "height": (tableRow.height() - marginHeight) + "px",
                        "background-color": tableRow.css("background-color")
                    });
                });
                tableRow.addClass("mpage-tooltip-hover");
            }
            else {
                hoverTemplate = "";

                // remove the background from the tablerow and restore the blank columns
                tableRow.removeClass("mpage-tooltip-hover");
                target.removeClass("mpage-tooltip-hover");
                noHoverCells.each(function() {
                    $(this).css({
                        "height" : $(this).children().css("height"),
                        "background-color" : "transparent"
                    });
                });
            }

            // set the hover template over all columns excluding the info icon column
            for (i = 0; i < tableColumnsCnt; i++) {
                tableColumn = tableColumns[i];
                if (tableColumn.getColumnId() !== infoIconId) {
                    hoverExtension.addHoverForColumn(tableColumn, hoverTemplate);
                }
            }
        },
        /**
         * create hover extension on specific columns of the component table
         * @param  {object} component         the home medications component object
         * @param  {object} medicationColumn  the medication  column object
         * @param  {object} lastDoseColumn    the last dose  date column object
         * @param  {object} complianceColumn  the compliance column object
         * @param  {object} compCommentColumn the compliance comment column object
         * @param  {object} formularyColumn   the formulary column  object
         * @return {object}                   the table hover extension object
         */
        createTableCellHover: function(component, medicationColumn, lastDoseColumn, complianceColumn, compCommentColumn, formularyColumn) {
            var componentId = component.getComponentId();
            var medsComponentTable = component.getComponentTable();

            //specific the template for the hover extension.
            var hoverTemplateFn = function(data) {
                return "<span>" + data.RESULT_DATA.MED_ORDER_HOVER + "</span>";
            };
            var hoverExtension = new TableCellHoverExtension();
            //specify the columns for the hover extension
            hoverExtension.addHoverForColumn(medicationColumn, hoverTemplateFn);
            hoverExtension.addHoverForColumn(lastDoseColumn, hoverTemplateFn);
            hoverExtension.addHoverForColumn(complianceColumn, hoverTemplateFn);
            hoverExtension.addHoverForColumn(compCommentColumn, hoverTemplateFn);
            hoverExtension.addHoverForColumn(formularyColumn, hoverTemplateFn);

            hoverExtension.setOnHoverCallback(function(event) {
                var $target = $("#" + event.currentTarget.id.replace(/:/g, "\\:"));
                var enableHoverFlag;

                var $componentTable = $("#hml2" + componentId + "tableBody");
                var selectedTableRows = $componentTable.find(".hml2-med-selected").length;
                var renewTableRows = $componentTable.find(".hml2-rnwd").length;
                var cancelTableRows = $componentTable.find(".hml2-cncld").length;
                var completeTableRows = $componentTable.find(".hml2-cmplt").length;
                //Get the attribute of the row being hovered over to see if it is a patient request
                var patRequestInd = $target.parent().find(".hml2-info").attr("data-pat-request-ind");

                //if renew, cancel, complete actions are  being processed on any row, or if the row is a pat request, remove the hover
                if (selectedTableRows || renewTableRows || cancelTableRows || completeTableRows || parseInt(patRequestInd, 10)) {
                    enableHoverFlag = false;
                    CERN_HOME_MEDS_O2.toggleTableCellHover(component, enableHoverFlag, $target);
                } else {
                    enableHoverFlag = true;
                    CERN_HOME_MEDS_O2.toggleTableCellHover(component, enableHoverFlag, $target);
                }
            });

            hoverExtension.setOnLeaveCallback(function(event) {
                var $target = $("#" + event.currentTarget.id.replace(/:/g, "\\:"));
                CERN_HOME_MEDS_O2.toggleTableCellHover(component, false, $target);
            });
            return hoverExtension;
        },
        /**
         * Creates banner to display Healthe Intent Data
         *
         * @param {object} component  - home med component object on which we want to display healthe intent banner
         * @param {boolean} displayError  - true if you display error message
         * @return {String} html string of created banner div
         */
        createExternalDataControl: function(component, displayError) {
            var externalDataImgUrl = null;
            var externalDataImgSpan = null;
            var externalDataTitleSpan = null;
            var externalDataBtnSpan = null;

            if (displayError) {
                externalDataImgUrl = component.getCriterion().static_content + "/images/6965.png";
                externalDataImgSpan = "<span><img height='22' width='22' style='float:left' id='externalData' src= '" + externalDataImgUrl + "'></span>";
                externalDataTitleSpan = "<span style='margin-left:5px; padding-top:5px; font-weight: bold;'>" + i18n.discernabu.homemeds_o2.EXTERNAL_DATA_LABEL_ERR + "</span>";
                externalDataBtnSpan = "<span style='float:right'><button class='hml2-hi-ext-btn' id='hiDataControlBtn" + component.getComponentId() + "' style='display: none'>" + i18n.discernabu.homemeds_o2.VIEW_OUTSIDE_RECORDS + "</button></span>";
            } else {
                externalDataImgUrl = component.getCriterion().static_content + "/images/6965.png";
                externalDataImgSpan = "<span><img height='22' width='22' style='float:left' id='externalData' src= '" + externalDataImgUrl + "'></span>";
                externalDataTitleSpan = "<span style='margin-left:5px; padding-top:5px;font-weight: bold;'>" + i18n.discernabu.homemeds_o2.EXTERNAL_DATA_LABEL + "</span>";
                externalDataBtnSpan = "<span style='float:right'><button class='hml2-hi-ext-btn' id='hiDataControlBtn" + component.getComponentId() + "'>" + i18n.discernabu.homemeds_o2.VIEW_OUTSIDE_RECORDS + "</button></span>";
            }

            var showExternalDataContainer = "<div id=hiAddDataContainer" + component.getComponentId() + " class='hml2-hi-ext-label'>" + externalDataImgSpan + externalDataTitleSpan + externalDataBtnSpan + "</div>";

            return showExternalDataContainer;
        },
        /**
         * The following function will display the drugs in the home medication's component. The function determines how the drugs will be sorted and will then display
         * the drugs in the order that has been determined.
         *
         * @param {number} componentId  - The id of the instantiated Home Medication's component.
         * @param {number} groupNum  - The grouping number of the selected drug class grouping.
         * @param {string} sortName  - The label of the drug class grouping that is currently selected.
         * @return {undefined} undefined
         */
        DisplayAllData: function(componentId, groupNum, sortName) {
            try {
                var parentDiv = _g("grouperSelect" + componentId) || {};
                //Is the component first loading (without a grouping selected) or has an option other than the previously selected option been selected?
                if (!groupNum || groupNum == -1 || parentDiv.selectedVal != groupNum) {
                    var component = MP_Util.GetCompObjById(componentId);
                    component.setInitialRenew(true);
                    var criterion = component.getCriterion();
                    var recordData = component.getAllData();
                    var medCompId = componentId;
                    var hmI18n = i18n.discernabu.homemeds_o2;
                    var medsContainer = [];
                    var compNS = component.getStyles().getNameSpace();
                    var displayMedsRec = component.getMedRec();
                    var medStatusReply = component.getMedStatusData();
                    if (isFinite(groupNum)) {
                        if (groupNum == -1) {
                            MP_Core.AppUserPreferenceManager.ClearCompPreferences(componentId);
                            component.setGrouperFilterLabel("");
                        }
                    }
                    var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
                    var venueAdm = 0;
                    var venueDisch = 0;
                    var medRecHtml = "";
                    var medRecHtmlStatus = "";
                    var medHxStatusHtml = "";
                    var mrAdmnStatusHtml = "";
                    var mrTransferStatusHtml = "";
                    var mrCrxEncntrTxStatusHtml = "";
                    var mrDischargeStatusHtml = "";
                    var medRecFiltersFlag = false;
                    var outsideRecsChkbox = "";
                    var segmentedControl = null;
                    var segmentedControlDisplay = "";
                    var medrecLinkSeperatorFlag = "";
                    // If patient entered data is set in bedrock
                    if (component.getPatientEnteredDataInd()) {
                        // Create the HTML for the view outside records checkbox.
                        // If the Patient Entered Data Bedrock Filter is set to no, we will not display the checkbox
                        var patRequestCheckedAttr = (component.getOutsideRecordsInd()) ? 'checked' : '';
                        outsideRecsChkbox =
                            '<div class ="hml2-pull-right"><dl class="hml2-outside-recs-action">' +
                            '<dd>' +
                            '<label >' +
                            '<input type="checkbox" ' + patRequestCheckedAttr + ' name="view-outside-rec-chk" id="hml2-outside-recs-checkbox' + componentId + '" />' + hmI18n.VIEW_OUTSIDE_RECORDS +
                            '</label>' +
                            '</dd>' +
                            '</dl></div>';
                    }
                    // If patient enterd data is not set in bedrock, but HI is, set the indicator to display outside records
                    else if (component.getExternalDataInd()) {
                        component.setOutsideRecordsInd(true);
                    }
                    if (medStatusReply && criterion.encntr_id !== 0) {
                        if (component.getMedHistory()) {
                            var medsHistStatusObj = CERN_HOME_MEDS_O2.getStatusObject(-1);
                            if (medStatusReply) {
                                medsHistStatusObj = CERN_HOME_MEDS_O2.getStatusObject(medStatusReply.MEDS_HIST_STATUS.STATUS_FLAG, medStatusReply.MEDS_HIST_STATUS.PERFORMED_PRSNL_NAME, medStatusReply.MEDS_HIST_STATUS.PERFORMED_DATE, true);
                            }
                            if (component.inMillennium) {
                                medHxStatusHtml = "<h3 class='info-hd'>" + hmI18n.STATUS + "</h3><dl class='" + compNS + "-status result-info'><dd class='" + compNS + "-status-img " + medsHistStatusObj.clsName + "'>&nbsp;</dd><dd><a id='medsHistory" + componentId + "'>" + hmI18n.MEDS_HISTORY + "</a></dd></dl><div class='result-details hover'><h4 class='det-hd'><span>" + hmI18n.STATUS + "</span></h4><dl class='" + compNS + "-det'><dt><span>" + hmI18n.STATUS + ":</span></dt><dd><span>" + medsHistStatusObj.status + "</span></dd><dt><span>" + hmI18n.LAST_DOCUMENTED + ":</span></dt><dd><span>" + medsHistStatusObj.performedDate + "</span></dd><dt><span>" + hmI18n.LAST_DOC_BY + ":</span></dt><dd><span>" + medsHistStatusObj.performedBy + "</span></dd></dl></div>";
                            } else {
                                medHxStatusHtml = "<h3 class='info-hd'>" + hmI18n.STATUS + "</h3><dl class='" + compNS + "-status'><dd class='" + compNS + "-status-img meds-hist-status " + medsHistStatusObj.clsName + "'>&nbsp;</dd><dd>" + hmI18n.MEDS_HISTORY + "</dd></dl>";
                            }
                            medRecHtml += medHxStatusHtml;
                            medrecLinkSeperatorFlag = compNS + '-medrec-link-seperator';
                            medRecFiltersFlag = true;
                        }
                        if (component.getMedRecAdmit()) {
                            var mrAdmissionStatusObj = CERN_HOME_MEDS_O2.getStatusObject(-1);
                            var admissionTitle = MP_Util.GetCodeValueByMeaning("ADMISSION", 4003029);
                            var medRecAdmitTitle = "";
                            if (admissionTitle) {
                                medRecAdmitTitle = admissionTitle.display;
                            } else {
                                medRecAdmitTitle = hmI18n.ADMISSION_MEDREC;
                            }
                            if (medStatusReply) {
                                mrAdmissionStatusObj = CERN_HOME_MEDS_O2.getStatusObject(medStatusReply.MEDREC_ADMISSION_STATUS.STATUS_FLAG, medStatusReply.MEDREC_ADMISSION_STATUS.PERFORMED_PRSNL_NAME, medStatusReply.MEDREC_ADMISSION_STATUS.PERFORMED_DATE);
                                venueAdm = medStatusReply.VENUE_CODE.ADMISSION;
                            }
                            if (component.inMillennium) {
                                mrAdmnStatusHtml = "<h3 class='info-hd'>" + hmI18n.STATUS + "</h3><dl class='" + compNS + "-status result-info'><dd class=" + medrecLinkSeperatorFlag + ">&nbsp;</dd><dd class='" + compNS + "-status-img " + mrAdmissionStatusObj.clsName + "'>&nbsp;</dd><dd><a id='medRecAdmission" + componentId + "'>" + medRecAdmitTitle + "</a></dd></dl><div class='result-details hover'><h4 class='det-hd'><span>" + hmI18n.STATUS + "</span></h4><dl class='" + compNS + "-det'><dt><span>" + hmI18n.STATUS + ":</span></dt><dd><span>" + mrAdmissionStatusObj.status + "</span></dd><dt><span>" + hmI18n.LAST_RECONED + ":</span></dt><dd><span>" + mrAdmissionStatusObj.performedDate + "</span></dd><dt><span>" + hmI18n.LAST_RECONED_BY + ":</span></dt><dd><span>" + mrAdmissionStatusObj.performedBy + "</span></dd></dl></div>";
                            } else {
                                mrAdmnStatusHtml = "<h3 class='info-hd'>" + hmI18n.STATUS + "</h3><dl class='" + compNS + "-status'><dd class=" + medrecLinkSeperatorFlag + ">&nbsp;</dd><dd class='" + compNS + "-status-img med-rec-status " + mrAdmissionStatusObj.clsName + "'>&nbsp;</dd><dd>" + medRecAdmitTitle + "</dd></dl>";
                            }
                            medRecFiltersFlag = true;
                            medrecLinkSeperatorFlag = compNS + '-medrec-link-seperator';
                            medRecHtml += mrAdmnStatusHtml;
                        }
                        if (component.getMedRecTransfer()) {
                            var mrTransferStatusObj = CERN_HOME_MEDS_O2.getStatusObject(-1);
                            var medRecTransferName = MP_Util.GetCodeValueByMeaning("TRANSFER", 4003029);
                            var imgClass = "";
                            var transferHoverHtml = "";
                            var medRecTransferTitle = "";
                            if (medRecTransferName) {
                                medRecTransferTitle = medRecTransferName.display;
                            } else {
                                medRecTransferTitle = hmI18n.TRANSFER_MEDREC;
                            }
                            if (medStatusReply) {
                                mrTransferStatusObj = CERN_HOME_MEDS_O2.getStatusObject(medStatusReply.MEDREC_TRANSFER_STATUS.STATUS_FLAG, medStatusReply.MEDREC_TRANSFER_STATUS.PERFORMED_PRSNL_NAME, medStatusReply.MEDREC_TRANSFER_STATUS.PERFORMED_DATE);
                                if (medStatusReply.MEDREC_TRANSFER_STATUS.CROSS_ENCNTR_IND === 0) {
                                    if (mrTransferStatusObj.clsName === "partial-inprocess" || mrTransferStatusObj.clsName === "partial-complete") {
                                        imgClass = compNS + "-status-img" + " " + mrTransferStatusObj.clsName;
                                        transferHoverHtml = "<div class='result-details hover'><h4 class='det-hd'><span>" + hmI18n.STATUS + "</span></h4><dl class='" + compNS + "-det'><dt><span>" + hmI18n.STATUS + ":</span></dt><dd><span>" + mrTransferStatusObj.status + "</span></dd><dt><span>" + hmI18n.LAST_RECONED + ":</span></dt><dd><span>" + mrTransferStatusObj.performedDate + "</span></dd><dt><span>" + hmI18n.LAST_RECONED_BY + ":</span></dt><dd><span>" + mrTransferStatusObj.performedBy + "</span></dd></dl></div>";
                                    }
                                }
                            }
                            if (component.inMillennium) {
                                mrTransferStatusHtml = "<h3 class='info-hd'>" + hmI18n.STATUS + "</h3><dl class='" + compNS + "-status result-info'><dd class=" + medrecLinkSeperatorFlag + ">&nbsp;</dd><dd class='" + imgClass + "'>&nbsp;</dd><dd><a id='medRecTransfer" + componentId + "'>" + medRecTransferTitle + "</a></dd></dl>";
                                mrTransferStatusHtml += transferHoverHtml;
                            } else {
                                mrTransferStatusHtml = "<h3 class='info-hd'>" + hmI18n.STATUS + "</h3><dl class='" + compNS + "-status result-info'><dd class=" + medrecLinkSeperatorFlag + ">&nbsp;</dd><dd class='" + imgClass + "'>&nbsp;</dd><dd>" + medRecTransferTitle + "</dd></dl>";
                            }
                            medRecFiltersFlag = true;
                            medrecLinkSeperatorFlag = compNS + '-medrec-link-seperator';
                            medRecHtml += mrTransferStatusHtml;

                        }
                        if (component.getMedRecCrossEncTx()) {
                            var mrTransferStatusObj = CERN_HOME_MEDS_O2.getStatusObject(-1);
                            var crossEncTxName = MP_Util.GetCodeValueByMeaning("XENCTRANSFER", 4003029);
                            var imgClass = "";
                            var crossEncntrTxHoverHtml = "";
                            var medRecXEncntrTxTitle = "";
                            if (crossEncTxName) {
                                medRecXEncntrTxTitle = crossEncTxName.display;
                            } else {
                                medRecXEncntrTxTitle = hmI18n.CROSS_ENCNTR_TRASNFER;
                            }
                            if (medStatusReply) {
                                mrTransferStatusObj = CERN_HOME_MEDS_O2.getStatusObject(medStatusReply.MEDREC_TRANSFER_STATUS.STATUS_FLAG, medStatusReply.MEDREC_TRANSFER_STATUS.PERFORMED_PRSNL_NAME, medStatusReply.MEDREC_TRANSFER_STATUS.PERFORMED_DATE);
                                if (medStatusReply.MEDREC_TRANSFER_STATUS.CROSS_ENCNTR_IND === 1) {
                                    if (mrTransferStatusObj.clsName === "partial-inprocess" || mrTransferStatusObj.clsName === "partial-complete") {
                                        imgClass = compNS + "-status-img" + " " + mrTransferStatusObj.clsName;
                                        crossEncntrTxHoverHtml = "<div class='result-details hover'><h4 class='det-hd'><span>" + hmI18n.STATUS + "</span></h4><dl class='" + compNS + "-det'><dt><span>" + hmI18n.STATUS + ":</span></dt><dd><span>" + mrTransferStatusObj.status + "</span></dd><dt><span>" + hmI18n.LAST_RECONED + ":</span></dt><dd><span>" + mrTransferStatusObj.performedDate + "</span></dd><dt><span>" + hmI18n.LAST_RECONED_BY + ":</span></dt><dd><span>" + mrTransferStatusObj.performedBy + "</span></dd></dl></div>";
                                    }
                                }
                            }
                            if (component.inMillennium) {
                                mrCrxEncntrTxStatusHtml = "<h3 class='info-hd'>" + hmI18n.STATUS + "</h3><dl class='" + compNS + "-status result-info'><dd class=" + medrecLinkSeperatorFlag + ">&nbsp;</dd><dd class='" + imgClass + "'>&nbsp;</dd><dd><a id='medRecCrossEncntrTx" + componentId + "'>" + medRecXEncntrTxTitle + "</a></dd></dl>";
                                mrCrxEncntrTxStatusHtml += crossEncntrTxHoverHtml;
                            } else {
                                mrCrxEncntrTxStatusHtml = "<h3 class='info-hd'>" + hmI18n.STATUS + "</h3><dl class='" + compNS + "-status result-info'><dd class=" + medrecLinkSeperatorFlag + ">&nbsp;</dd><dd class='" + imgClass + "'>&nbsp;</dd><dd>" + medRecXEncntrTxTitle + "</dd></dl>";
                            }
                            medRecFiltersFlag = true;
                            medrecLinkSeperatorFlag = compNS + '-medrec-link-seperator';
                            medRecHtml += mrCrxEncntrTxStatusHtml;
                        }
                        if (component.getMedRecDischarge()) {
                            var mrDischargeStatusObj = CERN_HOME_MEDS_O2.getStatusObject(-1);
                            var statusTitle = "";
                            var medRecDischargeTitle = "";
                            if (medStatusReply) {
                                if (medStatusReply.ENCNTR_TYPE === 2) {
                                    statusTitle = MP_Util.GetCodeValueByMeaning("OUTPATIENT", 4003029);
                                    if (statusTitle) {
                                        medRecDischargeTitle = statusTitle.display;
                                    } else {
                                        medRecDischargeTitle = hmI18n.OUTPATIENT_MEDREC;
                                    }
                                } else {
                                    statusTitle = MP_Util.GetCodeValueByMeaning("DISCHARGE", 4003029);
                                    if (statusTitle) {
                                        medRecDischargeTitle = statusTitle.display;
                                    } else {
                                        medRecDischargeTitle = hmI18n.DISCHARGE_MEDREC;
                                    }
                                }
                                mrDischargeStatusObj = CERN_HOME_MEDS_O2.getStatusObject(medStatusReply.MEDREC_DISCHARGE_STATUS.STATUS_FLAG, medStatusReply.MEDREC_DISCHARGE_STATUS.PERFORMED_PRSNL_NAME, medStatusReply.MEDREC_DISCHARGE_STATUS.PERFORMED_DATE);
                                venueDisch = medStatusReply.VENUE_CODE.DISCHARGE;
                            }

                            if (component.inMillennium) {
                                mrDischargeStatusHtml = "<h3 class='info-hd'>" + hmI18n.STATUS + "</h3><dl class='" + compNS + "-status result-info'><dd class=" + medrecLinkSeperatorFlag + ">&nbsp;</dd><dd class='" + compNS + "-status-img " + mrDischargeStatusObj.clsName + "'>&nbsp;</dd><dd><a id='medRecDischarge" + componentId + "'>" + medRecDischargeTitle + "</a></dd></dl><div class='result-details hover'><h4 class='det-hd'><span>" + hmI18n.STATUS + "</span></h4><dl class='" + compNS + "-det'><dt><span>" + hmI18n.STATUS + ":</span></dt><dd><span>" + mrDischargeStatusObj.status + "</span></dd><dt><span>" + hmI18n.LAST_RECONED + ":</span></dt><dd><span>" + mrDischargeStatusObj.performedDate + "</span></dd><dt><span>" + hmI18n.LAST_RECONED_BY + ":</span></dt><dd><span>" + mrDischargeStatusObj.performedBy + "</span></dd></dl></div>";
                            } else {
                                mrDischargeStatusHtml = "<h3 class='info-hd'>" + hmI18n.STATUS + "</h3><dl class='" + compNS + "-status result-info'><dd class=" + medrecLinkSeperatorFlag + ">&nbsp;</dd><dd class='" + compNS + "-status-img med-rec-status " + mrDischargeStatusObj.clsName + "'>&nbsp;</dd><dd>" + medRecDischargeTitle + "</dd></dl>";
                            }
                            medRecFiltersFlag = true;
                            medRecHtml += mrDischargeStatusHtml;
                        }
                        if (medRecFiltersFlag) {
                            medRecHtmlStatus = "<div class='" + compNS + "-status-container hml2-pull-right' id='medStatusContainer" + componentId + "'><dl class='" + compNS + "-status'><dd>" + hmI18n.STATUS + ":</dd></dl>";
                            medRecHtmlStatus += medRecHtml;
                            medRecHtmlStatus += "</div>";
                        } else {
                            medRecHtmlStatus = "<div class='" + compNS + "-status-container hml2-pull-right' id='medStatusContainer" + componentId + "'>";
                            medRecHtmlStatus += medRecHtml;
                            medRecHtmlStatus += "</div>";
                        }
                    }

                    // generate a header if any of the header elements are present
                    if (CERN_HOME_MEDS_O2.shouldDisplayMedsHeader(component)) {
                        var medsHeaderInfoContainer = null;
                        // If we retrieve both PED and HI Data, and the checkbox is checked.  Create the Segmented Control
                        if (component.isPatientEnteredDataDisplayEnabled() && component.getExternalDataInd()) {
                            // Check if the healthe intent data is valid and contains meds.  Pass this into the createSegmentedButton function to enable/disable the Outside Records segment
                            var validHiData = CERN_HOME_MEDS_O2.processExtDataForRender(component);
                            // if the preference for the outside request is enabled, show the segmented button
                            segmentedControl = CERN_HOME_MEDS_O2.createSegmentedButton(component, recordData, validHiData);
                            component.setSegmentedControl(segmentedControl);
                            segmentedControlDisplay = segmentedControl.render();
                            medsHeaderInfoContainer = "<div class='hml2-meds-header-info-container hml2-meds-header-info-container-with-segmented-control'>" + segmentedControlDisplay + "<div class='hml2-clearfix hml2-pull-right-no-width hml2-padding-top5 hml2-width'>" + medRecHtmlStatus + outsideRecsChkbox + "</div></div>";
                        } else {
                            // Add an empty button div.  Used with ClearFix.  Gives the status row & checkbox an element to float off of.
                            segmentedControlDisplay = "<div class = 'btn-group hml2-padding-top20'></div>";
                            medsHeaderInfoContainer = "<div class='hml2-meds-header-info-container'>" + segmentedControlDisplay + "<div class='hml2-clearfix hml2-pull-right-no-width hml2-padding-top5 hml2-width'>" + medRecHtmlStatus + outsideRecsChkbox + "</div></div>";
                        }

                        medsContainer.push(medsHeaderInfoContainer);
                    }

                    if (component.m_mfaBanner) {
                      medsContainer.push("<div id='hml2-meds-mfa-banner-container'>" + component.m_mfaBanner.render() + "</div>");
                    }

                    if (component.getDisplayHiDataInd() && component.getOutsideRecordsInd()) {
                        try {
                            // Added to display Show HI Data link
                            var status = recordData.STATUS_DATA.SUBEVENTSTATUS[0].OPERATIONSTATUS;
                            // Handle error condition if the status is "S".
                            if (status === "S") {
                                if (CERN_HOME_MEDS_O2.processExtDataForRender(component)) {
                                    if (!component.isPatientEnteredDataDisplayEnabled()) {
                                    var externalDataHTML = CERN_HOME_MEDS_O2.createExternalDataControl(component, false);
                                    medsContainer.push(externalDataHTML);
                                    }
                                    var extData = "<div id ='hml2" + medCompId + "externaldata' class ='hml2-ext-table'></div>" + "<div id='pager" + medCompId + "'></div>";
                                    medsContainer.push(extData);
                                } else if (component.externalHomeMed.total_results !== 0) {
                                    var externalDataHTML = CERN_HOME_MEDS_O2.createExternalDataControl(component, true);
                                    medsContainer.push(externalDataHTML + "</br>");
                                }
                            } else {
                                var externalDataHTML = CERN_HOME_MEDS_O2.createExternalDataControl(component, true);
                                medsContainer.push(externalDataHTML);
                                medsContainer.push("</br>");
                            }
                        } catch (err) {
                            logger.logJSError(err, this, "homemedications-o2.js", "Retriving Healthe Intent data");
                            var externalDataHTML = CERN_HOME_MEDS_O2.createExternalDataControl(component, true);
                            medsContainer.push(externalDataHTML);
                            medsContainer.push("</br>");
                        }
                    }
                    medsContainer.push("<div id='hml2-loading", medCompId, "' class='hml2-loading'></div>");
                    var complianceText = CERN_HOME_MEDS_O2.getComplianceInfo(recordData.COMPLIANCE, personnelArray);
                    if (complianceText && complianceText.length > 0) {
                        medsContainer.push(complianceText);
                        component.setCompliance(true);
                    }

                    var ipath = criterion.static_content;
                    var countText = "";
                    var medCnt = 0;
                    var rowCnt = 0;
                    var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                    var df = CERN_HOME_MEDS_O2.getDateFormatter();
                    var imgClass = "";
                    var edtCls = "";
                    var modHTML = "";

                    // Med Modification Indicator - Bedrock setting that allows the user to renew, cancel/dc, or complete medications
                    var bMedMod = component.isMedModInd();

                    var grouperCriteria;
                    var hasFilters = false;
                    var homeMedsTable;
                    var prescribedTblGroup;
                    var suspendedTblGroup;
                    var prescribedMeds = [];
                    var suspendedMeds = [];
                    var patReqCount = 0;
                    var medsCount;
                    var med;
                    var medStatus;
                    var isGroupFilterSelected = false;
                    var patRequestPrefInd = component.isPatientEnteredDataDisplayEnabled();
                    var otherMeds = [];
                    // Create the component table
                    homeMedsTable = (new ComponentTable())
                        .setNamespace('hml2' + medCompId)
                        .setIsHeaderEnabled(true);

                    // Divides the medications into two lists within the component, m_patientRequestList and m_otherCharMedsList
                    CERN_HOME_MEDS_O2.setMedicationRows(recordData.ORDERS, component);
                    // Get the count of Patient Requested medications
                    patReqCount = component.m_patientRequestList.length;
                    if (recordData.ORDERS.length > 0) {
                        //Checks to see if the user selected a filter
                        if (isFinite(groupNum)) {
                            parentDiv.selectedVal = groupNum;
                            // If groupNum = -1, then the user cleared the preferences, this will reload the component and sort the meds alphabetically (called below)
                            if (groupNum != -1) {
                                grouperCriteria = component.getGrouperCriteria(groupNum);
                                component.setGrouperFilterCriteria(grouperCriteria);
                                recordData = CERN_HOME_MEDS_O2.sortByDropdownValue(recordData, grouperCriteria);
                                //Save the component preferences
                                MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId);
                            }
                        } else {
                            for (var y = 0; y <= 10; y++) {
                                if (component.getGrouperLabel(y)) {
                                    hasFilters = true;
                                    break;
                                }
                            }
                            //The component has just loaded, check to see if any preferences are saved or not.
                            isGroupFilterSelected = hasFilters && component.getGrouperFilterLabel();
                            if (!isGroupFilterSelected) {
                                //No grouping has been selected, the meds will be sorted alphabetically
                                if (recordData.ORDERS.length) {
                                    recordData.ORDERS.sort(CERN_HOME_MEDS_O2.SortByMedicationName);
                                }
                            } else {
                                //A saved option is loaded and the meds will be sorted according to the option
                                $("#filter-grouping-selected-label-" + component.getStyles().getId()).html(component.getGrouperFilterLabel());
                                var dummyCriteria = component.getGrouperFilterCriteria();
                                if (!dummyCriteria) {
                                    dummyCriteria = component.getGrouperFilterEventSets();
                                }
                                if (dummyCriteria) {
                                    recordData = CERN_HOME_MEDS_O2.sortByDropdownValue(recordData, dummyCriteria, component);
                                }
                            }
                        }
                        if (component.m_otherCharMedsList) {
                            medsCount = component.m_otherCharMedsList.length;
                        }
                        medsContainer.push("<div class='", MP_Util.GetContentClass(component, medsCount), "'>");

                        //Separate suspended meds from prescribed meds
                        for (var i = 0; i < medsCount; i++) {
                            med = component.m_otherCharMedsList[i];
                            medStatus = MP_Util.GetValueFromArray(med.CORE.STATUS_CD, codeArray);
                            if (medStatus && medStatus.meaning === "SUSPENDED") {
                                suspendedMeds.push(med);
                            } else {
                                prescribedMeds.push(med);
                            }
                        }
                        //the component table sorting will not be applied if a group class other than default is selected
                        var tableSortingEnabled = !(isGroupFilterSelected);
                        // If the View Patient Entered Data bedrock filter is on and we are not viewing HI data, add the Request Column
                        if (patRequestPrefInd && !component.getDisplayHiDataInd()) {
                            homeMedicationsCapTimer = new CapabilityTimer("CAP:MPG HOME MEDICATIONS LOAD PATIENT ENTERED DATA");
                            homeMedicationsCapTimer.capture();
                            // Bind patient requests to a table group
                            var patRequestsTblGroup = new TableGroup();
                            patRequestsTblGroup.setGroupId("PATREQUEST" + componentId);
                            patRequestsTblGroup.setDisplay("<span class='hml2-pat-req-icon'>&nbsp;</span>" + hmI18n.PATIENT_REQUESTS);
                            patRequestsTblGroup.setShowCount(true);
                            patRequestsTblGroup.setCanCollapse(false);
                            if (patReqCount) {
                                // Create the patient request column only when some patient requests were found
                                var requestColumn = CERN_HOME_MEDS_O2.createTableColumn("request" + medCompId, hmI18n.REQUEST, tableSortingEnabled, "PAT_REQUEST_DISPLAY", "${PAT_REQUEST_DISPLAY}", "hml2-pat-request-col");
                                requestColumn.addSecondarySortField("MEDICATION_TEXT", TableColumn.SORT.ASCENDING);
                                requestColumn.addSecondarySortField("LAST_DOSE_DATE_DISPLAY", TableColumn.SORT.DESCENDING);
                                homeMedsTable.addColumn(requestColumn);

                                // Create  column templates for prescribed meds
                                CERN_HOME_MEDS_O2.processHomeMedsData(component.m_patientRequestList, component);

                                // Attach patient request data to the table
                                patRequestsTblGroup.bindData(component.m_patientRequestList);
                            }
                            homeMedsTable.addGroup(patRequestsTblGroup);
                        }

                        //create  column templates for prescribed meds
                        CERN_HOME_MEDS_O2.processHomeMedsData(prescribedMeds, component);

                        //create and configure the info buttons column
                        var infoIconsClass = CERN_HOME_MEDS_O2.getInfoButtonClass(component);

                        var infoIconColumn = CERN_HOME_MEDS_O2.createTableColumn("infoICon" + medCompId, "", false, "INFO_ICON_DISPLAY", "${INFO_ICON_DISPLAY}", infoIconsClass);
                        //create and configure the medication column
                        var medColClass = (patRequestPrefInd && patReqCount && !component.getDisplayHiDataInd()) ? "hml2-med-col-with-pat-req" : "hml2-med-col";
                        var medicationColumn = CERN_HOME_MEDS_O2.createTableColumn("medication" + medCompId, hmI18n.MEDICATION, tableSortingEnabled, "MEDICATION_TEXT", "${MEDICATION_DISPLAY}", medColClass);
                        if (tableSortingEnabled) {
                        medicationColumn.addSecondarySortField("LAST_DOSE_DATE_DISPLAY", TableColumn.SORT.DESCENDING);
                        }
                        //create and configure the last dose date column
                        var lastDoseClass = (patRequestPrefInd && patReqCount && !component.getDisplayHiDataInd()) ? "hml2-last-dose-with-pat-req" : "hml2-last-dose";
                        var lastDoseColumn = CERN_HOME_MEDS_O2.createTableColumn("lastDoseDate" + medCompId, hmI18n.LAST_DOSE, tableSortingEnabled, "LAST_DOSE_DATE_DISPLAY", "${LAST_DOSE_DATE_DISPLAY}", lastDoseClass);
                        if (tableSortingEnabled) {
                        lastDoseColumn.setDefaultSort(TableColumn.SORT.DESCENDING);
                        }

                        //create and configure the compliance column
                        var complianceColumn = CERN_HOME_MEDS_O2.createTableColumn("compliance" + medCompId, hmI18n.COMPLIANCE, tableSortingEnabled, "COMPLIANCE_DISPLAY", "${COMPLIANCE_DISPLAY}", "hml2-compliance");

                        //create and configure the compliance comment column
                        var compCommentClass = (patRequestPrefInd && patReqCount && !component.getDisplayHiDataInd()) ? "hml2-compliance-comment-with-pat-req" : "hml2-compliance-comment";
                        var compCommentColumn = CERN_HOME_MEDS_O2.createTableColumn("compComment" + medCompId, hmI18n.COMPLIANCE_COMMENT, tableSortingEnabled, "COMP_COMMENT_DISPLAY", "${COMP_COMMENT_DISPLAY}", compCommentClass);

                        //create and configure the formulary column
                        var formularyDisplay = "<span>" + hmI18n.FORMULARY + "</span>";
                        var formularyColumn = CERN_HOME_MEDS_O2.createTableColumn("formulary" + medCompId, formularyDisplay, false, "", "${FORMULARY_DISPLAY}", "hml2-formulary hml2-hidden");

                        homeMedsTable.addColumn(infoIconColumn);
                        homeMedsTable.addColumn(medicationColumn);
                        homeMedsTable.addColumn(lastDoseColumn);
                        homeMedsTable.addColumn(complianceColumn);
                        homeMedsTable.addColumn(compCommentColumn);
                        homeMedsTable.addColumn(formularyColumn);

                        //bind prescribed orders to the prescribed table group
                        prescribedTblGroup = new TableGroup();
                        prescribedTblGroup.bindData(prescribedMeds);
                        prescribedTblGroup.setGroupId("PRESCRIBED" + medCompId);
                        // If the patient request section is being desplayed, display the Other Chart Medicatios header and sort by Request first, then Medication second
                        if (patRequestPrefInd && !component.getDisplayHiDataInd()) {
                            prescribedTblGroup.setHideHeader(false);
                            prescribedTblGroup.setDisplay(hmI18n.OTHER_CHART_MEDICATIONS);
                            prescribedTblGroup.setShowCount(true);
                            prescribedTblGroup.setCanCollapse(false);
                            if (tableSortingEnabled) {
                                // Set the default sort of the table
                                homeMedsTable.sortByColumnInDirection("medication" + medCompId, TableColumn.SORT.ASCENDING);
                                if (patReqCount) {
                                    homeMedsTable.sortByColumnInDirection("request" + medCompId, TableColumn.SORT.ASCENDING);
                                }
                            }
                        }
                        // If only chart medications are being displayed, hide the header and sort by Medication
                        else {
                        prescribedTblGroup.setHideHeader(true);
                            homeMedsTable.sortByColumnInDirection("medication" + medCompId, TableColumn.SORT.ASCENDING);
                        }
                        homeMedsTable.addGroup(prescribedTblGroup);
                        // If suspended Medications exist.  Create the Suspended table group
                        if (suspendedMeds.length) {
                            CERN_HOME_MEDS_O2.processHomeMedsData(suspendedMeds, component);
                            //bind suspended orders to the suspended table group
                            suspendedTblGroup = new TableGroup();
                            suspendedTblGroup.bindData(suspendedMeds);
                            suspendedTblGroup.setGroupId("SUSPENDED" + medCompId);
                            suspendedTblGroup.setDisplay(i18n.SUSPENDED);
                            suspendedTblGroup.setShowCount(true);
                            if (component.getOutsideRecordsInd()) {
                                suspendedTblGroup.setCanCollapse(false);
                            }
                            else {
                                suspendedTblGroup.setCanCollapse(true);
                            }
                            // Add Table Group to HomeMeds Table
                            homeMedsTable.addGroup(suspendedTblGroup);
                        }

                        //If table sorting is enabled, set the default sort of the table
                        if (tableSortingEnabled) {
                            if (patReqCount && component.getOutsideRecordsInd() && !component.getDisplayHiDataInd()) {
                                homeMedsTable.sortByColumnInDirection("request" + medCompId, TableColumn.SORT.ASCENDING);
                            }
                            else {
                        homeMedsTable.sortByColumnInDirection("medication" + medCompId, TableColumn.SORT.ASCENDING);
                            }
                        }

                        // Set up row hover extension to display medication order details
                        var medHoverTemplate = '${RESULT_DATA.MED_ORDER_HOVER}';
                        //Store off component table
                        component.setComponentTable(homeMedsTable);
                        // Create the extension on the component table
                        var hoverExtension = CERN_HOME_MEDS_O2.createTableCellHover(component, medicationColumn, lastDoseColumn, complianceColumn, compCommentColumn, formularyColumn);
                        component.setTableHoverExtension(hoverExtension);
                        homeMedsTable.addExtension(hoverExtension);

                        medsContainer.push(homeMedsTable.render());
                        medsContainer.push("<div id ='hml2", medCompId, "sidePanelContainer' class='hml2-side-panel'>&nbsp;</div>");
                        medCnt = prescribedMeds.length + suspendedMeds.length;
                        if (component.getOutsideRecordsInd()) {
                            medCnt += patReqCount;
                        }
                    } else {
                        bMedMod = false;
                        if (recordData.COMPLIANCE.NO_KNOWN_HOME_MEDS_IND === 0 && recordData.COMPLIANCE.UNABLE_TO_OBTAIN_IND === 0) {
                            medsContainer.push("<span class='res-none'>", hmI18n.NO_RESULTS_FOUND, "</span>");
                        }

                    }

                    if (bMedMod) {
                        if (_g("hml2Ftr" + medCompId)) {
                            Util.de(_g("hml2Ftr" + medCompId));
                        }
                        var secCont = component.getSectionContentNode();
                        var medModFt = Util.cep("div", {
                            className: "hml2-content-ft",
                            id: "hml2Ftr" + medCompId
                        });
                        var medModFtHTML =
                            '<div class="med-rnw-row" id="medRnwRow' + medCompId + '">' +
                                '<button class="hml2-rnw-btn" id="medRnwBtn' + medCompId + '" disabled="true">' +
                                    '<img id="medRnwImg' + medCompId + '"  src="' + ipath + '/images/renew_disabled.gif" alt="" /> ' +
                                        hmI18n.MED_RENEW +
                                '</button>' +
                                '<button class="hml2-rnw-btn" id="medCnclBtn' + medCompId + '" disabled="true">' +
                                    '<img id="medCnclImg' + medCompId + '" src="' + ipath + '/images/cancel_disabled.gif" alt="" /> ' +
                                    hmI18n.MED_CANCEL +
                                '</button>' +
                                '<button class="hml2-rnw-btn" id="medCmpltBtn' + medCompId + '" disabled="true">' +
                                    '<img id="medCmpltImg' + medCompId + '" src="' + ipath + '/images/complete_disabled.gif" alt="" /> ' +
                                    hmI18n.MED_COMPLETE +
                                '</button>' +
                                '<button class="hml2-rnw-btn hml2-sgn-btn" id="medSgnBtn' + medCompId + '" disabled="true"> ' +
                                    hmI18n.MED_SIGN +
                                ' </button>' +
                            '</div>' +
                            '<div class= "hml2-sgn-row" id="medSgnRow' + medCompId + '">' +
                                ' <span class="hml2-route">' +
                                    hmI18n.DEF_ROUTE_LBL + ': ' +
                                    '<a id="routeLink' + medCompId + '" class="hml2-route-link hml2-dthrd" >' +
                                        hmI18n.MED_NONE_SELECTED +
                                    '</a>' +
                                '</span>' +
                            '</div>';

                        medModFt.innerHTML = medModFtHTML;
                        Util.ia(medModFt, secCont);
                    }

                    //notifies whoever is listening that we have a new count
                    var eventArg = {
                        "count": medCnt
                    };
                    CERN_EventListener.fireEvent(component, component, EventListener.EVENT_COUNT_UPDATE, eventArg);

                    countText = MP_Util.CreateTitleText(component, medCnt);

                    component.updateSatisfierRequirementIndicator();

                    MP_Util.Doc.FinalizeComponent(medsContainer.join(''), component, countText);

                    // If viewed in millennium, attach the hover and click events to the status links
                    if (component.inMillennium) {
                        var statusNode = document.getElementById("medStatusContainer" + componentId);
                        component.initHovers(statusNode);
                        if (component.getMedHistory()) {
                            // Click event that opens the Meds History view
                            $('#medsHistory' + componentId).click(function() {
                                CERN_HOME_MEDS_O2.launchMedsHistory(component);



                            });
                        }
                        // Click event that opens the Admissions Meds Rec view
                        if (component.getMedRecAdmit()) {
                            $('#medRecAdmission' + componentId).click(function() {
                                component.launchMedicationReconciliation(componentId, 1, venueAdm);
                            });
                        }
                        // Click event that opens the Discharge Meds Rec view
                        if (component.getMedRecDischarge()) {
                            $('#medRecDischarge' + componentId).click(function() {
                                component.launchMedicationReconciliation(componentId, 3, venueDisch);
                            });
                        }

                        if (component.getMedRecTransfer()) {
                            $('#medRecTransfer' + componentId).click(function() {
                                component.launchMedicationReconciliation(componentId, 2, 0.0);
                            });
                        }

                        if (component.getMedRecCrossEncTx()) {
                            $('#medRecCrossEncntrTx' + componentId).click(function() {
                                component.launchMedicationReconciliation(componentId, 6, 0.0);
                            });
                        }
                    }

                    homeMedsTable.finalize();
                    if(segmentedControl){
                        segmentedControl.attachEvents();
                    }

                    // If the component table exists, rebind table events after the table is refreshed.
                    if (component.getComponentTable()) {
                    CERN_HOME_MEDS_O2.bindColumnHeaderClick(component);
                        // Disable expand/collapse upon header click
                        if (component.getOutsideRecordsInd()) {
                            CERN_HOME_MEDS_O2.disableHeaderClick();
                        }
                    }

                    // Attach the click event to the Outside Records Checkbox that will show/hide the patient request section.
                    $('#hml2-outside-recs-checkbox' + componentId).click(function() {
                        var $this = $(this);
                        // Once clicked, if the checkbox is now checked, set the pref to 1
                        if ($this.is(':checked')) {
                            component.setOutsideRecordsInd(true);
                        } else {
                            // The checkbox has been unchecked so set the pref to 0
                            component.setOutsideRecordsInd(false);
                        }
                        // Refresh the component after changing the preferences
                        component.InsertData();
                    });

                }
            } catch (e) {
                MP_Util.LogJSError(e, component, "homemedications-o2.js", "displayAllData");
                throw e;
            }

        },
        /**
         * Verifies whether or not the home meds header displays according to which header elements are enabled
         * in bedrock.
         * @param comp the home medications component object
         * @return boolean
         */
        shouldDisplayMedsHeader: function (comp) {
            return comp.getPatientEnteredDataInd() || (
                    // discharge reconciliation modal must be true/yes to display statuses
                    comp.getMedRec() && (
                        comp.getMedHistory()        ||
                        comp.getMedRecAdmit()       ||
                        comp.getMedRecTransfer()    ||
                        comp.getMedRecCrossEncTx()  ||
                        comp.getMedRecDischarge()
                    )
                );
        },
        /**
         * Prevents the click event on the table headers that collapses the table groups
         * This is a partial fix for the table-group header click that will be fully addressed in the 5.7 release
         * @return undefined
         */
        disableHeaderClick: function() {
            $(".hml2-sec :header").click(function() {
                return false;
            });
        },
        /**
         * To create the HTML and the event listeners for the segmented button
         * @param {Object}  component   HomeMeds component object
         * @param {Object}  recordData  Record data containing the medicaiton information
         * @param {Boolean} validHiData boolean value specifying if HI Data is valid and can be displayed
         * @return {Object} The MPageUI Segmented Control
         */
        createSegmentedButton: function(component, recordData, validHiData) {
            var self = this;
            var hmI18n = i18n.discernabu.homemeds_o2;
            // Define the segmented control
            var segment = new MPageUI.SegmentedControl();
            // Add the Patient Request segment
            segment.addSegment({
                label: hmI18n.PATIENT_REQUESTS,
                selected: !component.getDisplayHiDataInd(),
                onSelect: function() {
                    component.setDisplayHiDataInd(false);
                    component.InsertData();
            }
            });
            // Add the Outside Records Segment
            segment.addSegment({
                label: hmI18n.OUTSIDE_RECORDS_SEGMENTED_CONTROL,
                disabled: !validHiData,
                selected: component.getDisplayHiDataInd(),
                onSelect: function() {
                    component.setDisplayHiDataInd(true);
                    component.InsertData();
                }
            });
            // Return the segmented control markup
            return segment;
        },

        /**
         * To initialize a side panel
         * function
         * memberof CERN_HOME_MEDS_O2
         * name initializeSidePanel
         * This function handles the logic to initialize a side panel (that starts out hidden) in the component
         * @param {object} component : The Home Medications component object
         * @returns {undefined} undefined
         */
        initializeSidePanel: function(component) {
            var compId = component.m_componentId;
            var sidePanelContId = 'hml2' + compId + 'sidePanelContainer';
            var sidePanelObj = _g(sidePanelContId);
            var tableObj = $('#hml2' + compId + 'table');
            var footerObj = $("#hml2Ftr" + compId);
            var tableHeight = null;

            if (tableObj && tableObj.length) {
                tableHeight = tableObj.css("height");
            } else {
                logger.logError("Table object was not found in initializeSidePanel function.");
                return;
            }

            if (sidePanelObj) {
                component.m_sidePanel = new CompSidePanel(compId, sidePanelContId);
                component.m_sidePanel.setExpandOption(component.m_sidePanel.expandOption.EXPAND_DOWN);
                component.m_sidePanel.setHeight(tableHeight);
                component.m_sidePanel.setMinHeight(tableHeight);
                component.m_sidePanel.renderPreBuiltSidePanel();
                component.m_sidePanel.setContents("<div>&nbsp;</div>", "hml2Content" + compId);
                component.m_sidePanel.showCornerCloseButton();

                // set the function that will be called when the close button on the side panel is clicked
                component.m_sidePanel.setCornerCloseFunction(function() {
                    $("#" + sidePanelContId).hide();
                    tableObj.removeClass("hml2-table-with-panel");
                    footerObj.removeClass("hml2-footer-with-panel");
                    component.m_sidePanelShowing = false;

                    //reset the table row highlights and icons
                    var selectedRowsObj = tableObj.find('.hml2-med-selected');
                    var selectedRows = [];
                    //only reset the rows if any rows are highlighted
                    if (selectedRowsObj.length) {
                        for (var i = 0; i < selectedRowsObj.length; i++) {
                            selectedRows.push(selectedRowsObj[i]);
                        }

                        CERN_HOME_MEDS_O2.removeCurrentHighlightedRows(component, selectedRows);
                    }
                });
            }
        },

        /**
         * Creates and appends the remove request button to the top of the side panel
         * @param  {Object} medsCompObj  Home Medications component object
         * @param  {Array}  selectedRow  Array containing selected row
         * @param  {Object} rowOrderInfo Row order Information for the selected med
         * @param  {Object} sidePanel    Side panel object
         * @return {undefined}
         */
        createRemoveRequestButton: function(medsCompObj, selectedRow, rowOrderInfo, sidePanel) {
            var compId = medsCompObj.getComponentId();
            var criterion = medsCompObj.getCriterion();
            var hmI18n = i18n.discernabu.homemeds_o2;
            var ipath = criterion.static_content;
            // Set Hx scroll as default Icon
            var ordersMedInfo = rowOrderInfo.MEDICATION_INFORMATION;
            // If the med is a prescribed med use the pill bottle icon, else use the scroll icon
            var iconName = (ordersMedInfo.ORIGINALLY_ORDERED_AS_TYPE.PRESCRIPTION_IND) ? '4969_16.png' : '3796_16.png';
            var sidePanelObject = $("#sidePanelContents" + compId);
            // Add the icon to the top od the side panel
            $("<img class='hml2-side-panel-hx-icon' />").prependTo("#sidePanelHeaderText" + compId).attr({
                src: ipath + "/images/" + iconName,
                alt: ""
            });
            // Create the MPage Button Enum for button style options
            var buttonStyleEnum = MPageUI.BUTTON_OPTIONS.STYLE;
            // Instantiate MpageUI button
            var removeRequestBtn = new MPageUI.Button();
            removeRequestBtn.setLabel(hmI18n.REMOVE_REQUEST);
            removeRequestBtn.setStyle("hml2-remove-request-btn" + " " + buttonStyleEnum.SECONDARY);
            // When clicked remove the selected medication row from the table
            removeRequestBtn.setOnClickCallback(function() {
                var removeRequestRoot = $(removeRequestBtn.getRootElement());
                homeMedicationsCapTimer = new CapabilityTimer("CAP:MPG HOME MEDICATIONS RECONCILE PATIENT ENTERED DATA");
                homeMedicationsCapTimer.capture();
                removeRequestBtn.setDisabled(true);
                removeRequestRoot.css("cursor", "wait");
                try {
                    var groupId = "PATREQUEST" + compId;
                    var homeMedsCompTable = medsCompObj.getComponentTable();
                    // Object containing the table information for patient requested medications
                    var patRecTableGroup = homeMedsCompTable.getGroupById(groupId);
                    // Get the selected row's ID
                    var selRowId = selectedRow[0].attributes.id.nodeValue.split(":")[2];
                    // Get the selected row
                    var row = patRecTableGroup.getRowById(selRowId);
                    var rowIndex = $.inArray(row, patRecTableGroup.rows);
                    var extDataInfoId = rowOrderInfo.INTEROP[0].EXT_DATA_INFO_ID;
                    var prsnlId = criterion.provider_id;
                    // Get the encounter ID of the selected rows med.  For "Added" meds this will be 0.0 so use the encounter ID for currently viewed encounter in Powerchart
                    var encounterId = rowOrderInfo.CORE.ENCNTR_ID || criterion.encntr_id;
                    var chartReferenceId = ordersMedInfo.ORDER_ID;
                    var removeStatusCode = MP_Util.GetCodeValueByMeaning("ACKNOWLEDGED", 4003508).codeValue;
                    var requestJson = '{"REQUESTIN":{"UPDATESTATUS":[{"EXT_DATA_INFO_ID":' + extDataInfoId + '.0' + ',"STATUS_CODE":' + removeStatusCode + '.0' + ',"CHART_REFERENCE_ID":' + chartReferenceId + '.0' + ',"PERSONNEL_ID":' + prsnlId + '.0' + ',"ENCNTR_ID":' + encounterId + '.0' + '}]}}';
                    var scriptRequest = new ScriptRequest();
                    scriptRequest.setProgramName("mp_exec_std_request");
                    scriptRequest.setDataBlob(requestJson);
                    // App number,task number,request number
                    scriptRequest.setParameterArray(["^MINE^", "^^", 3202004, 3202004, 964756]);
                    // Callback function to handle the response
                    scriptRequest.setRawDataIndicator(true);
                    scriptRequest.setResponseHandler(function(scriptReply) {
                        try {
                            var responseData = JSON.parse(scriptReply.getResponse());
                            if (responseData.RECORD_DATA.STATUS.SUCCESS_INDICATOR === 1) {
                                removeRequestBtn.setDisabled(false);
                                removeRequestRoot.css("cursor", "default");
                                medsCompObj.InsertData();
                                // Set the side panel showing indicator to false once the table is refreshed.
                                medsCompObj.m_sidePanelShowing = false;
                            } else {
                                CERN_HOME_MEDS_O2.displayRemoveRequestErrorBanner(medsCompObj);
                                removeRequestBtn.setDisabled(false);
                                removeRequestRoot.css("cursor", "default");
                            }
                        } catch (error) {
                            CERN_HOME_MEDS_O2.displayRemoveRequestErrorBanner(medsCompObj);
                            removeRequestBtn.setDisabled(false);
                            removeRequestRoot.css("cursor", "default");
                        }
                    });
                    scriptRequest.performRequest();
                } catch (err) {
                    CERN_HOME_MEDS_O2.displayRemoveRequestErrorBanner(medsCompObj);
                    removeRequestBtn.setDisabled(false);
                    removeRequestRoot.css("cursor", "default");
                }
            });
            // Render the remove request button.
            sidePanel.setActionsAsHTML(removeRequestBtn.render());
            removeRequestBtn.attachEvents();
        },
        /**
         * Resets the table row highlights and icons
         * @param {Object} component The Home Meds O2 component
         * @param {Array} selectedRows The currently highlighted rows that need to be adjusted
         * @returns {undefined} undefined
         */
        removeCurrentHighlightedRows: function(component, selectedRows) {
            var selectedRowsLength = selectedRows.length;
            for (var j = 0; j < selectedRowsLength; j++) {

                if (Util.Style.ccss(selectedRows[j], "hml2-med-selected")) {
                    Util.Style.rcss(selectedRows[j], "hml2-med-selected");
                    var formularyEle = $(selectedRows[j]).find('.hml2-formulary');

                    if ($(formularyEle).hasClass('hml2-wb')) {
                        $(formularyEle).removeClass('hml2-wb');
                    }

                    Util.Style.rcss(selectedRows[j], "hml2-wb");
                    //reset last row selected on deselect
                    component.m_medModObj.lastMedSel = null;
                }
            }
            var rootMedSecCont = component.getSectionContentNode();
            var rnwdLen = Util.Style.g('hml2-rnwd', rootMedSecCont, "dl").length;
            var cncldLen = Util.Style.g('hml2-cncld', rootMedSecCont, "dl").length;
            var cmpltLen = Util.Style.g('hml2-cmplt', rootMedSecCont, "dl").length;
            if (rnwdLen === 0 && cncldLen === 0 && cmpltLen === 0) {
                component.setEditMode(false);
            }
            if (component.inMillennium && component.isMedModInd()) {
                CERN_HOME_MEDS_O2.disableActions(component);
            }

        },

        /**
         * To display a spinner while component loads.
         * function
         * memberof CERN_HOME_MEDS_O2
         * name ShowLoadingImage
         * @param {number} compId : Component ID
         * @returns {undefined} undefined
         * This function handles the logic to display a loading image on the content body when the backend script is running
         */
        ShowLoadingImage: function(compId) {
            var dialog = _g('hml2-loading' + compId);
            dialog.innerHTML += "<div id='loadingimage" + compId + "' class='hml2-comm-loading'>&nbsp;</div>";
            //displaying a loading image.
            var loadingImage = _g('loadingimage' + compId);
            if (dialog.style.display === 'block') {
                dialog.style.display = 'none';
            } else {
                loadingImage.style.height = $('#hml2Content' + compId).height() + 'px';
                dialog.style.display = 'block';
            }
        },
        /**
         * This function processes the external healthe intent data to check if
         * all the required attributes for display are present.
         * 
         * @param {object} component  - homemeds component object on which we want to display healthe data
         */
        processExtDataForRender: function(component) {
            var hasExtDataProcessedSuccessfully = false;
            try {
                component.externalHomeMed = JSON.parse(component.getAllData().HTTPREPLY.BODY);
                if (component.externalHomeMed.groups.length === 0) {
                    return hasExtDataProcessedSuccessfully;
                }
                for (var i = 0; i < component.externalHomeMed.groups.length; i++) {
                    component.externalHomeMed.groups[i].MED_NAME = "--";
                    component.externalHomeMed.groups[i].DOSE = "";
                    component.externalHomeMed.groups[i].START_DATE = "--";
                    component.externalHomeMed.groups[i].COMMENTS = "--";
                    component.externalHomeMed.groups[i].PROVIDER = "--";
                    component.externalHomeMed.groups[i].STOP_DATE = null;
                    component.externalHomeMed.groups[i].STATUS = "--";

                    if (component.externalHomeMed.groups[i].most_recent_medication) {

                        component.externalHomeMed.groups[i].DOSE = component.externalHomeMed.groups[i].most_recent_medication["dose"];
                        var medName = component.externalHomeMed.groups[i]["name"];
                        if (medName) {
                            component.externalHomeMed.groups[i].MED_NAME = medName;
                        }
                        var parsedStartDtString = component.externalHomeMed.groups[i].most_recent_medication["start_datetime"];
                        var startDate = null;
                        if (parsedStartDtString) {
                            startDate = new Date();
                            startDate.setISO8601(parsedStartDtString);
                            var df = CERN_HOME_MEDS_O2.getDateFormatter();
                            component.externalHomeMed.groups[i].START_DATE = df.format(startDate,
                                mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
                        }

                        var parsedStopDtString = component.externalHomeMed.groups[i].most_recent_medication["stop_datetime"];
                        var stopDate = null;
                        var today = new Date();
                        if (parsedStopDtString) {
                            stopDate = new Date();
                            stopDate.setISO8601(parsedStopDtString);
                            var df = CERN_HOME_MEDS_O2.getDateFormatter();
                            component.externalHomeMed.groups[i].STOP_DATE = df.format(stopDate,
                                mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);

                            if (!startDate || (startDate.getTime() > today.getTime()) || (stopDate && stopDate.getTime() < today.getTime())) {
                                component.externalHomeMed.groups[i].STATUS = i18n.discernabu.homemeds_o2.STATUSINACTIVE;
                            } else {
                                component.externalHomeMed.groups[i].STATUS = i18n.discernabu.homemeds_o2.STATUSACTIVE;
                            }
                        } else {
                            if (startDate && (startDate.getTime() <= today.getTime())) {
                                component.externalHomeMed.groups[i].STATUS = i18n.discernabu.homemeds_o2.STATUSACTIVE;
                            } else {
                                component.externalHomeMed.groups[i].STATUS = i18n.discernabu.homemeds_o2.STATUSINACTIVE;
                            }
                        }

                        var comments = component.externalHomeMed.groups[i].most_recent_medication["comments"];
                        if (comments != null && comments.length > 0) {
                            var commentsText = [];
                            for (var ind = 0; ind < comments.length; ind++) {
                                commentsText[ind] = comments[ind].text;
                            }
                            component.externalHomeMed.groups[i].COMMENTS = commentsText;
                        }

                        var provider = component.externalHomeMed.groups[i].most_recent_medication["prescribing_provider_name"];
                        if (provider) {
                            component.externalHomeMed.groups[i].PROVIDER = provider;
                        }
                    }

                }
                hasExtDataProcessedSuccessfully = true;
                return hasExtDataProcessedSuccessfully;
            } catch (err) {
                return hasExtDataProcessedSuccessfully;
            }
        },


        /**
         * Display healthe intent data
         * 
         * @param {object} component  - home med component object on which we want to display healthe data
         * @returns {undefined} undefined
         */
        showHIData: function(component) {
            var compId = component.getComponentId();
            var externalDataDiv = $("#hml2" + compId + "externaldata");
            var pagerContainer = $("#pager" + compId);
            externalDataDiv.add(pagerContainer).wrapAll("<div class='hml2-externaldata-container'></div>");
            var imgUrl = "<span><img height='22' width='22' class='hml2-ext-img' id='externalDataImg' src= '" + component.getCriterion().static_content + "/images/6965.png" + "'></span>";
            var label = "<p id = 'externalDataLabel'>" + imgUrl + "<span class='hml2-ext-dt-label'>" + i18n.discernabu.homemeds_o2.OUTSIDE_RECORDS + "</span></p></br>";
            $("#hiAddDataContainer" + compId).html(label).removeClass("hml2-hi-ext-label");
            component.m_externalDataTable = new ComponentTable();
            component.m_externalDataTable.setNamespace("hiDataHomeMedication" + compId);

            var medication = new TableColumn();
            medication.setColumnId("Medication");
            medication.setCustomClass("hml2-ext-name");
            medication.setColumnDisplay(i18n.discernabu.homemeds_o2.MEDICATION);
            medication.setPrimarySortField("MED_NAME");
            medication.setIsSortable(true);
            medication.setRenderTemplate("<span>${MED_NAME}</span>&nbsp;<span class='hml2-sig detail-line'>${DOSE}</span>");

            var startDate = new TableColumn();
            startDate.setColumnId("StartDate");
            startDate.setCustomClass("hml2-ext-start-date");
            startDate.setColumnDisplay(i18n.discernabu.homemeds_o2.START_DATE);
            startDate.setPrimarySortField("START_DATE");
            startDate.setIsSortable(true);
            startDate.setRenderTemplate("<span>${START_DATE}</span>");

            var comments = new TableColumn();
            comments.setColumnId("Comments");
            comments.setCustomClass("hml2-ext-comments");
            comments.setColumnDisplay(i18n.discernabu.homemeds_o2.COMMENTS);
            comments.setPrimarySortField("COMMENTS");
            comments.setIsSortable(true);
            comments.setRenderTemplate("<span>${COMMENTS}</span>");

            var provider = new TableColumn();
            provider.setColumnId("Provider");
            provider.setCustomClass("hml2-ext-provider");
            provider.setColumnDisplay(i18n.discernabu.homemeds_o2.PROVIDER);
            provider.setPrimarySortField("PROVIDER");
            provider.setIsSortable(true);
            provider.setRenderTemplate("<span>${PROVIDER}</span>");


            component.m_externalDataTable.addColumn(medication);
            component.m_externalDataTable.addColumn(startDate);
            component.m_externalDataTable.addColumn(comments);
            component.m_externalDataTable.addColumn(provider);

            // Create the hover extension.
            var hoverExtension = new TableRowHoverExtension();
            hoverExtension.setHoverRenderer(function(data) {
                var source = "--";
                if (data.RESULT_DATA.most_recent_medication && data.RESULT_DATA.most_recent_medication.source && data.RESULT_DATA.most_recent_medication.source.partition_description && data.RESULT_DATA.most_recent_medication.source.type) {
                    source = data.RESULT_DATA.most_recent_medication.source.partition_description + " (" + data.RESULT_DATA.most_recent_medication.source.type + ")";
                }
                var result = ['<h4 class="det-hd"><span></span></h4>',
                    '<dl class="hml2-hover">',
                    '<dt><span>' + i18n.discernabu.homemeds_o2.SOURCE + '</span></dt>',
                    '<dd><span>' + source + '</span></dd>',
                    '<dt><span>' + i18n.discernabu.homemeds_o2.STATUS + '</span></dt>',
                    '<dd><span>' + data.RESULT_DATA.STATUS + '</span></dd>',
                    '</dl>'
                ].join("");
                return result;
            });

            // Add the extension.
            component.m_externalDataTable.addExtension(hoverExtension);
            component.m_externalDataTable.bindData(component.externalHomeMed.groups);
            label = component.m_externalDataTable.render();
            externalDataDiv.append(label);

            if (component.externalHomeMed.total_results != null && component.externalHomeMed.total_results > 20) {
                var noOfPages = Math.ceil(component.externalHomeMed.total_results / 20);
                var lastPageNo = 0;
                component.pager = new MPageUI.Pager().setNumberPages(noOfPages).setCurrentPageLabelPattern("${currentPage}/${numberPages}").setNextLabel(i18n.discernabu.homemeds_o2.NEXT).setPreviousLabel(i18n.discernabu.homemeds_o2.PREVIOUS);
                component.pager.setOnPageChangeCallback(function() {
                    if (lastPageNo < arguments[0].currentPage) {
                        component.pageIndex = component.pageIndex + 20;
                        component.m_millDataInd = 0;
                        MP_Util.LoadSpinner("hiDataHomeMedication" + compId + "table");
                        CERN_HOME_MEDS_O2.GetHomeMedications(component);
                        lastPageNo = arguments[0].currentPage;

                    } else {
                        component.pageIndex = component.pageIndex - 20;
                        component.m_millDataInd = 0;
                        MP_Util.LoadSpinner("hiDataHomeMedication" + compId + "table");
                        CERN_HOME_MEDS_O2.GetHomeMedications(component);
                        lastPageNo = arguments[0].currentPage;
                    }
                });
                pagerContainer.addClass('hml2-row-pager').append(component.pager.render());
                //Once the pager is available on the DOM, attach the events
                component.pager.attachEvents();
            }
            component.m_externalDataTable.finalize();
            component.resizeComponent();
        },

        /**
         * The following will apply a drug class grouping sort on the drugs displayed in the component.
         *
         * @param {object} recordData  - The list of all of the drugs which includes the drug class[es] that the drug resides in.
         * @param {object} sortCriteria  - The hierarchical list of the drug class grouping which the drugs will be sorted by.
         * @param {object} component - The component that is being sorted.
         * @returns {object} recordData - The list of all of the drugs.
         */
        sortByDropdownValue: function(recordData, sortCriteria, component) {

            var multumArray = [];
            var nonMultumArray = [];
            var homeMedsi18n = i18n.discernabu.homemeds_o2;
            var sortSequenceLength = sortCriteria.length;
            var homeMedOrders = recordData.ORDERS;
            var homeMedOrderCount = homeMedOrders.length;
            var homeMedOrderIndex = homeMedOrderCount;
            //Classification to Multum and Non Multum of Medications
            while (homeMedOrderIndex--) {
                var order = homeMedOrders[homeMedOrderIndex];
                var orderMedInfo = order.MEDICATION_INFORMATION;
                if (orderMedInfo.MULTUM_CATEGORY_IDS.length) {
                    multumArray.push(order);
                } else {
                    nonMultumArray.push(order);
                }
            }

            if (homeMedOrderCount && sortSequenceLength) {
                var sortedMultumArray = [];
                //Loops through all of the drug classes defined in the grouping set in Bedrock
                for (var seqIndex = sortSequenceLength; seqIndex--;) {
                    var currDrugClassId = sortCriteria[seqIndex];
                    var multumArrIndex = multumArray.length;
                    var likeMultumArr = [];
                    var likeMultumCount = 0;
                    while (multumArrIndex--) {
                        var multOrder = multumArray[multumArrIndex];
                        var multumCategoryObjArr = multOrder.MEDICATION_INFORMATION.MULTUM_CATEGORY_IDS;
                        var categoryObjArrIndex = multumCategoryObjArr.length;
                        var multumCategoryIdsArr = [];
                        while (categoryObjArrIndex--) {
                            multumCategoryIdsArr.push(multumCategoryObjArr[categoryObjArrIndex].MULTUM_CATEGORY_ID);
                        }
                        var seqMatchFound = multumCategoryIdsArr.indexOf(currDrugClassId);
                        if (seqMatchFound !== -1) {
                            likeMultumArr.push(multOrder);
                            likeMultumCount = likeMultumCount + 1;
                        }
                    }
                    if (likeMultumCount >= 1) {
                        likeMultumArr.sort(CERN_HOME_MEDS_O2.SortByMedicationName);
                    }
                    var likeMultumArrLength = likeMultumArr.length;
                    //Same Medication belonging to different Drug classes is considered duplicate and showed once.
                    for (var multumIndex = 0; multumIndex < likeMultumArrLength; multumIndex++) {

                        if ($.inArray(likeMultumArr[multumIndex], sortedMultumArray) === -1) {

                            sortedMultumArray.push(likeMultumArr[multumIndex]);
                        }
                    }

                }
                nonMultumArray.sort(CERN_HOME_MEDS_O2.SortByMedicationName);
                var nonMultumArrayLength = nonMultumArray.length;
                for (var nonMultumArrayIndex = 0; nonMultumArrayIndex < nonMultumArrayLength; nonMultumArrayIndex++) {
                    sortedMultumArray.push(nonMultumArray[nonMultumArrayIndex]);
                }
                recordData.ORDERS = sortedMultumArray;

            } else {
                //Sorts Medications alphabetically both Multum and Non-Multum when no filters exists from BedRock
                nonMultumArray.sort(CERN_HOME_MEDS_O2.SortByMedicationName);
                multumArray.sort(CERN_HOME_MEDS_O2.SortByMedicationName);

                var nonMultumCount = nonMultumArray.length;
                for (var sortIndex = 0; sortIndex < nonMultumCount; sortIndex++) {
                    multumArray.push(nonMultumArray[sortIndex]);
                }
                recordData.ORDERS = multumArray;
            }
            return recordData;
        },

        getComplianceInfo: function(compliance, personnelArray) {

            var ar = [];
            var lastDocDate = "",
                lastDocBy = "",
                msg = "";
            var hmI18n = i18n.discernabu.homemeds_o2;

            if (compliance.NO_KNOWN_HOME_MEDS_IND === 0 && compliance.UNABLE_TO_OBTAIN_IND === 0) {
                return;
            }

            if (compliance.NO_KNOWN_HOME_MEDS_IND == 1) {
                msg = hmI18n.NO_KNOWN_HOME_MEDS;
            } else if (compliance.UNABLE_TO_OBTAIN_IND == 1) {
                msg = hmI18n.UNABLE_TO_OBTAIN_MED_HIST;
            }
            if (compliance.PERFORMED_PRSNL_ID > 0) {
                var provider = MP_Util.GetValueFromArray(compliance.PERFORMED_PRSNL_ID, personnelArray);
                lastDocBy = provider.fullName;
            }
            if (compliance.PERFORMED_DATE !== "") {
                var dateTime = new Date();
                dateTime.setISO8601(compliance.PERFORMED_DATE);
                var df = CERN_HOME_MEDS_O2.getDateFormatter();
                lastDocDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
            }
            ar.push("<dl class='hml2-info'><dd><span class='important-icon'> </span><span>", msg, "</span></dd></dl><h4 class='det-hd'><span>", hmI18n.MED_DETAIL, "</span></h4>", "<div class='hvr'><dl class='hml2-det'>", "<dt><span>", hmI18n.LAST_DOC_DT_TM, ":</span></dt><dd class='hml2-det-name'><span>", lastDocDate, "</span></dd><dt><span>", i18n.discernabu.homemeds_o2.LAST_DOC_BY, ":</span></dt><dd class='hml2-det-dt'><span>", lastDocBy, "</span></dd></dl></div>");
            return ar.join("");
        },

        SortByMedicationName: function(a, b) {
            var aName = CERN_HOME_MEDS_O2.getMedicationDisplayName(a);
            var bName = CERN_HOME_MEDS_O2.getMedicationDisplayName(b);
            var aUpper = (aName !== null) ? aName.toUpperCase() : "";
            var bUpper = (bName !== null) ? bName.toUpperCase() : "";

            if (aUpper > bUpper) {
                return 1;
            } else {
                if (aUpper < bUpper) {
                    return -1;
                }
                return 0;
            }
        },

        getMedicationDisplayName: function(order) {
            var medName = "";
            if (order.DISPLAYS !== null) {
                medName = order.DISPLAYS.DISPLAY_NAME;
            }
            return (medName);
        },

        getMedicationDisplayNameForHover: function(order) {
            var medName = "";
            if (order.DISPLAYS !== null) {
                medName = order.DISPLAYS.HOVER_NAME;
            }
            return (medName);
        },

        getHomeMedicationType: function(order) {
            if (order.MEDICATION_INFORMATION.ORIGINALLY_ORDERED_AS_TYPE.PRESCRIPTION_IND !== "" && order.MEDICATION_INFORMATION.ORIGINALLY_ORDERED_AS_TYPE.PRESCRIPTION_IND == 1) {
                return i18n.discernabu.homemeds_o2.PRESCRIBED;
            } else if (order.MEDICATION_INFORMATION.ORIGINALLY_ORDERED_AS_TYPE.DOCUMENTED_IND !== "" && order.MEDICATION_INFORMATION.ORIGINALLY_ORDERED_AS_TYPE.DOCUMENTED_IND == 1) {
                return i18n.discernabu.homemeds_o2.DOCUMENTED;
            } else {
                return "";
            }
        },

        getDateFormatter: function() {
            if (m_df === null) {
                m_df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
            }
            return m_df;
        },

        getRouteJSON: function(component) {
            try {
                MP_Util.LogDiscernInfo(component, "POWERORDERS", "homemedications-o2.js", "getRouteJSON");
                var PowerOrdersMPageUtils = window.external.DiscernObjectFactory("POWERORDERS");
                var criterion = component.getCriterion();
                var m_dPersonId = criterion.person_id;
                var m_dEncounterId = criterion.encntr_id;
                var m_hMOEW = PowerOrdersMPageUtils.CreateMOEW(m_dPersonId, m_dEncounterId, 0, 2, 127);
                var m_routeListJSON = PowerOrdersMPageUtils.GetConsolidatedRoutingOptions(m_hMOEW, component.m_medModObj.catCodeList);
                if (m_routeListJSON) {
                    component.m_medModObj.jsonRoutes = JSON.parse(m_routeListJSON);
                }
                PowerOrdersMPageUtils.DestroyMOEW(m_hMOEW);
            } catch (err) {
                MP_Util.LogJSError(err, component, "homemedications-o2.js", "getRouteJSON");
                alert(i18n.discernabu.homemeds_o2.ROUTE_LIST_ERROR + ": " + err.description);
            }
        },

        /**
         * Format numeric values for local display and api use
         * @param {string} inVal : Value to be formatted
         * @return {array}  : Array containing local display value and api value
         */
        formatDispQ: function(inVal) {
            var nf = new mp_formatter.NumericFormatter(MPAGE_LOCALE);
            var decSep = nf.lc.decimal_point;
            var thouSep = nf.lc.thousands_sep;
            var decPos = inVal.lastIndexOf(decSep);
            var thouPos = inVal.lastIndexOf(thouSep);

            var intSec = '';
            var decSec = '';
            var numArr = inVal.split(decSep);
            var localDispStr;
            var apiVal;
            var intParts;

            if (numArr.length === 2 && decPos > thouPos) {
                intParts = numArr[0].split(thouSep);
                numArr[0] = intParts.join("");
                if (!isNaN(numArr[0]) && !isNaN(numArr[1])) {
                    intSec = numArr[0];
                    decSec = numArr[1];
                } else {
                    return [null, null];
                }

            } else if (numArr.length === 1) {
                intParts = numArr[0].split(thouSep);
                numArr[0] = intParts.join("");
                if (!isNaN(numArr[0])) {
                    intSec = numArr[0];
                } else {
                    return [null, null];
                }
            } else {
                return [null, null];
            }
            if (decSec) {
                localDispStr = intSec + decSep + decSec;
                apiVal = intSec + "." + decSec;
            } else {
                localDispStr = intSec;
                apiVal = intSec;
            }

            return [localDispStr, apiVal];
        },
        /**
         * getRowContentType checks whether is for a prescribed medication or patient request
         * @param  {Object} tableRow a component table dl DOM element
         * @return {String} the content type of a row  PRESCRIBED  or REQUEST
         */
        getRowContentType: function(tableRow) {
            var rowInfoDiv = Util.Style.g('hml2-info', tableRow, 'span')[0];
            var patRequestInd = rowInfoDiv.getAttribute("data-pat-request-ind");
            //if data-pat-request-ind attribute is set, the row is for a patient request
            return (parseInt(patRequestInd, 10)) ? "REQUEST" : "PRESCRIBED";
        },

        medRowSel: function(e) {
            var parentContSec = $(this).closest(".sec-content");
            var idFromContSec = parseInt(parentContSec.attr('id').replace('hml2Content', ''), 10);
            var medComp = MP_Util.GetCompObjById(idFromContSec);
            var isMedModInd = medComp.isMedModInd();
            var compNS = medComp.getStyles().getNameSpace();
            medComp.setEditMode(true);
            var medCompId = medComp.getComponentId();
            var rootMedSecCont = medComp.getSectionContentNode();
            //get the rows already selected
            var previousSelectedRows = Util.Style.g("hml2-med-selected", rootMedSecCont, "dl");
            var currentRowType = CERN_HOME_MEDS_O2.getRowContentType(this);
            var previousRowType = "";
            var curImg = null;
            var curSrc = null;
            var newSrc = null;
            var i = 0;
            var j = 0;

            if (!e) {
                e = window.event;
            }
            // If a row has been selected get the row Type of the medication else set the default to REQUEST
            var startRowType = "REQUEST";
            if (medComp.m_medModObj.lastMedSel) {
                startRowType = CERN_HOME_MEDS_O2.getRowContentType($("#" + medComp.m_medModObj.lastMedSel.replace(/:/g, "\\:"))[0]);
            }
            //allow multi select if shift key pressed for Other Chart Meds Only
            if (e.shiftKey && medComp.m_medModObj.lastMedSel && startRowType !== "REQUEST") {
                //Prevent multiselection for patient requests
                if (startRowType !== "REQUEST" && currentRowType !== "REQUEST") {
                var startPos = _g(medComp.m_medModObj.lastMedSel);
                var strtIndx;
                var endIndx;
                var componentTableElt = Util.Style.g("component-table", rootMedSecCont, "div")[0];
                var medRows = Util.Style.g("result-info", componentTableElt, 'dl');
                var medLen = medRows.length;

                //get start and end position of multi select
                for (i = 0; i < medLen; i++) {
                    var curId = medRows[i].id;
                    if (curId == medComp.m_medModObj.lastMedSel) {
                        strtIndx = i;
                    } else if (curId == this.id) {
                        endIndx = i;
                    }
                }
                //flip positions for multi select up
                if (strtIndx > endIndx) {
                    var tempIndx = strtIndx;
                    strtIndx = endIndx;
                    endIndx = tempIndx;
                }

                for (j = strtIndx; j <= endIndx; j++) {
                    Util.Style.acss(medRows[j], "hml2-med-selected");
                    CERN_HOME_MEDS_O2.addBackGroundToSelectedRow(this, compNS);
                    }
                }
                //reset last med row selected
                medComp.m_medModObj.lastMedSel = null;
            } else {
                if (Util.Style.ccss(this, "hml2-med-selected")) {
                    Util.Style.rcss(this, "hml2-med-selected");
                    var formularyEle = $(this).find('.hml2-formulary');
                    if ($(formularyEle).hasClass('hml2-wb')) {
                        $(formularyEle).removeClass('hml2-wb');
                    }
                    Util.Style.rcss(this, "hml2-wb");
                    //reset last row selected on deselect
                    medComp.m_medModObj.lastMedSel = null;
                } else {
                    //check whether the selected row is for a patient request
                    //disable multi-selection for patient requests
                    if (currentRowType === "REQUEST") {
                        CERN_HOME_MEDS_O2.removeCurrentHighlightedRows(medComp, previousSelectedRows);
                    } else {
                        //check whether any rows are already selected
                        if (previousSelectedRows.length) {
                            //get the type of the already selected rows
                            previousRowType = CERN_HOME_MEDS_O2.getRowContentType(previousSelectedRows[0]);

                            //prevent from selecting patient requests and prescribed meds at the same time
                            if (previousRowType === "REQUEST") {
                                CERN_HOME_MEDS_O2.removeCurrentHighlightedRows(medComp, previousSelectedRows);
                                medComp.m_sidePanel.m_cornerCloseButton.click();
                            }
                        }
                    }

                    // grab the hovered table rows and toggle the cell hover off
                    var componentTable = $("#hml2" + medCompId + "tableBody");
                    componentTable.find(".mpage-tooltip-hover").each(function() {
                        var childCell = $(this).children().first();
                        CERN_HOME_MEDS_O2.toggleTableCellHover(medComp, false, childCell);
                    });


                    Util.Style.acss(this, "hml2-med-selected");
                    CERN_HOME_MEDS_O2.addBackGroundToSelectedRow(this, compNS);
                    //set last row selected for multi select
                    medComp.m_medModObj.lastMedSel = this.id;
                }
            }
            var selectedRows = Util.Style.g("hml2-med-selected", rootMedSecCont, "dl");
            var selectLen = selectedRows.length;

            if (selectLen > 0) {
                //refresh hovers when not in edit mode
                if (selectLen == 1 && !medComp.m_medModObj.m_editMode) {
                    var hml2Dets = Util.Style.g('hvr');
                    var detLen = hml2Dets.length;
                    for (i = detLen; i--;) {
                        hml2Dets[i].style.display = 'none';
                    }

                }

                medComp.setEditMode(true);

                // Actions should remain disabled when a patient request is selected
                if (medComp.inMillennium && currentRowType !== "REQUEST" && isMedModInd) {
                    CERN_HOME_MEDS_O2.enableActions(medComp);
                }

                //verify whether reset should disabled
                var activeRowsFound = false;
                for (j = 0; j < selectLen; j++) {
                    if (Util.Style.ccss(selectedRows[j], "hml2-rnwd") || Util.Style.ccss(selectedRows[j], "hml2-cncld") || Util.Style.ccss(selectedRows[j], "hml2-cmplt")) {
                        activeRowsFound = true;
                    }
                }
                //disable reset when no order is in renew, cancel or complete mode
                if (!activeRowsFound && isMedModInd) {
                    medComp.compMenuReference["compMenuReset" + medCompId].setIsDisabled(true);
                }

            } else {
                var rnwdLen = Util.Style.g('hml2-rnwd', rootMedSecCont, "dl").length;
                var cncldLen = Util.Style.g('hml2-cncld', rootMedSecCont, "dl").length;
                var cmpltLen = Util.Style.g('hml2-cmplt', rootMedSecCont, "dl").length;
                if (rnwdLen === 0 && cncldLen === 0 && cmpltLen === 0) {
                    medComp.setEditMode(false);
                }
                if (medComp.inMillennium && isMedModInd) {
                    CERN_HOME_MEDS_O2.disableActions(medComp);
                }
            }
            //call show/hide panel
            CERN_HOME_MEDS_O2.showHidePanel(selectedRows, medComp);
        },

        /**
         * Shows or hides the panel based on how many/which rows are selected. If multiple rows are selected, a different panel will
         * display saying there are multiple results selected. If only one row is selected, the panel will display that rows data.
         * @param {Array} selectedRows An array that has all the currently selected rows in the component
         * @param {Object} medsCompObj The home medications component object
         * @returns {undefined} undefined
         */
        showHidePanel: function(selectedRows, medsCompObj) {
            var numSelectedRows = selectedRows.length;
            var sidePanel = medsCompObj.m_sidePanel;
            var compId = medsCompObj.m_componentId;
            //Since the side panel will only display for patient requests there will never be more than one row selected
            var rowType = CERN_HOME_MEDS_O2.getRowContentType(selectedRows[0]);
            if (numSelectedRows === 0) {
                //close panel
                sidePanel.m_cornerCloseButton.click();
                return;
            }

            // Check to see if an error banner is displaying if so remove it
            var $container = $("#sidePanelAlertBanner" + compId);
            $container.find(".alert-msg").remove();
            //if the side panel is not showing, then adjust the display
            if (!medsCompObj.m_sidePanelShowing && rowType === "REQUEST") {
                var sidePanelContainer = _g('hml2' + compId + 'sidePanelContainer');
                var tableObj = _g('hml2' + compId + 'table');
                var footerObj = $("#hml2Ftr" + compId);

                //shrink the table and show the panel
                if (tableObj.classList) {
                    tableObj.classList.add("hml2-table-with-panel");
                } else {
                    tableObj.className += " " + "hml2-table-with-panel";
                }

                //shrink the footer to cover 60%
                footerObj.addClass("hml2-footer-with-panel");

                //get the latest height of table
                var tableHeight = tableObj.offsetHeight;
                var footerHeight = footerObj.outerHeight();

                //set the panel to the shrunk table height
                sidePanel.setHeight(tableHeight + "px");
                sidePanel.setMinHeight(tableHeight + "px");

                //call the side panels resize function with current max height
                sidePanel.resizePanel((tableHeight + footerHeight) + "px");

                sidePanelContainer.style.display = 'inline-block';
                medsCompObj.m_sidePanelShowing = true;
                sidePanel.showPanel();
            }

            sidePanel.expandSidePanel();

            CERN_HOME_MEDS_O2.renderSingleSidePanel(selectedRows, medsCompObj);
        },

        /**
         * generate the html for the patient request section in the side panel
         * @param  {Object} order the medication object in consideration
         * @param  {Object} component the home meds component object
         * @return {String} HTML string for the side panel patient request section
         */
        buildPatRequestSection: function(order, component) {
            //Cache the interop data.
            //**NOTE as of the 5.7 release, this function will only be called when a patient request row is clicked.
            //  In this case the interop array will ALWAYS contain data. If the side panel is used for all meds in the future
            //  be sure to perform a check to ensure that the INTEROP array is not null before accessing its content.
            var interopData = order.INTEROP[0];
            var componentId = component.getComponentId();
            var codeArray = MP_Util.LoadCodeListJSON(component.allData.CODES);
            var hmI18n = i18n.discernabu.homemeds_o2;
            var patRequestHtml = "";
            var requestType = null;
            var df = CERN_HOME_MEDS_O2.getDateFormatter();
            // Get the date and time from the CCL request and format it to display as MMM DD, YYYY HH:MM
            var dateTime = new Date();
            var displayTime = "--";
            if (order.INTEROP.length && interopData.SUBMITTED_ON) {
                dateTime.setISO8601(interopData.SUBMITTED_ON);
                displayTime = dateTime.format("mediumDate") + " " + dateTime.format("militaryTime");
            }

            // Gets the Patient Enterd Comments form the CCL request
            var patientComment = order.COMMENTS.ORDER_COMMENT;
            var prescribingPhysician = (interopData.PHYSICIAN.PHYSICIAN) ? interopData.PHYSICIAN.PHYSICIAN : "--";

            // Define a variable to be used as a display header within the Outside Requests section
            // Will display either "Additions" or "Modifications"
            var sectionHeader = "";
            // Define a variable that will contain the HTML used to display information within the outside requests section
            // This information will differ depending on if the medication was added or modified
            var sectionInfo = "";
            // Exit the function if the order is not a patient request
            if (interopData.REQUEST_TYPE) {
                requestType = MP_Util.GetValueFromArray(interopData.REQUEST_TYPE, codeArray).meaning;
            } else {
                return "";
            }
            var medsHistoryLinkHTML = CERN_HOME_MEDS_O2.createMedsHistoryHTML(component, requestType, order);
            var patientCodeValue = MP_Util.GetCodeValueByMeaning("PROXY", 4003506);
            var patientProxyCodeValue = MP_Util.GetCodeValueByMeaning("PATIENT", 4003506);
            var submittedSourceCode = interopData.SUBMITTED_BY_TYPE;
            var originatingSourceDisplay = "--";
            switch (submittedSourceCode) {
                case patientCodeValue.codeValue:
                    originatingSourceDisplay = patientCodeValue.display;
                    break;
                case patientProxyCodeValue.codeValue:
                    originatingSourceDisplay = patientProxyCodeValue.display;
                    break;
            }
            var commentText = (interopData.COMMENTS.length ? interopData.COMMENTS[0].COMMENT : "--");
            var originatingAuthor = interopData.SUBMITTED_BY_NAME || "--";
            // Create HTML to display an added medication within the side panel
            if (requestType === "ADD") {
                sectionHeader = hmI18n.ADDITIONS;
                sectionInfo += '<dl>' +
                    medsHistoryLinkHTML +
                    '</dl>' +
                    '<dl class="hml2-detail-group">' +
                    '<dt class="hml2-detail-label secondary-text hml2-status-mod">' +
                    hmI18n.COMPLIANCE +
                    '</dt>' +
                    '<dd>' +
                    interopData.STATUS.STATUS_CODE.LABEL +
                    '</dd>' +
                    '</dl>' +
                    '<dl class="hml2-detail-group">' +
                    '<dt class="hml2-detail-label secondary-text hml2-status-mod">' +
                    hmI18n.PRESCRIBING_PHYSICIAN +
                    '</dt>' +
                    '<dd>' +
                    prescribingPhysician +
                    '</dd>' +
                    '</dl>' +
                    '<dl class="hml2-detail-group">' +
                    '</dl>' +
                    '<dl class="hml2-detail-group">' +
                    '<dt class="hml2-detail-label secondary-text hml2-status-mod">' +
                    hmI18n.ORIGINATING_SOURCE +
                    '</dt>' +
                    '<dd>' +
                    originatingSourceDisplay +
                    '</dd>' +
                    '</dl>' +
                    '<dl class="hml2-detail-group">' +
                    '<dt class="hml2-detail-label secondary-text hml2-status-mod">' +
                    hmI18n.ORIGINATING_AUTHOR +
                    '</dt>' +
                    '<dd>' +
                    originatingAuthor +
                    '</dd>' +
                    '</dl>' +
                    '<dl>' +
                    '<dt class="hml2-detail-label">' +
                    '</dt>' +
                    '<dd class="hml2-status-mod">' +
                    hmI18n.PATIENT_COMMENT +
                    '</dd>' +
                    '</dl>' +
                    '<dl>' +
                    '<dd>' +
                    commentText +
                    '</dd>' +
                    '</dl>';
            }

            // Create HTML to display a modified medication within the side panel
            else if (requestType === "UPDATE") {
                sectionHeader = hmI18n.MODIFICATIONS;
                //Create the HTML for the med modifications within the oustide requests section of the side panel
                sectionInfo += CERN_HOME_MEDS_O2.createMedsHistoryHTML(component, requestType, order);

                sectionInfo += '<dl class="hml2-detail-group">' +
                    '<dt class="hml2-detail-label secondary-text hml2-status-mod">' +
                    hmI18n.ORIGINATING_SOURCE +
                    '</dt>' +
                    '<dd>' +
                    originatingSourceDisplay +
                    '</dd>' +
                    '</dl>' +
                    '<dl class="hml2-detail-group">' +
                    '<dt class="hml2-detail-label secondary-text hml2-status-mod">' +
                    hmI18n.ORIGINATING_AUTHOR +
                    '</dt>' +
                    '<dd>' +
                    originatingAuthor +
                    '</dd>' +
                    '</dl>' +
                    '<dl>' +
                    '<dt class="hml2-detail-label">' +
                    '</dt>' +
                    '<dd class="hml2-status-mod">' +
                    hmI18n.PATIENT_COMMENT +
                    '</dd>' +
                    '</dl>' +
                    '<dl>' +
                    '<dd>' +
                    commentText +
                    '</dd>' +
                    '</dl>';
            }

            // HTML template used to populate the side panel for added and modified medications.
            patRequestHtml += '<div id="patRe" class="hml2-detail-section sp-body-contents-padding">' +
                '<dl>' +
                '<dt class="hml2-detail-label secondary-text hlm2-expand-content-section">' +
                '<span class="hml2-side-panel-tgl hml2-hide-expand-btn" title="Collapse">' +
                '-' +
                '</span>' +
                '<span class="hml2-pat-req-icon">' +
                '&nbsp;' +
                '</span>' +
                '<span>' +
                hmI18n.OUTSIDE_REQUESTS +
                '</span>' +
                '<span class="hml2-detail-group hml2-pull-right">' +
                displayTime + // MMM DD, YYYY HH:MM
                '</span>' +
                '</dt>' +
                '</dl>' +
                '<div class="hml2-expand-content">' +
                '<dl>' +
                '<dt class="hml2-detail-label">' +
                '</dt>' +
                '<dd class="hml2-status-mod">' +
                sectionHeader + // Either "Additions" or "Modifications"
                '</dd>' +
                '</dl>' +
                '<div>' +
                sectionInfo + // Information pertaining to the medication and request type
                '</div>' +
                '</div>' +
                '</div>';

            // Append the horizontal separator at the end of the outside requests section
            if (requestType === "UPDATE") {
                patRequestHtml += '<div class="sp-separator2">&nbsp;</div>';
            }
            return patRequestHtml;
        },


        /**
         * Parses the orders list into two lists, patient requests and other chart meds
         * @param {Array} Orders list containing all of the medications to parse through
         * @param {Object} HomeMeds component object
         */
        setMedicationRows: function(orders, component) {
            var medCount = orders.length;
            component.m_patientRequestList = [];
            component.m_otherCharMedsList = [];
            // iterate over all medications
            for (var i = 0; i < medCount; i++) {
                var medOrder = orders[i];
                // if the medication is a patient request
                if (medOrder.INTEROP.length) {
                    component.m_patientRequestList.push(medOrder);
                }
                // the medication is a standard chart medication
                else {
                    component.m_otherCharMedsList.push(medOrder);
                }
            }
        },

        /**
         * Builds and renders a side panel for the single selected row.
         * @param {Array} selectedRow An array that has the currently selected row in the component
         * @param {Object} medsCompObj The home medications component object
         * @returns {undefined} undefined
         */
        renderSingleSidePanel: function(selectedRow, medsCompObj) {
            var orders = [];
            var sidePanel = medsCompObj.m_sidePanel;
            var compId = medsCompObj.m_componentId;
            var hmI18n = medsCompObj.m_home_meds_i18n;
            var df = CERN_HOME_MEDS_O2.getDateFormatter();
            var codeArray = MP_Util.LoadCodeListJSON(medsCompObj.allData.CODES);
            var personnelArray = MP_Util.LoadPersonelListJSON(medsCompObj.allData.PRSNL);
            var rowOrderInfo = {};
            //find the selected row information from the tag with the hml2-info class
            var selectedRowInfo = Util.Style.g('hml2-info', selectedRow[0], 'span')[0];
            var rowType = CERN_HOME_MEDS_O2.getRowContentType(selectedRow[0]);
            orders = medsCompObj.getAllOrders();
            var orderId = selectedRowInfo.getAttribute("data-order-id");
            var extDataId = selectedRowInfo.getAttribute("ext-data-info-id");
            var patRequestSectionHTML = "";
            //check whether the selected med is a patient request or not
            if (rowType === "REQUEST") {
                orders = medsCompObj.m_patientRequestList;
            } else {
                orders = medsCompObj.m_otherCharMedsList;
            }
            //get row order information for order id selected
            if (orderId != 0) {
            for (var x = 0; x < orders.length; x++) {
                if (orderId == orders[x].CORE.ORDER_ID) {
                    rowOrderInfo = orders[x];
                    break;
                    }
                }
            } else {
                for (var x = 0; x < orders.length; x++) {
                    if (orders[x].INTEROP.length >= 1) {
                        if (extDataId == orders[x].INTEROP[0].EXT_DATA_INFO_ID) {
                            rowOrderInfo = orders[x];
                            break;
                        }
                    }
                }
            }

            //clear and setup the details for the med order
            var lastDoseDate = "--";
            var medOrigDate = "--";
            var dateTime = new Date();
            var respProv = "--";


            if (rowOrderInfo.DETAILS.LAST_DOSE_DT_TM !== "") {
                dateTime.setISO8601(rowOrderInfo.DETAILS.LAST_DOSE_DT_TM);
                lastDoseDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
            }

            var compComment = (rowOrderInfo.DETAILS.COMPLIANCE_COMMENT) ? rowOrderInfo.DETAILS.COMPLIANCE_COMMENT : "--";

            if (rowOrderInfo.SCHEDULE.ORIG_ORDER_DT_TM !== "") {
                dateTime.setISO8601(rowOrderInfo.SCHEDULE.ORIG_ORDER_DT_TM);
                medOrigDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
            }

            if (rowOrderInfo.CORE.RESPONSIBLE_PROVIDER_ID > 0) {
                var provider = MP_Util.GetValueFromArray(rowOrderInfo.CORE.RESPONSIBLE_PROVIDER_ID, personnelArray);
                respProv = provider.fullName;
            }

            var medType = CERN_HOME_MEDS_O2.getHomeMedicationType(rowOrderInfo) || "--";

            var ordComment = (rowOrderInfo.COMMENTS.ORDER_COMMENT) ? rowOrderInfo.COMMENTS.ORDER_COMMENT.replace(/\n/g, "<br />") : "--";

            // Check if the row is a patient request.  If so create and set the HTML display used for the side panel
            if (rowType === "REQUEST") {
                patRequestSectionHTML = CERN_HOME_MEDS_O2.buildPatRequestSection(rowOrderInfo, medsCompObj);
            }
            var contentHTML = "<div id='sidePanelScrollContainer" + compId + "'>" +
                patRequestSectionHTML +
                "<div class='hml2-detail-section'>";
            var patReqType = null;
            if (rowOrderInfo.INTEROP.length) {
                patReqType = MP_Util.GetValueFromArray(rowOrderInfo.INTEROP[0].REQUEST_TYPE, codeArray).meaning;
            }
            if (patReqType === "UPDATE") {
                contentHTML +=
                    "<dl class='hml2-detail-group'>" +
                    "<dt class='hml2-detail-label secondary-text hml2-status-mod'>" + hmI18n.LAST_DOSE + "</dt>" +
                    "<dd>" + lastDoseDate + "</dd>" +
                    "</dl>" +
                    "<dl class='hml2-detail-group'>" +
                    "<dt class='hml2-detail-label secondary-text hml2-status-mod'>" + hmI18n.COMPLIANCE_COMMENT + "</dt>" +
                    "<dd>" + compComment + "</dd>" +
                    "</dl>" +
                    "</div>" +
                    "<div class='sp-separator2'>&nbsp;</div>" +
                    "<div class='hml2-detail-section'>" +
                    "<dl class='hml2-detail-group'>" +
                    "<dt class='hml2-detail-label secondary-text'>" + hmI18n.ORDER_DATE + "</dt>" +
                    "<dd>" + medOrigDate + "</dd>" +
                    "</dl>" +
                    "<dl class='hml2-detail-group'>" +
                    "<dt class='hml2-detail-label secondary-text'>" + hmI18n.RESPONSIBLE_PROVIDER + "</dt>" +
                    "<dd>" + respProv + "</dd>" +
                    "</dl>" +
                    "<dl>" +
                    "<dt class='hml2-detail-label secondary-text'>" + hmI18n.TYPE + "</dt>" +
                    "<dd>" + medType + "</dd>" +
                    "</dl>" +
                    "</div>" +
                    "</div>";
            }

            sidePanel.setTitleText(rowOrderInfo.DISPLAYS.DISPLAY_NAME);
            if (rowType === "REQUEST") {
                CERN_HOME_MEDS_O2.createRemoveRequestButton(medsCompObj, selectedRow, rowOrderInfo, sidePanel);
            }
            sidePanel.setSubtitleText(rowOrderInfo.DISPLAYS.CLINICAL_DISPLAY_LINE);
            sidePanel.setContents(contentHTML, "hml2Content" + compId);
            // Bind patient request click events
            if (rowType === "REQUEST" && (patReqType === "ADD" || "UPDATE")) {
                // Launch the Meds History on link click
                $("#sidePanelScrollContainer" + compId).on("click", ".pat-req-meds-hx-link", function() {
                    medsCompObj.m_sidePanel.m_cornerCloseButton.click();
                    CERN_HOME_MEDS_O2.launchMedsHistory(medsCompObj);
                });
            }
            var sidePanelContainer = $("#sidePanel" + compId);
            // Toggle the Expand/Collapse icon within the Outside Request section
            sidePanelContainer.on("click", ".hml2-side-panel-tgl", function(event) {
                if (event.target && event.target.parentElement.className === "hml2-detail-label secondary-text hlm2-expand-content-section") {
                    var patReqSubSection = sidePanelContainer.find(".hml2-expand-content");
                    // If Outside Requests section is collapsed
                    if (patReqSubSection.hasClass("hml2-closed")) {
                        // Expand the section
                        patReqSubSection.removeClass("hml2-closed");
                        // Show the collapse icon
                        $(this).removeClass("hml2-show-expand-btn")
                            .addClass("hml2-hide-expand-btn");
                        // Get the side panel expander accordion used to expand the entrie side panel
                        var sPanelExpander = $("#sidePanelExpandCollapse" + compId);
                        // Remove hidden class
                        sPanelExpander.removeClass("hidden");
                        // Check if the side panel is expandable, if so expand it
                        if (sPanelExpander.children().hasClass("sp-expand")) {
                            sPanelExpander.click();
                        }
                    } else {
                        // The section is expanded, so collapse it
                        patReqSubSection.addClass("hml2-closed");
                        // Show the expand icon
                        $(this).removeClass("hml2-hide-expand-btn")
                            .addClass("hml2-show-expand-btn");
                    }
                }
            });
        },

        /**
         * Creates and displys the error banner at the top of the side panel for the remove request funcitonality
         * @param  {object} component - The HomeMeds Component Object
         * @return {undefined}
         */
        displayRemoveRequestErrorBanner: function(component) {
            var sidePanel = component.m_sidePanel;
            var alertBanner = new MPageUI.AlertBanner();
            var hmI18n = component.m_home_meds_i18n;
            sidePanel.setAlertBannerAsHTML("");
            alertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
            alertBanner.setPrimaryText(hmI18n.REMOVE_REQUEST_ACTION_ERROR);
            sidePanel.setAlertBannerAsHTML(alertBanner.render());
        },
        
        /** Builds and renders a side panel for the multiple selected rows
         * @param {Array} selectedRows An array that has the currently selected row in the component
         * @param {Object} medsCompObj The home medications component object
         * @returns {undefined} undefined
         */
        renderMultiRowSidePanel: function(selectedRows, medsCompObj) {
            var sidePanel = medsCompObj.m_sidePanel;
            var compId = medsCompObj.m_componentId;
            var hmI18n = medsCompObj.m_home_meds_i18n;
            var rowCount = selectedRows.length;
            var itemsSelectedText = hmI18n.ITEMS_SELECTED.replace("{0}", rowCount);

            sidePanel.setTitleText(itemsSelectedText);
            sidePanel.removeSubtitle();
            sidePanel.setContents("<div class='sp-multiple-items-icon'>&nbsp;</div>", "hml2Content" + compId);
        },

        /**
         *  Adds white background to the formulary icons section when the row is selected
         * @param {obj} row : The current row in the component that had the formulary information displayed and would need
         * to have a white background when selected.
         * @param {obj} compNS : The namespace of the component.
         * @returns {undefined} undefined
         */
        addBackGroundToSelectedRow: function(row, compNS) {
            var formularyRow = $(row).find('.hml2-formulary');
            if ($(formularyRow).children().length) {
                var unknownRating = $(formularyRow).find('.health-plan-unknown');
                if (unknownRating.length && !$(unknownRating).text()) {
                    return;
                }
                $(formularyRow).addClass("hml2-wb");
            }
        },
        /**
         * Enable buttons and switch to active image
         * @param {obj} medComp : The Med component to enable actions in
         * @returns {undefined} undefined
         */
        enableActions: function(medComp) {
            var criterion = medComp.getCriterion();
            var ipath = criterion.static_content;
            var medCompId = medComp.m_medModObj.medModCompId;

            var compID = medComp.getComponentId();
            _g("medRnwBtn" + medCompId).disabled = false;
            _g("medCnclBtn" + medCompId).disabled = false;
            _g("medCmpltBtn" + medCompId).disabled = false;
            _g("medRnwImg" + medCompId).src = ipath + "/images/renew.gif";
            _g("medCnclImg" + medCompId).src = ipath + "/images/cancel.gif";
            _g("medCmpltImg" + medCompId).src = ipath + "/images/complete.gif";

            medComp.compMenuReference["compMenuRenew" + compID].setIsDisabled(false);
            medComp.compMenuReference["compMenuCancel" + compID].setIsDisabled(false);
            medComp.compMenuReference["compMenuComplete" + compID].setIsDisabled(false);
        },

        /**
         *Appends the target container for the AlertMessage control used to display various message related to formulary eligibility.
         * @param {num} compId : A double value representing the componentId
         * @returns {undefined} undefined
         */
        appendNoHealthPlanContainer: function(compId) {
            var component = MP_Util.GetCompObjById(compId);
            var noHealthPlanDiv = _g("hml2" + compId + "NoHealthPlans");
            if (noHealthPlanDiv) {
                return;
            }
            noHealthPlanDiv = Util.cep("div", {
                "className": "message-container",
                "id": "hml2" + compId + "NoHealthPlans"
            });
            var m_contentNode = component.getRootComponentNode();
            if (m_contentNode) {
                var m_contentNodeHd = _gbt("H2", m_contentNode)[0];
                Util.ia(noHealthPlanDiv, m_contentNodeHd);
            }
            component.m_base.setAlertMessageElementId(noHealthPlanDiv);
        },
        /**
         * Disable buttons and switch to disabled image
         * @param {obj} medComp : The Med component to disable actions in
         * @returns {undefined} undefined
         */
        disableActions: function(medComp) {
            var criterion = medComp.getCriterion();
            var ipath = criterion.static_content;
            var medCompId = medComp.m_medModObj.medModCompId;
            var compID = medComp.getComponentId();
            _g("medRnwBtn" + medCompId).disabled = true;
            _g("medCnclBtn" + medCompId).disabled = true;
            _g("medCmpltBtn" + medCompId).disabled = true;
            _g("medRnwImg" + medCompId).src = ipath + "/images/renew_disabled.gif";
            _g("medCnclImg" + medCompId).src = ipath + "/images/cancel_disabled.gif";
            _g("medCmpltImg" + medCompId).src = ipath + "/images/complete_disabled.gif";
            //disable component menu items
            medComp.compMenuReference["compMenuRenew" + compID].setIsDisabled(true);
            medComp.compMenuReference["compMenuCancel" + compID].setIsDisabled(true);
            medComp.compMenuReference["compMenuComplete" + compID].setIsDisabled(true);
            //reset disable
            medComp.compMenuReference["compMenuReset" + compID].setIsDisabled(true);
        },

        /**
         * marks row(s) with appropriate class for action to take on submit
         * @param {obj} e : The event object
         * @returns {undefined} undefined
         */
        queueOrder: function(e) {

            if (Util.Style.ccss(this, "hml2-dthrd") || Util.Style.ccss(this, "opts-menu-item-dthr")) {
                if (!e) {
                    e = window.event;
                }
                Util.cancelBubble(e);
            } else {
                var medCompId = parseInt(this.id.replace(/[^\d]/g, ""), 10);
                var medComp = MP_Util.GetCompObjById(medCompId);
                var criterion = medComp.getCriterion();
                var ipath = criterion.static_content;
                var rootMedSecCont = medComp.getSectionContentNode();
                var hmI18n = i18n.discernabu.homemeds_o2;
                var rtUid = "";

                var rType;
                if (this.id == ('medRnwBtn' + medCompId) || this.id == ('mnuRenew' + medCompId)) {
                    rType = 'hml2-rnwd';
                } else if (this.id == ('medCnclBtn' + medCompId) || this.id == ('mnuCancel' + medCompId)) {
                    rType = 'hml2-cncld';
                } else if (this.id == ('medCmpltBtn' + medCompId) || this.id == ('mnuComplete' + medCompId)) {
                    rType = 'hml2-cmplt';
                }

                //For the first renew action, get the data required
                if (rType === 'hml2-rnwd' && medComp.getInitialRenew()) {
                    //make a script call
                    var isLoadSuccess = true;
                    var componentTableElt = Util.Style.g("component-table", rootMedSecCont, "div")[0];
                    var allRows = Util.Style.g("result-info", componentTableElt, "dl");
                    var allRowsLen = allRows.length;
                    var renewOrdIdsJson = null;
                    //Replace the order id array with a json string containing order_id:synonym_id objects.
                    // This would be helpful in using the synonym_id to retrieve the cki for each medication. 
                    if (allRowsLen) {
                        renewOrdIdsJson = "{ 'RENEW_ORDER_RECORD' : {'RENEWABLE_ORDERS':[";
                        for (var rowIndx = 0; rowIndx < allRowsLen; rowIndx++) {
                            var orderInfo = Util.Style.g("hml2-info", allRows[rowIndx], "span")[0];
                            var orderId = orderInfo.getAttribute("data-order-id");
                            var synonymId = orderInfo.getAttribute("data-synonymId");

                            renewOrdIdsJson += "{'ORDER_ID':" + orderId + ".0,'SYNONYM_ID' :" + synonymId + ".0}";
                            if (rowIndx < allRowsLen - 1) {
                                renewOrdIdsJson += ",";
                            }
                        }
                        renewOrdIdsJson += "]}}";
                    }
                    var renewTimer = new RTMSTimer("USR:MPG.HOME_MEDS.O2 - renew action");
                    var renewRequest = new ScriptRequest();
                    var compBase = medComp.m_base;
                    renewRequest.setProgramName("mp_get_home_medications_renew");
                    renewRequest.setParameterArray(["^MINE^", "^" + renewOrdIdsJson + "^"]);
                    renewRequest.setAsyncIndicator(false);

                    renewRequest.setResponseHandler(function(scriptReply) {
                        var renewReply = scriptReply.getResponse();
                        if (renewReply.STATUS_DATA.STATUS === "S") {
                            var orders = renewReply.ORDERS;
                            CERN_HOME_MEDS_O2.addRenewData(medCompId, allRows, orders);
                            medComp.setInitialRenew(false);
                        } else {
                            isLoadSuccess = false;
                        }
                    });

                    renewRequest.setLoadTimer(renewTimer);
                    renewRequest.performRequest();
                    if (!isLoadSuccess) {
                        var errorModal = MP_ModalDialog.retrieveModalDialogObject("errorModal");
                        if (!errorModal) {
                            var refreshButton = null;
                            var cancelButton = null;
                            errorModal = MP_Util.generateModalDialogBody("errorModal", "error", hmI18n.RENEW_SCRIPT_ERROR, hmI18n.RENEW_SCRIPT_ERROR_ACTION);
                            errorModal.setHeaderTitle(i18n.ERROR_OCCURED);
                            //The refresh button is created and added to the footer
                            refreshButton = new ModalButton("refreshButton");
                            refreshButton.setText(i18n.REFRESH).setCloseOnClick(true);
                            refreshButton.setOnClickFunction(function() {
                                //Refreshes the component
                                medComp.InsertData();
                            });
                            errorModal.addFooterButton(refreshButton);
                            //The cancel button is created and added to the footer
                            cancelButton = new ModalButton("cancelButton");
                            cancelButton.setText(i18n.CANCEL).setCloseOnClick(true);
                            errorModal.addFooterButton(cancelButton);
                        } else {
                            // resetting the error message
                            errorModal = MP_Util.generateModalDialogBody("errorModal", "error", hmI18n.RENEW_SCRIPT_ERROR, hmI18n.RENEW_SCRIPT_ERROR_ACTION);
                        }
                        MP_ModalDialog.updateModalDialogObject(errorModal);
                        MP_ModalDialog.showModalDialog("errorModal");
                        return;
                    }
                }

                var selectedRows = Util.Style.g("hml2-med-selected", rootMedSecCont, "dl");
                medComp.m_base.setSelectedRows(selectedRows);
                var selRowLen = selectedRows.length;
                for (var i = 0; i < selRowLen; i++) {
                    var selRow = selectedRows[i];
                    var origDispQty;
                    var origRflQty;

                    var curDispQ = Util.Style.g("hml2-disp-q", selRow, "span")[0];
                    if (curDispQ) {
                        origDispQty = Util.Style.g("hml2-dq-qty", curDispQ, "span")[0].innerHTML;
                        if (rType === "hml2-rnwd") {
                            Util.Style.rcss(curDispQ, "hml2-hide-sig-line");
                        }
                        Util.Style.acss(curDispQ, "hml2-disp-q-rnw");
                        Util.addEvent(curDispQ, "click", CERN_HOME_MEDS_O2.changeDispQ);
                    }

                    var curRfl = Util.Style.g("hml2-rfl", selRow, "span")[0];
                    if (curRfl) {
                        if (rType === "hml2-rnwd") {
                            Util.Style.rcss(curRfl, "hml2-hide-sig-line");
                        }
                        Util.Style.acss(curRfl, "hml2-rfl-rnw");
                        origRflQty = parseInt(curRfl.innerHTML, 10);
                        Util.addEvent(curRfl, "click", CERN_HOME_MEDS_O2.changeRfl);
                    }

                    //clear route if exists
                    var prevRt = Util.Style.g("hml2-rt-spn", selRow, "span")[0];
                    if (prevRt) {
                        if (rType == 'hml2-cncld' || rType == 'hml2-cmplt') {
                            Util.de(prevRt);
                        }
                    } else if (rType == 'hml2-rnwd') {
                        var curDur = Util.Style.g("hml2-dur", selRow, "span")[0];
                        if (curDur) {
                            if (!medComp.m_medModObj.jsonRoutes) {
                                CERN_HOME_MEDS_O2.getRouteJSON(medComp);
                            }
                            var curCatCode = (Util.Style.g("hml2-cat-cd", selRow, "span")[0]).innerHTML;
                            if (medComp.m_medModObj.jsonRoutes[curCatCode]) {
                                var routeInfo = CERN_HOME_MEDS_O2.searchRoutes(curCatCode, null, medComp);
                                var defRoute = routeInfo[3];
                                var routeFrag = Util.cep("span", {
                                    className: "hml2-rt-spn"
                                });
                                rtUid = routeInfo[0] + routeInfo[1] + routeInfo[2];
                                routeFrag.innerHTML = '<span class="hml2-route-opt-spn">' + defRoute + '</span><span class="hml2-rt-uid cat-' + curCatCode + '">' + rtUid + "</span>";
                                Util.addEvent(routeFrag, "click", CERN_HOME_MEDS_O2.routeSelect);
                                curDur.parentNode.insertBefore(routeFrag, curDur);
                            }
                        }
                    }

                    var imgSpan = Util.Style.g("hml2-rx-hx", selRow, "span");
                    var curImg = Util.gc(imgSpan[0]);
                    //create object to store original values if none exists
                    if (!medComp.m_origOrder[selRow.id]) {
                        var origSrc;
                        if (curImg.src.search(/_selected/) > -1) {
                            origSrc = curImg.src.replace("_selected.gif", ".gif");
                        } else {
                            origSrc = curImg.src;
                        }
                        CERN_HOME_MEDS_O2.setOrigOrder(medComp, selRow.id, origDispQty, origRflQty, origSrc);
                    }

                    Util.Style.rcss(selRow, "hml2-med-selected");
                    Util.Style.rcss(selRow, "hml2-rnwd");
                    Util.Style.rcss(selRow, "hml2-cncld");
                    Util.Style.rcss(selRow, "hml2-cmplt");
                    Util.Style.acss(selRow, rType);

                    if (rType == "hml2-rnwd") {
                        curImg.src = ipath + '/images/renew.gif';
                    } else if (rType == "hml2-cncld") {
                        curImg.src = ipath + '/images/cancel.gif';
                    } else if (rType == "hml2-cmplt") {
                        curImg.src = ipath + '/images/complete.gif';
                    }
                }
                //When the action is renew, append a container to hold the AlertMessage,
                //initialize the HealthPlanSelector and display the formulary column
                if (rType === "hml2-rnwd") {
                    CERN_HOME_MEDS_O2.appendNoHealthPlanContainer(medCompId);
                    if (medComp.m_base.getHealthPlanSelector()) {
                        if (medComp.m_base.getHealthPlanSelector().getCurrentPlan()) {
                            medComp.m_base.healthPlanSelectorCallback(medComp.m_base.getHealthPlanSelector().getCurrentPlan());
                        }
                    } else {
                        var rootNode = medComp.getRootComponentNode();
                        var lookBackContainer = $(rootNode).find('.sec-hd');
                        medComp.m_base.initializeHealthPlanSelector(lookBackContainer);
                        //Display formulary column
                        $(rootNode).find('.hml2-formulary').removeClass('hml2-hidden');
                    }
                }
                CERN_HOME_MEDS_O2.checkIntersection(rtUid, medComp);
                _g("medSgnBtn" + medCompId).disabled = false;
                var compID = medComp.getComponentId();
                medComp.compMenuReference["compMenuGoto" + compID].setIsDisabled(false);
                medComp.compMenuReference["compMenuSign" + compID].setIsDisabled(false);

                var totRoutes = Util.Style.g("hml2-rt-uid", rootMedSecCont, "span").length;
                if (totRoutes) {
                    Util.Style.rcss(_g("routeLink" + medCompId), "hml2-dthrd");
                }
                CERN_HOME_MEDS_O2.disableActions(medComp);

                //enable reset in the component menu
                medComp.compMenuReference["compMenuReset" + compID].setIsDisabled(false);

                //close side panel if it is open (it is being left open after actions are taken)
                if (medComp.m_sidePanelShowing) {
                    medComp.m_sidePanel.m_cornerCloseButton.click();
                }
            }
            //reset highlight
            Util.Style.rcss(this, "hml2-mnu-hvr");
        }, //end queueOrder
        /**
         * getRowForOrder find the table row that match a given order
         * @param  {Object} order JSON object for an order
         * @param  {Array} allRows an array of DOM table rows
         * @return {Object} DOM object for an order
         */
        getRowForOrder: function(order, allRows) {
            var index = 0;
            var orderRow = null;
            var rowInfoElt = null;
            var rowOrderId = null;

            while ((!orderRow) && (index < allRows.length)) {
                rowInfoElt = Util.Style.g('hml2-info', allRows[index], 'span')[0];
                rowOrderId = parseInt(rowInfoElt.getAttribute('data-order-id'), 10);
                if (rowOrderId === order.MEDICATION_INFORMATION.ORDER_ID) {
                    orderRow = allRows[index];
                }
                index++;
            }
            return orderRow;
        },
        /**
         *Adds data required for renewal to each row
         *@param {Number} medCompId : Component Id
         *@param {Array} allRows : All the rows displayed in the component
         *@param {Array} orders : Order information for respective rows
         * @returns {undefined} undefined
         */
        addRenewData: function(medCompId, allRows, orders) {
            var ordLen = orders.length;
            var hmI18n = i18n.discernabu.homemeds_o2;
            for (var i = 0; i < ordLen; i++) {
                var curOrder = orders[i];

                //get the table row corresponding to the medication
                var curRow = CERN_HOME_MEDS_O2.getRowForOrder(curOrder, allRows);
                if (curRow) {
                    var imgSpan = Util.Style.g("hml2-rx-hx", curRow, "span");
                    var imgClass = Util.gc(imgSpan[0]).className;
                    var documentedMedClass = '';
                    if (imgClass !== 'hml2-rx') {
                        documentedMedClass = '-hx';
                    }
                    var ordMedInfo = curOrder.MEDICATION_INFORMATION;
                    var orderId = ordMedInfo.ORDER_ID;
                    var duration = ordMedInfo.DURATION;
                    var dispenseQty = ordMedInfo.DISPENSE_QTY;
                    var dispenseQtyUnit = ordMedInfo.DISPENSE_QTY_UNIT;
                    var dispenseQtyCd = ordMedInfo.DISPENSE_QTY_UNIT_CD;
                    var refillCount = ordMedInfo.NBR_REFILLS;
                    var cki = ordMedInfo.CKI;
                    var signatureLine = ' ';

                    //Dispense quantity value is formatted for display and added to the current row
                    if (dispenseQty) {
                        var formattedDispenseQty = CERN_HOME_MEDS_O2.formatDispQ(dispenseQty);
                        if (formattedDispenseQty[0]) {
                            dispenseQty = formattedDispenseQty[0];
                        } else {
                            dispenseQty = 0;
                        }

                        signatureLine +=
                            ' <span class="hml2-hide-sig-line hml2-disp-q' + documentedMedClass + '" id="dq' + medCompId + '_' + orderId + '">' +
                            '<span class="hml2-dq-qty" id="dqQty' + medCompId + '_' + orderId + '">' +
                            dispenseQty +
                            '</span>' +
                            '<span class="hml2-dq-tp"> ' +
                            dispenseQtyUnit +
                            '</span>' +
                            '</span>';
                    }

                    //Number of refills is formatted for display and added to the current row
                    if (refillCount) {
                        if (parseInt(refillCount, 10)) {
                            refillCount = parseInt(refillCount, 10);
                        } else {
                            refillCount = 0;
                        }
                        signatureLine += ' <span class="hml2-hide-sig-line hml2-rfl' + documentedMedClass + '" id="rfl' + medCompId + '_' + orderId + '">' + refillCount + ' ' + hmI18n.REFILLS + '</span>';
                    } else if (imgClass == 'hml2-rx') {
                        refillCount = 0;
                        signatureLine += ' <span class="hml2-hide-sig-line hml2-rfl" id="rfl' + medCompId + '_' + orderId + '">' + refillCount + ' ' + hmI18n.REFILLS + '</span>';
                    }
                    Util.Style.g("disp-rfl-cnt", curRow, "span")[0].innerHTML = signatureLine;
                    Util.Style.g("hml2-disp-qty-cd", curRow, "span")[0].innerHTML = dispenseQtyCd;
                    Util.Style.g("hml2-dur", curRow, "span")[0].innerHTML = duration;
                    //Add the cki as data attribute to all the rows in the component.
                    var ckiFromRow = $(curRow).data("cki");
                    if (!ckiFromRow) {
                        $(curRow).attr("data-cki", cki);
                    }
                }
            }
        },

        /**
         * Store some of the original order row details for use in reset
         * @param {obj} medComp : The component the details are being stored for
         * @param {string} ordId : Order Id
         * @param {string} dispQty : Dispense quantity
         * @param {string} rflQty : Refill Quantity
         * @param {string} rxType : Rx or Hx
         * @returns {undefined} undefined
         */
        setOrigOrder: function(medComp, ordId, dispQty, rflQty, rxType) {
            medComp.m_origOrder[ordId] = {};
            medComp.m_origOrder[ordId].ordId = ordId;
            medComp.m_origOrder[ordId].dispQty = dispQty;
            medComp.m_origOrder[ordId].rflQty = rflQty;
            medComp.m_origOrder[ordId].rxType = rxType;
        },

        /**
         * Search route object for a match
         * @param {string} curCatCode : Catalog Code of the Med
         * @param {string} uid : Unique Id of Route - comination of Field Display Value + Field Value + Mean Id
         * @param {obj} medComp : The component the routes are being searched in
         * @return {array}  : Array containing Field Display Value, Field Value, Mean Id, and Route Display of matched route
         */
        searchRoutes: function(curCatCode, uid, medComp) {
            var fieldDispVal, fieldVal, meanId, defRoute;
            var curCatList = medComp.m_medModObj.jsonRoutes[curCatCode];
            var hmI18n = i18n.discernabu.homemeds_o2;
            var i = 0;

            if (curCatList.pharmacies.length) {
                var pharms = curCatList.pharmacies;
                var phLen = pharms.length;
                for (i = phLen; i--;) {
                    var curPharm = pharms[i];
                    if (uid) {
                        if (uid == curPharm.fieldDispValue + curPharm.fieldValue + curPharm.meanId) {
                            defRoute = curPharm.display;
                            return [curPharm.fieldDispValue, curPharm.fieldValue, curPharm.meanId, defRoute];
                        }
                    } else if (curPharm.bDefault) {
                        defRoute = curPharm.display;
                        return [curPharm.fieldDispValue, curPharm.fieldValue, curPharm.meanId, defRoute];
                    }
                }
            }

            if (!defRoute) {
                if (curCatList.printers.length) {

                    var printers = curCatList.printers;
                    var prLen = printers.length;
                    for (i = prLen; i--;) {
                        var curPrint = printers[i];
                        if (uid) {
                            if (uid == curPrint.fieldDispValue + curPrint.fieldValue + curPrint.meanId) {
                                defRoute = curPrint.display;
                                return [curPrint.fieldDispValue, curPrint.fieldValue, curPrint.meanId, defRoute];
                            }
                        } else if (curPrint.bDefault) {
                            defRoute = curPrint.display;
                            return [curPrint.fieldDispValue, curPrint.fieldValue, curPrint.meanId, defRoute];
                        }
                    }
                }

            }
            if (!defRoute) {
                if (curCatList.doNotSendReasons.length) {
                    var dns = curCatList.doNotSendReasons;
                    var dnsLen = dns.length;
                    for (i = dnsLen; i--;) {
                        var curDns = dns[i];
                        if (uid) {
                            if (uid == curDns.fieldDispValue + curDns.fieldValue + curDns.meanId) {
                                defRoute = curDns.display;
                                return [curDns.fieldDispValue, curDns.fieldValue, curDns.meanId, defRoute];
                            }
                        } else if (curDns.bDefault) {
                            defRoute = hmI18n.DNS_LABEL + ": " + curDns.display;
                            return [curDns.fieldDispValue, curDns.fieldValue, curDns.meanId, defRoute];
                        }
                    }
                }

            }

            //if no matches for default
            if (!uid) {
                return [null, null, null, hmI18n.NO_DEFAULTS];
            }
        },

        /**
         * Search route object and return matched object to build intersection list
         * @param {string} curCatCode : Catalog Code of the Med
         * @param {string} uid : Unique Id of Route - comination of Field Display Value + Field Value + Mean Id
         * @param {string} interType : Intersection type being searched - pharmInt, printInd, or dnsInt
         * @param {obj} medComp : The component the routes are being searched in
         * @return {obj} : Matched route object
         */
        searchRouteInt: function(curCatCode, uid, interType, medComp) {
            var curCatList = medComp.m_medModObj.jsonRoutes[curCatCode];
            var i = 0;

            if (interType === "pharmInt") {
                if (curCatList.pharmacies) {
                    var pharms = curCatList.pharmacies;
                    var phLen = pharms.length;
                    for (i = 0; i < phLen; i++) {
                        var curPharm = pharms[i];
                        if (uid == curPharm.fieldDispValue + curPharm.fieldValue + curPharm.meanId) {
                            return curPharm;
                        }
                    }
                }
            } else if (interType === "printInt") {
                if (curCatList.printers) {
                    var printers = curCatList.printers;
                    var prLen = printers.length;
                    for (i = 0; i < prLen; i++) {
                        var curPrint = printers[i];
                        if (uid == curPrint.fieldDispValue + curPrint.fieldValue + curPrint.meanId) {
                            return curPrint;
                        }
                    }
                }
            } else if (interType === "dnsInt") {
                if (curCatList.doNotSendReasons) {
                    var dns = curCatList.doNotSendReasons;
                    var dnsLen = dns.length;
                    for (i = 0; i < dnsLen; i++) {
                        var curDns = dns[i];
                        if (uid == curDns.fieldDispValue + curDns.fieldValue + curDns.meanId) {
                            return curDns;
                        }
                    }
                }
            }
        },

        /**
         * Builds intersection list of routes and populates default routing link drop down
         * @param {string} inUid : Unique Id of Route - comination of Field Display Value + Field Value + Mean Id
         * @param {obj} medComp : The med component intersection is being checked for
         * @returns {undefined} undefined
         */
        checkIntersection: function(inUid, medComp) {
            var medCompId = medComp.m_medModObj.medModCompId;
            var jsonRoutes = medComp.m_medModObj.jsonRoutes;
            var uids = Util.Style.g("hml2-rt-uid", _g("hml2" + medCompId), "span");
            var uLen = uids.length;
            var rtLink = _g('routeLink' + medCompId);
            var hmI18n = i18n.discernabu.homemeds_o2;
            var catCd = null;

            if (uLen === 0) {

                rtLink.onclick = null;
                rtLink.innerHTML = hmI18n.MED_NONE_SELECTED;
            } else {
                var defRoute = Util.gps(uids[0]).innerHTML;

                if (uLen === 1) {
                    var uid = uids[0].innerHTML;
                    rtLink.innerHTML = '<span class="hml2-route-opt-spn">' + defRoute + '</span><span class="hml2-defrt-uid">' + uid + '</span>';
                    catCd = uids[0].className.replace('hml2-rt-uid cat-', '');
                    jsonRoutes.intersectionList = {};
                    jsonRoutes.intersectionList.pharmacies = jsonRoutes[catCd].pharmacies;
                    jsonRoutes.intersectionList.printers = jsonRoutes[catCd].printers;
                    jsonRoutes.intersectionList.doNotSendReasons = jsonRoutes[catCd].doNotSendReasons;

                    rtLink.onclick = CERN_HOME_MEDS_O2.routeSelect;
                } else {
                    var pharmIntersect = [];
                    var printIntersect = [];
                    var dnsIntersect = [];
                    var multi = false;
                    var matchUid;
                    var defUid;

                    if (inUid !== 'reset') {
                        defUid = inUid;
                    } else {
                        defUid = uids[0].innerHTML;
                    }

                    for (var i = 0; i < uLen; i++) {
                        catCd = uids[i].className.replace('hml2-rt-uid cat-', '');
                        if (i === 0) {
                            pharmIntersect = jsonRoutes[catCd].pharmacies;
                            printIntersect = jsonRoutes[catCd].printers;
                            dnsIntersect = jsonRoutes[catCd].doNotSendReasons;
                            matchUid = uids[i].innerHTML;
                        } else {
                            pharmIntersect = CERN_HOME_MEDS_O2.getIntersect(pharmIntersect, jsonRoutes[catCd].pharmacies, catCd, "pharmInt", medComp);
                            printIntersect = CERN_HOME_MEDS_O2.getIntersect(printIntersect, jsonRoutes[catCd].printers, catCd, "printInt", medComp);
                            dnsIntersect = CERN_HOME_MEDS_O2.getIntersect(dnsIntersect, jsonRoutes[catCd].doNotSendReasons, catCd, "dnsInt", medComp);
                        }
                        if (matchUid !== uids[i].innerHTML) {
                            multi = true;
                            defUid = hmI18n.DEF_ROUTE_MULTI;
                        }
                    }

                    jsonRoutes.intersectionList = {};
                    jsonRoutes.intersectionList.pharmacies = pharmIntersect;
                    jsonRoutes.intersectionList.printers = printIntersect;
                    jsonRoutes.intersectionList.doNotSendReasons = dnsIntersect;
                    //take instersect list and build default menu
                    if (multi) {
                        defRoute = hmI18n.DEF_ROUTE_MULTI;
                    }

                    rtLink.onclick = CERN_HOME_MEDS_O2.routeSelect;
                    rtLink.innerHTML = '<span class="hml2-route-opt-spn">' + defRoute + '</span><span class="hml2-defrt-uid">' + defUid + '</span>';

                }
            }
        },

        /**
         * Compares two arrays of objects and returns array of matches
         * @param {string} list1 : First array to compare
         * @param {string} list2 : Second array to compare
         * @param {string} catCd : Catalog Code of the Med
         * @param {string} interType : Intersection type being searched - pharmInt, printInd, or dnsInt
         * @param {obj} medComp : The component the routes are being searched in
         * @return {array} : returns array of matched objects
         */
        getIntersect: function(list1, list2, catCd, interType, medComp) {
            var intersection = [];
            var tempUids = [];

            var getCount = function(arr) {
                var countObj = {},
                    len = arr.length,
                    tmp;
                for (var i = 0; i < len; i++) {
                    tmp = countObj[arr[i]];
                    countObj[arr[i]] = tmp ? tmp + 1 : 1;
                }
                return countObj;
            };
            var l1Len = list1.length;
            var l2Len = list2.length;

            for (var l1i = 0; l1i < l1Len; l1i++) {
                var curL1 = list1[l1i];
                var l1Uid = curL1.fieldDispValue + curL1.fieldValue + curL1.meanId;
                tempUids.push(l1Uid);
            }
            for (var l2i = 0; l2i < l2Len; l2i++) {
                var curL2 = list2[l2i];
                var l2Uid = curL2.fieldDispValue + curL2.fieldValue + curL2.meanId;
                tempUids.push(l2Uid);
            }

            var uidObj = getCount(tempUids);
            for (var uid in uidObj) {
                if (uidObj[uid] === 2) {
                    intersection.push(CERN_HOME_MEDS_O2.searchRouteInt(catCd, uid, interType, medComp));
                }
            }

            return intersection;
        },

        /**
         * Build and display menu of routes
         * @returns {undefined} undefined
         */
        routeSelect: function() {
            var medComp;
            if (this.id) {
                var idFromRouteLink = parseInt(this.id.replace('routeLink', ''), 10);
                medComp = MP_Util.GetCompObjById(idFromRouteLink);
            } else {
                var parentContSec = $(this).closest(".sec-content");
                var idFromContSec = parseInt(parentContSec.attr('id').replace('hml2Content', ''), 10);
                medComp = MP_Util.GetCompObjById(idFromContSec);
            }

            var rtSpan = this;
            var catCode;
            var isIntList = false;
            var medCompId = medComp.m_medModObj.medModCompId;
            var i = 0;

            if (Util.Style.ccss(this, "hml2-rt-spn")) {
                var catCodeEl = Util.gc(this, 1);
                catCode = catCodeEl.className.replace('hml2-rt-uid cat-', '');

            } else {
                catCode = "intersectionList";
                isIntList = true;
            }

            var curUid = Util.gc(rtSpan, 1).innerHTML;
            var ofs = Util.goff(rtSpan);

            medComp.m_medModObj.routeOpt = Util.gc(rtSpan);
            medComp.m_medModObj.routeUid = Util.gc(rtSpan, 1);
            var pharmHTML = '';
            var printHTML = '';
            var dnsHTML = '';
            var extraPrinters = false;
            var hmI18n = i18n.discernabu.homemeds_o2;
            var jsonRoutes = medComp.m_medModObj.jsonRoutes;

            if (!jsonRoutes) {
                alert(hmI18n.NO_ROUTE_OPT);
            }

            if (jsonRoutes[catCode]) {
                var dispStr;
                var rtClass = 'hml2-route-opt';
                var curCatList = jsonRoutes[catCode];
                var rtUid = null;

                if (curCatList.pharmacies.length) {
                    var pharms = curCatList.pharmacies;
                    var phLen = pharms.length;
                    if (phLen > 3) { //Limit pharmacies to 3
                        phLen = 3;
                    }

                    for (i = 0; i < phLen; i++) {
                        var curPharm = pharms[i];
                        dispStr = curPharm.display;
                        rtUid = curPharm.fieldDispValue + curPharm.fieldValue + curPharm.meanId;

                        if (curUid == rtUid) {
                            rtClass += ' hml2-rt-sel';
                        }
                        var addrs = curPharm.streetAddress;
                        pharmHTML += '<div class="hml2-rt-pharm ' + rtClass + '" >' + dispStr + ' - ' + addrs + '</div><span class="hml2-rt-uid cat-' + catCode + '">' + rtUid + '</span><div class="hml2-rt-hover"><div class="hml2-rt-hover-hd">' + dispStr + ' - ' + curPharm.pharmNum + '</div><div class="hml2-rt-addr"><div>' + curPharm.streetAddress + '</div><div>' + curPharm.city + ', ' + curPharm.state + ' ' + curPharm.zip + '</div><div>' + curPharm.country + '</div></div><div>' + hmI18n.MED_MOD_TEL + ': ' + curPharm.tel + '</div><div>' + hmI18n.MED_MOD_FAX + ': ' + curPharm.fax + '</div></div>';
                        rtClass = rtClass.replace(' hml2-rt-sel', '');
                    }
                }

                if (curCatList.printers.length) {
                    var printers = curCatList.printers;
                    var prLen = printers.length;
                    var curPrinter = null;

                    if (prLen < 5) {
                        for (i = 0; i < prLen; i++) {
                            curPrinter = printers[i];
                            dispStr = curPrinter.display;
                            rtUid = curPrinter.fieldDispValue + curPrinter.fieldValue + curPrinter.meanId;
                            if (curUid == rtUid) {
                                rtClass += ' hml2-rt-sel';
                            }
                            printHTML += '<div class="hml2-rt-printer ' + rtClass + '" >' + dispStr + '</div><span class="hml2-rt-uid cat-' + catCode + '">' + rtUid + '</span>';
                            rtClass = rtClass.replace(' hml2-rt-sel', '');

                        }
                    } else {
                        for (i = 0; i < prLen; i++) {
                            curPrinter = printers[i];
                            dispStr = curPrinter.display;
                            rtUid = curPrinter.fieldDispValue + curPrinter.fieldValue + curPrinter.meanId;
                            if (curUid == rtUid) {
                                rtClass += ' hml2-rt-sel';
                            }
                            if (i == 3) {
                                extraPrinters = true;
                                printHTML += '<div class="hml2-rt-more-printer hml2-route-opt" id="morePrinter' + medCompId + '">' + hmI18n.MORE_PRINTERS + '</div>';
                                printHTML += '<div class="hml2-rt-more-menu menu-hide cat' + catCode + '" id="morePrintMenu' + medCompId + '">';
                                printHTML += '<div class="hml2-rt-printer ' + rtClass + '" >' + dispStr + '</div>' + '<span class="hml2-rt-uid cat-' + catCode + '">' + rtUid + '</span>';
                            } else {
                                printHTML += '<div class="hml2-rt-printer ' + rtClass + '" >' + dispStr + '</div>' + '<span class="hml2-rt-uid cat-' + catCode + '">' + rtUid + '</span>';
                            }
                            rtClass = rtClass.replace(' hml2-rt-sel', '');
                        }
                        printHTML += '</div>';
                    }
                }

                if (curCatList.doNotSendReasons.length) {
                    var dns = curCatList.doNotSendReasons;
                    var dnsLen = dns.length;
                    if (dnsLen > 3) { //Limit DNS to 3
                        dnsLen = 3;
                    }
                    for (i = 0; i < dnsLen; i++) {
                        var curDNS = dns[i];
                        dispStr = curDNS.display;
                        rtUid = curDNS.fieldDispValue + curDNS.fieldValue + curDNS.meanId;
                        if (curUid == rtUid) {
                            rtClass += ' hml2-rt-sel';
                        }
                        dnsHTML += '<div class="' + rtClass + '" >' + hmI18n.DNS_LABEL + ': ' + dispStr + '</div>' + '<span class="hml2-rt-uid cat-' + catCode + '">' + rtUid + '</span>';
                        rtClass = rtClass.replace(' hml2-rt-sel', '');

                    }
                }

            }

            if (pharmHTML) {
                pharmHTML += '<hr class="hml2-rt-hr" />';
            }

            if (printHTML) {
                printHTML += '<hr class="hml2-rt-hr" />';
            }

            var routeMnu = Util.cep("div", {
                "className": "hml2-rt-menu",
                "id": "rtMnu" + medCompId
            });

            if (!pharmHTML && !printHTML && !dnsHTML) {
                routeMnu.innerHTML = hmI18n.NO_DEFAULTS;
            } else {
                routeMnu.innerHTML = pharmHTML + printHTML + dnsHTML;
            }

            var closeRtMnu = function(e) {
                if (!e) {
                    e = window.event;
                }
                if (!_g("morePrintDiv" + medCompId)) {
                    Util.de(this);
                    Util.cancelBubble(e);
                }
            };
            if (window.attachEvent) {
                Util.addEvent(routeMnu, "mouseleave", closeRtMnu);
            } else {
                Util.addEvent(routeMnu, "mouseout", closeRtMnu);
            }

            var changeRoute = function(e) {

                e = e || window.event;

                var target = e.target || e.srcElement;
                if (Util.Style.ccss(target, "hml2-rt-menu")) {
                    return;
                }
                CERN_HOME_MEDS_O2.unHltRouteRow.call(target);

                if (target.id != "morePrinter" + medCompId) {
                    if (target.nodeName.toLowerCase() === 'div' && Util.Style.ccss(target, 'hml2-route-opt')) {
                        if (isIntList) {
                            var uids = Util.Style.g("hml2-rt-uid", _g("hml2" + medCompId), "span");
                            var uLen = uids.length;
                            var newRoute = target.innerHTML;
                            var newUid = Util.gns(target).innerHTML;
                            var catCodes = [];
                            var isPrinter = Util.Style.ccss(target, 'hml2-rt-printer');

                            for (var i = 0; i < uLen; i++) {
                                var curUid = uids[i];
                                if (isPrinter) {
                                    var catCd = curUid.className.replace('hml2-rt-uid cat-', '');
                                    catCodes.push(catCd);
                                }
                                Util.gps(curUid).innerHTML = newRoute;
                                curUid.innerHTML = newUid;

                            }
                            CERN_HOME_MEDS_O2.checkIntersection(newUid, medComp);
                            if (isPrinter) {
                                CERN_HOME_MEDS_O2.orderPrinters(catCodes, newUid, medComp);
                            }
                        } else {
                            medComp.m_medModObj.routeOpt.innerHTML = target.innerHTML;
                            medComp.m_medModObj.routeUid.innerHTML = Util.gns(target).innerHTML;

                            CERN_HOME_MEDS_O2.checkIntersection(medComp.m_medModObj.routeUid.innerHTML, medComp);
                        }
                        Util.cancelBubble(e);
                        Util.de(routeMnu);
                        var mPrintDiv = _g('morePrintDiv' + medCompId);
                        if (mPrintDiv) {
                            Util.de(mPrintDiv);
                        }
                    }
                }
            };

            Util.addEvent(routeMnu, "click", changeRoute);

            var rtMenuRows = Util.Style.g("hml2-route-opt", routeMnu, 'div');
            var rtMnLen = rtMenuRows.length;
            for (i = rtMnLen; i--;) {
                Util.addEvent(rtMenuRows[i], "mouseover", CERN_HOME_MEDS_O2.hltRouteRow);
                Util.addEvent(rtMenuRows[i], "mouseout", CERN_HOME_MEDS_O2.unHltRouteRow);
            }

            Util.ac(routeMnu, document.body);
            if (_g("morePrinter" + medCompId)) {
                Util.addEvent(_g("morePrinter" + medCompId), "click", function() {
                    CERN_HOME_MEDS_O2.showMorePrinters(this, isIntList, medComp);
                });
            }
            var vp = gvs();

            if ((ofs[0] + routeMnu.offsetWidth) >= vp[1]) {
                routeMnu.style.left = (vp[1] - routeMnu.offsetWidth - 5) + 'px';
            } else {
                routeMnu.style.left = ofs[0] + 'px';
            }

            routeMnu.style.top = ($(this).offset().top + $(this).height()) + 'px';

            Util.cancelBubble();
        },

        /**
         * Add hover to route menu rows and delayed tool tip for additional pharmacy info
         * @returns {undefined} undefined
         */
        hltRouteRow: function() {
            var parentId = Util.gp(this).id;
            var idFromRouteMenu = parseInt(parentId.replace('rtMnu', ''), 10);
            medComp = MP_Util.GetCompObjById(idFromRouteMenu);
            var medCompId = medComp.m_medModObj.medModCompId;
            if (this.id == "morePrinter" + medCompId) {
                Util.Style.acss(this, "hml2-mp-hvr");
            } else {
                Util.Style.acss(this, "hml2-mnu-hvr");
                var mpBtn = _g("morePrinter" + medCompId);
                if (mpBtn) {
                    if (Util.Style.ccss(mpBtn, "hml2-mp-hvr")) {
                        Util.Style.rcss(mpBtn, "hml2-mp-hvr");
                    }
                }
            }
            if (Util.Style.ccss(this, "hml2-rt-pharm")) {
                var ofs = Util.goff(this);
                var rtToolTip = Util.gns(Util.gns(this));
                var thisWidth = this.offsetWidth;

                var showRtDet = function() {
                    var rtHTML = rtToolTip.innerHTML;
                    var rtWidth = rtToolTip.offsetWidth;
                    medComp.m_medModObj.rtDiv = Util.cep("div", {
                        "className": "hml2-rt-div"
                    });
                    medComp.m_medModObj.rtDiv.innerHTML = rtHTML;

                    Util.ac(medComp.m_medModObj.rtDiv, document.body);

                    var divOfs = medComp.m_medModObj.rtDiv.offsetWidth + 15;

                    var vpOfs = ofs[0] - divOfs;
                    if (vpOfs > 0) {
                        medComp.m_medModObj.rtDiv.style.left = vpOfs + 'px';
                        medComp.m_medModObj.ttArrow = Util.cep("span", {
                            "className": "hml2-tt-arr-lt"
                        });
                        medComp.m_medModObj.ttArrow.style.left = (ofs[0] - 18) + 'px';

                    } else {
                        medComp.m_medModObj.rtDiv.style.left = (ofs[0] + thisWidth + 16) + 'px';
                        medComp.m_medModObj.ttArrow = Util.cep("span", {
                            "className": "hml2-tt-arr-rt"
                        });
                        medComp.m_medModObj.ttArrow.style.left = (ofs[0] + thisWidth + 3) + 'px';
                    }
                    medComp.m_medModObj.rtDiv.style.top = (ofs[1] - 5) + 'px';

                    medComp.m_medModObj.ttArrow.style.top = (ofs[1] + 2) + 'px';
                    Util.ac(medComp.m_medModObj.ttArrow, document.body);
                };

                medComp.m_medModObj.rtTimer = setTimeout(showRtDet, 500);
            }
        },

        /**
         * Un-highlight menu rows of route menu and reset pharmacy tool tip
         * @returns {undefined} undefined
         */
        unHltRouteRow: function() {
            var rootId = CERN_HOME_MEDS_O2.searchParentByClass(this, "hml2-rt-menu");
            var parentId = rootId.id;
            var idFromRouteMenu = parseInt(parentId.replace('rtMnu', ''), 10);
            medComp = MP_Util.GetCompObjById(idFromRouteMenu);
            var medCompId = medComp.m_medModObj.medModCompId;

            if (this.id == ("morePrinter" + medCompId)) {
                var mPrintDv = _g("morePrintDiv" + medCompId);
                if (!mPrintDv) {
                    Util.Style.rcss(this, "hml2-mp-hvr");
                }
            } else {
                Util.Style.rcss(this, "hml2-mnu-hvr");

            }
            clearTimeout(medComp.m_medModObj.rtTimer);

            Util.de(medComp.m_medModObj.rtDiv);
            Util.de(medComp.m_medModObj.ttArrow);
        },

        /**
         * Show additional menu of printers if more than 4
         * @param {obj} that : this from call
         * @param {bool} isIntList : is menu for intersection list
         * @param {obj} medComp : The med component the menu is for
         * @returns {undefined} undefined
         */
        showMorePrinters: function(that, isIntList, medComp) {
            var medCompId = medComp.m_medModObj.medModCompId;
            if (_g("morePrintDiv" + medCompId)) {
                Util.de(_g("morePrintDiv" + medCompId));
            } else {
                var ofs = Util.goff(that);
                var moreMenu = Util.gns(that);
                var thisWidth = that.offsetWidth;
                var mmClassName = moreMenu.className;
                var catCode = mmClassName.replace('hml2-rt-more-menu menu-hide cat', '');
                var mpHTML = moreMenu.innerHTML;
                var mpDiv = Util.cep("div", {
                    "className": "hml2-mp-div",
                    "id": "morePrintDiv" + medCompId
                });
                mpDiv.innerHTML = mpHTML;
                Util.ac(mpDiv, document.body);

                var divOfs = mpDiv.offsetWidth;

                var vpOfs = ofs[0] - divOfs;
                if (vpOfs > 0) {
                    mpDiv.style.left = (vpOfs - 2) + 'px';
                    Util.Style.acss(mpDiv, 'hml2-mpd-lt');
                } else {
                    mpDiv.style.left = (ofs[0] + thisWidth + 6) + 'px';
                    Util.Style.acss(mpDiv, 'hml2-mpd-rt');

                }
                mpDiv.style.top = (ofs[1] - 5) + 'px';

                var closePrintMnu = function(e) {
                    if (!e) {
                        e = window.event;
                    }
                    Util.de(mpDiv);
                    var mpBtn = _g("morePrinter" + medCompId);
                    if (mpBtn) {
                        if (Util.Style.ccss(mpBtn, "hml2-mp-hvr")) {
                            Util.Style.rcss(mpBtn, "hml2-mp-hvr");
                        }
                    }
                    Util.cancelBubble(e);
                };
                var changePrinter = function() {

                    var newPrinter = this.innerHTML;
                    var newUidEl = Util.gns(this);
                    var newUid = newUidEl.innerHTML;
                    var catCodes = [];
                    var i = 0;

                    if (isIntList) {
                        var uids = Util.Style.g("hml2-rt-uid", _g("hml2" + medCompId), "span");
                        var uLen = uids.length;
                        for (i = 0; i < uLen; i++) {
                            var catCd = uids[i].className.replace('hml2-rt-uid cat-', '');
                            Util.gps(uids[i]).innerHTML = newPrinter;
                            uids[i].innerHTML = newUid;
                            catCodes.push(catCd);
                        }

                        catCodes.push("intersectionList");
                    } else {

                        medComp.m_medModObj.routeOpt.innerHTML = newPrinter;
                        medComp.m_medModObj.routeUid.innerHTML = newUid;
                        catCodes.push(newUidEl.className.replace('hml2-rt-uid cat-', ''));

                    }

                    CERN_HOME_MEDS_O2.checkIntersection(newUid, medComp);
                    CERN_HOME_MEDS_O2.orderPrinters(catCodes, newUid, medComp);
                    Util.de(mpDiv);
                    Util.de(_g("rtMnu" + medCompId));
                    Util.cancelBubble();
                };
                var mpOptions = Util.Style.g('hml2-rt-printer', _g('morePrintDiv' + medCompId), 'div');
                var mpoLen = mpOptions.length;
                for (i = 0; i < mpoLen; i++) {
                    Util.addEvent(mpOptions[i], "click", changePrinter);
                }

                if (window.attachEvent) {
                    Util.addEvent(mpDiv, "mouseleave", closePrintMnu);
                } else {
                    Util.addEvent(mpDiv, "mouseout", closePrintMnu);
                }

                var mpMenuRows = Util.Style.g("hml2-rt-printer", _g("morePrintDiv" + medCompId), 'div');
                var mpMnLen = mpMenuRows.length;
                for (i = mpMnLen; i--;) {
                    Util.addEvent(mpMenuRows[i], "mouseover", CERN_HOME_MEDS_O2.hltMP);
                    Util.addEvent(mpMenuRows[i], "mouseout", CERN_HOME_MEDS_O2.unHltMP);
                }

            }
            Util.cancelBubble();
        },

        /**
         * If printer is selected from more printers secondary menu, move to top of list in printers object for display on relaunch of primary menu
         * @param {array} catCodes : array of catalog codes
         * @param {string} newUid : uid of the new selection
         * @param {obj} medComp : The med component the menu is for
         * @returns {undefined} undefined
         */
        orderPrinters: function(catCodes, newUid, medComp) {
            var jsonRoutes = medComp.m_medModObj.jsonRoutes;
            var catCdLen = catCodes.length;
            for (var j = 0; j < catCdLen; j++) {
                var catCode = catCodes[j];
                if (jsonRoutes[catCode].printers.length) {
                    var printers = jsonRoutes[catCode].printers;
                    var prLen = printers.length;
                    for (var i = 0; i < prLen; i++) {
                        var curPrinter = printers[i];
                        var rtUid = curPrinter.fieldDispValue + curPrinter.fieldValue + curPrinter.meanId;
                        if (rtUid === newUid) {
                            var prnToMove = printers.splice(i, 1);
                            printers.splice(0, 0, prnToMove[0]);
                            break;
                        }
                    }
                }
            }
        },

        /**
         * Highlight more printer menu rows
         */
        hltMP: function() {
            Util.Style.acss(this, "hml2-mnu-hvr");
        },

        /**
         * Un-highlight more printer menu rows
         */
        unHltMP: function() {
            Util.Style.rcss(this, "hml2-mnu-hvr");
        },

        /**
         * Initialize and position refill table
         * @param {obj} e : event object
         * @param {string] tId : table id
         * @param {string} selTable : HTML string of table contents
         * @return {obj} tblAdded : The med component the menu is for
         */
        rflTblInit: function(e, tId, selTable) {
            var tempTbl = Util.ce('span');
            tempTbl.innerHTML = selTable;
            document.body.appendChild(tempTbl);
            var tblAdded = _g(tId);
            var p = getPosition(e),
                top = p.y - 10,
                left = p.x - 25;
            tblAdded.style.display = "block";
            tblAdded.style.left = left + "px";
            tblAdded.style.top = top + "px";

            var txtBox = _g('tb' + tId);
            txtBox.select();

            Util.addEvent(tblAdded, "click", function(e) {
                if (!e) {
                    e = window.event;
                }
                Util.cancelBubble(e);
            });
            return tblAdded;
        },

        /**
         * Traverse up the DOM to search for an ancestor by class name
         * @param {obj} el : reference element to start search from
         * @param {string] elClass : Class name of ancestor to match
         * @return {obj} el : The matched ancestor element
         */
        searchParentByClass: function(el, elClass) {
            if (!el.parentNode) {
                return el;
            }
            el = el.parentNode;
            while (el.parentNode && !Util.Style.ccss(el, elClass)) {
                el = el.parentNode;
            }
            return el;
        },

        /**
         * change dispense quantity
         * @param {obj} e : event object
         */
        changeDispQ: function(e) {
            var pContentSec = CERN_HOME_MEDS_O2.searchParentByClass(this, "sec-content");
            var idFromContentSec = parseInt(pContentSec.id.replace('hml2Content', ''), 10);
            medComp = MP_Util.GetCompObjById(idFromContentSec);
            var medCompId = medComp.m_medModObj.medModCompId;

            if (!e) {
                e = window.event;
            }
            Util.cancelBubble(e);

            var medIdFrag = medComp.m_medModObj.medModIdFrag;
            var idStr = this.id;
            var idNum = idStr.replace('dq' + medIdFrag, '');
            var hml2InfoId = 'hml2Info' + medIdFrag + idNum;
            //retrieve order information from the table
            var orderInfo = _g(hml2InfoId);
            var pRow = CERN_HOME_MEDS_O2.searchParentByClass(orderInfo, "result-info");
            var cDispQ = this;

            if (Util.Style.ccss(pRow, "hml2-rnwd")) {

                if (Util.Style.ccss(cDispQ, "hml2-disp-q-rnw")) {
                    var dqTab = cDispQ.innerHTML;
                    var dispSpnId = cDispQ.id;
                    var tId = 'Tbl' + cDispQ.id;
                    var qty = Util.Style.g("hml2-dq-qty", cDispQ, "span")[0].innerHTML;
                    var typ = Util.Style.g("hml2-dq-tp", cDispQ, "span")[0].innerHTML;
                    var curTable = _g(tId);
                    if (curTable) {
                        Util.Style.rcss(curTable, "hml2-hide-tbl");
                    } else {
                        var selTable = "<table class='hml2-hvr-tbl' id='" + tId + "'><tr><td class='hml2-ref-tab'><span class='hml2-rnw-t'>" + dqTab + "</span></td><td class='hml2-rt-crnr'></td></tr><tr class='hml2-row-hd'><td class='hml2-row-tl'>&nbsp; </td><td class='hml2-row-tr'>&nbsp;</td></tr><tr class='hml2-row'><td class='hml2-row-l' colspan='2'><input type='text' class='hml2-qty-txt' id='tb" + tId + "' value='" + qty + "' /><span>" + typ + "</span> </td></tr><tr class='hml2-row'><td class='hml2-row-l' colspan='2'>&nbsp; </td></tr><tr class='hml2-row-hd'><td class='hml2-row-bl'>&nbsp; </td><td class='hml2-row-br'>&nbsp;</td></tr></table>";

                        var tblAdded = CERN_HOME_MEDS_O2.rflTblInit(e, tId, selTable);

                        Util.Style.g("hml2-row-tl", tblAdded, "td")[0].style.width = cDispQ.offsetWidth;
                        var closeTbl = function(e) {
                            if (!e) {
                                e = window.event;
                            }
                            var curQ = Util.Style.g("hml2-qty-txt", tblAdded, "input")[0].value;
                            var newQty;
                            var formatArr = CERN_HOME_MEDS_O2.formatDispQ(curQ);
                            if (formatArr[0] > 0) {
                                newQty = formatArr[0];
                                Util.Style.acss(tblAdded, "hml2-hide-tbl");
                                Util.Style.g("hml2-dq-qty", _g(dispSpnId), "span")[0].innerHTML = newQty;
                                Util.cancelBubble(e);
                            } else {
                                alert(i18n.discernabu.homemeds_o2.INVALID_QTY);
                            }
                            Util.cancelBubble(e);
                            Util.de(tblAdded);
                        };
                        if (window.attachEvent) {
                            Util.addEvent(tblAdded, "mouseleave", closeTbl);
                        } else {
                            Util.addEvent(tblAdded, "mouseout", closeTbl);
                        }

                        var rtCorners = Util.Style.g("hml2-rt-crnr", tblAdded, "td");
                        Util.addEvent(rtCorners[0], "mouseover", closeTbl);
                    }
                }
            }
        }, //end change dispense quantity

        /**
         * change number of refills
         * @param {obj} e : event object
         */
        changeRfl: function(e) {
            var pContentSec = CERN_HOME_MEDS_O2.searchParentByClass(this, "sec-content");
            var idFromContentSec = parseInt(pContentSec.id.replace('hml2Content', ''), 10);
            medComp = MP_Util.GetCompObjById(idFromContentSec);
            var medCompId = medComp.m_medModObj.medModCompId;

            if (!e) {
                e = window.event;
            }
            Util.cancelBubble(e);

            var medIdFrag = medComp.m_medModObj.medModIdFrag;
            var idStr = this.id;
            var idNum = idStr.replace('rfl' + medIdFrag, '');
            var hml2InfoId = 'hml2Info' + medIdFrag + idNum;
            //retrieve order information from the table
            var orderInfo = _g(hml2InfoId);
            var pRow = CERN_HOME_MEDS_O2.searchParentByClass(orderInfo, "result-info");
            var cRfl = this;

            if (Util.Style.ccss(pRow, "hml2-rnwd")) {

                if (Util.Style.ccss(cRfl, "hml2-rfl-rnw")) {
                    var rflTab = cRfl.innerHTML;
                    var rflId = cRfl.id;
                    var tId = 'Tbl' + cRfl.id;
                    var qty = parseInt(rflTab, 10);
                    var curRflTbl = _g(tId);
                    if (curRflTbl) {
                        Util.Style.rcss(curRflTbl, "hml2-hide-tbl");
                    } else {
                        var hmI18n = i18n.discernabu.homemeds_o2;
                        var selTable = "<table class='hml2-rfl-hvr-tbl' id='" + tId + "'><tr><td class='hml2-ref-tab'><span class='hml2-rnw-t'>" + rflTab + "</span></td><td class='hml2-rt-crnr'></td></tr><tr class='hml2-row-hd'><td class='hml2-row-tl'>&nbsp; </td><td class='hml2-row-tr'>&nbsp;</td></tr><tr class='hml2-row'><td class='hml2-row-l' colspan='2'><input type='text' class='hml2-qty-txt' id='tb" + tId + "' value='" + qty + "' /><span> " + hmI18n.REFILLS + "</span> </td></tr><tr class='hml2-row'><td class='hml2-row-l' colspan='2'><label><input type='checkbox' class='hml2-rfl-all' id='rflAll" + medCompId + "' value='Apply to All' />" + hmI18n.MED_APPLY_TO_ALL + "</label></td></tr><tr class='hml2-row-hd'><td class='hml2-row-bl'>&nbsp; </td><td class='hml2-row-br'>&nbsp;</td></tr></table>";

                        var tblAdded = CERN_HOME_MEDS_O2.rflTblInit(e, tId, selTable);

                        Util.Style.g("hml2-row-tl", tblAdded, "td")[0].style.width = cRfl.offsetWidth;

                        var closeRflTbl = function(e) {
                            if (!e) {
                                e = window.event;
                            }
                            var newQty;
                            var origQty = Util.Style.g("hml2-qty-txt", tblAdded, "input")[0].value;
                            var rootMedSecCont = medComp.getSectionContentNode();

                            if (origQty == '0') {
                                newQty = origQty;
                            } else {
                                newQty = parseInt(origQty, 10);
                                if (newQty < 0) {
                                    newQty = null;
                                }
                            }
                            if (newQty) {
                                var refillAll = _g('rflAll' + medCompId);
                                if (refillAll.checked) {
                                    var allRenewals = Util.Style.g("hml2-rnwd", rootMedSecCont, "dl");
                                    var renLen = allRenewals.length;
                                    for (var i = renLen; i--;) {
                                        var curRefill = Util.Style.g("hml2-rfl-rnw", allRenewals[i], "span");
                                        if (curRefill[0]) {
                                            curRefill[0].innerHTML = newQty + ' ' + hmI18n.REFILLS;
                                        }
                                    }
                                } else {
                                    _g(rflId).innerHTML = newQty + ' ' + hmI18n.REFILLS;
                                }

                                Util.Style.acss(tblAdded, "hml2-hide-tbl");
                                Util.cancelBubble(e);
                            } else {
                                alert(hmI18n.INVALID_QTY);
                            }
                            Util.cancelBubble(e);
                            Util.de(tblAdded);
                        };
                        if (window.attachEvent) {
                            Util.addEvent(tblAdded, "mouseleave", closeRflTbl);
                        } else {
                            Util.addEvent(tblAdded, "mouseout", closeRflTbl);
                        }

                        var rtCorners = Util.Style.g("hml2-rt-crnr", tblAdded, "td");
                        Util.addEvent(rtCorners[0], "mouseover", closeRflTbl);
                    }
                }
            }
        }, //change number of refills

        /**
         * launch the info button service when an info button is clicked from a medication row.
         * @param {Object} component  the home meds component object
         * @return null
         */
        enableInfoButtonClick: function(component) {
            var componentId = component.getComponentId();
            $("#hml2Content" + componentId).find(".hml2-info-icon")
                .click(function(e) {
                    //prevent the propagation of the click event to the entire row in the table
                    e.stopPropagation();
                    var patId = $(this).attr("data-patId");
                    var encId = $(this).attr("data-encId");
                    var synonymId = $(this).attr("data-synonymId");
                    var priCriteriaCd = $(this).attr("data-priCriteriaCd");
                    var launchInfoBtnApp = CERN_Platform.getDiscernObject("INFOBUTTONLINK");
                    try {
                        if (launchInfoBtnApp) {
                            launchInfoBtnApp.SetInfoButtonData(parseFloat(patId), parseFloat(encId), parseFloat(priCriteriaCd), 1, 2);
                            launchInfoBtnApp.AddMedication(parseFloat(synonymId));
                            launchInfoBtnApp.LaunchInfoButton();
                        }
                    } catch (err) {
                        var error_name = (err.name) ? err.name : "";
                        var error_msg = (err.message) ? err.message : i18n.discernabu.INFO_BUTTON_ERROR_MSG;

                        MP_Util.LogError(error_name + error_msg);
                        var errorModal = MP_ModalDialog.retrieveModalDialogObject("errorModal");
                        if (!errorModal) {
                            errorModal = MP_Util.generateModalDialogBody("errorModal", "error", error_msg, i18n.discernabu.INFO_BUTTON_ERROR_ACTION);
                            errorModal.setHeaderTitle(i18n.ERROR_OCCURED);
                            //Create and add the close button
                            var closeButton = new ModalButton("closeButton");
                            closeButton.setText(i18n.CLOSE).setCloseOnClick(true);
                            errorModal.addFooterButton(closeButton);
                        }
                        MP_ModalDialog.updateModalDialogObject(errorModal);
                        MP_ModalDialog.showModalDialog("errorModal");
                        return;
                    }
                });
        },

        //Click event for InfoButton Menu item to enable icons for results, Show and Hide of icons for results
        infoButtonClick: function(e) {
            var medCompId = parseInt(this.id.replace(/[^\d]/g, ""), 10);
            var component = MP_Util.GetCompObjById(medCompId);
            var componentId = component.getComponentId();

            var infoColumns = $("#hml2Content" + componentId).find(".hml2-info-icon-col");

            if (component.compMenuReference["compMenuInfoButton" + componentId].isSelected()) {
                component.compMenuReference["compMenuInfoButton" + componentId].setIsSelected(false);
                MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, "", "", false, "0");
                component.setIsInfoButtonEnabled(false);

                infoColumns.addClass("hidden");
            } else {
                component.compMenuReference["compMenuInfoButton" + componentId].setIsSelected(true);
                MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, "", "", false, "1");
                component.setIsInfoButtonEnabled(true);
                // display info buttons on the table rows
                infoColumns.removeClass("hidden");
            }

                //add Info Button click events
            if (component.hasInfoButton() && component.isInfoButtonEnabled()) {
                CERN_HOME_MEDS_O2.enableInfoButtonClick(component);
            }
        },

        /**
         * reset row(s) to initial state
         * @param {obj} e : event object
         */
        resetRows: function(e) {
            if (Util.Style.ccss(this, "hml2-dthrd") || Util.Style.ccss(this, "opts-menu-item-dthr")) {
                if (!e) {
                    e = window.event;
                }
                Util.cancelBubble(e);
            } else {
                var idFromResetBtn = parseInt(this.id.replace('mnuRnwReset', ''), 10);
                medComp = MP_Util.GetCompObjById(idFromResetBtn);
                var medCompId = medComp.m_medModObj.medModCompId;
                var origOrder = medComp.m_origOrder;

                var rootMedSecCont = medComp.getSectionContentNode();
                //get component table rows
                var componentTableElt = Util.Style.g("component-table", rootMedSecCont, "div")[0];
                var medRows = Util.Style.g("result-info", componentTableElt, "dl");
                var medsLen = medRows.length;
                var totRenews = Util.Style.g("hml2-rnwd", componentTableElt, "dl").length;
                var totCancels = Util.Style.g("hml2-cncld", componentTableElt, "dl").length;
                var totCompletes = Util.Style.g("hml2-cmplt", componentTableElt, "dl").length;
                //when any active row is  found, remove additional information from the rows
                if (totRenews || totCancels || totCompletes) {
                    for (var i = 0; i < medsLen; i++) {
                        var curRow = medRows[i];
                        var curId = curRow.id;
                        var imgSpan = Util.Style.g("hml2-rx-hx", curRow, "span");
                        var curImg = Util.gc(imgSpan[0]);
                        var curSrc = curImg.src;
                        var origDispQty;
                        var origRflQty;
                        if (origOrder[curId]) {
                            origDispQty = origOrder[curId].dispQty;
                            origRflQty = origOrder[curId].rflQty;
                            //set to original image
                            curImg.src = origOrder[curId].rxType;
                        } else if (curSrc.search(/_selected/) > -1) {
                            var newSrc = curSrc.replace("_selected.gif", ".gif");
                            curImg.src = newSrc;
                        }

                        Util.Style.rcss(curRow, "hml2-med-selected");
                        Util.Style.rcss(curRow, "hml2-cncld");
                        Util.Style.rcss(curRow, "hml2-rnwd");
                        Util.Style.rcss(curRow, "hml2-cmplt");
                        var renewEl = Util.Style.g("hml2-disp-q-rnw", curRow, "span")[0];
                        if (renewEl) {
                            Util.Style.rcss(renewEl, "hml2-disp-q-rnw");
                            Util.Style.acss(renewEl, "hml2-hide-sig-line");
                            if (origDispQty) {
                                Util.Style.g("hml2-dq-qty", renewEl, "span")[0].innerHTML = origDispQty;
                            }
                        }

                        var rflEl = Util.Style.g("hml2-rfl-rnw", curRow, "span")[0];
                        if (rflEl) {
                            var hmI18n = i18n.discernabu.homemeds_o2;
                            Util.Style.rcss(rflEl, "hml2-rfl-rnw");
                            Util.Style.acss(rflEl, "hml2-hide-sig-line");
                            rflEl.innerHTML = origRflQty + ' ' + hmI18n.REFILLS;
                        }
                        var prevRt = Util.Style.g("hml2-rt-spn", curRow, "span")[0];
                        if (prevRt) {
                            Util.de(prevRt);
                        }
                        CERN_HOME_MEDS_O2.checkIntersection('reset', medComp);
                    }
                }
                // after removing action information, disable all the table actions
                CERN_HOME_MEDS_O2.disableActions(medComp);

                var compID = medComp.getComponentId();
                _g("medSgnBtn" + medCompId).disabled = true;
                medComp.compMenuReference["compMenuGoto" + compID].setIsDisabled(true);
                medComp.compMenuReference["compMenuSign" + compID].setIsDisabled(true);
                medComp.setEditMode(false);

                var totRoutes = Util.Style.g("hml2-rt-uid", rootMedSecCont, "span").length;
                if (totRoutes === 0) {
                    Util.Style.acss(_g("routeLink" + medCompId), "hml2-dthrd");
                }

                //close side panel if it is open (it is being left open after actions are taken)
                if (medComp.m_sidePanelShowing) {
                    medComp.m_sidePanel.m_cornerCloseButton.click();
                }
            }
            //reset highlight
            Util.Style.rcss(this, "hml2-mnu-hvr");
        }, //end resetRows

        /**
         * loop through queued orders and add for the appropriate action
         * can attempt to sign silently or launch MOEW depending on caller
         * @param {obj} e : event object
         */
        signMedMods: function(e) {

                if (Util.Style.ccss(this, "hml2-dthrd") || Util.Style.ccss(this, "opts-menu-item-dthr")) {
                    if (!e) {
                        e = window.event;
                    }
                    Util.cancelBubble(e);
                } else {
                    var medCompId = parseInt(this.id.replace(/[^\d]/g, ""), 10);
                    var medComp = MP_Util.GetCompObjById(medCompId);

                    var PowerOrdersMPageUtils = window.external.DiscernObjectFactory("POWERORDERS");
                    MP_Util.LogDiscernInfo(medComp, "POWERORDERS", "homemedications-o2.js", "signMedMods");
                    var criterion = medComp.getCriterion();
                    var m_dPersonId = parseFloat(criterion.person_id);
                    var m_dEncounterId = parseFloat(criterion.encntr_id);
                    var bDefRt = true;
                    if (this.id == ("routeLink" + medCompId) || this.id == ("mnuGtOrders" + medCompId)) {
                        bDefRt = false;
                    }

                    var medSec = medComp.getSectionContentNode();
                    var medIdFrag = medComp.m_medModObj.medModIdFrag;
                    var failedOrders = "";

                    //create moew
                    var m_hMOEW = PowerOrdersMPageUtils.CreateMOEW(m_dPersonId, m_dEncounterId, 0, 2, 127);

                    //cancel orders
                    var cancels = Util.Style.g('hml2-cncld', medSec, 'dl');
                    var canLen = cancels.length;
                    var curCancel;
                    var i = 0;

                    if (canLen > 0) {
                        var m_dCancelDCReason = 0.0;
                        //default
                        var d = new Date();
                        //make sure leading zero is present
                        var twoDigit = function(num) {
                            num = (String(num).length < 2) ? String("0" + num) : String(num);
                            return num;
                        };
                        //YYYYMMDDhhmmsscc -- cc is dropped but needed for format for API
                        var cancelDate = "" + d.getFullYear() + twoDigit((d.getMonth() + 1)) + twoDigit(d.getDate()) + twoDigit(d.getHours()) + twoDigit(d.getMinutes()) + twoDigit(d.getSeconds()) + "99";

                        for (i = 0; i < canLen; i++) {
                            var cancelRowInfo = Util.Style.g('hml2-info', cancels[i], 'span')[0];
                            var cancelId = parseFloat((cancelRowInfo.id).replace('hml2Info' + medIdFrag, '')) || 0.0;

                            //add date time and reason
                            curCancel = PowerOrdersMPageUtils.InvokeCancelDCAction(m_hMOEW, cancelId, cancelDate, m_dCancelDCReason);
                            if (!curCancel) {
                                failedOrders += Util.Style.g('hml2-name', cancels[i], 'span')[0].innerHTML + "\n";
                            }
                        }
                    }

                    //complete orders
                    var completes = Util.Style.g('hml2-cmplt', medSec, 'dl');
                    var curComplete;
                    for (i = 0, l = completes.length; i < l; i++) {
                        var completeRowInfo = Util.Style.g('hml2-info', completes[i], 'span')[0];
                        var completeId = parseFloat((completeRowInfo.id).replace('hml2Info' + medIdFrag, '')) || 0.0;
                        curComplete = PowerOrdersMPageUtils.InvokeCompleteAction(m_hMOEW, completeId);

                        if (!curComplete) {
                            failedOrders += Util.Style.g('hml2-name', completes[i], 'span')[0].innerHTML + "\n";
                        }
                    }
                    //renew orders
                    var renewals = Util.Style.g('hml2-rnwd', medSec, 'dl');
                    var curRenewal;
                    for (i = 0, l = renewals.length; i < l; i++) {
                        var numRfls, dispQty;
                        curRenewal = renewals[i];
                        //retrieve the medication information from the table row
                        var curRowInfo = Util.Style.g('hml2-info', curRenewal, 'span')[0];
                        var renewalId = parseFloat((curRowInfo.id).replace('hml2Info' + medIdFrag, '')) || 0.0;
                        var dur = 0.0;
                        //possible future api use, for now set to 0
                        var durCd = 0.0;
                        //possible future api use, for now set to 0
                        var dispDur = 0.0;
                        //possible future api use, for now set to 0
                        var dispDurCd = 0.0;
                        //possible future api use, for now set to 0

                        var rflSpan = Util.Style.g('hml2-rfl', curRenewal, 'span')[0];
                        if (rflSpan) {
                            numRfls = parseFloat(rflSpan.innerHTML) || 0;
                        } else {
                            numRfls = 0.0;
                        }

                        var dispQtySpan = Util.Style.g('hml2-dq-qty', curRenewal, 'span')[0];
                        if (dispQtySpan) {
                            var formatArr = CERN_HOME_MEDS_O2.formatDispQ(dispQtySpan.innerHTML);

                            if (formatArr[1]) {
                                dispQty = formatArr[1];
                            } else {
                                dispQty = 0;
                            }
                        } else {
                            dispQty = 0.0;
                        }

                        var dispQtyCd = parseFloat(Util.Style.g('hml2-disp-qty-cd', curRenewal, 'span')[0].innerHTML) || 0;
                        var routeUidEl = Util.Style.g('hml2-rt-uid', curRenewal, 'span')[0];
                        var meanId, fieldVal, fieldDispVal;
                        if (routeUidEl) {
                            var routeUid = routeUidEl.innerHTML;
                            var catCd = routeUidEl.className.replace('hml2-rt-uid cat-', '');
                            var routeInfo = CERN_HOME_MEDS_O2.searchRoutes(catCd, routeUid, medComp);

                            if (routeInfo) {
                                meanId = parseFloat(routeInfo[2]);
                                fieldVal = parseFloat(routeInfo[1]);
                                fieldDispVal = routeInfo[0];
                            } else {
                                meanId = 0.0;
                                fieldVal = 0.0;
                                fieldDispVal = 0;
                            }
                        }
                        curRenewal = PowerOrdersMPageUtils.InvokeRenewActionWithRouting(m_hMOEW, renewalId, dur, durCd, dispDur, dispDurCd, numRfls, dispQty, dispQtyCd, meanId, fieldVal, fieldDispVal);
                        if (!curRenewal) {
                            failedOrders += Util.Style.g('hml2-name', renewals[i], 'span')[0].innerHTML + "\n";
                        }
                    }

                    //attempt to sign silently or display moew based on default routing
                    var bSign;
                    var showMOEW;
                    var hmI18n = i18n.discernabu.homemeds_o2;
                    if (failedOrders !== "") {
                        if (curRenewal || curCancel || curComplete) {
                            failedOrders = hmI18n.FAILED_ORDERS + ":\n\n" + failedOrders + "\n " + hmI18n.CONTINUE_SIGN;
                            var confirmFailed = confirm(failedOrders);
                            if (confirmFailed) {
                                //continue to sign
                                if (bDefRt) {
                                    bSign = PowerOrdersMPageUtils.SignOrders(m_hMOEW);
                                } else {
                                    //displays moew
                                    showMOEW = PowerOrdersMPageUtils.DisplayMOEW(m_hMOEW);
                                }
                            }
                        } else {
                            failedOrders = hmI18n.FAILED_ORDERS + ":\n\n" + failedOrders + "\n " + hmI18n.NO_VALID_ORDERS;
                            alert(failedOrders);
                        }
                    } else {
                        if (bDefRt) {
                            bSign = PowerOrdersMPageUtils.SignOrders(m_hMOEW);
                        } else {
                            //displays moew
                            showMOEW = PowerOrdersMPageUtils.DisplayMOEW(m_hMOEW);
                        }
                    }

                    PowerOrdersMPageUtils.DestroyMOEW(m_hMOEW);

                    //destroy moew
                    if (bSign || showMOEW) {
                        medComp.InsertData();
                    } else {
                        _g("medSgnBtn" + medCompId).value = hmI18n.MED_SIGN;
                    }
                }
            } //end signMedMods
    };

    /////////////////////////////////////////////end add mod functions
}();
