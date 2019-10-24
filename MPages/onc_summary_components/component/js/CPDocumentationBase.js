function CPDocumentationBaseComponentStyle() {
	this.initByNamespace("cp-documentation");
}

CPDocumentationBaseComponentStyle.inherits(ComponentStyle);

function CPDocumentationBaseComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new CPDocumentationBaseComponentStyle());

	this.m_activityDataModel = null;
	this.m_builder = null;
	this.m_conceptCKI = "";
	this.m_cycleController = null;
	this.m_dataModel = null;
	this.m_docDecorationsId = 0;
	this.m_docEventsId = 0;
	this.m_documentationTimerName = "MPG.CP_DOCUMENTATION_BASE.O2";
	this.m_documentEvents = [];
	this.m_docVersion = 0;
	this.m_eventId = 0;
	this.m_groupController = null;
	this.m_inputController = null;
	this.m_loadTimer = null;
	this.m_orders = [];
	this.m_pathwayDocEventId = 0;
	this.m_renderTimer = null;
	this.m_structureDocClinIdent = "";
	this.m_termDecoration = [];
	this.m_workflowComponentId = 0;
	this.m_workflowId = 0;
	this.m_yesNoController = null;
}

CPDocumentationBaseComponent.prototype = new CPMMPageComponent;
CPDocumentationBaseComponent.prototype.constructor = CPMMPageComponent;

CPDocumentationBaseComponent.prototype.getActivityDataModel = function() {
	return this.m_activityDataModel;
};

CPDocumentationBaseComponent.prototype.getBuilder = function() {
	return this.m_builder;
};

CPDocumentationBaseComponent.prototype.getConceptCKI = function() {
	return this.m_conceptCKI;
};

CPDocumentationBaseComponent.prototype.getCycleController = function() {
	return this.m_cycleController;
};

CPDocumentationBaseComponent.prototype.getDataModel = function() {
	return this.m_dataModel;
};

CPDocumentationBaseComponent.prototype.getDocDecorationsId = function() {
	return this.m_docDecorationsId;
};

CPDocumentationBaseComponent.prototype.getDocEventsId = function() {
	return this.m_docEventsId;
};

CPDocumentationBaseComponent.prototype.getDocumentationTimerName = function() {
	return this.m_documentationTimerName;
};

CPDocumentationBaseComponent.prototype.getDocumentEvents = function() {
	return this.m_documentEvents;
};

CPDocumentationBaseComponent.prototype.getDocVersion = function() {
	return this.m_docVersion;
};

CPDocumentationBaseComponent.prototype.getEventId = function() {
	return this.m_eventId;
};

CPDocumentationBaseComponent.prototype.getGroupController = function() {
	return this.m_groupController;
};

CPDocumentationBaseComponent.prototype.getInputController = function() {
	return this.m_inputController;
};

CPDocumentationBaseComponent.prototype.getLoadTimer = function() {
	return this.m_loadTimer;
};

CPDocumentationBaseComponent.prototype.getOrders = function() {
	return this.m_orders;
};

CPDocumentationBaseComponent.prototype.getPathwayDocEventId = function() {
	return this.m_pathwayDocEventId;
};

CPDocumentationBaseComponent.prototype.getRenderTimer = function() {
	return this.m_renderTimer;
};

CPDocumentationBaseComponent.prototype.getStructureDocClinIdent = function() {
	return this.m_structureDocClinIdent;
};

CPDocumentationBaseComponent.prototype.getTermDecoration = function() {
	return this.m_termDecoration;
};

CPDocumentationBaseComponent.prototype.getWorkflowComponentId = function() {
	return this.m_workflowComponentId;
};

CPDocumentationBaseComponent.prototype.getWorkflowId = function() {
	return this.m_workflowId;
};

CPDocumentationBaseComponent.prototype.getYesNoController = function() {
	return this.m_yesNoController;
};

CPDocumentationBaseComponent.prototype.setActivityDataModel = function(val) {
	this.m_activityDataModel = val;
};

CPDocumentationBaseComponent.prototype.setBuilder = function(val) {
	this.m_builder = val;
};

CPDocumentationBaseComponent.prototype.setConceptCKI = function(val) {
	this.m_conceptCKI = val;
};

CPDocumentationBaseComponent.prototype.setCycleController = function(val) {
	this.m_cycleController = val;
};

CPDocumentationBaseComponent.prototype.setDataModel = function(val) {
	this.m_dataModel = val;
};

CPDocumentationBaseComponent.prototype.setDocDecorationsId = function(val) {
	this.m_docDecorationsId = val;
};

CPDocumentationBaseComponent.prototype.setDocEventsId = function(val) {
	this.m_docEventsId = val;
};

CPDocumentationBaseComponent.prototype.setDocumentationTimerName = function(val) {
	this.m_documentationTimerName = val;
};

CPDocumentationBaseComponent.prototype.setDocumentEvents = function(val) {
	this.m_documentEvents = val;
};

CPDocumentationBaseComponent.prototype.setDocVersion = function(val) {
	this.m_docVersion = val;
};

CPDocumentationBaseComponent.prototype.setEventId = function(val) {
	this.m_eventId = val;
};

CPDocumentationBaseComponent.prototype.setGroupController = function(val) {
	this.m_groupController = val;
};

CPDocumentationBaseComponent.prototype.setInputController = function(val) {
	this.m_inputController = val;
};

CPDocumentationBaseComponent.prototype.setLoadTimer = function(val) {
	this.m_loadTimer = val;
};

CPDocumentationBaseComponent.prototype.setOrders = function(val) {
	this.m_orders = val;
};

CPDocumentationBaseComponent.prototype.setPathwayDocEventId = function(val) {
	this.m_pathwayDocEventId = val;
};

CPDocumentationBaseComponent.prototype.setRenderTimer = function(val) {
	this.m_renderTimer = val;
};

CPDocumentationBaseComponent.prototype.setStructureDocClinIdent = function(val) {
	this.m_structureDocClinIdent = val;
};

CPDocumentationBaseComponent.prototype.setTermDecoration = function(val) {
	this.m_termDecoration = val;
};

CPDocumentationBaseComponent.prototype.setWorkflowComponentId = function(val) {
	this.m_workflowComponentId = val;
	this.updateInErrorButton();
};

CPDocumentationBaseComponent.prototype.setWorkflowId = function(val) {
	this.m_workflowId = val;
};

CPDocumentationBaseComponent.prototype.setYesNoController = function(val) {
	this.m_yesNoController = val;
};

CPDocumentationBaseComponent.prototype.autoSave = function() {
	return this.saveStructuredSection(null, true, false);
};

CPDocumentationBaseComponent.prototype.checkPendingSR = function(pendingInd) {
	var srObj = MP_Resources.getSharedResource("pendingDataSR");
	var componentId = this.getComponentId();
	var dataObj, pendingArr, idx;

	if (!srObj) {
		return;
	}

	dataObj = srObj.getResourceData();
	pendingArr = dataObj.pendingDataCompArr;

	if (pendingInd) {
		if (pendingArr.join("|").indexOf(compId) === -1) {
			pendingArr.push(compId);
		}
	}
	else {
		idx = pendingArr.length;
		while (idx--) {
			if (compId === pendingArr[idx]) {
				pendingArr.splice(idx, 1);
				break;
			}
		}
	}

	dataObj.pendingDataObj.SetPendingData(dataObj.pendingDataCompArr.length === 0 ? 0 : 1);
	MP_Resources.setSharedResourceData("pendingDataSR", dataObj);
};

CPDocumentationBaseComponent.prototype.getStructuredTemplate = function(callBack) {
	var that = this;
	var structureDocClinIdent = that.getStructureDocClinIdent();
	var scriptRequest = new ScriptRequest();
	var structuredTemplateTimer = new RTMSTimer("ENG:" + that.getDocumentationTimerName() + " - get structure template", that.getCriterion().category_mean);

	scriptRequest.setProgramName("CP_LOAD_STRUCTURE_DOC");
	scriptRequest.setParameterArray(["^MINE^", "@" + structureDocClinIdent.length + ":" + structureDocClinIdent + "@", that.getDocEventsId() + ".0", that.getDocDecorationsId() + ".0"]);
	scriptRequest.setResponseHandler(function(response) {
		structuredTemplateTimer.stop();

		if (response.m_status === "S") {
			response = response.m_responseData;

			that.setDataModel({
				"SECTION" : response.section_ref[0]
			});
			if (response.document_events.json > "") {
				that.setDocumentEvents(JSON.parse(response.document_events.json.replace(/(\r\n|\n|\r)/gm, "")));
			}
			if (response.term_decorations.json > "") {
				that.setTermDecoration(JSON.parse(response.term_decorations.json.replace(/(\r\n|\n|\r)/gm, "")));
			}

			callBack(response);
		}
		else {
			that.finalizeComponent(that.generateScriptFailureHTML());
		}
	});

	// TODO - overriding because we're returning something different from the backend
	scriptRequest.generateStateChangeHandler = function() {
		var self = this;
		return function() {
			var loadTimer = self.getLoadTimer();
			var timersFailed = false;
			if (this.readyState !== 4) {
				return;
			}
			else {
				if (this.status !== 200) {
					self.logScriptExecutionError(this);
					timersFailed = true;
					if (loadTimer) {
						loadTimer.fail();
					}
					self.relinquishThread();
					self.releaseRequestReference(this);
					return;
				}
			}
			self.relinquishThread();
			self.releaseRequestReference(this);
			self.logCompletionInfo(this);
			try {
				var scriptReply = new ScriptReply();
				scriptReply.setName(self.getName());
				if (self.m_rawDataInd) {
					scriptReply.setResponse(this.responseText);
					scriptReply.setStatus("");
				}
				else {
					var responseObj = JSON.parse(this.responseText).record_data;
					var status = responseObj.status_data.status;

					scriptReply.setResponse(responseObj);
					scriptReply.setStatus(status);
					if ("S|s|Z|z".indexOf(status) < 0) {
						self.logScriptExecutionError(this);
						scriptReply.setError(self.createErrorMessage(this));
					}
				}
				self.handleDataResponse(scriptReply);
			}
			catch (err) {
				timersFailed = true;
				if (loadTimer) {
					loadTimer.fail();
				}
			}
			finally {
				if (loadTimer && !timersFailed) {
					loadTimer.stop();
				}
			}
		};
	};

	structuredTemplateTimer.start();
	scriptRequest.performRequest();
};

CPDocumentationBaseComponent.prototype.inErrorStructuredSection = function(statusCallback) {
	var that = this;
	var eventId = that.getEventId();
	var workflowComponentId = that.getWorkflowComponentId();
	var organizer = that.getBuilder().getStructureOrganizer();
	var scriptRequest = new ScriptRequest();
	var inErrorTimer = new RTMSTimer("ENG:" + that.getDocumentationTimerName() + " - in error structured doc", that.getCriterion().category_mean);

	if (eventId > 0 && workflowComponentId > 0) {
		scriptRequest.setProgramName("cp_inerr_structure_doc");
		scriptRequest.setParameterArray(["^MINE^", eventId.toFixed(2), workflowComponentId.toFixed(2)]);
		scriptRequest.setResponseHandler(function(reply) {
			var response = reply.getResponse();

			inErrorTimer.stop();

			if (reply.getStatus() === "S") {
				that.setEventId(0);
				that.setWorkflowComponentId(0);

				organizer.clear();
				that.resetDirty();

				if ( typeof statusCallback === "function") {
					statusCallback("S");
				}

				that.updateWorkflowResource();
				CPEventManager.notifyObservers("COMMIT_NODE_ACTION", {
					"CP_NODE_ID" : that.getNodeId(),
					"CP_COMPONENT_ID" : that.getCpComponentId(),
					"ACTION_DETAILS" : [{
						"PARENT_ENTITY_NAME" : "CLINICAL_EVENT",
						"PARENT_ENTITY_ID" : eventId,
						"ACTION_DETAIL_TYPE_MEAN" : "INERRORDOC"
					}]
				});
			}
			else {
				logger.logError("Failed to in error structured document.");

				if ( typeof statusCallback === 'function') {
					statusCallback("F");
				}
			}
		});

		inErrorTimer.start();
		scriptRequest.performRequest();
	}
};

CPDocumentationBaseComponent.prototype.initializeWorkflowInformation = function() {
	var that = this;
	var loadTimer = that.getLoadTimer();
	var criterion = that.getCriterion();
	var resource = MP_Resources.getSharedResource("documentationWorkflow");

	if (loadTimer) {
		loadTimer.start();
	}

	CERN_EventListener.addListener(that, 'documentationWorkflowAvailable', function(event, dataString) {
		that.processWorkflowInformation(event, dataString);
	}, that);

	if (resource) {
		// set event listener
		resource.setEventListenerFlag("documentationWorkflowAvailable");
		if (resource.isResourceAvailable()) {
			that.processWorkflowInformation(null, resource.getResourceData());
		}
		else {
			resource.retrieveSharedResourceData();
		}
	}
	else {
		resource = MP_Resources.createSharedResourceObj("documentationWorkflow", that, "MP_GET_WORKFLOW", ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0"], "documentationWorkflowAvailable");

		if (resource) {
			resource.retrieveSharedResourceData();
		}
	}
};

CPDocumentationBaseComponent.prototype.updateWorkflowResource = function() {
	var resource = MP_Resources.getSharedResource("documentationWorkflow");
	if (resource) {
		resource.retrieveSharedResourceData();
	}
	else {
		resource = MP_Resources.createSharedResourceObj("documentationWorkflow", that, "MP_GET_WORKFLOW", ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0"]);
		if (resource) {
			resource.retrieveSharedResourceData();
		}
	}
};

CPDocumentationBaseComponent.prototype.isStaleWorkflow = function() {
	var that = this;
	var isStale = true;
	var eventId = that.getEventId();
	var conceptCKI = that.getConceptCKI();
	var criterion = that.getCriterion();
	var scriptRequest = new ScriptRequest();
	var staleWorkflowTimer = new RTMSTimer("ENG:" + that.getDocumentationTimerName() + " - is stale workflow", criterion.category_mean);

	scriptRequest.setAsyncIndicator(false);
	scriptRequest.setProgramName("MP_GET_WORKFLOW");
	scriptRequest.setParameterArray(["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0"]);
	scriptRequest.setResponseHandler(function(reply) {
		if (reply.getStatus() === "S") {

			var response = reply.getResponse();
			var componentList, component, componentConceptCKI, componentEventId, x;

			if (response) {
				if (response.WORKFLOW_ID !== that.getWorkflowId()) {
					return;
				}

				componentList = response.COMPONENTS;

				for ( x = componentList.length; x--; ) {
					component = componentList[x];
					componentConceptCKI = component.CONCEPT_CKI;
					componentEventId = component.EVENT_ID;

					if (componentConceptCKI && (componentConceptCKI === conceptCKI)) {
						if (eventId !== componentEventId) {
							return;
						}
						break;
					}
				}

				isStale = false;
			}
		}
		else {
			logger.logError("No workflow information was found.");
		}
	});

	staleWorkflowTimer.start();
	scriptRequest.performRequest();
	staleWorkflowTimer.stop();

	return isStale;
};

CPDocumentationBaseComponent.prototype.openExistingStructuredSection = function(callback) {
	var that = this;
	var docEventsId = that.getDocEventsId();
	var docDecorationsId = that.getDocDecorationsId();
	var eventId = that.getPathwayDocEventId();
	var scriptRequest = new ScriptRequest();
	var openStructuredTimer = new RTMSTimer("ENG:" + that.getDocumentationTimerName() + " - open existing structure", that.getCriterion().category_mean);
	var criterion = that.getCriterion();

	if (!eventId) {
		eventId = that.getEventId();
	}
	scriptRequest.setProgramName("cp_open_exist_struct_doc");
	scriptRequest.setParameterArray(["^MINE^", "^CLINICAL_EVENT^", eventId + ".0", docEventsId + ".0", docDecorationsId + ".0"]);
	scriptRequest.setResponseHandler(function(reply) {
		var response = reply.getResponse();

		openStructuredTimer.stop();

		if (reply.getStatus() !== "S") {
			that.finalizeComponent(that.generateScriptFailureHTML());
			logger.logError("Unable to open existing structured section.");
		}
		else {
			if (response.REFERENCE_JSON) {
				that.setDataModel({
					"SECTION" : JSON.parse(response.REFERENCE_JSON).reference.section[0]
				});
			}

			if (response.ACTIVITY_JSON) {
				that.setActivityDataModel({
					"SECTION" : JSON.parse(response.ACTIVITY_JSON).activity.section_act
				});
			}

			if (response.DOCUMENT_EVENTS.JSON > "") {
				that.setDocumentEvents(JSON.parse(response.DOCUMENT_EVENTS.JSON.replace(/(\r\n|\n|\r)/gm, "")));
			}

			if (response.TERM_DECORATIONS.JSON > "") {
				that.setTermDecoration(JSON.parse(response.TERM_DECORATIONS.JSON.replace(/(\r\n|\n|\r)/gm, "")));
			}

			that.resetDirty();
			callback(response);
		}
	});

	openStructuredTimer.start();
	scriptRequest.performRequest();
};

CPDocumentationBaseComponent.prototype.preProcessing = function() {
	this.setBuilder(new JSONStructureOrganizerBuilder());
	this.setCycleController(new CycleStructureTermController());
	this.setInputController(new InputStructureTermController());
	this.setGroupController(new StructureGroupController());
	this.setYesNoController(new YesNoStructureTermController());
};

CPDocumentationBaseComponent.prototype.processWorkflowInformation = function(event, dataString) {
	var that = this;
	var data;
	var callback = function(scriptResponse) {
		var conceptCKI = scriptResponse.CONCEPT_CKI || scriptResponse.concept_cki;
		var pathwayId = that.getPathwayId();
		var nodeId = that.getNodeId();
		var componentList, component, x;

		that.setConceptCKI(conceptCKI);

		if (data) {
			that.setWorkflowComponentId(0);
			that.setWorkflowId(data.WORKFLOW_ID);
			componentList = data.COMPONENTS;

			for ( x = componentList.length; x--; ) {
				component = componentList[x];

				if ((component.CONCEPT_CKI && (component.CONCEPT_CKI === conceptCKI))) {
					that.setEventId(component.EVENT_ID);
					that.setWorkflowComponentId(component.COMPONENT_ID);
				}
			}
		}

		CPEventManager.getNodeBehaviors({
			"PATHWAY_ID" : pathwayId,
			"NODE_ID" : nodeId,
			"RESPONSE_IDENT" : null
		}, function() {
			var loadTimer = that.getLoadTimer();

			if (loadTimer) {
				loadTimer.stop();
			}

			that.renderComponent();

		});
	};

	if (dataString) {
		data = JSON.parse(dataString);

		if (data) {
			data = data.RECORD_DATA;
		}
	}

	if (that.getPathwayDocEventId() > 0) {
		that.openExistingStructuredSection(callback);
	}
	else {
		that.getStructuredTemplate(callback);
	}
};

CPDocumentationBaseComponent.prototype.renderComponent = function() {
	var that = this;
	var nodeId = that.getNodeId();
	var dataModel = that.getDataModel();
	var activityDataModel = that.getActivityDataModel();
	var builder = that.getBuilder();
	var cycleController = that.getCycleController();
	var inputController = that.getInputController();
	var groupController = that.getGroupController();
	var yesNoController = that.getYesNoController();
	var sectionContentNode = $(that.getSectionContentNode());
	var renderTimer = that.getRenderTimer();
	var organizer = builder.getStructureOrganizer();
	var docContentNode, buttonContainerNode, leftButtonNode, rightButtonNode;

	renderTimer.start();

	if (dataModel && dataModel.hasOwnProperty("SECTION")) {
		var section = dataModel.SECTION;
		var docEventManager = eventManagers.findManager(nodeId);
		var documentEventsId = 0;
		var termDecorationId = 0;
		var itemGroups = [];
		var termGroups = [];
		var terms = [];
		var scriptRequest, structureOrganizer, lookup, item, log, x, y, i, j;
		var saveButtonElement = $("<input class='pw-button pw-save-doc-button' type='button' value='" + i18n.innovations.pathways_shared.SAVE + "' />");
		var inErrorButtonElement = $("<input class='pw-button pw-in-error-button' type='button' value='" + i18n.innovations.pathways_shared.IN_ERROR + "' />");

		if (docEventManager == undefined) {
			docEventManager = new DocEventManager(nodeId);
			docEventManager.prototype = DocEventManager;
			docEventManager.setPathwayId(that.getPathwayId());
			docEventManager.setNodeId(nodeId);
			docEventManager.setCriterion(this.getCriterion());

			docEventManager.setSuggestions({
				"ORDERS" : JSON.parse(JSON.stringify(that.getOrders())),
				"NODES" : JSON.parse(JSON.stringify(CERN_PATHWAYS_SHARED_O1.GetTreatmentNodes(that)))
			});

			docEventManager.setDocEvents(that.getDocumentEvents());
			docEventManager.setDecoration(that.getTermDecoration());
		}

		builder.setNamespace(String(nodeId));
		builder.setStructureJSON(section);
		builder.startNewStructureOrganizer();

		structureOrganizer = builder.buildStructureTree();

		if ( typeof structureOrganizer.setIsPriorityEnabled === 'function') {
			structureOrganizer.setIsPriorityEnabled(false);
		}

		structureOrganizer.render = function(structureHtml) {
			var children = this.getChildren();
			var childrenCount = children.length;
			var namespace = this.m_namespace;
			var child = null;
			var childId = "";
			var tabDisplay = "";
			var id = this.getId();
			if (this.m_isMultiSection) {
				structureHtml.append("<div id='" + namespace + ":parentOrganizer:ROOT:" + this.getId() + "' class='structure-organizer-parent structure-multi-section'>");
				structureHtml.append("<div id='" + namespace + "StructureTabParent' class='structure-tab-parent'>");
				structureHtml.append("<div id='" + namespace + "StructureTabBlock' class='structure-tab-block'>");
				structureHtml.append("<div id='" + namespace + "StructureTabGroupWrapper' class='structure-tab-wrapper'>");
				structureHtml.append("<ul id='" + namespace + "StructureTabGroup' class='structure-tab-group'>");
				for (var i = 0; i < childrenCount; i++) {
					child = children[i];
					childId = child.getId();
					structureHtml.append("<li class='structure-tab'><span id='" + namespace + ":tab:" + childId + "' data-lookup='" + childId + "' class='structure-tab-display" + ((i === 0) ? " structure-tab-active" : "") + "' title='" + child.getTitle().replace(":", "") + "'>" + child.getTitle().replace(":", "") + "</span></li>");
				}
				structureHtml.append("</ul></div><li id='" + namespace + "StructureTabMenuButton' class='structure-tab structure-add-tab'><span>&nbsp;</span></li></div><div class='structure-tab-bottom'></div></div>");
				structureHtml.append("<div id='" + namespace + "StructureTabContents' class='structure-tab-contents'>");
				for (var i = 0; i < childrenCount; i++) {
					if (i > 0) {
						tabDisplay = "style='display:none;'";
					}
					structureHtml.append("<div id='" + namespace + ":tabContent:" + children[i].getId() + "' class='structure-tab-content' " + tabDisplay + ">");
					if (i === 0) {
						children[i].render(structureHtml, false);
						children[i].setIsRendered(true);
					}
					structureHtml.append("</div>");
				}
				structureHtml.append("</div>");
				structureHtml.append("</div>");
			}
			else {
				structureHtml.append("<div id='" + namespace + ":organizer:ROOT:" + id + "' class='structure-organizer' data-lookup='" + id + "'><div id='" + namespace + ":navigatorPanel:" + id + "' class='structure-navigator-panel'><div class='structure-navigator-label'>" + i18n.discernabu.mpage_structured_documentation.NAVIGATION + "</div>" + this.getNavigator().render() + "</div><div id='" + namespace + ":organizer:CONTENT:" + id + "' class='structure-body structure-section-body' data-lookup='" + id + "'>");
				for (var i = 0; i < childrenCount; i++) {
					children[i].render(structureHtml, false);
				}
				structureHtml.append("<div id='" + namespace + ":structureHeightAdjust:" + id + "' class='structure-height-adjust'></div></div></div>");
			}
			return structureHtml.getHtml();
		};

		docEventManager.setStructureOrganizer(structureOrganizer);

		//that.finalizeComponent("<div class='pw-tab-container'><span class='pw-tab-doc'><span class='pw-secondary-tab-left'></span><span
		// class='pw-secondary-tab-body'><span class='pw-tab-text'>" + i18n.innovations.pathways_shared.DOCUMENTATION + "</span></span><span
		// class='pw-secondary-tab-right'></span></span><span class='pw-tab-trail'><span class='pw-secondary-tab-left'></span><span
		// class='pw-secondary-tab-body'><span class='pw-tab-text'>" + i18n.innovations.pathways_shared.SESSION_TRAIL + "</span></span><span
		// class='pw-secondary-tab-right'></span></span></div><div class='pw-tab-divider'></div><div class='pw-tab-content-container'><div
		// class='pw-doc-content'></div><div class='pw-trail-content'><span class='pw-disabled-text'>" +
		// i18n.innovations.pathways_shared.NO_ACTIONS_TAKEN + "</span></div></div>");
		//sectionContentNode.find(".pw-tab-doc").click();

		that.finalizeComponent("<div class='pw-doc-content'></div>");

		docContentNode = sectionContentNode.find(".pw-doc-content");
		docContentNode.empty().html(structureOrganizer.renderHtml());

		inErrorButtonElement.hide();

		inErrorButtonElement.click(function(e) {
			that.inErrorStructuredSection();
		});

		saveButtonElement.click(function(e) {
			that.saveStructuredSection();
		});

		buttonContainerNode = $("<div class='pw-doc-button-container'></div>");
		leftButtonNode = $("<span class='pw-doc-button-left'></span>");
		rightButtonNode = $("<span class='pw-doc-button-right'></span>");

		leftButtonNode.append(inErrorButtonElement);
		rightButtonNode.append(saveButtonElement);
		buttonContainerNode.append(leftButtonNode, rightButtonNode);
		docContentNode.append(buttonContainerNode);

		structureOrganizer.finalize();

		cycleController.attach(structureOrganizer);
		inputController.attach(structureOrganizer);
		groupController.attach(structureOrganizer);
		yesNoController.attach(structureOrganizer);

		structureOrganizer.getNavigatorElement().find(".structure-navigator-button:first").click();

		lookup = structureOrganizer.getLookup();

		for (x in lookup) {
			item = lookup[x];

			if ( item instanceof StructureItemGroup || item instanceof StructureTermGroup) {
				item.setShouldRender(false);

				if ( item instanceof StructureItemGroup) {
					itemGroups.push(item);
				}

				if ( item instanceof StructureTermGroup) {
					termGroups.push(item);
				}
			}
			else {
				if (!( item instanceof StructureGroup)) {
					terms.push(item);
				}
			}
		}

		docEventManager.setItemGroups(itemGroups);
		docEventManager.setTermGroups(termGroups);
		docEventManager.setTerms(terms);
		docEventManager.setLoggingEnabled(true);
		docEventManager.init();
		docEventManager.setLoggingEnabled(false);

		if (activityDataModel && activityDataModel != null) {
			builder.update(structureOrganizer, activityDataModel.SECTION);
			docEventManager.updateActivityLog(activityDataModel.SECTION);
			that.updateInErrorButton();
		}

		that.updateSaveButton();

		docEventManager.setInitialized(true);
		docEventManager.setLoggingEnabled(true);
	}
	else {
		that.finalizeComponent(that.generateScriptFailureHTML());
	}

	renderTimer.stop();
};

CPDocumentationBaseComponent.prototype.resetDirty = function() {
	this.checkPendingSR(false);
};

CPDocumentationBaseComponent.prototype.retrieveComponentData = function() {
	var that = this;
	var criterion = that.getCriterion();
	var intentionMean = that.getIntentionMean();
	var pathwayId = that.getPathwayId();
	var nodeId = that.getNodeId();
	var rootComponentNode = $(that.getRootComponentNode());
	var loadTimer = new RTMSTimer("USR:" + that.getDocumentationTimerName() + " - load component");
	var renderTimer = new RTMSTimer("ENG:" + that.getDocumentationTimerName() + " - render component");

	loadTimer.addMetaData("pathwayId", pathwayId);
	loadTimer.addMetaData("nodeId", nodeId);
	renderTimer.addMetaData("pathwayId", pathwayId);
	renderTimer.addMetaData("nodeId", nodeId);

	that.setLoadTimer(loadTimer);
	that.setRenderTimer(renderTimer);

	/*switch(intentionMean) {
	 case "ASSESSMENT" :
	 that.setConceptCKI("CERNER!A644D679-CA40-4EBB-9DC7-48A2CA38C2DE");
	 break;
	 case "TREATMENTS" :
	 that.setConceptCKI("CERNER!6D372A37-5646-48A5-BDC9-8EF41FD4D17C");
	 break;
	 }*/

	rootComponentNode.delegate(".pw-tab-doc, .pw-tab-trail", "click", function(e) {
		var element = $(this);

		if (!element.hasClass("pw-tab-active")) {
			var tabContainer = element.parent();
			var tabContentContainer = tabContainer.siblings(".pw-tab-content-container");
			var content;

			element.siblings().removeClass("pw-tab-active").addClass("pw-tab-inactive");
			element.removeClass("pw-tab-inactive").addClass("pw-tab-active");

			if (element.hasClass("pw-tab-doc")) {
				content = tabContentContainer.children(".pw-doc-content");
			}
			else if (element.hasClass("pw-tab-trail")) {
				content = tabContentContainer.children(".pw-trail-content");
			}

			tabContentContainer.children().hide();
			content.show();
		}
	});

	CPEventManager.addObserver("ACTIVITY_LOG_UPDATE", function(docEventManager) {
		if (docEventManager.getNodeId() === nodeId) {
			var activityLog = docEventManager.getActivityLog();
			var trailContentNode = rootComponentNode.find(".pw-trail-content");
			var df = MP_Util.GetDateFormatter();
			var html = "";
			var activities = [];
			var x, y;

			var generateLogText = function(item) {
				return "<div>" + item.TERM_DISPLAY + "&nbsp;<span class='pw-bold-text'>" + (item.TERM_STATE == 1 ? i18n.innovations.pathways_shared.YES_SHORT : (item.TERM_STATE == 2 ? i18n.innovations.pathways_shared.NO_SHORT : "-")) + "</span>&nbsp;<span class='pw-disabled-text'>" + item.TIMESTAMP + "&nbsp;" + myName + "</span></div>";
			};

			for ( x = 0, y = activityLog.length; x < y; x++) {
				if (activityLog[x].NEW) {
					activities.push(activityLog[x]);
				}
			}

			if (activities.length === 0) {
				html = "<span class='pw-disabled-text'>" + i18n.innovations.pathways_shared.NO_ACTIONS_TAKEN + "</span>";
			}
			else {
				for ( x = 0, y = activities.length; x < y; x++) {
					html += generateLogText(activities[x]);
				}
			}

			trailContentNode.html(html);

			that.updateSaveButton();
		}
	});

	CPEventManager.addObserver("IN_ERROR_DOC", function(id) {
		if (nodeId === id) {
			that.inErrorStructuredSection();
		}
	});

	CPEventManager.addObserver("TRIGGER_AUTO_SAVE", function() {
		that.saveStructuredSection(null, true, true);
	});

	CPEventManager.addObserver("CP_STOP_PATHWAY", function(id) {
		if (pathwayId === id) {
			eventManagers.removeManager(nodeId);
		}
	});

	switch (intentionMean) {
		case "ASSESSMENT":
			(function() {
				var pathway = PathwaysModel.getPathwayFromNodeId(nodeId);
				var x;

				for ( x = pathway.NODE_LIST.length; x--; ) {
					if (pathway.NODE_LIST[x].CP_NODE_ID == nodeId) {
						rootComponentNode.find(".comp-title").html(pathway.NODE_LIST[x].NODE_NAME);
						break;
					}
				}
			})();

			break;
		case "TREATMENTS":
			rootComponentNode.find(".comp-title").html(i18n.innovations.cp_documentation_base.CRITERIA);
			break;
	}

	that.initializeWorkflowInformation();
};

CPDocumentationBaseComponent.prototype.saveStructuredSection = function(statusCallback, autoSaveInd, commitInd) {
	var that = this;
	var docI18n = i18n.discernabu.documentation_base;
	var sectionContentNode = $(that.getSectionContentNode());
	var saveButton = sectionContentNode.find(".pw-save-doc-button");
	var isStale;

	commitInd = commitInd || true;
	saveButton.val(i18n.innovations.pathways_shared.SAVING).prop("disabled", true);

	window.setTimeout(function() {
		isStale = that.isStaleWorkflow();

		if (isStale) {
			if (!autoSaveInd) {
				MP_Util.AlertConfirm(docI18n.REFRESH_REQUIRED_MSG, docI18n.REFRESH_REQUIRED_TITLE, i18n.discernabu.CONFIRM_OK, null, false, null);
				sectionContentNode.find(".pw-save-doc-button").val(i18n.innovations.pathways_shared.SAVE).prop("disabled", true);
				that.setLastSaveText(null);
			}
			else {
				CPEventManager.notifyObservers("UPDATE_TRAIL");
			}
			return;
		}
		else {
			var nodeId = that.getNodeId();
			var docEventManager = eventManagers.findManager(nodeId);
			var commitNodeAction = null;

			if (docEventManager) {
				var activityLog = docEventManager.getActivityLog();
				var newActivities = [];

				for ( x = 0, y = activityLog.length; x < y; x++) {
					if (activityLog[x].NEW) {
						newActivities.push(activityLog[x]);
					}
				}

				if (newActivities.length > 0) {
					var eventId = that.getEventId();
					var docVersion = that.getDocVersion();
					var criterion = that.getCriterion();
					var organizer = that.getBuilder().getStructureOrganizer();
					var conceptCKI = that.getConceptCKI();
					var scriptRequest = new ScriptRequest();
					var saveStructuredTimer = new RTMSTimer("ENG:" + that.getDocumentationTimerName() + " - save structure section", that.getCriterion().category_mean);
					var organizerJSON, dataBlob;

					var sortAttributes = function(dataModel) {
						var groupBys = [];
						var section, groupBy, item, attribute, attributeMenuItem, z, x, y, i, j;

						var findIndex = function(source, type, val) {
							var index = -1;
							var key, x;

							switch (type) {
								case "GROUPBY":
									key = "dd_groupby_id";
									break;
								default:
									key = "ocid";
									break;
							}

							for ( x = source.length; x--; ) {
								if (source[x][key] == val) {
									index = x;
									break;
								}
							}

							return index;
						};

						dataModel = JSON.parse("{" + dataModel + "}");

						section = dataModel.section_act;

						if (eventId === 0) {
							section.dd_section_id = 0;
						}

						if (section.hasOwnProperty("groupbys")) {
							for ( z = activityLog.length; z--; ) {
								for ( x = section.groupbys.length; x--; ) {
									groupBy = JSON.parse(JSON.stringify(section.groupbys[x]));
									groupBy.items = [];

									if (eventId === 0) {
										groupBy.dd_groupby_id = 0;
									}

									for ( y = section.groupbys[x].items.length; y--; ) {
										item = JSON.parse(JSON.stringify(section.groupbys[x].items[y]));
										item.attributes = [];

										if (eventId === 0) {
											item.dd_item_id = 0;
										}
										for ( i = section.groupbys[x].items[y].attributes.length; i--; ) {
											attribute = JSON.parse(JSON.stringify(section.groupbys[x].items[y].attributes[i]));
											attribute.attribute_menu_items = [];

											if (eventId === 0) {
												attribute.dd_attribute_id = 0;
											}
											for ( j = section.groupbys[x].items[y].attributes[i].attribute_menu_items.length; j--; ) {
												attributeMenuItem = section.groupbys[x].items[y].attributes[i].attribute_menu_items[j];

												if (eventId === 0) {
													attributeMenuItem.dd_attr_menu_item_id = 0;
												}
												if (activityLog[z].TERM_OCID == attributeMenuItem.ocid) {
													groupByIndex = findIndex(groupBys, "GROUPBY", groupBy.dd_groupby_id);

													if (groupByIndex === -1) {
														groupByIndex = groupBys.length;
														groupBys.push(groupBy);
													}

													itemIndex = findIndex(groupBys[groupByIndex].items, "ITEM", item.ocid);

													if (itemIndex === -1) {
														itemIndex = groupBys[groupByIndex].items.length;
														groupBys[groupByIndex].items.push(item);
													}

													attributeIndex = findIndex(groupBys[groupByIndex].items[itemIndex].attributes, "ATTRIBUTE", attribute.ocid);

													if (attributeIndex === -1) {
														attributeIndex = groupBys[groupByIndex].items[itemIndex].attributes.length;
														groupBys[groupByIndex].items[itemIndex].attributes.push(attribute);
													}

													groupBys[groupByIndex].items[itemIndex].attributes[attributeIndex].attribute_menu_items.push(attributeMenuItem);
												}
											}
										}
									}
								}
							}

							section.groupbys = groupBys;
						}

						return dataModel;
					};

					organizer.convertToJSON = function() {
						var saveJSON = [];
						saveJSON.push('"section_act": {');
						var sectionJson = [];
						sectionJson.push('"dd_section_id": ' + this.getActivityId() + ".0");
						sectionJson.push('"dd_sref_section_id": ' + this.getReferenceSectionId() + ".0");
						var templateRelations = this.getTemplateRelations() || [];
						var templateRelationJSON = [];

						/*for (var i = 0; i < templateRelations.length; i++) {
						 templateRelationJSON.push('{"dd_sref_templ_instance_ident": "' + templateRelations[i].dd_sref_templ_instance_ident + '"}');
						 }*/

						templateRelationJSON.push('{"dd_sref_templ_instance_ident": "' + that.getStructureDocClinIdent() + '"}');

						sectionJson.push('"template_rltns": [' + templateRelationJSON.join(",") + "]");
						this.addChildrenJSON(sectionJson);
						if (this.getType() === "subsections") {
							sectionJson.push('"parent_section_id": ' + this.getParent().getActivityId() + ".0");
							return "{" + sectionJson.join(",") + "}";
						}
						saveJSON.push(sectionJson.join(","));
						saveJSON.push("}");
						return saveJSON.join("");
					};

					organizerJSON = JSON.stringify(sortAttributes(organizer.convertToJSON()));
					organizerJSON = organizerJSON.substring(1, organizerJSON.length - 1);

					dataBlob = '{"ACTIVITY": {' + ['"PARENT_ENTITY_ID" : ' + eventId + '.0', '"PARENT_ENTITY_NAME" : "CLINICAL_EVENT"', '"PARENT_ENTITY_VERSION" : ' + docVersion, '"TOP_FREETEXT" : ' + '"<div><span>&nbsp;</span></div>"', organizerJSON, '"BOTTOM_FREETEXT" : ' + '"<div><span>&nbsp;</span></div>"'].join(",") + '}}';

					if (!CERN_Platform.inMillenniumContext()) {
						dataBlob = dataBlob.replace(/\u200b/g, "");
						dataBlob = encodeURIComponent(dataBlob);
					}

					scriptRequest.setAsyncIndicator(!commitInd);
					scriptRequest.setProgramName("cp_save_structured_section");
					scriptRequest.setParameterArray(["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", criterion.provider_id + ".0", that.getWorkflowId() + ".0", criterion.ppr_cd + ".0", "^" + conceptCKI + "^", "~~"]);
					scriptRequest.setDataBlob(dataBlob);
					scriptRequest.setResponseHandler(function(response) {
						saveStructuredTimer.stop();

						/*
						 (function() {
						 var activityLogString = "{\\\"ACTION_LOG\\\":{\\\"ACTIONS\\\" : [";

						 commitNodeAction = {
						 "CP_NODE_ID" : nodeId,
						 "CP_COMPONENT_ID" : that.getCpComponentId(),
						 "ACTION_DETAILS" : []
						 };

						 for ( x = 0, y = newActivities.length; x < y; x++) {
						 activityLogString += "{";
						 activityLogString += "\\\"TERM_DISPLAY\\\":\\\"" + newActivities[x].TERM_DISPLAY + "\\\",";
						 activityLogString += "\\\"TERM_OCID\\\":\\\"" + newActivities[x].TERM_OCID + "\\\",";
						 activityLogString += "\\\"TERM_STATE\\\":\\\"" + newActivities[x].TERM_STATE + "\\\",";
						 activityLogString += "\\\"TIMESTAMP\\\":\\\"" + newActivities[x].TIMESTAMP + "\\\"";
						 activityLogString += "}";

						 if (x < y - 1) {
						 activityLogString += ",";
						 }
						 }

						 activityLogString += "]}}";

						 commitNodeAction.ACTION_DETAILS.push({
						 "PARENT_ENTITY_NAME" : "LONG_TEXT",
						 "PARENT_ENTITY_ID" : 0,
						 "PARENT_ENTITY_TEXT" : activityLogString,
						 "ACTION_DETAIL_TYPE_MEAN" : "TRAILJSON"
						 });

						 if (commitInd) {
						 CPEventManager.notifyObservers("COMMIT_NODE_ACTION", commitNodeAction);
						 }

						 that.updateSaveButton();
						 })();
						 */

						if (response.m_status === "S") {
							var df = MP_Util.GetDateFormatter();
							var responseJSON, eventId, activityLogString, x, y;

							for ( x = 0, y = activityLog.length; x < y; x++) {
								if (activityLog[x].NEW) {
									activityLog[x].ORIG_STATE = activityLog[x].TERM_STATE;
									activityLog[x].NEW = 0;
								}
							}

							that.updateSaveButton();

							response = response.m_responseData;
							responseJSON = JSON.parse(response.REPLY_JSON);
							eventId = parseFloat(responseJSON.parent_entity_id);

							that.setEventId(eventId);

							that.setDocVersion(parseInt(responseJSON.parent_entity_version, 10));

							that.resetDirty();
							that.setLastSaveText(docI18n.LAST_SAVE + df.format(new Date(), mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR));

							commitNodeAction = {
								"CP_NODE_ID" : nodeId,
								"CP_COMPONENT_ID" : that.getCpComponentId(),
								"ACTION_DETAILS" : [{
									"PARENT_ENTITY_NAME" : "CLINICAL_EVENT",
									"PARENT_ENTITY_ID" : eventId,
									"ACTION_DETAIL_TYPE_MEAN" : "SAVEDOC"
								}]
							};

							for ( x = response.COMPONENTS.length; x--; ) {
								component = response.COMPONENTS[x];

								if (component.CONCEPT_CKI && (component.CONCEPT_CKI === conceptCKI)) {
									that.setWorkflowComponentId(component.COMPONENT_ID);
								}
							}

							if ( typeof statusCallback === "function") {
								statusCallback("S");
							}

							activityLogString = "{\\\"ACTION_LOG\\\":{\\\"ACTIONS\\\" : [";

							for ( x = 0, y = newActivities.length; x < y; x++) {
								activityLogString += "{";
								activityLogString += "\\\"TERM_DISPLAY\\\":\\\"" + newActivities[x].TERM_DISPLAY + "\\\",";
								activityLogString += "\\\"TERM_OCID\\\":\\\"" + newActivities[x].TERM_OCID + "\\\",";
								activityLogString += "\\\"TERM_STATE\\\":\\\"" + newActivities[x].TERM_STATE + "\\\",";
								activityLogString += "\\\"TIMESTAMP\\\":\\\"" + newActivities[x].TIMESTAMP + "\\\"";
								activityLogString += "}";

								if (x < y - 1) {
									activityLogString += ",";
								}
							}

							activityLogString += "]}}";

							if (!CERN_Platform.inMillenniumContext()) {
								activityLogString = activityLogString.replace(/&/g, i18n.innovations.pathways_shared.AND);
							}

							commitNodeAction.ACTION_DETAILS.push({
								"PARENT_ENTITY_NAME" : "LONG_TEXT",
								"PARENT_ENTITY_ID" : 0,
								"PARENT_ENTITY_TEXT" : activityLogString,
								"ACTION_DETAIL_TYPE_MEAN" : "TRAILJSON"
							});

							if (commitInd) {
								CPEventManager.notifyObservers("COMMIT_NODE_ACTION", commitNodeAction);
							}
						}
						else {
							if (!autoSaveInd) {
								that.updateSaveButton();
								MP_Util.AlertConfirm(i18n.innovations.pathways_shared.SAVE_ERROR_TEXT, i18n.innovations.pathways_shared.SAVE_ERROR_TITLE, i18n.discernabu.CONFIRM_OK, null, false, null);
							}

							that.setLastSaveText(docI18n.SAVE_FAILED_MSG);
							if ( typeof statusCallback === "function") {
								statusCallback("F");
							}
						}
					});

					if (!CERN_Platform.inMillenniumContext()) {
						scriptRequest.execute = function() {
							var dataBlob = this.getDataBlob();
							var parameterArray = this.getParameterArray();
							var programName = this.getProgramName();
							var request = new XMLHttpRequest();

							if (!this.m_validEntry) {
								throw new Error("ScriptRequest.execute: The execute function should not be called directly.  Please utilize the performRequest function for starting data requests.");
							}

							this.validateScriptRequestFields();

							request.onreadystatechange = this.generateStateChangeHandler();
							request.open("POST", programName, this.m_asyncInd);
							request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
							request.send("parameters=" + parameterArray.join(",") + "&blobIn=" + dataBlob);
						};
					}

					saveStructuredTimer.start();
					scriptRequest.performRequest();
				}
				else {
					that.updateSaveButton();
					CPEventManager.notifyObservers("UPDATE_TRAIL");
				}
			}
			else {
				CPEventManager.notifyObservers("UPDATE_TRAIL");
			}

			if (!commitInd) {
				return commitNodeAction;
			}
		}
	});
};

CPDocumentationBaseComponent.prototype.setDirty = function() {
	this.checkPendingSR(true);
};

// TODO - not sure how much use this sees.
CPDocumentationBaseComponent.prototype.setLastSaveText = function(lastSaveText) {
	var lastSavedElement = $(this.getSectionContentNode()).find('.cke .last-saved-text');
	var view = this.m_structureView;
	var organizer = view ? view.getOrganizer() : null;

	if (lastSavedElement.length === 0) {
		$(this.getSectionContentNode()).find('.cke .autosave.save').after('<div class="last-saved-text">' + ( lastSaveText ? lastSaveText : "&nbsp;") + '</div>');
	}
	else {
		$(this.getSectionContentNode()).find('.cke .last-saved-text').html(( lastSaveText ? lastSaveText : "&nbsp;"));
	}

	if (organizer) {
		$("#" + view.getNamespace() + "\\:" + view.getId() + "\\:footer" + " .structure-last-saved-text").html(lastSaveText);
	}
};

CPDocumentationBaseComponent.prototype.updateInErrorButton = function() {
	var workflowComponentId = 0;
	//this.getWorkflowComponentId();
	var inErrorButton = $(this.getSectionContentNode()).find(".pw-in-error-button");

	if (workflowComponentId > 0) {
		inErrorButton.show();
	}
	else {
		inErrorButton.hide();
	}
};

CPDocumentationBaseComponent.prototype.updateSaveButton = function() {
	var docEventManager = eventManagers.findManager(this.getNodeId());

	if (docEventManager) {
		$(this.getSectionContentNode()).find(".pw-save-doc-button").val(i18n.innovations.pathways_shared.SAVE).prop("disabled", !docEventManager.checkIsStale());
	}
};
