var CERN_SOCIAL_HISTORY_CONSOLIDATED = function() {
	var shxi18n = i18n.discernabu.consolidated_history;
	return {
		/** 
		* Processes the side panel content by iterating over all the DTA items for the selected row,
		* the logic will create the markup for each DTA item based on the default_result_type of that item.
		* if the default_result_type is Text, Freetext, Alpha and Freetext or Multi-alpha and Freetext the markup DTA item
		* will display in a row view within the side panel, otherwise it will display in a three column view.
		* @param  {Object} component the histories component object
		* @param  {Object} rowsDataArr selected rows array of objects
		* @return {String} returns the sidepanel content for the DTA items.
		**/
		processSidepanelContent: function(component, rowDataObj) {
			var markup = "";
			var self = CERN_SOCIAL_HISTORY_CONSOLIDATED;
			var compId = component.getComponentId();
			var longDtaTextItemsArr = [];
			var closeLastListElement = false;
			/*
				DTA result types that should be displayed over the entire width of the side panel
				1 - Text
				7 - Freetext
				21 - Alpha and Freetext
				22 -Multi-alpha and Freetext
			 */
			var dtaResultTypeArr = ["1","7","21","22"];
			var dtaResultType = null;
			if(!component.shxCodeArray){
				component.shxCodeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
			}
			component.shxSidePanel.setTitleText(rowDataObj.CATEGORY);
			var previousDtaItem = null;
			var shxDetailsCnt = (rowDataObj.SHX_DETAIL.length) ? rowDataObj.SHX_DETAIL[0].DETAIL_QUAL.length : 0;
			//Process all the short answers that go in the 3 column display
			for (var i = 0; i < shxDetailsCnt; i++) {
				//Reset the dta type
				dtaResultType = null;
				//Cache the current dta item
				var currentDtaItem = rowDataObj.SHX_DETAIL[0].DETAIL_QUAL[i];
				//Get the result type for the current dta
				dtaResultType = (currentDtaItem.DEFAULT_RESULT_TYPE) ? MP_Util.GetValueFromArray(currentDtaItem.DEFAULT_RESULT_TYPE, component.shxCodeArray) : null;
				//Long text item - Check if the current dta type has a result type of (text, alpa and freetext, freetext, multi alpha and freetext) and save it to be processed later
				if(dtaResultType && $.inArray(dtaResultType.MEANING,dtaResultTypeArr) !== -1){
					markup += (closeLastListElement) ? "</dl>" : "";
					markup += self.buildShxSidePanelItemMarkup(currentDtaItem.DETAIL_LABEL, currentDtaItem.DETAIL_RESPONSE, "row-view");
					continue;
				}
				/*
					Keep track of the previous item, if an item has more than one response create an additional response (dd) element for it
					otherwise its a new dta, create a new list item markup (dl) and a label (dt)
				 */
				//First DTA - No previous item is available
				if(!previousDtaItem){
					closeLastListElement = true;
					//Create markup for the list item and label
					markup += "<dl class='shx-side-panel-detail-item column-view'>";
					markup += "<dt class='shx-side-panel-description secondary-text label'>"+currentDtaItem.DETAIL_LABEL+"</dt>";
				}
				//New DTA
				else if (previousDtaItem.DETAIL_LABEL !== currentDtaItem.DETAIL_LABEL){
					//Close the previous list item and create a new one
					markup += "</dl><dl class='shx-side-panel-detail-item column-view'>";
					//Create the label markup
					markup += "<dt class='shx-side-panel-description secondary-text label'>"+currentDtaItem.DETAIL_LABEL+"</dt>";
				}
				//Create the response markup
				markup += "<dd class='shx-side-panel-description response'>" + currentDtaItem.DETAIL_RESPONSE + "</dd>";

				previousDtaItem = currentDtaItem;
			}
			//Close the last list element if needed
			markup += (closeLastListElement) ? "</dl>" : "";
			//process the comment
			var comments = rowDataObj.COMMENTS;
			var commentTxt = "";
			var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
			if (rowDataObj.COMMENT_CNT > 0) {
				var commentLen = comments.length;
				for (var x = 0; x < commentLen; x++) {
					var cmmtDate = df.formatISO8601(comments[x].COMMENT_DT, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
					commentTxt += cmmtDate + " - " + comments[x].COMMENT_PRSNL_NAME + " - " + comments[x].COMMENT_TXT + "<br />";
				}
			}
			markup += (commentTxt) ? self.buildShxSidePanelItemMarkup(i18n.COMMENTS + ":", commentTxt, "row-view") : "";
			return markup;
		},
		/**
		 * Renders the markup for the sidepanel whenever multiple rows are selected
		 * @param  {Object} component the histories component object
		 * @param  {Object} rowsDataArr selected rows array of objects
		 * @return {Undefined}             returns nothing.
		 * @TODO i18n fix this function with visuals
		 */
		renderMultiselectSidepanelContent: function(component, rowsDataArr) {
			var self = CERN_SOCIAL_HISTORY_CONSOLIDATED;
			try{
				var markup = "<div id='sidePanelScrollContainer" + component.getComponentId() + "' class='sp-body-content-area'>";
				var selectedRowsCnt = rowsDataArr.length;
				for(var i = 0; i < selectedRowsCnt; i++){
					var rowData = rowsDataArr[i];
					markup += self.buildShxSidePanelItemMarkup("",rowData.CATEGORY,"row-view");
					markup += "<div class='sp-separator'>&nbsp;</div>";
				}
				markup += "</div>";
				component.shxSidePanel.removeAlertBanner();
				component.shxSidePanel.setActionsAsHTML("");
				component.shxSidePanel.setTitleText(selectedRowsCnt + " " + shxi18n.ITEMS_SELECTED);
				//Validate multiselect
				var isMultiSelectionValid = self.validateMultiSelection(rowsDataArr);
				//Create the remove request button if the update privilage is set to 'yes'
				if(isMultiSelectionValid){
					if(component.shxUpdatePriv){
						self.createRemoveRequestButton(component,shxi18n.REMOVE_REQUEST+ " (" + selectedRowsCnt + ")");
						component.shxSidePanel.setActionsAsHTML(component.shxRemoveRequestsButton.render());
						component.shxRemoveRequestsButton.attachEvents();
					}
				}else{
					var invalidSelectionBanner = new MPageUI.AlertBanner();
					//Set the type of alert banner to be displayed
					invalidSelectionBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.INFO);
					//Set the secondary text for the alert banner
					invalidSelectionBanner.setSecondaryText(shxi18n.INVALID_SELECTION);
					//Render the alert banner into the side panel
					component.shxSidePanel.setAlertBannerAsHTML(invalidSelectionBanner.render());
				}
				component.shxSidePanel.setApplyBodyContentsPadding(true);
				component.shxSidePanel.setContents(markup,"tabContentsContainer" + component.getComponentId());
			}catch(err){
				self.displayShxErrorBanner(component);
				logger.logWarning(err);
			}
		},
		/**
		 * Process and build the side panel markup for a single selected patient entered data row
		 * @param  {Object} component  histories component object
		 * @param  {Object} rowDataObj selected row data object
		 * @return {String}            side panel content markup
		 */
		processPEDSidepanelContent: function(component,rowDataObj) {
			var markup = "";
			var self = CERN_SOCIAL_HISTORY_CONSOLIDATED;
			try{
				var updatedDt = new Date();
				var outsideRecordsDtDisplay = "--";
				if(rowDataObj.UPDT_DT_TM !== ""){
					updatedDt.setISO8601(rowDataObj.UPDT_DT_TM);
					outsideRecordsDtDisplay = updatedDt.format("mediumDate") + " " + updatedDt.format("militaryTime");
				}
				//Create the remove request button if the update privilage is set to 'yes'
				if(component.shxUpdatePriv){
					self.createRemoveRequestButton(component,shxi18n.REMOVE_REQUEST);
					component.shxSidePanel.setActionsAsHTML(component.shxRemoveRequestsButton.render());
					component.shxRemoveRequestsButton.attachEvents();
				}
				var sidePanelHTMLPed = '<dl>';
				sidePanelHTMLPed += 			'<dt class="chx-expand-content-section">';
				sidePanelHTMLPed +=					'<span class="chx-side-panel-tgl">';
				sidePanelHTMLPed += 				'<span class="chx-hide-expand-btn" title="' + shxi18n.COLLAPSE + '">&nbsp</span>';
				sidePanelHTMLPed += 				'<span class="chx-pat-req-icon">&nbsp</span><span>' + shxi18n.OUTSIDE_REQUESTS + '</span></span>';
				sidePanelHTMLPed += 				'<span class="chx-pull-right">';
				markup += self.buildShxSidePanelItemMarkup(shxi18n.ADDITION,shxi18n.ADD + " " + rowDataObj.CATEGORY,"row-view");
				markup += self.processSidepanelContent(component,rowDataObj);
				//The last 2 detail items should always be on their own row
				markup += "</br>";
				//Originating Author
				markup += self.buildShxSidePanelItemMarkup(shxi18n.ORIGINATING_AUTHOR + ":", rowDataObj.LAST_UPDATED_BY, "column-view");
				//Originating Source
				var submittedByType = "--";
				if(!component.shxCodeArray){
					component.shxCodeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
				}
				if (rowDataObj.INTEROP[0] && rowDataObj.INTEROP[0].SUBMITTED_BY_TYPE){
					submittedByType = MP_Util.GetValueFromArray(rowDataObj.INTEROP[0].SUBMITTED_BY_TYPE,component.shxCodeArray);
					if(submittedByType){
						submittedByType = submittedByType.display;
					}
				}
				markup += self.buildShxSidePanelItemMarkup(shxi18n.ORIGINATING_SOURCE + ":", submittedByType, "column-view");
				sidePanelHTMLPed += outsideRecordsDtDisplay + '</span></dt><dd><div class="chx-expand-content">' + markup + "</div></dd></dl>";
				return sidePanelHTMLPed;
			}
			catch(err){
				self.displayShxErrorBanner(component);
				logger.logWarning(err);
			}
		},
		/**
		 * Attach the events needed to be actionable in the side panel
		 * @param  {Object} component histories component objec
		 * @return {Undefined}           returns nothing
		 */
		attachOutsideRecordsEvent: function(component) {
			var sidePanelContainer = component.shxSidePanelContainer;
			//Toggle the Expand/Collapse icon within the Outside Request section
			sidePanelContainer.on('click', '.chx-side-panel-tgl', function() {
				var $patReqSubSection = sidePanelContainer.find('.chx-expand-content');
				var $outsideRecordsTarget = ($(this).find(".chx-hide-expand-btn").length) ? $(this).find(".chx-hide-expand-btn") : $(this).find(".chx-show-expand-btn");
				if ($patReqSubSection.hasClass('chx-section-closed')) {
					$outsideRecordsTarget.removeClass('chx-show-expand-btn')
						.addClass('chx-hide-expand-btn');
					$patReqSubSection.removeClass('chx-section-closed');
				}
				else {
					$outsideRecordsTarget.removeClass('chx-hide-expand-btn')
						.addClass('chx-show-expand-btn');
					$patReqSubSection.addClass('chx-section-closed');
				}
			});
		},
		/**
		 * Render the side panel content for a single selected row
		 * the logic will determine whether the content is patient entered data or millennium data
		 * @param  {Object} component  histories component object
		 * @param  {Object} rowDataObj selected row data object
		 * @return {Undefined}            returns nothing.
		 */
		renderSidePanelContent: function(component,rowDataObj) {
			var self = CERN_SOCIAL_HISTORY_CONSOLIDATED;
			var compId = component.getComponentId();
			var sidePanelContentHTML = "";
			var isPatientEnteredDataRow = false;
			var outsideRecordsClass= "";
			//Reset the actions html in the side panel
			component.shxSidePanel.setActionsAsHTML("");
			//Patient entered data row
			if(rowDataObj.IS_PED){
				isPatientEnteredDataRow = true;
				outsideRecordsClass = "shx-outside-records chx-sp-body-contents";
				component.shxSidePanel.setApplyBodyContentsPadding(false);
				sidePanelContentHTML += self.processPEDSidepanelContent(component,rowDataObj);
			}else{ //Millennium data row
				component.shxSidePanel.setApplyBodyContentsPadding(true);
				sidePanelContentHTML += self.processSidepanelContent(component,rowDataObj);
				//The last 3 detail items should always be on their own row
				sidePanelContentHTML += "</br>";
				//Last updated by
				sidePanelContentHTML += self.buildShxSidePanelItemMarkup(i18n.LAST_UPDATED_BY + ":", rowDataObj.LAST_UPDATED_BY, "column-view");
				//Last udpated date
				sidePanelContentHTML += self.buildShxSidePanelItemMarkup(i18n.LAST_UPDATED + ":", rowDataObj.LAST_UPDATED_DT, "column-view");
				//Last reviewed date
				sidePanelContentHTML += self.buildShxSidePanelItemMarkup(i18n.RCM_LAST_REVIEW_DATE + ":", rowDataObj.LAST_REVIEW_DATE, "column-view");
			}
			var markup = "<div id='sidePanelScrollContainer" + compId + "' class='"+ outsideRecordsClass +" sp-body-content-area'>";
			markup += sidePanelContentHTML;
			markup += "</div>";
			if(isPatientEnteredDataRow) {
				markup += "<div class='sp-separator'>&nbsp;</div>";
			}
			component.shxSidePanel.setContents(markup,"tabContentsContainer" + compId);

		},
		/**
		 * Builds the markup for a side panel item
		 * @param  {String} label       the DTA label to be displayed
		 * @param  {String} response    the DTA response to be displayed
		 * @param  {String} customClass custom class to apply to the DTA item (column-view or row-view)
		 * @return {String}             the side panel DTA item markup
		 */
		buildShxSidePanelItemMarkup: function(label, response, customClass) {
			var markup = "";
			//Only create the side panel item the response is not empty
			if(response !== ""){
				markup += "<dl class='shx-side-panel-detail-item " + (customClass || "") + "'>";
				markup += "<dt class='shx-side-panel-description secondary-text label'>" + label + "</dt>";
				markup += "<dd class='shx-side-panel-description response'>" + response + "</dd>";
				markup += "</dl>";
			}
			return markup;
		},
		/**
		 * toggles the side panel on and off
		 * @param  {Object} component histories component object
		 * @param  {Boolean} showPanel true if the panel should be displayed
		 *                             false if the panel should not be displayed
		 * @return {Undefined}
		 */
		toggleSidePanel: function(component, showPanel) {
			var compId = component.getComponentId();
			var $tabContainer = $("#tabContentsContainer" + compId).find(".chx-tabpage");
			if(showPanel){
				$tabContainer.addClass("shx-side-panel-open");
				//Set the height of the side panel to the new height of the table once the side panel displays
				var $tableContainer = $tabContainer.find(".shx-table");
				var tableHeight = ($tableContainer.length) ? $tableContainer.height() : 175;
				component.shxSidePanel.setHeight(tableHeight + "px");
				component.shxSidePanel.showPanel();
				component.shxSidePanel.setMinHeight(tableHeight + "px");
				component.shxSidePanel.resizePanel(component.calculateTabContainerMaxHeight("shx-table") + "px");
				component.shxSidePanel.expandSidePanel();
			}
			else{
				$tabContainer.removeClass("shx-side-panel-open");
				component.shxSidePanel.hidePanel();
				component.shxSidePanel.collapseSidePanel();
			}
		},
		/**
		 * processResultsForRender process the results returned from the backend
		 * @param  {object} component  contains data from the histories component
		 * @param  {object} recordData results to be processed
		 * @return {null}
		 */
		processResultsForRender: function(component, recordData) {
			var i = 0;
			var j = 0;
			var updatedPrsn = "";
			var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
			component.shxCodeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
			var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
			var updateDT = new Date();
			var socialCnt = (recordData && recordData.SOCIAL) ? recordData.SOCIAL.length : 0;
			var updatedTime = "";
			var requestTypeObj = null;
			var shxItem = null;
			//initialize the arrays that will contain the list of shx items for the table groups to be able to display them seperatly
			recordData.PATIENT_REQUESTS = [];
			recordData.CHART_SOCIAL_HISTORIES = [];
			for (i = 0; i < socialCnt; i++) {
				//cache social history item
				shxItem = recordData.SOCIAL[i];
				//initialize the last updated by field
				shxItem.LAST_UPDATED_BY = "--";
				shxItem.LAST_UPDATED_DT = "--";
				shxItem.LAST_REVIEW_DATE = "--";
				if (component.shouldDisplayPatientEnteredData()) {
					//set the request template
					var interopItem = shxItem.INTEROP[0];
					requestTypeObj = (interopItem && interopItem.REQUEST_TYPE) ? MP_Util.GetValueFromArray(interopItem.REQUEST_TYPE, component.shxCodeArray) : null;
					shxItem.SOCIAL_HISTORY_REQUEST_TEXT = (requestTypeObj) ? "<span>" + i18n.ADD + "</span>" : "<span>--</span>";
				}
				//set the category template
				shxItem.SOCIAL_HISTORY_CATEGORY_TEXT = "<span>" + shxItem.CATEGORY + "</span>";
				/* PARSE DETAILS */
				//get the update date time
				updatedTime = "";
				if (shxItem.UPDT_DT_TM !== "") {
					updateDT.setISO8601(shxItem.UPDT_DT_TM);
					updatedTime = df.format(updateDT, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
					shxItem.LAST_UPDATED_DT = updatedTime || "--";
					shxItem.LAST_REVIEW_DATE = updatedTime || "--";
				}
				//get the updating personnel name
				if (requestTypeObj) { //display author of patient request
					updatedPrsn = shxItem.INTEROP[0].SUBMITTED_BY_NAME;
				}
				else if (shxItem.UPDT_PRSNL_ID > 0) { //display personnel
					updatedPrsn = MP_Util.GetValueFromArray(shxItem.UPDT_PRSNL_ID, personnelArray).fullName;
				}
				shxItem.LAST_UPDATED_BY = updatedPrsn || "--";
				var detailsCnt = 0;
				/* PROCESS THE DETAILS */
				if (shxItem.SHX_DETAIL_CNT > 0) {
					shxItem.SOCIAL_HISTORY_DETAILS_TEXT = "";
					var shxDetail = shxItem.SHX_DETAIL[0];
					detailsCnt = shxDetail.DETAIL_QUAL.length;
					var detailItem = "";
					var detailsObj  = {};
					//iterate over the details and process them into a map of {labels : [responses]}
					for (j = 0; j < detailsCnt; j++) {
						detailItem = shxDetail.DETAIL_QUAL[j];
						detailsObj[detailItem.DETAIL_LABEL] = detailsObj[detailItem.DETAIL_LABEL] || [];
						detailsObj[detailItem.DETAIL_LABEL].push(detailItem.DETAIL_RESPONSE || "--");
					}
					var answersCnt = 0;
					//initialize the detail item variable before reusing it
					detailItem = "";
					//iterate over the object of processed details and generate the markup template
					$.each(detailsObj,function(key,value){
						//count the answers being processed
						answersCnt += 1;
						//add a colon to the label if it is a patient request
						var label = (requestTypeObj) ? key + ":" : key;
						//comma separate all the responses
						var response = (value.length) ? value.join(", ") : "--";
						detailItem = "<span class='chx-detail-lbl'>" + label + "</span><span class='chx-detail'>" + response + "</span>";
						if (answersCnt < 4) {//up to 4 answers will display in the table details column
							shxItem.SOCIAL_HISTORY_DETAILS_TEXT += detailItem;
						}
					});
				}
				else { //no details
					shxItem.SOCIAL_HISTORY_DETAILS_TEXT = "<span class='chx-detail-lbl'>--</span>";
				}
				//when view outside records is checked add the shxItem to the correct list either chart social histories or patient requests
				if (component.shouldDisplayPatientEnteredData()) {
					if (requestTypeObj) { //patient request
						shxItem.IS_PED = true;
						recordData.PATIENT_REQUESTS.push(shxItem);
					}
					else { //charted social history
						recordData.CHART_SOCIAL_HISTORIES.push(shxItem);
					}
				}
			}
		},
		/**
		 * processSelectedPEDShxForRemoval this function will process the selected social histories
		 * and prepare them for removal, it returns an array of strings to be used in the request string for
		 * the updateStatus strvice that is being called by removeRequests()
		 * @param {Object} component - the histories compnent object
		 * @return {Array} array of strings for the request for removal of the selected social histories
		 */
		processSelectedPEDShxForRemoval: function(component) {
			var self = CERN_SOCIAL_HISTORY_CONSOLIDATED;
			try {
				var removeShxArr = [];
				var selectedShx = component.getSocialHistoryCompTable().getSelection();
				var shxCnt = selectedShx.length;
				var codesArray = MP_Util.LoadCodeListJSON(component.shxRecordData.CODES);
				var statusCode = MP_Util.GetCodeByMeaning(codesArray, 'ACKNOWLEDGED').codeValue;
				var criterion = component.getCriterion();
				//iterate over all requests within each selected row
				for (var i = 0; i < shxCnt; i++) {
					var shx = selectedShx[i];
					var interopCnt = (shx.INTEROP) ? shx.INTEROP.length : 0;
					for (var j = 0; j < interopCnt; j++) {
						var patientRequest = shx.INTEROP[j];
						removeShxArr.push(
							'{"EXT_DATA_INFO_ID":' + patientRequest.EXT_DATA_INFO_ID + '.0' +
							',"STATUS_CODE":' + statusCode + '.0' +
							',"CHART_REFERENCE_ID": 0.0' +
							',"PERSONNEL_ID":' + criterion.provider_id + '.0' +
							',"ENCNTR_ID":' + criterion.encntr_id + '.0}'
						);
					}
				}
				return removeShxArr;
			} catch (err) {
				//display error message in side panel banner
				self.displayShxErrorBanner(component);
				logger.logWarning(err);
			}
		},
		/**
		 * displayShxErrorBanner  this function will create and display an error banner in the side panel
		 * whenever an error occurs in the social history tab
		 * @param  {Object} component histories component object
		 * @return {Undefined}
		 */
		displayShxErrorBanner: function(component) {
			//Clear any existing error banners
			component.shxSidePanel.removeAlertBanner();
			var alertBanner = new MPageUI.AlertBanner();
			//Set the type of alert banner to be displayed
			alertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
			//Set the secondary text for the alert banner
			alertBanner.setSecondaryText(shxi18n.REMOVE_PAT_REQUEST_ERROR_TEXT);
			//Render the alert banner into the side panel
			component.shxSidePanel.setAlertBannerAsHTML(alertBanner.render());
		},
		/**
		 * removePEDRequests will perform a script call to remove the selected patient requested social histories
		 * when the remove requests button is clicked
		 * @param  {Object} component histories component object
		 * @return {Undefined}
		 */
		removePEDRequests: function(component) {
			var self = CERN_SOCIAL_HISTORY_CONSOLIDATED;
			var shxItemsArr = [];
			//call the reconcile CAP timer
			var shxReconcileCAPTimer = new CapabilityTimer('CAP:MPG Social History Reconcile Patient Entered Data');
			shxReconcileCAPTimer.capture();
			//get the selected social histories
			shxItemsArr = self.processSelectedPEDShxForRemoval(component);
			var requestJson = '{"REQUESTIN":{"UPDATESTATUS":[' + shxItemsArr + "]}}";
			var scriptRequest = new ScriptRequest();
			scriptRequest.setProgramName("mp_exec_std_request");
			scriptRequest.setDataBlob(requestJson);
			scriptRequest.setRawDataIndicator(true);
			scriptRequest.setParameterArray(["^MINE^", "^^", 3202004, 3202004, 964756]);
			scriptRequest.setResponseHandler(function(scriptReply) {
				try {
					var responseData = JSON.parse(scriptReply.getResponse());
					//if sucess, render the component  to get the updates to social histories
					if (responseData.RECORD_DATA.STATUS.SUCCESS_INDICATOR === 1) {
						component.retrieveComponentData();
					}
					else {
						//display error message in side panel banner
						self.displayShxErrorBanner(component);
					}
				} catch (err) {
					//display error message in side panel banner
					self.displayShxErrorBanner(component);
					logger.logWarning(err);
				}
			});
			scriptRequest.performRequest();
		},
		/**
		 * Creates the remove request button to be displayed in the side panel
		 * @param  {Object} component histories component object
		 * @return {Undefined}           returns nothing.
		 */
		createRemoveRequestButton: function(component, label) {
			//Create the remove request button only if it was not already created
			if(!component.shxRemoveRequestsButton){
				var removeRequestsBtn = new MPageUI.Button();
				removeRequestsBtn.setLabel(label);
				removeRequestsBtn.setStyle(MPageUI.BUTTON_OPTIONS.STYLE.SECONDARY);
				removeRequestsBtn.setOnClickCallback(function() {
					//Do some action based on the removal requests
					CERN_SOCIAL_HISTORY_CONSOLIDATED.removePEDRequests(component);
				});
				//save a reference of the button so that we will be able to disable it when rows are being deselected
				component.shxRemoveRequestsButton = removeRequestsBtn;
			}
			else{//the button is already available clear the element cache
				component.shxRemoveRequestsButton.setLabel(label);
				component.shxRemoveRequestsButton.clearElementCache();
			}
		},
		/**
		 * Initializes the side panel
		 * @param  {Object} compoennt the histories component object
		 * @return {Undefined}
		 */
		initializeSidePanel: function(component) {
			var self = this;
			var historiesObj = component;
			var compId = component.getComponentId();
			var shxSidePanelId = "shxSidePanel" + compId;
			var $tableContainer = $("#chxSocHist" + compId + "table");
			var $tabContainer = $("#tabContentsContainer" + compId).find(".chx-tabpage");
			//height variables
			var minHeight = 175;
			var windowPadding = 60;
			var maxViewHeight = ($("#vwpBody").height() - windowPadding) + "px";
			var tableHeight = ($tableContainer.length) ? $tableContainer.height() : minHeight;
			var offsetHeight = $tabContainer.height() - tableHeight;
			//create a container for the side panel
			component.shxSidePanelContainer = $("#" + shxSidePanelId);
			//create the side panel object
			component.shxSidePanel = new CompSidePanel(compId, shxSidePanelId);

			if (!component.shxSidePanelContainer.length) {
				var shxSidePanelContainer = "<div id='" + shxSidePanelId + "' class='shx-side-panel'>&nbsp;</div>";
				$tabContainer.append(shxSidePanelContainer);
				component.shxSidePanelContainer = $("#shxSidePanel" + compId);
			}
			var sidePanelHTML = "<div id='sidePanelScrollContainer" + compId + "'><div id='shx" + compId + "sidePanelResultList' class='shx-side-panel-result-list'>";
			component.shxSidePanel.setExpandOption(component.shxSidePanel.expandOption.EXPAND_DOWN);
			component.shxSidePanel.setOffsetHeight(offsetHeight);
			component.shxSidePanel.setHeight(tableHeight + "px");
			component.shxSidePanel.setMinHeight(minHeight + "px");
			component.shxSidePanel.setMaxHeight(maxViewHeight);
			component.shxSidePanel.renderPreBuiltSidePanel();
			component.shxSidePanel.setActionsAsHTML("<div id='shxSidePanelActions" + compId + "' class='shx-sp-actions'></div>");
			component.shxSidePanel.setContents(sidePanelHTML, "tabContentsContainer" + compId);
			component.shxSidePanel.showCornerCloseButton();

			component.shxSidePanel.setCornerCloseFunction(function() {
				//hide the panel
				self.toggleSidePanel(historiesObj,false);
				//deselect all rows when closing the side panel
				historiesObj.getSocialHistoryCompTable().deselectAll();
			});

		},
		/**
		 * Validate the multi selection of rows in the table
		 * if one of the rows does not belong to the patient entered data group return false
		 * @param  {Array<Object>} selectionArr array of selected row objects
		 * @return {Boolean}              true if selection is valid, false otherwise
		 */
		validateMultiSelection: function(selectionArr){
			var isValid = true;
			var selectionCnt = selectionArr.length;
			for(var i=0; i<selectionCnt;i++){
				var rowData = selectionArr[i];
				if(!rowData.IS_PED){
					isValid = false;
					break;
				}
			}
			return isValid;
		},
		/**
		 * Add the event to navigate to the social history tab
		 * @param {object} component object
		 * @return {undefined}
		 */
		AddSocialHistoryLinkPED: function(component) {
			var secContent = component.getSectionContentNode();
			var socialHistoryLink = component.getSocialLink();
			// if the social hx link is enabled in bedrock set it as the link, else set the link to the Histories header link
			var historiesComoponentTabLink = socialHistoryLink ? socialHistoryLink : component.getLink();

			$(secContent).on("click", ".chx-shx-tab-link", function() {
				var criterion = component.getCriterion();
				var sParms = "/PERSONID=" + criterion.person_id + " /ENCNTRID=" + criterion.encntr_id + " /FIRSTTAB=^" + historiesComoponentTabLink + "^";
				APPLINK(0, criterion.executable, sParms);
			});
		},
		/**
		 * RenderComponent will render the markup of the social history tab
		 * @param {Object} component  the histories component object
		 * @param {Object} recordData json object with the social histories reply
		 */
		RenderComponent: function(component, recordData) {
			var self = CERN_SOCIAL_HISTORY_CONSOLIDATED;
			try{
				component.shxRecordData = recordData;
				var componentId = component.getComponentId();
				var patientReqCount = 0;
				var chartSocHistCount = (recordData) ? recordData.SOCIAL_CNT : 0;
				var socHistHtml = "";
				var unverifiedIcon = "";
				var columnArr = [];
				var dataObj = {};
				//Initial sort column id
				var sortByColumnId = "CATEGORY";
				//create the component table
				var socHistTable = new MPageUI.Table();
				//Set the select option for the table
				socHistTable.setOptions({
					select: MPageUI.TABLE_OPTIONS.SELECT.SINGLE_ROW,
					namespace: "shx-table"
				});
				//process charted social history results
				self.processResultsForRender(component, recordData);
				columnArr.push({
					id: "CATEGORY",
					label: i18n.CATEGORY,
					sortOptions: {
						primary: {
							field: "CATEGORY",
							direction: MPageUI.TABLE_OPTIONS.SORT.ASCENDING
						}
					},
					contents: function(data) {
						return data.SOCIAL_HISTORY_CATEGORY_TEXT;
					},
					css: "category-column"
				},
				{
					id: "DETAILS",
					label: i18n.DETAILS,
					contents: function(data) {
						return data.SOCIAL_HISTORY_DETAILS_TEXT;
					},
					css: "details-column"
				});
				//Create the request column only if there are patient requests
				if (component.shouldDisplayPatientEnteredData()) {
					dataObj = null;
					patientReqCount = (recordData && recordData.PATIENT_REQUESTS) ? recordData.PATIENT_REQUESTS.length : 0;
					//display the unverified icon only if there are no patient requests
					unverifiedIcon = (patientReqCount) ? "<span class='pat-req-icon table-grp-header'></span>" : "";
					//Cache the update privilege
					component.shxUpdatePriv = recordData.UPDATE_PRIV || 0;
					//Create 'Patient Requests' and 'Chart Social History' groups
					dataObj = {
						groups: [{
							id: "GROUP_PATIENT_REQUEST",
							css: "patient-req-group",
							label: unverifiedIcon + shxi18n.PATIENT_REQUESTS,
							showCount: true,
							expanded: true,
							collapsible: false,
							records: recordData.PATIENT_REQUESTS
						}, {
							css: "chart-group",
							id: "GROUP_CHART_SOCIAL_HISTORIES",
							label: shxi18n.CHART_SOCIAL_HISTORY,
							showCount: true,
							expanded: true,
							collapsible: false,
							records: recordData.CHART_SOCIAL_HISTORIES
						}]
					};
					//Create the request column only if there are patient requests
					if (patientReqCount) {
						columnArr = [];
						//Set the table select option when patient requests are displayed
						socHistTable.setOptions({
							select: MPageUI.TABLE_OPTIONS.SELECT.MULTI_ROW,
						});
						sortByColumnId = "REQUEST";
						//Create the request column
						columnArr.push(
						{
							id: "REQUEST",
							label: i18n.REQUEST,
							contents: function(data) {
								return data.SOCIAL_HISTORY_REQUEST_TEXT;
							},
							sortOptions: {
								primary: {
									field: "REQUEST",
									direction: MPageUI.TABLE_OPTIONS.SORT.ASCENDING
								},
								secondary: {
									field: "CATEGORY",
									direction: MPageUI.TABLE_OPTIONS.SORT.ASCENDING
								}
							},
							css: "request-column"
						},{
							id: "CATEGORY",
							label: i18n.CATEGORY,
							contents: function(data) {
								return data.SOCIAL_HISTORY_CATEGORY_TEXT;
							},
							css: "category-column"
						},
						{
							id: "DETAILS",
							label: i18n.DETAILS,
							contents: function(data) {
								return data.SOCIAL_HISTORY_DETAILS_TEXT;
							},
							css: "details-column"
						});
					}
					//cache the count of the charted social histories
					chartSocHistCount = recordData.CHART_SOCIAL_HISTORIES.length;
				}
				else{//Only Millennium data should be displayed
					//Set the millennium data to be displayed in the table
					dataObj = {
						records: recordData.SOCIAL
					};
				}
				//Set the table data
				socHistTable.setData(dataObj);
				//Create the columns
				socHistTable.setColumns(columnArr);
				//Initial sort by for the table when it is rendered should be primarily by the request column if patient requests are displayed
				//or by category if not.
				socHistTable.sortBy({
					column:{
						id: sortByColumnId,
						direction: MPageUI.TABLE_OPTIONS.SORT.ASCENDING
					}
				});
				//Set the on row click event
				socHistTable.setOnRowClickCallback(function(data){
					//Remove any existing alert banners in the side panel
					if(component.shxSidePanel){
						component.shxSidePanel.removeAlertBanner();
					}
					//Get all selected rows from the table
					var rowSelectionArr = this.getSelection();
					var selectionCnt = rowSelectionArr.length;
					
					switch (selectionCnt) {
						case 0:
							//No rows are selected
							this.deselectAll();
							//Close the side panel
							self.toggleSidePanel(component,false);
							break;
						case 1:
							self.renderSidePanelContent(component,rowSelectionArr[0]);
							self.toggleSidePanel(component,true);
							break;
						default:
							//More than 1 row is selected
							//Patient entered data is displayed - Multiselection is available
							if(component.shouldDisplayPatientEnteredData()) {
								self.renderMultiselectSidepanelContent(component,rowSelectionArr);
								//Open the side panel
								self.toggleSidePanel(component,true);
							}
							break;
					}
				});
				socHistHtml += socHistTable.render();
				//set the social history component table to the histories component
				// in order to finalize upon load and activate the over and sorting capabilites
				component.setSocialHistoryCompTable(socHistTable);
				component.loadTabData(chartSocHistCount, socHistHtml, component.HistoryComponentIndexObj.SOCIAL_HISTORY,  function() {
					if(component.shouldDisplayPatientEnteredData()){
						CERN_SOCIAL_HISTORY_CONSOLIDATED.AddSocialHistoryLinkPED(component);
					}
				}, patientReqCount);
			}
			catch(err) {
				logger.logWarning(err);
			}
		}
	};
}();
