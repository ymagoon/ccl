/**
 * Create the component style object which will be used to style various aspects of our component
 */
function NotesRemindersComponentStyle() {
	this.initByNamespace("nr");
}

NotesRemindersComponentStyle.prototype = new ComponentStyle();
NotesRemindersComponentStyle.prototype.constructor = ComponentStyle;

/**
 * @constructor
 * Initialize the Notes Reminders component
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 */
function NotesRemindersComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new NotesRemindersComponentStyle());

	//Set the timer names so the architecture will create the correct timers for our use
	this.setComponentLoadTimerName("USR:MPG.NOTES_REMINDERS.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.NOTES_REMINDERS.O1 - render component");

	//Make sure the architecture includes the result count when creating the count text
	this.setIncludeLineNumber(true);
	this.setScope(1);
	this.m_stickyNoteTypeCodes = null;
	//default show sticky notes
	this.m_stickyNoteFilter = true;
	this.setPregnancyLookbackInd(true);
	this.resultsCount = 0;
	this.notesCount = 0;
	this.remindersCount = 0;
	this.notesI18n = i18n.discernabu.notesreminders_o1;

	//default to chart level i.e organizerLevel set to false.
	this.isOrganizerLevel = false;

	//default checked to show my assigned reminders in chart level.
	this.myAssignedRemindersFlag = true;
	this.myAssignedProcessedReminders = null;
	this.processedReminders = null;
	this.assignedPrsnl = "";
	this.assignedID = 0;

	//items related to subtype filtering for reminders.
	this.validSubTypes = [];
	this.subType = this.notesI18n.ALL_SUBTYPES;
	this.subtypetimeOut = null;

	//default to all visits.
	this.lookforwardCode = 0;
	this.isRenderComponentTable = false;

	//component table
	this.remindersTable = null;
	this.m_viewableEncntrs = "";
	this.setResourceRequired(true);

	this.setViewFlag();

	//provider id used to retrieve data
	this.provider_id = criterion.provider_id;

	/**
	 * Retrieve the viewable encounters from shared resources if it is available. if it is not available then it calls
	 * HandleViewableEncounters
	 */

	NotesRemindersComponent.method("RetrieveRequiredResources", function() {
		//if organizer level
		if (this.isOrganizerLevel) {
			this.retrieveComponentData();
		}
		else {
			//Create and/or retrieve Viewable Encounters shared resource
			var veObj = MP_Core.GetViewableEncntrs(this.getCriterion().person_id);

			//If veObj data is available, immediately load component.
			if (veObj.isResourceAvailable() && veObj.getResourceData()) {
				this.setViewableEncntrs(veObj.getResourceData());
				this.retrieveComponentData();
			}
			//If the data is not yet available, MP_Core.GetViewableEncntrs will fire the viewableEncntrInfoAvailable event when the data becomes
			//available.
			else {
				CERN_EventListener.addListener(this, "viewableEncntrInfoAvailable", this.HandleViewableEncounters, this);
			}
		}
	});

	//Setter and Getter methods for viewable encounters
	NotesRemindersComponent.method("setViewableEncntrs", function(value) {
		this.m_viewableEncntrs = value;
	});

	NotesRemindersComponent.method("getViewableEncntrs", function() {
		return (this.m_viewableEncntrs);
	});

	NotesRemindersComponent.method("setStickyNoteTypeCodes", function(value) {
		this.m_stickyNoteTypeCodes = value;
	});

	NotesRemindersComponent.method("addStickyNoteTypeCode", function(value) {
		if (this.m_stickyNoteTypeCodes === null) {
			this.m_stickyNoteTypeCodes = [];
		}
		this.m_stickyNoteTypeCodes.push(value);
	});

	NotesRemindersComponent.method("getStickyNoteTypeCodes", function() {
		return this.m_stickyNoteTypeCodes;
	});
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
NotesRemindersComponent.prototype = new MPageComponent();
NotesRemindersComponent.prototype.constructor = MPageComponent;

/** @constructor set Sticky Notes filter in the component
 * 	@param {integer} value : The value contains what value should be set with.
 */
NotesRemindersComponent.prototype.setStickyNotesFilter = function(value) {
	this.m_stickyNoteFilter = value;
};

/** Whether to display sticky notes or not.
 * 	@return{integer} : bedrock setting value.
 */
NotesRemindersComponent.prototype.getStickyNotesFilter = function() {
	return this.m_stickyNoteFilter;
};

/**
 * Method to generate html to add the look forward menu to subheader
 */
NotesRemindersComponent.prototype.createComponentLookForward = function() {
	var rComponent = this;
	var lookforwardItems = [this.notesI18n.ALL, this.notesI18n.TODAY, this.notesI18n.TOMORROW, this.notesI18n.NEXT_WEEK, this.notesI18n.NEXT_MONTH, this.notesI18n.NEXT_YEAR];
	var uniqueComponentId = this.getComponentId();
	var staticContentLocation = this.getCriterion().static_content;

	//Helper function to handle clicking a lookforward item in the lookforward menu
	function handleLookforwardClick(menuItem, lookforwardItem) {
		return function() {
			//Uncheck all menu items
			var menuItems = lookforwardMenu.getMenuItemArray();
			for (var i = 0; i < menuItems.length; i++) {
				menuItems[i].setIsSelected(false);
			}
			//Check the menu item you selected
			menuItem.setIsSelected(true);
			//Make the call to refresh the component with the new lookforward
			//Toggle the lookforward display
			$("#lookforwardDisplay" + uniqueComponentId).html(lookforwardItem);

			//Set look forward code to index of look forward item in lookforwardItems. Default is 0 or "All Visits"
			rComponent.lookforwardCode = lookforwardItems.indexOf(lookforwardItem);
			//filter reminders by look forward
			rComponent.filterReminders();
		};
	}

	var lookforwardDisplayText = this.notesI18n.ALL;
	var lookforwardId = "lookforwardDisplay" + uniqueComponentId;

	var lookforwardContainer = $("<div></div>").attr("id", "lookforwardContainer" + uniqueComponentId);
	lookforwardContainer.append($("<span></span>").attr("id", "resultRange" + uniqueComponentId).html(this.notesI18n.RESULT_RANGE + ": ").css("padding-right", "2px"));
	lookforwardContainer.append($("<span></span>").attr({
		"id" : lookforwardId,
		"class" : "nr-lookforward"
	}).html(lookforwardDisplayText));

	//Create the lookforward menu
	var lookforwardMenu = new Menu("lookforwardMenu" + uniqueComponentId);
	lookforwardMenu.setAnchorElementId("lookforwardMenu" + uniqueComponentId);
	lookforwardMenu.setAnchorConnectionCorner(["bottom", "left"]);
	lookforwardMenu.setContentConnectionCorner(["top", "left"]);
	lookforwardMenu.setIsRootMenu(true);

	//Iterate over the lookforward menu items and create menu items for them
	for (var x = 0; x < lookforwardItems.length; x++) {
		var lookforwardItem = lookforwardItems[x];
		var lookforwardMenuSelector = new MenuSelection("lookforwardMenuItem" + uniqueComponentId + "-" + x);
		lookforwardMenuSelector.setCloseOnClick(true);
		lookforwardMenuSelector.setLabel(lookforwardItem);
		lookforwardMenuSelector.setClickFunction(handleLookforwardClick(lookforwardMenuSelector, lookforwardItem));
		lookforwardMenu.addMenuItem(lookforwardMenuSelector);
	}
	MP_MenuManager.updateMenuObject(lookforwardMenu);

	if (this.isOrganizerLevel) {
		staticContentLocation = staticContentLocation + "/UnifiedContent";
	}

	var lookforwardDropDown = $("<a></a>").append($("<img></img>").attr({
		"id" : "lookforwardMenu" + uniqueComponentId,
		"src" : staticContentLocation + "/images/3943_16.gif"
	}));
	lookforwardDropDown.click(function() {
		if (!lookforwardMenu.isActive()) {
			MP_MenuManager.showMenu("lookforwardMenu" + uniqueComponentId);
		}
		else {
			MP_MenuManager.closeMenuStack(true);
		}
	});
	lookforwardDropDown.appendTo(lookforwardContainer);
	return lookforwardContainer;
};

NotesRemindersComponent.prototype.postProcessing = function() {
	MPageComponent.prototype.postProcessing.call(this);
	if (this.remindersCount === 0) {
		//Update the component result count
		CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
			"count" : 0
		});
	}
};

/**
 * Determine chart level or organizer level and set flag accordingly.
 */
NotesRemindersComponent.prototype.setViewFlag = function() {
	//if organizer level person id,enctr id and ppr code is 0
	var criterion = this.getCriterion();
	this.isOrganizerLevel = (criterion.person_id === 0 && criterion.encntr_id === 0 && criterion.ppr_cd === 0);
	var self = this;
	var compId = this.getComponentId();

	//on care manager selected event, in care manager supervisor organizer page update the provider id with the selected care
	// managers id.
	if (this.isOrganizerLevel) {
		$(document).on('careManagerSelected', function(event) {
			self.provider_id = event.careManagerId;
			self.retrieveComponentData();
		});
	}
};

/**
 * Handle the viewable encounters information for the patient and store within the component object.
 *
 * @param {Object} event : an event object
 * @param {object] srObj : The viewableEncntrs shared resource object
 */
NotesRemindersComponent.prototype.HandleViewableEncounters = function(event, srObj) {
	if (srObj.isResourceAvailable() && srObj.getResourceData()) {
		this.setViewableEncntrs(srObj.getResourceData());
		this.retrieveComponentData();
	}
	else {
		var errMsg = "No viewable encounters available for this patient";
		this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(), errMsg), (this.isLineNumberIncluded() ? "(0)" : ""));
	}
};

/**
 * Get bedrock settings for sticky notes and map to our variable in component
 */
NotesRemindersComponent.prototype.loadFilterMappings = function() {
	//Add the filter mapping object for sticky notes
	this.addFilterMappingObject("DEFINE_STICKY_NOTE", {
		setFunction : this.setStickyNotesFilter,
		type : "Boolean",
		field : "FREETEXT_DESC"
	});
};

/**
 * Retrieve all notes/reminders for criterion.
 */
NotesRemindersComponent.prototype.retrieveComponentData = function() {
	var compId = this.getComponentId();
	var criterion = this.getCriterion();
	var sStickyNoteTypes = MP_Util.CreateParamArray(this.getStickyNoteTypeCodes(), 1);
	var prsnlInfo = criterion.getPersonnelInfo();
	var encntrs = this.getViewableEncntrs();
	var encntrVal = (encntrs) ? "value(" + encntrs + ")" : "0.0";
	var lookbackUnits = (this.getLookbackUnits()) ? this.getLookbackUnits() : '0';
	var lookbackUnitTypeFlag = this.getLookbackUnitTypeFlag();
	var loadTimer = new RTMSTimer(this.getComponentLoadTimerName(), criterion.category_mean);
	var self = this;

	//reset valid subtypes. this is for care manger supervisor where different care managers will have different valid subtype filter.
	this.validSubTypes = [];

	var scriptRequest = new ScriptRequest();
	scriptRequest.setProgramName("MP_RETRIEVE_NOTE_REMINDER_JSON");

	/*The MP_RETRIEVE_NOTE_REMINDER_JSON CCL program takes in a parameter which is a sum of mask it needs to set in order to retrieve
	 * codes.
	 *LOAD_STICKNOTES_IND at 1, LOAD_NOTESREMINDERS_IND at 2, RESOLVE_CODES_IND at 4 & RESOLVE_PRSNL_IND at 8
	 * So, if we would like to get all we need to sum all four and pass it as a parameter to MP_RETRIEVE_NOTE_REMINDER_JSON program,
	 */
	scriptRequest.setParameterArray(["^MINE^", criterion.person_id + ".0", sStickyNoteTypes, 15, encntrVal, lookbackUnits, lookbackUnitTypeFlag, this.provider_id + ".0", criterion.ppr_cd + ".0"]);
	scriptRequest.setLoadTimer(loadTimer);
	scriptRequest.setResponseHandler(function(scriptReply) {
		//if subtype filter dropdown div exists remove it and then update it inside render Component.
		$("#" + compId + 'subtypeDropdown').remove();

		if (scriptReply.getStatus() == 'S') {//success
			self.renderComponent(scriptReply.getResponse());
		}
		else {//display no results found. set component menu to default.Possible when different care managers are selected and one caremanagr
			// has menu rendered from previous care manager.
			$("#" + 'filterSubType' + compId).remove();
			$("#" + 'optsMenupersonalize' + compId).removeClass('opts-personalize-sec-divider');
			self.finalizeComponent(self.generateNoDataFoundHTML(), (self.isLineNumberIncluded() ? "(0)" : ""));
		}
	});
	scriptRequest.performRequest();
};

/**
 * Creates the patient link. On clicking it the patient chart view is launched.
 * @param {String} personId : Person id
 * @param {String] encntrId : Encounter id
 * @param {String] patientName : Name of the patient
 */
NotesRemindersComponent.prototype.createPatientChartViewerLink = function(personId, encntrId, patientName) {
	var patientLink = "";
	if (personId) {
		if (!CERN_Platform.inMillenniumContext()) {
			patientLink = patientName;
		}
		else {
			patientLink = '<a href="javascript:APPLINK(0,\'Powerchart.exe\',\'/PERSONID=' + personId + ' /ENCNTRID=' + encntrId + ' /FIRSTTAB=^^\')">' + patientName + '</a>';
		}
	}
	return patientLink;
};

/**
 * Creates the subject link. On clicking the it the reminder viewer is launched.
 * @param {String} taskId : Task Id
 * @param {String} taskUID : Task uid
 * @param {String] compId : Component id
 * @param {String] msgSub : Message Subject in Reminder
 */
NotesRemindersComponent.prototype.createReminderViewerLink = function(taskId, taskUID, compId, msgSub, readOnly, assignedID) {
	var subjectLink = "";

	if (taskId > 0) {
		if (!CERN_Platform.inMillenniumContext()) {
			subjectLink = msgSub;
		}
		else {
			subjectLink = "<a id=" + taskId + " onclick='NotesRemindersComponent.prototype.launchReminderViewer(" + taskId + ",\"" + taskUID + "\"," + compId + "," + assignedID + "," + readOnly + "," + this.isOrganizerLevel + "); return false;' href='#'>" + msgSub + "</a>";
		}
		return (subjectLink);
	}
};

/**
 * @param {number} taskId : the ID of the task (reminder).
 * @param {string} taskUID : the UID of the task (reminder).
 * @param {number} compId : the component ID.
 * @param {number} pId : the assigned person ID of the task.
 * @param {boolean} readOnly : the readOnly flag of the reminder.
 * @param {boolean} viewFlag : flag to determine which view we are in.
 * This will be the event handler for the click on the Subject link
 */
NotesRemindersComponent.prototype.launchReminderViewer = function(taskId, taskUID, compId, pId, readOnly, viewFlag) {
	var comp = MP_Util.GetCompObjById(compId);
	try {
		var viewerObj = CERN_Platform.getDiscernObject("PVVIEWERMPAGE");
		MP_Util.LogDiscernInfo(null, "PVVIEWERMPAGE", "notesreminders.js", "launchReminderViewer");
		//if in organizer level
		if (viewFlag) {
			if ( typeof viewerObj.LaunchRemindersWithUIDViewer === "undefined") {
				viewerObj.LaunchRemindersViewer(taskId);
			}
			else {
				viewerObj.LaunchRemindersWithUIDViewer(taskUID, readOnly);
			}
		}
		else {//else in chart level
			if ( typeof viewerObj.LaunchRemindersWithOwnerViewer === "undefined") {
				viewerObj.LaunchRemindersViewer(taskId);
			}
			else {
				viewerObj.LaunchRemindersWithOwnerViewer(taskId, pId, readOnly);
			}
		}
		//if not readOnly some updates could have been performed by launching reminders viewer. So fetch new data.
		if (!readOnly) {
			comp.retrieveComponentData();
		}
	}
	catch (err) {
		MP_Util.LogJSError(err, comp, "notesreminders.js", "launchReminderViewer");
	}
};

/**
 * @param {object} task : the reminder being processed.
 * @return {boolean}
 * Checks whether the reminder was sent or assigned by the signed on provider.
 */
NotesRemindersComponent.prototype.isAssignedToReminder = function(task) {
	var pId = this.getCriterion().provider_id;
	if (task.ASSIGN_PRSNL_LIST.length === 0) {
		task.ASSIGNED = "&nbsp;";
		task.ASSIGNEDID = pId;
		task.READONLY = false;
		return true;
	}

	for (var l = task.ASSIGN_PRSNL_LIST.length; l--; ) {
		if (task.ASSIGN_PRSNL_LIST[l].ASSIGN_PRSNL_ID === pId) {
			task.ASSIGNED = task.ASSIGN_PRSNL_LIST[l].ASSIGN_PRSNL_NAME;
			task.ASSIGNEDID = pId;
			task.READONLY = false;
			return true;
		}
	}
	if (task.ASSIGN_PRSNL_LIST.length === 1) {
		task.ASSIGNED = task.ASSIGN_PRSNL_LIST[0].ASSIGN_PRSNL_NAME;
	}
	else {
		task.ASSIGNED = this.notesI18n.MULTIPLE;
	}

	task.READONLY = true;
	task.ASSIGNEDID = task.ASSIGN_PRSNL_LIST[0].ASSIGN_PRSNL_ID;
	return false;
};

/*
 * Creates a span with the standard class: res-severe used for rendering the high priority icon and rem1-pr-icon-align to align to
 * the center of the column.
 */
NotesRemindersComponent.prototype.getPriorityIcon = function() {
	var ar = ["<span class='res-severe'><span class='res-ind'>&nbsp;</span></span>"];
	return ar.join("");
};

/**
 * Helper function to sort the reminders.
 */
NotesRemindersComponent.prototype.SortReminders = function(a, b) {
	if (a.SCHEDULED_DT_TM > b.SCHEDULED_DT_TM) {
		return -1;
	}
	else if (a.SCHEDULED_DT_TM < b.SCHEDULED_DT_TM) {
		return 1;
	}
	else if (a.TASK_DT_TM > b.TASK_DT_TM) {
		return -1;
	}
	else if (a.TASK_DT_TM < b.TASK_DT_TM) {
		return 1;
	}
	return 0;
};

/**
 * Process and render the results for the reminders component table
 * @param recordData {JSON Object} The retrieved JSON to generate the HTML markup
 */
NotesRemindersComponent.prototype.processResultsForRender = function(recordData) {
	var self = this;
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var reminders = recordData.REMINDERS;
	var prsnlArray = recordData.PRSNL;
	var remLength = reminders.length;
	var curDate = new Date();
	var validReminders = [];
	var validMyReminders = [];
	var subjectLink = "";
	var readOnly = "";
	var overdueOverride = compNS + "-overdue-override";

	if (remLength > 0) {
		reminders.sort(this.SortReminders);
	}

	for (var x = 0; x < remLength; x++) {
		var reminder = reminders[x];
		var remindDate = new Date();
		remindDate.setISO8601(reminder.REMIND_DT_TM);
		if (remindDate && remindDate <= curDate) {
			var msgSubj = reminder.MSG_SUBJECT;
			var taskId = reminder.TASK_ID;
			var taskUID = reminder.TASK_UID;
			var overdueClass = "";
			var df = MP_Util.GetDateFormatter();
			var dueDateDisplay = "";
			var dueDate = (reminder.SCHEDULED_DT_TM.search("0000-00-00") !== -1) ? null : new Date();
			if (dueDate) {
				dueDate.setISO8601(reminder.SCHEDULED_DATE);
				dueDateDisplay = df.format(dueDate, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
				overdueClass = (dueDate <= curDate) ? "res-severe" : "";
			}
			else {
				dueDateDisplay = "--";
			}

			//Set up Due date display
			reminder.DUE_DATE_DISPLAY = "<span class = " + "'" + overdueClass + "'" + " 'nr-content'>" + dueDateDisplay + "</span>";

			//Set up Priority
			if (reminder.STAT_IND === 1) {
				reminder.PRIORITY_DISPLAY = self.getPriorityIcon();
			}

			//Take the opposite if assigned. The reminder will be readOnly if the reminder is not assigned. It will be false if the reminder is
			// assigned.
			this.isAssignedToReminder(reminder);
			readOnly = reminder.READONLY;
			assignedID = reminder.ASSIGNEDID;

			//read only flag not applicable to organizer level
			subjectLink = (msgSubj !== "") ? self.createReminderViewerLink(taskId, taskUID, compId, msgSubj, ((this.isOrganizerLevel) ? false : readOnly), assignedID) : "(" + self.notesI18n.NO_SUBJECT + ")";

			var subtypeDisplay = reminder.TASK_SUBTYPE_DISPLAY;
			//if subtype is not empty and doesn't exist in validSubTypes array add to validSubTypes array
			if (subtypeDisplay) {
				if (self.validSubTypes.indexOf(subtypeDisplay) === -1) {
					self.validSubTypes.push(subtypeDisplay);
				}
			}

			//if subtype is empty add a non breaking space for subtype
			reminder.SUBJECT_SUBTYPE_DISPLAY = "<span class = " + "'" + overdueClass + "'" + " 'nr-content'>" + subjectLink + "</span> <br>" + "<span class = " + "'" + overdueOverride + "'" + " 'nr-content'>" + ( subtypeDisplay ? subtypeDisplay : "&nbsp;") + "</span>";

			reminder.ASSIGNED_DISPLAY = "<span class = " + "'" + overdueClass + "'" + " 'nr-content'>" + reminder.ASSIGNED + "</span>";

			//create patient info for organizer level
			if (self.isOrganizerLevel) {
				var patientName = reminder.PERSON_NAME;
				var personId = reminder.PATIENT_ID;
				var encntrId = reminder.ENCNTR_ID;
				var patientLink = "--";
				var patientDOB = "--";

				//Store patient MRN.
				var patientMRN = "--";
				if (reminder.PATIENT_ID > 0 && reminder.PERSON_NAME) {
					patientLink = "<span class = " + "'" + overdueClass + "'" + " 'nr-content'>" + "<b>" + self.createPatientChartViewerLink(personId, encntrId, patientName) + " </b>" + "</span>";

					if (reminder.MRN) {
						patientMRN = reminder.MRN;
					}
				}
				//Store patient gender.
				var patientGender = reminder.GENDER.charAt(0);
				var patientAge = "&nbsp;";

				var parseBirthDate = Date.parse(reminder.BIRTH_DATE);

				//chek that patient has valid birth date.
				if (!isNaN(parseBirthDate)) {
					var patientBirthDtTm = new Date();
					patientBirthDtTm.setISO8601(reminder.BIRTH_DATE);
					//replace all spaces with non breaking space so that proper word wrap happens when in reduced resolution or when less space is
					// available.
					patientAge = MP_Util.CalcAge(patientBirthDtTm, new Date()).replace(" ", "&nbsp;");
					patientDOB = df.format(patientBirthDtTm, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR).substr(0, 8);
				}

				reminder.PATIENT_INFO = patientLink + patientAge + "&nbsp;" + patientGender + "<br>" + self.notesI18n.DOB + ":&nbsp;" + patientDOB + " " + self.notesI18n.MRN + ":&nbsp;" + patientMRN;
			}

			validReminders.push(reminder);
			if (self.isAssignedToReminder(reminder)) {
				validMyReminders.push(reminder);
			}
		}
	}
	this.myAssignedProcessedReminders = validMyReminders;
	this.processedReminders = validReminders;
	this.remindersCount = (this.isOrganizerLevel) ? validReminders.length : validMyReminders.length;
};

/**
 * Filter data by subtype and my assigned reminders. Refresh reminders table with new data and update total notes/reminders counts.
 */
NotesRemindersComponent.prototype.filterReminders = function() {
	var compId = this.getComponentId();
	var reminders = this.processedReminders;

	//if chart level and my assigned reminders is checked ,filter from myAssignedProcessedReminders .
	if (!this.isOrganizerLevel && this.myAssignedRemindersFlag) {
		reminders = this.myAssignedProcessedReminders;
	}

	//filter by look forward date
	reminders = this.filterRemindersByForwardDate(reminders);

	//if no filter display return reminders for all subtypes
	if (this.subType === this.notesI18n.ALL_SUBTYPES) {
		this.remindersTable.bindData(reminders);
		this.remindersCount = reminders.length;
		$('#reminderCount').text(this.notesI18n.REMINDERS + " (" + this.remindersCount + ")");
	}
	else {//else create reminders for only subtype chosen. Essentially a subset of the entire set of reminders.
		var newReminders = [];
		for (var x = 0; x < reminders.length; x++) {
			var reminder = reminders[x];
			if (reminder.TASK_SUBTYPE_DISPLAY === this.subType) {
				newReminders.push(reminder);
			}
		}
		this.remindersTable.bindData(newReminders);
		this.remindersCount = newReminders.length;
		$('#reminderCount').text(this.notesI18n.REMINDERS + " (" + this.remindersCount + "), " + this.subType);
	}

	//rerender the component table to display the table header if there were no assigned reminders on inital load
	if (this.isRenderComponentTable) {
		this.isRenderComponentTable = false;
		$("#" + compId + "tableview").html(this.remindersTable.render());
	}
	else {
		this.remindersTable.refresh();
	}

	this.resultsCount = this.remindersCount + this.notesCount;
	$('#nr' + compId + ' .sec-total').text("(" + this.resultsCount + ")");

	//if chart level
	if (!this.isOrganizerLevel) {
		//if my assigned reminders flag set, hide the assigned to column.increase subject and due date column width.
		if (this.myAssignedRemindersFlag) {
			$('#nr' + compId + 'table .nr-assignedto').hide();
			this.reSizeColumns(67, 25);
		}
		else {//else show the assigned to column.reset widths
			$('#nr' + compId + 'table .nr-assignedto').show();
			this.reSizeColumns(45, 21);
		}
	}
};

/**
 * Takes in reminders object and modifies it to have only reminders that need to be completed within the selected look forward date
 * filter.
 * @param  {[object]} all reminders that needs to be filtered.
 * @return {[filteredReminders]} subset of all reminders after filtering.
 */
NotesRemindersComponent.prototype.filterRemindersByForwardDate = function(reminders) {
	var filterDate = new Date();
	filterDate.setHours(23, 59, 59);

	switch(this.lookforwardCode) {
		case 1:
			//Today.
			break;

		case 2:
			//Tomorrow
			filterDate.setDate(filterDate.getDate() + 1);
			break;

		case 3:
			//Next week
			filterDate.setDate(filterDate.getDate() + 7);
			break;

		case 4:
			//Next month
			filterDate.setMonth(filterDate.getMonth() + 1);
			break;

		case 5:
			//Next year
			filterDate.setFullYear(filterDate.getFullYear() + 1);
			break;

		default:
			//default. don't filter by look forward date
			return reminders;
	}

	var filteredReminders = [];

	for (var i = 0; i < reminders.length; i++) {
		var reminder = reminders[i];
		var dueDate = (reminder.SCHEDULED_DT_TM.search("0000-00-00") !== -1) ? null : new Date();
		if (dueDate) {
			dueDate.setISO8601(reminder.SCHEDULED_DATE);
			if (dueDate <= filterDate) {
				filteredReminders.push(reminder);
			}
		}
		else {
			filteredReminders.push(reminder);
		}
	}

	return filteredReminders;
};

/**
 * Modify width for subject and due date columns.
 * @param {Integer} subjectWidth : width of subject column in %
 * @param {Integer] dueDateWidth : width of due date column in %
 */
NotesRemindersComponent.prototype.reSizeColumns = function(subjectWidth, dueDateWidth) {
	var compId = this.getComponentId();
	$('#nr' + compId + 'table .nr-subject').css({
		"width" : subjectWidth + '%'
	});
	$('#nr' + compId + 'table .nr-due-date').css({
		"width" : dueDateWidth + '%'
	});
};

/**
 * Function to generate html for the subtype dropdown that will be added to the component menu.
 */
NotesRemindersComponent.prototype.generateSubtypeDropdown = function() {
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var subTypesHtml = "<div id ='" + compId + "subtypeDropdown'" + " style='display:none' " + ">" + "<div id=" + "'" + compId + this.notesI18n.ALL_SUBTYPES + "'" + " class='nr-opts-menu-subtype-item'" + ">" + this.notesI18n.ALL_SUBTYPES + "</div>";

	for (var i = 0; i < this.validSubTypes.length; i++) {
		subTypesHtml = subTypesHtml + "<div id=" + "'" + compId + this.validSubTypes[i] + "'" + " class='nr-opts-menu-subtype-item'" + ">" + this.validSubTypes[i] + "</div>";
	}
	subTypesHtml = subTypesHtml + "</div>";
	return subTypesHtml;
};

/**
 * Function to generate html for the sticky notes section
 */
NotesRemindersComponent.prototype.generateNotesHtml = function(recordData) {
	var notesHtml = [];
	var noteCnt = 0;
	var notes = recordData.NOTES;
	var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);

	var xl = notes.length;
	if (notes.length > 0) {
		notesHtml.push("<dl class='nr-info-hdr hdr'><dd class='nr-auth-hd nr-wrap'><span>", this.notesI18n.AUTHOR, "</span></dd><dd class='nr-dt-hd nr-wrap'><span>", this.notesI18n.DATE, "</span></dd><dd class='nr-txt-hd nr-wrap'><span>", this.notesI18n.TEXT, "</span></dd></dl>");
		for (var x = 0; x < xl; x++) {
			noteCnt = noteCnt + 1;
			var note = notes[x];
			var prov = MP_Util.GetValueFromArray(note.AUTHOR_ID, personnelArray);
			var authorName = (prov) ? prov.fullName : "";
			var notesDate = (note.NOTE_DATE !== "") ? MP_Util.GetDateFormatter().formatISO8601(note.NOTE_DATE, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR) : "";
			notesHtml.push("<dl class='nr-info'><dd class='nr-auth nr-wrap'><span>", authorName, "</span></dd><dd class='nr-dt nr-wrap'><span class='date-time'>", notesDate, "</span></dd><dd class='nr-txt nr-wrap'><span>", note.TEXT, "</span></dd></dl>");
		}
	}

	this.notesCount = noteCnt;
	return notesHtml;
};

/**
 * This is the NotesRemindersComponent implementation of the renderComponent function.  It takes the information retrieved from the
 * script
 * call and renders the component's visuals.
 */
NotesRemindersComponent.prototype.renderComponent = function(reply) {
	var self = this;
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var errMsg = [];
	var recordData = reply;
	var timerRenderComponent = null;
	var remindersHtml = [];
	var df = MP_Util.GetDateFormatter();

	try {
		//Create the render timer
		timerRenderComponent = MP_Util.CreateTimer(this.getComponentRenderTimerName());
		//notes
		var notesHtml = [];
		//if chart level and stiky notes display set to true in bedrock generate html for sticky notes.
		if (!this.isOrganizerLevel && this.m_stickyNoteFilter)
			notesHtml = this.generateNotesHtml(recordData);

		//reminders
		remindersHtml.push("<div id ='" + compId + "mainContainer' class ='" + compNS + "-maincontainer " + compNS + "-maincontainer-position'>");
		remindersHtml.push("<div id ='" + compId + "tableview' class='" + compNS + "-table'>");

		this.processResultsForRender(recordData);
		this.remindersTable = new ComponentTable();
		this.remindersTable.setNamespace(this.getStyles().getId());

		//Create the priority column
		var priorityColumn = this.createRemindersColumn("PRIORITY", "nr-priority nr-rem-wrap", this.getPriorityIcon(), '${ PRIORITY_DISPLAY }');
		//Create the patient column
		var patientColumn = this.createRemindersColumn("PATIENT", "nr-patient nr-rem-wrap", this.notesI18n.PATIENT, '${ PATIENT_INFO }');
		//Create the subject/subtype combiantion column for organizer level
		var subject_subtypecolumn = this.createRemindersColumn("SUBJECT_SUBTYPE", "nr-subject nr-rem-wrap", this.notesI18n.SUBJECT + " / " + this.notesI18n.SUBTYPE, '${ SUBJECT_SUBTYPE_DISPLAY }');
		//Create the due date column
		var dueDateColumn = this.createRemindersColumn("DUEDATE", "nr-due-date nr-rem-wrap", this.notesI18n.DUE, '${ DUE_DATE_DISPLAY }');
		//create the assigned column
		var assignedColumn = this.createRemindersColumn("ASSIGNED", "nr-assignedto nr-rem-wrap", this.notesI18n.ASSIGNED, '${ ASSIGNED_DISPLAY }');

		this.remindersTable.addColumn(priorityColumn);
		//if organizer level set the columns as priority, patient , subject+subtype and Due Date.
		if (this.isOrganizerLevel) {
			this.remindersTable.addColumn(patientColumn);
			this.remindersTable.addColumn(subject_subtypecolumn);
			this.remindersTable.addColumn(dueDateColumn);
		}
		else {//if chart level set the columns as priority, subject+subtype , Due Date and assigned to.
			this.remindersTable.addColumn(subject_subtypecolumn);
			this.remindersTable.addColumn(dueDateColumn);
			this.remindersTable.addColumn(assignedColumn);
		}

		//call the filterReminders function to display the filtered data if not initial render
		if (!this.myAssignedRemindersFlag || this.subType !== this.notesI18n.ALL_SUBTYPES) {
			this.filterReminders();
		}
		else {
			if (this.isOrganizerLevel) {
				this.remindersTable.bindData(this.processedReminders);
			}
			else {//else if initial rendering and in chart view bind the logged in users assigned reminders
				this.remindersTable.bindData(this.myAssignedProcessedReminders);
				this.isRenderComponentTable = (this.myAssignedProcessedReminders.length === 0) ? true : false;
			}
		}

		this.setComponentTable(this.remindersTable);
		this.remindersTable.sortByColumnInDirection("PRIORITY", TableColumn.SORT.DESCENDING);

		remindersHtml.push(this.remindersTable.render());

		var filterSubTypeDivId = "filterSubType" + compId;
		//create subtype dropdown for filtering inside reminders component.
		var dropDowDivId = '#' + compId + 'subtypeDropdown';

		//add filter by SubType to component menu if validSubTypes is not empty
		if (this.validSubTypes.length > 0) {
			this.addMenuOption(filterSubTypeDivId, filterSubTypeDivId, self.notesI18n.FILTER_SUBTYPE, false, "mouseenter", function() {
				// forget any hiding events in timer
				clearTimeout(self.subtypetimeOut);
				$(dropDowDivId).addClass("nr-opts-menu-content");
				$(dropDowDivId).show();
			});
		}

		var assignedRemindersDivId = "myReminders" + compId;
		//add show only my reminders to component menu in patient/chart level
		if (!this.isOrganizerLevel) {
			this.addMenuOption(assignedRemindersDivId, assignedRemindersDivId, self.notesI18n.MY_REMINDERS, false, "click", function() {
				//on click reverse myAssignedRemindersFlag flag and refresh the table with updated counts.
				self.myAssignedRemindersFlag = !(self.myAssignedRemindersFlag);
				if (self.myAssignedRemindersFlag) {//add checkmark
					$('#' + assignedRemindersDivId).append("<span class='opts-menu-def-exp'>" + "&nbsp;" + '</span>');
				}
				else {//remove checkmark
					$('#' + assignedRemindersDivId).find('span').remove();
				}
				self.filterReminders();
			});
		}

		//adds the new menu options to component menu
		this.createMenu();

		//add check mark indicating that my assigned reminders is enabled.
		if (this.myAssignedRemindersFlag) {
			$('#' + assignedRemindersDivId).append("<span class='opts-menu-def-exp'>" + "&nbsp;" + '</span>');
		}

		var jsNrHTML = [];

		if (!this.isOrganizerLevel && this.m_stickyNoteFilter) {
			jsNrHTML = ["<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", this.notesI18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", this.notesI18n.STICKY_NOTES, " (", this.notesCount, ")</span></h3><div class='sub-sec-content'>", notesHtml.join(""), "</div></div><div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", this.notesI18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title' id ='reminderCount'>", this.notesI18n.REMINDERS, " (", this.remindersCount, ")</span></h3><div class='sub-sec-content'>", remindersHtml.join(""), "</div></div></div>"];
		}
		else {
			jsNrHTML = ["<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", this.notesI18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title' id ='reminderCount'>", this.notesI18n.REMINDERS, " (", this.remindersCount, ")</span></h3><div class='sub-sec-content'>", remindersHtml.join(""), "</div></div></div>"];
		}

		this.resultsCount = this.remindersCount + this.notesCount;
		this.finalizeComponent(jsNrHTML.join(""), MP_Util.CreateTitleText(this, this.resultsCount));

		CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
			count : this.remindersCount
		});

		$('#moreOptMenu' + compId).append(self.generateSubtypeDropdown());

		//Hide my assigned column if my assigned reminders flag is set.
		if (!this.isOrganizerLevel && this.myAssignedRemindersFlag) {
			$('#nr' + compId + 'table .nr-assignedto').hide();
			this.reSizeColumns(67, 25);
		}

		$(dropDowDivId).mouseenter(function() {
			clearTimeout(self.subtypetimeOut);
			$(dropDowDivId).addClass("nr-opts-menu-content");
			$(dropDowDivId).show();
		});

		// set a timer to hide the DIV
		$('#' + filterSubTypeDivId).mouseleave(function() {
			self.subtypetimeOut = setTimeout(function() {
				$(dropDowDivId).hide();
			}, 200);
		});

		$(dropDowDivId).mouseleave(function() {
			self.subtypetimeOut = setTimeout(function() {
				$(dropDowDivId).hide();
			}, 333);
		});

		//filter reminders based on subtype when a subtype is selected.
		$('#' + compId + 'subtypeDropdown > div').on('click', function(e) {
			//get subtype text and store it.
			self.subType = $(this).text();
			self.filterReminders();
			$(dropDowDivId).hide();
		});

		//remove the existing content from subheader and add the look forward menu to subheader
		$('#sttnr' + compId).html(this.createComponentLookForward());

		//add horizontal scrollbar for reminders if width is less than 350 px.
		$('#nrContent' + compId).css({
			'overflow' : 'auto'
		});
		$('#nrContent' + compId).children().css({
			'min-width' : '350px',
			'overflow-x' : 'auto'
		});
	}
	catch (err) {
		if (timerRenderComponent) {
			timerRenderComponent.Abort();
			timerRenderComponent = null;
		}
		MP_Util.LogJSError(this, err, "notesreminders.js", "renderComponent");
		//Throw the error to the architecture
		throw (err);
	}
	finally {
		if (timerRenderComponent) {
			timerRenderComponent.Stop();
		}
	}
};

/**
 * [createRemindersColumn Take in column id, class, column display  and render template and create a new TableColumn object and
 * return it.]
 * @param  columnId       [column id]
 * @param  customClass    [custom class applicable to column]
 * @param  columnDisplay  [display name for column]
 * @param  renderTemplate [rendering template]
 * @return                [A TableColumn object]
 */
NotesRemindersComponent.prototype.createRemindersColumn = function(columnId, customClass, columnDisplay, renderTemplate) {
	var tableColumn = new TableColumn().setColumnId(columnId).setCustomClass(customClass).setColumnDisplay(columnDisplay).setRenderTemplate(renderTemplate);
	return tableColumn;
};

/**
 * Map the Activities Notes/Reminders object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "Notes/Reminders" filter
 */
MP_Util.setObjectDefinitionMapping("notes", NotesRemindersComponent);
