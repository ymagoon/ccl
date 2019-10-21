/* globals
CapabilityTimer
CompSidePanel
TemplateEngine
MPage_Core_User_Prefs
TextControl
ManageProvider
TableCellClickCallbackExtension
TableGroup
assignMyselfTemplate: true
*/

function CareTeamo2ComponentStyle() {
	this.initByNamespace("cto2");
}

CareTeamo2ComponentStyle.inherits(ComponentStyle);

/**
 * The Care Team prototype component will retrieve all med services and teams
 * associated to the encounter as well as their physician contact.
 *
 * @param {Criterion}
 *            criterion
 */
function CareTeamo2Component(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new CareTeamo2ComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.CARE_TEAM.O2 - load component");
	this.setComponentRenderTimerName("ENG:MPG.CARE_TEAM.O2 - render component");
	this.m_renderTimer = null;
	this.m_careTeamTable = null;
	this.m_lastSelectedRow = "";
	this.m_providerRowId = "";
	this.m_rowWasClicked = false;
	this.m_previewPaneMinHeight = 173;
	this.m_primaryContactEventId = 0.0;
	this.m_primaryContactEventCd = 0.0;
	this.m_plusAddIconEle;
	this.compMenuReference = {};
	this.m_compMenuSequence = [];
	this.m_showPanel = false;
	this.m_sidePanel = null;
	this.m_sidePanelContainer = null;
	this.m_tableContainer = null;

	// The current care team id that is selected
	this.m_selectedTeamId = null;

	// Current care team assignments for a patient (JSON)
	this.m_alreadySavedCareTeams = {};

	// An array of row data objects, saved once a row is clicked, cleared when actions are taken
	this.m_cachedRowData = [];

	// A hash of Codes ids and Display Values for codes for Provider Tab.
	this.m_providerRoleCodes = {};

	// A hash of Codes ids and Display Values for codes for NonProvider Tab.
	this.m_nonProviderRoleCodes = {};

	// A hash of code ids and display values for communication types.
	this.m_communicationTypeCodes = [];

	// A string of selected role value.
	this.m_selected_role = "";

	// A string of the selected team value.
	this.m_selected_team = undefined;

	// An integer of the current User's last Selected Role.
	this.curUserLastSelectedRole = null;

	//PersonId of the selected Provider from the personnelSearchList
	this.selectedPersonId = null;

	//Current PCT care team assignments
	this.assignedCareTeams = [];
}

// ============================================================================
// Implementation
// ============================================================================

(function($) {

	/**
	 * Utility function that allows calling a CCL program asynchronously.
	 * 
	 * @param {String}
	 *            program: the ccl script to call
	 * @param {Object}
	 *            params: the parameters to send to the script
	 * @param {String}
	 *            timer: the timer name to start
	 * @param {Function}
	 *            callback: the function to go to upon completion of the call
	 * @return {MP_Core.ScriptReply} request: the reply from the script in JSON
	 *         format
	 */
	function ccl(program, params, timer, callback) {

		// makes the parameters array
		var pArr = [];
		$.each(params, function(k, v) {
			pArr.push(v.toString());
		});

		// builds the request object
		var request = new MP_Core.ScriptRequest(null, "");
		request.setProgramName(program);
		request.setParameters(pArr);

		if (timer) {
			request.setTimer(timer);
		}

		// the glorious ajax request.
		MP_Core.XMLCCLRequestCallBack(null, request, callback);

		return request;
	}

	/**
	 * Utility function to format numbers correctly for CCL parameters
	 * 
	 * @param {Integer}
	 *            number: the number to be altered for ccl program use
	 * @return {String} the result of tacking on a .00 to the number
	 */
	function cclNumber(number) {
		if (typeof number === "undefined") {
			return "0.0";
		}

		return parseInt(number, 10) + ".00";
	}

	CareTeamo2Component.prototype = new MPageComponent();
	CareTeamo2Component.prototype.constructor = MPageComponent;

	/*
	 * Add the pre-processing logic to call the ManageProvider Utility
	 */
	CareTeamo2Component.prototype.preProcessing = function() {
		var compMenu = this.getMenu();
		if(compMenu){
			var compID = this.getComponentId();
			var compMenuCtProv = new MenuSelection("compMenuMngCtProv" + compID);
			var self = this;
			var criterion = self.getCriterion();
			compMenuCtProv.setLabel(i18n.discernabu.careteam_o2.MANAGE_CARETEAM_PROVIDERS);
			compMenu.addMenuItem(compMenuCtProv);
			compMenuCtProv.setIsDisabled(false);
			this.compMenuReference[compMenuCtProv.getId()] = compMenuCtProv;
			compMenuCtProv.setClickFunction(function() {
			ManageProvider.manageProviders(criterion.provider_id, criterion.logical_domain_id);
			});
		}
	};

	/*
	 * Enabling the core level Add Plus sign to display all the time
	 */
	CareTeamo2Component.prototype.setPlusAddEnabled = function() {
		this.m_isPlusAdd = true;
	};

	/*
	 * Overwrites the retrieveComponentData parent function. Calls the script to
	 * load all the initial data for this component, MP_GET_CARE_TEAM_ASSIGN.
	 * The response from this script is then passed to renderComponent to start
	 * the build of the component table and preview pane.
	 * param {boolean}
	 *			flag to decide to set the curUserLastSelectedRole to null or retain the value
	 */
	CareTeamo2Component.prototype.retrieveComponentData = function(shouldCacheSessionData) {
		var self = this;
		var criterion = this.getCriterion();
		var logicalDomain = criterion.logical_domain_id;
		var encntrId = criterion.encntr_id;
		this.m_rowWasClicked = false;
		this.m_lastSelectedRow = "";
		this.m_cachedRowData = [];
		//Initialize the assignedCareTeams with every component refresh
		this.assignedCareTeams = [];
		// If the shouldCacheSessionData doesnot exist or is false, set the curUserLastSelectedRole to null so the value
		// is taken form the table when required else the last saved role is retained at the criterion level.
		if(!shouldCacheSessionData){
			this.curUserLastSelectedRole = null;
		}

		try {
			if (logicalDomain === null) {
				throw new Error("Logical Domain is null.");
			}

			// If encounter_id is 0, show encounter needed message in whole of component
			if (!encntrId) {
				this.finalizeComponent("<p class='disabled'>"+ i18n.discernabu.careteam_o2.NO_ENCNTR + "</p>", "");
				return;
			}

			// The parameters for this call may be changing soon as the script is being updated now
			var sendAr = [ "^MINE^", cclNumber(criterion.person_id), cclNumber(encntrId), "0.0", logicalDomain, "0" ];

			var request = new MP_Core.ScriptRequest(self, self.getComponentLoadTimerName());
			request.setProgramName("MP_GET_CARE_TEAM_ASSIGN");
			request.setParameters(sendAr);
			request.setAsync(true);

			MP_Core.XMLCCLRequestCallBack(null, request, function(reply) {
				// set this outside here because its needed for rendering the add assignment modal
				self.m_alreadySavedCareTeams = reply;
				self.isAuthorized = reply.getResponse().MANAGE_CARETEAM_PRIV;

				if (reply.getStatus() === "S") {
					self.renderComponent(reply.getResponse());
				}
				else if (reply.getStatus() === "F") {
					self.finalizeComponent(MP_Util.HandleErrorResponse(self.getStyles().getNameSpace(), reply.getError()), "");
				}
				else if (reply.getStatus() === "Z") {
					self.renderNoCareTeam();
				}
			});
		} catch (err) {
			MP_Util.LogJSError(err, self, "care-team-o2.js", "retrieveComponentData");
			self.finalizeComponent(MP_Util.HandleErrorResponse(self.getStyles().getNameSpace(), err.message), "");
		}
	};

	/**
	 * Creates the + add control in the component header
	 */
	CareTeamo2Component.prototype.placePlusAddIcon = function() {
		var wholeCompId = this.getStyles().getId();
		var headerElement = $("#" + wholeCompId).find(".sec-title");
		//Ensure plus sign does not already exist, so we don't get several plus signs across the top
		var plusElement = $("#" + wholeCompId + "Add");
		if (!plusElement.length) {
			headerElement.append("<a id='" + wholeCompId + "Add' class='add-plus'></a>");
		}
	};

	/**
	 * Customizes + add control in the component header
	 **/
	CareTeamo2Component.prototype.createPlusAddControl = function() {
		var self = this;
		var thisVisitIndicator = true; //flag to determine if the provider should be added in the thisVisits or not
		var addingPctTeamIndicator = true; //flag to determine if the provider is to be added on the onClick of the existing PCT Teams
		var addPlusElement = this.m_plusAddIconEle;
		var plusAddIconContainer = $("<div></div>").attr("id","cto2"+self.getComponentId()+"AddPlus").addClass("cto2-addplus-drp-dwn").html("&nbsp;");
		var ctI18n = i18n.discernabu.careteam_o2;
		this.setPlusAddCustomInd(true);
		//clearing the contents of the addplus button,removing all the existing events and customizing it.
		addPlusElement.html("");
		addPlusElement.off("click");
		addPlusElement.append(plusAddIconContainer);

		// creating template for assign myself functionality
		assignMyselfTemplate = new TemplateEngine.TemplateFactory((function() {
			var template = TemplateEngine;
			var div = template.tag("div");

			return {
				teamsInfo: function(context) {
					return div({
						"class": context.CSS_CLASS,
						"id": context._elementId, //eslint-disable-line no-underscore-dangle
						"pct_care_team": context.PCT_CARE_TEAM,
						"ASSIGN_CARE_TEAM": context.ASSIGN_CARE_TEAM,
						"existing_assignment": context.EXISTING_ASSIGNMENT
					}, div({"class": "cto2-team-info"}, context.MED_SERVICE_TEAM));
				}
			};
		})());

		// Create the plus add dropdownlist control.
		var plusAddControl = new MPageControls.DropDownList($("#cto2" + self.getComponentId() + "AddPlus"));
		plusAddControl.setValue("<span class='add-icon'></span>");
		self.plusAddControl = plusAddControl;
		var detailDialog = plusAddControl.getDetailDialog();
		detailDialog.setOnShow(function() {
			detailDialog.getContents().css("z-index",8);
			plusAddControl.onShow();
		});
		//set the template to the plus add control.
		self.plusAddControl.getList().setItemTemplate(assignMyselfTemplate.teamsInfo);

		// Renders the drop-down with the med-service and teams information to which the provider is associated.
		self.plusAddControl.setOnShow(function() {
			//set the display key to the control.
			self.plusAddControl.setDisplayKey("MED_SERVICE_TEAM");
			self.assignType = ctI18n.ASSIGN_MYSELF;
			//Retrieves suggestions for populating the add plus drop-down.
			self.openTab();
		});

		// This method would be invoked on selecting one of suggestions from addplus dropdown
		self.plusAddControl.getList().setOnSelect(function(item) {
			var slaTimer = null;
			try {
				slaTimer = MP_Util.CreateTimer("USR:MPG.CARETEAM.O2_Assign_myself");
				if (slaTimer) {
					slaTimer.SubtimerName = self.getCriterion().category_mean;
					slaTimer.Start();
				}

				if (!item.EXISTING_ASSIGNMENT) {
					if(item.ASSIGN_NO_PROVIDER_TEAM){
						self.providerModalPreProcessing(function() {
							thisVisitIndicator = false;
							addingPctTeamIndicator = false;

							//calls the updateRelationshipCodeList to retrieve the lastSelectedRole code
							//thisVisitIndicator and addingPctTeamIndicator would be set to false to indicate
							//to add the provider in the Cross-Visits
							self.updateRelationshipCodeList(thisVisitIndicator, addingPctTeamIndicator);
						});
					}
					// If "Assign care team" option is selected from the suggestions,
					// open the modal dialog with other providers and team info.
					if (item.ASSIGN_CARE_TEAM) {
						self.assignType = ctI18n.ASSIGN_CARE_TEAM;
						self.openTab();
					}
					else if (item.PCT_CARE_TEAM) {
						// Assigning the selectedTeamId to the component level variable and invoking getAssignedRelationCode
						// to retrieve the lastSelectedRole code
						//thisVisitIndicator and addingPctTeamIndicator would be set to indicate to add the provider in the This-Visits
						//and they are being added by the on-click of the existing PCT Teams listed under "Assign Myself" in the add plus drop-down
						self.m_selectedTeamId = item.PCT_CARE_TEAM;
						self.updateRelationshipCodeList(thisVisitIndicator, addingPctTeamIndicator);
					}
					else if (item.ADD_OTHER) {
						self.providerModalPreProcessing(function() {
							// Launch the provider search modal with the provider tab activated.
							self.launchProviderSearchModal("provider");
						});
					}
					else if (item.ADD_NON_PROVIDER) {
						self.providerModalPreProcessing(function() {
							// Launch the provider search modal with the non-provider tab activated.
							self.launchProviderSearchModal("non-provider");
						});
					}
				}
			}
			catch (err) {
				if (slaTimer) {
					slaTimer.Abort();
					slaTimer = null;
				}

				MP_Util.LogJSError(err, self, "care-team-o2.js", "AddPlusControlOnselect");
				throw (err);
			}
			finally {
				if (slaTimer) {
					slaTimer.Stop();
				}
			}
		});
	};

	/**
	 * Retrieves suggestions for populating the replace drop-down in the side panel
	 *
	 * @param {JSON} data
	 *        The results returned for the row clicked
	 */
	CareTeamo2Component.prototype.CreateDropDownContent = function(data) {
		var self = this;
		// Check if the related teams info has already been cached
		var cachedData = MP_Util.GetValueFromArray(data.PCT_CARE_TEAM_ID, this.m_cachedRowData);
		this.replaceSuggestionsArr = cachedData.REPLACE_OBJ || [];

		// If a med service level, or cached data, return the existing suggestions array.
		if (!(data.PRSNL_ID || data.PCT_TEAM_CD) || cachedData.REPLACE_OBJ) {
			return this.replaceSuggestionsArr;
		}

		/**
		 * This function handles the logic to call 'MP_GET_RELATED_CARE_TEAMS' script
		 */
		var retrieveCareTeamSibilings = function() {
			var sendAr = [
				"^MINE^", // OUTDEV
				data.PCT_CARE_TEAM_ID + ".0", // Team ID
				0, // Parent levels to return
				1 // Retrieve siblings
			];
			var request = new MP_Core.ScriptRequest(this, "");
			request.setProgramName("MP_GET_RELATED_CARE_TEAMS");
			request.setParameters(sendAr);
			request.setAsync(false);
			MP_Core.XMLCCLRequestCallBack(null, request, function(reply) {
				if (reply.getStatus() === "S") {
					processSuggestions(reply.getResponse(), data.PCT_CARE_TEAM_ID);
				}
				else if (reply.getStatus() === "F") {
					self.finalizeComponent(MP_Util.HandleErrorResponse(self.getStyles().getNameSpace(), reply.getError()), "");
				}
			});
		};

		/**
		 * This function handles the logic to render the retrieved suggestions in the replace drop-down
		 */
		var processSuggestions = function(reply) {
			var sibilingsCareTeams = reply.REQ_TEAMS[0].SIBLINGS;
			var sibilings = null;
			var codesArray = MP_Util.LoadCodeListJSON(reply.CODES);
			var prsnlArray = MP_Util.LoadPersonelListJSON(reply.PRSNL);
			var sibilingCareTeamlength = sibilingsCareTeams.length;
			for ( var i = 0; i < sibilingCareTeamlength; i++) {
				sibilings = sibilingsCareTeams[i];

				// If the team or provider is already assigned to the team, do not display them.
				if ($.inArray(sibilings.ORIG_PCT_TEAM_ID,self.assignedCareTeams) < 0) {
					switch (reply.REQ_TEAMS[0].TEAM_TYPE) {
						// TEAM_TYPE : 1 - Indicates that the medical service sibilings are returned
						case 1:
							sibilings.DISPLAY = MP_Util.GetValueFromArray(sibilings.PCT_MED_SERVICE_CD, codesArray).display;
							sibilings.CARE_TEAM_ID = sibilings.ORIG_PCT_TEAM_ID;
							break;
						// TEAM_TYPE : 2 - Indicates that the medical service - team sibilings are returned
						case 2:
							sibilings.DISPLAY = MP_Util.GetValueFromArray(sibilings.PCT_TEAM_CD, codesArray).display;
							sibilings.CARE_TEAM_ID = sibilings.ORIG_PCT_TEAM_ID;
							break;
						// TEAM_TYPE : 3 & 4 - Indicates that the provider sibilings need to be displayed
						case 3:
						case 4:
							if (sibilings.PRSNL_ID) {
								sibilings.DISPLAY = MP_Util.GetValueFromArray(sibilings.PRSNL_ID, prsnlArray).fullName;
								sibilings.CARE_TEAM_ID = sibilings.ORIG_PCT_TEAM_ID;
							}
							break;
						default:
							continue;
					}

					sibilings.CARE_TEAM_ID = sibilings.ORIG_PCT_TEAM_ID;
					// Processing the replace drop-down suggestions
					if (sibilings.DISPLAY) {
						self.replaceSuggestionsArr.push({
							"DISPLAY": sibilings.DISPLAY,
							"CARE_TEAM_ID": sibilings.CARE_TEAM_ID,
							"IS_PRIMARY": data.IS_PRIMARY,
							"PRSNL_ID": sibilings.PRSNL_ID
						});
					}
				}
			}
		};

		// Calling the retrieveSibilings method
		retrieveCareTeamSibilings();

		// Call to sort self.replaceSuggestionsArr by display
		self.replaceSuggestionsArr.sort(function (a, b) {
			if (a.DISPLAY.toUpperCase() > b.DISPLAY.toUpperCase()) {
				return 1;
			}

			if (a.DISPLAY.toUpperCase() < b.DISPLAY.toUpperCase()) {
				return -1;
			}

			return 0;
		});

		// Cache the replace suggestions here
		cachedData.REPLACE_OBJ = self.replaceSuggestionsArr;

		return self.replaceSuggestionsArr;
	};

	/**
	 * This method will be called only one time, after finalizing the component.
	 * Initializing the reading pane by adding the place holders for all the data based on if there is results for the
	 * care teams or not. Also, then if there are teams, it selects the first row, if not it attaches a click event
	 * to the add an assignment link.
	 * @param {number} hasResults - flag to indicate if there is care team build to load into the preview pane or not
	 */
	CareTeamo2Component.prototype.addReadPane = function(hasResults) {
		var compID = this.getComponentId();
		var ctI18n = i18n.discernabu.careteam_o2;
		var self = this;
		var tableViewObj = $("#" + compID + "tableView");
		var sidePanelContId = "ct" + compID + "sidePanelContainer";
		this.m_sidePanelContainer = $("#" + sidePanelContId);
		// Add a container to hold side panel
		var careteamPanelContent = $("#" + compID + "mainContainer");
		// Add component table to careteam component container
		this.m_tableContainer = tableViewObj;

		var initPane = function() {
			var getAddAssignmentLink = function() {
				if (self.isAuthorized) {
					$('#'+self.getStyles().getNameSpace() + compID + 'Add').addClass('enabled');
					return "<a id='cto2" + compID + "addAssignment' href='#'>" + ctI18n.ADD_ASSIGNMENT + "</a>";
				}
				else {
					return "";
				}
			};

			// Add place holders for the no care team reading pane.
			return [
				"<div id='cto2" + compID + "rpContent' class='cto2-rp-content'>",
					"<div class='cto2-rp-no-team-icon'>",
						"&nbsp;",
					"</div>",
					"<div class='cto2-rp-no-team-text secondary-text'>",
						ctI18n.NO_CARE_TEAM,
						getAddAssignmentLink(),
					"</div>",
				"</div>"
			].join("");
		};

		if (hasResults) {
			// Create a side panel object only first time
			if (this.m_sidePanelContainer.length === 0) {
				var careteamSidePanelContainer = "<div id='" + sidePanelContId + "' class='cto2-side-panel'>&nbsp;</div>";
				careteamPanelContent.append(careteamSidePanelContainer);
			}
			// Create side panel
			this.m_sidePanel = new CompSidePanel(compID, sidePanelContId);
			this.m_sidePanel.setExpandOption(this.m_sidePanel.expandOption.EXPAND_DOWN);

			this.m_sidePanel.setOnExpandFunction(function(){
				$("#sidePanelScrollContainer" + compID).css({"overflow": "auto"});
			});
			this.m_sidePanel.renderPreBuiltSidePanel();
			this.m_sidePanel.setHeight(this.m_tableContainer.height() + "px");
			this.m_sidePanel.showCornerCloseButton();
			this.m_sidePanel.setCornerCloseFunction(function(){
				$("#cto2" + compID + "table .result-info").removeClass("cto2-row-selected cto2-row-selected-init selected");
				self.m_showPanel = false;
				self.m_sidePanel.hidePanel();
				self.m_tableContainer.removeClass("cto2-side-panel-addition");
				self.m_tableContainer.removeClass("cto2-sp-hide-mode");
				self.m_lastSelectedRow = "";
			});
			//Create buttons in the header for the side panel
			var buttonsHtml = [
				'<div id="cto2' + compID + 'rpBtnHolder" class="cto2-rp-btn-holder hidden">',
					'<div id = "cto2' + compID + 'remove" class="cto2-rp-btn">',
						ctI18n.REMOVE,
					'</div>',
					'<div id="cto2' + compID + 'replace" class="cto2-rp-btn drop-down"></div>',
					'<div id="cto2' + compID + 'modify" class="cto2-rp-btn">',
						ctI18n.MODIFY,
					'</div>',
					'<div id="cto2' + compID + 'makePrimary" class="cto2-rp-btn">',
						ctI18n.MAKE_PRIMARY,
					'</div>',
				'</div>'
			].join('');
			this.m_sidePanel.setActionsAsHTML(buttonsHtml);
			this.m_sidePanelContainer = $("#" + sidePanelContId);
		}
		else {
			var readPane = $("#" + compID + "readPane");
			var previewPane = new MPageControls.PreviewPane(this.getStyles().getNameSpace(), compID, readPane, initPane);
			previewPane.renderPane();
		}

		// Creating suggestions template
		var suggestionsTemplate = new TemplateEngine.TemplateFactory((function() {
			var template = TemplateEngine;
			var div = template.tag("div");

			return {
				suggestions: function(context) {
					return div({
						"class": "search-item",
						"id": context._elementId, //eslint-disable-line no-underscore-dangle
						"cto2-med-service-team": context.CARE_TEAM_ID,
						"cto2-is-primary": context.IS_PRIMARY
					}, div({
						"class": "cto2-provider-name"
					}, context.DISPLAY));
				}
			};
		})());

		if (hasResults) {
			var $sidePanel = $("#sidePanel" + compID);

			// Creating a drop-down for replace button functionality
			var $replaceBtn = $("#cto2" + compID + "replace");
			var replaceDropDown = new MPageControls.DropDownList($replaceBtn);
			replaceDropDown.setValue(ctI18n.REPLACE);
			replaceDropDown.setDisplayKey("DISPLAY");
			replaceDropDown.getList().setItemTemplate(suggestionsTemplate.suggestions);
			replaceDropDown.getDetailDialog().setOnShow(function() {
				replaceDropDown.onShow();

				// Positioning the drop down list to fit the height of the side panel and be positioned below the replace button.
				var replaceBtnBottom = $replaceBtn.position().top + $replaceBtn.outerHeight(true);
				var replaceBtnLeft = $replaceBtn.position().left + parseInt($replaceBtn.css("margin-left"), 10);
				var sidePanelHeight = $sidePanel.height();
				replaceDropDown
					.getDetailDialog()
					.getContents()
					.css({
						"top": replaceBtnBottom,
						"height": sidePanelHeight - replaceBtnBottom,
						"left": replaceBtnLeft,
						"right": 35,
						"overflow-y": "auto",
						"overflow-x": "hidden",
						"z-index": 8
					});
			});
			self.replaceDropDown = replaceDropDown;

		}
		else {
			var $previewPane = $("#pp_" + compID + "_cto2");
			$previewPane.css({
				"height": tableViewObj.height() + 2 + "px",
				"min-width": "275px",
				"width": "100%"
			});

			//add click event to add assignment link in no care team preview pane
			this.getElementById("addAssignment").click(function() {
				self.assignType = ctI18n.ASSIGN_CARE_TEAM_MEMBER;
				self.openTab();
				return false;
			});
		}
	};

	/**
	 * This method will be called on initial load and each time a row is clicked for the first time.
	 * @param {Object} paneData - an object with relevant data to fill in the preview pane
	 * @return {String} htmlString - the built HTML for the pane of the row clicked
	 */
	CareTeamo2Component.prototype.buildPaneHtml = function(paneData) {
		var compID = this.getComponentId();
		var ctI18n = i18n.discernabu.careteam_o2;

		var getMemberListHTML = function() {
			return [
				"<div id='cto2" + compID + "memberDisplay' class='cto2-rp-member-display'>",
					"<div id='cto2" + compID + "memberLabel'>",
						paneData.memberListLabel,
					"</div>",
					"<div id='cto2" + compID + "memberList'>",
						paneData.memberList,
					"</div>",
				"</div>"
			].join("");
		};

		if (paneData.showProviderTeam > 0) {
			return [
				"<div id=" + compID + "rpScrollContainer>",
					"<div id='cto2" + compID + "providerOnly' class='cto2-rp-provider-only'>",
						"<div class='cto2-rp-provider-group'>",
							"<div class='cto2-rp-provider-left'>",
								"<div class='cto2-rp-provider-team-lbl secondary-text'>" +
									ctI18n.TEAM,
								"</div>",
								"<div id='cto2" + compID + "teamDisplay' class='cto2-rp-provider-team-display'>",
									paneData.providerTeam,
								"</div>",
							"</div>",
						"</div>",
						"<div class='cto2-rp-separator-top'>",
							"&nbsp;",
						"</div>",
						"<div class='cto2-rp-separator-bottom'>",
							"&nbsp;",
						"</div>",
					"</div>",
					getMemberListHTML(),
				"</div>"
			].join("");
		}
		else {
			return getMemberListHTML();
		}
	};

	/*
	 * This method overrides the base MPageComponent resizeComponent method. If the preview pane is
	 * expanded, it is first collapsed. The preview pane object is then given customized styling to
	 * override the standard behavior.
	 */
	CareTeamo2Component.prototype.resizeComponent = function() {
		var compID = this.getComponentId();

		// If the reading pane is in expanded view make it collapse.
		this.collapsePane();

		// Call the base class functionality to resize the component
		MPageComponent.prototype.resizeComponent.call(this, null);

		var $previewPane = $("#pp_" + compID + "_cto2");
		var $tableViewObj = $("#" + compID + "tableView");
		if (!$tableViewObj.hasClass("cto2-empty-table")) {
			$previewPane.css({
				"height": Math.max($tableViewObj.height(), this.m_previewPaneMinHeight) + "px"
			});
		} else {
			$previewPane.css({
				"height": $tableViewObj.height() + 2 + "px",
				"min-width": "275px",
				"width": "100%"
			});
		}
	};

	/**
	 * This function creates a new MP_Core.ScriptRequest object, properly populated based on the passed in clickValue.
	 * The clickValue represents whether the user has clicked the "Make Primary", "Replace", or "Remove" button.
	 *
	 * @param {number} clickValue
	 *        0 - Represents a click on the "Make Primary" button
	 *        1 - Represents a click on the "Replace" button
	 *        2 - Represents a click on the "Remove" button
	 * @param {Object} data
	 *        The results returned for the row clicked
	 *
	 * @return {Object} scriptRequest
	 *         A new MP_Core.ScriptRequest object, filled in with the proper parameters based on the passed in clickValue
	 */
	CareTeamo2Component.prototype.createScriptRequest = function(clickValue, data) {
		var self = this;
		var criterion = this.getCriterion();
		var blobIn = null;
		var replaceCareTeam = null;
		var params = [];
		var mpUpdStartArr = ["^MINE^", "0"];
		var scriptRequest = new MP_Core.ScriptRequest(this, "");

		switch (clickValue) {
			case 0:
				var json = "{" +
					"'PATIENTLIST':{" +
						"'CNT':1," +
						"'QUAL':[{" +
							"'PERSON_ID':" + criterion.person_id + ".0," +
							"'ENCNTR_ID':" + criterion.encntr_id + ".0," +
							"'EVENT_ID':" + self.m_primaryContactEventId + ".0" +
						"}]" +
					"}" +
				"}";

				// make primary button click
				params.push("^MINE^", data.PRSNL_ID + '.0', 0.0, 0.0, "^" + json + "^", 0.0, 0.0, data.PCT_CARE_TEAM_ID + '.0', 0);

				scriptRequest.setParameters(params);
				scriptRequest.setProgramName("MP_ASSIGN_PHYSICIAN_CONTACT");
				scriptRequest.setAsync(true);
				return scriptRequest;

			case 1:
				replaceCareTeam = data.REPLACE_DATA;
				// Replace button click
				blobIn = '{' +
					'"PATIENTS": {' +
						'"QUAL":[{' +
							'"PERSON_ID":' + criterion.person_id + '.0,' +
							'"ENCNTR_ID":' + criterion.encntr_id + '.0,' +
							'"ASSIGNMENT_ID":' + data.DCP_SHIFT_ASSIGN_ID + '.0,' +
							'"ORIG_PCT_TEAM_ID":' + data.PCT_CARE_TEAM_ID + '.0,' +
							'"ACTIVE_IND":' + 1 + ',' +
							'"BEGIN_EFFECTIVE_ISO":" ",' +
							'"END_EFFECTIVE_ISO":" "' +
						'}, {' +
							'"PERSON_ID":' + criterion.person_id + '.0,' +
							'"ENCNTR_ID":' + criterion.encntr_id + '.0,' +
							'"ASSIGNMENT_ID":' + 0.0 + ',' +
							'"ORIG_PCT_TEAM_ID":' + replaceCareTeam.CARE_TEAM_ID + '.0,' +
							'"ACTIVE_IND":' + 1 + ',' +
							'"BEGIN_EFFECTIVE_ISO":" ",' +
							'"END_EFFECTIVE_ISO":" ",' +
							'"ASSIGNED_RELTN_TYPE_CD":' + data.RELTN_TYPE_CD + '.0' +
						'}]' +
					'}' +
				'}';

				scriptRequest.setParameters(mpUpdStartArr);
				scriptRequest.setProgramName("MP_UPD_CARE_TEAM_ASSIGNMENT");
				scriptRequest.setRequestBlobIn(blobIn);
				scriptRequest.setAsync(true);
				return scriptRequest;
			case 2:
				// Remove button click
				blobIn = '{' +
					'"PATIENTS": {' +
						'"QUAL":[{' +
							'"PERSON_ID":'+ criterion.person_id + '.0,' +
							'"ENCNTR_ID":'+ criterion.encntr_id + '.0,' +
							'"ASSIGNMENT_ID":'+ data.DCP_SHIFT_ASSIGN_ID + '.0,' +
							'"ORIG_PCT_TEAM_ID":'+ (data.PCT_CARE_TEAM_ID || '0') + '.0,' +
							'"ACTIVE_IND":' + 1 + ',' +
							'"BEGIN_EFFECTIVE_ISO":"",' +
							'"END_EFFECTIVE_ISO":""' +
						'}]' +
					'}' +
				'}';

				scriptRequest.setParameters(mpUpdStartArr);
				scriptRequest.setProgramName("MP_UPD_CARE_TEAM_ASSIGNMENT");
				scriptRequest.setRequestBlobIn(blobIn);
				scriptRequest.setAsync(true);
				return scriptRequest;
			default:
				return "";
		}
	};

	/**
	 * This function handles the logic to assign the provider as a primary contact, removing the provider from care team
	 * or replacing the provider based on the button clicked. The careteam wf table would get updated immediately after
	 * the action takes place.
	 *
	 * @param {number} clickValue
	 *        0 - Represents a click on the "Make Primary" button
	 *        1 - Represents a click on the "Replace" button
	 *        2 - Represents a click on the "Remove" button
	 * @param {JSON} data
	 *        The results returned for the row clicked
	 */
	CareTeamo2Component.prototype.addUpdatePrimaryContact = function(clickValue, data) {
		var self = this;
		var slaTimer = null;
		var request = null;

		try {
			//start slaTimer depending on clickValue
			if (clickValue === 0) {
				slaTimer = MP_Util.CreateTimer("USR:MPG.CARETEAM.O2 _ Assign_primary_physician");
			} else if (clickValue === 2) {
				slaTimer = MP_Util.CreateTimer("USR:MPG.CARETEAM.O2 _ Remove_assignment");
			}

			if (slaTimer) {
				slaTimer.SubtimerName = self.getCriterion().category_mean;
				slaTimer.Start();
			}

			request = self.createScriptRequest(clickValue, data);

			MP_Core.XMLCCLRequestCallBack(null, request, function(reply) {
				if (reply.getStatus() === "S") {
					if (slaTimer) {
						slaTimer.Stop();
					}

					self.m_showPanel = false;
					self.retrieveComponentData();
				}
				else if (reply.getStatus() === "F") {
					if (slaTimer) {
						slaTimer.Abort();
					}

					self.finalizeComponent(MP_Util.HandleErrorResponse(self.getStyles().getNameSpace(), reply.getError()), "");
				}
				else if (reply.getStatus() === "Z" && slaTimer){
					slaTimer.Stop();
				}
			});
		}
		catch(err) {
			if (slaTimer) {
				slaTimer.Abort();
				slaTimer = null;
			}
			MP_Util.LogJSError(err, self, "care-team-o2.js", "addUpdatePrimaryContact");
			throw (err);
		}
	};

	/**
	 * This function handles the logic to update the primary contact for a patient
	 * when the replace button has been selected on a (Primary) row. This function 
	 * makes the call to mp_assign_physician_contact to make the new provider primary.
	 * Then if that is successful it sets IS_PRIMARY to false and calls addUpdatePrimaryContact
	 * to update the teams like normal. 
	 * 
	 * @param {JSON}
	 *            data - the results returned for the row clicked
	 *
	 * @param {JSON}
	 *            replaceCareTeam - the team selected from the replace drop down
	 */
	CareTeamo2Component.prototype.replacePrimaryContact = function(data, replaceCareTeam) {
		var self = this;
		var criterion = this.getCriterion();
		
		 try {
            var request = null;
            var sendAr = [];
            sendAr.push("^MINE^", replaceCareTeam.PRSNL_ID + '.0', 0.0, 0.0, "^{'PATIENTLIST': {'CNT': 1, 'QUAL':[{'PERSON_ID':" + criterion.person_id +
                    '.0',"'ENCNTR_ID':" + criterion.encntr_id + '.0,' + "'EVENT_ID':"+ self.m_primaryContactEventId + ".0}]}}^", 0.0, 0.0, replaceCareTeam.CARE_TEAM_ID + '.0', 0);
            request = new MP_Core.ScriptRequest(self, "");
            request.setProgramName("MP_ASSIGN_PHYSICIAN_CONTACT");
            request.setParameters(sendAr);
            request.setAsync(true);
            MP_Core.XMLCCLRequestCallBack(null, request, function(reply) {
                if (reply.getStatus() === "S") {
                    //remove old primary contact assignment, add new one
                	self.addUpdatePrimaryContact(1, data);
                } else {
                    self.finalizeComponent(MP_Util.HandleErrorResponse(self.getStyles().getNameSpace(), reply.getError()), "");
                    return;
                }
            });
        } catch(err) {
			MP_Util.LogJSError(err, self, "care-team-o2.js", "replacePrimaryContact");
			throw (err);
		}
	};

	/**
	 * Based on the selected row, reading pane will be refreshed with data and selected row will be updated as well.
	 *
	 * @param {element} selRow
	 *        The current element that was selected
	 * @param {JSON} data
	 *        The results returned for the row clicked
	 * @param {boolean} isInitialLoad
	 *        Flag is using to differentiate whether its is initial load or user selection
	 * @param {JSON} teamMembers
	 *        The results returned for the team members of the row clicked
	 */
	CareTeamo2Component.prototype.updateInfo = function(selRow, data, isInitialLoad, teamMembers) {
		var compID = this.getComponentId();
		var groupRowId = $(selRow).attr("id");

		// No need to render the pane again , if its already in selection and visible. In the case that its
		// already selected,and the panel is not showing, the panel will continue to be rendered.
		if ((this.m_lastSelectedRow === groupRowId) && !isInitialLoad) {
			if (this.m_showPanel) {
				$("#cornerCloseButton" + compID).trigger("click");
				this.m_lastSelectedRow = "";
			}
			return;
		}

		this.initSidePanelButtons(data);
		this.updateSelRowBgColor(selRow, isInitialLoad);
		this.prepareForRenderPane(data, teamMembers);

		// Update the lastSelectedRow value with index.
		this.m_lastSelectedRow = groupRowId;
	};

	/**
	 * This method will be called on each row selection to update the background
	 * color of selected row and font color to indicate that this is the
	 * currently selected row
	 * 
	 * @param {element}
	 *            selRowObj - the current element that was selected
	 */
	CareTeamo2Component.prototype.updateSelRowBgColor = function(selRowObj) {
		var compID = this.getComponentId();

		var tableViewObj = $("#" + compID + "tableView");
		var prevRow = tableViewObj.find(".selected");

		// Remove the background color of previous selected row
		if (prevRow.length > 0 && this.m_lastSelectedRow === $(prevRow).attr("id")) {
			prevRow.removeClass("cto2-row-selected");
			prevRow.removeClass("cto2-row-selected-init");
			prevRow.removeClass("selected");
		}

		// Change the background color to indicate that its selected
		$(selRowObj).addClass("cto2-row-selected selected");
	};

	/**
	 * This method will be called on each row selection to update the buttons in the preview pane. It determines if the buttons are
	 * shown or hidden based on which row is currently selected, and binds the appropriate events.
	 *
	 * @param {JSON} data
	 *        The results returned for the row clicked
	 */
	CareTeamo2Component.prototype.initSidePanelButtons = function(data) {
		var self = this;
		var compID = this.getComponentId();
		var btnHolder = $("#cto2" + compID + "rpBtnHolder");
		var makePrimaryBtn = $("#cto2" + compID + "makePrimary");
		var modifyBtn = $("#cto2" + compID + "modify");
		var replaceBtn = $("#cto2" + compID + "replace");
		var removeBtn = $("#cto2" + compID + "remove");

		/**
		 * If a row representing a personnel has been selected, bind the modify button and unhide it.
		 * Otherwise, unbind the button.
		 */
		var bindModifyButton = function() {
			if (data.PRSNL_ID) {
				modifyBtn
					.removeClass('hidden')
					.off('click')
					.on('click', function() {
						var modifyProviderInfo = self.prepModifyModal.call(self, data);
						self.providerModalPreProcessing(modifyProviderInfo);
					});
			}
			else {
				unbindModifyButton();
			}
		};
		/**
		 * Unbind any events bound to the modify button, and hide the element.
		 */
		var unbindModifyButton = function() {
			modifyBtn
				.addClass('hidden')
				.off('click');
		};
		/**
		 * If we're in a millennium context or the selected row does not represent a lifetime relation,
		 * bind the appropriate event on the remove button (based on the member type represented in the selected row).
		 * Otherwise, unbind the button.
		 */
		var bindRemoveButton = function() {
			if (CERN_Platform.inMillenniumContext() || data.MEMBER_TYPE !== "LIFETIME_RELATIONSHIP") {
				removeBtn
					.removeClass('hidden')
					.off('click')
					.on('click', function() {
						if (data.MEMBER_TYPE === "LIFETIME_RELATIONSHIP") {
							self.removeLifetimeReltns.call(self);
						} else {
							self.addUpdatePrimaryContact.call(self, 2, data);
						}
					});
			}
			else {
				unbindRemoveButton();
			}
		};
		/**
		 * Unbind any events bound to the remove button, and hide the element.
		 */
		var unbindRemoveButton = function() {
			removeBtn
				.addClass('hidden')
				.removeAttr('click')
				.off('click');
		};
		/**
		 * If a row representing a personnel has been selected, bind the Make Primary button and unhide it.
		 * Otherwise, unbind the button.
		 */
		var bindMakePrimaryButton = function() {
			if (data.PRSNL_ID) {
				makePrimaryBtn
					.removeClass('hidden')
					.off('click')
					.on('click', function() {
						self.addUpdatePrimaryContact.call(self, 0, data);
					});
			}
			else {
				unbindMakePrimaryButton();
			}
		};
		/**
		 * Unbind any events bound to the make primary button, and hide the element.
		 */
		var unbindMakePrimaryButton = function() {
			makePrimaryBtn
				.addClass('hidden')
				.removeAttr('click')
				.off('click');
		};
		/**
		 * Create the replace dropdown content.
		 * If something is available to select in the dropdown, unhide it and bind the selection event.
		 * Otherwise, hide the dropdown.
		 */
		var bindReplaceButton = function() {
			// Initially hide the replace button.
			unbindReplaceButton();
			self.CreateDropDownContent(data);

			if (self.replaceSuggestionsArr && self.replaceSuggestionsArr.length > 0) {
				replaceBtn.removeClass('hidden');

				// Rendering the suggestions on replace button click
				self.replaceDropDown.setOnShow(function() {
					self.replaceDropDown.getList().renderItems(self.replaceSuggestionsArr);
				});
				self.replaceDropDown.getList().setOnSelect(function(item) {
					var replaceBtnCapTimer = MP_Util.CreateTimer("CAP:MPG.CARETEAM.O2 _ Replace_assignment");
					if(replaceBtnCapTimer){
						replaceBtnCapTimer.SubtimerName = self.getCriterion().category_mean;
						replaceBtnCapTimer.Start();
						replaceBtnCapTimer.Stop();
					}
					data.REPLACE_DATA = item;
					if (data.IS_PRIMARY) {
						self.replacePrimaryContact(data, item);
					} else {
						self.addUpdatePrimaryContact(1, data);
					}
				});
			}
		};
		/**
		 * Unbind any events bound to the replace button, and hide the element.
		 */
		var unbindReplaceButton = function() {
			replaceBtn.addClass('hidden');
			self.replaceDropDown.hide();
		};

		if (this.isAuthorized) {
			btnHolder.removeClass('hidden');

			switch (data.MEMBER_TYPE) {
				case "CARE_TEAM":
					// Only the modify and replace buttons should be availble for the primary contact row.
					if (data.IS_PRIMARY) {
						unbindMakePrimaryButton();
						unbindRemoveButton();
					}
					// All four buttons should be available for non-primary contact care team rows.
					else {
						bindMakePrimaryButton();
						bindRemoveButton();
					}
					bindModifyButton();
					bindReplaceButton();
					break;
				case "SHIFT_ASSIGNMENTS":
					// No buttons should be displayed for shift assignment rows.
					unbindMakePrimaryButton();
					unbindModifyButton();
					unbindRemoveButton();
					unbindReplaceButton();
					break;
				case "LIFETIME_RELATIONSHIP":
					// Only the remove button should be displayed for lifetime relationship rows.
					unbindMakePrimaryButton();
					unbindModifyButton();
					bindRemoveButton();
					unbindReplaceButton();
					break;
				default: // Provider & NonProvider
					// Only the modify and remove buttons should be available for provider and non-provider rows.
					unbindMakePrimaryButton();
					bindModifyButton();
					bindRemoveButton();
					unbindReplaceButton();
			}
		}
	};

	/**
	 * Adds a spinner to the modal and adjusts the default positioning to fit the space appropriately.
	 *
	 * @param {String} container
	 *        The container element's ID
	 */
	CareTeamo2Component.prototype.addModalSpinner = function(container) {
		MP_Util.LoadSpinner(container);
		var $container = $('#' + container);
		var $spinner = $('#' + container + ' .loading-screen');

		$spinner.css('top', $container.position().top);
		$spinner.css('height', $container.height());
	};

	/**
	 * Shows the modify provider/non-provider/care-team modal.
	 *
	 * @param {Function} bodyDataFunction
	 *        The function that should be run to display the appropriate contents for the modal body.
	 * @param {Object} data
	 *        The data object associated with the selected row.
	 */
	CareTeamo2Component.prototype.showModifyModal = function(bodyDataFunction, data) {
		var self = this;
		var selectedRole = 0;
		var buildModifyRequestString = function() {
			// The personnel is considered freetext if they are not a care team member, nor a pre-existing provider relation.
			var isFreetext = (!(data.MEMBER_TYPE === 'CARE_TEAM' || (data.MEMBER_TYPE === 'PROVIDER_RELATION' && data.FREETEXT_IND === 0)));
			/**
			 * Gets the JSON representation for the person's name data.
			 *
			 * @return {String}
			 */
			var getPersonJSON = function() {
				if (isFreetext) {
					return '{' +
						'"PERSON_ID":' + data.PRSNL_ID + ',' +
						'"FIRST_NAME":' + '"' + $('#cto2FirstNameTextbox').val() + '"' + ',' +
						'"MIDDLE_NAME":' + '"' + $('#cto2MiddleNameTextbox').val() + '"' + ',' +
						'"LAST_NAME":' + '"' + $('#cto2LastNameTextbox').val() + '"' +
					'}';
				}
				else {
					return '';
				}
			};
			/**
			 * Gets the JSON representation for each phone number's associated data.
			 *
			 * @return {String}
			 */
			var getPhonesJSON = function() {
				/**
				 * Gets the JSON representation of a particular phone number's associated data,
				 * if the necessary information has been provided.
				 *
				 * @param  {String} elementID
				 *         The textbox element's ID
				 * @return {String}
				 */
				var getJSON = function(elementID) {
					if (isFreetext) {
						var phoneID = $(elementID + 'PhoneID').val() + '.0';
						var phoneType = $(elementID + 'InputGroup select').val() + '.0';
						var phoneNumber = $.trim($(elementID).val()).replace(/[^0-9]+/g, '');
						if (phoneType !== '' && ((phoneID === '0.0' && phoneNumber !== '') || phoneID !== '0.0')) {
							return '{' +
								'"PERSON_ID":' + data.PRSNL_ID + ',' +
								'"PHONE_ID":' + phoneID + ',' +
								'"PHONE_TYPE_CD":' + phoneType + ',' +
								'"PHONE_NUMBER":"' + phoneNumber + '"' +
							'}';
						}
					}
					return '';
				};
				var json = [];
				var primaryPhone = getJSON('#cto2PrimaryPhoneTextbox');
				var secondaryPhone = getJSON('#cto2SecPhoneTextbox');
				var tertiaryPhone = getJSON('#cto2TerPhoneTextbox');
				if (primaryPhone) {
					json.push(primaryPhone);
				}
				if (secondaryPhone) {
					json.push(secondaryPhone);
				}
				if (tertiaryPhone) {
					json.push(tertiaryPhone);
				}
				return json.join(',');
			};

			selectedRole = $('.cto2-form-roles-holder .cto2-selected-list').data('value');

			return '{' +
				'"REQUESTIN": {' +
					'"USER_ID":' + self.getCriterion().provider_id + '.0,' +
					'"NAME_UPDATES": [' +
						getPersonJSON() +
					'],' +
					'"PHONE_UPDATES": [' +
						getPhonesJSON() +
					'],' +
					'"CARE_TEAM_UPDATES": [{' +
						'"ASSIGNMENT_ID":' + data.DCP_SHIFT_ASSIGN_ID + '.0,' +
						'"ROLE_RELTN_CD":' + selectedRole + '.0' +
					'}]' +
				'}' +
			'}';
		};

		var modalId = 'careTeamModifyModal';
		var applyBtnId = 'ctoApplyBtn';
		var cancelBtnId = 'ctoCancelBtn';
		var ctoCancelBtn = new ModalButton(cancelBtnId)
			.setText(i18n.discernabu.careteam_o2.CANCEL)
			.setFocusInd(true);
		var ctoApplyBtn = new ModalButton(applyBtnId)
			.setText(i18n.discernabu.careteam_o2.APPLY)
			.setIsDithered(true);

		var modifyModal = new ModalDialog(modalId)
			.setTopMarginPercentage(10)
			.setBottomMarginPercentage(5)
			.setLeftMarginPercentage(20)
			.setRightMarginPercentage(20)
			.setIsBodySizeFixed(false)
			.setHeaderTitle(i18n.discernabu.careteam_o2.MODIFY_CARE_TEAM_MEMBER)
			.addFooterButton(ctoApplyBtn)
			.addFooterButton(ctoCancelBtn);

		modifyModal.setFooterButtonCloseOnClick(applyBtnId, false);

		/**
		 * Set up and perform the script request to save the personnel's form data when the apply button is clicked.
		 */
		modifyModal.setFooterButtonOnClickFunction(applyBtnId, function() {
			self.addModalSpinner("careTeamModifyModalbody");

			$('#ctoApplyBtn').prop('disabled', true);

			var request = new ScriptRequest()
				.setProgramName('MP_UPD_CARE_TEAM_MEMBER')
				.setParameterArray(['^MINE^'])
				.setDataBlob(buildModifyRequestString())
				.setResponseHandler(function(reply) {
					switch (reply.getResponse().STATUS_DATA.STATUS) {
						case 'S':
							self.m_showPanel = false;
							if (self.getCriterion().provider_id === data.PRSNL_ID) {
								self.setAssignedRelationshipCode(selectedRole);
							}
							MP_ModalDialog.closeModalDialog(modalId);
							// argument passed to the retrieveComponentData is the boolean value returned from the shouldPreserveRole function 
							self.retrieveComponentData(self.shouldPreserveRole(data));
							break;
						default: // F and I
							$('#ctoApplyBtn').removeAttr('disabled');
							$('#careTeamModifyModalbody .loading-screen').remove();
							self.createErrorModal(reply.getError());
					}
				});

			request.performRequest();
		});

		MP_ModalDialog.addModalDialogObject(modifyModal);

		/**
		 * Run the callback function passed into the showModifyModal function, and bind validation on the form.
		 */
		modifyModal.setBodyDataFunction(function() {
			bodyDataFunction.call(modifyModal);
			/**
			 * Bind validation on the modify modal.
			 */
			(function bindValidation() {
				var $modalBody = $('#' + modifyModal.getBodyElementId ());
				var $firstName = $modalBody.find('#cto2FirstNameTextbox');
				var $middleName = $modalBody.find('#cto2MiddleNameTextbox');
				var $lastName = $modalBody.find('#cto2LastNameTextbox');
				var $primaryPhone = $modalBody.find('#cto2PrimaryPhoneTextbox');
				var $secondaryPhone = $modalBody.find('#cto2SecPhoneTextbox');
				var $tertiaryPhone = $modalBody.find('#cto2TerPhoneTextbox');
				var $primaryPhoneType = $modalBody.find('#cto2PrimaryPhoneTextboxInputGroup select');
				var $secondaryPhoneType = $modalBody.find('#cto2SecPhoneTextboxInputGroup select');
				var $tertiaryPhoneType = $modalBody.find('#cto2TerPhoneTextboxInputGroup select');
				var $role = $modalBody.find('.cto2-form-roles-holder');

				/**
				 * Detects whether any entered data differs from the initial value assigned to each input.
				 * @return {Boolean}
				 *         True if a change is detected
				 *         False if no change is detected
				 */
				var changeDetected = function() {
					function isChanged($elem) {
						return $elem.val() != $elem.attr('data-orig-value');
					}

					if (isChanged($firstName)) {return true; }
					if (isChanged($middleName)) {return true; }
					if (isChanged($lastName)) {return true; }
					if (isChanged($primaryPhone)) {return true; }
					if (isChanged($secondaryPhone)) {return true; }
					if (isChanged($tertiaryPhone)) {return true; }
					if (isChanged($primaryPhoneType)) {return true; }
					if (isChanged($secondaryPhoneType)) {return true; }
					if (isChanged($tertiaryPhoneType)) {return true; }
					if ($role.find('.cto2-selected-list').attr('data-value') !== $role.attr('data-orig-value')) {return true; }

					return false;
				};

				/**
				 * Validates the required fields for the form to ensure the form is ready for submission.
				 * @return {Boolean}
				 *         True if the required fields have been appropriately filled.
				 *         False if the required fields have not been appropriately filled.
				 */
				var validInput = function() {
					/**
					 * Adds or removes the te-valid class based on whether or not the textbox has a valid value.
					 *
					 * @param  {jQuery object} textInput
					 *         The text input being validated against
					 * @return {Boolean}
					 *         True if the input is valid
					 *         False if the input is invalid
					 */
					var textBoxValidation = function(textInput) {
						if (textInput.is(':not(:disabled)')) {
							if ($.trim(textInput.val()).length > 0) {
								textInput.addClass('te-valid');
								return true;
							}
							else {
								textInput.removeClass('te-valid');
								return false;
							}
						}
						else {
							return true;
						}
					};

					/**
					 * Adds or removes the te-valid class based on whether or not the textbox has a valid value.
					 *
					 * @param  {jQuery object} phoneInput
					 *         The text input being validated against
					 * @return {Boolean}
					 *         True if the input is valid
					 *         False if the input is invalid
					 */
					var phoneValidation = function(phoneInput) {
						if (phoneInput.is(':not(:disabled)')) {
							if ($.trim(phoneInput.val()).replace(/[^\d]/g, '').length > 0) {
								phoneInput.addClass('te-valid');
								return true;
							}
							else {
								phoneInput.removeClass('te-valid');
								return false;
							}
						}
						else {
							return true;
						}
					};

					var firstNameValid = textBoxValidation($firstName);
					var lastNameValid = textBoxValidation($lastName);
					var primaryPhoneValid = phoneValidation($primaryPhone);
					var roleSelected = ($('.cto2-form-roles-holder .cto2-selected-list').length > 0);

					return (firstNameValid && lastNameValid && primaryPhoneValid && roleSelected);
				};

				/**
				 * Enables or disables the apply button based on whether valid changes have been detected.
				 */
				var checkFormStatus = function() {
					var changed = changeDetected();
					var valid = validInput();
					if (changed && valid) {
						$('#ctoApplyBtn').removeAttr('disabled');
					}
					else {
						$('#ctoApplyBtn').prop('disabled', true);
					}
				};

				// When the modify modal is first opened, we want to run validation against the data to remove
				// the default background color for fulfilled required fields.
				validInput();

				$modalBody.find('input, select').on('change keyup', checkFormStatus);
				$('.cto2-form-roles-holder').on('cto2-role-selected', checkFormStatus);
			}());
		});

		MP_ModalDialog.updateModalDialogObject(modifyModal);
		MP_ModalDialog.showModalDialog(modifyModal.getId());
	};

	/**
	 * Preps the call to the appropriate modify modal function based on the selected row's member type.
	 * @param  {Object} data
	 *         data object representing the selected row.
	 * @return {Function}
	 *         function to be called as the body data function when the modal is being rendered.
	 */
	CareTeamo2Component.prototype.prepModifyModal = function(data) {
		var self = this;

		return function() {
			switch (data.MEMBER_TYPE) {
				case "PROVIDER_RELATION": // Provider
					self.modifyProviderInfo.call(self, data);
					break;
				case "NONPROVIDER_LIFETIME_RELATION": // Non-provider
					self.modifyNonProviderInfo.call(self, data);
					break;
				case "CARE_TEAM": // Care Team
					self.modifyCareTeamInfo.call(self, data);
					break;
			}
		};
	};

	/**
	 * Binds events for the add/modify provider/non-provider modals.
	 * @param {String} modalId
	 *        Element ID for the modal.
	 */
	CareTeamo2Component.prototype.bindFormEvents = function(modalId) {
		/**
		 * Hide the selected phone type in the remaining select inputs.
		 */
		var phoneTypeChange = function() {
			var $phoneTypeSelects = $(modalId).find('.cto2-phone-type');
				$phoneTypeSelects
					.find('option')
					.prop('disabled', false)
					.css('display', '');
			$phoneTypeSelects.each(function() {
				var value = $(this).val();
				if (value !== "") {
					var title = $(this).find('[value=' + value + ']').attr('title');
					$(this).attr('title', title);
					$phoneTypeSelects
						.not($(this))
						.find('[value=' + value + ']')
						.prop('disabled', true)
						.css('display', 'none');
				}
			});
		};

		$(modalId).on('change', '.cto2-phone-type', phoneTypeChange);

		$(modalId).on('click', '.cto2-form-roles li', function(event) {
			var $target = $(event.target);
			$target.siblings().removeClass('cto2-selected-list');
			$target.addClass('cto2-selected-list');
			$('.cto2-form-roles-holder').trigger('cto2-role-selected');
		});

		phoneTypeChange();
	};

	/**
	 * Set up the form HTML for the modify provider/non-provider/care-team modals.
	 * @param  {Object} data
	 *         data object for the selected row.
	 * @param  {Array} roleList
	 *         List containing the roles to display in the modify modal.
	 * @param  {Boolean} isProvider
	 * @param  {Boolean} isFreetext
	 */
	CareTeamo2Component.prototype.modifyPersonnelInfo = function(data, roleList, isProvider, isFreetext) {
		var self = this;

		/**
		 * The function that builds the body contents when the modal is being rendered.
		 */
		var bodyDataFunction = function() {
			var $element = $(self.getProviderNonProviderFormHTML(roleList, isProvider));

			/**
			 * Sets the disabled and readonly attributes to true for the provided input.
			 * @param  {jQuery object} $inputElement
			 */
			var disableInput = function($inputElement) {
				$inputElement
					.prop('disabled', true)
					.prop('readonly', true);
			};

			/**
			 * Prepares the phone inputs for the specified phone data.
			 * @param  {Object} phone
			 *         data object that represents the phone information
			 * @param  {String} elementID
			 *         Phone textbox elementID
			 */
			var prepPhoneInputs = function(phone, elementID) {
				var $phoneTextElement = $element.find(elementID);
				var $phoneSelectElement = $element.find(elementID + 'InputGroup select');
				if (!isFreetext) {
					disableInput($phoneTextElement);
					disableInput($phoneSelectElement);
				}

				if (phone) {
					// Set the value on the phone textbox.
					$phoneTextElement
						.attr('value', phone.PHONE_NUM)
						.attr('data-orig-value', phone.PHONE_NUM);

					// Set the original value on the phone type select.
					$phoneSelectElement
						.attr('data-orig-value', phone.PHONE_TYPE_CD);

					// Remove the selected attribute from the default phone type.
					$element.find(elementID + 'InputGroup :selected')
						.removeAttr('selected');

					// Add the selected attribute to the appropriate phone type.
					$element.find(elementID + 'InputGroup [value=' + phone.PHONE_TYPE_CD + ']')
						.attr('selected', 'selected');
					$phoneTextElement.after('<input type="hidden" id="' + elementID.replace('#', '') + 'PhoneID" value="' + phone.PHONE_ID + '"/>');
				}
				else {
					// Set the original value for the textbox and select.
					$phoneTextElement
						.attr('data-orig-value', '');
					$phoneSelectElement
						.attr('data-orig-value', '');
					$phoneTextElement.after('<input type="hidden" id="' + elementID.replace('#', '') + 'PhoneID" value="0"/>');
				}
			};

			/**
			 * Prepares the text inputs that represent name information for the personnel.
			 * @param  {String} name
			 *         The existing name information for the element
			 * @param  {String} elementID
			 *         The textbox element ID
			 */
			var prepNameInputs = function(name, elementID) {
				var $nameElement = $element.find(elementID);
				$nameElement
					.attr('value', name)
					.attr('data-orig-value', name);

				if (!isFreetext){
					disableInput($nameElement);
				}
			};

			prepNameInputs(data.NAME_FIRST, '#cto2FirstNameTextbox');
			prepNameInputs(data.NAME_MIDDLE, '#cto2MiddleNameTextbox');
			prepNameInputs(data.NAME_LAST, '#cto2LastNameTextbox');

			// Sets the original value for the roles list.
			$element.find('.cto2-form-roles-holder')
				.attr('data-orig-value', data.RELTN_TYPE_CD);
			// Selects the appropriate role in the role list.
			$element.find('.cto2-form-roles-holder li[data-value=' + data.RELTN_TYPE_CD + ']')
				.addClass('cto2-selected-list');

			prepPhoneInputs(data.PHONES[0], '#cto2PrimaryPhoneTextbox');
			prepPhoneInputs(data.PHONES[1], '#cto2SecPhoneTextbox');
			prepPhoneInputs(data.PHONES[2], '#cto2TerPhoneTextbox');

			// "this" refers to the modify modal object in the calling function.
			this.setBodyHTML($element.html());

			self.bindFormEvents('#vwpModalDialogcareTeamModifyModal');
		};

		this.showModifyModal(bodyDataFunction, data);
	};

	/**
	 * Displays the modify modal for providers.
	 * @param  {Object} data
	 *         data object which represents the selected row.
	 */
	CareTeamo2Component.prototype.modifyProviderInfo = function(data) {
		var isProvider = true;
		var isFreetext = (data.FREETEXT_IND === 1);
		this.modifyPersonnelInfo(data, this.m_providerRoleCodes, isProvider, isFreetext);
	};

	/**
	 * Displays the modify modal for non-providers.
	 * @param  {Object} data
	 *         data object which represents the selected row.
	 */
	CareTeamo2Component.prototype.modifyNonProviderInfo = function(data) {
		var isProvider = false;
		var isFreetext = true;
		this.modifyPersonnelInfo(data, this.m_nonProviderRoleCodes, isProvider, isFreetext);
	};

	/**
	 * Displays the modify modal for care teams.
	 * @param  {Object} data
	 *         data object which represents the selected row.
	 */
	CareTeamo2Component.prototype.modifyCareTeamInfo = function(data) {
		var isProvider = true;
		var isFreetext = false;
		this.modifyPersonnelInfo(data, this.m_providerRoleCodes, isProvider, isFreetext);
	};

	/**
	 * This method will be called on each row click. It will check the cached data
	 * to see if this rows data has been gathered and built already. If not, it
	 * makes a call to prepareTopPane and if the param teamMembers has results
	 * it then calls the prepareBottomPane function. Finally it calls buildPaneHtml.
	 * @param {JSON} data - the results returned for the row clicked
	 * @param {JSON} teamMembers - the results returned for the team members of the row clicked
	 */
	CareTeamo2Component.prototype.prepareForRenderPane = function(data, teamMembers) {
		var self = this;
		var getContactPhones = function() {
			//add on the provider phone numbers, if they exist
			if (paneDataObj.showContactPhones > 0) {
				return [
					"<div id='cto2" + self.getComponentId() + "contactPhones' class='cto2-rp-contact-phones'>",
						paneDataObj.contactPhones,
					"</div>"
				].join("");
			}
			else {
				return "";
			}
		};
		var sidePanelContentScrollContainer = "";
		//check cached row data to see if row has already been selected
		var paneHtml = "";
		var mainPaneObj = $("#sidePanelBodyContents" + this.getComponentId());
		var paneDataObj = null;

		this.m_tableContainer.addClass("cto2-sp-hide-mode");

		paneDataObj = {
			"rowCareTeamId": data.PCT_CARE_TEAM_ID,
			"contactDisplay": "",
			"showContactPhones": 0,
			"contactPhones": "",
			"contactMedService": "",
			"showProviderTeam": 0,
			"providerTeam": "--",
			"memberListLabel": "",
			"memberList": ""
		};

		this.prepareTopPane(data, paneDataObj);

		if (teamMembers) {
			this.prepareBottomPane(data, paneDataObj, teamMembers);
		}

		//call buildPaneHtml and send obj full of row appropriate info
		paneHtml = this.buildPaneHtml(paneDataObj);

		//build the contact display (provider, team, or med service)
		var sidePanelHeaderHtml = [
			"<div class='cto2-rp-contact-group'>",
				"<div class='cto2-rp-contact-left'>",
					"<div id='cto2" + this.getComponentId() + "contactDisplay' class='cto2-rp-contact-display'>",
						paneDataObj.contactDisplay,
					"</div>",
					getContactPhones(),
				"</div>",
				//add on contact right side (med service name if team or provider or empty) and separators
				"<div class='cto2-rp-contact-right'>",
					"<div id='cto2" + this.getComponentId() + "contactMedSvc' class='cto2-rp-contact-med-svc secondary-text'>",
						paneDataObj.contactMedService,
					"</div>",
				"</div>",
			"</div>"
		].join("");

		if (!this.m_showPanel) {
			this.m_tableContainer.addClass("cto2-side-panel-addition");
			this.m_sidePanelContainer.css("display", "inline-block");
			this.m_showPanel = true;
			this.m_sidePanel.showPanel();
		}

		$("#sidePanelHeaderText" + this.getComponentId())
			.html(sidePanelHeaderHtml)
			.removeClass('hidden');

		if ($('#sidePanelScrollContainer' + this.getComponentId()).length === 0) {
			sidePanelContentScrollContainer = "<div id='sidePanelScrollContainer" + this.getComponentId() + "' class='sp-body-content-area'></div>";
			mainPaneObj.wrap(sidePanelContentScrollContainer);
		}

		this.m_sidePanel.setContents(paneHtml, this.getComponentId() + "mainContainer");

		this.addTeamClickEvents();
	};

	/**
	 * This method will prepare the paneDataObj with the information for the top portion of the preview pane.
	 * This portion contains the name, med service, phone numbers, and team of the row clicked.
	 * @param {JSON} data
	 *        The results returned for the row clicked
	 * @param {JSON} paneDataObj
	 *        The object of html and info to render in the pane later
	 */
	CareTeamo2Component.prototype.prepareTopPane = function(data, paneDataObj) {
		if (data.PRSNL_ID) {
			var phoneLen = data.PHONES.length;

			//provider panel
			paneDataObj.contactDisplay = "<span>" + data.PRSNL_NAME + "</span>";
			paneDataObj.contactMedService = "<span>" + data.PCT_MED_SERVICE_DISPLAY + "</span>";

			if (phoneLen) {
				var phoneNums = "";
				for (var i = 0; i < phoneLen; i++) {
					//add phones in div so make new lines
					phoneNums += [
						"<div class='cto2-rp-contact-phone secondary-text'>",
							data.PHONES[i].PHONE_NUM + " (" + data.PHONES[i].PHONE_TYPE + ")",
						"</div>"
					].join("");
				}

				//Add phones to object
				paneDataObj.contactPhones = phoneNums;

				//turn phone flag on
				paneDataObj.showContactPhones = 1;
			}

			if (data.PCT_TEAM_CD) {
				paneDataObj.providerTeam = "<span>" + data.PCT_TEAM_DISPLAY + "</span>";
			}

			//turn provider team flag on only for the careteam group, disable it for lifetime and shift assignments.
			paneDataObj.showProviderTeam = (data.MEMBER_TYPE == "SHIFT_ASSIGNMENTS" || data.MEMBER_TYPE == "LIFETIME_RELATIONSHIP") ? 0 : 1;
		}
		else if (data.PCT_TEAM_CD) {
			//team panel
			paneDataObj.contactDisplay = "<span>" + data.PCT_TEAM_DISPLAY + "</span>";
			paneDataObj.contactMedService = "<span>" + data.PCT_MED_SERVICE_DISPLAY + "</span>";
		}
		else {
			//medical service panel
			paneDataObj.contactDisplay = "<span>" + data.PCT_MED_SERVICE_DISPLAY + "</span>";

		}
	};

	/**
	 * This method will prepare the paneDataObj with the information for the bottom portion of the preview pane.
	 * This portion contains the team members of the row clicked, segmented by teams 
	 * if at med service level.
	 * @param {JSON} data - the results returned for the row clicked
	 * @param {JSON} paneDataObj - the object of html and info to render in the pane later
	 * @param {JSON} teamMembers - the results returned for the team members of the row clicked
	 */
	CareTeamo2Component.prototype.prepareBottomPane = function(data, paneDataObj, teamMembers) {
		var ctI18n = i18n.discernabu.careteam_o2;
		var memberListing = "";
		var codesArray = MP_Util.LoadCodeListJSON(teamMembers.CODES);
		var personName = "";
		var personPhone = "";
		var memberId = 0;
		var prsnlArr = MP_Util.LoadPersonelListJSON(teamMembers.PRSNL);
		var phoneArr = MP_Util.LoadPhoneListJSON(teamMembers.PHONE_LIST);
		var phoneObj = null;
		
		//set up prsnl array with phone numbers	
		var showTeamPanel = (data.PRSNL_ID && data.PCT_TEAM_CD) || data.PCT_TEAM_CD;			
		var prsnlArrLen = prsnlArr.length;
		
		//add each persons phone number to the prsnlArr object
		for (var m = 0; m < prsnlArrLen; m++) {
			
			phoneObj = MP_Util.GetValueFromArray(prsnlArr[m].name, phoneArr);
			
			prsnlArr[m].value.phone = phoneObj.phones.length ? phoneObj.phones[0].phoneNum : "--";

		}
		
		if (showTeamPanel) {
			
			//sort prsnlArr after phones have been added
			prsnlArr.sort(function (a, b) {
				if (a.value.fullName.toUpperCase() > b.value.fullName.toUpperCase()) {
					return 1;
				}
				
				if (a.value.fullName.toUpperCase() < b.value.fullName.toUpperCase()) {
					return -1;
				}
				
				return 0;
			});
			
			//prepare team or prsnl under team panel
			var prsnlLength = prsnlArr.length;
			
			//for each listing in the phone_list array, take name and number (if it exists)
			for (var j = 0; j < prsnlLength; j++) {
				memberId = prsnlArr[j].name;

				if (data.PRSNL_ID === memberId) {
					continue;
				}
				
				personName = MP_Util.GetValueFromArray(memberId, prsnlArr).fullName;
				personPhone = MP_Util.GetValueFromArray(memberId, prsnlArr).phone;
				memberListing += "<dl class='cto2-member-listing'><dt>Name</dt><dd>" + personName + "</dd><dt>Phone</dt><dd class='secondary-text'>" + personPhone + "</dd></dl>";
			}
			
			//Add label for team members
			if (memberListing) {
				paneDataObj.memberListLabel = "<span class='secondary-text'>" + ctI18n.TEAM_MEMBERS + "</span>";
			}
			
		} else {
			
			//show med service or prsnl under med service panel
			var teamCnt = teamMembers.PCT_TEAMS.length;
			var teamCd = 0;
			var teamDisplay = "";
			var teamPrsnlCnt = 0;
			var teamFacilityCd = 0;
			
			//go through each pct_team and compare each id to the stored object array
			for (var k = 0; k < teamCnt; k++) {
				
				teamCd = teamMembers.PCT_TEAMS[k].PCT_TEAM_CD;
				teamPrsnlCnt = teamMembers.PCT_TEAMS[k].PRSNL.length;
				teamFacilityCd = teamMembers.PCT_TEAMS[k].FACILITY_CD;
				//add team header if team cd > 0
				if (teamCd && (teamFacilityCd === data.FACILITY_CD)) {
					teamDisplay = MP_Util.GetValueFromArray(teamCd, codesArray).display;
					memberListing += "<div class='cto2-member-group closed'><h3 class='cto2-team-header'><span class='cto2-team-display secondary-text'>" + teamDisplay + "</span><span class='cto2-team-toggle'>&nbsp;</span></h3>";
				}
				
				//go through each prsnlID in team and find name and phone number, store in object
				for (var x = 0; x < teamPrsnlCnt; x++) {
					memberId = teamMembers.PCT_TEAMS[k].PRSNL[x].PRSNL_ID;

					teamMembers.PCT_TEAMS[k].PRSNL[x].FULL_NAME = MP_Util.GetValueFromArray(memberId, prsnlArr).fullName;
					teamMembers.PCT_TEAMS[k].PRSNL[x].PHONE = MP_Util.GetValueFromArray(memberId, prsnlArr).phone;
				}
				
				//sort team members by name
				teamMembers.PCT_TEAMS[k].PRSNL.sort(function (a, b) {
					if (a.FULL_NAME.toUpperCase() > b.FULL_NAME.toUpperCase()) {
						return 1;
					}
					
					if (a.FULL_NAME.toUpperCase() < b.FULL_NAME.toUpperCase()) {
						return -1;
					}
					
					return 0;
				});
				
				//for each member in this team, add their info to the listing
				for (var y = 0; y < teamPrsnlCnt; y++) {
					memberId = teamMembers.PCT_TEAMS[k].PRSNL[y].PRSNL_ID;
					if (data.PRSNL_ID === memberId) {
						continue;
					}
					if(teamFacilityCd === data.FACILITY_CD){
						memberListing += "<dl class='cto2-member-listing'><dt>Name</dt><dd class='cto2-member-name'>" + teamMembers.PCT_TEAMS[k].PRSNL[y].FULL_NAME + "</dd><dt>Phone</dt><dd class='secondary-text'>" + teamMembers.PCT_TEAMS[k].PRSNL[y].PHONE + "</dd></dl>";
					}
					
				}
				
				//close member group for this team code
				if (teamCd && (teamFacilityCd === data.FACILITY_CD)) {
					memberListing += "</div>";
				}
			}
			
			//Add label for medical service members
			if (memberListing) {
				paneDataObj.memberListLabel = "<span class='secondary-text'>" + ctI18n.MEDICAL_SERVICE_MEMBERS + "</span>";
			}	
			
		}
		
		//Add listing to pane
		paneDataObj.memberList = memberListing;
	};
	
	/**
	 * This method will be called if team headers are added under a med service
	 * to add click events to each one
	 */
	CareTeamo2Component.prototype.addTeamClickEvents = function() {
		var self = this;
		var compID = this.getComponentId();

		//Function to remove or add the closed class depending on if it exists already
		$("#cto2" + compID + "memberList").on("click", ".cto2-member-group", function () {
			$(this).toggleClass("closed");
			self.m_sidePanel.expandSidePanel();
		});

	};

	/**
	 * This function will return the row id from the id of DOM element.
	 * 
	 * @param {element}
	 *            rowObj - the row element to return the id
	 * @return {String} 
	 * 			  rowId - the row id of the param element
	 */
	CareTeamo2Component.prototype.getRowId = function(rowObj) {

		var rowId = "";

		var identifiers = $(rowObj).attr("id").split(":");

		if (identifiers.length > 0) {
			//rowObj id now consists of the group name, hence retreiving the row id's appropriately.
			rowId = identifiers[2];
		}

		return rowId;
	};

	/*
	 * * This is to add cellClickExtension for the component table.
	 */
	CareTeamo2Component.prototype.addCellClickExtension = function() {

		var component = this;

		var cellClickExtension = new TableCellClickCallbackExtension();

		cellClickExtension.setCellClickCallback(function(event, data) {
			component.onRowClick(event, data);
		});

		this.m_careTeamTable.addExtension(cellClickExtension);
	};

	/**
	 * This is a callback which will be called on cell click of the component
	 * table
	 *
	 * @param {Event Object}
	 * 			  event - the event that triggered the onClick
	 * @param {JSON}
	 *            data - the data of the row that was clicked
	 */
	CareTeamo2Component.prototype.onRowClick = function(event, data) {

		var selRow = $(event.target).parents("dl.result-info");
		this.m_rowWasClicked = true;

		if (!selRow.length || data.RESULT_DATA === null) {
			return;
		}

		//call function to get care team data for selected row
		this.getTeamMembers(selRow, data.RESULT_DATA);
	};

	/**
	 * This function calls mp_get_pct_care_team_config to get the appropriate team information for the selected row.
	 *
	 * @param {element} selRow
	 *        The current element that was selected
	 * @param {JSON} rowData
	 *        The data of the row that was clicked
	 */
	CareTeamo2Component.prototype.getTeamMembers = function(selRow, rowData) {
		var self = this;
		var criterion = this.getCriterion();
		var isInitialLoad = !this.m_rowWasClicked;
		var cachedData = MP_Util.GetValueFromArray(rowData.PCT_CARE_TEAM_ID, this.m_cachedRowData);
		var sendAr = [];

		// Check for cached data, if exists, send to update info and skip rest of function
		if (cachedData || !rowData.PCT_CARE_TEAM_ID || rowData.ASSIGN_TYPE) {
			this.updateInfo(selRow, rowData, isInitialLoad, cachedData);
			return;
		}

		// Put loading spinner in preview pane and hide buttons
		$("#sidePanelBodyContents" + this.getComponentId()).html("<div class='cto2-loading-spinner'>&nbsp;</div>");

		$("#sidePanelHeaderText" + this.getComponentId()).addClass("hidden");
		$("#cornerCloseButton" + this.getComponentId()).addClass("hidden");
		$("#cto2" + this.getComponentId() + "rpBtnHolder").addClass("hidden");

		// If prsnl under team or just team level
		if((rowData.PRSNL_ID && rowData.PCT_TEAM_CD) || rowData.PCT_TEAM_CD) {
			sendAr.push("^MINE^", criterion.logical_domain_id, cclNumber(rowData.PCT_MED_SERVICE_CD), cclNumber(rowData.PCT_TEAM_CD), 0.0, 0, 1, rowData.FACILITY_CD+".0");
		} else {
			//if prsnl under med service or just med service
			sendAr.push("^MINE^", criterion.logical_domain_id, cclNumber(rowData.PCT_MED_SERVICE_CD), -1, 0.0, 0, 1, rowData.FACILITY_CD+".0");
		}

		var request = new MP_Core.ScriptRequest(self, "");
		request.setProgramName("MP_GET_PCT_CARE_TEAM_CONFIG");
		request.setParameters(sendAr);
		request.setAsync(true);
		MP_Core.XMLCCLRequestCallBack(null, request, function(reply) {
			var status = reply.getStatus();
			if(status === "S") {
				var response = reply.getResponse();

				//add new team member data to cache
				self.m_cachedRowData.push({
					"name": rowData.PCT_CARE_TEAM_ID,
					"value": response
				});

				self.updateInfo(selRow, rowData, isInitialLoad, response);
			}
			else if (status === "F") {
				self.finalizeComponent(MP_Util.HandleErrorResponse(self.getStyles().getNameSpace(), reply.getError()), "");
			}
			else if (status === "Z") {
				// Add that no team member data exists for row to cache
				self.m_cachedRowData.push({
					"name": rowData.PCT_CARE_TEAM_ID,
					"value": null
				});

				self.updateInfo(selRow, rowData, isInitialLoad, null);
			}
		});
	};

	// This function will be called on click of Remove Button to navigate to PPR Summary tab of the Patient Information.//
	CareTeamo2Component.prototype.removeLifetimeReltns = function() {
        var criterion = this.getCriterion();
        var personId = criterion.person_id;
        var encntrId = criterion.encntr_id;
        var str = "PPR Summary";        
        this.tabName = [str];
        try {
            var pprLink = '/PERSONID=' + personId + ' /ENCNTRID=' + encntrId + ' /FIRSTTAB=^' + this.tabName + '^';
            APPLINK(0, criterion.executable, pprLink);            
        } catch(err) {
            MP_Util.LogJSError(err, this, "care-team-o2.js","removeLifetimeReltns");
            throw (err);
        }

    };

	/**
	 * Processes the passed in results to have an icon span before it for the
	 * contact column and sets up a field in the json to show the appropriate
	 * information in for the contact column based on what level of info is
	 * provided (ie med only, team, or provider). Also sets up a phone number to
	 * be displayed if one exists. This setup is for the component table.
	 * 
	 * @param {JSON Object} 
	 * 			  results - the listing of results returned from the
	 *            backend script mp_get_care_team_assign
	 */
	CareTeamo2Component.prototype.processResultsForRender = function(results) {
		var resultLength = results.length;
		var careTeamResult = null;
		var ctI18n = i18n.discernabu.careteam_o2;

		for ( var i = 0; i < resultLength; i++) {

			careTeamResult = results[i];
			// Prepare team icon for use
			var contactIconSpan = "<span class='cto2-contact-icon'>&nbsp;</span>";

			// Set up the contact to display which of these is available first:
			// Physician, Team, or --
			// Wrap each contact item in a span with its type of contact to
			// better control descended css
			if (careTeamResult.PRSNL_ID) {
				careTeamResult.CONTACT_DISPLAY = ("<span class='cto2-contact-provider'>"+ contactIconSpan + careTeamResult.PRSNL_NAME + "</span>");
			} else if (careTeamResult.PCT_TEAM_DISPLAY) {
				careTeamResult.CONTACT_DISPLAY = ("<span class='cto2-contact-team'>"+ contactIconSpan + careTeamResult.PCT_TEAM_DISPLAY + "</span>");
			} else {
				careTeamResult.CONTACT_DISPLAY = ("<span class='cto2-contact-medserv'>" + contactIconSpan + careTeamResult.PCT_MED_SERVICE_DISPLAY + "</span>");
			}

			// Set up the phone number to display the phone or --
			careTeamResult.PHONE_DISPLAY = careTeamResult.PHONES.length ? careTeamResult.PHONES[0].PHONE_NUM: "--";

			// For cross-visits and non-providers (Service and Team columns are set to display --)
			if (!careTeamResult.hasOwnProperty("PCT_MED_SERVICE_DISPLAY")) {
				careTeamResult.PCT_MED_SERVICE_DISPLAY = "--";
			}
			if (!careTeamResult.hasOwnProperty("PCT_TEAM_DISPLAY")) {
				careTeamResult.PCT_TEAM_DISPLAY = "--";
			}

			// Set up the Role/Relationship column to display role or --

			//There are four possible care team comibination: (med service|team|personel),(med service|team),(med service),(med service|personel)
			//Falls in to if block in the case that there is a personal for care team. The realtionship will be set to the realtionship of personel to patient.
			//This if block will take care of the (med service|team|personel), and (med service|personel) case
			//This if block also takes care of shift assignments meaning it is possible for just a (personel) being assigned. 
			if (careTeamResult.PRSNL_ID) {
				if (careTeamResult.RELTN_TYPE) {
					careTeamResult.RELTN_TYPE_DISPLAY = careTeamResult.RELTN_TYPE;
				} else if (careTeamResult.ASSIGN_TYPE) {
					careTeamResult.RELTN_TYPE_DISPLAY = careTeamResult.ASSIGN_TYPE;
				} else {
					careTeamResult.RELTN_TYPE_DISPLAY = "--";
				}
			//In the case that there is not a personel, this else block will be executed  
			} else {
				//This if block will take care of (med service|team) case.
				if (careTeamResult.PCT_TEAM_CD ) {
					if (careTeamResult.FACILITY_CD) {
						careTeamResult.RELTN_TYPE_DISPLAY = careTeamResult.PCT_MED_SERVICE_DISPLAY + '|' + careTeamResult.PCT_TEAM_DISPLAY;
					} else {
						careTeamResult.RELTN_TYPE_DISPLAY = careTeamResult.PCT_MED_SERVICE_DISPLAY + '|' + careTeamResult.PCT_TEAM_DISPLAY + ("<span class='cto2-all-facility-label secondary-text'> (" + ctI18n.ALL_FACILITIES + ")</span>");
					}
				//This else block will take care of (med service) case.
				} else {
					if (careTeamResult.FACILITY_CD) {
						careTeamResult.RELTN_TYPE_DISPLAY = careTeamResult.PCT_MED_SERVICE_DISPLAY;
					} else {
						careTeamResult.RELTN_TYPE_DISPLAY = careTeamResult.PCT_MED_SERVICE_DISPLAY + ("<span class='cto2-all-facility-label secondary-text'> (" + ctI18n.ALL_FACILITIES + ")</span>");
					}
				}
			}

			// Set up the team column to display team or -- 
			if (careTeamResult.PCT_TEAM_CD == 0) {
				careTeamResult.PCT_TEAM_DISPLAY = "--";
			}

			//add the PCT_CARE_TEAM_ID's in the assignedCareTeams array only if exists
			if (careTeamResult.PCT_CARE_TEAM_ID) {
				this.assignedCareTeams.push(careTeamResult.PCT_CARE_TEAM_ID);
			}

			if (careTeamResult.MEMBER_TYPE === "CARE_TEAM" && !careTeamResult.FACILITY_CD){
				careTeamResult.PCT_MED_SERVICE_DISPLAY = careTeamResult.PCT_MED_SERVICE_DISPLAY + ("<span class='cto2-all-facility-label secondary-text'> (" + ctI18n.ALL_FACILITIES + ")</span>");
			}

		}
		
	};

	/**
	 * This function does the building of the component table. Once done it calls checkPrimaryContact to handle if one
	 * exists in the table data and then it calls addReadPane and passes it a 1 to say we have data from the script.
	 *
	 * @param {object} reply
	 *        The reply from retrieveComponentData calling mp_get_care_team_assign
	 */
	CareTeamo2Component.prototype.renderComponent = function(reply) {
		var compId = this.getComponentId();
		var ctI18n = i18n.discernabu.careteam_o2;
		var self = this;
		var thisVisitGroup = null;
		var crossVisitGroup = null;
		var nonprovidersGroup = null;

		try {
			this.m_renderTimer = MP_Util.CreateTimer(this.getComponentRenderTimerName());

			//If the "plus add" is enabled within the component, createPlusAddControl is invoked.
			this.setPlusAddCustomInd(true);
			if (this.isPlusAddEnabled() && this.isAuthorized) {
				//If within a browser, manually add the plus add icon
				if (!CERN_Platform.inMillenniumContext()) {
					this.placePlusAddIcon();
					this.m_plusAddIconEle = $("#" + this.getStyles().getId()+'Add');
				}
				else {
					this.m_plusAddIconEle = $("#" + this.getStyles().getNameSpace() + compId).find(".add-plus");
				}
				this.m_plusAddIconEle.addClass('enabled');
				//this function would enable us to have customized plus add functionality.
			 	this.createPlusAddControl();
			}

			// get result information
			var thisVisit = reply.CARE_TEAMS.concat(reply.SHIFT_ASSIGNMENTS);
			var crossVisit = reply.LIFETIME_RELTN.concat(reply.PROVIDER_RELTN);
			var nonProviders = reply.NONPROVIDER_LIFETIME_RELTN;

			this.m_primaryContactEventId = reply.PRIMARY_CONTACT.EVENT_ID;
			this.m_primaryContactEventCd = reply.PRIMARY_CONTACT.EVENT_CD;

			//care teams and shift assignment data
			if (thisVisit) {
				this.processResultsForRender(thisVisit);
			}

			//providers Data
			if (crossVisit) {
				this.processResultsForRender(crossVisit);
			}

			//non-provider relation data
			if (nonProviders) {
				this.processResultsForRender(nonProviders);
			}

			this.m_careTeamTable = new ComponentTable();
			this.m_careTeamTable.setNamespace(this.getStyles().getNameSpace() + compId);

			// create the medical service column
			var roleColumn = new TableColumn();
			roleColumn.setColumnId("RELATIONSHIP");
			roleColumn.setCustomClass("cto2-relationship-col");
			roleColumn.setColumnDisplay(ctI18n.RELATIONSHIP);
			roleColumn.setRenderTemplate('${ RELTN_TYPE_DISPLAY }');


			// create the contact column
			var contactColumn = new TableColumn();
			contactColumn.setColumnId("CONTACT");
			contactColumn.setCustomClass("cto2-contact-col");
			contactColumn.setColumnDisplay(ctI18n.CONTACT);
			contactColumn.setPrimarySortField("CONTACT_DISPLAY");
			contactColumn.setIsSortable(true);
			contactColumn.setRenderTemplate('${ CONTACT_DISPLAY }');

			// create the phone column
			var phoneColumn = new TableColumn();
			phoneColumn.setColumnId("PHONE");
			phoneColumn.setCustomClass("cto2-phone-col");
			phoneColumn.setColumnDisplay(ctI18n.PHONE);
			phoneColumn.setRenderTemplate('${ PHONE_DISPLAY }');

			//create service column
			var serviceColumn = new TableColumn();
			serviceColumn.setColumnId("SERVICE");
			serviceColumn.setColumnDisplay(ctI18n.SERVICE);
			serviceColumn.setCustomClass("cto2-sp-hide-col");
			serviceColumn.setRenderTemplate('${ PCT_MED_SERVICE_DISPLAY }');

			//create team column
			var teamColumn = new TableColumn();
			teamColumn.setColumnId("TEAM");
			teamColumn.setColumnDisplay(ctI18n.TEAM);
			teamColumn.setCustomClass("cto2-sp-hide-col");
			teamColumn.setRenderTemplate('${ PCT_TEAM_DISPLAY }');

			// add the columns to the table
			this.m_careTeamTable.addColumn(roleColumn);
			this.m_careTeamTable.addColumn(contactColumn);
			this.m_careTeamTable.addColumn(phoneColumn);
			this.m_careTeamTable.addColumn(serviceColumn);
			this.m_careTeamTable.addColumn(teamColumn);

			//Creating a group for displaying care team and shift assn. results.
			if(thisVisit && thisVisit.length){
				thisVisitGroup = new TableGroup()
					.setDisplay(ctI18n.VISIT)
					.setGroupId(compId + "CARETEAMANDSHIFTASSN")
					.bindData(thisVisit)
					.setCanCollapse(false);
				this.m_careTeamTable.addGroup(thisVisitGroup);
			}

			//Create providers section - Don't display if there are no results
			if(crossVisit && crossVisit.length){
				crossVisitGroup = new TableGroup()
					.setDisplay(ctI18n.CROSS_VISITS)
					.setGroupId(compId + "PROVIDERS")
					.setCanCollapse(false)
					.bindData(crossVisit);
				this.m_careTeamTable.addGroup(crossVisitGroup);
			}

			//Create non-providers section - Don't display if there are no results
			if(nonProviders && nonProviders.length){
				nonprovidersGroup = new TableGroup()
					.setDisplay(ctI18n.NON_PROVIDER)
					.setGroupId(compId + "NONPROVIDER")
					.setCanCollapse(false)
					.bindData(nonProviders);
				this.m_careTeamTable.addGroup(nonprovidersGroup);
			}

			// add cell click to change preview pane based on selection
			this.addCellClickExtension();

			// store off the component table
			this.setComponentTable(this.m_careTeamTable);

			// Finalize the component
			this.finalizeComponent([
				'<div id="' + compId + 'mainContainer" class="cto2-main-container">',
					'<div id="' + compId + 'tableView" class="cto2-table">',
						this.m_careTeamTable.render(),
					'</div>',
				'</div>'
			].join(""));

			// Call function that checks for the primary contact and sets of a chain
			// of events for viewing it, if exists
			this.checkPrimaryContact(reply, thisVisit);

			// Add the preview pane. Have to include this after finalize due to DOM
			// elements not existing until finalize
			this.addReadPane(1); // send 1 to indicate we have results

			//Perform a visual adjustment for the preview pane
			var $previewPane = $("#pp_" + compId + "_cto2");
			$previewPane.css("width", "100%");

			//Force a resize event to add scroll bar
			this.resizeComponent();

			// Attach Listeners
			this.attachListeners();

			/**
			 * Override the toggleColumnSort method of ComponentTable to
			 * re-highlight the previously selected row and move the physician
			 * contact row to the top, if it exists.
			 *
			 * @param {string}
			 *            columnId - the column to be sorted
			 */
			this.m_careTeamTable.toggleColumnSort = function(columnId) {
				// call the base class functionality to sort the column
				ComponentTable.prototype.toggleColumnSort.call(this, columnId);

				// Call function that checks for the primary contact and sets of a
				// chain of events for viewing it, if exists
				self.checkPrimaryContact(reply);
			};
		}
		catch (err) {
			if (this.m_renderTimer) {
				this.m_renderTimer.Abort();
				this.m_renderTimer = null;
			}
			MP_Util.LogJSError(err, self, "care-team-o2.js", "renderComponent");
			throw (err);
		}
		finally {
			if (this.m_renderTimer) {
				this.m_renderTimer.Stop();
			}
		}
	};

	/*
	 ** Register the following events:
	 *  1. reading pane mouse enter/leave
	 *  2. Expand/Collapse icon click
	 */
	CareTeamo2Component.prototype.attachListeners = function() {

		var self = this;
		var compID = this.getComponentId();

		/*
		 ** Register the mouse enter event for reading pane to show the expand/collapse bar.
		 */
		var expClpsIconObj = $("#" + compID + "rpExpandCollapseIcon");
		var expClpsBarObj = $("#" + compID + "rpExpandCollapse");
		var scrollCont = null;
		var cto2Content = $("#cto2Content" + compID);
		var ppId = "#pp_" + compID + "_cto2";

		//When the user hovers over the preview pane, if the content exceeds the height of the preview pane,
		//an expand/collapse control is presented.
		cto2Content.on("mouseenter", ppId, function() {
			scrollCont = $("#" + compID + "rpScrollContainer");
			
			//if the exp/coll bar is visisble, do not carry on this code
			if (!expClpsBarObj.hasClass("hidden")) {
				return;
			}
			
			// If the reading pane info is overflowed or has a scroll bar, show the expand icon
			if ((this.scrollHeight > this.offsetHeight) || scrollCont.hasClass("cto2-on-expand")) {
				expClpsIconObj.addClass("cto2-expand");
				expClpsIconObj.removeClass("cto2-collapse");
				// make the section visible.
				expClpsBarObj.removeClass("hidden");
			}
		});

		/*
		 ** Register the mouse leave event for reading pane to hide the expand/collapse bar.
		 */
		cto2Content.on("mouseleave", ppId, function() {

			if (expClpsIconObj.hasClass("cto2-expand")) {
				// Hide the section.
				expClpsBarObj.addClass("hidden");
			}
		});

		/*
		 ** Register the click events for expand/collapse icon in the reading pane.
		 */
		expClpsIconObj.click(function() {
			self.onExpandCollapsePane();
		});

		/*
		 ** Set the tabindex to -1 so clicking outside the component causes focusout
		 *	to get triggered. The closest logic checks the element that was clicked
		 *	on to trigger the focusout and makes sure that element isn't part of
		 *	the component.
		 */
		//Commenting out focusout functionality as it is causing too many fixes
		//Leaving here so that later, if browsers improve it can be used again
		/*compCont.attr("tabindex", -1);
		compCont.focusout(function() {
			if(!($(event.toElement).closest(compCont).length)) {
				component.collapsePane();
			}
		});*/
	};

	/*
	 ** This will be called on the click event of expand/collapse icon in the reading pane.
	 *  On expand, set max-height for scroll container and extend the height to just above the bottom of page.
	 *  Reset the above on collapse.
	 */
	CareTeamo2Component.prototype.onExpandCollapsePane = function() {
		var compID = this.getComponentId();
		var ppObject = $("#pp_" + compID + "_cto2");
		var tableViewObj = $("#" + compID + "tableView");
		var self = this;
		if (!ppObject.length) {
			return;
		}
		var scrollContainer = $("#" + compID + "rpScrollContainer");
		var contentObj = $("#cto2" + compID + "rpContent");
		var expClpsIconObj = $("#" + compID + "rpExpandCollapseIcon");
		var readPane = $("#" + compID + "readPane");

		// Expand the view
		if (expClpsIconObj.hasClass("cto2-expand")) {
			// Upon expand, absolute positioning is applied to allow the preview pane to expand over other content
			readPane.css({
				position: "absolute"
			});
			// Add the  styles like shadow.
			ppObject.addClass("cto2-focusin");

			var windowPadding = 70; //extra padding at bottom of pane between window
			var maxViewHeight = $("#vwpBody").height() - windowPadding;
			var contentHeight = contentObj[0].offsetHeight;
			var titleHeight = contentHeight - scrollContainer.height();

			ppObject.css("max-height", maxViewHeight + "px");
			ppObject.css({
				"min-height": Math.max(tableViewObj.height(), self.m_previewPaneMinHeight) + "px"
			});
			ppObject.css("height", "auto");

			var scrollMaxHeight = ppObject.height() - titleHeight;

			// To enable the scroll bar, set the max-height. Incrementing scrollMaxHeight to prevent issues
			// when the content is the same height as the max (its finicky)
			scrollContainer.css("max-height", (++scrollMaxHeight) + "px");

			if (scrollMaxHeight == scrollContainer.height()) {
				scrollContainer.addClass("cto2-on-expand");
				scrollContainer.css("margin-right", -7 + "px");
			}

			// Replace the expand-collapse icon
			expClpsIconObj.addClass("cto2-collapse");
			expClpsIconObj.removeClass("cto2-expand");
		}
		// Collapse the view
		else {
			this.collapsePane();
			//Revert the positioning of the preview pane
			readPane.css({ position: "relative" });
		}

	};

	/*
	 ** This will be called on the click event of expand/collapse icon in the reading pane.
	 *  On collapse, set reset height for scroll container.
	 */
	CareTeamo2Component.prototype.enableScrollBar = function() {
		var compID = this.getComponentId();
		var scrollContainer = $("#" + compID + "rpScrollContainer");
		var contentObj = $("#cto2" + compID + "rpContent");
		var ppObject = $("#pp_" + compID + "_cto2");
		var expClpsIconObj = $("#" + compID + "rpExpandCollapseIcon");
		var expClpsBarObj = $("#" + compID + "rpExpandCollapse");
		
		if (contentObj.height() > ppObject.height()) {
			expClpsIconObj.addClass("cto2-expand");
			expClpsIconObj.removeClass("cto2-collapse");
			// make the section visible.
			expClpsBarObj.removeClass("hidden");
		}
		
		if (!scrollContainer.hasClass("cto2-on-expand")) {
			var contentHeight = contentObj[0].offsetHeight;
			var titleHeight = contentHeight - scrollContainer.height();
			
			
			var scrollMaxHeight = ppObject.height() - titleHeight;
			
			// To enable the scroll bar, set the max-height.
			scrollContainer.css("max-height", (++scrollMaxHeight) + "px");
			
			if (scrollMaxHeight == scrollContainer.height()) {
				scrollContainer.addClass("cto2-on-expand");
				scrollContainer.css("margin-right", -7 + "px");
			}
		}
	};
	
	/*
	 ** This will be called on the click event of expand/collapse icon in the reading pane.
	 *  On collapse, set reset height for scroll container.
	 */
	CareTeamo2Component.prototype.collapsePane = function() {
		var compID = this.getComponentId();
		var expClpsIconObj = $("#" + compID + "rpExpandCollapseIcon");
		var scrollContainer = $("#" + compID + "rpScrollContainer");

		if (expClpsIconObj.hasClass("cto2-collapse")) {

			var infoHeight = $("#" + compID + "tableView").height();
			var expClpsBarObj = $("#" + compID + "rpExpandCollapse");
			var ppObject = $("#pp_" + compID + "_cto2");

			// Set the height of the pane as the max of table view or min height
			ppObject.css("height", Math.max(this.m_previewPaneMinHeight, infoHeight) + "px");

			// To disable the scroll bar, set the overflow as hidden and remove the max-height.
			scrollContainer.css("max-height",  "none");
			scrollContainer.removeClass("cto2-on-expand");
			scrollContainer.css("margin-right", 0 + "px");
			
			// Remove collapse icon
			expClpsIconObj.removeClass("cto2-collapse");
			// Hide the section
			expClpsBarObj.addClass("hidden");
			// Remove the  styles like shadow.
			ppObject.removeClass("cto2-focusin");		
		}
	};

	/**
	 * This function finds the primary contact row in the result data, if it
	 * matches the primary contact info and appends the (Primary) label to that
	 * row.
	 * 
	 * @param {JSON
	 *            object} reply - the reply from retrieveComponentData calling
	 *            mp_get_care_team_assign
	 */
	CareTeamo2Component.prototype.checkPrimaryContact = function(reply) {
		var primaryContactTeamId = 0;
		var careTeamResult = null;
		var rowObj = null;
		var contactSpan = null;
		var ctI18n = i18n.discernabu.careteam_o2;
		var careTeams = reply.CARE_TEAMS;
		var primaryContact = reply.PRIMARY_CONTACT;
		var primaryContactAssignId = 0;
		var i = 0;
		var compID = this.getComponentId();
		// find the primary contact row, if it exists
		if (primaryContact.PROVIDER_ID) {
			primaryContactTeamId = primaryContact.PCT_CARE_TEAM_ID;

			// traverse results to find matching pct_care_team_id
			for (i = 0; i < careTeams.length; i++) {

				careTeamResult = careTeams[i];

				// compare each results pct_care_team_id with the primary
				// contact team id to check for a match
				if (careTeamResult.PCT_CARE_TEAM_ID === primaryContactTeamId) {
					// Find the appropriate contact row 
					// To use jquery here I would have to double-backslash the colons
					this.m_providerRowId = "cto2" + compID + ":" + compID + "CARETEAMANDSHIFTASSN:row" + i;
					rowObj = document.getElementById(this.m_providerRowId+ ":CONTACT");
					contactSpan = $(rowObj).find(".cto2-contact-provider");

					// append the primary label
					$(contactSpan).append("<span class='cto2-primary-label secondary-text'>("+ ctI18n.PRIMARY + ")</span>");
					careTeams[i].IS_PRIMARY = true;
					primaryContactAssignId = careTeamResult.DCP_SHIFT_ASSIGN_ID;

				}
				careTeams[i].IPASS_INFO = reply.PRIMARY_CONTACT;
			}

			for (i = 0; i < careTeams.length; i++) {
				careTeams[i].PRIMARY_ASSIGN_ID = primaryContactAssignId;
			}

			// Call function that moves primary row to top of component table
			this.movePrimaryToTop();
			} else {
			//retreiving appropriate rowId.
			// call function to redo row highlighting, based on afterSort
			if (this.m_rowWasClicked) {
				rowObj = document.getElementById(this.m_lastSelectedRow);

				// put normal highlight back on last selected row
				this.updateSelRowBgColor(rowObj, false);

			} else {
				// since its on initial load, send the first row and true to
				// indicate so it does the dark color
				rowObj = document.getElementById(this.m_lastSelectedRow);

				// put normal highlight back on last selected row
				this.updateSelRowBgColor(rowObj, true);
			}
		}

	};

	/**
	 * This function finds the primary contact row and moves it to the top of
	 * the component table.
	 */
	CareTeamo2Component.prototype.movePrimaryToTop = function() {
		var primaryRow = document.getElementById(this.m_providerRowId);
		// find item with id that matched providerRowId
		if (primaryRow) {
			var compId = this.getComponentId();
			// prepend correct row to top of list of rows of careteam group which consists of care team assignments.
			$("#cto2" + compId + "\\:" + compId + "CARETEAMANDSHIFTASSN div").prepend(primaryRow);
			// call function to fix zebra stripes after shifting rows
			this.fixZebraStripes();
		}
	};

	/**
	 * This function resets the zebra striping for the component table
	 */
	CareTeamo2Component.prototype.fixZebraStripes = function() {
		var compID = this.getComponentId();
		//fix the zebra stripes for the careteam group which consists of care team assignments.
		var tableBodyArr = $("#cto2" + compID + "\\:" + compID + "CARETEAMANDSHIFTASSN div").children();
		// redo zebra striping
		for ( var i = 0; i < tableBodyArr.length; i++) {
			tableBodyArr[i].className = "result-info "+ ((i % 2 === 0) ? "odd" : "even");
		}

		// call function to redo row highlighting, based on afterSort
		// if afterSort
		if (this.m_rowWasClicked) {
			var rowObj = document.getElementById(this.m_lastSelectedRow);

			// put normal highlight back on last selected row
			this.updateSelRowBgColor(rowObj, false);

		}

	};

	/**
	 * This function renders an empty box to represent an empty component table
	 * and a preview pane with a link to add an assignment.
	 */
	CareTeamo2Component.prototype.renderNoCareTeam = function() {

		var compId = this.getComponentId();
		var ctI18n = i18n.discernabu.careteam_o2;
		
		try {
			// main component container having both component table and preview pane
			var jsHTML = "<div id ='"+ compId+ "mainContainer' class ='cto2-main-container'><div id ='"	+ compId+ "tableView' class ='cto2-empty-table'><span class='cto2-no-results disabled'>"+ ctI18n.NO_RESULTS + "</span></div><div id ='" + compId+ "readPane' class = 'cto2-read-pane'>&nbsp;</div></div>";
	
			//If the "plus add" is enabled within the component, createPlusAddControl is invoked.
			if(this.isPlusAddEnabled() && this.isAuthorized) {
				//If within a browser, manually add the plus add icon
				if (!CERN_Platform.inMillenniumContext()) {
					this.placePlusAddIcon();
					this.m_plusAddIconEle = $("#" + this.getStyles().getId()+'Add');
				} else {
					this.m_plusAddIconEle = $("#" + this.getStyles().getNameSpace() + compId).find(".add-plus");
				}
				this.m_plusAddIconEle.addClass('enabled');
				//this function would enable us to have customized plus add functionality.
			 	this.createPlusAddControl();
			}	
			// Finalize the component
			this.finalizeComponent(jsHTML);
	
			// Add the preview pane. Have to include this after finalize due to DOM
			// elements not existing until finalize
			this.addReadPane(0); // send 0 to indicate we DO NOT have results
		}
		catch(err) {
			MP_Util.LogJSError(err, self, "care-team-o2.js", "renderNoCareTeam");
			throw (err);
		}

	};

	/**
	 * This function is used to render HTML into the addplus sign dropdown.
	 * Using this dropdown, providers can be assigned.
	 */
	CareTeamo2Component.prototype.renderAddPlusDropDown = function() {
		var self = this;
		var responseJson =  self.assignedTeamsJson;
		var codesArray = MP_Util.LoadCodeListJSON(responseJson.CODES);
		// retrieving provider information from providersList
		var associatedTeamsInfo = responseJson.PCT_TEAMS;
		var teamsLength = responseJson.PCT_TEAMS.length;
		var teamObjects = [];
		var associatedTeam = null;
		var teamName = "";
		var assignText = "";
		var allFacilitiesText = "";
		var ctI18n = i18n.discernabu.careteam_o2;
		var assignMyselfCss = teamsLength ? "cto2-assign-myself-header" : "cto2-assign-myself-header disabled";

		teamObjects.push({
			"MED_SERVICE_TEAM": ctI18n.ASSIGN_MYSELF,
			"CSS_CLASS": assignMyselfCss
		});
		for ( var i = 0; i < teamsLength; i++) {
			associatedTeam = associatedTeamsInfo[i];
			assignText = "";
			allFacilitiesText = "";
			teamName = associatedTeam.PCT_TEAM_CD ? (MP_Util.GetValueFromArray(associatedTeam.PCT_TEAM_CD, codesArray).display) : "";
			associatedTeam.PCT_CARE_TEAM = associatedTeam.ORIG_PCT_TEAM_ID;
			associatedTeam.MED_SERVICE_NAME = MP_Util.GetValueFromArray(associatedTeam.PCT_MEDSERV_CD, codesArray).display;
			associatedTeam.TEAM_NAME= teamName ? ("<span class='cto2-provider-medservice-team-separator'>|</span>" + teamName): "";

			// If the team or provider is already assigned to the team, do not display them.
			if ($.inArray(associatedTeam.PCT_CARE_TEAM,self.assignedCareTeams) > -1) {
				assignText = '<p class="cto2-modal-assigned-text">('+ ctI18n.ASSIGNED+ ')</p>';
				associatedTeam.EXISTING_ASSIGNMENT = true;
			}
			else {
				//If team is not assigned, the team Existing Assignment's property is set to false.
				associatedTeam.EXISTING_ASSIGNMENT = false;
			}

			if (!associatedTeam.FACILITY_CD) {
				allFacilitiesText = " (" + ctI18n.ALL_FACILITIES + ")";
			}

			// creating provider objects
			teamObjects.push({
				"MED_SERVICE_TEAM": associatedTeam.MED_SERVICE_NAME + associatedTeam.TEAM_NAME + allFacilitiesText + assignText,
				"PCT_CARE_TEAM": associatedTeam.PCT_CARE_TEAM,
				"CSS_CLASS": "cto2-assign-myself-team",
				"EXISTING_ASSIGNMENT": associatedTeam.EXISTING_ASSIGNMENT,
				"ASSIGN_PCT_CARE_TEAM": true
			});
		}

		teamObjects.push({
			"MED_SERVICE_TEAM": ctI18n.ASSIGN_NO_PROVIDER_TEAM,
			"CSS_CLASS": "cto2-assign-myself-team",
			"ASSIGN_NO_PROVIDER_TEAM": true
		});

		teamObjects.push({
			"MED_SERVICE_TEAM": ctI18n.ASSIGN_CARE_TEAM,
			"CSS_CLASS": "cto2-assign-myself-footer",
			"ASSIGN_CARE_TEAM": true
		});
		teamObjects.push({
			"MED_SERVICE_TEAM": ctI18n.ASSIGN_OTHER_PROVIDER,
			"CSS_CLASS": "cto2-add-other",
			"ADD_OTHER": true
		});
		teamObjects.push({
			"MED_SERVICE_TEAM": ctI18n.ASSIGN_NON_PROVIDER,
			"CSS_CLASS": "cto2-add-non-provider",
			"ADD_NON_PROVIDER": true
		});
		
		this.plusAddControl.getList().renderItems(teamObjects);
	};
	
	/**
	 * This function is implemented at the component level to provide functionality for the core level Add Plus sign.
	 * Depending on the assignType, the script param is updated to retrieve either provider level information or team level information. 
	 * (assignType can be either assign_myself or assign_care_team).
	 */
	CareTeamo2Component.prototype.openTab = function() {
		var criterion = this.getCriterion();
		var self = this;
		var ctI18n = i18n.discernabu.careteam_o2;
		//If the add plus button is clicked, provider level info should be retreived, hence retreiving provider_id.
		var prsnlId = (self.assignType === ctI18n.ASSIGN_MYSELF)? cclNumber(criterion.provider_id) : 0.0;
		//caching the jsonString depending on the assignType.
		var jsonString = (self.assignType === ctI18n.ASSIGN_MYSELF)? self.assignedTeamsJson : self.careTeamJson;
        var slaTimer = null;
       try{
            //If the jsonString has not been updated with the reply, the script call is made.
            if (!jsonString) {
                var request = null;
                var sendAr = [];
                sendAr.push("^MINE^", criterion.logical_domain_id, 0, 0,prsnlId, 0, 0, criterion.facility_cd+".0");
                request = new MP_Core.ScriptRequest(self, "");
                request.setProgramName("MP_GET_PCT_CARE_TEAM_CONFIG");
                request.setParameters(sendAr);
                request.setAsync(true);
                MP_Core.XMLCCLRequestCallBack(null, request, function(reply) {
                    if (reply.getStatus() === "S") {
                        if(prsnlId){
                            //If the addplus button is clicked, provider level info is rendered in the dropdown.
                              self.assignedTeamsJson = reply.getResponse();
                              self.renderAddPlusDropDown();
                        }else{
                            //If the assign Other suggestion is selected,modal window is launched with the build info.
                              self.careTeamJson = reply.getResponse();
                              self.renderCareTeamAssignModal();
                        }
                        
                    } else if (reply.getStatus() === "F") {
                        self.finalizeComponent(MP_Util.HandleErrorResponse(self.getStyles().getNameSpace(), reply.getError()), "");
                        return;
                    } else if (reply.getStatus() === "Z") {
                    	if(prsnlId){
                            //If the addplus button is clicked, provider level info is rendered in the dropdown.
                              self.assignedTeamsJson = reply.getResponse();
                              self.renderAddPlusDropDown();
                        }return;
                    }
                });
            } else {
                if(prsnlId){
                    //If the addplus button is clicked, provider level info is rendered in the dropdown.
                    self.renderAddPlusDropDown();
                }else{
                    //If the assign Other suggestion is selected,modal window is launched with the build info.
                    self.renderCareTeamAssignModal();
                }
            }
        }catch(err) {
			if (slaTimer) {
				slaTimer.Abort();
				slaTimer = null;
			}
			MP_Util.LogJSError(err, self, "care-team-o2.js", "openTab");
			throw (err);
		}finally {
			if (slaTimer) {
				slaTimer.Stop();
			}
		}
	};
	
	/**
	 * Renders the modal window with the data from mp_get_pct_care_team_config
	 */
	CareTeamo2Component.prototype.renderCareTeamAssignModal = function() {
		this.hideAddDropDownList();
		var ctI18n = i18n.discernabu.careteam_o2;
		var careTeamJsonReply = this.careTeamJson;
		var compId = this.getComponentId();
		var providerHtml = "";
		var providerArray = [];
		var teamsHtml = "";
		var prsnlArray = MP_Util.LoadPersonelListJSON(careTeamJsonReply.PRSNL);
		var modalDiv = Util.cep("div", {
			"className": "modal-div"
		});
		var dialog = Util.cep("div", {
			"className": "cto2-modal-dialog"
		});
		var selectedService = {};
		var selectedTeam = {};
		var teamsLength = 0;
		var providersLength = 0;
		var serviceHtml = "";
		this.m_selectedTeamId = null;
		var providerTemplate = null;
		var self = this;
		var btnTrue = "<button id='careTeam2Assign"+ compId+"' class='cto2-modal-button' data-val='1' disabled='disabled'>"+ ctI18n.ASSIGN + "</button>";
		var btnFalse = "<button id='careTeam2Cancel" + compId+ "' class='cto2-modal-button' data-val='0'>" + ctI18n.CANCEL+ "</button>";
		var codesArray = MP_Util.LoadCodeListJSON(careTeamJsonReply.CODES);
		var savedTeamsLength = 0;
		var savedTeamsResponse = self.m_alreadySavedCareTeams.getResponse();
		var servicesContainer = null;
		var providersContainer = null;
		var teamsContainer = null;
		var assignBtn = null;
		var thisVisitIndicator = true; //flag to determine if the provider should be added in the thisVisits or not
		var addingPctTeamIndicator = true; //flag to determine if the provider is to be added on the onClick of the existing PCT Teams

		if (self.m_alreadySavedCareTeams.getStatus() === 'S') {
			savedTeamsLength = savedTeamsResponse.CARE_TEAMS.length;
		}
		if (careTeamJsonReply && careTeamJsonReply.PCT_TEAMS) {
			teamsLength = careTeamJsonReply.PCT_TEAMS.length;
		} else {
			return;
		}
		if (teamsLength) {
			var serviceListItems = null;
			for ( var i = 0; i < teamsLength; i++) {
				if (!careTeamJsonReply.PCT_TEAMS[i].PCT_TEAM_CD) {
					serviceListItems = MP_Util.GetValueFromArray(careTeamJsonReply.PCT_TEAMS[i].PCT_MEDSERV_CD,codesArray).display;
					serviceHtml += "<li class='cto2-list-item' data-team-id = "+careTeamJsonReply.PCT_TEAMS[i].ORIG_PCT_TEAM_ID+" data-value='"+careTeamJsonReply.PCT_TEAMS[i].PCT_MEDSERV_CD+"' data-facility-cd = "+careTeamJsonReply.PCT_TEAMS[i].FACILITY_CD+">" + serviceListItems + "</li>";
				}
			}
		} else {
			return;
		}
		var closeBox = function() {
			self.providerSearchBar.destroy();
			$(".modal-div").remove();
			$(".cto2-modal-dialog").remove();
			$("html").css("overflow", "visible");// reset overflow
		};
		var assignNewTeams = function() {
			addingPctTeamIndicator = false;
			self.updateRelationshipCodeList(thisVisitIndicator, addingPctTeamIndicator);
			closeBox();
		};
		var cancelAssignNewTeams = function() {
			closeBox();
		};
		dialog.innerHTML = [
			"<div id='careTeam2ModalHeader" + compId + "' class='cto2-modal-header'>",
				"<div class='cto2-modal-title'>",
					ctI18n.CARE_TEAM_ASSIGNMENT,
				"</div>",
				"<div id='careTeam2CloseModal" + compId + "' class='cto2-modal-close'>",
					"&nbsp;",
				"</div>",
			"</div>",
			"<div id='careTeam2SearchBar" + compId + "' class='cto2-modal-search-bar'>",
			"</div>",
			"<div class='cto2-modal-container'>",
				"<div class='cto2-modal-contents-container'>",
					"<span class='cto2-modal-contents-lbl'>",
						ctI18n.MEDICAL_SERVICE,
					"</span>",
					"<ul id='servListContainer"+ compId + "' class='cto2-modal-contents-list'>",
						serviceHtml,
					"</ul>",
				"</div>",
				"<div class='cto2-modal-contents-container cto2-modal-teams'>",
					"<span class='cto2-modal-contents-lbl'>",
						ctI18n.TEAM,
					"</span>",
					"<ul id='careTeamListContainer" + compId + "' class='cto2-modal-contents-list'>",
						"<li class='cto2-default-team-text'>",
							ctI18n.SELECT_MED_SERVICE,
						"</li>",
					"</ul>",
				"</div>",
				"<div class='cto2-modal-contents-container cto2-modal-providers'>",
					"<span class='cto2-modal-contents-lbl'>",
						ctI18n.PROVIDER,
					"</span>",
					"<ul id='careTeamProviderContainer" + compId + "' class='cto2-modal-contents-list'>",
						"<li class='cto2-default-team-text'>",
							ctI18n.SELECT_MED_SERVICE_TEAM,
						"</li>",
					"</ul>",
				"</div>",
			"</div>",
			"<div class='cto2-modal-footer'>",
				"<span class='cto2-modal-button-container'>",
					btnTrue,
				"</span>",
				"<span class='cto2-modal-button-container'>",
					btnFalse,
				"</span>",
			"</div>"
		].join("");
		$("html").css("overflow", "hidden"); // disable page scrolling when modal is enabled
		$(modalDiv).height($(document).height());
		var docBody = document.body;
		Util.ac(modalDiv, docBody);
		Util.ac(dialog, docBody);
		Util.addEvent(_g('careTeam2Assign' + compId), "click", assignNewTeams);
		Util.addEvent(_g('careTeam2Cancel' + compId), "click",cancelAssignNewTeams);
		Util.addEvent(_g('careTeam2CloseModal' + compId), "click", closeBox);

		servicesContainer = $("#servListContainer" + compId);
		providersContainer = $("#careTeamProviderContainer" + compId);
		teamsContainer = $("#careTeamListContainer" + compId);
		assignBtn = $('#careTeam2Assign' + compId);

		// creating provider template
		providerTemplate = new TemplateEngine.TemplateFactory((function() {
			var template = TemplateEngine;
			var div = template.tag("div");

			return {
				providerInfo: function(context) {
					return div({
						"class": "search-item",
						"id": context._elementId, //eslint-disable-line no-underscore-dangle
						"pct_care_team": context.PCT_CARE_TEAM,
						"med_service_cd": context.PCT_MED_SERVICE_CD,
						"pct_team_cd": context.PCT_TEAM_CD
					}, div({"class": "cto2-provider-name"}, context.PCT_PROVIDER_NAME),
					   div({"class": "cto2-med-service-team"}, context.MED_SERVICE_TEAM));
					   
				}

			};
		})());
		
		// Creating a auto-suggest control
		var providerSearchBar = new MPageControls.AutoSuggest($('#careTeam2SearchBar' + compId));
		// Setting a delay of 500ms between the keystrokes(default delay is 50
		// ms which invokes the script twice).
		providerSearchBar.setDelay(500);
		providerSearchBar.setCaption(ctI18n.PROVIDER_SEARCH);
		providerSearchBar.activateCaption();
		providerSearchBar.setListItemTemplate(providerTemplate.providerInfo);
		this.providerSearchBar = providerSearchBar;
		// search script would be invoked after 500ms delay
		providerSearchBar.setOnDelay(function() {
			var searchText = $('#careTeam2SearchBar' + compId + ' :input').val();
			// replace all the special characters with a blank string
			searchText = searchText ? searchText.replace(/[^a-zA-Z0-9]/g,'') : "";
			if (searchText) {
				// invoke the script only when the searchText is appropriate
				self.retrieveProviders(searchText, providerSearchBar);
			}
		});

		//this method handles the logic when a provider is selected from the suggestions.
		providerSearchBar.getList().setOnSelect(function(item) {
			providerSearchBar.activateCaption();
			//This parameter is updated with the offset height 		
			var offset = 0;
			    //The following logic highlights the medservice,team and provider from the list.
				servicesContainer.find("li").each(function() {
					if ($(this).attr("data-value") == item.MED_SERVICE_CD) {
						$(this).click();
						//this would set the focus on to the highlighted element
						offset = $('#servListContainer' + compId+' li').first().position().top;
						servicesContainer.scrollTop($(this).position().top - offset);
					}
				});
				teamsContainer.find("li").each(function() {
					if ($(this).attr("data-value") == item.PCT_TEAM_CD) {
						$(this).click();
						//this would set the focus on to the highlighted element
						offset = $('#careTeamListContainer' + compId+' li').first().position().top;
						teamsContainer.scrollTop($(this).position().top - offset);
					}
				});
				providersContainer.find("li").each(function() {
					if ($(this).attr("data-team-id") == item.PCT_CARE_TEAM) {
						$(this).click();
						//this would set the focus on to the highlighted element
						offset = $('#careTeamProviderContainer' + compId+' li').first().position().top;
						providersContainer.scrollTop($(this).position().top - offset);
					 }
				});				
				self.m_selectedTeamId = item.PCT_CARE_TEAM;
				//If the selected provider is already assigned, do not enable the assign button
				if (!($.inArray(self.m_selectedTeamId,self.assignedCareTeams) > -1)) {
					$("#careTeam2Assign"+compId).removeAttr("disabled");
				}
				
		});
		
		if (careTeamJsonReply.PCT_TEAMS.length) {
			servicesContainer.find("li").each(function() {
			if (parseFloat($(this).attr("data-facility-cd")) === 0.0) {
				$(this).append("<span class='cto2-all-facility-label secondary-text'>("+ ctI18n.ALL_FACILITIES + ")</span>");
			  }
			});
		}
		
		//If the medical service is already assigned,appending (assigned) text to the name.
		if (savedTeamsLength) {
			servicesContainer.find("li").each(function() {
				for ( var j = 0; j < savedTeamsLength; j++) {
				if ($(this).attr("data-team-id") === savedTeamsResponse.CARE_TEAMS[j].PCT_CARE_TEAM_ID) {
				$(this).append($('<p/>',{'class': 'cto2-modal-assigned-text','html': '('+ ctI18n.ASSIGNED+ ')'}));
				  }
				}
			});
		}

		// Given an array of personnel objects, the objects are arranged in alphabetical order. The ordered array is then used to
		// create the html for the provider section of the care team modal window. 
		var providerSectionHtml = function(providerArrayList, medService){
			var html = "";
			providerArrayList.sort(function(a,b){
				var personnelNameA = MP_Util.GetValueFromArray(a.PRSNL_ID, prsnlArray).fullName.toUpperCase();
				var personnelNameB = MP_Util.GetValueFromArray(b.PRSNL_ID, prsnlArray).fullName.toUpperCase();
				if(personnelNameA < personnelNameB){
					return -1;
				}
				if(personnelNameA > personnelNameB){
					return 1;
				}
				return 0;
			});
			var arrayLength = providerArrayList.length;
			for(var i = 0; i < arrayLength; i++){
				html += "<li id='careTeamProvider"+compId+
								"' class='cto2-list-item' data-value='"+ providerArrayList[i].PRSNL_ID +
								"' data-serv-cd=" +
								medService +
								" data-team-id = " +
								providerArrayList[i].PRSNL_ORIG_PCT_CARE_TEAM_ID+
								">" + MP_Util.GetValueFromArray(providerArrayList[i].PRSNL_ID, prsnlArray).fullName + "</li>";
			}
			return html;
		};
		
		//The following code would update the teams container with the list of the teams under the specified medical service
		servicesContainer.delegate("li","click",function() {
			selectedService = this;
			teamsHtml = "";
			providerHtml = "";
			var medServiceCode = "";
			var selectedServiceFacilityCd = parseFloat(selectedService.getAttribute("data-facility-cd"));
			if(providersContainer){
				   providersContainer.html("");
			}
			servicesContainer.find("li").removeClass("primary-select secondary-select");
			servicesContainer.find("p").removeClass('cto2-modal-assigned-text-selected');
			assignBtn.removeAttr('disabled');
			if ($(selectedService).find("p").length) {
					$(this).find("p").addClass('cto2-modal-assigned-text-selected');
					assignBtn.attr('disabled','disabled');
			}
			$(selectedService).addClass("primary-select");
			$(".cto2-default-team-text").remove();
			
			if (teamsContainer) {
				teamsContainer.html("");
			}
			providerArray = [];
			for ( var j = 0; j < teamsLength; j++) {
				if (careTeamJsonReply.PCT_TEAMS[j].PCT_TEAM_CD && (careTeamJsonReply.PCT_TEAMS[j].PCT_MEDSERV_CD == selectedService.getAttribute("data-value")) && 
				(careTeamJsonReply.PCT_TEAMS[j].FACILITY_CD === selectedServiceFacilityCd)) {
				var teamListItems = MP_Util.GetValueFromArray(careTeamJsonReply.PCT_TEAMS[j].PCT_TEAM_CD,codesArray).display;
				teamsHtml += "<li id='careTeamList"+compId+
							 "' class='cto2-list-item' data-value='"+
							 careTeamJsonReply.PCT_TEAMS[j].PCT_TEAM_CD+
							 "' data-serv-cd="+
			      			 careTeamJsonReply.PCT_TEAMS[j].PCT_MEDSERV_CD+
							" data-team-id = "+
							 careTeamJsonReply.PCT_TEAMS[j].ORIG_PCT_TEAM_ID+
							 " data-facility-cd = "+
							 careTeamJsonReply.PCT_TEAMS[j].FACILITY_CD+
							">" + teamListItems + "</li>";
									
			      }
				 else if((careTeamJsonReply.PCT_TEAMS[j].PCT_MEDSERV_CD == selectedService.getAttribute("data-value")) && 
				(careTeamJsonReply.PCT_TEAMS[j].FACILITY_CD === selectedServiceFacilityCd) && careTeamJsonReply.PCT_TEAMS[j].PRSNL.length)
				{
					medServiceCode = careTeamJsonReply.PCT_TEAMS[j].PCT_MEDSERV_CD;
					providersLength = careTeamJsonReply.PCT_TEAMS[j].PRSNL.length;
					for(var k = 0; k<providersLength; k++)
					{
						providerArray.push(careTeamJsonReply.PCT_TEAMS[j].PRSNL[k]);
					}
						
				}
							
		     }
			//If there are providers assiged to the selected medical service, updating the providers container				

			if (providerArray) {
				providerHtml = providerSectionHtml(providerArray, medServiceCode);
				providersContainer.html(providerHtml);
			}
			
			//If there are teams assiged to the selected medical service, updating the teams container
			if (teamsHtml) {
				teamsContainer.html(teamsHtml);
			}
			
			//If either teams or providers associated to the team are already assigned,append the display with "assigned"
			if (savedTeamsLength) {
				teamsContainer.find("li").each(function() {
				for ( var j = 0; j < savedTeamsLength; j++) {
					if ($(this).attr("data-team-id") == savedTeamsResponse.CARE_TEAMS[j].PCT_CARE_TEAM_ID) {
					$(this).append($('<p/>',{'class': 'cto2-modal-assigned-text','html': '('+ ctI18n.ASSIGNED+ ')'}));
			        }
			     }
				});
				
				providersContainer.find("li").each(function() {
					for ( var j = 0; j < savedTeamsLength; j++) {
						if ($(this).attr("data-team-id") == savedTeamsResponse.CARE_TEAMS[j].PCT_CARE_TEAM_ID) {
						$(this).append($('<p/>',{'class': 'cto2-modal-assigned-text','html': '('+ ctI18n.ASSIGNED+ ')'}));
					    }
					}
				});
		      }
			//updating the selected team to pct_care_team_id of the medical sevice in context
			self.m_selectedTeamId = $(selectedService).attr("data-team-id");
		});
		
		
		//The following code would update the providers container with the list of the provider under the team in context
		teamsContainer.delegate('li','click',function() {
			var medServiceCode = "";
			selectedTeam = this;
			providerHtml = "";

			// If no team is selected then disable the Assign button and return
			self.m_selectedTeamId = $(this).attr("data-team-id");
			if(!self.m_selectedTeamId){
				assignBtn.attr('disabled','disabled');
				return;
			}

			if (providersContainer){
				providersContainer.html("");
			}

			teamsContainer.find('li').removeClass("primary-select");
			teamsContainer.find('li').removeClass("secondary-select");
			teamsContainer.find('p').removeClass("cto2-modal-assigned-text-selected");
			$(this).addClass("primary-select");
			assignBtn.removeAttr('disabled');
			if ($(this).find("p").length) {
				$(this).find("p").addClass('cto2-modal-assigned-text-selected');
				assignBtn.prop('disabled', true);
			}
			$(selectedService).removeClass("primary-select");
			$(selectedService).addClass("secondary-select");

			var selectedServiceFacilityCd = parseFloat(selectedService.getAttribute("data-facility-cd"));

			//looping through the providers assigned under each team and building the providers string.
			providerArray = [];
			for ( var j = 0; j < teamsLength; j++) {
				var careTeamResult = careTeamJsonReply.PCT_TEAMS[j];
				if (careTeamResult.PRSNL.length && (careTeamResult.FACILITY_CD === selectedServiceFacilityCd) && (careTeamResult.PCT_TEAM_CD == selectedTeam.getAttribute("data-value")) && (careTeamResult.PCT_MEDSERV_CD == selectedTeam.getAttribute("data-serv-cd"))){
						providersLength = careTeamResult.PRSNL.length;
						medServiceCode = careTeamResult.PCT_MEDSERV_CD;
						//used to check if the provider is already within the providerArray used to build the provide section. 
						var alreadyContainsProvider = function(personnelId) { 
							var providerArrayLength = providerArray.length;
							for (var i = 0; i < providerArrayLength; i++){
								if (providerArray[i].PRSNL_ID === personnelId){
									return true;
								} 
							}
							return false;
						};
						for(var k = 0; k<careTeamResult.PRSNL.length; k++){
							if(!alreadyContainsProvider(careTeamResult.PRSNL[k].PRSNL_ID)){
								providerArray.push(careTeamJsonReply.PCT_TEAMS[j].PRSNL[k]);
							}
								
						}
						
					}
			
			}
			//If there are providers assigned to the selected team, updating the providers container
			if (providerArray) {
				providerHtml = providerSectionHtml(providerArray, medServiceCode);
				providersContainer.html(providerHtml);
			}

			//If the providers associated to the team are already assigned,append the provider display with "assigned"
			if (savedTeamsLength) {
				providersContainer.find("li").each(function() {
					for ( var j = 0; j < savedTeamsLength; j++) {
						if ($(this).attr("data-team-id") == savedTeamsResponse.CARE_TEAMS[j].PCT_CARE_TEAM_ID) {
							$(this).append($('<p/>',{'class': 'cto2-modal-assigned-text','html': '('+ ctI18n.ASSIGNED+ ')'}));
						}
					}
				});
			}
		});

		//the following logic would update the services and teams containers with appropriate styles.
		providersContainer.delegate('li','click',function() {

			// If no team is selected then disable the Assign button and return
			self.m_selectedTeamId = $(this).attr("data-team-id");
			if(!self.m_selectedTeamId){
				assignBtn.attr('disabled','disabled');
				return;
			}

			providersContainer.find('li').removeClass("primary-select");
			providersContainer.find('p').removeClass("cto2-modal-assigned-text-selected");
			$(this).addClass("primary-select");

			assignBtn.removeAttr('disabled');
			if ($(this).find("p").length) {
				$(this).find("p").addClass('cto2-modal-assigned-text-selected');
				assignBtn.attr('disabled','disabled');
			}
			$(selectedTeam).removeClass("primary-select");
			$(selectedTeam).addClass("secondary-select");

			$(selectedService).removeClass("primary-select");
			$(selectedService).addClass("secondary-select");
		});
	};

	/**
	 * Retrieves provider info based on the search string entered from
	 * mp_search_pct_care_provider
	 *
	 * @param - searchText : text entered in the quick search box for
	 *            searching providers. providerSearchBar : Autosuggest search
	 *            text-box element.
	 * @return - null
	 */
	CareTeamo2Component.prototype.retrieveProviders = function(searchText,providerSearchBar) {
		var errMsg = [];
		var criterion = this.getCriterion();
		var self = this;

		// params for the ccl program
		var params = {
			"Output": "^MINE^",
			"Search String": "^" + searchText + "^",
			"Max Result Count": 10,
			"Logical Domain Id": criterion.logical_domain_id,
			"Facility Code": criterion.facility_cd+".0"
		};

		try {

			ccl("mp_search_pct_care_provider", params, "", function(reply) {

				if (reply.getStatus() === "Z" || reply.getStatus() === "S") {
					self.renderProviders(reply.getResponse(),providerSearchBar);
				} else if (reply.getStatus() === "F") {
					self.finalizeComponent(MP_Util.HandleErrorResponse(self.getStyles().getNameSpace(), reply.getError()), "");
					return;
				}

			});

		} catch (err) {
			errMsg.push(err.message);
			self.finalizeComponent(MP_Util.HandleErrorResponse(self.getStyles().getNameSpace(), errMsg.join("<br />")), "");
		}
	};

	/**
	 * render the suggestions dropdown with appropriate provider information
	 * 
	 * @param - providersList : this parameter consists of the reply from the
	 *            mp_search_pct_care_provider script providerSearchBar :
	 *            Autosuggest search text-box element.
	 * @returns : none
	 */
	CareTeamo2Component.prototype.renderProviders = function(providersList,providerSearchBar) {
		var codesArray = MP_Util.LoadCodeListJSON(providersList.CODES);
		var ctI18n = i18n.discernabu.careteam_o2;

		// retrieving provider information from providersList
		var providerInfo = providersList.PROVIDER_INFO;
		var providerObjects = [];
		var providers = null;
		var providerLength = providerInfo.length;
		var teamName = "";
		for ( var i = 0; i < providerLength; i++) {
			teamName = providerInfo[i].PCT_TEAM_CD ? (MP_Util.GetValueFromArray(providerInfo[i].PCT_TEAM_CD, codesArray).display) : "";
			providers = providerInfo[i];
			providers.PCT_CARE_TEAM = providerInfo[i].PCT_CARE_TEAM_ID;
			providers.MED_SERVICE_NAME = MP_Util.GetValueFromArray(providerInfo[i].PCT_MED_SERVICE_CD, codesArray).display;
			providers.TEAM_NAME= teamName ? ("<span class='cto2-provider-medservice-team-separator'>|</span>" + teamName): "";
			if(!providers.PCT_FACILITY_CD) {
				providers.TEAM_NAME = providers.TEAM_NAME + " ("+ ctI18n.ALL_FACILITIES + ") ";
			}
			// creating provider objects
			providerObjects.push({
				"PCT_PROVIDER_NAME": providers.PCT_PROVIDER_NAME,
				"MED_SERVICE_TEAM": providers.MED_SERVICE_NAME + providers.TEAM_NAME,
				"PCT_CARE_TEAM": providers.PCT_CARE_TEAM,
				"MED_SERVICE_CD": providers.PCT_MED_SERVICE_CD,
				"PCT_TEAM_CD": providers.PCT_TEAM_CD
			});

		}

		// retrieve suggestions and append it to the search text box
		providerSearchBar.setSuggestions(providerObjects);
	};

	/**
	 * This function takes in an active indicator to activate/inactivate a row and an end effective date if inactivating.
	 * Then makes a JSON to send to mp_udp_care_team_assignment to update a patient's care team assignment.
	 * If successful it calls render component to refresh the component.
	 *
	 * @param {integer} assignId
	 *			holds the value for the DCP_SHIFT_ASSIGN_ID
	 * @param {String} relationCode
	 *        lastSelectedRole code for the user retrieved from the table
	 * @param {boolean} addingPctTeamIndicator
	 *       flag to determine if the provider is to be added on the onClick of the existing PCT Teams
	 * @return {undefined} Nothing
	 */
	CareTeamo2Component.prototype.updateCareTeam = function(assignId, relationCode, addingPctTeamIndicator) {
		// display the loading wheel
		this.getElementById("_medical_service").html("<div class='loading-spinner'>&nbsp;</div>");
		var request = null;
		var self = this;
		var criterion = this.getCriterion();
		var userId = parseInt(criterion.provider_id, 10);
		var providerId = parseInt($("#careTeamProviderContainer" + this.getComponentId()).find(".primary-select").attr("data-value"), 10);

		var assignPatJson = "{" +
			'"PATIENTS":{' +
				'"QUAL":[' +
					"{" +
						'"PERSON_ID":' + criterion.person_id + ".0," +
						'"ENCNTR_ID":' + criterion.encntr_id + ".0," +
						'"ASSIGNMENT_ID": ' + assignId + ".0," +
						'"ORIG_PCT_TEAM_ID":' + this.m_selectedTeamId + ".0," +
						'"ACTIVE_IND": 1,' +
						'"BEGIN_EFFECTIVE_ISO": "",' +
						'"END_EFFECTIVE_ISO": "",' +
						'"PRE_GENERATED_ID":0.0,' +
						'"RELATED_PERSON_ID":0.0,' +
						'"RELATED_PRSNL_ID":0.0,' +
						// update ASSIGNED_RELTN_TYPE_CD to the value in relationCode if the provider is being added by th onclick of the existing
						// PCT Teams under the "Assign Myself" in the addplus drop-down menu
						// update ASSIGNED_RELTN_TYPE_CD to the value in relationCode if the provider that was selected is the current user.
						'"ASSIGNED_RELTN_TYPE_CD":' + (addingPctTeamIndicator || userId === providerId ? relationCode : 0) + ".0," +
					"}" +
				"]" +
			"}" +
		"}";
		request = new MP_Core.ScriptRequest(this, "");
		request.setProgramName("MP_UPD_CARE_TEAM_ASSIGNMENT");
		request.setParameters(["^MINE^", "0"]);
		request.setRequestBlobIn(assignPatJson);
		request.setAsync(false);
		MP_Core.XMLCCLRequestCallBack(null, request, function(reply) {
			if (reply.getStatus() === "S") {
				// argument passed to the retrieveComponentData is the boolean value returned from the shouldPreserveRole function
				self.retrieveComponentData(self.shouldPreserveRole());
			} else if (reply.getStatus() === "F") {
				self.finalizeComponent(MP_Util.HandleErrorResponse(self.getStyles().getNameSpace(), reply.getError()), "");
			}
		});

	};

	/**
	 * This function takes an id (the part after the comp id) and returns
	 * the JQuery object of that id with the appropriate info prepended
	 * @param {String}
	 *            id: a string of the last part of the elements id
	 */
	CareTeamo2Component.prototype.getElementById = function(id) {
		return $("#cto2" + this.getComponentId() + id);
	};

	/**
	 * This function loads the essential data required to be used inside the Provider Modal.
	 */
	CareTeamo2Component.prototype.providerModalPreProcessing = function(callback) {
		var self = this;
		var callbackHasBeenCalled = false;
		var handleCallback = function() {
			if (self.m_communicationTypeCodes.length &&
				$.isEmptyObject(self.m_providerRoleCodes) === false &&
				$.isEmptyObject(self.m_nonProviderRoleCodes) === false &&
				callbackHasBeenCalled === false) {
					callbackHasBeenCalled = true;
					callback.call(self);
			}
		};

		/**
		 * This function makes a ccl call to load a code set to be cached for displaying during adding selecting providers.
		 */
		var loadCodeSet = function() {
			if($.isEmptyObject(self.m_providerRoleCodes) === true || $.isEmptyObject(self.m_nonProviderRoleCodes) === true ) {
				var sendAr = [
					"^MINE^",
					"4003145.00" // The code set 4003145 is used for retrieving providers and Non Providers.
				];

				var request = new ScriptRequest()
					.setProgramName("MP_GET_CODESET")
					.setParameterArray(sendAr)
					.setResponseHandler(function(reply) {
						var status = reply.getStatus();
						switch (status) {
							case "S":
								var codesList = reply.getResponse().CODES;
								for (var i = 0; i < codesList.length; i++) {
									if (codesList[i].MEANING === "PROVIDER") {
										self.m_providerRoleCodes[codesList[i].CODE] = codesList[i].DISPLAY;
									}
									else {
										self.m_nonProviderRoleCodes[codesList[i].CODE] = codesList[i].DISPLAY;
									}
								}
								handleCallback();
								break;
							case "F":
								MP_ModalDialog.closeModalDialog("assignProviderAndNonProviderModal");
								self.createErrorModal("<p>" + i18n.discernabu.careteam_o2.FAILURE_TO_RETRIEVE_ROLE_LIST + "<p>");
								logger.logError(reply.getError());
								break;
							case "Z":
								MP_ModalDialog.closeModalDialog("assignProviderAndNonProviderModal");
								self.createErrorModal("<p>" + i18n.discernabu.careteam_o2.NO_ROLE_LIST + "<p>");
								logger.logError("Nothing returned from MP_GET_CODESET for role lists");
								break;
						}
					}
				);
				request.performRequest();
			}
			else {
				handleCallback();
			}
		};

		/**
		 * This function makes a ccl call to load a code set to be cached for displaying the type of communications.
		 * It launches the provider search modal if the response returns with a success status else loads the error modal.
		 */
		var loadContactTypeCodes = function() {
			if (!self.m_communicationTypeCodes.length) {
				if (!self.pendingContactTypeRequest) {
					self.pendingContactTypeRequest = true;
					var sendAr = [
						"^MINE^",
						"43.00" // The code set 43 is for the type of communications.
					];

					var request = new ScriptRequest()
						.setProgramName("MP_GET_CODESET")
						.setParameterArray(sendAr)
						.setResponseHandler(function(reply) {
							var status = reply.getStatus();
							self.pendingContactTypeRequest = false;
							switch (status) {
								case "S":
									self.m_communicationTypeCodes = reply.getResponse().CODES;
									handleCallback();
									break;
								case "F":
									MP_ModalDialog.closeModalDialog("assignProviderAndNonProviderModal");
									self.createErrorModal("<p>" + i18n.discernabu.careteam_o2.FAILURE_TO_RETRIEVE_COMM_TYPES + "<p>");
									logger.logError(reply.getError());
									break;
								case "Z":
									MP_ModalDialog.closeModalDialog("assignProviderAndNonProviderModal");
									self.createErrorModal("<p>" + i18n.discernabu.careteam_o2.NO_COMM_TYPES + "<p>");
									logger.logError("Nothing returned from MP_GET_CODESET for communication types");
									break;
							}
						});
					request.performRequest();
				}
			}
			else {
				handleCallback();
			}
		};

		loadCodeSet();
		loadContactTypeCodes();
	};

	/**
	 * This function hides the Add Pluss Drop Down List when the Modal Dialog opens.
	 */
	CareTeamo2Component.prototype.hideAddDropDownList =function(){
		var $plusAddDropDownList = $(".cto2-addplus-drp-dwn div").filter(function() {
			return this.id.match(/^control_\d+_contents/);
		});
		$plusAddDropDownList.hide();
	};


	/**
	 * This function takes in relationCode and makes a JSON to send to mp_udp_care_team_assignment to
	 * update a patient's care team assignment. If the reply from the script is suucess; refresh the component
	 * to reflect the new assignments made by the script.
	 * If successful it calls render component to refresh the component.
	 *
	 * @param {string} relationCode
	 *					is the last role/relation's code value selected for the provider.
	 * @return {undefined} Nothing
	 */
	CareTeamo2Component.prototype.addProviderNoCareTeam = function(relationCode){
		var self = this;
		var criterion = this.getCriterion();
		var userid = criterion.provider_id;

		var sendAr = [
			"^MINE^",
			"0"
		];

		var jsonString = "{" +
			'"PATIENTS": {' +
				'"QUAL": [{' +
					'"PERSON_ID":' + criterion.person_id + ".0," +
					'"ENCNTR_ID":' + criterion.encntr_id + ".0," +
					'"ASSIGNMENT_ID":0.0,' +
					'"ORIG_PCT_TEAM_ID":' + (self.m_selected_team || "0") + ".0," +
					'"ACTIVE_IND":1,' +
					'"BEGIN_EFFECTIVE_ISO":"",' +
					'"END_EFFECTIVE_ISO":"",' +
					'"PRE_GENERATED_ID":0.0,' +
					'"RELATED_PERSON_ID":0.0,' +
					'"RELATED_PRSNL_ID":' + userid + ".0," +
					'"ASSIGNED_RELTN_TYPE_CD":' + relationCode + ".0," +
				"}]" +
			"}" +
		"}";
		var request = new MP_Core.ScriptRequest(self, "");
		request.setProgramName("MP_UPD_CARE_TEAM_ASSIGNMENT");
		request.setRequestBlobIn(jsonString);
		request.setParameters(sendAr);
		MP_Core.XMLCCLRequestCallBack(null, request, function(updCareTeamReply){
			if (updCareTeamReply.getStatus() === "S") {
				var preserveRole = true;
				self.retrieveComponentData(preserveRole);
			}
		});
	};

	/**
	* Handles calls to updateCareTeam and the addProviderTeam to add the providers with the updated Role/Relation.
	*
	* @param {string} lastRole
	*			has the last selected Role's code value
	* @param {boolean} thisVisitIndicator
	*			flag to determine if the provider should be added in the thisVisits or not
	* @param {boolean} addingPctTeamIndicator
	*			flag to determine if the provider is to be added on the onClick of the existing PCT Teams
	 */

	CareTeamo2Component.prototype.callUpdateCareTeam = function(lastRole, thisVisitIndicator, addingPctTeamIndicator){
		var self = this;
		//if thisVisitIndicator is set, then call updateCareTeam function to add the provider in the "This Visits" else
		//call the addProviderNoCareTeam to add the provider in the "Cross-Visits".
		if (thisVisitIndicator) {
			self.updateCareTeam(0.0, lastRole, addingPctTeamIndicator ? true : false);
		}
		else{
			self.addProviderNoCareTeam(lastRole);
		}
	};

	/**
	* Makes call to the MPage_Core_User_Prefs.UserPrefManager.GetPreference to retrieve the last selected
	* roleRelationCode for the provider which is saved in the table for the current session
	* if the lastSelectedRole exists assign it to the curUserLastSelectedRole which is saved at the criterion level.
	* Arguments passed to MPage_Core_User_Prefs.UserPrefManager.GetPreference
	*		key: 'CARE_TEAM_ROLE'
	*		dataIsPersisted: set to true
	*		userId: Provider id who is the user
	*		async: set to false
	* @return {undefined} Nothing
	*/
	CareTeamo2Component.prototype.retrieveLastAssignedRole = function(){
		var userId = this.getCriterion().provider_id;
		var self = this;
		var async = false;
		var dataIsPersisted = true;
		MPage_Core_User_Prefs.UserPrefManager.GetPreference('CARE_TEAM_ROLE', dataIsPersisted, userId, async, function(lastRole) {
			if (lastRole) {
				self.curUserLastSelectedRole = lastRole;
			}
			else{
				//Setting user last selected role to zero if there was no Role saved for the provider in the table.
				self.curUserLastSelectedRole = 0.0;
			}
		});
	};

	/**
	* Makes call to the retrieveLastAssignedRole to get the lastSelectedRole saved from the table if the curUserLastSelectedRole
	* is not saved at the criterion.
	* @param {boolean} thisVisitIndicator
	*			flag to determine if the provider should be added in the thisVisits or not
	*
	* @param {boolean} addingPctTeamIndicator
	*			flag to determine if the provider is to be added on the onClick of the existing PCT Teams
	* @return {undefined} Nothing
	*/
	CareTeamo2Component.prototype.updateRelationshipCodeList = function(thisVisitIndicator, addingPctTeamIndicator) {
		if (this.curUserLastSelectedRole === null) {
			this.retrieveLastAssignedRole();
		}
		this.callUpdateCareTeam(this.curUserLastSelectedRole, thisVisitIndicator, addingPctTeamIndicator);
	};

	/**
	* Handles call to the MPage_Core_User_Prefs.UserPrefManager.SavePreference which saves the currently selected
	* roleRelationCode for the provider. Arguments passed are
	*		key: 'CARE_TEAM_ROLE'
	*		value: last selected role code
	*		persistData: set to true
	*		userId: Provider id at the criterion level
	*		async: set to true
	* @param {string} roleRelationCode
	*			stores the provider's currently selected Role/Relation Code
	* @return {undefined} Nothing
	*/
	CareTeamo2Component.prototype.setAssignedRelationshipCode = function(roleRelationCode){
		var userId = this.getCriterion().provider_id;
		//set the this.lasSelectedRole which would now be available globally
		this.curUserLastSelectedRole = roleRelationCode;
		MPage_Core_User_Prefs.UserPrefManager.SavePreference("CARE_TEAM_ROLE", this.curUserLastSelectedRole, true, userId, true);
	};

	/**
	* This function decides the boolean value to be passed to the retrieveComponentData function
	* @param {object} data
	*        The data object associated with the selected row
	* @return {boolean}
	* 		return true if the providerId and the selectedPersonId is equal else return false
	*/
	CareTeamo2Component.prototype.shouldPreserveRole = function(data) {
		var providerId = this.getCriterion().provider_id;
		return (data && providerId === data.PRSNL_ID) || providerId === this.selectedPersonId;
	};

	/**
	* This function launches a provider modal when the Assign other provider is clicked.
	* @param {boolean} defaultTab
	*        flag to whether open Provider Modal Dialog or Non-Provider Modal Dialog
	* @return {Undefined}          Nothing
	*/
	CareTeamo2Component.prototype.launchProviderSearchModal = function(defaultTab) {
		var self = this;
		this.hideAddDropDownList();
		this.m_modalPersonnelList = [];
		var person_id = this.getCriterion().person_id;
		var encntr_id = this.getCriterion().encntr_id;
		var user_id = this.getCriterion().provider_id;
		var shouldRefresh = false;
		var personnelModal = MP_ModalDialog.retrieveModalDialogObject("assignProviderAndNonProviderModal");
		// Checks if the Modal already exists if not created a new one.
		if (!personnelModal) {
			// Generate the cancel button
			var ctoCancelBtn = new ModalButton("ctoCancelBtn")
				.setText(i18n.discernabu.careteam_o2.CANCEL)
				.setFocusInd(true);

			// Generate the assign button
			var ctoAssignBtn = new ModalButton("ctoAssignBtn")
				.setText(i18n.discernabu.careteam_o2.ASSIGN)
				.setIsDithered(true);

			// Generate the assign and add another button
			var ctoAssignAndAddBtn = new ModalButton("ctoAssignAndAddBtn")
				.setText(i18n.discernabu.careteam_o2.ASSIGN_AND_ADD_ANOTHER)
				.setIsDithered(true);

			var leftRightMargin = ($(window).width() > 1280) ? 20 : 10;
			// Generate the personnel modal
			personnelModal = new ModalDialog("assignProviderAndNonProviderModal")
				.setTopMarginPercentage(10)
				.setBottomMarginPercentage(5)
				.setLeftMarginPercentage(leftRightMargin)
				.setRightMarginPercentage(leftRightMargin)
				.setIsBodySizeFixed(false)
				.addFooterButton(ctoAssignBtn)
				.addFooterButton(ctoAssignAndAddBtn)
				.addFooterButton(ctoCancelBtn);

			var modalId = personnelModal.getId();
			MP_ModalDialog.addModalDialogObject(personnelModal);
			personnelModal.setFooterButtonCloseOnClick("ctoAssignBtn", false);
			/**
			* Function handles the OnClick of the "Assign" Button
			* @return {Undefined}          Nothing
			*/
			personnelModal.setFooterButtonOnClickFunction("ctoAssignBtn", function(){
				if ($(".cto2-provider-options").length > 0) {
					addProviderCareTeam(true);
				}
				else{
					addProviderandNonProvider(true);
				}
				self.addModalSpinner("assignProviderAndNonProviderModalbody");
			});
			personnelModal.setFooterButtonCloseOnClick("ctoAssignAndAddBtn", false);

			/**
			* Function handles the OnClick of the "Assign and Add Another" Button
			* @return {Undefined}          Nothing
			*/
			personnelModal.setFooterButtonOnClickFunction("ctoAssignAndAddBtn", function(){
				if ($('.cto2-provider-options').length > 0) {
					addProviderCareTeam();
				}
				else {
					addProviderandNonProvider();
				}
				//If the Provider Tab is active then refresh and display the Add New Provider Form
				if ($('#providerTab').hasClass('cto2-tab-active-header')) {
					showProviderTab();
				}
				else {
					showNonProviderTab(); // else refresh and display the Non-provider Form
				}
				self.addModalSpinner("assignProviderAndNonProviderModalbody");
			});
			personnelModal.setFooterButtonOnClickFunction("ctoCancelBtn", function(){
				if (shouldRefresh === true) {
					self.retrieveComponentData();
				}
			});

			personnelModal.setHeaderTitle(i18n.discernabu.careteam_o2.ASSIGN_CARE_TEAM_MEMBER).setHeaderCloseFunction(function () {
				if (shouldRefresh === true) {
					self.retrieveComponentData();
				}
			});
		}

		personnelModal.primValidPhone = "";
		personnelModal.secValidPhone = "";
		personnelModal.terValidPhone = "";

		/**
		 * Handles the building of the HTML for the Provider and the Non-Provider Tab
		 * in the Assign Care Team Modal Dialog Box
		 * @return {Undefined}          Nothing
		 */
		personnelModal.setBodyDataFunction(function() {
			personnelModal.setBodyHTML([
				'<div class="cto2-tab-holder">',
					'<div class="cto2-tab-container" id="tabContainer' + self.getComponentId() + '">',
						'<div class="cto2-tabs">',
							'<ul>',
								'<li id="providerTab" class="cto2-tab-active-header">',
									'<span class="cto2-tab-left-edge">',
										'&nbsp;',
									'</span>',
									'<span class="cto2-tab-text">',
										i18n.discernabu.careteam_o2.PROVIDER,
									'</span>',
									'<span class="cto2-tab-right-edge">',
										'&nbsp;',
									'</span>',
								'</li>',
								'<li id="nonProviderTab">',
									'<span class="cto2-tab-left-edge">',
										'&nbsp;',
									'</span>',
									'<span class="cto2-tab-text">',
										i18n.discernabu.careteam_o2.NON_PROVIDER,
									'</span>',
									'<span class="cto2-tab-right-edge">',
										'&nbsp;',
									'</span>',
								'</li>',
							'</ul>',
						'</div>',
						'<hr>',
					'</div>',
				'</div>',
				'<div id="cto2ProviderTab" class="cto2-provider-area"></div>',
				'<div class="cto2-provider-display">',
					'<hr class="cto2-rule">',
					'<div class="cto2-provider-panel"></div>',
				'</div>'
			].join(''));

			self.initProviderTab();
		});

		/**
		 * This function handles the call to 'mp_add_freetext_person' script to add New Provider and Non-Provider
		 * @param {boolean} closeOnSuccess
		 *        flag to close the modal or not
		 * @return {Undefined}          Nothing
		 */
		var addProviderandNonProvider = function(closeOnSuccess) {
			//Load Spinner assignProviderAndNonProviderModalbody
			$("#ctoAssignAndAddBtn").prop("disabled", true);
			$("#ctoAssignBtn").prop("disabled", true);

			var sendAr = [
				'^MINE^',
				'~~'
			];

			var capTimer;
			var jsonString = buildAddRequestString();
			var request = new ScriptRequest();
			request.setProgramName("mp_add_freetext_person");
			request.setDataBlob(jsonString);
			request.setParameterArray(sendAr);
			request.setResponseHandler(function(addPersonReply){
				var addPersonReplyStatus = addPersonReply.getResponse().STATUS_DATA.STATUS;
				//If the reply is success the remove the spinner
				//If the closeonSuccess is true then close the Modal Dialog and refresh the component to show new assignments
				if(addPersonReplyStatus === "S"){
					shouldRefresh = true;
					if (closeOnSuccess) {
						MP_ModalDialog.closeModalDialog(modalId);
						shouldRefresh = false;
						self.retrieveComponentData();
					}
				}
				else if (addPersonReplyStatus === "Z") {
					MP_ModalDialog.closeModalDialog("assignProviderAndNonProviderModal");
					self.createErrorModal("<p>" + i18n.discernabu.careteam_o2.NO_RESULTS + "</p>");
					logger.logError(i18n.discernabu.careteam_o2.NO_RESULTS);
				}
				else if (addPersonReplyStatus === "F") {
					MP_ModalDialog.closeModalDialog("assignProviderAndNonProviderModal");
					self.createErrorModal("<p>" + i18n.ERROR_OCCURED + "</p>");
					logger.logError("Error");
				}
				$("#assignProviderAndNonProviderSpinner").remove();
				$("#assignProviderAndNonProviderModalbody .loading-screen").remove();
			});

			if (defaultTab === "provider") {
				capTimer = new CapabilityTimer("CAP:MPG_Add_New_Care_Team_Provider", "New Freetext Provider");
			}
			else {
				capTimer = new CapabilityTimer("CAP:MPG_Add_New_Care_Team_Non_Provider");
			}

			if (capTimer) {
				capTimer.capture();
			}

			request.performRequest();
		};

		/**
		 * Handles call to mp_upd_care_team_assignment from existing provider assignment
		 *
		 * @param {boolean} closeOnSuccess
		 *        flag to close the modal or not
		 * @return {Undefined}          Nothing
		 */
		var addProviderCareTeam = function(closeOnSuccess) {
			$("#ctoAssignAndAddBtn").prop("disabled", true);
			$("#ctoAssignBtn").prop("disabled", true);

			var sendAr = [
				'^MINE^',
				'0'
			];

			var jsonString = '{' +
				'"PATIENTS": {' +
					'"QUAL": [{' +
						'"PERSON_ID":' + self.getCriterion().person_id + '.0,' +
						'"ENCNTR_ID":' + self.getCriterion().encntr_id + '.0,' +
						'"ASSIGNMENT_ID":0.0,' +
						'"ORIG_PCT_TEAM_ID":' + (self.m_selected_team || '0.0') + ',' +
						'"ACTIVE_IND":1,' +
						'"BEGIN_EFFECTIVE_ISO":"",' +
						'"END_EFFECTIVE_ISO":"",' +
						'"PRE_GENERATED_ID":0.0,' +
						'"RELATED_PERSON_ID":0.0,' +
						'"RELATED_PRSNL_ID":' + (self.m_selected_team ? '0' : $('#cto2ProviderId').val()) + '.0,' +
						'"ASSIGNED_RELTN_TYPE_CD":' + self.m_selected_role +'.0,' +
					'}]' +
				'}' +
			'}';

			var request = new MP_Core.ScriptRequest(self, "");
			request.setProgramName("MP_UPD_CARE_TEAM_ASSIGNMENT");
			request.setRequestBlobIn(jsonString);
			request.setParameters(sendAr);
			request.setAsync(true);
			MP_Core.XMLCCLRequestCallBack(null, request, function(updCareTeamReply){
				var updCareTeamResponseStatus = updCareTeamReply.getStatus();

				if(updCareTeamResponseStatus === "S"){
					shouldRefresh = true;
					if(self.getCriterion().provider_id === self.selectedPersonId ){
						var roleCode = updCareTeamReply.getResponse().ID_LIST[0].ASSIGNED_RELTN_TYPE_CD;
						self.setAssignedRelationshipCode(roleCode);
					}

					if (closeOnSuccess) {
						MP_ModalDialog.closeModalDialog(modalId);
						shouldRefresh = false;
						// argument passed to the retrieveComponentData is the boolean value returned from the shouldPreserveRole function
						self.retrieveComponentData(self.shouldPreserveRole());
					}
				}
				else if (updCareTeamResponseStatus === "Z") {
					MP_ModalDialog.closeModalDialog("assignProviderAndNonProviderModal");
					self.createErrorModal("<p>" + i18n.discernabu.careteam_o2.NO_RESULTS + "</p>");
					logger.logError(i18n.discernabu.careteam_o2.NO_RESULTS);
				}
				else if (updCareTeamResponseStatus === "F") {
					self.finalizeComponent(MP_Util.HandleErrorResponse(self.getStyles().getNameSpace(), updCareTeamReply.getError()), "");
				}
				$("#assignProviderAndNonProviderSpinner").remove();
				$("#assignProviderAndNonProviderModalbody .loading-screen").remove();
			});

			var capTimer = new CapabilityTimer("CAP:MPG_Add_New_Care_Team_Provider", "Existing Provider");

			if (capTimer) {
				capTimer.capture();
			}

			// Resetting values to undefined so the current values are not preserved. This allows for the logic in the json
			// construction depending on these value being set or not to remain valid each time a user adds an existing provider/care team.
			self.m_selected_role = undefined;
			self.m_selected_team = undefined;
		};

		/*
		* Function to launch the NonProvider Modal Window
		*/
		function showNonProviderTab() {
			$('#cto2ProviderTab').hide();
			var $providerSearchList = $(".dyn-modal-dialog div").filter(function() {return this.id.match(/^control_\d+_content/); });
			$providerSearchList.hide();
			$('#providerTab').removeClass('cto2-tab-active-header');
			$('#nonProviderTab').addClass('cto2-tab-active-header');
			self.addNewNonProviderForm('.cto2-provider-panel');
			$("#ctoAssignAndAddBtn").prop("disabled", true);
			$("#ctoAssignBtn").prop("disabled", true);
		}

		/*
		* Function to launch the Provider Modal Window
		*/
		function showProviderTab(){
			$('#cto2ProviderTab').show();
			$('.cto2-provider-panel').empty();
			$('.cto2-provider-display').find('hr').show();
			$("#ctoAssignAndAddBtn").prop("disabled", true);
			$("#ctoAssignBtn").prop("disabled", true);
			$('#nonProviderTab').removeClass('cto2-tab-active-header');
			$('#providerTab').addClass('cto2-tab-active-header');
			$("#cto2ProviderTab input").filter(function() {return this.id.match(/^control_\d+_textbox/); }).val("");
			$(".cto2-provider-search-placeholder").removeClass('hidden');
		}

		function buildAddRequestString(){
			var getPersonnelIndicator = function() {
				if($('#providerTab').hasClass('cto2-tab-active-header')){
					return '"CREATE_PRSNL_IND":1,';
				}
				else {
					return '"CREATE_PRSNL_IND":0,';
				}
			};
			var getPhoneObject = function(elementID, phoneNum) {
				if ($.trim($('#' + elementID + '').val()) !== '') {
					return '{' +
						'"TYPE":' + $('#' + elementID + 'InputGroup .cto2-phone-type').val() + '.0,' +
						'"PHONE_NUMBER":"'+ phoneNum + '"' +
					'}';
				}
				else {
					return '';
				}
			};
			var phones = [];
			var primaryPhone = getPhoneObject('cto2PrimaryPhoneTextbox', personnelModal.primValidPhone);
			if (primaryPhone) {
				phones.push(primaryPhone);
			}
			var secondaryPhone = getPhoneObject('cto2SecPhoneTextbox', personnelModal.secValidPhone);
			if (secondaryPhone) {
				phones.push(secondaryPhone);
			}
			var tertiaryPhone = getPhoneObject('cto2TerPhoneTextbox', personnelModal.terValidPhone);
			if (tertiaryPhone) {
				phones.push(tertiaryPhone);
			}
			return '{' +
				'"REQUESTIN":{' +
					'"PERSON_ID":' + person_id + '.0,' +
					'"ENCNTR_ID":' + encntr_id + '.0,' +
					'"USER_ID":' +  user_id + '.0,' +
					'"NEW_PERSONS":[{' +
						getPersonnelIndicator() +
						'"CARE_TEAM_ASSIGNMENT":1,' +
						'"FIRST_NAME":"' + $.trim($('#cto2FirstNameTextbox').val()) + '",' +
						'"LAST_NAME":"' + $.trim($('#cto2LastNameTextbox').val()) + '",' +
						'"MIDDLE_NAME":"' + $.trim($('#cto2MiddleNameTextbox').val()) + '",' +
						'"RELATIONSHIP_TO_PATIENT_CD":' + $('.cto2-selected-list').attr('data-value') + '.0,' +
						'"PHONES_LIST":[' +
							phones.join(',') +
						']' +
					'}]' +
				'}' +
			'}';
		}
		// Update and show modal
		MP_ModalDialog.updateModalDialogObject(personnelModal);
		MP_ModalDialog.showModalDialog(personnelModal.getId());
		$('#providerTab').on('click', showProviderTab);
		$('#nonProviderTab').on('click', showNonProviderTab);
		if(defaultTab === 'provider'){
			showProviderTab();
		}
		else{
			showNonProviderTab();
		}

		/*
		* Function to validate the input text and phonenumber in the Provider and the Non-provider form
		*/
		function validateForm() {
			var textBoxValidation = function(textInput){
				if($.trim(textInput.val()).length > 0){
					textInput.addClass("te-valid");
				}
				else {
					textInput.removeClass("te-valid");
				}
			};
			var phoneValidation = function(phoneInput) {
				return $.trim(phoneInput.val()).replace(/[^0-9]+/g,'');
			};

			personnelModal.primValidPhone = phoneValidation($("#cto2PrimaryPhoneTextbox"));
			personnelModal.secValidPhone = phoneValidation($("#cto2SecPhoneTextbox"));
			personnelModal.terValidPhone = phoneValidation($("#cto2TerPhoneTextbox"));
			textBoxValidation($("#cto2FirstNameTextbox"));
			textBoxValidation($("#cto2LastNameTextbox"));
			textBoxValidation($("#cto2PrimaryPhoneTextbox"));

			/*
			* if the required fields firstname, lastname, primary phonenumber are not empty and validated then
			* enable the "Assign" and "Assign and Add Another" buttons else keep the buttons disabled.
			*/
			if($.trim($('#cto2FirstNameTextbox').val()) === '' || $.trim($('#cto2LastNameTextbox').val()) === '' ||
				personnelModal.primValidPhone === '' || $('.cto2-selected-list').length === 0){
				$("#ctoAssignAndAddBtn").prop("disabled", true);
				$("#ctoAssignBtn").prop("disabled", true);
			}
			else {
				$("#ctoAssignAndAddBtn").prop("disabled", false);
				$("#ctoAssignBtn").prop("disabled", false);
			}
		}
		$(".cto2-provider-display").on("keyup change", "input", validateForm);
		$(".cto2-provider-display").on("cto2-role-selected", ".cto2-form-roles-holder", validateForm);
	};

	CareTeamo2Component.prototype.addProviderSpinner = function() {
		var $providerDiv = $("#cto2ProviderTab");
		var $modalBody = $("#assignProviderAndNonProviderModalbody");
		if ($("#assignProviderAndNonProviderSpinner").length === 0) {
			var $spinnerDiv = $('<div id="assignProviderAndNonProviderSpinner" class="spinner-container"></div>')
				.css({
					'margin-top': $providerDiv.position().top + $providerDiv.outerHeight(),
					'right': $modalBody.width() + parseInt($modalBody.css('margin-right'), 10) - $providerDiv.width(),
					'bottom': $('#assignProviderAndNonProviderModalfooter').height()
				});
			$('#assignProviderAndNonProviderModalbody').append($spinnerDiv);
			this.addModalSpinner("assignProviderAndNonProviderSpinner");
		}
	};

	/**
	 * This function initialized the provider tab inside the modal dialogue and loads the personnel search.
	 */
	CareTeamo2Component.prototype.initProviderTab = function() {
		var self = this;
		var $providerDiv = $('#cto2ProviderTab');
		var personnelSearch = new MPageControls.PersonnelSearch($providerDiv);

		personnelSearch.setUserId(this.getCriterion().provider_id);
		// setting to 49 to limit results to 50, backend script suffers from off by one error
		personnelSearch.setSuggestionLimit(49);

		//adding the 'Search' default text placeholder in the providerTab
		$("#cto2ProviderTab ").append('<span class="cto2-provider-search-placeholder">' + i18n.discernabu.careteam_o2.SEARCH + '</span>');
		$(".cto2-provider-search-placeholder").on('click',function(){
			$("#cto2ProviderTab .search-box").focus();
		});

		var $footer = $('#assignProviderAndNonProviderModalfooter');

		var footerBottom = parseInt($footer.offset().top + $footer.height(), 10);
		var searchBottom = parseInt($providerDiv.offset().top + $providerDiv.height(), 10);

		var resultsBoxHeight = footerBottom - searchBottom;
		personnelSearch.setTemplateMaxHeight(resultsBoxHeight);

		//Default text "Search" is displayed in the Provider Search Bar
		$providerDiv.on('keyup', 'input', function(event) {
			var $target = $(event.target);
			if ($target.val()) {
				$(".cto2-provider-search-placeholder").addClass('hidden');
				self.addProviderSpinner();
			}
			else {
				$(".cto2-provider-search-placeholder").removeClass('hidden');
			}
		});

		$providerDiv.on('click', '.close-btn', function() {
			$("#assignProviderAndNonProviderSpinner").remove();
			$(".cto2-provider-search-placeholder").removeClass('hidden');
		});

		/**
		 * Override auto suggest setSuggestions
		 * Sets the items to be displayed as suggestions. These items should be an
		 * array of objects.
		*/
		personnelSearch.setSuggestions = function(items) {
			this.setItems(items);

			// Synchs the listDiv width, if necessary
			if (this.getSynchSuggestionsWidth()) {
				$("#control_" + this.getControlId() + "_content").css('min-width', this.getElement().width() + "px");
			}

			this.getList().renderItems(items);

			var detailDialog = this.getDetailDialog();
			detailDialog.show();
			detailDialog.updatePosition();

			// apply highlighting, if enabled
			if (this.getHighlightEnabled()) {
				var hl = new MPageControls.TextHighlighter(this.getList().getElement());
				hl.highlight(this.getValue());
			}

			var self = this;
			var suggestionsContainer = "#control_" + self.getControlId() + "_content .suggestions";
			//make the suggestions container focusable
			$(suggestionsContainer)
				.attr("tabindex", 0)
				.on("blur", function() {
					// Gives a little time to process the blur event
					setTimeout(function() {
						//close the autosuggest content if the search textbox is not focused
						if (self.getElement() && !self.getTextbox().is(":focus")) {
							self.close();
						}
					}, 300);
				});
		};

		personnelSearch.handleSuccess = function(reqNumber, responseText) {
			// ensure we are processing the latest request made
			if (reqNumber == this.getRequestCount() && responseText) {
				$("#assignProviderAndNonProviderSpinner").remove();
				var jsonSearch = JSON.parse(responseText);
				// Handle failed CCL call
				if (jsonSearch.RECORD_DATA.STATUS_DATA.STATUS === "F") {
					MP_Util.LogScriptCallError(null, responseText, "program_search.js", "handleSuccess");
					MP_Util.LogError(this.getProgramName() + " failed: " + responseText);
					return;
				}

				var context = this.makeContext(jsonSearch);
				this.setSuggestions(context);
			}
		};

		personnelSearch.setListTemplate(MPageControls.getDefaultTemplates().providerSuggestList);

		var personnelList = personnelSearch.getList();
		personnelList.setOnSelect(function() {
			self.processSelection(personnelList.getSelectedItem());
			$('.suggestions').hide();
			$("#ctoAssignAndAddBtn").prop("disabled", true);
			$("#ctoAssignBtn").prop("disabled", true);
			self.addProviderSpinner();
		});

		$('#vwpModalDialogassignProviderAndNonProviderModal').on('click', '#newProviderAssignment' , function() {
			self.addNewProviderForm('.cto2-provider-panel');
			$('.suggestions').hide();
			$("#ctoAssignAndAddBtn").prop("disabled", true);
			$("#ctoAssignBtn").prop("disabled", true);
		});
	};

	/**
	 * Creates an error modal dialog for the error message taken as input
	 *
	 * @param {string} appendHtml
	 *        The error string HTML to be added to the modal dialog body
	 */
	CareTeamo2Component.prototype.createErrorModal = function(appendHtml) {
		try {
			if (typeof appendHtml !== "string" || appendHtml === "") {
				throw new Error("CareTeamo2Component.createErrorModal - Error creating error modal dialog : appendHtml is empty or not a string");
			}
			var errorDialogId = "careTeamErrorModalDialogId";

			var footerButton = new ModalButton("manageCareTeamProviderErrorButton")
				.setText(i18n.discernabu.OK)
				.setCloseOnClick(true)
				.setOnClickFunction(function() {
					MP_ModalDialog.closeModalDialog(errorDialogId);
					MP_ModalDialog.deleteModalDialogObject(errorDialogId);
				});

			// Create the modal dialog body using the MP_Util utility
			var modalObj = MP_Util.generateModalDialogBody(errorDialogId, "", appendHtml, "")
				.setShowCloseIcon(false)
				.addFooterButton(footerButton);

			// Update and show the modal.
			MP_ModalDialog.updateModalDialogObject(modalObj);
			MP_ModalDialog.showModalDialog(errorDialogId);
		}
		catch (err) {
			logger.logError(err.message);
		}
	};

	/**
	* This function creates a list of communication type options to be displayed in the dropdown
	* for providers and non providers. Adds a selected attribute if the CDF Meaning matches the
	* parameter that is passed. If the defaultValue doesn't match any of the CDF Meaning then a blank
	* option is set as selected. If the m_communicationTypeCodes is empty it returns a blank string.
	*
	* @param {String} defaultValue
	*        A string of the display value that should be displayed as default.
	* @returns {String}
	*          HTML template of options to be displayed in a select drop down box.
	*/
	CareTeamo2Component.prototype.getContactTypeOptionList = function(defaultValue) {
		if (this.m_communicationTypeCodes.length){
			var self = this;
			var defaultMatch = false;
			var optionList = [];

			var codesLength = self.m_communicationTypeCodes.length;
			for (var i = 0; i < codesLength; i++) {
				var typeCode = self.m_communicationTypeCodes[i];

				if (typeCode.MEANING === defaultValue) {
					defaultMatch = true;

					optionList.push(
						'<option value="' + typeCode.CODE + '" title="' + typeCode.DISPLAY + '" selected="selected">',
							typeCode.DISPLAY,
						'</option>'
					);
				}
				else {
					optionList.push(
						'<option value="' + typeCode.CODE + '" title="' + typeCode.DISPLAY + '">',
							typeCode.DISPLAY,
						'</option>'
					);
				}
			}
			// If there is no default option set, add an empty option to the beginning of the select list.
			if (defaultMatch === false) {
				optionList.unshift('<option value="" selected="selected"></option>');
			}
			return [
				'<div>',
					'<select class="cto2-phone-type">',
						optionList.join(''),
					'</select>',
				'</div>'
			].join('');
		}
		else{
			return '';
		}
	};

	/**
	 * This method accepts the selected item from the provider search and makes a CCL to retrieve
	 * the care team build for that provider which are then rendered in the modal window.
	 *
	 * @param {Object} selectedItem
	 *        An object of the element that was selected from the drop down.
	 */
	CareTeamo2Component.prototype.processSelection = function(selectedItem) {
		var self = this;
		self.selectedPersonId = selectedItem.PERSON_ID;

		var sendAr = [
			'^MINE^', // OUTDEV
			self.criterion.logical_domain_id, // Logical Domain ID
			'0.0', // Medical Service Code
			'0.0', // Team Code
			selectedItem.PERSON_ID + '.0', // Personnel ID
			0, // Return as Record
			0, // Return Personnel Phones
			self.criterion.facility_cd + '.0' // Facility Code
		];
		var request = new ScriptRequest()
			.setProgramName('MP_GET_PCT_CARE_TEAM_CONFIG')
			.setParameterArray(sendAr)
			.setResponseHandler(function(reply) {
				var status = reply.getStatus();
				if (status === 'S' || status === 'Z') {
					$("#assignProviderAndNonProviderSpinner").remove();
					var response = reply.getResponse();

					var codes = response.CODES;
					var codesArray = MP_Util.LoadCodeListJSON(codes);

					var pctTeams = response.PCT_TEAMS;
					var teamsLength = pctTeams.length;

					// Loads a Provider List from the reply utilizing the codeDisplayHash
					var getProviderList = function() {
						var list = [];
						// Loops through the code display hash to create a list, assigning codes to data-value and disaplay as values of list.
						// The data values are picked up in the on-click event on the list elements defined below.
						for(var codeDisplayKey in self.m_providerRoleCodes) {
							if (self.m_providerRoleCodes.hasOwnProperty(codeDisplayKey)) {
								list.push([
									'<li data-value="' + codeDisplayKey + '">',
										self.m_providerRoleCodes[codeDisplayKey],
									'</li>'
								].join(''));
							}
						}

						return [
							'<ul>',
								list.join(''),
							'</ul>'
						].join('');
					};

					// Loads a TeamList from the reply using medserv code and team cd
					var getTeamList = function() {
						if (teamsLength === 0) {
							return [
								'<div>',
									i18n.discernabu.careteam_o2.NO_TEAM_ASSIGNMENTS,
								'</div>'
							].join('');
						}

						var list = [];
						for (var i = 0; i < teamsLength; i++) {
							var team = pctTeams[i];

							// Medical Service NAme
							var pctCareTeamName = MP_Util.GetValueFromArray(team.PCT_MEDSERV_CD, codesArray).display;
							if (team.PCT_TEAM_CD) {
								// Team Name
								pctCareTeamName += ' | ' + MP_Util.GetValueFromArray(team.PCT_TEAM_CD, codesArray).display;
							}
							if (team.FACILITY_CD){
								// Facility Name
								pctCareTeamName += ' (' + MP_Util.GetValueFromArray( team.FACILITY_CD, codesArray).display + ')';
							}

							list.push([
								'<li data-value="' + team.ORIG_PCT_TEAM_ID + '">',
									pctCareTeamName,
								'</li>'
							].join(''));
						}

						return [
							'<ul>',
								list.join(''),
							'</ul>'
						].join('');
					};

					var listHtml = [
						'<div class="cto2-providers" id="cto2-' + selectedItem.PERSON_ID + '">',
							'<input id="cto2ProviderId" type="hidden" value="' + selectedItem.PERSON_ID + '"/>',
							'<p>',
								selectedItem.NAME_FULL_FORMATTED,
							'<p>',
							'<div class="cto2-provider-options">',
								'<div class="cto2-provider-content">',
									'<span class="te-required-ind">*</span>',
									'<span class="cto2-roles-label">',
										i18n.discernabu.careteam_o2.PROVIDER_ROLE,
									'</span>',
									'<div class="cto2-provider-list">',
										getProviderList(),
									'</div>',
								'</div>',
								'<div class="cto2-team-content">',
									'<p>',
										i18n.discernabu.careteam_o2.PROVIDER_TEAM,
									'</p>',
									'<div class="cto2-team-list">',
										getTeamList(),
									'</div>',
								'</div>',
							'</div>',
						'</div>'
					].join('');

					//honors the default selection of the lastSelectedRole in the Role's List
					function highlightLastSelectedRole(){
						self.m_selected_role = self.curUserLastSelectedRole;

						$(".cto2-provider-panel").html(listHtml).find("li[data-value=" + self.curUserLastSelectedRole + "]").addClass("cto2-selected-list");
					}

					$("#assignProviderAndNonProviderSpinner").remove();

					//highlight the lastSelected Role in the Role List only if the selected provider is same as the user at the criterion else donot highlight
					if(selectedItem.PERSON_ID === self.criterion.provider_id){
						//if the lastSelectedRole is not saved at the criterion; call retrieveLastAssignedRole to get the last Role saved for the provider from the table
						// and call highlightLastSelectedRole to honor default selection of the lastSelectedRole.
						if (self.curUserLastSelectedRole === null) {
							self.retrieveLastAssignedRole();
						}
						highlightLastSelectedRole();
					}
					else{
						$(".cto2-provider-panel").html(listHtml);
					}

					$("#vwpModalDialogassignProviderAndNonProviderModal").on("click", ".cto2-provider-list li", function(e) {
						$(".cto2-provider-list li").removeClass("cto2-selected-list");
						self.m_selected_role = $(e.target).data("value");
						$(e.target).addClass("cto2-selected-list");
						$(".cto2-provider-display").trigger("cto2-provider-role-selected");

					});

					$("#vwpModalDialogassignProviderAndNonProviderModal").on("click", ".cto2-team-list li", function(e) {
						$(".cto2-team-list li").removeClass("cto2-selected-list");
						self.m_selected_team = $(e.target).data("value");
						$(e.target).addClass("cto2-selected-list");
						$(".cto2-provider-display").trigger("cto2-provider-role-selected");
					});

					function validateProviderListsSelected() {
						if ($(".cto2-provider-list .cto2-selected-list").length) {
							$("#ctoAssignAndAddBtn").prop("disabled", false);
							$("#ctoAssignBtn").prop("disabled", false);
						}
						else {
							$("#ctoAssignAndAddBtn").prop("disabled", true);
							$("#ctoAssignBtn").prop("disabled", true);
						}
					}

					$(".cto2-provider-display").on("cto2-provider-role-selected", validateProviderListsSelected);
				}
				else {
					MP_ModalDialog.closeModalDialog("assignProviderAndNonProviderModal");
					self.createErrorModal("<p>" + i18n.ERROR_OCCURED + "</p>");
					logger.logError("Error");
				}
		});
		request.performRequest();
	};

	/**
	 * This function generates the HTML form in the Care Team Modal Window for Adding Provider and Non-Provider
	 *
	 * @param {roleList} 
	 *			Flag to load Provider Role's List or the Non-Provider Role's LiSt from the code-set value
	 * @param {isProvider}
	 *			Flag to load the appropriate phoneTypes if the Provider Tab is active else 
	 *			load the phonetypes as required for the Non-provider Tab. 
	 */
	CareTeamo2Component.prototype.getProviderNonProviderFormHTML = function(roleList, isProvider) {
		var ctI18n = i18n.discernabu.careteam_o2;

		var getRolesList = function() {
			var list = [];
			for (var key in roleList) {
				if (roleList.hasOwnProperty(key)) {
					list.push([
						'<li data-value="' + key + '">',
							roleList[key],
						'</li>'
					].join(''));
				}
			}
			return list.join('');
		};

		var formHTML = [
			'<div class="cto2-assign-provider-form">',
				'<form>',
					'<div class="cto2-provider-form-holder">',
						'<div id="cto2-form-inputs" class="cto2-modal-form-inputs">',
							this.providerFormTextControls('cto2FirstNameTextbox', ctI18n.FIRST, TextControl.width.LARGE, 'cto2-form-inputs', true),
							this.providerFormTextControls('cto2LastNameTextbox', ctI18n.LAST, TextControl.width.LARGE, 'cto2-form-inputs', true),
							this.providerFormTextControls('cto2MiddleNameTextbox', ctI18n.MIDDLE, TextControl.width.LARGE, 'cto2-form-inputs'),
							this.providerFormTextControls('cto2PrimaryPhoneTextbox', ctI18n.PRIMARY_PHONE, TextControl.width.MEDIUM, 'cto2-form-inputs', true),
							this.providerFormTextControls('cto2SecPhoneTextbox', '', TextControl.width.MEDIUM,'cto2-form-inputs'),
							this.providerFormTextControls('cto2TerPhoneTextbox', '', TextControl.width.MEDIUM, 'cto2-form-inputs'),
						'</div>',
						'<div class="cto2-form-roles te-label-top">',
							'<div class="te-label te-required-label">',
								'<span class="te-required-ind">*</span>',
								'<span class="te-label-text">',
									isProvider ? i18n.discernabu.careteam_o2.PROVIDER_ROLE : i18n.discernabu.careteam_o2.NONPROVIDER_ROLE,
								'</span>',
							'</div>',
							'<div class="cto2-form-roles-holder">',
								'<ul>',
									getRolesList(),
								'</ul>',
							'</div>',
						'</div>',
					'</div>',
				'</form>',
			'</div>'
		].join('');
		var $formElement = $(formHTML);
		$formElement.find('#cto2PrimaryPhoneTextbox, #cto2SecPhoneTextbox, #cto2TerPhoneTextbox').addClass('pull-left');

		if (isProvider) {
			$formElement.find('#cto2PrimaryPhoneTextboxInputGroup').append(this.getContactTypeOptionList('BUSINESS'));
			$formElement.find('#cto2SecPhoneTextboxInputGroup').append(this.getContactTypeOptionList('MOBILE'));
			$formElement.find('#cto2TerPhoneTextboxInputGroup').append(this.getContactTypeOptionList('FAX BUS'));
		}
		else {
			$formElement.find('#cto2PrimaryPhoneTextboxInputGroup').append(this.getContactTypeOptionList('HOME'));
			$formElement.find('#cto2SecPhoneTextboxInputGroup').append(this.getContactTypeOptionList());
			$formElement.find('#cto2TerPhoneTextboxInputGroup').append(this.getContactTypeOptionList());
		}

		return $formElement.html();
	};

	/**
	 * Creates a new form for the Assignment of a new provider or non-provider and appends the mark up to the parent selector.
	 *
	 * @param {String} parentSelector
	 *        The selector to which the form will be appended.
	 * @param {Array} roleList
	 *        List of roles
	 */
	CareTeamo2Component.prototype.addNewProviderNonProviderForm = function(parentSelector, roleList, isProvider) {
		var formHTML = this.getProviderNonProviderFormHTML(roleList, isProvider);
		$(parentSelector).html(formHTML);

		this.bindFormEvents('#vwpModalDialogassignProviderAndNonProviderModal');
	};

	/**
	 * Creates a new form for the Assignment of a new provider and appends the mark up to the provider panel.
	 *
	 * @param {String} parentSelector
	 *        The selector to which the form will be appended.
	 */
	CareTeamo2Component.prototype.addNewProviderForm = function(parentSelector) {
		var isProvider = true;
		this.addNewProviderNonProviderForm(parentSelector, this.m_providerRoleCodes, isProvider);
	};

	/**
	 * Creates a new form for the Assignment of a new provider and appends the
	 * mark up to the provider panel.
	 */
	CareTeamo2Component.prototype.addNewNonProviderForm = function(parentSelector) {
		var isProvider = false;
		$('.cto2-provider-display hr').hide();
		this.addNewProviderNonProviderForm(parentSelector, this.m_nonProviderRoleCodes, isProvider);
	};

	/**
	 * This method creates a html string for a text box by using the mpages-text-controls api.
	 *
	 * @param {String} id
	 *        Id to be assigned to the new text box
	 * @param {String} label
	 *        Label to be displayed at the beginning of the textbox.
	 * @param {String} width
	 *        String to be passed that defines the width of the textbox from one of the types defined in the TextControl class.
	 * @param {String} delegate
	 *        Id of the parent element to which the textbox needs to be appended.
	 * @returns {String}
	 *          Html Template string of the text box generated.
	 */
	CareTeamo2Component.prototype.providerFormTextControls = function(id, label, width, delegate, required) {
		return new TextControl()
			.setId(id)
			.setDelegateId(delegate)
			.setLabel(label)
			.setPredefinedWidth(width)
			.setRequired(!!required)
			.renderRaw();
	};

}(jQuery));

/**
 * Map the Care Team O2 object to the bedrock filter mapping so the architecture
 * will know what object to create when it sees the "WF_CARE_TEAM" filter
 */
MP_Util.setObjectDefinitionMapping("WF_CARE_TEAM", CareTeamo2Component);
