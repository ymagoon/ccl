/**
 * Create the component style object which will be used to style various aspects of our component
 */
function ChargesO1ComponentStyle() {
	this.initByNamespace("charges");
}

ChargesO1ComponentStyle.prototype = new ComponentStyle();
ChargesO1ComponentStyle.prototype.constructor = ComponentStyle;

/**
 * @constructor
 * Initialize the Charges O1 component
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 */
function ChargesO1Component(criterion) {
	//This is your component's constructor.
	this.setCriterion(criterion);
	this.setStyles(new ChargesO1ComponentStyle());
	//Set the timer names so the architecture will create the correct timers for our use
	this.setComponentLoadTimerName("USR:MPG_CHARGES.O1_load_component");
	this.setComponentRenderTimerName("ENG:MPG.CHARGES.O1 - render component");
	//Make sure the architecture includes the result count when creating the count text
	this.setIncludeLineNumber(true);
	this.setScope(1);
	//Set the flag to always show this component as expanded
	this.setAlwaysExpanded(true);
	//Set the flag to always show this component as expanded
	this.resultsCount = 0;
	//component table
	this.conditionsRetrievedStatus = ""; //Indicates if the mp_get_conditions script had been called
	this.conditionsScriptCalled = false;
	this.chargesTable = null;
	this.historyTable = null;
	this.conditionHandler = null;
	this.selectedServiceDate = null;
	this.rollingHistoryArray = null;
	this.m_rollingHistoryTable = null;
	this.m_encounterStartDate = new Date();
	this.m_encounterTypeCd = null;
	this.m_fullHistoryModal = null;
	this.m_chargeHistoryMap = null; //Key - Date (bucket), Value - array of charge history items
	this.m_locationMenuId = null;
	this.m_locationJSON = null;
	this.m_userFullName = "";
	this.m_defaultLocationSettings = null; //Will be object with CD and DISP
	this.m_ICDCodes = null;
	
	this.cptCodesMap = null; //Populated 1st time component is loaded with list of all valid CPT codes
	
	this.associatedConditionsObj = null;
	this.unassociatedConditionsObj = null;
	
	this.conditionsArr = null;  //This array will hold conditions in the order received by mp_get_conditions
	
	this.chargeHistory = null;
	this.currentEncounterType = null;
	this.selectedCodeObj = null;
	this.cptCode = "";
	
	this.lastSelectedRow = "";
	this.chargingJSON = "";
	this.cptCodes = "";
	this.bedrockVisitTypes = [];
	this.m_visitTypeDefinitions = null;
	this.tierGroups = null;
	this.chargesSidePaneObj = null;
	//Constant for the minimum height of the side panel.
	this.MIN_SP_HEIGHT = 275;
	this.setResourceRequired(true);
	this.m_myNote = null;  //This array will hold note informations about selected note.
	this.m_myNotes = null; //This array will hold information about all notes available.
	this.m_selectdeNoteEventId = 0.0; // Will store the event id of selected note.
	this.m_myNotesTable = null; // Component table object used to display all the notes document by signed user.
	this.m_myNoteDialog = null; // The dialog which will display the component table .
	this.m_visitTypeObj = null; // Will store the CDF meaning of the selected visit type.
	this.m_levelOfService = null; // Will store last Digit of Selected CPT code, is used as a Level of service to the E&M nCode Service.
	this.m_recNcode = ""; //Recommended nCode
	this.m_selectedModifier = 0;
	this.m_isnCodeServerRunning = false; // Flag used to identify whether the nCode Proxy server is running or not.
	this.m_suggestedDiagnoses = null;	
	this.m_patientLocations = null;  // This array will hold patient locations hierarchy(Facility, Building and Nursing Unit) information.
	this.m_modifiedProviderId = 0; // Will store the modified provider id
	this.m_modifiedLocationId = 0; // Will store the modified location id
	this.m_organizationId = 0.0; // Will store the organization id
	this.m_isAddNoteEnabled = true; // Flag used to enable/disable Add Note link.
	this.m_selectedVisitCPTRange = null;// Stores the start and end CPT code for a selected visit type. 
	this.m_isShowChargeHistoryClicked = false; // Flag used to identify whether 'show charges history' link clicked or not.
	this.m_popupObj = null; //Stores the Object of Popover UI control.
	this.m_locationPopupObj = null; //Stores the Location Popup Object.
	this.m_providerPopupObj = null; //Stores the Provider Popup Object.
	this.m_specialtyList = null; // Will store the list of specialities 
	this.m_viewSpecialtyPref = false;
	this.m_assignedSpecialty = ""; //Will store the assigned specialty
	this.m_phyIndicator = null; //Will store the physician indicator. '0' for Non-Physician and '1' for Physician.
	this.m_nonPhyEnabled = false; //Will store boolean state whether to allow Non-Physicians to view the Charges on the Time line.
	this.m_prsnlList = []; //Will store the Personnel Information who all submitted the charges.
	this.m_isCPTSubmitted = false; //flag to check if a charge is submitted today
}	    
         
/**    
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
ChargesO1Component.prototype = new MPageComponent();
ChargesO1Component.prototype.constructor = MPageComponent;

/*Bedrock configurations*/

/**
 * This function is used to load the filters that are associated to this component.  Each filter mapping
 * is associated to one specific component setting.  The filter mapping lets the MPages architecture know 
 * which functions to call for each filter.
 */
ChargesO1Component.prototype.loadFilterMappings = function(){	
	this.addFilterMappingObject("WF_CH_TIERS", {
		setFunction : this.setTierGroups,
		type: "NUMBER",
		field: "PARENT_ENTITY_ID"}
	);
	
	this.addFilterMappingObject("WF_CH_ENABLE_ADD_NOTE", {
		setFunction : this.setAddNoteEnabled,
		type: "BOOLEAN",
		field: "FREETEXT_DESC"}
	);
	
	//Retrieves the boolean state whether to allow Non-Physician to view charges on the Time-line from the Bedrock settings. 
	this.addFilterMappingObject("WF_CH_PHY_IND", {
		setFunction : this.setNonPhyEnabled,
		type: "BOOLEAN",
		field: "FREETEXT_DESC"}
	); 
};

/**
 * Stores the Physician indicator retrieved from the mp_charges_init Program
 * @param {Number} - 0 if Non-Physician, 1 if Physician
 */
ChargesO1Component.prototype.setPhysicianIndicator = function (indicator) {
	if(typeof indicator !== 'number'){
		throw new Error("Invalid Physician indicator passed to 'setPhysicianIndicator'");
	}
	this.m_phyIndicator = indicator;
};

/**
 * Returns the Physician indicator retrieved from the mp_charges_init Program.
 * @return {Number} - 0 if Non-Physician, 1 if Physician.
 */
ChargesO1Component.prototype.getPhysicianIndicator = function () {
	return this.m_phyIndicator;
};

/**
 * Stores whether Non-Physician is allowed to view the Charges on Time-line.
 * @param {Boolean} - True if allowed, False otherwise.
 */
ChargesO1Component.prototype.setNonPhyEnabled = function (enabler) {
	if(typeof enabler !== 'boolean'){
		throw new Error("Invalid type passed to 'setNonPhyEnabled'");
	}
	this.m_nonPhyEnabled = !enabler;
};

/**
 * Returns whether Non-Physician is allowed to view the Charges on Time-line.
 * @return {Boolean} - True if allowed, False otherwise.
 */
ChargesO1Component.prototype.isNonPhyEnabled = function () {
	return this.m_nonPhyEnabled;
}
/*
 * Sets value to display the error alert banner in charge history dialogue.
 * @param {boolean} showChargeHistoryClicked - boolean value to display the error alert banner in charge history dialogue.
*/
ChargesO1Component.prototype.setShowChargeHistoryClicked = function (showChargeHistoryClicked) {
	this.m_isShowChargeHistoryClicked = showChargeHistoryClicked;
};
/*
 * Gets the value to display the error alert banner in charge history dialogue.
 * @return {boolean} showChargeHistoryClicked - boolean value to display the error alert banner in charge history dialogue.
*/
ChargesO1Component.prototype.isShowChargeHistoryClicked = function () {
	return this.m_isShowChargeHistoryClicked;
};

/** 
 ** Function that gets called by architecture for the WF_CH_ENABLE_ADD_NOTE filter.
 * This will get called only if Charges component launch from documentation as 
 * this filter is hard code only in mp_gte_pre_req.prg
 * @param {boolean} enableAddNote - boolean value to enable/disable Add Note link
 */
ChargesO1Component.prototype.setAddNoteEnabled = function (enableAddNote) {

	this.m_isAddNoteEnabled = enableAddNote;
};

/**
 * Gets the value to enable or disable Add Note link.
 * @return {boolean} enableAddNote - boolean value for enable/disable Add Note link.
*/
ChargesO1Component.prototype.isAddNoteEnabled = function () {
	
	return this.m_isAddNoteEnabled;
};

/**
 * Gets the value to differentiate whether the component has launched from Documentation or not.
 * @return {boolean} true/false - If the flag to enable Add note link is true, then the component wouldn't be launched from Documentation or else it would launched from Documentation.
*/
ChargesO1Component.prototype.isLaunchedFromDocumentation = function () {
	
	return (!this.m_isAddNoteEnabled);
};

/*
 * Sets the modified location id
 * @param {number} locationId - location code value
*/
ChargesO1Component.prototype.setModifiedLocationId = function (locationId) {
	if (typeof locationId !== 'number'){
		throw new Error("Invalid locationId passed to 'setModifiedLocationId'");
	}
	this.m_modifiedLocationId = locationId;
};
/*
 * Gets the modified location id
 * @return {number} locationId - location code value
*/
ChargesO1Component.prototype.getModifiedLocationId = function () {
	return this.m_modifiedLocationId;
};
/*
 * Sets the array of patient locations (Ex: Facility , Building and Nursing Unit)
 * @param {array} patient locations - array of patient location id & patient location description
 */
ChargesO1Component.prototype.setPatientLocations = function (patientLocations) {
	if (typeof patientLocations === 'undefined') {
		throw new Error("Patient locations do not exist");
	}
	this.m_patientLocations = patientLocations;
};
/*
 * Gets the array of patient locations (Ex: Facility , Building and Nursing Unit)
 * @returns {array} - array of patient location id & patient location description
 */
ChargesO1Component.prototype.getPatientLocations= function () {
	return this.m_patientLocations;
};

ChargesO1Component.prototype.setSpecialtyPref = function(value) { 
	this.m_viewSpecialtyPref = value;
};

ChargesO1Component.prototype.getSpecialtyPref = function() {
	return this.m_viewSpecialtyPref;
};

/*
 * Sets the modified provider id
 * @param {number} providerId - provider id value
*/
ChargesO1Component.prototype.setModifiedProviderId = function (providerId) {
	if (typeof providerId !== 'number'){
		throw new Error("Invalid providerId passed to 'setModifiedProviderId'");
	}
	this.m_modifiedProviderId = providerId;
};
/*
 * Gets the modified provider id
 * @return {number} providerId - provider id value
*/
ChargesO1Component.prototype.getModifiedProviderId = function () {
	return this.m_modifiedProviderId;
};

/*
 * Sets the organization id
 * @param {number} organizationId - organization id value
*/
ChargesO1Component.prototype.setOrganizationId = function (organizationId) {
	if (typeof organizationId !== 'number'){
		throw new Error("Invalid organizationId passed to 'setOrganizationId'");
	}
	this.m_organizationId = organizationId;
};
/*
 * Gets the organization id
 * @return {number} organizationId - organization id value
*/
ChargesO1Component.prototype.getOrganizationId = function () {
	return this.m_organizationId;
};


/** 
 *Function that gets called by architecture for the WF_CH_TIERS filter.
 *
 */
ChargesO1Component.prototype.setTierGroups = function(tierGroups){
	
	this.tierGroups = tierGroups;
};
ChargesO1Component.prototype.getTierGroups = function(){
	return this.tierGroups;
};

/* Main rendering functions */

/**
 * This is the ChargesO1Component implementation of the retrieveComponentData function.  
 * It creates the necessary parameter array for the data acquisition script call and the associated Request object.
 * This function will be called from the MPages architecture when it is ready for the component to render its content.
 */
ChargesO1Component.prototype.retrieveComponentData = function() {
	//After component refresh by default recent 7 days charge data will be retrieved to show it on to the time line.
	this.fetchHistoricalCharges(7, null);	
};
/**
 * Whenever user clicks on component level refresh button, this method will be executed.
 * this method will reinitialize charge history mapping array, history table and condition script call properties. 
 */
ChargesO1Component.prototype.refreshComponent = function() {
	//Sets the modified location Id value to 0
	this.setModifiedLocationId(0);
	//Set the Popover Object Of Location when Component is refreshed to create new one.
	this.setLocationPopupObj(null);
	//Sets the modified provider Id value to 0
	this.setModifiedProviderId(0);
	//Set the Popover Object Of Provider when Component is refreshed to create new one.
	this.setProviderPopupObj(null);
	//The m_chargeHistoryMap array will be reset so that when use do component refresh, making sure that fresh charge history will be retrieved.
	this.m_chargeHistoryMap = [];
	//The historyTable object will be reset to null in order to populate it with newly arrived data.
	this.historyTable = null;
	//Condition script should be called whenever user clicks on component refresh link in order to retrieve newly charted diagnoses if any.
	this.conditionsScriptWasCalled(false);
	MPageComponent.prototype.refreshComponent.call(this);
};

/**
 * This is the ChargesO1Component implementation of the renderComponent function.  It takes the information retrieved from the script
 * call and renders the component's visuals.
 * @param {MP_Core.ScriptReply} The ScriptReply object returned from the call to MP_Core.XMLCCLRequestCallBack function in the 
 * retrieveComponentData function of this object.
 */
ChargesO1Component.prototype.renderComponent = function(replyObj) {
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	//this.attachResize();
	var timerRenderComponent = null;
	
	//store cpt codes
	this.grabTableCPTCodes();
	
	var chargeHTML = "";
	var that = this;
	var origChargeJSON = replyObj;
	this.setChargingJSON(origChargeJSON);
	var initialCPTInstruction = "";

	var chargeTable = this.generateChargeTable([]);
	this.setChargesTable(chargeTable);
	
	try {
		timerRenderComponent = MP_Util.CreateTimer(this.getComponentRenderTimerName()); 
		//Finalize the component
		this.finalizeComponent(this.buildComponentBaseHTML());
		
		this.updateCPTInstructions((initialCPTInstruction) ? initialCPTInstruction + " criteria required" : "");
		
		//Add reading Pane
		this.addChargesSidePanel();
		
		//Attach listeners
		this.attachListeners();
		
		this.bindSidePaneActions();
	
		this.bindChargeSubmitAction();
		
		this.bindNewChargeAction();
		
		if(this.isnCodeServerRunning()){
			this.addSpecialtyAssignEventHandler();
		}
		
		$("#" + compId).children('.sec-hd').find('.sec-total').text("");
		
		if (this.isLaunchedFromDocumentation() && this.isnCodeServerRunning()) {
			document.getElementById("mainCompMenu" + compNS + compId).style.display = "inline-block";
			document.getElementById("mainCompMenu" + compNS + compId).classList.add("opts-menu-empty");
			this.addSpecialtyWhenLaunchedFromDocumentation();
		}
		this.postProcessing();
	}
	catch(err) {
		if (timerRenderComponent) {
			timerRenderComponent.Abort();
			timerRenderComponent = null;
		}
		MP_Util.LogJSError(this, err, "charges-o1.js", "renderComponent");
		throw (err);
	} finally {
		if (timerRenderComponent) {
			timerRenderComponent.Stop();
		}
	}
};
/**
 * This function is called when the addChargesSidePanel method is executed.
 * Inside this function the side panel prototype function expandSidePanel is overridden to reset the max-height of the side panel scroll container.
 * middle section height will also be deducted in order to provide proper scroll functionality to only the diagnoses section.
 */
ChargesO1Component.prototype.addClickExpandCollapse = function() {
	var self = this;	
	self.chargesSidePaneObj.expandSidePanel = function(){
		//if the side panel is not already expanded, then set up the missing pieces
		if (!this.m_sidePanelObj.hasClass("sp-focusin")) {
			//Add expand bar if it is not currently showing
			this.m_expCollapseBarObj.removeClass("hidden");
			
			// Upon expand, absolute positioning is applied to allow the side panel to
			// expand over other content
			this.m_parentContainer.css({
				position : "absolute"
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
		//Calculates the Separators height present inside the side panel(Now the number of separators are 3, it can vary in future)
		var seperatorHeightInSP = parseInt($("div.charges-o1-rp-mod-root-cont > div.sp-separator").outerHeight(true)) + ($("#sidePanelContents" + self.getComponentId() + " > div.sp-separator2").outerHeight() ? $("#sidePanelContents" + self.getComponentId() + " > div.sp-separator2").outerHeight(true) : 0);
		//Side panel Middle section height will be calculated with separator height and will be deducted from total scroll height.
		var middleSectionHeight = seperatorHeightInSP + ($("#" + self.getComponentId() + "RPEditableSection").height() ? $("#" + self.getComponentId() + "RPEditableSection").height() : 0) + ($(".charges-o1-sp-middle-section").height() ? $(".charges-o1-sp-middle-section").height() : 0) + ($(".charges-o1-alert-message").outerHeight(true) ? $(".charges-o1-alert-message").outerHeight(true) + 25 : 0);
		
		// set up for scrolling the panel if contents exceed panel height
		var bodyContentHeight = this.m_sidePanelBodyContents[0].offsetHeight;
		titleHeight = (this.m_sidePanelContents.height() - bodyContentHeight) + middleSectionHeight;
		
		// Set height to auto so it will expand to show contents
		this.m_sidePanelObj.css({
			"height" : "auto"
		});
		
		// decrement scrollMaxHeight to prevent issues when the content is the
		// same height as the max (its finicky)
		var bannerHeight = $('.charges-o1-specialty-banner-color:visible').height();   //without alert banners
		if($('.charges-o1-specialty-banner-color:visible').length){			
			//if speciality banner is visible we add to the height
			bannerHeight = bannerHeight + 26;	
		}
		else{
			bannerHeight = bannerHeight + 10;
		}
		if($('.charges-o1-submit-fail-banner:visible').length || $('.charges-o1-retrieve-fail-banner:visible').length){
			bannerHeight = bannerHeight + 55;
		}
		
		var scrollMaxHeight = (this.m_sidePanelObj.height() - titleHeight) - bannerHeight;	
		// To enable the scroll bar, set the max-height. Need px here for other
		// check below to be number
		this.m_scrollContainer.css("max-height", scrollMaxHeight + "px");
		scrollMaxHeight = this.m_scrollContainer.height() > scrollMaxHeight ? Math.ceil(scrollMaxHeight) : Math.floor(scrollMaxHeight);
		//To check the max scroll height is less that this
		var heightOfScroll = 130;
		//If Component level charges scroll container greater that this the the sp-add-scroll class will be added to the container
		var scrollContainerHeight = 400;
		if($("#" + self.getComponentId() + "chargesScrollContainer > div:last").hasClass('charges-o1-pp-init')){
			$("#" + self.getComponentId() + "chargesScrollContainer").addClass("sp-add-scroll");
			var heightOfChargesScrollContainer = $("#sidePanel" + self.getComponentId()).height()-($('#' + self.getComponentId() + 'RPEditableSection').height()+ $('#sidePanelHeader' + self.getComponentId()).height() +(parseInt($('.sp-separator').css('margin-top'), 10) * 3 + 5));
			$("#" + self.getComponentId() + "chargesScrollContainer").height(heightOfChargesScrollContainer);
		}
		else{
			if((scrollMaxHeight + $("#" + self.getComponentId() + "nCodeWarn").height()) < heightOfScroll){
				$("#sidePanelScrollContainer" + self.getComponentId()).removeClass("sp-add-scroll");
				$("#" + self.getComponentId() + "chargesScrollContainer").addClass("sp-add-scroll");
				if($("#" + self.getComponentId() + "chargesScrollContainer").outerHeight(true) > scrollContainerHeight){
					var heightOfChargesScrollContainer = $("#sidePanel" + self.getComponentId()).height()-($('#' + self.getComponentId() + 'RPEditableSection').height()+ $('#sidePanelHeader' + self.getComponentId()).height() +(parseInt($('.sp-separator').css('margin-top'), 10) * 3 + 5));
					$("#" + self.getComponentId() + "chargesScrollContainer").height(heightOfChargesScrollContainer);
				}
				else{
					$("#" + self.getComponentId() + "chargesScrollContainer").css('height','auto');
				}
			}
			else if (scrollMaxHeight === this.m_scrollContainer.height()) {
				this.m_scrollContainer.addClass("sp-add-scroll");
				$("#" + self.getComponentId() + "chargesScrollContainer").css('height','auto');
				$("#" + self.getComponentId() + "chargesScrollContainer").hasClass("sp-add-scroll")?$("#" + self.getComponentId() + "chargesScrollContainer").removeClass('sp-add-scroll'):"";
			}
		}
		if($('.charges-o1-specialty-banner-color:visible').length || $('.charges-o1-submit-fail-banner:visible').length || $('.charges-o1-retrieve-fail-banner:visible').length){			
			var heightOfChargesScrollContainer = $("#sidePanel" + self.getComponentId()).height()- $('.charges-o1-specialty-banner-color:visible').height() - ($('#' + self.getComponentId() + 'RPEditableSection').height()+ $('#sidePanelHeader' + self.getComponentId()).height() +(parseInt($('.sp-separator').css('margin-top'), 10) * 3 + 5));
			$("#sidePanelScrollContainer" + self.getComponentId()).removeClass("sp-add-scroll");
			$("#" + self.getComponentId() + "chargesScrollContainer").height(heightOfChargesScrollContainer);
			$("#sidePanel"+ self.getComponentId()).height($("#sidePanel"+ self.getComponentId()).height() - 30);	
		}
		if (this.m_onExpandFunc) {
			this.m_onExpandFunc();
		}
	};
	self.chargesSidePaneObj.collapseSidePanel = function() {
		// collapse panel only if it is expanded
		if (this.m_expCollapseIconObj.hasClass("sp-collapse")) {

			// revert the hard-coded height of the main component body
			this.m_compBodyObj.css("height", "auto");
		}
		$("#" + self.getComponentId() + "chargesScrollContainer").css('height','auto');
		// call the base expandSidePanel function
		SidePanel.prototype.collapseSidePanel.call(this, null);
	};
};


/**
 * This method will register an event for submitting the charge configured 
 * by the user when clicked on "Submit" button present in Side panel.
 * This method is implemented to make compatible with new side panel version.
 */
ChargesO1Component.prototype.bindChargeSubmitAction = function(){
	var self = this;
	var compID = this.getComponentId();
	$("#sidePanelActionBar" + compID).click(function(event){
		var jqSrcElement = $(event.target);
		var type = event.type;
		if (type === 'click' && jqSrcElement.prop('id') === compID + "RPSubmitBtn" && !jqSrcElement.is(':disabled')){
			var dropChargeTimer = MP_Util.CreateTimer("CAP:MPG Charges-o1_drop_charge");
			if (dropChargeTimer) {
				dropChargeTimer.Start();
				dropChargeTimer.Stop();
			}
			self.dropCharge();
		}
	});
};

/**
 * This method will register an event for placing new charge 
 * by the user when clicked on "New Charge" button present in Side panel.
 * This method is implemented to make compatible with new side panel version.
 */
ChargesO1Component.prototype.bindNewChargeAction = function(){
	var self = this;
	var compID = this.getComponentId();
	$("#sidePanelActionBar" + compID).click(function(event){
		var jqSrcElement = $(event.target);
		var type = event.type;
		if (type === 'click' && jqSrcElement.prop('id') === compID + "RPNewBtn"){
			self.renderDefaultPPInitialView();
			self.resizeComponentBody();
			self.chargesSidePaneObj.expandSidePanel();
		}
	});
};
/* VIEW specific functions*/
/**
 * Gets the array of ICD vocabulary codes
 * Only ICD* nomenclatures are supported for billing: ICD-9*, ICD-10*
 * @returns {array} - array of ICD vocabulary codes
 */
ChargesO1Component.prototype.getICDCodes = function(){
	if (!this.m_ICDCodes){
		this.m_ICDCodes = [];
	}
	return this.m_ICDCodes;
};

/**
 * Sets the array of ICD vocabulary codes
 * @param {array|null} codes - array of ICD vocabulary codes, or null
 */
ChargesO1Component.prototype.setICDCodes = function(codes){
	if (!(codes instanceof Array)) {
		throw new Error("ICD Codes are not of Array type");
	}
	this.m_ICDCodes = codes;
};

/**
 * Checks if the vocabulary code is a valid ICD* code
 * @param {number} code - a diagnosis vocabulary code
 * @returns {boolean} - returns true if vocabulary code is a valid ICD* code
 */
ChargesO1Component.prototype.isICDCode = function(code){
	var icdCodes = this.getICDCodes();
	var iLen = icdCodes.length;
	var i;
	
	for (i = 0; i < iLen; i++){
		if (icdCodes[i] === code){
			return true;
		}
	}
	return false;
};

/**
 * Gets the default location setting
 * @returns {object} - default location object contains LOCAION_CD and LOCATION_DISPLAY
 */
ChargesO1Component.prototype.getDefaultLocationSettings = function(){
	return this.m_defaultLocationSettings;
};

/**
 * Sets the default location setting
 * @param {number} locCD - location code value
 * @param {string} locDISP - location display
 */
ChargesO1Component.prototype.setDefaultLocationSettings = function(locCD, locDISP){
	var settings = {};
	if (typeof locCD !== 'number' || locCD <= 0){
		throw new Error("Invalid locCD passed to 'setDefaultLocationSettings'");
	}
	if (typeof locDISP !== 'string' || !locDISP.length){
		throw new Error("Invalid locDISP passed to 'setDefaultLocationSettings'");
	}
	settings.LOCATION_CD = locCD;
	settings.LOCATION_DISPLAY = locDISP;
	this.m_defaultLocationSettings = settings;
};

/**
 * Gets the current user's full name
 * @returns {string} - user's full name
 */
ChargesO1Component.prototype.getUserFullName = function(){
	return this.m_userFullName;
};

/**
 * Sets the current user's full name
 * @param {string} name - user's full name
 */
ChargesO1Component.prototype.setUserFullName = function(name){
	if (typeof name !== "string"){
		throw new Error("Invalid User Full Name passed into 'setUserFullName'");
	}
	this.m_userFullName = name;
};

/**
 * Gets the modal object containing the full history
 * @returns {ModalDialog} - modal dialog that contains the full charge history
 */
ChargesO1Component.prototype.getFullHistoryModal = function(){
	return this.m_fullHistoryModal;
};

/**
 * Sets the full history modal dialog
 * @param {ModalDialog} modal - modal dialog to contain the full charge history
 */
ChargesO1Component.prototype.setFullHistoryModal = function(modal){
	if(!ModalDialog.prototype.isPrototypeOf(modal)){
		throw new Error("The full History modal dialog object is not type of ModalDialog");
	}
	this.m_fullHistoryModal = modal;
};

ChargesO1Component.prototype.getChargeHistoryMap = function(){
	if (!this.m_chargeHistoryMap){
		this.m_chargeHistoryMap = {};
	}	
	return this.m_chargeHistoryMap;
};

ChargesO1Component.prototype.setChargeHistoryMap = function(map){
	if(map === null){
		throw new Error("The charges history map is null");
	}
	
	this.m_chargeHistoryMap = map;
};

ChargesO1Component.prototype.getLocationMenuId = function(){
	return this.m_locationMenuId;
};

ChargesO1Component.prototype.setLocationMenuId = function(id){
	if(id === null || typeof id!=="string"){
		throw new Error("The Location id provided is either null or not of type String");
	}
	
	this.m_locationMenuId = id;
};

ChargesO1Component.prototype.getLocationJSON = function(){
	return this.m_locationJSON;
};

ChargesO1Component.prototype.setLocationJSON = function(locJSON){
	if(locJSON === null ||typeof locJSON!=="string"){
		throw new Error("The location JSON provided is either null or not type String");
	}
	this.m_locationJSON = locJSON;
};

ChargesO1Component.prototype.getCPTCodesMap = function(){
	if (!this.cptCodesMap){
		this.cptCodesMap = {};
	}
	return this.cptCodesMap;
};

ChargesO1Component.prototype.getChargeHistoryArray = function(){
	if (!this.chargeHistory){
		this.chargeHistory = [];
	}
	return this.chargeHistory;
};

ChargesO1Component.prototype.setChargeHistoryArray = function(obj){
	//Validation
	if (!(obj instanceof Array)) {
		throw new Error("Charge History array is not of Array type");
	}
	this.chargeHistory = obj;
};

ChargesO1Component.prototype.getRollingHistoryArray = function(){
	if (!this.rollingHistoryArray){
		this.rollingHistoryArray = [];
	}
	return this.rollingHistoryArray;
};

ChargesO1Component.prototype.setRollingHistoryArray = function(array){
	if (!(array instanceof Array)) {
		throw new Error("Rolling history array is not of Array type");
	}
	this.rollingHistoryArray = array;
};

ChargesO1Component.prototype.getAssociatedConditionsObj = function(){
	if (!this.associatedConditionsObj){
		this.associatedConditionsObj = new this.ConditionsContainer();
	}
	return this.associatedConditionsObj;
};

ChargesO1Component.prototype.getUnassociatedConditionsObj = function(){
	if (!this.unassociatedConditionsObj){
		this.unassociatedConditionsObj = new this.ConditionsContainer();
	}
	return this.unassociatedConditionsObj;
};

ChargesO1Component.prototype.wasConditionsScriptCalled = function(){
	return this.conditionsScriptCalled;
};

ChargesO1Component.prototype.conditionsScriptWasCalled = function(flag){
	if (typeof flag !=="boolean") {
		throw new Error(" The condition script flag provided is not a boolean");
	}
	this.conditionsScriptCalled = flag;
};

ChargesO1Component.prototype.getConditionsRetrievedStatus = function(){
	return this.conditionsRetrievedStatus;
};

ChargesO1Component.prototype.setConditionsRetrievedFlag = function(status){
	if (typeof status ==="undefined") {
		throw new Error("The status of the Condition retrieval is undefined");
	}
	this.conditionsRetrievedStatus = status;
};

/**
 * @returns {array} Array of this visit condition objects
 */
ChargesO1Component.prototype.getConditionArray = function(){
	if (!this.conditionsArr){
		this.conditionsArr = [];
	}
	return this.conditionsArr;
};

ChargesO1Component.prototype.setConditionArray = function(cArray){
	if (!cArray){
		this.conditionsArr = [];
	} else {
		this.conditionsArr = cArray;
	}
};

ChargesO1Component.prototype.getServiceDate = function(){
	if (!this.selectedServiceDate){
		this.selectedServiceDate = new Date();
	}
	return this.selectedServiceDate;
};
ChargesO1Component.prototype.setServiceDate = function(date){
	if (typeof date ==="undefined") {
		throw new Error("Service Date is undefined");
	}
	this.selectedServiceDate = date;
};

ChargesO1Component.prototype.setChargesTable = function(table){
	if(!ComponentTable.prototype.isPrototypeOf(table)){
		throw new Error("The Charges table object is not type of ComponentTable");
	}
	this.chargesTable = table;
};
ChargesO1Component.prototype.setHistoryTable = function(table){
	if(!ComponentTable.prototype.isPrototypeOf(table)){
		throw new Error("The History table object is not type of ComponentTable");
	}
	this.historyTable = table;
};

ChargesO1Component.prototype.getHistoryTable = function(){
	return this.historyTable;
};
ChargesO1Component.prototype.getChargesTable = function(){
	return this.chargesTable;
};
/**
 *
 * 
 */
ChargesO1Component.prototype.isDiagnosisSelected = function(){
	return !this.getAssociatedConditionsObj().isEmpty();
};
/**
 * Gets the current encounter's type code
 * @returns {string} - encounter's type code
 */
ChargesO1Component.prototype.getEncntrTypeCd = function(){
	return this.m_encounterTypeCd;
};

/**
 * Sets the current encounter's type code
 * @param {string} encounterTypeCd - encounter's type code
 */
ChargesO1Component.prototype.setEncntrTypeCd = function(encounterTypeCd){
	if (typeof encounterTypeCd !== "number"){
		throw new Error("Invalid encounter type code passed into 'setEncntrTypeCd'");
	}
	this.m_encounterTypeCd = encounterTypeCd;
};
/**
 * Gets the current encounter's type code
 * @returns {string} - encounter's type code
 */
ChargesO1Component.prototype.getVisitTypeDefinitions = function(){

	return this.m_visitTypeDefinitions;
};

/**
 * Sets the current encounter's type code
 * @param {string} encounterTypeCd - encounter's type code
 */
ChargesO1Component.prototype.setVisitTypeDefinitions = function(visitTypeDefinitions){
	this.m_visitTypeDefinitions = visitTypeDefinitions;
};

/**
 * Gets the specialty list
 * @returns {string} - list of specialities
 */
ChargesO1Component.prototype.getSpecialtyList = function(){
	return this.m_specialtyList;
};
/**
 * Sets the specialty list
 * @param {string} list of specialities
 */
ChargesO1Component.prototype.setSpecialtyList = function(specialtyList){
	this.m_specialtyList = specialtyList;
};
/**
 * Gets the assigned specialty
 * @returns {string} - assigned specialty
 */
ChargesO1Component.prototype.getAssignedSpecialty = function(){
	return this.m_assignedSpecialty;
};
/**
 * Sets the assigned specialty
 * @param {string} assigned specialty
 */
ChargesO1Component.prototype.setAssignedSpecialty = function(assignedSpecialty){
	if(typeof assignedSpecialty !== "string"){
		throw new Error("Invalid assignedSpecialty object passed");
	}
	this.m_assignedSpecialty = assignedSpecialty;
};


ChargesO1Component.prototype.getCurrentCPTCode = function(){
		return this.cptCode;
};

ChargesO1Component.prototype.setCurrentCPTCode = function(code){
	if(typeof code ==="undefined"){
		throw new Error("The CPT code passed is undefined");
	}
	this.cptCode = code;
};
	
ChargesO1Component.prototype.getSelectedCodeObj = function(){
	return this.selectedCodeObj;
};
	
ChargesO1Component.prototype.setSelectedCodeObj = function(obj){
	if(typeof obj ==="undefined"){
		throw new Error("The CPT code passed is undefined");
	}
	this.selectedCodeObj = obj;
};
	
ChargesO1Component.prototype.setChargingJSON = function(input){
	if(typeof input ==="undefined"){
		throw new Error("The input json passed is undefined");
	}
	this.chargingJSON = input;
};
ChargesO1Component.prototype.getChargingJSON = function(){
	return this.chargingJSON;
};
	
	
ChargesO1Component.prototype.setCPTCodes = function(reply){
	if(typeof reply ==="undefined"){
		throw new Error("The reply object passed is undefined");
	}
	this.cptCodes = reply.getResponse().CPTINFO;
};

ChargesO1Component.getCPTCodes = function(){
	return this.cptCodes;
};

/**
 * Gets the event id of currently selected note
 * @returns {number} - selected note's event id
 */
ChargesO1Component.prototype.getSelectedNoteEventId= function(){
	return this.m_selectdeNoteEventId;
};
/**
 * Sets the event id of currently selected note
 * @param {number} selected note's event id
 */
ChargesO1Component.prototype.setSelectedNoteEventId = function(selectedNoteEventId){

	if (typeof selectedNoteEventId !== "number" || isNaN(selectedNoteEventId)){
	
		this.m_selectdeNoteEventId = 0.0;
		throw new Error("Invalid event id  into 'selectedNoteEventId'");
	}
	
	this.m_selectdeNoteEventId = selectedNoteEventId;
};

/**
 * Set the value of availability of nCode proxy server in the domain. 
 * @param {boolean} - boolean value, indicating whether the server is running/configured .
 */
ChargesO1Component.prototype.setIsnCodeServerRunning = function(isRunning){

	this.m_isnCodeServerRunning = isRunning;
};

/**
 * Gets the value of availability of nCode proxy server in the domain. 
 * @returns {boolean} - boolean value, indicating whether the server is running/configured .
 */
ChargesO1Component.prototype.isnCodeServerRunning = function(){

	return this.m_isnCodeServerRunning;
};

/**
 * Gets an array of suggested diagnoses from nCode service 
 * @returns {array} - list of diagnoses
 */
ChargesO1Component.prototype.getSuggestedDiagnoses = function(){

	return this.m_suggestedDiagnoses;
};

/**
 * Set an array of suggested diagnoses from nCode service 
 * @param {array} - list of diagnoses
 */
ChargesO1Component.prototype.setSuggestedDiagnoses = function(diagnosesList){

	if(typeof diagnosesList ==="undefined"){
		throw new Error("The diagnosesList passed is undefined");
	}
	this.m_suggestedDiagnoses = diagnosesList;
};

/**
 * Set the CPT codes range for a selected visit type
 * @param {Object} - CPT codes range for a selected visit type
 */
ChargesO1Component.prototype.setSelectedVisitCPTRange = function(range){
	if(typeof range !== "object"){
		throw new Error("Invalid CPT range object");
	}
	this.m_selectedVisitCPTRange = range;
};

/**
 * Get the range of CPT codes for the selected visit type
 * @returns {Object} - CPT codes range for a selected visit type
 */
ChargesO1Component.prototype.getSelectedVisitCPTRange = function() {
	return this.m_selectedVisitCPTRange;
}
/**
 * Sets the popup object for further modifications .
 * @param {MPageUI.Popup} - Object of Popup UI control.
 */
ChargesO1Component.prototype.setPopupObj = function(popupObj){
	if(popupObj === "undefined"){
		throw new Error("Invalid pop up Object in Charges");
	}
	this.m_popupObj = popupObj;
};
/**
 * returns the popup object for further modifications .
 * @return {MPageUI.Popup} - Object of Popup UI control.
 */
ChargesO1Component.prototype.getPopupObj = function(){
	return this.m_popupObj;
};
/**
 * Sets the location popup object for further modifications .
 * @param {MPageUI.Popup} - Object of Popup UI control.
 */
ChargesO1Component.prototype.setLocationPopupObj = function(popupObj){
	if(popupObj === "undefined"){
		throw new Error("Invalid pop up Object in Charges");
	}
	this.m_locationPopupObj = popupObj;
};
/**
 * returns the location popup object for further modifications .
 * @return {MPageUI.Popup} - Object of Popup UI control.
 */
ChargesO1Component.prototype.getLocationPopupObj = function(){
	return this.m_locationPopupObj;
};
/**
 * Sets the Provider popup object for further modifications .
 * @param {MPageUI.Popup} - Object of Popup UI control.
 */
ChargesO1Component.prototype.setProviderPopupObj = function(popupObj){
	if(popupObj === "undefined"){
		throw new Error("Invalid pop up Object in Charges");
	}
	this.m_providerPopupObj = popupObj;
};
/**
 * returns the Provider popup object for further modifications .
 * @return {MPageUI.Popup} - Object of Popup UI control.
 */
ChargesO1Component.prototype.getProviderPopupObj = function(){
	return this.m_providerPopupObj;
};
/**
 * END GETTER/SETTER/HELPER Functions
 ***********************************************************************************/

ChargesO1Component.prototype.preProcessing = function() {
	//Calls base class for future support
	MPageComponent.prototype.preProcessing.call(this);
	var self = this;
	var userPrefs = this.getPreferencesObj();
	if(userPrefs) {
		var compMenu = this.getMenu();
		var compID = this.getComponentId();
		var menuId = "specialty" + compID;
		if (compMenu) {
			var compMenuSpec = new MenuSelection(menuId);
			compMenuSpec.setLabel(userPrefs);
			compMenuSpec.setIsSelected(true);
			
			compMenu.addMenuItem(compMenuSpec);
			self.setAssignedSpecialty(userPrefs);
			
			compMenuSpec.setClickFunction(function (clickEvent) {
                clickEvent.id = menuId;
				compMenu.removeMenuItem(compMenuSpec);
				
				if(!compMenu.m_menuItemArr.length) {
					$("#" + compMenu.getAnchorElementId()).addClass("opts-menu-empty");
				}
				self.setAssignedSpecialty("");
				self.setPreferencesObj(null);
				self.savePreferences(true);	
				self.retrieveComponentData();
            });
		}
	}
};

ChargesO1Component.prototype.postProcessing = function() {
	MPageComponent.prototype.postProcessing.call(this);
	var compMenu = this.getMenu();
	if(!this.isnCodeServerRunning()){
		if(compMenu && compMenu.m_menuItemArr && compMenu.m_menuItemArr.length) {
			$("#" + compMenu.getAnchorElementId()).addClass("opts-menu-empty").unbind("click");
		}
	}
	if(this.isnCodeServerRunning()){
		if(compMenu && compMenu.m_menuItemArr && compMenu.m_menuItemArr.length){
			if($("#" + compMenu.getAnchorElementId()).hasClass("opts-menu-empty")) {
				$("#" + compMenu.getAnchorElementId()).removeClass("opts-menu-empty").click(function() {
					MP_MenuManager.showMenu(compMenu.getAnchorElementId());
				});
			}			
		}
	}
};

/**
 * This function is utilized to retrieve any required data prior to making the calls to retrieve
 * the actual data for the component.  If this function is defined in the component, the retreiveComponentData
 * function will not be called.  Instead the architecture will assume the component will make that call
 * once it has retrieved its required data.
 */
ChargesO1Component.prototype.RetrieveRequiredResources = function() {
	var criterion = this.getCriterion();
	if(criterion.encntr_id === 0.0){
		var errMsg = "No encounters available for this patient";
		this.finalizeComponent(MP_Util.HandleErrorResponse("charges",errMsg),"");
	}else{
		this.retrieveComponentData();
	}
};
/**
 * Resizes the full history table
 * The full history table resides in a modal dialog
 */
ChargesO1Component.prototype.resizeHistoryTable = function(){
	var compID = this.getComponentId();
    var historyTable = this.getHistoryTable();
	var jqHistoryModalBody;
	var jqHistoryTable;
	var modalBodyHeight;
	var historyTableHdrHeight;
	var marginHeight;

    //We will only worry about resizing the history table if the modal is active
	jqHistoryModalBody = $("#" + compID + "FullHistoryModalbody");
	if (jqHistoryModalBody.length && historyTable){
		//Get height for the modal body section
		modalBodyHeight = jqHistoryModalBody.height();
		
		//Grab history table object
		jqHistoryTable = $("#" + compID + "Historytable");
		
		//Get any extra height(margin/padding) from the table element
		marginHeight = jqHistoryTable.outerHeight(true) - jqHistoryTable.height();
		
		//Get table hdr height
		historyTableHdrHeight = jqHistoryTable.find(".content-hdr").outerHeight(true);
		
		jqHistoryTable.find(".content-body").css({"max-height": (modalBodyHeight - (historyTableHdrHeight + marginHeight)) + "px", "overflow-y": "auto", "box-sizing": "border-box"});
		
		historyTable.updateAfterResize();
	}
};
/**
 * Resizes the component body to keep the side panel and the left container in vertical sync
 */
	
ChargesO1Component.prototype.resizeComponentBody = function(){
	//Need to keep the Side Pane/Charge table section heights in sync
	/*
	 * Left Side:
	 * 	ContentContainer > div
	 * 
	 * Right Side:
	 * 	SidePaneContainer > div
	 */
	if(!this.chargesSidePaneObj){
		return;
	}
	var i;
	var compID = this.getComponentId();
	//left container containing the rolling table, visit dropdown and the cpt table.
	var leftContainer = $("#" + compID + "ContentContainer");
	var leftContentHeight = 0;
	//Height of the Side Panel 
	var sidePaneContainerHeight = parseInt(this.chargesSidePaneObj.getHeight().replace(/px$/, ""));
	//Get height of left content side
	//zero-out cptTableFiller (don't want this to affect sizing)
	var cptTableFiller = $("#" + compID + "CPTTableFiller");
	cptTableFiller.css({"display": "none", "height": "0px"});
	leftContentHeight += leftContainer.outerHeight(true);
	//Comparing the left container height with the constant minimum height(275px), instead of the current height of the side panel as resizeComponentBody is called
	//after every action performed in the left container which might increase or decrease the height of the left container which would increase the height of the SidePaneC. 
	if(leftContentHeight <= this.MIN_SP_HEIGHT){
		//if the leftContentHeight is less than the minimum height, we'd need to add a filler to the bottom of left container to match the min height of the sidepane.
		cptTableFiller.height(this.MIN_SP_HEIGHT - leftContentHeight);
		//If the height of the current side pane is greater than the min-height, resize the pane.			
		if(sidePaneContainerHeight >= this.MIN_SP_HEIGHT){
			//All the browsers that support expand down option should not take a max-height as param for the resizePanel.
			this.chargesSidePaneObj.resizePanel();
		}
		this.chargesSidePaneObj.setHeight(this.MIN_SP_HEIGHT+"px");//Reset the height to minimum height of 275px.
	}else if(leftContentHeight > this.MIN_SP_HEIGHT){//If the leftContentHeight is greater than the side pane's min height of 275px, then resize the sidePanel so that it stays in sync with left container.
		this.chargesSidePaneObj.resizePanel();
		this.chargesSidePaneObj.setHeight(leftContentHeight+"px");
	}
	//Always reactivate filler to provide that bottom grey border
	cptTableFiller.css("display", "block");
	if(!this.m_isCPTSubmitted){
		this.chargesSidePaneObj.expandSidePanel();
	}
};

/**
 * Overrides MPageComponent's resizeComponent and will apply the max-height and scroll to the left container
 * and resizing the side panel based upon the left container's height.
 */
ChargesO1Component.prototype.resizeComponent = function(){
	/*
	*This will not call the MPageComponent's resizeComponent as the component body does not contain the content-body class
	* on which the max-height and scroll is applied, rather the same logic is applied on the left container.
	* 
	*/
	var compID = this.getComponentId();
	var calcHeight = "";
	var compHeight = 0;
	var compDOMObj = null;
	var viewContainer = null;
	var leftContainerChildren;
	var leftContentHeight = 0;
	var contentBodyObj = null;
	var contentBodyHeight = 0;
	var leftContentBodyObj = null;
	var miscHeight = 20;
	var viewHeight = 0;
	var totalChildrensInLC; //children length
	var parsedcalcHeight = 0;
	var parsedMinHeight = 0;
	viewContainer = $("#vwpBody");
	if(!viewContainer.length) {
		return;
	}
	viewHeight = viewContainer.height();

	//Make sure component is rendered
	compDOMObj = $("#" + this.getStyles().getId());
	if(!compDOMObj.length) {
		return;
	}

	//Get the overall height of the left content-body section if available at this time
	contentBodyObj = compDOMObj.find("#"+compID+"Container");
	leftContentBodyObj = compDOMObj.find("#"+compID+"ContentContainer");
	if(contentBodyObj.length) {
		//Get the overall component height
		compHeight = compDOMObj.height();
		contentBodyHeight += contentBodyObj.outerHeight(true);
		//Calculate the estimated max height of the components content-body element
		calcHeight = (viewHeight - (compHeight - contentBodyHeight + miscHeight)) + "px";
		//apply the max-height settings
		leftContentBodyObj.css("max-height", calcHeight).css("overflow-y", "auto");
		leftContentBodyHeight = leftContentBodyObj.outerHeight(true);
		parsedcalcHeight = parseInt(calcHeight.replace(/px$/, ""));
		parseSidePaneHeight = parseInt(this.chargesSidePaneObj.getHeight().replace(/px$/, ""));
	}
    //History table will only get resized if the modal is active
	this.resizeHistoryTable();	
};

/*
 ** This is a callback which will be called on cell click of the component table
 */
ChargesO1Component.prototype.onRowClick = function(event, data) {
	var compID = this.getComponentId();
	var self = this;
	var selRow = $(event.currentTarget);//.parents("dl.result-info");
	var rowId = this.getRowId(selRow);
	var visitType = $("#" + compID+ "ChargeTypeDropDown option:selected").attr("cdf_meaning");
	//Sets the currently Selected Visit Type's CDF meaning
	self.setVisitTypeCDFMeaning(visitType);	
	//Sets the modified location Id value to 0
	self.setModifiedLocationId(0);
	//resetting the Location popover Object
	self.setLocationPopupObj(null);
	//Sets the modified provider Id value to 0
	self.setModifiedProviderId(0);
	//Resetting the Provider popover Object 
	self.setProviderPopupObj(null);
	if (!selRow.length || data.RESULT_DATA === null) {
		return;
	}
	if(this.m_isCPTSubmitted)	{
		this.m_isCPTSubmitted = false; 
	}
	if(rowId == this.lastSelectedRow){
		this.removeSelRowBgColor();
		this.lastSelectedRow = null;
		this.setSelectedCodeObj(null);
		this.setCurrentCPTCode(null);
		this.renderDefaultPPInitialView();
		this.resizeComponentBody();
	}
	else{
		//this.updateCPTText(data.RESULT_DATA.CPT)
		this.updateInfo(selRow);
		this.setSelectedCodeObj(data.RESULT_DATA);
		this.setCurrentCPTCode(data.RESULT_DATA.CPT || "");
		//this.refreshSidePane();
		if (!this.wasConditionsScriptCalled()){
			this.fetchConditions(function(){
				//Sets the Level of Service parameter for requesting nCode Recommedation
				self.setLevelOfServiceFromCPTCode(parseInt(self.getCurrentCPTCode())); 
				self.renderDefaultPPInteractiveView();
				//this method requests for nCode which can be Recommended to the user
				self.getNcodeRecommendations(); 
				self.resizeComponentBody();
			});
		} else if (this.getConditionsRetrievedStatus()){
			//Sets the Level of Service parameter for requesting nCode Recommedation
			self.setLevelOfServiceFromCPTCode(parseInt(self.getCurrentCPTCode())); 
			self.renderDefaultPPInteractiveView();
			//this method requests for nCode which can be Recommended to the user
			self.getNcodeRecommendations(); 
			self.resizeComponentBody();
		}				
	}
};

/*
 ** Register the events for
 * 1. Type Drop Down Change
 * 2. Search Box text is sent to CPT Code label
 * 3. Click event for Add Note.
 */
ChargesO1Component.prototype.attachListeners = function() {
	var compID = this.getComponentId();
	var userPrefs = this.getPreferencesObj();
	var that = this;
	var dropDownId = compID + 'ChargeTypeDropDown';
	
	//1. Type Drop Down Change
	$('#' + dropDownId).change(function(){
		var dropDownValue = $(this).val();
		that.refreshChargeTable(dropDownValue);
	});
	
	// 3. Click event for Add Note.
	$('#' + compID + "addNote").click(function(){
	
		that.openMyNotes();
	});
	
	if(that.isnCodeServerRunning()) {
		if(!userPrefs) {
			$('#' + compID + "SpecialtyBanner").show();
		}
		else {
			$('#' + compID + "SpecialtyBanner").hide();
		}
	} else {
		$('#' + compID + "SpecialtyBanner").hide();
	}
	
	//Specialty drop down change event handler
	$("#ChargeSpecialtyDropDown").on("change", function() {
		var specialtyDropDownId = document.getElementById("ChargeSpecialtyDropDown");		
		if(specialtyDropDownId && specialtyDropDownId.selectedIndex > 0) {
			document.getElementById("specialtyAssignBtn" + compID).disabled = false;
			if($('#specialtyAssignBtn' + compID).hasClass("charges-o1-specialty-assign-btn-disable")) {
				$('#specialtyAssignBtn' + compID).removeClass("charges-o1-specialty-assign-btn-disable");
				$('#specialtyAssignBtn' + compID).addClass("charges-o1-specialty-assign-button");
			}
			$('#specialtyAssignBtn' + compID).focus();
		} else if(specialtyDropDownId && specialtyDropDownId.selectedIndex === 0) {
			document.getElementById("specialtyAssignBtn" + compID).disabled = true;
			if($('#specialtyAssignBtn' + compID).hasClass("charges-o1-specialty-assign-button")) {
				$('#specialtyAssignBtn' + compID).removeClass("charges-o1-specialty-assign-button");
				$('#specialtyAssignBtn' + compID).addClass("charges-o1-specialty-assign-btn-disable");
			}
		}
	});
	if(document.getElementById("specialtyAssignBtn" + compID)) {
		document.getElementById("specialtyAssignBtn" + compID).disabled = true;	
	}
};

/**
 * Toggles the Side Panel buttons on or off based on certain conditions
 * Buttons toggle on if a diagnosis is selected, and there is a valid CPT code entered
 */
ChargesO1Component.prototype.toggleButtons = function() {
	var compID = this.getComponentId();
	if (this.isDiagnosisSelected() && this.getCurrentCPTCode()){
		$('#' + compID + 'RPSubmitBtn').removeClass("disabled");
	} 
};

/**
 * Populates the CPT codes map based off the CPT codes in the Visit Type table
 * CPT codes map uses CPT code as the key, with an object containing 'indexCharge' and 'indexItem' as the value
 * This map is useful when determining which row in the Visit Type table to select based on an entered CPT code
 */
ChargesO1Component.prototype.grabTableCPTCodes = function(){
	var json = this.getJSON();
	var charges = json.CHARGES;
	var cLen = charges.length;
	var i;
	var cpts = this.getCPTCodesMap();
	for (i = 0; i < cLen; i++){
		var info = charges[i].CPT_INFO;
		var j;
		var iLen = info.length;
		
		for (j = 0; j < iLen; j++){
			//Check for sub
			var obj = info[j];				
			cpts[obj.CPT] = {indexCharge: i, indexItem: j};
		}
	}
};

//Refresh the charge component table based on charge type
ChargesO1Component.prototype.refreshChargeTable = function(chargeValue) {
	var compID = this.getComponentId();
	var self = this;
	var tempTable = this.getChargesTable();
	var chargeJSON = this.getChargingJSON();
	var hasSub = false;
	//Need to determine if object has sub fields
	var charges = chargeJSON.CHARGES[chargeValue];
	var info = charges.CPT_INFO;  
	var need = charges.NEED;
	
	var cptRange = {};
	if(info){
		cptRange = {"start": charges.CPT_INFO[0].CPT, "end": charges.CPT_INFO[charges.CPT_INFO.length-1].CPT};
	}
	this.setSelectedVisitCPTRange(cptRange);
	
	//Remove default table
	$("#" + compID + "DefaultCPTtable").remove();

	
	if (info && info.length){
		var tmp = info[0];
		hasSub = (!!tmp['Sub_Category']);
	}
	//Delete existing groups
	tempTable.clearGroups();
	tempTable.bindData(info);
	if (hasSub){
		tempTable.quickGroup("Sub_Category", '<span>${Sub_Category}</span>', false);
	}
	
	//Update Instructions
	this.updateCPTInstructions((need) ? need + " criteria required" : "");
	
	//Add our table if it doesn't already exist
	if (!($("#" +this.getStyles().getNameSpace()+ compID + "table").length)){
		$("#" + compID + "VisitTypeDefaultOption").remove();
		$("#" + compID + "CPTTableContainer").html(tempTable.render());
		tempTable.finalize();
		$("#" +this.getStyles().getNameSpace()+ compID + "tableBody").on("mouseup", ".result-info", function(event){
			var resData = ComponentTableDataRetriever.getResultFromTable(self.getChargesTable(), this);
			var d = {
					"RESULT_DATA" : resData,
					"SOURCE" : "ROW_CLICK"
			};
			self.onRowClick(event, d);
		});
	} else {
		tempTable.refresh();
	}
	this.resizeComponentBody();
};

/**
 * Creates a formatted date MM/DD/YYYY from a Date object
 * @param {Date} dttm - date object to create formatted date from
 * @returns {string} - Formatted date MM/DD/YYYY
 */
ChargesO1Component.prototype.convertDateToMMDDYYYY = function(dttm){
	//Sanity check
    if (!dttm){
		return;
	}
	var dateStr;
	var df = MP_Util.GetDateFormatter();
	
	dateStr = df.format(dttm, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
	return dateStr;
};

/**
 * Creates a formatted date MMDDYYYY
 * @param dt
 * @returns {string}
 */
ChargesO1Component.prototype.getDateForCCL = function(dt){
	if (!dt){
		return; //Throw error
	}

	var strDate = "";
	strDate += ((dt.getMonth() + 1) < 10) ? "0" + (dt.getMonth() + 1) : "" + (dt.getMonth() + 1);
	strDate += (dt.getDate() < 10) ? "0" + dt.getDate() : "" + dt.getDate();
	strDate += dt.getFullYear();
	return strDate;
};

/**
 * Creates a formatted date MMM DD
 * @param {Date} dttm - date object to create formatted date from
 * @returns {string} - formatted date MMM DD
 */
ChargesO1Component.prototype.convertToRollingHistoryDateFormat = function(dttm){
	if (!dttm){
		return;
	}
	
	var dd = dttm.getDate();
	var mmm = dttm.getMonth();
	switch (mmm){
		case 0:
			mmm = i18n.discernabu.charges_o1.JAN;
			break;
		case 1:
			mmm = i18n.discernabu.charges_o1.FEB;
			break;
		case 2:
			mmm = i18n.discernabu.charges_o1.MAR;
			break;
		case 3:
			mmm = i18n.discernabu.charges_o1.APR;
			break;
		case 4:
			mmm = i18n.discernabu.charges_o1.MAY;
			break;
		case 5:
			mmm = i18n.discernabu.charges_o1.JUNE;
			break;	
		case 6:
			mmm = i18n.discernabu.charges_o1.JULY;
			break;
		case 7:
			mmm = i18n.discernabu.charges_o1.AUG;
			break;
		case 8:
			mmm = i18n.discernabu.charges_o1.SEP;
			break;
		case 9:
			mmm = i18n.discernabu.charges_o1.OCT;
			break;
		case 10:
			mmm = i18n.discernabu.charges_o1.NOV;
			break;
		case 11: 
			mmm = i18n.discernabu.charges_o1.DEC;
			break;
		default:
			mmm = i18n.discernabu.charges_o1.MONTH;
	}
	
	return mmm + " " + dd;
};

ChargesO1Component.prototype.getDateString = function(dt){
	if (!dt){
		return "";
	}
	var dd = dt.getDate();
	var yyyy = dt.getFullYear();
	var mm = dt.getMonth();
	
	//set month to name
	switch (mm){
		case 0:
			mm = "January";
			break;
		case 1:
			mm = "February";
			break;
		case 2:
			mm = "March";
			break;
		case 3:
			mm = "April";
			break;
		case 4:
			mm = "May";
			break;
		case 5:
			mm = "June";
			break;	
		case 6:
			mm = "July";
			break;
		case 7:
			mm = "August";
			break;
		case 8:
			mm = "September";
			break;
		case 9:
			mm = "October";
			break;
		case 10:
			mm = "November";
			break;
		case 11: 
			mm = "December";
			break;
		default:
			mm = "Month";
	}
	
	return (mm + " " + dd + ", " + yyyy);
};

ChargesO1Component.prototype.refreshEditableSection = function(){
	$("#" + this.getComponentId() + "RPEditableSection").html(this.buildPPEditableSectionHTML());
};

ChargesO1Component.prototype.refreshDiagnosesSection = function(){
	$("#" + this.getComponentId() + "RPDiagnosesSection").html(this.buildPPDiagnosesSectionHTML());
};

ChargesO1Component.prototype.renderHistoricalPPView = function(historicalItem){
	var compID = this.getComponentId();
	var htmlAction = [];
	//Create button row
	htmlAction.push("<div class='charges-o1-rp-btn-cont'>");
	htmlAction.push("<input id='" + compID + "RPNewBtn' type='button' class='charges-o1-rp-button' value='" + i18n.discernabu.charges_o1.NEW_CHARGE + "' />"); 
	htmlAction.push("</div>");
	if (!historicalItem){
		return;
	}
	this.chargesSidePaneObj.setActionsAsHTML(htmlAction.join(""));
	this.chargesSidePaneObj.setContents(this.buildPPHistoricalViewHTML(historicalItem), "chargesContent" + compID);
};

ChargesO1Component.prototype.renderDefaultPPInteractiveView = function(){
	var compID = this.getComponentId();
	var html = "";
	var compDOMObj = $("#" + this.getStyles().getId());
	var leftContentBodyObj = compDOMObj.find("#"+compID+"ContentContainer");
	var leftContentHeight = $(leftContentBodyObj).outerHeight(true);
	
	//html for Submit action button
	var htmlAction = [];
	htmlAction.push("<div class='sp-action-holder'>");
	htmlAction.push("<div class='sp-button2 disabled' id='" + compID + "RPSubmitBtn' >" + i18n.discernabu.charges_o1.SUBMIT + "</div>");
	htmlAction.push("</div>");
	this.chargesSidePaneObj.setActionsAsHTML(htmlAction.join(""));
	
	//Clear Associated Conditions Object
	this.getAssociatedConditionsObj().clearConditions();
	//Populate Unassociated Conditions Object
	this.populateUnassociatedConditionsArray();
	
	html += this.buildPPInteractiveViewHTML();
	//Render the view in the preview pane
	this.chargesSidePaneObj.setContents(html,"chargesContent" + compID);
	//Use this nCode Action copies the Recommended nCode to currently selected CPT Box
	this.bindUseThisNcodeAction();
	//Toggle Preview Pane Buttons
	this.toggleButtons();
	// Reset modifier value
	this.setSelectedModifier(0);
	//Resetting the Modifier popover Object
	this.setPopupObj(null);
	//Creates the object sets the content of Popover UI for modifiers selection.
	this.addModifier();
	//binds the click event to select the modifier.
	this.bindModifierPopupClick();
};
/**
 * Binds the Click event to open the Popover UI which lets the user to select the modifier during charge submission.
 */
ChargesO1Component.prototype.bindModifierPopupClick = function(){
	var self = this;
	var compId = self.getComponentId();
	var $modifierValue = $("#" + compId + "modifierValue");
	var popupTimerObj = null;
	var popupObject = self.getPopupObj();
	$modifierValue.on("click", function(){
		popupObject.toggle();
		popupObject.setBodyContent(self.getModifiersContent());
		// Register click event for each menu items.
		var modiersMenuItemDOM = $("#modifiersMenuItems" + compId);
		modiersMenuItemDOM.unbind("click");
		modiersMenuItemDOM.on("click", ".charges-o1-modifier-menu-item", function(event) {
			
			// Find the value of selected modifier from "data-modifier-value" data attribute and 
			// store the selected modifier of current CPT code for future use.
			var curSelectedModifier = $(this).data("modifier-value");
			var lastSelectedModifier = self.getSelectedModifier();
			
			// If user again clicks on currently selected modifier, it will get deselected.
			// Then reset the SelectedModifier value to zero.
			
			self.setSelectedModifier((curSelectedModifier == lastSelectedModifier) ? 0 : curSelectedModifier);
			//After selecting any modifier if the popup is open then it will be closed.
			if(popupObject.isOpen()){
				popupObject.hide();
			}
		});
		//Every time this event will be unbinded and binded to avoid multiple bindings
		modiersMenuItemDOM.unbind("mouseleave");
		//When user moves the mouse pointer out of the popup, the popup disappears.
		modiersMenuItemDOM.on("mouseleave", function(event) {
			if(popupObject.isOpen()){
				popupObject.hide();
			}
		});
		//Every time this event will be unbinded and binded to avoid multiple bindings
		modiersMenuItemDOM.unbind("mouseenter");
		//When user moves the mouse pointer out of the popup, the popup disappears.
		modiersMenuItemDOM.on("mouseenter", function(event) {
			if(popupTimerObj !== null){
				window.clearTimeout(popupTimerObj);
			}
		});
		function hidePopup(){
			if(self.getPopupObj() && self.getPopupObj().isOpen()){
				popupObject.hide();
			}
		}
		//Time will be set when the popup is opened to close it after that automatically.
		popupTimerObj = setTimeout(hidePopup,4000);
	});
};
ChargesO1Component.prototype.renderDefaultPPInitialView = function(){
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var html = "";
	//html for Submit action button
	var htmlAction = [];
	htmlAction.push("<div class='sp-action-holder'>");
	htmlAction.push("<div class='sp-button2 disabled' id='" + compID + "RPSubmitBtn' >" + i18n.discernabu.charges_o1.SUBMIT + "</div>");
	htmlAction.push("</div>");
	
	//Clear current CPT code
	this.setCurrentCPTCode(null);
	
	//Clear selected E&M Row
	this.lastSelectedRow = null;
	$("#" + this.getStyles().getId()).find(".charges-o1-row-selected").removeClass("charges-o1-row-selected selected");
	
	//Build interactive view for preview pane
	html += this.buildPPInitialViewlHTML();
	
	//Render the view in the preview pane
	this.chargesSidePaneObj.setActionsAsHTML(htmlAction.join(""));
	this.chargesSidePaneObj.setContents(html, "chargesContent" + compID);
	
	// Reset modifier value
	this.setSelectedModifier(0);
	//Resetting the Modifier popover Object
	this.setPopupObj(null);
};
/*
 * These methods necessary since architecture ones either don't exist or work incorrectly
 */
ChargesO1Component.prototype.loadSpinner = function(resultContainerID){
	if(resultContainerID && typeof resultContainerID === "string"){
		var resultContainer = $('#'+resultContainerID);
		var contentHeight = resultContainer.outerHeight();
		var loadingIconTop = 0;
		
		resultContainer.append("<div class='loading-screen' style='height: "+contentHeight+"px; top: "+loadingIconTop+"px; '><div class='loading-spinner'>&nbsp;</div></div>");
	}
};
/**
 * Calls method to make AJAX request for conditions, processes the conditions, and executes callback function
 * @param {function} callback - function to execute after conditions have been processed.  Callback is given component as scope
 */
ChargesO1Component.prototype.fetchConditions = function(callback){
	var compID = this.getComponentId();
	var self = this;
	//Component will lazy load diagnoses.
	//Component will check if diagnoses were loaded, and if not, call a script
	//Check if the mp_get_conditions script was ever called
	//This is the first time we are trying to retrieve diagnoses
	this.conditionsScriptWasCalled(true); //Inform the component that the script was called so we don't try to call it again
	this.loadSpinner(compID + "Container");
	this.cclGetConditions(function(reply){
		self.processConditions(reply);
		self.clearSpinner(compID + "Container");
		callback.apply(self);		
		self.chargesSidePaneObj.expandSidePanel();
	});
};

/**
 * Handles updating the Side Panel when a cell in the rolling history table is clicked
 * This function gets set as the cell click function in the rolling history table
 * @param hasHistoricalCPT
 * @param historyObj
 */
ChargesO1Component.prototype.handleRollingHistoryCellClick = function(hasHistoricalCPT, historyObj){
	this.setServiceDate(historyObj.DATE_OBJ);
	//Sets the modified location Id value to 0  
	this.setModifiedLocationId(0);
	this.setLocationPopupObj(null);
	//Sets the modified provider Id value to 0
	this.setModifiedProviderId(0);
	this.setProviderPopupObj(null);
	if (hasHistoricalCPT){
		this.removeSelRowBgColor();
		this.lastSelectedRow = null;
		this.setSelectedCodeObj(null);
		this.setCurrentCPTCode(null);
		this.renderHistoricalPPView(historyObj);
		this.chargesSidePaneObj.collapseSidePanel();
	}
	 else {		
		this.renderDefaultPPInitialView();
		this.resizeComponentBody();
	}
};

/**
 * Creates the full history component table
 * @param {array} inputJSON - array of JSON results to populate the table
 * @returns {ComponentTable} - full charge history table
 */
ChargesO1Component.prototype.createHistoryTable = function(inputJSON){
	var compID = this.getComponentId();

	//setup the table
	var historyTable = new ComponentTable();
	historyTable.setNamespace(compID + "History");
	historyTable.setCustomClass("charges-o1-table charges-o1-history-table");
	historyTable.setZebraStripe(true);

	var svcDateHist = new TableColumn();
	svcDateHist.setColumnId("svcDateHist");
	svcDateHist.setCustomClass("charges-o1-fh-svc-date-col");
	svcDateHist.setColumnDisplay(i18n.discernabu.charges_o1.SERVICE_DATE);
	svcDateHist.setRenderTemplate('<span>${SVC_DATE} </span>');
	svcDateHist.setIsSortable(true);
	svcDateHist.setPrimarySortField("SERVICE_DATE");
 
	var physHist = new TableColumn();
	physHist.setColumnId("physHistory");
	physHist.setCustomClass("charges-o1-fh-physician-col");
	physHist.setColumnDisplay(i18n.discernabu.charges_o1.PROVIDER);
	physHist.setRenderTemplate('<span>${PHYSICIAN_NAME} </span>');
	physHist.setIsSortable(true);
	physHist.setPrimarySortField("PHYSICIAN_NAME");
	physHist.addSecondarySortField("SERVICE_DATE", TableColumn.SORT.DESCENDING);
	
	var cptHist = new TableColumn();
	cptHist.setColumnId("cptHistory");
	cptHist.setCustomClass("charges-o1-fh-cpt-col");
	cptHist.setColumnDisplay(i18n.discernabu.charges_o1.CPT_CODE);
	cptHist.setRenderTemplate('<span>${CPT_CODE} </span>');
	cptHist.setIsSortable(true);
	cptHist.setPrimarySortField("CPT_CODE");
	cptHist.addSecondarySortField("SERVICE_DATE", TableColumn.SORT.DESCENDING);
		
	var priDiagHist = new TableColumn();
	priDiagHist.setColumnId("priDiagHist");
	priDiagHist.setCustomClass("charges-o1-fh-diag-col");
	priDiagHist.setColumnDisplay(i18n.discernabu.charges_o1.PRIMARY_DIAGNOSIS);
	priDiagHist.setRenderTemplate('<span>${PRIMARY_DIAG_STRING}</span>');
	priDiagHist.setIsSortable(true);
	priDiagHist.setPrimarySortField("PRIMARY_DIAG_STRING");
	priDiagHist.addSecondarySortField("SERVICE_DATE", TableColumn.SORT.DESCENDING);
	
	//add columns to table
	historyTable.addColumn(svcDateHist);
	historyTable.addColumn(physHist);
	historyTable.addColumn(cptHist);	
	historyTable.addColumn(priDiagHist);
	
	//set the table to the provided Json
	historyTable.bindData(inputJSON);
	
	//Set default sort
	historyTable.sortByColumnInDirection("svcDateHist", TableColumn.SORT.DESCENDING);
	
	//Finalize the table
	return historyTable;
};
/**
 * Adds the Side Panel to the component
 * This method should only be called once, when the component is rendered.
 */
ChargesO1Component.prototype.addChargesSidePanel = function() {
	var compID = this.getComponentId();
	var panelID = compID+"SidePaneContainer";
	var chargesSPObj = new CompSidePanel(compID, panelID);
	chargesSPObj.setExpandOption(chargesSPObj.expandOption.EXPAND_DOWN);	
	chargesSPObj.renderPreBuiltSidePanel();
	$("#sidePanelHeaderText" + compID).addClass('hidden');
	$("#sidePanelActionBar" + compID).addClass('charges-o1-ation-bar');
	chargesSPObj.setApplyBodyContentsPadding(true);
	chargesSPObj.setContents(this.buildPPInitialViewlHTML(), "chargesContent" + compID);
	chargesSPObj.setMaxHeight(this.MIN_SP_HEIGHT+"px");	
	this.chargesSidePaneObj = chargesSPObj;
	this.addClickExpandCollapse();
};
/**
 * Creates the Visit Type
 * This table shows buckets of selectable CPT codes, split by visit type
 * @param {array} inputJSON - JSON containing CPT code info by visit type
 * @returns {ComponentTable} - Visit type component table
 */
ChargesO1Component.prototype.generateChargeTable = function(inputJSON) {
	var chargeTableHTML = "";
	var that = this;
	//setup the table
	var chargeTable = new ComponentTable();
	chargeTable.setNamespace(this.getStyles().getId());
	chargeTable.setZebraStripe(true);

	var chargeCPT = new TableColumn();
	chargeCPT.setColumnId("chargeCPT");
	chargeCPT.setCustomClass("charges-o1-column charges-o1-trans");
	chargeCPT.setColumnDisplay(i18n.discernabu.charges_o1.CPT_CODE);
	chargeCPT.setRenderTemplate('<span>${CPT} </span>');
	
	//history column setup
	var chargeHistory = new TableColumn();
	chargeHistory.setColumnId("chargeHistory");
	chargeHistory.setCustomClass("charges-o1-column charges-o1-trans");
	chargeHistory.setColumnDisplay(i18n.discernabu.charges_o1.HISTORY);
	chargeHistory.setRenderTemplate('<span>${HISTORY} </span>');
	
	//exam column setup 
	var chargeExam = new TableColumn();
	chargeExam.setColumnId("chargeExam");
	chargeExam.setCustomClass("charges-o1-column charges-o1-trans");
	chargeExam.setColumnDisplay(i18n.discernabu.charges_o1.EXAM);
	chargeExam.setRenderTemplate('<span>${EXAM} </span>');

	//decision-making column setup 
	var chargeDecision = new TableColumn();
	chargeDecision.setColumnId("chargeDecision");
	chargeDecision.setCustomClass("charges-o1-column charges-o1-trans");
	chargeDecision.setColumnDisplay(i18n.discernabu.charges_o1.DECISION_MAKING);
	chargeDecision.setRenderTemplate('<span>${DECISION_MAKING} </span>');
	
	//add columns to table
	chargeTable.addColumn(chargeCPT);
	chargeTable.addColumn(chargeHistory);
	chargeTable.addColumn(chargeExam);
	chargeTable.addColumn(chargeDecision);
	
	//set the table to the provided Json
	chargeTable.bindData(inputJSON);
	
	//Finalize the table
	return chargeTable;
};
/**
 * Gets the Charge JSON that populates the Visit Type table
 * @returns {{Charge: *[]}}
 */
ChargesO1Component.prototype.getJSON = function () {
	var visitTypeDefnitionArr = this.getVisitTypeDefinitions();
	var visitTypeDefnitionArrLen = visitTypeDefnitionArr.length;
	var allowedVisits = {
		"CHARGES" : []
	};
	for (var index = 0; index < visitTypeDefnitionArrLen; index++) {
		if (visitTypeDefnitionArr[index].ENC_TYPE === this.getEncntrTypeCd() || !visitTypeDefnitionArr[index].ENC_TYPE) {
			allowedVisits.CHARGES.push(visitTypeDefnitionArr[index]);
		}
	}
	return allowedVisits;
};

/**
 * Updates the Side Panel 'Invalid CPT' alert based on the passed in boolean flag
 * @param showAlert - true if the alert should show, false otherwise
 */
ChargesO1Component.prototype.updateSidePaneInvalidCPTAlert = function(showAlert){
	var jqWarnSection = $("#" + this.getComponentId() + "PPWarningSection");
	var html = "";

	if (!showAlert) {
		jqWarnSection.html(html);
		return;
	}

	html += "<div class='charges-o1-pp-error-section'>";
	html += "<span class='charges-o1-alert-icon'></span>";
	html += "<span class='charges-o1-alert-message'>";
	html += "<span class='charges-o1-error-primary'>" + i18n.discernabu.charges_o1.CPT_CODE_ERROR_MESSAGE_PRIMARY + "</span>";
	html += i18n.discernabu.charges_o1.CPT_CODE_ERROR_MESSAGE;
	html += "</span>";
	html += "</div>";
	//To clear the calculated height for scroll functionality in side panel
	jqWarnSection.html(html);
};

/**
 * Updates the Side Panel 'Primary Diagnosis' alert
 * If the current primary diagnosis was used by another provider for the same day, then this alert will display
 */
ChargesO1Component.prototype.updateSidePanePrimaryDiagnosisAlert = function(){
	var compID = this.getComponentId();
    var associatedConditionsContainer = this.getAssociatedConditionsObj();
    var condition;
    var showDiagnosisWarning = false;
	var html = "";

    //Do checks for warning
    if (associatedConditionsContainer.getLength()){
        condition = associatedConditionsContainer.getConditionIndexOf(0);
        showDiagnosisWarning = this.isPrimaryForOtherUser(condition);
    }

    if (!showDiagnosisWarning){
        $("#" + compID + "PPWarningSection").html("");
        return;
    }

    html += "<div class='charges-o1-pp-warning-section'>";
    //Span for alert icon
    html += "<span class='charges-o1-alert-icon'></span>";
    //span for alert text
    html += "<span class='charges-o1-alert-message'>";
    html +=    "&lt;"+i18n.discernabu.charges_o1.DIAGNOSIS_ALREADY_APPLIED+"&gt;";
    html +=    "<a id='" + compID + "PriDiagShowHistory' class='charges-o1-show-history-link'>" + i18n.discernabu.charges_o1.SHOW_CHARGE_HISTORY+ "</a>";
    html += "</span>";
    html +="</div>";
	$("#" + compID + "PPWarningSection").html(html);
};

/**
 *
 * @param obj
 * @returns {boolean}
 */
ChargesO1Component.prototype.isPrimaryForOtherUser = function(obj){
	//Need the current service date bucket, and the condition
	var chargeHistoryMap;
	var serviceDate;
	var dateFormatter = MP_Util.GetDateFormatter();
	var serviceDateKey = "";
	var curDiagNomenId = 0;
	var charges = null;
	var cLen = 0;
    var condition;
	var diagnoses = null;
    var diagnosis;
	var dLen = 0;
	var providerID = this.getCriterion().provider_id;
	var i;
	var j;
	
	if (!obj || !obj.CONDITION){
		return;
	}

    condition = obj.CONDITION;
    diagnoses = condition.DIAGNOSES;
    if (!(diagnoses && diagnoses.length)){
        return false;
    }
    //Grab most recent diagnosis
    diagnosis = diagnoses[0];
	curDiagNomenId = diagnosis.TARGET_NOMENCLATURE_ID;
	
	
	serviceDate = this.getServiceDate();
	if (!serviceDate){
		return;
	}
	
	serviceDateKey = dateFormatter.format(serviceDate, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
	chargeHistoryMap = this.getChargeHistoryMap();
	if (!chargeHistoryMap || !chargeHistoryMap[serviceDateKey]){
		return;
	}
	
	//Grab the bucket of charges (array) for the given date
	charges = chargeHistoryMap[serviceDateKey] || [];
	
	//Loop through charges, looking for other providers
	for (i = 0, cLen = charges.length; i < cLen; i++){
		var charge = charges[i];
		//Skip ahead if the provider id for the charge matches current user
		if (providerID === charge.VERIFY_PHYS_ID){
			continue;
		}
		diagnoses = charge.DIAGNOSES || [];
		
		//Loop through diagnoses
		for (j = 0, dLen = diagnoses.length; j < dLen; j++){
			var chargeDiagnosis = diagnoses[j];
			//If the diagnosis wasn't the primary one, skip to the next diagnosis
			if (chargeDiagnosis.INDEX !== 1){
				continue;
			}
			//A primary diagnosis was charted by another user, that matches the one we're trying to chart!
			if (chargeDiagnosis.NOMEN_ID === curDiagNomenId){
				return true;
			} 
		}
	}
	
	return false;	
};

/**
 * Makes the selected diagnosis primary
 * Visually, this moves an associated or unassociated diagnosis to the primary diagnosis in the associated section of the Side Pane
 * @param {jQuery object} jqElement - jQuery object that stores the element that shows the diagnosis to make primary
 * @returns {object} - the object containing the condition that was made primary
 */
ChargesO1Component.prototype.makeDiagnosisPrimary = function(jqElement){
	//Need to check class to distinguish if condition is associated or not
	var id = jqElement.prop("id");
	var isAssociated = jqElement.hasClass("charges-o1-rp-diag-assigned");
	var associatedConditions = this.getAssociatedConditionsObj();
	var unassociatedConditions = this.getUnassociatedConditionsObj();
	var condition = null;
	
	//If the condition is already associated, we need to move it in our associated conditions obj
	if (!isAssociated){
		//Remove condition from unassociated array
		condition = unassociatedConditions.removeConditionByHTMLId(id);
	} else {
		//Remove the condition from the array.  This wil take care of prioritization of remaining items
		condition = associatedConditions.removeConditionByHTMLId(id);
	}		
	
	if (!condition){
		return;
	}
	//Now reinsert at the beginning of associated conditions
	associatedConditions.insertConditionAt(condition, 0); 
	return condition;
};

/**
 * Moves a diagnosis from the unassociated conditions to the associated conditions
 * This function will refresh the Side Pane
 * @param {jQuery object} jqElement - jQuery object that stores the element that shows the diagnosis to associate
 */
ChargesO1Component.prototype.associateDiagnosis = function(jqElement){
	//Grab id of obj in unselected conditions array
	var id = jqElement.prop("id");
	var associatedConditions = this.getAssociatedConditionsObj();
	var unassociatedConditions = this.getUnassociatedConditionsObj();

	//Grab the condition obj while removing it from the unselected conditions array
	var obj = unassociatedConditions.removeConditionByHTMLId(id);

	associatedConditions.addCondition(obj); //Automatically updates the priority
	associatedConditions.sortByPriority();

    this.updateSidePanePrimaryDiagnosisAlert();
	this.refreshDiagnosesSection();
	this.toggleButtons();
};
/**
 * Moves a diagnosis from the associated conditions to the unassociated conditions
 * This function will refresh the Side Pane
 * @param {jQuery object} jqElement - jQuery object that stores the element that shows the diagnosis to associate
 */
ChargesO1Component.prototype.unassociateDiagnosis = function(jqElement){
	//Grab index of obj in selected conditions array
	var id = jqElement.prop("id");
	//var obj = this.removeFromSelectedConditionsArray(id);
	
	var associatedConditions = this.getAssociatedConditionsObj();
	var unassociatedConditions = this.getUnassociatedConditionsObj();
	//Remove the condition object from our associated conditions
	var obj = associatedConditions.removeConditionByHTMLId(id);
	
	//Add the condition object to our unassociated conditions
	unassociatedConditions.addCondition(obj);
	unassociatedConditions.sortByIndex();

    this.updateSidePanePrimaryDiagnosisAlert();
	this.refreshDiagnosesSection();
	this.toggleButtons();
};
/**
 * Populates unassociated conditions based on the retrieved conditions list
 * This should only need to be run once
 */
ChargesO1Component.prototype.populateUnassociatedConditionsArray = function(){
	var conditions = this.getConditionArray();
	if (!conditions){
		return;
	}
	var unassociatedConditions = this.getUnassociatedConditionsObj();
	//clear out the unassociated conditions
	unassociatedConditions.clearConditions();
	//this.clearUnselectedConditionsArray();
	var i;
	var iLen = conditions.length;
	for (i = 0; i < iLen; i++){
		var condition = conditions[i];
		//These objects will get passed between this array and the selected conditions array
		var obj = {};
		obj.PRIORITY = 0;
		obj.HTML_ID = this.getComponentId() + "DiagRow" + i;
		obj.INDEX = i;
		obj.NOMEN_ID = condition.NOMENCLATURE_ID;
		// TARGET_NOMENCLATURE_ID of this object will be the TARGET_NOMENCLATURE_ID of first diagnose in the 
		// diagnoses list of each condition as the first diagnose will be used for building associated or 
		// unassociated diagnoses row and billing purpose as well.
		// This filed will be used later to remove duplicate diagnose from unassociated conditions.
		obj.TARGET_NOMENCLATURE_ID = condition.DIAGNOSES[0].TARGET_NOMENCLATURE_ID;
		obj.CONDITION = condition;
		unassociatedConditions.addCondition(obj);
	}
};

/**
 * Flattens the history map to an array
 * This function is required to display the history information in component table
 * @returns {Array} - charge history array
 */
ChargesO1Component.prototype.convertHistoryMapToArray = function(){
	function calculateDaysDelta(pastDate, futureDate){
		return Math.floor((Date.parse(futureDate) - Date.parse(pastDate)) / MS_IN_DAY);
	}
	function getDateKey(dateObj){
		return dateFormatter.format(dateObj, fullDate4Year);
	}
	var chargeHistoryMap = this.getChargeHistoryMap();
	var chargeHistoryArray = [];
	var dateFormatter = MP_Util.GetDateFormatter();
	var fullDate4Year = mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR;
	var MS_IN_DAY = 86400000; //Const: # of ms in a day
	var workingDate;
	var dateKey;
	var startDate;
	var endDate;
	var numOfDays = 0;
	var i;
	
	//Set our startDate to beginning of encounter, and endDate to today's date
	startDate = this.m_encounterStartDate;
	endDate = new Date();
	endDate.setHours(12,0,0,0);
	
	//Calculate the total number of days in our 'history'
	numOfDays = calculateDaysDelta(startDate, endDate);
	
	//Iterate through each day, appending the data from bucket to our array
	for (i = 0; i <= numOfDays; i++){
		workingDate = new Date(Date.parse(startDate) + (i * MS_IN_DAY));
		dateKey = getDateKey(workingDate);
		//Ensure entry exists in chargeHistoryMap
		if (!chargeHistoryMap[dateKey]){
			continue;
		}
		//extends the chargeHistoryArray
		$.merge(chargeHistoryArray, chargeHistoryMap[dateKey]);
	}
	if(dateKey !== getDateKey(new Date())){
		$.merge(chargeHistoryArray, chargeHistoryMap[getDateKey(new Date())]);
	}
	return chargeHistoryArray;
};

/**
 * Creates the full charge history modal dialog
 * Adds the modal dialog to MP_ModalDialog
 * @returns {ModalDialog} - the modal dialog to hold the full charge history
 */
ChargesO1Component.prototype.createHistoryModal = function(){
	var self = this;  
	var modalID = self.getComponentId() + "FullHistoryModal";
	var modalDialog = new ModalDialog(modalID);
	
	modalDialog.setHeaderTitle(i18n.discernabu.charges_o1.CHARGE_HISTORY);
	modalDialog.setLeftMarginPercentage(20);
	modalDialog.setRightMarginPercentage(20);
	
	modalDialog.setHeaderCloseFunction(function(){
		MP_ModalDialog.closeModalDialog(modalID);
		self.setShowChargeHistoryClicked(false); 	
	});
	MP_ModalDialog.addModalDialogObject(modalDialog);
	return modalDialog;
};

/**
 * Launches the Full Charge History modal
 */
ChargesO1Component.prototype.handleShowFullHistory = function(){
	//Historical items will already be processed
	var compID = this.getComponentId();
	var chargeHistoryTable = this.getHistoryTable();
	var modalDialog = this.getFullHistoryModal();
	var html = "";

	if (!chargeHistoryTable){
		chargeHistoryTable = this.createHistoryTable(this.convertHistoryMapToArray());
	}
	this.setHistoryTable(chargeHistoryTable);
	
	html +=  "<div class='wf charges-o1-modal'>";
	html +=    chargeHistoryTable.render();
	html +=  "</div>";
	
	this.clearSpinner(compID + "FullHistoryModalbody");
	
	modalDialog.setBodyHTML(html);
	
	chargeHistoryTable.finalize();
	
	this.resizeHistoryTable();
};

/**
 * Stores only the eligible conditions
 * Eligible conditions are those that are placed on the current encounter (This Visit), and have a diagnosis with a
 * target vocabulary of ICD-9/10
 * @param {JSON} reply - reply from the mp_get_conditions script
 */
ChargesO1Component.prototype.processConditions = function(reply){
	var status = reply.getStatus();
	this.setConditionsRetrievedFlag(status); //This lets us know that this script has been called so we don't needlessly call it again.	
	var response = reply.getResponse();
	//Can handle status checking here
	var data;
    var conditionsJSON;
    var conditionList = [];
    var diagnosesList;
    var diagnosis;
    var dLen;
    var j;

	data = response.DATA;
	if (!data){
		return;
	}
    //THIS VISIT CONDITIONS is all we care about
	conditionsJSON = data.THIS_VISIT || [];
	//Grab conditions
	var cLen = conditionsJSON.length;
	var i;

    //Iterate through each condition
	for (i = 0; i < cLen; i++){
        diagnosesList = conditionsJSON[i].DIAGNOSES;

        dLen = diagnosesList.length;

		//Iterate through each diagnosis
        for (j = 0; j < dLen; j++){
            //Order of loop is important, as the first diagnoses should be most recent
            diagnosis = diagnosesList[j];
            //Verify that the target vocab is ICD9 or ICD10
            if (this.isICDCode(diagnosis.TARGET_VOCAB_CD)){
                //Replace the condition's dxlist with this diagnosis and push to array
                conditionsJSON[i].DIAGNOSES = [diagnosis];
                conditionList.push(conditionsJSON[i]);
                break;
            }
        }
	}

	this.setConditionArray(conditionList);
};

/**
 * Container to store modified condition objects
 * This container simplifies certain tasks, such as sorting/retrieving conditions, and transferring conditions from one container to another.
 * There are two containers, associated and unassociated, that are instances of this class.  The Side Pane sections
 * that correspond to associated and unassociated are driven off these containers.
 * @returns {{getConditions: getConditions, getConditionIndexOf: getConditionIndexOf, isEmpty: isEmpty, getLength: getLength, insertConditionAt: insertConditionAt, addCondition: addCondition, clearConditions: clearConditions, removeConditionByHTMLId: removeConditionByHTMLId, removeConditionByNomenId: removeConditionByNomenId, sortByIndex: sortByIndex, sortByPriority: sortByPriority}}
 * @constructor
 */
ChargesO1Component.prototype.ConditionsContainer = function(){ //Yup, a constructor
	var conditionArray = null;
	/**
	 * Removes a condition from the array based on a value and a field
	 */
	var removeConditionByField = function(value, field){
		var cArray = this.getConditions();
		var counter;
		var cLen = cArray.length;
		var index = -1;
		var obj = null;
		//Perform sanity checks
		if (cLen === 0 || (typeof cArray[0][field] === 'undefined' || cArray[0][field] === null)){
			return; //We had no conditions, or the stored objects don't have the required field
		}
		
		//Iterate through items
		for (counter = 0; counter < cLen; counter++){
			obj = cArray[counter];
			if (index !== -1){
				//index was found previously, so shift priority down by one
				obj.PRIORITY--;
			}
			if (obj[field] === value){
				index = counter;
			}
		}
		
		//Object wasn't found, return null
		if (index === -1){
			return null;
		}
		
		//Remove and return found object
		obj = cArray[index];
		cArray.splice(index, 1);
		return obj;			
	};
	
	var sortByField = function(field){
		var cArray = this.getConditions();
		if (cArray.length <= 1){
			return;
		}
		var val = cArray[0][field];
		//Sanity Check
		if (val === 'undefined' || val === null){
			return;
		}
		//Currently only supports number types TODO: support strings
		cArray.sort(function(a, b){
			return a[field] - b[field];
		});
	};
	
	return {
		getConditions: function(){
			if (!conditionArray){
				conditionArray = [];
			}
			return conditionArray;
		},
		
		getConditionIndexOf: function(index){
			var cArray = this.getConditions();
			var cLen = cArray.length;
			if (index < 0 || index >= cLen){
				return null; //Index out of bounds
			}
			return cArray[index];
		},
		
		isEmpty: function(){
			return (this.getLength() === 0);
		},
		
		getLength: function(){
			return this.getConditions().length;
		},
		
		insertConditionAt: function(condition, indx){
			if (!condition){
				return;
			}
			var conditions = this.getConditions();
			var cLen = conditions.length;
			var i;
			if (indx > cLen){  //Prevent out of bounds error by defaulting to add to the end of the array
				indx = cLen;
			}
			//Need to alter priorities
			//Set current condition's priority
			condition.PRIORITY = indx + 1;
			//Change priorities of existing conditions that will be shifted
			for (i = indx; i < cLen; i++){
				conditions[i].PRIORITY += 1;
			}
			//Insert our condition
			conditions.splice(indx, 0, condition);			
		},
		
		addCondition: function(condition){
			if (!condition){
				return;
			}
			condition.PRIORITY = this.getConditions().length + 1;
			this.getConditions().push(condition);
		},
		
		clearConditions: function(){
			conditionArray = [];
		},
		
		removeConditionByHTMLId: function(value){
			return removeConditionByField.apply(this, [value, "HTML_ID"]);
		},
		
		removeConditionByNomenId: function(value){
			return removeConditionByField.apply(this, [value, "NOMEN_ID"]);
		},
		removeConditionByTargetNomenId: function(value){
			return removeConditionByField.apply(this, [value, "TARGET_NOMENCLATURE_ID"]);
		},
		
		sortByIndex: function(){
			sortByField.apply(this, ["INDEX"]);
		},
		
		sortByPriority: function(){
			sortByField.apply(this, ["PRIORITY"]);
		}
		
	};
};

/**
 * Checks if the CPT code exists in the Visit Type table
 * @param {number} code - CPT code to verify
 * @returns {boolean}
 */
ChargesO1Component.prototype.isCPTCodeInTable = function(code){
	var cptCodes = this.getCPTCodesMap();
	if (!cptCodes || cptCodes[code] === null || typeof cptCodes[code] === "undefined"){
		return false;
	}
	
	return true;
};

ChargesO1Component.prototype.getRowIdByIndexObj = function(obj){
	var chargesObj = this.getJSON();
	var cIndex = obj.indexCharge;
	var iIndex = obj.indexItem;
	
	var item = chargesObj.CHARGES[cIndex].CPT_INFO[iIndex];
	
	var rowId = "";
	rowId += this.getChargesTable().getNamespace() + "\\:";
	
	//Check if there is a subcategory
	if (item.Sub_Category){
		rowId += item.Sub_Category.replace(/[\s]/ig, "_").replace(/[\W]/ig, "").toUpperCase() + "\\:";
	}
	rowId += "row" + iIndex;
	
	return rowId;
};

/**
 * Handles key events from within the CPT textbox
 * Filters out non-numeric input, and handles retrieving conditions once the user has submitted the code
 * @param {jQuery Object} jqElement - jQuery object containing the CPT code input element
 * @param {number} code - the key value (identifies which key was pressed)
 */
ChargesO1Component.prototype.cptInputTyping = function(jqElement, code){
    //Filters out any non-numeric values from the input field
	function numericFilter(jqInput){ //Get rid of any non-numeric input
		jqInput.val(jqInput.val().replace(/[^0-9]/ig, ""));
	}
	//Sanity check to ensure we were passed an input element
	if (!jqElement.is("input")){
		return;
	}

	//Apply filter to input field
	numericFilter(jqElement);
	
	//when user signifies end of typing, push to submit
	if (code == 32 || code == 13){ //Enter or Spacebar
		//If the mp_get_conditions script hasn't been called yet, we'll attempt to fetch them
        if (!this.wasConditionsScriptCalled()){
			//Need to retrieve conditions, then trigger our action
			this.fetchConditions(function(){
                //Causes cptInputSubmit to get called
				jqElement.blur();
			});
			this.bindUseThisNcodeAction();
		}
        //We'll skip ahead to cptInputSubmit if mp_get_conditions has returned, otherwise we'll just keep waiting
        else if (this.getConditionsRetrievedStatus()){
			jqElement.blur();
		}
	}	
};

/**
 * Performs validation on CPT code and updates Side Pane
 * @param {jQuery Object} jqElement - jQuery object containing the CPT code input element
 */
ChargesO1Component.prototype.cptInputSubmit = function(jqElement){
	var compID = this.getComponentId();
	if ($("#" + compID + "modifierValue").html() === '&nbsp;') { 		
		//Sets the modified location Id value to 0
		this.setModifiedLocationId(0);
		this.setLocationPopupObj(null);
		//Sets the modified provider Id value to 0
		this.setModifiedProviderId(0);
		this.setProviderPopupObj(null);
	}
    //If conditions haven't been retrieved, retrieve them, then come back to this method
    //This can happen if the user enters a CPT code, but clicks out of the input field instead of hitting enter or space
	if (!this.getConditionsRetrievedStatus()){
		//Need to retrieve conditions
		this.fetchConditions(function(){
			jqElement.blur();
		});
        //Fetching conditions is async, so get out of this function (don't worry, the blur event brings us back)
		return;
	}

	//Filter out any non-numeric pieces (in case of copy-paste)
	jqElement.val(jqElement.val().replace(/[^0-9]/ig, ""));

    var inputText = jqElement.val();
	var iLen = inputText.length;
	
	jqElement.removeClass("charges-o1-focus"); //Removing class so blur event doesn't get triggered again (issue in chrome)
	//1) Check if the CPT code exists in the table
	if (iLen === 5 && this.isCPTCodeInTable(inputText)){
        //2) Update various controls (dropdown, visit type table)
        //indexObj tells us the location in the Visit Type table where the CPT code exists
		var indexObj = this.getCPTCodesMap()[inputText];
        //Update Visit Type dropdown
		$("#" + compID + "ChargeTypeDropDown").val(indexObj.indexCharge);
        //Update the Visit Type table and select the correct row
		this.refreshChargeTable(indexObj.indexCharge);
		$("#" + this.getRowIdByIndexObj(indexObj)).addClass("charges-o1-row-selected selected");

		this.lastSelectedRow = indexObj.indexItem;
		this.setCurrentCPTCode(inputText);

        this.renderDefaultPPInteractiveView();
		
        //The CPT code was valid, so we can hide the alert if it was showing
        this.updateSidePaneInvalidCPTAlert(false);
		var visitType = $("#" + this.getComponentId() + "ChargeTypeDropDown option:selected").attr("cdf_meaning");
		//Sets the currently Selected Visit Type's CDF meaning
		this.setVisitTypeCDFMeaning(visitType);
		// Sets the Last digit of the Current Cpt to Level of service value.
		this.setLevelOfServiceFromCPTCode(parseInt(this.getCurrentCPTCode()));
		//Requests for Recommended E&M nCode.
		this.getNcodeRecommendations();
		this.toggleButtons();
		this.bindUseThisNcodeAction();
	} else {
		//Sets the modified location Id value to 0   
		this.setModifiedLocationId(0);
		this.setLocationPopupObj(null);
		//Sets the modified provider Id value to 0
		this.setModifiedProviderId(0); 
		this.setProviderPopupObj(null);
        //2) null out CPT related variables since we now had an invalid CPT code
		this.lastSelectedRow = null;
        this.setCurrentCPTCode(null);
        //deselect any previously selected rows in the Visit Type table
		$("#" + compID).find(".charges-o1-row-selected").removeClass("charges-o1-row-selected selected");

        //3) Update side pane
		this.renderDefaultPPInitialView();
        //Show the Invalid CPT alert
        this.updateSidePaneInvalidCPTAlert(true);
		this.toggleButtons();
	}
    //Contents of side pane/visit type table may have changed, so resize to keep them in sync
	this.resizeComponentBody();
};

/**
 * Updates the CPT criteria information for the Visit Type table
 * This is the "# of # criteria required" message
 * @param {String} text - CPT criteria informational message
 */
ChargesO1Component.prototype.updateCPTInstructions = function(text){
	var html = "";
	if (text){
		html += "<div class='charges-o1-instruction-lbl-container'>";
		html +=		"<span class='charges-o1-instruction-line-left'>&nbsp;</span>";
		html +=		"<span class='charges-o1-instruction-line-lbl'>" + text + "</span>";
		html +=		"<span class='charges-o1-instruction-line-right'>&nbsp;</span>";
		html +=	"</div>";
	} else {
		html += "&nbsp;";
	}
	$("#" + this.getComponentId() + "CPTTableInstructions").find(".charges-o1-cpt-table-header-instructions").html(html);
};

/**
 * This function will return the row id from the id of DOM element based on the grouping applied on the table.
 */
ChargesO1Component.prototype.getRowId = function(rowObj) {
	var rowId = "";
	var identifiers = $(rowObj).attr("id").split(":");
	identifiers.splice(0,1);
	rowId = identifiers.join(":");
	return rowId;
};


/**
 * Updates the Visit Type table to highlight the selected row
 * Meant for use in the Visit Type table
 * @param {jQuery Object} selRowObj - jQuery object containing the currently selected row
 */
ChargesO1Component.prototype.updateSelRowBgColor = function(selRowObj) {
	this.removeSelRowBgColor();

	$(selRowObj).addClass("charges-o1-row-selected");
};

/**
 * Removes the highlight from the any currently highlighted row in the Visit Type table
 */
ChargesO1Component.prototype.removeSelRowBgColor = function() {
	var tableViewObj = $("#charges" +this.getComponentId() + "table");
	var prevRow = tableViewObj.find(".charges-o1-row-selected");

	// Remove the background color of previous selected row.
    prevRow.removeClass("charges-o1-row-selected");
    prevRow.removeClass("charges-o1-row-selected-init");
};

/*
 ** Based on the selected row, reading pane will be refresh with data and selected row will be updated as well.
 * If the user select the same row again, rendering  will be stopped.
 */
ChargesO1Component.prototype.updateInfo = function(selRow) {
	var rowId = this.getRowId(selRow);
	
	this.updateSelRowBgColor(selRow);

	// Update the lastSelectedRow value with index.
	this.lastSelectedRow = rowId;
};

/**
 * Converts the CPT Entry text to an input field
 * @param {jQuery Object} jqElement - The CPT code entry text element
 */
ChargesO1Component.prototype.renderCPTInput = function(jqElement){
	var compID = this.getComponentId();
	var text = jqElement.text();
	text = text.replace(/[^0-9]/ig, "");
	html = "<input id='" + compID + "CPTInput' class='charges-o1-focus' type='text' maxLength='5' size='5' value='" + text + "' />";
	jqElement.closest('.charges-o1-rp-cpt-val-cont').html(html);
	$("#" + compID + "CPTInput").focus();
};

/**
 * Handles events triggered by user interaction within the Side Pane
 */
ChargesO1Component.prototype.bindSidePaneActions = function(){
	var compID = this.getComponentId();
	var self = this;
	
	/**
	 * Takes an event and routes to an action based on the class of the target element
	 * @param {event} event - event that was triggered
	 */
	function routeTask(event){
		if (!event){
			return;
		}
		
		var jqSrcElement = $(event.target);
		var jqTarget = $(event.currentTarget);
		var type = event.type;
		var code = event.keyCode;
		
		/*
		 * Modify Button click
		 */
		if (type === 'click' && jqSrcElement.prop('id') === compID + "RPModifyBtn" && !jqSrcElement.is(':disabled')){
			//TODO: Not done for initial client release
		} 
		/*
		 * Unassigned Diagnosis change 
		 */
		else if (type === 'change' && jqTarget.hasClass("charges-o1-rp-diag-unassigned")){
			self.associateDiagnosis(jqTarget);
		}
		/*
		 * Assigned Diagnosis change
		 */
		else if (type === 'change' && jqTarget.hasClass("charges-o1-rp-diag-assigned")){
			self.unassociateDiagnosis(jqTarget);
			if (self.getAssociatedConditionsObj()
				.getLength() === 0) {
				$("#" + compID + "RPSubmitBtn")
					.addClass("disabled");
			}
		}
		/*
		 * CPT Val click (Activates input field)
		 */
		else if (type === 'click' && jqSrcElement.hasClass("charges-o1-rp-cpt-val")){
			self.renderCPTInput(jqSrcElement);
		}
		/*
		 * CPT Input keyup (field validation/submit)
		 */
		else if (type === 'keyup' && jqTarget.prop("id") === compID + "CPTInput"){
			self.cptInputTyping(jqTarget, code);
		}
		/*
		 * CPT Input blur
		 */
		else if (type === 'focusout' && jqTarget.prop("id") === compID + "CPTInput"){
			self.cptInputSubmit(jqTarget);
		}
		/*
		 * Show History Link Toggle Click
		 */
		else if (type === 'click' && jqTarget.prop("id") === compID + "ToggleHistoricalTable"){
			//First, ensure modal is built
			self.setShowChargeHistoryClicked(true);  
			var modalDialog = self.getFullHistoryModal();
			if (!modalDialog){
				modalDialog = self.createHistoryModal();
				self.setFullHistoryModal(modalDialog);
			}
			//Show modal
			MP_ModalDialog.showModalDialog(modalDialog.getId());
			//Show spinner
			$("#" + modalDialog.getBodyElementId()).addClass("charges-o1-history-modal-body");
			self.loadSpinner(modalDialog.getBodyElementId());
			self.fetchFullChargeHistory();
		}
		/*
		 * Make Primary Click
		 */
		else if (type === 'click' && jqSrcElement.hasClass("charges-o1-diag-secondary")){
			//Need to get parent's parent
			self.makeDiagnosisPrimary(jqSrcElement.parent().parent()); //TODO: Rethink this logic, hate DOM dependent logic
			self.refreshDiagnosesSection();
            self.updateSidePanePrimaryDiagnosisAlert();
			self.toggleButtons();
		}
        /*
        Show Charge History (click)
         */
        else if (type === 'click' && jqSrcElement.hasClass("charges-o1-show-history-link")){
            var modalDialog = self.getFullHistoryModal();
            if (!modalDialog){
                modalDialog = self.createHistoryModal();
                self.setFullHistoryModal(modalDialog);
            }
            //Show modal
            MP_ModalDialog.showModalDialog(modalDialog.getId());
            //Show spinner
            $("#" + modalDialog.getBodyElementId()).addClass("charges-o1-history-modal-body");
            self.loadSpinner(modalDialog.getBodyElementId());
            self.fetchFullChargeHistory();
        }
	}
	
	//Bind listener for mouse click events
	var jqPP = $("#" + compID + "SidePaneContainer");
	jqPP.on("click", ".charges-o1-rp-mod-root-cont", function(event){
		routeTask(event);		
	});

    //Bind input field listeners
	jqPP.on("blur", "input", function(event){
		routeTask(event);
	});
	jqPP.on("keyup", "input", function(event){
		routeTask(event);
	});

    //Bind listeners for diagnoses checkbox change
	jqPP.on("change", ".charges-o1-rp-diag-unassigned", function(event){
		routeTask(event);
	});
	jqPP.on("change", ".charges-o1-rp-diag-assigned", function(event){
		routeTask(event);
	});
	
	// Bind listeners for add modifier.
	jqPP.on("click", "#" + compID + "modifierValue", function(event) {
		routeTask(event);
	});
	var jqHistoryContainer = $("#" + compID + "HistoryContainer");
	jqHistoryContainer.on("click", "#" + compID + "ToggleHistoricalTable", function(event){
		routeTask(event);
	});	
	
	jqPP.on("click", "#" + compID + "providerName", function () {
		self.modifyProvider();
	});
	jqPP.on("click", "#" + compID + "locationName", function () {
		self.modifyLocation();
	});
};

/**
 * Return saved modifier for selected CPT code
 * @param {null}
 * @returns {number} - Value of selected modifier.
 */
ChargesO1Component.prototype.getSelectedModifier = function() {

	return this.m_selectedModifier;
};

/**
 * Set selected modifier for a particular CPT code.
 * @param {number} - Value of selected modifier.
 * @returns {null}
 */
ChargesO1Component.prototype.setSelectedModifier = function(selectedModifier) {
	var self = this;
	var $modifierValue = $("#" + this.getComponentId() + "modifierValue");
	
	if (typeof selectedModifier === "undefined" || selectedModifier === null) {
	
		// Reset modifier value.
		this.m_selectedModifier = 0;		
		$modifierValue.html("--");
		throw new Error("Invalid selectedModifier passed to 'setSelectedModifier'");
	}

	this.m_selectedModifier = selectedModifier;
	// Update the modifier value display in side panel.
	$modifierValue.html((selectedModifier === 0) ? self.getCurrentCPTCode() === null ? "&nbsp;" : "--" : selectedModifier);
};

/**
 * Create  and display Popover UI control for modifiers.
 * @param {null}
 * @returns {null}
 */ 
ChargesO1Component.prototype.addModifier = function() {
	var self = this;
	var compId = self.getComponentId();
	var modifiersPopup = null;
	var chargesi18n = i18n.discernabu.charges_o1;	
	var chargesAddModifierTimer = new CapabilityTimer("CAP:MPG_Charges-o1_Add_Modifier",self.getCriterion().category_mean);
	if (chargesAddModifierTimer) {		
		chargesAddModifierTimer.capture();
	}
	//Checks whether popup object is already present, if not it will be created and configured.
	//creates the popup object
	modifiersPopup = new MPageUI.Popup();
	//Stores the popup object for further changes
	self.setPopupObj(modifiersPopup);
	//sets the destroy methodology to false
	//modifiersPopup.setDestroyOnHide(false);
	//sets the Popup header
	modifiersPopup.setHeader(chargesi18n.ADD_MODIFIER);
	//sets the anchor to open the popover UI when clicked on the anchor
	modifiersPopup.setAnchorId(compId + "modifierValue");
	//sets the popover UI width to MEDIUM
	modifiersPopup.setWidth(MPageUI.POPUP_OPTIONS.WIDTH.MEDIUM);
	//sets the Position of Popover to appear on LEFT side of an anchor
	modifiersPopup.setPosition(MPageUI.POPUP_OPTIONS.POSITION.BOTTOM_RIGHT);		
	//set the HTML contents of Popover UI
	modifiersPopup.setBodyContent(self.getModifiersContent());
};

/**
 * Creates the content(List) of modifiers as an HTML and returns value as HTML.
 * @param {null}
 * @returns {HTML}
 */ 
ChargesO1Component.prototype.getModifiersContent = function() {
	var self = this;
	var compId = self.getComponentId();
	var modifiersMenuHtml = "";
	var chargesi18n = i18n.discernabu.charges_o1;
	// Get the last selected modifiers for selected CPT if any.
	var lastSelectedModifier = self.getSelectedModifier();

	// Array to store modifier value and description.
	// This array will be cross checked with an array of last selected modifier value to set the 'checked' attribute.
	var modifiersArray = [{
				VALUE: 24,
				DESCRIPTION: chargesi18n.UNRELATED_E_M_SERVICE_MODIFIER
			}, {
				VALUE: 25,
				DESCRIPTION: chargesi18n.SIGNIFICANT_MODIFIER
			}, {
				VALUE: 57,
				DESCRIPTION: chargesi18n.DECISION_FOR_SURGERY_MODIFIER
			}, {
				VALUE: "GC",
				DESCRIPTION: "GC- "+chargesi18n.RESIDENT_INVOLVEMENT
			}, {
				VALUE: "AI",
				DESCRIPTION: "AI- "+chargesi18n.ADMITTING_SERVICE
			}];

	// Menu item container html.
	modifiersMenuHtml = "<div id='modifiersMenuItems" + compId + "'>";

	// Loop through each modifier value and check whether it's already selected or not.
	for (var index = 0; index < modifiersArray.length; index++) {
		var modifier = modifiersArray[index];
		var modifierValue = modifier.VALUE;
		
		// If the modifier had been selected, display the 'checked' image for default selection else hide it.
		var selectedClass = (lastSelectedModifier == modifierValue) ? "selected" : "";

		// html for each modifier menu item.
		modifiersMenuHtml += "<div class='charges-o1-modifier-menu-item' data-modifier-value ='" + modifierValue + "'>" +
							 "<span class='charges-o1-modifier-menu-selection " + selectedClass + "'>&nbsp;</span>" + 
							 "<span class='charges-o1-modifier-description'>" + modifier.DESCRIPTION + "</span>" + 
							 "</div>";
	}

	modifiersMenuHtml += "</div>";

	return modifiersMenuHtml;
};

/*
 * Create and display Popover for providers.
 * @param {null}
 * @returns {null}
 */
ChargesO1Component.prototype.modifyProvider = function () {
	var component = this;
	var compId = component.getComponentId();
	var providersMenuId = compId + "providersMenu";
	var providersMenu = component.getProviderPopupObj();	
	var chargesi18n = i18n.discernabu.charges_o1;	
	var timeControl = null;
	var chargesModifyProviderTimer = new CapabilityTimer("CAP:MPG_Charges-o1_Modify_Provider",component.getCriterion().category_mean);
	if (chargesModifyProviderTimer) {		
		chargesModifyProviderTimer.capture();
	}	
	if (!providersMenu) {
		providersMenu = new MPageUI.Popup();
		component.setProviderPopupObj(providersMenu);
		providersMenu.setAnchorId(compId + "providerName");
		providersMenu.setPosition(MPageUI.POPUP_OPTIONS.POSITION.BOTTOM_RIGHT);
		providersMenu.setHeader(chargesi18n.MODIFY_PROVIDER);
		providersMenu.setWidth(242);
	}
	providersMenu.setBodyContent("<div id='providersMenuItems" + compId + "' class='section charges-o1-providers-menu'><div id='autosearch-" + compId + "' class='charges-o1-search'>" + MP_Util.CreateAutoSuggestBoxHtml(component) + "</div></div>");
	providersMenu.show();
	timeControl = setTimeout(
		function(){
			if(component.getProviderPopupObj() && component.getProviderPopupObj().isOpen()){
				component.getProviderPopupObj().hide();
			}
		},
		4000
	);
	$("#providersMenuItems" + compId).unbind("mouseenter");
	$("#providersMenuItems" + compId).on("mouseenter", function(){
		if(component.getProviderPopupObj() && component.getProviderPopupObj().isOpen()){
			clearInterval(timeControl);
		}
	});
	$("#providersMenuItems" + compId).unbind("mouseleave");
	$("#providersMenuItems" + compId).on("mouseleave", function(){
		if(component.getProviderPopupObj() && component.getProviderPopupObj().isOpen()){
			component.getProviderPopupObj().hide();
		}
	});
	MP_Util.AddAutoSuggestControl(component, component.searchProviders,component.handleSelection,component.createSuggestionLine);
	//Modify provider window will focus to the search field when it opens.
	if(component.getProviderPopupObj().isOpen()){
		$(".charges-o1-search .search-box").focus();
	}	
}; 
/**
* Search the providers and create auto suggestion drop down menu based on the input characters entered by the user.
* @param {function} callback - Callback is given component as a scope
* @param {DOM Element} textBox - Text box DOM information
* @param {MPageComponent} component - component object for which the script is being called.
* @returns {null}
*/
ChargesO1Component.prototype.searchProviders = function (callback, textBox, component) {	
	try {
		var compID = component.getComponentId();
		var compNS = component.getStyles().getNameSpace();
		var criterion = component.getCriterion();
		var searchText = textBox.value.replace(/(^\s+|\s+$)/g,'');
		var organizationId = this.component.getOrganizationId();		
		if (searchText.length < 3) {
			return;
		}
		var splittedName = searchText.split(",");
		var lastName = splittedName[0];
		var firstName = splittedName.length > 1 ? splittedName[1] : "";					  
		var request = new ScriptRequest();
		request.setName("Charges Providers Request");
		request.setProgramName("MP_GET_CHARGES_PERSONAL_INFO");
		request.setParameterArray(["^MINE^",criterion.provider_id+".00" ,"^" + lastName + "^", "^" + firstName + "^",5,1,organizationId+".00"]);
		request.setAsyncIndicator(true);		
		request.setResponseHandler(function(scriptReply){			
			if (scriptReply.getStatus() === "S") {
				var recordData = scriptReply.getResponse();				
				callback.autosuggest(recordData.PRSNL);				
			}			
		});
		request.performRequest();
	} catch (err) {
		MP_Util.LogJSError(err, component, "charges-o1.js", "searchProviders");
	}
};
/*
* Store the selected provider name & provider id and display the selected provider name in the side panel.
* @param {object} suggestionObj - the object containing the providers information
* @param {DOM Element} textBox - Text box DOM information
* @param {MPageComponent} component  - component object for which the script is being called.
* @returns {null}
*/
ChargesO1Component.prototype.handleSelection = function (suggestionObj, textBox, component) {	
	if (!suggestionObj) {
		return;
	}
	var providerName = suggestionObj.NAME_FULL_FORMATTED;
	var providerId = suggestionObj.PERSON_ID;
	var self = this;
	if (providerName && providerId) {
		this.component.setModifiedProviderId(providerId);
		$("#" + this.component.getComponentId() + "providerName").html(providerName);
		setTimeout(
		  function(){
			self.component.getProviderPopupObj().hide();
		  },
		  200
		);
	}
};

/*Highlight the search text in auto suggest drop down list.
* @param {object} suggestionObj - the object containing the providers information
* @param {string} searchVal - Entered search text in auto suggest control  
* @returns {Array} - provider names with highlighted search text  
*/
ChargesO1Component.prototype.createSuggestionLine = function (suggestionObj, searchVal) {
	return this.component.highlightValue(suggestionObj.NAME_FULL_FORMATTED, searchVal);
};

/*Highlight the search text in auto suggest drop down list.
* @param {string} inString - provider name which is coming from back-end call.
* @param {string} term - Entered search text in auto suggest control 
* @returns {string} - provider name with highlighted search text  
*/
ChargesO1Component.prototype.highlightValue = function (inString, term) {
	return "<strong >" + inString.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1").split(" ").join("|") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "</strong><strong class='charges-o1-highlight'>$1</strong><strong>") + "</strong>";
};

/*
 * Create and display advance filter menu for locations.
 * @param {null}
 * @returns {null}
 */
ChargesO1Component.prototype.modifyLocation = function () {
	var self = this;
	var compId = self.getComponentId();
	var locationMenuId = compId + "locationName";
	var locationMenu = self.getLocationPopupObj();
	var chargesi18n = i18n.discernabu.charges_o1;
	var chargesModifyLocationTimer = new CapabilityTimer("CAP:MPG_Charges-o1_Modify_Location", self.getCriterion().category_mean);
	if (chargesModifyLocationTimer) {
		chargesModifyLocationTimer.capture();
	}
	if (!locationMenu) {
		locationMenu = new MPageUI.Popup();
		self.setLocationPopupObj(locationMenu);
		locationMenu.setAnchorId(locationMenuId);
		locationMenu.setPosition(MPageUI.POPUP_OPTIONS.POSITION.BOTTOM_RIGHT);
		locationMenu.setHeader(chargesi18n.MODIFY_LOCATION);
		locationMenu.setWidth(MPageUI.POPUP_OPTIONS.WIDTH.SMALL);
	}
	var locationPopupContent = self.getLocationContent();
	locationMenu.setBodyContent(locationPopupContent);
	locationMenu.toggle();
	$("#locationMenuItems" + compId).unbind("click");
	$("#locationMenuItems" + compId).on("click", ".charges-o1-location-menu-item", function (event) {
		var currentSelectedLocationId = $(this).data("location-value");
		var currentSelectedLocationDesc = $(this).data("location-description");
		var previousSelectedLocationId = 0;
		// check location id has been modified or not.
		if (self.getModifiedLocationId()) {
			previousSelectedLocationId = self.getModifiedLocationId();
		} else if(self.getDefaultLocationSettings()){
			previousSelectedLocationId = self.getDefaultLocationSettings().LOCATION_CD;
		}
		if (currentSelectedLocationId && currentSelectedLocationDesc){
			var $locationValue = $("#" + compId + "locationName");
			if (previousSelectedLocationId === currentSelectedLocationId){
				//Set location Id = -1 when Deselect all patient locations in the location's menu.
				self.setModifiedLocationId(-1);
				//Display -- html in the side panel when Deselect all patient locations in the location's menu.
				$locationValue.html("--");
			} else {
				self.setModifiedLocationId(currentSelectedLocationId);
				$locationValue.html(currentSelectedLocationDesc);
			}
		}
		locationMenu.toggle();
	});
	var timeControl = setTimeout(
		function(){
			if(self.getLocationPopupObj() && self.getLocationPopupObj().isOpen()){
				self.getLocationPopupObj().hide();
			}
		},
		4000
	);
	$("#locationMenuItems" + compId).unbind("mouseenter");
	$("#locationMenuItems" + compId).on("mouseenter", function(){
		if(self.getLocationPopupObj() && self.getLocationPopupObj().isOpen()){
			clearInterval(timeControl);
		}
	});
	$("#locationMenuItems" + compId).unbind("mouseleave");
	$("#locationMenuItems" + compId).on("mouseleave", function(){
		if(self.getLocationPopupObj() && self.getLocationPopupObj().isOpen()){
			self.getLocationPopupObj().hide();
		}
	});
};
/**
 * Returns the Location list of a particular facility to which the patient is admitted.
 * @returns{HTML} 
 */
ChargesO1Component.prototype.getLocationContent = function () {
	var self = this;
	var compId = self.getComponentId();
	var locationMenuHtml = "";
	var patientLocationsArray = self.getPatientLocations();			
	var patientLocationsArrayLength = (patientLocationsArray && patientLocationsArray.length)?patientLocationsArray.length:0; 
	var previousSelectedLocationId = 0;
	// check location id has been modified or not
	if (self.getModifiedLocationId()) {
		previousSelectedLocationId = self.getModifiedLocationId();
	} else if (self.getDefaultLocationSettings()) {
		previousSelectedLocationId = self.getDefaultLocationSettings().LOCATION_CD;
	}
	locationMenuHtml = "<div id='locationMenuItems" + compId + "' class='charges-o1-location-menu-main-div'>";
	for (var index = 0; index < patientLocationsArrayLength; index++) {
		var locationId = patientLocationsArray[index].LOCATION_ID;
		var locationDisplay = (patientLocationsArray[index].LOCATION_DISPLAY).replace(/(^\s+|\s+$)/g,'');
		locationDisplay = locationDisplay.replace(/'/g, '&#39;');
		var selectedClass = (previousSelectedLocationId === locationId) ? "selected" : "";
		if (locationId && locationDisplay) {
			locationMenuHtml += "<div class='charges-o1-location-menu-item' data-location-value ='" + locationId + "' data-location-description ='" + locationDisplay + "'><span class='charges-o1-location-menu-selection " + selectedClass + "'>&nbsp;</span><span class='charges-o1-location-description'>" + locationDisplay + "</span></div>";
		}
	}
	locationMenuHtml += "</div>";
	return locationMenuHtml;
};

/**
 * Retrieves the full charge history and displays the full charge history modal
 */
ChargesO1Component.prototype.fetchFullChargeHistory = function(){
	var self = this;
	var MS_IN_DAY = 86400000;  //Const: # of ms in a day
	var dateFormatter = MP_Util.GetDateFormatter();
	var fullDate4Year = mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR;
	var chargeHistoryMap = this.getChargeHistoryMap();
	var dateKey; //date 'key' for chargeHistoryMap
	var currentDate = new Date();
	var encntrStartDate = this.m_encounterStartDate;  //Based on encounter admit date, we have this after the first time retrieving history
	var workingDate = null;
	var cclStartDate = null;
	var cclEndDate = null;

	function showFullHistory(){
        //Launches the full history modal
		self.handleShowFullHistory();
	}

    //Check that we have the encounter start date (shouldn't be possible not to have this)
	if (!encntrStartDate){
		//Won't be able to determine a date range, so grab everything
		this.cclGetChargesHistory(showFullHistory); //Will include callback
		return;
	}

    //We already have historical charge data for some dates stored, so we're going to figure out
    //what the smallest date range that includes all our missing dates it.

	//Start with encounterStartDate
	workingDate = new Date(encntrStartDate);
	workingDate.setHours(12,0,0,0);
	currentDate.setHours(12,0,0,0);
	while (workingDate <= currentDate){
		//get the 'key' string version of working date
		dateKey = dateFormatter.format(workingDate, fullDate4Year);
		//Check if the key exists in the map already
		if (!chargeHistoryMap[dateKey]){
			//We found the missing data-point, so set cclStartDate to this
			cclStartDate = new Date(workingDate);
			break; //Get out of the loop
		}
		//We haven't found the missing data-point, so increment date by 1 day and repeat
		workingDate = new Date(Date.parse(workingDate) + MS_IN_DAY);
	}
	//if cclStartDate wasn't found, then all the dates are covered and we don't need to make a CCL call
	if (!cclStartDate){
        showFullHistory();
		return;
	}
	//Get cclEndDate
	workingDate = new Date(currentDate);
	workingDate.setHours(12,0,0,0);
	while (workingDate >= encntrStartDate){
		dateKey = dateFormatter.format(workingDate, fullDate4Year);
		if (!chargeHistoryMap[dateKey]){
			cclEndDate = new Date(workingDate);
			break;
		}
		workingDate = new Date(Date.parse(workingDate) - MS_IN_DAY);
	}
	
	this.cclGetChargesHistory(showFullHistory, cclStartDate, cclEndDate);
};

/**
 * Retrieves the historical charges for a specific date
 * Most often used after submitting a charge to update our history
 * @param {Date} selectedDate - Date to fetch historical charge history for
 * @param {number} noteID - Note EVENT_ID that was previously charged.
 */
ChargesO1Component.prototype.fetchSpecificDayHistoricalCharges = function(selectedDate,noteID){
	//This method will ALWAYS retrieve the charges for the selected date, regardless of
	//if it has been retrieved before.  Expected use case is after submitting a charge
	var self = this;
	var compID = this.getComponentId();
	

    //Updates the rolling history table around the specific day
	function updateRollingHistory(){
		//Get list of rolling history items
		var rollingHistoryArray = self.getRollingHistoryArray();
		var rhaLen = rollingHistoryArray.length;
		var pastDate = rollingHistoryArray[rhaLen-1].DATE_OBJ;
		var futureDate = rollingHistoryArray[0].DATE_OBJ;
		var rollingHistoryList = self.retrieveHistoryItems(pastDate, futureDate);
		
		//Build rolling history table
		var rollingHistoryTable = self.buildRollingHistoryTable(rollingHistoryList, selectedDate);
		//Get rolling history container
		var jqRollingHistoryCont = $("#" + self.getComponentId() + "RollingHistoryContainer");
		//Rebuild and finalize table
		if (jqRollingHistoryCont.length > 0){
			jqRollingHistoryCont.html(rollingHistoryTable.buildTable());
			rollingHistoryTable.finalizeTable();
		}
		self.clearSpinner(compID + "Container");
		//Once table has been rendered, update the associated note.
		self.updateAssociatedNote(noteID);
	}
	if (!selectedDate){
		throw new Error("No date passed into 'fetchSpecificDayHistoricalCharges'");
	}

	this.cclGetChargesHistory(updateRollingHistory, selectedDate, selectedDate);

 
};
ChargesO1Component.prototype.clearSpinner = function(resultContainerID){
	if (resultContainerID && typeof resultContainerID === "string"){
		$("#" + resultContainerID).children(".loading-screen").remove();
	 }
};
/**
 * Retrieves the historical charges for the past N days
 * Should only be run the first time component is loaded
 * @param {number} numOfDays - <integer> number of days to retrieve historical charges from
 */
ChargesO1Component.prototype.fetchRecentNDaysHistoricalCharges = function(numOfDays){
	var self = this;
	var compID = this.getComponentId();
	var MS_IN_DAY = 86400000;  //Const: # of ms in a day
	var currentDate = new Date();
	var cclStartDate = null;
	var cclEndDate = null;
	
	currentDate.setHours(12,0,0,0);
	
	//Likely won't have 
	cclEndDate = new Date(currentDate);
	cclStartDate = new Date(Date.parse(currentDate) - ((numOfDays-1) * MS_IN_DAY));
	
	self.loadSpinner(compID + "Container");
	this.cclScriptInit(renderComponentBody, cclStartDate, cclEndDate);
	/*
	 * Callback needs to do the following:
	 * Get the data for the rolling history table.
	 * This will be special in that we need to do a check based on the encounter start date
	 */
	function renderComponentBody(){
		//Render component
		self.renderComponent(self.getJSON());
		//Get list of rolling history items
		var rollingHistoryList = self.retrieveHistoryItems(cclStartDate, cclEndDate);
		self.setRollingHistoryArray(rollingHistoryList);
		//Build rolling history table
		var rollingHistoryTable = self.buildRollingHistoryTable(rollingHistoryList);
		//Get rolling history container
		var jqRollingHistoryCont = $("#" + self.getComponentId() + "RollingHistoryContainer");
		//Rebuild and finalize table
		if (jqRollingHistoryCont.length > 0){
			jqRollingHistoryCont.html(rollingHistoryTable.buildTable());
			rollingHistoryTable.finalizeTable();
		}
		self.resizeComponentBody();
		self.clearSpinner(compID + "Container");
	}
};

/**
 * Retrieves historical charges for N days surrounding and including the selected date
 * @param {number} numOfDays - <integer> number of days to retrieve historical charges from
 * @param {Date} selectedDate - Selected date
 */
ChargesO1Component.prototype.fetchRelevantHistoricalCharges = function(numOfDays, selectedDate){
	var self = this;
	var compID = this.getComponentId();
	var MS_IN_DAY = 86400000;  //Const: # of ms in a day
	var dateFormatter = MP_Util.GetDateFormatter();
	var fullDate4Year = mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR;
	var chargeHistoryMap = this.getChargeHistoryMap();
	var dateKey; //date 'key' for chargeHistoryMap
	var currentDate = new Date();
	var encntrStartDate = this.m_encounterStartDate;  //Based on encounter admit date, we have this after the first time retrieving history
	var workingDate = null;
	var cclStartDate = null;
	var cclEndDate = null;
	var tableStartDate = null;
	var tableEndDate = null;
	var numPastDays = 0;
	var numFutureDays = 0;
	var i;
	
	currentDate.setHours(12,0,0,0);

    //Calculates the number of days within a date range
	function calculateDaysDelta(pastDate, futureDate){
		return Math.floor((futureDate - pastDate) / MS_IN_DAY);  //Floor takes care of differences due to timezones
	}
	
	/**
	 * Sets the cclStart/End dates, as well as the table start/end dates
	 * @param {number} numPastDays - number of days to look in the past
	 * @param {number} numFutureDays - number of days to look in the future (from selected date)
	 * @param {Date} dateObj - Selected date
	 */
	function setDatesBasedOnEmptyContig(numPastDays, numFutureDays, dateObj){
		var i;
		cclStartDate = null;
		cclEndDate = null;
		//Get the start dates
		tableStartDate = new Date(Date.parse(dateObj) + (-1 * numPastDays * MS_IN_DAY));
		for (i = (-1 * numPastDays); i <= numFutureDays; i++){
			workingDate = new Date(Date.parse(dateObj) + (i * MS_IN_DAY));
			dateKey = dateFormatter.format(workingDate, fullDate4Year);
			//If date is missing in chargeHistoryMap, then we found our startDate!
			if (!chargeHistoryMap[dateKey]){
				cclStartDate = new Date(workingDate);
				break; //Start date found so break out!
			}
		}
		//Get the end dates
		tableEndDate = new Date(Date.parse(dateObj) + (numFutureDays * MS_IN_DAY));
		
		//If cclStartDate not found, we can assume everything was cached!
		if (!cclStartDate){
			return; 
		}
		for (i = numFutureDays; i >= (-1 * numPastDays); i--){
			workingDate = new Date(Date.parse(dateObj) + (i * MS_IN_DAY));
			dateKey = dateFormatter.format(workingDate, fullDate4Year);
			//If date is missing in chargeHistoryMap, then we found our startDate!
			if (!chargeHistoryMap[dateKey]){
				cclEndDate = new Date(workingDate);
				break; //End date found so break out!
			}
		}	
	}
	
	/*
	 * So here's our scenario:
	 * In the rolling history table, user went to the calendar and picked a new date.
	 * We will need to grab a range as close to 'numOfDays' (7) as possible
	 */
	//Calculate number of days in the past/future of selected date
	numPastDays = calculateDaysDelta(encntrStartDate, selectedDate);
	numFutureDays = calculateDaysDelta(selectedDate, currentDate);
	
	//In this scenario, we likely already have all the data cached
	if ((numPastDays + numFutureDays) <= (numOfDays - 1)){
		setDatesBasedOnEmptyContig(numPastDays, numFutureDays, selectedDate);
	} else if (numPastDays >= 3 && numFutureDays >= 3){
		setDatesBasedOnEmptyContig(3, 3, selectedDate);
	} else if (numPastDays >= (numOfDays - 1)){
		setDatesBasedOnEmptyContig((numOfDays-1), 0, selectedDate);
	} else {
		setDatesBasedOnEmptyContig(numPastDays, (numOfDays-1)-numPastDays, selectedDate);
	}
	
	self.loadSpinner(compID + "Container");
    //If there isn't a cclStartDate, then we already have our history and can call the callback immediately
	if (cclStartDate){
		this.cclGetChargesHistory(updateRollingHistory, cclStartDate, cclEndDate);
	} else {
        updateRollingHistory();
	}
	/*
	 * Callback needs to do the following:
	 * Get the data for the rolling history table.
	 * This will be special in that we need to do a check based on the encounter start date
	 */
	function updateRollingHistory(){
		//Get list of rolling history items
		var rollingHistoryList = self.retrieveHistoryItems(tableStartDate, tableEndDate);
		self.setRollingHistoryArray(rollingHistoryList);
		//Build rolling history table
		var rollingHistoryTable = self.buildRollingHistoryTable(rollingHistoryList, selectedDate);
		//Get rolling history container
		var jqRollingHistoryCont = $("#" + self.getComponentId() + "RollingHistoryContainer");
		//Rebuild and finalize table
		if (jqRollingHistoryCont.length > 0){
			jqRollingHistoryCont.html(rollingHistoryTable.buildTable());
			rollingHistoryTable.finalizeTable();
		}
		self.clearSpinner(compID + "Container");
	}
};

/**
 * Determines what dates to retrieve historical charges by and updates component ui
 * @param {number} numOfDays - (optional) The number of days to retrieve historical charges for
 * @param {Date} selectedDate - (optional) The selected date
 */
ChargesO1Component.prototype.fetchHistoricalCharges = function(numOfDays, selectedDate){	
	//no parameters passed in, so get the full history
	try{
		if (!numOfDays && !selectedDate){
		this.fetchFullChargeHistory();
	} else if (numOfDays && !selectedDate){ //This should always be the path on initial load
		//We'll grab the most recent X (numOfDays) days of historical data
		this.fetchRecentNDaysHistoricalCharges(numOfDays);
	} else {
		numOfDays = numOfDays || 7;  //Set default
		this.fetchRelevantHistoricalCharges(numOfDays, selectedDate);
	}
	}catch(error){
		throw (error);
	}
	
};

/**
 * Fills out the charge history map over a date range
 * Called within processHistoricalCharges and allows us to keep track of which dates charges have
 * already been retrieved.
 * @param {Date} startDate - Earliest date in date range
 * @param {Date} endDate - Latest date in date range
 */
ChargesO1Component.prototype.primeChargeHistoryMapByDateRange = function(startDate, endDate){
	var chargeHistoryMap = this.getChargeHistoryMap();
	var MS_IN_DAY = 86400000;  //Const: # of ms in a day
	var dateTime = null;
	var dateKey = "";
	var dateFormatter = MP_Util.GetDateFormatter();
	var fullDate4Year = mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR;
	var numOfDays = 0;
	var i;

    //Calculates the number of days within a date range
	function calculateDaysDelta(pastDate, futureDate){
		return Math.floor((Date.parse(futureDate) - Date.parse(pastDate)) / MS_IN_DAY);  //Floor takes care of differences due to timezones
	}
	
	//Sanity checks
	if (!startDate || !endDate){
		return;
	}
	
	if (startDate > endDate){
		return;
	}

	//First need to get the # of days between the start and end dates
	numOfDays = calculateDaysDelta(startDate, endDate);
	
	//Iterate through the range of dates and clear out charge history map for those dates
	for (i = 0; i <= numOfDays; i++){
		//Generate the key for the chargeHistoryMap
		dateTime = new Date(Date.parse(startDate) + (i * MS_IN_DAY));
		dateKey = dateFormatter.format(dateTime, fullDate4Year);
		
		chargeHistoryMap[dateKey] = [];
	}
};

/**
 * Processes Historical Charges
 * Stores historical charges in charge map, and sets fields for ease of use in our UI
 * Dates need to be set unless grabbing the full history
 * @param {JSON} charges - Historical Charges JSON from reply
 * @param {Date} startDate - (optional) Earliest date for processing charges
 * @param {Date} endDate - (optional) Latest date for processing charges
 */
ChargesO1Component.prototype.processHistoricalCharges = function(charges, startDate, endDate){
	var compID = this.getComponentId();
	var chargeHistoryMap  = this.getChargeHistoryMap();
	var dateStr = "";
	var dateTime = new Date();
	var dateFormatter = MP_Util.GetDateFormatter();
	var chargesLen = charges.length;
	var diagnoses;
	var diagnosesLen;
	var i;
	var j;
	//if startDate/endDate aren't defined, set start/end dates
	if (!startDate){
		startDate = this.m_encounterStartDate;
	}
	if (!endDate){
		endDate = new Date();
		endDate.setHours(12,0,0,0);
	}
	
	//Reverse charges so dates are descending
	charges.reverse(); //See about getting this change made in CCL
	
	//Prepare chargeHistoryMap for insertion
	this.primeChargeHistoryMapByDateRange(startDate, endDate);
	
	for (i = 0; i < chargesLen; i++){
		var charge = charges[i];
		charge.SVC_DATE = "";
		charge.PRIMARY_DIAG_STRING = "";
		charge.DOCUMENT = "";
		if (charge.DOC_NAME) {
			charge.DOCUMENT = charge.DOC_NAME;
		}
		//Update primary diagnosis
		diagnoses = charge.DIAGNOSES;
		diagnosesLen = (diagnoses ? diagnoses.length : 0);
		for (j = 0; j < diagnosesLen; j++){
			var diagnosis = diagnoses[j];
			if (diagnosis.INDEX === 1){
				charge.PRIMARY_DIAG_STRING = diagnosis.ALIAS;
				break; //Primary diagnosis found, so break out of the loop
			}
		}
		//Update SVC_DATE string and add charge to chargeHistoryMap
		if (charge.SERVICE_DATE){
			dateTime.setISO8601(charge.SERVICE_DATE);
			dateStr = dateFormatter.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
			charge.SVC_DATE = dateStr;
			//Add/update item in charge history map
			chargeHistoryMap[dateStr].push(charge);
		}
	}
};

/**
 * Retrieves the charge history for an encounter over some date range
 * If either the start or end dates are not supplied, we will grab the full charge history
 * Processes the charges in the reply, and calls the callback if one was provided
 * @param {function|null} callback - Callback function to be called once historical charges have been processed
 * @param {Date} startDate - Earliest date (i.e. admit date) to use for retrieving charge history
 * @param {Date} endDate - Latest date to use for retrieving charge history
 */
ChargesO1Component.prototype.cclGetChargesHistory = function(callback, startDate, endDate){
	var self = this;
	var criterion = this.getCriterion();	
	var sendAr = [];
	var request = new MP_Core.ScriptRequest(this, "Charges O1 Component - Get Charge History");
	var tierGroup = this.getTierGroups();
	var tierGroupCd = tierGroup?tierGroup:"0";
	var compID = self.getComponentId();  
	sendAr.push(
			"^MINE^",
			criterion.person_id + ".0",
			criterion.encntr_id + ".0",
			1 //return_json flag, set to 1 to get JSON
	);
	//Add date parameters if they were passed in
	if (startDate && endDate) {
		sendAr.push(
			"^" + self.formatDateForCCL(startDate) + "^",
			"^" + self.formatDateForCCL(endDate) + "^"			
		);
	}else{
		sendAr.push(
			"^^",
			"^^"			
		);
	}
	sendAr.push(tierGroupCd+ ".0");	
	request.setProgramName("MP_GET_CHARGES_WRAPPER");
	request.setParameters(sendAr);
	request.setAsync(true);
	
	MP_Core.XMLCCLRequestCallBack(null, request, function(reply){		
		var status;
		var response;
		try{
			status = reply.getStatus();
			response = reply.getResponse();
			if (status === 'F') {
				if (self.isShowChargeHistoryClicked()) {
					self.clearSpinner(compID + "FullHistoryModalbody");
					var historyModalDialog = self.getFullHistoryModal();
					historyModalDialog.setBodyHTML(self.createChargeRetrieveFailBanner());
					return;
				} else {
					$('#' + compID + "SubmitErrorBanner").hide();
					$('#' + compID + "RetrieveErrorBanner").show();					
				}
			} else {
				$('#' + compID + "SubmitErrorBanner").hide();
				$('#' + compID + "RetrieveErrorBanner").hide();
				//Stores the Personnel List which will be used further to get the Full Name of a Particular Person(Physician or Non-Physician)
				self.m_prsnlList = MP_Util.LoadPersonelListJSON(response.PRSNL);	
			}			
		} catch (err){
			throw (err);
		}		
		
		var charges = response.CHARGES;
		if (!charges){
			return;  //ERROR!
		}
		
		//Always process results and update chargeHistoryMap
		self.processHistoricalCharges(charges, startDate, endDate);

		//Trigger callback if we have one
		if (typeof callback === 'function'){
			callback.apply(self, [charges, startDate, endDate]);
		}
	});
};

/**
 * CCL script to call on component initialization
 * @param {function} callback - function to call once CCL script returns
 * @param {Date} startDate - Earliest date in date range
 * @param {Date} endDate - Latest date in date range
 */
ChargesO1Component.prototype.cclScriptInit = function(callback, startDate, endDate){
	/*
	 * Setup the CCL script to retrieve history
	 */
	var self = this;
	var criterion = this.getCriterion();	
	var sendAr = [];
	var request = new MP_Core.ScriptRequest(this, this.getComponentLoadTimerName());
	var tierGroup = this.getTierGroups();
	
	var tierGroupCd = tierGroup?tierGroup:"0";	
	
	if (!startDate || !endDate) {
		throw new Error("No start/end dates passed into cclScriptInit");
	}
	
	sendAr.push(
			"^MINE^",
			criterion.person_id + ".0",
			criterion.encntr_id + ".0",
			"^" + self.formatDateForCCL(startDate) + "^",
			"^" + self.formatDateForCCL(endDate) + "^",
			criterion.provider_id + ".0",
			tierGroupCd+".0"			
			, criterion.position_cd + ".0",
			criterion.facility_cd + ".0"
			
	);
	request.setProgramName("MP_CHARGES_INIT");
	request.setParameters(sendAr);
	request.setAsync(true);
	
	MP_Core.XMLCCLRequestCallBack(null, request, function(reply){
		var hasSuccess = false;
		var status;
		var response;
		try{
			status = reply.getStatus();
			response = reply.getResponse();
			if (status === 'F'){
				self.finalizeComponent(MP_Util.HandleErrorResponse(self.getStyles().getNameSpace(), "Failed to retrieve historical charges."), "");
			} else {
				hasSuccess = true;
			}			
		} catch (err){
			throw (err);
		}
		
		if (!hasSuccess){
			return;
		}
		self.setEncntrTypeCd(response.ENCNTR_TYPE);
		//Stores the Personnel List which will be used further to get the Full Name of a Particular Person(Physician or Non-Physician)
		self.m_prsnlList = MP_Util.LoadPersonelListJSON(response.PRSNL);
		var charges = response.CHARGES;
		if (!charges){
			return;  //ERROR!
		}
		
		var admitDate = response.ADMIT_DT_TM;
		if (admitDate){
			self.m_encounterStartDate = new Date();
			self.m_encounterStartDate.setISO8601(admitDate);
			self.m_encounterStartDate.setHours(12,0,0,0);
		}else{
			self.m_encounterStartDate.setHours(12,0,0,0);
		}
		
		if (response.DEFAULT_LOC_CD && response.DEFAULT_LOC_DISP){
			self.setDefaultLocationSettings(response.DEFAULT_LOC_CD, response.DEFAULT_LOC_DISP);
		}
		 
		if (response.ORGANIZATION_ID) {
			self.setOrganizationId(response.ORGANIZATION_ID);
		}
		
		var userName = response.CURRENT_USER;
		self.setUserFullName(userName);
		
		//Sets the Physician Indicator
		var phy_ind = response.PHYSICIAN_IND;
		self.setPhysicianIndicator(phy_ind);
		
		var icdCodes = self.getICDCodes();
		if (response.ICD9_CD){
			icdCodes.push(response.ICD9_CD);
		}
		if (response.ICD10_CD){
			icdCodes.push(response.ICD10_CD);
		}

        if (response.ICD10PCS_CD){
            icdCodes.push(response.ICD10PCS_CD);
        }
        self.setVisitTypeDefinitions(response.VISIT_TYPES);
		//Always process results and update chargeHistoryMap
		self.processHistoricalCharges(charges, startDate, endDate);		
		// Assign Patient locations(Facility,Building and Nurse unit) information for display the patient locations in location's menu
		self.setPatientLocations(response.PATIENT_LOCATIONS);
		// Assign recent note info to a class variable for the rendering of My note section.
		self.m_myNote = self.getAssociatedNote(response);
		self.m_myNotes = response.NOTES;
		
		self.setSpecialtyList(response.SPECIALTY_LIST);

		self.setIsnCodeServerRunning( response.IS_NCODE_SERVICE_AVAILABLE ? true : false);
		
		//Trigger callback if we have one
		if (typeof callback === 'function'){
			callback.apply(self, [charges, startDate, endDate]);
		}
	});
};

/**
 * Retrieves the correct associated note to be displayed face-up.
 * @param {Object} response - JSON Object having the list of notes and latest updated uncharged note.
 * @returns {Object} - Object containing the latest updated uncharged note.
 */
ChargesO1Component.prototype.getAssociatedNote = function(response){
	var notesLength = response.NOTES.length;
	var noNote = {
		HAS_NOTE: 1,
		EVENT_ID: 0.0,
		EVENT_CD: 0.0,
		EVENT_CD_DISP: 0.0,
		CHARGED_IND: 0,
		RESULT_STATUS_CD_DISP: "",
		SUBJECT: "--",
		UPDATE_DATE: ""
	};
	//If the latest uncharged note from the CCL script is uncharged return this.
	if(response.MY_NOTE.CHARGED_IND === 0){
		return response.MY_NOTE;
	}else{
		//Sort the notes according to UPDATE DATE in descending order
		response.NOTES.sort(function(a,b){
			var d1 = new Date();
			var d2 = new Date();
			d1.setISO8601(a.UPDATE_DATE);
			d2.setISO8601(b.UPDATE_DATE);
			if(d1 < d2)
				return 1;
			else if(d1 > d2)
				return -1;
			else
				return 0;
		});
		//Find the uncharged note appearing first in the list of sorted notes.
		for(var i=0;i<notesLength;i++){
			var note = response.NOTES[i];
			if(note.CHARGED_IND === 0){
				note.HAS_NOTE = 1;
				return note;
			}				
		}
	}
	//If all notes are charged, return a dummy note object.
	return noNote;
};

/**
 * Retrieves conditions using MP_GET_CONDITIONS and executes passed in callback function once the CCL script has returned
 * @param {function} callback - callback function to execute upon CCL script return.  Callback is given component's scope
 */
ChargesO1Component.prototype.cclGetConditions = function(callback){
	/*
	 * Setup the CCL script to retrieve conditions
	 */
	if (typeof callback !== 'function'){
		//We don't have a callback method to run, so no point in running this script
		return;
	}
	var self = this;
	var criterion = this.getCriterion();
	var sendAr = [];
	sendAr.push(
			"^MINE^",
			criterion.person_id + ".0",
			criterion.provider_id + ".0",
			criterion.encntr_id + ".0",
			criterion.ppr_cd + ".0",
			criterion.position_cd + ".0",
			"^" + criterion.category_mean + "^"//,
			//"1231.0" //Default Search Vocab (from Bedrock)
	);
	var request = new MP_Core.ScriptRequest(self, "ENG:ChargesO1Component - MP_GET_CONDITIONS");
	request.setProgramName("MP_GET_CONDITIONS");
	request.setParameters(sendAr);
	request.setAsync(true);
	MP_Core.XmlStandardRequest(null, request, function(reply){
		callback.apply(self, [reply]); //Calls the callback with scope of 'self', and 'reply' as the argument
	});	
};

/**
 * Calls a CCL script to submit a charge and updates the Side Pane with the status
 */
ChargesO1Component.prototype.dropCharge = function(){
	var self = this;
	var criterion = this.getCriterion();
	var compID = this.getComponentId();
	
	var code = this.getCurrentCPTCode();
	
	if (!code){
		return;
	}
	
	//Get associated conditions
	var aConditions = this.getAssociatedConditionsObj();
	var aLen = aConditions.getLength();
	var i;
	if (!aLen){
		return;
	}
	
	var dxListJSON = "";
	
	dxListJSON += "{'DX_ITEMS':";
	dxListJSON += "{'dxList':[";


	//Add each selected diagnosis to our json string
	for (i = 0; i < aLen; i++){
        var condition = aConditions.getConditionIndexOf(i).CONDITION;
        if (!(condition.DIAGNOSES && condition.DIAGNOSES.length)){
            throw new Error("Runtime Error: Undefined diagnosis encountered in 'dropCharge' method");
        }

		var diagnosis = condition.DIAGNOSES[0];
		if (!diagnosis){
            throw new Error("Runtime Error: Undefined diagnosis encountered in 'dropCharge' method");
		}

		var descNomId = diagnosis.TARGET_NOMENCLATURE_ID;
		//Any items beyond the 1st need a comma separator
		if (i > 0){
			dxListJSON += ",";
		}
		dxListJSON += "{'alias':'" + descNomId + "','value':" + descNomId + ".0}";	
	}
	
	dxListJSON += "]}}";
		
	var dateStr = (this.getServiceDate()) ? this.getDateForCCL(this.getServiceDate()) : this.getDateForCCL(new Date());
	
	var perfLocCd = 0;
	if (this.getModifiedLocationId() > 0) {  // This condition will execute when location id has been changed from default to another value except empty.
		perfLocCd = this.getModifiedLocationId();
	} else if (this.getModifiedLocationId() === -1) {  // This condition will execute when location id has been changed from default value to empty.
		perfLocCd = 0;
	} else if (this.getDefaultLocationSettings() && this.getDefaultLocationSettings().LOCATION_CD) { // This condition will execute when the user did not change the location id.
		perfLocCd = this.getDefaultLocationSettings().LOCATION_CD;
	}	
	
	var providerId = this.getModifiedProviderId() || criterion.provider_id;	
		
	var sendAr = [
	              "^MINE^",
				  criterion.person_id + ".0",
	              criterion.encntr_id + ".0",
	              providerId + ".0",
	              "^" + dateStr + "^", //"MMDDYYYY"
	              "^DISCERN ABU^",//Does not matter what is.
	              "^" + dxListJSON + "^",
	              "^" + code + "^",
	              "^CPT^",
	              perfLocCd + ".0",
				  "^" +  (this.getSelectedModifier() || "") + "^",
				  (this.m_selectdeNoteEventId + ".0"),
				  criterion.provider_id + ".0"
	              ];
	var request = new MP_Core.ScriptRequest(this, "ChargesO1 - Submit Charge");
	request.setProgramName("MP_SUBMIT_CHARGES_BY_CODE");
	request.setParameters(sendAr);
	request.setAsync(true);
	//Start spinner
	this.loadSpinner(compID + "Container");
	MP_Core.XmlStandardRequest(null, request, function(reply){
		self.clearSpinner(compID + "Container"); //Remove the spinner
		if (reply.getStatus() !== "S") {
			$('#' + compID + "RetrieveErrorBanner").hide();
			$('#' + compID + "SubmitErrorBanner").show();
			return;	
		} else {			
			if (self.isLaunchedFromDocumentation()) {
				window.open('', '_parent', '');
				window.close();
			}
			$('#' + compID + "RetrieveErrorBanner").hide();
			$('#' + compID + "SubmitErrorBanner").hide();
			//Start spinner on history table
			self.loadSpinner(compID + "Container");
			//The CCL script calls an asynchronous service to create the charge
			//Setting a timeout of 2 seconds to give the service some time before retrieving the history
			setTimeout(function () {
				self.fetchSpecificDayHistoricalCharges(self.getServiceDate(), self.m_selectdeNoteEventId);
			}, 2000);
		}
	});	
};

/**
 * Updates the rolling history table and retrieves charges as necessary, based on the datepicker selection
 * @param {Object} inst - Object returned by the jQuery Datepicker that contains information on selected date
 */
ChargesO1Component.prototype.handleDatepickerSelection = function(inst){
	var selectedDate = new Date();
	var rollingHistoryTable = this.m_rollingHistoryTable;
	var tableMap = rollingHistoryTable.getColumnMap();
	var key = null;
	var historyItem;
	
	//Create date based on instance from datepicker
	//The order of setting the year/month/date DOES matter
	selectedDate.setYear(inst.selectedYear);
	selectedDate.setMonth(inst.selectedMonth);
	selectedDate.setDate(inst.selectedDay);
	selectedDate.setHours(12,0,0,0);
	
	this.setServiceDate(selectedDate);
	//Will eventually need to update preview pane and rolling History
	
	//Check if date already exists in the rolling history table
	for (key in tableMap){
		historyItem = null;
		if (tableMap.hasOwnProperty(key)){
			historyItem = tableMap[key];
		} else {
			key = null;
			continue;
		}
		if (Date.parse(historyItem.DATE_OBJ) === Date.parse(selectedDate)){
			break;
		}
		key = null;
	}
	
	//If key was found, select the date
	if (key){
		$("#" + key).click();
	} else {
		//For now, we'll be dumb about updating the rolling history
		this.fetchHistoricalCharges(7, selectedDate);
	}
};

/**
 * Creates and configures the rolling history table
 * @param {Array} rollingHistoryList - list of historical charges items
 * @param {Date} selectedDate - Selected date
 * @returns {RollingTable} - Rolling History Table
 */
ChargesO1Component.prototype.buildRollingHistoryTable = function(rollingHistoryList, selectedDate){
	function calculateDaysDelta(pastDate, futureDate){
		var MS_IN_DAY = 86400000;  //Const: # of ms in a day
		return Math.floor((futureDate - pastDate) / MS_IN_DAY);  //Floor takes care of differences due to timezones
	}

    //Determines which cell in the rolling history table to highlight
	function getSelectedDateIndex(){
		var rhLen = rollingHistoryList.length;
		var i = 0;
		//In case selectedDate wasn't passed
		if (!selectedDate){
			return i;
		}
		for (i = 0; i < rhLen; i++){
			if (Date.parse(selectedDate) === Date.parse(rollingHistoryList[i].DATE_OBJ)){
				break;
			}
		}
		return i;
	}
	
	var self = this;
	var encntrStartDate = this.m_encounterStartDate;
	var currentDate = new Date();	
	var rollingHistoryTable = this.m_rollingHistoryTable || new this.RollingTable(this);  //Only create new table if one doesn't exist
	var standardCol = new this.RollingColumn();
	var blankCol = new this.RollingColumn();
	var datePickerOpts = {};
	
	currentDate.setHours(12,0,0,0);
	
	//Configure datepicker
	datePickerOpts.showOn = "both";
	datePickerOpts.buttonImageOnly = true;
	datePickerOpts.buttonImage = this.getCriterion().static_content + "/images/4974.png";
	datePickerOpts.buttonText = "Calendar";
	datePickerOpts.defaultDate = null;
	datePickerOpts.maxDate = 0;
	datePickerOpts.minDate = encntrStartDate;
	datePickerOpts.onClose = function(dateStr, inst){self.handleDatepickerSelection(inst);};
	
	//Configure standard column template
	standardCol.setColumnCSS("charges-o1-rolling-history-col");
	standardCol.setHeaderCSS("charges-o1-rolling-history-hdr");
	standardCol.setBodyCSS("charges-o1-rolling-history-val");
	standardCol.setHeaderField("RH_DATE");
	standardCol.setBodyField("CPT_CODE");
	standardCol.setHoverFunc(this.buildRollingHistoryHover);
	standardCol.setClickFunc(this.handleRollingHistoryCellClick);
	
	//Configure blank column template
	blankCol.setColumnCSS("charges-o1-rolling-history-blank-col");
	
	//Configure Table
	rollingHistoryTable.setId(this.getComponentId() + "RollingHistoryTable");
	rollingHistoryTable.setCSS("charges-o1-rolling-history-cont");
	rollingHistoryTable.setNumOfColumnsToDisplay(7);
	rollingHistoryTable.setColumnTemplate(standardCol);
	rollingHistoryTable.setBlankColumnTemplate(blankCol);
	rollingHistoryTable.setIsDatepickerEnabled(calculateDaysDelta(encntrStartDate, currentDate) > 7);
	rollingHistoryTable.setDatepickerOptions(datePickerOpts);
	rollingHistoryTable.setActiveIndex(getSelectedDateIndex());

	//Bind data
	rollingHistoryTable.bindData(rollingHistoryList);
	
	this.m_rollingHistoryTable = rollingHistoryTable;
	
	return rollingHistoryTable;
};

/**
 * Retrieve array of history items for use in the rolling history table
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Array} - list of history items for the rolling history table
 */
ChargesO1Component.prototype.retrieveHistoryItems = function(startDate, endDate){
	var MS_IN_DAY = 86400000;  //Const: # of ms in a day
	var dateFormatter = MP_Util.GetDateFormatter();
	var fullDate4Year = mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR;
	var encntrStartDate = this.m_encounterStartDate;  //Based on encounter admit date, we have this after the first time retrieving history
	var chargeHistoryMap = this.getChargeHistoryMap();
	var dateKey; //date 'key' for chargeHistoryMap
	var rhDate = "";//date formatted for rolling history
	var prsnlID = this.getCriterion().provider_id;  //Physician that submitted the charge
	var workingDate = null;
	var currentDate = new Date();
	var numOfDays = 0;
	var dateBucketCharges = null;
	var bucketLen;
	var historicalItem = null;
	var rollingHistoryList = [];
	var charge;
	var i;
	var j;
	var isDSTStart = false;
	var isDSTEnd = false;
	var MS_IN_HOUR = 3600000; //Const: # of ms in a hour
	
	function calculateDaysDelta(pastDate, futureDate) {
		var msInDays = futureDate - pastDate; // Milliseconds between future Date & past Date
		if (msInDays === -MS_IN_HOUR) { // Checking for DST Start Time
			isDSTStart = true;
		} else if (msInDays === MS_IN_HOUR) { // Checking for DST End Time
			isDSTEnd = true;
		}
		if (isDSTStart) {
			msInDays = msInDays + MS_IN_HOUR; // Adding milliseconds in a Hour to total ms in days
		} else if (isDSTEnd) {
			msInDays = msInDays - MS_IN_HOUR; // Subtracting milliseconds in a Hour to total ms in days
		}
		return Math.floor(msInDays / MS_IN_DAY); //Floor takes care of differences due to time zones
	}

	currentDate.setHours(12,0,0,0);
	
	//Need to iterate over date range
	numOfDays = calculateDaysDelta(startDate, endDate);
	startDate.setHours(12,0,0,0);
	for (i = numOfDays; i >= 0; i--){
		workingDate = new Date(Date.parse(startDate) + (i * MS_IN_DAY));
		if (workingDate >= encntrStartDate){  //Checking encounter date was earlier than the working date
		dateKey = dateFormatter.format(workingDate, fullDate4Year);
		rhDate = (!calculateDaysDelta(workingDate, currentDate)) ? i18n.discernabu.charges_o1.TODAY: this.convertToRollingHistoryDateFormat(workingDate);
		//Create the JSON structure rolling history will reference
        historicalItem = {
				SVC_DATE: dateKey,
				CPT_CODE: "--",
				DATE_OBJ: workingDate,
				RH_DATE: rhDate,
				BUCKET: [],
				DOCUMENT: ""
		};
		//Get charge array associated to given date (may be empty array)
		dateBucketCharges = chargeHistoryMap[dateKey];
		
		//Attempt to find current user's charge
		if (dateBucketCharges && dateBucketCharges.length){
			historicalItem.BUCKET = dateBucketCharges;
			historicalItem.BUCKET.sort(function(a,b){
				var d1 = new Date();
				var d2 = new Date();
				d1.setISO8601(a.UPDATE_DATE);
				d2.setISO8601(b.UPDATE_DATE);
				if(d1 < d2)
					return 1;
				else if(d1 > d2)
					return -1;
				else
					return 0;
			});
			for (j = 0, bucketLen = dateBucketCharges.length; j < bucketLen; j++){
				charge = dateBucketCharges[j];
				if(charge.VERIFY_PHYS_ID === prsnlID && (this.getPhysicianIndicator() || this.isNonPhyEnabled())){
					historicalItem.DIAGNOSES = charge.DIAGNOSES;
					historicalItem.CPT_CODE = charge.CPT_CODE;
					historicalItem.DOCUMENT = charge.DOC_NAME;
					break;  //Valid charge found, exit loop
				}
			}
		}
		rollingHistoryList.push(historicalItem);
	  }
	}
	return rollingHistoryList;
};

/**
 * Builds the HTML for a diagnosis row for the Side Pane Associated Diagnoses section
 * Should be called within 'buildAssociatedDiagnosesHTML'
 * @param {object} obj - Object to be rendered that includes its id, priority, index, and condition data
 * @returns {string} - html representation of the diagnosis row
 */
ChargesO1Component.prototype.buildAssociatedDiagnosisRow = function(obj){
	/*
	    Should create an actual class instead of use this ill-defined object
	 * Obj: {
	 * 	HTML_ID,
	 * 	PRIORITY,
	 * 	INDEX,
	 * 	CONDITION
	 * }
	 */
	var html = "";
	if (!obj){
		return html;
	}
	var condition = obj.CONDITION;
    var diagnoses = condition.DIAGNOSES;
    if (!(diagnoses && diagnoses.length)){
        return "";
    }
    var diagnosis = diagnoses[0];
	var suggestHtml = diagnosis.IS_SUGGESTED ? ("<span class='charges-o1-suggested-label'>(" + i18n.discernabu.charges_o1.SUGGESTED + ")</span>") : "";
	
	html +=	"<div id='" + obj.HTML_ID + "' class='charges-o1-rp-diag-assigned'>"
	html +=		"<label class='charges-o1-diag-lbl'>";
	html +=			"<input type='checkbox' class='charges-o1-rp-diag-chkbx' checked />";
	//html +=			(diagnosis.getTargetCode() || "") + " " + diagnosis.getTargetDisplay()
    html +=          "<span class='charges-o1-diag-span'>"+diagnosis.TARGET_CODE+" "+(condition.ANNOTATED_DISPLAY||condition.DISPLAY)+suggestHtml+"</span>";
	html +=		"</label>";
	html +=		"<div class='charges-o1-diag-action-col'>";
	if (obj.PRIORITY === 1){
		html +=		"<span class='charges-o1-diag-primary'>" + i18n.discernabu.charges_o1.PRIMARY+ "</span>";
	} else {
		html +=		"<span class='charges-o1-diag-secondary'>" + i18n.discernabu.charges_o1.MAKE_PRIMARY + "</span>";
	}
	html +=		"</div>";
	html += "</div>";
	
	return html;
};

/**
 * Builds the HTML for a diagnosis row for the Side Pane Unassociated Diagnoses section
 * Should only be called from 'buildUnassociatedDiagnosesHTML'
 * @param {object} obj - Object to be rendered that includes its id, priority, index, and condition data
 * @returns {string} - html representation of the diagnosis row
 */
ChargesO1Component.prototype.buildUnassociatedDiagnosisRow = function(obj){
	var html = "";
	if (!obj){
		return html;
	}
	var compID = this.getComponentId();
    var condition = obj.CONDITION;
    var diagnoses = condition.DIAGNOSES;
    if (!(diagnoses && diagnoses.length)){
        return "";
    }
    var diagnosis = diagnoses[0];
	var suggestHtml = diagnosis.IS_SUGGESTED ? ("<span class='charges-o1-suggested-label'>(" + i18n.discernabu.charges_o1.SUGGESTED + ")</span>") : "";
	
	html += 	"<div id='" + obj.HTML_ID + "' class='charges-o1-rp-diag-unassigned'>";
	html += 		"<label class='charges-o1-rp-lbl charges-o1-diag-lbl'>";
	html +=				"<input type='checkbox' class='charges-o1-rp-diag-chkbx' /><span class='charges-o1-diag-span'>"+ diagnosis.TARGET_CODE + " " + (condition.ANNOTATED_DISPLAY || condition.DISPLAY) + suggestHtml + "</span>";
	html += 		"</label>";
	html +=			"<div class='charges-o1-diag-action-col'>";
	html +=				"<span class='charges-o1-diag-secondary'>" + i18n.discernabu.charges_o1.MAKE_PRIMARY+ "</span>";
	html +=			"</div>";
	html +=		"</div>";
	return html;	
};

/**
 * Builds the HTML for the Associated Diagnoses section for the Side Pane
 * @returns {string} - html representation of the associated diagnoses section
 */
ChargesO1Component.prototype.buildAssociatedDiagnosesHTML = function(){
	var html = "";
	var compID = this.getComponentId();
	var associatedConditions = this.getAssociatedConditionsObj().getConditions();
	var unAssociatedConditions = this.getUnassociatedConditionsObj().getConditions();
	var i;
	var iLen = associatedConditions.length;
	var jLen = unAssociatedConditions.length;

	
	//Build the section container
	html += "<div class='charges-o1-rp-assoc-diag-section'>";
	//section label
	html +=		"<div class='charges-o1-rp-lbl'>" + i18n.discernabu.charges_o1.DIAGNOSES+ "</div>";
	
	
	if (iLen === 0 && jLen === 0){ //Determine whether to show the instructions (only show if there are 0 diagnoses in this section)
		html += "<div>" + i18n.discernabu.charges_o1.NO_DIAGNOSIS_DOCUMENTED + "</div>";
	}else if(iLen === 0 && jLen !==0){
		html += "<div>" + i18n.discernabu.charges_o1.NO_DIAGNOSIS_ASSOCIATED + "</div>";
	}

	//Build condition container
	html += 	"<div id='" + compID + "RPAssocDiagList' class='charges-o1-rp-assoc-diag-list'>";
	//Populate with associated diagnoses
	for (i = 0; i < iLen; i++){
		html += this.buildAssociatedDiagnosisRow(associatedConditions[i]);
	}
	html += 	"</div>";
	html +=	"</div>";
	return html;
};

/**
 * Builds the HTML for the Unassociated Diagnoses section for the Side Pane
 * @returns {string} - html representation of the unassociated diagnoses section
 */
ChargesO1Component.prototype.buildUnassociatedDiagnosesHTML = function(){
	//var conditions = this.getUnselectedConditionsArray();
	var compID = this.getComponentId();
	var conditions = this.getUnassociatedConditionsObj().getConditions();
	var html = "";
	var i;
	var iLen = conditions.length;
	
	//section container
	html += "<div class='charges-o1-rp-unassoc-diag-section'>";
	//Container for unassociated conditions
	html +=		"<div id='" + compID + "RPUnassocDiagList' class='charges-o1-rp-unassoc-diag-list'>";
	for (i = 0; i < iLen; i++){
		html += this.buildUnassociatedDiagnosisRow(conditions[i]);
	}
	html +=		"</div>";
	html +=	 "</div>";
	return html;
};

/**
 * Builds the HTML for the Diagnoses sections for the Side Pane
 * @returns {string} - html representation of the diagnoses sections
 */
ChargesO1Component.prototype.buildPPDiagnosesSectionHTML = function(){
	var html = "";
	//Build html for the assigned diagnoses section
	html += 	this.buildAssociatedDiagnosesHTML();
	var unAssociatedConditions = this.getUnassociatedConditionsObj().getConditions();
	if(unAssociatedConditions.length !== 0){
		//Section separator
		html +=		"<div class='sp-separator'></div>";
		//Build HTML for unassigned diagnoses section
		html += 	this.buildUnassociatedDiagnosesHTML();
	}
	return html;
};

/**
 * Builds the HTML for the Editable Section for the Side Pane
 * @returns {string} - html representation of the Editable Section
 */
ChargesO1Component.prototype.buildPPEditableSectionHTML = function(){
	var compID = this.getComponentId();
	var html = "";
	var cptClass = "";
	var useThis = "";
	var recNcodeHtml = "";
	var nCodeWarn = "";
	var supported = "";
	var cptCode = this.getCurrentCPTCode();

	if (!cptCode) { //Default code value
		cptCode = i18n.discernabu.charges_o1.ENTER_CODE;
		cptClass = " charges-o1-secondary-text";
		nCodeWarn = "";
		useThis = "";
		supported = "";
	}

	useThis = "<div id='" + compID + "recNcodeUseThis' class='charges-o1-rp-recncd'><a id='" + compID + "useThisAnchor'></a></div>";
	recNcodeHtml = "<div class='supported-block'><div id='" + compID + "recommededNcode' class='charges-o1-rp-ncode-val" + cptClass + "'>&nbsp;</div>" + useThis + "</div>";
	supported = "<div id='" + compID + "recNcodeSupp'>&nbsp;</div>";
	//html += "<div id='" + compID + "RPEditableSection'>";
	html += "<div class='charges-o1-pp-padded-section'>";
	//Create upper row
	html += "<div class='charges-o1-rp-upper-section'>";
	//Create CPT cell
	html += "<div class='charges-o1-rp-cpt-cont'>";
	html += "<div class='charges-o1-rp-cpt-val-cont'>";
	html += "<div id='" + compID + "RPCPTVal' class='charges-o1-rp-cpt-val" + cptClass + "'>" + cptCode + "</div>";
	html += "</div>";
	html += "<div>";
	html += "<div id='" + compID + "selectedCPT' class='charges-o1-selected-cpt'>" + i18n.discernabu.charges_o1.SELECTED_CPT + "</div>";
	html += "</div>";
	html += "</div>";
	html += "<div id='" + compID + "recNcodeSuppBox' class='charges-o1-rec-supp'>";
	html += recNcodeHtml;
	html += supported;
	//html += useThis;
	html += "</div>";
	html += "</div>";
	
	//Create Warning Section
	html += "<div id='" + compID + "nCodeWarn' class='charges-o1-ncode-warn'>" + nCodeWarn + "</div>";
	html += "</div>";
	return html;
};

/**
 * Builds the HTML for the CPT Instruction Section for the Side Pane
 * This section appears when no CPT code is entered in the side pane
 * @returns {string} - html representRPCPTValation of the CPT Instruction Section
 */
ChargesO1Component.prototype.buildPPCPTInstructionSectionHTML = function(){
	var compID = this.getComponentId();
	var staticLocation = this.getCriterion().static_content;
	var html = "";
	html +=	"<div id='" + compID + "PPInstructionSection' class='charges-o1-pp-init charges-o1-pp-padded-section'>";
	html +=		"<div class='charges-o1-no-data-img-cont'>";
	html +=			"<span class='charges-o1-no-data-img'></span>";
	html +=		"</div>";
	html +=		i18n.discernabu.charges_o1.SELECT_A_CPT_CODE_PART_1+",<br />"+i18n.discernabu.charges_o1.SELECT_A_CPT_CODE_PART_2+",<br />"+i18n.discernabu.charges_o1.SELECT_A_CPT_CODE_PART_3 ;
	html +=	"</div>";
	return html;
};

/**
 * Builds the HTML for the Submit Status Section for the Side Pane
 * This section appears when a charge is submitted
 * @returns {string} - html representation of the submit status section
 */
ChargesO1Component.prototype.buildPPSubmitStatusSectionHTML = function(){
	var compID = this.getComponentId();
	var staticLocation = this.getCriterion().static_content;
	var html = "";
	
	html += "<div class='charge-default-font charges-o1-pp-init charges-o1-pp-padded-section'>";
	html +=		"<div>";
	html +=			"<span class='charges-o1-success-img'></span>";
	html +=		"</div>";
	html +=		"<div>" + this.getCurrentCPTCode() + "</div>";
	html +=		"<div class='charge-reg-pane-font'>";
	html +=			i18n.discernabu.charges_o1.SUCCESSFULLY_SUBMITTED + "<br />" + this.getDateString(this.getServiceDate());
	html +=		"</div>";
	html +=	"</div>";
	
	return html;
};

/**
 * Builds the HTML for the Interactive View for the Side Pane
 * Contains the Editable and Diagnoses sections
 * @returns {string} - html representation of the Interactive View
 */
ChargesO1Component.prototype.buildPPInteractiveViewHTML = function(){
		/*
	 * This View contains the following sections:
	 * --Editable
	 * --Diagnoses (Associated, Unassociated)
	 */
	var compID = this.getComponentId();
	var html = "";
	
	//Create root container
	html += "<div id='" + compID + "RPDispRoot' class='charges-o1-rp-mod-root-cont'>";
	//Add Editable section
	html += "<div id='" + compID + "RPEditableSection'>";
	html += this.buildPPEditableSectionHTML();
	html += "</div>";
	html += "<div id='" + compID + "PPWarningSection'>";
	html += "</div>";
	html += "<div class='sp-separator'></div>";
	html += "<div id='" + this.getComponentId() + "chargesScrollContainer' class='charges-o1-scroll-container'>";
	html += this.buildPPMiddleSectionHTML(true);
	//html += "<div class='charges-o1-pp-padded-section'></div>";
	html += "<div class='sp-separator'></div>";
	//Add Diagnoses section(s)
	html += "<div id='sidePanelScrollContainer" + compID + "'>";
	html += "<div id='" + this.getComponentId() + "RPDiagnosesSection' class='charges-o1-pp-padded-section charges-o1-sp-diag'>";
	html += this.buildPPDiagnosesSectionHTML();
	html += "</div>";
	html += "</div>";
	html += "</div>";
	return html;
};

/**
 * Builds the HTML for the Historical View for the Side Pane
 * @param {Object} historicalItem - The data object from the rolling history table cell
 * @returns {string} - html representation of the Side Pane historical view
 */
ChargesO1Component.prototype.buildPPHistoricalViewHTML = function(historicalItem){
	var compID = this.getComponentId();
	var staticLocation = this.getCriterion().static_content;
	var primaryDiagnosis = null;
	var html = "";
	var cptCode = "";	
	var svcDate = "";
	var diagnosesObj = "";
	if (!historicalItem){
		return;
	}	
	var bucketLength = historicalItem.BUCKET.length;
	if (bucketLength) {
		cptCode = historicalItem.BUCKET[0].CPT_CODE;		
		svcDate = historicalItem.BUCKET[0].SVC_DATE;
		diagnosesObj = historicalItem.BUCKET[0].DIAGNOSES;
	}
	function getPrimaryDiagnosis(diagnoses){
		var pDiagnosis = null;
		var dLen = 0;
		var i;
		
		if (!diagnoses || !diagnoses.length){
			return null;
		}
		
		dLen = diagnoses.length;
		for (i = 0; i < dLen; i++){
			if (diagnoses[i].INDEX === 1){
				pDiagnosis = diagnoses[i];
				return pDiagnosis;
			}
		}
		return null;
	}
	
	//Create root
	html += "<div id='sidePanelScrollContainer" + compID + "'>";
	html +=  "<div id='" + compID + "RPDispRoot' class='charges-o1-rp-mod-root-cont'>";
	html +=   "<div class='charges-o1-pp-padded-section'>";
	
	//Status
	html +=    "<div id='" + compID + "PPHistoricalSection' class='charges-o1-pp-historical'>";
	html +=      "<div>" + "<img src='" + staticLocation + "/images/data_entry_success.png' />" + "</div>";
	html +=      "<div class='charges-o1-rp-historical-cpt charges-o1-secondary-text'>" + cptCode + "</div>";
	//Date data
	html +=      "<div>";
	html +=        "<span class='charges-o1-secondary-text'>" + i18n.discernabu.charges_o1.DATE + ":" + "</span>";
	html +=        "<span>" + svcDate + "</span>";
	html +=      "</div>";
	//Diagnosis data
	primaryDiagnosis = getPrimaryDiagnosis(diagnosesObj);
	html +=      "<div>";
	html +=        "<span class='charges-o1-secondary-text'>" + i18n.discernabu.charges_o1.PRIMARY_DIAGNOSIS + ":" + "</span>";
	html +=        "<span>" + (primaryDiagnosis ? primaryDiagnosis.CODE + " " + primaryDiagnosis.ALIAS : "Not Found") + "</span>";
	html +=      "</div>";
	html +=     "</div>";
	html +=    "</div";
	html +=   "</div";
	return html;
};

/**
 * Builds the HTML for the Initial View for the Preview Pane
 * Contains the Editable and Instruction sections
 * @returns {string} - html representation of the Initial View 
 */
ChargesO1Component.prototype.buildPPInitialViewlHTML = function(){
	var compID = this.getComponentId();
	var html = "";

	//Create root container
	html += "<div id='sidePanelScrollContainer" + compID + "'>";
	html += "<div id='" + compID + "RPDispRoot' class='charges-o1-rp-mod-root-cont'>";
	//Add Editable section
	html += "<div id='" + compID + "RPEditableSection'>";
	html += this.buildPPEditableSectionHTML();
	html += "</div>";
	html += "<div class='charges-o1-pp-padded-section'><div class='sp-separator'></div></div>";
	html += "<div id='" + this.getComponentId() + "chargesScrollContainer' class='charges-o1-scroll-container'>";
	html += this.buildPPMiddleSectionHTML(false);
	html += "<div id='" + compID + "PPWarningSection'></div>";
	html += "<div class='charges-o1-pp-padded-section'><div class='sp-separator'></div></div>";
	//Add Instructions section
	html += this.buildPPCPTInstructionSectionHTML();
	html += "</div>"
	html += "</div>"
	html += "</div>";
	return html;
};

/**
 * Build html for middle section in side panel.
 * @param {boolean} - Flag to identity whether the function is calling in the initial load of the component or
 * after selecting a row in charges table.
 * @returns {string} - html representation of the middle section in side panel.
 */
ChargesO1Component.prototype.buildPPMiddleSectionHTML = function(isRowSelected) {
	var self = this;
	var compID = self.getComponentId();
	var locationNameHTML = "";
	var serviceDate = self.getServiceDate();
	var chargesi18n = i18n.discernabu.charges_o1;
	var dateStr = chargesi18n.NO_SELECTED_DATE;
	if (serviceDate) {
		dateStr = self.convertDateToMMDDYYYY(serviceDate);
	}	
	var locationsArrayLength = 0;
	if (self.getPatientLocations()) {		
		locationsArrayLength = self.getPatientLocations().length;
	}
	if (self.getDefaultLocationSettings() && self.getDefaultLocationSettings().LOCATION_CD > 0 && locationsArrayLength > 0) {		
		locationNameHTML = "<span class='charges-o1-location-provider' id ='" + compID + "locationName'>" + self.getDefaultLocationSettings().LOCATION_DISPLAY + "</span>";
	} else if (!self.getDefaultLocationSettings() && locationsArrayLength > 0) {
		locationNameHTML = "<span class='charges-o1-location-provider' id ='" + compID + "locationName'>--</span>";
	} else {
		locationNameHTML = "<span>--</span>";
	}

	// Html for service date.
	var serviceDateHtml = "<div class='charges-o1-date-label charges-o1-secondary-text'>" + chargesi18n.DATE + "</div> <div id='" + compID + "RPSvcDateValue' class='charges-o1-date-val'>" + dateStr + "</div>";

	// If it is initial load ( no CPT code selected), hide the modifiers section.
	var modifierHtml = "<div id='" + compID + "modifierSection' class='charges-o1-secondary-text'>" + "<div class='charges-o1-modifier-label'>" + ( isRowSelected ? chargesi18n.MODIFIER : "&nbsp;") + "</div>" + "<div id ='" + compID + "modifierValue' class=' charges-o1-modifier-value'>" + ( isRowSelected ? "--" : "") + "</div>" + "</div>";

	// Html for performance location
	var performLocationHtml = "<div class='charges-o1-provider-section'>" + modifierHtml + "<div class='charges-o1-location-label charges-o1-secondary-text'>" + chargesi18n.LOCATION + "</div><div id='" + compID + "RPPerfLoc' class='charges-o1-location-anchor'>" + locationNameHTML + "</div></div>";
	
	// Html for Provider Name
	var providerHtml = "<div class='charges-o1-provider-label charges-o1-secondary-text'>" + chargesi18n.PROVIDER + "</div><div id='" + compID + "Provider' class='charges-o1-provider-value'><span class='charges-o1-location-provider' id ='" + compID + "providerName'>" + (self.getUserFullName() || "--") + "</span></div>";
	
	// Html for middle section
	return( "<div class='charges-o1-sp-middle-section'>" + "<div id='" + compID + "dateProviderSection' class='charges-o1-rp-svc-date-cont'>" + serviceDateHtml + providerHtml + "</div>" + performLocationHtml + "</div>");
};

/**
 * Builds the HTML for the Submit Status View for the Preview Pane
 * Contains the Submit Status section
 * @returns {string} - html representation of the Submit Status View
 */
ChargesO1Component.prototype.buildPPSubmitStatusViewHTML = function(){
	var compID = this.getComponentId();
	var html = "";	
	html += "<div id='" + compID + "RPDispRoot' class='charges-o1-rp-mod-root-cont'>"; 
	html += 	this.buildPPSubmitStatusSectionHTML();
	html += "</div>";
	return html;
};

/**
 * Builds the HTML string that contains the Visit Type drop down menu
 * @returns {String} html
 */
ChargesO1Component.prototype.generateDropDownHTML = function(chargeJSON) {
	var compID = this.getComponentId();
	var jsHTML = "";
	var jsonDropDown = chargeJSON;
	
	jsHTML+=("<select id='" + compID + "ChargeTypeDropDown' class='charges-o1-type-drop-down'>");
	//default message
	jsHTML += "<option id='" + compID + "VisitTypeDefaultOption' class='charges-o1-default-option'>" + i18n.discernabu.charges_o1.SELECT_VISIT_TYPE+ "</option>";
	$.each(jsonDropDown.CHARGES, function(itemnum,item){
		jsHTML += ("<option value=" + itemnum + " cdf_meaning=" + jsonDropDown.CHARGES[itemnum].VISIT_TYPE_CDF_MN + ">" + jsonDropDown.CHARGES[itemnum].DISPLAY_NAME + "</option>");
	});
	jsHTML+=("</select>");
	if(jsonDropDown.CHARGES.length === 0){
		jsHTML+=("<div>*" + i18n.discernabu.charges_o1.NO_VISIT_TYPES_FOR_ENCOUNTER + "</div>");	
	}
	return jsHTML;
};

/**
 * Builds the HTML string that contains controls, such as the visit type drop down and cpt code text box
 * @returns {String} html
 */
ChargesO1Component.prototype.buildControlsSection = function(){
	var compID = this.getComponentId();
	var html = "";
	var visitTypeArr = this.getChargingJSON();
	var visitTypeArrLen = visitTypeArr.length;
	html += "<div id='" + compID + "ContentControls'>";
	html +=		"<div id='" + compID + "ContentType' class='charges-o1-content-type'>";
	html +=			"<span class='charges-o1-visit-type-lbl'>" + i18n.discernabu.charges_o1.VISIT_TYPE+ "</span>";
	html +=			"<span>" + this.generateDropDownHTML(this.getChargingJSON()) + "</span>";
	html +=		"</div>";
	html +=	"</div>";
	return html;
};

ChargesO1Component.prototype.buildRollingHistoryHover = function(data){
	var html = "";
	var colObj;
	var bucket;
	var prsnlID = this.getCriterion().provider_id;
	var bucketLength = 0;
	var prevFoundMap = {};
	var bucketItem;
	var verifyPhysID;
	var i;
	var physName = "";
	var physCPT = "";
	var physDoc = "";
	var noteHTML = "";
	
	if (!data || !data.DATA){
		return;
	}
	
	colObj = data.DATA;
	bucket = colObj.BUCKET;
	if (!bucket || bucket.length == undefined){
		return;
	}
	
	bucketLength = bucket.length;
	
	//Container
	html += "<div class='charges-o1-rh-hvr-cont'>";
	//Header
	html +=   "<div class='charges-o1-rh-hvr-hdr'>";
	//Header contents
	html +=     "<span class='charges-o1-rh-hvr-phys-col'>" + i18n.discernabu.charges_o1.PROVIDER + "</span>";
	html +=     "<span class='charges-o1-rh-hvr-cpt-col'>" + i18n.discernabu.charges_o1.CHARGE + "</span>";
	html +=   "</div>"
	//separator
	html +=   "<div class='sp-separator'></div>";
	//Body
	html +=   "<div class='charges-o1-rh-hvr-body'>";
	
	physName = this.getUserFullName() ||  i18n.discernabu.charges_o1.MINE;
	//Looking for current physician's charge first
	for (i = 0; i < bucketLength; i++){
		bucketItem = bucket[i];
		verifyPhysID = bucketItem.VERIFY_PHYS_ID;
		//Make sure field exists/is valid
		if (!verifyPhysID){
			continue;
		}
		
		if (verifyPhysID === prsnlID){
			physCPT = bucketItem.CPT_CODE;
			physDoc = bucketItem.DOCUMENT;
			prevFoundMap[prsnlID] = true;
			break;
		}		
	}
	
	if (!prevFoundMap[prsnlID]){
		physCPT = "--";
		prevFoundMap[prsnlID] = true;
	}
	
	if(physDoc !== ""){
		noteHTML = "(" + physDoc + ")";
	}else{
		noteHTML = "";
	}
	
	html += "<div class='charges-o1-rh-hvr-row-div'>";
	html += "<span class='charges-o1-rh-hvr-phys-col charges-o1-rh-cur-phys'>" + physName + "</span>";
	html += "<span class='charges-o1-rh-hvr-cpt-col charges-o1-rh-cur-phys'>" + physCPT + " " + noteHTML + "</span>";
	html += "</div>";
	
	//Body contents
	for (i = 0; i < bucketLength; i++){
		bucketItem = bucket[i];
		verifyPhysID = bucketItem.VERIFY_PHYS_ID;
		//Make sure field exists/is valid
		if (!verifyPhysID){
			continue;
		}
		//Check if physician was found earlier
		if (prevFoundMap[verifyPhysID]){
			continue;
		} else {
			prevFoundMap[verifyPhysID] = true;
		}
		
		//Returns the Personnel's(Physician and Non-Physician) Full Formatted Name when the ID is passed to display it on Time-line hover Tool-tip
		var physicianObj = MP_Util.GetValueFromArray(verifyPhysID, this.m_prsnlList);
		physName = physicianObj ? physicianObj.fullName : "";
		physCPT = bucketItem.CPT_CODE;
		
		//Write html
		html += "<div class='charges-o1-rh-hvr-row-div'>";
		html += "<span class='charges-o1-rh-hvr-phys-col'>" + physName + "</span>";
		html += "<span class='charges-o1-rh-hvr-cpt-col'>" + physCPT + "</span>";
		html += "</div>";
	}
	
	html +=   "</div>";
	
	return html;
};

ChargesO1Component.prototype.buildBlankCPTTable = function(){
	var compID = this.getComponentId()
	var html = "";
	
	html +=  "<div id='" + compID + "DefaultCPTtable' class='component-table list-as-table charges-o1-empty-table'>";
	html +=    "<div class='content-hdr'>";
	html +=      "<dl class='hdr'>";
	html +=        "<dd class='header-item charges-o1-column charges-o1-trans'>";
	html +=          "<span class='header-item-display'>" + i18n.discernabu.charges_o1.CPT_CODE + "</span>";
	html +=        "</dd>";
	html +=        "<dd class='header-item charges-o1-column charges-o1-trans'>";
	html +=          "<span class='header-item-display'>" + i18n.discernabu.charges_o1.HISTORY + "</span>";
	html +=        "</dd>";
	html +=        "<dd class='header-item charges-o1-column charges-o1-trans'>";
	html +=          "<span class='header-item-display'>" + i18n.discernabu.charges_o1.EXAM + "</span>";
	html +=        "</dd>";
	html +=        "<dd class='header-item charges-o1-column charges-o1-trans'>";
	html +=          "<span class='header-item-display'>" + i18n.discernabu.charges_o1.DECISION_MAKING + "</span>";
	html +=        "</dd>";
	html +=      "</dl>";
	html +=    "</div>";
	html +=  "</div>";
	
	return html;
};

/**
 * This function will create a Modal Dialog for displaying all the notes created or modified by the user.
 * The script to retrieve all the notes will be called here and when the script returns,a modal dialog will be rendered. 
 * @returns {null}
 */
ChargesO1Component.prototype.openMyNotes = function(){
	
	var compId		 	= this.getComponentId();
	var modalID 		= compId + "MyNotesModal";
	this.m_myNoteDialog = MP_ModalDialog.retrieveModalDialogObject(modalID);
	var self			= this;
	var criterion 		= this.getCriterion();
	var beginDateTime 	= this.formatDateForCCL(this.m_encounterStartDate);
	
	// If the dialog is not yet created, create a new
	if(!this.m_myNoteDialog) 
	{
		this.m_myNoteDialog = new ModalDialog(modalID);
		this.m_myNoteDialog.setHeaderTitle(i18n.discernabu.charges_o1.MY_NOTES);
		this.m_myNoteDialog.setLeftMarginPercentage(30);
		this.m_myNoteDialog.setRightMarginPercentage(30);
		this.m_myNoteDialog.setTopMarginPercentage(15);
		this.m_myNoteDialog.setBottomMarginPercentage(15);
		
		this.m_myNoteDialog.setHeaderCloseFunction( function(){
			$(window).unbind("resize.myNotesTable");	
		});
		
		MP_ModalDialog.addModalDialogObject(this.m_myNoteDialog);
		
		// Create OK button and add to dialog footer.
		var okButton=new ModalButton(compId + "okButton");
		okButton.setText(i18n.discernabu.CONFIRM_OK);		
		okButton.setOnClickFunction(function()
		{
			self.updateMySelectedNote();
			$(window).unbind("resize.myNotesTable");
		});
		this.m_myNoteDialog.addFooterButton(okButton);	

		// Create Cancel button and add to dialog footer.
		var cancelButton=new ModalButton(compId + "cancelButon");
		cancelButton.setText(i18n.discernabu.CONFIRM_CANCEL);		
		cancelButton.setOnClickFunction(function()
		{
			$(window).unbind("resize.myNotesTable");
		});
		
		this.m_myNoteDialog.addFooterButton(cancelButton);		
	}

	// Call the script to retrieve all the notes documented by the user.
	// Call the render method to render the dialog body in response handler .
	var reportRequest = new ScriptRequest();
	reportRequest.setName("Charge Note Request");
	reportRequest.setProgramName("mp_retrieve_charge_notes");
	reportRequest.setParameterArray(["^MINE^",criterion.person_id + ".0",criterion.encntr_id + ".0",criterion.provider_id + ".0",criterion.position_cd + ".0",criterion.facility_cd + ".0","^" + beginDateTime + "^"]);
	reportRequest.setResponseHandler(function(scriptReply){
		self.renderMyNotes(scriptReply);
	});
	
	// Show the dialog and add spinner icon to body.
	MP_ModalDialog.showModalDialog(modalID);
	this.loadSpinner(this.m_myNoteDialog.getBodyElementId());
	
	reportRequest.performRequest();	
};

/**
 * This function will update the note note information displayed in the face-up with selected note's information from modal dialog.
 * Event id of the selected note will be stored in a class variable for nCoding.
 * @returns {null}
 */
ChargesO1Component.prototype.updateMySelectedNote = function(){

	// Return if no note selected from the dialog.
	if(!this.m_myNote){
		return;
	}
	
	var compId = this.getComponentId();
	var $noteSubject = $("#" + compId +"myNoteSubject");
	
	// Update Subject of selected note.
	$noteSubject.html(i18n.discernabu.charges_o1.ASSOCIATED_NOTE + ": <span class='charges-o1-note-subject'>" + this.m_myNote.SUBJECT || "--" + "</span>");
	
	// Set the event_id of selected note for nCoding.
	this.setSelectedNoteEventId(this.m_myNote.EVENT_ID);
	
	// Change the background color of my note section to selected state.
	$("#" + compId +"myNoteSelected").addClass("selected");
	
};

/**
 * This is the function which will be called when script request for my notes returns.
 * Function will create component table and display note informations like Subject,
 * Note Type and Last Updated date/time in tabular manner if the status is "S" and more than one note had documented.
 * If there is only one note, the same would displayed in the face up and a message will be displayed in dialog body.
 * If the status is "F", error retrieving results message will be displayed in dialog body.
 * @param {array} replyObj - script reply object to render dialog.
 * @returns {null}
 */
ChargesO1Component.prototype.renderMyNotes = function(replyObj){
	
	var compId = this.getComponentId();
	var chargesi18n = i18n.discernabu.charges_o1; 
	var bodyHtml = "";
	
	var status = replyObj.getStatus();
	var recordData = replyObj.getResponse();
	
	// Handle error condition if the status is "F".
	if(status === "F")
	{
		var errMsg = [];
		errMsg.push(replyObj.getError());
		bodyHtml = MP_Util.HandleErrorResponse("", errMsg.join("<br/>"));
	}
	// Process the results for rendering and create component table if the note count is more than one.
	else if(status === "S" && recordData.NOTES.length > 0){
	
		this.processNoteRecordData(recordData);
		bodyHtml = this.createMyNotesTable(recordData);
	}
	//	Handle "Z" status and single note condition.
	else{	
		bodyHtml = chargesi18n.NO_ADDITIONAL_NOTES_FOUND ;		
	}
	
	// Remove the spinner icon from dialog body and set the html.
	this.clearSpinner(this.m_myNoteDialog.getBodyElementId());
	
	//Generate "All notes are charged" message.
	var html = MP_Core.generateUserMessageHTML("information", chargesi18n.ALL_NOTES_CHARGED, "", "inline-message");
	
	//Build DOM Content
	this.m_myNoteDialog.setBodyHTML((this.areAllNotesCharged(recordData.NOTES))? ("<div class='charges-o1-my-notes-table-container'><div class='charges-o1-all-notes-charged'>" + html + "</div>" + bodyHtml + "</div>") : ("<div class='charges-o1-my-notes-table-container'>" + bodyHtml + "</div>"));
	
	this.updateMyNotesTable(recordData.NOTES);
};

/**
 * This function will return true if all available notes are charged and false otherwise
 * @param {Array} notes - Array of available notes to be charged
 * @returns {boolean} - true or false value depending on whether all notes have been charged.
 */
ChargesO1Component.prototype.areAllNotesCharged = function(notes){
	var noteCount = notes.length;
	//If no notes are found, "All notes are charged" message must not be displayed so return false.
	if(noteCount === 0){
		return false;
	}		
	for(var index = noteCount ; index--;){
		var note = notes[index];
		if(note.CHARGED_IND === 0){
			return false;
		}
	}
	return true;
};

/**
 * This is the function which will adjust the styling of component table.
 * The class"wf" will be added to parent <div> tag of dialog body for inheriting the standard component table styles.
 * Set the max-height to table for scrolling, which will avoid the scroll bar in modal dialog to scroll.
 * @param {Array} notes - Array storing the list of notes available
 * @returns {null}
 */
ChargesO1Component.prototype.updateMyNotesTable = function(notes){

	if(!this.m_myNotesTable){
		return;
	}

	var compId = this.getComponentId();
	var self = this;
	
	//Add the wf class to the root of the modal so the standard component table styles can be inherit.
	var $modalDialog = $("#vwpModalDialog" + this.m_myNoteDialog.getId());
	$modalDialog.addClass("wf");
	
	/**
	 *Helper function to size the body of the table to enable scrolling 
	 * @param {DOM Element} Body of My Notes modal dialog.
	 * @param {DOM Element} Content header of my notes table.
	 * 
	 * @return {integer} Calculated table height to be considered as the number of pixels
	 */
	var calculateTableHeight = function(modalBody, tableHeader) {
		var marginBuffer = 25;
		var alertMsgHeight = (self.areAllNotesCharged(notes))? 28 : 0;
		return modalBody.height() - tableHeader.height() - marginBuffer - alertMsgHeight;
	};
	
	//Grab some of the table elements for resizing
	var tableHeader = $("#charges-o1" + compId + "headerWrapper");
	var tableBody = $("#charges-o1" + compId + "tableBody");
	var modalBody = $("#" + this.m_myNoteDialog.getBodyElementId());
	
	//Set the initial max-height of the table body so scrolling is correctly applied
	tableBody.css({
		"max-height" : calculateTableHeight(modalBody, tableHeader) + "px",
		"overflow-y" : "auto"
	});
	this.m_myNotesTable.updateAfterResize();
						
	// Call the finalize method to register all the extensions.
	this.m_myNotesTable.finalize();	
	
	$(window).on("resize.myNotesTable" ,function() {
	
		//Set the initial max-height of the table body so scrolling is correctly applied
		tableBody.css({
			"max-height" : calculateTableHeight(modalBody, tableHeader) + "px",
			"overflow-y" : "auto"
		});
		self.m_myNotesTable.updateAfterResize();
	});
	
	this.ditherChargedNotes(notes);
	
	// Highlight the current selected note in My Notes table.
	this.highlightSelectedNote();
};

/**
 * This is the function which will create the component table object and return the html of the same.
 * @param {recordData} JSON record having note informations for rendering component table.
 * @returns {string} Html of component table.
 */
ChargesO1Component.prototype.createMyNotesTable = function(recordData){

	var column = null;
	var chargesi18n = i18n.discernabu.charges_o1; 
	var compId = this.getComponentId();
	var self = this;
		
	this.m_myNotesTable = new ComponentTable();
	this.m_myNotesTable.setNamespace("charges-o1" + compId);
	
	// Create Subject column	
	column = new TableColumn();
	column.setColumnId("SUBJECT");
	column.setCustomClass("charges-o1-my-notes-info");
	column.setColumnDisplay(chargesi18n.SUBJECT);
	column.setPrimarySortField("SUBJECT");
	column.addSecondarySortField("UPDATE_DATE", TableColumn.SORT.DESCENDING);
	column.setRenderTemplate('${SUBJECT_DISPLAY}');
	this.m_myNotesTable.addColumn(column);
	
	// Create Note Type column
	column = new TableColumn();
	column.setColumnId("NOTE_TYPE");
	column.setCustomClass("charges-o1-my-notes-info");
	column.setColumnDisplay(chargesi18n.NOTE_TYPE);
	column.setPrimarySortField("EVENT_CD_DISP");
	column.addSecondarySortField("UPDATE_DATE", TableColumn.SORT.DESCENDING);
	column.setRenderTemplate('${EVENT_CD_DISP}');
	this.m_myNotesTable.addColumn(column);
	
	// Create Last Update Column
	column = new TableColumn();
	column.setColumnId("LAST_UPDATE");
	column.setCustomClass("charges-o1-my-notes-last-update");
	column.setColumnDisplay(chargesi18n.LAST_UPDATE);
	column.setPrimarySortField("UPDATE_DATE");
	column.addSecondarySortField("SUBJECT", TableColumn.SORT.ASCENDING);
	column.setRenderTemplate('${LAST_UPDATE_STRING}');
	this.m_myNotesTable.addColumn(column);
	
	recordData.NOTES.sort(function(a,b){
		var d1 = new Date();
		var d2 = new Date();
		d1.setISO8601(a.UPDATE_DATE);
		d2.setISO8601(b.UPDATE_DATE);
		if(d1 < d2)
			return 1;
		else if(d1 > d2)
			return -1;
		else
			return 0;
	});
	
	//Bind the data to component table for rendering.
	this.m_myNotesTable.bindData(recordData.NOTES);
		
	// Add cellClickExtension for the component table.
	var cellClickExtension = new TableCellClickCallbackExtension();
	
	cellClickExtension.setCellClickCallback(function(event, data) {
		self.onMyNoteRowClick(event, data);
	});

	this.m_myNotesTable.addExtension(cellClickExtension);
	
	/**
	 ** Override the toggleColumnSort method of ComponentTable to select the first row in the table view after sorting.
	 ** @param columnId  :-the column to be sorted.
	 */
	this.m_myNotesTable.toggleColumnSort = function(columnId) {

		//Call the base class functionality to sort column.
		ComponentTable.prototype.toggleColumnSort.call(this, columnId);
		
		// Set the ok button as dithered as after sorting selected row will be lost.
		self.m_myNoteDialog.setFooterButtonDither(compId + "okButton", true);
		
	};
	
	// Return the html of component table.
	return (this.m_myNotesTable.render());
};

/**
 * This is the function which will update the background colour of selected row and
 * store selected note's information in a class variable.
 * @param {event} event - event that was triggered on row click.
 * @param {data} JSOn record of selected row. 
 * @returns {null} 
 */
ChargesO1Component.prototype.onMyNoteRowClick = function(event, data){

	var $selRow = $(event.target).parents("dl.result-info");

	if (!$selRow.length || data.RESULT_DATA === null) {
		return;
	}

	var compId = this.getComponentId();
	var prevRow = $("#charges-o1" + compId + "tableBody").find(".charges-o1-row-selected");

	if(($selRow.find("span").attr("charged-ind")) === "0"){
		
		// Remove the background color of previous selected row.
		if (prevRow.length > 0 ) {
			prevRow.removeClass("charges-o1-row-selected");
		}

		// Change the background color to indicate that its selected.
		$selRow.addClass("charges-o1-row-selected");	
		
		// Enable the OK button as note has been selected.
		this.m_myNoteDialog.setFooterButtonDither(compId + "okButton", false);
		
		// Store the selected note's information m_myNote array for updating the same in face up.
		this.m_myNote = data.RESULT_DATA;
	}	
};

/**
 * This function is used to set the dither CSS property on charged notes.
 * @param {Array} notes - Array containing the list of NOTE Objects
 * @returns {null} 
 */
ChargesO1Component.prototype.ditherChargedNotes = function (notes) {
	var compID = this.getComponentId();
	for (var i = 0; i < notes.length; i++) {
		var $curNote = $("#charges-o1" + compID + "tableBody").find("[event-id=" + notes[i].EVENT_ID + "]").parent().parent();
		//If the note exists and has been charged then apply the CSS property.
		if (notes[i].CHARGED_IND === 1 && $curNote.length) {
			$curNote.addClass("dither-note");
		}
	}
};

/**
 * This function updates the associated Note with the correct note once a charge has been placed.
 * @param {number} noteID Stores the EVENT_ID of the selected Note to be charged or has been charged.
 */
ChargesO1Component.prototype.updateAssociatedNote = function(noteID){
	var chargesMap = this.convertHistoryMapToArray();
	var charged = false;
	var response = {
		MY_NOTE: {},
		NOTES: []
	};
	var myNotes = this.m_myNotes;
	var newNote = {
		HAS_NOTE: 1,
		EVENT_ID: 0.0,
		EVENT_CD: 0.0,
		EVENT_CD_DISP: 0.0,
		CHARGED_IND: 0,
		RESULT_STATUS_CD_DISP: "",
		SUBJECT: "--",
		UPDATE_DATE: ""
	};
	
	for(var i = 0; i < chargesMap.length; i++){
		var charge = chargesMap[i];
		//Identify if a charge has been placed for the corresponding note.
		if(charge.EXT_ITEM_EVENT_ID.toString() === noteID.toString() && charge.EXT_ITEM_EVENT_CONT_DISP === "CLIN EVENT"){
			charged = true;
			for(var j = 0; j < myNotes.length; j++){
				var note = myNotes[j];
				//If charge has been placed modify the Object storing the list of NOTES to make the corresponding note charged.
				if(myNotes[j].EVENT_ID.toString() === noteID.toString() && note.CHARGED_IND === 0){
					myNotes[j].CHARGED_IND = 1;
					myNotes[j].HAS_NOTE = 1;
					break;
				}
			}
			if(charged){
				break;
			}
		}
	}
	
	//If the associated Note was charged, then set its CHARGED_IND to 1
	if((this.m_myNote.EVENT_ID.toString() === noteID.toString() && charged) || noteID === 0){
		this.m_myNote.CHARGED_IND = 1;
	}
	response.MY_NOTE = this.m_myNote;
	response.NOTES = myNotes;
	this.m_myNotes = myNotes;
	//Find the next note to be charged.
	this.m_myNote = this.getAssociatedNote(response);
	//Update the DOM to set the new note as the selected note.
	this.updateMySelectedNote();
};

/**
 * This function will be called while rendering the modal dialog body with component table and
 * highlight the row if the note is currently selected.
 * @returns {null} 
 */
ChargesO1Component.prototype.highlightSelectedNote = function(){
	
	var compId = this.getComponentId();
	// Find the column in component table where the value of event-id attribute is same as currently selected note's EVENT_ID.
	// Then get the parent element which would be the row <dl> of component table.
	var $curselectedNote = $("#charges-o1" + compId + "tableBody").find("[event-id=" + this.getSelectedNoteEventId() +"]").parent();
	
	// Call the mouse up event to update the background color.
	if($curselectedNote.length)
	{
		$curselectedNote.mouseup();		
	}
	// Set OK button as dithered if couldn't found the note in the list.
	// This would be a rare scenario , when the selected note was delete by other user.
	else
	{
		this.m_myNoteDialog.setFooterButtonDither(compId + "okButton", true);
	}
};

/**
 * This function will process the record data from the backed and add additional field to component table rendering.
 * @param {recordData} JSON record of Notes.
 * @returns {null} 
 */
ChargesO1Component.prototype.processNoteRecordData = function(recordData){

	var lastUpdateString = "--";
	var elapsedTimeString = "--";
	var updateDateTime = new Date();
	var noteCount = recordData.NOTES.length;
	
	for(var index = noteCount ; index--;)
	{
		var note = recordData.NOTES[index];
		
		if(note.UPDATE_DATE !== ""){		
			updateDateTime.setISO8601(note.UPDATE_DATE);
			lastUpdateString = updateDateTime.format("longDateTime2");
			// calculate the elapsed time for face display.
			elapsedTimeString = MP_Util.CalcWithinTime(updateDateTime);
		}
		
		note.LAST_UPDATE_STRING = lastUpdateString;
		note.ELAPSED_DATE_TIME_STRING = elapsedTimeString + " " + i18n.discernabu.charges_o1.AGO;
		//  Set the EVENT_ID in event-id for future use.
		note.SUBJECT_DISPLAY = "<span charged-ind = '" + note.CHARGED_IND + "' event-id = '" + note.EVENT_ID + "'>" + (note.SUBJECT || "--") + "</span>";
	}
};

/**
 * Builds the HTML string for My Note section and Add Note link.
 * @returns {String} html
 */
ChargesO1Component.prototype.buildMyNoteSection = function(){

	var compID = this.getComponentId();
	var noteInfoHtml = "";
	var warningMessageHtml = "";
	var addNoteHtml = "";
	var chargesi18n = i18n.discernabu.charges_o1;
	
	// If nCode proxy server is not running, no need to display the Associated Section itself.
	if(!this.isnCodeServerRunning())
	{
		return "";
	}
	
	// if the patient has a note charted on his profile, create html for the same.
	// if there is no notes, return a warning text which will display instead.
	if(this.m_myNote && this.m_myNote.HAS_NOTE === 1)
	{
		noteInfoHtml = "<div id='" + compID + "myNoteSelected' class='charges-o1-my-note-selected'>" +
			"<div id='" + compID + "myNoteSubject' class ='charges-o1-my-note-info charges-o1-secondary-text'>" + chargesi18n.ASSOCIATED_NOTE + ": <span class='charges-o1-note-subject'>" + (this.m_myNote.SUBJECT || "--") + "</span></div>" +
			"</div>";

		// Add link to open modal dialog for additional notes.
		if(this.isAddNoteEnabled()) {
			addNoteHtml = "<a id='" + compID + "addNote'>" + chargesi18n.ADD_NOTE + "</a>";
		}
		
		// Set the event_id of selected note for nCoding.
		this.setSelectedNoteEventId(this.m_myNote.EVENT_ID);		
	}
	else{
		warningMessageHtml = "<p class='charges-o1-my-note-message'>" + chargesi18n.NO_NOTES_AVAILABLE + "</p>";
	}
	
	return ("<div id='" + compID + "MyNoteContainer' class ='charges-o1-my-note-container'>" + noteInfoHtml + warningMessageHtml + "</div>" + addNoteHtml);
};


//Converts a date object to a string the CCL script can recognize
ChargesO1Component.prototype.formatDateForCCL = function(dateObj){

	var monthMapping = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
	var dateStr = "";
	dateStr += (dateObj.getDate() < 10) ? "0" + dateObj.getDate() : "" + dateObj.getDate();
	dateStr += "-" + monthMapping[dateObj.getMonth()];
	dateStr += "-" + dateObj.getFullYear();
	return dateStr;
};
/**
 * Sets the Visit Type CDF_MN Value, This Value will be used for Requesting Recommended E&M Code.
 * @param {String} - Visit Type cdf_mn Value
 */
ChargesO1Component.prototype.setVisitTypeCDFMeaning = function(visitTypeCDFMeaning) {
	if (typeof visitTypeCDFMeaning !== "string") {
		throw new Error("Invalid Visit Type CDF Meaning nCode in 'setVisitTypeCDFMeaning'");
	}
	this.m_visitTypeObj = visitTypeCDFMeaning;
};
/**
 * Gets the CDF_MN Value of Visit Type, This Value will be used for Requesting Recommended E&M nCode.
 * @returns {String} - String representation of Visit Type CDF_MN Value.
 */
ChargesO1Component.prototype.getVisitTypeCDFMeaning = function() {
	return this.m_visitTypeObj;
};
/**
 * Sets the Level of Service which the User is expecting from Recommended E&M nCode Service.
 * @param {number} - CPT code
 */
ChargesO1Component.prototype.setLevelOfServiceFromCPTCode = function(cptCode) {
	if (typeof cptCode !== "number") {
		throw new Error("Invalid CPT Code in 'setLevelOfServiceFromCPTCode'");
	}
	// Mod of 10 is done is because to get the last digit that represents the Level of service Parameter for Recommended E&M nCode.
	this.m_levelOfService = cptCode % 10;
};
/**
 * Gets the Level of Service that is used for Recommended E&M nCode Service.
 * @returns {Number} - Single Digit Number that represents the Level of Service.
 */
ChargesO1Component.prototype.getLevelOfServiceFromCPTCode = function() {
	return this.m_levelOfService;
};

/**
 * Sets the Recommended E&M nCode which is retrieved from E&M nCode Service.
 * @param {number} - Represents 5 Digit E&M nCode.
 */
ChargesO1Component.prototype.setRecommendedNcode = function(recommendedNcode) {
	if (typeof recommendedNcode !== "number") {
		this.m_recNcode = 0;
		throw new Error("Invalid Recommended nCode in 'setRecommendedNcode'");
	}
	this.m_recNcode = recommendedNcode;
};
/**
 * Gets the Recommended E&M nCode. A 5 Digit Number From E&M nCode Service.
 * @returns {Number} - 5 Digit Number.
 */
ChargesO1Component.prototype.getRecommendedNcode = function() {
	return this.m_recNcode;
};

/**
 * Retrieves the Recommended E&M nCode Value based on the passed parameters to ("mp_get_charges_ncode_info")PRG.
 * Reply Object contains the Data of Recommended E&M nCode.
 */
ChargesO1Component.prototype.getNcodeRecommendations = function() {
	var compID = this.getComponentId();
	var self = this;
	var criterion = self.getCriterion();
	var catagoryMean = criterion.category_mean;
	var visitType = "";
	//Selects the visit type based on the selected/entered CPT code, empty string if not present(meaning Not Supported by nCode Service).
	switch (self.getCurrentCPTCode()) {
	case "99201":
	case "99202":
	case "99203":
	case "99204":
	case "99205":
		visitType = "NEW";
		break;
	case "99221":
	case "99222":
	case "99223":
		visitType = "INITIAL_INPATIENT_CARE";
		break;
	case "99231":
	case "99232":
	case "99233":
		visitType = "SUBSEQUENT_HOSPITAL_CARE";
		break;
	case "99238":
	case "99239":
		visitType = "DISCHARGE_DAY_MANAGEMENT";
		break;
	case "99241":
	case "99242":
	case "99243":
	case "99244":
	case "99245":
		visitType = "CONSULT";
		break;
	case "99211":
	case "99212":
	case "99213":
	case "99214":
	case "99215":
		visitType = "ESTABLISHED";
		break;
	case "99281":
	case "99282":
	case "99283":
	case "99284":
	case "99285":
		visitType = "EMERGENCY";
		break;
	}
	if (self.isnCodeServerRunning() && self.getSelectedNoteEventId() !== 0) {
		if (visitType) {
			var scriptRequest = new ScriptRequest();
			var nCodeRecommendedLoadTimer = new RTMSTimer("USR:MPG_CHARGES.O1_load_ncode_recommended_CPT",catagoryMean);
			if (nCodeRecommendedLoadTimer) {
				scriptRequest.setLoadTimer(nCodeRecommendedLoadTimer);
			}
			//If specialty is not assigned or "Default" specialty is selected for the user then Internal medicine will be sent as default specialty
			var assignedSpecialty = (self.getAssignedSpecialty() !== "" && self.getAssignedSpecialty() !== "Default") ? self.getAssignedSpecialty() : "Internal medicine";
			var df = MP_Util.GetDateFormatter();
			var visitDate = new Date(this.m_encounterStartDate);
			visitDate = visitDate.getFullYear() + "-" + (visitDate.getMonth() + 1) + "-" + visitDate.getDate();
			scriptRequest.setProgramName("mp_get_charges_ncode_info");
			scriptRequest.setAsyncIndicator(true);
			scriptRequest.setParameterArray(["^MINE^", "^" + assignedSpecialty + "^", self.getSelectedNoteEventId(), criterion.provider_id, "^" + visitDate + "^", "^" + visitType + "^", "^" + self.getLevelOfServiceFromCPTCode() + "^"]);
			scriptRequest.setResponseHandler(function(reply) {
				self.handleRecommendedNcodeResponse(reply); //Handles response Data
			});
			//Loads the Spinner while response is received.
			$("#" + compID + "recommededNcode")
				.html("&nbsp;")
				.addClass('loading-spinner');
			$("#" + compID + "recNcodeSupp")
				.html(i18n.discernabu.charges_o1.SUPPORTED);
			//Performs request for Recommended E&M nCode.
			scriptRequest.performRequest();
		}
		else {
			//If Visit type is not supported then this displays the warning "nCode is currently unavailable".
			$("#" + compID + "nCodeWarn")
				.html(this.getNcodeWarningHTML(self.getCurrentCPTCode(), ""));
		}
	}
};
/**
 * Response handler for retrieving nCode Recommendation, sets the m_recNcode.
 * @param {JSON Object} - Represents Details about the Recommended E&M nCode.
 */
ChargesO1Component.prototype.handleRecommendedNcodeResponse = function(reply) {
	var compID = this.getComponentId();
	var self = this;
	var criterion = self.getCriterion();
	var catagoryMean = criterion.category_mean;	
	var nCodeRecommendedRenderTimer = new RTMSTimer("ENG:MPG_CHARGES.O1_render_ncode_recommended_CPT",catagoryMean);
	try {
		if (nCodeRecommendedRenderTimer) {
			nCodeRecommendedRenderTimer.start();
		}
	var responseNcodeInfo = reply.getResponse();
	//Sets the Recommended E&M nCode.
	this.setRecommendedNcode(parseInt(responseNcodeInfo.NCODEINFO.CAC_CODE));
	//Displays the Recommended E&M nCode above the "Supported" Label.
	$("#" + compID + "recommededNcode")
		.html(responseNcodeInfo.NCODEINFO.CAC_CODE);
	//Removes the Spinner once response comes back.
	$("#" + compID + "recommededNcode")
		.removeClass('loading-spinner');
	$("#" + compID + "recNcodeSupp")
		.html("&nbsp;");
	$(".charges-o1-rp-ncode-val")
		.css('padding-right','5px');
	//Depending on the Response this displays the warning for Recommended E&M nCode.
	$("#" + compID + "nCodeWarn")
		.html(self.getNcodeWarningHTML(self.getCurrentCPTCode(), self.getRecommendedNcode()));
	//Displays the Advisory information when Hovered on Details link present inside the Warning section.
	self.generateAdvisoryDetailsHover(responseNcodeInfo);
	
	self.setSuggestedDiagnoses(responseNcodeInfo.NCODEINFO.DIAGNOSES);
	self.populateSuggestedDiagnoses();
	self.removeDuplicateDiagnoses();
	self.refreshDiagnosesSection();
	
	// Enable submit button if diagnoses are selected.
	this.toggleButtons();
		if (nCodeRecommendedRenderTimer) {
			nCodeRecommendedRenderTimer.stop();
		}
	} catch (err) {
		if (nCodeRecommendedRenderTimer) {
			nCodeRecommendedRenderTimer.fail();
			nCodeRecommendedRenderTimer = null;
		}
		logger.logJSError(err, self, "charges-o1.js", "handleRecommendedNcodeResponse");
	}
	finally{
		 self.chargesSidePaneObj.collapseSidePanel();
		 self.chargesSidePaneObj.expandSidePanel();
	}
};

/**
 * function to remove diagnoses from unassigned conditions array if the same is there in suggested diagnoses.
 * @param {null}
 * @retun {null}
 */
ChargesO1Component.prototype.removeDuplicateDiagnoses = function() {

	var suggestedDiagnoses = this.getSuggestedDiagnoses();
	if (!suggestedDiagnoses){
		return;
	}
	
	var diagnosesCount = suggestedDiagnoses.length;
	
	for (var index = 0; index < diagnosesCount; index++){
		this.getUnassociatedConditionsObj().removeConditionByTargetNomenId(suggestedDiagnoses[index].TARGET_NOMENCLATURE_ID);
	}
};

/**
 * Populates associated conditions based on the suggested diagnoses from nCode service.
 * This should only need to be run once.
 * @param {null}
 * @retun {null}
 */
ChargesO1Component.prototype.populateSuggestedDiagnoses = function() {
	
	var suggestedDiagnoses = this.getSuggestedDiagnoses();
	if (!suggestedDiagnoses){
		return;
	}
	var associatedConditions = this.getAssociatedConditionsObj();
	//clear out the associated conditions
	associatedConditions.clearConditions();
	
	var diagnosesCount = suggestedDiagnoses.length;
	for (var index = 0; index < diagnosesCount; index++){
		var diagnose = suggestedDiagnoses[index];
		
		if (diagnose.TARGET_NOMENCLATURE_ID) {
		
			//These objects will get passed between this array and the selected conditions array
			var obj = {};
			obj.HTML_ID = this.getComponentId() + "SuggestedDiagRow" + index;
			obj.INDEX = index;
			// As nCode service returns only diagnoses, not conditions, assuming TARGET_NOMENCLATURE_ID as NOMENCLATURE_ID of condition.
			obj.NOMEN_ID = diagnose.TARGET_NOMENCLATURE_ID;
			// TARGET_NOMENCLATURE_ID of this object will be the TARGET_NOMENCLATURE_ID of suggested diagnose,
			// which will be used later to remove duplicate diagnose from unassociated conditions.  
			obj.TARGET_NOMENCLATURE_ID = diagnose.TARGET_NOMENCLATURE_ID;
			obj.CONDITION = [];
			obj.CONDITION.DISPLAY = diagnose.DESCRIPTION_DISPLAY;
			diagnose.TARGET_CODE = diagnose.CODE;
			diagnose.IS_SUGGESTED = true;
			obj.CONDITION.DIAGNOSES = [diagnose];
			associatedConditions.addCondition(obj);
		}
	}
};
/**
 * Generates the MPageToolTip to display the Advisory Information which is retrieved from the E&M nCode Service.
 * @param {JSON Object} - Represents Details about the Recommended E&M nCode and the Advisory Information.
 */
ChargesO1Component.prototype.generateAdvisoryDetailsHover = function(data) {
	var compID = this.getComponentId();
	var self = this;
	var adviceInfo = data.NCODEINFO.ADVICE;
	var detailsLink = $("#" + compID + "advisoryDetails");	
	var advInfoDOM = null;
	var advisoryPopover = new MPageUI.Popup();
	advisoryPopover.setAnchorId(compID + "advisoryDetails");
	advisoryPopover.setWidth(MPageUI.POPUP_OPTIONS.WIDTH.MEDIUM);
	advisoryPopover.setPosition(MPageUI.POPUP_OPTIONS.POSITION.LEFT);
	if (adviceInfo !== "") {
		//Regular Expressions used for formatting Advisory Information.
		adviceInfo = adviceInfo.replace(/([XVIL]+\.)/g, "<br>$1");
		adviceInfo = adviceInfo.replace(/([1-9][.])/g, "<br>&nbsp;&nbsp;&nbsp;&nbsp;$1");
		detailsLink.on("click", function(){
			advisoryPopover.setBodyContent("<div id='charges-o1-adv-info'>" + adviceInfo + "</div>");
			advisoryPopover.toggle();
			advInfoDOM = $("#charges-o1-adv-info");
			self.bindEventsForAdvisoryPopover(advInfoDOM, advisoryPopover);
		});
	}
	else {
		detailsLink.on("click", function(){
			advisoryPopover.setBodyContent("<div id='charges-o1-adv-info'>" + i18n.discernabu.charges_o1.NO_ADVICE + "<div>");
			advisoryPopover.toggle();		
			advInfoDOM = $("#charges-o1-adv-info");
			self.bindEventsForAdvisoryPopover(advInfoDOM, advisoryPopover);			
		});
	}
	
};
/**
 * Binds the Events for Details Popover
 */
ChargesO1Component.prototype.bindEventsForAdvisoryPopover = function(advInfoDOM, advisoryPopover){
	var popupTimerObj = null;
	function hidePopup(){
		if(advisoryPopover.isOpen()){
			advisoryPopover.hide();
		}
	}
	//Time will be set when the popup is opened to close it after that automatically.
	popupTimerObj = setTimeout(hidePopup,4000);
	//Every time this event will be unbinded and binded to avoid multiple bindings
	advInfoDOM.unbind("mouseleave");
	//When user moves the mouse pointer out of the popup, the popup disappears.
	advInfoDOM.on("mouseleave", function(event) {
		if(advisoryPopover.isOpen()){
			advisoryPopover.hide();
		}
	});
	//Every time this event will be unbinded and binded to avoid multiple bindings
	advInfoDOM.unbind("mouseenter");
	//When user moves the mouse pointer out of the popup, the popup disappears.
	advInfoDOM.on("mouseenter", function(event) {
		if(popupTimerObj !== null){
			window.clearTimeout(popupTimerObj);
		}
	});	
};
/**
 * Creates the appropriate warning message whenever Recommended nCode Differs from selected CPT Code.
 * @returns {HTML} - HTML representation Warning Message.
 */
ChargesO1Component.prototype.getNcodeWarningHTML = function(cptCode, recommendedNcode) {
	var html = "";
	var compID = this.getComponentId();
	if (!cptCode) {
		throw new Error("Invalid CPT code in 'getNcodeWarningHTML'");
		return;
	}
	if (!recommendedNcode) {
		html = MP_Core.generateUserMessageHTML("information", i18n.discernabu.charges_o1.NCODE_UNAVAILABLE, "", "inline-message");
		$("#" + compID + "recNcodeSupp")
			.html("");
		$("#" + compID + "nCodeWarn")
			.removeClass("charges-o1-ncode-warn")
			.addClass("charges-o1-ncode-unavail");
		$("#" + compID + "recommededNcode")
			.html("&nbsp;");
	}
	else {
		$("#" + compID + "useThisAnchor")
			.html(i18n.discernabu.charges_o1.USE_THIS);
		$("#" + compID + "recNcodeSupp")
			.html(i18n.discernabu.charges_o1.SUPPORTED);
		/**
		 * Handle notification messages here.
		 */
		if(recommendedNcode % 10 === 0){
			html = MP_Core.generateUserMessageHTML(
				"warning",
				i18n.discernabu.charges_o1.NCODE_UNABLE_TO_RECOMMEND, "",
				"inline-message"
			);
			html += "<div class='charges-o1-details-link'><a id='" + compID + "advisoryDetails'>" + i18n.discernabu.charges_o1.DETAILS + "</a></div>";
		}else if(recommendedNcode >= this.getSelectedVisitCPTRange().start && recommendedNcode <= this.getSelectedVisitCPTRange().end){
			if (recommendedNcode > cptCode) {
				html = MP_Core.generateUserMessageHTML(
					"warning",
					i18n.discernabu.charges_o1.YOUR_DOC_LEVEL + " (" + recommendedNcode + ").",
					i18n.discernabu.charges_o1.LOWER_THAN_RECOMMENDED_NCODE + " (" + cptCode + ").",
					"inline-message"
				);
				html += "<div class='charges-o1-details-link'><a id='" + compID + "advisoryDetails'>" + i18n.discernabu.charges_o1.DETAILS + "</a></div>";
			}
			else if (recommendedNcode < cptCode) {
				html = MP_Core.generateUserMessageHTML(
					"warning",
					i18n.discernabu.charges_o1.YOUR_DOC_LEVEL + " (" + recommendedNcode + ").",
					i18n.discernabu.charges_o1.HIGHER_THAN_RECOMMENDED_NCODE + " (" + cptCode + ").",
					"inline-message"
				);
				html += "<div class='charges-o1-details-link'><a id='" + compID + "advisoryDetails'>" + i18n.discernabu.charges_o1.DETAILS + "</a></div>";
			}
		}else{
			if (recommendedNcode > cptCode) {
				html = MP_Core.generateUserMessageHTML(
					"warning",
					i18n.discernabu.charges_o1.YOUR_DOC_LEVEL + " (" + recommendedNcode + ").",
					i18n.discernabu.charges_o1.HIGHER_THAN_RECOMMENDED_NCODE + " (" + cptCode + ").",
					"inline-message"
				);
				html += "<div class='charges-o1-details-link'><a id='" + compID + "advisoryDetails'>" + i18n.discernabu.charges_o1.DETAILS + "</a></div>";
			}
			else if (recommendedNcode < cptCode) {
				html = MP_Core.generateUserMessageHTML(
					"warning",
					i18n.discernabu.charges_o1.YOUR_DOC_LEVEL + " (" + recommendedNcode + ").",
					i18n.discernabu.charges_o1.LOWER_THAN_RECOMMENDED_NCODE + " (" + cptCode + ").",
					"inline-message"
				);
				html += "<div class='charges-o1-details-link'><a id='" + compID + "advisoryDetails'>" + i18n.discernabu.charges_o1.DETAILS + "</a></div>";
			}
		}
	}
	return html;
};
/**
 * Binds the Use this anchor to Action that copies Recommended E&M nCode to currently selected CPT Code.
 * And sets the Current CPT code to Recommended E&M nCode
 */
ChargesO1Component.prototype.bindUseThisNcodeAction = function() {
	var self = this;
	var compID = self.getComponentId();	
	$("#" + compID + "useThisAnchor").unbind("click");
	$("#" + compID + "useThisAnchor")
		.click(function() {
			self.setCurrentCPTCode($("#" + compID + "recommededNcode")
				.html());
			$("#" + compID + "RPCPTVal")
				.html(self.getCurrentCPTCode());
			$("#" + compID + "nCodeWarn")
				.remove();
			self.removeSelRowBgColor();
			// Reset previously selected modifier as now we are using re commented CPT from ncode.
			self.setSelectedModifier(0);	
			self.setPopupObj(null);			
			var chargesUseThisTimer = new CapabilityTimer("CAP:MPG_Charges-o1_use_supported_CPT_code", self.getCriterion().category_mean);
			if (chargesUseThisTimer) {
				chargesUseThisTimer.capture();
			}
			self.chargesSidePaneObj.collapseSidePanel();
			self.chargesSidePaneObj.expandSidePanel();
		});
};


/**
* Builds the HTML string that includes the error alert banner for charge submit fail.
* @returns {string} html
*/
ChargesO1Component.prototype.createChargeSubmitFailBanner = function () {	
	var errorBanner = new MPageUI.AlertBanner();
	errorBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
	errorBanner.setPrimaryText(i18n.discernabu.charges_o1.FAILED_SUBMIT_CHARGE_PRIMARY_MSG);
	errorBanner.setSecondaryText(i18n.discernabu.charges_o1.FAILED_SUBMIT_CHARGE_SEC_MSG);
	return (errorBanner.render());
};
/**
* Builds the HTML string that includes the error alert banner for charge retrieve fail.
* @returns {string} html
*/
ChargesO1Component.prototype.createChargeRetrieveFailBanner = function () {	
	var errorBanner = new MPageUI.AlertBanner();
	errorBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
	errorBanner.setPrimaryText(i18n.discernabu.charges_o1.FAILED_RETRIEVE_CHARGE_PRIMARY_MSG);
	errorBanner.setSecondaryText(i18n.discernabu.charges_o1.FAILED_RETRIEVE_CHARGE_SEC_MSG);
	return (errorBanner.render());	
};

/**
 * Builds the HTML string that contains the Specialty drop down menu
 * @returns {String} html
 */
ChargesO1Component.prototype.generateSpecialtyDropDownHTML = function() {
	var compID = this.getComponentId();
	var jsHTML = "";
	var specialtyDropDown = this.getSpecialtyList();
	var specialtyArrLen = specialtyDropDown.length;
	
	jsHTML+=("<select id='ChargeSpecialtyDropDown' class='charges-o1-specialty-drop-down'>");
	//default message
	jsHTML += "<option id='" + compID + "SpecialtyDefaultOption' class='charges-o1-default-option'>" + i18n.discernabu.charges_o1.SELECT_SPECIALTY + "</option>";
	
	for ( var i = 0; i < specialtyArrLen; i++) {
		jsHTML += ("<option value=" + i + ">" + specialtyDropDown[i].SPECIALTY_VALUE + "</option>");
	}
	jsHTML+=("</select>");
	return jsHTML;
};

/**
 * Create the specialty popup for component menu.
 */
ChargesO1Component.prototype.createSpecialtyPopup = function() {
	try {
		var specialtyPopup = null;
		var compID = this.getComponentId();
		var popupTimerObj = null;
		specialtyPopup = new MPageUI.Popup();
		specialtyPopup.setAnchorId("mainCompMenucharges" + compID);
		//sets the popup UI width to SMALL
		specialtyPopup.setWidth(MPageUI.POPUP_OPTIONS.WIDTH.SMALL);
		//sets the Position of Popup to appear on BOTTOM_RIGHT side of an anchor
		specialtyPopup.setPosition(MPageUI.POPUP_OPTIONS.POSITION.BOTTOM_RIGHT);		
		//set the HTML contents of Popup UI
		specialtyPopup.setBodyContent(i18n.discernabu.charges_o1.CHANGE_IN_COMPONENT_LEVEL_MENU);
		specialtyPopup.show();
		
		function hidePopup(){
			if(specialtyPopup.isOpen()){
				specialtyPopup.hide();
			}
		}
		//Time will be set when the popup is opened to close it after that automatically.
		popupTimerObj = setTimeout(hidePopup,4000);
		
		//Hides the popup when the component menu is clicked
		$('#mainCompMenucharges' + compID).click(function(){
			if(specialtyPopup.isOpen()){
				specialtyPopup.hide();
			}
			if(popupTimerObj !== null){
				window.clearTimeout(popupTimerObj);
			}
		});
	}
	catch(err) {
		MP_Util.LogJSError(this, err, "charges-o1.js", "createSpecialtyPopup");		
	}
};

/**
 * Adds the specialty (if already assigned) to the component menu when launched from documentation.
 */
ChargesO1Component.prototype.addSpecialtyWhenLaunchedFromDocumentation = function() {
	try {
		var userPrefs = this.getPreferencesObj();
		this.createMainMenu();
		var compMenu = this.getMenu();
		var compID = this.getComponentId();
		var compNS = this.getStyles().getNameSpace();
		var menuId = "specialty" + compID;
		var self = this;
		if(userPrefs) {
			
			if($("#" + compMenu.getAnchorElementId()).hasClass("opts-menu-empty")) {
				$("#" + compMenu.getAnchorElementId()).removeClass("opts-menu-empty").click(function() {
					MP_MenuManager.showMenu(compMenu.getAnchorElementId());
				});
			}
			if($("#" + compMenu.getAnchorElementId()).hasClass("menu-hide")) {
				$("#" + compMenu.getAnchorElementId()).removeClass("menu-hide").click(function() {
					MP_MenuManager.showMenu(compMenu.getAnchorElementId());
				});
			}
			
			if (compMenu) {
				var compMenuSpec = new MenuSelection(menuId);
				compMenuSpec.setLabel(userPrefs);
				compMenuSpec.setIsSelected(true);
				
				compMenu.addMenuItem(compMenuSpec);
				self.setAssignedSpecialty("");
				
				compMenuSpec.setClickFunction(function (clickEvent) {
					clickEvent.id = menuId;
					compMenu.removeMenuItem(compMenuSpec);
					
					if(!compMenu.m_menuItemArr.length) {
						document.getElementById("mainCompMenu" + compNS + compID).classList.add("opts-menu-empty");
					}
					self.setAssignedSpecialty("");
					self.setPreferencesObj(null);
					self.savePreferences(true);
					self.retrieveComponentData();
				});
			}
		}
	}
	catch(err) {
		MP_Util.LogJSError(this, err, "charges-o1.js", "addSpecialtyWhenLaunchedFromDocumentation");		
	}	
	
};

/**
 * Event Handler function for Specialty Assign Button
 */
ChargesO1Component.prototype.addSpecialtyAssignEventHandler = function() {
	try {
		var self = this;
		var compID = self.getComponentId();
		var specialtyAssignButton = $('#specialtyAssignBtn' + compID);
		var specialtyDropDownId = document.getElementById("ChargeSpecialtyDropDown");	
		if(specialtyDropDownId && specialtyDropDownId.selectedIndex === 0) {		
			if(specialtyAssignButton.hasClass("charges-o1-specialty-assign-button")) {
				specialtyAssignButton.removeClass("charges-o1-specialty-assign-button");
				specialtyAssignButton.addClass("charges-o1-specialty-assign-btn-disable");
			}	
		}
		
		$("#specialtyAssignBtn" + self.getComponentId()).on("click", function() {
			var chargesAssignSpecialtyTimer = new CapabilityTimer("CAP:MPG_CHARGES-o1_Assign_Specialty", self.getCriterion().category_mean); 
			if (chargesAssignSpecialtyTimer) {
				chargesAssignSpecialtyTimer.capture();
			}
			var compMenu = self.getMenu();		
			var menuId = "specialty" + compID;
			var assignedSpecialtyUserPrefs = "Internal medicine";
			if(specialtyDropDownId && specialtyDropDownId.selectedIndex > 0) {
				assignedSpecialtyUserPrefs = specialtyDropDownId.options[specialtyDropDownId.selectedIndex].text;			
			}
			self.setAssignedSpecialty(assignedSpecialtyUserPrefs);
			self.setPreferencesObj(assignedSpecialtyUserPrefs);		
			self.savePreferences(true);
			
			if($("#" + compMenu.getAnchorElementId()).hasClass("opts-menu-empty")) {
				$("#" + compMenu.getAnchorElementId()).removeClass("opts-menu-empty").click(function() {
					MP_MenuManager.showMenu(compMenu.getAnchorElementId());
				});
			}
			
			if (compMenu) {
				var compMenuSpec = new MenuSelection(menuId);
				compMenuSpec.setLabel(self.getAssignedSpecialty());
				compMenuSpec.setIsSelected(true);
				
				compMenu.addMenuItem(compMenuSpec);
				
				compMenuSpec.setClickFunction(function (clickEvent) {
					clickEvent.id = menuId;                
					compMenu.removeMenuItem(compMenuSpec);
					
					if(!compMenu.m_menuItemArr.length) {
						$("#" + compMenu.getAnchorElementId()).addClass("opts-menu-empty");
					}					
					self.setAssignedSpecialty("");
					$('#' + compID + "SpecialtyBanner").show();
					if(specialtyDropDownId) {
						if(specialtyDropDownId.options[0]) {
							specialtyDropDownId.options[0].selected = true;
						}
						document.getElementById("specialtyAssignBtn" + compID).disabled = true;
						if($('#specialtyAssignBtn' + compID).hasClass("charges-o1-specialty-assign-button")) {
							$('#specialtyAssignBtn' + compID).removeClass("charges-o1-specialty-assign-button");
							$('#specialtyAssignBtn' + compID).addClass("charges-o1-specialty-assign-btn-disable");
						}
					}					
					self.setPreferencesObj(null);
					self.savePreferences(true);
				});
			}
			
			$('#' + compID + "SpecialtyBanner").hide();
			self.createSpecialtyPopup();
		});
	}
	catch(err) {
		MP_Util.LogJSError(self, err, "charges-o1.js", "addSpecialtyAssignEventHandler");
	}
};

/**
 * Builds the HTML for specialty banner
 */
ChargesO1Component.prototype.createSpecialtyBanner = function () {
	var compId = this.getComponentId();
	var specialtyBannerHTML = "<div class='charges-o1-specialty-banner-color'><div class='charges-o1-specialty-info-icon'></div>";
	specialtyBannerHTML += "<div class='charges-o1-specialty-info-label' id='specialtyInfoLabel" + compId + "'>"+ i18n.discernabu.charges_o1.SET_PHYSICIAN_SPECIALTY_CODE_CHARGES +"</div>";	
	specialtyBannerHTML += "<div class='charges-o1-specialty-label' id='specialtyLabel" + compId + "'>"+ i18n.discernabu.charges_o1.PHYSICIAN_SPECIALTY +"&nbsp<div class='charges-o1-specialty-list' id='specialtylist" + compId + "'>" + this.generateSpecialtyDropDownHTML() + "<div class='charges-o1-specialty-btn' id='specialtyAssignBtnDiv" + compId + "'><button class='charges-o1-specialty-assign-button' id='specialtyAssignBtn" + compId + "'>"+ i18n.discernabu.charges_o1.ASSIGN +"</button></div></div></div></div>";
	
	return specialtyBannerHTML;
};

/**
 * Builds the HTML string that includes the initial component layout and content
 * @returns {String} html
 */
ChargesO1Component.prototype.buildComponentBaseHTML = function(){
	var compID = this.getComponentId();
	var html = "";
		
	//Create the specialty banner for speciality selection.
	html += "<div id='" + compID + "SpecialtyBanner' class='charges-o1-specialty-banner'>" + this.createSpecialtyBanner() + "</div>";
	//Create the error alert banner for charge submit fail.
	html += "<div id='" + compID + "SubmitErrorBanner' class='charges-o1-submit-fail-banner'>" + this.createChargeSubmitFailBanner() + "</div>";
	//Create the error alert banner for charge retrieve fail.
	html += "<div id='" + compID + "RetrieveErrorBanner' class='charges-o1-retrieve-fail-banner'>" + this.createChargeRetrieveFailBanner()+ "</div>";	
	//Create the container, allows us to set display:table - necessary for some browsers like firefox
	html += "<div id='" + compID + "Container' class='charges-o1-container'>";
	//Build left side of component (controls, tables)
	html +=			"<div id='" + compID + "ContentContainer' class='charges-o1-content-cont'>";
	html +=				"<div id='" + compID + "HistoryContainer' class='charges-o1-history-container'>";
	html +=					"<div>";
	html +=						"<span class='charges-o1-rolling-table-title'>" + i18n.discernabu.charges_o1.MY_CHARGES + "</span>";
	html +=						"<a id='" + compID + "ToggleHistoricalTable' data-action='show'>" + i18n.discernabu.charges_o1.SHOW_CHARGE_HISTORY + "</a>";
	html +=					"</div>";
	html += 				"<div id='" + compID + "RollingHistoryContainer'>";
	html +=	 				"</div>";
	html +=					"<div id='" + compID + "HistoryTableContainer'></div>";
	html +=				"</div>"
	html +=              this.buildMyNoteSection();
	html +=				"<div class='charges-o1-cpt-table-cont'>";
	html +=					"<div id='" + compID + "CPTTableInstructions' class='charges-o1-cpt-table-header'>";
	html +=						this.buildControlsSection();
	html +=						"<span class='charges-o1-cpt-table-header-blank-cell'>&nbsp;</span>";
	html +=						"<span class='charges-o1-cpt-table-header-instructions'>&nbsp;</span>";
	html +=					"</div>";
	html +=					"<div id='" + compID + "CPTTableContainer'>";
	html +=						this.buildBlankCPTTable();
	html +=					"</div>";
	html +=                 "<div id='" + compID + "CPTTableFiller' class='charges-o1-table-filler'></div>";
	html +=				"</div>";
	html +=			"</div>";
	//Build right side of component (preview pane container)
	html +=			"<div id='" + compID + "SidePaneContainer' class='charges-o1-sidepane-cont'>";
	html +=				"</div>";
	html +=			"</div>";
	html +=	"</div>";
	
	return html;
};

/*  Rolling Table and Rolling Column*/

(function(){
	/**
	 * RollingTable (Will eventually make its own class)
	 */
	function RollingTable(component){
		this.m_id = "";
		this.m_component = component;
		this.m_columnTemplate = null;
		this.m_blankColumnTemplate = null;
		this.m_numOfColumnsToDisplay = 7; //Default
		this.m_numOfColumnsToPage = 7; //Default
		this.m_css = "";
		this.m_activeIndex = null;
		this.m_activeKey = null;
		this.m_startIndex = null;
		this.m_endIndex = null;
		this.m_columns = null;
		this.m_columnMap = null;
		this.m_isDatepickerEnabled = false;
		this.m_datepickerOptions = null;
	}

	/*
	 * Getters/Setters
	 */
	RollingTable.prototype.getId = function(){
		return this.m_id;
	};

	RollingTable.prototype.setId = function(id){
		this.m_id = id;
	};

	RollingTable.prototype.getComponent = function(){
		return this.m_component;
	};

	RollingTable.prototype.getNumOfColumnsToDisplay = function(){
		return this.m_numOfColumnsToDisplay;
	};

	RollingTable.prototype.setNumOfColumnsToDisplay = function(num){
		if (typeof num !== 'number'){
			return;
		}
		this.m_numOfColumnsToDisplay = num;
	};

	RollingTable.prototype.getNumOfColumnsToPage = function(){
		return this.m_numOfColumnsToPage;
	};

	RollingTable.prototype.setNumOfColumnsToPage = function(num){
		if (typeof num !== 'number'){
			return;
		}
		this.m_numOfColumnsToPage = num;
	};

	RollingTable.prototype.getCSS = function(){
		return this.m_css;
	};

	RollingTable.prototype.setCSS = function(css){
		if (typeof css !== 'string'){
			return;
		}
		this.m_css = css;
	};

	RollingTable.prototype.getActiveIndex = function(){
		return this.m_activeIndex;
	};

	RollingTable.prototype.setActiveIndex = function(indx){
		if (typeof indx !== 'number'){
			return;
		}
		this.m_activeIndex = indx;
	};

	RollingTable.prototype.getStartIndex = function(){
		return this.m_startIndex;
	};

	RollingTable.prototype.setStartIndex = function(indx){
		if (typeof indx !== 'number'){
			return;
		}
		this.m_startIndex = indx;
	};

	RollingTable.prototype.getEndIndex = function(){
		return this.m_endIndex;
	};

	RollingTable.prototype.setEndIndex = function(indx){
		if (typeof indx !== 'number'){
			return;
		}
		this.m_endIndex = indx;
	};

	RollingTable.prototype.getColumns = function(){
		if (!this.m_columns){
			this.m_columns = [];
		}
		return this.m_columns;
	};

	RollingTable.prototype.setColumns = function(cols){
		this.m_columns = cols;
	};

	RollingTable.prototype.getColumnMap = function(){
		if (!this.m_columnMap){
			this.m_columnMap = {};
		}
		return this.m_columnMap;
	};

	RollingTable.prototype.setColumnMap = function(map){
		this.m_columnMap = map;
	};

	RollingTable.prototype.getColumnTemplate = function(){
		return this.m_columnTemplate;
	};

	RollingTable.prototype.setColumnTemplate = function(column){
		if (!(column instanceof RollingColumn)){
			return;
		}
		this.m_columnTemplate = column;
	};

	RollingTable.prototype.getBlankColumnTemplate = function(){
		return this.m_blankColumnTemplate;
	};

	RollingTable.prototype.setBlankColumnTemplate = function(column){
		if (!(column instanceof RollingColumn)){
			return;
		}
		this.m_blankColumnTemplate = column;
	};

	RollingTable.prototype.isDatepickerEnabled = function(){
		return this.m_isDatepickerEnabled;
	};

	RollingTable.prototype.setIsDatepickerEnabled = function(flag){
		this.m_isDatepickerEnabled = !!flag;
	};

	RollingTable.prototype.getDatepickerOptions = function(){
		return this.m_datepickerOptions;
	};

	RollingTable.prototype.setDatepickerOptions = function(options){
		this.m_datepickerOptions = options;
	};

	/**
	 * Builds a column based on a column template and a data object
	 */
	RollingTable.prototype.buildColumn = function(template, data, id){
		var columnTemplate = template;
		var headerField = columnTemplate.getHeaderField();
		var bodyField = columnTemplate.getBodyField();
		var headerCSS = columnTemplate.getHeaderCSS();
		var bodyCSS = columnTemplate.getBodyCSS();
		var columnCSS = columnTemplate.getColumnCSS();
		var columnID = id;
		//var isActive = this.getActiveIndex() === index;
		var sHeader = "";
		var sBody = "";
		var sDoc = "";
		var html = "";
		
		//Set the attributes that are based off of fields
		if (data){
			if (data[headerField]){
				sHeader = data[headerField]; 
			}
			if (data[bodyField]){
				sBody = data[bodyField];
				sDoc = data["DOCUMENT"] || "--";
			}
		}
		
		columnCSS += " rolling-table-column";
		
		if (columnID){
			html +=  "<span id='" + columnID + "' class='" + columnCSS + "'>";
		} else {
			html +=  "<span class='" + columnCSS + "'>";
		}
		html +=    "<div class='" + headerCSS + "'>" + sHeader + "</div>";
		html +=    "<div class='" + bodyCSS + "'>" + "<div>" + sBody + "</div><div class='charges-o1-charged-doc'>" + sDoc + "</div></div>";
		html +=  "</span>";
		
		return html;
	};

	/**
	 * Builds the table row using the defined start/end indices
	 */
	RollingTable.prototype.buildRow = function(){
		var columns = this.getColumns();
		var colLen = columns.length;
		var i;
		var startIndex = this.getStartIndex();
		var endIndex = this.getEndIndex();
		var activeIndex = this.getActiveIndex();
		var numColumnsToDisplay = this.getNumOfColumnsToDisplay();
		var html = "";
		var tmpCSS = "";
		
		//Sanity checks
		if (endIndex < startIndex || (colLen <= startIndex)){
			return;
		}
			
		//Append columns html
		for (i = startIndex; i <= endIndex; i++){
	        //if still within the table index range, append the column HTML
			if (i < colLen){
				html += columns[i];
			} else { //otherwise, append blank column
				if (i === colLen || i === startIndex){
					tmpCSS = this.getBlankColumnTemplate().getColumnCSS();
					this.getBlankColumnTemplate().setColumnCSS(tmpCSS + " first");
				} else if (i === endIndex){
					this.getBlankColumnTemplate().setColumnCSS(tmpCSS + " last");
				}
				html += this.buildColumn(this.getBlankColumnTemplate(), null, null);
				
				this.getBlankColumnTemplate().setColumnCSS(tmpCSS);
			}
			
		}
		
		if (this.isDatepickerEnabled()){
			html += "<span class='charges-o1-date-col'><input style='display:none;' id='" + this.getId() + "DateBox" + "' type='button' /></span>";
		}
		
		return html;
	};

	RollingTable.prototype.buildTable = function(){
		var columns = this.getColumns();
		var startIndex = this.getStartIndex();
		var endIndex = this.getEndIndex();
		var numColumnsToDisplay = this.getNumOfColumnsToDisplay();
		var tableID = this.getId();
		var tableCSS = this.getCSS();
		var html = "";
		//No tempate exists, so can not build
		if (!tableID || columns.length === 0){
			return;
		}
		
		//Set the start/end indices
		if (this.getStartIndex() === null){
			this.setStartIndex(0);
		}
		if (this.getEndIndex() === null){
			this.setEndIndex(this.getStartIndex() + (numColumnsToDisplay - 1));
		}
		
		//Build container
		html += "<div id='" + tableID + "' class='" + tableCSS + "'>";
		html +=    this.buildRow();
		html += "</div>";
		
		return html;
	};


	RollingTable.prototype.clearData = function(){
		this.m_columns = [];
		this.m_columnMap = {};
	};

	RollingTable.prototype.bindData = function(data){
		if (!data || !(data instanceof Array)){
			throw new Error("Called bindData on Rolling Table with non Array type for data parameter.  Please pass an Array of JSON results.");
		}
		
		//Clear existing data
		this.clearData();
		var columnTemplate = this.getColumnTemplate();
		var dataLength = data.length;
		var columns = this.getColumns();
		var columnMap = this.getColumnMap();
		var idKey = "";
		var i;
		
		this.m_activeKey = null;
		
		for (i = 0; i < dataLength; i++){
			idKey = this.getId() + "Column" + i;
			if (this.getActiveIndex() === i){
				this.m_activeKey = idKey;
			}
			columns.push(this.buildColumn(columnTemplate, data[i], idKey));
			columnMap[idKey] = data[i];
		} 
	};

	/**
	 * Attaches event handlers
	 */
	RollingTable.prototype.attachColumnBodyHover = function(){
		var id = this.getId();
		var columnMap = this.getColumnMap();
		var columnTemplate = this.getColumnTemplate();
		var colClass = ".rolling-table-column";
		var jqTable = $("#" + id);
		var hoverFunc = columnTemplate.getHoverFunc();
		var hoverTimeout = null;
		var tooltip = new MPageTooltip().setShowDelay(0);
		var component = this.getComponent();
		
		if (!hoverFunc){
			return;
		}
		
		function clearTooltip(){
			if (tooltip.getContent()){
				tooltip.getContent().remove();
			}
			if (hoverTimeout){
				clearTimeout(hoverTimeout);
			}
		}
		
		jqTable.on('mouseenter mouseleave', colClass, function(event){
			//Grab the data that goes with this column
			var jqCurrentTarget = $(event.currentTarget);
			var colID = jqCurrentTarget.prop("id");
			
			if (!colID){  //Not an appropriate column
				return;
			}
			
			var data = columnMap[colID];
			var obj = {
					COLUMN_ID: colID,
					DATA: data,
					EVENT: event
			};
			//Creates the tooltip!
			clearTooltip();
			if (event.type === 'mouseenter'){
				jqCurrentTarget.addClass("mpage-tooltip-hover");
				hoverTimeout = setTimeout(function(){
					var posX = event.pageX;
					var posY = event.pageY;
					
					var html = hoverFunc.apply(component, [obj]);
					tooltip.setX(posX).setY(posY).setAnchor(jqCurrentTarget.get(0)).setContent(html);
					tooltip.getContent().addClass("charges-o1-tooltip-timeline");
					tooltip.show();
				}, 500);
			} else {
				jqCurrentTarget.removeClass("mpage-tooltip-hover");
			}				
		});
	};

	RollingTable.prototype.attachColumnClick = function(){
		var self = this;
		var id = this.getId();
		var columnMap = this.getColumnMap();
		var columnTemplate = this.getColumnTemplate();
		var colClass = ".rolling-table-column";
		var jqTable = $("#" + id);
		var clickFunc = columnTemplate.getClickFunc();
		var component = this.getComponent();
		var loggedInProviderid = parseInt(component.getCriterion().provider_id,10);
		
		jqTable.on('click', colClass, function(event){
			var jqCurrentTarget = $(event.currentTarget);
			var colID = jqCurrentTarget.prop("id");
			var hasHistoricalCPT = false;
			var dateObj = null;			
			if (!colID){
				return;
			}
			
			var data = columnMap[colID];
			var bucketLength = data.BUCKET.length;
			var obj = {
					COLUMN_ID: colID,
					DATA: data,
					EVENT: event
			};
			
			if (!jqCurrentTarget.hasClass("selected")){
				jqTable.children(".selected").removeClass("selected");
				jqCurrentTarget.addClass("selected");
				self.m_component.m_isCPTSubmitted = false;
				for (var index = 0; index < bucketLength; index++) {
					var chargesHistoryObj = data.BUCKET[index];
					// verifying physician id is nothing but CPT submitted to which provider.
					var verifyPhysId = parseInt(chargesHistoryObj.VERIFY_PHYS_ID, 10);
					// updated physician id is nothing but CPT submitted from which provider.
					var updatedPhysId = parseInt(chargesHistoryObj.UPDT_ID, 10);
					// Checking verifying physician id & updated physician id with logged in physician id for displaying historical CPT details pane.
					if (loggedInProviderid === verifyPhysId || loggedInProviderid === updatedPhysId) {
						hasHistoricalCPT = true;
						self.m_component.m_isCPTSubmitted = true;
						break;
					}
				}
				clickFunc.apply(component, [hasHistoricalCPT, data]);
				if (self.isDatepickerEnabled()){
					$("#" + id + "DateBox").datepicker('setDate', data.DATE_OBJ);
				}
			}
			
		});
	};

	RollingTable.prototype.attachDatepicker = function(){
		var id = this.getId();
		var jqDatebox = $("#" + id + "DateBox");
		jqDatebox.datepicker(this.getDatepickerOptions());
		jqDatebox.css("display", "");
	};

	RollingTable.prototype.finalizeTable = function(){
		this.attachColumnBodyHover();
		this.attachColumnClick();
		if (this.isDatepickerEnabled()){
			this.attachDatepicker();
		}
		if (this.m_activeKey){
			$("#" + this.m_activeKey).click();
		}
	};

	function RollingColumn(){
		this.m_headerField = null;
		this.m_bodyField = null;
		this.m_headerCSS = "";
		this.m_bodyCSS = "";
		this.m_columnCSS = "";
		this.m_uniqueField = null;
		this.m_hoverFunc = null;
		this.m_clickFunc = null;
		this.m_data = null;
	}

	RollingColumn.prototype.getHeaderField = function(){
		return this.m_headerField;
	};

	RollingColumn.prototype.setHeaderField = function(field){
		if (typeof field !== 'string'){
			return;
		}
		this.m_headerField = field;
	};

	RollingColumn.prototype.getHeaderCSS = function(){
		return this.m_headerCSS;
	};

	RollingColumn.prototype.setHeaderCSS = function(css){
		if (typeof css !== 'string'){
			return;
		}
		this.m_headerCSS = css;
	};

	RollingColumn.prototype.getBodyField = function(){
		return this.m_bodyField;
	};

	RollingColumn.prototype.setBodyField = function(field){
		if (typeof field !== 'string'){
			return;
		}
		this.m_bodyField = field;
	};

	RollingColumn.prototype.getBodyCSS = function(){
		return this.m_bodyCSS;
	};

	RollingColumn.prototype.setBodyCSS = function(css){
		if (typeof css !== 'string'){
			return;
		}
		this.m_bodyCSS = css;
	};

	RollingColumn.prototype.getColumnCSS = function(){
		return this.m_columnCSS;
	};

	RollingColumn.prototype.setColumnCSS = function(css){
		if (typeof css !== 'string'){
			return;
		}
		this.m_columnCSS = css;
	};

	RollingColumn.prototype.getUniqueField = function(){
		return this.m_uniqueField;
	};

	RollingColumn.prototype.setUniqueField = function(field){
		if (typeof field !== 'string'){
			return;
		}
		this.m_uniqueField = field;
	};

	RollingColumn.prototype.getData = function(){
		return this.m_data;
	};

	RollingColumn.prototype.setData = function(data){
		this.m_data = data;
	};

	RollingColumn.prototype.getHoverFunc = function(){
		return this.m_hoverFunc;
	};

	RollingColumn.prototype.setHoverFunc = function(callback){
		if (typeof callback !== 'function'){
			return;
		}
		this.m_hoverFunc = callback; 
	};

	RollingColumn.prototype.getClickFunc = function(){
		return this.m_clickFunc;
	};

	RollingColumn.prototype.setClickFunc = function(callback){
		if (typeof callback !== 'function'){
			return;
		}
		this.m_clickFunc = callback;
	};
	ChargesO1Component.prototype.RollingTable = RollingTable.prototype.constructor;
	ChargesO1Component.prototype.RollingColumn = RollingColumn.prototype.constructor;
})();


/**
 * Map the Charges O1 object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "WF_CHARGES" filter 
 */
MP_Util.setObjectDefinitionMapping("WF_CHARGES", ChargesO1Component);
