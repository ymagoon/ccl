/* global MPageTooltip */
/* eslint mp-camelcase:[1, "event_type"] */
/* eslint new-cap:[2, {"capIsNewExceptions": ["MP_Util", "XMLCCLRequestCallBack", "FinalizeComponent", "LogJSError", "LogScriptCallError", "HandleErrorResponse", "CreateTimer", "Abort", "Stop"]}] */
/* eslint complexity:0 */
/* eslint deprecated-functions:0 */
/* eslint
brace-style:0,
complexity:0,
indent:[1, 4, {
    "SwitchCase": 1,
    "VariableDeclarator": 1
}],
no-mixed-spaces-and-tabs:1,
no-spaced-func:1,
space-after-keywords:1,
space-before-function-paren:0,
space-before-blocks:1,
space-in-parens:1,
space-return-throw-case:1,
vars-on-top:2,
quotes:[1,"double"],
array-bracket-spacing:0,
object-curly-spacing:0
*/

/**
 * Callback that accepts a script reply.
 *
 * @callback scriptReplyCallback
 * @param {object} reply The reply from the script.
 */

/**
 * Create the component style object which will be used to style various aspects of our component
 * @class
 * @returns {undefined} Nothing
 */
function PaceMakerComponentStyle() {
    this.initByNamespace("pmc1");
}

PaceMakerComponentStyle.prototype = new ComponentStyle();
PaceMakerComponentStyle.prototype.constructor = ComponentStyle;

/**
 * @class
 * @classdesc Cardiac Device Summary Component
 * @constructor
 * @param {Criterion} criterion - The Criterion object which contains information needed to render the component.
 */
function PaceMakerComponent(criterion) {
    this.componentId = "";
    this.i18n = {};
    this.JSONData = {};
    // JSONData;
    this.PMkrData = {};
    // JSONData.PULSE_GENS[0];
    this.Episodes = [];
    // JSONData.PULSE_GENS[0].EPISODES;
    this.Sessions = [];
    // JSONData.PULSE_GENS[0].SESSIONS;
    this.staticCntntPath = "";
    this.staticImagePath = "";

    //Efficient high-performing way for features (e.g., disassociate button) to know know if there's data
    this.dataLoaded = false;

    this.setComponentLoadTimerName("USR:MPG.Cardiology.Device.Summary.o1 - load component ");
    // Set the Load Timer into motion (all subsequent effects are built into the prototype)
    this.setComponentRenderTimerName("ENG:MPG.Cardiology.Device.Summary.o1 - render component");
    // Set the Render Timer into motion (all subsequent effects are built into the prototype)

    this.setCriterion(criterion);
    this.setStyles(new PaceMakerComponentStyle());
    this.setIncludeLineNumber(true);

    //Paths for content location...moved from renderComponent so they're available even if there's no device.
    this.staticCntntPath = criterion.static_content;
    this.staticImagePath = this.staticCntntPath + "/images";

    this.suggestedMatchPulseGenIDs = [];
    this.tabActive = 0;

    this.shortEpisodeList = [];
    this.longEpisodeList = [];
    this.episodeTable = [];
    this.linkText = [];
    this.tablesExpandStatus = [];
    this.i18n = i18n.discernabu.cardiology_device_integration_o1;
    this.devicesToAssociate = [];
    this.devicesToDisassociate = [];
}

PaceMakerComponent.prototype = new MPageComponent();
PaceMakerComponent.prototype.constructor = MPageComponent;

/**
 * Described additional variables to reset when the component is refreshes.
 * @returns {UNDEFINED} Nothing
 */
PaceMakerComponent.prototype.refreshComponent = function () {
    this.componentId = "";
    this.i18n = i18n.discernabu.cardiology_device_integration_o1;
    this.JSONData = {};
    this.staticCntntPath = "";
    this.staticImagePath = "";
    this.shortEpisodeList = [];
    this.longEpisodeList = [];
    this.episodeTable = [];
    this.linkText = [];
    this.tablesExpandStatus = [];
    this.devicesToAssociate = [];
    this.devicesToDisassociate = [];

    //Efficient high-performing way for features (e.g., disassociate button) to know know if there's data
    this.dataLoaded = false;
    this.setIncludeLineNumber(true);
    MPageComponent.prototype.refreshComponent.call(this);
};

/* OBLIGATE MPAGE METHODS */
PaceMakerComponent.prototype.retrieveComponentData = function() {
    var component = arguments[0] ? arguments[0] : this;
    //Allow passing component as parameter if "this" isn't the component in caller's context.
    //Ajax call to CCL to get pacemaker data and gain customized control even if no results found
    var request = new MP_Core.ScriptRequest(component, component.getComponentLoadTimerName());
    //Use timer name, as this is the main load of the component.
    request.setProgramName("PEX_GET_ICD_INFO");
    //Gets attributes describing settings, measurements, statistics, episodes, sessions, and lead information
    //for a person's pulse generator
    //Parameters:
    //person-id, date range (e.g., look back 18 months, up to present (0))
    //One vs. zero according to following list:
    //1 to retrieve device settings information.
    //0 to not retrieve device leads information.
    //1 to retrieve information about episodes.
    //1 to retrieve information about sessions.
    //0 to not retrieve statistical information.
    //1 to retrieve device measurements.
    request.setParameters(["^MINE^", component.getCriterion().person_id + ".00", "^18,m^", "^^", "1", "0", "1", "1", "0", "1"]);
    request.setAsync(true);
    MP_Core.XMLCCLRequestCallBack(component, request, component.handleLoad);
    //Handles request and returns custom control
};

/**
 * Generates the HTML code for the Summary Summary (Hades) page
 *
 * @param   {OBJECT}    recordData The JSON data returned from the server
 * @returns {UNDEFINED}            Nothing
 * @example
 * CERN_CARDIOLOGY_DEVICE_O1.RenderComponent()
 */
PaceMakerComponent.prototype.renderComponent = function(recordData) {
    var component, opHTML, deviceIterator;
    component = this;
    this.componentId = this.getComponentId();

    try {
        this.JSONData = recordData;
        this.dataLoaded = true;
        this.scopeId = component.m_rootComponentNode.id;
        this.scopeObj = $("#" + this.scopeId);
        this.staticCntntPath = component.getCriterion().static_content;
        this.staticImagePath = this.staticCntntPath + "/images";

        this.createDeviceData();

        // General Declarations
        opHTML = "";
        for (deviceIterator = 0; deviceIterator < this.JSONData.PULSE_GENS.length; deviceIterator++) {
            if (deviceIterator === 0) {
                opHTML += this.constructDeviceInformationPanel(deviceIterator);
            }
            else {
                opHTML += this.constructHistoricalDeviceInformationPanel(deviceIterator);
            }
            this.episodeTable[deviceIterator] = this.createDataTable(deviceIterator);
            this.episodeTable[deviceIterator].bindData(this.shortEpisodeList[deviceIterator]);
            opHTML += this.episodeTable[deviceIterator].render();
            opHTML += this.createShowMoreLinkHTML(deviceIterator);
            this.linkText[deviceIterator] = ""; //Initializing the text to blank, this variable would be further would in postprocessing
            this.tablesExpandStatus[deviceIterator] = false;
        }
        MP_Util.Doc.FinalizeComponent(opHTML, component, "");
    }
    catch (err) {
        MP_Util.LogJSError(this, err, "PaceMakerComponent.js", "renderComponent");
        throw err;
    }
};

/**
 * Creates Device Data Arrays for the Component to be used upon later
 * Creates shortEpisodeList and longEpisodeList for every device present
 * @returns {UNDEFINED} Nothing
 */
PaceMakerComponent.prototype.createDeviceData = function () {
    var shortDataList = [],
        longDataList = [],
        dateResult,
        eventType,
        eventInfo = {},
        deviceCounter,
        episodeIterator;

    for (deviceCounter = 0; deviceCounter < this.JSONData.PULSE_GENS.length; deviceCounter++) {
        shortDataList[deviceCounter] = [];
        longDataList[deviceCounter] = [];
        for (episodeIterator = 0; episodeIterator < this.JSONData.PULSE_GENS[deviceCounter].EPISODES.length; episodeIterator++) {
            dateResult = new Date();
            dateResult.setISO8601(this.JSONData.PULSE_GENS[deviceCounter].EPISODES[episodeIterator].DETECTION_DT_TM);
            eventInfo = {
                "date": dateResult.format("mediumDate"),
                "time": dateResult.format("shortTime"),
                "duration": this.parseDurationSeconds(parseInt(this.JSONData.PULSE_GENS[deviceCounter].EPISODES[episodeIterator].DURATION_VALUE, 10))
            };
            eventType = this.JSONData.PULSE_GENS[deviceCounter].EPISODES[episodeIterator].TYPE_DISP;
            if (this.JSONData.PULSE_GENS[deviceCounter].EPISODES[episodeIterator].DOC_UID !== "") {
                eventType += "<a onclick='var slaTimer = MP_Util.CreateTimer(\"USR:MPG.Cardiology.Device.Summary.o2 - get episode doc\"); if (slaTimer) { slaTimer.SubtimerName = \"" + this.criterion.category_mean + "\"; slaTimer.Stop(); }CCLLINK(\"pex_disp_pulse_gen_episode_doc\",\"^MINE^,^" + this.JSONData.PULSE_GENS[deviceCounter].EPISODES[episodeIterator].DOC_UID + "^\",1);'> &nbsp; <img src='" + this.staticImagePath + "/EKG_icon.png' width='17' height='15' alt=\"" + this.i18n.VIEW_EKG + "\" title=\"" + this.i18n.VIEW_EKG + "\" align='absmiddle' /></a>";
            }
            if (episodeIterator < 5) {
                shortDataList[deviceCounter][episodeIterator] = eventInfo;
                if (eventType !== "") {
                    shortDataList[deviceCounter][episodeIterator].event_type = eventType;
                }
            }
            longDataList[deviceCounter][episodeIterator] = eventInfo;
            if (eventType !== "") {
                longDataList[deviceCounter][episodeIterator].event_type = eventType;
            }
        }
        this.shortEpisodeList[deviceCounter] = shortDataList[deviceCounter];
        this.longEpisodeList[deviceCounter] = longDataList[deviceCounter];
    }
};

/**
 * createDataTable
 * This function creates the component table that displays the data
 * @param {Number} pulseGenNum - the deviceNumber for which the data table is being created
 * @returns {Object} the component table
 */
PaceMakerComponent.prototype.createDataTable = function(pulseGenNum) {
    var tableColumns, episodeTable;

    tableColumns = [];
    episodeTable = new ComponentTable();
    //WE MUST SET THE NAMESPACE OF THE TABLE TO DISTINGUISH BETWEEN MULTIPLE TABLES WITHIN THE DOM. THIS STEP IS VERY IMPORTANT AND MUST NOT BE OMITTED!
    //this.getStyles().getId() would be unique across all instances of the same component. It returns the namespace of the component along with the component Id
    //For example: 'pmc156780, pmc156781,....etc'
    episodeTable.setNamespace(this.getStyles().getId() + pulseGenNum);
    episodeTable.setCustomClass("pmc1-episode-tabular-data");

    tableColumns[0] = new TableColumn();
    tableColumns[1] = new TableColumn();
    tableColumns[2] = new TableColumn();
    tableColumns[3] = new TableColumn();

    tableColumns[0].setColumnId("pmc1-tablecol-event-type");
    tableColumns[1].setColumnId("pmc1-tablecol-date");
    tableColumns[2].setColumnId("pmc1-tablecol-time");
    tableColumns[3].setColumnId("pmc1-tablecol-duration");

    tableColumns[0].setCustomClass("pmc1-tablecol-event-type");
    tableColumns[1].setCustomClass("pmc1-tablecol-date");
    tableColumns[2].setCustomClass("pmc1-tablecol-time");
    tableColumns[3].setCustomClass("pmc1-tablecol-duration");

    tableColumns[0].setColumnDisplay(this.i18n.EVENT_TYPE);
    tableColumns[1].setColumnDisplay(this.i18n.DATE);
    tableColumns[2].setColumnDisplay(this.i18n.TIME);
    tableColumns[3].setColumnDisplay(this.i18n.DURATION);

    tableColumns[0].setRenderTemplate("<span>${event_type}</span>");
    tableColumns[1].setRenderTemplate("<span>${date}</span>");
    tableColumns[2].setRenderTemplate("<span>${time}</span>");
    tableColumns[3].setRenderTemplate("<span>${duration}</span>");

    episodeTable.addColumn(tableColumns[0]);
    episodeTable.addColumn(tableColumns[1]);
    episodeTable.addColumn(tableColumns[2]);
    episodeTable.addColumn(tableColumns[3]);

    return episodeTable;
};

/**
 * This functions creates the showMore Link based on the number of episodes in the device
 * Creates a link if there are 5 or more episodes, returns blank string if the device has less than 5 episodes
 * @param {Number} deviceNum - the device number for which the link is being created (0 to n-1 where n is the number of devices)
 * @returns {HTML} showMoreLink
 */
PaceMakerComponent.prototype.createShowMoreLinkHTML = function(deviceNum) {
    if (this.JSONData.PULSE_GENS[deviceNum]) {
        if (this.JSONData.PULSE_GENS[deviceNum].EPISODES.length >= 5) {
            return "<div id='pmc1-show-more-results-panel' class='pmc1-show-all'>" + "<a id='pmc1-show-hide-more-link-" + deviceNum + "' href='#' class = 'pmc1-show-hide-more-link'>" + this.i18n.SHOW_ALL + " (" + this.JSONData.PULSE_GENS[deviceNum].EPISODES.length + ")" + "</a>" + "</div>";
        }
        else {
            return "";
        }
    }
    else {
        return "";
    }
};

/**
 * Appends all the events onto the relevant objects (required to have a truly prototypical object)
 *
 * @returns {UNDEFINED} Nothing
 */
PaceMakerComponent.prototype.postProcessing = function() {
    var $self, $showHideLink;
    if (!this.scopeObj) {
        this.scopeObj = $("#" + this.m_rootComponentNode.id);
    }

    $self = this.scopeObj;

    // the rest of this method will deal with displaying data
    //  if the data hasn't been loaded (i.e., there's no data to display), don't bother with the rest of this method
    if (this.dataLoaded === true) {
        //Create disassociate menu item in top-right corner
        this.createComponentMenu(this);
        // Create a reference to this component's DOM scope (used for confining $() searches)
        // Locate the "Show More(XX)"/"Show Fewer" link's $DOM node
        $showHideLink = $self.find(".pmc1-show-hide-more-link");

        //Just to ensure these aren't loaded more than once; needed because callbacks for multiple actions could reload this.
        if ($showHideLink.data("Loaded") && $showHideLink.data("Loaded") === 1) {//Attach data to any of these controls.
            return;
        }
        $showHideLink.data("Loaded", 1);

        // Set the "Show More(XX)"/"Show Fewer" link's onClick behavior
        $showHideLink.click({
            scope: this
        }, this.showLinkClick);
        this.constructImplantInfoTooltips();
    }
};

/**
 * Construct the tool-tip that has the Implant information that displays on hovering over the "Implant" date for both active and all historical devices
 * @returns {UNDEFINED} Nothing
 */
PaceMakerComponent.prototype.constructImplantInfoTooltips = function() {
    var $implantDetailHover = $("#" + this.m_rootComponentNode.id).find(".pmc1-implant-date"),
        deviceTooltip,
        deviceIdx;

    for (deviceIdx = 0; deviceIdx < this.JSONData.PULSE_GENS.length; deviceIdx++) {
        deviceTooltip = new MPageTooltip();
        deviceTooltip.setContent(this.constructHoverTable([this.i18n.IMPLANTING_PHYSICIAN, this.i18n.FACILITY, this.i18n.CONTACT_DATA], [this.JSONData.PULSE_GENS[deviceIdx].IMPLANTER_NAME, this.JSONData.PULSE_GENS[deviceIdx].IMPLANTING_FACILITY_NAME, this.JSONData.PULSE_GENS[deviceIdx].IMPLANTER_CONTACT_INFO]));

        deviceTooltip.setAnchor($implantDetailHover.eq(deviceIdx));

        $implantDetailHover.eq(deviceIdx).mouseover({
            tooltip: deviceTooltip
        }, this.showHoverData);
    }
};

/**
 * Creates a top-right corner menu for disassociating device/devices and activating a new device
 *
 * @param {OBJECT} thisComponent Reference to the component
 * @returns {UNDEFINED} Nothing
 */
PaceMakerComponent.prototype.createComponentMenu = function(thisComponent) {
    var compId, $manageDevicesLink, menuId, insideCompMenu, elemRemoveAssociation;
    compId = thisComponent.getComponentId();
    $manageDevicesLink = $("#moreOptMenu" + compId).find(thisComponent.writeUniqueID("manageDevices", thisComponent, true));
    if (!thisComponent.disassociateDialogSequence) {
        //Static variable to create unique sequential numbers.
        thisComponent.disassociateDialogSequence = 0;
    }

    if ($manageDevicesLink.length === 0) {
        menuId = "moreOptMenu" + compId;
        insideCompMenu = document.getElementById(menuId);
        //Create a div element while retaining a handle to it
        elemRemoveAssociation = document.createElement("div");
        //Add div element to the DOM without voiding the events of other menu items;
        //Then we can manipulate just our element as needed.
        insideCompMenu.appendChild(elemRemoveAssociation);
        elemRemoveAssociation.innerHTML +=
            "<div id='" + thisComponent.writeUniqueID("manageDevices", thisComponent, false) + "' class='opts-menu-item'>" +
                i18n.discernabu.cardiology_device_integration_o1.MANAGE_DEVICES + "..." +
            "</div>";
    }

    if (!thisComponent.dataLoaded) {
        //Make it go away if there's no data. Note that we must remove it entirely, so we don't have problems if they keep assoc/dissoc.
        $manageDevicesLink.addClass("menu-item-disabled").unbind("click");
    }
    else {
        thisComponent.enableManageDevicesMenuItem();
    }
};

/**
 * This function enables the manageDevices menu Item and binds the function to its click event
 * @returns {UNDEFINED} Nothing
 */
PaceMakerComponent.prototype.enableManageDevicesMenuItem = function() {
    var compId = this.getComponentId(),
        $manageDevicesMenuLink = $("#moreOptMenu" + compId).find(this.writeUniqueID("manageDevices", this, true));
    $manageDevicesMenuLink
        .removeClass("menu-item-disabled")
        .click(
        {
            scope: this
        },
        this.constructManageDevicesDialog
        );
};


/**
 * When the 0th index of the dropdown menu is clicked, construct the manage devices dialog and
 * hook up the proper events.
 * @param {Object} eventData Object related to the function click
 * @returns {UNDEFINED} Nothing.
 */
PaceMakerComponent.prototype.constructManageDevicesDialog = function(eventData) {
    var thisComponent = eventData.data.scope,
        manageDevicesDialogId = thisComponent.getManageDevicesDialogId(),
        manageDevicesDialog = MP_ModalDialog.modalDialogObjects[manageDevicesDialogId],
        manageDevicesHtml,
        submitButton,
        cancelButton;

    manageDevicesHtml = thisComponent.constructDeviceManagement();

    if (manageDevicesDialog === undefined) {
        submitButton = new ModalButton("pmc1-apply-changes");
        cancelButton = new ModalButton("pmc1-cancel-changes");
        manageDevicesDialog = new ModalDialog(manageDevicesDialogId);

        cancelButton
            .setText(i18n.discernabu.cardiology_device_integration_o1.CANCEL)
            .setIsDithered(false)
            .setCloseOnClick(true)
            .setOnClickFunction(function() {
                thisComponent.devicesToAssociate = [];
                thisComponent.devicesToDisassociate = [];
            });

        submitButton
            .setText(i18n.discernabu.cardiology_device_integration_o1.SUBMIT)
            .setIsDithered(false)
            .setCloseOnClick(true)
            .setFocusInd(true)
            .setOnClickFunction(function() {
                var personId = thisComponent.getCriterion().person_id,
                    deviceIdx,
                    associateDeviceCount = thisComponent.devicesToAssociate.length,
                    disassociateDeviceCount = thisComponent.devicesToDisassociate.length;

                if (associateDeviceCount !== 0 || disassociateDeviceCount !== 0) {
                    // associate all the devices that needs to be associated
                    for (deviceIdx = 0; deviceIdx < associateDeviceCount; deviceIdx++) {
                        thisComponent.updateDeviceAssociation(thisComponent.devicesToAssociate[deviceIdx], personId, undefined, false);
                    }

                    // disassociate all the devices that need to be disassociated
                    for (deviceIdx = 0; deviceIdx < disassociateDeviceCount; deviceIdx++) {
                        thisComponent.updateDeviceAssociation(thisComponent.devicesToDisassociate[deviceIdx], 0, undefined, false);
                    }

                    // clear out the devices to associate/disassociate
                    thisComponent.devicesToAssociate = [];
                    thisComponent.devicesToDisassociate = [];

                    thisComponent.refreshComponent();
                }
            });

        manageDevicesDialog
            .setLeftMarginPercentage(20)
            .setRightMarginPercentage(20)
            .setTopMarginPercentage(20)
            .setBottomMarginPercentage(20)
            .setHeaderTitle(i18n.discernabu.cardiology_device_integration_o1.MANAGE_DEVICES)
            .setIsBodySizeFixed(false)
            .setIsFooterAlwaysShown(true)
            .addFooterButton(submitButton)
            .addFooterButton(cancelButton)
            .setShowCloseIcon(true)
            .setHeaderCloseFunction(function () {
                // clear out the devices to associate/disassociate
                thisComponent.devicesToAssociate = [];
                thisComponent.devicesToDisassociate = [];
            });

        MP_ModalDialog.addModalDialogObject(manageDevicesDialog);
    }

    MP_ModalDialog.showModalDialog(manageDevicesDialogId);
    manageDevicesDialog.setBodyHTML(manageDevicesHtml);
    thisComponent.setDeviceManagementEvents($("#" + manageDevicesDialog.getBodyElementId()));
};

/**
 * Returns the id for the manage devices dialog for this component.
 * @returns {STRING} The id for the manage devices dialog for this component.
 */
PaceMakerComponent.prototype.getManageDevicesDialogId = function () {
    return this.getStyles().getNameSpace() + "manageDevices" + this.getComponentId();
};

/**
 * Returns the id for the associate dialog for this component.
 * @returns {STRING} The id for the associate dialog for this component.
 */
PaceMakerComponent.prototype.getAssociateDialogId = function () {
    return this.getStyles().getNameSpace() + "AssociateDeviceDialog" + this.getComponentId();
};

/**
 * Construct the HTML for the manage devices dialog.
 * @returns {STRING} The HTML for the manage devices dialog.
 */
PaceMakerComponent.prototype.constructDeviceManagement = function() {
    var manageDevicesHtml = "";

    manageDevicesHtml += this.constructDeviceManagementDisassociation(this.getDevicePIDs());
    manageDevicesHtml += this.constructDeviceManagementAssociation();

    return manageDevicesHtml;
};

/**
 * Constructs an array of device PIDs from the <code>this.JSONData</code> member.
 * @returns {DevicePID[]} An array of device PIDs.
 */
PaceMakerComponent.prototype.getDevicePIDs = function () {
    var deviceIdx,
        devicePIDs = [];

    if ($.isEmptyObject(this.JSONData.PULSE_GENS) === false) {
        for (deviceIdx = 0; deviceIdx < this.JSONData.PULSE_GENS.length; deviceIdx++) {
            devicePIDs.push({
                NAME_FULL_FORMATTED: this.JSONData.PULSE_GENS[deviceIdx].PID[0].NAME_FULL_FORMATTED,
                SEX_CDF: this.JSONData.PULSE_GENS[deviceIdx].PID[0].SEX_TXT,
                BIRTH_DT_TM_TXT: this.JSONData.PULSE_GENS[deviceIdx].PID[0].BIRTH_DT_TM_TXT,
                SERIAL_TXT: this.JSONData.PULSE_GENS[deviceIdx].SERIAL_TXT
            });
        }
    }

    return devicePIDs;
};

/**
 * Construct the HTML for the disassociate device section of the device management dialog.
 * @param {DevicePID[]} devices An array of devices currently associated to the patient, both current and historical.
 * @returns {STRING} The HTML for the disassociate device section of the device management dialog.
 */
PaceMakerComponent.prototype.constructDeviceManagementDisassociation = function(devices) {
    var diassociationHtml = "",
        deviceCount = devices.length,
        deviceIdx;

    diassociationHtml +=
        "<div class='pmc1-manage-dev-disassociation'>" +
        "   <div class='pmc1-search-device-label'>" +
                i18n.discernabu.cardiology_device_integration_o1.PATIENT_DEVICES +
        "   </div>" +
        "   <div class='pmc1-manage-dev-disassociation-devices'>";

    for (deviceIdx = 0; deviceIdx < deviceCount; deviceIdx++) {
        diassociationHtml += this.constructDevicePanel(devices[deviceIdx], i18n.discernabu.cardiology_device_integration_o1.DISASSOCIATE, undefined, true);
    }

    diassociationHtml +=
        "   </div>" +
        "</div>";

    return diassociationHtml;
};

/**
 * Constructs the html for a device panel for associating/disassociating a device. This panel includes the device's patient name, DOB, gender, and device serial number.
 * @param {DevicePID} deviceData Object containing information about the device.
 * @param {STRING} buttonLabel The label to give to the button.
 * @param {STRING} [customInputId] A unique id to give to the button.
 * @returns {STRING} html for the device panel.
 */
PaceMakerComponent.prototype.constructDevicePanel = function (deviceData, buttonLabel, customInputId) {
    var i18nCardiology = i18n.discernabu.cardiology_device_integration_o1,
        deviceHtml = "",
        customInputIdHtml = customInputId ? "id='" + customInputId + "'" : "";

    deviceHtml +=
        "<div class='pmc1-search-output'>" +
        "   <div class='pmc1-search-data'>" +
        "       <span class='pmc1-search-patient-name'>" + deviceData.NAME_FULL_FORMATTED + "</span>" +
        "       <span class='pmc1-serial-number'>" + deviceData.SERIAL_TXT + "</span>" +
        "       <br />" +
        "       <span class='pmc1-search-patient-dob'>" + i18nCardiology.DOB + " " + this.formatDOB(deviceData.BIRTH_DT_TM_TXT) + "</span>" +
        "       <span class='pmc1-search-patient-details'>" + i18nCardiology.SEX + " " + deviceData.SEX_CDF + "</span>" +
        "   </div>" +
        "   <div class='pmc1-add-device-btn'>" +
        "       <input type='button' " + customInputIdHtml + " name='pmc1-add-device-button' class='pmc1-associate-device-button' value='" + buttonLabel + "'/>" +
        "   </div>" +
        "   <div class='pmc1-clear-columns'></div>" +
        "</div>";

    return deviceHtml;
};

/**
 * Return the HTML for the associate device section of the device management dialog.
 * @returns {STRING} The HTML for the associate device section of the device management dialog.
 */
PaceMakerComponent.prototype.constructDeviceManagementAssociation = function() {
    var associationHtml = "";

    associationHtml +=
        "<div class='pmc1-manage-dev-association'>" +
            this.constructDeviceSearch("pmc1-search-device-content-manage-dev") +
            this.constructDeviceManagementAssistedAssociation() +
        "</div>" +
        "<div class='pmc1-clear-columns'></div>";

    return associationHtml;
};

/**
 * Return the HTML for the assisted search container. The HTML for the search results will be appended to the container asynchronously.
 * @returns {STRING} The container that will be filled with the search results after the search results are retrieved.
 */
PaceMakerComponent.prototype.constructDeviceManagementAssistedAssociation = function() {
    var thisComponent = this,
        containerClass = "pmc1-manage-dev-assisted";

    this.getSuggestedDevicesToAssociate(this.getCriterion().person_id, function(scriptReply) {
        var $deviceManagement = $("div#" + thisComponent.getManageDevicesDialogId() + "body"),
            $assistedContainer = $deviceManagement.find("div." + containerClass),
            assistedContainerHtml = "",
            scriptStatus = scriptReply.getStatus();

        $assistedContainer.empty();
        if (scriptStatus === "S") {
            assistedContainerHtml +=
                "<div class='pmc1-search-device-label'>" +
                    i18n.discernabu.cardiology_device_integration_o1.POSSIBLE_MATCHES +
                "</div>" +
                "<div class='pmc1-suggested-matches'>" +
                    thisComponent.populateSuggestedMatches(scriptReply, true) +
                "</div>";
            $assistedContainer.append(assistedContainerHtml);
            $assistedContainer.find(".pmc1-manage-dev-undo").hide();
            thisComponent.setDeviceManagementAssistedAssociationEvents($assistedContainer, $deviceManagement.find(".pmc1-manage-dev-disassociation"));
        } else if (scriptStatus === "Z") {
            assistedContainerHtml +=
                "<div class='pmc1-search-device-label'>" +
                    i18n.discernabu.cardiology_device_integration_o1.NO_DEVICE +
                    "<br/>" +
                    i18n.discernabu.cardiology_device_integration_o1.NO_DEVICE_1 +
                "</div>";
            $assistedContainer.append(assistedContainerHtml);
        } else {
            logger.logScriptCallError(this, scriptReply, "cardiology-device-o1.js", "constructDeviceManagementAssistedAssociation");
        }
    });

    return "<div class='" + containerClass + "'></div>";
};

/**
 * Sets the events for all elements in the device management dialog.
 * @param {jQuery} $deviceManagement A jQuery object of the entire dialog.
 * @returns {UNDEFINED} Nothing.
 */
PaceMakerComponent.prototype.setDeviceManagementEvents = function ($deviceManagement) {
    this.setDeviceManagementDisassociationEvents($deviceManagement.find(".pmc1-manage-dev-disassociation"));
    this.setDeviceManagementAssociationEvents($deviceManagement.find(".pmc1-search-device-content-manage-dev"), $deviceManagement.find(".pmc1-manage-dev-assisted"));
};

/**
 * Sets the events for all elements in the device disassociation section of the device management dialog.
 * @param {jQuery} $disassociation A jQuery object of the device disassociation section of the device management dialog.
 * @returns {UNDEFINED} Nothing.
 */
PaceMakerComponent.prototype.setDeviceManagementDisassociationEvents = function ($disassociation) {
    var thisComponent = this,
        $disassociateButtons = $disassociation.find(".pmc1-associate-device-button"),
        disassociateButtonCount = $disassociateButtons.length,
        disassociateButtonIdx,
        pulseGenIdKey = "pulseGenId";

    // attach the device ids to the buttons' data elements
    for (disassociateButtonIdx = 0; disassociateButtonIdx < disassociateButtonCount; disassociateButtonIdx++) {
        $disassociateButtons.eq(disassociateButtonIdx).data(pulseGenIdKey, this.JSONData.PULSE_GENS[disassociateButtonIdx].PULSE_GEN_ID);
    }

    $disassociateButtons.click(function () {
        var $disassociateButton = $(this);

        if ($disassociateButton.val() === i18n.discernabu.cardiology_device_integration_o1.DISASSOCIATE) {
            thisComponent.addDeviceToDisassociate($disassociateButton.data(pulseGenIdKey));
            $disassociateButton.attr("value", i18n.discernabu.cardiology_device_integration_o1.UNDO);
        }
        else {
            thisComponent.removeDeviceToDisassociate($disassociateButton.data(pulseGenIdKey));
            $disassociateButton.attr("value", i18n.discernabu.cardiology_device_integration_o1.DISASSOCIATE);
        }
    });
};

/**
 * Sets the events for all elements in the device association section of the device management dialog.
 * @param {jQuery} $manualAssociation A jQuery object of the manual association part of the device management dialog.
 * @param {jQuery} $assistedAssociation A jQuery object of the assisted association part of the device management dialog.
 * @returns {UNDEFINED} Nothing.
 */
PaceMakerComponent.prototype.setDeviceManagementAssociationEvents = function ($manualAssociation, $assistedAssociation) {
    var $manualSearchButton = $manualAssociation.find(".pmc1-find-device-btn");

    this.setDeviceManagementManualAssociationEvents($manualAssociation);

    // when a manual search is issued, make the "assisted search" disappear
    $manualSearchButton.click(function() {
        $assistedAssociation.hide();
    });
};

/**
 * Sets the events for the manual association part of the device management dialog.
 * @param {jQuery} $manualAssociation A jQuery object of the manual association part of the device management dialog.
 * @returns {UNDEFINED} Nothing.
 */
PaceMakerComponent.prototype.setDeviceManagementManualAssociationEvents = function ($manualAssociation) {
    var thisComponent = this;

    this.postProcessingSearchDevice(this, $manualAssociation, function(deviceId, reply) {
        var $associationButton = $manualAssociation.find(".pmc1-associate-device-button"),
            $disassociation = $("div#" + thisComponent.getManageDevicesDialogId() + "body .pmc1-manage-dev-disassociation"),
            $undoButton,
            $devicePanel,
            deviceInfo,
            devicePID;

        // did this get associated via an "associate anyway"? there won't be an association button if that's the case
        if ($associationButton.length === 0) {
            // since a device card doesn't exist, one will have to be constructed before moving it to the other side of the dialog
            deviceInfo = reply.getResponse().PULSE_GENS[0];
            devicePID = {
                NAME_FULL_FORMATTED: deviceInfo.NAME_FULL_FORMATTED,
                SEX_CDF: deviceInfo.SEX_CDF,
                BIRTH_DT_TM_TXT: deviceInfo.BIRTH_DT_TM_TXT,
                SERIAL_TXT: deviceInfo.SERIAL_TXT
            };

            $devicePanel = $(thisComponent.constructDevicePanel(devicePID, i18n.discernabu.cardiology_device_integration_o1.ASSOCIATE, undefined, true));
            $associationButton = $devicePanel.find(".pmc1-associate-device-button");
            $manualAssociation.find(".pmc1-search-results").empty();
        }

        $associationButton.data("pulseGenId", deviceId);
        if ($associationButton.val() === i18n.discernabu.cardiology_device_integration_o1.ASSOCIATE) {
            thisComponent.onClickDeviceManagementAssociationButton($associationButton, $disassociation);
            $undoButton = $associationButton;
            $undoButton.click(function() {
                thisComponent.onClickDeviceManagementUndoButton($undoButton, $manualAssociation.find(".pmc1-search-results"));
            });
        }
    });
};

/**
 * Sets the events for the assisted association part of the device management dialog.
 * @param {jQuery} $assistedAssociation A jQuery object of the assisted association part of the device management dialog.
 * @param {jQuery} $disassociation A jQuery object of the disassociation part of the device management dialog.
 * @returns {UNDEFINED} Nothing.
 */
PaceMakerComponent.prototype.setDeviceManagementAssistedAssociationEvents = function ($assistedAssociation, $disassociation) {
    var thisComponent = this,
        $associateButtons = $assistedAssociation.find(".pmc1-associate-device-button"),
        associateButtonsCount = $associateButtons.length,
        associateButtonIdx,
        $associateButton;

    // store the pulse gen id to associate to the button's data element
    for (associateButtonIdx = 0; associateButtonIdx < associateButtonsCount; associateButtonIdx++) {
        $associateButton = $associateButtons.eq(associateButtonIdx);
        $associateButton.data("pulseGenId", this.suggestedMatchPulseGenIDs[associateButtonIdx]);
        $associateButton.click({
            scope: $associateButton,
            thisComponent: thisComponent,
            $assistedAssociation: $assistedAssociation,
            $disassociation: $disassociation
        }, thisComponent.setAssociateButtonClickHandler
        );
    }
};

/**
 * Sets the events for the associate button click within assisted association
 * @param {Object} eventData Contains reference to the assisted association dialog objects
 * @returns {UNDEFINED} Nothing.
 */
PaceMakerComponent.prototype.setAssociateButtonClickHandler = function (eventData) {
    var $associateButton = eventData.data.scope,
        $assistedAssociation = eventData.data.$assistedAssociation,
        $disassociation = eventData.data.$disassociation,
        thisComponent = eventData.data.thisComponent;
    if ($associateButton.val() === i18n.discernabu.cardiology_device_integration_o1.ASSOCIATE) {
        thisComponent.onClickDeviceManagementAssociationButton($associateButton, $disassociation);
    } else {
        thisComponent.onClickDeviceManagementUndoButton($associateButton, $assistedAssociation);
    }
};

/**
 * Handler for the onclick event for an "Associate" button in the device management dialog.
 * @param {jQuery} $addDeviceButton The "Associate" button.
 * @param {jQuery} $disassociation The entire disassociation panel.
 * @returns {VOID} Nothing.
 */
PaceMakerComponent.prototype.onClickDeviceManagementAssociationButton = function ($addDeviceButton, $disassociation) {
    var $devicePanel,
        selectedClass = "pmc1-manage-dev-association-selected";

    // don't bother doing anything if this device is already associated
    if ($addDeviceButton.hasClass(selectedClass) === false) {
        $devicePanel = $addDeviceButton.parents(".pmc1-search-output");

        $addDeviceButton
            .addClass(selectedClass)
            .attr("value", i18n.discernabu.cardiology_device_integration_o1.UNDO);
        this.addDeviceToAssociate($addDeviceButton.data("pulseGenId"));
        $devicePanel.detach();
        $disassociation.append($devicePanel);
    }
};

/**
 * Handler for the onclick event for an "Undo" button in the device management dialog.
 * @param {jQuery} $undoButton The "Undo" button.
 * @param {jQuery} $undoTarget Where the device panel will get moved to when the undo button is clicked.
 * @returns {VOID} Nothing.
 */
PaceMakerComponent.prototype.onClickDeviceManagementUndoButton = function ($undoButton, $undoTarget) {
    var $devicePanel = $undoButton.parents(".pmc1-search-output"),
        suggestedPulseGenId = $undoButton.data("pulseGenId"),
        selectedClass = "pmc1-manage-dev-association-selected";

    $undoButton
        .removeClass(selectedClass)
        .attr("value", i18n.discernabu.cardiology_device_integration_o1.ASSOCIATE);
    this.removeDeviceToAssociate(suggestedPulseGenId);
    $devicePanel.detach();
    $undoTarget.append($devicePanel);
};

/**
 * Add a device id to the <code>devicesToAssociate</code> array if the device isn't already in the array.
 * @param {NUMBER} deviceId The device id to add to the <code>devicesToAssociate</code> array.
 * @returns {UNDEFINED} Nothing.
 */
PaceMakerComponent.prototype.addDeviceToAssociate = function (deviceId) {
    this.addUniqueToArray(deviceId, this.devicesToAssociate);
};

/**
 * Remove a device id from the <code>devicesToAssociate</code> array.
 * @param {NUMBER} deviceId The device id to remove from the <code>devicesToAssociate</code> array.
 * @returns {UNDEFINED} Nothing.
 */
PaceMakerComponent.prototype.removeDeviceToAssociate = function (deviceId) {
    this.removeFromArray(deviceId, this.devicesToAssociate);
};

/**
 * Add a device id to the <code>devicesToDisassociate</code> array if the device isn't already in the array.
 * @param {NUMBER} deviceId The device id to add to the <code>devicesToDisassociate</code> array.
 * @returns {UNDEFINED} Nothing.
 */
PaceMakerComponent.prototype.addDeviceToDisassociate = function (deviceId) {
    this.addUniqueToArray(deviceId, this.devicesToDisassociate);
};

/**
 * Remove a device id from the <code>devicesToDisassociate</code> array.
 * @param {NUMBER} deviceId The device id to remove from the <code>devicesToDisassociate</code> array.
 * @returns {UNDEFINED} Nothing.
 */
PaceMakerComponent.prototype.removeDeviceToDisassociate = function (deviceId) {
    this.removeFromArray(deviceId, this.devicesToDisassociate);
};

/**
 * Add a value to the specified array if the value doesn't already exist.
 * @param {*} val The value to uniquely add to the array.
 * @param {*[]} arr The array to uniquely add the value to.
 * @returns {UNDEFINED} Nothing.
 */
PaceMakerComponent.prototype.addUniqueToArray = function (val, arr) {
    if ($.inArray(val, arr) === -1) {
        arr.push(val);
    }
};

/**
 * Remove a value to the specified array.
 * @param {*} val The value to remove from the array.
 * @param {*[]} arr The array to remove the value from.
 * @returns {UNDEFINED} Nothing.
 */
PaceMakerComponent.prototype.removeFromArray = function (val, arr) {
    var valIdx = $.inArray(val, arr);

    if (valIdx !== -1) {
        arr.splice(valIdx, 1);
    }
};

/**
 * Appends all the events for device search functionality
 * (Included as a separate function in case normal post processing doesn't fire in "no results" case)
 *
 * @param    {OBJECT}    component        - Reference to the component; would be "this" instead this is called from a callback thread.
 * @param   {OBJECT}    $self  OPTIONAL - Reference to this.scopeObj (if not valid in context, pass nothing and it will find)
 * @param {FUNCTION} [associateFunc] - Function to call when the "associate" button is clicked. If not set, <code>handleSearchDevice</code> will be called.
 * @returns {UNDEFINED} Nothing
 */
PaceMakerComponent.prototype.postProcessingSearchDevice = function(component, $self, associateFunc) {
    var $serialText, $searchDeviceButton, $searchResults;
    var $searchPulseGenId, $associateDevice;
    var $confirmAssociation;
    var currentPersonId = component.getCriterion().person_id;
    var thisComponent = this;
    var searchDeviceReply;

    if (!$self) {
        $self = $("#" + this.m_rootComponentNode.id);
    }

    $serialText = $self.find(component.writeUniqueID("SerialText", component, "#"));
    $searchDeviceButton = $self.find(component.writeUniqueID("SearchDeviceButton", component, "#"));
    $searchResults = $self.find(component.writeUniqueID("SearchResults", component, "#"));
    $searchPulseGenId = $(component.writeUniqueID("DevicePGId", component, "#"));
    $associateDevice = component.writeUniqueID("AssociateDevice", component, "#");
    $confirmAssociation = component.writeUniqueID("ConfirmAssociation", component, "#");

    //Just to ensure these aren't loaded more than once; needed because callbacks for multiple actions could reload this.
    if ($serialText.data("Loaded") && $serialText.data("Loaded") === 1) {//Just picking any one of these controls to flag that it's
        // loaded.
        return;
    }
    $serialText.data("Loaded", 1);

    // if no text is in the serial number search box, display grayed out placeholder text when the search box loses focus
    $serialText.on("blur", function() {
        if (this.value === "") {
            this.value = i18n.discernabu.cardiology_device_integration_o1.PACEMAKER_SN;
            $serialText.css("color", "#9f9f9f");
        }
    });
    // if there is placeholder text in the serial number search box, remove it when the search box receives focus
    $serialText.on("focus", function() {
        if (this.value === i18n.discernabu.cardiology_device_integration_o1.PACEMAKER_SN) {
            this.value = "";
            $serialText.css("color", "#000");
        }
    });

    $searchDeviceButton.on("click", function() {
        var deviceText = $serialText.val();
        if (deviceText !== i18n.discernabu.cardiology_device_integration_o1.PACEMAKER_SN && deviceText !== "") {
            $searchResults.html("<div></div>");
            component.performManualDeviceSearch(
                deviceText,
                function(reply) {
                    searchDeviceReply = reply;
                    component.handleSearchDevice(reply);
                });
        }
        else {
            $searchResults.html("<div class='pmc1-device-search-errorMsg'> <span>" + i18n.discernabu.cardiology_device_integration_o1.NO_MATCHES + "</span></div>");
        }
    });

    // add association button click
    $searchResults.on("click", $associateDevice, function() {
        if (associateFunc) {
            associateFunc($searchPulseGenId.val());
        } else {
            component.updateDeviceAssociation(
            $searchPulseGenId.val(),
            currentPersonId,
            function(reply) {
                // somewhere around here is where the dialog should be closed
                component.handleAssociate(reply);
            });
        }
    });

    // Association Anyway link on click
    $searchResults.on("click", $confirmAssociation, function() {
        var existingPatientName = $(component.writeUniqueID("existingPatientName", component, "#")).val();
        var deviceAlias = $(component.writeUniqueID("DeviceAlias", component, "#")).val();
        var deviceAliasType = $(component.writeUniqueID("DeviceAliasType", component, "#")).val();
        var modalDialogId = component.writeUniqueID("ConfirmAssociationDialog", component, "");
        var showAllDialog, confirmMsgHTML, modal;

        //buttons for confirm association and cancel association
        var assocButton = new ModalButton("pmc1-confirm-association"), cancelButton = new ModalButton("pmc1-confirm-cancel");

        //confirm Cancel button settings
        cancelButton
            .setText(i18n.discernabu.cardiology_device_integration_o1.CANCEL)
            .setIsDithered(false)
            .setCloseOnClick(true);

        assocButton
            .setText(i18n.discernabu.cardiology_device_integration_o1.ASSOCIATE)
            .setIsDithered(false)
            .setCloseOnClick(true)
            .setFocusInd(true)
            .setOnClickFunction(function() {
            var tempDeviceId = $searchPulseGenId.val();

            if (associateFunc) {
                associateFunc($searchPulseGenId.val(), searchDeviceReply);
            } else {
                tempDeviceId = $searchPulseGenId.val();
                if (tempDeviceId !== "") {
                    thisComponent.updateDeviceAssociation(tempDeviceId, currentPersonId, function (reply) {
                        component.handleAssociate(reply);
                    });
                }
            }
        });
        // Confirm Association Button settings

        //Modal dialog for Association Confirm box
        showAllDialog = new ModalDialog(modalDialogId);
        //Settings for confirm Modal dialog box
        showAllDialog
            .setLeftMarginPercentage(33)
            .setRightMarginPercentage(33)
            .setTopMarginPercentage(20)
            .setBottomMarginPercentage(20)
            .setHeaderTitle(i18n.discernabu.cardiology_device_integration_o1.ASSOCIATE_PACEMAKER)
            .setIsBodySizeFixed(false)
            .setIsFooterAlwaysShown(true)
            .addFooterButton(assocButton)
            .addFooterButton(cancelButton);

        MP_ModalDialog.addModalDialogObject(showAllDialog);
        MP_ModalDialog.showModalDialog(modalDialogId);

        //Confirm box Body HTML
        confirmMsgHTML = "<div class='pmc1-search-info-icon'><img src='" + component.staticImagePath + "/4017_24.png' alt='information'/></div><div class='pmc1-search-info-text'>" + i18n.discernabu.cardiology_device_integration_o1.ASSOCIATION_WARNING.replace(/\{0\}/g, existingPatientName).replace(/\{1\}/g, deviceAliasType).replace(/\{2\}/g, deviceAlias) + "</div>";

        modal = MP_ModalDialog.retrieveModalDialogObject(modalDialogId);
        modal.setBodyHTML(confirmMsgHTML);
    });
};

/**
 * Appends all the events for tabbed view
 * (Included as a separate function in case normal post processing doesn't fire in "no results" case)
 *
 * @param    {OBJECT}    component        - Reference to the component; would be "this" instead this is called from a callback thread.
 * @param   {OBJECT}    $self  OPTIONAL - Reference to this.scopeObj (if not valid in context, pass nothing and it will find)
 * @returns {UNDEFINED} Nothing
 */
PaceMakerComponent.prototype.postProcessingTabbedView = function(component, $self) {
    var $tabbedView;
    var tabClickedIndex;
    var $oldSelectedTab, $newSelectedTab;
    var $oldSelectedTabTop, $newSelectedTabTop;
    var $oldSelectedLeft, $oldSelectedRight;
    var $newSelectedLeft, $newSelectedRight;

    if (!$self) {
        $self = $("#" + this.m_rootComponentNode.id);
    }

    $tabbedView = $self.find(component.writeUniqueID("TabbedView", component, true));

    //Just to ensure these aren't loaded more than once; needed because callbacks for multiple actions could reload this.
    if ($tabbedView.data("Loaded") && $tabbedView.data("Loaded") === 1) {//Just picking any one of these controls to flag
        // that it's loaded.
        return;
    }
    $tabbedView.data("Loaded", 1);

    //Make sure that if they click on a tab top, it will change the tabs accordingly.
    $tabbedView.delegate(".pmc1-tab-top", "click", function() {
        tabClickedIndex = $(this).index();
        //Shows which tab they clicked...e.g., tab 0, 1, etc.

        if (tabClickedIndex !== component.tabActive) {
            //Switch the tabs
            try {
                $oldSelectedTab = $self.find(component.writeUniqueID("TabArea" + component.tabActive, component, true));
                $newSelectedTab = $self.find(component.writeUniqueID("TabArea" + tabClickedIndex, component, true));
                $oldSelectedTab.removeClass("div-tab-item-selected").addClass("div-tab-item-not-selected");
                $newSelectedTab.removeClass("div-tab-item-not-selected").addClass("div-tab-item-selected");

                //Now also swap classes for tab tops.  This is in case we want the tap tops to look different depending on what's selected.
                $oldSelectedTabTop = $self.find(component.writeUniqueID("LiTab" + component.tabActive, component, true));
                $newSelectedTabTop = $self.find(component.writeUniqueID("LiTab" + tabClickedIndex, component, true));
                $oldSelectedTabTop.removeClass("pmc1-tab-top-selected").addClass("pmc1-tab-top-not-selected");
                $newSelectedTabTop.removeClass("pmc1-tab-top-not-selected").addClass("pmc1-tab-top-selected");

                //Now deal with the edges
                $oldSelectedLeft = $oldSelectedTabTop.find(".pmc1-tab-left-edge-active");
                $oldSelectedRight = $oldSelectedTabTop.find(".pmc1-tab-right-edge-active");
                $newSelectedLeft = $newSelectedTabTop.find(".pmc1-tab-left-edge");
                $newSelectedRight = $newSelectedTabTop.find(".pmc1-tab-right-edge");

                $oldSelectedLeft.removeClass("pmc1-tab-left-edge-active").addClass("pmc1-tab-left-edge");
                $oldSelectedRight.removeClass("pmc1-tab-right-edge-active").addClass("pmc1-tab-right-edge");
                $newSelectedLeft.removeClass("pmc1-tab-left-edge").addClass("pmc1-tab-left-edge-active");
                $newSelectedRight.removeClass("pmc1-tab-right-edge").addClass("pmc1-tab-right-edge-active");

            }
            catch(err) {
                MP_Util.LogJSError(this, err, "PaceMakerComponent.js", "postProcessingTabbedView");
                throw err;
            }

            //Important to set this to the new one.
            component.tabActive = tabClickedIndex;
        }
    });

};
/**
 * Appends all the events for suggested matches functionality; kept separate from "device search" functionality in case these may
 * ever appear separately
 * (Included as a separate function in case normal post processing doesn't fire in "no results" case)
 *
 * @param    {OBJECT}    component        - Reference to the component; would be "this" instead this is called from a callback thread.
 * @param   {OBJECT}    [$self]         - Reference to this.scopeObj (if not valid in context, pass nothing and it will find)
 * @param   {BOOLEAN}   [inactivateCurrentDevice] If true, the current active device will be inactivated. If not set or false, the current device will remain active.
 * @returns {UNDEFINED} Nothing
 */
PaceMakerComponent.prototype.postProcessingSuggestedMatches = function (component, $self, inactivateCurrentDevice) {
    var $suggMatchResults,
        thisComponent = this;

    if (!$self) {
        $self = $("#" + this.m_rootComponentNode.id);
    }

    $suggMatchResults = $self.find("#pmc1-sugg-match-results");

    //Just to ensure these aren't loaded more than once; needed because callbacks for multiple actions could reload this.
    if ($suggMatchResults.data("Loaded") && $suggMatchResults.data("Loaded") === 1) {//Just picking any one of these controls to flag
        // that it's loaded.
        return;
    }
    $suggMatchResults.data("Loaded", 1);

    //Here's the main business of this function:  Make sure that if they click Add, it will assign the device.
    //Assumes the existing structure of how the HTML is written where inside $suggMatchResults there's a list of multiple
    //elements of class pmc1-sugg-match-output, and inside that we'll find the index button in such a way that it's index will be
    // 0,1,2...etc.
    //for each button of the list.
    $suggMatchResults.delegate(".pmc1-sugg-match-output", "click", function(event) {
        //Prevent clicks that are merely "near" the associate button from triggering associate.
        if ($(event.target).hasClass("pmc1-add-device-button")) {
            // when updating the device association, the index of "this" relative to its siblings corresponds to
            //  the suggestedMatchPulseGenIDs index, which will give the pulse gen id to be associated
            if (inactivateCurrentDevice !== undefined && inactivateCurrentDevice === true) {
                // this is currently taking the naive approach and simply inactivating the most recent device.
                //  some smarts will need to be baked into here to make sure that the device that's being activated
                //  isn't actually older than the most recent device...but that's another user story.
                thisComponent.inactivateDevice(
                    thisComponent.JSONData.PULSE_GENS[0].PULSE_GEN_ID,
                    new Date(),
                    thisComponent.updateDeviceAssociation(
                        component.suggestedMatchPulseGenIDs[$(this).index()],
                        thisComponent.getCriterion().person_id,
                        function(reply) {
                            // somewhere around here is where the dialog should be closed
                            thisComponent.handleAssociate(reply);
                        }));
            } else {
                thisComponent.updateDeviceAssociation(
                    component.suggestedMatchPulseGenIDs[$(this).index()],
                    thisComponent.getCriterion().person_id,
                    thisComponent.handleAssociate);
            }
        }
    });
};

/**
 * Calls <code><a href="http://scriptexplorer.cerner.corp/index.cgi?script=PEX_UPDATE_DEVICE_ASSOCIATION">PEX_UPDATE_DEVICE_ASSOCIATION</a></code>
 * with the specified arguments.
 * @param {NUMBER} pulseGenId The pulse gen id to associate to a person.
 * @param {NUMBER} personId The person to associate the pulse gen to. Set to 0 to disassociate the pulse gen from a person.
 * @param {scriptReplyCallback} responseHandler The callback to handle the script reply.
 * @returns {UNDEFINED} Nothing
 */
PaceMakerComponent.prototype.updateDeviceAssociation = function(pulseGenId, personId, responseHandler) {
    //Note: Unlike with the search device, currently they don't want suggested matches to return already-associated devices.
    //Therefore, for now, we won't include any code for existing patient or MRN.
    //Calls the script without the timer, as this is not the main load.
    var request = new ScriptRequest();

    request
        .setProgramName("PEX_UPDATE_DEVICE_ASSOCIATION")
        .setParameterArray(["^MINE^", pulseGenId + ".00", personId + ".00"])
        .setAsyncIndicator(true)
        .setResponseHandler(function(reply) {
            responseHandler(reply);
        })
        .performRequest();
};

/**
 * Activates a device by calling <code><a href="http://scriptexplorer.cerner.corp/index.cgi?script=PEX_UPDT_DEVICE_REMOVAL_DT_TM">PEX_UPDT_DEVICE_REMOVAL_DT_TM</a></code>
 * with the specified arguments.
 * @param {NUMBER} pulseGenId The pulse gen id to activate.
 * @param {scriptReplyCallback} responseHandler The callback to handle the script reply.
 * @returns {UNDEFINED} Nothing
 */
PaceMakerComponent.prototype.activateDevice = function(pulseGenId, responseHandler) {
    var request = new ScriptRequest();

    request
        .setProgramName("PEX_UPDT_DEVICE_REMOVAL_DT_TM")
        .setParameterArray(["^MINE^", pulseGenId + ".00", "1", ""])
        .setAsyncIndicator(true)
        .setResponseHandler(function(reply) {
            responseHandler(reply);
        })
        .performRequest();
};

/**
 * Inactivates a device by calling <code><a href="http://scriptexplorer.cerner.corp/index.cgi?script=PEX_UPDT_DEVICE_REMOVAL_DT_TM">PEX_UPDT_DEVICE_REMOVAL_DT_TM</a></code>
 * with the specified arguments.
 * @param {NUMBER} pulseGenId The pulse gen id to activate.
 * @param {DATE} removalDtTm The date/time the pulse generator was inactivated.
 * @param {scriptReplyCallback} responseHandler The callback to handle the script reply.
 * @returns {UNDEFINED} Nothing
 */
PaceMakerComponent.prototype.inactivateDevice = function(pulseGenId, removalDtTm, responseHandler) {
    var request = new ScriptRequest();

    request
        .setProgramName("PEX_UPDT_DEVICE_REMOVAL_DT_TM")
        .setParameterArray(["^MINE^", pulseGenId + ".00", "0", removalDtTm.toUTCString()])
        .setAsyncIndicator(true)
        .setResponseHandler(function(reply) {
            responseHandler(reply);
        })
        .performRequest();
};

/**
 * Function to handle the logic and sequence of what should happen when various callback functions are called from an
 * XMLCCLRequestCallBack
 *
 * @param   {OBJECT}    reply             The object automatically passed by the XMLCCLRequestCallBack that serves as this handler's "bridge"
 * to everything
 * @param    {STRING}    sZMessage        Custom string to be passed in case of "Z" (no records returned by CCL)
 * @param    {NUMBER}    ZSearchDevice    1 - include device search; 3 (1+2) - include device search and force post processing for it
 *                                        4 - suggested matches, 8 - post-processing for sugg. matches
 * @param    {FUNCTION}    fSuccess        Callback function (with reply as parameter) to say what to do in "S" (success) case.
 *                                             Note: If fSuccess isn't passed, it assumes "default" behavior which means reload the screen
 *                                            and flag that there's no main data for the component.
 * @param    {FUNCTION}    fZ                Callback function (with reply as parameter) to say what to do in "Z" case, if needed for custom
 * functioning
 * @param    {FUNCTION}    fFinally        Callback function (with reply as parameter) to say what to do in all cases at the end
 * @returns {UNDEFINED} Nothing
 */
PaceMakerComponent.prototype.handleCallbackLogic = function(reply, sZMessage, ZSearchDevice, fSuccess, fZ, fFinally) {
    var component = this;
    var errMsg = [];
    var opHTML = "";
    var arrTabs = [];
    var tabObject;
    var compId = component.getComponentId();
    var pmc1MessageType = MPageControls.AlertMessage.MessageTypes.INFORMATION;
    var template = MPageControls.getDefaultTemplates().messageBar;
    var control;
    var pmc1DisclaimerElement;
    var disclaimerText = "";
    var i18nLocal = i18n.discernabu.cardiology_device_integration_o1;
    try {
        if (reply.getStatus() === "S") {
            if (fSuccess) {
                //Process callback function for success.
                fSuccess(reply);
            }
            else {
                //No callback function?  Assume reload component
                component.retrieveComponentData(component);
            }
        }
        else if (reply.getStatus() === "Z") {
            if (fZ) {
                //Process callback function for Z response; included in case we ever need it.
                fZ(reply);
            }
            else {
                //No custom function passed; assume the default case...flag that data are gone:
                component.dataLoaded = false;
                if (sZMessage) {
                    //Write out Standard Mpage Alert message formatted as usual for Z response
                    opHTML += "<div class = 'message-container' id = 'opPacemakerSummaryDisclaimer" + compId + "'></div>";
                }
                //Assume here that any cases marked at this point will go into a tab.
                //this is DIFFERENT from other components
                if (ZSearchDevice & 4) {//Bitwise operator: detects the suggested matches option
                    tabObject = {
                        name: i18nLocal.ASSISTED_ASSOCIATION,
                        content: component.constructSuggestedMatchesPlaceholder(component)
                    };
                    arrTabs.push(tabObject);
                }
                if (ZSearchDevice & 1) {//Bitwise operator: detects the search device option
                    tabObject = {
                        name: i18nLocal.MANUAL_ASSOCIATION,
                        content: component.constructDeviceSearch(component)
                    };
                    arrTabs.push(tabObject);
                }
                if (arrTabs.length > 0) {
                    opHTML += component.constructTabbedViewHTML(component, arrTabs, 0);
                }
                component.finalizeComponent(opHTML, component.isLineNumberIncluded() ? "(0)" : "");

                //Inserting the message in the placeholder created above
                pmc1DisclaimerElement = $("#opPacemakerSummaryDisclaimer" + compId);
                if (pmc1DisclaimerElement) {
                    disclaimerText = "<span>" + sZMessage + "</span>";
                    control = new MPageControls.AlertMessage(pmc1DisclaimerElement, template, pmc1MessageType);
                    control.render(disclaimerText);
                }

                if (ZSearchDevice & 2) {//Bitwise operator: detects option to force postprocessing for search device
                    //For cases where this doesn't fire otherwise
                    component.postProcessingSearchDevice(component);
                }
                if (arrTabs.length > 0) {
                    //Bind events for tabs.  Must happen here so it's finding things after the component loads.
                    component.postProcessingTabbedView(component);
                }
                if (ZSearchDevice & 8) {//Bitwise operator: detects option to force postprocessing for suggested matches
                    //For cases where this doesn't fire otherwise
                    component.postProcessingSuggestedMatches(component);
                }
            }

        }
        else {
            //Assume "F" case or some problem.
            MP_Util.LogScriptCallError(component, reply, "master-components.js", "handleLoad");
            //Get the error message from the reply
            errMsg = component.getErrorMessage(reply);
            component.finalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component.isLineNumberIncluded() ? "(0)" : "");
        }
        if (fFinally) {//In case anything must happen in all cases at the end
            fFinally(reply);
        }
    }
    catch(err) {
        MP_Util.LogJSError(this, err, "PaceMakerComponent.js", "handleCallbackLogic");
        throw err;
    }
};

/**
 * Helper function to create an error message from a reply
 * This allows callback functions from XMLCCLRequestCallback to have errors handled in a way consistent with how XMLCclRequestWrapper
 * handles them
 * Included in this component because it uses callback functions a lot to allow custom display even in a "Z" case
 *
 * @param   {OBJECT} reply    The object automatically passed by the XMLCCLRequestCallBack that serves as this handler's "bridge" to
 * everything
 * @returns {STRING} Formatted error message
 */

PaceMakerComponent.prototype.getErrorMessage = function(reply) {
    var errorMessage = [];
    var recordData = reply.getResponse();
    var statusData = recordData.STATUS_DATA;
    var i18nCore = i18n.discernabu;
    var ss = null;
    var x, xl;

    errorMessage.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", i18nCore.STATUS, ": ", reply.status, "</li><li>", i18nCore.REQUEST, ": ", reply.requestText, "</li>");
    if (statusData.SUBEVENTSTATUS.length && statusData.SUBEVENTSTATUS.length > 0) {
        for (x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
            ss = statusData.SUBEVENTSTATUS[x];
            errorMessage.push("<li>", i18nCore.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18nCore.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18nCore.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18nCore.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
        }
    }
    else if (statusData.SUBEVENTSTATUS.length === undefined) {
        ss = statusData.SUBEVENTSTATUS;
        errorMessage.push("<li>", i18nCore.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18nCore.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18nCore.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18nCore.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
    }
    errorMessage.push("</ul>");
    return errorMessage;
};

/**
 * Callback function to respond to when a user clicks the button to associate the device (goes with the "device search" changes).
 *
 * @param   {OBJECT}    reply  The object automatically passed by the XMLCCLRequestCallBack that serves as this handler's "bridge" to
 * everything
 * @returns {UNDEFINED} Nothing
 */
PaceMakerComponent.prototype.handleAssociate = function(reply) {
    //Get reference to the component ("this") from inside the callback.
    var component = reply.getComponent();
    //Message just to handle unexpected "Z" case
    var msg = i18n.discernabu.cardiology_device_integration_o1.UNABLE_TO_ADD_DEVICE;
    //Reloads with new data
    component.handleCallbackLogic(reply, msg, 1);
};

/**
 * Callback function to respond to when a user clicks the button to disassociate the device (goes with the "unassociate" changes).
 *
 * @param   {OBJECT}    reply  The object automatically passed by the XMLCCLRequestCallBack that serves as this handler's "bridge" to
 * everything
 * @returns {UNDEFINED} Nothing
 */
PaceMakerComponent.prototype.handleDisassociate = function(reply) {
    //Get reference to the component ("this") from inside the callback.
    var component = reply.getComponent();
    //Message just to handle unexpected "Z" case
    var msg = i18n.discernabu.cardiology_device_integration_o1.UNABLE_TO_REMOVE_DEVICE;
    //Reloads with new data. Note that even if they disassociate, there may be data from an old device!
    component.handleCallbackLogic(reply, msg, 1);
};

/**
 * Callback function to load the component and give control to display custom message if no device is found for the patient.
 *
 * @param   {OBJECT}    reply  The object automatically passed by the XMLCCLRequestCallBack that serves as this handler's "bridge" to
 * everything
 * @returns {UNDEFINED} Nothing
 */
PaceMakerComponent.prototype.handleLoad = function(reply) {
    //Get reference to the component ("this") from inside the callback.
    var component = reply.getComponent();
    //Message just to handle unexpected "Z" case
    var msgSrc = i18n.discernabu.cardiology_device_integration_o1;
    var msg = msgSrc.NO_DEVICE + " " + msgSrc.NO_DEVICE_1;

    //Person ID of the user in chart.
    component.handleCallbackLogic(reply, msg, 15, component.renderOnCallback, null, function(replyCallbackLogic) {//Callback function handles the
        // "finally" case.
        if (replyCallbackLogic.getStatus() === "Z") {
            //LOAD SUGGESTED MATCHES
            //Currently this only happens in the Z case.  So we could have put it into handleCallbackLogic via another ZSearchDevice enum value,
            //but we're putting it here for lower coupling.  It's also possible that in the future, this IF condition could get expanded.
            //Pass in component only, not timer name, because this is not the main component load.
            component.getSuggestedDevicesToAssociate(component.getCriterion().person_id);
        }
    });
};

/**
 * Calls <code><a href="http://scriptexplorer.cerner.corp/index.cgi?script=PEX_GET_DEVICES_TO_ASSOCIATE">PEX_GET_DEVICES_TO_ASSOCIATE</a></code>
 * with the specified personId.
 * @param {NUMBER} personId The person id to call <code>PEX_GET_DEVICES_TO_ASSOCIATE</code> with.
 * @param {scriptReplyCallback} [responseHandler] The callback to handle the script reply. If not set, the response handler will default to <code>handleLoadingSuggestedMatches</code>.
 * @returns {UNDEFINED} Nothing
 */
PaceMakerComponent.prototype.getSuggestedDevicesToAssociate = function(personId, responseHandler) {
    var thisComponent = this;
    var request = new ScriptRequest();

    request
        .setProgramName("PEX_GET_DEVICES_TO_ASSOCIATE")
        //Most "2" gets suggested matches. Pass in person ID so it gets them for this patient.
        .setParameterArray(["^MINE^", "2", "1", "^^", personId])
        .setAsyncIndicator(true)
        .setResponseHandler(function(scriptReply) {
            if (responseHandler === undefined) {
                thisComponent.handleLoadingSuggestedMatches(scriptReply);
            } else {
                responseHandler(scriptReply);
            }
        })
        .performRequest();
};

/**
 * Calls <code><a href="http://scriptexplorer.cerner.corp/index.cgi?script=PEX_GET_DEVICES_TO_ASSOCIATE">PEX_GET_DEVICES_TO_ASSOCIATE</a></code>
 * searching for the specified pulse gen serial.
 * @param {STRING} pulseGenSerial The pulse gen serial to search for.
 * @param {scriptReplyCallback} responseHandler The callback to handle the script reply.
 * @returns {UNDEFINED} Nothing
 */
PaceMakerComponent.prototype.performManualDeviceSearch = function(pulseGenSerial, responseHandler) {
    var request = new ScriptRequest();

    request
        .setProgramName("PEX_GET_DEVICES_TO_ASSOCIATE")
        .setParameterArray(["^MINE^", "1", "1", "^" + encodeURIComponent(pulseGenSerial) + "^"])
        .setAsyncIndicator(true)
        .setResponseHandler(function(scriptReply) {
            responseHandler(scriptReply);
        })
        .performRequest();
};

/**
 * Callback function to reload the component with suggested matches, once it has been found that the user's chart has no device.
 *
 * @param   {OBJECT}    reply  The object automatically passed by the XMLCCLRequestCallBack that serves as this handler's "bridge" to
 * everything
 * @returns {UNDEFINED} Nothing
 */
PaceMakerComponent.prototype.handleLoadingSuggestedMatches = function(reply) {
    var suggmatchVal,
        i18nCore = i18n.discernabu.cardiology_device_integration_o1,
        component = this;

    //Process cases
    component.handleCallbackLogic(reply, "", 0, function(replyCallbackLogic) {//Success
        suggmatchVal = component.populateSuggestedMatches(replyCallbackLogic);
    }, function() {//No matches found at all.
        //This is the core message "No results found. Associate manually to receive device data."
        suggmatchVal = "<div class = 'pmc1-no-results-errorMsg'><b>" + i18nCore.NO_DEVICE + "</b><br />" + i18nCore.NO_DEVICE_1 + "</div>";
    }, function() {//Finally
        $(".pmc1-sugg-match-results").html(suggmatchVal);
    });

};

/**
 * Process normal loading of the component after callback
 * @param {OBJECT} reply  The object automatically passed by the XMLCCLRequestCallBack that serves as this handler's "bridge" to everything
 * @returns {UNDEFINED} Nothing
 */
PaceMakerComponent.prototype.renderOnCallback = function(reply) {
    var recordData = reply.getResponse();
    var component = reply.getComponent();
    var renderTimer = null;
    var i18nCore = i18n.discernabu;
    var secTitle;
    try {
        renderTimer = MP_Util.CreateTimer(component.getComponentRenderTimerName(), component.getCriterion().category_mean);
        secTitle = Util.Style.g("sec-total", component.getRootComponentNode(), "span");
        secTitle[0].innerHTML = i18nCore.RENDERING_DATA + "...";
        //Call the generic component loading renderComponent function so the component can render its content.
        component.renderComponent(recordData);
    }
    catch (err) {
        MP_Util.LogJSError(err, component, "master-components.js", "handleLoad");
        if (renderTimer) {
            renderTimer.Abort();
            renderTimer = null;
        }
        throw err;
    }
    finally {
        if (renderTimer) {
            renderTimer.Stop();
        }
    }
};

/**
 * Write HTML for searching for new device for patient
 *
 * @param {STRING} containerClass The class to apply to the topmost div element in the returned html.
 * @returns {STRING} The HTML code for device search
 */
PaceMakerComponent.prototype.constructDeviceSearch = function(containerClass) {
    var opHTML,
        i18nCardiology = i18n.discernabu.cardiology_device_integration_o1;

    opHTML =
        "<div class='" + containerClass + "'>" +
        "   <div id='pmc1-search-device-section'>" +
        "       <label class = 'pmc1-search-device-label'>" +
                i18nCardiology.MANUAL_ASSOCIATION +
        "       :</label>" +
        "       <div class='pmc1-search-device-inputs'>" +
        "           <input type='text' name='pmc1-serial-text' id='" + this.writeUniqueID("SerialText", this, "") + "' class='pmc1-device-serial-text' value='" + i18n.discernabu.cardiology_device_integration_o1.PACEMAKER_SN + "'>" +
        "           <input type='button' name='pmc1-search-device-button' id='" + this.writeUniqueID("SearchDeviceButton", this, "") + "' class='pmc1-find-device-btn' value='" + i18nCardiology.FIND + "' />" +
        "           <input type='hidden' name='pmc1-search-device-pg-id' id='" + this.writeUniqueID("DevicePGId", this, "") + "' value='' />" +
        "           <input type='hidden' name='pmc1-search-device-pers-id' id='" + this.writeUniqueID("PersonId", this, "") + "' value='' />" +
        "           <input type='hidden' name='pmc1-search-device-alias' id='" + this.writeUniqueID("DeviceAlias", this, "") + "' value='' />" +
        "           <input type='hidden' name='pmc1-search-device-alias-type' id='" + this.writeUniqueID("DeviceAliasType", this, "") + "' value='' />" +
        "           <input type='hidden' name='pmc1-confirm-message' id='" + this.writeUniqueID("confirmMessage", this, "") + "' value='' />" +
        "       </div>" +
        "   </div>" +
        "   <div id='" + this.writeUniqueID("SearchResults", this, "") + "' class='pmc1-search-results'></div>" +
        "</div>" +
        "<br />";

    return opHTML;
};

/**
 * Formats database DOB (YYYYMMDD) format to DOB (MM/DD/YYYY) format
 * @param {dbDOB} dbDOB The DOB in "(YYYYMMDD)" format
 * @returns {string} The DOB in "(MM/DD/YYYY)" format
 */
PaceMakerComponent.prototype.formatDOB = function(dbDOB) {
    var dispPatientDOB = "";
    var dateTime = new Date();
    var printPatientDOB;
    if (dbDOB !== "") {
        printPatientDOB = dbDOB.substring(0, 4) + "-" + dbDOB.substring(4, 6) + "-" + dbDOB.substring(6, 8) + "T00:00:00Z";
        //This date format should be in the format "YYYY-MM-DDTHH:MM:SSZ"
        dateTime.setISO8601(printPatientDOB);
        //shortDate2 is   "mm/dd/yyyy" format
        dispPatientDOB = dateTime.format("shortDate2", true);
    }
    return dispPatientDOB;
};

/**
 * Function to make it easy to write unique IDs in HMTL or when finding them using JQuery and binding events
 *
 * @param {STRING} name The main name for the ID - use camel case for IDs (though the prefix could be seen as the small-letter part)
 *                                            , unlike for CSS classes, as per the wiki.
 * @param {OBJECT} component A reference to this component
 * @param {BOOLEAN} useAsSelector Pass in something truthy to use as a selector (e.g., start with #)
 * @returns {STRING} ID, or selector for ID, using the prefix for this component and the suffix for this INSTANCE of the component
 * @example
 * opHTML += this.constructDeviceSearch();
 */
PaceMakerComponent.prototype.writeUniqueID = function(name, component, useAsSelector) {
    var compNs = component.getStyles().getNameSpace();
    var compId = component.getComponentId();
    var start = "";
    if (useAsSelector) {
        start = "#";
    }
    return start + compNs + name + compId;
};

/**
 * Write HTML for searching for the div or element that will contain the suggested matches
 *
 * @returns {STRING} The HTML code for device search
 * @example
 * opHTML += this.constructSuggestedMatchesPlaceholder();
 */
PaceMakerComponent.prototype.constructSuggestedMatchesPlaceholder = function() {
    var opHTML =
        "<div class='pmc1-sugg-match-content'>" +
        "   <div id='pmc1-sugg-match-section'>" +
        "       <div class='pmc1-matching-device-title'>" +
                i18n.discernabu.cardiology_device_integration_o1.POSSIBLE_MATCHES +
        "       </div>" +
        "   </div>" +
        "   <div id='pmc1-sugg-match-results'></div>" +
        "</div>" +
        "<br />";

    return opHTML;
};

/**
 * Write HTML for populating suggested matches
 *
 * @param {object} reply The reply from the call to pex_get_devices_to_associate
 * @returns {String}    Results for suggested matches
 * @example
 * suggMatchResult += this.populateSuggestedMatches(reply);
 */
PaceMakerComponent.prototype.populateSuggestedMatches = function(reply) {
    var jsonData = reply.getResponse().PULSE_GENS,
        suggmatchVal = "",
        suggmatchIdx = 0,
        i18nCardiology = i18n.discernabu.cardiology_device_integration_o1;

    for (suggmatchIdx = 0; suggmatchIdx < jsonData.length; suggmatchIdx++) {
        suggmatchVal += this.constructDevicePanel(jsonData[suggmatchIdx], i18nCardiology.ASSOCIATE, undefined);

        //Keeps track of the PulseGen ID so when we click an Add button,
        //we know which one to assign.
        this.suggestedMatchPulseGenIDs[suggmatchIdx] = parseInt(jsonData[suggmatchIdx].PULSE_GEN_ID, 10);
    }
    return suggmatchVal;
};

/**
 * Callback function to display device search results.
 *
 * @param   {OBJECT}    reply  The object automatically passed by the XMLCCLRequestCallBack that serves as this handler's "bridge" to
 * everything
 * @returns {UNDEFINED} Nothing
 */
PaceMakerComponent.prototype.handleSearchDevice = function(reply) {
    var compNs = this.getStyles().getNameSpace(),
        compId = this.getComponentId(),
        jsonData,
        searchResultVal = "",
        pulseGenId = "",
        replyStatus = reply.getStatus(),
        existingPersonId = "",
        existingPersonAlias = "",
        existingPersonAliasType = "",
        existingPatientFullName = "",
        existingFullAlias = "";

    if (replyStatus === "S") {
        //Get key values from the JSON data
        jsonData = reply.getResponse().PULSE_GENS;
        pulseGenId = parseInt(jsonData[0].PULSE_GEN_ID, 10);
        //Find the ID by which we can actually associate the device.
        existingPersonId = parseInt(jsonData[0].PERSON_ID, 10);
        existingPersonAlias = jsonData[0].MRN_NUMBER;
        existingPersonAliasType = jsonData[0].MRN_TYPE;
        existingPatientFullName = jsonData[0].EXISTING_NAME;
        if (existingPersonAlias !== "" && existingPersonAliasType !== "") {
            existingFullAlias = " (" + existingPersonAliasType + ": " + existingPersonAlias + "). ";
        }

        if (existingPersonId === "" || existingPersonId === "0" || existingPersonId === 0) {
            //No existing assignee found for device
            searchResultVal = this.constructDevicePanel(jsonData[0], i18n.discernabu.cardiology_device_integration_o1.ASSOCIATE, compNs + "AssociateDevice" + compId);
        } else {
            //Found existing assignee; warn user that assigning the device will remove from other patient
            this.alreadyAssociatedMessage =
                "<div class='pmc1-search-info-icon'>" +
                "   <img src='" + this.getCriterion().static_content + "/images/4017_24.png' alt='information'/>" +
                "</div>";
            if (existingPersonAlias === "") {
                this.alreadyAssociatedMessage +=
                    "<div class='pmc1-associate-info-text'>" + i18n.discernabu.cardiology_device_integration_o1.ASSOCIATION_WARNING_NO_MRN.replace("{0}", existingPatientFullName);
            } else {
                this.alreadyAssociatedMessage +=
                    "<div class='pmc1-associate-info-text'>" + i18n.discernabu.cardiology_device_integration_o1.ASSOCIATION_WARNING.replace("{0}", existingPatientFullName).replace("{1}", existingPersonAliasType).replace("{2}", existingPersonAlias);
            }
            searchResultVal =
                this.alreadyAssociatedMessage +
                "<br/>" +
                "<a id='" + compNs + "ConfirmAssociation" + compId + "'>" + i18n.discernabu.cardiology_device_integration_o1.ASSOCIATE_ANYWAY + "</a>" +
                "</div>";
        }
    } else if (replyStatus === "Z") {
        searchResultVal =
            "<div class='pmc1-no-results-errorMsg'>" +
            "   <b>" + i18n.discernabu.cardiology_device_integration_o1.NO_RESULTS_FOUND.replace("{0}", $("#" + compNs + "SerialText" + compId).val()) + "</b>" +
            "   <br />" +
                i18n.discernabu.cardiology_device_integration_o1.NO_RESULTS_FOUND_1 +
            "</div>";
    } else {
        logger.logScriptCallError(this, reply, "cardiology-device-o1.js", "handleSearchDevice");
        return;
    }

    $("#" + compNs + "SearchResults" + compId).html(searchResultVal);
    //[[Ideally, may want to restrict search to component, but we will trust pmc1 prefix for that]]
    $("#" + compNs + "DevicePGId" + compId).val(pulseGenId);
    //Put pulse gen ID into hidden field. If there were no results, this is set to an empty string.
    //Write these additional fields so that we can warn the user if there's an existing patient assigned to the device.
    // [[[Alternatively, could write properties instead of hidden fields.]]]
    $("#" + compNs + "PersonId" + compId).val(existingPersonId);
    $("#" + compNs + "PersonFullName" + compId).val(existingPatientFullName);
    $("#" + compNs + "DeviceAlias" + compId).val(existingPersonAlias);
    $("#" + compNs + "DeviceAliasType" + compId).val(existingPersonAliasType);
    $("#" + compNs + "confirmMessage" + compId).val(existingPatientFullName + existingFullAlias);
};

/**
 * Converts a number of seconds into a human-readable string of the largest two units. For example:
 * <ul>
 *     <li>A duration of 435 seconds = 7 min, 15 sec = "7m 15s"</li>
 *  <li>A duration of 4350 = 72.5 min = 1 hour 12 min 30 sec = "1h 12m"</li>
 *  <li>A duration of 435600 = 7260 min = 121 hours 0 min = 5 days 1 hour = "5d 1h"</li>
 * </ul>
 *
 * @param   {NUMBER} durationSeconds The total number of seconds an episode took
 * @returns {STRING}                 The formatted time string representing the episode's duration
 */
PaceMakerComponent.prototype.parseDurationSeconds = function(durationSeconds) {
    var sec, min, hour, days, time1, time2, reducTot;
    sec = this.i18n.S_time_label;
    min = this.i18n.M_time_label;
    hour = this.i18n.H_time_label;
    days = this.i18n.D_time_label;
    if (durationSeconds < 3600) {
        time2 = durationSeconds % 60;
        time1 = (durationSeconds - time2) / 60;
        return time1 + min + " " + time2 + sec;
    }
    else if (durationSeconds >= 3600 && durationSeconds < 86400) {
        reducTot = (durationSeconds - durationSeconds % 60) / 60;
        time2 = reducTot % 60;
        time1 = (reducTot - time2) / 60;
        return time1 + hour + " " + time2 + min;
    }
    else if (durationSeconds >= 86400) {
        reducTot = (durationSeconds - durationSeconds % 3600) / 3600;
        time2 = reducTot % 24;
        time1 = (reducTot - time2) / 24;
        return time1 + days + " " + time2 + hour;
    }
};

/**
 * Generates the HTML code for the floating pop-up div containing additional device or implantation
 * details.
 *
 * @param {OBJECT} nameCollection JSON Object containing all the rows to be output in the hover table.
 *        Syntax: { label1:value1, label2:value2, ... }
 * @param {STRING} valueCollection The ID of the DIV tag that will contain the pop-up table (corresponds to
 *        CSS declarations)
 * @returns {STRING} The generated DIV's and TABLE's HTML code.
 * @example
 * opHTML += this.constructHoverTable({Implanting_Physician:"Dr. Jonathan Doe", Facility:"John's Hopkins", Phone:"800-867-5309"},
 * "ImplantingDoctorHover");
 */
PaceMakerComponent.prototype.constructHoverTable = function(nameCollection, valueCollection) {
    var i, opHTML = "";
    for (i = 0; i < nameCollection.length; i++) {
        opHTML += "<tr><td><span class='pmc1-tooltip-labeltext'>" + nameCollection[i] + "</span>: <span class='pmc1-tooltip-valuetext'>" + valueCollection[i] + "</span></td></tr>";
    }
    return "<table class='pmc1-tooltip'>" + opHTML + "</table>";
};

/**
 * Generates the HTML code for Device Information panel (the non-tabular data in the top-left of the
 * page).
 *
 * @param {NUMBER} pulseGenNum The index of the pulse generator to create the device information panel.
 * @returns {STRING} The generated panel's HTML code.
 * @example
 * opHTML += this.constructDeviceInformationPanel();
 */
PaceMakerComponent.prototype.constructDeviceInformationPanel = function(pulseGenNum) {
    var PMData = this.JSONData.PULSE_GENS[pulseGenNum];
    var Battery = PMData.BATTERY_MEASUREMENTS[0];
    var batteryVoltage = "";
    var ERI = "";
    var ImplantDate = new Date();
    var opHTML = "";

    if (Battery) {
        ERI = Battery.RRT_TRIGGER === "" ? "" : "(" + Battery.RRT_TRIGGER + ")";
        batteryVoltage = Battery.VOLTAGE_VALUE + "v";
    } else {
        batteryVoltage = this.i18n.NO_BATTERY_INFO;
    }

    opHTML += "<div class='pmc1-device-info'> <div class='pmc1-device-header'>" + PMData.MANUFACTURER_DISP + " " + PMData.MODEL_IDENT + "</div> <div class='pmc1-serial-number'>" + this.i18n.PACEMAKER_SN + ": " + PMData.SERIAL_TXT + "</div>";
    //Checking for Blank Date String returned from the database if there is no implant date/time
    //In that case we are not appending any date/time field to the front end and it will not appear on the header
    if (PMData.IMPLANT_DT_TM === "/Date(0000-00-00T00:00:00.000+00:00)/") {
        opHTML += "<div class='pmc1-implant-date'>   </div>";
    } else {
        ImplantDate.setISO8601(PMData.IMPLANT_DT_TM);
        opHTML += "<div class='pmc1-implant-date'>" + this.i18n.IMPLANTED + ": " + ImplantDate.format("longDate") + "</div>";
    }
    opHTML += "<span>" + this.i18n.BATTERY + ": <b>" + batteryVoltage + " " + ERI + "</b></span> | " + "<span>" + this.i18n.DEVICE_MODE + ": <b>" + PMData.BRADY_SETTINGS[0].MODE_DISP + "</b></span>" + "</div>";
    return opHTML;
};

/**
 * Generates the HTML code for Device Information panel (the non-tabular data in the top-left of the page) for the historical devices.
 * @this CERN_CARDIOLOGY_DEVICE_O1
 * @calledBy {@link RenderComponent}
 *
 * @param {Number} pulseGenNum - The pulseGenerator number based on the data received
 * @returns {STRING} The generated panel's HTML code.
 * @example
 * opHTML += this.constructHistoricalDeviceInformationPanel();
 */
PaceMakerComponent.prototype.constructHistoricalDeviceInformationPanel = function(pulseGenNum) {
    var PMData, opHTML = "", implantDate = new Date();
    PMData = this.JSONData.PULSE_GENS[pulseGenNum];

    opHTML += "<div class='pmc1-historic-device-info'>" +
                    "<div class='pmc1-device-header'>" + PMData.MANUFACTURER_DISP + " " + PMData.MODEL_IDENT + " (" + this.i18n.INACTIVE + ")" +
                    "</div>" +
                    "<div class='pmc1-serial-number'>" + this.i18n.PACEMAKER_SN + ": " + PMData.SERIAL_TXT +
                    "</div>";
    //Checking for Blank Date String returned from the database if there is no implant date/time
    //In that case we are not appending any date/time field to the front end and it will not appear on the header
    if (PMData.IMPLANT_DT_TM === "/Date(0000-00-00T00:00:00.000+00:00)/") {
        opHTML += "<div class='pmc1-implant-date'> </div>";
    } else {
        implantDate.setISO8601(PMData.IMPLANT_DT_TM);
        opHTML += "<div class='pmc1-implant-date'>" + this.i18n.IMPLANTED + ": " + implantDate.format("longDate") +
                    "</div>" +
            "</div>";
    }
    return opHTML;
};

/**
 * constructTabbedViewHTML
 * Write HTML for creating a tabbed view
 *
 * @param {OBJECT} component reference back to the component
 * @param {array} arrTabObjects array of objects like {name:'Tabname',content:'HTML for the tab'}
 * @param {variable} defaultSelectedTab a variable to define the defaultselectedtab
 * @returns {STRING} The HTML code for the tab
 */
PaceMakerComponent.prototype.constructTabbedViewHTML = function(component, arrTabObjects, defaultSelectedTab) {
    //HTML to be written
    var opHTML;
    var i;

    if (!defaultSelectedTab) {
        defaultSelectedTab = 0;
    }

    opHTML = "<div class='pmc1-tabbed-view' id='" + component.writeUniqueID("TabbedView", component, false) + "'>" + "<ul class='pmc1-tab-top-section'>";
    for (i = 0; i < arrTabObjects.length; i++) {
        opHTML += "<li class='pmc1-tab-top ";
        if (i === defaultSelectedTab) {
            opHTML += "pmc1-tab-top-selected";
            //Classes to distinguish tabs as selected or not selected
        }
        else {
            opHTML += "pmc1-tab-top-not-selected";
        }
        opHTML += "' id='" + component.writeUniqueID("LiTab" + i, component, false) + "'>";
        if (i === defaultSelectedTab) {
            opHTML += "<span class='pmc1-tab-left-edge-active'>&nbsp;</span>";
        }
        else {
            opHTML += "<span class='pmc1-tab-left-edge'>&nbsp;</span>";
        }
        opHTML += "<a>" + arrTabObjects[i].name + "</a>";

        if (i === defaultSelectedTab) {
            opHTML += "<span class='pmc1-tab-right-edge-active'>&nbsp;</span>";
        }
        else {
            opHTML += "<span class='pmc1-tab-right-edge'>&nbsp;</span>";
        }

        opHTML += "</li>";
    }
    opHTML += "</ul>" + "<div id='" + component.writeUniqueID("TabbedViewContent", component, false) + "'>";

    for (i = 0; i < arrTabObjects.length; i++) {
        opHTML += "<div id='" + component.writeUniqueID("TabArea" + i, component, false) + "' class='";

        if (i === defaultSelectedTab) {
            //Core class for display:block
            opHTML += "div-tab-item-selected";
        }
        else {
            //Core class for display:none
            opHTML += "div-tab-item-not-selected";
        }
        //Class just in case we want any particular CSS for tabs
        opHTML += " pmc1-tab-area" + "'>";
        opHTML += arrTabObjects[i].content;

        //Close div for this particular tab.
        opHTML += "</div>";
    }

    //End div for TabbedViewContent and then end large one for TabbedView
    //The extra non-breaking space ensures that the component's bottom border will be low enough to contain all the suggested matches;
    //otherwise, they "bleed" over the border.
    opHTML += "</div></div><div>&nbsp;</div>";

    component.tabActive = defaultSelectedTab;
    return opHTML;
};

/**
 *
 * @param  {OBJECT} eventData The anchor object making the call to this method (HTML Object)
 * @returns {BOOLEAN} True if the panel is expanded, false if not
 */
PaceMakerComponent.prototype.showLinkClick = function(eventData) {
    var self = eventData.data.scope;
    var deviceNumStr = this.id.substring(this.id.length - 1);
    var deviceNum = Number(deviceNumStr);
    if (self.linkText[deviceNum] === "") {
        self.linkText[deviceNum] = this.innerHTML;
    }
    if (self.tablesExpandStatus[deviceNum] === false) {
        this.innerHTML = self.i18n.SHOW_FEWER;
        self.episodeTable[deviceNum].bindData(self.longEpisodeList[deviceNum]);
        self.episodeTable[deviceNum].refresh();
        self.tablesExpandStatus[deviceNum] = true;
    }
    else {
        this.innerHTML = self.linkText[deviceNum];
        self.episodeTable[deviceNum].bindData(self.shortEpisodeList[deviceNum]);
        self.episodeTable[deviceNum].refresh();
        self.tablesExpandStatus[deviceNum] = false;
    }
    return self.tablesExpandStatus[deviceNum];
};

/**
 * @param  {OBJECT} eventData -  The anchor object making the call to this method (HTML Object)
 * @returns {undefined} Nothing
 */
PaceMakerComponent.prototype.showHoverData = function(eventData) {
    eventData.data.tooltip
        .setX(eventData.pageX)
        .setY(eventData.pageY)
        .show();
};

MP_Util.setObjectDefinitionMapping("PACE_SUMMARY", PaceMakerComponent);
