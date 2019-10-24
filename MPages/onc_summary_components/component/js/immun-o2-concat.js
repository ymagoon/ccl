function ImmunizationsO2ComponentStyle() {
	this.initByNamespace("immun-o2");
}

ImmunizationsO2ComponentStyle.prototype = new ComponentStyle();
ImmunizationsO2ComponentStyle.prototype.constructor = ComponentStyle;


/**
 * The Immunizations component will allow the user to view immunization info for the patient from within the MPage
 *
 * @param {Criterion} criterion The criterion containing the information about the current environment
 * @returns {undefined} returns nothing
 */
function ImmunizationsO2Component(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new ImmunizationsO2ComponentStyle());
	this.setIncludeLineNumber(true);
	this.setComponentLoadTimerName("USR:MPG.IMMUNIZATIONS.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.IMMUNIZATIONS.O2 - render component");
	this.m_immunizationsTable = null;
	this.m_immunForecastTable = null;
	this.m_isForecastCompat = 0;
	this.m_updatedImmunListenerCount = 0;
	this.m_immuni18n = i18n.discernabu.immunization_o2;

	this.m_lastSelectedRow = "";
	//Keeps the Row Id of last selected row
	this.bStartTimer = true;
	// flag to decide whether the CAP timer for row click need to be start or not
	this.m_patientDOB = this.getCriterion().getPatientInfo().getDOB();
	this.m_personnelArray = null;
	this.compNS = this.getStyles().getNameSpace();
	this.compID = 0;
	this.m_resultCount = 0;
	//Cache the side panel DOM element and object.
	this.m_sidePanelContainer = null;
	//HI stand for Healthe Intent
	this.m_sidePanel = null;
	this.m_popup = null;
	this.m_plusMenu = null;
	this.m_hiSidePanel = null;
	this.m_HIImmunizationsTable = null;
	this.m_pager = null;
	this.m_pageIndex = 0;
	this.m_millDataInd = 1;
	this.m_HITestURI = "";
	this.m_HILookUpKey = "";
	this.m_aliasType = "";
	this.m_aliasPool = "";
	this.m_firstRowElement = null;
	this.m_prevMill = true;
	this.m_prevHi = false;
	this.m_nameofHIImmun = "";
	this.m_isPager = false;
	this.m_isCellClick = false;
	this.m_isNextPageForSidePanel = false;
	this.m_vaccineGroupId = "";
	this.m_sidepanelPageNumber = 0;
	this.m_isRenderSidePanelOnPageChange = false;
	this.m_hiDataGlobal = "";
	this.m_buttonAlreadyExist = true;
	this.m_clickEvent = null;
	this.m_prevContents = "";
	this.m_lastVaccineGrpId = "";
	this.m_countInnerDiv = 0;
	this.m_countDiv = 0;
	this.m_doesSidePanelExist = false;
	this.m_totalImmunCount = 0;
	this.m_criterion = criterion;
	this.m_personnelInfo = [];
	this.m_prevVacGroupId = "";
	this.m_selectedImmunNames = [];
	this.m_popupSelectCount = 0;
	this.m_checkboxHTML = "";
	this.m_selectButton = null;
	this.m_cancelButton = null;
	this.m_immunListLeftModal = [];
	this.m_modalImmunListCont = null;
	this.m_criterion = criterion;
	this.m_immunValidationObj = [];
	this.m_millWasClikedInBetween = false;
	this.m_tempHistoricalDoses = [];
	this.m_loadedVaccinesInModal = [];
	this.m_vaccineModalToggleList = [];
	this.m_panelShellFieldsRenderedCnt = 0;
	this.m_modalShellFieldsRenderedCnt = 0;
	this.m_fieldCount = 0;
	this.m_docBtnCount = 0;
	this.m_retrievedItemCount = 0;
	this.m_removeLastImmun = 0;
	this.m_registryImportCOM = null;
	//These collection objects can be used to find a date selector to access the selected date, date flag and date precision
	//Once you insert any item in this collection you can simply refer to the DateSelector properties and read the values for date, flag and precision
	this.m_VISDateSelectorCollection = [];
	this.m_adminDateSelectorCollection = [];
	this.m_substanceExpDateSelectorCollection = [];
	
	this.m_lastModifiedVaccineGroupEventCode = 0;
	this.m_lastModifiedVaccineRow = null;
	//Array which will hold immunizations details for batch save
	this.m_immunizationsToSave = [];
	this.m_immunSatisfied = [];
	this.m_comboParentDetails = [];
	this.m_popupListObj = null;
	this.m_immunizationModalType = null;
	this.m_immunExceptionCodeValues = null;
	this.m_providerInfo = null;
}

ImmunizationsO2Component.prototype = new MPageComponent();
ImmunizationsO2Component.prototype.constructor = MPageComponent;


ImmunizationsO2Component.prototype.reloadClassLevelvariables = function() {
	this.m_resultCount = 0;
	//Cache the side panel DOM element and object.
	this.m_sidePanelContainer = null;
	//HI stand for Healthe Intent
	this.m_sidePanel = null;
	this.m_hiSidePanel = null;
	this.m_HIImmunizationsTable = null;
	this.m_pager = null;
	this.m_pageIndex = 0;
	this.m_millDataInd = 1;
	this.m_HITestURI = "";
	this.m_HILookUpKey = "";
	this.m_aliasType = "";
	this.m_aliasPool = "";
	this.m_firstRowElement = null;
	this.m_prevMill = true;
	this.m_prevHi = false;
	this.m_nameofHIImmun = "";
	this.m_isPager = false;
	this.m_isCellClick = false;
	this.m_isNextPageForSidePanel = false;
	this.m_vaccineGroupId = "";
	this.m_sidepanelPageNumber = 0;
	this.m_isRenderSidePanelOnPageChange = false;
	this.m_hiDataGlobal = "";
	this.m_buttonAlreadyExist = true;
	this.m_clickEvent = null;
	this.m_prevContents = "";
	this.m_lastVaccineGrpId = "";
	this.m_countInnerDiv = 0;
	this.m_countDiv = 0;
	this.m_doesSidePanelExist = false;
	this.m_totalImmunCount = 0;
	this.m_prevVacGroupId = "";
	this.m_millWasClikedInBetween = false;
	this.m_lastSelectedRow = null;
	this.m_removeLastImmun = 0;
	
	// Clear the collection objects
	this.clearShellCollectionsObj();
	
	this.m_modalVaccineEventsData = null;
	this.VISDetailsForEventCode = [];
	
	this.m_immunizationModalType = null;
	this.m_immunExceptionCodeValues = null;
	this.m_providerInfo = null;
};

/**
 * Sets the bedrock indicator preference for the Immunization Forecast to be
 * opted in/out
 * 
 * @param {Boolean} value
 *            Indicator value set as the preference
 */
ImmunizationsO2Component.prototype.setImmunForecastBRInd = function(value) {
	this.m_immunForecastBRInd = value;
};

/**
 * Gets the bedrock indicator preference for the Immunization Forecast to be
 * opted in/out
 * 
 * @returns {Number} Indicator value set as the preference
 */
ImmunizationsO2Component.prototype.getImmunForecastBRInd = function() {
	return (this.m_immunForecastBRInd ? 1 : 0);
};

/**
 * Sets the bedrock indicator preference for the Immunization Order Folder
 * 
 * @param {Boolean} value
 *            Indicator value set as the preference
 */
ImmunizationsO2Component.prototype.setImmunOrderBRInd = function(value) {
	this.m_immunOrderBRInd = value;
};

/**
 * Gets the bedrock indicator preference for the Immunization Order Folder
 *
 * @returns {Boolean} Indicator value set as the preference
 */
ImmunizationsO2Component.prototype.getImmunOrderBRInd = function() {
	return this.m_immunOrderBRInd;
};
/**
 * Creates the filterMappings that will be used when loading the component's bedrock settings for InfoButton
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.loadFilterMappings = function() {

	this.addFilterMappingObject("WF_IMMUN_EXT_DATA_IND", {
		setFunction: this.setExternalDataInd,
		type: "BOOLEAN",
		field: "FREETEXT_DESC"
	});

	this.addFilterMappingObject("WF_IMMUN_EXT_DATA_TEST_URI", {
		setFunction: this.setHITestUri,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	
	//Opt to retrieve Immunizations Forecast data from CDC
	this.addFilterMappingObject("WF_IMMUN_FRCST", {
		setFunction : this.setImmunForecastBRInd,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});
	
	//Order folder pref in berock
	this.addFilterMappingObject("WF_IMMUN_ORD_FLDR", {
		setFunction : this.setImmunOrderBRInd,
		type : "ARRAY",
		field : "PARENT_ENTITY_ID"
	});
};

/**
 * An event was fired from the scratchpad which indicates that all of the orders on the scratchpad have been submitted.
 * As of now, the only pending items the Immunizations component would have is orders on the scratchpad; thus, we can safely remove our component
 * from the pendingDataSR. Note that if this changes, then the following logic will have to check all other pending items before removing itself from the pendingDataSR.
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.checkPendingSR = function(){
	var componentId = this.getComponentId();
	var dataObj = {};
	var pendingSR = MP_Resources.getSharedResource('pendingDataSR');
	if (pendingSR) {
		//The shared resource exists
		dataObj = pendingSR.getResourceData();
		if(dataObj){
			var idx = dataObj.pendingDataCompArr.length;
			//Since the shared resource exists ONLY remove the current component from pending Array as other components may contain pending data.
			while (idx--) {
				//From testing JS wants to convert the componentID to string when added to the pendingDataCompArr.  DON'T change to '==='.
				if (String(componentId) === dataObj.pendingDataCompArr[idx]) {
					dataObj.pendingDataCompArr.splice(idx, 1);
					break;
				}
			}
			//Update the shared resource with current data.
			MP_Resources.setSharedResourceData('pendingDataSR', dataObj);
			//If components contain pending data notify the Powerchart framework
			dataObj.pendingDataObj.SetPendingData(dataObj.pendingDataCompArr.length === 0 ? 0 : 1);
		}
	}
};

/**
 * Pre processing to get page level filters
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.preProcessing = function() {

	var criterion = this.getCriterion();
	var self = this;
	var resourceName = criterion.category_mean + "pageLevelFilters";
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
						self.setHILookupKey(filterObj.VALS[0].FTXT);
						break;
					case "WF_HI_ALIAS_TYPE":
						self.setAliasType(filterObj.VALS[0].FTXT);
						break;
					case "WF_HI_ALIAS_POOL_CD":
						self.setAliasPoolCd(filterObj.VALS[0].PE_ID);
						break;
				}
			}
		}
	}

	this.setPlusAddEnabled(false);
	this.setPlusAddCustomInd(false);
	
	// enable the plus add sign next to the title and set it as custom
	if (this.getImmunForecastBRInd()) {
		this.setPlusAddEnabled(true);
		this.setPlusAddCustomInd(true);
	}

	if(self.getExternalDataInd()) {
		this.performMFA();
	}
};

/**
 * Gets the Multi factor authentication data and sets the mfaAuthStatus which is used in alert banner.
 */
ImmunizationsO2Component.prototype.performMFA = function() {
	var authStatus = new Mfa_Auth().RetrieveMfaAuthStatus();
	var authResourceAvailable = authStatus && authStatus.isResourceAvailable();
	var authStatusData = authResourceAvailable && authStatus.getResourceData();

	if (authStatusData) {
		// 0 - Authentication Success 5 - Authentication Not Required
		authStatusData.value = authStatusData.status === 0 || authStatusData.status === 5;

		this.mfaAuthStatus = authStatusData;
	} else {
		// Display generic utility error message.
		this.mfaAuthStatus = { value: false, message: i18n.discernabu.mfa_auth.MFA_ERROR_MSG, status: 4 };
	}

	// Audit the MFA event.
	this.auditMFAEvent();
};

/**
 *  Adds audit event data for multi factor authentication
 */
ImmunizationsO2Component.prototype.auditMFAEvent = function() {
	var providerID = this.criterion.provider_id + '.0';
	var mpEventAudit = new MP_EventAudit();
	var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	var dateTime = dateFormatter.format(new Date(), mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);

	mpEventAudit.setAuditMode(0);
	mpEventAudit.setAuditParticipantType('PERSON');
	mpEventAudit.setAuditParticipantRoleCd('PROVIDER');
	mpEventAudit.setAuditParticipantID(providerID);
	mpEventAudit.setAuditParticipantIDType('PROVIDER_NUMBER');
	mpEventAudit.setAuditDataLifeCycle(null);
	mpEventAudit.setAuditEventName('MPD_IMMUNIZATIONS_MFA_ATTEMPT');
	mpEventAudit.setAuditEventType('SECURITY');
	mpEventAudit.setAuditParticipantName('STATUS=' + this.mfaAuthStatus.status + ';DATE=' + dateTime);
	mpEventAudit.addAuditEvent();
	mpEventAudit.submit();
};

/**
 * Overriding MPageComponent's postProcessing method to update the result count in the navigator section
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.postProcessing = function() {
	MPageComponent.prototype.postProcessing.call(this);

	//Update the component result count
	if (!this.m_isForecastCompat) {
		// Update the component result count
		CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
			"count": this.m_resultCount
		});
	}
	
	// Add a listener to refresh the component when updated immunization is available
	CERN_EventListener.removeListener({},"Updated Immunizations Available",this.refreshComponent,this);
	CERN_EventListener.addListener({},"Updated Immunizations Available",this.refreshComponent,this);
	CERN_EventListener.removeListener(this, EventListener.EVENT_ORDER_ACTION, this.checkPendingSR, this);
	CERN_EventListener.addListener(this, EventListener.EVENT_ORDER_ACTION, this.checkPendingSR, this);
};

/**
 * This function is implemented at the component level to provide functionality for the core level Add Plus sign.
 * A menu will appear below the plus sign when it is clicked.
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.openTab = function() {
	try {
		var self = this;
		if (!this.m_plusMenu) {
			//create menu for drop down if it doesn't already exist
			this.m_plusMenu = new MPageUI.StandardMPageMenu(this.getStyles().getNameSpace() + "Add");
			if (CERN_Platform.inMillenniumContext() && this.getImmunOrderBRInd() && this.getImmunOrderBRInd().length) {
				this.m_plusMenu.addOptions([
        			{ label: this.m_immuni18n.ORDER_IMMUN, onSelect: function() {self.showImmunizationOrderModal();}},
        			{ label: this.m_immuni18n.DOC_HX, onSelect: function() {self.m_immunizationModalType = self.ImmunizationsModalEnum.DOCUMENT_HISTORY; self.getPopupImmunList(); self.createDocHistoryModal(); }},
				{ label: this.m_immuni18n.CHART_EXCEPTION + "...", onSelect: function() {self.m_immunizationModalType = self.ImmunizationsModalEnum.CHART_EXCEPTION; self.getPopupImmunList(); self.createChartExceptionModal(); }}
        		]);
			} else {
				this.m_plusMenu.addOptions([
				    { label: this.m_immuni18n.DOC_HX, onSelect: function() {self.m_immunizationModalType = self.ImmunizationsModalEnum.DOCUMENT_HISTORY; self.getPopupImmunList(); self.createDocHistoryModal(); }},
				    { label: this.m_immuni18n.CHART_EXCEPTION + "...", onSelect: function() {self.m_immunizationModalType = self.ImmunizationsModalEnum.CHART_EXCEPTION; self.getPopupImmunList(); self.createChartExceptionModal(); }}
				    ]);
			}
		}
		this.m_plusMenu.open();
	} catch (err) {
		logger.logJSError(err, this, "immunizations-o2.js", "openTab");
	}
};

/**
 * Process the record data so rendering becomes more trivial
 *  @returns{undefined} returns nothing
 */
ImmunizationsO2Component.prototype.processResultsForRender = function(immunRecs) {
	var immunRecsLength = immunRecs.length;
	var immunResult = null;

	for (immunRecsLength; immunRecsLength--;) {

		var dateTime = new Date();
		var adminDate = '--';
		immunResult = immunRecs[immunRecsLength];

		if (immunResult.ADMIN_DATE !== "") {
			dateTime.setISO8601(immunResult.ADMIN_DATE);
			adminDate = dateTime.format("shortDate3");
		}
	
		// If the most recent dose has status 'Not Given', set date string as 'Not Given'
		if(immunResult.HISTORY[0].RESULT_STATUS_CD === 3) {
			immunResult.ADMIN_DATE_STRING = this.m_immuni18n.NOT_GIVEN;	
		}
		else{
			// If the most recent history is modified then a modify indicator will be added to the right of admin date
			immunResult.ADMIN_DATE_STRING = adminDate + (immunResult.IS_MOST_RECENT_HISTORY_MODIFIED ? "<span class='res-modified'></span>" : "");	
		}
		immunResult.PATIENT_AGE = dateTime - this.m_patientDOB;
		immunResult.PATIENT_AGE_STRING = this.calculateAge(dateTime);
		// process the admin/patient tolerance notes for display
		var listLength = immunResult.NOTES.length;

		// Loop through all admin/patient tolerance note of each administration
		for (var index = 0; index < listLength; index++) {

			var noteObj = immunResult.NOTES[index];
			var provider = MP_Util.GetValueFromArray(noteObj.ACTION_PROV_ID, this.m_personnelArray);
			var providerName = (provider === null) ? "--" : provider.fullName;

			// Since each modified note and new line of the same note will be separated by <br/> tag, split with it
			var notes = noteObj.TEXT.split("<br/>");
			var notesLength = notes.length;

			// Initialize an array to store the multiple entries for a single note
			noteObj.NOTE = [];
			var count = -1;

			for (var noteIndex = 0; noteIndex < notesLength; noteIndex++) {

				// single entry
				var note = notes[noteIndex];

				if (note === "") {
					continue;
				}

				// Each entry will be in the format of [mm/dd/yyyy hh:mm AM/PM] <text>
				// Find the position of "]" to get the date string.
				var pos = note.indexOf("]");
				var newNote = true;
				var actionDate = null;
				var action_date = "";

				if (pos > 0) {
					// Get the date string within the "[]".
					var noteDateString = note.substring(1, pos);

					actionDate = new Date(noteDateString);
					// if the date is not valid,it can be next line of previous note
					if (!isNaN(actionDate)) {

						// Remaining text from the position of "]" to the end of string would be the note text.
						note = note.substring(pos + 1, note.length);
						// If the date is valid object convert it into mediumDate string(eg: July 3, 2013)
						action_date = actionDate.format("mediumDate");
					}
					// the character ']' would be the part of the next line of same Note or exception description.
					// eg:		[7/12/2013 11:19 PM] My Note
					// 			[Added Note]
					else {
						// If the count is less than zero, the note would be exception description, which doesn't have time stamp.
						if (count >= 0) {
							newNote = false;
						}
					}
				}
				// would be next line of same Note or exception description.
				// eg:		[7/12/2013 11:19 PM] My Note
				// 			Added Note
				else {
					// If the count is less than zero, the note would be exception description, which doesn't have time stamp.
					if (count >= 0) {
						newNote = false;
					}
				}
				if (newNote) {
					// If the note is exception description, action_date will be empty.
					// In this case action date would be noteObj's ACTION_DATE.
					if (action_date === "" && noteObj.ACTION_DATE) {

						actionDate = new Date();
						actionDate.setISO8601(noteObj.ACTION_DATE);
						action_date = actionDate.format("mediumDate");

					}
					// Increment the value by 1, since this is new note appended.
					count++;
					// Initialize the array and add TEXT,ACTION_DATE and PROVIDER_NAME properties and assign respective values.
					// These values will be used for rendering the comment section on each rowClick.
					noteObj.NOTE[count] = {};
					noteObj.NOTE[count].TEXT = note;
					noteObj.NOTE[count].ACTION_DATE = action_date;
					noteObj.NOTE[count].PROVIDER_NAME = providerName;
				}
				// since its part of the same note, but in the next line, add the <br/> tag and append to the same text.
				// Hence the variable "count" is not incrementing.
				else if (count >= 0 && noteObj.NOTE[count]) {

					noteObj.NOTE[count].TEXT += "<br/>" + note;
				}

			}
		}
	}
};

/**
 * Calculate the age of patient at the time of administration.
 * @param {Object} toDate administration date/Exception date
 * @returns{String} age The age of the patient  
 */
ImmunizationsO2Component.prototype.calculateAge = function(toDate, fromDate) {
	var component = this;

	var calcMonthsDiff = function() {

		var removeCurYr = 0;
		var removeCurMon = 0;
		var monthDiff = 0;
		var fMonth = fromDate.getMonth();
		var fDay = fromDate.getDate();
		var tMonth = toDate.getMonth();
		var tDay = toDate.getDate();

		var dayDiff = tDay - fDay;

		if (tMonth > fMonth) {
			monthDiff = tMonth - fMonth;
			if (tDay < fDay) {
				removeCurMon = 1;
			}
		}
		else if (tMonth < fMonth) {
			monthDiff = 12 - fMonth + tMonth;
			removeCurYr = 1;
			if (tDay < fDay) {
				removeCurMon = 1;
			}
		}
		else if (tDay < fDay) {
			removeCurYr = 1;
			monthDiff = 11;
		}

		if (dayDiff < 0) {
			var tDate = new Date(toDate);

			// to calculate the balance days from previous month of toDate's month, set toDate as last day of previous month.
			// find the difference in days from the date of fromDate's day to end of month.Add the days from toDate's start date to toDate's day.
			// eg: May 20, 2000 to May 19, 2013
			// from May 20, 2000 to April 20, 2013 will be calculated and remaining days from April 21, 2013 to May 19, 2013 will be calculated as
			// (last day of April)30 - fromDate's day(20) + toDate's day(19)
			tDate.setMonth(fMonth + 1, 0);
			dayDiff = tDate.getDate() - fDay + tDay;
		}

		//days are divided by 32 to ensure the number will always be less than zero
		monthDiff += ((yearDiff - removeCurYr) * 12) + (dayDiff / 32) - removeCurMon;

		return monthDiff;
	};

	var calcYearMonth = function() {

		// toDate.getMonth() returns the month (from 0 to 11) for the specified date.
		var monthDiff = toDate.getMonth() - fromDate.getMonth();
		// getDate() returns the day of the month (from 1 to 31) for the specified date.
		var dayDiff = toDate.getDate() - fromDate.getDate();

		// If toDate's day is first, which means number of days from fromDate's day is less than 1 month.
		if (dayDiff < 0) {
			--monthDiff;
		}

		// If the monthDiff is negative value, which means the toDate's month is first,
		// add 12 to the difference to get the  number from fromDate's month to toDate's month.
		if (monthDiff < 0) {
			monthDiff += 12;
		}

		// If both yearDiff and monthDiff not equal to zero,display as #yrs #m
		// If monthDiff is zero, display as #yrs
		// If yearDiff is zero, display as #m
		var yearString = component.m_immuni18n.AGE_YEAR.replace("{0}", valYears);
		var monthString = component.m_immuni18n.AGE_MONTH.replace("{0}", monthDiff);

		return ((valYears !== 0 && monthDiff !== 0) ? yearString + " " + monthString : (monthDiff === 0 ? yearString : monthString));
	};

	var calcMonthWeek = function() {

		var monthDiff = Math.floor(valMonths);
		// to get the fraction part of valMonths, minus the integer part from original.
		// since inside calcMonthsDiff() methods, remaining days are divided by 32, here multiply with 32 to get back to days.
		// To convert the remaining days to weeks , divide by 7.
		var weekDiff = Math.floor((valMonths - monthDiff) * 32 / 7);
		var monthString = component.m_immuni18n.AGE_MONTH.replace("{0}", monthDiff);
		var weekString = component.m_immuni18n.AGE_WEEKS.replace("{0}", weekDiff);

		// If both monthDiff and weekDiff not equal to zero,display as #m #w
		// If monthDiff is zero, display as #w
		// If weekDiff is zero, display as #m
		return ((monthDiff !== 0 && weekDiff !== 0) ? monthString + " " + weekString : (monthDiff === 0 ? weekString : monthString));

	};

	var calcWeekDay = function() {

		var weekDiff = valWeeks;
		// to get the remaining days in week, multiply value of difference in weeks with 7 to convert it to days and
		// then minus the same from value of difference in days.
		var dayDiff = valDays - (weekDiff * 7);
		var weekString = component.m_immuni18n.AGE_WEEKS.replace("{0}", weekDiff);
		var dayString = component.m_immuni18n.AGE_DAYS.replace("{0}", dayDiff);

		// If both weekDiff and dayDiff not equal to zero,display as #w #d
		// If weekDiff is zero, display as #d
		// If dayDiff is zero, display as #w
		return ((weekDiff !== 0 && dayDiff !== 0) ? weekString + " " + dayString : (dayDiff === 0 ? weekString : dayString));
	};

	var age = "";
	if(!fromDate) {
		fromDate = this.m_patientDOB;	
	}
	// getFullYear() returns the year (four digits) of the specified date.
	var yearDiff = toDate.getFullYear() - fromDate.getFullYear();
	var one_minute = 1000 * 60;
	var one_hour = one_minute * 60;
	var one_day = one_hour * 24;
	var one_week = one_day * 7;

	//time difference in milliseconds
	timeDiff = (toDate.getTime() - fromDate.getTime());
	valHours = Math.floor(timeDiff / one_hour);
	valDays = Math.floor(timeDiff / one_day);
	valWeeks = Math.floor(timeDiff / one_week);
	valMonths = calcMonthsDiff();
	valYears = Math.floor(valMonths / 12);

	// If age difference is greater than or equal to 2,display as #yrs #m
	if (valYears >= 2) {
		age = calcYearMonth();
	}
	// If the age is greater than or equal to 2 months and less than 2 year,display as #m #w
	else if (valMonths >= 2) {
		age = calcMonthWeek();
	}
	// If the age is greater than or equal to 2 weeks and less than 2 month,display as #w #d
	else if (valWeeks >= 2) {
		age = calcWeekDay();
	}

	// If the age is greater than or equal to 2 days and less than 2 weeks,display as #d
	else if (valDays >= 2) {
		age = component.m_immuni18n.AGE_DAYS.replace("{0}", valDays);
	}
	// If the age less than 2 days,display as #hrs
	// If the value is less than 1 day(valHours=0), ie administration date is same ad DOB of patient, display it as "<24hrs"
	else {
		age = valHours > 0 ? component.m_immuni18n.AGE_HOURS.replace("{0}", valHours) : component.m_immuni18n.AGE_HOURS.replace("{0}", "<24");
	}

	return age;

};


/**
 * Retrieve the Immunizations component information for rendering.
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.retrieveComponentData = function() {
	this.reloadClassLevelvariables();
	var component = this;
	this.m_HITestURI = "";
	this.m_HILookUpKey = "";
	this.m_aliasType = component.getAliasType();
	this.m_aliasPool = component.getAliasPoolCd();

	//set the pool code for testing. SHould be done thorugh bedrock
	//this.m_aliasPool = 0;
	if (component.getExternalDataInd()) {
		if ($.trim(this.getHITestUri()).length > 0) {
			this.m_HITestURI = this.getHITestUri();
		}
		if ($.trim(this.getHILookupKey()).length > 0) {
			 this.m_HILookUpKey = this.getHILookupKey();
		}
	}

	//this.m_HITestURI = "http://github.cerner.com/pages/aa027968/hi-repo/vaccine_group_20.json;http://github.cerner.com/pages/aa027968/hi-repo/immunizations.json";

	var criterion = this.getCriterion();
	this.getProviderInfo();
	
	var retrieveAdditionalDetails = 1;

	var loadTimer = new RTMSTimer(this.getComponentLoadTimerName());
	var renderTimer = new RTMSTimer(this.getComponentRenderTimerName());

	var scriptRequest = new ComponentScriptRequest();
	scriptRequest.setProgramName("mp_get_immunizations_json");
	scriptRequest.setParameterArray(["^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.encntr_id + ".0", criterion.ppr_cd + ".0", retrieveAdditionalDetails, "^" + this.m_HILookUpKey + "^", "^" + this.m_aliasType + "^", this.m_aliasPool + ".0", "^" + this.m_HITestURI + "^", 0, 1, this.getImmunForecastBRInd()]);
	scriptRequest.setComponent(this);
	scriptRequest.setLoadTimer(loadTimer);
	scriptRequest.setResponseHandler(function(scriptReply) {
		if (scriptReply.getResponse().STATUS_DATA.STATUS !== "F") {
			component.renderComponent(scriptReply.getResponse());
		}
		else {
			//hide plusAdd button on component error
			$("#" + component.compNS + "Add").addClass("hidden");

			//Finalize component and show error banner
			component.finalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace()), (component.isLineNumberIncluded() ? "(0)" : ""));
		}
	});
	scriptRequest.setRenderTimer(renderTimer);
	scriptRequest.performRequest();
};
/*
 ** This method will be called only one time, after finalizing the component.
 ** Initializing the side panel by adding the place holders for all the info.
 ** After Initialization do the rendering with first row details.
 */
ImmunizationsO2Component.prototype.addSidePanel = function() {
	try {
		this.m_doesSidePanelExist = true;

		if (this.m_sidePanelContainer && this.m_sidePanelContainer.length) {
			//Create the side panel
			this.m_sidePanel = new CompSidePanel(this.compID, this.m_sidePanelContainer.attr("id"));

			this.m_sidePanel.setExpandOption(this.m_sidePanel.expandOption.EXPAND_DOWN);
			
			var actionContents = "<div id='buttonDiv" + this.getComponentId() + "' class='immun-o2-hi-ext-btn-inv sp-button2'>" + this.m_immuni18n.VIEW_MORE_SIDE_PANEL_DATA + "</div>";

			// Render the side panel
			this.m_sidePanel.renderPreBuiltSidePanel();
			this.m_sidePanel.setActionsAsHTML(actionContents);
			this.m_sidePanel.setContents("<div></div>", "immun-o2Content" + this.compID);

			// Select the first row and render the respective details on the side panel.
			// Since this will be the initial rendering, no need to set the scrollbar of table view to top.
			this.selectDefaultRow(false);
		}
	} catch (err) {
		MP_Util.LogJSError(err, this, "immunizations-o2.js", "addSidePanel");
	}
};

/**
 * This will be called after adding the side panel and column sort.
 * Select the first row in the table as default and render panel with that information.
 * Reset back the scroll bar position to top if required.
 * @param {Boolean} scrollToTop - flag to decide whether the scroll bar position needs to be reset to top.
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.selectDefaultRow = function(scrollToTop) {
	var $tableView = $("#" + this.compID + "tableview");

	if ($tableView && $tableView.length) {

		var tableRowArr = $tableView.find('.result-info');
		var firstRow = tableRowArr[0];
		var rowId = this.getRowId(firstRow);
		var scrollTop = 0;

		this.m_lastSelectedRow = "";
		this.updateInfo(firstRow, this.m_immunizationsTable.getRowById(rowId).getResultData(), true);

		// Since selecting the first row as default, reset back the scroll bar position of component body to top.
		if (scrollToTop) {
			$("#" + this.m_immunizationsTable.getNamespace() + "tableBody").scrollTop(scrollTop);
		}
	}
};

/**
 * This is to add cellClickExtension for the component table.
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.addCellClickExtension = function() {

	var component = this;

	var cellClickExtension = new TableCellClickCallbackExtension();

	cellClickExtension.setCellClickCallback(function(event, data) {
		component.onRowClick(event, data);
	});

	this.m_immunizationsTable.addExtension(cellClickExtension);
};

/**
 * This is a callback which will be called on cell click of the component table
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.onRowClick = function(event, data) {

	// The CAP timer need to be trigger only once per view point load
	// Once it fired, reset the bStartTimer to false.
	if (this.bStartTimer) {

		var rowClickTimer = MP_Util.CreateTimer("CAP:MPG.IMMUNIZATIONS.O2");

		if (rowClickTimer) {
			rowClickTimer.Stop();
			this.bStartTimer = false;
		}
	}

	var selRow = $(event.target).parents("dl.result-info");
	if (!selRow.length || data.RESULT_DATA === null) {
		return;
	}
	this.updateInfo(selRow, data.RESULT_DATA, false);
};

/**
 * Based on the selected row, reading pane will be refresh with data and selected row will be updated as well.
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.updateInfo = function(selRow, data, isInitialLoad) {
	var rowId = this.getRowId(selRow);

	this.updateSelRowBgColor(selRow, isInitialLoad);
	this.renderReadingPane(data);

	// Update the lastSelectedRow value with index.
	this.m_lastSelectedRow = rowId;
};

/**
 * This method will be called on each row click.
 * Informations like Vaccine Name, administrations details(in History section) and comments details(in comments section) will be rendered.
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.renderReadingPane = function(data, isHI) {
	try{
		var self = this; 
		this.vaccineData = data;
		var scrollContainerHtml = "";
		
		this.sidePanelElement = $("#sidePanel"+this.compID);
		
		// If any loading spinner is shown then remove it so that the side panel can be refreshed with new data
		$("#sidePanel"+this.compID).find('.loading-screen').remove();
		
		if (isHI) {
			if (!this.m_doesSidePanelExist && this.m_isForecastCompat) {
				var compTableDivElem = $("#compTableDivForImmunization" + this.compID);
				compTableDivElem.addClass("immun-o2-side-panel-addition").addClass("immun-o2-side-panel-open");
				this.activateSidePanel();
			}
			this.m_sidePanel.setSubtitleAsHTML(this.displayHeaderForSidePanel());
			if (this.m_lastVaccineGrpId !== this.m_vaccineGroupId) {
				this.m_countInnerDiv = 0;
				this.m_countDiv = 0;
				this.m_prevContents = this.getHistoryInfoHtmlForHi(data);
				this.m_sidepanelPageNumber = 0;
				this.m_lastVaccineGrpId = this.m_vaccineGroupId;
			}
			else {
				this.m_prevContents += this.getHistoryInfoHtmlForHi(data);
			}
			this.m_sidePanel.setTitleText(this.m_nameofHIImmun);
			var historyInfoHtml = "<div id='" + this.compID + "rp-history-hi'>" + this.m_prevContents + "</div>";
			scrollContainerHtml = "<div id='sidePanelScrollContainer" + this.compID + "' class = 'immun-o2-sp-body-content-area'>" + historyInfoHtml + "</div>";
			this.m_millWasClikedInBetween = false;
			if (!this.m_hiDataGlobal.more_results) {
				this.m_prevContents = "";
			}
			var actionContents = "<div id='buttonDiv" + this.compID + "' class='immun-o2-hi-ext-btn-inv sp-button2'>" + this.m_immuni18n.VIEW_MORE_SIDE_PANEL_DATA + "</div>";
			this.m_sidePanel.setActionsAsHTML(actionContents);
		}
		else {
			this.m_sidePanel.setSubtitleAsHTML("");
			this.m_sidePanel.setTitleText(data.NAME);
			
			var actionHolderHTML = "<div class='immun-o2-action-holder' id='actionBtnHolder"+this.compID+"'><div id = 'sidePanelModifyButton"+ this.compID + "' class='immun-o2-modify'></div>" +
					"<div id='docHistoryBtn"+this.compID+"' class='sp-button2 immun-o2-doc-history'>" +this.m_immuni18n.DOCUMENT_HISTORY+ "</div>" +
					"<div id='cancelHistoryBtn"+this.compID+"' class='sp-button2  immun-o2-cancel-history'>" +i18n.CANCEL + "</div>" +
					"<div id='saveHistoryBtn"+this.compID+"' class='sp-button2 immun-o2-save-history'>" +i18n.SAVE+ "</div></div>";
			
			scrollContainerHtml = "<div id='sidePanelScrollContainer" + this.compID + "' class = 'sp-body-content-area immun-o2-scroll-container'>" + this.getHistoryInfoHtml(data) + "</div>";
			this.m_sidePanel.setActionsAsHTML(actionHolderHTML);
		}
		
		// Set the html to render the side panel.
		this.m_sidePanel.setContents(scrollContainerHtml, "immun-o2Content" + this.compID);
	
		// Show the side panel expanded
		this.m_sidePanel.expandSidePanel();

		$("#actionBtnHolder" + this.compID).addClass("hidden");

		// Click event for expand/collapse of each dose for an immunization
		if (isHI) {
			this.addDoseClickEvents("rp-history-hi");
		} 
		else{
			this.addDoseClickEvents("rp-history");
		}
	}
	catch(err){
		logger.logJSError(err, this, "immunizations-o2.js", "renderReadingPane");
	}
};

/**
 * The SortByDisplay function will return a flag either -1,0, or 1 according to the DISPLAY field
 * @param {item a, item b} a,b are two items whose DISPLAY field will be compared to each other
 * @returns {integer} 0 if DISPLAY is equal, 1 if item a's DISPLAY is greater than item B's DISPLAY, -1 if less
 */
ImmunizationsO2Component.prototype.SortByDisplay = function(a,b) {
	var aDisplay = a.DISPLAY;
	var bDisplay = b.DISPLAY;
	if (aDisplay > bDisplay) {
		return 1;
	}
	else {
		if (aDisplay < bDisplay) {
			return -1;
		}
		return 0;			
	}
};

/*
 * This method will be called when a dose is clicked.
 * It will update the side panel to show info only about the clicked dose.
 * 
 * @param {Object} historyItem Data of the clicked dose
 * @returns {String} html for detailed info fields
 */
ImmunizationsO2Component.prototype.getDetailedHistoryInfoHTML = function(historyItem) {

	var expirationDate = historyItem.EXP_DATE === "" ? "--" : this.convertToMediumFormat(historyItem.EXP_DATE);
	var visPublishedDate = historyItem.VIS_PUBLISHED_DATE === "" ? "--" : this.convertToMediumFormat(historyItem.VIS_PUBLISHED_DATE);

    // Lot number is encoded while saving to take care of special characters so decode before displaying
	var decodedLotStr = "--";
	if(historyItem.LOT.length){
		var entityStrInstance = new MPageEntity.EncodedString();
		decodedLotStr = entityStrInstance.toJs(historyItem.LOT);
	}
	var doseValue = "--";
	if(historyItem.DOSE){
		// Format the dose number depending on the locale
		var numberFormatter = MP_Util.GetNumericFormatter();
		if (mp_formatter._isNumber(historyItem.DOSE)) {
			doseValue = numberFormatter.format(historyItem.DOSE, "^." + MP_Util.CalculatePrecision(historyItem.DOSE));
		}
	}
	var doseVisInfoHtml = "<div class = 'immun-o2-sp-group'>" +
		"<div class='immun-o2-sp-content'><span id='spVisLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.VIS + ": </span>" + "<span id='spVisValue" + this.compID + "'class='immun-o2-sp-value'>" + (historyItem.VIS_DISPLAY || "--") + "</span></div>" +
		"<div class='immun-o2-sp-content'><span id='spVisPublishedLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.VIS_PUBLISHED_DATE + ": </span>" + "<span id='spVisPublishedValue" + this.compID + "' class='immun-o2-sp-value'>" + visPublishedDate + "</span></div>" +
		"</div>";

	var doseQuanInfoHtml = "<div class = 'immun-o2-sp-group'>" +
		"<div class='immun-o2-sp-content'><span id='spDoseLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.DOSE_QUANTITY + ": </span>" + "<span id='spDoseValue" + this.compID + "' class='immun-o2-sp-value'>" + doseValue + "</span></div>" +
		"<div class='immun-o2-sp-content'><span id='spUnitLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.DOSE_UNIT + ": </span>" + "<span id='spUnitValue" + this.compID + "' class='immun-o2-sp-value'>" + ((historyItem.DOSE_UNIT === "" || historyItem.DOSE_UNIT === "unknown unit") ? "--" : historyItem.DOSE_UNIT) + "</span></div>" +
		"<div class='immun-o2-sp-content'><span id='spSiteLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.SITE + ": </span>" + "<span id='spSiteValue" + this.compID + "' class='immun-o2-sp-value'>" + (historyItem.SITE || "--") + "</span></div>" +
		"<div class='immun-o2-sp-content'><span id='spRouteLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.ROUTE + ": </span>" + "<span id='spRouteValue" + this.compID + "' class='immun-o2-sp-value'>" + (historyItem.ROUTE || "--") + "</span></div>" +
		"</div>";

	var doseProductInfoHtml = "<div class = 'immun-o2-sp-group'>" +
		"<div class='immun-o2-sp-content'><span id='spManufacturerLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.MANUFACTURER + ": </span>" + "<span id='spManufacturerValue" + this.compID + "'class='immun-o2-sp-value'>" + (historyItem.MANUFACTURER || "--") + "</span></div>" +
		"<div class='immun-o2-sp-content'><span id='spLotNumberLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.LOT_NUMBER + ": </span>" + "<span id='spLotNumberValue" + this.compID + "' class='immun-o2-sp-value'>" + decodedLotStr + "</span></div>" +
		"<div class='immun-o2-sp-content'><span id='spExpDateLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.EXP_DATE + ": </span>" + "<span id='spExpDateValue" + this.compID + "' class='immun-o2-sp-value'>" + expirationDate + "</span></div>" +
		"</div>";

	var detailedInfoHtml = "<div class = 'immun-o2-sp-container'>" + doseVisInfoHtml + doseQuanInfoHtml + doseProductInfoHtml + "</div>";

	return detailedInfoHtml;
};

/**
 * Function to format the date in Month Date, Year (Jan 1, 2014)
 * @returns {Date} returns a medium formatted date
 */
ImmunizationsO2Component.prototype.convertToMediumFormat = function(date) {

	var dateObj = new Date();

	try {
		dateObj.setISO8601(date);
		return dateObj.format("mediumDate");
	} catch (err) {
		MP_Util.LogJSError(err, this, "immunizations-o2.js", "convertToMediumFormat");
	}
};

/**
 * returnDisplayForPrecisionFlag function will accept a precision flag and return the date string with requested precision
 * @param {Number} precisionFlag A precision flag value among 1 – Date and Time, 2 – Day, 3 – Week, 4 – Month, 5 – Year
 * @param {Date Object} dateObject A date object that needs to represented with a precision 
 * @returns {string} precisionDateDisplay A date display indicating appropriate precision 
 */
ImmunizationsO2Component.prototype.returnDisplayForPrecisionFlag = function(precisionFlag, dateObject){
	var precisionDateDisplay = "";
	// Check to see if the parameter is a valid date object 
	if(Object.prototype.toString.call(dateObject) === "[object Date]"){
		switch (precisionFlag) {
			/**
			1 – Date and Time
			2 – Day
			3 – Week
			4 – Month
			5 – Year
			*/
			case 4:
				precisionDateDisplay = dateObject.format("shortDate4");
				break;
			case 5:
				precisionDateDisplay = dateObject.format("shortDate5");
				break;
			default:
				precisionDateDisplay = dateObject.format("shortDate3");
				break;
		}
	}
	return precisionDateDisplay;
};

/**
 * This function is to get the html for all the details specific to comments of a dose
 * @param {Object} data Data containing info about a specific immunization
 * @returns {String} Html for history section
 */
ImmunizationsO2Component.prototype.getCommentsInfoHtml = function(data) {

	var listLength = data.NOTES.length;
	var commentTextHtml = "";
	var commentsInfoHtml = "";

	// If no comments is associated , no need to proceed.
	if (!listLength) {
		return commentsInfoHtml;
	}

	// loop through the NOTES array in the history record data and process the value
	for (var index = 0; index < listLength; index++) {

		var noteObj = data.NOTES[index];

		var providerName = noteObj.ACTION_PROV_ID ? MP_Util.GetValueFromArray(noteObj.ACTION_PROV_ID, this.m_personnelArray).fullName : "";

		// Display the comment details in the format of [1/12/2015] text and then author name in next line
		commentTextHtml += "<span class='immun-o2-rp-comments-text'>" + noteObj.TEXT + "</span><span class='immun-o2-provider author-timestamp-text secondary-text'>" + providerName + "</span>";
	}

	// Html for entire comments section .
	commentsInfoHtml = "<div id='rpComments" + this.compID + "'>" + commentTextHtml + "</div>";

	return commentsInfoHtml;
};

/**
 * This function is to get the html for all the details specific to a history
 * @param {Object} data Data containing info about a specific history
 * @returns {String} Html for comments
 */
ImmunizationsO2Component.prototype.getHistoryInfoHtml = function(data) {

	this.changeButtonVisibility(false);

	var historyInfoHtml = "";
	var listLength = data.HISTORY.length;
	var historyItemHtml = "";
	var productOrStatusDisplay = "";

	//Html for history separator line
	var historySeparatorHtml = "<div class='sp-separator'></div>";

	for (var index = 0; index < listLength; index++) {

		var historyItemObj = data.HISTORY[index];
		var date = new Date();
		var action_date = "--";

		if (historyItemObj.ADMIN_DATE !== "") {
			date.setISO8601(historyItemObj.ADMIN_DATE);
			action_date = date.format("mediumDate");
		}

		// Html for Action date and Patient's age	
		var actionDateAgeHtml = "";
		//if action date is present display the date and calculate age
		if (action_date !== "--") {
			actionDateAgeHtml = "<div class='immun-o2-expand-content'><span class='immun-o2-toggle'>&nbsp;</span><span>" + action_date + " (" + this.calculateAge(date) + ")</span></div>";
		}
		//else display '--' for date and age
		else {
			actionDateAgeHtml = "<div class='immun-o2-expand-content'><span class='immun-o2-toggle'>&nbsp;</span><span>" + action_date + "(--)</span></div>";
		}

		//If the dose has a status of 'Modified' or 'Not Given' we would display that in place of the product, 
		//so we only show the product for 'Administered' doses if the product exists.
		if(historyItemObj.RESULT_STATUS_CD === 2){
			productOrStatusDisplay = historyItemObj.PRODUCT || this.getStatusText(historyItemObj.RESULT_STATUS_CD);
		}
		else{
			productOrStatusDisplay = this.getStatusText(historyItemObj.RESULT_STATUS_CD);	
		}

		//HTML for Product name
		var productHtml = "<span class='immun-o2-product secondary-text'>" + productOrStatusDisplay + "</span>";

		//Html for Comments name
		var commentsHtml = this.getCommentsInfoHtml(historyItemObj);

		//Html for detailed side panel field information
		var detailInfoHtml = this.getDetailedHistoryInfoHTML(historyItemObj);

		// Html for a single history section
		//Add separator for elements other than last one
		if (index !== listLength - 1) {
			// Html for a single history section
			historyItemHtml += "<div id =" + this.compID + "historyItemRow" + index + " class='immun-o2-rp-history-content closed' data-event-id="+historyItemObj.EVENT_ID+">" + actionDateAgeHtml + productHtml + commentsHtml + detailInfoHtml + historySeparatorHtml + "</div>";
		}
		else {
			historyItemHtml += "<div id =" + this.compID + "historyItemRow" + index + " class='immun-o2-rp-history-content closed' data-event-id="+historyItemObj.EVENT_ID+">" + actionDateAgeHtml + productHtml + commentsHtml + detailInfoHtml + "</div>";
		}
	}

	// Html for entire history section.
	historyInfoHtml = "<div id=" + this.compID + "rp-history class='immun-o2-rp-history'>" + historyItemHtml + "</div>";

	return historyInfoHtml;

};

/**
 * This method will be called if dose headers are clicked for an immunization.
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.addDoseClickEvents = function(idOfContainer) {
	var self = this;

	//Logic to remove or add the closed class depending on if it exists already
	$("#" + self.compID + idOfContainer).on("click", ".immun-o2-rp-history-content", function(event) {
		if (event.target && event.target.parentElement.className === "immun-o2-expand-content") {
			$(this).toggleClass("closed");
		}

		self.m_sidePanel.expandSidePanel();
	});
};

/**
 * Return the status text based on the status_cd value
 * For Modified/Altered  = 1
 * For Auth/Active/Anticipated = 2
 * for Not Done = 3
 * other = 0
 * @returns {string} statusText The status text based on the status_cd value
 */
ImmunizationsO2Component.prototype.getStatusText = function(status) {

	var statusText = "--";

	switch (status) {
		case 1:
			statusText = this.m_immuni18n.MODIFIED;
			break;

		case 2:
			statusText = this.m_immuni18n.ADMINISTERED;
			break;

		case 3:
			statusText = this.m_immuni18n.NOT_GIVEN;
			break;

		default:
			break;
	}

	return statusText;
};

/**
 * This function will return the row id from the id of DOM element.
 * @returns {string} rowId The row if of the passed in DOM object
 */
ImmunizationsO2Component.prototype.getRowId = function(rowObj) {
	var rowId = "";

	var identifiers = $(rowObj).attr("id").split(":");

	if (identifiers.length > 0) {
		rowId = identifiers[1];
	}

	return rowId;
};


/**
 * This method will be called on each row selection to update the background color of selected row and font color
 * to indicate that this is the currently selected row.isInitialLoad flag is using to differentiate whether its is initial load or user selection.
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.updateSelRowBgColor = function(selRowObj, isInitialLoad, isHI) {
	var tableViewObj = null;
	if (isHI) {
		if (this.m_prevMill) {
			tableViewObj = $("#" + this.compID + "tableview");
		}
		if (this.m_prevHi) {
			tableViewObj = $("#" + this.compID + "tableviewHI");
		}
		this.m_prevHi = true;
		this.m_prevMill = false;
	}
	else {
		if (this.m_prevMill) {
			tableViewObj = $("#" + this.compID + "tableview");
		}
		if (this.m_prevHi) {
			tableViewObj = $("#" + this.compID + "tableviewHI");
		}

		this.m_prevMill = true;
		this.m_prevHi = false;
	}
	var prevRow = tableViewObj.find(".selected");

	// Remove the background color of previous selected row.
	if (prevRow.length > 0 && this.m_lastSelectedRow === this.getRowId(prevRow)) {
		prevRow.removeClass(this.compNS + "-row-selected");
		prevRow.removeClass(this.compNS + "-row-selected-init");
		prevRow.removeClass("selected");
	}
	else if (this.m_isForecastCompat) {
		if (prevRow.length > 0) {
			prevRow.removeClass(this.compNS + "-row-selected");
			prevRow.removeClass(this.compNS + "-row-selected-init");
			prevRow.removeClass("selected");
		}
	}
	// Change the background color to indicate that its selected.
	$(selRowObj).addClass(this.compNS + (isInitialLoad ? "-row-selected-init" : "-row-selected") + " selected");
};

/**
 * This method overrides the base MPageComponent resizeComponent method. 
 * Height of the side panel will be adjusted with the height of table.
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.resizeComponent = function() {

	if (!this.getExternalDataInd()) {
		this.resizeComponentWhenOnlyMillData();
		return;
	}
	var container = null;
	container = $("#vwpBody");
	if (!container.length) {
		return;
	}
	var viewHeight = 0;
	viewHeight = container.height();
	var viewHeightWithPx = (viewHeight - 120) + "px";

	var hiTable = $("#" + this.compID + "tableviewHI");
	var tableView = $("#" + this.compID + "tableview");
	tableView.css({
		"max-height": ""
	});
	hiTable.css({
		"max-height": ""
	});

	var midHeight = Math.ceil((viewHeight - 140) / 2);
	var remainingHeight = 0;
	var remainingHeightPx = "";
	if (hiTable.length && tableView.length) {
		var newHeight = Math.ceil((viewHeight - 140) / 2) + "px";
		if (hiTable.height() < midHeight) {
			remainingHeight = viewHeight - 140 - hiTable.height();
			remainingHeightPx = remainingHeight + "px";
			tableView.css({
				"max-height": remainingHeightPx,
				"overflow-y": "auto"
			});
		}
		else if (tableView.height() < midHeight) {
			remainingHeight = viewHeight - 140 - tableView.height();
			remainingHeightPx = remainingHeight + "px";
			hiTable.css({
				"max-height": remainingHeightPx,
				"overflow-y": "auto"
			});
		}
		else {
			tableView.css({
				"max-height": newHeight,
				"overflow-y": "auto"
			});
			hiTable.css({
				"max-height": newHeight,
				"overflow-y": "auto"
			});
		}
	}
	else if (tableView.length) {
		tableView.css({
			"max-height": viewHeightWithPx,
			"overflow-y": "auto"
		});
	}
	else {
		hiTable.css({
			"max-height": viewHeightWithPx,
			"overflow-y": "auto"
		});
	}
	if (this.m_sidePanel) {
		this.m_sidePanel.resizePanel();
		var sidePanelMinHeight = 251;
		var minHeight = 0;
		if ((hiTable && hiTable.length) && (tableView && tableView.length)) {
			minHeight = Math.max(tableView.height() + hiTable.height() + 40, sidePanelMinHeight);
		}
		else {
			if (hiTable && hiTable.length) {
				minHeight = Math.max(hiTable.height(), sidePanelMinHeight);
			}
			else {
				minHeight = Math.max(tableView.height(), sidePanelMinHeight);
			}
		}
		this.m_sidePanel.setMinHeight(minHeight + "px");
		this.m_sidePanel.expandSidePanel();
	}
};


/*
 * This method takes care of resizing the component when there is only Millenium data.
 */
ImmunizationsO2Component.prototype.resizeComponentWhenOnlyMillData = function() {

	//Call the base class functionality to resize the component
	MPageComponent.prototype.resizeComponent.call(this, null);

	if (this.m_sidePanel) {

		this.m_sidePanel.resizePanel();

		// Set the minimum height of the side panel as height of table , when the table height is more than the defaults height of sidepanel.
		var $tableView = $("#" + this.compID + "tableview");

		if ($tableView && $tableView.length) {

			var sidePanelMinHeight = 251;
			var minHeight = Math.max($tableView.height(), sidePanelMinHeight);

			this.m_sidePanel.setMinHeight(minHeight + "px");
			this.m_sidePanel.expandSidePanel();
		}
	}
};


/*
 ** Create a TableColumn object and set the properties like class name, display field,sorting info
 */
ImmunizationsO2Component.prototype.createColumn = function(colInfo) {

	var column = new TableColumn();

	column.setColumnId(colInfo.ID);
	column.setCustomClass(colInfo.CLASS);
	column.setColumnDisplay(colInfo.DISPLAY);
	column.setPrimarySortField(colInfo.PRIMARY_SORT_FIELD);
	// here all the columns are able to sort
	column.setIsSortable(true);
	column.addSecondarySortField(colInfo.SEC_SORT_FIELD, TableColumn.SORT.ASCENDING);

	column.setRenderTemplate('${ ' + colInfo.RENDER_TEMPLATE + '}');

	return column;
};

/**
 * Creates the Healthe Intent Data banner
 * @param {string} bannerHeader The header banner string
 * @returns {String} the HI banner markup
 */
ImmunizationsO2Component.prototype.createHIAddDataControl = function(bannerHeader) {
	if (this.mfaAuthStatus && this.mfaAuthStatus.value === false) {
		return this.mfaAlertBanner();
	} else {
		var imgUrl = this.getCriterion().static_content + "/images/6965.png";
		var imgSpan = "<span><img class='immun-o2-hi-img' id='externalData" + this.getComponentId() + "' src= '" + imgUrl + "'></span>";
		var HITitleSpan = "<span class='immun-o2-bannerHeader'>" + bannerHeader + "</span>";
		var btnSpan = "<span class='immun-o2-hi-banner-btn'><button class='immun-o2-hi-ext-btn' id='hiDataControlBtn" + this.getComponentId() + "'>" + this.m_immuni18n.VIEW_OUTSIDE_RECORDS + "</button></span>";
		return "<div id='hiAddDataContainer" + this.getComponentId() + "' class='immun-o2-hi-ext-label'>" + imgSpan + HITitleSpan + btnSpan + "</div></br>";
	}
};

/**
 * Get the MPage UI alert banner when MFA authentication has an error.
 * @returns {String} alert banner html string.
 */
ImmunizationsO2Component.prototype.mfaAlertBanner = function() {
	var alertBanner = new MPageUI.AlertBanner();

	// 2 - Access denied  authentication failed, 3 - Access denied authentication cancelled 
	if (this.mfaAuthStatus.status === 2 || this.mfaAuthStatus.status === 3) {
		alertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.INFO);
	} else {
		alertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
	}

	alertBanner
		.setPrimaryText(this.mfaAuthStatus.message)
		.setSecondaryText(this.m_immuni18n.MFA_SECONDARY_ALERT_MSG);

	return alertBanner.render();
};

/**
 * Displays the Healthe intent data in a tabular format
 * 
 * @returns {Object} recordData The JSON Object containing the Healthe Intent data. 
 */
ImmunizationsO2Component.prototype.showHIData = function(recordData) {
	var component = this;

	this.m_HIImmunizationsTable = new ComponentTable();
	this.m_HIImmunizationsTable.setNamespace(this.compID + "hiTableForImmunizations");
	var groupLength = recordData.groups.length;
	for (var i = 0; i < groupLength; i++) {
		if (recordData.groups[i].most_recent_immunization.administered_datetime) {
			var date = new Date();
			date.setISO8601(recordData.groups[i].most_recent_immunization.administered_datetime);
			var formattedDate = date.format("shortDate3");
			recordData.groups[i].most_recent_immunization.formatted_admin_date = formattedDate;
		}
		else {
			recordData.groups[i].most_recent_immunization.formatted_admin_date = "--";
			//return;
		}
	}

	// Array to store vaccine column details
	var vaccineColInfo = {
		ID: "VACCINE",
		CLASS: this.compNS + "-vaccine",
		DISPLAY: this.m_immuni18n.VACCINE,
		PRIMARY_SORT_FIELD: "name",
		SEC_SORT_FIELD: "",
		RENDER_TEMPLATE: "name"
	};

	// Array to store last admin date column details
	var lastAdminDateColInfo = {
		ID: "LAST_ADMIN_DATE",
		CLASS: this.compNS + "-last-admin-date",
		DISPLAY: this.m_immuni18n.ADMIN_DATE,
		PRIMARY_SORT_FIELD: "",
		SEC_SORT_FIELD: "",
		RENDER_TEMPLATE: "most_recent_immunization.formatted_admin_date"
	};

	var sidePanelHtmlHi = "<div id='" + this.compID + "sidePanelContainerHi' class='" + this.compNS + "-sidepanel-container'></div>";

	this.m_HIImmunizationsTable.addColumn(this.createColumn(vaccineColInfo));
	this.m_HIImmunizationsTable.addColumn(this.createColumn(lastAdminDateColInfo));

	this.m_HIImmunizationsTable.bindData(recordData.groups);

	this.m_HIImmunizationsTable.sortByColumnInDirection("VACCINE", TableColumn.SORT.ASCENDING);

	this.addCellClickExtensionForHI();

	// Table view
	var tableViewHtmlHi = "<div id='" + this.compID + "tableviewHI' class='" + this.compNS + "-table'>" + this.m_HIImmunizationsTable.render() + "</div>";

	$('#hidata' + this.compID).append(tableViewHtmlHi);
	$('#hibanner' + this.compID).html(this.createHIAddDataControl(this.m_immuni18n.OUTSIDE_RECORDS_UNVERIFIED));
	$("#hiDataControlBtn" + this.getComponentId()).remove();
	var hibanner = $('#hiAddDataContainer' + this.compID);
	hibanner.removeClass('immun-o2-hi-ext-label');
	hibanner.addClass('immun-o2-hi-ext-label-change-bg');
	this.m_HIImmunizationsTable.finalize();
	this.resizeComponent();
	if (!this.m_totalImmunCount) {
		MP_Util.LoadSpinner('hidata' + this.getComponentId());
		this.renderSidePanelOnPageChange();
	}

	this.createPager(recordData);
};


/**
 * Manages the cell click of HI data table
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.addCellClickExtensionForHI = function() {
	var cellClickExtension = new TableCellClickCallbackExtension();
	var self = this;
	cellClickExtension.setCellClickCallback(function(event, data) {
		self.m_clickEvent = event;
		self.m_vaccineGroupId = data.RESULT_DATA.id;
		if (self.m_vaccineGroupId === self.m_prevVacGroupId && !self.m_millWasClikedInBetween) {
			// This is to facilitate second click on the already selected row.
			// If the second click is made then the opened side-panel is closed
			if (self.m_isForecastCompat) {
				var compTableDivElem = $("#compTableDivForImmunization" + self.compID);
				var selRow = $(event.target).parents("dl.result-info");
				$(selRow).removeClass(self.compNS + "-row-selected selected");
				if (compTableDivElem.length) {
					compTableDivElem.removeClass("immun-o2-side-panel-addition").removeClass("immun-o2-side-panel-open");
				}
				// Close side-panel
				self.m_sidePanel.m_cornerCloseButton.click();
				self.m_lastSelectedRow = null;
				self.m_doesSidePanelExist = false;
				self.m_prevVacGroupId = "";
				self.m_vaccineGroupId = "";
				self.m_lastVaccineGrpId = "";
			}
			return;
		}
		else {
			self.m_prevVacGroupId = self.m_vaccineGroupId;
		}
		self.m_nameofHIImmun = data.RESULT_DATA.name;
		var criterion = self.getCriterion();
		var loadTimer = new RTMSTimer(self.getComponentLoadTimerName());
		var renderTimer = new RTMSTimer(self.getComponentRenderTimerName());
		var parameterArray = ["^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", "^" + self.m_HILookUpKey + "^", "^" + self.m_aliasType + "^", self.m_aliasPool + ".0", "^" + self.m_HITestURI + "^", 0, "^" + self.m_vaccineGroupId + "^"];
		MP_Util.LoadSpinner('hidata' + self.compID);
		self.m_isCellClick = true;
		self.createScriptRequestUtility("mp_get_hi_immun_details", parameterArray, null, null, true, ImmunizationsO2Component.responseHandlerForaddCellClickExtensionForHi);
	});
	this.m_HIImmunizationsTable.addExtension(cellClickExtension);
};

/**
 * Checks if more data exists for the side panel
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.checkIfMoreDataExistForSidePanel = function() {
	var self = this;
	var mainContainerDiv = $("#" + self.getComponentId() + "maincontainer");
	if (self.m_hiDataGlobal.more_results) {
		self.changeButtonVisibility(true);
		if (self.m_buttonAlreadyExist) {
			mainContainerDiv.on("click", "#buttonDiv" + self.getComponentId(), function() {
				MP_Util.LoadSpinner(self.getComponentId() + 'sidePanelContainer');
				self.generateNextPageForSidePanel();
			});
		}
		if (self.m_buttonAlreadyExist) {
			self.m_buttonAlreadyExist = false;
		}
	}
	else {
		self.changeButtonVisibility(false);
	}
};


/**
 * Changes the visibility of the button which gives more data for the side panel
 * @param {boolean} makeVisible The boolean which makes the button visible or invisible
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.changeButtonVisibility = function(makeVisible) {
	var self = this;
	var buttonVisivle = $("#buttonDiv" + self.getComponentId());

	if (makeVisible) {
		buttonVisivle.removeClass('immun-o2-hi-ext-btn-inv');
		buttonVisivle.addClass('immun-o2-hi-ext-btn-right');
	}
	else {
		buttonVisivle.removeClass('immun-o2-hi-ext-btn-right');
		buttonVisivle.addClass('immun-o2-hi-ext-btn-inv');
	}
};




/**
 * Creates a ScriptRequest according to the parameters passed in
 * @param {string} programName The name of the script
 * @param {Array} parameterArray The parameters used for the HTTP request
 * @param {RTMSTimer} loadTimer The RTMSTimer associated with the script call
 * @param {RTMSTimer} renderTimer The RTMSTimer associated with the script call
 * @param {boolean} asyncIndicator If false makes the script call in a synchronous way. If true it makes the process asynchronous
 * @param {function} callBackMethod The call back method which handles the script request reply
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.createScriptRequestUtility = function(programName, parameterArray, loadTimer, renderTimer, asyncIndicator, callBackMethod) {
	try {

		//Check for error conditions
		if (typeof programName !== "string" || !programName.length) {
			throw new Error("ImmunizationsO2Component.createScriptRequestUtility - Error creating script request : the program name is empty or not a string");
		}
		if (!$.isArray(parameterArray) || !parameterArray.length) {
			throw new Error("ImmunizationsO2Component.createScriptRequestUtility - Error creating script request : the parameter array is not of type array or empty");
		}
		if (loadTimer !== null && !(loadTimer instanceof RTMSTimer)) {
			throw new Error("ImmunizationsO2Component.createScriptRequestUtility - Error creating script request : the load timer is not an instance of RTMSTimer");
		}
		if (renderTimer !== null && !(renderTimer instanceof RTMSTimer)) {
			throw new Error("ImmunizationsO2Component.createScriptRequestUtility - Error creating script request : the render timer is not an instance of RTMSTimer");
		}
		if (typeof asyncIndicator !== "boolean") {
			throw new Error("ImmunizationsO2Component.createScriptRequestUtility - Error creating script request : the asyncIndicator is not a boolean");
		}
		if (typeof callBackMethod !== "function") {
			throw new Error("ImmunizationsO2Component.createScriptRequestUtility - Error creating script request : the callBackMethod is not a function");
		}
		//Create the ScriptRequest Object and set its properties.
		var scriptRequest = new ComponentScriptRequest();
		scriptRequest.setProgramName(programName);
		if (loadTimer) {
			scriptRequest.setLoadTimer(loadTimer);
		}
		if (renderTimer) {
			scriptRequest.setRenderTimer(renderTimer);
		}
		scriptRequest.setAsyncIndicator(asyncIndicator);
		scriptRequest.setParameterArray(parameterArray);
		var self = this;
		if (callBackMethod) {
			scriptRequest.setResponseHandler(function(scriptReply) {

				//Logic for pager and side panel integration
				if (self.m_isRenderSidePanelOnPageChange) {
					callBackMethod(scriptReply, self);
					$("#hidata" + self.getComponentId()).find('.loading-screen').remove();
					self.m_isRenderSidePanelOnPageChange = false;
					self.checkIfMoreDataExistForSidePanel();
				}

				//If HI table was interacted before and pager button clicked
				if (self.m_prevHi && self.m_isPager) {
					callBackMethod(scriptReply, self);
					self.renderSidePanelOnPageChange();
					self.m_isPager = false;
				}

				//if only pager
				if (self.m_isPager) {
					callBackMethod(scriptReply, self);
					$("#hidata" + self.getComponentId()).find('.loading-screen').remove();
					self.m_isPager = false;
				}

				//if only a cell click of the HI table
				if (self.m_isCellClick) {
					$("#hidata" + self.getComponentId()).find('.loading-screen').remove();
					callBackMethod(scriptReply, self);
					self.checkIfMoreDataExistForSidePanel();
					self.m_isCellClick = false;
				}
				//The side panel has more HI data
				if (self.m_isNextPageForSidePanel) {
					callBackMethod(scriptReply, self);
					$("#" + self.getComponentId() + 'sidePanelContainer').find('.loading-screen').remove();
					self.checkIfMoreDataExistForSidePanel();
					self.m_isNextPageForSidePanel = false;
				}
			});
		}
		scriptRequest.setComponent(this);
		scriptRequest.performRequest();
	} catch (err) {
		$("#hidata" + this.getComponentId()).find('.loading-screen').remove();
		$("#" + this.getComponentId() + 'sidePanelContainer').find('.loading-screen').remove();
		MP_Util.LogJSError(err, this, "immunizations-o2.js", "createScriptRequestUtility");
	}
};

/**
 * Response handler for cell click on HI table
 * @param {Object} scriptReply The scriptReply object
 * @param {Object} compObj The 'this' Object
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.responseHandlerForaddCellClickExtensionForHi = function(scriptReply, compObj) {
	var hiData = compObj.validateHidata(scriptReply, false, 1);
	if (hiData === "") {
		return;
	}
	compObj.onRowClickForHi(compObj.m_clickEvent, hiData);
};

/**
 * Creates the pager
 * @param {Object} recordData The recordData object
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.createPager = function(recordData) {
	///pager start
	var component = this;
	var self = this;
	if (recordData.total_results != null && recordData.total_results > 20) {
		var noOfPages = Math.ceil(recordData.total_results / 20);
		var lastPageNo = 0;
		component.m_pager = new MPageUI.Pager()
			.setNumberPages(noOfPages)
			.setCurrentPageLabelPattern("${currentPage}/${numberPages}")
			.setNextLabel(self.m_immuni18n.NEXT + " >")
			.setPreviousLabel("< " + self.m_immuni18n.PREV);
		component.m_pager.setOnPageChangeCallback(function() {
			if (lastPageNo < arguments[0].currentPage) {
				component.m_pageIndex = component.m_pageIndex + 20;
				component.m_millDataInd = 0;
				//component.m_HITestURI = "http://github.cerner.com/pages/aa027968/hi-repo/example-next.json;http://github.cerner.com/pages/aa027968/hi-repo/immunizations.json";
				component.m_isPager = true;
				MP_Util.LoadSpinner('hidata' + component.getComponentId());
				component.createNextOrPreviousPage(component.m_HITestURI, 0);
				component.changeButtonVisibility(false);
				lastPageNo = arguments[0].currentPage;
			}
			else {
				component.m_pageIndex = component.m_pageIndex - 20;
				component.m_millDataInd = 0;
				//component.m_HITestURI = "http://github.cerner.com/pages/aa027968/hi-repo/example-previous.json;http://github.cerner.com/pages/aa027968/hi-repo/immunizations.json";
				component.m_isPager = true;
				MP_Util.LoadSpinner('hidata' + component.getComponentId());
				component.createNextOrPreviousPage(component.m_HITestURI, 0);
				component.changeButtonVisibility(false);
				lastPageNo = arguments[0].currentPage;
			}

		});
		$("#pager" + self.compID).addClass('immun-o2-row-pager');
		$("#pager" + self.compID).append(component.m_pager.render());
		component.m_pager.attachEvents();
	}
	$("#emptyDivAfterpager" + self.compID).html("<div class='immun-o2-br'></div><div class='immun-o2-br'></div><div class='immun-o2-br'></div><div class='immun-o2-br'></div>");
};


/**
 * Changes the side panel on change of page
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.renderSidePanelOnPageChange = function() {

	this.m_isRenderSidePanelOnPageChange = true;

	var $tableView = $("#" + this.compID + "tableviewHI");

	var tableRowArr = $tableView.find('.result-info');

	var firstRow = tableRowArr[0];
	this.m_firstRowElement = firstRow;
	var rowId = this.getRowId(firstRow);
	var vacc = this.m_HIImmunizationsTable.getRowById(rowId).getResultData().id;
	this.m_vaccineGroupId = vacc;
	this.m_prevVacGroupId = vacc;
	this.m_nameofHIImmun = this.m_HIImmunizationsTable.getRowById(rowId).getResultData().name;
	var self = this;
	var criterion = self.getCriterion();
	var loadTimer = new RTMSTimer(self.getComponentLoadTimerName());
	var renderTimer = new RTMSTimer(self.getComponentRenderTimerName());
	var parameterArray = ["^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", "^" + self.m_HILookUpKey + "^", "^" + self.m_aliasType + "^", self.m_aliasPool + ".0", "^" + self.m_HITestURI + "^", 0, "^" + vacc + "^"];
	self.createScriptRequestUtility("mp_get_hi_immun_details", parameterArray, null, null, true, self.responseHandlerForRenderSidePanelOnPageChange);

};

/**
 * Response handler for side panel chnage
 * @param {Object} scriptReply The scriptReply object
 * @param {Object} compObj The 'this' object
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.responseHandlerForRenderSidePanelOnPageChange = function(scriptReply, compObj) {

	var hiData = compObj.validateHidata(scriptReply, true, 1);
	compObj.updateSelRowBgColorForNextPage(compObj.m_firstRowElement, true);
	compObj.renderReadingPane(hiData, 1);
};


/**
 * Creates the next/previous page
 * @param {Object} selRowObj The selected row object
 * @param {integer} isInitialLoad The millenium data indicator
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.updateSelRowBgColorForNextPage = function(selRowObj, isInitialLoad) {
	var rowId = this.getRowId(selRowObj);
	var tableViewObj = $("#" + this.getComponentId() + "tableviewHI");
	var prevRow = tableViewObj.find(".selected");

	// Remove the background color of previous selected row.
	if (prevRow.length > 0 && this.m_lastSelectedRow === this.getRowId(prevRow)) {
		prevRow.removeClass(this.compNS + "-row-selected");
		prevRow.removeClass(this.compNS + "-row-selected-init");
		prevRow.removeClass("selected");
	}

	// Change the background color to indicate that its selected.
	$(selRowObj).addClass(this.compNS + (isInitialLoad ? "-row-selected-init" : "-row-selected") + " selected");
	this.m_lastSelectedRow = rowId;

};

/**
 * Creates the next/previous page
 * @param {string} hiTestURIParameter The test uri parameter
 * @param {integer} millDataInd The millenium data indicator
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.createNextOrPreviousPage = function(hiTestURIParameter, millDataInd) {
	hiTestURIParameter = this.m_HITestURI;
	var pageIndex = this.m_pageIndex;
	var criterion = this.getCriterion();
	var retrieveAdditionalDetails = 1;
	var parameterArray = ["^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.encntr_id + ".0", criterion.ppr_cd + ".0", retrieveAdditionalDetails, "^" + this.m_HILookUpKey + "^", "^" + this.m_aliasType + "^", this.m_aliasPool + ".0", "^" + hiTestURIParameter + "^", pageIndex, millDataInd];
	var component = this;
	component.createScriptRequestUtility("mp_get_immunizations_json", parameterArray, null, null, true, component.responseHandlerForCreateNextPage);
};

/**
 * Handles the response when the next/previous page button is clicked
 * @param {Object} scriptReply The scriptReply object
 * @param {Object} compObj The 'this' object
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.responseHandlerForCreateNextPage = function(scriptReply, compObj) {

	var hiData = compObj.validateHidata(scriptReply.m_responseData, true);
	if (hiData === "") {
		return;
	}
	var hiGroupLength = hiData.groups.length;
	for (var i = 0; i < hiGroupLength; i++) {
		if (hiData.groups[i].most_recent_immunization.administered_datetime) {
			var date = new Date();
			date.setISO8601(hiData.groups[i].most_recent_immunization.administered_datetime);
			var formattedDate = date.format("shortDate3");
			hiData.groups[i].most_recent_immunization.formatted_admin_date = formattedDate;
		}
		else {
			return;
		}
	}
	compObj.m_HIImmunizationsTable.bindData(hiData.groups);
	$("#" + compObj.compID + "tableviewHI").html(compObj.m_HIImmunizationsTable.render());
	compObj.m_HIImmunizationsTable.finalize();
	compObj.resizeComponent();

};


/**
 * Overriding MPageComponent's renderComponent method.
 * @param {Object} recordData The JSON Object containing Millenium data HI data
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.renderComponent = function(recordData) {

	var timerRenderComponent = MP_Util.CreateTimer(this.getComponentRenderTimerName(), this.getCriterion().category_mean);
	var componentHtml = "";
	var countText = "";
	var component = this;
	var noPrivsBannerHtml = "";
	/**
	 * Checks if the component is compatible with the Immunization GetPersonForecast Service
	 * If the VACCINE_GROUPS_CNT > 0 then it means that the service was present in the domain and we can leverage that data and construct
	 * a new Component table to populate those data
	 *
	 * @param {Object} replyData JSON containing reply from the mp_get_immunizations_json
	 * @returns {Number} 1/0 to indicate using the forecast component table or not respectively
	 */
	var isForecastImmunizationsDataCompat = function (replyData) {
		if (replyData && replyData.IMMUN_FORECAST) {
			if (replyData.IMMUN_FORECAST.FORECAST_ERRORS && replyData.IMMUN_FORECAST.FORECAST_ERRORS.length) {
				//Hide the plus button
				$("#" + component.compNS + "Add").addClass("hidden");
				//Put the banner if the forecast service has reported errors due to a priv settings
				noPrivsBannerHtml = component.getNoPrivsBannerMarkup();
				return 0;
			}
			if (replyData.IMMUN_FORECAST.VACCINE_GROUPS_CNT) {
				return 1;
			}
			return 0;
		}
	};
	// Cache the recordData
	this.immunRecordData = recordData;
	
	try {
		this.compID = this.getComponentId();
		this.m_personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
		
		if (isForecastImmunizationsDataCompat(this.immunRecordData)) {
			this.m_isForecastCompat = 1;
			this.renderImmunForecastComponent(this.immunRecordData);
		}
		else {
		//Process the results so rendering becomes more trivial
		this.processResultsForRender(recordData.IMMUN);

		//Get the component table (the first time this is called, it is created)
		this.m_immunizationsTable = new ComponentTable();
		this.m_immunizationsTable.setNamespace(this.compNS + this.compID);

		// Array to store vaccine column details
		var vaccineColInfo = {
			ID: "VACCINE",
			CLASS: this.compNS + "-vaccine",
			DISPLAY: this.m_immuni18n.VACCINE,
			PRIMARY_SORT_FIELD: "NAME",
			SEC_SORT_FIELD: "",
			RENDER_TEMPLATE: "NAME"

		};

		// Array to store last admin date column details
		var lastAdminDateColInfo = {
			ID: "LAST_ADMIN_DATE",
			CLASS: this.compNS + "-last-admin-date",
			DISPLAY: this.m_immuni18n.LAST_ADMIN_DATE,
			PRIMARY_SORT_FIELD: "ADMIN_DATE",
			SEC_SORT_FIELD: "ADMIN_DATE",
			RENDER_TEMPLATE: "ADMIN_DATE_STRING"

		};

		// Array to store patient age column details
		var patientAgeColInfo = {
			ID: "PATIENT_AGE",
			CLASS: this.compNS + "-patient-age",
			DISPLAY: this.m_immuni18n.PATIENT_AGE,
			PRIMARY_SORT_FIELD: "PATIENT_AGE",
			SEC_SORT_FIELD: "NAME",
			RENDER_TEMPLATE: "PATIENT_AGE_STRING"

		};

		//Create the columns and add to the table
		this.m_immunizationsTable.addColumn(this.createColumn(vaccineColInfo));
		this.m_immunizationsTable.addColumn(this.createColumn(lastAdminDateColInfo));
		this.m_immunizationsTable.addColumn(this.createColumn(patientAgeColInfo));

		//Bind the data to the results
		this.m_immunizationsTable.bindData(recordData.IMMUN);


		//Store off the component table
		this.setComponentTable(this.m_immunizationsTable);

		// Default sorting is the Ascending order of due date.
		this.m_immunizationsTable.sortByColumnInDirection("VACCINE", TableColumn.SORT.ASCENDING);

		this.addCellClickExtension();

		this.m_resultCount = recordData.IMMUN_CNT;

		countText = MP_Util.CreateTitleText(this, this.m_resultCount);

		// Table view
		var tableViewHtml = "<div id='" + this.compID + "tableview' class='" + this.compNS + "-table'>" + this.m_immunizationsTable.render() + "</div>";


		var sidePanelHtml = "<div id='" + this.compID + "sidePanelContainer' class='" + this.compNS + "-sidepanel-container'></div>";
		var hiBannerHtml = "";

		// Main component container having both component table and side panel.
		componentHtml = "<div id ='" + this.compID + "privBanner'>" + noPrivsBannerHtml + "</div><div id ='" + this.compID + "maincontainer' class ='" + this.compNS + "-maincontainer " + this.compNS + "-maincontainer-position'>" + "<div id='hibanner" + this.compID + "'>" + hiBannerHtml + "</div>" + "<div id='compTableDivForImmunization" + this.compID + "' class='immun-o2-left-container'><div id='parentOfHidata"+this.compID+"' class='immun-o2-spinner-parent'><div id='hidata" + this.compID + "' class='immun-o2-scroll-hi'" + "></div></div>" + "<div id='pager" + this.compID + "'></div><div id='emptyDivAfterpager"+this.compID+"'></div>" + tableViewHtml + "</div>" + sidePanelHtml + "</div>";

		//Finalize the component
		this.finalizeComponent(componentHtml, countText);
		

		this.m_sidePanelContainer = $("#" + this.compID + "sidePanelContainer");

		//Add the side panle. Have to include this after finalize due to DOM elements not existing until finalize.
		if (recordData.IMMUN_CNT !== 0) {
			this.m_totalImmunCount = recordData.IMMUN_CNT;
			this.addSidePanel();
		}
		if (component.getExternalDataInd()) {
			this.processHIData(recordData);
		}

		/**
		 * Override the toggleColumnSort method of ComponentTable to select the first row in the table view after sorting.
		 * @param columnId  :-the column to be sorted.
		 * @returns {undefined} returns nothing
		 */
		this.m_immunizationsTable.toggleColumnSort = function(columnId) {

			//Call the base class functionality to sort column
			ComponentTable.prototype.toggleColumnSort.call(this, columnId);

			// Select the first row and render the respective details on the side panel.
			component.selectDefaultRow(true);
		};
		}
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
};

/**
 * Generates the nexgt page for the side panel
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.generateNextPageForSidePanel = function() {

	var self = this;
	var criterion = self.getCriterion();
	var loadTimer = new RTMSTimer(self.getComponentLoadTimerName());
	var renderTimer = new RTMSTimer(self.getComponentRenderTimerName());
	self.m_sidepanelPageNumber += 20;
	var parameterArray = ["^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", "^" + self.m_HILookUpKey + "^", "^" + self.m_aliasType + "^", self.m_aliasPool + ".0", "^" + self.m_HITestURI + "^", self.m_sidepanelPageNumber, "^" + self.m_vaccineGroupId + "^"];
	self.m_isNextPageForSidePanel = true;
	self.createScriptRequestUtility("mp_get_hi_immun_details", parameterArray, null, null, true, self.responseHandlerForGenerateNextPageForSidePanel);
};

/**
 * Precesses the Healthe Intent data.
 * @param {Object} scriptReply The reply object form the script call
 * @param {Object} compObj The 'this' object.
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.responseHandlerForGenerateNextPageForSidePanel = function(scriptReply, compObj) {
	var hiData = compObj.validateHidata(scriptReply, false, 1);
	if (hiData === "") {
		return;
	}
	compObj.renderReadingPane(hiData, 1);

};

/**
 * Precesses the Healthe Intent data.
 * @param {Object} recordData The JSON Object containing Millenium data HI data
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.processHIData = function(recordData) {

	var doesHiDataExist = true;
	var component = this;
	var hiData = "";
	try {
		hiData = this.validateHidata(recordData, false);
		
		if (recordData.HIURI && hiData !== "") {
			var bannerHeader = this.m_immuni18n.EXTERNAL_DATA_LABEL;
			$('#hibanner' + component.compID).html(this.createHIAddDataControl(bannerHeader));
			var self = this;
			$("#hiDataControlBtn" + component.getComponentId()).click(function() {
				//Use CAP timer to track usage of HealtheIntent Data
				var timer = new CapabilityTimer("CAP:MPG Display HealtheIntent Data");
				if (timer) {
					timer.capture();
				}
				if (!self.m_doesSidePanelExist && !self.m_isForecastCompat) {
				    self.m_prevMill = false;
					self.m_prevHi = true;
					self.addSidePanel();
				}
				self.showHIData(hiData);
			});
		}
	} catch (err) {
		MP_Util.LogJSError(err, this, "immunizations-o2.js", "processHIData");
	}

};

/**
 * Validates The HI data.
 * @param {Object} recordData The record data object
 * @returns {boolean} isPagingInvloved is the data for from paging
 * @returns {string} The parse HI data
 */
ImmunizationsO2Component.prototype.validateHidata = function(recordData, isPagingInvloved, isHI) {
	var record;
	if (isHI) {
		record = recordData.getResponse();
	}
	else {
		record = recordData;
	}
	var hiData = "";
	var self = this;
	try {
		if (record.STATUS_DATA.SUBEVENTSTATUS[0].OPERATIONSTATUS !== 'S') {
			throw new Error("HI retrieval failed because of OPERATIONSTATUS === F");
		}
		hiData = JSON.parse(record.HTTPREPLY.BODY);
		this.m_hiDataGlobal = hiData;
		if (record.STATUS_DATA.SUBEVENTSTATUS[0].OPERATIONSTATUS === 'S' && hiData.total_results === 0) {
			hiData = "";
			return hiData;
		}
	} catch (err) {
		MP_Util.LogJSError(err, this, "immunizations-o2.js", "validateHidata");
		logger.logError(err.message);
		if (!isPagingInvloved) {
			$('#hibanner' + self.compID).html(self.createHIAddDataControl("<b>" + self.m_immuni18n.EXTERNAL_DATA_LABEL_ERR + "</b>"));
			$("#hiDataControlBtn" + self.getComponentId()).remove();
		}
		else {
			$('#hidata' + self.compID).html(MP_Util.HandleErrorResponse("", self.m_immuni18n.EXTERNAL_DATA_LABEL_ERR));
		}
		hiData = "";
		return hiData;
	}
	return hiData;
};

/**
 * Creates the side panel 
 * @param {Object} data The side panel JSON data
 * @returns {string} The HTML markup of the HI side panel
 */
ImmunizationsO2Component.prototype.displayHeaderForSidePanel = function() {
	var bannerHeader = this.m_immuni18n.OUTSIDE_RECORDS_UNVERIFIED;
	var imgUrl = this.getCriterion().static_content + "/images/6965.png";
	var imgSpan = "<span><img class='immun-o2-hi-img' id='externalData" + this.getComponentId() + "' src= '" + imgUrl + "'></span>";
	var HITitleSpan = "<span>" + bannerHeader + "</span>";
	var hiAddDataContainer = "<div id='hiSidePanelInfoContainer" + this.getComponentId + "'>" + imgSpan + HITitleSpan + "</div><div class='immun-o2-br'></div>";
	return hiAddDataContainer;
};	

/**
 * Creates the side panel 
 * @param {Object} data The side panel JSON data
 * @returns {string} The HTML markup of the HI side panel
 */
ImmunizationsO2Component.prototype.getHistoryInfoHtmlForHi = function(data) {

	var action_date = "";
	var hiDataForsidepanel = "";
	var commentDiv = "<div id='comDev'" + this.getComponentId() + ">";
	for (var i = 0; i < data.immunizations.length; i++) {
		var date = new Date();
		var commentsHtml = "";
		if (data.immunizations[i].administered_datetime !== null) {
			date.setISO8601(data.immunizations[i].administered_datetime);
			action_date = date.format("mediumDate");
		}
		else {
			action_date = "--";
		}
		
		if (data.immunizations[i].comments !== null && data.immunizations[i].comments.length !== 0) {
			for (var j = 0; j < data.immunizations[i].comments.length; j++) {
				var commentDate = new Date();
				commentDate.setISO8601(data.immunizations[i].comments[j].datetime);
				commentsHtml += "<span class='immun-o2-rp-comments-text-hi'>" + commentDate.format("shortDate3") + "</span>";
				commentsHtml += "<span class='immun-o2-rp-comments-text'>" + data.immunizations[i].comments[j].text + "</span><div class='immun-o2-br'></div>";
			}
		}
		else {
			commentsHtml = "--<div class='immun-o2-br'></div>";
		}

		var lotNumberStr = (data.immunizations[i].lot_number === null) ? "--" : data.immunizations[i].lot_number;
		var statusStr = "--";
		if (data.immunizations[i].status !== null) {
			statusStr = (data.immunizations[i].status.display === null) ? "--" : data.immunizations[i].status.display;
		}

		var manufacturerStr = (data.immunizations[i].manufacturer === null) ? "--" : data.immunizations[i].manufacturer;
		var sourcePartDesc = "--";
		var sourceType = "--";
		if (data.immunizations[i].source !== null) {
			sourcePartDesc = (data.immunizations[i].source.partition_description === null) ? sourcePartDesc : data.immunizations[i].source.partition_description;
			sourceType = (data.immunizations[i].source.type === null) ? sourceType : data.immunizations[i].source.type;
		}
		var productDrugname = "--";
		var productDoseQuantity = "--";
		var productRoute = "--";
		var productDoseUnit = "--";
		if (data.immunizations[i].product !== null) {
			productDrugname = (data.immunizations[i].product.drug_name === null) ? productDrugname : data.immunizations[i].product.drug_name;
			productDoseQuantity = (data.immunizations[i].product.dose_quantity === null) ? productDoseQuantity : data.immunizations[i].product.dose_quantity;
			productRoute = (data.immunizations[i].product.route === null) ? productRoute : data.immunizations[i].product.route;
			productDoseUnit = (data.immunizations[i].product.dose_unit === null) ? productDoseUnit : data.immunizations[i].product.dose_unit;
		}

		var dateStr = (action_date === null) ? "--" : action_date;
		var providerStr = (data.immunizations[i].provider_name === null) ? "--" : data.immunizations[i].provider_name;
		var codeDisplayStr = "--";
		if (data.immunizations[i].code !== null) {
			codeDisplayStr = (data.immunizations[i].code.display === null) ? codeDisplayStr : data.immunizations[i].code.display;
		}
		this.m_countInnerDiv++;

		var lotNumberandManufacturerDiv = "<div class='immun-o2-lotManufacturer'><div class='immun-o2-lot'>" + this.m_immuni18n.LOT_NUMBER + ":<div class='immun-o2-br'></div>" + lotNumberStr + "</div>" + "<div class='immun-o2-manufacturer'>" + this.m_immuni18n.MANUFACTURER + ":<div class='immun-o2-br'></div>" + manufacturerStr + "</div></div>";
		var statusHtml = "<span id='statusLabelHI" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.IMMUN_STATUS + ": </span><div class='immun-o2-br'></div>" + "<span id='sourceValueHi" + this.compID + "' class='immun-o2-sp-label'>" + statusStr + "</span>";

		var sourceHtml = "<span id='sourceLabelHI" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.SOURCE + ": </span><div class='immun-o2-br'></div>" + "<span id='sourceValueHI" + this.compID + "' class='immun-o2-sp-label'>" + sourcePartDesc + " (" + sourceType + ")" + "</span>";
		var productHtml = "<span id='productLabelHI" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.PRODUCT + ": </span><div class='immun-o2-br'></div>" + "<span id='sourceValueHI" + this.compID + "' class='immun-o2-sp-label'>" + productDrugname + "&nbsp;" + productDoseQuantity + productDoseUnit + "</span><div class='immun-o2-br'></div>" + "<span id='sourceValueHI" + this.compID + "' class='immun-o2-sp-label'>" + productRoute + "</span>";
		var commentsFinalHtml = "<span id='commentsLabelHI" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.COMMENTS + ": </span><div class='immun-o2-br'></div>" + commentsHtml;

		var detailedInfoHtml = "<div class = 'immun-o2-sp-container'>" + sourceHtml + "<div class='immun-o2-br'></div><div class='immun-o2-br'></div>" + productHtml + "<div class='immun-o2-br'></div><div class='immun-o2-br'></div>" + lotNumberandManufacturerDiv + "<div class='immun-o2-br'></div><div class='immun-o2-br'></div>" + commentsFinalHtml + "" + statusHtml + "</div>";
		var actionDateAgeHtml = "<div class='immun-o2-expand-content'><span class='immun-o2-toggle'>&nbsp;</span><span>" + action_date + "</span><div class='immun-o2-br'></div><div class='immun-o2-br'></div>" + providerStr + "<div class='immun-o2-br'></div>" + codeDisplayStr + "</div>";
		hiDataForsidepanel += "<div id ='" + this.compID + "historyItemRowHI" + this.m_countInnerDiv + "' class='immun-o2-rp-history-content closed'>" + actionDateAgeHtml + detailedInfoHtml + "</div><div class='sp-separator2'></div>";
	}
	this.m_countDiv++;
	var historyInfoHtml = "<div id='historyInforForHI" + this.compID + this.m_countDiv + "rp-history' class='immun-o2-rp-history-hi'>" + hiDataForsidepanel + "</div>";

	return historyInfoHtml;
};


/**
 * This will be called after adding the side panel and column sort.
 * Select the first row in the table as default and render panel with that information.
 * Reset back the scroll bar position to top if required.
 * @param {Boolean} scrollToTop - flag to decide whether the scroll bar position needs to be reset to top.
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.selectDefaultRowHi = function(scrollToTop) {
	var $tableView = $("#" + this.compID + "tableviewHI");

	if ($tableView && $tableView.length) {
		var tableRowArr = $tableView.find('.result-info');
		var firstRow = tableRowArr[0];
		var rowId = this.getRowId(firstRow);
		var scrollTop = 0;

		this.m_lastSelectedRow = "";
		this.updateInfoHi(firstRow, this.m_HIImmunizationsTable.getRowById(rowId).getResultData(), true);

		// Since selecting the first row as default, reset back the scroll bar position of component body to top.
		if (scrollToTop) {
			$("#" + this.m_HIImmunizationsTable.getNamespace() + "tableBody").scrollTop(scrollTop);
		}
	}
};

/**
 * This is a callback which will be called on cell click of the component table for HI data
 * @param {Object} event The cell click event
 * @param {Object} data The row data
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.onRowClickForHi = function(event, data) {
	var selRow = $(event.target).parents("dl.result-info");
	if (!selRow.length || data.RESULT_DATA === null) {
		return;
	}

	this.updateInfoHi(selRow, data, false);
};

/**
 * Updates the background color for the HI row of the HI component table
 * @param {Object} selRowent The selected row object
 * @param {Object} data The row data
 * @param {boolean} isInitialLoad boolean denoting if it a page load event or not
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.updateInfoHi = function(selRow, data, isInitialLoad) {
	var rowId = this.getRowId(selRow);

	if(this.m_lastSelectedRow === rowId && this.m_isForecastCompat){
		var compTableDivElem = $("#compTableDivForImmunization" + this.compID);
		$(selRow).removeClass(this.compNS + "-row-selected selected");
		if (compTableDivElem.length) {
			compTableDivElem.removeClass("immun-o2-side-panel-addition").removeClass("immun-o2-side-panel-open");
		}
		//Close side-panel
		this.m_sidePanel.m_cornerCloseButton.click();
		this.m_lastSelectedRow = null;
		this.m_doesSidePanelExist = false; 
	}
	else {
		this.updateSelRowBgColor(selRow, isInitialLoad, 1);
		this.renderReadingPane(data, 1);

		// Update the lastSelectedRow value with index.
		this.m_lastSelectedRow = rowId;
	}

};

MP_Util.setObjectDefinitionMapping("WF_IMMUNIZATIONS", ImmunizationsO2Component);

/**
 * Process the results from the service reply "Immunization_GetPersonForecast" for rendering the component table
 *
 * @param {Object} recordData Represents the forecast data from the service reply
 * @returns {undefined} returns nothing
 */

ImmunizationsO2Component.prototype.processResultsForecastRender = function(recordData) {
	try {
		var immunForecastRecLength = recordData.VACCINE_GROUPS_CNT;
		var i = 0;
		var j = 0;
		var k = 0;
		var vaccinationsObj = null;
		var vaccinationsLen = 0;
		var self = this;
		
		// This list is mainly for Order Immunizations Modal
		this.overdueVaccineList = [];
		this.inRangeVaccineList = [];

		/**
		 * Get the range for the Next Dose Range column for the component table,
		 * The range is typically the first dose that was unsatisfied
		 *
		 * @param {Object} vaccineGrp Vaccine group information
		 * @param {boolean} Overdue indicator is true if the Vaccine status is OVERDUE
		 *
		 * @returns {String} dateRangeStr String containing the Date range(s): Date is in the format of mm/dd/yy
		 */
		var getNextDoseRange = function(vaccineGrp, isOverdue) {
			var dateRangeStr = null;
			var dosesArr = vaccineGrp.DOSES;

			if (dosesArr && dosesArr.length) {
				var dosesLen = dosesArr.length;
				for ( k = 0; k < dosesLen; k++) {
					//Once the range has been set we need not move any further down the dosage list
					if (dosesArr[k].SATISFIED_BY.EVENT_ID === 0.0) {
						if (isOverdue) {
							if (dosesArr[k].RECOMMENDED_UNTIL) {
								dateRangeStr = self.convertAbsoluteDate(dosesArr[k].RECOMMENDED_UNTIL, "shortDate3");
							}
						}
						else {
							if (dosesArr[k].RECOMMENDED_FROM && dosesArr[k].RECOMMENDED_UNTIL) {
								dateRangeStr = self.convertAbsoluteDate(dosesArr[k].RECOMMENDED_FROM, "shortDate3") + " - " + self.convertAbsoluteDate(dosesArr[k].RECOMMENDED_UNTIL, "shortDate3");
							}
						}
						break;
					}
				}
			}
			return dateRangeStr;
		};

		/**
		 * Gets the Last action items such as the Last Action Date, Sort Rank (For component table sorting), Last action placement
		 * (In Vaccinations list or Exceptions list) and the Last action Object (for getting the Reason flag or admin_dt_tm_precision)
		 *
		 * @param {Object} vaccineGrp Vaccine group information
		 *
		 * @returns {String} dateRangeStr String containing the Date ranges
		 */
		var processVaccineForActionItems = function(vaccineGrp) {
			var actionObj = {
				lastActionObject : null,
				lastActionPlacement : null,
				lastActionDate : null
			};

			var vaccineLen = vaccineGrp.VACCINATIONS.length;
			var exceptionLen = vaccineGrp.EXCEPTIONS.length;
			var vaccineDate = null;
			var exceptionDate = null;
			var isoVaccineDate = null;
			var isoExceptionDate = null;
			var i = 0;
			var j = 0;
			var self = this;
			var tempVaccineStatus = "";
			var tempExcepResult = "";

			//If the vaccinations and exceptions are empty then it is a new dosage
			//else we need to check for individual items
			//Once both items are present then we need to compare the most recent dates and
			//then get the latest of them both. (Account for the precision)
			if (vaccineGrp) {
				if (vaccineLen && exceptionLen) {
					for (i = vaccineLen - 1; i >= 0; i--) {
						tempVaccineStatus = (vaccineGrp.VACCINATIONS[i].RESULT_STATUS_CODE.MEANING).toUpperCase();
						if ((tempVaccineStatus === "AUTH" || tempVaccineStatus === "MODIFIED" || tempVaccineStatus === "ALTERED") && vaccineGrp.VACCINATIONS[i].ADMIN_DT_TM) {
							vaccineDate = vaccineGrp.VACCINATIONS[i].ADMIN_DT_TM;
							break;
						}
					}
					//Compare the latest dates
					for (j = exceptionLen - 1; j >= 0; j--) {
						tempExcepResult = (vaccineGrp.EXCEPTIONS[j].RESULT_STATUS_CODE.MEANING).toUpperCase();
						if (tempExcepResult !== "INERROR") {
							exceptionDate = vaccineGrp.EXCEPTIONS[j].EXCEPTION_DT_TM;
							break;
						}
					}

					if (vaccineDate && exceptionDate) {
						isoVaccineDate = new Date();
						isoVaccineDate.setISO8601(vaccineDate);

						isoExceptionDate = new Date();
						isoExceptionDate.setISO8601(exceptionDate);

						if (isoVaccineDate > isoExceptionDate) {
							actionObj.lastActionPlacement = "VACCINATIONS";
							actionObj.lastActionObject = vaccineGrp.VACCINATIONS[i];
							actionObj.lastActionDate = isoVaccineDate;

						}
						//Display the exception ones if they are greater or equal to the admin date
						else {
							actionObj.lastActionPlacement = "EXCEPTIONS";
							actionObj.lastActionObject = vaccineGrp.EXCEPTIONS[j];
							actionObj.lastActionDate = isoExceptionDate;
						}
					}
					else if (!vaccineDate && exceptionDate) {
						//Unchart condition for case
						//Refuse a dose, Chart another dose, and then unchart this dose
						//Vaccinations will have an IN ERROR entry and EXCEPTIONS will have a REFUSAL
						isoExceptionDate = new Date();
						isoExceptionDate.setISO8601(exceptionDate);

						actionObj.lastActionPlacement = "EXCEPTIONS";
						actionObj.lastActionObject = vaccineGrp.EXCEPTIONS[j]; //"j" index would still have the correct value for mapping the EXCEPTIONS as we breaked off the loop
						actionObj.lastActionDate = isoExceptionDate;
					}
					else if (vaccineDate && !exceptionDate) {
						//Unchart condition for case
						//Chart a dose, Refuse another dose, unchart the refused dose
						//Vaccinations will have an AUTH entry and EXCEPTIONS will have a REFUSAL with may be different flag TODO check this after service update?
						isoVaccineDate = new Date();
						isoVaccineDate.setISO8601(vaccineDate);

						actionObj.lastActionPlacement = "VACCINATIONS";
						actionObj.lastActionObject = vaccineGrp.VACCINATIONS[i];
						actionObj.lastActionDate = isoVaccineDate;
					}
				}
				else {
					if (vaccineLen) {
						actionObj.lastActionPlacement = "VACCINATIONS";
						//The last vaccine may be an ERROR or UNCHARTED Vaccine, so we need to pick only the Administered ones
						for ( i = vaccineLen - 1; i >= 0; i--) {
							tempVaccineStatus = (vaccineGrp.VACCINATIONS[i].RESULT_STATUS_CODE.MEANING).toUpperCase();
							if ((tempVaccineStatus === "AUTH" || tempVaccineStatus === "MODIFIED" || tempVaccineStatus === "ALTERED") && vaccineGrp.VACCINATIONS[i].ADMIN_DT_TM) {
								//Get Object for Last Action Status
								actionObj.lastActionObject = vaccineGrp.VACCINATIONS[i];

								//Get date
								vaccineDate = vaccineGrp.VACCINATIONS[i].ADMIN_DT_TM;
								isoVaccineDate = new Date();
								isoVaccineDate.setISO8601(vaccineDate);
								actionObj.lastActionDate = isoVaccineDate;
								break;
							}
						}
					}
					else if (exceptionLen) {
						for (i = exceptionLen - 1; i >= 0; i--) {
							tempExcepResult = (vaccineGrp.EXCEPTIONS[i].RESULT_STATUS_CODE.MEANING).toUpperCase();
							if (tempExcepResult !== "INERROR") {
								exceptionDate = vaccineGrp.EXCEPTIONS[i].EXCEPTION_DT_TM;
								isoExceptionDate = new Date();
								isoExceptionDate.setISO8601(exceptionDate);

								actionObj.lastActionPlacement = "EXCEPTIONS";
								actionObj.lastActionObject = vaccineGrp.EXCEPTIONS[exceptionLen - 1];
								actionObj.lastActionDate = isoExceptionDate;
								break;
							}
						}
					}
				}
			}
			return actionObj;
		};

		//Reset the recordData for countering the component refresh
		if (recordData.HISTORICAL_SERIES) {
			recordData.HISTORICAL_SERIES = [];
		}
		if (recordData.CURRENT_SERIES) {
			recordData.CURRENT_SERIES = [];
		}

		// Load the personnel info
		this.m_personnelInfo = recordData.PERSONNEL;

		for ( i = immunForecastRecLength - 1; i >= 0; i--) {
			var dosageCount = 0;
			var currentVaccineGrp = recordData.VACCINE_GROUPS[i];
			var statusFlag = currentVaccineGrp.STATUS_FLAG;
			var actionDateStr = null;
			var actionDateObj = null;
			var actionStatusStr = null;
			var actionStatusRank = 0;
			var tempResultVal = "";

			vaccinationsObj = currentVaccineGrp.VACCINATIONS;
			vaccinationsLen = vaccinationsObj.length;

			if (vaccinationsLen >= 0) {
				//Get the last action and last action date for the current vaccine
				actionDateObj = processVaccineForActionItems(currentVaccineGrp);
				if (actionDateObj.lastActionPlacement === "EXCEPTIONS") {
					if (actionDateObj.lastActionObject) {
						switch (actionDateObj.lastActionObject.REASON_FLAG) {
						/**
						 0 - Unknown Reason
						 1 - Contraindication
						 2 - Refused by patient or guardian
						 */
							case 0:
								actionDateStr = actionDateObj.lastActionDate.format("shortDate3");
								actionStatusRank = 0; //It will show as "--" and sort to rank as 0
								break;
							case 1:
								actionDateStr = actionDateObj.lastActionDate.format("shortDate3");
								actionStatusStr = this.m_immuni18n.CONTRAINDICATED;
								actionStatusRank = 2;
								break;
							case 2:
								actionDateStr = actionDateObj.lastActionDate.format("shortDate3");
								actionStatusStr = this.m_immuni18n.REFUSED;
								actionStatusRank = 3;
								break;
							default:
								actionStatusRank = 0;
								break;
						}
					}
				}
				else if (actionDateObj.lastActionPlacement === "VACCINATIONS") {
					if (actionDateObj.lastActionObject) {
						actionDateStr = this.returnDisplayForPrecisionFlag(actionDateObj.lastActionObject.ADMIN_DT_PRECISION_FLAG, actionDateObj.lastActionDate);
						actionStatusStr = this.m_immuni18n.ADMINISTERED;
						actionStatusRank = 1;
						//If the vaccination is MODIFIED or ALTERED then we need to show the modified indicator
						tempResultVal = actionDateObj.lastActionObject.RESULT_STATUS_CODE.MEANING;
						if ((tempResultVal === "MODIFIED" || tempResultVal === "ALTERED") && actionDateStr) {
							actionDateStr += "<span class='res-modified'></span>";
						}
					}
				}

				for ( j = 0; j < vaccinationsLen; j++) {
					tempResultVal = (vaccinationsObj[j].RESULT_STATUS_CODE.MEANING).toUpperCase();
					//Corresponds to the CDF Meaning of the RESULT_STATUS_CD in the reply
					if ((tempResultVal === "AUTH" || tempResultVal === "MODIFIED" || tempResultVal === "ALTERED") && vaccinationsObj[j].ADMIN_DT_TM) {
						dosageCount++;
					}

					if (!currentVaccineGrp.EVENT_ID) {
						currentVaccineGrp.EVENT_ID = vaccinationsObj[j].EVENT_ID;
					}
				}

				currentVaccineGrp.VACCINE_GROUP_DISPLAY = currentVaccineGrp.VACCINE_GROUP_CODE.DISPLAY;
				currentVaccineGrp.DOSES_ADMIN = dosageCount;

				currentVaccineGrp.ADMIN_DATE = (actionDateObj && actionDateObj.lastActionDate) ? actionDateObj.lastActionDate : new Date(0, 0, 0);

				currentVaccineGrp.ADMIN_DATE_STRING = actionDateStr || "--";

				currentVaccineGrp.LAST_ACTION = actionStatusRank;
				currentVaccineGrp.LAST_ACTION_STRING = actionStatusStr || '--';
				/*
				 0 - Not Started
				 1 - Not yet due
				 2 - Due Today
				 3 - Overdue
				 4 - Complete
				 5 - Contraindicated

				 Assign a status rank for sorting in the component table
				 */
				if (statusFlag >= 0) {
					var overdueAfter = "";
					switch (statusFlag) {
						case 0:
						case 1:
							currentVaccineGrp.STATUS_STRING = "--";
							currentVaccineGrp.STATUS_RANK = 3;
							currentVaccineGrp.NEXT_DOSE_RANGE = getNextDoseRange(currentVaccineGrp) || "--";
							break;
						case 2:
							currentVaccineGrp.STATUS_STRING = this.m_immuni18n.IN_RANGE;
							currentVaccineGrp.STATUS_RANK = 2;
							currentVaccineGrp.NEXT_DOSE_RANGE = getNextDoseRange(currentVaccineGrp) || "--";
							this.inRangeVaccineList.push(currentVaccineGrp.VACCINE_GROUP_DISPLAY);
							break;
						case 3:
							currentVaccineGrp.STATUS_STRING = "<span class='immun-o2-forecast-status-overdue-bold'>" + this.m_immuni18n.OVERDUE + "</span>";
							currentVaccineGrp.STATUS_RANK = 1;
							currentVaccineGrp.NEXT_DOSE_RANGE = getNextDoseRange(currentVaccineGrp, true) || "--";
							this.overdueVaccineList.push(currentVaccineGrp.VACCINE_GROUP_DISPLAY);
							break;
						case 4:
							currentVaccineGrp.STATUS_STRING = this.m_immuni18n.COMPLETE;
							currentVaccineGrp.STATUS_RANK = 4;
							currentVaccineGrp.NEXT_DOSE_RANGE = "--";
							break;
						case 5:
							currentVaccineGrp.STATUS_STRING = this.m_immuni18n.CONTRAINDICATED;
							currentVaccineGrp.STATUS_RANK = 5;
							currentVaccineGrp.NEXT_DOSE_RANGE = "--";
							break;
						case 6:
							currentVaccineGrp.STATUS_STRING = this.m_immuni18n.AGED_OUT;
							currentVaccineGrp.STATUS_RANK = 6;
							currentVaccineGrp.NEXT_DOSE_RANGE = "--";
							break;
						case 7:
							currentVaccineGrp.STATUS_STRING = this.m_immuni18n.REFUSED_PERM;
							currentVaccineGrp.STATUS_RANK = 7;
							currentVaccineGrp.NEXT_DOSE_RANGE = "--";
							break;
						default:
							break;
					}
					//Add as each group for component table
					if (!(statusFlag === 0 || statusFlag === 1 || statusFlag === 2 || statusFlag === 3)) {
						if (!recordData.HISTORICAL_SERIES) {
							recordData.HISTORICAL_SERIES = [];
						}
						recordData.HISTORICAL_SERIES.push(currentVaccineGrp);
					}
					else {
						if (!recordData.CURRENT_SERIES) {
							recordData.CURRENT_SERIES = [];
						}
						recordData.CURRENT_SERIES.push(currentVaccineGrp);
					}
				}
			}
		}
	}
	catch(err) {
		logger.logJSError(err, this, "immunizations-o2.js", "processResultsForecastRender");
	}
};

/**
 *Click extension for the component table row items
 * @param {Object} Component table object to which rows we are assigning the click callback events
 * @returns {undefined} returns nothing
 */

ImmunizationsO2Component.prototype.addForecastCellClickExtension = function(componentTableObj) {
	try {
		var cellClickExtension = new TableCellClickCallbackExtension();
		var self = this;

		if (componentTableObj) {
			cellClickExtension.setCellClickCallback(function(event, data) {
				self.onForecastRowClick(event, data);
			});
			componentTableObj.addExtension(cellClickExtension);
		}
	}
	catch(err) {
		logger.logJSError(err, this, "immunizations-o2.js", "addForecastCellClickExtension");
	}
};

/**
 * Gets the row data of the clicked row in the component table and calls the updateForecastInfo to update the side panel
 *
 * @param {Object} event This represents the click event of the row clicked
 * @param {Object} data Corresponding table data passed to get the information into the side panel
 * @returns {undefined} returns nothing
 */

ImmunizationsO2Component.prototype.onForecastRowClick = function(event, data) {
	try {
		// The CAP timer need to be trigger only once per view point load
		// Once it fired, reset the bStartTimer to false.
		if (this.bStartTimer) {
			var rowClickTimer = new CapabilityTimer("CAP:MPG.IMMUNIZATIONS.O2", "");
			rowClickTimer.capture();
			this.bStartTimer = false;
		}

		var selRow = $(event.target).parents("dl.result-info");
		if (!selRow.length || data.RESULT_DATA === null) {
			return;
		}
		this.updateForecastInfo(selRow, data.RESULT_DATA);
	}
	catch(err) {
		logger.logJSError(err, this, "immunizations-o2.js", "onForecastRowClick");
	}
};

/**
 * Updates the sidepanel with the details of the clicked row
 * @param {Object} selRow Selected row data
 * @param {Object} data Corresponding table data passed to get the information into the side panel
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.updateForecastInfo = function(selRow, data) {
	try {
		if (selRow && data) {
			var rowId = this.getForecastTableRowId(selRow);
			var compTableDivElem = $("#compTableDivForImmunization" + this.compID);

			//Highlight only when clicked on a distinct row
			//Open the side panel if highlight only
			if (this.m_lastSelectedRow === rowId) {
				$(selRow).removeClass(this.compNS + "-row-selected selected");
				if (compTableDivElem.length) {
					compTableDivElem.removeClass("immun-o2-side-panel-addition").removeClass("immun-o2-side-panel-open");
				}

				//Close side-panel
				this.m_sidePanel.m_cornerCloseButton.click();
				this.m_lastSelectedRow = null;
				this.m_doesSidePanelExist = false;
			}
			else {
				//Remove highlight from current row to new row
				if (this.m_lastSelectedRow) {
					$("#" + this.compNS + this.compID + "\\:" + this.m_lastSelectedRow).removeClass(this.compNS + "-row-selected selected");
				}
				//Resize the table for arriving side-panel & Hide the next doses range column
				if (compTableDivElem.length) {
					compTableDivElem.addClass("immun-o2-side-panel-addition").addClass("immun-o2-side-panel-open");
				}

				//Open Side-panel
				if (!this.m_doesSidePanelExist) {
					this.activateSidePanel();
				}

				this.updateForecastSelRowBgColor(selRow);
				this.m_lastSelectedRow = rowId;
				this.renderForecastPanelContents(data, selRow);
			}
		}
	}
	catch(err) {
		logger.logJSError(err, this, "immunizations-o2.js", "updateForecastInfo");
	}
};

/**
 * Opens the side panel with the data of the selected Row in the component table
 * @param {Object}  selectedRowObj Corresponds to the row in the table selected
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.activateSidePanel = function() {
	try {
		var compTableElem = $("#immun-o2" + this.compID + "table");
		var tableHeight = "";

		var self = this;

		this.m_doesSidePanelExist = true;
		this.m_sidePanelMinHeight = "175px";
		if (compTableElem.length) {
			tableHeight = $("#compTableDivForImmunization" + this.compID).css("height");
		}
		if (this.m_sidePanelContainer && this.m_sidePanelContainer.length) {
			//Create the side panel
			this.m_sidePanel = new CompSidePanel(this.compID, this.m_sidePanelContainer.attr("id"));

			this.m_sidePanel.setExpandOption(this.m_sidePanel.expandOption.EXPAND_DOWN);
			var actionContents = "<div id='btnDiv" + this.compID + "' class='immun-o2-side-panel-button'><button class='immun-o2-hi-ext-btn-inv' id='HIButt" + this.compID + "'>" + this.m_immuni18n.VIEW_MORE_SIDE_PANEL_DATA + "</button></div>";

			// Render the side panel
			if (tableHeight) {
				this.m_sidePanel.setHeight(tableHeight);
			}
			this.m_sidePanel.setMinHeight(this.m_sidePanelMinHeight);
			this.m_sidePanel.renderPreBuiltSidePanel();
			this.m_sidePanel.setActionsAsHTML(actionContents);
			this.m_sidePanel.setContents("<div></div>", "immun-o2Content" + this.compID);

			this.m_sidePanel.showCornerCloseButton();
			this.m_sidePanel.setCornerCloseFunction(function() {
				$("#compTableDivForImmunization" + self.compID).removeClass("immun-o2-side-panel-addition").removeClass("immun-o2-side-panel-open");
				$("#immun-o2" + self.compID + "\\:" + self.m_lastSelectedRow).removeClass(self.compNS + "-row-selected selected");
				$("#" + self.compID + "hiTableForImmunizations\\:" + self.m_lastSelectedRow).removeClass(self.compNS + "-row-selected selected");
				self.m_lastSelectedRow = null;
				self.m_doesSidePanelExist = false;
				self.m_prevVacGroupId = "";
				self.m_vaccineGroupId = "";
				self.m_lastVaccineGrpId = "";
				//Clear the collection objects
				self.clearShellCollectionsObj();
			});
		}
	}
	catch (err) {
		MP_Util.LogJSError(err, this, "immunizations-o2.js", "activateSidePanel");
	}
};

/**
 * Renders the side panel for the row clicked
 *
 * @param {Object} data sidepanel data such as the Vaccination name, status and other details
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.renderForecastPanelContents = function(data, selRow) {
	try {
		var self = this;
		var actionHolderHtml = "";
		var scrollContainerHtml = "";
		this.m_lastModifiedVaccineGroupEventCode = 0;
		this.m_lastModifiedVaccineRow = null;

		this.vaccineData = data;
		this.sidePanelElement = $("#sidePanel" + this.compID);

		// If any loading spinner is shown then remove it so that the side panel can be refreshed with new data
		$("#sidePanel" + this.compID).find('.loading-screen').remove();

		this.m_sidePanel.removeSubtitle();

		this.m_sidePanel.setTitleText(data.VACCINE_GROUP_DISPLAY);

		// Set no alert banner HTML
		this.m_sidePanel.removeAlertBanner();
		//Set Subtitle for the selected Vaccine
		switch(data.STATUS_FLAG) {
			case 0:
			case 1:
				this.m_sidePanel.setSubtitleText(" (" + data.NEXT_DOSE_RANGE + ")");
				break;
			case 2:
				this.m_sidePanel.setSubtitleAsHTML(data.STATUS_STRING + " (" + data.NEXT_DOSE_RANGE + ")</span>");
				break;
			case 3:
				this.m_sidePanel.setSubtitleAsHTML(data.STATUS_STRING + "<span class='immun-o2-forecast-status-overdue-date'> (" + data.NEXT_DOSE_RANGE + ")</span>");
				break;
			default:
				this.m_sidePanel.setSubtitleText(data.STATUS_STRING);
				break;
		}

		actionHolderHtml = "<div class='immun-o2-action-holder' id='actionBtnHolder" + this.compID + "'>"+
							"<div id='sidePanelUnchartHistoryBtn" + this.compID + "' class='immun-o2-related-fields immun-o2-split-button'></div>"+
							"<div id='sidePanelModifyBtn" + this.compID + "' class='immun-o2-related-fields immun-o2-split-button'></div>" + 
							"<div id='saveHistoryBtn" + this.compID + "' " + "class='sp-button2 immun-o2-save-unchart'>" + i18n.SAVE + "</div>" +
							"<div id='saveUnchartBtn" + this.compID + "' " + "class='sp-button2 immun-o2-save-history disabled'>" + i18n.SAVE + "</div>" +
							"<div id='cancelHistoryBtn" + this.compID + "' class='sp-button2  immun-o2-cancel-history'>" + i18n.CANCEL + "</div>" +
							"<div id='resultViewerBtn" + this.compID + "' class='immun-o2-related-fields'></div>" +
							"</div>";

		scrollContainerHtml = "<div id='sidePanelScrollContainer" + this.compID + "' class = 'sp-body-content-area immun-o2-scroll-container'>" + this.loadForecastSidePanel(data) + "</div>";
		this.m_sidePanel.setActionsAsHTML(actionHolderHtml);

		// Set the html to render the side panel.
		this.m_sidePanel.setContents(scrollContainerHtml, "immun-o2Content" + this.compID);

		// Show the side panel expanded
		this.m_sidePanel.expandSidePanel();

		this.addDoseClickEvents("forecastSP");

		// Retrieving the container for adding Modify button
		this.modifyBtnHolder = $("#sidePanelModifyBtn" + this.compID);
		this.unchartHistBtnHolder = $("#sidePanelUnchartHistoryBtn" + this.compID);
		this.resultViewerBtnHolder = $("#resultViewerBtn" + this.compID);

		// Initializing a new instance of the button
		var modifySplitButton = new MPageUI.SplitButton();
		var unchartSplitButton = new MPageUI.SplitButton();
		var resultViewerButton = new MPageUI.Button();

		// Set the label of the drop-down
		modifySplitButton.setLabel(this.m_immuni18n.MODIFY);
		modifySplitButton.setStyle(MPageUI.BUTTON_OPTIONS.STYLE.SECONDARY);

		unchartSplitButton.setLabel(this.m_immuni18n.UNCHART_DOSE);
		unchartSplitButton.setStyle(MPageUI.BUTTON_OPTIONS.STYLE.SECONDARY);
		
		resultViewerButton.setLabel(this.m_immuni18n.MORE_DETAILS);
		resultViewerButton.setStyle(MPageUI.BUTTON_OPTIONS.STYLE.SECONDARY);
		
		//show the result viewer button
		this.resultViewerBtnHolder.append(resultViewerButton.render());
		
		//dither the result viewer button if there are no doses in the panel
		var forecastPanel = $("#" + this.compID + "forecastSP");
		if (forecastPanel) {
			if (forecastPanel.hasClass("immun-o2-empty-sp-align")) {
				resultViewerButton.setDisabled(true);
			} else {
				//set on click callback and attach events
				resultViewerButton.setOnClickCallback(function() {
					self.launchDoseResultViewer(data.DOSE_EVENT_IDS);
				});
				resultViewerButton.attachEvents();
			}
		}

		// Create the options object
		var modifyBtnOptions = [];
		var unchartBtnOptions = [];
		var vaccinationsLen = data.VACCINATIONS.length;
		var exceptionsLen = data.EXCEPTIONS.length;
		var actualVaccinLen = 0;
		var actualExceptionsLen = 0;
		var immunDetailsMapping = {};
		var vaccineImmunDetails = null;
		var modifyPrefixStr = "ModifyMode";
		var resultStatus = "";
		var resultFlag = -1;
		
		// Function that clears the scrollcontainer, hides the modify button and shows Save and Cancel buttons 
		var controlActionHolderButtons = function(sidePanelMode){
			// Clear the contents of the scroll container so that only the dose whose details are being modified stays in focus 
			self.sidePanelScrollContainer.empty();
			
			// Hide the Modify Button and show Save and Cancel buttons
			if(self.modifyBtnHolder){
				self.modifyBtnHolder.hide();
			}
			if(self.sidePanelSimpleModifyBtn){
				self.sidePanelSimpleModifyBtn.hide();
			}
			
			// Hide the unchart simple/split button 
			if(self.unchartHistBtnHolder){
				self.unchartHistBtnHolder.hide();
			}
			if(self.sidePanelSimpleUnchartBtn){
				self.sidePanelSimpleUnchartBtn.hide();
			}
			
			//Hide the result viewer button
			if (self.resultViewerBtnHolder) {
				self.resultViewerBtnHolder.hide();
			}
			
			// Show appropriate Save button
			if(sidePanelMode === "modify"){
				self.saveHistoryBtn.show();
			}
			else if(sidePanelMode === "unchart"){
				self.saveUnchartBtn.show();
			}

			self.cancelHistoryBtn.show();
			
			// Remove any existing spinner
			self.sidePanelElement.find('.loading-screen').remove();
			
			// Add a spinner, this will lock down the side panel until it renders all the fields
			MP_Util.LoadSpinner(self.sidePanelElement.attr("id"));
			self.sidePanelElement.find('.loading-screen').addClass("immun-o2-spinner");
		};
		
		// Callback function when an item from the list is selected
		var itemSelectCallBackFn = function(){
			// Go over each history item and retrieve the item matching the requested eventId
			for(var indx = 0; indx < vaccinationsLen; indx++){
				if(data.VACCINATIONS[indx].EVENT_ID === this.eventId){
					controlActionHolderButtons("modify");
					// Format the details so that it can be sent to a shell
					vaccineImmunDetails = self.formatImmunDetailsForShell(immunDetailsMapping[this.eventId]);
					
					// Call a function that creates a shell and renders all actionable fields
					self.createShellForEditMode(vaccineImmunDetails, self.sidePanelScrollContainer, modifyPrefixStr+this.eventId, 1);
					
					// Save this event ID for saving modifications
					self.saveContextEventID = this.eventId;
					break;
				}
			}
		};
		
		// Create list of items with admin dates in reverse order
		var adminDateItem = {};
		var date = null;
		
		for(var i = vaccinationsLen-1; i>=0 ; i--){
			// Only Administered and Modified items will be available to modify
			resultStatus =  data.VACCINATIONS[i].RESULT_STATUS_CODE.MEANING;
			if((resultStatus === "AUTH"|| resultStatus === "ALTERED"|| resultStatus === "MODIFIED") && data.VACCINATIONS[i].ADMIN_DT_TM){
				date = new Date();
				date.setISO8601(data.VACCINATIONS[i].ADMIN_DT_TM);
				var adminDateDisplay = this.returnDisplayForPrecisionFlag(data.VACCINATIONS[i].ADMIN_DT_PRECISION_FLAG, date);
				// The label of the option will be the admin date, mention the function that will be called when item is clicked and also add an event Id for reference
				adminDateItem = {label: adminDateDisplay, onSelect: itemSelectCallBackFn, eventId: data.VACCINATIONS[i].EVENT_ID};
				modifyBtnOptions.push(adminDateItem);
				// Add the event Id and its details into a map
				immunDetailsMapping[data.VACCINATIONS[i].EVENT_ID] = data.VACCINATIONS[i];
				actualVaccinLen ++;
			}
		}
		
		// Traverse through the list of exceptions and identify which actually are active
		for(var e = 0; e< exceptionsLen; e++){
			// Exceptions with status Refused, Unknown and Contraindicated will be considered as a part of a count
			/*0 - Unknown Reason
			1 - Contraindication
			2 - Refused by patient or guardian*/
			resultFlag =  data.EXCEPTIONS[e].REASON_FLAG;
			resultStatus = (data.EXCEPTIONS[e].RESULT_STATUS_CODE.MEANING).toUpperCase();
			if((resultFlag === 0 || resultFlag === 1 || resultFlag === 2) && resultStatus!=="INERROR"){
				actualExceptionsLen ++;
			}
		}

		// Add items to the drop-down only if more than 1 vaccinations or exception record exists
		if(modifyBtnOptions.length >= 1 && (actualVaccinLen + actualExceptionsLen > 1) ){
			modifySplitButton.addOptions(modifyBtnOptions);		
		}
		
		// Launch the drop-down even on the click of the Modify label
		modifySplitButton.getLabelButton().setOnClickCallback(function(){
			modifySplitButton.toggle();
		});
		
		// Render the drop-down into the button holder
		if (this.modifyBtnHolder) {
			this.modifyBtnHolder.append(modifySplitButton.render());
			modifySplitButton.attachEvents();
			// Disable the button if there are no items
			if(!modifyBtnOptions.length){
				modifySplitButton.getLabelButton().setDisabled(true);
				modifySplitButton.getDropdownButton().setDisabled(true);
				this.modifyBtnHolder.addClass("disabled");
			}
			// If only 1 option exists then simply show the Modify button without a drop-down
			else if(modifyBtnOptions.length === 1 && (actualVaccinLen + actualExceptionsLen === 1)){
				this.modifyBtnHolder.replaceWith("<div id='sidePanelSimpleModifyBtn" + this.compID + "' class='sp-button2'>"+this.m_immuni18n.MODIFY+"</div>");
			}
		}

		// Cache the buttons in the action holder
		this.saveHistoryBtn = $("#saveHistoryBtn" + this.compID);
		this.cancelHistoryBtn = $("#cancelHistoryBtn" + this.compID);
		this.sidePanelScrollContainer = $("#sidePanelScrollContainer" + this.compID);
		this.saveUnchartBtn = $("#saveUnchartBtn" + this.compID);
		
		// Event handler for the plain modify button when only 1 history item is present 
		if($("#sidePanelSimpleModifyBtn"+this.compID).length){
			this.sidePanelSimpleModifyBtn = $("#sidePanelSimpleModifyBtn"+this.compID);
			this.sidePanelSimpleModifyBtn.click(function(){
				vaccineImmunDetails = self.formatImmunDetailsForShell(immunDetailsMapping[adminDateItem.eventId]);
				controlActionHolderButtons("modify");
				// Call a function that creates a shell and renders all actionable fields
				self.createShellForEditMode(vaccineImmunDetails, self.sidePanelScrollContainer, modifyPrefixStr+adminDateItem.eventId, 1);
				
				// Save this event ID for saving modifications
				self.saveContextEventID = adminDateItem.eventId;
			});
		}
		
		// Event handler when Cancel button is selected
		this.cancelHistoryBtn.click(function() {
			// Clear collection objects
			self.clearShellCollectionsObj();
			// Revert the side panel back to read only mode 
			self.renderForecastPanelContents(data, selRow);
		});

		// Event handler when Save button is clicked
		this.saveHistoryBtn.click(function() {
			// Call the function to read the values of the fields generated by the shell
			var modifiedImmunDetails = self.readValuesFromImmunShellFields(modifyPrefixStr+self.saveContextEventID);
			// Set the event Id, event code and product which are non-modifiable. These needs to be resend even if though they are non-modifiable
			modifiedImmunDetails.EVENT_ID = self.saveContextEventID;
			modifiedImmunDetails.PARENT_ENTITY_ID = immunDetailsMapping[self.saveContextEventID].PARENT_ENTITY_ID || 0;
			modifiedImmunDetails.VACCINE_EVENT_CODE = immunDetailsMapping[self.saveContextEventID].IDENTIFIER.EVENT_CODE.CODE_VALUE;
			modifiedImmunDetails.PRODUCT_ID = immunDetailsMapping[self.saveContextEventID].PRODUCT.SYNONYM_ID || 0;
			
			// Save the vaccine event code to highlight the row when component refreshes 
			self.m_lastModifiedVaccineGroupEventCode = data.VACCINE_GROUP_CODE.CODE_VALUE;
			self.m_lastModifiedVaccineRow = selRow;
			
			// Add the modifiedImmunDetails object in m_immunizationsToSave
			self.m_immunizationsToSave.push(modifiedImmunDetails);
			
			// Call a function to save the modifications
			self.saveImmunizationsToDataBase(self.m_immunizationsToSave, "modify");
		});
		
		// Create a list of options to be added to the unchart split button
		var unchartDateItem = {};
		var unchartDateItemDisplay = "";
		if(this.sortedRowData && this.sortedRowData.length){
			var sortedRowLength = this.sortedRowData.length;
			for(var s = sortedRowLength-1; s>=0 ; s--){
				resultStatus = this.sortedRowData[s].RESULT_STATUS_CODE.MEANING;
				// For administered doses
				if((resultStatus === "AUTH"|| resultStatus === "ALTERED"|| resultStatus === "MODIFIED") && this.sortedRowData[s].ADMIN_DT_TM){
					date = new Date();
					date.setISO8601(this.sortedRowData[s].ADMIN_DT_TM);
					unchartDateItemDisplay = this.returnDisplayForPrecisionFlag(this.sortedRowData[s].ADMIN_DT_PRECISION_FLAG, date);
					
				}
				else if(this.sortedRowData[s].EXCEPTION_DT_TM){
					// Exceptions
					date = new Date();
					date.setISO8601(this.sortedRowData[s].EXCEPTION_DT_TM);
					unchartDateItemDisplay = this.returnDisplayForPrecisionFlag(0, date);
					// Add the event Id and its details into a map
					immunDetailsMapping[this.sortedRowData[s].EVENT_ID] = this.sortedRowData[s];
				}
				
				// The label of the option will be the admin date, mention the function that will be called when item is clicked and also add an event Id for reference
				unchartDateItem = {label: unchartDateItemDisplay, onSelect: function(){
					// Show only Save and Cancel buttons
					controlActionHolderButtons("unchart");
					// Handle selected item
					self.handleUnchartItemClick(data, immunDetailsMapping[this.eventId]);
					// Cache the eventId
					self.unchartEventID = this.eventId;
				}, eventId: this.sortedRowData[s].EVENT_ID};
				unchartBtnOptions.push(unchartDateItem);
			}
		}
		
		// Add options to unchartSplitButton
		if (unchartBtnOptions.length) {
			unchartSplitButton.addOptions(unchartBtnOptions);
		}
		
		// Launch the drop-down even on the click of the Unchart label
		unchartSplitButton.getLabelButton().setOnClickCallback(function(){
			unchartSplitButton.toggle();
		});
		
		// Render the button
		if (this.unchartHistBtnHolder) {
			this.unchartHistBtnHolder.append(unchartSplitButton.render());
			unchartSplitButton.attachEvents();
			// Disable the button if there are no items
			if(!unchartBtnOptions.length){
				unchartSplitButton.getLabelButton().setDisabled(true);
				unchartSplitButton.getDropdownButton().setDisabled(true);
				this.unchartHistBtnHolder.addClass("disabled");
			}
			// If only 1 option exists then simply show the Unchart button without a drop-down
			else if(unchartBtnOptions.length === 1){
				this.unchartHistBtnHolder.replaceWith("<div id='sidePanelSimpleUnchartBtn" + this.compID + "' class='sp-button2'>"+this.m_immuni18n.UNCHART_DOSE+"</div>");
			}
		}
		
		// Event handler for simple unchart button
		if($("#sidePanelSimpleUnchartBtn"+this.compID).length){
			this.sidePanelSimpleUnchartBtn = $("#sidePanelSimpleUnchartBtn"+this.compID);
			this.sidePanelSimpleUnchartBtn.click(function(){
				controlActionHolderButtons("unchart");
				// Call a function that will handle the click event
				self.handleUnchartItemClick(data, self.sortedRowData[0]);
				// Cache the eventId
				self.unchartEventID = self.sortedRowData[0].EVENT_ID;
			});
		}
		
		// Disable the saveUnchart button by default
		this.saveUnchartBtn.attr("disabled", true);
		
		// Event handler for saveUnchartBtn
		if(this.saveUnchartBtn){
			this.saveUnchartBtn.click(function(){
				// Format the details for saving
				var doseUnchartDetails = self.formatImmunDetailsForShell(immunDetailsMapping[self.unchartEventID]);
				// Format the date since it's in a non-compatible format
				doseUnchartDetails.ADMIN_DATE = self.convertAbsoluteDate(immunDetailsMapping[self.unchartEventID].ADMIN_DT_TM || immunDetailsMapping[self.unchartEventID].EXCEPTION_DT_TM);
				// Get the unchart reason 
				doseUnchartDetails.UNCHART_REASON = self.unchartReason;
				// Set the event type flag
				if(immunDetailsMapping[self.unchartEventID].EXCEPTION_DT_TM){
					doseUnchartDetails.EVENT_TYPE_FLAG = 1;
				}
				else{
					doseUnchartDetails.EVENT_TYPE_FLAG = 0;
				}
				// Add the unchartDetails object in m_immunizationsToSave
				self.m_immunizationsToSave.push(doseUnchartDetails);
				// Call to save
				self.saveImmunizationsToDataBase(self.m_immunizationsToSave, "unchart");
			});
		}
		
		this.m_panelShellFieldsRenderedCnt = 0;
		
		//add event listener
		CERN_EventListener.addListener({}, "shellFieldsRendered" + this.compID, this.panelShellFieldsEventCB, this);
	}
	catch(err) {
		logger.logJSError(err, this, "immunizations-o2.js", "renderForecastPanelContents");
	}
};

/**
 * This function will take the prepared event ids for the passed in row data and pass
 * them to the adhoc result viewer. It will also trigger the CAP timer.
 * @param {Object} doseEventIds - The event ids for the doses for the row that has been selected
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.launchDoseResultViewer = function(doseEventIds) {
	//pass the saved off dose event ids to the result viewer
	var capTimer = null;
	var category_mean = this.getCriterion().category_mean;
	try {		
		ResultViewer.launchAdHocViewer(doseEventIds);
		
		//trigger the cap timer to signify the result viewer was launched
		capTimer = new CapabilityTimer("CAP:MPG.IMMUNIZATIONS.O2 - Dose Result Viewer Launched", category_mean);
		if (capTimer) {
			capTimer.capture();
		}
	}
	catch(err) {
		logger.logJSError(err, null, "immunizations-o2.js", "launchDoseResultViewer");
	}
};

/**
 * This is call back function when the fields in the side panel are rendered. 
 * If all the 11 fields in the side panel are rendered then this function will remove the spinner, the listener and expands the side panel.
 * @returns {undefined} Returns nothing
 */
ImmunizationsO2Component.prototype.panelShellFieldsEventCB = function() {
	this.m_panelShellFieldsRenderedCnt++;
	
	// There are total of 11 items that will be rendered in the side panel. The spinner will be shown unless all items render.
	if (this.m_panelShellFieldsRenderedCnt === 11) {
		// Remove spinner
		this.sidePanelElement.find('.loading-screen').remove();
		// Expand the side panel 
		this.m_sidePanel.expandSidePanel();
		// Remove existing listener
		CERN_EventListener.removeListener({}, "shellFieldsRendered" + this.compID, this.panelShellFieldsEventCB, this);
	}
};

/**
 * This function will show the name of the vaccine group and the date of the dose selected in the header. 
 * In the content section of the side panel a text area will be displayed so that user can add any comments indicating
 * a reason for uncharting.
 * @param {Object} data A data object sent by renderForeCastPanelContent function containing selected vaccine's dose details
 * @param {Object} selectedItem A item selected from the unchart split button.
 * @returns {undefined} Returns nothing
 */
ImmunizationsO2Component.prototype.handleUnchartItemClick = function(data, selectedItem){
	try{
		// If the side panel container does not exist then throw an error 
		if(!this.sidePanelScrollContainer.length){
			throw new Error("this.sidePanelScrollContainer is not defined in ImmunizationsO2Component.prototype.handleUnchartItemClick function");
		}
		
		// Remove any spinner if loading
		this.sidePanelElement.find('.loading-screen').remove();
		var dateDisplay = "";
		var self = this; 
		var date = null;
		
		// Get the vaccine group display
		var vaccineName = data.VACCINE_GROUP_DISPLAY || "";
		
		// Extract the date of the dose selected
		// Case when a dose is administered/modified 
		if(selectedItem.ADMIN_DT_TM){
			date = new Date();
			date.setISO8601(selectedItem.ADMIN_DT_TM);
			dateDisplay = this.returnDisplayForPrecisionFlag(selectedItem.ADMIN_DT_PRECISION_FLAG, date); 
		}
		// Case when the dose is an exception
		else if(selectedItem.EXCEPTION_DT_TM){
			date = new Date();
			date.setISO8601(selectedItem.EXCEPTION_DT_TM);
			dateDisplay = this.returnDisplayForPrecisionFlag(0, date);
		}
		
		// Show the name of the vaccine and the date of the dose selected in the header 
		this.m_sidePanel.setTitleText(vaccineName+"  -  "+dateDisplay);
		this.m_sidePanel.removeSubtitle();
		
		// Show a text area for adding the reason for uncharting
		var reasonTextArea = new MPageUI.TextArea();
		reasonTextArea.setHeaderLabel(this.m_immuni18n.REASON_FOR_UNCHARTING);
		reasonTextArea.setWidth(this.sidePanelScrollContainer.width()-30);
		reasonTextArea.setHeightInPixels(100);
		reasonTextArea.setRequired(true);
		reasonTextArea.setOnChangeCallback(function(){
			// Cache the reason 
			self.unchartReason = reasonTextArea.getCurrentValue();
			
			if(reasonTextArea.getCurrentValue()){
				// Enable the Save button for unchart
				if(self.saveUnchartBtn){
					self.saveUnchartBtn.removeClass("disabled");
					self.saveUnchartBtn.attr("disabled", false);
				}
			}
			else{
				// Disable the Save button for unchart
				if(self.saveUnchartBtn){
					self.saveUnchartBtn.addClass("disabled");
					self.saveUnchartBtn.attr("disabled", true);
				}
			}
		});
		
		// Render the text area
		var reasonTextAreaHTML = reasonTextArea.render();
		
		// Append the text area HTML to the scroll container
		this.sidePanelScrollContainer.append("<div class='immun-o2-unchart-reason'>"+reasonTextAreaHTML+"</div>");
		reasonTextArea.attachEvents();
	}
	catch(err){
		logger.logJSError(err, this, "immunizations-o2.js", "handleUnchartItemClick");
	}
};

/**
 * Launches registry import win32 application and refreshes the component once all updates are completed
 * 
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.launchRegistryImportDialog = function() {
	var criterion = this.getCriterion();
	if(this.m_registryImportCOM) {
		this.m_registryImportCOM.LaunchRegistryImportDialog(criterion.person_id, criterion.encntr_id, 1);
		CERN_EventListener.fireEvent(null, this, "Updated Immunizations Available", null);
	}
};

/**
 * Gets last updated date of registry import documentation
 * Date is returned in string form following rule of 2's
 * @returns {String} Last update date for registry import documentation
 */
ImmunizationsO2Component.prototype.getLastUpdateRegImport = function() {
	var criterion = this.getCriterion();
	var daysSinceLastSync = -1;
	var today = new Date();
	
	daysSinceLastSync = this.m_registryImportCOM.GetRegistryImportLastSync(criterion.person_id, criterion.encntr_id);
	if(daysSinceLastSync > 0) {
		return this.m_immuni18n.AGE_AGO.replace("{0}", this.calculateAge(new Date(), new Date(today.setDate((today.getDate()-daysSinceLastSync)))));
	}
	else if(daysSinceLastSync === 0) {
		return this.m_immuni18n.TODAY;
	}
	return "--";
};

/**
 * Launches win32 consent dialog for patient decisions and refreshes the component once all updates are completed
 * 
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.launchConsentDialog = function() {
	var criterion = this.getCriterion();
	this.m_registryImportCOM.LaunchPatientDecisionsDialog(criterion.person_id, criterion.encntr_id);
	CERN_EventListener.fireEvent(null, this, "Updated Immunizations Available", null);
};

/**
 * Gets status of registry import consent
 * Status are assigned based on the values returned by the COM function
 * Following is the value to status assignment.
 *  {
 * 		0: 'Not Necessary'
 * 		2: 'Complete'
 * 		Default: 'Needed'
 * 	}
 * @returns {String} Status of the consent
 */
ImmunizationsO2Component.prototype.getConsentStatus = function() {
	var criterion = this.getCriterion();
	var statusValue = 0;	
	statusValue = this.m_registryImportCOM.GetPatientDecisions(criterion.person_id, criterion.encntr_id);
	if(statusValue === 0) {
		return this.m_immuni18n.NOT_NECESSARY;
	}
	else if(statusValue === 2){
		return this.m_immuni18n.COMPLETE;
	}
	else {
		return this.m_immuni18n.NEEDED;
	}	
};

/**
 * Renders the forecast vaccination information obtained from the Service "Immunization_GetPersonForecast" reply
 * This will include both the historical vaccination as well as the forecast information of that patient
 * The component table is rendered along with grouping of Historical series and Current Series
 *
 * @param {Object} recordData Response from the service
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.renderImmunForecastComponent = function(recordData) {
	try {
		var statusForecastColObj = null;
		var vaccineForecastColObj = null;
		var dosesAdminForecastColObj = null;
		var lastAdminDateForecastColObj = null;
		var lastActionForecastColObj = null;
		var nextDoseRangeColObj = null;
		var self = this;
		var componentHtml = "";
		var tableViewHtml = "";
		var sidePanelHtml = "";
		var hiBannerHtml = "";
		var currentSeriesGrp = "";
		var historicalSeriesGrp = "";
		var forecastTimer = null;
		var criterion = this.getCriterion();
		var registryImportPref = recordData.IMMUN_FORECAST.REG_IMPORT_PREF;
		
		//CAP timer to track how many use the forecast
		forecastTimer = new CapabilityTimer("CAP:MPG.IMMUNIZATIONS.O2 Immunization Forecast", this.getCriterion().category_mean);
		if (forecastTimer) {
			forecastTimer.addMetaData("rtms.legacy.metadata.1", "Opted Forecast Data");
			forecastTimer.capture();
		}
		
		// Fork to follow the path of Immunizations Forecast Service
		//processResults for Render - SIDEPANEL
		this.processResultsForecastRender(recordData.IMMUN_FORECAST);

		//Create the component table
		this.m_immunForecastTable = new ComponentTable();
		this.m_immunForecastTable.setNamespace(this.compNS + this.compID);
		
		//Prepare component table - m_immunForecastTable

		statusForecastColObj = {
			ID : "STATUS",
			CLASS : this.compNS + "-forecast-status",
			DISPLAY : i18n.STATUS,
			PRIMARY_SORT_FIELD : "STATUS_RANK",
			SEC_SORT_FIELD : "VACCINE_GROUP_DISPLAY",
			RENDER_TEMPLATE : "STATUS_STRING"
		};

		vaccineForecastColObj = {
			ID : "VACCINE",
			CLASS : this.compNS + "-forecast-vaccine",
			DISPLAY : this.m_immuni18n.VACCINE,
			PRIMARY_SORT_FIELD : "VACCINE_GROUP_DISPLAY",
			SEC_SORT_FIELD : "VACCINE_GROUP_DISPLAY",
			RENDER_TEMPLATE : "VACCINE_GROUP_DISPLAY"
		};

		dosesAdminForecastColObj = {
			ID : "DOSES_ADMIN",
			CLASS : this.compNS + "-forecast-doses",
			DISPLAY : this.m_immuni18n.DOSES_ADMIN,
			PRIMARY_SORT_FIELD : "DOSES_ADMIN",
			SEC_SORT_FIELD : "DOSES_ADMIN",
			RENDER_TEMPLATE : "DOSES_ADMIN"
		};

		lastAdminDateForecastColObj = {
			ID: "LAST_ADMIN_DATE",
			CLASS: this.compNS + "-forecast-last-admin-date",
			DISPLAY: this.m_immuni18n.LAST_ACTION_DATE,
			PRIMARY_SORT_FIELD: "ADMIN_DATE",
			SEC_SORT_FIELD: "ADMIN_DATE",
			RENDER_TEMPLATE: "ADMIN_DATE_STRING"
		};

		lastActionForecastColObj = {
			ID : "LAST_ACTION",
			CLASS : this.compNS + "-forecast-last-action",
			DISPLAY : this.m_immuni18n.LAST_ACTION,
			PRIMARY_SORT_FIELD : "LAST_ACTION",
			SEC_SORT_FIELD : "LAST_ACTION",
			RENDER_TEMPLATE : "LAST_ACTION_STRING"
		};

		nextDoseRangeColObj = {
			ID : "NEXT_DOSE_RANGE",
			CLASS : this.compNS + "-forecast-next-dose-range",
			DISPLAY : this.m_immuni18n.NEXT_DOSE_RANGE,
			PRIMARY_SORT_FIELD : "",
			SEC_SORT_FIELD : "",
			RENDER_TEMPLATE : "NEXT_DOSE_RANGE"
		};

		//Create the columns and add to the table
		this.m_immunForecastTable.addColumn(this.createForecastColumn(statusForecastColObj, true));
		this.m_immunForecastTable.addColumn(this.createForecastColumn(vaccineForecastColObj, true));
		this.m_immunForecastTable.addColumn(this.createForecastColumn(dosesAdminForecastColObj, true));
		this.m_immunForecastTable.addColumn(this.createForecastColumn(lastAdminDateForecastColObj, true));
		this.m_immunForecastTable.addColumn(this.createForecastColumn(lastActionForecastColObj, true));
		this.m_immunForecastTable.addColumn(this.createForecastColumn(nextDoseRangeColObj, false));

		//Set the data-attribute for each row
		this.m_immunForecastTable.setDataAttributeOnRow("data-immun-id", "EVENT_ID");

		if (recordData.IMMUN_FORECAST.CURRENT_SERIES && recordData.IMMUN_FORECAST.CURRENT_SERIES.length > 0) {
			currentSeriesGrp = new TableGroup().setGroupId("CURRENT_SERIES").setHideHeader(true).bindData(recordData.IMMUN_FORECAST.CURRENT_SERIES);
			this.m_immunForecastTable.addGroup(currentSeriesGrp);
		}

		if (recordData.IMMUN_FORECAST.HISTORICAL_SERIES && recordData.IMMUN_FORECAST.HISTORICAL_SERIES.length > 0) {
			historicalSeriesGrp = new TableGroup().setDisplay(this.m_immuni18n.HISTORICAL_SERIES).setGroupId("HISTORICAL_SERIES").setShowCount(true).bindData(recordData.IMMUN_FORECAST.HISTORICAL_SERIES);
			this.m_immunForecastTable.addGroup(historicalSeriesGrp);
		}

		//Sort by STATUS_RANK with VACCINE as Secondary Sorted
		this.m_immunForecastTable.sortByColumnInDirection("STATUS", TableColumn.SORT.ASCENDING);

		this.setComponentTable(this.m_immunForecastTable);

		this.addForecastCellClickExtension(this.m_immunForecastTable);

		tableViewHtml = "<div id='" + this.compID + "tableview' class='" + this.compNS + "-table'>" + this.m_immunForecastTable.render() + "</div>";
		sidePanelHtml = "<div id='" + this.compID + "sidePanelContainer' class='" + this.compNS + "-sidepanel-container'></div>";
		hiBannerHtml = "";
		componentHtml = "<div id ='" + this.compID + "maincontainer' class ='" + this.compNS + "-maincontainer " + this.compNS + "-maincontainer-position'>" + "<div id='hibanner" + this.compID + "'>" + hiBannerHtml + "</div>" + "<div id='compTableDivForImmunization" + this.compID + "' class='immun-o2-table-container'><div id='parentOfHidata" + this.compID + "' class='immun-o2-spinner-parent'><div id='hidata" + this.compID + "' class='immun-o2-scroll-hi'" + "></div></div>" + "<div id='pager" + this.compID + "'></div><div id='emptyDivAfterpager" + this.compID + "'></div>" + tableViewHtml + "</div>" + sidePanelHtml + "</div>";

		// If registry import pref is set to Yes, initialize COM object and render registry import link
		if(registryImportPref === 1) {
			this.m_registryImportCOM = CERN_Platform.getDiscernObject("HLMMPAGES");
			if(this.m_registryImportCOM) {
				var consentStatus = this.getConsentStatus();
				var lastConnectedDateString = this.m_immuni18n.LAST_CONNECTED + "&nbsp;" + this.getLastUpdateRegImport();
				// Generate markup for consent and registry import links
				componentHtml += "<div id ='" + this.compID + "registryLinksContainer' class='immun-o2-registry-links-container'>";
				componentHtml += "<span id ='" + this.compID + "consentContainer'><a id = '" + this.compID + "consentDialogLink'>" + this.m_immuni18n.CONSENT_TO_SHARE + "</a>:<span id='" + this.compID + "consentStatus' class='secondary-text'>&nbsp;" + consentStatus + "</span></span>&nbsp;|&nbsp;" ;
				componentHtml += "<span id ='" + this.compID + "regImportContainer'><a id ='" + this.compID + "regImportLink'>" + this.m_immuni18n.REGISTRY_IMPORT + "</a><span id='" + this.compID + "regImportLastUpdated' class='secondary-text'>&nbsp;(" + lastConnectedDateString + ")</span></span></div>";
			}	
		}
		
		this.finalizeComponent(componentHtml);

		this.m_sidePanelContainer = $("#" + this.compID + "sidePanelContainer");

		if (recordData.IMMUN_FORECAST.VACCINE_GROUPS_CNT !== 0) {
			this.m_totalImmunCount = recordData.IMMUN_FORECAST.VACCINE_GROUPS_CNT;
		}

		if (self.getExternalDataInd()) {
			this.processHIData(recordData);
		}
		
		// Attach registry import link event
		$("#"+ this.compID + "regImportLink").click( function() {
			self.launchRegistryImportDialog();
		});
		
		$("#" + this.compID + "consentDialogLink").click( function() {
			self.launchConsentDialog();
		});

		/**
		 * Override the toggleColumnSort method of ComponentTable to select the first row in the table view after sorting.
		 * @param {string} columnId The id of the column to be sorted.
		 * @returns {undefined} returns nothing
		 */
		this.m_immunForecastTable.toggleColumnSort = function(columnId) {

			//Call the base class functionality to sort column
			ComponentTable.prototype.toggleColumnSort.call(this, columnId);

			// Select the first row and render the respective details on the side panel.
			if (self.m_doesSidePanelExist) {
				self.selectForecastDefaultRow(true);
			}
		};
		
		// When a vaccine dose is modified then highlight the row and show the data in the side panel 
		if(this.m_lastModifiedVaccineGroupEventCode && this.m_lastModifiedVaccineRow){
			// Find the data corresponding to this vaccine group event code
			var vaccineGrpLen = recordData.IMMUN_FORECAST.VACCINE_GROUPS.length;
			for(var v = 0; v < vaccineGrpLen; v++){
				if(recordData.IMMUN_FORECAST.VACCINE_GROUPS[v].VACCINE_GROUP_CODE.CODE_VALUE === this.m_lastModifiedVaccineGroupEventCode){
					var vaccineDetails = recordData.IMMUN_FORECAST.VACCINE_GROUPS[v];
					// Set the last selected row as blank so that the row can be highlighted
					var selectedVaccineRowElement = $("#" + this.compNS + this.compID + "\\:" + this.getForecastTableRowId(this.m_lastModifiedVaccineRow));
					selectedVaccineRowElement.removeClass(this.compNS + "-row-selected selected");
					this.m_lastSelectedRow = "";
					this.m_doesSidePanelExist = false;
					this.updateForecastInfo(selectedVaccineRowElement, vaccineDetails);
					// Reset the values 
					this.m_lastModifiedVaccineGroupEventCode = 0;
					this.m_lastModifiedVaccineRow = null;
					this.m_immunizationsToSave = [];
					break;
				}
			}
		}
			
	}
	catch(err) {
		logger.logJSError(err, this, "immunizations-o2.js", "renderImmunForecastComponent");
	}

};

/**
 * This will be called after adding the side panel and column sort.
 * Select the first row in the table as default and render panel with that information.
 * Reset back the scroll bar position to top if required.
 *
 * @param {Boolean} scrollToTop - flag to decide whether the scroll bar position needs to be reset to top.
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.selectForecastDefaultRow = function(scrollToTop) {
	var $tableView = $("#" + this.compID + "tableview");
	var tableRowArr = null;
	var firstRow = null;
	var scrollTop = 0;

	if ($tableView.length) {
		tableRowArr = $tableView.find('.result-info');
		firstRow = tableRowArr[0];

		this.m_lastSelectedRow = "";

		var identifiers = $(firstRow).attr("id").split(":");
		//If grouping is applied, we go through the group to find the row data
		if (this.m_immunForecastTable.isGroupingApplied()) {
			this.updateForecastInfo(firstRow, this.m_immunForecastTable.getGroupById(identifiers[1]).getRowById(identifiers[2]).getResultData());
		}
		else {
			this.updateForecastInfo(firstRow, this.m_immunForecastTable.getRowById(identifiers[1]).getResultData());
		}
		// Since selecting the first row as default, reset back the scroll bar position of component body to top.
		if (scrollToTop) {
			$("#" + this.m_immunForecastTable.getNamespace() + "tableBody").scrollTop(scrollTop);
		}
	}
};

/**
 * This function will return the row id from the id of DOM element.
 *
 * @param {Object} rowObj Row object corresponds to the data for the row clicked
 * @returns {string} rowId The row id of the passed in DOM object
 */
ImmunizationsO2Component.prototype.getForecastTableRowId = function(rowObj) {
	var rowId = "";
	if($(rowObj).attr("id")){
		var identifiers = $(rowObj).attr("id").split(":");

		if (identifiers.length > 0) {
			rowId = identifiers[1] + "\\:" + identifiers[2];
		}
	}

	return rowId;
};

/**
 * Activates the background color for the selected row indicating that the row was clicked
 *
 * @param {Object} selRowObj This is the data corresponding to the selected row required for highlighting
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.updateForecastSelRowBgColor = function(selRowObj) {
	var tableViewObj = null;
	var prevRow = null;
	if (this.m_prevHi) {
		tableViewObj = $("#" + this.compID + "tableviewHI");
		this.m_prevHi = false;
	}
	else {
		tableViewObj = $("#" + this.compID + "tableview");
	}
	this.m_prevMill = true;
	prevRow = tableViewObj.find(".selected");

	// Remove the background color of previous selected row.
	if (prevRow.length > 0) {
		prevRow.removeClass(this.compNS + "-row-selected");
		prevRow.removeClass(this.compNS + "-row-selected-init");
		prevRow.removeClass("selected");
	}
	if (selRowObj) {
		// Change the background color to indicate that its selected.
		$(selRowObj).addClass(this.compNS + "-row-selected selected");
	}
};

/**
 * Create a TableColumn object and set the properties like class name, display field,sorting info
 * @param {Object} colInfo Object of ComponentTable Column properties
 * @param {Boolean} isSortable A boolean to represent if the column will be sortable or not
 *
 * @returns {Object} TableColumn TableColumn properties that conforms to what Component Table artifact can recognize
 */
ImmunizationsO2Component.prototype.createForecastColumn = function(colInfo, isSortable) {

	var column = new TableColumn();

	column.setColumnId(colInfo.ID);
	column.setCustomClass(colInfo.CLASS);
	column.setColumnDisplay(colInfo.DISPLAY);
	column.setPrimarySortField(colInfo.PRIMARY_SORT_FIELD);
	column.setIsSortable(isSortable);
	column.addSecondarySortField(colInfo.SEC_SORT_FIELD, TableColumn.SORT.ASCENDING);

	column.setRenderTemplate('${ ' + colInfo.RENDER_TEMPLATE + '}');
	return column;		
};

/**
 * Loads the sidepanel with the information of the row clicked on. This includes Product information along with the Dosage that was
 * Administered, Refused or Contraindicated
 *
 * @param {Object} rowData Data pertaining to the Vaccine row clicked
 *
 * @returns {String} forecastSPHtml Markup string that makes up the sidepanel information for the vaccine selected
 */

ImmunizationsO2Component.prototype.loadForecastSidePanel = function(rowData) {
	try {
		//Do a timeline sort iff both the Vaccinations and Exceptions Object are present
		//Else we can show the individual Object arrays in the reverse order as they are already sorted

		//For Forecast Sidepanel info markup
		var forecastSPHtml = "";

		//Other Action related details
		var forecastActionItemHtml = "";
		var forecastActionDateHtml = "";
		var forecastActionProductHtml = "";
		var forecastActionCommentsHtml = "";
		var forecastActionExtraDetailsHtml = "";

		this.sortedRowData = [];
		var sortedRowDataLen = 0;
		var currentActionItem = null;
		var date = null;
		var actionDate = null;
		var actionItemStatus = "";

		/**
		 * Sorts the dates - VACCINATIONS and EXCEPTIONS into a single timeline so that it can be displayed in the reverse chronological
		 * order
		 *
		 * @param {Object} dirtyObject Object that contains the Vaccination dates this includes the vaccines with all status, hence we need
		 * to filter out only the ones we need
		 *
		 * @returns {Array} combinedImmArray Array containing the Admin. and Refused dates in Chronological order.
		 */

		var timelineSort = function(dirtyObject) {
			//Clean the dirtyObject by sorting
			var combinedImmArray = [];
			var i = 0;
			var tempExcepResult = -1;
			var tempVaccineStatus = "";

			for (i = 0; i < dirtyObject.EXCEPTIONS.length; i++) {
				tempExcepResult = (dirtyObject.EXCEPTIONS[i].RESULT_STATUS_CODE.MEANING).toUpperCase();
				if (tempExcepResult !== "INERROR") {
					combinedImmArray.push(dirtyObject.EXCEPTIONS[i]);
				}
			}

			for ( i = 0; i < dirtyObject.VACCINATIONS.length; i++) {
				tempVaccineStatus = (dirtyObject.VACCINATIONS[i].RESULT_STATUS_CODE.MEANING).toUpperCase();
				if ((tempVaccineStatus === "AUTH" || tempVaccineStatus === "MODIFIED" || tempVaccineStatus === "ALTERED") && dirtyObject.VACCINATIONS[i].ADMIN_DT_TM) {
					combinedImmArray.push(dirtyObject.VACCINATIONS[i]);
				}
			}
			//Once we have the combined list we can sort the list
			//Comparison can be made with either or condition as no Object will have both EXCEPTION date and ADMIN date

			combinedImmArray.sort(function(a, b) {
				var temp1 = new Date();
				var temp2 = new Date();

				temp1.setISO8601(a.ADMIN_DT_TM || a.EXCEPTION_DT_TM);
				temp2.setISO8601(b.ADMIN_DT_TM || b.EXCEPTION_DT_TM);
				return temp1.getTime() - temp2.getTime();
			});
			return combinedImmArray;
		};

		//We need to sort the row data to get the correct timeline
		if (rowData) {
			/**
			 * Cases:
			 * Both VACCINATIONS and EXCEPTIONS Objs are present - Show the combinedImmArray in reverse order
			 * Only VACCINATIONS is present - Show the admin ones in reverse order
			 * Only EXCEPTIONS is present - Show the refusals in reverse order
			 * Neither are there - Show the empty sidepanel text
			 */
			var rowDataVaccineLen = rowData.VACCINATIONS.length;
			var rowDataExcepLen = rowData.EXCEPTIONS.length;
			var resultViewerEventIds = [];

			if (rowDataVaccineLen && rowDataExcepLen) {
				this.sortedRowData = timelineSort(rowData);
			}
			else if (rowDataVaccineLen) {
				for (i = 0; i < rowDataVaccineLen; i++) {
					var tempVaccineStatus = (rowData.VACCINATIONS[i].RESULT_STATUS_CODE.MEANING).toUpperCase();
					if ((tempVaccineStatus === "AUTH" || tempVaccineStatus === "MODIFIED" || tempVaccineStatus === "ALTERED") && rowData.VACCINATIONS[i].ADMIN_DT_TM) {
						this.sortedRowData.push(rowData.VACCINATIONS[i]);
					}
				}
			}
			else if (rowData.EXCEPTIONS.length) {
				for (i = 0; i < rowData.EXCEPTIONS.length; i++) {
					tempExcepResult = (rowData.EXCEPTIONS[i].RESULT_STATUS_CODE.MEANING).toUpperCase();
					if (tempExcepResult !== "INERROR") {
						this.sortedRowData.push(rowData.EXCEPTIONS[i]);
					}
				}
			}

			//After sorting we need to map all the values into the appropriate display items so that it can be returned as a HTML markup to the
			// calling function
			sortedRowDataLen = this.sortedRowData.length;
			var i = 0;
			if (sortedRowDataLen) {
				for (i = sortedRowDataLen - 1; i >= 0; i--) {
					currentActionItem = this.sortedRowData[i];
					date = new Date();
					
					//save off the event code for each relevant dose
					resultViewerEventIds.push(currentActionItem.EVENT_ID);

					//We need to get the date no matter the Exception or Admin case scenario
					if (currentActionItem.ADMIN_DT_TM || currentActionItem.EXCEPTION_DT_TM) {
						date.setISO8601(currentActionItem.ADMIN_DT_TM || currentActionItem.EXCEPTION_DT_TM);
						//The side-panel would need to show the date in the format MM dd, yyyy
						actionDate = this.returnDisplayForPrecisionFlag(currentActionItem.ADMIN_DT_PRECISION_FLAG, date);
					}

					if (actionDate) {
						if (currentActionItem.ADMIN_DT_TM) {
							forecastActionDateHtml = "<div class='immun-o2-expand-content'><span class='immun-o2-toggle'>&nbsp;</span><span>" + actionDate + " (" + this.calculateAge(date) + ")</span></div>";
						}
						else {
							forecastActionDateHtml = "<div class='immun-o2-sp-refused-action-label'>" + actionDate + " (" + this.calculateAge(date) + ")</div>";
						}
					}
					else {
						if (currentActionItem.ADMIN_DT_TM) {
							forecastActionDateHtml = "<div class='immun-o2-expand-content'><span class='immun-o2-toggle'>&nbsp;</span><span>" + "--" + " (--)</span></div>";
						}
						else {
							forecastActionDateHtml = "<div class='immun-o2-sp-refused-action-label'>" + "--" + " (--)</div>";
						}

					}

					if (currentActionItem.EXCEPTION_DT_TM) {
						//REFUSED case -> we need to show REFUSED, CONTRAINDICATED or UNKNOWN

						switch(currentActionItem.REASON_FLAG) {
							/**
							 1 - Contraindication
							 2 - Refused by patient or guardian
							 */
							case 1:
								actionItemStatus = this.m_immuni18n.CONTRAINDICATED;
								break;
							case 2:
								actionItemStatus = this.m_immuni18n.REFUSED;
								break;
							default:
								break;
						}
						actionItemStatus += currentActionItem.REASON_CODE.DISPLAY ? " - " + currentActionItem.REASON_CODE.DISPLAY : "";
					}
					else {
						//ADMIN case -> We need to show the PRODUCT Display if Administered or Status

						if (currentActionItem.PRODUCT.PRODUCT_NAME && (currentActionItem.RESULT_STATUS_CODE.MEANING).toUpperCase() === "AUTH") {
							actionItemStatus = currentActionItem.PRODUCT.PRODUCT_NAME;
						}
						else {
							actionItemStatus = currentActionItem.RESULT_STATUS_CODE.DISPLAY;
						}
					}

					forecastActionProductHtml = "<span class='immun-o2-product secondary-text'>" + actionItemStatus + "</span>";

					forecastActionCommentsHtml = currentActionItem.COMMENTS.length ? this.prepareCommentInfo(currentActionItem.COMMENTS) : "";

					if (currentActionItem.ADMIN_DT_TM) {
						forecastActionExtraDetailsHtml = this.prepareExtraActionDetails(currentActionItem);
					}

					if (i !== 0) {
						forecastActionItemHtml += "<div id = forecastActionItem" + this.compID + "\:item" + i + " class='immun-o2-rp-history-content closed' data-event-id=" + currentActionItem.EVENT_ID + ">" + forecastActionDateHtml + forecastActionProductHtml + forecastActionCommentsHtml + forecastActionExtraDetailsHtml + "<div class='sp-separator'></div></div>";
					}
					else {
						forecastActionItemHtml += "<div id = forecastActionItem" + this.compID + "\:item" + i + " class='immun-o2-rp-history-content closed' data-event-id=" + currentActionItem.EVENT_ID + ">" + forecastActionDateHtml + forecastActionProductHtml + forecastActionCommentsHtml + forecastActionExtraDetailsHtml + "</div>";
					}
				}
				forecastSPHtml = "<div id=" + this.compID + "forecastSP class='immun-o2-rp-history'>" + forecastActionItemHtml + "</div>";
				
				//save the event ids to the rowData
				rowData.DOSE_EVENT_IDS = resultViewerEventIds;
			}
			else {
				forecastSPHtml = "<div id=" + this.compID + "forecastSP class='immun-o2-empty-sp-align'><span id=spGlyphPlaceholder" + this.compID + " class='immun-o2-empty-sp-glyph'></span><span id=spGlyphText" + this.compID + " class='immun-o2-empty-sp-glyph-text'>" + this.m_immuni18n.NO_VACCINE_DISP + "</span></div>";
			}
		}
		return forecastSPHtml;
	}
	catch (err) {
		logger.logJSError(err, this, "immunizations-o2.js", "loadForecastSidePanel");
	}
};

/**
 * Prepares the comments text with the author information and returns the markup so that it can be displayed in the sidepanel
 *
 * @param {Object} commentObj Comments list for that vaccination or exception
 *
 * @returns {String} commentsInfoHtml Markup containing the comment and the author name who commented
 */

ImmunizationsO2Component.prototype.prepareCommentInfo = function(commentObj) {
	var commentTextHtml = "";
	var commentsInfoHtml = "";
	var commentsLen = commentObj.length;
	var i = 0;
	for ( i = 0; i < commentsLen; i++) {
		var noteObj = commentObj[i];
		var text = noteObj.TEXT;

		commentTextHtml += "<span class='immun-o2-rp-comments-text'>" + text.replace("\n", "<br/>") + "</span><span class='immun-o2-provider author-timestamp-text secondary-text'>" + this.trackDownAuthor(noteObj.AUTHOR_ID) + "</span>";
	}
	commentsInfoHtml = "<div id='rpComments" + this.compID + "'>" + commentTextHtml + "</div>";
	return commentsInfoHtml;
};

/**
 * Tracks the author id from a list of personnel, using authorId
 *
 * @param {Object} authorId Unique id representing the Author
 *
 * @returns {String} authorName Author Name
 */

ImmunizationsO2Component.prototype.trackDownAuthor = function(authorId) {
	var authorName = "";
	var personnelInfoLen = this.m_personnelInfo.length;
	var i = 0;
	if (authorId) {
		for ( i = 0; i < personnelInfoLen; i++) {
			if (this.m_personnelInfo[i].PERSONNEL_ID === authorId) {
				authorName = this.m_personnelInfo[i].FULL_FORMATTED_NAME;
			}
		}
	}
	return authorName;
};

/**
 * Prepares the mark-up for the extra details for the administered dose in the
 * side-panel. This includes the separation of the additional information into 3
 * groups: VIS info, Dose details, Manufacturer details. The expiration and VIS
 * published date are absolute dates and only expiration date has a precision
 * flag.
 * 
 * @param {Object}
 *            actionInfo Object that includes the information that needs to be
 *            displayed
 * 
 * @returns {String} extraDetailsHtml Markup containing the additional detials
 *          in the sidepanel for the dosage chosen
 */

ImmunizationsO2Component.prototype.prepareExtraActionDetails = function(actionInfo) {
	var extraDetailsHtml = "";

	//Define all the markup variables
	var actionItemGroupHtml = "<div class = 'immun-o2-sp-group'>";
	var VISHtml = "";
	var VISInfoHtml = "";
	var VISPublishDateHtml = "";
	var VISGivenDateHtml = "";
	
	var doseQuantityHtml = "";
	var doseUnitHtml = "";
	var siteHtml = "";
	var routeHtml = "";
	var manufacturerHtml = "";
	var lotNumHtml = "";
	var sourceHtml = "";
	var personnelHtml = "";
	var expirationDateHtml = "";
	var expiryDateStr = "";
	var VISListLen = 0;
	var VISGivenDate = "";
	var date = null;
	var self = this;
	var i = 0;

	try {

		if (actionInfo) {
			VISListLen = actionInfo.INFORMATION_STATEMENTS_GIVEN.length;

			if (VISListLen === 0) {
				VISInfoHtml = "<div class='immun-o2-sp-content'><span id='spVisLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.VIS + ": </span>" + "<span id='spVisValue" + this.compID + "'class='immun-o2-sp-value'>" + "--" + "</span></div>";
				VISPublishDateHtml = "<div class='immun-o2-sp-content'><span id='spVisPublishedLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.VIS_PUBLISHED_DATE + ": </span>" + "<span id='spVisPublishedValue" + this.compID + "' class='immun-o2-sp-value'>" + "--" + "</span></div>";

				VISHtml = VISInfoHtml + VISPublishDateHtml;
			}
			else {
				// This handles the multiple VIS scenario in case of a combo vaccine
				for (i = 0; i < VISListLen; i++) {
					VISInfoHtml = "<div class='immun-o2-sp-content'><span id='spVisLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.VIS + ": </span>" + "<span id='spVisValue" + this.compID + "'class='immun-o2-sp-value'>" + actionInfo.INFORMATION_STATEMENTS_GIVEN[i].NAME + "</span></div>";
					VISPublishDateHtml = "<div class='immun-o2-sp-content'><span id='spVisPublishedLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.VIS_PUBLISHED_DATE + ": </span>" + "<span id='spVisPublishedValue" + this.compID + "' class='immun-o2-sp-value'>" + this.convertAbsoluteDate(actionInfo.INFORMATION_STATEMENTS_GIVEN[i].PUBLISHED_DATE, "shortDate3") + "</span></div>";

					VISHtml += VISInfoHtml + VISPublishDateHtml;
				}
			}
			
			if (VISListLen && actionInfo.INFORMATION_STATEMENTS_GIVEN[0].GIVEN_ON_DT_TM) {
				// As the date is fuzzy, non-absolute and without precision we
				// can directly format it by taking locale into consideration. 
				// Format is mm/dd/yy
				date = new Date();
				date.setISO8601(actionInfo.INFORMATION_STATEMENTS_GIVEN[0].GIVEN_ON_DT_TM);
				if(date.getTime() > 0){
					VISGivenDate = date.format("shortDate3");
				}
			}
			
			// Lot number is encoded while saving to take care of special characters so decode before displaying
			var decodedLotStr = "--";
			if(actionInfo.LOT_NUMBER.length){
				var entityStrInstance = new MPageEntity.EncodedString();
				decodedLotStr = entityStrInstance.toJs(actionInfo.LOT_NUMBER);
			}
			var doseValue = "--";
			if(actionInfo.ADMIN_DOSAGE){
				// Format the dose number depending on the locale
				var numberFormatter = MP_Util.GetNumericFormatter();
				if (mp_formatter._isNumber(actionInfo.ADMIN_DOSAGE)) {
					doseValue = numberFormatter.format(actionInfo.ADMIN_DOSAGE, "^." + MP_Util.CalculatePrecision(actionInfo.ADMIN_DOSAGE));
				}
			}
			VISGivenDateHtml = "<div class='immun-o2-sp-content'><span id='spVisGivenLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.VIS_GIVEN_DATE + ": </span>" + "<span id='spVisGivenValue" + this.compID + "' class='immun-o2-sp-value'>" + (VISGivenDate || "--") + "</span></div>";

			doseQuantityHtml = "<div class='immun-o2-sp-content'><span id='spDoseLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.DOSE_QUANTITY + ": </span>" + "<span id='spDoseValue" + this.compID + "'class='immun-o2-sp-value'>" + doseValue + "</span></div>";

			doseUnitHtml = "<div class='immun-o2-sp-content'><span id='spUnitLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.DOSE_UNIT + ": </span>" + "<span id='spUnitValue" + this.compID + "' class='immun-o2-sp-value'>" + ((actionInfo.ADMIN_DOSAGE_UNIT_CODE.DISPLAY === "" || actionInfo.ADMIN_DOSAGE_UNIT_CODE.DISPLAY === "unknown unit") ? "--" : actionInfo.ADMIN_DOSAGE_UNIT_CODE.DISPLAY) + "</span></div>";

			siteHtml = "<div class='immun-o2-sp-content'><span id='spSiteLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.SITE + ": </span>" + "<span id='spSiteValue" + this.compID + "' class='immun-o2-sp-value'>" + (actionInfo.ADMIN_SITE_CODE.DISPLAY || "--") + "</span></div>";

			routeHtml = "<div class='immun-o2-sp-content'><span id='spRouteLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.ROUTE + ": </span>" + "<span id='spRouteValue" + this.compID + "' class='immun-o2-sp-value'>" + (actionInfo.ADMIN_ROUTE_CODE.DISPLAY || "--") + "</span></div>";

			manufacturerHtml = "<div class='immun-o2-sp-content'><span id='spManufacturerLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.MANUFACTURER + ": </span>" + "<span id='spManufacturerValue" + this.compID + "'class='immun-o2-sp-value'>" + (actionInfo.MANUFACTURER_CODE.DISPLAY || "--") + "</span></div>";

			lotNumHtml = "<div class='immun-o2-sp-content'><span id='spLotNumberLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.LOT_NUMBER + ": </span>" + "<span id='spLotNumberValue" + this.compID + "' class='immun-o2-sp-value'>" + decodedLotStr + "</span></div>";
			
			//determine the admin personnel name
			var personnelName = this.trackDownAuthor(actionInfo.ADMIN_PERSONNEL_ID);
			
			if (actionInfo.SOURCE_CODE.DISPLAY) {
				sourceHtml = actionItemGroupHtml + "<div class='immun-o2-sp-content'><span id='spSourceLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.SOURCE + ": </span>" + "<span id='spSourceValue" + this.compID + "' class='immun-o2-sp-value'>" + actionInfo.SOURCE_CODE.DISPLAY + "</span></div>";
				
				//if source is provided it was a historical documented dose
				personnelHtml = "<div class='immun-o2-sp-content'><span id='spPersonnelLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.DOC_BY + ": </span><span id='spPersonnelValue" + this.compID + "' class='immun-o2-sp-value'>" + personnelName + "</span></div></div>";
			} else {
				//if source is NOT provided it was an administered dose
				personnelHtml = actionItemGroupHtml + "<div class='immun-o2-sp-content'><span id='spPersonnelLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.ADMIN_BY + ": </span><span id='spPersonnelValue" + this.compID + "' class='immun-o2-sp-value'>" + personnelName + "</span></div></div>";
			}
			
			sourceHtml = sourceHtml + personnelHtml;

			if (actionInfo.EXPIRATION_DATE) {
				switch(actionInfo.EXPIRATION_DT_PRECISION_FLAG) {
					/**
					1 – Date and Time
					2 – Day
					3 – Week
					4 – Month
					5 – Year
					*/
					case 4:
						expiryDateStr = this.convertAbsoluteDate(actionInfo.EXPIRATION_DATE, "shortDate4");
						break;
					case 5:
						expiryDateStr = this.convertAbsoluteDate(actionInfo.EXPIRATION_DATE, "shortDate5");
						break;
					default:
						expiryDateStr = this.convertAbsoluteDate(actionInfo.EXPIRATION_DATE, "shortDate3");
						break;
				}
			}
			expirationDateHtml = "<div class='immun-o2-sp-content'><span id='spExpDateLabel" + this.compID + "' class='immun-o2-sp-label secondary-text'>" + this.m_immuni18n.EXP_DATE + ": </span>" + "<span id='spExpDateValue" + this.compID + "' class='immun-o2-sp-value'>" + (expiryDateStr || "--") + "</span></div></div>";
		}
		extraDetailsHtml = "<div class = 'immun-o2-sp-container'>" + sourceHtml + actionItemGroupHtml + VISHtml + VISGivenDateHtml + "</div>" + actionItemGroupHtml + doseQuantityHtml + doseUnitHtml + siteHtml + routeHtml + "</div>" + actionItemGroupHtml + manufacturerHtml + lotNumHtml + expirationDateHtml + "</div>";

		return extraDetailsHtml;
	}
	catch (err) {
		logger.logJSError(err, this, "immunizations-o2.js", "prepareExtraActionDetails");
	}
};

/**
 * Parses the absolute date to convert into date format suitable for the
 * workflow
 * 
 * @param {String} targetDate String containing the absolute date
 * @param {String} dateFormat String indicating the type of date formatting is requested
 *
 * @returns {String} dateFormat String containing the Date, in ShortDate3:
 *          format "mm/dd/yy"
 */

ImmunizationsO2Component.prototype.convertAbsoluteDate = function(targetDate, dateFormat) {
	var dateStr = "";
	var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
	var dateArr = null;
	var dtTm = null;
	if (targetDate) {
		dateArr = targetDate.match(new RegExp(regexp));
		dtTm = new Date(dateArr[1], dateArr[3] - 1, dateArr[5]);
		if(dateFormat){
		dateStr = dtTm.format(dateFormat);
			return dateStr;
		}
	}
	return dtTm;
};

/**
 * Loads the MODAL for ordering immunizations, uses order-selection-control
 * utility
 * 
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.showImmunizationOrderModal = function() {
	var curOrdSel = null;

	/**
	 * It's assumed that some action takes place to call the code below which is
	 * why there is a check on curOrdSel being null, I used a button and the
	 * following code was in the onclick.
	 */

	var criterion = this.getCriterion();
	var docModalDialog = MP_ModalDialog.retrieveModalDialogObject(this.compNS + "-Dialog");
	// Get the Bedrock preference for the Immunization Orders Folders
	var orderFolderIdList = this.getImmunOrderBRInd();
	var orderFolderId = 0;
	var orderVaccineStatusHtml = "";
	var overdueVaccineListLen = 0;
	var inRangeVaccineListLen = 0;
	var i = 0;

	if (orderFolderIdList && orderFolderIdList.length) {
		orderFolderId = orderFolderIdList[0];
	}

	// Prepare the markup for Overdue and In Range Vaccine sub-header
	overdueVaccineListLen = this.overdueVaccineList ? this.overdueVaccineList.length : 0;
	inRangeVaccineListLen = this.inRangeVaccineList ? this.inRangeVaccineList.length : 0;
	if (overdueVaccineListLen) {
		var overdueListStr = "";
		for (i = 0; i < overdueVaccineListLen - 1; i++) {
			overdueListStr += this.overdueVaccineList[i] + "; ";
		}
		overdueListStr += this.overdueVaccineList[overdueVaccineListLen - 1];
		orderVaccineStatusHtml += "<div class='immun-o2-order-modal-status' id='immOrderModalOverdue" + this.compID + "'>" + this.m_immuni18n.OVERDUE + ": <div id='immOrderModalOverdueVal" + this.compID + "' class='secondary-text'>" + overdueListStr + "</div></div><div class='immun-o2-order-modal-separator'></div>";
	}

	if (inRangeVaccineListLen) {
		var inRangeListStr = "";
		for (i = 0; i < inRangeVaccineListLen - 1; i++) {
			inRangeListStr += this.inRangeVaccineList[i] + "; ";
		}
		inRangeListStr += this.inRangeVaccineList[inRangeVaccineListLen - 1];
		orderVaccineStatusHtml += "<div class='immun-o2-order-modal-status' id='immOrderModalInRange" + this.compID + "'>" + this.m_immuni18n.IN_RANGE + ": <div id='immOrderModalInRangeVal" + this.compID + "' class='secondary-text'>" + inRangeListStr + "</div></div><div class='immun-o2-order-modal-separator'></div>";
	}

	docModalDialog = new ModalDialog(this.compNS + "-Dialog");
	docModalDialog.setIsFooterAlwaysShown(true);
	this.curModalDialog = docModalDialog;
	docModalDialog.setTopMarginPercentage(10).setBottomMarginPercentage(10).setLeftMarginPercentage(30).setRightMarginPercentage(30).setIsBodySizeFixed(false);
	docModalDialog.setBodyDataFunction(function(docViewDlg) {
		docModalDialog.setBodyHTML(orderVaccineStatusHtml + curOrdSel.render());
		//Now that the control is rendered, finalize the order selection control
		curOrdSel.finalize();
	});

	if (!curOrdSel) {
		curOrdSel = new orderSelectionControl(this.compID, criterion);
		curOrdSel.setFolderId(orderFolderId);
		curOrdSel.setNameSpace(this.compNS + this.compID);
		curOrdSel.setOrderTitle(this.m_immuni18n.ORDER_IMMUN_MODAL);
		curOrdSel.setCloseFunction(function() {
			MP_ModalDialog.closeModalDialog(docModalDialog.getId());
		});
		//init -> getVenueTypeList -> createButtons -> setInitActions
		curOrdSel.init();
	}

	MP_ModalDialog.addModalDialogObject(docModalDialog);
	MP_ModalDialog.updateModalDialogObject(docModalDialog);

	$("#" + this.compNS + "Dialogbody").addClass("immun-o2-order-modal-dialog-body");
	$("#vwpModalDialog" + this.compNS + "Dialog").addClass("immun-o2-order-modal-dialog-container");

	docModalDialog.setFooterText(curOrdSel.getActionButtonsHTML());
	docModalDialog.setHeaderTitle(this.m_immuni18n.IMMUN_ORDERS);

	MP_ModalDialog.showModalDialog(docModalDialog.getId());
};

/**
 * Prepares the markup for the banner to be shown when there is insufficient privileges
 *
 * @returns {string} String containing the markup for the banner above the old millinnium data component table
 */
ImmunizationsO2Component.prototype.getNoPrivsBannerMarkup = function () {
	var warningBanner = new MPageUI.AlertBanner();
	warningBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.WARNING);
	warningBanner.setPrimaryText(i18n.discernabu.immunization_o2.INSUFF_PRIV_WARNING_BANNER);
	return warningBanner.render();
};

/**
 * Enumeration containing values to indicate the current modal type:
 * DOCUMENT_HISTORY : "Document History",
 * CHART_EXCEPTION : "Chart Exception"
 */
ImmunizationsO2Component.prototype.ImmunizationsModalEnum = {
	DOCUMENT_HISTORY : "Document History",
	CHART_EXCEPTION : "Chart Exception"
};

/**
 * Performs asynchronous script request to retrieve basic info about the current user and assigns it to m_providerInfo.
 * Fields set in m_providerInfo include:
 * NAME_FULL_FORMATTED,
 * NAME_LAST,
 * NAME_FIRST
 * If the script succeeds the member variable m_providerInfo will be updated. A failure will result in m_providerInfo being set to null.
 * @returns {Boolean} true if the request succeeded, false if no 
 */
ImmunizationsO2Component.prototype.getProviderInfo = function(){
	var self = this;
	var criterion = self.getCriterion();
	var scriptRequest = new ScriptRequest();
	scriptRequest.setProgramName("HM_GET_PERSON_NAME");
	scriptRequest.setParameterArray(["^MINE^", criterion.provider_id + ".0"]);
	scriptRequest.setAsyncIndicator(true);
	scriptRequest.setResponseHandler(function(scriptReply) {
		var scriptStatus = scriptReply.getResponse().STATUS_DATA.STATUS;
		if (scriptStatus === "S") {
			self.m_providerInfo = {
				PROVIDER_ID: criterion.provider_id,
				NAME_FULL_FORMATTED: scriptReply.getResponse().NAME_FULL_FORMATTED,
				NAME_LAST: scriptReply.getResponse().NAME_LAST,
				NAME_FIRST: scriptReply.getResponse().NAME_FIRST				 
			};
			return true;
		}
		else {
		   self.m_providerInfo = null;
		   return false;
		}
	});
	scriptRequest.performRequest();
};

/**
 * This file deals with creation and management of the Add Modify Shell used in the Immunizations Sidepanel
 * and the Document History Modal
 */

/**
 * Creates a shell for adding and modifying an immunization history. The function will retrieve data from code sets, retrieve product and VIS data for vaccine,
 * consume standard date controls to generate various date selectors. This shell creates actionable fields for following fields:
 * Admin Date, Source, Product, VIS, VIS Published date, VIS Given date, Lot, Manufacturer, Expiration Date, Dose, Dose Unit, Site, Route
 * If the immunizationDetailsObj contains a blank data then the fields will be defaulted to blank otherwise to the
 * values as indicated 
 * @param {Object} immunizationDetailsObj Current immunizations details object which contains the currently saved values
 * or a blank object. The object should include an event code and display name for vaccine
 * @param {Object} immunizationContainer A HTML element to which the generated HTML will be appended
 * @param {String} uniquePrefix A string that will appended to the ID's of the fields
 * @param {int} editMode 0-Add, 1-Edits. Specific action will be taken based on this flag
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.createShellForEditMode = function(immunizationDetailsObj, immunizationContainer, uniquePrefix, editMode){
	var self = this;
	var uniqueID = uniquePrefix + this.compID;

	try{
		// Return if no vaccine code and display is provided
		if(!immunizationDetailsObj.VACCINE_EVENT_CODE || !immunizationDetailsObj.VACCINE_DISPLAY.length){
			throw new Error("No vaccine code or display name provided for immunizationDetailsObj");
		}

		// Create div holders for various selectors, date selector, and text controls
		var immunContainerHTML = "<div id='adminDateContainer" + uniqueID + "' class='immun-o2-sp-controls est-admin-date'></div>" +
								 "<div id='sourceContainer" + uniqueID + "' class='immun-o2-sp-controls'></div>" +
								 "<div id='productContainer" + uniqueID + "' class='immun-o2-sp-controls'></div>" +
								 "<a id='addDetailsLink" + uniqueID + "' href='javascript:void(0);' class='immun-o2-add-details-link'>+ " + this.m_immuni18n.ADD_DETAILS + "</a>";

		// Append the content to the immunizationContainer 
		immunizationContainer.append(immunContainerHTML);

		//Render Admin Date Control
		this.renderAdminDateControlHTML($("#adminDateContainer" + uniqueID), uniquePrefix, immunizationDetailsObj);

		//Load the Source code dropdown only when the dose was saved from
		// Historical Documentation i.e if there is a value in Source only then load it
		if (immunizationDetailsObj.SOURCE_CD || !editMode) {
			// Callback function for rendering source selector
			var sourceCB = function (codeSetReply) {
				if (codeSetReply) {
					//Display source in alphabetical order
					codeSetReply.sort(this.SortByDisplay);
					// If a source does not exists in the first place then it is not a required field
					var requiredField = (immunizationDetailsObj.SOURCE_CD === 0 ) ? 0 : 1;
					this.renderCodeValuesOptions(codeSetReply, requiredField, $("#sourceContainer" + uniqueID), uniquePrefix + "Source", i18n.SOURCE, immunizationDetailsObj.SOURCE_CD || 0.0);
				}
			};

			// Only show the Source selector face up so retrieve the data from code set
			MP_Util.GetCodeSetAsync(30200, sourceCB.bind(this));
		}
		else {
			//This would mean that the source wasn't a modifiable entity, triggering a fireEvent for load
			CERN_EventListener.fireEvent(null, this, "shellFieldsRendered" + this.compID, this);
		}

		// Render Products
		var vaccineEventCode = immunizationDetailsObj.VACCINE_EVENT_CODE;
		// VIS and Products will be retrieved together since they are inter-dependent
		if (editMode) {
			this.retrieveProductAndVISInfo(vaccineEventCode, function() {
				self.renderProductHTML(immunizationDetailsObj, uniqueID, $("#productContainer" + uniqueID));
			});
		}
		else {
			//Get the VIS & product values for the vaccine and then populate only the Product
			this.prepareProductAndVISInfo(immunizationDetailsObj);
			this.renderModalDoseProduct(immunizationDetailsObj, uniquePrefix, $("#productContainer" + uniqueID));
		}

		// Click functionality for Add Details link
		$("#addDetailsLink" + uniqueID).click(function() {
			// Once the Add Details link is clicked remove/hide it
			$(this).remove();
			
			//add spinner to modal and trigger listener
			var modalExists = $("#vwpModalDialogdocumentImmunizationHistoryModal");
			var totalVISItems = immunizationDetailsObj.VIS_BUNDLE ? immunizationDetailsObj.VIS_BUNDLE.length : 0;
			var multiVISSelectorItemsHtml = "";
			var multiVISPubDateItemsHtml = "";
			var multiVISMainParentHtml = "";

			if (modalExists.length) {
				MP_Util.LoadSpinner("vwpModalDialogdocumentImmunizationHistoryModal", 1, "doseLoadSpinner");
				self.triggerFieldLoadListener(8);
			}

			// When Add Details link is clicked show the remaining immunization fields
			var immunContainerDetailsHTML = "<div id='VISBundleMainContainer" + uniqueID + "'></div>" +
				"<div id='VISBundleSubContainer" + uniqueID + "'></div>" +
				"<a id='addOtherVISLink" + uniqueID + "' href='javascript:void(0);' data-click-count=0 class='immun-o2-add-other-vis-link'>" + self.m_immuni18n.ADD_OTHER_VIS + "</a>" +
				"<div id='VISGivenDateContainer" + uniqueID + "' class='immun-o2-sp-controls immun-o2-sp-vis-given-date immun-o2-sp-vis-date'></div>" +
				"<div id='lotContainer" + uniqueID + "' class='immun-o2-sp-controls'></div>" +
				"<div id='manufacturerContainer" + uniqueID + "' class='immun-o2-sp-controls'></div>" +
				"<div id='substanceExpDateContainer" + uniqueID + "' class='immun-o2-sp-controls exact-admin-date'></div>" +
				"<div id='doseContainer" + uniqueID + "' class='immun-o2-sp-controls immun-o2-related-fields'></div>" +
				"<div id='doseUnitContainer" + uniqueID + "' class='immun-o2-sp-controls immun-o2-dose-unit'></div>" +
				"<div id='siteContainer" + uniqueID + "' class='immun-o2-sp-controls'></div>" +
				"<div id='routeContainer" + uniqueID + "' class='immun-o2-sp-controls immun-o2-route-container'></div>";

			//Append all the containers to the main container
			immunizationContainer.append(immunContainerDetailsHTML);

			if (editMode) {
				for (var i = 0; i < totalVISItems; i++) {
					multiVISMainParentHtml = "<div id='VISMainParentContainer" + uniqueID + "Modify" + i + "'></div>";
					$("#VISBundleMainContainer" + uniqueID).append(multiVISMainParentHtml);

					multiVISSelectorItemsHtml = "<div id='VISSelectorContainer" + uniqueID + "Modify" + i + "' class='immun-o2-sp-controls immun-o2-sp-vis-selector'></div>";
					multiVISPubDateItemsHtml = "<div id='VISPubDateContainer" + uniqueID + "Modify" + i + "' class='immun-o2-sp-controls immun-o2-sp-vis-pub-date immun-o2-sp-vis-date'></div></div>";

					$("#VISMainParentContainer" + uniqueID + "Modify" + i).append(multiVISSelectorItemsHtml).append(multiVISPubDateItemsHtml);
				}
				if(totalVISItems === 0){
					multiVISMainParentHtml = "<div id='VISMainParentContainer" + uniqueID + "Modify0" + "'></div>";
					$("#VISBundleMainContainer" + uniqueID).append(multiVISMainParentHtml);

					multiVISSelectorItemsHtml = "<div id='VISSelectorContainer" + uniqueID + "Modify0" + "' class='immun-o2-sp-controls immun-o2-sp-vis-selector'></div>";
					multiVISPubDateItemsHtml = "<div id='VISPubDateContainer" + uniqueID + "Modify0" + "' class='immun-o2-sp-controls immun-o2-sp-vis-pub-date immun-o2-sp-vis-date'></div></div>";

					$("#VISMainParentContainer" + uniqueID + "Modify0").append(multiVISSelectorItemsHtml).append(multiVISPubDateItemsHtml);
				}
			}
			else {
				multiVISSelectorItemsHtml = "<div id='VISSelectorContainer" + uniqueID + "' class='immun-o2-sp-controls immun-o2-sp-vis-selector'></div>";
				multiVISPubDateItemsHtml = "<div id='VISPubDateContainer" + uniqueID + "' class='immun-o2-sp-controls immun-o2-sp-vis-pub-date immun-o2-sp-vis-date'></div></div>";

				$("#VISBundleMainContainer" + uniqueID).append(multiVISSelectorItemsHtml).append(multiVISPubDateItemsHtml);
			}

			//Hide Add More VIS link and show only if there is a VIS
			$("#addOtherVISLink" + uniqueID).hide();

			$("#addOtherVISLink" + uniqueID).click({"EditMode": editMode, "UniqueId": uniqueID, "VaccineData": immunizationDetailsObj, "Prefix": uniquePrefix}, self.generateVISBundleCB.bind(self));

			if (editMode) {
				// Render VIS controls
				self.retrieveProductAndVISInfo(vaccineEventCode, function() {
					for (var i = 0; i < totalVISItems; i++) {
						self.renderVISControlsHTML($("#VISSelectorContainer" + uniqueID + "Modify" + i), $("#VISPubDateContainer" + uniqueID + "Modify" + i), $("#VISGivenDateContainer" + uniqueID), uniqueID, immunizationDetailsObj, i);
					}
					//This is for the case when there is no VIS added to begin with
					if(totalVISItems === 0){
						self.renderVISControlsHTML($("#VISSelectorContainer" + uniqueID + "Modify" + 0), $("#VISPubDateContainer" + uniqueID + "Modify" + 0), $("#VISGivenDateContainer" + uniqueID), uniqueID, immunizationDetailsObj, 0);
					}
				});
			}
			else {
				self.renderModalDoseVIS($("#VISSelectorContainer" + uniqueID), $("#VISPubDateContainer" + uniqueID), $("#VISGivenDateContainer" + uniqueID), uniqueID, immunizationDetailsObj);
			}

			// Retrieve code values for dose unit, manufacturer, route and site
			self.renderCodifiedFields(immunizationDetailsObj, immunizationContainer, uniquePrefix);
			
			// Show the substance expiration date
			self.renderSubstanceExpDate(immunizationDetailsObj, $("#substanceExpDateContainer" + uniqueID), uniqueID);
			
			// Show dose input field
			self.renderDoseInput(immunizationDetailsObj, $("#doseContainer" + uniqueID), uniqueID);
			
			// Render the Lot number
			self.renderLotInput(immunizationDetailsObj, $("#lotContainer" + uniqueID), uniqueID);
		});
	
		// If the shell is used for Edit mode then no need to show Add Details since it is only needed for Add mode 
		if (editMode) {
			$("#addDetailsLink" + uniqueID).triggerHandler('click');
		}
	}
	catch(err) {
		logger.logJSError(err, this, "immun-add-modify-shell.js", "createShellForEditMode");
	}
};

/**
 * Callback function that handles the control when there is an interaction with the admin date control
 * in the sidepanel or the doc hx modal.
 * @param {Object} event Click or a keyup event information which triggered the firing of the callback
 * @param {Object} adminDateControl Object containing the Admin Date control properties such as Container info and date values
 * @returns {undefined} nothing
 */
ImmunizationsO2Component.prototype.adminDateControlEventCB = function(event, adminDateControl) {
	//Fetch the unique prefix for that controller
	var uniquePrefix = adminDateControl.m_uniqueId.replace("adminDateControl", "").replace(this.compID, "");

	if (uniquePrefix && adminDateControl) {
		var adminDateContainer = adminDateControl.getDateSelectorContainer();
		// Get the date set
		var selectedAdminDate = adminDateControl.getSelectedDate();
		var saveHistoryBtnElement = $("#saveHistoryBtn" + this.compID);

		// Remove the required field class when a date is set
		if (selectedAdminDate) {
			adminDateContainer.find('input').removeClass("required-field-input");
			// Enable the save button in the side panel
			var today = new Date();
			if (saveHistoryBtnElement) {
				if (selectedAdminDate <= today) {
					saveHistoryBtnElement.attr("disabled", false);
					saveHistoryBtnElement.removeClass("disabled");
				}
				else {
					saveHistoryBtnElement.attr("disabled", true);
					saveHistoryBtnElement.addClass("disabled");
				}
			}
			//For indicator of Completeness, call the toggler function to change the boolean values to indicate satisfied or otherwise
			if (this.m_immunListLeftModal && this.m_immunListLeftModal.length && selectedAdminDate <= today) {
				if (this.m_immunizationModalType === this.ImmunizationsModalEnum.CHART_EXCEPTION) {
					this.toggleValidationExceptionItem(uniquePrefix, "ADMIN_DATE", 1);
				}
				else {
					this.toggleValidationDoseItem(uniquePrefix, "ADMIN_DATE", 1);
				}
			}
			else if(selectedAdminDate > today){
				if (this.m_immunizationModalType === this.ImmunizationsModalEnum.CHART_EXCEPTION) {
					this.toggleValidationExceptionItem(uniquePrefix, "ADMIN_DATE", 0);
				}
				else {
					this.toggleValidationDoseItem(uniquePrefix, "ADMIN_DATE", 0);
				}
			}
		}
		else {
			adminDateContainer.find('input').addClass("required-field-input");
			// Disable the save button in the side panel
			if (saveHistoryBtnElement) {
				saveHistoryBtnElement.attr("disabled", true);
				saveHistoryBtnElement.addClass("disabled");
			}
			if (this.m_immunListLeftModal && this.m_immunListLeftModal.length) {
				if (this.m_immunizationModalType === this.ImmunizationsModalEnum.CHART_EXCEPTION) {
					this.toggleValidationExceptionItem(uniquePrefix, "ADMIN_DATE", 0);
				}
				else {
					this.toggleValidationDoseItem(uniquePrefix, "ADMIN_DATE", 0);
				}
			}
		}
	}
};

/**
 * renderAdminDateControlHTML function will append a date control HTML in the adminDateContainer element provided by the consumer.
 * This includes a date precision control, date format selector, date input field and a date picker all rendered by a DateSelector artifact
 * @param {Object} adminDateContainer A HTML element to which the generated HTML will be appended
 * @param {String} uniquePrefix A string that will appended to the ID's of the fields 
 * @param {Object} immunizationDetailsObj Current immunizations details object which contains the currently saved values
 * or a blank object. The object should include an event code and display name for vaccine
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.renderAdminDateControlHTML = function(adminDateContainer, uniquePrefix, immunizationDetailsObj){
	try{
		var self = this;
		var uniqueId = "adminDateControl" + uniquePrefix + this.compID;
		var isChartExceptionModal = self.m_immunizationModalType === self.ImmunizationsModalEnum.CHART_EXCEPTION;

		// Read the estimated date preferences
		this.allowDateEstimation = this.immunRecordData.ALLOW_DATE_EST || 0;
		
		// Create a new date selector instance
		var adminDateControl = new DateSelector(); 
		
		adminDateControl.retrieveRequiredResources(function(){
			adminDateControl.setUniqueId(uniqueId);
			adminDateControl.setCriterion(self.m_criterion);
			adminDateControl.setDateSelectorContainer(adminDateContainer);
			adminDateControl.setFuzzyFlag(true);

			var label = isChartExceptionModal ? self.m_immuni18n.DATE : self.m_immuni18n.ADMIN_DATE;
			
			var adminDateControlHTML = adminDateControl.renderDateControl(); 
			adminDateContainer.append("<span class='immun-o2-shell-label'><span class='required-field-label'>*</span><span class='secondary-text'>" + label + "</span></span>", adminDateControlHTML);
			
			// Finalized actions after all elements are shown in the side panel
			adminDateControl.finalizeActions();
			
			// Set date if one is set 
 			if(immunizationDetailsObj.ADMIN_DATE){
 			    // The admin date appears to be in the format "/Date(2013-01-26T22:34:00.000+00:00)/" so it needs to be converted into a valid date object
				var selectedDateStr = "";
				var dateTime = new Date();
				dateTime.setISO8601(immunizationDetailsObj.ADMIN_DATE);
				adminDateControl.setSelectedDate(dateTime);
				
				// Get a precision flag that is DateSelector API compatible
				var dateFormatFlag = self.getDateSelectorPrecisionMapping(immunizationDetailsObj.ADMIN_DATE_FORMAT);
				adminDateControl.setSelectedDateFlag(dateFormatFlag);
	 
				if(dateTime){
					var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
					selectedDateStr = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
					adminDateControl.datePickerControl.datepicker("setDate", selectedDateStr);
				}
				adminDateControl.dateDisplayInput.removeClass("secondary-text");
				adminDateControl.setSelectedDatePrecisionCode(immunizationDetailsObj.ADMIN_DATE_PRECISION_CD || 0);
			}
 			else if (!isChartExceptionModal){
 				// Add a required field class to date input field
 				adminDateContainer.find('input').addClass("required-field-input");
 			}

			adminDateContainer.find('.dc-date-selector').addClass("immun-o2-sp-value-fields");

			if (isChartExceptionModal) {
				adminDateContainer.find('.dc-date-input').val("");
				adminDateControl.setSelectedDate(new Date());
				adminDateControl.setSelectedDateFlag(0);
				adminDateContainer.find('.dc-date-format-selector').hide();

				self.toggleValidationExceptionItem(uniquePrefix, "ADMIN_DATE", 1);
			}

			// If no estimated date is allowed then hide the date format selector. This will force the user to select an exact admin date
			if(!self.allowDateEstimation){
				adminDateControl.setSelectedDateFlag(0);	
				adminDateContainer.addClass("exact-admin-date");
			}
			
			// Add event listener for reading the date set in the date control
			CERN_EventListener.removeListener({}, "selectedDateAvailable" + uniqueId, self.adminDateControlEventCB, self);
			CERN_EventListener.addListener({}, "selectedDateAvailable" + uniqueId, self.adminDateControlEventCB, self);
			
			// Event listener for the changes in the input field
			adminDateContainer.find('input').on('keyup', function(){
				if($(this).val().length){
					$(this).removeClass("required-field-input");
				}
				else{
					$(this).addClass("required-field-input");
					adminDateControl.setSelectedDate(null);
				}
			});
		});
		
		// Push the admin date control objects in a collection so that they can be referred later while saving.
		this.m_adminDateSelectorCollection.push(adminDateControl);
	
		// Fire event to indicate that HTML has been rendered
		CERN_EventListener.fireEvent(null, this, "shellFieldsRendered"+this.compID, null);
		
	}
	catch(err){
		logger.logJSError(err, this, "immun-add-modify-shell.js", "renderAdminDateControlHTML");
	}
};

/**
 * getDateSelectorPrecisionMapping function will accept a precision flag send by a service and return an appropriate precision flag 
 * that is compatible with the DateSelector API. This mapping is needed because a flag of 1 returned from the service means something else 
 * for the DateSelector API. 
 * @param {int} resultPrecisionFlag A precision flag that the immunizations service returns for a date result 
 * @returns {int} dateSelectorPrecFlag A precision flag that is DateSelector compatible   
 */
ImmunizationsO2Component.prototype.getDateSelectorPrecisionMapping = function(resultPrecisionFlag){
	var dateSelectorPrecFlag = 0;
	
	// These are the precision flags mapping that service contains: 1 – Date and Time, 2 – Day,	3 – Week, 4 – Month, 5 – Year
	// DateSelector API Mapping is: 0 - Date, 1 - Week, 2 - Month/Year, 3 - Year 
	switch(resultPrecisionFlag){
		case 3:
				dateSelectorPrecFlag = 1;
				break;
		case 4:
				dateSelectorPrecFlag = 2;
				break;
		case 5:
				dateSelectorPrecFlag = 3;
				break;
		default:
				dateSelectorPrecFlag = 0;
				break;
	}
	return dateSelectorPrecFlag;
	
};

/**
 * retrieveProductAndVISInfo function makes a call to service 965246 to retrieve Products for a particular vaccine.
 * If service 965246 returns any products for the requested vaccine then another service 966902 is called to retrieve the VIS information for selected vaccine.
 * Service 965246 is PCO_GET_SYN_BY_EVENT_CD and accepts an event code to return active products
 * Service 966902 is IMMUNIZATION_GETVACCINEREFERENCE and accepts an event code to return VIS data.
 * @param {double} vaccineEventCode An event code of an immunization
 * @param {Function} callBackFunction A function that will be called once all products and VIS is returned
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.retrieveProductAndVISInfo = function(vaccineEventCode, callBackFunction) {
	var self = this;
	var retrieveProductTimer = null;
	var retrieveVISTimer = null;
	self.productRecordData = null;
	self.VISRecordData = null;

	try {
		// Trigger a USR timer to capture the time it takes to retrieve products
		retrieveProductTimer = new RTMSTimer("USR:MPG.IMMUNIZATIONS.O2 Retrieve Data for Documenting History", this.getCriterion().category_mean);
		if (retrieveProductTimer) {
			retrieveProductTimer.addMetaData("rtms.legacy.metadata.1", "Retrieving Products for selected vaccine");
			retrieveProductTimer.start();
		}

		// Call service 965246 to retrieve all Products
		var productRequest = new ScriptRequest();
		productRequest.setProgramName("mp_exec_std_request");
		productRequest.setDataBlob('{"REQUESTIN":{"EVENT_CD":' + vaccineEventCode + '.00}}');

		// Application ID:600005, Task ID:965210, Request ID:965246
		productRequest.setParameterArray([ "^MINE^", "^^", 600005, 965210, 965246 ]);
		productRequest.setResponseHandler(function(scriptReply) {
			// Stop the timer
			if (retrieveProductTimer) {
				retrieveProductTimer.stop();
			}
			// Get the product info from record data
			self.productRecordData = scriptReply.getResponse();

			// Start time to capture the time it takes to retrieve VIS data
			retrieveVISTimer = new RTMSTimer("USR:MPG.IMMUNIZATIONS.O2 Retrieve Data for Documenting History", self.getCriterion().category_mean);
			if (retrieveVISTimer) {
				retrieveVISTimer.addMetaData("rtms.legacy.metadata.1", "Retrieving Vaccine Information Sheet for selected vaccine");
				retrieveVISTimer.start();
			}

			// If products are retrieved then go ahead and retrieve the VIS info from service 966902
			var VISRequest = new ScriptRequest();
			VISRequest.setProgramName("mp_exec_std_request");
			VISRequest.setDataBlob('{"REQUESTIN":{"VACCINE_FLAG":1,"VACCINE":"' + vaccineEventCode + '"}}');
			// Application ID:3202004, Task ID:3202004, Request ID:966902
			VISRequest.setParameterArray(["^MINE^", "^^", 3202004, 3202004, 966902]);
			VISRequest.setResponseHandler(function (VISReply) {
				// Stop the timer
				if (retrieveVISTimer) {
					retrieveVISTimer.stop();
				}
				self.VISRecordData = VISReply.getResponse();

				// Call the callBackFunction if defined
				if (callBackFunction) {
					callBackFunction();
				}
			});

			VISRequest.performRequest();
		});
		// Perform request to execute call
		productRequest.performRequest();
	}
	catch (err) {
		if (retrieveProductTimer) {
			retrieveProductTimer.stop();
			retrieveProductTimer = null;
		}
		if (retrieveVISTimer) {
			retrieveVISTimer.stop();
			retrieveVISTimer = null;
		}
		logger.logJSError(err, this, "immun-add-modify-shell.js", "retrieveProductAndVISInfo");
	}
};

/**
 * Calls the GetCodeSetAsync Core function and calls the respective callback functions. Internally calls a function that generates HTML with code values in the drop-downs.
 * If the immunizationDetailsObj contains a blank data then the fields will be defaulted to blank otherwise to the
 * values as indicated. This function will only renders Source, Dose, Unit, Manufacturer and Route.
 * @param {Object} immunizationDetailsObj Current immunizations details object which contains the currently saved values
 * or a blank object. The object should include an event code
 * @param {Object} immunizationContainer A HTML element to which the generated HTML will be appended
 * @param {String} uniquePrefix A string that will be appended to the ID's of the fields
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.renderCodifiedFields = function(immunizationDetailsObj, immunizationContainer, uniquePrefix){
	var uniqueID = uniquePrefix + this.compID;
	
	try{
		// Define callback functions
		var manufacturerCB = function(codeSetReply){
			this.renderCodeValuesOptions(codeSetReply, 0, $("#manufacturerContainer" + uniqueID), uniquePrefix + "Manufacturer", this.m_immuni18n.MANUFACTURER, immunizationDetailsObj.MANUF_CD || 0.0);
		};	
		var doseUunitCB = function(codeSetReply){
			this.renderCodeValuesOptions(codeSetReply, 0, $("#doseUnitContainer" + uniqueID), uniquePrefix + "DoseUnit", this.m_immuni18n.DOSE_UNIT, immunizationDetailsObj.DOSE_UNIT_CD || 0.0);
		};
		var routeCB = function(codeSetReply){
			this.renderCodeValuesOptions(codeSetReply, 0, $("#routeContainer" + uniqueID), uniquePrefix + "Route", this.m_immuni18n.ROUTE, immunizationDetailsObj.ROUTE_CD || 0.0);
		};
		var siteCB = function(codeSetReply){
			this.renderCodeValuesOptions(codeSetReply, 0, $("#siteContainer" + uniqueID), uniquePrefix + "Site", this.m_immuni18n.SITE, immunizationDetailsObj.SITE_CD || 0.0);
		};
		
		// Retrieve code values for dose unit, manufacturer, route and site
		var codeSetList = {
				221: MP_Util.GetCodeSetAsync(221, manufacturerCB.bind(this)),
				54: MP_Util.GetCodeSetAsync(54, doseUunitCB.bind(this)),
				4001: MP_Util.GetCodeSetAsync(4001, routeCB.bind(this)),
				97: MP_Util.GetCodeSetAsync(97, siteCB.bind(this))
			};

		var keyList = Object.keys(codeSetList);
		
		// Iterate through all the code set list
		for (var i = 0; i < keyList.length; i++) {
			var x = codeSetList[keyList[i]];
		}
	}
	catch(err){
		logger.logJSError(err, this, "immun-add-modify-shell.js", "renderCodifiedFields");
	}
};

/**
 * This function will render options for Dose Unit, Source, Manufacturer, Route and Site
 * @param {Object} codeSetReply Object containing code information from the code set
 * @param {int} isRequiredField If this flag is set to 1 then the field will be treated as a mandatory field
 * @param {Object} immunizationContainer A HTML element to which the generated HTML will be appended
 * @param {String} uniquePrefix A string that will appended to the ID's of the fields
 * @param {String} customLabel The label name that will sit above the actionable field e.g "Source", "Product" 
 * @param {int} defaultValue A defaut value for the option. If this is set then the option will be defaulted to this value instead of a blank
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.renderCodeValuesOptions = function(codeSetReply, isRequiredField, immunizationContainer, uniquePrefix, customLabel, defaultValue){
	try{
		var self = this;
		var srcUniqueID = uniquePrefix + "Selector" + this.compID;
		
		// Default the selector to a blank option
		var srcSelectHTML = "<option value='0'></option>";
		
		// Create options HTML
		for (var codeSetItem in codeSetReply) {
			if (codeSetReply.hasOwnProperty(codeSetItem)) {
				srcSelectHTML += "<option value='" + codeSetReply[codeSetItem].CODE + "'>" + codeSetReply[codeSetItem].DISPLAY + "</option>";
			}
		}
		
		// Render the codes into the selector
		if (isRequiredField) {
			immunizationContainer.append("<span class='immun-o2-shell-label'><span class='required-field-label'>*</span><span class='secondary-text'>" + customLabel + "</span></span><select class='immun-o2-sp-select required-field-input' id='" + srcUniqueID + "'>" + srcSelectHTML + "</select>");
		}
		else {
			immunizationContainer.append("<span class='secondary-text immun-o2-shell-label'>" + customLabel + "</span><select class='immun-o2-sp-select' id='" + srcUniqueID + "'>" + srcSelectHTML + "</select>");
		}
		
		// Event handler for the selector 
		$("#" + srcUniqueID).change(function() {
			$("#" + srcUniqueID).blur();
			
			// Add the required-field class if no item is selected indicating it is a mandatory field  
			if (isRequiredField) {
				if (parseInt($("#" + srcUniqueID).val(),10)) {
					$("#" + srcUniqueID).removeClass("required-field-input");
					//Fire event to signal satisfied
					CERN_EventListener.fireEvent(null, self, "docHxModalDoseSatisfy" + self.compID, uniquePrefix);
				}
				else {
					$("#" + srcUniqueID).addClass("required-field-input");
					//Fire event to signal un-satisfied
					CERN_EventListener.fireEvent(null, self, "docHxModalDoseUnSatisfy" + self.compID, uniquePrefix);
				}
			}
		});
		
		// Set a default value if one is set
		var intDefaultValue = parseInt(defaultValue, 10);
		if (intDefaultValue) {
			document.getElementById(srcUniqueID).value = intDefaultValue;
			// Trigger the change so that appropriate classes can be applied
			$("#" + srcUniqueID).triggerHandler('change');
		}
		
		// Fire event to indicate that HTML has been rendered
		CERN_EventListener.fireEvent(null, this, "shellFieldsRendered" + this.compID, null);
		
	}
	catch(err) {
		logger.logJSError(err, this, "immun-add-modify-shell.js", "renderCodeValuesOptions");
	}
};

/**
 * This function will render a date control for substance expiration date. This date control is always a fuzzy date
 * @param {Object} immunizationDetailsObj Current immunizations details object which contains the currently saved values
 * or a blank object.
 * @param {Object} subExpDateContainer A HTML element to which the generated HTML will be appended
 * @param {String} uniqueID A string that will appended to the ID's of the fields
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.renderSubstanceExpDate = function(immunizationDetailsObj, subExpDateContainer, uniqueID){
	try{
		var self = this;
		
		// Create labels for VIS Published Date
		var subExpDateHTML = "<span class='secondary-text immun-o2-shell-label'>"+this.m_immuni18n.EXP_DATE+"</span><span class='immun-o2-sp-value-fields' id='expDateContainer"+uniqueID+"'></span>";

		// Append the title to the container
		subExpDateContainer.append(subExpDateHTML);
		
		var expDateContainer = $("#expDateContainer"+uniqueID);
		
		// Show VIS Given date control
		var expirationDateControl = new DateSelector(); 
		expirationDateControl.retrieveRequiredResources(function(){
			expirationDateControl.setUniqueId("subExpDateControl"+uniqueID);
			expirationDateControl.setCriterion(self.m_criterion);
			expirationDateControl.setFuzzyFlag(true);
			expirationDateControl.setDateSupportOption(2); // Meaning it supports both past and future dates
			
			// Render the date control and append HTML to date container
			var expirationDateControlHTML = expirationDateControl.renderDateControl(); 
			expDateContainer.append(expirationDateControlHTML);
			
			// Finalized actions after all elements are shown in the side panel
			expirationDateControl.finalizeActions();
			
			// Default the date if one is set 
			if(immunizationDetailsObj.SUB_EXPIRATION_DATE){
			 	// The expiration date appears to be in the format "2015-07-14" so it needs to be converted into a valid date object
				expirationDateControl.setSelectedDate(self.convertAbsoluteDate(immunizationDetailsObj.SUB_EXPIRATION_DATE));
				
				// Set the date format
				expirationDateControl.setSelectedDateFlag(immunizationDetailsObj.SUB_EXP_DATE_FORMAT_CD || 0);
				
				// Set the date on the date picker
				var selectedDateStr = "";
				selectedDateStr = self.convertAbsoluteDate(immunizationDetailsObj.SUB_EXPIRATION_DATE);
				expirationDateControl.datePickerControl.datepicker("setDate", selectedDateStr);
				expirationDateControl.dateDisplayInput.removeClass("secondary-text");
				
				// Set the precision code
				expirationDateControl.setSelectedDatePrecisionCode(immunizationDetailsObj.SUB_EXP_DATE_PRECISION_CD || 0);
			}
			// Set the date format, this is needed here again for the selector to function properly
			expirationDateControl.setSelectedDateFlag(immunizationDetailsObj.SUB_EXP_DATE_FORMAT_CD || 0);
			
			// Wrap the date control below the VIS Given Date label
			expDateContainer.find('.dc-date-selector').addClass("immun-o2-sp-value-fields");
		});
		
		// Push the admin date control objects in a collection so that they can be referred later while saving.
		this.m_substanceExpDateSelectorCollection.push(expirationDateControl);
		
		// For substance expiration where the date can be a future date disable the Age option
		if(expirationDateControl.dateFormatSelector){
			var dateFormatSelId = expirationDateControl.dateFormatSelector.attr('id'); 
			var k = "#"+dateFormatSelId+ "  option:first";
			$(k).addClass('hidden');
		}
		
		// Fire event to indicate that HTML has been rendered
		CERN_EventListener.fireEvent(null, this, "shellFieldsRendered"+this.compID, null); 
	}
	catch(err){
		logger.logJSError(err, this, "immun-add-modify-shell.js", "renderSubstanceExpDate");
	}
};

/**
 * This function will show a textbox for dose. Only numbers with . and , are allowed in the field.
* @param {Object} immunizationDetailsObj Current immunizations details object which contains the currently saved values
* or a blank object. The object should include an event code
* @param {HTML element} doseContainer A HTML element to which the generated HTML will be appended
* @param {String} uniqueID A string that will appended to the ID's of the fields
 */
ImmunizationsO2Component.prototype.renderDoseInput = function(immunizationDetailsObj, doseContainer, uniqueID){
	try{
		var defaultDoseValue = "";
		if(immunizationDetailsObj.DOSE_VALUE){
			// Format the dose number depending on the locale
			var numberFormatter = MP_Util.GetNumericFormatter();
			if (mp_formatter._isNumber(immunizationDetailsObj.DOSE_VALUE)) {
				defaultDoseValue = numberFormatter.format(immunizationDetailsObj.DOSE_VALUE, "^." + MP_Util.CalculatePrecision(immunizationDetailsObj.DOSE_VALUE));
			}
		}
		
		// Show the title 
		var doseHTML = "<span class='secondary-text immun-o2-sp-value-fields immun-o2-shell-label'>"+this.m_immuni18n.DOSE_QUANTITY+"</span><input class='immun-o2-input-fields' id='doseInput"+uniqueID+"' value='"+defaultDoseValue+"' />";
		doseContainer.append(doseHTML);
		
		// Allow only numbers in the dose field
		$("#doseInput"+uniqueID).keyup(function(event){
			// If any non-numeric is added then delete the text
			var doseValue = event.target.value;
			var floatValue = 0;
			
			// Filter out any special chars other than a dot and comma. Only numbers like 12.3 and 12,3 are permitted
			if(doseValue.length){
				// If a decimal number is added then simply split the string by '.' and take the first 2 items
				if(doseValue.indexOf('.') > -1 ){
					doseValue = doseValue.replace(/[^0-9.]/g, "");
					floatValue = doseValue.split(".");
					$(this).val(floatValue[0]+'.'+floatValue[1]);
				}
				// If a decimal number in locale like French is added then simply split the string by ',' and take the first 2 items
				else if(doseValue.indexOf(',') > -1 ){
					doseValue = doseValue.replace(/[^0-9,]/g, "");
					floatValue = doseValue.split(",");
					$(this).val(floatValue[0]+','+floatValue[1]);
				}
				else{
					// Only allow numbers 0-9 a decimal and a comma 
					doseValue = doseValue.replace(/[^0-9.,]/g, "");
					$(this).val(doseValue);
				}
			}
		});
		
		// Fire event to indicate that HTML has been rendered
		CERN_EventListener.fireEvent(null, this, "shellFieldsRendered"+this.compID, null); 
	}
	catch(err){
		logger.logJSError(err, this, "immun-add-modify-shell.js", "renderDoseInput");
	}
};

/**
 * This function will show a textbox for lot number 
* @param {Object} immunizationDetailsObj Current immunizations details object which contains the currently saved values
* or a blank object. The object should include an event code
* @param {HTML element} lotContainer A HTML element to which the generated HTML will be appended
* @param {String} uniquePrefix A string that will appended to the ID's of the fields
 */
ImmunizationsO2Component.prototype.renderLotInput = function(immunizationDetailsObj, lotContainer, uniqueID){
	// Encode the LOT string
	var decodedLotStr = "''";
	if(immunizationDetailsObj.LOT && immunizationDetailsObj.LOT.length){
		var entityStrInstance = new MPageEntity.EncodedString();
		decodedLotStr = entityStrInstance.toJs(immunizationDetailsObj.LOT);
	}
	
	try{
		// Show the title 
		var lotHTML = "<span class='secondary-text immun-o2-sp-value-fields immun-o2-shell-label'>"+this.m_immuni18n.LOT_NUMBER+"</span><input class='immun-o2-input-fields' id='lotInput"+uniqueID+"' value="+decodedLotStr+" />";
		lotContainer.append(lotHTML);
	}
	catch(err){
		logger.logJSError(err, this, "immun-add-modify-shell.js", "renderLotInput");
	}
	
	// Fire event to indicate that HTML has been rendered
	CERN_EventListener.fireEvent(null, this, "shellFieldsRendered"+this.compID, null); 
};

/**
 * renderProductHTML will render the Product selector
 * @param {Object} immunizationDetailsObj Current immunizations details object which contains the currently saved values
 * or a blank object. The object should include an event code
 * @param {string} uniqueID A string that will add more uniqueness to the element IDs created
 * @param {Object} productContainer A HTML block element where product list will be appended 
 * @returns none
 */
ImmunizationsO2Component.prototype.renderProductHTML = function(immunizationDetailsObj, uniqueID, productContainer){
	try{
		var productSelectHTML = "";
		var productSelectorHTML = "";
		var products = this.productRecordData ? this.productRecordData.QUAL : null;
		var vaccines = this.VISRecordData ? this.VISRecordData.VACCINES : null;
		var VISSheetsAvailable = false;
		var self = this;
		
		// Create Product selector
		if(products){
			// Add a blank option at the beginning of list
			productSelectHTML = "<option></option>";
			var lenProducts = products.length;
			for(var p = 0; p < lenProducts; p++){
				if(this.productRecordData.EVENT_CD === immunizationDetailsObj.VACCINE_EVENT_CODE){
					// Traverse through all the products to retrieve product names for the event code requested
					productSelectHTML += "<option value='"+products[p].SYNONYM_ID+"'>"+products[p].MNEMONIC+"</option>";
				}
			}
		}
		//If no Products are returned then display the vaccine name as the Product
		else{
			productSelectHTML = "<option>"+immunizationDetailsObj.VACCINE_DISPLAY+"</option>";
		}
		
		// Identify if any VIS are available
		var index = 0;
		if(vaccines){
			var lenVaccines = vaccines.length;
			for(var v = 0; v < lenVaccines; v++){
				// Traverse through all the Information statements
				var lenInfoStatements = vaccines[v].INFORMATION_STATEMENTS.length;
				for(var i = 0; i < lenInfoStatements; i++){
					// Traverse through all the statements
					var lenStatements = vaccines[v].INFORMATION_STATEMENTS[i].STATEMENTS.length;
					for(var s = 0; s < lenStatements; s++){
						var statementInfo = vaccines[v].INFORMATION_STATEMENTS[i].STATEMENTS[s];
						//Identify if atleast 1 active information sheet is present
						if(statementInfo.ACTIVE_IND === 1){
							VISSheetsAvailable = true;
						}
					}
				}
			}
		}
		
		// Default value if one is set and show it as a label since a product cannot be modified
		if(immunizationDetailsObj.PRODUCT_ID || immunizationDetailsObj.EVENT_ID){
			var productDisplay = immunizationDetailsObj.PRODUCT_DISPLAY || immunizationDetailsObj.VACCINE_DISPLAY;
			productSelectorHTML = "<div class='secondary-text immun-o2-shell-label'>"+i18n.PRODUCT+"</div><span id='product"+uniqueID+"'>"+productDisplay+"</span>";
		}
		else{
			// Create product options string
			productSelectorHTML = "<span class='secondary-text immun-o2-shell-label'>"+i18n.PRODUCT+"</span><select class='immun-o2-sp-select' id='productSelector"+uniqueID+"'>"+productSelectHTML+"</select>";
		}
		
		// Append HTML to the container
		productContainer.append(productSelectorHTML);
		 
		// Event handler for Product selector. When a non-blank product is selected then the VIS selector should default to the first option
		$("#productSelector"+uniqueID).change(function(){
			var productSelector = $("#productSelector"+uniqueID);
			var VISSelector = $("#VISSelector"+uniqueID);
			var VISSelectorElementID = "VISSelector"+uniqueID;
			
			// If a valid Product is selected then enable the selector
			if(productSelector.val().length && VISSheetsAvailable){
				// Enable selector
				VISSelector.prop("disabled", false);
			}
			else{
				// Disable selector
				VISSelector.prop("disabled", true);
				document.getElementById(VISSelectorElementID).selectedIndex = 0;
			}
			// Trigger the VIS selector change
			VISSelector.triggerHandler("change");
		});
	}
	catch(err){
		logger.logJSError(err, this, "immun-add-modify-shell.js", "renderProductHTML");
	}
	
	// Fire event to indicate that HTML has been rendered
	CERN_EventListener.fireEvent(null, this, "shellFieldsRendered"+this.compID, null); 
};

/**
 * This function will render the Product selector, VIS selector, VIS Published date and VIS Given date control
 * These dates are not fuzzy date and a future date can be selected
 * @param {Object} VISSelectorContainer A HTML block element where VIS selector will be appended
 * @param {Object} VISPubDateContainer A HTML block element where VIS Published date control will be appended
 * @param {Object} VISGivenDateContainer A HTML block element where VIS Given date control will be appended
 * @param {string} uniqueID A string that will add more uniqueness to the element IDs created
 * @param {Object} immunizationDetailsObj Current immunizations details object which contains the currently saved values
 * or a blank object.
 * @param {number} currentVISindex denotes the current VIS index for displaying the multiple saved VIS
 */

ImmunizationsO2Component.prototype.renderVISControlsHTML = function (VISSelectorContainer, VISPubDateContainer, VISGivenDateContainer, uniqueID, immunizationDetailsObj, currentVISindex) {
	try {
		var infoSheetHTML = "<option value='0'></option>";

		// If the VIS value is saved/added already then we hide the blank option, Added due to a service limitation due to which a VIS saved cannot be undone
		if (immunizationDetailsObj.VIS_BUNDLE && immunizationDetailsObj.VIS_BUNDLE[currentVISindex] && immunizationDetailsObj.VIS_BUNDLE[currentVISindex].VIS_CD) {
			infoSheetHTML = "";
		}

		var products = this.productRecordData ? this.productRecordData.QUAL : null;
		var vaccines = this.VISRecordData ? this.VISRecordData.VACCINES : null;
		var statementInfo = null;
		var VISPubDateDetails = {}; // VIS: Vaccine Information Sheet
		var self = this;
		var VISSheetsAvailable = false;
		var VISBundleUniqueId = uniqueID + "Modify" + currentVISindex;

		// Create the information sheet selector, traverse through all the vaccines
		if (vaccines) {
			var lenVaccines = vaccines.length;
			for (var v = 0; v < lenVaccines; v++) {
				// Traverse through all the Information statements
				var lenInfoStatements = vaccines[v].INFORMATION_STATEMENTS.length;
				for (var i = 0; i < lenInfoStatements; i++) {
					// Traverse through all the statements
					var lenStatements = vaccines[v].INFORMATION_STATEMENTS[i].STATEMENTS.length;
					for (var s = 0; s < lenStatements; s++) {
						statementInfo = vaccines[v].INFORMATION_STATEMENTS[i].STATEMENTS[s];
						// Display only active information sheets
						if (statementInfo.ACTIVE_IND === 1) {
							infoSheetHTML += "<option value=" + statementInfo.VIS_CD + ">" + statementInfo.DISPLAY + "</option>";
							// Cache the synonym ID of information sheet and its published date
							VISPubDateDetails[statementInfo.VIS_CD] = statementInfo.PUBLISHED_DT_TM;
							VISSheetsAvailable = true;
						}
					}
				}
			}
		}

		// Create HTML string for VIS sheet
		var vaccineInfoSheetHTML = "<span class='secondary-text immun-o2-shell-label'>" + this.m_immuni18n.VACCINE_INFORMATION_SHEET + "</span>" +
			"<select id='VISSelector" + VISBundleUniqueId + "' class='immun-o2-sp-select' disabled='disabled'>" + infoSheetHTML + "</select>";

		// Add VIS selector HTML to container
		VISSelectorContainer.append(vaccineInfoSheetHTML);

		// If a product is already defaulted for modify mode then enable the VIS selector
		if (VISSheetsAvailable) {
			$("#VISSelector" + VISBundleUniqueId).prop("disabled", false);
		}

		// Default value if one is set
		if (immunizationDetailsObj.VIS_BUNDLE[currentVISindex] && immunizationDetailsObj.VIS_BUNDLE[currentVISindex].VIS_CD) {
			document.getElementById("VISSelector" + VISBundleUniqueId).value = immunizationDetailsObj.VIS_BUNDLE[currentVISindex].VIS_CD;
		}

		// Create labels for VIS Published Date
		var visPublishedDateHTML = "<span class='secondary-text'>" + this.m_immuni18n.VIS_PUBLISHED_DATE + "</span><span class='immun-o2-sp-value-fields' id='VISPubDate" + VISBundleUniqueId + "'></span>";

		// Add VIS Published date HTML
		VISPubDateContainer.append(visPublishedDateHTML);

		// Show VIS Published date control
		var VISPublishedDateControl = new DateSelector();
		VISPublishedDateControl.retrieveRequiredResources(function () {
			VISPublishedDateControl.setUniqueId("VISPublishedDateControl" + VISBundleUniqueId);
			VISPublishedDateControl.setCriterion(self.m_criterion);
			// The published date control need not be fuzzy but setting fuzzyFlag to false causes some issues from artifact.
			// so fuzzy flag is set to true and the date format and precision selector are hidden
			VISPublishedDateControl.setFuzzyFlag(true);
			VISPublishedDateControl.setDateSupportOption(3); // Meaning it supports past date even before the patient's DOB

			// Render the date control and append HTML to date container
			var VISPublishedDateControlHTML = VISPublishedDateControl.renderDateControl();
			VISPubDateContainer.append(VISPublishedDateControlHTML);

			// Finalized actions after all elements are shown in the side panel
			VISPublishedDateControl.finalizeActions();

			// Default the date if one is set
			if (immunizationDetailsObj.VIS_BUNDLE[currentVISindex] && immunizationDetailsObj.VIS_BUNDLE[currentVISindex].PUBLISHED_DT_TM) {
				VISPublishedDateControl.setSelectedDate(self.convertAbsoluteDate(immunizationDetailsObj.VIS_BUNDLE[currentVISindex].PUBLISHED_DT_TM));

				// Set the date format to "Date"
				VISPublishedDateControl.setSelectedDateFlag(0);

				var selectedDateStr = self.convertAbsoluteDate(immunizationDetailsObj.VIS_BUNDLE[currentVISindex].PUBLISHED_DT_TM);
				VISPublishedDateControl.datePickerControl.datepicker("setDate", selectedDateStr);
				VISPublishedDateControl.dateDisplayInput.removeClass("secondary-text");
			}

			// Set the date format to "Date"
			VISPublishedDateControl.setSelectedDateFlag(0);

			// Wrap the date control below the VIS Published Date label
			//VISPubDateContainer.find('.dc-date-selector').addClass("immun-o2-sp-value-fields");
		});

		// If a product is already defaulted for modify mode then enable the VIS selector
		if (VISSheetsAvailable) {
			//Enable the Add Other VIS link if the VIS is more than 1
			if (Object.keys(VISPubDateDetails).length > 1) {
				$("#addOtherVISLink" + uniqueID).show();
			}
			else {
				$("#addOtherVISLink" + uniqueID).hide();
			}

			//Enable the VIS selector
			$("#VISSelector" + VISBundleUniqueId).prop("disabled", false);
		}

		if (currentVISindex === 0) {
			// Add VIS Published date HTML
			VISGivenDateContainer.append("<span class='secondary-text immun-o2-shell-label'>" + this.m_immuni18n.VIS_GIVEN_DATE + "</span>");

			// Show VIS Given date control
			this.VISGivenDateControl = new DateSelector();
			this.VISGivenDateControl.retrieveRequiredResources(function () {
				self.VISGivenDateControl.setUniqueId("VISGivenDateControl" + uniqueID);
				self.VISGivenDateControl.setCriterion(self.m_criterion);
				// The given date control need not be fuzzy but setting fuzzyFlag to false causes some issues from artifact.
				// so fuzzy flag is set to true and the date format and precision selector are hidden
				self.VISGivenDateControl.setFuzzyFlag(true);

				// Render the date control and append HTML to date container
				var VISGivenDateControlHTML = self.VISGivenDateControl.renderDateControl();
				VISGivenDateContainer.append(VISGivenDateControlHTML);

				// Finalized actions after all elements are shown in the side panel
				self.VISGivenDateControl.finalizeActions();

				// Default the date if one is set
				if (immunizationDetailsObj.VIS_BUNDLE[0] && immunizationDetailsObj.VIS_BUNDLE[0].GIVEN_ON_DT_TM) {
					// The VIS Given appears to be in the format "/Date(2013-01-26T22:34:00.000+00:00)/" so it needs to be converted into a valid date object
					var selectedDateStr = "";
					var dateTime = new Date();
					dateTime.setISO8601(immunizationDetailsObj.VIS_BUNDLE[0].GIVEN_ON_DT_TM);
					if (dateTime.getTime() > 0) {
						self.VISGivenDateControl.setSelectedDate(dateTime);
					}
					else {
						self.VISGivenDateControl.setSelectedDate(null);
					}

					// Set the date format to "Date"
					self.VISGivenDateControl.setSelectedDateFlag(0);

					if (dateTime.getTime() > 0) {
						var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
						selectedDateStr = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
						self.VISGivenDateControl.datePickerControl.datepicker("setDate", selectedDateStr);
					}
					self.VISGivenDateControl.dateDisplayInput.removeClass("secondary-text");
				}

				// Set the date format to "Date"
				self.VISGivenDateControl.setSelectedDateFlag(0);

				// Wrap the date control below the VIS Given Date label
				VISGivenDateContainer.find('.dc-date-selector').addClass("immun-o2-sp-value-fields");
			});
			// Push the VIS Given date control object
			this.m_VISDateSelectorCollection.push(this.VISGivenDateControl);
		}

		// Push the VIS Published date control object
		this.m_VISDateSelectorCollection.push(VISPublishedDateControl);

		// Event handler for vaccine information sheet selector. Changing this will update the VIS Published date
		$("#VISSelector" + VISBundleUniqueId).change(function () {
			// Get the corresponding published date
			var VISSelector = $(this);
			var VISGivenDateContainer = $("#VISGivenDateContainer" + uniqueID);
			var selectedVISPubDate = VISPubDateDetails[parseInt(VISSelector.val(), 10)];
			var formattedVISPubDate = null;

			// Determine the published and given date control object from the collection matching the unique ID
			for (var i = 0; i < self.m_VISDateSelectorCollection.length; i++) {
				if (self.m_VISDateSelectorCollection[i].m_uniqueId === "VISGivenDateControl" + uniqueID) {
					self.VISGivenDateControl = self.m_VISDateSelectorCollection[i];
					break;
				}
				if (self.m_VISDateSelectorCollection[i].m_uniqueId === "VISPublishedDateControl" + VISBundleUniqueId) {
					VISPublishedDateControl = self.m_VISDateSelectorCollection[i];
					break;
				}
			}

			if (selectedVISPubDate) {
				// Show the date in full format as per the locale
				formattedVISPubDate = new Date();
				formattedVISPubDate.setISO8601(selectedVISPubDate);
				VISPublishedDateControl.setSelectedDate(formattedVISPubDate);

				// Enable date input field
				VISPubDateContainer.find('.dc-date-input').prop("disabled", false);

				// Enable the date picker for Published date
				VISPubDateContainer.find('.dc-date-picker').datepicker("enable");
			}
			else {
				// Clear the published date input field and disable the input
				VISPubDateContainer.find('.dc-date-input').val("");
				VISPubDateContainer.find('.dc-date-input').prop("disabled", true);

				// Set no published date
				VISPublishedDateControl.setSelectedDate(null);

				// Disable the date picker for both VIS Given and Published date
				VISPubDateContainer.find('.dc-date-picker').datepicker("disable");
			}
			VISPublishedDateControl.setSelectedDateFlag(0);
		});

		// Trigger the VIS change event so that the published date can be shown for the selected VIS. Trigger only if PUBLISHED_DT_TM and GIVEN_ON_DT_TM is not present already
		if (immunizationDetailsObj.VIS_BUNDLE[0] && immunizationDetailsObj.VIS_BUNDLE[currentVISindex]) {
			if (!immunizationDetailsObj.VIS_BUNDLE[0].GIVEN_ON_DT_TM && !immunizationDetailsObj.VIS_BUNDLE[currentVISindex].PUBLISHED_DT_TM) {
				$("#VISSelector" + VISBundleUniqueId).triggerHandler("change");
			}
		}

		// Fire event to indicate that HTML has been rendered
		CERN_EventListener.fireEvent(null, this, "shellFieldsRendered" + this.compID, null);
	}
	catch (err) {
		logger.logJSError(err, this, "immun-add-modify-shell.js", "renderVISControlsHTML");
	}
};

/**
 * This function will read the immunization details from an object and format it in a way so that
 * the createShellForEditMode function can operate on the fields
 * @param {Object} vaccineData An object containing immunization details
 * @returns {Object} immunizationDetailsObj An object formatted with valid fields so that the
 * createShellForEditMode inner functions can use access the fields
 */
ImmunizationsO2Component.prototype.formatImmunDetailsForShell = function (vaccineData) {
	var immunizationDetailsObj = new this.createNewImmunDetailsObj();

	try {
		// Traverse through the VACCINATIONS section of the record data to retrieve parameters
		if (!vaccineData) {
			throw new Error("vaccination details are not provided");
		}

		// Common details for an administered dose and an exception
		immunizationDetailsObj.EVENT_ID = vaccineData.EVENT_ID || 0;
		immunizationDetailsObj.PARENT_EVENT_ID = vaccineData.PARENT_ENTITY_ID || 0;
		immunizationDetailsObj.COMMENTS = vaccineData.COMMENTS || {};

		// Details will be different for an administered dose and an exception
		if (vaccineData.ADMIN_DT_TM) {
			var VISLen = vaccineData.INFORMATION_STATEMENTS_GIVEN.length;
			var i = 0;

			//Store the VIS length for retrieving the fields during save
			this.VISModifyBundleLen = VISLen;

			// Vaccine code and display
			immunizationDetailsObj.VACCINE_EVENT_CODE = vaccineData.IDENTIFIER.EVENT_CODE.CODE_VALUE || 0;
			immunizationDetailsObj.VACCINE_DISPLAY = vaccineData.IDENTIFIER.EVENT_CODE.DISPLAY || "";

			// Vaccine Admin date and precision
			immunizationDetailsObj.ADMIN_DATE = vaccineData.ADMIN_DT_TM || "";
			immunizationDetailsObj.ADMIN_DATE_FORMAT = vaccineData.ADMIN_DT_PRECISION_FLAG || 0;
			immunizationDetailsObj.ADMIN_DATE_PRECISION_CD = 0;

			// Vaccine product
			immunizationDetailsObj.PRODUCT_ID = vaccineData.PRODUCT.SYNONYM_ID || 0;
			immunizationDetailsObj.PRODUCT_DISPLAY = vaccineData.PRODUCT.PRODUCT_NAME || "";

			// Vaccine Route, Site, Manufacturer, Source
			immunizationDetailsObj.ROUTE_CD = vaccineData.ADMIN_ROUTE_CODE.CODE_VALUE || 0;
			immunizationDetailsObj.SITE_CD = vaccineData.ADMIN_SITE_CODE.CODE_VALUE || 0;
			immunizationDetailsObj.MANUF_CD = vaccineData.MANUFACTURER_CODE.CODE_VALUE || 0;
			immunizationDetailsObj.SOURCE_CD = vaccineData.SOURCE_CODE.CODE_VALUE || 0;

			// Vaccine Dose and Lot
			immunizationDetailsObj.DOSE_VALUE = vaccineData.ADMIN_DOSAGE || "";
			immunizationDetailsObj.DOSE_UNIT_CD = vaccineData.ADMIN_DOSAGE_UNIT_CODE.CODE_VALUE || 0;
			immunizationDetailsObj.LOT = vaccineData.LOT_NUMBER || "";

			// Vaccine substance expiration date
			immunizationDetailsObj.SUB_EXPIRATION_DATE = vaccineData.EXPIRATION_DATE || "";
			immunizationDetailsObj.SUB_EXP_DATE_PRECISION_CD = 0;

			// We decided to not to have a substance expiration date as a fuzzy date so commenting it for now
			//immunizationDetailsObj.SUB_EXP_DATE_FORMAT_CD = 0;

			// VIS details
			if (VISLen) {
				for (i = 0; i < VISLen; i++) {
					var VISItemObj = new this.VISBundleItemObj();
					VISItemObj.VIS_CD = vaccineData.INFORMATION_STATEMENTS_GIVEN[i].VIS_CODE.CODE_VALUE || 0;
					VISItemObj.PUBLISHED_DT_TM = vaccineData.INFORMATION_STATEMENTS_GIVEN[i].PUBLISHED_DATE || 0.0;
					VISItemObj.GIVEN_ON_DT_TM = vaccineData.INFORMATION_STATEMENTS_GIVEN[i].GIVEN_ON_DT_TM || 0.0;

					immunizationDetailsObj.VIS_BUNDLE.push(VISItemObj);
				}
			}
		}
		else if (vaccineData.EXCEPTION_DT_TM) {
			// Gather required details for exceptions
			immunizationDetailsObj.VACCINE_EVENT_CODE = vaccineData.IDENTIFIER.EVENT_CODE.CODE_VALUE || 0;
			immunizationDetailsObj.ADMIN_DATE = vaccineData.EXCEPTION_DT_TM || "";
		}
	}
	catch (err) {
		logger.logJSError(err, this, "immun-add-modify-shell.js", "formatImmunDetailsForShell");
	}
	return immunizationDetailsObj;
};


/** This function will initialize new immunization details object with default values and return return with default values.
 * @params nothing
 * @returns {Object} A new immunization details object with default values
 */
ImmunizationsO2Component.prototype.createNewImmunDetailsObj = function () {
	return {
		ADMIN_DATE: "",
		ADMIN_DATE_FORMAT: 0,
		ADMIN_DATE_PRECISION_CD: 0,
		ADMIN_NOTE_ID: 0,
		ADMIN_NOTE: "",
		ADMIN_PRSNL_ID: 0,
		COMMENTS: {},
		DOSE_VALUE: "",
		DOSE_UNIT_CD: 0,
		EVENT_ID: 0,
		EVENT_TYPE_FLAG: 0,
		EXCEPTION_REASON_CD: 0,
		LOT: "",
		MANUF_CD: 0,
		PARENT_ENTITY_ID: 0,
		PRODUCT_ID: 0,
		PRODUCT_DISPLAY: "",
		ROUTE_CD: 0,
		SOURCE_CD: 0,
		SITE_CD: 0,
		SUB_EXPIRATION_DATE: "",
		SUB_EXP_DATE_PRECISION_CD: 0,
		SUB_EXP_DATE_FORMAT_CD: 0,
		UNCHART_REASON: "",
		VACCINE_EVENT_CODE: 0,
		VACCINE_DISPLAY: "",
		VIS_BUNDLE: [] //Consists of VIS_CD, PUBLISHED_DT_TM and GIVEN_ON_DT_TM
	};
};

/**
 * Returns an Object to store the VIS information used during Saving
 * @returns {{VIS_CD: number, PUBLISHED_DT_TM: number, GIVEN_ON_DT_TM: number}}
 * @constructor
 */
ImmunizationsO2Component.prototype.VISBundleItemObj = function () {
	return {
		VIS_CD: 0,
		PUBLISHED_DT_TM: 0.0,
		GIVEN_ON_DT_TM: 0.0
	};
};

/** This function will read the values from the DOM elements. This function can be called to read values of fields while saving data for an Add/Modify workflow.
 * @params {string/int} uniquePrefix This is the unique prefix sent as an argument when the consumer called createShellForEditMode function for add/modify mode
 * @returns {Object} immunizationDetailsObj An object which will hold the values of all the actionable fields generated by the shell
 */
ImmunizationsO2Component.prototype.readValuesFromImmunShellFields = function (uniquePrefix) {
	// Initialize a new immunizations details object
	var immunizationDetailsObj = new this.createNewImmunDetailsObj();
	var self = this;
	try {
		var i = 0;
		var j = 0;

		/**
		 * Takes the input of where the VIS is and takes the values from the Selector, Published date selector
		 * and Given Date selector to prepare for saving
		 * @param {Object} immunizationDetailsObj Consists of the newly created Object which houses all the information that will be used for saving a dose
		 * @param {String} givenDatePrefix Date selector prefix used to identify the values in the date selector
		 * @param {String} uniquePrefix Date selector prefix used to identify the values in the date selector (also tells you where the value is from Add or Modify workflow)
		 * @returns {undefined} Returns nothing
		 */
		var processVISBundleValues = function (immunizationDetailsObj, givenDatePrefix, uniquePrefix) {
			var VISItemObj = new self.VISBundleItemObj();
			var VISPubDateControl = null;
			var VISGivenDateControl = null;

			if (immunizationDetailsObj && givenDatePrefix && uniquePrefix) {
				// Read VIS name, VIS published date and given date
				if ($("#VISSelector" + uniquePrefix).length) {
					VISItemObj.VIS_CD = parseInt($("#VISSelector" + uniquePrefix).val(), 10);
				}
				if (VISItemObj.VIS_CD) {
					// Read the VIS published date
					if ($("#VISPubDateContainer" + uniquePrefix).length) {
						for (i = 0; i < self.m_VISDateSelectorCollection.length; i++) {
							if (self.m_VISDateSelectorCollection[i].m_uniqueId === "VISPublishedDateControl" + uniquePrefix) {
								VISPubDateControl = self.m_VISDateSelectorCollection[i];
								VISItemObj.PUBLISHED_DT_TM = VISPubDateControl.getSelectedDate() || "0";
								break;
							}
						}
					}

					// Read the VIS Given date
					if ($("#VISGivenDateContainer" + givenDatePrefix).length) {
						for (i = 0; i < self.m_VISDateSelectorCollection.length; i++) {
							if (self.m_VISDateSelectorCollection[i].m_uniqueId === "VISGivenDateControl" + givenDatePrefix) {
								VISGivenDateControl = self.m_VISDateSelectorCollection[i];
								VISItemObj.GIVEN_ON_DT_TM = VISGivenDateControl.getSelectedDate() || "0";
								break;
							}
						}
					}
				}
				else {
					//In the event that the user doesnt add the VIS at all
					VISItemObj.PUBLISHED_DT_TM = "0";
					VISItemObj.GIVEN_ON_DT_TM = "0";
				}
				if (VISItemObj) {
					immunizationDetailsObj.VIS_BUNDLE.push(VISItemObj);
				}
			}
		};

		//Get the count of number of other VIS added
		var otherVISCount = $("#addOtherVISLink" + uniquePrefix + this.compID).attr("data-click-count") ? parseInt($("#addOtherVISLink" + uniquePrefix + this.compID).attr("data-click-count"), 10) : 0;

		// Exit if no uniquePrefix is provided
		if (!uniquePrefix) {
			throw new Error("No unique prefix has been provided");
		}
		// Query all the codified fields rendered by the renderCodeValuesOptions function
		if ($("#" + uniquePrefix + "SourceSelector" + this.compID).length) {
			immunizationDetailsObj.SOURCE_CD = parseInt($("#" + uniquePrefix + "SourceSelector" + this.compID).val(), 10);
		}

		if ($("#" + uniquePrefix + "ManufacturerSelector" + this.compID).length) {
			immunizationDetailsObj.MANUF_CD = parseInt($("#" + uniquePrefix + "ManufacturerSelector" + this.compID).val(), 10);
		}

		if ($("#" + uniquePrefix + "DoseUnitSelector" + this.compID).length) {
			immunizationDetailsObj.DOSE_UNIT_CD = parseInt($("#" + uniquePrefix + "DoseUnitSelector" + this.compID).val(), 10);
		}

		if ($("#" + uniquePrefix + "RouteSelector" + this.compID).length) {
			immunizationDetailsObj.ROUTE_CD = parseInt($("#" + uniquePrefix + "RouteSelector" + this.compID).val(), 10);
		}

		if ($("#" + uniquePrefix + "SiteSelector" + this.compID).length) {
			immunizationDetailsObj.SITE_CD = parseInt($("#" + uniquePrefix + "SiteSelector" + this.compID).val(), 10);
		}

		// Read the Lot and Dose input fields
		if ($("#lotInput" + uniquePrefix + this.compID).length) {
			immunizationDetailsObj.LOT = $("#lotInput" + uniquePrefix + this.compID).val();
		}

		if ($("#doseInput" + uniquePrefix + this.compID).length) {
			immunizationDetailsObj.DOSE_VALUE = $("#doseInput" + uniquePrefix + this.compID).val();
		}

		//Get the product synonym id
		if ($("#productContainer" + uniquePrefix + this.compID).length) {
			immunizationDetailsObj.PRODUCT_ID = parseInt($("#productSelector" + uniquePrefix + this.compID).val(), 10);
		}

		//If the workflow is modify then we will have already added drop downs which are subject to change
		//Hence we need to check that and include them in the request
		if (uniquePrefix.indexOf("ModifyMode") !== -1) {
			for (j = 0; j <= this.VISModifyBundleLen; j++) {
				processVISBundleValues(immunizationDetailsObj, uniquePrefix + this.compID, uniquePrefix + this.compID + "Modify" + j);
			}
		}
		else {
			//Add mode Main VIS values - selector, pub date and given date
			processVISBundleValues(immunizationDetailsObj, uniquePrefix + this.compID, uniquePrefix + this.compID);
		}

		if (otherVISCount) {
			for (j = 0; j < otherVISCount; j++) {
				processVISBundleValues(immunizationDetailsObj, uniquePrefix + this.compID, uniquePrefix + this.compID + "VIS" + j);
			}
		}

		// Read the date and precision (this is referred as the format) selected from the Admin Date field
		// Check if the admin date container exists
		if ($("#adminDateContainer" + uniquePrefix + this.compID).length) {
			for (i = 0; i < this.m_adminDateSelectorCollection.length; i++) {
				if (this.m_adminDateSelectorCollection[i].m_uniqueId === "adminDateControl" + uniquePrefix + this.compID) {
					var adminDateControl = this.m_adminDateSelectorCollection[i];
					// If date estimation is allowed then call convert the date into an estimated date depending on the year and month preferences.
					if (this.allowDateEstimation) {
						var estAdminDate = this.calculateEstimatedAdminDate(adminDateControl.getSelectedDate(), adminDateControl.getSelectedDateFlag());
						immunizationDetailsObj.ADMIN_DATE = estAdminDate.DATE;
						immunizationDetailsObj.ADMIN_DATE_PRECISION_CD = estAdminDate.OFFSET; // Use this precision while saving and not the ADMIN_DATE_FORMAT field
						immunizationDetailsObj.ADMIN_DATE_FORMAT = adminDateControl.getSelectedDateFlag();
					}
					else {
						immunizationDetailsObj.ADMIN_DATE = adminDateControl.getSelectedDate();
						immunizationDetailsObj.ADMIN_DATE_FORMAT = adminDateControl.getSelectedDateFlag();
					}
					break;
				}
			}
		}

		// Read the substance expiration date
		if ($("#substanceExpDateContainer" + uniquePrefix + this.compID).length) {
			for (i = 0; i < this.m_substanceExpDateSelectorCollection.length; i++) {
				if (this.m_substanceExpDateSelectorCollection[i].m_uniqueId === "subExpDateControl" + uniquePrefix + this.compID) {
					var expDateControl = this.m_substanceExpDateSelectorCollection[i];
					immunizationDetailsObj.SUB_EXPIRATION_DATE = expDateControl.getSelectedDate();
					immunizationDetailsObj.SUB_EXP_DATE_FORMAT_CD = expDateControl.getSelectedDateFlag();
					break;
				}
			}
		}
		
		if($("#"+uniquePrefix+"exceptionReasonSelector"+this.compID).length){
			immunizationDetailsObj.EXCEPTION_REASON_CD = parseInt($("#"+uniquePrefix+"exceptionReasonSelector"+this.compID).val(), 10);
		}
		
		if($("#"+uniquePrefix+"descriptionArea"+this.compID).length){
			immunizationDetailsObj.ADMIN_NOTE = $("#"+uniquePrefix+"descriptionArea"+this.compID).val();
		}
	}
	catch (err) {
		logger.logJSError(err, this, "immun-add-modify-shell.js", "readValuesFromImmunShellFields");
	}
	return immunizationDetailsObj;
};

/**
* This function will call mp_add_update_immunizations script to save the immunization details
* @param {Object} immunizationBatchDetails An object with batch of vaccine details to be saved
* @param {string} mode A flag indicating if new details are being saved "add", uncharted "unchart" or existing details are modified "modify".
* The USR timer metadata will vary accordingly.
* @returns {undefined} Returns nothing
*/ 
ImmunizationsO2Component.prototype.saveImmunizationsToDataBase = function(immunizationBatchDetails, mode){
	// Set an unchart indicator. For "add" and "modify" mode the unchart indicator will be 0.
	var unchartInd = 0;

	if(mode === "unchart"){
		unchartInd = 1;
	}
	
	// Simply throw an error if no items are added to save
	if(!immunizationBatchDetails.length){
		throw new Error("No immunizations details to save");
	}
	
	var isChartExceptionModal = this.m_immunizationModalType === this.ImmunizationsModalEnum.CHART_EXCEPTION;
	
	// Create a new CAP and USR Timer 
	var immunizationsActionTimer = new CapabilityTimer("CAP:MPG.IMMUNIZATIONS.O2 Immunizations Actionability", this.m_criterion.category_mean); 
	var saveActionUSRTimer = isChartExceptionModal ?
							new RTMSTimer("USR:MPG.IMMUNIZATIONS.O2 Chart Immunization Exception", this.m_criterion.category_mean) :
							new RTMSTimer("USR:MPG.IMMUNIZATIONS.O2 - Saving Immunizations", this.m_criterion.category_mean);

	try{
		// Add a spinner to the table
		if(this.sidePanelElement){
			MP_Util.LoadSpinner(this.sidePanelElement.attr("id"));
			this.sidePanelElement.find('.loading-screen').addClass("immun-o2-spinner");
		}
		
		// Trigger the CAP timer
		if(immunizationsActionTimer && !isChartExceptionModal){
			if(mode === "modify"){
				immunizationsActionTimer.addMetaData("rtms.legacy.metadata.1","Saving Dose Modifications");
			}
			else if(mode === "add"){
				immunizationsActionTimer.addMetaData("rtms.legacy.metadata.1","Saving New Dose Details");
			}
			else if(mode === "unchart"){
				immunizationsActionTimer.addMetaData("rtms.legacy.metadata.1","Uncharting Dose Details");
			}
			immunizationsActionTimer.capture();
		}
		// Trigger the USR Timer to record the time it takes for the script to do the insert and return
		if(saveActionUSRTimer){
			if(mode === "modify"){
				isChartExceptionModal ? 
				saveActionUSRTimer.addMetaData("rtms.legacy.metadata.1", "Saving Exception Modifications") :
				saveActionUSRTimer.addMetaData("rtms.legacy.metadata.1", "Saving Dose Modifications");
			}
			else if(mode === "add"){
				isChartExceptionModal ? 
				saveActionUSRTimer.addMetaData("rtms.legacy.metadata.1", "Saving New Exception Details") :
				saveActionUSRTimer.addMetaData("rtms.legacy.metadata.1", "Saving New Dose Details"); 
			}
			else if(mode === "unchart"){
				saveActionUSRTimer.addMetaData("rtms.legacy.metadata.1","Uncharting Dose Details");
			}
			saveActionUSRTimer.start();
		}
		
		// Call the convertImmunObjectToJSON function to create a JSON of the requested immunizationDetails
		var saveRequestJSON = this.convertImmunObjectToJSON(immunizationBatchDetails, unchartInd);
		
		var self = this;
		var saveImmunDetailsRequest = new ScriptRequest();
		saveImmunDetailsRequest.setProgramName("mp_add_update_immunizations");
		saveImmunDetailsRequest.setDataBlob(saveRequestJSON);
		saveImmunDetailsRequest.setParameterArray(["^MINE^", this.m_criterion.person_id + ".0", this.m_criterion.encntr_id + ".0" , this.m_criterion.provider_id + ".0", "^^"]);
		saveImmunDetailsRequest.setResponseHandler(function(scriptReply){
			// Stop the USR timer
			if(saveActionUSRTimer) {
				saveActionUSRTimer.stop();
			}
			// Read script status and refresh  the procedure content table
			if(scriptReply.getResponse().STATUS_DATA.STATUS === "S"){
				// Broadcast a listener so that component can refresh itself
				CERN_EventListener.fireEvent(null, self, "Updated Immunizations Available", null);
			}
			else{
				if(self.m_sidePanel){
					self.m_sidePanel.setAlertBannerAsHTML(self.createAlertBannerHTML(self.m_immuni18n.ERROR_SAVING_IMMUNIZATION));
				}
				
				// Remove the spinner
				if(self.sidePanelElement){
					self.sidePanelElement.find('.loading-screen').remove();
				}
			}
		});
		saveImmunDetailsRequest.performRequest();
	}
	catch(err){
		if(saveActionUSRTimer){
			saveActionUSRTimer.fail();
			saveActionUSRTimer = null;
		}
		logger.logJSError(err, this, "immun-add-modify-shell.js", "saveImmunizationsToDataBase");
	}
};

/**
 * This function will convert the date object to a JSON compatible with the mp_add_update_immunizations service for saving date information
 * @params{Object} dateObject A valid date object
 * @returns{String} JSONDate JSON formatted date
 */
ImmunizationsO2Component.prototype.convertDateObjectToString = function(dateObject){
	var JSONDate = "";
	try{
		// Convert the date object into format that looks like this "\/Date(yyyy-mm-ddT0N:00:00.000+00:00)\/";where N is the GMT-N time zone
		if(Object.prototype.toString.call(dateObject) === "[object Date]" ){
			JSONDate = dateObject.toJSON().split('.')[0];
			JSONDate = '\\/Date('+JSONDate+'.000+00:00)\\/';
		}
	}
	catch(err){
		logger.logJSError(err, this, "immun-add-modify-shell.js", "convertDateObjectToString");
	}
	return JSONDate;
};

/**
 * This function will create a JSON string so that it can be sent to the mp_add_update_immunizations script for saving the details into the database.
 * Every item within the immunizationBatchDetails should match the definition of the format as defined in the createNewImmunDetailsObj function.
 * @params {Object} immunizationBatchDetails An list of objects with immunizations details that we will be converted into JSON
 * @returns {String} JSONImmunDetails A JSON with immunization details formatted in a way that is script compatible
 */
ImmunizationsO2Component.prototype.convertImmunObjectToJSON = function (immunizationBatchDetails, unchartInd) {
	if (!immunizationBatchDetails.length) {
		throw new Error("No immunizations passed");
	}
	var requestJSON = '{"IMMUNIZATION_DETAILS": {"UNCHART_IND": ' + unchartInd + ',  "IMMUNLIST": [';
	var batchLength = immunizationBatchDetails.length;
	var isChartExceptionModal = this.m_immunizationModalType === this.ImmunizationsModalEnum.CHART_EXCEPTION;
	
	try {
		// Iterate through every item in the batch to get immunization details  
		for (var b = 0; b < batchLength; b++) {
			var immunizationDetailsObj = immunizationBatchDetails[b];

			// Convert the date values into JSON 
			var adminDateJSON = this.convertDateObjectToString(immunizationDetailsObj.ADMIN_DATE);
			var subExpDateJSON = this.convertDateObjectToString(immunizationDetailsObj.SUB_EXPIRATION_DATE);

			var decimalDoseValue = 0;

			// Format the DOSE_VALUE to float even if it was entered in French like 10,25 to be service compatible
			immunizationDetailsObj.DOSE_VALUE = immunizationDetailsObj.DOSE_VALUE.toString();
			if (immunizationDetailsObj.DOSE_VALUE.indexOf(".") > 0) {
				decimalDoseValue = parseFloat(immunizationDetailsObj.DOSE_VALUE);
			}
			else if (immunizationDetailsObj.DOSE_VALUE.indexOf(",") > 0) {
				var tempDecimalDoseValue = immunizationDetailsObj.DOSE_VALUE.split(",");
				decimalDoseValue = parseFloat(tempDecimalDoseValue[0] + '.' + tempDecimalDoseValue[1]);
			}
			else {
				decimalDoseValue = immunizationDetailsObj.DOSE_VALUE + ".00";
			}

			// Encode the LOT number in such a way that it accepts any random characters
			var encodedLotStr = "''";
			if (immunizationDetailsObj.LOT.length) {
				var entityStrInstance = new MPageEntity.EncodedString();
				encodedLotStr = entityStrInstance.toCcl(immunizationDetailsObj.LOT);
			}

			//Encode the unchart reason to account for special chars 
			var encodedUnchartReason = "''";
			//Prepend the current date to the unchart_reason_text
			var todaysDate = new Date();
			var todaysDateDisplay = todaysDate.format("shortDate3");
			var tempEncodedUnchartedReason = "[" + todaysDateDisplay + " Unchart] " + immunizationDetailsObj.UNCHART_REASON;
			if (immunizationDetailsObj.UNCHART_REASON.length) {
				var entityUnchartInstance = new MPageEntity.EncodedString();
				encodedUnchartReason = entityUnchartInstance.toCcl(tempEncodedUnchartedReason);
			}		

			// Encode the admin note in such a way that it accepts any random characters
			var encodedAdminNote = "''";
			var adminNoteDetails = {ADMIN_NOTE_ID: 0, ADMIN_NOTE: ""};
			if (isChartExceptionModal) {
				if (immunizationDetailsObj.ADMIN_NOTE.length) {
					var exceptionAdminStrInstance = new MPageEntity.EncodedString(); 
	                    		encodedAdminNote = exceptionAdminStrInstance.toCcl(immunizationDetailsObj.ADMIN_NOTE); 
				}				
			}
			else {
				adminNoteDetails = this.getAdminNoteDetails(immunizationDetailsObj.COMMENTS);
				if (adminNoteDetails.ADMIN_NOTE.length) {
					var tempAdminNote = adminNoteDetails.ADMIN_NOTE.split("<br/>").join("\n");
					var entityAdminStrInstance = new MPageEntity.EncodedString();
					encodedAdminNote = entityAdminStrInstance.toCcl(tempAdminNote);
				}
			}

			// Format the JSON 
			requestJSON += '{"EVENT_ID": ' + immunizationDetailsObj.EVENT_ID + '.00,' +
				' "PARENT_EVENT_ID": ' + immunizationDetailsObj.PARENT_EVENT_ID + '.00,' +
				' "EVENT_CD": ' + immunizationDetailsObj.VACCINE_EVENT_CODE + '.00,' +
				' "SOURCE_CD": ' + immunizationDetailsObj.SOURCE_CD + '.00, ' +
				' "SYNONYM_ID": ' + immunizationDetailsObj.PRODUCT_ID + '.00, ' +
				' "DOSAGE": ' + decimalDoseValue + ', ' +
				' "DOSAGE_UNIT_CD": ' + immunizationDetailsObj.DOSE_UNIT_CD + '.00,' +
				' "ADMIN_ROUTE_CD": ' + immunizationDetailsObj.ROUTE_CD + '.00,' +
				' "ADMIN_SITE_CD": ' + immunizationDetailsObj.SITE_CD + '.00,' +
				' "SUBSTANCE_MANUFACTURER_CD": ' + immunizationDetailsObj.MANUF_CD + '.00,' +
				' "SUBSTANCE_LOT_NUMBER": ' + encodedLotStr + ',' +
				' "SUBSTANCE_EXP_DT_TM": "' + subExpDateJSON + '",' +
				' "ADMIN_DATE_DT_TM": "' + adminDateJSON + '",' +
				' "ADMIN_DATE_DT_TM_OS": ' + immunizationDetailsObj.ADMIN_DATE_PRECISION_CD + '.00,' +
				' "INFORMATION_STATEMENTS": ' + MP_Util.enhancedStringify(immunizationDetailsObj.VIS_BUNDLE) + ',' +
				' "REFERENCE_NBR": "IMMUNIZATION' + Math.random().toString(36).slice(2) + '",' +
				' "ADMIN_NOTE_ID": ' + adminNoteDetails.ADMIN_NOTE_ID + '.00,' +
				' "ADMIN_NOTE": ' + encodedAdminNote + ',' +
				' "EVENT_TYPE_FLAG": ' + immunizationDetailsObj.EVENT_TYPE_FLAG + ',' +
				' "UNCHART_COMMENT_TEXT" : ' + encodedUnchartReason + ',' +
				' "EXCEPTION_REASON_CD": '+immunizationDetailsObj.EXCEPTION_REASON_CD+'.00,' + 
				' "ADMIN_PRSNL_ID": '+immunizationDetailsObj.ADMIN_PRSNL_ID+'.00,'; 

			// Add a comma after every request except for the last				
			if (b < batchLength - 1) {
				requestJSON += '},';
			}
			else {
				requestJSON += '}';
			}

		}
		// Close the IMMUNIZATION_DETAILS
		requestJSON += ']}}';
	}
	catch (err) {
		logger.logJSError(err, this, "immun-add-modify-shell.js", "convertImmunObjectToJSON");
	}
	return requestJSON;
};

/**
 * This function will return a comment ID and the actual comment text of an administration note
 * @param{Object} comments A list of comments containing admin as well as patient tolerance notes
 * @returns {Object} commentDetails An object holding the admin note ID and admin note 
 */
ImmunizationsO2Component.prototype.getAdminNoteDetails = function(comments){
	try{
		var adminNoteDetails = {ADMIN_NOTE_ID: 0, ADMIN_NOTE: ""};
		
		// Iterate through every comments to check whether it belongs to an admin note
		var commentsLen = comments.length;
		for(var a = 0; a<commentsLen; a++){
			if(comments[a].COMMENT_TYPE_CD.MEANING === "RES COMMENT"){
				// Meaning this is an admin note and not a patient tolerance note
				adminNoteDetails.ADMIN_NOTE_ID = parseFloat(comments[a].COMMENT_ID);
				adminNoteDetails.ADMIN_NOTE = comments[a].TEXT;
				break;
			}
		}
		
		return adminNoteDetails;
	}
	catch(err){
		logger.logJSError(err, this, "immun-add-modify-shell.js", "getAdminNoteDetails");
	}
};

/**
 * The createAlertBannerHTML function will create a markup for showing a banner when there is an error saving immunization
 * @param {String} i18nStringVal i18n String for the Text to be shown in the banner
 * @returns {String} A HTML markup of a alert banner 
 */
ImmunizationsO2Component.prototype.createAlertBannerHTML = function (i18nStringVal) {
	var alertBannerHTML = "";
	try {
		var alertBanner = new MPageUI.AlertBanner();
		if (alertBanner) {
			alertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
			alertBanner.setPrimaryText(i18nStringVal);
			alertBannerHTML = alertBanner.render();
		}
	}
	catch (err) {
		logger.logJSError(err, this, "immun-add-modify-shell.js", "createAlertBannerHTML");
	}
	return alertBannerHTML;
};

/**
 * calculateEstimatedAdminDate function will calculate an estimated admin date by reading the date preference available in the script
 * If MONTH_PREF_VAL is 0 then the estimated date will be the First day of the selected Month/Year 
 * If MONTH_PREF_VAL is 1 then the estimated date will be the Last day of the selected Month/Year
 * If YEAR_PREF_VAL is 0 then the estimated date will be the First day of the selected Year
 * If YEAR_PREF_VAL is 1 then the estimated date will be the Middle day of the selected Year
 * If YEAR_PREF_VAL is 2 then the estimated date will be the Last day of the selected Year
 * An offset is calculated based on what format is selected.
 * @param {Object} adminDate A date object from date picker
 * @param {integer} adminDateFormat An integer indicating the date format 
 * @returns {Date Object} estimatedDate Estimated date calculated based on the date and the format sent  
 */
ImmunizationsO2Component.prototype.calculateEstimatedAdminDate = function(adminDate, adminDateFormat){
	var estimatedDate = {DATE: 0, OFFSET: 0};
	try{

		var supportedYearPreferences = {BEGINNING_OF_YEAR: 0, MIDDLE_OF_YEAR: 1, END_OF_YEAR: 2};
		var supportedMonthPreferences = {BEGINNING_OF_MONTH: 0, LAST_DAY_OF_MONTH: 1};
		var supportedOffsets = {YEAR: 364, WEEK_OF: 6, DAY: 0};
		
		// If adminDate is not a date object then throw an error 
		if(!(adminDate instanceof Date)){
			throw new Error("adminDate is not a type of Date object");
		}

		// Cache Full Year, Month Date, number of days in the Month of the adminDate
		var adminDateFullYear = adminDate.getFullYear();
		var adminDateMonth = adminDate.getMonth();
		var adminDateDay = adminDate.getDate();
		var numberOfDaysInMonth = new Date(adminDateFullYear, adminDateMonth+1, 0).getDate();
		
		// From the DateSelector artifact, following is the mapping of the date format flag
		// AGE: -1, YEAR: 3, MONTH_YEAR: 2, WEEK_OF: 1, DATE: 0
		switch(adminDateFormat){
			// Date format : DATE or AGE
			case -1:  
			case 0:
					// Set the estimated date as the selected date
					estimatedDate.OFFSET = supportedOffsets.DAY;
					estimatedDate.DATE = adminDate;
					break;
				
			// Date format : WEEK_OF
			case 1:
					// Identify if the date falls on the 1st, 2nd, 3rd or 4th week 
					var weekNumber = Math.ceil(adminDateDay/7);
					
					switch(weekNumber){
						case 1: 
								// If week 1 then set date as the 1st of selected month and year
								estimatedDate.DATE = new Date(adminDateFullYear, adminDateMonth, 1);// new Date(yyyy, mm, dd)
								estimatedDate.OFFSET = supportedOffsets.WEEK_OF;
								break;

						case 2: 						
								// If week 2 then set date as the 8th of selected month and year 
								estimatedDate.DATE = new Date(adminDateFullYear, adminDateMonth, 8);
								estimatedDate.OFFSET = supportedOffsets.WEEK_OF;
								break;
								
						case 3:	
								// If week 3 then set date as the 15th of selected month and year 
								estimatedDate.DATE = new Date(adminDateFullYear, adminDateMonth, 15);
								estimatedDate.OFFSET = supportedOffsets.WEEK_OF;
								break;
								
						case 4:
						case 5:
								// If week 4 or 5 then set date as the 22nd of selected month and year 
								// Need to consider Week 5 because if a date is selected which is at very end of month, then it can fall above week 4.
								estimatedDate.DATE = new Date(adminDateFullYear, adminDateMonth, 22);
								// In this case the offset will be the number days from 22nd till the month ends
								estimatedDate.OFFSET = numberOfDaysInMonth - 22; 
								break;
					}
					break;
					
			// Date format : MONTH_YEAR
			case 2: 
					// The offset is number of days in the selected month
					estimatedDate.OFFSET = numberOfDaysInMonth - 1; 
					
					// Read the preference for month_pref_val
					var monthPrefVal = this.immunRecordData.MONTH_PREF_VAL || 0;
					if(monthPrefVal === supportedMonthPreferences.BEGINNING_OF_MONTH){
						estimatedDate.DATE = new Date(adminDateFullYear, adminDateMonth, 1);
					}
					else if(monthPrefVal === supportedMonthPreferences.LAST_DAY_OF_MONTH){
						// Go ahead 1 month and get back by 1 day. That way it will work for months like Feb and leap year situation
						estimatedDate.DATE = new Date(adminDateFullYear, adminDateMonth+1, 0);
					}
					break;
					
			// Date format : YEAR
			case 3: 
					// The offset is 364 indicating that just a "Year" was selected
					estimatedDate.OFFSET = supportedOffsets.YEAR;  
					
					// Read the preference for year_pref_val
					var yearPrefVal = this.immunRecordData.YEAR_PREF_VAL || 0;
					if(yearPrefVal === supportedYearPreferences.BEGINNING_OF_YEAR){
						// 1st Jan will be the beginning of the year
						estimatedDate.DATE = new Date(adminDateFullYear, 0, 1);
					}
					else if(yearPrefVal === supportedYearPreferences.MIDDLE_OF_YEAR){
						 // 2nd July is approximately the middle of the year
						estimatedDate.DATE = new Date(adminDateFullYear, 6, 2);
					}
					else if(yearPrefVal === supportedYearPreferences.END_OF_YEAR){
						// 31st Dec will be the end of the year
						estimatedDate.DATE = new Date(adminDateFullYear, 11, 31);
					}
					break;
		}
	}
	catch(err){
		logger.logJSError(err, this, "immun-add-modify-shell.js", "calculateEstimatedAdminDate");
	}
	return estimatedDate;
};

/**
 * Prepare for Product and VIS information from the vaccine that resides in the Shared Resource
 * Since the values are already stored from the service call we can be sure that the shared res will have the value
 *
 * @param vaccineDetailsObj Details of the vaccine such as the vaccine group code necessary to refer the vaccine info from SR
 * @returns {undefined} Returns nothing
 */
ImmunizationsO2Component.prototype.prepareProductAndVISInfo = function (vaccineDetailsObj) {
	try {
		//Get the vaccine details from Shared resource based on the vaccine group code
		var resourceName = null;
		var codeSetToken = null;
		var SRDataObj = null;
		this.m_modalVaccineEventsData = null;

		if (vaccineDetailsObj) {
			//Get the vaccine event code information from Shared Resource
			resourceName = "VACCINE_" + vaccineDetailsObj.VACCINE_EVENT_CODE; //Vaccine Group code
			codeSetToken = MP_Resources.getSharedResource(resourceName);
			if (codeSetToken && codeSetToken.isResourceAvailable()) {
				SRDataObj = codeSetToken.getResourceData();

				if (SRDataObj && SRDataObj.EVENTS.length) {
					this.m_modalVaccineEventsData = SRDataObj;
				}
			}
		}
	} catch (err) {
		logger.logJSError(err, this, "immun-add-modify-shell.js", "prepareProductAndVISInfo");
	}
};

/**
 * Renders the product drop down in the modal, this is a compilation of all the products
 * from all the event codes in the vaccine group
 * We also use this function to set the default event code based on the
 * default indicator set for the event code in the vaccine group, if the
 * default indicator is not set then the event code which is not a combo is selected
 *
 * @param {Object} vaccineDetailsObj Vaccine information that contains all the event codes and products
 * @param {String} uniquePrefix Unique prefix necessary to obtain the product HTML element
 * @param {String} productContainer Product container ID to get the product HTML Element
 * @returns {undefined} Returns nothing
 */
ImmunizationsO2Component.prototype.renderModalDoseProduct = function (vaccineDetailsObj, uniquePrefix, productContainer) {
	try {
		var productOptionElem = "";
		var productElem = "";
		var linearProductArr = [];
		var linearProductArrLen = 0;
		var vaccineObj = this.m_modalVaccineEventsData;
		var vaccineEventsObj = this.m_modalVaccineEventsData.EVENTS;
		var vaccineEventsObjLen = this.m_modalVaccineEventsData.EVENTS.length;
		var uniqueID = uniquePrefix + this.compID;
		var defaultEventCode = 0;
		var prevEventCode = 0;

		/**
		 * Flattens the list of products from all the event codes
		 *
		 * @param {Object} eventsObj Object containing all the event codes and products
		 * @returns {Array} linearProductList Array containing the list of products
		 */
		var getLinearProductList = function (eventsObj) {
			var linearProductList = [];
			for (var i = 0; i < eventsObj.length; i++) {
				var tempProductArr = eventsObj[i].PRODUCTS;
				var tempProductArrLen = eventsObj[i].PRODUCTS.length;
				if (tempProductArrLen) {
					for (var j = 0; j < tempProductArrLen; j++) {
						//Since once we linearize the products, we stand to lose the event_code.
						//Hence attaching the event codes into context
						tempProductArr[j]["PARENT_EVENT_CD"] = eventsObj[i].EVENT_CODE.CODE_VALUE;
						linearProductList.push(tempProductArr[j]);
					}
				}
			}
			return linearProductList;
		};			

		if (vaccineEventsObjLen) {
			//Construct a linear list of products from the event codes to show in the drop down
			linearProductArr = getLinearProductList(vaccineEventsObj);

			linearProductArrLen = linearProductArr.length;
			//Set the first event code with default indicator as the default event code for the vaccine dose
			defaultEventCode = this.setEntryEventId(vaccineDetailsObj, vaccineObj, uniquePrefix, 0);

			if (linearProductArrLen) {
				productOptionElem = "<option data-event-cd= '" + defaultEventCode + "' value=0></option>";
				for (var i = 0; i < linearProductArrLen; i++) {
					if (vaccineObj.VACCINE_GROUP_CODE.CODE_VALUE === parseFloat(vaccineDetailsObj.VACCINE_EVENT_CODE)) {
						productOptionElem += "<option data-event-cd= '" + linearProductArr[i].PARENT_EVENT_CD + "'value='" + linearProductArr[i].SYNONYM_ID + "'>" + linearProductArr[i].PRODUCT_NAME + "</option>";
					}
				}
			}
			else {
				productOptionElem = "<option data-event-cd= '" + defaultEventCode + "' value=0>" + vaccineDetailsObj.VACCINE_DISPLAY + "</option>";
			}
			productElem = "<span class='secondary-text immun-o2-shell-label'>" + i18n.PRODUCT + "</span><select class='immun-o2-sp-select' id='productSelector" + uniqueID + "'>" + productOptionElem + "</select>";

			//Render the drop down
			$(productContainer).append(productElem);
			
			//determine if the default event code has combo matches
			var comboArr = this.getComboMatchesList(defaultEventCode, vaccineEventsObj);
			
			//if combo matches found, 
			if (comboArr.length) {
				
				//add combo parent dose id to array
				var parentDetails = this.checkForComboParentDetails(uniquePrefix);
				if (!parentDetails) {
					parentObj = {
						PARENT_DOSE_ID: uniquePrefix,
						PARENT_DISPLAY: vaccineDetailsObj.VACCINE_DISPLAY,
						DEFAULT_EC_IS_COMBO: 1
					};
					this.m_comboParentDetails.push(parentObj);
					parentDetails = parentObj;
				} 
				else {
					parentDetails.DEFAULT_EC_IS_COMBO = 1;
					parentDetails.SATIS_DISPLAY = "";
					this.m_immunSatisfied = [];
				}
				
				this.comboProductSelected(comboArr, parentDetails);
			}

			//Add click events to the drop down items
			//If the VIS drop down is present then toggle the items based on the product
			// or just change the event code accordingly
			$("#productSelector" + uniquePrefix + this.compID).change(function () {
				var uniqueID = uniquePrefix + this.compID;
				var productOptionElem = $("#productSelector" + uniqueID);
				var prevSelectedEC = productOptionElem.attr('data-prev-ec');
				var VISOptionElem = "VISSelector" + uniqueID;
				var VISElem = $("#" + VISOptionElem);
				var currentEventCodeValue = $('option:selected', productOptionElem).attr('data-event-cd');
				var selectedLabel = $('option:selected', productOptionElem).html();
				var currentVaccineDetailsObj = this.traceCurrentVaccineObj("DOSE_ID", uniquePrefix);
				if (currentVaccineDetailsObj) {
					//Get the latest vaccine information in context [this.m_modalVaccineEventsData]
					this.prepareProductAndVISInfo(currentVaccineDetailsObj);

					//Set the event_code based on the product selected
					prevSelectedEC = prevSelectedEC ? parseFloat(prevSelectedEC) : null;
					currentEventCodeValue = currentEventCodeValue ? parseFloat(currentEventCodeValue) : 0;
					if ("number" === typeof currentEventCodeValue && currentEventCodeValue) {
						//Compare the new new event code with the previous one
						if (prevSelectedEC !== currentEventCodeValue) {
							//set the newly selected event code as the previous one
							productOptionElem.attr('data-prev-ec', currentEventCodeValue);
							
							//Set the current changed event code as the new dose event code
							this.setEntryEventId(currentVaccineDetailsObj, this.m_modalVaccineEventsData, uniquePrefix, currentEventCodeValue);

							//Change the VIS drop down items based on the change in the event code in the product drop down
							if (VISElem.length && currentEventCodeValue) {
								// If a valid Product is selected then enable the selector
								var statementsArr = this.getVISFromEventCode(this.m_modalVaccineEventsData, parseFloat(currentEventCodeValue));
								var statementsArrLen = statementsArr.length;

								if (statementsArrLen) {
									var multiVISItemsCount = $("#VISBundleSubContainer" + uniqueID).children().length;

									VISElem.prop("disabled", false);
									this.loadDataIntoVIS(statementsArr, VISElem, currentEventCodeValue);
									if (statementsArrLen > 1) {
										$("#addOtherVISLink" + uniqueID).show();
									}
									else {
										$("#addOtherVISLink" + uniqueID).hide();
									}
									//Empty the container containing the multiple VIS
									if (multiVISItemsCount) {
										$("#VISBundleSubContainer" + uniqueID).empty();
										for (var i = 0; i < multiVISItemsCount; i++) {
											this.removeVISPubDateFromCollection("VISPublishedDateControl" + uniqueID + "VIS" + i);
										}
									}

									//Change the attr in the a link which adds the multiple VIS
									$("#addOtherVISLink" + uniqueID).attr('data-click-count', 0);
								}

								// Trigger the VIS selector change
								VISElem.triggerHandler("change");
							}
							
							//only when the event code has changed, determine if the selected event code has combo matches
							var comboArr = this.getComboMatchesList(currentEventCodeValue, vaccineEventsObj);
							
							//if combo matches found 
							if (comboArr.length) {
								var parentDetails = this.checkForComboParentDetails(uniquePrefix);
								
								if (!parentDetails) {
									parentObj = {
										PARENT_DOSE_ID: uniquePrefix,
										PARENT_DISPLAY: currentVaccineDetailsObj.VACCINE_DISPLAY
									};
									this.m_comboParentDetails.push(parentObj);
									parentDetails = parentObj;
								}
								
								parentDetails.SATIS_DISPLAY = "";
								this.m_immunSatisfied = [];
								
								this.updateChildCombos(parentDetails);
								
								if (parentDetails.DEFAULT_EC_IS_COMBO) {
									parentDetails.DEFAULT_EC_IS_COMBO = 0;
									this.removeECWarningBanner(parentDetails);
								}
								
								if (!selectedLabel) {
									this.removeProductSatisfyNote(parentDetails);
									parentDetails.DEFAULT_EC_IS_COMBO = 1;
								}
								
								this.comboProductSelected(comboArr, parentDetails);
							}
							else {
								//If combo was selected, and is now de-selected, remove the previous combo details
								this.checkIfDoseIsCombo(uniquePrefix);
							}
						} 
						else {
							//anytime the product is changed, remove the alert banner and add combo product note
							var parentDetails = this.checkForComboParentDetails(uniquePrefix);
							
							if (parentDetails) {
								//if the product was changed to nothing, then add alert banner
								//and remove product helper note
								if (!selectedLabel) {
									this.addECWarningBanner(parentDetails);
									parentDetails.DEFAULT_EC_IS_COMBO = 1;
									this.removeProductSatisfyNote(parentDetails);
									return;
								}
								
								if (parentDetails.DEFAULT_EC_IS_COMBO) {
									parentDetails.DEFAULT_EC_IS_COMBO = 0;
									this.removeECWarningBanner(parentDetails);
								}
								//add product note to parent dose details box
								this.addProductSatisfyNote(parentDetails);
							}
						}
					}
				}
			}.bind(this));

			CERN_EventListener.fireEvent(null, this, "shellFieldsRendered" + this.compID, null);
		}

	} catch (err) {
		logger.logJSError(err, this, "immun-add-modify-shell.js", "renderModalDoseProduct");
	}
};

/**
 * Gets any values from ADDITIONAL_VACCINE_GROUPS for the given
 * event code. Saves those group codes in a flat array and returns them.
 * @param {number} eventCode The event code to find matching groups for
 * @param {array} eventObj The list of potential group matches
 * @returns {array} comboMatchList The list of group codes that matched the 
 * passed in event code
 */
ImmunizationsO2Component.prototype.getComboMatchesList = function(eventCode, eventObj) {
	var eventLen = eventObj.length;
	var tempComboList = [];
	var comboMatchList = [];
	
	//get the additional vaccine groups object of the correct event code
	for (var i = 0; i < eventLen; i++) {
		var tempEventCode = eventObj[i].EVENT_CODE.CODE_VALUE;
		if (tempEventCode === eventCode) {
			tempComboList = eventObj[i].ADDITIONAL_VACCINE_GROUPS;
			break;
		}
	}
	
	//save off the group code values of the combo matches
	var tempComboListLen = tempComboList.length;
	if (tempComboListLen) {
		for (var j = 0; j < tempComboListLen; j++) {
			//save off display and event code of matching combos
			var groupCode = tempComboList[j].VACCINE_GROUP_CODE.CODE_VALUE;
			comboMatchList.push({"VACCINE_GROUP_CD": groupCode});
		}
	}
	
	return comboMatchList;
};

/**
 * Sets the event id to the appropriate dose/exception entry - Default and Ondemand
 *
 * @param {Object} vaccineDetailsObj Vaccine Group details
 * @param {Object} vaccineServiceObj Vaccine details returned from the service 966901
 * @param {String} entryId Unique id corresponding to the dose/exception entry
 * @param {Number} eventCodeValue Dose/Exception value - Number that needs to be set for that dose/exception entry - 0 for default
 * @returns {Number} eventCodeValue If the dose event code needs to set is default then we pass 0 and the default event code is set and returned
 */
ImmunizationsO2Component.prototype.setEntryEventId = function (vaccineDetailsObj, vaccineServiceObj, entryId, eventCodeValue) {
	var detailDosesObjLen = vaccineDetailsObj.DOSES ? vaccineDetailsObj.DOSES.length : 0;
	var detailExceptionsObjLen = vaccineDetailsObj.EXCEPTIONS ? vaccineDetailsObj.EXCEPTIONS.length : 0;
	var vaccineServiceObjLen = vaccineServiceObj.EVENTS ? vaccineServiceObj.EVENTS.length : 0;

	//Get the first event code which has the default_ind set if the provided event_code is 0
	if (eventCodeValue === 0) {
		if (vaccineServiceObjLen) {
			for (var i = 0; i < vaccineServiceObjLen; i++) {
				if (vaccineServiceObj.EVENTS[i].DEFAULT_IND === 1) {
					eventCodeValue = vaccineServiceObj.EVENTS[i].EVENT_CODE.CODE_VALUE;
					break;
				}
			}
			if (!eventCodeValue) {
				//In the event of there not having any events with default ind as 1 then
				// we select the event code which is a non combo
				for (i = 0; i < vaccineServiceObjLen; i++) {
					var addlGrpLen = vaccineServiceObj.EVENTS[i].ADDITIONAL_VACCINE_GROUPS ? vaccineServiceObj.EVENTS[i].ADDITIONAL_VACCINE_GROUPS.length : 0;
					if (!addlGrpLen) {
						eventCodeValue = vaccineServiceObj.EVENTS[i].EVENT_CODE.CODE_VALUE;
						break;
					}
				}

				if (!eventCodeValue) {
					//If its still 0 then that means all the events codes have default_ind as 0
					// and they are all a part of combo vaccines...Kattappa
					eventCodeValue = vaccineServiceObj.EVENTS[0].EVENT_CODE.CODE_VALUE;
				}
			}
		}
	}

	//Once we have the eventCode with default_ind then we can set the value for that dose
	if (entryId && eventCodeValue) {
		if (detailDosesObjLen) {
			for (i = 0; i < detailDosesObjLen; i++) {
				if (vaccineDetailsObj.DOSES[i].DOSE_ID === entryId) {
					vaccineDetailsObj.DOSES[i].DOSE_EVENT_CODE = eventCodeValue;
				}
			}
		}		
		
		if (detailExceptionsObjLen) {
			for (i = 0; i < detailExceptionsObjLen; i++) {
				if (vaccineDetailsObj.EXCEPTIONS[i].EXCEPTION_ID === entryId) {
					vaccineDetailsObj.EXCEPTIONS[i].EXCEPTION_EVENT_CODE = eventCodeValue;
				}
			}
		}
	}
	//For getting the Default Event Code back to the consumer
	return eventCodeValue;
};

/**
 * Gets the VIS List from the event object that was passed
 *
 * @param {Object} baseSearchObj Event object containing all the event codes, products and VIS
 * @param {Number} eventCodeValue Number denoting the event code for which VIS is needed to be retrieved
 * @returns {Array} List of VIS objects
 */
ImmunizationsO2Component.prototype.getVISFromEventCode = function (baseSearchObj, eventCodeValue) {
	var i = 0;
	var baseSearchObjLen = baseSearchObj.EVENTS.length;

	if (baseSearchObjLen) {
		for (i = 0; i < baseSearchObjLen; i++) {
			if (baseSearchObj.EVENTS[i].EVENT_CODE.CODE_VALUE === eventCodeValue) {
				break;
			}
		}
	}

	return baseSearchObj.EVENTS[i].INFORMATION_STATEMENTS;
};

/**
 * Loads a list of VIS information in the VIS dropdown and also toggles the Published dates based on the VIS selected from the drop down
 *
 * @param {Object} statementsObj VIS object containing all the information statements
 * @param {String} selectorElem HTML element representing the VIS
 * @param {Number} eventCode Number denoting the event code for which VIS is needed to be retrieved (Used to identify in the markup)
 */
ImmunizationsO2Component.prototype.loadDataIntoVIS = function (statementsObj, selectorElem, eventCode) {
	var statementInfo = null;
	var statementSheetElemStr = "<option value='0'></option>";

	if (statementsObj && selectorElem.length && eventCode) {
		var statementsObjLen = statementsObj.length;
		for (var i = 0; i < statementsObjLen; i++) {
			var statementItem = statementsObj[i]["STATEMENTS"];
			var statementItemLen = statementItem.length;
			for (var j = 0; j < statementItemLen; j++) {
				statementInfo = statementItem[j];
				if (statementInfo.ACTIVE_IND === 1) {
					statementSheetElemStr += "<option data-event-cd= '" + eventCode + "'value=" + statementInfo.VIS_CD.CODE_VALUE + ">" + statementInfo.VIS_CD.DISPLAY + "</option>";
					this.VISDetailsForEventCode[statementInfo.VIS_CD.CODE_VALUE] = statementInfo["PUBLISHED_DATE"];
				}
			}
		}
		$(selectorElem).empty().append(statementSheetElemStr);
	}
};

/**
 * Renders the VIS information in the modal based on the default event code or product selected
 *
 * @param {String} VISSelectorContainer Container for the VIS drop down
 * @param {String} VISPubDateContainer Container for the Product date selector
 * @param {String} VISGivenDateContainer Container for Given date selector
 * @param {String} uniqueID Unique prefix + Component Id
 * @param {Object} immunizationDetailsObj Vaccine information received from the service 966901
 * @returns {undefined} Returns nothing
 */
ImmunizationsO2Component.prototype.renderModalDoseVIS = function (VISSelectorContainer, VISPubDateContainer, VISGivenDateContainer, uniqueID, immunizationDetailsObj) {
	try {
		var infoSheetHTML = "<option value='0'></option>";
		var vaccineInfoSheetHTML = "<span class='secondary-text immun-o2-shell-label'>" + this.m_immuni18n.VACCINE_INFORMATION_SHEET + "</span>" + "<select id='VISSelector" + uniqueID + "' class='immun-o2-sp-select' disabled='disabled'>" + infoSheetHTML + "</select>";
		var VISPublishedDateHTML = "<span class='secondary-text'>" + this.m_immuni18n.VIS_PUBLISHED_DATE + "</span><span class='immun-o2-sp-value-fields' id='VISPubDate" + uniqueID + "'></span>";
		var VISGivenDateHTML = "<span class='secondary-text immun-o2-shell-label'>" + this.m_immuni18n.VIS_GIVEN_DATE + "</span>";
		var self = this;

		var VISOptionElem = "VISSelector" + uniqueID;
		var VISElem = null;
		var productOptionElem = null;
		var defaultEventCode = 0;

		var setInitialDateConfigParameters = function (dateControlObj, uniqueId) {
			dateControlObj.setUniqueId(uniqueId);
			dateControlObj.setCriterion(self.m_criterion);
			dateControlObj.setFuzzyFlag(true);
		};

		/**
		 * Setup published date selector using default parameters
		 * @param {String} dateContainer Container which will house the date selector
		 * @returns {undefined} Returns nothing
		 */
		var setupPubDateControl = function (dateContainer) {
			self.VISPublishedDateControl = new DateSelector();
			self.VISPublishedDateControl.retrieveRequiredResources(function () {
				setInitialDateConfigParameters(self.VISPublishedDateControl, "VISPublishedDateControl" + uniqueID);
				self.VISPublishedDateControl.setDateSupportOption(3);

				// Render the date control and append HTML to date container
				var VISPublishedDateControlHTML = self.VISPublishedDateControl.renderDateControl();
				$(dateContainer).append(VISPublishedDateControlHTML);
				// Finalized actions after all elements are shown in the side panel
				self.VISPublishedDateControl.finalizeActions();
				// Set the date format to "Date"
				self.VISPublishedDateControl.setSelectedDateFlag(0);

				//$(dateContainer).find('.dc-date-selector')/*.addClass("immun-o2-sp-value-fields")*/;
			});
		};

		/**
		 * Setup given date selector using default parameters
		 * @param {String} dateContainer Container which will house the date selector
		 * @returns {undefined} Returns nothing
		 */
		var setupGivenDateControl = function (dateContainer) {
			self.VISGivenDateControl = new DateSelector();
			self.VISGivenDateControl.retrieveRequiredResources(function () {
				setInitialDateConfigParameters(self.VISGivenDateControl, "VISGivenDateControl" + uniqueID);

				// Render the date control and append HTML to date container
				var VISGivenDateControlHTML = self.VISGivenDateControl.renderDateControl();
				$(dateContainer).append(VISGivenDateControlHTML);
				// Finalized actions after all elements are shown in the side panel
				self.VISGivenDateControl.finalizeActions();
				// Set the date format to "Date"
				self.VISGivenDateControl.setSelectedDateFlag(0);

				$(dateContainer).find('.dc-date-selector').addClass("immun-o2-sp-value-fields");
			});
		};

		$(VISSelectorContainer).append(vaccineInfoSheetHTML);
		$(VISPubDateContainer).append(VISPublishedDateHTML);
		$(VISGivenDateContainer).append(VISGivenDateHTML);

		//Process and setup Published Date
		setupPubDateControl(VISPubDateContainer);
		//Process and setup VIS Given Date
		setupGivenDateControl(VISGivenDateContainer);

		// Push the VIS Published and Given date control objects
		this.m_VISDateSelectorCollection.push(this.VISGivenDateControl);
		this.m_VISDateSelectorCollection.push(this.VISPublishedDateControl);

		//Set the VIS to the default Event code
		// This allows us to set the VIS even if the user doesn't set the Product

		VISElem = $("#" + VISOptionElem);
		productOptionElem = $("#productSelector" + uniqueID);
		defaultEventCode = $('option:selected', productOptionElem).attr('data-event-cd');

		if (VISElem.length && defaultEventCode) {
			var statementsArr = this.getVISFromEventCode(this.m_modalVaccineEventsData, parseFloat(defaultEventCode));
			var statementsArrLen = statementsArr.length;

			if (statementsArrLen) {
				VISElem.prop("disabled", false);
				this.loadDataIntoVIS(statementsArr, VISElem, defaultEventCode);
				if (statementsArrLen > 1) {
					$("#addOtherVISLink" + uniqueID).show();
				}
			}
			VISElem.triggerHandler("change");
		}

		// Event handler for vaccine information sheet selector. Changing this will update the VIS Published date
		$("#VISSelector" + uniqueID).change(function () {
			// Get the corresponding published date
			var VISGivenDateContainer = $("#VISGivenDateContainer" + uniqueID);
			var VISPubDateContainer = $("#VISPubDateContainer" + uniqueID);
			var VISSelectorElem = $("#VISSelector" + uniqueID);

			var selectedVISPubDate = self.VISDetailsForEventCode[parseInt(VISSelectorElem.val(), 10)];
			var selectorCollectionObj = null;
			var selectorCollectionLen = self.m_VISDateSelectorCollection.length;

			// Determine the published and given date control object from the collection matching the unique ID
			for (var i = 0; i < selectorCollectionLen; i++) {
				selectorCollectionObj = self.m_VISDateSelectorCollection[i];
				if (selectorCollectionObj.m_uniqueId === "VISGivenDateControl" + uniqueID) {
					self.VISGivenDateControl = selectorCollectionObj;
					break;
				}
			}

			for (i = 0; i < selectorCollectionLen; i++) {
				selectorCollectionObj = self.m_VISDateSelectorCollection[i];
				if (selectorCollectionObj.m_uniqueId === "VISPublishedDateControl" + uniqueID) {
					self.VISPublishedDateControl = selectorCollectionObj;
					break;
				}
			}

			if (selectedVISPubDate) {
				//Show date after converting from absolute to standard format
				self.VISPublishedDateControl.setSelectedDate(self.convertAbsoluteDate(selectedVISPubDate));

				// Default the VIS Given date to empty
				self.VISGivenDateControl.setSelectedDate(null);

				// Enable date input field
				VISGivenDateContainer.find('.dc-date-input').prop("disabled", false);
				VISGivenDateContainer.find('.dc-date-picker').datepicker("enable");
				VISPubDateContainer.find('.dc-date-input').prop("disabled", false);
				VISPubDateContainer.find('.dc-date-picker').datepicker("enable");
			}
			else {
				// Clear the given date input field and disable the input
				VISGivenDateContainer.find('.dc-date-input').val("").prop("disabled", true);
				VISGivenDateContainer.find('.dc-date-picker').datepicker("disable");

				// Set no given date
				self.VISGivenDateControl.setSelectedDate(null);

				// Clear the published date input field and disable the input
				VISPubDateContainer.find('.dc-date-input').val("").prop("disabled", true);
				VISPubDateContainer.find('.dc-date-picker').datepicker("disable");

				// Set no published date
				self.VISPublishedDateControl.setSelectedDate(null);
			}
			// Set the date control flag (0: DATE)
			self.VISGivenDateControl.setSelectedDateFlag(0);
			self.VISPublishedDateControl.setSelectedDateFlag(0);
		});

		// Trigger the VIS change event so that the published date can be shown for the selected VIS. Trigger only if VIS_PUBLISHED_DATE and VIS_GIVEN_DATE is not present already
		if (!immunizationDetailsObj.VIS_GIVEN_DATE && !immunizationDetailsObj.VIS_PUBLISHED_DATE) {
			$("#VISSelector" + uniqueID).triggerHandler("change");
		}

		CERN_EventListener.fireEvent(null, this, "shellFieldsRendered" + this.compID, null);
	} catch (err) {
		logger.logJSError(err, this, "immun-add-modify-shell.js", "renderModalDoseVIS");
	}
};

/**
* This function will clear the collections object for storing Admin, VIS and Expiration DateSelectors.
* @returns {nothing}
**/ 
ImmunizationsO2Component.prototype.clearShellCollectionsObj = function() {
	this.m_adminDateSelectorCollection = [];
	this.m_VISDateSelectorCollection = [];
	this.m_substanceExpDateSelectorCollection = [];
	this.m_immunizationsToSave = [];
};

/**
 * Generates a bundle of VIS Selector, Published date and a remove link to remove the added VIS bundle
 * @param {Object} event click event object as a result of clicking "Add other VIS" link - Consists information such as {EditMode, UniqueId, VaccineData, Prefix}
 * @returns {undefined} Returns nothing
 */
ImmunizationsO2Component.prototype.generateVISBundleCB = function (event) {
	try {
		var editMode = event.data["EditMode"];
		var uniqueId = event.data["UniqueId"];
		var immunizationDetailsObj = event.data["VaccineData"];
		var uniquePrefix = event.data["Prefix"];

		var self = this;

		var bundleUniqueId = "";
		var infoSheetHTML = "<option value='0'></option>";

		if (uniqueId && immunizationDetailsObj) {
			var currentVISCount = parseInt($("#addOtherVISLink" + uniqueId).attr('data-click-count'), 10);
			var tempVISCount = currentVISCount;

			//Increase the Add VIS counter
			$("#addOtherVISLink" + uniqueId).attr('data-click-count', ++tempVISCount);

			bundleUniqueId = uniqueId + "VIS" + currentVISCount;
			var VISBaseContainerParentHTML = "<div id='VISSubContainerParent" + bundleUniqueId + "'></div>";
			var VISBaseSelectorContainerHTML = "<div id='VISSelectorContainer" + bundleUniqueId + "' class='immun-o2-sp-controls immun-o2-sp-vis-selector'></div>";
			var VISBasePubDateContainerHTML = "<div id='VISPubDateContainer" + bundleUniqueId + "' class='immun-o2-sp-controls immun-o2-sp-vis-pub-date immun-o2-sp-vis-date'></div>";
			var VISBaseRemoveVISHTML = "<span id='VISRemove" + bundleUniqueId + "'></span>";
			var VISBaseSelectorContainerElem = "";
			var VISBasePubDateContainerElem = "";
			var vaccineInfoSheetHTML = "";
			var visPublishedDateHTML = "";


			$("#VISBundleSubContainer" + uniqueId).append(VISBaseContainerParentHTML);
			$("#VISSubContainerParent" + bundleUniqueId).append(VISBaseSelectorContainerHTML).append(VISBasePubDateContainerHTML).append(VISBaseRemoveVISHTML);

			VISBaseSelectorContainerElem = $("#VISSelectorContainer" + bundleUniqueId);
			VISBasePubDateContainerElem = $("#VISPubDateContainer" + bundleUniqueId);

			if (editMode) {
				//For Side-panel Modify workflow
				var vaccines = this.VISRecordData ? this.VISRecordData["VACCINES"] : null;
				var statementInfo = null;
				var VISPubDateDetails = {};
				if (vaccines) {
					var lenVaccines = vaccines.length;
					for (var v = 0; v < lenVaccines; v++) {
						// Traverse through all the Information statements
						var lenInfoStatements = vaccines[v].INFORMATION_STATEMENTS.length;
						for (var i = 0; i < lenInfoStatements; i++) {
							// Traverse through all the statements
							var lenStatements = vaccines[v].INFORMATION_STATEMENTS[i].STATEMENTS.length;
							for (var s = 0; s < lenStatements; s++) {
								statementInfo = vaccines[v].INFORMATION_STATEMENTS[i].STATEMENTS[s];
								// Display only active information sheets
								if (statementInfo.ACTIVE_IND === 1) {
									infoSheetHTML += "<option value=" + statementInfo.VIS_CD + ">" + statementInfo.DISPLAY + "</option>";
									// Cache the synonym ID of information sheet and its published date
									VISPubDateDetails[statementInfo.VIS_CD] = statementInfo["PUBLISHED_DT_TM"];
								}
							}
						}
					}
				}

				//Add necessary class to remove the added VIS, show the icon here since its in side panel
				$("#VISRemove" + bundleUniqueId).addClass('immun-o2-sp-remove-new-vis').html("&nbsp;");

				vaccineInfoSheetHTML = "<span class='secondary-text immun-o2-shell-label'>" + this.m_immuni18n.VACCINE_INFORMATION_SHEET + "</span>" +
					"<select id='VISSelector" + bundleUniqueId + "' class='immun-o2-sp-select'>" + infoSheetHTML + "</select>";

				visPublishedDateHTML = "<span class='secondary-text'>" + this.m_immuni18n.VIS_PUBLISHED_DATE + "</span><span class='immun-o2-sp-value-fields' id='VISPubDate" + bundleUniqueId + "'></span>";


				// Add VIS selector HTML to container
				VISBaseSelectorContainerElem.append(vaccineInfoSheetHTML);
				VISBasePubDateContainerElem.append(visPublishedDateHTML);
			}
			else {
				//Show the Remove VIS link to remove the newly added VIS to the doc hx modal
				$("#VISRemove" + bundleUniqueId).html("<a id='removeVISLink" + bundleUniqueId + "' class='immun-o2-remove-vis-link'>" + this.m_immuni18n.REMOVE_VIS + "</a>");

				vaccineInfoSheetHTML = "<span class='secondary-text immun-o2-shell-label'>" + this.m_immuni18n.VACCINE_INFORMATION_SHEET + "</span>" +
					"<select id='VISSelector" + bundleUniqueId + "' class='immun-o2-sp-select'>" + infoSheetHTML + "</select>";

				visPublishedDateHTML = "<span class='secondary-text'>" + this.m_immuni18n.VIS_PUBLISHED_DATE + "</span><span class='immun-o2-sp-value-fields' id='VISPubDate" + bundleUniqueId + "'></span>";

				// Add VIS selector HTML to container
				VISBaseSelectorContainerElem.append(vaccineInfoSheetHTML);
				VISBasePubDateContainerElem.append(visPublishedDateHTML);

				var VISElem = $("#VISSelector" + bundleUniqueId);
				var productOptionElem = $("#productSelector" + uniqueId);
				var eventCode = $('option:selected', productOptionElem).attr('data-event-cd');
				if (VISElem.length && eventCode) {
					//Get the current vaccine to context
					var currentVaccineDetailsObj = this.traceCurrentVaccineObj("DOSE_ID", uniquePrefix);
					this.prepareProductAndVISInfo(currentVaccineDetailsObj);

					var statementsArr = this.getVISFromEventCode(this.m_modalVaccineEventsData, parseFloat(eventCode));
					var statementsArrLen = statementsArr.length;
					if (statementsArrLen) {
						VISElem.prop("disabled", false);
						this.loadDataIntoVIS(statementsArr, VISElem, eventCode);
					}
					VISElem.triggerHandler("change");
				}
			}

			var VISPublishedDateControl = new DateSelector();
			VISPublishedDateControl.retrieveRequiredResources(function () {
				VISPublishedDateControl.setUniqueId("VISPublishedDateControl" + bundleUniqueId);
				VISPublishedDateControl.setCriterion(this.m_criterion);
				VISPublishedDateControl.setFuzzyFlag(true);
				VISPublishedDateControl.setDateSupportOption(3);

				// Render the date control and append HTML to date container
				var VISPublishedDateControlHTML = VISPublishedDateControl.renderDateControl();
				VISBasePubDateContainerElem.append(VISPublishedDateControlHTML);

				// Finalized actions after all elements are shown in the side panel
				VISPublishedDateControl.finalizeActions();
				VISPublishedDateControl.setSelectedDate(null);
				VISPublishedDateControl.setSelectedDateFlag(0);
				//VISBasePubDateContainerElem.find('.dc-date-selector').addClass("immun-o2-sp-value-fields");
			}.bind(this));

			this.m_VISDateSelectorCollection.push(VISPublishedDateControl);

			$("#VISSelector" + bundleUniqueId).change(function () {
				var VISSelector = $(this);
				var VISPubDateContainer = $("#VISPubDateContainer" + bundleUniqueId);
				var selectedVISPubDate = "";
				if (editMode) {
					selectedVISPubDate = VISPubDateDetails[parseInt(VISSelector.val(), 10)];
				}
				else {
					selectedVISPubDate = self.VISDetailsForEventCode[parseInt(VISSelector.val(), 10)];
				}
				var formattedVISPubDate = null;

				// Determine the published and given date control object from the collection matching the unique ID
				for (var i = 0; i < self.m_VISDateSelectorCollection.length; i++) {
					if (self.m_VISDateSelectorCollection[i].m_uniqueId === "VISPublishedDateControl" + bundleUniqueId) {
						self.VISPublishedDateControl = self.m_VISDateSelectorCollection[i];
						break;
					}
				}
				if (selectedVISPubDate) {
					formattedVISPubDate = new Date();
					formattedVISPubDate.setISO8601(selectedVISPubDate);
					self.VISPublishedDateControl.setSelectedDate(formattedVISPubDate);
					VISPubDateContainer.find('.dc-date-input').prop("disabled", false);
					VISPubDateContainer.find('.dc-date-picker').datepicker("enable");
				}
				else {
					VISPubDateContainer.find('.dc-date-input').val("");
					self.VISPublishedDateControl.setSelectedDate(null);
					VISPubDateContainer.find('.dc-date-input').prop("disabled", true);
					VISPubDateContainer.find('.dc-date-picker').datepicker("disable");
				}
				self.VISPublishedDateControl.setSelectedDateFlag(0);
			});

			//Remove the Sub container which contains the VIS Bundle when the
			// remove VIS link or the remove icon is clicked
			$("#VISRemove" + bundleUniqueId).click({"UniqueId": uniqueId}, function () {
				var uniqueId = event.data["UniqueId"];
				var clickCount = parseInt($("#addOtherVISLink" + uniqueId).attr("data-click-count"), 10);
				$("#VISSubContainerParent" + bundleUniqueId).remove();

				if (clickCount > 0) {
					$("#addOtherVISLink" + uniqueId).attr('data-click-count', --clickCount);
				}
				self.removeVISPubDateFromCollection("VISPublishedDateControl" + bundleUniqueId);
			});
		}

		//Initial trigger to disable the Product
		$("#VISSelector" + bundleUniqueId).triggerHandler("change");
	}
	catch (err) {
		logger.logJSError(err, this, "immun-add-modify-shell.js", "generateVISBundleCB");
	}
};

/**
 * Removes the click events, data and other tied parameters to the date selector from the "m_VISDateSelectorCollection" Object
 * once the Remove VIS link is clicked
 * @param {String} uniqueId Unique Id denoting the date selector to be removed
 * @returns {undefined} Returns nothing
 */
ImmunizationsO2Component.prototype.removeVISPubDateFromCollection = function (uniqueId) {
	try {
		if (uniqueId) {
			for (var i = 0; i < this.m_VISDateSelectorCollection.length; i++) {
				if (this.m_VISDateSelectorCollection[i].m_uniqueId === uniqueId) {
					this.m_VISDateSelectorCollection.splice(i, 1);
				}
			}
		}
	}
	catch (err) {
		logger.logJSError(err, this, "immun-add-modify-shell.js", "removeVISPubDateFromCollection");
	}
};/**
 * This file deals with the load, create and management of the Immunizations document history modal.
 * Launched via the plusAdd button the modal, lets you add a historical administration of a vaccine.
 */

/**
 * This function builds the checkbox html that gets shown in the popup. It gets the code values from code set 4003106
 * and alphabetically sorts them. Then it builds the html and add a click event to each of the items.
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.getPopupImmunList = function() {
	var self = this;
	
	var immunListHandler = function(immunList) {
		if (immunList) {
			//alpha sort the array
			immunList.sort(self.alphaSortImmun);

			//create an html item for each immunization in the list
			var listLen = immunList.length;
			var listHTML = "<ul class='immun-o2-popup-body'>";
			for (var i = 0; i < listLen; i++) {
				listHTML += "<li class='immun-o2-popup-item' data-immun-name='" + immunList[i].DISPLAY + "' data-group-code='" + immunList[i].CODE + "' data-group-unique='" + true + "'>" + immunList[i].DISPLAY + "</li>";
			}
			listHTML += "</ul>";

			//save list html for use in popup
			this.m_popupListHTML = listHTML;

			//if popup exists, then replace body content
			if (this.m_popup) {
				this.m_popup.setBodyContent(this.m_popupListHTML);
				if(this.m_cancelButton){
					this.m_cancelButton.attachEvents();
				}
				if(this.m_selectButton){
					this.m_selectButton.attachEvents();
				}

				$(".immun-o2-popup-item").on("click", function() {
					if ($(this).data("groupUnique")) {
						self.popupItemClicked(this);
					}
				});
			}
		}
	};

	if (this.m_popupListHTML) {
		return;
	}
	else {
		MP_Util.GetCodeSetAsync(4003106, immunListHandler.bind(self));
	}
};

/**
 * Sorting the immunizations by display name. Returns a flag of either -1, 0 or 1
 * according to the order the display name should be in
 * @param {Object} a - object with DISPLAY field used to sort
 * @param {Object} b - object with DISPLAY field used to sort
 * @returns {integer} - -1 if a's display name should be before b's, 0 if they are
 * equal, or 1 if a's display name should be after b's
 */
ImmunizationsO2Component.prototype.alphaSortImmun = function(a, b) {
	try {
		if (a.DISPLAY > b.DISPLAY) {
			return 1;
		}
		if (a.DISPLAY < b.DISPLAY) {
			return -1;
		}
		//a and b must be equal
		return 0;
	} 
	catch(err) {
		logger.logJSError(err, this, "immun-doc-hx-modal.js", "alphaSortImmun");
	}
};

/**
 * This function creates and shows the document history modal
 * then calls a function to populate it
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.createDocHistoryModal = function() {
	var docHistoryModal = MP_ModalDialog.retrieveModalDialogObject("documentImmunizationHistoryModal");
	var self = this;

	// Checks if the Modal already exists if not created a new one
	if (!docHistoryModal) {
		// Generate the cancel button
		var immCancelBtn = new ModalButton("immCancelBtn")
			.setText(i18n.CANCEL)
			.setFocusInd(true)
			.setCloseOnClick(true)
			.setOnClickFunction(function() {
				self.cleanUpModalObjectsWhenClosed();
			});

		// Generate the document button
		var immDocumentBtn = new ModalButton("immDocumentBtn" + this.compID)
			.setText(this.m_immuni18n.DOCUMENT + " (0)")
			.setIsDithered(true)
			.setOnClickFunction(function() {
				self.prepareToSaveDoses();
				self.cleanUpModalObjectsWhenClosed();
			});

		// Generate the doc history modal
		docHistoryModal = new ModalDialog("documentImmunizationHistoryModal")
			.setTopMarginPercentage(10)
			.setBottomMarginPercentage(5)
			.setLeftMarginPercentage(20)
			.setRightMarginPercentage(20)
			.setIsBodySizeFixed(false)
			.addFooterButton(immDocumentBtn)
			.addFooterButton(immCancelBtn)
			.setHeaderCloseFunction(function() {
				self.cleanUpModalObjectsWhenClosed();
			});

		docHistoryModal.setHeaderTitle(this.m_immuni18n.DOC_HX_TITLE);

		MP_ModalDialog.addModalDialogObject(docHistoryModal);
	}
	// Update and show modal
	MP_ModalDialog.updateModalDialogObject(docHistoryModal);
	MP_ModalDialog.showModalDialog("documentImmunizationHistoryModal");
	this.generateDocHistoryModalBody(docHistoryModal);
};

/**
 * This function clears all member level variables so when the modal is closed
 * no state is retained when it is opened again.
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.cleanUpModalObjectsWhenClosed = function() {
	if (this.m_popup && this.m_popup.exists()) {
		this.m_popup.destroy();
	}
	this.m_immunListLeftModal = [];
	this.m_loadedVaccinesInModal = [];
	this.m_immunValidationObj = [];
	this.m_vaccineModalToggleList = [];
	this.m_immunizationsToSave = [];
	this.m_lastSelectedImmun = [];
	this.m_selectedImmunNames = [];
	this.m_modalImmunListCont = null;
	this.m_cancelButton = null;
	this.m_selectButton = null;
	this.m_modalShellFieldsRenderedCnt = 0;
	this.m_popupSelectCount = 0;
	this.m_fieldCount = 0;
	this.m_retrievedItemCount = 0;
	//setting the doc btn count to 1 and then passing a 0 indicated the final 
	//dose was removed and should set the button count to zero and dithered
	this.m_docBtnCount = 1;
	this.adjustDocumentButtonCount(0);
	this.m_modalVaccineEventsData = null;
	this.VISDetailsForEventCode = [];
	this.m_retrieveEventCodesTimer = null;
	this.m_popupListHTML = "";
	this.m_immunSatisfied = [];
	this.m_removeLastImmun = 0;

	//Cleanup shell date Objects
	this.clearShellCollectionsObj();
};

/**
 * This function populates the body of the document history modal by using the
 * setBodyHTML function provided by the Modal Dialog framework
 * @param {Object} docHistoryModal - the modal object that needs its body HTML populated
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.generateDocHistoryModalBody = function(docHistoryModal) {
	var addImmunId = "addImmunLink" + this.compID;
	var modalObj = docHistoryModal;
	var self = this;
	var mainContainerHTML = "<div class='immun-o2-hx-modal-container'><div class='immun-o2-hx-modal-add-immun'><div id='immunListInModal" + this.compID + "'></div><a id='" + addImmunId + "' href='#' class='immun-o2-add-link'>+ " + this.m_immuni18n.ADD_IMMUN + "</a></div><div id='immunModalVaccineEventPane" + this.compID + "' class='immun-o2-hx-modal-hx-details'><div id='immunDocHxTitle" + this.compID + "' class='immun-o2-hx-modal-hx-title'>" + this.m_immuni18n.NO_IMMUN_SELECTED + "</div><div id='immunDocHxBody" + this.compID + "' class='immun-o2-hx-modal-hx-body'></div></div></div>";
	modalObj.setBodyHTML(mainContainerHTML);

	//Register validator listeners for Source field for the docHx Modal
	this.registerDoseValidatorListeners();

	//add click to add immunizations link
	$("#" + addImmunId).click(function() {
		self.togglePopup(addImmunId);
	});

	//add click event handler to each remove icon added later
	$("#immunModalVaccineEventPane" + this.compID).on("click", ".immun-o2-hx-modal-hx-remove-dose", function() {
		self.removeDoseFromModal(this);
	});
	this.togglePopup(addImmunId);
};

/**
 * Creates the popup using MPageUI.Popup. Sets the necessary parts of the popup.
 * @param {string} anchorId - the id of the anchor element the popup should be attached to
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.createPopup = function(anchorId) {
	this.m_popup = new MPageUI.Popup();
	this.m_popup.setAnchorId(anchorId).setMaxBodyHeight("245px");
	this.m_popup.setHeader(this.m_immuni18n.SELECT_IMMUN);
	this.m_popupSelectCount = 0;
	this.m_selectedImmunNames = [];
	var self = this;

	//if list html is not ready, then add spinner to body
	if (this.m_popupListHTML) {
		this.m_popup.setBodyContent(this.m_popupListHTML.replace(/selected/g, "dithered"));
	}
	else {
		this.m_popup.setBodyContent("<div class='immun-o2-popup-loader'>&nbsp;</div>");
	}

	//Create cancel and select buttons for popup
	this.m_cancelButton = new MPageUI.Button();
	this.m_cancelButton.attachEvents = function() {
		this.clearElementCache();
		MPageUI.Button.prototype.attachEvents.call(this);
	};
	this.m_cancelButton.setLabel(i18n.CANCEL).setStyle(MPageUI.BUTTON_OPTIONS.STYLE.SECONDARY);

	this.m_selectButton = new MPageUI.Button();
	this.m_selectButton.attachEvents = function() {
		this.clearElementCache();
		MPageUI.Button.prototype.attachEvents.call(this);
	};
	this.m_selectButton.setLabel(i18n.SELECT + " (0)").setStyle(MPageUI.BUTTON_OPTIONS.STYLE.SECONDARY).setDisabled(true);

	var buttonHTML = "<div class='immun-o2-popup-footer'>" + this.m_selectButton.render() + this.m_cancelButton.render() + "</div>";
	this.m_popup.setFooter(buttonHTML);
	this.m_popup.setWidth(300);

	//Add click events to each button
	this.m_cancelButton.setOnClickCallback(function() {
		self.m_popup.destroy();
	});

	this.m_selectButton.setOnClickCallback(function() {
		self.m_popupListObj = $(".mpage-ui-popup-body")[0];
		self.m_popupListHTML = $(".mpage-ui-popup-body").html();
		self.m_popup.destroy();
		self.loadImmunListForModal();
	});
};

/**
 * Toggles the popup between show and hide as necessary. Calls to create popup if it
 * does not exist. Also sets the click event for the checkboxes in the popup.
 * @param {string} anchorId - the id of the anchor element the popup should be attached to
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.togglePopup = function(anchorId) {
	if (this.m_popup && this.m_popup.exists()) {
		this.m_popup.destroy();
	}
	else {
		this.createPopup(anchorId);
		this.m_popup.show();
		this.m_cancelButton.attachEvents();
		this.m_selectButton.attachEvents();
		var self = this;

		//if list exists add click events to them
		if (this.m_popupListHTML) {
			$(".immun-o2-popup-item").on("click", function() {
				if ($(this).data("groupUnique")) {
					self.popupItemClicked(this);
				}
			});
		}
	}
};

/**
 * Adds or removes the selected/unselected immunization to the running list. Also updates the
 * selected count as appropriate. Also, updates the count on the select button and disables or
 * enables the button as appropriate.
 * @param {Object} clickedItem - the object of the changed item
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.popupItemClicked = function(clickedItem) {
	var clickedItemObj = $(clickedItem);
	var itemSelected = clickedItemObj.hasClass("selected");
	var selectedCode = clickedItem.getAttribute("data-group-code");

	if (!itemSelected) {
		//If item was clicked for the first time add it to the list and add to the count
		this.m_selectedImmunNames.push({
			"DISPLAY": clickedItem.getAttribute("data-immun-name"),
			"CODE": selectedCode
		});

		//update select button
		this.m_popupSelectCount++;
		this.m_selectButton.setLabel(i18n.SELECT + " (" + this.m_popupSelectCount + ")");

		if (this.m_popupSelectCount === 1) {
			this.m_selectButton.setDisabled(false);
		}
		//Set the data unique attribute to false indicating that the vaccine
		// will be a duplicate next time
		clickedItemObj.attr('data-group-unique', false);

		//add selected class
		clickedItemObj.addClass("selected");
	}
	else {
		//If the item was clicked for the second time, remove it from the list and reduce the count
		var idx = this.m_selectedImmunNames.length;
		while (idx--) {
			if (this.m_selectedImmunNames[idx].CODE === selectedCode) {
				this.m_selectedImmunNames.splice(idx, 1);
				break;
			}
		}

		//update select button
		this.m_popupSelectCount--;
		this.m_selectButton.setLabel(i18n.SELECT + " (" + this.m_popupSelectCount + ")");

		if (this.m_popupSelectCount === 0) {
			this.m_selectButton.setDisabled(true);
		}

		//Set the data unique attribute to true if the vaccine is deselected
		clickedItemObj.attr('data-group-unique', 'true');

		//remove selected class
		clickedItemObj.removeClass("selected");
	}
};

/**
 * This function compares the newly selected immunizations from the popup with any previously selected ones
 * that might be showing in the vaccine navigator pane of the modal. Any duplicates are ignored,
 * any new items are added to the immunListLeftModal object and its alphabetically sorted. Then new html is
 * built for the vaccine navigator pane and placed there and click events are added to them. If the modal was
 * already open, then changeImmunSelection is called with the first item in the list.
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.loadImmunListForModal = function() {
	this.m_modalImmunListCont = $("#immunListInModal" + this.compID);
	var immunLen = this.m_selectedImmunNames.length;
	var modalListLen = this.m_immunListLeftModal ? this.m_immunListLeftModal.length : 0;
	var self = this;
	var uniqueSelectedItemsArr = [];
	this.vaccineSelectedItemsArr = [];
	this.m_retrieveEventCodesTimer = new RTMSTimer("USR:MPG.IMMUNIZATIONS.O2 Get DocHx Modal vaccine event codes", this.getCriterion().category_mean);
	var replyArr = [];

	//compare selected immun with ones in vaccine navigator pane
	for (var i = 0; i < immunLen; i++) {
		var duplicate = false;
		for (var j = 0; j < modalListLen; j++) {
			//ignore any duplicates
			if (this.m_selectedImmunNames[i].CODE && parseFloat(this.m_selectedImmunNames[i].CODE) === this.m_immunListLeftModal[j].CODE_VALUE) {
				duplicate = true;
				break;
			}
		}
		//If not a duplicate add it to the vaccine navigator pane
		if (!duplicate) {
			uniqueSelectedItemsArr.push({ "VACCINE_GROUP_CD": parseFloat(this.m_selectedImmunNames[i].CODE) });
		}
	}

	this.vaccineSelectedItemsArr = uniqueSelectedItemsArr;
	this.m_retrievedItemCount = uniqueSelectedItemsArr.length;
	/**
	 * This callback is called after either the vaccine info is obtained from the Shared Resource or
	 * through the call made using the Service transaction 966901
	 * @param {Object} reply Reply object which consists of the vaccine information and the event codes associated to that vaccine
	 * @returns {undefined} returns nothing
	 */
	var immunListLoadCB = function(reply) {
		var validVaccineItemsLen = 0;
		var immunListHTML = "";
		var modalListLen = 0;
		var remapVaccineIndicators = function () {
			var i = 0;
			var toggleListLen = self.m_vaccineModalToggleList.length;
			var getVaccineIconElem = "";
			var vaccineToggleListObj = null;
			try {
				if (toggleListLen) {
					for (i = 0; i < toggleListLen; i++) {
						vaccineToggleListObj = self.m_vaccineModalToggleList[i];
						getVaccineIconElem = $("#vaccine" + vaccineToggleListObj.VACCINE_EVENT_CODE);
						if (getVaccineIconElem.length) {
							switch (vaccineToggleListObj.IS_SATISFIED) {
								case -1:
									//This signifies that nothing was present as an indicator before adding a new vaccine
									$(getVaccineIconElem).removeClass("immun-o2-hx-modal-vaccine-unsatisfy");
									$(getVaccineIconElem).empty();
									break;
								case 1:
									//This signifies that the completeness was indicated as satisfied
									$(getVaccineIconElem).removeClass("immun-o2-hx-modal-vaccine-unsatisfy");
									$(getVaccineIconElem).addClass("immun-o2-hx-modal-vaccine-satisfy");
									$(getVaccineIconElem).empty();
									break;
								default:
									//Do nothing, since the state is already in unsatisfied and selected
									break;
							}
						}
					}
				}
			}
			catch (err) {
				logger.logJSError(err, this, "immun-doc-hx-modal.js", "remapVaccineIndicators");
			}
		};
		
		//Don't add anything to the navigator until all of the requested items have
		//been returned. Some items may have been requested already so they will come
		//back before the ones that have to query the backend
		var replyLen = reply.length;
		for (var k = 0; k < replyLen; k++) {
			replyArr.push(reply[k]);
		}
		
		//check if all the items have been returned
		if (self.m_retrievedItemCount !== replyArr.length) {
			return;
		}

		if (replyArr) {
			reply = replyArr;
			validVaccineItemsLen = reply.length;

			for (i = 0; i < validVaccineItemsLen; i++) {
				//creating a copy of the object here, so I do not change the shared resource
				var copyReplyObj = {};
				copyReplyObj.CODE_VALUE = reply[i].VACCINE_GROUP_CODE.CODE_VALUE;
				copyReplyObj.DEFINITION = reply[i].VACCINE_GROUP_CODE.DEFINITION;
				copyReplyObj.DESCRIPTION = reply[i].VACCINE_GROUP_CODE.DESCRIPTION;
				copyReplyObj.DISPLAY = reply[i].VACCINE_GROUP_CODE.DISPLAY;
				copyReplyObj.MEANING = reply[i].VACCINE_GROUP_CODE.MEANING;
				copyReplyObj.COMBO_PARENTS = [];
				
				self.m_immunListLeftModal.push(copyReplyObj);
			}

			modalListLen = self.m_immunListLeftModal.length;

			//alpha sort
			self.m_immunListLeftModal.sort(self.alphaSortImmun);

			//build new html
			for (i = 0; i < modalListLen; i++) {
				//if the vaccine was added as a combo, do not show an asterisk or completeness class
				var firstSelected = "";
				var completenessIndClass = "immun-o2-hx-modal-vaccine-unsatisfy";
				var asteriskOrNot = "*";
				var currCodeValue = self.m_immunListLeftModal[i].CODE_VALUE;
				var currVaccineIsCombo = self.m_immunListLeftModal[i].ADDED_AS_COMBO;
				
				if (i === 0) {
					firstSelected = " selected";
				}
				
				if (currVaccineIsCombo) {
					completenessIndClass = "";
					asteriskOrNot = "";
				}
				
				immunListHTML += "<span class='" + completenessIndClass + firstSelected + "' id='vaccine" + currCodeValue + "'>" + asteriskOrNot + "</span><div class='immun-o2-modal-left-item" + firstSelected + "' data-display='" + self.m_immunListLeftModal[i].DISPLAY + "' data-code='" + currCodeValue + "'>" + self.m_immunListLeftModal[i].DISPLAY + "</div>";
			}

			//Replace whats in object html with new html
			self.m_modalImmunListCont.html(immunListHTML);

			//Remap the indicators of completeness
			remapVaccineIndicators();

			//add click event to each immun showing in vaccine navigator pane
			$(".immun-o2-modal-left-item").on("click", function() {
				//if already selected, ignore
				if (self === self.m_lastSelectedImmun) {
					return;
				}

				//otherwise change details and selection
				var selectedImmunElem = [];
				selectedImmunElem.push($(this).prev()[0], this);

				self.changeImmunSelection(selectedImmunElem);
				self.checkValidationObj(selectedImmunElem);
			});

			//if modal open for first time
			if (!self.m_loadedVaccinesInModal.length) {
				//hide the No Immunization Selected div
				$("#immunModalVaccineEventPane" + self.compID).empty();
				self.m_lastSelectedImmun = self.m_modalImmunListCont.children(".selected");
			}
			else {
				self.changeImmunSelection(self.m_modalImmunListCont.children(".selected"));
			}

			//call checkValidationObj for selected (first) immunization
			self.checkValidationObj(self.m_lastSelectedImmun);
		}
	};

	//Start the USR timer
	if (this.m_retrieveEventCodesTimer) {
		this.m_retrieveEventCodesTimer.addMetaData("Number of vaccines queried", uniqueSelectedItemsArr.length);
		this.m_retrieveEventCodesTimer.start();
	}

	//Request for the vaccine event codes
	this.retrieveVaccineEventCodes(uniqueSelectedItemsArr, immunListLoadCB);
};

/**
 * This function removes the selected row class (color) from the previously selected
 * row and adds it to the newly selected row. Hides the previously loaded html and
 * sets the lastSelectedImmun to the newly selected one.
 * @param {Object} selectedImmunElem The newly selected row element
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.changeImmunSelection = function(selectedImmunElem) {	
	var lastImmunCode = this.m_lastSelectedImmun[1].getAttribute("data-code");
	
	if (this.m_removeLastImmun) {

		this.m_removeLastImmun = 0;
				
		this.resetVaccineSelection(lastImmunCode);
		$("#immunVaccineEventDetails" + lastImmunCode).remove();
	}
	else {		
		//remove selected class from last selected element
		$(this.m_lastSelectedImmun[0]).removeClass("selected");
		$(this.m_lastSelectedImmun[1]).removeClass("selected");
		
		//hide the lastSelectedImmun html
		$("#immunVaccineEventDetails" + lastImmunCode).hide();
	}	

	//add selected class to newly selected row
	$(selectedImmunElem[0]).addClass("selected");
	$(selectedImmunElem[1]).addClass("selected");	
	
	//set new selected row as last selected row
	this.m_lastSelectedImmun = selectedImmunElem;
};

/**
 * This function compares the selected immunization from the vaccine navigator pane
 * with the existing list of immunizations that have already been rendered. It creates a
 * new object within that list if necessary and calls checkLoadedVaccines for the
 * correct vaccine object.
 * @param {Object} selectedImmunElem The newly selected row element
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.checkValidationObj = function(selectedImmunElem) {
	//Since the array will have both the icon span and the vaccine placeholder div
	// we need to select the 2nd item in the array for click based operations
	var selectedDisplay = selectedImmunElem[1].getAttribute("data-display");
	var selectedCode = selectedImmunElem[1].getAttribute("data-code");

	var validationLen = this.m_immunValidationObj.length;
	var leftListLen = this.m_immunListLeftModal.length;
	var vaccineIndex = -1;
	var vaccineFoundFlag = 0;
	var foundVaccine = null;
	var addedAsCombo = 0;
	var hasACombo = 0;
	var comboArr = [];
	
	//check if this vaccine has combos
	for (var j = 0; j < leftListLen; j++) {
		if (this.m_immunListLeftModal[j].CODE_VALUE == selectedCode) {
			if (this.m_immunListLeftModal[j].COMBO_PARENTS.length) {
				hasACombo = 1;
				comboArr = this.m_immunListLeftModal[j].COMBO_PARENTS;
				if (this.m_immunListLeftModal[j].ADDED_AS_COMBO) {
					addedAsCombo = 1;
				}
			}
			break;
		}
	}
	
	//if validation object does exist, check for current vaccine info
	for (var i = 0; i < validationLen; i++) {
		if (this.m_immunValidationObj[i].VACCINE_EVENT_CODE === selectedCode) {
			//if found, save off index to send to checkLoadedVaccines
			vaccineIndex = i;

			//update found flag
			vaccineFoundFlag = 1;

			//save off vaccine obj
			foundVaccine = this.m_immunValidationObj[vaccineIndex];
			
			//and quit loop
			break;
		}
	}

	//if vaccine not found, add a new vaccine to validation obj
	if (!vaccineFoundFlag && !addedAsCombo) {
		//if it has a combo, add those relevant fields
		var vaccineObj = {};
		
		vaccineObj.COMBO_PARENTS = comboArr;
		
		if (this.m_immunizationModalType === this.ImmunizationsModalEnum.CHART_EXCEPTION) {			
			vaccineObj.VACCINE_EVENT_CODE = selectedCode,
			vaccineObj.VACCINE_DISPLAY = selectedDisplay,
			vaccineObj.EXCEPTIONS = [{
				EXCEPTION_ID: 0,
				EXCEPTION_EVENT_CODE: 0,
				EXCEPTION_TYPE_CD: 0,
				EXCEPTION_REASON_CD: 0,
				AUTHORIZED_CD: 0,
				ADMIN_PRSNL_ID: 0,
				ADMIN_DATE: 0,
				ALL_FIELDS_HAPPY: 0 //flag to signify all fields in this dose have their required fields filled in
			}];
		}
		else {
		vaccineObj.VACCINE_EVENT_CODE = selectedCode;
		vaccineObj.VACCINE_DISPLAY = selectedDisplay;
		vaccineObj.DOSES = [ {
			DOSE_ID: 0,
			DOSE_EVENT_CODE: 0,
			SOURCE_CD: 0,
			ADMIN_DATE: 0,
			ALL_FIELDS_HAPPY: 0 //flag to signify all fields in this dose have their required fields filled in
		} ];
		}
		this.m_immunValidationObj.push(vaccineObj);

		//Create a list of all vaccines and track the completeness for showing the indicator
		this.m_vaccineModalToggleList.push({
			VACCINE_EVENT_CODE: selectedCode,
			IS_SATISFIED: 0
		});

		vaccineIndex = validationLen;
	} 
	else if (!vaccineFoundFlag && addedAsCombo) {
		if (this.m_immunizationModalType === this.ImmunizationsModalEnum.CHART_EXCEPTION) {
		this.m_immunValidationObj.push({
			VACCINE_EVENT_CODE: selectedCode,
			VACCINE_DISPLAY: selectedDisplay,
			ADDED_AS_COMBO: addedAsCombo,
			COMBO_PARENTS: comboArr,
				EXCEPTIONS: []		
			});
		}
		else {
			this.m_immunValidationObj.push({
				//get combo stuff as for loop
				VACCINE_EVENT_CODE: selectedCode,
				VACCINE_DISPLAY: selectedDisplay,
				ADDED_AS_COMBO: addedAsCombo,
				COMBO_PARENTS: comboArr,				
				DOSES: []
			});
		}		

		//Create a list of all vaccines and track the completeness for showing the indicator
		this.m_vaccineModalToggleList.push({
			VACCINE_EVENT_CODE: selectedCode,
			IS_SATISFIED: -1
		});

		vaccineIndex = validationLen;
	}
	else if (vaccineFoundFlag && hasACombo) {
		if (addedAsCombo) {
			foundVaccine.ADDED_AS_COMBO = addedAsCombo;
		}
		foundVaccine.COMBO_PARENTS = comboArr;
	}
	
	this.checkLoadedVaccines(this.m_immunValidationObj[vaccineIndex]);
};

/**
 * This function compares the given immunization to the list of previously loaded
 * vaccines. If its found, the old html is shown, if not, then new html is created
 * by calling createModalDetails.
 * @param {Object} immunObj The immunization object's info to render in the modal body
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.checkLoadedVaccines = function(immunObj) {
	var loadedVaccinesLen = this.m_loadedVaccinesInModal.length;
	var curVaccineId = "immunVaccineEventDetails" + immunObj.VACCINE_EVENT_CODE;
	var matchFound = 0;
	var comboLen = immunObj.COMBO_PARENTS.length;
	var isChartExceptionModal = this.m_immunizationModalType === this.ImmunizationsModalEnum.CHART_EXCEPTION;
		
	//check if vaccine id exists in already loaded vaccines
	for (var i = 0; i < loadedVaccinesLen; i++) {
		if (this.m_loadedVaccinesInModal[i] === curVaccineId) {
			//call function to hide and show as needed
			$("#" + curVaccineId).show();
			//if part of a combo, get parent details render read-only box
			if (comboLen) {
				for (var j = 0; j < comboLen; j++) {
					var currCombo = immunObj.COMBO_PARENTS[j];
					//check if each read-only dose has been rendered yet
					var readOnlyObj = $("#vaccine" + immunObj.VACCINE_EVENT_CODE + "ComboTo" + currCombo.COMBO_DOSE_ID);
					if (readOnlyObj.length) {
						isChartExceptionModal ? this.updateReadOnlyExceptionBox(immunObj, currCombo) : this.updateReadOnlyDoseBox(immunObj, currCombo);
					} 
					else {
						isChartExceptionModal ? this.addReadOnlyExceptionBox(immunObj, currCombo) : this.addReadOnlyDoseBox(immunObj, currCombo);
					}
				}
			}
			matchFound = 1;
			break;
		}
	}

	//if not found, create new vaccine modal details
	if (!matchFound) {
		isChartExceptionModal ? this.createExceptionModalDetails(immunObj): this.createModalDetails(immunObj);
	}
};

/**
 * This function fills the vaccine dose pane in the doc hx modal with
 * details about the newly selected immunization from the vaccine navigator
 * pane of the modal.
 * @param {Object} immunObj The immunization object's info to render in the modal body
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.createModalDetails = function(immunObj) {
	var immunVaccineDosePane = $("#immunModalVaccineEventPane" + this.compID);
	var addDoseLinkId = "addDoseLink" + immunObj.VACCINE_EVENT_CODE;
	var immunVaccinePaneId = "immunVaccineEventDetails" + immunObj.VACCINE_EVENT_CODE;
	var immunDosePaneHTML = "<div id='" + immunVaccinePaneId + "'>";
	var dosesLen = immunObj.DOSES.length;
	var immunBodyHTML = "";
	var dosesIds = [];
	var self = this;
	var comboLen = immunObj.COMBO_PARENTS.length;

	if (immunObj.VACCINE_DISPLAY) {
		immunDosePaneHTML += "<div class='immun-o2-hx-modal-hx-title'>" + immunObj.VACCINE_DISPLAY + "</div>";
	}

	if (!immunObj.ADDED_AS_COMBO) {
		//code for creating dose boxes
		for (var i = 1; i <= dosesLen; i++) {
			var currDoseId = "vaccine" + immunObj.VACCINE_EVENT_CODE + "Dose" + i;
			dosesIds.push(currDoseId);
			immunBodyHTML += "<div id='" + currDoseId + "' class='immun-o2-hx-modal-hx-dose-box'><span class='immun-o2-hx-modal-hx-dose-header'>" + this.m_immuni18n.HISTORICAL_ENTRY + "</span><span id='" + currDoseId + "Remove' class='immun-o2-hx-modal-hx-remove-dose'></span></div>";
			
			//add dose id to validation object for use when saving changes from modal
			immunObj.DOSES[i - 1].DOSE_ID = currDoseId; 
		}
	}

	immunDosePaneHTML += "<div id='immunDocHxBody" + this.compID + "' class='immun-o2-hx-modal-hx-body'>" + immunBodyHTML + "<a id='" + addDoseLinkId + "' href='#' class='immun-o2-hx-modal-hx-add-dose'>+ " + this.m_immuni18n.DOC_OTHER_ADMIN + "</a></div></div>";
	
	immunVaccineDosePane.append(immunDosePaneHTML);
	
	this.m_loadedVaccinesInModal.push(immunVaccinePaneId);
	
	if (!immunObj.ADDED_AS_COMBO) {
		//Trigger listener, removes spinner once the count is reached
		MP_Util.LoadSpinner("vwpModalDialogdocumentImmunizationHistoryModal", 1, "doseLoadSpinner");
		this.triggerFieldLoadListener(3);
		
		//go through all dose ids and make calls to get dose details shells
		for (var j = 0; j < dosesLen; j++) {
			this.createShellForEditMode(immunObj, $("#" + dosesIds[j]), dosesIds[j], 0);
		}
	}
	//some might not have been added as a combo but will still need a read-only dose box
	if (comboLen) {
		for (var k = 0; k < comboLen; k++) {
			this.addReadOnlyDoseBox(immunObj, immunObj.COMBO_PARENTS[k]);
		}
	}
	
	//add click event handler to the "Document Other Administration" link
	$("#" + addDoseLinkId).on("click", function() {
		self.addNewDoseToModal(immunObj);
	});
};

/**
 * This function updates an existing read-only dose box for a given immunization. Since
 * the parent of the combo could have changed values, gather all new values and re-create the box.
 * @param {Object} immunObj The immunization object's info to render in the modal body
 * @param {Object} currCombo The current dose id and display of the parent combo to the passed immunization
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.updateReadOnlyDoseBox = function(immunObj, currCombo) {
	//get combo parents values and store them in a variable
	var comboDetails = this.getComboParentDetails(currCombo);
	
	//build updated html
	var immunBodyHTML = "<div class='immun-o2-read-only-header'>" + comboDetails.PARENT_DISPLAY + " " + this.m_immuni18n.COMBO + 
						"</div><div class='immun-o2-read-only-label secondary-text'>" + this.m_immuni18n.ADMIN_DATE + "</div><div class='immun-o2-read-only-details'>" + comboDetails.DETAILS.ADMIN_DATE + 
						"</div><div class='immun-o2-read-only-label secondary-text'>" + this.m_immuni18n.SOURCE + "</div><div class='immun-o2-read-only-details'>" + comboDetails.DETAILS.SOURCE + 
						"</div><div class='immun-o2-read-only-label secondary-text'>" + this.m_immuni18n.PRODUCT + "</div><div class='immun-o2-read-only-details'>" + comboDetails.DETAILS.PRODUCT + "</div>";

	//get combo box DOM object and update inner html
	//id will look like the following: vaccine3087519468ComboTovaccine3087519460Dose1
	var comboBoxObj = $("#vaccine" + immunObj.VACCINE_EVENT_CODE + "ComboTo" + currCombo.COMBO_DOSE_ID);
	
	if (comboBoxObj.length) {
		comboBoxObj.html(immunBodyHTML);
	}
};

/**
 * This function creates a new read-only dose box for a given immunization and places it
 * above the document other administration link.
 * @param {Object} immunObj The immunization object's info to render in the modal body
 * @param {Object} currCombo The current dose id and display of the parent combo to the passed immunization
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.addReadOnlyDoseBox = function(immunObj, currCombo) {
	//get combo parents values and store them in a variable
	var comboDetails = this.getComboParentDetails(currCombo);
	
	//build read-only box based on current values in variable
	var immunBodyHTML = "<div id='vaccine" + immunObj.VACCINE_EVENT_CODE + "ComboTo" + currCombo.COMBO_DOSE_ID + "' class='immun-o2-hx-modal-hx-dose-box combo'><div class='immun-o2-read-only-header'>" + comboDetails.PARENT_DISPLAY + " " + this.m_immuni18n.COMBO + 
						"</div><div class='immun-o2-read-only-label secondary-text'>" + this.m_immuni18n.ADMIN_DATE + "</div><div class='immun-o2-read-only-details'>" + comboDetails.DETAILS.ADMIN_DATE + 
						"</div><div class='immun-o2-read-only-label secondary-text'>" + this.m_immuni18n.SOURCE + "</div><div class='immun-o2-read-only-details'>" + comboDetails.DETAILS.SOURCE + 
						"</div><div class='immun-o2-read-only-label secondary-text'>" + this.m_immuni18n.PRODUCT + "</div><div class='immun-o2-read-only-details'>" + comboDetails.DETAILS.PRODUCT + "</div></div>";
	
	//put box above + Document Other Administration link
	$(immunBodyHTML).insertBefore("#addDoseLink" + immunObj.VACCINE_EVENT_CODE);
};

/**
 * This function gets the latest details from a combo parents three main details:
 * Admin Date, Source, and Product and returns them in an object.
 * @param {Object} comboObj The current dose id and display of the parent combo to the current immunization
 * @returns {Obect} trimmedDetails The parent combos details
 */
ImmunizationsO2Component.prototype.getComboParentDetails = function(comboObj) {
	//get the info on my own using dose id
	var uniquePrefix = comboObj.COMBO_DOSE_ID;
	var trimmedDetails = {
		DOSE_ID: comboObj.COMBO_DOSE_ID,
		PARENT_DISPLAY: comboObj.COMBO_PARENT_DISPLAY,
		DETAILS: {
			ADMIN_DATE: "--",
			SOURCE: "--",
			PRODUCT: "--",
			EXCEPTION_TYPE: "--",
			EXCEPTION_REASON: "--",
			ADMIN_NOTE: "--",
			AUTHORIZED_BY: "--"
		}
	};
	
	try {
		//Get admin date
		if ($("#adminDateContainer" + uniquePrefix + this.compID).length) {
			var admincollectionLen = this.m_adminDateSelectorCollection.length;
			for (var i = 0; i < admincollectionLen; i++) {
				if (this.m_adminDateSelectorCollection[i].m_uniqueId === "adminDateControl" + uniquePrefix + this.compID) {
					var adminDateControl = this.m_adminDateSelectorCollection[i];
					var dateFormat = adminDateControl.getSelectedDateFlag();
					var selectedDate = adminDateControl.getSelectedDate();
					// If date estimation is allowed then call convert the date into an estimated date depending on the year and month preferences.
					if (this.allowDateEstimation) {
						var estAdminDate = this.calculateEstimatedAdminDate(selectedDate, dateFormat);
						var date = estAdminDate.DATE;
						trimmedDetails.DETAILS.ADMIN_DATE = this.returnDisplayForPrecisionFlag(dateFormat, date) || "--";
					}
					else{
						trimmedDetails.DETAILS.ADMIN_DATE = this.returnDisplayForPrecisionFlag(dateFormat, selectedDate) || "--";
					}
					break;
				}
			}
		}
	}
	catch(err) {
		logger.logJSError(err, this, "immun-doc-hx-modal.js", "getComboParentDetails");
	}
	
	//Get source details
	var sourceSelect = document.getElementById(uniquePrefix + "SourceSelector" + this.compID);
	if (sourceSelect) {
		trimmedDetails.DETAILS.SOURCE = sourceSelect.options[sourceSelect.selectedIndex].text || "--";
	}
	
	//Get product details
	var productSelect = document.getElementById("productSelector" + uniquePrefix + this.compID);
	if (productSelect) {
		trimmedDetails.DETAILS.PRODUCT = productSelect.options[productSelect.selectedIndex].text || "--";
	}
	
	var exceptionTypeSelect = document.getElementById(uniquePrefix + "exceptionTypeSelector" + this.compID);
	if (exceptionTypeSelect) {
		trimmedDetails.DETAILS.EXCEPTION_TYPE = exceptionTypeSelect.options[exceptionTypeSelect.selectedIndex].text || "--";
	}

	var exceptionReasonSelect = document.getElementById(uniquePrefix + "exceptionReasonSelector" + this.compID);
	if (exceptionReasonSelect && exceptionReasonSelect.options.length) {
		trimmedDetails.DETAILS.EXCEPTION_REASON = exceptionReasonSelect.options[exceptionReasonSelect.selectedIndex].text || "--";
	}
	
	var authorizedByName = $("#authorizedByPersonnelSearchContainer" + uniquePrefix + this.compID).find("input");
	if (authorizedByName && authorizedByName.val()) {
		trimmedDetails.DETAILS.AUTHORIZED_BY = authorizedByName.val() != "" ? authorizedByName.val() : "--";
	}
	
	var descriptionArea = document.getElementById(uniquePrefix + "descriptionArea" + this.compID);
	if (descriptionArea) {
		trimmedDetails.DETAILS.ADMIN_NOTE = descriptionArea.value != "" ? descriptionArea.value : "--";
	}
	
	return trimmedDetails;
};

/**
 * This function checks for the highest dose currently showing for a vaccine.
 * Then it creates a new dose with a number that is one higher.
 * @param {Object} immunObj The immunization object's info to render in the modal body
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.addNewDoseToModal = function(immunObj) {
	var dosesLen = immunObj.DOSES.length;
	var currDoseId = "";
	var nextDoseNum = 0;

	if (dosesLen) {
		//get highest numbered dose for current vaccine
		var highestDoseId = immunObj.DOSES[dosesLen - 1].DOSE_ID;
		var highestDoseNum = parseInt(highestDoseId.split("Dose")[1], 10);
		nextDoseNum = highestDoseNum + 1;
		currDoseId = "vaccine" + immunObj.VACCINE_EVENT_CODE + "Dose" + nextDoseNum;
	}
	else {
		//all doses have been removed, need to add a new one
		nextDoseNum = 1;
		currDoseId = "vaccine" + immunObj.VACCINE_EVENT_CODE + "Dose1";
	}

	var immunBodyHTML = "<div id='" + currDoseId + "' class='immun-o2-hx-modal-hx-dose-box'><span class='immun-o2-hx-modal-hx-dose-header'>" + this.m_immuni18n.HISTORICAL_ENTRY + "</span><span id='" + currDoseId + "Remove' class='immun-o2-hx-modal-hx-remove-dose'></span></div>";

	//add spinner to modal and trigger listener
	MP_Util.LoadSpinner("vwpModalDialogdocumentImmunizationHistoryModal", 1, "doseLoadSpinner");
	this.triggerFieldLoadListener(3);
	
	$(immunBodyHTML).insertBefore("#addDoseLink" + immunObj.VACCINE_EVENT_CODE);
	
	immunObj.DOSES.push({
		DOSE_ID: currDoseId,
		DOSE_EVENT_CODE: 0,
		SOURCE_CD: 0,
		ADMIN_DATE: 0,
		ALL_FIELDS_HAPPY: 0 //flag to signify all fields in this dose have their required fields filled in
	});
	
	//if immun was originally added to navigator as a combo, set that to zero since
	//a non-combo dose has been added
	if (immunObj.ADDED_AS_COMBO) {
		immunObj.ADDED_AS_COMBO = 0;
		//also update listleftmodal object
		var leftListLen = this.m_immunListLeftModal.length;
		
		for (var i = 0; i < leftListLen; i++) {
			if (this.m_immunListLeftModal[i].CODE_VALUE == immunObj.VACCINE_EVENT_CODE) {
				this.m_immunListLeftModal[i].ADDED_AS_COMBO = 0;
			}
		}
	}

	//call createShellForEditMode for one number higher
	this.createShellForEditMode(immunObj, $("#" + currDoseId), currDoseId, 0);

	//Call the toggler for the vaccine in the modal pane to indicate the completeness status
	this.toggleModalVaccineStatus(immunObj);

};

/**
 * This function takes a count (number) as a parameter and sets a member level variable based on it.
 * It adds a new listener for the shellFieldsRendered event.
 * @param {number} fieldCount The count to wait until removing the loading screen
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.triggerFieldLoadListener = function(fieldCount) {
	this.m_fieldCount = fieldCount;
	this.m_modalShellFieldsRenderedCnt = 0;

	//Add new event listener
	CERN_EventListener.addListener({}, "shellFieldsRendered" + this.compID, this.modalShellFieldsEventCB, this);
};

/**
 * This function is the callback for the shell fields event getting triggered.
 * A count is kept of how many shell fields have rendered. That count is compared
 * to the expected amount of fields to be rendered. When they match, it removes
 * the loading screen from the modal window and resets the shell field counter back to 0.
 * Then it removes the listener from shellFieldsRendered.
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.modalShellFieldsEventCB = function() {
	this.m_modalShellFieldsRenderedCnt++;

	// The spinner will be shown unless all items render.
	if (this.m_modalShellFieldsRenderedCnt === this.m_fieldCount) {
		this.m_modalShellFieldsRenderedCnt = 0;

		//Remove spinner
		$("#doseLoadSpinner").remove();
		//Remove existing listener
		CERN_EventListener.removeListener({}, "shellFieldsRendered" + this.compID, this.modalShellFieldsEventCB, this);
	}
};

/**
 * This function gathers all doses which have their required fields filled and gets
 * their filled in data. It puts that data into an object and then calls
 * saveImmunizationsToDataBase with that object and 0 (to indicate add).
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.prepareToSaveDoses = function() {
	//go through m_immunValidationObj and make call to get values for all satisfied doses
	this.m_immunizationsToSave = [];
	var valLen = this.m_immunValidationObj.length;

	//loop through each vaccine
	for (var i = 0; i < valLen; i++) {
		var doseLen = this.m_immunValidationObj[i].DOSES.length;
		for (var j = 0; j < doseLen; j++) {
			//loop through each dose in each vaccine and gather info for "HAPPY" ones
			var dose = this.m_immunValidationObj[i].DOSES[j];
			if (dose.ALL_FIELDS_HAPPY) {
				//gather info for that dose id
				var fieldInfo = this.readValuesFromImmunShellFields(dose.DOSE_ID);
				fieldInfo.VACCINE_EVENT_CODE = dose.DOSE_EVENT_CODE;
				fieldInfo.PARENT_EVENT_ID = fieldInfo.PARENT_ENTITY_ID;
				//save off field info to be saved
				this.m_immunizationsToSave.push(fieldInfo);
			}
		}
	}

	// Call a function to save the modifications
	this.saveImmunizationsToDataBase(this.m_immunizationsToSave, "add");
};

/**
 * This function removes the passed dose from the DOM and the validation object
 * @param {Object} doseElem The dose element to remove
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.removeDoseFromModal = function(doseElem) {
	//elemId will be in the following format: vaccine6345354Dose2Remove
	var elemId = doseElem.id;
	var doseId = elemId.split("Remove")[0];
	var doseIdParts = doseId.split("Dose");
	var immunIdStr = doseIdParts[0];
	var immunId = immunIdStr.split("vaccine")[1];

	//remove the dose from the DOM
	var doseToRemove = document.getElementById(doseId);
	doseToRemove.parentNode.removeChild(doseToRemove);

	//remove the dose from the this.m_immunValidationObj, probs remove this when Abhijits function works
	var validationObjLen = this.m_immunValidationObj.length;
	var matchingVaccine = null;
	for (var i = 0; i < validationObjLen; i++) {
		if (this.m_immunValidationObj[i].VACCINE_EVENT_CODE === immunId) {
			//go through the doses and remove the matching one
			matchingVaccine = this.m_immunValidationObj[i];
			break;
		}
	}

	//Call the toggler for both dose pieces in the modal pane to indicate the completeness status
	this.toggleValidationDoseItem(doseId, "SOURCE", 0);
	this.toggleValidationDoseItem(doseId, "ADMIN_DATE", 0);
	var doseLen = matchingVaccine.DOSES.length;
	for (var j = 0; j < doseLen; j++) {
		if (matchingVaccine.DOSES[j].DOSE_ID === doseId) {
			//remove matching dose from list
			matchingVaccine.DOSES.splice(j, 1);
			break;
		}
	}

	//Call the toggler for the vaccine in the modal pane to indicate the completeness status
	this.toggleModalVaccineStatus(matchingVaccine);
	
	//Call a function to check if the removed dose was a combo
	this.checkIfDoseIsCombo(doseId);
	
	//remove parent dose ids date collector
	this.removeDateFromDateCollector(doseId);
};

/**
 * This function is called when a dose has been deleted to check if that dose
 * was a combo parent (which means its children combos need to be updated). If
 * it was a combo parent, it calls several other functions to clean up the children.
 * @param {string} doseId The id of the dose that was removed
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.checkIfDoseIsCombo = function(doseId) {
	//check if the removed dose id is a combo parent dose
	var parentDetails = this.checkForComboParentDetails(doseId);
	
	if (parentDetails) {
		//remove alert banner
		this.removeECWarningBanner(parentDetails);
		
		//remove product helper text
		this.removeProductSatisfyNote(parentDetails);
		
		//id found in list, send id to other function to find and
		//remove all child read-only boxes
		this.updateChildCombos(parentDetails);
		
		//remove parent dose id object
		this.removeParentDetails(doseId);
		
		this.m_immunSatisfied = [];
	}
};

/**
 * This function finds the child combos that match the passed in parent combo. The
 * read-only boxes are removed from the children. If that was the last read-only box
 * and no normal dose was ever added, it will remove the child vaccine from the
 * vaccine navigator pane and clean up combo child details.
 * @param {Object} parentDetails The details for the relevant parent combo dose
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.updateChildCombos = function(parentDetails) {
	//loop through immun list left modal to find the matching parent id and
	//remove those doses
	var listLeftLen = this.m_immunListLeftModal.length;
	var indicesToSplice = [];
	var parentDoseId = parentDetails.PARENT_DOSE_ID;
	var isChartExceptionModal = this.m_immunizationModalType === this.ImmunizationsModalEnum.CHART_EXCEPTION;
	
	for (var i = 0; i < listLeftLen; i++) {
		var currListLeftItem = this.m_immunListLeftModal[i];
		var comboListLen = currListLeftItem.COMBO_PARENTS.length;
		var comboIndicesToSplice = [];
		
		if (comboListLen) {
			//check if combo dose id, matches given parent
			for (var j = 0; j < comboListLen; j++) {
				if (currListLeftItem.COMBO_PARENTS[j].COMBO_DOSE_ID === parentDoseId) {
					//save off the current combo index to splice later
					comboIndicesToSplice.push(j);
					
					//remove read-only box if it has been shown
					//if will appear as "vaccine3087519458ComboTovaccine3087519460Dose1"
					var readOnlyDoseBoxId = "vaccine" + currListLeftItem.CODE_VALUE + "ComboTo" + parentDoseId;
					this.removeReadOnlyDoseBox(readOnlyDoseBoxId);
				}
			}
			
			if (comboIndicesToSplice.length) {
				//remove all unnecessary combos from comboList now that loop is complete
				var comboIndiciesLen = comboIndicesToSplice.length;
				for (var k = comboIndiciesLen - 1; k >= 0; k--) {
					currListLeftItem.COMBO_PARENTS.splice(comboIndicesToSplice[k], 1);
				}
				
				comboListLen = currListLeftItem.COMBO_PARENTS.length;
				
				//if combos now empty and added as combo is set to 1, 
				//vaccine need to be removed from navigator
				if (comboListLen === 0 && currListLeftItem.ADDED_AS_COMBO) {
					//item needs to be removed from navigator
					this.removeChildDosePane("immunVaccineEventDetails" + currListLeftItem.CODE_VALUE);
					
					this.removeComboFromLoadedVaccines("immunVaccineEventDetails" + currListLeftItem.CODE_VALUE);
					
					this.removeComboFromValidationObj(currListLeftItem.CODE_VALUE);
					
					this.removeElemFromNavigator("vaccine" + currListLeftItem.CODE_VALUE);
					
					this.updateVaccineToggle(currListLeftItem.CODE_VALUE);
					
					this.updatePopupItems([ { VACCINE_GROUP_CD: currListLeftItem.CODE_VALUE } ], 0);
					
					indicesToSplice.push(i);
				}	
			}
		}
	}
	
	//remove all unnecessary items from immunListLeftModal now that loop is complete
	var indiciesLen = indicesToSplice.length;
	for (var m = indiciesLen - 1; m >= 0; m--) {
		this.m_immunListLeftModal.splice(indicesToSplice[m], 1);
	}
};

/**
 * This function removes the matching parent details from the member level variable
 * that matches the passed in parent dose id.
 * @param {string} parentDoseId The parent dose id
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.removeParentDetails = function(parentDoseId) {
	var parentDosesLen = this.m_comboParentDetails.length;
	
	for (var i = 0; i < parentDosesLen; i++) {
		if (this.m_comboParentDetails[i].PARENT_DOSE_ID == parentDoseId) {
			this.m_comboParentDetails.splice(i, 1);
			break;
		}
	}
};

/**
 * This function removes the read only dose box that a child combo displayed.
 * @param {string} readOnlyDoseBoxId The id of the read only dose box
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.removeReadOnlyDoseBox = function(readOnlyDoseBoxId) {
	var readOnlyBoxObj = $("#" + readOnlyDoseBoxId);

	if (readOnlyBoxObj.length) {
		readOnlyBoxObj.remove();
	}
};

/**
 * This function removes the entire dose pane for a given child vaccine.
 * @param {string} childDosePaneId The id of the child dose pane
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.removeChildDosePane = function(childDosePaneId) {
	var childDosePaneObj = $("#" + childDosePaneId);

	if (childDosePaneObj.length) {
		childDosePaneObj.remove();
	}
};

/**
 * This function removes the child vaccine from the list of loaded vaccines, so it will no longer
 * be shown in the vaccine navigator pane.
 * @param {string} loadedVaccinesId The id of the child vaccine stored in the variable
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.removeComboFromLoadedVaccines = function(loadedVaccinesId) {
	var loadedIndex = this.m_loadedVaccinesInModal.indexOf(loadedVaccinesId);
	
	if (loadedIndex > -1) {
		this.m_loadedVaccinesInModal.splice(loadedIndex, 1);
	}
};

/**
 * This function removes the child vaccine from the list of validation objects.
 * @param {number} vaccineCode The event code of the child vaccine
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.removeComboFromValidationObj = function(vaccineCode) {
	var validLen = this.m_immunValidationObj.length;
	
	for (var i = 0; i < validLen; i++) {
		//compare CODE_VALUE (num) with VACCINE_EVENT_CODE (str)
		if (vaccineCode == this.m_immunValidationObj[i].VACCINE_EVENT_CODE) {
			this.m_immunValidationObj.splice(i, 1);
			break;
		}
	}
	
};

/**
 * This function removes the child vaccine element from the vaccine navigator pane.
 * @param {string} spanId The id of the vaccine element
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.removeElemFromNavigator = function(spanId) {
	var spanElem = $("#" + spanId);
	
	if (spanElem.length) {
		spanElem.next("div").remove();
		spanElem.remove();
	}
};

/**
 * This function removes the child vaccine details from the toggle list variable.
 * @param {number} vaccineCode The event code of the child vaccine
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.updateVaccineToggle = function(vaccineCode) {
	var toggleListLen = this.m_vaccineModalToggleList.length;
	
	for (var i = 0; i < toggleListLen; i++) {
		if (this.m_vaccineModalToggleList[i].VACCINE_EVENT_CODE == vaccineCode) {
			this.m_vaccineModalToggleList.splice(i, 1);
			break;
		}
	}
};

/**
 * This function removes the parent dose admin date object from the admin date collection.
 * @param {string} uniquePrefix The vaccine dose id of the parent combo
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.removeDateFromDateCollector = function(uniquePrefix) {
	var admincollectionLen = this.m_adminDateSelectorCollection.length;
	for (var i = 0; i < admincollectionLen; i++) {
		if (this.m_adminDateSelectorCollection[i].m_uniqueId === "adminDateControl" + uniquePrefix + this.compID) {
			this.m_adminDateSelectorCollection.splice(i, 1);
			break;
		}
	}
};

/**
 * Callback function which handles the event triggered when the source drop down value corresponding to a
 * specific dose is added
 * @param {Object} event Click event information which triggered the firing of the callback
 * @param {Object} reply Unique Id which signifies which dose's source drop down was triggered
 * @returns {undefined} Returns nothing
 */
ImmunizationsO2Component.prototype.satisfyCB = function(event, reply) {
	if (reply) {
		//We are doing this since the Unique ID sent from the Event Listener on clicking an source item from drop down will have "Source" appended to it
		var doseId = reply.replace("Source", "");
		this.toggleValidationDoseItem(doseId, "SOURCE", 1);
	}
};

/**
 * Callback function which handles the event triggered when the source drop down value corresponding to a
 * specific dose is removed
 * @param {Object} event Click event information which triggered the firing of the callback
 * @param {Object} reply Unique Id which signifies which dose's source drop down was triggered
 * @returns {undefined} Returns nothing
 */
ImmunizationsO2Component.prototype.unSatisfyCB = function(event, reply) {
	if (reply) {
		var doseId = reply.replace("Source", "");
		this.toggleValidationDoseItem(doseId, "SOURCE", 0);
	}
};

/**
 * Register listeners for each dose created for each vaccine in the Doc Hx Modal,
 * once an event occurs in the Source and Admin date fields we can capture it and process accordingly
 * @returns {undefined} No return object
 */
ImmunizationsO2Component.prototype.registerDoseValidatorListeners = function() {
	//Remove listeners before adding a new one for satisfy and unsatisfy events
	CERN_EventListener.removeListener({}, "docHxModalDoseSatisfy" + this.compID, this.satisfyCB, this);
	CERN_EventListener.addListener({}, "docHxModalDoseSatisfy" + this.compID, this.satisfyCB, this);

	CERN_EventListener.removeListener({}, "docHxModalDoseUnSatisfy" + this.compID, this.unSatisfyCB, this);
	CERN_EventListener.addListener({}, "docHxModalDoseUnSatisfy" + this.compID, this.unSatisfyCB, this);
};

/**
 * Toggles the dose satisfying flag. If the individual fields are successfully entered then this function will toggle the Dose status to Satisfied
 * This can be used to monitor the satisfiability of the entire vaccine.
 *
 * @param {String} doseId Id of the Dose belonging to a vaccine into which a data entry was made
 * @param {String} fieldID Denotes the field that was modified - either Status or Admin_date
 * @param {Number} isSatisfied Flag - 0 or 1 indicating whether the data in the field was entered successfully or removed
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.toggleValidationDoseItem = function(doseId, fieldID, isSatisfied) {
	/**
	 * @param {Array} arrayList List of all the vaccines and their corresponding doses addded in the modal
	 * @param {String} uniqueDoseId Id of the Dose belonging to a vaccine into which a data entry was made
	 * @returns {Number/String} Index of the dose found, if no dose is found then returns -1
	 */
	var trackDownDose = function(arrayList, uniqueDoseId) {
		var arrayLen = arrayList.length;
		var j = 0;
		var i = 0;
		if (arrayLen && uniqueDoseId) {
			var tempDoseArr = [];
			var doseArrCount = 0;
			for (i = 0; i < arrayLen; i++) {
				tempDoseArr = arrayList[i].DOSES;
				doseArrCount = tempDoseArr.length;
				for (j = 0; j < doseArrCount; j++) {
					if (uniqueDoseId === tempDoseArr[j].DOSE_ID) {
						return i + "&" + j;
					}
				}
			}
		}
		return -1;
	};

	try {
		if (doseId && fieldID) {
			var doseIndexStr = trackDownDose(this.m_immunValidationObj, doseId);
			var vaccineIndex = -1;
			var doseIndex = -1;
			var tempArr = "";
			var currentHappyFlag = -1;

			if (doseIndexStr && doseIndexStr !== -1) {
				tempArr = doseIndexStr.split("&");
				vaccineIndex = parseInt(tempArr[0], 10);
				doseIndex = parseInt(tempArr[1], 10);
			}

			if (this.m_immunValidationObj[vaccineIndex]) {
				var doseObj = this.m_immunValidationObj[vaccineIndex].DOSES[doseIndex];
				if (doseObj) {
					if (fieldID === "SOURCE") {
						if (isSatisfied) {
							doseObj.SOURCE_CD = 1;
						}
						else {
							doseObj.SOURCE_CD = 0;
						}
					}
					else if (fieldID === "ADMIN_DATE") {
						if (isSatisfied) {
							doseObj.ADMIN_DATE = 1;
						}
						else {
							doseObj.ADMIN_DATE = 0;
						}
					}
					//Perform AND on both the required fields to get the dose satisfying status
					currentHappyFlag = doseObj.ALL_FIELDS_HAPPY;
					doseObj.ALL_FIELDS_HAPPY = doseObj.ADMIN_DATE && doseObj.SOURCE_CD;

					//when change on all_fields_happy for a dose, adjust the count on the document button
					if (currentHappyFlag !== doseObj.ALL_FIELDS_HAPPY) {
						//Toggle the vaccine after a change in the input params - Source or Admin Date
						this.toggleModalVaccineStatus(this.m_immunValidationObj[vaccineIndex]);
						//Adjust the button count with the dose happy field
						this.adjustDocumentButtonCount(doseObj.ALL_FIELDS_HAPPY);
					}
				}
			}
		}
		else {
			throw new Error("One or more of the input param are not passed, toggleValidationDoseItem()");
		}
	}
	catch (err) {
		logger.logJSError(err, this, "immun-doc-hx-modal.js", "toggleValidationDoseItem");
	}
};
/**
 * This function will adjust the count displayed on the Document button
 * within the Doc Hx Modal. This count reflects the current number of
 * doses that have all their required fields filled in and are
 * therefore ready to be documented and saved to the database. The document
 * button shall be enabled any time the count is above 0, otherwise its disabled.
 * @param {number} doseHappy A flag to say whether all the required fields are completed
 * for the passed in dose id (1 true, 0 false)
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.adjustDocumentButtonCount = function(doseHappy) {
	
	var docHistoryModal = null;
	var label = "";

	if (this.m_immunizationModalType === this.ImmunizationsModalEnum.CHART_EXCEPTION) {
		label = this.m_immuni18n.CHART;
		docHistoryModal = MP_ModalDialog.retrieveModalDialogObject("chartImmunizationExceptionModal");
	}
	else {
		label = this.m_immuni18n.DOCUMENT;
		docHistoryModal = MP_ModalDialog.retrieveModalDialogObject("documentImmunizationHistoryModal");
	}
	
	var previousCount = this.m_docBtnCount;
	var setBtnDither = null;
	//if a 1 is passed, increase the count
	if (doseHappy === 1) {
		this.m_docBtnCount++;
	}
	else {
		//else, decrease the count
		this.m_docBtnCount--;
	}
	docHistoryModal.setFooterButtonText("immDocumentBtn" + this.compID, label + " (" + this.m_docBtnCount + ")");
	//determine if the button dither needs to be changed
	if ((previousCount === 0) && (this.m_docBtnCount === 1)) {
		//button should no longer be dithered
		setBtnDither = false;
	}
	else if ((previousCount === 1) && (this.m_docBtnCount === 0)) {
		//button should now be dithered
		setBtnDither = true;
	}
	if (setBtnDither !== null) {
		docHistoryModal.setFooterButtonDither("immDocumentBtn" + this.compID, setBtnDither);
	}
};

/**
 * Based on the status of each dose we toggle the vaccine dose,
 * All doses are removed - The vaccine status goes to NULL - No indicator
 * All doses are Satisfy - The vaccine status goes to 1 - Checkmark
 * Some doses dont Satisfy - The vaccine status goes to 0 - Asterisk
 *
 * @param {Object} vaccineObj Vaccine object containing the vaccine information and the doses information for that vaccine
 * @returns {undefined} No return object
 */
ImmunizationsO2Component.prototype.toggleModalVaccineStatus = function(vaccineObj) {
	try {
		var i = 0;
		var self = this;

		/**
		 * Gets the index of the vaccine in question from the array m_vaccineModalToggleList, which is a list of all the vaccines
		 * added and each of their status
		 *
		 * @param {String} vaccineId Unique Id of the vaccine used to get the index
		 * @returns {number} Index of the vaccine in the Array - m_vaccineModalToggleList
		 */
		var getVaccineModalToggleListIndex = function(vaccineId) {
			var j = 0;
			var vaccineListLen = self.m_vaccineModalToggleList.length;
			if (vaccineId) {
				for (j = 0; j < vaccineListLen; j++) {
					if (vaccineId === self.m_vaccineModalToggleList[j].VACCINE_EVENT_CODE) {
						return j;
					}
				}
			}
			return -1;
		};

		if (vaccineObj) {
			var vaccineToggleIndex = getVaccineModalToggleListIndex(vaccineObj.VACCINE_EVENT_CODE);
			var isExceptionModalType = (self.m_immunizationModalType === self.ImmunizationsModalEnum.CHART_EXCEPTION);
			var getVaccineIconElem = "";
			var vaccineObjEventsLen = isExceptionModalType ? vaccineObj.EXCEPTIONS.length : vaccineObj.DOSES.length;
			
			if (vaccineToggleIndex > -1) {
				getVaccineIconElem = $("#vaccine" + this.m_vaccineModalToggleList[vaccineToggleIndex].VACCINE_EVENT_CODE)[0];

				if (vaccineObjEventsLen === 0) {
					//Removed all doses case
					this.m_vaccineModalToggleList[vaccineToggleIndex].IS_SATISFIED = -1;
					$(getVaccineIconElem).removeClass();
					$(getVaccineIconElem).empty();
				}
				else {
					for (i = 0; i < vaccineObjEventsLen; i++) {
						if ((isExceptionModalType && vaccineObj.EXCEPTIONS[i].ALL_FIELDS_HAPPY === 0) || ( !isExceptionModalType && vaccineObj.DOSES[i].ALL_FIELDS_HAPPY === 0)) {
							this.m_vaccineModalToggleList[vaccineToggleIndex].IS_SATISFIED = 0;
							$(getVaccineIconElem).removeClass();
							$(getVaccineIconElem).addClass("immun-o2-hx-modal-vaccine-unsatisfy selected");
							$(getVaccineIconElem).html("*");
							break;
						}
						else {
							this.m_vaccineModalToggleList[vaccineToggleIndex].IS_SATISFIED = 1;
							$(getVaccineIconElem).removeClass();
							$(getVaccineIconElem).addClass("immun-o2-hx-modal-vaccine-satisfy selected");
							$(getVaccineIconElem).empty();
						}
					}
				}
			}
		}
	}
	catch (err) {
		logger.logJSError(err, this, "immun-doc-hx-modal.js", "toggleModalVaccineStatus");
	}
};

/**
 * Retrieves vaccine event codes when a single/set of vaccines is selected from the pop up in the document
 * hx modal. Vaccines are retrieved from the service transaction 966901 only when the shared resource doesnt
 * have the event codes stored. Once the call is made to the service, on success we save it to the SR. The reply consists
 * of group codes, product values and event codes along with respective VIS related information
 * @param {Array<float>}uniqueVaccineArray List of vaccine group codes
 * @param {Function}vaccineLoadCB Callback function that needs to be called after retrieval of event codes for displaying it in the modal
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.retrieveVaccineEventCodes = function(uniqueVaccineArray, vaccineLoadCB) {
	try {
		var requestObj = "";
		var eventCodeRequest = null;
		var self = this;
		var resourceName = null;
		var i = 0;
		var uniqueVaccineArrayLen = uniqueVaccineArray.length;
		var codeSetToken = null;
		var SRDataObj = null;
		var replyListLen = 0;

		this.replyList = [];

		if (uniqueVaccineArrayLen) {
			//Create a spinner
			if (self.m_immunizationModalType === self.ImmunizationsModalEnum.CHART_EXCEPTION) {
				MP_Util.LoadSpinner("vwpModalDialogchartImmunizationExceptionModal", 1, "eventCodeRequestSpinner");
			}
			else {
				MP_Util.LoadSpinner("vwpModalDialogdocumentImmunizationHistoryModal", 1, "eventCodeRequestSpinner");
			}

			for (i = 0; i < uniqueVaccineArrayLen; i++) {
				resourceName = "VACCINE_" + uniqueVaccineArray[i].VACCINE_GROUP_CD;
				codeSetToken = MP_Resources.getSharedResource(resourceName);
				if (codeSetToken && codeSetToken.isResourceAvailable()) {
					//Remove from the array list as the value can be retrieved from the SR
					uniqueVaccineArray.splice(i, 1);
					i--;
					uniqueVaccineArrayLen = uniqueVaccineArray.length;
					SRDataObj = codeSetToken.getResourceData();
					//Add into the reply list
					if (SRDataObj) {
						this.replyList.push(SRDataObj);
					} 
					else {
						self.m_retrievedItemCount--;
					}
				}
			}

			//Now that we have checked against the Shared resource there might be some vaccine info that
			// dont need to be retrieved, so calculating length again
			if (uniqueVaccineArrayLen) {
				requestObj = '{"REQUESTIN": {"VACCINE_GROUP_CODES": ' + MP_Util.enhancedStringify(uniqueVaccineArray) + '}}';

				eventCodeRequest = new ScriptRequest();
				eventCodeRequest.setProgramName("mp_exec_std_request");
				eventCodeRequest.setDataBlob(requestObj);

				// Application ID:600005, Task ID:3202004, Request ID:966901
				eventCodeRequest.setParameterArray([ "^MINE^", "^^", 600005, 3202004, 966901 ]);

				eventCodeRequest.setResponseHandler(function(reply) {
					var responseObj = reply.getResponse();
					var responseVaccineGrpObj = null;
					var responseLen = responseObj.VACCINE_GROUPS ? responseObj.VACCINE_GROUPS.length : 0;
					i = 0;

					resourceName = null;
					codeSetToken = null;

					//Prepare to push the values into the replyList
					if (self.replyList && self.replyList.length) {
						self.replyList = [];
					}

					//Put the values which were not there in the Shared resource into shared resource
					if (responseObj.STATUS_DATA.STATUS === "S" && responseLen) {

						//Stop RTMS USR Timer
						if (self.m_retrieveEventCodesTimer) {
							self.m_retrieveEventCodesTimer.stop();
						}

						if (self.vaccineSelectedItemsArr.length > responseLen) {
							//Ignored vaccines are traced from the master selected list of vaccines and then stored in theShared resource
							self.storeServiceDiscardedVaccine(self.vaccineSelectedItemsArr, responseObj.VACCINE_GROUPS);
						}
						for (i = 0; i < responseLen; i++) {
							responseVaccineGrpObj = responseObj.VACCINE_GROUPS[i];

							resourceName = "VACCINE_" + responseVaccineGrpObj.VACCINE_GROUP_CODE.CODE_VALUE;
							codeSetToken = new SharedResource(resourceName);
							if (codeSetToken) {
								codeSetToken.setResourceData(responseVaccineGrpObj);
								codeSetToken.setIsAvailable(true);
								MP_Resources.addSharedResource(resourceName, codeSetToken);

								self.replyList.push(responseVaccineGrpObj);
							}
						}
						if (vaccineLoadCB) {
							vaccineLoadCB(self.replyList);
						}
					}
					else if (reply.getResponse().STATUS_DATA.STATUS === "Z") {
						//Do the same thing with all the vaccines that werent returned and store the ignored list to blur the popup items
						self.storeServiceDiscardedVaccine(self.vaccineSelectedItemsArr, []);

						//Stop RTMS USR Timer
						if (self.m_retrieveEventCodesTimer) {
							self.m_retrieveEventCodesTimer.stop();
						}
					}
					else {
						var errorElem = $("#immunModalVaccineEventPane" + self.compID);
						if (errorElem.length) {
							errorElem.html(self.createAlertBannerHTML(i18n.ERROR_RETREIVING_DATA));
						}

						//Fail the timer since an error has occured and no request has been served
						if (self.m_retrieveEventCodesTimer) {
							self.m_retrieveEventCodesTimer.fail();
							self.m_retrieveEventCodesTimer = null;
						}
					}

					//Remove Spinner
					$("#eventCodeRequestSpinner").remove();
				});

				//Request for only the vaccines which are not in shared resource
				eventCodeRequest.performRequest();
			}
			else{
				//All the values are already taken from Shared Resource
				//Remove Spinner
				$("#eventCodeRequestSpinner").remove();
			}
			//This would load the navigator pane with all the vaccines that were fetched from the shared resource
			// once the async function gets the values from any non SR vaccines then the call is again made to
			// the callback function which would load the other vaccines retrieved
			replyListLen = this.replyList.length;

			if (vaccineLoadCB && replyListLen) {
				vaccineLoadCB(this.replyList);
			}
			//If all the selected vaccines are taken from Shared resource
			// and they are all invalid then we need to remove the spinner
			if (uniqueVaccineArrayLen === replyListLen && replyListLen === 0) {
				$("#eventCodeRequestSpinner").remove();
			}
		}
	} 
	catch (err) {
		logger.logJSError(err, this, "immun-doc-hx-modal.js", "retrieveVaccineEventCodes");
	}
};

/**
 * Stores the vaccines that arent built in the domain into Shared Resource so that next time the values are not queried for
 * as we already know that they dont exist
 *
 * @param {Array} modalSelectedVaccineList List of vaccines selected from the popup in navigator pane
 * @param {Array} serviceReturnedVaccineList List of vaccines that the service 966901 returned
 * @returns {Array} ignoredVaccineList List of vaccines that were stored
 */
ImmunizationsO2Component.prototype.storeServiceDiscardedVaccine = function(modalSelectedVaccineList, serviceReturnedVaccineList) {
	try {
		var modalSelectedVaccineListLen = modalSelectedVaccineList.length;
		var serviceReturnedVaccineListLen = serviceReturnedVaccineList.length;
		var ignoredVaccineList = [];
		var ignoredVaccineListLen = 0;
		var i = 0;
		var j = 0;
		var resourceName = null;
		var codeSetToken = null;

		if (modalSelectedVaccineListLen && serviceReturnedVaccineListLen) {
			for (i = 0; i < modalSelectedVaccineListLen; i++) {
				var isPresent = false;
				for (j = 0; j < serviceReturnedVaccineListLen; j++) {
					if (modalSelectedVaccineList[i].VACCINE_GROUP_CD === serviceReturnedVaccineList[j].VACCINE_GROUP_CODE.CODE_VALUE) {
						isPresent = true;
						break;
					}
				}
				if (!isPresent) {
					ignoredVaccineList.push(modalSelectedVaccineList[i].VACCINE_GROUP_CD);
					isPresent = false;
				}
			}
		}
		else {
			//When the status returned is a "Z"
			for (i = 0; i < modalSelectedVaccineListLen; i++) {
				ignoredVaccineList.push(modalSelectedVaccineList[i].VACCINE_GROUP_CD);
			}
		}
		ignoredVaccineListLen = ignoredVaccineList.length;
		if (ignoredVaccineListLen) {
			for (i = 0; i < ignoredVaccineListLen; i++) {
				//Put the ignored vaccines in the SR so that they arent retrieved from the service everytime
				resourceName = "VACCINE_" + ignoredVaccineList[i];
				codeSetToken = new SharedResource(resourceName);
				if (codeSetToken) {
					//Store with null data
					codeSetToken.setResourceData(null);
					codeSetToken.setIsAvailable(true);
					MP_Resources.addSharedResource(resourceName, codeSetToken);
					this.m_retrievedItemCount--;
				}
			}
		}
		return ignoredVaccineList;
	} 
	catch (err) {
		logger.logJSError(err, this, "immun-doc-hx-modal.js", "storeServiceDiscardedVaccine");
	}
};

/**
 * Searches the property in question and returns the vaccine object accordingly
 *
 * @param {Object} tracerObj Base object containing all the properties
 * @param {String} uniqueID Property that needs to be searched in the object
 * @returns {Object} returns the parent vaccine object that has the property
 */
ImmunizationsO2Component.prototype.traceCurrentVaccineObj = function(tracerObj, uniqueID) {
	var immunVaccineObj = this.m_immunValidationObj;
	var immunVaccineObjLen = immunVaccineObj.length;
	var vaccineLevelSearch = tracerObj.indexOf("VACCINE");
	var i = 0;
	var j = 0;
	var itemFound = false;
	
	if (vaccineLevelSearch > -1) {
		//this is a vaccine level search, no need to search in the doses
		for (i = 0; i < immunVaccineObjLen; i++) {
			var currentVaccineItem = this.m_immunValidationObj[i];
			if (currentVaccineItem[tracerObj] && currentVaccineItem[tracerObj] === uniqueID) {
				itemFound = true;
				break;
			}
		}
	}
	else {
		//this is a dose level search
		for (i = 0; i < immunVaccineObjLen; i++) {
			var currentDosesItem = this.m_immunValidationObj[i].DOSES;
			var currentDosesItemLen = this.m_immunValidationObj[i].DOSES.length;
			
			for (j = 0; j < currentDosesItemLen; j++) {
				var currentDoseItem = currentDosesItem[j];
				if (currentDoseItem[tracerObj] && currentDoseItem[tracerObj] === uniqueID) {
					itemFound = true;
					break;
				}
			}
			if (itemFound) {
				break;
			}
		}
	}
	
	if (itemFound) {
		return immunVaccineObj[i];
	}
	else {
		return null;
	}
};


/**
 * This function separates given list of combo event codes into already loaded and non-loaded vaccines. The already loaded
 * ones are sent to a different function that removes them from the list. The non-loaded ones are then passed to a different
 * function which retrieves their information and loads them in the vaccine navigator pane.
 * @param {Array.<Object>} comboEventCodes An array of VACCINE_GROUP_CODES of the event code of the selected product 
 * @param {Object} comboParentDetails The details of the combo parent for the event codes passed in
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.comboProductSelected = function(comboEventCodes, comboParentDetails) {
	var self = this;
	this.m_immunSatisfied = [];
	var replyArr = [];
	var comboParentDoseId = comboParentDetails.PARENT_DOSE_ID;
	var comboParentDisplay = comboParentDetails.PARENT_DISPLAY;
	
	//separate already loaded vaccines from non-loaded ones
	var missingEventCodes = this.separateUnloadedVaccines(comboEventCodes, comboParentDetails);
	this.m_retrievedItemCount = missingEventCodes.length;
	
	//update the items added as combos in the popup to be dithered
	this.updatePopupItems(missingEventCodes, 1);
	
	/**
	 * This callback is called after either the vaccine info is obtained from the Shared Resource or
	 * through the call made using the Service transaction 966901
	 * @param {Object} reply Reply object which consists of the vaccine information and the event codes associated to that vaccine
	 * @returns {undefined} returns nothing
	 */
	var immunListLoadCB = function(reply) {
		var validVaccineItemsLen = 0;
		var immunListHTML = "";
		var modalListLen = 0;
		var remapVaccineIndicators = function() {
			var i = 0;
			var toggleListLen = self.m_vaccineModalToggleList.length;
			var getVaccineIconElem = "";
			var vaccineToggleListObj = null;
			try {
				if (toggleListLen) {
					for (i = 0; i < toggleListLen; i++) {
						vaccineToggleListObj = self.m_vaccineModalToggleList[i];
						getVaccineIconElem = $("#vaccine" + vaccineToggleListObj.VACCINE_EVENT_CODE);
						if (getVaccineIconElem.length) {
							switch (vaccineToggleListObj.IS_SATISFIED) {
								case -1:
									//This signifies that nothing was present as an indicator before adding a new vaccine
									$(getVaccineIconElem).removeClass("immun-o2-hx-modal-vaccine-unsatisfy");
									$(getVaccineIconElem).empty();
									break;
								case 1:
									//This signifies that the completeness was indicated as satisfied
									$(getVaccineIconElem).removeClass("immun-o2-hx-modal-vaccine-unsatisfy");
									$(getVaccineIconElem).addClass("immun-o2-hx-modal-vaccine-satisfy");
									$(getVaccineIconElem).empty();
									break;
								default:
									//Do nothing, since the state is already in unsatisfied and selected
									break;
							}
						}
					}
				}
			}
			catch (err) {
				logger.logJSError(err, this, "immun-doc-hx-modal.js", "remapVaccineIndicators");
			}
		};
		
		//Don't add anything to the navigator until all of the requested items have
		//been returned. Some items may have been requested already so they will come
		//back before the ones that have to query the backend
		var replyLen = reply.length;
		for (var j = 0; j < replyLen; j++) {
			replyArr.push(reply[j]);
		}
		
		//check if all the items have been returned
		if (self.m_retrievedItemCount !== replyArr.length) {
			return;
		}
		
		if (replyArr) {
			reply = replyArr;
			validVaccineItemsLen = reply.length;

			for (var i = 0; i < validVaccineItemsLen; i++) {
				//add a flag to object so we know later on that this was 
				//added as a combo match and not from the popup
				//creating a copy of the object here, so I do not change the shared resource
				var copyReplyObj = {};
				var comboObj = {};
				copyReplyObj.CODE_VALUE = reply[i].VACCINE_GROUP_CODE.CODE_VALUE;
				copyReplyObj.DEFINITION = reply[i].VACCINE_GROUP_CODE.DEFINITION;
				copyReplyObj.DESCRIPTION = reply[i].VACCINE_GROUP_CODE.DESCRIPTION;
				copyReplyObj.DISPLAY = reply[i].VACCINE_GROUP_CODE.DISPLAY;
				copyReplyObj.MEANING = reply[i].VACCINE_GROUP_CODE.MEANING;
				copyReplyObj.ADDED_AS_COMBO = 1;
				
				comboObj.COMBO_DOSE_ID = comboParentDoseId;
				comboObj.COMBO_PARENT_DISPLAY = comboParentDisplay;
				copyReplyObj.COMBO_PARENTS = [ comboObj ];
				
				self.m_immunListLeftModal.push(copyReplyObj);
				self.m_immunSatisfied.push(reply[i].VACCINE_GROUP_CODE.DISPLAY);
			}

			modalListLen = self.m_immunListLeftModal.length;

			//alpha sort
			self.m_immunListLeftModal.sort(self.alphaSortImmun);
			
			//get already selected code value
			var selectedCode = self.m_lastSelectedImmun[1].getAttribute("data-code");

			//build new html
			for (i = 0; i < modalListLen; i++) {
				//if the vaccine was added as a combo, do not show an asterisk or completeness class
				var selected = "";
				var completenessIndClass = "immun-o2-hx-modal-vaccine-unsatisfy";
				var asteriskOrNot = "*";
				var currCodeValue = self.m_immunListLeftModal[i].CODE_VALUE;
				var currVaccineIsCombo = self.m_immunListLeftModal[i].ADDED_AS_COMBO;
				
				if (currCodeValue == selectedCode) {
					selected = " selected";
				}
				
				if (currVaccineIsCombo) {
					completenessIndClass = "";
					asteriskOrNot = "";
				}
				
				immunListHTML += "<span class='" + completenessIndClass + selected + "' id='vaccine" + currCodeValue + "'>" + asteriskOrNot + "</span><div class='immun-o2-modal-left-item" + selected + "' data-display='" + self.m_immunListLeftModal[i].DISPLAY + "' data-code='" + currCodeValue + "'>" + self.m_immunListLeftModal[i].DISPLAY + "</div>";
			}

			//Replace whats in object html with new html
			self.m_modalImmunListCont.html(immunListHTML);

			//Remap the indicators of completeness
			remapVaccineIndicators();
			
			//if default event code is a combo, add warning banner to parent
			if (comboParentDetails.DEFAULT_EC_IS_COMBO) {
				self.addECWarningBanner(comboParentDetails);
			}
			else if(self.m_immunizationModalType !== self.ImmunizationsModalEnum.CHART_EXCEPTION)  {				
				//add product note to parent dose details box
				self.addProductSatisfyNote(comboParentDetails);
			}

			//Remove spinner
			if (self.m_immunizationModalType === self.ImmunizationsModalEnum.CHART_EXCEPTION) {
				$("#vwpModalDialogchartImmunizationExceptionModal").find('.loading-screen').remove();
			}
			else {				
				$("#vwpModalDialogdocumentImmunizationHistoryModal").find('.loading-screen').remove();	
			}					

			//add click event to each immun showing in vaccine navigator pane
			$(".immun-o2-modal-left-item").on("click", function() {
				//if already selected, ignore
				if (self === self.m_lastSelectedImmun) {
					return;
				}

				//otherwise change details and selection
				var selectedImmunElem = [];
				selectedImmunElem.push($(this).prev()[0], this);

				self.changeImmunSelection(selectedImmunElem);
				self.checkValidationObj(selectedImmunElem);
			});
			
			//reset last selected immun so its pointing to the new DOM object
			self.m_lastSelectedImmun = self.m_modalImmunListCont.children(".selected");
		}
	};
	
	//pass combo vaccines to function that handles shared resource
	if (missingEventCodes.length) {
		this.vaccineSelectedItemsArr = missingEventCodes;
		this.retrieveVaccineEventCodes(missingEventCodes, immunListLoadCB);
	}
	//if default event code is a combo, add warning banner to parent
	else if (comboParentDetails.DEFAULT_EC_IS_COMBO) {
		this.addECWarningBanner(comboParentDetails);
	}
	else if(self.m_immunizationModalType !== self.ImmunizationsModalEnum.CHART_EXCEPTION) {
		//add product note to parent dose details box
		this.addProductSatisfyNote(comboParentDetails);
	}
};

/**
 * This function takes a list of vaccine codes and removes the ones that are already loaded in the vaccine
 * navigator pane. It also adds important details to those vaccines so they are marked as combo vaccines.
 * @param {Array.<Object>} unloadedVaccines An array of VACCINE_GROUP_CODES of the event code of the selected product 
 * @param {Object} comboParentDetails The details of the combo parent for the unloaded vaccines
 * @returns {Array.<Object>} unloadedVaccines The vaccines that need to have their info retrieved
 */
ImmunizationsO2Component.prototype.separateUnloadedVaccines = function(unloadedVaccines, comboParentDetails) {
	var unloadedLen = unloadedVaccines.length;
	var listLeftLen = this.m_immunListLeftModal.length;
	var vaccToSplice = [];
	var comboParentDoseId = comboParentDetails.PARENT_DOSE_ID;
	var comboParentDisplay = comboParentDetails.PARENT_DISPLAY;
	
	//Add combo_dose_id and combo_parent_display to immunListLeftModal for each existing vaccine found
	for (var i = 0; i < unloadedLen; i++) {
		for (var j = 0; j < listLeftLen; j++) {
			if (unloadedVaccines[i].VACCINE_GROUP_CD === this.m_immunListLeftModal[j].CODE_VALUE) {
				//found matching vaccine from left list
				var comboList = this.m_immunListLeftModal[j].COMBO_PARENTS;
				var comboObj = {};
				
				comboObj.COMBO_DOSE_ID = comboParentDoseId;
				comboObj.COMBO_PARENT_DISPLAY = comboParentDisplay;
				comboList.push(comboObj);
				
				this.m_immunSatisfied.push(this.m_immunListLeftModal[j].DISPLAY);
				vaccToSplice.push(i);
				break;
			}
		}
	}
	
	//splice off found vaccines
	var foundCount = vaccToSplice.length;
	for (var m = foundCount - 1; m >= 0; m--) {
		unloadedVaccines.splice(vaccToSplice[m], 1);
	}
	
	//this now contains the vaccines that need to have their info retrieved
	return unloadedVaccines;
};

/**
 * This function takes an array of objects containing event codes and whether they need
 * to be dithered or undithered. This function is needed to update the items in the popup
 * if they should be allowed to be selected or not. When vaccines are added due to a combo
 * selection, those vaccines should be dithered in the popup so they cannot be selected again.
 * If that combo parent is removed or changed, those items need to be made available for selection again.
 * @param {array} comboEventCodes An array of objects containing event codes
 * @param {number} makeDithered A flag to indicate if the items need to be ditehred (1) or undithered (0)
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.updatePopupItems = function(comboEventCodes, makeDithered) {
	var comboListLen = comboEventCodes.length;
	var popupItem = null;
	var groupCd = 0;
	var popupObj = $(this.m_popupListObj);
	var uniqueFlag = "false";
	
	if (!makeDithered) {
		uniqueFlag = "true";
	}
	
	for (var i = 0; i < comboListLen; i++) {
		groupCd = comboEventCodes[i].VACCINE_GROUP_CD;
		popupItem = popupObj.children(".immun-o2-popup-body").find("[data-group-code~='" + groupCd + "']");
		popupItem.attr("data-group-unique", uniqueFlag);
		
		if (makeDithered) {
			popupItem.addClass("selected");
		}
		else {
			popupItem.removeClass("selected");
			popupItem.removeClass("dithered");
		}
	}
	
	this.m_popupListHTML = popupObj.html();
};

/**
 * This function adds helper text under the combo parent product selection dropdown
 * when a combo product is selected. The text lets the user know that this product
 * will satisfy multiple vaccines and which vaccines are satisfied.
 * @param {Object} comboParentDetails The details for the combo parent
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.addProductSatisfyNote = function(comboParentDetails) {
	var productElemId = "productContainer" + comboParentDetails.PARENT_DOSE_ID + this.compID;
	var productElemObj = $("#" + productElemId);
	
	if (!productElemObj.length) {
		logger.logError("Parent combo product container not found");
		return;
	}
	
	var productSatisElemId = "prodSatisNote" + comboParentDetails.PARENT_DOSE_ID;
	var productSatisElemObj = $("#" + productSatisElemId);
	
	if (!comboParentDetails.SATIS_DISPLAY) {
		this.populateSatisfiedVaccines(comboParentDetails);
	}
	
	var satisText = this.m_immuni18n.VACCINE_SATIS + " " + comboParentDetails.SATIS_DISPLAY;
	
	//if product already has satisfied note, just update its html
	if (productSatisElemObj.length) {
		productSatisElemObj.html(satisText);
	}
	else {
		var prodNoteHTML = "<div id='prodSatisNote" + comboParentDetails.PARENT_DOSE_ID + "' class='disabled'>" + satisText + "</div>";
		
		productElemObj.append(prodNoteHTML);
	}
};

/**
 * This function removes the helper text under a product dropdown for the passed in combo parent.
 * @param {Object} comboParentDetails The details for the combo parent
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.removeProductSatisfyNote = function(comboParentDetails) {
	var productSatisElemId = "prodSatisNote" + comboParentDetails.PARENT_DOSE_ID;
	var productSatisElemObj = $("#" + productSatisElemId);
	
	if (productSatisElemObj.length) {
		productSatisElemObj.remove();
	}
};

/**
 * This function builds a string for the vaccines that are satisfied by the passed
 * in combo parent. This string is used in the alert banner and product selection
 * helper text.
 * @param {Object} comboParentDetails The details for the combo parent
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.populateSatisfiedVaccines = function(comboParentDetails) {
	//sort displays of satisfied vaccines
	this.m_immunSatisfied.sort();
	
	//join the vaccines into a comma separated string
	var satisVaccineDisplays = this.m_immunSatisfied.join(", ");
	
	//set the satis_display variable for the passed in parent details
	comboParentDetails.SATIS_DISPLAY = satisVaccineDisplays;
};

/**
 * This function checks for matching combo parent details for the passed in dose id.
 * If a match is found, it is returned, otherwise null is returned.
 * @param {string} comboParentDoseId The dose id of the combo parent to search for
 * @returns {Object} Returns the matching combo parent details or null
 */
ImmunizationsO2Component.prototype.checkForComboParentDetails = function(comboParentDoseId) {
	var detailLen = this.m_comboParentDetails.length;
	for (var i = 0; i < detailLen; i++) {
		if (this.m_comboParentDetails[i].PARENT_DOSE_ID == comboParentDoseId) {
			return this.m_comboParentDetails[i];
		}
	}
	
	return null;
};

/**
 * This function adds an alert banner to the combo parent dose details box. The alert
 * lets the user know that a combo event code was automatically selected and if they
 * keep that selection, it will document for multiple vaccines.
 * @param {Object} comboParentDetails The details for the combo parent
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.addECWarningBanner = function(comboParentDetails) {
	//add banner under close icon named "vaccine3087519460Dose1Remove"
	if (!comboParentDetails.SATIS_DISPLAY) {
		this.populateSatisfiedVaccines(comboParentDetails);
	}
	
	var bannerHTML = "";
	var banner = new MPageUI.AlertBanner();
	banner.setType(MPageUI.ALERT_OPTIONS.TYPE.WARNING);
	banner.setPrimaryText(this.m_immuni18n.VACCINE_DOC + " " + comboParentDetails.SATIS_DISPLAY + ".");
	banner.setSecondaryText(this.m_immuni18n.CONTACT_HELP);
	bannerHTML = banner.render();
	
	if (this.m_immunizationModalType === this.ImmunizationsModalEnum.CHART_EXCEPTION) {
	        // Splitting before exception since we currently only support charting a single exception for a given vaccine group so the removal is not within the entry
	        var exceptionContainer = $("#" + comboParentDetails.PARENT_DOSE_ID);
	        if (exceptionContainer.length) {
	            exceptionContainer.prepend("<div id='" + comboParentDetails.PARENT_DOSE_ID + "WarningBanner'>" + bannerHTML + "</div>");
	        }        
    	}
    	else {
	        var removeIconObj = $("#" + comboParentDetails.PARENT_DOSE_ID + "Remove");
        
	        if (removeIconObj.length) {
	            removeIconObj.after("<div id='" + comboParentDetails.PARENT_DOSE_ID + "WarningBanner'>" + bannerHTML + "</div>");
	        }
	}
};

/**
 * This function removes the alert banner that was displayed in a combo parent dose
 * details box. This will be done anytime a product is selected.
 * @param {Object} comboParentDetails The details for the combo parent
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.removeECWarningBanner = function(comboParentDetails) {
	var warningBannerObj = $("#" + comboParentDetails.PARENT_DOSE_ID + "WarningBanner");
	
	if (warningBannerObj.length) {
		warningBannerObj.remove();
	}
};
/**
 * This function creates and shows the chart exception modal and
 * then calls a function to populate it
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.createChartExceptionModal = function() {
	var chartExceptionModal = MP_ModalDialog.retrieveModalDialogObject("chartImmunizationExceptionModal");
	var self = this;

	if (self.m_immunExceptionCodeValues === null) {
		self.m_immunExceptionCodeValues = {};
		// Callback function for rendering source selector
		var exceptionCodeValuesCallback = function(codeSetReply) {
			if (codeSetReply) {
				//Display source in alphabetical order
				codeSetReply.sort(self.SortByDisplay);
				var codeSetReplyLen = codeSetReply.length;
				for (var cvIndex = 0; cvIndex < codeSetReplyLen; cvIndex++) {
					var codeValue = codeSetReply[cvIndex];
					if (!self.m_immunExceptionCodeValues[codeValue.MEANING]) {
						self.m_immunExceptionCodeValues[codeValue.MEANING] = [];
					}

					self.m_immunExceptionCodeValues[codeValue.MEANING].push(codeValue);
				}
			}
		};

		// Only show the Source selector face up so retrieve the data from code set
		MP_Util.GetCodeSetAsync(30440, exceptionCodeValuesCallback);
	}

	// Checks if the Modal already exists if not created a new one
	if (!chartExceptionModal) {
		// Generate the cancel button
		var immCancelBtn = new ModalButton("immCancelBtn")
		  .setText(i18n.CANCEL)
		  .setFocusInd(true)
		  .setCloseOnClick(true)
		  .setOnClickFunction(function() {
		      self.cleanUpModalObjectsWhenClosed();
		  });

		// Generate the chart button
		var immChartBtn = new ModalButton("immDocumentBtn" + this.compID)
    		.setText(this.m_immuni18n.CHART + " (0)")
    		.setIsDithered(true)
    		.setOnClickFunction(function() {
    			self.prepareToSaveExceptions();
    			self.cleanUpModalObjectsWhenClosed();
			});

		// Generate the chart exception modal
		chartExceptionModal = new ModalDialog("chartImmunizationExceptionModal")
		.setTopMarginPercentage(10)
		.setBottomMarginPercentage(5)
		.setLeftMarginPercentage(20)
		.setRightMarginPercentage(20)
		.setIsBodySizeFixed(false)
		.addFooterButton(immChartBtn)
		.addFooterButton(immCancelBtn)
		.setHeaderCloseFunction(function() {
			self.cleanUpModalObjectsWhenClosed();
		});

		chartExceptionModal.setHeaderTitle(this.m_immuni18n.CHART_EXCEPTION_TITLE);

		MP_ModalDialog.addModalDialogObject(chartExceptionModal);
	}
	// Update and show modal
	MP_ModalDialog.updateModalDialogObject(chartExceptionModal);
	MP_ModalDialog.showModalDialog("chartImmunizationExceptionModal");
	this.generateChartExceptionModalBody(chartExceptionModal);
};

/**
 * Creates a shell for charting immunization exceptions. The function will
 * consume standard date controls to generate various date selectors and consume the MPageControls.PersonnelSearch. This shell
 * creates actionable fields for following fields:
 * Exception Type, Exception Reason, Authorized By, Admin Date and Description.
 * @param {Object} immunizationDetailsObj Current immunizations exception details object
 * or a blank object. The object should include an event code and display name for vaccine
 * @param {HTML element} immunizationContainer A HTML element to which the generated HTML will be appended
 * @param {String} uniquePrefix A string that will appended to the ID's of the fields
 */
ImmunizationsO2Component.prototype.createExceptionShellForEditMode = function(immunizationDetailsObj, immunizationContainer, uniquePrefix) {
	var self = this;
	var uniqueID = uniquePrefix + self.compID;

	try {
		// Return if no vaccine code and display is provided
		if (!immunizationDetailsObj.VACCINE_EVENT_CODE || !immunizationDetailsObj.VACCINE_DISPLAY.length) {
			throw new Error("No vaccine code or display name provided for immunizationDetailsObj");
		}

		// Create div holders for various selectors, date selector, and text controls
		var immunContainerHTML = "<div id='adminDateContainer" + uniqueID + "' class='immun-o2-sp-controls est-admin-date'></div>" + "<div id='exceptionTypeContainer" + uniqueID + "' class='immun-o2-sp-controls'></div>" + "<div id='exceptionReasonContainer" + uniqueID + "' class='immun-o2-sp-controls'></div>" + "<div id='authorizedByContainer" + uniqueID + "' class='immun-o2-sp-controls'><span class='required-field-label'>*</span><span class='secondary-text'>" + self.m_immuni18n.AUTHORIZED_BY + "</span><div id='authorizedByPersonnelSearchContainer" + uniqueID + "'></div></div>" + "<div id='descriptionContainer" + uniqueID + "' class='immun-o2-sp-controls'>" + "<span class='secondary-text'>" + self.m_immuni18n.DESCRIPTION + "</span><br/>" + "<textarea id='" + uniquePrefix + "descriptionArea" + self.compID + "' rows='5' class='immun-o2-ex-modal-controls immun-o2-ex-modal-description-area'></textarea></div>";

        if (immunContainerHTML){
            // Append the content to the immunizationContainer
            immunizationContainer.append(immunContainerHTML);
    
            self.renderExceptionSelectionControlsHTML($("#exceptionTypeContainer" + uniqueID), $("#exceptionReasonContainer" + uniqueID), uniquePrefix);
            self.renderAdminDateControlHTML($("#adminDateContainer" + uniqueID), uniquePrefix, immunizationDetailsObj);
            self.renderPersonnelSearchHTML($("#authorizedByPersonnelSearchContainer" + uniqueID), uniquePrefix);
        }	

		var exceptionIndex = self.arrayIndexOf(immunizationDetailsObj.EXCEPTIONS, "EXCEPTION_ID", uniquePrefix);
		if (exceptionIndex > -1) {
			var comboArr = self.getComboMatchesList(immunizationDetailsObj.EXCEPTIONS[exceptionIndex].EXCEPTION_EVENT_CODE, self.m_modalVaccineEventsData.EVENTS);

			if (comboArr.length) {
				//add combo parent dose id to array
				var parentDetails = self.checkForComboParentDetails(uniquePrefix);
				if (!parentDetails) {
					parentObj = {
						PARENT_DOSE_ID : uniquePrefix,
						PARENT_DISPLAY : immunizationDetailsObj.VACCINE_DISPLAY,
						DEFAULT_EC_IS_COMBO : 1
					};
					self.m_comboParentDetails.push(parentObj);
					parentDetails = parentObj;
				}
				else {
					parentDetails.DEFAULT_EC_IS_COMBO = 1;
					parentDetails.SATIS_DISPLAY = "";
					self.m_immunSatisfied = [];
				}

				self.comboProductSelected(comboArr, parentDetails);
			}
		}
	}
	catch(err) {
		logger.logJSError(err, self, "immun-chart-ex-modal.js", "createExceptionShellForEditMode");
	}
};

/**
 * This function renders the authorized by personnel in the modal
 * @param  {Object} authorizedByContainer The HTML Container Element that will encapsulate the personnel search control
 * @param  {String} uniquePrefix A string that will appended to the ID's of the fields
 * @return {undefined} Returns nothing
 */
ImmunizationsO2Component.prototype.renderPersonnelSearchHTML = function(authorizedByContainer, uniquePrefix) {
	var self = this;

	try {
		var personnelSearch = new MPageControls.PersonnelSearch(authorizedByContainer);

		personnelSearch.setBackgroundClass("required-field-input");
		personnelSearch.setAutoHideCloseButton(false);
		personnelSearch.setUserId(self.getCriterion().provider_id);

		// Set the selected provider to the current user if possible
		if (self.m_providerInfo) {
			personnelSearch.setValue(self.m_providerInfo.NAME_FULL_FORMATTED);
			self.toggleValidationExceptionItem(uniquePrefix, "AUTHORIZED_CD", 1, self.m_providerInfo.PROVIDER_ID);
			$("#" + personnelSearch.getClosebtnId()).css("display", "inline-block");
		}
		else {
			personnelSearch.activateBackground();
		}

		personnelSearch.setOnChange(function() {
			if (personnelSearch.getTextbox()[0].value === "") {
				personnelSearch.activateBackground();
				self.toggleValidationExceptionItem(uniquePrefix, "AUTHORIZED_CD", 0, 0.00);
			}
		});

		$("#" + personnelSearch.getClosebtnId()).click(function() {
			personnelSearch.activateBackground();
			self.toggleValidationExceptionItem(uniquePrefix, "AUTHORIZED_CD", 0, 0.00);
		});

		var personnelList = personnelSearch.getList();
		personnelList.setOnSelect(function() {

			if (!personnelList.getSelectedItem()) {
				personnelSearch.setValue(null);
				personnelSearch.activateBackground();
				self.toggleValidationExceptionItem(uniquePrefix, "AUTHORIZED_CD", 0, 0.00);
			}
			else {
				personnelSearch.setValue(personnelList.getSelectedItem().NAME_FULL_FORMATTED);
				personnelSearch.getTextbox().removeClass("required-field-input");
				self.toggleValidationExceptionItem(uniquePrefix, "AUTHORIZED_CD", 1, personnelList.getSelectedItem().PERSON_ID);
			}

			personnelSearch.close();
		});

		// Fire event to indicate that HTML has been rendered
		CERN_EventListener.fireEvent(null, self, "shellFieldsRendered" + this.compID, null);

	}
	catch (err) {
		logger.logJSError(err, this, "immun-doc-hx-modal.js", "renderPersonnelSearchHTML");
	}
};

/**
 * This function renders the exception type and exception reason drop downs
 * @param  {Object} exceptionTypeContainer The HTML Container Element that will encapsulate the Exception Type selector and label
 * @param  {Object} exceptionReasonContainer The HTML Container Element that will encapsulate the Exception Type selector and label
 * @param  {String} uniquePrefix A string that will appended to the ID's of the fields
 * @return {undefined} Returns nothing
 */
ImmunizationsO2Component.prototype.renderExceptionSelectionControlsHTML = function(exceptionTypeContainer, exceptionReasonContainer, uniquePrefix) {
	try {
		var self = this;

		var reasonUniqueId = uniquePrefix + "exceptionReasonSelector" + self.compID;
		var exceptionReasonSelectorHtml = "<span class='required-field-label'>*</span><span class='secondary-text'>" + self.m_immuni18n.EXCEPTION_REASON + "</span><select class='immun-o2-sp-select immun-o2-ex-modal-controls required-field-input' id='" + reasonUniqueId + "'></select>";

		exceptionReasonContainer.append(exceptionReasonSelectorHtml);
		
		var reasonSelector = $("#" + reasonUniqueId);

		reasonSelector.change(function() {
			reasonSelector.blur();

			// Add the required-field class if no item is selected indicating it is a mandatory field
			if (parseInt(reasonSelector.val(), 10)) {
				reasonSelector.removeClass("required-field-input");
				//Fire event to signal satisfied
				CERN_EventListener.fireEvent(null, self, "chartModalExceptionSatisfy" + self.compID, uniquePrefix + "EXCEPTION_REASON_CD");
			}
			else {
				reasonSelector.addClass("required-field-input");
				//Fire event to signal un-satisfied
				CERN_EventListener.fireEvent(null, self, "chartModalExceptionUnSatisfy" + self.compID, uniquePrefix + "EXCEPTION_REASON_CD");
			}
		});

		var typeUniqueId = uniquePrefix + "exceptionTypeSelector" + self.compID;
		var exceptionTypeSelectHTML = "<option></option>";
		exceptionTypeSelectHTML += self.m_immunExceptionCodeValues.hasOwnProperty("CIEXPIRE") ? "<option value='CIEXPIRE'>" + self.m_immuni18n.CONTRAINDICATED + " - " + self.m_immuni18n.DO_NOT_GIVE + "</option>" : "";
		exceptionTypeSelectHTML += self.m_immunExceptionCodeValues.hasOwnProperty("REFEXPIRE") ? "<option value='REFEXPIRE'>" + self.m_immuni18n.REFUSED + " - " + self.m_immuni18n.DO_NOT_GIVE + "</option>" : "";
		exceptionTypeSelectHTML += self.m_immunExceptionCodeValues.hasOwnProperty("NOT_NEEDED") ? "<option value='NOT_NEEDED'>" + self.m_immuni18n.UNNECESSARY + "</option>" : "";

		var exceptionTypeSelectorHtml = "<span class='required-field-label'>*</span><span class='secondary-text'>" + self.m_immuni18n.EXCEPTION + "</span><select class='immun-o2-sp-select immun-o2-ex-modal-controls required-field-input' id='" + typeUniqueId + "'>" + exceptionTypeSelectHTML + "</select>";

		exceptionTypeContainer.append(exceptionTypeSelectorHtml);
        var typeSelector = $("#" + typeUniqueId);

		typeSelector.change(function() {
			typeSelector.blur();

			// Add the required-field class if no item is selected indicating it is a mandatory field
			if (typeSelector.val() === "") {
				typeSelector.addClass("required-field-input");
				//Fire event to signal un-satisfied
				CERN_EventListener.fireEvent(null, self, "chartModalExceptionUnSatisfy" + self.compID, uniquePrefix + "EXCEPTION_TYPE_CD");
			}
			else {
				typeSelector.removeClass("required-field-input");
				//Fire event to signal satisfied
				CERN_EventListener.fireEvent(null, self, "chartModalExceptionSatisfy" + self.compID, uniquePrefix + "EXCEPTION_TYPE_CD");
			}

			self.renderExceptionReasonCodeValues(reasonSelector, typeSelector.val());
		});

		// Fire event to indicate that HTML has been rendered
		CERN_EventListener.fireEvent(null, self, "shellFieldsRendered" + this.compID, null);
	}
	catch(err) {
		logger.logJSError(err, this, "immun-chart-ex-modal.js", "renderExceptionTypeContainer");
	}
};

/**
 * This function builds the HTML options for exception reasons
 * @param  {Object} exceptionReasonSelector The selector combobox
 * @param  {[type]} exceptionMeaning The CDF_MEANING for associated exceptions
 * @return {[type]} Returns exception reasons as HTML options
 */
ImmunizationsO2Component.prototype.renderExceptionReasonCodeValues = function(exceptionReasonSelector, exceptionMeaning) {
	var self = this;
	var exceptionReasonSelect = "";

	// If the meaning is blank or the attribute is not present in m_immunExceptionCodeValues remove the selection options
	if (exceptionMeaning === "" || !self.m_immunExceptionCodeValues[exceptionMeaning]) {
		exceptionReasonSelector.html("");
	}
	else {
		exceptionReasonSelect = "<option></option>";

		var codeValuesLength = self.m_immunExceptionCodeValues[exceptionMeaning].length;
		for (var i = 0; i < codeValuesLength; i++) {
			exceptionReasonSelect += "<option value='" + self.m_immunExceptionCodeValues[exceptionMeaning][i].CODE + "'>" + self.m_immunExceptionCodeValues[exceptionMeaning][i].DISPLAY + "</option>";
		}
	}

	exceptionReasonSelector.html(exceptionReasonSelect);
	exceptionReasonSelector.trigger("change");
};

/**
 * This function fills the vaccine exception pane in the chart exception modal with
 * details about the newly selected immunization from the vaccine navigator
 * pane of the modal.
 * @param {Object} immunObj The immunization object's info to render in the modal body
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.createExceptionModalDetails = function(immunObj) {
	var immunVaccineExceptionPane = $("#immunModalVaccineEventPane" + this.compID);
	var immunVaccinePaneId = "immunVaccineEventDetails" + immunObj.VACCINE_EVENT_CODE;
	var immunExceptionPaneHTML = "<div id='" + immunVaccinePaneId + "'>";
	var exceptionsLen = immunObj.EXCEPTIONS.length;
	var immunBodyHTML = "";
	var exceptionsIds = [];
	var self = this;
	var comboLen = immunObj.COMBO_PARENTS.length;

	if (immunObj.VACCINE_DISPLAY) {
		immunExceptionPaneHTML += "<div id='vaccine" + immunObj.VACCINE_EVENT_CODE + "immunDocHxTitle" + this.compID + "' class='immun-o2-hx-modal-hx-title'>" + immunObj.VACCINE_DISPLAY;

		if (!immunObj.ADDED_AS_COMBO) {
			immunExceptionPaneHTML += "<span id='vaccine" + immunObj.VACCINE_EVENT_CODE + "Remove'class='immun-o2-ex-vaccine-close'></span>";
		}

		immunExceptionPaneHTML += "</div>";
	}

	if (!immunObj.ADDED_AS_COMBO) {
		self.prepareProductAndVISInfo(immunObj);

		//code for creating exception boxes
		for (var i = 1; i <= exceptionsLen; i++) {
			var currExceptionId = "vaccine" + immunObj.VACCINE_EVENT_CODE + "Exception" + i;
			exceptionsIds.push(currExceptionId);
			immunBodyHTML += "<div id='" + currExceptionId + "' class='immun-o2-ex-modal-ex-event-box'>" +
			"</div>";

			//add dose id to validation object for use when saving changes from modal
			immunObj.EXCEPTIONS[i - 1].EXCEPTION_ID = currExceptionId;
			self.setEntryEventId(immunObj, self.m_modalVaccineEventsData, currExceptionId, 0);
		}
	}

	immunExceptionPaneHTML += "<div id='immunDocHxBody" + this.compID + "' class='immun-o2-hx-modal-hx-body'>" + immunBodyHTML;

	if (immunObj.ADDED_AS_COMBO) {
		var addExceptionLinkId = "addDoseLink" + immunObj.VACCINE_EVENT_CODE;

		immunExceptionPaneHTML += "<a id='" + addExceptionLinkId + "' href='#' class='immun-o2-hx-modal-hx-add-dose'>+ " + this.m_immuni18n.CHART_EXCEPTION + "</a>";
	}

	immunExceptionPaneHTML += "</div></div>";

	immunVaccineExceptionPane.append(immunExceptionPaneHTML);
	this.m_loadedVaccinesInModal.push(immunVaccinePaneId);

	if (!immunObj.ADDED_AS_COMBO) {
		//add spinner to modal and trigger listener
		MP_Util.LoadSpinner("vwpModalDialogchartImmunizationExceptionModal", 1, "doseLoadSpinner");
		this.triggerFieldLoadListener(3);

		//go through all dose ids and make calls to get dose details shells
		for (var j = 0; j < exceptionsLen; j++) {
			this.createExceptionShellForEditMode(immunObj, $("#" + exceptionsIds[j]), exceptionsIds[j]);
		}
	}

	if (comboLen) {
		for (var j = 0; j < comboLen; j++) {
			this.addReadOnlyExceptionBox(immunObj, immunObj.COMBO_PARENTS[j]);
		}
	}

	// add click event handler to the "+ Chart Exception" link
	$("#" + addExceptionLinkId).on("click", function() {
		self.addNewExceptionToModal(immunObj);
	});
};

/**
 * This function creates a new read-only exception box for a given immunization and appends it to the vaccine group body.
 * @param {Object} immunObj The immunization object's info to render in the modal body
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.addReadOnlyExceptionBox = function(immunObj, currCombo) {
	try {
		//get combo parents values and store them in a variable
		var comboDetails = this.getComboParentDetails(currCombo);

		//build read-only box based on current values in variable
		var immunBodyHTML = "<div id='vaccine" + immunObj.VACCINE_EVENT_CODE + "ComboTo" + currCombo.COMBO_DOSE_ID + "' class='immun-o2-hx-modal-hx-dose-box combo ex-read-only'><div class='immun-o2-read-only-header'>" + comboDetails.PARENT_DISPLAY + " " + this.m_immuni18n.COMBO + "</div><div class='immun-o2-read-only-label secondary-text'>" + this.m_immuni18n.ADMIN_DATE + "</div><div class='immun-o2-read-only-details'>" + comboDetails.DETAILS.ADMIN_DATE + "</div><div class='immun-o2-read-only-label secondary-text'>" + this.m_immuni18n.EXCEPTION + "</div><div class='immun-o2-read-only-details'>" + comboDetails.DETAILS.EXCEPTION_TYPE + "</div><div class='immun-o2-read-only-label secondary-text'>" + this.m_immuni18n.EXCEPTION_REASON + "</div><div class='immun-o2-read-only-details'>" + comboDetails.DETAILS.EXCEPTION_REASON + "</div><div class='immun-o2-read-only-label secondary-text'>" + this.m_immuni18n.AUTHORIZED_BY + "</div><div class='immun-o2-read-only-details'>" + comboDetails.DETAILS.AUTHORIZED_BY + "</div><div class='immun-o2-read-only-label secondary-text'>" + this.m_immuni18n.DESCRIPTION + "</div><div class='immun-o2-read-only-details'>" + comboDetails.DETAILS.ADMIN_NOTE + "</div></div>";

		var addLink = $("#addDoseLink" + immunObj.VACCINE_EVENT_CODE);

		if (addLink.length) {
			$(immunBodyHTML).insertBefore(addLink);
		}
		else {
			$("#immunVaccineEventDetails" + immunObj.VACCINE_EVENT_CODE + " > #immunDocHxBody" + this.compID).append(immunBodyHTML);
		}
	}
	catch(err) {
		logger.logJSError(err, this, "immun-chart-ex-modal.js", "addReadOnlyExceptionBox");
	}
};

/**
 * This function updates an existing read-only exception box for a given immunization. Since
 * the parent of the combo could have changed values, gather all new values and re-create the box.
 * @param {Object} immunObj The immunization object's info to render in the modal body
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.updateReadOnlyExceptionBox = function(immunObj, currCombo) {
	try {
		//get combo parents values and store them in a variable
		var comboDetails = this.getComboParentDetails(currCombo);

		//build updated html
		var immunBodyHTML = "<div class='immun-o2-read-only-header'>" + comboDetails.PARENT_DISPLAY + " " + this.m_immuni18n.COMBO + "</div><div class='immun-o2-read-only-label secondary-text'>" + this.m_immuni18n.ADMIN_DATE + "</div><div class='immun-o2-read-only-details'>" + comboDetails.DETAILS.ADMIN_DATE + "</div><div class='immun-o2-read-only-label secondary-text'>" + this.m_immuni18n.EXCEPTION + "</div><div class='immun-o2-read-only-details'>" + comboDetails.DETAILS.EXCEPTION_TYPE + "</div><div class='immun-o2-read-only-label secondary-text'>" + this.m_immuni18n.EXCEPTION_REASON + "</div><div class='immun-o2-read-only-details'>" + comboDetails.DETAILS.EXCEPTION_REASON + "</div><div class='immun-o2-read-only-label secondary-text'>" + this.m_immuni18n.AUTHORIZED_BY + "</div><div class='immun-o2-read-only-details'>" + comboDetails.DETAILS.AUTHORIZED_BY + "</div><div class='immun-o2-read-only-label secondary-text'>" + this.m_immuni18n.DESCRIPTION + "</div><div class='immun-o2-read-only-details'>" + comboDetails.DETAILS.ADMIN_NOTE + "</div></div>";

		//get combo box DOM object and update inner html
		//id will look like the following: vaccine3087519468ComboTovaccine3087519460Dose1
		var comboBoxObj = $("#vaccine" + immunObj.VACCINE_EVENT_CODE + "ComboTo" + currCombo.COMBO_DOSE_ID);

		if (comboBoxObj.length) {
			comboBoxObj.html(immunBodyHTML);
		}
	}
	catch(err) {
        logger.logJSError(err, this, "immun-chart-ex-modal.js", "updateReadOnlyExceptionBox");
	}
};

/**
 * This function populates the body of the chart exception modal by using the
 * setBodyHTML function provided by the Modal Dialog framework
 * @param {Object} chartExceptionModal - the modal object that needs its body HTML populated
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.generateChartExceptionModalBody = function(chartExceptionModal) {
	var addImmunId = "addImmunLink" + this.compID;
	var modalObj = chartExceptionModal;
	var self = this;
	var mainContainerHTML = "<div class='immun-o2-hx-modal-container'>" +
	"<div class='immun-o2-hx-modal-add-immun'><div id='immunListInModal" + this.compID + "'>" +
	"</div><a id='" + addImmunId + "' href='#' class='immun-o2-add-link'>+ " + this.m_immuni18n.ADD_IMMUN + "</a></div>" +
	"<div id='immunModalVaccineEventPane" + this.compID + "' class='immun-o2-hx-modal-hx-details'>" +
	"<div id='immunDocHxTitle" + this.compID + "' class='immun-o2-hx-modal-hx-title'>" + this.m_immuni18n.NO_IMMUN_SELECTED +
	"</div><div id='immunDocHxBody" + this.compID + "' class='immun-o2-hx-modal-hx-body'></div></div>" + "</div>";

	modalObj.setBodyHTML(mainContainerHTML);

	//Register validator listeners for Source field for the docHx Modal
	this.registerExceptionValidatorListeners();

	//add click to add immunizations link
	$("#" + addImmunId).click(function() {
		self.togglePopup(addImmunId);
	});

	//add click event handler to each remove icon added later
	$("#immunModalVaccineEventPane" + this.compID).on("click", ".immun-o2-ex-vaccine-close", function() {
		self.removeExceptionFromModal(this);
	});

	this.togglePopup(addImmunId);
};

/**
 * Register listeners for each dose created for each vaccine in the Chart Ex Modal,
 * once an event occurs in the Exception Type, Exception Reason, Authorizing Provider and Admin date fields we can capture it and
 * process accordingly
 * @param {undefined} No parameter passed
 * @returns {undefined} No return object
 */
ImmunizationsO2Component.prototype.registerExceptionValidatorListeners = function() {
	CERN_EventListener.removeListener(this, "chartModalExceptionSatisfy" + this.compID, this.satisfyExceptionCB, this);
	CERN_EventListener.addListener(this, "chartModalExceptionSatisfy" + this.compID, this.satisfyExceptionCB, this);
	CERN_EventListener.removeListener(this, "chartModalExceptionUnSatisfy" + this.compID, this.unSatisfyExceptionCB, this);
	CERN_EventListener.addListener(this, "chartModalExceptionUnSatisfy" + this.compID, this.unSatisfyExceptionCB, this);
};

/**
 * Callback function which handles the event triggered when the exception type or exception reason drop down value corresponding to a
 * specific exception is added
 * @param {Object} event Click event information which triggered the firing of the callback
 * @param {Object} reply Unique Id which signifies which exception's type or reason drop down was triggered
 * @returns {undefined} Returns nothing
 */
ImmunizationsO2Component.prototype.satisfyExceptionCB = function(event, reply) {
	if (reply) {
		var replyType = "";

		if (reply.indexOf("EXCEPTION_TYPE_CD") > -1) {
			replyType = "EXCEPTION_TYPE_CD";
		}
		else if (reply.indexOf("EXCEPTION_REASON_CD") > -1) {
			replyType = "EXCEPTION_REASON_CD";
		}

        // The control ids will be appended with the control, so we are stripping it out here as we pass along the reply.
		this.toggleValidationExceptionItem(reply.replace(replyType, ""), replyType, 1);
	}
};

/**
 * Callback function which handles the event triggered when the exception type or exception reason drop down value corresponding to a
 * specific exception is removed
 * @param {Object} event Click event information which triggered the firing of the callback
 * @param {Object} reply Unique Id which signifies which exception's type or reason drop down was triggered
 * @returns {undefined} Returns nothing
 */
ImmunizationsO2Component.prototype.unSatisfyExceptionCB = function(event, reply) {
	if (reply) {

		//We are doing this since the Unique ID sent from the Event Listener on clicking an source item from drop down will have the type of
		// reply appended to it
		var replyType = "";

		if (reply.indexOf("EXCEPTION_TYPE_CD") > -1) {
			replyType = "EXCEPTION_TYPE_CD";
		}
		else if (reply.indexOf("EXCEPTION_REASON_CD") > -1) {
			replyType = "EXCEPTION_REASON_CD";
		}

		this.toggleValidationExceptionItem(reply.replace(replyType, ""), replyType, 0);
	}
};

/**
 * Toggles the exception satisfying flag. If the individual fields are successfully entered then this function will toggle the
 * Exception status to Satisfied
 * This can be used to monitor the satisfiability of the entire vaccine.
 *
 * @param {String} exceptionId Id of the Exception belonging to a vaccine into which a data entry was made
 * @param {String} fieldId Denotes the field that was modified - either Status or Admin_date
 * @param {Number} isSatisfied Flag - 0 or 1 indicating whether the data in the field was entered successfully or removed
 */
ImmunizationsO2Component.prototype.toggleValidationExceptionItem = function(exceptionId, fieldId, isSatisfied) {
	this.toggleValidationExceptionItem(exceptionId, fieldId, isSatisfied, 0.0);
};

/**
 * Toggles the exception satisfying flag and sets the authorizing providerId for the exception if necessary. If the individual fields
 * are successfully entered then this function will toggle the Exception status to Satisfied
 * This can be used to monitor the satisfiability of the entire vaccine.
 *
 * @param {String} exceptionId Id of the Exception belonging to a vaccine into which a data entry was made
 * @param {String} fieldId Denotes the field that was modified - either Status or Admin_date
 * @param {Number} isSatisfied Flag - 0 - False or 1 - True indicating whether the data in the field was entered successfully or
 * removed
 * @param {Number} authProviderId - the personId of the authorizing provider
 */
ImmunizationsO2Component.prototype.toggleValidationExceptionItem = function(exceptionId, fieldId, isSatisfied, authProviderId) {
	/**
	 * @param {Array} arrayList List of all the vaccines and their corresponding exceptions addded in the modal
	 * @param {String} exceptionId Id of the Exception belonging to a vaccine into which a data entry was made
	 * @returns {Number/String} Index of the exception found, if no exception is found then returns -1
	 */
	var trackDownException = function(arrayList) {
		var arrayLen = arrayList.length;
		var j = 0;
		var i = 0;
		if (arrayLen && exceptionId) {
			var tempExceptionArr = [];
			var exceptionArrCount = 0;
			for ( i = 0; i < arrayLen; i++) {
				tempExceptionArr = arrayList[i].EXCEPTIONS;
				exceptionArrCount = tempExceptionArr.length;
				for ( j = 0; j < exceptionArrCount; j++) {
					if (exceptionId === tempExceptionArr[j].EXCEPTION_ID) {
						return i + "&" + j;
					}
				}
			}
		}
		return -1;
	};

	try {
		if (exceptionId && fieldId) {
			var exceptionIndexStr = trackDownException(this.m_immunValidationObj);
			var vaccineIndex = -1;
			var exceptionIndex = -1;
			var tempArr = [];
			var currentHappyFlag = -1;

			if (exceptionIndexStr) {
				tempArr = exceptionIndexStr.split("&");
				vaccineIndex = tempArr[0];
				exceptionIndex = tempArr[1];
			}
			else {
				throw new Error("Exception not found, toggleValidationExceptionItem()");
			}

			if (this.m_immunValidationObj[vaccineIndex]) {
				var exceptionObj = this.m_immunValidationObj[vaccineIndex].EXCEPTIONS[exceptionIndex];
				if (exceptionObj) {
					switch(fieldId) {
						case "EXCEPTION_TYPE_CD":
							exceptionObj.EXCEPTION_TYPE_CD = isSatisfied ? 1 : 0;
							break;
						case "EXCEPTION_REASON_CD":
							exceptionObj.EXCEPTION_REASON_CD = isSatisfied ? 1 : 0;
							break;
						case "AUTHORIZED_CD":
							exceptionObj.AUTHORIZED_CD = isSatisfied ? 1 : 0;
							exceptionObj.ADMIN_PRSNL_ID = authProviderId;
							break;
						case "ADMIN_DATE":
							exceptionObj.ADMIN_DATE = isSatisfied ? 1 : 0;
							break;
					}

					//Perform AND on both the required fields to get the exception satisfying status
					currentHappyFlag = exceptionObj.ALL_FIELDS_HAPPY;
					exceptionObj.ALL_FIELDS_HAPPY = exceptionObj.EXCEPTION_TYPE_CD && exceptionObj.EXCEPTION_REASON_CD && exceptionObj.AUTHORIZED_CD && exceptionObj.ADMIN_DATE;

					//when change on all_fields_happy for a exception, adjust the count on the document button
					if (currentHappyFlag !== exceptionObj.ALL_FIELDS_HAPPY) {
						//Toggle the vaccine after a change in the input params - Source or Admin Date
						this.toggleModalVaccineStatus(this.m_immunValidationObj[vaccineIndex]);
						//Adjust the button count with the exception happy field
						this.adjustDocumentButtonCount(exceptionObj.ALL_FIELDS_HAPPY);
					}
				}
			}
		}
		else {
			throw new Error("One or more of the input param are not passed, toggleValidationExceptionItem()");
		}
	}
	catch (err) {
		logger.logJSError(err, this, "immun-chart-ex-modal.js", "toggleValidationExceptionItem");
	}
};

/**
 * This function gathers all exceptions which have their required fields filled and gets
 * their filled in data. It puts that data into an object and then calls
 * saveImmunizationsToDataBase with that object and 0 (to indicate add).
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.prepareToSaveExceptions = function() {
	//go through m_immunValidationObj and make call to get values for all satisfied doses
	this.m_immunizationsToSave = [];
	var valLen = this.m_immunValidationObj.length;

	//loop through each vaccine
	for (var i = 0; i < valLen; i++) {
		var exceptionLen = this.m_immunValidationObj[i].EXCEPTIONS.length;
		for (var j = 0; j < exceptionLen; j++) {
			//loop through each dose in each vaccine and gather info for "HAPPY" ones
			var exception = this.m_immunValidationObj[i].EXCEPTIONS[j];
			if (exception.ALL_FIELDS_HAPPY) {
				//gather info for that dose id
				var fieldInfo = this.readValuesFromImmunShellFields(exception.EXCEPTION_ID);
				fieldInfo.ADMIN_PRSNL_ID = exception.ADMIN_PRSNL_ID;
				fieldInfo.VACCINE_EVENT_CODE = exception.EXCEPTION_EVENT_CODE;
                fieldInfo.PARENT_EVENT_ID = fieldInfo.PARENT_ENTITY_ID || 0;
				fieldInfo.EVENT_TYPE_FLAG = 1;
				fieldInfo.DOSE_VALUE = "0";

				//save off field info to be saved
				this.m_immunizationsToSave.push(fieldInfo);
			}
		}
	}
	// Call a function to save the modifications
	this.saveImmunizationsToDataBase(this.m_immunizationsToSave, "add");
};

/**
 * This function removes the passed exception from the DOM
 * @param {Object} exceptionElem The dose element to remove
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.removeExceptionFromModal = function(exceptionElem) {
	//elemId will be in the following format: vaccine6345354Remove
	try {
		var self = this;
		
		var elemId = exceptionElem.id;
		var immunIdParts = elemId.split("Remove")[0];
		var immunId = immunIdParts.split("vaccine")[1];

		// TODO: ExceptionId will need to be updated if/when we support charting multiple exceptions for a vaccine group
		var exceptionId = immunIdParts + "Exception1";
		var index = self.arrayIndexOf(self.m_immunValidationObj, "VACCINE_EVENT_CODE", immunId);

		if (index < 0) {
			return;
		}

		var matchingVaccine = self.m_immunValidationObj[index];

		//Call the toggler for both exception pieces in the modal pane to indicate the completeness status
		self.toggleValidationExceptionItem(exceptionId, "ADMIN_DATE", 0);
		self.toggleValidationExceptionItem(exceptionId, "AUTHORIZED_CD", 0, 0.00);

		var immunListLeftModalIndex = -1;
		var additionalVaccineGroupExists = false;
		var immunListLeftModalLen = self.m_immunListLeftModal.length;
		for (var g = 0; g < immunListLeftModalLen; g++) {
			// We don't want to have the check include the exception that is pending removal
			// Intentionally performing code_value comparison via != to deal the type differences
			if (self.m_immunListLeftModal[g].CODE_VALUE == immunId) {
			    immunListLeftModalIndex = g;
			}			
			else if (!self.m_immunListLeftModal[g].ADDED_AS_COMBO) {
				additionalVaccineGroupExists = true;
			}
		}

		// Has a combo parent so it can't completely be removed
		if (matchingVaccine.COMBO_PARENTS.length) {

			var exceptionsLen = matchingVaccine.EXCEPTIONS.length;
			for (var j = 0; j < exceptionsLen; j++) {
				if (matchingVaccine.EXCEPTIONS[j].EXCEPTION_ID === exceptionId) {
					//remove matching dose from list
					matchingVaccine.EXCEPTIONS.splice(j, 1);
					break;
				}
			}
			
			matchingVaccine.ADDED_AS_COMBO = 1;
			if (immunListLeftModalIndex >= 0) {
			    self.m_immunListLeftModal[immunListLeftModalIndex].ADDED_AS_COMBO = 1;
			}

			// Add the + Chart Exception link since the user won't be able to select the vaccine group from the popup
			var addExceptionLinkId = "addDoseLink" + immunId;
			var addExceptionLinkHtml = "<a id='" + addExceptionLinkId + "' href='#' class='immun-o2-hx-modal-hx-add-dose'>+ " + self.m_immuni18n.CHART_EXCEPTION + "</a>";

			$("#immunVaccineEventDetails" + immunId + " > #immunDocHxBody" + self.compID).append(addExceptionLinkHtml);

			// add click event handler to the "+ Chart Exception" link
			$("#" + addExceptionLinkId).on("click", function() {
				self.addNewExceptionToModal(matchingVaccine);
			});

			// The only remaining information for this vaccine group will be read only boxes
			// so we want to prevent the user from clicking the 'X' since there is nothing left to remove
			$("#vaccine" + immunId + "Remove").remove();

			var comboParent = self.checkForComboParentDetails(exceptionId);
			if (comboParent) {
				self.removeECWarningBanner(comboParent);
			}

			// Remove the fields
			$("#" + exceptionId).remove();

			//Call the toggler for the vaccine in the modal pane to indicate the completeness status
			self.toggleModalVaccineStatus(matchingVaccine);

			self.checkIfDoseIsCombo(exceptionId);
		}
		else if (additionalVaccineGroupExists) {
			// No read only exception boxes and there is another vaccine group that exists with an entry
			var eventDetails = $("#immunVaccineEventDetails" + immunId);
			eventDetails.html("<div id='immunDocHxTitle" + self.compID + "' class='immun-o2-hx-modal-hx-title'>" + self.m_immunValidationObj[index].VACCINE_DISPLAY + " " + self.m_immuni18n.HAS_BEEN_REMOVED + "</div><div id='immunDocHxBody" + self.compID + "' class='immun-o2-hx-modal-hx-body'></div>");

			$(self.m_lastSelectedImmun[0]).remove();
			$(self.m_lastSelectedImmun[1]).addClass("immun-o2-ex-removed-immun");

			//Call the toggler for the vaccine in the modal pane to indicate the completeness status
			self.toggleModalVaccineStatus(matchingVaccine);

			self.m_removeLastImmun = immunId;
			self.checkIfDoseIsCombo(exceptionId);
		}
		else {
			// No read only, and is the only vaccine group that has an exception entry.  The dialog should reset to default

			// Remove the vaccine group and restore the DOM to original message
			$("#immunVaccineEventDetails" + immunId).remove();

			var eventPane = $("#immunModalVaccineEventPane" + self.compID);
			eventPane.html("<div id='immunDocHxTitle" + self.compID + "' class='immun-o2-hx-modal-hx-title'>" + self.m_immuni18n.NO_IMMUN_SELECTED + "</div><div id='immunDocHxBody" + self.compID + "' class='immun-o2-hx-modal-hx-body'></div>");

			self.checkIfDoseIsCombo(exceptionId);
			self.resetVaccineSelection(immunId);
			self.m_immunValidationObj.splice(index, 1);			
		}
		
	   this.removeDateFromDateCollector(exceptionId);	
	}
	catch(err) {
		logger.logJSError(err, this, "immun-chart-ex-modal.js", "removeExceptionFromModal");
	}
};

/**
 * This function determines the index of the first element with the given property matching the value.
 * @param  {Array} array The array of elements to be searched.
 * @param  {String} property The property that should contain the value.
 * @param  {Object} value The value to be searched for.
 * @return {Number} Returns the index of the array element. If no matching property was found, -1 will be returned.
 */
ImmunizationsO2Component.prototype.arrayIndexOf = function(array, property, value) {
	var retVal = -1;
	var arrayLen = array.length;
	for (var index = 0; index < arrayLen; index++) {
		var item = array[index];
		if (item.hasOwnProperty(property)) {
			// Note: Double Equals signs were used here because the attibutes were not always
			// the same type as the value, e.g. String & Number
			if (item[property] == value) {
				retVal = index;
				return retVal;
			}
		}
	}
	return retVal;
};

/**
 * This function removes all references to the loaded vaccine group and resets it to an unselected state
 * @param  {Number} immunId the event code for the vaccine group to be removed from the dialog
 * @return {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.resetVaccineSelection = function(immunId) {

	try {	    
		// var $popupHtml = $(this.m_popupListHTML);
		// $popupHtml.children("[data-group-code='" + immunId + "']").removeClass("selected").attr("data-group-unique", true);
		// this.m_popupListHTML = $popupHtml.prop("outerHTML");

		var immunListHtml = $("#immunListInModal" + this.compID);
		immunListHtml.children("#vaccine" + immunId).remove();
		immunListHtml.children("[data-code='" + immunId + "']").remove();

		var leftIndex = this.arrayIndexOf(this.m_immunListLeftModal, "CODE_VALUE", immunId);
		if (leftIndex > -1) {
			this.m_immunListLeftModal.splice(leftIndex, 1);
		}

		var toggleIndex = this.arrayIndexOf(this.m_vaccineModalToggleList, "VACCINE_EVENT_CODE", immunId);
		if (toggleIndex > -1) {
			this.m_vaccineModalToggleList.splice(toggleIndex, 1);
		}

		var namesIndex = this.arrayIndexOf(this.m_selectedImmunNames, "CODE", immunId);
		if (namesIndex > -1) {
			this.m_selectedImmunNames.splice(namesIndex, 1);
		}

		var loadedVaccinesInModalLen = this.m_loadedVaccinesInModal.length;
		for (var i = 0; i < loadedVaccinesInModalLen; i++) {
			if (this.m_loadedVaccinesInModal[i] === ("immunVaccineEventDetails" + immunId)) {
				this.m_loadedVaccinesInModal.splice(i, 1);
				break;
			}
		}

		this.updatePopupItems([{
			VACCINE_GROUP_CD : immunId
		}], 0);

		this.m_lastSelectedImmun = [];
		this.m_modalImmunListCont = null;

	}
	catch(err) {
		logger.logJSError(err, this, "immun-chart-ex-modal.js", "resetVaccineSelection");
	}
};

/**
 * This function checks for the highest exception currently showing for a vaccine.
 * Then it creates a new exception with a number that is one higher.
 * @param {Object} immunObj The immunization object's info to render in the modal body
 * @returns {undefined} returns nothing
 */
ImmunizationsO2Component.prototype.addNewExceptionToModal = function(immunObj) {

	try {
		var self = this;
		var exceptionsLen = immunObj.EXCEPTIONS.length;
		var currExceptionId = "";
		var nextExceptionNum = 0;

		if (exceptionsLen) {
			//get highest numbered dose for current vaccine
			var highestExceptionId = immunObj.EXCEPTIONS[exceptionsLen - 1].EXCEPTION_ID;
			var highestExceptionNum = parseInt(highestExceptionId.split("Exception")[1], 10);
			nextExceptionNum = highestExceptionNum + 1;
			currExceptionId = "vaccine" + immunObj.VACCINE_EVENT_CODE + "Exception" + nextExceptionNum;
		}
		else {
			//all doses have been removed, need to add a new one
			nextExceptionNum = 1;
			currExceptionId = "vaccine" + immunObj.VACCINE_EVENT_CODE + "Exception1";
		}

		var immunBodyHTML = "<div id='" + currExceptionId + "' class='immun-o2-ex-modal-ex-event-box'>" + "</div>";

		//add spinner to modal and trigger listener
		MP_Util.LoadSpinner("vwpModalDialogchartImmunizationExceptionModal", 1, "doseLoadSpinner");
		self.triggerFieldLoadListener(3);

		if (exceptionsLen) {
			$(immunBodyHTML).insertAfter("#" + highestExceptionId);
		}
		else {
			// Since we are only supporting charting one exception, the documented one for the user is inserted before any read only boxes
			$(immunBodyHTML).prependTo("#immunVaccineEventDetails" + immunObj.VACCINE_EVENT_CODE + " > #immunDocHxBody" + this.compID);
		}

		immunObj.EXCEPTIONS.push({
			EXCEPTION_ID : currExceptionId,
			EXCEPTION_EVENT_CODE : 0,
			EXCEPTION_TYPE_CD : 0,
			EXCEPTION_REASON_CD : 0,
			AUTHORIZED_CD : 0,
			ADMIN_PRSNL_ID : 0,
			ADMIN_DATE : 0,
			ALL_FIELDS_HAPPY : 0 //flag to signify all fields in this dose have their required fields filled in
		});

		//if immun was originally added to navigator as a combo, set that to zero since
		//a non-combo dose has been added
		if (immunObj.ADDED_AS_COMBO) {
			immunObj.ADDED_AS_COMBO = 0;

			//also update listleftmodal object
			var leftListLen = self.m_immunListLeftModal.length;

			for (var i = 0; i < leftListLen; i++) {
				if (self.m_immunListLeftModal[i].CODE_VALUE == immunObj.VACCINE_EVENT_CODE) {
					self.m_immunListLeftModal[i].ADDED_AS_COMBO = 0;
				}
			}
		}

		// Remove the + Chart Exception link since we only support charting for 1 exception
		var addExceptionLinkId = "#addDoseLink" + immunObj.VACCINE_EVENT_CODE;
		$(addExceptionLinkId).remove();

		// If we're adding an exception then the vaccine event details for this group should already be built.
		// Since we only support charting a single exception, the 'X' button will be appended to the event details title
		$("#vaccine" + immunObj.VACCINE_EVENT_CODE + "immunDocHxTitle" + self.compID).append("<span id='vaccine" + immunObj.VACCINE_EVENT_CODE + "Remove' class='immun-o2-ex-vaccine-close'></span>");

		self.prepareProductAndVISInfo(immunObj);
		self.setEntryEventId(immunObj, self.m_modalVaccineEventsData, currExceptionId, 0);

		//call createExceptionShellForEditMode for one number higher
		self.createExceptionShellForEditMode(immunObj, $("#" + currExceptionId), currExceptionId);

		//Call the toggler for the vaccine in the modal pane to indicate the completeness status
		self.toggleModalVaccineStatus(immunObj);

	}
	catch(err) {
		logger.logJSError(err, this, "immun-chart-ex-modal.js", "addReadOnlyExceptionBox");
	}
};
