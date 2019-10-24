//refresh, primaryLabel, ShowTodayValue, GraphFlag, FilterRefresh, InsertData, ClinicalEventListenerAdded
/**
 * Project: mp_laboratory_o1.js
 * @class
 */
function LaboratoryComponentStyle() {
	this.initByNamespace("lab");
}

LaboratoryComponentStyle.prototype = new ComponentStyle();
LaboratoryComponentStyle.prototype.constructor = LaboratoryComponentStyle;

/**
 * The Laboratory component will retrieve all labs associated to the patient
 *
 * @param {Object} criterion : criterion object for component
 * @author Greg Howdeshell
 * @class
 */
function LaboratoryComponent(criterion) {
	this.setCriterion(criterion);
	this.setLookBackDropDown(true);
	this.setStyles(new LaboratoryComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.LABS.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.LABS.O1 - render component");
	this.setIncludeLineNumber(false);
	this.m_graphLink = 1;
	this.m_showTodayValue = false;
	this.m_primaryLabel = i18n.discernabu.laboratory_o1.PRIMARY_RESULTS;
	this.m_errorLoadingData = false;
	this.m_totalResultCount = 0;
	this.m_filterLabel = "";
	this.setPregnancyLookbackInd(true);
	this.m_clinicalEventListenerAdded = false;
};

LaboratoryComponent.prototype = new MPageComponent();
LaboratoryComponent.prototype.constructor = LaboratoryComponent;

/*
 * Calls Insertdata and refreshes the component
 * @returns {undefined} : undefined/void
 */
LaboratoryComponent.prototype.refresh = function(event, args) {
	if (args != "GrowthChart") {
		var contentNode = this.getSectionContentNode();
		contentNode.innerHTML = "";
		this.InsertData();
	}
};

/*
 * Gets m_primaryLabel from the component
 * @returns {String}primaryLabel : the primary label i18n text
 */
LaboratoryComponent.prototype.getPrimaryLabel = function() {
	return (this.m_primaryLabel);
};

/*
 * Sets the m_primaryLabel to the passed in value
 * @params {String}value : the new primaryLabel string
 */
LaboratoryComponent.prototype.setPrimaryLabel = function(value) {
	this.m_primaryLabel = value;
};

/*
 * Gets the m_showTodayValue and returns it
 * @returns {boolean}showTodayValue : show Today's value or not
 */
LaboratoryComponent.prototype.isShowTodayValue = function() {
	return (this.m_showTodayValue);
};

/*
 * Sets the m_showTodayValue to the passed parameter
 * @params {boolean}value : new value that m_showTodayValue will be
 * @returns {undefined} : undefined/void
 */
LaboratoryComponent.prototype.setShowTodayValue = function(value) {
	this.m_showTodayValue = value;
};

/*
 * Gets the m_graph flag
 * @returns {number}graphLink : does graph have hyperlink
 */
LaboratoryComponent.prototype.getGraphFlag = function() {
	return (this.m_graphLink);
};

/*
 * Sets the m_graph flag to the given value
 * @params {number}value : GraphFlag's new value to be assigned
 * @returns {undefined} : undefined/void
 */
LaboratoryComponent.prototype.setGraphFlag = function(value) {
	this.m_graphLink = value;
};

LaboratoryComponent.prototype.FilterRefresh = function(label, esArray) {
	CERN_LABORATORY_O1.RefreshLabTable(this, label, esArray);
};

/*
 * Calls retrieveComponentData to get add the data to the component
 * @returns {undefined} : undefined/void
 */
LaboratoryComponent.prototype.InsertData = function(){
	if (this.getGrouperFilterEventSets()) {
		CERN_LABORATORY_O1.RefreshLabTable(this, this.getGrouperFilterLabel(), this.getGrouperFilterEventSets());
	}
	else {
		CERN_LABORATORY_O1.GetLaboratoryTable(this);
	}
};

/*
 * Sets the m_ClinicalEventListenerAdded to the passed value
 * @params {boolean}value : was event listener added
 * @returns {undefined} : undefined/void
 */
LaboratoryComponent.prototype.setClinicalEventListenerAdded = function(value){
	this.m_clinicalEventListenerAdded = value;
};

/*
 * Gets the m_ClinicalEventListenerAdded boolean that shows whether the
 * CLINICAL_EVENT listener was added to the component.
 * @returns {boolean} : has the eventListener been added
 */
LaboratoryComponent.prototype.isClinicalEventListenerAdded = function(){
	return this.m_clinicalEventListenerAdded;
};

/**
 * Creates the filterMappings that will be used when loading the component's bedrock settings
 * @returns {undefined} : undefined/void
 */
LaboratoryComponent.prototype.loadFilterMappings = function() {

	//Add the filter mapping object for the Catalog Type Codes
	this.addFilterMappingObject("LAB_INFO_BUTTON_IND", {
		setFunction: this.setHasInfoButton,
		type: "BOOLEAN",
		field: "FREETEXT_DESC"
	});
};

/*
 * Called before the component is rendered
 * @returns {undefined} : undefined/void
 */
LaboratoryComponent.prototype.preProcessing = function() {
	//Call the base class implementation for future support
	MPageComponent.prototype.preProcessing.call(this);

	var group = null;
	var groupArr = this.getGroups();
	var z = 0;
	if (groupArr && groupArr.length) {
		for ( z = groupArr.length; z--; ) {
			group = groupArr[z];
			switch (group.getGroupName()) {
				case "LAB_PRIMARY_CE":
				case "LAB_PRIMARY_CE_SEQ":
				case "ED_LAB_PRIMARY_CE":
				case "IS_LAB_PRIMARY_CE":
				case "NC_LAB_PRIMARY_CE":
					group.setGroupName(i18n.PRIMARY_RESULTS);
					break;
				case "LAB_SECONDARY_ES":
				case "ED_LAB_SECONDARY_ES":
				case "IS_LAB_SECONDARY_ES":
				case "NC_LAB_SECONDARY_ES":
					group.setGroupName(i18n.SECONDARY_RESULTS);
					break;
			}
		}
	}
};

/*
 * Occurs after the component has been rendered, called automagically
 * @returns {undefined} : undefined/void
 */
LaboratoryComponent.prototype.postProcessing = function(){
	//call the base implementation
	MPageComponent.prototype.postProcessing.call(this);

	//Add the even listener only if it hasn't been already
	if(!this.isClinicalEventListenerAdded()) {
		CERN_EventListener.addListener(this, EventListener.EVENT_CLINICAL_EVENT, this.refresh, this);
		this.setClinicalEventListenerAdded(true);
	}
};

/**
 * @namespace CERN_LABORATORY_O1
 * @dependencies Script: mp_get_n_results
 */
var CERN_LABORATORY_O1 = function() {
	return {
		GetLaboratoryTable: function(component) {
			var m_comp = component;
			m_comp.m_totalResultCount = 0;
			var m_contentNode = component.getSectionContentNode();
			m_contentNode.innerHTML = "";
			
			var groups = component.getGroups();
			var xl = (groups !== null) ? groups.length : 0;

			var eventSetArray = [];
			/*Only add defined event sets once*/
			var group;
			var groupES;
			//The set object which will store unique event sets.
			var set = {};
			var esLength;
			for (var x = 0; x < xl; x++) {
				group = groups[x];
				groupES = group.getEventSets();
				esLength = groupES.length;
				for (var y = 0; y < esLength; y++) {
					//Event sets are stored as the name of a dynamic variable within set
					set[groupES[y]] = true;
				}
			}

			for (var eventSet in set) {
				eventSetArray.push(eventSet);
			}
			var eventSetParams = MP_Util.CreateParamArray(eventSetArray, 1);
			var eventCodeParam = "0.0";

			//only load up initial three items to improve overall performance
			var criterion = m_comp.getCriterion();
			var sEncntr = (m_comp.getScope() == 2) ? criterion.encntr_id + ".0" : "0.0";
			var sendAr = ["^MINE^", criterion.person_id + ".0", sEncntr, criterion.provider_id + ".0", criterion.ppr_cd + ".0", 3, "^^", eventSetParams, eventCodeParam, m_comp.getLookbackUnits(), m_comp.getLookbackUnitTypeFlag(), 1];
			var request = new MP_Core.ScriptRequest(m_comp, m_comp.getComponentLoadTimerName());
			request.setProgramName("MP_RETRIEVE_N_RESULTS_JSON");
			request.setParameters(sendAr);
			request.setAsync(true);
			MP_Core.XMLCCLRequestCallBack(m_comp, request, CERN_LABORATORY_O1.RenderComponent);
		},
		RefreshLabTable: function(component, filterLabel, filterESArray) {
			var m_comp = component;
			m_comp.m_totalResultCount = 0;
			m_comp.m_filterLabel = filterLabel;
			var filterEventSetArray = MP_Util.CreateParamArray(filterESArray, 1);
			var eventCodeParam = "0.0";
			var criterion = m_comp.getCriterion();
			var sEncntr = (m_comp.getScope() == 2) ? criterion.encntr_id + ".0" : "0.0";
			var sendAr = [];
			sendAr.push("^MINE^", criterion.person_id + ".0", sEncntr, criterion.provider_id + ".0", criterion.ppr_cd + ".0", 3, "^^", filterEventSetArray, eventCodeParam, m_comp.getLookbackUnits(), m_comp.getLookbackUnitTypeFlag(), 1);
			var request = new MP_Core.ScriptRequest(m_comp, m_comp.getComponentLoadTimerName());
			request.setProgramName("MP_RETRIEVE_N_RESULTS_JSON");
			request.setParameters(sendAr);
			request.setAsync(true);
			MP_Core.XMLCCLRequestCallBack(m_comp, request, CERN_LABORATORY_O1.RenderRefreshComponent);
		},
		RenderRefreshComponent: function(reply) {
			var m_comp = reply.getComponent();
			m_comp.getSectionContentNode().innerHTML = "";
			var m_contentNode = m_comp.getSectionContentNode();
			var m_contentSecNode = Util.cep("div", {
				"className": "content-body"
			});

			CreateInfoHeader(m_comp, m_contentNode, m_contentSecNode);
			var recordData = reply.getResponse();
			switch(recordData.STATUS_DATA.STATUS) {
				case "S":
					var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
					var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
					var mappedResults = CERN_LABORATORY_O1_UTIL.LoadMeasurementData(recordData, personnelArray, codeArray, 1);
					var groupName = m_comp.m_filterLabel;
					var groupSubsection = CreateSubHeader(groupName, false, m_contentSecNode);
					var subSecTitle = Util.Style.g("sub-sec-title", groupSubsection, "SPAN");
					var subContent = Util.cep("div", {
						"className": "sub-sec-content"
					});
					groupSubsection.appendChild(subContent);
					var secContentBody = Util.cep("div", {
						"className": "content-body"
					});
					subContent.appendChild(secContentBody);
					AssociateResultsToGroup(groupSubsection, groupName, mappedResults, subSecTitle[0], secContentBody, m_comp);
					break;
				case "Z":
					m_comp.m_totalResultCount = 0;
					break;
				case "F":
					m_comp.m_errorLoadingData = true;
					break;
			}
			FinalizeComponent(m_comp, m_contentNode, m_contentSecNode);

			//Add Info Button click events
			if (m_comp.hasInfoButton()) {
				var error_name = null;
				var error_msg = null;
				var secContentId = m_contentNode.id;
				var labInfoIcons = $("#" + secContentId).find(".info-icon");
				$.each(labInfoIcons, function() {
					$(this).click(function(e) {
						//Get the values needed for the API
						var patId = $(this).attr("data-patId");
						var encId = $(this).attr("data-encId");
						var eventId = $(this).attr("data-eventId");
						var eventCd = $(this).attr("data-eventCd");
						var eClassCd = $(this).attr("data-eClassCd");
						var resultVal = $(this).attr("data-resVal");
						var resultCd = $(this).attr("data-resValCd");
						var resultUnitCd = $(this).attr("data-resUnitCd");
						var priCriteriaCd = $(this).attr("data-priCriteriaCd");
						var launchInfoBtnApp = window.external.DiscernObjectFactory("INFOBUTTONLINK");
						try {
							if (launchInfoBtnApp) {
								launchInfoBtnApp.SetInfoButtonData(parseFloat(patId), parseFloat(encId), parseFloat(priCriteriaCd), 1, 2);
								launchInfoBtnApp.AddResult(parseFloat(eventId), parseFloat(eventCd), parseFloat(eClassCd), resultVal, parseFloat(resultCd), parseFloat(resultUnitCd));
								launchInfoBtnApp.LaunchInfoButton();
							}
						}
						catch(err) {
							if (err.name) {
								if (err.message) {
									error_name = err.name;
									error_msg = err.message;
								}
								else {
									error_name = err.name;
									error_msg = i18n.discernabu.INFO_BUTTON_ERROR_MSG;
								}
							}
							else {
								error_name = err.name;
								error_msg = i18n.discernabu.INFO_BUTTON_ERROR_MSG;
							}
							MP_Util.LogError(error_name + error_msg);
							var errorModal = MP_ModalDialog.retrieveModalDialogObject("errorModal");
							if (!errorModal) {
								errorModal = MP_Util.generateModalDialogBody("errorModal", "error", error_msg, i18n.discernabu.INFO_BUTTON_ERROR_ACTION);
								errorModal.setHeaderTitle(i18n.ERROR_OCCURED);
								//Create and add the close button
								var closeButton = new ModalButton("closeButton");
								closeButton.setText(i18n.CLOSE).setCloseOnClick(true);
								errorModal.addFooterButton(closeButton);
							}
							MP_ModalDialog.updateModalDialogObject(errorModal);
							MP_ModalDialog.showModalDialog("errorModal");
							return;
						}
						e.preventDefault();
						e.stopPropagation();
						e.stopImmediatePropagation();
					});
				});
			}
		},

		RenderComponent: function(reply) {
			var m_comp = reply.getComponent();
			var timerRenderComponent = MP_Util.CreateTimer(m_comp.getComponentRenderTimerName());
			var m_contentSecNode = Util.cep("div", {
				"className": "content-body"
			});
			
			var m_contentNode = m_comp.getSectionContentNode();
			CreateInfoHeader(m_comp, m_contentNode, m_contentSecNode);
			try {
				MP_Util.LogScriptCallInfo(m_comp, this, "laboratory.js", "GetResultsByGroup");
				var recordData = reply.getResponse();
				switch(recordData.STATUS_DATA.STATUS) {
					case "S":
						var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
						var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
						var mappedResults = CERN_LABORATORY_O1_UTIL.LoadMeasurementData(recordData, personnelArray, codeArray);
						BuildLaboratoryComponent(mappedResults, m_comp, m_contentSecNode);
						break;
					case "Z":
						m_comp.m_totalResultCount = 0;
						break;
					case "F":
						m_comp.m_errorLoadingData = true;
						break;
				}
				FinalizeComponent(m_comp, m_contentNode, m_contentSecNode);

				//Add Info Button click events
				if (m_comp.hasInfoButton()) {
					var error_name = null;
					var error_msg = null;
					var secContentId = m_contentNode.id;
					var labInfoIcons = $("#" + secContentId).find(".info-icon");
					$.each(labInfoIcons, function() {
						$(this).click(function(e) {
							//Get the values needed for the API
							var patId = $(this).attr("data-patId");
							var encId = $(this).attr("data-encId");
							var eventId = $(this).attr("data-eventId");
							var eventCd = $(this).attr("data-eventCd");
							var eClassCd = $(this).attr("data-eClassCd");
							var resultVal = $(this).attr("data-resVal");
							var resultCd = $(this).attr("data-resValCd");
							var resultUnitCd = $(this).attr("data-resUnitCd");
							var priCriteriaCd = $(this).attr("data-priCriteriaCd");
							var launchInfoBtnApp = window.external.DiscernObjectFactory("INFOBUTTONLINK");
							try {
								if (launchInfoBtnApp) {
									launchInfoBtnApp.SetInfoButtonData(parseFloat(patId), parseFloat(encId), parseFloat(priCriteriaCd), 1, 2);
									launchInfoBtnApp.AddResult(parseFloat(eventId), parseFloat(eventCd), parseFloat(eClassCd), resultVal, parseFloat(resultCd), parseFloat(resultUnitCd));
									launchInfoBtnApp.LaunchInfoButton();
								}
							}
							catch(err) {
								if (err.name) {
									if (err.message) {
										error_name = err.name;
										error_msg = err.message;
									}
									else {
										error_name = err.name;
										error_msg = i18n.discernabu.INFO_BUTTON_ERROR_MSG;
									}
								}
								else {
									error_name = err.name;
									error_msg = i18n.discernabu.INFO_BUTTON_ERROR_MSG;
								}
								MP_Util.LogError(error_name + error_msg);
								var errorModal = MP_ModalDialog.retrieveModalDialogObject("errorModal");
								if (!errorModal) {
									errorModal = MP_Util.generateModalDialogBody("errorModal", "error", error_msg, i18n.discernabu.INFO_BUTTON_ERROR_ACTION);
									errorModal.setHeaderTitle(i18n.ERROR_OCCURED);
									//Create and add the close button
									var closeButton = new ModalButton("closeButton");
									closeButton.setText(i18n.CLOSE).setCloseOnClick(true);
									errorModal.addFooterButton(closeButton);
								}
								MP_ModalDialog.updateModalDialogObject(errorModal);
								MP_ModalDialog.showModalDialog("errorModal");
								return;
							}
							e.preventDefault();
							e.stopPropagation();
							e.stopImmediatePropagation();
						});
					});
				}
			}
			catch (err) {
				MP_Util.LogJSError(err, m_comp, "mp_core.js", "XmlStandardRequest");
				var errMsg = [];
				errMsg.push("<b>", i18nCore.JS_ERROR, "</b><br /><ul><li>", i18nCore.MESSAGE, ": ", err.message, "</li><li>", i18nCore.NAME, ": ", err.name, "</li><li>", i18nCore.NUMBER, ": ", (err.number & 0xFFFF), "</li><li>", i18nCore.DESCRIPTION, ": ", err.description, "</li></ul>");
				if (m_comp && MPageComponent.prototype.isPrototypeOf(m_comp)) {
					m_comp.finalizeComponent(MP_Util.HandleErrorResponse(m_comp.getStyles().getNameSpace(), errMsg.join("")), "");
				}
				if (timerRenderComponent) {
					timerRenderComponent.Abort();
					timerRenderComponent = null;
				}
				throw (err);
			}
			finally {
				if (timerRenderComponent) {
					timerRenderComponent.Stop();
				}
			}
		}
	};

	function CreateInfoHeader(component, secContentNode, contentSecNode) {
		var m_comp = component;
		var labI18n = i18n.discernabu.laboratory_o1;
		var firstColumnHeader = component.isShowTodayValue() ? labI18n.TODAY : labI18n.LATEST;
		var contentHdr = Util.cep("div", {
			"className": "content-hdr"
		});
		Util.ac(contentHdr, secContentNode);

		var ar = [];
		var withinTH = "";

		if (m_comp.getDateFormat() == 3) {
			withinTH = "<br /><span>" + labI18n.WITHIN + "</span>";
		}

		ar.push("<table class='lab-table'><tr class='hdr'><th class='lab-lbl'><span>&nbsp;</span></th><th class='lab-res0'><span>", firstColumnHeader, "</span>", withinTH, "</th><th class='lab-res1'><span>", labI18n.PREVIOUS, "</span>", withinTH, "</th></tr></table>");

		contentHdr.innerHTML = ar.join("");

		Util.ac(contentSecNode, secContentNode);
	}

	function FinalizeComponent(component, secContentNode, contentSecNode) {
		var m_comp = component;
		var m_rootComponentNode = m_comp.getRootComponentNode();
		var styles = m_comp.getStyles();
		var totalCount = Util.Style.g("sec-total", m_rootComponentNode, "span");
		var sResultText = "";
		if (m_comp.m_errorLoadingData) {
			secContentNode.innerHTML = MP_Util.HandleErrorResponse(styles.getNameSpace());
		}
		else {
			if (m_comp.m_totalResultCount === 0) {
				sResultText = MP_Util.CreateTitleText(m_comp, m_comp.m_totalResultCount);
				secContentNode.innerHTML = MP_Util.HandleNoDataResponse();
			}
			else {
				sResultText = MP_Util.CreateTitleText(m_comp, m_comp.m_totalResultCount);
				//Add scrolling class if count is more than scrollnumber
				if (m_comp.m_totalResultCount > m_comp.getScrollNumber() && m_comp.isScrollingEnabled()) {
					Util.Style.acss(contentSecNode, "scrollable ");
					var contentHdr = Util.Style.g("content-hdr", m_rootComponentNode, "div");
					Util.Style.acss(contentHdr[0], "lab-scrl-tbl-hd");
				}
				//init hovers
				MP_Util.Doc.InitHovers(styles.getInfo(), contentSecNode);

				//init subsection toggles
				MP_Util.Doc.InitSubToggles(contentSecNode, "sub-sec-hd-tgl");

				if (m_comp.isScrollingEnabled()) {
					MP_Util.Doc.InitScrolling(Util.Style.g("scrollable", m_rootComponentNode, "div"), m_comp.getScrollNumber(), "2.8");

				}
			}
		}
		totalCount[0].innerHTML = sResultText;

		//Check to see if the component has an error message displayed
		var errorElement = $(m_rootComponentNode).find(".error-message");
		if (errorElement.length) {
			//Add an error icon to the component title
			$(m_rootComponentNode).find(".sec-title span:first-child").addClass("error-icon-component");
			//Ensure the bottom border on the error message is red
			$(errorElement).css("border-bottom", "1px solid #C00");
		}

		//notify the aggregate timer that the component has finished loading
		//usually the notification is handled by MPageComponent or MP_Util.Doc.FinalizeComponent so individual components don't need to
		//Labs-o1 doesn't use the standard methods so it has to call notifyAggregateTimer here
		component.notifyAggregateTimer(); 
	}

	function CreateSubHeader(label, includeContentBody, contentSecNode) {
		var subSec = Util.cep("div", {
			"className": "sub-sec"
		});
		var h3 = Util.cep("h3", {
			"className": "sub-sec-hd lab-sub-scrl-hd"
		});
		subSec.appendChild(h3);

		var spanTgl = Util.cep("span", {
			"className": "sub-sec-hd-tgl",
			"title": i18n.discernabu.laboratory_o1.COLLAPSE
		});
		h3.appendChild(spanTgl);

		var TgltxtNode = document.createTextNode("-");
		spanTgl.appendChild(TgltxtNode);

		var spanTitle = Util.cep("span", {
			"className": "sub-sec-title"
		});
		h3.appendChild(spanTitle);

		var labelTextNode = document.createTextNode(label);
		spanTitle.appendChild(labelTextNode);

		if (includeContentBody) {
			var subContent = Util.cep("div", {
				"className": "sub-sec-content"
			});
			subSec.appendChild(subContent);

			var contentBody = Util.cep("div", {
				"className": "content-body"
			});
			subContent.appendChild(contentBody);
		}
		contentSecNode.appendChild(subSec);
		return (subSec);
	}

	function BuildLaboratoryComponent(mapObjects, component, contentSecNode) {
		var m_comp = component;
		var groups = m_comp.getGroups();
		var measurementHasMap = getMeasurementHashMap(mapObjects);
		for (var x = 0, xl = groups.length; x < xl; x++) {
			var groupName = groups[x].getGroupName();
			var groupEventSets = groups[x].getEventSets();
			var sGroupName = "";
			var groupSubsection = CreateSubHeader(groupName, false, contentSecNode);
			var subSecTitle = Util.Style.g("sub-sec-title", groupSubsection, "SPAN");
			var groupMeasurements = returnMeasureArrayByGroupEventSets(groupEventSets, measurementHasMap);
			if (groupMeasurements.length === 0) {
				if (groupName === i18n.PRIMARY_RESULTS) {//Groupname based on page level
					groupName = m_comp.getPrimaryLabel();
				}
				subSecTitle[0].innerHTML = groupName + " (0)";
			}
			else {
				if (groupName === i18n.PRIMARY_RESULTS) {
					sGroupName = m_comp.getPrimaryLabel();
					var subContent = Util.cep("div", {
						"className": "sub-sec-content"
					});
					groupSubsection.appendChild(subContent);
					var secContentBody = Util.cep("div", {
						"className": "content-body"
					});
					subContent.appendChild(secContentBody);
					AssociateResultsToGroup(groupSubsection, sGroupName, groupMeasurements, subSecTitle[0], secContentBody, m_comp);
				}
				else {
					var measurementSubsection;
					var measurementSubsectionName = "";
					var subsectionMeasurements;
					contentSecNode.removeChild(groupSubsection);
					//remove no longer necessary placeholder for secondary results
					for (var x = 0, xl = groupMeasurements.length; x < xl; x++) {
						//Create a new subsection of measurements, if the subsection does not exist
						if (measurementSubsectionName != groupMeasurements[x].name) {
							subsectionMeasurements = [];
							measurementSubsectionName = groupMeasurements[x].name;
							measurementSubsection = CreateSubHeader(measurementSubsectionName, false, contentSecNode);
							subSecTitle = Util.Style.g("sub-sec-title", measurementSubsection, "SPAN");
							var subContent = Util.cep("div", {
								"className": "sub-sec-content"
							});
							measurementSubsection.appendChild(subContent);
							var secContentBody = Util.cep("div", {
								"className": "content-body"
							});
							subContent.appendChild(secContentBody);
						}
						subsectionMeasurements.push(groupMeasurements[x]);
						if ((x === (xl - 1))/*last item in mapObjects*/ || (x !== (xl - 1) && groupMeasurements[x + 1].name !== measurementSubsectionName)/*next group will be a new item*/) {
							AssociateResultsToGroup(measurementSubsection, measurementSubsectionName, subsectionMeasurements, subSecTitle[0], secContentBody, m_comp);
						}
					}
				}
			}
		}
	}

	function returnMeasureArrayByGroupEventSets(groupEventSets, mapObjects) {
		var measurementArray = [];
		for (var i = 0; i < groupEventSets.length; i++) {
			if (mapObjects[groupEventSets[i]]) {
				for (var j = 0; j < mapObjects[groupEventSets[i]].length; j++) {
					measurementArray.push(mapObjects[groupEventSets[i]][j]);
				}
			}
		}
		return measurementArray;
	}

	function getMeasurementHashMap(mapObjects) {
		var measHash = [];
		for (var x = 0; x < mapObjects.length; x++) {
			if (!measHash[mapObjects[x].eventSetCode]) {
				measHash[mapObjects[x].eventSetCode] = [];
			}
			measHash[mapObjects[x].eventSetCode].push(mapObjects[x]);
		}
		return measHash;
	}

	function AssociateResultsToGroup(subSection, subGroupName, measurements, subSecTitle, secContentBody, component) {
		var m_comp = component;
		var compId = component.getComponentId();
		var subCnt = measurements.length;
		var timeNow = new Date();
		var ar = [];
		var infoClass = "";
		ar.push("<table class='lab-table'>");

		//Determine the Info Button state
		if (component.isInfoButtonEnabled() && component.hasInfoButton()) {
			infoClass = "info-icon";
		}
		else {
			infoClass = "info-icon hidden";
		}

		//for each row
		for (var x = 0, xl = measurements.length; x < xl; x++) {
			var meas = measurements[x];
			var latestMeasDateTime = meas.value[0].getDateTime();
			var rowClass = (x % 2) ? "even" : "odd";
			ar.push("<tr class='", rowClass, "'>");
			var m1 = meas.value[0];
			var obj = m1.getResult();
			var resStr = CERN_LABORATORY_O1_UTIL.GetStringResult(obj, false);
			if (component.getGraphFlag() === 1) {
				ar.push("<td class='lab-lbl'><span data-patId='", meas.patientId, "' data-encId='", meas.encntrId, "' data-eventId='", m1.getEventId(), "' data-eventCd='", meas.resultCd, "' data-eClassCd='", meas.eClassCd, "' data-resVal='", resStr, "' data-resValCd='", meas.resultCd, "' data-resUnitCd='", meas.resultUnitCd, "' data-priCriteriaCd='", meas.priCriteriaCd, "' class='", infoClass, "'>&nbsp;</span><span class='row-label'><a onClick='MP_Util.GraphResults(", m1.getEventCode().codeValue, ",", compId, ",0.0);'>", m1.getEventCode().display, "</a></span></td>");
			}
			else {
				ar.push("<td class='lab-lbl'><span data-patId='", meas.patientId, "' data-encId='", meas.encntrId, "' data-eventId='", m1.getEventId(), "' data-eventCd='", meas.resultCd, "' data-eClassCd='", meas.eClassCd, "' data-resVal='", resStr, "' data-resValCd='", meas.resultCd, "' data-resUnitCd='", meas.resultUnitCd, "' data-priCriteriaCd='", meas.priCriteriaCd, "' class='", infoClass, "'>&nbsp;</span><span class='row-label'>", m1.getEventCode().display, "</span></td>");
			}

			if (component.isShowTodayValue()) {
				if (timeNow.getFullYear() === latestMeasDateTime.getFullYear() && timeNow.getMonth() === latestMeasDateTime.getMonth() && timeNow.getDate() === latestMeasDateTime.getDate()) {
					ar.push(CERN_LABORATORY_O1_UTIL.CreateResultCell(meas.value[0], 0, m_comp));
					ar.push(CERN_LABORATORY_O1_UTIL.CreateResultCell(meas.value[1], 1, m_comp));
					ar.push(CERN_LABORATORY_O1_UTIL.CreateResultCell(meas.value[2], 2, m_comp));
				}
				else {
					ar.push(CERN_LABORATORY_O1_UTIL.CreateResultCell(null, 0, m_comp));
					ar.push(CERN_LABORATORY_O1_UTIL.CreateResultCell(meas.value[0], 1, m_comp));
					ar.push(CERN_LABORATORY_O1_UTIL.CreateResultCell(meas.value[1], 2, m_comp));
				}
			}
			else {
				ar.push(CERN_LABORATORY_O1_UTIL.CreateResultCell(meas.value[0], 0, m_comp));
				ar.push(CERN_LABORATORY_O1_UTIL.CreateResultCell(meas.value[1], 1, m_comp));
				ar.push(CERN_LABORATORY_O1_UTIL.CreateResultCell(meas.value[2], 2, m_comp));
			}
			ar.push("</tr>");
		}
		ar.push("</table>");
		secContentBody.innerHTML = ar.join("");
		subSecTitle.innerHTML = subGroupName + " (" + subCnt + ")";
		m_comp.m_totalResultCount += subCnt;
	}

}();

/**
 * Contains common methods utilized across the laboratory table and the laboratory graph
 * @namespace CERN_LABORATORY_O1_UTIL
 * @static
 * @global
 */
var CERN_LABORATORY_O1_UTIL = function() {
	var m_df = null;
	return {
		LoadMeasurementData: function(recordData, personnelArray, codeArray) {
			var mapObjects = [];
			var results = recordData.RESULTS;
			for (var i = 0, il = results.length; i < il; i++) {
				if (results[i].CLINICAL_EVENTS.length > 0) {
					for (var j = 0, jl = results[i].CLINICAL_EVENTS.length; j < jl; j++) {
						var measureArray = [];
						var mapObject = null;
						if (results[i].EVENT_CD > 0) {
							mapObject = new MP_Core.MapObject(results[i].EVENT_CD, measureArray);
						}
						else {
							mapObject = new MP_Core.MapObject(results[i].EVENT_SET_NAME, measureArray);
						}

						if (results[i].EVENT_SET_CD && results[i].EVENT_SET_CD > 0) {
							mapObject.eventSetCode = results[i].EVENT_SET_CD;
						}
						var meas = results[i].CLINICAL_EVENTS[j];
						for (var k = 0, kl = meas.MEASUREMENTS.length; k < kl; k++) {
							var measurement = new MP_Core.Measurement();
							measurement.initFromRec(meas.MEASUREMENTS[k], codeArray);
							measureArray.push(measurement);
							mapObject.patientId = meas.MEASUREMENTS[k].PATIENT_ID;
							mapObject.comment = meas.MEASUREMENTS[k].COMMENT;
							mapObject.has_comments_ind = meas.MEASUREMENTS[k].HAS_COMMENTS_IND;
							mapObject.encntrId = meas.MEASUREMENTS[k].ENCOUNTER_ID;
							mapObject.primitiveName = results[i].CLINICAL_EVENTS[j].PRIMITIVE_EVENT_SET_NAME;
							mapObject.resultCd = meas.MEASUREMENTS[k].EVENT_CD;
							mapObject.eClassCd = meas.MEASUREMENTS[k].EVENT_CLASS_CD;
							mapObject.priCriteriaCd = meas.MEASUREMENTS[k].PRIMARY_CRITERIA_CD;
							if (meas.MEASUREMENTS[k].QUANTITY_VALUE[0]) {
								mapObject.resultUnitCd = meas.MEASUREMENTS[k].QUANTITY_VALUE[0].UNIT_CD;
							}
							else {
								mapObject.resultUnitCd = 0;
							}
						}

						measureArray.sort(SortByEffectiveDate);
						if (measureArray.length > 0) {
							mapObjects.push(mapObject);
						}
					}
				}
			}
			return mapObjects;
		},
		CreateResultCell: function(result, idx, component) {
			var ar = [];
			var labI18n = i18n.discernabu.laboratory_o1;
			if (result == null) {
				ar.push("<td class='lab-res", idx, "'><dl class='lab-info'><dt><span>", labI18n.VALUE, "</span></dt><dd class='lab-res'><span>--</span></dd></dl></td>");
			}
			else {
				var obj = result.getResult();
				var resStr = CERN_LABORATORY_O1_UTIL.GetStringResult(obj, false);
				var resHvrStr = CERN_LABORATORY_O1_UTIL.GetStringResult(obj, true);
				var display = result.getEventCode().display;
				var dateTime = result.getDateTime();
				var labNormalcy = CalculateNormalcy(result);
				var resStatus = result.getStatus().display;

				var sCritHigh = "", sCritLow = "", sNormHigh = "", sNormLow = "";
				if ( obj instanceof MP_Core.QuantityValue) {
					var refRange = obj.getRefRange();
					if (refRange != null) {
						if (refRange.getCriticalHigh() != 0 || refRange.getCriticalLow() != 0) {
							sCritHigh = refRange.getCriticalHigh();
							sCritLow = refRange.getCriticalLow();
						}
						if (refRange.getNormalHigh() != 0 || refRange.getNormalLow() != 0) {
							sNormHigh = refRange.getNormalHigh();
							sNormLow = refRange.getNormalLow();
						}
					}
				}
				var df = CERN_LABORATORY_O1_UTIL.GetDateFormatter();

				ar.push("<td class='lab-res", idx, "'><dl class='lab-info'><dt><span>", labI18n.VALUE, "</span></dt><dd class='lab-res'><span class='", labNormalcy, "'><span class='res-ind'>&nbsp;</span><span class='res-value'>", GetEventViewerLink(result, resStr), "</span>", MP_Util.Measurement.GetModifiedIcon(result), "</span>");
				if (component.getDateFormat() != 4) {//DO NOT DISPLAY DATE
					ar.push("<br /><span class='within'>", MP_Util.DisplayDateByOption(component, dateTime), "</span>");
				}
				ar.push("</dd></dl><h4 class='det-hd'><span>", labI18n.LABORATORY_DETAILS, "</span></h4><div class='hvr'><dl class='lab-det'><dt class='lab-det-type'><span>", display, ":</span></dt><dd class='result'><span class='", labNormalcy, "'>", resHvrStr, "</span></dd><dt class='lab-det-type'><span>", labI18n.DATE_TIME, ":</span></dt><dd class='result'><span>", df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR), "</span></dd><dt class='lab-det-type'><span>", labI18n.NORMAL_LOW, ":</span></dt><dd class='result'><span>", sNormLow, "</span></dd><dt class='lab-det-type'><span>", labI18n.NORMAL_HIGH, ":</span></dt><dd class='result'><span>", sNormHigh, "</span></dd><dt class='lab-det-type'><span>", labI18n.CRITICAL_LOW, ":</span></dt><dd class='result'><span>", sCritLow, "</span></dd><dt class='lab-det-type'><span>", labI18n.CRITICAL_HIGH, ":</span></dt><dd class='result'><span>", sCritHigh, "</span></dd><dt class='lab-det-type'><span>", labI18n.STATUS, ":</span></dt><dd class='result'><span>", resStatus, "</span></dd></dl></div></td>");
			}
			return ar.join("");
		},
		GetStringResult: function(result, includeUOM) {
			var value = "";
			var df = CERN_LABORATORY_O1_UTIL.GetDateFormatter();
			if ( result instanceof MP_Core.QuantityValue){
				if (includeUOM){
					value = result.toString();
				} else {
					value = result.getValue();
				}
			} else if ( result instanceof Date) {
				value = df.format(result, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR)
			} else {
				value = result;
			}
			return value;
		},
		GetDateFormatter: function() {
			if (m_df == null) {
				m_df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
			}
			return m_df;
		}
	};

	function SortByEffectiveDate(a, b) {
		if (a.getDateTime() > b.getDateTime()) {
			return -1;
		}
		else {
			if (a.getDateTime() < b.getDateTime()) {
				return 1;
			}
			else {
				return 0;
			}
		}
	}

	function CreateHoverForMeasurement(measurement) {
		var ar = [];
		var labI18n = i18n.discernabu.laboratory_o1;
		var obj = measurement.getResult();
		var resStr = CERN_LABORATORY_O1_UTIL.GetStringResult(obj, false);
		var resHvrStr = CERN_LABORATORY_O1_UTIL.GetStringResult(obj, true);
		var display = measurement.getEventCode().display;
		var dateTime = measurement.getDateTime();
		var labNormalcy = CalculateNormalcy(measurement);

		var sCritHigh = "", sCritLow = "", sNormHigh = "", sNormLow = "";
		if ( obj instanceof MP_Core.QuantityValue) {
			var refRange = obj.getRefRange();
			if (refRange != null) {
				if (refRange.getCriticalHigh() != 0 || refRange.getCriticalLow() != 0) {
					sCritHigh = refRange.getCriticalHigh();
					sCritLow = refRange.getCriticalLow();
				}
				if (refRange.getNormalHigh() != 0 || refRange.getNormalLow() != 0) {
					sNormHigh = refRange.getNormalHigh();
					sNormLow = refRange.getNormalLow();
				}
			}
		}

		var df = CERN_LABORATORY_O1_UTIL.GetDateFormatter();
		ar.push("<dt class='lab-res'><span>", display, ":</span></dt><dd class='lab-det-type'><span class='", labNormalcy, "'>", resHvrStr, "</span></dd><dt class='lab-res'><span>", labI18n.DATE_TIME, ":</span></dt><dd class='lab-det-type'><span>", df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR), "</span></dd><dt class='lab-res'><span>", labI18n.NORMAL_LOW, ":</span></dt><dd class='lab-det-type'><span>", sNormLow, "</span></dd><dt class='lab-res'><span>", labI18n.NORMAL_HIGH, ":</span></dt><dd class='lab-det-type'><span>", sNormHigh, "</span></dd><dt class='lab-res'><span>", labI18n.CRITICAL_LOW, ":</span></dt><dd class='lab-det-type'><span>", sCritLow, "</span></dd><dt class='lab-res'><span>", labI18n.CRITICAL_HIGH, ":</span></dt><dd class='lab-det-type'><span>", sCritHigh, "</span></dd>");
		return (ar.join(""));
	}

	function CalculateCriticalRange(result) {
		var rv = "";
		if ( result instanceof MP_Core.QuantityValue) {
			var rr = result.getRefRange();
			if (rr != null){
				rv = rr.toCriticalInlineString();
			}
		}
		return rv;
	}

	function CalculateNormalRange(result) {
		var rv = "";
		if ( result instanceof MP_Core.QuantityValue) {
			var rr = result.getRefRange();
			if (rr != null){
				rv = rr.toNormalInlineString();
			}
		}
		return rv;
	}

	function CalculateNormalcy(result) {
		var normalcy = "res-normal";
		var nc = result.getNormalcy();
		if (nc != null) {
			var normalcyMeaning = nc.meaning;
			if (normalcyMeaning != null) {
				if (normalcyMeaning === "LOW") {
					normalcy = "res-low";
				}
				else if (normalcyMeaning === "HIGH") {
					normalcy = "res-high";
				}
				else if (normalcyMeaning === "CRITICAL" || normalcyMeaning === "EXTREMEHIGH" || normalcyMeaning === "PANICHIGH" || normalcyMeaning === "EXTREMELOW" || normalcyMeaning === "PANICLOW" || normalcyMeaning === "VABNORMAL" || normalcyMeaning === "POSITIVE") {
					normalcy = "res-severe";
				}
				else if (normalcyMeaning === "ABNORMAL") {
					normalcy = "res-abnormal";
				}
			}
		}
		return normalcy;
	}
	

function GetEventViewerLink(measObject, res) {
		var ar = [];		
		var params = [measObject.getPersonId(), measObject.getEncntrId(), measObject.getEventId(), '"EVENT"'];
		//Mobile Reach to Launch Result viewer
		if (CERN_BrowserDevInd) {
			var	 sParams = [];
			var resultName = measObject.getEventCode().display;
			var formatResName = resultName?(resultName).replace(/'/g, "&#39"):"";			
			sParams.push(measObject.getPersonId() , measObject.getEncntrId() ,  measObject.getEventId() ,"\""+"\"" , "\"EVENT\"" , 0.0 , "\""+"\"", 0.0 ,0,"\""+formatResName+"\"");
			ar.push("<a onclick='MD_reachViewerDialog.LaunchReachClinNoteViewer(",sParams,"); return false;' href='#'>", measObject.getCommentsIndicator() ? "<span style = 'color:#000000'>*</span>" : "", res, "</a>");
		} else {
			ar.push("<a onclick='MP_Util.LaunchClinNoteViewer(", params.join(","), "); return false;' href='#'>", res, "</a>");
		}
		return ar.join("");
	}

}();