//Begin Procedure History with Surginet Procedure
var CERN_PROCEDURE_CONSOLIDATED = function() {
	var proc3I18n = i18n.discernabu.consolidated_history;
	var datePrecisionCodes = null;
	var contributorPowerChartCd = 0;

	function sortProcedure(procArr) {
		procArr.sort(sortByDtTm);
	}

	function sortByDtTm(a, b) {
		if (a.ONSET_UTC > b.ONSET_UTC) {
			return -1;
		}
		else if (a.ONSET_UTC < b.ONSET_UTC) {
			return 1;
		}

		//mt4217: changed from NAME to DISPLAY_AS
		if (a.DISPLAY_AS.toUpperCase() > b.DISPLAY_AS.toUpperCase()) {
			return 1;
		}
		if (a.DISPLAY_AS.toUpperCase() < b.DISPLAY_AS.toUpperCase()) {
			return -1;
		}
		return 0;
	}

	/**
	 * hoverString: This function will generate HTML hover string for a given procedure, onset Date and list of comments.
	 * @param procItem {number} procedure object.
	 * @param onsetDate {array} onsetDate for the procedure object
	 * @param commentString {string} comments HTML string
	 * @return sHov {string} HTML string
	 */

	function hoverString(procItem, onsetDateHvr, commentString) {
		var sHovArr = [];
		sHovArr.push("<div class='result-details'><h4 class='det-hd'><span>", proc3I18n.PROCEDURE_DETAILS, "</span></h4><dl class='chx-det'>");
		var hov_Comment = commentString ? commentString : '--';
		if (procItem.SURG_PROC_IND === 0)//Procedure history
		{
			var hov_status = procItem.STATUS ? procItem.STATUS : '--';
			var hov_location = procItem.LOCATION ? procItem.LOCATION : '--';
			sHovArr.push("<dt class='chx-det-name'><span>", proc3I18n.STATUS, ":</span></dt>", "<dd class='chx-det-name'>", hov_status, "</dd>", "<dt class='chx-det-name'><span>", proc3I18n.LOCATION, ":</span></dt>", "<dd class='chx-det-name'>", hov_location, "</dd>");
			sHovArr.push("<dt class='chx-det-name'><span>", proc3I18n.COMMENTS, ":</span></dt>", "<dd class='chx-det-name'>", hov_Comment, "</dd>");
		}
		else//surginet procedure
		{
			var hovAnesthesiaType = procItem.ANETHESIA_TYPE ? procItem.ANETHESIA_TYPE : '--';
			var hovCaseNum = procItem.SURG_CASE_NBR_FORMATTED ? procItem.SURG_CASE_NBR_FORMATTED : '--';
			sHovArr.push("<dt class='chx-det-name'><span>", proc3I18n.ANESTH_TYPE, ":</span></dt>", "<dd class='chx-det-name'>", hovAnesthesiaType, "</dd>", "<dt class='chx-det-name'><span>", proc3I18n.CASE_NUM, ":</span></dt>", "<dd class='chx-det-name'>", hovCaseNum, "</dd>");
			sHovArr.push("<dt class='chx-det-name'><span>", proc3I18n.IMPLANTS, ":</span></dt><dd class='chx-det-name'>");
			var implantString = "--";
			var implantLen = procItem.IMPLANT ? procItem.IMPLANT.length : 0;

			//display the implants only
			for (var k = 0; k < implantLen; k++) {
				if (k === 0) {
					implantString = procItem.IMPLANT[k].DESC;
				}
				else//more than 1 implants, add ";" between to display
				{
					implantString = implantString + ";&nbsp;" + procItem.IMPLANT[k].DESC;
				}
			}
			sHovArr.push(implantString, "</dd>");
			sHovArr.push("<dt class='chx-det-name'><span>", proc3I18n.COMMENTS, ":</span></dt>", "<dd class='chx-det-name'>", hov_Comment, "</dd>");
		}//end detail hvr surginet procedure
		sHovArr.push("</dl></div>");
		return sHovArr.join("");
	}

	/**
	 * sort Secondary Procedures by alphabetical order only.
	 * @param  {object} component the object for the histories component instance
	 * @return {undefined}
	 */
	function sortSecondaryProcedures(component) {
		component.proc3SecondaryArr.sort(sortByProcName);
	}

	/**
	 sortByProcName: This function will sort Secondary Procedures by ascending only.
	 */
	function sortByProcName(a, b) {//sort by name(display_as) ascending only
		if (a.DISPLAY_AS.toUpperCase() > b.DISPLAY_AS.toUpperCase()) {
			return 1;
		}
		if (a.DISPLAY_AS.toUpperCase() < b.DISPLAY_AS.toUpperCase()) {
			return -1;
		}
		return 0;
	}

	/**
	 * sort procedures by patient request in ascending order
	 * @param  {object} proc1 procedure object
	 * @param  {object} proc2 procedure object
	 * @return {number} integer indicating sorting order
	 */
	function sortProceduresByPatientRequest(proc1, proc2) {
		return proc1.PAT_REQUEST_TYPE_DISPLAY.localeCompare(proc2.PAT_REQUEST_TYPE_DISPLAY);
	}

	/**
	 * get the display text for a patient request type
	 * @param  {object} patReqObject a procedure object with interop data
	 * @param {object} component histories component object
	 * @return {Undefined}
	 */
	function setProcPatientRequestDisplay(patReqObject, component) {
		patReqObject.PAT_REQUEST_TYPE = CERN_PROCEDURE_CONSOLIDATED.getProcPatientRequestType(patReqObject, component);
		switch (patReqObject.PAT_REQUEST_TYPE) {
			case 'ADD':
				patReqObject.PAT_REQUEST_TYPE_DISPLAY = proc3I18n.ADD;
				break;
			case 'UPDATE':
				patReqObject.PAT_REQUEST_TYPE_DISPLAY = proc3I18n.MODIFY;
				break;
			case 'REMOVE':
				patReqObject.PAT_REQUEST_TYPE_DISPLAY = proc3I18n.REMOVE;
				break;
		}
	}

	/**
	 *  The saveProcedure function will read the procedure ID and procedure date, create JSON request and call mp_exec_syd_request which calls acm_procedure service to a add procedure
	 *  This same function is called to add a new procedure history item as well as update details about existing procedure history
	 *  @param {Object} component The Histories component
	 */
	function saveProcedure(component) {
		var compId = component.getComponentId();
		var self = component;
		var procDateFormatted = "";
		var addProcedureTypeTimer = null;
		var addProcedureActionTimer = null;
		var selectedVocabTimer = null;
		var procRawTime = null;
		var procOnsetDateFlag = 0;
		var procDtPrecisionCd = 0;

		// Add a spinner, this will lock down the entire component until it refreshes with the new data
		MP_Util.LoadSpinner("chxContent" + compId);
		try {
			// Trigger the CAP timer for adding a procedure
			addProcedureTypeTimer = new CapabilityTimer("CAP:MPG Procedure History Type", component.criterion.category_mean);
			if (addProcedureTypeTimer) {
				if (component.isfreeTextProcedure) {
					addProcedureTypeTimer.addMetaData("rtms.legacy.metadata.1", "Free Text procedure");
				}
				else {
					addProcedureTypeTimer.addMetaData("rtms.legacy.metadata.1", "Codified procedure");
				}
				addProcedureTypeTimer.capture();
			}

			// Trigger the USR timer for saving a procedure
			addProcedureActionTimer = new RTMSTimer("USR:MPG.PROCEDURE_HISTORY-Procedure_Actionability", component.criterion.category_mean);
			if (addProcedureActionTimer) {
				if (component.m_isProcedureModified) {
					addProcedureActionTimer.addMetaData("rtms.legacy.metadata.1", "Modified procedure"); // For updates made to existing procedure
				}
				else {
					addProcedureActionTimer.addMetaData("rtms.legacy.metadata.1", "Save new procedure"); // For new procedures
				}
				addProcedureActionTimer.start();
			}

			// Populate request items
			var procRequest = new ProcedureRequest();

			// When procedure is added for the first time fire a CAP timer to record vocabulary name when procedures are searched other than default vocabulary
			// The vocabulary selector and procedure search bar is available only when procedures are written for the first time
			if (!component.m_isProcedureModified) {
				// Write new procedures against encounter being viewed
				procRequest.encounter_id = component.criterion.encntr_id;
				var vocabSelect = document.getElementById("chxProcVocabSelect" + compId); // Vocab Selector for adding a new procedure

				//vocabSelect will be null if only one vocab is set to yes in Bedrock
				if (vocabSelect) {
					var vocabIndex = vocabSelect.selectedIndex;
					var vocabularyName = vocabSelect.options[vocabIndex].text;

					// Trigger the CAP timer only when procedures are written against vocabulary other than the default
					// Determine if the option within the vocab menu was changed
					if (vocabIndex > 0) {
						selectedVocabTimer = new CapabilityTimer("CAP:MPG Procedure History Selected Vocabulary", component.criterion.category_mean);
						// Add the name of vocabulary as a metadata
						if (selectedVocabTimer) {
							selectedVocabTimer.addMetaData("rtms.legacy.metadata.1", "Changed Vocabulary:" + vocabularyName + "");
						}
						selectedVocabTimer.capture();
					}
				}

				// Read the selected date and flag from the date control for new procedures are added
				if (component.onsetDtControl) {
					procRawTime = component.onsetDtControl.getSelectedDate();
					procOnsetDateFlag = component.onsetDtControl.getSelectedDateFlag();
					procDtPrecisionCd = component.onsetDtControl.getSelectedDatePrecisionCode();
				}

				// New procedure has no procedure ID
				procRequest.procedure_id = 0.0;

				// Set the free text in the request if a free text procedure is added
				// Free text procedures will have 0 nomenclature ID
				if (component.newProcDetails.NOMENCLATURE_ID === 0) {
					// Read the text from search bar
					procRequest.free_text = component.procedureName;
					procRequest.nomenclature_id = 0.0;
					component.isfreeTextProcedure = true;
				}
				else {
					procRequest.nomenclature_id = component.newProcDetails.NOMENCLATURE_ID;
				}
			}
			else {  // Update existing procedure
				if (component.SPProcDateControl) {
					procRawTime = component.SPProcDateControl.getSelectedDate();
					procOnsetDateFlag = component.SPProcDateControl.getSelectedDateFlag();
					procDtPrecisionCd = component.SPProcDateControl.getSelectedDatePrecisionCode();
				}

				// Grab procedure ID and update count from the procedure details object
				procRequest.procedure_id = component.updatedProcDetails.PROCEDURE_ID;
				procRequest.update_cnt = component.updatedProcDetails.UPDATE_CNT;
				procRequest.encounter_id = component.updatedProcDetails.ENCNTR_ID;

				// Set the free text in the request if a free text procedure is added
				// Free text procedures will have 0 nomenclature ID
				if (component.updatedProcDetails.NOMENCLATURE_ID === 0) {
					// Read the text from search bar
					procRequest.free_text = component.updatedProcDetails.DISPLAY_AS;
					procRequest.nomenclature_id = 0.0;
					component.isfreeTextProcedure = true;
				}
				else {
					procRequest.nomenclature_id = component.updatedProcDetails.NOMENCLATURE_ID;
				}
			}

			procDateFormatted = procRawTime;

			// If user selects a precision but did not enter the date then set code as 0 except for 'Unknown' code
			var cdUnknown = MP_Util.GetCodeByMeaning(component.datePrecisionCodes, "UNKNOWN").codeValue;
			if (procDtPrecisionCd > 0 && !procRawTime && procDtPrecisionCd != cdUnknown) {
				procDtPrecisionCd = 0;
			}

			// Format the date to be dd-mmm-yyyy so that it can be sent in a script used for writing procedures
			if (procDateFormatted) {
				procDateFormatted = procDateFormatted.format("dd-mmm-yyyy");
				procDateFormatted = procDateFormatted.toString().toUpperCase();   //Upper case is required since CCL works only on converting to dq8 if the month is in upper case.
			}

			procRequest.active_ind = 1;

			// Date related field
			procRequest.procedure_date = procDateFormatted;
			procRequest.proc_raw_time = procRawTime;
			procRequest.procedure_date_precision = procOnsetDateFlag;
			procRequest.procedure_date_precision_cd = procDtPrecisionCd;

			// Get the contributor system code for POWERCHART
			retrieveContributorSystemCds(component, function() {
				// Load the sytem codes in a list so that the code value can be looked up
				contributorPowerChartCd = MP_Util.GetCodeByMeaning(component.contributorSystemCodes, 'POWERCHART').codeValue;

				// Build JSON string
				var procJSONStr = buildProcedureStringRequest(procRequest, component);

				// Create request and execute script
				var newProcScriptRequest = new ScriptRequest();
				var criterion = component.getCriterion();
				newProcScriptRequest.setProgramName("mp_add_update_procedures");
				newProcScriptRequest.setDataBlob(procJSONStr);
				newProcScriptRequest.setParameterArray(["^MINE^", "^^", 0, criterion.person_id]);
				newProcScriptRequest.setResponseHandler(function(scriptReply) {
					// Read script status and refresh the procedure content table
					if (scriptReply.getResponse().STATUS_DATA.STATUS == "S") {
						// Set status to procedureSaved
						self.m_isProcedureSaved = true;
						var procedureId = scriptReply.getResponse().PROCEDURES[0].PROCEDURE_ID;

						// Call handleSavedProcedure function to show the procedure added in the table and in side panel
						handleSavedProcedure(self, procedureId);

						// Fire event to all listeners who are listening for adds/updates on procedures
						CERN_EventListener.fireEvent(null, self, "procedureHistoryUpdated", null);
					}
					else {
						// Add container to hold an error message and show message
						var historiesTabContainer = $("#chxContent" + compId).find('.chx-tab-container');
						var errorMessageHTML = "<div id='chxErrorMessage" + compId + "' class='chx-error-message'><div class='error-container inline-message'><span class='error-text message-info-text'>" + proc3I18n.UNABLE_TO_SAVE_PROC + "</span></div></div>";
						historiesTabContainer.prepend(errorMessageHTML);
						// Remove spinner
						$("#chxContent" + compId).find('.loading-screen').remove();
					}
				});
				newProcScriptRequest.performRequest();
			});
		}
		catch (err) {
			if (addProcedureActionTimer) {
				addProcedureActionTimer.fail();
				addProcedureActionTimer = null;
			}
			MP_Util.LogJSError(err, null, "consolidated-procedurehistory.js", "saveProcedure");
		}
		finally {
			if (addProcedureActionTimer) {
				addProcedureActionTimer.stop();
			}
		}
	}

	/**
	 * handleSavedProcedure function will highlight the procedure row that was just added, keep the side panel open and in read-only mode
	 * @params {object} component The Histories component
	 * @params {int} procedure ID for the newly added procedure
	 */
	function handleSavedProcedure(component, procedureId) {
		// Refresh component
		component.addedProcedureId = procedureId;
		component.procSidePanel = null; // This is needed because side panel needs to be built again because the component is painted again
		component.retrieveComponentData();
	}

	/**
	 * ProcedureRequest function will initialize a JSON object needed for sending parameters for mp_exec_std_request script
	 */
	function ProcedureRequest() {
		this.procedure_id = 0;
		this.encounter_id = 0;
		this.active_ind = 0;
		this.nomenclature_id = 0;
		this.procedure_date = "";
		this.procedure_date_precision = 0;
		this.procedure_date_precision_cd = 0;
		this.free_text = "";
		this.update_cnt = 0;
	}

	/**
	 * The buildProcedureStringRequest will create and return a JSON string for adding new procedure
	 * @param {JSON Object} procedureRequest A JSON object representing parameters for adding new procedure
	 * @returns {string} procRequestStr A stringified version of JSON object
	 */
	function buildProcedureStringRequest(procedureRequest, component) {
		// Format procedure date so that it goes through JSON
		var procDateJSON = '';
		if (procedureRequest.procedure_date) {
			var tempDate = new Date(procedureRequest.proc_raw_time);
			procDateJSON = tempDate.toJSON().split('.')[0];
			procDateJSON = '\\/Date(' + procDateJSON + '.000+00:00)\\/';
		}

		var procRequestStr = '{"REQUESTIN":{"PROCEDURES":[{"PROCEDURE_ID":' + procedureRequest.procedure_id + '.0,"VERSION":' + procedureRequest.update_cnt + ',"ENCOUNTER_ID":' + procedureRequest.encounter_id + '.0 ,' +
			'"NOMENCLATURE_ID":' + procedureRequest.nomenclature_id + '.0,"FREE_TEXT":"' + procedureRequest.free_text + '" ,"PERFORMED_DT_TM":"' + procDateJSON + '","PERFORMED_DT_TM_PREC": ' +
			procedureRequest.procedure_date_precision + ' , "PERFORMED_DT_TM_PREC_CD":' + procedureRequest.procedure_date_precision_cd + '.00 ,"ACTIVE_IND":' + procedureRequest.active_ind + ', "CONTRIBUTOR_SYSTEM_CD": ' + contributorPowerChartCd + '.0}]}}';
		return procRequestStr;
	}

	/**
	 * The createSidePanelObj will instantiate a side panel object and set all the necessary attributes when a new procedure is added or a current procedure row is selected to view
	 * @param {Object} component The Histories component
	 */
	function createSidePanelObj(component) {
		var compId = component.getComponentId();

		// Reduce the width of the procedure table to add a side panel
		component.procContentTable = $("#chxContent" + compId).find('.chx-tabpage');
		component.procContentTable.addClass("chx-sp-adjustment");

		// Add a container to hold side panel
		var procTabContent = $("#chxContent" + compId).find('.chx-tabs-content');

		component.sidePanelId = "chxProcSidePanel" + compId;

		// Create a side panel object only first time
		if (!$("#" + component.sidePanelId).length) {
			var chxProcSidePanelContainer = "<div id='" + component.sidePanelId + "' class='chx-sp'>&nbsp;</div>";
			procTabContent.append(chxProcSidePanelContainer);
		}

		// Create a side panel
		component.m_sidePanelMinHeight = "170px";
		component.procSidePanel = new CompSidePanel(compId, component.sidePanelId);
		component.procSidePanel.setExpandOption(component.procSidePanel.expandOption.EXPAND_DOWN);
		component.procSidePanel.setHeight(component.procContentTable.height() + "px");
		component.procSidePanel.setMinHeight(component.m_sidePanelMinHeight);
		component.procSidePanel.renderSidePanel();
		component.procSidePanel.showCloseButton();

		$("#sidePanelContents" + compId).removeClass("sp-all-contents");

		// Event handler when a close icon in the side panel is clicked
		component.procSidePanel
			.setCloseFunction(function() {
				var proceduresContainer = $("#proceduresContent" + compId);
				var procSelectedRow = proceduresContainer
					.find('.res-selected');
				if (procSelectedRow) {
					if (!component.m_isProcedureSaved) {
						// If procedure is added but not saved then call a
						// function that will display the modal with a
						// warning message
						CERN_PROCEDURE_CONSOLIDATED.showConfirmationModal(
							component, null);
					}
					else {
						// Remove the adjusted class added for contents and
						// hide the panel
						if (component.hiTableObj) {
							component.hiTableObj.removeClass("chx-hi-hide-mode");
						}
						component.procContentTable
							.removeClass("chx-sp-adjustment");
						// Hide side panel
						component.procSidePanel.hidePanel();
						procSelectedRow.removeClass('res-selected');
					}
					// Enable vocab menu and search bar
					$("#chxProcedureSearchContainer" + compId)
						.find('input').attr('disabled', false);
					component.vocabSelect.attr('disabled', false);
				}
			});

		component.procSidePanel.setOnExpandFunction(function() {
			$('#chxProcSidePanel' + compId).attr("style", "").addClass("chx-sp-pos-rel");
		});
	}

	/**
	 * The createSidePanelAddHTML will create fields in the side panel required to add a new procedure history item
	 * @param {object} component The Histories component
	 * @returns {string} sidePanelHTML A string with HTML tags to render all fields in the side panel
	 */
	function createSidePanelAddHTML(component, procedureName) {
		var compId = component.getComponentId();

		// Declare date selector options
		component.dateSelectorOptions = {DATE: 0, WEEK_OF: 1, MONTH_YEAR: 2, YEAR: 3, AGE: 4};
		var dateSelectorOptions = component.dateSelectorOptions;

		// Create an action button holder for Save and Cancel
		var sidePanelHtml = "<div class='sp-action-holder'><div class='sp-button' id='chxCancelButton" + compId + "'>" + i18n.CANCEL + "</div><div class='sp-button' id='chxSaveButton" + compId + "'>" + i18n.SAVE + "</div></div>";

		// HTML for header and separator
		sidePanelHtml += "<div class='sp-header'>" + procedureName + "</div> <div class='sp-separator'>&nbsp;</div>" +
		"<div id='sidePanelScrollContainer" + compId + "'><div class='chx-sp-date-container' id='procedureDateContainer" + compId + "'>" +
		"<span class='secondary-text chx-proc-date-label'>" + proc3I18n.PROCEDURE_DATE + "</span>";

		// Render date control for procedure date
		component.onsetDtControl.setUniqueId("chxProc" + compId);
		component.onsetDtControl.setCriterion(component.criterion);
		component.onsetDtControl.setFuzzyFlag(true);
		sidePanelHtml += component.onsetDtControl.renderDateControl();

		sidePanelHtml += "</div></div>";

		return sidePanelHtml;
	}

	/***
	 * The retrieveContributorSystemCds function will retrieve the codes from code set 89 and store them in the shared resource for future use
	 * Since the script call is asynchronous a call back function provided will be executed once the data is retrieved
	 */
	function retrieveContributorSystemCds(component, callBackFunction) {
		// Get contributor system codes from shared resource
		var contributorSystemCdResource = MP_Resources.getSharedResource("contributorSystemCodes");
		if (contributorSystemCdResource && contributorSystemCdResource.isResourceAvailable()) {
			//At this point, the codes are already available, so get the data
			component.contributorSystemCodes = contributorSystemCdResource.getResourceData();

			// Call the call back function if defined
			if (callBackFunction) {
				callBackFunction();
			}
		}
		else {
			// Retrieve code values from code set 89
			// This code set contains the code values for contributor system code, used to sent as a request in mp_exec_std_request
			var contributorSysCdReq = new ScriptRequest();
			contributorSysCdReq.setProgramName("MP_GET_CODESET");
			contributorSysCdReq.setParameterArray(["^MINE^", "89.0"]);
			contributorSysCdReq.setAsyncIndicator(true);
			contributorSysCdReq.setResponseHandler(function(scriptReply) {
				if (scriptReply.getResponse().STATUS_DATA.STATUS === "S") {
					component.contributorSystemCodes = scriptReply.getResponse().CODES;
					// Load the sytem codes in a list so that the code value can be looked up
					component.contributorSystemCodes = MP_Util.LoadCodeListJSON(component.contributorSystemCodes);
					// Add it to the shared resource
					contributorSystemCdResource = new SharedResource("contributorSystemCodes");
					if (contributorSystemCdResource) {
						contributorSystemCdResource.setResourceData(component.contributorSystemCodes);
						contributorSystemCdResource.setIsAvailable(true);
						MP_Resources.addSharedResource("contributorSystemCodes", contributorSystemCdResource);
					}

					// Call the call back function if defined
					if (callBackFunction) {
						callBackFunction();
					}
				}
			});
			contributorSysCdReq.performRequest();
		}
	}

	/**
	 * The removeProcedureRow function will grab the procedure ID, nomenclature ID and update count from the selected procedure row,call the mp_exec_std_request with
	 * active indicator as 0 which removes the procedure. If the script returns a success then the component is refreshed otherwise an error message is shown.
	 * A USR timer is fired to record the remove actionability and an event is fired for all the listeners when procedure is successfully removed.
	 * @params {Object} component The Histories component
	 * @params {Object} procRowToRemoveDetails The details of procedure row that will be removed
	 */
	function removeProcedureRow(component, procRowToRemoveDetails) {
		var removeProcedureActionTimer = null;
		var compId = component.getComponentId();

		// Add a spinner, this will lock down the entire component until it refreshes with new data
		MP_Util.LoadSpinner("chxContent" + compId);

		try {
			// Trigger the USR timer for removing a procedure
			removeProcedureActionTimer = new RTMSTimer("USR:MPG.PROCEDURE_HISTORY-Procedure_Actionability", component.criterion.category_mean);
			if (removeProcedureActionTimer) {
				removeProcedureActionTimer.addMetaData("rtms.legacy.metadata.1", "Removed procedure history");
				removeProcedureActionTimer.start();
			}

			// Build request string for mp_exec_std_request
			var removeRequest = new ProcedureRequest();
			removeRequest.encounter_id = procRowToRemoveDetails.ENCNTR_ID;
			removeRequest.procedure_id = procRowToRemoveDetails.PROCEDURE_ID;
			removeRequest.update_cnt = procRowToRemoveDetails.UPDATE_CNT;
			removeRequest.nomenclature_id = procRowToRemoveDetails.NOMENCLATURE_ID;
			removeRequest.active_ind = 0;

			// Get the contributor system code for POWERCHART
			retrieveContributorSystemCds(component, function() {
				// Get code value for "POWERCHART"
				contributorPowerChartCd = MP_Util.GetCodeByMeaning(component.contributorSystemCodes, 'POWERCHART').codeValue;

				// Build JSON request
				var removeRequestStr = buildProcedureStringRequest(removeRequest, component);

				// Execute the script, if success then refresh component otherwise display an error message
				var self = component;
				var removeProcScriptRequest = new ScriptRequest();
				var criterion = component.getCriterion();
				removeProcScriptRequest.setProgramName("mp_add_update_procedures");
				removeProcScriptRequest.setDataBlob(removeRequestStr);
				removeProcScriptRequest.setParameterArray(["^MINE^", "^^", 0, criterion.person_id]);
				removeProcScriptRequest.setResponseHandler(function(scriptReply) {
					// Read script status and refresh  the procedure content table
					if (scriptReply.getResponse().STATUS_DATA.STATUS === "S") {
						// Fire event to all listeners who are listening for adds/updates on procedures
						CERN_EventListener.fireEvent(null, self, "procedureHistoryUpdated", null);

						// Refresh component
						self.retrieveComponentData();
					}
					else {
						// Add container to hold an error message and show message
						var historiesTabContainer = $("#chxContent" + compId).find('.chx-tab-container');
						var errorMessageHTML = "<div id='chxErrorMessage" + compId + "' class='chx-error-message'><div class='error-container inline-message'><span class='error-text message-info-text'>" + proc3I18n.UNABLE_TO_REMOVE_PROC + "</span></div></div>";
						historiesTabContainer.prepend(errorMessageHTML);
						// Remove spinner
						$("#chxContent" + compId).find('.loading-screen').remove();
					}
				});
				removeProcScriptRequest.performRequest();
			});
		}
		catch (err) {
			if (removeProcedureActionTimer) {
				removeProcedureActionTimer.fail();
				removeProcedureActionTimer = null;
			}
			logger.logJSError(err, component, "consolidated-procedurehistory.js", "removeProcedureRow");
		}
		finally {
			if (removeProcedureActionTimer) {
				removeProcedureActionTimer.stop();
			}
		}
	}

	/**
	 * modifyProcedureDetails function will allow modifying the procedure name and procedure date of the selected procedure.
	 * Procedure name can be modified only if it is a free text procedure. The buttons in the side panel will be replaced by Save and Cancel.
	 * The procedure name of a free text procedure will be replaced by an input field to allow modifications.
	 * The date controls will display with the last saved values defaulted in the controls.
	 * @param {Object} component The Histories component
	 * @param {Object} readOnlyProcDetails Object containing all procedure details like procedure ID, update count, nomenclature ID. This is taken for selected procedure ID row from the record data.
	 */
	function modifyProcedureDetails(component, readOnlyProcDetails) {
		var compId = component.getComponentId();
		var self = component;
		component.updatedProcDetails = {};

		// Set the procedure not saved flag to false, add a class so that confirmation modal can be shown if user navigates away from unsaved changes
		component.m_isProcedureSaved = false;
		component.m_isProcedureModified = true;

		// Cache the procedure details for later use
		component.updatedProcDetails.NOMENCLATURE_ID = readOnlyProcDetails.NOMENCLATURE_ID;
		component.updatedProcDetails.PROCEDURE_ID = readOnlyProcDetails.PROCEDURE_ID;
		component.updatedProcDetails.UPDATE_CNT = readOnlyProcDetails.UPDATE_CNT;
		component.updatedProcDetails.DISPLAY_AS = readOnlyProcDetails.DISPLAY_AS;
		component.updatedProcDetails.ENCNTR_ID = readOnlyProcDetails.ENCNTR_ID;

		// Disable the search bar so that you cannot search and add when there is a procedure yet to be saved
		component.procSearchBar.disable();
		component.procSearchBar.activateCaption();
		component.vocabSelect.attr("disabled", true);

		// Replace Modify and Remove buttons with Save and Cancel respectively
		var removeBtn = $("#chxRemoveButton" + compId);
		var modifyBtn = $("#chxModifyButton" + compId);

		modifyBtn.replaceWith("<div class='sp-button' id='chxSaveChangesBtn" + compId + "'>" + i18n.SAVE + "</div>");
		removeBtn.replaceWith("<div class='sp-button' id='chxCancelChangesBtn" + compId + "'>" + i18n.CANCEL + "</div>");

		// Event handler for cancel changes button
		var cancelChangesBtn = $("#chxCancelChangesBtn" + compId);
		cancelChangesBtn.click(function() {
			// Enable the vocab select and search bar for Add
			component.procSearchBar.enable();
			component.procSearchBar.activateCaption();
			component.vocabSelect.attr("disabled", false);

			component.m_isProcedureSaved = true;
			// Show the original procedure details in side panel
			CERN_PROCEDURE_CONSOLIDATED.showProcedureInSidePanel(readOnlyProcDetails, self);

			// Remove the error message
			$("#chxErrorMessage" + compId).remove();
			return;
		});

		// Event handler for save changes button
		var chxSaveChangesBtn = $("#chxSaveChangesBtn" + compId);
		chxSaveChangesBtn.click(function() {
			saveProcedure(self);
		});

		// For free text procedures allow to modify the procedure name, replace label with an input area showing the free text procedure
		// Free text procedures have a nomenclature ID of 0
		if (readOnlyProcDetails.NOMENCLATURE_ID === 0 && !component.isProcedureSearchDisabled) {
			var sidePanelHeader = $("#sidePanelContents" + compId).find('.sp-header');

			// Empty the header and replace the label with a text area
			var origProcedureName = sidePanelHeader.text();
			sidePanelHeader.empty();
			sidePanelHeader.append('<div class="chx-sp-modify-proc"><input id="chxSPProcInput' + compId + '" value="' + origProcedureName + '"/></div>'); // SP - Side Panel

			// Event handler when text in the input is changed
			var spProcInput = $("#chxSPProcInput" + compId);
			spProcInput.bind("keyup", function() {
				var userEnteredFreeText = spProcInput.val();
				// Trim Spaces
				userEnteredFreeText = userEnteredFreeText.replace(/\s+/g, '');
				if (!userEnteredFreeText.length) {
					// Disable the Save button if no text is entered
					chxSaveChangesBtn.addClass("disabled");
					chxSaveChangesBtn.attr("disabled", true);
				}
				else {
					chxSaveChangesBtn.removeClass("disabled");
					chxSaveChangesBtn.attr("disabled", false);

					// Grab the procedure name
					self.updatedProcDetails.DISPLAY_AS = spProcInput.val();
				}
			});
		}

		// Allow modification of the procedure date, display date controls with the last saved values defaulted in the controls
		component.SPProcDateControl = new DateSelector();
		component.SPProcDateControl.retrieveRequiredResources(function() {
			component.SPProcDateControl.setUniqueId("SPProcDateControl" + compId); // SP - Side Panel
			component.SPProcDateControl.setCriterion(component.criterion);
			component.SPProcDateControl.setFuzzyFlag(true);
			var sidePanelModifyDateHTML = component.SPProcDateControl.renderDateControl();

			// Clear contents of date label and replace that with a date control
			var SPDateContainerElement = $("#procedureSPDateContainer" + compId);
			//SPDateContainerElement.find('.chx-read-only-date').empty();
			SPDateContainerElement.append(sidePanelModifyDateHTML);
			component.SPProcDateControl.finalizeActions();

			// Set values in the date precision and date format control
			if (readOnlyProcDetails.ONSET_UTC) {
				component.SPProcDateControl.setSelectedDate(new Date(readOnlyProcDetails.ONSET_UTC));
				component.SPProcDateControl.setSelectedDateFlag(readOnlyProcDetails.DATE_FLAG);

				var selectedDateStr = "";
				var dateTime = new Date();
				dateTime.setISO8601(readOnlyProcDetails.ONSET_UTC);
				if (dateTime) {
					var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
					selectedDateStr = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR);
					component.SPProcDateControl.datePickerControl.datepicker("setDate", selectedDateStr);
				}
				component.SPProcDateControl.dateDisplayInput.removeClass("secondary-text");
			}
			component.SPProcDateControl.setSelectedDatePrecisionCode(readOnlyProcDetails.PROC_DT_TM_PREC_CD);
		});


		CERN_EventListener.addListener(component, "selectedDateAvailable" + component.SPProcDateControl.getUniqueId(), function() {
			var today = new Date();
			// If an existing procedure is modified, read the selected date from date control and disable the Save button if selected date is greater than today's date
			// This is done because the procedure date is always historical and no future date is allowed
			// For new procedures disable/enable Save button according to the selected date
			if (component.SPProcDateControl && component.SPProcDateControl.getSelectedDate() > today) {
				chxSaveChangesBtn.addClass("disabled");
				chxSaveChangesBtn.attr("disabled", true);
			}
			else {
				chxSaveChangesBtn.removeClass("disabled");
				chxSaveChangesBtn.attr("disabled", false);
			}
		}, component);
	}

	return {
		/**
		 * creates the HTML for the Procedure tab
		 * @param {Object} component the histories component object
		 */
		RenderComponent: function(component) {
			//gets the procedures data from the script call
			var recordData = component.getProceduresRecordData();
			var compID = component.getComponentId();

			//ensure all the record list for procedures are initially empty
			component.m_procedurePatRequestRecords = [];
			component.m_procedureChartRecords = [];
			component.sHistoryRecords = [];
			component.sSurginetRecords = [];

			// Read the 'View Procedure History' and 'Update Procedure History' privilege
			component.viewProcedureHistory = recordData.VIEW_PROC_HIST_PRIV || 0;
			component.isUpdateProcHxGranted = recordData.UPDATE_PROC_HIST_PRIV || 0;
			var patientEnteredDataFilter = component.getPatientEnteredDataInd();
			var hiDataFilter = component.getExternalDataInd();
			var viewOutsideRecordsChecked = component.getViewOutsideHistoriesInd();
			var segmentedControl = null;
			//indicator whether patient requests should be displayed
			var patRequestsDisplayInd = CERN_PROCEDURE_CONSOLIDATED.isDisplayPatientEnteredDataEnabled(component);
			// Store the Update Procedure History exception privileges data in a shared resource so that it is available for consumption
			var updtProcHxPrivResource = MP_Resources.getSharedResource("updtProcHxPrivResource");
			if (!updtProcHxPrivResource) {
				updtProcHxPrivResource = new SharedResource("updtProcHxPrivResource");
				if (updtProcHxPrivResource) {
					updtProcHxPrivResource.setResourceData(recordData.UPDATE_PROC_HIST_PRIV_EXCEPTIONS || {});
					updtProcHxPrivResource.setIsAvailable(true);
					MP_Resources.addSharedResource("updtProcHxPrivResource", updtProcHxPrivResource);
				}
			}

			// Store the date precision codes and contributor system code value for 'POWERCHART'
			datePrecisionCodes = component.datePrecisionCodes;

			var jsHTML = [];

			//categorize procedures in the respective groups
			CERN_PROCEDURE_CONSOLIDATED.groupProcedures(component, recordData);

			//when returned, sort patient requests by request
			if (patRequestsDisplayInd && component.procPatRequestArr.length) {
				component.procPatRequestArr.sort(CERN_PROCEDURE_CONSOLIDATED.sortProceduresByPatientRequest);
			}

			if (component.m_mfaBanner) {
				jsHTML.push(component.m_mfaBanner.render());
			}

			//logic for creating the segemented control for Patient Requests and HI data
			if (hiDataFilter) {
				//get the indicator for the validity of procedures HI data
				var procedureHIDataValid = CERN_PROCEDURE_CONSOLIDATED.checkProcedureHIDataValidity(component, recordData);
				component.setProcHiDataValidity(procedureHIDataValid);

				//the HI banner is only displayed if HI data is enabled and Patient entered data is disabled
				if (!patientEnteredDataFilter) {
					jsHTML.push(CERN_PROCEDURE_CONSOLIDATED.createHIAddDataControl(component, procedureHIDataValid));
				}
				else if (viewOutsideRecordsChecked)  {
					//logic to create the segmented control to toggle between patient entered data and heathe intent data
					segmentedControl = CERN_PROCEDURE_CONSOLIDATED.createSegmentedControl(component);
					var segmentedControlHTML = "<div id='procSegmentedControl" + compID + "' class='chx-seg-control-container'>" + segmentedControl.render() + "</div>";
					jsHTML.push(segmentedControlHTML);

				}

				if (procedureHIDataValid && component.m_hiTotalResults) {
					//create the container for displaying healthe intent data
					jsHTML.push("<div id='hiTableContainer" + compID + "'class='chx-hi-table-container'></div>");
				}
			}

			//sort Surginet Primary Procedures and Procedure History by Date ascending when the component is launched.
			CERN_PROCEDURE_CONSOLIDATED.sortProcedure(component.proc3Arr);

			//sort Surginet Secondary Procedures in alphabetical order name.
			CERN_PROCEDURE_CONSOLIDATED.sortSecondaryProcedures(component);

			//initialize the MPageUI table for procedures and populate it with the procedure data
			CERN_PROCEDURE_CONSOLIDATED.createProceduresTable(component);

			//render the component and append it to the component's HTML
			jsHTML.push("<div id='proceduresMainContainer" +  compID + "'>");

			jsHTML.push(component.m_procedureTable.render());

			jsHTML.push("</div></div></div>");

			var chartProcedureCount = (component.getSurginet()) ? component.sHistoryRecords.length + component.sSurginetRecords.length : component.sHistoryRecords.length;

			//load tab data with a call back function, which initializes the pregnancy specific hovers
			component.loadTabData(chartProcedureCount, jsHTML.join(""), component.HistoryComponentIndexObj.PROCEDURE_HISTORY, function() {
				//resize the Procedure table and attach events to it
				if(component.m_procedureTable) {

					CERN_PROCEDURE_CONSOLIDATED.resizeProcedureTabContent(component);

					component.m_procedureTable.clearElementCache();

					component.m_procedureTable.attachEvents();
				}

				//Only attach segmented control events if the segmented control object was created.
				if (segmentedControl) {
					// Must call clearElementCache because the histories framework wipes out the tab content but
					// keeps a cache of the html, which is put back into the DOM when the tab is switched. This causes
					// the element cache on the SegmentedControl to become out of sync with what is on the DOM.
					///
					segmentedControl.clearElementCache();
					segmentedControl.attachEvents();
				}

				// When procedure is added and component is refreshed show the procedure as highlighted and procedure details in the side panel
				if (component.addedProcedureId) {
					// For cases when procedure is added, select the row and open the side panel
					CERN_PROCEDURE_CONSOLIDATED.triggerTableRowClick(component, component.savedProcedureDetails);

					// Scroll into view so that procedure added but not viewable can be viewed
					CERN_PROCEDURE_CONSOLIDATED.scrollIntoProcedureRow(component, "MILLENNIUM");

					//Call the base class functionality to resize the component, if not done then scrollIntoProcedure will not function
					component.resizeComponent.call(component, null);

					//Clear the saved procedure Id so that when component is refreshed the same row will not be highlighted
					component.addedProcedureId = 0;
				}
			}, component.m_procedurePatRequestRecords.length); //end of loadTabData

			component.updateProcHxPrivExceptions = recordData.UPDATE_PROC_HIST_PRIV_EXCEPTIONS || {};
		},

		/**
		 * add a new row for an unsaved procedure to the the procedures table
		 * @param {object} component the object for the histories component instance
		 */
		addNewProcedureRecordToTable: function(component) {
			var componentId = component.getComponentId();
			var newProcDetails = component.newProcDetails;
			var newProcRowData = {
				display: "<span>" + newProcDetails.PROCEDURE_NAME + "</span>",
				provider: "--",
				implant: "--",
				date: "--",
				patRequest: "--",
				details: component.newProcDetails
			};

			// add the new procedure to the list of the procedure records
			component.sHistoryRecords.unshift(newProcRowData);

			CERN_PROCEDURE_CONSOLIDATED.createChartProcedureTableGroups(component);

			CERN_PROCEDURE_CONSOLIDATED.setProcedureTableData(component);

			//set the indicator showing that an unsaved row has been added to the procedure table
			component.m_isProcedureSaved = false;

			//immediately open the side panel for the newly added row
			CERN_PROCEDURE_CONSOLIDATED.triggerTableRowClick(component, component.newProcDetails);

			CERN_PROCEDURE_CONSOLIDATED.scrollIntoProcedureRow(component, "MILLENNIUM");

			CERN_PROCEDURE_CONSOLIDATED.resizeProcedureTabContent(component);
		},

		/**
		* processes the procedure external data and set the indicator whether it is valid or not
		* @param  {object} component  the object for the histories component instance
		* @param  {JSON} recordData the procedure JSON data from the back end script call
		* @return {boleean}            true if the procedure external data is valid, otherwise false
		*/
		checkProcedureHIDataValidity: function(component, recordData) {
			//By default set the validity of procedure HI data to false
			var procedureHIDataValid = false;

			if ((recordData.STATUS_DATA.SUBEVENTSTATUS[0].OPERATIONSTATUS === "S") &&
				($.trim(recordData.STATUS_DATA.SUBEVENTSTATUS[0].OPERATIONNAME) === "getHIProcHistory")) {

				try {
					var procRecordData = component.getProceduresRecordData();
					var extProcedureData = JSON.parse(procRecordData.PROXYREPLY.HTTPREPLY.BODY);
					component.externalProcHistory = extProcedureData.groups;
					if (extProcedureData.groups[0].most_recent_procedure) {
						procedureHIDataValid = true;
					}
					component.m_hiTotalResults = extProcedureData.total_results;
					component.hiMoreDataAvail = extProcedureData.more_results;

				}
				catch (err) {
					MP_Util.LogJSError(err, this, "consolidated-procedurehistory.js", "RenderComponent");
				}
			}

			return procedureHIDataValid;
		},

		/**
		 * create the groups for chart procedures (the Procedures group and the Surgical Records group)
		 * @param  {object} component the histories component instance
		 * @return {undefined}
		 */
		createChartProcedureTableGroups: function(component) {
			//reset the table data array and re-create the groups for the  chart Procedures section
			component.m_procedureChartRecords = [];
			//add the surgical records only if surginet is enabled in bedrock
			if (component.getSurginet()) {
					component.m_procedureChartRecords.push({
						id: "surginet-group",
						label: proc3I18n.SURGICAL_RECORD,
						expanded: true,
						showCount: true,
						records: component.sSurginetRecords
					});
				}

				component.m_procedureChartRecords.push({
					id: "procedure-group",
					label: proc3I18n.PROCEDURES,
					expanded: true,
					showCount: true,
					records: component.sHistoryRecords
				});

		},

		/**
		 * process the chart procedures data and create record objects for the component table
		 * @param  {object}  component    the histories component instance object
		 * @return {undefined}
		 */
		createChartProcedureTableRecords: function (component) {
			//the array containing patient request procedures
			var procArr = component.proc3Arr;
			var procedureCount = procArr.length;
			var oProcItem;

			//Loop thru all procedures and check group type and put it in array accordingly.
			for (var i = 0; i < procedureCount; i++) {
				oProcItem = procArr[i];
				if (oProcItem.SURG_PROC_IND === 0) {
					//add the procedure record to the array containing historical procedures only
					component.sHistoryRecords.push(CERN_PROCEDURE_CONSOLIDATED.generateProcRowData(component, oProcItem));
				}
				else
				{
					//group surginet procedures in the same case together
					CERN_PROCEDURE_CONSOLIDATED.groupProcedureSurgicalRecords(component, oProcItem);
				}
			}

			CERN_PROCEDURE_CONSOLIDATED.createChartProcedureTableGroups(component);
		},

		/**
		 * create the array for the patient request records
		 * @param  {object} component     the object for the histories component instance
		 * @return {undefined}
		 */
		createProcedurePatRequestRecords: function(component) {
			//initialize the array to hold the patient request records for the component table
			component.m_procedurePatRequestRecords = [];
			//get patient requests from the response array
			var patReqProcsArray = component.procPatRequestArr;
			var patReqProcsCnt = patReqProcsArray.length;
			// create the Html for the patient requests table section
			if (patReqProcsCnt) {
				var oProcItem = null;
				for (var k = 0; k < patReqProcsCnt; k++) {
					oProcItem = patReqProcsArray[k];
					component.m_procedurePatRequestRecords.push(CERN_PROCEDURE_CONSOLIDATED.generateProcRowData(component, oProcItem));
				}
			}
		},

		/**
		 * initializes the MPageUI table for procedures and populates it with data
		 * @param  {object} component   the object for the histories component instance
		 * @return {undefined}
		 */
		createProceduresTable: function(component) {
			//initialize the procedure component table
			component.m_procedureTable = new MPageUI.Table();
			component.m_procedureTable.setOptions({
				rows: {
					striped: true
				},
				columns: {
					separators: true
				},
				namespace: "chx-proc-table",
				select: MPageUI.TABLE_OPTIONS.SELECT.SINGLE_ROW
			});

			//create the procedure component table columns
			CERN_PROCEDURE_CONSOLIDATED.createProcedureTableColumns(component);

			CERN_PROCEDURE_CONSOLIDATED.createChartProcedureTableRecords(component);


			//if displaying patient requests is enabled, populate the record for patient request procedures
			if(CERN_PROCEDURE_CONSOLIDATED.isDisplayPatientEnteredDataEnabled(component)) {
				CERN_PROCEDURE_CONSOLIDATED.createProcedurePatRequestRecords(component);
			}

			//set the data for the component table
			CERN_PROCEDURE_CONSOLIDATED.setProcedureTableData(component);
		},

		/**
		 * creates the columns for the procedures MPageUI table
		 * @param  {object} component the object for the histories component instance
		 * @return {undefined}
		 */
		createProcedureTableColumns: function(component) {
			//indicator when the patient request column should be displayed
			var patRequestColInd = CERN_PROCEDURE_CONSOLIDATED.isDisplayPatientEnteredDataEnabled(component) && component.procPatRequestArr.length;
			var tableColumns = [{
					id: "display",
					label: proc3I18n.PROCEDURE,
					css: (patRequestColInd) ? "chx-proc-name-small" : "chx-proc-name",
					contents: function(record) {
						return record.display;
					}
				},
				{
					id: "provider",
					label: proc3I18n.SURGEON,
					css: (patRequestColInd) ? "chx-provider-small" : "chx-provider",
					contents: function(record) {
						return record.provider;
					}
				},
				{
					id: "implant",
					label: proc3I18n.IMPLANT,
					css: "chx-implant",
					contents: function(record) {
						return record.implant;
					}
				},
				{
					id: "date",
					label: proc3I18n.DATE,
					css: "chx-date",
					contents: function(record) {
						return record.date;
					}
				}
			];

			//display the patient request column if patient entered data should be displayed and some patient requests are available
			if(patRequestColInd) {
				var requestCol = {
					id: "chx-pat-request",
					label: proc3I18n.REQUEST ,
					css: "chx-pat-request",
					contents: function(record) {
						return record.patRequest;
					}
				};

				tableColumns.unshift(requestCol);
			}

			//set the table's columns
			component.m_procedureTable.setColumns(tableColumns);
		},

		/**
		 * format the onset date field for a procedure to the format in which it should be displayed
		 * @param  {object} procObj the object for a given procedure
		 * @return {undefined}
		 */
		formatProcedureDateField: function(procObj) {
			var onsetDate = "";
			var onsetDateHvr = "";
			var dateTime = null;
			var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);

			//the patient request type will be undefined if the procedure is not a patient request
			var patRequestType = procObj.PAT_REQUEST_TYPE;

			//for ADD patient request, use the date from the INTEROP service
			if (patRequestType === 'ADD') {
				onsetDate = procObj.ONSET;
				onsetDateHvr = procObj.ONSET;
			}
			else if (procObj.ONSET) {
				dateTime = new Date();
				var onsetDt = procObj.ONSET_UTC;
				dateTime.setISO8601(onsetDt);

				switch (procObj.DATE_FLAG) {
					case 0:
						onsetDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR);
						onsetDateHvr = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
						break;
					case 1:
						onsetDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR);
						onsetDateHvr = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
						break;
					case 2:
						onsetDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_MONTH_4YEAR_NO_DATE);
						onsetDateHvr = onsetDate;
						break;
					case 3:
						onsetDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_4YEAR);
						onsetDateHvr = onsetDate;
						break;
				}
			}
			else{
				onsetDate = "--";
				onsetDateHvr = "--";
			}

			//add formatted onset date field to the procedure object
			procObj.ONSET_DATE_FORMATTED = onsetDate;
			procObj.ONSET_DATE_HVR_FORMATTED = onsetDateHvr;
		},

		/**
		 * processes all the comments for a given procedure and create one string containing all the comments
		 * @param  {object} procObj the object for a given procedure
		 * @return {undefined}
		 */
		generateProcedureCommentString: function(procObj) {
			var dateTime;
			var beginDtTm = "";
			var commentString = "";
			var commentsCount = procObj.COMMENTS.length;
			var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);

			for (var k = 0; k < commentsCount; k++) {
				if (procObj.COMMENTS[k].BEG_EFFECTIVE_DT_TM) {
					dateTime = new Date();
					dateTime.setISO8601(procObj.COMMENTS[k].BEG_EFFECTIVE_DT_TM);
					beginDtTm = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
				}

				if (procObj.SURG_PROC_IND === 0)//history procedure
				{
					commentString += beginDtTm + " - " + procObj.COMMENTS[k].NAME_FULL_FORMATTED + "<br/>" + procObj.COMMENTS[k].LONG_TEXT + "<br/>";
				}
				else//surginet procedure
				{
					commentString += procObj.COMMENTS[k].LONG_TEXT + "<br/>";
				}
			}
			//add comment string field to the prccedure
			procObj.COMMENT_STRING = commentString;
		},

		/**
		 * generate the data for procedure in an object format that is expected by the MPageUI Table API for a row
		 * @param  {object} component the object for the histories component instance
		 * @param  {object} procItem  the object from the back end for a given procedure
		 * @return {object}           the record object for a procedure row in the table
		 */
		generateProcRowData: function(component, procItem) {
			//indicator whether viewing patient requests is enabled
			var patRequestsDisplayInd =  CERN_PROCEDURE_CONSOLIDATED.isDisplayPatientEnteredDataEnabled(component);

			//format the procedure onset date to the format in which it should be displayed
			CERN_PROCEDURE_CONSOLIDATED.formatProcedureDateField(procItem);

			//get comment string
			CERN_PROCEDURE_CONSOLIDATED.generateProcedureCommentString(procItem);

			var patRequestType = procItem.PAT_REQUEST_TYPE;

			var displayName = procItem.DISPLAY_AS || '--';

			//the provider is not displayed for add request
			var providerName = (patRequestsDisplayInd && patRequestType === "ADD") ? "--" :  (procItem.PROVIDER || '--');

			var implantLength = procItem.IMPLANT ? procItem.IMPLANT.length : 0;
			var implantDisplay = (implantLength) ? "<span class='chx-implant-content'><span class='chx-implant-img'>&nbsp;</span></span>" : "";

			// If onset date was entered as About 1996 then display the text "About" before the onset date
			var procDtTmPrec = (procItem.PROC_DT_TM_PREC_CD) ? MP_Util.GetValueFromArray(procItem.PROC_DT_TM_PREC_CD, datePrecisionCodes) : null;
			var precisionText = (procDtTmPrec) ? procDtTmPrec.display : "";
			var displayDate = procItem.ONSET_DATE_FORMATTED ? precisionText + " " + procItem.ONSET_DATE_FORMATTED : '--';

			var surgicalProcSedondaryInd = procItem.SURG_PROC_IND === 1 && procItem.PRIMARY_PROC_IND === 0;

			var rowClass = (patRequestsDisplayInd && patRequestType === "REMOVE") ? "chx-remove-strike" : "";

			var procRowDataObj = {
				display: (surgicalProcSedondaryInd) ? "<span class='chx-secondary-table-element'>" + displayName + "</span>" : "<span class='" + rowClass + "'>" + displayName + "</span>",
				provider: "<span class='" + rowClass + "'>" + providerName + "</span>",
				implant: implantDisplay,
				date: "<span class='" + rowClass + "'>" + displayDate + "</span>",
				details: procItem
			};

			//if displaying patient entered data is enabled, add the patient request field to the object
			if(patRequestsDisplayInd) {
				procRowDataObj.patRequest = procItem.PAT_REQUEST_TYPE_DISPLAY || "--";
			}

			return procRowDataObj;
		},

		/**
		 * group the procedures from the script call in their respective categories:
		 * historical procedures, surginet procedures and patient requests
		 * @param  {object} component  the object for the histories component instance
		 * @param  {JSON} recordData  the JSON object from the script call for procedures
		 * @return {undefined}
		 */
		groupProcedures: function(component, recordData) {
			/**
			 * categorizes a chart procedure as a historical procedure/primary surginet or secondary surginet
			 * @param  {object} procObj the object for a given procedure
			 * @return {undefined}
			 */
			var categorizeChartProcedure = function (procObj) {
				if (procObj.SURG_PROC_IND === 0 || (procObj.SURG_PROC_IND === 1 && procObj.PRIMARY_PROC_IND === 1)) {
					component.proc3Arr.push(procObj);
				}
				else if (procObj.SURG_PROC_IND === 1 && procObj.PRIMARY_PROC_IND === 0) {
					component.proc3SecondaryArr.push(procObj);
				}
			};
			//this array will store the list of patient requests
			component.procPatRequestArr = [];

			//this array will Procedure History and Surginet Primary procedures
			component.proc3Arr = [];

			//the array of Surginet secondary procedures
			component.proc3SecondaryArr = [];

			var procCnt = recordData.PROC_CNT;

			var patRequestsDisplayInd = CERN_PROCEDURE_CONSOLIDATED.isDisplayPatientEnteredDataEnabled(component);
			var oProc = null;
			for (var j = 0; j < procCnt; j++) {
				oProc = recordData.PROC[j];
				//store all the patient requests in their own array if displaying patient entered data is enabled
				if (patRequestsDisplayInd) {
					if(CERN_PROCEDURE_CONSOLIDATED.isProcedurePatientRequest(oProc)) {
						//add the patient request display to the object
						CERN_PROCEDURE_CONSOLIDATED.setProcPatientRequestDisplay(oProc, component);
						component.procPatRequestArr.push(oProc);
					}
					else {
						categorizeChartProcedure(oProc);
					}
				}
				else {
					categorizeChartProcedure(oProc);
				}

				// Gather procedure details so that newly added procedure can be shown in the side panel
				// This will occur when a newly added procedure is saved and the component is refreshed
				if (oProc.PROCEDURE_ID === component.addedProcedureId) {
					component.savedProcedureDetails = oProc;
				}
			}
		},

		/**
		 * groups together a primary surgery with its secondary procedures in the array for surgical sHistoryRecords
		 * @param  {object} component      the object for the histories compoonent instance
		 * @param  {object} primaryProcObj the object for a given primary surgery
		 * @return {undefined}
		 */
		groupProcedureSurgicalRecords: function(component, primaryProcObj) {
			//generate a table record for the primary surgery and give it an indicator that it is a surginet
			var primaryProcRowData = CERN_PROCEDURE_CONSOLIDATED.generateProcRowData(component, primaryProcObj);
			primaryProcRowData.details.tableRowType = "SURGINET";
			component.sSurginetRecords.push(primaryProcRowData);
			var secondaryProcObj = null;
			var secondaryProcRowData = null;
			var secondProcsCount = component.proc3SecondaryArr.length;

			//check to see if there is any secondary procedure for the primary one, then create table records for the secondary procedures.
			for (var a = 0; a < secondProcsCount; a++) {
				secondaryProcObj = component.proc3SecondaryArr[a];
				if (primaryProcObj.SURG_CASE_ID === secondaryProcObj.SURG_CASE_ID) {
					secondaryProcRowData = CERN_PROCEDURE_CONSOLIDATED.generateProcRowData(component, secondaryProcObj);
					secondaryProcRowData.details.tableRowType = "SURGINET";
					component.sSurginetRecords.push(secondaryProcRowData);
				}
			}
		},

		/**
		 * open the side panel for the unsaved procedure that is added the procedures table
		 * @param  {object} component the object for the histories component instance
		 * @return {undefined}
		 */
		openSidePanelForNewProcedure: function(component) {
			var compId = component.getComponentId();
			// Initialize side panel
			createSidePanelObj(component);

			// Create fields for adding new procedure in the side panel
			var newProcedureHTML = createSidePanelAddHTML(component, component.newProcDetails.PROCEDURE_NAME);
			var nomenclatureID = component.newProcDetails.NOMENCLATURE_ID;

			component.procSidePanel.setContents(newProcedureHTML, component.sidePanelId);

			// If the selected nomenclature ID has an exception defined in the reply then disable the Save button
			var isModifiable = component.isUpdateProcHxGranted;

			// Grab the is_modifiable property for selected nomenclature ID
			var procExceptionsObj = component.updateProcHxPrivExceptions;
			for (var idx in procExceptionsObj) {
				if (procExceptionsObj.hasOwnProperty(idx) && procExceptionsObj[idx].NOMENCLATURE_ID === nomenclatureID) {
					isModifiable = procExceptionsObj[idx].IS_NOMEN_MODIFIABLE;
					break;
				}
			}

			// Scroll into view so that procedure added but not viewable can be viewed
			CERN_PROCEDURE_CONSOLIDATED.scrollIntoProcedureRow(component, "MILLENNIUM");

			var procSidePanelCancelBtn = $("#chxCancelButton" + compId);

			// Event handler when cancel button in side panel is clicked
			procSidePanelCancelBtn.click(function() {
				// Remove the adjusted class added for contents and hide the panel
				component.procContentTable.removeClass("chx-sp-adjustment");

				component.procSidePanel.hidePanel();

				//remove the new (unsaved) procedure record from the table
				CERN_PROCEDURE_CONSOLIDATED.removeNewProcedureRecordFromTable(component);

				// Show helper text in search
				component.vocabSelect.prop("disabled", false);
				component.procSearchBar.enable();
				component.procSearchBar.activateCaption();

				// Mark procedure as saved to indicate there are no unsaved procedures
				component.m_isProcedureSaved = true;

				// Remove the error message
				$("#chxErrorMessage" + compId).remove();
			});

			// Now call the event handler for date control, this needs to be done now since elements are not rendered yet
			component.onsetDtControl.finalizeActions();
			component.procSidePanel.showPanel();

			var self = component;
			var sidePanelSaveBtn = $("#chxSaveButton" + compId);

			// Disable the save button if no update privs, needs to be done after the side panel is shown
			if (!isModifiable) {
				sidePanelSaveBtn.addClass("disabled");
				sidePanelSaveBtn.prop("disabled", true);

				// Show a error message indicating no privs, add container to hold an error message and show message
				var historiesTabContainer = $("#chxContent" + compId).find('.chx-tab-container');
				var errorMessageHTML = "<div id='chxErrorMessage" + compId + "' class='chx-error-message'><div class='error-container inline-message'><span class='error-text message-info-text'>" + proc3I18n.NO_PRIVILEGE_MSG + "</span></div></div>";
				historiesTabContainer.prepend(errorMessageHTML);
			}

			// Event handler when Save button in the side panel is clicked
			sidePanelSaveBtn.click(function() {
				saveProcedure(self);
			});

			CERN_EventListener.addListener(component, "selectedDateAvailable" + component.onsetDtControl.getUniqueId(), function() {
				// Get today's date
				var today = new Date();
				// If a new procedure history item is created, read the selected date from date control and disable the Save button if selected date is greater than today's date
				// This is done because the procedure date is always historical and no future date is allowed
				// For new procedures disable/enable Save button according to the selected date
				var addSaveBtn = $("#chxSaveButton" + compId);
				if (component.onsetDtControl && component.onsetDtControl.getSelectedDate() > today) {
					addSaveBtn.addClass("disabled");
					addSaveBtn.prop("disabled", true);
				}
				else {
					addSaveBtn.removeClass("disabled");
					addSaveBtn.prop("disabled", false);
				}
			}, component);
		},

		/**
		 * remove the unsaved procedure from the procedures table
		 * @param  {object} component the object for the histories component instance
		 * @return {undefined}
		 */
		removeNewProcedureRecordFromTable: function(component) {
			//remove the new procedure record
			component.sHistoryRecords.shift();

			//reset the data for the procedures MPageUI table
			CERN_PROCEDURE_CONSOLIDATED.createChartProcedureTableGroups(component);

			CERN_PROCEDURE_CONSOLIDATED.setProcedureTableData(component);

			CERN_PROCEDURE_CONSOLIDATED.resizeProcedureTabContent(component);

			//set the indicator showing that there is no unsaved procedure in the table
			component.m_isProcedureSaved = true;
		},

		/**
		 * resize the content for the Procedure tab by calculating the max height available for the millennium procedures
		 * table and the HI data table
		 * @param  {object} component the object for the histories component instance
		 * @return {undefined}
		 */
		resizeProcedureTabContent: function(component) {
			var componentId = component.getComponentId();
			var viewPointBodyObj = $("#vwpBody");
			var chxHeaderHeight = 92;

			var viewPointBodyHeight = viewPointBodyObj.length ? viewPointBodyObj.height() : 400;
			var tabControlObj = $("#" + "tabData" + componentId);
			var tabControlHeight = tabControlObj.length ? tabControlObj.height() : 0;
			var procSegmentedControlObj = $("#procSegmentedControl" + componentId);
			var procSegmentedControlHeight = procSegmentedControlObj.length ? procSegmentedControlObj.height(): 0;

			var $procedureExtDataTableContent = $("#hiTableContainer" + componentId).find(".content-body");

			var $procHIControlBanner = $("#procHiControlBanner" + componentId);
			var procHIControlBannerHeight = $procHIControlBanner.length ? $procHIControlBanner.height() : 0;

			var $procedureExtDataPager = $("#procedureExtDataPager" + componentId);
			var procExtDataPagerHeight = $procedureExtDataPager.length ? $procedureExtDataPager.height(): 0;

			var availableHeight = viewPointBodyHeight - (chxHeaderHeight + tabControlHeight + procSegmentedControlHeight + procHIControlBannerHeight + procExtDataPagerHeight);
			if($procedureExtDataTableContent.length) {
				//split the available height between the millennium procedures table and the external data table
				component.m_procedureTable.setMaxHeight(availableHeight / 2);
				$procedureExtDataTableContent.css({
					"max-height": (availableHeight / 2) + "px",
					"overflow-y": "auto"
				});
			}
			else {
				component.m_procedureTable.setMaxHeight(availableHeight);
			}
		},

		/**
		 * click the table row for a specific procedure
		 * @param  {object} component the object for the histories component instance
		 * @param  {object} procObj   the object for a given procedure
		 * @return {undefined}
		 */
		triggerTableRowClick: function(component, procObj) {
			//get the DOM id for the newly created row for the the unsaved procedure
			var procedureRowRecord =  CERN_PROCEDURE_CONSOLIDATED.getProcedureTableRowRecord(component, procObj);
			$("#" + procedureRowRecord._MPageUI.rowReference).click();
		},
		/**
		 * The scrollIntoProcedureRow function will scroll the procedures container to make the highlighted procedure viewable
		 * @param {Object} component The Histories component
		 * @param {string} tableType the type of the table the user is selecting from, MILLENNIUM or HI
		 * @return {undefined}
		 */
		scrollIntoProcedureRow: function(component, tableType) {
			var $tableContainer = null;
			var $procRowSelected = null;
			var compId = component.getComponentId();

			//get the appropriate table content body and selected row objects
			switch(tableType) {
				case "MILLENNIUM":
					$tableContainer = $("#proceduresMainContainer" + compId).find(".table-body");
					var selectedProcRowRecord = CERN_PROCEDURE_CONSOLIDATED.getProcedureTableRowRecord(component, component.selectedProcTableRowData);
					$procRowSelected = $("#" + selectedProcRowRecord._MPageUI.rowReference);
					break;
				case "HI":
					$tableContainer = component.hiTableObj.find(".content-body");
					$procRowSelected = $tableContainer.find(".res-selected");
					break;
				default:
					return;
			}


			if ($procRowSelected.length) {
				// Get the top and bottom offset of the window and selected procedure row element
				var docViewTop = $(window).scrollTop();
				var docViewBottom = docViewTop + $(window).height();
				var elemTop = $procRowSelected.offset().top;
				var elemBottom = elemTop + $procRowSelected.height();

				// Scroll into the element only if the element is not in the viewing area
				var isElementVisible = ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
				if (!isElementVisible) {
					$tableContainer.scrollTo($procRowSelected);
				}
			}
		},
		/**
		 * set the data for the procedures tables. if patient entered data should be displayed, the Patient Requests
		 * and Other Chart Procedures sections will be created in the table.
		 * @param {object} component the object for the histories component
		 */
		setProcedureTableData: function(component) {
			var displayProcPatRequestsInd =  CERN_PROCEDURE_CONSOLIDATED. isDisplayPatientEnteredDataEnabled(component);
			if(displayProcPatRequestsInd) {
				component.m_procedureTable.setData({
					groups:[{
								id: "patient-request-group",
								label: "<span class='chx-pat-req-icon'></span><span>" + proc3I18n.PATIENT_REQUESTS + "</span>" ,
								expanded: true,
								collapsible: false,
								showCount: true,
								records: component.m_procedurePatRequestRecords
							},
							{
								label: proc3I18n.OTHER_CHART_PROCEDURES,
								expanded: true,
								collapsible: false,
								showCount:true,
								groups: component.m_procedureChartRecords
							}
					]
				});
			}
			else {
				component.m_procedureTable.setData({
					groups: component.m_procedureChartRecords
				});
			}
		},

		/**
		 * The addProcedureActionability function creates a search bar for searching procedures and attaches event handlers when any suggestion is selected. This function also looks whether the
		 * user has viewing privileges or if no vocabularies are defined in the Bedrock, in these cases the search bar will be disabled.
		 */
		addProcedureActionability: function(component) {
			var compId = component.getComponentId();

			// Define supported vocabularies for searching procedures
			component.supportedVocabularies = {CPT4: 8, ICD9: 9, ICD10: 10};

			component.m_procedureTable.setOnRowClickCallback(function(data) {
				component.selectedProcTableRowData = data.records[0].details;
				if(component.selectedProcTableRowData.tableRowType === "SURGINET") {
					//don't allow the selection of surginet procedures;
					if(component.m_procedureTable.getSelectionData().length) {
						$( data.event.currentTarget).click();
					}

				}
				else {
					CERN_PROCEDURE_CONSOLIDATED.handleMillenniumTableRowSelection(component);
				}
			});

			// Read vocabularies
			var vocabList = component.getVocabularyList();

			// Get the vocab menu and search container
			var procSearchContainer = $("#chxProcedureSearchContainer" + compId);
			// Create nomenclature search bar
			var procSearchBar = new MPageControls.NomenclatureSearch(procSearchContainer);

			// Get the text input for searching and vocab menu
			var procSearchInputElement = procSearchContainer.find('input');
			component.vocabSelect = $("#chxProcVocabSelect" + compId);

			// Build HTML for options
			var optionsHTML = "";
			var vocabularyListLen = vocabList.length;
			var unsupportedVocabularies = 0;
			var vocabValue = "";

			// If only 1 vocabulary is selected then replace the menu with a label
			if (vocabularyListLen === 1) {
				vocabValue = vocabList[0];
				if (vocabValue && typeof component.supportedVocabularies[vocabValue] !== "undefined") {
					component.vocabSelect.replaceWith("<span id='chxVocabLabel" + compId + "' data-src-flag=" + component.supportedVocabularies[vocabValue] + ">" + vocabValue + "</span>");
				}
			}
			else {
				// Show a menu with all vocabularies
				for (var i = 0; i < vocabularyListLen; i++) {
					// The search artifact only supports 3 vocabularies 8 - CPT-4, 9 - ICD-9, 10 -ICD-10. Vocabularies not supported by search artifact will not be shown
					vocabValue = vocabList[i];
					if (vocabValue && typeof component.supportedVocabularies[vocabValue] !== "undefined") {
						optionsHTML += '<option value=' + component.supportedVocabularies[vocabValue] + ' index=' + i + '>' + vocabValue + '</option>';
					}
					else {
						unsupportedVocabularies++;
					}
				}
				// Render vocabularies in the menu
				component.vocabSelect.append(optionsHTML);
			}

			// Set caption for the nomenclature search, do this before disabling the search so that the search bar has a caption
			procSearchBar.setCaption(proc3I18n.ADD_PROCEDURE);
			procSearchBar.setCaptionClass('secondary-text');
			procSearchBar.activateCaption();

			// Only time procedure adds/updates should be disabled is when Update Procedure History is set to "No" with no exceptions
			if (!component.isUpdateProcHxGranted && !component.updateProcHxPrivExceptions.length) {
				component.allowProcUpdates = 0;
			}
			else {
				component.allowProcUpdates = 1;
			}

			// If no view privs are defined OR no vocabularies set in Bedrock  OR if the vocabulary list consists of all unsupported vocabularies
			// or no update procedure history privilege then disable the search and menu
			if (!component.viewProcedureHistory || !component.allowProcUpdates || !vocabList.length || (unsupportedVocabularies === vocabularyListLen)) {
				procSearchInputElement.attr('disabled', true);
				component.vocabSelect.addClass('hidden');
				component.isProcedureSearchDisabled = true;
				return;
			}
			else {
				component.isProcedureSearchDisabled = false;
			}

			// Get the source flag for search from the vocab selector or the label when there is only 1 vocab
			procSearchBar.setSourceFlag(parseInt(component.vocabSelect.val(), 10) || parseInt($("#chxVocabLabel" + compId).attr("data-src-flag"), 10));

			// Event handler for vocabulary menu selection
			component.vocabSelect.change(function() {
				procSearchBar.setSourceFlag(parseInt(component.vocabSelect.val(), 10));
			});

			// Setting a delay of 500ms between the keystrokes. This is done so that the searching is not done after every keystroke.
			procSearchBar.setDelay(500);

			// Set list template for suggestions. For a free text procedure the nomenclature ID is 0 so add a custom class so that specific styles can be applied
			var nomenSearchItemTemplate = new TemplateEngine.TemplateFactory((function() {
				var template = TemplateEngine;
				var div = template.tag("div");
				return {
					nomenInfo: function(context) {
						if (context.m_Data.ID === 0) {
							return div({
								"class": "chx-free-text-item",
								"id": context._elementId
							}, context.m_Data.SOURCESTRING);
						}
						else {
							return div({
								"id": context._elementId
							}, context.m_Data.SOURCESTRING);
						}
					}
				};
			})());

			procSearchBar.setListItemTemplate(nomenSearchItemTemplate.nomenInfo);

			var origHandleReplyList = procSearchBar.handleReplyList;

			// Override the handleReplyList to show custom item even though the search did not return any results
			procSearchBar.handleReplyList = function(replyList, reply, err) {
				var customNomen = new MPageEntity.entities.Nomenclature();
				// Free text procedures have nomenclature Id as 0
				customNomen.setId(0);
				//Format the message as Add "Knee" as free text
				var freeTextProcedure = $("#chxProcedureSearchContainer" + compId).find('input').val();
				//Show free text procedure in quotes
				freeTextProcedure = "\"" + freeTextProcedure + "\"";
				customNomen.setSourceString(proc3I18n.ADD_AS_FREE_TEXT.replace("{0}", freeTextProcedure));
				replyList.push(customNomen);
				// Call the original handleReplyList function that will take care of highlighting the row and showing a 'x' icon
				origHandleReplyList.call(this, replyList, reply, err);
				// Call parent's setSuggestions to show all items
				MPageControls.NomenclatureSearch.prototype.setSuggestions.call(this, replyList);
				// Highlight the first suggestion
				this.getList().setSelectedIndex(0);
				this.getList().highlight(0);
			};

			// Event handler when item from the procedures suggestions is selected
			procSearchBar.getList().setOnSelect(function(nomen) {
				// Show this value in the textbox as well
				if (nomen.getId() === 0) {
					// For Free text procedures we don't want "Add knee as free text" to be the procedure name so in this case the name will be what the user enters
					nomen.setSourceString(procSearchInputElement.val());
					component.procedureName = procSearchInputElement.val();
				}
				// Clear contents of the search input and revert to the caption
				procSearchBar.activateCaption();
				procSearchBar.close();

				CERN_PROCEDURE_CONSOLIDATED.handleProcedureSearchSelection(component, nomen.getId(), nomen.getSourceString());
			});
			// Cache the search bar control
			component.procSearchBar = procSearchBar;

			// Event handler for search bar input when the input is clicked
			procSearchInputElement.click(function() {
				// If any error message is displayed then remove it
				$("#chxErrorMessage" + compId).remove();

				var procSearchContent = procSearchInputElement.val();
				if (!procSearchContent || procSearchContent === proc3I18n.ADD_PROCEDURE) {
					procSearchInputElement.val("");
					procSearchInputElement.addClass('secondary-text');
				}
				else {
					procSearchInputElement.removeClass('secondary-text');
				}
			});

			// Event handler for search bar input on focusout
			procSearchInputElement.bind("change focusout", function() {
				var procSearchContent = procSearchInputElement.val();
				if (!procSearchContent || procSearchContent === proc3I18n.ADD_PROCEDURE) {
					procSearchInputElement.val(proc3I18n.ADD_PROCEDURE);
					procSearchInputElement.addClass('secondary-text');
				}
				else {
					procSearchInputElement.removeClass('secondary-text');
				}
			});
		},

		/**
		 * check if patient entered data should be displayed.  Patient entered data should be display if the patient entered data filter
		 * is set to YES in bedrock, the View Outside record is checked and HI data is not displaying
		 * @param  {object}  component the object for the histories component instance
		 * @return {Boolean}          true if patient entered data should be displayed, otherwise false.
		 */
		isDisplayPatientEnteredDataEnabled: function(component) {
			return (component.shouldDisplayPatientEnteredData() && !component.getDisplayHiProcDataInd());
		},
		/**
		 * checks whether a procedure is a patient request
		 * @param  {Object}  procObj the procedure object
		 * @return {Boolean}  true if procedure is a patient request, otherwise false
		 */
		isProcedurePatientRequest: function(procObj) {
			return (procObj.INTEROP && procObj.INTEROP.length && parseInt(procObj.INTEROP[0].EXT_DATA_INFO_ID, 10));
		},

		/**
		 * gets  the MPageUI Table row id for a specific procedure in the table
		 * @param  {number}
		 * @param  {array}
		 * @return {object}
		 */
		 getProcedureTableRowRecord: function(component, procObj) {
			if(!component.m_procedureTable) {
				return;
			}

			var procedureRowRecord = null;
			var records = component.m_procedureTable.getAllRecords();
			var recordsCount = records.length;
			var tableRecord = null;

			for(var i = 0; i < recordsCount; i++) {
				tableRecord = records[i];
				//check if the procedure object is for an unsaved procedure
				if(procObj.UNSAVED_PROCEDURE_IND && tableRecord.details.UNSAVED_PROCEDURE_IND) {
					procedureRowRecord = tableRecord;
					break;
				}
				//check if the object is for a historical procedure
				else if(procObj.PROCEDURE_ID && procObj.PROCEDURE_ID === tableRecord.details.PROCEDURE_ID) {
					procedureRowRecord = tableRecord;
					break;
				}
				//check the object is for patient request
				else if (CERN_PROCEDURE_CONSOLIDATED.isProcedurePatientRequest(procObj) && CERN_PROCEDURE_CONSOLIDATED.isProcedurePatientRequest(tableRecord.details) && procObj.INTEROP[0].EXT_DATA_INFO_ID === tableRecord.details.INTEROP[0].EXT_DATA_INFO_ID) {
					procedureRowRecord = tableRecord;
					break;
				}
			}

			return procedureRowRecord;
		},
		/**
		 * call the updtate status script to mark a patient request for a procedure as acknowledged
		 * @param  {Object} procObj   the procedure  object
		 * @param  {Object} component the histories component object
		 * @return Undefined
		 */
		acknowledgeProcPatientRequest: function(procObj, component) {
			//immediately return if the procedure is not a patient request
			if (!CERN_PROCEDURE_CONSOLIDATED.isProcedurePatientRequest(procObj)) {
				return;
			}
			//trigger Procedures Reconcile CAP timer
			var procReconcileCAPTimer = new CapabilityTimer('CAP:MPG Histories_Procedure History Reconcile Patient Entered Data');
			procReconcileCAPTimer.capture();

			var proceduresRecordData = component.getProceduresRecordData();
			var criterion = component.getCriterion();
			var codesArray = MP_Util.LoadCodeListJSON(proceduresRecordData.CODES);
			var extDataInfoId = procObj.INTEROP[0].EXT_DATA_INFO_ID;
			var statusCode = MP_Util.GetCodeByMeaning(codesArray, 'ACKNOWLEDGED').codeValue;
			var chartReferenceId = procObj.INTEROP[0].ID;
			var personnelId = criterion.provider_id;
			var encounterId = criterion.encntr_id;

			var requestJson = '{"REQUESTIN":{"UPDATESTATUS":[{"EXT_DATA_INFO_ID":' + extDataInfoId + '.0' + ',"STATUS_CODE":' + statusCode + '.0' + ',"CHART_REFERENCE_ID":' + chartReferenceId + '.0' + ',"PERSONNEL_ID":' + personnelId + '.0' + ',"ENCNTR_ID":' + encounterId + '.0' + '}]}}';
			var scriptRequest = new ScriptRequest();
			scriptRequest.setProgramName('mp_exec_std_request');
			scriptRequest.setRawDataIndicator(true);
			scriptRequest.setDataBlob(requestJson);
			//app number,task number,request number for  INTEROP service UPDATESTATUS
			scriptRequest.setParameterArray(["^MINE^", "^^", 3202004, 3202004, 964756]);
			//callback function to handle the response
			scriptRequest.setResponseHandler(function(scriptReply) {
				try {
					var responseData = JSON.parse(scriptReply.getResponse());
					//if sucess, render the component  to get the updates to procedures
					if (responseData.RECORD_DATA.STATUS.SUCCESS_INDICATOR === 1) {
						component.retrieveComponentData();
					}
					else {
						//display error message in side panel banner
						CERN_PROCEDURE_CONSOLIDATED.createSidePanelErrorBanner(component);
					}
				}
				catch (err) {
					//display error message in side panel banner
					CERN_PROCEDURE_CONSOLIDATED.createSidePanelErrorBanner(component);
				}
			});
			scriptRequest.performRequest();
		},

		/**
		 * Display error banner in the side panel
		 * @param  {Object} component the histories component object
		 * @return Undefined
		 */
		createSidePanelErrorBanner: function(component) {
			var compId = component.getComponentId();
			var alertBanner = new MPageUI.AlertBanner();
			alertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
			alertBanner.setPrimaryText(proc3I18n.REMOVE_PAT_REQUEST_ERROR_TEXT);
			$('#chxProcAlert' + compId).html(alertBanner.render());
		},

		/**
		 * Returns the type of a patient request for a procedure
		 * @param  {Object} procObj  the procedure object
		 * @param  {Object} component the histories component object
		 * @return {String} returns ADD, UPDATE or REMOVE if a procedure is a patient request, otherwise empty string
		 */
		getProcPatientRequestType: function(procObj, component) {
			var proceduresRecordData = component.getProceduresRecordData();
			var codesArray = MP_Util.LoadCodeListJSON(proceduresRecordData.CODES);
			var patRequestType = '';

			if (CERN_PROCEDURE_CONSOLIDATED.isProcedurePatientRequest(procObj)) {
				patRequestType = MP_Util.GetValueFromArray(procObj.INTEROP[0].REQUEST_TYPE, codesArray).meaning;
			}
			return patRequestType;
		},
		/**
		 * highlights the selected HI table row and shows the procedure's information in the side panel,
		 * if the procedure was already selected, it unselects the row and closes the side panel
		 * @param {Object} component The Histories component
		 * @param {HTML element} selectedRow The selected HI table row whose details are to be viewed
		 * @param {undefined}
		 */
		handleHITableRowSelection: function(component, selectedProcRow) {
			var selectedProcedureDetails = {};
			var selectedRow = $(selectedProcRow);

			// If the same row is selected already then clicking it again will close the side panel
			if (selectedRow.hasClass('res-selected')) {
				// Remove the adjusted class added for contents and hide the panel
				selectedRow.removeClass('res-selected');
				component.procContentTable.removeClass("chx-sp-adjustment");
				//Hide side panel
				component.procSidePanel.hidePanel();
				component.procHistPanelShowing = false;
			}
			else {
				//since there can be two tables, millennium and HI, we need to deselect rows from both of the tables.
				// If any other row  in the HI data table is already selected, then unselect it
				if (component.hiTableObj) {
					component.hiTableObj.find('.res-selected').removeClass('res-selected');
				}

				//delect any selected row in the millennium procedures table
				if(component.m_procedureTable) {
					component.m_procedureTable.deselectAll();
				}

				// Highlight the row
				selectedRow.addClass('res-selected');
				var procedureId = selectedRow.attr('data-proc-id');

				// Grab the procedure details for the selected procedure ID from recordData
				var procObj = component.getProceduresRecordData().PROC;
				for (var idx in procObj) {
					if (procObj.hasOwnProperty(idx) && procObj[idx].PROCEDURE_ID == procedureId) {
						selectedProcedureDetails = procObj[idx];
						break;
					}
				}
				// Call a function to display the details in the side panel
				CERN_PROCEDURE_CONSOLIDATED.showProcedureInSidePanel(selectedProcedureDetails, component);
			}
			CERN_PROCEDURE_CONSOLIDATED.scrollIntoProcedureRow(component, "HI");
		},

		/**
		 * highlights the row selected from the millennium procedure table and displays the procedure's information
		 * in the side panel. if the row was already selected, it will be unhighlighted and the side panel will be closed
		 * @param {object} component The Histories component object
		 * @return {undefined}
		 */
		handleMillenniumTableRowSelection: function(component) {
			var procedureRowData = component.selectedProcTableRowData;

			//the count of the rows selected from the table. since the procedures table is using the SINGLE ROW SELECTION setting,
			//this can only be 1 or 0.
			var procedureSelectionsCount = component.m_procedureTable.getSelectionData().length;

			//check if a procedure is selected
			if (procedureSelectionsCount) {
				//check if the selected row is for an unsaved row
				if (procedureRowData.UNSAVED_PROCEDURE_IND) {
					CERN_PROCEDURE_CONSOLIDATED.openSidePanelForNewProcedure(component);
				}
				// Throw a confirmation box if the newly added procedure row is added and user chooses to select another row
				else if (component.m_isProcedureSaved === false) {
					CERN_PROCEDURE_CONSOLIDATED.showConfirmationModal(component, function() {
						// Call back function if user chooses to continue and lose unsaved changes
						CERN_PROCEDURE_CONSOLIDATED.triggerTableRowClick(component, procedureRowData);
					});
				}
				else {
					//Since there can be two tables, millennium and HI, we need to deselect rows from both of the tables.
					if (component.hiTableObj) {
						component.hiTableObj.find('.res-selected').removeClass('res-selected');
					}

					// Call a function to display the details in the side panel
					CERN_PROCEDURE_CONSOLIDATED.showProcedureInSidePanel(procedureRowData, component);
				}
			}
			else {
				// If the same row is selected already then clicking it again will close the side panel
				// Remove the adjusted class added for contents and hide the panel
				component.procContentTable.removeClass("chx-sp-adjustment");
				//Hide side panel
				component.procSidePanel.hidePanel();
				component.procHistPanelShowing = false;
			}
		},

		/**
		 * The handleProcedureSearchSelection will add a new row below the procedure history content table header. Shows a side panel with required fields to add a new procedure history item.
		 * @param {object} component The Histories component
		 * @param {float} nomenclatureID The nomenclature ID of selected procedure
		 * @param {string} procedureName The procedure name of free text/codified procedure
		 * @returns none
		 */
		handleProcedureSearchSelection: function(component, nomenclatureID, procedureName) {
			// Retrieve required resources from date control
			component.onsetDtControl = new DateSelector();
			component.onsetDtControl.retrieveRequiredResources(function() {
				var compId = component.getComponentId();
				component.m_isProcedureSaved = false;
				component.m_isProcedureModified = false;

				// Disable the search bar so that you cannot search and add when there is a procedure yet to be saved
				component.vocabSelect.attr("disabled", true);
				component.procSearchBar.disable();
				component.procSearchBar.activateCaption();

				// Save new nomenclature Id and procedure name in object to refer later
				component.newProcDetails = {
					NOMENCLATURE_ID: nomenclatureID,
					PROCEDURE_NAME: procedureName,
					UNSAVED_PROCEDURE_IND: true
				};

				//add a new row for the unsaved procedure to the procedures table
				CERN_PROCEDURE_CONSOLIDATED.addNewProcedureRecordToTable(component);
			});
		},

		/**
		 * The showProcedureInSidePanel function will show procedure name and procedure date in the side panel in read-only mode. The side panel will have "Remove" and "Cancel" buttons
		 */
		showProcedureInSidePanel: function(procedureDetailsItem, component) {
			var compId = component.getComponentId();
			var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
			var dateTime = new Date();
			var onsetDt = "";
			var onsetDateLocaleFormat = "";
			var displayDate = "--";
			var actionsHtml = '';
			//container for error banner
			var alertBannerHtml = '<div id="chxProcAlert' + compId + '" class="chx-sp-banner-container"></div>';
			//variable to hold the request type if the procedure to be displayed is patient request
			var patRequestType = procedureDetailsItem.PAT_REQUEST_TYPE;
			// check if the selected procedure is a patient request
			var isUpdatePrivGranted = false;
			var removeReqButton = null;
			if (patRequestType) {
				isUpdatePrivGranted = CERN_PROCEDURE_CONSOLIDATED.isPatRequestUpdatePrivGranted(procedureDetailsItem, component);
				//for patient request,check the uvar isUpdatePrivGranted = CERN_PROCEDURE_CONSOLIDATED.isPatRequestUpdatePrivGranted(procedureDetailsItem, component);pdate priv because before displaying the remove request button
				if (isUpdatePrivGranted) {
					// Create the MPage Button Enum for button style options
					var buttonStyleEnum = MPageUI.BUTTON_OPTIONS.STYLE;
					removeReqButton = (new MPageUI.Button())
						.setLabel(proc3I18n.REMOVE_REQUEST)
						.setStyle(buttonStyleEnum.SECONDARY)
						.setOnClickCallback(function() {
							//handle the remove patient request action
							CERN_PROCEDURE_CONSOLIDATED.acknowledgeProcPatientRequest(procedureDetailsItem, component);
						});
					actionsHtml = '<div class="chx-remove-pat-request">' + removeReqButton.render() + '</div>';
				}
			}
			else {
				actionsHtml = "<div class='sp-button' id='chxRemoveButton" + compId + "'>" + i18n.discernabu.CONFIRM_REMOVE + "</div><div class='sp-button' id='chxModifyButton" + compId + "'>" + proc3I18n.MODIFY + "</div>";
			}

			// Initialize the side panel
			CERN_PROCEDURE_CONSOLIDATED.createSidePanelObj(component);

			// Create an action button holder for Remove and Modify
			var sidePanelHtml = "<div class='sp-header2'><div class='sp-action-holder'>" + actionsHtml + alertBannerHtml + "</div>";

			// HTML for header and separator
			sidePanelHtml += "<div class='sp-header2'>" + procedureDetailsItem.DISPLAY_AS + "</div></div><div class='sp-separator2'>&nbsp;</div>";

			//if patient request, create the patient requests section in the side panel
			if (patRequestType) {
				sidePanelHtml += CERN_PROCEDURE_CONSOLIDATED.buildPatRequestSidePanelSection(procedureDetailsItem, patRequestType, component, isUpdatePrivGranted);
			}
			// Case when there is a precision code
			var precisionText = procedureDetailsItem.PROC_DT_TM_PREC_CD ? MP_Util.GetValueFromArray(procedureDetailsItem.PROC_DT_TM_PREC_CD, component.datePrecisionCodes).display : "";
			if (procedureDetailsItem.most_recent_procedure) {
				var imgUrl = component.getCriterion().static_content
					+ "/images/6965.png";
				imgUrl = "<span><img height='22' width='22' style='float:left' id='externalDataImg' src= '"
				+ imgUrl + "'></span>";
				var label = "<p id = 'externalDataLabel' class='secondary-text';>"
					+ imgUrl
					+ "<span style='margin-left:5px text-align:left;padding-left: 7px;'>"
					+ proc3I18n.HI_BTN_LBL_UPON_CLICK + "</span></p>";
				label += "<div class='chx-sp-date-container'>"
				+ procedureDetailsItem.most_recent_procedure.source["partition_description"]
				+ "<div class='sp-separator'>&nbsp;</div>";
				sidePanelHtml += label;
				if (!patRequestType) {
					sidePanelHtml += "</div><div><div class='chx-hi-sp-date-provider' id='procedureSPDateContainer"
					+ compId
					+ "'><dd class='secondary-text'>"
					+ proc3I18n.PROCEDURE_DATE
					+ "</dd><dd class='chx-date'>"
					+ procedureDetailsItem.ONSET_UTC
					+ "</dd></div><div class='chx-hi-sp-date-provider'><dd class='secondary-text'>"
					+ proc3I18n.PROVIDER
					+ "</dd><dd class='chx-date'>"
					+ procedureDetailsItem.most_recent_procedure.providers[0].name
					+ "</dd>" + "</div></div>";
				}

				component.procSidePanel.setContents(sidePanelHtml,
					component.sidePanelId);
				component.procSidePanel.showPanel();
				if (removeReqButton) {
					removeReqButton.attachEvents();
				}
				component.procHistPanelShowing = true;
				$("#chxRemoveButton" + compId).hide();
				$("#chxModifyButton" + compId).hide();

				return;
			}
			// Format the onset date to display in locale format
			//The onset date for ADD patient request should not process because it is a string
			if (patRequestType !== 'ADD' && procedureDetailsItem.ONSET.length) {
				onsetDt = procedureDetailsItem.ONSET_UTC;
				dateTime.setISO8601(onsetDt);

				switch (procedureDetailsItem.DATE_FLAG) {
					// Format the date in full date format when date flag is 0 (DATE) or 1(WEEK OF)
					case 0:
					case 1:
						onsetDateLocaleFormat = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR);
						break;
					// Format the date in month/year format when date flag is 2 
					case 2:
						onsetDateLocaleFormat = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_MONTH_4YEAR_NO_DATE);
						break;
					// Format the date in only year format when date flag is 3
					case 3:
						onsetDateLocaleFormat = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_4YEAR);
						break;
				}

				// Add the precision text before the onset date
				displayDate = precisionText + " " + onsetDateLocaleFormat;
			}

			//Special case when onsetDate is "" but precision meaning is UNKNOWN 
			if (!procedureDetailsItem.ONSET.length && procedureDetailsItem.PROC_DT_TM_PREC_CD > 0) {
				displayDate = MP_Util.GetValueFromArray(procedureDetailsItem.PROC_DT_TM_PREC_CD, component.datePrecisionCodes).display;
			}

			if (patRequestType === 'ADD') {
				sidePanelHtml += "<div id='sidePanelScrollContainer" + compId + "'></div>";
			}
			else {
				sidePanelHtml += "<div id='sidePanelScrollContainer" + compId + "'><div class='chx-sp-date-container sp-body-contents-padding' id='procedureSPDateContainer" + compId + "'><dl><dd class='secondary-text'>" + proc3I18n.PROCEDURE_DATE + "</dd><dd class='chx-read-only-date'>" + displayDate + "</dd></dl></div></div>";
			}

			// Set contents in the side panel
			component.procSidePanel.setContents(sidePanelHtml, component.sidePanelId);
			component.procSidePanel.showPanel();
			if (removeReqButton) {
				removeReqButton.attachEvents();
			}
			component.procHistPanelShowing = true;

			var removeBtn = $("#chxRemoveButton" + compId);
			var modifyBtn = $("#chxModifyButton" + compId);

			// Hide Modify and Remove button if Update Procedure History is set to 'No' OR set to No except for <position, provider, PPR> and the exception type is set for the Nomenclature 
			if (!procedureDetailsItem.IS_MODIFIABLE) {
				removeBtn.addClass("hidden");
				modifyBtn.addClass("hidden");
			}

			// Event handler when Remove button is clicked
			var self = component;
			removeBtn.click(function() {
				// Call a function to remove the procedure row
				CERN_PROCEDURE_CONSOLIDATED.removeProcedureRow(self, procedureDetailsItem);
			});

			// Event handler when Modify button is clicked
			modifyBtn.click(function() {
				CERN_PROCEDURE_CONSOLIDATED.modifyProcedureDetails(self, procedureDetailsItem);
			});

			if (patRequestType) {
				var sidePanelContainer = $('#sidePanel' + compId);
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
				//attach click event listener to the Win32 procedures link when in millennium context
				if (CERN_Platform.inMillenniumContext()) {
					$('.chx-sp-proc-link').click(function() {
						CERN_PROCEDURE_CONSOLIDATED.openProceduresTab(component);
					});
				}
			}
		},
		/**
		 * create the Html for the modification requests for a procedure
		 * @param  {Object} procedureRequestObj the procedure object to be displayed
		 * @return {String} the Html string for all the modification requests
		 */
		buildProcedureModificationHtml: function(procedureRequestObj) {
			var modificationsHtml = '<ul class="chx-sp-item-list">';
			var procRequestInfo = procedureRequestObj.INTEROP[0];
			// identify the procedure's  items that have been modified and add them to the HTML
			if (procRequestInfo.PROCEDURE_NAME.STATUS) {
				var modifiedProcName = procRequestInfo.PROCEDURE_NAME.MODIFIED_NAME || '--';
				modificationsHtml += '<li>' + proc3I18n.CHANGE + ' ' + proc3I18n.NAME + ' ' + proc3I18n.FROM + ' "' + procRequestInfo.PROCEDURE_NAME.NAME + '" ' + proc3I18n.TO + ' "' + modifiedProcName + '"</li>';
			}

			if (procRequestInfo.FT_DATE.STATUS) {
				var modifiedProcDate = procRequestInfo.FT_DATE.MODIFIED_FT_DATE || '--';
				modificationsHtml += '<li>' + proc3I18n.CHANGE + ' ' + proc3I18n.DATE + ' ' + proc3I18n.FROM + ' "' + procRequestInfo.FT_DATE.FT_DATE + '" ' + proc3I18n.TO + ' "' + modifiedProcDate + '"</li>';
			}
			//close the  Html tag for modifications
			modificationsHtml += '</ul>';
			return modificationsHtml;
		},

		/**
		 * create the Html for the patient request sub section in the side panel
		 * @param  {Object} procedureRequestObj the procedure object to be displayed
		 * @param {String} requestType  the type of the  request submitted for the procedure: ADD, UPDATE or REMOVE
		 * @param {Object} component the histories component object
		 * @param {Boolean} the update privilege for the procedure
		 * @return {String} the Html string for the patient request sub section
		 */
		buildPatRequestSidePanelSection: function(procedureRequestObj, requestType, component, isUpdatePrivGranted) {
			var inMillenniumContextInd = CERN_Platform.inMillenniumContext();
			var procRequestInfo = procedureRequestObj.INTEROP[0];
			var submittedDtTm = procRequestInfo.SUBMITTED_ON.substr(6).replace(')/', '');
			var interopDtTm = new Date();
			interopDtTm.setISO8601(submittedDtTm);
			var submittedDtTmDisplay = interopDtTm.format('longDateTime3');
			//Get the request source information
			var proceduresRecordData = component.getProceduresRecordData();
			var codesArray = MP_Util.LoadCodeListJSON(proceduresRecordData.CODES);
			var requestSource = MP_Util.GetValueFromArray(procRequestInfo.SUBMITTED_BY_TYPE, codesArray).display;
			var requestActionMsg = '';
			//create the HTML for the link to the Win32 procedures
			var procLinkSetting = component.getProceduresLink();
			var mainHeaderLink = component.getLink();
			//enables the link if.. Were in Millennium Context AND either the procedures link OR the component link is defined in Bedrock
			//if they are both set in bedrock, the procedures link takes prescedence and will be the value set
			var isProcLinkDisabled = !(inMillenniumContextInd && (procLinkSetting || mainHeaderLink));
			var proceduresLink = component.createTabLink(proc3I18n.PROCEDURES, isProcLinkDisabled, 'chx-sp-proc-link');

			//variables to hold the Html for the different elements of the patient request section
			var requestionActionHtml = '';
			var requestDetailsHtml = '';
			var requestSourceHtml =
				'<dd class="chx-sp-detail-group">' +
				'<dl class="chx-sp-details-sub-section">' +
				'<dt class="chx-request-label">' + proc3I18n.ORIGINATING_SOURCE + '</dt>' +
				'<dd>' + (requestSource || '--') + '</dd>' +
				'</dl>' +
				'<dl class="chx-sp-details-sub-section">' +
				'<dt class="chx-request-label">' + proc3I18n.ORIGINATING_AUTHOR + '</dt>' +
				'<dd>' + (procRequestInfo.SUBMITTED_BY_NAME || '--') + '</dd>' +
				'</dl>' +
				'</dd>';
			var patientComment = (procRequestInfo.COMMENTS.length) ? procRequestInfo.COMMENTS[0].COMMENT : '--';
			var requestCommentHtml =
				'<dd>' +
				'<dl>' +
				'<dt class="chx-request-label">' + proc3I18n.PATIENT_COMMENT + '</dt>' +
				'<dd>' + patientComment + '</dd>' +
				'</dl>' +
				'</dd>';

			switch (requestType) {
				case 'ADD':
					requestActionMsg = (isUpdatePrivGranted) ? proc3I18n.ADD_THIS_PROCEDURE_BY_SEARCH : '';
					requestionActionHtml =
						'<dd>' +
						'<dl class="chx-sp-detail-group">' +
						'<dt class="chx-request-label">' + proc3I18n.ADDITION + '</dt>' +
						'<dt>' + requestActionMsg + '</dt>' +
						'</dl>' +
						'</dd>';
					requestDetailsHtml =
						'<dd>' +
						'<dl class="chx-sp-detail-group">' +
						'<dt class="chx-request-label">' + proc3I18n.PROCEDURE_DATE + '</dt>' +
						'<dd>' + procedureRequestObj.ONSET + '</dd>' +
						'</dl>' +
						'</dd>';
					break;
				case 'UPDATE':
					//The request action message is only displayed if the update privilege is granted
					requestActionMsg = (isUpdatePrivGranted) ? proc3I18n.UPDATE_THIS_PROCEDURE + ' ' + proc3I18n.WITHIN + ' ' + proceduresLink : '';
					requestionActionHtml =
						'<dd>' +
						'<dl class="chx-sp-detail-group">' +
						'<dt class="chx-request-label">' + proc3I18n.MODIFICATION + '</dt>' +
						'<dt>' + requestActionMsg + '</dt>' +
						'<div>' + CERN_PROCEDURE_CONSOLIDATED.buildProcedureModificationHtml(procedureRequestObj) + '</div>' +
						'</dl>' +
						'</dd>';
					break;
				case 'REMOVE':
					requestActionMsg = (isUpdatePrivGranted) ? proc3I18n.REMOVE_THIS_PROCEDURE + ' ' + proc3I18n.WITHIN + ' ' + proceduresLink : '';
					requestionActionHtml =
						'<dd>' +
						'<dl class="chx-sp-detail-group">' +
						'<dt class="chx-request-label">' + proc3I18n.REMOVAL + '</dt>' +
						'<dt>' + requestActionMsg + '</dt>' +
						'</dl>' +
						'</dd>';
					break;
			}
			// construct the Html for the patient request sub section
			var requestSectionHtml =
			'<div class="chx-sp-body-contents">' +
				'<dl class="chx-sp-detail-group">' +
				'<dt class="chx-expand-content-section">' +
				'<span class="chx-side-panel-tgl chx-hide-expand-btn" title="collapse">&nbsp;</span>' +
				'<span class="chx-pat-req-icon">&nbsp</span>' +
				'<span>' + proc3I18n.OUTSIDE_REQUESTS + '</span>' +
				'<span class="chx-pull-right">' + (submittedDtTmDisplay || '--') + '</span>' +
				'</dt>' +
				'</dl>' +
				'<div class="chx-expand-content">' +
				'<dl>' +
				requestionActionHtml + requestDetailsHtml + requestSourceHtml + requestCommentHtml +
				'</dl>' +
				'</div>' +
				'</div>';
			//add a separator below the patient request
			requestSectionHtml += '<div class="sp-separator">&nbsp;</div>';
			return requestSectionHtml;
		},
		/**
		 * check if an update privilege exception is defined  for a procedure
		 * @param  {number}  nomenclatureID the procedure's nomenclature id
		 * @param  {object}  component      the histories component object
		 * @return {Boolean}                indicator whether the exception is found
		 */
		isProcUpdatePrivException: function(nomenclatureID, component) {
			var procPrivExceptions = component.updateProcHxPrivExceptions;
			var exceptionsLen = procPrivExceptions.length;
			var nomenclatureFound = false;

			// check if the selected nomenclature id has an exception defined
			for (var i = 0; i < exceptionsLen && !nomenclatureFound; i++) {
				if (procPrivExceptions[i].NOMENCLATURE_ID === nomenclatureID) {
					nomenclatureFound = true;
				}
			}
			return nomenclatureFound;
		},

		/**
		 * checks whether the update privilege is granted for a given procedure patient request
		 * @param  {Object}  procObj the procedure object
		 * @param  {Object}  component the histories component object
		 * @return {Boolean} true if the update privilege is granted for the procedure, otherwise false
		 */
		isPatRequestUpdatePrivGranted: function(procObj, component) {
			var procNomenclatureId = procObj.NOMENCLATURE_ID;
			var updatePriv = component.isUpdateProcHxGranted;
			var updatePrivGranted = false;
			//check if procedure is codified
			if (procNomenclatureId) {
				//check if an exception is defined for the procedure
				var isProcPrivException = CERN_PROCEDURE_CONSOLIDATED.isProcUpdatePrivException(procNomenclatureId, component);
				// for codified procedures, updatePrivGranted is set to true only when update priv is YES or NO except for the procedure's nomenclature id.
				if (updatePriv) {
					if (!isProcPrivException) {
						updatePrivGranted = true;
					}
				}
				else if (!updatePriv && isProcPrivException) {
					updatePrivGranted = true;
				}
			}
			else {
				//for free text procedures, updatePrivGranted  is set to true when  update priv is YES or YES with exceptions
				if (updatePriv) {
					updatePrivGranted = true;
				}
			}
			return updatePrivGranted;
		},
		/**
		 * create the segment control that  allows toggling between patient requests and healthe intent data
		 * @param { Object} component the histories component object
		 * @return {Object} segmented control object
		 */
		createSegmentedControl: function(component) {
			var displayHiDataInd = component.getDisplayHiProcDataInd();
			var procHIDataValid = (component.getProcHiDataValidity()) && component.m_hiTotalResults;
			//define the segment control
			var segment = new MPageUI.SegmentedControl();
			//add the segments to the segment control
			segment.addSegment({
				label: proc3I18n.PATIENT_REQUESTS,
				selected: !displayHiDataInd,
				onSelect: function() {
					//display spinner while waiting for the switch to Patient Requests view
					MP_Util.LoadSpinner(component.m_externalProcDataTable.getNamespace() + 'table');
					component.setDisplayProcHiDataInd(false);
					component.retrieveComponentData();
				}
			});
			segment.addSegment({
				label: proc3I18n.OUTSIDE_RECORDS,
				selected: displayHiDataInd,
				disabled: !procHIDataValid,
				onSelect: function() {
					//display spinner while waiting for the switch to HI data view
					MP_Util.LoadSpinner("proceduresMainContainer" + component.getComponentId());
					component.setDisplayProcHiDataInd(true);
					component.retrieveComponentData();
				}
			});
			//return the segment control object
			return segment;
		},

		/**
		 * open the Win32 Histories Component / Procedures Tab
		 * @param  {Object} component   the  histories Component object
		 * @return Undefined
		 */
		openProceduresTab: function(component) {
			var criterion = component.getCriterion();
			var proceduresLink = component.getProceduresLink();
			//If the procedures link is set in bedrock, set it as the link, else set the value to the component header link
			var sidePanelTabLink = proceduresLink ? proceduresLink : component.getLink();
			var sParms = "/PERSONID=" + criterion.person_id + " /ENCNTRID=" + criterion.encntr_id + " /FIRSTTAB=^" + sidePanelTabLink + "^";
			APPLINK(0, criterion.executable, sParms);
		},

		/**
		 * The showConfirmationModal function will be displayed when a procedure is selected to add but not saved. A modal dialog with a warning message will be shown. The
		 *  modal will have Continue and Cancel buttons. Clicking Continue will lose unsaved changes and allow user to continue taking the action. Clicking Cancel button
		 *  will set the focus back to the newly added procedure
		 * @params {Object} component The Histories component
		 * @params {Function} continueCallBackFn A call back function that will be called when Continue button is clicked
		 */
		showConfirmationModal: function(component, continueCallBackFn) {
			var compId = component.getComponentId();

			// Keep the side panel opened when confirmation box is shown
			component.procSidePanel.showPanel();
			/**
			 * reselect the row containing an unsaved procedure for Add or Modify actions
			 * @return {undefined}
			 */
			function resetSelectionToUnsavedProcedure() {
				component.m_isProcedureSaved = false;
				//reselect the unsaved procedure row
				component.m_procedureTable.deselectAll();
				var procObj = (component.m_isProcedureModified) ? component.updatedProcDetails : component.newProcDetails;
				var unsavedProcRowRecord = CERN_PROCEDURE_CONSOLIDATED.getProcedureTableRowRecord(component, procObj);
				component.m_procedureTable.deselectAll();
				component.m_procedureTable.select({records:[unsavedProcRowRecord]});
			}

			MP_ModalDialog.deleteModalDialogObject("unsavedProcedureModal");

			// Create an object for the modal dialog which will display the message indicating unsaved procedure
			var unsavedProcedureModalObj = MP_ModalDialog.retrieveModalDialogObject("unsavedProcedureModal");
			if (!unsavedProcedureModalObj) {
				unsavedProcedureModalObj = new ModalDialog("unsavedProcedureModal");
				var unsavedProcContinueBtn = new ModalButton("unsavedProcContinueBtn");
				unsavedProcContinueBtn.setText(i18n.CONTINUE);
				unsavedProcContinueBtn.setFocusInd(true);

				unsavedProcContinueBtn.setOnClickFunction(function() {
					if (component.m_isProcedureModified) {
						//deselect the row for the existing procedure that is being modified
						component.m_procedureTable.deselectAll();
					}
					else {
						// Remove the added row ewly added procedure
						CERN_PROCEDURE_CONSOLIDATED.removeNewProcedureRecordFromTable(component);
					}
					//hide the side panel
					component.procContentTable.removeClass("chx-sp-adjustment");
					component.procSidePanel.hidePanel();
					component.m_LostDataAndContinue = true;

					component.procSearchBar.enable();
					component.procSearchBar.activateCaption();

					component.m_isProcedureSaved = true;

					// Enable the vocabulary selector
					component.vocabSelect.prop('disabled', false);

					// Execute the call back function
					if (continueCallBackFn) {
						continueCallBackFn();
					}

					// Remove the error message
					$("#chxErrorMessage" + compId).remove();
				});

				// Call back function when 'x' in clicked
				unsavedProcedureModalObj.setHeaderCloseFunction(function() {
					resetSelectionToUnsavedProcedure();
				});

				var unsavedProcCancelBtn = new ModalButton("unsavedProcCancelBtn");
				unsavedProcCancelBtn.setText(i18n.CANCEL);
				unsavedProcCancelBtn.setFocusInd(true);
				unsavedProcCancelBtn.setCloseOnClick(true);

				unsavedProcCancelBtn.setOnClickFunction(function() {
					resetSelectionToUnsavedProcedure();
				});

				unsavedProcedureModalObj.setTopMarginPercentage(25).setRightMarginPercentage(30).setBottomMarginPercentage(25).setLeftMarginPercentage(30).setIsBodySizeFixed(false);
				unsavedProcedureModalObj.setHeaderTitle(proc3I18n.UNSAVED_CHANGES);
				unsavedProcedureModalObj.addFooterButton(unsavedProcContinueBtn);
				unsavedProcedureModalObj.addFooterButton(unsavedProcCancelBtn);

				MP_ModalDialog.addModalDialogObject(unsavedProcedureModalObj);
				MP_ModalDialog.showModalDialog("unsavedProcedureModal");
				$("#unsavedProcedureModalbody").html("<div class='chx-modal-container'><div class='chx-warning-message'><span>" + proc3I18n.UNSAVED_MESSAGE + "</span></div></div>");
			}
		},
		/**
		 * Creates the Healthe Intent Data control
		 * @params {Object} component historiesComponent object.
		 * @params {boolean} hiDataRetreivalStatus flag to indicate whether or not to display banner with successful or error message
		 * or not to display any banner.
		 * @return {String} an internationalized as of date string
		 */
		createHIAddDataControl: function(component, hiDataRetreivalStatus) {
			var componentId = component.getComponentId();
			var hiAddDataContainer = "<div id='procHiControlBanner" + componentId + "' class='chx-hi-ext-label'>";

			var imgUrl = component.getCriterion().static_content
				+ "/images/";

			var imgSuccess = "6965.png";


			imgUrl += imgSuccess;

			var msg = "";
			var hiTitleSpan;
			var btnSpan;

			//Success scenario
			if (hiDataRetreivalStatus) {

				if (component.m_hiTotalResults > 0) {

					msg = proc3I18n.HI_EXT_LABEL;
					btnSpan = "<span style='float:right'><button ";
					btnSpan += "class='chx-hi-ext-btn' id='hiDataControlBtn";
					btnSpan += component.getComponentId();
					btnSpan += "'>" + proc3I18n.HI_BTN_TXT + "</button></span>";
				}
				else {
					return "";
				}
			}
			else {
				msg = proc3I18n.EXTERNAL_DATA_LABEL_ERR;
				btnSpan = "";
			}

			hiTitleSpan = "<span style='margin-left:5px; padding-top:5px; font-weight: bold;'>";
			hiTitleSpan += msg;
			hiTitleSpan += "</span>";
			var imgSpan = "<span><img height='22'	width='22' style='float:left' id='externalData' src= '"
				+ imgUrl + "'></span>";
			hiAddDataContainer += imgSpan;
			hiAddDataContainer += hiTitleSpan;
			hiAddDataContainer += btnSpan;
			hiAddDataContainer += "</div><br>";

			return hiAddDataContainer;

		},

		/**
		 * This function will serve as the click handler for the table delegate.
		 *
		 * @param {Object}
		 *            component - The javascript object for this component.
		 * @param {Object}
		 *            selectedProc - The row element which was clicked.
		 */
		onRowClick: function(component, selectedProc) {
			if (!selectedProc) {
				return;
			}

			var ind = selectedProc.getAttribute("id").replace(
				component.m_externalProcDataTable.getNamespace() + ":row", '');
			$(selectedProc).attr("data-proc-id",
				component.externalProcHistory[ind]["id"]);

			if (component.extProcSelInd == selectedProc.getAttribute("id")) {

				component.procSidePanel.m_closeButton.trigger('click');
				component.extProcSelInd = "";
				component.procHistPanelShowing = false;
			}
			else {

				$("#" + component.m_externalProcDataTable.getNamespace() + "table").addClass("chx-hi-hide-mode");

				component.extProcSelInd = selectedProc.getAttribute("id");
			}
			CERN_PROCEDURE_CONSOLIDATED.handleHITableRowSelection(component, selectedProc);
		},

		/**
		 * This function processes the externalProcHistory json array to check
		 * if all the required attributes for display are present.
		 */
		processExtDataForRender: function(component) {

			for (var i = 0; i < component.externalProcHistory.length; i++) {

				component.externalProcHistory[i].PROCEDURE_ID = component.externalProcHistory[i]["id"];
				component.externalProcHistory[i].DISPLAY_AS = component.externalProcHistory[i]["name"];
				component.externalProcHistory[i].ONSET = component.externalProcHistory[i].most_recent_procedure["start_datetime"];
				component.externalProcHistory[i].ONSET_UTC = component.externalProcHistory[i].most_recent_procedure["start_datetime"];

				var onsetDt = component.externalProcHistory[i].ONSET_UTC;

				if (onsetDt) {
					var dateTime = new Date();
					dateTime.setISO8601(onsetDt);
					onsetDt = MP_Util.GetDateFormatter().format(dateTime,
						mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
				}
				else {
					onsetDt = "--";
				}
				component.externalProcHistory[i].ONSET_UTC = "<span class='chx-dt-hd' >" + onsetDt + "</span>";

				if (component.externalProcHistory[i].most_recent_procedure.providers.length < 1) {
					var provider = {};
					provider.name = "--";
					provider.relationship = "--";
					component.externalProcHistory[i].most_recent_procedure.providers
						.push(provider);
				}
			}
		},
		/**
		 * This function validates hi data by comparing the subeventstatus and parsing data
		 * and if the data is relevant to procedure-history.
		 * @param {}
		 *              reply - external HI Data
		 */
		validateHIData: function(reply) {

			this.m_HIvalidData = false;
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

					var procedures = JSON.parse(recordData.PROXYREPLY.HTTPREPLY.BODY);
					this.m_hiTotalResults = procedures.total_results;
					this.m_HIvalidData = true;

				}
				else {
					this.m_HIvalidData = false;
				}
			} catch (err) {
				MP_Util.LogJSError(err, this, "consolidated-procedurehistory.js", "validateHIData");
			}
		},
		/**
		 * This function loads each page data when a user clicks on prev or next button.
		 */
		loadHIProceduresPage: function(component) {

			var criterion = component.getCriterion();
			var request = null;
			var sendAr = [];

			var hiPrLookUpKey = "null";
			var hiTestUri = "null";
			var aliasType = (component.getAliasType().length > 0) ? component.getAliasType() : "null";
			var aliasPoolCd = 0.0;

			if ($.trim(component.getHILookupKey()).length > 0) {
				hiPrLookUpKey = component.getHILookupKey();
			}
			if ($.trim(component.getHITestUri()).length > 0) {
				hiTestUri = component.getHITestUri();
			}

			if (component.getAliasPoolCd()) {
				aliasPoolCd = component.getAliasPoolCd() + ".0";
			}
			sendAr.push("^MINE^"
				, criterion.person_id + ".0"
				, "0.0"
				, criterion.provider_id + ".0"
				, criterion.ppr_cd + ".0"
				, 1
				, "^" + aliasType + "^"
				, aliasPoolCd
				, "^" + hiPrLookUpKey + "^"  // lookupkey
				, "^" + hiTestUri + "^"
				, this.pageIndex);

			var request = new MP_Core.ScriptRequest(self, component.getComponentLoadTimerName());
			request.setProgramName("MP_GET_CONSOLIDATED_PROCEDURES");
			request.setParameters(sendAr);
			request.setAsync(true);
			var self = this;
			var comp = component;
			MP_Core.XMLCCLRequestCallBack(self, request, function(reply) {
				try {
					var response = reply.getResponse();
					self.validateHIData(response);
					if (self.m_HIvalidData) {

						comp.externalProcHistory = JSON.parse(response.PROXYREPLY.HTTPREPLY.BODY).groups;
						self.processExtDataForRender(comp);
						comp.m_externalProcDataTable.clearData();
						comp.m_externalProcDataTable.bindData(comp.externalProcHistory);
						comp.hiTableObj.html(comp.m_externalProcDataTable.render());

						$("#" + comp.m_externalProcDataTable.getNamespace() + "tableBody").on(
							"click",
							".result-info",
							function(event) {
								CERN_PROCEDURE_CONSOLIDATED.onRowClick(comp,
									this);
							});
						comp.m_externalProcDataTable.finalize();

						if (comp.procHistPanelShowing) {
							if (comp.extProcSelInd != "") {
								var selectedProc = comp.hiTableObj.find('.result-info')[0];
								$(selectedProc).attr("data-proc-id", comp.externalProcHistory[0]["id"]);
								comp.extProcSelInd = selectedProc.getAttribute("id");
								CERN_PROCEDURE_CONSOLIDATED.handleHITableRowSelection(comp, selectedProc);
							}
						}

					}
					else {
						var errMsg = "Error in retriving external data";
						comp.hiTableObj.html(MP_Util.HandleErrorResponse("", errMsg));
					}
				} catch (err) {
					MP_Util.LogJSError(err, self, "consolidated-procedurehistory.js", "loadHIProceduresPage");
				}
				finally {
					comp.hiTableObj.find('.loading-screen').remove();
					comp.resizeComponent();

				}
			});
		},

		/**
		 * @param {object
		 *            passed by the framework file} component reference of
		 *            object from framework code.
		 */
		showHIData: function(component) {

			var hiProcTimer = new CapabilityTimer("CAP:MPG Display HealtheIntent Data");
			hiProcTimer.capture();

			this.processExtDataForRender(component);
			component.extProcSelInd = "";
			var compId = component.getComponentId();
			var historiesContainer = $("#hiTableContainer" + compId);

			var imgUrl = component.getCriterion().static_content + "/images/6965.png";
			imgUrl = "<span><img height='22' width='22' style='float:left' id='externalDataImg' src= '" + imgUrl + "'></span>";
			var label = "<br/><p id = 'externalDataLabel'>"
				+ imgUrl
				+ "<span style='margin-left:5px text-align:left;padding-left: 7px;font-weight: bold;'>"
				+ proc3I18n.HI_BTN_LBL_UPON_CLICK + "</span></p><br>";

			historiesContainer.append(label);
			label = "";
			component.m_externalProcDataTable = new ComponentTable();
			component.m_externalProcDataTable.setNamespace("hiDataConsProcHist" + compId);

			var nameColumn = new TableColumn();
			nameColumn.setColumnId("Procedure");
			nameColumn.setCustomClass("chx-hi-proc-name");
			nameColumn.setColumnDisplay(proc3I18n.PROCEDURE);
			nameColumn.setPrimarySortField("NAME_TEXT");
			nameColumn.setIsSortable(true);
			nameColumn.setRenderTemplate("${name}");

			var providerColumn = new TableColumn();
			providerColumn.setColumnId("Provider");
			providerColumn.setCustomClass("chx-hi-hide");
			providerColumn.setColumnDisplay(proc3I18n.PROVIDER);
			providerColumn.setPrimarySortField("PROVIDER");
			providerColumn.setIsSortable(true);
			providerColumn.setRenderTemplate("${most_recent_procedure.providers[0].name}");

			var onsetDateColumn = new TableColumn();
			onsetDateColumn.setColumnId("OnsetDate");
			onsetDateColumn.setCustomClass("chx-hi-hide");
			onsetDateColumn.setColumnDisplay(proc3I18n.PROCEDURE_DATE);
			onsetDateColumn.setPrimarySortField("OnsetDate");
			onsetDateColumn.setIsSortable(true);
			onsetDateColumn.setRenderTemplate("${ONSET_UTC}");

			component.m_externalProcDataTable.addColumn(nameColumn);
			component.m_externalProcDataTable.addColumn(providerColumn);
			component.m_externalProcDataTable.addColumn(onsetDateColumn);

			component.m_externalProcDataTable.bindData(component.externalProcHistory);
			var procedures = component.getProceduresRecordData().PROC;
			for (var i = 0; i < component.externalProcHistory.length; i++) {
				procedures.push(component.externalProcHistory[i]);
			}
			label += component.m_externalProcDataTable.render();

			if(component.hiMoreDataAvail && component.m_hiTotalResults && component.m_hiTotalResults > 20){
				var spinnerDiv = "<div id='spinner" + component.getComponentId() + "' style='position:relative'>";
				var self = this;
				var noOfPages = Math.ceil(component.m_hiTotalResults / 20);
				var lastPageNo = 0;
				var comp = component;
				this.pager = new MPageUI.Pager().setNumberPages(noOfPages).setCurrentPageLabelPattern("${currentPage}/${numberPages}")
					.setNextLabel(proc3I18n.NEXT + " >")
					.setPreviousLabel("< " + proc3I18n.PREV);
				this.pager.setOnPageChangeCallback(function() {

					MP_Util.LoadSpinner(comp.m_externalProcDataTable.getNamespace() + 'table');

					if (lastPageNo < arguments[0].currentPage) {
						self.pageIndex = self.pageIndex + 20;
					}
					else {
						self.pageIndex = this.pageIndex - 20;
					}
					self.loadHIProceduresPage(comp);
					lastPageNo = arguments[0].currentPage;
				});
				var pagerDiv = "<div id='procedureExtDataPager" + compId + "' class='chx-row-pager'>" + this.pager.render() + "</div>";
				historiesContainer.append(spinnerDiv + label + "</div>" + pagerDiv);
				this.pager.attachEvents();
			}
			else {
				historiesContainer.append(label);
			}
			$("#" + component.m_externalProcDataTable.getNamespace() + "tableBody").on(
				"click",
				".result-info",
				function(event) {
					CERN_PROCEDURE_CONSOLIDATED.onRowClick(component,
						this);
				});
			component.m_externalProcDataTable.finalize();
			component.hiTableObj = $('#' + component.m_externalProcDataTable.getNamespace() + 'table');

		},
		createSidePanelObj: createSidePanelObj,
		modifyProcedureDetails: modifyProcedureDetails,
		removeProcedureRow: removeProcedureRow,
		setProcPatientRequestDisplay: setProcPatientRequestDisplay,
		sortProcedure: sortProcedure,
		sortProceduresByPatientRequest: sortProceduresByPatientRequest,
		sortSecondaryProcedures: sortSecondaryProcedures
	};
}();

//end Procedure History with Surginet Procedure
