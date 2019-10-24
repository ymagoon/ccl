if (!String.prototype.trim) {
	(function() {
		// Make sure we trim BOM and NBSP
		var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
		String.prototype.trim = function() {
			return this.replace(rtrim, '');
		};
	})();
}

var myName = "";
var PathwayDeviationDialog = function() {

	var pwReci18n = i18n.innovations.pathways_recommendation;
	var bodyHTMLAr = [];
	var reasonsCodeSet = null;
	var reasonsHTML = "";
	var pathwayId = 0;
	var nodeId = 0;
	var cpComponentId = 0;
	//0 = Off Pathway
	//1 = Clin Trial
	var deviationTypeInd = -1;
	//0 = Documenting on Pathway/Clin Trial
	//1 = Document off Pathway/Clin Trial
	var onOffInd = -1;

	function createNewDialog(dialogTitle) {
		var pwDialog = new ModalDialog('PathwayDeviation');
		pwDialog.setTopMarginPercentage(15).setRightMarginPercentage(15).setBottomMarginPercentage(15).setLeftMarginPercentage(15).setIsBodySizeFixed(false).setHeaderTitle(dialogTitle).setHasGrayBackground(true).setIsIconActive(true).setBodyElementId('pathwayDeviationBody');

		var cancelButton = new ModalButton('cancel');
		cancelButton.setText(i18n.innovations.pathways_shared.CANCEL).setIsDithered(false).setCloseOnClick(true);
		pwDialog.addFooterButton(cancelButton);

		var okButton = new ModalButton('ok');
		okButton.setText(i18n.innovations.pathways_shared.DOCUMENT).setIsDithered(false).setOnClickFunction(function() {

			var pwDeviationBody = $('#pathwayDeviationBody');
			var reasonSelectElem = pwDeviationBody.find('select');
			var reasonFreetextElem = pwDeviationBody.find('textarea');
			var reasonFreetext = "";
			var reasonCodeValue = 0;
			var updateType = "";

			if (deviationTypeInd == 1) {
				updateType = "CLINICAL_TRIAL";
			}
			else if (deviationTypeInd == 0) {
				updateType = "OFF_PATHWAY";
			}

			if (reasonFreetextElem.length > 0) {
				reasonFreetext = reasonFreetextElem.val();
			}

			if (reasonSelectElem.length > 0) {
				reasonCodeValue = reasonSelectElem.val();
			}

			CPEventManager.notifyObservers("UPDATE_ACTIVITY_INDICATORS", {
				"UPDATE_TYPE" : updateType,
				"ONOFF_IND" : onOffInd,
				"PATHWAY_ID" : pathwayId,
				"NODE_ID" : nodeId,
				"COMPONENT_ID" : cpComponentId,
				"REASON_CD" : reasonCodeValue,
				"REASON_FREETEXT" : reasonFreetext
			});

		});
		pwDialog.addFooterButton(okButton);

		MP_ModalDialog.addModalDialogObject(pwDialog);
		return pwDialog;

	}

	function buildReasonsDropDown() {
		var reasonsHTMLAr = [];

		reasonsHTMLAr.push("<select><option value='0'>", pwReci18n.SELECT_REASON, "</option>");

		if (reasonsCodeSet.length <= 0) {
			reasonsHTMLAr.push("<option>" + i18n.innovations.pathways_shared.NO_REASONS_FOUND + "</option>");
		}
		else {
			for (var x = 0, xl = reasonsCodeSet.length; x < xl; x++) {
				reasonsHTMLAr.push("<option value=", reasonsCodeSet[x].value.codeValue, ">", reasonsCodeSet[x].value.display, "</option>");
			}
		}

		reasonsHTMLAr.push("</select>");
		reasonsHTML = reasonsHTMLAr.join("");
	}

	function loadBody(modalObj) {

		var dialogTitle = modalObj.getHeaderTitle();

		if (pwReci18n.DOC_ON_PATHWAY == dialogTitle) {
			onOffInd = 0;
			deviationTypeInd = 0;
			bodyHTMLAr.push("<div class='pwd-body'><div class='pwd-freetext'>", pwReci18n.FREETEXT, ":<div><textarea></textarea></div></div></div>");

		}

		if (pwReci18n.DOC_OFF_PATHWAY == dialogTitle) {
			deviationTypeInd = 0;
			onOffInd = 1;
			if (!reasonsCodeSet) {
				reasonsCodeSet = MP_Util.GetCodeSet(4003425, false);
				buildReasonsDropDown();
			}

			bodyHTMLAr.push("<div class='pwd-body'>", "<div class='pwd-reason'>", reasonsHTML, "</div>", "<div class='pwd-freetext'>", pwReci18n.FREETEXT, ":<div><textarea></textarea></div></div>", "</div>");
		}

		if (pwReci18n.DOC_ON_CLIN_TRIAL == dialogTitle || pwReci18n.DOC_OFF_CLIN_TRIAL == dialogTitle) {
			deviationTypeInd = 1;
			if (pwReci18n.DOC_ON_CLIN_TRIAL == dialogTitle) {
				onOffInd = 1;
			}
			if (pwReci18n.DOC_OFF_CLIN_TRIAL == dialogTitle) {
				onOffInd = 0;
			}

			bodyHTMLAr.push("<div class='pwd-body'>", "<div class='pwd-freetext'>", pwReci18n.FREETEXT, ":<div><textarea></textarea></div></div>", "</div>");
		}

		modalObj.setBodyHTML(bodyHTMLAr.join(""));
	}

	return {
		launch : function(inputPathwayId, inputNodeId, inputCpComponentId, dialogTitle) {

			pathwayId = inputPathwayId;
			nodeId = inputNodeId;
			cpComponentId = inputCpComponentId;
			bodyHTMLAr = [];

			var pwDeviationDialog = MP_ModalDialog.retrieveModalDialogObject("PathwayDeviation");
			if (!pwDeviationDialog) {
				pwDeviationDialog = createNewDialog(dialogTitle);
			}
			else {
				pwDeviationDialog.setHeaderTitle(dialogTitle);
			}

			pwDeviationDialog.setBodyDataFunction(loadBody);

			MP_ModalDialog.showModalDialog(pwDeviationDialog.getId());

		}

	};
}();

function PathwaysScratchPad() {

	//thiis.m_scratchPad = {[
	//  "ORDER_REFERENCE_ID": 0.0,
	//  "ORDER_SENTENCE_ID" : 0.0,
	//  "NODE_ID": 0.0,
	//  "ORDER_TYPE": ""//"PP", "REG", "ORD"
	//  ]
	//}
	var m_pathwayInstanceId = 0.0;
	var m_validOrderTypes = ["PP", "REG", "ORD", "SENT"];
	var m_scratchPad = [];

	return ( {
		addOrder : function(orderReferenceId, orderType, nodeId, orderSentenceId) {

			if (m_validOrderTypes.indexOf(orderType) === -1) {
				return (false);
			}

			m_scratchPad.push({
				"ORDER_REFERENCE_ID" : orderReferenceId,
				"ORDER_SENTENCE_ID" : orderSentenceId,
				"NODE_ID" : nodeId,
				"ORDER_TYPE" : orderType
			});

			return (true);

		},

		removeOrder : function(orderReferenceId, orderType, nodeId, orderSentenceId) {

			var orderIdx = this.checkForOrder(orderReferenceId, orderType, nodeId, orderSentenceId);
			if (orderIdx < 0) {
				return (-1);
			}

			m_scratchPad.splice(orderIdx, 1);

			return (orderIdx);

		},

		clear : function() {
			m_scratchPad = [];
		},
		/*
		 * Supports by orderType and without. Obviously if you have
		 * and orderType then pass it in.
		 * Returns -1 if not found, returns index of order if found.
		 */
		checkForOrder : function(orderReferenceId, orderType, nodeId, orderSentenceId) {
			var scratchPad = m_scratchPad;
			if (orderType == "") {
				for (var x = scratchPad.length; x--; ) {
					if (scratchPad[x].ORDER_REFERENCE_ID == orderReferenceId && scratchPad[x].ORDER_SENTENCE_ID == orderSentenceId && scratchPad[x].NODE_ID == nodeId) {
						return (x);
					}

				}
			}
			else {
				for (var x = scratchPad.length; x--; ) {
					if (scratchPad[x].ORDER_REFERENCE_ID == orderReferenceId && (!orderSentenceId || (orderSentenceId && scratchPad[x].ORDER_SENTENCE_ID == orderSentenceId)) && scratchPad[x].NODE_ID == nodeId && scratchPad[x].ORDER_TYPE == orderType) {
						return (x);
					}
				}
			}
			return (-1);
		},

		checkForOrderAndAdd : function(orderReferenceId, orderType, nodeId, orderSentenceId) {

			if (!this.checkForOrder(orderReferenceId, orderType, nodeId, orderSentenceId)) {
				this.addOrder(orderReferenceId, orderType, nodeId, orderSentenceId);
				return (true);
			}
			else {
				return (false);
			}
		},
		/*
		 *
		 */
		logTreatmentActions : function() {

			//TODO
		},
		setPathwayInstanceId : function(pathwayInstanceId) {
			this.m_pathwayInstanceId = pathwayInstanceId;
		}

	});
}

var CERN_PATHWAYS_SHARED_O1 = function() {
	var activeTreatmentId = 0;
	var componentMap = {};
	var pathways = [];

	var getLastOrderedDisplay = function(component, parentEntityName, parentEntityId) {
		var currentOrderedInfo = component.getOrderedInfo();
		var lastOrderedDisplay = "";
		for (var lCntr = currentOrderedInfo.CNT; lCntr--; ) {
			if (currentOrderedInfo.QUAL[lCntr].PARENT_ENTITY_NAME === parentEntityName && currentOrderedInfo.QUAL[lCntr].PARENT_ENTITY_ID === parentEntityId) {
				lastOrderedDisplay = currentOrderedInfo.QUAL[lCntr].LAST_ORDERED_DT_TM_DISP;
				if(currentOrderedInfo.QUAL[lCntr].FUTURE_IND === 1){
					lastOrderedDisplay = i18n.innovations.pathways_shared.FUTURE_ORDERED_ON + ":&nbsp;" + lastOrderedDisplay;
				}
				else{
					lastOrderedDisplay = i18n.innovations.pathways_shared.LAST_ORDERED + ":&nbsp;" + lastOrderedDisplay;
				}
				break;
			}
		}
		if (lastOrderedDisplay > " ") {
			lastOrderedDisplay = "<span class='pw-last-ordered'>&nbsp;(" + lastOrderedDisplay + ")</span>";
		}
		return (lastOrderedDisplay);
	};

	var getOrderIconDisplay = function(order) {
		var orderIconDisplay = "";
		if (order.SENTENCE_ID > 0) {
			if (order.USAGE_FLAG === 2) {
				orderIconDisplay = "&nbsp;<span class='pw-med-outp-icon'>&nbsp;</span>";
			}
			else if (order.USAGE_FLAG === 1) {
				orderIconDisplay = "&nbsp;<span class='pw-med-inp-icon'>&nbsp;</span>";
			}
		}
		return (orderIconDisplay);
	};

	return {
		GenerateDocNodeAction : function() {

		},
		AddToComponentMap : function(meaning, id) {
			componentMap[meaning] = id;
		},
		GenerateSectionHtml : function(component, mode, type) {
			var orderInd = ["ORDER", "REGIMEN", "PATHWAY", "SENTENCE"].indexOf(type) > -1;
			var contentNode = $(component.getSectionContentNode());
			var orderedCnt = 0;
			var pathwaysScratchPad, nodeId, element, header, body, data, html, children, x, y, z, i, j;

			var generateOrderHtml = function(order) {
				var value = "Order";
				var state = "";
				var html = "";
				var lastOrderedDisplay = "";
				var orderIcon = getOrderIconDisplay(order);

				if (order.SYNONYM_ID > 0) {
					if (pathwaysScratchPad.checkForOrder(order.SYNONYM_ID, "ORD", nodeId, order.SENTENCE_ID) !== -1) {
						orderedCnt++;
						value = "Remove";
						state = "ordered";
					}
					lastOrderedDisplay = getLastOrderedDisplay(component, "ORDER_CATALOG_SYNONYM", order.SYNONYM_ID);

					html = "<div class='pw-section-details-item'><input type='button' id='" + order.SYNONYM_ID + "' " + (order.SENTENCE_ID > 0 ? "sentence-id='" + order.SENTENCE_ID + "'" : "") + " class='pw-button pw-order-button " + state + "' value='" + value + "' order-type='" + (order.SENTENCE_ID > 0 ? "SENT" : "ORD") + "' />" + orderIcon + "&nbsp;<span class='pw-order-text'>" + order.SYNONYM + (order.SENTENCE ? " (" + order.SENTENCE + ")" : "") + "</span>" + lastOrderedDisplay + "</div>";
				}
				else if (order.REG_CAT_ID > 0) {
					//Evaluate for when regimens can be added to scratchpad
					//
					if (pathwaysScratchPad.checkForOrder(order.REG_CAT_ID, "REG", nodeId) !== -1) {
						orderedCnt++;
						value = "Remove";
						state = "ordered";
					}
					lastOrderedDisplay = getLastOrderedDisplay(component, "REGIMEN_CATALOG", order.REG_CAT_ID);

					html = "<div class='pw-section-details-item'><input type='button' id='" + order.REG_CAT_ID + "' class='pw-button pw-order-button " + state + "' value='" + value + "' order-type='REG'/>&nbsp;<span class='pw-reg-icon'>&nbsp;</span><span class='pw-order-text'>" + order.REG_CAT_SYN_DISPLAY + "</span>" + lastOrderedDisplay + "</div>";
				}
				else if (order.PATH_CAT_ID > 0) {
					//Evaluate for when powerplans can be added to scratchpad
					//
					if (pathwaysScratchPad.checkForOrder(order.PATH_CAT_ID, "PP", nodeId) !== -1) {
						orderedCnt++;
						value = "Remove";
						state = "ordered";
					}

					// favorite plan
					if (order.PATH_CUSTOMIZED_PLAN_ID > 0) {
						// get last ordered display of the customized plan
						lastOrderedDisplay = getLastOrderedDisplay(component, "PATHWAY_CUSTOMIZED_PLAN", order.PATH_CUSTOMIZED_PLAN_ID);
						html = "<div class='pw-section-details-item'>" + "<input type='button' order-type='PP' id='" + order.PATH_CAT_ID + "' favorite-id='" + order.PATH_CUSTOMIZED_PLAN_ID + "' class='pw-button pw-order-button " + state + "' value='" + value + "' order-type='PP'/>" + "&nbsp;<span class='pw-pp-icon'>&nbsp;</span>" + "<span class='pw-order-text'>" + order.PLAN_DESCRIPTION + "</span><span class='pw-fav-icon'></span>" + lastOrderedDisplay + "</div>";
					}
					// regular plan
					else {
						// get last ordered display of the regular plan
						lastOrderedDisplay = getLastOrderedDisplay(component, "PATHWAY_CATALOG", order.PATH_CAT_ID);
						html = "<div class='pw-section-details-item'>" + "<input type='button' order-type='PP' id='" + order.PATH_CAT_ID + "' class='pw-button pw-order-button " + state + "' value='" + value + "' order-type='PP'/>" + "&nbsp;<span class='pw-pp-icon'>&nbsp;</span>" + "<span class='pw-order-text'>" + order.PATH_CAT_SYN_NAME + "</span>" + lastOrderedDisplay + "</div>";
					}
				}

				return html;
			};

			var generateTreatmentHtml = function(treatment) {
				var retVal = "<div class='pw-section-details-item'>";
				var intentionMean;

				try {
					intentionMean = component.getIntentionMean();
				}
				catch(ignore) {

				}

				if (intentionMean !== "ASSESSMENT" && treatment.CP_NODE_ID == activeTreatmentId) {
					retVal += i18n.innovations.pathways_shared.CONTINUE + "&nbsp;" + treatment.NODE_NAME;
				}
				else {
					retVal += "<a id='" + treatment.CP_NODE_ID + "' class='pw-treatment-link'>" + treatment.NODE_NAME + "</a>";
				}

				retVal += "</div>";

				return retVal;
			};

			if (orderInd) {
				try {
					pathwaysScratchPad = component.getPathwaysScratchPad();
					nodeId = component.getNodeId();
				}
				catch(e) {
					pathwaysScratchPad = [];
				}
			}

			if (mode === "SUGGESTED") {
				if (orderInd) {
					element = contentNode.find(".pw-suggested-orders");
					data = component.getSuggestedOrders();
				}
				else if (type === "NODE") {
					element = contentNode.find(".pw-suggested-treatments");
					data = component.getSuggestedTreatments();
				}
			}
			else if (mode === "AVAILABLE") {
				if (orderInd) {
					element = contentNode.find(".pw-available-orders");
					data = component.getAvailableOrders();
				}
				else if (type === "NODE") {
					element = contentNode.find(".pw-available-treatments");
					data = component.getAvailableTreatments();
				}
			}

			header = element.children(".pw-section-header");
			body = element.children(".pw-section-details");

			header.html("<span class='pw-icon-container'></span>" + (mode === "SUGGESTED" ? i18n.innovations.pathways_shared.SUGGESTED : i18n.innovations.pathways_shared.AVAILABLE) + " " + ( orderInd ? i18n.innovations.pathways_shared.ORDERS : i18n.innovations.pathways_shared.TREATMENTS));

			if (data.length === 0) {
				if ((type === "ORDER" || type === "SENTENCE") && component.getMissingOrderConfigInd()) {
					html = "<div class='pw-disabled-text pw-section-details-item'>" + i18n.innovations.pathways_shared.NO_FOLDERS_CONFIG + ".</div>";
				}
				else {
					html = "<div class='pw-disabled-text pw-section-details-item'>" + i18n.innovations.pathways_shared.CURRENTLY_NO_ + "&nbsp;" + String(mode === "SUGGESTED" ? i18n.innovations.pathways_shared.SUGGESTED : i18n.innovations.pathways_shared.AVAILABLE).toLowerCase() + " " + String( orderInd ? i18n.innovations.pathways_shared.ORDERS : i18n.innovations.pathways_shared.TREATMENTS).toLowerCase() + ".</div>";
				}
			}
			else {
				header.addClass("pw-hover-cursor-pointer");

				if (mode === "AVAILABLE" && orderInd && header.attr("manual-state") != "expanded") {
					header.children(".pw-icon-container").removeClass("pw-expanded-icon").addClass("pw-collapsed-icon");
					body.addClass("hidden");
				}
				else {
					header.children(".pw-icon-container").addClass("pw-expanded-icon");
					body.removeClass("hidden");
				}

				html = "";

				if (orderInd) {
					for ( x = 0, y = data.length; x < y; x++) {
						if (data[x] instanceof Array) {
							html += "<div class='pw-or-suggestion-container'>";
							for ( i = 0, j = data[x].length; i < j; i++) {
								html += generateOrderHtml(data[x][i]);
							}
							html += "</div>";
						}
						else {
							html += generateOrderHtml(data[x]);
						}
					}
				}
				else if (type === "NODE") {
					for ( x = 0, y = data.length; x < y; x++) {
						if (data[x] instanceof Array) {
							html += "<div class='pw-or-suggestion-container'>";
							for ( i = 0, j = data[x].length; i < j; i++) {
								html += generateTreatmentHtml(data[x][i]);
							}
							html += "</div>";
						}
						else {
							html += generateTreatmentHtml(data[x]);
						}
					}
				}
			}

			body.html(html);

			children = body.children().not(".pw-disabled-text");

			if (mode === "SUGGESTED" && orderInd && data.length > 0) {
				header.html(header.html() + "&nbsp;(<a href='#' class='pw-toggle-orders " + (orderedCnt === children.length ? "pw-unselect-all" : "pw-select-all") + "'>" + (orderedCnt === children.length ? i18n.innovations.pathways_shared.UNSELECT_ALL : i18n.innovations.pathways_shared.SELECT_ALL) + "</a>)");
			}

			children.removeClass("pw-row-even pw-row-odd");

			for ( x = 0, y = children.length; x < y; x++) {
				children[x] = $(children[x]);
				if (x % 2 === 0) {
					children[x].addClass("pw-row-even");
				}
				else {
					children[x].addClass("pw-row-odd");
				}
			}
		},
		GetActiveTreatmentId : function() {
			return activeTreatmentId;
		},
		GetPathways : function() {
			return pathways;
		},
		GetActivePathway : function(pathwayId) {
			for ( x = pathways.length; x--; ) {
				if (pathways[x].PATHWAY_ACTIVITY_STATUS_MEAN === "ACTIVE" && pathways[x].CP_PATHWAY_ID == pathwayId) {
					return (pathways[x]);
				}
			}
			return (-1);
		},
		GetScratchpadSharedResource : function() {
			return scratchpadSharedResource;
		},
		GetTreatmentNodes : function(component) {
			var pathwayId = component.getPathwayId();
			var pathwayConfig = PathwaysModel.getConfigById(pathwayId);
			var treatmentNodes = [];

			if (pathwayConfig) {
				for ( x = 0, y = pathwayConfig.NODE_LIST.length; x < y; x++) {
					if (pathwayConfig.NODE_LIST[x].INTENTION_CD_MEANING === "TREATMENTS") {
						treatmentNodes.push(pathwayConfig.NODE_LIST[x]);
					}
				}
			}

			return treatmentNodes;
		},
		HandleNodeActivity : function(component, type, data, reverse) {
			var changedInd = false;
			var suggestionExistsInd = false;
			var available, suggested, sourceIdentifier, dataIdentifier, x, y, i, j, z, q;
			var nodeId = component.getNodeId();
			var docEventManager = eventManagers.findManager(nodeId);

			if (type !== "NODE") {
				available = component.getAvailableOrders();
				suggested = component.getSuggestedOrders();
			}
			else {
				available = component.getAvailableTreatments();
				suggested = component.getSuggestedTreatments();
				sourceIdentifier = "CP_NODE_ID";
			}

			switch(type) {
				case "ORDER" :
					sourceIdentifier = "SYNONYM_ID";
					break;
				case "REGIMEN":
					sourceIdentifier = "REG_CAT_ID";
					break;
				case "PATHWAY" :
					sourceIdentifier = "PATH_CAT_ID";
					break;
				case "SENTENCE" :
					sourceIdentifier = "SENTENCE_ID";
					break;
			}

			if (reverse) {
				dataIdentifier = "REACTION_ENTITY_ID";

				for ( x = 0, y = data.length; x < y; x++) {
					if (data[x] instanceof Array) {

						for ( z = 0; z < suggested.length; z++) {
							if (suggested[z] instanceof Array) {
								for ( i = 0, j = data[x].length; i < j; i++) {
									for ( q = suggested[z].length; q--; ) {
										if (suggested[z][q][sourceIdentifier] === data[x][i][dataIdentifier]) {
											suggested[z][q].ITEM_OCID = docEventManager.getItemsByResponseIdent(data[x][i].RESPONSE_IDENT);
											changedInd = true;
											available = available.concat(suggested[z].splice(q, 1));
										}
									}
								}
							}

							if (suggested[z].length === 1) {
								suggested[z] = suggested[z][0];
							}

							if (suggested[z].length === 0) {
								suggested.splice(z, 1);
								z--;
							}
						}
					}
					else {
						for ( z = suggested.length; z--; ) {
							if (suggested[z][sourceIdentifier] === data[x][dataIdentifier]) {
								suggested[z].ITEM_OCID = docEventManager.getItemsByResponseIdent(data[x].RESPONSE_IDENT);
								changedInd = true;
								available = available.concat(suggested.splice(z, 1));
							}
						}
					}
				}
			}
			else {
				dataIdentifier = "PARENT_ENTITY_ID";

				for ( x = 0, y = data.length; x < y; x++) {
					if (data[x] instanceof Array) {
						var suggestions = [];

						for ( i = 0, j = data[x].length; i < j; i++) {
							for ( z = available.length; z--; ) {
								if (available[z][sourceIdentifier] === data[x][i][dataIdentifier]) {
									available[z].ITEM_OCID = docEventManager.getItemsByResponseIdent(data[x][i].RESPONSE_IDENT);
									changedInd = true;
									suggestions = suggestions.concat(available.splice(z, 1));
								}
							}
						}

						suggested.push(suggestions);
					}
					else {
						for ( z = available.length; z--; ) {
							// found a matching entry
							if (available[z][sourceIdentifier] === data[x][dataIdentifier]) {
								available[z].ITEM_OCID = docEventManager.getItemsByResponseIdent(data[x].RESPONSE_IDENT);

								//check if suggestion is a powerplan favorite
								if (sourceIdentifier === "PATH_CAT_ID" && data[x]["PATHWAY_CUSTOMIZED_PLAN_ID"] > 0) {
									suggestionExistsInd = false;
									for ( k = 0, l = suggested.length; k < l; k++) {
										if (data[x].PATHWAY_CUSTOMIZED_PLAN_ID === suggested[k].PATH_CUSTOMIZED_PLAN_ID) {
											suggestionExistsInd = true;
											break;
										}
									}
									// suggestion doesn't exist
									if (!suggestionExistsInd) {
										suggested.push({
											"SEQUENCE" : available[z].SEQUENCE,
											"LIST_TYPE" : available[z].LIST_TYPE,
											"PATH_CAT_ID" : available[z].PATH_CAT_ID,
											"PATH_CAT_SYN_ID" : available[z].PATH_CAT_SYN_ID,
											"PATH_CAT_SYN_NAME" : available[z].PATH_CAT_SYN_NAME,
											"PATH_CUSTOMIZED_PLAN_ID" : data[x].PATHWAY_CUSTOMIZED_PLAN_ID,
											"PLAN_DESCRIPTION" : data[x].PLAN_DESCRIPTION,
											"ITEM_OCID" : data[x].ITEM_OCID
										});
										changedInd = true;
									}
								}
								else {
									changedInd = true;
									suggested = suggested.concat(available.splice(z, 1));
								}
							}
						}
					}
				}
			}

			if (changedInd) {
				if (["ORDER", "REGIMEN", "PATHWAY", "SENTENCE"].indexOf(type) > -1) {
					component.setAvailableOrders(available);
					component.setSuggestedOrders(suggested);
				}
				else if (type === "NODE") {
					component.setAvailableTreatments(available);
					component.setSuggestedTreatments(suggested);
				}

				CERN_PATHWAYS_SHARED_O1.GenerateSectionHtml(component, "AVAILABLE", type);
				CERN_PATHWAYS_SHARED_O1.GenerateSectionHtml(component, "SUGGESTED", type);
			}
		},
		JumpToComponent : function(meaning) {
			$("#drNavi" + componentMap[meaning]).click();
		},
		ResetSuggestionsByItem : function(component, type, itemOCID) {
			var available, suggested, newSuggested = [], suggestionsChangedInd = false;

			var evaluateSuggestion = function(suggestion) {
				//diffent item ocid -> move back to available
				if (suggestion.ITEM_OCID.indexOf(itemOCID) === -1) {
					available.push(suggestion);
					suggestionsChangedInd = true;
				}
				//same item ocid -> keep in suggested
				else {
					// exclude plan favorites
					if (!suggestion.PATH_CUSTOMIZED_PLAN_ID || suggestion.PATH_CUSTOMIZED_PLAN_ID === 0) {
						newSuggested.push(suggestion);
					}
				}
			};

			if (itemOCID) {
				// get current suggested and available
				switch(type) {
					case "ORDER" :
						available = component.getAvailableOrders();
						suggested = component.getSuggestedOrders();
						break;
					case "TREATMENT" :
						available = component.getAvailableTreatments();
						suggested = component.getSuggestedTreatments();
						break;
				}

				// loop through suggested to find orders with different item ocid
				for (var x = suggested.length; x--; ) {
					evaluateSuggestion(suggested[x]);
				}

				// suggestions changed -> rebuild the available and suggest lists
				if (suggestionsChangedInd) {

					// set new suggested and available
					switch(type) {
						case "ORDER" :
							component.setAvailableOrders(available);
							component.setSuggestedOrders(newSuggested);
							break;
						case "TREATMENT" :
							component.setAvailableTreatments(available);
							component.setSuggestedTreatments(newSuggested);
							break;
					}

					CERN_PATHWAYS_SHARED_O1.GenerateSectionHtml(component, "AVAILABLE", type);
					CERN_PATHWAYS_SHARED_O1.GenerateSectionHtml(component, "SUGGESTED", type);
				}
			}
		},
		SetActiveTreatmentId : function(val) {
			activeTreatmentId = val;
		},
		SetPathways : function(val) {
			pathways = val;
		},
		ShowCalculator : function(e) {
			e = e || window.event;

			window.open("http://nomograms.mskcc.org/Prostate/LifeExpectancy.aspx");
			e.stopPropagation();
		},
		SortOrderArray : function(orderArray) {
			orderArray = orderArray || [];

			orderArray.sort(function(a, b) {
				return a.SEQUENCE - b.SEQUENCE;
			});

			return orderArray;
		},
		SortTreatmentArray : function(treatmentArray) {
			treatmentArray = treatmentArray || [];

			treatmentArray.sort(function(a, b) {
				return a.CP_NODE_ID - b.CP_NODE_ID;
			});

			return treatmentArray;
		},
		UpdateScratchpad : function(component, synId, removeInd, orderType, favoriteId) {
			var order, scratchpadSharedResource;
			var curOrderDisplay = "";
			var curOrderSentId = "";
			var curOrderEventType = 0;

			(function() {
				var availableOrders = JSON.parse(JSON.stringify(component.getAvailableOrders()));
				var suggestedOrders = JSON.parse(JSON.stringify(component.getSuggestedOrders()));
				var orders = availableOrders.concat(suggestedOrders);
				var x, y;

				for ( x = 0, y = orders.length; x < y; x++) {
					if (orders[x].SYNONYM_ID == synId && (orderType == "ORD" || orderType == "SENT" && orders[x].SENTENCE_ID == favoriteId)) {
						order = orders[x];
						break;
					}
					else if (orderType == "PP" && (//favorite specified and matches
						(favoriteId > 0 && orders[x].PATH_CUSTOMIZED_PLAN_ID == favoriteId) ||
						// favorite not specified and matches
						(favoriteId === 0 && orders[x].PATH_CAT_ID == synId)
					)) {
						order = orders[x];
						break;
					}
					else if (orders[x].REG_CAT_ID == synId && orderType == "REG") {
						order = orders[x];
						return;
					}
				}
			})();

			if (order) {
				(function() {
					var sharedResourceName = "scratchpadSR";

					scratchpadSharedResource = MP_Resources.getSharedResource(sharedResourceName);

					if (!scratchpadSharedResource) {
						var dataObj = {};
						var listenerObj = {};

						scratchpadSharedResource = new SharedResource(sharedResourceName);
						dataObj.scratchpadObjArr = [];
						scratchpadSharedResource.setIsAvailable(true);
						scratchpadSharedResource.setResourceData(dataObj);
						scratchpadSharedResource.setEventListenerObject(listenerObj);
						scratchpadSharedResource.setEventListenerFlag(EventListener.EVENT_SCRATCHPAD_COUNT_UPDATE);
						MP_Resources.addSharedResource(sharedResourceName, scratchpadSharedResource);
					}
				})();

				if (scratchpadSharedResource) {
					var resourceData = scratchpadSharedResource.getResourceData();
					var scratchpadArray = resourceData.scratchpadObjArr;
					var x;
					var venueType = 0;

					if (removeInd) {
						for ( x = scratchpadArray.length; x--; ) {
							if (scratchpadArray[x].favSynId == order.SYNONYM_ID && (orderType == "ORD" || orderType == "SENT" && scratchpadArray[x].favSentId == order.SENTENCE_ID)) {
								scratchpadArray.splice(x, 1);
								break;
							}
							else if (orderType == "PP" && scratchpadArray[x].favSynId == order.PATH_CAT_ID) {
								scratchpadArray.splice(x, 1);
								break;
							}
							else if (orderType == "REG" && scratchpadArray[x].favSynId == order.REG_CAT_ID) {
								scratchpadArray.splice(x, 1);
							}
						}
					}
					else {
						if (orderType === "ORD" || orderType === "SENT") {
							venueType = 0;
							//calculate venue type for sentences
							if (orderType === "SENT") {
								if (order.USAGE_FLAG === 2) {
									venueType = 1;
								}
							}

							scratchpadArray.push({
								"componentId" : component.getComponentId(),
								"addedFrom" : "PATHWAYS",
								"favType" : 0,
								"favName" : order.SYNONYM,
								"favOrderSentDisp" : order.SENTENCE,
								"favSynId" : order.SYNONYM_ID + ".0",
								"favSentId" : order.SENTENCE_ID + ".0",
								"favNomenIds" : "\"\"",
								"favId" : component.getComponentId() + order.SYNONYM_ID,
								"favVenueType" : venueType,
								"favOrdSet" : 0,
								"favPPEventType" : null,
								"favParam" : order.SYNONYM_ID + ".0|" + venueType + "|" + order.SENTENCE_ID + ".0"
							});
						}
						else if (orderType === "PP") {
							// favorite plan
							if (order.PATH_CUSTOMIZED_PLAN_ID > 0) {
								curOrderDisplay = order.PLAN_DESCRIPTION;
								curOrderSentId = order.PATH_CUSTOMIZED_PLAN_ID;
								curOrderEventType = 2;
							}
							// standard plan
							else {
								curOrderDisplay = order.PATH_CAT_SYN_NAME;
								curOrderSentId = order.PATH_CAT_SYN_ID;
								curOrderEventType = 0;
							}
							scratchpadArray.push({
								"componentId" : component.getComponentId(),
								"addedFrom" : "PATHWAYS",
								"favType" : 2,
								"favName" : curOrderDisplay,
								"favOrderSentDisp" : "",
								"favSynId" : order.PATH_CAT_ID + ".0",
								"favSentId" : curOrderSentId + ".0",
								"favNomenIds" : "",
								"favId" : component.getComponentId() + curOrderSentId,
								"favVenueType" : 0,
								"favOrdSet" : 0,
								"favPPEventType" : curOrderEventType,
								"favParam" : order.PATH_CAT_ID + ".0|" + curOrderSentId + ".0"
							});
						}
						else if (orderType === "REG") {
							for (var x = scratchpadArray.length; x--; ) {
								if (scratchpadArray[x].favType === 3) {
									alert("Only one regimen can be Added at a time");
									return (false);
								}
							}
							scratchpadArray.push({
								"componentId" : component.getComponentId(),
								"addedFrom" : "PATHWAYS",
								"favType" : 3, //Regimen
								"favName" : order.REG_CAT_SYN_DISPLAY,
								"favOrderSentDisp" : "",
								"favSynId" : order.REG_CAT_ID + ".0",
								"favSentId" : order.REG_CAT_SYN_ID + ".0",
								"favNomenIds" : "\"\"",
								"favId" : component.getComponentId() + order.REG_CAT_SYN_ID,
								"favVenueType" : 0,
								"favOrdSet" : 0,
								"favPPEventType" : 0,
								"favParam" : order.REG_CAT_ID + ".0|" + order.REG_CAT_SYN_ID + ".0"
							});
						}

					}
					resourceData.scratchpadObjArr = scratchpadArray;
					MP_Resources.setSharedResourceData(scratchpadSharedResource.getName(), resourceData);
					scratchpadSharedResource.notifyResourceConsumers();
					return (true);
				}
			}
		}

	};
}();

CERN_PATHWAYS_SHARED_O1.timer = {};

CERN_PATHWAYS_SHARED_O1.timer.checkpoint = function(eventName, subEventName, metadata) {
	metadata = metadata || {};

	var timer = new CheckpointTimer();
	timer.setEventName(eventName);
	timer.setSubEventName(subEventName);

	for (var prop in metadata) {
		if (metadata.hasOwnProperty(prop)) {
			timer.addMetaData(prop, metadata[prop]);
		}
	}

	timer.publish();
};