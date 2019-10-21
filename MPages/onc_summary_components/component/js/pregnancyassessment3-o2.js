function PregAssessment3StyleWF() {
	this.initByNamespace("pa3-wf");
}

PregAssessment3StyleWF.inherits(ComponentStyle);

/**
 * The Pregnancy Tertiary Assessment component retrieves the results documented for a patient
 * for various assessments.
 *
 * @param {criterion}
 *            criterion : The Criterion object which contains information needed
 *            to render the component.
 */
function PregAssessment3ComponentWF(criterion) {
	this.setCriterion(criterion);
	this.setLookBackDropDown(true);
	this.setStyles(new PregAssessment3StyleWF());
	this.setComponentLoadTimerName("USR:MPG.TERTIARYASSESSMENT.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.TERTIARYASSESSMENT.O2 - render component");
	
	// Flag for pregnancy onset date lookback time frame
	this.setPregnancyLookbackInd(true);
	
	// Flag for resource required
	this.setResourceRequired(true);
	
	// Constant to represent the Tertiary Component
	this.assessmentSection = 3;  

	CERN_EventListener.addListener(this, "pregnancyInfoAvailable", this.retrieveComponentData, this);
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent
 * object.
 */
PregAssessment3ComponentWF.prototype = new MPageComponent();
PregAssessment3ComponentWF.prototype.constructor = MPageComponent;

/**
 * Map the Tertiary Assessment option 2 object to the bedrock filter mapping so the
 * architecture will know what object to create when it finds the "WF_PREG_SA"
 * filter.
 */
MP_Util.setObjectDefinitionMapping("WF_PREG_TA", PregAssessment3ComponentWF);

/**
 * Construct component level menu options i.e. 'Fundal Height' and 'Labor Graph'
 * options for Pregnancy Assessment component. 
 */
PregAssessment3ComponentWF.prototype.preProcessing = function() {
	var criterion = this.getCriterion();
	var compMenu = this.getMenu();
	var compId = this.getComponentId();
	var pai18n = i18n.discernabu.pregassessmentbase_o2;
		
	// Used to call menu item click event handler
	var fundalGraphItem = new MenuSelection("fundalGraph" + compId);
	var laborGraphItem = new MenuSelection("laborGraph" + compId);
	var patientGenderInfo = criterion.getPatientInfo().getSex();
	
	var self = this;	
	// Check component is displayable and component menu exists
	if (!this.isDisplayable() || !compMenu) {
		return;
	}
	if (patientGenderInfo === null || patientGenderInfo.meaning === null || patientGenderInfo.meaning !== "FEMALE") {
		// No menu option should be added as patient is not a female
		return;
	}

	fundalGraphItem.setLabel(pai18n.FUNDAL_HEIGHT);
	fundalGraphItem.setClickFunction(function(clickEvent) {
		clickEvent.id = "fundal" + compId;
		self.menuItemOnClickHandler(clickEvent);
	});
		
	laborGraphItem.setLabel(pai18n.LABOR_GRAPH);
	laborGraphItem.setClickFunction(function(clickEvent) {
		clickEvent.id = "labor" + compId;
		self.menuItemOnClickHandler(clickEvent);
	});
		
	compMenu.addMenuItem(fundalGraphItem);
	compMenu.addMenuItem(laborGraphItem);
	MP_MenuManager.updateMenuObject(compMenu);
};

/**
 *This method handles component level menu options ('Labor Graph' & 'Fundal Height')
 * @param :clickEvent {Event} - Mouse click event.
 */
PregAssessment3ComponentWF.prototype.menuItemOnClickHandler = function(clickEvent) {
	var criterion = this.getCriterion();
	var pai18n = i18n.discernabu.pregassessmentbase_o2;
	var eventId = clickEvent.id;
	var compId = this.getComponentId();
	var pregInfoSR = null;
	var pregInfoObj = null;

	//Holds Pregnancy Discern Win32 Object.
	var pregDiscernObject = null;

	//Check to see if the pregnancyInfo object is available.
	pregInfoSR = MP_Resources.getSharedResource("pregnancyInfo");
	if (pregInfoSR && pregInfoSR.isResourceAvailable()) {
		pregInfoObj = pregInfoSR.getResourceData();
	}
	else {
		//The pregnancy shared resource is not available so there isn't anything we can do at this point.
		return;
	}

	try {
		pregDiscernObject = window.external.DiscernObjectFactory("PREGNANCY");
		MP_Util.LogDiscernInfo(this, "PREGNANCY", "pregnancyassessment3-o2.js", "menuItemOnClickHandler");
		if (eventId === "fundal" + compId) {
			pregDiscernObject.LaunchFundalHeightGraph(window, criterion.person_id, pregInfoObj.getPregnancyId());
		} else if(eventId === "labor" + compId) {
			pregDiscernObject.LaunchLaborGraph(window, criterion.person_id, pregInfoObj.getPregnancyId());
		}
	}
	catch (discernErr) {
		MP_Util.LogJSError(discernErr, this, "pregnancyassessment3-o2.js", "menuItemOnClickHandler");
		return;
	}
	
	//release pregnancy object
	pregDiscernObject = null;
};

/**
 * Removes menu options for Tertiary Assessment component and it will
 * be called if pregnacyId is null/0/-1 from retrieveComponentData() method
 */
PregAssessment3ComponentWF.prototype.removeMenuOptions = function() {
	var menuComp = this.getMenu();
	var compId = this.getComponentId();
	var menuItems = menuComp.getMenuItemArray();
	var menuId = "";
	
	var fundalGraphItem = "fundalGraph" + compId;
	for (i = 0;  i < menuItems.length; i++) {
		menuId = menuItems[i].m_menuItemId;
		if (menuId === fundalGraphItem){
			menuComp.removeMenuItem(menuItems[i]);
			break;
		} 
	}

	var laborGraphItem = "laborGraph" + compId;
	for (i = 0;  i < menuItems.length; i++) {
		menuId = menuItems[i].m_menuItemId;
		if (menuId === laborGraphItem) {
			menuComp.removeMenuItem(menuItems[i]);
			break;
		}
	}
	
	if (menuItems.length === 0) {
		//Disable the menu for this component and unbind all click events
		$("#" + menuComp.getAnchorElementId()).addClass("opts-menu-empty").unbind("click");
	}
};

/**
 * Retrieves the pregnancy information from the shared resources to check
 * whether the patient has an active pregnancy or not.
 */
PregAssessment3ComponentWF.prototype.RetrieveRequiredResources = function() {
	var pregInfoObj = null;
	// Check to see if the pregnancyInfo object is available to use
	pregInfoObj = MP_Resources.getSharedResource("pregnancyInfo");
	if (pregInfoObj && pregInfoObj.isResourceAvailable()) {
		this.retrieveComponentData();
	}
	else {
		// Kick off the pregnancyInfo data retrieval
		// This component already listens for the pregnancyInfoAvailable event so it will load when the SharedResource is available.
		PREGNANCY_BASE_UTIL_O1.LoadPregnancyData(this.getCriterion());
	}
};

/**
 * Creates the necessary parameter array for the data acquisition and makes
 * the necessary script call to retrieve the Tertiary Assessment data.
 */
PregAssessment3ComponentWF.prototype.retrieveComponentData = function() {
	var sendAr = [];
	var criterion = this.getCriterion();
	var encntrOption=0;
	var messageHTML = "";
	var pai18n = i18n.discernabu.pregassessmentbase_o2;
	var pregInfoObj = null;
	var pregInfoSR = MP_Resources.getSharedResource("pregnancyInfo");
	var pregnancyId = 0.0;
	var lookBackUnits = this.getLookbackUnits();
	var lookBackUnitTypeFlag = this.getLookbackUnitTypeFlag();
	var df = MP_Util.GetDateFormatter();
	var countText = "";
	var current_encntr = criterion.encntr_id;

	encntrOption= this.getScope();
	// Check to make sure the patient is a female with an active pregnancy
	var patientGenderInfo = criterion.getPatientInfo().getSex();
	if (patientGenderInfo === null || patientGenderInfo.meaning === null || patientGenderInfo.meaning !== "FEMALE") {
		// Male patient so just show a disclaimer
		messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + pai18n.NOT_FEMALE + "</span></h3><span class='res-none'>" + pai18n.NOT_FEMALE + "</span>";
		this.finalizeComponent(messageHTML, countText);
		return;
	}
	else if (pregInfoSR && pregInfoSR.isResourceAvailable()) {
		pregInfoObj = pregInfoSR.getResourceData();
		pregnancyId = pregInfoObj.getPregnancyId();
		if (pregnancyId === -1) {
			this.removeMenuOptions();
			// Error occurred while retrieving pregnancy information
			messageHTML = "<h3 class='info-hd'><span class='res-normal'>";
			messageHTML += pai18n.PREG_DATA_ERROR + "</span></h3><span class='res-none'>";
			messageHTML += pai18n.PREG_DATA_ERROR + "</span>";
			this.finalizeComponent(messageHTML, countText);
			return;
		}
		else if (!pregnancyId) {
			this.removeMenuOptions();
			// Female patient with no active pregnancy. Show disclaimer and give the option to add a pregnancy
			messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + pai18n.NO_ACTIVE_PREG + "</span></h3><span class='res-none'>" + pai18n.NO_ACTIVE_PREG + "</span>";
			this.finalizeComponent(messageHTML, countText);
			return;
		}
		else {
			sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.position_cd + ".0", criterion.ppr_cd + ".0", pregInfoObj.getLookBack(), this.assessmentSection, "0.0");
			
			var groups = this.getGroups();
			for(var i = 0; i < groups.length; i++) {
				var group = groups[i];
				if( group instanceof MPageEventSetGroup) {
					sendAr.push(MP_Util.CreateParamArray(group.getEventSets(), 1));
				}
			}
			
			sendAr.push(lookBackUnits, lookBackUnitTypeFlag, current_encntr, encntrOption);
			MP_Core.XMLCclRequestWrapper(this, "MP_GET_PREG_ASSESSMENT", sendAr, true);
		}
	}
};

/**
 * Renders the Tertiary Assessment component by calling the Assessment Base component.
 *
 * @param recordData -
 *            has the information retrieved from the Tertiary Assessment script call.
 */
PregAssessment3ComponentWF.prototype.renderComponent = function(recordData) {
	var criterion = this.getCriterion();
	
	var slaTimer = MP_Util.CreateTimer("CAP:MPG.TERTIARYASSESSMENT.O2- rendering component");
	if (slaTimer) {
		slaTimer.SubtimerName = criterion.category_mean;
		slaTimer.Stop();
	}
	
	CERN_PREG_ASSESSMENT_BASE_O2.RenderAssessmentSection(this, recordData, this.assessmentSection);
};
	