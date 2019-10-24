/**
 * Create the component style object which will be used to style various aspects of our component
 */
function RemindersOpt1ComponentStyle() {
	this.initByNamespace("rem1");
}

RemindersOpt1ComponentStyle.prototype = new ComponentStyle();
RemindersOpt1ComponentStyle.prototype.constructor = ComponentStyle;

/**
 * @constructor
 * Initialize the Reminders Option 2 component
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 */
function RemindersOpt1Component(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new RemindersOpt1ComponentStyle());
	//Set the timer names so the architecture will create the correct timers for our use
	this.setComponentLoadTimerName("USR:MPG.REMINDERS.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.REMINDERS.O2 - render component");
	//Make sure the architecture includes the result count when creating the count text
	this.setIncludeLineNumber(true);
	this.setScope(1);
	//Set the flag to always show this component as expanded
	this.setAlwaysExpanded(true);
	this.addStylesheetToHead();
	this.resultsCount = 0;
	this.remo1i18n = i18n.discernabu.reminders_o1;
	//component table
	this.remindersTable = null;
	this.m_sidePanelContainer = null;
	this.m_mainContainer = null;
	this.m_sidePanel = null;
	this.m_sidePanelMinHeight = 251;
	this.m_tableView = null;
	this.m_viewableEncntrs = "";
	this.m_lastSelectedRow = "";
	this.m_selectedRowId = "";
	this.setResourceRequired(true); 
	this.myAssignedProcessedReminders = null;
	this.processedReminders = null;
	this.validSubtype = [];
	this.subtype = this.remo1i18n.ALL_SUBTYPE;
	this.myAssignedRemindersFlag = true;
	this.isChartView = null;
	this.lookForwardCode = 0;
	this.isRenderComponentTable = false;

	this.setViewFlag();
	/**
	 * Retrive the viewable encounters from shared resources if it is available. if it is not available then it calls HandleViewableEncounters
	 */

	RemindersOpt1Component.method("RetrieveRequiredResources", function() {
		if(this.isChartView){
			//Create and/or retrieve Viewable Encounters shared resource
			var veObj = MP_Core.GetViewableEncntrs(this.getCriterion().person_id);

			//If veObj data is available, immediately load component. 
			if(veObj.isResourceAvailable() && veObj.getResourceData()) {
				 
				this.setViewableEncntrs(veObj.getResourceData());
				this.retrieveComponentData();
			}
			//If the data is not yet available, MP_Core.GetViewableEncntrs will fire the viewableEncntrInfoAvailable event when the data becomes available. 
			else {
				CERN_EventListener.addListener(this, "viewableEncntrInfoAvailable", this.HandleViewableEncounters, this);
			}
		}
		else{
			this.retrieveComponentData();
		}
	});

	/**
	 * Handle the viewable encounters information for the patient and store within the component object.
	 * 
	 * @param {Object} event : an event object
	 * @param {object] srObj : The viewableEncntrs shared resource object
	 */
	RemindersOpt1Component.method("HandleViewableEncounters", function(event, srObj){
		if(srObj.isResourceAvailable() && srObj.getResourceData()){
			this.setViewableEncntrs(srObj.getResourceData());
			this.retrieveComponentData();
		} else {
			var errMsg = "No viewable encounters available for this patient";
			this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(), errMsg), (this.isLineNumberIncluded() ? "(0)" : ""));
		}
	});
	
	/*
	Setter and Getter methods for viewable encounters
	*/
	RemindersOpt1Component.method("setViewableEncntrs", function(value) {
		this.m_viewableEncntrs = value;
	});
		
	RemindersOpt1Component.method("getViewableEncntrs", function(){
		return (this.m_viewableEncntrs);
	}); 

}
/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
RemindersOpt1Component.prototype = new MPageComponent();
RemindersOpt1Component.prototype.constructor = MPageComponent;

RemindersOpt1Component.prototype.postProcessing = function() {
	MPageComponent.prototype.postProcessing.call(this);
	if (this.resultsCount === 0) {
		//Update the component result count
		CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
			"count" : 0
		});
	}
};

/**
* Determines if the current view is in Chart or Organizer view.  If the person_id (patient id), the encounter_id, or the ppr_cd
* do not equal 0 then the view is of a Patient's Chart, else the view is from the Organizer level.
*/
RemindersOpt1Component.prototype.setViewFlag = function() {
	var criterion = this.getCriterion();
	this.isChartView = (criterion.person_id !== 0 || criterion.encntr_id !== 0 || criterion.ppr_cd !== 0);

};

/**
* Enabling the core level Add Plus sign to display in Chart view
*/
RemindersOpt1Component.prototype.setPlusAddEnabled = function(){

	this.m_isPlusAdd = (this.isChartView) ? true : false;
};

/**
*  Creates the Look forward range buttons that will set a flag based on selection and when selected call the filter reminders function,
*  to filter the available reminders based on due date.
*/
RemindersOpt1Component.prototype.createLookForwardButtons = function () {

	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var self = this;
	var lookForwardItems = [
		this.remo1i18n.ALL,
		this.remo1i18n.TODAY,
		this.remo1i18n.TOMORROW,
		this.remo1i18n.NEXT_WEEK,
		this.remo1i18n.NEXT_MONTH,
		this.remo1i18n.NEXT_YEAR
		];
	var i = 0;
	var maxItemsFaceUp = 2;
	var numberOfLookForwardItems = lookForwardItems.length;
	var lookForwardItem = null;
	var lookForwardMenuItem = null;
	var hasSelectedMoreOption = false;


	function toggleExtraOptions() {
		if(!extraLookForwardMenu.isActive()) {
			MP_MenuManager.showMenu("extraLookForwardMenu" + compId);
		}
		else {
			MP_MenuManager.closeMenuStack(true);
		}
	}

	//Helper function to handle when the user clicks one of the face-up lookback buttons
	function handleLookForwardClick(lookForwardItem, index) {
		return function() {
			//Set the look forward code to the index of the selected look forward option
			self.lookForwardCode = index;
			//remove the active class from the previous active button and add the active class to the new button
			$("#lookForwardContainer" + compId).find(".lookback-button-active").removeClass("lookback-button-active");
			$(this).addClass("lookback-button-active");
			//filter reminders by look forward
			self.filterReminders();
		};
	}

	//Helper function to handle when the user clicks one of the extra lookback options
	function handleExtraLookForwardClick(lookForwardItem, extraLookForwardMenuItem, index) {
		return function() {
			//Set the look forward code to the index of the selected look forward option
			self.lookForwardCode = index;
			//If we haven't previously selected a "More" option, then we need to unbind the click event for showing the extra options
			//and bind the click event for handling the lookback
			if(!hasSelectedMoreOption) {
				$("#lookForwardMoreOptions" + compId).unbind("click", toggleExtraOptions);
				$("#lookForwardMoreOptions" + compId).click(handleLookForwardClick(extraLookForwardMenuItem, index));
				hasSelectedMoreOption = true;
			}
			//remove the active class from the previous active button and add the active class to the new button as well as change the display on the extra button
			$("#lookForwardContainer" + compId).find(".lookback-button-active").removeClass("lookback-button-active");
			$("#lookForwardMoreOptions" + compId).html(lookForwardItem).addClass("lookback-button-active");
			//filter reminders by look forward
			self.filterReminders();
		};
	}

	//Create a lookforward button element
	function createLookForwardMenuItemElement(lookForwardItem) {
		return $("<div></div>").addClass("lookback-button").html(lookForwardItem);
	}

	var lookForwardContainer = $("<div></div>").attr("id", "lookForwardContainer" + compId).addClass("lookforward-container");
	
	var numberItems = Math.min(maxItemsFaceUp, numberOfLookForwardItems);

	for(i = 0; i < numberItems; i++){

		lookForwardItem = lookForwardItems[i];
		lookForwardMenuItem = createLookForwardMenuItemElement(lookForwardItem);
		//Determine the styling for the lookback item
		lookForwardMenuItem.addClass((i === 0) ? "lookback-button-active" : "lookback-button-no-left-border lookback-button-inactive");
		lookForwardMenuItem.click(handleLookForwardClick(lookForwardItem, i));
		lookForwardContainer.append(lookForwardMenuItem);
	}


	if(numberOfLookForwardItems > maxItemsFaceUp){

		extraLookForwardMenu = new Menu("extraLookForwardMenu" + compId)
		.setTypeClass("more-lookback-menu")
		.setAnchorElementId("extraLookForwardMenu" + compId)
		.setAnchorConnectionCorner(["bottom", "right"])
		.setContentConnectionCorner(["top", "right"])
		.setIsRootMenu(true);

		var extraLookForwardMenuItem = this.remo1i18n.MORE;
		var extraLookForwardMenuItemElement = createLookForwardMenuItemElement(extraLookForwardMenuItem).attr("id", "lookForwardMoreOptions" + compId).addClass("lookback-button-no-left-border lookback-button-more");
		extraLookForwardMenuItemElement.on("click", toggleExtraOptions);

		var extraLookForwardDropDown = $("<div></div>").addClass("lookback-button lookback-button-arrow lookback-button-no-left-border").attr("id", "extraLookForwardMenu" + compId);
		var extraLookForwardArrow = $("<span></span>").addClass("wrkflw-selectArrow");

		extraLookForwardDropDown.click(function(){
			toggleExtraOptions();
		});

		extraLookForwardDropDown.append(extraLookForwardArrow); 
		lookForwardContainer.append(extraLookForwardMenuItemElement);
		lookForwardContainer.append(extraLookForwardDropDown);
		for(i = maxItemsFaceUp; i < numberOfLookForwardItems; i++) {
			//Use the lookback utility to create a lookback item
			lookForwardItem = lookForwardItems[i];
			//Create a standard menu selection for the "More" lookback menu
			var extraLookForwardMenuSelector = new MenuSelection("extraLookForwardMenuItem" + compId + "-" + i)
			.setCloseOnClick(true)
			.setLabel(lookForwardItem)
			.setClickFunction(handleExtraLookForwardClick(lookForwardItem, extraLookForwardMenuItem, i));
			extraLookForwardMenu.addMenuItem(extraLookForwardMenuSelector);
		}
		//Add the extra lookback menu
		MP_MenuManager.updateMenuObject(extraLookForwardMenu);
	}

	$("#lookbackContainer" + compNS + compId).before(lookForwardContainer);
};

/* Main rendering functions */
RemindersOpt1Component.prototype.retrieveComponentData = function() {
	var self = this;
	//Create the parameter array for our script call
	var criterion = self.getCriterion();
	var encntrs = this.getViewableEncntrs();

	var encntrVal = (encntrs) ? "value(" + encntrs + ")" : "0.0";
	//This will be 0.0 as we would like to avoid retrieving sticky notes.
	var sStickyNoteTypes = 0.0;
	/*The MP_RETRIEVE_NOTE_REMINDER_JSON CCL program takes in a parameter which is a sum of mask it needs to set in order to retrieve codes.
	 *LOAD_STICKNOTES_IND at 1, LOAD_NOTESREMINDERS_IND at 2, RESOLVE_CODES_IND at 4 & RESOLVE_PRSNL_IND at 8
	 * So, if we would like to get all we need to sum all four and pass it as a parameter to MP_RETRIEVE_NOTE_REMINDER_JSON program,
	 * In this case we would like to avoid getting Sticky notes, so we would sum the rest to get 2+4+8 and that is 14
	 */
	var loadingPolicy = 14;
	var sendAr = ["^MINE^", criterion.person_id + ".0", sStickyNoteTypes, loadingPolicy, encntrVal, this.getLookbackUnits(), this.getLookbackUnitTypeFlag(), criterion.provider_id + ".0", criterion.ppr_cd + ".0"];
	MP_Core.XMLCclRequestWrapper(self, "mp_retrieve_note_reminder_json", sendAr, true);
};
/*
 * Creates a span with the standard class: res-severe used for rendering the high priority icon and rem1-pr-icon-align to align to the center of the column.
 */
RemindersOpt1Component.prototype.getPriorityIcon = function() {
	var ar = ["<span class='res-severe'><span class='res-ind'>&nbsp;</span></span>"];
	return ar.join("");

};

/*
 *Creates a span with the class attachment used to display the attachment icon in attachment column
*/

RemindersOpt1Component.prototype.getAttachmentIcon = function (hasAttachments) { 
	var compNS = this.getStyles().getNameSpace();
	attachmentHTML = (hasAttachments) ?"<span class='"+compNS+"-attachment'>&nbsp;</span>" : "<span>&nbsp;</span>";
	var attachments =  ["<span class='"+compNS+"-attachmentColumn'>" + attachmentHTML + "</span>"];
	return attachments.join("");
};

/*
 *Creates a span with the class attachment used to display the attachment icon in side panel
*/
RemindersOpt1Component.prototype.getAttachmentIconForSidePanel = function () {
	var compNS = this.getStyles().getNameSpace();
	var attachments = ["<span class='"+compNS+"-attachment'>&nbsp;</span>"];
	return attachments.join("");
};

/*
 *Creates the subject link. On clicking the it the reminder viewer is launched.
 */
RemindersOpt1Component.prototype.createReminderViewerLink = function(taskId, taskUID, compId, msgSub, readOnly, assignedID) {
	var subjectLink = "";
	
	if (taskId > 0) {
		if(!CERN_Platform.inMillenniumContext()){
			subjectLink = "<span id=" + taskId + ">" + msgSub + "</span>";
		}
		else{
			subjectLink = "<a id=" + taskId + " onclick='RemindersOpt1Component.prototype.launchReminderViewer(" + taskId + ",\"" + taskUID + "\"," + compId + "," + assignedID + "," + readOnly + ");return false;' href='#'>" + msgSub + "</a>";
		}
		return (subjectLink);
	}
};

/*
 * This will be the event handler for the click on the Subject link.  Based on which view the subject link is clicked in.
 * If Chart view then it will check to make sure the new service exists and launch the reminder, else will check to make sure the new service exists for Organizer view,
 * and that the reminder.
 * @param {number} taskId : the ID of the task (reminder).
 * @param {string} taskUID : the UID of the task (reminder).
 * @param {number} compId : the component ID.
 * @param {number} pId : the assigned person ID of the task.
 * @param {boolean} readOnly : the readOnly flag of the reminder.
 * @param {boolean} isChartView : flag to determine which view we are in.
 */
RemindersOpt1Component.prototype.launchReminderViewer = function(taskId, taskUID, compId, pId, readOnly) {
	var comp = MP_Util.GetCompObjById(compId);
	try {
		var viewerObj = CERN_Platform.getDiscernObject("PVVIEWERMPAGE");
		MP_Util.LogDiscernInfo(null, "PVVIEWERMPAGE", "reminders-o1.js", "launchReminderViewer");
		if(comp.isChartView){
			if(typeof viewerObj.LaunchRemindersWithOwnerViewer === "undefined"){
				viewerObj.LaunchRemindersViewer(taskId);
			}
			else{
				viewerObj.LaunchRemindersWithOwnerViewer(taskId, pId, readOnly);
			}
		}
		else{
			if(typeof viewerObj.LaunchRemindersWithUIDViewer === "undefined"){
				viewerObj.LaunchRemindersViewer(taskId);
			}
			else{
				viewerObj.LaunchRemindersWithUIDViewer(taskUID, readOnly);
			}
		}

		if(!readOnly){
			comp.retrieveComponentData();
		}

	} catch (err) {
		MP_Util.LogJSError(err, comp, "reminders-o1.js", "launchReminderViewer");
	}
};

/*
 * Checks whether the reminder is assigned to the signed on provider and sets the appropriate values to the task.
 * @param {object} task : the reminder being processed.
 * @return {boolean}
 */
RemindersOpt1Component.prototype.isAssignedToReminder = function(task) {
	var pId = this.getCriterion().provider_id;
	if (task.ASSIGN_PRSNL_LIST.length === 0) {
		task.ASSIGNED = "--";
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
	if(task.ASSIGN_PRSNL_LIST.length === 1){
		task.ASSIGNED = task.ASSIGN_PRSNL_LIST[0].ASSIGN_PRSNL_NAME;
	}
	else{
		task.ASSIGNED = this.remo1i18n.MULTIPLE;
	}
	task.READONLY = true;
	task.ASSIGNEDID = task.ASSIGN_PRSNL_LIST[0].ASSIGN_PRSNL_ID;
	return false;
};

/*
 *Takes in the provider id of the sender and searches for the name of the respective sender in the prsnlArray
 */
RemindersOpt1Component.prototype.getSenderName = function(msgSenderId, prsnlArray) {
	for (var i = prsnlArray.length; i--; ) {
		var current = prsnlArray[i];
		if (current.ID === msgSenderId) {
			return current.PROVIDER_NAME.NAME_FULL;
		}
	}
};

/*
 * Process the json so that ComponentTable can display the data appropriately.
 */
RemindersOpt1Component.prototype.processResultsForRender = function(recordData) {
	var self = this;
	var compId = self.getComponentId();
	var compNS = self.getStyles().getNameSpace();
	var reminders = recordData.REMINDERS;
	var prsnlArray = recordData.PRSNL;
	var remLength = reminders.length;
	var totalCount = 0;
	var curDate = new Date();
	var validReminders = [];
	var validMyReminders = [];
	var subjectLink = "";
	var readOnly = "";

	for (var x = 0; x < remLength; x++) {
		var reminder = reminders[x];
		var remindDate = new Date();
		remindDate.setISO8601(reminder.REMIND_DT_TM);
		if (remindDate && (remindDate <= curDate)) {
			var msgSubj = reminder.MSG_SUBJECT;
			reminder.A=msgSubj;
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
			}else{
				dueDateDisplay = "--"; /* If we click on empty dueDate cell side panel may not get display, so by adding &nbsp; onRowClick works fine;*/
			}
			
			//Set up Priority
			if (reminder.STAT_IND === 1) {
				reminder.PRIORITY_DISPLAY = self.getPriorityIcon();
			}
			//Set up Attachment
			reminder.ATTACHMENT = this.getAttachmentIcon(reminder.HASATTACHMENTS);

			//Organizer view inforamtion
			if(!this.isChartView){
				this.createPatientDisplay(overdueClass, reminder);
			}

			//calls the isAssignedToReminder function to set the appropriate values to the reminder.
			this.isAssignedToReminder(reminder);
			readOnly = reminder.READONLY;
			assignedID = reminder.ASSIGNEDID;

			//SUBJECT
			subjectLink = (msgSubj !== "") ? self.createReminderViewerLink(taskId, taskUID, compId, msgSubj, ((this.isChartView) ? readOnly : false), assignedID) : "(" + self.remo1i18n.NO_SUBJECT + ")";
			reminder.SUBJECT_DISPLAY = "<span class='" + overdueClass + "'>" + subjectLink + "</span>";

			//SUBTYPE
			var subtypeOverdue = compNS+"-subtype-overdue";
			var subtypeDisplay = reminder.TASK_SUBTYPE_DISPLAY;
			reminder.SUBTYPE_DISPLAY = (subtypeDisplay) ? "<span class='" + overdueClass + " " + subtypeOverdue + "'>" + subtypeDisplay + "</span>" : "<span class='" + overdueClass + " " + subtypeOverdue + "'>--</span>" ;

			//SUBJECT / SUBTYPE
			reminder.SUBJECT_SUBTYPE_DISPLAY = reminder.SUBJECT_DISPLAY + "<br>" + ((subtypeDisplay) ? reminder.SUBTYPE_DISPLAY : "<span>--</span>");

			//Class to remove the font-weight:bold from the from column
			var nameOverdue = compNS+"-name-overdue";

			//Set up the From
			var senderId = reminder.MSG_SENDER_ID;
			var from = self.getSenderName(senderId, prsnlArray);
			reminder.FROM_DISPLAY = "<span class='" + overdueClass + " " + nameOverdue + "'>" + from + "</span>";
			reminder.FROM = from;

			reminder.ASSIGNED_DISPLAY = "<span class='" + overdueClass + " " + nameOverdue + "'>" + reminder.ASSIGNED + "</span>";

			//Set up subtype array to display in dropdown
			if (subtypeDisplay && self.validSubtype.indexOf(subtypeDisplay) === -1) {
				self.validSubtype.push(subtypeDisplay);
			}
			
			//Set up the due date
			reminder.DUE_DATE_DISPLAY = "<span class='" + overdueClass + "'>" + dueDateDisplay + "</span>";
			validReminders.push(reminder);
			if (self.isAssignedToReminder(reminder)) {
				validMyReminders.push(reminder);
			}
			
		}
	}
	this.myAssignedProcessedReminders = validMyReminders;
	this.processedReminders = validReminders;
	this.resultsCount = (this.isChartView) ? validMyReminders.length : validReminders.length;

};



/**
 * This is the RemindersOpt1Component implementation of the renderComponent function.  It takes the information retrieved from the script
 * call and renders the component's visuals.  There is no check on the status of the script call's reply since that is handled in the
 * call to XMLCCLRequestWrapper.
 * @param {MP_Core.ScriptReply} The ScriptReply object returned from the call to MP_Core.XMLCCLRequestWrapper function in the
 * retrieveComponentData function of this object.
 */
RemindersOpt1Component.prototype.renderComponent = function(reply) {
	var self = this;
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var errMsg = [];
	var recordData = null;
	var timerRenderComponent = null;
	var reminderHTML = "";
	var jsHtml = [];

	try {
		//Create the render timer
		timerRenderComponent = MP_Util.CreateTimer(this.getComponentRenderTimerName());

		//Only create the lookforward buttons when first loading the component.
		if($("#lookForwardContainer" + compId).length === 0){
			this.createLookForwardButtons();
		}
		
		recordData = reply;
		this.processResultsForRender(recordData);
		jsHtml.push("<div id ='" + compId + "filterContainer' class ='" + compNS + "-filtercontainer'>");

		if(this.validSubtype.length > 0){
			jsHtml = jsHtml.concat(this.addSubtypeDropdown());
		}

		if(this.isChartView){
			jsHtml = jsHtml.concat(this.myAssignedCheckbox());
		}
		
		jsHtml.push("</div>");
		jsHtml.push("<div id ='" + compId + "mainContainer' class ='" + compNS + "-maincontainer " + compNS + "-maincontainer-position'>");
		jsHtml.push("<div id ='" + compId + "tableview' class='" + compNS + "-table'>");

		
		this.remindersTable = new ComponentTable();
		this.remindersTable.setNamespace(this.getStyles().getId());
 
		//Create the status column
		var priorityColumn = new TableColumn()
			.setColumnId("PRIORITY")
			.setCustomClass("rem1-priority")
			.setColumnDisplay(this.getPriorityIcon())
			.setIsSortable(true)
			.setRenderTemplate('${ PRIORITY_DISPLAY }')
			.setPrimarySortField("STAT_IND")
			.setDefaultSort(TableColumn.SORT.DESCENDING);

		priorityColumn.addSecondarySortField("SCHEDULED_DT_TM", TableColumn.SORT.ASCENDING);


		//Create the from column
		var fromColumn = new TableColumn()
			.setColumnId("FROM")
			.setCustomClass("rem1-from")
			.setColumnDisplay(this.remo1i18n.FROM)
			.setIsSortable(true)
			.setRenderTemplate('${ FROM_DISPLAY }')
			.setPrimarySortField("FROM");

		var assignedColumn = new TableColumn()
			.setColumnId("ASSIGNED")
			.setCustomClass("rem1-assignedto")
			.setColumnDisplay(this.remo1i18n.ASSIGNED)
			.setIsSortable(true)
			.setRenderTemplate('${ ASSIGNED_DISPLAY }')
			.setPrimarySortField("ASSIGNED");

		var attachment = new TableColumn()
			.setColumnId("ATTACHMENT")
			.setCustomClass("rem1-attachmentColumn")
			.setColumnDisplay(this.getAttachmentIcon(true))
			.setIsSortable(false)
			.setRenderTemplate("${ ATTACHMENT }");

		

		//Create the status column
		var dueDateColumn = new TableColumn()
			.setColumnId("DUEDATE")
			.setCustomClass("rem1-due-date")
			.setColumnDisplay(this.remo1i18n.DUE)
			.setIsSortable(true)
			.setRenderTemplate('${ DUE_DATE_DISPLAY }')
			.setPrimarySortField("SCHEDULED_DT_TM");

		this.remindersTable.addColumn(priorityColumn);
		if(this.isChartView){
			this.renderChartColumns();
		}
		else{
			this.renderOrganizerColumns();
		}
		//Attachment sidepanel actions only in Non-Millennium context
		this.attachSidePanelActions();

		this.remindersTable.addColumn(attachment);
		this.remindersTable.addColumn(dueDateColumn);
		this.remindersTable.addColumn(fromColumn);

		if(this.isChartView){
			this.remindersTable.addColumn(assignedColumn);
		}

		//call the filterReminders function to display the filtered data if not initial render
		if(!this.myAssignedRemindersFlag || this.subtype !== this.remo1i18n.ALL_SUBTYPE){
			this.filterReminders();
		}
		//else if initial rendering and in chart view bind the logged in users assigned reminders
		else if(this.isChartView){
			this.remindersTable.bindData(this.myAssignedProcessedReminders);
			this.isRenderComponentTable = (this.myAssignedProcessedReminders.length === 0) ? true : false;
		}
		//else in initial render and org view bind all reminders.
		else{
			this.remindersTable.bindData(this.processedReminders);
		}

		this.setComponentTable(this.remindersTable);
		this.remindersTable.sortByColumnInDirection("PRIORITY", TableColumn.SORT.DESCENDING);
		jsHtml.push(this.remindersTable.render());
		jsHtml.push("</div>");
		jsHtml.push("<div id='" + compId + "sidePanelContainer' class='" + compNS + "-sidepanel-container'></div>");
		jsHtml.push("</div>");
		this.finalizeComponent(jsHtml.join(""), MP_Util.CreateTitleText(this, this.resultsCount));

		//used to determine which columns need to be displayed
		this.toggleColumnDisplays();
		//sets the selected value in the dropdown to the default on load or the selected value if component is refreshed
		$("#" + compId + "selectsubType").val(self.subtype);

		this.m_sidePanelContainer = $("#" + compId + "sidePanelContainer");
		this.m_tableView = $("#" + compId + "tableview");
		this.m_mainContainer = $("#" + compId + "mainContainer");
		this.m_lastSelectedRow = 0;
		this.addSidePanelContainer();
		CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
			count : this.resultsCount
		});

		var component = this;
		
		/**
		 ** Override the toggleColumnSort method of ComponentTable to retain the selected row after sorting.
		 ** @param {string} columnId : The column to be sorted.
		 */
		this.remindersTable.toggleColumnSort = function(columnId) {

			//Call the base class functionality to sort column
			ComponentTable.prototype.toggleColumnSort.call(this, columnId);
			
			//If any row is selected, highlight the row and reposition the scroll
			if(component.isSidePanelOpen){
				//Escape sequencing is required for the ':' in the id of the row.
				component.updateSelRowBgColor($("#"+component.m_selectedRowId.replace(/:/g,"\\:")), false);
				component.scrollToSelectedRow();	
			}

			//Determine which columns need to be displayed when sorting the columns.
			component.toggleColumnDisplays();
		};

		//When the filter dropdown is changed filter the reminders being displayed
		if(this.validSubtype.length > 0){
			$("#" + compId + "selectsubType").on("change", function () {
				self.subtype = $("#" + compId + "selectsubType").children(":selected").text();
				self.filterReminders();
			});
		}

		//When the checkbox is selected filter the reminders being displayed
		if(this.isChartView){
			$("#" + compId + "myAssignedCheckbox").on("change", function() {
				self.myAssignedRemindersFlag = !(self.myAssignedRemindersFlag);
				self.filterReminders();
			});
		}

		
	} catch (err) {
		if (timerRenderComponent) {
			timerRenderComponent.Abort();
			timerRenderComponent = null;
		}
		MP_Util.LogJSError(this, err, "reminders-o1.js", "renderComponent");
		//Throw the error to the architecture
		throw (err);
	} finally {
		if (timerRenderComponent) {
			timerRenderComponent.Stop();
		}
	}
};

/**
 * This function add side panel actions to component only in Non-Millennium Context
 */
RemindersOpt1Component.prototype.attachSidePanelActions = function(){
	if(!CERN_Platform.inMillenniumContext()){
		this.addCellClickExtension();
	}
};

/**
 * This function add side panel only in Non-Millennium Context.
 * Hiding sidepanel is must on first load.
 */
RemindersOpt1Component.prototype.addSidePanelContainer= function(){
	if(!CERN_Platform.inMillenniumContext()){
		this.addSidePanel();
	}
	this.hideSidePanel();
};

/**
 * This is overridden function to set call back function for component table's row click event. if click event triggered
 * onRowClick() method executes.
 */
RemindersOpt1Component.prototype.addCellClickExtension = function () {
	var component = this;
	var cellClickExtension = new TableCellClickCallbackExtension();
	cellClickExtension.setCellClickCallback(function (event, data) {
		component.onRowClick(event, data);
	});
	this.remindersTable.addExtension(cellClickExtension);
};

/**
 * This function onRowClick(event,data) executes to check whether results are null or not
 * and then call updateInfo method to update the side panel with result values.
 * @param1 event : standard click event
 * @param2 data  : array of the results
 */
RemindersOpt1Component.prototype.onRowClick = function (event, data) {
	var selRow = $(event.target).parents("dl.result-info");
	if (!selRow.length || data.RESULT_DATA === null) {
		return;
	}
	this.updateInfo(selRow, data.RESULT_DATA, false);
	this.resetTableCellHeight();
	this.resetSidePanelHeight();
};

/**
 * This function updateInfo(selRow, data, isInitialLoad) executes to update the side panel with result values and display it.
 * @param1 selRow: standard click event
 * @param2 data  : array of the results
 * @param3 isInitialLoad is boolean to check whether it is loading first time
 */
RemindersOpt1Component.prototype.updateInfo = function (selRow, data, isInitialLoad) {
	var rowId = this.getRowId(selRow);
	this.updateSelRowBgColor(selRow, isInitialLoad);    
	this.showSidePanel();
	//this becuase no need to call script for result_data for same reminder again.
	if (this.m_lastSelectedRow == rowId && !$(selRow).hasClass(this.getStyles().getNameSpace() + "-row-selected-init")) {
		return;
	}else{
		this.renderReadingPane(data);
	}
	this.m_lastSelectedRow = rowId;
};

/*
 * Update background color for selected row only
 */
RemindersOpt1Component.prototype.updateSelRowBgColor = function (selRowObj, isInitialLoad) {
	var compNS = this.getStyles().getNameSpace();
	var compID = this.getComponentId();
	var tableRowArr = this.m_tableView.find(".result-info");
	var prevRow = this.m_tableView.find(".selected");
	if (prevRow.length > 0 && this.m_lastSelectedRow === this.getRowId(prevRow)) {
		prevRow.removeClass(compNS + "-row-selected");
		prevRow.removeClass(compNS + "-row-selected-init");
		prevRow.removeClass("selected");
		prevRow.children("*").children("*").css("color", "");
	}
	if (isInitialLoad) {
		$(selRowObj).addClass(compNS + "-row-selected-init selected");
	} else {
		$(selRowObj).addClass(compNS + "-row-selected selected");
	}
	$(selRowObj).find("dd>span.res-severe").addClass(compNS + "-overdue");
	this.m_selectedRowId = $(selRowObj).attr("id");
};

/**
 * This function getRowId(rowObj) returns rowId based on the rowObj.
 * @return rowId
 */
RemindersOpt1Component.prototype.getRowId = function (rowObj) {
	var rowId = "";
	var identifiers = $(rowObj).attr("id").split(":");
	if (this.remindersTable.isGroupingApplied()) {
		rowId = identifiers[2];
	} else {
		rowId = identifiers[1];
	}
	return rowId;
};

/**
 * This function renderReadingPane(data) renders the side panel.
 * @param data a array of result values for the side panel.
 */
RemindersOpt1Component.prototype.renderReadingPane = function (data) {
	var compNS = this.getStyles().getNameSpace();
	var compID = this.getComponentId();
	var component = this;
	var sidePanelDetails = "<div class='"+compNS+"-sidepanel-loading'><span class='"+compNS+"-loading'></span></div>";
	var sidePanelContents = "";
	var reminderDetails = null;
	var dueDateTime = new Date();
	var displayDueDate = "";
	var curDate = new Date();
	var dueInfoHtml = "";
	var elapsedTime = "";
	var sidePanelIcons ="";
	var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	if (data.SCHEDULED_DATE !== "") {
		dueDateTime.setISO8601(data.SCHEDULED_DATE);
		if( data.SCHEDULED_DT_TM !== ""){
			displayDueDate = " ("+dateFormatter.formatISO8601(data.SCHEDULED_DATE, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR)+")";
		}
		else{
			displayDueDate = "";
		}
	}
	if (data.SCHEDULED_DATE !== "") {
		dueDateTime.setISO8601(data.SCHEDULED_DATE);
		elapsedTime = (curDate > dueDateTime) ? this.GetDateDiffString(dueDateTime, curDate) : this.GetDateDiffString(curDate, dueDateTime);
		elapsedTime = (curDate > dueDateTime) ? this.remo1i18n.OVERDUE + "&nbsp;" + this.remo1i18n.AGO.replace("{0}", elapsedTime) : this.remo1i18n.DUE + "&nbsp;" + elapsedTime;
	}
	else{
	elapsedTime = this.remo1i18n.DUE+" --";
	}
	var hasAttachments = "";
	if(data.HASATTACHMENTS){
		hasAttachments = this.getAttachmentIconForSidePanel();
	}
	dueInfoHtml = "<div class='" + compNS + "-sp-action-holder'>" + elapsedTime + "<span>" + displayDueDate + "</span></div>";
	var buttonPanel = "<div id='" + compID + "markComplete' class='" + compNS + "-sp-button'>" + this.remo1i18n.MARK_AS_COMPLETE + "</div>";
	var priorityIcon = (data.STAT_IND) ? this.getPriorityIcon() : "";
	if(data.STAT_IND && data.HASATTACHMENTS){
		sidePanelIcons = "<div class = 'rem1-icons'>" + priorityIcon +  hasAttachments + "</div>";
	}else if(!data.STAT_IND && data.HASATTACHMENTS){
		sidePanelIcons = "<div class = 'rem1-icon'>"+  hasAttachments + "</div>";
	}else if(data.STAT_IND && !data.HASATTACHMENTS){
		sidePanelIcons = "<div class = 'rem1-icon'>"+  priorityIcon + "</div>";
	}
	var sidepanelHeader = "<div id='" + compID + "reminder-sidepanel-header'>" + dueInfoHtml + "<div id='" + compID + "msgSubject'><div id='msgText' class='" + compNS + "-sp-header'><div class='" + compNS + "-msg-subject' >" + data.MSG_SUBJECT + "</div>" + sidePanelIcons + "</div></div></div>";
	var spSeperator = "<div class='sp-separator'></div>";
	var senderDetails = "<div id='" + compID + "MessageDetails'><div id='sidePanelScrollContainer" + compID + "'><div class='" + compNS + "-scroll-container'><span class='" + compNS + "-resultLabel'>" + this.remo1i18n.FROM + "<span  class ='" + compNS + "-colon-seperator'>:</span></span><span class='" + compNS + "-resultValue'>" + data.FROM + "</span>";
	this.m_sidePanel.setContents(sidePanelDetails, compID + "_Content");
	var scriptRequest = new ScriptRequest();
	scriptRequest.setProgramName("MP_UPDATE_REMINDERS");
	scriptRequest.setParameterArray(["^MINE^",this.getCriterion().person_id +".0" ,data.TASK_ID + ".0", "0"]);
	scriptRequest.setResponseHandler(function (scriptReply) {
		if (scriptReply.getStatus() === "S") {
			reminderDetails = scriptReply.getResponse();
			sidePanelDetails = component.generateSidePanelHTML(reminderDetails);
			sidePanelHtml = buttonPanel + sidepanelHeader + spSeperator + senderDetails + sidePanelDetails;
			component.m_sidePanel.setContents(sidePanelHtml, compID + "_Content");
			component.bindSidePaneActions(reminderDetails);
			// Deleting empty divs from the parsed message which occupying little space in begining of the message and changing default background color(#fff) of the other text 
			 var childDivs = null;
			 var childCount = 0;
			 if ($("." + compNS + "-MessageText").length) {
				 childDivs = $("." + compNS + "-MessageText").children().children();
				 if (childDivs.length > 0) {
					 $(childDivs.children()[0]).remove();
					 $(childDivs.children().children()).css({
						 "background-color" : "#F6F6F6"
					 });
					 childCount++;
				 }
			 }
		}
	});
	scriptRequest.performRequest();
};

/*
 * Genrate the Sidepanel HTML when use clicks on the row and update to the sidepanel
 */
RemindersOpt1Component.prototype.generateSidePanelHTML = function (data){
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	var actionsHTML = "";
	var addendumsHTML = "";
	var actions = [];
	var taskAddendums = [];
	var sidePanelHtml ="";
	var actionsCount = data.TASK_ACTION_CNT;
	actionsHTML = actionsHTML + "<div class='" + compNS + "-actions'>";
	if (actionsCount) {
		actions = data.TASK_ACTIONS;
		for (i = 0; i < actionsCount; i++) {
			actionsHTML = actionsHTML + "<span class='" + compNS + "-action'>" + actions[i].TASK_ACTION_DISP + "</span>";
		}
		actionsHTML = actionsHTML + "</div>";
	} else {
		actionsHTML = actionsHTML + "--</div>";
	}
	addendumsHTML = addendumsHTML + "<div class='" + compNS + "-addendums'>";
	var addendumsCount = data.TASK_ADDENDUM_CNT;
	if (addendumsCount) {
		taskAddendums = data.TASK_ADDENDUMS;
		var updateDateTime = "";
		var updatedDate = "--";
		addendumsHTML = addendumsHTML + "<div id='" + compID + "parentAddendum' class='" + compNS + "-AddendumTitle' >" + this.remo1i18n.ADDENDUM + ":</div>";
		for (i = 0; i < addendumsCount; i++) {
			if (taskAddendums[i].UPDT_DATE !== "") {
				updateDateTime = dateFormatter.formatISO8601(taskAddendums[i].UPDT_DATE, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
			}

			addendumsHTML = addendumsHTML + "<div class='" + compNS + "-addendums'><div class='" + compNS + "-addendum'>" + taskAddendums[i].ADDENDUM_TEXT + "</div><div class='" + compNS + "-addendum-by'>" + taskAddendums[i].PERFORMED_PRSNL + " (" + updateDateTime + ")</div></div>";
		}
		addendumsHTML = addendumsHTML + "</div>";
	} else {
		addendumsHTML = addendumsHTML + "</div>";
	}
	var spSeperator = "<div class='sp-separator'></div>";
	var actionDetails = "<span class='" + compNS + "-resultLabel'>" + this.remo1i18n.ACTIONS + "<span class ='" + compNS + "-colon-seperator'>:</span></span><span class='" + compNS + "-resultValue'>" + actionsHTML + "</span>";
	var messageDetails = "<div class='" + compNS + "-MessageText'>" + data.MSG_TEXT + "</div>";
	
	var addendums = "<div>" + addendumsHTML + "</div></div></div></div>";
	sidePanelHtml = actionDetails + spSeperator + messageDetails + spSeperator + addendums;
	return (sidePanelHtml);
};

/**
 * This function GetDateDiffString(beginDate,endDate) returns the differnece between begindate and enddate with generated string value.
 * @param beginDate is start date which is always smaller than end date.
 * @param endDate is end date which is always greater than start date.
 * @return custom string date format.
 */
RemindersOpt1Component.prototype.GetDateDiffString = function (beginDate, endDate) {
	var timeDiff = 0;
	var returnVal = "";
	endDate = (!endDate) ? new Date() : endDate;
	var one_minute = 1000 * 60;
	var one_hour = one_minute * 60;
	var one_day = one_hour * 24;
	var one_week = one_day * 7;
	var valMinutes = 0;
	var valHours = 0;
	var valDays = 0;
	var valWeeks = 0;
	var valMonths = 0;
	var valYears = 0;
	timeDiff = (endDate.getTime() - beginDate.getTime());
	var mathFunc = function (val) {
		return Math.floor(val);
	};
	var comparisonFunc = function (lowerVal, upperVal) {
		return (lowerVal < upperVal);
	};
	var calcMonths = function () {
		var removeCurYr = 0;
		var removeCurMon = 0;
		var yearDiff = 0;
		var monthDiff = 0;
		var dayDiff = endDate.getDate();
		if (endDate.getMonth() > beginDate.getMonth()) {
			monthDiff = endDate.getMonth() - beginDate.getMonth();
			if (endDate.getDate() < beginDate.getDate()) {
				removeCurMon = 1;
			}
		} else {
			if (endDate.getMonth() < beginDate.getMonth()) {
				monthDiff = 12 - beginDate.getMonth() + endDate.getMonth();
				removeCurYr = 1;
				if (endDate.getDate() < beginDate.getDate()) {
					removeCurMon = 1;
				}
			} else {
				if (endDate.getDate() < beginDate.getDate()) {
					removeCurYr = 1;
					monthDiff = 11;
				}
			}
		}
		if (endDate.getDate() >= beginDate.getDate()) {
			dayDiff = endDate.getDate() - beginDate.getDate();
		}
		yearDiff = (endDate.getFullYear() - beginDate.getFullYear()) - removeCurYr;
		monthDiff += (yearDiff * 12) + (dayDiff / 32) - removeCurMon;
		return monthDiff;
	};
	valMinutes = mathFunc(timeDiff / one_minute);
	valHours = mathFunc(timeDiff / one_hour);
	valDays = mathFunc(timeDiff / one_day);
	valWeeks = mathFunc(timeDiff / one_week);
	valMonths = calcMonths();
	valMonths = mathFunc(valMonths);
	valYears = mathFunc(valMonths / 12);

	if (comparisonFunc(valHours, 1)) {
		returnVal = (valMinutes === 1)?this.remo1i18n.X_MINUTE.replace("{0}", valMinutes): this.remo1i18n.X_MINUTES.replace("{0}", valMinutes);
	} else {
		if (comparisonFunc(valDays, 1)) {
			returnVal = (valHours===1)?this.remo1i18n.X_HOUR.replace("{0}", valHours):this.remo1i18n.X_HOURS.replace("{0}", valHours);
		} else {
			if (comparisonFunc(valWeeks, 2)) {
				returnVal = (valDays === 1)?this.remo1i18n.X_DAY.replace("{0}", valDays):this.remo1i18n.X_DAYS.replace("{0}", valDays);
			} else {
				if (comparisonFunc(valMonths, 2)) {
					returnVal = (valWeeks===1)?this.remo1i18n.X_WEEK.replace("{0}", valWeeks):this.remo1i18n.X_WEEKS.replace("{0}", valWeeks);
				} else {
					if (comparisonFunc(valYears, 2)) {
						returnVal = (valMonths==1)?this.remo1i18n.X_MONTH.replace("{0}", valMonths):this.remo1i18n.X_MONTHS.replace("{0}", valMonths);
					} else {
						returnVal = this.remo1i18n.X_YEARS.replace("{0}", valYears);
					}
				}
			}
		}
	}
	return (returnVal);
};

/* 
 *resizeComponent() functions calls set default size(height X width) of the side panel
*/
RemindersOpt1Component.prototype.resizeComponent = function () {
	MPageComponent.prototype.resizeComponent.call(this, null);
	this.resetTableCellHeight();
	if (this.isSidePanelOpen && this.m_sidePanel) {
		this.m_sidePanel.resizePanel();
		this.resetSidePanelHeight();
		this.scrollToSelectedRow();
	}
};

/*
 * scrollToSelectedRow() functions checks if any row is selected and
 * if scrollbar is visible, moves the scrollbar to the currently selected row.
 */
RemindersOpt1Component.prototype.scrollToSelectedRow = function () {
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	if(this.m_selectedRowId){
		var tableBodyObj =  $("#" + compNS + compId+"tableBody");
		//move the scrollbar to the selected row when it is enabled.
		if(tableBodyObj[0].scrollHeight > tableBodyObj.innerHeight()){
			tableBodyObj.scrollTo($("#"+this.m_selectedRowId.replace(/:/g,"\\:")));
		}
	}
};

/* 
 *resetSidePanelHeight() functions calls resets default height of the side panel with minimum height.
*/
RemindersOpt1Component.prototype.resetSidePanelHeight = function () {
	if (this.m_tableView && this.m_tableView.length && this.m_sidePanel) {
		var minHeight = Math.max(this.m_tableView.height(), this.m_sidePanelMinHeight);
		this.m_sidePanel.setMinHeight(minHeight + "px");
		this.m_mainContainer.css({"min-height":(minHeight + "px")});
	}
};

/* 
 *resetTableCellHeight() functions calls resets the height of the table cells.
 *This function has to be called upon resizing the component and on showing/hiding the side panel
 *to make equal height of all the columns for each row so as to enable click event on any part of the table column 
 */
RemindersOpt1Component.prototype.resetTableCellHeight = function()	{
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var reminderTableRow = $("#"+ compNS + compID +"tableBody").find('.result-info');
	reminderTableRow.each(function(){
		var tableCellMaxHeight = 0;
		var tableRow = $(this);
		var tableRowHeight =  tableRow.height();
		var tableCell = tableRow.find('dd');
		tableCell.css('height', 'auto');
		tableCell.each(function(){
			var tableColumn = $(this);
			//assigning the height of the column that has the max height in the row 
			var tableColumnHeight =  tableColumn.height();
			if(tableCellMaxHeight < tableColumnHeight){
				tableCellMaxHeight = tableColumnHeight;
			}
		});
		//resetting the height of all the column in the row with the max height 
		tableCell.height(tableCellMaxHeight);
	});
};

/* 
 *addSidePanel() render the sidepanel with close button. by default it will be in hidden state
*/
RemindersOpt1Component.prototype.addSidePanel = function () {
	var compID = this.getComponentId();
	var self = this;
	self.hideSidePanel();
	try {
		if (this.m_sidePanelContainer && this.m_sidePanelContainer.length) {
			this.m_sidePanel = new CompSidePanel(compID, this.m_sidePanelContainer.attr("id"));
			this.m_sidePanel.setExpandOption(this.m_sidePanel.expandOption.EXPAND_DOWN);
			this.m_sidePanel.renderSidePanel();
			this.m_sidePanel.showCloseButton(true);
			this.m_sidePanel.setCloseFunction(function () {
				self.hideSidePanel();
				self.resetTableCellHeight();
			});
		}
	} catch (err) {
		MP_Util.LogJSError(err, this, "reminders-o1.js", "addSidePanel");
	}
	self.resizeComponent();
};

/* This function displays the side panel when onRowClick() method calls */
RemindersOpt1Component.prototype.showSidePanel = function () {
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	$("#" + compID + "tableview").removeClass(compNS + "-expand-comp-table");
	$("#" + compID + "tableview").addClass(compNS + "-compact-comp-table");
	$("#" + compID + "sidePanelContainer").addClass(compNS + "-sidepanel-display");
	$("#" + compID + "sidePanelContainer").css({"display":"inline-block"});
	$("#sidePanel" + compID).show();
	$("#" + compID + "sidePanelContainer").show();
	this.isSidePanelOpen = true;
};

/* This function hides the side panel in following two cases
 * on first load 
 * when on click of sidepanel close button
*/
RemindersOpt1Component.prototype.hideSidePanel = function() {
	this.isSidePanelOpen = false;
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	$("#" + compID + "sidePanelContainer").hide();
	$("#" + compID + "tableview").removeClass(compNS+"-compact-comp-table");
	$("#" + compID + "tableview").addClass(compNS+"-expand-comp-table");
	this.m_mainContainer.css({"min-height": "0px"});
	//Remove the highlighted background from the previously selected row.
	if(this.m_selectedRowId){
		$("#"+this.m_selectedRowId.replace(/:/g,"\\:")).removeClass(compNS + "-row-selected selected");
		this.m_selectedRowId = null;
	}
};

/* This function binds the sidepanel actions while loading side panel with its reminder details
 * when onRowClick() method calls it bind actions to the buttons with its reminders details
*/
RemindersOpt1Component.prototype.bindSidePaneActions = function(data){
	var compID = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var component = this;
	/**
	 * bind the events and based on events it get redirected
	 * @param {event} event - event that was triggered
	 * here only click event is used
	 */
	function bindButtonEvents(event){
		if (!event){
			return;
		}
		var buttonElement = $(event.target);
		var jqTarget = $(event.currentTarget);
		var eventType = event.type;
		var code = event.keyCode;
		/*
		 * On click of mark complete Button 'MP_UPDATE_REMINDERS' script will and the reminder get updated with 'COMPLETE' Status
		 * parameters for the script:
		 * @param-1 : task_id of the reminder. Based of the task_id the notification_uid will be retrieved and updated with 'COMPLETE' status
		 * @param-2 : flag value '1': for completing the reminder
								 '2': for adding addendum
								 '3': for adding addendum and completing the reminder
								
		 */
		if (eventType === 'click' && buttonElement.prop('id') === compID + "markComplete"){ 
			var scriptRequest = new ScriptRequest();
			scriptRequest.setProgramName("MP_UPDATE_REMINDERS");
			scriptRequest.setParameterArray(["^MINE^",component.getCriterion().person_id +".0" ,data.TASK_ID + ".0", 1]);
			scriptRequest.setResponseHandler(function (scriptReply) {
				if (scriptReply.getStatus() === "S") {
					component.retrieveComponentData();
				}
			});
			scriptRequest.performRequest();
		} 
		
		else if (eventType === 'click' && buttonElement.prop('id') === compID + "addAddendum"){
			/*
			 * The implementation for add addendum functionality goes here.
			*/
		}

	}
	/*Dynamic binding for click event to the buttons*/
	$("."+compNS+"-sp-button").on("click", function(event){
		bindButtonEvents(event);
	});
};

/**
 * Map the Reminders option 2 object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "WF_REM" filter
 */
MP_Util.setObjectDefinitionMapping("WF_REM", RemindersOpt1Component);

RemindersOpt1Component.prototype.addStylesheetToHead = function() {
	// Add the stylesheet to the head if it hasnt been already
	// This is done to mitigate issues with our master-summary.css being too large
	var styleSheet = $("#remO2stylesheet");
	if (styleSheet.length === 0) {
		var CSS = '.rem1-name-overdue{font-weight: normal;}';
		$("<style id='remO2stylesheet'>" + CSS + "</style>").appendTo("head");
	}
};

/**
 * Create the html for the show only my reminders checkbox.
 * @return {array} jsHtml: an array of strings to create the checkbox in html
 */
RemindersOpt1Component.prototype.myAssignedCheckbox = function() {
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var jsHtml = [
		"<div id='" + compId + "checkboxWrapper' class='" + compNS + "-checkboxwrapper'>",
		"<input type='checkbox' id='" + compId + "myAssignedCheckbox' class='" + compNS +"-myassignedcheckbox' checked>",
		"<span class='" + compNS + "-checkboxspan'>" + this.remo1i18n.MY_REMINDERS + "</span>",
		"</div>"
		];

	if(!this.myAssignedRemindersFlag){
		jsHtml[1] = "<input type='checkbox' id='" + compId + "myAssignedCheckbox' class='" + compNS +"-myassignedcheckbox'>";
	}

	return jsHtml;
};

/**
 * This function creates the html for the subtype dropdown.  
 * @return {array} jsHtml: an array containing the html strings for the filtering dropdown
 */
RemindersOpt1Component.prototype.addSubtypeDropdown = function() {
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var jsHtml = [
		"<div id ='" + compId + "subtypeWrapper' class ='" + compNS + "-subtypewrapper'>",
		"<span class='" + compNS + "-suptypespan'>" + this.remo1i18n.FILTER_SUBTYPE + ":</span>",
		"<select name='" + compId + "selectsubType' id = '" + compId + "selectsubType' class ='" + compNS + "-subtypedropdown'>",
		"<option value='" + this.remo1i18n.ALL_SUBTYPE + "'>" + this.remo1i18n.ALL_SUBTYPE + "</option>"
		];

	for (var i = 0; i < this.validSubtype.length; i++) {
		jsHtml.push("<option value='" + this.validSubtype[i] + "'>" + this.validSubtype[i] + "</option>");
	}
		
	jsHtml.push("</select></div>");
	return jsHtml;
};

/**
 * This function handles the filtering of reminders based on subtype.
 */
RemindersOpt1Component.prototype.filterReminders = function () {
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var reminders = this.processedReminders;

	//if chart level and my assigned reminders is checked, filter from myAssignedProcessedReminders .
	if(this.myAssignedRemindersFlag && this.isChartView){
		reminders = this.myAssignedProcessedReminders;
	}

	//filter by look forward date
	reminders = this.filterRemindersByForwardDate(reminders);

	//if no filter display return reminders for all subtypes
	if (this.subtype === this.remo1i18n.ALL_SUBTYPE){
		this.remindersTable.bindData(reminders);
		this.resultsCount = reminders.length;
		$("#" + compNS + compId + " .sec-total").text("(" + this.resultsCount + ")");
	}
	//else create reminders for only subtype chosen. Essentially a subset of the entire set of reminders.
	else{
		var newReminders = [];
		for (var x = 0; x < reminders.length; x++) {
			var reminder = reminders[x];
			if (reminder.TASK_SUBTYPE_DISPLAY === this.subtype) {
				newReminders.push(reminder);
			}
		}
		this.remindersTable.bindData(newReminders);
		this.resultsCount = newReminders.length;
		$("#" + compNS + compId + " .sec-total").text("(" + this.resultsCount + ")");
	}

	//rerender the component table to display the table header if there were no assigned reminders on inital load
	if(this.isRenderComponentTable){
		this.isRenderComponentTable = false;
		$("#" + compId + "tableview").html(this.remindersTable.render());
	}
	else{
		this.remindersTable.refresh();
	}

	this.toggleColumnDisplays();
	
	//called to update the count of Reminders on the workflow chart Navigator when filters are changed.
	CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
		count : this.resultsCount
	});
};

/**
*  This function is called from the filterReminders function.  It will filter the reminders passed as a parameter based on the due date.
*  The default lookForwardCode is 0 for All time.
*  @param {array} reminders: an array of reminder objects that are being filtered.
*  @return {array} reminders or filteredReminders: an array of filtered reminder objects.
*/
RemindersOpt1Component.prototype.filterRemindersByForwardDate = function(reminders) {
	var filterDate = new Date();
	//Change the current time to be the end of the current day by setting the time to 23:59:59
	filterDate.setHours(23,59,59);

	switch(this.lookForwardCode) {
		//Today option selected use the current date
		case 1:
			break;
		//Tomorrow option selected add 1 date to the current date
		case 2:
			filterDate.setDate(filterDate.getDate()+1);
			break;
		//Next 1 Week option selected add 7 days to the current date
		case 3:
			filterDate.setDate(filterDate.getDate()+7);
			break;
		//Next 1 Month option selected add 31 days to the current date
		case 4:
			filterDate.setMonth(filterDate.getMonth()+1);
			break;
		//Next 1 year option selected add 365 days to the current date
		case 5:
			filterDate.setFullYear(filterDate.getFullYear()+1);
			break;
		//Default setting or All selected return all reminders, does not filter based on due date
		default:
			return reminders;
	}

	var filteredReminders = [];

	for(var i=0; i<reminders.length; i++){
		var reminder = reminders[i];
		var dueDate = (reminder.SCHEDULED_DT_TM.search("0000-00-00") !== -1) ? null : new Date();
		if(dueDate){
			dueDate.setISO8601(reminder.SCHEDULED_DATE);
			if(dueDate <= filterDate){
				filteredReminders.push(reminder);
			}
		}
		//No due date exists, always show the reminder no matter the filter date.
		else{
			filteredReminders.push(reminder);
		}
	}

	return filteredReminders;
};

/**
* Determines which columns will be displayed and which columns will be hidden when the component table is refreshed.
*/
RemindersOpt1Component.prototype.toggleColumnDisplays = function() {
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();

	if(this.isChartView && this.validSubtype.length > 0){
		if(this.subtype === this.remo1i18n.ALL_SUBTYPE){
			$("#"+ compNS + compId + "table .rem1-subtype").show();
			$("#"+ compNS + compId + "table .rem1-subject").css({"width" : "40%"});
		}
		else{
			$("#"+ compNS + compId + "table .rem1-subtype").hide();
			$("#"+ compNS + compId + "table .rem1-subject").css({"width" : "65%"});
		}
	}

	if(this.myAssignedRemindersFlag){
		$("#"+ compNS + compId + "table .rem1-from").show();
		$("#"+ compNS + compId + "table .rem1-assignedto").hide();
	}
	else{
		$("#"+ compNS + compId + "table .rem1-from").hide();
		$("#"+ compNS + compId + "table .rem1-assignedto").show();
	}
};

/**
* Creates the columns for the Organizer View.
*/
RemindersOpt1Component.prototype.renderOrganizerColumns = function() {

	//Create the patient column
	var patientColumn = new TableColumn()
		.setColumnId("PATIENT")
		.setCustomClass("rem1-patient")
		.setColumnDisplay(this.remo1i18n.PATIENT)
		.setIsSortable(true)
		.setRenderTemplate('${ PATIENT_DISPLAY }')
		.setPrimarySortField("PERSON_NAME");

	//Create the subject/subtype column
	var subjectSubtypeColumn = new TableColumn()
		.setColumnId("SUBJECT_SUBTYPE")
		.setCustomClass("rem1-subject-subtype")
		.setColumnDisplay(this.remo1i18n.SUBJECT + " / " + this.remo1i18n.SUBTYPE)
		.setIsSortable(true)
		.setRenderTemplate('${ SUBJECT_SUBTYPE_DISPLAY }')
		.setPrimarySortField('TASK_SUBTYPE_DISPLAY');

	subjectSubtypeColumn.addSecondarySortField("SCHEDULED_DT_TM", TableColumn.SORT.ASCENDING);

	this.remindersTable.addColumn(patientColumn);
	this.remindersTable.addColumn(subjectSubtypeColumn);

};

/**
* Creates the columns for the Chart View.
*/
RemindersOpt1Component.prototype.renderChartColumns = function() {
	//Create the subject column
	var subjectColumn = new TableColumn()
		.setColumnId("SUBJECT")
		.setCustomClass("rem1-subject")
		.setColumnDisplay(this.remo1i18n.SUBJECT)
		.setIsSortable(false)
		.setRenderTemplate('${ SUBJECT_DISPLAY }');

	this.remindersTable.addColumn(subjectColumn);
	//Create the subtype column
	//if in chart view and the validSubtypes exist then create the subtype column else no column needed.
	if(this.isChartView && this.validSubtype.length > 0){
		var subtypeColumn = new TableColumn()
			.setColumnId('SUBTYPE')
			.setCustomClass('rem1-subtype')
			.setColumnDisplay(this.remo1i18n.SUBTYPE)
			.setIsSortable(true)
			.setRenderTemplate('${ SUBTYPE_DISPLAY }')
			.setPrimarySortField('TASK_SUBTYPE_DISPLAY');

		subtypeColumn.addSecondarySortField("SCHEDULED_DT_TM", TableColumn.SORT.ASCENDING);

		this.remindersTable.addColumn(subtypeColumn);
	}

};

/**
* Creates the display for the patient information
* @param {class} overdueClass: the css class which determines if the reminder is overdue or not
* @param {object} reminder: the reminder that is being processed.
*/
RemindersOpt1Component.prototype.createPatientDisplay = function(overdueClass, reminder){
	var compId = this.getComponentId();
	var compNS = this.getStyles().getNameSpace();
	var df = MP_Util.GetDateFormatter();
	var patientOverdue = compNS+"-patient-overdue";
	var patientLink = this.createPatientChartViewerLink(reminder.PATIENT_ID, reminder.ENCNTR_ID,reminder.PERSON_NAME);
	var patientName = "<span class='" + overdueClass + "'>" + patientLink + "</span>";
	var patientBirthDtTm = new Date();
	patientBirthDtTm.setISO8601(reminder.BIRTH_DATE);
	var patientAge = MP_Util.CalcAge(patientBirthDtTm, new Date()).replace(" ", "&nbsp;");
	var patientDOB = df.format(patientBirthDtTm, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR).substr(0,8);
	var patientGender = reminder.GENDER.charAt(0);
	var patientMRN = "--";
	if(reminder.MRN){
		patientMRN = reminder.MRN;
	}
	var patientDemographic = "<span class='" + overdueClass + " " + patientOverdue + "'> " + patientAge + "&nbsp;" +  patientGender + 
	"<br>" + this.remo1i18n.DOB + ":&nbsp;" + patientDOB + " " + this.remo1i18n.MRN + ":&nbsp;" + patientMRN + "</span>";

	reminder.PATIENT_DISPLAY = patientName + patientDemographic;
};

/*
 *Creates the patient link. On clicking it the patient chart view is launched.
 * @param {number} patientId: the id of the patient.
 * @param {number} encntrId: the id of the encounter associated to the patient.
 * @param {string} patientName: the name of the patient.
 * @return {string} patientLink: if not in Millennium context then patient name else html string that is a link.
 */
RemindersOpt1Component.prototype.createPatientChartViewerLink = function(patientId, encntrId, patientName) {
	var patientLink = "";

	if (!CERN_Platform.inMillenniumContext()) {
		patientLink = patientName;
	} else {
		patientLink = '<a href="javascript:APPLINK(0,\'Powerchart.exe\',\'/PERSONID=' + patientId + ' /ENCNTRID=' + encntrId + ' /FIRSTTAB=^^\')">' + patientName + '</a>';
	}

	return (patientLink);
};

/**
* Event handle to open the create reminder window when the plus add icon is clicked.
*/
RemindersOpt1Component.prototype.openTab = function() {
	var criterion = this.getCriterion();
	var mpFrameworkObj = CERN_Platform.getDiscernObject("PVFRAMEWORKLINK");
	mpFrameworkObj.InboxCommunicate(1, criterion.person_id, criterion.encntr_id);
};
