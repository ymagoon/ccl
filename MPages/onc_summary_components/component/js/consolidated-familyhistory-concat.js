/* globals MP_Util,i18n,CERN_FAM_HISTORY_CONSOLIDATED_PED,CERN_FAM_HISTORY_CONSOLIDATED,logger, $ */

/**
 * @namespace CERN_FAM_HISTORY_CONSOLIDATED_PED
 * @static
 * @global
 * @type {{GetPatientPortalRecords, GetChartFamilyRecords, processSelectedPEDFhxForRemoval, displayFhxErrorBanner, AcknowledgeFamHistPatientRequest, AddFamilyHistoryLinkPED, GetPatientPortalBannerHtml, GetOtherChartFamilyHtml, GetPatientPortalFamilyHtml, GetPatientPortalConditionHtml, processDataPEDConditionView}}
 */
var CERN_FAM_HISTORY_CONSOLIDATED_PED = function () {
	var fhxi18n = i18n.discernabu.consolidated_history;
	return {
		/**
		 * Takes a list containing all family member records and returns only member containing patient portal data
		 * @param {JSON} familyRecords JSON containing family records (patient portal/chart data)
		 * @param {obj} component object
		 * @returns {Array} JSON Array containing patient portal records
		 */
		GetPatientPortalRecords: function (familyRecords, component) {
			try {
				//if patient entered data is enabled, trigger the family history PED load timer
				if (!component.PEDLoadCAPTimers.FAMILY_HISTORY_LOADED) {
					var fhLoadCAPTimer = new CapabilityTimer('CAP:MPG Histories_Family History Load Patient Entered Data');
					fhLoadCAPTimer.capture();
					component.PEDLoadCAPTimers.FAMILY_HISTORY_LOADED = true;
				}

				var ppRecords = [];
				var familyRecordCnt = familyRecords.length;
				for (var i = 0; i < familyRecordCnt; i++) {
					if (familyRecords[i].INTEROP.length > 0 && familyRecords[i].INTEROP[0].EXT_DATA_INFO_ID > 0) {
						ppRecords.push(familyRecords[i]);
					}
				}

				ppRecords.sort(function (a, b) {
					if (a.INTEROP[0].FAMILY_MEMBER.FAMILY_MEMBER.toUpperCase() < b.INTEROP[0].FAMILY_MEMBER.FAMILY_MEMBER.toUpperCase()) {
						return -1;
					}
					return 1;
				});

				return ppRecords;
			}
			catch (err) {
				logger.logJSError(err, this, "consolidated-familyhistory-ped.js", "GetPatientPortalRecords");
			}
		},
		/**
		 * Takes a list containing all family member records and returns only member containing chart data
		 * @param {JSON} familyRecords JSON containing family records (patient portal/chart data)
		 * @returns {Array} JSON Array containing chart records
		 */
		GetChartFamilyRecords: function (familyRecords) {
			try {
				var chartRecords = [];
				var familyRecordCnt = familyRecords.length;
				for (var i = 0; i < familyRecordCnt; i++) {
					if (familyRecords[i].INTEROP.length === 0) {
						chartRecords.push(familyRecords[i]);
					}
				}
				return chartRecords;
			}
			catch (err) {
				logger.logJSError(err, this, "consolidated-familyhistory-ped.js", "GetChartFamilyRecords");
			}
		},
		/**
		 * processSelectedPEDFhxForRemoval this function will process the selected family histories
		 * and prepare them for removal, it returns an array of strings to be used in the request string for
		 * the updateStatus strvice that is being called by removeRequests()
		 * @param {Object} component - the histories compnent object
		 * @returns {Array} array of strings for the request for removal of the selected family histories
		 */
		processSelectedPEDFhxForRemoval: function (component) {
			var self = CERN_FAM_HISTORY_CONSOLIDATED_PED;
			try {
				var removeFhxArr = [];
				var selectedFhx = component.famPatRequestArr;
				if (selectedFhx && selectedFhx.length) {
					var fhxCnt = selectedFhx.length;
					var recordData = component.getFamRecordData();
					var codesArray = MP_Util.LoadCodeListJSON(recordData.CODES);
					var statusCode = MP_Util.GetCodeByMeaning(codesArray, 'ACKNOWLEDGED').codeValue;
					var criterion = component.getCriterion();
					//iterate over all requests within each selected row
					for (var i = 0; i < fhxCnt; i++) {
						removeFhxArr.push(
							'{"EXT_DATA_INFO_ID":' + selectedFhx[i] + '.0' +
							',"STATUS_CODE":' + statusCode + '.0' +
							',"CHART_REFERENCE_ID": 0.0' +
							',"PERSONNEL_ID":' + criterion.provider_id + '.0' +
							',"ENCNTR_ID":' + criterion.encntr_id + '.0}'
						);
					}
				}
				return removeFhxArr;
			} catch (err) {
				logger.logJSError(err, this, "consolidated-familyhistory-ped.js", "processSelectedPEDFhxForRemoval");
				//display error message in side panel banner
				self.displayFhxErrorBanner(component);
			}
		},
		/**
		 * displayFhxErrorBanner  this function will create and display an error banner
		 * whenever an error occurs in the family history tab
		 * @param  {Object} component histories component object
		 * @returns {undefined} returns nothing
		 */
		displayFhxErrorBanner: function (component) {
			var $container = $("#fhxErrorBannerContainer" + component.getComponentId());
			$container.empty();
			var alertBanner = new MPageUI.AlertBanner();
			//Set the type of alert banner to be displayed
			alertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
			//Set the secondary text for the alert banner
			alertBanner.setSecondaryText(fhxi18n.REMOVE_PAT_REQUEST_ERROR_TEXT);
			//Render the alert banner into the container
			$container.append(alertBanner.render());
		},
		/**
		 * call the update status script to mark a patient request for family as acknowledged
		 * @param  {object} component object
		 * @returns {undefined} returns nothing
		 */
		AcknowledgeFamHistPatientRequest: function (component) {
			var self = this;

			//call the reconcile CAP timer
			try {
				//call the reconcile CAP timer
				var fhReconcileCAPTimer = new CapabilityTimer('CAP:MPG Histories_Family History Reconcile Patient Entered Data');
				fhReconcileCAPTimer.capture();
				var fhxItemsArr = self.processSelectedPEDFhxForRemoval(component);
				var requestJson = '{"REQUESTIN":{"UPDATESTATUS":[' + fhxItemsArr + "]}}";
				var scriptRequest = new ScriptRequest();
				scriptRequest.setProgramName("mp_exec_std_request");
				scriptRequest.setDataBlob(requestJson);
				scriptRequest.setRawDataIndicator(true);
				scriptRequest.setParameterArray(["^MINE^", "^^", 3202004, 3202004, 964756]);
				scriptRequest.setResponseHandler(function (scriptReply) {
					try {
						var responseData = JSON.parse(scriptReply.getResponse());
						//if sucess, render the component  to get the updates to social histories
						if (responseData.RECORD_DATA.STATUS.SUCCESS_INDICATOR === 1) {
							component.retrieveComponentData();
						}
						else {
							//display error message in side panel banner
							self.displayFhxErrorBanner(component);
						}
					} catch (err) {
						logger.logJSError(err, this, "consolidated-familyhistory-ped.js", "AcknowledgeFamHistPatientRequest");
						//display error message in side panel banner
						self.displayFhxErrorBanner(component);
					}
				});
				scriptRequest.performRequest();
			}
			catch (err) {
				logger.logJSError(err, self, "consolidated-familyhistory-ped.js", "AcknowledgeFamHistPatientRequest");
				//display error message in side panel banner
				self.displayFhxErrorBanner(component);
			}

		},
		/**
		 * Add the event to navigate to the family history tab
		 * @param {object} component object
		 * @returns {undefined} returns nothing
		 */
		AddFamilyHistoryLinkPED: function (component) {
			var secContent = component.getSectionContentNode();
			//Set the tab link
			var familyHistoryTabLink = component.getFamilyLink() ? component.getFamilyLink() : component.getLink();


			$(secContent).on("click", ".chx-fh-tab-link", function () {
				var criterion = component.getCriterion();
				var sParms = "/PERSONID=" + criterion.person_id + " /ENCNTRID=" + criterion.encntr_id + " /FIRSTTAB=^" + familyHistoryTabLink + "^";
				APPLINK(0, criterion.executable, sParms);
			});
		},
		/**
		 * @param {object} component - the histories compnent object
		 * @returns {String} HTML String representing the patient portal banner
		 */
		GetPatientPortalBannerHtml: function (component) {
			try {
				var self = this;
				var removeRequestsBtn = new MPageUI.Button();
				var fhxItemsArr = self.processSelectedPEDFhxForRemoval(component);
				var isRemoveReqDisabled = (fhxItemsArr && fhxItemsArr.length) ? false : true;

				removeRequestsBtn.setLabel(fhxi18n.REMOVE_REQUEST);
				removeRequestsBtn.setStyle(MPageUI.BUTTON_OPTIONS.STYLE.SECONDARY);
				removeRequestsBtn.setDisabled(isRemoveReqDisabled);
				removeRequestsBtn.setOnClickCallback(function () {
					//Do some action based on the removal requests
					CERN_FAM_HISTORY_CONSOLIDATED_PED.AcknowledgeFamHistPatientRequest(component);
				});

				//save a reference of the button so that we will be able to disable it when rows are being deselected
				component.fhxRemoveRequestsButton = removeRequestsBtn;

				//link will be dithered if Bedrock for tab is not defined
				var ditherFamilyHistoryTabLink = ((component.getFamilyLink() || component.getLink()) && CERN_Platform.inMillenniumContext()) ? false : true;
				if(!ditherFamilyHistoryTabLink) {
					//Add click events for navigation to family history tab
					CERN_FAM_HISTORY_CONSOLIDATED_PED.AddFamilyHistoryLinkPED(component);
				}
				var updateFamHistoryLink = component.createTabLink(fhxi18n.CLICK_HERE, ditherFamilyHistoryTabLink, "chx-fh-tab-link");
				var updateFamHistoryMessage = "<span>" + fhxi18n.UPDATE_FAMILY_HISTORY.replace(/\{0\}/g, updateFamHistoryLink) + "</span>";
				return "<div id='fhxErrorBannerContainer" + component.getComponentId() + "'></div><div class='chx-ack-banner-container'><span class='chx-ack-banner'>" + updateFamHistoryMessage + removeRequestsBtn.render() + "</span></div>";
			}
			catch (err) {
				logger.logJSError(err, this, "consolidated-familyhistory-ped.js", "GetPatientPortalBannerHtml");
			}
		},
		/**
		 * Process patient entered data, the data from Patient Portal will be processed into a format
		 * that can be used to insert data into a 3 column table along with Millennium data
		 *
		 * @param {Object} data Patient portal data
		 * @param {Object} component Family History component
		 * @returns {Array} pedTableDisplayList List which contains the data formatted into desired columns
		 */
		processDataPEDConditionView: function (data, component) {
			var pedTableDisplayList = [];

			try {
				if (data && data.length && component) {
					/**
					 * Object that holds the row entity for the PED
					 * @returns {{request: null, condition: null, familyMember: null}} Request, Patient Condition, Family Member details
					 * @constructor
					 */
					var GetPEDBaseDisplayObj = function () {
						return {
							request: null,
							condition: null,
							familyMember: null
						};
					};

					var patientPortalCnt = data.length;
					var recordData = component.getFamRecordData();
					var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
					var conditionName = "";
					var conditions = [];
					var currCondition = null;
					var conditionCnt = 0;
					var comments = null;
					var comment = "";
					var conditionHTML = "";
					var commentHTML = "";
					var familyMemberVal = "";
					var interopInfo = null;
					var requestTypeCode = null;
					var requestTypeDisplay = "";
					var portalId = 0;
					var i, j;

					for (i = 0; i < patientPortalCnt; i++) {
						var tempDisplayObj = null;
						conditionHTML = "";
						commentHTML = "";
						familyMemberVal = "";
						interopInfo = data[i].INTEROP[0];
						if (interopInfo) {
							tempDisplayObj = new GetPEDBaseDisplayObj();

							conditions = interopInfo.SELECTED_HEALTH_ISSUES;
							conditionCnt = conditions.length;
							familyMemberVal = interopInfo.FAMILY_MEMBER.FAMILY_MEMBER;
							portalId = interopInfo.EXT_DATA_INFO_ID;
							if (interopInfo.REQUEST_TYPE) {
								requestTypeCode = MP_Util.GetValueFromArray(interopInfo.REQUEST_TYPE, codeArray);
								requestTypeDisplay = requestTypeCode.display;
							}
							//Write the request type
							tempDisplayObj.request = (requestTypeDisplay || "--");

							//Data entry for the Conditions in PED. Prepare the Conditions and
							// comments separately and then write into the tempDisplayObj.condition
							for (j = 0; j < conditionCnt; j++) {
								currCondition = conditions[j];
								conditionName = currCondition.HEALTH_ISSUE;
								conditionHTML += "<div class='chx-fhx-item chx-info result-info'>" + conditionName + "</div>";
							}

							comments = interopInfo.COMMENTS;

							if (comments && comments.length) {
								comment = CERN_FAM_HISTORY_CONSOLIDATED.sanitizeComment(comments[0].COMMENT_TEXT) || "--";
								commentHTML = "<p>" + fhxi18n.PATIENT_COMMENT + ": " + comment + "</p>";
							}

							tempDisplayObj.condition = conditionHTML + "<div class='comment'>" + commentHTML + "</div>";

							//Write the Family member who have the conditions
							tempDisplayObj.familyMember = familyMemberVal;
							pedTableDisplayList.push(tempDisplayObj);
						}
					}
				}
				return pedTableDisplayList;
			}
			catch (err) {
				logger.logJSError(err, this, "consolidated-familyhistory-ped.js", "processDataPEDConditionView");
			}
		},
		/**
		 * TODO although this function is similar to the PED Condition View. When there is a change with how
		 * the data is processed for Family View/Condition View then either of these can be changed
		 * @param data {Object} Patient portal data
		 * @param component {Object} Family History component
		 * @returns pedTableDisplayList {Array} List which contains the data formatted into desired columns
		 */
		processDataPEDFamilyView: function (data, component) {
			var pedTableDisplayList = [];
			try {
				if (data && data.length && component) {
					/**
					 *
					 * @returns {{request: null, familyMember: null, condition: null}}
					 * @constructor
					 */
					var GetPEDBaseDisplayObj = function () {
						return {
							request: null,
							familyMember: null,
							condition: null
						};
					};

					var patientPortalCnt = data.length;
					var recordData = component.getFamRecordData();
					var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
					var conditionName = "";
					var conditions = [];
					var currCondition = null;
					var conditionCnt = 0;
					var comments = null;
					var comment = "";
					var conditionHTML = "";
					var commentHTML = "";
					var familyMemberVal = "";
					var interopInfo = null;
					var requestTypeCode = null;
					var requestTypeDisplay = "";
					var portalId = 0;
					var i, j;

					for (i = 0; i < patientPortalCnt; i++) {
						var tempDisplayObj = null;
						conditionHTML = "";
						commentHTML = "";
						familyMemberVal = "";
						interopInfo = data[i].INTEROP[0];
						if (interopInfo) {
							tempDisplayObj = new GetPEDBaseDisplayObj();

							conditions = interopInfo.SELECTED_HEALTH_ISSUES;
							conditionCnt = conditions.length;
							familyMemberVal = interopInfo.FAMILY_MEMBER.FAMILY_MEMBER;
							portalId = interopInfo.EXT_DATA_INFO_ID;
							if (interopInfo.REQUEST_TYPE) {
								requestTypeCode = MP_Util.GetValueFromArray(interopInfo.REQUEST_TYPE, codeArray);
								requestTypeDisplay = requestTypeCode.display;
							}
							tempDisplayObj.request = (requestTypeDisplay || "--");
							for (j = 0; j < conditionCnt; j++) {
								currCondition = conditions[j];
								conditionName = currCondition.HEALTH_ISSUE;
								conditionHTML += "<div class='chx-fhx-item chx-info result-info'>" + conditionName + "</div>";
							}

							comments = interopInfo.COMMENTS;

							if (comments && comments.length) {
								comment = CERN_FAM_HISTORY_CONSOLIDATED.sanitizeComment(comments[0].COMMENT_TEXT) || "--";
								commentHTML = "<p>" + fhxi18n.PATIENT_COMMENT + ": " + comment + "</p>";
							}
							tempDisplayObj.familyMember = familyMemberVal;
							tempDisplayObj.condition = conditionHTML + "<div class='comment'>" + commentHTML + "</div>";

							pedTableDisplayList.push(tempDisplayObj);
						}
					}
				}
				return pedTableDisplayList;
			}
			catch (err) {
				logger.logJSError(err, this, "consolidated-familyhistory-ped.js", "processDataPEDFamilyView");
			}
		}
	};
}();/* globals MP_Util,i18n,CERN_FAM_HISTORY_CONSOLIDATED_PED,logger,MPageUI,$,CompSidePanel */

/**
 * Family History methods - Includes the functions that will be used to
 * render data related to conditions in the family and/or data from the patient portal
 * @namespace CERN_FAM_HISTORY_CONSOLIDATED
 * @static
 * @global
 */
var CERN_FAM_HISTORY_CONSOLIDATED = function () {
	var fhxi18n = i18n.discernabu.consolidated_history;
	var stdStringSeparator = " - ";

	return {
		/**
		 * Resizes the component - Table and sidepanel wrt to the height available
		 * @param {Object} component Histories component data
		 * @returns {undefined} returns nothing
		 */
		resizeComponent: function (component) {
			if (!component) {
				return;
			}
			if (component.famHxTable) {
				var famHxTable = component.famHxTable;
				var famHxSP = component.famHxSidePanel;

				famHxTable.clearElementCache();
				famHxTable.setMaxHeight(CERN_FAM_HISTORY_CONSOLIDATED.computeTableHeight(component));
				//Resize sidepanel if present
				if (famHxSP) {
					famHxSP.m_sidePanel.setHeight($("#" + famHxTable.getId()).height() + "px");
					famHxSP.m_sidePanel.resizePanel();
				}
			}
		},
		/**
		 * Renders component by Family View, uses MPageUI table and sidepanel
		 * When PED checkbox is enabled, it shows the portal information
		 * @param {Object} component Histories component object
		 */
		RenderComponentByFamily: function (component) {
			var recordData = component.getFamRecordData();
			var compId = component.getComponentId();
			var famHxNS = "wf-consol-hx-famHx";

			var jsFamHTML = [];
			var fhxSummary;
			var summaryLabel;
			var patientPortalRecords = [];
			var shouldDisplayPatientEnteredData;
			var chartRecords;
			var famHxTable = new MPageUI.Table();
			var tableHTML = "";
			var processedPortalData = null;
			var familyRecordsLen;
			var patientRequestCount = 0;

			if (!component.famPatRequestArr) {
				component.famPatRequestArr = [];
			}

			//Reset the sidepanel
			component.famHxSidePanel = null;

			//Process summary label before rendering the table
			fhxSummary = CERN_FAM_HISTORY_CONSOLIDATED.processSummaryLabel(recordData);

			summaryLabel = "<span class='res-none'>" + fhxSummary + "</span>";
			chartRecords = CERN_FAM_HISTORY_CONSOLIDATED_PED.GetChartFamilyRecords(recordData.FAMILIES);
			shouldDisplayPatientEnteredData = component.shouldDisplayPatientEnteredData();
			if (shouldDisplayPatientEnteredData) {
				if (component.fhxRemoveRequestsButton) {
					component.fhxRemoveRequestsButton.clearElementCache();
				}
				patientPortalRecords = CERN_FAM_HISTORY_CONSOLIDATED_PED.GetPatientPortalRecords(recordData.FAMILIES, component);
				if (patientPortalRecords && patientPortalRecords.length) {
					patientRequestCount = patientPortalRecords.length;
				}
			}

			familyRecordsLen = chartRecords.length;

			if (familyRecordsLen === 0 && !shouldDisplayPatientEnteredData) {
				jsFamHTML.push(summaryLabel);
				//Append the No Results Found message
				jsFamHTML.push("<span class='res-none'>" + i18n.discernabu.NO_RESULTS_FOUND + "</span>");
			}
			else {
				//Summary label is pushed into the HTML to be shown above the MPageUI Table
				if (fhxSummary) {
					jsFamHTML.push('<div class="chx-menu">', summaryLabel, '</div>');
				}

				// Once the Patient Summary has been decided to display we need to show the Banner for the PED actionability
				if (shouldDisplayPatientEnteredData && recordData.UPDATE_FAM_HIST_PRIV) {
					jsFamHTML.push(CERN_FAM_HISTORY_CONSOLIDATED_PED.GetPatientPortalBannerHtml(component));
				}

				if (familyRecordsLen || patientRequestCount) {
					//Load the component table based on the PED display flag
					//If the flag is enabled then Switch on the 3 column component table
					// else render the normal component table with 2 columns
					if (shouldDisplayPatientEnteredData) {
						processedPortalData = CERN_FAM_HISTORY_CONSOLIDATED_PED.processDataPEDFamilyView(patientPortalRecords, component);
					}

					CERN_FAM_HISTORY_CONSOLIDATED.processDataFamilyView(recordData, chartRecords, component);

					tableHTML = CERN_FAM_HISTORY_CONSOLIDATED.prepareFamilyViewTable(famHxTable, chartRecords, processedPortalData, shouldDisplayPatientEnteredData, component);
					jsFamHTML.push(tableHTML);

					//Push the sidepanel placeholder
					jsFamHTML.push("<div id='famHxSidePanelContainer" + compId + "' class='" + famHxNS + "-sp-container'></div>");

				}
				else {
					jsFamHTML.push("<span class='res-none'>" + i18n.discernabu.NO_RESULTS_FOUND + "</span>");
				}
			}
			component.famHxMillCount = familyRecordsLen;
			component.famHxPEDCount = patientRequestCount;

			component.famHxNamespace = famHxNS;

			component.loadTabData(familyRecordsLen, jsFamHTML.join(""), component.HistoryComponentIndexObj.FAMILY_HISTORY, function () {
				//Update the tab count
				var tabControlObj = component.m_tabControl;
				var historiesTabsArray = tabControlObj.getTabs();
				var currentFamHxTableId = famHxTable.getId();

				tabControlObj.updateCountOnTab(historiesTabsArray[component.HistoryComponentIndexObj.FAMILY_HISTORY], component.famHxMillCount + component.famHxPEDCount);

				//Since we have stored the Condition view instance of the table
				//We need to nullify that so that we can store the Family View table instance
				if (component.famHxTable && (currentFamHxTableId !== component.famHxTable.getId())) {
					component.famHxTable = null;
				}

				//If family history is the first tab then we dont want both the framework refresh and load refresh to trigger the attachEvents
				if (tableHTML) {
					component.famHxTable = famHxTable;
					CERN_FAM_HISTORY_CONSOLIDATED.resizeComponent(component);
					famHxTable.attachEvents();
				}

				if(component.shouldDisplayPatientEnteredData()){
					CERN_FAM_HISTORY_CONSOLIDATED_PED.AddFamilyHistoryLinkPED(component);
				}
			}, patientRequestCount);

		},
		/**
		 * Renders component by Condition View, its the default view which uses MPageUI table and sidepanel
		 * When PED checkbox is enabled, it shows the portal information
		 * @param {Object} component Histories component object
		 */
		RenderComponentByCondition: function (component) {
			var recordData = component.getFamRecordData();
			var compId = component.getComponentId();
			var famHxNS = "wf-consol-hx-famHx";

			var jsFamHTML = [];
			var fhxSummary;
			var patientPortalRecords = [];
			var patientRequestCount = 0;
			var summaryLabel;
			var shouldDisplayPatientEnteredData;
			var famHxTable = new MPageUI.Table();
			var tableHTML = "";
			var processedPortalData = null;

			//If already defined then use it else define the array
			if (!component.famPatRequestArr) {
				component.famPatRequestArr = [];
			}

			//Reset the sidepanel
			component.famHxSidePanel = null;

			//Process summary label before rendering the table
			fhxSummary = CERN_FAM_HISTORY_CONSOLIDATED.processSummaryLabel(recordData);

			summaryLabel = "<span class='res-none'>" + fhxSummary + "</span>";
			shouldDisplayPatientEnteredData = component.shouldDisplayPatientEnteredData();

			//If PED checkbox is checked
			if (shouldDisplayPatientEnteredData) {
				//If all records are acknowledged and tab refreshed disable the banner button
				if (component.fhxRemoveRequestsButton) {
					component.fhxRemoveRequestsButton.clearElementCache();
				}
				patientPortalRecords = CERN_FAM_HISTORY_CONSOLIDATED_PED.GetPatientPortalRecords(recordData.FAMILIES, component);
				if (patientPortalRecords && patientPortalRecords.length) {
					patientRequestCount = patientPortalRecords.length;
				}
			}

			var conditionsLen = recordData.CONDITION_CNT;
			if (conditionsLen === 0 && !shouldDisplayPatientEnteredData) {
				jsFamHTML.push(summaryLabel);
				//Append the No Results Found message
				jsFamHTML.push("<span class='res-none'>" + i18n.discernabu.NO_RESULTS_FOUND + "</span>");
			}
			else {
				//Summary label is pushed into the HTML to be shown above the MPageUI Table
				if (fhxSummary) {
					jsFamHTML.push('<div class="chx-menu">', summaryLabel, '</div>');
				}

				// Once the Patient Summary has been decided to display we need to show the Banner for the PED actionability
				//TODO Remove this once the side panel is ready
				if (shouldDisplayPatientEnteredData && recordData.UPDATE_FAM_HIST_PRIV) {
					jsFamHTML.push(CERN_FAM_HISTORY_CONSOLIDATED_PED.GetPatientPortalBannerHtml(component));
				}

				if (conditionsLen || patientRequestCount) {
					//Load the component table based on the PED display flag
					//If the flag is enabled then Switch on the 3 column component table
					// else render the normal component table with 2 columns
					if (shouldDisplayPatientEnteredData) {
						processedPortalData = CERN_FAM_HISTORY_CONSOLIDATED_PED.processDataPEDConditionView(patientPortalRecords, component);
					}

					CERN_FAM_HISTORY_CONSOLIDATED.processDataCondView(recordData, conditionsLen, component);

					tableHTML = CERN_FAM_HISTORY_CONSOLIDATED.prepareConditionViewTable(famHxTable, recordData, processedPortalData, shouldDisplayPatientEnteredData, component);
					jsFamHTML.push(tableHTML);

					//Push the sidepanel placeholder
					jsFamHTML.push("<div id='famHxSidePanelContainer" + compId + "' class='" + famHxNS + "-sp-container'></div>");
				}
				else {
					jsFamHTML.push("<span class='res-none'>" + i18n.discernabu.NO_RESULTS_FOUND + "</span>");
				}
			}

			component.famHxMillCount = conditionsLen;
			component.famHxPEDCount = patientRequestCount;

			//Set the namespace for the component
			component.famHxNamespace = famHxNS;

			component.loadTabData(conditionsLen, jsFamHTML.join(""), component.HistoryComponentIndexObj.FAMILY_HISTORY, function () {
				//Store the user update priv for later use
				component.UPDATE_FAM_HIST_PRIV = recordData.UPDATE_FAM_HIST_PRIV;

				//Update the tab count
				var tabControlObj = component.m_tabControl;
				var historiesTabsArray = tabControlObj.getTabs();
				tabControlObj.updateCountOnTab(historiesTabsArray[component.HistoryComponentIndexObj.FAMILY_HISTORY], component.famHxMillCount + component.famHxPEDCount);

				//If family history is the first tab then we dont want both the framework refresh and load refresh to trigger the attachEvents
				if (tableHTML) {
					component.famHxTable = famHxTable;
					CERN_FAM_HISTORY_CONSOLIDATED.resizeComponent(component);
					famHxTable.attachEvents();
				}
				if(component.shouldDisplayPatientEnteredData()){
					CERN_FAM_HISTORY_CONSOLIDATED_PED.AddFamilyHistoryLinkPED(component);
				}
			}, patientRequestCount);
		},
		/**
		 * Processes the summary label which goes before the banner and the table
		 * Details about the patient - Adopted, Unknown etc is displayed here
		 * @param {Object} recordData Family history data returned from the backend
		 * @returns {string} fhxSummary Consists of all the summary information about the patient
		 */
		processSummaryLabel: function (recordData) {
			var fhxSummary = "";
			var fhxSummaryInd = "";
			var allHistNeg = "";
			try {
				if (recordData) {
					if (recordData.PATIENT_ADOPTED_IND === 1) {
						fhxSummary = fhxi18n.ADOPTED;
					}
					//all documented histories are negative
					if (recordData.HIST_NEG_IND === 1) {
						allHistNeg = fhxi18n.FAMILY_HISTORY_NEGATIVE;
					}
					//negative checkbox selected
					if (recordData.NEGATIVE_IND === 1) {
						fhxSummaryInd = fhxi18n.FAMILY_HISTORY_NEGATIVE;
					}
					else if (recordData.UNKNOWN_IND === 1) {
						fhxSummaryInd = fhxi18n.FAMILY_HISTORY_UNKNOWN;
					}
					else if (recordData.UNABLE_TO_OBTAIN_IND === 1) {
						fhxSummaryInd = fhxi18n.UNABLE_TO_OBTAIN;
					}

					if (fhxSummaryInd !== "" && recordData.CONDITION_CNT === 0) {
						if (fhxSummary === "") {
							fhxSummary = fhxSummaryInd;
						}
						else {
							fhxSummary += "; " + fhxSummaryInd;
						}
					}

					if (allHistNeg !== "" && recordData.CONDITION_CNT === 0) {
						if (fhxSummary === "") {
							fhxSummary = allHistNeg;
						}
						else {
							fhxSummary += "; " + allHistNeg;
						}
					}
				}
			}
			catch (err) {
				logger.logJSError(err, this, "consolidated-familyhistory.js", "processSummaryLabel");
			}
			return fhxSummary;
		},
		/**
		 * Process millennium data for showing in a table for Condition View
		 * @param {Object} recordData Object containing Family Hx millennium data
		 * @param {Number} conditionCount Number of conditions present
		 * @param {Object} component Family History Object
		 * @returns {undefined} returns nothing
		 */
		processDataCondView: function (recordData, conditionCount, component) {
			try {
				var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
				var compId = component.getComponentId();

				/**
				 * Prepares each cell data that needs to be shown in the table row - Conditions
				 * This includes each family member who have that condition and what Age or health status they currently are in
				 * @param {Object} condition Object containing the information about the family members having this condition
				 * @returns {undefined} returns nothing
				 */
				var prepareTableFamilyCellData = function (condition) {
					try {
						var i = 0;
						if (condition && condition.FAMILY) {
							//Request column value, this will be shown
							// once the PED is enabled which will introduce another column REQUEST
							condition.REQUEST = "--";
							var familyLen = condition.FAMILY.length;
							var familyDetailsHTML = "";
							var commentHTML = "";
							var familyListingHTML = "";
							var memberDisplay = "";
							var detailInfo = "";
							var codeObj = "";
							var sanitizedComment = "";

							/**
							 * Base object to hold the sidepanel additional details for the row in the Condition View
							 * @return {{FAMILY_MEMBER: null, DECEASED_INFO: null, DECEASED_DETAILS: null, ONSET_INFO: null, ONSET_DATE: null, COMMENTS: Array, LIFECYCLE: null, SEVERITY: null, COURSE: null, LAST_REVIEWED: null}}
							 * @constructor
							 */
							var SidepanelRenderDetailsObj = function () {
								return {
									FAMILY_MEMBER: null,
									DECEASED_INFO: null,
									DECEASED_DETAILS: null,
									ONSET_DATE: null,
									COMMENTS: [],
									FULL_NAME: null,
									LIFECYCLE: null,
									SEVERITY: null,
									COURSE: null,
									LAST_REVIEWED: null
								};
							};

							for (i = 0; i < familyLen; i++) {
								var sidepanelObj = new SidepanelRenderDetailsObj();

								var family = condition.FAMILY[i];
								var memberOnsetAge = "";
								if (family.MEMBER) {
									if (family.ONSET_AGE) {
										if (family.ONSET_AGE_PRECISION) {
											memberOnsetAge = family.ONSET_AGE_PRECISION + " " + CERN_FAM_HISTORY_CONSOLIDATED.getAgePhrase(family.ONSET_AGE, family.ONSET_AGEUNIT, 1);
										}
										else {
											memberOnsetAge = fhxi18n.AT_AGE + " " + CERN_FAM_HISTORY_CONSOLIDATED.getAgePhrase(family.ONSET_AGE, family.ONSET_AGEUNIT, 1);
										}
									}
									else if (family.ONSET_AGE_PRECISION && family.ONSET_AGE_PRECISION.toUpperCase() === "UNKNOWN") {
										memberOnsetAge = family.ONSET_AGE_PRECISION;
									}

									detailInfo = memberOnsetAge ? " (" + memberOnsetAge + ")" : "";
									codeObj = MP_Util.GetValueFromArray(family.MEMBER, codeArray);
									memberDisplay = codeObj.display;
									sidepanelObj.FAMILY_MEMBER = memberDisplay;
									sidepanelObj.ONSET_DATE = memberOnsetAge ? "(" + fhxi18n.ONSET + stdStringSeparator + memberOnsetAge + ")" : "";

									codeObj = MP_Util.GetValueFromArray(family.DECEASED_CD, codeArray);

									if (codeObj && codeObj.meaning === "YES") {
										var deceased_details = family.DECEASED_DESP ? family.DECEASED_DESP : "";
										var deceased_age_details = "";
										if (family.DECEASED_AGE) {
											deceased_age_details = CERN_FAM_HISTORY_CONSOLIDATED.getDeceasedPrecisionFlag(family.DECEASED_AGE_PREC_FLAG) + " " + CERN_FAM_HISTORY_CONSOLIDATED.getAgePhrase(family.DECEASED_AGE, family.DECEASED_AGEUNIT, 1);
										}
										else if (family.DECEASED_AGE_PREC_FLAG === 0) {
											deceased_age_details = fhxi18n.AT_AGE + " " + CERN_FAM_HISTORY_CONSOLIDATED.getDeceasedPrecisionFlag(family.DECEASED_AGE_PREC_FLAG);
										}

										sidepanelObj.DECEASED_INFO = stdStringSeparator + fhxi18n.DECEASED;
										if (deceased_details && deceased_age_details) {
											sidepanelObj.DECEASED_DETAILS = "(" + deceased_details + stdStringSeparator + deceased_age_details + ")";
										}
										else if (deceased_details || deceased_age_details) {
											sidepanelObj.DECEASED_DETAILS = "(" + (deceased_details || deceased_age_details) + ")";
										}

										detailInfo += stdStringSeparator + fhxi18n.DECEASED;
									}

									//Push the family html
									familyListingHTML += "<div id='condView" + compId + "Item" + i + "' class='chx-fhx-item chx-info result-info'>" + memberDisplay + "<span class='secondary-text'>" + detailInfo + "</span></div>";

									if (family.NAMEFIRST || family.NAMELAST) {
										sidepanelObj.FULL_NAME = (family.NAMEFIRST || "") + " " + (family.NAMELAST || "");
									}

									sidepanelObj.LIFECYCLE = family.LIFECYCLE ? family.LIFECYCLE : null;
									sidepanelObj.SEVERITY = family.SEVERITY ? family.SEVERITY : null;
									sidepanelObj.COURSE = family.COURSE ? family.COURSE : null;

									sidepanelObj.LAST_REVIEWED = family.LASTREVIEWED ? CERN_FAM_HISTORY_CONSOLIDATED.formatDate(family.LASTREVIEWED) : null;

									if (family.COMMENTS && family.COMMENTS.length) {
										sanitizedComment = CERN_FAM_HISTORY_CONSOLIDATED.sanitizeComment(family.COMMENTS[0].COMMENT_TEXT);

										sidepanelObj.COMMENTS = family.COMMENTS;

										if (!commentHTML) {
											commentHTML = "<div class='comment'>";
										}
										commentHTML += "<p class='fhx-comment' title='" + family.COMMENTS[0].COMMENT_TEXT + "'>" + memberDisplay + ": " + sanitizedComment + "</p>";
									}

									if (!condition.SP_RENDER_DETAILS) {
										condition.SP_RENDER_DETAILS = [];
									}
									condition.SP_RENDER_DETAILS.push(sidepanelObj);
								}
							}

							//Push the items into an Object so its conveniently displayed in the table
							familyDetailsHTML += familyListingHTML + commentHTML + "</div>";

							if (familyDetailsHTML) {
								//Store the family condition details
								condition.FAM_COND_DETAILS = familyDetailsHTML;
							}
						}
					}
					catch (err) {
						logger.logJSError(err, this, "consolidated-familyhistory.js", "prepareTableFamilyCellData");
					}
				};

				if (recordData) {
					var condition = "";
					var group = "";
					var groupNames = recordData.GroupNames || [];
					var i = 0, j = 0;
					var isNullGroupInitialized = false;
					if (!recordData.Groups) {
						recordData.Groups = {};
						var gLen = 0;
						var otherConditionsGroupName = fhxi18n.OTHER_CONDITIONS;
						for (i = 0; i < conditionCount; i++) {
							condition = recordData.CONDITIONS[i];
							gLen = condition.CATEGORY_CNT;
							if (gLen) {
								for (j = 0; j < gLen; j++) {
									group = condition.CATEGORIES[j].CATEGORY;
									if (!recordData.Groups.hasOwnProperty(group)) {
										recordData.Groups[group] = {
											"conditions": [],
											"name": group
										};
										groupNames.push(group);
									}
									prepareTableFamilyCellData(condition);
									recordData.Groups[group].conditions.push(condition);
								}
							}
							else {
								if (!recordData.Groups.hasOwnProperty(otherConditionsGroupName)) {
									recordData.Groups[otherConditionsGroupName] = {
										"conditions": [],
										"name": otherConditionsGroupName
									};
									isNullGroupInitialized = true;
								}
								prepareTableFamilyCellData(condition);
								recordData.Groups[otherConditionsGroupName].conditions.push(condition);
							}
						}
						// Sort groups for rendering in the table
						groupNames.sort(function (a, b) {
							if (a.toUpperCase() < b.toUpperCase()) {
								return -1;
							}
							return 1;
						});
						//Attach the other conditions group at the end
						if (isNullGroupInitialized) {
							groupNames.push(otherConditionsGroupName);
						}
						//Add the group names to the recordData
						recordData.GroupNames = groupNames;
					}
				}
			}
			catch (err) {
				logger.logJSError(err, this, "consolidated-familyhistory.js", "processDataCondView");
			}
		},
		/**
		 * Process millennium data for showing in a table for Family View
		 * @param {Object} recordData Object containing Family Hx millennium data
		 * @param {Object} familyMemberDetails Chart records wrt to the patient
		 * @param {Object} component Family History Object
		 * @returns {undefined} returns nothing
		 */
		processDataFamilyView: function (recordData, familyMemberDetails, component) {
			try {
				var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
				var compId = component.getComponentId();
				var i, j;
				var commentHTML = "";
				var currFamilyMemDetail;
				var conditionLen;
				var famMemAddtnDetails;
				var famMemberDisplay;
				var familyListingHTML = "";
				var reusableCodeValObj = null;

				//For processing conditions
				var conditionsObj;
				var onsetInfo;
				var conditionsHTML;
				var conditionsCellHTML;
				var sanitizedComment = "";
				/**
				 * Base object to hold the sidepanel additional details for the row in the Family View
				 * @return {{CONDITION: null, ONSET_DATE: null, COMMENTS: Array, LIFECYCLE: null, SEVERITY: null, COURSE: null, LAST_REVIEWED: null}}
				 * @constructor
				 */
				var SidepanelRenderDetailsObj = function () {
					return {
						CONDITION: null,
						ONSET_DATE: null,
						COMMENTS: [],
						LIFECYCLE: null,
						SEVERITY: null,
						COURSE: null,
						LAST_REVIEWED: null
					};
				};

				if (familyMemberDetails) {
					for (i = 0; i < familyMemberDetails.length; i++) {
						//Initialize all the primary table cell data elements
						commentHTML = "";
						currFamilyMemDetail = familyMemberDetails[i];

						//Reset sidepanel objects/arrays
						currFamilyMemDetail.SP_RENDER_MEMBER_DISPLAY_HEADER = null;
						currFamilyMemDetail.SP_RENDER_MEMBER_DISPLAY_SUBHEADER = null;
						currFamilyMemDetail.SP_RENDER_MEMBER_DISPLAY_SUBHEADER_NAME = null;
						currFamilyMemDetail.SP_RENDER_DETAILS = [];

						conditionLen = currFamilyMemDetail.COND_CNT;
						famMemAddtnDetails = "";
						famMemberDisplay = "";
						conditionsObj = null;
						conditionsHTML = "";
						conditionsCellHTML = "";
						familyListingHTML = "";

						if (currFamilyMemDetail.MEMBER) {
							reusableCodeValObj = MP_Util.GetValueFromArray(currFamilyMemDetail.MEMBER, codeArray);
							famMemberDisplay += reusableCodeValObj.display;
							//Store member display for sorting
							currFamilyMemDetail.MEMBER_DISPLAY = famMemberDisplay;
							currFamilyMemDetail.SP_RENDER_MEMBER_DISPLAY_HEADER = famMemberDisplay;

							reusableCodeValObj = MP_Util.GetValueFromArray(currFamilyMemDetail.DECEASED_CD, codeArray);

							if (reusableCodeValObj && reusableCodeValObj.meaning === "YES") {
								var deceasedAgeStr = "";
								if (currFamilyMemDetail.DECEASED_AGE) {
									deceasedAgeStr = CERN_FAM_HISTORY_CONSOLIDATED.getDeceasedPrecisionFlag(currFamilyMemDetail.DECEASED_AGE_PREC_FLAG) + " " + CERN_FAM_HISTORY_CONSOLIDATED.getAgePhrase(currFamilyMemDetail.DECEASED_AGE, currFamilyMemDetail.DECEASED_AGEUNIT, 1);
								}
								else if (currFamilyMemDetail.DECEASED_AGE_PREC_FLAG === 0) {
									deceasedAgeStr = fhxi18n.AT_AGE + " " + CERN_FAM_HISTORY_CONSOLIDATED.getDeceasedPrecisionFlag(currFamilyMemDetail.DECEASED_AGE_PREC_FLAG);
								}

								famMemAddtnDetails = stdStringSeparator + fhxi18n.DECEASED + " (" + currFamilyMemDetail.DECEASED_DESP || "";

								//Prepare the sidepanel header for the family Member
								currFamilyMemDetail.SP_RENDER_MEMBER_DISPLAY_HEADER += stdStringSeparator + fhxi18n.DECEASED;
								currFamilyMemDetail.SP_RENDER_MEMBER_DISPLAY_SUBHEADER = currFamilyMemDetail.DECEASED_DESP;

								if (deceasedAgeStr) {
									if (currFamilyMemDetail.DECEASED_DESP) {
										famMemAddtnDetails += ", " + deceasedAgeStr + ")";
										currFamilyMemDetail.SP_RENDER_MEMBER_DISPLAY_SUBHEADER += stdStringSeparator + deceasedAgeStr;
									}
									else {
										famMemAddtnDetails += deceasedAgeStr + ")";
										currFamilyMemDetail.SP_RENDER_MEMBER_DISPLAY_SUBHEADER += deceasedAgeStr;
									}
								}
								else {
									famMemAddtnDetails += ")";
								}
							}
						}

						familyListingHTML = "<div id='familyView" + compId + "Item" + i + "' class='chx-fhx-item chx-info result-info'>" + famMemberDisplay + "<span class='secondary-text'>" + famMemAddtnDetails + "</span></div>";

						currFamilyMemDetail.FAMILY_MEM_DETAILS = familyListingHTML;
						if (currFamilyMemDetail.NAMEFIRST || currFamilyMemDetail.NAMELAST) {
							currFamilyMemDetail.SP_RENDER_MEMBER_DISPLAY_SUBHEADER_NAME = (currFamilyMemDetail.NAMEFIRST || "") + " " + (currFamilyMemDetail.NAMELAST || "");
						}

						for (j = 0; j < conditionLen; j++) {
							var sidepanelObj = new SidepanelRenderDetailsObj();
							var onsetAgeStr = "";
							onsetInfo = "";
							conditionsObj = currFamilyMemDetail.CONDITION[j];
							sidepanelObj.CONDITION = conditionsObj.CONDITION;

							if (conditionsObj.ONSET_AGE) {
								if (conditionsObj.ONSET_AGE_PRECISION) {
									onsetAgeStr = conditionsObj.ONSET_AGE_PRECISION + " " + CERN_FAM_HISTORY_CONSOLIDATED.getAgePhrase(conditionsObj.ONSET_AGE, conditionsObj.ONSET_AGEUNIT, 1);
								}
								else {
									onsetAgeStr = fhxi18n.AT_AGE + " " + CERN_FAM_HISTORY_CONSOLIDATED.getAgePhrase(conditionsObj.ONSET_AGE, conditionsObj.ONSET_AGEUNIT, 1);
								}
							}
							else if (conditionsObj.ONSET_AGE_PRECISION && conditionsObj.ONSET_AGE_PRECISION.toUpperCase() === "UNKNOWN") {
								onsetAgeStr = conditionsObj.ONSET_AGE_PRECISION;
							}

							if (onsetAgeStr) {
								onsetInfo = ' (' + onsetAgeStr + ')';
								sidepanelObj.ONSET_DATE = "(" + fhxi18n.ONSET + stdStringSeparator + onsetAgeStr + ")";
							}

							conditionsHTML += "<div class='chx-fhx-item chx-info result-info'>" + conditionsObj.CONDITION + "<span class='secondary-text'>" + onsetInfo + "</span></div>";

							sidepanelObj.LIFECYCLE = conditionsObj.LIFECYCLE ? conditionsObj.LIFECYCLE : null;
							sidepanelObj.SEVERITY = conditionsObj.SEVERITY ? conditionsObj.SEVERITY : null;
							sidepanelObj.COURSE = conditionsObj.COURSE ? conditionsObj.COURSE : null;

							sidepanelObj.LAST_REVIEWED = conditionsObj.LASTREVIEWED ? CERN_FAM_HISTORY_CONSOLIDATED.formatDate(conditionsObj.LASTREVIEWED) : null;

							if (conditionsObj.COMMENTS && conditionsObj.COMMENTS.length) {
								sanitizedComment = CERN_FAM_HISTORY_CONSOLIDATED.sanitizeComment(conditionsObj.COMMENTS[0].COMMENT_TEXT);

								sidepanelObj.COMMENTS = conditionsObj.COMMENTS;

								if (!commentHTML) {
									commentHTML = "<div class='comment'>";
								}

								commentHTML += "<p class='fhx-comment' title='" + conditionsObj.COMMENTS[0].COMMENT_TEXT + "'>" + conditionsObj.CONDITION + ": " + sanitizedComment + "</p>";
							}
							if (!currFamilyMemDetail.SP_RENDER_DETAILS) {
								currFamilyMemDetail.SP_RENDER_DETAILS = [];
							}
							currFamilyMemDetail.SP_RENDER_DETAILS.push(sidepanelObj);
						}

						//Piggyback the comment onto the Conditions String
						conditionsCellHTML = conditionsHTML + commentHTML + "</div>";
						if (conditionsCellHTML) {
							currFamilyMemDetail.FAMILY_COND_DETAILS = conditionsCellHTML;
						}
					}
				}
			}
			catch (err) {
				logger.logJSError(err, this, "consolidated-familyhistory.js", "processDataFamilyView");
			}
		},
		/**
		 * Render the Family Hx MPageUI table along with the data - PED and/or Millennium
		 *
		 * @param {Object} famHxTable MPageUI table object
		 * @param {Object} millTableData Millennium data processed and formatted
		 * @param {Object} PEDTableData PED processed and formatted
		 * @param {Boolean} displayPED If true then we are going to render the PED table
		 * @param {Object} component Histories Component object
		 * @returns {string} MPageUI Table in the form of a string which will be later used to load in the tab
		 */
		prepareConditionViewTable: function (famHxTable, millTableData, PEDTableData, displayPED, component) {
			var tableMarkUp = "";
			var self = component;

			try {
				/**
				 * Base object for rendering a Group in the table
				 * @returns {{groups: Array}} Returns the group of Array that will be rendered in the table
				 */
				var prepareTableGroups = function () {
					var baseGroupObj = {
						groups: []
					};

					/**
					 * Child group object that will be used to insert the groups into the main group
					 * @returns {{label: string, expanded: boolean, records: Array}}
					 * @constructor
					 */
					var ChildGroupObj = function () {
						return {
							label: "",
							expanded: true,
							records: []
						};
					};

					var i = 0, j = 0;
					if (millTableData) {
						var groupNameLen = millTableData.GroupNames.length;
						for (i = 0; i < groupNameLen; i++) {
							if (millTableData.GroupNames[i]) {
								var group = millTableData.Groups[millTableData.GroupNames[i]];
								var conditions = group.conditions;
								var conditionsLen = conditions.length;
								//Group name for Table Section
								var tempObj = new ChildGroupObj();
								tempObj.label = group.name;

								for (j = 0; j < conditionsLen; j++) {
									tempObj.records.push({
										"CONDITION": conditions[j].CONDITION,
										"FAMILY_MEMBER_DETAILS": conditions[j].FAM_COND_DETAILS,
										"CATEGORY": "MILL",
										"VIEW_IDENTIFIER": "CONDITION",
										"SIDEPANEL_DETAILS": conditions[j].SP_RENDER_DETAILS
									});
								}
								baseGroupObj.groups.push(tempObj);
							}
						}
					}

					if (PEDTableData) {
						//If the PED data is present then use the millennium data to put into the parent group
						//This will become the parent group and the table is rendered with Mill data as the child

						var PEDBaseGroupObj;
						var PEDRecordsList = [];
						for (i = 0; i < PEDTableData.length; i++) {
							if (PEDTableData[i]) {
								PEDRecordsList.push({
									"REQUEST": PEDTableData[i].request,
									"CONDITION": PEDTableData[i].condition,
									"FAMILY_MEMBER_DETAILS": PEDTableData[i].familyMember,
									"CATEGORY": "PED",
									"VIEW_IDENTIFIER": "CONDITION"
								});
							}
						}

						//Set the values for the table items appropriately
						PEDBaseGroupObj = {
							groups: [
								{
									showCount: true,
									label: "<span class='chx-pat-req-icon'></span>" + fhxi18n.PATIENT_REQUESTS,
									expanded: true,
									collapsible: false,
									records: PEDRecordsList
								}, {
									showCount: true,
									label: fhxi18n.CHART_FAMILY_HISTORY,
									expanded: true,
									collapsible: false,
									groups: baseGroupObj.groups
								}
							]
						};

						if (baseGroupObj.groups.length === 0) {
							delete PEDBaseGroupObj.groups[1].groups;
							PEDBaseGroupObj.groups[1].records = [];
							PEDBaseGroupObj.groups[1].showCount = true;
						}

						return PEDBaseGroupObj;
					}
					else if (!PEDTableData && displayPED && millTableData) {
						//If PED is not present but the PED is set to display and there is Mill Data
						return {
							groups: [
								{
									showCount: true,
									label: "<span class='chx-pat-req-icon'></span>" + fhxi18n.PATIENT_REQUESTS,
									expanded: true,
									collapsible: false,
									records: []
								}, {
									showCount: true,
									label: fhxi18n.CHART_FAMILY_HISTORY,
									expanded: true,
									collapsible: false,
									groups: baseGroupObj.groups
								}
							]
						};
					}

					return baseGroupObj;
				};

				//Set the MPageUI table properties
				if (famHxTable) {
					famHxTable.setOptions({
						namespace: "wf-consol-hx-famHx",
						rows: {
							striped: true
						},
						highlight: MPageUI.TABLE_OPTIONS.HIGHLIGHT.ROW,
						select: MPageUI.TABLE_OPTIONS.SELECT.SINGLE_ROW
					});

					if (PEDTableData || (displayPED && millTableData)) {
						famHxTable.setColumns([
							{
								id: "request_cond_view_ped",
								label: fhxi18n.REQUEST,
								css: "request_cond_view_ped-column",
								contents: function (record) {
									return (record.REQUEST || "--");
								}
							},
							{
								id: "condition_cond_view_ped",
								label: fhxi18n.CONDITION,
								css: "condition_cond_view_ped-column",
								contents: function (record) {
									return record.CONDITION;
								}
							},
							{
								id: "fam_member_cond_view_ped",
								label: fhxi18n.MEMBERS,
								css: "fam_member_cond_view_ped-column",
								contents: function (record) {
									return record.FAMILY_MEMBER_DETAILS;
								}
							}
						]);
					}
					else {
						famHxTable.setColumns([
							{
								id: "condition_cond_view",
								label: fhxi18n.CONDITION,
								css: "condition_cond_view-column",
								contents: function (record) {
									return record.CONDITION;
								}
							},
							{
								id: "fam_member_cond_view",
								label: fhxi18n.MEMBERS,
								css: "fam_member_cond_view-column",
								contents: function (record) {
									return record.FAMILY_MEMBER_DETAILS;
								}
							}
						]);
					}

					famHxTable.setMaxHeight(CERN_FAM_HISTORY_CONSOLIDATED.computeTableHeight(component));

					famHxTable.setData(prepareTableGroups());

					famHxTable.setOnRowClickCallback(function (data) {
						//Condition View sidepanel should be loaded on row click
						if (data.records[0].CATEGORY === "MILL") {
							CERN_FAM_HISTORY_CONSOLIDATED.activateSidepanel(self, data);
						}
					});

					tableMarkUp = famHxTable.render();
				}
			}
			catch (err) {
				logger.logJSError(err, this, "consolidated-familyhistory.js", "prepareConditionViewTable");
			}
			return tableMarkUp;
		},
		/**
		 * Render the Family Hx MPageUI table along with the data - PED and/or Millennium
		 *
		 * @param {Object} famHxTable MPageUI table object
		 * @param {Object} millTableData Millennium data processed and formatted
		 * @param {Object} PEDTableData PED processed and formatted
		 * @param {Boolean} displayPED If true then we are going to render the PED table
		 * @param {Object} component Histories Component object
		 * @returns {string} MPageUI Table in the form of a string which will be later used to load in the tab
		 */
		prepareFamilyViewTable: function (famHxTable, millTableData, PEDTableData, displayPED, component) {
			var tableMarkUp = "";
			var self = component;

			try {

				//With PED we have 2 groups and 3 columns
				//Without PED its just plain records and 2 columns
				/**
				 * Creates an Object of PED and Mill or just Mill data for displaying in the table
				 * @returns {Object} If PED is present then PEDBaseGroupObj else for just Mill data baseObj is returned
				 */
				var prepareTableGroups = function () {
					var baseObj = {
						records: []
					};
					var PEDRecordsList = [];
					var i, j;
					var PEDBaseGroupObj;

					//Load the millennium data first
					if (millTableData) {
						for (j = 0; j < millTableData.length; j++) {
							baseObj.records.push({
								"FAMILY_MEMBER_DETAILS": millTableData[j].FAMILY_MEM_DETAILS,
								"CONDITION": millTableData[j].FAMILY_COND_DETAILS,
								"CATEGORY": "MILL",
								"FAMILY_MEMBER": millTableData[j].MEMBER_DISPLAY,
								"VIEW_IDENTIFIER": "FAMILY",
								"SIDEPANEL_HEADER": millTableData[j].SP_RENDER_MEMBER_DISPLAY_HEADER,
								"SIDEPANEL_SUBHEADER": millTableData[j].SP_RENDER_MEMBER_DISPLAY_SUBHEADER,
								"SIDEPANEL_SUBHEADER_NAME": millTableData[j].SP_RENDER_MEMBER_DISPLAY_SUBHEADER_NAME,
								"SIDEPANEL_DETAILS": millTableData[j].SP_RENDER_DETAILS
							});
						}
					}

					//Process the PED data into the already Mill data records
					if (PEDTableData) {
						PEDBaseGroupObj = {
							groups: [
								{
									showCount: true,
									label: "<span class='chx-pat-req-icon'></span>" + fhxi18n.PATIENT_REQUESTS,
									expanded: true,
									collapsible: false,
									records: PEDRecordsList
								}, {
									showCount: true,
									label: fhxi18n.CHART_FAMILY_HISTORY,
									expanded: true,
									collapsible: false,
									records: baseObj.records
								}
							]
						};

						for (i = 0; i < PEDTableData.length; i++) {
							if (PEDTableData[i]) {
								PEDRecordsList.push({
									"REQUEST": PEDTableData[i].request,
									"FAMILY_MEMBER_DETAILS": PEDTableData[i].familyMember,
									"CONDITION": PEDTableData[i].condition,
									"CATEGORY": "PED",
									"FAMILY_MEMBER": PEDTableData[i].familyMember,
									"VIEW_IDENTIFIER": "FAMILY"
								});
							}
						}

						return PEDBaseGroupObj;
					}
					else if (!PEDTableData && displayPED && millTableData) {
						return {
							groups: [
								{
									showCount: true,
									label: "<span class='chx-pat-req-icon'></span>" + fhxi18n.PATIENT_REQUESTS,
									expanded: true,
									collapsible: false,
									records: []
								}, {
									showCount: true,
									label: fhxi18n.CHART_FAMILY_HISTORY,
									expanded: true,
									collapsible: false,
									records: baseObj.records
								}
							]
						};
					}
					return baseObj;
				};

				//Set the MPageUI table properties
				if (famHxTable) {
					famHxTable.setOptions({
						namespace: "wf-consol-hx-famHx",
						sortable: true,
						rows: {
							striped: true
						},
						highlight: MPageUI.TABLE_OPTIONS.HIGHLIGHT.ROW,
						select: MPageUI.TABLE_OPTIONS.SELECT.SINGLE_ROW
					});

					if (PEDTableData || (displayPED && millTableData)) {
						famHxTable.setColumns([
							{
								id: "request_fam_view_ped",
								label: fhxi18n.REQUEST,
								css: "request_fam_view_ped-column",
								contents: function (record) {
									return (record.REQUEST || "--");
								}
							},
							{
								id: "fam_member_fam_view_ped",
								label: fhxi18n.MEMBERS,
								css: "fam_member_fam_view_ped-column",
								contents: function (record) {
									return record.FAMILY_MEMBER_DETAILS;
								},
								sortOptions: {
									primary: {
										field: "FAMILY_MEMBER",
										direction: MPageUI.TABLE_OPTIONS.SORT.ASCENDING
									}
								}
							},
							{
								id: "condition_fam_view_ped",
								label: fhxi18n.CONDITION,
								css: "condition_fam_view_ped-column",
								contents: function (record) {
									return record.CONDITION;
								}
							}
						]);

						famHxTable.sortBy({
							column: {
								id: "fam_member_fam_view_ped",
								direction: MPageUI.TABLE_OPTIONS.SORT.ASCENDING
							}
						});
					}
					else {
						famHxTable.setColumns([
							{
								id: "fam_member_fam_view",
								label: fhxi18n.MEMBERS,
								css: "fam_member_fam_view-column",
								contents: function (record) {
									return record.FAMILY_MEMBER_DETAILS;
								},
								sortOptions: {
									primary: {
										field: "FAMILY_MEMBER",
										direction: MPageUI.TABLE_OPTIONS.SORT.ASCENDING
									}
								}
							},
							{
								id: "condition_fam_view",
								label: fhxi18n.CONDITION,
								css: "condition_fam_view-column",
								contents: function (record) {
									return record.CONDITION;
								}
							}
						]);

						famHxTable.sortBy({
							column: {
								id: "fam_member_fam_view",
								direction: MPageUI.TABLE_OPTIONS.SORT.ASCENDING
							}
						});
					}

					famHxTable.setMaxHeight(CERN_FAM_HISTORY_CONSOLIDATED.computeTableHeight(component));

					famHxTable.setData(prepareTableGroups());

					famHxTable.setOnRowClickCallback(function (data) {
						//Family View sidepanel should be loaded on row click
						if (data.records[0].CATEGORY === "MILL") {
							CERN_FAM_HISTORY_CONSOLIDATED.activateSidepanel(self, data);
						}
					});

					tableMarkUp = famHxTable.render();
				}
			}
			catch (err) {
				logger.logJSError(err, this, "consolidated-familyhistory.js", "prepareFamilyViewTable");
			}
			return tableMarkUp;
		},
		/**
		 * Get the age phrase like 3 months, 45 days, or 3 (years)
		 * @param {number} age Age number
		 * @param {string} unit Age unit
		 * @param {boolean} yearEnabled Show "years" after the age number if true and age unit is "YEARS"
		 * @returns {string} agePhrase Verbal age phrase
		 */
		getAgePhrase: function (age, unit, yearEnabled) {
			var agePhrase = "";
			switch (unit) {
				case "YEARS":
				case "":
					if (yearEnabled) {
						agePhrase = i18n.discernabu.X_YEARS.replace("{0}", age);
					}
					else {
						agePhrase = age;
					}
					break;
				case "MONTHS":
					agePhrase = i18n.discernabu.X_MONTHS.replace("{0}", age);
					break;
				case "DAYS":
					agePhrase = i18n.discernabu.X_DAYS.replace("{0}", age);
					break;
				case "WEEKS":
					agePhrase = i18n.discernabu.X_WEEKS.replace("{0}", age);
					break;
				default:
					agePhrase = age;
			}
			return agePhrase;
		},

		/**
		 * Sanitized a comment through HTML encoding
		 * @param  {String} unsanitizedComment String of unsanitized comment
		 * @returns {String} String where troublesome characters have been html-encoded
		 */
		sanitizeComment: function (unsanitizedComment) {
			return unsanitizedComment.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r\n/g, "<br />");
		},

		/**
		 * Format the given date string
		 * @param  {String} date String ISO8601 representation of date
		 * @param {String} dateFormat format to which the date should be converted
		 * @returns {String} formattedDate Properly formatted date as a string
		 */
		formatDate: function (date, dateFormat) {
			if (!date) {
				return "--";
			}
			var formattedDate = new Date();
			formattedDate.setISO8601(date);
			if (!dateFormat) {
				formattedDate = formattedDate.format("shortDate2");
			}
			else {
				formattedDate = formattedDate.format(dateFormat);
			}
			return formattedDate;
		},

		/**
		 * Computes the table height for the MPageUI table according to the screen space and component space available
		 * @param {Object} component Histories Component object
		 * @returns {number} Number containing the height that the table can occupy
		 */
		computeTableHeight: function (component) {
			var viewPointBodyObj = $("#vwpBody");
			var chxHeaderHeight = 92;

			var viewPointBodyHeight = viewPointBodyObj ? viewPointBodyObj.height() : 400;

			var tabControlObj = $("#" + "tabData" + component.getComponentId());
			var tabControlHeight = tabControlObj ? tabControlObj.height() : 0;
			var fhxBannerContainerObj = $("#fhxErrorBannerContainer" + component.getComponentId());
			var fhxBannerContainerHeight = fhxBannerContainerObj ? fhxBannerContainerObj.height() : 0;
			var fhxPEDAckBannerObj = $(".chx-ack-banner-container");
			var fhxPEDAckBannerHeight = fhxPEDAckBannerObj ? fhxPEDAckBannerObj.height() : 0;

			return viewPointBodyHeight - (chxHeaderHeight + tabControlHeight + fhxBannerContainerHeight + fhxPEDAckBannerHeight);
		},
		/**
		 * Creates a sidepanel if not present, once the sidepanel is created the row values are inserted
		 * @param {Object} component Histories Component object
		 * @param {Object} rowData More details on the selected row
		 * @returns {undefined} returns nothing
		 */
		activateSidepanel: function (component, rowData) {
			try {
				if (component && rowData) {

					if (!component.famHxTable) {
						return;
					}

					var compId = component.getComponentId();
					var sidePanelContainer = $("#famHxSidePanelContainer" + compId);

					/**
					 * Gets the row Id for the selected row in the table
					 * @param {Object} data Row data
					 * @returns {string} contains id of the selected row
					 */
					var getTableRowId = function (data) {
						var tableRowSelected = null;
						if (data && data.event) {
							tableRowSelected = $(data.event.currentTarget).attr("id");
						}
						return tableRowSelected;
					};

					var scrollToSelectedRow = function (selectedRow) {
						if (selectedRow.length) {
							var tableContainer = component.famHxTable.getRootElement().find(".table-body");
							var docViewTop = $(window).scrollTop();
							var docViewBottom = docViewTop + $(window).height();
							var elemTop = selectedRow.offset().top;
							var elemBottom = elemTop + selectedRow.height();
							var isElementVisible = ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
							if (!isElementVisible) {
								tableContainer.scrollTo("#" + selectedRow.attr("id"));
							}
						}
					};

					/**
					 * Computes the sidepanel height according to the table height available
					 * @returns {string} Height of the sidepanel
					 */
					var computeSidepanelHeight = function () {
						var tableContainer = component.famHxTable.getRootElement();
						if (!tableContainer) {
							return "200px";
						}
						return tableContainer.height() + "px";
					};

					//Prepare a new instance of the sidepanel object if not present
					if (!component.famHxSidePanel) {
						component.famHxSidePanel = {
							m_isSidepanelCreated: false,
							m_doesSidePanelExist: false,
							m_sidePanelMinHeight: "175px",
							m_sidePanel: null,
							m_lastRowSelected: null
						};
					}

					//Build the sidepanel only if its not created before
					if (sidePanelContainer && sidePanelContainer.length) {
						var sidePanelProp = component.famHxSidePanel;
						if (!sidePanelProp.m_isSidepanelCreated) {
							//Technically this should happen only once
							var actionHolderHTML = "<div class='famHxSP-action-holder' id='actionBtnHolder" + compId + "'></div>";
							sidePanelProp.m_isSidepanelCreated = true;

							//Create the side panel
							sidePanelProp.m_sidePanel = new CompSidePanel(compId, sidePanelContainer.attr("id"));
							//Set sidepanel properties
							sidePanelProp.m_doesSidePanelExist = true;
							//Set Sidepanel properties
							sidePanelProp.m_sidePanel.setExpandOption(sidePanelProp.m_sidePanel.expandOption.EXPAND_DOWN);
							sidePanelProp.m_sidePanel.setMinHeight(sidePanelProp.m_sidePanelMinHeight);
							sidePanelProp.m_sidePanel.renderPreBuiltSidePanel();
							//Set title, subtitle and body
							CERN_FAM_HISTORY_CONSOLIDATED.loadMillSidepanelData(rowData.records[0], sidePanelProp.m_sidePanel, component);
							//Register delegates for expand icon
							CERN_FAM_HISTORY_CONSOLIDATED.addSPDetailsClickEvent("famHxSidePanelContainer", component);

							sidePanelProp.m_sidePanel.setActionsAsHTML(actionHolderHTML);
							sidePanelProp.m_sidePanel.showCornerCloseButton();
							sidePanelProp.m_sidePanel.setCornerCloseFunction(function () {
								//Close the sidepanel and revert the css
								$(".wf-consol-hx-famHx").removeClass("side-panel-active");
								sidePanelContainer.removeClass("side-panel-active");

								//Simulate a click on the table row so that highlight is removed
								component.famHxTable.deselectAll();
								sidePanelProp.m_lastRowSelected = null;
								sidePanelProp.m_doesSidePanelExist = false;
							});
							//For the first time the last row selected is null
							sidePanelProp.m_lastRowSelected = getTableRowId(rowData);

							//Add sidepanel css class to the table
							$(".wf-consol-hx-famHx").addClass("side-panel-active");
							sidePanelContainer.addClass("side-panel-active");

							//We cannot compute the height of the table until we know
							// how the data inside the table wraps. As the wrapping of
							// the text happens the table flexes and the height increases
							sidePanelProp.m_sidePanel.setHeight(computeSidepanelHeight());
							sidePanelProp.m_sidePanel.resizePanel();

							//Scroll to the row if row is below the viewing area
							scrollToSelectedRow($(rowData.event.currentTarget));
						}
						else {
							//If the sidepanel is already initialized then just show it back and put the data in it
							if (!sidePanelProp.m_doesSidePanelExist) {
								if (sidePanelProp.m_sidePanel) {
									$(".wf-consol-hx-famHx").addClass("side-panel-active");
									sidePanelContainer.addClass("side-panel-active");
									sidePanelProp.m_sidePanel.setHeight(computeSidepanelHeight());
									sidePanelProp.m_sidePanel.resizePanel();
									sidePanelProp.m_doesSidePanelExist = true;

									//Set title, subtitle and body
									CERN_FAM_HISTORY_CONSOLIDATED.loadMillSidepanelData(rowData.records[0], sidePanelProp.m_sidePanel, component);

									sidePanelProp.m_sidePanel.showPanel();
									sidePanelProp.m_lastRowSelected = getTableRowId(rowData);

									//Scroll to the row if row is below the viewing area
									scrollToSelectedRow($(rowData.event.currentTarget));
								}
							}
							else {
								var currentSelectedRowId = getTableRowId(rowData);
								if (sidePanelProp.m_doesSidePanelExist && currentSelectedRowId === sidePanelProp.m_lastRowSelected) {
									//Close the sidepanel and revert to the old CSS
									sidePanelProp.m_sidePanel.m_cornerCloseButton.trigger('click');

									//Simulate a click on the table row so that highlight is removed
									component.famHxTable.deselectAll();
									$(".wf-consol-hx-famHx").removeClass("side-panel-active");
									sidePanelContainer.removeClass("side-panel-active");

									sidePanelProp.m_lastRowSelected = null;
									sidePanelProp.m_doesSidePanelExist = false;
								}
								else {
									sidePanelProp.m_lastRowSelected = currentSelectedRowId;

									//Set title, subtitle and body
									CERN_FAM_HISTORY_CONSOLIDATED.loadMillSidepanelData(rowData.records[0], sidePanelProp.m_sidePanel, component);

									//Scroll to the row if row is below the viewing area
									scrollToSelectedRow($(rowData.event.currentTarget));
								}
							}
						}
					}
				}
			}
			catch (err) {
				logger.logJSError(err, this, "consolidated-familyhistory.js", "activateSidePanel");
			}
		},
		/**
		 * Loads the row information in the sidepanel. Only applicable for charted data in the Condition or Family View
		 *
		 * @param {Object} rowData Information for which additional details needs to be shown
		 * @param {Object} spObj CompSidePanel object
		 * @param {Object} component Histories Component object
		 * @returns {undefined} returns nothing
		 */
		loadMillSidepanelData: function (rowData, spObj, component) {
			try {
				var compId = component.getComponentId();
				var spDetailsObj = null;
				var spHeaderStr = "";
				var spSubHeaderStr = "";
				var sidepanelHTML = "";

				if (rowData && spObj) {
					if (rowData.VIEW_IDENTIFIER === "FAMILY") {
						//Family view
						spDetailsObj = rowData.SIDEPANEL_DETAILS;
						spHeaderStr = rowData.SIDEPANEL_HEADER;

						//Show the Sub Header if applicable
						spSubHeaderStr = rowData.SIDEPANEL_SUBHEADER;
						if (spDetailsObj && spHeaderStr) {
							spObj.setTitleText(spHeaderStr);

							if (spSubHeaderStr || rowData.SIDEPANEL_SUBHEADER_NAME) {
								var subtitleHTML = "";
								if (spSubHeaderStr) {
									subtitleHTML += "<div>" + spSubHeaderStr + "</div>";
								}
								if (rowData.SIDEPANEL_SUBHEADER_NAME) {
									subtitleHTML += "<div><span class='secondary-text'>" + fhxi18n.NAME + ": " + "</span><span>" + rowData.SIDEPANEL_SUBHEADER_NAME + "</span></div>";
								}

								spObj.setSubtitleAsHTML(subtitleHTML);
							}
							else {
								spObj.removeSubtitle();
							}
							sidepanelHTML = "<div id='sidePanelScrollContainer" + compId + "' class='sp-body-content-area'>" + CERN_FAM_HISTORY_CONSOLIDATED.prepareSidepanelDetails(spDetailsObj, rowData.VIEW_IDENTIFIER, component) + "</div>";
							spObj.setContents(sidepanelHTML, "tabContentsContainer" + compId);
						}
					}
					else {
						//Condition View
						spDetailsObj = rowData.SIDEPANEL_DETAILS;
						if (spDetailsObj) {
							spObj.setTitleText(rowData.CONDITION);
							sidepanelHTML = "<div id='sidePanelScrollContainer" + compId + "' class='sp-body-content-area'>" + CERN_FAM_HISTORY_CONSOLIDATED.prepareSidepanelDetails(spDetailsObj, rowData.VIEW_IDENTIFIER, component) + "</div>";
							spObj.setContents(sidepanelHTML, "tabContentsContainer" + compId);
						}
					}
					CERN_FAM_HISTORY_CONSOLIDATED.resizeComponent(component);
				}
			}
			catch (err) {
				logger.logJSError(err, this, "consolidated-familyhistory.js", "loadMillSidepanelData");
			}
		},
		/**
		 * Prepares the sidepanel body data when clicked on the row, this is a common function for Condition and Family view
		 * Consists of Full name, comments, lifecycle, severity, course and last reviewed date
		 * @param {Array} spData List containing the sidepanel data
		 * @param {String} view Condition or Family view
		 * @param {Object} component Histories Component object
		 * @return {string} HTML string comprising the body of the sidepanel
		 */
		prepareSidepanelDetails: function (spData, view, component) {
			try {
				var i = 0;
				var j = 0;
				var sidePanelInfoHTML = "";
				var compId = component.getComponentId();

				if (spData && view) {
					//Sidepanel body elements
					var spItemHeaderHTML;
					var spItemCommentsHTML;
					var spItemExtraDetailsHTML;

					for (i = 0; i < spData.length; i++) {
						spItemHeaderHTML = "";
						spItemCommentsHTML = "";
						spItemExtraDetailsHTML = "";

						//Based on the view only 2 things will change in the sidepanel body
						//1 - Condition or Family Member heading in the SP
						//2 - Family member might have deceased information

						//Rest is the same -> Comments, Full Name, Lifecycle, Severity, Course, Last Reviewed
						if (view === "FAMILY") {
							spItemHeaderHTML = "<dl class='wf-consol-hx-famHx-sp-content-item'><dt><div class='wf-consol-hx-famHx-expand-content'><div class='wf-consol-hx-famHx-toggle'>&nbsp;</div><div class='wf-consol-hx-famHx-sp-header-item'>" + spData[i].CONDITION + "</div></div></dt><dd class='secondary-text'>" + (spData[i].ONSET_DATE || '') + "</dd></dl>";
						}
						else {
							spItemHeaderHTML = "<dl class='wf-consol-hx-famHx-sp-content-item'><dt><div class='wf-consol-hx-famHx-expand-content'><div class='wf-consol-hx-famHx-toggle'>&nbsp;</div><div class='wf-consol-hx-famHx-sp-header-item'>" + spData[i].FAMILY_MEMBER + "</div></div><div class='wf-consol-hx-famHx-sp-deceased-info secondary-text'>" + (spData[i].DECEASED_INFO || '') + "</div> <span class='wf-consol-hx-famHx-sp-deceased-details secondary-text'>" + (spData[i].DECEASED_DETAILS || '') + "</span></dt><dd class='secondary-text'>" + (spData[i].ONSET_DATE || '') + "</dd></dl>";
						}

						if (spData[i].COMMENTS && spData[i].COMMENTS.length) {
							var commentsHTML = "";
							for (j = 0; j < spData[i].COMMENTS.length; j++) {
								commentsHTML += "<dl><dd class='wf-consol-hx-famHx-sp-comment-item'>" + spData[i].COMMENTS[j].COMMENT_TEXT + "</dd>";
								commentsHTML += "<dd class='wf-consol-hx-famHx-sp-comment-details secondary-text'><span>" + (CERN_FAM_HISTORY_CONSOLIDATED.trackPersonnelId(spData[i].COMMENTS[j].COMMENT_AUTHOR_ID, component.famRecordData.PRSNL) || "") + "</span>";
								commentsHTML += "<span class='wf-consol-hx-famHx-sp-comment-date'>" + CERN_FAM_HISTORY_CONSOLIDATED.formatDate(spData[i].COMMENTS[j].COMMENT_DT_TM, "mediumDate") + "</span></dd></dl>";
							}
							spItemCommentsHTML = "<div><div class='secondary-text'>" + fhxi18n.COMMENTS + ": " + "</div>" + commentsHTML + "</div>";
						}

						if (spData[i].FULL_NAME) {
							spItemExtraDetailsHTML += "<div><span class='secondary-text'>" + fhxi18n.NAME + ": " + "</span><span>" + spData[i].FULL_NAME + "</span></div>";
						}
						if (spData[i].LIFECYCLE) {
							spItemExtraDetailsHTML += "<div><span class='secondary-text'>" + fhxi18n.LIFECYCLE + ": " + "</span><span>" + spData[i].LIFECYCLE + "</span></div>";
						}
						if (spData[i].SEVERITY) {
							spItemExtraDetailsHTML += "<div><span class='secondary-text'>" + fhxi18n.SEVERITY + ": " + "</span><span>" + spData[i].SEVERITY + "</span></div>";
						}
						if (spData[i].COURSE) {
							spItemExtraDetailsHTML += "<div><span class='secondary-text'>" + fhxi18n.COURSE + ": " + "</span><span>" + spData[i].COURSE + "</span></div>";
						}
						if (spData[i].LAST_REVIEWED) {
							spItemExtraDetailsHTML += "<div><span class='secondary-text'>" + fhxi18n.LASTREVIEWED + ": " + "</span><span>" + spData[i].LAST_REVIEWED + "</span></div>";
						}

						sidePanelInfoHTML += "<div id='spContainerBody" + compId + "Item" + i + "' class='wf-consol-hx-famHx-sp-content-data closed'>" + spItemHeaderHTML + "<div class='wf-consol-hx-famHx-sp-content-container'>" + spItemExtraDetailsHTML + spItemCommentsHTML + "</div></div>";
					}
				}
				return sidePanelInfoHTML;
			}
			catch (err) {
				logger.logJSError(err, this, "consolidated-familyhistory.js", "prepareSidepanelDetails");
			}
		},
		/**
		 * Adds click events to the expand icon in the sidepanel to show additional details on the Condition or family member
		 * @param {String} containerId sidepanel condition or family container
		 * @param {Object} component Histories Component object
		 */
		addSPDetailsClickEvent: function (containerId, component) {
			try {
				if (containerId && component) {
					$("#" + containerId + component.getComponentId()).on("click", "dl .wf-consol-hx-famHx-expand-content", component, function () {
						$(this).closest(".wf-consol-hx-famHx-sp-content-data").toggleClass("closed");
						component.famHxSidePanel.m_sidePanel.expandSidePanel();
					});
				}
			}
			catch (err) {
				logger.logJSError(err, this, "consolidated-familyhistory.js", "addSPDetailsClickEvent");
			}
		},
		/**
		 * Searches the name of the author who created the comment
		 * @param {String} prnslId Author id from which we need to fetch the full name
		 * @param {Array} personnelList List of all the personnel from PRSNL table related to the comments created in Fam Hx
		 * @return {string} author name for the comment - lastname, firstname
		 */
		trackPersonnelId: function (prnslId, personnelList) {
			try {
				var authorFullName = "";
				var i = 0;
				if (prnslId && personnelList && personnelList.length) {
					for (i = 0; i < personnelList.length; i++) {
						if (prnslId === personnelList[i].ID) {
							authorFullName = personnelList[i].PROVIDER_NAME.NAME_FULL;
						}
					}
				}
				return authorFullName;
			}
			catch (err) {
				logger.logJSError(err, this, "consolidated-familyhistory.js", "trackPersonnelId");
			}
		},
		/**
		 * Returns the string corresponding to the deceased flag value
		 * @param flagId flag value for the corresponding deceased information
		 * @return {String} i18n string for the respective flag value
		 */
		getDeceasedPrecisionFlag: function (flagId) {
			try {
				switch (flagId) {
					case 0:
						return fhxi18n.UNKNOWN;
					case 1:
						return fhxi18n.BEFORE;
					case 2:
						return fhxi18n.AFTER;
					case 3:
						return fhxi18n.ABOUT;
					default:
						return fhxi18n.AT_AGE;
				}
			}
			catch (err) {
				logger.logJSError(err, this, "consolidated-familyhistory.js", "getDeceasedPrecisionFlag");
			}
		}
	};
}();
