(function() {
	/**
	 * Chronic Problems component in the consolidated histories component.
	 */
	ChronicProblemsTab = function(component) {
		this.historyComp = component;
		this.compId = component.getComponentId();
		this.sidePanelMinHeight = "175px";
		this.chxi18n = i18n.discernabu.consolidated_history;
		this.inMillenniumContext = CERN_Platform.inMillenniumContext();
		this.m_hiValidData = false;
		this.tableObj = null;
		this.probTable = null;
		this.sidePanelContainer = null;
		this.sidePanel = null;
		this.panelShowing = false;
		this.previousClickedRow = "";
		this.canModifyChronic = false;
		this.canAddChronicFreeText = false;
		this.sharedCondResource = null;
		this.bedrockConfig = null;
		this.hiTable = null;
		this.hiTableObj = null;
		this.hiMoreDataAvail = false;
		this.m_hiTotalResults = 0;
		this.pageIndex = 0;
		this.m_patientRequests = null;
		this.m_conditions = null;
		this.m_privsObj = null;
	};

	/**
	 * Return patient requests submitted by the patient
	 * @returns {EntityList} list of patient problem requests associated to the patient
	 */
	ChronicProblemsTab.prototype.getPatientRequests = function() {
		return this.m_patientRequests;
	};

	/**
	 * Sets the patient requests associated to the tab
	 * @param {EntityList} patientRequests List of patient requests to be associated to tab
	 */
	ChronicProblemsTab.prototype.setPatientRequests = function(patientRequests) {
		this.m_patientRequests = patientRequests;
	};

	/**
	 * Sets the conditions associated to the problems tab
	 * @param {ConditionList} conditions List of conditions to be associated to tab
	 */
	ChronicProblemsTab.prototype.setConditions = function(conditions) {
		this.m_conditions = conditions;
	};

	/**
	 * Returns the conditions associated to the tab
	 * @returns {ConditionList} List of conditions associated to the tab
	 */
	ChronicProblemsTab.prototype.getConditions = function() {
		return this.m_conditions;
	};

	/**
	 * Sets information on the privileges associated to current user
	 * @param {Object} privs Object containing information on current users problems privs
	 */
	ChronicProblemsTab.prototype.setPrivsObj = function(privs) {
		this.m_privsObj = privs;
	};

	/**
	 * Returns an object containing privilege information for the current user
	 * @returns {Object} Object containing privilege details for the user
	 */
	ChronicProblemsTab.prototype.getPrivsObj = function() {
		return this.m_privsObj;
	};


	/**
	 * Base class to represent a row in the chronic problems table
	 * @param {ChronicProblemsTab} chronicTab The tab that contains the row
	 */
	ChronicProblemsTab.ChronicProblemsTabRow = function(chronicTab) {
		this.ChronicProbTab = chronicTab;
	};

	var ChronicProblemsTabRow = ChronicProblemsTab.ChronicProblemsTabRow;

	/**
	 * Performs updates necessary for the side panel associated to the current row
	 * @param  {SidePanel} sidePanel side panel associated to the row
	 * @returns {undefined}
	 */
	ChronicProblemsTabRow.prototype.updateSidePanel = function(sidePanel) {
		var compContentId = this.ChronicProbTab.historyComp.getStyles().getContentId();
		sidePanel.setTitleText(this.getSidePanelTitleText());
		sidePanel.setActionsAsHTML(this.getSidePanelActionsHtml());
		sidePanel.setContents(this.getSidePanelContentHtml(), compContentId);
		this.sidePanelPostProcessing(sidePanel);
	};

	/**
	 * Returns the HTML to be rendered within the side panel actions section
	 * @returns {String} HTML string to be rendered within the side panel actions section
	 */
	ChronicProblemsTabRow.prototype.getSidePanelActionsHtml = function() {
		return "";
	};

	/**
	 * Returns the content to be rendered within the title section of the side panel
	 * @returns {String} Display to be shown within the title section of side panel
	 */
	ChronicProblemsTabRow.prototype.getSidePanelTitleText = function() {
		return this.DISPLAY_NAME;
	};

	/**
	 * Returns the content to be rendered within the content section of side panel
	 * @returns {String} HTML string to be rendered within side panel content section
	 */
	ChronicProblemsTabRow.prototype.getSidePanelContentHtml = function() {
		return "";
	};

	/**
	 * Performs post processing to be performed after side panel has been updated.
	 * Child classes should ensure this function is called to perform base updaes.
	 * @param  {SidePanel} sidePanel side panel to be updated
	 * @returns {undefined}
	 */
	ChronicProblemsTabRow.prototype.sidePanelPostProcessing = function(sidePanel) {
		var chronicTab = this.ChronicProbTab;
		//hide existing error messages
		$("#chxProb" + chronicTab.compId + "errorMsgBanner").css("display", "none");
		
		if(this.showCommentsIcon){
			sidePanel.expandSidePanel();
			this.renderComments();
		}
		
		//resize panel
		sidePanel.resizePanel();
	};
	
	/**
	 * Fetches and renders comments for a particular condition
	 * @returns {undefined} returns nothing
	 */
	ChronicProblemsTabRow.prototype.renderComments = function() {
		var commentsContainer = null;
		var commentsList = [];
		
		// Fetch comments for a condition and add to commentList
		this.comments.each(function (comment) {
	    	commentsList.push(
	        	"<div class='chx-prob-comment'><div class='chx-prob-comment-text'>",
	        	comment.getText().replace(/\n/g, "<br />"),
	        	"</div><div class='chx-prob-comment-header'>",
	        	comment.getFormattedHeader(),
	       		"</div></div>");
	        });
	 
		// Remove spinner once comments are fetched and render comments
		commentsContainer = $("#chx-comments-container" + this.ChronicProbTab.compId);
		commentsContainer.empty();
	 	commentsContainer.append(commentsList.join(""));
	};
	
	/**
	 * Returns content to be displayed in chronic problem row's classification column
	 * @returns {String} Classification display to be shown in classification column
	 */
	ChronicProblemsTabRow.prototype.getClassificationRenderTemplate = function() {
		return this.CLASS_DISPLAY;
	};

	/**
	 * Returns content to be rendered within the request column.
	 * @returns {String} HTML string to be rendered within request colun
	 */
	ChronicProblemsTabRow.prototype.getRequestRenderTemplate = function() {
		return "--";
	};


	/**
	 * ChronicProblemsRow class for consolidated problems tab for identifying rows to be rendered in the component table
	 * @param self { Object} ChronicProblemTab object
	 * @param condition {Entity.condition} The current condition object for the current person
	 */
	ChronicProblemsTab.ChronicProblemsRow = function(chronicTab, condition, privsObj) {
		this.condition = condition;
		this.ChronicProbTab = chronicTab;
		this.isNKPRow = false;
		this.privsObj = privsObj;
		this.showCommentsIcon = false;
		this.comments = condition.getComments();

		// Assign NKP row properties for qualifying rows
		if (condition.getIsCernerNKP()) {
			this.setNKPRow();
		}
		else {
			this.DISPLAY_NAME = condition.getDisplay() || "--";
			this.CLASS_DISPLAY = condition.getClassification().getDisplay() || "--";
		}
		
		// Set showCommentsIcon for qualifying rows
		if(this.comments.length){
			this.showCommentsIcon = true;
		}	
	};

	var ChronicProblemsRow = ChronicProblemsTab.ChronicProblemsRow;

	ChronicProblemsRow.prototype = new ChronicProblemsTabRow();

	/**
	 * getRenderTemplate: This function will setup the render template for rendering ChronicProblemRow objects
	 * @returns {String} Render template string
	 */
	ChronicProblemsRow.prototype.getRenderTemplate = function() {
		var NKPText = this.ChronicProbTab.chxi18n.NO_CHRONIC_PROBLEMS_FOR_THIS_PATIENT;
		if (this.isNKPRow) {
			return "<span class='priority'><i>" + NKPText + "</i></span>";
		}
		else {
			return this.DISPLAY_NAME;
		}
	};
	
	/**
	 * getCommentsIndRenderTemplate: This function will setup render template for rendering comments indicator
	 * @returns {String} Render string for comments indicator for qualifying rows 
	 */
	ChronicProblemsRow.prototype.getCommentsIndRenderTemplate = function() {
 		if(this.showCommentsIcon) {
 			return "<div class='chx-prob-comment-indicator'></div>";
 		}
 		else {
 			return "";      	
 		}
  	};

	/**
	 * setNKPRow: This function will set NKP specific properties to ChronicProblemsRow object
	 */
	ChronicProblemsRow.prototype.setNKPRow = function() {
		this.isNKPRow = true;
		this.DISPLAY_NAME = "--";
		// Do not show remove if update privilege not honored
		if (this.privsObj.canUpdtNKP) {
			this.CLASS_DISPLAY = "<a id=chxProb" + this.ChronicProbTab.compId + "removeNKPRowBtn>" + this.ChronicProbTab.chxi18n.REMOVE + "</a>";
		}
		else {
			this.ClASS_DISPLAY = "";
		}

	};

	/**
	 * Returns the HTML to be rendered within the side panel action sectoin
	 * @returns {String} HTML string to be be rendered within th eside panel actions section
	 */
	ChronicProblemsRow.prototype.getSidePanelActionsHtml = function() {
		var tab = this.ChronicProbTab;
		return "<div id='chxProb" + tab.compId + "errorMsgBanner' class='chx-error-message'><div class='error-container inline-message'><span id='chxProb" + tab.compId + "errorMsgText' class='error-text message-info-text'>Error Message is displayed</span></div></div><div id='chxProb" + tab.compId + "btnHolder' class='chx-prob-side-panel-btn-holder'><div id = 'chxProb" +
			tab.compId + "cancelBtn' class='chx-prob-side-panel-btn'>" + i18n.CANCEL + "</div><div id = 'chxProb" + tab.compId +
			"resolveBtn' class='chx-prob-side-panel-btn'>" + tab.chxi18n.RESOLVE + "</div><div id = 'chxProb" + tab.compId +
			"modifyBtn' class='chx-prob-side-panel-btn'>" + tab.chxi18n.MODIFY + "</div></div>";
	};

	/**
	 * Return the HTML to be rendered within the side panel
	 * @returns {String} HTML string to be rendered within the side panel content section
	 */
	ChronicProblemsRow.prototype.getSidePanelContentHtml = function() {
		var chxi18n = this.ChronicProbTab.chxi18n;
		var compId = this.ChronicProbTab.compId;
		var condition = this.condition;
		var onset = condition.getOnset();
		var onsetDate = '';
		var sidePanelHTML = '';
		var conditionType = '';
		var classification = '';
		var confirmation = '';
		if (onset) {
			var dateFormatter = MP_Util.GetDateFormatter();
			onsetDate = dateFormatter.format(onset, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
		}
		else {
			onsetDate = "--";
		}

		if (condition.getIsHistorical()) {
			conditionType = chxi18n.HISTORICAL;
		}
		else if (condition.getIsChronic()) {
			conditionType = chxi18n.CHRONIC;
		}

		status = condition.getLifeCycleStatus().getDisplay() || "--";
		condition.STATUS = status;

		classification = this.CLASS_DISPLAY || "--";

		confirmation = condition.getConfirmationStatus().getDisplay() || "--";

		//build rest of side panel HTML with condition info
		sidePanelHTML = "</div><div class='sp-body-contents-padding'><div id='sidePanelScrollContainer" + compId + "' class='sp-body-content-area'><dl class='chx-prob-side-panel-detail-item'><dt>Description</dt><dd class='chx-prob-side-panel-description secondary-text'>" +
		chxi18n.ONSET + " " + chxi18n.DATE + ":</dd><dt>Value</dt><dd class='chx-prob-side-panel-value'>" +
		onsetDate + "</dd></dl><dl class='chx-prob-side-panel-detail-item'><dt>Description</dt><dd class='chx-prob-side-panel-description secondary-text'>" +
		chxi18n.PROBLEM_TYPE + ":</dd><dt>Value</dt><dd class='chx-prob-side-panel-value'>" +
		conditionType + "</dd></dl><dl class='chx-prob-side-panel-detail-item'><dt>Description</dt><dd class='chx-prob-side-panel-description secondary-text'>" +
		chxi18n.STATUS + ":</dd><dt>Value</dt><dd class='chx-prob-side-panel-value'>" + status +
		"</dd></dl><dl class='chx-prob-side-panel-detail-item'><dt>Description</dt><dd class='chx-prob-side-panel-description secondary-text'>" +
		chxi18n.CLASSIFICATION + ":</dd><dt>Value</dt><dd class='chx-prob-side-panel-value'>" + classification +
		"</dd></dl><dl class='chx-prob-side-panel-detail-item'><dt>Description</dt><dd class='chx-prob-side-panel-description secondary-text'>" +
		chxi18n.CONFIRMATION + ":</dd><dt>Value</dt><dd class='chx-prob-side-panel-value'>" + confirmation +
		"</dd></dl>";
		
		if(this.showCommentsIcon) {
   			sidePanelHTML += "<div class='chx-prob-comments-separator'><div class='sp-separator2'></div></div><div>" + chxi18n.COMMENTS +
   			"</div><div id='chx-comments-container" + compId +
   			"' class='chx-prob-comments-container'><div class='loading'></div></div></div>";
   		}
   		else {
   			sidePanelHTML += "</div>";
   		}
   		
		return sidePanelHTML;
	};
	/**
	 * Override parent postprocessing to update the styling of actionable buttons
	 * @param  {SidePanel} sidePanel Side Panel to be updated
	 * @returns {undefined}
	 */
	ChronicProblemsRow.prototype.sidePanelPostProcessing = function(sidePanel) {
		//Call super
		ChronicProblemsTabRow.prototype.sidePanelPostProcessing.call(this, sidePanel);
		//Update buttons
		var tab = this.ChronicProbTab;
		var condition = this.condition;
		tab.determineAvailableButtons(condition);
		tab.bindButtonEvents(condition);

	};

	/**
	 * Class to represent a row in the problems table associated with a PatientRequest
	 * @param {ChronicProblemTab} chronicTab  The tab object containing the row
	 * @param {Condition} condition   The condition entity associated to the row if present
	 * @param {Object} privsObj       The privileges associated with the condition
	 * @param {PatientProblemRequest} patientRequest The patient request associated to the problem and row
	 */
	ChronicProblemsTab.PatientRequestRow = function(chronicTab, condition, privsObj, patientRequest) {
		this.patientRequest = patientRequest;
		this.condition = null;
		this.patRequestInd = true;
		this.m_removeRequestButton = null;
		this.showPatReqSecCommentsIcon = false;

		//determine if comments icon should display
		if (patientRequest.getComments().length) {
			this.showPatReqSecCommentsIcon = true;
		}
		else if (condition) {
			if (condition.getComments().length) {
				this.showPatReqSecCommentsIcon = true;
			}
		}

		this.CLASS_DISPLAY = "--";
		this.DISPLAY_NAME = patientRequest.getHealthIssue();
		var chxi18n = i18n.discernabu.consolidated_history;
	 	if(patientRequest && patientRequest.getRequestType()){
		 	var requestType = patientRequest.getRequestType().getMeaning();
		 	switch (requestType) {
				case "ADD":
					this.REQUEST_TEXT = chxi18n.ADD;
					break;
				case "UPDATE":
					this.REQUEST_TEXT = chxi18n.MODIFY;
					break;
				case "REMOVE":
					this.REQUEST_TEXT = chxi18n.REMOVE;
					break;
			}
	 	}
		this.ChronicProbTab = chronicTab;
		// If an associated condition is found, appear as chronic problem row
		if (condition) {
			ChronicProblemsRow.call(this, chronicTab, condition, privsObj);
		}
	};

	var PatientRequestRow = ChronicProblemsTab.PatientRequestRow;
	PatientRequestRow.prototype = new ChronicProblemsTabRow();

	/**
	 * Generates html to be rendered in name column for patient request
	 * @returns {String} HTML string to be rendered within name column
	 */
	PatientRequestRow.prototype.getRenderTemplate = function() {
		var patientRequest = this.patientRequest;
		var nameDisplay = this.DISPLAY_NAME;

		if (patientRequest.getRequestType().getMeaning() === "REMOVE") {
			return "<div class='chx-remove-strike'>" + nameDisplay + "</div>";
		}
		return nameDisplay;
	};

	/**
	 * Returns the string to render within the classification column for patient request row
	 * @returns {String} HTML string to be rendered within classification column
	 */
	PatientRequestRow.prototype.getClassificationRenderTemplate = function() {
		var patientRequest = this.patientRequest;
		var classDisplay = this.CLASS_DISPLAY;
		if (patientRequest.getRequestType().getMeaning() === "REMOVE") {
			return "<div class='chx-remove-strike'>" + classDisplay + "</div>";
		}
		return classDisplay;
	};
	
	/**
	 * Returns html string for comments column for patient request
	 * @returns {String} HTML string to be rendered within comments column  
	 */
	PatientRequestRow.prototype.getCommentsIndRenderTemplate = function() {
		return (this.showPatReqSecCommentsIcon) ? "<div class='chx-prob-comment-indicator'></div>" : "";
	};
	
	/**
	 * Returns the request type to be displayed in the request column
	 * @returns {String} Display of patient request type
	 */
	PatientRequestRow.prototype.getRequestRenderTemplate = function() {
		var patientRequest = this.patientRequest;
		var chxi18n = i18n.discernabu.consolidated_history;
	 	if(patientRequest && patientRequest.getRequestType()){
		 	var requestType = patientRequest.getRequestType().getMeaning();
		 	switch (requestType) {
				case "ADD":
					return chxi18n.ADD;
					break;
				case "UPDATE":
					return chxi18n.MODIFY;
					break;
				case "REMOVE":
					return chxi18n.REMOVE;
					break;
			}
	 	}
	 	else{
	 		return "--";
	 	}
	};

	/**
	 * Forwards to ChronicProblemsRow 'setNKPRow' when a condition is associated
	 * @returns {undefined}
	 */
	PatientRequestRow.prototype.setNKPRow = function() {
		if (this.condition) {
			return ChronicProblemsRow.prototype.setNKPRow.call(this);
		}
	};

	/**
	 * Retrieve the html to display in a patient request side panel
	 * @returns {String} HTML string containg actions for patient request row
	 */
	PatientRequestRow.prototype.getSidePanelActionsHtml = function() {
		var self = this;
		var tab = this.ChronicProbTab;
		var chxi18n = tab.chxi18n;
		var privsObj = tab.getPrivsObj();
		var createButtonInd = 0;
		
		//Create the button only if the button should be displayed
		if (this.condition) {
			if (this.condition.canModifyChronic()) {
				createButtonInd = 1;
			} else {
				createButtonInd = 0;
			}
		} else {
			if (privsObj.canAddChronicFreeText) {
				createButtonInd = 1;
			} else {
				createButtonInd = 0;
			}
		}
		
		var sidePanelError = "<div id='chxProb" + tab.compId + "errorMsgBanner' class='chx-error-message'><div class='error-container inline-message'><span id='chxProb" + tab.compId + "errorMsgText' class='error-text message-info-text'>Error Message is displayed</span></div></div>";
		
		if (createButtonInd) {
			var removeRequestsBtn = new MPageUI.Button();
			removeRequestsBtn.setLabel(chxi18n.REMOVE_REQUEST);
			removeRequestsBtn.setStyle(MPageUI.BUTTON_OPTIONS.STYLE.SECONDARY);
			removeRequestsBtn.setOnClickCallback(function() {
				//Do some action based on the removal requests
				self.acknowledgeRequest();
			});
			
			/*
			 * Store a reference to the remove request button. The events will be attached in the
			 * PatientRequestRow.prototype.sidePanelPostProcessing function.
			 */
			this.m_removeRequestButton = removeRequestsBtn;
			return sidePanelError + removeRequestsBtn.render();
		} else {
			return sidePanelError;
		}
	};

	/**
	 * Overrides the base ChronicProblemsTabRow.prototype.sidePanelPostProcessing function. It calls the base function
	 * then attaches events to the necessary MPageUI components.
	 * @param {SidePanel} sidePanel - The side panel object.
	 * @returns {undefined} Returns nothing.
	 */
	PatientRequestRow.prototype.sidePanelPostProcessing = function(sidePanel) {
		ChronicProblemsTabRow.prototype.sidePanelPostProcessing.call(this, sidePanel);
		//Attach the button event
		if (this.m_removeRequestButton) {
			this.m_removeRequestButton.attachEvents();
		}
	};

	/**
	 * Acknowledges the request associated with a patient request row
	 * @returns {undefined}
	 */
	PatientRequestRow.prototype.acknowledgeRequest = function() {
		try {
			var probReconcileCAPTimer = new CapabilityTimer('CAP:MPG Histories_Problem History Reconcile Patient Entered Data');
			probReconcileCAPTimer.capture();
			var patientRequest = this.patientRequest;
			var component = this.ChronicProbTab.historyComp;
			var criterion = component.getCriterion();
			var extDataInfoId = patientRequest.getId();
			//var statusCode = MP_Util.GetCodeByMeaning(codesArray, 'ACKNOWLEDGED').codeValue;
			var statusCode = patientRequest.getResponseMeta().ACKNOWLEDGE_CD;
			var chartReferenceId = patientRequest.getProblemValue();
			var personnelId = criterion.provider_id;
			var encounterId = criterion.encntr_id;
			var requestJson = '{"REQUESTIN":{"UPDATESTATUS":[{"EXT_DATA_INFO_ID":' + extDataInfoId + '.0' + ',"STATUS_CODE":' + statusCode + '.0' + ',"CHART_REFERENCE_ID":' + chartReferenceId + '.0' + ',"PERSONNEL_ID":' + personnelId + '.0' + ',"ENCNTR_ID":' + encounterId + '.0}]}}';
			var scriptRequest = new ScriptRequest();
			var self = this;
			scriptRequest.setProgramName("mp_exec_std_request");
			scriptRequest.setRawDataIndicator(true);
			scriptRequest.setDataBlob(requestJson);
			//app number,task number,request number for  INTEROP service UPDATESTATUS
			scriptRequest.setParameterArray(["^MINE^", "^^", 3202004, 3202004, 964756]);
			//callback function to handle the response
			scriptRequest.setResponseHandler(function(scriptReply) {
				try {
					var responseData = JSON.parse(scriptReply.getResponse());
					//if success, render the component  to get the updates to problems
					if (responseData.RECORD_DATA.STATUS.SUCCESS_INDICATOR === 1) {
						component.retrieveComponentData();
					}
					else {
						//display error message in side panel banner
						self.displaySidePanelError();
					}
				} catch (err) {
					//display error message in side panel banner
					self.displaySidePanelError();
				}
			});
			scriptRequest.performRequest();
		}
		catch (err) {
			//display error message in side panel banner
			this.displaySidePanelError();
		}
	};

	/**
	 * Display error for acknowledging patient request
	 * @returns {undefined}
	 */
	PatientRequestRow.prototype.displaySidePanelError = function() {
		var tab = this.ChronicProbTab;
		var chxi18n = tab.chxi18n;
		var $prbSpBanner = $("#chxProb" + tab.compId + "errorMsgBanner");
		var alertBanner = new MPageUI.AlertBanner();
		alertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
		alertBanner.setPrimaryText(chxi18n.REMOVE_PAT_REQUEST_ERROR_TEXT);
		//remove any previous PED error messages
		$prbSpBanner.siblings(".chx-ped-prob-err-remove").remove();
		$prbSpBanner.parent().append("<div class='chx-ped-prob-err-remove'>" + alertBanner.render() + "</div>");
	};

	/**
	 * Returns the content to be displayed in side panel content section for patient request
	 * @returns {String} HTML string to be rendered within side panel content section
	 */
	PatientRequestRow.prototype.getSidePanelContentHtml = function() {
		var patientRequestHtml = "<div class='chx-sp-body-contents'>";
		patientRequestHtml += this.createProbSidePanelPEDHTML();
		if (this.condition) {
			patientRequestHtml += ChronicProblemsRow.prototype.getSidePanelContentHtml.call(this);
		}
		patientRequestHtml += "";
		return patientRequestHtml;
	};
	/**
	 * create the HTML for the patient entered data problems in the side panel
	 * @returns {String} sidePanelHTMLPed patient entered data side panel HTML
	 */
	PatientRequestRow.prototype.createProbSidePanelPEDHTML = function() {
		var inMillenniumContextInd = CERN_Platform.inMillenniumContext();
		var tab = this.ChronicProbTab;
		var component = tab.historyComp;
		var chxi18n = this.ChronicProbTab.chxi18n;
		var patientRequest = this.patientRequest;
		var condition = this.condition;
		var requestType = patientRequest.getRequestType().getMeaning();
		var tempSubmittedDate = patientRequest.getSubmissionDate();
		var submittedDtTmDisplay = tempSubmittedDate ? tempSubmittedDate.format("longDateTime3") : null;
		var requestOnsetDateString = patientRequest.getOnsetDate().getDisplay() || "--";
		var managingProvider = patientRequest.getManagingProvider().getDisplay() || "--";
		var requestSource = patientRequest.getSubmittedByType().getDisplay() || "--";
		var author = patientRequest.getSubmittedBy() || "--";
		var comments = patientRequest.getComments();
		var comment = "--";
		if (comments.length) {
			comment = comments[0].getComment();
		}
		var requestionActionHtml = "";
		var requestDetailsHtml = "";
		var requestSourceHtml = '';
		var requestCommentHtml = "";
		var modifyLabel = "";
		var removeLabel = "";
		var problemsLink = component.getProblemsLink();
		var isProbLinkDisabled = !(inMillenniumContextInd && (problemsLink || component.getLink()));
		switch (requestType) {
			case "ADD":
				requestionActionHtml = '<dl class="chx-sp-detail-group"><dt class="chx-request-label">' + chxi18n.ADDITION + "</dt><dt>" + chxi18n.ADD_THIS_PROBLEM_BY_SEARCH + "</dt></dl>";
				requestDetailsHtml = '<dl class="chx-sp-detail-group"><dl class="chx-sp-details-sub-section"><dt class="chx-request-label">' + chxi18n.ONSET_DATE + "</dt><dd>" + requestOnsetDateString + '</dd></dl><dl class="chx-sp-details-sub-section"><dt class="chx-request-label">' + chxi18n.MANAGING_PROVIDER + "</dt><dd>" + managingProvider + "</dd></dl></dl>";
				break;
			case "UPDATE":
					modifyLabel = condition.getIsChronic() ? chxi18n.MODIFICATION_OF_CHRONIC : chxi18n.MODIFICATION_OF_RESOLVED;
					requestionActionHtml = '<dl class="chx-sp-detail-group"><dt class="chx-request-label">' + modifyLabel + "</dt><dt>";
				if (condition.canModifyChronic()) {
					var updateProblemLink = component.createTabLink(chxi18n.PROBLEMS, isProbLinkDisabled, 'chx-problems-sp-link');
					requestionActionHtml += chxi18n.UPDATE_PROBLEM_WITHIN.replace(/\{0\}/g, updateProblemLink) + "</dt><div>" + this.buildProblemModificationHtml() + "</div></dl>";
				}
				break;
			case "REMOVE":
					removeLabel = condition.getIsChronic() ? chxi18n.REMOVAL_OF_CHRONIC : chxi18n.REMOVAL_OF_RESOLVED;
					requestionActionHtml = '<dl class="chx-sp-detail-group"><dt class="chx-request-label">' + removeLabel + "</dt><dt>";
				if (condition.canModifyChronic()) {
					var updateProblemLink = component.createTabLink(chxi18n.PROBLEMS, isProbLinkDisabled, 'chx-problems-sp-link');
					requestionActionHtml += chxi18n.UPDATE_PROBLEM_WITHIN.replace(/\{0\}/g, updateProblemLink) + "</dt><div>" + "" + "</div></dl>";
				}
				break;
		}
		requestSourceHtml += '<dl class="chx-sp-detail-group"><dl class="chx-sp-details-sub-section"><dt class="chx-request-label">' + chxi18n.ORIGINATING_SOURCE + "</dt><dd>" + requestSource + '</dd></dl><dl class="chx-sp-details-sub-section"><dt class="chx-request-label">' + chxi18n.ORIGINATING_AUTHOR + "</dt><dd>" + author + "</dd></dl></dl>";
		if (comment) {
			requestCommentHtml += '<dl><dt class="chx-request-label">' + chxi18n.PATIENT_COMMENT + "</dt><dd>" + comment + "</dd></dl>";
		}
		var sidePanelHTMLPed = '<dl><dd><dt class="chx-expand-content-section"><span class="chx-side-panel-tgl chx-hide-expand-btn" title="collapse">&nbsp;</span><span class="chx-pat-req-icon">&nbsp</span><span>' + chxi18n.OUTSIDE_REQUESTS + '</span><span class="chx-pull-right">';
		sidePanelHTMLPed += (submittedDtTmDisplay || "--") + '</span></dt></dl><div class="chx-expand-content"><dl>' + requestionActionHtml + requestDetailsHtml + requestSourceHtml + requestCommentHtml + "</dd></div></dl>";
		sidePanelHTMLPed += '</div><div class="sp-separator">&nbsp;</div>';
		return sidePanelHTMLPed;
	};

	/**
	 * Generates the HTML representing the list of modifications requested for problem
	 * @returns {String} HTML string representing modification list
	 */
	PatientRequestRow.prototype.buildProblemModificationHtml = function() {
		var chxi18n = this.ChronicProbTab.chxi18n;
		var patientRequest = this.patientRequest;
		var modificationsHtml = '<ul class="chx-sp-item-list">';
		var onsetDate = patientRequest.getOnsetDate();
		var managingProvider = patientRequest.getManagingProvider();
		var onsetDateDisplay = "";
		var modifiedOnsetDateDisplay = "";
		var managingProviderDisplay = "";
		var modifiedManagingProviderDisplay = "";
		if (onsetDate && onsetDate.getModifyStatusValue()) {
			onsetDateDisplay = onsetDate.getDisplay() || "--";
			modifiedOnsetDateDisplay = onsetDate.getModifiedDisplay() || "--";
			modificationsHtml += "<li>" + chxi18n.CHANGE_ONSET_FROM.replace(/\{0\}/g, onsetDateDisplay).replace(/\{1\}/g, modifiedOnsetDateDisplay) + "</li>";
		}
		if (managingProvider && managingProvider.getModifyStatusValue()) {
			managingProviderDisplay = managingProvider.getDisplay() || "--";
			modifiedManagingProviderDisplay = managingProvider.getModifiedDisplay() || "--";
			modificationsHtml += "<li>" + chxi18n.CHANGE_MANAGING_PROVIDER.replace(/\{0\}/g, managingProviderDisplay).replace(/\{1\}/g, modifiedManagingProviderDisplay) + "</li>";
		}

		modificationsHtml += "</ul>";
		return modificationsHtml;
	};

	/**
	 * Returns whether or not patient requests should be loaded for the patient based on bedrock settings
	 * @returns {Boolean} Returns true if and only if patient requests should be loaded
	 */
	ChronicProblemsTab.prototype.shouldLoadPatientRequests = function() {
		var patientEnteredDataFilter = this.historyComp.getPatientEnteredDataInd();
		var displayHiDataInd = this.historyComp.getDisplayHiDataInd();
		var viewOutsideRecsSelected = this.historyComp.getViewOutsideHistoriesInd();
		var patRequestsDisplayInd = (patientEnteredDataFilter && viewOutsideRecsSelected && !displayHiDataInd) ? true : false;
		return patRequestsDisplayInd;
	};

	/**
	 * renderComponent: This function will start the rendering of the chronic problems tab in histories
	 * @param component {Object} The histories component object
	 */
	ChronicProblemsTab.prototype.renderComponent = function() {
		this.panelShowing = false;
		var self = this;


		function wrappedSelfCallback(conditions, privsObj) {
			self.setConditions(conditions);
			self.setPrivsObj(privsObj);
			self.setupChronicProblems();
		}

		if (this.shouldLoadPatientRequests()) {
			this.retrievePatientRequests();
		}

		// Get shared resource data, if it doesn't exist, call getSharedResource, if it exists, call retrieveSharedResourceData to get the latest
		if (!this.sharedCondResource) {
			this.sharedCondResource = SharedConditionResource.getSharedResource(wrappedSelfCallback, self);
		}
		else {
			this.sharedCondResource.retrieveSharedResourceData();
		}
	};

	/**
	 * Retrieves the patient requets for the current patient
	 * @returns {undefined}
	 */
	ChronicProblemsTab.prototype.retrievePatientRequests = function() {
		var self = this;
		var criterion = this.historyComp.getCriterion();
		var probLoadCAPTimer = new CapabilityTimer('CAP:MPG Histories_Problem History Load Patient Entered Data');
		probLoadCAPTimer.capture();
		this.historyComp.PEDLoadCAPTimers.PROBLEMS_LOADED = true;
		MPageEntity.entities.PatientProblemRequest.list({'personId': criterion.person_id + ".0"}, function(patientRequests, response, error) {
			self.setPatientRequests(patientRequests);
			self.setupChronicProblems();
		});
	};

	/**
	 * Returns new list of PatientProblemRequests with requests where the associated problem is not in the condition list filtered out
	 * @param  {EntityList} patientRequests List of patient requests to filter
	 * @returns {EntityList} List of filtered patient requests (no update/modify requests without a matching condition)
	 */
	ChronicProblemsTab.prototype.filterAddModifyRequestsWithoutMatchingProblem = function(patientRequests) {
		var self = this;
		//Filter out update and remove requests without matching problems
		var filteredRequests = patientRequests.filterFunction(function(patientRequest) {
			var problemId = patientRequest.getProblemValue();
			if (problemId) {
				return self.getConditionWithProblemId(problemId) ? true : false;
			}
			return true;
		});
		return filteredRequests;
	};

	/**
	 * Searches through the condition list to find a condition containing the problem with the passed problemId
	 * @param  {Number} problemId Id of the problem to search for
	 * @returns {ConditionEntity}    Condition containing the searched problemId if found, null otherwise
	 */
	ChronicProblemsTab.prototype.getConditionWithProblemId = function(problemId) {
		var conditions = this.getConditions();
		var conditionCnt = conditions.length;
		var problemCnt = 0;
		var condition = null;
		var problem = null;
		var problems;
		var currProblemId = 0;
		for (var i = 0; i < conditionCnt; i++) {
			condition = conditions[i];
			problems = condition.getProblems();
			problemCnt = problems.length;
			for (var x = 0; x < problemCnt; x++) {
				problem = problems[x];
				currProblemId = problem.getId();
				if (problemId === currProblemId) {
					return condition;
				}
			}
		}
		return null;
	};

	/**
	 * Generate a request map to associate requests to conditions
	 * @param  {EntityList} requests  List of patient requests
	 * @returns {Object} Map from a request id to a condition
	 */
	ChronicProblemsTab.prototype.generateRequestMap = function(requests) {
		var requestMap = {};
		var requestCnt = requests.length;
		var request = null;
		var problemId = 0;
		var condition = null;
		//Add mapping for each request to an associated condition (if found)
		for (var i = 0; i < requestCnt; i++) {
			request = requests[i];
			requestId = request.getId();
			problemId = request.getProblemValue();
			condition = this.getConditionWithProblemId(problemId);
			requestMap[requestId] = condition;
		}
		return requestMap;
	};

	/**
	 * Creates the Healthe Intent Data control
	 *
	 * @returns {String} an internationalized as of date string
	 */
	ChronicProblemsTab.prototype.createHIAddDataControl = function() {

		var hiAddDataContainer = "<div id='chx-hi-ext-label-outer" + this.compId + "'"
			+ " class='chx-hi-ext-div'><div class='chx-hi-ext-label'>";
		var imgUrl = this.historyComp.getCriterion().static_content + "/images/";

		var imgSuccess = "6965.png";
		imgUrl += imgSuccess;
		var msg = "";
		var hiTitleSpan;
		var btnSpan;

		if (!this.m_hiTotalResults > 0) {

			return "";

		}
		else if (this.m_hiValidData) {

			btnSpan = "<span style='float:right'><button ";
			btnSpan += "class='chx-hi-ext-btn' id='hiDataControlBtn";
			btnSpan += this.compId;
			btnSpan += "'>";
			btnSpan += this.chxi18n.HI_BTN_TXT;
			btnSpan += "</button></span>";
			msg = this.chxi18n.HI_EXT_LABEL;

		}
		else {
			msg = this.chxi18n.EXTERNAL_DATA_LABEL_ERR;
			btnSpan = "";
		}

		var imgSpan = "<span><img height='22'	width='22' style='float:left' id='externalDataAvailableImg' src= '";
		imgSpan += imgUrl;
		imgSpan += "'></span>";

		hiTitleSpan = "<span style='margin-left:5px; padding-top:5px;'>";
		hiTitleSpan += msg;
		hiTitleSpan += "</span>";

		hiAddDataContainer += imgSpan;
		hiAddDataContainer += hiTitleSpan;
		hiAddDataContainer += btnSpan;
		hiAddDataContainer += "</div></div><div id='placeholder_emptydiv'></div>";

		return hiAddDataContainer;
	};
	/**
	 * processExtData: This function processes the external data
	 * if a required field is not present or is null , it is replaced with "--".
	 * @param    {object} array holding conditions from HI.
	 */
	ChronicProblemsTab.prototype.processExtData = function(conditionsArray) {
		try {
			for (var i = 0; i < conditionsArray.length; i++) {

				var effectDt = conditionsArray[i].most_recent_condition["effective_date"];
				var status = conditionsArray[i].most_recent_condition["status"];

				if (effectDt) {

					var dateTime = new Date();
					dateTime.setISO8601(effectDt);
					effectDt = MP_Util.GetDateFormatter().format(dateTime,
						mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
					conditionsArray[i].EFFECT_UTC = effectDt;
				}
				else {
					conditionsArray[i].EFFECT_UTC = "--";
				}
				if (!status) {
					conditionsArray[i].most_recent_condition["status"] = "--";
				}
			}
			return conditionsArray;
		} catch (err) {
			this.m_hiValidData = false;
		}

	};

	/**
	 * validateHIData: This function validates the data recieved from HI-CCL scripts.
	 * @param    {string or object}
	 */
	ChronicProblemsTab.prototype.validateHIData = function(reply) {

		this.m_hiValidData = false;
		var recordData;
		try {
			if (typeof reply === 'object') {
				recordData = reply;
			}
			else {
				recordData = JSON.parse(reply).RECORD_DATA;
			}

			var hiStatus = recordData.STATUS_DATA.SUBEVENTSTATUS[0].OPERATIONSTATUS;

			if (hiStatus === "S") {

				var conditions = JSON.parse(recordData.HTTPREPLY.BODY);
				this.m_hiTotalResults = conditions.total_results;

				if (this.m_hiTotalResults > 0 && (conditions.groups[0].most_recent_condition)) {
					this.m_hiValidData = true;
				}
				else {
					this.m_hiValidData = false;
				}
			}
			else {
				this.m_hiValidData = false;
			}
		} catch (err) {
			MP_Util.LogJSError(err, this, "consolidated-chronicproblems.js", "validateHIData");
			this.m_hiValidData = false;
		}
	};
	/**
	 * setHITable: This function sets the html for the hiTable in the ProblemsTab.
	 * @param    {string or object}
	 */
	ChronicProblemsTab.prototype.setHITable = function(replyData) {

		var self = this;
		var recordData;
		var status;
		var conditionGroups;
		this.validateHIData(replyData);

		try {
			if (this.m_hiValidData) {

				var jsonEval = JSON.parse(replyData);
				recordData = jsonEval.RECORD_DATA;

				conditionGroups = JSON.parse(recordData.HTTPREPLY.BODY);

				this.hiMoreDataAvail = conditionGroups.more_results;
				this.m_hiTotalResults = conditionGroups.total_results;
				conditionGroups = this.processExtData(conditionGroups.groups);

				this.hiTable = new ComponentTable();
				this.hiTable.setNamespace("hiDataConsProbHist" + this.compId);

				var nameColumn = new TableColumn();
				nameColumn.setColumnId("Problem");
				nameColumn.setCustomClass("chx-hi-prob-col-name");
				nameColumn.setColumnDisplay(this.chxi18n.PROBLEMS);
				nameColumn.setPrimarySortField("NAME_TEXT");
				nameColumn.setIsSortable(true);
				nameColumn.setRenderTemplate("${name}");

				var effectiveDateColumn = new TableColumn();
				effectiveDateColumn.setColumnId("EffectiveDate");
				effectiveDateColumn.setCustomClass("chx-hi-hide");
				effectiveDateColumn.setColumnDisplay(this.chxi18n.EFFECTIVE_DATE);
				effectiveDateColumn.setPrimarySortField("EffectiveDate");
				effectiveDateColumn.setIsSortable(true);
				effectiveDateColumn.setRenderTemplate("${EFFECT_UTC}");

				var typeColumn = new TableColumn();
				typeColumn.setColumnId("Type");
				typeColumn.setCustomClass("chx-hi-hide");
				typeColumn.setColumnDisplay(this.chxi18n.TYPE);
				typeColumn.setPrimarySortField("TYPE");
				typeColumn.setIsSortable(true);
				typeColumn.setRenderTemplate("${most_recent_condition.type}");

				this.hiTable.addColumn(nameColumn);
				this.hiTable.addColumn(typeColumn);
				this.hiTable.addColumn(effectiveDateColumn);

				this.hiTable.bindData(conditionGroups);

				var clickExtension = new TableCellClickCallbackExtension();
				clickExtension.setCellClickCallback(function(event, data) {
					self.onRowClick(event, data);
				});

				this.hiTable.addExtension(clickExtension);
			}
		} catch (err) {
			this.m_hiValidData = false;
		}
	};
	/**
	 * LoadHIConditionsPage: This function gets called each time a user clicks next or prev in the pager div.
	 * @param    {object} self
	 */
	ChronicProblemsTab.prototype.LoadHIConditionsPage = function(self) {

		var component = self.historyComp;
		var criterion = component.getCriterion();
		var request = null;
		var sendAr = [];
		var aliasPoolCd = 0.0;
		var hiPrLookUpKey = "null";
		var hiTestUri = "null";
		var aliasType = (component.getAliasType().length > 0) ? component.getAliasType() : "null";

		if ($.trim(component.getHILookupKey()).length > 0) {
			hiPrLookUpKey = component.getHILookupKey();
		}
		if ($.trim(component.getHITestUri()).length > 0) {
			hiTestUri = component.getHITestUri();
		}
		if ($.trim(component.getAliasPoolCd())) {
			aliasPoolCd = component.getAliasPoolCd() + ".0";
		}


		sendAr.push("^MINE^"
			, "^" + hiPrLookUpKey + "^"
			, "^" + aliasType + "^"
			, aliasPoolCd
			, "^" + hiTestUri + "^"
			, self.pageIndex
			, criterion.person_id + ".0"
			, criterion.provider_id + ".0"
			, criterion.ppr_cd + ".0");

		var request = new MP_Core.ScriptRequest(self, component.getComponentLoadTimerName());
		request.setProgramName("MP_GET_CONDITIONS_JSON");
		request.setParameters(sendAr);
		request.setAsync(true);

		MP_Core.XMLCCLRequestCallBack(self, request, function(reply) {

			try {
				var response = reply.getResponse();
				self.validateHIData(response);
				if (self.m_hiValidData) {

					self.externalCondData = JSON.parse(response.HTTPREPLY.BODY);

					var conditionsArray = self.processExtData(self.externalCondData.groups);
					self.hiTable.bindData(conditionsArray);
					self.hiTable.refresh();

					if (self.panelShowing) {
						if (self.previousClickedRow.split(":")[0].match(self.hiTable.getNamespace()) != null) {
							var rowSelected = self.hiTable.getRows()[0];
							self.renderPanelDetails(rowSelected.resultData);
							self.highlightSelectedRow($(self.hiTableObj.find('.result-info')[0]));
						}
					}

				}
				else {
					var errMsg = "Error in retriving external data";
					self.hiTableObj.html(MP_Util.HandleErrorResponse("", errMsg));
				}
			} catch (err) {
				MP_Util.LogJSError(err, self, "consolidated-chronicproblems.js", "LoadHIConditionsPage");
			} finally {
				self.hiTableObj.find('.loading-screen').remove();
				self.historyComp.resizeComponent();
			}
		});
	};

	/**
	 *showHIData : gets executed when a user clicks on
	 *button from the external data available banner.
	 */
	ChronicProblemsTab.prototype.showHIData = function() {

		// Use CAP timer to track usage of HealtheIntent Data
		var hiProbTimer = new CapabilityTimer("CAP:MPG Display HealtheIntent Data");
		hiProbTimer.capture();

		var label = "<p id = 'externalDataLabel'>";
		label += "<span class='chx-ext-data-indicator'></span>";
		label += "<span style='margin-left:5px text-align:left;padding-left: 7px;font-weight: bold;'>";
		label += this.chxi18n.HI_BTN_LBL_UPON_CLICK + "</span></p><br>";

		$("#chx-hi-ext-label-outer" + this.compId).html(label);
		var probTabContent = $("#probTabContent" + this.compId);


		if (this.hiMoreDataAvail == true &&
			this.m_hiTotalResults != null && this.m_hiTotalResults > 20) {
			var spinnerDiv = "<div id='spinner" + this.historyComp.getComponentId() + "' style='position:relative'>";
			var self = this;
			var noOfPages = Math.ceil(this.m_hiTotalResults / 20);
			var lastPageNo = 0;

			this.pager = new MPageUI.Pager().setNumberPages(noOfPages).setCurrentPageLabelPattern("${currentPage}/${numberPages}")
				.setNextLabel(this.chxi18n.NEXT + " >")
				.setPreviousLabel("< " + this.chxi18n.PREV);
			this.pager.setOnPageChangeCallback(function() {

				MP_Util.LoadSpinner(self.hiTable.getNamespace());

				if (lastPageNo < arguments[0].currentPage) {
					self.pageIndex = self.pageIndex + 20;
				}
				else {
					self.pageIndex = this.pageIndex - 20;
				}
				self.LoadHIConditionsPage(self);
				lastPageNo = arguments[0].currentPage;
			});
			var pagerDiv = "<div id='pager" + this.compId +
				"'  class='chx-row-pager'>" + this.pager.render() + "</div>";
			probTabContent.prepend(spinnerDiv + this.hiTable.render() + "</div>" + pagerDiv + "<br><br>");
			this.pager.attachEvents();
		}
		else {
			probTabContent.prepend(this.hiTable.render() + "<br><br>");
		}


		this.hiTable.finalize();
		this.hiTableObj = $("#hiDataConsProbHist" + this.compId + "table");
		if (this.panelShowing) {
			this.hiTableObj.addClass('chx-hi-hide-mode');
		}
	};

	/**
	 * setupChronicProblems: This function will filter out the chronic and historical problems from the
	 * other returned conditions
	 * @param conditions {Entity.condition} The conditions for the current person
	 * @param privsObj {Object} Privileges object containing privilige values
	 */
	ChronicProblemsTab.prototype.setupChronicProblems = function() {
		var problem = null;
		var shouldLoadPatReq = this.shouldLoadPatientRequests();
		if (shouldLoadPatReq && (!this.getConditions() || !this.getPatientRequests())) {
			//wait for both patient requests to load to render when patient requests are to be displayed
			return;
		}

		var conditions = this.getConditions();
		var privsObj = this.getPrivsObj();
		var chronicProbsRows = [];
		var historicProbsRows = [];
		var historiesTabsArray = this.historyComp.m_tabControl.getTabs();
		var problemsTab = historiesTabsArray[this.historyComp.HistoryComponentIndexObj.PROBLEMS];
		var patientRequestRows = [];
		var requestMap = {};
		var requestCnt = 0;

		if (privsObj) {
			this.canModifyChronic = privsObj.canModifyChronic;
			this.canAddChronicFreeText = privsObj.canAddChronicFreeText;
		}

		var patientRequests = this.getPatientRequests();
		if (patientRequests && patientRequests.length && shouldLoadPatReq) {
			//filter out requests whose associated problem is not in condition list
			patientRequests = this.filterAddModifyRequestsWithoutMatchingProblem(patientRequests);
			this.setPatientRequests(patientRequests);
			requestMap = this.generateRequestMap(patientRequests);
			requestCnt = patientRequests.length;
		}

		//Determine whether the given condition has an associated condition
		var conditionHasPatientRequest = function(condition) {
			var problems = condition.getProblems();
			var problemCnt = problems.length;
			var problemId = 0;
			var requestId;
			var request = null;
			//Loop through requests to see if an assocaited condition is found
			for (var i = 0; i < requestCnt; i++) {
				request = patientRequests[i];
				requestId = request.getId();
				if (requestMap[requestId] === condition) {
					return true;
				}
			}
			return false;
		};


		//filter this to only show medical or patient stated classifications that are chronic or historical chronic
		var chronicProbs = conditions.filter(function(condition) {
			return condition.getIsChronic() === true && (!conditionHasPatientRequest(condition)) &&
				(condition.getIsCernerNKP() === true || condition.getClassification().getMeaning() === "MEDICAL" ||
				condition.getClassification().getMeaning() === "PATSTATED");
		});

		var historicProbs = conditions.filter(function(condition) {
			return condition.getIsHistorical() === true && (!conditionHasPatientRequest(condition)) &&
				(condition.getClassification().getMeaning() === "MEDICAL" ||
				condition.getClassification().getMeaning() === "PATSTATED");
		});

		for (var i = requestCnt; i--;) {
			var currRequest = patientRequests[i];
			var currRequestId = currRequest.getId();
			var associatedCondition = requestMap[currRequestId];
			patientRequestRows[i] = new PatientRequestRow(this, associatedCondition, privsObj, currRequest);
		}

		// set up active chronic problems for use in component table
		for (var i = chronicProbs.length; i--;) {
			chronicProbsRows[i] = new ChronicProblemsRow(this, chronicProbs[i], privsObj);
		}

		// set up active chronic problems for use in component table
		for (i = historicProbs.length; i--;) {
			historicProbsRows[i] = new ChronicProblemsRow(this, historicProbs[i], privsObj);
		}
		
		// If tab is not to be rendered, update tab count and return
		if(problemsTab.id !== this.historyComp.m_tabControl.m_defaultTab) {
			problemsTab.hasIndicator = false;
			problemsTab.count =  chronicProbsRows.length + historicProbsRows.length;
			this.historyComp.tabsData[problemsTab.index].count =  chronicProbsRows.length + historicProbsRows.length;
			if(patientRequestRows.length > 0 && this.historyComp.getViewOutsideHistoriesInd()){
			    this.historyComp.updateTabIndicator(problemsTab, "<span class='chx-pat-req-icon'></span>");
			    problemsTab.count +=  patientRequestRows.length;
			    this.historyComp.tabsData[problemsTab.index].count += patientRequestRows.length;
   			}
   			this.historyComp.updateTabCount();
			return;
		}
		
		this.createTable(chronicProbsRows, historicProbsRows, privsObj, conditions, patientRequestRows);
	};

	/**
	 * renderNKPBanner: This function will create a new NKP banner
	 *
	 */
	ChronicProblemsTab.prototype.renderNKPBanner = function() {
		var targetElement = null;
		var messageType = null;
		var messageTemplate = null;
		var noChronicAlertMsg = null;
		var nkpMessageLink = "";
		var documentNKPMessage = "";
		var nkpMsgHTML = "";
		var self = this;

		// Setup AlertMessage template
		targetElement = $("#noChronicProbMsg" + this.compId);
		messageType = MPageControls.AlertMessage.MessageTypes.INFORMATION;
		messageTemplate = MPageControls.getDefaultTemplates().messageBar;
		noChronicAlertMsg = new MPageControls.AlertMessage(targetElement, messageTemplate, messageType);

		// Fill message contents
		nkpMessageLink = "<a id=chxProb" + this.compId + "documentNKPBtn>" + this.chxi18n.NO_CHRONIC_PROBLEMS + "</a>";
		documentNKPMessage = this.chxi18n.DOCUMENT_NO_CHRONIC_PROBLEMS.replace(/\{0\}/g, nkpMessageLink);
		nkpMsgHTML = "<span>" + this.chxi18n.NO_CHRONIC_PROBLEMS_DOCUMENTED + "</span><span class ='conprobo3-document-ncp'>&nbsp;" + documentNKPMessage + "</span>";

		// Render NKP Banner
		noChronicAlertMsg.render(nkpMsgHTML);

	};

	/**
	 * getCancelledNKPCondition: This function gets cancelled NKP conditions from set of conditions
	 *
	 */
	ChronicProblemsTab.prototype.getCancelledNKPCondition = function() {
		return this.sharedCondResource.getResourceData().filter("isCernerNKP", true).filter("isChronic", false)[0];
	};

	/**
	 * getActiveNKPCondition: This function gets active NKP condition from set of conditions
	 *
	 */
	ChronicProblemsTab.prototype.getActiveNKPCondition = function() {
		return this.sharedCondResource.getResourceData().filter("isCernerNKP", true).filter("isChronic", true)[0];
	};

	/**
	 * bindNKPEvents: This function binds the NKP specific events to appropriate functionality
	 *
	 */
	ChronicProblemsTab.prototype.bindNKPEvents = function() {
		var self = this;
		var removeNKPBtn = $("#chxProb" + this.compId + "removeNKPRowBtn");
		var documentNKPBtn = $("#chxProb" + this.compId + "documentNKPBtn");

		removeNKPBtn.click(function() {
			var activeNKPCondition = self.getActiveNKPCondition();
			self.removeNKPCondition(activeNKPCondition);
		});

		documentNKPBtn.click(function() {
			self.documentNoChronicProblems(self);
		});

	};

	/**
	 * removeNKPCondition: This function removes active NKP condition
	 *
	 */
	ChronicProblemsTab.prototype.removeNKPCondition = function(activeNKPCondition) {
		var self = this;
		activeNKPCondition.cancel(function() {
			self.sharedCondResource.retrieveSharedResourceData();
		});
	};

	/**
	 * documentNoChronicProblems: This function will document NKP problem
	 *
	 */
	ChronicProblemsTab.prototype.documentNoChronicProblems = function(self) {
		var cancelledNKPCondition = self.getCancelledNKPCondition();
		if (cancelledNKPCondition) {
			//If cancelled NKP exists, reactive
			cancelledNKPCondition.setIsChronic(true);
			cancelledNKPCondition.activate(function() {
				self.sharedCondResource.retrieveSharedResourceData();
			});
		}
		else {
			//Otherwise, create new NKP condition
			var cond = new MPageEntity.entities.Condition();
			var criterion = this.historyComp.getCriterion();
			var encntr = criterion.encntr_id;
			var prsn = criterion.person_id;
			var cernerNKPNomenclature = this.sharedCondResource.getCernerNKPNomenclature();

			cond.setIsThisVisit(false);
			cond.setIsChronic(true);
			cond.setClassificationValue(0.0);
			cond.setNomenclatureValue(cernerNKPNomenclature);
			cond.setTargetNomenclatureValue(cernerNKPNomenclature);
			cond.setEncounterValue(encntr);
			cond.setPersonValue(prsn);
			cond.create(function() {
				self.sharedCondResource.retrieveSharedResourceData();
			});
		}
	};

	/**
	 * resetNKPRow: This function resets NKP row at the top of the chronic section
	 * @param {ChronicProblemRow} NKP chronic problem row object
	 */
	ChronicProblemsTab.prototype.resetNKPRow = function(chronicRowsObj) {

		// Search for nkp row and move it to top of the chronic problems section
		for (var i = chronicRowsObj.length; i--;) {
			if (chronicRowsObj[i].isNKPRow) {
				var nkpRowId = "chxProb" + this.compId + ":CHRONIC_GROUP:row" + i;
				var nkpRow = document.getElementById(nkpRowId);
				this.moveNKPToTop(nkpRow);
				break;
			}
		}

		// Reset previous highlighted row if exists
		this.resetPreviousHighlightedRow();
	};


	/**
	 * resetPreviousHighlightedRow: This function resets previously highlighted row if exists
	 *
	 */
	ChronicProblemsTab.prototype.resetPreviousHighlightedRow = function() {
		// Reset highlighted row
		if (this.previousClickedRow !== "") {
			var selectedRow = document.getElementById(this.previousClickedRow);
			this.highlightSelectedRow($(selectedRow));
		}
	};

	/**
	 * moveNKPToTop: This function resets NKP row at the top of the chronic section
	 * @param { Object} nkpRow to be attached at the top of the chronic section
	 *
	 */
	ChronicProblemsTab.prototype.moveNKPToTop = function(nkpRow) {
		if (nkpRow) {
			// Prepend NKP row to top of list of rows of chronic problems group
			$("#chxProb" + this.compId + "\\:CHRONIC_GROUP\\:content").prepend(nkpRow);

			// Call function to fix zebra stripes after shifting rows
			this.fixZebraStripes();
		}
	};

	/**
	 * fixZebraStripes: This function resets the zebra striping for the component table
	 *
	 */
	ChronicProblemsTab.prototype.fixZebraStripes = function() {
		var tableBodyArr = $("#chxProb" + this.compId + "\\:CHRONIC_GROUP\\:content").children();

		// redo zebra striping
		for (var i = 0; i < tableBodyArr.length; i++) {
			tableBodyArr[i].className = "result-info " + ((i % 2 === 0) ? "odd" : "even");
		}

		// Reset previous highlighted row if exists
		this.resetPreviousHighlightedRow();
	};

	/**
	 * checkShowNKPBanner: This function will check if NKP banner is to be displayed based on different conditions
	 *
	 */
	ChronicProblemsTab.prototype.checkShowNKPBanner = function(nkpPrivsObj, conditions) {

		var showNKPBanner = false;
		var hasNKPFlag = false;
		var activeConditions = conditions.filter("isCernerNKP", true).filter("isChronic", true);

		if (activeConditions.length) {
			hasNKPFlag = true;
		}
		if (!(nkpPrivsObj.hasChronicProbs) && nkpPrivsObj.cernerNKPNomenclature > 0.0) {
			if (nkpPrivsObj.canViewNKP && nkpPrivsObj.canUpdtNKP) {
				if (!hasNKPFlag) {
					showNKPBanner = true;
				}
			}
		}
		return showNKPBanner;
	};


	/**
	 * createTable: This function will create a new component table
	 * @param chronicProblems {ChronicProblemsRow} Collection of chronic problems rows
	 * @param historicalProblems {ChronicProblemsRow} Collection of historical problems rows
	 * @param nkpPrivsObj {Object} The privileges required to decide show/hide NKP banner
	 * @param conditions {Entity.condition} The conditions for the current person
	 */
	ChronicProblemsTab.prototype.createTable = function(chronicProblems, historicalProblems, nkpPrivsObj, conditions, patientRequestRows) {
		var patientEnteredDataFilter = this.historyComp.getPatientEnteredDataInd();
		var displayHiDataInd = this.historyComp.getDisplayHiDataInd();
		var viewOutsideRecsSelected = this.historyComp.getViewOutsideHistoriesInd();
		var patRequestsDisplayInd = this.shouldLoadPatientRequests();

		var tablePanelHTML = "";
		var problemCnt = chronicProblems.length + historicalProblems.length;
		var historiesTabsArray = this.historyComp.m_tabControl.getTabs();
		
		var self = this;
		var nkpMsgContainerHTML = "<div class ='message-container cpo3-nkp-msg' id ='noChronicProbMsg" + self.compId + "'></div>";

		var segmentedControl = null;


		  
		// Finalize the component
		this.historyComp.isProblemsRendered = true;

		var hiDatalabel = "";
		var probTabContainer = "<div id='probTabContent" + this.compId + "' style='position:relative'>";

		var segmentedControlHTML = "";
		//external data needs to be enabled along with view outside records checked to display segmented control
		if (viewOutsideRecsSelected && this.historyComp.getExternalDataInd()) {
			segmentedControl = this.historyComp.createSegmentedControl(this.historyComp.HistoryComponentIndexObj.PROBLEMS);
			segmentedControlHTML = "<div class='chx-seg-control-container'>" + segmentedControl.render() + "</div>";
		}

		//create the MPaqeUI table
		var prbTableUI = new MPageUI.Table();
		prbTableUI.setOptions({
			namespace : "chx-main-prb-table",
			rows : {
				striped : true
			},
			columns : {
				separators : false
			},
			sortable : true,
			select : MPageUI.TABLE_OPTIONS.SELECT.SINGLE_ROW
		}); 

		//store a reference to new table
		this.prbTableUI = prbTableUI;

		this.createProblemsTableColumns();
		this.createProblemsTableGroups(chronicProblems, historicalProblems, patientRequestRows);

		prbTableUI.setOnRowClickCallback(function(data) {
			var rowSelectionArr = this.getSelection();
			//reset rows that may have been selected in another table
			self.highlightSelectedRow(false);
			//display in side panel if row newly selected
			if (rowSelectionArr.length === 1) {
				self.renderPanelDetails(rowSelectionArr[0]);
			}
			else {
				self.sidePanel.m_cornerCloseButton.click();
			}
		}); 


		if (displayHiDataInd || (this.historyComp.getExternalDataInd() && !patientEnteredDataFilter)) {
			hiDatalabel = this.createHIAddDataControl();
			tablePanelHTML = nkpMsgContainerHTML;
			if (displayHiDataInd) {
				tablePanelHTML += segmentedControlHTML + "<div id='chx-hi-ext-label-outer" + this.compId + "'" + " class='chx-hi-ext-div'></div>";
			}
			else {
				tablePanelHTML += hiDatalabel;
			}

			tablePanelHTML += "<div id ='chxProb";
			tablePanelHTML += this.compId;
			tablePanelHTML += "sidePanelContainer' class='chx-prob-side-panel'>&nbsp;</div>";
			tablePanelHTML += probTabContainer + prbTableUI.render() + "</div>";
		}
		else {

			tablePanelHTML = nkpMsgContainerHTML;

			if (this.historyComp.m_mfaBanner) {
				tablePanelHTML += this.historyComp.m_mfaBanner.render();
			}

			tablePanelHTML += segmentedControlHTML;
			tablePanelHTML += "<div id ='chxProb";
			tablePanelHTML += this.compId;
			tablePanelHTML += "sidePanelContainer' class='chx-prob-side-panel'>&nbsp;</div>";
			tablePanelHTML += probTabContainer + prbTableUI.render() + "</div>";
		}

		this.historyComp.loadTabData(problemCnt, tablePanelHTML, this.historyComp.HistoryComponentIndexObj.PROBLEMS, function(){
			/*
			 * Begin tab post processing. This is triggered in the HistoriesComponent.prototype.renderTabDetails function
			 * and is responsible for attaching events once the tab has been rendered
			 */
			if(segmentedControl) {
				segmentedControl.clearElementCache();
				segmentedControl.attachEvents();
			}
		}, patientRequestRows.length);
		
		var problemsTab = historiesTabsArray[this.historyComp.HistoryComponentIndexObj.PROBLEMS];
		problemsTab.hasIndicator = false;
		this.historyComp.renderTabDetails(problemsTab);
		problemsTab.count = problemCnt;
		if(patientRequestRows.length > 0 && viewOutsideRecsSelected){
			problemsTab.hasIndicator = true;
    		this.historyComp.updateTabIndicator(problemsTab, "<span class='chx-pat-req-icon'></span>"); 
    		problemsTab.count = problemCnt + patientRequestRows.length;
   		}
   		this.historyComp.updateTabCount();

		// Build NKP Banner if conditions satisfy
		if (this.checkShowNKPBanner(nkpPrivsObj, conditions)) {
			this.renderNKPBanner();
		}
		this.bindNKPEvents();

		//grab the values needed to determine max height of table
		var vpHeightAvailable = parseInt($("#vwpBody").height(), 10);
		var tabContainerOffsetTop = parseInt($("#tabContainer" + this.compId).offset().top, 10);
		var probTabContentOffsetTop = parseInt($("#probTabContent" + this.compId).offset().top, 10);

		if (vpHeightAvailable && tabContainerOffsetTop && probTabContentOffsetTop) {
			//calculate space used by tabs and segmented control if present to determine max height available
			vpHeightAvailable = vpHeightAvailable - (probTabContentOffsetTop - tabContainerOffsetTop);
			//adjust for header and padding
			vpHeightAvailable -= 60;
		}
		else {
			vpHeightAvailable = $(prbTableUI.getRootElement()).height();
		}

		prbTableUI.setMaxHeight(vpHeightAvailable);

		prbTableUI.attachEvents();

		this.tableObj = prbTableUI.getRootElement();

		//Initialize the problems search box
		this.initializeSearchBox(conditions.getICD10CodeValuesFromMeta());

		//Initialize the side panel
		this.initializeSidePanel();

		//show the HI table if selected on segmented control
		if (displayHiDataInd && viewOutsideRecsSelected) {
			this.historyComp.showHIData();
		}
		//init the PED related events
		this.initializePEDEvents();

	};

	/**
	 * Creates the table groups for the problems table
	 * @param {Array} chronicProblems - The collection of chronic problems records.
	 * @param {Array} historicalProblems - The collection of historical problems records.
	 * @param {Array} patientRequestRows - The collection of patient request records.
	 * @returns {undefined} Returns nothing
	 */
	ChronicProblemsTab.prototype.createProblemsTableGroups = function(chronicProblems, historicalProblems, patientRequestRows) {
		var prbBaseGroupArray = [{
			label : this.chxi18n.CHRONIC_PROBLEMS,
			css : "secondary-group",
			collapsible : true,
			showCount : true,
			records : chronicProblems
		}, {
			label : this.chxi18n.RESOLVED_PROBLEMS,
			css : "secondary-group",
			collapsible : true,
			expanded : false,
			showCount : true,
			records : historicalProblems
		}];

		if (this.shouldLoadPatientRequests()) {
			this.prbTableUI.setData({
				groups : [{
					showCount : true,
					collapsible : false,
					label : this.chxi18n.PATIENT_REQUESTS,
					records : patientRequestRows
				}, {
					collapsible : false,
					label : this.chxi18n.OTHER_CHART_PROBLEMS,
					groups : prbBaseGroupArray
				}]
			});
		}
		else {
			this.prbTableUI.setData({
				groups : prbBaseGroupArray
			});
		}
	}; 

	/**
	 * Create problems MPageUI table columns.
	 * @returns {undefined} Returns nothing
	 */
	ChronicProblemsTab.prototype.createProblemsTableColumns = function() {
		var tableColumns = [{
			id : "prbdisplay",
			label : this.chxi18n.NAME,
			css : "chx-prb-name",
			contents : function(record) {
				return record.DISPLAY_NAME;
			},
			sortOptions : {
				primary : {
					field : "DISPLAY_NAME",
					direction : MPageUI.TABLE_OPTIONS.SORT.ASCENDING
				}
			}
		}, {
			id : "commInd",
			css : "chx-prb-comm-ind",
			contents : function(record) {
				return record.getCommentsIndRenderTemplate();
			}

		}, {
			id : "prbclass",
			label : this.chxi18n.CLASSIFICATION,
			css : "chx-prb-class",
			contents : function(record) {
				return record.CLASS_DISPLAY;
			},
			sortOptions : {
				primary : {
					field : "CLASS_DISPLAY",
					direction : MPageUI.TABLE_OPTIONS.SORT.ASCENDING
				}
			}
		}];

		//add the request column to the front of the table columns array
		if (this.shouldLoadPatientRequests()) {
			var requestCol = {
				id : "prbrequest",
				label : this.chxi18n.REQUEST,
				css : "chx-prb-request",
				contents : function(record) {
					return record.getRequestRenderTemplate();
				},
				sortOptions : {
					primary : {
						field : "REQUEST_TEXT",
						direction : MPageUI.TABLE_OPTIONS.SORT.ASCENDING
					},
					secondary : [{
						field : "DISPLAY_NAME",
						direction : MPageUI.TABLE_OPTIONS.SORT.ASCENDING
					}]
				}
			};

			tableColumns.unshift(requestCol);
		}

		this.prbTableUI.setColumns(tableColumns);
		//sorting needs to be set after table columns
		if (this.shouldLoadPatientRequests()) {
			this.prbTableUI.sortBy({
				column : {
					id : "prbrequest",
					direction : MPageUI.TABLE_OPTIONS.SORT.ASCENDING
				}
			});
		}
		else {
			this.prbTableUI.sortBy({
				column : {
					id : "prbdisplay",
					direction : MPageUI.TABLE_OPTIONS.SORT.ASCENDING
				}
			});

		}
	}; 

	/**
	 * Add delegate to handle tab linking from side panel
	 * @returns undefined
	 */
	ChronicProblemsTab.prototype.initializePEDEvents = function() {
		var self = this;
		var inMillenniumContextInd = CERN_Platform.inMillenniumContext();
		var compSecContentId = this.historyComp.getSectionContentNode().id;
		var problemsLink = this.historyComp.getProblemsLink();
		var mainHeaderLink = this.historyComp.getLink();
		if (inMillenniumContextInd && (problemsLink || mainHeaderLink)) {
			$("#" + compSecContentId).find(".chx-problems").on("click", ".chx-problems-sp-link", function() {
				self.openProblemsTab();
			});
		}

		var sidePanel = this.sidePanel;
		var sidePanelContainer = sidePanel.m_sidePanelContents;
		// Toggle the Expand/Collapse icon within the Outside Request section
		sidePanelContainer.on('click', '.chx-side-panel-tgl', function() {
			var patReqSubSection = sidePanelContainer.find('.chx-expand-content');
			if (patReqSubSection.hasClass('chx-section-closed')) {
				$(this).removeClass('chx-show-expand-btn')
					.addClass('chx-hide-expand-btn');
				patReqSubSection.removeClass('chx-section-closed');
			}
			else {
				$(this).removeClass('chx-hide-expand-btn')
					.addClass('chx-show-expand-btn');
				patReqSubSection.addClass('chx-section-closed');
			}
		});
	};

	/**
	 * Open PowerChart problems tab defined in bedrock
	 * @returns undefined
	 */
	ChronicProblemsTab.prototype.openProblemsTab = function() {
		var criterion = this.historyComp.getCriterion();
		var problemsTabLink = this.historyComp.getProblemsLink() ? this.historyComp.getProblemsLink() : this.historyComp.getLink();
		var sParms = "/PERSONID=" + criterion.person_id + " /ENCNTRID=" + criterion.encntr_id + " /FIRSTTAB=^" + problemsTabLink + "^";
		APPLINK(0, criterion.executable, sParms);
	};


	/**
	 * initializeSearchBox: This function will find the problems search box and set it up
	 */
	ChronicProblemsTab.prototype.initializeSearchBox = function(icd10CodeValues) {
		try {
			var searchBoxObj = $("#chxProbSearchContainer" + this.compId);
			var probSearchBox = null;
			var self = this;

			// Create nomenclature search bar
			if (searchBoxObj.length) {
				probSearchBox = new MPageControls.NomenclatureSearch(searchBoxObj);
			}

			// Set caption for the nomenclature search, do this before disabling the search so that the search bar has a caption
			probSearchBox.setCaption(this.chxi18n.ADD_PROBLEM);
			probSearchBox.setICD10CodeValues(icd10CodeValues);
			probSearchBox.activateCaption();

			// Get the text input for searching
			var probSearchInputElement = searchBoxObj.find('input');

			// Get the search vocab preferemces
			var targetVocab = this.historyComp.getProbTargetVocab();
			var searchVocab = this.historyComp.getProbSearchVocab();
			var validSearchFlags = [1, 2, 3, 4, 5, 6, 7];

			//disable the search box if in browser
			if (!this.inMillenniumContext) {
				probSearchBox.disable();
				return;
			}

			//disable the search box if no privs
			if (!this.canModifyChronic) {
				probSearchBox.disable();
				logger.logWarning("The current user has insufficient privs for modifying chronic problems.");
				return;
			}

			if (!searchVocab) {
				probSearchBox.disable();
				logger.logWarning("The search vocabulary is not set to a valid value in bedrock for the chronic problems histories tab.");
				return;
			}

			if (searchVocab && targetVocab) {
				var searchVocabCv = new MPageEntity.CodeValue();
				searchVocabCv.setId(searchVocab);
				probSearchBox.setSourceVocabCodeValue(searchVocabCv);
			}
			else {
				//if searchVocab or targetVocab are undefined, disable the search box
				probSearchBox.disable();
				logger.logWarning("The target vocabulary or search vocabulary are not properly set in bedrock for the chronic problems histories tab.");
				return;
			}

			// Event handler when item from the problems suggestions is selected
			probSearchBox.getList().setOnSelect(function(nomen) {
				// Clear contents of the search input and revert to the caption
				probSearchBox.activateCaption();
				probSearchBox.close();
				self.handleSelectedProblem(nomen.getId());
			});

		} catch (err) {
			logger.logJSError(err, this.historyComp, "consolidate-chronicproblems.js", "initializeSearchBox");
		}

	};

	/**
	 * The handleSelectedProblem will add a new row from the selected problem in the add bar.
	 * @param nomenclatureID {float} The nomenclature ID of selected problem
	 * @returns none
	 */
	ChronicProblemsTab.prototype.handleSelectedProblem = function(nomenclatureID) {
		var actionTimer = new RTMSTimer("USR:MPG.CONSOLIDATED_HISTORY - chronic problem action", this.historyComp.criterion.category_mean);
		MP_Util.LoadSpinner("chxContent" + this.compId);

		try {
			var cond = new MPageEntity.entities.Condition();
			var criterion = this.historyComp.getCriterion();
			var encntr = criterion.encntr_id;
			var prsn = criterion.person_id;
			var targetVocab = this.historyComp.getProbTargetVocab();
			var searchVocab = this.historyComp.getProbSearchVocab();
			var conf = this.historyComp.getProbTargetConf() ? this.historyComp.getProbTargetConf() : null;
			var medicalCVObj = MP_Util.GetCodeValueByMeaning("MEDICAL", 12033);
			var self = this;

			//setup bedrockConfig if it doesn't already exist
			if (!this.bedrockConfig) {
				this.bedrockConfig = new MPageEntity.BedrockConfig();
				this.bedrockConfig.setDefaultSearchVocab(searchVocab);
				this.bedrockConfig.setChronicVocab(targetVocab);
				this.bedrockConfig.setProblemClassification(medicalCVObj.codeValue);
				if (conf) {
					this.bedrockConfig.setProblemConfirmation(conf);
				}
			}


			//start timer send in "Add" metadata
			actionTimer.addMetaData("rtms.legacy.metadata.1", "Add");
			actionTimer.start();

			cond.setIsChronic(true);
			cond.setClassificationValue(medicalCVObj.codeValue);
			cond.setNomenclatureValue(nomenclatureID);
			cond.setEncounterValue(encntr);
			cond.setPersonValue(prsn);
			if (conf) {
				cond.setConfirmationStatusValue(conf);
			}
			cond.getCrossMapping(this.bedrockConfig);

			cond.create(function(responseObj, reply, error) {
				//if error, throw message in window
				if (error) {
					actionTimer.fail();
					//remove spinner
					$("#chxContent" + self.compId).find('.loading-screen').remove();
					self.showErrorModal(1);
					return;
				}

				var replyJSON = JSON.parse(reply);

				if (replyJSON.RECORD_DATA.META.ERRORCD == 1) { //This comes back as a string, so we don't want === here
					actionTimer.fail();
					//remove spinner
					$("#chxContent" + self.compId).find('.loading-screen').remove();
					self.showErrorModal(2);
					return;
				}

				if (replyJSON.RECORD_DATA.META.STATUS === "success") {
					$("#chxContent" + self.compId).find('.loading-screen').remove();
					actionTimer.stop();
					self.renderComponent();
				}
			});
		} catch (err) {
			//fail timer
			actionTimer.fail();
			//remove spinner
			$("#chxContent" + this.compId).find('.loading-screen').remove();

			this.showErrorModal(0);
		} finally {
			//stop timer
			actionTimer.stop();
		}
	};

	/**
	 * This function will be called if some error occurred while trying to add a new problem to the component.
	 * It will display a modal dialog box
	 * @param errorType {number} Used to flag which type of error it is. 0 is unknown add error, 1 is privilege error, 2 is duplicate add error
	 */
	ChronicProblemsTab.prototype.showErrorModal = function(errorType) {
		var modalBodyHTML = "";

		if (!errorType) {
			modalBodyHTML = "<div class='chx-modal-container'><div class='error-icon-component'><span class='error-text'>" + this.chxi18n.ERROR_ADD_PROB_BODY + "</span> " + i18n.CONTACT_ADMINISTRATOR + "</div></div>";
		}
		else if (errorType === 1) {
			modalBodyHTML = "<div class='chx-modal-container'><div class='error-icon-component'><span class='error-text'>" + this.chxi18n.ERROR_ADD_PROB_PRIV + "</span></div></div>";
		}
		else if (errorType === 2) {
			modalBodyHTML = "<div class='chx-modal-container'><div class='information-container'>" + this.chxi18n.ERROR_ADD_DUP_BODY_ACTION + " " + this.chxi18n.ERROR_ADD_DUP_BODY_NOT_ADDED + "</div></div>";
		}

		var modalObjExists = MP_ModalDialog.retrieveModalDialogObject("addProblemErrorModal"); //will actually be the modal object if it exists, else null
		var addProblemErrorModalObj = modalObjExists ? modalObjExists : new ModalDialog("addProblemErrorModal");

		if (!modalObjExists) {
			var okCloseErrorBtn = new ModalButton("okCloseErrorBtn");

			okCloseErrorBtn.setText(i18n.discernabu.CONFIRM_OK);
			okCloseErrorBtn.setFocusInd(true);
			okCloseErrorBtn.setCloseOnClick(true);

			addProblemErrorModalObj.setTopMarginPercentage(25).setRightMarginPercentage(30).setBottomMarginPercentage(25).setLeftMarginPercentage(30).setIsBodySizeFixed(false);
			if (errorType === 2) {
				addProblemErrorModalObj.setHeaderTitle(this.chxi18n.ERROR_ADD_DUP_TITLE);
			}
			else {
				addProblemErrorModalObj.setHeaderTitle(this.chxi18n.ERROR_ADD_PROB_TITLE);
			}
			addProblemErrorModalObj.addFooterButton(okCloseErrorBtn);
			addProblemErrorModalObj.setShowCloseIcon(true);

			MP_ModalDialog.addModalDialogObject(addProblemErrorModalObj);
			MP_ModalDialog.showModalDialog("addProblemErrorModal");

			addProblemErrorModalObj.setBodyHTML(modalBodyHTML);
		}
		else {
			MP_ModalDialog.showModalDialog("addProblemErrorModal");

			if (errorType === 2) {
				addProblemErrorModalObj.setHeaderTitle(this.chxi18n.ERROR_ADD_DUP_TITLE);
			}
			else {
				addProblemErrorModalObj.setHeaderTitle(this.chxi18n.ERROR_ADD_PROB_TITLE);
			}
			addProblemErrorModalObj.setBodyHTML(modalBodyHTML);
		}
	};

	/**
	 * initializeSidePanel: This function will create a new side panel object
	 */
	ChronicProblemsTab.prototype.initializeSidePanel = function() {
		var sidePanelContId = "chxProb" + this.compId + "sidePanelContainer";
		this.sidePanelContainer = $("#" + sidePanelContId);
		var tableHeight = null;
		var self = this;

		if (this.tableObj && this.tableObj.length) {
			//get current height of table
			tableHeight = this.tableObj.css("height");
		}
		else {
			//if table not found, there is an issue, but set to min height
			tableHeight = this.sidePanelMinHeight;
		}

		//Create the side panel
		if (this.sidePanelContainer.length) {

			// Render the side panel
			this.sidePanel = new CompSidePanel(this.compId, sidePanelContId);
			this.sidePanel.setExpandOption(this.sidePanel.expandOption.EXPAND_DOWN);
			this.sidePanel.setHeight(tableHeight);
			this.sidePanel.setMinHeight(this.sidePanelMinHeight);
			this.sidePanel.renderPreBuiltSidePanel();
			this.sidePanel.setContents("<div></div>", "chxProb" + this.compId + "table");
			this.sidePanel.showCornerCloseButton();

			// set the function that will be called when the close button on the side panel is clicked
			this.sidePanel.setCornerCloseFunction(function() {
				$("#probTabContent" + self.compId).removeClass("chx-prob-table-with-panel");
				$("#hiDataConsProbHist" + self.compId + "table").removeClass("chx-hi-hide-mode");

				self.panelShowing = false;
				self.highlightSelectedRow(false);
				self.previousClickedRow = "";
			});

			this.sidePanel.setOnExpandFunction(function() {
				$('#chxProb' + self.compId + 'sidePanelContainer').attr("style", "").addClass("chx-prob-side-panel-rel");
			});
		}

	};

	/**
	 * onRowClick: This function will handle triggering actions based on the selected table row
	 * @param event {Event} The event that triggered the onRowClick
	 * @param data {ChronicProblemsRow} The data object from the clicked row
	 */
	ChronicProblemsTab.prototype.onRowClick = function(event, data) {
		var selRow = $(event.target).parents("dl.result-info");
		var panelId = "chxProb" + this.compId + "sidePanelContainer";

		if (!selRow.length || (data.RESULT_DATA.condition === null && !(data.RESULT_DATA instanceof PatientRequestRow)) || data.RESULT_DATA.isNKPRow) {
			return;
		}
		
		//clear selections from main table
		this.prbTableUI.deselectAll();

		//If clicked again on this.previousClickedRow, close panel
		if (selRow[0].id === this.previousClickedRow) {
			this.sidePanel.m_cornerCloseButton.click();
			return;
		}

		//Set the new row to this.previousClickedRow
		this.previousClickedRow = selRow[0].id;


		this.renderPanelDetails(data.RESULT_DATA);
		this.highlightSelectedRow(selRow);
	};

	/**
	 * highlightSelectedRow: This function will highlight the newly selected row and unhighlight any
	 * previously selected row
	 * @param selRowObj {Object} The current selected row object
	 */
	ChronicProblemsTab.prototype.highlightSelectedRow = function(selRowObj) {
		//find any previously selected row
		if (this.hiTableObj && (this.hiTableObj.find(".selected"))) {
			this.hiTableObj.find(".selected").removeClass("chx-prob-selected-row selected");
		}

		if (selRowObj) {
			//change the background color to indicate that the row is selected
			selRowObj.addClass("chx-prob-selected-row selected");
		}
	};

	/**
	 * renderPanelDetails: This function will build a side panel based on the selected condition
	 * @param selRowObj {ChronicProblemsRow} The current selected row object
	 */
	ChronicProblemsTab.prototype.renderPanelDetails = function(selRowObj) {
		var tableHeight = null;
		var onsetDate = null;
		var conditionType = null;
		var status = null;
		var classification = null;
		var confirmation = null;
		var condition = selRowObj.condition;
		var sidePanelHTML = "";
		//if the side panel is not showing, then adjust the display
		if (!this.panelShowing) {
			//shrink the table and show the panel
			if (this.hiTableObj) {
				tableHeight = this.hiTableObj.css("height");
				this.hiTableObj.addClass("chx-hi-hide-mode");
			}
			else {
				tableHeight = this.tableObj.css("height");
			}
			//get the latest height of table

			$("#probTabContent" + this.compId).addClass("chx-prob-table-with-panel");

			//set the panel to the shrunk table height
			this.sidePanel.setHeight(tableHeight);
			//call the side panels resize function
			this.sidePanel.resizePanel();
			this.sidePanelContainer.removeClass("chx-prob-side-panel");
			this.sidePanelContainer.addClass("chx-prob-side-panel-init");
			this.panelShowing = true;
			this.sidePanel.showPanel();
		}

		if (selRowObj.most_recent_condition) {
			this.sidePanel.setTitleText(selRowObj.name);

			var label = "<p id = 'externalDataLabel' class='secondary-text';>";
			label += "<span class='chx-ext-data-indicator'></span>";
			label += "<span style='margin-left:5px text-align:left;padding-left: 7px;'>";
			label += this.chxi18n.HI_BTN_LBL_UPON_CLICK + "</span></p>";
			label += "<div class='chx-sp-date-container'>";
			label += selRowObj.most_recent_condition.source["partition_description"];
			label += " (" + selRowObj.most_recent_condition.source["type"] + ")";
			label += "</div><div class='sp-separator2'>&nbsp;</div>";

			var sidePanelHtml = label;
			sidePanelHtml += "</div><div><div class='chx-hi-sp-date-provider' id='probSPDateContainer";
			sidePanelHtml += this.historyComp.getComponentId();
			sidePanelHtml += "'><dd class='secondary-text'>";
			sidePanelHtml += this.chxi18n.CONDITION_TYPE;
			sidePanelHtml += "</dd><dd class='chx-read-only-date'>";
			sidePanelHtml += selRowObj.most_recent_condition.type;
			sidePanelHtml += "</dd></div><div class='sp-separator2'>&nbsp;</div>";
			sidePanelHtml += "<div><div class='chx-hi-sp-date-provider'>";
			sidePanelHtml += "<dd class='secondary-text'>";
			sidePanelHtml += this.chxi18n.EFFECTIVE_DATE;
			sidePanelHtml += "</dd><dd class='chx-read-only-date'>";
			sidePanelHtml += selRowObj.EFFECT_UTC;
			sidePanelHtml += "</dd></div><div class='chx-hi-sp-date-provider'>";
			sidePanelHtml += "<dd class='secondary-text'>";
			sidePanelHtml += this.chxi18n.STATUS;
			sidePanelHtml += "</dd><dd class='chx-read-only-date'>";
			sidePanelHtml += selRowObj.most_recent_condition.status;
			sidePanelHtml += "</dd></li></ul>" + "</div></div></div>";

			this.sidePanel.setContents(sidePanelHtml, "hiDataConsProbHist" + this.compId + "table");
			this.sidePanel.showPanel();

			if ($("#chxProb" + this.compId + "btnHolder")) {
				$("#chxProb" + this.compId + "btnHolder").css("visibility", "hidden");
			}

			return;
		}
		else {
			selRowObj.updateSidePanel(this.sidePanel);
		}
	};


	/**
	 * Add click event to toggle outside requests section
	 * @returns undefined
	 */
	ChronicProblemsTab.prototype.enableOutsideReqToggle = function() {
		var sidePanelContainer = $("#sidePanel" + this.compId);
		sidePanelContainer.on("click", ".chx-side-panel-tgl", function() {
			var patReqSubSection = sidePanelContainer.find(".chx-expand-content");
			$(this).toggleClass("chx-show-expand-btn chx-hide-expand-btn");
			patReqSubSection.toggleClass("chx-section-closed");
		});
	};

	/**
	 * determineAvailableButtons: This function will determine which buttons should be hidden based on the
	 * condition selected, environment, and privileges
	 * @param condition {Entity.condition} The current selected condition
	 */
	ChronicProblemsTab.prototype.determineAvailableButtons = function(condition) {
		//disable/enable buttons based on privs for person and condition
		var btnHolder = $("#chxProb" + this.compId + "btnHolder");
		var cancelBtn = $("#chxProb" + this.compId + "cancelBtn");
		var resolveBtn = $("#chxProb" + this.compId + "resolveBtn");
		var modifyBtn = $("#chxProb" + this.compId + "modifyBtn");
		var diags = condition.getDiagnoses();
		var probs = condition.getProblems();
		var nomenId = parseInt(condition.getNomenclatureValue(), 10);
		var isResolved = this.canModifyChronic && condition.isResolved();


		//if no privs to modify chronic problems, hide all buttons
		if (!this.canModifyChronic) {
			btnHolder.css("visibility", "hidden");
			return;
		}

		//check modify priv for driver problem, if its a no, then hide the buttons
		try {
			if (!(probs.length && probs.filter("id", condition.getProblemDriverValue())[0].getCanCondModify())) {
				btnHolder.css("visibility", "hidden");
				return;
			}
		} catch (err) {
			logger.logJSError(err, this.historyComp, "consolidate-chronicproblems.js", "determineAvailableButtons");
		}

		//if in browser, hide all buttons
		if (!this.inMillenniumContext) {
			btnHolder.css("visibility", "hidden");
			return;
		}
		//disable resolve and cancel buttons if its a free text condition (nomenId = 0)
		if (!nomenId) {
			resolveBtn.addClass("hidden");
			cancelBtn.addClass("hidden");
			return;
		}

		//if problem is already resolved, hide resolve button
		if (isResolved) {
			resolveBtn.addClass("hidden");
		}
	};

	/**
	 * bindButtonEvents: This function will bind the click events to the cancel and resolve buttons
	 * @param condition {Entity.condition} The current selected condition
	 */
	ChronicProblemsTab.prototype.bindButtonEvents = function(condition) {
		//bind button events
		var resolveBtn = $("#chxProb" + this.compId + "resolveBtn");
		var cancelBtn = $("#chxProb" + this.compId + "cancelBtn");
		var modifyBtn = $("#chxProb" + this.compId + "modifyBtn");

		var actionTimer = new RTMSTimer("USR:MPG.CONSOLIDATED_HISTORY - chronic problem action", this.historyComp.criterion.category_mean);
		var self = this;

		resolveBtn.on("click", function(event) {
			try {
				MP_Util.LoadSpinner("chxContent" + this.compId);
				//start timer
				actionTimer.addMetaData("rtms.legacy.metadata.1", "Resolve");
				actionTimer.start();
				condition.moveToHistorical(function(responseObj, reply, error) {
					if (error) {
						showPanelError(0);
						return;
					}
					var replyJSON = JSON.parse(reply);
					if (replyJSON.RECORD_DATA.META.STATUS === "success") {
						actionTimer.stop();
						self.renderComponent();
					}
				});
			} catch (err) {
				showPanelError(0);
				//remove spinner
				$("#chxContent" + self.compId).find('.loading-screen').remove();
			} finally {
				//stop timer
				if (actionTimer) {
					actionTimer.stop();
				}
			}
		});

		cancelBtn.on("click", function(event) {
			try {
				MP_Util.LoadSpinner("chxContent" + this.compId);
				//start timer
				actionTimer.addMetaData("rtms.legacy.metadata.1", "Cancel");
				actionTimer.start();
				condition.cancel(function(responseObj, reply, error) {
					if (error) {
						showPanelError(1);
						return;
					}
					var replyJSON = JSON.parse(reply);
					if (replyJSON.RECORD_DATA.META.STATUS === "success") {
						actionTimer.stop();
						self.renderComponent();
					}
				});
			} catch (err) {
				showPanelError(1);
				//remove spinner
				$("#chxContent" + self.compId).find('.loading-screen').remove();
			} finally {
				//stop timer
				if (actionTimer) {
					actionTimer.stop();
				}
			}
		});

		modifyBtn.on("click", function(event) {
			MPageEntity.Win32ConditionModifier(condition, function() {
				self.renderComponent();
				self.sharedCondResource.retrieveSharedResourceData();
			}, "Histories", true);

		});

		/**
		 * This function will show the error banner in the side panel based on which button was clicked
		 * @param buttonClicked {number} The button clicked: 0 is resolve button, 1 is cancel button
		 */
		showPanelError = function(buttonClicked) {
			var errorMsg = "";
			if (buttonClicked === 0) {
				errorMsg = self.chxi18n.ERROR_MSG_RESOLVE;
			}
			else if (buttonClicked === 1) {
				errorMsg = self.chxi18n.ERROR_MSG_CANCEL;
			}

			$("#chxProb" + self.compId + "errorMsgText").html(errorMsg);
			$("#chxProb" + self.compId + "errorMsgBanner").css("display", "inline-block");
			actionTimer.fail();
		};
	};

	/**
	 * This function resizes the panel and adjusts the table headers if a scroll bar is present. It
	 * will be called when the consolidated history framework's resize function is called.
	 */
	ChronicProblemsTab.prototype.resizeComponent = function() {
		if (this.panelShowing && this.sidePanel) {
			var tableHeight = null;

			//at this point I have to get a new version of the table object in case its height has changed
			var probsTable = this.tableObj;

			if (probsTable) {
				tableHeight = probsTable.css("height");
			}

			this.sidePanel.setHeight(tableHeight);

			//call the side panels resize function
			this.sidePanel.resizePanel();
		}
	};
})();
