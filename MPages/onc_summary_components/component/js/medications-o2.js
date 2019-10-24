//MEDS COMPONENT PMM
function MedicationsComponentStyleO2() {
	this.initByNamespace("med-o2");
}

MedicationsComponentStyleO2.prototype = new ComponentStyle();
MedicationsComponentStyleO2.prototype.constructor = ComponentStyle;

function MedicationsComponentO2(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new MedicationsComponentStyleO2());
	this.setComponentLoadTimerName("USR:MPG.MEDS.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.MEDS.O2 - render component");
	this.m_compNS = this.getStyles().getNameSpace();
	this.m_prnLookback = 0;
	this.setIncludeLineNumber(false);
	this.m_scheduled = false;
	this.m_continuous = false;
	this.m_prn = false;
	this.m_admin = false;
	this.m_susp = false;
	this.m_discont = false;

	//Sorting indicators
	this.m_scheduledSort = 0;
	this.m_prnAdminSort = 0;
	this.m_prnUnschedAvailSort = 0;
	this.m_continuousSort = 0;

	//FaceUp Date indicator
	this.m_faceUpDtSched = false;
	this.m_faceUpDtPRN = false;

	//Look back hours for admin
	this.m_lookBkHrsForAdm = 24;
	this.m_lookBkHrsForDisCont = 24;

	//Look forward hours scheduled
	this.m_schedNextTwelve = 0;
	this.m_prnLastFortyEight = 0;
	this.m_schedOverdue = 0;
	this.m_componentDisplay = false;
	this.compMenuReference = {};
	this.m_sidePanelArray = [];
	this.m_lastDoseArray = [];
	
	//Medication reconcilation statuses
	this.m_medHistory = false;
	this.m_medRecAdmit = false;
	this.m_medRecTransfer = false;
	this.m_medRecCrossEncXfer = false;
	this.m_medRecDischarge = false;

	//Side panel
	this.m_sidePanel = null;

	//Standard min-height set for Side Panel
	this.m_sidePanelMinHeight = 251;

	//Extra padding at bottom of pane between window
	this.m_windowPadding = 118;

	this.m_sidePanelScrollContainer = 0;

	//Minimum height of the component
	this.m_ContainerMinHeight = ($("#vwpBody").height() - this.m_windowPadding);

	this.m_isEventOrderActionListenerAdded = false;

	MedicationsComponentO2.method("InsertData", function() {
		CERN_MEDS_O2.GetMedicationData(this);
	});

	//Sections
	MedicationsComponentO2.method("setPRNLookbackDays", function(value) {
		this.m_prnLookback = value;
	});
	MedicationsComponentO2.method("getPRNLookbackDays", function() {
		return (this.m_prnLookback);
	});
	MedicationsComponentO2.method("setScheduled", function(value) {
		this.m_scheduled = value;
	});
	MedicationsComponentO2.method("isScheduled", function() {
		return this.m_scheduled;
	});
	MedicationsComponentO2.method("setContinuous", function(value) {
		this.m_continuous = value;
	});
	MedicationsComponentO2.method("isContinuous", function() {
		return (this.m_continuous);
	});
	MedicationsComponentO2.method("setPRN", function(value) {
		this.m_prn = value;
	});
	MedicationsComponentO2.method("isPRN", function() {
		return (this.m_prn);
	});
	MedicationsComponentO2.method("setAdministered", function(value) {
		this.m_admin = value;
	});
	MedicationsComponentO2.method("isAdministered", function() {
		return this.m_admin;
	});
	MedicationsComponentO2.method("setSuspended", function(value) {
		this.m_susp = value;
	});
	MedicationsComponentO2.method("isSuspended", function() {
		return this.m_susp;
	});
	MedicationsComponentO2.method("setDiscontinued", function(value) {
		this.m_discont = value;
	});
	MedicationsComponentO2.method("isDiscontinued", function() {
		return this.m_discont;
	});
	MedicationsComponentO2.method("setAdministeredLookBkHrs", function(value) {
		this.m_lookBkHrsForAdm = value;
	});
	MedicationsComponentO2.method("getAdministeredLookBkHrs", function() {
		return this.m_lookBkHrsForAdm;
	});
	MedicationsComponentO2.method("setDiscontinuedLookBkHr", function(value) {
		this.m_lookBkHrsForDisCont = value;
	});
	MedicationsComponentO2.method("getDiscontinuedLookBkHr", function() {
		return this.m_lookBkHrsForDisCont;
	});

	//Sort Getters/Setters
	MedicationsComponentO2.method("setScheduledSort", function(value) {
		this.m_scheduledSort = value;
	});
	MedicationsComponentO2.method("getScheduledSort", function() {
		return (this.m_scheduledSort);
	});
	MedicationsComponentO2.method("setPRNAdminSort", function(value) {
		this.m_prnAdminSort = value;
	});
	MedicationsComponentO2.method("getPRNAdminSort", function() {
		return (this.m_prnAdminSort);
	});
	MedicationsComponentO2.method("setPRNUnschedAvailSort", function(value) {
		this.m_prnUnschedAvailSort = value;
	});
	MedicationsComponentO2.method("getPRNUnschedAvailSort", function() {
		return (this.m_prnUnschedAvailSort);
	});
	MedicationsComponentO2.method("setContinuousSort", function(value) {
		this.m_continuousSort = value;
	});
	MedicationsComponentO2.method("getContinuousSort", function() {
		return (this.m_continuousSort);
	});
	MedicationsComponentO2.method("setDisplayPRNFaceUpDt", function(value) {
		this.m_faceUpDtPRN = value;
	});
	MedicationsComponentO2.method("getDisplayPRNFaceUpDt", function() {
		return (this.m_faceUpDtPRN);
	});
	MedicationsComponentO2.method("setScheduleNextDose", function(value) {
		this.m_faceUpDtSched = value;
	});
	MedicationsComponentO2.method("getScheduleNextDose", function() {
		return (this.m_faceUpDtSched);
	});
	MedicationsComponentO2.method("setPRNLastDose", function(value) {
		this.m_faceUpDtPRN = value;
	});
	MedicationsComponentO2.method("getPRNLastDose", function() {
		return (this.m_faceUpDtPRN);
	});
	MedicationsComponentO2.method("setSchedNextTwelve", function(value) {
		this.m_schedNextTwelve = value;
	});
	MedicationsComponentO2.method("getSchedNextTwelve", function() {
		return (this.m_schedNextTwelve);
	});
	MedicationsComponentO2.method("setPRNLastFortyEight", function(value) {
		this.m_prnLastFortyEight = value;
	});
	MedicationsComponentO2.method("getPRNLastFortyEight", function() {
		return (this.m_prnLastFortyEight);
	});
	MedicationsComponentO2.method("setSchedOverdue", function(value) {
		this.m_schedOverdue = value;
	});
	MedicationsComponentO2.method("getSchedOverdue", function() {
		return (this.m_schedOverdue);
	});
	
	// Adding Med Rec status related filters getter/setter functions
	MedicationsComponentO2.method("setMedHistory", function (value) {
		this.m_medHistory = (value == 1 ? true : false);
	});
	MedicationsComponentO2.method("getMedHistory", function () {
			
		return (this.m_medHistory);
	});
	MedicationsComponentO2.method("setMedRecAdmit", function (value) {
		this.m_medRecAdmit = (value == 1 ? true : false);
	});
	MedicationsComponentO2.method("getMedRecAdmit", function () {
		
		return (this.m_medRecAdmit);
	});
	MedicationsComponentO2.method("setMedRecTransfer", function (value) {
		this.m_medRecTransfer = (value == 1 ? true : false);
	});
	MedicationsComponentO2.method("getMedRecTransfer", function () {
		return (this.m_medRecTransfer);
	});
	MedicationsComponentO2.method("setMedRecCrossEncTx", function (value) {
		this.m_medRecCrossEncXfer = (value == 1 ? true : false);
	});
	MedicationsComponentO2.method("getMedRecCrossEncTx", function () {
		return (this.m_medRecCrossEncXfer);
	});
	MedicationsComponentO2.method("setMedRecDischarge", function (value) {
		this.m_medRecDischarge = (value == 1 ? true : false);
	});
	MedicationsComponentO2.method("getMedRecDischarge", function () {
		return (this.m_medRecDischarge);
	});
	

	
	MedicationsComponentO2.method("openTab", function() {
		var criterion = this.getCriterion();
		var sParms = "/PERSONID=" + criterion.person_id + " /ENCNTRID=" + criterion.encntr_id + " /FIRSTTAB=^" + this.getLink() + "+^";
		this.resetSidePanel();
		APPLINK(0, criterion.executable, sParms);
		this.InsertData();
	});
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
MedicationsComponentO2.prototype = new MPageComponent();
MedicationsComponentO2.prototype.constructor = MPageComponent;

/**
 * Creates the filterMappings that will be used when loading the component's bedrock settings
 */
MedicationsComponentO2.prototype.loadFilterMappings = function() {
	//Add the filter mapping object for the Catalog Type Codes
	this.addFilterMappingObject("WF_MEDS_INFO_BUTTON_IND", {
		setFunction : this.setHasInfoButton,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});
	
	//Add the filter mapping object for the Med Rec Statuses Links
	this.addFilterMappingObject("WF_MEDS_MR_HIS_IND", {
		setFunction : this.setMedHistory,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});
	
	this.addFilterMappingObject("WF_MEDS_MR_ADM_IND", {
		setFunction : this.setMedRecAdmit,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});
	
	this.addFilterMappingObject("WF_MEDS_MR_TRNS_IND", {
		setFunction : this.setMedRecTransfer,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});
	
	this.addFilterMappingObject("WF_MEDS_MR_CTRNS_IND", {
		setFunction : this.setMedRecCrossEncTx,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});
	
	this.addFilterMappingObject("WF_MEDS_MR_DSCH_IND", {
		setFunction : this.setMedRecDischarge,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});
};

/**
 * Preprocessing function for component level menu
 */
MedicationsComponentO2.prototype.preProcessing = function() {
	var component = this;
	var compMenu = this.getMenu();
	var compId = this.getComponentId();

	if (this.isDisplayable() && compMenu) {
		var compInfoButton = new MenuSelection("compInfoButton" + compId);
		if (this.hasInfoButton()) {
			compInfoButton.setLabel(i18n.discernabu.INFO_BUTTON);
			compMenu.addMenuItem(compInfoButton);
			compInfoButton.setIsDisabled(!this.hasInfoButton());
			this.compMenuReference[compInfoButton.getId()] = compInfoButton;
			compInfoButton.setClickFunction(function(clickEvent) {
				clickEvent.id = "mnuInfoButton" + compId;
				CERN_MEDS_O2.callInfoButtonClick(clickEvent);
			});
		}
	}
};

/**
 * Postprocessing function for component. Adds event listener for order actions.
 */
MedicationsComponentO2.prototype.postProcessing = function() {
	if (!this.m_isEventOrderActionListenerAdded) {
		CERN_EventListener.addListener(this, EventListener.EVENT_ORDER_ACTION, this.InsertData, this);
		this.m_isEventOrderActionListenerAdded = true;
	}
};

/**
 ** This function will be called for Initializing the side panel and the side panel height will be reset.
 ** The side panel will be rendered if it was already initialized.
 ** @param {null}
 ** @return {null}
 */
MedicationsComponentO2.prototype.initSidePanel = function() {
	var component = this;
	var componentId = component.getComponentId();
	var panelId = "sidePanel_o2_" + componentId;

	//Create the container for side panel
	var sidePanelContainer = "<div id='" + panelId + "' class='" + this.m_compNS + "-sidepanel-container'>&nbsp;</div>";

	//Reduce the width of the main container
	$("#medications_o2_" + componentId).removeClass("sidepanel-closed-width").addClass("sidepanel-width");

	//To check if the Side Panel is already created
	try {
		if (this.m_sidePanel) {

			//Render the side panel
			this.m_sidePanel.renderSidePanel();

			$("#med-o2" + componentId + " #sidePanel" + componentId).show();

			$("#med-o2" + componentId + " #sidePanel_o2_" + componentId).removeClass("sidepanel-hide");

		}
		else {
			//Append the side panel inside the main container
			$("#medications_o2_" + componentId).parent().append(sidePanelContainer);

			//Create the side panel
			this.m_sidePanel = new CompSidePanel(componentId, panelId);
			this.m_sidePanel.setExpandOption(this.m_sidePanel.expandOption.EXPAND_DOWN);

			//Set up the min height for the panel equivalent to the height of the component
			this.m_sidePanel.setHeight(component.m_ContainerMinHeight + "px");

			//Render the side panel
			this.m_sidePanel.renderSidePanel();
		}

		component.resetSidePanelHeight();
	}
	catch(err) {
		logger.logJSError(err, this, "medications-o2.js", "initSidePanel");
	}
};

/**
 ** This function is used for showing / displaying the side panel
 ** @param {object} selectedMedication - Object of the selected Medication
 */
MedicationsComponentO2.prototype.showSidePanel = function(selectedMedication) {
	var component = this;
	var componentId = component.getComponentId();
	var compNS = component.m_compNS;
	var medicationsContainer = $("." + compNS + "-content-body");
	var rowSelectedClass = "row-selected";

	$("#med-o2" + componentId + " #sidePanel_o2_" + componentId).show();
	medicationsContainer.find("." + rowSelectedClass).removeClass(rowSelectedClass);
	$(selectedMedication).addClass(rowSelectedClass);
	
	medicationsContainer.find("." + compNS + "-order-status").addClass(compNS + "-hide-status");
	medicationsContainer.find("." + compNS + "-details-open").removeClass(compNS + "-details-open");
	medicationsContainer.find("." + compNS + "-order-start-date-open").removeClass(compNS + "-order-start-date-open");
	medicationsContainer.find("." + compNS + "-details").addClass(compNS + "-details-open");
	medicationsContainer.find("." + compNS + "-order-start-date").addClass(compNS + "-order-start-date-open");
	medicationsContainer.find("." + compNS + "-content-header ." + compNS + "-details").addClass(compNS + "-header-details-open");
	$("#medications_o2_" + componentId).addClass("sidepanel-width").removeClass("sidepanel-closed-width");

	component.setComponentScroll();

	//To show the selected medication in the scrollable viewable pane in any sreen resolution
	$("#" + compNS + "-content-container").scrollTo("." + rowSelectedClass);
};

/**
 ** This function is used for hiding the Side Panel
 */
MedicationsComponentO2.prototype.hideSidePanel = function() {
	var component = this;
	var componentId = component.getComponentId();
	var compNS = component.m_compNS;
	var medicationsContainer = $("." + compNS + "-content-body");

	$("#med-o2" + componentId + " #sidePanel_o2_" + componentId).addClass("sidepanel-hide");
	medicationsContainer.find("." + compNS + "-hide-status").removeClass(compNS + "-hide-status");
	medicationsContainer.find(".row-selected").removeClass("row-selected");
	medicationsContainer.find("." + compNS + "-details").removeClass(compNS + "-details-open");
	medicationsContainer.find("." + compNS + "-order-start-date").removeClass(compNS + "-order-start-date-open");
	medicationsContainer.find("." + compNS + "-content-header ." + compNS + "-details").removeClass(compNS + "-header-details-open");
	$("#medications_o2_" + componentId).removeClass("sidepanel-width").addClass("sidepanel-closed-width");

	component.setComponentScroll();
};

/**
 ** This function will be called for resetting the Side Panel
 */
MedicationsComponentO2.prototype.resetSidePanel = function() {
	var component = this;
	var componentId = component.getComponentId();
	var compNS = component.m_compNS;
	var medicationsContainer = $("." + compNS + "-content-body");

	component.m_sidePanel = "";
	$("#med-o2" + componentId + " #sidePanel_o2_" + componentId).hide();
	medicationsContainer.find("." + compNS + "-hide-status").removeClass(compNS + "-hide-status");
	medicationsContainer.find(".row-selected").removeClass("row-selected");
	medicationsContainer.find("." + compNS + "-details").removeClass(compNS + "-details-open");
	medicationsContainer.find("." + compNS + "-order-start-date").removeClass(compNS + "-order-start-date-open");
	medicationsContainer.find("." + compNS + "-content-header ." + compNS + "-details").removeClass(compNS + "-header-details-open");
	$("#medications_o2_" + componentId).removeClass("sidepanel-width").addClass("sidepanel-closed-width");
};

/**
 ** Overriding MPageComponent's resizeComponent method to set the height of the side panel
 */
MedicationsComponentO2.prototype.resizeComponent = function() {
	//Call the base class functionality to resize the component
	MPageComponent.prototype.resizeComponent.call(this, null);

	//To reset the height of the side panel
	if (this.m_sidePanel) {
		this.resetSidePanelHeight();
	}
};

/**
 ** Function to reset the height of side panel to the viewable pane height.
 ** To reset the height, panel's height will be resized.
 ** This function will be called whenever the height of component changed(on component resizing, subsection expanding/collapsing).
 ** Reference URL for Resize Side Panel Artifact -
 ** https://wiki.ucern.com/display/associates/MPages+Side+Panel#MPagesSidePanel-ResizingtheSidePanel
 ** @param {status: has the trigger status to set the Side panel height}
 ** @return {null}
 */
MedicationsComponentO2.prototype.resetSidePanelHeight = function(status) {
	var component = this;
	var componentId = component.getComponentId();
	var maxHeight = "";
	var windowPadding = this.m_windowPadding;
	var sidePanelObj = component.m_sidePanel;
	var sidePanelContentObj = $("#sidePanel" + componentId);
	var sidePanelContentHeight = $("#sidePanel" + componentId).height();
	var viewPointContainerObj = $(".vwp-body-container");
	var viewPointContentHeight = (viewPointContainerObj.height()) - 70;
	var sidePanelContentMinHeight = component.m_sidePanelMinHeight;
	var sidePanelDataHeight = "";
	var medicationsContentHeight = "";
	var medicationsContentDiv = $("#medications_o2_" + componentId);
	var statusContainerHeight = $("#medStatusContainer" + componentId).height();

	if (statusContainerHeight > 22) {
		if (sidePanelContentObj.hasClass("sp-focusin") && status === true) {
			viewPointContentHeight = viewPointContentHeight - 22;
		}
	}

	if (sidePanelObj) {
		//Calculating the maximum height between the Component container and the Side Panel
		maxHeight = Math.max(medicationsContentDiv.height(), component.m_sidePanelMinHeight);

		sidePanelObj.setMinHeight(maxHeight + "px");

		sidePanelDataHeight = sidePanelContentObj.css("min-height");
		if (sidePanelContentObj.hasClass("sp-focusin") && status === true) {
			sidePanelContentObj.css({
				"min-height" : viewPointContentHeight + "px",
				"max-height" : viewPointContentHeight + "px"
			});
		}
		else {
			sidePanelObj.setHeight(sidePanelDataHeight);
		}

		sidePanelObj.setOnExpandFunction(function() {
			if ((sidePanelContentMinHeight > medicationsContentHeight ) && (statusContainerHeight > 22)) {
				var sidePanelScrollContainerObj = $("#sidePanelScrollContainer" + componentId);
				if (component.m_sidePanelScrollContainer === 0 || component.m_sidePanelScrollContainer === null) {
					component.m_sidePanelScrollContainer = sidePanelScrollContainerObj.height();
				}
				if ((component.m_sidePanelScrollContainer < sidePanelScrollContainerObj.height()) || (component.m_sidePanelScrollContainer == sidePanelScrollContainerObj.height())) {
					sidePanelScrollContainerObj.css({
						"max-height" : (sidePanelScrollContainerObj.height() - 24) + "px"
					});
				}
			}
			else {
				sidePanelContentObj.css({
					"min-height" : viewPointContentHeight + "px",
					"max-height" : viewPointContentHeight + "px"
				});
			}
		});

		sidePanelObj.setOnCollapseFunction(function() {
			if (sidePanelContentMinHeight > medicationsContentHeight) {
				component.resetSidePanelHeight();
			}
			else {
				sidePanelObj.setMinHeight(sidePanelDataHeight);
			}
		});
		sidePanelObj.renderSidePanel();
	}
};

/**
 ** Function to set the scroll to the component if the content exceeds the max-height set.
 ** This function basically adds the css class to set the scroll and adjust the headings accordingly
 ** @param {null}
 ** @return {null}
 */
MedicationsComponentO2.prototype.setComponentScroll = function() {
	var component = this;
	var componentId = component.getComponentId();
	var compNS = component.m_compNS;
	var medicationsContentDiv = $("#medications_o2_" + componentId);
	var medicationsContentContainer = $("#" + compNS + "-content-container");
	var medicationsScrollHeight = medicationsContentContainer[0].scrollHeight;
	var medicationsContainerHeight = medicationsContentContainer.height();
	var tableContainerHeight = $("#" + compNS + "Content" + this.getComponentId()).height();
	var viewPointContentHeight = component.m_ContainerMinHeight;
	var statusContainerHeight = $("#medStatusContainer" + componentId).height();
	var width = $(window).width(), height = $(window).height();

	if (statusContainerHeight > 22) {
		if ((width <= 1024) && (height <= 800)) {
			viewPointContentHeight = viewPointContentHeight - 36;
		}
		if (medicationsContentDiv.hasClass(compNS + "-content-body-scroll")) {
			if (medicationsContentDiv.hasClass("sidepanel-width")) {
				viewPointContentHeight = viewPointContentHeight - 30;
			}
			else {
				viewPointContentHeight = viewPointContentHeight - 2;
			}
		}
		else if (statusContainerHeight === 228 && (medicationsContentDiv.hasClass("sidepanel-width"))) {
			if (medicationsContentDiv.hasClass("sidepanel-close-width")) {
				medicationsContentDiv.removeClass("sidepanel-close-width");
			}
			else {
				viewPointContentHeight = viewPointContentHeight - 27;
			}
		}
	}
	else if (statusContainerHeight === 22 && medicationsContentDiv.hasClass("sidepanel-width")) {
		viewPointContentHeight = viewPointContentHeight - 17;
	}
	else {
		viewPointContentHeight = viewPointContentHeight - 10;
	}

	//To reset the height of the table container to the height of the viewable pane
	if (tableContainerHeight) {
		$("#" + compNS + "-content-container").css("max-height", viewPointContentHeight);
	}

	//To adjust the headings positions when the scroll is enabled
	if ((medicationsScrollHeight > medicationsContainerHeight) && ((medicationsScrollHeight - 1) > medicationsContainerHeight)) {
		medicationsContentDiv.addClass(compNS + "-content-body-scroll");
	}
	else {
		medicationsContentDiv.removeClass(compNS + "-content-body-scroll");
	}
};

/**
 ** Retrieves the Last Dose Date Time for all the Medications
 ** @param {id(s)} - Order Id(s) of the Medications
 ** @param {object} - event object for which the action was triggered
 ** @return {null}
 */
MedicationsComponentO2.prototype.retrieveLastDoseDate = function(orderIds, event) {
	var component = this;
	var compNS = component.m_compNS;
	var componentId = component.getComponentId();
	var lastDoseDate = "";
	var lastDoseScriptRequest = null;
	var orderIdsValue = (orderIds) ? "value(" + orderIds + ")" : "0.0";
	var recordData = null;
	var data = null;
	var recordDataLength = 0;
	/*doseArray is used to store the last dose data that we retrieve from the program MP_GET_LAST_DOSE_DATE.
	 It stores the order_id as the key and the latest last_dose_dt_tm as the value.*/
	var doseArray = {};

	//Side Panel show action
	component.showSidePanel(event);

	//Initialize or render the side panel
	component.initSidePanel();

	//Show the loader until we gather the Last Dose Data
	$("#" + compNS + componentId + " #sidePanelContents" + componentId).html("<div class='" + this.m_compNS + "-preloader-icon'></div>");

	//Program to retrieve Last Dose Dates
	lastDoseScriptRequest = new ComponentScriptRequest();
	lastDoseScriptRequest.setName("GetLastDoseData");
	lastDoseScriptRequest.setProgramName("MP_GET_LAST_DOSE_DATE");
	lastDoseScriptRequest.setParameterArray(["^MINE^", orderIdsValue]);
	lastDoseScriptRequest.setComponent(component);
	lastDoseScriptRequest.setResponseHandler(function(scriptReply) {
		recordData = scriptReply.getResponse();
		recordDataLength = recordData.ORDER_LIST.length;
		for (var y = 0; y < recordDataLength; y++) {
			data = recordData.ORDER_LIST[y];

			//To update the doseArray with the latest last_dose_dt_tm if an order_id already exists
			if (!(doseArray[data.ORDER_ID]) || (doseArray[data.ORDER_ID] && data.LAST_DOSE_DT_TM > doseArray[data.ORDER_ID])) {
				doseArray[data.ORDER_ID] = data.LAST_DOSE_DT_TM;
			}
		}
		component.m_lastDoseArray = doseArray;

		//Retrieve the side panel detail
		component.retrieveSidePanelDetails($(event).find("span"), component.m_sidePanelArray);
	});
	lastDoseScriptRequest.performRequest();
};

/**
 ** Function takes in an event object and the reply data object, and uses that data to update the content in the side panel.
 ** The event object will determine which order was clicked and data from that order will be pulled from the reply object and
 ** passed to a function to update the side panel.
 */
MedicationsComponentO2.prototype.retrieveSidePanelDetails = function(event, data) {
	var component = this;
	var componentId = component.getComponentId();
	var mainContentDiv = $("#medications_o2_" + componentId);
	var orderId = event.attr("data-orderId");
	var priCriteriaCd = event.attr("data-priCriteriaCd");
	var medDetails = [];
	var dataLength = data.length;
	var value = null;
	var lastDoseDate = component.m_lastDoseArray[orderId];
	var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	var dateTime = new Date();

	if (lastDoseDate) {
		dateTime.setISO8601(lastDoseDate);
		lastDoseDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
	}
	else {
		lastDoseDate = "- -";
	}

	for (var i = 0; i < dataLength; i++) {
		value = data[i];
		if (value.order_id == orderId) {
			medDetails.length = 0;
			medDetails = {
				synonym_id : value.synonym_id,
				order_id : orderId,
				med_name : value.med_name,
				rejected_ind : value.rejected_ind,
				admin_flag : value.admin_flag,
				order_details : value.order_details,
				order_comments : value.order_comments,
				last_dose_date : lastDoseDate,
				start_date : value.start_date,
				order_date : value.order_date,
				stop_date : value.stop_date,
				stop_reason : value.stop_reason,
				display_name : value.display_name,
				prn_ind : value.prn_ind,
				unscheduled_ind : value.unscheduled_ind,
				constant_ind : value.constant_ind,
				meaning : value.meaning,
				provider : value.provider,
				status_display : value.status_display,
				details : value.details
			};
		}
	}

	//Update Side Panel Container
	component.updateSidePanelDetails(medDetails);
};

/**
 ** Function takes the medication details as a parameter to be displayed in the side panel and creates HTML to be displayed.
 ** The side panel will be broken into three vertical sections: the top section will have the full medication name, order details,
 ** and the bottom will have the remaining order comments. Comments will be hidden when there are no comments. Default text "- -"
 ** will be displayed for Last Dose, Stop Date/Time, Stop Reason if there is no data available
 */
MedicationsComponentO2.prototype.updateSidePanelDetails = function(medDetails) {
	var component = this;
	var componentId = this.getComponentId();
	var panelId = "sidePanel_o2_" + componentId;
	var medsI18n = i18n.discernabu.medications_o2;
	var contents = "";

	//Setting up the Side Panel content
	contents = "<div class='sidepanel-header'>";
	if (medDetails.rejected_ind == 1) {
		contents += "<div class='rejected-medication'><span class='med-rejected-icon'>&nbsp;</span>" + medsI18n.REJECTED_BY_PHARMACY + "</div>";
	}
	contents += "<h2>" + medDetails.med_name + "</h2>";
	if (medDetails.admin_flag !== "AdminMed") {
		contents += "<p>" + medDetails.order_details + "</p>";
	}
	contents += '<div class="sidepanel-separator">&nbsp;</div></div><div id="sidePanelScrollContainer' + componentId + '" class="sidepanel-content-section"><p><span>' + medsI18n.REQUESTED_START + ': </span><span class="med-details">' + medDetails.start_date + '</span></p><p><span>' + medsI18n.ORIG_DT_TM + ': </span><span class="med-details">' + medDetails.order_date + '</span></p><p><span>' + medsI18n.LAST_DOSE_DT_TM + ': </span><span class="med-details">' + medDetails.last_dose_date + '</span></p><p><span>' + medsI18n.STOP_DT_TM + ': </span><span class="med-details">' + ((medDetails.stop_date !== "") ? medDetails.stop_date : "- -") + '</span></p><p><span>' + medsI18n.STOP_REASON + ': </span><span class="med-details">' + ((medDetails.stop_reason !== "") ? medDetails.stop_reason : "- -") + '</span><br/></p><div class="sidepanel-separator">&nbsp;</div><p><span>' + medsI18n.RESPONSIBLE_PROVIDER + ': </span><span class="med-details">' + medDetails.provider + '</span></p><p><span>' + medsI18n.STATUS + ': </span><span class="med-details">' + medDetails.status_display + '</span><br/></p>';
	if (medDetails.order_comments !== "") {
		contents += '<div class="sidepanel-separator">&nbsp;</div><h3>' + medsI18n.ORDER_COMMENTS + '</h3><p>' + medDetails.order_comments + '</p>';
	}
	contents += '<p></p></div>';

	this.m_sidePanel.setContents(contents, panelId);

	this.m_sidePanel.showCloseButton(true);

	this.m_sidePanel.setCloseFunction(function() {
		//Side Panel close action
		component.hideSidePanel();
	});
};

/**
 * Invoke the Orders API to open the Medications Reconciliation modal window and refresh the component when that action is complete
 * @param {number} compId
 * @param {number} recMode 1 Admission, 2 Transfer, 3 Discharge Mode
 */
MedicationsComponentO2.prototype.openMedRec = function(compId, recMode, venueCode) {
	var component = MP_Util.GetCompObjById(compId);
	var criterion = component.getCriterion();
	var mrObject = {};
	try {
		MP_Util.LogDiscernInfo(this, "ORDERS", "medications-o2.js", "openMedsRec");
		mrObject = CERN_Platform.getDiscernObject("ORDERS");
		mrObject.PersonId = criterion.person_id;
		mrObject.EncntrId = criterion.encntr_id;
		mrObject.reconciliationMode = recMode;
		mrObject.defaultVenue = venueCode;
		mrObject.LaunchOrdersMode(2, 0, 0);
		component.InsertData();
	}
	catch(err) {
		logger.logJSError(err, this, "medications-o2.js", "openMedsRec");
	}
};

/**
 * Creates a formatted date from a Date object
 * @param {Date} - date object to create formatted date from
 * @param {Format} - the format the date needs to be changed to
 * @returns {string} - Formatted date
 */
MedicationsComponentO2.prototype.formatDisplayDate = function(orderDate, dateFormat) {
	var medsI18n = i18n.discernabu.medications_o2;
	var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	var fullDateTime4Year = mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR;
	var startDateStr = new Date();
	if (orderDate !== "") {
		startDateStr.setISO8601(orderDate);
	}
	var startDate = df.format(startDateStr, fullDateTime4Year);
	var todayDate = new Date();
	todayDate = df.format(todayDate, fullDateTime4Year);
	var yesterdayDate = new Date();
	yesterdayDate.setDate(yesterdayDate.getDate() - 1);
	yesterdayDate = df.format(yesterdayDate, fullDateTime4Year);

	if (todayDate === startDate) {
		startDateStr = medsI18n.TODAY + " " + startDateStr.format("HH:MM");
	}
	else if (yesterdayDate === startDate) {
		startDateStr = medsI18n.YESTERDAY + " " + startDateStr.format("HH:MM");
	}
	else {
		startDateStr = startDateStr.format(dateFormat);
	}
	return startDateStr;
};

/**
 * Medication methods
 * @namespace CERN_MEDS_O2
 * @static
 * @global
 */
var CERN_MEDS_O2 = function() {

	function createMedicationItem(orders, faceUpDateFlag, severityFlag, adminFlag, z, component) {
		var item = [];
		var medOrigDate = "";
		var medHvrOrigDate = "";
		var startDate = "";
		var origOrderDate = "";
		var stopDate = "";
		var stopReason = "";
		var respProv = "";
		var currentDate = new Date();
		var medsI18n = i18n.discernabu.medications_o2;
		var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
		var fullDateTime4Year = mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR;
		var dateTime = new Date();
		var sDate = getHeadsUpMedicationDate(orders);
		var sRejIcn = "";
		var sHvrRej = "";
		var medIsRej = "";
		var zebraStriping = (z % 2) ? "even" : "odd";
		var criterion = component.getCriterion();
		var componentId = component.getComponentId();
		var infoClass = "";
		var synonymId = orders.MEDICATION_INFORMATION.SYNONYM_ID;
		var priCriteriaCd = orders.MEDICATION_INFORMATION.PRIMARY_CRITERIA_CD;
		var jsSeverity = "";
		var orderId = orders.MEDICATION_INFORMATION.ORDER_ID;
		var compNS = component.m_compNS;

		if (orders.CORE.REJECTED_IND == 1) {
			jsSeverity = "res-severe";
			sRejIcn = "<dd class='" + compNS + "-rejected'>&nbsp;</dd>";
			sHvrRej = "<dd class='med-det-name'>" + medsI18n.REJECTED_BY_PHARMACY + "</dd>";
			medIsRej = compNS + "-is-rej";
		}

		if (sDate) {
			dateTime.setISO8601(sDate);
			medOrigDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
			medHvrOrigDate = df.format(dateTime, fullDateTime4Year);
		}

		if (orders.SCHEDULE.CURRENT_START_DT_TM) {
			dateTime.setISO8601(orders.SCHEDULE.CURRENT_START_DT_TM);
			startDate = df.format(dateTime, fullDateTime4Year);
		}

		if (orders.SCHEDULE.ORIG_ORDER_DT_TM) {
			dateTime.setISO8601(orders.SCHEDULE.ORIG_ORDER_DT_TM);
			origOrderDate = df.format(dateTime, fullDateTime4Year);
		}

		if (orders.SCHEDULE.PROJECTED_STOP_DT_TM) {
			dateTime.setISO8601(orders.SCHEDULE.PROJECTED_STOP_DT_TM);
			stopDate = df.format(dateTime, fullDateTime4Year);
			if (orders.SCHEDULE.STOP_REASON_DISPLAY) {
				stopReason = orders.SCHEDULE.STOP_REASON_DISPLAY;
			}
		}

		if (orders.CORE.RESPONSIBLE_PROVIDER_ID !== 0) {
			respProv = orders.CORE.RESPONSIBLE_PROVIDER;
		}

		//For the date that is displayed heads up is either last given for PRN, no date for continous, and next dose for scheduled
		item.push("<h3 class='info-hd'><span>", orders.DISPLAYS.DISPLAY_NAME, "</span></h3>");

		//Determine state of Info Button
		if (component.isInfoButtonEnabled() && component.hasInfoButton()) {
			infoClass = "info-icon-med";
		}
		else {
			infoClass = "info-icon-med hidden";
		}

		var startDateStr = component.formatDisplayDate(orders.SCHEDULE.CURRENT_START_DT_TM, "mmmm dd, yyyy HH:MM");

		if (adminFlag === "AdminMed") {
			item.push("<div class ='info-icon-div ", zebraStriping, "'><span data-orderId='", orderId, "' data-patId='", criterion.person_id, "' data-encId='", criterion.encntr_id, "' data-synonymId='", synonymId, "' data-priCriteriaCd='", priCriteriaCd, "' class='", infoClass, "' id='info-icon", componentId, "'>&nbsp;</span>");
			item.push("<dl class='" + compNS + "-info ", zebraStriping, " ", medIsRej, " '><dd><span class='" + compNS + "-details ", jsSeverity, "'><span class='" + compNS + "-rej-ind'></span><span class='med-o2-simplified-line'>", orders.DISPLAYS.DISPLAY_NAME, "</span></span><span class='" + compNS + "-order-start-date'>", startDateStr, "</span><span class='" + compNS + "-order-status'>", orders.CORE.STATUS_DISPLAY, "</span></dd></dl>");
			item.push("</div>");
		}
		else {
			item.push("<div class ='info-icon-div ", zebraStriping, "'><span data-orderId='", orderId, "' data-patId='", criterion.person_id, "' data-encId='", criterion.encntr_id, "' data-synonymId='", synonymId, "' data-priCriteriaCd='", priCriteriaCd, "' class='", infoClass, "' id='info-icon", componentId, "'>&nbsp;</span>");
			item.push("<dl class='" + compNS + "-info ", zebraStriping, " ", medIsRej, " '><dd><span class='" + compNS + "-details ", jsSeverity, "'><span class='" + compNS + "-rej-ind'></span><span class='med-o2-simplified-line'>", orders.DISPLAYS.DISPLAY_NAME, "<span class='" + compNS + "-sig detail-line'>", orders.DISPLAYS.SIMPLIFIED_DISPLAY_LINE, "</span></span></span><span class='" + compNS + "-order-start-date'>", startDateStr, "</span><span class='" + compNS + "-order-status'>", orders.CORE.STATUS_DISPLAY, "</span></dd></dl>");
			item.push("</div>");
		}

		//Creating the side panel data to be displayed for Medications o2 component requirement - Hover Information moved to the Side Panel

		var sidePanelData = {
			synonym_id : synonymId,
			order_id : orderId,
			med_name : orders.DISPLAYS.HOVER_NAME,
			rejected_ind : orders.CORE.REJECTED_IND,
			admin_flag : adminFlag,
			order_details : orders.DISPLAYS.CLINICAL_DISPLAY_LINE,
			order_comments : orders.COMMENTS.ORDER_COMMENT.replace(/\n/g, "<br />"),
			order_rejected_status : orders.CORE.REJECTED_IND,
			start_date : startDate,
			last_dose_date : "",
			order_date : origOrderDate,
			stop_date : stopDate,
			stop_reason : stopReason,
			display_name : orders.DISPLAYS.DISPLAY_NAME,
			prn_ind : orders.SCHEDULE.PRN_IND,
			unscheduled_ind : orders.SCHEDULE.FREQUENCY.UNSCHEDULED_IND,
			constant_ind : orders.SCHEDULE.CONSTANT_IND,
			meaning : orders.CORE.STATUS_MEANING,
			provider : respProv,
			status_display : orders.CORE.STATUS_DISPLAY,
			details : orders.DISPLAYS.SIMPLIFIED_DISPLAY_LINE
		};

		component.m_sidePanelArray.push(sidePanelData);

		return (item.join(""));
	}

	function createMedicationItemFromArray(ordersArray, faceUpDateFlag, severityFlag, component) {
		var jsMedItem = [];
		for (var z = 0, zl = ordersArray.length; z < zl; z++) {
			jsMedItem.push(createMedicationItem(ordersArray[z], faceUpDateFlag, severityFlag, null, z, component));
		}
		return jsMedItem;
	}

	function getHeadsUpMedicationDate(a) {
		if (a.SCHEDULE.PRN_IND === 1 || a.SCHEDULE.FREQUENCY.UNSCHEDULED_IND === 1) {
			return a.DETAILS.LAST_DOSE_DT_TM;
		}
		else {
			if (a.SCHEDULE.CONSTANT_IND === 1) {
				return "";
			}
			else {
				if (a.SCHEDULE.SUSPENDED_DT_TM === "") {
					return a.DETAILS.NEXT_DOSE_DT_TM;
				}
				else {
					return "";
				}
			}
		}
	}

	function SortByMedicationName(a, b) {
		var aName = a.DISPLAYS.DISPLAY_NAME;
		var bName = b.DISPLAYS.DISPLAY_NAME;
		var aUpper = (aName) ? aName.toUpperCase() : "";
		var bUpper = (bName) ? bName.toUpperCase() : "";

		if (aUpper > bUpper) {
			return 1;
		}
		else if (aUpper < bUpper) {
			return -1;
		}
		return 0;
	}

	function SortByLastDose(a, b) {
		if (a.DETAILS.LAST_DOSE_DT_TM > b.DETAILS.LAST_DOSE_DT_TM) {
			return -1;
		}
		else if (a.DETAILS.LAST_DOSE_DT_TM < b.DETAILS.LAST_DOSE_DT_TM) {
			return 1;
		}
		else {
			return 0;
		}
	}

	function SortByNextDose(a, b) {
		if (!a.DETAILS.NEXT_DOSE_DT_TM || !b.DETAILS.NEXT_DOSE_DT_TM) {
			if (a.DETAILS.NEXT_DOSE_DT_TM > b.DETAILS.NEXT_DOSE_DT_TM) {
				return -1;
			}
			if (a.DETAILS.NEXT_DOSE_DT_TM < b.DETAILS.NEXT_DOSE_DT_TM) {
				return 1;
			}

		}
		if (a.DETAILS.NEXT_DOSE_DT_TM > b.DETAILS.NEXT_DOSE_DT_TM) {
			return 1;
		}
		else if (a.DETAILS.NEXT_DOSE_DT_TM < b.DETAILS.NEXT_DOSE_DT_TM) {
			return -1;
		}
		else {
			return 0;
		}
	}

	function sortMedications(orders, sortType) {
		switch (sortType) {
			case CERN_MEDS_O2.LastDoseDateTime:
				orders.sort(SortByLastDose);
				break;
			case CERN_MEDS_O2.NextDoseDateTime:
				orders.sort(SortByNextDose);
				break;
			default:
				orders.sort(SortByMedicationName);
		}
	}

	function StatusObj(sCode, performedBy, performedDate, isMedsHistoryStatus) {
		var df = MP_Util.GetDateFormatter();

		this.clsName = "";
		this.status = "";
		this.performedBy = performedBy ? performedBy : "";
		this.performedDate = "";

		if (performedDate) {
			var dateTime = new Date();
			dateTime.setISO8601(performedDate);
			this.performedDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
		}

		var medsI18n = i18n.discernabu.medications_o2;
		switch(sCode) {
			case 0:
				//complete
				this.clsName = "complete";
				this.status = medsI18n.COMPLETE;
				break;
			case 1:
				//incomplete
				if (isMedsHistoryStatus) {
					this.clsName = "not-started";
					this.status = medsI18n.INCOMPLETE;
				}
				else {
					this.clsName = "partial";
					this.status = medsI18n.PARTIAL;
				}
				break;
			case 2:
				//In error
				this.clsName = "inerror";
				this.status = medsI18n.INERROR;
				break;
			case 3:
				//Pending Partial
				this.clsName = "partial-inprocess";
				this.status = medsI18n.PENDING_PARTIAL;
				break;
			case 4:
				//Pending Complete
				this.clsName = "partial-complete";
				this.status = medsI18n.PENDING_COMPLETE;
				break;
			case 5:
				//Not Started
				this.clsName = "not-started";
				this.status = medsI18n.NOT_STARTED;
				break;
			default:
				this.clsName = "unknown";
				this.status = medsI18n.UNKNOWN;
		}
	}

	function InfoButtonClick(e) {

		var compId = parseInt(this.id.replace(/[^\d]/g, ""), 10);
		var component = MP_Util.GetCompObjById(compId);
		var componentId = component.getComponentId();
		var secContentEl = component.getSectionContentNode();
		var secContentId = secContentEl.id;
		var medInfoIcons = $("#" + secContentId).find(".info-icon-med");

		if (component.compMenuReference["compInfoButton" + componentId].isSelected()) {
			component.compMenuReference["compInfoButton" + componentId].setIsSelected(false);
			MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, "", "", false, "0");

			$.each(medInfoIcons, function() {
				medInfoIcons.addClass("hidden");
			});
		}
		else {
			component.compMenuReference["compInfoButton" + componentId].setIsSelected(true);
			MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, "", "", false, "1");

			$.each(medInfoIcons, function() {
				medInfoIcons.removeClass("hidden");
			});
		}

		//Add Info Button click events
		if (component.hasInfoButton()) {
			$.each(medInfoIcons, function() {
				$(this).click(function(e) {
					//Get the values needed for the API
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
					}
					catch(err) {
						if (err.name) {
							if (err.message) {
								error_name = err.name;
								error_msg = err.message;
							}
							else {
								error_name = err.name;
								error_msg = i18n.discernabu.INFO_BUTTON_ERROR_MSG;
							}
						}
						else {
							error_name = err.name;
							error_msg = i18n.discernabu.INFO_BUTTON_ERROR_MSG;
						}
						logger.logError(error_name + error_msg);
						errorModal = MP_ModalDialog.retrieveModalDialogObject("errorModal");
						if (!errorModal) {
							errorModal = MP_Util.generateModalDialogBody("errorModal", "error", error_msg, i18n.discernabu.INFO_BUTTON_ERROR_ACTION);
							errorModal.setHeaderTitle(i18n.ERROR_OCCURED);
							//Create and add the close button
							closeButton = new ModalButton("closeButton");
							closeButton.setText(i18n.CLOSE).setCloseOnClick(true);
							errorModal.addFooterButton(closeButton);
						}
						MP_ModalDialog.updateModalDialogObject(errorModal);
						MP_ModalDialog.showModalDialog("errorModal");
						return;
					}
					e.preventDefault();
					e.stopPropagation();
					e.stopImmediatePropagation();
				});
			});
		}
	}

	return {

		GetMedicationData : function(component) {
			var criterion = component.getCriterion();
			var thread = null;
			var schContPRN = false;
			var medsScriptReturned = false;
			var statusScriptReturned = false;
			var scriptRequest = null;
			var statusScriptRequest = null;
			var loadTimer = null;
			var renderTimer = null;
			var deferralBitmap = 2;
			var dataRecord = [];
			var sEncntr = (component.getScope() === 2) ? criterion.encntr_id + ".0" : "0.0";

			if (component.isScheduled() || component.isContinuous() || component.isPRN()) {
				schContPRN = true;
			}

			//Function to thread the Medications and the Status response
			function threadCheck(dataReply) {
				if (dataReply.getName() === "GetMostMedData") {
					dataRecord.push(dataReply);
					medsScriptReturned = true;
				}
				else if (dataReply.getName() === "GetMedsStatusData") {
					dataRecord.push(dataReply);
					statusScriptReturned = true;
				}

				if (medsScriptReturned && statusScriptReturned) {
					CERN_MEDS_O2.RenderReply(dataRecord, component);
				}
			}

			//Set the deferralBitmap to fetch the medication(s) scheduled or administered to be given to the patient
			if (component.getPRNLastFortyEight() === 1 || component.getAdministeredLookBkHrs() > 0) {
				//PRN Medications administered within Last 48 hours or Administered medications within (n) look back hours
				deferralBitmap = 0;
			}
			else if (component.getSchedNextTwelve()) {
				//Scheduled Medications within Next 12 hours
				deferralBitmap = 4;
			}

			//Script to get the Medication Details
			var viewCategoryMean = criterion.category_mean;
			loadTimer = new RTMSTimer(component.getComponentLoadTimerName(), viewCategoryMean);
			renderTimer = new RTMSTimer("ENG:MPG.MEDS.O2 - load meds data using wrapper script", viewCategoryMean);
			scriptRequest = new ComponentScriptRequest();
			scriptRequest.setName("GetMostMedData");
			scriptRequest.setProgramName("MP_RETRIEVE_MEDICATIONS");
			scriptRequest.setParameterArray(["^MINE^", criterion.person_id + ".0", sEncntr, criterion.provider_id + ".0", component.getLookbackUnits(), "^" + schContPRN + "^", "^" + component.isAdministered() + "^", "^" + component.isSuspended() + "^", "^" + component.isDiscontinued() + "^", component.getDiscontinuedLookBkHr(), component.getAdministeredLookBkHrs(), component.getLookbackUnitTypeFlag(), criterion.ppr_cd + ".0", "^" + criterion.executable + "^", deferralBitmap]);
			scriptRequest.setComponent(component);
			scriptRequest.setResponseHandler(threadCheck);
			scriptRequest.setLoadTimer(loadTimer);
			scriptRequest.setRenderTimer(renderTimer);

			//Add another script that gets Medication Reconciliation Status
			loadTimer = new RTMSTimer("ENG:MPG.MEDS.O2 - load meds status data", viewCategoryMean);
			statusScriptRequest = new ComponentScriptRequest();
			statusScriptRequest.setProgramName("MP_GET_MED_STATUS");
			statusScriptRequest.setParameterArray(["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0",criterion.ppr_cd + ".0"]);
			statusScriptRequest.setComponent(component);
			statusScriptRequest.setName("GetMedsStatusData");
			statusScriptRequest.setResponseHandler(threadCheck);
			statusScriptRequest.setLoadTimer(loadTimer);

			scriptRequest.performRequest();
			statusScriptRequest.performRequest();
		},

		callInfoButtonClick : function(e) {
			InfoButtonClick.call(e, e);
		},

		RenderReply : function(replyAr, component) {
			var timerRenderComponent = new RTMSTimer(component.getComponentRenderTimerName(), component.getCriterion().category_mean);
			timerRenderComponent.start();
			var medsI18n = i18n.discernabu.medications_o2;
			var countText = "";
			try {
				var AdministeredCount = 0;
				var AdministeredRejCount = 0;
				var continousCount = 0;
				var continousRejCount = 0;
				var dateTime = new Date();
				var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
				var DiscontinuedCount = 0;
				var DiscontinuedRejCount = 0;
				var item;
				var jsAdministered = [];
				var jsContinous = [];
				var jsDiscontinued = [];
				var jsHTML = [];
				var jsPRNAdmin = [];
				var jsPRNUnschedAvail = [];
				var jsScheduled = [];
				var jsSuspended = [];
				var order;
				var prnCount = 0;
				var prnLast48Orders = [];
				var prnRejCount = 0;
				var prnUnschedAvailCount = 0;
				var prnUnschedAvailRejCount = 0;
				var recordData;
				var schedLookaheadHrs;
				var prnLastFortyEight = 0;
				var scheduledCount = 0;
				var scheduledRejCount = 0;
				var sDate;
				var sHTML = "";
				var strRejMedClass = "";
				var SuspendedCount = 0;
				var SuspendedRejCount = 0;
				var critFlag = 0;
				var z;
				var zl;
				var componentId = component.getComponentId();
				var orderIds = [];
				var decimalPadding = (component.getScope() === 2) ? ".0" : ".00";
				var compNS = component.m_compNS;

				//Defaults status to unknown
				var medsHistStatusObj = new StatusObj(-1, true);
				var mrAdmissionStatusObj = new StatusObj(-1);
				var mrDischargeStatusObj = new StatusObj(-1);
				var mrTransferStatusObj = new StatusObj(-1);
				
				var venueAdm = 0;
				var venueDisch = 0;
				var crossEncntrFlag = 0;
				var statusTitle = "";
				var medRecDischargeTitle = "";
				

				jsHTML.push("<div id='medications_o2_", componentId, "' class='" + compNS + "-content-body sidepanel-close-width'>");
				jsHTML.push("<div class='" + compNS + "-content-header'><span class='" + compNS + "-details'>", medsI18n.ORDER, "</span><span class='" + compNS + "-order-start-date'>", medsI18n.ORDER_START, "</span><span class='" + compNS + "-order-status'>", medsI18n.STATUS, "</span></div>");
				jsHTML.push("<div id='" + compNS + "-content-container'>");

				for (var x = replyAr.length; x--; ) {
					var reply = replyAr[x];

					if (reply.getStatus() == "S") {
						switch (reply.getName()) {
							case "GetMostMedData":
								recordData = reply.getResponse();

								recordData.SCHCONTPRN_ORDERS.sort(SortByMedicationName);

								if (component.getPRNLastFortyEight()) {
									prnLastFortyEight = 48;
								}

								var prnLastFortyEightDate = new Date();
								var lastFortyEightHrs = prnLastFortyEightDate.getHours() - prnLastFortyEight;
								prnLastFortyEightDate.setHours(lastFortyEightHrs);

								var prnLookbackDays = component.getPRNLookbackDays();
								var prnLookbackDate = new Date();
								var hrs = prnLookbackDate.getHours() - (24 * prnLookbackDays);
								prnLookbackDate.setHours(hrs);
								if (component.getSchedNextTwelve()) {
									schedLookaheadHrs = 12;
								}

								var schedLookaheadDate = new Date();
								var schedHrs = schedLookaheadDate.getHours() + schedLookaheadHrs;
								schedLookaheadDate.setHours(schedHrs);

								var orderPrnAdmin = [];
								var orderScheduled = [];
								var orderPRNUnschedAvail = [];
								var orderContinuous = [];

								//For PRN/Unscheduled, Scheduled, and Continous only retrieve these type of medications if
								//they are in the following status:
								//ordered, inprocess, future, incomplete, onhold.

								for (var y = 0, yl = recordData.SCHCONTPRN_ORDERS.length; y < yl; y++) {
									dateTime = new Date();
									order = recordData.SCHCONTPRN_ORDERS[y];
									orderIds.push(order.MEDICATION_INFORMATION.ORDER_ID + decimalPadding);

									if (order.CORE.STATUS_MEANING) {
										item = null;
										switch (order.CORE.STATUS_MEANING) {
											case "ORDERED":
											case "INPROCESS":
											case "FUTURE":
											case "INCOMPLETE":
											case "MEDSTUDENT":
												if (order.SCHEDULE.PRN_IND == 1 || order.SCHEDULE.FREQUENCY.UNSCHEDULED_IND == 1) {
													if (prnLookbackDays > 0) {
														sDate = getHeadsUpMedicationDate(order);
														if (sDate) {
															dateTime.setISO8601(sDate);
															if (dateTime >= prnLookbackDate) {
																orderPrnAdmin.push(order);
																if (order.CORE.REJECTED_IND == 1) {
																	prnRejCount++;
																}
																prnCount++;
															}
														}
													}

													if (prnLastFortyEight > 0) {
														var curDate = new Date();
														sDate = getHeadsUpMedicationDate(order);
														if (sDate) {
															dateTime.setISO8601(sDate);
															if ((dateTime >= prnLastFortyEightDate) && (dateTime <= curDate)) {
																orderPRNUnschedAvail.push(order);

																if (order.CORE.REJECTED_IND == 1) {
																	prnUnschedAvailRejCount++;
																}
																prnUnschedAvailCount++;
															}
														}
													}
													else {
														orderPRNUnschedAvail.push(order);
														if (order.CORE.REJECTED_IND == 1) {
															prnUnschedAvailRejCount++;
														}
														prnUnschedAvailCount++;
													}

												}
												else if (order.SCHEDULE.CONSTANT_IND === 1) {
													orderContinuous.push(order);
													if (order.CORE.REJECTED_IND == 1) {
														continousRejCount++;
													}
													continousCount++;
												}
												else if (order.SCHEDULE.SUSPENDED_DT_TM === "") {
													//If Scheduled Hours is set in Bedrock
													if (schedLookaheadHrs > 0) {
														scheduledDate = getHeadsUpMedicationDate(order);

														if (scheduledDate) {
															dateTime.setISO8601(scheduledDate);
															var curDateTime = new Date();
															if ((dateTime <= schedLookaheadDate) && (dateTime >= curDateTime)) {
																orderScheduled.push(order);
																if (order.CORE.REJECTED_IND == 1) {
																	scheduledRejCount++;
																}
																scheduledCount++;
															}
														}
													}
													else {
														orderScheduled.push(order);
														if (order.CORE.REJECTED_IND == 1) {
															scheduledRejCount++;
														}
														scheduledCount++;
													}
												}
												break;
										}
									}
								}
								var prnSort = component.getPRNAdminSort();
								sortMedications(orderPrnAdmin, prnSort);

								jsPRNAdmin = createMedicationItemFromArray(orderPrnAdmin, true, null, component);

								var schedSort = component.getScheduledSort();
								//Nursing uses NextDoseDateTime for sort on scheduled meds and requires critical flag.
								if (component.getSchedOverdue()) {
									critFlag = 1;
								}

								if (component.getScheduleNextDose()) {
									sortMedications(orderScheduled, CERN_MEDS_O2.NextDoseDateTime);
								}
								else {
									sortMedications(orderScheduled, schedSort);
								}
								jsScheduled = createMedicationItemFromArray(orderScheduled, component.getScheduleNextDose(), critFlag, component);

								var prnUnschedAvailSort = component.getPRNUnschedAvailSort();
								if (component.getPRNLastDose()) {
									sortMedications(orderPRNUnschedAvail, CERN_MEDS_O2.LastDoseDateTime);
								}
								else {
									sortMedications(orderPRNUnschedAvail, prnUnschedAvailSort);
								}

								jsPRNUnschedAvail = createMedicationItemFromArray(orderPRNUnschedAvail, component.getDisplayPRNFaceUpDt(), null, component);

								var continuousSort = component.getContinuousSort();
								sortMedications(orderContinuous, continuousSort);
								jsContinous = createMedicationItemFromArray(orderContinuous, null, null, component);

								// Process administered Meds
								recordData.ADMIN_ORDERS.sort(SortByMedicationName);
								var adminCnt = 0;
								for ( z = 0, zl = recordData.ADMIN_ORDERS.length; z < zl; z++) {
									order = recordData.ADMIN_ORDERS[z];
									orderIds.push(order.MEDICATION_INFORMATION.ORDER_ID + decimalPadding);
									jsAdministered.push(createMedicationItem(order, null, null, "AdminMed", adminCnt, component));
									adminCnt++;
									if (order.CORE.REJECTED_IND == 1) {
										AdministeredRejCount++;
									}
									AdministeredCount++;
								}
								// Process suspended orders

								recordData.SUSP_ORDERS.sort(SortByMedicationName);

								for ( z = 0, zl = recordData.SUSP_ORDERS.length; z < zl; z++) {
									order = recordData.SUSP_ORDERS[z];
									orderIds.push(order.MEDICATION_INFORMATION.ORDER_ID + decimalPadding);
									item = createMedicationItem(order, null, null, null, z, component);
									jsSuspended.push(item);
									if (order.CORE.REJECTED_IND == 1) {
										SuspendedRejCount++;
									}
									SuspendedCount++;
								}
								//Process Discontinued Orders

								recordData.DISCONT_ORDERS.sort(SortByMedicationName);
								for ( z = 0, zl = recordData.DISCONT_ORDERS.length; z < zl; z++) {
									order = recordData.DISCONT_ORDERS[z];
									orderIds.push(order.MEDICATION_INFORMATION.ORDER_ID + decimalPadding);
									item = createMedicationItem(order, null, null, null, z, component);
									jsDiscontinued.push(item);
									if (order.CORE.REJECTED_IND == 1) {
										DiscontinuedRejCount++;
									}
									DiscontinuedCount++;
								}
								break;
							case "GetMedsStatusData":
								recordData = reply.getResponse();
								if (reply.getStatus() === "S") {
									medsHistStatusObj = new StatusObj(recordData.MEDS_HIST_STATUS.STATUS_FLAG, recordData.MEDS_HIST_STATUS.PERFORMED_PRSNL_NAME, recordData.MEDS_HIST_STATUS.PERFORMED_DATE, true);
									mrAdmissionStatusObj = new StatusObj(recordData.MEDREC_ADMISSION_STATUS.STATUS_FLAG, recordData.MEDREC_ADMISSION_STATUS.PERFORMED_PRSNL_NAME, recordData.MEDREC_ADMISSION_STATUS.PERFORMED_DATE);
									mrDischargeStatusObj = new StatusObj(recordData.MEDREC_DISCHARGE_STATUS.STATUS_FLAG, recordData.MEDREC_DISCHARGE_STATUS.PERFORMED_PRSNL_NAME, recordData.MEDREC_DISCHARGE_STATUS.PERFORMED_DATE);

									mrTransferStatusObj = new StatusObj(recordData.MEDREC_TRANSFER_STATUS.STATUS_FLAG, recordData.MEDREC_TRANSFER_STATUS.PERFORMED_PRSNL_NAME, recordData.MEDREC_TRANSFER_STATUS.PERFORMED_DATE);

									venueAdm = recordData.VENUE_CODE.ADMISSION;
									venueDisch = recordData.VENUE_CODE.DISCHARGE;
									crossEncntrFlag = recordData.MEDREC_TRANSFER_STATUS.CROSS_ENCNTR_IND;
									if (recordData.ENCNTR_TYPE === 2) {
										statusTitle = MP_Util.GetCodeValueByMeaning("OUTPATIENT", 4003029);
										if (statusTitle) {
											medRecDischargeTitle = statusTitle.display;
										} else {
											medRecDischargeTitle = medsI18n.OUTPATIENT_MEDREC;
										}
									} else {
										statusTitle = MP_Util.GetCodeValueByMeaning("DISCHARGE", 4003029);
										if (statusTitle) {
											medRecDischargeTitle = statusTitle.display;
										} else {
											medRecDischargeTitle = medsI18n.DISCHARGE_MEDREC;
										}
									}
								}
								break;
						}
					}
				}
				if (component.isScheduled()) {
					var lookFwdText = "";
					if (schedLookaheadHrs > 0) {//Add Code for Nursing
						lookFwdText = " " + medsI18n.NEXT_N_HOURS.replace("{0}", schedLookaheadHrs);
					}
					jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd " + compNS + "-sec-height'><span class='sub-sec-hd-tgl' title='", medsI18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'><span class='sub-sec-title-heading'>", medsI18n.SCHEDULED, "</span> (", scheduledCount, ")", lookFwdText, " </span></h3>");

					if (scheduledRejCount > 0) {
						strRejMedClass = compNS + "-has-rej";
					}
					jsHTML.push("<div class='sub-sec-content'><div class='", strRejMedClass, " '>", jsScheduled.join(""), "</div></div>");

					jsHTML.push("</div>");
				}

				if (component.isContinuous()) {
					jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd " + compNS + "-sec-height'><span class='sub-sec-hd-tgl' title='", medsI18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'><span class='sub-sec-title-heading'>", medsI18n.CONTINOUS, "</span> (", continousCount, ")</span></h3>");
					if (continousCount > 0) {
						strRejMedClass = "";
						if (continousRejCount > 0) {
							strRejMedClass = compNS + "-has-rej";
						}
						jsHTML.push("<div class='sub-sec-content'><div class='", strRejMedClass, " '>", jsContinous.join(""), "</div></div>");
					}
					jsHTML.push("</div>");
				}

				if (component.getPRNLookbackDays() > 0) {
					jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd " + compNS + "-sec-height'><span class='sub-sec-hd-tgl' title='", medsI18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'><span class='sub-sec-title-heading'>", medsI18n.PRN, "/", medsI18n.UNSCHEDULED, "</span> (", prnCount, ")");
					jsHTML.push(" ", medsI18n.ADMIN_LAST_N_HOURS.replace("{0}", component.getPRNLookbackDays() * 24));
					jsHTML.push("</span></h3>");
					if (prnCount > 0) {
						strRejMedClass = "";
						if (prnRejCount > 0) {
							strRejMedClass = compNS + "-has-rej";
						}
						jsHTML.push("<div class='sub-sec-content'><div class='", strRejMedClass, " '>", jsPRNAdmin.join(""), "</div></div>");
					}
					jsHTML.push("</div>");
				}

				if (component.isPRN()) {
					var lastFortyEightText = "";
					if (prnLastFortyEight > 0) {//Add Code for Nursing
						lastFortyEightText = " " + medsI18n.LAST_N_HOURS.replace("{0}", prnLastFortyEight);
					}
					jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd " + compNS + "-sec-height'><span class='sub-sec-hd-tgl' title='", medsI18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'><span class='sub-sec-title-heading'>", medsI18n.PRN_UNSCHEDULED, "</span> (", prnUnschedAvailCount, ")", lastFortyEightText);
					jsHTML.push("</span></h3>");
					if (prnUnschedAvailCount > 0) {
						strRejMedClass = "";
						if (prnUnschedAvailRejCount > 0) {
							strRejMedClass = compNS + "-has-rej";
						}
						if (component.getPRNLastDose()) {
							jsHTML.push("<div class='sub-sec-content'><div class='", strRejMedClass, " '>", jsPRNUnschedAvail.join(""), "</div></div>");
						}
						else {
							jsHTML.push("<div class='sub-sec-content'><div class='", strRejMedClass, " '>", jsPRNUnschedAvail.join(""), "</div></div>");
						}
					}
					jsHTML.push("</div>");
				}

				if (component.isAdministered()) {
					jsHTML.push("<div class='sub-sec closed'><h3 class='sub-sec-hd " + compNS + "-sec-height'><span class='sub-sec-hd-tgl' title='", medsI18n.SHOW_SECTION, "'>-</span><span class='sub-sec-title'><span class='sub-sec-title-heading'>", medsI18n.ADMINISTERED, "</span> (", AdministeredCount, ")");
					if (component.getAdministeredLookBkHrs() > 0) {
						jsHTML.push(" ", medsI18n.LAST_N_HOURS.replace("{0}", component.getAdministeredLookBkHrs()));
					}
					jsHTML.push("</span></h3>");
					if (AdministeredCount > 0) {
						strRejMedClass = "";
						if (AdministeredRejCount > 0) {
							strRejMedClass = compNS + "-has-rej";
						}
						jsHTML.push("<div class='sub-sec-content'><div class='", strRejMedClass, " '>", jsAdministered.join(""), "</div></div>");
					}
					jsHTML.push("</div>");
				}

				if (component.isSuspended()) {
					jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd " + compNS + "-sec-height'><span class='sub-sec-hd-tgl' title='", medsI18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'><span class='sub-sec-title-heading'>", medsI18n.SUSPENDED, "</span> (", SuspendedCount, ")</span></h3>");
					if (SuspendedCount > 0) {
						strRejMedClass = "";
						if (SuspendedRejCount > 0) {
							strRejMedClass = compNS + "-has-rej";
						}
						jsHTML.push("<div class='sub-sec-content'><div class='", strRejMedClass, " '>", jsSuspended.join(""), "</div></div>");
					}
					jsHTML.push("</div>");
				}

				if (component.isDiscontinued()) {
					jsHTML.push("<div class='sub-sec closed'><h3 class='sub-sec-hd " + compNS + "-sec-height'><span class='sub-sec-hd-tgl ' title='", medsI18n.SHOW_SECTION, "'>-</span><span class='sub-sec-title'><span class='sub-sec-title-heading'>", medsI18n.DISCONTINUED, "</span> (", DiscontinuedCount, ")");
					if (component.getDiscontinuedLookBkHr() > 0) {
						jsHTML.push(" ", medsI18n.LAST_N_HOURS.replace("{0}", component.getDiscontinuedLookBkHr()));
					}
					jsHTML.push("</span></h3>");
					if (DiscontinuedCount > 0) {
						strRejMedClass = "";
						if (DiscontinuedRejCount > 0) {
							strRejMedClass = compNS + "-has-rej";
						}
						jsHTML.push("<div class='sub-sec-content'><div class='", strRejMedClass, " '>", jsDiscontinued.join(""), "</div></div>");
					}
					jsHTML.push("</div>");
				}
				var content = [];
				var totalLength = DiscontinuedCount + SuspendedCount + AdministeredCount + prnCount + continousCount + scheduledCount + prnUnschedAvailCount;

				/**
				 * Code changed for the Web enabling of Medications o2 component requirement - Reconciliation links are disabled for web
				 */
				var medrecHTML = [];
				var statusHTML = "";

				var medRecLinksHtml = "";
				var medHxStatusHtml = "";
				var mrAdmnStatusHtml = "";
				var mrTransferStatusHtml = "";
				var mrCrxEncntrTxStatusHtml = "";
				var mrDischargeStatusHtml = "";
				var medRecFiltersFlag = false;
				var medRecHtmlStatus = "";
				var medrecLinkSeperatorFlag = "";

				//Status data
				var criterion = component.getCriterion();
				if (criterion.encntr_id !== 0) {
					if (component.getMedHistory()) {
						if (CERN_Platform.inMillenniumContext()) {
							medHxStatusHtml = "<h3 class='info-hd'>" + medsI18n.STATUS + "</h3><dl class='" + compNS + "-status result-info'><dd class='" + compNS + "-status-img meds-hist-status " + medsHistStatusObj.clsName + "'>&nbsp;</dd><dd><a id='medsHistory" + componentId + "'>" + medsI18n.MEDS_HISTORY + "</a></dd></dl><div class='result-details'><h4 class='det-hd'><span>" + medsI18n.STATUS + "</span></h4><dl class='" + compNS + "-det'><dt><span>" + medsI18n.STATUS + ":</span></dt><dd><span>" + medsHistStatusObj.status + "</span></dd><dt><span>" + medsI18n.LAST_DOCUMENTED + ":</span></dt><dd><span>" + medsHistStatusObj.performedDate + "</span></dd><dt><span>" + medsI18n.LAST_DOCUMENTED_BY + ":</span></dt><dd><span>" + medsHistStatusObj.performedBy + "</span></dd></dl></div>";
						} else {
							medHxStatusHtml = "<h3 class='info-hd'>" + medsI18n.STATUS + "</h3><dl class='" + compNS + "-status'><dd class='" + compNS + "-status-img meds-hist-status " + medsHistStatusObj.clsName + "'>&nbsp;</dd><dd>" + medsI18n.MEDS_HISTORY + "</dd></dl>";
						}
						medRecLinksHtml += medHxStatusHtml;
						medrecLinkSeperatorFlag = compNS + '-medrec-link-seperator';
						medRecFiltersFlag = true;
					}

					if (component.getMedRecAdmit()) {
						var admissionTitle = MP_Util.GetCodeValueByMeaning("ADMISSION", 4003029);
						var medRecAdmitTitle = "";
							if (admissionTitle) {
								medRecAdmitTitle = admissionTitle.display;
							} else {
								medRecAdmitTitle = medsI18n.ADMISSION_MEDREC;
							}
						if (CERN_Platform.inMillenniumContext()) {
							mrAdmnStatusHtml = "<h3 class='info-hd'>" + medsI18n.STATUS + "</h3><dl class='" + compNS + "-status result-info'><dd class=" + medrecLinkSeperatorFlag + ">&nbsp;</dd><dd class='" + compNS + "-status-img med-rec-status " + mrAdmissionStatusObj.clsName + "'>&nbsp;</dd><dd><a id='medRecAdmission" + componentId + "'>" + medRecAdmitTitle + "</a></dd></dl><div class='result-details'><h4 class='det-hd'><span>" + medsI18n.STATUS + "</span></h4><dl class='" + compNS + "-det'><dt><span>" + medsI18n.STATUS + ":</span></dt><dd><span>" + mrAdmissionStatusObj.status + "</span></dd><dt><span>" + medsI18n.LAST_RECONED + ":</span></dt><dd><span>" + mrAdmissionStatusObj.performedDate + "</span></dd><dt><span>" + medsI18n.LAST_RECONED_BY + ":</span></dt><dd><span>" + mrAdmissionStatusObj.performedBy + "</span></dd></dl></div>";
						} else {
							mrAdmnStatusHtml = "<h3 class='info-hd'>" + medsI18n.STATUS + "</h3><dl class='" + compNS + "-status'><dd class=" + medrecLinkSeperatorFlag + ">&nbsp;</dd><dd class='" + compNS + "-status-img med-rec-status " + mrAdmissionStatusObj.clsName + "'>&nbsp;</dd><dd>" + medRecAdmitTitle + "</dd></dl>";
						}
						medRecFiltersFlag = true;
						medrecLinkSeperatorFlag = compNS + '-medrec-link-seperator';
						medRecLinksHtml += mrAdmnStatusHtml;
					}

					if (component.getMedRecTransfer()) {
						var imgClassTransfer = "";
						var transferHoverHtml = "";
						var medRecTransferTitle = "";
						var medRecTransferName = MP_Util.GetCodeValueByMeaning("TRANSFER", 4003029);
						if (medRecTransferName) {
								medRecTransferTitle = medRecTransferName.display;
							} else {
								medRecTransferTitle = medsI18n.TRANSFER_MEDREC;
							}
						if (!crossEncntrFlag) {
							if (mrTransferStatusObj.clsName === "partial-inprocess" || mrTransferStatusObj.clsName === "partial-complete") {
								imgClassTransfer = compNS + "-status-img" + " " + mrTransferStatusObj.clsName;
								transferHoverHtml = "<div class='result-details hover'><h4 class='det-hd'><span>" + medsI18n.STATUS + "</span></h4><dl class='" + compNS + "-det'><dt><span>" + medsI18n.STATUS + ":</span></dt><dd><span>" + mrTransferStatusObj.status + "</span></dd><dt><span>" + medsI18n.LAST_RECONED + ":</span></dt><dd><span>" + mrTransferStatusObj.performedDate + "</span></dd><dt><span>" + medsI18n.LAST_RECONED_BY + ":</span></dt><dd><span>" + mrTransferStatusObj.performedBy + "</span></dd></dl></div>";
							}							
						}
						if (CERN_Platform.inMillenniumContext()) {
							mrTransferStatusHtml = "<h3 class='info-hd'>" + medsI18n.STATUS + "</h3><dl class='" + compNS + "-status result-info'><dd class=" + medrecLinkSeperatorFlag + ">&nbsp;</dd><dd class='" + imgClassTransfer + "'>&nbsp;</dd><dd><a id='medRecTransfer" + componentId + "'>" + medRecTransferTitle + "</a></dd></dl>";
							mrTransferStatusHtml += transferHoverHtml;
						} else {
							mrTransferStatusHtml = "<h3 class='info-hd'>" + medsI18n.STATUS + "</h3><dl class='" + compNS + "-status result-info'><dd class=" + medrecLinkSeperatorFlag + ">&nbsp;</dd><dd class='" + imgClassTransfer + "'>&nbsp;</dd><dd>" + medRecTransferTitle + "</dd></dl>";
						}
						medRecFiltersFlag = true;
						medrecLinkSeperatorFlag = compNS + '-medrec-link-seperator';
						medRecLinksHtml += mrTransferStatusHtml;
					}

					if (component.getMedRecCrossEncTx()) {
						var imgClass = "";
						var crossEncntrTxHoverHtml = "";
						var medRecXEncntrTxTitle = "";
						var crossEncTxName = MP_Util.GetCodeValueByMeaning("XENCTRANSFER", 4003029);

						if (crossEncTxName) {
							medRecXEncntrTxTitle = crossEncTxName.display;
						} else {
							medRecXEncntrTxTitle = medsI18n.CROSS_ENCNTR_TRASNFER;
						}
						if (crossEncntrFlag) {
							if (mrTransferStatusObj.clsName === "partial-inprocess" || mrTransferStatusObj.clsName === "partial-complete") {
								imgClass = compNS + "-status-img" + " " + mrTransferStatusObj.clsName;
								crossEncntrTxHoverHtml = "<div class='result-details hover'><h4 class='det-hd'><span>" + medsI18n.STATUS + "</span></h4><dl class='" + compNS + "-det'><dt><span>" + medsI18n.STATUS + ":</span></dt><dd><span>" + mrTransferStatusObj.status + "</span></dd><dt><span>" + medsI18n.LAST_RECONED + ":</span></dt><dd><span>" + mrTransferStatusObj.performedDate + "</span></dd><dt><span>" + medsI18n.LAST_RECONED_BY + ":</span></dt><dd><span>" + mrTransferStatusObj.performedBy + "</span></dd></dl></div>";
							}						
						}
						if (CERN_Platform.inMillenniumContext()) {
							mrCrxEncntrTxStatusHtml = "<h3 class='info-hd'>" + medsI18n.STATUS + "</h3><dl class='" + compNS + "-status result-info'><dd class=" + medrecLinkSeperatorFlag + ">&nbsp;</dd><dd class='" + imgClass + "'>&nbsp;</dd><dd><a id='medRecCrossEncntrTx" + componentId + "'>" + medRecXEncntrTxTitle + "</a></dd></dl>";
							mrCrxEncntrTxStatusHtml += crossEncntrTxHoverHtml;
						} else {
							mrCrxEncntrTxStatusHtml = "<h3 class='info-hd'>" + medsI18n.STATUS + "</h3><dl class='" + compNS + "-status result-info'><dd class=" + medrecLinkSeperatorFlag + ">&nbsp;</dd><dd class='" + imgClass + "'>&nbsp;</dd><dd>" + medRecXEncntrTxTitle + "</dd></dl>";
						}
						medRecFiltersFlag = true;
						medrecLinkSeperatorFlag = compNS + '-medrec-link-seperator';
						medRecLinksHtml += mrCrxEncntrTxStatusHtml;
					}
					if (component.getMedRecDischarge()) {
						if (CERN_Platform.inMillenniumContext()) {
							mrDischargeStatusHtml = "<h3 class='info-hd'>" + medsI18n.STATUS + "</h3><dl class='" + compNS + "-status result-info'><dd class=" + medrecLinkSeperatorFlag + ">&nbsp;</dd><dd class='" + compNS + "-status-img " + mrDischargeStatusObj.clsName + "'>&nbsp;</dd><dd><a id='medRecDischarge" + componentId + "'>" + medRecDischargeTitle + "</a></dd></dl><div class='result-details hover'><h4 class='det-hd'><span>" + medsI18n.STATUS + "</span></h4><dl class='" + compNS + "-det'><dt><span>" + medsI18n.STATUS + ":</span></dt><dd><span>" + mrDischargeStatusObj.status + "</span></dd><dt><span>" + medsI18n.LAST_RECONED + ":</span></dt><dd><span>" + mrDischargeStatusObj.performedDate + "</span></dd><dt><span>" + medsI18n.LAST_RECONED_BY + ":</span></dt><dd><span>" + mrDischargeStatusObj.performedBy + "</span></dd></dl></div>";
						} else {
							mrDischargeStatusHtml = "<h3 class='info-hd'>" + medsI18n.STATUS + "</h3><dl class='" + compNS + "-status result-info'><dd class=" + medrecLinkSeperatorFlag + ">&nbsp;</dd><dd class='" + compNS + "-status-img med-rec-status " + mrDischargeStatusObj.clsName + "'>&nbsp;</dd><dd>" + medRecDischargeTitle + "</dd></dl>";
						}
						medRecFiltersFlag = true;
						medRecLinksHtml += mrDischargeStatusHtml;
					}
					if (medRecFiltersFlag) {
						medRecHtmlStatus = "<div class='" + compNS + "-status-container' id='medStatusContainer" + componentId + "'><dl class='" + compNS + "-status'><dd>" + medsI18n.STATUS + ":</dd></dl>";
						medRecHtmlStatus += medRecLinksHtml;
						medRecHtmlStatus += "</div>";
					}

					medrecHTML.push(medRecHtmlStatus);
				}
				jsHTML.push("</div></div>");

				content.push(medrecHTML.join(""), "<div class='", MP_Util.GetContentClass(component, totalLength), "'>", jsHTML.join(""), "</div>");

				sHTML = content.join("");

				countText = MP_Util.CreateTitleText(component, totalLength);

				//Finalize the component
				MP_Util.Doc.FinalizeComponent(sHTML, component, countText);

				//Set the scroll to the component
				component.setComponentScroll();

				//Add Info Button click events
				if (component.hasInfoButton() && component.isInfoButtonEnabled()) {
					component.compMenuReference["compInfoButton" + componentId].setIsSelected(true);
					var secContentEl = component.getSectionContentNode();
					var secContentId = secContentEl.id;
					var medInfoIcons = $("#" + secContentId).find(".info-icon-med");
					$.each(medInfoIcons, function() {
						$(this).click(function(e) {
							//Get the values needed for the API
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
							}
							catch(err) {
								if (err.name) {
									if (err.message) {
										error_name = err.name;
										error_msg = err.message;
									}
									else {
										error_name = err.name;
										error_msg = i18n.discernabu.INFO_BUTTON_ERROR_MSG;
									}
								}
								else {
									error_name = err.name;
									error_msg = i18n.discernabu.INFO_BUTTON_ERROR_MSG;
								}
								logger.logError(error_name + error_msg);
								errorModal = MP_ModalDialog.retrieveModalDialogObject("errorModal");
								if (!errorModal) {
									errorModal = MP_Util.generateModalDialogBody("errorModal", "error", error_msg, i18n.discernabu.INFO_BUTTON_ERROR_ACTION);
									errorModal.setHeaderTitle(i18n.ERROR_OCCURED);
									//Create and add the close button
									closeButton = new ModalButton("closeButton");
									closeButton.setText(i18n.CLOSE).setCloseOnClick(true);
									errorModal.addFooterButton(closeButton);
								}
								MP_ModalDialog.updateModalDialogObject(errorModal);
								MP_ModalDialog.showModalDialog("errorModal");
								return;
							}
							e.preventDefault();
							e.stopPropagation();
							e.stopImmediatePropagation();
						});
					});
				}

				//Click event for showing the side panel
				$("#medications_o2_" + componentId + " #med-o2-content-container .info-icon-div").click(function() {

					//Retrieve Last Dose Data
					if (component.m_lastDoseArray.length === 0 || $("#sidePanel_o2_" + componentId).length === 0) {
						if ($("#sidePanel_o2_" + componentId).length === 0) {
							component.resetSidePanel();
						}
						component.retrieveLastDoseDate(orderIds, this);
					}
					else {
						//Display Side Panel
						component.showSidePanel(this);

						//Initialize or render the side panel
						component.initSidePanel();

						//Retrieve the side panel detail
						component.retrieveSidePanelDetails($(this).find("span"), component.m_sidePanelArray);
					}
				});

				//To resize the side panel height in alignment with the component height
				$("#medications_o2_" + componentId + " #med-o2-content-container .sub-sec-hd-tgl").click(function() {
					component.resetSidePanelHeight(true);
					component.setComponentScroll();
				});

				var statusNode = document.getElementById("medStatusContainer" + componentId);
				component.initHovers(statusNode);
				if (component.getMedHistory())
					 {
						$('#medsHistory' + componentId).click(function () {
							var criterion = component.getCriterion();
							try {
								var PowerOrdersMPageUtils = window.external.DiscernObjectFactory("POWERORDERS");
								var m_dPersonId = criterion.person_id;
								var m_dEncounterId = criterion.encntr_id;
								var m_hMOEW = PowerOrdersMPageUtils.CreateMOEW(m_dPersonId, m_dEncounterId, 0, 4, 121);
								PowerOrdersMPageUtils.DisplayMOEW(m_hMOEW);
								PowerOrdersMPageUtils.DestroyMOEW(m_hMOEW);
								component.InsertData();
							} catch (err) {
								logger.logJSError(err, this, "medications-o2.js", "launchMedsHistory");
							}
						});
					}
				if (component.getMedRecAdmit()) {
					$('#medRecAdmission' + componentId).click(function () {
						component.openMedRec(componentId, 1, venueAdm);
					});
				}
				if (component.getMedRecDischarge()) {
					$('#medRecDischarge' + componentId).click(function () {
						component.openMedRec(componentId, 3, venueDisch);
					});
				}
				if (component.getMedRecTransfer()) {
					$('#medRecTransfer' + componentId).click(function () {
						component.openMedRec(componentId, 2, 0.0);
					});
				}
				if (component.getMedRecCrossEncTx()) {
					$('#medRecCrossEncntrTx' + componentId).click(function () {
						component.openMedRec(componentId, 6, 0.0);
					});
				}

				timerRenderComponent.stop();
			}
			catch (err) {
				var errMsg = [];
				errMsg.push("<b>", medsI18n.JS_ERROR, "</b><br><ul><li>", medsI18n.MESSAGE, ": ", err.message, "</li><li>", medsI18n.NAME, ": ", err.name, "</li><li>", medsI18n.NUMBER, ": ", (err.number & 0xFFFF), "</li><li>", medsI18n.DESCRIPTION, ": ", err.description, "</li></ul>");
				MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, countText);

				if (timerRenderComponent) {
					timerRenderComponent.fail();
				}
				throw (err);
			}
		}

	};
}();
CERN_MEDS_O2.LastDoseDateTime = 1;
CERN_MEDS_O2.NextDoseDateTime = 2;
//end meds
